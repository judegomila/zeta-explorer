/**
 * @module imp-97054-route-m-two-sided-norm-rejection-assessment
 *
 * imp-97054 (proof, ASSESSMENT + DIRECTION ANALYSIS): the imp-97033 sub-gap
 * (imp-97033-data-alone-quad-rejection-needs-half-of-Nstar) shows a DATA-ALONE rejection of the
 * Route M concave-quad ||G||_F ceiling turnover to the 1 percent level needs exact rungs to
 * N_top ~ 49 percent of N* ~ 4e7 (an O(N^3) V-table ~5.9e8x the current N=24000 rung,
 * offline-HPC-only), and names "the PROVEN imp-96750 one-sided interior norm asymptotic" as the only
 * rung-free route to pin F. This ticket assesses whether imp-96750 can be SHARPENED from one-sided
 * to a two-sided ||G||_F asymptotic that rejects the quad turnover analytically, without O(N^3)
 * rungs. FINDING: the sharpening is the analytically-CORRECT route (the LOWER half of a two-sided
 * bound is exactly what rejects a concave turnover, and it transfers rung-free through the already
 * two-sided imp-96708 H2 sandwich), but it does NOT close here, for two reasons the parent tickets
 * elide. No bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-96750: Int(N) = interior Frobenius second moment = ||G_int(N)||_F^2 (the sum of
 * squared interior Vasyunin-Gram entries); the "one-sided interior norm asymptotic" is the UPPER
 * bound Int(N) <= s* log N (s* = 2 zeta(2) s0*, s0* an absolute constant); x = log N.
 *
 * -------------------------------------------------------------------------------
 * PREMISE CORRECTION -- imp-96750 is a REDUCTION + OBSTRUCTION, not a proof.
 * -------------------------------------------------------------------------------
 * imp-97016 and imp-97033 both cite "a PROVEN one-sided interior norm asymptotic (imp-96750)".
 * imp-96750 itself records oneSidedBoundProved = FALSE: it rigorously REDUCES the upper bound to a
 * single uniform lemma Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 <= s0* b + O(1) (via the
 * imp-96708 sandwich Int <= zeta(2) T and the exact regrouping T(M) = 2 Sum_{b<=M} Q(b)/b^2,
 * checkpoint T(250)=11.757622 reproduced), and PROVES term-splitting overshoots to M log^2 M, but the
 * residual weighted Vasyunin/Bettin-Conrey cotangent second moment is NOT established. So there is no
 * proven one-sided asymptotic to "sharpen" yet -- even the UPPER half is only reduced, not in hand.
 *
 * -------------------------------------------------------------------------------
 * DIRECTION ANALYSIS -- the UPPER half is the WRONG side for a CONCAVE model.
 * -------------------------------------------------------------------------------
 * The Route M ceiling model in question is the concave quadratic in x = log N,
 *     ||G||_F(x) ~ c0 + c1 x + c2 x^2,   with MEASURED c2 = -0.01623 < 0   (imp-96912 EXT_FIT.quad)
 * i.e. a genuine nonzero (log N)^2 term with NEGATIVE curvature: the fitted norm rises, peaks at
 * x_peak = -c1/(2 c2) ~ 22.1 (N ~ 4.12e9), then turns over and decreases. Squaring to the second
 * moment, Int_model = ||G||_F^2. Consider which half of a two-sided Int = Theta(log N) law kills a
 * nonzero c2:
 *   * c2 > 0 (convex, super-log growth): Int_model ~ c2^2 x^4 EXCEEDS any upper bound Int <= s* x, so
 *     the UPPER half forces c2 = 0. But the fitted model is NOT convex.
 *   * c2 < 0 (concave TURNOVER, the actual case): past x_peak, ||G||_F decreases toward 0, so
 *     Int_model decreases too and stays BELOW s* x -- the UPPER bound is never violated. What a
 *     turnover DOES violate is a LOWER bound Int >= s_lo x (s_lo > 0), which forces
 *     ||G||_F >= sqrt(s_lo log N) -> infinity and forbids the norm turning over at all.
 * NUMERIC WITNESS (imp-96912 quad coefficients): at x = x_peak the fitted norm is 9.644 and still
 * positive, yet at x_peak + 0.5 it has already fallen to 9.640 -- so Int_model = ||G||_F^2 is
 * DECREASING there while positive, which contradicts an increasing lower bound but not an upper one.
 * CONCLUSION: the concave quad turnover -- the exact object imp-97033 wants rejected -- is rejected
 * ONLY by the LOWER half of a two-sided bound. imp-96750 targets the UPPER half. So sharpening to
 * two-sided is not merely helpful, it is NECESSARY, and the operative new ingredient is the LOWER
 * companion, not the upper one imp-96750 reduced.
 *
 * A subtlety that STRENGTHENS the rung-free case: the fitted turnover peak N ~ 4.12e9 sits PAST the
 * conditioning ceiling N* ~ 4.09e7 (imp-96912 ceilingBelowPeak = true), so over the physical window
 * [24000, N*] the quad is still increasing -- which is exactly why the O(N^3) data-alone route must
 * push rungs to ~49 percent of N* to see the divergence (imp-97033). A PROVEN two-sided
 * Int = Theta(log N) is an ASYMPTOTIC statement about the growth law; it forces c2 = 0 outright, no
 * matter how far out the finite-range turnover sits. That is the rung-free advantage: it decides the
 * (log N)^2 coefficient by proof, not by pushing exact rungs toward N*.
 *
 * -------------------------------------------------------------------------------
 * REDUCTION TRANSFER -- the lower half is rung-free through the SAME machinery.
 * -------------------------------------------------------------------------------
 * The imp-96708 H2 sandwich is ALREADY two-sided: with H2(m) = Sum_{g<=m} 1/g^2 in [1, zeta(2)],
 *     T(N)  <=  Int(N)  <=  zeta(2) T(N),
 * and the exact symmetric regrouping T(M) = 2 Sum_{b<=M} Q(b)/b^2 is an identity (not an
 * approximation; imp-96750 reproduced the checkpoint). So a LOWER bound on Int transfers, with NO
 * new N-rungs, to a lower companion of imp-96750's uniform lemma:
 *     Q(b) >= s0_lo b - O(1)  (s0_lo > 0)   ==>   T(M) >= 2 s0_lo log M - O(1)   ==>   Int(N) >= T(N)
 *                                                                         >= 2 s0_lo log N - O(1).
 * Paired with imp-96750's upper companion Q(b) <= s0* b + O(1), a two-sided
 *     s0_lo b - O(1)  <=  Q(b)  <=  s0* b + O(1)
 * gives Int(N) = Theta(log N) and rejects the quad turnover. And REJECTION is CHEAP in the constant:
 * only s0_lo > 0 is needed, NOT s0_lo = s0* -- any positive log-slope lower bound already forbids the
 * concave turnover, so the gap between s0_lo and the exact slope s0 ~ 1.75 is irrelevant to
 * rejection. So YES: IF the two-sided Q-lemma held, the rejection would be analytic and rung-free.
 *
 * -------------------------------------------------------------------------------
 * OBSTRUCTION -- the lower companion is unestablished, and term-splitting is worse downward.
 * -------------------------------------------------------------------------------
 * The lower companion Q(b) >= s0_lo b - O(1) is a LOWER bound on the same two-variable
 * Vasyunin/Bettin-Conrey cotangent second moment as imp-96750's upper companion, and it is NOT in
 * hand. Term-splitting -- the route imp-96750 already ruled out UPWARD -- is even more hopeless
 * DOWNWARD: I(a,b) is the SMALL residual of an O(b log b) cancellation between the arithmetic part
 * A(a,b) = C(a+b)+(1/2)(a-b)log(b/a) and the cotangent part (pi/2)(V(a,b)+V(b,a)), so any clean
 * lower bound that keeps only a fixed finite set of coprime a contributes O(1) per b, NOT Omega(b);
 * to reach the required Omega(b) one needs the full positive DENSITY of coprime a in (0,b) each
 * contributing Theta(1) on average -- precisely a LOWER bound on the cotangent mean square, of the
 * same unestablished status as the upper companion. Combined with the premise correction (the upper
 * companion is itself only reduced, not proven), the two-sided sharpening replaces one unestablished
 * one-sided lemma with an unestablished two-sided PAIR whose rejection-relevant LOWER half is the
 * residual sub-gap.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest assessment; no bound moved).
 * -------------------------------------------------------------------------------
 * Sharpening imp-96750 one-sided -> two-sided is the ANALYTICALLY CORRECT and RUNG-FREE route to
 * reject the Route M concave-quad ceiling: the LOWER half of a two-sided Int = Theta(log N) law is
 * exactly what a concave (c2<0) turnover violates (the upper half imp-96750 targets does NOT reject
 * it), it transfers with no new N-rungs through the already two-sided imp-96708 H2 sandwich plus the
 * exact regrouping, and rejection needs only s0_lo > 0 (not the exact slope). But it does NOT close
 * here: (1) PREMISE -- imp-96750 is a reduction+obstruction, not a proof (oneSidedBoundProved=false;
 * imp-97016/imp-97033 mislabel it PROVEN), so even the upper half is not in hand; (2) OBSTRUCTION --
 * the rejection-relevant LOWER companion Q(b) >= s0_lo b - O(1) is an unestablished lower bound on the
 * Bettin-Conrey cotangent second moment, with term-splitting even more hopeless downward. No improved
 * rigorous ceiling posted; the trace ceiling T ~ 2.594e7 stays the rigorous anchor; compute (N~9916)
 * binds first regardless. No refereed bound is changed; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97054-lower-companion-cotangent-second-moment -- the Omega(b) lower
 * companion Q(b) >= s0_lo b - O(1) with an absolute s0_lo > 0.
 *
 * @see imp-97033-route-m-fm-discriminant-reach-threshold.js (names imp-96750 as the rung-free route; the O(N^3) data-alone cost)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (the one-sided UPPER reduction + term-split obstruction; oneSidedBoundProved=false)
 * @see imp-96912-route-m-frobenius-ladder-extension-above-16000.js (the concave quad fit c2<0, turnover peak past N*)
 * @see imp-96708-route-m-interior-second-moment-dichotomy.js (the two-sided H2 sandwich T <= Int <= zeta(2) T)
 *
 * Ticket: imp-97054 (proof, opus-4-8, api-pool). Assessment + direction analysis; NO QED.
 */

