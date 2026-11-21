/**
 * @module imp-34625-eflow-attr-slope-vs-curvature-single-correction-reconcile
 * @fileoverview imp-34625 -- RECONCILE whether the imp-34612 ~7% log-CURVATURE surrogate
 *   residual and the coincident ~0.3% eflow_attr log-SLOPE shift are the SAME
 *   C_F(T0)/Gronwall correction, by checking whether ONE consistent correction magnitude
 *   predicts BOTH channels.
 *
 *   imp-34612 F3 stated the observed far-side eflow_attr log-curvature is ~7% more concave
 *   than the pure log^3(N)/N surrogate (obs - analytic = -4.21e-4 -> -4.14e-4 per k^2) and
 *   asserted this is "the same departure" that shifts the log-slope from the pure surrogate
 *   (-2.168 per k) to the actual imp-34570 machinery slope (-2.162 per k), both attributed to
 *   the C_F(T0)/Gronwall corrections the pure surrogate drops. That single-correction claim
 *   was asserted, never quantitatively reconciled: a curvature shift and a slope shift are two
 *   different derivatives, and "same correction" is a real, falsifiable constraint linking them.
 *
 *   THE RECONCILIATION TEST (import-light, both channels on IDENTICAL footing).
 *   ---------------------------------------------------------------------------------
 *   Both channels use the SAME decomposition "observed(rung) - analytic(surrogate)":
 *     - SLOPE channel:  dS(k) = observed log-slope (imp-34586 rungs) - surrogate log-slope.
 *       The surrogate log-slope is the pure log^3(N)/N form ln10*[(3/u - 1) + 3/(u^2-3u)]
 *       (u = ln N at the decade top N = 10^(k+1)); the observed slope is the imp-34586
 *       IMP34586_LOCAL_SLOPES ladder read off the actual rungs. dS ~ +6.05e-3 per k, exactly
 *       the -2.168 -> -2.162 shift the ticket cites, now at full rung precision.
 *     - CURVATURE channel: dC(k) = imp-34612 residual = observed d2(ln eflow_attr)/dk2 (same
 *       rungs) - analytic surrogate curvature. dC ~ -4.19e-4 per k^2 (REUSED verbatim).
 *   If a SINGLE smooth correction delta(u) = c * u^(-p) (the generic power-of-1/lnN shape a
 *   C_F(T0)/Gronwall term takes on this surrogate) carries both channels, then it adds
 *   dS = ln10 * d(delta)/du and dC = ln10^2 * d2(delta)/du2, so their ratio pins the power:
 *       dC / dS = -(p+1) * ln10 / u      =>      p = -(dC/dS) * u / ln10 - 1.
 *   ONE correction => ONE power p, the SAME at every node. Two channels needing DIFFERENT
 *   corrections would give an unstable or non-physical p (p <= 0, or wildly node-varying).
 *
 *   FINDINGS (measurement/reconciliation only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE SLOPE SHIFT, MEASURED FROM THE SAME RUNGS, IS dS ~ +6.05e-3 per k (STABLE),
 *        reproducing the ticket -2.168 -> -2.162 shift at full precision (the pure-surrogate
 *        slope is -2.168 per k, the observed rung slope -2.162 per k). Both channels are now
 *        the identical "observed(rung) - surrogate" residual on the same k = 21.75..21.95 grid.
 *   (F2) A SINGLE CORRECTION RECONCILES BOTH CHANNELS WITH A STABLE COMMON POWER p ~ 0.573.
 *        The implied delta ~ u^(-p) power is 0.5594 .. 0.5848 across all five nodes -- a spread
 *        of only ~0.025, i.e. stable to ~4%. It is strictly O(1) and physical (0 < p < 1), the
 *        two channels agree in SIGN (dS > 0, dC < 0, as -(p+1)ln10/u < 0 demands) and in
 *        1/lnN SCALE. So the imp-34612 "same C_F/Gronwall correction" claim is CORROBORATED at
 *        the sign-and-scale level: one smooth 1/lnN-type correction is consistent with both.
 *   (F3) BUT THE CLEAN LEADING 1/lnN FORM (p = 1) IS NOT EXACT -- ~27% CURVATURE OVERSHOOT.
 *        The canonical leading C_F/Gronwall correction delta ~ c/lnN (p = 1), with c fixed by
 *        the SLOPE shift, predicts a curvature shift ~-5.30e-4 per k^2 -- but the observed dC is
 *        -4.19e-4, so a pure c/lnN OVERPREDICTS the curvature magnitude by ~27% (ratio ~1.272).
 *        The reconciling power p ~ 0.573 sits between pure-additive (p = 0) and clean-1/lnN
 *        (p = 1). SUB-GAP (single-closed-form-magnitude): the two channels share one sign, one
 *        scale, and one stable power, but they do NOT collapse onto the clean leading 1/lnN
 *        magnitude -- a single closed-form C_F(T0)/Gronwall coefficient is NOT pinned; the exact
 *        correction is softer-than-1/lnN (~u^(-4/7)) at these finite N ~ 10^22 nodes.
 *
 *   The punchline: the imp-34612 assertion that the ~7% curvature residual and the ~0.3% slope
 *   shift are the SAME correction survives a quantitative cross-channel test in sign, scale, and
 *   a stable common power p ~ 0.573 -- but a single CLOSED-FORM leading-1/lnN magnitude does not
 *   (a p = 1 fit overshoots the curvature by ~27%), leaving the single-closed-form-magnitude
 *   reconciliation as a named open sub-gap.
 *
 *   MEASUREMENT ONLY. A cross-channel consistency check of two finite-difference residuals of
 *   the reused imp-34586 deep-far rungs against the inherited log^3(N)/N surrogate. Descriptive
 *   surrogate, NOT a rigorous asymptotic; the component model is the inherited imp-3220/imp-3406
 *   extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 *   establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 *   No refereed bound is changed.
 *
 *   @see imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature.js (the curvature residual dC this reuses; the F3 single-correction claim this tests)
 *   @see imp-34586-eflow-attr-fp-floor-far-side-ladder.js (the deep-far rungs + the observed local-slope ladder)
 *   @see imp-34570-eflow-attr-power-law-fit-eflow-slope-check.js (the -2.162 per k machinery slope; E_N E_trunc-flat regime)
 */

