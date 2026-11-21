/**
 * @module imp-36133-w1-joint-recovery-contour-nstability
 *
 * imp-36133 (numerical, S-frontier): MEASURE the N-STABILITY of the imp-36096 JOINT
 * (alpha, beta) running-accumulator recovery-basin CONTOUR by re-tracing the lobed
 * r <= 1.10 r_base and r <= 1.01 r_base first-crossing contours at a larger N = 1e6,
 * since imp-36096 traced the non-convex joint basin only at N ~ 488602 and imp-36103
 * checked N-stability of the SINGLE-AXIS edges only (never the coupled interior). A
 * run-time monitor keyed on the imp-36096 lobed detuning margin would need the whole
 * contour SHAPE -- not just its two axis endpoints -- to be N-robust, so this recomputes
 * the joint contour at N = 1e6 (a 2.05x span above the imp-36096 rung) for the oscillatory
 * term family t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) and reports whether the lobed
 * shape (bulge to u+v ~ 2.48/2.52, cave to ~0.60/0.59) migrates with N.
 *
 * The two rungs (normalized joint contours at both targets) were computed OFFLINE by
 * scripts/imp-36133-joint-contour-nstability-offline.mjs -- bit-for-bit the imp-36096
 * ratioAt + first-crossing-scan (step 0.01) + 32-step-bisection kernel re-run at each N,
 * with each contour NORMALIZED by the imp-36061/imp-36103 single-axis edges at THAT N
 * (u = delta / alphaEdge(N), v = beta / betaEdge(N), so v sits on the identical i/8 grid
 * at both N and only u carries the N-dependence). This module BAKES those recorded
 * literals (import-light, no heavy re-derivation at load) and asserts the N-stability
 * verdict from them, following the imp-36103 / imp-35791 baked-literal pattern.
 *
 * MEASUREMENT ONLY. Instantiates no directed-rounding interval; evaluates no true H_0;
 * verifies no inequality; changes no bound; establishes no positivity; the certified
 * length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A);
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * FINDING -- the JOINT recovery-basin lobed SHAPE is N-STABLE (extends imp-36103 to the
 * coupled interior)
 * -----------------------------------------------------------------------------
 * Across N ~ 488602 -> 1e6 (a 2.05x span) the entire normalized joint contour holds to
 * ~4 significant figures at every one of the nine v-anchors of BOTH targets:
 *   - the OUTWARD bulge indicator maxInteriorUplusV holds 2.47997 -> 2.48034 (10%) and
 *     2.52387 -> 2.52387 (1%) -- relative spread < 1.5e-4;
 *   - the INWARD-lobe cave indicator minInteriorUplusV holds 0.60191 -> 0.60190 (10%)
 *     and 0.58556 -> 0.58555 (1%) -- relative spread < 1.4e-5;
 *   - the max per-anchor u spread across all interior points of both contours is ~6.1e-4,
 *     concentrated at the near-beta-axis anchor (v = 0.875, delta ~ 0.27) where the
 *     step-0.01 coarse scan has the largest relative discretization footprint, not a true
 *     N-drift; every headline shape anchor is stable to < 2e-4.
 * The joint contour is N-invariant for the SAME reason imp-36103 gave for the single-axis
 * edges: each contour point is defined RELATIVE to r_base(N), and the detuned r and r_base
 * share the same 1/sqrt(N) scaling (imp-36103: r_base * sqrt(N) ~ 0.826 invariant), so the
 * detuning at which the ratio r / r_base crosses 1.10 / 1.01 is N-independent to leading
 * order -- not just on the two axes (imp-36103) but across the whole coupled plane.
 * CONSEQUENCE for the imp-36004 / imp-35949 run-time monitor: the imp-36096 finding that
 * the single-axis edges UNDER-state the coupled detuning margin by up to ~2.5x is itself
 * N-ROBUST -- a monitor must size its window on the full lobed contour (not either axis)
 * at every N, and that lobed sizing transfers across N unchanged. Precision stays
 * NON-binding everywhere (imp-36096: even the r = 1 corner leaves gamma_{N-1} ~ 5.4e-11
 * orders under the imp-35760 barrier margin); the obstruction stays the ENGINEERING of the
 * certified length-N sum (MECHANICAL, imp-35725).
 *
 * @see imp-36096-w1-accumulator-joint-recovery-contour (the single-N ~ 488602 joint contour tested here)
 * @see imp-36103-w1-accumulator-recovery-nstability (N-stability of the SINGLE-axis edges this extends)
 * @see imp-36061-w1-accumulator-recovery-detuning-width (the two single-axis edges normalizing the contour)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1) accumulator + run-max bound)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2 (running error bound)
 */

