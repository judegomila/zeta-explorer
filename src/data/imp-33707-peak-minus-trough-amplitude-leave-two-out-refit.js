/**
 * @module imp-33707-peak-minus-trough-amplitude-leave-two-out-refit
 * @fileoverview imp-33707 -- LEAVE-TWO-OUT refit of the imp-33681 peak-minus-trough AMPLITUDE slope,
 *   EXCLUDING the two tallest imp-33638 tail clusters (~91 ULP at n~1126 and n~1198), to CROSS-CHECK
 *   whether removing them collapses the imp-33681 amplitude slope the SAME WAY imp-33680 collapsed the
 *   imp-33660 peak-HEIGHT slope -- and to ASSESS whether the amplitude trend is LIKEWISE a two-point
 *   artifact rather than a distributed envelope-amplification law.
 *
 *   WHAT imp-33681 LEFT UNTESTED
 *   ---------------------------
 *   imp-33681 differenced the imp-33660 sixteen cluster-peak HEIGHTS against the imp-33662 fifteen
 *   inter-cluster TROUGH floors into a peak-to-trough AMPLITUDE series and found a WEAK positive slope
 *   (~ +0.054 ULP/rung, R^2 ~0.25, residual RMS ~18.4 vs ~21.3 null). It NOTED -- but never MEASURED --
 *   that "the growth is concentrated almost entirely in the same two tallest imp-33638 tail clusters
 *   (~91 ULP at n~1126 and n~1198); the first fourteen amplitudes sit in a flat ~17..56 ULP band," and
 *   that "removing the two tail outliers would flatten the trend." Meanwhile imp-33680 ran EXACTLY that
 *   leave-two-out exclusion on the imp-33660 HEIGHT series and found the height slope collapsed to ~1/9.
 *   The parallel test was never run on the AMPLITUDE series: does the amplitude slope collapse the same
 *   way, or does the amplitude carry an independent trend the heights do not? This module runs it.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Take (n_i, amp_i) = the imp-33681 measured.peakNs / measured.amplitudes (sixteen peak-to-trough
 *   amplitudes over [400,1200]). Identify the two indices of largest amp_i (the imp-33638 tail
 *   clusters). Form the leave-two-out sample of the remaining fourteen amplitudes and refit:
 *     (CONST)  amp_i = c                 (mean; residual RMS = leave-two-out amplitude sd -- the null),
 *     (LINEAR) amp_i = a + b*n_i         (constant-rate growth),
 *     (SQRT)   amp_i = a + b*sqrt(n_i)   (sub-linear, concave),
 *     (LOG)    amp_i = a + b*log(n_i)    (sub-linear, strongly concave).
 *   Report the leave-two-out slope, R^2 and residual RMS for each and compare against the full-sample
 *   fit (imp-33681 measured.ampSlope / ampR2 / constRms). Then CROSS-CHECK the amplitude slope-survival
 *   ratio against the imp-33680 HEIGHT slope-survival ratio to see whether the amplitude collapses the
 *   same way, harder, or softer than the height did.
 *
 *   THE HEADLINE RESULT -- AMPLITUDE SLOPE COLLAPSES EVEN HARDER; LIKEWISE A TWO-POINT ARTIFACT
 *   ------------------------------------------------------------------------------------------
 *   Removing the two tallest tail clusters COLLAPSES the amplitude trend even harder than it collapsed
 *   the height trend:
 *     - the linear amplitude slope drops from ~ +0.0537 ULP/rung (full sixteen) to ~ +0.0019 ULP/rung
 *       (fourteen) -- roughly ONE-TWENTY-EIGHTH of the full slope (slope survival ~0.036), versus the
 *       imp-33680 HEIGHT slope survival ~0.115; the amplitude slope collapses ~3x harder than the height;
 *     - the linear R^2 drops from ~0.254 (full) to ~0.0011 (fourteen) -- an ~99.5% collapse (R^2 survival
 *       ~0.0045, versus the imp-33680 height R^2 survival ~0.145); the fit now explains under 0.2% of the
 *       fourteen-amplitude variance;
 *     - the linear fit no longer beats its OWN null: leave-two-out residual RMS ~10.19 vs the
 *       fourteen-amplitude sd ~10.20, an ~0.06% reduction -- versus the ~13.6% reduction (~18.4 vs ~21.3)
 *       on the full sixteen. The amplitude dispersion collapses from sd ~21.3 (sixteen) to sd ~10.2
 *       (fourteen): the remaining fourteen ARE the flat ~17..56 ULP band imp-33681 described (mean ~33.9).
 *   All three concave laws behave identically -- sqrt and log R^2 also collapse to ~0.0004 / ~0.0. So the
 *   imp-33681 weak-positive amplitude trend is NOT genuinely distributed across the sixteen peaks: it is a
 *   TWO-POINT artifact carried entirely by the two tallest imp-33638 tail clusters, EXACTLY as the height
 *   trend was -- and the amplitude collapses even more completely because the difference amp = peak - floor
 *   subtracts most of the flat-band common level, leaving the two ~91 ULP tail spikes as the whole trend.
 *
 *   VERDICT. AMPLITUDE-SLOPE-COLLAPSES-EVEN-HARDER-TREND-IS-LIKEWISE-A-TWO-POINT-ARTIFACT. Excluding the
 *   two tallest imp-33638 tail clusters (~90.9 ULP n~1126, ~91.9 n~1198) collapses the imp-33681 linear
 *   amplitude slope from ~ +0.0537 to ~ +0.0019 ULP/rung (survival ~0.036), the linear R^2 from ~0.254 to
 *   ~0.0011 (survival ~0.0045), and the residual-RMS reduction over null from ~13.6% to ~0.06%. Both are
 *   SMALLER survival ratios than the imp-33680 HEIGHT leave-two-out (slope survival ~0.115, R^2 survival
 *   ~0.145), so the amplitude slope collapses the SAME WAY -- in fact harder -- than the height slope. The
 *   remaining fourteen amplitudes are a flat ~17..56 ULP band (mean ~33.9, sd ~10.2 vs ~21.3 for all
 *   sixteen); the concave sqrt/log laws also collapse to R^2 ~0.0004/0.0. The imp-33681 weak-positive
 *   amplitude trend is a TWO-POINT artifact of the imp-33638 tail re-intensification, NOT a distributed
 *   envelope-amplification law. Consistent with the imp-33681 / imp-33680 / imp-33660 / imp-33638
 *   latticeJitterCaveat.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It is a leave-two-out
 *   robustness refit of a jittery arithmetic-floor lattice statistic (the imp-33681 peak-to-trough
 *   amplitude, itself a difference of two jittery series); it changes NO bound, patches NO literal, and
 *   establishes NO operator positivity. floorUlp(n) is a JITTERY lattice property (the imp-33249 /
 *   imp-33660 / imp-33662 / imp-33681 latticeJitterCaveat): the exact per-rung ULP bounces and
 *   cross-platform libm exp/pow variation can shift the exact peak heights, the trough floors, the
 *   amplitudes, and hence every slope / R^2 / residual RMS / survival ratio here. The robust reading is
 *   the QUALITATIVE conclusion -- the amplitude trend collapses when the two tallest tail clusters are
 *   removed, at least as hard as the height trend did, so it is likewise a two-point artifact -- not the
 *   exact coefficients. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the SOTA.
 *
 *   @see imp-33681-peak-minus-trough-amplitude-series-n400-1200.js (the full-sixteen amplitude fit this refits robustly)
 *   @see imp-33680-cluster-peak-height-leave-two-out-refit.js (the parallel HEIGHT leave-two-out cross-checked here)
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the two [900,1200] tail clusters removed)
 *
 *   Ticket: imp-33707 (accuracy, medium).
 */

