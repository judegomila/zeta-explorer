import React from 'react';
import { Link } from 'react-router-dom';
import PostLayout, { TheoremBox, Figure, Pull, BlockMath, InlineMath } from '../components/editorial/PostLayout.jsx';
import ConceptTerm from '../components/ConceptTerm.jsx';
import ConceptText from '../components/ConceptText.jsx';
import { ED, V, STATUS } from '../styles/tokens.js';
import { OPENAI_MATH_INTEGRATION as OAI } from '../data/openai-math-integration-2026-10-08.js';
import { QRH_PATH_PUSH as QP } from '../data/qrh-path-push-2026-10-08.js';
import { QRH_THETA_IMPROVEMENT as QT } from '../data/qrh-theta-and-improvement-2026-10-08.js';
import { QRH_LAMBDA_LEAN as QL } from '../data/qrh-lambda-lean-2026-10-09.js';

/* Λ ≤ 0.116091 from the 7/8 zero-free half-plane (openai/math family 003).
   Read interface for src/data/openai-math-integration-2026-10-08.js and
   src/data/qrh-path-push-2026-10-08.js. Every number on this page is read from
   those modules. Computer-assisted upper bound depending on two unrefereed results;
   not peer reviewed; PT Λ ≤ 0.2 stands. Route: /lambda-0116091. */

const REPO = 'https://github.com/judegomila/zeta-explorer/blob/main';
const PAPER_URL = `${REPO}/papers/lambda-qrh-0.116091/README.md`;
const NOTE_URL = `${REPO}/formalization/paper/lambda-qrh-note-draft.md`;
const LEAN_VERIFY_URL = `${REPO}/formalization/external/openai-math-qrh-verification.md`;
const RAYMOND_CORE_URL = `${REPO}/formalization/lean/raymond-core/README.md`;
const QRH_LEAN_URL = `${REPO}/formalization/lean/qrh-lambda/README.md`;
const OAI_REPO = OAI.source.repo;
const RAYMOND_ZENODO = 'https://zenodo.org/records/22867547';

const OV = OAI.values;
const PV = QP.values;
const R = QP.premiseRecheck;
const TH = QT.theta;
const IA = QT.improvement.A;
const IB = QT.improvement.B;
const THETA_ROWS = ['7/8', '43/50', '17/20', '21/25', '41/50', '4/5', '39/50', '3/4', '7/10', '13/20', '3/5', '11/20', '13/25', '101/200'];
// Zero-free half-plane claims at or below 7/8 (arXiv abstracts checked 2026-11-04). None refereed.
const BELOW_78_CLAIMS = [
  { source: 'openai/math family 003', href: OAI_REPO, theta: '7/8 = 0.875', basis: 'cubic-theta argument; Lean proof (re-built here)', status: 'preprint, Lean', kind: 'external' },
  { source: 'B. Liu, arXiv:2610.12234', href: 'https://arxiv.org/abs/2610.12234', theta: '0.874957019…', basis: 'parameter re-tuning of the same argument; proved optimal within that exponent system; reported Lean-formalized', status: 'preprint', kind: 'external' },
  { source: 'Y. Xu, H. Sang, arXiv:2610.15291', href: 'https://arxiv.org/abs/2610.15291', theta: '0.8748867', basis: 'amplified moments; conditional on the analytic inputs of the OpenAI work. This project re-derived the ceiling of that system (src/data/zero-free-campaign-2026-11-01.js): B*(κ) is increasing in κ, B*(3/4) = 49619/53814 − √715621/17938 ≈ 0.8748870 and B*(29991/40000) ≈ 0.874886650; PR #14 value 0.87488665 is within 4·10⁻¹⁰ of it', status: 'preprint, conditional', kind: 'conditional' },
  { source: 'B. Liu, arXiv:2610.26835', href: 'https://arxiv.org/abs/2610.26835', theta: '≈ 0.874886647', basis: 'extension to finite-order Hecke L-functions over every number field, with an added averaged numerator estimate; builds on the three entries above', status: 'preprint', kind: 'external' },
];
const thetaDec = (t) => { const [a, b] = t.split('/').map(Number); return (a / b).toFixed(3).replace(/0+$/, '').replace(/\.$/, ''); };

// ── small presentational helpers (tokens only) ─────────────────────────────
const tbl = { width: '100%', borderCollapse: 'collapse', fontSize: 14.5, margin: '18px 0 26px' };
const th = {
  textAlign: 'left', fontFamily: 'var(--ed-mono)', fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase',
  color: V.inkFaint, fontWeight: 600, padding: '8px 10px', borderBottom: `1px solid ${V.rule}`, verticalAlign: 'bottom',
};
const td = { padding: '8px 10px', borderBottom: `1px solid ${V.ruleSoft}`, verticalAlign: 'top', color: V.ink };
const mono = { fontFamily: 'var(--ed-mono)', fontSize: 13.5, whiteSpace: 'nowrap' };
const pre = {
  fontFamily: 'var(--ed-mono)', fontSize: 12.5, lineHeight: 1.55, background: V.paper2, border: `1px solid ${V.ruleSoft}`,
  borderRadius: 8, padding: '14px 16px', overflowX: 'auto', margin: '14px 0 26px', color: V.ink, whiteSpace: 'pre',
};

