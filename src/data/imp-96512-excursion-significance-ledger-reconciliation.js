/**
 * imp-96512 -- CROSS-VALIDATION: reconcile the imp-96493 interior-height z-score scan against the
 * imp-96115 / imp-96089 below-envelope dip significance table, height-by-height.
 *
 * MOTIVATION. Two independent significance ledgers over the same 10^6 Odlyzko ordinates were built
 * separately and never reconciled:
 *   - imp-96089 (surfaced by the routed Imp96115BelowEnvelopeDipSignificanceTableViz page) tabulates
 *     the THREE below-envelope mean-anchor dips T = 1e4, 1.5e5, 3e5 with their window counts, chi-square
 *     crossovers, z-scores and a SIGNIFICANT/NOISE verdict (only T = 1.5e5 clears z >= 1);
 *   - imp-96493 scans TEN interior candidate heights T > 1.5e5 (nine imp-96129 dense-grid heights plus
 *     the imp-95562 fit T = 3.0e5) for a cleaner-than-1.9-sigma excursion, reporting z(T) across the
 *     scan, a T = 1.5e5 reference, and a clip threshold ~4.6175e5.
 * Both ledgers use the SAME dip z-score z = relErr / sqrt(2 / n_w) with relErr = |r_cap - r| / r and
 * the SAME imp-95562 sd(C - E) literals, so wherever a height appears in both they MUST agree. This
 * module checks that, height-by-height, and records the (dis)agreement.
 *
 * METHOD (import-light: consumes only the two light finding modules, no zeros bundle, no re-derivation).
 * Index each ledger by height T_c. The imp-96493 side is its scan rows plus its explicit T = 1.5e5
 * reference row (the scan candidates start at T = 1.695e5, so 1.5e5 lives only in the reference). Take
 * the intersection of the two height sets, and for each overlapping height compare (i) the window count
 * n_w and (ii) the z-score. Heights present in only one ledger are recorded with the reason they are
 * absent from the other (T = 1e4 sits below the imp-96493 interior floor T > 1.5e5; the imp-96493 dense
 * heights above 3e5 are simply not in the three-height dip table).
 *
 * FINDINGS.
 *  1. The two ledgers OVERLAP at exactly TWO heights, T = 1.5e5 and T = 3.0e5, and agree to full double
 *     precision on both: n_w matches (291 and 411) and the z-score matches bit-for-bit (delta z = 0) --
 *     T = 1.5e5 gives z = 1.9234 in both, T = 3.0e5 gives z = 0.0749 in both. The shared z definition
 *     z = relErr / sqrt(2 / n_w) and the shared sd literals are confirmed identical across the two.
 *  2. The imp-96089 window counts are recovered from the same +/-30 percent non-overlapping tiling
 *     geometry (span fraction 0.3, T_max ~ 600269.68) the imp-96493 clip threshold uses, so the two
 *     window-count sources are the same geometry: n_w(1.5e5) = 291 and n_w(3e5) = 411 on both sides.
 *  3. The clip threshold reconciles: imp-96493 reports T_clip = T_max / 1.3 ~ 4.6175e5, and all three
 *     imp-96089 dip-table heights (1e4, 1.5e5, 3e5) sit BELOW it -- consistent with imp-96493 treating
 *     them as fully-interior unclipped heights -- while imp-96493 own two ceiling heights (5.401e5,
 *     6.373e5) sit above it and are excluded as clipped, matching its verdict.
 *  4. The significance labels are consistent: imp-96089 flags T = 1.5e5 SIGNIFICANT (z = 1.92, the
 *     deepest dip) and T = 3e5 NOISE (z = 0.07); imp-96493 finds the same T = 1.5e5 reference z = 1.9234
 *     stays the global deepest and no interior height (including T = 3e5) reaches z >= 2, so neither
 *     ledger contradicts the other -- they measure the same excursion field with the same estimator.
 *
 * VERDICT. The imp-96493 z-scan and the imp-96115 / imp-96089 below-envelope dip table are CONSISTENT
 * where they overlap: at T = 1.5e5 and T = 3.0e5 the window counts (291, 411) and the z-scores (1.9234,
 * 0.0749) agree to full double precision, the shared definition z = relErr / sqrt(2 / n_w) and shared
 * sd literals are confirmed, and the ~4.6175e5 clip threshold places all dip-table heights in the
 * unclipped interior. The two ledgers are two windows onto the same excursion measurement, not two
 * conflicting estimates. Cross-validation only; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96493-excursion-2sigma-interior-scan (the ten-height interior z-scan reconciled here)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the below-envelope dip significance table)
 * @see imp-96115 Imp96115BelowEnvelopeDipSignificanceTableViz (the routed page surfacing the dip table)
 *
 * Import-light: imports only the two light finding modules (neither pulls the zeros bundle); every
 * value here is read from their exports and compared -- nothing is re-derived.
 */

import { IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT } from './imp-96089-mean-anchor-window-count-significance-verdict.js';
import { IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN } from './imp-96493-excursion-2sigma-interior-scan.js';

