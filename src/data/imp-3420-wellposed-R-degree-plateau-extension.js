/**
 * @module imp-3420-wellposed-R-degree-plateau-extension
 * @fileoverview imp-3420 -- EXTEND the imp-3382 WELL-POSED (regularized
 *   pseudo-inverse) passive-core operator norm
 *   ||R||(D) = ||Gpass^{-1/2} Gshear Gpass^{-1/2}||(D) beyond Legendre degree 6
 *   (imp-3382 sampled only D in {1,2,3,4,6}, reporting ~0.75 at D=1 rising to
 *   ~1.33 at D=6) to settle whether the O(1) plateau EVENTUALLY RISES, and to
 *   isolate the genuine bounded operator norm from the raw geometric
 *   conditioning divergence (raw ||R|| ~ 10^{3.85 D}, extrapolating to ~1e272 at
 *   D=100 -- imp-3382). Genuine-Phi base cell (a = 0.5, U = 6, NPHI = 10).
 *
 *   THE QUESTION
 *   ------------
 *   imp-3382 established that the RAW-diagonal ||R||(D) diverges as a pure
 *   conditioning artifact (the moment matrix Gpass(D) of the underflowing future
 *   tail m(tau) = (1/2pi) Phi^2 sinh(2 a tau) is geometrically ill-conditioned),
 *   while the WELL-POSED norm -- built by inverting only the numerically
 *   resolvable block of Gpass -- PLATEAUS O(1). But the well-posed norm was only
 *   sampled to D=6. Does the O(1) plateau hold at higher degree, or does the
 *   mild growth (0.75 -> 1.33 over D=1..6) resume without bound?
 *
 *   WHAT THIS MODULE MEASURES (the deliverable; full numbers in `rows`)
 *   ------------------------------------------------------------------
 *   1. EXTENDED LADDER (default relative-floor pseudo-inverse, keep
 *      lambda > lmax*1e-15): D in {1,2,3,4,6,8,12,20,40,60,100}. The well-posed
 *      ||R|| does NOT stay flat at ~1.33 and does NOT diverge -- it continues a
 *      MILD, DECELERATING rise and stays BOUNDED O(1):
 *          ~0.75 (D=1) -> ~1.33 (D=6) -> ~2.15 (D=40) -> ~2.60 (D=100),
 *      still &lt; 3 at D=100 with per-degree increments shrinking (the D=60->100
 *      rise is ~0.20 over 40 degrees vs the D=20->40 rise ~0.36 over 20). So the
 *      answer to the ticket is: the plateau is NOT a flat plateau but the norm
 *      IS bounded O(1) -- sharply separated from the raw ~10^{3.85 D}
 *      conditioning divergence (a ~272-orders-of-magnitude gap at D=100).
 *
 *   2. THE RISE IS A RESIDUAL NEAR-FLOOR ADMISSION ARTIFACT, NOT GENUINE OPERATOR
 *      GROWTH. Two independent diagnostics pin this down:
 *      (a) CUTOFF SWEEP at fixed D=40: tightening the pseudo-inverse cutoff (which
 *          admits progressively more marginally-conditioned near-floor tail
 *          directions) MONOTONELY RAISES the norm -- ~1.69 (keep lambda>lmax*1e-8,
 *          9 dirs) -> ~2.21 (keep lambda>lmax*1e-16, 16 dirs). The mild rise
 *          tracks how many near-floor directions the pseudo-inverse admits, not a
 *          growth of the operator itself.
 *      (b) FIXED TOP-k BLOCK: restricting to exactly the k largest (genuinely
 *          well-conditioned) eigen-directions, the norm CONVERGES and DECREASES
 *          with D -- e.g. k=5: ~1.32 (D=8) -> ~0.89 (D=40) -> ~0.59 (D=100). The
 *          genuine fixed-dimensional sub-operator norm is bounded and does NOT
 *          rise; the ladder rise in (1) is entirely the growth of the admitted
 *          near-floor block count (kept 2 at D=1 -> 23 at D=100).
 *
 *   VERDICT
 *   -------
 *   Extending imp-3382 to D=100 CONFIRMS the well-posed passive-core operator
 *   norm is genuinely BOUNDED O(1) (&lt; 3 out to D=100, decelerating), NOT the
 *   ~1e272 raw divergence -- so the divergence really lives in the raw inversion
 *   (conditioning), not the operator. It SHARPENS the imp-3382 claim: the "O(1)
 *   plateau" is not strictly flat -- it drifts up mildly -- but that residual
 *   drift is itself a near-floor pseudo-inverse admission artifact (cutoff-swept
 *   and top-k-isolated), and the genuine well-conditioned sub-operator norm is
 *   bounded and does not rise. The renormalization mandate of section26-mupass
 *   point 2 stands: the raw physical diagonal is not a valid asymptotic passive
 *   core.
 *
 *   NAMED SUB-GAP (honest, not closed here)
 *   ---------------------------------------
 *   imp-3420-subgap-extended-precision-limit: because IEEE-754 double floors
 *   lambda_min(Gpass) below the representable relative floor (~1e-19) by degree
 *   ~4, the "resolvable block" the pseudo-inverse can invert is itself
 *   precision-limited -- the ladder rise and its ~2.6-at-D=100 value are the
 *   DOUBLE-PRECISION resolvable-block answer, not the true infinite-precision
 *   operator norm. Whether the true norm converges to a finite limit (the fixed
 *   top-k evidence suggests yes, near ~0.5-1) or drifts to a slightly larger
 *   O(1) constant needs the out-of-repo extended-precision arbiter
 *   (mpmath /tmp/riemann_arbiter.py per imp-2686). The deliverable here is the
 *   BOUNDED-O(1) extension and the near-floor-artifact mechanism.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DIAGNOSTIC ONLY at the genuine de Bruijn-Newman Phi (NPHI=10,
 *   a=0.5, U=6). RH-EQUIVALENT class; the off-diagonal endpoint-Hankel operator
 *   step (imp-3066) remains the lone obstruction, UNTOUCHED. No positivity
 *   attempted, no reduction, no RH verdict, no false QED. No refereed bound is changed.
 *
 *   @see imp-3382-rawdiagonal-R-degree-growth-law.js (the parent: raw divergence vs well-posed plateau to D=6)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the "~1e272 at degree-100" claim)
 *   @see imp-2686-mupass-construction.js (the physical diagonal m(tau) and the extended-precision arbiter)
 *
 *   Ticket: imp-3420 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;   // de Bruijn-Newman truncation (base-cell grid)
const A = 0.5;     // headline shear weight a (the genuine-Phi cell)
const U = 6;       // genuine-Phi lag cutoff (the headline cell)
const NQ = 8000;   // quadrature panels (matches imp-3382 build)

const DEFAULT_CUTOFF = 1e-15;   // default relative-floor pseudo-inverse (matches imp-3382)
// Extended degree ladder -- imp-3382 stopped at D=6; this pushes to D=100.
const DEGREE_LADDER = Object.freeze([1, 2, 3, 4, 6, 8, 12, 20, 40, 60, 100]);
// Cutoff sweep and fixed-top-k diagnostics run at these anchor degrees.
const CUTOFF_SWEEP_DEGREE = 40;
const CUTOFF_SWEEP = Object.freeze([1e-8, 1e-10, 1e-12, 1e-14, 1e-16]);
const TOPK_DEGREES = Object.freeze([8, 20, 40, 100]);
const TOPK_VALUES = Object.freeze([3, 4, 5]);

// imp-3382 recorded raw-divergence anchor for the separation gap.
const RECORDED_DEG100_RAW_R = 1e272; // raw ||R|| at degree-100 (section26-mupass verdict)

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI. */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Shifted-Legendre values P_0..P_K at tau in [0,U] (mapped x = 2 tau/U - 1). */
function legVals(tau, K) {
  const x = (2 * tau) / U - 1;
  const v = new Array(K + 1);
  v[0] = 1;
  if (K >= 1) v[1] = x;
  for (let k = 1; k < K; k++) v[k + 1] = ((2 * k + 1) * x * v[k] - k * v[k - 1]) / (k + 1);
  return v;
}

