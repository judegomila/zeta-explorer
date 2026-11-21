/**
 * @module imp-33680-cluster-peak-height-leave-two-out-refit
 * @fileoverview imp-33680 -- LEAVE-TWO-OUT refit of the imp-33660 cluster-peak envelope-HEIGHT growth
 *   slope, EXCLUDING the two tallest imp-33638 tail clusters (~143.6 ULP at n~1126, ~135.0 at n~1198),
 *   and MEASURE whether the weak-positive slope (~ +0.067 ULP/rung) SURVIVES the removal of the two
 *   outliers or COLLAPSES to the null/flat band -- testing whether the height trend is genuinely
 *   distributed across the sixteen peaks or is a TWO-POINT artifact.
 *
 *   WHAT imp-33660 LEFT UNTESTED
 *   ----------------------------
 *   imp-33660 fit the sixteen imp-33599 [400,700] + imp-33621 [700,900] + imp-33638 [900,1200]
 *   band-clearing cluster-peak HEIGHTS to four candidate laws and returned a WEAK positive linear
 *   slope (~ +0.067 ULP/rung, R^2 ~ 0.33, residual RMS ~19.1 vs ~23.3 null). It noted -- but never
 *   MEASURED -- that "the positive trend is concentrated almost entirely in the two TALLEST imp-33638
 *   tail clusters ... the first fourteen peaks sit in a flat ~64..86 ULP band," and that "removing the
 *   two tail outliers would flatten the trend." This module performs exactly that robustness test: it
 *   takes the EXACT sixteen peaks imp-33660 computed (imported from its frozen export, so no
 *   re-derivation drift), drops the two tallest, and refits all four candidate laws on the remaining
 *   fourteen, tabulating slope / R^2 / residual RMS against the full-sample fit.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Take (n_i, h_i) = the imp-33660 measured.peakNs / measured.peakHeights (sixteen band-clearing
 *   cluster peaks over [400,1200]). Identify the two indices of largest h_i (the imp-33638 tail
 *   clusters). Form the leave-two-out sample of the remaining fourteen peaks and refit:
 *     (CONST)  h_i = c                 (mean; residual RMS = leave-two-out height sd -- the null model),
 *     (LINEAR) h_i = a + b*n_i         (constant-rate growth),
 *     (SQRT)   h_i = a + b*sqrt(n_i)   (sub-linear, concave),
 *     (LOG)    h_i = a + b*log(n_i)    (sub-linear, strongly concave).
 *   Report the leave-two-out slope, R^2 and residual RMS for each and compare against the full-sample
 *   fit (imp-33660 measured.linSlope / linR2 / constRms).
 *
 *   THE HEADLINE RESULT -- SLOPE COLLAPSES; THE TREND IS A TWO-POINT ARTIFACT
 *   ------------------------------------------------------------------------
 *   Removing the two tallest tail clusters COLLAPSES the height trend:
 *     - the linear slope drops from ~ +0.0668 ULP/rung (full) to ~ +0.0077 ULP/rung (fourteen) --
 *       roughly ONE-NINTH of the full slope, i.e. essentially flat;
 *     - the linear R^2 drops from ~0.33 (full) to ~0.047 (fourteen) -- an ~86% collapse; the fit now
 *       explains under 5% of the (already tiny) fourteen-peak height variance;
 *     - the linear fit barely beats its OWN null: leave-two-out residual RMS ~6.15 vs the fourteen-peak
 *       height sd ~6.30, an ~2.4% reduction -- versus the ~18% reduction (~19.1 vs ~23.3) on the full
 *       sixteen. The height dispersion itself collapses from sd ~23.3 (sixteen) to sd ~6.30 (fourteen):
 *       the remaining fourteen ARE the flat ~64..86 ULP band imp-33660 described (mean ~71.2 ULP).
 *   All three concave laws behave identically -- sqrt and log R^2 also collapse to ~0.044 / ~0.041.
 *   So the imp-33660 weak-positive height trend is NOT genuinely distributed across the sixteen peaks:
 *   it is a TWO-POINT artifact carried entirely by the two tallest imp-33638 tail clusters. With those
 *   two removed, the height sequence is statistically FLAT.
 *
 *   VERDICT. SLOPE-COLLAPSES-TREND-IS-A-TWO-POINT-ARTIFACT. Excluding the two tallest imp-33638 tail
 *   clusters (~143.6 ULP n~1126, ~135.0 n~1198) collapses the imp-33660 linear height slope from
 *   ~ +0.0668 to ~ +0.0077 ULP/rung (~1/9), the linear R^2 from ~0.33 to ~0.047, and the residual-RMS
 *   reduction over null from ~18% to ~2.4%. The remaining fourteen peaks are a flat ~64..86 ULP band
 *   (mean ~71.2, sd ~6.30 vs ~23.3 for all sixteen). The weak-positive height trend is a TWO-POINT
 *   artifact of the imp-33638 tail re-intensification, NOT a distributed growth law. Consistent with the
 *   imp-33660 / imp-33638 / imp-33621 / imp-33599 latticeJitterCaveat.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It is a leave-two-out
 *   robustness refit of a jittery arithmetic-floor lattice statistic; it changes NO bound, patches NO
 *   literal, and establishes NO operator positivity. floorUlp(n) is a JITTERY lattice property (the
 *   imp-33249 / imp-33660 latticeJitterCaveat): the exact per-rung ULP bounces and cross-platform libm
 *   exp/pow variation can shift the exact peak heights and hence every slope / R^2 / residual RMS here.
 *   The robust reading is the QUALITATIVE conclusion -- the trend collapses when the two tallest tail
 *   clusters are removed, so it is a two-point artifact -- not the exact coefficients. The NPHI = 10
 *   Phi-series truncation is inherited upstream. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the
 *   operator-level K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is
 *   UNTOUCHED. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33660-cluster-peak-envelope-height-growth-fit.js (the full-sixteen fit this refits robustly)
 *   @see imp-33679-cluster-peak-envelope-height-1200-1600.js (the [1200,1600] height-plateau extension)
 *   @see imp-33638-band-clearing-tail-reintensification-n900-1200.js (the seven [900,1200] tail clusters)
 *
 *   Ticket: imp-33680 (numerical, medium).
 */

