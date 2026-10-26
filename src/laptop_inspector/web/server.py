"""Local HTTP server and REST API for the Laptop Buyer Kit dashboard."""
from __future__ import annotations

import json
import mimetypes
import os
import sys
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

from ..analysis import analyze_snapshot
from ..collectors.linux import LinuxCollector
from ..db import Database, DEFAULT_DB_PATH
from ..report import to_html, to_json

STATIC_DIR = Path(__file__).parent / "static"


class InspectorRequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler serving the dashboard SPA and local JSON REST APIs."""

    def __init__(self, *args: Any, db: Database | None = None, **kwargs: Any) -> None:
        self.db = db or Database(DEFAULT_DB_PATH)
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def _send_json(self, data: Any, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()
        self.wfile.write(body)

    def _send_error_json(self, message: str, status: HTTPStatus = HTTPStatus.BAD_REQUEST) -> None:
        self._send_json({"error": message, "status": status.value}, status=status)

    def _read_body_json(self) -> dict[str, Any] | None:
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0:
                return {}
            raw = self.rfile.read(length).decode("utf-8")
            return json.loads(raw)
        except (ValueError, json.JSONDecodeError):
            return None

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "/api/health":
            self._send_json({
                "status": "healthy",
                "application": "Laptop Buyer Kit",
                "version": "2.0.0",
                "offline_mode": True,
            })
            return

        if path == "/api/probe":
            try:
                collector = LinuxCollector()
                specs = collector.probe_host_specs()
                self._send_json(specs)
            except Exception as exc:
                self._send_error_json(f"Hardware probe failed: {exc}", HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if path == "/api/sessions":
            sessions = self.db.list_sessions(limit=100)
            self._send_json({"sessions": sessions})
            return

        if path.startswith("/api/sessions/"):
            session_id = path[len("/api/sessions/"):]
            session = self.db.get_session(session_id)
            if not session:
                self._send_error_json("Session not found", HTTPStatus.NOT_FOUND)
                return
            self._send_json(session)
            return

        if path.startswith("/api/export/"):
            parts = path.strip("/").split("/")
            # format: /api/export/<id>/<html|json>
            if len(parts) == 4 and parts[3] in ("html", "json"):
                session_id = parts[2]
                export_format = parts[3]
                session = self.db.get_session(session_id)
                if not session:
                    self._send_error_json("Session not found", HTTPStatus.NOT_FOUND)
                    return
                report = session["report"]
                if export_format == "html":
                    content = to_html(report).encode("utf-8")
                    mime = "text/html; charset=utf-8"
                else:
                    content = to_json(report).encode("utf-8")
                    mime = "application/json; charset=utf-8"

                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", mime)
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Content-Disposition", f'attachment; filename="report-{session_id}.{export_format}"')
                self.end_headers()
                self.wfile.write(content)
                return

        # Serve static assets or fallback to index.html for SPA
        file_path = STATIC_DIR / parsed.path.lstrip("/")
        if file_path.is_file():
            super().do_GET()
        else:
            # Fallback to index.html
            index_file = STATIC_DIR / "index.html"
            if index_file.is_file():
                content = index_file.read_bytes()
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(HTTPStatus.NOT_FOUND, "Static index file not found")

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        body = self._read_body_json()
        if body is None:
            self._send_error_json("Invalid JSON payload", HTTPStatus.BAD_REQUEST)
            return

        if path == "/api/inspect/live":
            claims = body.get("claims") or {}
            operator_notes = body.get("operator_notes")

            try:
                collector = LinuxCollector()
                snapshot = collector.collect_snapshot(claims=claims)
                report = analyze_snapshot(snapshot)
                session_id = self.db.save_session(snapshot, report, operator_notes=operator_notes)
                full_record = self.db.get_session(session_id)
                self._send_json(full_record, status=HTTPStatus.CREATED)
            except Exception as exc:
                self._send_error_json(f"Live collection failed: {exc}", HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if path == "/api/inspect/snapshot":
            snapshot = body.get("snapshot")
            operator_notes = body.get("operator_notes")
            if not isinstance(snapshot, dict):
                self._send_error_json("Payload must contain a 'snapshot' object", HTTPStatus.BAD_REQUEST)
                return

            try:
                report = analyze_snapshot(snapshot)
                session_id = self.db.save_session(snapshot, report, operator_notes=operator_notes)
                full_record = self.db.get_session(session_id)
                self._send_json(full_record, status=HTTPStatus.CREATED)
            except Exception as exc:
                self._send_error_json(f"Analysis failed: {exc}", HTTPStatus.BAD_REQUEST)
            return

        if path.startswith("/api/sessions/") and path.endswith("/manual"):
            # format: /api/sessions/<id>/manual
            parts = path.strip("/").split("/")
            if len(parts) == 4:
                session_id = parts[2]
                check_name = body.get("check_name")
                status = body.get("status")
                notes = body.get("notes")

                if not check_name or not status:
                    self._send_error_json("Missing 'check_name' or 'status'", HTTPStatus.BAD_REQUEST)
                    return

                session = self.db.get_session(session_id)
                if not session:
                    self._send_error_json("Session not found", HTTPStatus.NOT_FOUND)
                    return

                self.db.record_manual_check(session_id, check_name, status, notes)
                updated = self.db.get_manual_checks(session_id)
                self._send_json({"manual_checks": updated})
                return

        self._send_error_json("Unknown endpoint", HTTPStatus.NOT_FOUND)

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path.startswith("/api/sessions/"):
            session_id = path[len("/api/sessions/"):]
            deleted = self.db.delete_session(session_id)
            if not deleted:
                self._send_error_json("Session not found", HTTPStatus.NOT_FOUND)
                return
            self._send_json({"success": True, "id": session_id})
            return

        self._send_error_json("Unknown endpoint", HTTPStatus.NOT_FOUND)


def create_server(host: str = "127.0.0.1", port: int = 8080, db: Database | None = None) -> ThreadingHTTPServer:
    database = db or Database(DEFAULT_DB_PATH)

    def handler_factory(*args: Any, **kwargs: Any) -> InspectorRequestHandler:
        return InspectorRequestHandler(*args, db=database, **kwargs)

    return ThreadingHTTPServer((host, port), handler_factory)


def run_server(host: str = "127.0.0.1", port: int = 8080, db: Database | None = None) -> None:
    server = create_server(host=host, port=port, db=db)
    print(f"Laptop Buyer Kit running locally at: http://{host}:{port}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server cleanly...")
    finally:
        server.server_close()
