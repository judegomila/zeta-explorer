/**
 * @module imp-36253-krawczyk-crossover-half-width-ulp-ladder
 *
 * MEASUREMENT / DIAGNOSTIC ONLY. imp-36153 swept the Krawczyk residual-node surrogate-over-layer
 * enclosure-width ratio W_surr/W_layer of [F(m)] = [m] - [K log T0(m)] across the certificate
 * half-width a and found (F3) that the crossover half-width -- the a at which the a -> 0 "2x" factor
 * has decayed toward its 1.0 asymptote -- "scales with ULP(N)", but it checked this at only THREE spot
 * heights (N_cross, 1e13, 1e17) and never TABULATED the crossover half-width against N. This module
 * tabulates it across a full height ladder and pins the proportionality quantitatively.
 *
 * DEFINITION OF THE CROSSOVER HALF-WIDTH a* (imp-36253 ticket: the ratio=1.5 midpoint)
 * -----------------------------------------------------------------------------------
 * a*(N) is the certificate half-width a at which the ratio first drops to 1.5 -- the midpoint between
 * the a -> 0 "2x" ULP-floor value (~1.84 at N_cross, -> 2.0 at large N) and the a -> infinity asymptote
 * of exactly 1.0. It is located by bisection in log(a) on the reused imp-35969 nextafter SURROGATE and
 * the a-priori correctly-rounded directed-rounding LAYER of the identical op-DAG (verbatim imp-36153
 * machinery: same K_AMPL, g, nextUp/nextDown, LAYER formula, effectiveHeightForN RvM inverse), at each
 * rung of a geometric height ladder N = N_cross, 1e10 .. 1e21 (the imp-321 N-scaling residual-node regime).
 *
 * WHAT THE TABULATION FINDS
 * -------------------------
 *   (M1) a*(N) = ULP(N) / 2, EXACTLY, at EVERY rung. The log-log fit a* against ULP(N) has slope
 *        1.000000, proportionality constant c = 0.500000, and R^2 = 1.000000 -- a* is exactly half a
 *        ULP of the N-coordinate. This CONFIRMS and SHARPENS imp-36153 F3: the proportionality is not
 *        merely "scales with ULP(N)" but the pinned constant 1/2.
 *   (M2) THE CROSSOVER IS A REPRESENTABILITY STEP, NOT A SMOOTH DECAY. For a below ULP(N)/2 the box
 *        [m0-a, m0+a] collapses to the point m0 in double precision (m0 +/- a round back to m0), so the
 *        ratio holds flat at its a -> 0 value ~2. The instant a EXCEEDS ULP(N)/2 -- the smallest half-width
 *        at which the box first straddles two adjacent representables -- the propagated-input width jumps
 *        from 0 to one ULP and the ratio drops DISCONTINUOUSLY to ~4/3. Because the a -> 0 value lies in
 *        (1.5, 2] and the post-step value ~1.333 lies below 1.5, the ratio=1.5 crossing is PINNED to this
 *        single quantization edge a = ULP(N)/2. imp-36153's "strictly monotonic decay" is the far
 *        a >> ULP(N)/2 regime (2a dilution); the midpoint crossing itself is a step.
 *   (M3) THE PROPORTIONALITY IS TO ULP(N), NOT ULP(effectiveHeightForN(N)). a* tracks the ULP of the
 *        N-coordinate the half-width a LIVES in, not the ULP of the mapped height T0 = T*(N). Fitting a*
 *        against ULP(T*) instead gives a worse, ragged fit (slope ~1.037, constant wandering ~2..4,
 *        R^2 ~0.9991) because ULP(T*)/ULP(N) is not a fixed power of two across the ladder. This resolves
 *        the imp-36253 title ("scales with ULP(N)") vs description ("fit against ULP(effectiveHeightForN(N))")
 *        tension in favour of the title: the crossover is an N-coordinate quantization landmark.
 *
 * MEASUREMENT / surrogate ONLY on the inherited imp-3220/imp-3406 RvM height map
 * (lambda-rh-height-mapping.effectiveHeightForN). The LAYER width is an a-priori correctly-rounded
 * directed-rounding MODEL, NOT the imp-34687a layer (which remains unimplemented); it instantiates NO
 * certified interval, ports NO operator, and does NOT discharge the F(m) = 0 residual-at-root artifact.
 * imp-34714a and imp-34687a REMAIN OPEN; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486)
 * UNTOUCHED; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence (source: the a-sweep and F3 ULP(N) claim this tabulates)
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (the point-input "a-independent 2x" claim)
 * @see imp-36066-residual-node-no-machine-certificate-honest-status (records the a-independent 2x)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (the nextafter SURROGATE machinery reused here)
 * @see imp-34687-crossover-interval-arithmetic-scope (directed-rounding layer scope; sub-gap imp-34687a unimplemented)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (Krawczyk lemma; sub-gap imp-34714a open; a = candidate-box half-width)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-36017/imp-36153)
const EPS = Number.EPSILON; // 2^-52

// Bit-level nextUp/nextDown (imp-35969/imp-36017/imp-36153 outward-rounding primitive), verbatim.
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

// Shared imp-36017/imp-34774 Banach map g(N) = K log T0(N) and the located crossover fixed point N_cross.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435e9

// (A) SURROGATE width of the INTERVAL-input residual node [F([X])], [X] = [m0-a, m0+a]
// (imp-36153 verbatim: imp-35969 nextafter outward rounding on the interval endpoints).
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

// (B) LAYER width: a-priori correctly-rounded directed-rounding MODEL of the SAME op-DAG (imp-36153 verbatim).
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

// Locate a*(N): the half-width a at which the ratio first drops to the RATIO_TARGET = 1.5 midpoint.
// The ratio is monotone non-increasing in a (imp-36153 F2), so bisect in log(a).
const RATIO_TARGET = 1.5;
function crossoverHalfWidth(m0, target) {
  const r0 = ratioAt(m0, 0);
  if (!(r0 > target)) return { aStar: NaN, r0 }; // a -> 0 value already at/below the target
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

// The imp-321 N-scaling residual-node height ladder (N_cross plus 1e10 .. 1e21, matching the imp-36153 regime).
const LADDER = [N_CROSS, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20, 1e21];

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
    ratioFloor: r0, // a -> 0 (ULP-floor) "2x" value
    aStar,
    aStarOverUlpN: aStar / uN,
    aStarOverUlpT: aStar / uT,
  };
});

// Log-log least-squares fit y = c * x^slope; returns slope, constant c, R^2.
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

// (M1) a* = ULP(N)/2 exactly: the a*/ULP(N) column is a flat 0.5 at every rung.
const MAX_ABS_DEV_HALF = Math.max(...TABLE.map((r) => Math.abs(r.aStarOverUlpN - 0.5)));
// (M3) ULP(N) is the correct axis: its fit is essentially perfect and beats the ULP(T*) fit.
const ULP_N_FIT_PERFECT = Math.abs(FIT_ULP_N.slope - 1) < 1e-6 && Math.abs(FIT_ULP_N.c - 0.5) < 1e-6 && FIT_ULP_N.r2 > 1 - 1e-9;
const ULP_N_BEATS_ULP_T = (1 - FIT_ULP_N.r2) < (1 - FIT_ULP_T.r2);