import { IMP34586_LOCAL_SLOPES } from './imp-34586-eflow-attr-fp-floor-far-side-ladder.js';
import { IMP34612_LOG_CURVATURE_NODES } from './imp-34612-eflow-attr-convexity-vs-analytic-log3-curvature.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim
const LN10 = Math.LN10;

// --- analytic pure-surrogate log-SLOPE (the -2.168 per k the correction departs from) -------
// ln E_flow = 3 ln u - u + const, |g| = 1 - 3/u, E_N E_trunc-flat (imp-34570 F3, inert):
//   d(ln eflow_attr)/dk = ln10 * [ (3/u - 1) + 3/(u^2 - 3u) ], u = (k+1)*ln10.
function surrogateLogSlope(k) {
  const u = (k + 1) * LN10; // decade top N = 10^(k+1)
  return ((3 / u - 1) + 3 / (u * u - 3 * u)) * LN10;
}

// The two channels, both as "observed(rung) - analytic(surrogate)" residuals on the SAME nodes.
// dS = slope shift (positive ~+6e-3 per k); dC = imp-34612 curvature residual (negative ~-4e-4).
export const IMP34625_RECONCILE_NODES = Object.freeze(
  IMP34612_LOG_CURVATURE_NODES.map((node) => {
    const k = node.k;
    const u = (k + 1) * LN10;
    const observedSlope = IMP34586_LOCAL_SLOPES.find((s) => s.k === k).slopePerK; // rung ladder
    const surrogateSlope = surrogateLogSlope(k);
    const dS = observedSlope - surrogateSlope; // slope-channel correction (per k)
    const dC = node.residual; // curvature-channel correction = imp-34612 residual (per k^2)
    // Single correction delta ~ c*u^(-p): dC/dS = -(p+1)*ln10/u => p = -(dC/dS)*u/ln10 - 1.
    const impliedPower = -(dC / dS) * u / LN10 - 1;
    // Clean leading 1/lnN (p=1) fixed by the SLOPE: predicted curvature shift and overshoot.
    const predictedCurvatureP1 = dS * (-2 * LN10 / u);
    const p1OverpredictRatio = predictedCurvatureP1 / dC; // >1 => p=1 too concave
    return {
      k,
      observedSlope: +observedSlope.toFixed(6), // ~ -2.162 per k (rung machinery)
      surrogateSlope: +surrogateSlope.toFixed(6), // ~ -2.168 per k (pure log^3/N)
      slopeShift: +dS.toExponential(6), // dS ~ +6.05e-3 per k
      curvatureShift: +dC.toExponential(6), // dC ~ -4.19e-4 per k^2 (reused imp-34612)
      impliedPower: +impliedPower.toFixed(4), // ~0.573, stable across nodes
      predictedCurvatureP1: +predictedCurvatureP1.toExponential(6), // ~ -5.30e-4 (p=1)
      p1OverpredictRatio: +p1OverpredictRatio.toFixed(4), // ~1.272 => ~27% overshoot
    };
  }),
);