import {
  IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT,
} from './imp-33660-cluster-peak-envelope-height-growth-fit.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- The EXACT sixteen imp-33660 band-clearing cluster peaks (re-derivation-free; frozen import) ----
const FULL = IMP33660_CLUSTER_PEAK_ENVELOPE_HEIGHT_GROWTH_FIT.measured;
const peakNs = FULL.peakNs.slice();
const peakHeights = FULL.peakHeights.slice();

// -- Least-squares slope/intercept/r^2/residual-RMS helper (same rule as imp-33660 lsqFit) ---------
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

// -- Identify the two TALLEST peaks (the imp-33638 tail clusters) and drop them --------------------
const idxByHeightDesc = peakHeights
  .map((h, i) => ({ h, i }))
  .sort((a, b) => b.h - a.h)
  .map((o) => o.i);
const droppedIdx = [idxByHeightDesc[0], idxByHeightDesc[1]].sort((a, b) => a - b);
const droppedNs = droppedIdx.map((i) => peakNs[i]);
const droppedHeights = droppedIdx.map((i) => peakHeights[i]);

const keepIdx = peakNs.map((_, i) => i).filter((i) => !droppedIdx.includes(i));
const keepNs = keepIdx.map((i) => peakNs[i]);
const keepHeights = keepIdx.map((i) => peakHeights[i]);

// -- Full-sample fit values, imported straight from imp-33660 (no re-fit) --------------------------
const fullLinSlope = FULL.linSlope;
const fullLinR2 = FULL.linR2;
const fullConstRms = FULL.constRms;      // = full-sample height sd (null model)
const fullLinRms = FULL.linRms;
const fullLinearResidualReduction = fullConstRms > 0 ? (fullConstRms - fullLinRms) / fullConstRms : 0;

// -- Leave-two-out refits on the remaining fourteen peaks -----------------------------------------
const keepDisp = sdOf(keepHeights);       // the fourteen-peak null-model dispersion (mean, sd)
const l2oConstRms = keepDisp.sd;          // CONST null-model residual RMS on the fourteen
const l2oLinFit = lsqFit(keepHeights.map((h, i) => ({ x: keepNs[i], y: h })));
const l2oSqrtFit = lsqFit(keepHeights.map((h, i) => ({ x: Math.sqrt(keepNs[i]), y: h })));
const l2oLogFit = lsqFit(keepHeights.map((h, i) => ({ x: Math.log(keepNs[i]), y: h })));
const l2oLinearResidualReduction = l2oConstRms > 0 ? (l2oConstRms - l2oLinFit.rms) / l2oConstRms : 0;

