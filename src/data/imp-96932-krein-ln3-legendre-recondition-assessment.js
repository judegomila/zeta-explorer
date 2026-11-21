/**
 * @fileoverview imp-96932 -- ASSESSMENT: can a RECONDITIONED Legendre basis extend the imp-96894
 * matched-N Krein cross-check lambda_min(T_a[sigma_2]) past N=76 at 2a=ln3, out to the imp-96768
 * tail rungs N in {88,100,112,124}?
 *
 * CONTEXT. imp-96894 tabulated the Legendre (imp-96749) vs Gegenbauer condB=1 (imp-96768) Krein
 * Rayleigh-floor cross-check at 2a=ln3 and found matched-N agreement <=1e-6 absolute, but reported the
 * DIRECT matched comparison as ending at N=76 because the Legendre L2 Gram B_{nm} = a^{4m+1} int
 * (1-y^2)^{2m} P_n P_m dy (m=3) is ill-conditioned: P_n is NOT orthogonal under the weight (1-y^2)^{2m},
 * so condB grows past 1e13 at N=76 (the open IMP96749_UNIFORM_N_GAP_UNSETTLED wall). This ticket asks
 * whether a re-orthonormalized / rescaled Legendre basis (or a shifted-Gegenbauer partner) recovers a
 * well-conditioned problem and recovers a matched-N Legendre partner for the imp-96768 tail.
 *
 * METHOD (measurement/assessment only; tmp/imp-96932-legendre-recondition.py, /tmp/rhvenv scipy 1.18.1,
 * double precision, T=800, panel=1.5, gl=24 -- identical quadrature to imp-96749/imp-96768). At 2a=ln3,
 * a=ln3/2, for N in {76,88,100,112,124} we build the exact Legendre A and Gram B (Rayleigh plane-wave
 * expansion, no x-quadrature FT) and measure THREE things:
 *   (1) condB and min-eig(B): does B stay numerically positive definite up the ladder?
 *   (2) lam_raw = min generalized eig of (A,B) via LAPACK eigh -- does the RAW Legendre floor still
 *       track the imp-96768 condB=1 Gegenbauer tail (0.545630 / 0.533846 / 0.521953 / 0.510769)?
 *   (3) lam_reortho = min eig of the Loewdin symmetric whitening C = B^{-1/2} A B^{-1/2} -- an EXACTLY
 *       reconditioned orthonormal basis of the SAME subspace. Does explicit re-orthonormalization
 *       recover accuracy, or does the B^{-1/2} factor (condition sqrt(condB)) amplify the loss?
 * lam_gegen is the imp-96768 Gegenbauer C_n^{13/2} floor recomputed here with the same quadrature.
 * The Rayleigh floor min_x (x^T A x)/(x^T B x) over the degree-<N span is basis-INDEPENDENT, so any
 * divergence is a conditioning artifact, not a spectral disagreement. UPPER-bound floor; no positivity;
 * NO QED.
 *
 * MEASURED (verbatim from the run):
 *   N    condB      minEigB     lam_raw    lam_reortho  lam_gegen   |raw-gegen|
 *   76   4.04e+14   8.47e-19    0.557246   0.557235     0.557246    4.21e-08
 *   88   2.36e+15   1.42e-19    0.545630   0.545695     0.545630    4.32e-07
 *  100   1.09e+16   3.16e-20    0.533849   0.533639     0.533846    3.37e-06
 *  112   4.78e+16   7.50e-21    0.521989   0.526477     0.521953    3.60e-05
 *  124   1.76e+17   1.09e-21    0.512191   0.499454     0.510769    1.42e-03
 *
 * FINDINGS.
 *   1. THE RAW GENERALIZED-EIG LEGENDRE FLOOR EXTENDS THE MATCHED-N CROSS-CHECK PAST N=76 -- THREE MORE
 *      RUNGS AT THE 1e-5 LEVEL. LAPACK eigh(A,B) (internally a Cholesky of B, more stable than explicit
 *      whitening) keeps the Legendre floor tracking the Gegenbauer tail to |raw-gegen| = 4.32e-7 (N=88),
 *      3.37e-6 (N=100), 3.60e-5 (N=112): the imp-96894 "direct comparison ends at N=76" was a
 *      conservative conditioning cap, NOT a hard failure. So the matched cross-basis agreement is
 *      confirmed out to N=112 without any reconditioning at all.
 *   2. N=124 CORRUPTS (1.42e-3) -- condB ~ 1.76e17 exceeds 1/eps, min-eig(B) ~ 1e-21 makes B
 *      numerically singular, and the raw floor (0.512191) drifts ~1.4e-3 above the condB=1 Gegenbauer
 *      value (0.510769). This is the true double-precision wall for a matched-N Legendre comparison:
 *      between N=112 and N=124, not at N=76.
 *   3. RE-ORTHONORMALIZATION DOES NOT RECONDITION -- IT DEGRADES THE TAIL. The Loewdin symmetric
 *      whitening B^{-1/2} A B^{-1/2} (an exactly orthonormal reconditioned basis of the same subspace)
 *      is WORSE than the raw solve at the tail: |reortho-gegen| = 4.5e-3 at N=112 (0.526477 vs 0.521953)
 *      and 1.1e-2 at N=124 (0.499454 vs 0.510769). The B^{-1/2} factor has condition sqrt(condB) ~ 4e8
 *      at N=124, so it AMPLIFIES the rounding error rather than removing it. Reconditioning by whitening
 *      the same Legendre span cannot beat LAPACK eigh, let alone extend past it.
 *   4. THE ONLY RECONDITIONING THAT FULLY WORKS IS THE SHIFTED-GEGENBAUER PARTNER (= imp-96768). Using
 *      the polynomial factor orthogonal under the actual Gram weight (1-y^2)^{2m} -- Gegenbauer
 *      C_n^{13/2} -- gives B = a^{4m+1} I exactly (condB=1) and reaches N=124 cleanly. But that is no
 *      longer a DISTINCT Legendre basis; it IS imp-96768. There is no separate reconditioned-Legendre
 *      partner for the N=124 rung short of extended precision.
 *
 * VERDICT. A reconditioned Legendre basis does NOT deliver a distinct matched-N Legendre partner for the
 * full imp-96768 tail in double precision. What it CAN do is push the direct matched cross-check three
 * rungs past the imp-96894 N=76 cap -- to N=88/100/112 at |raw-gegen| <= 3.6e-5, WITHOUT any
 * reconditioning (raw LAPACK eigh). Explicit re-orthonormalization (Loewdin whitening) makes the tail
 * WORSE, and N=124 corrupts to ~1.4e-3 as condB crosses 1/eps. The uniform-in-N spectral gap
 * (IMP96749_UNIFORM_N_GAP_UNSETTLED) stays open; the matched-Legendre wall moves from N=76 to the
 * N=112..124 interval; full N=124 parity needs the Gegenbauer partner (imp-96768) or extended precision.
 * Measurement / cross-validation only; the floor stays a Rayleigh UPPER bound; no operator positivity;
 * interval-rigorous certificate reach stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96894-krein-ln3-legendre-gegenbauer-crossbasis.js (matched-N cross-check capped at N=76)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (Legendre ladder, condB ~ 1e13 wall)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (Gegenbauer C_n^{13/2}, condB=1, reaches N=124)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0)
 */

