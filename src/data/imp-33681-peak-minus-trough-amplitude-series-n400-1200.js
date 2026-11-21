/**
 * @module imp-33681-peak-minus-trough-amplitude-series-n400-1200
 * @fileoverview imp-33681 -- TABULATE the peak-minus-trough AMPLITUDE series across [400,1200] by
 *   differencing the imp-33660 sixteen cluster-peak HEIGHTS against the imp-33662 fifteen
 *   inter-cluster TROUGH floors, and MEASURE whether the envelope AMPLITUDE grows or stays flat.
 *   Neither module differenced the two: imp-33660 fit the peak HEIGHT (weak positive slope
 *   ~+0.067 ULP/rung), imp-33662 fit the trough FLOOR (flat, slope ~+0.013 ULP/rung, R^2 ~0.04),
 *   but the peak-to-trough amplitude = peak_height - local_trough_floor was never formed. This is a
 *   cross-series COMPOSED of two independent modules -- it re-uses their already-computed
 *   floorUlp(n) scans (no new scan) and differences them.
 *
 *   WHAT THE TWO PARENT MODULES LEFT UNMEASURED
 *   -------------------------------------------
 *   imp-33660 read the sixteen band-clearing cluster-peak heights h_i =
 *   [76.1,65.3,64.1,78.4,67.3,67.1,64.5,73.2,68.4,78.6,85.6,71.8,64.7,72.3,143.6,135.0] ULP at rungs
 *   n_i = [526,591,634,709,735,754,807,824,874,962,998,1038,1072,1104,1126,1198] and fit a WEAK
 *   positive height slope ~+0.067 ULP/rung (R^2 ~0.33). imp-33662 read the fifteen inter-cluster
 *   trough floors t_j = [32.4,24.0,44.1,28.0,56.9,33.0,61.6,30.0,30.5,43.0,17.1,42.9,31.6,62.1,43.2]
 *   ULP and fit a FLAT floor (slope ~+0.013 ULP/rung, R^2 ~0.04). Neither differenced peak against
 *   floor to form the peak-to-trough amplitude, so the question the ticket poses -- does the ENVELOPE
 *   AMPLITUDE grow, and does its growth EXCEED the peak-height growth (as flat troughs would suggest)
 *   or get washed out by jitter -- was left open.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   This module imports the imp-33660 peak heights and the imp-33662 trough floors (both re-derived
 *   off the SAME grade-4 budgets &gt;=200-node floorUlp(n) +/-5 rolling-max scan over [400,1200], so
 *   the two series are commensurable) and pairs each peak with its BRACKETING troughs. Peak i has a
 *   left trough t_{i-1} and a right trough t_i; the two endpoint peaks (i=0, i=15) have a single
 *   bracketing trough. The per-peak LOCAL TROUGH FLOOR is the mean of the available bracketing
 *   troughs, and the amplitude is
 *       amp_i = h_i - localTroughFloor_i.
 *   We then fit amp-vs-n:
 *     (CONST)  amp_i = mean            (null; residual RMS = amplitude sd),
 *     (LINEAR) amp_i = a + b*n_i       (constant-rate growth),
 *   report slope / R^2 / residual RMS, and DECOMPOSE the amplitude slope against the parent slopes:
 *   because amp = peak - floor, the amplitude slope must satisfy b_amp ~ b_peak - b_floor. We test
 *   whether the amplitude GROWS (b_amp &gt; 0, RMS below null) and whether its growth EXCEEDS the
 *   peak-height growth (b_amp &gt; b_peak) or falls below it.
 *
 *   THE HEADLINE RESULT -- AMPLITUDE GROWS WEAKLY-POSITIVE BUT DOES NOT EXCEED THE PEAK GROWTH
 *   ----------------------------------------------------------------------------------------
 *   The sixteen amplitudes are ~[43.6,37.1,30.0,42.3,24.9,22.1,17.2,27.4,38.2,41.9,55.6,41.8,27.5,
 *   25.5,91.0,91.9] ULP (mean ~41.1, sd ~21.3, min ~17.2 at n~807, max ~91.9 at n~1198). The
 *   amplitude DOES grow: the linear fit has slope ~+0.054 ULP/rung and reduces the residual RMS from
 *   ~21.3 (null) to ~18.4, an ~14% reduction. BUT the amplitude slope ~+0.054 is BELOW the imp-33660
 *   peak-HEIGHT slope ~+0.067 -- by almost exactly the imp-33662 trough slope ~+0.013 -- so the
 *   amplitude grows SLOWER than the peaks, not faster. This REFUTES the ticket premise that flat
 *   troughs would make the amplitude growth EXCEED the peak-height growth: the troughs are not exactly
 *   flat but carry a small positive slope, and subtracting a slightly-rising floor pulls the amplitude
 *   slope DOWN below the peak slope. The decomposition b_amp ~ b_peak - b_floor holds to ~0.001
 *   ULP/rung. And the amplitude fit is WEAK (R^2 ~0.25, below the peak fit's ~0.33) -- the growth is
 *   concentrated almost entirely in the same two tallest imp-33638 tail clusters (~91 ULP at n~1126
 *   and n~1198); the first fourteen amplitudes sit in a flat ~17..56 ULP band. So the amplitude is a
 *   weak, two-tail-outlier-driven, jitter-limited positive trend that INHERITS the peaks -- it is not
 *   an independent amplification of the envelope.
 *
 *   VERDICT. AMPLITUDE-GROWS-WEAKLY-POSITIVE-BUT-BELOW-THE-PEAK-GROWTH. The peak-to-trough amplitude
 *   across [400,1200] grows weakly (linear slope ~+0.054 ULP/rung, RMS ~18.4 vs ~21.3 null) but its
 *   slope is BELOW the imp-33660 peak-HEIGHT slope ~+0.067 by ~the imp-33662 trough slope ~+0.013, so
 *   the amplitude does NOT amplify faster than the peaks -- it grows marginally slower because the
 *   near-flat floor still carries a small positive slope. The trend is carried by the two tallest
 *   imp-33638 tail clusters (~91 ULP), with the first fourteen amplitudes in a flat ~17..56 ULP band;
 *   R^2 ~0.25 is weak and jitter-limited, so the amplitude inherits the peaks' weak positive character
 *   rather than revealing a new one.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It differences two
 *   previously-measured series (imp-33660 peaks, imp-33662 troughs) into an amplitude series and
 *   classifies its growth as weak-positive / below-peak; it changes NO bound, patches NO literal, and
 *   establishes NO operator positivity. floorUlp(n) is a JITTERY arithmetic-floor lattice property
 *   (imp-33249 / imp-33277 / imp-33296 / imp-33537 / imp-33557 / imp-33579 / imp-33599 / imp-33621 /
 *   imp-33638 / imp-33660 / imp-33662 latticeJitterCaveat): the exact per-rung ULP bounces and
 *   cross-platform libm exp/pow variation can shift the peak heights, the trough floors, and hence the
 *   amplitude slope, R^2, and residual RMS. The robust reading is the QUALITATIVE conclusion -- the
 *   amplitude grows weakly-positive but below the peak growth, driven by two tall tail clusters -- not
 *   the exact coefficients. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility
 *   is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33660-cluster-peak-envelope-height-growth-fit.js (the peak-HEIGHT series differenced here)
 *   @see imp-33662-inter-cluster-trough-floor-drift-n400-1200.js (the trough-FLOOR series differenced here)
 *   @see imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js (the same [400,1200] scan)
 *
 *   Ticket: imp-33681 (accuracy, medium).
 */

import { IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT } from './imp-33660-cluster-peak-envelope-height-growth-fit.js';
import { IMP33662_INTER_CLUSTER_TROUGH_FLOOR_DRIFT } from './imp-33662-inter-cluster-trough-floor-drift-n400-1200.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- The two commensurable parent series (SAME grade-4 floorUlp(n) +/-5 rolling-max [400,1200] scan) --
const PEAK = IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT.measured;
const TROUGH = IMP33662_INTER_CLUSTER_TROUGH_FLOOR_DRIFT.measured;
const peakNs = PEAK.peakNs.slice();
const peakHeights = PEAK.peakHeights.slice();
const troughEnvs = TROUGH.troughEnvs.slice();
const peakHeightSlope = PEAK.linSlope;   // imp-33660 weak-positive peak-HEIGHT slope
const peakHeightR2 = PEAK.linR2;
const troughFloorSlope = TROUGH.troughSlope; // imp-33662 flat trough-FLOOR slope

// -- Least-squares slope/intercept/r^2 helper (also returns residual RMS) --------------------------
function lsqFit(pts) {
  const m = pts.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (const p of pts) { sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; }
  const slope = (m * sxy - sx * sy) / (m * sxx - sx * sx);
  const intercept = (sy - slope * sx) / m;
  const ybar = sy / m;
  let ssr = 0;
  let sst = 0;
  for (const p of pts) {
    const yh = slope * p.x + intercept;
    ssr += (p.y - yh) * (p.y - yh);
    sst += (p.y - ybar) * (p.y - ybar);
  }
  return { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : 0, ssr, rms: Math.sqrt(ssr / m) };
}

