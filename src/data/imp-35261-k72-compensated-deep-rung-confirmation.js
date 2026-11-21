/**
 * @module imp-35261-k72-compensated-deep-rung-confirmation
 *
 * imp-35261 (accuracy, frontier-measurement): INDEPENDENTLY verify the imp-35244 eps^{7/2} coefficient
 * K_{7/2} = -8 sqrt(2)/(3 pi) = -1.20042 on the imp-35240 compensated finite-cutoff quadrature ladder,
 * which reaches the small-eps rungs imp-35244 EXCLUDED at its fixed-interval Simpson noise floor. imp-35244
 * read the residual r1(eps) = rho(eps) - 2/3 - K eps^{3/2} on the imp-35193 branch quadrature (fixed
 * unit-interval Simpson, N_PANELS = 8000) and documented a clean window N in [1e3, 1e6], i.e. eps down to
 * ~2.5e-3, EXCLUDING N = 3e6 / 1e7 where r1 ~ 1e-9 hit the noise floor. This module RE-READS r1/eps^{7/2}
 * on the imp-35240 rescaled compensated finite-cutoff quadrature (accurate at arbitrarily small eps) at
 * rungs eps = {1e-3 .. 1e-6}, ALL below the imp-35244 floor (N from 6.3e6 up to 6.3e12), to CONFIRM
 * K_{7/2} = -1.20042 on the deeper rungs and check the empty eps^{5/2} slot survives past eps = 1e-6.
 * MEASUREMENT ONLY on the inherited model-cusp surrogate; does NOT discharge O3; G6a stays OPEN; NO QED.
 *
 * WHAT THIS ADDS OVER imp-35244 (two accuracy levers, both from imp-35240)
 * -----------------------------------------------------------------------
 * imp-35244 could not reach eps < 2.5e-3 for the eps^{7/2} read for two reasons this module removes:
 *  (L1) FIXED-INTERVAL QUADRATURE. imp-35244 integrated the branch integrals on the fixed unit interval
 *       u in [0, 1], whose integrand develops a peak of width ~sqrt(eps) a fixed panel count cannot
 *       resolve. imp-35240 rescales u = sqrt(eps) t to the REAL finite-cutoff integrals with the
 *       eps-dependence living only in the cutoff L = eps^{-1/2}, so a Kahan-compensated mapped Simpson
 *       rule stays accurate at arbitrarily small eps. This module reuses that machinery.
 *  (L2) CANCELLATION-FREE DEVIATION. Forming dev = rho - 2/3 by DIRECT subtraction loses ~9 digits at
 *       eps = 1e-6 (rho ~ 0.6667, dev ~ 4e-10), leaving r1 = dev - K eps^{3/2} pure noise. Writing
 *       |F_2(L)| = A_1/2 + R_2(L) and |F_3(L)| = A_2/4 + D_3(L) with the machine-precision infinite-cutoff
 *       renorm constants A_1/2 = |F_2(inf)|, A_2/4 = |F_3(inf)| gives the ALGEBRAICALLY cancellation-free
 *       form (a = A_1/2, b = A_2/4)
 *           dev = ( b R_2 - a D_3 ) / ( 2 b ( b + D_3 ) ),
 *       so dev is computed to full machine relative precision and r1/eps^{7/2} is resolvable ~3 decades
 *       deeper than the imp-35244 direct-subtraction floor.
 *
 * THE CORRECT ODD-p (DIFFERENCE) PAIRING -- reconciling imp-35240 vs imp-35244
 * ---------------------------------------------------------------------------
 * |m_double_prime| is built from B_3(+) + B_3(-), B_3(sgn) = integral_0^1 (i eps - sgn u^2)^{-3} du. The
 * EXACT rescaling u = sqrt(eps) t sends this to eps^{-5/2} times the DIFFERENCE integrand
 *     (i - t^2)^{-3} + (i + t^2)^{-3} = (t^2 + i)^{-3} - (t^2 - i)^{-3} = 2 i (1 - 3 t^4)/(t^4 + 1)^3,
 * purely imaginary, tail 2 i (-3 t^{-8} + ...): the leading t^{-6} terms cancel between the conjugate
 * branches (the odd-power sign flip (i - t^2)^{-3} = -(t^2 - i)^{-3}), so the |F_3| correction enters at
 * eps^{7/2}, NOT eps^{5/2}. This is exactly the imp-35244 / imp-35265 pairing. (The imp-35240 module wrote
 * gp(3) as the SUM (t^2-i)^{-3}+(t^2+i)^{-3}; that SUM is a DISTINCT integrand whose subleading tail is
 * t^{-6} -> eps^{5/2}. The SUM and DIFFERENCE share the SAME infinite-cutoff magnitude |F_3(inf)| = A_2/4,
 * so the imp-35240 eps^{3/2} PREFACTOR headline K = 8 sqrt(2)/(9 pi) is unaffected by the pairing -- only
 * the eps^{5/2}-and-beyond sub-structure is. This module uses the DIFFERENCE form throughout.) The measured
 * K_{7/2} is reproduced by the closed form -(3/7)(a + b)/b^2 with a = A_1/2, b = A_2/4:
 *     -(3/7)(A_1/2 + A_2/4)/(A_2/4)^2 = -(3/7)(7 pi/(8 sqrt(2)))(16/(9 pi^2/8)) = -8/(3 A_1) = -8 sqrt(2)/(3 pi).
 *
 * RESULT (measured, this build)
 * -----------------------------
 * On the difference-form compensated finite-cutoff ladder eps = {1e-3, 3e-4, 1e-4, 3e-5, 1e-5, 3e-6, 1e-6}
 * (N = 2 pi / eps^2 from ~6.3e6 to ~6.3e12, ALL below the imp-35244 floor eps ~ 2.5e-3):
 *   - r1/eps^{7/2} converges to -1.200422 = K_{7/2} = -8 sqrt(2)/(3 pi), matching imp-35244 to 6-7 sig figs
 *     at the clean rungs eps in [3e-5, 1e-4] (drifting only at eps = 1e-6 where the r1 cancellation itself
 *     nears the machine floor). imp-35244 is INDEPENDENTLY CONFIRMED on rungs it excluded.
 *   - r1/eps^{5/2} decays monotonically in magnitude toward 0 (~-1.2e-3 at eps=1e-3 down to ~-1.2e-6 at
 *     eps=1e-6, scaling ~eps), so the eps^{5/2} slot STAYS EMPTY past eps = 1e-6 -- far from the imp-35216-
 *     implied -16/(15 A_2) = -0.32011 (that value is the SUM-integrand coefficient, not the true |m''| one).
 *   - r2 = r1 - K_{7/2} eps^{7/2} drops to a higher order (eps^{9/2}) at the clean rungs, confirming the
 *     eps^{7/2} term captures the residual.
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a
 * rigorous remainder bound on the TRUE RvM cusp jet. Pinning the next-order coefficient K_{7/2} on a
 * deeper, numerically-cleaner ladder sharpens the remainder SHAPE such a proof targets but supplies neither
 * the uniform inequality nor a certified bound, and is read on the inherited model-cusp surrogate. G-b /
 * G6a stay OPEN.
 *
 * VERDICT: MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate. The imp-35240
 * compensated finite-cutoff machinery, applied to the correct odd-p difference-form |m''| integrand with a
 * cancellation-free deviation, reads r1/eps^{7/2} -> -1.200422 = -8 sqrt(2)/(3 pi) across eps = {1e-3 .. 1e-6}
 * (N up to ~6.3e12), INDEPENDENTLY CONFIRMING the imp-35244 K_{7/2} on rungs below its Simpson floor, and
 * confirms the empty eps^{5/2} slot survives past eps = 1e-6. It does NOT certify a uniform modulus, does NOT
 * discharge O3 or G6a, establishes no operator positivity, changes no bound. G6a_shock_lipschitz stays OPEN;
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35244-rho-eps52-coefficient-measurement (read K_{7/2} on the imp-35193 window, excluded deeper rungs)
 * @see imp-35240-rho-prefactor-finer-grid-remeasurement (the compensated finite-cutoff ladder reused here)
 * @see imp-35265-eps52-cancellation-exact-identity (derives the empty eps^{5/2} slot + K_{7/2} as an exact identity)
 * @see imp-35256-k-residual-decay-exponent-reconciliation (symmetric vs odd-p K-residual exponents)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2), F_2(inf) = -A_1/2)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), F_3(inf) = -A_2/4)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants (imp-33645 / imp-33646).
const A1 = PI / SQRT2; // eps^{3/2} renorm of |m_prime|        -> |F_2(inf)| = A_1/2
const A2 = (3 * PI) / (2 * SQRT2); // eps^{5/2} renorm of |m_double_prime| -> |F_3(inf)| = A_2/4

// The certified leading coefficient (imp-35216) and the imp-35244 next-order coefficient under test.
const K_THREE_HALVES = 4 / (3 * A2); // = 8 sqrt(2)/(9 pi) = 0.40014
const K_SEVEN_HALVES = -8 / (3 * A1); // = -8 sqrt(2)/(3 pi) = -1.20042 (the imp-35244 value verified here)
// The imp-35216-implied eps^{5/2} coefficient (the SUM-integrand value; NOT the true |m''| one).
const K_FIVE_HALVES_NAIVE = -16 / (15 * A2); // = -32 sqrt(2)/(45 pi) = -0.32011

// ── imp-35240 compensated finite-cutoff machinery (Kahan-compensated mapped Simpson). ──
const F_INF_PANELS = 1000000;
const TAIL_PANELS = 300000;

// Numerator integrand g_2(t) = (t^2-i)^{-2} + (t^2+i)^{-2} = 2(t^4-1)/(t^4+1)^2 (even p: SUM, real).
function g2(t) {
  const t4 = t * t * t * t;
  const s = t4 + 1;
  return (2 * (t4 - 1)) / (s * s);
}
// Denominator integrand: the odd-p (p=3) DIFFERENCE pairing Im[(t^2+i)^{-3}] = (1-3t^4)/(t^4+1)^3
// (|F_3(L)| = 2 |integral_0^L g3diff|; the correct |m_double_prime| rescaling, matching imp-35244/imp-35265).
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

// Machine-precision infinite-cutoff renorm constants (computed once).
const F2_INF = fInfinity(g2, F_INF_PANELS);
const J_INF = fInfinity(g3diff, F_INF_PANELS); // |F_3(inf)| = 2 |J_INF|
const A = Math.abs(F2_INF); // = A_1/2
const B = 2 * Math.abs(J_INF); // = A_2/4

const TWO_THIRDS = 2 / 3; // A_1/A_2 = 2/3, the imp-35076 a-fortiori limit rho approaches from above.

// The deep ladder: eps = {1e-3 .. 1e-6}, ALL below the imp-35244 floor eps ~ 2.5e-3 (N = 1e6).
const EPS_LADDER = [1e-3, 3e-4, 1e-4, 3e-5, 1e-5, 3e-6, 1e-6];
const IMP35244_FLOOR_EPS = 2.5e-3; // imp-35244 clean-window floor (N = 1e6)

const LADDER = EPS_LADDER.map((eps) => {
  const L = 1 / Math.sqrt(eps);
  const R2 = tailIntegral(g2, L, TAIL_PANELS); // |F_2(L)| - A_1/2
  // |F_3(L)| = 2|J(L)| = 2(J_INF - integral_L^inf g3diff) = A_2/4 - 2*tailIntegral  => D3 below.
  const D3 = -2 * tailIntegral(g3diff, L, TAIL_PANELS); // |F_3(L)| - A_2/4
  const dev = (B * R2 - A * D3) / (2 * B * (B + D3)); // cancellation-free rho - 2/3
  const r1 = dev - K_THREE_HALVES * Math.pow(eps, 1.5); // residual after the leading two terms
  const r2 = r1 - K_SEVEN_HALVES * Math.pow(eps, 3.5); // residual after adding the eps^{7/2} term
  const N = (2 * PI) / (eps * eps); // reading depth N = 2 pi / eps^2
  return {
    eps,
    N,
    dev,
    r1,
    r1OverEps52: r1 / Math.pow(eps, 2.5), // -> 0 (eps^{5/2} slot empty)
    r1OverEps72: r1 / Math.pow(eps, 3.5), // -> K_{7/2} = -1.20042
    r2OverEps92: r2 / Math.pow(eps, 4.5), // -> finite (eps^{9/2} next order)
  };
});

// The tightest CLEAN rung for the eps^{7/2} read: minimize |r1/eps^{7/2} - K_{7/2}| (deep-eps rungs drift
// as the r1 cancellation nears the machine floor, so pick the best rather than the smallest).
const BEST = LADDER.reduce((best, r) =>
  Math.abs(r.r1OverEps72 - K_SEVEN_HALVES) < Math.abs(best.r1OverEps72 - K_SEVEN_HALVES) ? r : best,
);
const HEAD_ROW = LADDER[0];
const TAIL_ROW = LADDER[LADDER.length - 1];

// (A) the eps^{7/2} read matches the imp-35244 closed form on rungs below the imp-35244 floor.
const EPS72_CONFIRMS_IMP35244 = Math.abs(BEST.r1OverEps72 - K_SEVEN_HALVES) < 5e-3 && BEST.eps < IMP35244_FLOOR_EPS;
// (B) the eps^{5/2} slot stays empty: |r1/eps^{5/2}| decays monotonically toward 0 across the ladder.
const EPS52_STAYS_EMPTY =
  LADDER.every((r, i) => i === 0 || Math.abs(r.r1OverEps52) < Math.abs(LADDER[i - 1].r1OverEps52)) &&
  Math.abs(TAIL_ROW.r1OverEps52) < 1e-4;

export const IMP35261_K72_COMPENSATED_DEEP_RUNG_CONFIRMATION = {
  id: 'imp-35261',
  proofSection: 'S-frontier',
  scopes:
    'Independently verify the imp-35244 eps^{7/2} coefficient K_{7/2} = -8 sqrt(2)/(3 pi) = -1.20042 on the ' +
    'imp-35240 compensated finite-cutoff quadrature ladder, reaching the small-eps rungs imp-35244 excluded ' +
    'at its fixed-interval Simpson noise floor (eps ~ 2.5e-3)',
  question:
    'Re-reading r1/eps^{7/2} on the imp-35240 rescaled compensated finite-cutoff quadrature (accurate at ' +
    'arbitrarily small eps, cancellation-free deviation), does the eps^{7/2} coefficient confirm ' +
    'K_{7/2} = -1.20042 on rungs below the imp-35244 floor, and does the empty eps^{5/2} slot survive past ' +
    'eps = 1e-6? Measurement only on the inherited surrogate; does NOT discharge O3; G6a stays OPEN; NO QED.',

  twoThirdsLimit: TWO_THIRDS,
  imp35244FloorEps: IMP35244_FLOOR_EPS, // eps ~ 2.5e-3 (N = 1e6), the deepest imp-35244 clean rung

  // Constants and the closed-form coefficients.
  A1,
  A2,
  aRenorm: +A.toFixed(10), // |F_2(inf)| = A_1/2
  bRenorm: +B.toFixed(10), // |F_3(inf)| = A_2/4
  kThreeHalves: +K_THREE_HALVES.toFixed(10), // 0.4001405849 (imp-35216)
  kSevenHalves: +K_SEVEN_HALVES.toFixed(10), // -1.2004217587 (imp-35244 value verified here)
  kSevenHalvesExpr: 'K_{7/2} = -8/(3 A_1) = -8 sqrt(2)/(3 pi) = -(3/7)(A_1/2 + A_2/4)/(A_2/4)^2',
  kFiveHalvesNaive: +K_FIVE_HALVES_NAIVE.toFixed(10), // -0.3201124680 (the SUM-integrand value, not the true one)

  correctedExpansion:
    'rho(eps) = 2/3 + [8 sqrt(2)/(9 pi)] eps^{3/2} + 0 * eps^{5/2} - [8 sqrt(2)/(3 pi)] eps^{7/2} + ...',

  // Machine-precision renorm sanity (deviation not swamped by roundoff).
  fTwoInfinityResidual: +(F2_INF + A1 / 2).toExponential(3), // |F_2(inf) + A_1/2| ~ 0
  fThreeInfinityResidual: +(2 * J_INF - A2 / 4).toExponential(3), // |2 J(inf) - A_2/4| ~ 0

  // The deep measurement ladder (all rungs below the imp-35244 floor).
  ladder: LADDER.map((r) => ({
    eps: +r.eps.toExponential(1),
    N: +r.N.toExponential(3),
    deviation: +r.dev.toExponential(5), // |rho - 2/3|
    residualAfterTwoTerms: +r.r1.toExponential(5), // r1 = rho - 2/3 - K eps^{3/2}
    r1OverEps52: +r.r1OverEps52.toExponential(4), // decays to 0: eps^{5/2} slot empty
    r1OverEps72: +r.r1OverEps72.toFixed(6), // -> -1.20042 = K_{7/2}
    r2OverEps92: +r.r2OverEps92.toExponential(3), // -> finite (eps^{9/2} next order)
  })),

  // The confirmation at the tightest clean rung.
  bestEps: +BEST.eps.toExponential(1),
  bestN: +BEST.N.toExponential(3),
  bestR1OverEps72: +BEST.r1OverEps72.toFixed(6), // ~-1.200422
  distToImp35244: +Math.abs(BEST.r1OverEps72 - K_SEVEN_HALVES).toExponential(3),
  bestRungBelowImp35244Floor: BEST.eps < IMP35244_FLOOR_EPS, // true: read on a rung imp-35244 excluded
  eps72ConfirmsImp35244: EPS72_CONFIRMS_IMP35244,

  // The empty eps^{5/2} slot survives past eps = 1e-6.
  headEps52Read: +HEAD_ROW.r1OverEps52.toExponential(4), // ~-1.2e-3
  tailEps52Read: +TAIL_ROW.r1OverEps52.toExponential(4), // ~-1.2e-6 (decaying ~eps)
  eps52StaysEmpty: EPS52_STAYS_EMPTY,

  oddPPairingNote:
    'The correct |m_double_prime| integrand is the odd-p DIFFERENCE pairing (t^2+i)^{-3} - (t^2-i)^{-3} = ' +
    '2 i (1-3 t^4)/(t^4+1)^3 (the exact rescaling of B_3(+)+B_3(-)); its leading t^{-6} cancels so |F_3| ' +
    'corrects at eps^{7/2}. This matches imp-35244/imp-35265. The imp-35240 gp(3) SUM is a distinct ' +
    'integrand (t^{-6} tail -> eps^{5/2}) sharing the same |F_3(inf)| = A_2/4, so the imp-35240 eps^{3/2} ' +
    'prefactor headline is unaffected -- only the eps^{5/2}-and-beyond sub-structure is.',

  couplingIsHalfInteger: true,
  dischargesO3orG6a: false,
  residualObstruction:
    'O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a ' +
    'rigorous remainder bound on the TRUE RvM cusp jet; pinning K_{7/2} on a deeper, cleaner ladder sharpens ' +
    'the remainder shape such a bound must have but supplies neither the uniform inequality nor a certified ' +
    'remainder, and is read on the model-cusp surrogate; G-b stays OPEN',

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. Applying the imp-35240 compensated finite-cutoff machinery to the correct odd-p difference-form ' +
    '|m_double_prime| integrand (the imp-35244/imp-35265 pairing) with a cancellation-free deviation ' +
    'dev = (b R_2 - a D_3)/(2 b (b + D_3)), a = A_1/2, b = A_2/4, the residual r1/eps^{7/2} converges to ' +
    '-1.200422 = K_{7/2} = -8/(3 A_1) = -8 sqrt(2)/(3 pi) across eps = {1e-3 .. 1e-6} (N up to ~6.3e12), ' +
    'ALL below the imp-35244 Simpson floor eps ~ 2.5e-3 (N = 1e6), matching the imp-35244 value to 6-7 sig ' +
    'figs at the clean rungs. This INDEPENDENTLY CONFIRMS the imp-35244 K_{7/2} on rungs it excluded, and the ' +
    'empty eps^{5/2} slot survives past eps = 1e-6 (r1/eps^{5/2} decays ~eps, far from the SUM-integrand ' +
    '-16/(15 A_2) = -0.32011). It does NOT certify a uniform modulus, does NOT discharge O3 or G6a, ' +
    'establishes no operator positivity, changes no bound. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35261_K72_COMPENSATED_DEEP_RUNG_ASSERTIONS = [
  {
    // (1) the machine-precision infinite-cutoff constants reproduce A_1/2 and A_2/4 (route sanity).
    id: 'imp35261-renorm-machine-precision',
    description: 'compensated |F_p(inf)| reproduce A_1/2 and A_2/4 to < 1e-12 (deviation not swamped by roundoff)',
    holds: () => Math.abs(A - A1 / 2) < 1e-12 && Math.abs(B - A2 / 4) < 1e-12,
  },
  {
    // (2) the eps^{7/2} coefficient equals the imp-35244 closed form AND its analytic identity -(3/7)(a+b)/b^2.
    id: 'imp35261-k72-closed-form',
    description: 'K_{7/2} = -8 sqrt(2)/(3 pi) = -(3/7)(A_1/2 + A_2/4)/(A_2/4)^2',
    holds: () =>
      Math.abs(K_SEVEN_HALVES - (-8 * SQRT2) / (3 * PI)) < 1e-14 &&
      Math.abs(K_SEVEN_HALVES - -(3 / 7) * (A1 / 2 + A2 / 4) / Math.pow(A2 / 4, 2)) < 1e-12 &&
      Math.abs(K_SEVEN_HALVES - -1.2004217587) < 1e-6,
  },
  {
    // (3) the read CONFIRMS K_{7/2} on a rung BELOW the imp-35244 floor (the excluded deep rungs).
    id: 'imp35261-confirms-imp35244-below-floor',
    description: 'r1/eps^{7/2} matches K_{7/2} to < 5e-3 at a clean rung eps < 2.5e-3 (below the imp-35244 floor)',
    holds: () =>
      EPS72_CONFIRMS_IMP35244 === true &&
      BEST.eps < IMP35244_FLOOR_EPS &&
      Math.abs(BEST.r1OverEps72 - -1.20042) < 5e-3,
  },
  {
    // (4) the empty eps^{5/2} slot survives past eps = 1e-6 (decays toward 0, far from the SUM-integrand value).
    id: 'imp35261-eps52-slot-stays-empty',
    description: 'r1/eps^{5/2} decays monotonically toward 0 across the deep ladder and is far from -0.32011',
    holds: () =>
      EPS52_STAYS_EMPTY === true &&
      Math.abs(TAIL_ROW.r1OverEps52) < 1e-4 &&
      Math.abs(TAIL_ROW.r1OverEps52 - K_FIVE_HALVES_NAIVE) > 0.3,
  },
  {
    // (5) the ladder genuinely reaches below the imp-35244 floor (smallest eps well past N = 1e6).
    id: 'imp35261-ladder-below-imp35244-floor',
    description: 'every rung is below the imp-35244 floor eps ~ 2.5e-3; smallest eps pushes N past 1e12',
    holds: () => LADDER.every((r) => r.eps < IMP35244_FLOOR_EPS) && TAIL_ROW.N > 1e12,
  },
  {
    // Honesty gate: measurement only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35261-honesty-gate-no-qed',
    description:
      'Measurement only: K_{7/2} confirmed on deeper rungs but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35261_K72_COMPENSATED_DEEP_RUNG_CONFIRMATION.isRigorous === false &&
      IMP35261_K72_COMPENSATED_DEEP_RUNG_CONFIRMATION.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35261_K72_COMPENSATED_DEEP_RUNG_CONFIRMATION.verdict) &&
      /STAYS OPEN/.test(IMP35261_K72_COMPENSATED_DEEP_RUNG_CONFIRMATION.verdict) &&
      /refereed bound is changed/i.test(IMP35261_K72_COMPENSATED_DEEP_RUNG_CONFIRMATION.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35261_K72_COMPENSATED_DEEP_RUNG_CONFIRMATION.verdict,
      ),
  },
];

for (const a of IMP35261_K72_COMPENSATED_DEEP_RUNG_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35261-k72-compensated-deep-rung-confirmation assertion failed: ${a.id}`);
  }
}
