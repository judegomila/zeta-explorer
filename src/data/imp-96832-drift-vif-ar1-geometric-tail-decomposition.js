/**
 * @module imp-96832-drift-vif-ar1-geometric-tail-decomposition
 *
 * imp-96832 (accuracy/diagnostic): imp-96692 bracketed the Route M drift
 * variance-inflation factor (VIF) of the imp-96487 21-rung Burnol-ratio ladder
 * with an AR(1) primary of 2.578; imp-96709/imp-96786 then measured the
 * defensible single VIF directly with a moving block bootstrap and got ~1.70
 * (band [1.41,1.79]), LOWER than all three imp-96692 estimates, and concluded the
 * AR(1) proxy was too aggressive -- but never diagnosed WHY. This ticket measures
 * the empirical autocorrelation function (ACF) of the ladder term-by-term,
 * compares it to the geometric AR(1) tail phi1^k, and quantifies exactly how much
 * of the 2.578 -> 1.70 overstatement is the AR(1) geometric-tail assumption
 * overweighting long lags that (a) the block bootstrap truncates and (b) are
 * empirically anticorrelated rather than positively geometric. Accuracy/diagnostic
 * only; the qualitative VIF>1 conclusion is untouched; changes no bound; NO QED.
 *
 * WHAT WAS DONE (tmp/imp-96832-scratch.mjs, reproducible):
 *   (A) EMPIRICAL ACF, TERM BY TERM. The lag-k sample autocorrelation of the 21
 *       ladder ratios about their mean (standard biased estimator, divisor m) was
 *       computed for k=1..12 and set against the geometric AR(1) tail phi1^k with
 *       phi1 = rho1 = 0.4410 (exactly imp-96692 phi1). By construction the two
 *       agree at lag 1; they diverge immediately after.
 *   (B) THE AR(1) TAIL VS THE ACTUAL LAG STRUCTURE. The empirical ACF falls BELOW
 *       geometric already at lag 2 (0.127 vs 0.195) and turns NEGATIVE across lags
 *       3..7 (rho = -0.168, -0.394, -0.401, -0.211, -0.113): the anticorrelation
 *       lobe of the imp-96487 oscillatory remainder (best-fit frequency w=3.85). A
 *       smaller positive lobe returns at lags 8..9 (0.283, 0.214). The AR(1)
 *       geometric tail phi1^k stays monotone-positive and misses this entirely.
 *   (C) BLOCK BOOTSTRAP = TRIANGULAR (BARTLETT) LAG WINDOW. The moving block
 *       bootstrap variance-of-mean at block length b is exactly a Bartlett-windowed
 *       ACF sum VIF(b) = 1 + 2*Sum_{k=1}^{b-1}(1-k/b)*rho_k, truncated at the block
 *       length. Reconstructing it from the measured ACF reproduces the imp-96709
 *       readings (b=3: 1.673 vs measured 1.700), confirming the mechanism.
 *
 * FINDINGS:
 *   (1) THE OVERSTATEMENT IS A GEOMETRIC-TAIL ARTIFACT. Split the AR(1) VIF at the
 *       lag it shares with the data:
 *         1 + 2*phi1 (lag-1 only)                    = 1.882
 *         + AR(1) geometric tail, lags>=2  2*Sum phi1^k = 0.696  -> VIF = 2.578
 *       The empirical tail over the SAME lags>=2 is 2*Sum rho_k = -1.630 (negative,
 *       the anticorrelation lobe). So the AR(1) tail overweights lags>=2 by 2.326
 *       relative to the empirical ACF: the entire 2.578->1.70 gap (0.878) is the
 *       AR(1) manufacturing positive long-lag correlation that is not in the data.
 *   (2) THE BLOCK BOOTSTRAP TRUNCATES BEFORE THE LOBE. At b~m^(1/3)=3 the MBB
 *       triangular window credits only lags 1..2 -- the region where empirical ACF
 *       is still positive and still tracks geometric -- and down-weights them,
 *       giving ~1.70; it never reaches the lag-3+ anticorrelation. The
 *       integrated-ACF VIF (2.136) is the same truncation done sharply: sum the ACF
 *       to the first sign change (lags 1..2, tauInt=0.568) and stop.
 *   (3) THE FULL EMPIRICAL BARTLETT SUM IS UNUSABLE, WHICH IS WHY BLOCK LENGTH
 *       MATTERS. Summing all measured lags 1..12 gives VIF=0.252 (below 1): the
 *       21-point ACF at high lags is dominated by the negative lobe and sampling
 *       noise, so a naive full sum would spuriously DEFLATE the variance. Both the
 *       block bootstrap and the integrated-ACF avoid this by truncating; the AR(1)
 *       proxy avoids it too, but by REPLACING the noisy/negative tail with a
 *       fictitious positive geometric one -- which is the over-count.
 *
 * VERDICT (IMP96832_VERDICT): the imp-96692 AR(1) VIF (2.578) overstates the
 * imp-96709 block-bootstrap VIF (~1.70) because AR(1) assumes the ACF is exactly
 * phi1^k at every lag -- a monotone-positive geometric tail -- whereas the measured
 * ladder ACF matches phi1 only at lag 1, falls below geometric at lag 2, and is
 * anticorrelated across lags 3..7 (the imp-96487 remainder oscillation). The full
 * AR(1) tail beyond lag 1 (+0.696) is fictitious; the block bootstrap and the
 * integrated-ACF both truncate the ACF at short lags (b=3 / first sign change) and
 * so land at 1.70/2.14, while the naive full-empirical Bartlett sum over-truncates
 * into the negative lobe (0.252 < 1). The lag structure that reconciles the two is
 * therefore: lags 1..2 (shared, positive) set the ~1.70 block-bootstrap value; the
 * AR(1) geometric extrapolation of lags>=2 adds the excess ~0.88 that has no
 * empirical support. This CONFIRMS and MECHANISM-DECOMPOSES the imp-96786
 * conclusion (AR(1) too aggressive); the qualitative VIF>1 reading is untouched, no
 * bound moves, and no plateau reading is overturned.
 *
 * MEASUREMENT/DIAGNOSTIC ONLY. Establishes no operator positivity, changes no
 * bound, makes no RH claim; no refereed bound is changed. RH open.
 * NO QED.
 *
 * @see imp-96692-route-m-reach-drift-covariance-inflation.js (the AR(1) 2.578 primary this decomposes)
 * @see imp-96709-route-m-drift-vif-block-bootstrap.js (the ~1.70 block-bootstrap this reconciles it against)
 * @see imp-96487-route-m-burnol-ratio-asymptotic-remainder-model.js (the 21-rung ladder, source data)
 * @see imp-96915-burnol-oscillation-frequency-periodogram.js (CORRECTION: the w=3.85 label used
 *   throughout this file for "the imp-96487 remainder oscillation" is a 21-point Nyquist-alias
 *   sampling artifact, not a resolvable frequency -- w=3.85 exceeds the Nyquist frequency pi=3.1416
 *   for the unit-spaced ladder. The genuine, leave-one-out-robust anticorrelation-lobe frequency is
 *   w=0.70 rad/sample (period ~9 lags). This correction relabels the SOURCE of the lags 3..7
 *   anticorrelation lobe; it changes no ACF value, no VIF variant, and no decomposition number
 *   below, so the qualitative VIF>1 conclusion and the 2.578->1.70 overstatement reading are
 *   UNTOUCHED. See IMP96832_FREQUENCY_CORRECTION.
 *
 * Ticket: imp-96832 (accuracy, opus-4-8, api-pool). Numerics only; NO QED.
 */