import {
  IMP96750_VERDICT,
  IMP96750_ZETA2,
  IMP96750_T_CHECKPOINT,
  IMP96750_S0_MEASURED,
} from './imp-96750-route-m-interior-second-moment-upper-bound-reduction.js';
import {
  IMP96912_EXT_FIT,
  IMP96912_QUAD_TURNOVER,
} from './imp-96912-route-m-frobenius-ladder-extension-above-16000.js';
import { IMP97033_SUBGAP } from './imp-97033-route-m-fm-discriminant-reach-threshold.js';

// The fitted concave quad ||G||_F(x) = a + b x + c x^2, x = log N (imp-96912 extended 24-rung fit).
const QUAD = IMP96912_EXT_FIT.quad;
const froQuad = (x) => QUAD.a + QUAD.b * x + QUAD.c * x * x;
const X_PEAK = IMP96912_QUAD_TURNOVER.logNpeak; // -b/(2c) ~ 22.1

// PREMISE CORRECTION: imp-96750 is a reduction, imp-97016/imp-97033 mislabel it "PROVEN".
export const IMP97054_PREMISE = Object.freeze({
  imp96750OneSidedBoundProved: IMP96750_VERDICT.oneSidedBoundProved, // false
  imp97033CallsItProven: /PROVEN one-sided/.test(IMP97033_SUBGAP.statement), // true
  note:
    'imp-97016/imp-97033 cite "a PROVEN one-sided interior norm asymptotic (imp-96750)", but ' +
    'imp-96750 records oneSidedBoundProved=false: it REDUCES the upper bound to the uniform lemma ' +
    'Q(b) <= s0* b + O(1) and rules out term-splitting, but does NOT prove it. There is no proven ' +
    'one-sided asymptotic to sharpen yet -- even the upper half is only reduced, not in hand.',
});

