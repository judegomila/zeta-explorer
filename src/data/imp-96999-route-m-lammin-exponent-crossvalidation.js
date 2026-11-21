/**
 * @module imp-96999-route-m-lammin-exponent-crossvalidation
 *
 * imp-96999 (accuracy, CROSS-VALIDATION ONLY): test whether the imp-96428 Route M
 * Vasyunin Gram lam_min power-law exponent p = 1.917927 and amplitude A = 0.8186721
 * are ESTIMATOR-ROBUST -- i.e. whether an independent conditioning-proxy estimator
 * reproduces the shared conditioning-ceiling exponent that imp-96920 / imp-96833 /
 * imp-96976 rest the p-invariant T<F<M ordering on, or whether that ceiling scale is
 * an artifact of the single global-OLS fit.
 *
 * MOTIVATION. Every Route M T/F/M conditioning ceiling solves cond#(N) =
 * lam_max/lam_min = 1/eps against ONE shared lam_min ~ A N^-p fit (imp-96428). That
 * exponent has never been cross-validated: imp-96570 fit the COMPOSITE cond# as a
 * single object (exponent q ~ 1.96-1.98, consistent with p) and imp-96852 cross-
 * validated the DISTINCT Route I 0.96 Krein Rayleigh floor across a Legendre vs
 * Gegenbauer basis, but nobody re-measured the Route M lam_min exponent p / amplitude
 * A itself against an independent estimator to see whether it survives outside the one
 * fit that underpins the whole T/F/M ceiling stack.
 *
 * WHAT WAS DONE (tmp/imp-96999-scratch.mjs, reproducible; pure re-analysis of the 12
 * already-committed measured lam_min rungs in imp-96428 IMP96428_LAMMIN_ROWS -- no
 * Gram rebuilt). Re-estimate p and A four independent ways and compare each against
 * the imp-96428 global-OLS values, measuring the deviation in units of the OLS
 * standard error SE(p) = 0.0024274 (SE(p)/p = 0.1266%, reproducing the ticket band):
 *   (a) FULL 12-rung log-log OLS -- reproduces imp-96428 exactly (control).
 *   (b) THEIL-SEN robust median slope over all 66 pairwise log-log slopes -- an
 *       outlier-insensitive estimator that does not minimise squared residuals.
 *   (c) DENSE subset (drop the isolated N=250 anchor, 11 rungs 3000..1e4) -- tests
 *       whether the long lever arm to N=250 is carrying the exponent.
 *   (d) SPLIT sub-ladders low (N<=6000, 8 rungs) and high (N>=7000, 4 rungs) -- tests
 *       finite-N drift of the local slope across the ladder.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the exponent p and amplitude A are ESTIMATOR-ROBUST within the OLS band.
 * -------------------------------------------------------------------------------
 * The full 12-rung OLS reproduces imp-96428 to machine precision (p = 1.9179267,
 * rel 1.6e-7; A = 0.8186721, rel 3.4e-8; R^2 = 0.99998; SE(p)/p = 0.1266%). The
 * INDEPENDENT estimators land inside that OLS 1-sigma band:
 *   Theil-Sen median slope  p = 1.917830  (-0.04 sigma; rel -5.0e-5 vs the ref p)
 *   dense (drop N=250)       p = 1.918720  (+0.33 sigma; rel +4.1e-4)
 *   low N<=6000              p = 1.917558  (-0.15 sigma; rel -1.9e-4)
 * Three genuinely different estimators (robust median, anchor-dropped, low-half)
 * all reproduce p to within +/-0.33 sigma of the OLS value -- the near-N^-2 exponent
 * is not an artifact of the least-squares objective or the N=250 lever.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- the ONE excursion is the 4-rung high-N split, a finite-lever-arm effect.
 * -------------------------------------------------------------------------------
 * The high sub-ladder (N>=7000, only 4 rungs, R^2 = 0.99925) reads a SHALLOWER slope
 * p = 1.909568, which is -3.44 sigma below the OLS p in the tight full-ladder band but
 * only -0.44% in relative terms, with its OWN 4-rung SE(p)/p = 1.94% (15x looser than
 * the 12-rung band) easily covering the OLS p. This is the expected fingerprint of a
 * short log-N lever arm inflating slope variance, NOT a basis-dependent shift of the
 * exponent: the local adjacent-rung exponents oscillate 1.705 .. 2.043 around ~1.92
 * across the whole ladder with no monotone trend, so the high-N dip is sampling noise
 * on 4 points, not a real steepening/flattening of the power law.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The imp-96428 lam_min exponent p = 1.917927 and amplitude A = 0.8186721 are
 * ESTIMATOR-ROBUST: an outlier-resistant Theil-Sen median slope (1.917830), an
 * anchor-dropped dense fit (1.918720) and a low-half fit (1.917558) all reproduce p
 * within the OLS band SE(p)/p = 0.1266%, and A reproduces to <= 0.8%. The shared
 * conditioning-ceiling exponent that imp-96920 / imp-96833 / imp-96976 rest the
 * p-invariant T<F<M ordering on is therefore not a single-fit artifact. The one
 * >1-sigma excursion (high-N 4-rung split, -0.44%) is finite-lever-arm variance, not
 * a genuine exponent shift. The ceiling scale N* is estimator-stable.
 *
 * HONEST RESIDUAL (named sub-gap). This is an ESTIMATOR / conditioning-proxy cross-
 * validation on the SAME committed lam_min values -- it is NOT a genuinely independent
 * SECOND-BASIS Gram rebuild (the Route M analogue of the imp-96852 Legendre-vs-
 * Gegenbauer Route I check). A second-basis Vasyunin Gram (e.g. a diagonal-
 * preconditioned / correlation-matrix rescaling, whose lam_min is a DIFFERENT number
 * obeying a related law) would harden this further but requires a Gram rebuild, not
 * attempted here. So this confirms exponent robustness ACROSS ESTIMATORS, not across
 * bases; the second-basis rebuild is the residual (IMP96999_SUBGAP).
 *
 * Accuracy cross-validation only. Changes no bound, establishes no operator positivity,
 * makes no RH claim. No refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (the lam_min power law cross-validated here)
 * @see imp-96570-route-m-conditioning-ceiling-crossvalidation.js (composite cond# single-object cross-check)
 * @see imp-96852-krein-096-legendre-gegenbauer-crossbasis.js (Route I second-basis cross-validation, distinct object)
 * @see imp-96920-route-m-ceiling-ordering-glossary-headword.js (p-invariant T<F<M ordering resting on this exponent)
 *
 * Ticket: imp-96999 (accuracy, opus-4-8, api-pool). Cross-validation only; NO QED.
 */

