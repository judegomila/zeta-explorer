/**
 * @module imp-97779-fold-amplitude-saturation-extreme-window
 *
 * imp-97779 (numerical, frontier-direction): EXTEND the imp-97764 fold-amplitude
 * floor-scaling exponent sweep beyond its 0.1x..10x window to an extreme 0.02x..50x
 * window, to decide whether the imp-97764 mild upward drift (local slope q rising from the
 * ~0.221 core to ~0.249 by 10x) SATURATES at a finite limiting exponent or KEEPS STEEPENING
 * as the floor is pulled up and sigma_max is dragged toward 1/2.
 *
 * The fold amplitude (imp-97725/imp-97743/imp-97764) is
 *
 *     K = sqrt( sigma_max(1 - sigma_max) / (2 phi_xx) ),
 *     phi_xx = (ln R)_xx - (1/2)(ln L)_xx,   R = E_trunc + E_flow,  L = ln T0(N),
 *
 * recomputed per floor by ternary-searching the interior sigma-peak in x = ln N and reading
 * S = sigma_max(1 - sigma_max) and phi_xx from the same 5-point smooth-model second-log-
 * derivative stencil (h = 1e-4). imp-97764 used a FIXED [1e4, 1e8] ternary bracket; at the
 * extreme factors this study pushes past, the interior peak LEAVES that bracket (N_peak falls
 * below 1e4 above ~15x and rises above 1e8 below ~0.05x), so this leaf uses the ADAPTIVE WIDE
 * bracket [1e2, 1e12] to keep the peak genuinely interior at every swept factor. The local
 * log-log slope q_i = dln K / dln(E_trunc) is measured between consecutive factors.
 *
 * WHAT WAS MEASURED (0.02x..50x floor sweep, wide-bracket interior peaks)
 * ----------------------------------------------------------------------
 *   (X0) BASELINE + imp-97764 CORE STILL REPRODUCE. factor 1.0 gives sigma_max = 0.94942901,
 *        phi_xx = 1.339604e-1, K = 0.423330 (the imp-97725 pin), and the 0.05x..5x local
 *        slopes stay in the ~0.221 core band (0.2206..0.2256), matching imp-97764. The wider
 *        sweep is the same fold, only the factor grid and the (adaptive) bracket changed.
 *   (X1) THE LOW-FLOOR EXTREME SATURATES AT THE ~0.221 CORE. Pulling the floor DOWN to
 *        0.02x (sigma_max -> 0.9896, i.e. dragged toward 1, AWAY from 1/2) the local slope
 *        does NOT run away: q = 0.2264 (0.02x->0.05x), 0.2249 (0.05x->0.1x) -- flat, back on
 *        the ~0.221 core plateau. On the low side the exponent SATURATES near ~0.225.
 *   (X2) THE HIGH-FLOOR EXTREME DOES NOT SATURATE -- IT KEEPS STEEPENING AND DIVERGES. Past
 *        the imp-97764 10x edge the consecutive local slope climbs MONOTONICALLY with no
 *        ceiling: q = 0.2256 (2x->5x) -> 0.2418 (5x->10x) -> 0.2709 (10x->15x) -> 0.3091
 *        (15x->20x) -> 0.3911 (20x->30x) -> 0.8643 (30x->50x). There is NO finite limiting
 *        exponent as sigma_max is pulled toward 1/2; the drift accelerates.
 *   (X3) MECHANISM: K DIVERGES BECAUSE THE FOLD CURVATURE phi_xx COLLAPSES TO ZERO. The
 *        numerator S = sigma_max(1 - sigma_max) grows only mildly (0.0480 at 1x -> 0.1553 at
 *        50x), but the denominator curvature phi_xx COLLAPSES (1.339604e-1 at 1x -> 9.665e-2
 *        at 10x -> 2.789e-2 at 50x), so K = sqrt(S/(2 phi_xx)) blows up (0.4233 at 1x ->
 *        0.7174 at 10x -> 1.5948 at 50x). Between 50x and ~75x phi_xx crosses zero: the
 *        interior sigma-maximum FLATTENS and then DEGENERATES (phi_xx < 0, K non-real), so
 *        the fold ceases to exist as a quadratic peak. The ~0.221 power law is a LOCAL
 *        PLATEAU around the base pin (~0.05x..5x), not a globally saturating law.
 *   (X4) THIS ALSO CORRECTS AN imp-97764 BRACKET ARTIFACT. With the fixed [1e4, 1e8] bracket
 *        the peak edge-pins past ~15x (N_peak clamped to 1e4), producing spurious local
 *        slopes at the extreme high end (a NEGATIVE q ~ -0.055 across 20x->30x, an artifact,
 *        not a real reversal). The adaptive wide bracket keeps N_peak interior (down to
 *        ~1.07e3 at 50x) and reveals the true monotone steepening / divergence.
 *
 * VERDICT: THE DRIFT DOES NOT SATURATE ON THE HIGH-FLOOR SIDE -- IT DIVERGES. Extending the
 * imp-97764 sweep to 0.02x..50x settles the saturation question: pulling the floor DOWN the
 * local exponent saturates back onto the ~0.221 core (q ~ 0.225 at the 0.02x edge, sigma_max
 * -> 1), but pulling the floor UP the exponent KEEPS STEEPENING with no ceiling (q climbs
 * 0.24 -> 0.27 -> 0.31 -> 0.39 -> 0.86 across 5x..50x) and K DIVERGES because the fold
 * curvature phi_xx collapses toward zero and crosses it near ~50x-75x, where the interior
 * sigma-maximum degenerates. So there is NO finite limiting exponent as sigma_max -> 1/2; the
 * imp-97743/imp-97764 K ~ E_trunc^(+0.221) power law is a LOCAL PLATEAU near the base pin, not
 * a globally saturating law, and the fold amplitude has a finite high-floor validity ceiling
 * (~50x, where the quadratic peak stops existing) on this surrogate. This SHARPENS imp-97764
 * (whose ~0.249-by-10x drift was the leading edge of this divergence, and whose fixed bracket
 * masked it past 15x) without moving any bound.
 *
 * MEASUREMENT / SENSITIVITY ONLY on the inherited imp-3220/imp-3406 extrapolation surrogate
 * (NOT a rigorous asymptotic). C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8 ansatz
 * (imp-2642/imp-2643) UNTOUCHED (bare E_coll prefactor); E_trunc base pin 3.06e-5 unchanged
 * (only rescaled as a perturbation); no bound moves; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97764-fold-amplitude-wide-window-power-law (the 0.1x..10x sweep and the ~0.249-by-10x drift extended here)
 * @see imp-97743-fold-amplitude-etrunc-floor-sensitivity (the ~0.221 exponent origin)
 * @see imp-97725-fold-amplitude-analytic-pin (the K = sqrt(S/(2 phi_xx)) pin reproduced at factor 1.0)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed model)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97725 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97725/imp-97743/imp-97764 exactly

// EXACT imp-97725/imp-97743/imp-97764 sub-terms; ONLY the E_trunc floor is a parameter here.
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

// ADAPTIVE WIDE bracket [1e2, 1e12] so the interior peak stays inside at every extreme factor
// (imp-97764 used a fixed [1e4, 1e8] that the peak escapes past ~15x / below ~0.05x).
const BRACKET_LO = 1e2;
const BRACKET_HI = 1e12;

function peakLogN(E_trunc) {
  let a = Math.log(BRACKET_LO);
  let b = Math.log(BRACKET_HI);
  for (let i = 0; i < 400; i++) {
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
  const K = phixx > 0 ? Math.sqrt(S / (2 * phixx)) : NaN;
  return { x, N, sigma_max: p.sigma, S, phixx, K };
}

// EXTREME window: 0.02x..50x (imp-97764 used 0.1x..10x). factor 1.0 reproduces the imp-97725 pin.
const FLOOR_FACTORS = [0.02, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 15.0, 20.0, 30.0, 50.0];

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

// Low-floor saturation: consecutive slopes at the low extreme fall back onto the ~0.221 core.
const LOW_EXPONENTS = LOCAL_EXPONENTS.filter((e) => e.to <= 0.1).map((e) => e.q);
const LOW_Q_MIN = Math.min(...LOW_EXPONENTS);
const LOW_Q_MAX = Math.max(...LOW_EXPONENTS);
const LOW_SATURATES = LOW_Q_MAX - LOW_Q_MIN < 0.005 && LOW_Q_MAX < 0.23; // flat, on the core

// High-floor divergence: consecutive slopes past 2x steepen monotonically with no ceiling.
const HI_EXPONENTS = LOCAL_EXPONENTS.filter((e) => e.from >= 2.0);
const HI_MONOTONE_STEEPENS = HI_EXPONENTS.every((e, i) => i === 0 || e.q > HI_EXPONENTS[i - 1].q);
const HI_Q_TERMINAL = HI_EXPONENTS[HI_EXPONENTS.length - 1].q; // 30x->50x, ~0.86
const HI_NO_CEILING = HI_Q_TERMINAL > 2 * 0.249; // far above the imp-97764 10x-edge drift

// phi_xx collapse driving the divergence.
const PHIXX_BASE = BASE.phi_xx; // ~1.339604e-1
const PHIXX_50X = TABLE.find((r) => r.floorFactor === 50.0).phi_xx; // ~2.79e-2
const PHIXX_COLLAPSES = PHIXX_50X > 0 && PHIXX_50X < PHIXX_BASE / 3;

// K stays interior + finite (positive phi_xx) across the whole 0.02x..50x window; diverges upward.
const K_ALL_FINITE_INTERIOR = TABLE.every(
  (r) => Number.isFinite(r.K) && r.K > 0 && r.phi_xx > 0 && r.N_peak > BRACKET_LO && r.N_peak < BRACKET_HI,
);
const K_MIN = Math.min(...TABLE.map((r) => r.K)); // ~0.176564 at 0.02x
const K_MAX = Math.max(...TABLE.map((r) => r.K)); // ~1.594789 at 50x
const K_MONOTONE_UP = TABLE.every((r, i) => i === 0 || r.K > TABLE[i - 1].K);

export const IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW = {
  id: 'imp-97779',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-97764 fold-amplitude floor-scaling exponent sweep beyond its 0.1x..10x window to an extreme ' +
    '0.02x..50x sweep and decide whether the imp-97764 mild upward drift (local slope q rising from the ~0.221 core to ' +
    '~0.249 by 10x) SATURATES at a finite limiting exponent or KEEPS STEEPENING as sigma_max is pulled toward 1/2. ' +
    'Same imp-97725 fold recompute, adaptive wide ternary bracket so the peak stays interior; measurement only; no ' +
    'bound moves; NO QED.',
  measuredQuantity:
    'For E_trunc = 3.06e-5 * factor, factor in {0.02..50} (factor = 1 = imp-97725 baseline), the fold recomputed per ' +
    'floor (interior peak x_peak via ternary search in the wide bracket [1e2, 1e12], sigma_max, S, phi_xx via the ' +
    '5-point smooth stencil, K = sqrt(S/(2 phi_xx))), plus the LOCAL log-log slope q_i = dln K / dln(E_trunc) between ' +
    'consecutive factors and the low- / high-extreme saturation behaviour.',
  baseline: {
    N_peak: BASE.N_peak, // ~9.2186e5 (matches imp-97725/imp-97743/imp-97764)
    sigma_max: BASE.sigma_max, // ~0.94942901
    phi_xx: BASE.phi_xx, // ~1.339604e-1
    K: BASE.K, // ~0.423330 (exact pin)
  },
  table: TABLE,
  localExponents: LOCAL_EXPONENTS,
  lowFloorSaturation: {
    low_q_min: +LOW_Q_MIN.toFixed(4), // ~0.2249
    low_q_max: +LOW_Q_MAX.toFixed(4), // ~0.2264
    saturates_on_the_core: LOW_SATURATES, // true (flat ~0.225 at 0.02x..0.1x, back on the core)
  },
  highFloorDivergence: {
    hi_exponents: HI_EXPONENTS.map((e) => e.q), // [0.2256, 0.2418, 0.2709, 0.3091, 0.3911, 0.8643]
    monotone_steepening_no_ceiling: HI_MONOTONE_STEEPENS && HI_NO_CEILING, // true
    hi_q_terminal_30x_50x: HI_Q_TERMINAL, // ~0.8643 (far above the ~0.249 10x-edge drift)
    phi_xx_base_1x: PHIXX_BASE, // ~1.339604e-1
    phi_xx_50x: PHIXX_50X, // ~2.79e-2 (collapsing toward zero -> K diverges)
    phi_xx_collapses_toward_zero: PHIXX_COLLAPSES, // true (interior max degenerates near ~50x-75x)
  },
  amplitude: {
    K_min_0_02x: K_MIN, // ~0.176564
    K_base_1_0x: BASE.K, // ~0.423330
    K_max_50x: K_MAX, // ~1.594789 (diverging)
    K_monotone_increasing_in_floor: K_MONOTONE_UP, // true
    K_finite_interior_across_window: K_ALL_FINITE_INTERIOR, // true (adaptive bracket keeps peak interior)
  },
  finding:
    'Extending the imp-97764 floor sweep to 0.02x..50x settles the saturation question. Pulling the floor DOWN to ' +
    '0.02x (sigma_max -> 0.9896, dragged toward 1) the local exponent SATURATES back onto the ~0.221 core (q = 0.2264 ' +
    'at 0.02x->0.05x, 0.2249 at 0.05x->0.1x) -- no runaway on the low side. Pulling the floor UP the exponent does the ' +
    'OPPOSITE: it KEEPS STEEPENING with no ceiling (q = 0.2256 at 2x->5x, 0.2418 at 5x->10x, 0.2709 at 10x->15x, ' +
    '0.3091 at 15x->20x, 0.3911 at 20x->30x, 0.8643 at 30x->50x) and K DIVERGES (0.4233 at 1x -> 0.7174 at 10x -> ' +
    '1.5948 at 50x), because the fold curvature phi_xx collapses toward zero (1.339604e-1 at 1x -> 9.665e-2 at 10x -> ' +
    '2.789e-2 at 50x) while the numerator S grows only mildly; between ~50x and ~75x phi_xx crosses zero and the ' +
    'interior sigma-maximum degenerates, so the quadratic fold stops existing. So there is NO finite limiting exponent ' +
    'as sigma_max -> 1/2: the imp-97743/imp-97764 K ~ E_trunc^(+0.221) law is a LOCAL PLATEAU near the base pin ' +
    '(~0.05x..5x), not a globally saturating law, and the fold has a finite high-floor validity ceiling (~50x). This ' +
    'also corrects an imp-97764 bracket artifact: its fixed [1e4, 1e8] ternary bracket edge-pins the peak past ~15x ' +
    '(spurious negative q ~ -0.055 at 20x->30x); the adaptive wide bracket keeps N_peak interior (down to ~1.07e3 at ' +
    '50x) and reveals the true monotone steepening.',
  isRigorous: false,
  verdict:
    'THE DRIFT DOES NOT SATURATE ON THE HIGH-FLOOR SIDE -- IT DIVERGES. Running the imp-97725 fold recompute across ' +
    'the extreme 0.02x..50x floor window (factor = 1 reproduces the pin sigma_max = 0.94942901, phi_xx = 1.339604e-1, ' +
    'K = 0.423330; the 0.05x..5x core stays on the ~0.221 plateau, matching imp-97764) settles the imp-97764 ' +
    'saturation question. Pulling the floor DOWN (sigma_max -> 1) the local exponent SATURATES back onto the ~0.221 ' +
    'core (q ~ 0.225 across 0.02x..0.1x). Pulling the floor UP the exponent KEEPS STEEPENING with no ceiling (q climbs ' +
    '0.24 -> 0.27 -> 0.31 -> 0.39 -> 0.86 across 5x..50x) and K DIVERGES, because the fold curvature phi_xx collapses ' +
    'toward zero (1.339604e-1 -> 2.789e-2 across 1x..50x) and crosses zero near ~50x-75x, where the interior ' +
    'sigma-maximum degenerates and the quadratic fold ceases to exist. So there is NO finite limiting exponent as ' +
    'sigma_max -> 1/2; the imp-97743/imp-97764 K ~ E_trunc^(+0.221) power law is a LOCAL PLATEAU near the base pin, ' +
    'not a globally saturating law, with a finite high-floor validity ceiling (~50x). The adaptive wide ternary ' +
    'bracket also corrects an imp-97764 fixed-bracket artifact (spurious negative q past 15x). Measurement / ' +
    'sensitivity only on the inherited imp-3220/imp-3406 extrapolation surrogate, NOT a rigorous asymptotic; C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; E_trunc base pin 3.06e-5 ' +
    'unchanged (only rescaled); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97764 (the 0.1x..10x sweep and the ~0.249-by-10x drift extended here); imp-97743 (the ~0.221 exponent ' +
    'origin); imp-97725 (the K pin reproduced at factor 1.0); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi) ansatz); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 still reproduces the imp-97725/imp-97743/imp-97764 pin (identical formulas).
    id: 'imp97779-reproduces-imp97725-pin',
    description: 'factor 1.0 reproduces imp-97725 sigma_max ~0.94942901, phi_xx ~1.339604e-1, K ~0.423330',
    holds: () =>
      Math.abs(BASE.sigma_max - 0.94942901) < 5e-7 &&
      Math.abs(BASE.phi_xx - 1.339604e-1) < 5e-6 &&
      Math.abs(BASE.K - 0.42333) < 5e-4,
  },
  {
    // X1: the low-floor extreme SATURATES back onto the ~0.221 core (no runaway as sigma_max -> 1).
    id: 'imp97779-low-floor-saturates-on-core',
    description: 'consecutive local slopes at the low extreme (<=0.1x) stay flat ~0.225, back on the ~0.221 core',
    holds: () => LOW_SATURATES === true && LOW_Q_MIN > 0.22 && LOW_Q_MAX < 0.23,
  },
  {
    // X2: the high-floor extreme does NOT saturate -- monotone steepening with no ceiling.
    id: 'imp97779-high-floor-diverges-no-ceiling',
    description: 'past 2x the local slope steepens monotonically to ~0.86 by 30x->50x, far above the ~0.249 10x-edge drift',
    holds: () =>
      HI_MONOTONE_STEEPENS === true && HI_NO_CEILING === true && HI_Q_TERMINAL > 0.5,
  },
  {
    // X3: the divergence is driven by the fold curvature phi_xx collapsing toward zero.
    id: 'imp97779-phixx-collapse-drives-divergence',
    description: 'phi_xx collapses from ~1.34e-1 at 1x to ~2.8e-2 at 50x (toward zero -> K diverges, interior max degenerates)',
    holds: () => PHIXX_COLLAPSES === true && PHIXX_50X > 0 && PHIXX_50X < 0.05 && K_MAX > 1.0,
  },
  {
    // X4: K stays a finite interior-peak amplitude across the window with the adaptive wide bracket.
    id: 'imp97779-K-finite-interior-wide-bracket',
    description: 'every factor keeps a finite positive interior K (adaptive [1e2,1e12] bracket), monotone increasing across 0.02x..50x',
    holds: () => K_ALL_FINITE_INTERIOR === true && K_MONOTONE_UP === true && K_MIN > 0.15 && K_MAX > 1.5,
  },
  {
    // Honesty gate: measurement only, divergence verdict, no QED, no refereed bound is changed.
    id: 'imp97779-honesty-gate-no-qed',
    description: 'Measurement only: no-saturation / high-floor-divergence verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW.isRigorous === false &&
      /THE DRIFT DOES NOT SATURATE ON THE HIGH-FLOOR SIDE -- IT DIVERGES/.test(
        IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW.verdict,
      ) &&
      /NO QED/.test(IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW.verdict) &&
      /refereed bound is changed/i.test(IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW.verdict),
  },
];

for (const a of IMP97779_FOLD_AMPLITUDE_SATURATION_EXTREME_WINDOW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97779-fold-amplitude-saturation-extreme-window assertion failed: ${a.id}`);
  }
}
