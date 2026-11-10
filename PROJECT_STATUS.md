# Project Purpose and Implementation Status

**Repository:** [TheRealGudPerson/physics2visualizer](https://github.com/TheRealGudPerson/physics2visualizer)  
**Primary branch:** `main`  
**Project type:** Static, browser-based Physics II study application  
**Course context:** PHY2049C  
**Status (2026-11-10):** The reconstructed application is implemented on `rebuild/static-runtime` and included in PR #1, which is open and not merged to `main`. The user supplied Studio 6–10 question PDFs and solution PDFs during this session. Their numerical values have now been incorporated into relevant presets and new worksheet-specific calculators. Browser testing and automated validation of these latest edits were explicitly skipped at the user’s request.

This document describes the intended purpose of the project, what is implemented in the local source, what is currently present in the GitHub repository, and what remains unfinished. It is deliberately explicit about the difference between a feature existing in the local working files and that feature being available from the published repository.

## Rebuild implementation status — 2026-11-10

### Source-level and calculation checks completed

- [x] Re-ran JavaScript parse check after edits; passed.
- [x] Checked statically declared input keys against defaults; the missing magnetic and alternator defaults discovered during review were added.
- [x] Checked all 50 result-output IDs: no duplicates, no outputs without an update path, and no update targets without a corresponding output.
- [x] Added range-control label associations, explicit IDs for numeric controls, and visible keyboard-focus outlines.
- [x] Numeric inputs now clamp to their declared minimum/maximum and mirror the clamped value into the paired range control; clearing a number field temporarily falls back to its last valid value.
- [x] Text-valued outputs (such as positive/negative/zero work) are rendered as text rather than being passed through the numeric formatter.
- [x] Renamed preset buttons to "Load example values" and added notices explaining that current numeric examples are illustrative, not verified official Studio values.
- [x] Updated the sidebar hint so it no longer promises a diagram that the reconstructed interface does not yet render.
- [x] Evaluated 16 representative formula cases across all six topics. All 16 passed, including zero-angle/zero-rate edge cases, the documented Studio 6 capacitor topology, Studio 7 current splitting, the Studio 8 mass-spectrometer derivation, and the Studio 9 Faraday-law calculation.

These formula checks independently evaluate the equations represented in the source. They are **not** browser-driven tests of the rendered application.

### RLC cross-check against available course-related material

The user's Library contains a Physics Lab 8 RLC report (not the Studio 10 worksheet). With (L=47\,\mathrm{mH}), (C=4700\,\mathrm{pF}), and approximately (130\,\Omega) of inductor internal resistance, the reconstructed resonance and bandwidth equations give:

- Theoretical resonance: (f_0=10{,}708.34\,\mathrm{Hz}), consistent with the report's (10{,}708\,\mathrm{Hz}).
- For a (503\,\Omega) external resistor, total series resistance (633\,\Omega): theoretical bandwidth (2143.51\,\mathrm{Hz}), consistent with approximately (2144\,\mathrm{Hz}).
- For a (1990\,\Omega) external resistor, total series resistance (2120\,\Omega): theoretical bandwidth (7178.90\,\mathrm{Hz}), consistent with approximately (7179\,\mathrm{Hz}).

This supports the resonance and bandwidth formulas. The current RLC calculator uses one lumped series-resistance input, so total series resistance must be entered when inductor winding resistance is included. Its average-power output is power dissipated in that lumped resistance, not specifically the external resistor alone.

### Still blocked / not yet verified

- [ ] Real browser execution and interaction testing; no browser session or browser automation was available during this pass.
- [ ] Responsive layout checks at desktop, tablet, and phone widths.
- [ ] Keyboard-only and screen-reader testing. Source-level labels and focus styling were improved, but that is not a substitute for an accessibility audit.
- [x] Read the uploaded Studio 6–10 question PDFs and available solution PDFs; use their exact numeric data in supported worksheet-specific presets and calculators.
- [ ] Browser-driven validation of the newly added Studio 6–10 examples against the PDFs; explicitly skipped at the user’s request.
- [ ] Some Studio problems remain manual/conceptual rather than dedicated calculators: Studio 7 Problem 3 (full multi-loop Kirchhoff circuit), Studio 8 Problem 3 (regular hexagonal Biot–Savart loop), and Studio 9 Problems 1–2 (two-loop superposition and coaxial cable). Studio 8 Problem 2 is modeled one straight segment at a time.
- [ ] GitHub Pages deployment and live-site verification.

---

## 1. Purpose of this repository

The purpose of **Physics II Visualizer** is to turn the equations on the supplied PHY2049C equation sheet into an interactive study environment.

The application begins at the kinetic-energy equation,

\[
K = \frac{1}{2}mv^2
\]

and follows the equation sheet downward through work and energy, capacitors, DC circuits, magnetic forces, magnetic flux and induction, and alternating-current (AC) circuits.

It is intended to help a student do more than look up a formula. A student should be able to:

1. Read an equation in the context of the physical concept it describes.
2. Change one or more quantities and see how the calculated result changes.
3. Connect symbols to their physical meanings and units.
4. Inspect a diagram or graph that makes the relationship easier to interpret.
5. Work through a representative Studio 6–10 example using the same relationships.
6. Check conceptual understanding before moving to the next topic.

The application is a learning aid, not a replacement for the equation sheet, studio solutions, lecture material, or the student's own problem-solving process. Results should be checked against the conventions and assumptions used in the assigned problem.

## 2. Source material and scope

The primary source is the supplied **Equations_Test_2.pdf**, beginning at \(K=\frac12mv^2\). The supplied **Studio 6–10 materials** provide worked-example context and representative problem setups.

The implementation distinguishes between:

- **Equation-sheet relationships:** equations directly represented on the supplied equation sheet.
- **Studio applications:** additional relationships or combined equations used to solve studio problems.
- **Explanatory context:** text and diagrams that explain an idea but are not themselves a separate calculator or full simulation.

A formula derived by combining two equations is identified as a derived application where practical. It should not be confused with a separate formula printed on the equation sheet.

The current application focuses on the topics represented in the equation-sheet range and the following studio applications:

- **Studio 6:** mixed capacitor network and resistor/power-loss context.
- **Studio 7:** mixed resistor network, battery internal resistance, and Kirchhoff checks.
- **Studio 8:** magnetic force on a particle and wire, circular motion, and mass spectrometer.
- **Studio 9:** magnetic flux, Faraday's and Lenz's laws, and a rotating-coil alternator.
- **Studio 10 / Recitation 10:** series-RLC reactance, impedance, phase, resonance, bandwidth, and RMS behavior.

The README also references some studio topics that are not yet represented by a dedicated interactive calculator. Those gaps are listed in the unfinished-work section below.

---

## 3. Implemented application sections

The local application source currently contains six main topic sections. The descriptions below document the original target scope. The 2026-11-10 reconstruction is a first-pass implementation and does not yet reproduce every detail listed here.

### 3.1 Work and energy

**Purpose:** Show how mass, speed, force, displacement, and angle affect kinetic energy and work.

Implemented content:

- Kinetic energy: \(K=\frac12mv^2\).
- Work by a constant force: \(W=Fd\cos\theta\).
- The work-energy connection, with the displayed assumptions for \(\Delta K\) and conservative-force potential-energy change.
- A moving-cart diagram whose mass and speed labels update with the inputs.
- A comparison showing the kinetic energy at twice the selected speed.
- A conceptual question about the squared dependence on speed.

Interactive inputs and outputs:

- Mass and speed update the kinetic-energy result.
- The displayed doubled-speed comparison updates with the selected values.
- Force, displacement, and the angle between them update the work result.
- The panel displays the corresponding work sign and the stated kinetic/potential-energy changes.

Scope limitation:

- The calculator uses a constant-force model for \(W=Fd\cos\theta\).
- It does not numerically integrate an arbitrary position-dependent force field.
- The energy-change display is a simplified work-energy example; a general problem with several forces must account for the **net work** of all forces.

### 3.2 Capacitors

**Purpose:** Explore charge, voltage, capacitance, stored energy, capacitor geometry, and mixed capacitor networks.

Implemented equations and concepts:

- \(Q=CV\).
- \(U=\frac12CV^2\).
- Parallel-plate capacitance: \(C=\kappa\epsilon_0A/d\).
- Series capacitor reduction.
- Parallel capacitor reduction.
- The distinction between equal charge in series and equal voltage in parallel.

Interactive models:

1. **Charge, voltage, and stored energy**
   - Adjust capacitance and voltage.
   - View calculated charge and energy.
   - See the stated proportionality behavior when voltage changes.

2. **Parallel-plate geometry**
   - Adjust dielectric constant, plate area, and plate separation.
   - View the calculated capacitance and a gap-related trend description.
   - The input units are converted internally to SI units.

3. **Studio 6 mixed capacitor network**
   - The modeled topology is \(C_1\) in series with \(C_2\); that equivalent is in parallel with \(C_3\); the resulting section is in series with \(C_4\).
   - A preset loads the studio values.
   - The model calculates equivalent capacitance, total battery charge, total stored energy, voltage across the inner parallel section, and selected capacitor charges.
   - A circuit-topology diagram and a conceptual check are included.

Scope limitation:

- The network calculator implements the specific four-capacitor topology shown in the panel. It is not a general circuit editor in which a user can draw an arbitrary capacitor network.

### 3.3 DC circuits

**Purpose:** Connect current, voltage, resistance, power, series/parallel resistors, internal resistance, and Kirchhoff's laws.

Implemented equations and concepts:

- \(I=dq/dt\), with explanatory constant-current form.
- \(V=IR\).
- \(P=IV=I^2R=V^2/R\).
- \(P=dW/dt\).
- Series and parallel resistor relationships as used by the modeled network.
- Kirchhoff's current law and voltage law as conservation statements.

Interactive models:

1. **Ohm's law and resistor power**
   - Adjust voltage and resistance.
   - View current and power dissipated.

2. **Current and power as rates**
   - Explanatory section relating amperes to coulombs per second and watts to joules per second.
   - Distinguishes instantaneous rates from constant/average interval relationships in the accompanying text.

3. **Studio 7 internal-resistance and mixed-resistor network**
   - Models battery internal resistance in series with an external load.
   - The external load is \(R_1\) in series with \(R_2\parallel R_3\).
   - A preset loads the studio values.
   - Calculates the parallel equivalent, external load resistance, total current, voltage across the parallel branch, and the two branch currents.
   - Displays KCL and KVL consistency relationships.

4. **Kirchhoff explanation and concept check**
   - Shows the junction-current and closed-loop-voltage rules.
   - Includes a current-splitting conceptual question.

Scope limitation:

- The circuit calculator uses the specific resistor topology shown in the Studio 7 panel. It does not solve arbitrary user-drawn circuits or automatically construct a system of loop equations for an unrestricted circuit.
- The Studio 6 wire/heating-loss idea appears as explanatory context. There is not yet a dedicated transmission-line loss calculator.
- Studio 7 charge-sharing and motor-efficiency topics are not yet implemented as separate interactive models.

### 3.4 Magnetic force

**Purpose:** Show how magnetic force depends on charge/current, speed or wire length, field strength, and angle, and connect that force to circular motion.

Implemented equations and concepts:

- Charged-particle magnetic-force magnitude: \(F=|q|vB\sin\theta\).
- Vector relationship: \(\vec F=q\vec v\times\vec B\).
- Current-carrying-wire force magnitude: \(F=IlB\sin\theta\).
- Vector relationship for a wire: \(\vec F=I\vec l\times\vec B\).
- Centripetal-force relationship: \(F_c=mv^2/r\), displayed as a supporting relationship.
- A derived mass-spectrometer expression:
  \[
  m=\frac{qB^2x^2}{8V_{\mathrm{acc}}}
  \]
  based on the energy relation, magnetic circular motion, and the detector separation being the semicircle diameter.

Interactive models:

1. **Moving charged particle**
   - Adjust signed charge, particle speed, magnetic field, and angle.
   - View magnetic-force magnitude.
   - View the simplified into/out-of-screen direction indicator.
   - The field arrow and angle illustration update with the angle input.

2. **Current-carrying wire**
   - Adjust current, wire length in the field, magnetic field, and angle.
   - View force magnitude.
   - Includes a reminder to calculate different wire segments separately when their directions differ.

3. **Mass spectrometer**
   - Adjust ion-charge magnitude, magnetic-field strength, detector separation, and accelerating voltage.
   - View calculated ion mass in kilograms and atomic mass units.
   - Shows the three conceptual steps behind the derived equation.

Direction-model assumptions:

- The particle illustration assumes velocity along +x and the magnetic field rotating in the xy-plane from +x toward +y. The displayed screen direction follows that chosen orientation and reverses for negative charge.
- The wire-force direction label is a simplified illustrative assumption. It is not a general three-dimensional vector-direction solver for arbitrary wire and field orientations.

Scope limitation:

- The app does not animate a particle's complete trajectory or provide an unrestricted three-dimensional magnetic-field simulator.
- It does not include a general magnetic-field calculation tool such as a full Biot–Savart or Ampère's-law solver.

### 3.5 Magnetic flux and induction

**Purpose:** Show how field strength, loop area, loop orientation, turn count, and changing magnetic flux relate to induced emf and current.

Implemented equations and concepts:

- Single-loop magnetic flux: \(\Phi_{B,1\text{-loop}}=BA\cos\theta\).
- Total flux linkage for identical turns: \(N\Phi_{B,1\text{-loop}}\).
- Faraday's law using the rate of change of total flux linkage.
- Lenz's-law explanation: the induced response opposes the change in flux.
- Ohm's law for the modeled induced-current magnitude.
- Rotating-coil alternator peak emf: \(\mathcal E_{\mathrm{peak}}=NBA\omega\).

Interactive models:

1. **Flux and Faraday model**
   - Adjust magnetic field, loop area, angle, number of turns, and field-change rate.
   - Adjust loop resistance.
   - View single-loop flux, total flux linkage, induced-emf magnitude, and induced-current magnitude.
   - Displays a clockwise/counterclockwise/no-current indication relative to the selected positive surface normal.

2. **Studio 9 alternator**
   - Adjust number of turns, coil radius, rotation rate, and target peak emf.
   - Loads the Studio 9 values through a preset.
   - Calculates rotation frequency, angular frequency, and the required magnetic-field strength.

Model assumptions:

- In the changing-field calculator, the model treats the magnetic-field strength as the changing quantity while area and orientation remain fixed.
- The direction label is relative to the selected positive surface normal. Viewing the loop from the opposite side reverses the clockwise/counterclockwise description.

Scope limitation:

- The app does not yet provide a fully animated rotating coil with a time-domain voltage waveform.
- It does not model arbitrary simultaneous changes in field strength, area, and orientation as independent time-dependent functions.

### 3.6 AC and resonance

**Purpose:** Explore series-RLC behavior as frequency and circuit component values change.

Implemented equations and concepts:

- Angular frequency: \(\omega=2\pi f\).
- Inductive reactance: \(X_L=\omega L\).
- Capacitive reactance: \(X_C=1/(\omega C)\).
- Series impedance: \(Z=\sqrt{R^2+(X_L-X_C)^2}\).
- Phase relationship: \(\tan\phi=(X_L-X_C)/R\), with the implementation calculating the signed phase angle.
- Peak current: \(I_p=V_p/Z\).
- Resonant angular frequency: \(\omega_0=1/\sqrt{LC}\).
- Resonant frequency in Hz.
- Frequency bandwidth/FWHM: \(\Delta f=R/(2\pi L)\).
- Angular-frequency bandwidth: \(\Delta\omega=R/L\).
- Peak current at resonance: \(I_{p,\max}=V_p/R\).
- Sinusoidal RMS current and voltage: \(I_{\mathrm{rms}}=I_p/\sqrt2\) and \(V_{\mathrm{rms}}=V_p/\sqrt2\).
- Power factor and average resistor power.
- Explanatory component relationships for resistor, capacitor, and inductor voltage.

Interactive model:

- Adjust resistance, inductance, capacitance, peak source voltage, and driving frequency.
- View inductive and capacitive reactance, impedance, phase angle, peak and RMS current, RMS source voltage, power factor, and average resistor power.
- View calculated resonant angular frequency, resonant frequency, bandwidth, angular bandwidth, and resonant peak current.
- View a canvas graph of current amplitude versus frequency, with the resonant frequency marked.
- Load the Studio 10 parameter preset.

Unit handling:

- User inputs for inductance, capacitance, and frequency are accepted in mH, nF, and kHz in the relevant panel and converted internally to SI units.
- The FWHM relationship \(R/(2\pi L)\) is reported in Hz; the angular-frequency width \(R/L\) is reported in rad/s.

Scope limitation:

- The graph is a frequency-response graph for the modeled series-RLC circuit. It is not an oscilloscope or a time-domain animation of voltage and current waveforms.
- The RMS relationships are for sinusoidal signals.
- Although the README identifies RC and RL behavior as source-alignment topics, dedicated RC/RL transient-response calculators are not yet implemented.

---

## 4. Shared interface and interaction features

The local implementation includes the following shared behavior:

- Six topic sections with desktop navigation and a mobile topic selector.
- A dark/light theme toggle.
- Slider and number inputs that mirror one another.
- Live recalculation when supported input values change.
- Studio-value preset buttons for the modeled studio examples.
- Tabbed submodels for magnetic force and induction.
- Expand/collapse conceptual answer controls.
- Inline SVG diagrams for selected concepts and circuit topologies.
- A canvas-rendered RLC frequency-response graph.
- Responsive CSS layouts for narrower screens.
- SI conversions inside the calculators where the user-facing controls use convenient units.

The project is designed to run in the browser. Its intended architecture has no application server, account system, remote database, package manager, external UI framework, analytics, or GitHub Actions requirement.

### Current local source files

The local working directory contains:

| File | Purpose |
|---|---|
| `index.html` | Main page structure and topic-navigation shell. |
| `styles.css` | Theme variables, layout, controls, diagrams, cards, and responsive styling. |
| `app.js` | Topic templates, calculations, event bindings, presets, and graph drawing. |
| `README.md` | Short project introduction and run/hosting instructions. |
| `bootstrap.js` | Alternative loader that inflates the compressed text assets and starts the app. |
| `prepare-assets.sh` | Regenerates the base64-encoded gzip assets from the JavaScript and CSS sources. |
| `app.js.gz`, `styles.css.gz` | Compressed copies of the source assets. |
| `app.js.gz.b64`, `styles.css.gz.b64` | Base64-encoded compressed assets used by the alternative bootstrap loader. |

**Important entry-point detail:** the current `index.html` references `styles.css` and `app.js` directly. It does not load `bootstrap.js`. Therefore, the direct JavaScript and CSS files are required for the current entry page to work. The compressed assets and bootstrap helper are not a substitute unless the entry page is deliberately changed to use that loader.

---

## 5. What is implemented

The following items are implemented in the local working source:

- [x] Static HTML application shell.
- [x] Six main equation-topic sections.
- [x] Kinetic-energy and constant-force work calculators.
- [x] Capacitor charge, energy, and parallel-plate geometry calculators.
- [x] Studio 6 mixed capacitor network.
- [x] Ohm's-law and resistor-power calculator.
- [x] Studio 7 mixed resistor network with internal resistance.
- [x] Kirchhoff concept explanations and consistency relationships for the modeled network.
- [x] Charged-particle magnetic-force calculator.
- [x] Current-carrying-wire magnetic-force calculator.
- [x] Derived Studio 8 mass-spectrometer calculator.
- [x] Magnetic-flux and Faraday/Lenz calculator.
- [x] Studio 9 rotating-coil alternator calculator.
- [x] Series-RLC calculator with reactance, impedance, phase, and resonance results.
- [x] RLC current-amplitude versus frequency graph.
- [x] Peak/RMS calculations and average resistor power.
- [x] Studio parameter presets for the implemented examples.
- [x] Live-updating sliders and number inputs.
- [x] Topic navigation, sub-tabs, concept-answer reveal controls, and theme toggle.
- [x] Responsive CSS rules.
- [x] Local JavaScript syntax check with `node --check app.js`.

The syntax check only confirms that the JavaScript parses. It does **not** establish that every interaction works correctly in every browser.

---

## 6. What is not implemented or not yet verified

### 6.1 Missing from the GitHub repository

At the time of the initial status review, the GitHub `main` branch contained `README.md` and `index.html`, but the required runtime files were absent. They have since been created on `rebuild/static-runtime` (not yet merged to `main`):

- [x] `app.js` — created on `rebuild/static-runtime`; browser validation intentionally deferred.
- [x] `styles.css` — created on `rebuild/static-runtime`; responsive validation intentionally deferred.

The new files are available on the rebuild branch but are not yet on `main`. The current `index.html` can load them when that branch is checked out or previewed.

The following local helper/asset files were also not found on GitHub at the time of verification:

- [ ] `bootstrap.js`
- [ ] `prepare-assets.sh`
- [ ] `app.js.gz` and `styles.css.gz`
- [ ] `app.js.gz.b64` and `styles.css.gz.b64`

Those helper files are not required by the current direct-loading `index.html`; only the missing raw JavaScript and CSS are required for that entry point.

### 6.2 Testing and deployment not completed

- [ ] Full browser test of all six topic sections.
- [ ] Manual verification of every slider, number input, preset, tab, and answer-reveal control.
- [ ] Numerical test cases against the supplied studio answer keys for all modeled calculations.
- [ ] Responsive-layout verification on desktop, tablet, and phone-sized viewports.
- [ ] Accessibility review, including keyboard navigation, contrast, and screen-reader behavior.
- [ ] Verification in more than one browser.
- [ ] GitHub Pages configuration and published-site verification.

A local JavaScript syntax check has passed, but no claim of complete browser QA or numerical regression testing is being made.

### 6.3 Extended study toolkit now implemented on rebuild branch

- [x] Resistor network builder with series, parallel, and series-plus-parallel topologies.
- [x] Transmission-line voltage-drop and resistive power-loss calculator.
- [x] Motor electrical input, mechanical shaft output, and efficiency calculator.
- [x] Two-capacitor charge-sharing model for ideal parallel connection with like polarity.
- [x] RC capacitor charging and RL inductor-current growth models, time constants, and normalized response plots.
- [x] Steady-state time-domain series-RLC waveforms for source, resistor, inductor, and capacitor voltage.
- [x] Magnetic-field calculations for an infinite straight wire (Ampère's law), finite straight wire (Biot–Savart), and circular N-turn loop.
- [x] Charged-particle orbit radius and cyclotron period with a schematic 2D orbit drawing.
- [x] Rotating-coil generator flux/emf waveforms with an animated phase marker.
- [x] Topic-specific step-by-step solution guides and browser print support for saving the current topic as PDF.
- [x] Randomized numerical practice questions with immediate answer feedback and an in-session score.
- [x] Browser-local bookmarks, completed-topic tracking, and notes using local storage.

### Scope boundaries

The new tools are intentionally educational models, not full engineering packages:
- The resistor builder supports three predefined topologies, not arbitrary schematic drawing or general mesh/nodal solving.
- Magnetic-field tools cover idealized wire and circular-loop geometries, not arbitrary 3D conductors.
- The particle path is a schematic 2D circular orbit, not a 3D numerical trajectory integrator.
- Motor efficiency assumes DC input power (VI) and shaft power (	au\omega).
- Charge sharing assumes ideal capacitors connected in parallel with like polarity.
- RC/RL plots show first-order charging/growth responses; the RLC waveforms are steady-state sinusoidal behavior, not switching transients.
- Notes/bookmarks/completion flags remain in the current browser only. There are no accounts, cloud sync, or remote storage.
- Supported Studio 6–10 examples now use values transcribed from the uploaded question PDFs. The Studio 7 solution PDF was image-only, so its diagram values were read from the question PDF.

---

## 7. Runtime, dependencies, and hosting design

The intended application is a static site. Once all required files are present in the repository root, it can be served by any static web host.

There is no required backend or package-install step. The current source does not require a build pipeline.

### Local test

From the project directory:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Using a local HTTP server is the preferred test method.

### GitHub Pages

After the required files are committed:

1. Open the repository's **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select `main` and the `/(root)` directory.
5. Save the settings and use the Pages URL GitHub displays.

No GitHub Actions workflow is required for this deployment method. Do not add a workflow merely to publish this static site.

---

## 8. Remaining work

The user has asked to skip testing and have all other implementation work completed. The remaining items are therefore operational or verification tasks, not additional feature requests:

1. Configure GitHub Pages to deploy `main` from `/(root)` after the pull request is accepted.
2. Browser testing, responsive testing, accessibility review, and cross-browser checks have been deferred.
3. Validate the illustrative values against the official Studio 6–10 worksheets if those materials are later made available.
4. Merge PR #1 when the user is ready. It is ready for review but has not been merged.

No additional framework, build pipeline, backend, account system, or GitHub Actions workflow is needed.

---

## 9. Status summary

The rebuild branch now includes the six main topic sections and the expanded calculator/study toolkit listed in Section 6.3. The README has been rewritten to document the implemented tools, assumptions, and limitations.

The implementation work requested in this pass is complete on `rebuild/static-runtime`. Browser/course validation was intentionally skipped. The branch remains isolated from `main` in PR #1. Testing has been deferred at the user’s request.


## Uploaded Studio materials incorporated — 2026-11-10

The supplied ZIP contained Studio 6, 7, 8, 9, and Recitation 10 question PDFs, plus solution PDFs for Studios 6, 8, 9, and 10. The Studio 7 solution PDF was image-only, so its circuit values were transcribed from the question PDF.

### Worksheet-specific values now loaded

- **Studio 6 Problem 1:** C₁ = 3 µF, C₂ = 6 µF, C₃ = 4 µF, C₄ = 12 µF, V₀ = 12 V. The supplied solution gives Cₑq = 4 µF, Utotal = 0.288 mJ, and Q₁ = 16 µC.
- **Studio 6 Problem 2:** ρ = 1.7×10⁻⁸ Ω·m, L = 0.050 m, r = 0.50 mm, V = 24 V; leads ρline = 2.8×10⁻⁸ Ω·m, Lline = 20 m, Aline = 2.5 mm². The calculator reports element/lead resistance, circuit current, and separate I²R heating.
- **Studio 6 Problem 3:** Pcity = 100 MW, Vcity = 50 kV, Rline = 2.0 Ω per line. The model uses the combined 4.0 Ω loop resistance and I = 2000 A; total line loss is 16 MW and efficiency is about 86.2%. Halving delivery voltage at constant city power doubles current and quadruples line loss.
- **Studio 7 Problem 1:** V = 240 V, efficiency = 90%, weight = 200 N, lift speed = 3.1 m/s. The motor calculator uses Pout = Fv and η = Pout/(VI).
- **Studio 7 Problem 2:** R₁ = R₂ = 33 Ω, R₃ = 47 Ω, Vb = 6 V, rb = 12.5 Ω. The preset maps to R₁ in series with R₂ ∥ R₃, plus source internal resistance.
- **Studio 7 Problem 4:** 2.0 µF initially at 150 V and 1.0 µF initially uncharged. The charge-sharing model reports final voltage and the initial/final energy difference, which is energy dissipated in the resistor.
- **Studio 8 Problem 1:** electron charge magnitude e = 1.60×10⁻¹⁹ C, speed = 3.2×10⁶ m/s, B = 0.40 T. The particle-force input is converted to nC; its default angle is 90°.
- **Studio 8 Problem 4:** Vacc = 3.20 kV, q = +e, B = 0.300 T, detector separation x = 0.300 m. The derived mass is about 30.5 u, consistent with the provided solution's identification near 31 u (phosphorus).
- **Studio 9 Problem 3:** Q = 5.88 A/s, loop radius = 1.66 cm, nearest-edge distance b = 1.36 cm, loop resistance = 2.79 Ω. The new calculator uses the circular-area flux integral and reports induced emf/current magnitudes and clockwise direction for the stated orientation.
- **Studio 9 Problem 4:** N = 250, radius = 5 cm, rotation = 1200 rpm, target peak emf = 14 V. The alternator calculator solves for the required B field (about 56.7 mT).
- **Studio 10 Problems 1–3:** RC values R = 50 Ω, C = 50 µF, ω = 120π rad/s, V₀ = 120 V; RL values R = 100 Ω, L = 0.25 H, ω = 1000 rad/s, V₀ = 10 V; RLC values R = 50 Ω, L = 1.0 mH, C = 10 nF, V₀ = 10 V. RC/RL outputs include reactance, impedance, phase, peak/RMS current as applicable, power factor, and average resistor power; RLC resonance is handled in the main AC panel.

### Deliberately unimplemented exact worksheet solvers

- Studio 7 Problem 3's complete four-source, multi-loop Kirchhoff circuit.
- Studio 8 Problem 3's regular hexagonal Biot–Savart derivation as a dedicated calculator.
- Studio 9 Problem 1's two-loop magnetic-field superposition and Problem 2's coaxial-cable Ampère-law piecewise field calculator.

These remain manual exercises supported by general concept material. Studio 8 Problem 2 is represented by the straight-wire segment force calculator, which does not automatically vector-sum the full three-segment loop.

### Validation status

No browser, responsive, accessibility, cross-browser, or automated code tests were run after incorporating the uploaded materials. The user explicitly asked to skip testing. Worksheet values were transcribed from the PDFs and formulas aligned to provided solutions where available; this is not a substitute for execution-based verification.
