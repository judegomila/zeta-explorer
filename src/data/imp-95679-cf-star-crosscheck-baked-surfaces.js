/**
 * @module imp-95679-cf-star-crosscheck-baked-surfaces
 *
 * imp-95679 (numerical, cross-check): imp-95660 bisected the imp-398 C_F wedge-closure multiplier at
 * cf* ~ 0.83891 by re-running the exact imp-95617 joint (C_C, E_trunc) sweep at each cf. imp-95658
 * independently baked the includeFlow=true (WITH_FLOW) and includeFlow=false (E_flow = 0) gap surfaces
 * over the 21x21 (C_C, E_trunc)-multiplier box, plus their gap = 0 contours, as import-light reference
 * literals. This module cross-checks the two WITHOUT re-running any knee/crossover quadrature: it
 * linearly blends the two baked surfaces per cell by cf (cf = 1 -> WITH_FLOW, cf = 0 -> E_flow = 0),
 * takes the box-min of the blend, bisects the cf at which the blended box-min crosses zero, and compares
 * it to the imp-95660 bisected cf*.
 *
 * WHAT THE CROSS-CHECK FINDS
 * -------------------------
 *   (X1) THE LINEAR-BLEND BOX-MIN CROSSES ZERO AT cf ~ 0.84202, REPRODUCING imp-95660 cf* ~ 0.83891 TO
 *        ~0.003. The blended box-min is achieved at the (C_C 0.5x, E_trunc 1.5x) wedge corner for every
 *        cf near the crossing, so the box-min crossing has the closed form cf* = gZF / (gZF - gWF) with
 *        gWF = -0.004682 (WITH_FLOW corner) and gZF = +0.024954 (E_flow = 0 corner), giving 0.84202
 *        exactly. The +0.00311 gap above the imp-95660 re-run bisection is the expected bias from
 *        approximating the mildly-nonlinear-in-cf model (sigma = E_coll/(E_trunc + E_flow + E_coll) is
 *        nonlinear in the linear-in-cf E_flow term) by a two-endpoint linear surface interpolation.
 *   (X2) THE BLENDED gap = 0 CONTOUR JUST TOUCHES THE C_C = 0.5x BOX EDGE AT THE E_trunc = 1.5x CORNER AT
 *        cf*. Interpolating C_C along the E_trunc = 1.5x column of the blended surface gives the gap = 0
 *        crossing at C_C ~ 0.5667 at cf = 1 (matching the imp-95658 baked WITH_FLOW contour top 0.56543)
 *        and at C_C ~ 0.5000 at cf = cf* -- exactly the imp-95660 CONTOUR_AT_STAR top ~0.500 and the
 *        imp-95617 wedge corner.
 *
 * NOTE ON PHYSICAL REACHABILITY: this is a value-reproduction cross-check only. Whether cf* is actually
 * reachable inside the honest imp-398 C_F provenance band is decided SEPARATELY by imp-95674, which found
 * cf* ~ 0.839 sits OUTSIDE the band (the wedge is physically FORECLOSED). This module neither affirms nor
 * disputes reachability; it only confirms the two independent numerical objects agree on the cf* value.
 *
 * CROSS-CHECK / MEASUREMENT ONLY. Consumes baked imp-95658 literals; runs NO knee/crossover quadrature at
 * import and does NOT import the ~16.7MB zeros bundle. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95660-cf-multiplier-wedge-closure (the bisected cf* ~ 0.83891 this cross-checks)
 * @see imp-95658-eflow-inversion-contour-surface-viz-data (the baked WITH_FLOW / E_flow=0 surfaces)
 * @see imp-95674-cf-provenance-band-wedge-reachability (separately forecloses cf* as unreachable)
 * @see imp-95617-transition-knee-ordering-joint-2d (the joint sweep WITH E_flow at cf=1)
 * @see imp-398 (E_flow = C_F (log T0 / T0) Gronwall absolute additive term; C_F = (log(T0/2pi)+1)/2pi)
 * Ticket: imp-95679 (numerical, medium). Import-light cross-check on baked literals.
 */