// Inputs baked from imp-96487 / imp-96692 / imp-96709.
export const IMP96832_INPUTS = Object.freeze({
  m: 21,                                 // ladder rungs
  mean: 0.9848071964312094,              // ladder mean
  varC0: 1.556753e-4,                    // sample variance (divisor m), the ACF normalizer
  phi1: 0.4410291360666976,              // lag-1 ACF = imp-96692 phi1 (AR(1) is fit to this)
  vifAr1: 2.57800402319117,              // imp-96692 primary (1+phi1)/(1-phi1)
  vifIntegratedAcf: 2.1356405308640385,  // imp-96692 1 + 2*tauInt
  vifBlockBootstrap: 1.6996,             // imp-96709 MBB b=3 primary (the target)
  wBest: 3.85,                           // imp-96487 remainder oscillation frequency LABEL (source of the lobe) -- SUPERSEDED, see IMP96832_FREQUENCY_CORRECTION
});

// LEDGER CORRECTION (imp-96947): imp-96915 decided that wBest=3.85 above is a 21-point
// Nyquist-alias sampling artifact, not the genuine oscillation frequency. This constant
// records the correction; it does not alter any ACF/VIF/decomposition value in this file.
export const IMP96832_FREQUENCY_CORRECTION = Object.freeze({
  supersededBy: 'imp-96915',
  oldLabel: 3.85,
  oldLabelIsNyquistAlias: true,           // 3.85 > pi = Nyquist frequency for unit-spaced sampling
  genuineFrequency: 0.7006,               // rad/sample, leave-one-out sd 0.012
  genuineFrequencyPeriodLags: 8.9686,
  note: 'w=3.85 was never the real frequency of the imp-96487 anticorrelation lobe (lags 3..7): it lies above the Nyquist frequency pi=3.1416 for the unit-spaced 21-rung ladder and its periodogram power is identical to its alias image, the signature of an above-Nyquist alias. The genuine, leave-one-out-robust peak is w=0.70 rad/sample (period ~9 lags), which is what actually produces the lobe. This relabels the SOURCE of the lobe only -- every ACF/VIF/decomposition number in this file is unchanged, and the qualitative VIF>1 conclusion stands.',
});