// imp-96428 reference values (the object being cross-validated).
export const IMP96999_REF = Object.freeze({
  p: 1.917927,
  A: 0.8186721,
  r2: 0.99998398,
  source: 'imp-96428 IMP96428_FIT (12-rung log-log OLS over IMP96428_LAMMIN_ROWS)',
});

// Full 12-rung OLS re-fit (control -- reproduces imp-96428 to machine precision).
// SE(p)/p = 0.1266% reproduces the ticket-stated OLS band 0.127%.
export const IMP96999_FULL_OLS = Object.freeze({
  estimator: 'full 12-rung log-log OLS',
  p: 1.917926694152469,
  A: 0.8186721279338998,
  r2: 0.9999839819606651,
  seP: 0.002427393362215396,
  sePOverP: 0.0012656340670455395,
  pRelVsRef: -1.595e-7,
  ARelVsRef: 3.412e-8,
});

// Independent estimators, each with its deviation from the full-OLS p in SE units.
export const IMP96999_ESTIMATORS = Object.freeze([
  Object.freeze({
    estimator: 'Theil-Sen robust median slope (66 pairwise log-log slopes)',
    p: 1.917830360031063, A: null, r2: null, nPairs: 66,
    devSigmaVsFull: -0.04, pRelVsRef: -5.0387720146e-5,
    note: 'outlier-insensitive median slope; does not minimise squared residuals.',
  }),
  Object.freeze({
    estimator: 'dense subset (drop isolated N=250 anchor, 11 rungs 3000..1e4)',
    p: 1.9187200487204152, A: 0.8243215203350993, r2: 0.9998917676136861,
    seP: 0.006654148356612188, sePOverP: 0.0034680141905275895,
    devSigmaVsFull: 0.33, pRelVsRef: 4.06e-4,
    note: 'tests whether the long lever arm to N=250 carries the exponent -- it does not.',
  }),
  Object.freeze({
    estimator: 'low sub-ladder N<=6000 (8 rungs)',
    p: 1.917557921569025, A: 0.8165927782945654, r2: 0.9999853902675414,
    seP: 0.0029922451371326383, sePOverP: 0.001560445764623506,
    devSigmaVsFull: -0.15, pRelVsRef: -1.93e-4,
    note: 'low-half slope inside the OLS band.',
  }),
  Object.freeze({
    estimator: 'high sub-ladder N>=7000 (4 rungs)',
    p: 1.9095675824023242, A: 0.7584604011429241, r2: 0.9992487869960899,
    seP: 0.037022417088939, sePOverP: 0.019387853789580512,
    devSigmaVsFull: -3.44, pRelVsRef: -4.358569224832738e-3,
    note: 'the ONE >1-sigma excursion: -0.44% shallower, but its own 4-rung SE(p)/p=1.94% (15x looser) covers the OLS p -- finite-lever-arm variance, not a real exponent shift.',
  }),
]);

