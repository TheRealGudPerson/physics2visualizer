# Physics II Visualizer

A dependency-free, browser-based study tool for the equations beginning at `K = 1/2 mv²` on the PHY2049C equation sheet. It uses the uploaded Studio 6–10 material as worked-example context.

## Features

- **Work & energy:** kinetic energy, work from a constant force, and the conservative-force energy relationship.
- **Capacitors:** charge/voltage/energy explorer plus the mixed four-capacitor Studio 6 network.
- **DC circuits:** Ohm's law, resistor power, series/parallel reductions, a Studio 7 resistor network, and Kirchhoff checks.
- **Magnetic force:** charged-particle and wire force calculators, angle dependence, and the Studio 8 mass-spectrometer derivation.
- **Flux & induction:** one-loop and multi-turn flux, Faraday's law, Lenz's-law direction, induced current, and the Studio 9 alternator.
- **AC & resonance:** reactance, impedance, phase, peak/RMS values, power factor, resonant frequency, bandwidth, and an interactive frequency-response graph.

The app is a static site. It has no build step, package manager, external library, backend, analytics, or GitHub Actions workflow.

## Run locally

From this directory, run either:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

You can also open `index.html` directly, but a local HTTP server is the more reliable way to test it.

## Host with GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then save.
5. GitHub Pages will provide the published URL in that settings panel.

No workflow file is needed. The site is served directly from the repository root.

## Notes about the physics

- Values are converted to SI units internally where needed.
- Capacitor and resistor series/parallel rules are shown separately because their rules are opposite.
- The magnetic-force direction illustration assumes velocity/current points along +x and the magnetic field rotates from +x toward +y. The displayed force direction is therefore into or out of the screen; a negative charge reverses it.
- The induction direction is reported relative to the chosen positive surface normal.
- The AC bandwidth shown as `R / (2πL)` is in Hz. The corresponding angular-frequency width is `R / L` in rad/s.
- For a multi-turn coil, the app uses total flux linkage `N × (single-loop flux)` in Faraday's law.

## Source alignment

Core equations follow the supplied equation sheet. Worked examples are based on:

- **Studio 6:** mixed capacitor network, resistor heating, transmission-line losses.
- **Studio 7:** series/parallel resistors, battery internal resistance, charge sharing, motor efficiency.
- **Studio 8:** magnetic force, current-carrying wire, cyclotron motion and mass spectrometer.
- **Studio 9:** magnetic flux, Faraday/Lenz induction, and alternator.
- **Studio 10 / Recitation 10:** RC, RL, and series-RLC AC behavior and frequency response.

The app labels additional relationships derived in the studios rather than implying they are printed on the equation sheet.