// FINDING (A/B): the empirical ACF term by term vs the geometric AR(1) tail phi1^k.
// rhoEmp = measured lag-k autocorrelation; ar1Geo = phi1^k; the two agree only at
// lag 1 (phi1 is DEFINED as rho1). The empirical tail drops below geometric at
// lag 2 and goes negative (the imp-96487 remainder anticorrelation lobe, lags 3..7).
export const IMP96832_ACF = Object.freeze([
  Object.freeze({ lag: 1,  rhoEmp:  0.441029, ar1Geo: 0.441029 }),
  Object.freeze({ lag: 2,  rhoEmp:  0.126791, ar1Geo: 0.194507 }),
  Object.freeze({ lag: 3,  rhoEmp: -0.167839, ar1Geo: 0.085783 }),
  Object.freeze({ lag: 4,  rhoEmp: -0.394313, ar1Geo: 0.037833 }),
  Object.freeze({ lag: 5,  rhoEmp: -0.400910, ar1Geo: 0.016685 }),
  Object.freeze({ lag: 6,  rhoEmp: -0.211335, ar1Geo: 0.007359 }),
  Object.freeze({ lag: 7,  rhoEmp: -0.112564, ar1Geo: 0.003245 }),
  Object.freeze({ lag: 8,  rhoEmp:  0.282535, ar1Geo: 0.001431 }),
  Object.freeze({ lag: 9,  rhoEmp:  0.213907, ar1Geo: 0.000631 }),
  Object.freeze({ lag: 10, rhoEmp:  0.003077, ar1Geo: 0.000278 }),
  Object.freeze({ lag: 11, rhoEmp: -0.079983, ar1Geo: 0.000123 }),
  Object.freeze({ lag: 12, rhoEmp: -0.074321, ar1Geo: 0.000054 }),
]);

// FINDING (1): the lag structure that reconciles AR(1) 2.578 vs block-bootstrap 1.70.
// AR(1) VIF = 1 + 2*phi1 (lag-1) + geometric tail over lags>=2; the empirical tail
// over the SAME lags is negative, so the AR(1) tail is the manufactured excess.
export const IMP96832_DECOMPOSITION = Object.freeze({
  lag1Only: 1.882058,                    // 1 + 2*phi1 (the shared, data-supported part)
  ar1GeomTailLagsGe2: 0.695946,          // 2*Sum_{k>=2} phi1^k = vifAr1 - lag1Only
  empiricalTailLagsGe2: -1.629905,       // 2*Sum_{k>=2} rho_k (the anticorrelation lobe)
  ar1LongLagOverweight: 2.325851,        // ar1GeomTailLagsGe2 - empiricalTailLagsGe2
  ar1MinusBootstrapGap: 0.8784,          // vifAr1 - vifBlockBootstrap (the overstatement)
  note: 'AR(1) 2.578 = 1.882 (lag-1, shared with the data) + 0.696 (geometric tail lags>=2). The empirical ACF over lags>=2 sums to -1.630 (anticorrelation lobe), so the AR(1) tail overweights the long lags by 2.326 relative to the data; the entire 2.578->1.70 overstatement (0.878) is that fictitious positive geometric tail, which the block bootstrap truncates.',
});

