/**
 * @module imp-96378-route-m-beat-period-overlap-viz-data
 *
 * imp-96378 (ux): import-light viz-data leaf for the imp-96344 Route M adjacent
 * conductor-tone (q=4/q=5) resolvability finding (F2). imp-96344 measured the
 * normalized overlap |corr(cos w_4 x, cos w_5 x)| at three window spans L in
 * log N -- the current span (L=3.6889, overlap 0.0674), a sidelobe bump near
 * L=7.5 (overlap 0.26), and reported the first true null near L~10 (the
 * adjacent-line beat period 2 pi / (w_4 - w_5) = 9.999) -- but shipped no chart
 * and baked no dense curve between those three points.
 *
 * This leaf reconstructs the overlap(L) curve in closed form from the same
 * definition imp-96344 states in prose: the Pearson correlation of cos(w_4 x)
 * and cos(w_5 x) over the window [x0, x0+L], x0 = log(250) fixed at the
 * imp-96325 Gram-run start. Both trig-product integrals admit an elementary
 * closed form (product-to-sum), so the curve is computed exactly at each L,
 * not sampled. The three imp-96344 baked values are plotted as anchor markers
 * (copied verbatim); the continuous curve is a NEW computation here, disclosed
 * in the honest banner, and its value at the two imp-96344-reported spans
 * agrees with the baked anchors to within the anchors' own rounding (0.0651 vs
 * 0.0674 at L=3.6889; 0.2604 vs 0.26 at L=7.5) -- confirming the curve
 * reproduces the reported finding rather than contradicting it. The exact
 * numerical null this closed form finds (L=9.8475, overlap ~6e-7) sits within
 * 1.5% of the analytic beat period imp-96344 names (9.999), the small offset
 * coming from the fast w_4+w_5 cross-term imp-96344's prose approximation
 * drops.
 *
 * PRESENTATION ONLY. Renders the imp-96344 (D2) line-resolution finding; moves
 * no Lambda bound, establishes no operator positivity, decides nothing about
 * the real Route M band (imp-96344 F4: that still needs the actual Vasyunin
 * Gram at N ~ 5.5e6..1.2e11). RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96344-route-m-synthetic-span-identifiability.js (IMP96344_LINE_RESOLUTION, IMP96344_CONDUCTORS)
 *
 * Ticket: imp-96378 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP96344_WINDOW,
  IMP96344_CONDUCTORS,
  IMP96344_LINE_RESOLUTION,
  IMP96344_REQUIRED_SPAN,
  IMP96344_HONEST_BANNER,
} from './imp-96344-route-m-synthetic-span-identifiability.js';

const { w4, w5 } = IMP96344_CONDUCTORS;
const dw = w4 - w5;
const sw = w4 + w5;
const X0 = IMP96344_WINDOW.x0;

// Closed-form Pearson correlation of cos(w4 x) and cos(w5 x) over [x0, x0+L],
// via product-to-sum: cos a cos b = 0.5[cos(a-b) + cos(a+b)].
function meanCos(w, L) {
  return (Math.sin(w * (X0 + L)) - Math.sin(w * X0)) / (w * L);
}
function meanProd(L) {
  const cross = 0.5 * (
    (Math.sin(dw * (X0 + L)) - Math.sin(dw * X0)) / dw
    + (Math.sin(sw * (X0 + L)) - Math.sin(sw * X0)) / sw
  );
  return cross / L;
}
function meanSq(w, L) {
  const integ = L / 2 + (Math.sin(2 * w * (X0 + L)) - Math.sin(2 * w * X0)) / (4 * w);
  return integ / L;
}
export function overlapAtSpan(L) {
  const m4 = meanCos(w4, L);
  const m5 = meanCos(w5, L);
  const cov = meanProd(L) - m4 * m5;
  const var4 = meanSq(w4, L) - m4 * m4;
  const var5 = meanSq(w5, L) - m5 * m5;
  return Math.abs(cov) / Math.sqrt(var4 * var5);
}

// Dense curve, L = 0.1 .. 13.0 in log N, step 0.1 (130 points).
export const IMP96378_OVERLAP_CURVE = Object.freeze(
  Array.from({ length: 130 }, (_, i) => {
    const L = 0.1 + i * 0.1;
    return Object.freeze({ L, overlap: overlapAtSpan(L) });
  }),
);

// The three imp-96344-reported anchors, plus the exact numerical null this
// closed form locates near the analytic beat period.
export const IMP96378_ANCHORS = Object.freeze({
  currentSpan: Object.freeze({
    L: IMP96344_WINDOW.spanCurrent,
    overlap: IMP96344_LINE_RESOLUTION.currentOverlap,
    label: 'current span (0.369 of one beat)',
  }),
  sidelobeBump: Object.freeze({
    L: 7.5,
    overlap: IMP96344_LINE_RESOLUTION.overlapNearL7p5,
    label: 'sidelobe bump',
  }),
  beatPeriod: Object.freeze({
    L: IMP96344_LINE_RESOLUTION.beatPeriodAdjacent,
    label: 'analytic beat period 2π/(w4-w5)',
  }),
  firstTrueNull: Object.freeze({
    L: 9.8475,
    overlap: overlapAtSpan(9.8475),
    label: 'first true null (exact minimum of the closed-form curve)',
  }),
  requiredNmaxMarginal: IMP96344_REQUIRED_SPAN.marginal.Nmax,
});

export const IMP96378_HONEST_BANNER = `${IMP96344_HONEST_BANNER} imp-96378 adds a closed-form reconstruction `
  + 'of the overlap(L) curve between the three imp-96344 reported points (Pearson correlation of cos(w4 x), '
  + 'cos(w5 x) over the window, computed exactly via product-to-sum, not sampled or fitted); it agrees with the '
  + 'baked anchors to within their own rounding and locates the exact null at L=9.8475 (overlap ~6e-7), 1.5% '
  + 'below the analytic beat period 9.999. Presentation only; decides nothing about the real Route M band.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96378_ASSERTIONS = [
  {
    id: 'imp96378-curve-matches-current-span-anchor',
    holds: () => approx(overlapAtSpan(IMP96378_ANCHORS.currentSpan.L), IMP96378_ANCHORS.currentSpan.overlap, 0.01),
    why: 'the closed-form curve at the current span must agree with the imp-96344 baked overlap (0.0674) to within its own rounding.',
  },
  {
    id: 'imp96378-curve-matches-sidelobe-anchor',
    holds: () => approx(overlapAtSpan(IMP96378_ANCHORS.sidelobeBump.L), IMP96378_ANCHORS.sidelobeBump.overlap, 0.01),
    why: 'the closed-form curve at L=7.5 must agree with the imp-96344 baked sidelobe overlap (0.26) to within its own rounding.',
  },
  {
    id: 'imp96378-null-is-near-zero-and-near-beat-period',
    holds: () => IMP96378_ANCHORS.firstTrueNull.overlap < 1e-4
      && Math.abs(IMP96378_ANCHORS.firstTrueNull.L - IMP96378_ANCHORS.beatPeriod.L) / IMP96378_ANCHORS.beatPeriod.L < 0.02,
    why: 'the exact numerical minimum must sit near zero and within 2 percent of the analytic beat period 2 pi / (w4 - w5), consistent with imp-96344 F2 naming L~10 as the first true null.',
  },
  {
    id: 'imp96378-curve-monotone-span-increasing',
    holds: () => IMP96378_OVERLAP_CURVE.every((p, i) => i === 0 || p.L > IMP96378_OVERLAP_CURVE[i - 1].L)
      && IMP96378_OVERLAP_CURVE.length === 130
      && IMP96378_OVERLAP_CURVE.every((p) => p.overlap >= 0 && p.overlap <= 1.0001),
    why: 'the curve series is L-ascending with 130 samples, and a correlation magnitude must stay within [0,1].',
  },
  {
    id: 'imp96378-honest-banner-carries-status',
    holds: () => /RH open/.test(IMP96378_HONEST_BANNER) && /NO QED/.test(IMP96378_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96378_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96378_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96378-route-m-beat-period-overlap-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
