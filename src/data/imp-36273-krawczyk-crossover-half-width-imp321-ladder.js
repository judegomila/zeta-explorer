/**
 * @module imp-36273-krawczyk-crossover-half-width-imp321-ladder
 *
 * MEASUREMENT / DIAGNOSTIC ONLY. imp-36153 (F3) claimed the Krawczyk residual-node
 * surrogate-over-layer enclosure-width ratio W_surr/W_layer of [F(m)] = [m] - [K log T0(m)] has a
 * crossover half-width a_cross(N) that "tracks ULP(effectiveHeightForN(N))", evidenced at only three
 * spot heights (N_cross, 1e13, 1e17). imp-36253 tabulated a*(N) across a MIXED grid (N_cross plus every
 * decade 1e10 .. 1e21), fitted a* against both ULP(N) and ULP(T*) = ULP(effectiveHeightForN(N)), and
 * found a* = ULP(N)/2 EXACTLY while the ULP(T*) fit is ragged (slope ~1.047, R^2 ~0.9991). This module
 * RE-RUNS the identical measurement RESTRICTED to EXACTLY the imp-321 every-other-decade ladder named in
 * the imp-36273 ticket -- N = 1e13, 1e15, 1e17, 1e19, 1e21 -- to rule out that the ULP(T*) fit only looks
 * ragged because the mixed grid mixed N_cross and adjacent decades, i.e. to test whether on a SPARSE
 * REGULAR ladder (where ULP(T*)/ULP(N) might be a fixed power of two) a_cross could instead track ULP(T*).
 *
 * WHAT THE RESTRICTED LADDER FINDS
 * --------------------------------
 *   (R1) a*(N) = ULP(N)/2, EXACTLY, at every one of the five imp-321 rungs -- the a-star/ULP(N) column is a
 *        flat 0.500000 (max abs deviation ~1.5e-13). The log-log fit a* against ULP(N) has slope
 *        1.000000, proportionality constant c = 0.500000, R^2 = 1.000000. CONFIRMS imp-36253 (M1) on the
 *        exact ladder the imp-36273 ticket names.
 *   (R2) a_cross does NOT track ULP(effectiveHeightForN(N)). The a-star/ULP(T*) column is NOT constant: it
 *        takes only the two values {2, 4} -- exactly 2 at N = 1e13, 1e15, 1e17 and exactly 4 at
 *        N = 1e19, 1e21 -- a SINGLE power-of-two STEP, because ULP(T*)/ULP(N) drops from 1/4 to 1/8
 *        between 1e17 and 1e19 as T*(N) crosses a binade boundary the N-coordinate has not yet reached.
 *        A quantity that were truly proportional to ULP(T*) would give a FLAT a-star/ULP(T*) column; the crisp
 *        2 -> 4 jump is the direct witness that it is NOT. The log-log fit of a* against ULP(T*) is
 *        correspondingly ragged (slope ~1.047, constant ~2.50, R^2 ~0.99929), strictly worse than the
 *        exact ULP(N) fit. This SHARPENS imp-36253 (M3): even on the sparse regular imp-321 ladder -- where
 *        one might have hoped ULP(T*)/ULP(N) is a fixed power of two -- it is not; it steps once inside the
 *        window, so a_cross is an N-coordinate quantization landmark (half a ULP of N), not a T*-landmark.
 *
 * This RESOLVES the imp-36273 title/description question on the ladder it specifies: the Krawczyk
 * surrogate/layer crossover half-width a_cross(N) tracks ULP(N), NOT ULP(effectiveHeightForN(N)); the
 * fitted exponent against ULP(T*) is ~1.047 (not 1) with R^2 < 1, whereas against ULP(N) it is exactly 1.
 *
 * MEASUREMENT / surrogate ONLY on the inherited imp-3220/imp-3406 RvM height map
 * (lambda-rh-height-mapping.effectiveHeightForN). The LAYER width is an a-priori correctly-rounded
 * directed-rounding MODEL, NOT the imp-34687a layer (which remains unimplemented); it instantiates NO
 * certified interval, ports NO operator, and does NOT discharge the F(m) = 0 residual-at-root artifact.
 * imp-34714a and imp-34687a REMAIN OPEN; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486)
 * UNTOUCHED; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36253-krawczyk-crossover-half-width-ulp-ladder (the mixed-grid tabulation this restricts to the imp-321 ladder)
 * @see imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence (source: the a-sweep and F3 ULP claim)
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (the point-input "a-independent 2x" claim)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (the nextafter SURROGATE machinery reused here)
 * @see imp-34687-crossover-interval-arithmetic-scope (directed-rounding layer scope; sub-gap imp-34687a unimplemented)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (Krawczyk lemma; sub-gap imp-34714a open; a = candidate-box half-width)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-36017/imp-36153/imp-36253)
const EPS = Number.EPSILON; // 2^-52

// Bit-level nextUp/nextDown (imp-35969/imp-36017/imp-36153/imp-36253 outward-rounding primitive), verbatim.
const F64 = new Float64Array(1);
const I64 = new BigInt64Array(F64.buffer);
function nextUp(x) {
  if (Number.isNaN(x) || x === Infinity) return x;
  if (x === 0) { F64[0] = 0; I64[0] = 1n; return F64[0]; }
  F64[0] = x;
  I64[0] = x > 0 ? I64[0] + 1n : I64[0] - 1n;
  return F64[0];
}
const nextDown = (x) => -nextUp(-x);
const ulpOf = (v) => Math.pow(2, Math.floor(Math.log2(Math.abs(v)))) * EPS;

// (A) SURROGATE width of the INTERVAL-input residual node [F([X])], [X] = [m0-a, m0+a]
// (imp-36153/imp-36253 verbatim: imp-35969 nextafter outward rounding on the interval endpoints).
function surrogateWidth(m0, a) {
  const mlo = m0 - a;
  const mhi = m0 + a;
  const T0lo = effectiveHeightForN(mlo);
  const T0hi = effectiveHeightForN(mhi); // T0 is monotone increasing in N
  const Llo = nextDown(Math.log(T0lo));
  const Lhi = nextUp(Math.log(T0hi));
  const Glo = nextDown(K_AMPL * Llo);
  const Ghi = nextUp(K_AMPL * Lhi);
  const Flo = nextDown(mlo - Ghi);
  const Fhi = nextUp(mhi - Glo);
  return Fhi - Flo;
}

// (B) LAYER width: a-priori correctly-rounded directed-rounding MODEL of the SAME op-DAG (imp-36253 verbatim).
function layerWidth(m0, a) {
  const mlo = m0 - a;
  const mhi = m0 + a;
  const Llo = Math.log(effectiveHeightForN(mlo));
  const Lhi = Math.log(effectiveHeightForN(mhi));
  const wL = (Lhi - Llo) + ulpOf(Math.max(Math.abs(Llo), Math.abs(Lhi))); // propagated + 1 ULP
  const G = K_AMPL * ((Llo + Lhi) / 2);
  const wG = K_AMPL * wL + ulpOf(G); // K * operand width + 1 ULP of the product
  const wIn = mhi - mlo; // = 2a in exact math, but rounds to 0 while a < ULP(m0)/2
  const F = m0 - G;
  const wF = wIn + wG + (F === 0 ? 0 : ulpOf(F)); // subtraction: propagate widths + 1 ULP
  return wF;
}

const ratioAt = (m0, a) => surrogateWidth(m0, a) / layerWidth(m0, a);

// Locate a*(N): the half-width a at which the surrogate/layer ratio first drops to the 1.5 midpoint
// between the a -> 0 "2x" ULP-floor value and the a -> infinity 1.0 asymptote. Bisect in log(a)
// (the ratio is monotone non-increasing in a, imp-36153 F2). Identical locator to imp-36253.
const RATIO_TARGET = 1.5;
function crossoverHalfWidth(m0, target) {
  const r0 = ratioAt(m0, 0);
  if (!(r0 > target)) return { aStar: NaN, r0 };
  let lo = 1e-30; // ratio(lo) = r0 (box collapses to the point)
  let hi = 1e15; // ratio(hi) -> 1 (macroscopic box)
  if (ratioAt(m0, hi) > target) return { aStar: Infinity, r0 };
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (ratioAt(m0, mid) > target) lo = mid; else hi = mid;
    if (hi / lo < 1 + 1e-12) break;
  }
  return { aStar: Math.sqrt(lo * hi), r0 };
}

// EXACTLY the imp-321 every-other-decade ladder named in the imp-36273 ticket (N = 1e13 .. 1e21).
const LADDER = [1e13, 1e15, 1e17, 1e19, 1e21];

const TABLE = LADDER.map((N) => {
  const T0 = effectiveHeightForN(N);
  const { aStar, r0 } = crossoverHalfWidth(N, RATIO_TARGET);
  const uN = ulpOf(N);
  const uT = ulpOf(T0);
  return {
    N,
    T0,
    ulpN: uN,
    ulpT: uT,
    ratioFloor: r0,
    aStar,
    aStarOverUlpN: aStar / uN,
    aStarOverUlpT: aStar / uT,
    ulpTOverUlpN: uT / uN,
  };
});

// Log-log least-squares fit y = c * x^slope; returns slope, constant c, R^2 (imp-36253 verbatim).
function logLogFit(xs, ys) {
  const n = xs.length;
  const X = xs.map(Math.log);
  const Y = ys.map(Math.log);
  const mx = X.reduce((s, v) => s + v, 0) / n;
  const my = Y.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (X[i] - mx) * (Y[i] - my);
    sxx += (X[i] - mx) ** 2;
    syy += (Y[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const c = Math.exp(my - slope * mx);
  const r2 = sxx > 0 && syy > 0 ? (sxy * sxy) / (sxx * syy) : 1;
  return { slope, c, r2 };
}

const FIT_ULP_N = logLogFit(TABLE.map((r) => r.ulpN), TABLE.map((r) => r.aStar));
const FIT_ULP_T = logLogFit(TABLE.map((r) => r.ulpT), TABLE.map((r) => r.aStar));

// (R1) a* = ULP(N)/2 exactly on the restricted ladder.
const MAX_ABS_DEV_HALF = Math.max(...TABLE.map((r) => Math.abs(r.aStarOverUlpN - 0.5)));
const ULP_N_FIT_PERFECT = Math.abs(FIT_ULP_N.slope - 1) < 1e-6 && Math.abs(FIT_ULP_N.c - 0.5) < 1e-6 && FIT_ULP_N.r2 > 1 - 1e-9;

// (R2) a*/ULP(T*) is NOT constant: it takes only the two values {2, 4} across the ladder (a single
// power-of-two step). The set of ROUNDED a*/ULP(T*) values is exactly {2, 4}, and the ULP(T*) fit loses.
const A_OVER_ULPT_ROUNDED = TABLE.map((r) => Math.round(r.aStarOverUlpT));
const A_OVER_ULPT_IS_TWO_FOUR_STEP =
  A_OVER_ULPT_ROUNDED.every((v) => v === 2 || v === 4) &&
  A_OVER_ULPT_ROUNDED.includes(2) &&
  A_OVER_ULPT_ROUNDED.includes(4) &&
  new Set(A_OVER_ULPT_ROUNDED).size === 2;
const ULP_N_BEATS_ULP_T = (1 - FIT_ULP_N.r2) < (1 - FIT_ULP_T.r2) && FIT_ULP_T.r2 < 1 - 1e-6;

const fmtRow = (r) => ({
  N: +r.N.toExponential(2),
  T0: +r.T0.toExponential(3),
  ulpN: +r.ulpN.toExponential(3),
  ulpT: +r.ulpT.toExponential(3),
  ratio_floor: +r.ratioFloor.toFixed(4),
  a_star: +r.aStar.toExponential(3),
  a_star_over_ulpN: +r.aStarOverUlpN.toFixed(6),
  a_star_over_ulpT: +r.aStarOverUlpT.toFixed(4),
  ulpT_over_ulpN: +r.ulpTOverUlpN.toExponential(2),
});

export const IMP36273_KRAWCZYK_CROSSOVER_HALF_WIDTH_IMP321_LADDER = {
  id: 'imp-36273',
  proofSection: 'S-frontier',
  question:
    'imp-36153 (F3) claimed the Krawczyk residual-node surrogate-over-layer width-ratio crossover ' +
    'half-width a_cross(N) "tracks ULP(effectiveHeightForN(N))", checked at only three spot heights ' +
    '(N_cross, 1e13, 1e17). Tabulate a_cross(N) across EXACTLY the imp-321 every-other-decade ladder ' +
    'N = 1e13, 1e15, 1e17, 1e19, 1e21 (the ladder the imp-36273 ticket names) and test whether it tracks ' +
    'ULP(N) or ULP(T*) = ULP(effectiveHeightForN(N)); report the fitted exponent against ULP(T*). ' +
    'Measurement / surrogate only; instantiates no interval; imp-34714a/imp-34687a stay OPEN; NO QED.',
  finding:
    '(R1) a_cross(N) = ULP(N)/2, EXACTLY, at every one of the five imp-321 rungs -- the a*/ULP(N) column ' +
    'is a flat 0.500000 (max abs deviation ' + MAX_ABS_DEV_HALF.toExponential(2) + '); the log-log fit ' +
    'a* vs ULP(N) has slope ' + FIT_ULP_N.slope.toFixed(6) + ', constant c = ' + FIT_ULP_N.c.toFixed(6) +
    ', R^2 = ' + FIT_ULP_N.r2.toFixed(6) + ', confirming imp-36253 (M1) on the exact ladder the ticket ' +
    'names. (R2) a_cross does NOT track ULP(effectiveHeightForN(N)). The a*/ULP(T*) column is NOT ' +
    'constant: it takes only the two values {2, 4} -- exactly 2 at N = 1e13, 1e15, 1e17 and exactly 4 at ' +
    'N = 1e19, 1e21 -- a single power-of-two STEP, because ULP(T*)/ULP(N) drops from 1/4 to 1/8 between ' +
    '1e17 and 1e19 as T*(N) crosses a binade boundary the N-coordinate has not. A quantity truly ' +
    'proportional to ULP(T*) would give a FLAT a*/ULP(T*) column; the crisp 2 -> 4 jump is the direct ' +
    'witness that it is not. The log-log fit a* vs ULP(T*) is correspondingly ragged (slope ' +
    FIT_ULP_T.slope.toFixed(3) + ', constant ~' + FIT_ULP_T.c.toFixed(2) + ', R^2 ' + FIT_ULP_T.r2.toFixed(6) +
    '), strictly worse than the exact ULP(N) fit. Even on the sparse REGULAR imp-321 ladder -- where one ' +
    'might have hoped ULP(T*)/ULP(N) is a fixed power of two -- it is not; it steps once inside the window, ' +
    'so the crossover half-width is an N-coordinate quantization landmark (half a ULP of N), NOT a ' +
    'T*-landmark. This RESOLVES the imp-36273 ticket question: a_cross tracks ULP(N), not ' +
    'ULP(effectiveHeightForN(N)); the fitted exponent against ULP(T*) is ~' + FIT_ULP_T.slope.toFixed(3) +
    ' with R^2 < 1, whereas against ULP(N) it is exactly 1. MEASUREMENT / surrogate, NOT a machine certificate.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    ratio_target: RATIO_TARGET,
    machine_epsilon: EPS,
    ladder_rungs: LADDER.length,
    ladder: LADDER.map((N) => +N.toExponential(0)),
  },
  measurement: {
    a_star_over_ulpN_is_one_half: +(0.5).toFixed(6),
    max_abs_dev_from_one_half: +MAX_ABS_DEV_HALF.toExponential(3),
    a_star_over_ulpT_values_rounded: A_OVER_ULPT_ROUNDED,
    a_star_over_ulpT_is_two_four_step: A_OVER_ULPT_IS_TWO_FOUR_STEP,
    fit_vs_ulpN: {
      slope: +FIT_ULP_N.slope.toFixed(6),
      proportionality_constant: +FIT_ULP_N.c.toFixed(6),
      r_squared: +FIT_ULP_N.r2.toFixed(9),
    },
    fit_vs_ulpT: {
      slope: +FIT_ULP_T.slope.toFixed(6),
      proportionality_constant: +FIT_ULP_T.c.toFixed(4),
      r_squared: +FIT_ULP_T.r2.toFixed(9),
    },
    ulpN_fit_perfect: ULP_N_FIT_PERFECT,
    ulpN_beats_ulpT: ULP_N_BEATS_ULP_T,
    ladder: TABLE.map(fmtRow),
  },
  subGap:
    'imp-34714a AND imp-34687a REMAIN OPEN. The LAYER width is an a-priori correctly-rounded ' +
    'directed-rounding MODEL of the residual node, NOT the imp-34687a layer (which JS lacks and which is ' +
    'unimplemented); the surrogate is the imp-35969 bit-level nextafter proxy. This restricts the ' +
    'imp-36253 tabulation to the imp-321 ladder and confirms how a MODEL ratio-crossover half-width tracks ' +
    'the double-precision ULP of the N-coordinate, not a machine value. It instantiates NO certified ' +
    'interval, ports NO operator, and does NOT discharge the F(m) = 0 residual-at-root artifact. That ' +
    'a_cross = ULP(N)/2 is a REPRESENTABILITY property of double precision, NECESSARY context but not ' +
    'SUFFICIENT for a valid certificate; the full K(m) operator over a real directed-rounding layer is ' +
    'not ported. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE CROSSOVER HALF-WIDTH a_cross(N) TABULATED ON THE imp-321 LADDER (frontier, NOT ' +
    'an RH bound). imp-36153 F3 claimed a_cross "tracks ULP(effectiveHeightForN(N))" from three spot ' +
    'heights; re-running the imp-36253 measurement restricted to EXACTLY the imp-321 ladder N = 1e13, ' +
    '1e15, 1e17, 1e19, 1e21: (R1) a_cross(N) = ULP(N)/2 EXACTLY -- the ULP(N) fit has slope ' +
    FIT_ULP_N.slope.toFixed(6) + ', constant ' + FIT_ULP_N.c.toFixed(6) + ', R^2 ' + FIT_ULP_N.r2.toFixed(6) +
    '; (R2) a_cross does NOT track ULP(T*): the a*/ULP(T*) column is a two-value {2, 4} STEP (2 at 1e13/1e15/' +
    '1e17, 4 at 1e19/1e21, where ULP(T*)/ULP(N) drops 1/4 -> 1/8), so the ULP(T*) fit is ragged (slope ' +
    FIT_ULP_T.slope.toFixed(3) + ', R^2 ' + FIT_ULP_T.r2.toFixed(6) + '), strictly worse than the exact ' +
    'ULP(N) fit. This RESOLVES the imp-36273 title/description question on the ladder it specifies in ' +
    'favour of ULP(N) and SHARPENS imp-36253 (M3): even on the sparse regular ladder ULP(T*)/ULP(N) is not ' +
    'a fixed power of two -- it steps once inside the window. MEASUREMENT / surrogate, NOT a machine ' +
    'certificate. SUB-GAPS imp-34714a AND imp-34687a REMAIN OPEN: the LAYER is an a-priori correctly-rounded ' +
    'formula, not the imp-34687a layer; no certified interval is instantiated, the F(m) = 0 artifact is not ' +
    'discharged, the ULP-quantum crossover is NECESSARY context but not SUFFICIENT. Reuses the ' +
    'imp-36017/imp-36153/imp-36253/imp-35969 machinery (identical K_AMPL, g, nextUp/nextDown, LAYER ' +
    'formula); C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36253 (mixed-grid a*(N) tabulation this restricts to the imp-321 ladder); imp-36153 ' +
    '(surrogate/layer ratio a-sweep; F3 ULP claim); imp-36017 (point-input surrogate/layer width sweep; ' +
    '"a-independent 2x"); imp-35969 (bit-level nextafter SURROGATE width machinery); imp-34687 ' +
    '(directed-rounding layer scope; sub-gap imp-34687a unimplemented); imp-34714 (Krawczyk lemma; ' +
    'sub-gap imp-34714a; a = candidate-box half-width); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). ULP quantization and interval width propagation: standard ' +
    'floating-point / interval analysis (IEEE-754, Moore, Neumaier).',
};