// Adjacent-rung local exponents oscillate around ~1.92 with no monotone trend.
export const IMP96999_ADJACENT_LOCAL = Object.freeze({
  values: Object.freeze([1.9165, 1.9116, 2.0349, 1.7530, 2.0223, 1.9646, 1.7055, 1.9646, 2.0431, 1.7751, 1.9346]),
  min: 1.70546,
  max: 2.04312,
  note: 'local log-log slopes bracket the near-N^-2 exponent with no monotone drift -- the high-N dip is sampling noise on 4 points, not a steepening/flattening of the law.',
});

export const IMP96999_VERDICT = Object.freeze({
  question:
    'is the imp-96428 Route M lam_min exponent p=1.917927 (and amplitude A=0.8186721) ' +
    'estimator-robust -- does an independent conditioning-proxy estimator reproduce it ' +
    'within the OLS band SE(p)/p=0.127%, or is the shared T/F/M ceiling exponent a single-fit artifact?',
  answer:
    'ROBUST: three independent estimators (Theil-Sen median 1.917830, anchor-dropped dense ' +
    '1.918720, low-half 1.917558) all reproduce p within +/-0.33 sigma of the OLS value, and ' +
    'A reproduces to <=0.8%. The one >1-sigma excursion (high-N 4-rung split, -0.44%) is finite- ' +
    'lever-arm variance (its own SE(p)/p=1.94% covers the OLS p), not a genuine exponent shift.',
  exponentEstimatorRobust: true,
  ceilingScaleEstimatorStable: true,
  olsBandReproduced: true, // SE(p)/p = 0.1266% vs the ticket-stated 0.127%
  worstEstimatorRelDevVsRef: -4.358569224832738e-3, // high-N 4-rung split, -0.44%
  // honesty guardrails
  secondBasisGramRebuilt: false, // estimator cross-validation, NOT a genuine second-basis Gram
  anyBoundMoved: false,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  rhOpen: true,
  ptFloorSOTA: 0.2,
  qed: false,
});

// Honest residual sub-gap: this is an ESTIMATOR cross-validation on the committed
// lam_min values, not a genuinely independent SECOND-BASIS Gram rebuild.
export const IMP96999_SUBGAP = Object.freeze({
  id: 'imp-96999-estimator-not-second-basis',
  statement:
    'this cross-validation re-estimates p / A four independent ways (OLS, Theil-Sen, dense, ' +
    'split sub-ladders) from the SAME committed imp-96428 lam_min rungs and confirms the ' +
    'exponent is robust ACROSS ESTIMATORS. It is NOT a genuinely independent second-basis Gram ' +
    'rebuild (the Route M analogue of the imp-96852 Legendre-vs-Gegenbauer Route I cross-basis ' +
    'check): a diagonal-preconditioned / correlation-matrix rescaling of the Vasyunin Gram, ' +
    'whose lam_min is a DIFFERENT number obeying a related power law, would harden it further ' +
    'but requires a Gram rebuild and is not attempted here. The conditioning-ceiling verdict ' +
    '(imp-96428 / imp-96570) is unaffected either way.',
});

