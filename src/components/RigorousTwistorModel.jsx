import React, { useMemo, useState } from 'react';
import { InlineMath, BlockMath } from './KaTeXMath.jsx';
import { abs, multiply, angularDimension, angularMultiplier, arithmeticDiagnostic, windowEvidence, COMMON_WINDOW_SAFE } from '../math/rigorousTwistor.js';
import '../styles/rigorous-twistor.css';

const complex = (z) => z ? z[0].toFixed(5) + (z[1] < 0 ? ' − ' : ' + ') + Math.abs(z[1]).toFixed(5) + 'i' : 'unavailable';
const Badge = ({ kind, children }) => <span className={'rt-badge rt-' + kind}>{children}</span>;
const Formula = ({ children }) => <div className="rt-formula"><BlockMath tex={children} /></div>;

function Range({ id, label, value, onChange, min, max, step }) {
  return <label className="rt-control" htmlFor={id}>
    <span>{label}<output htmlFor={id}>{value.toFixed(2)}</output></span>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
  </label>;
}

function ModeChart({ rows, scalar }) {
  const max = Math.max(1, scalar.ok ? scalar.magnitude : 1);
  return <figure className="rt-chart">
    <svg viewBox="0 0 700 255" role="img" aria-labelledby="rt-chart-title rt-chart-desc">
      <title id="rt-chart-title">Angular and completed multiplier magnitudes</title>
      <desc id="rt-chart-desc">For harmonic indices zero through eight, blue bars are the geometric multiplier magnitude. Orange bars include the arithmetic ratio. The constant geometric multiplier is always one.</desc>
      {[0, max / 2, max].map((v) => <g key={v}>
        <line x1="38" x2="686" y1={207 - v / max * 165} y2={207 - v / max * 165} stroke="var(--hairline)" />
        <text x="29" y={211 - v / max * 165} textAnchor="end">{Number(v.toFixed(2))}</text>
      </g>)}
      {rows.map((row, i) => <g key={row.m}>
        <rect x={52 + i * 71} y={207 - row.magnitude / max * 165} width="21" height={row.magnitude / max * 165} fill="var(--blue)" rx="2" />
        {scalar.ok && <rect x={76 + i * 71} y={207 - row.completedMagnitude / max * 165} width="21" height={row.completedMagnitude / max * 165} fill="var(--terra)" rx="2" />}
        <text x={74 + i * 71} y="228" textAnchor="middle">{row.m}</text>
        <text x={74 + i * 71} y="246" textAnchor="middle" className="rt-dimension">{row.dimension}d</text>
      </g>)}
      <text x="38" y="21">multiplier magnitude</text>
    </svg>
    <figcaption><span className="rt-legend-blue">■ |bₘ(w)|</span> <span className="rt-legend-orange">■ |Rₐ(w)bₘ(w)|</span> · m below each pair; d is the harmonic dimension.</figcaption>
  </figure>;
}

