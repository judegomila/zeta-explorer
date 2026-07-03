/**
 * @module imp-3509-cosh-cancellation-safety-k-ladder
 * @fileoverview imp-3509 -- CERTIFY the imp-3490 R4 catastrophic-cancellation
 *   safety of the near-cancelling cosh(a tau) - 1 term as a CLOSED FUNCTION of
 *   the ladder index k, not just at the single k = 24 rung.
 *
 *   THE IMP-3490 R4 CLAIM UNDER TEST
 *   --------------------------------
 *   imp-3490 stress-tested the degree-2 bridge mass B_2(a, U) = int (cosh(a tau)
 *   - 1) A(tau) d(tau) on the k-ladder a -> a0/k, U -> k*u0. At the LARGEST rung
 *   k = 24 it noted the worst small argument is a*T_A <= 0.125, so cosh(a tau) - 1
 *   ~ 7.8e-3 with catastrophic-cancellation relative error ~ eps/(cosh - 1) ~
 *   3e-14, well below the O(a^2) tail. But that estimate was recorded at ONE rung
 *   only. This module derives the cancellation-error bound as a closed function
 *   of k, measures it across the ladder, and locates the crossover (if any).
 *
 *   THE DERIVATION (closed form in k)
 *   ---------------------------------
 *   On rung k the worst small cosh argument is x_k = a*T_A = a0*T_A/k (T_A = 6 the
 *   A-support cap; larger k => smaller a => smaller x). Forming g = cosh(x) - 1 by
 *   fl(cosh(x)) - 1 with |fl(cosh(x)) - cosh(x)| <= eps*cosh(x): for x with
 *   1 <= cosh(x) < 2 the subtraction of 1 is exact (Sterbenz, same binade), so the
 *   whole error is the cosh rounding. Hence the RELATIVE cancellation error obeys
 *       rho(k) = eps*cosh(x_k)/(cosh(x_k) - 1)  >=  eps/(cosh(x_k) - 1),
 *   and the imp-3490 R4 headline form rho_k = eps/(cosh(x_k) - 1) is its small-x
 *   limit (cosh -> 1). Since cosh(x) - 1 ~ x^2/2 for small x,
 *       rho_k  ~  eps / (x_k^2/2)  =  2*eps*k^2 / (a0*T_A)^2   -- GROWS like k^2.
 *   The competing O(a^2) tail is the relative gap of B_2 from its leading form
 *   (a^2/2)M_2 (imp-3488/imp-3501: B_2 = (a^2/2)M_2 + (a^4/24)M_4 + O(a^6)):
 *       tail(k) = (a^4/24)M_4 / ((a^2/2)M_2) = (a^2/12)(M_4/M_2)
 *               = (a0^2/(12 k^2))(M_4/M_2)                     -- SHRINKS like 1/k^2.
 *   So the safety margin tail/rho ~ (a0^4 M_4)/(24 eps M_2 (a0 T_A)^2 ... ) collapses
 *   like k^{-4}. Setting rho(k) = tail(k) gives the closed-form crossover
 *       k* = [ a0^4 * T_A^2 * M_4 / (24 * eps * M_2) ]^{1/4}.
 *   Note k* scales like a0, but the crossover VALUE rho(k*) = tail(k*) is cell-
 *   independent (a0/k* is constant), ~1.48e-10.
 *
 *   MEASURED RESULT (extends imp-3490 R4; safe on EVERY tested rung)
 *   ---------------------------------------------------------------
 *   (M1) rho(k) grows MONOTONICALLY in k exactly as the k^2 law predicts: from
 *        1.64e-16 (k = 2) to 2.84e-14 (k = 24) on cell S3, matching the closed
 *        form 2*eps*k^2/(a0*T_A)^2 to <1% at k = 24. The single-rung imp-3490 R4
 *        value ~3e-14 at k = 24 is reproduced.
 *   (M2) tail(k) shrinks MONOTONICALLY in k like 1/k^2: from 1.11e-4 (k = 2) to
 *        7.67e-7 (k = 24) on S3, the imp-3490 R2 leading-form error.
 *   (M3) rho STAYS ORDERS BELOW THE TAIL ON EVERY RUNG. The margin tail/rho runs
 *        from ~6.7e11 (k = 2) down to ~2.7e7 (k = 24) on S3 and ~2.6e11 -> ~1.1e7
 *        on S4 -- always at least SEVEN orders of magnitude. The empirically
 *        realized cancellation error (measured against the cancellation-free
 *        reference 2*sinh(x/2)^2) never exceeds the derived bound rho on any rung.
 *   (M4) THE CROSSOVER IS ASTRONOMICALLY FAR OUT. k* = 1729.97 (S3) / 1383.98 (S4)
 *        -- roughly 60-70x beyond the largest tested rung k = 24 -- and at k* both
 *        rho and tail equal ~1.48e-10 (closed form verified). The cancellation
 *        error would only overtake the O(a^2) tail near k ~ 1400-1730, deep in a
 *        regime where a0/k ~ 3e-4 is itself unphysically tiny.
 *
 *   VERDICT: the imp-3490 R4 cancellation-safety observation is NOT a single-rung
 *   coincidence -- it holds as a closed k^{-4} margin law across the whole ladder,
 *   with the cancellation error provably orders below the O(a^2) tail through
 *   k = 24 and the crossover pushed out to k* ~ 1400-1730.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / CERTIFICATION ONLY, at the RH-equivalent scale class. This
 *   certifies the FLOATING-POINT cancellation-safety of the degree-2 integrand
 *   across k; it establishes NO operator positivity. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT and the degree-2 face carries no feasibility
 *   comparison at all (imp-3469 D_2 = 0). The operator-level K_a >= 0 sign-
 *   positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH
 *   verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3490-degree2-exponent-wide-k-ladder.js (R4 single-rung estimate certified here)
 *   @see imp-3488-degree2-miss-factor-closed-form.js (leading form (a^2/2)M_2)
 *   @see imp-3501-moment-ladder-general-derivation.js (the O(a^2) tail moments M_2, M_4)
 *
 *   Ticket: imp-3509 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation
const EPS = Number.EPSILON;                     // 2.220446049250313e-16, unit-of-least-precision

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

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (imp-3469).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on a FIXED fine Simpson grid over [0, T_A] ONCE (imp-3469).
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** Autocorrelation moment M_n = int_0^{T_A} tau^n A(tau) d(tau) (imp-3481). */
function moment(n) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * Math.pow(tau, n) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

