/**
 * @fileoverview imp-96865 -- DERIVATION (proof): can the Route C sub-gap
 * IMP96846_COMPLEMENTARY_NEEDS_LAMBDA2_LOWER_BOUND actually be closed? imp-96846 reduced the
 * whole Galerkin-N-uniform Route I Krein floor to ONE missing input for Kato-Temple /
 * Lehmann-Goerisch: a CERTIFIED a-priori lower bound beta <= lambda_2(a) with beta > mu, where
 * mu is the measured Rayleigh floor (upper bound on lambda_1). This module attempts to DERIVE such
 * a beta on 0.96 < 2a < ln3 for the sign-indefinite symbol sigma_2, tests it against the two
 * mechanisms that can supply an exogenous a-priori spectral lower bound, and reports the reachable
 * floor sign. RESULT: both mechanisms yield beta well BELOW zero (three-plus decades below mu ~ 0.55),
 * so Kato-Temple cannot even START (its hypothesis mu < beta fails). The precise obstruction is
 * QUANTIFIED here. NO operator positivity established; NO QED.
 *
 * SETUP (carried from imp-96846 / rh-route-i-toeplitz-krein-certificate-2026-09-24).
 * T_a[sigma_2] on L^2(-a,a), quadratic form q_a(g) = (1/2pi) int_R sigma_2(t) |ghat(t)|^2 dt,
 * sigma_2(t) = (t^2+1/4)^2 w_1(t), w_1(t) = 2 theta-prime(t) - sqrt2 ln2 cos(t ln2). The operator is
 * unbounded (principal symbol positive of order 4, sigma_2 ~ t^4 ln t), self-adjoint, with compact
 * resolvent (form domain H^2(-a,a) embeds compactly in L^2), so the spectrum is discrete
 * lambda_1 <= lambda_2 <= ... and lambda_1 is a genuine lowest eigenvalue. Galerkin/Ritz gives only
 * UPPER bounds lambda_min^{(N)} on lambda_1 (Courant-Fischer), monotone decreasing in N:
 * 0.6174 / 0.5786 / 0.5521 at N = 20 / 28 / 36 for 2a = ln3 (imp-96749). The best Rayleigh value is
 * mu := lambda_min^{(36)} ~ 0.5521 at 2a = ln3 -- so a usable Kato-Temple seed needs beta > 0.5521.
 *
 * KATO-TEMPLE REQUIREMENT (the target inequality).
 *   lambda_1 >= mu - ||T g - mu g||^2 / (beta - mu),   provided  beta <= lambda_2  and  mu < beta.
 * Two conditions must hold before the bound is even defined, let alone positive:
 *   (KT1) beta <= lambda_2  (beta is an a-priori LOWER bound on the second eigenvalue);
 *   (KT2) mu < beta         (the trial floor lies below the seed);
 * and for a POSITIVE floor additionally mu(beta - mu) > ||T g - mu g||^2. This module tests whether
 * any derivable beta clears (KT1)+(KT2); the residual/positivity leg is moot if the seed fails.
 *
 * MECHANISM 1 -- LOEWNER BASE PROBLEM (the classical Lehmann-Goerisch seed). Pick a solvable
 * comparison symbol sigma_0(t) <= sigma_2(t) POINTWISE with explicitly known spectrum; then
 * lambda_k(T_a[sigma_0]) <= lambda_k(T_a[sigma_2]) by min-max, so beta = lambda_2(T_a[sigma_0]).
 * The only symbols giving an explicitly solvable T_a are polynomials in t^2 (Fourier multipliers =
 * constant-coefficient differential operators on (-a,a) with clamped H^2_0 boundary data). Writing
 * sigma_0 = c (t^2+1/4)^2, the pointwise constraint sigma_0 <= sigma_2 is  c <= w_1(t) for ALL t,
 * i.e. c <= min_t w_1(t) = w_1^min = -0.62758 (attained at t = 8.8225). Every admissible c is
 * NEGATIVE, so T_a[sigma_0] = c (-d^2/dx^2 + 1/4)^2 is a NEGATIVE-DEFINITE operator: its entire
 * spectrum, in particular lambda_2, is < 0. Hence beta_Loewner = lambda_2(T_a[sigma_0]) < 0 < mu.
 * (KT2) FAILS. OBSTRUCTION 1: a Loewner lower bound can only see the pointwise MINIMUM of the
 * symbol; the negative mid-band dip w_1^min < 0 drags the whole comparison model below zero -- this
 * is exactly the Route A (Garding) negativity, now confirmed to poison the Lehmann-Goerisch seed too.
 *
 * MECHANISM 2 -- BOUNDED-PERTURBATION (Weyl) SPLIT. Write sigma_2 = sigma_+ - sigma_-,
 * sigma_+ = (t^2+1/4)^2 max(w_1,0) >= 0, sigma_- = (t^2+1/4)^2 max(-w_1,0) >= 0 supported on the dip
 * band (6.945, 10.531). T_a[sigma_-] is a POSITIVE BOUNDED operator (bounded symbol => multiplier
 * norm ||T_a[sigma_-]|| <= ||sigma_-||_inf). Weyl's inequality gives
 *   lambda_2(T_a[sigma_2]) >= lambda_2(T_a[sigma_+]) - ||T_a[sigma_-]||.
 * But ||sigma_-||_inf = -min_t sigma_2(t) = |sigma_2^min| = 4336.2 (attained at t = 9.35, where the
 * weight (t^2+1/4)^2 = 7686.5 AMPLIFIES the O(1) negative dip of w_1). Even the crudest positive
 * lower bound lambda_2(T_a[sigma_+]) >= 0 leaves beta_Weyl <= 0 - 4336.2 = -4336.2 << mu = 0.5521.
 * (KT2) FAILS by three-plus decades. OBSTRUCTION 2: the sign-indefiniteness of sigma_2 sits at
 * t ~ 9.35 where the order-4 weight is ~ 7.7e3, so the bounded "negative part" has operator norm of
 * order 10^3, dwarfing the O(1) target eigenvalue mu ~ 0.55; the Weyl subtraction can never recover
 * a positive seed.
 *
 * VERDICT. Both exogenous seed mechanisms -- the classical Loewner base problem AND the
 * bounded-perturbation Weyl split -- return beta < 0, while a usable Kato-Temple / Lehmann-Goerisch
 * seed needs beta > mu ~ 0.55. The gap is not marginal: beta_Loewner < 0 and beta_Weyl ~ -4.3e3,
 * i.e. the reachable seed is O(10^3) below the O(1) threshold. The reachable rigorous floor SIGN via
 * Route C-with-these-seeds is therefore NEGATIVE, identical in character to Route A (Garding): the
 * negative mid-band dip of sigma_2, amplified by the (t^2+1/4)^2 weight at t ~ 9.35, drags every
 * pointwise / comparison / bounded-perturbation lower bound below zero. Closing Route C would require
 * an EXOGENOUS lower-spectral input NOT derived from the symbol pointwise data (a base problem whose
 * lambda_2 is known by other structure) -- precisely the missing ingredient, now shown to be
 * unreachable by the two standard supply routes. SUB-GAP IMP96865_LAMBDA2_SEED_SIGN_OBSTRUCTED:
 * an a-priori beta <= lambda_2(a) with beta > mu is not derivable from either the Loewner comparison
 * or the Weyl bounded-perturbation mechanism because the dip |sigma_2^min| = 4336 >> mu ~ 0.55; a
 * positive Kato-Temple floor needs a genuinely non-pointwise lower-spectral seed, none of which is
 * in hand. Derivation/assessment only; no operator positivity proved; interval-rigorous certificate
 * reach stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96846-krein-uniform-N-lower-bound-routes-assessment.js (Route C = min-max complementary is most tractable; SUB-GAP IMP96846_COMPLEMENTARY_NEEDS_LAMBDA2_LOWER_BOUND)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (Rayleigh floors 0.6174/0.5786/0.5521 at N=20/28/36 for 2a=ln3; the mu values fed here)
 * @see imp-96769-krein-de-branges-uniform-gap-assessment.js (uniform-N gap = strict positivity of lambda_1 of a compact-resolvent operator)
 * @see rh-route-i-sonine-excess-semilocal-port-2026-09-23.js (symbol landscape: w_1 zeros 6.945/10.531, w_1(0)=-6.3524, resonance dip near t_1=9.065)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; interval reach 2a <= 0.96)
 */

