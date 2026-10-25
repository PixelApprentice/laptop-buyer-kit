/**
 * Laptop Buyer Kit — Client Application
 * 100% offline, local browser orchestration.
 */

const SAMPLE_SNAPSHOT = {
  "schema_version": "1.0",
  "inspection": { "id": "SAMPLE-USED-T14-DEMO", "collected_at": new Date().toISOString() },
  "system": { "vendor": "Lenovo", "model": "ThinkPad T14 Gen 2", "bios_version": "1.45" },
  "claims": { "model": "ThinkPad T14 Gen 2", "ram_gib": 16, "storage_capacity_gb": 512 },
  "battery": { "design_capacity_mwh": 50500, "full_charge_capacity_mwh": 37800, "cycle_count": 28, "source": "sysfs:BAT0" },
  "storage": {
    "devices": [
      {
        "model": "Kioxia NVMe 512GB",
        "protocol": "nvme",
        "capacity_bytes": 512110190592,
        "nvme_percentage_used": 12,
        "nvme_critical_warning": 0,
        "media_errors": 0,
        "self_test_status": "clean"
      }
    ]
  },
  "memory": { "total_bytes": 17179869184 }
};

const SCREEN_PALETTE = [
  { name: "Pure Black (Stuck subpixels & Backlight Bleed)", color: "#000000" },
  { name: "Pure White (Dead pixels & Uniformity)", color: "#ffffff" },
  { name: "Pure Red (Red subpixel health)", color: "#ff0000" },
  { name: "Pure Green (Green subpixel health)", color: "#00ff00" },
  { name: "Pure Blue (Blue subpixel health)", color: "#0000ff" },
  { name: "Yellow Panel", color: "#ffff00" },
  { name: "Magenta Panel", color: "#ff00ff" },
  { name: "Cyan Panel", color: "#00ffff" }
];

const KB_LAYOUT = [
  [
    { code: "Escape", label: "Esc" },
    { code: "F1", label: "F1" }, { code: "F2", label: "F2" }, { code: "F3", label: "F3" }, { code: "F4", label: "F4" },
    { code: "F5", label: "F5" }, { code: "F6", label: "F6" }, { code: "F7", label: "F7" }, { code: "F8", label: "F8" },
    { code: "F9", label: "F9" }, { code: "F10", label: "F10" }, { code: "F11", label: "F11" }, { code: "F12", label: "F12" },
    { code: "Delete", label: "Del" }
  ],
  [
    { code: "Backquote", label: "` ~" },
    { code: "Digit1", label: "1" }, { code: "Digit2", label: "2" }, { code: "Digit3", label: "3" },
    { code: "Digit4", label: "4" }, { code: "Digit5", label: "5" }, { code: "Digit6", label: "6" },
    { code: "Digit7", label: "7" }, { code: "Digit8", label: "8" }, { code: "Digit9", label: "9" },
    { code: "Digit0", label: "0" }, { code: "Minus", label: "- _" }, { code: "Equal", label: "= +" },
    { code: "Backspace", label: "Backspace", class: "w-2" }
  ],
  [
    { code: "Tab", label: "Tab", class: "w-15" },
    { code: "KeyQ", label: "Q" }, { code: "KeyW", label: "W" }, { code: "KeyE", label: "E" },
    { code: "KeyR", label: "R" }, { code: "KeyT", label: "T" }, { code: "KeyY", label: "Y" },
    { code: "KeyU", label: "U" }, { code: "KeyI", label: "I" }, { code: "KeyO", label: "O" },
    { code: "KeyP", label: "P" }, { code: "BracketLeft", label: "[ {" }, { code: "BracketRight", label: "] }" },
    { code: "Backslash", label: "\\ |", class: "w-15" }
  ],
  [
    { code: "CapsLock", label: "Caps Lock", class: "w-175" },
    { code: "KeyA", label: "A" }, { code: "KeyS", label: "S" }, { code: "KeyD", label: "D" },
    { code: "KeyF", label: "F" }, { code: "KeyG", label: "G" }, { code: "KeyH", label: "H" },
    { code: "KeyJ", label: "J" }, { code: "KeyK", label: "K" }, { code: "KeyL", label: "L" },
    { code: "Semicolon", label: "; :" }, { code: "Quote", label: "' \"" },
    { code: "Enter", label: "Enter", class: "w-225" }
  ],
  [
    { code: "ShiftLeft", label: "Shift", class: "w-225" },
    { code: "KeyZ", label: "Z" }, { code: "KeyX", label: "X" }, { code: "KeyC", label: "C" },
    { code: "KeyV", label: "V" }, { code: "KeyB", label: "B" }, { code: "KeyN", label: "N" },
    { code: "KeyM", label: "M" }, { code: "Comma", label: ", <" }, { code: "Period", label: ". >" },
    { code: "Slash", label: "/ ?" },
    { code: "ShiftRight", label: "Shift", class: "w-225" }
  ],
  [
    { code: "ControlLeft", label: "Ctrl", class: "w-15" },
    { code: "MetaLeft", label: "Win / Cmd", class: "w-125" },
    { code: "AltLeft", label: "Alt", class: "w-125" },
    { code: "Space", label: "Spacebar", class: "w-space" },
    { code: "AltRight", label: "Alt", class: "w-125" },
    { code: "ControlRight", label: "Ctrl", class: "w-15" },
    { code: "ArrowLeft", label: "←" },
    { code: "ArrowUp", label: "↑" },
    { code: "ArrowDown", label: "↓" },
    { code: "ArrowRight", label: "→" }
  ]
];

