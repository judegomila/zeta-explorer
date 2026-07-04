/**
 * @module imp-33700-extension-peak-height-leave-two-out-refit
 * @fileoverview imp-33700 -- LEAVE-TWO-OUT refit of the imp-33679 [1200,1600] extension FOUR-peak
 *   envelope-HEIGHT slope, EXCLUDING its two TALLEST rungs, and ASSESS whether the weak-positive
 *   within-window trend (~ +0.015 ULP/rung) is again a TWO-POINT artifact -- exactly as the
 *   imp-33680 leave-two-out found on the imp-33660 [400,1200] sixteen-peak sample.
 *
 *   WHAT imp-33680 ESTABLISHED ON [400,1200] AND WHAT imp-33679 LEFT UNTESTED
 *   ------------------------------------------------------------------------
 *   imp-33680 dropped the two tallest imp-33638 tail clusters (~143.6 ULP n~1126, ~135.0 n~1198)
 *   from the imp-33660 SIXTEEN band-clearing cluster peaks and refit: the linear height slope
 *   COLLAPSED from ~ +0.0668 to ~ +0.0077 ULP/rung (~1/9 survival), R^2 from ~0.33 to ~0.047 -- so
 *   the [400,1200] trend was a TWO-POINT artifact carried by those two clusters, not a distributed law.
 *   imp-33679 later extended the fit into a FRESH [1200,1600] window and found FOUR band-clearing
 *   cluster peaks at n ~ 1230, 1324, 1433, 1599 with heights ~ [140.1, 144.2, 143.3, 146.5] ULP -- a
 *   flat high plateau (mean ~143.5, sd ~2.3), within-window linear slope ~ +0.015, R^2 ~0.79 on a
 *   trivial ~2.3 ULP spread. imp-33679 never ran the imp-33680 leave-two-out robustness test on that
 *   extension. This module runs it.
 *
 *   THE MEASUREMENT (self-computing at import; import-light, no zeros bundle)
 *   ------------------------------------------------------------------------
 *   Take the EXACT four imp-33679 measured.peakNs / measured.peakHeights (frozen import, no
 *   re-derivation drift), drop the two TALLEST, refit LINEAR on the remaining two, and compare the
 *   leave-two-out slope against the full four-peak slope. Because there are only FOUR peaks, dropping
 *   two leaves exactly TWO points -- and any two points define a PERFECT line (R^2 = 1, residual
 *   RMS = 0) regardless of the data. So the imp-33680 collapse test is DEGENERATE here: a two-point
 *   exact fit can neither confirm nor deny a distributed trend. To bound the slope robustly anyway the
 *   module also computes the FULL six-pair leave-two-out JACKKNIFE (all C(4,2) = 6 two-point slopes).
 *
 *   THE HEADLINE RESULT -- NO ARTIFACT REPLICATION; THE TEST IS UNDERPOWERED ON FOUR PEAKS
 *   -------------------------------------------------------------------------------------
 *   Dropping the two tallest extension peaks (n~1599 ~146.5 ULP, n~1324 ~144.2 ULP) leaves n~1230
 *   (~140.1) and n~1433 (~143.3). The leave-two-out linear slope is ~ +0.01593 ULP/rung -- it does
 *   NOT collapse; it is ~1.07x the full four-peak slope ~ +0.01495 (survival ratio ~1.07), the exact
 *   OPPOSITE of the imp-33680 ~1/9 collapse. But this NON-collapse is NOT evidence of a genuine
 *   distributed trend, for two reasons:
 *     (1) DEGENERACY -- the two-point refit is a perfect line (R^2 = 1, RMS ~1e-13), so it carries no
 *         information about whether the trend is distributed; ANY pair would fit perfectly.
 *     (2) JACKKNIFE STRADDLES ZERO -- the six two-point slopes range from ~ -0.0075 to ~ +0.0431
 *         ULP/rung (mean ~ +0.0161 ~ the full slope), i.e. one of the six pairs even goes NEGATIVE.
 *         On a trivial ~2.3 ULP plateau spread the slope sign is jitter-dominated.
 *   So the imp-33680 [400,1200] two-point-artifact collapse does NOT replicate on the [1200,1600]
 *   extension -- but the correct reading is NOT "the trend is real here." It is that the extension is a
 *   flat SATURATED plateau (imp-33679): the two tallest peaks are ordinary plateau members, not two
 *   outliers carrying a trend, so there is no two-point artifact to find AND no distributed growth to
 *   confirm. Neither hypothesis is supported on only four peaks.
 *
 *   VERDICT. LEAVE-TWO-OUT-DEGENERATE-ON-FOUR-PEAKS-NO-ARTIFACT-REPLICATION. Excluding the two tallest
 *   imp-33679 extension peaks leaves two points; the two-point linear fit is exact (R^2 = 1) and its
 *   slope ~ +0.01593 does NOT collapse (survival ~1.07 vs the imp-33680 ~1/9 on [400,1200]). But the
 *   six-pair jackknife slope straddles zero (~ -0.0075 .. ~ +0.0431, mean ~ +0.0161) on a ~2.3 ULP
 *   plateau spread, so no distributed growth is established either. Unlike [400,1200] the extension is
 *   a flat saturated plateau (imp-33679), so the two tallest are not trend-carrying outliers -- there
 *   is no two-point artifact to replicate. The imp-33680 collapse test is UNDERPOWERED on n = 4.
 *   Consistent with the imp-33679 saturation reading and the imp-33660 latticeJitterCaveat.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   ---------------------------------------------------------
 *   ACCURACY / RULE-DESIGN MEASUREMENT ONLY, at the RH-equivalent scale class. It is a leave-two-out
 *   robustness refit of a jittery arithmetic-floor lattice statistic; it changes NO bound, patches NO
 *   literal, and establishes NO operator positivity. floorUlp(n) is a JITTERY lattice property (the
 *   imp-33249 / imp-33660 / imp-33679 latticeJitterCaveat): the exact per-rung ULP bounces and
 *   cross-platform libm exp/pow variation can shift the peak heights and hence every slope here. The
 *   robust reading is the QUALITATIVE conclusion -- the leave-two-out is degenerate on four peaks and
 *   the imp-33680 collapse does not replicate, neither confirming nor denying a trend -- not the exact
 *   coefficients. The NPHI = 10 Phi-series truncation is inherited upstream. Mass-feasibility is
 *   NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2
 *   remains the SOTA.
 *
 *   @see imp-33679-cluster-peak-envelope-height-1200-1600.js (the four-peak plateau this refits robustly)
 *   @see imp-33680-cluster-peak-height-leave-two-out-refit.js (the [400,1200] leave-two-out this mirrors)
 *   @see imp-33660-cluster-peak-envelope-height-growth-fit.js (the [400,1200] sixteen-peak base fit)
 *
 *   Ticket: imp-33700 (numerical, medium).
 */