import {
  IMP33681_PEAK_MINUS_TROUGH_AMPLITUDE_SERIES,
} from './imp-33681-peak-minus-trough-amplitude-series-n400-1200.js';
import {
  IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT,
} from './imp-33680-cluster-peak-height-leave-two-out-refit.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- The EXACT sixteen imp-33681 peak-to-trough amplitudes (re-derivation-free; frozen import) ------
const FULL = IMP33681_PEAK_MINUS_TROUGH_AMPLITUDE_SERIES.measured;
const peakNs = FULL.peakNs.slice();
const amplitudes = FULL.amplitudes.slice();

// -- Least-squares slope/intercept/r^2/residual-RMS helper (same rule as imp-33681/imp-33680 lsqFit) -
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

function sdOf(arr) {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const varr = arr.reduce((a, b) => a + (b - mean) * (b - mean), 0) / arr.length;
  return { mean, sd: Math.sqrt(varr) };
}

// -- Identify the two TALLEST amplitudes (the imp-33638 tail clusters) and drop them ----------------
const idxByAmpDesc = amplitudes
  .map((a, i) => ({ a, i }))
  .sort((x, y) => y.a - x.a)
  .map((o) => o.i);
const droppedIdx = [idxByAmpDesc[0], idxByAmpDesc[1]].sort((a, b) => a - b);
const droppedNs = droppedIdx.map((i) => peakNs[i]);
const droppedAmps = droppedIdx.map((i) => amplitudes[i]);

