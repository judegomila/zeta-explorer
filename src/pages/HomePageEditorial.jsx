import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, GradeChip, InlineMath } from '../components/editorial/PostLayout.jsx';

/* Battle-station front page — full-width cockpit, editorial (warm) theme,
   functional language, real project content. Rendered under .ed-root so the
   scoped editorial.css applies. Old dark home preserved at /classic. */

const FINDINGS = [
  { to: '/flow-blindness-no-go', grade: 'NO-GO', date: '2026-08', isNew: true,
    title: 'Flow-blindness: soft ⇏ RH', desc: 'Backward heat flow stays soft yet breaks RH; a proof needs arithmetic input.' },
  { to: '/lambda-01758354-candidate', grade: 'CANDIDATE', date: '2026-08', isNew: true,
    title: 'Λ ≤ 0.1758354', desc: 'Four gates certified in Arb, Lean-checked. Sharper than 0.1787854.' },
  { to: '/frozen-rung-pt-equivalence', grade: 'THEOREM', date: '2026-07', isNew: true,
    title: 'Freezing rungs = Platt–Trudgian', desc: 'Inertia locks the frozen-ladder route to verified height.' },
  { to: '/newman-lambda-01787854-candidate', grade: 'CANDIDATE', date: '2026',
    title: 'Λ ≤ 0.1787854', desc: 'Private-review computer-assisted candidate; 3.15M-row certificate.' },
  { to: '/lambda-bounds', grade: 'VERIFIED', date: '2026',
    title: 'RH-free F_mb enclosure', desc: 'imp-3725 — a rigorous enclosure assuming no RH.' },
  { to: '/route-map', grade: 'MAP', date: '2026',
    title: 'The wall map · 272 routes', desc: 'Every closure route and exactly where it splits.' },
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
  const [a, setA] = useState(34); // a-dial position 0..100
  const shift = (a / 100 * 0.5).toFixed(3);

  return (
    <div className="ed-root">
      <EditorialHeader ticker={<span>engine live · Λ ≤ <b>&nbsp;0.1758354</b> candidate · 5.3M rows certified</span>} />

      {/* hero */}
      <div className="ed-hero"><div className="ed-full"><div className="ed-herogrid">
        <div>
          <div className="ed-lbl">Riemann Hypothesis · de Bruijn–Newman constant Λ</div>
          <h1>An attack on the Riemann Hypothesis by bounding <em className="ed-terra">Λ</em>.</h1>
          <div className="ed-stand">RH ⇔ Λ = 0. This is a live record of the attack: the twin-ladder model,
            the interactive simulators, every barrier bound, and the theorems that show where the route ends.</div>
          <div style={{ marginTop: 22 }}>
            <div className="ed-lbl">the interval · Rodgers–Tao ≤ Λ ≤ Platt–Trudgian</div>
            <div className="ed-track">
              <div className="ed-mk" style={{ left: '0%', background: 'var(--green)' }} />
              <div className="ed-mktop" style={{ left: '3%', color: 'var(--green)' }}>0 · Λ ≥ 0 proved</div>
              <div className="ed-mkcap" style={{ left: '1%' }}>0</div>
              <div className="ed-mk" style={{ left: '88%', background: 'var(--brass-dk)' }} />
              <div className="ed-mktop" style={{ left: '86%', color: 'var(--brass)' }}>0.1758354 candidate</div>
              <div className="ed-mk" style={{ left: '100%', background: 'var(--terra)' }} />
              <div className="ed-mkcap" style={{ left: '92%', color: 'var(--terra-dk)' }}>0.20 · Platt–Trudgian (SOTA)</div>
            </div>
          </div>
        </div>
        <div className="ed-viz">
          <div className="ed-vizhead"><span className="ed-lbl">twin-ladder shear · a-dial</span><span className="ed-badge">interactive</span></div>
          <svg width="100%" height="200" viewBox="0 0 320 200" fill="none" stroke="#8c6a1d" strokeWidth="1.2">
            <rect width="320" height="200" fill="#fdfaf3" />
            <path d="M50 16 V184 M92 16 V184 M228 16 V184 M270 16 V184" opacity=".6" />
            <g opacity=".42"><path d="M50 38 H92 M50 62 H92 M50 86 H92 M50 110 H92 M50 134 H92 M50 158 H92 M228 38 H270 M228 62 H270 M228 86 H270 M228 110 H270 M228 134 H270 M228 158 H270" /></g>
            <path d="M92 38 C160 38 160 158 228 158 M92 158 C160 158 160 38 228 38" stroke="#d9502e" strokeWidth="1.5" opacity=".85" />
            <circle cx="160" cy="98" r="3.5" fill="#d9502e" stroke="none" />
          </svg>
          <div className="ed-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 4 }}>shear vs positive core · drag a → strip closes to the line</div>
        </div>
      </div></div></div>

      {/* KPIs */}
      <div className="ed-full"><div className="ed-kpis">
        <div className="ed-kpi"><b style={{ color: 'var(--brass-dk)' }}>0.1758354</b><span>Λ candidate</span></div>
        <div className="ed-kpi"><b>3.0×10¹²</b><span>verified height</span></div>
        <div className="ed-kpi"><b>272</b><span>routes mapped</span></div>
        <div className="ed-kpi"><b style={{ color: 'var(--terra-dk)' }}>2</b><span>no-go theorems</span></div>
        <div className="ed-kpi"><b style={{ color: 'var(--green)' }}>12</b><span>interactive simulators</span></div>
      </div></div>

      {/* model */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">the model</div><h2>The twin ladder</h2></div>
          <p>Euler product → prime oscillators → the shear kernel. Three steps.</p></div>
        <div className="ed-steps">
          <div className="ed-step"><span className="num">STEP 1</span><h3>Prime oscillator</h3>
            <div className="eq"><InlineMath tex="H_p(s) = 1/(1 - p^{-s})" /></div>
            <p>Each prime is an LC resonator with impedance log p; the Euler product is a ladder network.</p>
            <Link to="/oscillators">/oscillators →</Link></div>
          <div className="ed-step"><span className="num">STEP 2</span><h3>Twin-ladder shear</h3>
            <div className="eq"><InlineMath tex="K_a = K_0 + D_{a,R} + K^{S}" /></div>
            <p>Couple two rung-stacks; the antisymmetric shear is the de Branges Wronskian of ξ. Positivity ⇔ a zero-free strip.</p>
            <Link to="/twin-ladder">/twin-ladder →</Link></div>
          <div className="ed-step"><span className="num">STEP 3</span><h3>The a-dial</h3>
            <div className="eq"><InlineMath tex="T3(a)\ \forall a>0 \iff \mathrm{RH}" /></div>
            <p>Shrink the shift a→0 and the strip closes to the line. E_a = A_a − iB_a = Ξ(z+ia), verified.</p>
            <Link to="/shift-bridge-positivity">/shift-bridge-positivity →</Link></div>
        </div>
      </section></div>

      {/* a-dial control */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">control</div><h2>The a-dial geometry</h2></div>
          <p>The frontier as a live inequality.</p></div>
        <div className="ed-ctl">
          <div><div className="ed-lbl">shift a · strip half-width Re s &gt; ½ + a</div>
            <input className="ed-slider" type="range" min="0" max="100" value={a} onChange={(e) => setA(Number(e.target.value))} />
            <div className="ed-mono" style={{ fontSize: 12, color: 'var(--faint)' }}>a = {shift}</div></div>
          <div className="ed-readout">
            <span>normalized residual ‖R‖ (well-posed)</span><b>1.33</b>
            <span>σ(a) = sup|Ξ(z−ia)/Ξ(z+ia)|</span><b style={{ color: 'var(--terra-dk)' }}>{'{1, ∞} quantized'}</b>
            <span>result</span><b>no sub-1 margin exists (flow-blindness)</b>
          </div>
        </div>
      </section></div>

      {/* findings atlas */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">the atlas · • = new</div><h2>Findings</h2></div>
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
        <div className="ed-verdict">Λ ≤ 0.2 (Platt–Trudgian) is the rigorous state of the art. The 0.1758354 and
          0.1787854 candidates are computer-assisted and unrefereed. RH remains open: it requires Λ ≤ 0. The only
          lever that moves the floor is verified zero height — derived twice, from Sylvester inertia and de
          Bruijn–Newman flow rigidity.</div>
      </section></div>

      {/* cta */}
      <div className="ed-full"><section className="ed-sec" style={{ borderBottom: 'none' }}>
        <div className="ed-cta">
          <div><div className="ed-lbl">go deeper</div>
            <div style={{ fontFamily: 'var(--ed-display)', fontWeight: 500, fontSize: 20, marginTop: 2 }}>The full research console</div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Rigor dashboard · engine room · route map · the 272-route ledger.</div></div>
          <Link className="ed-btn" to="/classic">Enter console →</Link>
        </div>
      </section></div>

      <div className="ed-foot">mathexplorer · a live record of one attack on the Riemann Hypothesis · Jude Gomila · <Link to="/classic">classic view</Link></div>
    </div>
  );
}
