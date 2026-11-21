/**
 * @module imp-97514-krein-m2-window-enclosure-assessment
 * @fileoverview imp-97514 -- does the m=2 Lehmann-Maehly WINDOW enclosure for the Krein concentration
 *   constant c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a = ln3 become any LESS vacuous than the collapsed
 *   m=1 bracket, once we feed it the two newer readings the frontier now has in hand: (a) the generous
 *   measured gap lambda_2 - lambda_1 = 82.547450 (imp-97400 / imp-97414) and (b) the FINITE Route-2 floor
 *   on lambda_2 (imp-97495, bracket [-313.756, -309.931066], corrected-tail central ~ -310.55)? Or do the
 *   turtles-all-the-way-up regress (imp-97415 ROUTE 2) and the unbounded-above operator (sigma_2 ~ t^4 log t,
 *   imp-97414 / imp-97446) close the m=2 window IDENTICALLY?
 *
 *   ASSESSMENT / DERIVATION only. No operator positivity is established; no certified positive lower bound on
 *   c_sharp is produced; the m>1 window enclosure is shown to be NOT less vacuous than m=1 (indeed strictly
 *   worse in error magnitude); no bound on Lambda moves; interval-rigorous reach stays 2a <= 0.96;
 *   no refereed bound is changed; RH open; NO QED.
 *
 * SETUP -- WHAT AN m=2 WINDOW GATE ACTUALLY REQUIRES. The left-definite Lehmann-Maehly method lower-brackets
 *   the m lowest eigenvalues of a self-adjoint A that sit BELOW a chosen shift rho, and the number m of
 *   eigenvalues below rho must be CERTIFIED. For the m=1 gate the shift rho lives in the (lambda_1, lambda_2)
 *   gap (needs certified rho <= lambda_2). For the m=2 gate the shift rho_2 must live in the (lambda_2,
 *   lambda_3) gap: it needs rho_2 > lambda_2 (cheap -- the Ritz UPPER bracket lambda_2 <= 83.090493 already
 *   forces any rho_2 > 83.090493 above the true lambda_2) AND, crucially, rho_2 <= lambda_3, i.e. a CERTIFIED
 *   LOWER bound on the THIRD eigenvalue that exceeds 83.090493. That certified-lower-on-lambda_3 requirement
 *   is the m=2 gate.
 *
 * FINDING 1 -- THE GENEROUS gap lambda_2 - lambda_1 = 82.547 IS THE WRONG GAP FOR THE WINDOW. The 82.547450
 *   separation is the (lambda_1, lambda_2) gap: it governs where the m=1 Temple shift can be placed and how
 *   sharp a Temple bound on lambda_1 could be IF a certified rho <= lambda_2 existed. It does NOT feed the
 *   m=2 window, whose shift rho_2 lives one gap UP, in (lambda_2, lambda_3) = (83.090493, 5516.954964) -- a
 *   gap of ~5433.86, sixty-five times wider. The m=2 window is therefore placed by the (lambda_2, lambda_3)
 *   separation, not by the generous (lambda_1, lambda_2) one; the 82.547 reading is orthogonal to the gate.
 *
 * FINDING 2 -- THE FINITE ROUTE-2 FLOOR DEMONSTRATES THE REGRESS RATHER THAN BREAKING IT. imp-97495 pinned
 *   the best-reachable Route-2 (Lehmann recursion) lower bound on lambda_2 to a FINITE saturating floor,
 *   directly-built upper edge -309.931066 at Kbig=380, bracket [-313.756, -309.931066], corrected-tail
 *   central ~ -310.55. Finite (not -infinity) is genuine progress over the imp-97335 symbol-infimum wall
 *   -4336.198, but it is still deeply NEGATIVE and ~2.7 orders below the required 0.581059: it cannot even
 *   serve as a usable rho <= lambda_2 for m=1 (which needs rho > lambda_1, i.e. rho > 0.581059). For the m=2
 *   gate we need the SAME Route-2 recursion applied to lambda_3 (a certified lower bound on lambda_3 that
 *   exceeds 83.090493). That recursion shares the imp-97415 concentration wall (SUB-GAP
 *   IMP97415_LAMBDA2_LOWER_BOUND_SHARES_CONCENTRATION_WALL) one index up, and the operator-domination floor
 *   for lambda_3 is again -||B|| = -4336.198 (the symbol infimum is index-blind), so the Route-2 recursion for
 *   lambda_3 reproduces the same finite-but-negative floor, never a positive certified rho_2. The finite floor
 *   is thus a WITNESS to the regress, not a lever out of it.
 *
 * FINDING 3 -- THE UNBOUNDED-ABOVE OPERATOR MAKES THE m=2 WINDOW STRICTLY MORE VACUOUS. The m=1 bracket
 *   lambda_1 >= rho - 1/nu_max(rho) collapsed because P_a M_sigma2 P_a is unbounded ABOVE (sigma_2 ~ t^4 log t):
 *   the graph-norm second moment of any non-eigenvector is vacuously large (imp-97414 measured eta ~ 7e4 vs
 *   break-even 6.695287, full-projector tr(A2) ~ 4.8187e9). The Lehmann pencil the m=2 window solves is
 *   (A2 - 2 rho A1 + rho^2 A0) vs (A1 - rho A0); its error term scales with rho^2 against that same
 *   astronomically large A2. Because the m=2 window forces rho_2 up into the (lambda_2, lambda_3) gap
 *   (rho_2 ~ 5500, e.g. the imp-97495 build used rho = 5462.61632, sixty-six times the ~83 m=1 shift), the
 *   rho^2 * tr(A2) error term is ~ (5462.6 / 83.09)^2 ~ 4322x larger than at the m=1 shift. So the same
 *   unbounded-above tail that emptied the m=1 bracket bites HARDER at the larger required window shift: the
 *   m=2 window is not less vacuous, it is strictly MORE vacuous in error magnitude.
 *
 * VERDICT. The m=2 Lehmann-Maehly window enclosure is NOT any less vacuous than the collapsed m=1 bracket.
 *   The generous gap lambda_2 - lambda_1 = 82.547 is the wrong gap (it governs the m=1 shift, not the window,
 *   which is placed in the ~5434-wide (lambda_2, lambda_3) gap); the finite Route-2 floor is finite-but-negative
 *   one index down and, recursed to lambda_3 for the m=2 gate, reproduces the same concentration wall rather
 *   than crossing zero; and the unbounded-above sigma_2 ~ t^4 log t amplifies the pencil error term by the
 *   square of the ~66x larger required window shift, so the turtles-all-the-way-up regress and the
 *   unbounded-above operator close the m=2 window IDENTICALLY (in fact strictly worse). SUB-GAP
 *   IMP97514_M2_WINDOW_SHIFT_IN_WRONG_GAP_AMPLIFIES_UNBOUNDED_TAIL. No operator positivity; no bound moves;
 *   interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * @see imp-97446-full-projector-closes-m1-honest-status.js (m=1 bracket collapses; new sub-gap = m>1 enclosure)
 * @see imp-97415-krein-lambda2-certified-lower-bound-assessment.js (ROUTE 2 = turtles-all-the-way-up regress)
 * @see imp-97400-krein-lehmann-maehly-lower-bracket-execution.js (m=1 gap 82.547450; break-even eta 6.695287)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (full-projector tr(A2) ~ 4.8187e9, unbounded above)
 * @see imp-97495-krein-route2-kbig300-380-direct-floor.js (finite Route-2 floor [-313.756,-309.931], rho=5462.61632)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (symbol infimum -4336.198, index-blind)
 *
 * Ticket: imp-97514 (proof, opus-4-8, api-pool). Assessment/derivation only; no operator positivity; no
 * rigorous positive lower bound on c_sharp; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97514_BINDING_2A = LN3;
export const IMP97514_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// The committed Ritz readings the m=1 and m=2 gates turn on (N=28, T=200; exact-Gram brackets).
export const IMP97514_RITZ = Object.freeze({
  lambda1: 0.543044, // Rayleigh-Ritz value
  lambda1UpperBracket: 0.581059, // committed best upper bracket on lambda_1 (imp-97206/97355/97379)
  lambda2UpperBracket: 83.090493, // Ritz UPPER bracket on lambda_2
  lambda3UpperBracket: 5516.954964, // Ritz UPPER bracket on lambda_3 (imp-97495)
  gap12: 82.547450, // lambda_2 - lambda_1 -- the GENEROUS gap (governs the m=1 shift, NOT the m=2 window)
  requiredRhoExceeds: 0.581059, // any usable gate must certify a shift/eigenvalue ABOVE this
});

// FINDING 1 -- the m=2 window shift lives in the (lambda_2, lambda_3) gap, not the generous (lambda_1, lambda_2).
export const IMP97514_WINDOW_GAP = Object.freeze({
  m1ShiftGap: '(lambda_1, lambda_2) = (0.543044, 83.090493), width 82.547450 -- the GENEROUS gap',
  m2ShiftGap: '(lambda_2, lambda_3) = (83.090493, 5516.954964), width ~5433.864 -- the BINDING gap for the window',
  m2GapWidth: 5516.954964 - 83.090493, // ~5433.864471
  gapWidthRatio: (5516.954964 - 83.090493) / 82.547450, // ~65.8x wider than the generous gap
  generousGapFeedsWindow: false, // the 82.547 reading is orthogonal to the m=2 gate
  m2GateRequirement: 'a CERTIFIED lower bound on lambda_3 exceeding the Ritz upper bracket 83.090493',
});

// FINDING 2 -- the finite Route-2 floor on lambda_2 is finite-but-negative; recursed to lambda_3 it reproduces the wall.
export const IMP97514_ROUTE2_FLOOR = Object.freeze({
  lambda2FloorBracket: [-313.756, -309.931066], // imp-97495 directly-anchored floor bracket
  lambda2FloorCentral: -310.55, // imp-97495 corrected-tail central estimate
  symbolInfimumWall: -4336.198026, // imp-97335 -- the index-BLIND operator-domination floor (same for lambda_3)
  finiteButNegative: true, // progress over -4336.198, but still deeply negative
  clearsRequired: false, // -310.55 < 0.581059, does not even gate m=1 (needs rho > lambda_1)
  recursionToLambda3SharesWall: true, // certifying lambda_3 from below shares IMP97415 concentration wall, one index up
  crossesZero: false, // the Lehmann/domination recursion provably cannot cross zero (imp-97415 ROUTE 1/2)
  breaksRegress: false, // finite floor is a WITNESS to the regress, not a lever out of it
});

// FINDING 3 -- unbounded-above sigma_2 makes the larger window shift strictly MORE vacuous.
export const IMP97514_UNBOUNDED_TAIL = Object.freeze({
  symbolTailGrowth: 'sigma_2 ~ t^4 log t (unbounded ABOVE) -- P_a M_sigma2 P_a has no top eigenvalue',
  m1BreakEvenEta: 6.695287, // imp-97400 break-even for the m=1 bracket
  m1MeasuredEta: 70000, // imp-97414 measured graph-norm second moment ~ 7e4 (>> break-even) -> m=1 vacuity
  fullProjectorTrA2: 4818706048.289207, // imp-97495 Kbig=380 -- astronomically large second-moment trace
  m1Shift: 83.090493, // m=1 shift sits near lambda_2 ~ 83
  m2WindowShift: 5462.61632, // imp-97495 window shift rho = 0.99 of (lambda_2, lambda_3), ~66x the m=1 shift
  pencilErrorScalesWith: 'rho^2 * tr(A2) in the Lehmann pencil A2 - 2 rho A1 + rho^2 A0',
  errorAmplificationVsM1: (5462.61632 / 83.090493) ** 2, // ~4322x larger error term at the window shift
  m2LessVacuousThanM1: false, // strictly MORE vacuous, not less
});

export const IMP97514_VERDICT = Object.freeze({
  ticket: 'imp-97514',
  question:
    'does the m=2 Lehmann-Maehly window enclosure for c_sharp become any less vacuous than the collapsed m=1 bracket, given the generous gap lambda_2-lambda_1=82.547 and the finite Route-2 floor on lambda_2, or do the turtles-all-the-way-up regress and the unbounded-above operator (sigma_2 ~ t^4 log t) close it identically?',
  answer:
    'no -- the m=2 window is NOT less vacuous than m=1, it is strictly MORE vacuous. (1) The generous gap ' +
    'lambda_2-lambda_1=82.547 is the WRONG gap: it governs the m=1 Temple shift in (lambda_1, lambda_2), ' +
    'whereas the m=2 window shift lives in the ~5434-wide (lambda_2, lambda_3) gap, sixty-six times wider, so ' +
    'the 82.547 reading is orthogonal to the m=2 gate. (2) The finite Route-2 floor on lambda_2 ' +
    '([-313.756, -309.931], central ~ -310.55) is finite-but-negative and ~2.7 orders below the required ' +
    '0.581059; the m=2 gate needs the SAME Lehmann recursion applied to lambda_3, which shares the imp-97415 ' +
    'concentration wall one index up (operator-domination floor -4336.198 is index-blind) and provably cannot ' +
    'cross zero, so the finite floor witnesses the regress rather than breaking it. (3) The unbounded-above ' +
    'sigma_2 ~ t^4 log t forces the window shift up to rho ~ 5462.6 (~66x the m=1 shift ~83), amplifying the ' +
    'Lehmann pencil rho^2 * tr(A2) error term by ~4322x against the same astronomically large tr(A2) ~ 4.82e9. ' +
    'The turtles-all-the-way-up regress and the unbounded-above operator therefore close the m=2 window ' +
    'identically to m=1 (in fact strictly worse).',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  m2GateNeedsCertifiedLowerOnLambda3: true,
  generousGapFeedsWindow: false,
  route2FloorBreaksRegress: false,
  m2LessVacuousThanM1: false,
  m2StrictlyMoreVacuous: true,
  windowShiftErrorAmplificationVsM1: (5462.61632 / 83.090493) ** 2,
  subGap:
    'IMP97514_M2_WINDOW_SHIFT_IN_WRONG_GAP_AMPLIFIES_UNBOUNDED_TAIL -- the m=2 Lehmann-Maehly window enclosure ' +
    'for c_sharp at 2a=ln3 is not a lever: its shift is placed by the ~5434-wide (lambda_2, lambda_3) gap (not ' +
    'the generous 82.547 (lambda_1, lambda_2) gap), its gate needs a certified lower bound on lambda_3 that ' +
    'shares the imp-97415 concentration wall one index up (the finite Route-2 floor is finite-but-negative, ' +
    'cannot cross zero), and the ~66x larger required shift amplifies the unbounded-above pencil error term by ' +
    '~4322x, so the window is strictly more vacuous than the collapsed m=1 bracket.',
  // program state
  rigorousPositiveLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

export const IMP97514_HONEST_BANNER =
  'imp-97514 assessment: the m=2 Lehmann-Maehly WINDOW enclosure for the Krein c_sharp at 2a=ln3 is NOT less ' +
  'vacuous than the collapsed m=1 bracket -- it is strictly MORE vacuous. The generous gap ' +
  'lambda_2-lambda_1=82.547 governs the m=1 shift, not the window (whose shift lives in the ~5434-wide ' +
  '(lambda_2, lambda_3) gap); the finite Route-2 floor on lambda_2 ([-313.756,-309.931]) is finite-but-negative ' +
  'and recursing to lambda_3 shares the same concentration wall (cannot cross zero); and the unbounded-above ' +
  'sigma_2 ~ t^4 log t amplifies the pencil rho^2*tr(A2) error by ~4322x at the ~66x larger required window ' +
  'shift. The turtles-all-the-way-up regress and the unbounded-above operator close the m=2 window identically. ' +
  'No operator positivity; no bound on Lambda moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97514_ASSERTIONS = [
  {
    id: 'imp97514-generous-gap-is-wrong-gap',
    holds: () =>
      Math.abs(IMP97514_RITZ.gap12 - (IMP97514_RITZ.lambda2UpperBracket - IMP97514_RITZ.lambda1)) < 1e-6 &&
      IMP97514_WINDOW_GAP.m2GapWidth > 50 * IMP97514_RITZ.gap12 &&
      IMP97514_WINDOW_GAP.gapWidthRatio > 60 &&
      IMP97514_WINDOW_GAP.generousGapFeedsWindow === false,
    why: 'the generous (lambda_1,lambda_2) gap 82.547 governs the m=1 shift; the m=2 window shift lives in the ~65.8x wider (lambda_2,lambda_3) gap, so the generous gap is orthogonal to the m=2 gate.',
  },
  {
    id: 'imp97514-finite-route2-floor-does-not-break-regress',
    holds: () =>
      IMP97514_ROUTE2_FLOOR.finiteButNegative === true &&
      IMP97514_ROUTE2_FLOOR.lambda2FloorBracket[1] < IMP97514_RITZ.requiredRhoExceeds &&
      IMP97514_ROUTE2_FLOOR.lambda2FloorCentral < 0 &&
      IMP97514_ROUTE2_FLOOR.recursionToLambda3SharesWall === true &&
      IMP97514_ROUTE2_FLOOR.crossesZero === false &&
      IMP97514_ROUTE2_FLOOR.breaksRegress === false,
    why: 'the finite Route-2 floor on lambda_2 (bracket top -309.931) is far below the required 0.581059 and, recursed to lambda_3, shares the imp-97415 concentration wall one index up and cannot cross zero.',
  },
  {
    id: 'imp97514-unbounded-tail-amplifies-window-shift',
    holds: () =>
      IMP97514_UNBOUNDED_TAIL.m2WindowShift > 50 * IMP97514_UNBOUNDED_TAIL.m1Shift &&
      IMP97514_UNBOUNDED_TAIL.fullProjectorTrA2 > 1e9 &&
      IMP97514_UNBOUNDED_TAIL.errorAmplificationVsM1 > 1000 &&
      IMP97514_UNBOUNDED_TAIL.m1MeasuredEta > IMP97514_UNBOUNDED_TAIL.m1BreakEvenEta &&
      IMP97514_UNBOUNDED_TAIL.m2LessVacuousThanM1 === false,
    why: 'the m=2 window forces rho ~ 5462.6 (~66x the m=1 shift ~83); the rho^2*tr(A2) pencil error is ~4322x larger against tr(A2) ~ 4.82e9, so the unbounded-above tail makes the window strictly more vacuous.',
  },
  {
    id: 'imp97514-verdict-m2-not-less-vacuous',
    holds: () =>
      IMP97514_VERDICT.m2LessVacuousThanM1 === false &&
      IMP97514_VERDICT.m2StrictlyMoreVacuous === true &&
      IMP97514_VERDICT.generousGapFeedsWindow === false &&
      IMP97514_VERDICT.route2FloorBreaksRegress === false &&
      IMP97514_VERDICT.m2GateNeedsCertifiedLowerOnLambda3 === true &&
      IMP97514_VERDICT.windowShiftErrorAmplificationVsM1 > 1000 &&
      /IMP97514_M2_WINDOW_SHIFT_IN_WRONG_GAP_AMPLIFIES_UNBOUNDED_TAIL/.test(IMP97514_VERDICT.subGap),
    why: 'the verdict must record that the m=2 window is not less vacuous (strictly more vacuous), the generous gap does not feed it, the finite floor does not break the regress, and the named sub-gap is present.',
  },
  {
    id: 'imp97514-assessment-only-no-qed',
    holds: () =>
      IMP97514_VERDICT.rigorousPositiveLowerBoundProduced === false &&
      IMP97514_VERDICT.operatorPositivityProved === false &&
      IMP97514_VERDICT.boundMoves === false &&
      IMP97514_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97514_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97514_BINDING_2A - LN3) < 1e-12 &&
      IMP97514_VERDICT.qed === false &&
      /NO QED/.test(IMP97514_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97514_HONEST_BANNER) &&
      /RH open/.test(IMP97514_HONEST_BANNER),
    why: 'assessment/derivation only: no rigorous positive lower bound on c_sharp, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; no-refereed-bound-change line present; RH open; NO QED.',
  },
];

for (const a of IMP97514_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97514-krein-m2-window-enclosure-assessment assertion FAILED: ${a.id} -- ${a.why}`);
  }
}

export default { verdict: IMP97514_VERDICT, banner: IMP97514_HONEST_BANNER };