const keepIdx = peakNs.map((_, i) => i).filter((i) => !droppedIdx.includes(i));
const keepNs = keepIdx.map((i) => peakNs[i]);
const keepAmps = keepIdx.map((i) => amplitudes[i]);

// -- Full-sample amplitude fit values, imported straight from imp-33681 (no re-fit) ----------------
const fullAmpSlope = FULL.ampSlope;
const fullAmpR2 = FULL.ampR2;
const fullConstRms = FULL.constRms;      // = full-sample amplitude sd (null model)
const fullAmpRms = FULL.ampRms;
const fullAmpResidualReduction = fullConstRms > 0 ? (fullConstRms - fullAmpRms) / fullConstRms : 0;

// -- Leave-two-out refits on the remaining fourteen amplitudes ------------------------------------
const keepDisp = sdOf(keepAmps);          // the fourteen-amplitude null-model dispersion (mean, sd)
const l2oConstRms = keepDisp.sd;          // CONST null-model residual RMS on the fourteen
const l2oLinFit = lsqFit(keepAmps.map((a, i) => ({ x: keepNs[i], y: a })));
const l2oSqrtFit = lsqFit(keepAmps.map((a, i) => ({ x: Math.sqrt(keepNs[i]), y: a })));
const l2oLogFit = lsqFit(keepAmps.map((a, i) => ({ x: Math.log(keepNs[i]), y: a })));
const l2oLinearResidualReduction = l2oConstRms > 0 ? (l2oConstRms - l2oLinFit.rms) / l2oConstRms : 0;

// -- Collapse ratios: how much of the full amplitude trend survives the leave-two-out --------------
const slopeSurvivalRatio = fullAmpSlope !== 0 ? l2oLinFit.slope / fullAmpSlope : 0;   // ~0.036
const r2SurvivalRatio = fullAmpR2 !== 0 ? l2oLinFit.r2 / fullAmpR2 : 0;               // ~0.0045
const ampSdCollapseRatio = fullConstRms > 0 ? l2oConstRms / fullConstRms : 0;         // ~0.48