const DIP = IMP96089_MEAN_ANCHOR_WINDOW_COUNT_SIGNIFICANCE_VERDICT;
const SCAN = IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN;

// imp-96493 side indexed by height: the scan rows, plus the explicit T = 1.5e5 reference (the scan
// candidates begin at T = 1.695e5, so the reference height lives only in SCAN.reference).
const scanByTc = new Map();
for (const r of SCAN.scan) scanByTc.set(r.Tc, { nW: r.nW, z: r.z, isDip: r.isDip, clipped: r.clipped });
scanByTc.set(SCAN.reference.Tc, { nW: SCAN.reference.nW, z: SCAN.reference.z, isDip: true, clipped: false });

// imp-96089 / imp-96115 below-envelope dip table indexed by height.
const dipByTc = new Map();
for (const r of DIP.belowEnvelopeVerdict) dipByTc.set(r.Tc, { nW: r.nWindows, z: r.zScore, verdict: r.verdict });

const allTc = Array.from(new Set([...dipByTc.keys(), ...scanByTc.keys()])).sort((a, b) => a - b);

const T_CLIP = SCAN.anchors.T_clip; // ~4.6175e5
const perHeight = allTc.map((Tc) => {
  const d = dipByTc.get(Tc) || null;
  const s = scanByTc.get(Tc) || null;
  const inBoth = Boolean(d && s);
  const nWAgree = inBoth ? d.nW === s.nW : null;
  const deltaZ = inBoth ? d.z - s.z : null;
  const zAgree = inBoth ? Math.abs(deltaZ) <= 1e-9 : null;
  return {
    Tc,
    inDipTable: Boolean(d),
    inScan: Boolean(s),
    inBoth,
    belowClip: Tc <= T_CLIP,
    dip: d ? { nW: d.nW, z: d.z, verdict: d.verdict } : null,
    scan: s ? { nW: s.nW, z: s.z, isDip: s.isDip, clipped: s.clipped } : null,
    nWAgree,
    deltaZ,
    zAgree,
  };
});

const overlap = perHeight.filter((r) => r.inBoth);
const overlapHeights = overlap.map((r) => r.Tc);
const allOverlapAgree = overlap.every((r) => r.nWAgree && r.zAgree);
const maxDeltaZ = overlap.reduce((m, r) => Math.max(m, Math.abs(r.deltaZ)), 0);
const dipOnlyHeights = perHeight.filter((r) => r.inDipTable && !r.inScan).map((r) => r.Tc);
const scanOnlyHeights = perHeight.filter((r) => r.inScan && !r.inDipTable).map((r) => r.Tc);
const allDipHeightsBelowClip = DIP.belowEnvelopeVerdict.every((r) => r.Tc <= T_CLIP);

