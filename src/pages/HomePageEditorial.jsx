import React, { lazy, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EditorialHeader, GradeChip, InlineMath } from '../components/editorial/PostLayout.jsx';
import WireframeAnim from '../components/editorial/WireframeAnim.jsx';
import { useConceptLinker } from '../components/ConceptText.jsx';
import { ZETAEXPLORER_NO_GOS } from '../data/rh-no-go-theorems.js';
import { FULL_ROUTE_MAP } from '../data/full-route-map-2026-06-19.js';
import { RESULTS_COUNT } from '../data/graded-results.js';
import { PROGRAM_STATUS_AS_OF } from '../data/program-status-current.js';

// The real interactive explorers, lazy-loaded so the landing stays light.
const TwinLadderViz = lazy(() => import('../components/TwinLadderViz.jsx'));
const ZetaStripLive = lazy(() => import('../components/ZetaStripLive.jsx'));
const WaveSimViz = lazy(() => import('../components/WaveSimViz.jsx'));

/* Full-width front page — editorial (warm) theme,
   functional language, real project content. Rendered under .ed-root so the
   scoped editorial.css applies. Old dark home preserved at /classic. */

const FINDINGS = [
  { to: '/lambda-0116091', grade: 'CANDIDATE', date: '2026-10', isNew: true,
    title: 'Λ ≤ 0.116091 from a zero-free half-plane',
    desc: 'Computer-assisted upper bound. Depends on two unrefereed results: the zero-free half-plane Re s > 7/8 (openai/math family 003; Lean proof rebuilt here, standard axioms only) and D. J. Raymond’s decreasing-barrier construction. 0.116091 also uses internal floor and kernel certificates (0.118506 without them). Not peer reviewed; not an established bound.' },
  { to: '/lambda-01758354-candidate', grade: 'CANDIDATE', date: '2026-08',
    title: 'Λ ≤ 0.1758354', desc: 'Computer-assisted candidate for an unconditional bound: four barrier gates certified in Arb, y-transfer reduction and Lemma B3 Lean-checked. Unrefereed; not established.' },
  { to: '/newman-lambda-01787854-candidate', grade: 'CANDIDATE', date: '2026-08',
    title: 'Λ ≤ 0.1787854 (v3 package)', desc: 'Private v3 package: slab, half-strip, 3,149,013-row replay, tail and height certificates. Unreviewed, unpublished, not accepted.' },
  { to: '/rh-landscape-dag', grade: 'MAP', date: '2026-09', isNew: true,
    title: 'The general RH DAG', desc: 'Equivalent formulations, partial results, records, analogues and standing walls of RH, each node cited.' },
  { to: '/project-dag', grade: 'MAP', date: '2026-09', isNew: true,
    title: 'The project attempts DAG', desc: 'Every project route, certificate, candidate and no-go by lane, with typed edges linked to the general DAG.' },
  { to: '/flow-blindness-no-go', grade: 'NO-GO', date: '2026-08',
    title: 'Flow-blindness: soft ⇏ RH', desc: 'No flow-stable hypothesis proves RH, given Rodgers–Tao Λ ≥ 0; a proof needs arithmetic input. Core lemmas kernel-checked in Lean 4.' },
  { to: '/viz-imp95549-ns-rigid-pencil-eigenvalue', grade: 'THEOREM', date: '2026-09', isNew: true,
    title: 'NS-RIGID: native-span rigidity', desc: 'Each finite native-span positivity statement is flow-stable (so not the missing input) or its failure refutes RH. Only RH is flow-critical.' },
  { to: '/flow-blindness-no-go', grade: 'THEOREM', date: '2026-08',
    title: 'T3 is the zero-free strip', desc: 'T3(a) ⇔ no ζ-zero with Re s > ½ + a (trig core checked to 1e-30, full identity to 1e-15). It restates RH; it is not a mechanism.' },
  { to: '/permutation-architecture', grade: 'NO-GO', date: '2026-09', isNew: true,
    title: 'Theorem U: sieve-algebra universality', desc: 'Every freeze-calculus configuration is a basis choice in a 2^25-dim sieve algebra on one scalar; configurations change provability only.' },
  { to: '/twin-ladder-paper-roadmap', grade: 'NO-GO', date: '2026-07',
    title: 'Conjecture 22.1 obstruction', desc: 'The eq-20 frozen-ladder proxy is capped by an exponential-polynomial zero count; matching PT needs ≥ 1.2363e13 coefficients. Partial result.' },
  { to: '/frozen-rung-pt-equivalence', grade: 'THEOREM', date: '2026-07',
    title: 'Freezing rungs = Platt–Trudgian', desc: 'Frozen-rung certificates are inertia-preserving, so they cannot beat verified height. Full equivalence with PT is conditional on L1, L2.' },
  { to: '/rh-novel-routes-roadmap', grade: 'NO-GO', date: '2026-09', isNew: true,
    title: 'Sonine port obstruction past ln 2', desc: 'Past 2a = ln 2 the S = {∞, 2} Sonine excess carries half the p = 2 log cusp and is unbounded along its resonances. No finite-rank fix.' },
  { to: '/frontier-dag', grade: 'NO-GO', date: '2026-09', isNew: true,
    title: 'Route VII derived floor U ≈ 0.145–0.150', desc: 'Reachable-floor analysis for Route VII (2026-09): going below it requires arithmetic input, not more compute. A route floor, not a bound on Λ. The route-P value 0.144997 is unconfirmed below 0.145 (2026-11).' },
  { to: '/threads', grade: 'NO-GO', date: '2026-09', isNew: true,
    title: 'Inertia-PCC: same wall', desc: 'The inertia route meets the pair-correlation wall (λ_max(ρ) = 0.6231344958476320). Measurement only.' },
  { to: '/viz-imp96646-krein-certificate-margin', grade: 'CERTIFIED', date: '2026-09', isNew: true,
    title: 'Route I Toeplitz–Krein certificate', desc: 'Pole-free Weil positivity certified in Arb for every 2a ≤ ln 3 (2026-09-28, internal referees). This range is also implied by the verified zeros.' },
  { to: '/viz-imp96103-route-i-remainder-resonance', grade: 'RESULT', date: '2026-09', isNew: true,
    title: 'Semilocal Sonine trace identity', desc: 'Exact identity for S = {∞, 2} with positive trace side, but the remainder is 96.7–99.7% of the trace: Weil positivity < ln 3 ⇔ D_S ≤ L_S.' },
  { to: '/theta-basin-closure', grade: 'THEOREM', date: '2026-08',
    title: 'c_glob = 0.8980208880762339', desc: 'Unique root of the half-lattice digamma rate bound: global isolation constant = half-lattice constant. Closes R2 subgap; no Λ change.' },
  { to: '/catalan-signed-ladder', grade: 'THEOREM', date: '2026-09', isNew: true,
    title: 'Catalan period-dimension obstruction', desc: 'Signed-ladder values: ζ(2) control 5ζ(2) − 8 (period dimension 2), Catalan G − π + 2ln2 + π²/12 (dimension 5). G irrationality open in the refereed literature; an external Lean-formalized claim (openai/math, 2026-10-06) is not peer-reviewed.' },
  { to: '/theorem-b-threshold', grade: 'RESULT', date: '2026-06',
    title: 'Closed-form constants', desc: 'Exact values for the Theorem-B threshold and boundary constants.' },
  { to: '/lambda-bounds', grade: 'RESULT', date: '2026-07',
    title: 'RH-free F_mb enclosure', desc: 'Two-sided enclosure of the backward-Dyson collision time on N ∈ [1e4, 1e6] (K ≤ 2.424e-6), no RH or GUE input. Step 4 stays open.' },
  { to: '/pt-floor-audit', grade: 'AUDIT', date: '2026-07',
    title: 'Verified height binds the floor', desc: 'The Λ ≤ 0.2 floor is set by verified zero height (~3e12), not barrier slack; SOS/Carleman/Putinar tightening is refuted as a lever.' },
  { to: '/viz-imp34825-winding-count-ladder', grade: 'AUDIT', date: '2026-07',
    title: 'Winding thread corrected', desc: 'Gaussian proxy is the exact de Bruijn flow at negative time; winding monotonicity is classical (de Bruijn Thm 13). Artifact claim refuted.' },
  { to: '/permutation-architecture', grade: 'CONTRACT', date: '2026-09', isNew: true,
    title: 'Λ ≤ 0.14 completion contract', desc: 'Fail-closed contract with one open weld family. Theorem U: only new arithmetic input or ≥ 3.4e17 cells can move it. Not a bound.' },
  { to: '/collapse-chain', grade: 'AUDIT', date: '2026-06',
    title: '‖V‖ ≤ 1 collapse: refuted as a reduction', desc: 'The proposed restatement of seven §15–27 conjectures as ‖V‖ ≤ 1 fails: ‖V‖ is scale-homogeneous, K_a is not. Residual ‖R‖ ≤ 1 is RH-equivalent.' },
  { to: '/viz-imp97068-mirror-descent-poisson-kernel', grade: 'THEOREM', date: '2026-09', isNew: true,
    title: 'Mirror pair lemma', desc: 'A conjugate pair below the topmost zero pulls it down by at least 2y/(Δ² + 4y²), the double-width Poisson kernel. Elementary proof.' },
  { to: '/viz-imp97068-mirror-descent-poisson-kernel', grade: 'CONDITIONAL', date: '2026-09', isNew: true,
    title: 'Conditional mirror-descent theorem', desc: 'H_desc-mirror ⇒ Λ ≤ t0 + y0²/2 = 0.145, modulo residuals. The hypothesis is open, pointwise at σ < 1 (NS-RIGID class). No bound.' },
  { to: '/rh-novel-routes-roadmap', grade: 'NO-GO', date: '2026-09', isNew: true,
    title: 'Pole-term bridges fail at ln 2', desc: 'Local, finite-rank and fixed-measure pole-term bridges fail past 2a = ln 2 via the shared p = 2 resonance. Nonlocal/arithmetic class open.' },
  { to: '/rh-novel-routes-roadmap', grade: 'RESULT', date: '2026-09', isNew: true,
    title: 'Route M: b/4 ceiling refuted', desc: 'Route M reduces to the mollifier lineage (Estermann). The b/4 ceiling |E1(b)| ≤ b/4 is refuted by explicit witnesses; κ_arith unaffected.' },
  { to: '/formalization-status', grade: 'FORMAL', date: '2026-09', isNew: true,
    title: 'Lean formalization (Aristotle)', desc: 'Aristotle Lean, 0 sorry: five-shell identity, flow-blindness no-go, frozen-rung parts, O1 lemma. expSum_hasDerivAt discharges DiniGate hA.' },
  { to: '/viz-imp95141-ythaw-obligation-meter', grade: 'CONDITIONAL', date: '2026-09', isNew: true,
    title: 'Λ ≤ 0.17759432 y-thaw package', desc: 'Package value, not a bound. Obligations O3, O5 closed; O1, O2, O4, O6 open. The theorem behind O1 is Lean-formalized with gates G1–G4 as hypotheses.' },
  { to: '/route-map', grade: 'MAP', date: '2026-06',
    title: `The wall map · ${FULL_ROUTE_MAP.totalRoutes} routes`, desc: 'Each mapped closure route across 6 clusters, and where it splits.' },
  { to: '/critical-line-proportion', grade: 'MAP', date: '2026-08',
    title: 'Zeros on the line · ≥ 2/3', desc: 'Peer-reviewed record 5/12 (PRZZ 2020); external ≥ 2/3 claim (Alpöge–Furman 2026, proof found by Claude; Lean-checked, not peer-reviewed, not this project’s).' },
  { to: '/what-we-know', grade: 'NO-GO', date: '2026-09', isNew: true,
    title: 'Negative results', desc: 'Theorems ruling out route families, and the gap that remains.' },
  { to: '/shift-bridge-positivity', grade: 'MAP', date: '2026-07',
    title: 'The a-dial geometry', desc: 'Shift-bridge positivity; T3, the program’s global frontier (T3 for all a > 0 ⇔ RH).' },
  { to: '/autonomous-fleet', grade: 'ENGINE', date: '2026-09', isNew: true,
    title: 'The autonomous fleet', desc: 'Multi-engine + Fable-5 working the frontier, live.' },
];