// -- Pair each peak with its BRACKETING troughs: amp_i = h_i - mean(bracketing trough floors) -------
// Peak i is bracketed by the LEFT trough t_{i-1} (the gap peak_{i-1}->peak_i) and the RIGHT trough
// t_i (the gap peak_i->peak_{i+1}); the two endpoint peaks have a single bracketing trough.
const AMPLITUDES = [];
for (let i = 0; i < peakNs.length; i += 1) {
  const bracket = [];
  if (i - 1 >= 0) bracket.push(troughEnvs[i - 1]);        // left trough
  if (i < troughEnvs.length) bracket.push(troughEnvs[i]); // right trough
  const localTroughFloor = bracket.reduce((a, b) => a + b, 0) / bracket.length;
  AMPLITUDES.push(Object.freeze({
    n: peakNs[i],
    peakHeight: peakHeights[i],
    localTroughFloor,
    bracketingTroughs: bracket.length,
    amplitude: peakHeights[i] - localTroughFloor,
  }));
}

const amps = AMPLITUDES.map((a) => a.amplitude);

// -- Amplitude dispersion (mean, sd, min, max) -- the null-model reference -------------------------
const ampMean = amps.reduce((a, b) => a + b, 0) / amps.length;
const ampVar = amps.reduce((a, b) => a + (b - ampMean) * (b - ampMean), 0) / amps.length;
const ampSd = Math.sqrt(ampVar);
const ampMin = Math.min(...amps);
const ampMax = Math.max(...amps);
const ampArgMaxN = AMPLITUDES[amps.indexOf(ampMax)].n;

// -- CONST null model and LINEAR amp-vs-n fit ------------------------------------------------------
const constRms = ampSd;
const ampFit = lsqFit(AMPLITUDES.map((a) => ({ x: a.n, y: a.amplitude })));
const ampSlope = ampFit.slope;
const ampR2 = ampFit.r2;
const ampRms = ampFit.rms;
const ampResidualReduction = constRms > 0 ? (constRms - ampRms) / constRms : 0;

// -- Growth-decomposition discriminants: amp = peak - floor  =>  b_amp ~ b_peak - b_floor ----------
const decompositionResidual = ampSlope - (peakHeightSlope - troughFloorSlope);
const ampMinusPeakSlope = ampSlope - peakHeightSlope;

