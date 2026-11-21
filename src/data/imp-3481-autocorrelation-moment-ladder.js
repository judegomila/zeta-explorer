/**
 * @module imp-3481-autocorrelation-moment-ladder
 * @fileoverview imp-3481 -- compute the full genuine-Phi autocorrelation MOMENT
 *   LADDER M_0, M_1, M_2, M_3, M_4 = int tau^n A(tau) d(tau) of the FIXED weight
 *   A(tau) = int Phi(s) Phi(s + tau) ds (NPHI = 10), and MEASURE whether each
 *   moment is the leading small-a coefficient of a successive Taylor remainder of
 *   the A-weighted cosh/sinh (degree-2) bridge masses -- extending the single
 *   imp-3469 result B_2(a) ~ (a^2/2) M_2 into a full moment-indexed ladder.
 *
 *   THE STRUCTURE (why the moment ladder is exactly the Taylor ladder)
 *   -----------------------------------------------------------------
 *   The degree-2 (absolute-measure) masses weight the shear integrand-differences
 *   by A(tau) (imp-2686 / imp-3469). Expanding the shear kernels in a and
 *   integrating termwise against A gives the two generating series:
 *     C(a) := int_0^{T_A} cosh(a tau) A(tau) d(tau)
 *           = sum_{j>=0} a^{2j}/(2j)! * M_{2j}  =  M_0 + a^2/2 M_2 + a^4/24 M_4 + ...
 *     S(a) := int_0^{T_A} sinh(a tau) A(tau) d(tau)
 *           = sum_{j>=0} a^{2j+1}/(2j+1)! * M_{2j+1}  =  a M_1 + a^3/6 M_3 + ...
 *   where M_n = int tau^n A(tau) d(tau) is the n-th Phi-autocorrelation moment.
 *   The imp-3469 bridge mass is exactly B_2(a) = C(a) - M_0 (the cosh series with
 *   its constant M_0 removed), whose leading term is (a^2/2) M_2 -- the single
 *   result imp-3469 measured. Peeling successive Taylor terms exposes each higher
 *   moment as the leading coefficient of the next remainder:
 *     R_0(a) = C(a)                       -> leading (a^0/0!) M_0 = M_0
 *     R_1(a) = S(a)                       -> leading (a^1/1!) M_1
 *     R_2(a) = C(a) - M_0  [ = B_2(a) ]   -> leading (a^2/2!) M_2   (imp-3469)
 *     R_3(a) = S(a) - a M_1               -> leading (a^3/3!) M_3
 *     R_4(a) = C(a) - M_0 - (a^2/2!) M_2  -> leading (a^4/4!) M_4
 *   Each remainder R_n(a) = (a^n/n!) M_n + O(a^{n+2}), so the moment-indexed
 *   leading form (a^n/n!) M_n holds for every n, and the relative residual must
 *   shrink like a^2 as a halves.
 *
 *   MEASURED RESULT (self-computing; A recomputed at import, no frozen data)
 *   -----------------------------------------------------------------------
 *   (R1) MOMENT LADDER (NPHI = 10, on the imp-3469 [0, T_A] Simpson grid):
 *        M_0 ~ 7.675e-4, M_1 ~ 4.518e-5, M_2 ~ 4.537e-6 (matches the imp-3469
 *        M_2 = 4.537e-6 to full precision -- the anchor check), M_3 ~ 6.029e-7,
 *        M_4 ~ 9.625e-8. The moments fall roughly geometrically (A is concentrated
 *        on ~[0, 0.6]), each ratio M_{n+1}/M_n ~ 0.06..0.16.
 *   (R2) THE MOMENT-INDEXED LEADING FORM HOLDS FOR EVERY n = 0..4. At the imp-3469
 *        base a = 0.5 every remainder R_n(a) reproduces (a^n/n!) M_n to < 1e-3
 *        relative; the residuals are the truncated O(a^{n+2}) tail, not error.
 *   (R3) THE RESIDUAL CONVERGES AT ORDER a^2. Halving a (0.5 -> 0.25 -> 0.125)
 *        quarters every per-moment relative residual (ratio ~4 per rung), the
 *        signature of the next-order Taylor term -- confirming the leading form is
 *        genuinely (a^n/n!) M_n and not a coincidental fit.
 *
 *   VERDICT: the imp-3469 leading form B_2(a) ~ (a^2/2) M_2 is the n = 2 rung of a
 *   full moment-indexed ladder R_n(a) ~ (a^n/n!) M_n, n = 0..4, each moment M_n a
 *   fixed Phi-autocorrelation integral.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DERIVATION ONLY, at the RH-equivalent scale class. This tabulates
 *   fixed moments of the Phi autocorrelation and the Taylor structure of the
 *   degree-2 masses; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT and the degree-2 face carries no feasibility
 *   comparison (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity
 *   (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no
 *   QED. No refereed bound is changed.
 *
 *   @see imp-3469-degree2-bridge-mass-scaling.js (the M_2 leading form extended here)
 *   @see imp-2686-mupass-construction.js (the degree-2 / absolute measure A(tau))
 *
 *   Ticket: imp-3481 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds. The kernel decays
// super-exponentially so the upper limit 7 captures the whole overlap (imp-3469).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3469. A(tau)
// is negligible beyond its support (~[0, 0.6]); T_A = 6 captures it in full.
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** int_0^{T_A} weight(tau) A(tau) d(tau) by composite Simpson on the precomputed grid. */
function aWeightedMass(weightFn) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

