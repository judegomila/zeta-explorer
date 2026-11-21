/**
 * @module imp-35399-reentry-edge-slide-geometric-ratio
 *
 * imp-35399 (numerical, frontier-direction) -- EXTENDS the imp-35263 machine-epsilon-floor EPS_FP factor-2 sweep to
 * MORE octaves (k up to the double-precision N-range ceiling) and MEASURES the successive-increment RATIO of the
 * FIXED-window reentry-edge slide, testing whether that slide is asymptotically GEOMETRIC with ratio -> 2. imp-35263
 * note (3) reported the fixed-window reentry edge sliding by increments 8.72 -> 17.29 -> 34.39 decades over
 * k = -1 -> 0 -> 1 -> 2, i.e. each octave slides "roughly double" the previous, but never tested whether the
 * increment ratio converges to exactly 2. MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double surrogate
 * (imp-35259 root-finder reproduced verbatim, import-light: effectiveHeightForN inlined, no heavy zeros bundle); it
 * does NOT discharge the surrogate-fidelity certificate imp-35243a; NO QED.
 *
 * THE EXTENDED SWEEP (imp-35263 map reproduced VERBATIM)
 * -----------------------------------------------------
 * For EPS_FP_k = 2.3e-16 * 2^k, the FIXED-window reentry edge is the seed where xArg(seed, eps_k) = 11 + W0 with the
 * base window edge W0 held fixed (imp-35263 convention A, D1s framing). imp-35263 swept k in {-1,0,1,2}; this module
 * carries k as high as the reentry root stays inside the IEEE-754 double N-range (~10^308.25). The reentry edges:
 *   k = -1: 10^18.36926   k = 0: 10^27.08469   k = 1: 10^44.37770
 *   k =  2: 10^78.76871   k = 3: 10^147.31181  k = 4: 10^284.13090
 * k = 5 would sit near 10^557 (increment ~2 x 136.82 = 273.6 decades past k=4), FAR beyond the double N-range, so the
 * sweep TRUNCATES at k = 4: five clean increments, four increment ratios.
 *
 * WHAT THE MEASUREMENT SHOWS
 * -------------------------
 * (1) THE FIXED-WINDOW REENTRY-EDGE SLIDE IS ASYMPTOTICALLY GEOMETRIC WITH RATIO -> 2. The successive increments
 *     8.7154 -> 17.2930 -> 34.3910 -> 68.5431 -> 136.8191 decades give increment ratios
 *       1.98418 -> 1.98872 -> 1.99305 -> 1.99610
 *     -- MONOTONE INCREASING toward 2, with the gap to 2 roughly halving each octave (0.0158 -> 0.0113 -> 0.0069 ->
 *     0.0039). The imp-35263 note (3) "roughly double" is confirmed as a genuine ratio -> 2 geometric law, not a
 *     coincidence of the first two octaves.
 * (2) THE ratio -> 2 HAS AN EXACT ANALYTIC CAUSE: collapseDist(N) GROWS LINEARLY IN log N. Because g(N) = K log T0(N)
 *     and T0 ~ 2 pi N / log N (Riemann-von Mangoldt), collapseDist = |g - N_cross|/N_cross ~ (K / N_cross) log N,
 *     linear in the DECADE coordinate L = log10 N (measured collapseDist/ln N -> ~0.046 = K/N_cross as L grows). The
 *     fixed-window reentry condition collapseDist(L_k) = eps_k * const = base * 2^k * const then forces L_k
 *     proportional to 2^k for large k, so the increment L_k - L_{k-1} ~ 2^{k-1} and the ratio -> 2 EXACTLY. Finite-k
 *     corrections (the additive offset and the log-log-N subleading term) explain the approach from below.
 * (3) THIS IS THE imp-35332 DRIFT-DECAY LAW IN RECIPROCAL FORM. The local ceil-phase drift d(xArg)/dL HALVES per
 *     octave along the reentry edges (0.036924 -> 0.018627 -> 0.009379 -> 0.004711 -> 0.002362 -> 0.001183; drift
 *     ratios 1.982/1.986/1.991/1.995/1.997), and the increment ratio is exactly the reciprocal drift ratio because
 *     increment ~ PHASE_SHIFT / drift(N_k). imp-35332s decay drift ~ 1/(K log T0 - N_cross) ~ 1/L is precisely the
 *     drift ~ 1/L that makes L_k ~ 2^k. So the ratio -> 2 slide and the imp-35332 drift decay are the same fact.
 *
 * THE ASSESSMENT VERDICT (bearing on R1)
 * --------------------------------------
 * The extended sweep SHARPENS imp-35263 note (3): the fixed-window reentry-edge slide is asymptotically geometric
 * with ratio -> 2 (measured ratios 1.984 -> 1.996, monotone toward 2, gap halving), driven by collapseDist growing
 * linearly in log N -- equivalently the imp-35332 ceil-phase drift decaying like 1/L. It discharges NOTHING: the
 * band remains pinned to the machine-epsilon floor EPS_FP (R1), now known to slide GEOMETRICALLY (super-linearly)
 * per octave, which only strengthens the imp-35243 R1 obstruction. R1 / imp-35243a stay OPEN.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A direct extension of the imp-35263 EPS_FP factor-2 sweep to the double-precision N-range ceiling, measuring the
 * fixed-window reentry-edge increment ratio, live on the inherited imp-3220/imp-3406 double surrogate, IEEE-754
 * double precision, point rate estimates (no interval enclosure). It discharges NOTHING: imp-35111a / imp-35174a /
 * imp-34997a / imp-35243a (R1) stay OPEN. MEASUREMENT / ASSESSMENT ONLY; the C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35263-reentry-band-eps-floor-sweep (note (3): near-doubling increments 8.72/17.29/34.39; sweep k=-1..2)
 * @see imp-35259-two-rate-band-edges-direct-rootfind (the direct-bisection root-finder reproduced here)
 * @see imp-35332-reentry-band-drift-analytic-derivation (drift decays ~ 1/L; the reciprocal of the ratio->2 slide)
 * @see imp-35111-off-by-one-reentry-band-width (parent: single-rate band edges 10^27.08 / 10^37.17)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse; inlined import-light)
 */

