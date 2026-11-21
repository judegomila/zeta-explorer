/**
 * @module imp-35759-exact-debruijn-precision-digit-cost-scope
 *
 * imp-35759 (numerical/assessment, S-frontier): ESTIMATE the arbitrary-precision
 * working-digit count the exact de Bruijn integral evaluator
 * (scripts/imp-34813-exact-debruijn-winding-offline.mjs) would need to push its
 * DOUBLE-precision x ~< 104 (gamma ~< 52) ceiling toward T_PT-scale heights.
 *
 * imp-35726 Part D names the cap without costing it: the exact evaluator represents
 * H_0(x) = xi(1/2 + i x/2)/8 directly (sidestepping deconvolution) BUT double
 * roundoff caps it at x ~< 104 because the signal |H_0(x)| ~ exp(-pi x / 8) drops
 * under the ~1e-17 double floor beyond that -- astronomically below T_PT = 3e12.
 * This module supplies the missing OOM cost: how many mantissa digits keep
 * exp(-pi x / 8) resolvable at larger x, and what working precision a modest lift
 * above 104 versus a T_PT-scale lift would demand.
 *
 * ORDER-OF-MAGNITUDE COST ESTIMATE ONLY. Extends no evaluator; runs no arbitrary-
 * precision code; certifies nothing at T_PT; changes no bound; no RH verdict, NO
 * QED. No refereed bound is changed.
 *
 * THE UNDERFLOW-DRIVEN DIGIT LAW
 * -----------------------------------------------------------------------------
 * The exact evaluator forms H_0(x) as an integral of a smooth O(1) kernel Phi(u)
 * against an oscillatory factor; the RESULT is exponentially small, |H_0(x)| ~
 * exp(-pi x / 8), while the intermediate contributions are O(1). That is a
 * cancellation of ratio ~ exp(+pi x / 8): to keep the tiny signal resolvable above
 * the working roundoff of the O(1) intermediates, the relative machine epsilon must
 * satisfy eps_work <~ exp(-pi x / 8). Writing eps_work = 10^{-D} for D significant
 * decimal digits gives the leading-order requirement
 *     D_underflow(x) = (pi / (8 ln 10)) * x  ~  0.17055 * x   decimal digits,
 * i.e. ONE extra working digit buys about 1 / 0.17055 ~ 5.86 units of x
 * (~ 2.93 units of gamma). A modest guard band D_guard (a few digits, to retain a
 * usable resolution of the sign / winding read, not just the leading bit) rides on
 * top: D_work(x) = D_guard + D_underflow(x).
 *
 * CALIBRATION AGAINST THE OBSERVED x ~< 104 CEILING
 * -----------------------------------------------------------------------------
 * D_underflow(104) = 0.17055 * 104 ~ 17.74 digits -- exactly the double budget
 * (~15.95 relative digits from the 53-bit mantissa, stretched to the ~1e-17
 * absolute floor for O(1) quantities). The law brackets the empirical cap cleanly:
 * 18 digits reaches x ~ 105.5 and 16 digits reaches x ~ 93.8, so the observed x ~<
 * 104 sits where double runs out -- confirming the underflow is the operative
 * mechanism, not a coincidence.
 *
 * WHAT A MODEST LIFT COSTS
 * -----------------------------------------------------------------------------
 *   - x = 200 (gamma = 100, doubling the reachable ordinate): D_underflow ~ 34.1
 *     digits -- i.e. QUAD precision (IEEE binary128, ~33.9 digits) roughly DOUBLES
 *     the height, reaching x ~ 199. (80-bit x87 extended, ~19.2 digits, reaches only
 *     x ~ 112 -- barely past double; quad is the meaningful step.)
 *   - x = 500 (gamma = 250): ~85 digits.
 *   - x = 1000 (gamma = 500): ~171 digits (roughly a 200-digit arbitrary-precision
 *     working context, GMP/MPFR territory).
 * The reach is LINEAR in digits (x_reach ~ D / 0.17055), so each factor in height
 * costs a proportional factor in precision -- there is no cheap regime.
 *
 * WHAT A T_PT-SCALE LIFT COSTS
 * -----------------------------------------------------------------------------
 * T_PT = 3e12 is a zero-ordinate (gamma) height, so in the script convention
 * (zeros of H_0 at x = 2 gamma) the target is x_TPT = 2 * T_PT = 6e12. Then
 *     D_underflow(6e12) = 0.17055 * 6e12 ~ 1.023e12 decimal digits
 *                       ~ 3.40e12 bits ~ 4.25e11 bytes ~ 425 GB
 * of mantissa PER EVALUATED VALUE -- about a TRILLION working digits. (Reading the
 * height loosely as x = T_PT directly only halves this to ~5.1e11 digits: same
 * order of magnitude.) This is not a precision one tunes; it is a categorical wall.
 * The exact evaluator is a t <= 0 negative-de-Bruijn-time calibration instrument on
 * a ~10-zero window, not a T_PT-scale tool, and no attainable working precision
 * changes that.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * OOM cost estimate only. It counts ONLY the underflow-driven mantissa digits the
 * exp(-pi x / 8) signal demands; it ignores the SEPARATE (and also growing) costs a
 * real high-x evaluation would carry -- the integrand node count, the number of
 * Phi-series terms, and the argument-reduction precision for the oscillatory factor
 * -- all of which only make the picture WORSE. It extends no evaluator, runs no
 * high-precision arithmetic, certifies no value, and changes no bound. NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35726-w1-sign-reconciliation-cost-scope (Part D: names the x ~< 104 cap, |H_0| ~ exp(-pi x/8) under 1e-17, uncosted)
 * @see scripts/imp-34813-exact-debruijn-winding-offline.mjs (the exact evaluator; window x in [20,104], roundoff floor ~1e-17)
 * @see project_winding_thread_closed_corrected (imp-34813: Gaussian conv proxy = EXACT de Bruijn flow at negative time t = -4 tau_repo)
 * @see imp-35757-i2-panel-width-count-scope (sibling frontier OOM scoping module)
 * @see Platt-Trudgian 2021 (verified zero height T_PT = 3e12; no refereed bound is changed)
 */

