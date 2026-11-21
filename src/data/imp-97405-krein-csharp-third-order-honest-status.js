/**
 * @module imp-97405-krein-csharp-third-order-honest-status
 * @fileoverview imp-97405 -- HONEST-STATUS NOTE recording the imp-97379 verdict: a THIRD independent
 *   extrapolation order (a simultaneous 2D additive Richardson fit, plus a diagonal coupled-node
 *   Richardson) on the shared imp-97206 6x4 N,T grid does NOT push the measured Krein c_sharp
 *   upper bracket at 2a=ln3 below the imp-97206 coupled reading (best measured upper bracket
 *   0.581059). Documentation only: restates the imp-97379 verdict as a standalone status note so
 *   it is directly citable without re-deriving the third-order attempt. No new numerics, no bound
 *   moves, no operator positivity, NO QED.
 *
 * @see imp-97379-krein-csharp-2d-richardson-third-order.js (source verdict: both 2D fits defective,
 *   diagonal Richardson undershoots)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T plateau, best upper bracket 0.581059)
 *
 * Ticket: imp-97405 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * no refereed bound is changed; RH open; NO QED.
 */

import {
  IMP97379_BEST_UPPER_BRACKET,
  IMP97379_2D_FITS,
  IMP97379_DIAGONAL,
  IMP97379_VERDICT,
} from './imp-97379-krein-csharp-2d-richardson-third-order.js';

export const IMP97405_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97405',
  question:
    'does a THIRD independent extrapolation order (simultaneous 2D additive Richardson fit, or a ' +
    'diagonal coupled-node Richardson) push the measured Krein c_sharp upper bracket at 2a=ln3 below ' +
    'the imp-97206 coupled reading (best measured upper bracket 0.581059)?',
  answer:
    'no. The free-exponent 2D additive fit lam = L + A*N^-q + B*T^-p degenerates (q=0.0006, unphysical ' +
    'L=-63.12) because the inner-T plateau is flat in N with no genuine N power law; the constrained ' +
    'linear-in-1/N variant misfits (rms 6.2e-3, ~10x the plateau std). The diagonal coupled-node ' +
    'Richardson returns numerically lower extrapolants (0.577619, 0.576242) but these are UNDERSHOOTS, ' +
    'not tighter upper brackets: every diagonal endpoint sits below its own inner T->inf limit, so it ' +
    'reads T-biased-low values. The imp-97206 two-stage order (inner T->inf, then outer N) remains the ' +
    'well-posed one; the best measured upper bracket on c_sharp stays 0.581059.',
  bestMeasuredUpperBracket: IMP97379_BEST_UPPER_BRACKET, // 0.581059
  additive2DFitDegenerate: IMP97379_2D_FITS.additiveFreeExp.degenerate, // true
  constrained2DFitMisfits: IMP97379_2D_FITS.linear1overN.misfits, // true
  diagonalRichardsonExtrapolants: [IMP97379_DIAGONAL.diagA.extrapolant, IMP97379_DIAGONAL.diagB.extrapolant],
  diagonalRichardsonUndershoots: IMP97379_VERDICT.diagonalRichardsonUndershoots, // true
  bracketPushedBelowCoupled: IMP97379_VERDICT.bracketPushedBelowCoupled, // false
  twoStageOrderConfirmedWellPosed: IMP97379_VERDICT.twoStageOrderConfirmedWellPosed, // true
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97405_HONEST_STATUS.bestMeasuredUpperBracket === IMP97379_BEST_UPPER_BRACKET &&
    Math.abs(IMP97405_HONEST_STATUS.bestMeasuredUpperBracket - 0.581059) < 1e-6 &&
    IMP97405_HONEST_STATUS.additive2DFitDegenerate === true &&
    IMP97405_HONEST_STATUS.constrained2DFitMisfits === true &&
    IMP97405_HONEST_STATUS.diagonalRichardsonExtrapolants.every((v) => v < IMP97379_BEST_UPPER_BRACKET) &&
    IMP97405_HONEST_STATUS.diagonalRichardsonUndershoots === true &&
    IMP97405_HONEST_STATUS.bracketPushedBelowCoupled === false &&
    IMP97405_HONEST_STATUS.twoStageOrderConfirmedWellPosed === true &&
    IMP97405_HONEST_STATUS.rigorousLowerBoundProduced === false &&
    IMP97405_HONEST_STATUS.boundMoves === false &&
    IMP97405_HONEST_STATUS.qed === false
  )
) {
  throw new Error(
    'imp-97405-krein-csharp-third-order-honest-status assertion FAILED: the imp-97379 third-order ' +
      'extrapolation must record as NOT pushing the c_sharp upper bracket below the imp-97206 coupled ' +
      'reading 0.581059 (2D fits defective, diagonal Richardson undershoots).'
  );
}

export default IMP97405_HONEST_STATUS;
