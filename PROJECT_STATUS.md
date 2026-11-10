# Project Purpose and Implementation Status

**Repository:** [TheRealGudPerson/physics2visualizer](https://github.com/TheRealGudPerson/physics2visualizer)  
**Primary branch:** `main`  
**Project type:** Static, browser-based Physics II study application  
**Course context:** PHY2049C  
**Status:** Core local application source exists; the GitHub repository is not yet deployable because the JavaScript and stylesheet referenced by the entry page have not been uploaded.

This document describes the intended purpose of the project, what is implemented in the local source, what is currently present in the GitHub repository, and what remains unfinished. It is deliberately explicit about the difference between a feature existing in the local working files and that feature being available from the published repository.

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

The local application source currently contains six main topic sections. The descriptions below refer to the implementation in the local `app.js` and `styles.css` files, not to a claim that all of those files have already been committed to GitHub.

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

At the time this document was prepared, the GitHub `main` branch was verified to contain `README.md` and `index.html`, but the current entry page's two required runtime files were not present:

- [ ] `app.js` — missing from GitHub.
- [ ] `styles.css` — missing from GitHub.

The local working directory has both files, but that does not make them available to GitHub Pages. Until both are committed to the repository root, the current `index.html` cannot load the application as written.

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

### 6.3 Study features not yet implemented

The following are possible extensions, not completed features:

- [ ] A general-purpose circuit builder for arbitrary resistor or capacitor topologies.
- [ ] Dedicated transmission-line power-loss calculator.
- [ ] Dedicated motor input/output power and efficiency calculator.
- [ ] Dedicated capacitor charge-sharing model.
- [ ] RC charging/discharging time-constant visualizer.
- [ ] RL current-growth/decay time-constant visualizer.
- [ ] Full time-domain AC waveform display for source voltage, resistor voltage, capacitor voltage, and inductor voltage.
- [ ] Animated particle paths and a fully three-dimensional magnetic-force/vector environment.
- [ ] General magnetic-field solvers for arbitrary wire/coil geometry.
- [ ] Fully animated rotating-coil flux and emf waveform.
- [ ] Step-by-step solution mode that guides the student from a word problem to the correct equation and substitution.
- [ ] Randomized practice questions and a quiz/score system.
- [ ] Saved study progress, bookmarks, notes, or user accounts.
- [ ] Export or print support for worked solutions.

These items should not be described as current functionality until they are implemented and tested.

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

## 8. Recommended remaining work, in order

1. **Publish the runtime files:** add `app.js` and `styles.css` to the GitHub repository root so they match the paths referenced by `index.html`.
2. **Verify the deployed entry point:** serve the project locally and confirm that the page loads without missing-file or JavaScript errors.
3. **Validate calculations:** compare representative preset outputs and additional edge cases against the equation sheet and Studio 6–10 answer material.
4. **Complete interaction and responsive testing:** check controls, topic changes, diagrams, tabs, graph redraws, theme changes, and small-screen layout.
5. **Enable GitHub Pages:** configure branch deployment from `main` and verify the live site.
6. **Expand the study coverage:** prioritize missing studio applications such as RC/RL behavior, charge sharing, and motor efficiency based on the topics needed for the course.

---

## 9. Status summary

**The local project has a substantial first implementation:** all six top-level topic areas exist, the main calculators and studio presets are coded, the interface is styled, and the JavaScript passes a syntax check.

**The GitHub repository is not yet a complete working deployment:** its current `index.html` points to `app.js` and `styles.css`, but those two files are absent from `main`. Browser verification, numerical regression checks, and GitHub Pages publication also remain outstanding.

The most important next step is therefore not adding more features. It is publishing the existing runtime files and verifying that the current implementation actually runs from the repository.