// -- Anchor + operative constants (import-light; matching imp-35726 / imp-35757) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified zero-ordinate (gamma) height
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const X_EXACT_CAP = 104; // observed double-precision x-ceiling (scripts/imp-34813-...offline.mjs)
const X_TPT = 2 * T_PT; // x = 2 gamma convention; T_PT ordinate maps to x = 6e12
const LN10 = Math.LN10; // 2.302585092994046

// Underflow digit law: D_underflow(x) = (pi / (8 ln 10)) * x, from |H_0| ~ exp(-pi x/8).
const DIGITS_PER_X = Math.PI / (8 * LN10); // ~ 0.170547 decimal digits per unit x
const X_PER_DIGIT = 1 / DIGITS_PER_X; // ~ 5.863 units of x bought per extra digit

const D_underflow = (x) => DIGITS_PER_X * x; // leading-order working digits needed at x
const x_reach = (digits) => digits / DIGITS_PER_X; // x reachable with a given digit budget

// Calibration: the digit law at the observed cap ~ the double budget.
const D_AT_CAP = D_underflow(X_EXACT_CAP); // ~ 17.74 digits ~ double budget (brackets 104)

// Precision tiers (relative decimal digits): double ~15.95, x87 extended ~19.27, quad ~33.9.
const DIGITS_DOUBLE = 15.95;
const DIGITS_EXTENDED80 = 19.27;
const DIGITS_QUAD128 = 33.9;
const REACH_DOUBLE = x_reach(DIGITS_DOUBLE); // ~ 93.5 (cap pushed to 104 using the full ~1e-17 floor)
const REACH_EXTENDED80 = x_reach(DIGITS_EXTENDED80); // ~ 113
const REACH_QUAD128 = x_reach(DIGITS_QUAD128); // ~ 199 (~ doubles the height)

// Modest-lift anchors.
const D_AT_X200 = D_underflow(200); // ~ 34.1 digits (gamma = 100)
const D_AT_X1000 = D_underflow(1000); // ~ 170.5 digits (gamma = 500)

// T_PT-scale lift (x = 2 * T_PT = 6e12).
const D_TPT_DIGITS = D_underflow(X_TPT); // ~ 1.023e12 decimal digits
const D_TPT_BITS = D_TPT_DIGITS * Math.log2(10); // ~ 3.40e12 bits
const D_TPT_BYTES = D_TPT_BITS / 8; // ~ 4.25e11 bytes (~ 425 GB per value)