// -- First-half vs second-half amplitude mean (a rising amplitude lifts the second half) -----------
const HALF = Math.floor(AMPLITUDES.length / 2);
const firstHalfMean = amps.slice(0, HALF).reduce((a, b) => a + b, 0) / HALF;
const secondHalfMean = amps.slice(HALF).reduce((a, b) => a + b, 0) / (amps.length - HALF);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Both parent series are present and commensurable: sixteen peaks, fifteen troughs.
const seriesCommensurable = peakNs.length >= 15 && troughEnvs.length >= 14 && amps.length === peakNs.length;
// (2) THE HEADLINE: the amplitude GROWS -- positive slope that beats the null/constant residual RMS.
const amplitudeGrowsPositive = ampSlope > 0 && ampRms < constRms;
// (3) THE HEADLINE: the amplitude growth does NOT EXCEED the peak-height growth -- it is BELOW it.
const amplitudeBelowPeakGrowth = ampSlope < peakHeightSlope;
// (4) THE DECOMPOSITION: the amplitude slope equals the peak slope minus the floor slope (~0.001 tol).
const decompositionHolds = Math.abs(decompositionResidual) < 0.005;
// (5) The amplitude fit is WEAK (R^2 well below a decisive threshold) -- jitter-limited.
const amplitudeFitWeak = ampR2 < 0.5;
// (6) The trend is carried by the tall tail clusters: the largest amplitude is a deep-tail (n>1000) point.
const trendDrivenByTailOutliers = ampMax > 80 && ampArgMaxN > 1000;