// -- CROSS-CHECK vs the imp-33680 HEIGHT leave-two-out: does the amplitude collapse the SAME WAY? ---
const HEIGHT = IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT.measured;
const heightSlopeSurvivalRatio = HEIGHT.slopeSurvivalRatio;   // ~0.115
const heightR2SurvivalRatio = HEIGHT.r2SurvivalRatio;         // ~0.145
// The amplitude slope survival is smaller than the height slope survival => amplitude collapses HARDER.
const amplitudeCollapsesAtLeastAsHardAsHeight = slopeSurvivalRatio <= heightSlopeSurvivalRatio;
// Both leave-two-out refits drop the SAME two deep-tail rungs (n~1126, n~1198).
const sameTwoRungsDroppedAsHeight =
  droppedNs.length === 2 && HEIGHT.droppedNs.length === 2 &&
  droppedNs.every((n, i) => n === HEIGHT.droppedNs[i]);

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Exactly the two tallest amplitudes were removed, both deep-tail (n > 1000) imp-33638 clusters > 80 ULP.
const droppedTwoTailClusters =
  droppedIdx.length === 2 && droppedNs.every((n) => n > 1000) && droppedAmps.every((a) => a > 80);
// (2) The amplitude linear slope COLLAPSES: leave-two-out slope is under a third of the full slope.
const slopeCollapses = slopeSurvivalRatio < 0.33 && Math.abs(l2oLinFit.slope) < Math.abs(fullAmpSlope);
// (3) The amplitude linear R^2 COLLAPSES: leave-two-out R^2 is under a third of the full R^2 and itself weak.
const r2Collapses = r2SurvivalRatio < 0.33 && l2oLinFit.r2 < 0.15;
// (4) The leave-two-out linear fit no longer beats its OWN null (residual reduction under ~5%),
//     versus the ~13.6% reduction on the full sixteen -- the trend no longer improves on flat.
const barelyBeatsNull = l2oLinearResidualReduction < 0.05 && fullAmpResidualReduction > 0.10;
// (5) The remaining fourteen are a FLAT band: their amplitude sd collapses to under half the full sd.
const remainderIsFlatBand = ampSdCollapseRatio < 0.5;
// (6) The concave (sqrt/log) laws ALSO collapse -- no sub-linear law rescues the amplitude trend.
const concaveAlsoCollapses = l2oSqrtFit.r2 < 0.15 && l2oLogFit.r2 < 0.15;
// (7) THE CROSS-CHECK: the amplitude collapses the SAME WAY as the height -- same two rungs, at least as hard.
const collapsesSameWayAsHeight = sameTwoRungsDroppedAsHeight && amplitudeCollapsesAtLeastAsHardAsHeight;
// (8) THE HEADLINE: the amplitude trend is LIKEWISE a TWO-POINT artifact.
const trendIsTwoPointArtifact =
  droppedTwoTailClusters && slopeCollapses && r2Collapses && barelyBeatsNull && remainderIsFlatBand;

