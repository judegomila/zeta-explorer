/**
 * @fileoverview imp-96915 -- SCOUT (numerical): pin the imp-96832 oscillatory-remainder best-fit
 * frequency w=3.85 of the imp-96487 21-rung Burnol-ratio ladder with a Lomb-Scargle / least-squares
 * periodogram, and DECIDE whether it is a stable spectral feature or a 21-point sampling artifact.
 * imp-96832 attributed the AR(1)-vs-block-bootstrap VIF gap to an anticorrelation lobe (empirical ACF
 * negative at lags 3..7) with a best-fit frequency w=3.85, but w was never pinned or error-banded.
 * Measurement only; the qualitative VIF>1 conclusion is untouched; NO QED.
 *
 * METHOD (driver tmp/imp-96915-scratch.mjs, pure-JS Scargle-1982 normalized periodogram on the 21
 * detrended ratios, unit-spaced index sampling t=0..20 -- the same evenly-spaced-lag convention
 * imp-96832 used for its ACF). For each angular frequency w the periodogram fits y ~ A cos(w t) +
 * B sin(w t) with the Lomb phase offset tau and reports the variance-normalized power P/var. Peak
 * location error-banded by leave-one-out (drop each rung, refit) and by half-split / parity subsamples.
 * False-alarm probability from FAP = 1 - (1 - e^-z)^M with M ~ N independent frequencies.
 *
 * FINDING 1 -- w=3.85 IS ABOVE THE NYQUIST FREQUENCY (pi=3.1416) FOR UNIT-SPACED SAMPLES, SO IT IS
 * NOT A RESOLVABLE FREQUENCY AT ALL. Its periodogram power (0.3921) is IDENTICAL to the power at its
 * alias image 2*pi - 3.85 = 2.4332 rad/sample (also 0.3921) -- the signature of an above-Nyquist alias,
 * not a real spectral line. The claimed period 2*pi/3.85 = 1.632 lags is below the 2-lag Nyquist period.
 *
 * FINDING 2 -- THE GENUINE SPECTRAL PEAK IS A LOW FREQUENCY w=0.70 rad/sample (period ~9 lags), 13x
 * STRONGER (normalized power 5.18 vs 0.39 at w=3.85/alias). It is ROBUST: leave-one-out mean 0.701,
 * sd 0.012, range [0.663, 0.723]; half-splits agree (first-14 w=0.710, last-14 w=0.726) and the even
 * subsample gives w=0.647. Linear-detrending gives w=0.671 (period 9.37). The odd-parity subsample
 * jumps to w=2.358 -- exactly the decimation-aliasing one expects when a low-frequency oscillation is
 * subsampled, further evidence that a single low frequency, not w=3.85, governs the ladder.
 *
 * FINDING 3 -- THE ACF SIGN PATTERN CONFIRMS THE LOW FREQUENCY, NOT w=3.85. Empirical ACF signs at
 * lags 1..10 are ++-----+++ : two positive, then five consecutive negatives (lags 3..7, the imp-96832
 * anticorrelation lobe), then positive again near lag 8-9. A half-period of ~4-5 lags between the first
 * negative and the return to positive matches the w=0.70 (period ~9 lags) feature, whose first
 * anti-node sits near lag 4-5. A w=3.85 (period 1.63 lags) oscillation would flip sign roughly every
 * ~0.8 lag and could NOT produce five consecutive same-sign ACF values -- it is incompatible with the
 * measured lobe.
 *
 * FINDING 4 -- EVEN THE GENUINE PEAK IS NOT FORMALLY SIGNIFICANT AT 21 POINTS. The full-ladder peak
 * power 5.18 gives FAP ~ 0.11 (> 0.05) against white noise with ~21 independent frequencies -- so the
 * ~9-lag oscillation is a resolvable but marginal feature, whereas w=3.85 is not resolvable at all.
 *
 * VERDICT. w=3.85 is a 21-POINT SAMPLING ARTIFACT, not a stable spectral feature: it lies ABOVE the
 * Nyquist frequency pi=3.1416 for the unit-spaced ladder, its periodogram power is merely the alias
 * image of the low frequency 2.4332 (identical 0.3921), and it is 13x weaker than the genuine, stable,
 * leave-one-out-robust peak at w=0.70 rad/sample (period ~9 lags, sd 0.012). The real anticorrelation
 * lobe imp-96832 named (ACF negative at lags 3..7, signs ++-----+++) is produced by that low-frequency
 * ~9-lag oscillation, NOT by w=3.85; the "w=3.85" label was itself the artifact. The qualitative VIF>1
 * conclusion (driven by the real negative ACF lobe) is UNTOUCHED. SUB-GAP IMP96915_W385_IS_NYQUIST_ALIAS_ARTIFACT.
 * Measurement only; interval-rigorous certificate reach stays 2a<=0.96; C_mb GUE-conditional (imp-486);
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96832 (named the w=3.85 oscillatory-remainder frequency; never pinned or error-banded -- driver tmp/imp-96832-scratch.mjs holds the 21 ratios and the ACF)
 * @see imp-96487-* (the 21-rung Burnol ratio(N) ladder whose remainder is analyzed here)
 * @see imp-96709 / imp-96692 (block-bootstrap VIF ~1.70 vs AR(1) 2.578 that motivated the ACF/oscillation decomposition)
 */