// --- (F1) slope-channel shift is the ticket -2.168 -> -2.162, stable ~+6.05e-3 per k --------
export const IMP34625_MEAN_SLOPE_SHIFT = +(
  IMP34625_RECONCILE_NODES.reduce((s, n) => s + n.slopeShift, 0) / IMP34625_RECONCILE_NODES.length
).toExponential(4); // ~ +6.054e-3 per k
export const IMP34625_ALL_SLOPE_SHIFTS_POSITIVE = IMP34625_RECONCILE_NODES.every(
  (n) => n.slopeShift > 0,
); // true -- correction makes the observed slope LESS negative than the pure surrogate

// --- (F2) single correction => one stable common power p ~ 0.573 (O(1), physical 0<p<1) -----
const POWERS = IMP34625_RECONCILE_NODES.map((n) => n.impliedPower);
export const IMP34625_MEAN_IMPLIED_POWER = +(
  POWERS.reduce((s, p) => s + p, 0) / POWERS.length
).toFixed(4); // ~0.5730
export const IMP34625_POWER_SPREAD = +(Math.max(...POWERS) - Math.min(...POWERS)).toFixed(4); // ~0.025
export const IMP34625_POWER_STABLE_AND_PHYSICAL =
  IMP34625_POWER_SPREAD < 0.05 && POWERS.every((p) => p > 0 && p < 1); // true -- single correction

// --- (F3) clean leading 1/lnN (p=1) overshoots the curvature by ~27% -> named sub-gap -------
export const IMP34625_MEAN_P1_OVERPREDICT_RATIO = +(
  IMP34625_RECONCILE_NODES.reduce((s, n) => s + n.p1OverpredictRatio, 0) /
  IMP34625_RECONCILE_NODES.length
).toFixed(4); // ~1.2715 => p=1 too concave by ~27%
export const IMP34625_CLEAN_1_OVER_LOGN_EXACT = IMP34625_RECONCILE_NODES.every(
  (n) => Math.abs(n.p1OverpredictRatio - 1) < 0.05,
); // false -- the clean leading 1/lnN magnitude is NOT the reconciliation