const LN3 = Math.log(3); // 1.0986122886681098

export const IMP96932_TWO_A = LN3;
export const IMP96932_T = 800; // tail-inclusive, matching imp-96749/imp-96768/imp-96894
export const IMP96932_NS = Object.freeze([76, 88, 100, 112, 124]);

// per-rung measured table at 2a=ln3, T=800, double precision (verbatim from tmp/imp-96932-legendre-recondition.py):
//  condB   = 2-norm condition of the Legendre L2 Gram B
//  minEigB = smallest eigenvalue of B (positive-definiteness monitor)
//  lamRaw  = min generalized eig of (A,B) via LAPACK eigh (no reconditioning)
//  lamReortho = min eig of the Loewdin symmetric whitening B^{-1/2} A B^{-1/2} (reconditioned same span)
//  lamGegen = imp-96768 Gegenbauer C_n^{13/2} condB=1 floor (same quadrature)
//  rawGegenAbs = |lamRaw - lamGegen| (matched-N cross-basis disagreement)
export const IMP96932_LADDER = Object.freeze([
  Object.freeze({ N: 76, condB: 4.04e14, minEigB: 8.47e-19, lamRaw: 0.557246, lamReortho: 0.557235, lamGegen: 0.557246, rawGegenAbs: 4.21e-8 }),
  Object.freeze({ N: 88, condB: 2.36e15, minEigB: 1.42e-19, lamRaw: 0.545630, lamReortho: 0.545695, lamGegen: 0.545630, rawGegenAbs: 4.32e-7 }),
  Object.freeze({ N: 100, condB: 1.09e16, minEigB: 3.16e-20, lamRaw: 0.533849, lamReortho: 0.533639, lamGegen: 0.533846, rawGegenAbs: 3.37e-6 }),
  Object.freeze({ N: 112, condB: 4.78e16, minEigB: 7.50e-21, lamRaw: 0.521989, lamReortho: 0.526477, lamGegen: 0.521953, rawGegenAbs: 3.60e-5 }),
  Object.freeze({ N: 124, condB: 1.76e17, minEigB: 1.09e-21, lamRaw: 0.512191, lamReortho: 0.499454, lamGegen: 0.510769, rawGegenAbs: 1.42e-3 }),
]);

