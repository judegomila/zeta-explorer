/**
 * @module imp-3469-degree2-bridge-mass-scaling
 * @fileoverview imp-3469 -- assess whether the imp-3405 GENERAL lambda-scaling law
 *   of the DEGREE-0 bridge masses,
 *
 *     B(a/k, kU) = k * B(a, U),      D_0(a/k, kU) = k * D_0(a, U),
 *
 *   (certified there for the degree-0 Lebesgue masses B, D_0) EXTENDS to the
 *   DEGREE-2 (absolute) bridge masses -- or BREAKS -- by running the identical
 *   k-ladder {2, 3, 4, 6, 8} on the degree-2 integrands.
 *
 *   WHAT "DEGREE-2" MEANS HERE (imp-2686 / section26-mupass verdict)
 *   ---------------------------------------------------------------
 *   The degree-0 masses integrate the raw shear weights against the passive
 *   Lebesgue baseline on the lag tau (weight 1):
 *     B(a,U)   = int_0^U       (cosh(a tau) - 1) d(tau)
 *     D_0(a,U) = int_{tauStar}^U (sinh(a tau) - 1) d(tau),   sinh(a tauStar) = 1.
 *   The DEGREE-2 (absolute) measure instead weights the SAME integrand-differences
 *   by the genuine-Phi autocorrelation A(tau) = int Phi(s) Phi(s + tau) ds
 *   (imp-2686), the occupation density of the completed-Riemann kernel:
 *     B_2(a,U)   = int_0^U       (cosh(a tau) - 1) A(tau) d(tau)
 *     D_2(a,U)   = int_{tauStar}^U (sinh(a tau) - 1) A(tau) d(tau).
 *   A(tau) is a FIXED function of Phi (NPHI = 10), independent of (a, U).
 *
 *   WHY THE DEGREE-0 LAW WORKS -- AND WHY IT CANNOT SURVIVE AT DEGREE 2
 *   ------------------------------------------------------------------
 *   The degree-0 law is exactly the change of variables tau = k*sigma applied to
 *   the LEBESGUE weight, which maps to itself:
 *     B(a/k, kU) = int_0^{kU} (cosh((a/k) tau) - 1) d(tau)
 *                = k int_0^U (cosh(a sigma) - 1) d(sigma) = k * B(a, U).
 *   At degree 2 the same substitution leaves the FIXED weight uncompensated:
 *     B_2(a/k, kU) = k int_0^U (cosh(a sigma) - 1) A(k*sigma) d(sigma),
 *   where A(k*sigma) is the autocorrelation COMPRESSED by k -- it does NOT equal
 *   A(sigma), so the k-prefactor is NOT the whole story and the law breaks.
 *
 *   MEASURED RESULT (self-computing; A recomputed at import, no frozen data)
 *   -----------------------------------------------------------------------
 *   (R1) THE DEGREE-0 LAW BREAKS AT DEGREE 2. From both base cells (0.5,6),s=3 and
 *        (0.4,10),s=4 the degree-2 bridge mass MISSES the k*(base) prediction by a
 *        huge margin, and the relative miss follows the CLOSED FORM 1 - 1/k^3
 *        exactly (0.875 at k=2 climbing to 0.998 at k=8): the degree-0 law
 *        OVER-predicts the degree-2 mass by a factor k^3.
 *   (R2) THE DEGREE-2 FACE OBEYS A DIFFERENT SCALING EXPONENT p = 2, not 1:
 *        B_2(a/k, kU) = B_2(a, U) / k^2 to full precision (measured exponent
 *        log(base/scaled)/log(k) = 2.0000..2.0005 on every rung). The degree-2
 *        mass scales as a^2 (degree 2 in the shear weight a), not as 1/a.
 *   (R3) THE ROOT CAUSE, in closed form. Because A(tau) truncates the integral at
 *        its support (~[0, 0.6], far inside every U >= 6), B_2 is essentially
 *        U-INDEPENDENT and small-a: cosh(a tau) - 1 = (a tau)^2/2 + O(a^4) gives
 *        B_2(a) ~ (a^2/2) M_2 with M_2 = int tau^2 A(tau) d(tau) the FIXED second
 *        Phi-autocorrelation moment. So B_2 ~ a^2 exactly -- hence exponent 2,
 *        hence the k^3 over-prediction (degree-0 predicts k * a^2 = k, actual a^2/k^2).
 *   (R4) THE DEGREE-2 OVERFLOW DEFICIT VANISHES: D_2 = 0 identically. The crossover
 *        tauStar = arcsinh(1)/a = 1.76 (base a=0.5) sits OUTSIDE the A support
 *        [0,~0.6], and a -> a/k pushes tauStar to k*1.76 (further out still), so the
 *        deficit tail [tauStar, U] never meets the autocorrelation support. This is
 *        exactly the imp-2686 observation that in the absolute measure the raw
 *        diagonal dominates on 100% of the support -- there is no degree-2 deficit,
 *        so the degree-2 mass RATIO B_2/D_2 is undefined (no feasibility comparison).
 *   (R5) s = a*U is invariant along the ladder BY CONSTRUCTION (unchanged), but at
 *        degree 2 it NO LONGER parametrizes the mass: once U exceeds the A support
 *        the U-dependence drops out and B_2 depends on a alone, so the s-only
 *        collapse that organized the degree-0 ratio (imp-3255) does not exist here.
 *
 *   VERDICT: the imp-3405 degree-0 lambda-scaling law B(a/k,kU)=k*B does NOT extend
 *   to the degree-2 (absolute) face. Degree 2 obeys a distinct exponent (mass ~ a^2,
 *   U-independent), with the degree-0 prediction wrong by the closed factor k^3.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DIAGNOSTIC ONLY, at the RH-equivalent scale class. This is a
 *   scaling-law characterization of the degree-2 mass integrands -- it establishes
 *   NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT and the
 *   degree-2 face carries no feasibility comparison at all (D_2 = 0). The
 *   operator-level K_a >= 0 sign-positivity (off-diagonal endpoint-Hankel step,
 *   imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the rigorous SOTA.
 *
 *   @see imp-3405-bridge-mass-lambda-scaling-law.js (the degree-0 law tested here)
 *   @see imp-2686-mupass-construction.js (the degree-2 / absolute measure A(tau))
 *   @see imp-3255-bridge-ratio-closed-form.js (the degree-0 s = a*U scale collapse)
 *
 *   Ticket: imp-3469 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

const ASINH1 = Math.asinh(1);                   // arcsinh(1), solves sinh(a tauStar) = 1

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
// super-exponentially so the upper limit 7 captures the whole overlap.
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on a FIXED fine Simpson grid over [0, T_A] ONCE. A(tau) is negligible
// beyond its support (~[0, 0.6]); T_A = 6 equals the smallest cutoff U in the ladder,
// so every cell (U >= 6) integrates the full autocorrelation with no truncation loss.
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/**
 * Degree-2 mass = int_0^T_A weight(tau) A(tau) d(tau) by composite Simpson on the
 * precomputed A grid, restricted to [lo, T_A]. For the bridge mass lo = 0; for the
 * overflow deficit lo = tauStar (masked to grid nodes >= tauStar).
 */
