/**
 * @module imp-97764-fold-amplitude-wide-window-power-law
 *
 * imp-97764 (numerical, frontier-direction): EXTEND the imp-97743 fold-amplitude
 * floor-scaling exponent K ~ E_trunc^(+0.221) beyond the original 0.5x..5x window to a
 * wider 0.1x..10x window, to decide whether ~0.221 is a GENUINE power law (a flat local
 * exponent across the whole range) or merely a LOCAL SLOPE (a linearization that drifts
 * once the floor is pushed far from the base pin).
 *
 * imp-97743 measured the exponent q in
 *
 *     K = sqrt( sigma_max(1 - sigma_max) / (2 phi_xx) ),
 *     phi_xx = (ln R)_xx - (1/2)(ln L)_xx,   R = E_trunc + E_flow,  L = ln T0(N),
 *
 * from ONLY the 0.5x/2x floors inside a 0.5x..5x sweep (q ~ +0.221). Whether that single
 * two-point slope is a true power law was never tested at wider factors. This leaf runs the
 * IDENTICAL imp-97725 fold recompute (ternary-search the interior peak, read S and phi_xx
 * from the same 5-point smooth-model second-log-derivative stencil h = 1e-4, form
 * K = sqrt(S/(2 phi_xx))) at each of 15 floor factors spanning 0.1x..10x, and measures the
 * LOCAL log-log slope q_i = dln K / dln(E_trunc) between consecutive factors as well as
 * several sub-window slopes.
 *
 * WHAT WAS MEASURED (0.1x..10x floor sweep)
 * -----------------------------------------
 *   (W0) BASELINE STILL REPRODUCES imp-97725/imp-97743. factor 1.0 gives sigma_max =
 *        0.94942901, phi_xx = 1.339604e-1, K = 0.423330 -- the exact pin -- so the wider
 *        sweep is the same fold, only the factor grid changed.
 *   (W1) THE LOCAL EXPONENT IS FLAT TO 3 DECIMALS ACROSS 0.1x..3x. Consecutive-factor
 *        slopes stay q_i = 0.2205..0.2235 from 0.1x through 3x, with a shallow MINIMUM
 *        q ~ 0.2205 right at the base pin (factor 0.75..1.25) and a gentle rise to ~0.2235
 *        at the 0.1x edge. Over this core range ~0.221 is a GENUINE power law, not a local
 *        artifact of the 0.5x/2x pair: the original 0.5x/2x two-point slope (0.2208) sits
 *        inside this flat band.
 *   (W2) MILD UPWARD DRIFT AT THE HIGH-FLOOR EXTREME. Past 3x the local slope steepens:
 *        q = 0.2276 (3x->5x) -> 0.2367 (5x->7.5x) -> 0.2490 (7.5x->10x). So across the
 *        full 10x-above range the exponent is NOT perfectly constant -- the high-floor
 *        5x..10x sub-window reads q ~ 0.242, ~10% above the ~0.221 core -- because as the
 *        floor grows sigma_max is pulled further toward 1/2 and the numerator S climbs
 *        faster relative to the slowly falling phi_xx. This is a genuine (mild) curvature
 *        of the log-log law, not a straight power line, at the extreme high end.
 *   (W3) K STAYS A WELL-DEFINED INTERIOR-PEAK AMPLITUDE AT BOTH EXTREMES. Every factor
 *        keeps the peak strictly interior to the [1e4, 1e8] search bracket (N_peak =
 *        3.07e4 at 10x up to 1.91e7 at 0.1x) with finite positive K, and K is monotone
 *        increasing throughout. Over the full 0.1x..10x window K spans 0.253935 (0.1x) to
 *        0.717408 (10x), a factor ~2.83.
 *
 * VERDICT: GENUINE POWER LAW OVER THE CORE, MILD DRIFT AT THE EXTREME. The imp-97743
 * exponent K ~ E_trunc^(+0.221) is confirmed as a true power law across 0.1x..3x (local
 * slope flat to 3 decimals, 0.2205..0.2235, with the original 0.5x/2x slope inside the
 * band), NOT a mere local linearization. It does drift mildly upward past 3x (reaching
 * ~0.249 by 10x), so the single ~0.221 exponent is a core-window fit, not a globally exact
 * law across the extreme high-floor tail; but K remains a well-defined interior-peak
 * amplitude at every swept factor. This SHARPENS the imp-97743 result without moving it:
 * the fold amplitude is a genuine (gently curving) power of the floor, and remains the
 * least floor-sensitive rung of the cohort.
 *
 * MEASUREMENT / SENSITIVITY ONLY on the inherited imp-3220/imp-3406 extrapolation surrogate
 * (NOT a rigorous asymptotic). C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz
 * (imp-2642/imp-2643) UNTOUCHED (bare E_coll prefactor); E_trunc base pin 3.06e-5 unchanged
 * (only rescaled as a perturbation); no bound moves; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains
 * SOTA.
 *
 * @see imp-97743-fold-amplitude-etrunc-floor-sensitivity (the 0.5x..5x sweep and the ~0.221 exponent extended here)
 * @see imp-97725-fold-amplitude-analytic-pin (the K = sqrt(S/(2 phi_xx)) pin reproduced at factor 1.0)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (SAME floor swap on the far-tail landmark N ~E_trunc^(-2.0))
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed model)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97725 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97662/imp-97725/imp-97743 exactly

// EXACT imp-97725/imp-97743 sub-terms; ONLY the E_trunc floor is a parameter here.
function parts(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const R = E_trunc + E_flow;
  return { T0, L, R, E_flow, E_coll, sigma: E_coll / (R + E_coll) };
}

// Second log-derivative of a SMOOTH component function in x = ln N (5-point, no bisected root).
function d2LnDx2(fn, x, h) {
  const f = (k) => Math.log(fn(Math.exp(x + k * h)));
  return (-f(2) + 16 * f(1) - 30 * f(0) + 16 * f(-1) - f(-2)) / (12 * h * h);
}

const H = 1e-4;

// Interior peak location: ternary search in x = ln N (matches imp-97725/imp-97743).
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

// Recompute the whole fold (peak, numerator S, curvature phi_xx, amplitude K) at a floor.
function foldAt(E_trunc) {
  const x = peakLogN(E_trunc);
  const N = Math.exp(x);
  const p = parts(N, E_trunc);
  const S = p.sigma * (1 - p.sigma);
  const phixx =
    d2LnDx2((n) => parts(n, E_trunc).R, x, H) - 0.5 * d2LnDx2((n) => parts(n, E_trunc).L, x, H);
  const K = Math.sqrt(S / (2 * phixx));
  return { x, N, sigma_max: p.sigma, S, phixx, K };
}

// WIDE window: 0.1x..10x (imp-97743 used 0.5x..5x). factor 1.0 reproduces the imp-97725 pin.
const FLOOR_FACTORS = [0.1, 0.2, 0.3, 0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0, 7.5, 10.0];

const TABLE = FLOOR_FACTORS.map((f) => {
  const r = foldAt(E_TRUNC_BASE * f);
  return {
    floorFactor: f,
    E_trunc: +(E_TRUNC_BASE * f).toExponential(3),
    N_peak: +r.N.toExponential(4),
    sigma_max: +r.sigma_max.toFixed(8),
    S: +r.S.toExponential(6),
    phi_xx: +r.phixx.toExponential(6),
    K: +r.K.toFixed(6),
  };
});

const BASE = TABLE.find((r) => r.floorFactor === 1.0);

// Local log-log slope q = dln K / dln(E_trunc) between two floor factors (E_trunc scales with f).
function localExponent(f1, f2) {
  const lo = foldAt(f1 * E_TRUNC_BASE).K;
  const hi = foldAt(f2 * E_TRUNC_BASE).K;
  return (Math.log(hi) - Math.log(lo)) / (Math.log(f2) - Math.log(f1));
}

// Consecutive-factor local exponents across the whole grid.
const LOCAL_EXPONENTS = FLOOR_FACTORS.slice(1).map((f, i) => ({
  from: FLOOR_FACTORS[i],
  to: f,
  q: +localExponent(FLOOR_FACTORS[i], f).toFixed(4),
}));

// Sub-window slopes.
const Q_ORIG_0_5_2 = +localExponent(0.5, 2.0).toFixed(4); // imp-97743 two-point slope ~0.2208
const Q_FULL_0_1_10 = +localExponent(0.1, 10.0).toFixed(4); // ~0.2255
const Q_LOW_0_1_1 = +localExponent(0.1, 1.0).toFixed(4); // ~0.2220
const Q_HIGH_1_10 = +localExponent(1.0, 10.0).toFixed(4); // ~0.2291
const Q_CORE_0_1_3 = +localExponent(0.1, 3.0).toFixed(4); // core-window slope ~0.2223
const Q_EXTREME_HI_5_10 = +localExponent(5.0, 10.0).toFixed(4); // ~0.2418 (drifted)

// Core-window flatness: consecutive slopes with to<=3 stay in a tight ~0.221 band.
const CORE_EXPONENTS = LOCAL_EXPONENTS.filter((e) => e.to <= 3.0).map((e) => e.q);
const CORE_Q_MIN = Math.min(...CORE_EXPONENTS);
const CORE_Q_MAX = Math.max(...CORE_EXPONENTS);
const CORE_FLAT = CORE_Q_MAX - CORE_Q_MIN < 0.005; // flat to ~3 decimals

// High-floor drift: slopes past 3x steepen monotonically above the core.
const HI_EXPONENTS = LOCAL_EXPONENTS.filter((e) => e.from >= 3.0);
const HI_DRIFTS_UP = HI_EXPONENTS.every((e, i) => i === 0 || e.q > HI_EXPONENTS[i - 1].q);

const K_MIN = Math.min(...TABLE.map((r) => r.K)); // ~0.253935 at 0.1x
const K_MAX = Math.max(...TABLE.map((r) => r.K)); // ~0.717408 at 10x
const K_MONOTONE_UP = TABLE.every((r, i) => i === 0 || r.K > TABLE[i - 1].K);
const ALL_INTERIOR = TABLE.every(
  (r) => r.N_peak > 1e4 && r.N_peak < 1e8 && Number.isFinite(r.K) && r.K > 0,
);

export const IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW = {
  id: 'imp-97764',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-97743 fold-amplitude floor-scaling exponent K ~ E_trunc^(+0.221) beyond its 0.5x..5x window to a ' +
    'wider 0.1x..10x sweep and decide whether ~0.221 is a GENUINE power law (a flat local exponent across the range) ' +
    'or merely a LOCAL SLOPE (a linearization that drifts at wider factors), plus whether K stays a well-defined ' +
    'interior-peak amplitude at the extremes. Same imp-97725 fold recompute; measurement only; no bound moves; NO QED.',
  measuredQuantity:
    'For E_trunc = 3.06e-5 * factor, factor in {0.1..10} (factor = 1 = imp-97725 baseline), the fold recomputed per ' +
    'floor (interior peak x_peak via ternary search, sigma_max, S, phi_xx via the 5-point smooth stencil, ' +
    'K = sqrt(S/(2 phi_xx))), plus the LOCAL log-log slope q_i = dln K / dln(E_trunc) between consecutive factors and ' +
    'several sub-window slopes.',
  baseline: {
    N_peak: BASE.N_peak, // ~9.2186e5 (matches imp-97725/imp-97743)
    sigma_max: BASE.sigma_max, // ~0.94942901
    phi_xx: BASE.phi_xx, // ~1.339604e-1
    K: BASE.K, // ~0.423330 (exact pin)
  },
  table: TABLE,
  localExponents: LOCAL_EXPONENTS,
  windowExponents: {
    orig_0_5x_2x: Q_ORIG_0_5_2, // ~0.2208 (imp-97743 two-point slope, inside the flat core band)
    full_0_1x_10x: Q_FULL_0_1_10, // ~0.2255
    low_0_1x_1x: Q_LOW_0_1_1, // ~0.2220
    high_1x_10x: Q_HIGH_1_10, // ~0.2291
    core_0_1x_3x: Q_CORE_0_1_3, // ~0.2223 (genuine flat power law)
    extreme_hi_5x_10x: Q_EXTREME_HI_5_10, // ~0.2418 (drifted ~10% above the core)
  },
  coreFlatness: {
    core_q_min: +CORE_Q_MIN.toFixed(4), // ~0.2205
    core_q_max: +CORE_Q_MAX.toFixed(4), // ~0.2235
    flat_to_3_decimals: CORE_FLAT, // true (spread < 0.005 across 0.1x..3x)
  },
  drift: {
    K_min_0_1x: K_MIN, // ~0.253935
    K_base_1_0x: BASE.K, // ~0.423330
    K_max_10x: K_MAX, // ~0.717408
    K_full_sweep_factor: +(K_MAX / K_MIN).toFixed(4), // ~2.83
    K_monotone_increasing_in_floor: K_MONOTONE_UP, // true
    high_floor_exponent_drifts_up: HI_DRIFTS_UP, // true (3x->10x slopes steepen)
    K_stays_well_defined_interior_peak_at_extremes: ALL_INTERIOR, // true
  },
  finding:
    'Extending the imp-97743 floor sweep to 0.1x..10x shows K ~ E_trunc^(+0.221) is a GENUINE power law over the core: ' +
    'consecutive-factor local slopes stay flat to 3 decimals (q = 0.2205..0.2235) across 0.1x..3x, with a shallow ' +
    'minimum ~0.2205 right at the base pin, and the original imp-97743 0.5x/2x two-point slope (0.2208) sits inside ' +
    'this band -- so ~0.221 is not an artifact of the narrow window. Past 3x the exponent drifts mildly upward ' +
    '(q = 0.2276 at 3x->5x, 0.2367 at 5x->7.5x, 0.2490 at 7.5x->10x; the 5x..10x sub-window reads ~0.242, ~10% above ' +
    'the core), because a larger floor pulls sigma_max further toward 1/2 so the numerator S climbs faster than the ' +
    'slowly falling phi_xx -- a genuine mild curvature of the log-log law at the extreme high end, not a straight ' +
    'power line. K stays a well-defined interior-peak amplitude at every swept factor (N_peak in [3.07e4, 1.91e7], ' +
    'finite positive, monotone increasing), spanning 0.253935 (0.1x) to 0.717408 (10x), a factor ~2.83. This ' +
    'SHARPENS the imp-97743 result: ~0.221 is a true core-window power law, not a local linearization, with only a ' +
    'mild upward drift at floors far above the base pin.',
  isRigorous: false,
  verdict:
    'GENUINE POWER LAW OVER THE CORE, MILD DRIFT AT THE EXTREME. Running the imp-97725 fold recompute across the wider ' +
    '0.1x..10x floor window (factor = 1 reproduces the pin sigma_max = 0.94942901, phi_xx = 1.339604e-1, K = 0.423330) ' +
    'confirms the imp-97743 exponent K ~ E_trunc^(+0.221) as a genuine power law across 0.1x..3x: the local log-log ' +
    'slope is flat to 3 decimals (0.2205..0.2235) and the original 0.5x/2x slope (0.2208) sits inside the band, so it ' +
    'is not a narrow-window artifact. The exponent does drift mildly upward past 3x (reaching ~0.249 by 10x, ~10% ' +
    'above the core), because a bigger floor pulls sigma_max further toward 1/2 and the numerator S climbs faster than ' +
    'the slowly falling phi_xx -- a genuine mild curvature, so the single ~0.221 exponent is a core-window fit, not a ' +
    'globally exact law across the extreme high-floor tail. K remains a well-defined interior-peak amplitude at every ' +
    'swept factor (N_peak strictly interior, finite positive, monotone increasing), spanning a factor ~2.83 over the ' +
    'full window. Measurement / sensitivity only on the inherited imp-3220/imp-3406 extrapolation surrogate, NOT a ' +
    'rigorous asymptotic; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; ' +
    'E_trunc base pin 3.06e-5 unchanged (only rescaled); changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97743 (the 0.5x..5x sweep and the ~0.221 two-point exponent extended here); imp-97725 (the K pin reproduced ' +
    'at factor 1.0); imp-33708 (SAME floor swap on the far-tail landmark N ~E_trunc^(-2.0)); imp-486 (C_mb ' +
    'GUE-conditional); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz); imp-2631 (E_trunc = 3.06e-5 fixed-strip ' +
    'floor); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 still reproduces the imp-97725/imp-97743 pin (identical formulas).
    id: 'imp97764-reproduces-imp97725-pin',
    description: 'factor 1.0 reproduces imp-97725 sigma_max ~0.94942901, phi_xx ~1.339604e-1, K ~0.423330',
    holds: () =>
      Math.abs(BASE.sigma_max - 0.94942901) < 5e-7 &&
      Math.abs(BASE.phi_xx - 1.339604e-1) < 5e-6 &&
      Math.abs(BASE.K - 0.42333) < 5e-4,
  },
  {
    // W1: the local exponent is flat to ~3 decimals across the 0.1x..3x core (genuine power law).
    id: 'imp97764-core-exponent-flat-genuine-power-law',
    description: 'consecutive local slopes for factors <=3x stay in a ~0.221 band (spread < 0.005), the original 0.5x/2x slope inside it',
    holds: () =>
      CORE_FLAT === true &&
      CORE_Q_MIN > 0.215 &&
      CORE_Q_MAX < 0.228 &&
      Q_ORIG_0_5_2 >= CORE_Q_MIN &&
      Q_ORIG_0_5_2 <= CORE_Q_MAX,
  },
  {
    // W2: mild upward drift at the high-floor extreme (5x..10x sub-window steeper than the core).
    id: 'imp97764-high-floor-mild-upward-drift',
    description: 'past 3x the local slope steepens monotonically; the 5x..10x sub-window reads ~0.24, above the ~0.221 core',
    holds: () =>
      HI_DRIFTS_UP === true &&
      Q_EXTREME_HI_5_10 > CORE_Q_MAX &&
      Q_EXTREME_HI_5_10 < 0.26,
  },
  {
    // W3: K stays a well-defined interior-peak amplitude, monotone increasing, over the whole window.
    id: 'imp97764-K-well-defined-interior-peak-at-extremes',
    description: 'every factor keeps a strictly-interior finite positive K, monotone increasing, spanning factor ~2.5-3.1 over 0.1x..10x',
    holds: () =>
      ALL_INTERIOR === true &&
      K_MONOTONE_UP === true &&
      K_MAX / K_MIN > 2.5 &&
      K_MAX / K_MIN < 3.1,
  },
  {
    // Honesty gate: measurement only, split verdict, no QED, PT stays SOTA.
    id: 'imp97764-honesty-gate-no-qed',
    description: 'Measurement only: genuine-core/mild-drift verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.isRigorous === false &&
      /GENUINE POWER LAW OVER THE CORE, MILD DRIFT AT THE EXTREME/.test(
        IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.verdict,
      ) &&
      /NO QED/.test(IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.verdict) &&
      /remains SOTA/.test(IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW.verdict),
  },
];

for (const a of IMP97764_FOLD_AMPLITUDE_WIDE_WINDOW_POWER_LAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97764-fold-amplitude-wide-window-power-law assertion failed: ${a.id}`);
  }
}