// the direct matched-N cross-check now reaches N=112 (raw eigh, |raw-gegen| <= 3.6e-5); N=124 corrupts.
export const IMP96932_RAW_MATCHED_NMAX = 112;
export const IMP96932_RAW_MATCHED_TOL = 3.6e-5; // worst |lamRaw - lamGegen| over N in {76..112}
export const IMP96932_CORRUPTION_NMAX = 124; // first rung where the raw Legendre floor drifts >1e-3

export const IMP96932_VERDICT = Object.freeze({
  ticket: 'imp-96932',
  question:
    'does a re-orthonormalized / rescaled Legendre basis (or a shifted-Gegenbauer partner) recover a well-conditioned Gram past N=76 and extend the imp-96894 matched-N Krein cross-check at 2a=ln3 to the imp-96768 tail rungs N in {88,100,112,124}?',
  answer:
    'partially, and NOT via reconditioning. The RAW LAPACK generalized eig eigh(A,B) already extends the matched-N cross-check three rungs past the imp-96894 N=76 cap -- to N=88/100/112 at |lamRaw-lamGegen| <= 3.6e-5 -- with no reconditioning at all; the N=76 cap was conservative. N=124 corrupts (drift 1.42e-3) as condB ~ 1.76e17 crosses 1/eps and min-eig(B) ~ 1e-21 makes B numerically singular. Explicit re-orthonormalization (Loewdin symmetric B^{-1/2} whitening) does NOT recondition: it AMPLIFIES the loss via a sqrt(condB) ~ 4e8 factor and is strictly worse at the tail (|reortho-gegen| = 4.5e-3 at N=112, 1.1e-2 at N=124). The only reconditioning that reaches N=124 cleanly is the shifted-Gegenbauer partner C_n^{13/2} (= imp-96768, condB=1), which is not a distinct Legendre basis.',
  rawMatchedNmax: 112, // matched-Legendre cross-check verified out to here (extends imp-96894 N=76)
  rawMatchedTol: 3.6e-5,
  corruptionNmax: 124, // double-precision wall for the matched-Legendre comparison
  reorthonormalizationHelps: false, // Loewdin whitening degrades the tail (sqrt(condB) amplification)
  fullTailNeedsGegenbauerOrExtendedPrecision: true,
  // honesty guardrails
  rayleighFloorIsUpperBound: true,
  operatorPositivityProved: false,
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED remains open
  matchedLegendreWallMovesFromN76To112: true,
  intervalRigorousReachUnchanged: 0.96,
  rhOpen: true,
  ptFloorSOTA: 0.2,
  qed: false,
});