export default function RigorousTwistorModel() {
  const [real, setReal] = useState(0.7);
  const [imag, setImag] = useState(2);
  const [a, setA] = useState(1.5);
  const [windowA, setWindowA] = useState(0.25);
  const [windowL, setWindowL] = useState(1.5);
  const scalar = useMemo(() => arithmeticDiagnostic([real, imag], a), [real, imag, a]);
  const rows = useMemo(() => Array.from({ length: 9 }, (_, m) => {
    const b = angularMultiplier([real, imag], m);
    return { m, b, magnitude: abs(b), dimension: angularDimension(m),
      completed: scalar.ok ? multiply(scalar.value, b) : null,
      completedMagnitude: scalar.ok ? scalar.magnitude * abs(b) : null };
  }), [real, imag, scalar]);
  const evidence = windowEvidence(windowA, windowL);
  const wide = a === 1.5;

  return <div className="rt-model">
    <div className="rt-intro">
      <div className="rt-eyebrow">THE EXACT MODEL · RESEARCH NOTE, 3 OCTOBER 2026</div>
      <h2>Geometry is explicit.<br />The arithmetic gap remains.</h2>
      <p>A split-real Fourier intertwiner with an exact wide arithmetic completion,
        after choosing the ℚ-based unramified factors and the xi-completion normalization.
        This view separates the proved construction, a bounded computer-assisted certificate,
        and the still-open thin-width problem.</p>
      <div className="rt-badges">
        <Badge kind="proved">PROVED · analytical statements</Badge>
        <Badge kind="certified">CERTIFIED · specified window</Badge>
        <Badge kind="open">CONJECTURAL · global thin-width target</Badge>
      </div>
      <p className="rt-small">“Proved” refers to the analytical arguments in the linked, independently checked research note.
        “Certified” refers to its outward-rounded interval computation with an infinite-tail bound.
        Neither label means proof-assistant formalization or peer review. This is not a proof of RH.</p>
    </div>

    <section className="rt-section" aria-labelledby="rt-geometry-title">
      <div className="rt-section-heading"><span className="rt-number">01</span><h3 id="rt-geometry-title">Twistor space and its dual</h3><Badge kind="proved">PROVED</Badge></div>
      <div className="rt-duality">
        <div><div className="rt-eyebrow">TWISTOR</div><Formula>{"\\mathbb{P}(V)=\\mathbb{RP}^{3}"}</Formula><p>A line [Z] in V = ℝ⁴</p><InlineMath tex={"f(rZ)=|r|^{-2-w}f(Z)"} /></div>
        <div className="rt-duality-arrow"><span aria-hidden="true">⇄</span><strong>Fourier intertwiner</strong><InlineMath tex={"w\\longmapsto-w"} /></div>
        <div><div className="rt-eyebrow">DUAL TWISTOR</div><Formula>{"\\mathbb{P}(V^*)=(\\mathbb{RP}^{3})^*"}</Formula><p>A covector [W] up to scale</p><InlineMath tex={"\\widehat f(rW)=|r|^{-2+w}\\widehat f(W)"} /></div>
      </div>
      <p>The group is <InlineMath tex={"SL(4,\\mathbb R)"} />. Incidence is the natural pairing <InlineMath tex="W(Z)=0" />.
        The transform acts on even homogeneous distributions, meromorphically in w. It is not a pointwise map from one projective point to another,
        and there is no canonical group-equivariant identification of these two projective spaces.</p>
      <div className="rt-note">The compact picture is <InlineMath tex={"\\mathcal H=L^2_{\\mathrm{even}}(S^3)=\\widehat{\\bigoplus}_{m\\ge0}\\mathcal Y_{2m}(S^3)"} />.
        The degree-2m harmonic space has dimension (2m + 1)². These are SO(4) types, not invariant subspaces for all of SL(4,ℝ).
        The constant harmonic is SO(4)-fixed, not a generic SL(4,ℝ)-invariant subrepresentation. The width a and the homogeneity parameter w play different roles.</div>
      <details className="rt-details"><summary>Dual action, covariance and operator domains</summary>
        <p>The compactified split spacetime is Gr(2,V). A two-plane L has twistor line P(L) and dual line P(L°), where L° is its annihilator.
          The scalar Fourier/X-ray incidence statement is at w = 0 with compatible densities; other weights require additional target data.</p>
        <Formula>{"\\mathcal F_w\\pi_w(g)=\\pi^*_{-w}(g)\\mathcal F_w,\\qquad \\pi_w(g)f(Z)=f(g^{-1}Z),\\quad \\pi^*_{-w}(g)h(W)=h(g^T W)"}</Formula>
        <p>The dual action is contragredient. After choosing a Euclidean identification of V* with V, the compact-picture covariance is twisted:</p>
        <Formula>{"A(w)\\pi_w(g)=\\pi_{-w}(\\theta(g))A(w),\\qquad\\theta(g)=g^{-T}"}</Formula>
        <p>The density character has complex smooth weight; it is not a holomorphic line bundle of fractional degree.
          Meromorphic continuation takes place on homogeneous distribution or smooth-section spaces, not globally in the bounded operators on the fixed Hilbert space.</p>
        <p>On Re w &gt; 0, A(w) is compact, bounded, operator-norm holomorphic and has norm exactly one.
          On the imaginary axis A(it) is unitary, with strong-operator boundary limits, not operator-norm limits.
          At generic left-half-plane parameters the multipliers grow and do not define a bounded operator on this fixed Hilbert space.</p>
        <Formula>{"\\|A(x)-A(0)\\|=1\\quad(0<x<2),\\qquad A(2)=P_0"}</Formula>
        <p>The w = 2 rank-one value is a normalized continued limit at an exceptional homogeneous weight, not an unregularized Fourier integral.
          Fourier inversion on appropriate distribution models does not give a bounded inverse to the compact A(w) on the fixed Hilbert space.
          The chosen Euclidean compact-picture norm is SO(4)-invariant, not SL(4,ℝ)-invariant at general complex w.</p>
      </details>
    </section>

    <section className="rt-section" aria-labelledby="rt-factor-title">
      <div className="rt-section-heading"><span className="rt-number">02</span><h3 id="rt-factor-title">Two factors. One constant-mode obstruction.</h3></div>
      <div className="rt-factor-grid">
        <div className="rt-factor rt-factor-geometry"><Badge kind="proved">GEOMETRIC · EXACT FORMULA</Badge><h4>The normalized angular part</h4>
          <Formula>{"A(w)|_{\\mathcal Y_{2m}}=b_m(w)I,\\qquad b_m(w)=\\prod_{j=1}^{m}\\frac{w-2j}{w+2j}"}</Formula>
          <p>Each factor has modulus at most one when Re w ≥ 0. The empty product b₀ = 1 keeps the constant mode unchanged.</p>
        </div>
        <div className="rt-factor rt-factor-arithmetic"><Badge kind={a >= 0.5 ? 'proved' : 'open'}>{wide ? 'ARITHMETIC · WIDE MATCH' : a >= 0.5 ? 'SCALAR SCHUR · THEOREM' : 'ARITHMETIC · CANDIDATE FAMILY'}</Badge><h4>The completed xi ratio</h4>
          <Formula>{"R_a(w)=\\frac{\\xi(\\frac12+w-a)}{\\xi(\\frac12+w+a)},\\quad T_a(w)=R_a(w)A(w)"}</Formula>
          <p>The exact a = 3/2 split-twistor bridge is holomorphic and contractive on Re w &gt; 0.
            Classical shifted-xi estimates already give this Schur bound for every a ≥ 1/2.
            Only a = 3/2 is derived by this particular four-dimensional arithmetic construction. The unresolved scalar range is 0 &lt; a &lt; 1/2.</p>
        </div>
      </div>
      <details className="rt-details"><summary>Exact completion and parameter reflection</summary>
        <Formula>{"\\xi(s)=\\tfrac12s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s),\\qquad X(w)=\\xi(\\tfrac12+w)=X(-w)"}</Formula>
        <Formula>{"R_{3/2}(w)=\\frac{\\xi(w-1)}{\\xi(w+2)}=\\frac{(w-1)(w-2)}{(w+1)(w+2)}\\frac{\\Lambda(2-w)}{\\Lambda(2+w)}"}</Formula>
        <p>Here <InlineMath tex={"\\Lambda(s)=\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)"} />.
          The real- and prime-place identity is first obtained in |Re w| &lt; 1, then continued meromorphically.
          Apparent singular factors must be combined by continuation; ξ(0) = ξ(1) = 1/2.</p>
        <p>The ℚ-based arithmetic structure, finite-place spherical vectors, characters, self-dual measures and completion factor B₄ are additional choices.
          They are not uniquely forced by real incidence geometry. Outside the convergence strip, the scalar Euler product is a continued identity,
          not a convergent cascade of prime-place maps on a specified adelic Hilbert space.</p>
        <Formula>{"B_4(w)=\\frac{(w-1)(w-2)}{(w+1)(w+2)},\\qquad \\gamma_p(2+w)=\\frac{1-p^{-2-w}}{1-p^{-2+w}}>1\\quad(0<w<1)"}</Formula>
        <p>Each prime factor in this normalization is expansive on that real interval. The completed wide bound comes from the shifted-xi theorem;
          it does not follow by multiplying passive local norms. Meromorphic continuation preserves identities, not norm inequalities.</p>
      </details>
      <div className="rt-lab">
        <div className="rt-lab-top"><h4>Inspect the harmonic multipliers</h4><Badge kind="diagnostic">FLOATING-POINT DIAGNOSTIC</Badge></div>
        <div className="rt-controls">
          <Range id="rt-real" label="Re w" min={0} max={4} step={0.05} value={real} onChange={setReal} />
          <Range id="rt-imag" label="Im w" min={-20} max={20} step={0.1} value={imag} onChange={setImag} />
          <Range id="rt-width" label="Arithmetic width a" min={0.05} max={1.5} step={0.05} value={a} onChange={setA} />
        </div>
        <div className="rt-presets">
          <button type="button" onClick={() => { setReal(2); setImag(0); setA(1.5); }}>Exact anchor: w = 2, a = 3/2</button>
          <button type="button" onClick={() => setA(0.25)}>Explore candidate a = 1/4</button>
          <button type="button" onClick={() => { setReal(0.7); setImag(2); setA(1.5); }}>Reset multipliers</button>
        </div>
        <div className="rt-metrics" aria-live="polite">
          <div><span>GEOMETRIC CONSTANT MODE</span><strong>b₀ = 1</strong></div>
          <div><span>ARITHMETIC MAGNITUDE</span><strong>{scalar.ok ? '|Rₐ| ≈ ' + scalar.magnitude.toFixed(6) : 'Unavailable'}</strong></div>
          <div><span>{real > 0 ? 'FULL OPERATOR NORM · REGULAR POINTS' : 'BOUNDARY DISPLAY · Re w = 0'}</span><strong>{real > 0 ? '‖Tₐ(w)‖ = |Rₐ(w)|' : 'No interior Schur conclusion'}</strong></div>
        </div>
        {!scalar.ok && <p role="status" className="rt-note">{scalar.reason}</p>}
        <ModeChart rows={rows} scalar={scalar} />
        <p className="rt-small">The formulas are exact; plotted values are ordinary floating-point calculations.
          Xi is evaluated by the theta integral in <a href="https://dlmf.nist.gov/25.5.E13" target="_blank" rel="noreferrer">NIST DLMF 25.5.13</a>.
          A two-resolution check suppresses unstable ratios and is not an interval certificate. No zeta-zero list is used.</p>
        {real === 2 && imag === 0 && wide && <div className="rt-note rt-anchor"><strong>Exact anchor:</strong> A(2) = P₀ and T(2) = [15/(2π²)]P₀. Every nonconstant mode vanishes; the constant mode survives.</div>}
        <details className="rt-details"><summary>Read the numerical mode values</summary>
          <div className="rt-table-scroll"><table><caption>First nine harmonic spaces. Values are diagnostics.</caption>
            <thead><tr><th scope="col">m</th><th scope="col">Degree</th><th scope="col">Dimension</th><th scope="col">bₘ(w)</th><th scope="col">Rₐ(w)bₘ(w)</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.m}><th scope="row">{r.m}</th><td>{2 * r.m}</td><td>{r.dimension}</td><td>{complex(r.b)}</td><td>{complex(r.completed)}</td></tr>)}</tbody>
          </table></div>
        </details>
      </div>
      <div className="rt-gap"><Badge kind="open">THE RH-STRENGTH GAP</Badge>
        <p>The constant mode means angular contraction cannot hide arithmetic growth:
          at regular points with Re w &gt; 0, <InlineMath tex={"\\|T_a(w)\\|=|R_a(w)|"} />.
          Proving holomorphic Schur contractivity for every a &gt; 0, or for a sequence a ↓ 0, remains equivalent to RH.
          Sampling the plot does not establish that theorem.</p>
      </div>
    </section>

    <section className="rt-section" aria-labelledby="rt-window-title">
      <div className="rt-section-heading"><span className="rt-number">03</span><h3 id="rt-window-title">Where the finite-window bounds apply</h3></div>
      <p>This is a different operator: the signed arithmetic Hankel operator on L²((0,L), dx).
        Its truncation endpoint L is independent of the spectral parameter w above.</p>
      <Formula>{"(\\mathsf H_{a,L}f)(x)=\\int_0^L h_a(xy)f(y)\\,dy,\\qquad h_a(x)=x^{-1}q_a(\\log x)\\ (x>1)"}</Formula>
      <p className="rt-small">Set hₐ(x) = 0 for x &lt; 1. The exact beta kernel and arithmetic sum qₐ are given in the report.
        H is self-adjoint and compact for every a &gt; 0, L &gt; 1, a classical fact stated by Suzuki after Theorem 2.3 (p. 8)
        and explained by weakly singular kernels in Section 5 (p. 24). The report gives an elementary proof.
        It is not Hilbert–Schmidt for 0 &lt; a ≤ 1/2. Compactness alone does not justify ordinary Fredholm determinant formulas or endpoint differentiation.</p>
      <div className="rt-window-controls">
        <label htmlFor="rt-window-a">Hankel width a
          <input id="rt-window-a" type="number" min="0.001" max="2" step="any" value={windowA} onChange={(e) => setWindowA(e.target.value)} /></label>
        <label htmlFor="rt-window-l">Truncation endpoint L
          <input id="rt-window-l" type="number" min="1.001" max="3" step="any" value={windowL} onChange={(e) => setWindowL(e.target.value)} /></label>
        <div className="rt-presets">
          <button type="button" onClick={() => { setWindowA(0.25); setWindowL(1.5); }}>Signed certified window</button>
          <button type="button" onClick={() => { setWindowA(0.5); setWindowL(COMMON_WINDOW_SAFE); }}>Common small window</button>
          <button type="button" onClick={() => { setWindowA('0.25000001'); setWindowL(1.5); }}>Nearby-width theorem</button>
        </div>
      </div>
      <div className={'rt-window-result rt-' + evidence.kind} data-evidence-method={evidence.method || 'outside'} role="status" aria-live="polite">
        <Badge kind={evidence.kind}>{evidence.kind === 'outside' ? 'NOT COVERED HERE' : evidence.method === 'width-perturbation' ? 'CERTIFICATE + PERTURBATION' : evidence.kind.toUpperCase()}</Badge>
        <h4>{evidence.title}</h4>
        {evidence.bound !== null ? <>
          <Formula>{"\\|\\mathsf H_{a,L}\\|\\le " + evidence.exact + "<1"}</Formula>
          <p>Bound ≈ {evidence.bound.toFixed(8)}; both I + H and I − H have a positive lower bound of {evidence.gapLabel} times I.</p>
          <p>{evidence.method === 'width-perturbation'
            ? 'A proved L¹ perturbation estimate in width extends the point interval certificate. This is an analytical consequence of that certificate, not a new interval computation at every width.'
            : evidence.method === 'point' ? 'The certificate controls 33 real Fourier modes and the full omitted infinite tail, using 80-digit outward-rounded interval arithmetic. It is not only a finite matrix experiment.'
              : 'The analytical Schur-test argument applies to every 0 < a ≤ 1 in the common prime-free window.'}</p>
        </> : <p>No contraction bound from these implemented results is assigned to this parameter pair. This does not assert failure of contractivity or rule out other known results.</p>}
      </div>
      <div className="rt-scope-grid">
        <div><Badge kind="proved">ANALYTICAL WINDOW</Badge>
          <p>0 &lt; a ≤ 1, 1 &lt; L ≤ exp(e⁻ᵞ/(8π))<br />‖Hₐ,ᴸ‖ ≤ 2⁻ᵃ</p>
          <p className="rt-small">L₀ ≈ 1.02259116413516. The selector uses the conservative lower decimal 1.022591164.</p></div>
        <div><Badge kind="certified">SIGNED WINDOW</Badge>
          <p>a = 1/4, 1 &lt; L ≤ 3/2<br />‖Hₐ,ᴸ‖ ≤ 49999/50000 = 0.99998</p>
          <p className="rt-small">Crosses the first prime threshold L = √2. This tighter bound is at exactly a = 1/4; nearby widths use the separate perturbation theorem below.</p></div>
        <div className="rt-scope-wide"><Badge kind="certified">CERTIFICATE + ANALYTICAL PERTURBATION</Badge>
          <p>0.24999998 ≤ a ≤ 0.25000002, 1 &lt; L ≤ 3/2<br />‖Hₐ,ᴸ‖ ≤ 99999/100000 = 0.99999</p>
          <p className="rt-small">The exact width endpoints are 12499999/50000000 and 12500001/50000000.
            Input decimals are compared exactly. No bound is extended beyond these endpoints or beyond L = 3/2.
            This neighborhood of 1/4 does not provide widths tending to zero.</p></div>
      </div>
      <div className="rt-note"><strong>Keep the conclusion local.</strong> These finite-L bounds do not prove pointwise Schur contractivity of Rₐ or Tₐ on the whole right half-plane.
        The signed H is indefinite; the positive operators are I ± H. The all-window estimate at arbitrarily small widths remains open.</div>
    </section>

    <section className="rt-section" aria-labelledby="rt-global-title">
      <div className="rt-section-heading"><span className="rt-number">04</span><h3 id="rt-global-title">The exact all-window target</h3><Badge kind="proved">PROVED CRITERION</Badge></div>
      <p>For each fixed a &gt; 0, the finite-window norms are nondecreasing with L. Their supremum is finite exactly when Rₐ is Schur on Re w &gt; 0.
        In that case the supremum equals one; otherwise the norms increase without bound.</p>
      <Formula>{"\\sup_{L>1}\\|\\mathsf H_{a,L}\\|<\\infty\\quad\\Longleftrightarrow\\quad R_a\\text{ is Schur},\\qquad \\sup_{L>1}\\|\\mathsf H_{a,L}\\|=1\\text{ in this case}"}</Formula>
      <p>The unconditional bound <InlineMath tex={"\\|\\mathsf H_{a,L}\\|\\le L"} /> holds for every a &gt; 0 and L &gt; 1.
        Its growth with L is precisely why it does not give the uniform-in-truncation estimate below.</p>
      <div className="rt-gap"><Badge kind="open">UNPROVED ARITHMETIC ESTIMATE</Badge>
        <Formula>{"a_n\\downarrow0,\\qquad \\forall n\\ \\exists C_n<\\infty:\\ \\|\\mathsf H_{a_n,L}\\|\\le C_n\\quad\\forall L>1"}</Formula>
        <p>These all-L bounds, separately for each width in a sequence tending to zero, would prove RH.
          No common bound in n and no strictly positive gap below one uniform in L are required.
          The local a = 1/4 certificate does not supply this estimate. A canonical-system Hamiltonian is a separate construction requiring additional regularity and normalization arguments.</p>
      </div>
      <details className="rt-details"><summary>The equivalent scalar tail-energy target</summary>
        <Formula>{"E_a(u)=1-\\int_0^u K_a(v)\\,dv,\\qquad K_a(u)=e^{-u/2}q_a(u)"}</Formula>
        <Formula>{"R_a\\text{ is Schur}\\quad\\Longleftrightarrow\\quad\\int_0^\\infty |E_a(u)|^2\\,du<\\infty"}</Formula>
        <p>This is Suzuki’s existing integrated-kernel criterion (Theorem A.1), expressed in logarithmic coordinates.
          The report proves the unconditional weighted estimate below:</p>
        <Formula>{"\\int_0^\\infty e^{-u}|E_a(u)|^2\\,du\\le2(1-R_a(1))\\qquad(a>0)"}</Formula>
        <p>Removing the exponential weight, separately for widths tending to zero, is still the missing arithmetic estimate.
          Finite weighted energy does not imply finite unweighted energy.</p>
      </details>
      <details className="rt-details"><summary>Why an exact weighted semigroup does not close the gap</summary>
        <Formula>{"\\mathcal E_X=XH^2(\\mathbb C_+),\\quad\\|Xg\\|_{\\mathcal E_X}=\\|g\\|_{H^2},\\qquad S_a(Xg)(w)=X(w)g(w+2a)"}</Formula>
        <p>This is a strongly continuous contraction semigroup for any nonzero entire X, even one with off-axis zeros.
          Its norm contains X by definition. Point-evaluation bounds cancel the same X factors, so its passivity does not prove that Rₐ is a Schur multiplier.</p>
        <p>The report also identifies two independently positive wide defect spaces whose contractive inclusion is equivalent to the thin Schur condition.
          Constructing the two spaces does not establish that inclusion: the comparison is the missing theorem, and cannot be assumed as the definition of an energy.</p>
      </details>
      <details className="rt-details"><summary>Why one fixed width does not automatically give a zero-free strip</summary>
        <p>Common shifted zeros can cancel. The even polynomial below has a zero at 3a, although its continued ratio is a Schur factor:</p>
        <Formula>{"P(w)=(w^2-a^2)(w^2-9a^2),\\qquad \\frac{P(w-a)}{P(w+a)}=\\frac{w-4a}{w+4a}"}</Formula>
        <p>This is a logical counterexample for a polynomial, not a counterexample involving xi.
          The safe implication uses a sequence aₙ → 0: isolation of any hypothetical off-axis xi zero prevents cancellation for all sufficiently small widths.</p>
      </details>
      <p className="rt-small">The local-to-global argument uses the explicit arithmetic kernel and Suzuki’s Theorem 2.2 and Lemma 4.1.
        It is not inferred from unit-modulus boundary values alone. See the research note for the bounded extension and causal convolution argument.</p>
    </section>

    <section className="rt-section" aria-labelledby="rt-results-title">
      <div className="rt-section-heading"><span className="rt-number">05</span><h3 id="rt-results-title">What the continuation rules out</h3></div>
      <ul className="rt-results">
        <li><Badge kind="proved">PROVED</Badge><div><strong>No identical holomorphic operator stages</strong><p>Near w = 2, neither A nor T admits a qth holomorphic operator root for any integer q ≥ 2, even allowing angular mixing. The dimensions 9 and 25 obstruct determinant divisibility.</p></div></li>
        <li><Badge kind="proved">PROVED</Badge><div><strong>Finite copies have a sharp limit</strong><p>On r complete copies, a qth root exists exactly when q divides r. An infinite delay coordinate permits passive subdivision, but has not been identified with the actual thin xi ratios.</p></div></li>
        <li><Badge kind="proved">PROVED</Badge><div><strong>A positive scalar delay kernel is insufficient</strong><p>For every 0 &lt; a ≤ 1 the actual completed arithmetic kernel is negative on log(3/2) &lt; u &lt; log 2. This excludes a positive scalar convolution measure; it does not exclude a signed passive realization.</p></div></li>
      </ul>
      <p className="rt-small">These statements concern this precise construction. They do not exclude all possible twistor approaches, supply a new zero-free region, or establish RH. Literature priority has not been assessed.</p>
    </section>
    <footer className="rt-source"><div><strong>Inspect the proof and certificate</strong><p>The report includes definitions, analytical proofs, certificate scope and references.</p></div>
      <a className="rt-report-link" href="/papers/twistor-bridge-continuation-2026-10-03.pdf" target="_blank" rel="noreferrer">Read the research note ↗</a>
    </footer>
  </div>;
}