// (M2) the ratio=1.5 crossing is a STEP: just below a* the ratio is at its a -> 0 floor (> 1.5); just
// above a* it has already dropped below the target (to ~4/3). Witness at a representative rung.
const WITNESS_N = 1e17;
const uWit = ulpOf(WITNESS_N);
const RATIO_BELOW_STEP = ratioAt(WITNESS_N, 0.49 * uWit); // box collapses -> a -> 0 floor ~2
const RATIO_ABOVE_STEP = ratioAt(WITNESS_N, 0.60 * uWit); // box straddles one ULP -> ~4/3
const CROSSING_IS_STEP = RATIO_BELOW_STEP > RATIO_TARGET && RATIO_ABOVE_STEP < RATIO_TARGET
  && (RATIO_BELOW_STEP - RATIO_ABOVE_STEP) > 0.5;

const fmtRow = (r) => ({
  N: +r.N.toExponential(2),
  T0: +r.T0.toExponential(3),
  ulpN: +r.ulpN.toExponential(3),
  ulpT: +r.ulpT.toExponential(3),
  ratio_floor: +r.ratioFloor.toFixed(4),
  a_star: +r.aStar.toExponential(3),
  a_star_over_ulpN: +r.aStarOverUlpN.toFixed(6),
  a_star_over_ulpT: +r.aStarOverUlpT.toFixed(3),
});