const MANUAL_CHECKS_DEF = [
  { id: "keyboard_response", name: "Keyboard Key Registration", desc: "No sticking, ghosting, or dead key switches." },
  { id: "display_pixels", name: "Screen Pixels & Backlight Bleed", desc: "Zero dead pixels, white spots, or edge light bleed." },
  { id: "trackpad_gestures", name: "Trackpad & Physical Clicks", desc: "Smooth cursor tracking, multi-touch pinch/scroll, solid click." },
  { id: "ports_usb_display", name: "USB, HDMI & Charging Ports", desc: "All USB-A/C and video output ports connect cleanly without wobble." },
  { id: "chassis_battery_swelling", name: "Chassis & Battery Swelling", desc: "No bulge in trackpad/bottom cover, no cracked hinges, missing screws." },
  { id: "webcam_mic", name: "Webcam & Microphones", desc: "Camera video stream clear, no purple/pink sensor tint; audio records." },
  { id: "speakers_audio", name: "Internal Speakers & Jack", desc: "Clean stereo playback without crackle/distortion at 80% volume." },
  { id: "fans_thermals", name: "Cooling Fan & Noise", desc: "Fan spins smoothly without grinding, bearing chatter, or excessive vibration." }
];

class App {
  constructor() {
    this.currentSession = null;
    this.verifiedKeys = new Set();
    this.screenPaletteIndex = 0;
    this.initTheme();
    this.bindEvents();
    this.buildKeyboard();
    this.loadHistory();
  }

  initTheme() {
    const saved = localStorage.getItem("lbk_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("lbk_theme", next);
  }

  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll(".nav-btn").forEach(btn => {
      btn.addEventListener("click", () => this.switchTab(btn.dataset.tab));
    });

    // Subnav Tabs
    document.querySelectorAll(".subnav-btn").forEach(btn => {
      btn.addEventListener("click", () => this.switchSubtab(btn.dataset.subtab));
    });

    // Theme toggle
    document.getElementById("themeToggleBtn").addEventListener("click", () => this.toggleTheme());

    // Inspection Buttons
    document.getElementById("runLiveBtn").addEventListener("click", () => this.runLiveInspection());
    document.getElementById("loadSampleBtn").addEventListener("click", () => this.loadSampleInspection());
    document.getElementById("uploadSnapshotBtn").addEventListener("click", () => {
      document.getElementById("snapshotFileInput").click();
    });
    document.getElementById("snapshotFileInput").addEventListener("change", (e) => this.handleFileUpload(e));

    // Print Report
    document.getElementById("printReportBtn").addEventListener("click", () => window.print());

    // Screen Test Tool
    document.getElementById("launchScreenTestBtn").addEventListener("click", () => this.startScreenTest());
    document.getElementById("screenTestOverlay").addEventListener("click", () => this.cycleScreenColor());
    window.addEventListener("keydown", (e) => {
      if (document.getElementById("screenTestOverlay").style.display !== "none") {
        if (e.code === "Escape") this.stopScreenTest();
        else if (e.code === "Space" || e.code === "ArrowRight") this.cycleScreenColor();
        else if (e.code === "ArrowLeft") this.cycleScreenColor(-1);
      } else {
        this.handleGlobalKeypress(e);
      }
    });

    window.addEventListener("keyup", (e) => {
      this.handleGlobalKeyRelease(e);
    });

    // Keyboard Reset
    document.getElementById("kbResetBtn").addEventListener("click", () => this.resetKeyboard());

    // History refresh
    document.getElementById("refreshHistoryBtn").addEventListener("click", () => this.loadHistory());
  }

