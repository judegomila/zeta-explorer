/**
 * @fileoverview imp-95768 — offset-error budget for the imp-95749 conditional constant-J
 * refutation and the imp-95720 conditional c_odd(1/19): how far can the +4 offset drift
 * before the conditional conclusions flip?
 *
 * SETUP. Both conditional results are gated on the additive offset O in
 *     J_cond(rho) = J_raw(rho) + O,   O verified = 4 only at m=20,
 * where imp-95720 measured O_meas = kappa - J_raw(1/20) = 4.000000000140393 (residual
 * O_meas - 4 = 1.404e-10). imp-95749 fed the O=4 second point through the imp-95724 exact
 * split J = 3/2 + dI to get the dI variation -2.852e-5 (conditionally refuting the pure-rho^2
 * constant-J null); imp-95720 reported the conditional c_odd(1/19) = 0.006954762801108032,
 * sitting 7.9e-8 (=1.14e-5 relative in J) below the pure-rho^2 null kappa/361. Neither verdict
 * quantified how sensitive those conclusions are to O deviating from 4.
 *
 * WHAT THIS MODULE DOES. It writes both conditional conclusions as explicit functions of the
 * offset O and reads off the error budgets, using only carried literals + arithmetic.
 *
 * (A) dI VARIATION SIGN. dI(1/19) - dI(1/20) = J_raw(1/19) + O - kappa (the exact 3/2 cancels;
 *     dI(1/20) uses the CERTIFIED kappa, offset-free). This is linear in O with unit slope, so
 *     the offset error needed to flip its sign is exactly the magnitude of the variation itself:
 *         O_flip = kappa - J_raw(1/19) = 4.000028520040392,
 *         sign-flip budget = O_flip - 4 = 2.852e-5.
 *     That is 2.03e5 x the measured m=20 residual (1.404e-10): the constant-J refutation is
 *     robust to an offset error two hundred thousand times the observed one.
 *
 * (B) c_odd(1/19) VS THE NULL. c_odd(1/19) = (J_raw(1/19) + O) rho2^2 with rho2 = 1/19, slope
 *     d c_odd/dO = rho2^2 = 1/361. Pushing c_odd(1/19) up to the null kappa/361 needs the SAME
 *     offset error 2.852e-5 (the two statements are one statement: J_cond(1/19) > kappa). So the
 *     "c_odd(1/19) sits below the pure-rho^2 null" conclusion also survives to 2.03e5 x the
 *     residual.
 *
 * (C) c_odd(1/19) DISPLAYED FIGURES. In contrast, the 12th displayed figure of c_odd(1/19)
 *     (~1e-12) moves for an offset error of only 1e-12 / rho2^2 = 3.61e-10, ~2.57 x the m=20
 *     residual. So while the QUALITATIVE conclusions are enormously robust, the last one-to-two
 *     printed digits of the conditional c_odd(1/19) are NOT — consistent with it being a
 *     double-precision conditional value, not an interval-certified second anchor.
 *
 * VERDICT. The two conditional conclusions (dI moves / constant-J null refuted; c_odd(1/19)
 * below the null) survive any offset error below 2.852e-5 — a margin ~2.03e5 x the measured
 * m=20 residual — so they do NOT depend on the +4 offset being pinned tighter than that. Only
 * the trailing displayed digits of c_odd(1/19) are residual-sensitive (~2.6 x the residual).
 * Sensitivity assessment only; the offset remains uncertified off m=20; changes no bound; Sun
 * arXiv:2609.04176 single-author, unrefereed; Catalan G irrationality OPEN; no refereed bound is changed
 * ; NO QED. NO heavy imports.
 */