export const IMP36253_KRAWCZYK_CROSSOVER_HALF_WIDTH_ULP_LADDER = {
  id: 'imp-36253',
  proofSection: 'S-frontier',
  question:
    'imp-36153 (F3) found the Krawczyk residual-node surrogate-over-layer width-ratio crossover ' +
    'half-width -- the certificate half-width a at which the a -> 0 "2x" factor has decayed to a ' +
    'midpoint (here ratio = 1.5) -- "scales with ULP(N)", but checked this at only three spot heights ' +
    '(N_cross, 1e13, 1e17) and never tabulated it. Tabulate a*(N) across a full height ladder by ' +
    'bisection on the reused imp-35969 surrogate + a-priori layer, fit a*(N) against ULP(N) and against ' +
    'ULP(effectiveHeightForN(N)), and report the proportionality constant and R^2. Measurement / ' +
    'surrogate only; instantiates no interval; imp-34714a/imp-34687a stay OPEN; NO QED.',
  finding:
    'a*(N) = ULP(N) / 2, EXACTLY, at every rung of the ladder. (M1) The log-log fit of a* against ULP(N) ' +
    'has slope ' + FIT_ULP_N.slope.toFixed(6) + ', proportionality constant c = ' + FIT_ULP_N.c.toFixed(6) +
    ', and R^2 = ' + FIT_ULP_N.r2.toFixed(6) + ' -- confirming and SHARPENING imp-36153 F3 from a loose ' +
    '"scales with ULP(N)" to the pinned constant 1/2. (M2) The ratio = 1.5 crossing is a REPRESENTABILITY ' +
    'STEP, not a smooth decay: while a < ULP(N)/2 the box [m0-a, m0+a] collapses to the point m0 in double ' +
    'precision so the ratio holds at its a -> 0 floor (~' + RATIO_BELOW_STEP.toFixed(3) + ' at N=1e17); the ' +
    'instant a exceeds ULP(N)/2 the box first straddles two representables, the propagated-input width jumps ' +
    'by one ULP, and the ratio drops discontinuously to ~' + RATIO_ABOVE_STEP.toFixed(3) + ' (~4/3). Since ' +
    'the floor lies in (1.5, 2] and the post-step value below 1.5, the midpoint crossing is PINNED to that ' +
    'single quantization edge. (M3) The proportionality is to ULP(N), the ULP of the N-coordinate a lives ' +
    'in, NOT to ULP(effectiveHeightForN(N)): fitting a* against ULP(T*) gives a worse, ragged fit (slope ' +
    FIT_ULP_T.slope.toFixed(3) + ', c ~' + FIT_ULP_T.c.toFixed(2) + ', R^2 ' + FIT_ULP_T.r2.toFixed(6) +
    ') because ULP(T*)/ULP(N) is not a fixed power of two across the ladder. This resolves the ticket ' +
    'title (ULP(N)) vs description (ULP(T*)) tension in favour of the title: the crossover half-width is an ' +
    'N-coordinate quantization landmark, exactly half a ULP. MEASUREMENT / surrogate, NOT a machine certificate.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    N_cross: +N_CROSS.toPrecision(15),
    ratio_target: RATIO_TARGET,
    machine_epsilon: EPS,
    ladder_rungs: LADDER.length,
  },
  measurement: {
    a_star_over_ulpN_is_one_half: +(0.5).toFixed(6),
    max_abs_dev_from_one_half: +MAX_ABS_DEV_HALF.toExponential(3),
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
    crossing_is_a_step: CROSSING_IS_STEP,
    ratio_below_step_at_1e17: +RATIO_BELOW_STEP.toFixed(6),
    ratio_above_step_at_1e17: +RATIO_ABOVE_STEP.toFixed(6),
    ladder: TABLE.map(fmtRow),
  },
  subGap:
    'imp-34714a AND imp-34687a REMAIN OPEN. The LAYER width is an a-priori correctly-rounded ' +
    'directed-rounding MODEL of the residual node, NOT the imp-34687a layer (which JS lacks and which is ' +
    'unimplemented); the surrogate is the imp-35969 bit-level nextafter proxy. This tabulates how a MODEL ' +
    'ratio-crossover half-width tracks the double-precision ULP of the N-coordinate, not a machine value. It ' +
    'instantiates NO certified interval, ports NO operator, and does NOT discharge the F(m) = 0 ' +
    'residual-at-root artifact. That a* = ULP(N)/2 is a REPRESENTABILITY property of double precision, ' +
    'NECESSARY context but not SUFFICIENT for a valid certificate; the full K(m) operator over a real ' +
    'directed-rounding layer is not ported. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE CROSSOVER HALF-WIDTH a*(N) TABULATED ACROSS THE HEIGHT LADDER (frontier, NOT an ' +
    'RH bound). imp-36153 F3 asserted the surrogate/layer ratio crossover half-width "scales with ULP(N)" ' +
    'from three spot heights; tabulating a*(N) (the ratio = 1.5 midpoint, by bisection) across N_cross and ' +
    '1e10 .. 1e21: (M1) a*(N) = ULP(N)/2 EXACTLY -- log-log fit vs ULP(N) has slope ' +
    FIT_ULP_N.slope.toFixed(6) + ', constant ' + FIT_ULP_N.c.toFixed(6) + ', R^2 ' + FIT_ULP_N.r2.toFixed(6) +
    ', pinning imp-36153 F3 to the constant 1/2; (M2) the crossing is a REPRESENTABILITY STEP not a smooth ' +
    'decay (ratio holds at its ~2 floor for a < ULP(N)/2 where the box collapses to a point, then drops ' +
    'discontinuously to ~4/3 the instant a straddles one ULP); (M3) the proportionality is to ULP(N), the ' +
    'N-coordinate a lives in, NOT to ULP(effectiveHeightForN(N)) whose fit is worse (slope ' +
    FIT_ULP_T.slope.toFixed(3) + ', R^2 ' + FIT_ULP_T.r2.toFixed(6) + '), resolving the ticket title-vs-' +
    'description tension for ULP(N). MEASUREMENT / surrogate, NOT a machine certificate. SUB-GAPS imp-34714a ' +
    'AND imp-34687a REMAIN OPEN: the LAYER is an a-priori correctly-rounded formula, not the imp-34687a ' +
    'layer; no certified interval is instantiated, the F(m) = 0 artifact is not discharged, the ULP-quantum ' +
    'crossover is NECESSARY context but not SUFFICIENT. Reuses the imp-36017/imp-36153/imp-35969 machinery ' +
    '(identical K_AMPL, g, N_cross, nextUp/nextDown, LAYER formula); C_C = 1/8 (imp-2642/2643) and C_mb ' +
    'GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36153 (surrogate/layer ratio a-sweep; F3 "scales with ULP(N)" this tabulates); imp-36017 ' +
    '(point-input surrogate/layer width sweep; "a-independent 2x"); imp-36066 (residual-node ' +
    'no-machine-certificate honest status); imp-35969 (bit-level nextafter SURROGATE width machinery); ' +
    'imp-34687 (directed-rounding layer scope; sub-gap imp-34687a unimplemented); imp-34774 (root N_cross); ' +
    'imp-34714 (Krawczyk lemma; sub-gap imp-34714a; a = candidate-box half-width); imp-2642 (C_C 1/8 ' +
    'ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). ULP quantization and interval ' +
    'width propagation: standard floating-point / interval analysis (IEEE-754, Moore, Neumaier).',
};