function degree2Mass(weightFn, lo) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    if (tau < lo) continue;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

/** The fixed second autocorrelation moment M_2 = int tau^2 A(tau) d(tau). */
const M2_MOMENT = degree2Mass((tau) => tau * tau, 0);

// Sample A(tau) for charting over [0, CHART_TAU_MAX], subsampled from the precomputed grid,
// and locate the numerical edge of its finite support (imp-3469 R4: the degree-2 overflow
// deficit D_2 vanishes because tauStar = arcsinh(1)/a sits OUTSIDE this support).
const CHART_TAU_MAX = 2.5;
const CHART_STRIDE = 8;
const peakA = Math.max(...A_GRID);
const SUPPORT_THRESHOLD = 1e-3;                 // fraction of peak below which A(tau) is negligible
let supportEndIdx = 0;
for (let j = 0; j <= NM; j += 1) {
  if (A_GRID[j] > SUPPORT_THRESHOLD * peakA) supportEndIdx = j;
}
const supportEnd = supportEndIdx * H_A;          // numerically located edge of the A(tau) support

const autocorrSamples = [];
for (let j = 0; j <= NM && j * H_A <= CHART_TAU_MAX; j += CHART_STRIDE) {
  autocorrSamples.push({ tau: j * H_A, A: A_GRID[j] });
}

