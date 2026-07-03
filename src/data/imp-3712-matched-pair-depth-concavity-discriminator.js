/**
 * @module imp-3712-matched-pair-depth-concavity-discriminator
 * @fileoverview imp-3712 -- a SECOND-DIFFERENCE / STEP-RATIO concavity discriminator
 *   on the imp-3663 matched-pair Krylov lock depths m*(N)=360/480/560 (fixed
 *   lambda_5=lambda_6 third pair, N in {1600,2000,2400}), INDEPENDENT of the
 *   imp-3663 least-squares RMS ranking and requiring NO new Lanczos runs.
 *
 *   MOTIVATION
 *   ----------
 *   imp-3663 obtained the fixed-pair anchor triple m*(1600)=360, m*(2000)=480,
 *   m*(2400)=560, ruled out a LINEAR depth law (the equal-Delta-N steps 120 then
 *   80 decelerate), but left LOG-vs-SQRT UNDISCRIMINATED: the three-anchor RMS
 *   gap (~2.4 units) sat below the +/-20 sub-depth grid uncertainty
 *   (sg-3663-log-vs-sqrt-fixed-pair). imp-3686 later added a fourth N=2800 anchor
 *   (m*(2800)=620) on a refined 20-step grid and PREFERRED log. This module is a
 *   DISTINCT metric on the ORIGINAL three anchors: rather than an RMS fit, it
 *   compares the observed second-difference step ratio to the ratios the two
 *   candidate smooth laws predict, and propagates the +/-20 grid noise into that
 *   ratio to state how much (in sigma) the metric can separate them.
 *
 *   THE METRIC
 *   ----------
 *   With equal N spacing (Delta N = 400) the two consecutive depth increments are
 *   dm_lo = 480-360 = 120 and dm_hi = 560-480 = 80, so the observed step ratio is
 *   R_obs = dm_hi/dm_lo = 80/120 = 0.6667. A concave law m*(N) = A + B f(N) with a
 *   monotone increasing concave f predicts, at these N, the ratio
 *   R_pred = [f(2400)-f(2000)] / [f(2000)-f(1600)] (the B and A cancel), so:
 *     LOG  form f=ln N :  R_log  = ln(2400/2000)/ln(2000/1600) = 0.81706
 *     SQRT form f=sqrt N: R_sqrt = (sqrt2400-sqrt2000)/(sqrt2000-sqrt1600) = 0.90407
 *   The log law is MORE concave (smaller ratio) than the sqrt law, as expected.
 *
 *   NOISE PROPAGATION
 *   -----------------
 *   Each m* is grid-quantised to +/-20 (half the 40-step sub-depth grid). Treating
 *   the three anchors as independent with sigma_m = 20 and R = (m3-m2)/(m2-m1),
 *   the standard first-order propagation
 *     sigma_R^2 = sigma_m^2 [ (dR_dm1)^2 + (dR_dm2)^2 + (dR_dm3)^2 ],
 *     dR_dm1 = s2/s1^2, dR_dm2 = -(s1+s2)/s1^2, dR_dm3 = 1/s1  (s1=120, s2=80)
 *   gives sigma_R = 0.3425. So R_obs = 0.6667 +/- 0.3425.
 *
 *   FINDING
 *   -------
 *   (1) THE STEP-RATIO METRIC FAVOURS LOG. R_obs = 0.6667 is NEARER the log
 *       prediction (0.81706, |gap| 0.1504 = 0.44 sigma) than the sqrt prediction
 *       (0.90407, |gap| 0.2374 = 0.69 sigma). This is an INDEPENDENT corroboration
 *       of the imp-3663 RMS ranking (log < sqrt) via a distinct metric.
 *   (2) BUT IT DOES NOT DISCRIMINATE AT THE +/-20 GRID. Both predicted ratios sit
 *       WITHIN ~0.7 sigma of R_obs, and the two predictions are separated by only
 *       0.087 = 0.25 sigma. A metric that cannot resolve a 0.25-sigma gap cannot
 *       select between the two laws -- exactly the imp-3663 verdict, reproduced by
 *       a second-difference argument that never fits a slope. sg-3663-log-vs-sqrt-
 *       fixed-pair is CONFIRMED open at three anchors; the imp-3686 fourth anchor
 *       (halved to +/-10 quantisation) was genuinely required to prefer log.
 *   (3) R_obs IS STEEPER THAN EITHER LAW. R_obs = 0.667 lies BELOW both R_log and
 *       R_sqrt (both < 1), i.e. the discrete deceleration is at least as concave as
 *       log and possibly steeper -- consistent with imp-3686's named residual
 *       sg-3686-steeper-than-log-fixed-pair. Within the +/-20 noise this steepening
 *       is not significant (0.44 sigma below log), so no new sub-gap is opened here.
 *
 *   @see imp-3663-matched-pair-krylov-depth-sweep.js (the m*=360/480/560 triple; anchors IMPORTED here, not re-baked)
 *   @see imp-3686-n2800-refined-anchor-log-vs-sqrt.js (the fourth N=2800 anchor that preferred log)
 *
 *   Ticket: imp-3712 (numerical, medium). MEASUREMENT/ARITHMETIC only: a distinct
 *   concavity discriminator on the EXISTING anchors, no new Lanczos runs, no new
 *   compute. Does NOT construct the missing magnitude and does NOT attempt the
 *   imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. NO RH verdict, NO QED.
 *   Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 */