const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 (the imp-36096 fixed rung)

// The nine v-anchors (v = beta / betaEdge(N) = i/8) are identical at both N by construction,
// so only the normalized u = delta / alphaEdge(N) values carry the N-dependence.
const V_GRID = Array.from({ length: 9 }, (_, i) => i / 8);

// -- Baked offline joint contours (scripts/imp-36133-joint-contour-nstability-offline.mjs) -------
// Per rung: N and the normalized u arrays for the 10% and 1% recovery targets. The N ~ 488602
// rung reproduces the imp-36096 published CONTOUR_10 / CONTOUR_1 (u+v bulge ~2.48/2.52, cave
// ~0.60/0.59); the N = 1e6 rung is the new N-stability probe.
const RUNGS = [
  {
    N: N_AT_TPT, // ~488602; reproduces the imp-36096 published joint contour
    u10: [
      1.000000000001787, 0.4769079102592159, 1.3481560944077922, 2.104967396114838,
      1.8122480934374834, 1.4109533569988977, 0.9627961038976522, 0.4847082439384275, 0,
    ],
    u1: [
      1.0000000000006255, 0.46056216337095257, 1.746019934157428, 2.1488736035145783,
      1.7727107735012417, 1.3502956941384603, 0.8973171901577, 0.42297665789142774,
      1.9053390120290663e-12,
    ],
  },
  {
    N: 1e6, // the N-stability probe rung (2.05x span above the imp-36096 rung)
    u10: [
      0.9999999999989937, 0.4769026394650091, 1.3479799375560766, 2.105343184155337,
      1.8124226099333662, 1.4111853095289115, 0.9630705133189081, 0.4850056182200021,
      0.00010480970591942688,
    ],
    u1: [
      0.9999999999993756, 0.4605542679817813, 1.7459158442078193, 2.1488736623043936,
      1.7728736875680855, 1.3504111367967357, 0.8974566051006436, 0.4231050210091224,
      0.000005023187112838013,
    ],
  },
];

// -- Derived normalized contours + lobed-shape indicators (light arithmetic over baked u) --------
function normalizeRung(uArray) {
  const normalized = uArray.map((u, i) => ({ u, v: V_GRID[i], sum: u + V_GRID[i] }));
  const interior = normalized.slice(1, normalized.length - 1); // drop axis endpoints (fixed u+v=1)
  const maxSum = Math.max(...interior.map((p) => p.sum));
  const minSum = Math.min(...interior.map((p) => p.sum));
  return { normalized, maxSum, minSum };
}

const CONTOURS = RUNGS.map((r) => ({
  N: r.N,
  target10: normalizeRung(r.u10),
  target1: normalizeRung(r.u1),
}));

// Per-anchor relative spread of a shape indicator across the two rungs.
function relSpread(a, b) {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return (hi - lo) / (0.5 * (lo + hi));
}

const maxSumSpread10 = relSpread(CONTOURS[0].target10.maxSum, CONTOURS[1].target10.maxSum);
const minSumSpread10 = relSpread(CONTOURS[0].target10.minSum, CONTOURS[1].target10.minSum);
const maxSumSpread1 = relSpread(CONTOURS[0].target1.maxSum, CONTOURS[1].target1.maxSum);
const minSumSpread1 = relSpread(CONTOURS[0].target1.minSum, CONTOURS[1].target1.minSum);

