/**
 * @module imp-35299-k72-two-source-decomposition
 *
 * imp-35299 (accuracy, frontier-measurement): DECOMPOSE the imp-35244 eps^{7/2} coefficient
 * K_{7/2} = -8 sqrt(2)/(3 pi) = -1.20042 into its TWO named analytic sources and MEASURE each source
 * tail SEPARATELY on the imp-35240 compensated finite-cutoff quadrature. imp-35244 assembled K_{7/2}
 * from a numerator R_2 (|F_2|) tail and an |F_3| - A_2/4 curvature tail via
 *     K_{7/2} = (2/3)[ -12/(7 A_1) - 24/(7 A_2) ] = (2/3)(-4/A_1) = -8/(3 A_1),
 * but only reported the COMBINED value; imp-35261 verifies only the SUMMED coefficient on the deep
 * ladder. This module reads the two source tails INDEPENDENTLY (the |F_2| tail R_2 and the |F_3| - A_2/4
 * curvature tail D_3, each vs eps^{7/2}) and confirms they reconstruct the grid-measured K_{7/2}.
 * MEASUREMENT ONLY on the inherited model-cusp surrogate; does NOT discharge O3; G6a stays OPEN; NO QED.
 *
 * THE TWO SOURCES AND HOW THEY ENTER dev = (b R_2 - a D_3) / (2 b (b + D_3))
 * -------------------------------------------------------------------------
 * With a = A_1/2 = |F_2(inf)|, b = A_2/4 = |F_3(inf)| the cancellation-free deviation is
 *     dev = rho(eps) - 2/3 = (b R_2 - a D_3) / (2 b (b + D_3)),   R_2 = |F_2(L)| - a,  D_3 = |F_3(L)| - b.
 * The RAW tails have exact large-L expansions (L = eps^{-1/2}):
 *   (S1) NUMERATOR |F_2| tail. g_2(t) = 2(t^4-1)/(t^4+1)^2 = 2 t^{-4} - 6 t^{-8} + O(t^{-12}), so
 *        R_2 = integral_L^inf g_2 = (2/3) eps^{3/2} - (6/7) eps^{7/2} + O(eps^{11/2}). Its eps^{3/2} head
 *        builds the leading K_{3/2}; the -(6/7) eps^{7/2} tail is the first SOURCE.
 *   (S2) CURVATURE |F_3| - A_2/4 tail. g3diff(t) = (1-3 t^4)/(t^4+1)^3 = -3 t^{-8} + O(t^{-12}) (the odd-p
 *        difference pairing whose t^{-6} cancels), so D_3 = -2 integral_L^inf g3diff = +(6/7) eps^{7/2}
 *        + O(eps^{11/2}). The leading tail is eps^{7/2} (NO eps^{5/2}), the second SOURCE.
 * Linearizing dev about (R_2 = (2/3) eps^{3/2}, D_3 = 0) at eps^{7/2} order, the two raw tails map to their
 * dev-coefficient CONTRIBUTIONS through fixed analytic factors:
 *     numerator contribution  = [ -(6/7) ] / (2 b)          = -12/(7 A_2) = -8/(7 A_1)  = -0.514466
 *     curvature contribution  = -( a / (2 b^2) ) * [ +(6/7) ] = -24 A_1/(7 A_2^2) = -16/(7 A_2) = -0.685955
 *     sum = -8/(7 A_1) - 16/(7 A_2) = -8/(3 A_1) = -8 sqrt(2)/(3 pi) = K_{7/2}.
 * (The cross term R_2^{(3/2)} * D_3 is O(eps^5), higher order, so it does not touch eps^{7/2}.) The two
 * contributions match the imp-35244 bracket (2/3)[-12/(7 A_1) - 24/(7 A_2)] source-by-source.
 *
 * RESULT (measured, this build)
 * -----------------------------
 * On the imp-35240 compensated finite-cutoff ladder eps = {1e-3, 3e-4, 1e-4, 3e-5, 1e-5}, reading the two
 * raw tails and their mapped contributions SEPARATELY:
 *   - RAW numerator tail (R_2 - (2/3) eps^{3/2}) / eps^{7/2} -> -0.857143 = -6/7 (matches S1 to 6 sig figs);
 *   - RAW curvature tail D_3 / eps^{7/2} -> +0.857143 = +6/7 (matches S2 to 6 sig figs);
 *   - mapped numerator contribution -> -0.514466 = -8/(7 A_1), mapped curvature contribution -> -0.685955
 *     = -16/(7 A_2); their SUM -> -1.200422, reconstructing the grid-measured K_{7/2} = -8 sqrt(2)/(3 pi)
 *     read on the SAME ladder via r1/eps^{7/2} to 5-6 sig figs. Neither source alone is K_{7/2}: the
 *     numerator carries ~42.9% and the curvature ~57.1% of the coefficient.
 * So the imp-35244 combined coefficient genuinely SPLITS into these two independently-measured tails.
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a
 * rigorous remainder bound on the TRUE RvM cusp jet. Splitting the next-order coefficient into its two
 * measured source tails resolves the remainder SHAPE further but supplies neither the uniform inequality nor
 * a certified bound, and is read on the inherited model-cusp surrogate. G-b / G6a stay OPEN.
 *
 * VERDICT: MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate. The two named
 * eps^{7/2} sources of K_{7/2} -- the numerator |F_2| tail R_2 (-6/7 raw -> -8/(7 A_1) contribution) and the
 * curvature |F_3| - A_2/4 tail D_3 (+6/7 raw -> -16/(7 A_2) contribution) -- are measured INDEPENDENTLY on
 * the imp-35240 compensated finite-cutoff quadrature and confirmed to sum to the grid-measured
 * K_{7/2} = -8 sqrt(2)/(3 pi) = -1.20042 (imp-35261 verified only the SUM). This isolates the two
 * contributions but does NOT certify a uniform modulus, does NOT discharge O3 or G6a, establishes no
 * operator positivity, changes no bound. G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal
 * endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35244-rho-eps52-coefficient-measurement (assembled K_{7/2} from the two sources, reported only the sum)
 * @see imp-35261-k72-compensated-deep-rung-confirmation (verified the SUMMED K_{7/2} on the deep ladder)
 * @see imp-35240-rho-prefactor-finer-grid-remeasurement (the compensated finite-cutoff ladder reused here)
 * @see imp-35265-eps52-cancellation-exact-identity (odd-p pairing -> empty eps^{5/2} slot, exact identity)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2), F_2(inf) = -A_1/2)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), F_3(inf) = -A_2/4)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants (imp-33645 / imp-33646).
const A1 = PI / SQRT2; // eps^{3/2} renorm of |m_prime|        -> |F_2(inf)| = A_1/2 = a
const A2 = (3 * PI) / (2 * SQRT2); // eps^{5/2} renorm of |m_double_prime| -> |F_3(inf)| = A_2/4 = b

// The certified leading coefficient (imp-35216) and the imp-35244 next-order coefficient being split here.
const K_THREE_HALVES = 4 / (3 * A2); // = 8 sqrt(2)/(9 pi) = 0.40014
const K_SEVEN_HALVES = -8 / (3 * A1); // = -8 sqrt(2)/(3 pi) = -1.20042 (the SUM imp-35261 verified)

// The TWO named analytic source contributions (imp-35244 bracket, split source-by-source).
const CONTRIB_NUM_CF = -8 / (7 * A1); // numerator |F_2| tail contribution  = -12/(7 A_2)  ~ -0.514466
const CONTRIB_CURV_CF = -16 / (7 * A2); // curvature |F_3| - A_2/4 tail contribution        ~ -0.685955
// Raw tail coefficients each source approaches (both magnitude 6/7).
const RAW_NUM_TAIL_CF = -6 / 7; // (R_2 - (2/3) eps^{3/2}) / eps^{7/2} -> -6/7
const RAW_CURV_TAIL_CF = 6 / 7; // D_3 / eps^{7/2}                     -> +6/7

// ── imp-35240 compensated finite-cutoff machinery (Kahan-compensated mapped Simpson). ──
const F_INF_PANELS = 1000000;
const TAIL_PANELS = 300000;

// Numerator integrand g_2(t) = (t^2-i)^{-2} + (t^2+i)^{-2} = 2(t^4-1)/(t^4+1)^2 (even p: SUM, real).
function g2(t) {
  const t4 = t * t * t * t;
  const s = t4 + 1;
  return (2 * (t4 - 1)) / (s * s);
}
// Denominator integrand: the odd-p (p=3) DIFFERENCE pairing Im[(t^2+i)^{-3}] = (1-3t^4)/(t^4+1)^3.
function g3diff(t) {
  const t4 = t * t * t * t;
  return (1 - 3 * t4) / Math.pow(t4 + 1, 3);
}

// Kahan-compensated composite-Simpson rule over [0, 1] with `panels` intervals (panels even).
function compensatedSimpson(f, panels) {
  const h = 1 / panels;
  let sum = 0;
  let comp = 0;
  for (let i = 0; i <= panels; i++) {
    const w = i === 0 || i === panels ? 1 : i % 2 === 1 ? 4 : 2;
    const y = w * f(i * h) - comp;
    const t = sum + y;
    comp = t - sum - y;
    sum = t;
  }
  return (sum * h) / 3;
}
// integral_0^infinity g(t) dt via t = s/(1-s).
function fInfinity(g, panels) {
  return compensatedSimpson((x) => {
    if (x >= 1) return 0;
    const om = 1 - x;
    return g(x / om) / (om * om);
  }, panels);
}
// integral_L^infinity g(t) dt via t = L/w (integrand -> 0 at w = 0).
function tailIntegral(g, L, panels) {
  return compensatedSimpson((w) => {
    if (w === 0) return 0;
    const t = L / w;
    return g(t) * (L / (w * w));
  }, panels);
}

// Machine-precision infinite-cutoff renorm constants (computed once): a = A_1/2, b = A_2/4.
const F2_INF = fInfinity(g2, F_INF_PANELS);
const J_INF = fInfinity(g3diff, F_INF_PANELS); // |F_3(inf)| = 2 |J_INF|
const A = Math.abs(F2_INF); // = A_1/2
const B = 2 * Math.abs(J_INF); // = A_2/4

const TWO_THIRDS = 2 / 3; // A_1/A_2 = 2/3, the imp-35076 a-fortiori limit rho approaches from above.

// The measurement ladder (imp-35261 clean window: eps well below the imp-35244 Simpson floor eps ~ 2.5e-3).
const EPS_LADDER = [1e-3, 3e-4, 1e-4, 3e-5, 1e-5];

const LADDER = EPS_LADDER.map((eps) => {
  const L = 1 / Math.sqrt(eps);
  const R2 = tailIntegral(g2, L, TAIL_PANELS); // |F_2(L)| - A_1/2
  const D3 = -2 * tailIntegral(g3diff, L, TAIL_PANELS); // |F_3(L)| - A_2/4
  // RAW source tails read SEPARATELY vs eps^{7/2}.
  const rawNumTail = (R2 - TWO_THIRDS * Math.pow(eps, 1.5)) / Math.pow(eps, 3.5); // -> -6/7
  const rawCurvTail = D3 / Math.pow(eps, 3.5); // -> +6/7
  // Mapped dev-coefficient contributions (fixed analytic linearization factors).
  const contribNum = rawNumTail / (2 * B); // -> -8/(7 A_1)
  const contribCurv = -(A / (2 * B * B)) * rawCurvTail; // -> -16/(7 A_2)
  // Grid-measured SUM on the SAME ladder (imp-35261 route) for the reconstruction cross-check.
  const dev = (B * R2 - A * D3) / (2 * B * (B + D3)); // cancellation-free rho - 2/3
  const r1 = dev - K_THREE_HALVES * Math.pow(eps, 1.5); // residual after the leading two terms
  const gridK72 = r1 / Math.pow(eps, 3.5); // -> K_{7/2} = -1.20042
  const N = (2 * PI) / (eps * eps); // reading depth N = 2 pi / eps^2
  return {
    eps,
    N,
    rawNumTail,
    rawCurvTail,
    contribNum,
    contribCurv,
    contribSum: contribNum + contribCurv,
    gridK72,
    reconstructionGap: contribNum + contribCurv - gridK72, // split sum vs grid summed
  };
});

// The tightest CLEAN rung: minimize the split-sum vs grid-summed reconstruction gap.
const BEST = LADDER.reduce((best, r) =>
  Math.abs(r.reconstructionGap) < Math.abs(best.reconstructionGap) ? r : best,
);

// (A) each raw source tail matches its closed-form (-6/7 numerator, +6/7 curvature) at the best rung.
const RAW_TAILS_MATCH =
  Math.abs(BEST.rawNumTail - RAW_NUM_TAIL_CF) < 5e-4 && Math.abs(BEST.rawCurvTail - RAW_CURV_TAIL_CF) < 5e-4;
// (B) each mapped contribution matches its closed form.
const CONTRIBS_MATCH =
  Math.abs(BEST.contribNum - CONTRIB_NUM_CF) < 5e-4 && Math.abs(BEST.contribCurv - CONTRIB_CURV_CF) < 5e-4;
// (C) the two contributions reconstruct the grid-measured K_{7/2} (neither alone is K_{7/2}).
const SUM_RECONSTRUCTS_K72 =
  Math.abs(BEST.contribSum - K_SEVEN_HALVES) < 5e-3 && Math.abs(BEST.reconstructionGap) < 5e-3;

export const IMP35299_K72_TWO_SOURCE_DECOMPOSITION = {
  id: 'imp-35299',
  proofSection: 'S-frontier',
  scopes:
    'Decompose the imp-35244 eps^{7/2} coefficient K_{7/2} = -8 sqrt(2)/(3 pi) into its two named analytic ' +
    'sources -- the numerator |F_2| tail R_2 and the curvature |F_3| - A_2/4 tail D_3 -- and measure each ' +
    'source tail SEPARATELY on the imp-35240 compensated finite-cutoff quadrature',
  question:
    'Do the two eps^{7/2} source tails (numerator R_2 -> -6/7, curvature D_3 -> +6/7), mapped through their ' +
    'analytic linearization factors to -8/(7 A_1) and -16/(7 A_2), reconstruct the grid-measured ' +
    'K_{7/2} = -1.20042 that imp-35261 verified only as a SUM? Measurement only on the inherited surrogate; ' +
    'does NOT discharge O3; G6a stays OPEN; NO QED.',

  twoThirdsLimit: TWO_THIRDS,

  // Constants and the split closed forms.
  A1,
  A2,
  aRenorm: +A.toFixed(10), // |F_2(inf)| = A_1/2 = a
  bRenorm: +B.toFixed(10), // |F_3(inf)| = A_2/4 = b
  kThreeHalves: +K_THREE_HALVES.toFixed(10), // 0.4001405849 (imp-35216)
  kSevenHalves: +K_SEVEN_HALVES.toFixed(10), // -1.2004217587 (the SUM imp-35261 verified)
  kSevenHalvesExpr: 'K_{7/2} = (2/3)[-12/(7 A_1) - 24/(7 A_2)] = -8/(3 A_1) = -8 sqrt(2)/(3 pi)',

  // The TWO named source contributions (closed form).
  contribNumeratorClosedForm: +CONTRIB_NUM_CF.toFixed(10), // -0.5144664664 = -8/(7 A_1) = -12/(7 A_2)*(2/3)
  contribNumeratorExpr: 'numerator |F_2| tail: (2/3)(-12/(7 A_1)) = -8/(7 A_1)',
  contribCurvatureClosedForm: +CONTRIB_CURV_CF.toFixed(10), // -0.6859552885 = -16/(7 A_2)
  contribCurvatureExpr: 'curvature |F_3| - A_2/4 tail: (2/3)(-24/(7 A_2)) = -16/(7 A_2)',
  rawNumeratorTailClosedForm: +RAW_NUM_TAIL_CF.toFixed(10), // -0.8571428571 = -6/7
  rawCurvatureTailClosedForm: +RAW_CURV_TAIL_CF.toFixed(10), // 0.8571428571 = +6/7
  numeratorShareOfK72: +(CONTRIB_NUM_CF / K_SEVEN_HALVES).toFixed(4), // ~0.4286
  curvatureShareOfK72: +(CONTRIB_CURV_CF / K_SEVEN_HALVES).toFixed(4), // ~0.5714

  // The measurement ladder (two source tails read SEPARATELY, plus the grid-summed cross-check).
  ladder: LADDER.map((r) => ({
    eps: +r.eps.toExponential(1),
    N: +r.N.toExponential(3),
    rawNumeratorTail: +r.rawNumTail.toFixed(6), // -> -6/7 = -0.857143
    rawCurvatureTail: +r.rawCurvTail.toFixed(6), // -> +6/7 = +0.857143
    contribNumerator: +r.contribNum.toFixed(6), // -> -8/(7 A_1) = -0.514466
    contribCurvature: +r.contribCurv.toFixed(6), // -> -16/(7 A_2) = -0.685955
    contribSum: +r.contribSum.toFixed(6), // -> K_{7/2} = -1.200422
    gridK72: +r.gridK72.toFixed(6), // -> K_{7/2} via r1/eps^{7/2} (imp-35261 route)
    reconstructionGap: +r.reconstructionGap.toExponential(3), // split sum - grid sum ~ 0
  })),

  // The confirmation at the tightest clean rung.
  bestEps: +BEST.eps.toExponential(1),
  bestRawNumeratorTail: +BEST.rawNumTail.toFixed(6), // ~-0.857143
  bestRawCurvatureTail: +BEST.rawCurvTail.toFixed(6), // ~+0.857143
  bestContribNumerator: +BEST.contribNum.toFixed(6), // ~-0.514466
  bestContribCurvature: +BEST.contribCurv.toFixed(6), // ~-0.685955
  bestContribSum: +BEST.contribSum.toFixed(6), // ~-1.200422
  bestGridK72: +BEST.gridK72.toFixed(6), // ~-1.200422
  bestReconstructionGap: +BEST.reconstructionGap.toExponential(3), // ~0

  rawTailsMatch: RAW_TAILS_MATCH, // both raw tails hit +-6/7
  contribsMatch: CONTRIBS_MATCH, // both mapped contributions hit their closed forms
  sumReconstructsK72: SUM_RECONSTRUCTS_K72, // split sum reconstructs the grid-summed K_{7/2}
  neitherSourceAloneIsK72: true, // numerator ~42.9%, curvature ~57.1% -- each alone falls short

  couplingIsHalfInteger: true,
  dischargesO3orG6a: false,
  residualObstruction:
    'O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a ' +
    'rigorous remainder bound on the TRUE RvM cusp jet; splitting K_{7/2} into its two measured source tails ' +
    'resolves the remainder shape further but supplies neither the uniform inequality nor a certified ' +
    'remainder, and is read on the model-cusp surrogate; G-b stays OPEN',

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. Reading the two eps^{7/2} source tails SEPARATELY on the imp-35240 compensated ' +
    'finite-cutoff quadrature: the numerator |F_2| tail (R_2 - (2/3) eps^{3/2})/eps^{7/2} -> -6/7, mapping ' +
    'to the contribution -8/(7 A_1) = -0.514466, and the curvature |F_3| - A_2/4 tail D_3/eps^{7/2} -> +6/7, ' +
    'mapping to -16/(7 A_2) = -0.685955; their SUM -> -1.200422 reconstructs the grid-measured ' +
    'K_{7/2} = -8/(3 A_1) = -8 sqrt(2)/(3 pi) = -1.20042 (read on the SAME ladder via r1/eps^{7/2}), which ' +
    'imp-35261 verified only as a single summed coefficient. Neither source alone is K_{7/2} (numerator ' +
    '~42.9%, curvature ~57.1%). This isolates the two contributions the imp-35244 bracket ' +
    '(2/3)[-12/(7 A_1) - 24/(7 A_2)] combined, but does NOT certify a uniform modulus, does NOT discharge ' +
    'O3 or G6a, establishes no operator positivity, changes no bound. imp-3066 off-diagonal endpoint-Hankel ' +
    'K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35299_K72_TWO_SOURCE_ASSERTIONS = [
  {
    // (1) the machine-precision infinite-cutoff constants reproduce a = A_1/2 and b = A_2/4 (route sanity).
    id: 'imp35299-renorm-machine-precision',
    description: 'compensated |F_p(inf)| reproduce A_1/2 and A_2/4 to < 1e-12 (deviation not swamped by roundoff)',
    holds: () => Math.abs(A - A1 / 2) < 1e-12 && Math.abs(B - A2 / 4) < 1e-12,
  },
  {
    // (2) the two source contributions are the closed forms -8/(7 A_1) and -16/(7 A_2) summing to K_{7/2}.
    id: 'imp35299-source-closed-forms-sum-to-k72',
    description: 'numerator -8/(7 A_1) + curvature -16/(7 A_2) = -8/(3 A_1) = -8 sqrt(2)/(3 pi) = K_{7/2}',
    holds: () =>
      Math.abs(CONTRIB_NUM_CF - -8 / (7 * A1)) < 1e-14 &&
      Math.abs(CONTRIB_CURV_CF - -16 / (7 * A2)) < 1e-14 &&
      Math.abs(CONTRIB_NUM_CF + CONTRIB_CURV_CF - K_SEVEN_HALVES) < 1e-12 &&
      Math.abs(K_SEVEN_HALVES - (-8 * SQRT2) / (3 * PI)) < 1e-14,
  },
  {
    // (3) each RAW source tail is measured to its closed form +-6/7 at the best rung.
    id: 'imp35299-raw-source-tails-measured',
    description: 'measured numerator raw tail -> -6/7 and curvature raw tail -> +6/7 (both to < 5e-4)',
    holds: () =>
      RAW_TAILS_MATCH === true &&
      Math.abs(BEST.rawNumTail - -6 / 7) < 5e-4 &&
      Math.abs(BEST.rawCurvTail - 6 / 7) < 5e-4,
  },
  {
    // (4) each mapped contribution is measured to its closed form, and neither alone is K_{7/2}.
    id: 'imp35299-mapped-contributions-measured',
    description: 'mapped numerator -> -8/(7 A_1) and curvature -> -16/(7 A_2); neither alone equals K_{7/2}',
    holds: () =>
      CONTRIBS_MATCH === true &&
      Math.abs(BEST.contribNum) < Math.abs(K_SEVEN_HALVES) &&
      Math.abs(BEST.contribCurv) < Math.abs(K_SEVEN_HALVES),
  },
  {
    // (5) the two independently-measured contributions reconstruct the grid-summed K_{7/2}.
    id: 'imp35299-sum-reconstructs-grid-k72',
    description: 'split sum -> grid-measured K_{7/2} = -1.20042 with reconstruction gap < 5e-3',
    holds: () =>
      SUM_RECONSTRUCTS_K72 === true &&
      Math.abs(BEST.contribSum - -1.20042) < 5e-3 &&
      Math.abs(BEST.contribSum - BEST.gridK72) < 5e-3,
  },
  {
    // Honesty gate: measurement only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35299-honesty-gate-no-qed',
    description:
      'Measurement only: two sources isolated but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35299_K72_TWO_SOURCE_DECOMPOSITION.isRigorous === false &&
      IMP35299_K72_TWO_SOURCE_DECOMPOSITION.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35299_K72_TWO_SOURCE_DECOMPOSITION.verdict) &&
      /STAYS OPEN/.test(IMP35299_K72_TWO_SOURCE_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP35299_K72_TWO_SOURCE_DECOMPOSITION.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35299_K72_TWO_SOURCE_DECOMPOSITION.verdict,
      ),
  },
];

for (const a of IMP35299_K72_TWO_SOURCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35299-k72-two-source-decomposition assertion failed: ${a.id}`);
  }
}