import {
  IMP33679_CLUSTER_PEAK_ENVELOPE_HEIGHT_1200_1600,
} from './imp-33679-cluster-peak-envelope-height-1200-1600.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// -- The EXACT four imp-33679 [1200,1600] extension cluster peaks (re-derivation-free; frozen import) --
const EXT = IMP33679_CLUSTER_PEAK_ENVELOPE_HEIGHT_1200_1600.measured;
const peakNs = EXT.peakNs.slice();
const peakHeights = EXT.peakHeights.slice();

// -- Least-squares slope/intercept/r^2/residual-RMS helper (same rule as imp-33679/imp-33680 lsqFit) --
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
  // For two collinear points sst = 0 and the line is exact; report r2 = 1 in that degenerate case.
  return { slope, intercept, r2: sst > 0 ? 1 - ssr / sst : 1, ssr, rms: Math.sqrt(ssr / m) };
}

function sdOf(arr) {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const varr = arr.reduce((a, b) => a + (b - mean) * (b - mean), 0) / arr.length;
  return { mean, sd: Math.sqrt(varr) };
}

// -- Identify the two TALLEST extension peaks and drop them ----------------------------------------
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

// -- Full four-peak fit values, imported straight from imp-33679 (no re-fit) -----------------------
const fullLinSlope = EXT.linSlope;
const fullLinR2 = EXT.linR2;
const fullConstRms = EXT.constRms;      // = full-sample height sd (null model)
const fullLinRms = EXT.linRms;

