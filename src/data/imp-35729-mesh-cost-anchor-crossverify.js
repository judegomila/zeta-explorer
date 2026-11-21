/**
 * @module imp-35729-mesh-cost-anchor-crossverify
 *
 * imp-35729 (accuracy/verification, S-frontier): INDEPENDENTLY cross-verify the
 * three imp-35710 / imp-35675 baked finite-winding mesh-cost anchors at
 * T_PT = 3e12, WITHOUT reusing the imp-35675 closed-form constants:
 *   (1) local zero density ~4.28 zeros per unit height,
 *   (2) meshPerUnit ~12.84 mesh points per unit arc length,
 *   (3) the boundaryEvalsPerZero -> 6 asymptote.
 * Each anchor is re-derived here from first principles and only THEN compared
 * against the baked imp-35675 table within storage-precision tolerance.
 *
 * VERIFICATION ONLY. Recomputes numbers; changes no bound; ports nothing;
 * discharges nothing (the non-finite tail lemma B2 / W3 is untouched, imp-35674);
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * PART 1 -- LOCAL ZERO DENSITY FROM THE RIEMANN-VON MANGOLDT DERIVATIVE
 * -----------------------------------------------------------------------------
 * The Riemann-von Mangoldt counting function main term is
 *     N(T) = (T / 2 pi) log(T / 2 pi) - T / 2 pi + 7/8 + S(T) + ...,
 * whose smooth part has derivative
 *     dN/dT = (1 / 2 pi) log(T / 2 pi),
 * the local zero density at height T. Rather than quote the closed form, we
 * recover the density here as a CENTRAL FINITE DIFFERENCE of the RvM smooth
 * counting function N_smooth(T) = (T/2 pi) log(T/2 pi) - T/2 pi + 7/8 at
 * T = T_PT, and confirm it reproduces the baked localDensityAtTPT ~4.2799.
 *
 * PART 2 -- meshPerUnit FROM THE OVERSAMPLE x DENSITY PRODUCT
 * -----------------------------------------------------------------------------
 * meshPerUnit = OVERSAMPLE * density, with OVERSAMPLE = 3 boundary samples per
 * local zero spacing. Using the independently derived density, we recompute
 * 3 * density and confirm it matches the baked meshPerUnit ~12.8399.
 *
 * PART 3 -- THE boundaryEvalsPerZero -> 6 ASYMPTOTE FROM BOUNDARY GEOMETRY
 * -----------------------------------------------------------------------------
 * Total boundary evaluations M(Delta) = 2 * Delta * meshPerUnit + 4 * h * meshPerUnit
 * and enclosed zeros Z(Delta) = Delta * density, so
 *     M(Delta) / Z(Delta) = 2 * meshPerUnit / density + (4 * h * meshPerUnit) / (Delta * density).
 * As Delta -> infinity the fixed vertical-side overhead amortizes and the ratio
 * tends to 2 * meshPerUnit / density = 2 * OVERSAMPLE = 6 EXACTLY, independent of
 * height and of the density value. We confirm this both algebraically
 * (2 * OVERSAMPLE) and as a numerical large-Delta limit.
 *
 * @see imp-35675-finite-winding-mesh-cost-vs-delta.js (the baked measurement being cross-verified)
 * @see imp-35710-winding-mesh-cost-delta-ladder-viz-data.js (re-exports the baked anchors)
 * @see imp-35653-sbarrier-finite-check-porting-scope.js (Part C derives MESH_PER_UNIT ~ 12.84)
 * @see imp-35674-w3-tail-lemma-polymath15-scope.js (the NON-finite tail lemma B2 / W3, untouched here)
 */

import { IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA } from './imp-35675-finite-winding-mesh-cost-vs-delta.js';

const BAKED = IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA;

// -- Independent constants (re-declared, NOT imported from imp-35675) ----------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const TWO_PI = 2 * Math.PI;
const OVERSAMPLE = 3; // boundary samples per local zero spacing (no missed half-turn)
const H_BAND = 1; // fixed order-unity half-height of the transition band; Delta-independent
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this verification
const TOL = 1e-4; // storage-precision tolerance: baked anchors are stored via toFixed(4) (4 decimals)