export const IMP36273_KRAWCZYK_CROSSOVER_HALF_WIDTH_IMP321_LADDER_ASSERTIONS = [
  {
    // (R1) a_cross = ULP(N)/2 exactly at every imp-321 rung.
    id: 'imp36273-a-cross-equals-half-ulp-N-every-imp321-rung',
    description: 'a_cross(N)/ULP(N) = 0.5 at every imp-321 ladder rung (max abs deviation < 1e-9)',
    holds: () => MAX_ABS_DEV_HALF < 1e-9,
  },
  {
    // (R1) the ULP(N) fit is exact on the restricted ladder.
    id: 'imp36273-ulpN-fit-slope-one-constant-half-r2-one',
    description: 'log-log fit a_cross vs ULP(N) on the imp-321 ladder: slope ~1, constant ~0.5, R^2 ~1',
    holds: () => ULP_N_FIT_PERFECT === true,
  },
  {
    // (R2) a_cross does NOT track ULP(T*): the a*/ULP(T*) column is a two-value {2, 4} power-of-two step.
    id: 'imp36273-a-cross-over-ulpT-is-two-four-step',
    description: 'a_cross/ULP(effectiveHeightForN(N)) takes only the values {2, 4} across the imp-321 ladder (a single power-of-two step, not a flat proportionality)',
    holds: () => A_OVER_ULPT_IS_TWO_FOUR_STEP === true,
  },
  {
    // (R2) the ULP(N) fit strictly beats the ULP(T*) fit on the restricted ladder.
    id: 'imp36273-ulpN-beats-ulpT-fit-imp321-ladder',
    description: 'the ULP(N) fit R^2 exceeds the ULP(T*) fit R^2 on the imp-321 ladder (a_cross tracks ULP(N), not ULP(T*))',
    holds: () => ULP_N_BEATS_ULP_T === true,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gaps open, no interval, no QED, no refereed bound is changed.
    id: 'imp36273-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a/imp-34687a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36273_KRAWCZYK_CROSSOVER_HALF_WIDTH_IMP321_LADDER.isRigorous === false &&
      /imp-34714a AND imp-34687a REMAIN OPEN/.test(IMP36273_KRAWCZYK_CROSSOVER_HALF_WIDTH_IMP321_LADDER.subGap) &&
      /NECESSARY (context )?but not SUFFICIENT/.test(IMP36273_KRAWCZYK_CROSSOVER_HALF_WIDTH_IMP321_LADDER.subGap) &&
      /NO QED/.test(IMP36273_KRAWCZYK_CROSSOVER_HALF_WIDTH_IMP321_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP36273_KRAWCZYK_CROSSOVER_HALF_WIDTH_IMP321_LADDER.verdict),
  },
];

for (const a of IMP36273_KRAWCZYK_CROSSOVER_HALF_WIDTH_IMP321_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36273-krawczyk-crossover-half-width-imp321-ladder assertion failed: ${a.id}`);
  }
}