// DIRECTION ANALYSIS: which half of a two-sided Int=Theta(log N) law kills the (log N)^2 term.
export const IMP97054_DIRECTION = Object.freeze({
  quadCurvature: QUAD.c, // -0.01623 (concave: negative log^2 coefficient)
  isConcaveTurnover: QUAD.c < 0, // true -- the fitted model turns over
  turnoverPeakLogN: X_PEAK, // ~22.1
  froAtPeak: froQuad(X_PEAK), // ~9.644, still positive
  froPastPeak: froQuad(X_PEAK + 0.5), // ~9.640, already smaller
  intModelDecreasingPastPeak: froQuad(X_PEAK + 0.5) < froQuad(X_PEAK), // true (Int=fro^2 decreasing)
  froStillPositivePastPeak: froQuad(X_PEAK + 0.5) > 0, // true
  upperRejectsConvex: true, // c2>0 gives Int ~ c2^2 x^4 > s* x -- upper bound kills convex growth
  upperRejectsConcaveTurnover: false, // c2<0: Int_model decreases, stays under the upper bound
  lowerRejectsConcaveTurnover: true, // Int >= s_lo x (s_lo>0) forbids ||G||_F turning over
  operativeHalf: 'lower', // the LOWER companion is what rejects the fitted concave model
});

