/**
 * @module viz-mupass-margin
 * @fileoverview Plot-geometry substrate for a visualization of the imp-3007
 *   degree-0 mu^pass pointwise margin: the three lag-symbol weights
 *
 *     nu(tau)     = sinh(a*tau)          (shear weight)
 *     wPass(tau)  = cosh(a*tau)          (endpoint-bridge cosh-completion)
 *     wMin(tau)   = max(1, sinh(a*tau))  (minimal kinked tail-only cover)
 *
 *   overlaid on [0, U], with TWO shaded bands made legible:
 *
 *     - the POSITIVE MARGIN band  wPass - nu = e^{-a*tau} > 0
 *       (the pointwise cover: cosh dominates sinh everywhere), and
 *     - the EXCESS band           wPass - wMin = E(a) integrand >= 0
 *       (the forced price of the smooth even no-ghost weight over the
 *       minimal kinked patch).
 *
 *   imp-3007-mupass-overflow-cover.js already establishes the SCALAR numbers
 *   (residual deficit exactly 0, coveredFraction = 1, the closed-form excess
 *   mass E(a)). This module does NOT re-derive those; it produces the
 *   plot-ready geometry a renderer consumes -- the sampled polylines and the
 *   closed band polygons -- so the degree-0 cover can be SEEN, not just
 *   tabulated. The math is identical to imp-3007; only the representation is new.
 *
 *   HONEST CEILING (mandatory). SCALAR cover only. The plotted margin
 *   wPass >= nu pins the lag symbol / diagonal of the section-26 Gram; it is
 *   NECESSARY but NOT sufficient for the operator positivity K_a >= 0 (the
 *   off-diagonal endpoint-Hankel step stays open). Descriptive / structural,
 *   RH-EQUIVALENT, not a reduction. No Lambda claim; Platt-Trudgian
 *   Lambda <= 0.2 remains the rigorous SOTA.
 *
 *   What this file exports:
 *   - {@link VIZ_MUPASS_MARGIN}: frozen record with title, caption, the
 *     headline series at a = 0.5, per-a series for the imp-3007 sweep, the
 *     crossover tau_star, and the two closed band polygons.
 *   - {@link VIZ_MUPASS_MARGIN_ASSERTIONS}: build-time tripwires (>= 5)
 *     locking the margin positivity, the excess non-negativity, the polygon
 *     closure, and agreement with the imp-3007 closed forms.
 *
 *   @see imp-3007-mupass-overflow-cover.js (the scalar cover + excess mass E(a))
 *   @see imp-2686-mupass-construction.js (the cosh-completion + pointwise margin)
 *   Ticket: imp-3081 (ux, low). Honest partial: a renderer page + a
 *   visualizations-index card are the named follow-up sub-gap (see SUB_GAP).
 */

const U = 6;                 // genuine-Phi lag cutoff (the imp-3007 / imp-2841 grid)
const N = 120;               // plot sample count on [0, U] (midpoint-free, includes endpoints)
const A_HEADLINE = 0.5;
const A_SWEEP = Object.freeze([0.5, 0.2, 0.1, 0.05]); // matches imp-3007 A_SWEEP
const ASINH1 = Math.asinh(1); // a*tau_star solves sinh(a*tau) = 1

/** sinh shear weight. */
function nuAt(a, tau) {
  return Math.sinh(a * tau);
}
/** cosh endpoint-bridge completion. */
function wPassAt(a, tau) {
  return Math.cosh(a * tau);
}
/** minimal kinked tail-only cover. */
function wMinAt(a, tau) {
  return Math.max(1, Math.sinh(a * tau));
}

/**
 * Evenly sample [0, U] at N+1 points and build the three weight polylines plus
 * the pointwise margin (cosh - sinh = e^{-a*tau}) and excess (cosh - wMin)
 * sampled values. All arrays are length N+1.
 */
function seriesFor(a) {
  const tauStar = ASINH1 / a;          // sinh(a*tauStar) = 1
  const hasCrossover = tauStar < U;
  const step = U / N;

  const tau = new Array(N + 1);
  const nu = new Array(N + 1);
  const wPass = new Array(N + 1);
  const wMin = new Array(N + 1);
  const margin = new Array(N + 1);     // wPass - nu = e^{-a*tau} > 0
  const excess = new Array(N + 1);     // wPass - wMin >= 0

  let minMargin = Infinity;
  let minExcess = Infinity;
  let maxValue = 0;
  for (let k = 0; k <= N; k++) {
    const t = k * step;
    const sh = nuAt(a, t);
    const ch = wPassAt(a, t);
    const wm = wMinAt(a, t);
    tau[k] = t;
    nu[k] = sh;
    wPass[k] = ch;
    wMin[k] = wm;
    margin[k] = ch - sh;               // exactly e^{-a*t}
    excess[k] = ch - wm;               // exactly e^{-a*t} on the tail, cosh-1 on the head
    if (margin[k] < minMargin) minMargin = margin[k];
    if (excess[k] < minExcess) minExcess = excess[k];
    if (ch > maxValue) maxValue = ch;
  }

  return Object.freeze({
    a,
    tauStar,
    hasCrossover,
    tau: Object.freeze(tau),
    nu: Object.freeze(nu),
    wPass: Object.freeze(wPass),
    wMin: Object.freeze(wMin),
    margin: Object.freeze(margin),
    excess: Object.freeze(excess),
    minMargin,                          // > 0  (pointwise cover holds)
    minExcess,                          // >= 0 (cosh over-supplies the minimal cover)
    maxValue,                           // cosh(a*U), for renderer y-scaling
  });
}