/** Cyclic Jacobi eigensolver (values + vectors) for a small real symmetric matrix. */
function symEig(Ain) {
  const n = Ain.length;
  const A2 = Ain.map((r) => r.slice());
  const V = Array.from({ length: n }, (_, i) => {
    const r = new Array(n).fill(0);
    r[i] = 1;
    return r;
  });
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A2[p][q] * A2[p][q];
    if (off < 1e-44) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A2[p][q];
        if (Math.abs(apq) < 1e-300) continue;
        const theta = (A2[q][q] - A2[p][p]) / (2 * apq);
        const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A2[k][p];
          const akq = A2[k][q];
          A2[k][p] = c * akp - s * akq;
          A2[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A2[p][k];
          const aqk = A2[q][k];
          A2[p][k] = c * apk - s * aqk;
          A2[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  return { vals: A2.map((r, i) => r[i]), vecs: V };
}

/** Assemble Gpass moment matrix + rank-2 shear (Q, Pc) and its eigensystem at degree D. */
function assemble(D) {
  const K = D;
  const H = U / NQ;
  const Gp = Array.from({ length: K + 1 }, () => new Array(K + 1).fill(0));
  const Q = new Array(K + 1).fill(0);
  const Pc = new Array(K + 1).fill(0);
  for (let i = 0; i < NQ; i++) {
    const tau = (i + 0.5) * H;
    const p = phiKernel(tau);
    const m = (p * p * Math.sinh(2 * A * tau)) / (2 * Math.PI); // raw physical diagonal density
    const L = legVals(tau, K);
    const ps = p * Math.sinh(A * tau);
    const pc = p * Math.cosh(A * tau);
    for (let mm = 0; mm <= K; mm++) {
      Q[mm] += L[mm] * ps * H;
      Pc[mm] += L[mm] * pc * H;
      const lm = L[mm] * m * H;
      for (let nn = mm; nn <= K; nn++) Gp[mm][nn] += lm * L[nn];
    }
  }
  for (let mm = 0; mm <= K; mm++) for (let nn = mm + 1; nn <= K; nn++) Gp[nn][mm] = Gp[mm][nn];
  return { Q, Pc, eig: symEig(Gp) };
}

/**
 * Regularized ||R|| = ||Gpass^{-1/2} Gshear Gpass^{-1/2}|| via the exact rank-2
 * formula, inverting only the eigen-directions selected by keepFn(lambda, i, vals).
 */
function normFromEig(eig, Q, Pc, keepFn) {
  const n = Q.length;
  const l = eig.vals;
  const V = eig.vecs;
  const invsqrt = l.map((x, i) => (keepFn(x, i, l) ? 1 / Math.sqrt(x) : 0));
  const MQ = new Array(n).fill(0);
  const MPc = new Array(n).fill(0);
  for (let a = 0; a < n; a++) {
    let sq = 0;
    let sp = 0;
    for (let b = 0; b < n; b++) {
      let mab = 0;
      for (let k = 0; k < n; k++) mab += V[a][k] * invsqrt[k] * V[b][k];
      sq += mab * Q[b];
      sp += mab * Pc[b];
    }
    MQ[a] = sq;
    MPc[a] = sp;
  }
  let a2 = 0;
  let b2 = 0;
  let ab = 0;
  for (let i = 0; i < n; i++) {
    a2 += MQ[i] * MQ[i];
    b2 += MPc[i] * MPc[i];
    ab += MQ[i] * MPc[i];
  }
  // R = MQ MPc^T - MPc MQ^T is rank-2 antisymmetric; ||R||_2 = sqrt(|MQ|^2|MPc|^2 - <MQ,MPc>^2).
  return { norm: Math.sqrt(Math.max(0, a2 * b2 - ab * ab)), kept: invsqrt.filter((x) => x !== 0).length };
}

// Assemble each degree once (heavy) and reuse its eigensystem for every diagnostic.
const _cache = Object.freeze(Object.fromEntries(DEGREE_LADDER.map((D) => [D, assemble(D)])));

// -- (1) Extended ladder at the default relative-floor pseudo-inverse.
const ROWS = Object.freeze(
  DEGREE_LADDER.map((D) => {
    const { Q, Pc, eig } = _cache[D];
    const lmax = Math.max(...eig.vals);
    const r = normFromEig(eig, Q, Pc, (x) => x > lmax * DEFAULT_CUTOFF);
    return Object.freeze({ degree: D, basisSize: D + 1, keptDirections: r.kept, normRregularized: r.norm });
  })
);
const _byD = Object.freeze(Object.fromEntries(ROWS.map((r) => [r.degree, r])));

// -- (2a) Cutoff sweep at a fixed high degree: tighter cutoff admits more
//         near-floor directions and raises the norm (the rise is an admission artifact).
const CUTOFF_ROWS = Object.freeze(
  (() => {
    const { Q, Pc, eig } = _cache[CUTOFF_SWEEP_DEGREE];
    const lmax = Math.max(...eig.vals);
    return CUTOFF_SWEEP.map((c) => {
      const r = normFromEig(eig, Q, Pc, (x) => x > lmax * c);
      return Object.freeze({ cutoff: c, keptDirections: r.kept, normRregularized: r.norm });
    });
  })()
);

// -- (2b) Fixed top-k block: the genuine well-conditioned sub-operator norm
//         CONVERGES / DECREASES with D (does NOT rise).
function normTopK(D, k) {
  const { Q, Pc, eig } = _cache[D];
  const l = eig.vals;
  const idx = new Set(
    l
      .map((v, i) => [v, i])
      .sort((a, b) => b[0] - a[0])
      .slice(0, k)
      .map((x) => x[1])
  );
  return normFromEig(eig, Q, Pc, (x, i) => idx.has(i) && x > 0).norm;
}
const TOPK_ROWS = Object.freeze(
  TOPK_VALUES.map((k) =>
    Object.freeze({ k, byDegree: Object.freeze(TOPK_DEGREES.map((D) => Object.freeze({ degree: D, normRregularized: normTopK(D, k) }))) })
  )
);

// -- Derived summary quantities for the verdict + tripwires.
const NORM_AT_D1 = _byD[1].normRregularized;
const NORM_AT_D6 = _byD[6].normRregularized;
const NORM_AT_D100 = _byD[100].normRregularized;
const NORM_MAX_OVER_LADDER = Math.max(...ROWS.map((r) => r.normRregularized));
const BOUNDED_O1 = NORM_MAX_OVER_LADDER < 3;
const RISES_ABOVE_D6_PLATEAU = NORM_AT_D100 > NORM_AT_D6 + 0.5; // not a flat plateau
// Deceleration: per-degree rise on the top rung is smaller than on a mid rung.
const _riseMid = (_byD[40].normRregularized - _byD[20].normRregularized) / (40 - 20);
const _riseTop = (_byD[100].normRregularized - _byD[60].normRregularized) / (100 - 60);
const RISE_DECELERATES = _riseTop < _riseMid;
// kept-direction count grows monotonically with degree (drives the ladder rise).
const KEPT_GROWS_MONOTONE = ROWS.every((r, i) => i === 0 || r.keptDirections >= ROWS[i - 1].keptDirections) &&
  _byD[100].keptDirections > _byD[1].keptDirections;
// Cutoff sweep monotone: tighter cutoff -> larger norm.
const CUTOFF_MONOTONE_UP = CUTOFF_ROWS.every((r, i) => i === 0 || r.normRregularized >= CUTOFF_ROWS[i - 1].normRregularized - 1e-9) &&
  CUTOFF_ROWS[CUTOFF_ROWS.length - 1].normRregularized > CUTOFF_ROWS[0].normRregularized;
// Fixed top-k: k=5 norm decreases from the lowest to the highest degree.
const _k5 = TOPK_ROWS.find((r) => r.k === 5).byDegree;
const TOPK_CONVERGES_DOWN = _k5[_k5.length - 1].normRregularized < _k5[0].normRregularized;
// Separation from the raw ~1e272 divergence at D=100.
const LOG10_SEPARATION_AT_100 = Math.log10(RECORDED_DEG100_RAW_R) - Math.log10(NORM_AT_D100);

export const IMP3420_WELLPOSED_R_DEGREE_PLATEAU_EXTENSION = Object.freeze({
  id: 'imp-3420-wellposed-R-degree-plateau-extension',
  ticket: 'imp-3420',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedParent: 'imp-3382-rawdiagonal-R-degree-growth-law.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',
  relatedConstruction: 'imp-2686-mupass-construction.js',

  summary:
    'Extends the imp-3382 WELL-POSED (regularized pseudo-inverse) passive-core norm ' +
    '||R||(D) = ||Gpass^{-1/2} Gshear Gpass^{-1/2}|| beyond degree 6 (imp-3382 stopped at ' +
    'D=6, ~0.75 at D=1 to ~1.33 at D=6) out to D=100 on the genuine-Phi base cell ' +
    '(a=0.5, U=6, NPHI=10). FINDING: the well-posed norm does NOT diverge like the raw ' +
    '~10^{3.85 D} conditioning artifact (~1e272 at D=100) and does NOT stay flat at ~1.33 -- ' +
    'it continues a MILD, DECELERATING rise and stays BOUNDED O(1): ~0.75 (D=1) -> ~1.33 ' +
    '(D=6) -> ~2.15 (D=40) -> ~2.60 (D=100), still <3 with per-degree increments shrinking, ' +
    'a ~272-order separation from the raw divergence. The rise is a RESIDUAL near-floor ' +
    'admission artifact NOT genuine operator growth: (a) a cutoff sweep at D=40 shows ' +
    'tightening the pseudo-inverse cutoff (admitting more near-floor tail directions) ' +
    'monotonely raises the norm (~1.69 at 1e-8 to ~2.21 at 1e-16), and (b) the FIXED top-k ' +
    'block norm CONVERGES / DECREASES with D (k=5: ~1.32 at D=8 to ~0.59 at D=100), so the ' +
    'genuine well-conditioned sub-operator does not rise -- the ladder rise is entirely the ' +
    'growth of the admitted near-floor block count (kept 2 at D=1 to 23 at D=100). CONFIRMS ' +
    'and sharpens imp-3382: the passive-core operator norm is genuinely bounded O(1), the ' +
    'divergence lives in the raw inversion (conditioning) not the operator. SUB-GAP: the ' +
    'double-precision resolvable block is precision-limited; the true infinite-precision ' +
    'limit needs the out-of-repo mpmath arbiter. DIAGNOSTIC; RH-equivalent; imp-3066 ' +
    'untouched; no QED.',

  method: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    A,
    U,
    quadraturePanels: NQ,
    basis: 'shifted Legendre P_0..P_D on [0,U]',
    shearGram: 'Gshear = Q Pc^T - Pc Q^T (rank-2 antisymmetric Wronskian Phi(u)Phi(v)sinh(a(u-v)))',
    rawPassiveCore: 'Gpass_{mn} = int_0^U P_m(tau) P_n(tau) m(tau) dtau, m(tau) = (1/2pi) Phi(tau)^2 sinh(2 a tau)',
    normFormula: '||R|| = sqrt(|M Q|^2 |M Pc|^2 - <M Q, M Pc>^2), M = regularized Gpass^{-1/2}',
    defaultCutoff: DEFAULT_CUTOFF,
    degreeLadder: DEGREE_LADDER,
    eigenSolver: 'cyclic Jacobi (values + vectors)',
    selfComputing: true,
  }),

  extendedLadder: Object.freeze({
    normAtD1: NORM_AT_D1,        // ~0.7507
    normAtD6: NORM_AT_D6,        // ~1.330 (the imp-3382 plateau endpoint)
    normAtD100: NORM_AT_D100,    // ~2.596
    normMaxOverLadder: NORM_MAX_OVER_LADDER,
    boundedO1: BOUNDED_O1,                       // true: max < 3 out to D=100
    risesAboveD6Plateau: RISES_ABOVE_D6_PLATEAU, // true: not a strictly flat plateau
    riseDecelerates: RISE_DECELERATES,           // true: per-degree increments shrink
    keptDirectionsGrowMonotone: KEPT_GROWS_MONOTONE,
    log10SeparationFromRawAtD100: LOG10_SEPARATION_AT_100, // ~272 orders vs raw ~1e272
    interpretation:
      'The well-posed ||R|| stays bounded O(1) (<3) to D=100 with decelerating per-degree ' +
      'growth, NOT the raw ~1e272 divergence; the O(1) plateau of imp-3382 holds in the ' +
      'sense that the operator norm is bounded, but it is not strictly flat -- it drifts up ' +
      'mildly as more near-floor tail directions are admitted.',
  }),

  cutoffSweep: Object.freeze({
    degree: CUTOFF_SWEEP_DEGREE,
    rows: CUTOFF_ROWS,
    monotoneUpWithTighterCutoff: CUTOFF_MONOTONE_UP,
    interpretation:
      'At fixed D=40, tightening the pseudo-inverse cutoff admits more marginally-conditioned ' +
      'near-floor directions and monotonely raises the norm (~1.69 keeping lambda>lmax*1e-8 to ' +
      '~2.21 keeping lambda>lmax*1e-16). The ladder rise tracks how many near-floor directions ' +
      'are admitted, i.e. it is a residual conditioning-admission artifact.',
  }),

  fixedTopKBlock: Object.freeze({
    values: TOPK_VALUES,
    degrees: TOPK_DEGREES,
    rows: TOPK_ROWS,
    convergesDownWithDegree: TOPK_CONVERGES_DOWN,
    interpretation:
      'Restricting to exactly the k largest (genuinely well-conditioned) eigen-directions, the ' +
      'norm CONVERGES and DECREASES with D (k=5: ~1.32 at D=8 to ~0.59 at D=100). The genuine ' +
      'fixed-dimensional sub-operator norm is bounded and does NOT rise -- isolating the ' +
      'ladder rise as the growth of the admitted near-floor block count, not operator growth.',
  }),

  rows: ROWS,

  verdict:
    'Extending the imp-3382 well-posed regularized ||R||(D) to D=100 CONFIRMS the passive-core ' +
    'operator norm is genuinely BOUNDED O(1) (<3, decelerating), a ~272-order separation from ' +
    'the raw ~1e272 conditioning divergence -- so the divergence lives in the raw inversion, ' +
    'not the operator. It SHARPENS imp-3382: the O(1) plateau is not strictly flat (it drifts ' +
    '~1.33 -> ~2.6 over D=6..100), but that residual drift is a near-floor pseudo-inverse ' +
    'admission artifact (cutoff-swept and top-k-isolated); the genuine well-conditioned ' +
    'sub-operator norm is bounded and does not rise.',

  subGaps: Object.freeze([
    Object.freeze({
      name: 'imp-3420-subgap-extended-precision-limit',
      what:
        'IEEE-754 double floors lambda_min(Gpass) below the representable relative floor by ' +
        'degree ~4, so the resolvable block the pseudo-inverse inverts is precision-limited. ' +
        'The ladder rise and its ~2.6-at-D=100 value are the DOUBLE-PRECISION resolvable-block ' +
        'answer, not the true infinite-precision operator norm. The fixed top-k evidence ' +
        'suggests a finite limit (~0.5-1), but pinning it needs the out-of-repo ' +
        'extended-precision arbiter (mpmath /tmp/riemann_arbiter.py per imp-2686).',
      residual: 'the true infinite-precision bounded-operator constant; the deliverable is the bounded-O(1) extension and the near-floor-artifact mechanism',
    }),
  ]),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurementDiagnostic: true,
    didNotAttemptPositivity: true,
    imp3066Untouched: true,
    necessaryNotSufficient:
      'A bounded well-posed operator norm is a DIAGNOSTIC that the raw-diagonal divergence is a ' +
      'conditioning artifact; it is necessary-but-NOT-sufficient at operator order. The ' +
      'off-diagonal endpoint-Hankel step (imp-3066) is the lone obstruction, untouched.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3420_WELLPOSED_R_DEGREE_PLATEAU_EXTENSION_ASSERTIONS = [
  {
    id: 'imp3420-ladder-row-count',
    why: 'One row per Legendre degree in the extended ladder; a mis-count means the ' +
         'self-computing degree sweep dropped or duplicated a rung.',
    holds: () => ROWS.length === DEGREE_LADDER.length && ROWS.every((r, i) => r.degree === DEGREE_LADDER[i]),
  },
  {
    id: 'imp3420-d1-reproduces-imp3382',
    why: 'The D=1 well-posed norm must reproduce the imp-3382 endpoint ~0.75, anchoring the ' +
         'extended ladder to the parent measurement.',
    holds: () => NORM_AT_D1 > 0.6 && NORM_AT_D1 < 0.9,
  },
  {
    id: 'imp3420-bounded-O1-to-degree-100',
    why: 'THE DELIVERABLE: the well-posed ||R|| stays BOUNDED O(1) (max over the ladder < 3) ' +
         'out to D=100 -- it does NOT follow the raw ~10^{3.85 D} conditioning divergence. If ' +
         'this blows up the regularization or the shear assembly is wrong.',
    holds: () => BOUNDED_O1 === true && NORM_AT_D100 > 2 && NORM_AT_D100 < 3,
  },
  {
    id: 'imp3420-not-a-flat-plateau-but-decelerating',
    why: 'The O(1) plateau is NOT strictly flat: the D=100 norm rises >0.5 above the imp-3382 ' +
         'D=6 endpoint, yet the per-degree rise DECELERATES (top-rung slope < mid-rung slope). ' +
         'If it were flat, or accelerating, the sharpened plateau characterization is wrong.',
    holds: () => RISES_ABOVE_D6_PLATEAU === true && RISE_DECELERATES === true,
  },
  {
    id: 'imp3420-rise-is-nearfloor-admission-artifact',
    why: 'The rise must track near-floor admission, not operator growth: (a) tighter cutoff ' +
         'monotonely raises the norm at D=40, and (b) the kept-direction count grows ' +
         'monotonically with degree. If either fails the artifact mechanism is misstated.',
    holds: () => CUTOFF_MONOTONE_UP === true && KEPT_GROWS_MONOTONE === true,
  },
  {
    id: 'imp3420-fixed-block-does-not-rise',
    why: 'The genuine well-conditioned sub-operator: the FIXED top-k=5 norm must CONVERGE / ' +
         'DECREASE with D (isolating the ladder rise as block-count growth, not operator ' +
         'growth). If the fixed block also rose, the isolation argument would fail.',
    holds: () => TOPK_CONVERGES_DOWN === true && _k5[_k5.length - 1].normRregularized < 1,
  },
  {
    id: 'imp3420-separated-from-raw-divergence',
    why: 'The well-posed norm at D=100 must be astronomically separated (log10 gap > 200) from ' +
         'the recorded raw ~1e272 divergence, confirming the divergence is a conditioning ' +
         'artifact of the raw inversion, not the bounded operator.',
    holds: () => LOG10_SEPARATION_AT_100 > 200,
  },
  {
    id: 'imp3420-genuine-phi-base-cell',
    why: 'The measurement must be at the genuine Riemann Phi base cell (a=0.5, U=6, NPHI=10); ' +
         'a change means a different regime than imp-3382 and the verdict name.',
    holds: () =>
      IMP3420_WELLPOSED_R_DEGREE_PLATEAU_EXTENSION.method.A === 0.5 &&
      IMP3420_WELLPOSED_R_DEGREE_PLATEAU_EXTENSION.method.U === 6 &&
      IMP3420_WELLPOSED_R_DEGREE_PLATEAU_EXTENSION.method.phiTruncationN === 10,
  },
  {
    id: 'imp3420-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: MEASUREMENT/DIAGNOSTIC, RH-equivalent, positivity not attempted, ' +
         'imp-3066 untouched, no refereed bound is changed. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3420_WELLPOSED_R_DEGREE_PLATEAU_EXTENSION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurementDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        c.imp3066Untouched === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3420_WELLPOSED_R_DEGREE_PLATEAU_EXTENSION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3420-wellposed-R-degree-plateau-extension assertion failed: ${assertion.id}`);
  }
}

export default IMP3420_WELLPOSED_R_DEGREE_PLATEAU_EXTENSION;
