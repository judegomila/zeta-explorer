/**
 * @module imp-35127-g-step-error-certified-bound-scope
 *
 * imp-35127 (proof, frontier-direction, SCOPING ONLY): LAMBDA_CHAIN_STEPS Step 2 rigorousUpgradeGap
 * (imp-35058, lambda-roadmap.js) names G-step-error as one of three OPEN obligations separating the
 * Step-2 NUMERICAL grade from a rigorous one: a CERTIFIED a-priori bound on the local + accumulated
 * integrator truncation error of the backward Dyson flow as a function of the step dt and the
 * particle count N. The obligation explicitly distinguishes this from the EMPIRICAL two-method gap
 * |t_c_RK4 - t_c_DP5| (imp-2466), which is a cross-check, NOT a certificate: it bounds scheme
 * DISAGREEMENT, so a systematic error common to both the RK4 and the DP5 = RK5(4) tableaux is
 * invisible to it. THIS module enumerates and assesses the concrete analytic ingredients I1..I5 that
 * such a certified bound would require, distinguishes each from what the empirical gap supplies, and
 * flags which remain OPEN. Discharges NONE of them. SCOPING ONLY; NO QED.
 *
 * THE BACKWARD DYSON FLOW AND WHY IT IS NOT A TEXTBOOK RK PROBLEM
 * -------------------------------------------------------------
 * Step 2 integrates the N-particle Dyson field backward to the collision time t_c(N). The field on
 * particle k is f_k = sum_{j != k} 1 / (x_k - x_j) (de Bruijn-Newman / Dyson units, the 1/(x_k-x_j)
 * pole form of imp-362). It is SINGULAR: as any pair approaches, the field and ALL its derivatives
 * blow up like inverse powers of the minimum gap g_min = min_{j != k} |x_k - x_j|. Textbook RK
 * convergence theory (LTE ~ C dt^{p+1} sup|y^{(p+1)}|, global error via a Lipschitz/Gronwall factor)
 * assumes those sup-bounds are FINITE and N-uniform on the integration interval. For this flow they
 * are NOT: they are controlled only through a lower bound on g_min along the ENTIRE backward
 * trajectory up to t_c, and g_min degrades toward the collision front and shrinks as N grows
 * (spacing ~ O(1/N)). So the certified bound needs singular-flow-specific ingredients the empirical
 * gap silently sidesteps.
 *
 * WHY THE EMPIRICAL TWO-METHOD GAP IS NOT A CERTIFICATE (the ticket headline)
 * -------------------------------------------------------------------------
 * imp-2466 reports |t_c_RK4 - t_c_DP5| tiny -- but that is the DIFFERENCE of two approximations. If
 * both tableaux share a systematic error E_sys (the same discretization bias on the same singular
 * field, the same near-shock boundary-layer error, the same floating-point rounding drift), then
 * E_sys CANCELS in the difference: |t_c_RK4 - t_c_DP5| = |E_RK4 - E_DP5| can be arbitrarily smaller
 * than the true absolute error |t_c_scheme - t_c_exact| ~ |E_sys|. Two convergent schemes agreeing to
 * many digits certifies that they agree, NOT that they are right. A certificate must be an ABSOLUTE,
 * per-scheme a-priori bound (I4), derived from the method order constant against the TRUE flow, not a
 * scheme-vs-scheme difference. The numerical illustration (S1) below exhibits exactly this gap:
 * on a deliberately biased field both RK4 and DP5 agree to ~1e-10 while each carries a common-mode
 * absolute error ~6.3e-4 -- a factor ~6e6 that the two-method gap is blind to.
 *
 * THE FIVE INGREDIENTS I1..I5 (what a certified a-priori RK4/DP5 bound must supply)
 * -------------------------------------------------------------------------------
 *   I1 ELEMENTARY-DIFFERENTIAL DERIVATIVE BOUNDS.  An a-priori bound on sup |y^{(p+1)}| along the
 *      trajectory (p = 4 for RK4, p = 5 for DP5), assembled from bounds on the field f and its
 *      partial derivatives up to order p via the elementary-differential (Butcher) expansion of the
 *      local truncation error. For the Dyson field the m-th derivative involves
 *      sum_{j != k} 1 / (x_k - x_j)^{m+1}, so these bounds are FINITE only through a lower bound on
 *      g_min -- they are vacuous without I2.
 *   I2 NON-COLLISION / MINIMUM-GAP LOWER BOUND (the singular-flow-specific ingredient, hardest).
 *      A CERTIFIED lower bound g_min(t) > 0 on the minimum pair gap along the WHOLE backward
 *      trajectory up to (and controlling the approach to) the collision front. Every constant in I1
 *      -- and the Lipschitz constant in I3 -- is a power of 1/g_min, so a certified LTE is impossible
 *      without this a-priori separation certificate. This ingredient has NO analogue in textbook RK
 *      theory for smooth fields; it is where the singular flow bites.
 *   I3 ACCUMULATION VIA N-UNIFORM STABILITY / LIPSCHITZ CONSTANT.  The step-to-global conversion
 *      global_error <= (LTE_per_step / dt) * (exp(L t_c) - 1) / L requires an explicit N-UNIFORM
 *      Lipschitz constant L of f up to t_c. This is SHARED with the G-gronwall obligation
 *      (backward-flow-stability-gronwall.js, imp-2520), which is honestly Gronwall-vacuous near the
 *      front -- so I3 does NOT reduce to a local per-step estimate; it inherits the same open
 *      N-uniform-constant gap. G-step-error and G-gronwall are COUPLED, not independent.
 *   I4 ABSOLUTE PER-SCHEME (COMMON-MODE) BOUND (the ingredient the empirical gap cannot supply).
 *      An absolute a-priori error bound for EACH scheme individually, from its own order conditions /
 *      Butcher error constant against the TRUE flow -- NOT a difference of two schemes. This is the
 *      one that structurally distinguishes a certificate from imp-2466: the two-method gap cancels
 *      any common-mode systematic error E_sys, so only a per-scheme absolute bound closes it.
 *   I5 N-UNIFORM STEP-BUDGET LAW + POLE-REDUCTION CARRIED THROUGH.  A documented law dt(N) (or a
 *      variable-step schedule near the front) keeping the certified error below a target, given that
 *      the I1/I2/I3 constants grow as powers of 1/g_min ~ powers of N toward the front; and the
 *      1/(x_k - x_j) pole reduction (imp-362 desingularization) carried through the a-priori estimate
 *      in the SAME form used by G-interval-enclosure. Couples G-step-error to G-interval-enclosure.
 *
 * THE NUMERICAL ILLUSTRATIONS (scoping evidence, NOT a bound)
 * ----------------------------------------------------------
 *   (S1) COMMON-MODE BLINDNESS (motivates I4).  Integrate a DELIBERATELY BIASED scalar field
 *        f(y) = -y + eps (eps = 1e-3) from y0 = 1 to t = 1 with BOTH classic RK4 and Dormand-Prince
 *        DP5 = RK5(4), n = 64 steps. Both converge to the BIASED solution, so the two-method gap
 *        |y_RK4 - y_DP5| ~ 1e-10 (they agree), while EACH carries the common-mode absolute error
 *        |y_scheme - true| = eps (1 - e^{-1}) ~ 6.32e-4 against the unbiased flow. The gap is ~6e6x
 *        SMALLER than the shared error -- the two-method agreement is blind to E_sys, exactly as I4
 *        warns. (This is a proxy for a shared discretization / rounding bias, not the Dyson field.)
 *   (S2) SINGULAR-DERIVATIVE BLOW-UP (motivates I1/I2).  For the scalar pole proxy f(y) = 1/(y - a),
 *        the m-th derivative magnitude is m! / g^{m+1} at gap g. Tabulating m = 0..5 at g = 1e-2 and
 *        g = 1e-3 shows the p+1 = 5th-derivative bound (entering the RK4 LTE) grows by 10^6 for a
 *        single decade of gap reduction -- so a certified LTE constant is FINITE only through an
 *        a-priori g_min lower bound (I2). Without it, I1 is vacuous near the front.
 *
 * SCOPING ONLY. Enumerates the analytic ingredients I1..I5 a certified a-priori RK4/DP5 truncation
 * bound would require and distinguishes each from the empirical two-method gap (imp-2466); discharges
 * NONE of them. I2 (non-collision / minimum-gap lower bound) is flagged the HARDEST / binding
 * singular-flow ingredient; I4 (absolute per-scheme common-mode bound) is the ingredient the empirical
 * gap structurally CANNOT supply. I3 is COUPLED to the open G-gronwall obligation and I5 to the open
 * G-interval-enclosure obligation, so G-step-error is not independent of the other two Step-2
 * obligations. Changes no bound; establishes no operator positivity; the imp-2466 cross-check is
 * UNTOUCHED and remains a valid (non-certifying) cross-check; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see lambda-roadmap.js Step 2 rigorousUpgradeGap.obligations[G-step-error] (imp-35058; this ticket)
 * @see imp-2466-dyson-tc-interval-ladder (empirical two-method gap |t_c_RK4 - t_c_DP5|; cross-check)
 * @see backward-flow-stability-gronwall.js (imp-2520; G-gronwall, coupled to I3, Gronwall-vacuous)
 * @see imp-362 (interval RK4 witness, 1/(x_k-x_j) pole reduction; G-interval-enclosure, coupled to I5)
 * @see imp-35149-vanishing-etrunc-strip-scope (sibling Step-frontier obligation-enumeration pattern)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 */