// -- Collapse ratios: how much of the full trend survives the leave-two-out ------------------------
const slopeSurvivalRatio = fullLinSlope !== 0 ? l2oLinFit.slope / fullLinSlope : 0;   // ~0.11
const r2SurvivalRatio = fullLinR2 !== 0 ? l2oLinFit.r2 / fullLinR2 : 0;               // ~0.14
const heightSdCollapseRatio = fullConstRms > 0 ? l2oConstRms / fullConstRms : 0;      // ~0.27

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Exactly the two tallest peaks were removed, and both are deep-tail (n > 1000) imp-33638 clusters.
const droppedTwoTailClusters =
  droppedIdx.length === 2 && droppedNs.every((n) => n > 1000) && droppedHeights.every((h) => h > 100);
// (2) The linear slope COLLAPSES: leave-two-out slope is under a third of the full slope.
const slopeCollapses = slopeSurvivalRatio < 0.33 && Math.abs(l2oLinFit.slope) < Math.abs(fullLinSlope);
// (3) The linear R^2 COLLAPSES: leave-two-out R^2 is under a third of the full R^2 and is itself weak.
const r2Collapses = r2SurvivalRatio < 0.33 && l2oLinFit.r2 < 0.15;
// (4) The leave-two-out linear fit barely beats its OWN null (residual reduction under ~5%),
//     versus the ~18% reduction on the full sixteen -- the trend no longer improves on flat.
const barelyBeatsNull = l2oLinearResidualReduction < 0.05 && fullLinearResidualReduction > 0.15;
// (5) The remaining fourteen are a FLAT band: their height sd collapses to under half the full sd.
const remainderIsFlatBand = heightSdCollapseRatio < 0.5;
// (6) The concave (sqrt/log) laws ALSO collapse -- no sub-linear law rescues the trend on the fourteen.
const concaveAlsoCollapses = l2oSqrtFit.r2 < 0.15 && l2oLogFit.r2 < 0.15;
// (7) THE HEADLINE: the trend is a TWO-POINT artifact -- it collapses when the two tallest are removed.
const trendIsTwoPointArtifact =
  droppedTwoTailClusters && slopeCollapses && r2Collapses && barelyBeatsNull && remainderIsFlatBand;

