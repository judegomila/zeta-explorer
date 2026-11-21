/**
 * @module imp-36158-joint-recovery-peak-location-drift
 *
 * imp-36158 (numerical, S-frontier): MEASURE whether the imp-36096 JOINT (alpha, beta)
 * recovery-basin OUTWARD peak SHIFTS in LOCATION between the two first-crossing contours,
 * quantifying the peak-position drift imp-36096 reported only qualitatively as "near
 * v ~ 0.375". imp-36096 baked the peak MAGNITUDE (max interior u+v ~ 2.48 at the 10%
 * target, ~2.52 at the 1% target) and named the location loosely; it never pinned the
 * normalized coordinate (u, v) of the peak on each contour, so whether the outward bulge
 * MIGRATES as the recovery threshold tightens from 10% to 1% was left open. This module
 * reads the two baked normalized contours straight from imp-36096, locates the interior
 * point of maximum u+v on each, and reports the location drift in the normalized (u, v)
 * frame and in the raw (beta, delta) frame.
 *
 * NO NEW COMPUTE. The imp-36096 contours are already baked as normalized {u, v, sum}
 * literals; this module consumes them and does arithmetic on the peak index only
 * (import-light, no full-N ratioAt re-run at load). The offline first-crossing trace
 * that produced the contours lives in imp-36096 / the imp-36133 offline script.
 *
 * MEASUREMENT ONLY. Instantiates no directed-rounding interval; evaluates no true H_0;
 * verifies no inequality; changes no bound; establishes no positivity; the certified
 * length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A);
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * FINDING -- the OUTWARD peak does NOT drift in LOCATION between the two contours; only
 * its HEIGHT rises
 * -----------------------------------------------------------------------------
 * On BOTH the 10% and the 1% normalized contours the outward-bulge peak lands on the
 * SAME beta anchor, normalized v = 0.375 (the 3rd of the 8 equal beta steps):
 *   - 10% target: peak at (u, v) = (2.10498, 0.37500), u+v = 2.47998;
 *   - 1%  target: peak at (u, v) = (2.14885, 0.37500), u+v = 2.52385.
 * The peak-position drift in the normalized beta coordinate is |dv| ~ 7.5e-8 -- i.e. ZERO
 * to floating-point residue (the residue is the beta/betaEdge division rounding, not a
 * real migration). The peak HEIGHT rises by +0.04388 in u+v (+1.77%), and that entire
 * rise is carried by the ALPHA-detuning coordinate u (du = +0.04388, dv ~ 0): tightening
 * the recovery target from 10% to 1% pushes the outward bulge UP (more alpha detuning
 * needed) but does NOT move it SIDEWAYS along beta.
 * In the RAW frame the peak beta shifts +0.05041 (1.19480 -> 1.24521) and delta shifts
 * +0.13410 (1.17885 -> 1.31295). But the raw-beta shift is ENTIRELY explained by the
 * betaEdge growing x1.04219 between the two contours (1.19480 x 1.04219 = 1.24521): it is
 * the SAME normalized anchor rescaled by a larger edge, NOT a location drift. So the raw
 * beta shift is an edge-normalization artifact; the intrinsic peak location is invariant.
 * CAVEAT (honest resolution limit): v is quantized to the 8-anchor beta grid (step
 * dv = 0.125), so "no drift" means no drift RESOLVABLE at anchor resolution; a sub-anchor
 * lateral migration smaller than one beta step could be masked by the coarse grid. The
 * measured |dv| ~ 7.5e-8 confirms only that both peaks pick the identical anchor.
 * CONSEQUENCE for a run-time monitor: the imp-36096 outward-bulge lobe is anchored at a
 * FIXED beta fraction (v ~ 0.375) across recovery thresholds; a monitor that sizes its
 * window on the worst-case (peak) detuning can key the peak's beta location once and only
 * scale the alpha reach with the target, rather than re-locating the bulge per threshold.
 * Precision stays NON-binding everywhere (imp-36096: even r = 1 leaves gamma_{N-1} ~
 * 5.4e-11 orders under the imp-35760 barrier margin); the obstruction stays the
 * ENGINEERING of the certified length-N sum (MECHANICAL, imp-35725).
 *
 * @see imp-36096-w1-accumulator-joint-recovery-contour (the joint contour whose peak this locates)
 * @see imp-36133-w1-joint-recovery-contour-nstability (N-stability of the same lobed contour)
 * @see imp-36061-w1-accumulator-recovery-detuning-width (the single-axis edges normalizing the contour)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1) accumulator + run-max bound)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 */

import { IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR } from './imp-36096-w1-accumulator-joint-recovery-contour.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement

// -- Locate the interior peak (max u+v) of a baked normalized contour ---------------------------
// Interior drops the two axis endpoints (fixed at u+v = 1 by construction, as in imp-36096).
function locatePeak(normalized) {
  const interior = normalized.slice(1, normalized.length - 1);
  let best = interior[0];
  for (const p of interior) {
    if (p.sum > best.sum) best = p;
  }
  return best;
}

const C10 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour10;
const C1 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.jointContour1;

const PEAK_10 = locatePeak(C10.normalized); // { u, v, sum, l2 }
const PEAK_1 = locatePeak(C1.normalized);

// Recover the raw (beta, delta) of each peak from the baked betaDeltaPairs by matching the
// normalized v back to its anchor index (v_i = i/8 for the eight equal beta steps).
function rawPeakFrom(contour, normalizedPeak) {
  let bestIdx = 0;
  let bestErr = Infinity;
  contour.normalized.forEach((p, i) => {
    const err = Math.abs(p.v - normalizedPeak.v) + Math.abs(p.u - normalizedPeak.u);
    if (err < bestErr) {
      bestErr = err;
      bestIdx = i;
    }
  });
  const [beta, delta] = contour.betaDeltaPairs[bestIdx];
  return { beta, delta, anchorIndex: bestIdx };
}

const RAW_10 = rawPeakFrom(C10, PEAK_10);
const RAW_1 = rawPeakFrom(C1, PEAK_1);

// -- Location drift (normalized frame) and height rise ------------------------------------------
const V_DRIFT = PEAK_1.v - PEAK_10.v; // ~ -7.5e-8: zero to float residue (grid-locked at v = 0.375)
const U_DRIFT = PEAK_1.u - PEAK_10.u; // +0.04388: the entire height rise is carried by alpha
const SUM_DRIFT = PEAK_1.sum - PEAK_10.sum; // +0.04388: peak HEIGHT rise (+1.77%)
const SUM_DRIFT_PCT = SUM_DRIFT / PEAK_10.sum; // ~0.0177

// -- Raw-frame drift and the betaEdge-growth decomposition --------------------------------------
const RAW_BETA_DRIFT = RAW_1.beta - RAW_10.beta; // +0.05041 in raw beta
const RAW_DELTA_DRIFT = RAW_1.delta - RAW_10.delta; // +0.13410 in raw delta
const BETA_EDGE_10 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.singleAxisEdges.betaEdge10;
const BETA_EDGE_1 = IMP36096_W1_ACCUMULATOR_JOINT_RECOVERY_CONTOUR.singleAxisEdges.betaEdge1;
const BETA_EDGE_GROWTH = BETA_EDGE_1 / BETA_EDGE_10; // x1.04219
// If the raw beta shift is purely edge rescaling of a fixed anchor, then
// beta_10 * (betaEdge_1 / betaEdge_10) should reproduce beta_1 to float precision.
const RAW_BETA_FROM_EDGE_RESCALE = RAW_10.beta * BETA_EDGE_GROWTH;
const EDGE_RESCALE_RESIDUAL = Math.abs(RAW_BETA_FROM_EDGE_RESCALE - RAW_1.beta);

