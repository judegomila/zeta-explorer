/**
 * @module imp-34889-forward-breach-band-uniformity
 *
 * imp-34889 (numerical, frontier): imp-34865 MEASURED the forward-propagation-vs-contraction width ratio
 * for [T0] and the forward-route (H2)-margin crossing at the SINGLE point N_cross (forward doubles per Newton
 * step, reaches ~80% of the (H2) margin over the ~4-step op-DAG, crosses at step ~5; contraction collapses
 * ~12.5 orders below). imp-34861 separately showed the contraction gap G(N) drifts across the imp-34693
 * admissible seed band |N_0 - N_cross| < rho(1,k). Left OPEN: is the imp-34865 forward crossing a property of
 * the WHOLE admissible band, or an artifact of freezing the measurement at N_cross? This module combines the
 * imp-34865 forward-vs-contraction directed-rounding surrogate with the imp-34861 band-sensitivity sweep --
 * re-instantiating BOTH routes at a ladder of band points N = N_cross +/- rho(1,k), k in {0,5,10} -- and
 * reports whether the forward route crosses the (H2) margin BAND-WIDE, only near the band edges, or nowhere.
 * FEASIBILITY / MEASUREMENT ONLY; reuses the imp-34865 surrogate and imp-34693 band literals VERBATIM; does
 * NOT instantiate the imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN; NO QED.
 *
 * THE SWEEP SETUP (imp-34865 routes evaluated at each imp-34693 band point)
 * ------------------------------------------------------------------------
 * At a band point N the seed is the (H2) bracket [T0(N)](1 +/- delta) (delta = 2e-4) transported to T-space,
 * and the RvM-inverse Newton target is M = N. Both routes are seeded identically:
 *   FORWARD: the effectiveHeightForN recurrence a=[T]/2pi, u=log(a), f=a*(u-1)-N, fp=u/2pi, dT=f/fp,
 *     [T]=[T]-dT run as a forward interval evaluation for NEWTON_STEPS+3 steps. Interval subtraction adds
 *     widths and near the fixed point w(dT) ~ w([T]), so the enclosure width DOUBLES per step (imp-34865).
 *   CONTRACTION: the interval-Newton operator N([T]) = m - [f](m)/[f_prime]([T]) intersect [T] with m a
 *     POINT (imp-34687: f monotone+convex => verified contraction), width set by the final step.
 * The forward image half-width after n steps is toImageHalfWidth(w_T) = (K (w_T/2)/T0(N))/FP_LO(N), and the
 * (H2) margin at the band point is delta*N. The band point crosses at the first step whose image half-width
 * exceeds delta*N.
 *
 * WHY THE CROSSING IS BAND-INVARIANT (the T0(N) and delta*N scalings both cancel)
 * ----------------------------------------------------------------------------
 * The seed T-width is 2 delta T0(N), so the SEED image half-width is
 *   toImageHalfWidth(2 delta T0(N)) = (K (delta T0(N))/T0(N))/FP_LO(N) = K delta / FP_LO(N),
 * INDEPENDENT of T0(N) -- the RvM-inverse height cancels, leaving only the weak FP_LO(N) drift (imp-34861:
 * ~0.5% over the widest band). The forward image half-width after n doublings is (K delta / FP_LO) 2^n, and
 * the margin is delta*N, so the crossing condition (K delta / FP_LO) 2^n > delta N reduces to
 *   2^n > (K / FP_LO) / N,
 * i.e. the delta cancels entirely and only the ratio (K/FP_LO)/N enters. Over the widest imp-34693 k=10 band
 * N moves only +-5.2% and FP_LO only ~0.5%, so the right-hand side moves ~+-5% -- far too little to shift the
 * INTEGER crossing step 2^n > ~20 off n = 5 (2^5 = 32 > 20 > 16 = 2^4). Likewise the forward/contraction width
 * RATIO ~ (32 delta T0)/(c T0 eps) cancels T0, so it too is band-invariant (~2.56e12).
 *
 * MEASUREMENT (imp-34693 band, k in {0,5,10}, lower/center/upper edges)
 * --------------------------------------------------------------------
 *   band point                 crossing step   fwd/contraction ratio   4-step image / (H2) margin
 *   k=0/5 (all, ~ON N_cross)   5             ~2.56e12                ~0.804
 *   k=10 lower edge (3.109e9)  5             ~2.92e12                ~0.850  (smallest N => smallest margin)
 *   k=10 center  (3.280e9)     5             ~2.56e12                ~0.804
 *   k=10 upper edge (3.452e9)  5             ~2.69e12                ~0.762  (largest N => largest margin)
 * READING: across the ENTIRE admissible seed band -- out to the widest k=10 rung (+-5.2% of N_cross, far
 * wider than any Picard iteration needs) -- the forward route crosses the (H2) margin at step 5 at EVERY
 * sampled point (crossing step is exactly 5 band-wide). The 4-step-chain image half-width is always ~76-85% of
 * the margin (always < 1 at four steps, always > 1 at five), and the worst (highest) fraction is at the LOWER
 * band edge, where the margin delta*N is smallest; even there the crossing step is still 5, not 4. The
 * forward/contraction width ratio stays ~2.56e12-2.92e12 (T0 cancels). So the imp-34865 conclusion at N_cross
 * -- forward propagation compounds and crosses, contraction does not -- is UNIFORM across the whole
 * admissible band, NOT an artifact of freezing the measurement at the single point N_cross.
 *
 * WHAT STAYS OPEN
 * --------------
 * SENSITIVITY / MEASUREMENT only on the inherited imp-3220/imp-3406 surrogate crossover map, in a first-order
 * outward-rounding surrogate (NOT the imp-34687a certified transcendental layer). It confirms the imp-34865
 * forward crossing is band-wide but does NOT instantiate the directed-rounding layer and does NOT discharge the
 * conditional. imp-34714a REMAINS OPEN. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34865-forward-vs-contraction-width-inflation (the single-point N_cross forward-vs-contraction measurement this sweeps)
 * @see imp-34861-krawczyk-crosscheck-band-sensitivity (the imp-34693 band-sweep pattern reused here)
 * @see imp-34693-crossover-contraction-seed-band (the admissible seed band rho(1,k) = (1-L)/[(1-L_c) L^k])
 * @see imp-34884-forward-op-depth-breach (localises the imp-34865 crossing to op-DAG depth d*=8 at N_cross)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (the (H2)-margin ceiling)
 * @see imp-34687 (f monotone+convex => inner interval-Newton is a verified contraction; sub-gap imp-34687a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the Newton loop replicated here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION } from './imp-34865-forward-vs-contraction-width-inflation.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 (directed-rounding unit roundoff upper bound)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34865/imp-34799/imp-34693)
const DELTA = 2e-4; // same FIXED relative bracket half-width as imp-34865/imp-34774/imp-34799

// The shared imp-33723/imp-34865 Banach map g(N) = K log T0(N) and its closed-form derivative (VERBATIM).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const L_CONTRACTION = gPrime(1e9); // ~0.148483 (imp-34693 L, band-growth rate 1/L)
const L_AT_CROSS = gPrime(N_CROSS); // ~0.045423 (imp-34693 L_c)
// imp-34693 admissible seed-band half-width (VERBATIM): rho(tol,k) = tol (1-L)/[(1-L_c) L^k].
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

// --- imp-34865 directed-rounding SURROGATE interval arithmetic (outward round by one relative EPS per op) --
// NOT the imp-34687a certified layer: a first-order outward-rounding surrogate to MEASURE width propagation.
const TINY = Number.MIN_VALUE;
const rd = (x) => (x > 0 ? x * (1 - EPS) : x * (1 + EPS)) - TINY; // round toward -inf
const ru = (x) => (x > 0 ? x * (1 + EPS) : x * (1 - EPS)) + TINY; // round toward +inf
const out = (lo, hi) => ({ lo: rd(lo), hi: ru(hi) });
const iw = (A) => A.hi - A.lo; // interval width
const imid = (A) => 0.5 * (A.lo + A.hi);
const thin = (x) => out(x, x);
const iscal = (A, c) => (c >= 0 ? out(A.lo * c, A.hi * c) : out(A.hi * c, A.lo * c));
const isub = (A, B) => out(A.lo - B.hi, A.hi - B.lo); // interval subtraction: widths ADD
const isubc = (A, c) => out(A.lo - c, A.hi - c);
const imul = (A, B) => {
  const p = [A.lo * B.lo, A.lo * B.hi, A.hi * B.lo, A.hi * B.hi];
  return out(Math.min(...p), Math.max(...p));
};
const idiv = (A, B) => {
  const p = [A.lo / B.lo, A.lo / B.hi, A.hi / B.lo, A.hi / B.hi];
  return out(Math.min(...p), Math.max(...p));
};
const ilog = (A) => out(Math.log(A.lo), Math.log(A.hi)); // log monotone increasing

const NEWTON_STEPS = 4; // the op-DAG Newton-step count imp-34840/imp-34865 read live from the source

// --- imp-34865 FORWARD + CONTRACTION routes, generalised to an arbitrary band point N ---------------------
function forwardWidths(T0, M, steps) {
  let T = out(T0 * (1 - DELTA), T0 * (1 + DELTA)); // (H2) bracket transported to T-space
  const rows = [{ step: 0, wT: iw(T) }];
  for (let i = 0; i < steps; i++) {
    const a = iscal(T, 1 / TWO_PI);
    const u = ilog(a);
    const f = isub(imul(a, isubc(u, 1)), thin(M));
    const fp = iscal(u, 1 / TWO_PI);
    const dT = idiv(f, fp);
    T = isub(T, dT);
    rows.push({ step: i + 1, wT: iw(T) });
    if (!Number.isFinite(iw(T))) break;
  }
  return rows;
}
function contractionWidth(T0, M) {
  let T = out(T0 * (1 - DELTA), T0 * (1 + DELTA)); // same seed bracket
  let wLast = iw(T);
  for (let i = 0; i < 12; i++) {
    const m = imid(T);
    const am = m / TWO_PI;
    const fm = isubc(imul(thin(am), isubc(ilog(thin(am)), 1)), M); // [f](m): POINT residual
    const fpI = iscal(ilog(iscal(T, 1 / TWO_PI)), 1 / TWO_PI); // [f_prime]([T])
    const Nop = isub(thin(m), idiv(fm, fpI));
    const lo = Math.max(T.lo, Nop.lo);
    const hi = Math.min(T.hi, Nop.hi);
    if (lo > hi) break;
    const wNew = hi - lo;
    T = { lo, hi };
    if (wNew >= wLast * (1 - 1e-15)) {
      wLast = wNew;
      break;
    }
    wLast = wNew;
  }
  return wLast;
}

// The imp-34865 forward-vs-contraction measurement re-run at a band point N.
function measureAt(N) {
  const T0 = effectiveHeightForN(N);
  const M = N; // RvM-inverse Newton target at the band point
  const FP_LO = 1 - Math.abs(gPrime(N * (1 - DELTA))); // imp-34865 Krawczyk quotient denominator floor at N
  const margin = DELTA * N; // (H2) margin each side at the band point (imp-34865: delta*N)
  const toImageHalfWidth = (wT) => (K_AMPL * (wT / 2) / T0) / FP_LO;
  const rows = forwardWidths(T0, M, NEWTON_STEPS + 3);
  const fwdWidthAtChain = rows[NEWTON_STEPS].wT; // forward width after the ~4-step op-DAG
  const conWidth = contractionWidth(T0, M);
  const widthRatio = fwdWidthAtChain / conWidth;
  const fwdImageAtChain = toImageHalfWidth(fwdWidthAtChain);
  const ratioToMargin = fwdImageAtChain / margin; // fraction of the (H2) margin consumed at 4 steps
  let breachStep = -1;
  for (const r of rows) {
    if (toImageHalfWidth(r.wT) > margin) {
      breachStep = r.step;
      break;
    }
  }
  return {
    N,
    T0,
    FP_LO,
    margin,
    seedImageHalfWidth: toImageHalfWidth(rows[0].wT), // ~ K delta / FP_LO, T0-independent
    fwdWidthAtChain,
    conWidth,
    widthRatio,
    ratioToMargin,
    breachStep,
    breaches: breachStep > 0,
  };
}

// Sweep the imp-34693 seed band at k = 0, 5, 10 (rho widens by 1/L per rung; only k=10 moves N visibly).
const K_GRID = [0, 5, 10];
const bandTable = K_GRID.map((k) => {
  const r = rho(1, k);
  const lo = measureAt(N_CROSS - r);
  const hi = measureAt(N_CROSS + r);
  return {
    k,
    rho_half_width: +r.toExponential(4),
    band_frac_of_N_cross: +(r / N_CROSS).toExponential(3),
    breach_step_lo: lo.breachStep,
    breach_step_hi: hi.breachStep,
    width_ratio_lo: +lo.widthRatio.toExponential(4),
    width_ratio_hi: +hi.widthRatio.toExponential(4),
    four_step_ratio_to_margin_lo: +lo.ratioToMargin.toFixed(4),
    four_step_ratio_to_margin_hi: +hi.ratioToMargin.toFixed(4),
  };
});

const CENTER = measureAt(N_CROSS);

// Widest rung k=10: the only band that moves N/FP_LO visibly (imp-34861: ~5.2% of N_cross).
const R10 = rho(1, 10);
const LO10 = measureAt(N_CROSS - R10);
const HI10 = measureAt(N_CROSS + R10);

// Aggregate the crossing step and the ratios across ALL sampled band points.
const ALL = [CENTER, LO10, HI10, ...K_GRID.flatMap((k) => [measureAt(N_CROSS - rho(1, k)), measureAt(N_CROSS + rho(1, k))])];
const BREACH_STEPS = ALL.map((m) => m.breachStep);
const BREACH_MIN = Math.min(...BREACH_STEPS);
const BREACH_MAX = Math.max(...BREACH_STEPS);
const BREACHES_BAND_WIDE = ALL.every((m) => m.breaches);
const RATIO_MIN = Math.min(...ALL.map((m) => m.widthRatio));
const RATIO_MAX = Math.max(...ALL.map((m) => m.widthRatio));
const R2M_MIN = Math.min(...ALL.map((m) => m.ratioToMargin)); // upper band edge (largest margin)
const R2M_MAX = Math.max(...ALL.map((m) => m.ratioToMargin)); // lower band edge (smallest margin)

// The seed image half-width is T0-independent (K delta / FP_LO); its band spread is only the FP_LO drift.
const SEED_IMG_SPREAD = Math.abs(HI10.seedImageHalfWidth - LO10.seedImageHalfWidth) / CENTER.seedImageHalfWidth;
const WIDTH_RATIO_SPREAD = Math.abs(HI10.widthRatio - LO10.widthRatio) / CENTER.widthRatio;

// Cross-check the recomputed center against the published imp-34865 single-point (N_cross) literals.
const A65 = IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION;
const RATIO_PUBLISHED = A65.measured.forward_over_contraction_width_ratio; // ~2.559e12
const BREACH_STEP_PUBLISHED = A65.measured.forward_breach_step; // 5

export const IMP34889_FORWARD_BREACH_BAND_UNIFORMITY = {
  id: 'imp-34889',
  proofSection: 'S-frontier',
  question:
    'imp-34865 measured the forward-propagation-vs-contraction [T0] width ratio and the forward-route (H2)-' +
    'margin crossing at the SINGLE point N_cross; imp-34861 showed the contraction gap G(N) drifts across the ' +
    'imp-34693 admissible seed band |N_0 - N_cross| < rho(1,k). Combine the imp-34865 directed-rounding ' +
    'surrogate with the imp-34861 band sweep: re-instantiate BOTH routes at a ladder of band points ' +
    'N = N_cross +/- rho(1,k) and report whether the forward route crosses the (H2) margin BAND-WIDE, only ' +
    'near the band edges, or nowhere -- i.e. whether the imp-34865 conclusion at N_cross is representative of ' +
    'the whole admissible band. Feasibility/measurement only; reuses the imp-34865 surrogate and imp-34693 ' +
    'band literals verbatim; does NOT instantiate the imp-34687a layer; imp-34714a REMAINS OPEN; no QED.',
  model: {
    setup:
      'At each band point N the imp-34865 routes are seeded from the (H2) bracket [T0(N)](1 +/- delta) ' +
      '(delta = 2e-4) with RvM-inverse Newton target M = N. FORWARD doubles the enclosure width per step; ' +
      'CONTRACTION (interval-Newton + intersection, imp-34687) sets the width at the final step. The forward ' +
      'image half-width after n steps is (K (w_T/2)/T0(N))/FP_LO(N) and the (H2) margin is delta*N; the ' +
      'band point crosses at the first step whose image half-width exceeds delta*N.',
    bandInvariance:
      'The SEED image half-width toImageHalfWidth(2 delta T0(N)) = K delta / FP_LO(N) is T0(N)-INDEPENDENT, ' +
      'so the crossing condition (K delta / FP_LO) 2^n > delta N reduces to 2^n > (K/FP_LO)/N -- delta cancels. ' +
      'Over the widest imp-34693 k=10 band N moves +-5.2% and FP_LO ~0.5%, far too little to shift the ' +
      'integer crossing step 2^n > ~20 off n = 5. The forward/contraction width ratio ~ (32 delta T0)/(c T0 eps) ' +
      'cancels T0, so it too is band-invariant (~2.56e12).',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    L_contraction: +L_CONTRACTION.toExponential(6), // ~1.484829e-1
    L_at_cross: +L_AT_CROSS.toExponential(6), // ~4.542338e-2
    K: +K_AMPL.toExponential(4), // ~1.5727e8
    delta: +DELTA.toExponential(1), // 2e-4
    newton_steps: NEWTON_STEPS, // 4 (op-DAG chain length)
    widest_band_k: 10,
    widest_band_half_width: +R10.toExponential(4), // ~1.7124e8
    widest_band_frac_of_N_cross: +(R10 / N_CROSS).toExponential(3), // ~5.2e-2
  },
  bandTable, // crossing step, forward/contraction ratio and 4-step image/(H2)-margin fraction at each band edge
  measured: {
    breach_step_band_min: BREACH_MIN, // 5
    breach_step_band_max: BREACH_MAX, // 5
    forward_breaches_band_wide: BREACHES_BAND_WIDE, // true (every sampled band point)
    width_ratio_band_min: +RATIO_MIN.toExponential(4), // ~2.559e12
    width_ratio_band_max: +RATIO_MAX.toExponential(4), // ~2.919e12
    four_step_ratio_to_margin_band_min: +R2M_MIN.toFixed(4), // ~0.7620 (upper edge, largest margin)
    four_step_ratio_to_margin_band_max: +R2M_MAX.toFixed(4), // ~0.8502 (lower edge, smallest margin)
    seed_image_half_width_center: +CENTER.seedImageHalfWidth.toExponential(4), // ~3.295e4 (K delta / FP_LO)
    seed_image_half_width_rel_spread_k10: +SEED_IMG_SPREAD.toExponential(3), // ~5e-3 (FP_LO drift only)
    width_ratio_rel_spread_k10: +WIDTH_RATIO_SPREAD.toExponential(3), // ~0.14 (contraction-floor ULP granularity)
  },
  crosscheck: {
    center_width_ratio_matches_imp34865: Math.abs(CENTER.widthRatio / RATIO_PUBLISHED - 1) < 5e-2,
    center_breach_step_matches_imp34865: CENTER.breachStep === BREACH_STEP_PUBLISHED,
    width_ratio_published_imp34865: RATIO_PUBLISHED, // ~2.559e12
    breach_step_published_imp34865: BREACH_STEP_PUBLISHED, // 5
  },
  finding:
    'Re-instantiating BOTH imp-34865 routes at a ladder of imp-34693 band points N = N_cross +/- rho(1,k) ' +
    '(k in {0,5,10}) shows the imp-34865 forward crossing is a property of the WHOLE admissible seed band, not ' +
    'an artifact of freezing the measurement at N_cross. At every sampled point -- out to the widest k=10 ' +
    'rung (+-5.2% of N_cross, far wider than any Picard iteration needs) -- the forward route crosses the ' +
    '(H2) margin at step 5 (crossing step is exactly 5 band-wide) while the contraction route never crosses. ' +
    'The 4-step-chain image half-width is always ~76-85% of the margin delta*N (< 1 at four steps, > 1 at ' +
    'five); the worst (highest) fraction ~0.85 is at the LOWER band edge, where delta*N is smallest, yet the ' +
    'crossing step is still 5 there. This is structural: the SEED image half-width K delta / FP_LO is ' +
    'T0(N)-independent, so the crossing condition reduces to 2^n > (K/FP_LO)/N in which delta cancels, and the ' +
    'right-hand side ~20 moves only ~+-5% over the widest band -- too little to shift the integer crossing step ' +
    'off n = 5. The forward/contraction width ratio stays ~2.56e12-2.92e12 (T0 cancels; the ~14% spread is ' +
    'the discrete ULP granularity of the contraction floor). So the imp-34865 conclusion at N_cross -- forward ' +
    'propagation compounds and crosses, the contraction route clears by ~12.5 orders -- is UNIFORM across ' +
    'the admissible band. EVIDENCE the two routes behave band-wide as at N_cross, NOT a machine certificate; ' +
    'imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That the forward route crosses the (H2) margin at step 5 and the ' +
    'forward/contraction width ratio stays ~2.56e12-2.92e12 at EVERY imp-34693 band point is EVIDENCE the ' +
    'imp-34865 single-point measurement is representative of the whole admissible band; it does NOT ' +
    'instantiate the imp-34687a certified transcendental layer (the outward-rounding here is a first-order ' +
    'surrogate) and does NOT prove the endpoints ARE valid enclosures. Feasibility EVIDENCE, not a ' +
    'certificate. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'FORWARD-BREACH BAND-UNIFORMITY (frontier, NOT an RH bound). imp-34865 measured the forward-vs-' +
    'contraction [T0] width ratio and the forward (H2)-margin crossing at the SINGLE point N_cross; this module ' +
    'combines that directed-rounding surrogate with the imp-34861 band sweep and re-instantiates both routes ' +
    'at N = N_cross +/- rho(1,k) (imp-34693 admissible band, k in {0,5,10}). RESULT: the forward route ' +
    'crosses the (H2) margin at step 5 at EVERY sampled band point -- out to the widest k=10 rung (+-5.2% of ' +
    'N_cross) -- while the contraction route never crosses; the 4-step image half-width is ~76-85% of the ' +
    'margin (worst ~0.85 at the lower edge where delta*N is smallest, still crossing only at step 5). The ' +
    'crossing is band-invariant because the SEED image half-width K delta / FP_LO is T0(N)-independent, so the ' +
    'crossing condition reduces to 2^n > (K/FP_LO)/N (delta cancels) whose RHS ~20 moves only ~+-5% over the ' +
    'widest band -- too little to shift the integer crossing step off n = 5. The forward/contraction width ' +
    'ratio stays ~2.56e12-2.92e12 (T0 cancels). So the imp-34865 conclusion at N_cross is REPRESENTATIVE of ' +
    'the whole admissible seed band: forward propagation crosses BAND-WIDE, not only near the edges and not ' +
    'nowhere. This is EVIDENCE, NOT a machine certificate. FEASIBILITY / MEASUREMENT ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; reuses the imp-34865 surrogate and imp-34693 band literals ' +
    'verbatim; does NOT instantiate the imp-34687a directed-rounding layer; SUB-GAP imp-34714a REMAINS OPEN. ' +
    'The C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34865 (forward-vs-contraction width inflation at N_cross; the surrogate + routes reused here); ' +
    'imp-34861 (imp-34693 band-sensitivity sweep pattern); imp-34693 (admissible seed band rho(1,k) = ' +
    '(1-L)/[(1-L_c) L^k]); imp-34884 (op-DAG depth crossing d*=8 at N_cross); imp-34799 ((H2)-margin ceiling); ' +
    'imp-34687 (f monotone+convex => inner interval-Newton is a verified contraction; sub-gap imp-34687a); ' +
    'imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); imp-33723 (Banach map ' +
    'g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN Newton ' +
    'loop). Interval subtraction adds widths; forward interval-Newton diverges without the Krawczyk form: ' +
    'Moore, Neumaier, Higham.',
};

export const IMP34889_FORWARD_BREACH_BAND_UNIFORMITY_ASSERTIONS = [
  {
    // The forward route crosses the (H2) margin at step 5 at EVERY sampled band point (band-wide, uniform).
    id: 'imp34889-forward-breaches-band-wide-step-5',
    description: 'forward route crosses the (H2) margin at step 5 at every band point (crossing step exactly 5 band-wide)',
    holds: () => BREACHES_BAND_WIDE === true && BREACH_MIN === 5 && BREACH_MAX === 5,
  },
  {
    // The 4-step-chain image half-width is always in (0.7, 0.9) of the margin -- < 1 at four steps everywhere.
    id: 'imp34889-four-step-fraction-under-one-band-wide',
    description: 'the 4-step image half-width is ~76-85% of the (H2) margin at every band point (< 1 at four steps, crossing at five)',
    holds: () => R2M_MIN > 0.7 && R2M_MAX < 0.9 && R2M_MAX > R2M_MIN,
  },
  {
    // The forward/contraction width ratio stays band-invariant (T0 cancels): ~2.56e12-2.92e12 everywhere.
    id: 'imp34889-width-ratio-band-invariant',
    description: 'forward/contraction [T0] width ratio stays ~2.56e12-2.92e12 across the whole band (T0 cancels)',
    holds: () =>
      RATIO_MIN > 2e12 &&
      RATIO_MAX < 3.5e12 &&
      WIDTH_RATIO_SPREAD < 0.2 &&
      SEED_IMG_SPREAD < 1e-2, // seed image half-width K delta / FP_LO is T0-independent (FP_LO drift only)
  },
  {
    // The recomputed band center matches the published imp-34865 single-point (N_cross) literals.
    id: 'imp34889-center-matches-published-imp34865',
    description: 'recomputed center forward/contraction ratio and crossing step agree with the published imp-34865 literals',
    holds: () =>
      Math.abs(CENTER.widthRatio / RATIO_PUBLISHED - 1) < 5e-2 &&
      CENTER.breachStep === BREACH_STEP_PUBLISHED &&
      BREACH_STEP_PUBLISHED === 5,
  },
  {
    // Honesty gate: measurement/surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34889-honesty-gate-no-qed',
    description: 'band-uniformity measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34889_FORWARD_BREACH_BAND_UNIFORMITY.isRigorous === false &&
      /imp-34714a/.test(IMP34889_FORWARD_BREACH_BAND_UNIFORMITY.subGap) &&
      /REMAINS OPEN/.test(IMP34889_FORWARD_BREACH_BAND_UNIFORMITY.subGap) &&
      /NO QED/.test(IMP34889_FORWARD_BREACH_BAND_UNIFORMITY.verdict) &&
      /refereed bound is changed/i.test(IMP34889_FORWARD_BREACH_BAND_UNIFORMITY.verdict),
  },
];

for (const a of IMP34889_FORWARD_BREACH_BAND_UNIFORMITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34889-forward-breach-band-uniformity assertion failed: ${a.id}`);
  }
}