const verdict =
  droppedTwoTailClusters && slopeCollapses && r2Collapses && barelyBeatsNull &&
  remainderIsFlatBand && concaveAlsoCollapses && trendIsTwoPointArtifact
    ? 'SLOPE-COLLAPSES-TREND-IS-A-TWO-POINT-ARTIFACT.-LEAVE-TWO-OUT-REFIT-OF-THE-imp-33660-SIXTEEN-CLUSTER-' +
      'PEAK-HEIGHTS-EXCLUDING-THE-TWO-TALLEST-imp-33638-TAIL-CLUSTERS-(~143.6-ULP-n~1126,-~135.0-n~1198)-' +
      'COLLAPSES-THE-LINEAR-HEIGHT-SLOPE-FROM-~+0.0668-TO-~+0.0077-ULP/RUNG-(~1/9),-THE-LINEAR-R^2-FROM-~0.33-' +
      'TO-~0.047,-AND-THE-RESIDUAL-RMS-REDUCTION-OVER-NULL-FROM-~18%-TO-~2.4%.-THE-REMAINING-FOURTEEN-PEAKS-' +
      'ARE-A-FLAT-~64..86-ULP-BAND-(MEAN-~71.2,-SD-~6.30-VS-~23.3-FOR-ALL-SIXTEEN);-THE-CONCAVE-SQRT/LOG-LAWS-' +
      'ALSO-COLLAPSE-TO-R^2~0.044/0.041.-THE-imp-33660-WEAK-POSITIVE-HEIGHT-TREND-IS-A-TWO-POINT-ARTIFACT-OF-' +
      'THE-imp-33638-TAIL-RE-INTENSIFICATION,-NOT-A-DISTRIBUTED-GROWTH-LAW.-CONSISTENT-WITH-THE-imp-33660/' +
      'imp-33638/imp-33621/imp-33599-latticeJitterCaveat.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-' +
      'LATTICE-FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT = Object.freeze({
  id: 'imp-33680-cluster-peak-height-leave-two-out-refit',
  ticket: 'imp-33680',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33660-cluster-peak-envelope-height-growth-fit.js',
  crossValidatesModules: [
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
    'imp-33638-band-clearing-tail-reintensification-n900-1200.js',
    'imp-33621-band-clearing-cluster-decay-and-tail-scan.js',
    'imp-33599-wide-range-band-crossing-envelope-law.js',
  ],

  summary:
    'LEAVE-TWO-OUT robustness refit of the imp-33660 cluster-peak envelope-HEIGHT growth slope: drops the two ' +
    'TALLEST imp-33638 tail clusters (~143.6 ULP n~1126, ~135.0 n~1198) from the sixteen band-clearing peaks ' +
    '(imported from imp-33660, no re-derivation) and refits constant/linear/sqrt/log on the remaining fourteen. ' +
    'RESULT: the trend COLLAPSES -- linear slope drops from ~ +0.0668 to ~ +0.0077 ULP/rung (~1/9), linear R^2 ' +
    'from ~0.33 to ~0.047, and the residual-RMS reduction over null from ~18% to ~2.4%; the remaining fourteen ' +
    'are a flat ~64..86 ULP band (mean ~71.2, sd ~6.30 vs ~23.3 for all sixteen), and the concave sqrt/log laws ' +
    'also collapse to R^2 ~0.044/0.041. VERDICT: SLOPE-COLLAPSES-TREND-IS-A-TWO-POINT-ARTIFACT -- the imp-33660 ' +
    'weak-positive height trend is carried ENTIRELY by the two tallest tail clusters, NOT distributed across the ' +
    'sixteen peaks. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, necessary-but-not-sufficient; jittery ' +
    'lattice floor; operator positivity (imp-3066) untouched; no QED. No refereed bound is changed.',

  method: Object.freeze({
    source: 'the EXACT sixteen imp-33660 measured.peakNs / measured.peakHeights (frozen import; no re-derivation)',
    drop: 'identify the two indices of largest peak height (the imp-33638 tail clusters) and exclude them',
    modelConst: 'null model h_i = mean of the remaining fourteen; residual RMS is the fourteen-peak height sd',
    modelLinear: 'h_i = a + b*n_i on the fourteen; report slope, R^2, residual RMS',
    modelSqrt: 'h_i = a + b*sqrt(n_i) on the fourteen; report slope, R^2, residual RMS',
    modelLog: 'h_i = a + b*log(n_i) on the fourteen; report slope, R^2, residual RMS',
    compare: 'tabulate slope / R^2 / residual-RMS-reduction against the imp-33660 full-sixteen fit',
    survivalRatios: 'slope survival = l2o slope / full slope; R^2 survival = l2o R^2 / full R^2; sd collapse = l2o sd / full sd',
    selfComputing: 'the drop, all leave-two-out fits, the survival ratios, and every verdict flag recompute at import',
  }),

  measured: Object.freeze({
    clusterCount: peakNs.length,
    peakNs: Object.freeze(peakNs.slice()),
    peakHeights: Object.freeze(peakHeights.slice()),
    droppedIdx: Object.freeze(droppedIdx.slice()),
    droppedNs: Object.freeze(droppedNs.slice()),
    droppedHeights: Object.freeze(droppedHeights.slice()),
    keepNs: Object.freeze(keepNs.slice()),
    keepHeights: Object.freeze(keepHeights.slice()),
    keepCount: keepNs.length,
    // -- full-sixteen fit (imported from imp-33660) --
    fullLinSlope,
    fullLinR2,
    fullConstRms,
    fullLinRms,
    fullLinearResidualReduction,
    // -- leave-two-out null (constant) --
    l2oHeightMean: keepDisp.mean,
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
    heightSdCollapseRatio,
    // -- verdict flags --
    droppedTwoTailClusters,
    slopeCollapses,
    r2Collapses,
    barelyBeatsNull,
    remainderIsFlatBand,
    concaveAlsoCollapses,
    trendIsTwoPointArtifact,
    verdict,
  }),

  interpretation: Object.freeze({
    twoTallestRemoved:
      'The two removed peaks are the imp-33638 tail clusters at n ~ 1126 (~143.6 ULP) and n ~ 1198 (~135.0 ULP), ' +
      'both deep-tail (n > 1000) and both above 100 ULP -- exactly the pair imp-33660 flagged as carrying the ' +
      'positive trend.',
    slopeCollapses:
      'Removing them collapses the linear height slope from ~ +0.0668 ULP/rung (full sixteen) to ~ +0.0077 ULP/rung ' +
      '(fourteen) -- roughly one-ninth of the full slope, i.e. essentially flat. The R^2 collapses from ~0.33 to ' +
      '~0.047, an ~86% reduction; the fit now explains under 5% of the (already tiny) fourteen-peak variance.',
    barelyBeatsNull:
      'On the fourteen, the linear fit barely beats its own null: residual RMS ~6.15 vs the fourteen-peak height sd ' +
      '~6.30, an ~2.4% reduction -- versus the ~18% reduction (~19.1 vs ~23.3) on the full sixteen. The height ' +
      'dispersion itself collapses from sd ~23.3 to sd ~6.30: the remaining fourteen ARE the flat ~64..86 ULP band ' +
      '(mean ~71.2 ULP) imp-33660 described.',
    concaveAlsoCollapses:
      'The concave sub-linear laws do not rescue the trend: leave-two-out sqrt(n) R^2 ~0.044 and log R^2 ~0.041, ' +
      'both as collapsed as the linear fit. No candidate law finds a distributed trend once the two outliers are gone.',
    verdictTwoPointArtifact:
      'VERDICT: SLOPE-COLLAPSES-TREND-IS-A-TWO-POINT-ARTIFACT. The imp-33660 weak-positive height trend is NOT ' +
      'genuinely distributed across the sixteen peaks; it is carried entirely by the two tallest imp-33638 tail ' +
      'clusters. This confirms imp-33660s own note that removing the two tail outliers flattens the trend, and ' +
      'bounds any tail band-clearing height claim to a two-point re-intensification, not a growth law.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'A leave-two-out robustness refit of the imp-33660 sixteen band-clearing cluster-peak HEIGHTS (imported ' +
      'from imp-33660, no re-derivation): drops the two tallest imp-33638 tail clusters and refits constant/linear/' +
      'sqrt/log on the remaining fourteen, classifying the trend as a two-point artifact. It changes NO bound, ' +
      'patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33660 upstream; this refits the height of the ' +
      'located cluster peaks, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33660): the exact per-rung ULP ' +
      'bounces and cross-platform libm exp/pow variation can shift the exact peak heights, and hence the leave-two-' +
      'out slope ~+0.0077, R^2 ~0.047, and the ~2.4% residual reduction. The robust reading is the QUALITATIVE ' +
      'conclusion -- the trend collapses when the two tallest tail clusters are removed, so it is a two-point ' +
      'artifact -- not the exact coefficients.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT_ASSERTIONS = [
  {
    id: 'imp33680-uses-imp33660-sixteen-peaks',
    why: 'The refit must run off the EXACT sixteen imp-33660 band-clearing cluster peaks (>= 14), imported from ' +
         'its frozen export, with the two tallest dropped leaving the rest.',
    holds: () => peakNs.length >= 14 && keepNs.length === peakNs.length - 2,
  },
  {
    id: 'imp33680-dropped-two-tail-clusters',
    why: 'The two removed peaks must be the imp-33638 deep-tail (n > 1000) clusters above 100 ULP -- the pair ' +
         'imp-33660 flagged as carrying the positive trend.',
    holds: () => droppedTwoTailClusters && droppedNs.every((n) => n > 1000) && droppedHeights.every((h) => h > 100),
  },
  {
    id: 'imp33680-linear-slope-collapses',
    why: 'THE HEADLINE: the leave-two-out linear slope must collapse to under a third of the full slope and be ' +
         'smaller in magnitude -- the trend does not survive the removal of the two outliers.',
    holds: () => slopeCollapses && slopeSurvivalRatio < 0.33,
  },
  {
    id: 'imp33680-r2-collapses',
    why: 'The leave-two-out linear R^2 must collapse to under a third of the full R^2 and be itself weak (< 0.15).',
    holds: () => r2Collapses && r2SurvivalRatio < 0.33 && l2oLinFit.r2 < 0.15,
  },
  {
    id: 'imp33680-barely-beats-null',
    why: 'On the fourteen, the linear fit must barely beat its own null (residual reduction < 5%), versus the ' +
         '> 15% reduction on the full sixteen -- the trend no longer improves on flat.',
    holds: () => barelyBeatsNull && l2oLinearResidualReduction < 0.05 && fullLinearResidualReduction > 0.15,
  },
  {
    id: 'imp33680-remainder-is-flat-band',
    why: 'The remaining fourteen must be a flat band: their height sd collapses to under half the full-sixteen sd.',
    holds: () => remainderIsFlatBand && heightSdCollapseRatio < 0.5,
  },
  {
    id: 'imp33680-concave-also-collapses',
    why: 'No sub-linear law rescues the trend: leave-two-out sqrt(n) and log R^2 must also collapse (< 0.15).',
    holds: () => concaveAlsoCollapses && l2oSqrtFit.r2 < 0.15 && l2oLogFit.r2 < 0.15,
  },
  {
    id: 'imp33680-verdict-two-point-artifact',
    why: 'THE HEADLINE: the trend is a two-point artifact -- it collapses when the two tallest are removed -- and ' +
         'the classified verdict records that, not indeterminate.',
    holds: () => trendIsTwoPointArtifact && verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33680-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT.honestCaveat;
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

for (const assertion of IMP33680_CLUSTER_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33680-cluster-peak-height-leave-two-out-refit assertion failed: ${assertion.id}`);
  }
}