// -- Leave-two-out refit on the remaining TWO peaks (a DEGENERATE two-point exact line) ------------
const keepDisp = sdOf(keepHeights);
const l2oConstRms = keepDisp.sd;
const l2oLinFit = lsqFit(keepHeights.map((h, i) => ({ x: keepNs[i], y: h })));

// -- Collapse / survival ratio: how much of the full slope survives the leave-two-out --------------
const slopeSurvivalRatio = fullLinSlope !== 0 ? l2oLinFit.slope / fullLinSlope : 0;   // ~1.07 (NO collapse)

// -- FULL six-pair leave-two-out JACKKNIFE: all C(4,2) = 6 two-point slopes -------------------------
const pairSlopes = [];
for (let i = 0; i < peakNs.length; i += 1) {
  for (let j = i + 1; j < peakNs.length; j += 1) {
    pairSlopes.push((peakHeights[j] - peakHeights[i]) / (peakNs[j] - peakNs[i]));
  }
}
pairSlopes.sort((a, b) => a - b);
const jackMinSlope = pairSlopes[0];
const jackMaxSlope = pairSlopes[pairSlopes.length - 1];
const jackMeanSlope = pairSlopes.reduce((a, b) => a + b, 0) / pairSlopes.length;
const jackStraddlesZero = jackMinSlope < 0 && jackMaxSlope > 0;

// -- Cross-read the imp-33680 [400,1200] leave-two-out survival ratio for the contrast -------------
const imp33680SlopeSurvival = 0.0077 / 0.0668;    // ~0.115, the [400,1200] COLLAPSE (documented literal)

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) Exactly the two tallest of the four extension peaks were removed, leaving two.
const droppedTwoTallest =
  droppedIdx.length === 2 && keepNs.length === 2 &&
  droppedHeights.every((h) => keepHeights.every((k) => h >= k));
// (2) DEGENERACY: the two-point leave-two-out fit is an EXACT line (R^2 = 1, residual RMS ~ 0).
const leaveTwoOutIsDegenerate = keepNs.length === 2 && l2oLinFit.r2 > 0.999999 && l2oLinFit.rms < 1e-6;
// (3) NO COLLAPSE: unlike imp-33680 the slope does NOT collapse (survival >= 0.5, well above the ~1/9
//     [400,1200] collapse) -- but see (4): this is NOT a distributed-trend signal.
const slopeDoesNotCollapse = slopeSurvivalRatio >= 0.5 && slopeSurvivalRatio > imp33680SlopeSurvival;
// (4) UNDERPOWERED: the six-pair jackknife slope STRADDLES ZERO on the trivial ~2.3 ULP plateau spread,
//     so no distributed growth is established either -- the sign itself is jitter-dominated.
const underpoweredStraddlesZero = jackStraddlesZero && fullConstRms < 5;
// (5) The imp-33680 [400,1200] two-point-artifact collapse (survival < 1/3) does NOT replicate here.
const noArtifactReplication = slopeSurvivalRatio >= 0.33;
// (6) THE HEADLINE: on four peaks the test is degenerate and underpowered -- it neither replicates the
//     imp-33680 artifact nor confirms a distributed trend.
const testUnderpoweredNoReplication =
  droppedTwoTallest && leaveTwoOutIsDegenerate && slopeDoesNotCollapse &&
  underpoweredStraddlesZero && noArtifactReplication;