const SIMS = [
  ['/oscillators', 'Prime oscillators'], ['/hamiltonian', 'Hamiltonian'], ['/zeta', 'Zeta landscape'],
  ['/waves', 'Wave simulator'], ['/fourier', 'Fourier'], ['/control', 'Control theory'],
  ['/statistics', 'Zero statistics'], ['/simulator', 'Simulator'], ['/supercritical', 'Supercritical'],
  ['/spectral-attack', 'Spectral approach'], ['/gap-closing', 'Gap closing'], ['/formal-proof', 'Formal proof'],
];

export default function HomePageEditorial() {
  // Concept tooltips in the findings tiles: each concept is linked once across the grid. The
  // tiles are links themselves, so the terms render nested (no <a> inside <a>).
  const link = useConceptLinker();
  const findingDescs = useMemo(() => {
    const seen = new Set();
    return FINDINGS.map((f) => link(f.desc, { seen, nested: true, max: 3 }));
  }, [link]);
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
          <div style={{ marginTop: 16 }}>
            <Link className="ed-btn" to="/key-results" style={{ color: 'var(--paper)', display: 'inline-block' }}>Key results →</Link>
          </div>
          <div style={{ marginTop: 22 }}>
            <div className="ed-lbl">the interval · Rodgers–Tao ≤ Λ ≤ Platt–Trudgian</div>
            <div className="ed-track">
              <div className="ed-mk" style={{ left: '0%', background: 'var(--green)' }} />
              <div className="ed-mktop ed-mkedge-l" style={{ color: 'var(--green)' }}>0 · Λ ≥ 0 proved</div>
              <div className="ed-mkcap ed-mkedge-l">0</div>
              <div className="ed-mk" style={{ left: '58%', background: 'var(--brass-dk)' }} />
              <div className="ed-mkcap" style={{ left: '58%', color: 'var(--brass-dk)' }}>0.116091 conditional</div>
              <div className="ed-mk" style={{ left: '88%', background: 'var(--brass-dk)' }} />
              <div className="ed-mktop" style={{ left: '86%', color: 'var(--brass)' }}>0.1758354 candidate</div>
              <div className="ed-mk" style={{ left: '100%', background: 'var(--terra)' }} />
              <div className="ed-mkcap ed-mkedge-r" style={{ color: 'var(--terra-dk)' }}>0.20 · Platt–Trudgian</div>
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
        <Link className="ed-kpi ed-kpi-link" to="/lambda-0116091"><b style={{ color: 'var(--brass-dk)' }}>0.116091</b><span>Λ value, conditional on two unrefereed results</span></Link>
        <Link className="ed-kpi ed-kpi-link" to="/route-map"><b>{FULL_ROUTE_MAP.totalRoutes}</b><span>routes mapped</span></Link>
        <Link className="ed-kpi ed-kpi-link" to="/no-gos"><b style={{ color: 'var(--terra-dk)' }}>{ZETAEXPLORER_NO_GOS.length}</b><span>no-go theorems</span></Link>
        <Link className="ed-kpi ed-kpi-link" to="/results"><b>{RESULTS_COUNT}</b><span>graded results</span></Link>
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
            <h3>Shifted de Branges kernel</h3>
            <div className="eq"><InlineMath tex="K_a^{\mathrm{dB}}(w,z) \succeq 0" /></div>
            <p>Full Gram-kernel positivity confines every zero to the width-a central strip. The raw antisymmetric shear is only one indefinite factor, not the positive object by itself.</p>
            <Link to="/hidden-square-program">/hidden-square-program →</Link></div>
          <div className="ed-step"><span className="num">STEP 3</span>
            <div className="ed-stepfig"><WireframeAnim kind="wave" /></div>
            <h3>The a-dial</h3>
            <div className="eq"><InlineMath tex="T3(a)\ \forall a>0 \iff \mathrm{RH}" /></div>
            <p>Shrink the shift a→0 and the strip closes to the line. E_a = A_a − iB_a = Ξ(z+ia), verified.</p>
            <Link to="/shift-bridge-positivity">/shift-bridge-positivity →</Link></div>
        </div>
      </section></div>

      {/* START HERE — three audience doors (reorg #5) */}
      <div className="ed-full"><section className="ed-sec" style={{ paddingTop: 26, paddingBottom: 6 }}>
        <div className="ed-lbl" style={{ marginBottom: 10 }}>start here</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }} className="ed-map">
          <Link className="ed-tile" to="/guide">
            <h3>I&rsquo;m new &mdash; what is RH?</h3>
            <p>A plain-language on-ramp: what the hypothesis says, why it matters, why it is hard, every line of attack, and exactly where each one stops.</p>
          </Link>
          <Link className="ed-tile" to="/results">
            <h3>I want the mathematics</h3>
            <p>Every result, graded by verification level — kernel-verified Lean theorems, refereed proofs, certified computations, candidates, and the negative results.</p>
          </Link>
          <Link className="ed-tile" to="/threads">
            <h3>I want the story</h3>
            <p>Nine research threads as dated narratives — each claim, verdict, and pivot from the weld ladder to the y-thaw to the program's derived floor.</p>
          </Link>
          <Link className="ed-tile" to="/frontier-dag">
            <h3>Show me the frontier</h3>
            <p>The live dependency graph: every named open object, what gates what, and exactly what closes if each one lands.</p>
          </Link>
        </div>
      </section></div>

      {/* zeta itself, live — the lead demo: the actual object of study */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">interactive</div><h2>ζ itself, live</h2></div>
          <p>The zeta function over the critical strip — hue is phase, the rainbow vortices are the first
          nontrivial zeros, and the twin-ladder interferometer breathes across the σ ↔ 1−σ mirror. For the
          full 3D geometry, open the <Link to="/viz-twistor-dual-intertwiner">twistor–dual–intertwiner explorer</Link>.</p></div>
        <Suspense fallback={<div className="ed-mono" style={{ color: 'var(--faint)', padding: '40px 0' }}>Computing ζ…</div>}>
          <ZetaStripLive height={430} />
        </Suspense>
      </section></div>

      {/* interactive twin-ladder explorer */}
      <div className="ed-full"><section className="ed-sec">
        <div className="ed-shead"><div><div className="ed-lbl">interactive</div><h2>The twin ladder, live</h2></div>
          <p>Drag the shift a and inspect the finite shear comparison. This is a diagnostic, not a positivity certificate.</p></div>
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
          <p>Bounds, models, walls, and no-gos. Each opens its own page. <Link to="/key-results">Key results →</Link> · <Link to="/threads">Research threads →</Link></p></div>
        <div className="ed-map">
          {FINDINGS.map((f, fi) => (
            <Link key={f.title} className="ed-tile" to={f.to}>
              <div className="ed-tmeta">
                {f.isNew && <span className="ed-new" />}
                <GradeChip grade={f.grade} />
                <span>{f.date}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{findingDescs[fi]}</p>
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
        <div className="ed-lbl" style={{ marginBottom: 12 }}>status · as of {PROGRAM_STATUS_AS_OF}</div>
        <div className="ed-verdict">RH is open: it requires Λ ≤ 0. The smallest value recorded here is
          Λ ≤ 0.116091488672439, conditional on two unrefereed results (the zero-free half-plane Re s &gt; 7/8 and
          D. J. Raymond’s decreasing-barrier chain), on the Platt–Trudgian verified height and on internal
          certificates; it is not an established bound. The 0.1758354 and 0.1787854 candidates for an unconditional
          bound are computer-assisted and unrefereed; the 0.14 value is a conditional completion contract, not a
          bound. Every direct attempt at RH recorded here failed, and the failures are collected in one obstruction
          map.</div>
        <div style={{ marginTop: 10, fontSize: 14 }}>
          <Link to="/state-of-program">State of the program — each statement with its source file →</Link>
        </div>
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

      <div className="ed-foot">exploreriemann · Riemann Hypothesis via the de Bruijn–Newman constant Λ · Jude Gomila · <a href="https://github.com/judegomila/zeta-explorer" target="_blank" rel="noreferrer">GitHub repo ↗</a></div>
    </div>
  );
}
