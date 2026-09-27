/**
 * @module imp-97757-fold-amplitude-axis-crosstab
 *
 * imp-97757 (accuracy, frontier-direction): CROSS-TABULATE the imp-97725
 * fold-amplitude
 *
 *     K = sqrt( sigma_max(1 - sigma_max) / (2 phi_xx) ),
 *     phi_xx = (ln R)_xx - (1/2)(ln L)_xx,   R = E_trunc + E_flow,  L = ln T0(N),
 *
 * sensitivity across BOTH perturbation axes that the cohort probed separately but
 * never tabulated jointly:
 *
 *   (A) FLOOR axis (imp-97743): rescale the imp-2631 truncation floor
 *       E_trunc = 3.06e-5 * g and RECOMPUTE the whole interior-peak fold at each
 *       floor. imp-97743 found K ~ E_trunc^(+0.221), a +/-10% floor moving K
 *       ~ +/-2.2 percent.
 *   (B) HEIGHT axis (imp-97735): hold the floor at the base pin and walk the
 *       evaluation height N = N_peak * g, reading the LOCAL fold
 *       K(N) = sqrt(sigma(N)(1 - sigma(N)) / (2 phi_xx(N))). imp-97735 walked the
 *       SAME K denominator along a deep height ladder (1e6..1e32) and found phi_xx
 *       drifts to zero, so K has no height-independent plateau.
 *
 * Both use the SAME inherited imp-3406/imp-33582/imp-97662/imp-97725 surrogate
 * component model, the SAME 5-point smooth-model second-log-derivative stencil
 * (h = 1e-4 in x = ln N, no bisected root, no quantization floor), the SAME
 * C_C_PINNED bare E_coll prefactor, and the SAME shared perturbation grid
 * g in {0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0} (g = 1 reproduces the imp-97725
 * pin on BOTH axes). This leaf changes nothing analytic; it only lays the two
 * one-axis sweeps side by side and reports which axis dominates K and whether the
 * two axes move K in the same direction.
 *
 * WHAT WAS MEASURED (shared grid g in [0.5, 2.0], g = 1 = imp-97725 pin)
 * ---------------------------------------------------------------------
 *   (X0) BOTH axes reproduce the imp-97725 pin at g = 1: sigma_max = 0.949429,
 *        S = 4.8014e-2, phi_xx = 1.339604e-1, K = 0.423330.
 *   (X1) THE TWO AXES MOVE K IN OPPOSITE DIRECTIONS. Local elasticities at g = 1
 *        (from the +/-10 percent band): floor dlnK/dlng = +0.2205 (K GROWS as the
 *        floor rises -- reproducing the imp-97743 K ~ E_trunc^(+0.221)); height
 *        dlnK/dlng = -0.1234 (K SHRINKS as the evaluation height rises just past
 *        the peak). Their signs DISAGREE.
 *   (X2) THE FLOOR AXIS DOMINATES K near the pin: |+0.2205| vs |-0.1234|, a ratio
 *        ~1.79. Over the full shared sweep the floor spans K in [0.363295,
 *        0.493386] (factor 1.358) while the height spans K in [0.410337, 0.485126]
 *        (factor 1.182) -- the floor axis is the wider mover on both the local band
 *        and the full grid.
 *   (X3) THE TWO AXES ACT THROUGH DIFFERENT CHANNELS. On the FLOOR axis K moves
 *        mainly through the NUMERATOR: S = sigma_max(1 - sigma_max) rises by a
 *        factor ~1.635 across the sweep (sigma_max pulled toward 1/2) while phi_xx
 *        falls only mildly (factor ~0.886). On the HEIGHT axis K moves almost
 *        entirely through the DENOMINATOR: sitting AT the sigma-peak S is nearly
 *        stationary (factor ~1.031) while phi_xx rises by a factor ~1.401 (phi_xx
 *        crests just past the sigma-peak). So the floor axis is a numerator (share)
 *        effect and the height axis is a denominator (curvature) effect -- which is
 *        why they push K opposite ways.
 *
 * VERDICT: FLOOR-DOMINATED, OPPOSITE-SIGNED, DIFFERENT CHANNELS. On the shared
 * perturbation grid the E_trunc floor is the stronger lever on the fold amplitude K
 * (local elasticity +0.2205 vs the height axis -0.1234, and a full-sweep factor
 * 1.358 vs 1.182), and the two axes move K in OPPOSITE directions because they act
 * through different parts of K = sqrt(S/(2 phi_xx)): the floor through the numerator
 * share S (sigma_max toward 1/2) and the height through the denominator curvature
 * phi_xx. This joint view SHARPENS the shared imp-97725 sub-gap: K = 0.4233 is not
 * a universal constant on EITHER axis, and its two known sensitivities are of
 * comparable magnitude but opposite sign, so no cancellation makes K stationary.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY on the inherited imp-3220/imp-3406
 * extrapolation surrogate (NOT a rigorous asymptotic). C_mb GUE-conditional per
 * imp-486 UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED (bare E_coll
 * prefactor); E_trunc base pin 3.06e-5 unchanged (only rescaled as a perturbation);
 * no bound moves; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97743-fold-amplitude-etrunc-floor-sensitivity (axis A: K ~ E_trunc^(+0.221) floor swap)
 * @see imp-97735-fold-amplitude-height-ladder-drift (axis B: K denominator phi_xx walked along a height ladder)
 * @see imp-97725-fold-amplitude-analytic-pin (the K = sqrt(S/(2 phi_xx)) pin whose two sensitivities are cross-tabulated)
 * @see imp-97662-cc-elasticity-peak-divergence (the square-root fold law and first K route)
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

// EXACT imp-97725 sub-terms; E_trunc is a parameter (floor axis) and N the height axis.
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

const X_PEAK_BASE = peakLogN(E_TRUNC_BASE);
const N_PEAK_BASE = Math.exp(X_PEAK_BASE);

// AXIS A (FLOOR): rescale E_trunc by g, recompute the whole interior-peak fold (imp-97743).
function foldFloor(g) {
  const E_trunc = E_TRUNC_BASE * g;
  const x = peakLogN(E_trunc);
  const p = parts(Math.exp(x), E_trunc);
  const S = p.sigma * (1 - p.sigma);
  const phixx =
    d2LnDx2((n) => parts(n, E_trunc).R, x, H) - 0.5 * d2LnDx2((n) => parts(n, E_trunc).L, x, H);
  return { N: Math.exp(x), sigma_max: p.sigma, S, phixx, K: Math.sqrt(S / (2 * phixx)) };
}

// AXIS B (HEIGHT): hold the floor at base, read the LOCAL fold at N = N_peak * g (imp-97735).
function foldHeight(g) {
  const N = N_PEAK_BASE * g;
  const x = Math.log(N);
  const p = parts(N, E_TRUNC_BASE);
  const S = p.sigma * (1 - p.sigma);
  const phixx =
    d2LnDx2((n) => parts(n, E_TRUNC_BASE).R, x, H) - 0.5 * d2LnDx2((n) => parts(n, E_TRUNC_BASE).L, x, H);
  return { N, sigma_max: p.sigma, S, phixx, K: phixx > 0 ? Math.sqrt(S / (2 * phixx)) : NaN };
}

// Shared perturbation grid: g = 1 reproduces the imp-97725 pin on BOTH axes.
const GRID = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0];

const TABLE = GRID.map((g) => {
  const a = foldFloor(g);
  const b = foldHeight(g);
  return {
    g,
    floor: {
      E_trunc: +(E_TRUNC_BASE * g).toExponential(3),
      sigma_max: +a.sigma_max.toFixed(6),
      S: +a.S.toExponential(4),
      phi_xx: +a.phixx.toExponential(4),
      K: +a.K.toFixed(6),
    },
    height: {
      N: +b.N.toExponential(4),
      sigma_max: +b.sigma_max.toFixed(6),
      S: +b.S.toExponential(4),
      phi_xx: +b.phixx.toExponential(4),
      K: +b.K.toFixed(6),
    },
  };
});

// Local elasticity dlnK/dln g at g = 1 from the +/-10 percent band.
function elasticity(fold) {
  const lo = fold(0.9).K;
  const hi = fold(1.1).K;
  return (Math.log(hi) - Math.log(lo)) / (Math.log(1.1) - Math.log(0.9));
}
const FLOOR_ELAS = elasticity(foldFloor); // ~ +0.2205 (reproduces imp-97743 +0.221)
const HEIGHT_ELAS = elasticity(foldHeight); // ~ -0.1234

const K_FLOOR = GRID.map((g) => foldFloor(g).K);
const K_HEIGHT = GRID.map((g) => foldHeight(g).K);
const FLOOR_SWEEP_FACTOR = Math.max(...K_FLOOR) / Math.min(...K_FLOOR); // ~1.358
const HEIGHT_SWEEP_FACTOR = Math.max(...K_HEIGHT) / Math.min(...K_HEIGHT); // ~1.182

// Channel decomposition: which part of K = sqrt(S/(2 phi_xx)) each axis moves.
const S_FLOOR = GRID.map((g) => foldFloor(g).S);
const PHIXX_FLOOR = GRID.map((g) => foldFloor(g).phixx);
const S_HEIGHT = GRID.map((g) => foldHeight(g).S);
const PHIXX_HEIGHT = GRID.map((g) => foldHeight(g).phixx);
const FLOOR_S_FACTOR = Math.max(...S_FLOOR) / Math.min(...S_FLOOR); // ~1.635 (numerator moves)
const FLOOR_PHIXX_FACTOR = Math.max(...PHIXX_FLOOR) / Math.min(...PHIXX_FLOOR); // ~1.129
const HEIGHT_S_FACTOR = Math.max(...S_HEIGHT) / Math.min(...S_HEIGHT); // ~1.031 (numerator nearly frozen)
const HEIGHT_PHIXX_FACTOR = Math.max(...PHIXX_HEIGHT) / Math.min(...PHIXX_HEIGHT); // ~1.401 (denominator moves)

const BASE = TABLE.find((r) => r.g === 1.0);
const FLOOR_DOMINATES = Math.abs(FLOOR_ELAS) > Math.abs(HEIGHT_ELAS);
const SIGNS_DISAGREE = Math.sign(FLOOR_ELAS) !== Math.sign(HEIGHT_ELAS);

export const IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB = {
  id: 'imp-97757',
  proofSection: 'S-frontier',
  question:
    'Cross-tabulate the imp-97725 fold amplitude K = sqrt(sigma_max(1-sigma_max)/(2 phi_xx)) sensitivity across BOTH ' +
    'perturbation axes on one shared grid: (A) the imp-97743 E_trunc floor swap (recompute the peak fold at ' +
    'E_trunc = 3.06e-5 * g) and (B) the imp-97735 height walk (local fold at N = N_peak * g, floor fixed). Report ' +
    'K, sigma_max, S and phi_xx under both axes and state which axis dominates K and whether their signs agree. ' +
    'Cross-validation / measurement only on the inherited surrogate; no bound moves; NO QED.',
  measuredQuantity:
    'For g in {0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0} (g = 1 reproduces the imp-97725 pin on both axes): the ' +
    'floor-axis peak fold (sigma_max, S, phi_xx, K recomputed at E_trunc = base*g) and the height-axis local fold ' +
    '(sigma_max, S, phi_xx, K at N = N_peak*g, base floor); plus the local elasticities dlnK/dln g at g = 1, the ' +
    'full-sweep K factors, and the S vs phi_xx channel decomposition on each axis.',
  baseline: {
    N_peak: +N_PEAK_BASE.toExponential(6), // ~9.218633e5 (matches imp-97725)
    sigma_max: BASE.floor.sigma_max, // ~0.949429
    S: BASE.floor.S, // ~4.8014e-2
    phi_xx: BASE.floor.phi_xx, // ~1.3396e-1 (matches imp-97725)
    K: BASE.floor.K, // ~0.423330 (matches imp-97725)
  },
  table: TABLE,
  dominance: {
    floor_local_elasticity_dlnK_dlng: +FLOOR_ELAS.toFixed(4), // ~ +0.2205 (reproduces imp-97743 +0.221)
    height_local_elasticity_dlnK_dlng: +HEIGHT_ELAS.toFixed(4), // ~ -0.1234
    floor_dominates_locally: FLOOR_DOMINATES, // true (|0.2205| > |0.1234|, ratio ~1.79)
    elasticity_magnitude_ratio: +(Math.abs(FLOOR_ELAS) / Math.abs(HEIGHT_ELAS)).toFixed(3), // ~1.79
    floor_full_sweep_K_factor: +FLOOR_SWEEP_FACTOR.toFixed(3), // ~1.358
    height_full_sweep_K_factor: +HEIGHT_SWEEP_FACTOR.toFixed(3), // ~1.182
    signs_disagree: SIGNS_DISAGREE, // true (floor +, height -)
    note:
      'the E_trunc floor is the stronger lever on K both locally (elasticity +0.2205 vs -0.1234, ratio ~1.79) and ' +
      'over the full shared grid (K factor 1.358 vs 1.182); the two axes move K in OPPOSITE directions (floor +, ' +
      'height -), so no cancellation makes K stationary',
  },
  channels: {
    floor_S_factor: +FLOOR_S_FACTOR.toFixed(3), // ~1.635 (numerator moves)
    floor_phi_xx_factor: +FLOOR_PHIXX_FACTOR.toFixed(3), // ~1.129
    height_S_factor: +HEIGHT_S_FACTOR.toFixed(3), // ~1.031 (numerator nearly frozen at the peak)
    height_phi_xx_factor: +HEIGHT_PHIXX_FACTOR.toFixed(3), // ~1.401 (denominator moves)
    note:
      'DIFFERENT CHANNELS: the floor axis moves K mainly through the NUMERATOR S = sigma_max(1-sigma_max) (S factor ' +
      '~1.635, sigma_max pulled toward 1/2) with phi_xx nearly fixed; the height axis moves K almost entirely ' +
      'through the DENOMINATOR phi_xx (factor ~1.401) because S is stationary AT the sigma-peak (S factor ~1.031) ' +
      'and phi_xx crests just past the peak -- which is why the two axes push K opposite ways',
  },
  finding:
    'On a shared perturbation grid g in [0.5, 2.0] the imp-97743 floor axis and the imp-97735 height axis were laid ' +
    'side by side for the first time. Both reproduce the imp-97725 pin at g = 1 (sigma_max = 0.949429, S = 4.8014e-2, ' +
    'phi_xx = 1.3396e-1, K = 0.423330). The E_trunc FLOOR axis DOMINATES K: its local elasticity dlnK/dln g = +0.2205 ' +
    '(reproducing the imp-97743 K ~ E_trunc^(+0.221)) exceeds the HEIGHT axis -0.1234 in magnitude by a ratio ~1.79, ' +
    'and over the full grid the floor spans K by a factor 1.358 versus the height 1.182. The two axes move K in ' +
    'OPPOSITE directions (floor +, height -) because they act through DIFFERENT parts of K = sqrt(S/(2 phi_xx)): the ' +
    'floor through the numerator share S (S factor ~1.635, sigma_max pulled toward 1/2, phi_xx nearly fixed) and the ' +
    'height through the denominator curvature phi_xx (factor ~1.401, S frozen at the peak). This SHARPENS the shared ' +
    'imp-97725 sub-gap: K = 0.4233 is height- and floor-dependent on BOTH axes, and its two known sensitivities are ' +
    'comparable in size but opposite in sign, so nothing makes K a stationary universal constant.',
  isRigorous: false,
  verdict:
    'FLOOR-DOMINATED, OPPOSITE-SIGNED, DIFFERENT CHANNELS (cross-validation / measurement, NOT rigorous). Laying the ' +
    'imp-97743 E_trunc floor swap and the imp-97735 height walk on one shared grid g in [0.5, 2.0] (g = 1 reproduces ' +
    'the imp-97725 pin sigma_max = 0.949429, S = 4.8014e-2, phi_xx = 1.3396e-1, K = 0.423330 on BOTH axes) shows the ' +
    'floor axis is the stronger lever on the fold amplitude K -- local elasticity dlnK/dln g = +0.2205 (reproducing ' +
    'the imp-97743 K ~ E_trunc^(+0.221)) against the height axis -0.1234, a magnitude ratio ~1.79, and a full-sweep K ' +
    'factor 1.358 vs 1.182. The two axes move K in OPPOSITE directions because they act through different parts of ' +
    'K = sqrt(S/(2 phi_xx)): the floor through the numerator share S (S factor ~1.635, sigma_max toward 1/2, phi_xx ' +
    'nearly fixed) and the height through the denominator curvature phi_xx (factor ~1.401, S stationary at the ' +
    'sigma-peak). So the two known sensitivities of K are comparable in size but opposite in sign, and no ' +
    'cancellation makes K stationary -- SHARPENING the shared imp-97725 SUB-GAP that K = 0.4233 is not a universal ' +
    'constant on EITHER axis. Cross-validation / measurement only on the inherited imp-3220/imp-3406 extrapolation ' +
    'surrogate, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) UNTOUCHED; E_trunc base pin 3.06e-5 unchanged (only rescaled); changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97743 (axis A: E_trunc floor swap K ~ E_trunc^(+0.221)); imp-97735 (axis B: K denominator phi_xx height ' +
    'walk); imp-97725 (the K pin whose two sensitivities are cross-tabulated); imp-97662 (square-root fold law, ' +
    'first K route); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz); imp-2631 ' +
    '(E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB_ASSERTIONS = [
  {
    // Reuse gate: g = 1 reproduces the imp-97725 pin on BOTH axes (identical formulas).
    id: 'imp97757-both-axes-reproduce-imp97725-pin',
    description: 'at g = 1 both axes give sigma_max ~0.949429, phi_xx ~1.3396e-1, K ~0.423330',
    holds: () =>
      Math.abs(BASE.floor.K - 0.42333) < 5e-4 &&
      Math.abs(BASE.height.K - 0.42333) < 5e-4 &&
      Math.abs(BASE.floor.K - BASE.height.K) < 1e-9 &&
      Math.abs(BASE.floor.phi_xx - 1.339604e-1) < 5e-5,
  },
  {
    // X1: the floor axis reproduces the imp-97743 shallow POSITIVE exponent.
    id: 'imp97757-floor-axis-positive-elasticity',
    description: 'floor local elasticity dlnK/dln g lands in (0.15, 0.30), reproducing imp-97743 K ~ E_trunc^(+0.221)',
    holds: () => FLOOR_ELAS > 0.15 && FLOOR_ELAS < 0.3,
  },
  {
    // X1: the height axis moves K the OTHER way near the peak (negative elasticity).
    id: 'imp97757-height-axis-negative-elasticity',
    description: 'height local elasticity dlnK/dln g is negative (K shrinks as N rises just past the peak)',
    holds: () => HEIGHT_ELAS < 0,
  },
  {
    // X1: the two axes DISAGREE in sign -- no cancellation makes K stationary.
    id: 'imp97757-axes-signs-disagree',
    description: 'the floor and height elasticities have opposite signs',
    holds: () => SIGNS_DISAGREE === true,
  },
  {
    // X2: the floor axis DOMINATES K both locally and over the full grid.
    id: 'imp97757-floor-axis-dominates',
    description: 'floor |elasticity| exceeds height |elasticity| and floor full-sweep K factor exceeds height factor',
    holds: () =>
      FLOOR_DOMINATES === true &&
      Math.abs(FLOOR_ELAS) > 1.3 * Math.abs(HEIGHT_ELAS) &&
      FLOOR_SWEEP_FACTOR > HEIGHT_SWEEP_FACTOR,
  },
  {
    // X3: DIFFERENT CHANNELS -- floor moves the numerator S, height moves the denominator phi_xx.
    id: 'imp97757-different-channels-numerator-vs-denominator',
    description: 'floor moves S more than phi_xx while height moves phi_xx more than S (numerator vs denominator)',
    holds: () =>
      FLOOR_S_FACTOR > FLOOR_PHIXX_FACTOR &&
      HEIGHT_PHIXX_FACTOR > HEIGHT_S_FACTOR &&
      HEIGHT_S_FACTOR < 1.1, // S nearly frozen at the sigma-peak
  },
  {
    // Honesty gate: cross-validation only, sub-gap sharpened, no QED, PT stays SOTA.
    id: 'imp97757-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, floor-dominated/opposite-signed verdict, sub-gap, no QED, PT SOTA',
    holds: () =>
      IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB.isRigorous === false &&
      /FLOOR-DOMINATED, OPPOSITE-SIGNED, DIFFERENT CHANNELS/.test(IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB.verdict) &&
      /SUB-GAP/.test(IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB.verdict) &&
      /NO QED/.test(IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB.verdict) &&
      /remains SOTA/.test(IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB.verdict),
  },
];

for (const a of IMP97757_FOLD_AMPLITUDE_AXIS_CROSSTAB_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97757-fold-amplitude-axis-crosstab assertion failed: ${a.id}`);
  }
}