const verdict =
  testUnderpoweredNoReplication
    ? 'LEAVE-TWO-OUT-DEGENERATE-ON-FOUR-PEAKS-NO-ARTIFACT-REPLICATION.-EXCLUDING-THE-TWO-TALLEST-imp-33679-' +
      '[1200,1600]-EXTENSION-PEAKS-(n~1599-~146.5-ULP,-n~1324-~144.2-ULP)-LEAVES-TWO-POINTS-(n~1230-~140.1,-' +
      'n~1433-~143.3);-THE-TWO-POINT-LINEAR-FIT-IS-EXACT-(R^2=1,-RMS~1e-13)-AND-ITS-SLOPE-~+0.01593-ULP/RUNG-' +
      'DOES-NOT-COLLAPSE-(SURVIVAL-~1.07-VS-THE-imp-33680-~1/9-ON-[400,1200]).-BUT-THIS-IS-NOT-A-DISTRIBUTED-' +
      'TREND:-THE-SIX-PAIR-JACKKNIFE-SLOPE-STRADDLES-ZERO-(~-0.0075..~+0.0431,-MEAN-~+0.0161)-ON-A-TRIVIAL-~2.3-' +
      'ULP-PLATEAU-SPREAD.-UNLIKE-[400,1200]-THE-EXTENSION-IS-A-FLAT-SATURATED-PLATEAU-(imp-33679),-SO-THE-TWO-' +
      'TALLEST-ARE-ORDINARY-PLATEAU-MEMBERS-NOT-TREND-CARRYING-OUTLIERS-AND-THERE-IS-NO-TWO-POINT-ARTIFACT-TO-' +
      'REPLICATE.-THE-imp-33680-COLLAPSE-TEST-IS-UNDERPOWERED-ON-n=4.-CONSISTENT-WITH-THE-imp-33679-SATURATION-' +
      'READING-AND-THE-imp-33660-latticeJitterCaveat.-ACCURACY/RULE-DESIGN-MEASUREMENT-ONLY;-JITTERY-LATTICE-' +
      'FLOOR;-mass-feasibility-NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-PT-Lambda<=0.2-STAYS-SOTA'
    : 'INDETERMINATE';

