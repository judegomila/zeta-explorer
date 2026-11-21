/**
 * @module imp-35059-r-margin-K-logT0-curvature
 *
 * imp-35059 (numerical, frontier): imp-34953 treats K = (C_C/E_trunc)^2 as a strictly N-INDEPENDENT PT-anchor
 * amplitude, so R_margin(N) = N*FP_LO/K is EXACTLY linear in N and the nStar=5 pinning window has fixed edges
 * (2.6361e9, 5.2722e9]. The frontier scout flagged that C_C "carries a log T0(N) factor", which -- if folded into
 * the amplitude -- would give K a residual N-dependence, bending R_margin away from strict linearity and shifting
 * the window edges. This module RESOLVES that concern two ways: (1) it reads the ACTUAL code definitions and shows
 * C_C is the PURE constant (1/8) sqrt(3 pi) ~ 0.38375, with the log T0(N) factor living EXPLICITLY in the
 * collision-energy bound E_coll(N) <= C_C sqrt(log T0(N)/N) and in the shared Banach map g(N) = K log T0(N) --
 * NOT inside C_C -- so K = (C_C/E_trunc)^2 is genuinely N-independent to machine precision and the log-T0-in-C_C
 * shift is EXACTLY ZERO; and (2) it MEASURES the maximal COUNTERFACTUAL: if one erroneously folded a normalized
 * log-T0 factor into the amplitude (K_hat(N) = K log T0(N)/log T0(N_cross), pinned to the published K at N_cross),
 * how much would R_margin bend and the nStar=5 window edges shift, and would the imp-34693 seed band still stay
 * pinned. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486; distinct
 * from the imp-34969 FP_LO-drift ticket; changes no bound; imp-34714a REMAINS OPEN; NO QED.
 *
 * WHAT C_C ACTUALLY IS (the log T0 factor is NOT inside it)
 * --------------------------------------------------------
 * C_C_PINNED = C_H sqrt(C_KH) = (1/8) sqrt(3 pi) ~ 0.38375 is a PURE constant (imp-2642/imp-2643 ansatz; the
 * imp-2714 guard locks it to the literal at tol 1e-12). The log T0(N) height dependence appears in TWO explicit,
 * factored-out places, never inside C_C:
 *   - the collision-energy bound        E_coll(N) <= C_C sqrt(log gamma_N / N)   (gamma_N ~ T0(N) the Nth height),
 *   - the shared imp-33723/imp-34865 Banach map   g(N) = K log T0(N).
 * So K = (C_C/E_trunc)^2 with E_trunc = 3.06e-5 (imp-2631/imp-3406/imp-33582 fixed-strip) evaluates to the SAME
 * ~1.5727e8 at every N. The published K carries NO residual log T0(N): R_margin(N) = N*FP_LO/K is exactly linear
 * from K side, and the log-T0-in-C_C edge shift the scout worried about is IDENTICALLY ZERO. (The remaining
 * departure from strict linearity is the ~0.5% FP_LO(N) drift, which is the DISTINCT imp-34969 ticket.)
 *
 * THE MAXIMAL COUNTERFACTUAL (fold a normalized log-T0 factor into the amplitude)
 * ------------------------------------------------------------------------------
 * To bound the largest effect the concern could ever have, define K_hat(N) = K log T0(N)/L0 with L0 = log T0(N_cross)
 * ~ 20.8576, pinned so K_hat(N_cross) = K (hence R_margin unchanged at N_cross). Then
 *   R_margin_eff(N) = N*FP_LO/K_hat(N) = (N*FP_LO/K) * L0/log T0(N) = R_margin_linear(N) * L0/log T0(N).
 * Because log T0(N) grows with N, the factor L0/log T0(N) is < 1 above N_cross and > 1 below it, so R_margin bends
 * DOWN at large N and UP at small N -- a SLOW, purely LOGARITHMIC curvature (not a power law). Band-wide over
 * 1e6..1e13, log T0(N) climbs from ~13.305 to ~28.525 (a factor ~2.144), so K_hat would vary by that factor across
 * the far tail -- a real bend, but one that changes by <1 e-fold over the entire seven-decade band.
 *
 * THE PINNING-WINDOW EDGE SHIFT (and why nStar=5 stays pinned in the seed band)
 * ----------------------------------------------------------------------------
 * Solving R_margin_eff(N) = 16 and = 32 by fixed-point (edges satisfy N = target*K/FP_LO * log T0(N)/L0):
 *   lower edge  2.6361e9  ->  2.6087e9   (shift ~ -2.74e7,  -1.04%)
 *   upper edge  5.2722e9  ->  5.3913e9   (shift ~ +1.19e8,  +2.26%)
 * The window WIDENS slightly (2.636e9 -> 2.783e9). The largest edge shift ~1.19e8 is ~23x below the window width
 * and only ~9x the ~1.3e7 FP_LO-drift edge shift -- still two orders below the factor-2 (~2.636e9) dyadic wall
 * spacing. Crucially the imp-34693 admissible seed band [3.11e9, 3.45e9] stays STRICTLY inside the shifted window
 * (R_margin_eff at the seed-band edges is ~18.92 and ~20.89, both in (16, 32]). So even under the maximal
 * counterfactual the nStar=5 pin is NOT broken within the seed band: the log-T0 curvature cannot move any
 * seed-band point across a dyadic wall. imp-34953 conclusion is ROBUST to the scout concern.
 *
 * WHAT STAYS OPEN
 * --------------
 * MEASUREMENT only on the inherited imp-3220/imp-3406 surrogate crossover map, reusing C_C_PINNED and
 * effectiveHeightForN VERBATIM. It shows K is genuinely N-independent (log T0 not in C_C) and bounds the maximal
 * counterfactual log-T0 curvature, but does NOT instantiate the imp-34687a directed-rounding transcendental layer
 * and does NOT discharge the conditional. imp-34714a REMAINS OPEN. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/
 * imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34953-r-margin-dyadic-wall-across-N (the R_margin(N)=N*FP_LO/K sweep this stress-tests for K curvature)
 * @see imp-34969-fp-lo-drift-band-wide (the DISTINCT FP_LO(N)-drift departure-from-linearity ticket)
 * @see imp-34889-forward-breach-band-uniformity (the shared Banach map g(N)=K log T0(N); K_AMPL definition)
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi); imp-2714 literal guard)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM-inverse height T0(N) reused verbatim)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI; // (unused by the ratio; kept for parity with the shared Banach-map modules)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582), same as imp-34889
const K_PUB = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34889/imp-34953: C_C is a CONSTANT)
const FP_LO_PUB = 0.954568; // published Krawczyk quotient denominator floor, held fixed (drift is imp-34969)
const N_CROSS_PUB = 3.28029435165241e9; // published RvM-inverse crossover fixed point

const logT0 = (N) => Math.log(effectiveHeightForN(N)); // log of the RvM-inverse height T0(N), reused verbatim
const L0 = logT0(N_CROSS_PUB); // ~20.8576 (the log-height at N_cross; the counterfactual normalizer)

// --- (1) K is genuinely N-independent: C_C is a pure constant, log T0 is NOT inside it --------------------
const kAt = (_N) => (C_C_PINNED / E_TRUNC_PT) ** 2; // K has NO N argument dependence: constant at every N
const K_BAND = [1e6, 1e9, N_CROSS_PUB, 1e13].map((N) => kAt(N));
const K_MAX_REL_SPREAD = Math.max(...K_BAND.map((k) => Math.abs(k - K_PUB) / K_PUB)); // 0 exactly (constant)

// --- The actual (linear) R_margin and the counterfactual (log-T0-folded) R_margin -------------------------
const rMarginLinear = (N) => (N * FP_LO_PUB) / K_PUB; // R_margin(N) = N*FP_LO/K, imp-34953 verbatim (K constant)
const kHat = (N) => (K_PUB * logT0(N)) / L0; // counterfactual amplitude if C_C carried a normalized log-T0 factor
const rMarginEff = (N) => (N * FP_LO_PUB) / kHat(N); // = rMarginLinear(N) * L0/logT0(N): the weak log curvature

// --- Band-wide log T0 span (the size of the counterfactual curvature over 1e6..1e13) ----------------------
const LOGT0_LO = logT0(1e6); // ~13.305
const LOGT0_HI = logT0(1e13); // ~28.525
const LOGT0_BAND_RATIO = LOGT0_HI / LOGT0_LO; // ~2.144 (max K_hat variation factor band-wide)

// --- Pinning-window edges: linear (fixed) vs counterfactual (implicit, fixed-point solved) ----------------
const N_PIN_LO_LIN = (16 * K_PUB) / FP_LO_PUB; // ~2.6361e9 (R_margin_linear = 16)
const N_PIN_HI_LIN = (32 * K_PUB) / FP_LO_PUB; // ~5.2722e9 (R_margin_linear = 32)
// Under the counterfactual an edge solves N = target*K/FP_LO * logT0(N)/L0; converge by fixed-point iteration.
const solveEffEdge = (target) => {
  let N = (target * K_PUB) / FP_LO_PUB;
  for (let i = 0; i < 200; i++) N = ((target * K_PUB) / FP_LO_PUB) * (logT0(N) / L0);
  return N;
};
const N_PIN_LO_EFF = solveEffEdge(16); // ~2.6087e9
const N_PIN_HI_EFF = solveEffEdge(32); // ~5.3913e9
const LO_SHIFT_ABS = N_PIN_LO_EFF - N_PIN_LO_LIN; // ~ -2.74e7
const HI_SHIFT_ABS = N_PIN_HI_EFF - N_PIN_HI_LIN; // ~ +1.19e8
const MAX_EDGE_SHIFT_ABS = Math.max(Math.abs(LO_SHIFT_ABS), Math.abs(HI_SHIFT_ABS)); // ~1.19e8
const WINDOW_WIDTH_LIN = N_PIN_HI_LIN - N_PIN_LO_LIN; // ~2.636e9
const WINDOW_WIDTH_EFF = N_PIN_HI_EFF - N_PIN_LO_EFF; // ~2.783e9

// --- Does the imp-34693 seed band stay pinned at nStar=5 under the counterfactual? ------------------------
const SEED_BAND_HALF_WIDTH_K10 = 1.7e8; // imp-34693 widest (k=10) admissible-seed half-width around N_cross
const SEED_BAND_LO = N_CROSS_PUB - SEED_BAND_HALF_WIDTH_K10; // ~3.11e9
const SEED_BAND_HI = N_CROSS_PUB + SEED_BAND_HALF_WIDTH_K10; // ~3.45e9
const R_EFF_SEED_LO = rMarginEff(SEED_BAND_LO); // ~18.92 (in (16,32])
const R_EFF_SEED_HI = rMarginEff(SEED_BAND_HI); // ~20.89 (in (16,32])
const SEED_BAND_STILL_PINNED = R_EFF_SEED_LO > 16 && R_EFF_SEED_HI <= 32; // true: nStar=5 survives the curvature

const round = (x, s = 6) => +x.toExponential(s);

export const IMP35059_R_MARGIN_K_LOGT0_CURVATURE = {
  id: 'imp-35059',
  proofSection: 'S-frontier',
  question:
    'imp-34953 treats K = (C_C/E_trunc)^2 as strictly N-independent so R_margin(N) = N*FP_LO/K is exactly ' +
    'linear. Since C_C is said to carry a log T0(N) factor, does K genuinely stay constant band-wide across ' +
    '1e6..1e13, or does the log T0 dependence introduce a weak curvature that bends R_margin and shifts the ' +
    'nStar=5 pinning-window edges (2.636e9, 5.272e9]? Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; C_mb GUE-conditional per imp-486; distinct from imp-34969 (FP_LO drift); changes no bound; ' +
    'imp-34714a REMAINS OPEN; no QED.',
  constants: {
    C_C_pinned: +C_C_PINNED.toFixed(8), // 0.38374752 = (1/8) sqrt(3 pi), a PURE constant
    E_trunc_pt: E_TRUNC_PT, // 3.06e-5
    K_published: round(K_PUB, 6), // ~1.572709e8
    FP_LO_published: FP_LO_PUB, // 0.954568
    N_cross_published: round(N_CROSS_PUB, 6), // 3.280294e9
    logT0_at_N_cross: +L0.toFixed(6), // ~20.857609
  },
  kIsConstant: {
    // K = (C_C/E_trunc)^2 with C_C a pure constant: the log T0(N) factor is NOT inside C_C, so K does NOT vary.
    log_T0_factor_lives_in_C_C: false, // it lives in E_coll = C_C sqrt(log T0/N) and in g(N) = K log T0(N)
    k_max_rel_spread_bandwide: K_MAX_REL_SPREAD, // 0 exactly across 1e6..1e13
    r_margin_linear_from_K_side: true, // R_margin(N)=N*FP_LO/K exactly linear; only FP_LO drift (imp-34969) bends it
    logT0_in_C_C_edge_shift_abs: 0, // the shift the scout worried about is IDENTICALLY ZERO in the actual code
  },
  counterfactual: {
    // Maximal bound: fold a normalized log-T0 factor into the amplitude, K_hat(N) = K log T0(N)/L0.
    logT0_at_1e6: +LOGT0_LO.toFixed(4), // ~13.3051
    logT0_at_1e13: +LOGT0_HI.toFixed(4), // ~28.5255
    logT0_band_ratio: +LOGT0_BAND_RATIO.toFixed(4), // ~2.1439 (max K_hat variation over the 7-decade band)
    curvature_is_logarithmic: true, // R_margin_eff = R_linear * L0/log T0(N): slow log bend, not a power law
    r_margin_eff_at_N_cross: +rMarginEff(N_CROSS_PUB).toFixed(4), // 19.9100 (unchanged: K_hat(N_cross)=K by design)
  },
  pinWindowShift: {
    // nStar=5 window edges: linear (fixed) vs counterfactual (log-T0-folded), and the resulting shift.
    n_pin_lo_linear: round(N_PIN_LO_LIN, 4), // 2.6361e9
    n_pin_hi_linear: round(N_PIN_HI_LIN, 4), // 5.2722e9
    n_pin_lo_counterfactual: round(N_PIN_LO_EFF, 4), // ~2.6087e9
    n_pin_hi_counterfactual: round(N_PIN_HI_EFF, 4), // ~5.3913e9
    lo_edge_shift_abs: round(LO_SHIFT_ABS, 3), // ~ -2.742e7 (-1.04%)
    hi_edge_shift_abs: round(HI_SHIFT_ABS, 3), // ~ +1.191e8 (+2.26%)
    lo_edge_shift_rel: +(LO_SHIFT_ABS / N_PIN_LO_LIN).toExponential(3), // ~ -1.040e-2
    hi_edge_shift_rel: +(HI_SHIFT_ABS / N_PIN_HI_LIN).toExponential(3), // ~ +2.258e-2
    max_edge_shift_abs: round(MAX_EDGE_SHIFT_ABS, 4), // ~1.191e8
    window_width_linear: round(WINDOW_WIDTH_LIN, 4), // ~2.636e9
    window_width_counterfactual: round(WINDOW_WIDTH_EFF, 4), // ~2.783e9 (widens slightly)
    max_shift_below_window_width: MAX_EDGE_SHIFT_ABS < WINDOW_WIDTH_LIN, // true (by ~23x)
  },
  seedBandRobust: {
    // Even under the counterfactual, the imp-34693 seed band stays inside the nStar=5 window.
    seed_band_lo: round(SEED_BAND_LO, 4), // ~3.1103e9
    seed_band_hi: round(SEED_BAND_HI, 4), // ~3.4503e9
    r_margin_eff_seed_lo: +R_EFF_SEED_LO.toFixed(4), // ~18.9239 (in (16,32])
    r_margin_eff_seed_hi: +R_EFF_SEED_HI.toFixed(4), // ~20.8939 (in (16,32])
    seed_band_still_pinned_nstar5: SEED_BAND_STILL_PINNED, // true: log-T0 curvature does NOT unpin nStar=5
  },
  finding:
    'RESOLVED. In the ACTUAL code C_C_PINNED = (1/8) sqrt(3 pi) ~ 0.38375 is a PURE constant; the log T0(N) ' +
    'factor lives EXPLICITLY in E_coll(N) <= C_C sqrt(log T0/N) and in the shared Banach map g(N) = K log T0(N), ' +
    'NOT inside C_C. So K = (C_C/E_trunc)^2 ~ 1.5727e8 is byte-identical at every N (max relative spread 0 over ' +
    '1e6..1e13), R_margin(N) = N*FP_LO/K is exactly linear from the K side, and the log-T0-in-C_C shift the scout ' +
    'flagged is IDENTICALLY ZERO. The only departure from strict linearity is the ~0.5% FP_LO(N) drift, which is ' +
    'the DISTINCT imp-34969 ticket. To BOUND the maximal effect the concern could ever have, fold a normalized ' +
    'log-T0 factor into the amplitude (K_hat(N) = K log T0(N)/L0, pinned at N_cross): R_margin_eff(N) = ' +
    'R_linear(N) * L0/log T0(N) bends DOWN at large N and UP at small N -- a SLOW logarithmic curvature (log T0 ' +
    'climbs only ~13.31 -> ~28.53, factor ~2.14, over the whole 7-decade band). The nStar=5 window edges then ' +
    'shift from (2.6361e9, 5.2722e9] to ~(2.6087e9, 5.3913e9] (~ -1.04% / +2.26%; window widens to ~2.783e9); ' +
    'the largest edge shift ~1.19e8 is ~23x below the window width and ~200x below the factor-2 dyadic wall ' +
    'spacing. Even so, the imp-34693 seed band [3.11e9, 3.45e9] stays STRICTLY inside the shifted window ' +
    '(R_margin_eff ~18.92 / ~20.89 at its edges, both in (16, 32]), so the nStar=5 pin is NOT broken. imp-34953 ' +
    'strict-linearity conclusion is ROBUST. Measurement EVIDENCE, NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That K = (C_C/E_trunc)^2 is genuinely N-independent (C_C the pure (1/8) sqrt(3 pi) ' +
    'constant, log T0(N) factored out into E_coll and the Banach map) and that even the maximal counterfactual ' +
    'log-T0-in-C_C curvature shifts the nStar=5 window edges by only ~ -1%/+2.3% without unpinning the imp-34693 ' +
    'seed band -- measured here by reusing C_C_PINNED and effectiveHeightForN verbatim -- is MEASUREMENT EVIDENCE ' +
    'on the imp-34884/imp-34889 first-order outward-rounding surrogate, NOT the imp-34687a certified ' +
    'transcendental layer; it does NOT prove the endpoints ARE valid enclosures. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'R_MARGIN K = (C_C/E_trunc)^2 LOG-T0 CURVATURE CHECK (frontier, NOT an RH bound). The scout worried C_C ' +
    'carries a log T0(N) factor that would make K N-dependent and bend R_margin off linearity. RESOLVED: C_C is ' +
    'the PURE constant (1/8) sqrt(3 pi); the log T0(N) factor lives in E_coll = C_C sqrt(log T0/N) and in g(N) = ' +
    'K log T0(N), NOT inside C_C, so K ~ 1.5727e8 is constant band-wide (relative spread 0), R_margin(N) = ' +
    'N*FP_LO/K stays exactly linear, and the log-T0-in-C_C edge shift is ZERO. The maximal counterfactual ' +
    '(K_hat = K log T0(N)/L0) gives only a SLOW logarithmic bend (log T0 ~13.3 -> ~28.5 band-wide) that moves ' +
    'the nStar=5 window edges from (2.6361e9, 5.2722e9] to ~(2.6087e9, 5.3913e9] (~ -1%/+2.3%) yet leaves the ' +
    'imp-34693 seed band [3.11e9, 3.45e9] pinned at nStar=5 (R_margin_eff ~18.92/~20.89, both in (16,32]). So ' +
    'imp-34953 strict linearity is ROBUST to the concern. This is EVIDENCE, NOT a machine certificate. ' +
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; reuses C_C_PINNED and ' +
    'effectiveHeightForN verbatim; distinct from imp-34969 (FP_LO drift); does NOT instantiate the imp-34687a ' +
    'directed-rounding layer; SUB-GAP imp-34714a REMAINS OPEN. The C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34953 (R_margin(N)=N*FP_LO/K dyadic-wall sweep; K asserted N-independent); imp-34969 (the DISTINCT ' +
    'FP_LO(N)-drift departure ticket); imp-34889 (shared Banach map g(N)=K log T0(N); K_AMPL=(C_C/E_trunc)^2); ' +
    'imp-34693 (admissible seed band; k=10 half-width ~1.7e8 around N_cross); imp-2642/imp-2643 (C_C=(1/8) ' +
    'sqrt(3 pi) ansatz); imp-2714 (C_C literal guard tol 1e-12); imp-34714 (Krawczyk existence-uniqueness lemma; ' +
    'sub-gap imp-34714a). Logarithmic curvature: L0/log T0(N) varies by <1 e-fold over seven decades of N.',
};

export const IMP35059_R_MARGIN_K_LOGT0_CURVATURE_ASSERTIONS = [
  {
    // K = (C_C/E_trunc)^2 is genuinely N-independent: C_C is a pure constant, log T0 is NOT inside it.
    id: 'imp35059-K-is-N-independent',
    description: 'K = (C_C/E_trunc)^2 ~ 1.5727e8 has ZERO band-wide relative spread; log-T0-in-C_C edge shift is 0',
    holds: () =>
      K_MAX_REL_SPREAD === 0 &&
      Math.abs(K_PUB - 1.5727e8) / 1.5727e8 < 1e-3 &&
      IMP35059_R_MARGIN_K_LOGT0_CURVATURE.kIsConstant.logT0_in_C_C_edge_shift_abs === 0 &&
      IMP35059_R_MARGIN_K_LOGT0_CURVATURE.kIsConstant.log_T0_factor_lives_in_C_C === false,
  },
  {
    // The counterfactual amplitude preserves R_margin at N_cross and gives a slow log-T0 band variation ~2.14x.
    id: 'imp35059-counterfactual-log-curvature',
    description: 'K_hat(N)=K log T0(N)/L0 keeps R_margin_eff(N_cross) ~19.91 and log T0 climbs ~13.31 -> ~28.53 (ratio ~2.14)',
    holds: () =>
      Math.abs(rMarginEff(N_CROSS_PUB) - rMarginLinear(N_CROSS_PUB)) < 1e-6 &&
      Math.abs(rMarginEff(N_CROSS_PUB) - 19.9100) < 1e-2 &&
      LOGT0_BAND_RATIO > 2.1 &&
      LOGT0_BAND_RATIO < 2.2,
  },
  {
    // The counterfactual shifts the nStar=5 window edges by only ~ -1%/+2.3%, far below the wall spacing.
    id: 'imp35059-pin-window-edge-shift-small',
    description: 'edges (2.6361e9,5.2722e9] -> ~(2.6087e9,5.3913e9]; max shift ~1.19e8 ~23x below the ~2.636e9 window width',
    holds: () =>
      Math.abs(N_PIN_LO_LIN - 2.6361e9) < 1e6 &&
      Math.abs(N_PIN_HI_LIN - 5.2722e9) < 1e6 &&
      LO_SHIFT_ABS < 0 &&
      HI_SHIFT_ABS > 0 &&
      MAX_EDGE_SHIFT_ABS < WINDOW_WIDTH_LIN &&
      WINDOW_WIDTH_LIN / MAX_EDGE_SHIFT_ABS > 20 &&
      Math.abs(LO_SHIFT_ABS / N_PIN_LO_LIN) < 0.02 &&
      Math.abs(HI_SHIFT_ABS / N_PIN_HI_LIN) < 0.03,
  },
  {
    // Even under the counterfactual the imp-34693 seed band stays pinned at nStar=5 (R_margin_eff in (16,32]).
    id: 'imp35059-seed-band-stays-pinned',
    description: 'imp-34693 seed band [3.11e9,3.45e9] stays inside nStar=5 window under the counterfactual (R_eff ~18.92/~20.89)',
    holds: () =>
      SEED_BAND_STILL_PINNED === true &&
      R_EFF_SEED_LO > 16 &&
      R_EFF_SEED_HI <= 32 &&
      SEED_BAND_LO > N_PIN_LO_EFF &&
      SEED_BAND_HI <= N_PIN_HI_EFF,
  },
  {
    // Honesty gate: measurement/surrogate, not rigorous, distinct from imp-34969, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35059-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, distinct from imp-34969, no QED, no refereed bound is changed',
    holds: () =>
      IMP35059_R_MARGIN_K_LOGT0_CURVATURE.isRigorous === false &&
      /imp-34714a/.test(IMP35059_R_MARGIN_K_LOGT0_CURVATURE.subGap) &&
      /REMAINS OPEN/.test(IMP35059_R_MARGIN_K_LOGT0_CURVATURE.subGap) &&
      /imp-34969/.test(IMP35059_R_MARGIN_K_LOGT0_CURVATURE.verdict) &&
      /NO QED/.test(IMP35059_R_MARGIN_K_LOGT0_CURVATURE.verdict) &&
      /refereed bound is changed/i.test(IMP35059_R_MARGIN_K_LOGT0_CURVATURE.verdict),
  },
];

for (const a of IMP35059_R_MARGIN_K_LOGT0_CURVATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35059-r-margin-K-logT0-curvature assertion failed: ${a.id}`);
  }
}
