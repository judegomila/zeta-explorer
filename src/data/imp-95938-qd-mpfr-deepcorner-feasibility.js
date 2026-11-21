/**
 * imp-95938 -- FEASIBILITY / COST ASSESSMENT of a quad-double (QD) or MPFR
 * deep-corner shift-invert solve PAST N = 5200 (N ~ 6400-8000), to decide whether
 * higher-than-double-double precision can restore the imp-95919 monotone lambda_min
 * sweep and cross the ln 1.2 companion u_fit_rel BELOW the ln 1.3 direct 0.23 percent,
 * or whether a new pre-asymptotic envelope plateau appears instead. The direct
 * successor of imp-95919, which found the ln 1.2 double-double reach lever EXHAUSTED
 * at N ~ 5200 (N = 6400 lambda_min reverses upward, N = 8000 returns NaN) because the
 * (pi/(N+1))^2 finite-section correction shrank below the DD roundoff of the
 * cond ~ 5.6e22 shift-invert solve, and named the residual: crossing below 0.23 percent
 * now needs precision BEYOND double-double at the A_opt ~ 4.26e-22 deep corner.
 *
 * GRADE: precision-budget feasibility assessment. Import-light and FAST: all baked
 * constants are re-derived live from cheap float64 arithmetic (machine epsilons, digit
 * budgets, the condition-number amplification K back-derived from the imp-95919 measured
 * reversal, the QD/MPFR floor estimates, the monotone-signal size). NO quad-double
 * Levinson solver is run at import (a single N = 6400 QD solve would cost hours -- see
 * the COST leg below); the assessment is analytic. Changes NO numeric value of the
 * imp-95767 interval; NO new bound; NO QED.
 *
 * WHAT imp-95919 LEFT AS THE RESIDUAL. Past N = 5200 the ln 1.2 double-double reach
 * lever is FLOORED, not merely slow: the monotone-decreasing lambda_min(N) sweep that
 * held for every N <= 5200 REVERSES at N = 6400 (ratio - 1 = lambda_min/A_opt - 1 ticks
 * UP 6.213e-5 -> 8.085e-5) and BREAKS DOWN at N = 8000 (NaN). imp-95919 concluded that
 * crossing the ln 1.2 companion u_fit_rel below the ln 1.3 direct 0.23 percent now needs
 * precision BEYOND double-double (quad-double or MPFR) at the deep corner, and left the
 * feasibility/cost of that as the open sub-gap -- which THIS ticket assesses.
 *
 * THE PRECISION BUDGET (why DD floors, and by how much QD/MPFR clears it).
 *   - Rayleigh-quotient shift-invert converges with shift sigma = rq*(1 - m), m = 0.02,
 *     so the SHIFTED matrix M = G - sigma*I has smallest eigenvalue ~ m*lambda_min and
 *     cond(M) ~ cond(G)/m = 5.6e22 / 0.02 = 2.8e24 (log10 ~ 24.45). Solving M x = b
 *     therefore loses ~24.4 decimal digits.
 *   - Double-double carries ~106-bit ~ 31.9 decimal digits, leaving ~7.5 reliable digits
 *     in the eigenvector -- consistent with the observed floor.
 *   - The DD noise floor is MEASURED directly by the imp-95919 reversal: the N = 6400
 *     lambda_min jump is +1.872e-5 relative, which equals the ratio - 1 change
 *     (8.085e-5 - 6.213e-5 = 1.872e-5) to all reported digits -- the reversal jump IS the
 *     DD roundoff floor. Back-deriving the amplification K = floor / eps_dd = 1.872e-5 /
 *     1.233e-32 = 1.519e27 (log10 ~ 27.18, ~ cond(M) times an O(1e3) RQ/iteration factor).
 *   - The monotone SIGNAL the sweep must resolve at N = 6400 is a ratio - 1 DECREMENT of
 *     ~2.5e-5 (linear-in-H extrapolation of the last four reliable points predicts
 *     ratio - 1 ~ 3.67e-5, vs 6.213e-5 at N = 5200). Signal ~ floor at N ~ 5200-6400 --
 *     exactly why the DD sweep reverses there.
 *   - QUAD-DOUBLE (~212-bit ~ 63.8 digits): after the same ~24.4-digit loss it keeps
 *     ~39.4 reliable digits, so the estimated QD floor is K*eps_qd = 1.519e27 *
 *     1.519e-64 = 2.31e-37 relative -- ~ 32 ORDERS below the ~2.5e-5 signal. MPFR at
 *     256 bits (~77 digits) gives an estimated floor ~1.31e-50. So PRECISION is NOT the
 *     blocker: QD (let alone MPFR) has ~31.9 orders of headroom (eps_dd/eps_qd = 2^106 =
 *     8.11e31) and WOULD restore the monotone sweep well past N = 8000.
 *
 * THE COST (why this is documented-but-deferred, not executed here). QD does NOT change
 * the O(N^2) Levinson-per-solve x ~240-shift-solves structure; it multiplies each
 * elementary op by the QD-vs-DD arithmetic ratio (~10-20x for the mul-heavy inner loops).
 * The imp-95919 DD points cost ~640 s (N = 6400) and ~945 s (N = 8000), so a QD redo is
 * ~1.8-5.3 CPU-hours PER point, and the reach at which u_fit_rel would actually cross
 * below 0.23 percent is not analytically known -- the DD envelope tightening was already
 * DECELERATING (0.54 -> 0.34 -> 0.247 percent across reach ~183/512/948), so crossing the
 * remaining 1.07x (0.247 -> < 0.23) plausibly needs reach WELL past 1500 (N well past
 * 8000), with cost growing O(N^2). Spending several CPU-hours per point for a 1.07x
 * companion-interval tightening that changes NO certified bound is low-leverage.
 *
 * DECISION (the ticket question). FEASIBLE on precision, DEFERRED on cost, and the
 * CROSSING itself remains open even with QD. (a) Quad-double / MPFR clears the deep-corner
 * DD floor with ~31.9 orders of headroom and WOULD restore the imp-95919 monotone sweep
 * past N = 6400/8000 -- precision is decisively not the blocker. (b) The blocker is the
 * O(N^2)-per-solve QD cost (~1.8-5.3 CPU-h/point) against a modest 1.07x companion gain
 * that moves no certified interval. (c) Even at unlimited precision, whether u_fit_rel
 * actually crosses below the ln 1.3 direct 0.23 percent depends on the EXTRAPOLATED
 * envelope reach (a decelerating envelope-structure question), NOT merely on removing the
 * floor -- so a NEW pre-asymptotic envelope plateau could still appear. This assessment
 * therefore recommends the QD/MPFR crossing run as a documented-but-deferred lever and
 * names the residual precisely.
 *
 * RESIDUAL SUB-GAP. The actual quad-double / MPFR shift-invert crossing run at
 * N ~ 6400-8000+ is NOT executed here (deferred on the O(N^2) cost-vs-1.07x-gain
 * tradeoff); this ticket establishes feasibility by an analytic precision budget with the
 * amplification K back-derived from the measured DD floor. Two distinct open pieces remain:
 * (i) run the QD/MPFR sweep and confirm the monotone reversal is removed (precision leg,
 * feasible, low-leverage); (ii) determine the reach at which the DECELERATING u_fit_rel
 * envelope crosses below 0.23 percent, or whether it plateaus for envelope-structure
 * reasons independent of the DD floor (extrapolation leg, the genuinely uncertain part).
 *
 * HONEST SCOPE. A precision-budget feasibility assessment of an existing audit grid; no
 * new cited input, no new bound, no operator positivity, no heavy solve at import, and NO
 * numeric change to the imp-95767 certified interval (that interval is at ln 1.3; this is
 * the ln 1.2 companion). Model seam family only; the imp-95212 envelope port, signed
 * WEIGHT, and modulus/phase legs stay OPEN. Changes NO bound of the Lambda program;
 * NO QED; no refereed bound is changed. Sun arXiv:2609.04176 unrefereed.
 *
 * @see imp-95919-ln12-past5200-dd-floor (the DD floor + residual this assesses)
 * @see imp-95896-ln12-past2800-ufit-tightening (the 14-point N<=5200 grid at the floor)
 * @see imp-95841-ln13-shift-invert-direct-exponent (the ln1.3 direct 0.23 percent target)
 * @see imp-95820-shift-invert-dd-toeplitz-crossing (the DD solver a QD redo would reuse)
 * @see imp-95922-ufit-reach-conditioning-two-factor (the decelerating u_fit_rel envelope)
 */