export const IMP33700_EXTENSION_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT = Object.freeze({
  id: 'imp-33700-extension-peak-height-leave-two-out-refit',
  ticket: 'imp-33700',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsModule: 'imp-33679-cluster-peak-envelope-height-1200-1600.js',
  crossValidatesModules: [
    'imp-33679-cluster-peak-envelope-height-1200-1600.js',
    'imp-33680-cluster-peak-height-leave-two-out-refit.js',
    'imp-33660-cluster-peak-envelope-height-growth-fit.js',
  ],

  summary:
    'LEAVE-TWO-OUT robustness refit of the imp-33679 [1200,1600] extension FOUR-peak envelope-HEIGHT slope: drops ' +
    'the two TALLEST extension peaks (n~1599 ~146.5 ULP, n~1324 ~144.2 ULP) from the four (imported from imp-33679, ' +
    'no re-derivation) and refits the remaining two, mirroring the imp-33680 [400,1200] test. RESULT: on only FOUR ' +
    'peaks the test is DEGENERATE -- dropping two leaves a two-point EXACT line (R^2 = 1, RMS ~1e-13), whose slope ' +
    '~ +0.01593 does NOT collapse (survival ~1.07 vs the imp-33680 ~1/9 on [400,1200]). But that non-collapse is ' +
    'NOT a distributed trend: the six-pair jackknife slope STRADDLES ZERO (~ -0.0075 .. ~ +0.0431, mean ~ +0.0161) ' +
    'on a trivial ~2.3 ULP plateau spread. VERDICT: LEAVE-TWO-OUT-DEGENERATE-ON-FOUR-PEAKS-NO-ARTIFACT-REPLICATION ' +
    '-- unlike [400,1200] the extension is a flat SATURATED plateau (imp-33679), so the two tallest are ordinary ' +
    'plateau members, not trend-carrying outliers; there is no two-point artifact to replicate and no growth to ' +
    'confirm; the imp-33680 collapse test is UNDERPOWERED on n = 4. ACCURACY/RULE-DESIGN MEASUREMENT, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; jittery lattice floor; operator positivity (imp-3066) untouched; no QED. ' +
    'PT Lambda <= 0.2 SOTA.',

  method: Object.freeze({
    source: 'the EXACT four imp-33679 measured.peakNs / measured.peakHeights (frozen import; no re-derivation)',
    drop: 'identify the two indices of largest peak height and exclude them, leaving two peaks',
    modelLinear: 'h_i = a + b*n_i on the remaining two; report slope, R^2, residual RMS (a two-point EXACT line)',
    degeneracyNote: 'with only four peaks the leave-two-out reduces to two points; any two points fit a line ' +
      'perfectly (R^2 = 1, RMS = 0), so the two-point refit carries NO information about distributedness',
    jackknife: 'to bound the slope robustly compute all C(4,2) = 6 two-point (leave-two-out) slopes and report ' +
      'their min / max / mean and whether they straddle zero',
    compare: 'tabulate the two-tallest-drop slope survival against the full four-peak slope, and cross-read the ' +
      'imp-33680 [400,1200] ~1/9 collapse for contrast',
    selfComputing: 'the drop, the two-point refit, the six-pair jackknife, and every verdict flag recompute at import',
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
    // -- full four-peak fit (imported from imp-33679) --
    fullLinSlope,
    fullLinR2,
    fullConstRms,
    fullLinRms,
    // -- leave-two-out (two-point EXACT) --
    l2oHeightMean: keepDisp.mean,
    l2oConstRms,
    l2oLinSlope: l2oLinFit.slope,
    l2oLinIntercept: l2oLinFit.intercept,
    l2oLinR2: l2oLinFit.r2,
    l2oLinRms: l2oLinFit.rms,
    slopeSurvivalRatio,
    // -- six-pair leave-two-out JACKKNIFE --
    pairSlopes: Object.freeze(pairSlopes.slice()),
    jackMinSlope,
    jackMaxSlope,
    jackMeanSlope,
    jackStraddlesZero,
    // -- cross-read of imp-33680 [400,1200] --
    imp33680SlopeSurvival,
    // -- verdict flags --
    droppedTwoTallest,
    leaveTwoOutIsDegenerate,
    slopeDoesNotCollapse,
    underpoweredStraddlesZero,
    noArtifactReplication,
    testUnderpoweredNoReplication,
    verdict,
  }),

  interpretation: Object.freeze({
    twoTallestRemoved:
      'The two removed peaks are the extension plateau maxima at n ~ 1599 (~146.5 ULP) and n ~ 1324 (~144.2 ULP); ' +
      'dropping them leaves n ~ 1230 (~140.1 ULP) and n ~ 1433 (~143.3 ULP) -- only TWO points remain.',
    degeneracy:
      'With only four peaks, leave-two-out reduces to a TWO-POINT fit, which is a perfect line (R^2 = 1, residual ' +
      'RMS ~1e-13) for ANY pair. So the imp-33680 collapse test is DEGENERATE here: the two-point refit cannot ' +
      'confirm or deny a distributed trend the way the fourteen-point [400,1200] refit could.',
    noCollapse:
      'The two-point leave-two-out slope ~ +0.01593 ULP/rung does NOT collapse -- it is ~1.07x the full four-peak ' +
      'slope ~ +0.01495 (survival ratio ~1.07), the OPPOSITE of the imp-33680 ~1/9 collapse on [400,1200]. But this ' +
      'is a degeneracy artifact, not a distributed-trend signal.',
    jackknifeStraddlesZero:
      'The full six-pair (all C(4,2)) leave-two-out jackknife slopes range from ~ -0.0075 to ~ +0.0431 ULP/rung ' +
      '(mean ~ +0.0161, ~ the full slope) -- one pair even goes NEGATIVE. On the trivial ~2.3 ULP plateau spread ' +
      'the slope sign is jitter-dominated, so no distributed growth is established either.',
    verdictUnderpowered:
      'VERDICT: LEAVE-TWO-OUT-DEGENERATE-ON-FOUR-PEAKS-NO-ARTIFACT-REPLICATION. The imp-33680 [400,1200] two-point ' +
      'artifact collapse does NOT replicate on the [1200,1600] extension, but the correct reading is NOT that the ' +
      'trend is real: the extension is a flat SATURATED plateau (imp-33679), so the two tallest are ordinary plateau ' +
      'members rather than trend-carrying outliers -- there is no two-point artifact to find AND no growth to confirm. ' +
      'The collapse test is simply UNDERPOWERED on n = 4.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    derivationScope:
      'A leave-two-out robustness refit of the imp-33679 four [1200,1600] band-clearing extension cluster-peak ' +
      'HEIGHTS (imported from imp-33679, no re-derivation): drops the two tallest and refits the remaining two, plus ' +
      'a full six-pair jackknife, classifying the test as degenerate/underpowered on four peaks. It changes NO bound, ' +
      'patches NO literal, and establishes NO operator positivity. Grid-design measurement only.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI = 10 Phi-series truncation is inherited from imp-33679/imp-33660 upstream; this refits the height of ' +
      'the located extension cluster peaks, not that truncation.',
    latticeJitterCaveat:
      'floorUlp(n) is a jittery arithmetic-floor lattice property (imp-33249/imp-33660/imp-33679): the exact ' +
      'per-rung ULP bounces and cross-platform libm exp/pow variation can shift the exact peak heights, and hence ' +
      'the two-point leave-two-out slope ~+0.01593, the survival ratio ~1.07, and the six-pair jackknife range. The ' +
      'robust reading is the QUALITATIVE conclusion -- the leave-two-out is degenerate on four peaks and the ' +
      'imp-33680 collapse does not replicate, neither confirming nor denying a trend -- not the exact coefficients.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33700_EXTENSION_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT_ASSERTIONS = [
  {
    id: 'imp33700-uses-imp33679-four-peaks',
    why: 'The refit must run off the EXACT four imp-33679 [1200,1600] extension cluster peaks, imported from its ' +
         'frozen export, with the two tallest dropped leaving exactly two.',
    holds: () => peakNs.length === 4 && keepNs.length === 2 && droppedIdx.length === 2,
  },
  {
    id: 'imp33700-dropped-two-tallest',
    why: 'The two removed peaks must be the two TALLEST of the four -- both at least as tall as either kept peak.',
    holds: () => droppedTwoTallest && droppedHeights.every((h) => keepHeights.every((k) => h >= k)),
  },
  {
    id: 'imp33700-leave-two-out-degenerate',
    why: 'THE HEADLINE: with only four peaks the leave-two-out reduces to a two-point EXACT line (R^2 = 1, ' +
         'residual RMS ~ 0), so the two-point refit carries no distributedness information.',
    holds: () => leaveTwoOutIsDegenerate && l2oLinFit.r2 > 0.999999 && l2oLinFit.rms < 1e-6,
  },
  {
    id: 'imp33700-slope-does-not-collapse',
    why: 'Unlike the imp-33680 [400,1200] ~1/9 collapse, the two-point leave-two-out slope does NOT collapse ' +
         '(survival >= 0.5 and above the imp-33680 [400,1200] survival) -- a degeneracy artifact, not a trend.',
    holds: () => slopeDoesNotCollapse && slopeSurvivalRatio >= 0.5 && slopeSurvivalRatio > imp33680SlopeSurvival,
  },
  {
    id: 'imp33700-jackknife-straddles-zero',
    why: 'The six-pair (all C(4,2)) leave-two-out jackknife slope must STRADDLE ZERO on the trivial ~2.3 ULP ' +
         'plateau spread -- so no distributed growth is established either; the slope sign is jitter-dominated.',
    holds: () => pairSlopes.length === 6 && underpoweredStraddlesZero && jackMinSlope < 0 && jackMaxSlope > 0,
  },
  {
    id: 'imp33700-no-artifact-replication',
    why: 'The imp-33680 [400,1200] two-point-artifact collapse must NOT replicate on the extension (survival ' +
         'is NOT below 1/3), because the extension is a flat saturated plateau with no trend-carrying outliers.',
    holds: () => noArtifactReplication && slopeSurvivalRatio >= 0.33,
  },
  {
    id: 'imp33700-verdict-underpowered-no-replication',
    why: 'THE HEADLINE: on four peaks the test is degenerate and underpowered -- it neither replicates the ' +
         'imp-33680 artifact nor confirms a distributed trend -- and the classified verdict records that.',
    holds: () => testUnderpoweredNoReplication && verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33700-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy/rule-design measurement only, not a certified bound, mass-feasibility ' +
         'necessary-but-not-sufficient, operator positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP33700_EXTENSION_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT.honestCaveat;
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

for (const assertion of IMP33700_EXTENSION_PEAK_HEIGHT_LEAVE_TWO_OUT_REFIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33700-extension-peak-height-leave-two-out-refit assertion failed: ${assertion.id}`);
  }
}