export const IMP36253_KRAWCZYK_CROSSOVER_HALF_WIDTH_ULP_LADDER_ASSERTIONS = [
  {
    // (M1) a* = ULP(N)/2 exactly at every rung: the a*/ULP(N) column deviates from 0.5 by ~0.
    id: 'imp36253-a-star-equals-half-ulp-N-every-rung',
    description: 'a*(N)/ULP(N) = 0.5 at every ladder rung (max abs deviation < 1e-9)',
    holds: () => MAX_ABS_DEV_HALF < 1e-9,
  },
  {
    // (M1) the log-log fit against ULP(N) is essentially perfect: slope 1, constant 1/2, R^2 = 1.
    id: 'imp36253-ulpN-fit-slope-one-constant-half-r2-one',
    description: 'log-log fit a* vs ULP(N): slope ~1, proportionality constant ~0.5, R^2 ~1',
    holds: () => ULP_N_FIT_PERFECT === true,
  },
  {
    // (M3) ULP(N) is the correct axis: its fit strictly beats the ULP(effectiveHeightForN(N)) fit.
    id: 'imp36253-ulpN-beats-ulpT-fit',
    description: 'the ULP(N) fit R^2 exceeds the ULP(T*) fit R^2 (proportionality is to ULP(N), not ULP(T*))',
    holds: () => ULP_N_BEATS_ULP_T === true && FIT_ULP_T.r2 < 1 - 1e-6,
  },
  {
    // (M2) the ratio = 1.5 crossing is a discontinuous representability step, not a smooth decay.
    id: 'imp36253-crossing-is-a-representability-step',
    description: 'ratio holds above 1.5 for a just below ULP(N)/2 and drops below 1.5 (to ~4/3) just above it',
    holds: () => CROSSING_IS_STEP === true,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gaps open, no interval, no QED, no refereed bound is changed.
    id: 'imp36253-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a/imp-34687a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36253_KRAWCZYK_CROSSOVER_HALF_WIDTH_ULP_LADDER.isRigorous === false &&
      /imp-34714a AND imp-34687a REMAIN OPEN/.test(IMP36253_KRAWCZYK_CROSSOVER_HALF_WIDTH_ULP_LADDER.subGap) &&
      /NECESSARY (context )?but not SUFFICIENT/.test(IMP36253_KRAWCZYK_CROSSOVER_HALF_WIDTH_ULP_LADDER.subGap) &&
      /NO QED/.test(IMP36253_KRAWCZYK_CROSSOVER_HALF_WIDTH_ULP_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP36253_KRAWCZYK_CROSSOVER_HALF_WIDTH_ULP_LADDER.verdict),
  },
];

for (const a of IMP36253_KRAWCZYK_CROSSOVER_HALF_WIDTH_ULP_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36253-krawczyk-crossover-half-width-ulp-ladder assertion failed: ${a.id}`);
  }
}