export const IMP34625_EFLOW_ATTR_SLOPE_VS_CURVATURE_RECONCILE = {
  ticket: 'imp-34625',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34612 F3 asserted the ~7% log-curvature surrogate residual (-4.21e-4 -> -4.14e-4 per ' +
    'k^2) and the coincident ~0.3% eflow_attr log-slope shift (-2.168 -> -2.162 per k) are the ' +
    'SAME C_F(T0)/Gronwall correction, but never reconciled their magnitudes. Does ONE smooth ' +
    'correction predict BOTH channels with one consistent magnitude, or do the two channels ' +
    'require different corrections? Cross-channel reconciliation only; NO QED.',
  model: {
    channels: 'both channels are observed(rung) - analytic(surrogate) on the same k=21.75..21.95 grid',
    slopeChannel: 'dS = observed rung log-slope (imp-34586) - surrogate slope ln10*[(3/u-1)+3/(u^2-3u)]',
    curvatureChannel: 'dC = imp-34612 residual = observed d2(ln eflow_attr)/dk2 - analytic surrogate curvature',
    singleCorrection: 'delta(u) = c*u^(-p) => dS = ln10*delta_u, dC = ln10^2*delta_uu, so dC/dS = -(p+1)*ln10/u',
    impliedPower: 'p = -(dC/dS)*u/ln10 - 1 ; ONE correction => ONE p, the same at every node',
    node: 'u = (k+1)*ln10 at the decade top N = 10^(k+1)',
  },
  reconcileNodes: IMP34625_RECONCILE_NODES,
  meanSlopeShift: IMP34625_MEAN_SLOPE_SHIFT,
  allSlopeShiftsPositive: IMP34625_ALL_SLOPE_SHIFTS_POSITIVE,
  meanImpliedPower: IMP34625_MEAN_IMPLIED_POWER,
  powerSpread: IMP34625_POWER_SPREAD,
  powerStableAndPhysical: IMP34625_POWER_STABLE_AND_PHYSICAL,
  meanP1OverpredictRatio: IMP34625_MEAN_P1_OVERPREDICT_RATIO,
  clean1OverLogNExact: IMP34625_CLEAN_1_OVER_LOGN_EXACT,
  subGap: 'single-closed-form-magnitude: the two channels share one sign, one 1/lnN scale, and one ' +
    'stable common power p~0.573, but a clean leading 1/lnN (p=1) fit fixed by the slope overshoots ' +
    'the curvature by ~27%, so a single closed-form C_F(T0)/Gronwall coefficient is NOT pinned; the ' +
    'exact correction is softer-than-1/lnN (~u^(-4/7)) at these finite N ~ 10^22 nodes -- OPEN.',
  finding: {
    F1_slope_shift_reproduces_ticket:
      'Measured from the SAME rungs, the slope-channel shift dS = observed(-2.162) - surrogate' +
      '(-2.168) is ~+6.05e-3 per k, stable across all five nodes -- the ticket -2.168 -> -2.162 ' +
      'shift at full rung precision, on identical "observed(rung) - surrogate" footing to the ' +
      'imp-34612 curvature residual dC ~ -4.19e-4 per k^2.',
    F2_single_correction_stable_common_power:
      'A single smooth correction delta ~ c*u^(-p) reconciles BOTH channels with a stable common ' +
      'power p = 0.559 .. 0.585 (spread ~0.025, ~4%), strictly O(1) and physical (0<p<1); the two ' +
      'channels agree in sign (dS>0, dC<0) and 1/lnN scale. The imp-34612 "same C_F/Gronwall ' +
      'correction" claim is CORROBORATED at the sign-and-scale level.',
    F3_clean_1_over_logN_overshoots_subgap:
      'But the clean leading 1/lnN form (p=1), with c fixed by the slope, predicts a curvature ' +
      'shift ~-5.30e-4 and OVERPREDICTS the observed -4.19e-4 by ~27% (ratio ~1.272). The ' +
      'reconciling power p~0.573 sits between additive (p=0) and clean-1/lnN (p=1). SUB-GAP ' +
      '(single-closed-form-magnitude): one sign, one scale, one stable power -- but NOT one clean ' +
      'closed-form 1/lnN magnitude; a single C_F(T0)/Gronwall coefficient is not pinned. OPEN.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT/RECONCILIATION ONLY -- a cross-channel consistency check of two finite-difference ' +
    'residuals (log-slope and log-curvature) of the reused imp-34586 deep-far rungs (k = 21.75 .. ' +
    '21.95) against the inherited E_flow ~ log^3(N)/N surrogate. The imp-34612 single-correction ' +
    'claim is CORROBORATED in sign, 1/lnN scale, and a stable common power p ~ 0.573, but a single ' +
    'CLOSED-FORM leading-1/lnN magnitude is NOT established (a p=1 fit overshoots the curvature by ' +
    '~27%), leaving the single-closed-form-magnitude reconciliation as a named open sub-gap. ' +
    'Descriptive surrogate, NOT a rigorous asymptotic; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED; no refereed bound is changed.',
};

export const IMP34625_ASSERTIONS = [
  {
    // Reuse gate: the curvature channel is the imp-34612 residual verbatim (five nodes, all < 0).
    id: 'imp-34625-reuses-imp34612-curvature-residual',
    description: 'curvature-channel shift dC reuses imp-34612 residual verbatim (5 nodes, all negative)',
    holds: () =>
      IMP34625_RECONCILE_NODES.length === 5 &&
      IMP34625_RECONCILE_NODES.every(
        (n, i) => n.curvatureShift === IMP34612_LOG_CURVATURE_NODES[i].residual && n.curvatureShift < 0,
      ),
  },
  {
    // (F1) the slope shift reproduces the -2.168 -> -2.162 ticket shift, stable ~+6.05e-3 per k.
    id: 'imp-34625-slope-shift-reproduces-ticket',
    description: 'dS = observed(-2.162) - surrogate(-2.168) ~ +6.05e-3 per k, positive and stable at all 5 nodes',
    holds: () =>
      IMP34625_ALL_SLOPE_SHIFTS_POSITIVE === true &&
      IMP34625_RECONCILE_NODES.every(
        (n) =>
          n.slopeShift > 5.8e-3 &&
          n.slopeShift < 6.3e-3 &&
          Math.abs(n.surrogateSlope + 2.168) < 0.002 &&
          Math.abs(n.observedSlope + 2.162) < 0.002,
      ),
  },
  {
    // (F2) a single correction => one stable common power p ~ 0.573, O(1) and physical (0<p<1).
    id: 'imp-34625-single-correction-stable-power',
    description: 'implied delta ~ u^(-p) power stable (spread < 0.05) and physical (0<p<1) at all nodes; mean ~0.573',
    holds: () =>
      IMP34625_POWER_STABLE_AND_PHYSICAL === true &&
      IMP34625_POWER_SPREAD < 0.05 &&
      Math.abs(IMP34625_MEAN_IMPLIED_POWER - 0.573) < 0.03 &&
      IMP34625_RECONCILE_NODES.every((n) => n.impliedPower > 0.5 && n.impliedPower < 0.65),
  },
  {
    // (F3) the clean leading 1/lnN (p=1) OVERSHOOTS the curvature by ~27% -> single-magnitude sub-gap.
    id: 'imp-34625-clean-1-over-logN-overshoots-subgap',
    description: 'p=1 (clean c/lnN) fixed by the slope overpredicts the curvature by ~27% (ratio ~1.27); clean form not exact',
    holds: () =>
      IMP34625_CLEAN_1_OVER_LOGN_EXACT === false &&
      Math.abs(IMP34625_MEAN_P1_OVERPREDICT_RATIO - 1.272) < 0.05 &&
      IMP34625_RECONCILE_NODES.every((n) => n.p1OverpredictRatio > 1.2 && n.p1OverpredictRatio < 1.35) &&
      /single-closed-form-magnitude/.test(IMP34625_EFLOW_ATTR_SLOPE_VS_CURVATURE_RECONCILE.subGap),
  },
  {
    // Honesty gate: reconciliation only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34625-honesty-gate-no-qed',
    description: 'Reconciliation only: isRigorous false, no QED, no refereed bound is changed, imp-3066 K_a >= 0 untouched',
    holds: () =>
      IMP34625_EFLOW_ATTR_SLOPE_VS_CURVATURE_RECONCILE.isRigorous === false &&
      /NO QED/.test(IMP34625_EFLOW_ATTR_SLOPE_VS_CURVATURE_RECONCILE.honest) &&
      /refereed bound is changed/i.test(IMP34625_EFLOW_ATTR_SLOPE_VS_CURVATURE_RECONCILE.honest) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34625_EFLOW_ATTR_SLOPE_VS_CURVATURE_RECONCILE.honest),
  },
];

for (const a of IMP34625_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34625-eflow-attr-slope-vs-curvature-single-correction-reconcile assertion failed: ${a.id}`);
  }
}