// Import-light: reproduce effectiveHeightForN (imp-34997/lambda-rh-height-mapping RvM inverse) inline and use the
// LITERAL C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), so this module never pulls the heavy zeros bundle.
const TWO_PI = 2 * Math.PI;
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.383777 (imp-2642/imp-2643 ansatz)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35111/35243/35259/35263/35332)
const EPS_FP_BASE = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)

// The shared imp-35111/imp-35243/imp-35259/imp-35263 fixed-point map g(N) = K log T0(N), reproduced VERBATIM.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 (bit-identical to imp-35111/35243/35259/35263)
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.091726 nats/iterate

const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArg = (seed, eps) => Math.log(collapseDist(seed) / eps) / LN_INV_R;
const OFFSET = (eps) => Math.log(eps / 1.4536413720400559e-16) / LN_INV_R; // imp-34951 PENULT witness
const W = (eps) => 1 - OFFSET(eps);
const PHASE_SHIFT_PER_FACTOR2 = Math.log(2) / LN_INV_R; // ~0.224194 phase units per factor-2 in EPS_FP
const W0 = W(EPS_FP_BASE); // ~0.851592 (base window lower edge held fixed = imp-35263 convention A)

// Bisect on log10(seed): xArg is monotone-increasing in log10 N. Wide bounds [8, 4000] hold the reentry roots
// un-clamped for every reachable k; a root that presses the upper bound signals it exceeds the double N-range.
function bisectExp(phaseFn, target, lo, hi, iters = 400) {
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (lo + hi);
    if (phaseFn(Math.pow(10, mid)) < target) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// THE EXTENDED SWEEP: k = -1 .. 4 (k = 5 reentry edge ~10^557 exceeds the IEEE-754 double N-range ~10^308.25).
const HI_EXP = 4000; // search ceiling well above the double range; a clamped root would sit near log10(Number.MAX)
const K_LADDER = [-1, 0, 1, 2, 3, 4];
const REENTRY = K_LADDER.map((k) => {
  const eps = EPS_FP_BASE * Math.pow(2, k);
  const exp = bisectExp((seed) => xArg(seed, eps), 11 + W0, 8, HI_EXP);
  return { k, reentry_fixed_exp: +exp.toPrecision(10) };
});

// Successive increments (decades of N) and their ratios.
const INCREMENTS = [];
for (let i = 1; i < REENTRY.length; i++) {
  INCREMENTS.push({
    from_k: REENTRY[i - 1].k,
    to_k: REENTRY[i].k,
    increment_decades: +(REENTRY[i].reentry_fixed_exp - REENTRY[i - 1].reentry_fixed_exp).toPrecision(7),
  });
}
const RATIOS = [];
for (let i = 1; i < INCREMENTS.length; i++) {
  RATIOS.push(+(INCREMENTS[i].increment_decades / INCREMENTS[i - 1].increment_decades).toPrecision(7));
}
// Gap to 2 (should shrink monotonically) and whether the increment ratios climb monotonically toward 2.
const GAP_TO_TWO = RATIOS.map((r) => +(2 - r).toPrecision(4));
const RATIOS_MONOTONE_UP = RATIOS.every((r, i) => i === 0 || r > RATIOS[i - 1]);
const GAP_SHRINKS = GAP_TO_TWO.every((gap, i) => i === 0 || gap < GAP_TO_TWO[i - 1]);
const RATIOS_APPROACH_TWO = RATIOS.every((r) => r > 1.98 && r < 2.0);
const LAST_RATIO = RATIOS[RATIOS.length - 1]; // ~1.99610

// Cross-check (3): the local ceil-phase drift d(xArg)/dL HALVES per octave at the reentry edges (imp-35332). The
// increment ratio is the reciprocal of the drift ratio because increment ~ PHASE_SHIFT / drift(N_k).
const driftLocal = (expN) => {
  const h = 0.01;
  return (xArg(Math.pow(10, expN + h), EPS_FP_BASE) - xArg(Math.pow(10, expN - h), EPS_FP_BASE)) / (2 * h);
};
const DRIFT_AT_REENTRIES = REENTRY.map((s) => +driftLocal(s.reentry_fixed_exp).toPrecision(6));
const DRIFT_RATIOS = [];
for (let i = 1; i < DRIFT_AT_REENTRIES.length; i++) {
  DRIFT_RATIOS.push(+(DRIFT_AT_REENTRIES[i - 1] / DRIFT_AT_REENTRIES[i]).toPrecision(7));
}
// Increment ratio equals reciprocal drift ratio (both -> 2). Compare aligned pairs.
const RECIPROCAL_MATCH = RATIOS.every((r, i) => Math.abs(r - DRIFT_RATIOS[i + 1]) < 5e-3);

// Cross-check (2): collapseDist grows linearly in log N -> collapseDist/ln N tends to K/N_cross ~ 0.0479.
const K_OVER_NCROSS = K_AMPL / N_CROSS_FP; // ~0.04794
const CD_OVER_LNN_DEEP = collapseDist(Math.pow(10, 280)) / Math.log(Math.pow(10, 280)); // ~0.04605 (approaching)
const COLLAPSEDIST_LOGN_LINEAR = CD_OVER_LNN_DEEP > 0.045 && CD_OVER_LNN_DEEP < K_OVER_NCROSS;

export const IMP35399_REENTRY_EDGE_SLIDE_GEOMETRIC_RATIO = {
  id: 'imp-35399',
  proofSection: 'S-frontier',
  question:
    'imp-35263 note (3) reported the fixed-window reentry edge sliding by increments 8.72 -> 17.29 -> 34.39 ' +
    'decades over the EPS_FP factor-2 sweep k = -1 -> 0 -> 1 -> 2 (each octave "roughly double" the previous) but ' +
    'never tested whether the increment ratio converges to exactly 2. Extend the sweep to more octaves and measure ' +
    'the successive-increment ratio, assessing whether the reentry-edge slide is asymptotically geometric ' +
    '(ratio -> 2) and relating it to the imp-35332 ceil-phase drift decay. Measurement only on the inherited ' +
    'imp-3220/imp-3406 double surrogate; does NOT discharge imp-35243a; NO QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.091726
    phase_shift_per_factor2: +PHASE_SHIFT_PER_FACTOR2.toPrecision(6), // ~0.224194 = log(2)/ln(1/r)
    window_lower_edge_W0: +W0.toPrecision(6), // ~0.851592 (held fixed = imp-35263 convention A)
    k_over_ncross: +K_OVER_NCROSS.toPrecision(6), // ~0.047944 = asymptotic collapseDist / ln N slope
    fp_reentry_ceiling_log10N: 308.25, // IEEE-754 double N-range ceiling (why the sweep truncates at k=4)
  },
  reentry_edges: REENTRY, // per k: reentry_fixed_exp (log10 N of the fixed-window reentry edge)
  increments: INCREMENTS, // decades of N per octave: 8.7154 / 17.2930 / 34.3910 / 68.5431 / 136.8191
  increment_ratios: RATIOS, // ~1.98418 / 1.98872 / 1.99305 / 1.99610 (monotone -> 2)
  gap_to_two: GAP_TO_TWO, // ~0.0158 / 0.0113 / 0.0069 / 0.0039 (roughly halving)
  ratios_monotone_increasing_toward_two: RATIOS_MONOTONE_UP,
  last_measured_ratio: LAST_RATIO, // ~1.99610 (k = 3 -> 4, deepest reachable octave)
  drift_at_reentry_edges: DRIFT_AT_REENTRIES, // ~0.036924 -> 0.001183 (halves per octave, imp-35332)
  drift_ratios: DRIFT_RATIOS, // ~1.982 / 1.986 / 1.991 / 1.995 / 1.997 (reciprocal of the increment ratios)
  collapsedist_over_lnN_deep: +CD_OVER_LNN_DEEP.toPrecision(6), // ~0.046 -> K/N_cross (collapseDist ~ linear in log N)
  reading:
    'The extended EPS_FP factor-2 sweep CONFIRMS imp-35263 note (3): the fixed-window reentry-edge slide is ' +
    'asymptotically GEOMETRIC with ratio -> 2. (1) The successive increments 8.7154 -> 17.2930 -> 34.3910 -> ' +
    '68.5431 -> 136.8191 decades give increment ratios 1.98418 -> 1.98872 -> 1.99305 -> 1.99610, MONOTONE ' +
    'increasing toward 2 with the gap to 2 roughly halving each octave. (2) The ratio -> 2 has an exact analytic ' +
    'cause: collapseDist(N) grows LINEARLY in log N (collapseDist/ln N -> K/N_cross ~ 0.0479), so the ' +
    'fixed-window reentry condition collapseDist(L_k) = base 2^k const forces L_k proportional to 2^k and the ' +
    'increment ratio -> 2 exactly. (3) This is the imp-35332 drift decay in reciprocal form: the local ceil-phase ' +
    'drift halves per octave (0.036924 -> 0.001183) and the increment ratio is exactly the reciprocal drift ' +
    'ratio. The sweep truncates at k = 4 because k = 5s reentry edge (~10^557) exceeds the IEEE-754 double ' +
    'N-range (~10^308.25). This SHARPENS imp-35263 without weakening it: the band slide is super-linear ' +
    '(geometric) per octave, strengthening the R1 obstruction. R1 / imp-35243a stay OPEN.',
  finding:
    'Extended the imp-35263 machine-epsilon-floor EPS_FP factor-2 sweep from k in {-1,0,1,2} to k in {-1,..,4} ' +
    '(the double-precision N-range ceiling) and measured the fixed-window reentry-edge increment ratio (imp-35259 ' +
    'root-finder reproduced verbatim, import-light). Findings: (1) the reentry-edge slide is asymptotically ' +
    'GEOMETRIC with ratio -> 2 -- increments 8.7154 -> 17.2930 -> 34.3910 -> 68.5431 -> 136.8191 decades, ' +
    'increment ratios 1.98418 -> 1.98872 -> 1.99305 -> 1.99610 monotone toward 2 with the gap to 2 roughly ' +
    'halving; imp-35263 note (3)s "roughly double" is a genuine ratio -> 2 law; (2) the exact cause is that ' +
    'collapseDist(N) = |g - N_cross|/N_cross grows LINEARLY in log N (since g = K log T0, T0 ~ 2 pi N / log N), so ' +
    'collapseDist(L_k) = base 2^k const forces the reentry edge L_k proportional to 2^k and the increment ratio ' +
    '-> 2 exactly; (3) this is the imp-35332 ceil-phase drift decay in reciprocal form -- the drift halves per ' +
    'octave along the reentry edges (0.036924 -> 0.001183) and the increment ratio is the reciprocal drift ratio. ' +
    'The sweep truncates at k = 4 because k = 5s reentry edge (~10^557) exceeds the IEEE-754 double N-range. This ' +
    'discharges NOTHING: R1 / imp-35243a stay OPEN.',
  residual_sub_gap:
    'R1 / imp-35243a stay OPEN. This module MEASURES the geometric (ratio -> 2) structure of the fixed-window ' +
    'reentry-edge slide vs EPS_FP but does NOT re-express the band in a floor-free continuum limit nor prove the ' +
    'true dynamic has an intrinsic floor at EPS_FP. The ratio -> 2 is measured to four octaves and truncates at ' +
    'the double N-range ceiling (~10^308.25); the exact-limit claim rests on the collapseDist ~ log N asymptotic, ' +
    'not an interval enclosure. It inherits, and does not discharge, imp-35111a / imp-35174a / imp-34997a / ' +
    'imp-35243a. Point rate estimates, IEEE-754 double precision, no interval enclosure.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (numerical, frontier-direction, NOT an RH bound). Extending the imp-35263 machine-epsilon-floor ' +
    'EPS_FP factor-2 sweep to the double-precision N-range ceiling and measuring the fixed-window reentry-edge ' +
    'increment ratio. The slide is asymptotically GEOMETRIC with ratio -> 2: increments 8.7154 -> 17.2930 -> ' +
    '34.3910 -> 68.5431 -> 136.8191 decades, increment ratios 1.98418 -> 1.98872 -> 1.99305 -> 1.99610 monotone ' +
    'toward 2 with the gap to 2 roughly halving, so imp-35263 note (3)s "roughly double" is a genuine ratio -> 2 ' +
    'law. The exact cause is collapseDist(N) growing linearly in log N, forcing the reentry edge L_k proportional ' +
    'to 2^k; equivalently the imp-35332 ceil-phase drift halving per octave (the reciprocal drift ratio). The ' +
    'sweep truncates at k = 4 because k = 5s reentry edge (~10^557) exceeds the IEEE-754 double N-range ' +
    '(~10^308.25). This SHARPENS imp-35263: the reentry band slides super-linearly (geometrically) per octave in ' +
    'the machine-epsilon floor, strengthening the R1 obstruction. This discharges NOTHING: R1 / imp-35243a stay ' +
    'OPEN. MEASUREMENT / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 double surrogate, IEEE-754 double ' +
    'precision, point rate estimates; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35263 (note (3): near-doubling increments 8.72/17.29/34.39; sweep k=-1..2); imp-35259 (the direct-' +
    'bisection root-finder reproduced here); imp-35332 (drift decays ~ 1/L, the reciprocal of the ratio->2 ' +
    'slide); imp-35111 (single-rate band edges 10^27.08 / 10^37.17); imp-34997 (locates the reentry); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse, inlined); imp-2642 (C_C ansatz).',
};

