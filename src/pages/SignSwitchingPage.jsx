import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, InlineMath, BlockMath } from '../components/editorial/PostLayout.jsx';
import { collisionState, firstModal, modelEnergies, omega, normalizedSignedMargin } from '../math/sign-switching.js';
import XI_DATA from '../data/sign-switching-xi.json';
import '../styles/sign-switching.css';

const COLORS = { even: '#247368', odd: '#b16a24', negative: '#b63d51', ink: '#263c57', nodal: '#315b93', axis: '#795396' };
const fmt = (x, digits = 6) => Number.isFinite(x) ? Number(x).toPrecision(digits) : 'unavailable';
const small = (x) => x === 0 ? '0' : Number(x).toExponential(2);

function Status({ children, kind = 'exact' }) {
  return <span className={`ss-status ss-status-${kind}`}>{children}</span>;
}

function CollisionGeometry({ epsilon, probeH, probeY }) {
  const state = collisionState(epsilon);
  const px = (x) => 181 + x * 124;
  const py = (y) => 190 - y * 124;
  const lx = (v) => 504 + v * 19;
  const ys = Array.from({ length: 181 }, (_, i) => -1.2 + i * 2.4 / 180);
  const curve = ys.map((y, i) => `${i ? 'L' : 'M'}${lx(firstModal(epsilon, y))},${py(y)}`).join(' ');
  const nodal = [];
  for (const sign of [-1, 1]) {
    let current = [];
    for (let i = 0; i <= 240; i += 1) {
      const x = -1.2 + i * .01;
      const square = x * x + 2 * epsilon;
      if (square >= 0 && square <= 1.44) current.push([px(x), py(sign * Math.sqrt(square))]);
      else if (current.length) { nodal.push(current); current = []; }
    }
    if (current.length) nodal.push(current);
  }
  const radius = state.radius || 0;
  return <svg className="ss-geometry" viewBox="0 0 730 385" role="img" aria-labelledby="ss-geometry-title ss-geometry-desc">
    <title id="ss-geometry-title">Linked negative shear half-disk and first-modal interval</title>
    <desc id="ss-geometry-desc">Exact quadratic collision model. {state.negativeInterval ? `The negative interval runs from ${-radius} to ${radius}, exactly the diameter of the red right half-disk.` : 'There is no negative half-disk or negative modal interval.'} The dotted horizontal line follows the selected height.</desc>
    <defs><clipPath id="ss-right-plane"><rect x={px(0)} y={py(1.2)} width={149} height={298} /></clipPath></defs>
    <text x="33" y="22" className="ss-svg-heading">SHEAR GEOMETRY</text>
    <text x="439" y="22" className="ss-svg-heading">FIRST MODE · SAME HEIGHT y</text>
    <rect x="32" y="41" width="298" height="298" rx="8" fill="#f1efe9" />
    <rect x="439" y="41" width="250" height="298" rx="8" fill="#f1efe9" />
    <rect x="439" y="41" width={lx(0) - 439} height="298" fill="#f6e7e7" />
    {[-1, -.5, 0, .5, 1].map(y => <g key={y} className="ss-grid"><line x1="32" x2="330" y1={py(y)} y2={py(y)} /><line x1="439" x2="689" y1={py(y)} y2={py(y)} /><text x="22" y={py(y) + 4} textAnchor="end">{y}</text></g>)}
    {radius > 0 && <>
      <circle cx={px(0)} cy={py(0)} r={radius * 124} fill="#e7acb5" fillOpacity=".62" clipPath="url(#ss-right-plane)" />
      <path d={`M${px(0)},${py(radius)} A${radius * 124},${radius * 124} 0 0 1 ${px(0)},${py(-radius)}`} fill="none" stroke={COLORS.negative} strokeWidth="2.5" />
      <line x1={px(0)} x2={px(0)} y1={py(radius)} y2={py(-radius)} stroke={COLORS.negative} strokeWidth="7" />
      <line x1={lx(0)} x2={lx(0)} y1={py(radius)} y2={py(-radius)} stroke={COLORS.negative} strokeWidth="7" />
      {[radius, -radius].map(y => <line key={y} x1="331" x2="438" y1={py(y)} y2={py(y)} stroke={COLORS.negative} strokeDasharray="4 4" opacity=".65" />)}
      {[radius, -radius].map(y => <g key={`endpoint-${y}`}><circle cx={px(0)} cy={py(y)} r="3.5" fill="#fffdf7" stroke={COLORS.negative} strokeWidth="1.5" /><circle cx={lx(0)} cy={py(y)} r="3.5" fill="#fffdf7" stroke={COLORS.negative} strokeWidth="1.5" /></g>)}
    </>}
    <line x1={px(0)} x2={px(0)} y1="41" y2="339" stroke={COLORS.axis} strokeWidth="1.3" strokeDasharray="4 4" />
    <line x1="32" x2="330" y1={py(0)} y2={py(0)} stroke={COLORS.odd} strokeWidth="1.1" strokeDasharray="4 4" />
    {nodal.map((path, i) => <polyline key={i} points={path.map(p => p.join(',')).join(' ')} fill="none" stroke={COLORS.nodal} strokeWidth="1.5" />)}
    <line x1={lx(0)} x2={lx(0)} y1="41" y2="339" stroke={COLORS.axis} strokeWidth="1" />
    <path d={curve} stroke={COLORS.ink} strokeWidth="2.6" fill="none" />
    <line x1="32" x2="689" y1={py(probeY)} y2={py(probeY)} stroke={COLORS.ink} strokeDasharray="3 5" opacity=".65" />
    {state.roots.map((root, i) => <g key={i}><circle cx={px(root.x)} cy={py(root.y)} r={root.multiplicity === 2 ? 6 : 4.5} fill={COLORS.ink} stroke="white" strokeWidth="1.5" />{root.multiplicity === 2 && <text x={px(root.x)+11} y={py(root.y)-8} className="ss-svg-label">double zero</text>}</g>)}
    <circle cx={px(probeH)} cy={py(probeY)} r="5" fill="white" stroke={COLORS.negative} strokeWidth="2" />
    <circle cx={lx(firstModal(epsilon, probeY))} cy={py(probeY)} r="4.5" fill={firstModal(epsilon, probeY) < 0 ? COLORS.negative : COLORS.even} stroke="white" strokeWidth="1.3" />
    {[-1, 0, 1].map(x => <text key={x} x={px(x)} y="357" textAnchor="middle" className="ss-svg-label">{x}</text>)}
    {[-2, 0, 4, 8].map(v => <text key={v} x={lx(v)} y="357" textAnchor="middle" className="ss-svg-label">{v}</text>)}
    <text x="181" y="378" textAnchor="middle" className="ss-svg-label">x · local transverse coordinate</text>
    <text x="560" y="378" textAnchor="middle" className="ss-svg-label">L₁(y) = 4y² + 8ε</text>
    <text x="181" y="35" textAnchor="middle" className="ss-svg-label">critical line x = 0</text>
    <text x="469" y="35" textAnchor="middle" fill={COLORS.negative} className="ss-svg-label">negative</text>
  </svg>;
}