/** Charting-only profile of A(tau): its finite support edge and the two base-cell tauStar values. */
export const AUTOCORR_WEIGHT_PROFILE = Object.freeze({
  samples: Object.freeze(autocorrSamples),
  peakA,
  supportEnd,
  chartTauMax: CHART_TAU_MAX,
  tauStarBaseS3: ASINH1 / 0.5,                    // tauStar for base cell (a=0.5,U=6), s=3
  tauStarBaseS4: ASINH1 / 0.4,                    // tauStar for base cell (a=0.4,U=10), s=4
});

/** Degree-2 bridge mass B_2 and overflow deficit D_2 at a cell (a, U). */
function degree2Masses(a, u) {
  const tauStar = ASINH1 / a;
  const B2 = degree2Mass((tau) => Math.cosh(a * tau) - 1, 0);
  const D2 = tauStar >= u ? 0 : degree2Mass((tau) => Math.sinh(a * tau) - 1, tauStar);
  return Object.freeze({ a, u, s: a * u, tauStar, B2, D2 });
}

/**
 * Run the k-ladder from a base cell (a0, u0), scaling a -> a0/k, U -> k*u0, and
 * compare the degree-2 masses to the DEGREE-0 prediction k*(base). Reports the
 * relative miss, the measured scaling exponent p (B_2(a0/k) = B_2(a0)/k^p), and
 * the closed-form miss 1 - 1/k^3.
 */
function degree2Ladder(a0, u0, kValues) {
  const base = degree2Masses(a0, u0);
  const rungs = kValues.map((k) => {
    const scaled = degree2Masses(a0 / k, u0 * k);
    const predB = k * base.B2;                            // the degree-0 law prediction
    const relResidB = Math.abs(scaled.B2 - predB) / Math.abs(predB);
    const exponent = Math.log(base.B2 / scaled.B2) / Math.log(k); // measured p
    const closedFormMiss = 1 - 1 / (k * k * k);           // predicted relative miss
    return Object.freeze({
      k,
      a: a0 / k,
      u: u0 * k,
      s: scaled.s,
      B2: scaled.B2,
      D2: scaled.D2,
      predBDegree0: predB,
      relResidB,                                          // huge -> law breaks
      exponent,                                           // ~2, not 1
      closedFormMiss,                                     // 1 - 1/k^3
      missMatchesClosedForm: Math.abs(relResidB - closedFormMiss),
      sResid: Math.abs(scaled.s - base.s),                // s = a*U (invariant by construction)
    });
  });
  return Object.freeze({
    base,
    rungs,
    maxRelResidB: Math.max(...rungs.map((r) => r.relResidB)),
    minExponent: Math.min(...rungs.map((r) => r.exponent)),
    maxExponent: Math.max(...rungs.map((r) => r.exponent)),
    maxMissMismatch: Math.max(...rungs.map((r) => r.missMatchesClosedForm)),
    maxD2: Math.max(...rungs.map((r) => r.D2)),
  });
}

// -- The identical imp-3405 k-ladder on the degree-2 integrands ---------------
const K_LADDER = Object.freeze([2, 3, 4, 6, 8]);
const LADDER_S3 = degree2Ladder(0.5, 6, K_LADDER);   // base (0.5,6), s = 3
const LADDER_S4 = degree2Ladder(0.4, 10, K_LADDER);  // base (0.4,10), s = 4