// REDUCTION TRANSFER: the lower half is rung-free through the already two-sided imp-96708 sandwich.
export const IMP97054_TRANSFER = Object.freeze({
  zeta2: IMP96750_ZETA2, // 1.6449... -- H2 in [1, zeta(2)] gives BOTH sides
  sandwichIsTwoSided: true, // T(N) <= Int(N) <= zeta(2) T(N)
  regroupingIsIdentity:
    Math.abs(IMP96750_T_CHECKPOINT.tRegrouped - IMP96750_T_CHECKPOINT.tDirect) < 1e-6, // true
  lowerCompanion: 'Q(b) >= s0_lo b - O(1), s0_lo > 0  ==>  Int(N) >= 2 s0_lo log N - O(1)',
  needsNewNRungs: false, // the constant s0_lo is a b-uniform lemma, not an N-ladder rung
  rejectionNeedsOnlyPositiveSlope: true, // s0_lo > 0 suffices; s0_lo = s0 ~ 1.75 NOT required
  exactSlopeS0Measured: IMP96750_S0_MEASURED, // 1.751 -- irrelevant to rejection (only sign matters)
});

// OBSTRUCTION: the lower companion is unestablished; term-splitting is worse downward.
export const IMP97054_OBSTRUCTION = Object.freeze({
  lowerCompanionEstablished: false,
  termSplittingWorseDownward: true,
  why:
    'the lower companion is a LOWER bound on the same two-variable Vasyunin/Bettin-Conrey cotangent ' +
    'second moment. I(a,b) is the SMALL residual of an O(b log b) cancellation, so any clean lower ' +
    'bound keeping a fixed finite set of coprime a contributes O(1) per b, NOT Omega(b); reaching ' +
    'Omega(b) needs the full positive density of coprime a each contributing Theta(1) on average -- ' +
    'a lower bound on the cotangent mean square, unestablished, same status as the upper companion.',
});