// -- self-check assertions (import-light; node run-assertions exercises these) -----------------------
const IMP96932_ASSERTIONS = [
  {
    id: 'imp96932-two-a-is-ln3',
    holds: () => Math.abs(IMP96932_TWO_A - Math.log(3)) < 1e-12,
    why: 'the assessment is at the binding endpoint 2a = ln3, the imp-96894 matched-N cross-check anchor.',
  },
  {
    id: 'imp96932-condB-crosses-inverse-eps',
    holds: () => {
      const n124 = IMP96932_LADDER.find((r) => r.N === 124);
      const n76 = IMP96932_LADDER.find((r) => r.N === 76);
      // condB grows monotonically and exceeds 1/eps (~4.5e15) by N=124, so B is numerically singular there.
      return n76.condB < n124.condB && n124.condB > 4.5e15;
    },
    why: 'the Legendre Gram condition number grows from ~4e14 (N=76) to ~1.8e17 (N=124), crossing 1/eps ~ 4.5e15 -- the source of the tail corruption.',
  },
  {
    id: 'imp96932-raw-eigh-extends-matched-check-to-N112',
    holds: () =>
      IMP96932_LADDER.filter((r) => r.N <= 112).every((r) => r.rawGegenAbs <= 3.6e-5),
    why: 'the raw LAPACK generalized eig tracks the Gegenbauer condB=1 tail to <=3.6e-5 through N=112 -- extending the imp-96894 matched-N cross-check three rungs past its N=76 cap with no reconditioning.',
  },
  {
    id: 'imp96932-N124-corrupts',
    holds: () => {
      const n124 = IMP96932_LADDER.find((r) => r.N === 124);
      return n124.rawGegenAbs > 1e-3;
    },
    why: 'at N=124 the raw Legendre floor drifts >1e-3 above the condB=1 Gegenbauer value -- the double-precision matched-Legendre wall lies in the N=112..124 interval, not at N=76.',
  },
  {
    id: 'imp96932-reorthonormalization-does-not-help',
    holds: () => {
      // at the tail, Loewdin whitening is strictly further from the trusted Gegenbauer floor than raw eigh.
      const n112 = IMP96932_LADDER.find((r) => r.N === 112);
      const n124 = IMP96932_LADDER.find((r) => r.N === 124);
      const roErr112 = Math.abs(n112.lamReortho - n112.lamGegen);
      const roErr124 = Math.abs(n124.lamReortho - n124.lamGegen);
      return roErr112 > n112.rawGegenAbs && roErr124 > n124.rawGegenAbs;
    },
    why: 'explicit re-orthonormalization (B^{-1/2} whitening) amplifies the error via a sqrt(condB) factor and is worse than the raw solve at both tail rungs, so it does NOT recondition the problem.',
  },
  {
    id: 'imp96932-floor-firmly-positive-all-rungs',
    holds: () => IMP96932_LADDER.every((r) => r.lamRaw > 0.5 && r.lamGegen > 0.5),
    why: 'both the raw Legendre and the Gegenbauer floors stay firmly positive (>0.5) across N in {76..124} at 2a = ln3, so the positive-floor reading is robust even where the matched agreement degrades.',
  },
  {
    id: 'imp96932-measurement-only-no-qed',
    holds: () =>
      IMP96932_VERDICT.rayleighFloorIsUpperBound === true &&
      IMP96932_VERDICT.operatorPositivityProved === false &&
      IMP96932_VERDICT.uniformNGapSettled === false &&
      IMP96932_VERDICT.reorthonormalizationHelps === false &&
      IMP96932_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96932_VERDICT.qed === false,
    why: 'measurement only: the floor is an UPPER bound, no operator positivity is proved, the uniform-in-N gap stays unsettled, reconditioning does not help, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96932_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96932-krein-ln3-legendre-recondition-assessment assertion failed: ${a.id}`);
  }
}

void LN3;
