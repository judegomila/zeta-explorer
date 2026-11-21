/**
 * @module imp-35983-flattest-vs-inflection-knees-distinct-honest-status
 * @fileoverview imp-35983 -- standalone HONEST-STATUS note (imp-35789-style banner pattern)
 *   recording the imp-35891 finding that the imp-35853 required-height-multiple "flattest
 *   point" (sigma ~ 0.407, mid-downslope minimum of |d multiple / d sigma|) and the imp-33701
 *   sigma-decay-exponent "inflection" (the second-difference sign change of the per-decade
 *   local decay exponent, placed in [1e10,1e11]) are DISTINCT features of the sigma
 *   post-peak downslope, NOT one height under two names. Read-only note: imports the
 *   imp-35891 module verbatim (no re-derivation, no new numerics) and states the conclusion
 *   plainly for a reader who lands on this ticket without having read imp-35891 in full: the
 *   two knees are off by roughly one decade in N (imp-35853 flattest point at N ~ 7.21e9,
 *   decade [1e9,1e10]; imp-33701 inflection in decade [1e10,1e11]), yet ADJACENT --
 *   jointly bracketing the same two-decade [1e9,1e11] downslope window rather than agreeing
 *   on a point.
 *
 *   Ticket: imp-35983 (content, low). Note only; re-reads nothing new; changes no bound;
 *   C_mb GUE-conditional (imp-486) untouched; imp-35337a stays OPEN; no refereed bound is changed
 *   ; NO QED.
 *
 *   @see imp-35891-flattest-point-vs-sigmoid-knee-crosslocation.js (source module this note restates)
 *   @see imp-35853-req4-required-height-continuous-sigma-knee.js (flattest-point locator, sigma ~ 0.407)
 *   @see imp-33701-sigma-postpeak-ramp-curvature-inflection.js (exponent-ramp inflection, [1e10,1e11])
 *   @see imp-35959-flattest-vs-inflection-decade-offset-viz-data.js (viz-data presentation of the same markers)
 *   @see imp-35789-w2-ingredients-greenfield-honest-status-banner.js (the banner pattern this note follows)
 */

import { IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION } from './imp-35891-flattest-point-vs-sigmoid-knee-crosslocation.js';

const SRC = IMP35891_FLATTEST_POINT_VS_SIGMOID_KNEE_CROSSLOCATION;

export const IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS = Object.freeze({
  id: 'imp-35983',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: the imp-35853 flattest-point knee and the imp-33701 sigmoid-inflection ' +
    'knee are DISTINCT features of the sigma downslope -- off by ~1 decade in N, not one height ' +
    'under two names',
  sourceModule: 'imp-35891-flattest-point-vs-sigmoid-knee-crosslocation.js',

  flattestPoint: Object.freeze({
    sigma: SRC.flattestPointSigma,
    N: SRC.flattestPointN,
    log10N: SRC.flattestPointLog10N,
    decade: SRC.flattestPointDecade,
  }),
  inflection: Object.freeze({
    decade: SRC.imp33701InflectionDecade,
    steepestStepDecade: SRC.imp33701SteepestStepDecade,
  }),
  coincide: SRC.coincide,
  decadeOffset: SRC.decadeOffset,
  sharedWindow: Object.freeze({ log10_lo: 9, log10_hi: 11 }),

  conclusion:
    'The imp-35891 cross-location shows the imp-35853 required-height-multiple flattest point ' +
    '(sigma ~ 0.407) and the imp-33701 sigma-decay-exponent inflection ([1e10,1e11]) do NOT ' +
    'coincide -- they are DISTINCT features of the downslope, off by roughly ONE decade in N. ' +
    'The flattest point maps to N ~ 7.20e9 (decade [1e9,1e10]), one decade below the inflection ' +
    'decade. But they are ADJACENT: the flattest-point N sits at the top edge of [1e9,1e10], ' +
    'exactly the lower boundary of the imp-33701 steepest-ramp step, so the two markers jointly ' +
    'BRACKET the same two-decade [1e9,1e11] downslope window rather than agreeing on a point. ' +
    'The disagreement is expected -- the two knees measure different curves (flatness of the ' +
    'required-height multiple in sigma vs curvature of the sigma decay exponent in N).',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    isOneHeightTwoNames: false,
    changesAnyBound: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-35891: the imp-35853 flattest-point knee (sigma ~ 0.407, ' +
    'N ~ 7.20e9, decade [1e9,1e10]) and the imp-33701 sigmoid-inflection knee (decade [1e10,1e11]) ' +
    'are DISTINCT, off by ~1 decade -- NOT one height under two names -- yet ADJACENT, jointly ' +
    'bracketing the shared [1e9,1e11] downslope window. Cross-validation/measurement only; ' +
    'changes no bound; C_mb GUE-conditional (imp-486) untouched; imp-35337a stays OPEN; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
});

export const IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp35983-knees-do-not-coincide',
    why: 'The core claim of this note must match the imp-35891 source verdict: the two knees do not coincide.',
    holds: () =>
      IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.coincide === false &&
      SRC.coincide === false,
  },
  {
    id: 'imp35983-decade-offset-is-one',
    why: 'The recorded decade offset between the two knees must be exactly 1, matching the imp-35891 source.',
    holds: () =>
      IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.decadeOffset === 1 &&
      SRC.decadeOffset === 1,
  },
  {
    id: 'imp35983-flattest-point-matches-source',
    why: 'The recorded flattest-point marker must match the imp-35891 source literal (sigma ~0.407, decade [1e9,1e10]).',
    holds: () => {
      const fp = IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.flattestPoint;
      return (
        Math.abs(fp.sigma - 0.407) < 1e-2 &&
        fp.decade === '1e9->1e10' &&
        fp.log10N > 9.5 && fp.log10N < 10.0
      );
    },
  },
  {
    id: 'imp35983-inflection-matches-source',
    why: 'The recorded inflection decade must match the imp-35891 source literal ([1e10,1e11]).',
    holds: () =>
      IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.inflection.decade === '1e10->1e11',
  },
  {
    id: 'imp35983-conclusion-mentions-bracketing',
    why: 'The conclusion text must plainly state the two markers bracket the shared window rather than agreeing on a point.',
    holds: () =>
      /BRACKET the same two-decade \[1e9,1e11\]/.test(
        IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.conclusion,
      ),
  },
  {
    id: 'imp35983-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim a proof, a coincidence, or a bound change.',
    holds: () =>
      IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.honestCaveat.isOneHeightTwoNames === false &&
      IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp35983-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35983-flattest-vs-inflection-knees-distinct-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP35983_FLATTEST_VS_INFLECTION_KNEES_DISTINCT_HONEST_STATUS;
