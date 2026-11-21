/**
 * imp-96589 -- Cross-check the imp-96567 direct number variance Sigma^2(L) = 0.974834 at
 * L = 495.779 against the GUE asymptotic (1/pi^2)(ln(2 pi L) + gamma + 1), tabulating the two
 * side by side with the signed residual and confirming the claimed 6-digit agreement.
 * Measurement/check only; conditional on the GUE sine kernel; NO QED.
 *
 * THE CLAIM (imp-96567). The direct double-box Simpson integral of the sin^2 cluster function
 * yields Sigma^2(L) = 0.974834 at the T = 1.5e5 box length L = 495.779 and "matches the GUE
 * asymptotic (1/pi^2)(ln(2 pi L) + gamma + 1) to 6 digits." That number is the denominator of the
 * imp-96567 tail normalization rho_k = Cov_k / Sigma^2(L), so a mis-stated Sigma^2 would rescale
 * every reported box correlation. This module independently recomputes BOTH sides and tabulates.
 *
 * THE TWO INDEPENDENT COMPUTATIONS (offline tmp/imp-96589-scratch.mjs).
 *   (A) Direct Simpson integral of the cluster function over the actual triangular reduction:
 *         Sigma^2(L) = L - int_{-L}^{L} (L - |u|) T_2(u) du,   T_2(u) = (sin(pi u)/(pi u))^2,
 *       via composite Simpson on [0, L] doubled by evenness. Converged and h-stable across
 *       h = 0.0025, 0.00125, 0.000625:  Sigma^2_direct = 0.97483370.
 *   (B) Closed-form GUE asymptotic  Sigma^2_closed = (1/pi^2)(ln(2 pi L) + gamma + 1) = 0.97483370,
 *       re-evaluated here from the bare constants.
 *
 * THE RESULT. The signed residual direct - closed is -1.86e-9 (h-stable: -1.857e-9, -1.900e-9,
 * -1.843e-9 across the three step sizes) -- agreement to ~9 digits, far tighter than the claimed
 * six. The imp-96567 baked literal 0.974834 is exactly the 6-significant-digit round of the full
 * value 0.9748337 (baked - closed = +2.98e-7, i.e. the round-off of the 7th digit). The claimed
 * 6-digit agreement is CONFIRMED, not corrected: the tail normalization denominator is sound.
 *
 * VERDICT. Sigma^2(495.779) = 0.9748337 computed two independent ways (direct Simpson integral of
 * (sin pi u / pi u)^2, and the closed-form (1/pi^2)(ln(2 pi L)+gamma+1)) agree to ~1.9e-9; the
 * imp-96567 6-digit-agreement claim behind the rho_k = Cov_k/Sigma^2 tail normalization is
 * CONFIRMED. Measurement/check only; conditional on the GUE sine kernel / Montgomery pair
 * correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the Sigma^2 and rho_k this cross-checks)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the disjoint-interval covariance frame)
 *
 * Import-light: no zeros bundle, no sibling imports. L, the baked literal, and both computations
 * are re-derived here on T_2 and the closed form.
 */

const PI = Math.PI;
const GAMMA = 0.5772156649015329;
const L = 495.779; // T = 1.5e5 non-overlapping box length (imp-96542 / imp-96567)

// GUE two-point cluster function T_2(u) = (sin(pi u)/(pi u))^2 (nonnegative).
const clusterT2 = (u) => {
  if (u === 0) return 1;
  const s = Math.sin(PI * u) / (PI * u);
  return s * s;
};

// (A) Direct Simpson integral: Sigma^2(L) = L - int_{-L}^{L} (L-|u|) T_2(u) du.
// Integrate the even integrand (L-|u|) T_2(u) on [0,L] with composite Simpson, then double.
const sigma2Direct = (h) => {
  const g = (u) => (L - Math.abs(u)) * clusterT2(u);
  const n = Math.round(L / h);
  const N = n % 2 === 0 ? n : n + 1; // even number of intervals
  const step = L / N;
  let sum = g(0) + g(L);
  for (let i = 1; i < N; i++) {
    sum += (i % 2 === 1 ? 4 : 2) * g(i * step);
  }
  const halfInt = (step / 3) * sum;
  return L - 2 * halfInt;
};

// (B) Closed-form GUE asymptotic.
const sigma2Closed = (len) => (Math.log(2 * PI * len) + GAMMA + 1) / (PI * PI);

const SIGMA2_DIRECT = sigma2Direct(0.0025); // 0.97483370
const SIGMA2_CLOSED = sigma2Closed(L); // 0.97483370
const SIGNED_RESIDUAL = SIGMA2_DIRECT - SIGMA2_CLOSED; // -1.86e-9
const BAKED_LITERAL = 0.974834; // imp-96567 6-sig-fig round
const BAKED_MINUS_CLOSED = BAKED_LITERAL - SIGMA2_CLOSED; // +2.98e-7 (7th-digit round-off)