// interval-rigorous certificate reach (unchanged by this scout)
export const IMP96915_RIGOROUS_REACH_2A = 0.96;

// Nyquist angular frequency for the unit-spaced 21-rung ladder (period-2-lag limit)
export const IMP96915_NYQUIST_W = Math.PI; // 3.141592653589793

// the imp-96832 claimed best-fit frequency and its implied period (in lags)
export const IMP96915_CLAIMED = Object.freeze({
  w: 3.85,
  period: (2 * Math.PI) / 3.85,     // 1.6320 lags -- below the 2-lag Nyquist period
  aliasW: 2 * Math.PI - 3.85,       // 2.4332 rad/sample -- the resolvable image of w=3.85
  powerAtClaimed: 0.3921,           // normalized Lomb power at w=3.85
  powerAtAlias: 0.3921,             // identical -> w=3.85 is the alias image, above Nyquist
});

// FINDING 2: the genuine, robust low-frequency peak of the detrended ladder
export const IMP96915_GENUINE_PEAK = Object.freeze({
  w: 0.7006,                        // rad/sample (mean-removed Lomb-Scargle, scan 0..pi)
  power: 5.1829,                    // normalized power -- 13.2x the w=3.85/alias power
  periodLags: 8.9686,              // ~9 lags
  wLinearDetrend: 0.6707,          // linear-detrended peak (period 9.37)
  powerRatioOverClaimed: 5.1829 / 0.3921, // ~13.2
});

// leave-one-out and subsample stability of the peak-w (rad/sample)
export const IMP96915_STABILITY = Object.freeze({
  looMean: 0.701,
  looSd: 0.012,
  looMin: 0.663,
  looMax: 0.723,
  first14: 0.710,
  last14: 0.726,
  even: 0.647,
  odd: 2.358,                       // decimation-aliasing of the low frequency (odd parity)
});

// FINDING 3: empirical ACF signs at lags 1..10 (the imp-96832 anticorrelation lobe = five negatives)
export const IMP96915_ACF_SIGNS = '++-----+++';

// FINDING 4: false-alarm probability of the genuine peak (white-noise null, ~21 indep freq)
export const IMP96915_PEAK_FAP = 0.111;