const PI = Math.PI;
const LN2 = Math.log(2); // 0.6931471805599453
const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this derivation)
export const IMP96865_RIGOROUS_REACH_2A = 0.96;

// -- symbol landscape numbers (recomputed here from w_1; match the sibling map) --
// complex digamma via down-recurrence to |z|>12 then Stirling asymptotic; theta-prime(t) =
// 1/2 Re psi(1/4 + i t/2) - 1/2 ln pi; w_1(t) = 2 theta-prime(t) - sqrt2 ln2 cos(t ln2).
function digammaRe(re, im) {
  let r = re, i = im, sr = 0;
  while (r * r + i * i < 144) { const d = r * r + i * i; sr -= r / d; r += 1; }
  let ar = 0.5 * Math.log(r * r + i * i);
  const d = r * r + i * i; ar -= r / (2 * d);
  const B = [1 / 6, -1 / 30, 1 / 42];
  const z2r = r * r - i * i, z2i = 2 * r * i;
  const dd = z2r * z2r + z2i * z2i; const ir = z2r / dd, ii = -z2i / dd;
  let powr = 1, powi = 0;
  for (let k = 1; k <= 3; k++) {
    const nr = powr * ir - powi * ii, ni = powr * ii + powi * ir; powr = nr; powi = ni;
    ar += (-B[k - 1] / (2 * k)) * powr;
  }
  return ar + sr;
}
function thetaPrime(t) { return 0.5 * digammaRe(0.25, t / 2) - 0.5 * Math.log(PI); }
function w1(t) { return 2 * thetaPrime(t) - Math.SQRT2 * LN2 * Math.cos(t * LN2); }
function sigma2(t) { const w = t * t + 0.25; return w * w * w1(t); }