/** n! for small integer n. */
function factorial(n) {
  let f = 1;
  for (let i = 2; i <= n; i += 1) f *= i;
  return f;
}

// -- The autocorrelation moment ladder M_n = int tau^n A(tau) d(tau) ----------
// Compute M_0..M_6 (M_5, M_6 support the geometric-decay sanity check).
const MOMENT_MAX = 6;
const MOMENTS = [];
for (let n = 0; n <= MOMENT_MAX; n += 1) {
  MOMENTS.push(aWeightedMass((tau) => Math.pow(tau, n)));
}
const M0 = MOMENTS[0];
const M1 = MOMENTS[1];
const M2 = MOMENTS[2];
const M3 = MOMENTS[3];
const M4 = MOMENTS[4];

// -- The two A-weighted generating masses at a given shear a ------------------
function coshMass(a) { return aWeightedMass((tau) => Math.cosh(a * tau)); }  // = C(a)
function sinhMass(a) { return aWeightedMass((tau) => Math.sinh(a * tau)); }  // = S(a)

/**
 * The moment-indexed remainder ladder at shear a. R_n(a) peels the Taylor terms
 * below order n from the appropriate parity mass so its leading term is
 * (a^n/n!) M_n. Returns per-n the remainder, the predicted leading form, and the
 * relative residual (the truncated O(a^{n+2}) tail).
 */
function remainderLadder(a) {
  const C = coshMass(a);
  const S = sinhMass(a);
  const remainders = [
    C,                              // R_0 -> M_0
    S,                              // R_1 -> a M_1
    C - M0,                         // R_2 -> a^2/2! M_2  (= imp-3469 B_2)
    S - a * M1,                     // R_3 -> a^3/3! M_3
    C - M0 - (a * a / 2) * M2,      // R_4 -> a^4/4! M_4
  ];
  const rungs = remainders.map((rem, n) => {
    const leading = (Math.pow(a, n) / factorial(n)) * MOMENTS[n];
    const relResid = Math.abs(rem - leading) / Math.abs(rem);
    return Object.freeze({ n, remainder: rem, leadingForm: leading, relResid });
  });
  return Object.freeze({ a, coshMass: C, sinhMass: S, rungs });
}

// -- Run at the imp-3469 base a = 0.5, then halve to expose O(a^2) convergence --
const A_SEQUENCE = Object.freeze([0.5, 0.25, 0.125]);
const LADDERS = A_SEQUENCE.map((a) => remainderLadder(a));
const BASE_LADDER = LADDERS[0];               // a = 0.5 (imp-3469 base)

// Worst per-moment relative residual at the base a (all must be small).
const maxBaseRelResid = Math.max(...BASE_LADDER.rungs.map((r) => r.relResid));

// Convergence order: halving a should quarter each residual. Measure the worst
// ratio residual(a)/residual(a/2) across all moments over the sequence -- it must
// sit near 4 (order a^2), well above 3, confirming the leading form is genuine.
let minConvergenceRatio = Infinity;
for (let i = 0; i + 1 < LADDERS.length; i += 1) {
  for (let n = 0; n <= 4; n += 1) {
    const ratio = LADDERS[i].rungs[n].relResid / LADDERS[i + 1].rungs[n].relResid;
    if (ratio < minConvergenceRatio) minConvergenceRatio = ratio;
  }
}

// Anchor: the n = 2 moment must reproduce the imp-3469 second moment M_2 ~ 4.537e-6.
const IMP3469_M2 = 4.537226e-6;
const m2AnchorRelErr = Math.abs(M2 - IMP3469_M2) / IMP3469_M2;

