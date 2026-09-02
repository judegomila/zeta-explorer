import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, GradeChip, InlineMath } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { ZETAEXPLORER_NO_GOS } from '../data/rh-no-go-theorems.js';

// The real interactive explorers, lazy-loaded so the landing stays light.
const TwinLadderViz = lazy(() => import('../components/TwinLadderViz.jsx'));
const WaveSimViz = lazy(() => import('../components/WaveSimViz.jsx'));

/* Battle-station front page — full-width cockpit, editorial (warm) theme,
   functional language, real project content. Rendered under .ed-root so the
   scoped editorial.css applies. Old dark home preserved at /classic. */

const FINDINGS = [
  { to: '/flow-blindness-no-go', grade: 'NO-GO', date: '2026-08', isNew: true,
    title: 'Flow-blindness: soft ⇏ RH', desc: 'Backward heat flow stays soft yet breaks RH; a proof needs arithmetic input.' },
  { to: '/lambda-01758354-candidate', grade: 'CANDIDATE', date: '2026-08', isNew: true,
    title: 'Λ ≤ 0.1758354', desc: 'Four gates certified in Arb, Lean-checked. Below the 0.1787854 candidate.' },
  { to: '/permutation-architecture', grade: 'CONTRACT', date: '2026-08', isNew: true,
    title: 'Λ ≤ 0.14 completion contract', desc: 'Fail-closed contract reduced to one open family — the freeze calculus route. A contract, not a bound.' },
  { to: '/frozen-rung-pt-equivalence', grade: 'THEOREM', date: '2026-07', isNew: true,
    title: 'Freezing rungs = Platt–Trudgian', desc: 'Inertia locks the frozen-ladder route to verified height.' },
  { to: '/newman-lambda-01787854-candidate', grade: 'CANDIDATE', date: '2026',
    title: 'Λ ≤ 0.1787854', desc: 'Private-review computer-assisted candidate; 3.15M-row certificate.' },
  { to: '/lambda-bounds', grade: 'VERIFIED', date: '2026',
    title: 'RH-free F_mb enclosure', desc: 'imp-3725 — a rigorous enclosure assuming no RH.' },
  { to: '/route-map', grade: 'MAP', date: '2026',
    title: 'The wall map · 38 routes', desc: 'Every closure route across 5 clusters, and exactly where it splits.' },
  { to: '/critical-line-proportion', grade: 'MAP', date: '2026-08', isNew: true,
    title: 'Zeros on the line · ≥ 2/3', desc: 'The other axis: peer-reviewed record 5/12 (PRZZ 2020); external ≥ 2/3 result (Claude/Anthropic 2026, Lean-checked, reviewed by Conrey and Goldston, not peer-reviewed, not this project’s).' },
  { to: '/what-we-know', grade: 'NO-GO', date: '2026',
    title: 'Negative results', desc: 'Theorems ruling out route families — the breach point, located.' },
  { to: '/pt-floor-audit', grade: 'AUDIT', date: '2026',
    title: 'Verified height binds the floor', desc: 'The Λ ≤ 0.2 floor is set by verified zero height, not slack.' },
  { to: '/theorem-b-threshold', grade: 'RESULT', date: '2026',
    title: 'Closed-form constants', desc: 'Exact values for the Theorem-B threshold and boundary constants.' },
  { to: '/shift-bridge-positivity', grade: 'MAP', date: '2026',
    title: 'The a-dial geometry', desc: 'Shift-bridge positivity; T3 as the sole global RH frontier.' },
  { to: '/collapse-chain', grade: 'COLLAPSE', date: '2026',
    title: '‖V‖ ≤ 1 collapse chain', desc: 'Seven §15–27 conjectures restate as one Volterra-norm bound — RH-equivalent, not a shortcut.' },
  { to: '/autonomous-fleet', grade: 'ENGINE', date: 'live',
    title: 'The autonomous fleet', desc: 'Multi-engine + Fable-5 grinding the frontier, live.' },
];