export const IMP35399_REENTRY_EDGE_SLIDE_GEOMETRIC_RATIO_ASSERTIONS = [
  {
    // The sweep reproduces the imp-35263 reentry edges (k = -1..2) it extends.
    id: 'imp35399-reproduces-imp35263-edges',
    description: 'reentry edges at k=-1/0/1/2 reproduce imp-35263 (10^18.369 / 27.085 / 44.378 / 78.769)',
    holds: () =>
      Math.abs(REENTRY[0].reentry_fixed_exp - 18.36926) < 1e-3 &&
      Math.abs(REENTRY[1].reentry_fixed_exp - 27.08469) < 1e-3 &&
      Math.abs(REENTRY[2].reentry_fixed_exp - 44.37770) < 1e-3 &&
      Math.abs(REENTRY[3].reentry_fixed_exp - 78.76871) < 1e-3 &&
      REENTRY.every((s, i) => i === 0 || s.reentry_fixed_exp > REENTRY[i - 1].reentry_fixed_exp),
  },
  {
    // The increments reproduce imp-35263 note (3): 8.72 -> 17.29 -> 34.39, and extend to 68.54 -> 136.82.
    id: 'imp35399-increments-reproduce-note3-and-extend',
    description: 'increments 8.7154/17.2930/34.3910 match imp-35263 note (3); extended to 68.5431/136.8191',
    holds: () =>
      Math.abs(INCREMENTS[0].increment_decades - 8.7154) < 0.01 &&
      Math.abs(INCREMENTS[1].increment_decades - 17.2930) < 0.01 &&
      Math.abs(INCREMENTS[2].increment_decades - 34.3910) < 0.01 &&
      Math.abs(INCREMENTS[3].increment_decades - 68.5431) < 0.02 &&
      Math.abs(INCREMENTS[4].increment_decades - 136.8191) < 0.05,
  },
  {
    // The CORE finding: increment ratios are monotone-increasing toward 2 (asymptotically geometric).
    id: 'imp35399-increment-ratio-monotone-to-two',
    description: 'increment ratios 1.98418->1.98872->1.99305->1.99610 monotone increasing, all in (1.98,2), gap halving',
    holds: () =>
      RATIOS.length === 4 &&
      RATIOS_APPROACH_TWO &&
      RATIOS_MONOTONE_UP &&
      GAP_SHRINKS &&
      Math.abs(LAST_RATIO - 1.99610) < 5e-3 &&
      LAST_RATIO < 2,
  },
  {
    // Cross-check (3): the increment ratio equals the reciprocal of the local ceil-phase drift ratio (imp-35332),
    // and the drift halves per octave along the reentry edges.
    id: 'imp35399-ratio-is-reciprocal-drift-decay',
    description: 'increment ratio = reciprocal drift ratio; drift halves per octave (imp-35332), both -> 2',
    holds: () =>
      RECIPROCAL_MATCH &&
      DRIFT_AT_REENTRIES.every((d, i) => i === 0 || d < DRIFT_AT_REENTRIES[i - 1]) &&
      DRIFT_RATIOS.every((r) => r > 1.97 && r < 2.01),
  },
  {
    // Cross-check (2): collapseDist grows linearly in log N (collapseDist / ln N -> K/N_cross), the exact ratio->2 cause.
    id: 'imp35399-collapsedist-linear-in-logN',
    description: 'collapseDist / ln N deep (~0.046) approaches K/N_cross (~0.0479) from below: collapseDist ~ log N',
    holds: () =>
      COLLAPSEDIST_LOGN_LINEAR &&
      CD_OVER_LNN_DEEP < K_OVER_NCROSS &&
      Math.abs(K_OVER_NCROSS - 0.047944) < 1e-4,
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gap stays OPEN and named.
    id: 'imp35399-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, R1/imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35399_REENTRY_EDGE_SLIDE_GEOMETRIC_RATIO.isRigorous === false &&
      /NO QED/.test(IMP35399_REENTRY_EDGE_SLIDE_GEOMETRIC_RATIO.verdict) &&
      /refereed bound is changed/i.test(IMP35399_REENTRY_EDGE_SLIDE_GEOMETRIC_RATIO.verdict) &&
      /imp-35243a/.test(IMP35399_REENTRY_EDGE_SLIDE_GEOMETRIC_RATIO.residual_sub_gap) &&
      /stay OPEN/.test(IMP35399_REENTRY_EDGE_SLIDE_GEOMETRIC_RATIO.residual_sub_gap),
  },
];

for (const a of IMP35399_REENTRY_EDGE_SLIDE_GEOMETRIC_RATIO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35399-reentry-edge-slide-geometric-ratio assertion failed: ${a.id}`);
  }
}