  switchTab(tabId) {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tabId));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.toggle("active", p.id === tabId));
    if (tabId === "tab-history") this.loadHistory();
  }

  switchSubtab(subtabId) {
    document.querySelectorAll(".subnav-btn").forEach(b => b.classList.toggle("active", b.dataset.subtab === subtabId));
    document.querySelectorAll(".subtab-pane").forEach(p => p.classList.toggle("active", p.id === subtabId));
  }

  getClaimsInput() {
    const model = document.getElementById("claimModel").value.trim();
    const ram = parseFloat(document.getElementById("claimRam").value);
    const storage = parseFloat(document.getElementById("claimStorage").value);
    const cpu = document.getElementById("claimCpu").value.trim();
    const gpu = document.getElementById("claimGpu").value.trim();

    const claims = {};
    if (model) claims.model = model;
    if (!isNaN(ram) && ram > 0) claims.ram_gib = ram;
    if (!isNaN(storage) && storage > 0) claims.storage_capacity_gb = storage;
    if (cpu) claims.cpu_model = cpu;
    if (gpu) claims.gpu_model = gpu;
    return claims;
  }

  async runLiveInspection() {
    const btn = document.getElementById("runLiveBtn");
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerText = "Querying Hardware...";

    const claims = this.getClaimsInput();
    const notes = document.getElementById("operatorNotes").value.trim();

    try {
      const resp = await fetch("/api/inspect/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claims, operator_notes: notes })
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Inspection query failed");
      }
      const data = await resp.json();
      this.renderSession(data);
    } catch (err) {
      alert("Live inspection notice: " + err.message + "\n(Falling back to sample inspection for preview)");
      this.loadSampleInspection();
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }

  async loadSampleInspection() {
    const claims = this.getClaimsInput();
    const notes = document.getElementById("operatorNotes").value.trim() || "Synthetic reference session";
    const snapshot = JSON.parse(JSON.stringify(SAMPLE_SNAPSHOT));
    if (Object.keys(claims).length > 0) {
      snapshot.claims = claims;
    }

    try {
      const resp = await fetch("/api/inspect/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot, operator_notes: notes })
      });
      const data = await resp.json();
      this.renderSession(data);
    } catch (err) {
      alert("Error loading sample: " + err.message);
    }
  }

  async handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const snapshot = JSON.parse(e.target.result);
        const notes = document.getElementById("operatorNotes").value.trim() || `Imported ${file.name}`;
        const resp = await fetch("/api/inspect/snapshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ snapshot, operator_notes: notes })
        });
        const data = await resp.json();
        this.renderSession(data);
      } catch (err) {
        alert("Failed to parse snapshot file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  renderSession(session) {
    this.currentSession = session;
    document.getElementById("emptyState").style.display = "none";
    document.getElementById("sessionResults").style.display = "block";

    const report = session.report || {};
    const risk = report.risk_state || "unknown";

    // Verdict Banner
    const banner = document.getElementById("verdictBanner");
    const badge = document.getElementById("verdictBadge");
    const title = document.getElementById("verdictTitle");
    const summary = document.getElementById("verdictSummary");

    badge.className = `badge status-${risk === "high_risk" ? "high" : risk}`;
    badge.innerText = risk.replace(/_/g, " ").toUpperCase();

    const titles = {
      "critical": "Critical Hardware Fault Detected",
      "high_risk": "High Risk — Major Discrepancies or Degradation",
      "review": "Review Before Buying — Minor Discrepancies",
      "no_detected_anomaly_in_evaluated_checks": "No Major Anomalies Detected in Evaluated Checks",
      "insufficient_data": "Insufficient Hardware Data for Verdict"
    };
    title.innerText = titles[risk] || "Inspection Complete";

    const findingCount = report.finding_count || 0;
    summary.innerText = `Evaluated checks completed with ${findingCount} finding${findingCount === 1 ? "" : "s"}. Always confirm with manual physical inspection.`;

    document.getElementById("sessionMetaId").innerText = `Session ID: ${session.id}`;
    document.getElementById("sessionMetaDate").innerText = `Date: ${session.created_at ? new Date(session.created_at).toLocaleString() : "Just now"}`;
    document.getElementById("sessionMetaModel").innerText = `Model: ${session.system_model || "Unknown"}`;

    document.getElementById("findingsCountBadge").innerText = findingCount;

    // Export links
    document.getElementById("exportHtmlBtn").href = `/api/export/${session.id}/html`;
    document.getElementById("exportJsonBtn").href = `/api/export/${session.id}/json`;

    // Render Findings Cards
    this.renderFindings(report.findings || []);

    // Render Coverage Table
    this.renderCoverage(report.coverage || {});

    // Render Manual Checklist
    this.renderManualChecklist(session.manual_checks || {});

    // Render Raw JSON
    document.getElementById("rawSnapshotJson").innerText = JSON.stringify(session.snapshot, null, 2);
  }

  renderFindings(findings) {
    const container = document.getElementById("findingsList");
    container.innerHTML = "";

    if (!findings || findings.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <h3>Clean Findings</h3>
          <p>No anomaly findings were triggered by the automated analysis rules.</p>
        </div>
      `;
      return;
    }

    findings.forEach((f, idx) => {
      const card = document.createElement("div");
      card.className = `finding-card ${f.severity || "info"}`;
      card.innerHTML = `
        <div class="finding-header">
          <span class="badge status-${f.severity}">${(f.severity || "INFO").toUpperCase()}</span>
          <span class="text-muted" style="font-family:var(--font-mono); font-size:0.8rem;">${f.code || ""}</span>
        </div>
        <h3>${f.title || "Finding"}</h3>
        <p class="finding-details">${f.details || ""}</p>
        <div class="action-recommendation">
          <strong>Recommended Action:</strong> ${f.recommended_action || "Investigate reading."}
        </div>
        <button type="button" class="evidence-toggle" data-idx="${idx}">Show Evidence & Provenance ▾</button>
        <pre id="ev-${idx}" class="code-block" style="display:none; margin-top:0.5rem;">${JSON.stringify({ evidence: f.evidence, confidence: f.confidence, source: f.source }, null, 2)}</pre>
      `;

      card.querySelector(".evidence-toggle").addEventListener("click", (e) => {
        const pre = document.getElementById(`ev-${idx}`);
        const isHidden = pre.style.display === "none";
        pre.style.display = isHidden ? "block" : "none";
        e.target.innerText = isHidden ? "Hide Evidence ▴" : "Show Evidence & Provenance ▾";
      });

      container.appendChild(card);
    });
  }

  renderCoverage(coverage) {
    const tbody = document.getElementById("coverageTableBody");
    tbody.innerHTML = "";

    const descriptions = {
      "battery_capacity": "Reported full-charge capacity vs design threshold",
      "battery_cycles": "Battery cycle counter vs degradation consistency",
      "storage_devices": "Internal storage device presence and controller response",
      "storage_capacity_claim": "Advertised decimal storage size vs detected bytes",
      "nvme_endurance": "Rated NVMe endurance usage percentage (0-100+%)",
      "nvme_critical_warning": "NVMe controller hardware health flags bitmask",
      "storage_integrity": "Uncorrectable errors, pending, reallocated sectors",
      "storage_self_test": "SMART / NVMe diagnostic self-test outcome",
      "memory_capacity_claim": "Claimed RAM quantity in GiB vs physical memory"
    };

    Object.keys(coverage).sort().forEach(check => {
      const status = coverage[check] || "unknown";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><code>${check}</code></td>
        <td><span class="badge status-${status.toLowerCase()}">${status.toUpperCase()}</span></td>
        <td class="text-muted">${descriptions[check] || "Hardware telemetry evaluation"}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderManualChecklist(savedChecks) {
    const container = document.getElementById("manualChecklist");
    container.innerHTML = "";

    MANUAL_CHECKS_DEF.forEach(def => {
      const current = savedChecks[def.id] || { status: "not_tested", notes: "" };
      const item = document.createElement("div");
      item.className = "check-item";
      item.innerHTML = `
        <div class="check-item-header">
          <h4>${def.name}</h4>
          <span class="badge status-${current.status === 'passed' ? 'passed' : current.status === 'failed' ? 'critical' : 'inconclusive'}">
            ${current.status.toUpperCase()}
          </span>
        </div>
        <p class="text-muted" style="margin-bottom:0.5rem; font-size:0.8rem;">${def.desc}</p>
        <div class="check-buttons">
          <button type="button" class="check-btn ${current.status === 'passed' ? 'active-pass' : ''}" data-val="passed">PASS</button>
          <button type="button" class="check-btn ${current.status === 'failed' ? 'active-fail' : ''}" data-val="failed">FAIL</button>
          <button type="button" class="check-btn" data-val="not_applicable">N/A</button>
        </div>
        <input type="text" class="check-notes-input" placeholder="Optional operator notes..." value="${current.notes || ''}" />
      `;

      const input = item.querySelector(".check-notes-input");
      item.querySelectorAll(".check-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          this.updateManualCheck(def.id, btn.dataset.val, input.value);
        });
      });

      input.addEventListener("change", () => {
        this.updateManualCheck(def.id, current.status, input.value);
      });

      container.appendChild(item);
    });
  }

  async updateManualCheck(checkId, status, notes) {
    if (!this.currentSession) return;
    try {
      const resp = await fetch(`/api/sessions/${this.currentSession.id}/manual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ check_name: checkId, status, notes })
      });
      const data = await resp.json();
      this.currentSession.manual_checks = data.manual_checks;
      this.renderManualChecklist(data.manual_checks);
    } catch (err) {
      console.error("Failed to update manual check:", err);
    }
  }

  // Keyboard Tester
  buildKeyboard() {
    const container = document.getElementById("virtualKeyboard");
    container.innerHTML = "";

    KB_LAYOUT.forEach(row => {
      const rowEl = document.createElement("div");
      rowEl.className = "kb-row";
      row.forEach(key => {
        const keyEl = document.createElement("div");
        keyEl.className = `key ${key.class || ""}`;
        keyEl.id = `kb-${key.code}`;
        keyEl.innerText = key.label;
        rowEl.appendChild(keyEl);
      });
      container.appendChild(rowEl);
    });
  }

  handleGlobalKeypress(e) {
    const keyEl = document.getElementById(`kb-${e.code}`);
    if (keyEl) {
      keyEl.classList.add("pressed", "tested");
      this.verifiedKeys.add(e.code);
      document.getElementById("kbVerifiedCount").innerText = this.verifiedKeys.size;
      document.getElementById("lastKeyPressed").innerText = `Last key pressed: ${e.key} (Code: ${e.code})`;
    }
  }

  handleGlobalKeyRelease(e) {
    const keyEl = document.getElementById(`kb-${e.code}`);
    if (keyEl) {
      keyEl.classList.remove("pressed");
    }
  }

  resetKeyboard() {
    this.verifiedKeys.clear();
    document.querySelectorAll(".key.tested").forEach(k => k.classList.remove("tested", "pressed"));
    document.getElementById("kbVerifiedCount").innerText = "0";
    document.getElementById("lastKeyPressed").innerText = "Press any key to begin verification...";
  }

  // Screen Tester
  startScreenTest() {
    this.screenPaletteIndex = 0;
    const overlay = document.getElementById("screenTestOverlay");
    overlay.style.display = "flex";
    this.applyScreenColor();

    const help = document.getElementById("screenTestHelp");
    help.style.opacity = "1";
    setTimeout(() => { help.style.opacity = "0"; }, 3000);

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  stopScreenTest() {
    const overlay = document.getElementById("screenTestOverlay");
    overlay.style.display = "none";
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  cycleScreenColor(step = 1) {
    this.screenPaletteIndex = (this.screenPaletteIndex + step + SCREEN_PALETTE.length) % SCREEN_PALETTE.length;
    this.applyScreenColor();
  }

  applyScreenColor() {
    const current = SCREEN_PALETTE[this.screenPaletteIndex];
    const overlay = document.getElementById("screenTestOverlay");
    overlay.style.backgroundColor = current.color;
  }

  // History
  async loadHistory() {
    try {
      const resp = await fetch("/api/sessions");
      const data = await resp.json();
      const tbody = document.getElementById("historyTableBody");
      tbody.innerHTML = "";

      if (!data.sessions || data.sessions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-muted" style="text-align:center;">No past inspections recorded in SQLite database.</td></tr>`;
        return;
      }

      data.sessions.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${new Date(s.created_at).toLocaleString()}</td>
          <td><code>${s.id}</code></td>
          <td>${s.system_model || "Unknown"}</td>
          <td><span class="badge status-${s.risk_state === 'high_risk' ? 'high' : s.risk_state}">${s.risk_state}</span></td>
          <td>${s.finding_count}</td>
          <td>${s.operator_notes || "-"}</td>
          <td>
            <button class="btn btn-sm btn-outline load-hist-btn" data-id="${s.id}">View</button>
            <button class="btn btn-sm btn-outline del-hist-btn" data-id="${s.id}" style="color:var(--severity-critical);">Delete</button>
          </td>
        `;

        tr.querySelector(".load-hist-btn").addEventListener("click", async () => {
          const sResp = await fetch(`/api/sessions/${s.id}`);
          const sData = await sResp.json();
          this.switchTab("tab-inspect");
          this.renderSession(sData);
        });

        tr.querySelector(".del-hist-btn").addEventListener("click", async () => {
          if (confirm(`Delete session ${s.id}?`)) {
            await fetch(`/api/sessions/${s.id}`, { method: "DELETE" });
            this.loadHistory();
          }
        });

        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
