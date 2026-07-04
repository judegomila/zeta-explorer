/**
 * @module imp-33234-saddle-window-direct-vs-log-a-cross-validation
 * @fileoverview imp-33234 -- EXTEND the imp-33213 moment-weight vs dual-path A(tau)
 *   cross-validation BELOW the tau ~ 1.37 direct-underflow edge, into the saddle window
 *   tau*(n) in [0.27, 0.59] (n = 10..80), where BOTH A(tau) machineries are representable.
 *
 *       A(tau) = int_0^inf Phi(s) Phi(s + tau) ds,   Phi the NPHI=10 completed-Riemann kernel
 *
 *   WHAT imp-33213 LEFT OPEN
 *   ------------------------
 *   imp-33213 established that the imp-3893 DIRECT kernel Phi(s)Phi(s+tau) and the imp-3850
 *   log-domain graded-GL reconstruction integrate a BIT-IDENTICAL NPHI=10 kernel (agree to
 *   ~4.3e-16), but it could only cross-TABULATE their A(tau) values at tau in {1.5,2,2.5,3} --
 *   and there the direct double-precision kernel underflows to exactly 0 (phiKernel(1.5)=0,
 *   pi e^{4u} > ~709 for u > ~1.37). So the two machineries were cross-checked ONLY in the log
 *   domain, at tau values the moments never actually sample.
 *
 *   The imp-3871/imp-3893 moments draw their entire representable support from the saddle window
 *   tau*(n) in [0.27, 0.59] (the imp-3646 Laplace saddle, root of n = 4 pi tau* e^{4 tau*}, for
 *   n = 10..80). THERE both forms are representable -- yet they were never cross-tabulated. This
 *   module fills that overlap: the direct-vs-log A(tau) agreement is measured exactly where the
 *   moment weight is drawn.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   For n in {10,20,...,80} we evaluate tau* = saddleTau(n) and compare, at that tau:
 *     A_direct = the imp-3893 direct uniform-Simpson autocorrelation
 *                int_0^7 phiKernel(s) phiKernel(s+tau) ds (inner N = 9600), and
 *     A_log    = exp(-negLnA(tau)), negLnA from the imp-33213 INDEPENDENT log-domain graded-GL
 *                (grade 5, 300 panels, hi=10).
 *   Across the whole window they agree to worst relative difference ~5.2e-7 (n=80, the deepest
 *   rung, A ~ 1.3e-15), tightening to ~2.5e-9 at n=10. The residual is dominated by the DIRECT
 *   uniform-Simpson resolution, not a kernel disagreement: at the hardest rung (n=80) the direct
 *   value converges toward the log-domain value at the textbook Simpson O(h^4) rate as the inner
 *   count doubles --
 *
 *        inner N     |A_direct - A_log| / A_log      ratio vs previous
 *          1200          2.01e-3
 *          2400          1.32e-4                       ~15.3x
 *          4800          8.32e-6                       ~15.8x
 *          9600          5.21e-7                       ~16.0x
 *         19200          3.26e-8                       ~16.0x
 *
 *   -- the ~16x-per-doubling signature of a fourth-order rule converging to a fixed limit. Both
 *   machineries evaluate the SAME A(tau) in the saddle window; the only gap is finite quadrature
 *   resolution of the direct form, which vanishes on refinement.
 *
 *   VERDICT. Below the tau ~ 1.37 underflow edge, where the imp-3893 DIRECT kernel is
 *   representable and where the moments actually draw their support, the direct and log-domain
 *   A(tau) machineries agree to < 1e-6 relative per rung across tau* in [0.27,0.59], the direct
 *   form converging to the log value at the Simpson O(h^4) rate. This completes the imp-33213
 *   cross-check: the two A(tau) evaluations coincide not only in the log domain at large tau but
 *   ALSO directly, on the exact window the moment weight is built from.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   CROSS-VALIDATION / CONSISTENCY ONLY, at the RH-equivalent scale class. It confirms two
 *   evaluations of a fixed autocorrelation weight agree; it establishes NO operator positivity.
 *   Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-33213-moment-weight-vs-dual-path-a-cross-validation.js (the log-domain overlap at tau in {1.5,2,2.5,3} this extends)
 *   @see imp-3893-model-fidelity-moment-discrepancy.js (the direct autocorrelation + saddleTau(n) machinery)
 *   @see imp-3850-a-weight-dual-path-tau25-30-reconciliation.js (the log-domain reconciled -ln A ladder)
 *   @see imp-3871-saddle-correction-fifth-sixth-derivative.js (the saddle-window moment consumer)
 *
 *   Ticket: imp-33234 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;

// -- imp-3893s DIRECT completed-Riemann kernel (double-domain; representable for u < ~1.37) -----
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2) * Math.exp(-PI * n2 * e4);
  }
  return s;
}

// -- imp-3850s FACTORED log kernel: ln Phi(u) = -pi e^{4u} + ln(sum_n amp_n e^{-pi(n^2-1)e^{4u}}) --
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;    // > 0 for u >= 0
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}

// -- Composite Simpson (imp-3893) -- the DIRECT autocorrelation quadrature ----------------------
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  return (sum * h) / 3;
}
function aDirect(tau, innerN) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, innerN);
}

// -- imp-33213s INDEPENDENT log-domain graded-GL -ln A (grade 5, 300 panels, hi=10) -------------
const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];
function negLnAgradedGL(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}
function aLog(tau) {
  return Math.exp(-negLnAgradedGL(tau, 10, 300, 5));
}

// -- imp-3646 Laplace saddle tau*(n): root of n = 4 pi tau* e^{4 tau*} (imp-3893 saddleTau) -----
function saddleTau(n) {
  let lo = 1e-9;
  let hi = 12;
  for (let it = 0; it < 300; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// -- The per-rung saddle-window overlap table (inner Simpson N = 9600) --------------------------
const N_RUNGS = [10, 20, 30, 40, 50, 60, 70, 80];
const INNER = 9600;
let worstRelDiff = 0;
const OVERLAP_TABLE = N_RUNGS.map((n) => {
  const tauStar = saddleTau(n);
  const aD = aDirect(tauStar, INNER);
  const aL = aLog(tauStar);
  const relDiff = Math.abs(aD - aL) / Math.abs(aD);
  if (relDiff > worstRelDiff) worstRelDiff = relDiff;
  return Object.freeze({ n, tauStar, aDirect: aD, aLog: aL, relDiff });
});
const tauLo = OVERLAP_TABLE[0].tauStar;
const tauHi = OVERLAP_TABLE[OVERLAP_TABLE.length - 1].tauStar;

// -- Direct-Simpson convergence to the log value at the hardest rung (n=80) --------------------
const CONVERGE_N = 80;
const CONVERGE_TAU = saddleTau(CONVERGE_N);
const CONVERGE_ALOG = aLog(CONVERGE_TAU);
const INNER_LADDER = [1200, 2400, 4800, 9600, 19200];
const CONVERGENCE_TABLE = INNER_LADDER.map((innerN, i) => {
  const aD = aDirect(CONVERGE_TAU, innerN);
  const rel = Math.abs(aD - CONVERGE_ALOG) / CONVERGE_ALOG;
  const prev = i === 0 ? null : Math.abs(aDirect(CONVERGE_TAU, INNER_LADDER[i - 1]) - CONVERGE_ALOG) / CONVERGE_ALOG;
  return Object.freeze({ innerN, relToLog: rel, ratioVsPrev: prev === null ? null : prev / rel });
});

// -- Verdict classifiers -----------------------------------------------------------------------
// (1) In the saddle window the DIRECT kernel is representable (non-underflowed) at every rung.
const directRepresentable = OVERLAP_TABLE.every((r) => r.aDirect > 0 && Number.isFinite(r.aDirect));
// (2) Both machineries agree to < 1e-6 relative per rung across tau* in [0.27,0.59].
const agreeToSubMicro = worstRelDiff < 1e-6;
// (3) The window is exactly the moment-support window tau*(10..80) in [0.27,0.59].
const windowIsSaddleSupport = tauLo > 0.27 && tauLo < 0.28 && tauHi > 0.59 && tauHi < 0.60;
// (4) The direct-Simpson residual falls at the ~16x-per-doubling Simpson O(h^4) rate (>= ~14x).
const simpsonConverges = CONVERGENCE_TABLE.slice(1).every((r) => r.ratioVsPrev > 14);

const verdict =
  directRepresentable && agreeToSubMicro && windowIsSaddleSupport && simpsonConverges
    ? 'IN-THE-SADDLE-WINDOW-tau*(10..80)-in-[0.27,0.59]-WHERE-THE-imp-3893-DIRECT-KERNEL-IS-REPRESENTABLE-AND-THE-MOMENTS-DRAW-SUPPORT,-THE-DIRECT-Phi(s)Phi(s+tau)-AND-THE-imp-33213-LOG-DOMAIN-GRADED-GL-A(tau)-AGREE-TO-<1e-6-RELATIVE-PER-RUNG(worst-~5.2e-7-at-n=80);-THE-DIRECT-SIMPSON-CONVERGES-TO-THE-LOG-VALUE-AT-THE-O(h^4)-~16x-PER-DOUBLING-RATE,-EXTENDING-imp-33213s-LOG-ONLY-OVERLAP-BELOW-THE-tau~1.37-UNDERFLOW-EDGE'
    : 'INDETERMINATE';

export const IMP33234_SADDLE_WINDOW_DIRECT_VS_LOG_A_CROSS_VALIDATION = Object.freeze({
  id: 'imp-33234-saddle-window-direct-vs-log-a-cross-validation',
  ticket: 'imp-33234',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  crossValidatesModules: [
    'imp-3893-model-fidelity-moment-discrepancy.js',
    'imp-3850-a-weight-dual-path-tau25-30-reconciliation.js',
    'imp-33213-moment-weight-vs-dual-path-a-cross-validation.js',
  ],

  summary:
    'EXTENDS the imp-33213 direct-vs-log A(tau) cross-validation BELOW the tau ~ 1.37 direct-underflow edge, ' +
    'into the saddle window tau*(n) in [0.27,0.59] (n=10..80, the imp-3646 root of n = 4 pi tau* e^{4 tau*}) ' +
    'where the imp-3893 DIRECT kernel Phi(s)Phi(s+tau) is representable AND the imp-3871/imp-3893 moments draw ' +
    'their support. imp-33213 could cross-tabulate the direct and log-domain A(tau) forms only at tau in ' +
    '{1.5,2,2.5,3}, where the direct double kernel underflows to 0 -- so the two machineries were compared only ' +
    'in the log domain, at tau the moments never sample. Here, per rung, A_direct (int_0^7 phiKernel(s)phiKernel(s+tau) ds, ' +
    'inner Simpson N=9600) and A_log (exp(-negLnA) from the imp-33213 independent graded-GL grade5/300/hi10) agree to ' +
    'worst ~5.2e-7 relative (n=80, A~1.3e-15), tightening to ~2.5e-9 at n=10. The residual is dominated by the DIRECT ' +
    'uniform-Simpson resolution: at n=80 it falls at the textbook Simpson O(h^4) ~16x-per-doubling rate ' +
    '(2.01e-3 -> 1.32e-4 -> 8.32e-6 -> 5.21e-7 -> 3.26e-8 over inner N = 1200..19200), converging to the log value. ' +
    'The two A(tau) machineries thus coincide directly on the exact window the moment weight is built from. ' +
    'CROSS-VALIDATION/CONSISTENCY, RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) ' +
    'untouched; no RH verdict, no QED; Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    saddle: 'tau*(n) = root of n = 4 pi tau* e^{4 tau*} (imp-3646/imp-3893 saddleTau, 300-step bisection), n = 10..80',
    directForm: 'A_direct(tau) = int_0^7 phiKernel(s)phiKernel(s+tau) ds by uniform composite Simpson, inner N = 9600 (imp-3893)',
    logForm: 'A_log(tau) = exp(-negLnA(tau)), negLnA from imp-33213s INDEPENDENT log-domain graded-GL (grade 5, 300 panels, hi=10)',
    perRung: 'relDiff = |A_direct - A_log| / |A_direct| tabulated at each saddle rung tau*(10..80)',
    convergence: 'at n=80 the direct-Simpson residual-vs-log is measured over inner N = 1200,2400,4800,9600,19200 to expose the O(h^4) rate',
    selfComputing: true,
  }),

  measured: Object.freeze({
    nRungs: N_RUNGS,
    innerSimpsonN: INNER,
    overlapTable: Object.freeze(OVERLAP_TABLE),
    tauWindowLo: tauLo,
    tauWindowHi: tauHi,
    worstRelDiff,
    convergenceRung: CONVERGE_N,
    convergenceTable: Object.freeze(CONVERGENCE_TABLE),
    directRepresentable,
    agreeToSubMicro,
    windowIsSaddleSupport,
    simpsonConverges,
    verdict,
  }),

  interpretation: Object.freeze({
    fillsTheOverlap:
      'imp-33213 cross-checked the direct and log-domain A(tau) forms only at tau in {1.5,2,2.5,3}, where the ' +
      'imp-3893 direct double kernel underflows to exactly 0 -- so the comparison lived entirely in the log ' +
      'domain, at tau the moments never sample. This module runs the SAME comparison at tau*(10..80) in ' +
      '[0.27,0.59], the moment-support window, where the direct kernel is representable: the two agree to ' +
      '< 1e-6 relative per rung, closing the gap imp-33213 left open.',
    residualIsQuadratureNotKernel:
      'The per-rung disagreement is NOT a kernel mismatch (the kernels are bit-identical, imp-33213 ~4.3e-16): it ' +
      'is the finite resolution of the DIRECT uniform Simpson. At n=80 the residual-vs-log falls ~16x per inner ' +
      'doubling (the O(h^4) signature) toward the graded-GL value, so both forms converge to the SAME A(tau).',
    sameWeightWhereItMatters:
      'The moment machinery draws its weight from tau*(n) in [0.27,0.59]; on exactly that window the direct and ' +
      'log-domain A(tau) coincide. The cross-validation now holds both above the underflow edge (log-only, ' +
      'imp-33213) and below it (direct-representable, here).',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Cross-validates two evaluations (direct uniform-Simpson vs factored log-domain graded-GL) of a fixed ' +
      'autocorrelation weight A(tau) on the saddle-support window, a magnitude used inside a mass-feasibility ' +
      'diagnostic. It establishes NO operator positivity. Grid-CONVERGENCE consistency only -- not a certified bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -----------------------------------------------------------------------
export const IMP33234_SADDLE_WINDOW_DIRECT_VS_LOG_A_CROSS_VALIDATION_ASSERTIONS = [
  {
    id: 'imp33234-direct-kernel-representable-in-saddle-window',
    why: 'Below the tau ~ 1.37 underflow edge the imp-3893 DIRECT kernel must be representable (A_direct > 0, ' +
         'finite) at every saddle rung tau*(10..80) -- the premise that makes a direct-vs-log comparison possible.',
    holds: () => directRepresentable,
  },
  {
    id: 'imp33234-direct-and-log-agree-sub-micro-per-rung',
    why: 'THE PURPOSE: on the saddle-support window tau*(10..80) in [0.27,0.59] the DIRECT Phi(s)Phi(s+tau) ' +
         'autocorrelation and the imp-33213 log-domain graded-GL A(tau) must agree to < 1e-6 relative per rung.',
    holds: () => agreeToSubMicro && OVERLAP_TABLE.length === 8,
  },
  {
    id: 'imp33234-window-is-the-moment-support-window',
    why: 'The rungs must span exactly the imp-3893 saddle support tau*(10) ~ 0.27 to tau*(80) ~ 0.59, the window ' +
         'from which the moments draw their weight.',
    holds: () => windowIsSaddleSupport,
  },
  {
    id: 'imp33234-direct-simpson-converges-at-order-four',
    why: 'The per-rung residual must be a quadrature artifact, not a kernel mismatch: at n=80 the direct-Simpson ' +
         'residual-vs-log must fall at the Simpson O(h^4) ~16x-per-doubling rate (>= ~14x each step), converging ' +
         'to the log-domain value.',
    holds: () => simpsonConverges,
  },
  {
    id: 'imp33234-verdict-records-the-below-edge-extension',
    why: 'The classified verdict must record the below-underflow-edge direct-vs-log agreement and the O(h^4) ' +
         'convergence -- not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33234-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: cross-validation/consistency only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33234_SADDLE_WINDOW_DIRECT_VS_LOG_A_CROSS_VALIDATION.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33234_SADDLE_WINDOW_DIRECT_VS_LOG_A_CROSS_VALIDATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33234-saddle-window-direct-vs-log-a-cross-validation assertion failed: ${assertion.id}`);
  }
}

export default IMP33234_SADDLE_WINDOW_DIRECT_VS_LOG_A_CROSS_VALIDATION;