function EnergyBars({ even, odd, difference, caption }) {
  const max = Math.max(even, odd, Math.abs(difference), 1e-15);
  const margin = even + odd > 0 ? normalizedSignedMargin(even, odd) : null;
  return <div className="ss-energy" data-testid="energy-bars">
    {[['Even energy', even, COLORS.even], ['Odd energy', odd, COLORS.odd]].map(([label, value, color]) => <div className="ss-energy-row" key={label}>
      <div><span>{label}</span><strong>{fmt(value)}</strong></div>
      <div className="ss-bar-track"><span style={{ width: `${100 * value / max}%`, background: color }} /></div>
    </div>)}
    <div className={`ss-difference ${difference < 0 ? 'ss-negative' : 'ss-positive'}`}>
      <span>Even − odd</span><strong data-testid="energy-difference">{fmt(difference)}</strong>
    </div>
    <p className="ss-small">Signed margin <strong>{margin === null ? 'undefined' : fmt(margin, 4)}</strong> · (even − odd) / (even + odd)</p>
    {caption && <p className="ss-small">{caption}</p>}
  </div>;
}

function CumulativePlot({ benchmark, estimate, fullTail }) {
  const curve = useMemo(() => {
    if (estimate.endpoint) return [];
    let even = 0, odd = 0;
    return benchmark.boundary.r.map((r, i) => {
      const weight = benchmark.boundary.quadratureWeights[i] * omega(XI_DATA.a, estimate.h, r);
      even += weight * benchmark.boundary.even[i];
      odd += weight * benchmark.boundary.odd[i];
      return { r, even, odd, difference: even - odd };
    });
  }, [benchmark, estimate]);
  if (estimate.endpoint) return <div className="ss-endpoint" role="status">
    <strong>The boundary is a point-mass limit.</strong>
    <p>At h = a = ½, all weight sits at r = 0. The two features coincide: even energy = 1 and odd energy = 0 in this normalization.</p>
  </div>;
  const rMax = fullTail ? 8 : 2;
  const points = [{ r: 0, even: 0, odd: 0, difference: 0 }, ...curve.filter(p => p.r <= rMax)];
  const high = Math.max(estimate.even, ...points.map(p => p.even), .01) * 1.12;
  const low = Math.min(0, ...points.map(p => p.difference)) * 1.12;
  const px = r => 57 + 580 * r / rMax;
  const py = v => 267 - 219 * (v - low) / (high - low);
  const path = key => points.map((p,i)=>`${i?'L':'M'}${px(p.r)},${py(p[key])}`).join(' ');
  return <svg viewBox="0 0 680 312" className="ss-cumulative" role="img" aria-label="Cumulative even energy, odd energy, and their signed difference from the positive boundary kernel">
    {[0,.25,.5,.75,1].map(q => { const v = low + (high-low)*q; return <g className="ss-grid" key={q}><line x1="57" x2="637" y1={py(v)} y2={py(v)} /><text x="48" y={py(v)+4} textAnchor="end">{v.toFixed(2)}</text></g>; })}
    {[0,.25,.5,.75,1].map(q => <text key={q} x={px(q*rMax)} y="288" textAnchor="middle" className="ss-svg-label">{q*rMax}</text>)}
    <line x1="57" x2="637" y1={py(estimate.direct)} y2={py(estimate.direct)} stroke={COLORS.axis} strokeDasharray="5 4" />
    <path d={path('even')} fill="none" stroke={COLORS.even} strokeWidth="2.6" />
    <path d={path('odd')} fill="none" stroke={COLORS.odd} strokeWidth="2.6" />
    <path d={path('difference')} fill="none" stroke={COLORS.ink} strokeWidth="2.2" />
    <text x="57" y="24" className="ss-svg-heading">CUMULATIVE QUADRATURE CONTRIBUTIONS</text>
    <text x="347" y="308" textAnchor="middle" className="ss-svg-label">half-separation r · points t − r and t + r</text>
  </svg>;
}