// PART 1: density as a central finite difference of the RvM smooth counting function.
const N_SMOOTH = (t) => (t / TWO_PI) * Math.log(t / TWO_PI) - t / TWO_PI + 7 / 8;
const FD_STEP = 1e5; // << T_PT, >> rounding scale: clean central-difference window
const densityFiniteDiff = (N_SMOOTH(T_PT + FD_STEP) - N_SMOOTH(T_PT - FD_STEP)) / (2 * FD_STEP);
const densityClosedForm = Math.log(T_PT / TWO_PI) / TWO_PI; // independent closed-form check

// PART 2: meshPerUnit from oversample x density (using the finite-difference density).
const meshPerUnitDerived = OVERSAMPLE * densityFiniteDiff;

// PART 3: the per-enclosed-zero ratio and its large-Delta limit from geometry.
const totalEvals = (delta) => 2 * delta * meshPerUnitDerived + 4 * H_BAND * meshPerUnitDerived;
const enclosedZeros = (delta) => delta * densityFiniteDiff;
const perZeroRatio = (delta) => totalEvals(delta) / enclosedZeros(delta);
const perZeroAsymptoteAlgebraic = (2 * meshPerUnitDerived) / densityFiniteDiff; // = 2*OVERSAMPLE
const perZeroAsymptoteNumeric = perZeroRatio(1e12); // huge Delta: overhead fully amortized

export const IMP35729_MESH_COST_ANCHOR_CROSSVERIFY = {
  id: 'imp-35729',
  proofSection: 'S-frontier',
  question:
    'Independently cross-verify the imp-35710 / imp-35675 finite-winding mesh-cost anchors at ' +
    'T_PT = 3e12: recompute the local zero density (~4.28 zeros/unit) from the Riemann-von Mangoldt ' +
    'derivative, the meshPerUnit (~12.84) from oversample x density, and confirm the ' +
    'boundaryEvalsPerZero -> 6 asymptote from boundary-segment geometry, flagging any drift beyond ' +
    'storage-precision tolerance. Verification only; changes no bound; NO QED.',
  anchors: {
    tPT: T_PT,
    // Independently derived values (this module):
    densityFiniteDiff: +densityFiniteDiff.toFixed(6),
    densityClosedForm: +densityClosedForm.toFixed(6),
    meshPerUnitDerived: +meshPerUnitDerived.toFixed(6),
    perZeroAsymptote: +perZeroAsymptoteAlgebraic.toFixed(6),
    // Baked values (imp-35675) being cross-checked:
    bakedDensity: BAKED.anchors.localDensityAtTPT,
    bakedMeshPerUnit: BAKED.anchors.meshPerUnit,
    bakedPerZeroAsymptote: BAKED.horizontalEvalsPerEnclosedZero,
  },
  drift: {
    density: +Math.abs(densityFiniteDiff - BAKED.anchors.localDensityAtTPT).toExponential(3),
    meshPerUnit: +Math.abs(meshPerUnitDerived - BAKED.anchors.meshPerUnit).toExponential(3),
    perZero: +Math.abs(perZeroAsymptoteAlgebraic - BAKED.horizontalEvalsPerEnclosedZero).toExponential(3),
    tolerance: TOL,
  },
  method:
    'PART 1: density = central finite difference of the RvM smooth counting function ' +
    'N(T) = (T/2 pi) log(T/2 pi) - T/2 pi + 7/8 at T_PT, cross-checked against the closed form ' +
    '(1/2 pi) log(T_PT/2 pi). PART 2: meshPerUnit = OVERSAMPLE (=3) x that density. PART 3: ' +
    'M(Delta)/Z(Delta) = 2*meshPerUnit/density + 4*h*meshPerUnit/(Delta*density) -> 2*OVERSAMPLE = 6 ' +
    'as Delta -> infinity, confirmed both algebraically and as a large-Delta numerical limit.',
  isRigorous: false,
  verdict:
    'CROSS-VERIFICATION (frontier-direction, NOT rigorous). The three imp-35710 / imp-35675 mesh-cost ' +
    'anchors at T_PT = 3e12 are CONFIRMED by an independent derivation: the local zero density ' +
    'recovered as a finite difference of the Riemann-von Mangoldt smooth counting function agrees with ' +
    'the baked ~4.2799 to within storage-precision tolerance, meshPerUnit = 3 x density reproduces the ' +
    'baked ~12.8399, and the boundaryEvalsPerZero -> 6 asymptote follows exactly (= 2*OVERSAMPLE) from ' +
    'boundary-segment geometry, matched by the large-Delta numerical limit. No anchor drifts beyond ' +
    'tolerance. Verification only; touches nothing in the NON-finite tail lemma B2 / W3 (imp-35674); ' +
    'ports nothing; discharges nothing; changes no bound; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35675 (the baked mesh-cost measurement); imp-35710 (re-exports the anchors); imp-35653 ' +
    '(Part C derives MESH_PER_UNIT ~ 12.84); imp-35674 (the non-finite tail lemma B2 / W3); ' +
    'Riemann-von Mangoldt counting function; Platt-Trudgian 2021 (T_PT = 3e12).',
};

