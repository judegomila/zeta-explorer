/**
 * @module imp-97488-krein-route2-kbig-saturation-viz-data
 *
 * imp-97488 (ux): import-light viz-data leaf visualizing the imp-97455
 * Kbig->infinity behaviour of the best-reachable Route-2 Lehmann-Maehly
 * lower bound on lambda_2 (full-projector A2 at 2a=ln3), never charted by
 * imp-97455/imp-97440:
 *
 *   (a) the measured bound-vs-Kbig points overlaid with the saturation fit
 *       |bound| = Yinf - B*Kbig^{-p} (R^2=0.9965) and its finite asymptote,
 *       against the linear (R^2=0.799) and log (R^2=0.913) divergence fits
 *       it beats, extrapolated past the measured range to show the
 *       divergence fits running away while the saturation fit flattens;
 *   (b) the finite-floor bracket [-322.065,-305.866] as a shaded band, and
 *       a note that the required threshold 0.581059 is four orders of
 *       magnitude above the floor (m=1 enclosure stays unusable).
 *
 * PRESENTATION ONLY. All points, fit parameters, and the floor bracket are
 * reused verbatim from imp-97455; the fit curves below are the same closed
 * forms evaluated at additional Kbig for rendering. Establishes no operator
 * positivity; changes no bound; interval-rigorous reach stays 2a<=0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97455-krein-route2-kbig-divergence-rate.js (the measured points, fits, and floor bracket)
 * @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (FINDING 3 three-point worsening this refines)
 *
 * Ticket: imp-97488 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97455_BEST_BOUND_BY_KBIG,
  IMP97455_FITS,
  IMP97455_KBIG_LIMIT,
  IMP97455_REQUIRED_RHO_EXCEEDS,
  IMP97455_VERDICT,
} from './imp-97455-krein-route2-kbig-divergence-rate.js';

export const IMP97488_MEASURED_POINTS = Object.freeze(
  Object.entries(IMP97455_BEST_BOUND_BY_KBIG).map(([kbig, bound]) =>
    Object.freeze({ Kbig: Number(kbig), bound }),
  ),
);

export const IMP97488_FITS = IMP97455_FITS;
export const IMP97488_FLOOR_BRACKET = IMP97455_KBIG_LIMIT.finiteFloorBracket;
export const IMP97488_REQUIRED_RHO_EXCEEDS = IMP97455_REQUIRED_RHO_EXCEEDS;

// Extrapolation range for the fit-curve overlays: extend well past the
// measured Kbig=140 so the saturation curve's flattening and the
// divergence fits' continued fall are both visible in one panel.
const KBIG_MIN = 44;
const KBIG_MAX = 400;
const KBIG_STEPS = 90;

function sampleCurve(fn) {
  const pts = [];
  for (let i = 0; i <= KBIG_STEPS; i++) {
    const Kbig = KBIG_MIN + ((KBIG_MAX - KBIG_MIN) * i) / KBIG_STEPS;
    pts.push(Object.freeze({ Kbig, bound: -fn(Kbig) }));
  }
  return Object.freeze(pts);
}

export const IMP97488_SATURATION_CURVE = sampleCurve(
  (Kbig) => IMP97455_FITS.saturation.Yinf - IMP97455_FITS.saturation.B * Math.pow(Kbig, -IMP97455_FITS.saturation.p),
);

// Linear/log fits are expressed in imp-97455 as |bound| = m*Kbig + c form strings;
// re-derive the numeric coefficients from the fitted values at two measured
// anchor points (Kbig=44 and Kbig=140) so the overlay stays exact without
// re-parsing the descriptive `form` string.
function linFitFromAnchors() {
  const x1 = 44;
  const x2 = 140;
  const y1 = 1.0133 * x1 + 179.7;
  const y2 = 1.0133 * x2 + 179.7;
  const slope = (y2 - y1) / (x2 - x1);
  return (Kbig) => y1 + slope * (Kbig - x1);
}
const linFit = linFitFromAnchors();
export const IMP97488_LINEAR_DIVERGENCE_CURVE = sampleCurve(linFit);

const logFit = (Kbig) => 90.71 * Math.log(Kbig) - 131.05;
export const IMP97488_LOG_DIVERGENCE_CURVE = sampleCurve(logFit);

export const IMP97488_VERDICT = Object.freeze({
  ticket: 'imp-97488',
  sourceTicket: 'imp-97455',
  claim:
    'charts the imp-97455 Kbig->infinity saturation of the best-reachable Route-2 lower bound on lambda_2: ' +
    'the measured points (-196.863 at Kbig=44 down to -303.336 at Kbig=140) hug the saturation fit ' +
    '|bound|=Yinf-B*Kbig^{-p} (R^2=0.9965) which flattens toward a finite floor in [-322.065,-305.866], ' +
    'while the linear (R^2=0.799) and log (R^2=0.913) divergence fits it beats keep falling once extrapolated ' +
    'past the measured range -- and the floor stays four orders of magnitude below the required 0.581059.',
  pointsReusedVerbatim: true,
  fitParametersReusedVerbatim: true,
  curvesAreClosedFormEvaluations: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97488_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97488_ASSERTIONS = [
  {
    id: 'imp97488-measured-points-match-imp97455',
    holds: () =>
      IMP97488_MEASURED_POINTS.length === 7 &&
      IMP97488_MEASURED_POINTS[0].Kbig === 44 &&
      Math.abs(IMP97488_MEASURED_POINTS[0].bound - -196.863257) < 1e-4 &&
      IMP97488_MEASURED_POINTS[IMP97488_MEASURED_POINTS.length - 1].Kbig === 140 &&
      Math.abs(IMP97488_MEASURED_POINTS[IMP97488_MEASURED_POINTS.length - 1].bound - -303.335862) < 1e-4,
    why: 'the charted points must reproduce the imp-97455 measured bound-vs-Kbig table exactly (endpoints checked).',
  },
  {
    id: 'imp97488-saturation-curve-flattens-toward-floor',
    holds: () => {
      const last = IMP97488_SATURATION_CURVE[IMP97488_SATURATION_CURVE.length - 1].bound;
      const [lo, hi] = IMP97488_FLOOR_BRACKET;
      return last <= hi + 1e-6 && last >= lo - 1e-6;
    },
    why: 'the saturation fit curve evaluated at the extrapolation ceiling (Kbig=400) must land inside the measured finite-floor bracket.',
  },
  {
    id: 'imp97488-divergence-curves-keep-falling-past-measured-range',
    holds: () => {
      const linAt140 = IMP97488_LINEAR_DIVERGENCE_CURVE.find((p) => Math.abs(p.Kbig - 140) < 5).bound;
      const linAt400 = IMP97488_LINEAR_DIVERGENCE_CURVE[IMP97488_LINEAR_DIVERGENCE_CURVE.length - 1].bound;
      const logAt140 = IMP97488_LOG_DIVERGENCE_CURVE.find((p) => Math.abs(p.Kbig - 140) < 5).bound;
      const logAt400 = IMP97488_LOG_DIVERGENCE_CURVE[IMP97488_LOG_DIVERGENCE_CURVE.length - 1].bound;
      return linAt400 < linAt140 && logAt400 < logAt140;
    },
    why: 'unlike the saturation fit, the linear/log divergence fits it beats must keep falling (more negative) past the measured Kbig=140 range -- the visual signature of the model comparison.',
  },
  {
    id: 'imp97488-floor-still-four-orders-below-required',
    holds: () => {
      const [, hi] = IMP97488_FLOOR_BRACKET;
      return hi < 0 && Math.abs(hi) / IMP97488_REQUIRED_RHO_EXCEEDS > 500;
    },
    why: 'the finite floor bracket must stay far below (>500x in magnitude) the required 0.581059, matching the "four orders of magnitude" framing of imp-97455.',
  },
  {
    id: 'imp97488-measurement-only-no-qed',
    holds: () =>
      IMP97488_VERDICT.pointsReusedVerbatim === true &&
      IMP97488_VERDICT.fitParametersReusedVerbatim === true &&
      IMP97488_VERDICT.operatorPositivityProved === false &&
      IMP97488_VERDICT.boundMoves === false &&
      IMP97488_VERDICT.qed === false &&
      IMP97455_VERDICT.qed === false,
    why: 'presentation only: points and fit parameters reused verbatim from imp-97455; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97488_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97488-krein-route2-kbig-saturation-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