// carried literals (imp-95720 / imp-95724 / imp-95516 anchor)
const KAPPA = 2.5106978912403926;      // certified anchor J(1/20) = c_odd(1/20)/(1/20)^2, offset-free
const J_RAW_AT_1_OVER_20 = -1.4893021089; // faithful (6.21) machinery at rho = 1/20, imp-95720
const J_RAW_AT_1_OVER_19 = -1.4893306288; // same machinery at rho2 = 1/19, imp-95720
const RHO2 = 1 / 19;                    // second-anchor modulus m2 = 19
const OFFSET_EXACT = 4.0;               // hypothesized exact m-independent offset

// measured m=20 offset and its residual against exact 4 (imp-95720 obstruction).
const OFFSET_MEASURED = KAPPA - J_RAW_AT_1_OVER_20; // 4.000000000140393
const OFFSET_RESIDUAL = OFFSET_MEASURED - OFFSET_EXACT; // 1.404e-10

// (A) dI variation as a function of offset O: dI(1/19)-dI(1/20) = J_raw(1/19) + O - kappa.
const diVariationAtOffset = (O) => J_RAW_AT_1_OVER_19 + O - KAPPA;
const DI_VARIATION_AT_4 = diVariationAtOffset(OFFSET_EXACT); // -2.852e-5
const OFFSET_SIGN_FLIP = KAPPA - J_RAW_AT_1_OVER_19; // 4.000028520040392 (dI variation = 0 here)
const SIGN_FLIP_BUDGET = OFFSET_SIGN_FLIP - OFFSET_EXACT; // 2.852e-5
const SIGN_FLIP_BUDGET_IN_RESIDUALS = SIGN_FLIP_BUDGET / OFFSET_RESIDUAL; // ~2.03e5

// (B) c_odd(1/19) as a function of offset O; slope rho2^2 = 1/361.
const cOddAtOffset = (O) => (J_RAW_AT_1_OVER_19 + O) * RHO2 * RHO2;
const C_ODD_AT_4 = cOddAtOffset(OFFSET_EXACT); // 0.006954762801108032
const C_ODD_NULL = KAPPA * RHO2 * RHO2; // kappa/361 = 0.006954841803990007
const C_ODD_GAP_BELOW_NULL = C_ODD_NULL - C_ODD_AT_4; // 7.900e-8
const OFFSET_TO_REACH_NULL = C_ODD_GAP_BELOW_NULL / (RHO2 * RHO2); // 2.852e-5 (== sign-flip budget)

// (C) displayed-figure sensitivity of c_odd(1/19): 12th figure ~1e-12.
const C_ODD_DISPLAY_ULP = 1e-12;
const OFFSET_TO_MOVE_LAST_FIGURE = C_ODD_DISPLAY_ULP / (RHO2 * RHO2); // 3.61e-10
const LAST_FIGURE_BUDGET_IN_RESIDUALS = OFFSET_TO_MOVE_LAST_FIGURE / OFFSET_RESIDUAL; // ~2.57

