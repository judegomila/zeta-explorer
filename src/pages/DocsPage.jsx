import React from 'react';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import SystemArchitectureDiagram from '../components/SystemArchitectureDiagram.jsx';
import PageHeader from '../components/PageHeader.jsx';

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'system-diagram', label: 'System Architecture' },
  { id: 'model', label: 'Mathematical Model' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'pages', label: 'Pages' },
  { id: 'math-modules', label: 'Math Modules' },
  { id: 'viz-components', label: 'Visualizations' },
  { id: 'data-model', label: 'Data Model' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'limitations', label: 'Limitations' },
];

function Fn({ name, params, desc }) {
  return (
    <div className="docs-fn">
      <span className="fn-name">{name}</span>
      <span className="fn-params">({params})</span>
      {desc && <div className="fn-desc">{desc}</div>}
    </div>
  );
}

export default function DocsPage() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page">
      <PageHeader title="Documentation">
        <p>
          Complete technical reference for the ZPO Explorer app: mathematical model,
          architecture, algorithms, and every module and component documented.
        </p>
      </PageHeader>

      {/* Table of Contents */}
      <div className="docs-toc">
        <h3>Contents</h3>
        <div className="docs-toc-links">
          {TOC.map(t => (
            <a key={t.id} onClick={() => scrollTo(t.id)} style={{ cursor: 'pointer' }}>{t.label}</a>
          ))}
        </div>
      </div>

      {/* 1. Overview */}
      <section id="overview" className="docs-section">
        <h2>Overview</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          ZPO Explorer is an interactive mathematical visualization app that explores the Riemann zeta function
          through the lens of a <strong>Zeta Prime Oscillator (ZPO)</strong> model. The central idea: the Euler product
        </p>
        <BlockMath tex={"\\zeta(s) = \\prod_{p\\;\\text{prime}} \\frac{1}{1 - p^{-s}}"} />
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          is interpreted as the transfer function of a cascade of LC oscillator stages, one per prime.
          Each stage has Euler factor phase rate <InlineMath tex={"\\omega_p = \\log p"} /> and LC resonant frequency <InlineMath tex={"\\omega_0 = 1"} />, and the entire product forms
          a <strong>ladder network</strong>. The functional equation <InlineMath tex={"\\zeta(s) = \\chi(s)\\zeta(1-s)"} /> is
          realized as a lossless bridge connecting direct and dual ladder networks. The Riemann Hypothesis (that
          all nontrivial zeros have <InlineMath tex={"\\text{Re}(s) = \\tfrac{1}{2}"} />) corresponds to the system being at
          its minimum energy, maximum symmetry, critically coupled configuration.
        </p>
        <div className="card" style={{ marginTop: 16, borderColor: 'var(--accent-orange)' }}>
          <p style={{ color: 'var(--accent-orange)', fontSize: 13, fontWeight: 600 }}>
            This is an exploratory/pedagogical model, not a proof of RH. The oscillator analogy is a mathematical
            metaphor that provides intuition for the zeta function's structure.
          </p>
        </div>
      </section>

      {/* System Architecture Diagram */}
      <section id="system-diagram" className="docs-section">
        <h2>System Architecture</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14, marginBottom: 16 }}>
          The ZPO framework spans five conceptual layers, from number-theoretic foundations through
          physical modelling to computational implementation. Hover over nodes to see mathematical
          definitions and trace data flow dependencies.
        </p>
        <div className="card" style={{ padding: '16px 8px', overflow: 'hidden' }}>
          <SystemArchitectureDiagram />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 12 }}>
          {[
            { color: '#3b82f6', label: 'Number Theory' },
            { color: '#8b5cf6', label: 'Analytic Structure' },
            { color: '#10b981', label: 'Physical Model' },
            { color: '#f59e0b', label: 'Analysis' },
            { color: '#ef4444', label: 'Computation' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
              {l.label}
            </div>
          ))}
        </div>
      </section>

      {/* 2. Mathematical Model */}
      <section id="model" className="docs-section">
        <h2>Mathematical Model</h2>

        <h3>Prime Oscillators</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          Each prime <InlineMath tex="p" /> defines an LC oscillator stage with:
        </p>
        <ul style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, marginLeft: 20, marginBottom: 12 }}>
          <li>Characteristic frequency: <InlineMath tex={"\\omega_p = \\log p"} /> (Euler factor phase rotation rate)</li>
          <li>Inductance: <InlineMath tex={"L_p = \\log p"} />, Capacitance: <InlineMath tex={"C_p = 1/\\log p"} />, LC resonant frequency: <InlineMath tex={"\\omega_0 = 1/\\sqrt{L_p C_p} = 1"} /></li>
          <li>Transfer function: <InlineMath tex="H_p(s) = (1 - p^{-s})^{-1}" /></li>
          <li>Quality factor: <InlineMath tex={"Q_p = 1/(2\\sigma)"} /> where <InlineMath tex={"\\sigma = \\text{Re}(s)"} /></li>
        </ul>

        <h3>Direct and Dual Ladders</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          The <strong>direct ladder</strong> cascades oscillator stages to compute <InlineMath tex={"\\zeta(s)"} />.
          The <strong>dual ladder</strong> applies the transformation <InlineMath tex={"s \\to 1-s"} /> to compute <InlineMath tex={"\\zeta(1-s)"} />.
          At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, both ladders are conjugate-matched (<InlineMath tex={"Z_{\\text{dual}} = \\overline{Z_{\\text{dir}}}"} /> via Schwarz reflection).
        </p>

        <h3>Lossless Bridge</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          The bridge factor <InlineMath tex={"\\chi(s)"} /> from the functional equation connects the ladders:
        </p>
        <BlockMath tex={"\\chi(s) = 2^s \\pi^{s-1} \\sin\\!\\left(\\frac{\\pi s}{2}\\right) \\Gamma(1-s)"} />
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          At <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} />, <InlineMath tex={"|\\chi(s)| = 1"} /> (lossless/unitary).
          Off the critical line, <InlineMath tex={"|\\chi| \\neq 1"} /> and the bridge becomes lossy.
        </p>

        <h3>System Hamiltonian</h3>
        <BlockMath tex={"\\mathcal{H} = \\underbrace{T_{\\text{kinetic}}}_{= \\sum_p \\frac{1}{2}\\log p\\,(|H_p(s)|^2 + |H_p(1{-}s)|^2)} + \\underbrace{V_{\\text{mismatch}}}_{= \\frac{1}{2}|Z_{\\text{dir}} - Z_{\\text{dual}}|^2} + \\underbrace{V_{\\text{bridge}}}_{= 100(1-|\\chi|)^2}"} />
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          The Hamiltonian is minimized at <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> for all <InlineMath tex="t" />,
          where mismatch is minimized (conjugate-matched, not zero: <InlineMath tex={"|Z_{\\text{dir}} - Z_{\\text{dual}}| = 2|\\text{Im}\\,Z|"} />) and the bridge is lossless. Gradient descent on <InlineMath tex={"\\mathcal{H}"} /> always
          converges to the critical line.
        </p>
      </section>

      {/* 3. Architecture */}
      <section id="architecture" className="docs-section">
        <h2>Architecture</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'React 19', desc: 'UI framework' },
            { label: 'D3.js', desc: 'SVG visualizations' },
            { label: 'Canvas API', desc: 'Heatmaps & animations' },
            { label: 'KaTeX', desc: 'LaTeX math rendering' },
            { label: 'Vite 7', desc: 'Build & dev server' },
            { label: 'HashRouter', desc: 'Client-side routing' },
          ].map(t => (
            <div key={t.label} className="stat-box">
              <div style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: 13 }}>{t.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{t.desc}</div>
            </div>
          ))}
        </div>

        <h3>File Structure</h3>
        <div className="docs-file-tree">
          <div><span className="dir">src/</span></div>
          <div>&nbsp;&nbsp;<span className="dir">math/</span> <span className="comment">— Pure math functions (15 modules)</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">zeta.js</span> <span className="comment">— Complex arithmetic, zeta computation, 650 zeros</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">oscillators.js</span> <span className="comment">— Prime oscillator chain, Hamiltonian, energy landscape, accuracy metrics</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">primes.js</span> <span className="comment">— Sieve, frequencies, von Mangoldt, explicit formula</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">supercritical.js</span> <span className="comment">— Extended zeta, thermodynamics, heat flow, spectral</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">twistor.js</span> <span className="comment">— Twistor duality, Penrose transform, incidence relation</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">weil-connes.js</span> <span className="comment">— Weil quadratic form, Connes zero approx, Selberg trace</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">gap-closing.js</span> <span className="comment">— Regularization, Berry-Keating, Darlington convergence</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">spectral-attack.js</span> <span className="comment">— 6 attack vectors, D-H cross-validation, bootstrap</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">proof-checker.js</span> <span className="comment">— Logic gap detection, Euler product discriminator</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">formal-proof.js</span> <span className="comment">— 10-section proof attempt with status tracking</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">rh-attack.js</span> <span className="comment">— Direct RH attack strategies</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">information-theory.js</span> <span className="comment">— Shannon entropy, channel capacity, Fisher info</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">odd-zeta.js</span> <span className="comment">— Odd zeta value irrationality via Chaitin/Kolmogorov</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">pascal.js</span> <span className="comment">— Pascal triangle and prime oscillator coupling</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">zxcalculus.js</span> <span className="comment">— ZX-calculus spider/wire representations</span></div>
          <div>&nbsp;&nbsp;<span className="dir">components/</span> <span className="comment">— 34 visualization components + KaTeX wrapper</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">KaTeXMath.jsx</span> <span className="comment">— InlineMath, BlockMath, MathText, MathModal</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">*Viz.jsx</span> <span className="comment">— Interactive D3/Canvas visualizations</span></div>
          <div>&nbsp;&nbsp;<span className="dir">pages/</span> <span className="comment">— 34 route pages</span></div>
          <div>&nbsp;&nbsp;<span className="dir">data/</span> <span className="comment">— Explorations, literature, criticisms, improvements, insight DAG</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">explorations.js</span> <span className="comment">— 72 AI exploration entries with LaTeX, insights, refs</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">literature.js</span> <span className="comment">— 85+ annotated references with DOI/arXiv links</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">criticisms.js</span> <span className="comment">— 12 criticisms (9 patched, 1 disputed, 2 open)</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">improvements.js</span> <span className="comment">— 700+ auto-improvement log entries</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">insight-dag.js</span> <span className="comment">— 30-node DAG of connected mathematical insights with 70+ edges</span></div>
          <div>&nbsp;&nbsp;<span className="dir">styles/</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">app.css</span> <span className="comment">— All styles (dark theme, responsive)</span></div>
        </div>
      </section>

      {/* 4. Pages */}
      <section id="pages" className="docs-section">
        <h2>Pages</h2>
        <div className="card-grid">
          {[
            { route: '/', name: 'Home', desc: 'Step-by-step model intro with SVG diagrams, insight DAG, simulation cards, correspondences table, learning path' },
            { route: '/oscillators', name: 'Oscillators', desc: 'OscillatorChainViz — dual ladder network with per-prime detail panels, 3-step derivation' },
            { route: '/hamiltonian', name: 'Hamiltonian', desc: 'HamiltonianViz + ExplicitFormulaViz — energy landscape, explicit formula decomposition, Weil connection' },
            { route: '/zeta', name: 'Zeta', desc: 'ZetaLandscapeViz, EulerProductViz — Riemann-Siegel formula, twin ladder zeros' },
            { route: '/waves', name: 'Waves', desc: 'WaveSimViz — 5-tab wave simulator with accuracy badge (signal flow, waves, interference, delay, circuit)' },
            { route: '/modes', name: 'Modes', desc: 'AnimatedModesViz — mode evolution at zeros, mode coupling, critical coupling analysis' },
            { route: '/simulator', name: 'Simulator', desc: 'TwinOscillatorSimViz — 5-tab (per-prime, gradient, convergence, bridge, multi-zero) + Weil connection' },
            { route: '/fourier', name: 'Fourier', desc: 'FourierDomainViz — 4 tabs (von Mangoldt spectrum, frequency response, spectral energy, harmonics)' },
            { route: '/control', name: 'Control Theory', desc: 'NyquistBodeViz + ScatteringMatrixViz — Nyquist/Bode plots, H∞ control, scattering matrix' },
            { route: '/statistics', name: 'Statistics', desc: 'GUEStatisticsViz, LiCriterionViz — GUE, pair correlations, Li coefficients, de Bruijn-Newman' },
            { route: '/supercritical', name: 'Supercritical', desc: 'SupercriticalViz — 4 tabs (landscape, thermodynamics, heat flow, Euler phase)' },
            { route: '/info-theory', name: 'Information Theory', desc: 'InformationTheoryViz + InfoTheoryExperimentsViz — Shannon entropy, channel capacity, experiments' },
            { route: '/pascal', name: 'Pascal', desc: 'PascalZetaViz — Pascal triangle mod p connections to prime oscillator harmonics' },
            { route: '/odd-zeta', name: 'Odd Zeta', desc: 'OddZetaViz — Irrationality of ζ(2n+1) via Chaitin/Kolmogorov complexity' },
            { route: '/rh-attack', name: 'RH Attack', desc: 'RHAttackViz — Direct assault strategies with adversarial testing' },
            { route: '/spectral-attack', name: 'Spectral Attack', desc: 'SpectralAttackViz — 6 attack vectors, Weil quadratic form, D-H cross-validation' },
            { route: '/gap-closing', name: 'Gap Closing', desc: 'GapClosingViz — S4 regularization, S5 Hilbert-Polya, S7 Darlington, Berry-Keating, Selberg trace' },
            { route: '/twistor', name: 'Twistor', desc: 'TwistorViz — 4-tab (correspondence, Penrose transform, incidence relation, dual pair animation)' },
            { route: '/zx-calculus', name: 'ZX-Calculus', desc: 'ZXCalculusViz — ZX diagram representation of twin ladder duality' },
            { route: '/formal-proof', name: 'Formal Proof', desc: 'FormalProofViz — 10-section proof attempt with 3 paths (Hilbert-Polya, Darlington, Weil), scorecard' },
            { route: '/proof-checker', name: 'Proof Checker', desc: 'ProofCheckerViz — adversarial logic gap detection, Euler product discriminator' },
            { route: '/rigor', name: 'Rigor', desc: 'RHRigorViz — 12 criticisms (9 patched, 1 disputed, 2 open), numerical stress tests' },
            { route: '/concepts', name: 'Concepts', desc: '60+ key mathematical concepts organized by category with LaTeX definitions' },
            { route: '/history', name: 'History', desc: '38 historical figures across 4 eras with TLDR explainers' },
            { route: '/explorations', name: 'Explorations', desc: '72 AI exploration entries with LaTeX math, insights, reference links' },
            { route: '/literature', name: 'Literature', desc: '85+ annotated references with clickable DOI/arXiv paper links' },
            { route: '/paper', name: 'Paper', desc: 'Formal write-up of the ZPO framework as a research paper (14 sections)' },
            { route: '/docs', name: 'Docs', desc: 'This page — complete technical documentation of the application' },
            { route: '/improvements', name: 'Improvements', desc: '700+ auto-improvement log entries with filterable categories' },
            { route: '/reasoning', name: 'Reasoning', desc: 'Historical reasoning log — evolving proof strategy entries organized by epoch' },
            { route: '/papers', name: 'Papers', desc: 'Uploaded LaTeX papers list with parsed rendering and management' },
            { route: '/paper-upload', name: 'Paper Upload', desc: 'LaTeX paper upload and parsing tool with live preview' },
            { route: '/twin-ladder', name: 'Twin Ladder', desc: 'TwinLadderViz — 5-tab (anatomy, pressure/temperature, freezing, collapse, phase diagram)' },
            { route: '/calabi-yau', name: 'Calabi-Yau', desc: 'CalabiYauViz — Calabi-Yau manifold attack on RH via Weil conjecture cohomological machinery' },
          ].map(p => (
            <div key={p.route} className="card">
              <h3><span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{p.route}</span> {p.name}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Math Modules */}
      <section id="math-modules" className="docs-section">
        <h2>Math Modules</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
          100+ exported functions across 15 pure-math modules. All complex numbers are <code style={{ color: 'var(--accent-cyan)' }}>[re, im]</code> tuples.
        </p>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-blue)' }}>zeta.js</span> — Complex arithmetic &amp; zeta computation (15 functions + 1 constant)
          </summary>
          <div>
            <h3>Complex Arithmetic</h3>
            <Fn name="cMul" params="a, b" desc="Multiply two complex numbers" />
            <Fn name="cDiv" params="a, b" desc="Divide complex numbers (with zero protection)" />
            <Fn name="cAdd" params="a, b" desc="Add two complex numbers" />
            <Fn name="cSub" params="a, b" desc="Subtract two complex numbers" />
            <Fn name="cAbs" params="a" desc="Magnitude |a| of complex number" />
            <Fn name="cExp" params="a" desc="Complex exponential e^a" />
            <Fn name="cLog" params="a" desc="Complex natural logarithm" />
            <Fn name="cPow" params="base, exp" desc="Complex power base^exp" />
            <h3>Zeta Functions</h3>
            <Fn name="zetaDirichlet" params="s, N=1000" desc="Dirichlet series for Re(s) > 1" />
            <Fn name="zetaEulerProduct" params="s, numPrimes=100" desc="Euler product over first numPrimes primes" />
            <Fn name="eulerFactor" params="p, s" desc="Individual Euler factor 1/(1 - p^{-s})" />
            <Fn name="partialEulerProduct" params="s, k" desc="Partial product up to k-th prime with stage details" />
            <Fn name="riemannSiegelTheta" params="t" desc="Riemann-Siegel theta function approximation" />
            <Fn name="riemannSiegelZ" params="t" desc="Z function on critical line with C₀ correction" />
            <Fn name="zetaCriticalStrip" params="s, N=50" desc="Borwein-accelerated zeta (≈15-digit precision)" />
            <h3>Constants</h3>
            <Fn name="ZETA_ZEROS" params="" desc="Array of 650 nontrivial zero imaginary parts (Odlyzko's tables, 9-digit precision)" />
          </div>
        </details>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-green)' }}>oscillators.js</span> — Prime oscillator chain model (7 functions)
          </summary>
          <div>
            <Fn name="oscillatorStage" params="p, s" desc="LC resonator stage: impedance, transfer fn, energy, Q-factor" />
            <Fn name="directLadder" params="s, numPrimes=20" desc="Direct ladder network ζ(s) as cascade" />
            <Fn name="dualLadder" params="s, numPrimes=20" desc="Dual ladder ζ(1-s) with s→1-s transformation" />
            <Fn name="losslessBridge" params="s" desc="Bridge factor χ(s) with unitarity analysis" />
            <Fn name="systemHamiltonian" params="s, numPrimes=20" desc="Total energy (kinetic + mismatch + bridge) with gradient" />
            <Fn name="hamiltonianSigmaScan" params="t, sigmaRange, steps, numPrimes" desc="Scan H along σ-axis for fixed t" />
            <Fn name="energyLandscape" params="sigmaRange, tRange, res, numPrimes" desc="2D energy landscape over σ-t plane" />
          </div>
        </details>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-cyan)' }}>primes.js</span> — Prime number utilities (7 functions)
          </summary>
          <div>
            <Fn name="sieveOfEratosthenes" params="limit" desc="All primes up to limit via sieve" />
            <Fn name="getPrimes" params="n" desc="First n primes (pre-computed)" />
            <Fn name="primeFrequency" params="p" desc="Characteristic impedance Z₀ = log(p) (all primes share ω₀ = 1)" />
            <Fn name="primeWavelength" params="p" desc="Wavelength λ = 2π/log(p)" />
            <Fn name="vonMangoldt" params="n" desc="Λ(n) = log(p) if n=p^k, else 0" />
            <Fn name="chebyshevPsi" params="x" desc="Chebyshev ψ(x) = Σ Λ(n) for n ≤ x" />
            <Fn name="explicitFormulaTerms" params="x, zeros, sigma" desc="Oscillatory zero-sum correction to ψ(x)" />
          </div>
        </details>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-orange)' }}>supercritical.js</span> — Extended analysis &amp; thermodynamics (13 functions)
          </summary>
          <div>
            <h3>Extended Zeta</h3>
            <Fn name="zetaExtended" params="s, N=300" desc="ζ(s) over entire plane (auto-selects optimal method)" />
            <Fn name="zetaMagnitudeScan" params="t, sigmaRange, steps" desc="|ζ(σ+it)| across extended σ range" />
            <Fn name="zetaLandscapeExtended" params="sigmaRange, tRange, resolution" desc="2D landscape of |ζ| and arg(ζ)" />
            <h3>Thermodynamics</h3>
            <Fn name="thermodynamicState" params="sigma, t, numPrimes" desc="ζ as partition function: F, S, P, C_v, phase" />
            <Fn name="thermodynamicScan" params="t, sigmaRange, steps, numPrimes" desc="Scan thermo quantities across σ" />
            <h3>Heat Flow (de Bruijn-Newman)</h3>
            <Fn name="heatFlowZeros" params="tau, numZeros" desc="Evolve zero positions under heat equation" />
            <Fn name="heatEvolvedXi" params="t, tau, numTerms" desc="Heat-evolved ξ function H_τ(t)" />
            <Fn name="heatFlowScan" params="tau, tRange, steps" desc="Scan |H_τ(t)| along t-axis" />
            <h3>Spectral / Fourier</h3>
            <Fn name="ladderFrequencyResponse" params="sigma, omegaRange, steps, numPrimes" desc="Frequency response of oscillator chain" />
            <Fn name="spectralEnergyDensity" params="sigma, omegaRange, steps, numPrimes" desc="Energy distribution across direct/dual ladders" />
            <Fn name="primeHarmonicDecomposition" params="sigma, numPrimes" desc="Harmonic decomposition per prime with Q-factors" />
            <Fn name="vonMangoldtSpectrum" params="maxN, numFreqs, freqRange" desc="DFT of Λ(n) revealing peaks at zero frequencies" />
            <Fn name="eulerProductPhaseAnalysis" params="t, sigmaRange, steps, numPrimes" desc="Euler product convergence vs σ = 1 boundary" />
          </div>
        </details>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-blue)' }}>twistor.js</span> — Twistor duality &amp; Penrose transform (6 functions)
          </summary>
          <div>
            <h3>Twistor Maps</h3>
            <Fn name="twistorFromS" params="s" desc="Map s = σ+it to twistor Z^α = (ω^A, π_{A'})" />
            <Fn name="dualTwistorFromS" params="s" desc="Map 1−s to dual twistor W_α" />
            <Fn name="intertwiner" params="twistor, s" desc="Bridge intertwiner I: Z → W using χ(s)" />
            <h3>Incidence &amp; Scans</h3>
            <Fn name="incidenceRelation" params="twistor, dualTwistor" desc="Symplectic inner product Z·Ω·W (vanishes at σ=0.5)" />
            <Fn name="twistorCorrespondence" params="t, sigmaRange, steps" desc="Scan incidence magnitude across σ" />
            <Fn name="penroseTransformScan" params="t, sigmaRange, steps, numPrimes" desc="Euler-product-weighted twistor field vs |ζ(s)|" />
          </div>
        </details>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-green)' }}>weil-connes.js</span> — Weil quadratic form &amp; Connes 2026 (6 functions)
          </summary>
          <div>
            <Fn name="weilExplicitFormula" params="f, fHat, zeros, primes, maxK" desc="Evaluate both sides of the Weil explicit formula" />
            <Fn name="weilQuadraticForm" params="g, primes, gridSize" desc="Kernel construction + eigenvalue extraction for W(g*g̃)" />
            <Fn name="connesZeroApproximation" params="numZeros, primeBound, iter" desc="Gradient descent with primes < 13 to approximate zeros" />
            <Fn name="selbergTraceAnalog" params="testFunction, zeros, primes" desc="Spectral side vs geometric side comparison" />
            <Fn name="primeInformationContent" params="primeBound, numZeros" desc="Shannon bits per zero from prime set" />
            <Fn name="weilZPOCorrelation" params="numZeros, numPrimes" desc="Cross-validate Weil form against Hamiltonian minima" />
          </div>
        </details>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-orange)' }}>gap-closing.js</span> — Gap analysis &amp; Darlington synthesis (15+ functions)
          </summary>
          <div>
            <Fn name="regularizedEulerProduct" params="s, numPrimes, method" desc="4 methods: eta, borwein, cesaro, riemannSiegel with error bounds" />
            <Fn name="selfAdjointCandidate" params="s, numPrimes" desc="Hermitian operator construction for S5 gap" />
            <Fn name="darlingtonSynthesis" params="s, numPrimes" desc="Lossless 2-port synthesis for S7 gap" />
            <Fn name="berryKeatingEigenvalues" params="K, N" desc="xp operator semiclassical eigenvalues" />
            <Fn name="spectralGapAnalysis" params="K" desc="GUE consistency test of eigenvalue spacings" />
            <Fn name="darlingtonConvergence" params="t, range" desc="Power-law unitarity convergence as primes increase" />
            <Fn name="selbergTraceTest" params="alpha, numZeros, numPrimes" desc="Explicit formula spectral=geometric verification" />
            <Fn name="lanczosEigenvalues" params="matrix, size, iter" desc="Lanczos iteration for large Hermitian matrices" />
          </div>
        </details>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-red)' }}>spectral-attack.js</span> — 6 attack vectors + D-H validation (10+ functions)
          </summary>
          <div>
            <Fn name="klLyapunov" params="s, numPrimes" desc="KL divergence Lyapunov function V(σ)" />
            <Fn name="fisherInformation" params="s, numPrimes" desc="Fisher information metric on σ" />
            <Fn name="confinementPotential" params="s, numPrimes" desc="Unified confinement potential combining 5 metrics" />
            <Fn name="spectralAttackScan" params="t, sigmaRange, steps, numPrimes" desc="Scan all 6 attack vectors across σ" />
            <Fn name="crossValidateWithDH" params="t, numPrimes" desc="Test attacks against Davenport-Heilbronn function" />
            <Fn name="bootstrapAttackConfidence" params="numBootstrap" desc="Bootstrap robustness estimation for each attack" />
          </div>
        </details>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-cyan)' }}>proof-checker.js</span> — Adversarial testing (5+ functions)
          </summary>
          <div>
            <Fn name="checkProofSection" params="sectionId" desc="Run all checks on a formal proof section" />
            <Fn name="logicGapDetector" params="sectionId" desc="Detect logical gaps in proof arguments" />
            <Fn name="numericalStressTest" params="sectionId, extremeValues" desc="Stress test claims with extreme parameters" />
            <Fn name="eulerProductDiscriminator" params="t, numPrimes" desc="Test 6 strategies against ζ AND Davenport-Heilbronn" />
          </div>
        </details>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-blue)' }}>information-theory.js</span> — Information measures (6+ functions)
          </summary>
          <div>
            <Fn name="shannonEntropy" params="s, numPrimes" desc="Shannon entropy of Euler factor weight distribution" />
            <Fn name="channelCapacity" params="s, numPrimes" desc="Channel capacity of ladder as communication channel" />
            <Fn name="fisherInformationMetric" params="s, numPrimes" desc="Fisher information metric on parameter σ" />
            <Fn name="mutualInformation" params="s, numPrimes" desc="Mutual information between direct and dual ladders" />
            <Fn name="informationScan" params="t, sigmaRange, steps, numPrimes" desc="Scan all info measures across σ" />
          </div>
        </details>
      </section>

      {/* 6. Visualization Components */}
      <section id="viz-components" className="docs-section">
        <h2>Visualization Components</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
          34 interactive visualization components using D3.js (SVG) and Canvas API.
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Page</th>
              <th>Renderer</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['OscillatorChainViz', 'Oscillators', 'SVG', 'Direct/dual ladder network with clickable prime nodes'],
              ['HamiltonianViz', 'Hamiltonian', 'SVG', 'Energy σ-scan: kinetic, mismatch, bridge components'],
              ['EnergyLandscapeViz', 'Hamiltonian', 'Canvas', '2D heatmap of energy/mismatch in (σ,t) plane'],
              ['ExplicitFormulaViz', 'Hamiltonian', 'SVG', 'Explicit formula ψ(x) with spectral reconstruction'],
              ['ZetaLandscapeViz', 'Zeta', 'Canvas', '2D heatmap of |ζ(s)| with domain coloring'],
              ['EulerProductViz', 'Zeta', 'SVG', 'Partial Euler product convergence prime-by-prime'],
              ['WaveSimViz', 'Waves', 'Canvas+SVG', '5-tab: signal flow, per-prime waves, interference, delay, circuit + accuracy badge'],
              ['AnimatedModesViz', 'Modes', 'Canvas', 'Animated time evolution of oscillator modes at zeros'],
              ['ScatteringMatrixViz', 'Control', 'SVG', 'Scattering matrix S(s) analysis'],
              ['PrimeGapCouplingViz', 'Modes', 'SVG', 'Prime gap statistics and coupling visualization'],
              ['ExplorationGraphViz', 'Explorations', 'SVG', 'Graph of exploration connections'],
              ['TwinOscillatorSimViz', 'Simulator', 'Canvas+SVG', '5-tab: per-prime, gradient, convergence, bridge, multi-zero'],
              ['NyquistBodeViz', 'Control', 'SVG', 'Nyquist plot + Bode diagram of L(s) = χ·ζ(1-s)/ζ(s)'],
              ['GUEStatisticsViz', 'Statistics', 'SVG', 'Zero spacing distribution vs GUE prediction'],
              ['LiCriterionViz', 'Statistics', 'SVG', 'Li coefficients λ_n with asymptotic reference'],
              ['SupercriticalViz', 'Supercritical', 'Canvas+SVG', '4-tab: landscape, thermodynamics, heat flow, Euler phase'],
              ['FourierDomainViz', 'Fourier', 'SVG', '4-tab: von Mangoldt spectrum, frequency response, spectral energy, harmonics'],
              ['InformationTheoryViz', 'Info Theory', 'Canvas', 'Shannon entropy, channel capacity, Fisher information'],
              ['InfoTheoryExperimentsViz', 'Info Theory', 'Canvas', '4-tab experiments: efficiency, prime contribution, landscape, compression'],
              ['RHAttackViz', 'RH Attack', 'Canvas', 'Direct attack strategies with adversarial testing'],
              ['SpectralAttackViz', 'Spectral Attack', 'Canvas', '6 attack vectors with Weil quadratic form'],
              ['GapClosingViz', 'Gap Closing', 'Canvas+SVG', 'S4/S5/S7 gap analysis with Berry-Keating, Selberg trace tests'],
              ['FormalProofViz', 'Formal Proof', 'SVG', '10-section proof tracker with 3 paths and scorecard'],
              ['ProofCheckerViz', 'Proof Checker', 'Canvas', 'Adversarial logic gaps, Euler product discriminator'],
              ['RHRigorViz', 'Rigor', 'Canvas', 'Numerical stress tests: Hamiltonian minimization, bridge unitarity'],
              ['TwistorViz', 'Twistor', 'Canvas+SVG', '4-tab: correspondence, Penrose transform, incidence, dual pair'],
              ['TwistorDiagram3D', 'Twistor', 'Canvas', '3D twistor space visualization'],
              ['ZXCalculusViz', 'ZX-Calculus', 'SVG', 'ZX diagram representation of twin ladder'],
              ['PascalZetaViz', 'Pascal', 'Canvas', 'Pascal triangle mod p with oscillator connections'],
              ['OddZetaViz', 'Odd Zeta', 'Canvas', 'Odd zeta irrationality via Chaitin/Kolmogorov'],
              ['InsightDAG', 'Home', 'SVG', 'Interactive DAG of 22+ connected mathematical insights'],
              ['SystemArchitectureDiagram', 'Docs', 'SVG', '5-layer system architecture with hover details'],
              ['ThermoBar', 'Waves', 'SVG', 'Thermodynamic state indicator bar'],
            ].map(([name, page, renderer, purpose]) => (
              <tr key={name}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', fontSize: 12 }}>{name}</td>
                <td>{page}</td>
                <td><span className="tag tag-cyan">{renderer}</span></td>
                <td>{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 7. Data Model */}
      <section id="data-model" className="docs-section">
        <h2>Data Model</h2>

        <h3>Exploration Entry (explorations.js)</h3>
        <div className="docs-fn">
          <div className="fn-desc" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap' }}>
{`{
  id: string,          // unique slug
  title: string,       // display title
  category: string,    // foundation | oscillator-model | duality | hamiltonian | ...
  status: string,      // complete | in-progress | queued
  depth: number,       // exploration depth (1-5)
  timestamp: string,   // ISO date
  content: string,     // markdown-like text with $math$ blocks
  latex: string[],     // standalone LaTeX equations
  insights: string[],  // key insight bullets
  references: string[],// literature IDs (link to literature.js)
  nextSteps: string[], // IDs of follow-up explorations
}`}
          </div>
        </div>

        <h3>Literature Entry (literature.js)</h3>
        <div className="docs-fn">
          <div className="fn-desc" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap' }}>
{`{
  id: string,          // citation key (e.g. "rodgers-tao-2020")
  title: string,       // paper title
  authors: string[],   // author names
  year: number,        // publication year
  journal: string,     // journal/venue
  tags: string[],      // topic tags
  summary: string,     // one-paragraph summary
  keyInsight: string,  // key insight for this project
  relevance: string,   // how it relates to ZPO model
  doi: string,         // DOI (optional, used for "View Paper" links)
  url: string,         // Direct URL (optional, fallback for doi)
}`}
          </div>
        </div>

        <h3>Criticism Entry (criticisms.js)</h3>
        <div className="docs-fn">
          <div className="fn-desc" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap' }}>
{`{
  id: string,          // e.g. "crit-001"
  title: string,       // issue title
  severity: string,    // critical | major | moderate | minor
  category: string,    // model | convergence | proof-gap | ...
  status: string,      // open | patched | disputed
  description: string, // detailed issue description
  patch: string,       // how the issue was addressed (if patched)
}`}
          </div>
        </div>

        <h3>Insight DAG Node (insight-dag.js)</h3>
        <div className="docs-fn">
          <div className="fn-desc" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap' }}>
{`{
  id: string,          // node identifier
  label: string,       // display label
  category: string,    // foundation | model | analysis | gap | target
  route: string,       // link to app page (optional)
  tooltip: string,     // hover description
}`}
          </div>
        </div>
      </section>

      {/* 8. Algorithms */}
      <section id="algorithms" className="docs-section">
        <h2>Algorithms &amp; Numerical Methods</h2>

        <details>
          <summary>Borwein/Knopp-Hasse Acceleration</summary>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              The primary method for computing <InlineMath tex={"\\zeta(s)"} /> in the critical strip. Uses the alternating series:
            </p>
            <BlockMath tex={"\\zeta(s) = \\frac{1}{1-2^{1-s}} \\sum_{k=0}^{N-1} \\frac{(-1)^k}{(k+1)^s} \\cdot \\frac{d_k - d_N}{d_N}"} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              where <InlineMath tex="d_k" /> are binomial-weighted sums. With <InlineMath tex="N = 50" />, this gives
              approximately 15 digits of precision across the entire critical strip. Implemented
              in <code style={{ color: 'var(--accent-cyan)' }}>zetaCriticalStrip()</code>.
            </p>
          </div>
        </details>

        <details>
          <summary>Lanczos Gamma Approximation</summary>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              Used in the functional equation for <InlineMath tex={"\\Gamma(s)"} />. Uses <InlineMath tex="g = 7" /> and
              9 Lanczos coefficients with the reflection formula <InlineMath tex={"\\Gamma(s)\\Gamma(1-s) = \\pi/\\sin(\\pi s)"} /> for{' '}
              <InlineMath tex={"\\text{Re}(s) < 0.5"} />. Achieves approximately 15-digit accuracy. Implemented
              in <code style={{ color: 'var(--accent-cyan)' }}>losslessBridge()</code>.
            </p>
          </div>
        </details>

        <details>
          <summary>Riemann-Siegel Formula</summary>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              Fast evaluation on the critical line via the Z function:
            </p>
            <BlockMath tex={"Z(t) = 2 \\sum_{n=1}^{N} \\frac{\\cos(\\theta(t) - t\\log n)}{n^{1/2}} + (-1)^{N-1}\\!\\left(\\frac{t}{2\\pi}\\right)^{\\!-1/4}\\! C_0(p)"} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              where <InlineMath tex={"N = \\lfloor\\sqrt{t/(2\\pi)}\\rfloor"} />, <InlineMath tex={"p = \\sqrt{t/(2\\pi)} - N"} /> is the fractional
              part, and <InlineMath tex="C_0(p)" /> is a correction term from the asymptotic expansion. The{' '}
              <InlineMath tex={"(-1)^{N-1}(t/2\\pi)^{-1/4}"} /> prefactor provides the correct sign alternation and decay.
              Used for real-valued evaluations where sign changes indicate zeros.
            </p>
          </div>
        </details>

        <details>
          <summary>De Bruijn-Newman Heat Flow</summary>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              Evolves zeta zeros under the heat equation <InlineMath tex={"\\partial_{\\tau} H = \\partial_t^2 H"} />.
              Zero dynamics follow a repulsive ODE: each zero experiences logarithmic repulsion from its neighbors.
              The de Bruijn-Newman constant <InlineMath tex={"\\Lambda"} /> is the infimum of <InlineMath tex={"\\tau"} /> such
              that <InlineMath tex={"H_{\\tau}"} /> has only real zeros. Rodgers-Tao (2020) proved <InlineMath tex={"\\Lambda \\geq 0"} />;
              RH is equivalent to <InlineMath tex={"\\Lambda \\leq 0"} />, i.e., <InlineMath tex={"\\Lambda = 0"} />.
            </p>
          </div>
        </details>

        <details>
          <summary>Hamiltonian Gradient Descent</summary>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              The gradient <InlineMath tex={"\\partial\\mathcal{H}/\\partial\\sigma"} /> is computed via symmetric central
              difference of the full Hamiltonian (kinetic + mismatch + bridge). The update rule:
            </p>
            <BlockMath tex={"\\sigma_{n+1} = \\sigma_n - \\eta \\cdot \\frac{\\partial\\mathcal{H}}{\\partial\\sigma}"} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              converges to <InlineMath tex={"\\sigma = \\tfrac{1}{2}"} /> from any starting point, since the potential well
              is convex (the Hamiltonian has a unique global minimum on the critical line).
            </p>
          </div>
        </details>
      </section>

      {/* 9. Limitations */}
      <section id="limitations" className="docs-section">
        <h2>Limitations &amp; Disclaimers</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            {
              title: 'Not a proof of RH',
              desc: 'The ZPO model is an exploratory mathematical analogy. The observation that the Hamiltonian is minimized at σ = ½ follows from the functional equation symmetry and does not constitute a proof of the Riemann Hypothesis. All "equivalence" claims are model-internal, not mathematical theorems.',
              color: 'var(--accent-red)',
            },
            {
              title: 'Numerical precision bounds',
              desc: 'Borwein acceleration gives ~15 digits with N=50. The Riemann-Siegel Z function becomes less accurate for very large t. Euler products converge slowly for σ near 1. The 650 stored zeros have 9-digit precision.',
              color: 'var(--accent-orange)',
            },
            {
              title: 'Conditional convergence',
              desc: 'The Euler product only converges absolutely for Re(s) > 1. In the critical strip (0 < σ < 1), partial Euler products diverge — the Borwein-accelerated Dirichlet series is used instead. Visualizations of "partial products" in the strip should be interpreted as showing the initial behavior of a divergent series.',
              color: 'var(--accent-orange)',
            },
            {
              title: 'Model is exploratory',
              desc: 'Terms like "kinetic energy," "impedance mismatch," and "Q-factor" are analogies from circuit/oscillator theory applied to a mathematical structure. They provide intuition but are not claims about physical systems.',
              color: 'var(--accent-cyan)',
            },
            {
              title: 'GUE/RMT statistics',
              desc: 'The observed agreement between zero spacing statistics and GUE random matrix predictions is an empirical observation supported by extensive computation (e.g., Odlyzko), not a proven theorem. The Montgomery-Odlyzko law remains a conjecture.',
              color: 'var(--accent-cyan)',
            },
          ].map((item, i) => (
            <div key={i} className="card" style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}>
              <h3 style={{ color: item.color, fontSize: 14, marginBottom: 4 }}>{item.title}</h3>
              <p style={{ fontSize: 13 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
