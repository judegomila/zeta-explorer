/**
 * @module imp-97383-krein-csharp-tighter-bracket-honest-status
 * @fileoverview imp-97383 -- HONEST-STATUS NOTE recording the imp-97355 reconciliation verdict: the
 *   imp-97206 coupled N,T plateau (~0.5817, joint range [0.5817, 0.5842]) is the TIGHTER measured
 *   Rayleigh-Ritz upper bracket on the Krein concentration constant c_sharp = lambda_min(P_a M_sigma2 P_a)
 *   at 2a = ln3, versus the imp-97335 fixed-N=100 T->inf limit (~0.5822). Documentation only: restates
 *   the imp-97355 ANCHOR-3 finding as a standalone status note so it is directly citable without re-deriving
 *   the reconciliation. No new numerics, no bound moves, no operator positivity, NO QED.
 *
 * @see imp-97355-krein-csharp-tlimit-vs-coupled-crossval.js (source reconciliation: both figures, gap, verdict)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T plateau ~0.5817, the tighter bracket)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (fixed-N=100 T-limit ~0.5822, the looser bracket)
 *
 * Ticket: imp-97383 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * no refereed bound is changed; RH open; NO QED.
 */

import {
  IMP97355_TLIMIT_FIXED_N100,
  IMP97355_COUPLED_PLATEAU_MEAN,
  IMP97355_COUPLED_INNER_N100,
  IMP97355_COUPLED_JOINT_INTERVAL,
  IMP97355_TIGHTER_BRACKET,
} from './imp-97355-krein-csharp-tlimit-vs-coupled-crossval.js';

export const IMP97383_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97383',
  question:
    'which of the two measured c_sharp upper brackets at 2a=ln3 is the tighter one: the imp-97206 coupled ' +
    'N,T plateau (~0.5817) or the imp-97335 fixed-N=100 T->inf limit (~0.5822)?',
  answer:
    'the imp-97206 COUPLED N,T plateau is the tighter measured upper bracket. Per the imp-97355 ' +
    'reconciliation, both figures are Rayleigh-Ritz upper bounds on the true infinite-dimensional ' +
    'lambda_min, so a LOWER reading is the tighter bracket. At the shared node N=100 the coupled inner ' +
    'Stage-1 value (0.581059) sits below the fixed-N=100 T-limit (0.5822), and the coupled run additionally ' +
    'converges the outer N-limit (flat plateau to N=132) while the fixed-N run stops at N=100. The best ' +
    'measured upper bracket is therefore 0.581059, with the true c_sharp lying at or below it.',
  coupledPlateauMean: IMP97355_COUPLED_PLATEAU_MEAN, // 0.581687
  coupledJointRange: IMP97355_COUPLED_JOINT_INTERVAL, // [0.5817, 0.5842]
  coupledInnerN100: IMP97355_COUPLED_INNER_N100, // 0.581059 -- the tighter bracket value
  fixedN100Tlimit: IMP97355_TLIMIT_FIXED_N100, // 0.5822 -- the looser bracket value
  bestMeasuredUpperBracket: IMP97355_TIGHTER_BRACKET.bestMeasuredUpperBracket, // 0.581059
  tighterRun: IMP97355_TIGHTER_BRACKET.tighterRun, // 'imp-97206'
  bothAreRayleighRitzUpperBounds: true,
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97383_HONEST_STATUS.bestMeasuredUpperBracket === IMP97383_HONEST_STATUS.coupledInnerN100 &&
    IMP97383_HONEST_STATUS.bestMeasuredUpperBracket < IMP97383_HONEST_STATUS.fixedN100Tlimit &&
    IMP97383_HONEST_STATUS.tighterRun === 'imp-97206' &&
    IMP97383_HONEST_STATUS.coupledJointRange[0] <= IMP97383_HONEST_STATUS.fixedN100Tlimit &&
    IMP97383_HONEST_STATUS.fixedN100Tlimit <= IMP97383_HONEST_STATUS.coupledJointRange[1] &&
    IMP97383_HONEST_STATUS.bothAreRayleighRitzUpperBounds === true &&
    IMP97383_HONEST_STATUS.rigorousLowerBoundProduced === false &&
    IMP97383_HONEST_STATUS.boundMoves === false &&
    IMP97383_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97383-krein-csharp-tighter-bracket-honest-status assertion FAILED: the coupled N,T plateau ' +
      '(imp-97206) must record as the tighter measured c_sharp upper bracket vs the fixed-N T-limit ' +
      '(imp-97335), per the imp-97355 reconciliation.'
  );
}

export default IMP97383_HONEST_STATUS;
