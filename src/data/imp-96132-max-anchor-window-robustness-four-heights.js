/**
 * imp-96132 -- extend the imp-96112 sd(C - E) window-robustness sweep from the single
 * tightest held-out height T = 5e4 to the OTHER FOUR imp-96090 held-out heights
 * {2e4, 1e5, 2e5, 4e5}, testing whether the max-anchor cap SIGN is uniform across the
 * estimator sweep at every held-out height, not just at 5e4.
 *
 * imp-96112 established that the imp-96090 max-anchor cap is robust to the sd(C - E) window
 * estimator across a 12-config sweep (half-width k, half-span, box-overlap) -- but ONLY at
 * the single tightest held-out height T = 5e4, where all 12 configs capped with a strictly
 * positive margin (+3.6% .. +51.4%). imp-96090 caps FIVE held-out heights; the other four
 * (2e4, 1e5, 2e5, 4e5) were each checked at a single canonical window only. This ticket
 * re-runs the identical 12-config band() sweep at those four heights and MEASURES whether
 * the max-anchor margin stays strictly positive (cap sign uniform) at every config, or
 * whether some window choice lets a height poke above the envelope.
 *
 * METHOD. The imp-95562 band() estimator was re-run VERBATIM at each of the four held-out
 * centres over the same 10^6 Odlyzko ordinates (src/data/zeros-to-1e6.js), sweeping the same
 * three axes about the imp-96090 canonical point (k = 1, span = 0.30, non-overlapping):
 *   (a) half-width factor  k in {0.5, 0.75, 1, 1.5, 2, 3}   -- Delta = k*sqrt(T/2pi)
 *   (b) half-span          span in {0.15, 0.20, 0.40, 0.50} -- boxes over +/-span*T
 *   (c) box-overlap        overlap in {0.25, 0.50}          -- step = overlap*2*Delta
 * (12 configs per height, matching imp-96112: span = 0.30 / overlap = 1 is the canonical
 * point, excluded from the sweep list.) For each config the measured ratio is
 * r(T) = sd(C - E)^2 / V_GUE(L_actual), compared against the FIXED canonical max-anchor
 * envelope r_cap^max(T) (imp-95722 anchor, closed form, independent of the window). The
 * offline sweep (tmp/imp-96132-window-robustness-four-heights.mjs) bakes sd(C - E) and
 * L_actual per config to 7 significant figures; everything downstream is recomputed here
 * from the closed forms, so this module is import-light (no zeros bundle).
 *
 * FINDINGS.
 *  1. The max-anchor cap sign is NOT uniform across the estimator sweep at these four
 *     held-out heights: 46 of 48 configs cap, but TWO breach. At T = 2e4 the coarse window
 *     k = 2 pokes above the envelope by -0.47% (r = 0.5194 vs r_cap = 0.5169); at T = 4e5
 *     the finest window k = 0.5 sits marginally above by -0.0019% (r = 0.440543 vs
 *     r_cap = 0.440534, a -8.5e-6 gap essentially on the envelope). The clean uniform-
 *     positivity found at 5e4 (imp-96112: 12/12 strictly positive) does NOT reproduce at
 *     every held-out height.
 *  2. The two intermediate heights ARE uniformly capped: T = 1e5 (margin +6.80% .. +79.0%,
 *     12/12) and T = 2e5 (margin +14.1% .. +40.1%, 12/12) show the same strictly-positive
 *     window robustness seen at 5e4. The breaches are confined to the two ENDPOINT heights
 *     (bottom 2e4, top 4e5), each at a single extreme window (coarsest k at 2e4, finest k at
 *     4e5) -- exactly the configs where windowing resolution / edge effects are worst.
 *  3. The breaches are SHALLOW and window-specific, not a failure of the single-window
 *     imp-96090 cap: at every height the imp-96090 CANONICAL window (k = 1, span = 0.30,
 *     non-overlap) caps with a comfortable positive margin (+42.8% at 2e4, +15.2% at 1e5,
 *     +30.5% at 2e5, +16.7% at 4e5). The max-anchor cap remains the right envelope at the
 *     canonical estimator; what this sweep shows is that at the endpoint heights its
 *     robustness margin can be exhausted by an adversarial extreme window choice.
 *
 * VERDICT. Extending the imp-96112 window sweep to the other four imp-96090 held-out heights,
 * the max-anchor cap sign is NOT uniformly positive: it caps 46 of 48 configs, breaching at
 * T = 2e4 (coarse k = 2, -0.47%) and marginally at T = 4e5 (fine k = 0.5, -0.0019%), while
 * the two interior heights 1e5 and 2e5 stay uniformly positive like 5e4. The clean 5e4
 * window robustness (imp-96112) is therefore a property of that interior height, not a
 * uniform feature of every held-out height; the endpoint heights carry a single adversarial
 * window each that exhausts the max-anchor margin. The imp-96090 CANONICAL-window cap holds
 * at all four heights with comfortable margin, so no bound moves. Measurement only; changes
 * no bound; RH open; NO QED; no refereed bound is changed; the zero-side route
 * stays PCC/GRH-gated. Heights stay ~6.8 decades below the imp-95519 window bottom
 * T = 3.0e12 (imp-95710 window-reach sub-gap unchanged).
 *
 * SUB-GAP (imp-96132-endpoint-window-breach). The two endpoint breaches (2e4 coarse, 4e5
 * fine) are inside the measurement noise of a single estimator window and do not touch the
 * canonical cap, but they mean the imp-96112 "sign does not depend on the window choice"
 * claim is height-local (interior heights) rather than global across the held-out set. A
 * fuller resolution would bootstrap the sd(C - E) noise per window (cf. imp-96133) to decide
 * whether the two endpoint breaches are significant or estimator noise.
 *
 * @see imp-96112-max-anchor-margin-window-robustness (the 5e4-only sweep this extends)
 * @see imp-96090-number-variance-mean-anchor-heldout-out-of-sample (the five held-out heights)
 * @see imp-95722-number-variance-ratio-window-bottom-bound (the max-anchor choice r_cap^max)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const SELBERG_C = 1 / (2 * Math.PI * Math.PI);

const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // canonical L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// The six imp-95562 fit heights; the max anchor below is fitted from THESE offsets only.
const FIT = [
  { Tc: 1.0e4, sd: 0.6218 },
  { Tc: 3.0e4, sd: 0.5823 },
  { Tc: 7.0e4, sd: 0.5689 },
  { Tc: 1.5e5, sd: 0.6714 },
  { Tc: 3.0e5, sd: 0.6199 },
  { Tc: 5.0e5, sd: 0.6078 },
];
const fitOffsets = FIT.map((m) => m.sd * m.sd - SELBERG_C * logLog(m.Tc));
const C0_max = Math.max(...fitOffsets); // imp-95722 in-sample max offset anchor

const cappedRatio = (T, C0) => (SELBERG_C * logLog(T) + C0) / gueNumberVariance(envelopeCount(T));

// The four OTHER imp-96090 held-out heights (the fifth, 5e4, is imp-96112). Each height
// carries the identical 12-config band() sweep, measured offline over the 10^6 Odlyzko
// ordinates (tmp/imp-96132-window-robustness-four-heights.mjs). sd(C - E) and the actual
// mean local count L baked to 7 significant figures; ratios recomputed here per config.
const HELDOUT = [
  {
    Tc: 2.0e4,
    sweep: [
      { tag: 'k=0.5', axis: 'half-width', k: 0.5, span: 0.3, overlap: 1.0, sd: 5.629237e-1, meanL: 7.143827e1, nWin: 215 },
      { tag: 'k=0.75', axis: 'half-width', k: 0.75, span: 0.3, overlap: 1.0, sd: 5.495420e-1, meanL: 1.071108e2, nWin: 143 },
      { tag: 'k=1', axis: 'half-width', k: 1.0, span: 0.3, overlap: 1.0, sd: 5.542220e-1, meanL: 1.427524e2, nWin: 107 },
      { tag: 'k=1.5', axis: 'half-width', k: 1.5, span: 0.3, overlap: 1.0, sd: 5.912033e-1, meanL: 2.139429e2, nWin: 71 },
      { tag: 'k=2', axis: 'half-width', k: 2.0, span: 0.3, overlap: 1.0, sd: 6.907808e-1, meanL: 2.850101e2, nWin: 53 },
      { tag: 'k=3', axis: 'half-width', k: 3.0, span: 0.3, overlap: 1.0, sd: 6.116617e-1, meanL: 4.267764e2, nWin: 35 },
      { tag: 'span=0.15', axis: 'span', k: 1.0, span: 0.15, overlap: 1.0, sd: 5.908668e-1, meanL: 1.442890e2, nWin: 53 },
      { tag: 'span=0.20', axis: 'span', k: 1.0, span: 0.2, overlap: 1.0, sd: 6.092083e-1, meanL: 1.439310e2, nWin: 71 },
      { tag: 'span=0.40', axis: 'span', k: 1.0, span: 0.4, overlap: 1.0, sd: 5.604291e-1, meanL: 1.410965e2, nWin: 144 },
      { tag: 'span=0.50', axis: 'span', k: 1.0, span: 0.5, overlap: 1.0, sd: 5.981163e-1, meanL: 1.390278e2, nWin: 183 },
      { tag: 'overlap=0.25', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.25, sd: 5.595490e-1, meanL: 1.429096e2, nWin: 427 },
      { tag: 'overlap=0.50', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.5, sd: 5.762079e-1, meanL: 1.428999e2, nWin: 214 },
    ],
  },
  {
    Tc: 1.0e5,
    sweep: [
      { tag: 'k=0.5', axis: 'half-width', k: 0.5, span: 0.3, overlap: 1.0, sd: 6.232670e-1, meanL: 1.916934e2, nWin: 481 },
      { tag: 'k=0.75', axis: 'half-width', k: 0.75, span: 0.3, overlap: 1.0, sd: 5.756713e-1, meanL: 2.874303e2, nWin: 320 },
      { tag: 'k=1', axis: 'half-width', k: 1.0, span: 0.3, overlap: 1.0, sd: 6.237025e-1, meanL: 3.832428e2, nWin: 240 },
      { tag: 'k=1.5', axis: 'half-width', k: 1.5, span: 0.3, overlap: 1.0, sd: 6.463323e-1, meanL: 5.748714e2, nWin: 160 },
      { tag: 'k=2', axis: 'half-width', k: 2.0, span: 0.3, overlap: 1.0, sd: 6.318531e-1, meanL: 7.665048e2, nWin: 120 },
      { tag: 'k=3', axis: 'half-width', k: 3.0, span: 0.3, overlap: 1.0, sd: 5.288362e-1, meanL: 1.149786e3, nWin: 80 },
      { tag: 'span=0.15', axis: 'span', k: 1.0, span: 0.15, overlap: 1.0, sd: 5.641319e-1, meanL: 3.871999e2, nWin: 119 },
      { tag: 'span=0.20', axis: 'span', k: 1.0, span: 0.2, overlap: 1.0, sd: 6.131388e-1, meanL: 3.861858e2, nWin: 159 },
      { tag: 'span=0.40', axis: 'span', k: 1.0, span: 0.4, overlap: 1.0, sd: 6.346130e-1, meanL: 3.792703e2, nWin: 324 },
      { tag: 'span=0.50', axis: 'span', k: 1.0, span: 0.5, overlap: 1.0, sd: 6.282324e-1, meanL: 3.734661e2, nWin: 410 },
      { tag: 'overlap=0.25', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.25, sd: 5.889311e-1, meanL: 3.834256e2, nWin: 959 },
      { tag: 'overlap=0.50', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.5, sd: 6.045653e-1, meanL: 3.834142e2, nWin: 480 },
    ],
  },
  {
    Tc: 2.0e5,
    sweep: [
      { tag: 'k=0.5', axis: 'half-width', k: 0.5, span: 0.3, overlap: 1.0, sd: 5.946212e-1, meanL: 2.905290e2, nWin: 680 },
      { tag: 'k=0.75', axis: 'half-width', k: 0.75, span: 0.3, overlap: 1.0, sd: 5.969940e-1, meanL: 4.357363e2, nWin: 453 },
      { tag: 'k=1', axis: 'half-width', k: 1.0, span: 0.3, overlap: 1.0, sd: 5.881980e-1, meanL: 5.810629e2, nWin: 340 },
      { tag: 'k=1.5', axis: 'half-width', k: 1.5, span: 0.3, overlap: 1.0, sd: 5.895415e-1, meanL: 8.711295e2, nWin: 226 },
      { tag: 'k=2', axis: 'half-width', k: 2.0, span: 0.3, overlap: 1.0, sd: 5.995307e-1, meanL: 1.162146e3, nWin: 170 },
      { tag: 'k=3', axis: 'half-width', k: 3.0, span: 0.3, overlap: 1.0, sd: 6.363701e-1, meanL: 1.742305e3, nWin: 113 },
      { tag: 'span=0.15', axis: 'span', k: 1.0, span: 0.15, overlap: 1.0, sd: 6.113772e-1, meanL: 5.867378e2, nWin: 168 },
      { tag: 'span=0.20', axis: 'span', k: 1.0, span: 0.2, overlap: 1.0, sd: 5.680154e-1, meanL: 5.853482e2, nWin: 225 },
      { tag: 'span=0.40', axis: 'span', k: 1.0, span: 0.4, overlap: 1.0, sd: 5.886675e-1, meanL: 5.748344e2, nWin: 458 },
      { tag: 'span=0.50', axis: 'span', k: 1.0, span: 0.5, overlap: 1.0, sd: 6.280861e-1, meanL: 5.662188e2, nWin: 580 },
      { tag: 'overlap=0.25', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.25, sd: 6.290680e-1, meanL: 5.810992e2, nWin: 1357 },
      { tag: 'overlap=0.50', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.5, sd: 6.104951e-1, meanL: 5.810871e2, nWin: 679 },
    ],
  },
  {
    Tc: 4.0e5,
    sweep: [
      { tag: 'k=0.5', axis: 'half-width', k: 0.5, span: 0.3, overlap: 1.0, sd: 6.511269e-1, meanL: 4.384063e2, nWin: 962 },
      { tag: 'k=0.75', axis: 'half-width', k: 0.75, span: 0.3, overlap: 1.0, sd: 6.168431e-1, meanL: 6.575490e2, nWin: 641 },
      { tag: 'k=1', axis: 'half-width', k: 1.0, span: 0.3, overlap: 1.0, sd: 6.242580e-1, meanL: 8.768178e2, nWin: 481 },
      { tag: 'k=1.5', axis: 'half-width', k: 1.5, span: 0.3, overlap: 1.0, sd: 6.607451e-1, meanL: 1.314736e3, nWin: 320 },
      { tag: 'k=2', axis: 'half-width', k: 2.0, span: 0.3, overlap: 1.0, sd: 6.257601e-1, meanL: 1.752992e3, nWin: 240 },
      { tag: 'k=3', axis: 'half-width', k: 3.0, span: 0.3, overlap: 1.0, sd: 6.621390e-1, meanL: 2.629520e3, nWin: 160 },
      { tag: 'span=0.15', axis: 'span', k: 1.0, span: 0.15, overlap: 1.0, sd: 6.079437e-1, meanL: 8.854045e2, nWin: 238 },
      { tag: 'span=0.20', axis: 'span', k: 1.0, span: 0.2, overlap: 1.0, sd: 6.180680e-1, meanL: 8.831191e2, nWin: 318 },
      { tag: 'span=0.40', axis: 'span', k: 1.0, span: 0.4, overlap: 1.0, sd: 6.009429e-1, meanL: 8.671890e2, nWin: 647 },
      { tag: 'span=0.50', axis: 'span', k: 1.0, span: 0.5, overlap: 1.0, sd: 6.197558e-1, meanL: 8.544264e2, nWin: 820 },
      { tag: 'overlap=0.25', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.25, sd: 6.273446e-1, meanL: 8.768563e2, nWin: 1921 },
      { tag: 'overlap=0.50', axis: 'overlap', k: 1.0, span: 0.3, overlap: 0.5, sd: 5.973587e-1, meanL: 8.768434e2, nWin: 961 },
    ],
  },
];

const CANONICAL_TAG = 'k=1'; // imp-96090 canonical window (k=1, span=0.30, non-overlap)

const heightResults = HELDOUT.map((h) => {
  const rCapMax = cappedRatio(h.Tc, C0_max); // FIXED canonical max-anchor envelope at this height
  const rows = h.sweep.map((c) => {
    const rMeasured = (c.sd * c.sd) / gueNumberVariance(c.meanL); // r(T) with this window's own GUE prediction
    const residualMax = rCapMax - rMeasured; // >= 0 means the max anchor caps this height under this estimator
    return {
      tag: c.tag,
      axis: c.axis,
      k: c.k,
      span: c.span,
      overlap: c.overlap,
      nWin: c.nWin,
      measuredRatio: rMeasured,
      residualMax,
      marginRelPct: (residualMax / rMeasured) * 100,
      caps: residualMax >= 0,
    };
  });
  const margins = rows.map((r) => r.marginRelPct);
  const breaches = rows.filter((r) => !r.caps);
  const canonicalRow = rows.find((r) => r.tag === CANONICAL_TAG);
  return {
    Tc: h.Tc,
    rCapMax,
    rows,
    configsTested: rows.length,
    capsCount: rows.filter((r) => r.caps).length,
    allCap: rows.every((r) => r.caps),
    signStablePositive: Math.min(...margins) > 0,
    marginRangePct: { min: Math.min(...margins), max: Math.max(...margins) },
    breaches: breaches.map((b) => ({ tag: b.tag, marginRelPct: b.marginRelPct })),
    canonicalMarginRelPct: canonicalRow.marginRelPct, // imp-96090 single-window cap at this height
  };
});

const totalConfigs = heightResults.reduce((s, h) => s + h.configsTested, 0);
const totalCaps = heightResults.reduce((s, h) => s + h.capsCount, 0);
const totalBreaches = totalConfigs - totalCaps;
const heightsAllCap = heightResults.filter((h) => h.allCap).map((h) => h.Tc);
const heightsWithBreach = heightResults.filter((h) => !h.allCap).map((h) => h.Tc);
const canonicalAllPositive = heightResults.every((h) => h.canonicalMarginRelPct > 0);

export const IMP96132_MAX_ANCHOR_WINDOW_ROBUSTNESS_FOUR_HEIGHTS = {
  ticket: 'imp-96132',
  source:
    'imp-96112 verified the imp-96090 max-anchor cap is robust to the sd(C-E) window estimator across a 12-config sweep, but ONLY at the tightest held-out height T=5e4. imp-96090 caps five held-out heights; the other four (2e4, 1e5, 2e5, 4e5) were checked at a single canonical window only. This re-runs the identical half-width/span/overlap sweep at those four heights and asks whether the max-anchor margin stays strictly positive (cap sign uniform) at every config.',
  method:
    'Re-run the imp-95562 band() estimator at each of the four held-out centres over the 10^6 Odlyzko ordinates (src/data/zeros-to-1e6.js), sweeping the half-width factor k in {0.5,0.75,1,1.5,2,3}, the half-span in {0.15,0.20,0.40,0.50} and the box-overlap in {0.25,0.50} about the imp-96090 canonical point (12 configs per height). Each config gives r(T)=sd(C-E)^2 / V_GUE(L_actual); compare against the FIXED canonical max-anchor envelope r_cap^max(T) (closed form, window-independent). sd and L baked to 7 significant figures offline (tmp/imp-96132-window-robustness-four-heights.mjs); ratios recomputed here.',
  definitions: {
    rCapMax: 'r_cap^max(T) = (Selberg log log term + C0_max) / V_GUE(L_canonical): the imp-95722 max-anchor envelope ratio at T, a closed form independent of the measurement window',
    measuredRatio: 'r(T) = sd(C-E)^2 / V_GUE(L_actual): the number-variance ratio for this config, each window width normalized by its own GUE prediction',
    residualMax: 'residualMax = r_cap^max(T) - r(T): envelope minus measured; >= 0 means the (in-sample-fitted) max anchor caps this height under this estimator',
    caps: 'true iff residualMax >= 0 for this window config',
    canonicalMarginRelPct: 'the residualMax margin at the imp-96090 canonical window (k=1, span=0.30, non-overlap) for this height',
  },
  inSampleAnchor: { C0_max },
  heldOutHeights: HELDOUT.map((h) => h.Tc),
  heightResults,
  summary: {
    heightsTested: heightResults.length,
    configsPerHeight: heightResults[0].configsTested,
    totalConfigs,
    totalCaps,
    totalBreaches,
    signUniformlyPositive: totalBreaches === 0,
    heightsAllCap,
    heightsWithBreach,
    breachConfigs: heightResults
      .filter((h) => !h.allCap)
      .map((h) => ({ Tc: h.Tc, breaches: h.breaches })),
    canonicalWindowAllPositive: canonicalAllPositive,
  },
  caveat:
    'The two endpoint breaches (T=2e4 coarse k=2 at -0.47%, T=4e5 fine k=0.5 at -0.0019%) are inside the sd(C-E) noise of a single estimator window and do NOT touch the imp-96090 canonical-window cap, which stays comfortably positive (+15% .. +43%) at all four heights. But they mean the imp-96112 "sign does not depend on the window choice" claim is height-local (interior heights 1e5, 2e5, like 5e4) rather than global across the held-out set. All four heights stay ~6.8 decades below the imp-95519 window bottom T=3.0e12 (imp-95710 window-reach sub-gap). Changes NO Lambda bound.',
  subGap:
    'imp-96132-endpoint-window-breach: the endpoint heights 2e4 and 4e5 each carry one adversarial extreme window that exhausts the max-anchor robustness margin. A bootstrap of the per-window sd(C-E) noise (cf. imp-96133) would decide whether the two shallow breaches are significant or estimator noise.',
  verdict:
    'Extending the imp-96112 window sweep to the other four imp-96090 held-out heights, the max-anchor cap sign is NOT uniformly positive: it caps 46 of 48 configs, breaching at T=2e4 (coarse k=2, -0.47%) and marginally at T=4e5 (fine k=0.5, -0.0019%), while the interior heights 1e5 and 2e5 stay uniformly positive like 5e4. The clean 5e4 window robustness is a property of the interior heights, not a uniform feature of every held-out height; the endpoint heights carry a single adversarial window each. The imp-96090 canonical-window cap holds at all four heights with comfortable margin, so no bound moves. Measurement only; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // max anchor reproduces imp-95722/imp-96090/imp-96112
  if (!approx(C0_max, 0.3337213835371905, 1e-9)) throw new Error('imp-96132: C0_max drifted from imp-95722');
  // four held-out heights, none of them 5e4 (that is imp-96112), none in the fit set
  if (HELDOUT.length !== 4) throw new Error('imp-96132: expected four held-out heights');
  if (HELDOUT.some((h) => h.Tc === 5.0e4)) throw new Error('imp-96132: 5e4 belongs to imp-96112, not here');
  const fitSet = new Set(FIT.map((m) => m.Tc));
  if (HELDOUT.some((h) => fitSet.has(h.Tc))) throw new Error('imp-96132: a held-out height leaked into the fit set');
  // twelve configs per height, all three axes present
  for (const h of heightResults) {
    if (h.configsTested !== 12) throw new Error('imp-96132: expected twelve configs at height ' + h.Tc);
    if (new Set(h.rows.map((r) => r.axis)).size !== 3) throw new Error('imp-96132: expected three sweep axes at height ' + h.Tc);
  }
  // MAIN FINDING: cap sign is NOT uniform -- exactly two breaches out of 48
  if (totalConfigs !== 48) throw new Error('imp-96132: expected 48 total configs');
  if (totalBreaches !== 2) throw new Error('imp-96132: expected exactly two endpoint breaches');
  if (IMP96132_MAX_ANCHOR_WINDOW_ROBUSTNESS_FOUR_HEIGHTS.summary.signUniformlyPositive)
    throw new Error('imp-96132: sign should NOT be uniformly positive across the held-out set');
  // breaches are at the endpoint heights 2e4 (k=2) and 4e5 (k=0.5)
  if (heightsWithBreach.length !== 2 || !heightsWithBreach.includes(2.0e4) || !heightsWithBreach.includes(4.0e5))
    throw new Error('imp-96132: breaches not confined to the endpoint heights 2e4 and 4e5');
  const h2e4 = heightResults.find((h) => h.Tc === 2.0e4);
  const h4e5 = heightResults.find((h) => h.Tc === 4.0e5);
  if (h2e4.breaches.length !== 1 || h2e4.breaches[0].tag !== 'k=2')
    throw new Error('imp-96132: 2e4 breach not at coarse k=2');
  if (h4e5.breaches.length !== 1 || h4e5.breaches[0].tag !== 'k=0.5')
    throw new Error('imp-96132: 4e5 breach not at fine k=0.5');
  if (!(h2e4.breaches[0].marginRelPct < -0.4 && h2e4.breaches[0].marginRelPct > -0.6))
    throw new Error('imp-96132: 2e4 k=2 breach margin not ~ -0.47%');
  if (!(h4e5.breaches[0].marginRelPct < 0 && h4e5.breaches[0].marginRelPct > -0.01))
    throw new Error('imp-96132: 4e5 k=0.5 breach margin not marginally negative');
  // interior heights 1e5 and 2e5 are uniformly capped (like 5e4)
  const h1e5 = heightResults.find((h) => h.Tc === 1.0e5);
  const h2e5 = heightResults.find((h) => h.Tc === 2.0e5);
  if (!h1e5.allCap || !h2e5.allCap) throw new Error('imp-96132: interior heights 1e5/2e5 should be uniformly capped');
  if (!h1e5.signStablePositive || !h2e5.signStablePositive)
    throw new Error('imp-96132: interior heights should be strictly sign-stable positive');
  // the imp-96090 canonical window caps every height with comfortable margin
  if (!canonicalAllPositive) throw new Error('imp-96132: canonical window failed to cap a held-out height');
  for (const h of heightResults) {
    if (!(h.canonicalMarginRelPct > 5)) throw new Error('imp-96132: canonical margin unexpectedly tight at height ' + h.Tc);
  }
  // honesty gates
  if (!/NO QED/.test(IMP96132_MAX_ANCHOR_WINDOW_ROBUSTNESS_FOUR_HEIGHTS.verdict))
    throw new Error('imp-96132: verdict dropped the NO QED banner');
  if (!/RH open/.test(IMP96132_MAX_ANCHOR_WINDOW_ROBUSTNESS_FOUR_HEIGHTS.verdict))
    throw new Error('imp-96132: verdict dropped the RH open banner');
  if (!/refereed bound is changed/i.test(IMP96132_MAX_ANCHOR_WINDOW_ROBUSTNESS_FOUR_HEIGHTS.verdict))
    throw new Error('imp-96132: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96132_MAX_ANCHOR_WINDOW_ROBUSTNESS_FOUR_HEIGHTS;
