(() => {
  "use strict";

  const panel = document.getElementById("panel");
  const nav = document.getElementById("topicNav");
  const topicSelect = document.getElementById("topicSelect");
  const themeToggle = document.getElementById("themeToggle");

  const defaults = {
    mass: 2, speed: 4, force: 12, distance: 3, workAngle: 30,
    capacitance: 220, voltage: 12, dielectric: 1, plateArea: 100, gap: 1,
    c1: 4, c2: 6, c3: 3, c4: 8, capBattery: 12,
    ohmVoltage: 12, resistance: 6, r1: 4, r2: 8, r3: 12, internalR: 1, battery: 18,
    charge: 1.6, particleSpeed: 2, field: 0.5, particleAngle: 90,
    wireCurrent: 3, wireLength: 0.2, wireAngle: 90,
    ionCharge: 1.6, detectorGap: 0.08, accelVoltage: 2000,
    loopArea: 0.02, turns: 100, fluxAngle: 0, fieldRate: 0.2, coilResistance: 10,
    coilRadius: 0.08, rotation: 60, targetEmf: 12,
    acR: 100, inductance: 20, acCapacitance: 100, sourceVoltage: 12, frequency: 5
  };

  const values = { ...defaults };
  let currentTopic = "energy";
  let dark = true;

  const topics = {
    energy: {
      number: "01", title: "Work & energy", eyebrow: "MECHANICS", intro: "Connect motion, force, displacement, and energy. Change a quantity to see how the result responds.",
      formula: "K = ½mv²", description: "Kinetic energy grows linearly with mass and with the square of speed."
    },
    capacitors: {
      number: "02", title: "Capacitors", eyebrow: "ELECTRIC POTENTIAL", intro: "Explore charge storage, electric potential, plate geometry, and a mixed capacitor network.",
      formula: "Q = CV", description: "Capacitance tells you how much charge is stored per volt of potential difference."
    },
    dc: {
      number: "03", title: "DC circuits", eyebrow: "CURRENT & RESISTANCE", intro: "Relate voltage, current, resistance, and power, then inspect a network with battery internal resistance.",
      formula: "V = IR", description: "For an ohmic resistor at fixed resistance, current is proportional to voltage."
    },
    magnetic: {
      number: "04", title: "Magnetic force", eyebrow: "MAGNETISM", intro: "Compare magnetic force on a moving charge and a current-carrying wire, then connect circular motion to a mass spectrometer.",
      formula: "F = |q|vB sin θ", description: "Magnetic force is largest when motion is perpendicular to the field and zero when parallel."
    },
    induction: {
      number: "05", title: "Flux & induction", eyebrow: "ELECTROMAGNETIC INDUCTION", intro: "Follow magnetic flux through a loop and use Faraday's law to calculate induced emf and current.",
      formula: "ε = |N ΔΦB / Δt|", description: "An induced emf appears when the magnetic flux linkage changes."
    },
    ac: {
      number: "06", title: "AC & resonance", eyebrow: "ALTERNATING CURRENT", intro: "Explore reactance, impedance, phase, resonance, and the frequency response of a series-RLC circuit.",
      formula: "Z = √(R² + (XL − XC)²)", description: "At resonance, inductive and capacitive reactance cancel in an ideal series-RLC circuit."
    }
  };

  function n(key) {
    const el = panel.querySelector('[data-key="' + key + '"][data-role="number"]');
    const raw = el ? el.value : values[key];
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function fmt(value, digits) {
    if (!Number.isFinite(value)) return "—";
    if (value === 0) return "0";
    const abs = Math.abs(value);
    if (abs >= 1e5 || abs < 1e-3) return value.toExponential(digits == null ? 3 : digits);
    return Number(value.toPrecision(digits == null ? 4 : digits)).toLocaleString("en-US", { maximumFractionDigits: digits == null ? 4 : digits });
  }

  function field(key, label, min, max, step, unit, digits) {
    const value = values[key];
    const id = "field-" + key;
    return '<div class="field"><div class="field-heading"><label for="' + id + '">' + label + '</label><span class="field-unit">' + (unit || "") + '</span></div>' +
      '<input id="' + id + '" class="range-input" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" data-key="' + key + '" data-role="range">' +
      '<div class="number-wrap"><input aria-label="' + label + ' numeric value" type="number" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" data-key="' + key + '" data-role="number"><span>' + (unit || "") + '</span></div></div>';
  }

  function result(id, label, unit) {
    return '<div class="result-row"><span>' + label + '</span><strong><output id="' + id + '">—</output> <small>' + (unit || "") + '</small></strong></div>';
  }

  function card(title, subtitle, fields, results, extra) {
    return '<section class="card"><div class="card-head"><div><p class="card-kicker">' + (subtitle || "INTERACTIVE MODEL") + '</p><h3>' + title + '</h3></div></div>' +
      (extra || "") + '<div class="model-grid"><div class="controls">' + fields + '</div><div class="readout">' + results + '</div></div></section>';
  }

  function button(label, action, className) {
    return '<button type="button" class="' + (className || "small-button") + '" data-action="' + action + '">' + label + '</button>';
  }

  function concept(question, answer) {
    return '<details class="concept"><summary>' + question + '</summary><p>' + answer + '</p></details>';
  }

  function renderEnergy() {
    return card("Kinetic energy", "EQUATION SHEET", 
      field("mass", "Mass", 0.1, 20, 0.1, "kg") + field("speed", "Speed", 0, 30, 0.1, "m/s"),
      result("kinetic", "Kinetic energy", "J") + result("doubleKinetic", "Energy at 2× speed", "J") +
      '<p class="readout-note">Doubling speed multiplies kinetic energy by four, because speed is squared.</p>',
      '<div class="equation-strip"><span>K = ½mv²</span><span class="equation-tag">KINETIC ENERGY</span></div>') +
      card("Work by a constant force", "EQUATION SHEET",
        field("force", "Force magnitude", 0, 100, 0.5, "N") + field("distance", "Displacement", 0, 20, 0.1, "m") + field("workAngle", "Angle between force and displacement", 0, 180, 1, "°"),
        result("work", "Work", "J") + result("workSign", "Work type", "") +
        '<p class="readout-note">W = Fd cos θ. This model assumes a constant force over a straight displacement.</p>') +
      concept("Why does doubling speed quadruple kinetic energy?", "Kinetic energy is proportional to v². Replacing v with 2v gives ½m(2v)² = 4(½mv²).") +
      concept("Does positive work always mean an object speeds up?", "Positive net work increases kinetic energy. The work done by one individual force can be positive while other forces do negative work, so use net work for the work-energy theorem.");
  }

  function renderCapacitors() {
    return card("Charge, voltage & stored energy", "CAPACITOR BASICS",
      field("capacitance", "Capacitance", 1, 1000, 1, "µF") + field("voltage", "Potential difference", 0, 100, 0.5, "V"),
      result("capCharge", "Stored charge", "µC") + result("capEnergy", "Stored energy", "mJ") +
      '<p class="readout-note">Q = CV · U = ½CV²</p>') +
      card("Parallel-plate capacitor", "GEOMETRY MODEL",
        field("dielectric", "Relative dielectric constant κ", 1, 10, 0.1, "") + field("plateArea", "Plate area", 1, 500, 1, "cm²") + field("gap", "Plate separation", 0.1, 10, 0.1, "mm"),
        result("plateCap", "Capacitance", "pF") + '<p class="readout-note">C = κε₀A/d. Increasing plate area increases capacitance; increasing separation decreases it.</p>') +
      card("Studio 6 · mixed capacitor network", "STUDIO PRESET",
        field("c1", "C₁", 0.1, 30, 0.1, "µF") + field("c2", "C₂", 0.1, 30, 0.1, "µF") + field("c3", "C₃", 0.1, 30, 0.1, "µF") + field("c4", "C₄", 0.1, 30, 0.1, "µF") + field("capBattery", "Battery voltage", 0, 50, 0.5, "V"),
        result("capEquivalent", "Equivalent capacitance", "µF") + result("capNetworkCharge", "Battery charge", "µC") + result("capNetworkEnergy", "Total stored energy", "mJ") + result("capInnerVoltage", "Voltage across inner parallel section", "V") + result("capQ1", "Charge on C₁ and C₂", "µC") + result("capQ3", "Charge on C₃", "µC") + result("capQ4", "Charge on C₄", "µC"),
        '<div class="topology"><span>C₁ — C₂</span><b>‖ C₃</b><span>— C₄</span></div>' + button("Load Studio 6 preset", "preset-capacitors")) +
      concept("What stays the same in series and parallel?", "Ideal capacitors in series carry equal-magnitude charge. Capacitors in parallel share the same potential difference.");
  }

  function renderDC() {
    return card("Ohm's law & resistor power", "DC FUNDAMENTALS",
      field("ohmVoltage", "Voltage", 0, 48, 0.5, "V") + field("resistance", "Resistance", 0.1, 100, 0.1, "Ω"),
      result("dcCurrent", "Current", "A") + result("dcPower", "Power dissipated", "W") +
      '<p class="readout-note">V = IR · P = IV = I²R = V²/R</p>') +
      card("Studio 7 · battery and resistor network", "INTERNAL RESISTANCE",
        field("battery", "Battery emf", 0, 48, 0.5, "V") + field("internalR", "Internal resistance r", 0, 20, 0.1, "Ω") + field("r1", "Series resistor R₁", 0.1, 50, 0.1, "Ω") + field("r2", "Parallel resistor R₂", 0.1, 50, 0.1, "Ω") + field("r3", "Parallel resistor R₃", 0.1, 50, 0.1, "Ω"),
        result("parallelR", "R₂ ‖ R₃", "Ω") + result("loadR", "External load", "Ω") + result("networkCurrent", "Total current", "A") + result("branchVoltage", "Parallel branch voltage", "V") + result("branchI2", "Current through R₂", "A") + result("branchI3", "Current through R₃", "A") + result("kcl", "KCL check (I₂ + I₃)", "A"),
        button("Load Studio 7 preset", "preset-dc")) +
      concept("What does Kirchhoff's current law express?", "Charge conservation at a junction: the total current entering a junction equals the total current leaving it.") +
      concept("Why is terminal voltage lower than emf under load?", "Current through a battery's internal resistance produces an internal voltage drop. For a discharging battery, terminal voltage is ε − Ir.");
  }

  function renderMagnetic() {
    return card("Magnetic force on a charged particle", "LORENTZ FORCE",
      field("charge", "Charge magnitude", 0.1, 5, 0.1, "nC") + field("particleSpeed", "Particle speed", 0, 20, 0.1, "Mm/s") + field("field", "Magnetic field", 0, 2, 0.01, "T") + field("particleAngle", "Angle between v and B", 0, 180, 1, "°"),
      result("particleForce", "Force magnitude", "mN") + result("particleDirection", "Force direction", "") +
      '<p class="readout-note">F = |q|vB sin θ. Direction depends on charge sign and the orientation of v × B.</p>') +
      card("Force on a current-carrying wire", "WIRE IN A FIELD",
        field("wireCurrent", "Current", 0, 20, 0.1, "A") + field("wireLength", "Length in field", 0, 2, 0.01, "m") + field("field", "Magnetic field", 0, 2, 0.01, "T") + field("wireAngle", "Angle between wire and B", 0, 180, 1, "°"),
        result("wireForce", "Force magnitude", "N") + '<p class="readout-note">F = IℓB sin θ. For a wire with multiple differently oriented segments, evaluate each segment separately.</p>') +
      card("Studio 8 · mass spectrometer", "DERIVED MODEL",
        field("ionCharge", "Ion charge magnitude", 0.1, 5, 0.1, "nC") + field("field", "Magnetic field", 0.01, 2, 0.01, "T") + field("detectorGap", "Detector separation (semicircle diameter)", 0.001, 0.5, 0.001, "m") + field("accelVoltage", "Accelerating voltage", 1, 10000, 10, "V"),
        result("ionMass", "Ion mass", "kg") + result("ionMassAmu", "Ion mass", "u"),
        button("Load Studio 8 preset", "preset-magnetic")) +
      concept("When is magnetic force zero?", "The magnitude is zero when the velocity is parallel or antiparallel to the magnetic field (θ = 0° or 180°). A stationary charge also experiences no magnetic force.");
  }

  function renderInduction() {
    return card("Flux and Faraday's law", "INDUCTION MODEL",
      field("field", "Magnetic field", 0, 2, 0.01, "T") + field("loopArea", "Loop area", 0.001, 0.2, 0.001, "m²") + field("fluxAngle", "Angle between B and area normal", 0, 180, 1, "°") + field("turns", "Number of turns", 1, 500, 1, "") + field("fieldRate", "Rate of field change", 0, 2, 0.01, "T/s") + field("coilResistance", "Coil resistance", 0.1, 100, 0.1, "Ω"),
      result("singleFlux", "Flux per loop", "Wb") + result("fluxLinkage", "Flux linkage", "Wb-turn") + result("inducedEmf", "Induced emf magnitude", "V") + result("inducedCurrent", "Induced current magnitude", "A") +
      '<p class="readout-note">This model changes B while holding area and orientation fixed. The direction of induced current depends on whether flux is increasing or decreasing.</p>') +
      card("Studio 9 · rotating-coil alternator", "ROTATING COIL",
        field("turns", "Number of turns", 1, 500, 1, "") + field("coilRadius", "Coil radius", 0.01, 0.3, 0.005, "m") + field("rotation", "Rotation rate", 1, 600, 1, "rpm") + field("targetEmf", "Target peak emf", 0.1, 100, 0.1, "V"),
        result("rotationHz", "Rotation frequency", "Hz") + result("rotationOmega", "Angular frequency", "rad/s") + result("requiredField", "Required magnetic field", "T"),
        button("Load Studio 9 preset", "preset-induction")) +
      concept("What does Lenz's law tell you?", "The induced current creates a magnetic field that opposes the change in magnetic flux that produced it. It does not necessarily oppose the original field itself.");
  }

  function renderAC() {
    return card("Series-RLC circuit", "AC RESPONSE",
      field("acR", "Resistance R", 1, 1000, 1, "Ω") + field("inductance", "Inductance L", 1, 200, 1, "mH") + field("acCapacitance", "Capacitance C", 1, 1000, 1, "nF") + field("sourceVoltage", "Peak source voltage", 0.1, 50, 0.1, "V") + field("frequency", "Driving frequency", 0.1, 100, 0.1, "kHz"),
      result("angularFrequency", "Angular frequency", "rad/s") + result("xl", "Inductive reactance", "Ω") + result("xc", "Capacitive reactance", "Ω") + result("impedance", "Impedance", "Ω") + result("phase", "Phase angle", "°") + result("peakCurrent", "Peak current", "A") + result("rmsCurrent", "RMS current", "A") + result("rmsVoltage", "RMS source voltage", "V") + result("powerFactor", "Power factor", "") + result("averagePower", "Average resistor power", "W"),
      '<div class="graph-wrap"><canvas id="rlcGraph" aria-label="Series RLC current amplitude versus frequency graph"></canvas><div class="graph-caption"><span>Current amplitude vs. frequency</span><span>Resonance marked</span></div></div>') +
      card("Resonance characteristics", "SERIES RLC",
        '<p class="static-note">Resonance occurs when Xₗ = X꜀. The ideal series circuit then has minimum impedance and maximum current.</p>',
        result("resonanceOmega", "Resonant angular frequency", "rad/s") + result("resonanceHz", "Resonant frequency", "Hz") + result("bandwidth", "Bandwidth Δf", "Hz") + result("angularBandwidth", "Angular bandwidth Δω", "rad/s") + result("resonantCurrent", "Peak current at resonance", "A")) +
      button("Load Studio 10 preset", "preset-ac", "small-button preset-button") +
      concept("What changes at resonance?", "In an ideal series-RLC circuit, inductive and capacitive reactance have equal magnitude and cancel. The impedance is then R, the phase angle is zero, and current is maximum for a fixed source voltage.");
  }

  function render() {
    const t = topics[currentTopic];
    const renderers = { energy: renderEnergy, capacitors: renderCapacitors, dc: renderDC, magnetic: renderMagnetic, induction: renderInduction, ac: renderAC };
    panel.innerHTML = '<section class="topic-hero"><div><p class="eyebrow">' + t.eyebrow + ' <span>·</span> TOPIC ' + t.number + '</p><h1>' + t.title + '</h1><p class="hero-copy">' + t.intro + '</p></div><div class="hero-equation"><span>CORE RELATIONSHIP</span><strong>' + t.formula + '</strong><small>' + t.description + '</small></div></section><div class="section-heading"><div><p class="eyebrow">EXPLORE THE RELATIONSHIPS</p><h2>Interactive models</h2></div><span class="live-indicator"><i></i> LIVE CALCULATIONS</span></div>' + renderers[currentTopic]();
    nav.querySelectorAll("[data-topic]").forEach(el => el.classList.toggle("active", el.dataset.topic === currentTopic));
    topicSelect.value = currentTopic;
    panel.querySelectorAll("[data-key]").forEach(el => {
      if (el.dataset.role === "number") values[el.dataset.key] = Number(el.value);
    });
    update();
  }

  function setOut(id, value, digits) {
    const el = document.getElementById(id);
    if (el) el.textContent = fmt(value, digits);
  }

  function update() {
    const rad = Math.PI / 180;
    if (currentTopic === "energy") {
      const k = 0.5 * n("mass") * n("speed") ** 2;
      setOut("kinetic", k); setOut("doubleKinetic", 4 * k);
      const w = n("force") * n("distance") * Math.cos(n("workAngle") * rad);
      setOut("work", w); setOut("workSign", Math.abs(w) < 1e-10 ? "Zero" : w > 0 ? "Positive" : "Negative");
    }
    if (currentTopic === "capacitors") {
      const c = n("capacitance") * 1e-6, v = n("voltage");
      setOut("capCharge", c * v * 1e6); setOut("capEnergy", 0.5 * c * v * v * 1e3);
      const eps0 = 8.8541878128e-12;
      setOut("plateCap", n("dielectric") * eps0 * n("plateArea") * 1e-4 / (n("gap") * 1e-3) * 1e12);
      const c1 = n("c1"), c2 = n("c2"), c3 = n("c3"), c4 = n("c4"), vb = n("capBattery");
      const c12 = c1 * c2 / (c1 + c2), c123 = c12 + c3, ceq = c123 * c4 / (c123 + c4);
      const q = ceq * vb, vin = c123 ? q / c123 : 0, q12 = c12 * vin;
      setOut("capEquivalent", ceq); setOut("capNetworkCharge", q); setOut("capNetworkEnergy", 0.5 * ceq * 1e-6 * vb * vb * 1e3);
      setOut("capInnerVoltage", vin); setOut("capQ1", q12); setOut("capQ3", c3 * vin); setOut("capQ4", q);
    }
    if (currentTopic === "dc") {
      const i = n("ohmVoltage") / n("resistance");
      setOut("dcCurrent", i); setOut("dcPower", n("ohmVoltage") * i);
      const r2 = n("r2"), r3 = n("r3"), rp = r2 * r3 / (r2 + r3), load = n("r1") + rp;
      const total = load + n("internalR"), current = n("battery") / total, vb = current * rp;
      const i2 = vb / r2, i3 = vb / r3;
      setOut("parallelR", rp); setOut("loadR", load); setOut("networkCurrent", current);
      setOut("branchVoltage", vb); setOut("branchI2", i2); setOut("branchI3", i3); setOut("kcl", i2 + i3);
    }
    if (currentTopic === "magnetic") {
      const q = n("charge") * 1e-9, speed = n("particleSpeed") * 1e6, b = n("field");
      const fp = Math.abs(q) * speed * b * Math.sin(n("particleAngle") * rad) * 1e3;
      setOut("particleForce", fp);
      setOut("particleDirection", fp < 1e-12 ? "Zero" : "Perpendicular component");
      setOut("wireForce", n("wireCurrent") * n("wireLength") * b * Math.sin(n("wireAngle") * rad));
      const qi = n("ionCharge") * 1e-9, x = n("detectorGap"), vacc = n("accelVoltage");
      const mass = vacc > 0 ? qi * b * b * x * x / (8 * vacc) : NaN;
      setOut("ionMass", mass, 5); setOut("ionMassAmu", mass / 1.6605390666e-27, 5);
    }
    if (currentTopic === "induction") {
      const b = n("field"), area = n("loopArea"), theta = n("fluxAngle") * rad, turns = n("turns");
      const flux = b * area * Math.cos(theta), linkage = turns * flux;
      const emf = turns * area * Math.abs(n("fieldRate")) * Math.abs(Math.cos(theta));
      setOut("singleFlux", flux, 5); setOut("fluxLinkage", linkage, 5);
      setOut("inducedEmf", emf); setOut("inducedCurrent", emf / n("coilResistance"));
      const f = n("rotation") / 60, omega = 2 * Math.PI * f, radius = n("coilRadius"), target = n("targetEmf");
      const coilArea = Math.PI * radius * radius, required = turns * coilArea * omega > 0 ? target / (turns * coilArea * omega) : NaN;
      setOut("rotationHz", f); setOut("rotationOmega", omega); setOut("requiredField", required);
    }
    if (currentTopic === "ac") {
      const r = n("acR"), l = n("inductance") * 1e-3, c = n("acCapacitance") * 1e-9;
      const f = n("frequency") * 1e3, vp = n("sourceVoltage"), omega = 2 * Math.PI * f;
      const xl = omega * l, xc = 1 / (omega * c), z = Math.sqrt(r * r + (xl - xc) ** 2);
      const ip = vp / z, irms = ip / Math.sqrt(2), vrms = vp / Math.sqrt(2);
      const phi = Math.atan2(xl - xc, r), pf = Math.cos(phi), pavg = irms * irms * r;
      const omega0 = 1 / Math.sqrt(l * c), f0 = omega0 / (2 * Math.PI), df = r / (2 * Math.PI * l);
      setOut("angularFrequency", omega); setOut("xl", xl); setOut("xc", xc); setOut("impedance", z);
      setOut("phase", phi / rad); setOut("peakCurrent", ip); setOut("rmsCurrent", irms); setOut("rmsVoltage", vrms);
      setOut("powerFactor", pf); setOut("averagePower", pavg); setOut("resonanceOmega", omega0);
      setOut("resonanceHz", f0); setOut("bandwidth", df); setOut("angularBandwidth", r / l); setOut("resonantCurrent", vp / r);
      drawGraph(r, l, c, vp, f, f0);
    }
  }

  function drawGraph(r, l, c, vp, selectedFrequency, f0) {
    const canvas = document.getElementById("rlcGraph");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(300, Math.floor(rect.width * devicePixelRatio));
    const height = Math.max(180, Math.floor(220 * devicePixelRatio));
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d");
    const pad = 34 * devicePixelRatio, right = width - 12 * devicePixelRatio, bottom = height - 26 * devicePixelRatio, top = 12 * devicePixelRatio;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--line").trim() || "#29364a";
    ctx.lineWidth = devicePixelRatio;
    for (let j = 0; j < 4; j++) {
      const y = top + (bottom - top) * j / 3;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(right, y); ctx.stroke();
    }
    const maxHz = Math.max(f0 * 2.5, selectedFrequency * 1.25, 100);
    const minHz = Math.max(0.1, maxHz / 100);
    const maxI = vp / r;
    ctx.beginPath();
    for (let j = 0; j <= 240; j++) {
      const f = minHz + (maxHz - minHz) * j / 240, w = 2 * Math.PI * f;
      const z = Math.sqrt(r * r + (w * l - 1 / (w * c)) ** 2);
      const current = vp / z;
      const x = pad + (right - pad) * j / 240, y = bottom - (bottom - top) * current / maxI;
      if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#7c9cff";
    ctx.lineWidth = 2.5 * devicePixelRatio; ctx.stroke();
    const rx = pad + (right - pad) * Math.min(1, Math.max(0, (f0 - minHz) / (maxHz - minHz)));
    ctx.setLineDash([5 * devicePixelRatio, 4 * devicePixelRatio]); ctx.beginPath(); ctx.moveTo(rx, top); ctx.lineTo(rx, bottom);
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--accent-2").trim() || "#36c9a0"; ctx.lineWidth = devicePixelRatio; ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--muted").trim() || "#8b96a8";
    ctx.font = (10 * devicePixelRatio) + "px system-ui"; ctx.fillText("0", pad - 3 * devicePixelRatio, height - 7 * devicePixelRatio);
    ctx.fillText(fmt(maxHz / 1000, 2) + " kHz", right - 48 * devicePixelRatio, height - 7 * devicePixelRatio);
    ctx.fillText("f₀", rx + 4 * devicePixelRatio, top + 12 * devicePixelRatio);
  }

  function preset(name) {
    const presets = {
      capacitors: { c1: 4, c2: 6, c3: 3, c4: 8, capBattery: 12 },
      dc: { battery: 18, internalR: 1, r1: 4, r2: 8, r3: 12 },
      magnetic: { ionCharge: 1.6, field: 0.5, detectorGap: 0.08, accelVoltage: 2000 },
      induction: { turns: 100, coilRadius: 0.08, rotation: 60, targetEmf: 12 },
      ac: { acR: 100, inductance: 20, acCapacitance: 100, sourceVoltage: 12, frequency: 5 }
    };
    Object.assign(values, presets[name] || {});
    render();
  }

  panel.addEventListener("input", event => {
    const el = event.target;
    if (!el.matches("[data-key]")) return;
    const key = el.dataset.key;
    const value = Number(el.value);
    if (!Number.isFinite(value)) return;
    values[key] = value;
    panel.querySelectorAll('[data-key="' + key + '"]').forEach(peer => {
      if (peer !== el) peer.value = el.value;
    });
    update();
  });

  panel.addEventListener("click", event => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    if (action.startsWith("preset-")) preset(action.slice(7));
  });

  nav.addEventListener("click", event => {
    const buttonEl = event.target.closest("[data-topic]");
    if (!buttonEl) return;
    currentTopic = buttonEl.dataset.topic;
    render();
  });

  topicSelect.addEventListener("change", () => {
    currentTopic = topicSelect.value;
    render();
  });

  themeToggle.addEventListener("click", () => {
    dark = !dark;
    document.body.classList.toggle("light-theme", !dark);
    themeToggle.textContent = dark ? "◐" : "☼";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    update();
  });

  window.addEventListener("resize", () => {
    if (currentTopic === "ac") update();
  });

  render();
})();