export const IMP97054_VERDICT = Object.freeze({
  question:
    'can the imp-96750 one-sided (UPPER) interior norm asymptotic be sharpened to a two-sided ||G||_F ' +
    'asymptotic that rejects the Route M concave-quad ceiling turnover analytically, without O(N^3) rungs?',
  sharpeningIsCorrectRoute: true, // the LOWER half rejects a concave turnover; upper half does not
  lowerHalfIsOperative: IMP97054_DIRECTION.operativeHalf === 'lower',
  transfersRungFree: IMP97054_TRANSFER.needsNewNRungs === false, // via the two-sided H2 sandwich
  rejectionNeedsOnlyPositiveSlope: IMP97054_TRANSFER.rejectionNeedsOnlyPositiveSlope,
  premiseWasWrong: IMP97054_PREMISE.imp96750OneSidedBoundProved === false, // imp-96750 not proven
  lowerCompanionEstablished: IMP97054_OBSTRUCTION.lowerCompanionEstablished, // false
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  computeBindsFirst: true,
  qed: false,
  conclusion:
    'Sharpening imp-96750 one-sided -> two-sided is the analytically CORRECT and RUNG-FREE route to ' +
    'reject the Route M concave-quad ceiling: a concave (c2=-0.0162<0) turnover is violated ONLY by ' +
    'the LOWER half of a two-sided Int=Theta(log N) law (numeric witness: the fitted Int_model=||G||_F^2 ' +
    'is already decreasing while positive just past the peak x~22.1), NOT by the UPPER half imp-96750 ' +
    'targets; the lower half transfers with NO new N-rungs through the already two-sided imp-96708 ' +
    'sandwich T<=Int<=zeta(2)T plus the exact regrouping T(M)=2 Sum Q(b)/b^2, and rejection needs only ' +
    's0_lo>0 (not the exact slope s0~1.75). But it does NOT close: (1) PREMISE -- imp-96750 is a ' +
    'reduction+obstruction, oneSidedBoundProved=false (imp-97016/imp-97033 mislabel it PROVEN), so ' +
    'even the upper half is not in hand; (2) OBSTRUCTION -- the rejection-relevant LOWER companion ' +
    'Q(b)>=s0_lo b - O(1) is an unestablished lower bound on the Bettin-Conrey cotangent second moment, ' +
    'with term-splitting even more hopeless downward. No rigorous ceiling posted; T~2.594e7 stays the ' +
    'anchor; compute N~9916 binds first. No refereed bound is changed; RH open; NO QED.',
});

export const IMP97054_SUBGAP = Object.freeze({
  id: 'imp-97054-lower-companion-cotangent-second-moment',
  statement:
    'Rejecting the Route M concave-quad ||G||_F ceiling turnover rung-free reduces (through the already ' +
    'two-sided imp-96708 H2 sandwich T<=Int<=zeta(2)T and the exact regrouping T(M)=2 Sum_{b<=M} ' +
    'Q(b)/b^2) to a single LOWER companion of the imp-96750 uniform lemma: Q(b) = ' +
    'Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 >= s0_lo b - O(1) with an ABSOLUTE s0_lo > 0 (only the SIGN ' +
    'matters -- any positive log-slope forbids the concave turnover). This is a one-sided LOWER bound ' +
    'on the two-variable Vasyunin/Bettin-Conrey cotangent second moment, the mirror of imp-96750 upper ' +
    'companion; term-splitting is even more hopeless downward (a fixed finite set of coprime a gives ' +
    'O(1) per b, not Omega(b), because I is the small residual of an O(b log b) cancellation). NOT ' +
    'established here. Its upper mate (imp-96750) is itself only reduced, not proven.',
});