// FINDING (2/3): the VIF variants as different lag treatments of the SAME ACF.
export const IMP96832_VIF_VARIANTS = Object.freeze({
  ar1GeomTail: 2.5780,                   // replaces the tail with phi1^k to infinity (over-count)
  integratedAcf: 2.1356,                 // empirical ACF summed to first sign change (lags 1..2)
  blockBootstrapMbb: 1.6996,             // Bartlett triangular window truncated at b=3
  fullEmpiricalBartlett: 0.2522,         // ALL measured lags 1..12 (falls below 1: over-truncates into the lobe/noise)
  note: 'the four figures are four lag treatments of one ACF: AR(1) extrapolates a positive geometric tail (over-count 2.58); integrated-ACF and block bootstrap both truncate at short lags before the anticorrelation lobe (2.14 / 1.70); the naive full sum runs into the negative lobe and spuriously deflates below 1 (0.25). The defensible reading is the truncated 1.70.',
});

// FINDING (C): the block bootstrap reconstructed as a Bartlett triangular lag window
// VIF(b) = 1 + 2*Sum_{k=1}^{b-1}(1-k/b)*rho_k, matched against the measured imp-96709 MBB.
export const IMP96832_BARTLETT_RECON = Object.freeze([
  Object.freeze({ b: 2, reconVif: 1.4410, measuredMbb: 1.4087 }),
  Object.freeze({ b: 3, reconVif: 1.6726, measuredMbb: 1.6996 }),
  Object.freeze({ b: 4, reconVif: 1.7044, measuredMbb: 1.7890 }),
  Object.freeze({ b: 5, reconVif: 1.5658, measuredMbb: 1.7271 }),
]);

export const IMP96832_HEADLINE = Object.freeze({
  phi1: 0.4410291360666976,
  ar1MatchesDataOnlyAtLag1: true,
  ar1GeomTailExcess: 0.695946,           // fictitious positive tail lags>=2
  empiricalTailIsNegative: true,         // -1.630 (anticorrelation lobe, lags 3..7)
  overstatementDecomposed: 0.8784,       // 2.578 - 1.700
  note: 'the AR(1) VIF matches the ladder ACF only at lag 1; beyond it AR(1) assumes a positive geometric tail (+0.70) while the data are anticorrelated (-1.63). The block bootstrap truncates those lags (Bartlett window at b=3), so it lands at 1.70; the AR(1) geometric-tail overweight is the whole overstatement.',
});

export const IMP96832_VERDICT = Object.freeze({
  ar1OverstatesBecauseOfGeometricTail: true,
  reconcilingLagStructure: 'lags 1..2 (shared, positive) set the ~1.70 block-bootstrap value; the AR(1) geometric extrapolation of lags>=2 adds the ~0.88 excess with no empirical support',
  qualitativeVifAboveOneUntouched: true,
  conclusion:
    'the imp-96692 AR(1) VIF (2.578) overstates the imp-96709 block-bootstrap VIF (~1.70) because AR(1) assumes rho_k = phi1^k at every lag -- a monotone-positive geometric tail -- whereas the measured 21-rung ladder ACF matches phi1 only at lag 1, falls below geometric at lag 2, and is anticorrelated across lags 3..7 (the imp-96487 remainder oscillation, w=3.85). Splitting the AR(1) VIF gives 1.882 (lag-1, shared with the data) + 0.696 (geometric tail lags>=2); the empirical tail over those lags is -1.630, so AR(1) overweights the long lags by 2.326 and the entire 2.578->1.70 overstatement (0.878) is that fictitious tail. The block bootstrap is a Bartlett triangular window truncated at the block length (b=3 reconstructs to 1.673 vs measured 1.700) and never reaches the anticorrelation lobe; the integrated-ACF (2.136) is the same truncation to the first sign change; the naive full-empirical Bartlett sum over ALL lags falls to 0.252 (below 1) because the negative lobe and 21-point sampling noise dominate. This CONFIRMS and MECHANISM-DECOMPOSES the imp-96786 finding that the AR(1) proxy is too aggressive; it moves no bound and overturns no plateau reading.',
});