export const IMP35729_MESH_COST_ANCHOR_CROSSVERIFY_ASSERTIONS = [
  {
    // PART 1: finite-difference density reproduces the closed form AND the baked anchor.
    id: 'imp35729-density-crossverify',
    description: 'RvM finite-difference density matches closed form and baked ~4.2799 within tolerance',
    // fd-vs-closed-form limited to ~1e-8 by catastrophic cancellation (N ~ 3e12-magnitude subtraction);
    // 1e-6 still confirms the derivative identity dN/dT = (1/2 pi) log(T/2 pi).
    holds: () =>
      Math.abs(densityFiniteDiff - densityClosedForm) < 1e-6 &&
      Math.abs(densityFiniteDiff - BAKED.anchors.localDensityAtTPT) < TOL &&
      densityFiniteDiff > 4.27 && densityFiniteDiff < 4.29,
  },
  {
    // PART 2: oversample x (derived density) reproduces the baked meshPerUnit.
    id: 'imp35729-meshperunit-crossverify',
    description: 'meshPerUnit = 3 x derived density matches baked ~12.8399 within tolerance',
    holds: () =>
      Math.abs(meshPerUnitDerived - BAKED.anchors.meshPerUnit) < TOL &&
      meshPerUnitDerived > 12.83 && meshPerUnitDerived < 12.85,
  },
  {
    // PART 3: the per-enclosed-zero asymptote equals 2*OVERSAMPLE = 6, algebraically and numerically.
    id: 'imp35729-six-asymptote-crossverify',
    description: 'boundaryEvalsPerZero -> 2*OVERSAMPLE = 6 exactly (algebraic) and as large-Delta limit',
    holds: () =>
      Math.abs(perZeroAsymptoteAlgebraic - 6) < 1e-12 &&
      Math.abs(perZeroAsymptoteAlgebraic - BAKED.horizontalEvalsPerEnclosedZero) < 1e-12 &&
      Math.abs(perZeroAsymptoteNumeric - 6) < 1e-6 &&
      perZeroAsymptoteNumeric > 6, // approaches 6 from above (fixed overhead still positive)
  },
  {
    // Honesty gate: verification only; no bound change; B2/W3 untouched; no QED; no refereed bound is changed.
    id: 'imp35729-honesty-gate-verification-only',
    description: 'Verification only; changes no bound; B2/W3 untouched; no QED; no refereed bound is changed',
    holds: () =>
      IMP35729_MESH_COST_ANCHOR_CROSSVERIFY.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      BAKED.isRigorous === false &&
      /NO QED/.test(IMP35729_MESH_COST_ANCHOR_CROSSVERIFY.verdict) &&
      /refereed bound is changed/i.test(IMP35729_MESH_COST_ANCHOR_CROSSVERIFY.verdict),
  },
];

for (const a of IMP35729_MESH_COST_ANCHOR_CROSSVERIFY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35729-mesh-cost-anchor-crossverify assertion failed: ${a.id}`);
  }
}

export default IMP35729_MESH_COST_ANCHOR_CROSSVERIFY;