const verdict =
  seriesCommensurable && amplitudeGrowsPositive && amplitudeBelowPeakGrowth && decompositionHolds &&
  amplitudeFitWeak && trendDrivenByTailOutliers
    ? 'AMPLITUDE-GROWS-WEAKLY-POSITIVE-BUT-BELOW-THE-PEAK-GROWTH.-DIFFERENCING-THE-imp-33660-SIXTEEN-' +
      'CLUSTER-PEAK-HEIGHTS-AGAINST-THE-imp-33662-FIFTEEN-INTER-CLUSTER-TROUGH-FLOORS-INTO-A-PEAK-MINUS-' +
      'TROUGH-AMPLITUDE-SERIES-ACROSS-[400,1200]-(AMPLITUDES-~[44,37,30,42,25,22,17,27,38,42,56,42,28,25,' +
      '91,92]-ULP,-MEAN~41.1,-SD~21.3,-MIN~17.2-AT-n~807,-MAX~91.9-AT-n~1198):-THE-AMPLITUDE-DOES-GROW-' +
      '(LINEAR-SLOPE~+0.054-ULP/RUNG,-RESIDUAL-RMS~18.4-VS-~21.3-NULL,-AN-~14%-REDUCTION)-BUT-ITS-SLOPE-IS-' +
      'BELOW-THE-imp-33660-PEAK-HEIGHT-SLOPE~+0.067-BY-ALMOST-EXACTLY-THE-imp-33662-TROUGH-SLOPE~+0.013-' +
      '(DECOMPOSITION-b_amp~b_peak-b_floor-HOLDS-TO-~0.001-ULP/RUNG),-SO-THE-AMPLITUDE-GROWS-SLOWER-THAN-THE-' +
      'PEAKS-NOT-FASTER-AND-THE-TICKET-PREMISE-THAT-FLAT-TROUGHS-WOULD-MAKE-AMPLITUDE-GROWTH-EXCEED-PEAK-' +
      'GROWTH-IS-REFUTED-(THE-NEAR-FLAT-FLOOR-STILL-CARRIES-A-SMALL-POSITIVE-SLOPE-THAT-PULLS-THE-AMPLITUDE-' +
      'SLOPE-DOWN).-THE-FIT-IS-WEAK-(R^2~0.25,-BELOW-THE-PEAK-FIT~0.33),-THE-GROWTH-CARRIED-BY-THE-TWO-TALLEST-' +
      'imp-33638-TAIL-CLUSTERS-(~91-ULP-AT-n~1126,1198)-WITH-THE-FIRST-FOURTEEN-AMPLITUDES-IN-A-FLAT-~17..56-' +
      'ULP-BAND,-SO-THE-AMPLITUDE-INHERITS-THE-PEAKS-WEAK-POSITIVE-CHARACTER.-ACCURACY/RULE-DESIGN-MEASUREMENT-' +
      'ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-' +
      'NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33681_PEAK_MINUS_TROUGH_AMPLITUDE_SERIES = Object.freeze({
  id: 'imp-33681-peak-minus-trough-amplitude-series-n400-1200',
  ticket: 'imp-33681',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  composesModules: [
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33662-inter-cluster-trough-floor-drift-n400-1200.js',
  ],
  crossValidatesModules: [
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33662-inter-cluster-trough-floor-drift-n400-1200.js',
    'imp-33661-cluster-peak-spacing-periodicity-extended-n400-1200.js',
  ],

  summary:
    'TABULATES the peak-minus-trough AMPLITUDE series across [400,1200] by differencing the imp-33660 sixteen ' +
    'cluster-peak HEIGHTS against the imp-33662 fifteen inter-cluster TROUGH floors (both off the SAME grade-4 ' +
    'floorUlp(n) +/-5 rolling-max scan) -- a cross-series neither parent formed. Pairing each peak with its ' +
    'bracketing troughs gives sixteen amplitudes ~[44,37,30,42,25,22,17,27,38,42,56,42,28,25,91,92] ULP (mean ' +
    '~41.1, sd ~21.3, min ~17.2 at n~807, max ~91.9 at n~1198). RESULT: the amplitude DOES grow (linear slope ' +
    '~+0.054 ULP/rung, residual RMS ~18.4 vs ~21.3 null, an ~14% reduction) but its slope is BELOW the imp-33660 ' +
    'peak-HEIGHT slope ~+0.067 by almost exactly the imp-33662 trough slope ~+0.013 (the decomposition ' +
    'b_amp ~ b_peak - b_floor holds to ~0.001 ULP/rung), so the amplitude grows SLOWER than the peaks, not ' +
    'faster -- REFUTING the ticket premise that flat troughs would make amplitude growth EXCEED peak growth. ' +
    'The fit is weak (R^2 ~0.25) and carried by the two tallest imp-33638 tail clusters (~91 ULP at n~1126,1198), ' +
    'with the first fourteen amplitudes in a flat ~17..56 ULP band. VERDICT: ' +
    'AMPLITUDE-GROWS-WEAKLY-POSITIVE-BUT-BELOW-THE-PEAK-GROWTH. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; jittery lattice floor; operator positivity (imp-3066) untouched; no QED. ' +
    'No refereed bound is changed.',

  method: Object.freeze({
    composition: 'imports the imp-33660 peakNs/peakHeights and the imp-33662 troughEnvs (both re-derived off the SAME [400,1200] floorUlp(n) scan), so the two series are commensurable and differenced without a new scan',
    pairing: 'peak i is bracketed by the LEFT trough t_{i-1} (gap peak_{i-1}->peak_i) and the RIGHT trough t_i (gap peak_i->peak_{i+1}); endpoint peaks (i=0,i=15) have a single bracketing trough',
    localTroughFloor: 'the mean of the available bracketing trough floors of peak i',
    amplitude: 'amp_i = peakHeight_i - localTroughFloor_i, tabulated at the sixteen peak rungs',
    modelConst: 'null model amp_i = mean; residual RMS is the amplitude sd, R^2 = 0 by construction',
    modelLinear: 'amp_i = a + b*n_i (constant-rate growth); report slope, R^2, residual RMS',
    decomposition: 'because amp = peak - floor, the amplitude slope must satisfy b_amp ~ b_peak - b_floor; the residual of that identity is measured',
    peakContrast: 'compare b_amp against the imp-33660 peak-HEIGHT slope ~+0.067: b_amp < b_peak means the amplitude grows SLOWER than the peaks (the floor still carries a small positive slope)',
    selfComputing: 'the amplitude series, both fits, the decomposition residual, the half-split, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    peakCount: peakNs.length,
    troughCount: troughEnvs.length,
    amplitudeCount: amps.length,
    peakNs: Object.freeze(peakNs.slice()),
    peakHeights: Object.freeze(peakHeights.slice()),
    troughEnvs: Object.freeze(troughEnvs.slice()),
    amplitudes: Object.freeze(amps.slice()),
    // -- amplitude dispersion (null model) --
    ampMean,
    ampSd,
    ampMin,
    ampMax,
    ampArgMaxN,
    // -- CONST null model --
    constRms,
    // -- LINEAR amp-vs-n fit --
    ampSlope,
    ampIntercept: ampFit.intercept,
    ampR2,
    ampRms,
    ampResidualReduction,
    // -- parent-series slopes (the contrast anchors) --
    peakHeightSlope,
    peakHeightR2,
    troughFloorSlope,
    // -- growth decomposition --
    decompositionResidual,
    ampMinusPeakSlope,
    // -- half-split --
    firstHalfMean,
    secondHalfMean,
    halfSplitDelta: secondHalfMean - firstHalfMean,
    // -- verdict flags --
    seriesCommensurable,
    amplitudeGrowsPositive,
    amplitudeBelowPeakGrowth,
    decompositionHolds,
    amplitudeFitWeak,
    trendDrivenByTailOutliers,
    verdict,
    rows: Object.freeze(AMPLITUDES.map((a) => Object.freeze({ ...a }))),
  }),

  interpretation: Object.freeze({
    amplitudeFormed:
      'The imp-33660 sixteen peak heights and the imp-33662 fifteen trough floors -- both off the SAME grade-4 ' +
      'floorUlp(n) +/-5 rolling-max [400,1200] scan -- are differenced by pairing each peak with its bracketing ' +
      'troughs, so the amplitude series runs off the two commensurable parent series, not transcribed literals.',
    amplitudeGrowsButWeakly:
      'The linear amplitude fit has a positive slope ~+0.054 ULP/rung and reduces the residual RMS from ~21.3 ' +
      '(null) to ~18.4, an ~14% reduction -- so the peak-to-trough amplitude DOES grow. But R^2 ~0.25 is weak: ' +
      'the trend explains only a quarter of the amplitude variance.',
    amplitudeBelowPeakGrowth:
      'The amplitude slope ~+0.054 is BELOW the imp-33660 peak-HEIGHT slope ~+0.067 by almost exactly the ' +
      'imp-33662 trough slope ~+0.013. The amplitude grows SLOWER than the peaks, not faster: subtracting a ' +
      'near-flat but slightly-rising floor pulls the amplitude slope DOWN below the peak slope.',
    premiseRefuted:
      'This REFUTES the ticket premise that flat troughs would make the amplitude growth EXCEED the peak-height ' +
      'growth. The troughs are not exactly flat -- imp-33662 measured a small positive floor slope ~+0.013 -- so ' +
      'the amplitude growth EQUALS the peak growth minus that floor slope, landing below the peak growth. Only a ' +
      'DECLINING floor would push amplitude growth above peak growth.',
    decompositionHolds:
      'The identity b_amp ~ b_peak - b_floor holds to ~0.001 ULP/rung (the tiny residual is from the per-peak ' +
      'averaging of bracketing troughs and the two single-bracket endpoint peaks), confirming the amplitude is a ' +
      'clean difference of the two parent series, not an independent envelope quantity.',
    tailOutlierDriven:
      'The positive amplitude trend is carried almost entirely by the two tallest imp-33638 tail clusters (~91 ULP ' +
      'at n~1126 and n~1198); the first fourteen amplitudes sit in a flat ~17..56 ULP band. Removing the two tail ' +
      'outliers would flatten the trend, which is why the fit is weak and jitter-limited.',
    verdictWeakPositiveBelowPeak:
      'VERDICT: AMPLITUDE-GROWS-WEAKLY-POSITIVE-BUT-BELOW-THE-PEAK-GROWTH. The peak-to-trough amplitude grows ' +
      'weakly and positively, but slower than the peaks because the floor still carries a small positive slope; ' +
      'the trend is two-outlier-driven and jitter-limited. The amplitude inherits the peaks weak positive ' +
      'character rather than revealing an independent amplification of the envelope.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'Differences the imp-33660 sixteen cluster-peak HEIGHTS against the imp-33662 fifteen inter-cluster TROUGH ' +
      'floors (both re-derived off the same grade-4 floorUlp(n) +/-5 rolling-max scan over [400,1200]) into a ' +
      'peak-to-trough amplitude series, fits amp-vs-n, and classifies the growth as weak-positive / below-peak. ' +
      'It changes NO bound, patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33660/imp-33662/imp-33638/imp-33621/imp-33599/' +
      'imp-33557/imp-33539/imp-33316/imp-33213; this differences the two located series, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33277/imp-33296/imp-33537/' +
      'imp-33557/imp-33579/imp-33599/imp-33621/imp-33638/imp-33660/imp-33662): the exact per-rung ULP bounces ' +
      'and cross-platform libm exp/pow variation can shift the peak heights, the trough floors, and hence the ' +
      '~+0.054 amplitude slope, the ~0.25 R^2, and the ~18.4 residual RMS. The robust reading is the QUALITATIVE ' +
      'conclusion -- the amplitude grows weakly-positive but below the peak growth, driven by two tall tail ' +
      'clusters -- not the exact fit coefficients.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33681_PEAK_MINUS_TROUGH_AMPLITUDE_SERIES_ASSERTIONS = [
  {
    id: 'imp33681-series-commensurable',
    why: 'Both parent series must be present and commensurable: >= 15 peaks, >= 14 troughs, and one amplitude ' +
         'per peak so the difference runs off the same [400,1200] floorUlp scan.',
    holds: () => seriesCommensurable && peakNs.length >= 15 && amps.length === peakNs.length,
  },
  {
    id: 'imp33681-amplitude-grows-positive',
    why: 'The peak-to-trough amplitude must GROW: the linear fit slope must be positive and beat the null/constant ' +
         'residual RMS.',
    holds: () => amplitudeGrowsPositive && ampSlope > 0 && ampRms < constRms,
  },
  {
    id: 'imp33681-amplitude-below-peak-growth',
    why: 'THE HEADLINE: the amplitude slope must be BELOW the imp-33660 peak-HEIGHT slope -- the amplitude grows ' +
         'slower than the peaks because the near-flat floor carries a small positive slope (premise REFUTED).',
    holds: () => amplitudeBelowPeakGrowth && ampSlope < peakHeightSlope,
  },
  {
    id: 'imp33681-decomposition-holds',
    why: 'The decomposition b_amp ~ b_peak - b_floor must hold to ~0.005 ULP/rung, confirming the amplitude is a ' +
         'clean difference of the two parent series.',
    holds: () => decompositionHolds && Math.abs(decompositionResidual) < 0.005,
  },
  {
    id: 'imp33681-amplitude-fit-weak',
    why: 'The amplitude fit must be weak (R^2 < 0.5) -- the trend explains at most a quarter to a third of the ' +
         'amplitude variance, jitter-limited.',
    holds: () => amplitudeFitWeak && ampR2 < 0.5,
  },
  {
    id: 'imp33681-trend-driven-by-tail-outliers',
    why: 'The largest amplitude must be a deep-tail (n > 1000) point above 80 ULP -- the imp-33638 tail ' +
         're-intensification that carries the positive amplitude trend.',
    holds: () => trendDrivenByTailOutliers && ampMax > 80 && ampArgMaxN > 1000,
  },
  {
    id: 'imp33681-verdict-records-weak-positive-below-peak',
    why: 'The classified verdict must record the AMPLITUDE-GROWS-WEAKLY-POSITIVE-BUT-BELOW-THE-PEAK-GROWTH reading, ' +
         'not indeterminate.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33681-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33681_PEAK_MINUS_TROUGH_AMPLITUDE_SERIES.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33681_PEAK_MINUS_TROUGH_AMPLITUDE_SERIES_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33681-peak-minus-trough-amplitude-series-n400-1200 assertion failed: ${assertion.id}`);
  }
}