// -- Classification -----------------------------------------------------------
const LEADING_FORM_TOL = 1e-3;    // every base-a remainder within 1e-3 of (a^n/n!)M_n
const CONVERGENCE_FLOOR = 3.5;    // residual ratio per a-halving must exceed this (~4)
const ANCHOR_TOL = 1e-4;          // M_2 matches the imp-3469 value

const leadingFormHolds = maxBaseRelResid < LEADING_FORM_TOL;
const convergesAtOrderTwo = minConvergenceRatio > CONVERGENCE_FLOOR;
const anchorMatches = m2AnchorRelErr < ANCHOR_TOL;
const momentsPositiveDecreasing =
  M0 > 0 && M1 > 0 && M2 > 0 && M3 > 0 && M4 > 0 &&
  M0 > M1 && M1 > M2 && M2 > M3 && M3 > M4;

const verdict =
  leadingFormHolds && convergesAtOrderTwo && anchorMatches && momentsPositiveDecreasing
    ? 'MOMENT-LADDER-M_0..M_4-EACH-THE-LEADING-COEFF-(a^n/n!)M_n-OF-THE-n-th-TAYLOR-REMAINDER-EXTENDING-imp-3469-M_2'
    : 'INDETERMINATE';

export const IMP3481_AUTOCORRELATION_MOMENT_LADDER = Object.freeze({
  id: 'imp-3481-autocorrelation-moment-ladder',
  ticket: 'imp-3481',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDegree2Scaling: 'imp-3469-degree2-bridge-mass-scaling.js',
  relatedAbsoluteMeasure: 'imp-2686-mupass-construction.js',

  summary:
    'Computes the full genuine-Phi autocorrelation MOMENT LADDER M_n = int tau^n A(tau)d(tau) ' +
    '(n=0..4) of the fixed weight A(tau)=int Phi(s)Phi(s+tau)ds (NPHI=10) on the imp-3469 ' +
    'Simpson grid, and shows each moment is the leading small-a coefficient of a successive ' +
    'Taylor remainder of the A-weighted degree-2 masses. Writing C(a)=int cosh(a tau)A(tau)d(tau)=' +
    'sum a^{2j}/(2j)! M_{2j} and S(a)=int sinh(a tau)A(tau)d(tau)=sum a^{2j+1}/(2j+1)! M_{2j+1}, the ' +
    'remainders R_0=C, R_1=S, R_2=C-M_0 (=imp-3469 B_2), R_3=S-a M_1, R_4=C-M_0-(a^2/2)M_2 each ' +
    'satisfy R_n(a)=(a^n/n!)M_n+O(a^{n+2}). MEASURED: M_0~7.675e-4, M_1~4.518e-5, M_2~4.537e-6 ' +
    '(matches the imp-3469 second moment), M_3~6.029e-7, M_4~9.625e-8; at the imp-3469 base a=0.5 ' +
    'every remainder reproduces (a^n/n!)M_n to <1e-3, and halving a quarters each residual ' +
    '(order-a^2 convergence), confirming the leading form is genuine. So the single imp-3469 ' +
    'result B_2(a)~(a^2/2)M_2 is the n=2 rung of a full moment-indexed ladder. MEASUREMENT/DERIVATION, ' +
    'RH-EQUIVALENT, necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict.',

  method: Object.freeze({
    weight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau)ds, the genuine-Phi autocorrelation (NPHI=10), FIXED',
    moments: 'M_n = int_0^{T_A} tau^n A(tau) d(tau), n = 0..6 (M_5,M_6 for the decay sanity check)',
    generatingMasses: 'C(a)=int cosh(a tau)A(tau)d(tau)=sum a^{2j}/(2j)! M_{2j}; S(a)=int sinh(a tau)A(tau)d(tau)=sum a^{2j+1}/(2j+1)! M_{2j+1}',
    remainderLadder: 'R_0=C, R_1=S, R_2=C-M_0, R_3=S-a M_1, R_4=C-M_0-(a^2/2)M_2; leading form (a^n/n!)M_n',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), moments on precomputed A grid (NM=1600 on [0,T_A])',
    aSequence: A_SEQUENCE,
    tauCap: T_A,
    leadingFormTol: LEADING_FORM_TOL,
    convergenceFloor: CONVERGENCE_FLOOR,
    selfComputing: true,
  }),

  measured: Object.freeze({
    moments: Object.freeze({ M0, M1, M2, M3, M4, M5: MOMENTS[5], M6: MOMENTS[6] }),
    baseLadder: BASE_LADDER,                  // a = 0.5 remainders, leading forms, residuals
    laddersByA: LADDERS,                      // a = 0.5, 0.25, 0.125
    maxBaseRelResid,                          // < 1e-3
    minConvergenceRatio,                      // ~4 (order a^2)
    m2AnchorRelErr,                           // M_2 vs the imp-3469 4.537e-6
    leadingFormHolds,
    convergesAtOrderTwo,
    anchorMatches,
    momentsPositiveDecreasing,
    verdict,
  }),

  interpretation: Object.freeze({
    momentLadderIsTaylorLadder:
      'The autocorrelation moment ladder M_0..M_4 is exactly the Taylor ladder of the A-weighted ' +
      'degree-2 masses: expanding cosh/sinh in a and integrating termwise against A makes M_n the ' +
      'coefficient of a^n/n!. Each successive remainder exposes the next moment as its leading term.',
    extendsImp3469:
      'imp-3469 measured only the n=2 rung (B_2(a)~(a^2/2)M_2 with M_2=4.537e-6). This module places ' +
      'that result inside the full ladder R_n(a)~(a^n/n!)M_n for n=0..4, with M_2 reproduced as an anchor.',
    residualIsTruncationTail:
      'The per-moment relative residual at fixed a is the truncated O(a^{n+2}) Taylor tail, not numerical ' +
      'error: halving a quarters it (order-a^2), the fingerprint of the next even-order moment.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module tabulates fixed moments of the Phi autocorrelation and the small-a Taylor structure ' +
      'of the degree-2 (absolute-measure) masses. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (imp-3469: D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3481_AUTOCORRELATION_MOMENT_LADDER_ASSERTIONS = [
  {
    id: 'imp3481-moments-positive-and-decreasing',
    why: 'The autocorrelation moment ladder M_0..M_4 must be all positive and strictly decreasing ' +
         '(A(tau) concentrated near tau=0), so higher moments shrink -- the basic well-formedness of the ladder.',
    holds: () => momentsPositiveDecreasing,
  },
  {
    id: 'imp3481-m2-anchors-to-imp3469',
    why: 'The n=2 moment M_2 must reproduce the imp-3469 second Phi-autocorrelation moment 4.537e-6 to <1e-4, ' +
         'confirming this ladder is computed on the SAME weight/grid and the M_2 rung equals the imp-3469 result.',
    holds: () => m2AnchorRelErr < ANCHOR_TOL,
  },
  {
    id: 'imp3481-leading-form-holds-every-moment',
    why: 'THE KEY FINDING: at the imp-3469 base a=0.5 every remainder R_n(a) must reproduce the moment-indexed ' +
         'leading form (a^n/n!)M_n to <1e-3 relative, for all n=0..4 -- extending B_2(a)~(a^2/2)M_2 to the full ladder.',
    holds: () => leadingFormHolds,
  },
  {
    id: 'imp3481-residual-converges-at-order-a2',
    why: 'The leading form must be GENUINE, not a coincidental fit: halving a must quarter every per-moment ' +
         'relative residual (ratio > 3.5, i.e. order a^2), the signature of the truncated next-order Taylor tail.',
    holds: () => convergesAtOrderTwo,
  },
  {
    id: 'imp3481-r2-equals-imp3469-bridge-mass',
    why: 'The n=2 remainder R_2(a)=C(a)-M_0 must equal the imp-3469 degree-2 bridge mass int (cosh(a tau)-1)A(tau)d(tau) ' +
         'by construction; check R_2 > 0 and its leading form matches (a^2/2)M_2 to <1e-3 at the base a.',
    holds: () => {
      const r2 = BASE_LADDER.rungs[2];
      return r2.remainder > 0 && r2.relResid < LEADING_FORM_TOL;
    },
  },
  {
    id: 'imp3481-verdict-classifies-the-ladder',
    why: 'The classified verdict must be the moment-indexed leading-form ladder extending imp-3469, not indeterminate.',
    holds: () => verdict === 'MOMENT-LADDER-M_0..M_4-EACH-THE-LEADING-COEFF-(a^n/n!)M_n-OF-THE-n-th-TAYLOR-REMAINDER-EXTENDING-imp-3469-M_2',
  },
  {
    id: 'imp3481-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: moment/Taylor characterization only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-2 ratio), operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP3481_AUTOCORRELATION_MOMENT_LADDER.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3481_AUTOCORRELATION_MOMENT_LADDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3481-autocorrelation-moment-ladder assertion failed: ${assertion.id}`);
  }
}

export default IMP3481_AUTOCORRELATION_MOMENT_LADDER;