// The two moments governing the leading O(a^2) tail of B_2 (imp-3488/imp-3501).
const M2 = moment(2);                            // ~4.5372e-6
const M4 = moment(4);                            // ~9.6253e-8
const M4_OVER_M2 = M4 / M2;                      // ~0.021214

/**
 * Cancellation-error bound and O(a^2) tail as closed functions of the ladder
 * index k for a base cell (a0, u0). x_k = a0*T_A/k is the worst small cosh
 * argument; rho(k) = eps/(cosh(x_k) - 1) is the imp-3490 R4 relative cancellation
 * error; rhoRigorous multiplies by cosh(x_k) (the strict Sterbenz bound); tail(k)
 * = (a^2/12)(M_4/M_2) is the leading-form relative gap.
 */
function cancellationLadder(a0, u0, kValues) {
  const rungs = kValues.map((k) => {
    const a = a0 / k;
    const xk = a * T_A;                           // worst cosh argument on this rung
    const coshMinusOne = Math.cosh(xk) - 1;       // formed by direct subtraction
    const rho = EPS / coshMinusOne;               // imp-3490 R4 headline form
    const rhoRigorous = (EPS * Math.cosh(xk)) / coshMinusOne; // strict upper bound
    const rhoSmallX = (2 * EPS * k * k) / (a0 * T_A) / (a0 * T_A); // 2 eps k^2 / (a0 T_A)^2
    const tail = ((a * a) / 12) * M4_OVER_M2;     // leading O(a^2) tail, ~1/k^2
    // Empirically realized cancellation error vs cancellation-free reference
    // cosh(x) - 1 = 2 sinh^2(x/2) (Math.sinh is accurate for small argument).
    const ref = 2 * Math.sinh(xk / 2) ** 2;
    const empiricalRelErr = ref > 0 ? Math.abs(coshMinusOne - ref) / ref : 0;
    return Object.freeze({
      k, a, xk, coshMinusOne,
      rho,                                        // grows like k^2
      rhoRigorous,                                // strict Sterbenz bound (>= rho)
      rhoSmallX,                                  // 2 eps k^2/(a0 T_A)^2 approximation
      tail,                                       // shrinks like 1/k^2
      marginTailOverRho: tail / rho,              // safety margin, shrinks like k^{-4}
      empiricalRelErr,                            // realized, must not exceed rhoRigorous
    });
  });
  // Closed-form crossover k* solving rho(k) = tail(k):
  //   2 eps k^2/(a0 T_A)^2 = (a0^2/12)(M_4/M_2)/k^2
  //   => k^4 = a0^4 T_A^2 M_4 / (24 eps M_2).
  const kStar = Math.pow((a0 ** 4 * T_A * T_A * M4) / (24 * EPS * M2), 0.25);
  const xStar = (a0 / kStar) * T_A;
  const rhoAtStar = EPS / (Math.cosh(xStar) - 1);
  const tailAtStar = (((a0 / kStar) ** 2) / 12) * M4_OVER_M2;
  const rhoMonotoneUp = rungs.every((r, i) => i === 0 || r.rho > rungs[i - 1].rho);
  const tailMonotoneDown = rungs.every((r, i) => i === 0 || r.tail < rungs[i - 1].tail);
  const minMargin = Math.min(...rungs.map((r) => r.marginTailOverRho));
  const maxSmallXRelGap = Math.max(...rungs.map((r) => Math.abs(r.rho / r.rhoSmallX - 1)));
  const empiricalWithinBound = rungs.every((r) => r.empiricalRelErr <= r.rhoRigorous);
  return Object.freeze({
    a0, u0, rungs, kStar, rhoAtStar, tailAtStar,
    rhoMonotoneUp, tailMonotoneDown, minMargin, maxSmallXRelGap, empiricalWithinBound,
    crossoverVerified: Math.abs(rhoAtStar - tailAtStar) / tailAtStar < 1e-6,
  });
}