export const IMP96512_EXCURSION_SIGNIFICANCE_LEDGER_RECONCILIATION = {
  ticket: 'imp-96512',
  question:
    'Do the imp-96493 interior-height z-score scan and the imp-96115 / imp-96089 below-envelope dip significance table agree at every height that appears in both, under the shared z = relErr / sqrt(2 / n_w) definition, the ~4.6175e5 clip threshold, and the imp-95562 tiling window counts?',
  method:
    'Index both ledgers by height T_c (the imp-96493 side = its scan rows plus its explicit T = 1.5e5 reference), intersect the height sets, and compare window count n_w and z-score at each overlapping height. Heights present in only one ledger are recorded with the reason they are absent from the other. Consumes only the two light finding modules; nothing re-derived.',
  sharedDefinition: {
    zScore: 'z(T) = relErr(T) / sqrt(2 / n_w(T)), relErr = |r_cap - r| / r -- identical in both ledgers',
    windowGeometry:
      'n_w(T) = floor((min(1.3T, T_max) - 0.7T) / (2 * Delta(T))), Delta = sqrt(T/2pi), T_max ~ 600269.68: the imp-95562 non-overlapping tiling, shared by both',
    dipTableZfromImp96089: DIP.definitions.zScore,
    scanClipThreshold: 'T_clip = T_max / 1.3 ~ 4.6175e5: above this the +/-30 percent tiling clips the ordinate ceiling (imp-96493)',
  },
  clipReconciliation: {
    T_clip: T_CLIP,
    T_max_ordinate: SCAN.anchors.T_max_ordinate,
    spanFractionImp96089: DIP.windowCountRecovery.spanFraction, // 0.3, same span the clip uses
    allDipTableHeightsBelowClip: allDipHeightsBelowClip, // 1e4, 1.5e5, 3e5 all interior/unclipped
  },
  perHeight,
  overlapHeights, // [1.5e5, 3.0e5]
  overlapReconciliation: overlap.map((r) => ({
    Tc: r.Tc,
    nW_dip: r.dip.nW,
    nW_scan: r.scan.nW,
    nWAgree: r.nWAgree,
    z_dip: r.dip.z,
    z_scan: r.scan.z,
    deltaZ: r.deltaZ,
    zAgree: r.zAgree,
    dipVerdict: r.dip.verdict,
  })),
  dipOnlyHeights, // [1e4]: below the imp-96493 interior floor T > 1.5e5
  scanOnlyHeights, // the imp-96129 dense heights above 1.5e5 not in the three-height dip table
  allOverlapAgree, // true
  maxDeltaZ, // 0: bit-for-bit z agreement on both overlapping heights
  verdict:
    'The imp-96493 z-scan and the imp-96115 / imp-96089 below-envelope dip table are CONSISTENT where they overlap. At the two shared heights T = 1.5e5 and T = 3.0e5 the window counts (291, 411) and the z-scores (1.9234, 0.0749) agree to full double precision (max delta z = 0); the shared definition z = relErr / sqrt(2 / n_w), the imp-95562 tiling window counts, and the ~4.6175e5 clip threshold all reconcile, with every dip-table height (1e4, 1.5e5, 3e5) sitting below the clip in the unclipped interior. The T = 1e4 dip is dip-table-only (below the imp-96493 interior floor T > 1.5e5) and the imp-96129 dense heights above 3e5 are scan-only; neither ledger contradicts the other. Cross-validation only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96512_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-validation only: the imp-96493 z-scan and the '
  + 'imp-96089 below-envelope dip table are byte-consistent only at their two shared heights (T = 1.5e5, '
  + '3.0e5); the T = 1e4 dip and the nine imp-96129 scan-only heights are not cross-checked against the '
  + 'other ledger, they simply do not conflict; changes no bound.';

// --- self-executing internal-consistency assertions (comparison only, no re-derivation) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // exactly two overlapping heights, and they are T = 1.5e5 and T = 3.0e5
  if (overlapHeights.length !== 2) throw new Error('imp-96512: expected exactly two overlapping heights');
  if (overlapHeights[0] !== 1.5e5 || overlapHeights[1] !== 3.0e5)
    throw new Error('imp-96512: overlap heights not [1.5e5, 3.0e5]');
  // window counts agree at both overlaps (291 and 411)
  const at = (Tc) => overlap.find((r) => r.Tc === Tc);
  if (at(1.5e5).dip.nW !== 291 || at(1.5e5).scan.nW !== 291) throw new Error('imp-96512: T = 1.5e5 window count not 291 on both sides');
  if (at(3.0e5).dip.nW !== 411 || at(3.0e5).scan.nW !== 411) throw new Error('imp-96512: T = 3.0e5 window count not 411 on both sides');
  // z-scores agree bit-for-bit at both overlaps
  if (!allOverlapAgree) throw new Error('imp-96512: overlapping heights disagree on n_w or z');
  if (maxDeltaZ !== 0) throw new Error('imp-96512: expected bit-for-bit z agreement (max delta z = 0)');
  if (!approx(at(1.5e5).dip.z, 1.9234, 1e-3)) throw new Error('imp-96512: T = 1.5e5 z drifted from 1.9234');
  if (!approx(at(3.0e5).dip.z, 0.0749, 1e-3)) throw new Error('imp-96512: T = 3.0e5 z drifted from 0.0749');
  // significance labels consistent: T = 1.5e5 SIGNIFICANT, T = 3e5 NOISE (imp-96089)
  if (at(1.5e5).dip.verdict !== 'SIGNIFICANT') throw new Error('imp-96512: T = 1.5e5 should be SIGNIFICANT');
  if (at(3.0e5).dip.verdict !== 'NOISE') throw new Error('imp-96512: T = 3.0e5 should be NOISE');
  // clip threshold reconciles ~4.6175e5, and all dip-table heights are below it
  if (!approx(T_CLIP, 4.6175e5, 5e2)) throw new Error('imp-96512: clip threshold drifted from ~4.6175e5');
  if (!allDipHeightsBelowClip) throw new Error('imp-96512: a dip-table height sits at or above the clip threshold');
  if (DIP.windowCountRecovery.spanFraction !== 0.3) throw new Error('imp-96512: dip-table span fraction not 0.3');
  // dip-only and scan-only partition the non-overlap heights
  if (dipOnlyHeights.length !== 1 || dipOnlyHeights[0] !== 1.0e4) throw new Error('imp-96512: dip-only should be [1e4]');
  if (scanOnlyHeights.length !== 9) throw new Error('imp-96512: expected nine scan-only heights');
  // honesty gates
  if (!/NO QED/.test(IMP96512_EXCURSION_SIGNIFICANCE_LEDGER_RECONCILIATION.verdict))
    throw new Error('imp-96512: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96512_EXCURSION_SIGNIFICANCE_LEDGER_RECONCILIATION.verdict))
    throw new Error('imp-96512: verdict dropped the no-refereed-bound-change banner');
  if (!(/RH open/.test(IMP96512_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96512_HONEST_BANNER) && /NO QED/.test(IMP96512_HONEST_BANNER)))
    throw new Error('imp-96512: IMP96512_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96512_EXCURSION_SIGNIFICANCE_LEDGER_RECONCILIATION;
