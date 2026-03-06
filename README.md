# Math Explorer: ZPO Model of the Riemann Hypothesis

An interactive web application exploring the Riemann Hypothesis through the **Zero-Point Oscillator (ZPO) twin-ladder model** — a framework that reinterprets the zeta function as a cascade of prime harmonic oscillators coupled by a lossless bridge.

**Live site:** Deploy with `npm run build` and serve the `dist/` directory.

## The ZPO Model in Brief

Every prime `p` defines a harmonic oscillator with energy levels `E_k = k * log(p)`. Summing over excitations gives the geometric series:

```
H_p(s) = sum_{k=0}^inf p^{-ks} = 1/(1 - p^{-s})
```

This is simultaneously a **partition function** (statistical mechanics) and a **transfer function** (circuit theory). Cascading all primes gives the Euler product for zeta(s).

The **twin-ladder system** pairs the direct ladder zeta(s) with a dual ladder zeta(1-s), coupled by a bridge chi(s) satisfying |chi(1/2 + it)| = 1 (lossless on the critical line). The Riemann Hypothesis becomes: **the twin-ladder network is Darlington-lossless**, forcing all transmission zeros onto sigma = 1/2.

## Features

- **30 interactive pages** covering the full ZPO model, from foundations to proof strategies
- **34 visualization components** with Canvas/SVG/WebGL renderings of zeta zeros, spectral data, scattering matrices, and more
- **15 mathematical computation modules** for zeta evaluation, spectral analysis, gap-closing algorithms, and proof checking
- **80+ exploration journal entries** with full LaTeX rendering, cross-references, and literature citations
- **33-node insight DAG** mapping the logical dependencies between 90+ mathematical concepts
- **400+ auto-improvement entries** logged by the Claude Code auto-improvement engine
- **Historical reasoning log** tracking evolving proof strategies and novel connections to cutting-edge research (Connes 2025-2026, Guth-Maynard 2024)

## Quick Start

```bash
npm install
npm run dev      # Development server at localhost:5173
npm run build    # Production build → dist/
```

## Project Structure

```
src/
  App.jsx                  # Router, navigation, code-splitting (React.lazy)
  pages/                   # 30 page components
    HomePage.jsx            # Model overview with SVG circuit diagrams
    OscillatorsPage.jsx     # Prime oscillator stages
    HamiltonianPage.jsx     # Energy landscape H(sigma, t)
    ZetaPage.jsx            # Zeta function visualization + eta regularization
    WaveSimPage.jsx         # Wave propagation simulator
    ModesPage.jsx           # Normal modes of the ladder chain
    SimulatorPage.jsx       # Interactive twin-ladder simulator
    FourierPage.jsx         # Fourier/Mellin analysis
    ControlTheoryPage.jsx   # Nyquist/Bode control theory
    StatisticsPage.jsx      # GUE random matrix statistics
    SupercriticalPage.jsx   # Supercritical region + Bost-Connes
    InformationTheoryPage.jsx # Shannon entropy, channel capacity
    PascalPage.jsx          # Pascal's triangle ↔ zeta connections
    OddZetaPage.jsx         # Odd zeta values + Kolmogorov complexity
    TwistorPage.jsx         # Twistor duality (3D WebGL)
    ZXCalculusPage.jsx      # ZX-calculus quantum formulation
    RHAttackPage.jsx        # Five proof paths overview
    SpectralAttackPage.jsx  # Six-measure spectral confinement
    GapClosingPage.jsx      # Gap S4/S5/S7 analysis
    FormalProofPage.jsx     # 10-section formal proof structure
    ProofCheckerPage.jsx    # Computational verification suite
    RHRigorPage.jsx         # Rigorous claims vs conjectures
    HistoricalReasoningPage.jsx # Evolving proof strategy log
    ExplorationsPage.jsx    # AI exploration journal (80+ entries)
    LiteraturePage.jsx      # Literature database with citations
    HistoryPage.jsx         # 38 key mathematicians + timeline
    ConceptsPage.jsx        # Mathematical concepts glossary
    PaperPage.jsx           # Condensed paper with key equations
    DocsPage.jsx            # Documentation + architecture
    ImprovementsPage.jsx    # Auto-improvement log (400+ entries)

  components/               # 34 reusable components
    KaTeXMath.jsx            # LaTeX rendering (InlineMath, BlockMath)
    InsightDAG.jsx           # Force-directed knowledge graph (D3)
    TwistorDiagram3D.jsx     # 3D twistor visualization (Three.js)
    EulerProductViz.jsx      # Interactive Euler product explorer
    EnergyLandscapeViz.jsx   # 3D Hamiltonian surface
    NyquistBodeViz.jsx       # Nyquist/Bode plot suite
    FormalProofViz.jsx       # Proof section scorecard
    ProofCheckerViz.jsx      # Computational test suite
    RHRigorViz.jsx           # Rigor analysis visualization
    SystemArchitectureDiagram.jsx  # System overview diagram
    ThermoBar.jsx            # Thermodynamic state indicators
    ...and 23 more

  math/                     # 15 computation modules
    zeta.js                  # Riemann zeta function evaluation
    primes.js                # Prime generation, Euler product
    spectral-attack.js       # Six-measure spectral confinement
    gap-closing.js           # Eta regularization, unitarity deficit
    formal-proof.js          # 10-section proof computation
    proof-checker.js         # Li coefficients, Hamiltonian tests
    rh-attack.js             # Five attack path computations
    supercritical.js         # Thermodynamic state functions
    information-theory.js    # Shannon/Fisher/channel capacity
    pascal.js                # Pascal-zeta connections
    twistor.js               # Twistor space computations
    ...and 4 more

  data/                     # Data files
    explorations.js          # 80+ exploration journal entries
    improvements.js          # 400+ auto-improvement log entries
    insight-dag.js           # 33 nodes, 90+ edges knowledge graph
    literature.js            # Academic references database
    criticisms.js            # Known criticisms + responses

  styles/
    app.css                  # Complete styling (dark theme)

scripts/
  auto-improve.sh            # Automated improvement engine (Claude Code CLI)

vite.config.js               # Vite config with code-splitting
```