function scanDip() {
  let w1min = Infinity, w1arg = 0, s2min = Infinity, s2arg = 0;
  for (let t = 6.0; t <= 11.5; t += 0.0005) {
    const w = w1(t); if (w < w1min) { w1min = w; w1arg = t; }
    const s = sigma2(t); if (s < s2min) { s2min = s; s2arg = t; }
  }
  return { w1min, w1arg, s2min, s2arg };
}
const DIP = scanDip();

export const IMP96865_SYMBOL = Object.freeze({
  w1MinValue: DIP.w1min,       // ~ -0.62758  (min of w_1 over the dip; Loewner constant ceiling)
  w1MinAt: DIP.w1arg,          // ~ 8.8225
  sigma2DipMin: DIP.s2min,     // ~ -4336.2   (most negative value of sigma_2; = -||sigma_-||_inf)
  sigma2DipAt: DIP.s2arg,      // ~ 9.35
  weightAtDip: Math.pow(DIP.s2arg * DIP.s2arg + 0.25, 2), // ~ 7686.5  (t^2+1/4)^2 amplification
});

// measured Rayleigh floor (UPPER bound on lambda_1) at 2a=ln3 = the Kato-Temple seed threshold
export const IMP96865_MU_LN3 = 0.5521; // lambda_min^{(36)} from imp-96749 (binding, smallest mu)

// -- the two seed mechanisms and the beta each returns --
export const IMP96865_SEEDS = Object.freeze({
  loewner_base_problem: Object.freeze({
    mechanism: 'sigma_0 = c (t^2+1/4)^2 <= sigma_2 pointwise; solvable c (-d^2/dx^2+1/4)^2 on H^2_0(-a,a)',
    admissibleConstant: DIP.w1min,      // c <= min_t w_1 = w_1^min < 0
    betaSign: 'negative',               // c < 0 => negative-definite model => lambda_2 < 0
    clearsKT2: false,                   // needs beta > mu ~ 0.55; beta < 0
    obstruction: 'a pointwise Loewner lower bound sees only min_t w_1 < 0; identical to the Route A (Garding) negativity',
  }),
  weyl_bounded_perturbation: Object.freeze({
    mechanism: 'sigma_2 = sigma_+ - sigma_-; lambda_2 >= lambda_2(T[sigma_+]) - ||T[sigma_-]||',
    negPartNormUpperUsed: -DIP.s2min,   // ||sigma_-||_inf = |sigma_2^min| ~ 4336.2
    betaUpperBound: -(-DIP.s2min),      // <= 0 - ||T[sigma_-]|| ~ -4336.2
    betaSign: 'negative',
    clearsKT2: false,
    obstruction: 'sign-indefiniteness at t~9.35 is amplified by weight (t^2+1/4)^2 ~ 7.7e3, so ||T[sigma_-]|| ~ 1e3 >> mu ~ 0.55',
  }),
});