// -- The imp-3490 ladder: original {2,3,4,6,8} plus the wide {12,16,24} --------
const K_LADDER = Object.freeze([2, 3, 4, 6, 8, 12, 16, 24]);
const LADDER_S3 = cancellationLadder(0.5, 6, K_LADDER);   // base (0.5,6), s = 3
const LADDER_S4 = cancellationLadder(0.4, 10, K_LADDER);  // base (0.4,10), s = 4

// -- Classification -----------------------------------------------------------
const MARGIN_FLOOR = 1e6;       // cancellation error is >= 1e6x below the tail on every rung
const SMALLX_TOL = 1e-2;        // rho matches 2 eps k^2/(a0 T_A)^2 to <1% by k = 24
const KSTAR_FLOOR = 1000;       // the crossover is pushed out beyond k = 1000 (>> 24)

const safeOnEveryRung =
  LADDER_S3.minMargin > MARGIN_FLOOR && LADDER_S4.minMargin > MARGIN_FLOOR;
const rhoGrowsTailShrinks =
  LADDER_S3.rhoMonotoneUp && LADDER_S3.tailMonotoneDown &&
  LADDER_S4.rhoMonotoneUp && LADDER_S4.tailMonotoneDown;
const smallXLawHolds =
  LADDER_S3.rungs[LADDER_S3.rungs.length - 1].rho /
    LADDER_S3.rungs[LADDER_S3.rungs.length - 1].rhoSmallX - 1 < SMALLX_TOL;