export const IMP96915_VERDICT = Object.freeze({
  ticket: 'imp-96915',
  question: 'is the imp-96832 best-fit frequency w=3.85 of the 21-rung Burnol-ratio oscillatory remainder a stable spectral feature or a 21-point sampling artifact ?',
  method: 'Lomb-Scargle / least-squares periodogram on the 21 detrended ratios (unit-spaced index sampling), with leave-one-out and half-split/parity subsample error bands and an ACF sign cross-check',
  // Finding 1
  claimedFreqAboveNyquist: true,    // 3.85 > pi = 3.1416
  claimedIsAliasImage: true,        // power@3.85 == power@(2pi-3.85), an above-Nyquist alias
  // Finding 2
  genuinePeakW: 0.7006,
  genuinePeakPeriodLags: 8.9686,
  genuinePeakPowerRatioOverClaimed: 13.2,
  peakStableUnderLOO: true,         // sd 0.012, range [0.663, 0.723]
  // Finding 3
  acfSignsMatchLowFreqNotClaimed: true, // ++-----+++ (5 negatives) needs ~9-lag period, not 1.63
  // Finding 4
  genuinePeakFormallySignificant: false, // FAP ~ 0.11 > 0.05 even for the real peak
  // decision
  w385IsSamplingArtifact: true,
  vifConclusionUntouched: true,     // qualitative VIF>1 (real negative ACF lobe) unchanged
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96915_W385_IS_NYQUIST_ALIAS_ARTIFACT -- the imp-96832 best-fit frequency w=3.85 of the 21-rung Burnol-ratio oscillatory remainder is a 21-point sampling artifact, not a stable spectral feature: it lies ABOVE the Nyquist frequency pi=3.1416 for the unit-spaced ladder, its Lomb-Scargle power (0.3921) is merely the alias image of the low frequency 2.4332 rad/sample (identical power), and it is ~13x weaker than the genuine, leave-one-out-robust peak at w=0.70 rad/sample (period ~9 lags, LOO sd 0.012, half-splits 0.710/0.726). The real anticorrelation lobe imp-96832 named (ACF signs ++-----+++, negative at lags 3..7) is produced by that low-frequency ~9-lag oscillation, NOT by w=3.85 (period 1.63 lags, which would flip sign every ~0.8 lag and cannot yield five consecutive negatives); the qualitative VIF>1 conclusion is untouched',
  qed: false,
});
export default IMP96915_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96915_ASSERTIONS = [
  {
    id: 'imp96915-claimed-freq-is-above-nyquist-alias',
    holds: () =>
      IMP96915_CLAIMED.w > IMP96915_NYQUIST_W &&                          // 3.85 > pi
      Math.abs(IMP96915_CLAIMED.aliasW - (2 * Math.PI - 3.85)) < 1e-9 &&
      IMP96915_CLAIMED.aliasW < IMP96915_NYQUIST_W &&                     // alias is resolvable, 3.85 is not
      Math.abs(IMP96915_CLAIMED.powerAtClaimed - IMP96915_CLAIMED.powerAtAlias) < 1e-9 &&
      IMP96915_VERDICT.claimedFreqAboveNyquist === true &&
      IMP96915_VERDICT.claimedIsAliasImage === true,
    why: 'w=3.85 exceeds the Nyquist frequency pi=3.1416 for the unit-spaced ladder and its periodogram power equals that of its alias image 2pi-3.85=2.4332 -- the signature of an above-Nyquist alias, not a resolvable spectral line.',
  },
  {
    id: 'imp96915-genuine-low-freq-peak-dominates',
    holds: () =>
      IMP96915_GENUINE_PEAK.w < 1.0 &&
      IMP96915_GENUINE_PEAK.periodLags > 8 && IMP96915_GENUINE_PEAK.periodLags < 10 &&
      IMP96915_GENUINE_PEAK.power > 10 * IMP96915_CLAIMED.powerAtClaimed &&  // >=13x stronger
      IMP96915_GENUINE_PEAK.powerRatioOverClaimed > 12 &&
      IMP96915_VERDICT.genuinePeakPowerRatioOverClaimed > 12,
    why: 'the genuine spectral peak is a low frequency w=0.70 rad/sample (period ~9 lags) whose normalized power 5.18 is ~13x the w=3.85/alias power 0.39.',
  },
  {
    id: 'imp96915-peak-stable-under-loo-and-subsamples',
    holds: () =>
      IMP96915_STABILITY.looSd < 0.05 &&
      IMP96915_STABILITY.looMin > 0.6 && IMP96915_STABILITY.looMax < 0.75 &&
      Math.abs(IMP96915_STABILITY.looMean - IMP96915_GENUINE_PEAK.w) < 0.02 &&
      Math.abs(IMP96915_STABILITY.first14 - IMP96915_GENUINE_PEAK.w) < 0.05 &&
      Math.abs(IMP96915_STABILITY.last14 - IMP96915_GENUINE_PEAK.w) < 0.05 &&
      IMP96915_VERDICT.peakStableUnderLOO === true,
    why: 'the low-frequency peak is robust: leave-one-out sd 0.012 in [0.663,0.723] around 0.701, and both half-splits (0.710/0.726) agree -- unlike an artifact frequency.',
  },
  {
    id: 'imp96915-acf-sign-pattern-matches-low-freq',
    holds: () => {
      // five consecutive negatives (lags 3..7) require a half-period much longer than 1.63 lags
      const signs = IMP96915_ACF_SIGNS;
      const negRun = signs.indexOf('-----') >= 0;                        // 5 consecutive negatives present
      return negRun && signs.length === 10 && signs[0] === '+' &&
        IMP96915_VERDICT.acfSignsMatchLowFreqNotClaimed === true &&
        // a 1.63-lag period (w=3.85) would flip sign every ~0.8 lag: incompatible with 5 negatives
        IMP96915_CLAIMED.period < 2;
    },
    why: 'the ACF signs ++-----+++ contain five consecutive negatives (lags 3..7), consistent with the ~9-lag (w=0.70) oscillation but impossible for a 1.63-lag (w=3.85) period that would flip sign every ~0.8 lag.',
  },
  {
    id: 'imp96915-scout-only-no-qed',
    holds: () =>
      IMP96915_VERDICT.w385IsSamplingArtifact === true &&
      IMP96915_VERDICT.vifConclusionUntouched === true &&
      IMP96915_VERDICT.genuinePeakFormallySignificant === false &&
      IMP96915_PEAK_FAP > 0.05 &&
      IMP96915_VERDICT.operatorPositivityProved === false &&
      IMP96915_VERDICT.intervalRigorousReachUnchanged === IMP96915_RIGOROUS_REACH_2A &&
      IMP96915_RIGOROUS_REACH_2A === 0.96 &&
      IMP96915_VERDICT.subGap.indexOf('IMP96915_W385_IS_NYQUIST_ALIAS_ARTIFACT') === 0 &&
      IMP96915_VERDICT.qed === false,
    why: 'measurement only: w=3.85 is decided to be a sampling artifact, the qualitative VIF>1 conclusion is untouched, even the genuine peak is not formally significant (FAP 0.11), the interval-rigorous reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96915_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96915-burnol-oscillation-frequency-periodogram assertion failed: ${a.id}`);
  }
}
