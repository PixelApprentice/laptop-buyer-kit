/**
 * Aegis Laptop Diagnostics (Laptop Buyer Kit v2.0)
 * 100% offline, local browser orchestration.
 * Zero external CDNs, zero telemetry, full privacy.
 */

const SAMPLE_SNAPSHOT = {
  "schema_version": "1.0",
  "inspection": { "id": "SAMPLE-USED-T14-DEMO", "collected_at": new Date().toISOString() },
  "system": { "vendor": "LENOVO", "model": "ThinkPad T14 Gen 2", "bios_version": "N34ET45W (1.45)", "bios_date": "2023-04-18" },
  "claims": {
    "model": "ThinkPad T14 Gen 2",
    "ram_gib": 16,
    "storage_capacity_gb": 512,
    "cpu_model": "11th Gen Intel(R) Core(TM) i7-1165G7 @ 2.80GHz",
    "gpu_model": "Intel Corporation TigerLake-LP GT2 [Iris Xe Graphics]",
    "display_resolution": "1920x1080"
  },
  "battery": {
    "design_capacity_mwh": 50500,
    "full_charge_capacity_mwh": 37800,
    "cycle_count": 84,
    "source": "sysfs:BAT0",
    "status": "Discharging",
    "voltage_uv": 11520000,
    "health_percentage": 74.9
  },
  "storage": {
    "total_capacity_gb": 512,
    "devices": [
      {
        "model": "KIOXIA KBG40ZNS512G NVMe 512GB",
        "protocol": "nvme",
        "capacity_bytes": 512110190592,
        "capacity_gb": 512.1,
        "nvme_percentage_used": 14,
        "nvme_critical_warning": 0,
        "media_errors": 0,
        "self_test_status": "clean",
        "temperature_c": 38,
        "power_cycles": 420
      }
    ]
  },
  "memory": { "total_bytes": 17179869184, "total_gib": 16.0 },
  "cpu": { "model": "11th Gen Intel(R) Core(TM) i7-1165G7 @ 2.80GHz", "cores": 4, "threads": 8, "mhz": 2800, "arch": "x86_64" },
  "gpu": { "model": "Intel Corporation TigerLake-LP GT2 [Iris Xe Graphics]", "driver": "i915" },
  "display": { "connector": "eDP-1", "status": "connected", "resolution": "1920x1080", "modes": ["1920x1080@60Hz"] },
  "ac_adapter": { "name": "ACAD", "online": false },
  "thermals": [
    { "zone": "thermal_zone0", "type": "acpitz", "temp_c": 44.0 },
    { "zone": "thermal_zone1", "type": "x86_pkg_temp", "temp_c": 42.5 }
  ]
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
    this.lastProbedSpecs = null;
    this.isExpertMode = false;
    this.verifiedKeys = new Set();
    this.screenPaletteIndex = 0;

    // Web Audio state
    this.audioCtx = null;
    this.activeOsc = null;
    this.activeGain = null;
    this.activePanner = null;
    this.isTonePlaying = false;

    // MediaStream state
    this.mediaStream = null;
    this.micAudioCtx = null;
    this.micAnalyser = null;
    this.micAnimFrameId = null;

    // Trackpad Canvas state
    this.activePointers = new Map();

    this.initTheme();
    this.initMode();
    this.bindEvents();
    this.buildKeyboard();
    this.initTrackpadCanvas();
    this.loadHistory();
  }

  // --------------------------------------------------------------------------
  // Theme & Mode Management
  // --------------------------------------------------------------------------
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

  initMode() {
    const saved = localStorage.getItem("lbk_expert_mode") === "true";
    const toggle = document.getElementById("expertModeToggle");
    if (toggle) {
      toggle.checked = saved;
    }
    this.applyMode(saved);
  }

  applyMode(isExpert) {
    this.isExpertMode = isExpert;
    localStorage.setItem("lbk_expert_mode", isExpert ? "true" : "false");

    const normalLabel = document.querySelector(".normal-label");
    const expertLabel = document.querySelector(".expert-label");
    if (normalLabel && expertLabel) {
      normalLabel.classList.toggle("active", !isExpert);
      expertLabel.classList.toggle("active", isExpert);
    }

    const configPanel = document.getElementById("expertConfigPanel");
    if (configPanel) {
      configPanel.style.display = isExpert ? "block" : "none";
    }

    const expertTabBtn = document.querySelector(".expert-tab-btn");
    if (expertTabBtn) {
      expertTabBtn.style.display = isExpert ? "inline-flex" : "none";
    }

    const thermalCard = document.getElementById("thermalDialCard");
    if (thermalCard) {
      thermalCard.style.display = isExpert ? "block" : "none";
    }

    // If currently on expert subtab and switching to normal, fallback to findings
    const activeSubtab = document.querySelector(".subnav-btn.active");
    if (!isExpert && activeSubtab && activeSubtab.dataset.subtab === "subtab-expert") {
      this.switchSubtab("subtab-findings");
    }
  }

  // --------------------------------------------------------------------------
  // Event Binding
  // --------------------------------------------------------------------------
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

    // Normal vs Expert Mode switch
    document.getElementById("expertModeToggle").addEventListener("change", (e) => {
      this.applyMode(e.target.checked);
    });

    // Sliders in Expert Mode
    const batSlider = document.getElementById("threshBatteryWarn");
    if (batSlider) {
      batSlider.addEventListener("input", (e) => {
        document.getElementById("threshBatteryWarnVal").innerText = `${e.target.value}%`;
      });
    }

    const nvmeSlider = document.getElementById("threshNvmeWear");
    if (nvmeSlider) {
      nvmeSlider.addEventListener("input", (e) => {
        document.getElementById("threshNvmeWearVal").innerText = `${e.target.value}%`;
      });
    }

    // Auto-Detect Specs button
    document.getElementById("autoDetectBtn").addEventListener("click", () => this.runAutoDetection());

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

    // Audio Diagnostics
    this.bindAudioEvents();

    // Media (Camera & Mic) Diagnostics
    this.bindMediaEvents();
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

  // --------------------------------------------------------------------------
  // Auto-Detection Engine
  // --------------------------------------------------------------------------
  async runAutoDetection() {
    const btn = document.getElementById("autoDetectBtn");
    const origHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerText = "⚡ Probing Hardware...";

    try {
      const resp = await fetch("/api/probe");
      if (!resp.ok) {
        throw new Error(`Probe endpoint returned HTTP ${resp.status}`);
      }
      const data = await resp.json();
      this.lastProbedSpecs = data;

      // Populate Claims Form with Detected Physical Values
      if (data.system && data.system.model) {
        document.getElementById("claimModel").value = data.system.model;
      }
      if (data.memory && data.memory.total_gib) {
        document.getElementById("claimRam").value = Math.round(data.memory.total_gib);
      }
      if (data.storage && (data.storage.total_capacity_gb || (data.storage.devices && data.storage.devices[0]))) {
        const cap = data.storage.total_capacity_gb || Math.round((data.storage.devices[0].capacity_bytes || 0) / 1e9);
        if (cap > 0) document.getElementById("claimStorage").value = cap;
      }
      if (data.cpu && data.cpu.model) {
        document.getElementById("claimCpu").value = data.cpu.model;
      }
      if (data.gpu && data.gpu.model) {
        document.getElementById("claimGpu").value = data.gpu.model;
      }
      if (data.display && data.display.resolution) {
        document.getElementById("claimDisplay").value = data.display.resolution;
      }

      btn.innerText = "✓ Specs Detected!";
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.disabled = false;
      }, 2000);

      // If a session is open, refresh comparison
      if (this.currentSession) {
        this.renderComparisonTable(this.currentSession);
      }
    } catch (err) {
      console.warn("Auto-detect failed:", err);
      btn.innerText = "Probe Unavailable";
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.disabled = false;
      }, 2000);
      alert("Hardware auto-detect notice: " + err.message + "\n(You can still run inspection or enter claims manually)");
    }
  }

  getClaimsInput() {
    const model = document.getElementById("claimModel").value.trim();
    const ram = parseFloat(document.getElementById("claimRam").value);
    const storage = parseFloat(document.getElementById("claimStorage").value);
    const cpu = document.getElementById("claimCpu").value.trim();
    const gpu = document.getElementById("claimGpu").value.trim();
    const display = document.getElementById("claimDisplay") ? document.getElementById("claimDisplay").value.trim() : "";

    const claims = {};
    if (model) claims.model = model;
    if (!isNaN(ram) && ram > 0) claims.ram_gib = ram;
    if (!isNaN(storage) && storage > 0) claims.storage_capacity_gb = storage;
    if (cpu) claims.cpu_model = cpu;
    if (gpu) claims.gpu_model = gpu;
    if (display) claims.display_resolution = display;
    return claims;
  }

  // --------------------------------------------------------------------------
  // Inspection Executions
  // --------------------------------------------------------------------------
  async runLiveInspection() {
    const btn = document.getElementById("runLiveBtn");
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerText = "Querying Live Hardware...";

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
      alert("Live inspection notice: " + err.message + "\n(Falling back to sample reference inspection)");
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
      snapshot.claims = { ...snapshot.claims, ...claims };
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

  // --------------------------------------------------------------------------
  // Session Rendering & Gauges
  // --------------------------------------------------------------------------
  renderSession(session) {
    this.currentSession = session;
    document.getElementById("emptyState").style.display = "none";
    document.getElementById("sessionResults").style.display = "block";

    const report = session.report || {};
    const risk = report.risk_state || "unknown";

    // Verdict Banner
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

    // Render Health Gauges
    this.renderHealthGauges(session.snapshot || {});

    // Render Findings Cards
    this.renderFindings(report.findings || []);

    // Render Comparison Table
    this.renderComparisonTable(session);

    // Render Coverage Table
    this.renderCoverage(report.coverage || {});

    // Render Manual Checklist
    this.renderManualChecklist(session.manual_checks || {});

    // Render Expert Mode Telemetry Tables
    this.renderExpertTelemetry(session.snapshot || {});
  }

  renderHealthGauges(snapshot) {
    // 1. Battery Gauge
    const bat = snapshot.battery || {};
    const pathEl = document.getElementById("batteryCirclePath");
    const textEl = document.getElementById("batteryHealthDialText");
    const cyclesEl = document.getElementById("batteryCyclesSub");

    let healthPct = null;
    if (typeof bat.health_percentage === "number") {
      healthPct = bat.health_percentage;
    } else if (bat.full_charge_capacity_mwh && bat.design_capacity_mwh && bat.design_capacity_mwh > 0) {
      healthPct = (bat.full_charge_capacity_mwh / bat.design_capacity_mwh) * 100;
    }

    if (healthPct !== null && !isNaN(healthPct)) {
      const clamped = Math.max(0, Math.min(100, Math.round(healthPct)));
      pathEl.setAttribute("stroke-dasharray", `${clamped}, 100`);
      textEl.textContent = `${clamped}%`;

      if (clamped >= 80) {
        pathEl.style.stroke = "var(--severity-passed)";
      } else if (clamped >= 65) {
        pathEl.style.stroke = "var(--severity-warning)";
      } else {
        pathEl.style.stroke = "var(--severity-critical)";
      }

      cyclesEl.textContent = bat.cycle_count !== undefined && bat.cycle_count !== null
        ? `${bat.cycle_count} cycles`
        : "Cycles unknown";
    } else {
      pathEl.setAttribute("stroke-dasharray", "0, 100");
      textEl.textContent = "N/A";
      cyclesEl.textContent = "No battery detected";
    }

    // 2. Storage NVMe Endurance Gauge
    const storage = snapshot.storage || {};
    const devices = storage.devices || [];
    const primDev = devices[0] || {};
    const wearFill = document.getElementById("storageWearFill");
    const wearText = document.getElementById("storageWearText");
    const integSub = document.getElementById("storageIntegritySub");

    if (primDev.nvme_percentage_used !== undefined && primDev.nvme_percentage_used !== null) {
      const wear = primDev.nvme_percentage_used;
      wearFill.style.width = `${Math.min(100, Math.max(2, wear))}%`;
      wearText.textContent = `${wear}% Used`;

      if (wear >= 80) {
        wearFill.style.backgroundColor = "var(--severity-critical)";
      } else if (wear >= 50) {
        wearFill.style.backgroundColor = "var(--severity-warning)";
      } else {
        wearFill.style.backgroundColor = "var(--severity-passed)";
      }

      const errors = primDev.media_errors ?? 0;
      integSub.textContent = `${errors} Media Errors · ${primDev.self_test_status || "Clean"}`;
    } else {
      wearFill.style.width = "0%";
      wearText.textContent = "Standard Disk";
      integSub.textContent = primDev.protocol ? primDev.protocol.toUpperCase() : "SATA/NVMe";
    }

    // 3. CPU Temperature Gauge
    const thermals = snapshot.thermals || [];
    const tempText = document.getElementById("cpuTempText");
    const tempSub = document.getElementById("thermalStatusSub");

    let peakTemp = null;
    thermals.forEach(t => {
      if (typeof t.temp_c === "number") {
        if (peakTemp === null || t.temp_c > peakTemp) {
          peakTemp = t.temp_c;
        }
      }
    });

    if (peakTemp !== null) {
      tempText.textContent = `${Math.round(peakTemp)}°C`;
      if (peakTemp >= 85) {
        tempSub.textContent = "High · Throttle Risk";
        tempText.style.color = "var(--severity-critical)";
      } else if (peakTemp >= 68) {
        tempSub.textContent = "Elevated · Active";
        tempText.style.color = "var(--severity-warning)";
      } else {
        tempSub.textContent = "Normal · Idle";
        tempText.style.color = "var(--severity-passed)";
      }
    } else {
      tempText.textContent = "--°C";
      tempSub.textContent = "Sensor unread";
      tempText.style.color = "inherit";
    }
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

  renderComparisonTable(session) {
    const tbody = document.getElementById("comparisonTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const snapshot = session.snapshot || {};
    const claims = snapshot.claims || this.getClaimsInput();

    const rows = [];

    // 1. Model
    const claimedModel = claims.model || "Not specified";
    const detectedModel = snapshot.system?.model || "Unknown";
    let modelVerdict = "DETECTED";
    let modelBadgeClass = "inconclusive";
    if (claims.model) {
      const cm = claimedModel.toLowerCase().replace(/[^a-z0-9]/g, "");
      const dm = detectedModel.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (dm.includes(cm) || cm.includes(dm)) {
        modelVerdict = "MATCH";
        modelBadgeClass = "passed";
      } else {
        modelVerdict = "DISCREPANCY";
        modelBadgeClass = "warning";
      }
    }
    rows.push({
      spec: "System Model",
      claim: claimedModel,
      detected: detectedModel,
      verdict: modelVerdict,
      badge: modelBadgeClass
    });

    // 2. RAM
    const claimedRam = claims.ram_gib ? `${claims.ram_gib} GiB` : "Not specified";
    let detectedRam = "Unknown";
    let ramVerdict = "DETECTED";
    let ramBadgeClass = "inconclusive";
    if (snapshot.memory && snapshot.memory.total_bytes) {
      const gig = snapshot.memory.total_bytes / (1024 ** 3);
      detectedRam = `${gig.toFixed(1)} GiB`;
      if (claims.ram_gib) {
        const ratio = gig / claims.ram_gib;
        if (ratio >= 0.98) {
          ramVerdict = "MATCH";
          ramBadgeClass = "passed";
        } else if (ratio >= 0.88) {
          ramVerdict = "VRAM RESERVED";
          ramBadgeClass = "passed";
        } else {
          ramVerdict = "MISMATCH";
          ramBadgeClass = "warning";
        }
      }
    }
    rows.push({
      spec: "RAM Capacity",
      claim: claimedRam,
      detected: detectedRam,
      verdict: ramVerdict,
      badge: ramBadgeClass
    });

    // 3. Storage
    const claimedStorage = claims.storage_capacity_gb ? `${claims.storage_capacity_gb} GB` : "Not specified";
    let detectedStorage = "Unknown";
    let storVerdict = "DETECTED";
    let storBadgeClass = "inconclusive";
    if (snapshot.storage && snapshot.storage.devices && snapshot.storage.devices.length > 0) {
      let totalB = 0;
      snapshot.storage.devices.forEach(d => { totalB += (d.capacity_bytes || 0); });
      const gb = totalB / 1e9;
      detectedStorage = `${Math.round(gb)} GB (${snapshot.storage.devices.length} disk${snapshot.storage.devices.length > 1 ? 's' : ''})`;
      if (claims.storage_capacity_gb) {
        const ratio = gb / claims.storage_capacity_gb;
        if (ratio >= 0.93) {
          storVerdict = "MATCH";
          storBadgeClass = "passed";
        } else {
          storVerdict = "MISMATCH";
          storBadgeClass = "warning";
        }
      }
    }
    rows.push({
      spec: "Storage Size",
      claim: claimedStorage,
      detected: detectedStorage,
      verdict: storVerdict,
      badge: storBadgeClass
    });

    // 4. CPU
    const claimedCpu = claims.cpu_model || "Not specified";
    const detectedCpu = snapshot.cpu?.model || "Not detected";
    let cpuVerdict = "DETECTED";
    let cpuBadge = "inconclusive";
    if (claims.cpu_model && snapshot.cpu?.model) {
      const cc = claimedCpu.toLowerCase().replace(/[^a-z0-9]/g, "");
      const dc = detectedCpu.toLowerCase().replace(/[^a-z0-9]/g, "");
      cpuVerdict = (dc.includes(cc) || cc.includes(dc)) ? "MATCH" : "VERIFY";
      cpuBadge = cpuVerdict === "MATCH" ? "passed" : "warning";
    }
    rows.push({
      spec: "CPU Specification",
      claim: claimedCpu,
      detected: detectedCpu,
      verdict: cpuVerdict,
      badge: cpuBadge
    });

    // 5. GPU
    const claimedGpu = claims.gpu_model || "Not specified";
    const detectedGpu = snapshot.gpu?.model || "Integrated/PCIe Controller";
    rows.push({
      spec: "GPU / Graphics",
      claim: claimedGpu,
      detected: detectedGpu,
      verdict: claims.gpu_model ? "VERIFY" : "DETECTED",
      badge: "inconclusive"
    });

    // 6. Display
    const claimedDisp = claims.display_resolution || "Not specified";
    const detectedDisp = snapshot.display?.resolution || (snapshot.display?.connector ? `${snapshot.display.connector} connected` : "Panel detected");
    rows.push({
      spec: "Display Panel",
      claim: claimedDisp,
      detected: detectedDisp,
      verdict: claims.display_resolution ? "VERIFY" : "DETECTED",
      badge: "inconclusive"
    });

    rows.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${r.spec}</strong></td>
        <td><code>${r.claim}</code></td>
        <td><code>${r.detected}</code></td>
        <td><span class="badge status-${r.badge}">${r.verdict}</span></td>
      `;
      tbody.appendChild(tr);
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

  renderExpertTelemetry(snapshot) {
    // 1. CPU & Thermals Table
    const cpuTable = document.getElementById("expertCpuTable");
    if (cpuTable) {
      const cpu = snapshot.cpu || {};
      const thermals = snapshot.thermals || [];
      let rows = `
        <tr><td><strong>Model</strong></td><td><code>${cpu.model || "Unknown"}</code></td></tr>
        <tr><td><strong>Topology</strong></td><td><code>${cpu.cores || "?"} physical cores / ${cpu.threads || "?"} threads</code></td></tr>
        <tr><td><strong>Max Frequency</strong></td><td><code>${cpu.mhz ? `${cpu.mhz} MHz` : "Dynamic"}</code></td></tr>
        <tr><td><strong>Architecture</strong></td><td><code>${cpu.arch || "x86_64"}</code></td></tr>
      `;
      if (thermals.length > 0) {
        const tList = thermals.map(t => `${t.type || t.zone}: ${t.temp_c}°C`).join("<br>");
        rows += `<tr><td><strong>Thermal Sensors</strong></td><td><code>${tList}</code></td></tr>`;
      }
      cpuTable.innerHTML = rows;
    }

    // 2. Battery ACPI Table
    const batTable = document.getElementById("expertBatteryTable");
    if (batTable) {
      const bat = snapshot.battery || {};
      const ac = snapshot.ac_adapter || {};
      batTable.innerHTML = `
        <tr><td><strong>Design Capacity</strong></td><td><code>${bat.design_capacity_mwh ? `${bat.design_capacity_mwh} mWh` : "N/A"}</code></td></tr>
        <tr><td><strong>Full Charge Capacity</strong></td><td><code>${bat.full_charge_capacity_mwh ? `${bat.full_charge_capacity_mwh} mWh` : "N/A"}</code></td></tr>
        <tr><td><strong>Cycle Count</strong></td><td><code>${bat.cycle_count ?? "N/A"}</code></td></tr>
        <tr><td><strong>Reported Voltage</strong></td><td><code>${bat.voltage_uv ? `${(bat.voltage_uv / 1e6).toFixed(2)} V` : "N/A"}</code></td></tr>
        <tr><td><strong>AC Charger Online</strong></td><td><code>${ac.online !== undefined ? (ac.online ? "YES (Plugged In)" : "NO (On Battery)") : "Unknown"}</code></td></tr>
        <tr><td><strong>Source Node</strong></td><td><code>${bat.source || "ACPI sysfs"}</code></td></tr>
      `;
    }

    // 3. Storage Low-Level Controllers
    const storTable = document.getElementById("expertStorageTable");
    if (storTable) {
      const storage = snapshot.storage || {};
      const dev = (storage.devices && storage.devices[0]) || {};
      storTable.innerHTML = `
        <tr><td><strong>Storage Model</strong></td><td><code>${dev.model || "Unknown"}</code></td></tr>
        <tr><td><strong>Protocol</strong></td><td><code>${dev.protocol ? dev.protocol.toUpperCase() : "Unknown"}</code></td></tr>
        <tr><td><strong>Reported Bytes</strong></td><td><code>${dev.capacity_bytes ? dev.capacity_bytes.toLocaleString() : "N/A"}</code></td></tr>
        <tr><td><strong>NVMe Critical Warning</strong></td><td><code>${dev.nvme_critical_warning !== undefined ? `0x${dev.nvme_critical_warning.toString(16).padStart(2, "0")}` : "N/A"}</code></td></tr>
        <tr><td><strong>Percentage Used</strong></td><td><code>${dev.nvme_percentage_used !== undefined ? `${dev.nvme_percentage_used}%` : "N/A"}</code></td></tr>
        <tr><td><strong>Media Errors</strong></td><td><code>${dev.media_errors ?? "0"}</code></td></tr>
        <tr><td><strong>Self Test Status</strong></td><td><code>${dev.self_test_status || "OK"}</code></td></tr>
      `;
    }

    // 4. Motherboard, Display & System
    const sysTable = document.getElementById("expertSystemTable");
    if (sysTable) {
      const sys = snapshot.system || {};
      const disp = snapshot.display || {};
      const gpu = snapshot.gpu || {};
      sysTable.innerHTML = `
        <tr><td><strong>System Manufacturer</strong></td><td><code>${sys.vendor || "Unknown"}</code></td></tr>
        <tr><td><strong>Motherboard Product</strong></td><td><code>${sys.model || "Unknown"}</code></td></tr>
        <tr><td><strong>BIOS / Firmware</strong></td><td><code>${sys.bios_version || "Unknown"} (${sys.bios_date || "Date unrecorded"})</code></td></tr>
        <tr><td><strong>GPU Device</strong></td><td><code>${gpu.model || "Unknown"}</code></td></tr>
        <tr><td><strong>Display Connector</strong></td><td><code>${disp.connector || "eDP"} (${disp.resolution || "Native"})</code></td></tr>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // Interactive Tool: Audio Diagnostics (Pure Web Audio API)
  // --------------------------------------------------------------------------
  bindAudioEvents() {
    const freqSlider = document.getElementById("audioFreqSlider");
    const freqVal = document.getElementById("audioFreqVal");
    const playBtn = document.getElementById("playToneBtn");
    const sweepBtn = document.getElementById("sweepToneBtn");
    const leftBtn = document.getElementById("testLeftSpeakerBtn");
    const rightBtn = document.getElementById("testRightSpeakerBtn");

    if (!freqSlider || !playBtn) return;

    freqSlider.addEventListener("input", (e) => {
      const freq = parseFloat(e.target.value);
      freqVal.textContent = `${freq} Hz`;
      if (this.activeOsc && this.audioCtx) {
        this.activeOsc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      }
    });

    playBtn.addEventListener("click", () => {
      if (this.isTonePlaying) {
        this.stopAudioTone();
        playBtn.textContent = "Play Tone";
      } else {
        const freq = parseFloat(freqSlider.value) || 440;
        this.startAudioTone(freq, 0);
        playBtn.textContent = "Stop Tone";
      }
    });

    sweepBtn.addEventListener("click", () => {
      this.runAudioSweep();
    });

    leftBtn.addEventListener("click", () => {
      this.testSpeakerChannel(-1, "Left Speaker Playing...");
    });

    rightBtn.addEventListener("click", () => {
      this.testSpeakerChannel(1, "Right Speaker Playing...");
    });
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  startAudioTone(frequency = 440, pan = 0) {
    this.stopAudioTone();
    this.ensureAudioContext();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, this.audioCtx.currentTime + 0.05);

    if (this.audioCtx.createStereoPanner) {
      const panner = this.audioCtx.createStereoPanner();
      panner.pan.setValueAtTime(pan, this.audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.audioCtx.destination);
      this.activePanner = panner;
    } else {
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
    }

    osc.start();
    this.activeOsc = osc;
    this.activeGain = gain;
    this.isTonePlaying = true;
  }

  stopAudioTone() {
    if (this.activeGain && this.audioCtx) {
      try {
        this.activeGain.gain.setValueAtTime(this.activeGain.gain.value, this.audioCtx.currentTime);
        this.activeGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.05);
      } catch (_) {}
    }
    if (this.activeOsc) {
      try {
        this.activeOsc.stop(this.audioCtx ? this.audioCtx.currentTime + 0.06 : 0);
      } catch (_) {}
      this.activeOsc = null;
    }
    this.activeGain = null;
    this.activePanner = null;
    this.isTonePlaying = false;

    const playBtn = document.getElementById("playToneBtn");
    if (playBtn) playBtn.textContent = "Play Tone";
  }

  runAudioSweep() {
    this.stopAudioTone();
    this.ensureAudioContext();

    const sweepBtn = document.getElementById("sweepToneBtn");
    const origText = sweepBtn.textContent;
    sweepBtn.disabled = true;
    sweepBtn.textContent = "Sweeping (20Hz–2000Hz)...";

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = "sine";
    const startTime = this.audioCtx.currentTime + 0.05;
    const duration = 5.0;

    osc.frequency.setValueAtTime(20, startTime);
    osc.frequency.exponentialRampToValueAtTime(2000, startTime + duration);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.1);
    gain.gain.setValueAtTime(0.25, startTime + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    this.activeOsc = osc;
    this.activeGain = gain;
    this.isTonePlaying = true;

    setTimeout(() => {
      this.stopAudioTone();
      sweepBtn.disabled = false;
      sweepBtn.textContent = origText;
    }, (duration + 0.2) * 1000);
  }

  testSpeakerChannel(pan = 0, label = "") {
    this.startAudioTone(600, pan);
    const leftBtn = document.getElementById("testLeftSpeakerBtn");
    const rightBtn = document.getElementById("testRightSpeakerBtn");

    const targetBtn = pan === -1 ? leftBtn : rightBtn;
    const origText = targetBtn.textContent;
    targetBtn.textContent = "Testing...";

    setTimeout(() => {
      this.stopAudioTone();
      targetBtn.textContent = origText;
    }, 2000);
  }

  // --------------------------------------------------------------------------
  // Interactive Tool: Webcam & Microphone Diagnostic
  // --------------------------------------------------------------------------
  bindMediaEvents() {
    const startBtn = document.getElementById("startMediaBtn");
    const stopBtn = document.getElementById("stopMediaBtn");

    if (!startBtn || !stopBtn) return;

    startBtn.addEventListener("click", () => this.startMediaDiagnostic());
    stopBtn.addEventListener("click", () => this.stopMediaDiagnostic());
  }

  async startMediaDiagnostic() {
    const startBtn = document.getElementById("startMediaBtn");
    const stopBtn = document.getElementById("stopMediaBtn");
    const videoEl = document.getElementById("webcamPreview");
    const micText = document.getElementById("micVolumeDb");

    try {
      startBtn.disabled = true;
      startBtn.textContent = "Requesting Device Access...";

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });

      this.mediaStream = stream;
      videoEl.srcObject = stream;

      // Audio Analyser for Microphone Volume
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.micAudioCtx = new AudioCtx();
      if (this.micAudioCtx.state === "suspended") {
        this.micAudioCtx.resume();
      }

      const source = this.micAudioCtx.createMediaStreamSource(stream);
      const analyser = this.micAudioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      this.micAnalyser = analyser;

      startBtn.style.display = "none";
      stopBtn.disabled = false;
      stopBtn.style.display = "inline-flex";

      this.pollMicVolume();
    } catch (err) {
      console.warn("Media capture permission or device issue:", err);
      startBtn.disabled = false;
      startBtn.textContent = "Start Camera & Mic";
      micText.textContent = `Error: ${err.name || "Access Denied"}`;
      alert(`Camera & Microphone access: ${err.message}\n(Ensure device has camera/mic and permission is granted)`);
    }
  }

  pollMicVolume() {
    if (!this.micAnalyser) return;

    const dataArray = new Uint8Array(this.micAnalyser.frequencyBinCount);
    this.micAnalyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    const pct = Math.min(100, Math.round((avg / 128) * 100));

    const fill = document.getElementById("micVolumeBar");
    const text = document.getElementById("micVolumeDb");
    if (fill) fill.style.width = `${pct}%`;
    if (text) {
      const db = avg > 0 ? Math.round(20 * Math.log10(avg / 255)) : -60;
      text.textContent = `Mic Level: ${db} dB (${pct > 5 ? "Audio Active" : "Quiet"})`;
    }

    this.micAnimFrameId = requestAnimationFrame(() => this.pollMicVolume());
  }

  stopMediaDiagnostic() {
    if (this.micAnimFrameId) {
      cancelAnimationFrame(this.micAnimFrameId);
      this.micAnimFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.micAudioCtx) {
      this.micAudioCtx.close().catch(() => {});
      this.micAudioCtx = null;
    }
    this.micAnalyser = null;

    const videoEl = document.getElementById("webcamPreview");
    if (videoEl) videoEl.srcObject = null;

    const fill = document.getElementById("micVolumeBar");
    const text = document.getElementById("micVolumeDb");
    if (fill) fill.style.width = "0%";
    if (text) text.textContent = "Mic: Inactive";

    const startBtn = document.getElementById("startMediaBtn");
    const stopBtn = document.getElementById("stopMediaBtn");
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.style.display = "inline-flex";
      startBtn.textContent = "Start Camera & Mic";
    }
    if (stopBtn) {
      stopBtn.disabled = true;
      stopBtn.style.display = "none";
    }
  }

  // --------------------------------------------------------------------------
  // Interactive Tool: Trackpad & Gesture Canvas
  // --------------------------------------------------------------------------
  initTrackpadCanvas() {
    const canvas = document.getElementById("trackpadCanvas");
    const clearBtn = document.getElementById("clearCanvasBtn");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const colors = ["#2563eb", "#059669", "#d97706", "#dc2626", "#8b5cf6", "#ec4899"];

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    };

    const updateStatus = (text) => {
      const lbl = document.getElementById("trackpadLastEvent");
      if (lbl) lbl.textContent = text;
      const fingers = document.getElementById("trackpadTouchCount");
      if (fingers) fingers.textContent = `Fingers: ${this.activePointers.size}`;
    };

    canvas.addEventListener("pointerdown", (e) => {
      canvas.setPointerCapture(e.pointerId);
      const pos = getPos(e);
      const color = colors[e.pointerId % colors.length];
      this.activePointers.set(e.pointerId, { lastX: pos.x, lastY: pos.y, color });

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      const btnType = e.button === 0 ? "Left Click" : e.button === 2 ? "Right Click" : `Button ${e.button}`;
      updateStatus(`${btnType} at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!this.activePointers.has(e.pointerId)) return;
      const prev = this.activePointers.get(e.pointerId);
      const pos = getPos(e);

      ctx.beginPath();
      ctx.moveTo(prev.lastX, prev.lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = prev.color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();

      prev.lastX = pos.x;
      prev.lastY = pos.y;
      updateStatus(`Tracking Finger #${e.pointerId} at (${Math.round(pos.x)}, ${Math.round(pos.y)})`);
    });

    const release = (e) => {
      if (this.activePointers.has(e.pointerId)) {
        this.activePointers.delete(e.pointerId);
      }
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
      updateStatus(this.activePointers.size > 0 ? "Tracking..." : "Finger released");
    };

    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      updateStatus(`2-Finger Scroll Delta Y: ${Math.round(e.deltaY)}`);
    }, { passive: false });

    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      updateStatus("Physical Right-Click Registered");
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateStatus("Canvas cleared. Draw or click to test tracking");
      });
    }
  }

  // --------------------------------------------------------------------------
  // Interactive Tool: Keyboard Matrix
  // --------------------------------------------------------------------------
  buildKeyboard() {
    const container = document.getElementById("virtualKeyboard");
    if (!container) return;
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

  // --------------------------------------------------------------------------
  // Interactive Tool: Dead & Stuck Pixel Screen Tester
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // History
  // --------------------------------------------------------------------------
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