const empiricalBounded =
  LADDER_S3.empiricalWithinBound && LADDER_S4.empiricalWithinBound;
const crossoverFarOut =
  LADDER_S3.kStar > KSTAR_FLOOR && LADDER_S4.kStar > KSTAR_FLOOR &&
  LADDER_S3.crossoverVerified && LADDER_S4.crossoverVerified;

const verdict =
  safeOnEveryRung && rhoGrowsTailShrinks && smallXLawHolds && empiricalBounded && crossoverFarOut
    ? 'COSH-CANCELLATION-SAFE-ACROSS-k-LADDER-rho~k^2-BELOW-O(a^2)-TAIL~1/k^2-CROSSOVER-k*~1400-1730-FAR-BEYOND-k=24'
    : 'INDETERMINATE';

export const IMP3509_COSH_CANCELLATION_SAFETY_K_LADDER = Object.freeze({
  id: 'imp-3509-cosh-cancellation-safety-k-ladder',
  ticket: 'imp-3509',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedStressTest: 'imp-3490-degree2-exponent-wide-k-ladder.js',
  relatedClosedForm: 'imp-3488-degree2-miss-factor-closed-form.js',
  relatedMoments: 'imp-3501-moment-ladder-general-derivation.js',

  summary:
    'Certifies the imp-3490 R4 catastrophic-cancellation safety of the near-cancelling cosh(a tau)-1 term ' +
    'as a CLOSED FUNCTION of the ladder index k, not just the single k=24 rung. On rung k the worst small ' +
    'argument is x_k=a0*T_A/k, so the relative cancellation error rho(k)=eps/(cosh(x_k)-1)~2 eps k^2/(a0 T_A)^2 ' +
    'GROWS like k^2, while the competing leading O(a^2) tail (a^2/12)(M_4/M_2)~1/k^2 SHRINKS -- so the safety ' +
    'margin tail/rho collapses like k^{-4}. Setting rho(k)=tail(k) gives the closed-form crossover ' +
    'k*=[a0^4 T_A^2 M_4/(24 eps M_2)]^{1/4}. MEASURED on the imp-3490 ladder {2,3,4,6,8,12,16,24} from both ' +
    'cells (0.5,6),s=3 and (0.4,10),s=4: rho grows monotonically (1.64e-16 at k=2 to 2.84e-14 at k=24 on S3, ' +
    'matching 2 eps k^2/(a0 T_A)^2 to <1%), the tail shrinks monotonically (1.11e-4 to 7.67e-7), the margin ' +
    'stays at least SEVEN orders (6.7e11 to 2.7e7 on S3; 2.6e11 to 1.1e7 on S4), the empirically realized ' +
    'cancellation error never exceeds the derived bound, and the crossover k*=1729.97 (S3)/1383.98 (S4) sits ' +
    '~60-70x beyond k=24 with rho(k*)=tail(k*)~1.48e-10. Cancellation is provably safe through k=24 and ' +
    'orders below the tail. CERTIFICATION/MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; operator ' +
    'positivity (imp-3066) untouched; no RH verdict, no QED.',

  method: Object.freeze({
    integrand: 'B_2(a,U)=int_0^{T_A} (cosh(a tau)-1)A(tau)d(tau); the near-cancelling term is cosh(a tau)-1',
    worstArgument: 'x_k = a0*T_A/k (largest cosh argument on rung k; shrinks with k)',
    cancellationBound: 'rho(k)=eps/(cosh(x_k)-1) (imp-3490 R4 form) ~ 2 eps k^2/(a0 T_A)^2, grows like k^2',
    rigorousBound: 'rhoRigorous(k)=eps*cosh(x_k)/(cosh(x_k)-1) (strict Sterbenz subtraction bound, >= rho)',
    oa2Tail: 'tail(k)=(a^2/12)(M_4/M_2)=(a0^2/(12 k^2))(M_4/M_2), the imp-3488/imp-3501 leading-form gap, ~1/k^2',
    crossover: 'k* = [a0^4 T_A^2 M_4/(24 eps M_2)]^{1/4}, solving rho(k)=tail(k)',
    empiricalCheck: 'realized error vs the cancellation-free reference cosh(x)-1=2 sinh^2(x/2)',
    quadrature: 'A(tau) inner Simpson (n=1200 on [0,7]); moments on precomputed A grid (NM=1600 on [0,T_A])',
    kLadder: K_LADDER,
    tauCap: T_A,
    eps: EPS,
    m2: M2,
    m4: M4,
    m4OverM2: M4_OVER_M2,
    marginFloor: MARGIN_FLOOR,
    kStarFloor: KSTAR_FLOOR,
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladderS3: LADDER_S3,                    // base (0.5,6), s=3
    ladderS4: LADDER_S4,                    // base (0.4,10), s=4
    m2: M2,                                 // ~4.5372e-6
    m4: M4,                                 // ~9.6253e-8
    m4OverM2: M4_OVER_M2,                   // ~0.021214
    minMargin: Math.min(LADDER_S3.minMargin, LADDER_S4.minMargin),   // ~1.1e7 (S4, k=24)
    kStarS3: LADDER_S3.kStar,               // ~1729.97
    kStarS4: LADDER_S4.kStar,               // ~1383.98
    rhoAtStarS3: LADDER_S3.rhoAtStar,       // ~1.48e-10 (== tailAtStar)
    safeOnEveryRung,
    rhoGrowsTailShrinks,
    smallXLawHolds,
    empiricalBounded,
    crossoverFarOut,
    verdict,
  }),

  interpretation: Object.freeze({
    closedFormMargin:
      'The imp-3490 R4 cancellation-safety observation is not a single-rung coincidence: rho(k)=eps/(cosh(a0 T_A/k)' +
      '-1) grows like k^2 (2 eps k^2/(a0 T_A)^2 to leading order) while the O(a^2) tail (a0^2/(12 k^2))(M_4/M_2) ' +
      'shrinks like 1/k^2, so the safety margin tail/rho collapses like k^{-4} but stays at least seven orders ' +
      'of magnitude across the whole tested ladder.',
    crossoverFarBeyond:
      'The two would cross only at k* = [a0^4 T_A^2 M_4/(24 eps M_2)]^{1/4} = 1729.97 (S3)/1383.98 (S4), roughly ' +
      '60-70x beyond the largest tested rung k=24. At k* both errors equal ~1.48e-10 (the crossover value is ' +
      'cell-independent since a0/k* is constant); there, a0/k ~ 3e-4 is itself unphysically tiny.',
    reproducesR4:
      'At k=24 the derived rho reproduces the imp-3490 R4 estimate (~3e-14 at a*T_A<=0.125), and the realized ' +
      'cancellation error against the cancellation-free reference 2 sinh^2(x/2) never exceeds the derived bound ' +
      'on any rung -- the bound is honest, not optimistic.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module derives and measures the floating-point cancellation-safety of the degree-2 integrand ' +
      'cosh(a tau)-1 as a closed function of the ladder index k. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (imp-3469 D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3509_COSH_CANCELLATION_SAFETY_K_LADDER_ASSERTIONS = [
  {
    id: 'imp3509-cancellation-safe-on-every-rung',
    why: 'THE KEY FINDING: on every rung of the imp-3490 ladder (through k=24) the cancellation error rho must ' +
         'sit at least 1e6x below the O(a^2) tail on BOTH base cells -- the R4 safety is not a single-rung fact.',
    holds: () => LADDER_S3.minMargin > MARGIN_FLOOR && LADDER_S4.minMargin > MARGIN_FLOOR,
  },
  {
    id: 'imp3509-rho-grows-tail-shrinks-in-k',
    why: 'The cancellation error rho(k) must be MONOTONE INCREASING in k (~k^2) and the O(a^2) tail MONOTONE ' +
         'DECREASING (~1/k^2) on both cells -- the safety margin narrows with k as derived (like k^{-4}).',
    holds: () =>
      LADDER_S3.rhoMonotoneUp && LADDER_S3.tailMonotoneDown &&
      LADDER_S4.rhoMonotoneUp && LADDER_S4.tailMonotoneDown,
  },
  {
    id: 'imp3509-rho-matches-small-x-k-squared-law',
    why: 'The closed form rho(k)~2 eps k^2/(a0 T_A)^2 must reproduce the exact eps/(cosh(x_k)-1) to <1% at the ' +
         'largest rung k=24 (where x_k is smallest) -- confirming the k^2 growth law, not a fitted trend.',
    holds: () => {
      const rS3 = LADDER_S3.rungs[LADDER_S3.rungs.length - 1];
      const rS4 = LADDER_S4.rungs[LADDER_S4.rungs.length - 1];
      return Math.abs(rS3.rho / rS3.rhoSmallX - 1) < SMALLX_TOL &&
        Math.abs(rS4.rho / rS4.rhoSmallX - 1) < SMALLX_TOL;
    },
  },
  {
    id: 'imp3509-empirical-error-within-derived-bound',
    why: 'The empirically realized cancellation error (Math.cosh(x)-1 vs the cancellation-free 2 sinh^2(x/2)) must ' +
         'NEVER exceed the strict derived bound rhoRigorous on any rung -- the bound is honest, not optimistic.',
    holds: () => LADDER_S3.empiricalWithinBound && LADDER_S4.empiricalWithinBound,
  },
  {
    id: 'imp3509-crossover-far-beyond-tested-ladder',
    why: 'The closed-form crossover k*=[a0^4 T_A^2 M_4/(24 eps M_2)]^{1/4} must exceed 1000 (>> tested k=24) on ' +
         'both cells and be verified (rho(k*)=tail(k*) to <1e-6) -- the cancellation never overtakes the tail in range.',
    holds: () =>
      LADDER_S3.kStar > KSTAR_FLOOR && LADDER_S4.kStar > KSTAR_FLOOR &&
      LADDER_S3.crossoverVerified && LADDER_S4.crossoverVerified,
  },
  {
    id: 'imp3509-reproduces-imp3490-r4-at-k24',
    why: 'At k=24 the derived rho must reproduce the imp-3490 R4 estimate: worst argument x_24 = a0*6/24 <= 0.125 ' +
         'and rho ~ O(1e-14) on S3, matching the recorded ~3e-14.',
    holds: () => {
      const r24 = LADDER_S3.rungs.find((r) => r.k === 24);
      return r24.xk <= 0.125 + 1e-12 && r24.rho > 1e-15 && r24.rho < 1e-13;
    },
  },
  {
    id: 'imp3509-verdict-classifies-the-safety',
    why: 'The classified verdict must be the closed-form k-ladder cancellation-safety (rho~k^2 below the O(a^2) ' +
         'tail~1/k^2, crossover far beyond k=24), not indeterminate.',
    holds: () => verdict.startsWith('COSH-CANCELLATION-SAFE-ACROSS-k-LADDER'),
  },
  {
    id: 'imp3509-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: floating-point cancellation-safety certification only, mass-feasibility necessary-' +
         'but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3509_COSH_CANCELLATION_SAFETY_K_LADDER.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3509_COSH_CANCELLATION_SAFETY_K_LADDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3509-cosh-cancellation-safety-k-ladder assertion failed: ${assertion.id}`);
  }
}

export default IMP3509_COSH_CANCELLATION_SAFETY_K_LADDER;