const STAT = {
  proved: STATUS.proved, certified: STATUS.certified, conditional: STATUS.conditional, measured: STATUS.measured,
  external: STATUS.candidate, internal: STATUS.open, peer: STATUS.proved, none: STATUS.neutral,
};
function Tag({ kind, children }) {
  const s = STAT[kind] || STATUS.neutral;
  return (
    <span style={{
      display: 'inline-block', fontFamily: 'var(--ed-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '.06em',
      textTransform: 'uppercase', padding: '2px 8px', borderRadius: 999, background: s.vTint, color: s.v, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// ── data rows (all values read from the modules) ───────────────────────────
const QLF = QL.values.F2;
const QLR = QL.values.R78;
const LEAN_STATUS = [
  { piece: 'Zero-free half-plane Re s > 7/8', kind: 'external', status: 'Lean proof (openai/math), used as a theorem', note: 'kernel-checked in the local build, standard axioms only; comparator and leanchecker not run on its closure; not peer-reviewed' },
  { piece: 'Start condition (Im z)² ≤ 9/16 at t = 10⁻⁸', kind: 'proved', status: 'proved in Lean', note: 'start78 / start78_of_zeroFree, via RaymondCore.Substitution.substitution' },
  { piece: 'Strict entry (S1), barrier step, terminal step, checker soundness', kind: 'proved', status: 'proved in Lean', note: 'barrier_step from first_contact + contact_exclusion; terminal via LeanCert H_forward_strip and real_zeros_iff_Lambda_le' },
  { piece: `F2 iteration (${QLF.substeps.toLocaleString('en-US')} substeps)`, kind: 'certified', status: 'decide +kernel', note: `${QLF.chunks} chunk theorems + frame; U = ${QLF.dec} computed by the kernel` },
  { piece: `Raymond-chain iteration (${QLR.substeps.toLocaleString('en-US')} substeps)`, kind: 'certified', status: 'decide +kernel', note: `${QLR.chunks} chunk theorems + frame; U = ${QLR.dec}` },
  { piece: 'Head wall (W), incl. PT RH verification to 3.0001753·10¹²', kind: 'conditional', status: 'hypothesis: head_wall', note: 'AF §§2–3; PT used once at t = 0' },
  { piece: 'First contact (FC)', kind: 'conditional', status: 'hypothesis: first_contact', note: 'Polymath15 Thm 1.5(i), Hurwitz, (W) at the wall' },
  { piece: 'Contact exclusion (CE), AF (11.1)', kind: 'conditional', status: 'hypothesis: contact_exclusion', note: 'zero dynamics, (10.1) summed over the other zeros, self-pair cap, Hermite splitting' },
  { piece: `Floor tables (J): F2 ${QLF.floorEntries}, Raymond ${QLR.floorEntries} entries`, kind: 'conditional', status: 'hypothesis: floors_valid', note: 'Arb producers, AF (4.6), G0-c, route-3 MP, multi-height licence; 89 r2 entries rest on a measured 0.0023 allowance and the unreviewed L-slope lemma' },
  { piece: `Kernel rows (K): F2 ${QLF.kernelRows}, Raymond ${QLR.kernelRows}`, kind: 'conditional', status: 'hypothesis: kernels_valid', note: 'exact Bernstein certificates in Python' },
];

const LADDER = [
  { label: 'de Bruijn from the 7/8 half-plane alone', start: '7/8', val: OV.deBruijn78.dec, exact: OV.deBruijn78.exact, kind: 'conditional', note: 'Lemma 1 at t = (2θ−1)²/2; needs no verified height' },
  { label: 'Raymond chain, classical strip (control)', start: 'θ = 1', val: OV.raymondStrip.dec, exact: OV.raymondStrip.exact, kind: 'conditional', note: 'reproduces Raymond’s deposit (stated 0.149396); depends on G0 + PT' },
  { label: 'route P single band, classical strip', start: 'θ = 1', val: OV.routePStrip.dec, exact: OV.routePStrip.exact, kind: 'conditional', note: 'reference; single run' },
  { label: 'Raymond chain, 11/12 start', start: '11/12', val: OV.raymond1112.dec, exact: OV.raymond1112.exact, kind: 'conditional', note: 'q0 = 25/36 + 2·10⁻⁶' },
  { label: 'route P single band, 11/12 start', start: '11/12', val: OV.routeP1112.dec, exact: OV.routeP1112.exact, kind: 'conditional', note: 'route-P ledger added; not re-tuned' },
  { label: 'Raymond chain, 7/8 start — value (i)', start: '7/8', val: PV.raymond78.dec, exact: PV.raymond78.exact, kind: 'conditional', note: 'q0 = 9/16 + 2·10⁻⁶; 60,675 substeps; two implementations agree' },
  { label: 'route P single band, 7/8 start, first run', start: '7/8', val: OV.routeP78.dec, exact: OV.routeP78.exact, kind: 'conditional', note: 'levers tuned on the old trajectory' },
  { label: 'route P re-tuned on the 7/8 path — value (ii)', start: '7/8', val: PV.F2.dec, exact: PV.F2.exact, kind: 'conditional', note: `${QP.run.steps.toLocaleString('en-US')} substeps, terminal cell ${QP.run.terminalCell}, 0 failures` },
];

const RUNGS = [
  { k: 'baseline', lever: 'first 7/8 run (start offset 2·10⁻⁶)' },
  ...QP.ladder.map((s, i) => ({ k: ['E1', 'E2', 'E3', 'E4', 'F1', 'F2'][i], lever: s.lever, delta: s.delta })),
];

const DEPS = [
  { item: <>(Z<sub>7/8</sub>) ζ(s) ≠ 0 for Re s &gt; 7/8</>, used: '(i), (ii), 9/32', kind: 'external', status: 'openai/math family 003, written by an internal OpenAI model. Lean proof re-built locally: axioms propext, Classical.choice, Quot.sound; statement equal to the comparator challenge. Official comparator and an independent kernel re-check not run. Not peer-reviewed.' },
  { item: 'Lemma 1 (half-plane → strip, de Bruijn propagation)', used: 'all', kind: 'proved', status: 'de Bruijn 1950 Thm 13, Polymath15 Thm 3.2; also proved in Lean (RaymondCore.Substitution.substitution).' },
  { item: 'Lemma 2 (start substitution in the barrier chain) = Lemma S(θ) + Lemma FB(θ)', used: '(i), (ii)', kind: 'internal', status: 'written proof; internal reviews A and B; no reader outside the project.' },
  { item: '(PT) RH for 0 < γ ≤ 3000175332800', used: '(i), (ii)', kind: 'peer', status: 'Platt–Trudgian 2021, peer-reviewed. Used once, as the head condition at t = 0.' },
  { item: 'Raymond AF Part I §§2–5 (wall, Abel transfer, remainders)', used: '(i), (ii)', kind: 'internal', status: 'internal review A: no ERROR; expository gaps with written fixes (Lemma W, Lemma B.3, uniformity table).' },
  { item: 'Raymond main paper Lemmas 2–3, Theorem 4 / 4′ (G0-c joint floors)', used: '(i), (ii)', kind: 'internal', status: 'internal review A: sound; G0-c has no reader outside the project.' },
  { item: 'Raymond AF Part I §§6–12 (start, first contact, terminal step)', used: '(i), (ii)', kind: 'internal', status: 'internal review B: no ERROR; gaps B1 (start written for q0 > 1) and B2 (first contact) fixed in text.' },
  { item: 'Lemma CG (G0-a) and Lemma R', used: '(i), (ii)', kind: 'proved', status: 'Lean (raymond-core): covering identity, CG1/CG2 monotonicity, Lemma R integration step and ε_R < 10⁻¹⁰. AF (4.6) Stirling bounds enter as hypotheses.' },
  { item: 'floor tables at PT height, kernel catalogue', used: '(i), (ii)', kind: 'certified', status: 'Arb, two precision lanes, regenerated bit-identically from Raymond’s code; kernels by exact Bernstein certificates, re-certified with separate code.' },
  { item: 'route-P ledger: r2 structured floors, WOL-C outer lemma, time-box allowance, r2 L-slope lemma', used: '(ii) only', kind: 'internal', status: `project-internal, single engine, internal referee; ${QP.run.provenance.r2Structured.toLocaleString('en-US')} substeps; L-slope lemma not reviewed.` },
  { item: 'route-P ledger: route-3 joint floors (Theorem MP)', used: '(ii) only', kind: 'internal', status: `written, internal referee; ${QP.run.provenance.route3Joint.toLocaleString('en-US')} substeps; joint-pair and Track-A gain code single-implementation.` },
  { item: 'Track-A joint floors at re-tuned heights, 79 new r = 3/5 kernels', used: '(ii) only', kind: 'certified', status: `${QP.run.provenance.xOptionsTrackA.toLocaleString('en-US')} substeps; G0-d family checks 0 failures; all 289 used cells and the 79 kernels re-certified by a second method (internal referee).` },
  { item: '(5.4), k > 0, h·v0 > 2 at every height used on (ii)', used: '(ii) only', kind: 'certified', status: `rechecked in 256-bit Arb: ${R.triples} (cell, height, source) triples, ${R.failures} failures; min k ${R.minima.k.value.toFixed(3)}, min h·v0 ${R.minima.hv0.value.toFixed(2)}.` },
];

const CREDITS = [
  ['D. J. Raymond', 'Correlated translated probes and the bound Λ < 0.149396, and Analytic foundations for the time-zero upper-bound construction, v1.0, 21 Sep 2026 (Zenodo 22867547). The decreasing-barrier method, probe floors, kernel catalogue and consumer arithmetic used for both values are his; this page changes the start and, for (ii), adds the route-P floors and kernels.'],
  ['openai/math, family 003', 'The Quasi-Riemann Hypothesis (manuscript of 30 Sep 2026, Lean theorem OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re; alternate 11/12 writeup of 5 Oct 2026), released 6 Oct 2026. The release states that the manuscripts were written by an internal OpenAI model and that unformalized results may contain errors.'],
  ['D. J. Platt and T. S. Trudgian', 'The Riemann hypothesis is true up to 3·10¹², Bull. London Math. Soc. 53 (2021). Hypothesis (PT), and the accepted bound Λ ≤ 0.2.'],
  ['D. H. J. Polymath (Polymath15)', 'Effective approximation of heat flow evolution of the Riemann ξ function, and a new upper bound for the de Bruijn–Newman constant, Res. Math. Sci. 6 (2019). Normalisation of H_t, Theorems 1.3, 1.5, 3.2, Proposition 3.1 and the barrier framework.'],
  ['N. G. de Bruijn', 'The roots of trigonometric integrals, Duke Math. J. 17 (1950). Theorem 13 (strip contraction under the heat flow), used in Lemma 1.'],
  ['B. Rodgers and T. Tao', 'The de Bruijn–Newman constant is non-negative, Forum Math. Pi 8 (2020). Λ ≥ 0, so an upper bound on Λ limits how far RH can fail; it does not prove RH.'],
];

const REPRO = `# (a) Lean check of the 7/8 half-plane (openai/math, lean/ directory)
cd /tmp/qrh-verify/lean      # or a fresh clone of github.com/openai/math + lake update
LEAN_NUM_THREADS=4 lake build +OAI.NumberTheory.DirichletL.Nonvanishing
lake env lean /tmp/qrh-verify/check/SolutionType.lean   # statement + #print axioms
lake env lean /tmp/qrh-verify/check/ChallengeType.lean  # comparator statement (Mathlib only)

# (b) value (i): Raymond chain with the 7/8 start (about 70 s)
.venv-arb/bin/python tmp/oai-lambda-raymond.py OUT.json X1 --thetas 7/8

# (c) value (ii): re-tuned route-P consumer (about 11 min) + step verifier (about 1 min)
cd tmp && XK=qrh-tune-out/xkernels_final.json KK=qrh-tune-out/xkernels_final.json \\
  ./qrh-tune-final.sh F2_repro 1/10000000 W4 m097 m094 m091 QA_m0.88 QB_m0.91 QC_cliff

# (d) from-scratch step verifier (no code shared with (c))
cd tmp && ./qrh-ref-run.sh refverify /tmp/qrh-tune-dump-F2_repro F2_repro_refverify

# (e) Lean: substitution lemma, Lemma CG, Lemma R
cd formalization/lean/raymond-core && lake build RaymondCore && lake env lean scripts/AxiomsCheck.lean`;

// ── number line figure: 0.10 … 0.30 ────────────────────────────────────────
function LadderFigure() {
  const lo = 0.10, hi = 0.30, x0 = 30, x1 = 610;
  const X = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  const pts = [
    { v: 0.2, lab: 'PT 0.2 (accepted)', c: ED.ink, up: true },
    { v: Number(OV.deBruijn78.dec), lab: '9/32 (half-plane alone)', c: ED.inkFaint, up: true },
    { v: Number(OV.raymondStrip.dec), lab: 'Raymond strip 0.149395', c: ED.series1, up: true },
    { v: Number(OV.raymond1112.dec), lab: '11/12: 0.129826', c: ED.brass, up: false },
    { v: Number(PV.raymond78.dec), lab: '7/8: 0.118506', c: ED.series3, up: true },
    { v: Number(PV.F2.dec), lab: 're-tuned 0.116091', c: ED.accent, up: false },
  ];
  return (
    <svg width="100%" viewBox="0 0 640 150" role="img" aria-label="Number line of the Λ values of the argument against PT 0.2">
      <line x1={x0} y1="78" x2={x1} y2="78" stroke={ED.rule} strokeWidth="1.5" />
      {[0.10, 0.15, 0.20, 0.25, 0.30].map((t) => (
        <g key={t}>
          <line x1={X(t)} y1="74" x2={X(t)} y2="82" stroke={ED.rule} />
          <text x={X(t)} y="140" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill={ED.inkFaint}>{t.toFixed(2)}</text>
        </g>
      ))}
      {pts.map((p, i) => {
        const yLab = p.up ? (i % 2 ? 30 : 48) : (i % 2 ? 112 : 124);
        return (
          <g key={p.lab}>
            <circle cx={X(p.v)} cy="78" r="4.5" fill={p.c} />
            <line x1={X(p.v)} y1={p.up ? 72 : 84} x2={X(p.v)} y2={p.up ? yLab + 4 : yLab - 10} stroke={p.c} strokeWidth="0.8" />
            <text x={X(p.v)} y={yLab} textAnchor={p.v < 0.125 ? 'start' : 'middle'} fontFamily="IBM Plex Mono" fontSize="10" fill={p.c}>{p.lab}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Λ(θ) figure: conditional Λ at PT height against the zero-free abscissa θ ──
function ThetaFigure() {
  const tx0 = 0.5, tx1 = 0.9, ly0 = 0, ly1 = 0.3, L = 56, Rr = 620, Tp = 16, B = 196;
  const X = (t) => L + ((t - tx0) / (tx1 - tx0)) * (Rr - L);
  const Y = (v) => B - ((v - ly0) / (ly1 - ly0)) * (B - Tp);
  const ray = TH.raymondPT.map((r) => [Number(r.theta.split('/')[0]) / Number(r.theta.split('/')[1]), Number(r.dec)]).sort((a, b) => a[0] - b[0]);
  const rp = TH.routePPT.map((r) => [Number(r.theta.split('/')[0]) / Number(r.theta.split('/')[1]), Number(r.dec)]);
  const db = []; for (let t = 0.5; t <= 0.9001; t += 0.005) { const v = (2 * t - 1) ** 2 / 2; if (v <= ly1) db.push([t, v]); }
  const path = (pts) => pts.map(([t, v], i) => `${i ? 'L' : 'M'}${X(t).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  return (
    <svg width="100%" viewBox="0 0 640 236" role="img" aria-label="Conditional Λ at Platt–Trudgian height against the zero-free abscissa θ">
      <line x1={L} y1={B} x2={Rr} y2={B} stroke={ED.rule} />
      <line x1={L} y1={Tp} x2={L} y2={B} stroke={ED.rule} />
      {[0.5, 0.6, 0.7, 0.8, 0.875].map((t) => (
        <g key={t}><line x1={X(t)} y1={B} x2={X(t)} y2={B + 4} stroke={ED.rule} />
          <text x={X(t)} y={B + 16} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill={ED.inkFaint}>{t === 0.875 ? '7/8' : t.toFixed(1)}</text></g>
      ))}
      {[0, 0.1, 0.2, 0.3].map((v) => (
        <g key={v}><line x1={L - 4} y1={Y(v)} x2={L} y2={Y(v)} stroke={ED.rule} />
          <text x={L - 8} y={Y(v) + 3} textAnchor="end" fontFamily="IBM Plex Mono" fontSize="10" fill={ED.inkFaint}>{v.toFixed(1)}</text></g>
      ))}
      <text x={Rr} y={B + 30} textAnchor="end" fontFamily="IBM Plex Mono" fontSize="10" fill={ED.inkFaint}>θ (zero-free for Re s &gt; θ)</text>
      <line x1={L} y1={Y(0.2)} x2={Rr} y2={Y(0.2)} stroke={ED.ink} strokeDasharray="2 3" />
      <text x={L + 6} y={Y(0.2) - 5} fontFamily="IBM Plex Mono" fontSize="10" fill={ED.ink}>PT 0.2 (accepted, peer reviewed)</text>
      <path d={path(db)} fill="none" stroke={ED.inkFaint} strokeDasharray="5 4" />
      <text x={X(0.83)} y={Y(0.2) + 16} fontFamily="IBM Plex Mono" fontSize="10" fill={ED.inkFaint}>(2θ−1)²/2</text>
      <path d={path(ray)} fill="none" stroke={ED.series3} strokeWidth="1.8" />
      {ray.map(([t, v]) => <circle key={t} cx={X(t)} cy={Y(v)} r="2.6" fill={ED.series3} />)}
      {rp.map(([t, v]) => <circle key={t} cx={X(t)} cy={Y(v)} r="3.6" fill="none" stroke={ED.accent} strokeWidth="1.6" />)}
      <text x={X(0.885)} y={Y(0.112)} fontFamily="IBM Plex Mono" fontSize="10" fill={ED.series3}>Raymond</text>
      <text x={X(0.82)} y={Y(0.06)} fontFamily="IBM Plex Mono" fontSize="10" fill={ED.accent}>○ route P</text>
    </svg>
  );
}

export default function LambdaQrhConditionalPage() {
  const gain = (Number(PV.raymond78.dec) - Number(PV.F2.dec)).toFixed(6);
  return (
    <PostLayout
      grade="CANDIDATE"
      meta={[QP.date, 'computer-assisted', 'not peer reviewed']}
      title={<>Λ ≤ 0.116091 from a zero-free half-plane</>}
      dek={<>A zero-free half-plane Re s &gt; 7/8 lowers the time-zero start of Raymond&rsquo;s decreasing-barrier chain from (Im z)² ≤ 1 to (Im z)² ≤ 9/16. Run at Platt–Trudgian height, the chain then ends at 0.118506, and the re-tuned route-P stack at 0.116091. The 7/8 half-plane is the claim of openai/math family 003; its Lean proof re-builds here. Not yet peer reviewed; the accepted bound remains Λ ≤ 0.2.</>}
      byline={['Barrier program · zetaexplorer', 'computer-assisted · not peer reviewed']}
      ticker={<span>candidate · Λ ≤ <b>&nbsp;0.116091</b></span>}
      footer={<>Work in progress. Draft, not peer reviewed. The bound depends on two unrefereed results. Draft paper: <a href={PAPER_URL} target="_blank" rel="noreferrer">papers/lambda-qrh-0.116091</a> · Draft note: <a href={NOTE_URL} target="_blank" rel="noreferrer">lambda-qrh-note-draft.md</a> (not submitted) · Related: <Link to="/lambda-bounds">the bounds ledger</Link> · <Link to="/lambda-01758354-candidate">Λ ≤ 0.1758354 candidate</Link> · <Link to="/routes-roadmap">routes roadmap</Link><br /><br />← <Link to="/">the atlas</Link></>}
    >
      <p className="lead">The <ConceptTerm slug="de-bruijn-newman-constant">de Bruijn–Newman constant</ConceptTerm> Λ is the least t at which every zero of the heat-flowed function <ConceptTerm slug="heat-flow-ht">H<sub>t</sub></ConceptTerm> is real; <ConceptTerm slug="riemann-hypothesis">RH</ConceptTerm> ⇔ Λ = 0, <ConceptTerm slug="newman-conjecture">Rodgers–Tao</ConceptTerm> proved Λ ≥ 0, and <ConceptTerm slug="platt-trudgian-verified-height">Platt–Trudgian</ConceptTerm> give the accepted bound Λ ≤ 0.2. This page records the upper bound <InlineMath tex="\Lambda \le 0.116091488672439" /> obtained by starting Raymond&rsquo;s barrier chain from a zero-free half-plane.</p>

      <p style={{ padding: '12px 16px', border: `1px solid ${V.rule}`, borderRadius: 8, background: V.paper2, fontSize: 15.5 }}><b>Status.</b> A computer-assisted upper bound. It depends on two recent results that have not been refereed: the zero-free half-plane Re s &gt; 7/8 (<a href={OAI_REPO} target="_blank" rel="noreferrer">openai/math</a> family 003, whose Lean proof was rebuilt here with standard axioms only) and D. J. Raymond&rsquo;s decreasing-barrier construction (<a href={RAYMOND_ZENODO} target="_blank" rel="noreferrer">Zenodo 10.5281/zenodo.22867547</a>). The value 0.116091 also uses this project&rsquo;s internal floor and kernel certificates; without them the same argument gives 0.118506. Not yet peer reviewed. The accepted peer-reviewed bound remains Λ ≤ 0.2 (Platt–Trudgian). RH is open.</p>

      <TheoremBox label="Theorem (from hypotheses Z₇/₈, G0, PT, L)">
        <p style={{ marginBottom: 10 }}>Assume</p>
        <ul style={{ margin: '0 0 12px 18px', padding: 0, fontSize: 16 }}>
          <li><b>(Z<sub>7/8</sub>)</b> ζ(s) ≠ 0 for Re s &gt; 7/8;</li>
          <li><b>(G0)</b> the analytic statements of D. J. Raymond&rsquo;s <ConceptTerm slug="decreasing-zero-height-barrier">decreasing-barrier</ConceptTerm> construction, with the written fixes Lemma W, Lemma S(θ), Lemma FB(θ);</li>
          <li><b>(PT)</b> RH for 0 &lt; γ ≤ 3000175332800.</li>
        </ul>
        <p style={{ marginBottom: 10 }}>Then (i) Λ ≤ 118505710922701/10<sup>15</sup> = <b style={mono}>{PV.raymond78.dec}</b>.</p>
        <p>If in addition <b>(L)</b> the <ConceptTerm slug="route-p">route-P</ConceptTerm> ledger holds, then (ii) Λ ≤ 116091488672439/10<sup>15</sup> = <b style={mono}>{PV.F2.dec}</b>.</p>
      </TheoremBox>

      <p>Each input is needed: without (Z<sub>7/8</sub>) the chain gives Raymond&rsquo;s 0.149395; without (G0) or (PT) the argument gives nothing below 0.2 (the half-plane alone gives 9/32); without (L), (ii) reduces to (i). (Z<sub>7/8</sub>) and (G0) are claimed proofs that have not been refereed, (PT) is peer reviewed, and (L) is internal to this project. The result does not bear on RH itself.</p>

      <h2>The substitution lemma</h2>
      <p>A zeta zero ρ = β + iγ is the zero z = 2γ − i(2β − 1) of H<sub>0</sub>, so |Im z| = |2β − 1|. A zero-free half-plane bounds β above, the functional equation ξ(s) = ξ(1 − s) bounds it below, and de Bruijn&rsquo;s theorem carries the strip forward in t.</p>

      <TheoremBox label="Lemma 1 (zero-free half-plane → strip, propagated)">
        <p>Let 1/2 ≤ θ &lt; 1 and assume ζ(s) ≠ 0 for Re s &gt; θ. Then for every t ≥ 0 every zero z of H<sub>t</sub> satisfies</p>
        <BlockMath tex="(\operatorname{Im} z)^2 \;\le\; \max\!\big((2\theta-1)^2 - 2t,\; 0\big)." />
        <p>For θ = 7/8 the time-zero strip is (Im z)² ≤ 9/16, and at t = 9/32 all zeros are real: Λ ≤ 9/32 from the half-plane alone.</p>
      </TheoremBox>

      <p><em>Proof.</em> Zeros of H<sub>0</sub> are the nontrivial zeros of ζ, with Im z = 1 − 2β. By hypothesis β ≤ θ; since 1 − ρ is also a zero, 1 − β ≤ θ, so |1 − 2β| ≤ 2θ − 1. The propagation in t is de Bruijn 1950, Theorem 13 (Polymath15 Theorem 3.2 with t<sub>0</sub> = 0, y<sub>0</sub> = 2θ − 1). ∎ The lemma is proved in Lean as <code>RaymondCore.Substitution.substitution</code>; the unclamped form holds for 0 ≤ 2t ≤ (2θ − 1)².</p>

      <p>9/32 = 0.28125 is above 0.2, so the half-plane alone gives nothing new. It becomes useful as the start of a barrier chain. In Raymond&rsquo;s chain the time-zero zero location is read in one place only: the barrier start q<sub>0</sub> must exceed sup (Im z)² over zeros with Re z &gt; X, with strict entry on the first substep. <b>Lemma 2</b> (Lemma S(θ) + Lemma FB(θ), internal reviews A and B) replaces q<sub>0</sub> &gt; 1 by q<sub>0</sub> &gt; (2θ − 1)², with the strict-entry check</p>
      <BlockMath tex="(S1)\qquad q_0 - (2 + c_0 q_0)\cdot 10^{-8} \;>\; (2\theta-1)^2 ." />
      <p>Floors, kernel certificates and the head wall are unchanged; the barrier path is recomputed from the lower start. For value (ii), q<sub>0</sub> = 9/16 + 10<sup>−7</sup> and the S1 margin is 1.808·10<sup>−8</sup>. Any decreasing-barrier chain of this type admits the same substitution; Raymond&rsquo;s own chain with the 7/8 start gives value (i) with no project-specific input.</p>

      <h2>The ladder of values</h2>
      <Figure caption={<>Values at Platt–Trudgian height against the accepted bound 0.2. Every marker below 0.2 depends on (G0) and (PT); the 7/8 and 11/12 markers also depend on the corresponding half-plane.</>}>
        <LadderFigure />
      </Figure>

      <div className="ed-breakout">
        <table style={tbl}>
          <thead><tr><th style={th}>chain and start</th><th style={th}>start</th><th style={th}>value</th><th style={th}>exact</th><th style={th}>note</th></tr></thead>
          <tbody>
            {LADDER.map((r) => (
              <tr key={r.label}>
                <td style={td}>{r.label}</td>
                <td style={{ ...td, ...mono }}>{r.start}</td>
                <td style={{ ...td, ...mono, fontWeight: 600 }}>{r.val ?? '0.347222…'}</td>
                <td style={{ ...td, ...mono, fontSize: 12, color: V.inkSoft }}>{r.exact}</td>
                <td style={{ ...td, fontSize: 13.5, color: V.inkSoft }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>The zero-free start does most of the work: on Raymond&rsquo;s chain alone it moves the value from 0.149395 to 0.118506 (−0.0309). Re-tuning the route-P stack on the lower 7/8 path adds a further −{gain} (value (i) − value (ii)). The re-tune, one exact run per rung (the final value is computed directly, not by adding gains):</p>

      <div className="ed-breakout">
        <table style={tbl}>
          <thead><tr><th style={th}>rung</th><th style={th}>change</th><th style={th}>value</th><th style={th}>step (exact)</th></tr></thead>
          <tbody>
            {RUNGS.map((r) => {
              const v = r.k === 'baseline' ? PV.baseline : PV[r.k];
              return (
                <tr key={r.k}>
                  <td style={{ ...td, ...mono }}>{r.k}</td>
                  <td style={td}>{r.lever}</td>
                  <td style={{ ...td, ...mono, fontWeight: r.k === 'F2' ? 700 : 400 }}>{v.dec}</td>
                  <td style={{ ...td, ...mono, fontSize: 12, color: V.inkSoft }}>{r.delta || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p>About 74% of the gain comes from Track-A floors at lowered heights in cells 0–250 (height sets 0.88×, 0.91× and the per-cell moment-cap set), 24.5% from route-9 tables with r = 3/5 kernels, 1.2% from 79 new kernels. Going lower in height needs a larger producer head (moment cap C &lt; 17/5), which is an AF/G0 premise.</p>

      <p>With the 11/12 half-plane (the alternate writeup in the same family) the values are {OV.raymond1112.dec} (Raymond chain) and {OV.routeP1112.dec} (route P, not re-tuned); the half-plane alone gives 25/72 ≈ 0.3472.</p>

      <h2>Conditions and their status</h2>
      <p>Value (i) rests on (Z<sub>7/8</sub>), (G0) and (PT). Value (ii) adds the route-P ledger. The half-plane is not the only open condition: the binding open item for both values is an external referee of Raymond&rsquo;s chain (G0).</p>
      <div className="ed-breakout">
        <table style={tbl}>
          <thead><tr><th style={th}>condition</th><th style={th}>used by</th><th style={th}>grade</th><th style={th}>status</th></tr></thead>
          <tbody>
            {DEPS.map((d, i) => (
              <tr key={i}>
                <td style={{ ...td, fontWeight: 500 }}>{d.item}</td>
                <td style={{ ...td, ...mono, fontSize: 12 }}>{d.used}</td>
                <td style={td}><Tag kind={d.kind}>{{ external: 'external claim', internal: 'internal review', peer: 'peer-reviewed', proved: 'proved', certified: 'certified' }[d.kind]}</Tag></td>
                <td style={{ ...td, fontSize: 13.5, color: V.inkSoft }}><ConceptText text={d.status} max={2} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Not needed by either value: {OAI.routePNotNeeded.join(', ')}.</p>

      <h2>What is in Lean</h2>
      <p><b>The 7/8 half-plane.</b> <code>{OAI.lean.theorem}</code></p>
      <p>The openai/math library re-builds locally on {OAI.lean.toolchain.split(',')[0]} ({OAI.lean.buildJobs.toLocaleString('en-US')} jobs; {OAI.lean.closureModulesBuilt} / {OAI.lean.closureModules} modules of the import closure, {OAI.lean.closureLines.toLocaleString('en-US')} lines). <code>#print axioms</code> gives {OAI.lean.axioms.join(', ')}; the statement equals the comparator challenge elaborated against Mathlib alone, and <code>riemannZeta</code> is Mathlib&rsquo;s own definition. A source scan of the closure finds no sorry, admit, axiom, native_decide or extern. Not done: {OAI.lean.notDone.slice(0, 3).join('; ')}. Details: <a href={LEAN_VERIFY_URL} target="_blank" rel="noreferrer">openai-math-qrh-verification.md</a>.</p>
      <p><b>Raymond-core.</b> A separate <ConceptTerm slug="lean-formalization">Lean</ConceptTerm> package (<a href={RAYMOND_CORE_URL} target="_blank" rel="noreferrer">formalization/lean/raymond-core</a>, same Mathlib commit) proves, with only the standard three axioms:</p>
      <ul style={{ margin: '0 0 22px 18px', padding: 0 }}>
        <li>the substitution lemma (<code>Substitution.substitution</code>, <code>substitution&prime;</code>) and the conditional de Bruijn bound <code>Lambda_le_of_zeroFree</code>: Λ ≤ (2θ − 1)²/2 for LeanCert&rsquo;s concrete H<sub>t</sub>;</li>
        <li>the θ = 7/8 instance <code>Instance78.Lambda_le_nine_thirtyseconds</code> (Λ ≤ 9/32), checked through the openai/math workspace, so the 003 proof is inside that axiom check;</li>
        <li>Lemma CG (G0-a): the covering identity and joint monotonicity <code>cn_nonneg_mono</code>, for every squarefree g;</li>
        <li>Lemma R: the integration step (sharper than the paper&rsquo;s constant) and ε<sub>R</sub> &lt; 10<sup>−10</sup>, with the AF (4.6) Stirling bounds as hypotheses.</li>
      </ul>
      <Pull>Not in Lean: AF (4.6), Raymond&rsquo;s Lemmas 2–3 and Theorem 4 / 4′ (G0-c), AF Part I §§2–12 and the route-P ledger. The barrier iteration and its {QP.run.steps.toLocaleString('en-US')}-substep certificate are now replayed in Lean (next section), with these analytic inputs as named hypotheses.</Pull>

      <h2>Lean status</h2>
      <p>A third package, <a href={QRH_LEAN_URL} target="_blank" rel="noreferrer">formalization/lean/qrh-lambda</a> ({QL.date}; Lean {QL.toolchain.lean}, Mathlib {QL.toolchain.mathlib}), replays both runs in the Lean kernel and proves the two values, from named hypotheses, as theorems about LeanCert&rsquo;s Λ of the concrete H<sub>t</sub>. Every substep is checked by <code>decide +kernel</code> (no <code>native_decide</code>); every unproved input is an explicit structure argument. The final theorem:</p>
      <pre style={pre}>{`theorem QrhLambda.lambda_le_of_qrh_raymond
    (h : RaymondChainHyps) (f : FloorTableHyps) :
    deBruijnNewmanLambda ≤ 116091488672439 / 10 ^ 15

-- deBruijnNewmanLambda := LeanCert.Analysis.DBN.Lambda
--   = sInf {t | ∀ z, H t z = 0 → z.im = 0},  H t z = ∫₀^∞ e^{tu²} Φ(u) cos(zu) du
-- RaymondChainHyps : head_wall, first_contact, contact_exclusion
-- FloorTableHyps   : floors_valid (${QLF.floorEntries} entries), kernels_valid (${QLF.kernelRows} rows)
-- the 7/8 half-plane enters as OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re

theorem QrhLambda.lambda_le_of_raymond78
    (h : RaymondChainHyps) (f : RaymondTableHyps) :
    deBruijnNewmanLambda ≤ 118505710922701 / 10 ^ 15`}</pre>
      <div className="ed-breakout">
        <table style={tbl}>
          <thead><tr><th style={th}>piece</th><th style={th}>Lean status</th><th style={th}>detail</th></tr></thead>
          <tbody>
            {LEAN_STATUS.map((r, i) => (
              <tr key={i}>
                <td style={{ ...td, fontWeight: 500 }}>{r.piece}</td>
                <td style={td}><Tag kind={r.kind}>{r.status}</Tag></td>
                <td style={{ ...td, fontSize: 13.5, color: V.inkSoft }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p><b>Axiom audit.</b> <code>#print axioms</code> on {QL.axiomAudit.total} theorems: {QL.axiomAudit.total - QL.axiomAudit.noAxioms.length} depend on exactly {QL.axiomAudit.standard.join(', ')}; <code>two96_pos</code> on none. No <code>sorry</code>, no <code>native_decide</code>, no <code>axiom</code> declarations. Kernel cost: F2 chunks {QL.kernelCost.F2.wallPerChunkS[0]}–{QL.kernelCost.F2.wallPerChunkS[1]} s each (sum {QL.kernelCost.F2.sumS} s, max RSS {QL.kernelCost.F2.maxRssGB} GB), Raymond chunks {QL.kernelCost.R78.wallPerChunkS[0]}–{QL.kernelCost.R78.wallPerChunkS[1]} s (sum {QL.kernelCost.R78.sumS} s). An internal referee rebuilt the package from scratch in a separate copy ({QL.kernelCost.refereeRebuildWallMin} min wall), replayed all modules with <code>leanchecker</code> and re-implemented the checker in Python (0 mismatches against the F2 dump); not refuted, minor corrections applied.</p>
      <p><b>What remains.</b> The five hypothesis fields above are not Lean-checked, and the half-plane proof has only a local build. {QL.effortNote} The package is untracked build state: it needs a local openai/math workspace and the raymond-core LeanCert checkout to rebuild. The Lean theorem is stated from named hypotheses: it does not change the accepted bound. PT Λ ≤ 0.2 stands; RH is open.</p>

      <h2>What the half-plane does not change</h2>
      <p><ConceptText text={OAI.analysis[1].replace(' (method-level analysis, relabelled from "proved" per referee P5)', '') + ' This is a method-level analysis.'} /></p>
      <p>Measured, not part of any value: with the 7/8 start and unverified heights 10X, 100X, 1000X the chain reaches {OAI.heightCurve78.map((h) => h.value.slice(0, 6)).join(', ')}. The classical strip start would need RH verified to roughly 4.7·10<sup>16</sup> to match the 7/8 value (strip-law extrapolation; heuristic).</p>

      <h2>What a better half-plane would give</h2>
      <p>The chain reads the half-plane only through the start q<sub>0</sub> = (2θ − 1)². Re-running it with q<sub>0</sub> set by other values of θ shows how much a better zero-free region would be worth. Every θ other than 7/8 is hypothetical; each value is conditional on that half-plane, on (G0) and (PT), and for route P on (L).</p>
      <Figure caption={<>Conditional Λ at Platt–Trudgian height against θ. Solid: Raymond&rsquo;s chain (14 exact runs). Circles: re-tuned route P at θ = 7/8, 0.85, 0.80. Dashed: the de Bruijn value (2θ − 1)²/2 from the half-plane alone, which uses no verified height.</>}>
        <ThetaFigure />
      </Figure>
      <div className="ed-breakout">
        <table style={tbl}>
          <thead><tr><th style={th}>θ</th><th style={th}>Raymond chain</th><th style={th}>route P</th><th style={th}>(2θ−1)²/2</th><th style={th}>PT → 1000×PT</th><th style={th}>note</th></tr></thead>
          <tbody>
            {THETA_ROWS.map((t) => {
              const r = TH.raymondPT.find((x) => x.theta === t);
              const p = TH.routePPT.find((x) => x.theta === t);
              const h = TH.heightLever.find((x) => x.theta === t);
              const [a, b] = t.split('/').map(Number); const dbv = (2 * a / b - 1) ** 2 / 2;
              const note = t === '7/8' ? 'openai/math 003 claim; values (i), (ii)' : t === '101/200' ? 'chain exceeds (2θ−1)²/2 by the 2·10⁻⁶ start offset; report 5·10⁻⁵' : r.sharpSubsteps ? `uses AF Part II on ${r.sharpSubsteps.toLocaleString('en-US')} substeps` : 'hypothetical';
              return (
                <tr key={t}>
                  <td style={{ ...td, ...mono }}>{t} <span style={{ color: V.inkFaint }}>({thetaDec(t)})</span></td>
                  <td style={{ ...td, ...mono, fontWeight: 600 }}>{r.dec}</td>
                  <td style={{ ...td, ...mono }}>{p ? p.dec : '—'}</td>
                  <td style={{ ...td, ...mono, color: V.inkSoft }}>{dbv.toPrecision(4)}</td>
                  <td style={{ ...td, ...mono, color: V.inkSoft }}>{h ? h.toX1000.toExponential(2) : '—'}</td>
                  <td style={{ ...td, fontSize: 13, color: V.inkSoft }}>{note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p>Measured from these runs:</p>
      <ul style={{ margin: '0 0 22px 18px', padding: 0 }}>
        <li>Near 7/8, each 0.01 of θ is worth about 0.003 of Λ. Below 0.10 needs θ ≈ 0.815 on Raymond&rsquo;s chain alone, or θ ≈ 0.82 with route P.</li>
        <li>No constraint of the chain binds for θ ≤ 7/8: the terminal cell falls with θ, U stays under the 41/250 horizon, and kernel admissibility gets easier as q shrinks. The value falls all the way to the de Bruijn value as θ → 1/2.</li>
        <li>Verified height matters less as θ falls. At 7/8, 10× the verified height is worth about 0.0215 of θ ({TH.rivalLever.X10at78} at 10× height against {TH.rivalLever.theta8535} at θ = 0.8535). Below θ ≈ 0.6 the chain is within 10% of the de Bruijn value, which needs no verified height.</li>
        <li>Route P stays 0.0020–0.0024 below Raymond&rsquo;s chain. Its 0.85 and 0.80 runs reuse the height sets tuned for 7/8.</li>
      </ul>
      <p>An internal referee re-ran all 14 PT values with an independent interval integrator and found no failures. Its {TH.refereeCorrections.length} corrections are applied above. The claim that 0.02 of θ beats 10× height was wrong (it is about 0.0215), and the values for θ in [0.75, 0.86] also use Raymond&rsquo;s AF Part II, which value (i) does not; switching it off moves them by less than 3·10<sup>−7</sup>.</p>

      <h2>Can 7/8 itself be improved?</h2>
      <p>Two separate attempts (A and B) worked through the 7/8 manuscript&rsquo;s exponent bookkeeping, each with an adversarial internal referee. Neither was refuted. <b>Result: no rigorous improvement of 7/8.</b></p>
      <TheoremBox label="Where 7/8 comes from (algebra from the manuscript&rsquo;s formulas)">
        <BlockMath tex="\sigma_0 \;=\; \tfrac56 + \tfrac{M - 2\ell}{12} \;=\; \tfrac{11}{12} - \tfrac{\ell}{4}\quad\text{on } M + \ell = 1," />
        <p>with M = l<sub>x</sub> + l<sub>y</sub> the probe lengths and ℓ the slot length (Prop 15.3 low exponent minus the Mellin shift of Def 10.1). The manuscript&rsquo;s (M, ℓ) = (5/6, 1/6) gives 7/8; Part I&rsquo;s (1, 0) gives 11/12.</p>
      </TheoremBox>
      <p><b>What limits it.</b> {QT.improvement.limits}</p>
      <div className="ed-breakout">
        <table style={tbl}>
          <thead><tr><th style={th}>change</th><th style={th}>θ reached</th><th style={th}>grade</th></tr></thead>
          <tbody>
            <tr><td style={td}>re-tune (ℓ, b, M) within the manuscript&rsquo;s system</td><td style={{ ...td, ...mono }}>{IA.optimum.sigma0.toFixed(7)} (−{IA.optimum.gain.toExponential(1)})</td><td style={td}><Tag kind="measured">model optimum</Tag></td></tr>
            <tr><td style={td}>ℓ = 5003/30000, M = 1 − ℓ, b = 1/8</td><td style={{ ...td, ...mono }}>{IA.retuned.sigma0}</td><td style={td}><Tag kind="conditional">arithmetic certified; lemmas re-used</Tag></td></tr>
            {IA.levers.map((l) => (
              <tr key={l.lever}><td style={td}>{l.lever}</td><td style={{ ...td, ...mono }}>{l.theta.toFixed(6)}</td><td style={td}><Tag kind="measured">hypothetical input</Tag></td></tr>
            ))}
            <tr><td style={td}>density-hypothesis row counts (paper floor / floor → 1/2)</td><td style={{ ...td, ...mono }}>{IA.barriers.paperFloor} / {IA.barriers.floorToHalf}</td><td style={td}><Tag kind="certified">exact, within the model</Tag></td></tr>
          </tbody>
        </table>
      </div>
      <ul style={{ margin: '0 0 22px 18px', padding: 0 }}>
        <li><b>Re-tuning.</b> 7/8 sits within 4.3·10<sup>−5</sup> of the best the manuscript&rsquo;s own parameter choices allow. The closing arithmetic for 34999/40000 is certified in exact rationals, but it re-uses the manuscript&rsquo;s lemmas at a geometry they were not written for and is not Lean-checked. It is not used in any Λ value. Its effect on Λ would be about 10<sup>−5</sup>.</li>
        <li><b>Height-dependent regions.</b> With PT, a region that improves only above 3·10<sup>12</sup> lowers the barrier start only if it holds uniformly there, which is the same as a global half-plane below 7/8. It is not an easier target.</li>
        <li><b>Bootstrapping.</b> Feeding 7/8 back into the argument gives the same optimum: the binding row bin is interior and moves by about 0.008 per unit of the input exponent.</li>
        <li><b>Method limit.</b> Even with density-hypothesis row counts the method stops at 13/15. The one change worth more than 5·10<sup>−3</sup> is an additive Gram bound without the P<sub>a</sub><sup>1/6</sup> sixth-power term (≈ 0.864). That term looks like a genuine main term, so this needs a new estimate rather than tuning.</li>
      </ul>
      <Pull>{IB.verdict}</Pull>

      <h3>Current claims below 7/8</h3>
      <p>Since the 7/8 manuscript, three preprints claim smaller zero-free abscissae. None has been refereed, and none is used in any Λ value on this page.</p>
      <div className="ed-breakout">
        <table style={tbl}>
          <thead><tr><th style={th}>source</th><th style={th}>θ (zero-free for Re s &gt; θ)</th><th style={th}>basis</th><th style={th}>status</th></tr></thead>
          <tbody>
            {BELOW_78_CLAIMS.map((c) => (
              <tr key={c.source}>
                <td style={td}>{c.href ? <a href={c.href} target="_blank" rel="noreferrer">{c.source}</a> : c.source}</td>
                <td style={{ ...td, ...mono }}>{c.theta}</td>
                <td style={td}>{c.basis}</td>
                <td style={td}><Tag kind={c.kind}>{c.status}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p><b>Effect on Λ.</b> The chain reads θ only through q<sub>0</sub> = (2θ − 1)², and near 7/8 the slope is about 0.28 of Λ per unit of θ. Raymond&rsquo;s chain run at θ = 0.8748888 (just above the Xu–Sang value) ends at 0.1184742, against 0.118506 at 7/8: the Xu–Sang half-plane would move value (i) by about −3·10<sup>−5</sup>, to about 0.11847. Liu&rsquo;s 0.874957 would move it by about −1·10<sup>−5</sup> (interpolated, not run). Both are conditional on the respective preprint as well as on (G0) and (PT); the stated values (i) and (ii) are unchanged.</p>
      <p><b>The P<sub>a</sub><sup>1/6</sup> loss (TRO6♮).</b> A campaign in this project (<code>src/data/sextic-theta-campaign-2026-11-03.js</code>, write-up <code>formalization/paper/sextic-theta-synthesis.md</code>) showed that removing a power of the P<sub>a</sub><sup>1/6</sup> loss is exactly equivalent, in the relevant window and given a zero-free hypothesis for the family, to an open hypothesis TRO6♮: a power saving over Cauchy–Schwarz when the complete sextic Kubota theta coefficient is paired with the manuscript&rsquo;s cubic rows. Cauchy–Schwarz gives saving 0; no saving η &gt; 0 is known. Assuming TRO6♮ with η ≥ 0.0219, the fixed-geometry argument gives θ = 0.87477 and a Raymond-chain value of 0.118441. The ≈ 0.864 figure above is a model computation with the term removed entirely, not a derived bound. No rigorous θ below 7/8 comes from this project.</p>

      <p>Write-ups: <code>{IA.file}</code> and <code>{IB.file}</code>. Record module: <code>src/data/qrh-theta-and-improvement-2026-10-08.js</code>, with the referee corrections (A1–A6, B1–B7, T1–T7).</p>

      <h2>Credits</h2>
      <ul style={{ margin: '0 0 22px 18px', padding: 0 }}>
        {CREDITS.map(([who, what]) => <li key={who} style={{ marginBottom: 8 }}><b>{who}</b>. {what}</li>)}
        <li>Route-P floors, kernels, the re-tune, the Lean packages above and the internal reviews: this project, Sep–Oct 2026.</li>
      </ul>
      <p>Sources: <a href={OAI_REPO} target="_blank" rel="noreferrer">github.com/openai/math</a> · <a href={RAYMOND_ZENODO} target="_blank" rel="noreferrer">Raymond, Zenodo 22867547</a>.</p>

      <h2>Reproduction</h2>
      <p>Paths are relative to the project repository; scripts and data live in its <code>tmp/</code> tree and are not a released artefact. Expected: (b) <code>U = 118505710922701/10^15</code>, 60,675 steps; (c) and (d) <code>U = U_robust = 116091488672439/10^15</code>, {QP.run.steps.toLocaleString('en-US')} steps, 0 failures.</p>
      <pre style={pre}>{REPRO}</pre>
      <p>The write-up of both values, with exact rationals, the proof of Lemma 2 in summary and the dependency table, is the internal draft <a href={NOTE_URL} target="_blank" rel="noreferrer">formalization/paper/lambda-qrh-note-draft.md</a> (not submitted, not refereed). Record modules: <code>src/data/openai-math-integration-2026-10-08.js</code>, <code>src/data/qrh-path-push-2026-10-08.js</code>, <code>src/data/qrh-theta-and-improvement-2026-10-08.js</code>.</p>
    </PostLayout>
  );
}