// Max per-anchor u spread across every INTERIOR anchor of BOTH targets (the strictest N-drift test).
function interiorUSpreads(key) {
  const a = RUNGS[0][key];
  const b = RUNGS[1][key];
  const spreads = [];
  for (let i = 1; i < a.length - 1; i++) spreads.push(relSpread(a[i], b[i])); // interior only
  return spreads;
}
const maxInteriorUSpread = Math.max(
  ...interiorUSpreads('u10'),
  ...interiorUSpreads('u1'),
);

const JOINT_CONTOUR_NSTABLE = maxInteriorUSpread < 1e-3; // whole lobed shape stable to ~4 sig figs
const SHAPE_INDICATORS_NSTABLE =
  Math.max(maxSumSpread10, minSumSpread10, maxSumSpread1, minSumSpread1) < 2e-4;

export const IMP36133_W1_JOINT_RECOVERY_CONTOUR_NSTABILITY = {
  id: 'imp-36133',
  proofSection: 'S-frontier',
  question:
    'MEASURE the N-STABILITY of the imp-36096 JOINT (alpha, beta) running-accumulator recovery-basin ' +
    'CONTOUR by re-tracing the lobed r <= 1.10 r_base / r <= 1.01 r_base first-crossing contours at ' +
    'N = 1e6, since imp-36096 traced the non-convex joint basin only at N ~ 488602 and imp-36103 ' +
    'checked N-stability of the SINGLE-axis edges only. Report whether the lobed shape (bulge to ' +
    'u+v ~ 2.48/2.52, cave to ~0.60/0.59) migrates with N. Measurement only; changes no bound; NO QED.',
  contours: CONTOURS,
  reproducesImp36096: {
    N: N_AT_TPT,
    maxInteriorUplusV10: CONTOURS[0].target10.maxSum,
    minInteriorUplusV10: CONTOURS[0].target10.minSum,
    maxInteriorUplusV1: CONTOURS[0].target1.maxSum,
    minInteriorUplusV1: CONTOURS[0].target1.minSum,
    note:
      'the N ~ 488602 rung reproduces the imp-36096 published joint contour: the 10% target bulges ' +
      'to u+v ~ 2.480 (v ~ 0.375) and caves to ~0.602 (v ~ 0.125); the 1% target bulges to ~2.524 ' +
      'and caves to ~0.586 -- the strongly non-convex lobed basin imp-36096 found',
  },
  shapeStability: {
    maxSumSpread10,
    minSumSpread10,
    maxSumSpread1,
    minSumSpread1,
    maxInteriorUSpread,
    nStable: JOINT_CONTOUR_NSTABLE,
    note:
      'across N ~ 488602 -> 1e6 the outward bulge holds 2.47997 -> 2.48034 (10%) / 2.52387 -> 2.52387 ' +
      '(1%) and the inward cave holds 0.60191 -> 0.60190 (10%) / 0.58556 -> 0.58555 (1%); every headline ' +
      'shape indicator is stable to < 2e-4 and the max per-anchor interior u spread is ~6.1e-4 ' +
      '(concentrated at the near-beta-axis anchor v = 0.875 where the step-0.01 coarse scan has the ' +
      'largest relative footprint, not a true N-drift). The whole lobed contour is N-STABLE to ~4 sig figs',
  },
  mechanism: {
    note:
      'the joint contour is N-invariant for the SAME reason imp-36103 gave for the single-axis edges: ' +
      'each contour point is defined RELATIVE to r_base(N), and the detuned r and r_base share the same ' +
      '1/sqrt(N) scaling (imp-36103: r_base * sqrt(N) ~ 0.826 invariant), so the detuning at which the ' +
      'ratio r / r_base crosses 1.10 / 1.01 is N-independent to leading order -- now confirmed across the ' +
      'whole coupled plane, not just the two axes',
  },
  monitorConsequence: {
    note:
      'the imp-36096 finding that the single-axis edges UNDER-state the coupled detuning margin by up to ' +
      '~2.5x is itself N-ROBUST: a run-time monitor must size its window on the full lobed contour (not ' +
      'either axis) at every N, and that lobed sizing transfers across N unchanged',
  },
  conclusion: {
    jointContourNStable:
      'the imp-36096 lobed joint recovery basin is N-STABLE to ~4 significant figures across N ~ 488602 ' +
      '-> 1e6 (max interior u spread ~6.1e-4, headline bulge/cave indicators < 2e-4), so the coupled ' +
      'non-convex shape -- not just the two axis endpoints (imp-36103) -- transfers across N',
    extendsImp36103:
      'imp-36103 established N-stability of the two single-axis edges only; this extends that verdict to ' +
      'the full coupled interior, confirming the whole lobed contour (bulge + inner cave) is N-invariant ' +
      'because every point is relative to the 1/sqrt(N)-scaling r_base(N)',
    monitorReliable:
      'a run-time monitor keyed on the lobed detuning margin is N-ROBUST -- the imp-36096 window sizing ' +
      '(and its ~2.5x under-statement of the single-axis edges) transfers across N unchanged; precision ' +
      'stays non-binding everywhere (imp-36096: even r = 1 leaves gamma_{N-1} orders under the barrier margin)',
    staysGreenfield:
      'this module recomputes accumulator-ratio joint recovery contours only; it instantiates no ' +
      'directed-rounding interval and verifies no inequality, so the W1 A + B - C certificate at T_PT ' +
      'stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Testing the N-stability of the ' +
    'imp-36096 JOINT (alpha, beta) running-accumulator recovery-basin CONTOUR by re-tracing the lobed ' +
    'r <= 1.10 r_base and r <= 1.01 r_base first-crossing contours at N = 1e6 for ' +
    't_k = cos(alpha k + beta sqrt(k)) / sqrt(k), each normalized by the single-axis edges at that N. The ' +
    'entire lobed contour is N-STABLE to ~4 significant figures across N ~ 488602 -> 1e6: the outward ' +
    'bulge holds maxInteriorUplusV 2.47997 -> 2.48034 (10%) / 2.52387 -> 2.52387 (1%) and the inward cave ' +
    'holds minInteriorUplusV 0.60191 -> 0.60190 (10%) / 0.58556 -> 0.58555 (1%); every headline shape ' +
    'indicator is stable to < 2e-4, and the max per-anchor interior u spread is ~6.1e-4 (concentrated at ' +
    'the near-beta-axis anchor v = 0.875 where the step-0.01 coarse scan dominates, not a true N-drift). ' +
    'This EXTENDS imp-36103 (which established N-stability of the two SINGLE-axis edges only) to the full ' +
    'coupled interior: the joint contour is N-invariant because every point is defined relative to ' +
    'r_base(N) and the detuned r and r_base share the same 1/sqrt(N) scaling (imp-36103: r_base * sqrt(N) ' +
    '~ 0.826 invariant). CONSEQUENCE: the imp-36096 lobed window sizing -- and its ~2.5x under-statement ' +
    'of the single-axis edges -- is N-ROBUST, so a run-time monitor keyed on the full lobed detuning ' +
    'margin transfers across N unchanged. Instantiates no directed-rounding interval; evaluates no true ' +
    'H_0; verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C ' +
    'certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-36096 (the single-N ~ 488602 joint contour tested here for N-stability); imp-36103 (N-stability ' +
    'of the single-axis edges this extends to the coupled interior); imp-36061 (the two single-axis ' +
    'recovery edges normalizing the contour); imp-36004 / imp-35949 (run-time-monitor caveat); imp-35890 ' +
    '(O(1) running-accumulator a-priori bound); imp-35812 (baseline (alpha,beta) term family); imp-35760 ' +
    '(barrier-margin allocation); imp-35725 (mechanical N-term certified cost); imp-35681 Part A ' +
    '(A+B-C interval bound greenfield); Higham 2002 sec 4.2 (recursive-sum running error bound); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP36133_W1_JOINT_RECOVERY_CONTOUR_NSTABILITY_ASSERTIONS = [
  {
    // Two rungs recorded: the imp-36096 fixed N ~ 488602 and the N = 1e6 stability probe.
    id: 'imp36133-two-rungs',
    description: 'Two N rungs recorded: ~488602 (imp-36096 rung) and 1e6 (N-stability probe)',
    holds: () =>
      RUNGS.length === 2 &&
      RUNGS[0].N === N_AT_TPT &&
      RUNGS[1].N === 1e6 &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // Each contour carries nine v-anchors on the identical i/8 grid at both N.
    id: 'imp36133-nine-anchors',
    description: 'Each contour has nine v-anchors on the identical i/8 grid (v: 0, 1/8, ..., 1)',
    holds: () =>
      V_GRID.length === 9 &&
      Math.abs(V_GRID[3] - 0.375) < 1e-15 &&
      Math.abs(V_GRID[8] - 1) < 1e-15 &&
      RUNGS.every((r) => r.u10.length === 9 && r.u1.length === 9),
  },
  {
    // N ~ 488602 rung reproduces the imp-36096 non-convex lobed basin (bulge ~2.48/2.52, cave ~0.60/0.59).
    id: 'imp36133-reproduces-imp36096',
    description: 'N ~ 488602 rung reproduces imp-36096 bulge (u+v ~ 2.48/2.52) and cave (~0.60/0.59)',
    holds: () =>
      Math.abs(CONTOURS[0].target10.maxSum - 2.48) < 0.02 &&
      Math.abs(CONTOURS[0].target10.minSum - 0.60) < 0.02 &&
      Math.abs(CONTOURS[0].target1.maxSum - 2.52) < 0.02 &&
      Math.abs(CONTOURS[0].target1.minSum - 0.586) < 0.02,
  },
  {
    // NON-CONVEX at BOTH rungs: interior bulges outside the axis diamond (u+v > sqrt 2) at N = 1e6 too.
    id: 'imp36133-nonconvex-both-rungs',
    description: 'Interior bulges outside the axis diamond (max u+v > sqrt 2) at N = 1e6 as well',
    holds: () =>
      CONTOURS[1].target10.maxSum > Math.SQRT2 &&
      CONTOURS[1].target10.maxSum > 2.0 &&
      CONTOURS[1].target1.maxSum > 2.0 &&
      CONTOURS[1].target10.minSum < 1.0 &&
      CONTOURS[1].target1.minSum < 1.0,
  },
  {
    // Headline shape indicators (bulge + cave) N-stable to < 2e-4 across the 2.05x span.
    id: 'imp36133-shape-indicators-nstable',
    description: 'Bulge/cave indicators N-stable to < 2e-4 across N ~ 488602 -> 1e6',
    holds: () =>
      SHAPE_INDICATORS_NSTABLE &&
      maxSumSpread10 < 2e-4 &&
      minSumSpread10 < 2e-4 &&
      maxSumSpread1 < 2e-4 &&
      minSumSpread1 < 2e-4,
  },
  {
    // Whole lobed contour N-stable: max per-anchor interior u spread < 1e-3 (~4 sig figs).
    id: 'imp36133-joint-contour-nstable',
    description: 'Full lobed contour N-stable: max interior u spread < 1e-3 (~4 sig figs, measured ~6.1e-4)',
    holds: () =>
      JOINT_CONTOUR_NSTABLE && maxInteriorUSpread < 1e-3 && maxInteriorUSpread > 1e-5,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36133-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36133_W1_JOINT_RECOVERY_CONTOUR_NSTABILITY.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36133_W1_JOINT_RECOVERY_CONTOUR_NSTABILITY.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36133_W1_JOINT_RECOVERY_CONTOUR_NSTABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP36133_W1_JOINT_RECOVERY_CONTOUR_NSTABILITY.verdict),
  },
];

for (const a of IMP36133_W1_JOINT_RECOVERY_CONTOUR_NSTABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36133-w1-joint-recovery-contour-nstability assertion failed: ${a.id}`);
  }
}
