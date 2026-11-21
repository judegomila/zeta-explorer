/**
 * imp-96493 -- MEASUREMENT: scan the existing 10^6 Odlyzko ordinates for the DEEPEST
 * below-envelope number-variance dip at any UNCLIPPED interior height T > 1.5e5, and test
 * whether any such height reaches the z-score needed for a clean 2-sigma -- i.e. whether the
 * fixed data set already contains a cleaner-than-1.9-sigma excursion (imp-96452 lever b).
 *
 * MOTIVATION. imp-96452 concluded the celebrated T = 1.5e5 excursion is capped at
 * z = 1.9234 (~1.9-sigma) by a FIXED data ceiling (dip depth relErr = 0.1595, window count
 * n_w = 291, both fixed properties of the 10^6 ordinates), and named the ONLY genuine lever
 * to reach 2-sigma as its option (b): "observe a comparably deep dip at a higher unclipped
 * height (a new, distinct excursion)". imp-96452 never scanned the existing ordinates for
 * such a dip. This module does: it evaluates the same imp-96089/imp-96452 dip z-score
 *   z(T) = relErr(T) / sqrt(2 / n_w(T)),   relErr(T) = |r_cap(T) - r(T)| / r(T),
 * at every unclipped interior height T > 1.5e5 that the existing measurements reach, and asks
 * whether any of them attains z >= 2.
 *
 * DATA (import-light bake, no zeros bundle, no sibling imports). The measured sd(C - E)
 * literals are the SAME band() measurements imp-96129 baked over the 10^6 Odlyzko ordinates
 * in src/data/zeros-to-1e6.js (identical estimator: span 0.6 T, step 2*Delta,
 * Delta = sqrt(T/2pi)). imp-96129's denser/wider 25-height interior grid reaches T = 6.37e5,
 * so it already samples every decade above 1.5e5 up to the ordinate ceiling. Nine of its
 * heights sit above 1.5e5; combined with the imp-95562 fit height T = 3.0e5 they give the ten
 * interior candidates scanned here. C0_mean (the mean anchor r_cap uses) is recomputed from
 * the six fit literals exactly as imp-96452/imp-96049 do.
 *
 * THE CLIP THRESHOLD. The +/-30 percent hard-box tiling is clipped by the top ordinate
 * T_max ~ 600269.68 once (1 + 0.3) T > T_max, i.e. above T_clip = T_max / 1.3 ~ 4.6175e5.
 * Only heights T <= T_clip carry a FULLY INTERIOR, unclipped tiling; the ticket asks to stay
 * clear of that ~6e5 ceiling clip, so a candidate counts as clean only when it is (i) a
 * below-envelope DIP (residual < 0) and (ii) unclipped (T <= T_clip).
 *
 * FINDINGS.
 *  1. NO interior height above 1.5e5 reaches z >= 2 in the existing data. Across the seven
 *     unclipped dense-grid heights 1.695e5 .. 4.577e5 (plus the fit T = 3.0e5), the DEEPEST
 *     clean below-envelope dip is z = 1.0358 at T = 3.879e5 -- only ~54 percent of the
 *     T = 1.5e5 z = 1.9234, and a long way short of the 2-sigma target.
 *  2. The T = 1.5e5 dip (z = 1.9234) remains the deepest below-envelope excursion anywhere
 *     in the ordinate set: no higher unclipped interior height even MATCHES it, let alone
 *     exceeds it. To turn the deepest higher dip (T = 3.879e5, n_w = 468) into a clean
 *     2-sigma the dip depth would have to be relErr >= 2*sqrt(2/468) = 0.13074, whereas the
 *     measured depth there is only relErr = 0.06772 -- the excursion would need to run ~1.93x
 *     deeper than it actually does.
 *  3. The two heights above the clip threshold (T = 5.401e5 and 6.373e5) are BOTH span-clipped
 *     by the ordinate ceiling AND above-envelope (residual > 0, not dips), so they supply no
 *     clean interior excursion either -- consistent with imp-96452's observation that the
 *     ceiling region cannot furnish the lever.
 *
 * VERDICT. Scanning the existing 10^6 Odlyzko ordinates at every unclipped interior height
 * T > 1.5e5 (ten candidates to T = 4.577e5, via the imp-96129 band() measurements), NONE
 * reaches z >= 2; the deepest clean below-envelope dip is z = 1.0358 at T = 3.879e5 (~1.03
 * sigma), and the T = 1.5e5 excursion (z = 1.9234) stays the global deepest. So the fixed
 * data set does NOT already contain a comparably-deep-or-deeper excursion at a higher
 * unclipped height: imp-96452 lever (b) has no realization in the existing ordinates -- a
 * clean 2-sigma still awaits a genuinely deeper interior excursion from data the fixed set
 * does not supply. Measurement only; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96452-excursion-confidence-2sigma-reach (names lever b: a deeper dip at a higher unclipped height)
 * @see imp-96089-mean-anchor-window-count-significance-verdict (the z = relErr/sqrt(2/n_w) dip score)
 * @see imp-96129-number-variance-dense-grid-max-anchor-stress (the 25-height band() dense-grid measurements reused here)
 *
 * Import-light: no zeros bundle, no sibling imports. Every measured sd(C - E) is a baked
 * literal (imp-96129 / imp-95562); every ratio / anchor / z-score is recomputed here.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI;
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T);
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

const SPAN_FRACTION = 0.3;
const T_MAX_ORDINATE = 600269.68; // top ordinate of the 10^6-th Odlyzko zero (src/data/zeros-to-1e6.js)
const T_CLIP = T_MAX_ORDINATE / (1 + SPAN_FRACTION); // ~4.6175e5: above this the +/-30% tiling clips the ceiling
const windowCount = (T) => {
  const upper = Math.min((1 + SPAN_FRACTION) * T, T_MAX_ORDINATE);
  const lower = (1 - SPAN_FRACTION) * T;
  return Math.floor((upper - lower) / (2 * halfWidth(T)));
};

// The six imp-95562 fit heights set the mean anchor C0_mean that r_cap uses (imp-96049/imp-96452).
const FIT = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 }, // the imp-96089 z = 1.92 significant dip (the reference excursion)
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];
const C0_mean = FIT.map((m) => m.sd * m.sd - SELBERG_C * logLog(m.Tc)).reduce((s, v) => s + v, 0) / FIT.length;
const cappedRatio = (T) => (SELBERG_C * logLog(T) + C0_mean) / gueNumberVariance(envelopeCount(T));

// dip z-score exactly as imp-96089/imp-96452: z = relErr / sqrt(2/n_w), relErr = |r_cap - r|/r.
const dipScore = (Tc, sd) => {
  const gueVar = gueNumberVariance(envelopeCount(Tc));
  const rMeasured = (sd * sd) / gueVar; // imp-95710 measured ratio r(T)
  const rCap = cappedRatio(Tc); // capped envelope ratio r_cap(T)
  const residual = rCap - rMeasured; // < 0 => below-envelope dip
  const relErr = Math.abs(residual) / rMeasured; // dip depth
  const nW = windowCount(Tc);
  const z = relErr / Math.sqrt(2 / nW);
  const clipped = (1 + SPAN_FRACTION) * Tc > T_MAX_ORDINATE;
  return { Tc, rMeasured, rCap, residual, isDip: residual < 0, relErr, nW, z, clipped };
};

// The candidate heights above 1.5e5 the existing measurements reach: the nine imp-96129
// dense-grid heights > 1.5e5, plus the imp-95562 fit height T = 3.0e5 (baked band() literals).
const CANDIDATES = [
  { Tc: 1.695e5, sd: 6.159914e-1 },
  { Tc: 2.001e5, sd: 6.108068e-1 },
  { Tc: 2.361e5, sd: 6.209680e-1 },
  { Tc: 2.786e5, sd: 6.323792e-1 },
  { Tc: 3.0e5, sd: 0.6199 }, // imp-95562 fit height
  { Tc: 3.287e5, sd: 6.214347e-1 },
  { Tc: 3.879e5, sd: 6.413375e-1 },
  { Tc: 4.577e5, sd: 6.222754e-1 },
  { Tc: 5.401e5, sd: 6.140988e-1 }, // above the clip threshold
  { Tc: 6.373e5, sd: 5.911225e-1 }, // above the clip threshold
];

const scan = CANDIDATES.map((m) => dipScore(m.Tc, m.sd)).sort((a, b) => a.Tc - b.Tc);

// Clean interior dips: below-envelope AND unclipped (T <= T_clip, clear of the ceiling).
const interiorDips = scan.filter((r) => r.isDip && !r.clipped);
const deepestInterior = interiorDips.reduce((best, r) => (r.z > best.z ? r : best), { z: -Infinity });
const anyReachesTwoSigma = interiorDips.some((r) => r.z >= 2);

// Reference: reproduce the T = 1.5e5 excursion z under the identical formula.
const REFERENCE = dipScore(1.5e5, 0.6714);
const Z_TARGET = 2.0;
// depth the deepest higher interior dip would need to clear 2-sigma (n_w held at its measured value).
const relErrNeededAtDeepest = Z_TARGET * Math.sqrt(2 / deepestInterior.nW);
const deepenFactorNeeded = relErrNeededAtDeepest / deepestInterior.relErr;

export const IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN = {
  ticket: 'imp-96493',
  question:
    'Do the existing 10^6 Odlyzko ordinates already contain a cleaner-than-1.9-sigma below-envelope number-variance excursion at some UNCLIPPED interior height T > 1.5e5 -- i.e. does imp-96452 lever (b) (a comparably deep dip at a higher unclipped height) have a realization in the fixed data set?',
  method:
    'Evaluate the imp-96089/imp-96452 dip z-score z(T) = |r_cap(T) - r(T)|/r(T) / sqrt(2/n_w(T)) at every interior height T > 1.5e5 the existing band() measurements reach (nine imp-96129 dense-grid heights + the imp-95562 fit T = 3.0e5), using the SAME sd(C - E) literals baked over src/data/zeros-to-1e6.js. A candidate counts as a clean interior excursion only when it is a below-envelope dip (residual < 0) AND unclipped (T <= T_clip ~ 4.6175e5). No zeros bundle, no sibling imports.',
  anchors: { C0_mean, T_clip: T_CLIP, T_max_ordinate: T_MAX_ORDINATE },
  reference: {
    Tc: REFERENCE.Tc, // 1.5e5
    relErr: REFERENCE.relErr, // ~0.15946
    nW: REFERENCE.nW, // 291
    z: REFERENCE.z, // ~1.9234: the cited ~1.9-sigma
    note: 'The imp-96089 reference excursion, recomputed under the identical dip-score formula used across the scan.',
  },
  scan: scan.map((r) => ({
    Tc: r.Tc,
    isDip: r.isDip,
    clipped: r.clipped,
    relErr: r.relErr,
    nW: r.nW,
    z: r.z,
    cleanInteriorCandidate: r.isDip && !r.clipped,
  })),
  deepestInteriorDip: {
    Tc: deepestInterior.Tc, // 3.879e5
    relErr: deepestInterior.relErr, // ~0.06772
    nW: deepestInterior.nW, // 468
    z: deepestInterior.z, // ~1.0358
    fractionOfReferenceZ: deepestInterior.z / REFERENCE.z, // ~0.538
  },
  twoSigmaReachAtDeepest: {
    zTarget: Z_TARGET,
    relErrNeeded: relErrNeededAtDeepest, // 2*sqrt(2/468) ~ 0.13074
    relErrMeasured: deepestInterior.relErr, // ~0.06772
    deepenFactorNeeded, // ~1.93x deeper than the actual dip
    note: 'At the deepest higher unclipped interior dip (T = 3.879e5, n_w = 468) the excursion would have to run ~1.93x deeper than measured to reach a clean 2-sigma -- the existing data does not.',
  },
  anyInteriorHeightReachesTwoSigma: anyReachesTwoSigma, // false
  verdict:
    'Scanning the existing 10^6 Odlyzko ordinates at every unclipped interior height T > 1.5e5 (ten candidates to T = 4.577e5, via the imp-96129 band() measurements), NONE reaches z >= 2. The deepest clean below-envelope dip is z = 1.0358 at T = 3.879e5 (~1.03 sigma, only ~54% of the reference), and the T = 1.5e5 excursion (z = 1.9234) remains the global deepest below-envelope dip in the ordinate set; the two heights above the clip threshold (5.401e5, 6.373e5) are span-clipped AND above-envelope, so they supply no clean excursion either. To turn the deepest higher interior dip into a 2-sigma the depth would need to run ~1.93x deeper than it does. imp-96452 lever (b) -- a comparably-deep-or-deeper excursion at a higher unclipped height -- therefore has NO realization in the existing fixed data; a clean 2-sigma still awaits a genuinely deeper interior excursion the fixed set does not supply. Measurement only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // anchor + reference reproduce imp-96452/imp-96089 exactly from the same fit literals
  if (!approx(C0_mean, 0.26184177603555076, 1e-9)) throw new Error('imp-96493: C0_mean drifted from imp-96452');
  if (!approx(REFERENCE.z, 1.9234217, 1e-6)) throw new Error('imp-96493: reference T = 1.5e5 z drifted from imp-96089 1.923');
  if (REFERENCE.nW !== 291) throw new Error('imp-96493: reference window count not 291');
  // clip threshold is ~4.6175e5
  if (!approx(T_CLIP, 4.6175e5, 5e2)) throw new Error('imp-96493: clip threshold drifted');
  // the central finding: no unclipped interior height above 1.5e5 reaches 2-sigma
  if (anyReachesTwoSigma) throw new Error('imp-96493: an interior height unexpectedly reaches z >= 2');
  if (deepestInterior.Tc !== 3.879e5) throw new Error('imp-96493: deepest interior dip not at T = 3.879e5');
  if (!approx(deepestInterior.z, 1.0358, 1e-3)) throw new Error('imp-96493: deepest interior dip z drifted');
  if (!(deepestInterior.z < REFERENCE.z)) throw new Error('imp-96493: deepest higher interior dip should be shallower than the T = 1.5e5 reference');
  if (deepestInterior.nW !== 468) throw new Error('imp-96493: deepest interior dip window count not 468');
  // the two ceiling-region heights are clipped and above-envelope (no clean excursion)
  const clipHeights = scan.filter((r) => r.Tc > T_CLIP);
  if (clipHeights.length !== 2) throw new Error('imp-96493: expected two candidate heights above the clip threshold');
  if (!clipHeights.every((r) => r.clipped && !r.isDip)) throw new Error('imp-96493: ceiling-region heights should be clipped and above-envelope');
  // 2-sigma reach arithmetic at the deepest interior dip
  if (!approx(relErrNeededAtDeepest, 0.130744, 1e-4)) throw new Error('imp-96493: relErr needed for 2-sigma at the deepest dip drifted');
  if (!(deepenFactorNeeded > 1.9 && deepenFactorNeeded < 2.0)) throw new Error('imp-96493: deepen factor should be ~1.93x');
  // honesty gates
  if (!/NO QED/.test(IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN.verdict))
    throw new Error('imp-96493: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN.verdict))
    throw new Error('imp-96493: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96493_EXCURSION_2SIGMA_INTERIOR_SCAN;
