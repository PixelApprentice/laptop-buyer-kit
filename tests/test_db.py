import json
import unittest
from pathlib import Path
from tempfile import NamedTemporaryFile

from laptop_inspector.analysis import analyze_snapshot
from laptop_inspector.db import Database

FIXTURE = Path(__file__).parents[1] / "examples" / "sample_session.json"


class DatabaseTests(unittest.TestCase):
    def setUp(self):
        self.temp_file = NamedTemporaryFile(suffix=".sqlite3", delete=False)
        self.temp_file.close()
        self.db = Database(self.temp_file.name)

    def tearDown(self):
        Path(self.temp_file.name).unlink(missing_ok=True)

    def test_save_and_retrieve_session(self):
        snapshot = json.loads(FIXTURE.read_text(encoding="utf-8"))
        report = analyze_snapshot(snapshot)

        session_id = self.db.save_session(snapshot, report, operator_notes="Checked at seller cafe")
        self.assertEqual(session_id, snapshot["inspection"]["id"])

        record = self.db.get_session(session_id)
        self.assertIsNotNone(record)
        self.assertEqual(record["id"], session_id)
        self.assertEqual(record["operator_notes"], "Checked at seller cafe")
        self.assertEqual(record["risk_state"], "review")
        self.assertEqual(record["finding_count"], 3)
        self.assertEqual(record["claims"]["ram_gib"], 16.0)
        self.assertEqual(record["claims"]["storage_capacity_gb"], 512.0)
        self.assertIn("battery_capacity", record["coverage"])
        self.assertEqual(len(record["findings"]), 3)

    def test_record_manual_check(self):
        snapshot = json.loads(FIXTURE.read_text(encoding="utf-8"))
        report = analyze_snapshot(snapshot)
        session_id = self.db.save_session(snapshot, report)

        self.db.record_manual_check(session_id, "keyboard", "passed", "All keys responded cleanly")
        self.db.record_manual_check(session_id, "screen", "failed", "1 stuck green pixel near top-right")

        checks = self.db.get_manual_checks(session_id)
        self.assertEqual(checks["keyboard"]["status"], "passed")
        self.assertEqual(checks["screen"]["status"], "failed")
        self.assertEqual(checks["screen"]["notes"], "1 stuck green pixel near top-right")

    def test_list_recent_sessions(self):
        snapshot1 = {"inspection": {"id": "SESS-001"}, "battery": None, "storage": {"devices": []}}
        report1 = analyze_snapshot(snapshot1)
        snapshot2 = {"inspection": {"id": "SESS-002"}, "battery": None, "storage": {"devices": []}}
        report2 = analyze_snapshot(snapshot2)

        self.db.save_session(snapshot1, report1, operator_notes="First run")
        self.db.save_session(snapshot2, report2, operator_notes="Second run")

        sessions = self.db.list_sessions()
        self.assertEqual(len(sessions), 2)
        ids = [s["id"] for s in sessions]
        self.assertIn("SESS-001", ids)
        self.assertIn("SESS-002", ids)

    def test_delete_session(self):
        snapshot = json.loads(FIXTURE.read_text(encoding="utf-8"))
        report = analyze_snapshot(snapshot)
        session_id = self.db.save_session(snapshot, report)

        self.assertTrue(self.db.delete_session(session_id))
        self.assertIsNone(self.db.get_session(session_id))
        self.assertFalse(self.db.delete_session(session_id))


if __name__ == "__main__":
    unittest.main()