## Architecture

### Code Splitting

The app uses `React.lazy()` for route-based code splitting. The main bundle is ~474 KB, with vendor chunks:
- `vendor-three` (~1.1 MB): Three.js, only loaded for the Twistor page
- `vendor-katex` (~261 KB): LaTeX rendering
- `vendor-d3` (~87 KB): D3 force layout for the insight DAG

### The Three Proof Gaps

The ZPO model identifies three gaps between the framework and a proof of RH:

| Gap | Name | Status | Description |
|-----|------|--------|-------------|
| S4 | Regularization | Conditional | Extend Euler product to critical strip via eta relation |
| S5 | Hilbert-Polya | Open | Construct self-adjoint operator with spectrum = zeta zeros |
| S7 | Darlington | Open | Prove infinite twin-ladder is exactly lossless |

**Current strategy:** Focus on S7 (Darlington convergence) via monotone contraction — see the [Historical Reasoning](/reasoning) page.

### The Five Attack Paths

1. **Hilbert-Polya (Spectral):** Construct self-adjoint operator → real eigenvalues → RH
2. **Darlington (Network):** Twin-ladder lossless → transmission zeros on critical line → RH
3. **Weil Positivity (Connes):** Quadratic form W[f] >= 0 → RH
4. **Nyman-Beurling:** L^2 density of fractional parts → RH
5. **Li Criterion:** lambda_n >= 0 for all n → RH

### Insight DAG

A 33-node, 90+ edge directed graph mapping logical dependencies:
- **Foundation layer:** Euler product, functional equation, analytic continuation
- **Model layer:** Single oscillator, ladder chain, twin-ladder, bridge unitarity, Hamiltonian
- **Analysis layer:** KL divergence, Fisher information, GUE statistics, Weil form, twistor incidence, ...
- **Gap layer:** S4, S5, S7
- **Frontier layer:** Connes' Zeta Spectral Triples, Guth-Maynard, monotone contraction
- **Target:** Riemann Hypothesis

### Auto-Improvement Engine

The `scripts/auto-improve.sh` script invokes the Claude Code CLI on a timer to make atomic improvements:

```bash
./scripts/auto-improve.sh start    # Start (every 60s, max 100 runs)
./scripts/auto-improve.sh stop     # Stop
./scripts/auto-improve.sh status   # Check status
```

Each run picks one improvement category (bug fix, accuracy, UX, visual, performance, content), makes a single change, verifies the build, and commits.

## Key Mathematical Connections

| Classical | ZPO Model |
|-----------|-----------|
| Euler product | Cascade of prime harmonic oscillators |
| Functional equation xi(s) = xi(1-s) | Direct/dual ladder symmetry |
| Completed zeta xi(s) | Twin-ladder scattering matrix |
| Critical line sigma = 1/2 | Impedance match / lossless bridge |
| Zeta zeros | Transmission zeros of the network |
| GUE statistics | Quantum chaos in the oscillator chain |
| Selberg trace formula | Spectral = geometric (eigenvalues = prime orbits) |
| Connes' rank-one perturbation | ZPO bridge chi(s) |

## Tech Stack

- **React 19** with React Router
- **Vite 6** for build/dev with code splitting
- **KaTeX** for LaTeX math rendering
- **D3.js** for force-directed graphs and data visualization
- **Three.js** + React Three Fiber for 3D WebGL
- **Canvas API** for high-performance 2D visualizations
- **SVG** for circuit diagrams and static visualizations

## Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
```

The app has no backend — all computation runs client-side in the browser.

## License

MIT