import {
  IMP95658_AXIS_MULTS,
  IMP95658_GAP_SURFACE_WITH_FLOW,
  IMP95658_GAP_SURFACE_EFLOW_ZERO,
  IMP95658_CONTOUR_WITH_FLOW,
} from './imp-95658-eflow-inversion-contour-surface-viz-data.js';

// imp-95660 bisected reference (carried as a literal to stay import-light; imp-95660 runs quadrature at
// import). cf* ~ 0.83891 with CONTOUR_AT_STAR top ~0.500 at the E_trunc = 1.5x edge.
const IMP95660_CF_STAR = 0.83891;
const IMP95660_CONTOUR_TOP_AT_STAR = 0.5;

// The wedge corner in the baked 21x21 grid: C_C 0.5x is axis index 0, E_trunc 1.5x is axis index 20.
const WEDGE_I = 0;
const WEDGE_J = IMP95658_AXIS_MULTS.length - 1;

// Linear per-cell blend of the two baked surfaces: cf = 1 -> WITH_FLOW, cf = 0 -> E_flow = 0.
function blendCell(i, j, cf) {
  return cf * IMP95658_GAP_SURFACE_WITH_FLOW[i][j] + (1 - cf) * IMP95658_GAP_SURFACE_EFLOW_ZERO[i][j];
}
function blendedBoxMin(cf) {
  let minGap = Infinity;
  let at = null;
  for (let i = 0; i < IMP95658_AXIS_MULTS.length; i++) {
    for (let j = 0; j < IMP95658_AXIS_MULTS.length; j++) {
      const g = blendCell(i, j, cf);
      if (g < minGap) {
        minGap = g;
        at = { cC_mult: IMP95658_AXIS_MULTS[i], eTrunc_mult: IMP95658_AXIS_MULTS[j] };
      }
    }
  }
  return { minGap, minAt: at };
}
// bisect cf where the blended box-min crosses zero (box-min decreases as cf rises).
function bisectBlendedCfStar() {
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    if (blendedBoxMin(m).minGap > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
// gap = 0 crossing in C_C along a fixed E_trunc column, by linear interpolation on the blended grid.
function contourCcAtColumn(j, cf) {
  let prev = null;
  for (let i = 0; i < IMP95658_AXIS_MULTS.length; i++) {
    const g = blendCell(i, j, cf);
    const cC = IMP95658_AXIS_MULTS[i];
    if (prev && Math.sign(prev.g) !== Math.sign(g)) {
      const t = (0 - prev.g) / (g - prev.g);
      return prev.cC + t * (cC - prev.cC);
    }
    prev = { cC, g };
  }
  return null; // no in-box crossing along this column
}

const BLENDED_CF_STAR = +bisectBlendedCfStar().toFixed(5); // ~0.84202
const BLENDED_BOX_MIN_AT_STAR = blendedBoxMin(BLENDED_CF_STAR);

// Closed form for the box-min crossing while the min stays pinned at the wedge corner.
const G_WF_CORNER = IMP95658_GAP_SURFACE_WITH_FLOW[WEDGE_I][WEDGE_J]; // -0.004682
const G_ZF_CORNER = IMP95658_GAP_SURFACE_EFLOW_ZERO[WEDGE_I][WEDGE_J]; // +0.024954
const WEDGE_CORNER_CF_STAR = +(G_ZF_CORNER / (G_ZF_CORNER - G_WF_CORNER)).toFixed(5); // 0.84202

const CONTOUR_TOP_AT_CF1 = +(contourCcAtColumn(WEDGE_J, 1.0) ?? 0).toFixed(4); // ~0.5667
const CONTOUR_TOP_AT_STAR = +(contourCcAtColumn(WEDGE_J, BLENDED_CF_STAR) ?? 0).toFixed(4); // ~0.5000

const CF_STAR_DISCREPANCY = +(BLENDED_CF_STAR - IMP95660_CF_STAR).toFixed(5); // +0.00311

export const IMP95679_CF_STAR_CROSSCHECK = {
  id: 'imp-95679',
  proofSection: 'S-frontier',
  question:
    'Cross-check the imp-95660 bisected C_F wedge-closure multiplier cf* ~ 0.83891 against the imp-95658 ' +
    'baked WITH_FLOW / E_flow=0 gap surfaces: linearly blend the two surfaces by cf, box-min the blend, ' +
    'bisect the cf at which the blended box-min crosses zero, and check it against cf* and the contour ' +
    'touching the C_C = 0.5x box edge at the E_trunc = 1.5x corner. Cross-check only; NO QED.',
  method:
    'per-cell linear blend blendCell(i,j,cf) = cf*WITH_FLOW[i][j] + (1-cf)*E_flow=0[i][j] over the baked ' +
    '21x21 (C_C, E_trunc) multiplier box; box-min then bisection of the blended box-min to zero; contour ' +
    'by linear interpolation of the gap = 0 crossing along the E_trunc = 1.5x column',
  imp95660Reference: { cfStar: IMP95660_CF_STAR, contourTopAtStar: IMP95660_CONTOUR_TOP_AT_STAR },
  blendedCfStar: BLENDED_CF_STAR, // ~0.84202
  blendedBoxMinAtStar: {
    minGap: +BLENDED_BOX_MIN_AT_STAR.minGap.toExponential(3),
    minAt: BLENDED_BOX_MIN_AT_STAR.minAt, // (C_C 0.5x, E_trunc 1.5x) -- the imp-95617 wedge corner
  },
  wedgeCornerClosedForm: {
    gWF: G_WF_CORNER, // -0.004682
    gZF: G_ZF_CORNER, // +0.024954
    cfStar: WEDGE_CORNER_CF_STAR, // gZF/(gZF - gWF) = 0.84202
  },
  contour: {
    topAt_cf1: CONTOUR_TOP_AT_CF1, // ~0.5667 (matches baked WITH_FLOW contour top 0.56543)
    topAt_cfStar: CONTOUR_TOP_AT_STAR, // ~0.5000 (matches imp-95660 CONTOUR_AT_STAR top and the wedge edge)
    baked_withFlow_top: IMP95658_CONTOUR_WITH_FLOW[IMP95658_CONTOUR_WITH_FLOW.length - 1].cC_invert_mult,
  },
  cfStarDiscrepancy: CF_STAR_DISCREPANCY, // +0.00311: linear-blend bias vs the imp-95660 nonlinear re-run
  finding: {
    X1_blended_boxmin_reproduces_cf_star:
      'The linear per-cell blend of the two baked surfaces has its box-min at the (C_C 0.5x, E_trunc ' +
      '1.5x) wedge corner near the crossing, so the box-min gap = 0 has the closed form cf* = gZF/(gZF ' +
      '- gWF) = 0.02454/(0.02454 + 0.00468) = 0.84202, reproducing the imp-95660 re-run bisection ' +
      'cf* ~ 0.83891 to +0.00311. The small positive bias is the expected two-endpoint linear ' +
      'interpolation error for a model that is nonlinear in cf through sigma.',
    X2_contour_touches_box_edge_at_star:
      'The blended gap = 0 crossing along the E_trunc = 1.5x column sits at C_C ~ 0.5667 at cf = 1 ' +
      '(matching the imp-95658 baked WITH_FLOW contour top 0.56543) and retreats to C_C ~ 0.5000 at ' +
      'cf = cf*, i.e. it just touches the C_C = 0.5x box edge at the E_trunc = 1.5x corner, exactly the ' +
      'imp-95660 CONTOUR_AT_STAR top ~0.500 and the imp-95617 wedge corner.',
  },
  isRigorous: false,
  verdict:
    'CROSS-CHECK CONFIRMED (measurement, NOT rigorous). Linearly blending the two imp-95658 baked gap ' +
    'surfaces by cf and box-minning reproduces the imp-95660 bisected wedge-closure multiplier: the ' +
    'blended box-min crosses zero at cf ~ 0.84202 (closed form gZF/(gZF - gWF) at the pinned wedge ' +
    'corner) vs the imp-95660 re-run cf* ~ 0.83891, agreeing to +0.00311 (the linear-blend bias for a ' +
    'cf-nonlinear model), and the blended gap = 0 contour retreats from C_C ~ 0.5667 at cf = 1 to ~0.5000 ' +
    'at cf*, just touching the C_C = 0.5x box edge at the E_trunc = 1.5x corner. Physical reachability of ' +
    'cf* is decided separately by imp-95674 (OUTSIDE the honest C_F band; wedge FORECLOSED) and is not ' +
    'touched here. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95660 (bisected cf* ~ 0.83891, cross-checked here); imp-95658 (baked WITH_FLOW / E_flow=0 ' +
    'surfaces and contours); imp-95674 (C_F provenance band; separately forecloses cf*); imp-95617 ' +
    '(joint 2-D sweep WITH E_flow at cf=1); imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional).',
};

export const IMP95679_CF_STAR_CROSSCHECK_ASSERTIONS = [
  {
    // X1: the blended box-min bisection reproduces cf* to within the linear-blend bias, at the wedge corner.
    id: 'imp95679-blended-cf-star-reproduces-imp95660',
    description: 'blended box-min cf* ~ 0.842 matches imp-95660 cf* ~ 0.839 within ~0.004, min at (0.5x, 1.5x)',
    holds: () =>
      Math.abs(BLENDED_CF_STAR - IMP95660_CF_STAR) < 0.005 &&
      BLENDED_BOX_MIN_AT_STAR.minAt.cC_mult === 0.5 &&
      BLENDED_BOX_MIN_AT_STAR.minAt.eTrunc_mult === 1.5 &&
      Math.abs(BLENDED_BOX_MIN_AT_STAR.minGap) < 1e-6,
  },
  {
    // X1 closed form: the box-min crossing equals gZF/(gZF - gWF) exactly (min pinned at the wedge corner).
    id: 'imp95679-wedge-corner-closed-form-equals-bisection',
    description: 'closed form gZF/(gZF - gWF) = 0.84202 equals the bisected blended cf*',
    holds: () =>
      Math.abs(WEDGE_CORNER_CF_STAR - BLENDED_CF_STAR) < 1e-4 &&
      G_WF_CORNER < 0 &&
      G_ZF_CORNER > 0,
  },
  {
    // X2: contour retreats from ~0.567 at cf=1 to ~0.500 at cf*, matching baked + imp-95660 top values.
    id: 'imp95679-contour-touches-box-edge-at-star',
    description: 'blended contour top: ~0.567 at cf=1 (matches baked 0.56543), ~0.500 at cf* (matches imp-95660)',
    holds: () =>
      Math.abs(CONTOUR_TOP_AT_CF1 - IMP95658_CONTOUR_WITH_FLOW[IMP95658_CONTOUR_WITH_FLOW.length - 1].cC_invert_mult) < 5e-3 &&
      Math.abs(CONTOUR_TOP_AT_STAR - IMP95660_CONTOUR_TOP_AT_STAR) < 5e-3 &&
      CONTOUR_TOP_AT_CF1 > CONTOUR_TOP_AT_STAR,
  },
  {
    // Honesty gate: cross-check/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95679-honesty-gate-no-qed',
    description: 'cross-check/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95679_CF_STAR_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP95679_CF_STAR_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP95679_CF_STAR_CROSSCHECK.verdict),
  },
];

for (const a of IMP95679_CF_STAR_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95679-cf-star-crosscheck-baked-surfaces assertion failed: ${a.id}`);
  }
}