import { IMP3663_MATCHED_PAIR_KRYLOV_DEPTH_SWEEP } from './imp-3663-matched-pair-krylov-depth-sweep.js';

// --- pull the fixed-pair anchor triple from imp-3663 (IMPORTED, not re-baked) -------
const ANCHORS = IMP3663_MATCHED_PAIR_KRYLOV_DEPTH_SWEEP.measured.matchedAnchors;
const N = ANCHORS.map((a) => a.N); // [1600, 2000, 2400]
const M = ANCHORS.map((a) => a.mStar); // [360, 480, 560]

const GRID_HALF_STEP = 20; // +/-20 = half the 40-step sub-depth grid (imp-3663 quantisation)

// --- observed second difference and step ratio --------------------------------------
const dm_lo = M[1] - M[0]; // 120
const dm_hi = M[2] - M[1]; // 80
const secondDifference = dm_hi - dm_lo; // -40 (negative -> concave)
const rObs = dm_hi / dm_lo; // 0.6667

// --- step ratios the two candidate smooth laws predict at these N (A,B cancel) -------
//     R_pred = [f(N3)-f(N2)] / [f(N2)-f(N1)] for m* = A + B f(N).
const rLog = Math.log(N[2] / N[1]) / Math.log(N[1] / N[0]); // 0.81706
const rSqrt =
  (Math.sqrt(N[2]) - Math.sqrt(N[1])) / (Math.sqrt(N[1]) - Math.sqrt(N[0])); // 0.90407

// --- first-order propagation of the +/-20 grid noise into R = (m3-m2)/(m2-m1) --------
const s1 = dm_lo;
const s2 = dm_hi;
const dR_dm1 = s2 / (s1 * s1); // step2/step1^2
const dR_dm2 = -(s1 + s2) / (s1 * s1); // -(step1+step2)/step1^2
const dR_dm3 = 1 / s1; // 1/step1
const sigmaR = Math.sqrt(
  GRID_HALF_STEP * GRID_HALF_STEP * (dR_dm1 * dR_dm1 + dR_dm2 * dR_dm2 + dR_dm3 * dR_dm3),
); // 0.3425

// --- separations, in absolute ratio units and in sigma_R ----------------------------
const gapLog = Math.abs(rObs - rLog); // 0.1504
const gapSqrt = Math.abs(rObs - rSqrt); // 0.2374
const gapLogSigma = gapLog / sigmaR; // 0.44
const gapSqrtSigma = gapSqrt / sigmaR; // 0.69
const lawSeparation = Math.abs(rSqrt - rLog); // 0.0870
const lawSeparationSigma = lawSeparation / sigmaR; // 0.25

// --- verdicts -----------------------------------------------------------------------
const growthIsConcave = secondDifference < 0; // -40 < 0
const logMoreConcaveThanSqrt = rLog < rSqrt; // log law is the more concave prediction
const favoursLog = gapLog < gapSqrt; // R_obs nearer log
const rObsSteeperThanBoth = rObs < rLog && rObs < rSqrt; // steeper deceleration than either law
const bothWithinOneSigma = gapLogSigma < 1 && gapSqrtSigma < 1; // metric cannot exclude either
const notDiscriminatedAtGrid = lawSeparationSigma < 1; // law gap below the noise -> undiscriminated

