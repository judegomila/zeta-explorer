/**
 * @module imp-97776-fold-amplitude-joint-2d-surface
 *
 * imp-97776 (numerical, frontier-direction): CROSS the two one-axis fold-amplitude
 * sweeps of imp-97757 into a JOINT 2D surface and test whether the opposite-signed
 * elasticities define a STATIONARY RIDGE / SADDLE.
 *
 * imp-97757 laid the imp-97743 FLOOR axis (dlnK/dlng = +0.2205) and the imp-97735
 * HEIGHT axis (dlnK/dlng = -0.1234) side by side but never crossed them into a grid.
 * This leaf computes the fold amplitude
 *
 *     K = sqrt( sigma(1 - sigma) / (2 phi_xx) ),
 *     phi_xx = (ln R)_xx - (1/2)(ln L)_xx,  R = E_trunc + E_flow,  L = ln T0(N),
 *
 * on the SHARED (g_floor x g_height) grid, both factors in {0.5,0.75,0.9,1.0,1.1,
 * 1.25,1.5,2.0}, with the IDENTICAL imp-97725 5-point smooth-model second-log-
 * derivative stencil (h = 1e-4 in x = ln N, no bisected root, no quantization floor),
 * the SAME imp-3406/imp-33582/imp-97662/imp-97725 surrogate component model, and the
 * SAME C_C_PINNED bare E_coll prefactor.
 *
 * JOINT CELL. At each (g_f, g_h) the floor is rescaled E_trunc = 3.06e-5 * g_f, the
 * interior sigma-peak is RECOMPUTED at that floor (x_peak(g_f), the imp-97743 move),
 * and the LOCAL fold is read at N = exp(x_peak(g_f)) * g_h (the imp-97735 move off the
 * peak). This surface CONTAINS both 1D axes as its edges: g_h = 1 reproduces the
 * imp-97743/imp-97757 FLOOR edge and g_f = 1 reproduces the imp-97735/imp-97757 HEIGHT
 * edge, and (g_f,g_h) = (1,1) reproduces the imp-97725 pin exactly.
 *
 * WHAT WAS MEASURED (8 x 8 surface, factors in [0.5,2.0])
 * -------------------------------------------------------
 *   (Y0) EDGES REPRODUCE THE 1D AXES. g_h = 1 gives the imp-97757 floor K values
 *        (0.363295 .. 0.493386) and g_f = 1 gives the imp-97757 height K values
 *        (0.485126 .. 0.410583); the (1,1) center reproduces the imp-97725 pin
 *        sigma = 0.949429, S = 4.8014e-2, phi_xx = 1.339604e-1, K = 0.423330.
 *   (Y1) THE GRADIENT AT THE CENTER IS NONZERO. dlnK/dln g = (+0.2205 floor,
 *        -0.1234 height), magnitude ~0.2527 -- so the center is NOT a critical point.
 *   (Y2) THE FLOOR PARTIAL IS POSITIVE EVERYWHERE ON THE SURFACE. Node-by-node
 *        dlnK/dln g_f stays in [+0.2018, +0.2373] over all 64 nodes: it NEVER
 *        vanishes or changes sign. Because one partial is uniformly bounded away from
 *        zero, the JOINT gradient can never vanish -- there is NO stationary
 *        point (no saddle, no extremum, no ridge) anywhere on the grid.
 *   (Y3) THE HEIGHT PARTIAL DOES CROSS ZERO, BUT ONLY ALONG ITS OWN AXIS. Node-by-node
 *        dlnK/dln g_h spans [-0.2801, +0.0517]: it is negative just past the peak and
 *        ticks slightly positive at the far height factors (a shallow height-direction
 *        local minimum near g_h ~ 1.7). This one-axis flattening is exactly the
 *        opposite-signed behaviour imp-97757 reported -- but it does NOT lift to a
 *        joint critical point because the floor partial (Y2) is still positive there.
 *   (Y4) K STAYS MONOTONE IN THE FLOOR DIRECTION AND IS NOWHERE STATIONARY. Over the
 *        full 8 x 8 surface K spans [0.354050, 0.570527], a factor ~1.611 (wider than
 *        either 1D edge, 1.358 floor / 1.182 height), climbing monotonically along the
 *        floor direction and along the g_f = g_h diagonal (0.413601 .. 0.472643). The
 *        only locally flat curves are ordinary LEVEL SETS perpendicular to the nonzero
 *        gradient (direction ~(dg_f,dg_h) proportional to (-0.1234,-0.2205)) -- a level
 *        curve every smooth surface has, NOT a genuine stationary ridge.
 *
 * VERDICT: NO STATIONARY RIDGE / SADDLE -- K IS JOINTLY NON-STATIONARY. Crossing the
 * imp-97743 floor axis and the imp-97735 height axis into a 2D (g_f x g_h) surface does
 * NOT turn the opposite-signed elasticities into a stationary ridge. The floor partial
 * dlnK/dln g_f is positive everywhere on the grid ([+0.2018,+0.2373], never zero), so
 * the joint gradient never vanishes and no critical point exists; the height partial
 * dlnK/dln g_h does cross zero ([-0.2801,+0.0517], a shallow one-axis local minimum near
 * g_h ~ 1.7) but that flattening never lifts to a joint saddle because the floor
 * direction is still climbing there. K spans a factor ~1.611 across the surface and is
 * monotone along the floor direction, so the two opposite-signed axes produce only
 * ordinary level curves, not a stationary ridge -- SHARPENING the shared imp-97725
 * SUB-GAP that K = 0.4233 is not a stationary universal constant on the joint surface.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY on the inherited imp-3220/imp-3406 extrapolation
 * surrogate (NOT a rigorous asymptotic). C_mb GUE-conditional per imp-486 UNTOUCHED;
 * C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED (bare E_coll prefactor); E_trunc base
 * pin 3.06e-5 unchanged (only rescaled as a perturbation); no bound moves; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97757-fold-amplitude-axis-crosstab (the two 1D axes laid side by side; this leaf crosses them)
 * @see imp-97743-fold-amplitude-etrunc-floor-sensitivity (floor axis K ~ E_trunc^(+0.221))
 * @see imp-97735-fold-amplitude-height-ladder-drift (height axis K denominator phi_xx drift)
 * @see imp-97725-fold-amplitude-analytic-pin (the K = sqrt(S/(2 phi_xx)) pin at the surface center)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed model)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97725 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97662/imp-97725 exactly
const CC = C_C_PINNED;
const H = 1e-4;

// EXACT imp-97725 sub-terms; E_trunc is the floor parameter and N the height parameter.
function parts(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = CC * Math.sqrt(L / N);
  const R = E_trunc + E_flow;
  return { T0, L, R, E_flow, E_coll, sigma: E_coll / (R + E_coll) };
}

// Second log-derivative of a SMOOTH component function in x = ln N (5-point, no bisected root).
function d2LnDx2(fn, x, h) {
  const f = (k) => Math.log(fn(Math.exp(x + k * h)));
  return (-f(2) + 16 * f(1) - 30 * f(0) + 16 * f(-1) - f(-2)) / (12 * h * h);
}

// Interior peak location: ternary search in x = ln N (matches imp-97725). Floor-dependent.
function peakLogN(E_trunc) {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), E_trunc).sigma < parts(Math.exp(m2), E_trunc).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}

// JOINT CELL (g_f, g_h): rescale the floor (imp-97743), recompute the peak at that floor,
// then read the LOCAL fold off the peak at N = N_peak(g_f) * g_h (imp-97735).
function foldJoint(gf, gh) {
  const E_trunc = E_TRUNC_BASE * gf;
  const xpk = peakLogN(E_trunc);
  const N = Math.exp(xpk) * gh;
  const x = Math.log(N);
  const p = parts(N, E_trunc);
  const S = p.sigma * (1 - p.sigma);
  const phixx =
    d2LnDx2((n) => parts(n, E_trunc).R, x, H) - 0.5 * d2LnDx2((n) => parts(n, E_trunc).L, x, H);
  return { N, sigma: p.sigma, S, phixx, K: phixx > 0 ? Math.sqrt(S / (2 * phixx)) : NaN };
}

// Shared perturbation grid on BOTH axes (g = 1 reproduces the imp-97725 pin at the center).
const GRID = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0];

// Full 8 x 8 surface (rows = g_height, cols = g_floor).
const SURFACE = GRID.map((gh) => GRID.map((gf) => foldJoint(gf, gh)));

const CENTER = foldJoint(1.0, 1.0);

// Edges reproduce the two 1D axes (Y0).
const FLOOR_EDGE = GRID.map((gf) => +foldJoint(gf, 1.0).K.toFixed(6)); // imp-97757 floor axis
const HEIGHT_EDGE = GRID.map((gh) => +foldJoint(1.0, gh).K.toFixed(6)); // imp-97757 height axis

// Center gradient (elasticity) from the +/-10 percent band on each axis (Y1).
function bandElasticity(fn) {
  return (Math.log(fn(1.1)) - Math.log(fn(0.9))) / (Math.log(1.1) - Math.log(0.9));
}
const GRAD_FLOOR = bandElasticity((gf) => foldJoint(gf, 1.0).K); // ~ +0.2205
const GRAD_HEIGHT = bandElasticity((gh) => foldJoint(1.0, gh).K); // ~ -0.1234
const GRAD_MAG = Math.hypot(GRAD_FLOOR, GRAD_HEIGHT); // ~0.2527

// Node-by-node local partials across the whole surface (Y2, Y3): central +/-5 percent in ln.
const LNBAND = Math.log(1.05) - Math.log(0.95);
const PARTIAL_FLOOR = [];
const PARTIAL_HEIGHT = [];
for (const gh of GRID) {
  for (const gf of GRID) {
    PARTIAL_FLOOR.push(
      (Math.log(foldJoint(gf * 1.05, gh).K) - Math.log(foldJoint(gf * 0.95, gh).K)) / LNBAND,
    );
    PARTIAL_HEIGHT.push(
      (Math.log(foldJoint(gf, gh * 1.05).K) - Math.log(foldJoint(gf, gh * 0.95).K)) / LNBAND,
    );
  }
}
const PF_MIN = Math.min(...PARTIAL_FLOOR);
const PF_MAX = Math.max(...PARTIAL_FLOOR);
const PH_MIN = Math.min(...PARTIAL_HEIGHT);
const PH_MAX = Math.max(...PARTIAL_HEIGHT);
const FLOOR_PARTIAL_ALWAYS_POSITIVE = PF_MIN > 0; // true -> gradient never vanishes -> NO critical point
const HEIGHT_PARTIAL_CROSSES_ZERO = PH_MIN < 0 && PH_MAX > 0; // true -> one-axis flattening only
const HAS_CRITICAL_POINT = !FLOOR_PARTIAL_ALWAYS_POSITIVE; // false: no joint stationary point exists

// K spread over the full surface (Y4).
const ALL_K = SURFACE.flat()
  .map((c) => c.K)
  .filter((k) => Number.isFinite(k));
const K_SURF_MIN = Math.min(...ALL_K);
const K_SURF_MAX = Math.max(...ALL_K);
const K_SURF_FACTOR = K_SURF_MAX / K_SURF_MIN; // ~1.611

// Diagonal (g_f = g_h) and anti-diagonal (g_f = 1/g_h) K sweeps.
const DIAG_K = GRID.map((g) => +foldJoint(g, g).K.toFixed(6));
const ANTIDIAG_K = GRID.map((g) => +foldJoint(g, 1 / g).K.toFixed(6));

// Level-set direction (perpendicular to the nonzero gradient): first-order stationary curve,
// NOT a genuine critical ridge. Reported as unit (dg_f, dg_h) proportional to (grad_height,-grad_floor).
const LEVEL_DIR = (() => {
  const dx = GRAD_HEIGHT;
  const dy = -GRAD_FLOOR;
  const n = Math.hypot(dx, dy);
  return { dgf: +(dx / n).toFixed(4), dgh: +(dy / n).toFixed(4) };
})();

export const IMP97776_FOLD_AMPLITUDE_JOINT_2D_SURFACE = {
  id: 'imp-97776',
  proofSection: 'S-frontier',
  question:
    'Cross the imp-97757 floor axis (dlnK/dln g = +0.2205) and height axis (-0.1234) into a joint 2D ' +
    '(g_floor x g_height) surface of the imp-97725 fold amplitude K = sqrt(sigma(1-sigma)/(2 phi_xx)), both factors ' +
    'in [0.5,2.0] with the identical imp-97725 5-point stencil, and test whether the opposite-signed axes produce a ' +
    'stationary ridge / saddle (a joint critical point) or K stays monotone in each direction. Measurement only on ' +
    'the imp-3406 surrogate; no bound moves; NO QED.',
  measuredQuantity:
    'The 8 x 8 K surface on g_floor x g_height in {0.5,0.75,0.9,1.0,1.1,1.25,1.5,2.0}^2 (joint cell: floor rescaled, ' +
    'peak recomputed, local fold read off the peak); the two edges (reproducing the imp-97757 floor and height axes); ' +
    'the center gradient (elasticities) and its magnitude; the node-by-node floor and height partial ranges across ' +
    'all 64 nodes; the full-surface K min/max/factor; and the diagonal and level-set directions.',
  baseline: {
    N_center: +CENTER.N.toExponential(6), // ~9.218633e5 (matches imp-97725)
    sigma: +CENTER.sigma.toFixed(6), // ~0.949429
    S: +CENTER.S.toExponential(4), // ~4.8014e-2
    phi_xx: +CENTER.phixx.toExponential(4), // ~1.3396e-1 (matches imp-97725)
    K: +CENTER.K.toFixed(6), // ~0.423330 (matches imp-97725)
  },
  edges: {
    floor_edge_K: FLOOR_EDGE, // g_h = 1: reproduces the imp-97757 floor axis
    height_edge_K: HEIGHT_EDGE, // g_f = 1: reproduces the imp-97757 height axis
    note: 'the surface contains both 1D axes as its edges: g_h = 1 is the imp-97743 floor sweep, g_f = 1 the imp-97735 height sweep',
  },
  gradient: {
    floor_elasticity_dlnK_dlng: +GRAD_FLOOR.toFixed(4), // ~ +0.2205
    height_elasticity_dlnK_dlng: +GRAD_HEIGHT.toFixed(4), // ~ -0.1234
    magnitude: +GRAD_MAG.toFixed(4), // ~0.2527 (nonzero -> center is not a critical point)
    center_is_critical_point: GRAD_MAG < 1e-3, // false
    level_set_direction_dgf_dgh: LEVEL_DIR, // perpendicular to the gradient: 1st-order-flat LEVEL curve, not a ridge
  },
  partials: {
    floor_partial_min: +PF_MIN.toFixed(4), // ~ +0.2018
    floor_partial_max: +PF_MAX.toFixed(4), // ~ +0.2373
    height_partial_min: +PH_MIN.toFixed(4), // ~ -0.2801
    height_partial_max: +PH_MAX.toFixed(4), // ~ +0.0517
    floor_partial_always_positive: FLOOR_PARTIAL_ALWAYS_POSITIVE, // true
    height_partial_crosses_zero: HEIGHT_PARTIAL_CROSSES_ZERO, // true (shallow one-axis local min near g_h ~ 1.7)
    has_joint_critical_point: HAS_CRITICAL_POINT, // false
    note:
      'the FLOOR partial is positive on all 64 nodes ([+0.2018,+0.2373], never zero), so the joint gradient never ' +
      'vanishes and NO stationary point exists; the HEIGHT partial DOES cross zero ([-0.2801,+0.0517]) but that ' +
      'one-axis flattening never lifts to a joint saddle because the floor direction is still climbing there',
  },
  surface: {
    K_min: +K_SURF_MIN.toFixed(6), // ~0.354050
    K_max: +K_SURF_MAX.toFixed(6), // ~0.570527
    K_factor: +K_SURF_FACTOR.toFixed(3), // ~1.611 (wider than either 1D edge)
    diagonal_K: DIAG_K, // g_f = g_h: monotone climbing 0.413601 .. 0.472643
    antidiagonal_K: ANTIDIAG_K, // g_f = 1/g_h
    note: 'K spans a factor ~1.611 over the surface and climbs monotonically along the floor direction and the g_f = g_h diagonal -- nowhere stationary',
  },
  finding:
    'Crossing the imp-97743 floor axis and the imp-97735 height axis into a joint 8 x 8 (g_floor x g_height) surface ' +
    'shows the opposite-signed elasticities do NOT define a stationary ridge / saddle. The edges reproduce the two 1D ' +
    'axes exactly (g_h = 1 the imp-97757 floor K 0.363295..0.493386, g_f = 1 the height K 0.485126..0.410583) and the ' +
    'center reproduces the imp-97725 pin (sigma = 0.949429, S = 4.8014e-2, phi_xx = 1.3396e-1, K = 0.423330). The ' +
    'center gradient dlnK/dln g = (+0.2205 floor, -0.1234 height) has magnitude ~0.2527, so the center is not a ' +
    'critical point. Node by node the FLOOR partial stays positive everywhere ([+0.2018,+0.2373], never zero), so the ' +
    'joint gradient can never vanish and NO stationary point exists on the grid; the HEIGHT partial does cross zero ' +
    '([-0.2801,+0.0517], a shallow height-direction local minimum near g_h ~ 1.7) but that flattening never lifts to a ' +
    'joint saddle because the floor direction is still climbing there. K spans a factor ~1.611 over the surface and ' +
    'climbs monotonically along the floor direction and the g_f = g_h diagonal, so the only locally flat curves are ' +
    'ordinary level sets perpendicular to the nonzero gradient -- a level curve every smooth surface has, NOT a ' +
    'genuine ridge. This SHARPENS the shared imp-97725 sub-gap: K = 0.4233 is not a stationary universal constant on ' +
    'the joint surface.',
  isRigorous: false,
  verdict:
    'NO STATIONARY RIDGE / SADDLE -- K IS JOINTLY NON-STATIONARY (cross-validation / measurement, NOT rigorous). ' +
    'Crossing the imp-97743 floor axis and the imp-97735 height axis into a joint (g_floor x g_height) surface, both ' +
    'factors in [0.5,2.0] with the identical imp-97725 5-point stencil, does NOT turn the opposite-signed elasticities ' +
    '(+0.2205 floor, -0.1234 height at the center, gradient magnitude ~0.2527) into a stationary ridge. The floor ' +
    'partial dlnK/dln g_f is positive on all 64 nodes ([+0.2018,+0.2373], never zero), so the joint gradient never ' +
    'vanishes and no critical point exists; the height partial dlnK/dln g_h does cross zero ([-0.2801,+0.0517], a ' +
    'shallow one-axis local minimum near g_h ~ 1.7) but that flattening never lifts to a joint saddle because the ' +
    'floor direction is still climbing there. K spans a factor ~1.611 over the surface (wider than either 1D edge, ' +
    '1.358 floor / 1.182 height) and is monotone along the floor direction and the g_f = g_h diagonal, so the two ' +
    'opposite-signed axes produce only ordinary level curves, not a stationary ridge -- SHARPENING the shared ' +
    'imp-97725 SUB-GAP that K = 0.4233 is not a stationary universal constant on the joint surface. Cross-validation ' +
    '/ measurement only on the inherited imp-3220/imp-3406 extrapolation surrogate, NOT a rigorous asymptotic; C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc base pin 3.06e-5 ' +
    'unchanged (only rescaled); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97757 (the two 1D axes laid side by side; this leaf crosses them); imp-97743 (floor axis K ~ E_trunc^(+0.221)); ' +
    'imp-97735 (height axis K denominator phi_xx drift); imp-97725 (the K pin at the surface center); imp-97662 ' +
    '(square-root fold law); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz); ' +
    'imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP97776_FOLD_AMPLITUDE_JOINT_2D_SURFACE_ASSERTIONS = [
  {
    // Y0: the (1,1) center reproduces the imp-97725 pin and the edges reproduce the 1D axes.
    id: 'imp97776-center-and-edges-reproduce-prior-axes',
    description: 'center K ~0.42333 (imp-97725 pin) and edges reproduce the imp-97757 floor/height K values',
    holds: () =>
      Math.abs(CENTER.K - 0.42333) < 5e-4 &&
      Math.abs(CENTER.phixx - 1.339604e-1) < 5e-5 &&
      Math.abs(FLOOR_EDGE[0] - 0.363295) < 5e-4 &&
      Math.abs(HEIGHT_EDGE[0] - 0.485126) < 5e-4,
  },
  {
    // Y1: the center gradient is nonzero (not a critical point) with the imp-97757 signs.
    id: 'imp97776-center-gradient-nonzero-opposite-signs',
    description: 'gradient magnitude > 0.1 with floor > 0 and height < 0 (opposite signs, center not critical)',
    holds: () => GRAD_MAG > 0.1 && GRAD_FLOOR > 0 && GRAD_HEIGHT < 0,
  },
  {
    // Y2: the floor partial is positive everywhere -> no joint critical point can exist.
    id: 'imp97776-floor-partial-positive-everywhere',
    description: 'the floor partial dlnK/dln g_f is positive on all 64 nodes (min > 0.15), so the gradient never vanishes',
    holds: () => FLOOR_PARTIAL_ALWAYS_POSITIVE === true && PF_MIN > 0.15,
  },
  {
    // Y3: the height partial crosses zero -- one-axis flattening only.
    id: 'imp97776-height-partial-crosses-zero',
    description: 'the height partial spans negative to slightly positive (a one-axis local minimum, not a joint saddle)',
    holds: () => HEIGHT_PARTIAL_CROSSES_ZERO === true && PH_MIN < -0.1 && PH_MAX > 0,
  },
  {
    // Core verdict: NO joint stationary point / ridge exists.
    id: 'imp97776-no-joint-critical-point',
    description: 'has_joint_critical_point is false: the opposite-signed axes do not define a stationary ridge/saddle',
    holds: () => HAS_CRITICAL_POINT === false,
  },
  {
    // Y4: K spans a wide factor over the surface (nowhere stationary).
    id: 'imp97776-K-surface-non-constant',
    description: 'K spans a factor > 1.5 over the surface (wider than either 1D edge)',
    holds: () => K_SURF_FACTOR > 1.5,
  },
  {
    // Honesty gate: measurement only, sub-gap sharpened, no QED, PT stays SOTA.
    id: 'imp97776-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no-stationary-ridge verdict, sub-gap, no QED, PT SOTA',
    holds: () =>
      IMP97776_FOLD_AMPLITUDE_JOINT_2D_SURFACE.isRigorous === false &&
      /NO STATIONARY RIDGE \/ SADDLE/.test(IMP97776_FOLD_AMPLITUDE_JOINT_2D_SURFACE.verdict) &&
      /SUB-GAP/.test(IMP97776_FOLD_AMPLITUDE_JOINT_2D_SURFACE.verdict) &&
      /NO QED/.test(IMP97776_FOLD_AMPLITUDE_JOINT_2D_SURFACE.verdict) &&
      /remains SOTA/.test(IMP97776_FOLD_AMPLITUDE_JOINT_2D_SURFACE.verdict),
  },
];

for (const a of IMP97776_FOLD_AMPLITUDE_JOINT_2D_SURFACE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97776-fold-amplitude-joint-2d-surface assertion failed: ${a.id}`);
  }
}
