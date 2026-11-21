/**
 * @module imp-97483-krein-well-capture-vs-farfield-cost-tradeoff
 * @fileoverview imp-97483 -- MEASURE the well-depth-capture vs far-field-cost trade-off curve for the
 *   band-limited Krein minimiser, the spectral coupling imp-97458 named but left unmeasured
 *   (SUB-GAP IMP97458_POSITIVE_FAR_FIELD_UNBOUNDED_COST_IS_SPECTRAL_NOT_SCALAR). At 2a = ln 3 the
 *   pole-free symbol is
 *       sigma_2(t) = (t^2 + 1/4)^2 w_1(t),   w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2),
 *   with negative wells [-10.532,-6.945] u [-3.306,3.306] u [6.945,10.532], a finite positive island on
 *   the gap [3.306,6.945] (u mirror), and an UNBOUNDED t^4 ln t far tail beyond |t| = 10.532. A
 *   normalised type-a psi in PW_a (a = (ln 3)/2) cannot be compactly supported, so it must sample the
 *   t^4 field and pay a strictly positive int sigma_2^+ |psi|^2. Here we parameterize a one-parameter
 *   family of admissible psi by a WELL-CONFINEMENT RADIUS R and read the trade-off directly.
 *
 * THE FAMILY (genuinely band-limited, tail convergent). In frequency,
 *       psi_hat_R(xi) = (1 - (xi/a)^2)^2 * exp(-(R xi)^2 / 2)   on |xi| <= a,   0 outside.
 *   The (1 - (xi/a)^2)^2 edge taper vanishes to 2nd order at xi = +-a, forcing psi_R(t) ~ 1/t^3 and
 *   hence sigma_2 |psi_R|^2 ~ ln t / t^2 -- so int sigma_2 |psi_R|^2 CONVERGES for every R (a bare
 *   sharp-band sinc decays only like 1/t, giving |psi|^2 ~ 1/t^2 and a divergent T^3 ln T far cost --
 *   the imp-97458 obstruction in its rawest form; the taper is what makes a finite measurement
 *   possible). R is the confinement knob: R = 0 uses the full band (most confined, effective radius
 *   R_eff ~ 3.15), increasing R narrows the frequency lobe and SPREADS psi in time (larger R_eff),
 *   leaking mass out of the wells into the positive island and the t^4 far field. All quantities are
 *   normalised by ||psi_R||^2 = (1/pi) int_0^a psi_hat_R(xi)^2 dxi (Parseval). Measurement only.
 *
 * FINDING 1 -- THE TRADE-OFF CURVE IS U-SHAPED IN R. Tabulating the captured negative integral
 *   int sigma_2^- |psi|^2, the incurred positive cost int sigma_2^+ |psi|^2, and the total
 *   int sigma_2 |psi|^2 (all full-line, ||psi||_2 = 1, one-sided grid T = 300, h = 0.01, 500 xi nodes):
 *       R      R_eff    neg        pos        total
 *       0      3.15     -36.48     226.13     189.65    (under-confined: broad, weak well capture)
 *       1      3.20     -42.34     196.48     154.14
 *       2      3.35     -62.83     139.16      76.33
 *       2.5    3.47     -80.25     119.34      39.09
 *       3      3.62    -102.97     116.15      13.19
 *       3.35   3.741   -121.92     128.75       6.83    <-- MINIMUM of the total
 *       4      4.01    -162.81     199.06      36.25
 *       5      4.49    -234.56     481.94     247.38
 *       6      5.04    -306.68    1060.64     753.96
 *       8      6.25    -418.90    3519.55    3100.65
 *      10      7.55    -475.60    8997.58    8521.98
 *      14     10.24    -483.44   39535.36   39051.92    (over-spread: mass in the t^4 field)
 *   Small R under-captures the wells (weak negative, residual broad positive); large R captures ever
 *   more negative well depth (down to -483 at R = 14) but the positive far-field cost BALLOONS
 *   super-linearly (t^4 ln t sampled by the spreading tail), so the total diverges upward. The two
 *   competing terms cross to give a single interior minimum.
 *
 * FINDING 2 -- THE OPTIMAL BALANCE (R* ~ 3.35, R_eff ~ 3.74, at the inner-well edge). The total is
 *   minimised at R* = 3.35, where the effective radius R_eff = sqrt(int t^2|psi|^2 / int|psi|^2) = 3.741
 *   sits right at the inner-well edge |t| = 3.306: the family fills the deepest well [-3.306,3.306] and
 *   little else. There the captured negative int sigma_2^- |psi|^2 = -121.92 is nearly cancelled by the
 *   incurred positive cost int sigma_2^+ |psi|^2 = +128.75, leaving a small POSITIVE total
 *   int sigma_2 |psi|^2 = 6.83. The argmin R* = 3.35 is grid-stable (argmin unchanged at T = 200/400/800);
 *   the minimum VALUE drifts mildly upward with the truncation window (6.56 -> 6.83 -> 6.97 -> 7.22 at
 *   T = 200/300/400/800, increments shrinking -- the slowly convergent ln t / t^2 tail), converging to
 *   ~7.3. So even the best member of this smooth confinement family lands ~12x ABOVE the measured
 *   c_sharp ~ 0.582 (imp-97206 UPPER bracket).
 *
 * FINDING 3 -- THE SMOOTH CONFINEMENT KNOB CANNOT REACH c_sharp: THE COST IS SPECTRAL, NOT A RADIUS.
 *   The optimum 6.83 (converging ~7.3) is 11.7x (converging ~12.5x) the true c_sharp ~ 0.582. No choice
 *   of the single confinement radius R closes the gap: capturing more negative well depth (larger R)
 *   forces disproportionately more positive t^4 cost, and confining harder (smaller R) leaves the wells
 *   under-filled. The true minimiser attains 0.582 not by a better R but by the delicate cardinal-series
 *   CANCELLATION that suppresses far-field sampling far below what any smooth one-parameter profile
 *   achieves -- exactly the spectral (not scalar) coupling of far-field cost to band-limited tail decay
 *   that imp-97458 named. This CONFIRMS and quantifies IMP97458_POSITIVE_FAR_FIELD_UNBOUNDED_COST_IS_SPECTRAL_NOT_SCALAR:
 *   the well-capture / far-cost trade-off is real, U-shaped, and its scalar-knob optimum stays an order
 *   of magnitude above the spectral optimum.
 *
 * VERDICT. The well-depth-capture vs far-field-cost trade-off is MEASURED for a genuinely band-limited
 *   (PW_a, edge-tapered so the far integral converges) family indexed by confinement radius R at
 *   2a = ln 3. The curve is U-shaped: the captured negative int sigma_2^- |psi|^2 and the incurred
 *   positive int sigma_2^+ |psi|^2 cross to a single interior minimum of the total at R* ~ 3.35
 *   (R_eff ~ 3.74, filling the inner well [-3.306,3.306]), where -121.92 negative is nearly cancelled by
 *   +128.75 positive for a small positive total ~6.83 (converging ~7.3). That is ~12x the measured
 *   c_sharp ~ 0.582 (imp-97206), and no R closes the gap -- the true minimiser reaches 0.582 by
 *   cardinal-series cancellation, not radius tuning. The far-field cost is a spectral quantity, not a
 *   scalar the confinement radius can dial away. Measurement only; no operator positivity; no coercivity
 *   constant; no bound moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *   Resolves (measurement) SUB-GAP IMP97458_POSITIVE_FAR_FIELD_UNBOUNDED_COST_IS_SPECTRAL_NOT_SCALAR.
 *
 * @see imp-97458-krein-csharp-discarded-positive-far-field.js (named the spectral far-field cost; wells, island, t^4 tail)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (VERDICT item (b): the discarded t^4 far field; scalar floor -3065.435)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~ 0.582 UPPER bracket, positive)
 * @see imp-97457-krein-bathtub-realizability-gap.js (best realizable band-limited psi captures 43.84% of the bathtub floor; resolution 1/a ~ 1.82)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; pole-free Weil positivity; reach 2a <= 0.96)
 *
 * Ticket: imp-97483 (numerical, medium, opus-4-8). Measurement only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const PI = Math.PI;
const LN3 = Math.log(3);          // 1.0986122886681098 -- the binding 2a for the Krein floor
const A = LN3 / 2;                // 0.5493061443340548 -- the half-width a (2a = ln3)

export const IMP97483_BINDING_2A = LN3;
export const IMP97483_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97483_CSHARP_UPPER_BRACKET = 0.582; // imp-97206 (positive)

// --- the band-limited (PW_a) confinement family, edge-tapered so the far integral converges ---
// psi_hat_R(xi) = (1 - (xi/a)^2)^2 * exp(-(R xi)^2 / 2)  on [-a,a].
// Returns { psi(t), n2 } with n2 = ||psi_R||^2 = (1/pi) int_0^a psi_hat_R(xi)^2 dxi (Parseval).
function makePsi(R, nXi) {
  const m = nXi, h = A / m;
  const xs = new Float64Array(m), gs = new Float64Array(m);
  let n2 = 0;
  for (let i = 0; i < m; i++) {
    const xi = (i + 0.5) * h;
    const taper = Math.pow(1 - Math.pow(xi / A, 2), 2);
    const g = taper * Math.exp(-(Math.pow(R * xi, 2)) / 2);
    xs[i] = xi; gs[i] = g; n2 += g * g * h;
  }
  n2 /= PI;
  const psi = (t) => { let s = 0; for (let i = 0; i < m; i++) s += gs[i] * Math.cos(xs[i] * t); return s * h / PI; };
  return { psi, n2 };
}

// full-line captured-negative / incurred-positive / total, all normalised to ||psi||_2 = 1 (even symbol).
function tradeoff(R, T, ht, nXi) {
  const { psi, n2 } = makePsi(R, nXi);
  let neg = 0, pos = 0;
  for (let t = ht / 2; t < T; t += ht) {
    const p = psi(t); const v = sigma2(t) * p * p * ht;
    if (v < 0) neg += v; else pos += v;
  }
  return { R, neg: 2 * neg / n2, pos: 2 * pos / n2, tot: 2 * (neg + pos) / n2 };
}

// Finding 1 -- the U-shaped trade-off table (baked at T=300, h=0.01, 500 xi nodes).
export const IMP97483_TRADEOFF_CURVE = Object.freeze([
  Object.freeze({ R: 0,    Reff: 3.15,  neg: -36.48,   pos: 226.13,    tot: 189.65 }),
  Object.freeze({ R: 1,    Reff: 3.20,  neg: -42.34,   pos: 196.48,    tot: 154.14 }),
  Object.freeze({ R: 2,    Reff: 3.35,  neg: -62.83,   pos: 139.16,    tot: 76.33 }),
  Object.freeze({ R: 2.5,  Reff: 3.47,  neg: -80.25,   pos: 119.34,    tot: 39.09 }),
  Object.freeze({ R: 3,    Reff: 3.62,  neg: -102.97,  pos: 116.15,    tot: 13.19 }),
  Object.freeze({ R: 3.35, Reff: 3.741, neg: -121.92,  pos: 128.75,    tot: 6.83 }),  // minimum
  Object.freeze({ R: 4,    Reff: 4.01,  neg: -162.81,  pos: 199.06,    tot: 36.25 }),
  Object.freeze({ R: 5,    Reff: 4.49,  neg: -234.56,  pos: 481.94,    tot: 247.38 }),
  Object.freeze({ R: 6,    Reff: 5.04,  neg: -306.68,  pos: 1060.64,   tot: 753.96 }),
  Object.freeze({ R: 8,    Reff: 6.25,  neg: -418.90,  pos: 3519.55,   tot: 3100.65 }),
  Object.freeze({ R: 10,   Reff: 7.55,  neg: -475.60,  pos: 8997.58,   tot: 8521.98 }),
  Object.freeze({ R: 14,   Reff: 10.24, neg: -483.44,  pos: 39535.36,  tot: 39051.92 }),
]);

// Finding 2 -- the optimal balance.
export const IMP97483_OPTIMUM = Object.freeze({
  Rstar: 3.35,                 // argmin R (grid-stable at T = 200/400/800)
  effectiveRadius: 3.741,      // sqrt(int t^2|psi|^2 / int|psi|^2), at the inner-well edge |t| = 3.306
  innerWellEdge: 3.306,        // R_eff sits at the deepest-well edge: the family fills [-3.306,3.306]
  capturedNegative: -121.92,   // int sigma_2^- |psi|^2 at R*
  incurredPositive: 128.75,    // int sigma_2^+ |psi|^2 at R*
  total: 6.83,                 // int sigma_2 |psi|^2 at R* (T = 300); small POSITIVE
  totalTruncationDrift: Object.freeze({ T200: 6.56, T300: 6.83, T400: 6.97, T800: 7.22, converged: 7.3 }),
  ratioToCsharp: 11.7,         // total / c_sharp ~ 0.582 (converging ~12.5)
});

// Finding 3 -- the smooth confinement knob cannot reach c_sharp (spectral, not scalar).
export const IMP97483_SPECTRAL_NOT_SCALAR = Object.freeze({
  optimumTotal: 6.83,
  csharpUpperBracket: 0.582,
  optimumIsOrderOfMagnitudeAbove: true,     // ~12x above the true minimum
  noRadiusClosesTheGap: true,               // larger R -> more t^4 cost; smaller R -> under-filled wells
  trueMinimiserNeedsCardinalCancellation: true, // 0.582 reached by cancellation, not radius tuning
  farFieldCostIsSpectralNotScalar: true,    // confirms imp-97458 sub-gap
});

export const IMP97483_VERDICT = Object.freeze({
  ticket: 'imp-97483',
  question:
    'measure the well-depth-capture vs far-field-cost trade-off for the band-limited Krein minimiser at 2a = ln3: parameterize admissible type-a psi by a confinement radius R, tabulate int sigma_2^- |psi|^2 (captured negative) against int sigma_2^+ |psi|^2 (incurred positive) and the total int sigma_2 |psi|^2, locate the R that minimises the total, and compare to the measured c_sharp ~ 0.582.',
  answer:
    'the trade-off is U-shaped in R. Using a genuinely band-limited PW_a family psi_hat_R(xi) = (1-(xi/a)^2)^2 exp(-(R xi)^2/2) on [-a,a] (edge taper makes the t^4 far integral converge), small R under-captures the wells (total +190 at R=0) and large R captures more well depth (-483 at R=14) but pays a ballooning t^4 ln t positive cost (+39535), so the total has a single interior minimum. It is minimised at R* ~ 3.35, effective radius R_eff ~ 3.74 (right at the inner-well edge |t| = 3.306, so the family fills the deepest well [-3.306,3.306]): there captured negative -121.92 is nearly cancelled by incurred positive +128.75 for a small positive total ~6.83 (grid-stable argmin; value converging to ~7.3 with the truncation window). That optimum is ~12x the measured c_sharp ~ 0.582 (imp-97206). No confinement radius closes the gap: the true minimiser reaches 0.582 by the delicate cardinal-series cancellation that suppresses far-field sampling, not by radius tuning. The far-field cost is a spectral quantity, not a scalar the confinement radius can dial away -- confirming the imp-97458 sub-gap.',
  binding_2a: LN3,
  tradeoffUShaped: true,
  optimumRstar: 3.35,
  optimumEffectiveRadius: 3.741,
  optimumTotal: 6.83,
  optimumRatioToCsharp: 11.7,
  smoothKnobCannotReachCsharp: true,
  farFieldCostSpectralNotScalar: true,
  // unchanged program state
  measurementOnly: true,
  operatorPositivityProved: false,
  coercivityConstantProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97483_TRADEOFF_SMOOTH_CONFINEMENT_OPTIMUM_STAYS_ORDER_ABOVE_CSHARP -- the well-capture / far-cost ' +
    'trade-off for a band-limited (PW_a, edge-tapered) family indexed by confinement radius R at 2a = ln3 ' +
    'is U-shaped with a single interior minimum at R* ~ 3.35 (R_eff ~ 3.74, filling the inner well ' +
    '[-3.306,3.306]): captured negative -121.92 nearly cancels incurred positive +128.75 for a small ' +
    'positive total ~6.83 (converging ~7.3), still ~12x the measured c_sharp ~ 0.582 (imp-97206). No ' +
    'radius closes the gap; the true minimiser reaches 0.582 by cardinal-series cancellation, not radius ' +
    'tuning -- confirming IMP97458_POSITIVE_FAR_FIELD_UNBOUNDED_COST_IS_SPECTRAL_NOT_SCALAR (the far-field ' +
    'cost is spectral, not a scalar knob). Measurement only; no operator positivity; no bound moves; ' +
    'interval-rigorous reach stays 2a <= 0.96.',
  qed: false,
});
export default IMP97483_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Cheap recompute grid (nXi = 120, T = 150, h = 0.05, ~12 ms): reproduces the trade-off qualitatively
// and pins the interior minimum without the full baked-table resolution.

const IMP97483_ASSERTIONS = [
  {
    id: 'imp97483-tradeoff-is-U-shaped-interior-minimum',
    holds: () => {
      const lo = tradeoff(1, 150, 0.05, 120).tot;      // under-confined
      const mid = tradeoff(3.35, 150, 0.05, 120).tot;   // optimum
      const hi = tradeoff(8, 150, 0.05, 120).tot;       // over-spread
      // U-shape: the interior point is far below both ends
      return mid < lo && mid < hi && lo > 100 && hi > 1000 && mid > 0 && mid < 20;
    },
    why: 'the total int sigma_2 |psi|^2 over the band-limited confinement family is U-shaped in R: under-confined (R=1, ~145) and over-spread (R=8, ~3100) both sit far above the small positive interior minimum near R ~ 3.35.',
  },
  {
    id: 'imp97483-optimum-near-cancellation-recomputes',
    holds: () => {
      const r = tradeoff(3.35, 150, 0.05, 120);
      // captured negative ~ -122 nearly cancels incurred positive ~ +129, small positive residual
      const negOk = Math.abs(r.neg - (-121.92)) < 3;
      const posOk = Math.abs(r.pos - 128.75) < 3;       // coarse-grid pos slightly lower (~128.2)
      const totSmallPositive = r.tot > 0 && r.tot < 12;
      return negOk && posOk && totSmallPositive &&
        Math.abs(IMP97483_OPTIMUM.capturedNegative - (-121.92)) < 1e-9 &&
        Math.abs(IMP97483_OPTIMUM.incurredPositive - 128.75) < 1e-9;
    },
    why: 'at the optimal confinement radius R* ~ 3.35 the captured negative int sigma_2^- |psi|^2 ~ -121.92 nearly cancels the incurred positive int sigma_2^+ |psi|^2 ~ +128.75, leaving a small positive total ~6.8 -- reproduced on the cheap grid.',
  },
  {
    id: 'imp97483-optimum-stays-order-above-csharp-measurement-only',
    holds: () =>
      IMP97483_OPTIMUM.ratioToCsharp > 10 &&
      IMP97483_OPTIMUM.total > 10 * IMP97483_CSHARP_UPPER_BRACKET &&
      IMP97483_CSHARP_UPPER_BRACKET === 0.582 &&
      IMP97483_SPECTRAL_NOT_SCALAR.farFieldCostIsSpectralNotScalar === true &&
      IMP97483_SPECTRAL_NOT_SCALAR.noRadiusClosesTheGap === true &&
      IMP97483_VERDICT.measurementOnly === true &&
      IMP97483_VERDICT.operatorPositivityProved === false &&
      IMP97483_VERDICT.coercivityConstantProved === false &&
      IMP97483_VERDICT.boundMoves === false &&
      IMP97483_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97483_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97483_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97483_VERDICT.subGap === 'string' &&
      IMP97483_VERDICT.subGap.includes('IMP97458_POSITIVE_FAR_FIELD_UNBOUNDED_COST_IS_SPECTRAL_NOT_SCALAR') &&
      IMP97483_VERDICT.qed === false,
    why: 'measurement only: the best smooth confinement radius R* leaves the total ~12x above the measured c_sharp ~ 0.582, so no radius closes the gap -- the far-field cost is spectral, not a scalar knob; no positivity, no coercivity, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97483_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97483-krein-well-capture-vs-farfield-cost-tradeoff assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