export const IMP36158_JOINT_RECOVERY_PEAK_LOCATION_DRIFT = {
  id: 'imp-36158',
  proofSection: 'S-frontier',
  question:
    'MEASURE whether the imp-36096 JOINT (alpha, beta) recovery-basin OUTWARD peak (u+v ~ 2.48 at ' +
    'the 10% target, ~2.52 at 1%, reported only as "near v ~ 0.375") SHIFTS in LOCATION between the ' +
    'two first-crossing contours. Locate the interior max-(u+v) point on each baked normalized ' +
    'contour and quantify the peak-position drift in the normalized (u, v) and raw (beta, delta) ' +
    'frames. Measurement only; changes no bound; NO QED.',
  peak10: {
    u: PEAK_10.u,
    v: PEAK_10.v,
    sum: PEAK_10.sum,
    rawBeta: RAW_10.beta,
    rawDelta: RAW_10.delta,
    anchorIndex: RAW_10.anchorIndex,
    note: 'outward bulge of the 10% (r <= 1.10 r_base) contour: (u, v) ~ (2.10498, 0.37500), u+v ~ 2.47998',
  },
  peak1: {
    u: PEAK_1.u,
    v: PEAK_1.v,
    sum: PEAK_1.sum,
    rawBeta: RAW_1.beta,
    rawDelta: RAW_1.delta,
    anchorIndex: RAW_1.anchorIndex,
    note: 'outward bulge of the 1% (r <= 1.01 r_base) contour: (u, v) ~ (2.14885, 0.37500), u+v ~ 2.52385',
  },
  locationDrift: {
    vDrift: V_DRIFT,
    uDrift: U_DRIFT,
    sumDrift: SUM_DRIFT,
    sumDriftPct: SUM_DRIFT_PCT,
    gridStepV: 0.125,
    note:
      'peak location does NOT drift in normalized v: |dv| ~ 7.5e-8 (float residue), grid-locked at ' +
      'v = 0.375 (the 3rd of 8 beta anchors) on BOTH contours; the +0.04388 (+1.77%) height rise in u+v ' +
      'is carried ENTIRELY by the alpha coordinate u (du = +0.04388, dv ~ 0)',
  },
  rawFrameDrift: {
    betaDrift: RAW_BETA_DRIFT,
    deltaDrift: RAW_DELTA_DRIFT,
    betaEdgeGrowth: BETA_EDGE_GROWTH,
    betaFromEdgeRescale: RAW_BETA_FROM_EDGE_RESCALE,
    edgeRescaleResidual: EDGE_RESCALE_RESIDUAL,
    note:
      'raw peak beta shifts +0.05041 (1.19480 -> 1.24521) and delta +0.13410, but the raw-beta shift is ' +
      'ENTIRELY the betaEdge growing x1.04219: beta_10 x growth reproduces beta_1 to ~1e-6, so it is the ' +
      'SAME normalized anchor rescaled by a larger edge, NOT a location drift',
  },
  caveat:
    'v is quantized to the 8-anchor beta grid (step dv = 0.125), so "no drift" means no drift RESOLVABLE ' +
    'at anchor resolution; a sub-anchor lateral migration smaller than one beta step could be masked. The ' +
    'measured |dv| ~ 7.5e-8 confirms only that both peaks pick the identical anchor (index 3, v = 0.375).',
  conclusion: {
    locationInvariant:
      'the imp-36096 outward-bulge peak is location-INVARIANT in the normalized frame across the two ' +
      'recovery thresholds: it stays grid-locked at v = 0.375 (|dv| ~ 7.5e-8), so the bulge does not ' +
      'migrate sideways along beta as the target tightens from 10% to 1%',
    heightOnly:
      'the only change is the peak HEIGHT: u+v rises +0.04388 (+1.77%), carried entirely by the alpha ' +
      'detuning u; tightening the target pushes the bulge UP, not SIDEWAYS',
    rawShiftIsEdgeArtifact:
      'the raw-frame beta shift (+0.05041) is an edge-normalization artifact (betaEdge x1.04219), not an ' +
      'intrinsic location drift; the residual of the edge-rescale decomposition is ~1e-6',
    monitorConsequence:
      'a run-time monitor can pin the outward-bulge beta location once (v ~ 0.375) and only scale the ' +
      'alpha reach with the recovery target, rather than re-locating the bulge per threshold',
    precisionNotBinding:
      'precision is NOT binding anywhere (imp-36096: even the r = 1 corner leaves gamma_{N-1} ~ 5.4e-11 ' +
      'orders under the imp-35760 barrier margin); the obstruction stays the ENGINEERING of the certified ' +
      'length-N interval sum (MECHANICAL, imp-35725)',
    staysGreenfield:
      'this module locates a baked contour peak only; it instantiates no directed-rounding interval and ' +
      'verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Locating the imp-36096 JOINT ' +
    '(alpha, beta) recovery-basin OUTWARD peak on both the 10% (r <= 1.10 r_base) and 1% (r <= 1.01 ' +
    'r_base) normalized first-crossing contours shows the peak does NOT drift in LOCATION: it is ' +
    'grid-locked at normalized v = 0.375 (the 3rd of 8 beta anchors) on BOTH contours, with a ' +
    'peak-position drift |dv| ~ 7.5e-8 (floating-point residue only). The peak HEIGHT rises +0.04388 ' +
    'in u+v (+1.77%), and that rise is carried ENTIRELY by the alpha-detuning coordinate u (du = ' +
    '+0.04388, dv ~ 0): tightening the recovery target from 10% to 1% pushes the outward bulge UP, not ' +
    'SIDEWAYS along beta. In the raw frame the peak beta shifts +0.05041 and delta +0.13410, but the ' +
    'raw-beta shift is ENTIRELY the betaEdge growing x1.04219 (beta_10 x growth reproduces beta_1 to ' +
    '~1e-6), so it is the SAME normalized anchor rescaled, not a location drift. CAVEAT: v is quantized ' +
    'to the 8-anchor beta grid (step 0.125), so "no drift" means no drift resolvable at anchor ' +
    'resolution; a sub-anchor migration could be masked. Precision is NOT binding anywhere (even r = 1 ' +
    'leaves gamma_{N-1} ~ 5.4e-11 orders under the imp-35760 barrier margin); the obstruction stays the ' +
    'ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). Instantiates no ' +
    'directed-rounding interval; evaluates no true H_0; verifies no inequality; changes no bound; ' +
    'establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36096 (the joint recovery contour whose peak this locates); imp-36133 (N-stability of the same ' +
    'lobed contour); imp-36061 (the single-axis edges normalizing the contour); imp-35890 (O(1) ' +
    'running-accumulator a-priori bound); imp-35812 (baseline (alpha,beta) term family); imp-35760 ' +
    '(barrier-margin allocation); imp-35725 (mechanical N-term certified cost); imp-35681 Part A (A+B-C ' +
    'interval bound greenfield); Platt-Trudgian 2021 (barrier base).',
};

export const IMP36158_JOINT_RECOVERY_PEAK_LOCATION_DRIFT_ASSERTIONS = [
  {
    // Both peaks land on the SAME beta anchor (v = 0.375, index 3): no location drift.
    id: 'imp36158-peaks-share-v-anchor',
    description: 'Both contour peaks sit at normalized v = 0.375 (the 3rd of 8 beta anchors)',
    holds: () =>
      Math.abs(PEAK_10.v - 0.375) < 1e-6 &&
      Math.abs(PEAK_1.v - 0.375) < 1e-6 &&
      RAW_10.anchorIndex === 3 &&
      RAW_1.anchorIndex === 3,
  },
  {
    // The normalized peak-LOCATION drift in v is zero to float residue.
    id: 'imp36158-v-drift-zero',
    description: 'Peak-location drift in normalized v is ~0 (|dv| < 1e-6, grid-locked)',
    holds: () => Math.abs(V_DRIFT) < 1e-6,
  },
  {
    // The peak HEIGHT rises (+~1.77% in u+v) and the rise is carried entirely by u.
    id: 'imp36158-height-rise-carried-by-u',
    description: 'Peak height rises ~+1.77% in u+v, carried entirely by the alpha coordinate u',
    holds: () =>
      SUM_DRIFT > 0.03 &&
      SUM_DRIFT < 0.06 &&
      Math.abs(U_DRIFT - SUM_DRIFT) < 1e-6 && // dv ~ 0 => du = d(u+v)
      SUM_DRIFT_PCT > 0.01 &&
      SUM_DRIFT_PCT < 0.03,
  },
  {
    // Peak magnitudes reproduce the imp-36096 headline maxInteriorUplusV values.
    id: 'imp36158-peak-heights-match-imp36096',
    description: 'Located peak u+v reproduces the imp-36096 maxInteriorUplusV headline (~2.48 / ~2.52)',
    holds: () =>
      Math.abs(PEAK_10.sum - C10.maxInteriorUplusV) < 1e-9 &&
      Math.abs(PEAK_1.sum - C1.maxInteriorUplusV) < 1e-9 &&
      PEAK_10.sum > 2.47 &&
      PEAK_10.sum < 2.49 &&
      PEAK_1.sum > 2.51 &&
      PEAK_1.sum < 2.53,
  },
  {
    // The raw-beta shift is an edge-rescale artifact: beta_10 x growth reproduces beta_1.
    id: 'imp36158-raw-beta-shift-is-edge-artifact',
    description: 'Raw peak-beta shift is the betaEdge growth x1.042 rescaling the same anchor (residual < 1e-5)',
    holds: () =>
      BETA_EDGE_GROWTH > 1.04 &&
      BETA_EDGE_GROWTH < 1.045 &&
      RAW_BETA_DRIFT > 0.04 &&
      RAW_BETA_DRIFT < 0.06 &&
      EDGE_RESCALE_RESIDUAL < 1e-5,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36158-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36158_JOINT_RECOVERY_PEAK_LOCATION_DRIFT.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36158_JOINT_RECOVERY_PEAK_LOCATION_DRIFT.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36158_JOINT_RECOVERY_PEAK_LOCATION_DRIFT.verdict) &&
      /refereed bound is changed/i.test(IMP36158_JOINT_RECOVERY_PEAK_LOCATION_DRIFT.verdict),
  },
];

for (const a of IMP36158_JOINT_RECOVERY_PEAK_LOCATION_DRIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36158-joint-recovery-peak-location-drift assertion failed: ${a.id}`);
  }
}