// Small-a leading form: B_2(a) ~ (a^2/2) M_2. Check at the two base cells.
const leadingS3 = (0.5 * 0.5 / 2) * M2_MOMENT;
const leadingS4 = (0.4 * 0.4 / 2) * M2_MOMENT;
const leadingRelErrS3 = Math.abs(LADDER_S3.base.B2 - leadingS3) / LADDER_S3.base.B2;
const leadingRelErrS4 = Math.abs(LADDER_S4.base.B2 - leadingS4) / LADDER_S4.base.B2;

// -- Classification -----------------------------------------------------------
// The law BREAKS: the relative miss is order 1 (>= 0.875), the exponent is ~2 (not 1),
// the miss matches the closed form 1 - 1/k^3, and the degree-2 deficit vanishes.
const EXPONENT_TOL = 0.01;      // measured p within [2 - tol, 2 + tol]
const MISS_TOL = 1e-3;          // relative miss matches 1 - 1/k^3 to this
const DEFICIT_TOL = 1e-12;      // D_2 is numerically zero

const lawBreaks =
  LADDER_S3.maxRelResidB > 0.8 &&
  LADDER_S4.maxRelResidB > 0.8;
const exponentIsTwo =
  Math.abs(LADDER_S3.minExponent - 2) < EXPONENT_TOL &&
  Math.abs(LADDER_S3.maxExponent - 2) < EXPONENT_TOL &&
  Math.abs(LADDER_S4.minExponent - 2) < EXPONENT_TOL &&
  Math.abs(LADDER_S4.maxExponent - 2) < EXPONENT_TOL;
const missIsClosedForm =
  LADDER_S3.maxMissMismatch < MISS_TOL && LADDER_S4.maxMissMismatch < MISS_TOL;
const deficitVanishes =
  LADDER_S3.base.D2 < DEFICIT_TOL && LADDER_S4.base.D2 < DEFICIT_TOL &&
  LADDER_S3.maxD2 < DEFICIT_TOL && LADDER_S4.maxD2 < DEFICIT_TOL;

const verdict =
  lawBreaks && exponentIsTwo && missIsClosedForm && deficitVanishes
    ? 'DEGREE-0-LAMBDA-SCALING-LAW-B(a/k,kU)=k*B-BREAKS-AT-DEGREE-2-DIFFERENT-EXPONENT-p=2-MISS-FACTOR-k^3'
    : 'INDETERMINATE';