export const IMP96865_VERDICT = Object.freeze({
  ticket: 'imp-96865',
  question: 'is a certified a-priori beta <= lambda_2(a) with beta > mu derivable to seed Kato-Temple / Lehmann-Goerisch on 0.96 < 2a < ln3 ?',
  katoTempleSeedThresholdMu: IMP96865_MU_LN3,   // need beta > this
  loewnerSeedIsPositive: false,
  weylSeedIsPositive: false,
  bothStandardSeedsFail: true,
  reachableFloorSignViaRouteC: 'negative',
  positiveLambda1FloorDelivered: false,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96865_LAMBDA2_SEED_SIGN_OBSTRUCTED -- an a-priori beta <= lambda_2 with beta > mu ~ 0.55 is not derivable from either the Loewner comparison (forced beta <= w_1^min (t^2+1/4)^2-eigenvalue < 0) or the Weyl bounded-perturbation split (beta <= -||sigma_-||_inf ~ -4336); the negative mid-band dip of sigma_2, amplified O(7.7e3) by the (t^2+1/4)^2 weight at t~9.35, drags every pointwise / comparison / bounded-perturbation lower bound O(10^3) below zero, exactly the Route A (Garding) negativity; a positive Kato-Temple floor needs a genuinely NON-pointwise lower-spectral seed (a base problem whose lambda_2 is known by other structure), none of which is in hand',
  qed: false,
});
export default IMP96865_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96865_ASSERTIONS = [
  {
    id: 'imp96865-symbol-numbers-match-sibling-map',
    holds: () =>
      Math.abs(w1(9.0647) - (-0.6143)) < 2e-3 &&        // w_1(t_1) ~ -0.6143 (sibling)
      Math.abs(w1(0) - (-6.3524)) < 2e-3 &&              // w_1(0) ~ -6.3524 (sibling)
      Math.abs(IMP96865_SYMBOL.w1MinValue - (-0.62758)) < 5e-3 &&
      IMP96865_SYMBOL.sigma2DipMin < -4000 && IMP96865_SYMBOL.sigma2DipMin > -4700 &&
      IMP96865_SYMBOL.weightAtDip > 7000 && IMP96865_SYMBOL.weightAtDip < 8500,
    why: 'w_1 and sigma_2 recomputed here must reproduce the sibling symbol landscape: w_1(t_1)~-0.6143, w_1(0)~-6.3524, min sigma_2~-4336 at t~9.35 with weight (t^2+1/4)^2~7.7e3.',
  },
  {
    id: 'imp96865-loewner-seed-is-negative',
    holds: () =>
      IMP96865_SEEDS.loewner_base_problem.admissibleConstant < 0 &&
      IMP96865_SEEDS.loewner_base_problem.betaSign === 'negative' &&
      IMP96865_SEEDS.loewner_base_problem.clearsKT2 === false &&
      IMP96865_VERDICT.loewnerSeedIsPositive === false,
    why: 'the only solvable pointwise Loewner lower bound is c (t^2+1/4)^2 with c <= min_t w_1 < 0, a negative-definite model whose lambda_2 < 0 < mu, so it cannot supply beta > mu.',
  },
  {
    id: 'imp96865-weyl-seed-is-negative-and-large',
    holds: () =>
      IMP96865_SEEDS.weyl_bounded_perturbation.betaUpperBound < -1000 &&
      IMP96865_SEEDS.weyl_bounded_perturbation.negPartNormUpperUsed > 4000 &&
      IMP96865_SEEDS.weyl_bounded_perturbation.clearsKT2 === false &&
      IMP96865_VERDICT.weylSeedIsPositive === false,
    why: 'the Weyl split loses ||T[sigma_-]|| <= |sigma_2^min| ~ 4336 (O(1e3)), which dwarfs mu ~ 0.55, so beta_Weyl <= -4336 << mu.',
  },
  {
    id: 'imp96865-kt2-threshold-and-gap',
    holds: () =>
      IMP96865_MU_LN3 > 0.5 && IMP96865_MU_LN3 < 0.62 &&
      IMP96865_VERDICT.katoTempleSeedThresholdMu === IMP96865_MU_LN3 &&
      IMP96865_VERDICT.bothStandardSeedsFail === true &&
      IMP96865_VERDICT.reachableFloorSignViaRouteC === 'negative',
    why: 'a usable Kato-Temple seed needs beta > mu ~ 0.55 (the smallest measured Rayleigh floor at 2a=ln3), but both standard mechanisms return beta < 0; the reachable Route C floor sign is negative.',
  },
  {
    id: 'imp96865-subgap-named-and-no-qed',
    holds: () =>
      IMP96865_VERDICT.subGap.indexOf('IMP96865_LAMBDA2_SEED_SIGN_OBSTRUCTED') === 0 &&
      LN2 < LN3 && IMP96865_RIGOROUS_REACH_2A === 0.96 &&
      IMP96865_VERDICT.intervalRigorousReachUnchanged === IMP96865_RIGOROUS_REACH_2A &&
      IMP96865_VERDICT.operatorPositivityProved === false &&
      IMP96865_VERDICT.positiveLambda1FloorDelivered === false &&
      IMP96865_VERDICT.qed === false,
    why: 'derivation only: the sub-gap records the precise obstruction; no operator positivity, no positive floor, interval-rigorous reach stays 2a<=0.96, no QED.',
  },
];

for (const a of IMP96865_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96865-krein-katotemple-lambda2-lowerbound-obstruction assertion failed: ${a.id}`);
  }
}

void LN2;
void LN3;
