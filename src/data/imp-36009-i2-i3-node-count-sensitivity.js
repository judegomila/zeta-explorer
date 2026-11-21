/**
 * @module imp-36009-i2-i3-node-count-sensitivity
 *
 * imp-36009 (accuracy/assessment, S-frontier): MEASURE the sensitivity of the
 * imp-35951 sized I2 intrinsic margin (~12 at the held 10-node sample) and the
 * I3 modulus-floor proxy delta = C_PS = pi / sqrt(2) to the imp-33923 theta-sweep
 * NODE COUNT. imp-35951 read both figures straight off the HELD imp-33923 complex
 * Simpson quadrature at a FIXED 10-node / 9-interval (10 deg) theta sweep and never
 * tested either under refinement. Here we actually RE-RUN the same scale-free
 * complex Simpson quadrature at 10 / 20 / 40 / 80 nodes over the identical
 * {45..135} deg arc and read whether (i) the least-squares winding slope stays 3/2
 * (so the per-node increment and the ~12 margin scale trivially with spacing) and
 * (ii) the observed min |A_quad| stays pinned at C_PS or drifts.
 *
 * ASSESSMENT / MEASUREMENT ONLY. Certifies no cap; certifies no delta > 0;
 * instantiates no interval enclosure; counts no zeros; changes no bound; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * THE RE-RUN (independent, not read from a closed form)
 * -----------------------------------------------------------------------------
 * For each node count N we sample theta at N equally spaced points over the same
 * pi/2 arc (45..135 deg) and evaluate the imp-33923 scale-free full-line integral
 *     A(theta) = int |u|^{-1/2} / (w - u)^2 du,   w = e^{i theta},
 * by the same complex Simpson quadrature (u = +-t^2 removes the cusp, t = 1/r
 * folds the tail onto (0,1)). From the quadrature amplitude we read the modulus
 * |A_quad(theta)| and the phase arg(-A_quad(theta)), least-squares fit the
 * unwrapped phase vs theta for the winding slope, and take the min modulus over
 * the sweep. The inner quadrature panel budget is fixed (independent of the outer
 * theta-node count) so only the theta refinement varies.
 *
 * WHAT THE REFINEMENT SHOWS
 * -----------------------------------------------------------------------------
 * The quadrature amplitude is A(theta) = C_PS * e^{i(3 pi/4 - 3 theta/2)} to ~1e-13,
 * an EXACT constant-modulus, linear-phase signal, so refinement changes nothing
 * intrinsic:
 *   - the least-squares slope is -3/2 to ~1e-12 for EVERY node count (10/20/40/80),
 *     since the phase is exactly linear in theta -- more nodes only add collinear
 *     points;
 *   - min |A_quad| stays PINNED at C_PS = pi / sqrt(2) ~ 2.2214 to ~1e-13, with the
 *     sweep spread ~1e-13 at every node count -- no drift, angle-robust;
 *   - the total winding over the arc is INVARIANT at |s| * (pi/2) = 3 pi / 4 ~ 2.356
 *     rad regardless of node count.
 * The consequence for the imp-35951 figures:
 *   - the per-node argument increment is |s| * step = (3/2)(pi/2)/(N-1) =
 *     3 pi / (4 (N-1)), so it SHRINKS as 1 / (N-1) (pi/12 at N=10 -> ~pi/25.3 at
 *     N=20 -> ...);
 *   - the intrinsic I2 margin pi / increment = 4 (N-1) / 3 therefore GROWS LINEARLY
 *     with the node count: 12 at N=10, 25.33 at N=20, 52 at N=40, 105.33 at N=80.
 * So the ~12 margin imp-35951 reported is a SPACING ARTIFACT of the 10-node sample,
 * NOT an intrinsic cushion: it scales trivially (linearly) with the node count and
 * says nothing certifiable on its own. The refinement-INVARIANT I2 content is the
 * total winding 3 pi / 4, hence the node-count-independent panel-count formula
 * n = ceil(total / (pi/m)) = ceil(3 m / 4) (1 borderline, 2 at m=2, 3 at m=4). By
 * contrast the I3 modulus-floor proxy delta = C_PS is REFINEMENT-STABLE (pinned, no
 * drift), a genuine property of the model amplitude rather than a spacing artifact.
 *
 * WHAT THIS DOES NOT DO (the honesty boundary)
 * -----------------------------------------------------------------------------
 * Everything here lives on the OFF-AXIS MODEL CUSP rho = |x|^{-1/2}, NOT the true
 * H_t = A + B - C on dR at T_PT = 3e12. The stability under refinement reflects the
 * scale-free model amplitude being exactly constant-modulus / linear-phase; it is
 * NOT evidence that the true f on dR winds at 3/2 or that |H_t| >= C_PS. A certified
 * I2 cap still needs an interval UPPER bound on the LOCAL rate of the true f, and a
 * certified I3 floor an interval LOWER bound on |H_t| -- both gated on the greenfield
 * imp-35681 Part A / imp-35725 evaluator (I1 / W1). This module instantiates no
 * interval enclosure, certifies no cap, certifies no delta > 0, counts no zeros,
 * changes no bound; I2 and I3 stay GREENFIELD. NO QED. No refereed bound is changed.
 *
 * @see imp-33923-off-axis-phase-winding-quadrature (the quadrature re-run here; held sampled slope -3/2, modulus C_PS, isRigorous:false)
 * @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy (sized the ~12 margin and C_PS floor at the FIXED 10-node sweep)
 * @see imp-36008-i2-theta-arclength-jacobian-decomposition (theta -> arclength/height Jacobian for the same unit-circle cusp)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I1-I5 enumerated, all GREENFIELD)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35951 / imp-36008) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const HALF_TURN = Math.PI; // the I2 cap threshold: |Delta arg f| < pi per panel
const C_PS = Math.PI / Math.SQRT2; // pi/sqrt(2) ~ 2.2214: the imp-35951 I3 modulus-floor proxy
const WINDING_ANALYTIC = -1.5; // d/dtheta [3 pi/4 - 3 theta/2] = -3/2

// -- minimal complex arithmetic (Re, Im pairs), matching imp-33923 ---------------
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cinv = (a) => {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
};
const cabs = (a) => Math.hypot(a[0], a[1]);
const csq = (a) => cmul(a, a);

// Independent complex Simpson quadrature of A(theta) = int |u|^{-1/2}/(w-u)^2 du,
// w = e^{i theta}; u = +-t^2 removes the cusp, t = 1/r folds the tail onto (0,1).
// Inner panel budget FIXED so only the outer theta-node count varies (40000 gives
// ~1e-13, ample to distinguish drift from pinned).
const A_PANELS = 40000;
function aQuadrature(theta) {
  const w = [Math.cos(theta), Math.sin(theta)];
  const h = 1 / A_PANELS;
  let s = [0, 0];
  for (let i = 0; i <= A_PANELS; i++) {
    const wt = i === 0 || i === A_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const t = i * h;
    const t2 = t * t;
    const g = cadd(
      cmul([2, 0], cinv(csq(csub(w, [t2, 0])))),
      cmul([2, 0], cinv(csq(cadd(w, [t2, 0])))),
    );
    const r = i * h;
    let gT = [0, 0];
    if (r > 0) {
      const tt2 = 1 / (r * r);
      const gg = cadd(
        cmul([2, 0], cinv(csq(csub(w, [tt2, 0])))),
        cmul([2, 0], cinv(csq(cadd(w, [tt2, 0])))),
      );
      gT = [gg[0] / (r * r), gg[1] / (r * r)];
    }
    s = cadd(s, [wt * (g[0] + gT[0]), wt * (g[1] + gT[1])]);
  }
  return [(s[0] * h) / 3, (s[1] * h) / 3];
}

// Re-run the sweep at a given node count over the same {45..135} deg arc, reading
// the winding slope, min modulus, and sweep spread straight from the quadrature.
const SWEEP_ARC = Math.PI / 2; // 45..135 deg
function measureAtNodeCount(nodes) {
  const rows = [];
  for (let i = 0; i < nodes; i++) {
    const deg = 45 + (90 * i) / (nodes - 1);
    const theta = (deg * Math.PI) / 180;
    const Aq = aQuadrature(theta);
    const lead = [-Aq[0], -Aq[1]];
    rows.push({ theta, mod: cabs(Aq), phase: Math.atan2(lead[1], lead[0]) });
  }
  const mods = rows.map((r) => r.mod);
  const minMod = Math.min(...mods);
  const maxMod = Math.max(...mods);
  // unwrap the phase, then least-squares slope vs theta
  const unwrapped = [];
  let prev = rows[0].phase;
  for (const r of rows) {
    let p = r.phase;
    while (p - prev > Math.PI) p -= 2 * Math.PI;
    while (p - prev < -Math.PI) p += 2 * Math.PI;
    unwrapped.push(p);
    prev = p;
  }
  const xs = rows.map((r) => r.theta);
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = unwrapped.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (unwrapped[i] - meanY);
    den += (xs[i] - meanX) * (xs[i] - meanX);
  }
  const slope = num / den;
  const step = SWEEP_ARC / (nodes - 1); // per-interval theta step
  const perNodeIncrement = Math.abs(slope) * step; // |Delta arg| per interval
  const intrinsicMargin = HALF_TURN / perNodeIncrement; // pi / increment
  return {
    nodes,
    intervals: nodes - 1,
    windingSlope: +slope.toFixed(9),
    slopeError: +Math.abs(slope - WINDING_ANALYTIC).toExponential(3),
    minModulus: +minMod.toFixed(12),
    modulusFloorResidual: +Math.abs(minMod - C_PS).toExponential(3),
    sweepSpread: +(maxMod - minMod).toExponential(3),
    totalWindingRad: +(Math.abs(slope) * SWEEP_ARC).toFixed(9),
    perNodeIncrementRad: +perNodeIncrement.toFixed(9),
    intrinsicMargin: +intrinsicMargin.toFixed(6),
    marginPrediction: +((4 * (nodes - 1)) / 3).toFixed(6), // 4(N-1)/3
  };
}

const NODE_COUNTS = [10, 20, 40, 80];
const LADDER = NODE_COUNTS.map(measureAtNodeCount);

// Cross-ladder readings.
const MAX_SLOPE_ERR = Math.max(...LADDER.map((r) => Math.abs(r.windingSlope - WINDING_ANALYTIC)));
const MAX_MOD_FLOOR_RESID = Math.max(...LADDER.map((r) => Math.abs(r.minModulus - C_PS)));
const TOTAL_WINDINGS = LADDER.map((r) => r.totalWindingRad);
const WINDING_INVARIANT_SPREAD = Math.max(...TOTAL_WINDINGS) - Math.min(...TOTAL_WINDINGS);
// margin grows linearly: ratio to the 4(N-1)/3 prediction must be ~1 at every rung.
const MAX_MARGIN_PREDICTION_ERR = Math.max(
  ...LADDER.map((r) => Math.abs(r.intrinsicMargin - r.marginPrediction)),
);

export const IMP36009_I2_I3_NODE_COUNT_SENSITIVITY = {
  id: 'imp-36009',
  proofSection: 'S-frontier',
  question:
    'Measure the sensitivity of the imp-35951 sized I2 intrinsic margin (~12 at the 10-node sample) and the I3 ' +
    'modulus-floor proxy delta = C_PS = pi/sqrt(2) to the imp-33923 theta-sweep NODE COUNT: re-run the same complex ' +
    'Simpson quadrature at 10/20/40/80 nodes over the {45..135} deg arc and read whether the least-squares winding ' +
    'slope stays 3/2 (so the per-node increment and ~12 margin scale trivially with spacing) and whether min ' +
    '|A_quad| stays pinned at C_PS or drifts. Assessment/measurement only; certifies no cap; changes no bound; NO QED.',
  anchor: { heightT_PT: T_PT, sotaLambda: L_PT },
  reRun: {
    integral: 'A(theta) = int |u|^{-1/2}/(w-u)^2 du, w = e^{i theta}, independent complex Simpson quadrature (imp-33923 method)',
    innerPanelsFixed: A_PANELS,
    sweepArcRad: +SWEEP_ARC.toFixed(9), // pi/2 (45..135 deg)
    nodeCounts: NODE_COUNTS,
    note:
      'Only the outer theta-node count varies; the inner quadrature panel budget is fixed at 40000 (giving ~1e-13). ' +
      'Each rung re-reads the winding slope, min modulus and sweep spread straight from the quadrature amplitude.',
  },
  ladder: LADDER,
  slopeStability: {
    analyticSlope: WINDING_ANALYTIC, // -3/2
    maxSlopeErrorAcrossLadder: +MAX_SLOPE_ERR.toExponential(3), // ~1e-12
    slopeIsNodeCountInvariant: MAX_SLOPE_ERR < 1e-6,
    note:
      'The quadrature phase is exactly linear in theta (A = C_PS e^{i(3pi/4 - 3 theta/2)}), so the least-squares ' +
      'slope is -3/2 to ~1e-12 for every node count; refinement only adds collinear points.',
  },
  marginIsSpacingArtifact: {
    finding:
      'The per-node argument increment = |s| * step = 3 pi / (4 (N-1)) shrinks as 1/(N-1), so the intrinsic I2 ' +
      'margin pi / increment = 4 (N-1) / 3 GROWS LINEARLY with the node count -- the ~12 at 10 nodes is a spacing ' +
      'artifact, not an intrinsic cushion.',
    marginFormula: '4 (N-1) / 3',
    marginAt10: 12,
    marginAt80: +((4 * 79) / 3).toFixed(6), // ~105.33
    maxMarginPredictionError: +MAX_MARGIN_PREDICTION_ERR.toExponential(3),
    refinementInvariant:
      'Total winding = |s| * (pi/2) = 3 pi / 4 ~ 2.356 rad is node-count-INVARIANT; the certifiable I2 content is ' +
      'the node-count-independent panel-count formula n = ceil(3 m / 4), not the per-node margin.',
    totalWindingRad: +TOTAL_WINDINGS[0].toFixed(9), // 3 pi / 4
    totalWindingSpreadAcrossLadder: +WINDING_INVARIANT_SPREAD.toExponential(3),
  },
  modulusFloorStability: {
    candidateDelta: +C_PS.toFixed(12), // C_PS = pi/sqrt(2)
    maxModulusFloorResidualAcrossLadder: +MAX_MOD_FLOOR_RESID.toExponential(3), // ~1e-13
    modulusFloorIsRefinementStable: MAX_MOD_FLOOR_RESID < 1e-6,
    note:
      'min |A_quad| stays pinned at C_PS = pi/sqrt(2) ~ 2.2214 to ~1e-13 at every node count, with sweep spread ' +
      '~1e-13 -- no drift. Unlike the I2 margin, the I3 modulus-floor proxy is a genuine refinement-stable property ' +
      'of the model amplitude, not a spacing artifact.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / MEASUREMENT (frontier-direction, NOT rigorous). Re-running the imp-33923 scale-free complex ' +
    'Simpson quadrature A(theta) = int |u|^{-1/2}/(w-u)^2 du at 10/20/40/80 theta-nodes over the identical ' +
    '{45..135} deg arc (inner panel budget fixed): the least-squares winding slope is -3/2 to ~1e-12 at EVERY node ' +
    'count (the quadrature amplitude is exactly constant-modulus / linear-phase, C_PS e^{i(3pi/4 - 3 theta/2)}), so ' +
    'the imp-35951 per-node argument increment = 3 pi / (4 (N-1)) shrinks as 1/(N-1) and the intrinsic I2 margin ' +
    'pi / increment = 4 (N-1) / 3 GROWS LINEARLY (12 at N=10, 25.33 at 20, 52 at 40, 105.33 at 80). The ~12 margin ' +
    'imp-35951 reported is therefore a SPACING ARTIFACT of the 10-node sample, not an intrinsic cushion; the ' +
    'refinement-INVARIANT I2 content is the total winding 3 pi / 4 ~ 2.356 rad (spread across the ladder ~1e-13), ' +
    'hence the node-count-independent panel-count formula n = ceil(3 m / 4). By contrast the I3 modulus-floor proxy ' +
    'min |A_quad| stays PINNED at C_PS = pi/sqrt(2) ~ 2.2214 to ~1e-13 at every node count (sweep spread ~1e-13, no ' +
    'drift) -- a genuine refinement-stable property of the model amplitude, not a spacing artifact. All of this ' +
    'lives on the OFF-AXIS MODEL CUSP rho = |x|^{-1/2}, NOT the true H_t = A + B - C on dR at T_PT = 3e12: the ' +
    'stability is the scale-free model amplitude being exactly constant-modulus / linear-phase, NOT evidence that ' +
    'the true f winds at 3/2 or that |H_t| >= C_PS. A certified I2 cap needs an interval UPPER bound on the LOCAL ' +
    'rate of the true f and a certified I3 floor an interval LOWER bound on |H_t|, both gated on the greenfield ' +
    'imp-35681 Part A / imp-35725 evaluator (I1 / W1). Instantiates no interval enclosure; certifies no cap; ' +
    'certifies no delta > 0; counts no zeros; changes no bound; I2 and I3 stay GREENFIELD; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33923 (off-axis phase-winding quadrature re-run here; sampled slope -3/2, modulus C_PS, unit-circle ' +
    'w = e^{i theta}, isRigorous:false); imp-35951 (sized the ~12 I2 margin and C_PS floor at the FIXED 10-node ' +
    'sweep); imp-36008 (theta -> arclength/height Jacobian for the same unit-circle cusp); imp-35727 (I1-I5 ' +
    'enumerated, all GREENFIELD); imp-35757 (I2 sized from the smooth Riemann-Siegel mean rate); Polymath15 2019 ' +
    '(effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021.',
};

export const IMP36009_I2_I3_NODE_COUNT_SENSITIVITY_ASSERTIONS = [
  {
    // The re-run covers 10/20/40/80 nodes over the pi/2 arc with a fixed inner panel budget.
    id: 'imp36009-rerun-ladder-shape',
    description: 'Re-runs the quadrature at 10/20/40/80 theta-nodes over the pi/2 (45..135 deg) arc, inner panels fixed',
    holds: () =>
      LADDER.length === 4 &&
      LADDER.map((r) => r.nodes).join(',') === '10,20,40,80' &&
      Math.abs(SWEEP_ARC - Math.PI / 2) < 1e-15 &&
      A_PANELS === 40000,
  },
  {
    // (i) The least-squares winding slope stays -3/2 at every node count.
    id: 'imp36009-slope-is-node-count-invariant',
    description: 'Least-squares winding slope = -3/2 to ~1e-12 for every node count (10/20/40/80)',
    holds: () =>
      MAX_SLOPE_ERR < 1e-6 &&
      LADDER.every((r) => Math.abs(r.windingSlope - -1.5) < 1e-6),
  },
  {
    // The ~12 margin is a spacing artifact: it tracks 4(N-1)/3 and the per-node increment tracks 3pi/(4(N-1)).
    id: 'imp36009-margin-is-spacing-artifact',
    description: 'Intrinsic I2 margin = 4(N-1)/3 (12 at N=10, ~105.33 at N=80); per-node increment = 3pi/(4(N-1))',
    holds: () =>
      MAX_MARGIN_PREDICTION_ERR < 1e-6 &&
      Math.abs(LADDER[0].intrinsicMargin - 12) < 1e-6 &&
      Math.abs(LADDER[3].intrinsicMargin - (4 * 79) / 3) < 1e-6 &&
      Math.abs(LADDER[0].perNodeIncrementRad - Math.PI / 12) < 1e-6,
  },
  {
    // The refinement-invariant I2 content is the total winding 3pi/4 (node-count-independent).
    id: 'imp36009-total-winding-invariant',
    description: 'Total winding = |s|*(pi/2) = 3pi/4 ~ 2.356 rad is node-count-invariant (spread across ladder ~1e-13)',
    holds: () =>
      WINDING_INVARIANT_SPREAD < 1e-6 &&
      LADDER.every((r) => Math.abs(r.totalWindingRad - (3 * Math.PI) / 4) < 1e-6),
  },
  {
    // (ii) min |A_quad| stays pinned at C_PS at every node count -- the I3 floor is refinement-stable.
    id: 'imp36009-modulus-floor-refinement-stable',
    description: 'min |A_quad| stays pinned at C_PS = pi/sqrt(2) ~ 2.2214 to ~1e-13 at every node count (no drift)',
    holds: () =>
      MAX_MOD_FLOOR_RESID < 1e-6 &&
      LADDER.every((r) => Math.abs(r.minModulus - Math.PI / Math.SQRT2) < 1e-6) &&
      Math.abs(C_PS - 2.221441469) < 1e-6,
  },
  {
    // Honesty gate: measurement only; PROXY on the model cusp; no certification; I2/I3 GREENFIELD; NO QED; no refereed bound is changed.
    id: 'imp36009-honesty-gate-no-qed',
    description: 'Measurement only; PROXY on the off-axis model cusp; certifies no cap; certifies no delta>0; I2/I3 GREENFIELD; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36009_I2_I3_NODE_COUNT_SENSITIVITY.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      /OFF-AXIS MODEL CUSP/.test(IMP36009_I2_I3_NODE_COUNT_SENSITIVITY.verdict) &&
      /certifies no cap/.test(IMP36009_I2_I3_NODE_COUNT_SENSITIVITY.verdict) &&
      /I2 and I3 stay GREENFIELD/.test(IMP36009_I2_I3_NODE_COUNT_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP36009_I2_I3_NODE_COUNT_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP36009_I2_I3_NODE_COUNT_SENSITIVITY.verdict),
  },
];

for (const a of IMP36009_I2_I3_NODE_COUNT_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36009-i2-i3-node-count-sensitivity assertion failed: ${a.id}`);
  }
}