const verdict =
  growthIsConcave &&
  logMoreConcaveThanSqrt &&
  favoursLog &&
  bothWithinOneSigma &&
  notDiscriminatedAtGrid
    ? 'STEP-RATIO-CONCAVITY-METRIC-ON-THE-imp-3663-ANCHORS-360/480/560:-R_obs=0.6667-(steps-120-then-80)-FAVOURS-LOG-(|gap|-0.44-sigma)-OVER-SQRT-(0.69-sigma)-BUT-DOES-NOT-DISCRIMINATE-(the-two-law-ratios-0.817-vs-0.904-are-0.25-sigma-apart,-below-the-+/-20-grid-noise-sigma_R=0.34);-INDEPENDENT-CORROBORATION-OF-THE-imp-3663-RMS-RANKING-AND-OF-sg-3663-log-vs-sqrt-fixed-pair-STAYING-OPEN-AT-THREE-ANCHORS-(imp-3686-FOURTH-N=2800-ANCHOR-REQUIRED-TO-PREFER-LOG)'
    : 'INDETERMINATE';

export const IMP3712_MATCHED_PAIR_DEPTH_CONCAVITY_DISCRIMINATOR = Object.freeze({
  id: 'imp-3712-matched-pair-depth-concavity-discriminator',
  ticket: 'imp-3712',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSections: ['§25', '§26', '§27'],
  buildsOn: 'imp-3663-matched-pair-krylov-depth-sweep.js',
  relatedSubGap: 'sg-3663-log-vs-sqrt-fixed-pair',

  summary:
    'A DISTINCT second-difference / step-ratio concavity discriminator on the imp-3663 fixed-pair Krylov lock-depth ' +
    'triple m*(1600)=360, m*(2000)=480, m*(2400)=560 (lambda_5=lambda_6 third pair), INDEPENDENT of the imp-3663 ' +
    'least-squares RMS ranking and requiring NO new Lanczos runs. With equal N spacing (Delta N=400) the two depth ' +
    'increments 120 then 80 give an observed step ratio R_obs=80/120=0.6667. A concave law m*=A+B f(N) predicts, at ' +
    'these N, R_pred=[f(2400)-f(2000)]/[f(2000)-f(1600)] (A,B cancel): the LOG form (f=ln N) predicts 0.81706, the ' +
    'SQRT form (f=sqrt N) predicts 0.90407, so log is the more concave prediction. Propagating the +/-20 grid ' +
    'quantisation through R=(m3-m2)/(m2-m1) gives sigma_R=0.3425. FINDINGS: (i) R_obs is NEARER log (|gap|=0.1504= ' +
    '0.44 sigma) than sqrt (|gap|=0.2374=0.69 sigma), so the metric FAVOURS log -- an independent corroboration of ' +
    'the imp-3663 RMS ordering via a distinct statistic; (ii) it does NOT DISCRIMINATE at this grid: both predicted ' +
    'ratios sit within ~0.7 sigma of R_obs and the two predictions are separated by only 0.087=0.25 sigma, so a ' +
    'metric that cannot resolve 0.25 sigma cannot select the law -- sg-3663-log-vs-sqrt-fixed-pair is CONFIRMED open ' +
    'at three anchors, exactly as imp-3663 found, and the imp-3686 fourth N=2800 anchor (halved to +/-10) was ' +
    'genuinely required to prefer log; (iii) R_obs=0.667 lies BELOW both law ratios, i.e. the discrete deceleration ' +
    'is at least as concave as log and possibly steeper (consistent with sg-3686-steeper-than-log-fixed-pair), though ' +
    'the 0.44-sigma steepening is not significant at +/-20. Arithmetic on the EXISTING anchors only; no new compute; ' +
    'does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity; RH-EQUIVALENT; ' +
    'NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    quantityMeasured: 'observed step ratio R_obs = dm_hi/dm_lo of the imp-3663 fixed-pair lock depths, versus the ratios the log and sqrt laws predict at N in {1600,2000,2400}',
    metricIsIndependentOf: 'the imp-3663 three-point least-squares RMS ranking (this uses a second-difference/step-ratio statistic, not a fitted slope)',
    anchorsImportedFrom: 'imp-3663-matched-pair-krylov-depth-sweep.js measured.matchedAnchors (m*=360/480/560); NOT re-baked',
    ratioPredictionFormula: 'for m*=A+B f(N), R_pred=[f(N3)-f(N2)]/[f(N2)-f(N1)] (A and B cancel), so R depends only on the functional form',
    noisePropagation: 'first-order: sigma_R^2 = sigma_m^2 [ (s2/s1^2)^2 + ((s1+s2)/s1^2)^2 + (1/s1)^2 ], sigma_m=20, s1=120, s2=80',
    requiresNoNewCompute: true,
    selfComputing: true,
  }),

  measured: Object.freeze({
    N,
    mStar: M,
    dm_lo, // 120
    dm_hi, // 80
    secondDifference, // -40 (concave)
    rObs, // 0.6667
    rLog, // 0.81706
    rSqrt, // 0.90407
    gridHalfStep: GRID_HALF_STEP, // 20
    sigmaR, // 0.3425
    gapLog, // 0.1504
    gapSqrt, // 0.2374
    gapLogSigma, // 0.44
    gapSqrtSigma, // 0.69
    lawSeparation, // 0.0870
    lawSeparationSigma, // 0.25
    growthIsConcave, // true
    logMoreConcaveThanSqrt, // true
    favoursLog, // true
    rObsSteeperThanBoth, // true
    bothWithinOneSigma, // true
    notDiscriminatedAtGrid, // true
    verdict,
  }),

  interpretation: Object.freeze({
    distinctFromRmsRanking:
      'imp-3663 ranked the laws by three-point least-squares RMS (log~4.7 < sqrt~7.1 < linear~9.4). This module never ' +
      'fits a slope: it compares the OBSERVED step ratio 80/120 to the ratio each smooth concave law forces at these ' +
      'N. That the two statistics AGREE (both favour log, neither separates it from sqrt) is a genuine cross-check.',
    favoursLogButCannotSeparate:
      'R_obs=0.6667 is closer to the log ratio 0.81706 (0.44 sigma) than the sqrt ratio 0.90407 (0.69 sigma), so the ' +
      'metric points at log; but the log and sqrt ratios differ by only 0.087=0.25 sigma once the +/-20 grid noise is ' +
      'propagated (sigma_R=0.34), and a 0.25-sigma separation is not resolvable. The metric confirms rather than ' +
      'closes sg-3663-log-vs-sqrt-fixed-pair.',
    whyTheFourthAnchorWasNeeded:
      'The three-anchor step ratio cannot resolve a 0.25-sigma gap; imp-3686 added a fourth N=2800 anchor (m*=620) on ' +
      'a refined 20-step grid, halving the quantisation to +/-10 and widening the fit gap, which was what actually ' +
      'let log be preferred. This module quantifies WHY three anchors were insufficient.',
    steeperThanBoth:
      'R_obs=0.667 sits below both R_log=0.817 and R_sqrt=0.904, so the discrete deceleration is at least as concave ' +
      'as log and possibly steeper -- the same direction as imp-3686 sg-3686-steeper-than-log-fixed-pair -- but the ' +
      '0.44-sigma offset below log is within the +/-20 noise, so this module opens no new sub-gap.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    metricDoesNotDiscriminate:
      'The step-ratio concavity metric FAVOURS log but does NOT discriminate log from sqrt at the +/-20 grid: the two ' +
      'law ratios are separated by only 0.25 sigma. sg-3663-log-vs-sqrt-fixed-pair stays open at three anchors; the ' +
      'imp-3686 fourth anchor is what preferred log.',
    threeAnchorsAreGridQuantised:
      'The anchors m*=360/480/560 are grid-quantised to +/-20 (the 40-step sub-depth grid), which dominates sigma_R. ' +
      'A first-order Gaussian propagation of an integer-grid uncertainty is itself approximate.',
    noNewCompute:
      'This is pure arithmetic on the imported imp-3663 anchors; it runs no Lanczos and adds no measurement. It ' +
      'reinterprets existing data with a distinct statistic.',
    assessesNotConstructs:
      'This discriminates a Krylov depth law; it does NOT construct the missing magnitude and does NOT attempt the ' +
      'imp-3066 K_a >= 0 positivity.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3712_MATCHED_PAIR_DEPTH_CONCAVITY_DISCRIMINATOR_ASSERTIONS = [
  {
    id: 'imp3712-anchors-are-the-imp3663-triple',
    why: 'The metric must run on the IMPORTED imp-3663 fixed-pair triple m*=360/480/560 at N=1600/2000/2400 (not a ' +
      're-baked copy); a mismatch means the imp-3663 anchors moved and the discriminator is stale.',
    holds: () =>
      M.length === 3 && M[0] === 360 && M[1] === 480 && M[2] === 560 &&
      N[0] === 1600 && N[1] === 2000 && N[2] === 2400,
  },
  {
    id: 'imp3712-observed-step-ratio-is-two-thirds',
    why: 'The observed second-difference step ratio must be dm_hi/dm_lo = 80/120 = 2/3, and the second difference must ' +
      'be negative (concave) -- the invariant the whole discriminator rests on.',
    holds: () => dm_lo === 120 && dm_hi === 80 && Math.abs(rObs - 2 / 3) < 1e-12 && secondDifference === -40,
  },
  {
    id: 'imp3712-law-predicted-ratios',
    why: 'The log law must predict R=0.81706 and the sqrt law R=0.90407 at these N, with log the MORE concave (smaller) ' +
      'prediction; these are the fixed targets the observed 0.667 is compared against.',
    holds: () =>
      Math.abs(rLog - 0.8170594925112872) < 1e-9 &&
      Math.abs(rSqrt - 0.9040691056184369) < 1e-9 &&
      rLog < rSqrt,
  },
  {
    id: 'imp3712-noise-propagates-to-sigma-0p34',
    why: 'Propagating the +/-20 grid quantisation through R=(m3-m2)/(m2-m1) must give sigma_R ~ 0.3425; this sets the ' +
      'resolution against which the law separation is judged.',
    holds: () => Math.abs(sigmaR - 0.34246744460938755) < 1e-9,
  },
  {
    id: 'imp3712-favours-log-nearer-than-sqrt',
    why: 'The observed ratio must be NEARER the log prediction (0.44 sigma) than the sqrt prediction (0.69 sigma): the ' +
      'metric independently corroborates the imp-3663 RMS ordering (log preferred).',
    holds: () =>
      favoursLog &&
      gapLog < gapSqrt &&
      Math.abs(gapLogSigma - 0.4391448828549412) < 1e-6 &&
      Math.abs(gapSqrtSigma - 0.6932116984799749) < 1e-6,
  },
  {
    id: 'imp3712-not-discriminated-at-grid',
    why: 'CRITICAL HONESTY: the two law ratios must be separated by LESS than one sigma_R (~0.25 sigma) and both must ' +
      'sit within one sigma_R of the observed ratio -- so the metric FAVOURS but does NOT discriminate, keeping ' +
      'sg-3663-log-vs-sqrt-fixed-pair open at three anchors. A flip here would over-claim discrimination.',
    holds: () =>
      notDiscriminatedAtGrid && bothWithinOneSigma && lawSeparationSigma < 1 &&
      Math.abs(lawSeparationSigma - 0.25406681562503375) < 1e-6,
  },
  {
    id: 'imp3712-observed-steeper-than-both-laws',
    why: 'The observed ratio 0.667 must lie BELOW both the log (0.817) and sqrt (0.904) predictions -- the discrete ' +
      'deceleration is at least as concave as log (direction of sg-3686-steeper-than-log-fixed-pair).',
    holds: () => rObsSteeperThanBoth && rObs < rLog && rObs < rSqrt,
  },
  {
    id: 'imp3712-verdict-favours-log-not-discriminated',
    why: 'The classified verdict must be the confirming favours-log-but-undiscriminated result, not indeterminate.',
    holds: () => verdict.startsWith('STEP-RATIO-CONCAVITY-METRIC-ON-THE-imp-3663-ANCHORS'),
  },
  {
    id: 'imp3712-honest-assessment-no-qed',
    why: 'Mandatory honesty: ARITHMETIC only on existing anchors, metric does not discriminate, positivity not ' +
      'attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3712_MATCHED_PAIR_DEPTH_CONCAVITY_DISCRIMINATOR.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.metricDoesNotDiscriminate === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3712_MATCHED_PAIR_DEPTH_CONCAVITY_DISCRIMINATOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3712-matched-pair-depth-concavity-discriminator assertion failed: ${assertion.id}`);
  }
}

export default IMP3712_MATCHED_PAIR_DEPTH_CONCAVITY_DISCRIMINATOR;