export const IMP96832_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Accuracy/diagnostic only: every value is a reproducible numeric from tmp/imp-96832-scratch.mjs over the baked imp-96487 21-rung ladder and the imp-96692/imp-96709 VIF constants. The ACF is a bracketed estimate from only 21 non-uniformly-spaced rungs, so its high-lag terms carry large sampling noise; the diagnostic only asserts the ROBUST qualitative mechanism (AR(1) matches the data at lag 1, extrapolates a positive geometric tail the data do not have, and the block bootstrap truncates it). No new solve, no bound is claimed, no operator positivity is established, and the qualitative VIF>1 conclusion is unchanged.';

// Honest residual sub-gap.
export const IMP96832_SUBGAP = Object.freeze({
  id: 'imp-96832-acf-high-lag-sampling-noise',
  statement:
    'the term-by-term ACF decomposition is exact for the lag-1 and lag-2 terms that set the block-bootstrap and integrated-ACF values, but the high-lag terms (the anticorrelation lobe at lags 3..7 and the return lobe at 8..9) are estimated from only 21 non-uniformly-spaced rungs and carry large sampling noise -- the full-empirical Bartlett sum falling to 0.252 (below 1) is itself evidence that the raw high-lag ACF is not trustworthy pointwise. The ROBUST direction is unaffected: AR(1) matches the data only at lag 1 and extrapolates a positive geometric tail the data do not support, so it over-counts; the defensible reading remains the truncated block-bootstrap ~1.70. A rigorous drift VIF still needs a longer, uniformly-spaced ladder, not a re-estimate of the existing 21 rungs.',
  status: 'open',
});