export const IMP97054_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment + direction analysis only: no bound ' +
  'moved and no O(N^3) rung computed. Two findings the parent tickets elide -- (1) imp-96750 is a ' +
  'reduction+obstruction, not the "PROVEN" one-sided asymptotic imp-97016/imp-97033 cite ' +
  '(oneSidedBoundProved=false); (2) the UPPER half imp-96750 targets is the WRONG side for a concave ' +
  'turnover -- only the LOWER half of a two-sided Int=Theta(log N) law rejects it (numeric witness: ' +
  'the fitted Int_model turns over just past x~22.1 while positive). The lower half transfers ' +
  'rung-free through the already two-sided imp-96708 sandwich but rests on an unestablished LOWER ' +
  'bound on the Bettin-Conrey cotangent second moment; the trace ceiling T~2.594e7 stays the anchor.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97054_ASSERTIONS = [
  {
    id: 'imp97054-premise-imp96750-not-proven-but-cited-as-proven',
    holds: () =>
      IMP97054_PREMISE.imp96750OneSidedBoundProved === false &&
      IMP97054_PREMISE.imp97033CallsItProven === true,
    why: 'imp-96750 records oneSidedBoundProved=false (a reduction+obstruction), yet imp-97033 cites it as a PROVEN one-sided interior norm asymptotic -- the premise correction: even the upper half is only reduced, not in hand.',
  },
  {
    id: 'imp97054-fitted-quad-is-concave-turnover',
    holds: () =>
      IMP97054_DIRECTION.quadCurvature < 0 &&
      IMP97054_DIRECTION.isConcaveTurnover === true &&
      IMP97054_DIRECTION.turnoverPeakLogN > 15 &&
      Math.abs(IMP97054_DIRECTION.quadCurvature - IMP96912_EXT_FIT.quad.c) < 1e-12,
    why: 'the Route M ceiling model to be rejected is the imp-96912 concave quad in log N with a genuine negative curvature c2=-0.0162 -- it rises, peaks at log N ~ 22.1, then turns over.',
  },
  {
    id: 'imp97054-lower-half-rejects-concave-upper-does-not',
    holds: () =>
      IMP97054_DIRECTION.intModelDecreasingPastPeak === true &&
      IMP97054_DIRECTION.froStillPositivePastPeak === true &&
      IMP97054_DIRECTION.upperRejectsConcaveTurnover === false &&
      IMP97054_DIRECTION.lowerRejectsConcaveTurnover === true &&
      IMP97054_DIRECTION.operativeHalf === 'lower',
    why: 'numeric witness: the fitted Int_model=||G||_F^2 is decreasing while still positive just past the peak, so the concave turnover stays BELOW an upper bound but violates a lower one -- the LOWER half is the operative rejector, the direction imp-96750 does NOT target.',
  },
  {
    id: 'imp97054-lower-half-transfers-rung-free-only-sign-matters',
    holds: () =>
      IMP97054_TRANSFER.sandwichIsTwoSided === true &&
      IMP97054_TRANSFER.regroupingIsIdentity === true &&
      IMP97054_TRANSFER.needsNewNRungs === false &&
      IMP97054_TRANSFER.rejectionNeedsOnlyPositiveSlope === true &&
      Math.abs(IMP97054_TRANSFER.zeta2 - IMP96750_ZETA2) < 1e-12,
    why: 'the imp-96708 H2 sandwich is already two-sided (T<=Int<=zeta(2)T) and the regrouping is an identity, so the lower companion Q(b)>=s0_lo b-O(1) transfers with no new N-rungs; rejection needs only s0_lo>0 (the exact slope s0~1.75 is irrelevant).',
  },
  {
    id: 'imp97054-honesty-gate-no-qed',
    holds: () =>
      IMP97054_VERDICT.anyBoundMoved === false &&
      IMP97054_VERDICT.postsRigorousCeiling === false &&
      IMP97054_VERDICT.qed === false &&
      IMP97054_VERDICT.sharpeningIsCorrectRoute === true &&
      IMP97054_VERDICT.transfersRungFree === true &&
      IMP97054_VERDICT.lowerCompanionEstablished === false &&
      /NO QED/.test(IMP97054_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97054_HONEST_BANNER) &&
      /RH open/.test(IMP97054_HONEST_BANNER) &&
      /lower-companion-cotangent-second-moment/.test(IMP97054_SUBGAP.id),
    why: 'assessment only: the sharpening is the correct rung-free route but does NOT close (premise wrong + lower companion unestablished); no bound moved, no rigorous ceiling posted, honesty markers and the named residual sub-gap present.',
  },
];

for (const a of IMP97054_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97054-route-m-two-sided-norm-rejection-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  premise: IMP97054_PREMISE,
  direction: IMP97054_DIRECTION,
  transfer: IMP97054_TRANSFER,
  obstruction: IMP97054_OBSTRUCTION,
  verdict: IMP97054_VERDICT,
  subGap: IMP97054_SUBGAP,
  banner: IMP97054_HONEST_BANNER,
};