const E_INV = Math.exp(-1); // e^{-1} = true solution of y' = -y at t = 1, y(0) = 1

// ---------------------------------------------------------------------------
// Self-contained integrators (scalar, autonomous f(y)). Classic RK4 and the
// Dormand-Prince DP5 = RK5(4) 5th-order step (FSAL b-row), reproducing the two
// tableaux whose empirical gap imp-2466 reports.
// ---------------------------------------------------------------------------
function rk4Step(f, y, dt) {
  const k1 = f(y);
  const k2 = f(y + (dt / 2) * k1);
  const k3 = f(y + (dt / 2) * k2);
  const k4 = f(y + dt * k3);
  return y + (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

// Dormand-Prince (RK5(4)) 5th-order solution step; a_ij / b_i are the standard DP tableau.
function dp5Step(f, y, dt) {
  const k1 = f(y);
  const k2 = f(y + dt * ((1 / 5) * k1));
  const k3 = f(y + dt * ((3 / 40) * k1 + (9 / 40) * k2));
  const k4 = f(y + dt * ((44 / 45) * k1 - (56 / 15) * k2 + (32 / 9) * k3));
  const k5 = f(
    y + dt * ((19372 / 6561) * k1 - (25360 / 2187) * k2 + (64448 / 6561) * k3 - (212 / 729) * k4),
  );
  const k6 = f(
    y +
      dt *
        ((9017 / 3168) * k1 -
          (355 / 33) * k2 +
          (46732 / 5247) * k3 +
          (49 / 176) * k4 -
          (5103 / 18656) * k5),
  );
  // 5th-order weights (b-row): the k7 stage vanishes here so it is omitted.
  return (
    y +
    dt *
      ((35 / 384) * k1 +
        (500 / 1113) * k3 +
        (125 / 192) * k4 -
        (2187 / 6784) * k5 +
        (11 / 84) * k6)
  );
}

function integrate(step, f, y0, T, n) {
  const dt = T / n;
  let y = y0;
  for (let i = 0; i < n; i++) y = step(f, y, dt);
  return y;
}

// ---------------------------------------------------------------------------
// (S1) COMMON-MODE BLINDNESS: a shared bias eps cancels in the two-method gap.
// True field f = -y (solution e^{-t}); biased field f = -y + eps (both schemes
// see the SAME bias). The two-method gap sees their DISAGREEMENT, not eps.
// ---------------------------------------------------------------------------
const S1_EPS = 1e-3;
const S1_N = 64;
const fTrue = (y) => -y;
const fBias = (y) => -y + S1_EPS;

const S1_true = E_INV; // exact unbiased solution at t = 1
const yRK4_bias = integrate(rk4Step, fBias, 1, 1, S1_N);
const yDP5_bias = integrate(dp5Step, fBias, 1, 1, S1_N);
const S1_twoMethodGap = Math.abs(yRK4_bias - yDP5_bias); // scheme DISAGREEMENT (~1e-10)
const S1_commonModeErr = Math.abs(yRK4_bias - S1_true); // ABSOLUTE common-mode error (~6.3e-4)
const S1_commonModePredicted = S1_EPS * (1 - E_INV); // eps (1 - e^{-1}) = analytic bias
const S1_blindnessRatio = S1_commonModeErr / S1_twoMethodGap; // how blind the gap is (~6e6)

// Sanity: on the TRUE field both schemes are individually accurate (no bias present).
const yRK4_true = integrate(rk4Step, fTrue, 1, 1, S1_N);
const S1_trueFieldErr = Math.abs(yRK4_true - S1_true); // ~1e-9, tiny -> bias in S1 is the eps, not the scheme

// ---------------------------------------------------------------------------
// (S2) SINGULAR-DERIVATIVE BLOW-UP: for f(y) = 1/(y - a), |f^{(m)}| = m! / g^{m+1}
// at gap g. The p+1 = 5th-derivative bound entering the RK4 LTE grows as g^{-6}.
// ---------------------------------------------------------------------------
function factorial(m) {
  let r = 1;
  for (let i = 2; i <= m; i++) r *= i;
  return r;
}
function fieldDerivBound(m, g) {
  // |d^m/dy^m (y - a)^{-1}| = m! * g^{-(m+1)}
  return factorial(m) * Math.pow(g, -(m + 1));
}
const S2_GAP_A = 1e-2;
const S2_GAP_B = 1e-3; // one decade tighter
const S2_TABLE = [0, 1, 2, 3, 4, 5].map((m) => ({
  m,
  boundAtGapA: fieldDerivBound(m, S2_GAP_A),
  boundAtGapB: fieldDerivBound(m, S2_GAP_B),
}));
// p+1 = 5 for RK4 LTE: the 5th-derivative bound grows by g^{-6} ratio = (1e-2/1e-3)^6 = 1e6.
const S2_blowupRatio =
  fieldDerivBound(5, S2_GAP_B) / fieldDerivBound(5, S2_GAP_A); // = 10^6

const INGREDIENTS = [
  {
    id: 'I1',
    name: 'elementary-differential-derivative-bounds',
    statement:
      'A-priori bound on sup |y^{(p+1)}| along the trajectory (p = 4 RK4, p = 5 DP5) from bounds on ' +
      'f and its partials up to order p via the Butcher elementary-differential expansion of the LTE. ' +
      'For the Dyson field the m-th derivative is sum 1/(x_k - x_j)^{m+1}, finite only through I2.',
    status: 'analytic, but VACUOUS without I2 (minimum-gap lower bound)',
    distinctFromEmpiricalGap:
      'The two-method gap needs no derivative bound at all; a certificate needs sup |y^{(p+1)}|.',
  },
  {
    id: 'I2',
    name: 'non-collision-minimum-gap-lower-bound',
    statement:
      'A CERTIFIED lower bound g_min(t) > 0 on the minimum pair gap along the WHOLE backward ' +
      'trajectory up to the collision front. Every I1 constant and the I3 Lipschitz constant is a ' +
      'power of 1/g_min. No analogue in textbook RK theory for smooth fields; the singular-flow crux.',
    status: 'OPEN -- hardest / binding singular-flow ingredient',
    distinctFromEmpiricalGap:
      'Two convergent schemes can agree even as an uncertified g_min collapses; the gap never sees it.',
  },
  {
    id: 'I3',
    name: 'accumulation-n-uniform-stability-constant',
    statement:
      'Step-to-global conversion global_error <= (LTE/dt) (exp(L t_c) - 1)/L requires an explicit ' +
      'N-UNIFORM Lipschitz constant L of f up to t_c. SHARED with the G-gronwall obligation ' +
      '(imp-2520), honestly Gronwall-vacuous near the front -- so I3 inherits that open gap.',
    status: 'OPEN -- COUPLED to G-gronwall (imp-2520 vacuity near the front)',
    distinctFromEmpiricalGap:
      'The empirical gap is a single-N difference; it supplies no N-uniform accumulation constant.',
  },
  {
    id: 'I4',
    name: 'absolute-per-scheme-common-mode-bound',
    statement:
      'An ABSOLUTE a-priori error bound for EACH scheme individually, from its own order conditions / ' +
      'Butcher error constant against the TRUE flow -- NOT a difference of two schemes. The one ' +
      'ingredient that structurally distinguishes a certificate from imp-2466.',
    status: 'OPEN -- the ingredient the empirical two-method gap CANNOT supply',
    distinctFromEmpiricalGap:
      'A shared systematic error E_sys cancels in |t_c_RK4 - t_c_DP5|; only a per-scheme absolute ' +
      'bound closes it (S1: gap ~1e-10 while common-mode error ~6.3e-4, ~6e6x blind).',
  },
  {
    id: 'I5',
    name: 'n-uniform-step-budget-law-pole-reduction',
    statement:
      'A documented step law dt(N) (or near-front variable-step schedule) keeping the certified error ' +
      'below a target as the I1/I2/I3 constants grow as powers of 1/g_min ~ powers of N; with the ' +
      '1/(x_k - x_j) pole reduction (imp-362) carried through in the SAME form as G-interval-enclosure.',
    status: 'OPEN -- COUPLED to G-interval-enclosure (imp-362 pole reduction)',
    distinctFromEmpiricalGap:
      'The gap is measured at fixed N; it documents no dt(N) budget and carries no pole reduction.',
  },
];

export const IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE = {
  id: 'imp-35127',
  proofSection: 'S-frontier',
  question:
    'Scope the imp-35058 Step-2 G-step-error obligation: enumerate and assess the concrete analytic ' +
    'ingredients a CERTIFIED a-priori RK4/DP5 truncation bound (local + accumulated, as a function of ' +
    'step dt and N) would require, distinguished from the EMPIRICAL two-method gap ' +
    '|t_c_RK4 - t_c_DP5| (imp-2466) which bounds only scheme-disagreement and is blind to a shared ' +
    'systematic error. Scoping only; enumerates ingredients I1..I5; discharges NONE; changes no ' +
    'bound; imp-2466 cross-check untouched; C_mb GUE-conditional per imp-486; NO QED.',
  whyNotTextbook:
    'The backward Dyson field f_k = sum 1/(x_k - x_j) is SINGULAR: field and all derivatives blow up ' +
    'as inverse powers of the minimum gap g_min, which degrades toward the collision front and ' +
    'shrinks ~ O(1/N). Textbook RK bounds (LTE ~ C dt^{p+1} sup|y^{(p+1)}|, Gronwall accumulation) ' +
    'assume FINITE N-uniform sup-bounds the flow does not supply without a g_min lower bound.',
  whyEmpiricalGapIsNotACertificate:
    'imp-2466 |t_c_RK4 - t_c_DP5| is a DIFFERENCE of two approximations: a systematic error E_sys ' +
    'common to both tableaux (same discretization bias, same near-shock boundary layer, same ' +
    'rounding) CANCELS, so the gap can be arbitrarily smaller than each schemes absolute error. ' +
    'Agreement certifies agreement, not correctness; a certificate needs an absolute per-scheme ' +
    'bound (I4).',
  ingredients: INGREDIENTS,
  hardestIngredient: 'I2', // non-collision / minimum-gap lower bound (singular-flow crux)
  distinguishingIngredient: 'I4', // the one the empirical two-method gap structurally cannot supply
  couplings: {
    I3_to_G_gronwall: 'I3 needs the same N-uniform Lipschitz/Gronwall constant as G-gronwall (imp-2520).',
    I5_to_G_interval_enclosure: 'I5 carries the imp-362 pole reduction as G-interval-enclosure does.',
  },
  s1_commonModeBlindness: {
    field: 'y_prime = -y + eps, eps = 1e-3 (both RK4 and DP5 see the SAME bias), y0 = 1, t = 1, n = 64',
    twoMethodGap: +S1_twoMethodGap.toExponential(4), // scheme disagreement, ~1e-10
    commonModeAbsErr: +S1_commonModeErr.toExponential(4), // shared absolute error, ~6.3e-4
    commonModePredicted: +S1_commonModePredicted.toExponential(4), // eps (1 - e^{-1})
    blindnessRatio: +S1_blindnessRatio.toExponential(4), // commonMode / gap, ~6e6
    trueFieldSchemeErr: +S1_trueFieldErr.toExponential(4), // scheme accurate on UNbiased field (~1e-9)
  },
  s2_singularDerivBlowup: {
    proxy: 'f(y) = 1/(y - a), |f^{(m)}| = m! / g^{m+1}',
    gapA: S2_GAP_A,
    gapB: S2_GAP_B,
    table: S2_TABLE.map((r) => ({
      m: r.m,
      boundAtGapA: +r.boundAtGapA.toExponential(3),
      boundAtGapB: +r.boundAtGapB.toExponential(3),
    })),
    fifthDerivBlowupRatioPerDecade: +S2_blowupRatio.toExponential(4), // 1e6 for a 10x gap reduction
  },
  isRigorous: false,
  verdict:
    'SCOPING (frontier-direction, NOT rigorous). A CERTIFIED a-priori RK4/DP5 truncation bound for the ' +
    'Step-2 backward Dyson flow reduces to FIVE analytic ingredients: I1 (elementary-differential ' +
    'derivative bounds sup|y^{(p+1)}|), I2 (a certified minimum-gap lower bound g_min > 0 along the ' +
    'whole trajectory to the front -- the hardest, singular-flow-specific ingredient with no textbook ' +
    'analogue, and the one every I1/I3 constant is a power of), I3 (an N-uniform Lipschitz/stability ' +
    'constant for the step-to-global accumulation, SHARED with and inheriting the openness of the ' +
    'G-gronwall obligation via imp-2520 Gronwall-vacuity near the front), I4 (an ABSOLUTE per-scheme ' +
    'bound against the TRUE flow -- the ingredient the empirical two-method gap structurally CANNOT ' +
    'supply, because a common-mode systematic error cancels in |t_c_RK4 - t_c_DP5|), and I5 (an ' +
    'N-uniform step-budget law dt(N) with the imp-362 pole reduction carried through, COUPLED to the ' +
    'G-interval-enclosure obligation). The numerical illustrations confirm the two motivating gaps on ' +
    'proxies: (S1) on a deliberately biased field RK4 and DP5 AGREE to ~1e-10 while each carries a ' +
    'common-mode absolute error ~6.3e-4 (= eps(1-e^{-1})), a factor ~6e6 the two-method gap is blind ' +
    'to; (S2) the 5th-derivative bound entering the RK4 LTE grows by 10^6 for a single decade of gap ' +
    'reduction, so a finite LTE constant exists only through an a-priori g_min lower bound (I2). ' +
    'CONSEQUENCE: G-step-error is NOT independent of the other two Step-2 obligations -- I3 couples to ' +
    'G-gronwall and I5 to G-interval-enclosure -- and the empirical imp-2466 agreement, while a valid ' +
    'cross-check, is provably not a certificate (I4). SCOPING ONLY: discharges NONE of I1..I5; changes ' +
    'no bound; establishes no operator positivity; the imp-2466 cross-check is UNTOUCHED and remains a ' +
    'valid non-certifying cross-check; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'lambda-roadmap.js Step 2 rigorousUpgradeGap.obligations[G-step-error] (imp-35058); imp-2466 ' +
    '(empirical two-method gap, cross-check not certificate); imp-2520 (G-gronwall, coupled to I3); ' +
    'imp-362 (pole reduction, G-interval-enclosure, coupled to I5); imp-486 (C_mb GUE-conditional); ' +
    'imp-3463 (far-tail E_flow decay exponent 1/2).',
};

export const IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE_ASSERTIONS = [
  {
    // (S1) The two schemes AGREE on the biased field (scheme disagreement is tiny).
    id: 'imp35127-two-method-gap-tiny',
    description: 'RK4 and DP5 agree on the biased field to < 1e-6 (two-method gap is scheme disagreement)',
    holds: () => S1_twoMethodGap < 1e-6,
  },
  {
    // (S1) Yet each carries the SAME absolute common-mode error, ~6e6x larger than the gap -> blindness.
    id: 'imp35127-common-mode-blindness',
    description: 'common-mode absolute error exceeds the two-method gap by > 1000x (gap is blind to E_sys)',
    holds: () => S1_blindnessRatio > 1e3 && S1_commonModeErr > 1e-4,
  },
  {
    // (S1) The common-mode error matches the analytic bias eps (1 - e^{-1}) -> both schemes carry it.
    id: 'imp35127-common-mode-matches-analytic-bias',
    description: 'common-mode absolute error matches eps (1 - e^{-1}) to < 1% (shared, not scheme-specific)',
    holds: () => Math.abs(S1_commonModeErr / S1_commonModePredicted - 1) < 1e-2,
  },
  {
    // (S2) The p+1 = 5th-derivative bound blows up by 10^6 for one decade of gap reduction.
    id: 'imp35127-singular-deriv-blowup',
    description: 'RK4 LTE 5th-derivative bound grows ~1e6 per decade of gap reduction (needs g_min via I2)',
    holds: () => Math.abs(S2_blowupRatio / 1e6 - 1) < 1e-9,
  },
  {
    // I2 hardest / binding, I4 distinguishing; both flagged OPEN.
    id: 'imp35127-i2-hardest-i4-distinguishing-open',
    description: 'I2 named hardest and I4 named distinguishing, both marked OPEN',
    holds: () =>
      IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE.hardestIngredient === 'I2' &&
      IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE.distinguishingIngredient === 'I4' &&
      /OPEN/.test(INGREDIENTS.find((r) => r.id === 'I2').status) &&
      /OPEN/.test(INGREDIENTS.find((r) => r.id === 'I4').status),
  },
  {
    // Honesty gate: scoping only, no QED, imp-2466 untouched, no refereed bound is changed.
    id: 'imp35127-honesty-gate-no-qed',
    description: 'Scoping only: isRigorous false, NO QED, imp-2466 cross-check untouched, no refereed bound is changed',
    holds: () =>
      IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE.isRigorous === false &&
      /NO QED/.test(IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE.verdict) &&
      /imp-2466 cross-check is UNTOUCHED/.test(IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE.verdict),
  },
];

for (const a of IMP35127_G_STEP_ERROR_CERTIFIED_BOUND_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35127-g-step-error-certified-bound-scope assertion failed: ${a.id}`);
  }
}