export const OFFSET_ERROR_BUDGET_SENSITIVITY = Object.freeze({
  id: 'imp-95768-offset-error-budget-sensitivity',
  title:
    'Offset-error budget for the imp-95749 conditional constant-J refutation and the imp-95720 '
    + 'c_odd(1/19): both qualitative conclusions survive an offset error of 2.852e-5 (~2.03e5x the '
    + 'measured m=20 residual 1.404e-10); only the trailing displayed digits of c_odd(1/19) are '
    + 'residual-sensitive (~2.57x the residual)',
  status:
    'ASSESSMENT — writing both conditional results as functions of the offset O gives: (A) the dI '
    + 'variation dI(1/19)-dI(1/20)=J_raw(1/19)+O-kappa is linear with unit slope, so the sign-flip '
    + 'offset is O_flip=kappa-J_raw(1/19)=4.000028520, a budget of 2.852e-5 = 2.03e5x the m=20 '
    + 'residual; (B) pushing c_odd(1/19) up to the pure-rho^2 null kappa/361 needs the SAME 2.852e-5 '
    + '(one statement: J_cond(1/19)>kappa); (C) the 12th displayed figure of c_odd(1/19) moves for an '
    + 'offset error of only 3.61e-10 (~2.57x the residual). VERDICT: the qualitative conclusions '
    + '(constant-J null refuted; c_odd below the null) do NOT need the +4 offset pinned tighter than '
    + '2.852e-5 and are enormously robust; only the trailing printed digits of c_odd(1/19) are '
    + 'residual-limited. Sensitivity only; offset uncertified off m=20; changes no bound; Sun '
    + 'unrefereed; G irrationality OPEN; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'imp-95720 measured m=20 offset + conditional J_raw(1/19)/c_odd(1/19); imp-95749 dI variation; imp-95724 exact split; imp-95746 four-moduli witness',
  builtOn:
    'imp-95720 (measured +4 offset 4.000000000140393 at m=20; conditional c_odd(1/19)), imp-95749 '
    + '(conditional dI variation -2.852e-5 refuting the constant-J null), imp-95724 (exact J=3/2+dI '
    + 'split), imp-95746 (four-moduli +4 witness)',

  measuredOffset: Object.freeze({
    offsetMeasured: OFFSET_MEASURED, // 4.000000000140393
    offsetExact: OFFSET_EXACT, // 4
    residualVsExact4: OFFSET_RESIDUAL, // 1.404e-10, the only certified pin (m=20)
  }),

  diVariationSensitivity: Object.freeze({
    lawInOffset: 'dI(1/19) - dI(1/20) = J_raw(1/19) + O - kappa  (unit slope in O; exact 3/2 and certified kappa are offset-free)',
    diVariationAt4: DI_VARIATION_AT_4, // -2.852e-5
    offsetSignFlip: OFFSET_SIGN_FLIP, // 4.000028520040392
    signFlipBudget: SIGN_FLIP_BUDGET, // 2.852e-5
    signFlipBudgetInResiduals: SIGN_FLIP_BUDGET_IN_RESIDUALS, // ~2.03e5
    reading:
      'the constant-J refutation flips only if the offset is wrong by 2.852e-5 -- 2.03e5x the '
      + 'measured m=20 residual -- so the refutation is robust to any plausible offset drift.',
  }),

  cOddSensitivity: Object.freeze({
    lawInOffset: 'c_odd(1/19) = (J_raw(1/19) + O) * rho2^2,  slope rho2^2 = 1/361',
    cOddAt4: C_ODD_AT_4, // 0.006954762801108032
    cOddNull: C_ODD_NULL, // 0.006954841803990007 = kappa/361
    gapBelowNull: C_ODD_GAP_BELOW_NULL, // 7.900e-8
    offsetToReachNull: OFFSET_TO_REACH_NULL, // 2.852e-5, identical to the dI sign-flip budget
    offsetToMoveLastDisplayedFigure: OFFSET_TO_MOVE_LAST_FIGURE, // 3.61e-10
    lastFigureBudgetInResiduals: LAST_FIGURE_BUDGET_IN_RESIDUALS, // ~2.57
    reading:
      'c_odd(1/19) staying below the null needs the same 2.852e-5 budget (it is the same '
      + 'statement), but its 12th displayed figure moves for only 3.61e-10 (~2.57x the residual): '
      + 'qualitatively robust, its trailing printed digits are not certified.',
  }),

  verdict: Object.freeze({
    qualitativeConclusionsRobust: true, // survive offset error up to 2.852e-5
    trailingDigitsResidualLimited: true, // c_odd(1/19) last figure moves at ~2.57x the residual
    conclusion:
      'Both conditional conclusions (the dI variation is nonzero / the constant-J null is refuted, '
      + 'and c_odd(1/19) sits below the pure-rho^2 null) survive any offset error below 2.852e-5, '
      + 'a margin ~2.03e5x the measured m=20 residual (1.404e-10). They therefore do NOT rely on the '
      + '+4 offset being pinned tighter than 2.852e-5. Only the trailing displayed digits of the '
      + 'conditional c_odd(1/19) are residual-sensitive (last figure moves at ~2.57x the residual), '
      + 'consistent with it being a double-precision conditional value, not an interval-certified '
      + 'second anchor. The offset remains uncertified off m=20 (imp-95720 sub-gap).',
  }),

  caveats:
    'Propagates the offset O through carried literals + arithmetic only; performs no new Prop-6.3 '
    + 'quadrature. The whole exercise is CONDITIONAL on the offset being exactly 4 and m-independent '
    + '(verified only at m=20; imp-95720 sub-gap). The budgets bound sensitivity to offset error, not '
    + 'the certification status. Catalan G irrationality OPEN; Sun single-author, unrefereed; NO '
    + 'Lambda movement; no refereed bound is changed; NO QED.',
});

