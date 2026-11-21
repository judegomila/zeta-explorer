/**
 * @module imp-3915-g6a-p1-resolvent-identity-ystar-conditioning-sweep
 *
 * imp-3915 (numerical, frontier-direction): imp-3899 stress-tested the exact finite-N resolvent-flux
 * identity m_s = 2 m m_z + m_zz to b = 0.99 of the pre-collision shock budget across M in {161, 241, 321},
 * but held the mesoscopic strip height FIXED at y_star = 4 d, where the resolvent stays well-conditioned
 * (y_star > 0 keeps every 1 / (z - x_k) bounded). This module lowers y_star TOWARD THE REAL AXIS at that
 * same near-caustic slice (b = 0.99) and measures where -- if anywhere -- the double-precision conditioning
 * of m / m_z / m_zz on the strip finally inflates the max relative residual above 1e-12, SIZING the
 * conditioning margin between the mesoscopic strip and the microscopic axis.
 *
 * WHAT IS SWEPT
 * ------------
 * Reusing the imp-3899 / imp-3642 seed, attractive-CM RK4 integrator and anchor height (log gamma = 9.1981,
 * spacing d = 2 pi / log(gamma / 2 pi), 13-point x-grid on [-3 d, 3 d] at step d / 2), one flow per block
 * size is pushed to b = 0.99 of the full pre-collision budget 1 / (2 V0). At that fixed near-caustic
 * configuration the P1 identity m_s = 2 m m_z + m_zz (m_s from the ACTUAL RK4 velocities, m / m_z / m_zz
 * analytic) is evaluated on z = x + i y_star as y_star is lowered across:
 *   - the ticket's mesoscopic sweep  y_star / d in {4, 2, 1, 0.5, 0.25}, and
 *   - a deep-axis extension          y_star / d in {0.1, 0.01, 1e-3, 1e-4}
 * recording, at each y_star, the max relative residual over the x-grid and the max |m| (a conditioning proxy).
 *
 * WHAT IS FOUND (and why it is honest)
 * ------------------------------------
 * The identity is a PURE ALGEBRAIC identity in the particle configuration, so lowering y_star cannot break
 * it analytically -- only the floating-point conditioning of the sum m = sum 1 / (z - x_k) can degrade as z
 * approaches a pole. MEASUREMENT: across ALL block sizes and ALL swept heights down to y_star = 1e-4 d
 * (four orders of magnitude below the mesoscopic 4 d strip, essentially on the axis) the max relative
 * residual never crosses 1e-12 -- it stays at machine-epsilon level. The reason is grid geometry: on the
 * FIXED x-grid (step d / 2) the HORIZONTAL offset from each grid point x to the nearest particle x_k floors
 * |z - x_k| >~ that offset, independent of y_star, so shrinking y_star cannot drive |z - x_k| -> 0. The
 * conditioning proxy max |m| SATURATES (it does not diverge) as y_star -> 0, and the relative residual --
 * normalised by |m_s| -- stays at eps. So on this fixed evaluation grid the mesoscopic-to-axis conditioning
 * margin is grid-offset-limited, not strip-height-limited: the imp-3899 "well-conditioned only because
 * y_star = 4 d" statement is CONSERVATIVE; the exactness persists all the way to the axis on this grid.
 *
 * All numeric fields are computed at import; the self-executing assertions at the bottom throw if the
 * conditioning ever inflates the residual above 1e-12 on the swept grid. Measurement / scoping only; no
 * positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 * positivity UNTOUCHED. No refereed bound is changed. H2 stays UNWRITTEN as a
 * certificate, the K4 route stays WHOLLY NEW and G6a_shock_lipschitz stays OPEN.
 *
 * @see imp-3899-g6a-p1-resolvent-identity-caustic-stress (the b = 0.99 caustic stress this extends toward the axis)
 * @see imp-3872-g6a-h2-discrete-flux-convexity-probe (the P1 identity verification)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (the attractive-CM RK4 flow, seed and integrator reused)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

const TWO_PI = 2 * Math.PI;
const LOG_ANCHOR = 9.1981; // imp-3642 anchor log gamma_{N*}

// minimal complex arithmetic (two-element [re, im] tuples), imp-3899 convention
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cinv = (a) => {
  const dd = a[0] * a[0] + a[1] * a[1];
  return [a[0] / dd, -a[1] / dd];
};
const cabs = (a) => Math.hypot(a[0], a[1]);

// locally-uniform mesoscopic seed (imp-3642 / imp-3899: spacing d, small deterministic jitter)
function seedBlock(d, M) {
  const xs = new Array(M);
  for (let k = 0; k < M; k++) {
    const base = (k - (M - 1) / 2) * d;
    const jitter = 0.15 * d * Math.sin(2.4 * k) + 0.07 * d * Math.cos(5.1 * k);
    xs[k] = base + jitter;
  }
  return xs;
}

// attractive Calogero-Moser velocities dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) (imp-3642)
function attractiveVelocities(xs) {
  const n = xs.length;
  const v = new Array(n).fill(0);
  for (let k = 0; k < n; k++) {
    let s = 0;
    for (let j = 0; j < n; j++) if (j !== k) s -= 2 / (xs[k] - xs[j]);
    v[k] = s;
  }
  return v;
}

// grid-sup of Im m over the mesoscopic strip (imp-3642 quantity, sizes the pre-collision horizon)
function gridSupImM(xs, y, d) {
  let best = 0;
  for (let x = -6 * d; x <= 6 * d; x += d / 8) {
    let s = 0;
    for (let k = 0; k < xs.length; k++) {
      const a = xs[k] - x;
      s += y / (a * a + y * y);
    }
    if (s > best) best = s;
  }
  return best;
}

// resolvent field m and analytic z-derivatives at complex z, plus m_s from the ACTUAL RK4 velocities.
function fieldAt(xs, vel, z) {
  let m = [0, 0], mz = [0, 0], mzz = [0, 0], ms = [0, 0];
  for (let k = 0; k < xs.length; k++) {
    const f = cinv(csub(z, [xs[k], 0])); // 1/(z - x_k)
    const f2 = cmul(f, f);
    const f3 = cmul(f2, f);
    m = cadd(m, f);
    mz = csub(mz, f2); // m_z = -sum f^2
    mzz = cadd(mzz, cmul([2, 0], f3)); // m_zz = 2 sum f^3
    ms = cadd(ms, cmul([vel[k], 0], f2)); // m_s = sum xdot_k f^2
  }
  return { m, mz, mzz, ms };
}

// minimum inter-particle gap of a configuration
function minGap(xs) {
  const s = xs.slice().sort((a, b) => a - b);
  let g = Infinity;
  for (let k = 1; k < s.length; k++) {
    const dgap = s[k] - s[k - 1];
    if (dgap < g) g = dgap;
  }
  return g;
}

const STEPS = 400; // imp-3899 convention
const BUDGET_TOP = 0.99; // the imp-3899 near-caustic slice this sweep probes
const BLOCK_SIZES = [161, 241, 321]; // imp-3899 blocks
// ticket's mesoscopic sweep, plus a deep-axis extension probing four orders of magnitude below 4 d
const YSTAR_FRACS_LISTED = [4, 2, 1, 0.5, 0.25]; // y_star / d, the ticket's listed heights
const YSTAR_FRACS_DEEP = [0.1, 0.01, 1e-3, 1e-4]; // extension toward the real axis
const YSTAR_FRACS = [...YSTAR_FRACS_LISTED, ...YSTAR_FRACS_DEEP];

// Push the imp-3899 RK4 attractive-CM flow to b = 0.99 of the full pre-collision budget, then at that fixed
// near-caustic configuration sweep the strip height y_star toward the axis and measure the P1 residual.
function sweepYStar(logGamma, M) {
  const gamma = Math.exp(logGamma);
  const rho = Math.log(gamma / TWO_PI) / TWO_PI;
  const d = 1 / rho;
  const yStarSeed = 4 * d;
  let xs = seedBlock(d, M);
  const V0 = gridSupImM(xs, yStarSeed, d);
  const fullBudget = 1 / (2 * V0);
  const sMax = BUDGET_TOP * fullBudget;
  const dt = sMax / STEPS;

  for (let step = 0; step < STEPS; step++) {
    const k1 = attractiveVelocities(xs);
    const x2 = xs.map((x, i) => x + 0.5 * dt * k1[i]);
    const k2 = attractiveVelocities(x2);
    const x3 = xs.map((x, i) => x + 0.5 * dt * k2[i]);
    const k3 = attractiveVelocities(x3);
    const x4 = xs.map((x, i) => x + dt * k3[i]);
    const k4 = attractiveVelocities(x4);
    xs = xs.map((x, i) => x + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }

  const vel = attractiveVelocities(xs);
  const gMinOverD = minGap(xs) / d;

  const xGrid = [];
  for (let x = -3 * d; x <= 3 * d + 1e-12; x += d / 2) xGrid.push(x);

  const heights = YSTAR_FRACS.map((fr) => {
    const y = fr * d;
    let maxResid = 0, maxAbsM = 0;
    for (const x of xGrid) {
      const z = [x, y];
      const { m, mz, mzz, ms } = fieldAt(xs, vel, z);
      const rhs = cadd(cmul([2, 0], cmul(m, mz)), mzz);
      const resid = cabs(csub(ms, rhs)) / (cabs(ms) + 1e-300);
      if (resid > maxResid) maxResid = resid;
      const absM = cabs(m);
      if (absM > maxAbsM) maxAbsM = absM;
    }
    return { yStarOverD: fr, maxResid, maxAbsM };
  });

  const maxAbsMAt4d = heights[0].maxAbsM; // y_star = 4 d entry
  const maxAbsMDeepest = heights[heights.length - 1].maxAbsM; // smallest y_star entry
  return {
    M,
    d: +d.toFixed(4),
    gMinOverD,
    heights,
    blockMaxResid: Math.max(...heights.map((h) => h.maxResid)),
    saturationRatio: maxAbsMDeepest / maxAbsMAt4d, // |m| growth from 4 d to the axis (bounded => saturation)
  };
}

const BLOCKS = BLOCK_SIZES.map((M) => sweepYStar(LOG_ANCHOR, M));

// max residual over the ticket's listed mesoscopic heights {4d..d/4} across all blocks
const LISTED_MAX_RESID = Math.max(
  ...BLOCKS.flatMap((b) => b.heights.filter((h) => YSTAR_FRACS_LISTED.includes(h.yStarOverD)).map((h) => h.maxResid))
);
// max residual over ALL swept heights (down to 1e-4 d, essentially the axis) across all blocks
const GLOBAL_MAX_RESID = Math.max(...BLOCKS.map((b) => b.blockMaxResid));
// residual right at the mesoscopic anchor y_star = 4 d (recovers the imp-3899 baseline)
const BASELINE_4D_MAX_RESID = Math.max(...BLOCKS.map((b) => b.heights[0].maxResid));
// largest |m| growth factor from the 4 d strip to the axis (bounded => conditioning saturates, does not diverge)
const MAX_SATURATION_RATIO = Math.max(...BLOCKS.map((b) => b.saturationRatio));
// deepest height probed (as a fraction of d): the reach of the conditioning margin below the 4 d strip
const DEEPEST_YSTAR_OVER_D = Math.min(...YSTAR_FRACS);
// how far below the mesoscopic 4 d strip the margin extends without inflating the residual
const CONDITIONING_MARGIN_DECADES = Math.log10(4 / DEEPEST_YSTAR_OVER_D);
const IDENTITY_SURVIVES_TO_AXIS = GLOBAL_MAX_RESID < 1e-12;

export const IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP = {
  id: 'imp-3915',
  proofSection: 'S-frontier',
  question:
    'imp-3899 stress-tested the exact finite-N resolvent-flux identity m_s = 2 m m_z + m_zz to b = 0.99 of ' +
    'the pre-collision budget across M in {161, 241, 321} but held the strip height FIXED at y_star = 4 d, ' +
    'where the resolvent stays well-conditioned. LOWER y_star toward the real axis at that same b = 0.99 ' +
    'slice and MEASURE where floating-point conditioning of m / m_z / m_zz finally inflates the residual ' +
    'above 1e-12, sizing the conditioning margin between the mesoscopic strip and the microscopic axis. ' +
    'Self-consistency / measurement only; no bridge closure; no QED.',
  candidate: 'K4',
  rootProbed: 'H2',
  extends: 'imp-3899 b = 0.99 caustic stress (fixed y_star = 4 d) toward the real axis',
  identity: 'm_s = 2 m m_z + m_zz  (EXACT, finite-N; m(z,s) = sum_k 1/(z - x_k(s)); m_s from ACTUAL RK4 velocities)',
  sweepSpec: {
    flow: 'dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) (imp-3642 attractive Calogero-Moser)',
    height: +LOG_ANCHOR.toFixed(4),
    budgetFrac: BUDGET_TOP, // the imp-3899 near-caustic slice at which y_star is swept
    strip: 'z = x + i y_star; y_star swept as a multiple of d = 2 pi / log(gamma / 2 pi); x-grid step d/2 on [-3 d, 3 d]',
    rk4Steps: STEPS,
    yStarFracsListed: YSTAR_FRACS_LISTED, // the ticket's mesoscopic sweep {4d..d/4}
    yStarFracsDeep: YSTAR_FRACS_DEEP, // deep-axis extension {0.1d..1e-4 d}
    blockSizes: BLOCK_SIZES,
  },
  blocks: BLOCKS.map((b) => ({
    M: b.M,
    d: b.d,
    gMinOverD: +b.gMinOverD.toExponential(3),
    blockMaxResid: +b.blockMaxResid.toExponential(2),
    saturationRatio: +b.saturationRatio.toFixed(2),
    heights: b.heights.map((h) => ({
      yStarOverD: h.yStarOverD,
      maxResid: +h.maxResid.toExponential(2),
      maxAbsM: +h.maxAbsM.toExponential(2),
    })),
  })),
  baseline4dMaxResid: +BASELINE_4D_MAX_RESID.toExponential(2), // recovers the imp-3899 y_star = 4 d value
  listedSweepMaxResid: +LISTED_MAX_RESID.toExponential(2), // over the ticket's {4d..d/4}
  globalMaxResid: +GLOBAL_MAX_RESID.toExponential(2), // over ALL heights down to 1e-4 d
  maxSaturationRatio: +MAX_SATURATION_RATIO.toFixed(2), // |m| growth 4d -> axis (bounded => saturation)
  deepestYStarOverD: DEEPEST_YSTAR_OVER_D,
  conditioningMarginDecades: +CONDITIONING_MARGIN_DECADES.toFixed(2),
  identitySurvivesToAxis: IDENTITY_SURVIVES_TO_AXIS,
  finding:
    'Y_STAR CONDITIONING SWEEP RESULT: lowering the strip height y_star from the mesoscopic 4 d anchor toward ' +
    'the real axis at the imp-3899 near-caustic slice (b = ' + BUDGET_TOP + ') does NOT inflate the exact ' +
    'finite-N resolvent-flux identity residual. Across M = ' + BLOCK_SIZES.join(', ') + ', the max relative ' +
    'residual of m_s = 2 m m_z + m_zz (m_s from the ACTUAL RK4 velocities, m / m_z / m_zz analytic) stays ' +
    LISTED_MAX_RESID.toExponential(1) + ' over the listed sweep y_star / d in {4, 2, 1, 0.5, 0.25} and ' +
    GLOBAL_MAX_RESID.toExponential(1) + ' even when the sweep is pushed a further ~' +
    CONDITIONING_MARGIN_DECADES.toFixed(1) + ' decades to y_star = ' + DEEPEST_YSTAR_OVER_D.toExponential(0) +
    ' d -- essentially the real axis, four orders of magnitude below the 4 d strip. The conditioning margin ' +
    'between the mesoscopic strip and the microscopic axis is therefore NOT y_star-limited on this evaluation ' +
    'grid: on the fixed x-grid (step d / 2) the HORIZONTAL offset from each grid point to the nearest particle ' +
    'x_k floors |z - x_k| independent of y_star, so shrinking y_star cannot drive z onto a pole. The ' +
    'conditioning proxy max |m| SATURATES rather than diverging (largest 4 d -> axis growth factor ' +
    MAX_SATURATION_RATIO.toFixed(1) + 'x, bounded), and the relative residual -- normalised by |m_s| -- holds ' +
    'at machine epsilon. So the imp-3899 "well-conditioned only because y_star = 4 d > 0" statement is ' +
    'CONSERVATIVE: on a fixed d/2 x-grid the P1 exactness persists all the way to the axis.',
  isRigorous: false,
  h2StillUnwritten: true,
  k4ConfirmedWhollyNew: true,
  g6aStillOpen: true,
  verdict:
    'MEASUREMENT / SCOPING (frontier-direction, NOT rigorous): extends the imp-3899 b = 0.99 caustic stress of ' +
    'the exact finite-N resolvent-flux identity m_s = 2 m m_z + m_zz from a FIXED mesoscopic strip y_star = 4 d ' +
    'to a sweep of y_star toward the real axis, at the imp-3642 anchor height log gamma = ' + LOG_ANCHOR.toFixed(4) +
    ' and block sizes M = ' + BLOCK_SIZES.join(', ') + '. Along the attractive Calogero-Moser RK4 flow pushed to ' +
    'b = ' + BUDGET_TOP + ' of the pre-collision budget, sampling m(z,s) = sum_k 1/(z - x_k) on z = x + i y_star ' +
    'with y_star / d swept over {4, 2, 1, 0.5, 0.25} (the listed heights) and a deep-axis extension to ' +
    DEEPEST_YSTAR_OVER_D.toExponential(0) + ' d, the max relative residual stays ' + GLOBAL_MAX_RESID.toExponential(1) +
    ' EVERYWHERE -- it never crosses 1e-12. This sizes the conditioning margin: it is grid-offset-limited, not ' +
    'strip-height-limited. On the fixed x-grid (step d / 2) the horizontal offset to the nearest particle floors ' +
    '|z - x_k|, so lowering y_star cannot drive the resolvent onto a pole; max |m| saturates (growth factor ' +
    MAX_SATURATION_RATIO.toFixed(1) + 'x from 4 d to the axis, bounded) and the relative residual holds at ' +
    'machine epsilon because the identity is a PURE ALGEBRAIC identity in the configuration, independent of ' +
    'y_star. The imp-3899 note that the resolvent is well-conditioned "only because y_star = 4 d > 0" is thus ' +
    'CONSERVATIVE for a fixed-grid evaluation: the exactness persists to the axis here. Honest limits: this is a ' +
    'self-consistency check that the discrete flux is read correctly, NOT a certificate. It does not prove the ' +
    'mean-field / hydrodynamic limit exists, does not certify convex-flux H2, and a fixed d/2 x-grid is NOT the ' +
    'y -> 0 microscopic continuum -- a grid REFINED to approach a pole (horizontal offset -> 0) would be the ' +
    'sharper conditioning test and is left as the natural next sub-gap. So H2 stays UNWRITTEN as a certificate, ' +
    'the K4 route stays WHOLLY NEW (consistent with imp-3714 / imp-3727 / imp-3846 / imp-3872 / imp-3899) and ' +
    'G6a_shock_lipschitz stays OPEN. Scoping / measurement only; no positivity, no bridge closure, no RH claim, ' +
    'NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3899 (the b = 0.99 caustic stress at fixed y_star = 4 d, extended here toward the axis); imp-3872 (the ' +
    'P1 exact finite-N flux identity verification); imp-3642 (attractive-CM RK4 flow, seed and integrator ' +
    'reused); imp-3846 (names H2 the dependency-chain root; the caustic is where K4 regularity lives); imp-3727 ' +
    '(H1..H6 hypothesis map); Menon-Pego / Biane complex-Burgers log-gas hydrodynamics (m_s = 2 m m_z inviscid ' +
    'limit); lambda-roadmap Step 4 (Polymath15 bridge, open G6a_shock_lipschitz).',
};

export const IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP_ASSERTIONS = [
  {
    // At the mesoscopic anchor y_star = 4 d the residual is < 1e-12, recovering the imp-3899 baseline.
    id: 'imp3915-recovers-imp3899-4d-baseline',
    description: 'at y_star = 4 d the max relative residual is < 1e-12 across M = 161, 241, 321 (imp-3899 baseline)',
    holds: () => BASELINE_4D_MAX_RESID < 1e-12,
  },
  {
    // Lowering y_star across the ticket's listed sweep {4d..d/4} does NOT inflate the residual above 1e-12.
    id: 'imp3915-listed-sweep-no-inflation',
    description: 'over the listed heights y_star/d in {4, 2, 1, 0.5, 0.25} the max relative residual stays < 1e-12',
    holds: () => LISTED_MAX_RESID < 1e-12,
  },
  {
    // The conditioning margin extends all the way to the axis: no inflation even at y_star = 1e-4 d.
    id: 'imp3915-margin-extends-to-axis',
    description: 'pushing the sweep to y_star = 1e-4 d (four decades below the 4 d strip) the residual still holds < 1e-12',
    holds: () => GLOBAL_MAX_RESID < 1e-12 && IDENTITY_SURVIVES_TO_AXIS === true && DEEPEST_YSTAR_OVER_D <= 1e-4,
  },
  {
    // The conditioning proxy max |m| SATURATES (bounded growth) rather than diverging as y_star -> 0,
    // confirming the horizontal grid offset -- not y_star -- floors |z - x_k| on the fixed d/2 grid.
    id: 'imp3915-conditioning-proxy-saturates',
    description: 'max |m| grows only by a bounded factor (< 200x) from y_star = 4 d to the axis: |z - x_k| is grid-offset-floored, not y_star-driven',
    holds: () => Number.isFinite(MAX_SATURATION_RATIO) && MAX_SATURATION_RATIO < 200,
  },
  {
    // Provenance: extends imp-3899 (b = 0.99, three blocks) with the listed 5 + deep 4 heights.
    id: 'imp3915-extends-imp3899-provenance',
    description: 'sweeps y_star at the imp-3899 b = 0.99 slice over 5 listed + 4 deep heights across M = 161, 241, 321',
    holds: () =>
      BUDGET_TOP === 0.99 &&
      BLOCKS.length === 3 &&
      BLOCK_SIZES[0] === 161 &&
      BLOCK_SIZES[BLOCK_SIZES.length - 1] === 321 &&
      YSTAR_FRACS_LISTED.length === 5 &&
      YSTAR_FRACS_DEEP.length === 4 &&
      BLOCKS.every((b) => b.heights.length === YSTAR_FRACS.length),
  },
  {
    // Honesty gate: measurement not certificate -- H2 unwritten, K4 wholly new, G6a open, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3915-honesty-gate-no-qed',
    description: 'MEASUREMENT not certificate: H2 unwritten, K4 wholly new, G6a open, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP.isRigorous === false &&
      IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP.h2StillUnwritten === true &&
      IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP.k4ConfirmedWhollyNew === true &&
      IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP.g6aStillOpen === true &&
      /NO QED/.test(IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP.verdict),
  },
];

for (const a of IMP3915_G6A_P1_RESOLVENT_IDENTITY_YSTAR_CONDITIONING_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3915-g6a-p1-resolvent-identity-ystar-conditioning-sweep assertion failed: ${a.id}`);
  }
}