const SIMS = [
  ['/oscillators', 'Prime oscillators'], ['/hamiltonian', 'Hamiltonian'], ['/zeta', 'Zeta landscape'],
  ['/waves', 'Wave simulator'], ['/fourier', 'Fourier'], ['/control', 'Control theory'],
  ['/statistics', 'Zero statistics'], ['/simulator', 'Simulator'], ['/supercritical', 'Supercritical'],
  ['/spectral-attack', 'Spectral attack'], ['/gap-closing', 'Gap closing'], ['/formal-proof', 'Formal proof'],
];

export default function HomePageEditorial() {
  return (
    <div className="ed-root">
      <EditorialHeader ticker={<Link to="/engine-room" style={{ color: 'inherit' }}><b>engine live</b> ↗</Link>} />

      {/* hero */}
      <div className="ed-hero"><div className="ed-full"><div className="ed-herogrid">
        <div>
          <h1>Let's solve the <em className="ed-terra">Riemann Hypothesis</em></h1>
          <div className="ed-stand">An open engine room for the Riemann Hypothesis (RH ⇔ Λ = 0). It runs the twin-ladder
            model, interactive simulators, and an autonomous fleet of AI engines pushing barrier bounds on Λ —
            with a live ledger of results, no-go theorems, and open problems. Contributions are welcome.</div>
          <div style={{ marginTop: 22 }}>
            <div className="ed-lbl">the interval · Rodgers–Tao ≤ Λ ≤ Platt–Trudgian</div>
            <div className="ed-track">
              <div className="ed-mk" style={{ left: '0%', background: 'var(--green)' }} />
              <div className="ed-mktop" style={{ left: '3%', color: 'var(--green)' }}>0 · Λ ≥ 0 proved</div>
              <div className="ed-mkcap" style={{ left: '1%' }}>0</div>
              <div className="ed-mk" style={{ left: '88%', background: 'var(--brass-dk)' }} />
              <div className="ed-mktop" style={{ left: '86%', color: 'var(--brass)' }}>0.1758354 candidate</div>
              <div className="ed-mk" style={{ left: '100%', background: 'var(--terra)' }} />
              <div className="ed-mkcap" style={{ left: '92%', color: 'var(--terra-dk)' }}>0.20 · Platt–Trudgian</div>
            </div>
          </div>
        </div>
        <div className="ed-viz">
          <div className="ed-vizhead"><span className="ed-lbl">the twin ladder</span><span className="ed-badge">animation</span></div>
          <WireframeAnim kind="twinladder" />
          <div className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 4 }}>two coupled rung-stacks — one ladder per prime scale — and the shear between them</div>
        </div>
      </div></div></div>

      {/* KPIs */}
      <div className="ed-full"><div className="ed-kpis">
        <div className="ed-kpi"><b style={{ color: 'var(--brass-dk)' }}>0.1758354</b><span>Λ candidate</span></div>
        <Link className="ed-kpi ed-kpi-link" to="/route-map"><b>38</b><span>routes mapped</span></Link>
        <Link className="ed-kpi ed-kpi-link" to="/no-gos"><b style={{ color: 'var(--terra-dk)' }}>{ZETAEXPLORER_NO_GOS.length}</b><span>no-go theorems</span></Link>
        <Link className="ed-kpi ed-kpi-link" to="/simulators"><b style={{ color: 'var(--green)' }}>12</b><span>interactive simulators</span></Link>
      </div></div>

      {/* model */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">the model</div><h2>The twin ladder</h2></div>
          <p>Euler product → prime oscillators → the shear kernel. Three steps.</p></div>
        <div className="ed-steps">
          <div className="ed-step"><span className="num">STEP 1</span>
            <div className="ed-stepfig"><WireframeAnim kind="oscillator" /></div>
            <h3>Prime oscillator</h3>
            <div className="eq"><InlineMath tex="H_p(s) = 1/(1 - p^{-s})" /></div>
            <p>Each prime is an LC resonator with impedance log p; the Euler product is a ladder network.</p>
            <Link to="/oscillators">/oscillators →</Link></div>
          <div className="ed-step"><span className="num">STEP 2</span>
            <div className="ed-stepfig"><WireframeAnim kind="twinladder" /></div>
            <h3>Twin-ladder shear</h3>
            <div className="eq"><InlineMath tex="K_a = K_0 + D_{a,R} + K^{S}" /></div>
            <p>Couple two rung-stacks; the antisymmetric shear is the de Branges Wronskian of ξ. Positivity ⇔ a zero-free strip.</p>
            <Link to="/twin-ladder">/twin-ladder →</Link></div>
          <div className="ed-step"><span className="num">STEP 3</span>
            <div className="ed-stepfig"><WireframeAnim kind="wave" /></div>
            <h3>The a-dial</h3>
            <div className="eq"><InlineMath tex="T3(a)\ \forall a>0 \iff \mathrm{RH}" /></div>
            <p>Shrink the shift a→0 and the strip closes to the line. E_a = A_a − iB_a = Ξ(z+ia), verified.</p>
            <Link to="/shift-bridge-positivity">/shift-bridge-positivity →</Link></div>
        </div>
      </section></div>

      {/* interactive twin-ladder explorer */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">interactive</div><h2>The twin ladder, live</h2></div>
          <p>Drag the shift a and watch the shear against the positive core.</p></div>
        <Suspense fallback={<div className="ed-mono" style={{ color: 'var(--faint)', padding: '40px 0' }}>Loading the explorer…</div>}>
          <TwinLadderViz />
        </Suspense>
      </section></div>

      {/* interactive wave simulator */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">interactive</div><h2>The wave model, live</h2></div>
          <p>The finite ζ-model as a standing wave — a model diagnostic, not a realization of the continued zeta.</p></div>
        <Suspense fallback={<div className="ed-mono" style={{ color: 'var(--faint)', padding: '40px 0' }}>Loading the simulator…</div>}>
          <WaveSimViz />
        </Suspense>
      </section></div>

      {/* findings atlas */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">the ledger · • = new</div><h2>Findings</h2></div>
          <p>Bounds, models, walls, and no-gos. Each opens its own page.</p></div>
        <div className="ed-map">
          {FINDINGS.map((f) => (
            <Link key={f.to} className="ed-tile" to={f.to}>
              <div className="ed-tmeta">
                {f.isNew && <span className="ed-new" />}
                <GradeChip grade={f.grade} />
                <span>{f.date}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </Link>
          ))}
        </div>
      </section></div>

      {/* simulators */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">work the problem</div><h2>Simulators</h2></div>
          <p>12 interactive explorers.</p></div>
        <div className="ed-sims">
          {SIMS.map(([to, name], i) => (
            <Link key={to} className="ed-sim" to={to}><span className="n">{String(i + 1).padStart(2, '0')}</span><b>{name}</b></Link>
          ))}
        </div>
      </section></div>

      {/* verdict */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-lbl" style={{ marginBottom: 12 }}>status</div>
        <div className="ed-verdict">Λ ≤ 0.2 (Platt–Trudgian) is the peer-reviewed benchmark. The 0.1758354 and
          0.1787854 candidates are computer-assisted and unrefereed; the 0.14 value is a fail-closed completion
          contract, not a bound. RH remains open: it requires Λ ≤ 0. The only
          lever that moves the floor is verified zero height — derived twice, from Sylvester inertia and de
          Bruijn–Newman flow rigidity.</div>
      </section></div>

      {/* cta */}
      <div className="ed-full"><section className="ed-sec" style={{ borderBottom: 'none' }}>
        <div className="ed-cta">
          <div><div className="ed-lbl">directory</div>
            <div style={{ fontFamily: 'var(--ed-display)', fontWeight: 500, fontSize: 20, marginTop: 2 }}>Everything else</div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Simulators, analyses, the Gomila twin-ladder program, proof tools, and references.</div></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link className="ed-btn" to="/directory">Browse the directory →</Link>
          </div>
        </div>
      </section></div>

      <div className="ed-foot">zetaexplorer · Riemann Hypothesis via the de Bruijn–Newman constant Λ · Jude Gomila · <a href="https://github.com/judegomila/mathexplorer" target="_blank" rel="noreferrer">GitHub repo ↗</a></div>
    </div>
  );
}