export const IMP96589_SIGMA2_GUE_ASYMPTOTIC_CROSSCHECK = {
  ticket: 'imp-96589',
  question:
    'Cross-check the imp-96567 direct number variance Sigma^2(L) = 0.974834 at L = 495.779 against the GUE asymptotic (1/pi^2)(ln(2 pi L) + gamma + 1), tabulating the two side by side with the signed residual and confirming the claimed 6-digit agreement.',
  boxLength: L,
  // The side-by-side table the ticket asks for.
  table: [
    { method: 'direct Simpson integral of (sin pi u / pi u)^2', sigma2: SIGMA2_DIRECT },
    { method: 'closed-form (1/pi^2)(ln(2 pi L) + gamma + 1)', sigma2: SIGMA2_CLOSED },
    { method: 'imp-96567 baked 6-sig-fig literal', sigma2: BAKED_LITERAL },
  ],
  signedResidualDirectMinusClosed: SIGNED_RESIDUAL, // -1.86e-9: agreement to ~9 digits
  bakedMinusClosed: BAKED_MINUS_CLOSED, // +2.98e-7: the 7th-digit round-off of the baked literal
  agreementDigits: 9, // direct vs closed agree to ~9 significant digits (> the claimed 6)
  verdict:
    'CONFIRMED. Sigma^2(495.779) computed two independent ways -- the direct Simpson integral of the sin^2 cluster function and the closed-form (1/pi^2)(ln(2 pi L)+gamma+1) -- both give 0.97483370, with signed residual direct-closed = -1.86e-9 (h-stable), agreement to ~9 digits, far tighter than the claimed six. The imp-96567 baked literal 0.974834 is the exact 6-sig-fig round of 0.9748337 (baked-closed = +2.98e-7). The 6-digit-agreement claim anchoring the rho_k = Cov_k/Sigma^2 tail normalization is confirmed, not corrected. Measurement/check only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96589_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/check only: Sigma^2(495.779) = 0.9748337 '
  + 'from the direct Simpson integral of (sin pi u / pi u)^2 and from the closed-form '
  + '(1/pi^2)(ln(2 pi L)+gamma+1) agree to ~1.9e-9 (~9 digits), confirming the imp-96567 6-digit claim. '
  + 'Conditional on the GUE sine kernel / pair correlation for the zeta zeros (UNPROVEN); changes no '
  + 'unconditional bound.';

// --- self-executing internal-consistency assertions (re-derivation; no zeros) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // both computations reproduce the baked 6-sig-fig literal
  if (!approx(SIGMA2_DIRECT, BAKED_LITERAL, 1e-6)) throw new Error('imp-96589: direct Sigma^2 must round to the baked 0.974834');
  if (!approx(SIGMA2_CLOSED, BAKED_LITERAL, 1e-6)) throw new Error('imp-96589: closed-form Sigma^2 must round to the baked 0.974834');
  // direct vs closed agree far tighter than 6 digits (the confirmation)
  if (!(Math.abs(SIGNED_RESIDUAL) < 1e-7)) throw new Error('imp-96589: direct and closed Sigma^2 must agree beyond 6 digits');
  // the direct integral is h-stable (Simpson has converged)
  if (!approx(sigma2Direct(0.0025), sigma2Direct(0.00125), 1e-8))
    throw new Error('imp-96589: direct Simpson integral must be step-size stable');
  // the baked literal is the 7-digit round of the closed form, not a discrepancy
  if (!(Math.abs(BAKED_MINUS_CLOSED) < 5e-7)) throw new Error('imp-96589: baked literal must be the 6-sig-fig round of the closed form');
  // cluster function nonnegative (the sign engine of imp-96543)
  for (let u = 0; u <= 12; u += 0.01) {
    if (clusterT2(u) < -1e-15) throw new Error('imp-96589: cluster function T_2 must be nonnegative');
  }
  // honesty gates
  if (!/NO QED/.test(IMP96589_SIGMA2_GUE_ASYMPTOTIC_CROSSCHECK.verdict))
    throw new Error('imp-96589: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96589_SIGMA2_GUE_ASYMPTOTIC_CROSSCHECK.verdict))
    throw new Error('imp-96589: verdict dropped the no-refereed-bound-change banner');
  if (!/conditional/i.test(IMP96589_SIGMA2_GUE_ASYMPTOTIC_CROSSCHECK.verdict))
    throw new Error('imp-96589: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96589_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96589_HONEST_BANNER) && /NO QED/.test(IMP96589_HONEST_BANNER)))
    throw new Error('imp-96589: IMP96589_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96589_SIGMA2_GUE_ASYMPTOTIC_CROSSCHECK;
