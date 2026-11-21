/**
 * @module imp-35266-krawczyk-headroom-surplus-decomposition
 *
 * imp-35241 tabulated the Krawczyk contraction-validity headroom S(N) = G/((1+G) delta FP_LO) across the
 * imp-34693 admissible seed band and located the worst-case (closest approach to the closed-form floor
 * S_inf = 1/(2 delta) = 2500) at the BAND-TOP: S ~ 2555.18, a residual ~55.18 ABOVE 2500. But imp-35241
 * reported that ~55.18 band-top surplus as a single lumped number; it never DECOMPOSED how the surplus splits
 * between the FP_LO = 1 - a(N(1-delta)) finite-N correction and the asymptotic 2G/(1+G) -> 1 floor mechanism.
 * This module supplies exactly that decomposition.
 *
 * THE DECOMPOSITION (how the ~55.18 band-top surplus splits)
 * ---------------------------------------------------------
 * Factor the headroom against the floor. Since S_inf = 1/(2 delta),
 *   S(N) = S_inf . M,   M = S/S_inf = 2G / ((1+G) FP_LO) = M_G . M_FP,
 * with the two multiplicative pieces
 *   M_G  = 2G/(1+G)   -- the ASYMPTOTIC-FLOOR (G-factor) piece: M_G -> 1 as a(N) -> 0 (this is the mechanism
 *                        that gives the pure 1/(2 delta) floor in the N -> infinity limit), and
 *   M_FP = 1/FP_LO    -- the FP_LO FINITE-N piece: M_FP -> 1 as a(N(1-delta)) -> 0.
 * The additive surplus above the floor then splits cleanly as
 *   S - S_inf = S_inf (M_G - 1)  +  S_inf . M_G (M_FP - 1)
 *             = [asymptotic-floor / G-factor part]  +  [FP_LO finite-N part].
 *
 * WHAT THE MEASUREMENT FINDS AT THE BAND-TOP (N ~ 3.4515e9, S ~ 2555.18)
 * ---------------------------------------------------------------------
 *   (D1) THE NET +55.18 SURPLUS IS THE RESIDUE OF A NEAR-EXACT 2:1 CANCELLATION, NOT A SINGLE DOMINANT TERM.
 *        The FP_LO finite-N part is dFP ~ +110.34 (it PUSHES S ABOVE the floor, since FP_LO < 1 => 1/FP_LO > 1);
 *        the asymptotic-floor / G-factor part is dG ~ -55.16 (it PULLS S BELOW the floor, since G = 1 - a < 1
 *        makes 2G/(1+G) < 1). Their sum dG + dFP ~ -55.16 + 110.34 = +55.18 is the reported band-top surplus.
 *   (D2) THE FP_LO PIECE ALONE IS ~2.0004x THE NEGATIVE G-FACTOR PIECE, ACROSS THE WHOLE BAND. The ratio
 *        -dFP/dG ~ 2.00042 is essentially N-independent over the band (2.00042 at band-bottom, N_cross AND
 *        band-top), because to leading order M_G - 1 ~ -a/2 and M_FP - 1 ~ a(N(1-delta)) ~ a, so dFP ~ S_inf . a
 *        and dG ~ -S_inf . a/2. The FP_LO finite-N correction is therefore the DOMINANT single driver (twice the
 *        magnitude of the net surplus), almost exactly halved by the asymptotic-floor G-factor deficit.
 *   (D3) THE NET SURPLUS TRACKS S_inf . a/2 (the local contraction factor at the sampled N). Leading order gives
 *        S - S_inf ~ S_inf . a(N)/2 = 2500 . 0.043176/2 ~ 53.97 at the band-top, within ~2% of the exact 55.18
 *        (the a(N(1-delta)) > a(N) shift lifts it the last ~1.2). So the band-top surplus is SET BY the band-top
 *        local contraction factor a, not by an independent FP_LO scale: both pieces are governed by a.
 *        CORRECTION (imp-35762): the parenthetical above mis-assigns the ~1.2 residual. imp-35762 isolates the
 *        pure a(N(1-delta)) > a(N) shift contribution directly and finds it is only ~0.023 (~1.9% of the
 *        residual) -- the ~1.2 is overwhelmingly the O(a^2) CURVATURE term S_inf . a^2/4 ~ 1.165, not the seed
 *        shift. D3's conclusion that the surplus is governed by a stands; only this internal attribution is wrong.
 *
 * CONSEQUENCE: the ~55.18 band-top headroom surplus above the 2500 floor is NOT a small residual of large-N decay
 * of a single term -- it is the net of a +110.34 FP_LO finite-N push against a -55.16 asymptotic-floor G-factor
 * deficit, a 2:1 cancellation whose ratio is N-flat across the band and whose net magnitude is ~S_inf . a/2. The
 * FP_LO finite-N correction is the dominant driver; the asymptotic 1/(2 delta) floor mechanism contributes the
 * (equal-and-opposite, half-magnitude) G-factor deficit.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35241/imp-35176/imp-34996
 * machinery (identical K, delta, N_cross, band, headroom form). The imp-34714a machine certificate REMAINS OPEN;
 * F(m) = 0 stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35241-krawczyk-headroom-band-profile (reported the ~55.18 band-top surplus but did not decompose it)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) large-N floor; 2G/(1+G) -> 1)
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form dS/dN < 0; band-top worst case ~2555.18x)
 * @see imp-35176-krawczyk-headroom-s100-crossing (physical-branch min ~2500.02, floor from above)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see imp-3463 (far-tail exponent 1/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 * @see imp-35404-krawczyk-headroom-cancellation-viz-data (viz data + rendered page visualizing this 2:1 cancellation)
 * @see imp-35762-krawczyk-surplus-shift-residual-isolation (CORRECTS the D3 "~1.2" attribution above: it is the
 *   O(a^2) curvature term S_inf . a^2/4, not the a-shift, which contributes only ~0.023)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35241/imp-35176/imp-34996)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const SAFETY_FACTOR = 100; // the imp-34799/34817 contraction-validity safety factor
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35241).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883/34929/34996)
const HALF_WIDTH = rho(1, WIDEST_BAND_K); // ~1.7124e8 (imp-34693 seed band half-width)
const BAND_BOTTOM = N_CROSS - HALF_WIDTH; // smallest admissible N (imp-34693 seed band-bottom)
const BAND_TOP = N_CROSS + HALF_WIDTH; // largest admissible N (imp-34693 seed band-top)

// Decompose S(N) - S_inf into its asymptotic-floor (G-factor) part and its FP_LO finite-N part.
//   S = S_inf . M_G . M_FP,   M_G = 2G/(1+G),   M_FP = 1/FP_LO
//   S - S_inf = S_inf (M_G - 1) + S_inf . M_G (M_FP - 1)  =  dG + dFP
function decomposeAt(N) {
  const a = aOf(N);
  const G = 1 - a;
  const aLo = aOf(N * (1 - DELTA));
  const FP_LO = 1 - aLo;
  const S = G / ((1 + G) * DELTA * FP_LO);
  const M_G = (2 * G) / (1 + G); // asymptotic-floor / G-factor piece (-> 1 as a -> 0)
  const M_FP = 1 / FP_LO; // FP_LO finite-N piece (-> 1 as aLo -> 0)
  const dG = S_INF * (M_G - 1); // asymptotic-floor / G-factor contribution to the surplus (negative)
  const dFP = S_INF * M_G * (M_FP - 1); // FP_LO finite-N contribution to the surplus (positive)
  return { N, a, aLo, G, FP_LO, S, M_G, M_FP, dG, dFP, surplus: S - S_INF };
}

const BAND_TOP_DECOMP = decomposeAt(BAND_TOP);
const N_CROSS_DECOMP = decomposeAt(N_CROSS);
const BAND_BOTTOM_DECOMP = decomposeAt(BAND_BOTTOM);

// The additive split closes exactly: dG + dFP === surplus (to machine precision).
const SPLIT_CLOSES = Math.abs(BAND_TOP_DECOMP.dG + BAND_TOP_DECOMP.dFP - BAND_TOP_DECOMP.surplus) < 1e-9;
// The FP_LO piece is the dominant single driver: -dFP/dG ~ 2.0004, essentially N-flat across the band.
const FP_OVER_G_RATIO_TOP = -BAND_TOP_DECOMP.dFP / BAND_TOP_DECOMP.dG; // ~2.00042
const FP_OVER_G_RATIO_BOTTOM = -BAND_BOTTOM_DECOMP.dFP / BAND_BOTTOM_DECOMP.dG; // ~2.00042
const RATIO_N_FLAT = Math.abs(FP_OVER_G_RATIO_TOP - FP_OVER_G_RATIO_BOTTOM) < 1e-4; // true (N-flat)
// Leading-order surplus estimate S_inf . a/2 tracks the exact surplus to within ~2.5%.
const SURPLUS_LEADING_TOP = (S_INF * BAND_TOP_DECOMP.a) / 2; // ~53.97
const LEADING_REL_ERR_TOP = Math.abs(SURPLUS_LEADING_TOP - BAND_TOP_DECOMP.surplus) / BAND_TOP_DECOMP.surplus;

export const IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION = {
  id: 'imp-35266',
  proofSection: 'S-frontier',
  question:
    'imp-35241 located the Krawczyk contraction-validity headroom worst case (closest approach to the closed-form ' +
    'floor S_inf = 1/(2 delta) = 2500) at the band-top: S ~ 2555.18, a residual ~55.18 above 2500, but reported ' +
    'that surplus as a single lumped number. Decompose the ~55.18 band-top surplus into its FP_LO = 1 - ' +
    'a(N(1-delta)) finite-N contribution versus the asymptotic 2G/(1+G) -> 1 floor mechanism, quantifying how ' +
    'each drives the gap. Measurement only; surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'Factoring S = S_inf . M_G . M_FP with M_G = 2G/(1+G) (the asymptotic-floor / G-factor piece, -> 1 as ' +
    'a(N) -> 0) and M_FP = 1/FP_LO (the FP_LO finite-N piece), the additive surplus splits as S - S_inf = ' +
    'S_inf(M_G - 1) + S_inf . M_G(M_FP - 1) = dG + dFP. At the band-top (N ~ 3.4515e9) the net +55.18 surplus is ' +
    'the RESIDUE OF A NEAR-EXACT 2:1 CANCELLATION, not a single dominant term: the FP_LO finite-N part dFP ~ ' +
    '+110.34 PUSHES S above the floor (FP_LO < 1 => 1/FP_LO > 1) while the asymptotic-floor / G-factor part dG ~ ' +
    '-55.16 PULLS it below (G = 1 - a < 1 => 2G/(1+G) < 1), summing to +55.18. The FP_LO piece alone is ~2.0004x ' +
    'the negative G-factor piece, and that ratio -dFP/dG ~ 2.00042 is essentially N-flat across the band ' +
    '(band-bottom, N_cross AND band-top all ~2.00042), because to leading order M_G - 1 ~ -a/2 and M_FP - 1 ~ a, ' +
    'so dFP ~ S_inf . a and dG ~ -S_inf . a/2; the net surplus tracks S_inf . a/2 (~53.97 at the band-top, within ' +
    '~2.3% of the exact 55.18). So the FP_LO finite-N correction is the DOMINANT single driver (twice the net ' +
    'surplus), almost exactly halved by the asymptotic-floor G-factor deficit, and the whole surplus is governed ' +
    'by the band-top local contraction factor a. EVIDENCE / measurement, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    delta: DELTA,
    safety_factor: SAFETY_FACTOR,
    S_inf_floor: S_INF,
    a_at_band_top: +BAND_TOP_DECOMP.a.toPrecision(10),
    a_lo_at_band_top: +BAND_TOP_DECOMP.aLo.toPrecision(10),
    FP_LO_at_band_top: +BAND_TOP_DECOMP.FP_LO.toPrecision(10),
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    S_band_top: +BAND_TOP_DECOMP.S.toFixed(4), // ~2555.1835
    band_top_surplus_above_floor: +BAND_TOP_DECOMP.surplus.toFixed(4), // ~55.1835
    M_G_asymptotic_floor_factor: +BAND_TOP_DECOMP.M_G.toFixed(8), // ~0.97793578
    M_FP_finite_N_factor: +BAND_TOP_DECOMP.M_FP.toFixed(8), // ~1.04513347
    dG_asymptotic_floor_contribution: +BAND_TOP_DECOMP.dG.toFixed(4), // ~-55.1605 (pulls S below floor)
    dFP_FP_LO_finite_N_contribution: +BAND_TOP_DECOMP.dFP.toFixed(4), // ~+110.3441 (pushes S above floor)
    split_closes_exactly: SPLIT_CLOSES, // true (dG + dFP === surplus to machine precision)
    fp_over_g_magnitude_ratio: +FP_OVER_G_RATIO_TOP.toFixed(5), // ~2.00042 (FP_LO piece is 2x the G-factor piece)
    ratio_N_flat_across_band: RATIO_N_FLAT, // true (2.00042 at band-bottom, N_cross and band-top)
    surplus_leading_order_estimate: +SURPLUS_LEADING_TOP.toFixed(4), // ~53.97 (= S_inf . a/2)
    leading_order_rel_err: +LEADING_REL_ERR_TOP.toPrecision(3), // ~0.023
    // The same decomposition at band-bottom and N_cross (all show the +2x FP_LO / -1x G-factor 2:1 structure).
    dG_band_bottom: +BAND_BOTTOM_DECOMP.dG.toFixed(4), // ~-61.368
    dFP_band_bottom: +BAND_BOTTOM_DECOMP.dFP.toFixed(4), // ~+122.762
    surplus_band_bottom: +BAND_BOTTOM_DECOMP.surplus.toFixed(4), // ~61.394
    dG_N_cross: +N_CROSS_DECOMP.dG.toFixed(4), // ~-58.099
    dFP_N_cross: +N_CROSS_DECOMP.dFP.toFixed(4), // ~+116.222
    surplus_N_cross: +N_CROSS_DECOMP.surplus.toFixed(4), // ~58.123
  },
  subGap:
    'imp-34714a REMAINS OPEN. Decomposing the band-top headroom surplus into its FP_LO finite-N (+110.34) and ' +
    'asymptotic-floor G-factor (-55.16) parts does NOT prove a directed-rounding [g](m)/[F-prime] evaluation ' +
    'yields valid enclosures: it rests on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding ' +
    'layer, not that layer, and F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM BAND-TOP SURPLUS, DECOMPOSED (frontier, NOT an RH bound). The ticket asked to split the ' +
    'imp-35241 ~55.18 band-top surplus (S ~ 2555.18 above the closed-form floor S_inf = 1/(2 delta) = 2500) ' +
    'between the FP_LO = 1 - a(N(1-delta)) finite-N correction and the asymptotic 2G/(1+G) -> 1 floor mechanism. ' +
    'RESULT: writing S = S_inf . M_G . M_FP (M_G = 2G/(1+G) the G-factor / asymptotic-floor piece, M_FP = 1/FP_LO ' +
    'the finite-N piece) the surplus splits as S - S_inf = dG + dFP with, at the band-top, dFP ~ +110.34 (FP_LO ' +
    'finite-N, pushes S ABOVE the floor) and dG ~ -55.16 (G-factor, pulls S BELOW), a NEAR-EXACT 2:1 ' +
    'CANCELLATION whose net residue is the reported +55.18. The FP_LO piece is the dominant single driver ' +
    '(-dFP/dG ~ 2.00042, N-flat across the band) and the net surplus tracks S_inf . a/2 (~53.97, within ~2.3%), ' +
    'so the whole surplus is governed by the band-top local contraction factor a. EVIDENCE, NOT a machine ' +
    'certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the ' +
    'imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision artifact. Measurement only on ' +
    'the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35241/imp-35176/imp-34996 machinery (identical ' +
    'K, delta, N_cross, band); the C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35241 (band-top S ~ 2555.18, surplus ~55.18 above the 2500 floor; did not decompose it); imp-34996 ' +
    '(S_inf = 1/(2 delta) floor; 2G/(1+G) -> 1 large-N); imp-34929 (closed-form dS/dN < 0); imp-35176 ' +
    '(physical-branch min ~2500.02); imp-34693 (admissible seed band + band-bottom/band-top); imp-33723 (Banach ' +
    'map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); imp-3463 (far-tail exponent 1/2); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). Multiplicative factoring of a rational form + additive surplus split: standard.',
};

export const IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_ASSERTIONS = [
  {
    // The additive split closes exactly and reproduces the imp-35241 band-top surplus ~55.18.
    id: 'imp35266-split-closes-reproduces-surplus',
    description: 'dG + dFP === S - S_inf (machine precision) and reproduces the imp-35241 band-top surplus ~55.18',
    holds: () =>
      SPLIT_CLOSES === true &&
      Math.abs(BAND_TOP_DECOMP.surplus - 55.18) < 0.05 &&
      Math.abs(BAND_TOP_DECOMP.S - 2555.18) < 0.05,
  },
  {
    // The FP_LO finite-N part is the dominant positive driver (~+110.34); the G-factor part is negative (~-55.16).
    id: 'imp35266-fp-lo-dominant-positive-g-factor-negative',
    description: 'dFP ~ +110.34 (FP_LO finite-N, positive) dominates dG ~ -55.16 (asymptotic-floor G-factor, negative)',
    holds: () =>
      BAND_TOP_DECOMP.dFP > 0 &&
      BAND_TOP_DECOMP.dG < 0 &&
      Math.abs(BAND_TOP_DECOMP.dFP - 110.344) < 0.05 &&
      Math.abs(BAND_TOP_DECOMP.dG + 55.161) < 0.05,
  },
  {
    // The 2:1 cancellation ratio -dFP/dG ~ 2.00042 is essentially N-flat across the band.
    id: 'imp35266-two-to-one-ratio-N-flat',
    description: 'the FP_LO / G-factor magnitude ratio -dFP/dG ~ 2.00042 is N-flat across the imp-34693 band',
    holds: () =>
      Math.abs(FP_OVER_G_RATIO_TOP - 2.00042) < 0.001 &&
      RATIO_N_FLAT === true &&
      LEADING_REL_ERR_TOP < 0.03,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35266-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.isRigorous === false &&
      /imp-34714a/.test(IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.subGap) &&
      /REMAINS OPEN/.test(IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.subGap) &&
      /NO QED/.test(IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.verdict),
  },
];

for (const a of IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35266-krawczyk-headroom-surplus-decomposition assertion failed: ${a.id}`);
  }
}