export const IMP3469_DEGREE2_BRIDGE_MASS_SCALING = Object.freeze({
  id: 'imp-3469-degree2-bridge-mass-scaling',
  ticket: 'imp-3469',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDegree0Law: 'imp-3405-bridge-mass-lambda-scaling-law.js',
  relatedAbsoluteMeasure: 'imp-2686-mupass-construction.js',
  relatedScaleCollapse: 'imp-3255-bridge-ratio-closed-form.js',

  summary:
    'Tests whether the imp-3405 degree-0 lambda-scaling law B(a/k,kU)=k*B(a,U) extends ' +
    'to the DEGREE-2 (absolute) bridge masses -- the same integrand-differences ' +
    'cosh(a tau)-1 and sinh(a tau)-1 weighted by the fixed genuine-Phi autocorrelation ' +
    'A(tau) = int Phi(s)Phi(s+tau)ds -- by running the identical k-ladder {2,3,4,6,8} ' +
    'from bases (0.5,6),s=3 and (0.4,10),s=4. RESULT: the law BREAKS. The degree-2 mass ' +
    'misses the k*(base) prediction by the CLOSED factor 1 - 1/k^3 (0.875 at k=2 to 0.998 ' +
    'at k=8) and instead obeys a DIFFERENT exponent p=2: B_2(a/k,kU)=B_2(a,U)/k^2 to full ' +
    'precision. Cause: A(tau) truncates the integral at its support (~[0,0.6], inside every ' +
    'U>=6) so B_2 is U-independent and small-a, B_2(a)~(a^2/2) M_2 with M_2=int tau^2 A(tau)d(tau) ' +
    'the fixed second Phi-autocorrelation moment -- degree 2 in a, not 1/a. The degree-2 ' +
    'overflow deficit D_2=0 identically (the crossover tauStar sits outside the A support), so ' +
    'there is no degree-2 feasibility ratio. DIAGNOSTIC, RH-EQUIVALENT, necessary-but-not- ' +
    'sufficient; operator positivity (imp-3066) untouched; no RH verdict.',

  method: Object.freeze({
    degree0Masses: 'B=int_0^U (cosh(a tau)-1)d(tau), D_0=int_{tauStar}^U (sinh(a tau)-1)d(tau) (weight 1)',
    degree2Masses: 'B_2=int_0^U (cosh(a tau)-1)A(tau)d(tau), D_2=int_{tauStar}^U (sinh(a tau)-1)A(tau)d(tau)',
    weight: 'A(tau) = int_0^inf Phi(s)Phi(s+tau)ds, the genuine-Phi autocorrelation (NPHI=10), FIXED in (a,U)',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), mass on precomputed A grid (NM=1600 on [0,T_A])',
    scaling: 'a -> a0/k, U -> k*u0 at fixed s = a0*u0 (identical to imp-3405)',
    kLadder: K_LADDER,
    tauCap: T_A,
    m2Moment: M2_MOMENT,
    exponentTol: EXPONENT_TOL,
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladderS3: LADDER_S3,                    // base (0.5,6), s=3
    ladderS4: LADDER_S4,                    // base (0.4,10), s=4
    maxRelResidB: Math.max(LADDER_S3.maxRelResidB, LADDER_S4.maxRelResidB),  // ~0.998
    exponentRange: Object.freeze({
      min: Math.min(LADDER_S3.minExponent, LADDER_S4.minExponent),
      max: Math.max(LADDER_S3.maxExponent, LADDER_S4.maxExponent),
    }),
    m2Moment: M2_MOMENT,                    // fixed second autocorrelation moment ~4.54e-6
    leadingFormRelErrS3: leadingRelErrS3,   // |B_2(0.5) - (a^2/2)M_2| / B_2(0.5), ~4e-4
    leadingFormRelErrS4: leadingRelErrS4,   // ~3e-4
    lawBreaks,
    exponentIsTwo,
    missIsClosedForm,
    deficitVanishes,
    verdict,
  }),

  interpretation: Object.freeze({
    lawDoesNotExtend:
      'The imp-3405 degree-0 lambda-scaling law B(a/k,kU)=k*B(a,U) does NOT extend to the ' +
      'degree-2 (absolute) face. It rests on the tau = k*sigma change of variables mapping the ' +
      'LEBESGUE weight to itself; the fixed autocorrelation weight A(tau) is left uncompensated ' +
      '(A(k*sigma) != A(sigma)), so the k-prefactor over-predicts by k^3.',
    differentExponent:
      'The degree-2 mass obeys the DIFFERENT exponent p=2: B_2(a/k,kU)=B_2(a,U)/k^2. Because A(tau) ' +
      'truncates the integral inside its support (~[0,0.6] << U), B_2 is U-independent and small-a, ' +
      'B_2(a) ~ (a^2/2) M_2 with M_2 = int tau^2 A(tau)d(tau) fixed -- so it scales as a^2, not 1/a.',
    noDegree2Deficit:
      'The degree-2 overflow deficit D_2 = 0 identically: the crossover tauStar = arcsinh(1)/a = 1.76 ' +
      '(base a=0.5) lies outside the A support, and a -> a/k pushes it to k*1.76 (further out). This is ' +
      'the imp-2686 absolute-measure fact (raw diagonal dominates 100% of support) -- there is no ' +
      'degree-2 mass-feasibility ratio B_2/D_2 to speak of.',
    sNoLongerParametrizes:
      's = a*U stays invariant along the ladder by construction, but at degree 2 it no longer ' +
      'parametrizes the mass (the U-dependence drops out beyond the A support), so the imp-3255 ' +
      's-only ratio collapse has no degree-2 analogue.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    numericalCharacterizationOnly:
      'This module numerically characterizes the k-scaling of the DEGREE-2 (absolute-measure) bridge ' +
      'masses and shows the imp-3405 degree-0 law does not extend (different exponent p=2, miss factor ' +
      'k^3). It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility ' +
      'comparison at all (D_2 = 0). The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3469_DEGREE2_BRIDGE_MASS_SCALING_ASSERTIONS = [
  {
    id: 'imp3469-degree0-law-breaks-at-degree-2',
    why: 'THE KEY FINDING: run through the identical k-ladder on the degree-2 integrands, the degree-0 ' +
         'prediction k*(base) must miss the degree-2 bridge mass by an order-1 relative margin (>= 0.8) ' +
         'from BOTH base cells -- the imp-3405 law does not extend to degree 2.',
    holds: () => LADDER_S3.maxRelResidB > 0.8 && LADDER_S4.maxRelResidB > 0.8,
  },
  {
    id: 'imp3469-degree2-scaling-exponent-is-two',
    why: 'The degree-2 mass must obey the DIFFERENT exponent p=2 (B_2(a0/k)=B_2(a0)/k^2), not the degree-0 ' +
         'p=1: every measured log(base/scaled)/log(k) on both ladders must lie within 0.01 of 2.',
    holds: () =>
      Math.abs(LADDER_S3.minExponent - 2) < EXPONENT_TOL &&
      Math.abs(LADDER_S3.maxExponent - 2) < EXPONENT_TOL &&
      Math.abs(LADDER_S4.minExponent - 2) < EXPONENT_TOL &&
      Math.abs(LADDER_S4.maxExponent - 2) < EXPONENT_TOL,
  },
  {
    id: 'imp3469-miss-matches-closed-form-1-minus-1-over-k3',
    why: 'The relative miss of the degree-0 prediction must equal the CLOSED FORM 1 - 1/k^3 to <1e-3 on ' +
         'every rung (degree-0 predicts k, actual mass ~ a^2/k^2 = base/k^2, so miss = |1/k^2 - k|/k = 1 - 1/k^3).',
    holds: () => LADDER_S3.maxMissMismatch < MISS_TOL && LADDER_S4.maxMissMismatch < MISS_TOL,
  },
  {
    id: 'imp3469-leading-small-a-form-B2-is-half-a2-M2',
    why: 'The root cause: because A(tau) truncates the integral inside its support, B_2(a) ~ (a^2/2) M_2 with ' +
         'M_2 = int tau^2 A(tau) d(tau) fixed -- the leading small-a form must reproduce both base masses to <1%.',
    holds: () => leadingRelErrS3 < 1e-2 && leadingRelErrS4 < 1e-2,
  },
  {
    id: 'imp3469-degree2-deficit-vanishes',
    why: 'The degree-2 overflow deficit D_2 must be numerically zero (crossover tauStar sits outside the A ' +
         'support and a -> a/k pushes it further out), so no degree-2 feasibility ratio B_2/D_2 exists -- ' +
         'matching the imp-2686 absolute-measure 100%-domination fact.',
    holds: () =>
      LADDER_S3.base.D2 < DEFICIT_TOL && LADDER_S4.base.D2 < DEFICIT_TOL &&
      LADDER_S3.maxD2 < DEFICIT_TOL && LADDER_S4.maxD2 < DEFICIT_TOL,
  },
  {
    id: 'imp3469-verdict-classifies-the-break',
    why: 'The classified verdict must be the degree-2 break with exponent 2 and miss factor k^3, not indeterminate.',
    holds: () => verdict === 'DEGREE-0-LAMBDA-SCALING-LAW-B(a/k,kU)=k*B-BREAKS-AT-DEGREE-2-DIFFERENT-EXPONENT-p=2-MISS-FACTOR-k^3',
  },
  {
    id: 'imp3469-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: scaling-law characterization only, mass-feasibility necessary-but-not-sufficient ' +
         '(no degree-2 ratio), operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3469_DEGREE2_BRIDGE_MASS_SCALING.honestCaveat;
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

for (const assertion of IMP3469_DEGREE2_BRIDGE_MASS_SCALING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3469-degree2-bridge-mass-scaling assertion failed: ${assertion.id}`);
  }
}

export default IMP3469_DEGREE2_BRIDGE_MASS_SCALING;