function exportBenchmark(benchmark, estimate) {
  const payload = { metadata: { ...XI_DATA, cases: undefined }, benchmark, selectedShift: estimate.h };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `sign-switching-${benchmark.id}-h-${estimate.h}.json`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function SignSwitchingPage() {
  const [epsilon, setEpsilon] = useState(-.12);
  const [probeY, setProbeY] = useState(0);
  const [probeH, setProbeH] = useState(0);
  const [caseId, setCaseId] = useState('first-zero');
  const [shiftIndex, setShiftIndex] = useState(2);
  const [fullTail, setFullTail] = useState(false);
  const model = modelEnergies({ epsilon, a: 1, h: probeH, t: probeY });
  const state = collisionState(epsilon);
  const benchmark = XI_DATA.cases.find(c => c.id === caseId) || XI_DATA.cases[0];
  const estimate = benchmark.estimates[shiftIndex];
  return <div className="ed-root ss-root">
    <EditorialHeader ticker={<span>geometry · modes · bridge energy</span>} />
    <main className="ss-main">
      <header className="ss-page-head">
        <div className="ed-lbl">/sign-switching · linked research views</div>
        <h1 className="ed-h1">Where the sign switches</h1>
        <p className="ss-dek">A negative modal interval is the diameter of a negative shear half-disk in the collision model. For the full bridge kernel, the sign is exactly even energy minus odd energy.</p>
        <div className="ss-status-row"><Status>Exact local model</Status><Status>Exact bridge identity</Status><Status kind="numerical">Finite Ξ benchmarks</Status><Status kind="open">Global inequality open</Status></div>
      </header>

      <section className="ss-section" aria-labelledby="ss-local-heading">
        <div className="ss-section-title"><span className="ss-step">01</span><div><h2 id="ss-local-heading">One collision, three readings</h2><p>The same parameter drives the zeros, the shear region, and the modal sign.</p></div></div>
        <BlockMath tex={String.raw`F_\varepsilon(w)=w^2+2\varepsilon,\quad W=2x(x^2+y^2+2\varepsilon),\quad \mathfrak L_1(y)=4y^2+8\varepsilon`} />
        <div className="ss-controls">
          <label htmlFor="ss-epsilon">Collision offset ε <output>{epsilon.toFixed(3)}</output><input id="ss-epsilon" type="range" min="-.35" max=".35" step=".005" value={epsilon} onChange={e=>setEpsilon(Number(e.target.value))} /></label>
          <div className="ss-presets" aria-label="Collision states, decreasing epsilon">{[[.12,'Axis pair'],[0,'Double zero'],[-.12,'Off-axis pair']].map(([value,label])=><button type="button" key={label} aria-pressed={epsilon===value} onClick={()=>setEpsilon(value)}>{label}</button>)}</div>
          <label htmlFor="ss-probe-y">Selected height y <output>{probeY.toFixed(2)}</output><input id="ss-probe-y" type="range" min="-1" max="1" step=".01" value={probeY} onChange={e=>setProbeY(Number(e.target.value))} /></label>
          <label htmlFor="ss-probe-h">Transverse probe x = h <output>{probeH.toFixed(2)}</output><input id="ss-probe-h" type="range" min="0" max=".8" step=".01" value={probeH} onChange={e=>setProbeH(Number(e.target.value))} /></label>
        </div>
        <div className="ss-model-grid">
          <div className="ss-card"><CollisionGeometry epsilon={epsilon} probeH={probeH} probeY={probeY} />
            <div className="ss-legend"><span><i style={{background:COLORS.negative}} />negative shear / modal interval</span><span><i style={{background:COLORS.nodal}} />Re F = 0</span><span><i style={{background:COLORS.odd}} />Im F = 0</span><span><i style={{background:COLORS.ink}} />zeros</span></div>
          </div>
          <div className="ss-card ss-model-energy"><div className="ed-lbl">SAME MODEL · POSITIVE BOUNDARY a = 1</div><h3>Read the sign as energy</h3><EnergyBars even={model.even} odd={model.odd} difference={model.difference} caption={probeH===0?'At h = 0, this difference is L₁(y)/2.':'At this transverse probe, the difference is W(h,y)/h.'} /><BlockMath tex={String.raw`\begin{aligned}E_+&=2(1+y^2+2\varepsilon)\\ E_-&=2(1-h^2)\end{aligned}`} /></div>
        </div>
        <div className="ss-readouts" aria-live="polite"><div><span>Negative first-modal interval</span><strong data-testid="negative-interval">{state.negativeInterval ? `${(-state.radius).toFixed(4)} < y < ${state.radius.toFixed(4)}` : 'none'}</strong></div><div><span>Half-disk radius</span><strong>{state.radius ? state.radius.toFixed(4) : '0'}</strong></div><div><span>Selected first mode L₁</span><strong className={firstModal(epsilon,probeY)<0?'ss-negative-text':''}>{fmt(firstModal(epsilon,probeY))}</strong></div><div><span>Phase winding around both zeros</span><strong>2 in every state</strong></div></div>
        <p className="ss-key-explanation"><strong>The diameter is a transverse-limit statement.</strong> On the critical line, W = 0 by symmetry. The red diameter marks where <InlineMath tex={String.raw`\lim_{x\downarrow0}W(x,y)/x=\mathfrak L_1(y)/2`} /> is negative. Its endpoints are excluded. Moving the probe into x &gt; 0 shows the actual negative shear region.</p>
        <p className="ss-small">This is an exact quadratic collision model in centered, rescaled coordinates. The presets follow decreasing ε. For a double-zero heat collision it describes the leading local shape after rescaling; higher multiplicities have different profiles. The winding is that of F on a fixed enclosing contour. This does not assert a circular contour or an off-line zero for the undeformed Riemann function.</p>
      </section>

      <section className="ss-section" aria-labelledby="ss-xi-heading">
        <div className="ss-section-title"><span className="ss-step">02</span><div><h2 id="ss-xi-heading">The full Ξ boundary supplies both energies</h2><p>Evaluate two points of the known positive kernel at a = ½. Their even and odd combinations determine the inward shear.</p></div></div>
        <p className="ss-key-explanation">Here <InlineMath tex={String.raw`f(z)=\Xi(z)=\xi(\tfrac12+iz)`} /> and <InlineMath tex={String.raw`W_h(t)=-\Im\!\left[f'(t+ih)\overline{f(t+ih)}\right]`} />. Positive shear means the modulus grows as the transverse distance h increases. At h = 0, read Wₕ/h by its continuous limit.</p>
        <BlockMath tex={String.raw`\frac{W_h(t)}h=\int_0^\infty\omega_{a,h}(r)\left(\|\Phi_+(t,r)\|^2-\|\Phi_-(t,r)\|^2\right)\,dr=E_+-E_-`} />
        <div className="ss-controls ss-xi-controls">
          <label htmlFor="ss-height">Computed Ξ height<select id="ss-height" value={caseId} onChange={e=>setCaseId(e.target.value)}>{XI_DATA.cases.map(c=><option value={c.id} key={c.id}>{c.label} · t = {c.t.toFixed(6)}</option>)}</select></label>
          <label htmlFor="ss-shift">Interior shift h <output>{estimate.h.toFixed(2)}{estimate.endpoint?' · boundary':''}</output><input id="ss-shift" type="range" min="0" max={benchmark.estimates.length-1} step="1" value={shiftIndex} onChange={e=>setShiftIndex(Number(e.target.value))} /></label>
          <button type="button" onClick={()=>exportBenchmark(benchmark,estimate)}>Export this benchmark</button>
        </div>
        <div className="ss-model-grid">
          <div className="ss-card"><CumulativePlot benchmark={benchmark} estimate={estimate} fullTail={fullTail} /><div className="ss-legend"><span><i style={{background:COLORS.even}} />even</span><span><i style={{background:COLORS.odd}} />odd</span><span><i style={{background:COLORS.ink}} />even − odd</span><span><i style={{background:COLORS.axis}} />direct shear, dashed</span></div><label className="ss-check"><input type="checkbox" checked={fullTail} onChange={e=>setFullTail(e.target.checked)} />Show full r ∈ [0, 8] integration window</label><p className="ss-small">{fullTail?'Full finite integration window shown.':'Zoomed to r ≤ 2; the totals use the entire r ≤ 8 window.'} Curves show cumulative quadrature contributions.</p></div>
          <div className="ss-card"><div className="ed-lbl">ACTUAL Ξ · FINITE NUMERICAL SAMPLE</div><h3>Boundary energy balance</h3><EnergyBars even={estimate.even} odd={estimate.odd} difference={estimate.difference} caption="All values share the positive scale Pₐ(t,t). Rescaling changes neither the sign nor the signed margin." /><p className="ss-small">Sampled sign: <strong>{estimate.difference>0?'positive':estimate.difference<0?'negative':'zero'}</strong>. This finite sample does not establish the global inequality.</p></div>
        </div>
        <div className="ss-table-wrap"><table className="ss-evidence-table"><caption>Independent numerical comparison at t = {benchmark.t.toFixed(10)}, h = {estimate.h}</caption><thead><tr><th>Quantity</th><th>Value</th><th>Meaning</th></tr></thead><tbody><tr><td>Direct normalized Wₕ(t)/h</td><td>{fmt(estimate.direct,12)}</td><td>{estimate.h===0?'Limit f′² − ff″':'Completed-zeta formula and derivative'}</td></tr><tr><td>Even energy − odd energy</td><td>{fmt(estimate.difference,12)}</td><td>Boundary reconstruction</td></tr><tr><td>Absolute identity residual</td><td>{small(estimate.identityResidual)}</td><td>Agreement check, not an error certificate</td></tr><tr><td>Quadrature refinement change</td><td>{small(estimate.quadratureChange)}</td><td>24 versus 12 Gauss nodes per interval</td></tr><tr><td>Integrated weight mass</td><td>{fmt(estimate.weightMass,12)}</td><td>{estimate.endpoint?'Unit point mass at r = 0':'Exact infinite-domain mass is 1'}</td></tr></tbody></table></div>
        <p className="ss-small">The benchmarks evaluate Ξ directly at {XI_DATA.precisionDigits}-digit working precision. They use a finite r-window, floating-point quadrature, and the listed heights and shifts only. Refinement differences are not rigorous tail or rounding bounds. Selecting a known zero chooses a height; the calculation does not use an assumed-zero product.</p>
      </section>

      <section className="ss-section ss-research-target" aria-labelledby="ss-target-heading">
        <div className="ss-section-title"><span className="ss-step">03</span><div><h2 id="ss-target-heading">What this lets us attack</h2><p>The geometry locates a loss of sign. The energy identity states the inequality that must prevent it.</p></div></div>
        <div className="ss-status-row"><Status>Identity established</Status><Status kind="open">All-height domination unproved</Status></div>
        <BlockMath tex={String.raw`E_-(t,h)\le E_+(t,h)\qquad\text{for every }t\in\mathbb R,\quad0<h<\tfrac12`} />
        <p>Proving this inequality for the exact Riemann theta density would exclude the negative shear created just below any hypothetical off-axis zero. Positivity of the boundary kernel alone is insufficient: its off-diagonal correlations may be negative. The model above demonstrates that failure explicitly.</p>
        <details><summary>Definitions and exact probability weight</summary><BlockMath tex={String.raw`P_a(z,w)=\frac{\Xi(z+ia)\Xi(\bar w-ia)-\Xi(z-ia)\Xi(\bar w+ia)}{2ia(\bar w-z)}`} /><BlockMath tex={String.raw`\Phi_\pm(t,r)=\frac{\Phi_a(t+r)\pm\Phi_a(t-r)}2,\quad P_a(x,y)=\langle\Phi_a(x),\Phi_a(y)\rangle`} /><BlockMath tex={String.raw`\omega_{a,h}(r)=\frac{\pi r\sin(\pi h/a)\sinh(\pi r/a)}{ah[\cosh(\pi r/a)+\cos(\pi h/a)]^2},\quad r\ge0,\quad0<h<a`} /><BlockMath tex={String.raw`\int_0^\infty\omega_{a,h}(r)\,dr=1,\qquad\int_0^\infty r^2\omega_{a,h}(r)\,dr=a^2-h^2`} /><p>The h = 0 limit uses the logistic-derived density. The h = a endpoint is a point mass at r = 0. Neither endpoint is obtained by substituting into a singular formula.</p></details>
        <details><summary>How to use the linked views in the proof program</summary><ol><li>Use the local model to identify the mode exposed at a collision and the transverse shear sign it represents.</li><li>Use the boundary calculation to inspect even/odd contributions and their cancellation at a chosen height and shift.</li><li>Seek a bound on the odd energy from the exact theta arithmetic, preserving the full tail. A positive sample or a finite Gram block does not discharge the all-height requirement.</li><li>Use the full Schur complement when testing coupled modes; a single real-axis modal inequality can miss off-axis zeros.</li></ol></details>
        <p className="ss-source">Derivation and reproduction: <a href="https://github.com/judegomila/mathexplorer/blob/codex/sign-switching-energy-2026-11-07/formalization/paper/sign_switching_energy_2026-11-07.md" target="_blank" rel="noreferrer">research note</a> · <a href="https://arxiv.org/abs/1005.1104" target="_blank" rel="noreferrer">modulus monotonicity criterion</a> · <a href="https://arxiv.org/abs/1904.12438" target="_blank" rel="noreferrer">heat-flow collision context</a></p>
      </section>
      <footer className="ss-footer"><Link to="/vortex-field">Vortex Field</Link><Link to="/shift-bridge-positivity">Shift-Bridge Positivity</Link><Link to="/hidden-square-program">Complete Kernel</Link><Link to="/visualizations">All Visualizations</Link></footer>
    </main>
  </div>;
}
