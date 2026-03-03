import React from 'react';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';

const TOC = [
  { id: 'overview', label: 'Overview' },
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
  return (
    <div className="page">
      <div className="page-header">
        <h1>Documentation</h1>
        <p>
          Complete technical reference for the ZPO Explorer app: mathematical model,
          architecture, algorithms, and every module and component documented.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="docs-toc">
        <h3>Contents</h3>
        <div className="docs-toc-links">
          {TOC.map(t => (
            <a key={t.id} href={`#${t.id}`}>{t.label}</a>
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
        <BlockMath tex="\zeta(s) = \prod_{p\;\text{prime}} \frac{1}{1 - p^{-s}}" />
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          is interpreted as the transfer function of a cascade of LC oscillator stages, one per prime.
          Each stage has resonant frequency <InlineMath tex="\omega_p = \log p" />, and the entire product forms
          a <strong>ladder network</strong>. The functional equation <InlineMath tex="\zeta(s) = \chi(s)\zeta(1-s)" /> is
          realized as a lossless bridge connecting direct and dual ladder networks. The Riemann Hypothesis (that
          all nontrivial zeros have <InlineMath tex="\text{Re}(s) = \tfrac{1}{2}" />) corresponds to the system being at
          its minimum energy, maximum symmetry, critically coupled configuration.
        </p>
        <div className="card" style={{ marginTop: 16, borderColor: 'var(--accent-orange)' }}>
          <p style={{ color: 'var(--accent-orange)', fontSize: 13, fontWeight: 600 }}>
            This is an exploratory/pedagogical model, not a proof of RH. The oscillator analogy is a mathematical
            metaphor that provides intuition for the zeta function's structure.
          </p>
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
          <li>Resonant frequency: <InlineMath tex="\omega_p = \log p" /></li>
          <li>Inductance: <InlineMath tex="L_p = \log p" />, Capacitance: <InlineMath tex="C_p = 1/\log p" /></li>
          <li>Transfer function: <InlineMath tex="H_p(s) = (1 - p^{-s})^{-1}" /></li>
          <li>Quality factor: <InlineMath tex="Q_p = 1/(2\sigma)" /> where <InlineMath tex="\sigma = \text{Re}(s)" /></li>
        </ul>

        <h3>Direct and Dual Ladders</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          The <strong>direct ladder</strong> cascades oscillator stages to compute <InlineMath tex="\zeta(s)" />.
          The <strong>dual ladder</strong> applies the transformation <InlineMath tex="s \to 1-s" /> to compute <InlineMath tex="\zeta(1-s)" />.
          At <InlineMath tex="\sigma = \tfrac{1}{2}" />, both ladders are impedance-matched.
        </p>

        <h3>Lossless Bridge</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          The bridge factor <InlineMath tex="\chi(s)" /> from the functional equation connects the ladders:
        </p>
        <BlockMath tex="\chi(s) = 2^s \pi^{s-1} \sin\!\left(\frac{\pi s}{2}\right) \Gamma(1-s)" />
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          At <InlineMath tex="\sigma = \tfrac{1}{2}" />, <InlineMath tex="|\chi(s)| = 1" /> (lossless/unitary).
          Off the critical line, <InlineMath tex="|\chi| \neq 1" /> and the bridge becomes lossy.
        </p>

        <h3>System Hamiltonian</h3>
        <BlockMath tex="\mathcal{H} = \underbrace{T_{\text{kinetic}}}_{= \sum_p \frac{1}{2}\log p\,(|H_p(s)|^2 + |H_p(1{-}s)|^2)} + \underbrace{V_{\text{mismatch}}}_{= \frac{1}{2}|Z_{\text{dir}} - Z_{\text{dual}}|^2} + \underbrace{V_{\text{bridge}}}_{= 100(1-|\chi|)^2}" />
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 14 }}>
          The Hamiltonian is minimized at <InlineMath tex="\sigma = \tfrac{1}{2}" /> for all <InlineMath tex="t" />,
          where mismatch vanishes and the bridge is lossless. Gradient descent on <InlineMath tex="\mathcal{H}" /> always
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
              <div style={{ color: 'var(--accent-blue)', fontWeight: 700, fontSize: 14 }}>{t.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{t.desc}</div>
            </div>
          ))}
        </div>

        <h3>File Structure</h3>
        <div className="docs-file-tree">
          <div><span className="dir">src/</span></div>
          <div>&nbsp;&nbsp;<span className="dir">math/</span> <span className="comment">— Pure math functions</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">zeta.js</span> <span className="comment">— Complex arithmetic, zeta computation, 650 zeros</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">oscillators.js</span> <span className="comment">— Prime oscillator chain, Hamiltonian, energy landscape</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">primes.js</span> <span className="comment">— Sieve, frequencies, von Mangoldt, explicit formula</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">supercritical.js</span> <span className="comment">— Extended zeta, thermodynamics, heat flow, spectral</span></div>
          <div>&nbsp;&nbsp;<span className="dir">components/</span> <span className="comment">— 18 visualization components + KaTeX wrapper</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">KaTeXMath.jsx</span> <span className="comment">— InlineMath, BlockMath, MathText, MathModal</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">*Viz.jsx</span> <span className="comment">— Interactive D3/Canvas visualizations</span></div>
          <div>&nbsp;&nbsp;<span className="dir">pages/</span> <span className="comment">— 16 route pages</span></div>
          <div>&nbsp;&nbsp;<span className="dir">data/</span> <span className="comment">— Explorations journal, literature references, criticisms, improvement log</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">explorations.js</span> <span className="comment">— AI exploration entries with LaTeX, insights, refs</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">literature.js</span> <span className="comment">— Academic reference database</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">criticisms.js</span> <span className="comment">— RH rigor check: mathematical criticisms of the ZPO model</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">improvements.js</span> <span className="comment">— Auto-improvement log entries with categories and details</span></div>
          <div>&nbsp;&nbsp;<span className="dir">styles/</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="file">app.css</span> <span className="comment">— All styles (dark theme, responsive)</span></div>
        </div>
      </section>

      {/* 4. Pages */}
      <section id="pages" className="docs-section">
        <h2>Pages</h2>
        <div className="card-grid">
          {[
            { route: '/', name: 'Home', desc: 'Overview, model summary, key equations, stat boxes, architecture diagram' },
            { route: '/oscillators', name: 'Oscillators', desc: 'OscillatorChainViz — dual ladder network with per-prime detail panels' },
            { route: '/hamiltonian', name: 'Hamiltonian', desc: 'HamiltonianViz — energy landscape σ-scan, EnergyLandscapeViz — 2D heatmap' },
            { route: '/zeta', name: 'Zeta', desc: 'ZetaLandscapeViz, EulerProductViz, ExplicitFormulaViz — core zeta visualizations' },
            { route: '/control', name: 'Control Theory', desc: 'NyquistBodeViz — Nyquist/Bode plots of loop transfer function L(s)' },
            { route: '/statistics', name: 'Statistics', desc: 'GUEStatisticsViz, LiCriterionViz — random matrix theory and Li criterion' },
            { route: '/modes', name: 'Modes', desc: 'AnimatedModesViz — time evolution of oscillator modes at zeta zero frequencies' },
            { route: '/explorations', name: 'Explorations', desc: 'AI exploration journal with LaTeX math, insights, reference links' },
            { route: '/literature', name: 'Literature', desc: 'Academic reference database with summaries and key insights' },
            { route: '/simulator', name: 'Simulator', desc: 'TwinOscillatorSimViz — 5-tab simulator (per-prime, gradient, convergence, bridge, multi-zero)' },
            { route: '/fourier', name: 'Fourier', desc: 'FourierDomainViz — 4 tabs (von Mangoldt spectrum, frequency response, spectral energy, harmonics)' },
            { route: '/supercritical', name: 'Supercritical', desc: 'SupercriticalViz — 4 tabs (landscape, thermodynamics, heat flow, Euler phase)' },
            { route: '/docs', name: 'Docs', desc: 'This page — complete technical documentation of the application' },
            { route: '/waves', name: 'Waves', desc: 'WaveSimViz — 5-tab wave simulator (signal flow, per-prime waves, interference, phase & delay, circuit diagram)' },
            { route: '/rigor', name: 'Rigor', desc: 'RHRigorViz — self-criticism of ZPO model claims with severity-rated issues and numerical stress tests' },
            { route: '/improvements', name: 'Improvements', desc: 'Auto-improvement log with filterable history of all changes made to the app' },
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
          40 exported functions + 1 constant across 4 pure-math modules. All complex numbers are <code style={{ color: 'var(--accent-cyan)' }}>[re, im]</code> tuples.
        </p>

        <details>
          <summary>
            <span style={{ color: 'var(--accent-blue)' }}>zeta.js</span> — Complex arithmetic &amp; zeta computation (16 functions + 1 constant)
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
            <Fn name="primeFrequency" params="p" desc="Oscillator frequency ω = log(p)" />
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
      </section>

      {/* 6. Visualization Components */}
      <section id="viz-components" className="docs-section">
        <h2>Visualization Components</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
          18 interactive visualization components using D3.js (SVG) and Canvas API.
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
              ['ZetaLandscapeViz', 'Zeta', 'Canvas', '2D heatmap of |ζ(s)| with domain coloring'],
              ['EulerProductViz', 'Zeta', 'SVG', 'Partial Euler product convergence prime-by-prime'],
              ['ExplicitFormulaViz', 'Zeta', 'SVG', 'Explicit formula ψ(x) with zero-sum correction'],
              ['NyquistBodeViz', 'Control', 'SVG', 'Nyquist plot + Bode diagram of L(s) = χ·ζ(1-s)/ζ(s)'],
              ['GUEStatisticsViz', 'Statistics', 'SVG', 'Zero spacing distribution vs GUE prediction'],
              ['LiCriterionViz', 'Statistics', 'SVG', 'Li coefficients λ_n with asymptotic reference'],
              ['AnimatedModesViz', 'Modes', 'Canvas', 'Animated time evolution of oscillator modes at zeros'],
              ['ScatteringMatrixViz', 'Modes', 'SVG', 'Scattering matrix S(s) analysis'],
              ['PrimeGapCouplingViz', 'Modes', 'SVG', 'Prime gap statistics and coupling visualization'],
              ['ExplorationGraphViz', 'Modes', 'SVG', 'Graph of exploration connections'],
              ['TwinOscillatorSimViz', 'Simulator', 'Canvas+SVG', '5-tab simulator: per-prime, gradient, convergence, bridge, multi-zero'],
              ['SupercriticalViz', 'Supercritical', 'Canvas+SVG', '4-tab: landscape, thermodynamics, heat flow, Euler phase'],
              ['FourierDomainViz', 'Fourier', 'SVG', '4-tab: von Mangoldt spectrum, frequency response, spectral energy, harmonics'],
              ['WaveSimViz', 'Waves', 'Canvas+SVG', '5-tab: signal flow, per-prime waves, interference, phase & delay, circuit diagram'],
              ['RHRigorViz', 'Rigor', 'Canvas', 'Numerical stress tests: Hamiltonian minimization, bridge unitarity, mismatch vs zeros'],
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
              The primary method for computing <InlineMath tex="\zeta(s)" /> in the critical strip. Uses the alternating series:
            </p>
            <BlockMath tex="\zeta(s) = \frac{1}{1-2^{1-s}} \sum_{k=0}^{N-1} \frac{(-1)^k}{(k+1)^s} \cdot \frac{d_k - d_N}{d_N}" />
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
              Used in the functional equation for <InlineMath tex="\Gamma(s)" />. Uses <InlineMath tex="g = 7" /> and
              9 Lanczos coefficients with the reflection formula <InlineMath tex="\Gamma(s)\Gamma(1-s) = \pi/\sin(\pi s)" /> for{' '}
              <InlineMath tex="\text{Re}(s) < 0.5" />. Achieves approximately 15-digit accuracy. Implemented
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
            <BlockMath tex="Z(t) = 2 \sum_{n=1}^{N} \frac{\cos(\theta(t) - t\log n)}{n^{1/2}} + C_0(p)" />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              where <InlineMath tex="N = \lfloor\sqrt{t/(2\pi)}\rfloor" />, <InlineMath tex="p" /> is the fractional
              part, and <InlineMath tex="C_0" /> is a correction term from the asymptotic expansion.
              Used for real-valued evaluations where sign changes indicate zeros.
            </p>
          </div>
        </details>

        <details>
          <summary>De Bruijn-Newman Heat Flow</summary>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              Evolves zeta zeros under the heat equation <InlineMath tex="\partial_\tau H = \partial_t^2 H" />.
              Zero dynamics follow a repulsive ODE: each zero experiences logarithmic repulsion from its neighbors.
              The de Bruijn-Newman constant <InlineMath tex="\Lambda" /> is the infimum of <InlineMath tex="\tau" /> such
              that <InlineMath tex="H_\tau" /> has only real zeros. Rodgers-Tao (2020) proved <InlineMath tex="\Lambda \geq 0" />;
              RH is equivalent to <InlineMath tex="\Lambda \leq 0" />, i.e., <InlineMath tex="\Lambda = 0" />.
            </p>
          </div>
        </details>

        <details>
          <summary>Hamiltonian Gradient Descent</summary>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              The gradient <InlineMath tex="\partial\mathcal{H}/\partial\sigma" /> is computed via symmetric central
              difference of the full Hamiltonian (kinetic + mismatch + bridge). The update rule:
            </p>
            <BlockMath tex="\sigma_{n+1} = \sigma_n - \eta \cdot \frac{\partial\mathcal{H}}{\partial\sigma}" />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
              converges to <InlineMath tex="\sigma = \tfrac{1}{2}" /> from any starting point, since the potential well
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