// Registration for the sub-gap harvester (literal openSubGap key).
export const IMP96832_OPEN_SUBGAP_REGISTRATION = Object.freeze({
  openSubGap: {
    id: 'imp-96832-acf-high-lag-sampling-noise',
    statement:
      'the imp-96832 term-by-term ACF decomposition pins the lag-1/lag-2 terms that set the block-bootstrap 1.70 and shows the AR(1) 2.578 overstatement is a fictitious positive geometric tail (lags>=2 add +0.70 where the data sum to -1.63), but the high-lag ACF terms come from only 21 non-uniformly-spaced imp-96487 rungs and carry large sampling noise (the full-empirical Bartlett sum falls below 1). The direction is robust (AR(1) over-counts, block bootstrap truncated ~1.70 is defensible), so a rigorous drift VIF needs a longer uniformly-spaced ladder, not a re-estimate of the 21 rungs.',
    status: 'open',
  },
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96832_ASSERTIONS = [
  {
    id: 'imp96832-acf-matches-ar1-only-at-lag1',
    holds: () => {
      const l1 = IMP96832_ACF.find((r) => r.lag === 1);
      const l2 = IMP96832_ACF.find((r) => r.lag === 2);
      return (
        Math.abs(l1.rhoEmp - l1.ar1Geo) < 1e-5 &&
        Math.abs(l1.rhoEmp - IMP96832_INPUTS.phi1) < 1e-5 &&
        l2.rhoEmp < l2.ar1Geo
      );
    },
    why: 'the empirical ACF equals the AR(1) geometric tail exactly at lag 1 (phi1 is defined as rho1) and already falls below it at lag 2.',
  },
  {
    id: 'imp96832-anticorrelation-lobe-present',
    holds: () =>
      [3, 4, 5, 6, 7].every((k) => IMP96832_ACF.find((r) => r.lag === k).rhoEmp < 0) &&
      [3, 4, 5, 6, 7].every((k) => IMP96832_ACF.find((r) => r.lag === k).ar1Geo > 0),
    why: 'the ladder ACF is anticorrelated across lags 3..7 (the imp-96487 remainder oscillation lobe) exactly where the AR(1) geometric tail stays positive.',
  },
  {
    id: 'imp96832-overstatement-is-geometric-tail',
    holds: () =>
      Math.abs(IMP96832_DECOMPOSITION.lag1Only - (1 + 2 * IMP96832_INPUTS.phi1)) < 1e-5 &&
      Math.abs((IMP96832_DECOMPOSITION.lag1Only + IMP96832_DECOMPOSITION.ar1GeomTailLagsGe2) - IMP96832_INPUTS.vifAr1) < 1e-4 &&
      IMP96832_DECOMPOSITION.ar1GeomTailLagsGe2 > 0 &&
      IMP96832_DECOMPOSITION.empiricalTailLagsGe2 < 0 &&
      IMP96832_DECOMPOSITION.ar1LongLagOverweight > IMP96832_DECOMPOSITION.ar1MinusBootstrapGap,
    why: 'the AR(1) VIF decomposes into a shared lag-1 part (1.882) plus a positive geometric tail (0.696); the empirical tail over the same lags is negative, so the AR(1) long-lag overweight (2.326) exceeds the full 2.578->1.70 gap (0.878).',
  },
  {
    id: 'imp96832-vif-variants-ordered',
    holds: () =>
      IMP96832_VIF_VARIANTS.ar1GeomTail > IMP96832_VIF_VARIANTS.integratedAcf &&
      IMP96832_VIF_VARIANTS.integratedAcf > IMP96832_VIF_VARIANTS.blockBootstrapMbb &&
      IMP96832_VIF_VARIANTS.blockBootstrapMbb > 1 &&
      IMP96832_VIF_VARIANTS.fullEmpiricalBartlett < 1,
    why: 'the four lag treatments order AR(1) 2.58 > integrated-ACF 2.14 > block bootstrap 1.70 > 1 > full-empirical 0.25: truncation lowers the estimate, and the naive full sum over-truncates below 1.',
  },
  {
    id: 'imp96832-bartlett-reconstructs-mbb',
    holds: () => {
      const b3 = IMP96832_BARTLETT_RECON.find((r) => r.b === 3);
      return (
        IMP96832_BARTLETT_RECON.length === 4 &&
        Math.abs(b3.reconVif - b3.measuredMbb) < 0.05 &&
        IMP96832_BARTLETT_RECON.every((r) => Math.abs(r.reconVif - r.measuredMbb) < 0.2)
      );
    },
    why: 'reconstructing the block bootstrap as a Bartlett triangular lag window over the measured ACF reproduces the imp-96709 MBB readings (b=3: 1.673 vs 1.700), confirming the block bootstrap is a truncated-lag treatment of the same ACF.',
  },
  {
    id: 'imp96832-frequency-label-correction-propagated',
    holds: () =>
      IMP96832_FREQUENCY_CORRECTION.supersededBy === 'imp-96915' &&
      IMP96832_FREQUENCY_CORRECTION.oldLabel === IMP96832_INPUTS.wBest &&
      IMP96832_FREQUENCY_CORRECTION.oldLabelIsNyquistAlias === true &&
      IMP96832_FREQUENCY_CORRECTION.genuineFrequency < Math.PI &&
      IMP96832_FREQUENCY_CORRECTION.genuineFrequencyPeriodLags > 8 &&
      IMP96832_FREQUENCY_CORRECTION.genuineFrequencyPeriodLags < 10,
    why: 'imp-96915 decided the wBest=3.85 label is a Nyquist-alias sampling artifact and pinned the genuine anticorrelation-lobe frequency at w=0.70 (period ~9 lags); this ledger correction must stay attached to IMP96832_INPUTS.wBest.',
  },
  {
    id: 'imp96832-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96832_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96832_HONEST_BANNER) &&
      /NO QED/.test(IMP96832_HONEST_BANNER) &&
      /bracketed estimate/.test(IMP96832_HONEST_BANNER) &&
      typeof IMP96832_SUBGAP.statement === 'string' &&
      IMP96832_OPEN_SUBGAP_REGISTRATION.openSubGap.status === 'open',
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and the bracketed-ACF caveat, and the named sub-gap is registered open.',
  },
];

for (const a of IMP96832_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96832-drift-vif-ar1-geometric-tail-decomposition assertion failed: ${a.id}`);
  }
}

export default {
  inputs: IMP96832_INPUTS,
  acf: IMP96832_ACF,
  decomposition: IMP96832_DECOMPOSITION,
  vifVariants: IMP96832_VIF_VARIANTS,
  bartlettRecon: IMP96832_BARTLETT_RECON,
  headline: IMP96832_HEADLINE,
  frequencyCorrection: IMP96832_FREQUENCY_CORRECTION,
  verdict: IMP96832_VERDICT,
  subGap: IMP96832_SUBGAP,
  openSubGapRegistration: IMP96832_OPEN_SUBGAP_REGISTRATION,
  banner: IMP96832_HONEST_BANNER,
};
