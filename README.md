# Physics II Visualizer

A dependency-free, browser-based PHY2049C study workspace covering work and energy, capacitors, DC circuits, magnetic forces, induction, and AC circuits. The site is plain HTML, CSS, and JavaScript. It requires no build process, package manager, external library, backend, analytics, or account.

## Main equation topics

- **Work & energy:** kinetic energy, constant-force work, work-energy relationships.
- **Capacitors:** charge, voltage, stored energy, parallel-plate capacitance, mixed capacitor network.
- **DC circuits:** Ohm's law, resistor power, series/parallel reductions, battery internal resistance, current division.
- **Magnetic force:** force on charged particles and current-carrying wires; mass-spectrometer relationship.
- **Flux & induction:** magnetic flux, Faraday's law, Lenz's law context, induced current, rotating-coil generator.
- **AC & resonance:** reactance, impedance, phase, peak/RMS quantities, power factor, resonance, bandwidth, frequency response.

## Extended model toolkit

The extended workspace below the six topic sections includes:

- Resistor network builder with series, parallel, and series-plus-parallel topologies.
- Transmission-line voltage drop and resistive power-loss calculator.
- Electric motor input/output power and efficiency calculator.
- Capacitor charge-sharing model for two capacitors connected in parallel with like polarity.
- RC capacitor charging and RL inductor-current growth models with time constants and normalized response plots.
- Time-domain series-RLC source, resistor, inductor, and capacitor voltage waveforms.
- Magnetic-field calculations for an infinite straight wire (Ampère's law), finite straight wire (Biot–Savart), and circular N-turn loop.
- Charged-particle circular-orbit radius and cyclotron period, with a schematic orbit drawing.
- Rotating-coil generator flux and emf waveforms with an animated phase marker.
- Topic-based step-by-step solution guides and print-to-PDF support through the browser.
- Randomized numerical practice questions with an in-session score.
- Local bookmarks, completed-topic tracking, and notes stored in browser local storage.

## Use and limitations

- All calculators run locally in the browser. Notes, bookmarks, and completed-topic flags stay in that browser's local storage; clearing browser data removes them. There are no user accounts or cloud sync.
- The circuit builder currently supports three predefined resistor topologies, not arbitrary schematic drawing or mesh/nodal analysis.
- The magnetic-field tool covers idealized straight-wire and circular-loop geometries, not arbitrary 3D wire paths or a general field solver.
- The particle orbit is a schematic 2D circular path, not a time-integrated 3D particle simulation.
- The motor calculator assumes shaft output power is torque multiplied by angular speed and compares it with DC electrical input voltage times current.
- Charge sharing assumes ideal capacitors connected in parallel with like polarity; real transient losses and wiring effects are not modeled.
- The RC and RL plots show normalized first-order charging/growth responses. They do not model switch bounce, parasitics, or arbitrary source waveforms.
- The RLC waveform model is steady-state sinusoidal series RLC behavior. It is not a switching transient solver.
- Example network values are illustrative and are not claimed to be the official Studio 6–10 preset values.

## Run locally

From the project directory:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Opening `index.html` directly may also work, but a local HTTP server is preferable.

## GitHub Pages

The repository can be hosted as a static site from the repository root:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select `main` and `/(root)`.
4. Save and use the URL displayed by GitHub Pages.

No GitHub Actions workflow is required.

## Source alignment

The main topics follow the PHY2049C equation-sheet range beginning at kinetic energy. The extended calculators use standard derived relationships relevant to the studio sequence:

- **Studio 6:** capacitor networks, charge sharing, transmission-line loss.
- **Studio 7:** resistor networks, internal resistance, motor efficiency.
- **Studio 8:** magnetic force, circular motion, mass spectrometer.
- **Studio 9:** magnetic flux, Faraday/Lenz induction, rotating-coil generator.
- **Studio 10 / Recitation 10:** RC, RL, and series-RLC AC behavior.

The app labels derived applications separately from relationships printed directly on an equation sheet. The Studio-specific values should be replaced with the assigned worksheet values when working a particular problem.