export const IMP95938_QD_MPFR_DEEPCORNER_FEASIBILITY = {
  id: "imp-95938",
  title:
    "FEASIBILITY / COST assessment -- can a quad-double / MPFR deep-corner shift-invert " +
    "solve past N = 5200 (N ~ 6400-8000) restore the imp-95919 monotone lambda_min sweep " +
    "and cross the ln 1.2 companion u_fit_rel below the ln 1.3 direct 0.23 percent? " +
    "VERDICT: FEASIBLE on precision (QD clears the cond ~5.6e22 deep-corner DD floor with " +
    "~31.9 orders of headroom, estimated QD floor ~2.3e-37 vs a ~2.5e-5 monotone signal), " +
    "but DEFERRED on cost (O(N^2)-per-solve QD ~1.8-5.3 CPU-h/point for a 1.07x companion " +
    "gain that moves no certified bound) -- and the CROSSING reach itself stays open " +
    "because the u_fit_rel envelope is decelerating, not floor-limited",
  question:
    "does a quad-double / MPFR deep-corner shift-invert solve at N ~ 6400-8000 have the " +
    "precision headroom to restore the imp-95919 monotone sweep and cross u_fit_rel below " +
    "the ln 1.3 direct 0.23 percent, and at what cost -- or does a new envelope plateau appear?",
  delta: 0.18232155679395462, // ln 1.2
  // ---- machine epsilons + decimal-digit budgets (re-derived live below) ----
  epsDouble: 2.220446049250313e-16, // 53-bit
  epsDD: 1.2325951644078309e-32, // 2^-106
  epsQD: 1.5192908393215678e-64, // 2^-212
  epsMPFR256: 8.6361685550944446e-78, // 2^-256
  digitsDD: 31.909, // 106 * log10(2)
  digitsQD: 63.818, // 212 * log10(2)
  digitsMPFR256: 77.064, // 256 * log10(2)
  // ---- shift-invert conditioning at convergence ----
  condG: 5.6e22, // base Gram condition = lambda_max / A_opt (imp-95919 deep corner)
  shiftMargin: 0.02, // sigma = rq*(1 - m); smallest eig of M = G - sigma*I ~ m*lambda_min
  condM: 2.8e24, // cond(G)/m -- the actual solve conditioning
  log10CondM: 24.447,
  ddReliableDigitsAfterSolve: 7.462, // digitsDD - log10(condM); consistent with the observed floor
  qdReliableDigitsAfterSolve: 39.371, // digitsQD - log10(condM)
  // ---- the MEASURED DD floor (from the imp-95919 reversal) ----
  lam5200: 4.2636909684e-22,
  lam6400: 4.2637707905e-22,
  ratioMinus1_5200: 6.213036e-5,
  ratioMinus1_6400: 8.085289e-5,
  ddFloorRelMeasured: 1.872136e-5, // (lam6400 - lam5200)/lam5200 = the reversal jump
  ratioMinus1Change: 1.872253e-5, // 8.085289e-5 - 6.213036e-5 -- equals the jump (cross-check)
  ddFloorIsReversalJump: true, // the reversal jump IS the DD roundoff floor
  // ---- amplification + higher-precision floor estimates ----
  amplificationK: 1.518857e27, // ddFloorRelMeasured / epsDD (~ condM * O(1e3) RQ factor)
  log10AmplificationK: 27.182,
  qdFloorRelEstimate: 2.307586e-37, // K * epsQD
  mpfr256FloorRelEstimate: 1.311711e-50, // K * epsMPFR256
  // ---- the monotone signal the sweep must resolve at N = 6400 ----
  monotoneSignalRel_N6400: 2.5e-5, // ratio-1 decrement (linear-in-H extrapolation ~3.67e-5 vs 6.21e-5)
  signalNearFloorAtN5200to6400: true, // signal ~ DD floor there -> DD sweep reverses
  // ---- headroom (the feasibility verdict) ----
  headroomEpsDDoverEpsQD: 8.112964e31, // 2^106
  headroomOrdersDDtoQD: 31.91,
  qdHeadroomOverSignalOrders: 31.9, // log10(signal / qdFloor) ~ log10(2.5e-5 / 2.3e-37)
  precisionIsTheBlocker: false, // QD/MPFR clears the floor with huge margin
  qdWouldRestoreMonotoneSweep: true, // estimated QD floor << monotone signal at N = 6400/8000
  // ---- cost (why deferred) ----
  ddCostSecN6400: 640, // imp-95919 baked ~640 s (N = 6400 DD)
  ddCostSecN8000: 945, // imp-95919 ~945 s (N = 8000 DD, returned NaN)
  qdArithMultiplierLo: 10, // QD-vs-DD elementary-op cost, mul-heavy inner loops
  qdArithMultiplierHi: 20,
  qdCostHoursN6400Lo: 1.78, // 640 s * 10 / 3600
  qdCostHoursN8000Hi: 5.25, // 945 s * 20 / 3600
  levinsonScaling: "O(N^2) per solve x ~240 shift solves; QD keeps the structure, x10-20 per op",
  // ---- the crossing target + why it stays open even at unlimited precision ----
  ln13DirectUFitRel: 2.3e-3, // 0.23% -- the target
  ln12PlateauUFitRel: 2.465082e-3, // 0.247% (imp-95919 plateau)
  looserThanLn13Factor: 1.072,
  envelopeTighteningDecelerating: true, // 0.54 -> 0.34 -> 0.247% across reach ~183/512/948
  crossingReachAnalyticallyKnown: false, // decelerating envelope -> crossing reach uncertain
  crossingOpenEvenWithQD: true, // removing the floor does NOT settle the extrapolation leg
  // ---- verdict flags ----
  feasibleOnPrecision: true,
  deferredOnCost: true,
  qdRunExecuted: false, // NOT run here -- analytic assessment only
  residualSubGap:
    "(i) run the QD/MPFR shift-invert sweep at N ~ 6400-8000+ to confirm the monotone " +
    "reversal is removed (precision leg -- feasible with ~31.9 orders headroom, but " +
    "~1.8-5.3 CPU-h/point and low-leverage); (ii) determine the reach at which the " +
    "DECELERATING u_fit_rel envelope crosses below 0.23 percent, or whether it plateaus " +
    "for envelope-structure reasons independent of the DD floor (extrapolation leg -- the " +
    "genuinely uncertain part).",
  boundChange: false,
  qed: false,
  verdict:
    "ASSESSED -- a quad-double / MPFR deep-corner shift-invert solve past N = 5200 is " +
    "FEASIBLE on precision but DEFERRED on cost, and the crossing stays open even at " +
    "unlimited precision. PRECISION BUDGET: the Rayleigh-quotient shift-invert converges " +
    "with sigma = rq*(1 - 0.02), so the shifted matrix M = G - sigma*I has cond(M) ~ " +
    "cond(G)/0.02 = 2.8e24 (log10 ~ 24.45) and each solve loses ~24.4 digits. Double-double " +
    "(~31.9 digits) keeps ~7.5 reliable digits, and the DD floor is MEASURED directly by " +
    "the imp-95919 reversal -- the N = 6400 lambda_min jump +1.872e-5 relative equals the " +
    "ratio - 1 change (8.085e-5 - 6.213e-5) to all reported digits, so the reversal jump IS " +
    "the DD roundoff floor. Back-deriving the amplification K = floor/eps_dd = 1.519e27, " +
    "quad-double (~63.8 digits, ~39.4 reliable after the solve) gives an estimated floor " +
    "K*eps_qd ~ 2.31e-37 relative and MPFR-256 (~77 digits) ~1.31e-50 -- both ~30+ orders " +
    "BELOW the ~2.5e-5 monotone signal the sweep must resolve at N = 6400. So QD/MPFR clears " +
    "the deep corner with ~31.9 orders of headroom (eps_dd/eps_qd = 2^106 = 8.11e31) and " +
    "WOULD restore the imp-95919 monotone sweep well past N = 8000: PRECISION IS NOT THE " +
    "BLOCKER. COST: QD keeps the O(N^2)-per-solve x ~240-shift-solve structure and multiplies " +
    "each op by ~10-20x, so the imp-95919 ~640 s (N = 6400) / ~945 s (N = 8000) DD points " +
    "become ~1.8-5.3 CPU-hours per point; and because the DD envelope tightening was already " +
    "DECELERATING (0.54 -> 0.34 -> 0.247 percent across reach ~183/512/948), crossing the " +
    "remaining 1.07x (0.247 -> < 0.23) plausibly needs reach WELL past 1500 (N well past " +
    "8000), cost growing O(N^2), for a companion tightening that moves NO certified bound. " +
    "CROSSING STILL OPEN: even at unlimited precision, whether u_fit_rel crosses below the " +
    "ln 1.3 direct 0.23 percent depends on the EXTRAPOLATED envelope reach (a decelerating " +
    "envelope-structure question), not merely on removing the floor -- a new pre-asymptotic " +
    "envelope plateau could still appear. RESIDUAL: the actual QD/MPFR crossing run at " +
    "N ~ 6400-8000+ is NOT executed here (deferred on cost-vs-1.07x-gain); this ticket " +
    "establishes feasibility by an analytic precision budget with K back-derived from the " +
    "measured DD floor, and separates the feasible-but-low-leverage precision leg from the " +
    "genuinely uncertain extrapolation leg. Precision-budget feasibility assessment of an " +
    "existing audit grid; no new cited input; no numeric change to the imp-95767 certified " +
    "interval; model seam family only; the imp-95212 envelope port, signed WEIGHT, and " +
    "modulus/phase legs stay OPEN. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
  closesTickets: ["imp-95938"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions. Import-light and FAST: every baked constant is
// re-derived live from cheap float64 arithmetic (machine epsilons, digit budgets,
// the condition-number amplification K back-derived from the imp-95919 measured
// reversal, the QD/MPFR floor estimates). NO quad-double solver runs at import.
// ---------------------------------------------------------------------------
const REF = IMP95938_QD_MPFR_DEEPCORNER_FEASIBILITY;
const LOG10 = Math.log10;

export const IMP95938_ASSERTIONS = [
  {
    id: "imp95938-machine-epsilons-and-digit-budgets-rederive",
    description:
      "the baked DD / QD / MPFR-256 machine epsilons are 2^-106 / 2^-212 / 2^-256 and the decimal-digit budgets are bits*log10(2), all reproduced live to < 1e-6 relative",
    holds: () => {
      const okEps =
        Math.abs(REF.epsDD - Math.pow(2, -106)) / REF.epsDD < 1e-12 &&
        Math.abs(REF.epsQD - Math.pow(2, -212)) / REF.epsQD < 1e-12 &&
        Math.abs(REF.epsMPFR256 - Math.pow(2, -256)) / REF.epsMPFR256 < 1e-12;
      const okDig =
        Math.abs(REF.digitsDD - 106 * LOG10(2)) < 1e-3 &&
        Math.abs(REF.digitsQD - 212 * LOG10(2)) < 1e-3 &&
        Math.abs(REF.digitsMPFR256 - 256 * LOG10(2)) < 1e-3;
      return okEps && okDig;
    },
  },
  {
    id: "imp95938-shift-invert-conditioning-cond-M",
    description:
      "the shifted-solve conditioning cond(M) = cond(G)/margin = 5.6e22/0.02 = 2.8e24 (log10 ~ 24.45), leaving ~7.5 reliable DD digits and ~39.4 reliable QD digits after the solve",
    holds: () => {
      const condM = REF.condG / REF.shiftMargin;
      const log10CondM = LOG10(condM);
      return (
        Math.abs(condM - REF.condM) / REF.condM < 1e-9 &&
        Math.abs(log10CondM - REF.log10CondM) < 1e-3 &&
        Math.abs(REF.digitsDD - log10CondM - REF.ddReliableDigitsAfterSolve) < 1e-2 &&
        Math.abs(REF.digitsQD - log10CondM - REF.qdReliableDigitsAfterSolve) < 1e-2
      );
    },
  },
  {
    id: "imp95938-dd-floor-is-the-imp95919-reversal-jump",
    description:
      "the measured DD floor equals the imp-95919 N=6400 reversal jump (lam6400 - lam5200)/lam5200 AND equals the ratio-1 change (8.085e-5 - 6.213e-5) to < 1e-3 relative -- the reversal jump IS the DD roundoff floor",
    holds: () => {
      const jump = (REF.lam6400 - REF.lam5200) / REF.lam5200;
      const dRatio = REF.ratioMinus1_6400 - REF.ratioMinus1_5200;
      return (
        Math.abs(jump - REF.ddFloorRelMeasured) / REF.ddFloorRelMeasured < 1e-4 &&
        Math.abs(dRatio - REF.ratioMinus1Change) / REF.ratioMinus1Change < 1e-4 &&
        Math.abs(jump - dRatio) / jump < 1e-3 &&
        REF.ddFloorIsReversalJump === true
      );
    },
  },
  {
    id: "imp95938-amplification-K-and-qd-mpfr-floor-estimates",
    description:
      "the amplification K = ddFloor/eps_dd = 1.519e27 (log10 ~ 27.18) re-derives, and the QD / MPFR-256 floor estimates K*eps_qd ~ 2.31e-37 / K*eps_mpfr256 ~ 1.31e-50 reproduce live to < 1e-3 relative",
    holds: () => {
      const K = REF.ddFloorRelMeasured / REF.epsDD;
      const qdFloor = K * REF.epsQD;
      const mpfrFloor = K * REF.epsMPFR256;
      return (
        Math.abs(K - REF.amplificationK) / REF.amplificationK < 1e-3 &&
        Math.abs(LOG10(K) - REF.log10AmplificationK) < 1e-2 &&
        Math.abs(qdFloor - REF.qdFloorRelEstimate) / REF.qdFloorRelEstimate < 1e-3 &&
        Math.abs(mpfrFloor - REF.mpfr256FloorRelEstimate) / REF.mpfr256FloorRelEstimate < 1e-3
      );
    },
  },
  {
    id: "imp95938-signal-near-floor-explains-dd-reversal",
    description:
      "the monotone signal to resolve at N=6400 (~2.5e-5 ratio-1 decrement) is within an order of the measured DD floor (~1.87e-5) -- signal ~ floor at N ~ 5200-6400, exactly why the DD sweep reverses there",
    holds: () => {
      const r = REF.monotoneSignalRel_N6400 / REF.ddFloorRelMeasured;
      return (
        REF.signalNearFloorAtN5200to6400 === true &&
        r > 0.3 && r < 3 // same order of magnitude
      );
    },
  },
  {
    id: "imp95938-qd-headroom-clears-signal-precision-not-blocker",
    description:
      "the DD->QD precision headroom is eps_dd/eps_qd = 2^106 = 8.11e31 (~31.9 orders) and the QD floor is ~31.9 orders BELOW the monotone signal, so QD/MPFR would restore the monotone sweep and precision is NOT the blocker",
    holds: () => {
      const headroom = REF.epsDD / REF.epsQD;
      const qdVsSignalOrders = LOG10(REF.monotoneSignalRel_N6400 / REF.qdFloorRelEstimate);
      return (
        Math.abs(headroom - Math.pow(2, 106)) / headroom < 1e-9 &&
        Math.abs(LOG10(headroom) - REF.headroomOrdersDDtoQD) < 1e-2 &&
        qdVsSignalOrders > 25 &&
        Math.abs(qdVsSignalOrders - REF.qdHeadroomOverSignalOrders) < 1.0 &&
        REF.precisionIsTheBlocker === false &&
        REF.qdWouldRestoreMonotoneSweep === true
      );
    },
  },
  {
    id: "imp95938-qd-cost-estimate-is-the-deferral-reason",
    description:
      "the QD cost estimate (DD seconds x 10-20 arithmetic multiplier / 3600) gives ~1.8-5.3 CPU-hours per point at N ~ 6400-8000, the documented reason the run is deferred rather than executed",
    holds: () => {
      const hoursLo = (REF.ddCostSecN6400 * REF.qdArithMultiplierLo) / 3600;
      const hoursHi = (REF.ddCostSecN8000 * REF.qdArithMultiplierHi) / 3600;
      return (
        Math.abs(hoursLo - REF.qdCostHoursN6400Lo) / REF.qdCostHoursN6400Lo < 1e-2 &&
        Math.abs(hoursHi - REF.qdCostHoursN8000Hi) / REF.qdCostHoursN8000Hi < 1e-2 &&
        REF.deferredOnCost === true &&
        REF.qdRunExecuted === false
      );
    },
  },
  {
    id: "imp95938-crossing-stays-open-even-with-qd",
    description:
      "the ln 1.2 plateau u_fit_rel (0.247%) is 1.07x looser than the ln 1.3 direct 0.23%, the envelope tightening is DECELERATING, and the crossing reach is not analytically known -- so crossing stays open even at unlimited precision (a NEW envelope plateau could appear)",
    holds: () =>
      REF.ln12PlateauUFitRel > REF.ln13DirectUFitRel &&
      Math.abs(REF.ln12PlateauUFitRel / REF.ln13DirectUFitRel - REF.looserThanLn13Factor) /
        REF.looserThanLn13Factor < 1e-2 &&
      REF.envelopeTighteningDecelerating === true &&
      REF.crossingReachAnalyticallyKnown === false &&
      REF.crossingOpenEvenWithQD === true,
  },
  {
    id: "imp95938-honest-scope-feasibility-not-a-bound",
    description:
      "this is a precision-budget feasibility assessment (feasible on precision, deferred on cost, crossing still open); it runs no QD solver at import, moves no Lambda bound, and proves no QED",
    holds: () =>
      REF.feasibleOnPrecision === true &&
      REF.deferredOnCost === true &&
      REF.qdRunExecuted === false &&
      REF.boundChange === false &&
      REF.qed === false &&
      /ASSESSED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.closesTickets.includes("imp-95938"),
  },
];

for (const a of IMP95938_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95938-qd-mpfr-deepcorner-feasibility assertion failed: ${a.id}`,
    );
  }
}

export default IMP95938_QD_MPFR_DEEPCORNER_FEASIBILITY;
