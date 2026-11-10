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
    charge: 1.6e-10, particleSpeed: 3.2, particleField: 0.4, particleAngle: 90,
    wireCurrent: 3.5, wireLength: 0.08, wireField: 0.06, wireAngle: 90,
    ionCharge: 1, ionField: 0.3, detectorGap: 0.3, accelVoltage: 3200,
    loopArea: 0.02, turns: 100, fluxAngle: 0, fieldRate: 0.2, coilResistance: 10,
    alternatorTurns: 250, coilRadius: 0.05, rotation: 1200, targetEmf: 14,
    acR: 50, inductance: 1, acCapacitance: 10, sourceVoltage: 10, frequency: 50.329
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
    const raw = el && el.value.trim() !== "" ? el.value : values[key];
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
    return '<div class="field"><div class="field-heading"><label for="' + id + '-range">' + label + '</label><span class="field-unit">' + (unit || "") + '</span></div>' +
      '<input id="' + id + '-range" class="range-input" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" data-key="' + key + '" data-role="range">' +
      '<div class="number-wrap"><input id="' + id + '" aria-label="' + label + ' numeric value" type="number" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" data-key="' + key + '" data-role="number"><span>' + (unit || "") + '</span></div></div>';
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
      card("Studio 6 · mixed capacitor network", "NETWORK EXAMPLE",
        field("c1", "C₁", 0.1, 30, 0.1, "µF") + field("c2", "C₂", 0.1, 30, 0.1, "µF") + field("c3", "C₃", 0.1, 30, 0.1, "µF") + field("c4", "C₄", 0.1, 30, 0.1, "µF") + field("capBattery", "Battery voltage", 0, 50, 0.5, "V"),
        result("capEquivalent", "Equivalent capacitance", "µF") + result("capNetworkCharge", "Battery charge", "µC") + result("capNetworkEnergy", "Total stored energy", "mJ") + result("capInnerVoltage", "Voltage across inner parallel section", "V") + result("capQ1", "Charge on C₁ and C₂", "µC") + result("capQ3", "Charge on C₃", "µC") + result("capQ4", "Charge on C₄", "µC") + '<p class="readout-note">Studio 6 Problem 1 values: C₁ = 3 µF, C₂ = 6 µF, C₃ = 4 µF, C₄ = 12 µF, V₀ = 12 V. The network is (C₁ in series with C₂) in parallel with C₃, then in series with C₄.</p>',
        '<div class="topology"><span>C₁ — C₂</span><b>‖ C₃</b><span>— C₄</span></div>' + button("Load example values", "preset-capacitors")) +
      concept("What stays the same in series and parallel?", "Ideal capacitors in series carry equal-magnitude charge. Capacitors in parallel share the same potential difference.");
  }

  function renderDC() {
    return card("Ohm's law & resistor power", "DC FUNDAMENTALS",
      field("ohmVoltage", "Voltage", 0, 48, 0.5, "V") + field("resistance", "Resistance", 0.1, 100, 0.1, "Ω"),
      result("dcCurrent", "Current", "A") + result("dcPower", "Power dissipated", "W") +
      '<p class="readout-note">V = IR · P = IV = I²R = V²/R</p>') +
      card("Studio 7 · battery and resistor network", "NETWORK EXAMPLE",
        field("battery", "Battery emf", 0, 48, 0.5, "V") + field("internalR", "Internal resistance r", 0, 20, 0.1, "Ω") + field("r1", "Series resistor R₁", 0.1, 50, 0.1, "Ω") + field("r2", "Parallel resistor R₂", 0.1, 50, 0.1, "Ω") + field("r3", "Parallel resistor R₃", 0.1, 50, 0.1, "Ω"),
        result("parallelR", "R₂ ‖ R₃", "Ω") + result("loadR", "External load", "Ω") + result("networkCurrent", "Total current", "A") + result("branchVoltage", "Parallel branch voltage", "V") + result("branchI2", "Current through R₂", "A") + result("branchI3", "Current through R₃", "A") + result("kcl", "KCL check (I₂ + I₃)", "A") + '<p class="readout-note">Studio 7 Problem 2: R₁ = 33 Ω in series with R₂ ‖ R₃, where R₂ = 33 Ω and R₃ = 47 Ω. Include the source internal resistance rᵦ = 12.5 Ω; Vᵦ = 6 V.</p>',
        button("Load example values", "preset-dc")) +
      concept("What does Kirchhoff's current law express?", "Charge conservation at a junction: the total current entering a junction equals the total current leaving it.") +
      concept("Why is terminal voltage lower than emf under load?", "Current through a battery's internal resistance produces an internal voltage drop. For a discharging battery, terminal voltage is ε − Ir.");
  }

  function renderMagnetic() {
    return card("Magnetic force on a charged particle", "LORENTZ FORCE",
      field("charge", "Charge magnitude", 1e-12, 1, 1e-12, "nC") + field("particleSpeed", "Particle speed", 0, 20, 0.1, "Mm/s") + field("particleField", "Magnetic field", 0, 2, 0.01, "T") + field("particleAngle", "Angle between v and B", 0, 180, 1, "°"),
      result("particleForce", "Force magnitude", "mN") + result("particleDirection", "Force direction", "") +
      '<p class="readout-note">F = |q|vB sin θ. Direction depends on charge sign and the orientation of v × B.</p>') +
      card("Force on a current-carrying wire", "WIRE IN A FIELD",
        field("wireCurrent", "Current", 0, 20, 0.1, "A") + field("wireLength", "Length in field", 0, 2, 0.01, "m") + field("wireField", "Magnetic field", 0, 2, 0.01, "T") + field("wireAngle", "Angle between wire and B", 0, 180, 1, "°"),
        result("wireForce", "Force magnitude", "N") + '<p class="readout-note">F = IℓB sin θ. For a wire with multiple differently oriented segments, evaluate each segment separately.</p>') +
      card("Studio 8 · mass spectrometer", "DERIVED EXAMPLE",
        field("ionCharge", "Ion charge magnitude", 1, 5, 1, "e") + field("ionField", "Magnetic field", 0.01, 2, 0.01, "T") + field("detectorGap", "Detector separation (semicircle diameter)", 0.001, 0.5, 0.001, "m") + field("accelVoltage", "Accelerating voltage", 1, 10000, 10, "V"),
        result("ionMass", "Ion mass", "kg") + result("ionMassAmu", "Ion mass", "u") + '<p class="readout-note">Studio 8 Problem 4 values: Vₐcc = 3.20 kV, q = +e, B = 0.300 T, detector separation x = 0.300 m. The semicircle radius is x/2.</p>',
        button("Load example values", "preset-magnetic")) +
      concept("When is magnetic force zero?", "The magnitude is zero when the velocity is parallel or antiparallel to the magnetic field (θ = 0° or 180°). A stationary charge also experiences no magnetic force.");
  }

  function renderInduction() {
    return card("Flux and Faraday's law", "INDUCTION MODEL",
      field("field", "Magnetic field", 0, 2, 0.01, "T") + field("loopArea", "Loop area", 0.001, 0.2, 0.001, "m²") + field("fluxAngle", "Angle between B and area normal", 0, 180, 1, "°") + field("turns", "Number of turns", 1, 500, 1, "") + field("fieldRate", "Rate of field change", 0, 2, 0.01, "T/s") + field("coilResistance", "Coil resistance", 0.1, 100, 0.1, "Ω"),
      result("singleFlux", "Flux per loop", "Wb") + result("fluxLinkage", "Flux linkage", "Wb-turn") + result("inducedEmf", "Induced emf magnitude", "V") + result("inducedCurrent", "Induced current magnitude", "A") +
      '<p class="readout-note">This model changes B while holding area and orientation fixed. The direction of induced current depends on whether flux is increasing or decreasing.</p>') +
      card("Studio 9 · rotating-coil alternator", "ROTATING COIL EXAMPLE",
        field("alternatorTurns", "Number of turns", 1, 500, 1, "") + field("coilRadius", "Coil radius", 0.01, 0.3, 0.005, "m") + field("rotation", "Rotation rate", 1, 600, 1, "rpm") + field("targetEmf", "Target peak emf", 0.1, 100, 0.1, "V"),
        result("rotationHz", "Rotation frequency", "Hz") + result("rotationOmega", "Angular frequency", "rad/s") + result("requiredField", "Required magnetic field", "T") + '<p class="readout-note">Studio 9 Problem 4: N = 250 turns, r = 5.0 cm, rotation = 1200 rpm, peak emf = 14 V. Solve B = εpeak/(Nπr²ω).</p>',
        button("Load example values", "preset-induction")) +
      concept("What does Lenz's law tell you?", "The induced current creates a magnetic field that opposes the change in magnetic flux that produced it. It does not necessarily oppose the original field itself.");
  }

  function renderAC() {
    return card("Series-RLC circuit", "AC RESPONSE",
      field("acR", "Resistance R", 1, 1000, 1, "Ω") + field("inductance", "Inductance L", 1, 200, 1, "mH") + field("acCapacitance", "Capacitance C", 1, 1000, 1, "nF") + field("sourceVoltage", "Peak source voltage", 0.1, 50, 0.1, "V") + field("frequency", "Driving frequency", 0.1, 100, 0.1, "kHz"),
      result("angularFrequency", "Angular frequency", "rad/s") + result("xl", "Inductive reactance", "Ω") + result("xc", "Capacitive reactance", "Ω") + result("impedance", "Impedance", "Ω") + result("phase", "Phase angle", "°") + result("peakCurrent", "Peak current", "A") + result("rmsCurrent", "RMS current", "A") + result("rmsVoltage", "RMS source voltage", "V") + result("powerFactor", "Power factor", "") + result("averagePower", "Average resistor power", "W"),
      '<div class="graph-wrap"><canvas id="rlcGraph" aria-label="Series RLC current amplitude versus frequency graph"></canvas><div class="graph-caption"><span>Current amplitude vs. frequency</span><span>Resonance marked</span></div></div>') +
      card("Resonance characteristics", "SERIES RLC EXAMPLE",
        '<p class="static-note">Resonance occurs when Xₗ = X꜀. The ideal series circuit then has minimum impedance and maximum current.</p>',
        result("resonanceOmega", "Resonant angular frequency", "rad/s") + result("resonanceHz", "Resonant frequency", "Hz") + result("bandwidth", "Bandwidth Δf", "Hz") + result("angularBandwidth", "Angular bandwidth Δω", "rad/s") + result("resonantCurrent", "Peak current at resonance", "A") + '<p class="readout-note">Studio 10 Problem 3: R = 50 Ω, L = 1.0 mH, C = 10 nF, V₀ = 10 V. Resonance is at ω₀ = 1/√(LC), with peak current V₀/R.</p>') +
      button("Load example values", "preset-ac", "small-button preset-button") +
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
    if (el) el.textContent = typeof value === "number" ? fmt(value, digits) : String(value);
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
      const q = n("charge") * 1e-9, speed = n("particleSpeed") * 1e6, b = n("particleField");
      const fp = Math.abs(q) * speed * b * Math.sin(n("particleAngle") * rad) * 1e3;
      setOut("particleForce", fp);
      setOut("particleDirection", fp < 1e-12 ? "Zero" : "Perpendicular component");
      setOut("wireForce", n("wireCurrent") * n("wireLength") * n("wireField") * Math.sin(n("wireAngle") * rad));
      const qi = n("ionCharge") * 1.602176634e-19, bi = n("ionField"), x = n("detectorGap"), vacc = n("accelVoltage");
      const mass = vacc > 0 ? qi * bi * bi * x * x / (8 * vacc) : NaN;
      setOut("ionMass", mass, 5); setOut("ionMassAmu", mass / 1.6605390666e-27, 5);
    }
    if (currentTopic === "induction") {
      const b = n("field"), area = n("loopArea"), theta = n("fluxAngle") * rad, turns = n("turns");
      const flux = b * area * Math.cos(theta), linkage = turns * flux;
      const emf = turns * area * Math.abs(n("fieldRate")) * Math.abs(Math.cos(theta));
      setOut("singleFlux", flux, 5); setOut("fluxLinkage", linkage, 5);
      setOut("inducedEmf", emf); setOut("inducedCurrent", emf / n("coilResistance"));
      const f = n("rotation") / 60, omega = 2 * Math.PI * f, radius = n("coilRadius"), target = n("targetEmf");
      const alternatorTurns = n("alternatorTurns"), coilArea = Math.PI * radius * radius, required = alternatorTurns * coilArea * omega > 0 ? target / (alternatorTurns * coilArea * omega) : NaN;
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
      capacitors: { c1: 3, c2: 6, c3: 4, c4: 12, capBattery: 12 },
      dc: { battery: 6, internalR: 12.5, r1: 33, r2: 33, r3: 47 },
      magnetic: { charge: 1.6e-10, particleSpeed: 3.2, particleField: 0.4, particleAngle: 90, wireCurrent: 3.5, wireLength: 0.08, wireField: 0.06, wireAngle: 90, ionCharge: 1, ionField: 0.3, detectorGap: 0.3, accelVoltage: 3200 },
      induction: { turns: 100, alternatorTurns: 250, coilRadius: 0.05, rotation: 1200, targetEmf: 14 },
      ac: { acR: 50, inductance: 1, acCapacitance: 10, sourceVoltage: 10, frequency: 50.329 }
    };
    Object.assign(values, presets[name] || {});
    render();
  }

  panel.addEventListener("input", event => {
    const el = event.target;
    if (!el.matches("[data-key]")) return;
    const key = el.dataset.key;
    if (el.value.trim() === "") return;
    const parsed = Number(el.value);
    if (!Number.isFinite(parsed)) return;
    const min = el.min === "" ? -Infinity : Number(el.min);
    const max = el.max === "" ? Infinity : Number(el.max);
    const value = Math.min(max, Math.max(min, parsed));
    el.value = String(value);
    values[key] = value;
    panel.querySelectorAll('[data-key="' + key + '"]').forEach(peer => {
      if (peer !== el) peer.value = String(value);
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
    updateStudyModels();
  });


  // Extended calculators and local study tools.
  const studyLab = document.getElementById("studyLab");
  const byId = id => document.getElementById(id);
  const val = id => Number(byId(id)?.value ?? 0);
  const put = (id, html) => { const el = byId(id); if (el) el.innerHTML = html; };
  const num = (x, digits = 4) => Number.isFinite(x) ? Number(x.toPrecision(digits)).toLocaleString(undefined, { maximumSignificantDigits: digits }) : "undefined";
  const row = (label, value, unit = "") => '<div class="study-result-row"><span>' + label + '</span><strong>' + value + ' ' + unit + '</strong></div>';
  const safeStore = {
    read(key, fallback) { try { return JSON.parse(localStorage.getItem("physics2v-" + key)) ?? fallback; } catch { return fallback; } },
    write(key, value) { try { localStorage.setItem("physics2v-" + key, JSON.stringify(value)); return true; } catch { return false; } }
  };

  function drawSeries(canvasId, series, labels) {
    const canvas = byId(canvasId); if (!canvas) return;
    const rect = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    const w = Math.max(300, Math.floor((rect.width || 520) * dpr)), h = Math.max(160, Math.floor(210 * dpr));
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d"), pad = 34 * dpr, right = w - 12 * dpr, top = 14 * dpr, bottom = h - 25 * dpr;
    const css = getComputedStyle(document.body);
    const colors = ["--accent", "--accent-2", "--warm", "--muted"].map(k => css.getPropertyValue(k).trim());
    ctx.clearRect(0,0,w,h); ctx.strokeStyle = css.getPropertyValue("--line").trim(); ctx.lineWidth = dpr;
    for (let j=0;j<5;j++) { const y=top+(bottom-top)*j/4; ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(right,y);ctx.stroke(); }
    const maxAbs = Math.max(1e-12, ...series.flatMap(s => s.values.map(Math.abs)));
    series.forEach((s,i) => {
      ctx.beginPath();
      s.values.forEach((v,j) => { const x=pad+(right-pad)*j/(s.values.length-1), y=top+(bottom-top)*(0.5-v/(2*maxAbs)); if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y); });
      ctx.strokeStyle=colors[i%colors.length] || "#8aa8ff";ctx.lineWidth=2*dpr;ctx.stroke();
    });
    ctx.fillStyle=css.getPropertyValue("--muted").trim();ctx.font=(10*dpr)+"px system-ui";
    ctx.fillText(labels?.[0] || "0",pad,bottom+17*dpr);ctx.fillText(labels?.[1] || "time",right-35*dpr,bottom+17*dpr);
  }

  let generatorAnimationId = 0;
  function animateGeneratorWave(angularSpeed) {
    if (generatorAnimationId) cancelAnimationFrame(generatorAnimationId);
    const canvas=byId("genGraph"); if(!canvas)return;
    const reduced=window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start=performance.now(),duration=angularSpeed>0?2*Math.PI/angularSpeed*1000:1000;
    function frame(now){
      const dpr=window.devicePixelRatio||1,ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height,pad=34*dpr,right=w-12*dpr,top=14*dpr,bottom=h-25*dpr;
      const phase=reduced?0:((now-start)%duration)/duration*2*Math.PI;
      const x=pad+(right-pad)*phase/(2*Math.PI),y=top+(bottom-top)*(0.5-Math.sin(phase)/2);
      ctx.beginPath();ctx.arc(x,y,5*dpr,0,2*Math.PI);ctx.fillStyle=getComputedStyle(document.body).getPropertyValue("--warm").trim()||"#f1bd75";ctx.fill();
      if(!reduced)generatorAnimationId=requestAnimationFrame(frame);
    }
    generatorAnimationId=requestAnimationFrame(frame);
  }

  function updateStudyModels() {
    const r1=val("builderR1"),r2=val("builderR2"),r3=val("builderR3"),vs=val("builderV");
    if(r1>0&&r2>0&&r3>0){const topology=byId("builderTopology").value,rp=r2*r3/(r2+r3),rt=topology==="series"?r1+r2+r3:topology==="parallel"?1/(1/r1+1/r2+1/r3):r1+rp,i=vs/rt,vp=topology==="mixed"?i*rp:topology==="parallel"?vs:NaN;put("builderResult",row("Equivalent resistance",num(rt),"Ω")+row("Source current",num(i),"A")+(topology==="mixed"?row("Parallel branch voltage",num(vp),"V")+row("Branch currents",num(vp/r2)+" A + "+num(vp/r3),""):topology==="series"?row("Voltage drops",num(i*r1)+", "+num(i*r2)+", "+num(i*r3),"V"):row("Branch currents",num(vs/r1)+", "+num(vs/r2)+", "+num(vs/r3),"A")));}
    const li=val("lineI"),lr=val("lineR"),lv=val("lineV");
    put("lineResult",row("Line voltage drop",num(li*lr),"V")+row("Line power loss",num(li*li*lr),"W")+row("Load-side voltage",num(lv-li*lr),"V")+row("Supply voltage lost",num(lv>0?100*li*lr/lv:NaN),"%"));
    const mv=val("motorV"),eff=val("motorEff")/100,weight=val("motorWeight"),speed=val("motorSpeed"),pout=weight*speed,pin=eff>0?pout/eff:NaN,current=mv>0?pin/mv:NaN;
    put("motorResult",row("Mechanical output power",num(pout),"W")+row("Required electrical input",num(pin),"W")+row("Motor current",num(current),"A")+row("Efficiency",num(eff*100),"%"));
    const c1=val("shareC1")*1e-6,c2=val("shareC2")*1e-6,v1=val("shareV1"),v2=val("shareV2"),vf=(c1*v1+c2*v2)/(c1+c2),ei=.5*c1*v1*v1+.5*c2*v2*v2,ef=.5*(c1+c2)*vf*vf;
    put("shareResult",row("Final common voltage",num(vf),"V")+row("Initial total charge",num((c1*v1+c2*v2)*1e6),"µC")+row("Initial energy",num(ei*1e3),"mJ")+row("Final energy",num(ef*1e3),"mJ")+row("Energy dissipated in resistor",num((ei-ef)*1e3),"mJ"));
    const tr=val("transR"),tc=val("transC")*1e-6,tl=val("transL")*1e-3,tv=val("transV"),tt=val("transT")*1e-3,tauRC=tr*tc,tauRL=tl/tr,vc=tv*(1-Math.exp(-tt/tauRC)),irc=tv/tr*Math.exp(-tt/tauRC),il=tv/tr*(1-Math.exp(-tt/tauRL));
    put("transResult",row("RC time constant",num(tauRC*1e3),"ms")+row("Capacitor voltage",num(vc),"V")+row("RC charging current",num(irc*1e3),"mA")+row("RL time constant",num(tauRL*1e3),"ms")+row("RL inductor current",num(il*1e3),"mA"));
    const tmax=Math.max(5*tauRC,5*tauRL,1e-9),ts=Array.from({length:121},(_,i)=>tmax*i/120);
    drawSeries("transientGraph",[{values:ts.map(t=>1-Math.exp(-t/tauRC))},{values:ts.map(t=>1-Math.exp(-t/tauRL))}],["0","5τ"]);
    const wr=val("waveR"),wl=val("waveL")*1e-3,wc=val("waveC")*1e-6,wv=val("waveV"),wf=val("waveF"),ww=2*Math.PI*wf,wxl=ww*wl,wxc=1/(ww*wc),wz=Math.sqrt(wr*wr+(wxl-wxc)**2),wi=wv/wz,wphi=Math.atan2(wxl-wxc,wr),period=1/wf;
    put("waveResult",row("Peak current",num(wi),"A")+row("Phase angle",num(wphi*180/Math.PI),"°")+row("Peak resistor voltage",num(wi*wr),"V")+row("Peak inductor voltage",num(wi*wxl),"V")+row("Peak capacitor voltage",num(wi*wxc),"V"));
    const times=Array.from({length:241},(_,i)=>period*i/240),wave=(amp,phase)=>times.map(t=>amp*Math.sin(ww*t+phase));
    drawSeries("waveGraph",[{values:wave(wv,0)},{values:wave(wi*wr,-wphi)},{values:wave(wi*wxl,Math.PI/2-wphi)},{values:wave(wi*wxc,-Math.PI/2-wphi)}],["0","one period"]);
    const mu0=4*Math.PI*1e-7,fi=val("fieldI"),fr=val("fieldR")/100,fn=val("fieldN"),fRad=val("fieldRadius")/100;
    const th1=val("fieldTheta1")*Math.PI/180,th2=val("fieldTheta2")*Math.PI/180,bfinite=mu0*fi/(4*Math.PI*fr)*(Math.sin(th1)+Math.sin(th2));put("fieldResult",row("Ampère: infinite straight wire",num(mu0*fi/(2*Math.PI*fr)*1e6),"µT")+row("Biot–Savart: finite wire",num(bfinite*1e6),"µT")+row("N-turn circular loop center",num(mu0*fn*fi/(2*fRad)*1e6),"µT"));
    const oq=val("orbitQ")*1e-9,om=val("orbitM")*1e-9,ov=val("orbitV")*1e3,ob=val("orbitB")*1e-3,orbitR=om*ov/(oq*ob),orbitPeriod=2*Math.PI*om/(oq*ob);
    put("orbitResult",row("Orbit radius",num(orbitR*100),"cm")+row("Cyclotron period",num(orbitPeriod*1e6),"µs")+row("Cyclotron frequency",num(1/orbitPeriod),"Hz"));
    const oc=byId("orbitGraph"); if(oc){const cx=oc.getContext("2d"),d=window.devicePixelRatio||1,w=oc.clientWidth||440,h=180;oc.width=w*d;oc.height=h*d;cx.scale(d,d);cx.clearRect(0,0,w,h);cx.strokeStyle=getComputedStyle(document.body).getPropertyValue("--line");cx.beginPath();cx.moveTo(w/2,8);cx.lineTo(w/2,h-8);cx.stroke();const rr=Math.min(65,Math.max(8,orbitR*1000));cx.beginPath();cx.arc(w/2,h/2,rr,0,2*Math.PI);cx.strokeStyle=getComputedStyle(document.body).getPropertyValue("--accent");cx.lineWidth=2;cx.stroke();cx.fillStyle=getComputedStyle(document.body).getPropertyValue("--accent-2");cx.beginPath();cx.arc(w/2+rr,h/2,4,0,2*Math.PI);cx.fill();cx.fillStyle=getComputedStyle(document.body).getPropertyValue("--muted");cx.fillText("schematic orbit (not to scale)",10,h-10);}
    const mu0s9=4*Math.PI*1e-7,s9q=val("s9Q"),s9r=val("s9Radius")/100,s9b=val("s9B")/100,s9d=s9b+s9r,s9res=val("s9Resistance"),s9factor=s9d> s9r ? s9d-Math.sqrt(s9d*s9d-s9r*s9r) : NaN,s9emf=mu0s9*s9q*s9factor,s9i=s9res>0?s9emf/s9res:NaN;
    put("s9Result",row("Wire-to-loop center distance",num(s9d*100),"cm")+row("Induced emf magnitude",num(s9emf*1e9),"nV")+row("Induced current magnitude",num(s9i*1e9),"nA")+row("Induced current direction","Clockwise",""));
    const rcR=val("s10RcR"),rcC=val("s10RcC")*1e-6,rcW=val("s10RcW"),rcV=val("s10RcV"),rcX=1/(rcW*rcC),rcZ=Math.hypot(rcR,rcX),rcPhi=Math.atan2(-rcX,rcR),rcI=rcV/rcZ,rcIrms=rcI/Math.sqrt(2),rcP=rcIrms*rcIrms*rcR;
    const rlR=val("s10RlR"),rlL=val("s10RlL"),rlW=val("s10RlW"),rlV=val("s10RlV"),rlX=rlW*rlL,rlZ=Math.hypot(rlR,rlX),rlPhi=Math.atan2(rlX,rlR),rlI=rlV/rlZ;
    put("s10Result",'<h4>RC circuit · Problem 1</h4>'+row("Capacitive reactance",num(rcX),"Ω")+row("Impedance",num(rcZ),"Ω")+row("Phase angle",num(rcPhi*180/Math.PI),"°")+row("Peak current",num(rcI),"A")+row("RMS current",num(rcIrms),"A")+row("Power factor",num(Math.cos(rcPhi)),"")+row("Average resistor power",num(rcP),"W")+'<h4>RL circuit · Problem 2</h4>'+row("Inductive reactance",num(rlX),"Ω")+row("Impedance",num(rlZ),"Ω")+row("Phase angle",num(rlPhi*180/Math.PI),"°")+row("Peak current",num(rlI),"A")+row("Power factor",num(Math.cos(rlPhi)),""));
    const gn=val("genN"),gb=val("genB"),ga=val("genA")*1e-4,gw=val("genRPM")*2*Math.PI/60,gflux=gb*ga,gemf=gn*gb*ga*gw;
    put("genResult",row("Maximum flux per turn",num(gflux),"Wb")+row("Peak induced emf",num(gemf),"V")+row("Angular speed",num(gw),"rad/s"));
    const gt=Array.from({length:241},(_,i)=>i/240*(gw>0?2*Math.PI/gw:1)),phase=gt.map(t=>gw*t);
    drawSeries("genGraph",[{values:phase.map(p=>Math.cos(p))},{values:phase.map(p=>Math.sin(p))}],["0","one rotation"]);animateGeneratorWave(gw);
  }

  const solutionGuides = {
    energy:["Identify the system and choose the interval.","Convert quantities to SI units.","Use K = ½mv² or W = Fd cos θ as appropriate.","Apply W_net = ΔK when using the work-energy theorem.","Check the sign of work and units of joules."],
    capacitors:["Redraw the network and identify series and parallel groups.","Reduce parallel groups with C_eq = ΣC and series groups with 1/C_eq = Σ(1/C).","Use Q = C_eq V_source for the equivalent network.","In series, charge magnitude is common; in parallel, voltage is common.","Check charge conservation, voltage sums, and U = ½CV²."],
    dc:["Redraw the circuit and label currents and voltage polarities.","Reduce series and parallel resistors where possible.","Include battery internal resistance in series with the external equivalent.","Use Ohm's law and Kirchhoff's junction/loop rules.","Check KCL, KVL, and power balance."],
    magnetic:["Identify whether the object is a charge or current-carrying wire.","Use F = |q|vB sin θ or F = IℓB sin θ with SI units.","Use the right-hand rule for v × B or Iℓ × B; reverse direction for negative charge.","For circular motion, set |q|vB = mv²/r.","Check that force vanishes when motion/current is parallel to the field."],
    induction:["Choose a surface and define its area normal.","Calculate Φ_B = BA cos θ and flux linkage NΦ_B.","Find the rate of change of flux; ε = |−N dΦ_B/dt|.","Use Lenz's law to oppose the change in flux.","If resistance is present, use I = ε/R and check units."],
    ac:["Convert frequency to ω = 2πf and component values to SI units.","Calculate X_L = ωL and X_C = 1/(ωC).","Find Z = √(R² + (X_L − X_C)²) and phase angle.","Use peak or RMS values consistently.","At resonance X_L = X_C and f₀ = 1/(2π√LC)."]
  };
  function showSolution() {
    const steps=solutionGuides[byId("solutionTopic").value]||[];
    const listHtml='<ol class="solution-list">'+steps.map(x=>'<li>'+x+'</li>').join("")+'</ol>';put("solutionSteps",listHtml);put("printGuide",'<h1>Physics II · '+escapeHtml(topic.charAt(0).toUpperCase()+topic.slice(1))+' solution guide</h1>'+listHtml+'<p>Use the equation sheet and assigned problem data to complete each step.</p>');
  }

  const quizBank = [
    {q:"A 2 kg object moves at 3 m/s. Find kinetic energy in joules.",a:9,u:"J",topic:"energy"},
    {q:"A 5 µF capacitor is connected to 12 V. Find charge in µC.",a:60,u:"µC",topic:"capacitors"},
    {q:"A 12 V source is connected across 4 Ω. Find current in amperes.",a:3,u:"A",topic:"dc"},
    {q:"A 2 nC charge moves at 3 Mm/s perpendicular to a 0.5 T field. Find force in mN.",a:3,u:"mN",topic:"magnetic"},
    {q:"A 50-turn coil of area 0.01 m² has dB/dt = 0.2 T/s. Find emf in volts.",a:.1,u:"V",topic:"induction"},
    {q:"A series RLC has L = 0.1 H and C = 10 µF. Find resonant frequency in hertz.",a:159.154943,u:"Hz",topic:"ac"}
  ];
  let activeQuestion=null,quizCorrect=0,quizAttempted=0;
  function newQuestion(){activeQuestion=quizBank[Math.floor(Math.random()*quizBank.length)];put("quizPrompt",'<strong>'+activeQuestion.topic.toUpperCase()+'</strong><br>'+activeQuestion.q);byId("quizAnswer").value="";put("quizFeedback","");}
  function checkQuestion(){if(!activeQuestion)return;const answer=Number(byId("quizAnswer").value),correct=Number.isFinite(answer)&&byId("quizAnswer").value.trim()!==""&&Math.abs(answer-activeQuestion.a)<=.02*Math.max(1,Math.abs(activeQuestion.a));quizAttempted++;if(correct)quizCorrect++;put("quizFeedback",correct?'<span class="study-correct">Correct.</span> '+num(activeQuestion.a)+' '+activeQuestion.u:'<span class="study-incorrect">Not quite.</span> Expected '+num(activeQuestion.a)+' '+activeQuestion.u+'.');put("quizScore","Score: "+quizCorrect+" / "+quizAttempted);}

  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function renderSavedData(){
    const notes=safeStore.read("notes",[]),bookmarks=safeStore.read("bookmarks",[]),completed=safeStore.read("completed",[]);
    const noteHtml=notes.map((n,i)=>'<div class="saved-item"><strong>'+escapeHtml(n.title||"Untitled")+'</strong> <small>'+escapeHtml(n.topic)+'</small><p>'+escapeHtml(n.body)+'</p><button class="small-button" data-delete-note="'+i+'" type="button">Delete</button></div>').join("");
    put("savedStudyData",'<p><strong>Bookmarks:</strong> '+(bookmarks.map(escapeHtml).join(", ")||"None")+'<br><strong>Completed topics:</strong> '+(completed.map(escapeHtml).join(", ")||"None")+'</p>'+(noteHtml||"<p>No notes saved yet.</p>"));
  }
  function saveNote(){const notes=safeStore.read("notes",[]);notes.unshift({topic:byId("saveTopic").value,title:byId("noteTitle").value.trim(),body:byId("studyNote").value.trim(),created:new Date().toISOString()});if(!safeStore.write("notes",notes)){put("savedStudyData","Local storage is unavailable in this browser.");return;}byId("noteTitle").value="";byId("studyNote").value="";renderSavedData();}
  function toggleSavedList(key,value){const items=safeStore.read(key,[]),next=items.includes(value)?items.filter(x=>x!==value):items.concat(value);safeStore.write(key,next);renderSavedData();}
  function deleteNote(i){const notes=safeStore.read("notes",[]);notes.splice(i,1);safeStore.write("notes",notes);renderSavedData();}

  byId("solutionTopic").addEventListener("change",showSolution);
  byId("printSolution").addEventListener("click",()=>window.print());
  byId("newQuestion").addEventListener("click",newQuestion);
  byId("checkAnswer").addEventListener("click",checkQuestion);
  byId("saveNote").addEventListener("click",saveNote);
  byId("bookmarkTopic").addEventListener("click",()=>toggleSavedList("bookmarks",byId("saveTopic").value));
  byId("markComplete").addEventListener("click",()=>toggleSavedList("completed",byId("saveTopic").value));
  byId("savedStudyData").addEventListener("click",e=>{const b=e.target.closest("[data-delete-note]");if(b)deleteNote(Number(b.dataset.deleteNote));});
  studyLab.addEventListener("input",updateStudyModels);
  studyLab.addEventListener("change",updateStudyModels);
  showSolution();renderSavedData();updateStudyModels();newQuestion();

  render();
})();