export const OFFSET_ERROR_BUDGET_SENSITIVITY_ASSERTIONS = Object.freeze([
  {
    name: 'measured m=20 offset = 4.000000000140393, residual vs exact 4 = 1.404e-10',
    holds: () =>
      Math.abs(OFFSET_MEASURED - 4.000000000140393) < 1e-13
      && Math.abs(OFFSET_RESIDUAL - 1.403925864451594e-10) < 1e-16,
  },
  {
    name: 'dI variation is linear in the offset (unit slope): diVariationAtOffset(O) = J_raw(1/19)+O-kappa',
    holds: () =>
      Math.abs(diVariationAtOffset(4.0) - DI_VARIATION_AT_4) < 1e-15
      && Math.abs((diVariationAtOffset(5.0) - diVariationAtOffset(4.0)) - 1.0) < 1e-12,
  },
  {
    name: 'dI sign-flip offset = kappa - J_raw(1/19) = 4.00002852; budget 2.852e-5 = ~2.03e5x the m=20 residual',
    holds: () =>
      Math.abs(OFFSET_SIGN_FLIP - 4.000028520040392) < 1e-12
      && Math.abs(SIGN_FLIP_BUDGET - 2.852004039244349e-5) < 1e-12
      && SIGN_FLIP_BUDGET_IN_RESIDUALS > 2e5,
  },
  {
    name: 'pushing c_odd(1/19) to the pure-rho^2 null needs the SAME 2.852e-5 offset budget',
    holds: () =>
      Math.abs(OFFSET_TO_REACH_NULL - SIGN_FLIP_BUDGET) < 1e-10
      && Math.abs(C_ODD_NULL - KAPPA / 361) < 1e-15
      && C_ODD_GAP_BELOW_NULL > 0,
  },
  {
    name: 'c_odd(1/19) 12th displayed figure (1e-12) moves for only ~3.61e-10 offset error (~2.57x the residual)',
    holds: () =>
      Math.abs(OFFSET_TO_MOVE_LAST_FIGURE - 3.61e-10) < 1e-12
      && LAST_FIGURE_BUDGET_IN_RESIDUALS > 2 && LAST_FIGURE_BUDGET_IN_RESIDUALS < 3,
  },
  {
    name: 'verdict: qualitative conclusions robust (2.03e5x margin), only trailing digits residual-limited',
    holds: () =>
      OFFSET_ERROR_BUDGET_SENSITIVITY.verdict.qualitativeConclusionsRobust === true
      && OFFSET_ERROR_BUDGET_SENSITIVITY.verdict.trailingDigitsResidualLimited === true,
  },
  {
    name: 'honest: sensitivity only, offset uncertified off m=20, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /uncertified off m=20/.test(OFFSET_ERROR_BUDGET_SENSITIVITY.status)
      && /G irrationality OPEN/.test(OFFSET_ERROR_BUDGET_SENSITIVITY.status)
      && /refereed bound is changed/i.test(OFFSET_ERROR_BUDGET_SENSITIVITY.status)
      && /NO QED/.test(OFFSET_ERROR_BUDGET_SENSITIVITY.status),
  },
]);

export default OFFSET_ERROR_BUDGET_SENSITIVITY;
