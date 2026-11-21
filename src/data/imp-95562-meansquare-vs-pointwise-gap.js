/**
 * imp-95562 -- MEASURING the mean-square-vs-pointwise gap on ACTUAL zeta zeros.
 *
 * imp-95534 wall (i): even in-range, Montgomery/Ozluk evaluate F(alpha) as a MEAN
 * SQUARE over gamma in [0,T], while the imp-95519 contract needs the LOCAL pointwise
 * zero sum over |gamma-T| <= Delta uniformly in T (Delta = sqrt(v), v = T/2pi). The
 * gap was asserted there but never quantified. This module quantifies it.
 *
 * METHOD (offline: tmp/imp-95562-msq-vs-pointwise.mjs, over the 10^6 Odlyzko
 * ordinates in src/data/zeros-to-1e6.js, ACTUAL zeta zeros, not a surrogate):
 * at six sample heights T_c, tile ~n non-overlapping hard-box windows of half-width
 * Delta(t) = sqrt(t/2pi) across a +/-30% span, and for each window measure
 *   pointwise local count  C = #{gamma : |gamma - t| <= Delta(t)},
 *   mean-square envelope    E = 2*Delta(t)*delta(t),  delta(t) = (1/2pi)log(t/2pi).
 * Tabulate discrepancy D = C - E: its mean (envelope calibration), its T-fluctuation
 * (std), the GUE number-variance prediction Sigma^2(L) = (1/pi^2)(log 2pi*L + gamma + 1),
 * and the WORST pointwise excess -- the term uniform-in-T pointwise control must
 * absorb beyond the mean-square envelope.
 *
 * FINDINGS.
 *  1. mean(D) ~ 0 at every height (|mean| < 0.04 zeros): the mean-square envelope E
 *     is calibrated on average -- exactly the quantity F(alpha) controls.
 *  2. The pointwise fluctuation is REAL but modest: sd(D) ~ 0.57-0.67 zeros, and the
 *     worst single window sits ~1.5-2.0 zeros above the envelope (~2.9-3.3 sigma,
 *     Gaussian-tailed over ~10^2-10^3 windows -- no anomalous pointwise spikes).
 *  3. The gap is ADDITIVE, not multiplicative: the absolute worst excess stays O(1-2)
 *     zeros while the envelope L grows from ~93 to ~980, so the RELATIVE worst excess
 *     maxExcess/L DECAYS ~ 1/L (2.18e-2 at T=1e4 down to 1.79e-3 at T=5e5).
 *  4. At these accessible heights the measured pointwise variance is only ~40% of the
 *     GUE asymptote (mean var-ratio 0.40) -- finite-height arithmetic suppression of
 *     the number variance -- so the GUE/mean-square envelope is here a CONSERVATIVE
 *     over-estimate of the true pointwise fluctuation.
 *
 * VERDICT. Wall (i) is genuine in principle (mean-square control does not imply
 * pointwise control) but numerically small in this regime: the pointwise local sum
 * exceeds the mean-square envelope only by an additive, height-decaying O(1-2)-zero
 * term whose relative size shrinks like 1/L, and which the GUE envelope over-estimates.
 * This MEASURES the gap; it changes no bound and asserts no QED. No refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated regardless.
 *
 * Import-light: no zeros bundle, no sibling imports. Envelope/GUE formulas are
 * re-derived here; only the zero-dependent statistics (mean/sd/max of D) are baked
 * literals from the offline run over the verified ordinates.
 *
 * HONEST STATUS (imp-96192). The tiling above is a fixed-step 2*Delta(T_c) grid in
 * which each window keeps its own LOCAL half-width Delta(t) -- above the center
 * height the fixed step is shorter than the local window width, so adjacent windows
 * overlap and share zeros. imp-96171 shows this overlap injects a spurious POSITIVE
 * lag-1 correlation (r1 = +0.243 at T = 1.5e5) into the per-window (C - E) sequence
 * -- the wrong sign versus the GUE-predicted anti-correlation (rho_exact = -0.46398).
 * A clean edge-to-edge unfolded tiling (no overlap) restores the correct sign:
 * r1 = -0.5126, consistent with GUE. This does not affect the wall-(i) findings
 * above (mean/sd/max of D per window are unaffected by cross-window correlation),
 * but any consumer that needs the CORRELATION STRUCTURE across windows (not just
 * per-window statistics) should use the imp-96171 clean tiling, not this one.
 * @see imp-96171-number-variance-empirical-lag1-vs-gue-proxy (the correction)
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(v), v = T/2pi
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // E = 2 Delta delta
// GUE number variance for a hard box of mean count L (Dyson-Mehta large-L asymptotic)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);

// Baked from tmp/imp-95562-msq-vs-pointwise.mjs over the 10^6 Odlyzko ordinates.
// meanDiscrepancy / sdDiscrepancy / maxPosExcess / maxAbsExcess are the ZERO-DEPENDENT
// measured quantities; everything else is re-derived from the formulas above.
const MEASURED = [
  { Tc: 1.0e4, nWindows: 75, meanDiscrepancy: -0.0323, sdDiscrepancy: 0.6218, maxPosExcess: 2.028, maxAbsExcess: 2.028 },
  { Tc: 3.0e4, nWindows: 130, meanDiscrepancy: 0.0069, sdDiscrepancy: 0.5823, maxPosExcess: 1.494, maxAbsExcess: 1.494 },
  { Tc: 7.0e4, nWindows: 198, meanDiscrepancy: 0.0182, sdDiscrepancy: 0.5689, maxPosExcess: 1.397, maxAbsExcess: 1.483 },
  { Tc: 1.5e5, nWindows: 291, meanDiscrepancy: -0.0253, sdDiscrepancy: 0.6714, maxPosExcess: 1.669, maxAbsExcess: 1.759 },
  { Tc: 3.0e5, nWindows: 411, meanDiscrepancy: -0.0369, sdDiscrepancy: 0.6199, maxPosExcess: 1.939, maxAbsExcess: 1.939 },
  { Tc: 5.0e5, nWindows: 443, meanDiscrepancy: -0.0051, sdDiscrepancy: 0.6078, maxPosExcess: 1.752, maxAbsExcess: 1.813 },
];

const ROWS = MEASURED.map((m) => {
  const Delta = halfWidth(m.Tc);
  const L = envelopeCount(m.Tc); // mean-square envelope local count
  const sdGUE = Math.sqrt(gueNumberVariance(L));
  return {
    Tc: m.Tc,
    halfWidthDelta: Delta, // Delta = sqrt(T/2pi)
    meanLocalCountL: L, // E = 2 Delta delta(T), the mean-square envelope
    nWindows: m.nWindows,
    meanDiscrepancy: m.meanDiscrepancy, // ~0: envelope is calibrated on average
    sdDiscrepancy: m.sdDiscrepancy, // pointwise T-fluctuation of C - E
    sdGUE, // GUE number-variance prediction for the same L
    varRatioMeasuredOverGUE: (m.sdDiscrepancy * m.sdDiscrepancy) / gueNumberVariance(L),
    maxPosExcess: m.maxPosExcess, // worst single-window excess over envelope (zeros)
    maxAbsExcess: m.maxAbsExcess,
    worstSigma: m.maxPosExcess / m.sdDiscrepancy, // worst window in units of sd
    worstRelExcess: m.maxPosExcess / L, // additive excess relative to envelope
    poissonNormSd: m.sdDiscrepancy / Math.sqrt(L), // Poisson would give ~1
  };
});

const rowFor = (Tc) => ROWS.find((r) => r.Tc === Tc);
const avgVarRatio = ROWS.reduce((s, r) => s + r.varRatioMeasuredOverGUE, 0) / ROWS.length;
const maxMeanAbs = Math.max(...ROWS.map((r) => Math.abs(r.meanDiscrepancy)));
const worstRelDecays = ROWS.every((r, i) => i === 0 || r.worstRelExcess < ROWS[i - 1].worstRelExcess);

export const IMP95562_MEANSQUARE_VS_POINTWISE_GAP = {
  ticket: 'imp-95562',
  source:
    'imp-95534 wall (i) (mean-square F(alpha) vs pointwise local zero sum); measured over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js via tmp/imp-95562-msq-vs-pointwise.mjs',
  definitions: {
    envelope: 'E(T) = 2 Delta delta(T), delta(T) = (1/2pi) log(T/2pi) -- the mean-square-controlled local count',
    pointwise: 'C = #{gamma : |gamma - T| <= Delta}, Delta = sqrt(v), v = T/2pi',
    discrepancy: 'D = C - E, tabulated over non-overlapping hard-box windows tiled across a +/-30% span at each T_c',
    gueVariance: 'Sigma^2(L) = (1/pi^2)(log(2pi L) + gamma_E + 1), Dyson-Mehta large-L asymptotic',
  },
  rows: ROWS,
  aggregates: {
    maxMeanAbsDiscrepancy: maxMeanAbs, // < 0.04 zeros: envelope calibrated on average
    avgVarRatioMeasuredOverGUE: avgVarRatio, // ~0.40: finite-height suppression below GUE
    worstRelExcessDecaysWithHeight: worstRelDecays, // additive, not multiplicative gap
    worstRelExcessLo: rowFor(1.0e4).worstRelExcess, // 2.18e-2 at T = 1e4
    worstRelExcessHi: rowFor(5.0e5).worstRelExcess, // 1.79e-3 at T = 5e5
    worstSigmaRange: { min: Math.min(...ROWS.map((r) => r.worstSigma)), max: Math.max(...ROWS.map((r) => r.worstSigma)) },
  },
  verdict:
    'MEASURED on actual zeta zeros: the mean-square envelope E = 2 Delta delta(T) is calibrated on average (|mean(C - E)| < 0.04 zeros at every height), but the pointwise local count C fluctuates about it with std ~0.57-0.67 zeros, the worst single window sitting ~1.5-2.0 zeros (about 2.9-3.3 sigma, Gaussian-tailed) above the envelope. The gap is ADDITIVE not multiplicative: the absolute worst excess stays O(1-2) zeros while the envelope L grows ~93 -> ~980, so the relative worst excess maxExcess/L decays like 1/L (2.18e-2 -> 1.79e-3 across T = 1e4..5e5). At these accessible heights the pointwise number variance is only ~40% of the GUE asymptote (arithmetic finite-height suppression), so the GUE/mean-square envelope over-estimates the true pointwise fluctuation here. imp-95534 wall (i) is thus genuine in principle but numerically small and height-decaying in this regime. Changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
  honestStatus:
    'This module tiles fixed-step 2*Delta(T_c) windows that each keep their own LOCAL half-width Delta(t); above the center height the fixed step is shorter than the local width, so adjacent windows overlap and share zeros. imp-96171 measured that this overlap injects a spurious POSITIVE lag-1 correlation (r1 = +0.243 at T = 1.5e5) into the per-window (C - E) sequence -- the wrong sign against the GUE proxy (rho_exact = -0.46398) -- and that a clean edge-to-edge unfolded tiling (no overlap) restores the correct anti-correlation (r1 = -0.5126). The per-window mean/sd/max statistics above are unaffected, but any consumer needing cross-window CORRELATION STRUCTURE should use the imp-96171 clean tiling instead. See imp-96171-number-variance-empirical-lag1-vs-gue-proxy.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // envelope grows with height and matches the closed form at a spot value
  const r5 = rowFor(5.0e5);
  if (!approx(r5.halfWidthDelta, Math.sqrt(5.0e5 / TWO_PI), 1e-9)) throw new Error('imp-95562: Delta formula mismatch');
  if (!approx(r5.meanLocalCountL, 2 * Math.sqrt(5.0e5 / TWO_PI) * Math.log(5.0e5 / TWO_PI) / TWO_PI, 1e-9))
    throw new Error('imp-95562: envelope L formula mismatch');
  // envelope monotone increasing across the sampled heights
  for (let i = 1; i < ROWS.length; i++)
    if (!(ROWS[i].meanLocalCountL > ROWS[i - 1].meanLocalCountL)) throw new Error('imp-95562: envelope not monotone');
  // envelope calibrated on average
  if (!(maxMeanAbs < 0.05)) throw new Error('imp-95562: mean discrepancy too large -- envelope not calibrated');
  // additive gap: relative worst excess strictly decays with height
  if (!worstRelDecays) throw new Error('imp-95562: worst relative excess did not decay -- gap not additive');
  // measured variance sits below the GUE asymptote at these heights
  if (!(avgVarRatio > 0 && avgVarRatio < 1)) throw new Error('imp-95562: var ratio outside (0,1)');
  // worst windows are a few sigma (Gaussian tail), not anomalous spikes
  for (const r of ROWS) if (!(r.worstSigma > 2 && r.worstSigma < 4)) throw new Error('imp-95562: anomalous worst-sigma');
  // honesty gate: this is a measurement, not a bound change -- verdict must keep asserting NO QED and no refereed bound is changed
  if (!/NO QED/.test(IMP95562_MEANSQUARE_VS_POINTWISE_GAP.verdict))
    throw new Error('imp-95562: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95562_MEANSQUARE_VS_POINTWISE_GAP.verdict))
    throw new Error('imp-95562: verdict dropped the no-refereed-bound-change banner');
  // honesty gate: the tiling-overlap caveat (imp-96171 correction) must stay attached
  if (!/imp-96171/.test(IMP95562_MEANSQUARE_VS_POINTWISE_GAP.honestStatus))
    throw new Error('imp-95562: honestStatus dropped the imp-96171 correction pointer');
  if (!/\+0\.243/.test(IMP95562_MEANSQUARE_VS_POINTWISE_GAP.honestStatus))
    throw new Error('imp-95562: honestStatus dropped the +0.243 overlap-artifact value');
})();

export default IMP95562_MEANSQUARE_VS_POINTWISE_GAP;