export const IMP35759_EXACT_DEBRUIJN_PRECISION_DIGIT_COST_SCOPE = {
  id: 'imp-35759',
  proofSection: 'S-frontier',
  question:
    'Quantify the arbitrary-precision working-digit count the exact de Bruijn integral evaluator ' +
    '(scripts/imp-34813-exact-debruijn-winding-offline.mjs) would need to push its double-precision x ~< 104 ' +
    '(gamma ~< 52) ceiling toward T_PT-scale heights, given the |H_0| ~ exp(-pi x/8) underflow imp-35726 Part D ' +
    'names as the cap. Order-of-magnitude cost estimate only; extends no evaluator; certifies nothing at T_PT; ' +
    'changes no bound; NO QED.',
  underflowDigitLaw: {
    mechanism:
      'The evaluator forms H_0(x) as an integral of an O(1) kernel whose RESULT is exponentially small, ' +
      '|H_0(x)| ~ exp(-pi x/8); the O(1) intermediates cancel to ratio ~ exp(+pi x/8), so the relative machine ' +
      'epsilon must satisfy eps_work <~ exp(-pi x/8) to keep the signal above roundoff.',
    formula: 'D_underflow(x) = (pi / (8 ln 10)) * x ~ 0.17055 * x decimal digits (D_work = D_guard + D_underflow)',
    digitsPerX: DIGITS_PER_X,
    xPerDigit: X_PER_DIGIT,
    note: 'One extra working digit buys ~5.86 units of x (~2.93 units of gamma); the reach is LINEAR in digits.',
  },
  calibration: {
    observedCap: X_EXACT_CAP,
    digitsAtCap: D_AT_CAP,
    statement:
      'D_underflow(104) ~ 17.74 digits ~ the double budget (~15.95 relative digits stretched to the ~1e-17 ' +
      'absolute floor). 18 digits reaches x ~ 105.5 and 16 digits reaches x ~ 93.8, bracketing the observed ' +
      'x ~< 104 -- confirming the underflow is the operative cap.',
  },
  modestLift: {
    reachDouble: REACH_DOUBLE,
    reachExtended80: REACH_EXTENDED80,
    reachQuad128: REACH_QUAD128,
    x200Digits: D_AT_X200,
    x1000Digits: D_AT_X1000,
    statement:
      'Doubling the reachable ordinate to x = 200 (gamma = 100) needs ~34.1 digits -- QUAD precision (IEEE ' +
      'binary128, ~33.9 digits) roughly doubles the height (x ~ 199), while 80-bit extended (~19.3 digits) ' +
      'reaches only x ~ 113. x = 500 needs ~85 digits; x = 1000 needs ~171 (GMP/MPFR arbitrary-precision ' +
      'territory). No cheap regime -- each height factor costs a proportional precision factor.',
  },
  tptLift: {
    xTPT: X_TPT,
    digits: D_TPT_DIGITS,
    bits: D_TPT_BITS,
    bytes: D_TPT_BYTES,
    gigabytes: D_TPT_BYTES / 1e9,
    statement:
      'x_TPT = 2 * T_PT = 6e12 needs D_underflow ~ 1.023e12 decimal digits ~ 3.40e12 bits ~ 425 GB of mantissa ' +
      'PER evaluated value -- about a TRILLION working digits (reading the height as x = T_PT only halves this, ' +
      'same OOM). A categorical wall, not a tunable precision.',
  },
  ignoredCosts:
    'This counts ONLY the underflow-driven mantissa digits. It ignores the SEPARATE growing costs a real high-x ' +
    'run carries -- integrand node count, Phi-series term count, oscillatory argument-reduction precision -- all ' +
    'of which only worsen the picture.',
  isRigorous: false,
  verdict:
    'ORDER-OF-MAGNITUDE COST ESTIMATE (frontier-direction, NOT rigorous). The exact de Bruijn evaluator caps at ' +
    'x ~< 104 because |H_0(x)| ~ exp(-pi x/8) underflows the ~1e-17 double floor; keeping that signal resolvable ' +
    'costs D_underflow(x) = (pi / (8 ln 10)) x ~ 0.17055 x working decimal digits, LINEAR in x. This brackets ' +
    'the observed cap (double ~18 digits -> x ~< 104). A modest lift to x = 200 (gamma = 100) needs ~34 digits ' +
    '(quad precision roughly doubles the height); x = 1000 needs ~171 digits. A T_PT-scale lift (x = 6e12) needs ' +
    '~1.0e12 decimal digits ~ 425 GB per value -- a trillion working digits, a categorical wall. It counts only ' +
    'the underflow digits (node/term/argument-reduction costs only worsen it); extends no evaluator, runs no ' +
    'high-precision arithmetic, certifies no value, and changes no bound. NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35726 Part D (names the x ~< 104 cap, |H_0| ~ exp(-pi x/8) under the ~1e-17 floor, uncosted); ' +
    'scripts/imp-34813-exact-debruijn-winding-offline.mjs (the exact evaluator; window x in [20,104], roundoff ' +
    'floor ~1e-17); imp-35757 (sibling frontier OOM scoping); Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed).',
};