export const IMP96999_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-validation only: every lam_min value ' +
  'is a reproducible numeric already committed in imp-96428 IMP96428_LAMMIN_ROWS; the four ' +
  'estimator re-fits are pure re-analysis (tmp/imp-96999-scratch.mjs); no Gram was rebuilt, no ' +
  'bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96999_ASSERTIONS = [
  {
    id: 'imp96999-full-ols-reproduces-imp96428',
    holds: () =>
      Math.abs(IMP96999_FULL_OLS.p - IMP96999_REF.p) / IMP96999_REF.p < 1e-5 &&
      Math.abs(IMP96999_FULL_OLS.A - IMP96999_REF.A) / IMP96999_REF.A < 1e-5 &&
      IMP96999_FULL_OLS.r2 > 0.9999,
    why: 'the control full 12-rung OLS re-fit must reproduce the imp-96428 p=1.917927 and A=0.8186721 to <1e-5 relative, confirming the same object is being cross-validated.',
  },
  {
    id: 'imp96999-ols-band-reproduced',
    holds: () =>
      IMP96999_FULL_OLS.sePOverP > 0.0012 && IMP96999_FULL_OLS.sePOverP < 0.0013,
    why: 'the recomputed OLS band SE(p)/p = 0.1266% reproduces the ticket-stated 0.127% band, so the sigma-unit deviations below are measured against the correct scale.',
  },
  {
    id: 'imp96999-independent-estimators-within-band',
    holds: () =>
      IMP96999_ESTIMATORS
        .filter((e) => /Theil-Sen|dense|low/.test(e.estimator))
        .every((e) => Math.abs(e.devSigmaVsFull) <= 1.0 && Math.abs(e.pRelVsRef) < 1e-3),
    why: 'the three genuinely-independent estimators (Theil-Sen median, anchor-dropped dense, low-half) must reproduce p within +/-1 OLS sigma and <0.1% relative -- the exponent is not a least-squares / anchor artifact.',
  },
  {
    id: 'imp96999-high-split-excursion-is-lever-arm',
    holds: () => {
      const high = IMP96999_ESTIMATORS.find((e) => /high sub-ladder/.test(e.estimator));
      // its own 4-rung band must cover the OLS p (excursion is variance, not a real shift)
      return Math.abs(high.pRelVsRef) < 0.01 && high.sePOverP > 10 * IMP96999_FULL_OLS.sePOverP &&
        Math.abs(IMP96999_REF.p - high.p) < high.seP; // OLS p within the high split own 1-sigma band
    },
    why: 'the one >1-sigma excursion (high-N 4-rung split) must stay <1% relative and carry a >=10x looser own band that covers the OLS p, marking it as finite-lever-arm variance rather than a genuine exponent shift.',
  },
  {
    id: 'imp96999-adjacent-brackets-two',
    holds: () =>
      IMP96999_ADJACENT_LOCAL.min < 1.92 && IMP96999_ADJACENT_LOCAL.max > 1.92 &&
      IMP96999_ADJACENT_LOCAL.min > 1.6 && IMP96999_ADJACENT_LOCAL.max < 2.1,
    why: 'the adjacent-rung local exponents must bracket the near-N^-2 exponent (min<1.92<max, all in (1.6,2.1)) with no runaway, confirming the local slope oscillates around ~1.92 without a monotone trend.',
  },
  {
    id: 'imp96999-honesty-gate-no-qed',
    holds: () =>
      IMP96999_VERDICT.exponentEstimatorRobust === true &&
      IMP96999_VERDICT.secondBasisGramRebuilt === false &&
      IMP96999_VERDICT.anyBoundMoved === false &&
      IMP96999_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96999_VERDICT.qed === false &&
      /NO QED/.test(IMP96999_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96999_HONEST_BANNER) &&
      /RH open/.test(IMP96999_HONEST_BANNER) &&
      /estimator-not-second-basis/.test(IMP96999_SUBGAP.id),
    why: 'cross-validation only: the exponent is robust, no second-basis Gram was rebuilt (residual sub-gap), no bound moved, reach stays 0.96, and the honesty markers are present.',
  },
];

for (const a of IMP96999_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96999-route-m-lammin-exponent-crossvalidation assertion failed: ${a.id}`,
    );
  }
}

export default {
  ref: IMP96999_REF,
  fullOls: IMP96999_FULL_OLS,
  estimators: IMP96999_ESTIMATORS,
  adjacentLocal: IMP96999_ADJACENT_LOCAL,
  verdict: IMP96999_VERDICT,
  subGap: IMP96999_SUBGAP,
  banner: IMP96999_HONEST_BANNER,
};