const verdict =
  droppedTwoTailClusters && slopeCollapses && r2Collapses && barelyBeatsNull &&
  remainderIsFlatBand && concaveAlsoCollapses && collapsesSameWayAsHeight && trendIsTwoPointArtifact
    ? 'AMPLITUDE-SLOPE-COLLAPSES-EVEN-HARDER-TREND-IS-LIKEWISE-A-TWO-POINT-ARTIFACT.-LEAVE-TWO-OUT-REFIT-OF-' +
      'THE-imp-33681-SIXTEEN-PEAK-MINUS-TROUGH-AMPLITUDES-EXCLUDING-THE-TWO-TALLEST-imp-33638-TAIL-CLUSTERS-' +
      '(~90.9-ULP-n~1126,-~91.9-n~1198)-COLLAPSES-THE-LINEAR-AMPLITUDE-SLOPE-FROM-~+0.0537-TO-~+0.0019-ULP/RUNG-' +
      '(SURVIVAL~0.036),-THE-LINEAR-R^2-FROM-~0.254-TO-~0.0011-(SURVIVAL~0.0045),-AND-THE-RESIDUAL-RMS-REDUCTION-' +
      'OVER-NULL-FROM-~13.6%-TO-~0.06%.-BOTH-SURVIVAL-RATIOS-ARE-SMALLER-THAN-THE-imp-33680-HEIGHT-LEAVE-TWO-OUT-' +
      '(SLOPE-SURVIVAL~0.115,-R^2-SURVIVAL~0.145),-SO-THE-AMPLITUDE-SLOPE-COLLAPSES-THE-SAME-WAY-IN-FACT-HARDER-' +
      'THAN-THE-HEIGHT-SLOPE.-THE-REMAINING-FOURTEEN-AMPLITUDES-ARE-A-FLAT-~17..56-ULP-BAND-(MEAN-~33.9,-SD-~10.2-' +
      'VS-~21.3-FOR-ALL-SIXTEEN);-THE-CONCAVE-SQRT/LOG-LAWS-ALSO-COLLAPSE-TO-R^2~0.0004/0.0.-THE-imp-33681-WEAK-' +
      'POSITIVE-AMPLITUDE-TREND-IS-A-TWO-POINT-ARTIFACT-OF-THE-imp-33638-TAIL-RE-INTENSIFICATION,-NOT-A-' +
      'DISTRIBUTED-ENVELOPE-AMPLIFICATION-LAW.-CONSISTENT-WITH-THE-imp-33681/imp-33680/imp-33660/imp-33638-' +
      'latticeJitterCaveat.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-FLOOR;-mass-feasibility-' +
      'NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33707_PEAK_MINUS_TROUGH_AMPLITUDE_LEAVE_TWO_OUT_REFIT = Object.freeze({
  id: 'imp-33707-peak-minus-trough-amplitude-leave-two-out-refit',
  ticket: 'imp-33707',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33681-peak-minus-trough-amplitude-series-n400-1200.js',
  crossValidatesModules: [
    'imp-33681-peak-minus-trough-amplitude-series-n400-1200.js',
    'imp-33680-cluster-peak-height-leave-two-out-refit.js',
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
  ],

  summary:
    'LEAVE-TWO-OUT robustness refit of the imp-33681 peak-minus-trough AMPLITUDE slope, cross-checking against ' +
    'the imp-33680 HEIGHT leave-two-out: drops the two TALLEST imp-33638 tail clusters (~90.9 ULP n~1126, ~91.9 ' +
    'n~1198) from the sixteen amplitudes (imported from imp-33681, no re-derivation) and refits constant/linear/' +
    'sqrt/log on the remaining fourteen. RESULT: the amplitude trend COLLAPSES even harder than the height did -- ' +
    'linear slope drops from ~ +0.0537 to ~ +0.0019 ULP/rung (survival ~0.036 vs the imp-33680 height ~0.115), ' +
    'linear R^2 from ~0.254 to ~0.0011 (survival ~0.0045 vs height ~0.145), and the residual-RMS reduction over ' +
    'null from ~13.6% to ~0.06%; the remaining fourteen are a flat ~17..56 ULP band (mean ~33.9, sd ~10.2 vs ~21.3 ' +
    'for all sixteen), and the concave sqrt/log laws also collapse to R^2 ~0.0004/0.0. Both leave-two-out refits ' +
    'drop the SAME two rungs (n~1126, n~1198). VERDICT: AMPLITUDE-SLOPE-COLLAPSES-EVEN-HARDER-TREND-IS-LIKEWISE-A-' +
    'TWO-POINT-ARTIFACT -- the imp-33681 weak-positive amplitude trend is carried ENTIRELY by the two tallest tail ' +
    'clusters, exactly as the height trend was, NOT a distributed envelope-amplification law. ACCURACY/RULE-DESIGN ' +
    'MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery lattice floor; operator positivity ' +
    '(imp-3066) untouched; no QED. PT Lambda <= 0.2 SOTA.',

  method: Object.freeze({
    source: 'the EXACT sixteen imp-33681 measured.peakNs / measured.amplitudes (frozen import; no re-derivation)',
    drop: 'identify the two indices of largest amplitude (the imp-33638 tail clusters) and exclude them',
    modelConst: 'null model amp_i = mean of the remaining fourteen; residual RMS is the fourteen-amplitude sd',
    modelLinear: 'amp_i = a + b*n_i on the fourteen; report slope, R^2, residual RMS',
    modelSqrt: 'amp_i = a + b*sqrt(n_i) on the fourteen; report slope, R^2, residual RMS',
    modelLog: 'amp_i = a + b*log(n_i) on the fourteen; report slope, R^2, residual RMS',
    compare: 'tabulate slope / R^2 / residual-RMS-reduction against the imp-33681 full-sixteen amplitude fit',
    survivalRatios: 'slope survival = l2o slope / full slope; R^2 survival = l2o R^2 / full R^2; sd collapse = l2o sd / full sd',
    crossCheck: 'compare the amplitude slope/R^2 survival ratios against the imp-33680 HEIGHT survival ratios; both drop the same two rungs',
    selfComputing: 'the drop, all leave-two-out fits, the survival ratios, the height cross-check, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    amplitudeCount: peakNs.length,
    peakNs: Object.freeze(peakNs.slice()),
    amplitudes: Object.freeze(amplitudes.slice()),
    droppedIdx: Object.freeze(droppedIdx.slice()),
    droppedNs: Object.freeze(droppedNs.slice()),
    droppedAmps: Object.freeze(droppedAmps.slice()),
    keepNs: Object.freeze(keepNs.slice()),
    keepAmps: Object.freeze(keepAmps.slice()),
    keepCount: keepNs.length,
    // -- full-sixteen amplitude fit (imported from imp-33681) --
    fullAmpSlope,
    fullAmpR2,
    fullConstRms,
    fullAmpRms,
    fullAmpResidualReduction,
    // -- leave-two-out null (constant) --
    l2oAmpMean: keepDisp.mean,
    l2oConstRms,
    // -- leave-two-out LINEAR --
    l2oLinSlope: l2oLinFit.slope,
    l2oLinIntercept: l2oLinFit.intercept,
    l2oLinR2: l2oLinFit.r2,
    l2oLinRms: l2oLinFit.rms,
    l2oLinearResidualReduction,
    // -- leave-two-out SQRT --
    l2oSqrtSlope: l2oSqrtFit.slope,
    l2oSqrtR2: l2oSqrtFit.r2,
    l2oSqrtRms: l2oSqrtFit.rms,
    // -- leave-two-out LOG --
    l2oLogSlope: l2oLogFit.slope,
    l2oLogR2: l2oLogFit.r2,
    l2oLogRms: l2oLogFit.rms,
    // -- collapse / survival ratios --
    slopeSurvivalRatio,
    r2SurvivalRatio,
    ampSdCollapseRatio,
    // -- cross-check vs the imp-33680 HEIGHT leave-two-out --
    heightSlopeSurvivalRatio,
    heightR2SurvivalRatio,
    amplitudeCollapsesAtLeastAsHardAsHeight,
    sameTwoRungsDroppedAsHeight,
    // -- verdict flags --
    droppedTwoTailClusters,
    slopeCollapses,
    r2Collapses,
    barelyBeatsNull,
    remainderIsFlatBand,
    concaveAlsoCollapses,
    collapsesSameWayAsHeight,
    trendIsTwoPointArtifact,
    verdict,
  }),

  interpretation: Object.freeze({
    twoTallestRemoved:
      'The two removed amplitudes are the imp-33638 tail clusters at n ~ 1126 (~90.9 ULP) and n ~ 1198 (~91.9 ULP), ' +
      'both deep-tail (n > 1000) and both above 80 ULP -- exactly the pair imp-33681 flagged as carrying the ' +
      'positive amplitude trend, and the SAME two rungs imp-33680 dropped from the height series.',
    slopeCollapses:
      'Removing them collapses the linear amplitude slope from ~ +0.0537 ULP/rung (full sixteen) to ~ +0.0019 ' +
      'ULP/rung (fourteen) -- roughly one-twenty-eighth of the full slope. The R^2 collapses from ~0.254 to ~0.0011, ' +
      'a ~99.5% reduction; the fit now explains under 0.2% of the (already tiny) fourteen-amplitude variance.',
    barelyBeatsNull:
      'On the fourteen, the linear fit no longer beats its own null: residual RMS ~10.19 vs the fourteen-amplitude sd ' +
      '~10.20, a ~0.06% reduction -- versus the ~13.6% reduction (~18.4 vs ~21.3) on the full sixteen. The amplitude ' +
      'dispersion collapses from sd ~21.3 to sd ~10.2: the remaining fourteen ARE the flat ~17..56 ULP band ' +
      '(mean ~33.9 ULP) imp-33681 described.',
    collapsesHarderThanHeight:
      'The amplitude slope survival ~0.036 and R^2 survival ~0.0045 are BOTH smaller than the imp-33680 HEIGHT ' +
      'survival ratios (slope ~0.115, R^2 ~0.145), so the amplitude slope collapses the SAME WAY -- in fact ~3x ' +
      'harder -- than the height slope. Differencing amp = peak - floor subtracts most of the flat-band common ' +
      'level, so the two ~91 ULP tail spikes stand out even more sharply against the fourteen-point band, which is ' +
      'why the amplitude trend is even more concentrated in the two outliers than the height trend was.',
    concaveAlsoCollapses:
      'The concave sub-linear laws do not rescue the amplitude trend: leave-two-out sqrt(n) R^2 ~0.0004 and log R^2 ' +
      '~0.0, both as collapsed as the linear fit. No candidate law finds a distributed amplitude trend once the two ' +
      'outliers are gone.',
    verdictTwoPointArtifact:
      'VERDICT: AMPLITUDE-SLOPE-COLLAPSES-EVEN-HARDER-TREND-IS-LIKEWISE-A-TWO-POINT-ARTIFACT. The imp-33681 ' +
      'weak-positive amplitude trend is NOT genuinely distributed across the sixteen peaks; it is carried entirely ' +
      'by the two tallest imp-33638 tail clusters, exactly as the imp-33660 height trend was (imp-33680). This ' +
      'confirms imp-33681s own note that removing the two tail outliers flattens the amplitude, and bounds any tail ' +
      'band-clearing amplitude claim to a two-point re-intensification, not an envelope-amplification law.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'A leave-two-out robustness refit of the imp-33681 sixteen peak-minus-trough AMPLITUDES (imported from ' +
      'imp-33681, no re-derivation): drops the two tallest imp-33638 tail clusters, refits constant/linear/sqrt/log ' +
      'on the remaining fourteen, and cross-checks the survival ratios against the imp-33680 HEIGHT leave-two-out, ' +
      'classifying the amplitude trend as likewise a two-point artifact. It changes NO bound, patches NO literal, ' +
      'and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33681/imp-33660/imp-33662/imp-33638 upstream; this ' +
      'refits the amplitude of the located cluster peaks, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33660/imp-33662/imp-33681): the ' +
      'exact per-rung ULP bounces and cross-platform libm exp/pow variation can shift the exact peak heights, the ' +
      'trough floors, the amplitudes, and hence the leave-two-out slope ~+0.0019, R^2 ~0.0011, the ~0.06% residual ' +
      'reduction, and the ~0.036/~0.0045 survival ratios. The robust reading is the QUALITATIVE conclusion -- the ' +
      'amplitude trend collapses when the two tallest tail clusters are removed, at least as hard as the height ' +
      'trend, so it is likewise a two-point artifact -- not the exact coefficients.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33707_PEAK_MINUS_TROUGH_AMPLITUDE_LEAVE_TWO_OUT_REFIT_ASSERTIONS = [
  {
    id: 'imp33707-uses-imp33681-sixteen-amplitudes',
    why: 'The refit must run off the EXACT sixteen imp-33681 peak-minus-trough amplitudes (>= 14), imported from ' +
         'its frozen export, with the two tallest dropped leaving the rest.',
    holds: () => peakNs.length >= 14 && keepNs.length === peakNs.length - 2,
  },
  {
    id: 'imp33707-dropped-two-tail-clusters',
    why: 'The two removed amplitudes must be the imp-33638 deep-tail (n > 1000) clusters above 80 ULP -- the pair ' +
         'imp-33681 flagged as carrying the positive amplitude trend.',
    holds: () => droppedTwoTailClusters && droppedNs.every((n) => n > 1000) && droppedAmps.every((a) => a > 80),
  },
  {
    id: 'imp33707-linear-slope-collapses',
    why: 'THE HEADLINE: the leave-two-out amplitude slope must collapse to under a third of the full slope and be ' +
         'smaller in magnitude -- the amplitude trend does not survive the removal of the two outliers.',
    holds: () => slopeCollapses && slopeSurvivalRatio < 0.33,
  },
  {
    id: 'imp33707-r2-collapses',
    why: 'The leave-two-out amplitude R^2 must collapse to under a third of the full R^2 and be itself weak (< 0.15).',
    holds: () => r2Collapses && r2SurvivalRatio < 0.33 && l2oLinFit.r2 < 0.15,
  },
  {
    id: 'imp33707-barely-beats-null',
    why: 'On the fourteen, the linear fit must barely beat its own null (residual reduction < 5%), versus the ' +
         '> 10% reduction on the full sixteen -- the amplitude trend no longer improves on flat.',
    holds: () => barelyBeatsNull && l2oLinearResidualReduction < 0.05 && fullAmpResidualReduction > 0.10,
  },
  {
    id: 'imp33707-remainder-is-flat-band',
    why: 'The remaining fourteen must be a flat band: their amplitude sd collapses to under half the full-sixteen sd.',
    holds: () => remainderIsFlatBand && ampSdCollapseRatio < 0.5,
  },
  {
    id: 'imp33707-concave-also-collapses',
    why: 'No sub-linear law rescues the amplitude trend: leave-two-out sqrt(n) and log R^2 must also collapse (< 0.15).',
    holds: () => concaveAlsoCollapses && l2oSqrtFit.r2 < 0.15 && l2oLogFit.r2 < 0.15,
  },
  {
    id: 'imp33707-collapses-same-way-as-height',
    why: 'THE CROSS-CHECK: both leave-two-out refits must drop the SAME two rungs, and the amplitude slope survival ' +
         'must be no larger than the imp-33680 height slope survival -- the amplitude collapses the same way, at ' +
         'least as hard, as the height.',
    holds: () => collapsesSameWayAsHeight && sameTwoRungsDroppedAsHeight &&
                 slopeSurvivalRatio <= heightSlopeSurvivalRatio,
  },
  {
    id: 'imp33707-verdict-two-point-artifact',
    why: 'THE HEADLINE: the amplitude trend is LIKEWISE a two-point artifact -- it collapses when the two tallest ' +
         'are removed -- and the classified verdict records that, not indeterminate.',
    holds: () => trendIsTwoPointArtifact && verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33707-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33707_PEAK_MINUS_TROUGH_AMPLITUDE_LEAVE_TWO_OUT_REFIT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isCertifiedErrorBound === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33707_PEAK_MINUS_TROUGH_AMPLITUDE_LEAVE_TWO_OUT_REFIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33707-peak-minus-trough-amplitude-leave-two-out-refit assertion failed: ${assertion.id}`);
  }
}