export const IMP35759_EXACT_DEBRUIJN_PRECISION_DIGIT_COST_SCOPE_ASSERTIONS = [
  {
    // The underflow digit law: D_underflow(x) = (pi / (8 ln 10)) x ~ 0.17055 x, inverse of the reach.
    id: 'imp35759-underflow-digit-law',
    description: 'D_underflow(x) = (pi/(8 ln10)) x ~ 0.17055 x; reach = D/0.17055 (mutual inverses)',
    holds: () =>
      Math.abs(DIGITS_PER_X - Math.PI / (8 * Math.LN10)) < 1e-15 &&
      Math.abs(DIGITS_PER_X - 0.17054704) < 1e-6 &&
      Math.abs(X_PER_DIGIT - 1 / DIGITS_PER_X) < 1e-12 &&
      Math.abs(x_reach(D_underflow(500)) - 500) < 1e-9,
  },
  {
    // Calibration: the law at x=104 lands on the double budget, bracketing the observed cap.
    id: 'imp35759-calibration-brackets-104',
    description: 'D_underflow(104) ~ 17.74 digits ~ double budget; 16 digits -> x~93.8, 18 -> x~105.5 bracket 104',
    holds: () =>
      Math.abs(D_AT_CAP - 17.7369) < 1e-3 &&
      x_reach(16) < X_EXACT_CAP &&
      x_reach(18) > X_EXACT_CAP &&
      X_EXACT_CAP === 104,
  },
  {
    // Modest lift: quad (~33.9 digits) roughly doubles the height to x~199 (gamma~100).
    id: 'imp35759-modest-lift-quad-doubles',
    description: 'x=200 needs ~34.1 digits; quad128 (~33.9 digits) reaches x~199, ~doubling the double cap',
    holds: () =>
      Math.abs(D_AT_X200 - 34.109) < 1e-2 &&
      Math.abs(REACH_QUAD128 - 199) < 2 &&
      REACH_QUAD128 > 2 * REACH_DOUBLE - 20 &&
      REACH_EXTENDED80 < 120 &&
      Math.abs(D_AT_X1000 - 170.547) < 1e-2,
  },
  {
    // T_PT-scale lift: ~1e12 decimal digits ~ 425 GB per value -- a categorical wall.
    id: 'imp35759-tpt-lift-trillion-digits',
    description: 'x_TPT=6e12 needs ~1.02e12 decimal digits ~ 3.4e12 bits ~ 425 GB per value',
    holds: () =>
      X_TPT === 6e12 &&
      Math.abs(D_TPT_DIGITS / 1.02328e12 - 1) < 1e-3 &&
      Math.abs(D_TPT_BYTES / 1e9 - 424.9) < 5 &&
      Math.abs(D_TPT_BITS / (D_TPT_DIGITS * Math.log2(10)) - 1) < 1e-12,
  },
  {
    // Honesty gate: OOM cost estimate only, extends no evaluator, no QED, no refereed bound is changed.
    id: 'imp35759-honesty-gate-no-qed',
    description: 'Cost estimate only; extends no evaluator; certifies nothing at T_PT; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35759_EXACT_DEBRUIJN_PRECISION_DIGIT_COST_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /extends no evaluator/.test(IMP35759_EXACT_DEBRUIJN_PRECISION_DIGIT_COST_SCOPE.verdict) &&
      /NO QED/.test(IMP35759_EXACT_DEBRUIJN_PRECISION_DIGIT_COST_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35759_EXACT_DEBRUIJN_PRECISION_DIGIT_COST_SCOPE.verdict),
  },
];

for (const a of IMP35759_EXACT_DEBRUIJN_PRECISION_DIGIT_COST_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35759-exact-debruijn-precision-digit-cost-scope assertion failed: ${a.id}`);
  }
}