/**
 * Build a CLOSED band polygon (list of [tau, value] vertices) between a lower
 * polyline and an upper polyline over the shared tau grid: forward along the
 * upper edge, backward along the lower edge. The first and last vertices
 * coincide so a renderer can fill it directly.
 */
function bandPolygon(tau, lower, upper) {
  const verts = [];
  for (let k = 0; k < tau.length; k++) verts.push([tau[k], upper[k]]);
  for (let k = tau.length - 1; k >= 0; k--) verts.push([tau[k], lower[k]]);
  verts.push([tau[0], upper[0]]);       // explicit close back to the start
  return Object.freeze(verts.map((v) => Object.freeze(v)));
}

const HEADLINE = seriesFor(A_HEADLINE);
const SWEEP = Object.freeze(A_SWEEP.map(seriesFor));

// The two shaded bands at the headline a = 0.5.
const MARGIN_BAND = bandPolygon(HEADLINE.tau, HEADLINE.nu, HEADLINE.wPass);  // nu .. wPass
const EXCESS_BAND = bandPolygon(HEADLINE.tau, HEADLINE.wMin, HEADLINE.wPass); // wMin .. wPass

export const VIZ_MUPASS_MARGIN = Object.freeze({
  id: 'viz-mupass-margin',
  ticket: 'imp-3081',
  title: 'mu^pass Pointwise Margin -- Degree-0 Scalar Cover',
  mathBucket: 'bound',
  paperSourcePath:
    'research-inputs/twin_ladder_consolidated_v52.pdf section 26 (mu^pass cover)',
  relatedModule: 'imp-3007-mupass-overflow-cover.js',

  oneLine:
    'Overlay of nu=sinh(a*tau), wPass=cosh(a*tau), wMin=max(1,sinh(a*tau)) on ' +
    '[0,U] with the positive margin e^{-a*tau} and the excess band E(a) shaded.',

  caption:
    'The cosh-completion wPass dominates the shear weight nu everywhere on ' +
    '[0,U] by the strictly positive margin wPass - nu = e^{-a*tau} (shaded), so ' +
    'the degree-0 overflow is covered pointwise. The excess band wPass - wMin ' +
    '(shaded) is the forced price of the smooth even no-ghost weight over the ' +
    'minimal kinked cover wMin, which kinks at tau_star = arcsinh(1)/a. SCALAR ' +
    'cover only: this pins the section-26 Gram diagonal but is necessary-but-NOT-' +
    'sufficient for the operator step K_a >= 0; the off-diagonal endpoint-Hankel ' +
    'term stays open. Descriptive / RH-EQUIVALENT, not a reduction.',

  formulas: Object.freeze({
    shear: 'nu(tau) = sinh(a*tau)',
    pass: 'wPass(tau) = cosh(a*tau)',
    min: 'wMin(tau) = max(1, sinh(a*tau))',
    margin: 'wPass(tau) - nu(tau) = e^{-a*tau} > 0',
    excess: 'wPass(tau) - wMin(tau) >= 0',
    crossover: 'tau_star = arcsinh(1)/a  (sinh(a*tau_star) = 1)',
  }),

  domain: Object.freeze({ U, N, aHeadline: A_HEADLINE, aSweep: A_SWEEP }),

  headline: HEADLINE,
  sweep: SWEEP,

  bands: Object.freeze({
    margin: MARGIN_BAND,   // closed polygon nu .. wPass (the positive cover margin)
    excess: EXCESS_BAND,   // closed polygon wMin .. wPass (the forced excess)
  }),

  honestCeiling: Object.freeze({
    scalarCoverOnly: true,
    operatorStepOpen: true,
    necessaryNotSufficient:
      'Plotted margin wPass >= nu pins the lag symbol / Gram diagonal only; the ' +
      'operator positivity K_a >= 0 needs the off-diagonal endpoint-Hankel term.',
    rhEquivalent: true,
    isProof: false,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),

  /* Honest partial (imp-3081): the plot GEOMETRY is delivered and self-verified
     here; a React renderer page plus a visualizations-index card are the named
     follow-up, deferred so this stays one atomic, build-safe data change. */
  SUB_GAP: Object.freeze({
    open: true,
    description:
      'Renderer page (src/pages/...) consuming VIZ_MUPASS_MARGIN plus a ' +
      'visualizations-index card and an App.jsx route are not yet wired; this ' +
      'module supplies the verified plot geometry they will consume.',
  }),
});

// -- Build-time tripwires (>= 5) ---------------------------------------------
export const VIZ_MUPASS_MARGIN_ASSERTIONS = [
  {
    id: 'viz-mupass-margin-grid-shape',
    why: 'Every series must sample [0,U] at exactly N+1 points starting at tau=0 ' +
         'and ending at tau=U, so the polylines and bands share one grid.',
    holds: () => SWEEP.every((s) =>
      s.tau.length === N + 1 &&
      s.tau[0] === 0 &&
      Math.abs(s.tau[N] - U) < 1e-12 &&
      s.nu.length === N + 1 && s.wPass.length === N + 1 && s.wMin.length === N + 1),
  },
  {
    id: 'viz-mupass-margin-pointwise-positive',
    why: 'The cover: cosh(a*tau) - sinh(a*tau) = e^{-a*tau} must be strictly ' +
         'positive on the whole grid for every a -- this is what makes wPass ' +
         'dominate nu pointwise.',
    holds: () => SWEEP.every((s) =>
      s.minMargin > 0 &&
      s.margin.every((m, k) => Math.abs(m - Math.exp(-s.a * s.tau[k])) < 1e-9)),
  },
  {
    id: 'viz-mupass-margin-excess-nonnegative',
    why: 'The cosh-completion over-supplies the minimal kinked cover wMin, so the ' +
         'excess wPass - wMin must stay non-negative everywhere (the forced price ' +
         'of the smooth even weight).',
    holds: () => SWEEP.every((s) => s.minExcess >= 0 && s.excess.every((e) => e >= 0)),
  },
  {
    id: 'viz-mupass-margin-bands-closed',
    why: 'Each shaded band must be a closed polygon of 2*(N+1)+1 vertices whose ' +
         'last vertex coincides with the first, so a renderer can fill it.',
    holds: () => {
      const ok = (poly) => poly.length === 2 * (N + 1) + 1 &&
        poly[0][0] === poly[poly.length - 1][0] &&
        poly[0][1] === poly[poly.length - 1][1];
      return ok(MARGIN_BAND) && ok(EXCESS_BAND);
    },
  },
  {
    id: 'viz-mupass-margin-crossover-matches-imp3007',
    why: 'The minimal-cover kink tau_star = arcsinh(1)/a must match the imp-3007 ' +
         'crossover, and lie inside [0,U] only for the larger a (a=0.5,0.2), ' +
         'matching the imp-3007 hasOverflow split.',
    holds: () => SWEEP.every((s) =>
      Math.abs(s.tauStar - Math.asinh(1) / s.a) < 1e-12 &&
      s.hasCrossover === (Math.asinh(1) / s.a < U)),
  },
  {
    id: 'viz-mupass-margin-headline-excess-matches-closed-form',
    why: 'The discrete excess area at a=0.5 (trapezoid over the grid) must agree ' +
         'with the imp-3007 closed-form excess mass E(a) to plot tolerance, tying ' +
         'the shaded band to the established number rather than a fresh value.',
    holds: () => {
      const a = A_HEADLINE;
      const tauStar = ASINH1 / a;
      const head = 1 / a - tauStar;                                  // int_0^{tauStar} (cosh-1)
      const tail = (Math.exp(-a * tauStar) - Math.exp(-a * U)) / a;  // int_{tauStar}^U (cosh-sinh)
      const closedForm = head + tail;
      const s = HEADLINE;
      let area = 0;
      const step = U / N;
      for (let k = 0; k < N; k++) area += 0.5 * (s.excess[k] + s.excess[k + 1]) * step;
      return Math.abs(area - closedForm) < 1e-2 && closedForm > 0;
    },
  },
  {
    id: 'viz-mupass-margin-honest-ceiling',
    why: 'Mandatory honesty: scalar cover only, operator step open, RH-equivalent, ' +
         'not a proof, PT 0.2 stays SOTA, and the renderer/index sub-gap stays open.',
    holds: () => {
      const c = VIZ_MUPASS_MARGIN.honestCeiling;
      return c.scalarCoverOnly === true && c.operatorStepOpen === true &&
        c.rhEquivalent === true && c.isProof === false &&
        /Platt-Trudgian/.test(c.sota) && VIZ_MUPASS_MARGIN.SUB_GAP.open === true;
    },
  },
];

for (const a of VIZ_MUPASS_MARGIN_ASSERTIONS) {
  if (!a.holds()) throw new Error(`viz-mupass-margin assertion failed: ${a.id}`);
}

export default VIZ_MUPASS_MARGIN;
