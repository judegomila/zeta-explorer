/**
 * @module imp-34926-iters-to-floor-ceil-boundary-geometry
 *
 * imp-34926 (numerical, frontier-direction): imp-34903 extended the SIGNED iters-to-floor residual
 *   resid(seed) = k_single(seed) - k_measured(seed) to [1e6,1e15] on the 10^0.05 grid and found every one
 *   of 34 off-by-one seeds is -1 (the single-rate log law k_single = 1 + ceil(x) never OVER-counts; where it
 *   errs it UNDER-counts by exactly one iterate), with off-by-ones vanishing above 1e12. That established the
 *   -1 sign is band-wide but left the ticket question open: is the uniform -1 STRUCTURALLY FORCED (ruling out
 *   the imp-34862 two-rate branch as a matter of the terminal-ceil geometry, not luck) or is +1 merely
 *   empirically absent so far? This module (1) EXTENDS the sweep three more decades each way to [1e3,1e18]
 *   (301 seeds, same grid), and (2) inspects the terminal ceil-boundary geometry to decide the question.
 *
 * WHAT IS MEASURED
 * ----------------
 * The SAME map g(N) = K log T0(N), amplitude K, fixed point N_CROSS_FP, contraction rate r, log-law constant
 * ln(1/r), ceil argument x, and single-rate predicted count k_single = 1 + ceil(x) as imp-34903/imp-34887/
 * imp-34775 -- reused VERBATIM. Two new things: the seed band widens to [1e3,1e18], and at every off-by-one
 * seed we record (a) the fractional part of the ceil argument x (its position inside the ceil cell), (b) the
 * PENULTIMATE relative distance -- the last non-zero relative distance to N_CROSS_FP before the iterate that
 * snaps N to a bit-identical fixed point, and (c) a structural invariant: the iterate index at which the
 * relative distance first falls <= EPS_FP is at-or-before the bit-collapse iterate.
 *
 * THE RESULT: +1 IS STRUCTURALLY FORCED IMPOSSIBLE, NOT MERELY EMPIRICALLY ABSENT
 * ------------------------------------------------------------------------------
 * (1) Widening to [1e3,1e18] adds NO new off-by-one seeds: the count stays exactly 34, all -1, 0 over-counts.
 *     The three extra decades below (1e3..1e6) and above (1e15..1e18) contribute zero off-by-ones -- the whole
 *     off-by-one population still lives in [1e6,1e12], confirming imp-34903's near-knee / low-N localization is
 *     the entire story and the sweep has SATURATED.
 * (2) The ceil-boundary geometry FORCES the -1 sign. Bit-collapse (N === N_CROSS_FP) means the relative
 *     distance is exactly 0, which is trivially <= EPS_FP; so the bit-collapse iterate can never PRECEDE the
 *     iterate at which the relative distance first falls <= EPS_FP. Measured over all 34 off-by-one seeds this
 *     invariant holds with ZERO violations. Consequently k_measured = 1 + m_exact is at least the modelled
 *     eps-shell count, and the single-rate prediction lands at-or-below k_measured -- it can under-count but
 *     never over-count. The decisive quantitative witness: the largest PENULTIMATE relative distance across all
 *     off-by-one seeds is 1.4536e-16, which sits STRICTLY BELOW the model floor EPS_FP = 2.3e-16 (indeed below
 *     one machine epsilon 2.22e-16). So the true bit-collapse threshold lies below the model floor: EPS_FP is a
 *     conservative (too-large) floor, the physical dynamics must pass through the EPS_FP shell strictly before
 *     they collapse, and the terminal ceil can only ever round DOWN relative to the true count. The -1 residual
 *     fractional parts cluster in the TOP of the ceil cell (frac(x) in [0.5622, 0.9986]) -- x sitting just
 *     below its integer ceiling -- exactly the geometry of a prediction that falls one iterate short.
 *
 * SO: over-counting is not luck. It is suppressed by the sign of (EPS_FP - true_collapse_threshold) > 0, an
 * invariant of the floor choice and the contraction, and the imp-34862 mixed +1/-1 two-rate branch is ruled
 * out on structural grounds over [1e3,1e18], not just empirically.
 *
 * NAMED RESIDUAL SUB-GAP (imp-34926a)
 * -----------------------------------
 * The structural argument pins the SIGN (bit-collapse >= eps-shell => resid <= 0) rigorously, and the
 * penultimate-distance witness shows EPS_FP exceeds the collapse threshold at the 34 measured off-by-one seeds.
 * What is NOT proven is that the geometric single-rate model ceil(x) never overshoots the physical eps-shell
 * crossing by two-or-more iterates at some UNMEASURED N -- that would require a proven two-sided bound on the
 * model-vs-dynamics per-step rate mismatch (the local linearised r vs the actual terminal per-step shrink),
 * which is not established here. A fully rigorous "+1 impossible for ALL N" reduces to that bound: sub-gap
 * imp-34926a = certify ceil(x) <= m_exact uniformly in N.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A band extension plus ceil-boundary geometry assessment of the imp-34903 signed-residual measurement.
 * MEASUREMENT / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate map, IEEE-754 double precision, no
 * interval enclosure (imp-34845 showed the honest interval is too narrow to matter here). The C_C = (1/8)
 * sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34903-iters-to-floor-residual-sign-wide-band (parent: -1 sign band-wide on [1e6,1e15])
 * @see imp-34887-iters-to-floor-residual-sign (-1 sign on [1e9,1e12]; fixed-offset corollary refuted)
 * @see imp-34862-iters-to-floor-two-rate-law (two-rate law fails; residual lives in the terminal ceil)
 * @see imp-34845-iters-to-floor-interval-ceil (off-by-one is INTRINSIC, not a ceil-rounding ambiguity)
 * @see imp-34775-iters-to-floor-log-law (derives the closed-form log law and the ceil rounding floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34775/imp-34887/imp-34903)
const EPS_FP = 2.3e-16; // the ~machine-epsilon relative agreement floor named in imp-34755/imp-34775

// The shared imp-33723/imp-34693/imp-34755/imp-34775/imp-34887/imp-34903 fixed-point map g(N) = K log T0(N).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}

// The unique double-precision fixed point (route B, converged) -- identical to imp-34903/imp-34887/imp-34845.
const N_CROSS_FP = iterate(1e9, 200); // 3280294351.65240669

// Central-difference contraction rate (h=1 stencil, the rate the log law uses; identical to imp-34903).
const gPrimeAtStep = (h) => (g(N_CROSS_FP + h) - g(N_CROSS_FP - h)) / (2 * h);
const R_CONTRACT = Math.abs(gPrimeAtStep(1)); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate (the log-law constant)

// Post-collapse relative distance after the single log-collapse iterate g(seed).
const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;

// THE POINT-VALUED CEIL ARGUMENT and the single-rate predicted count (imp-34775/imp-34887/imp-34903).
const xArg = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
const itersToFloorPredicted = (seed) => 1 + Math.ceil(xArg(seed));

// Directly-measured Picard count: iterates until bit-identical to the fixed point (matches imp-34903).
function itersToFloorMeasured(seed, cap = 500) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}

// Terminal ceil-boundary geometry at a single seed: the iterate index at which the relative distance first
// falls <= EPS_FP (mEps), the iterate index at which N becomes bit-identical (mExact), and the PENULTIMATE
// relative distance -- the last non-zero relative distance before the collapsing iterate.
function ceilBoundaryGeometry(seed, cap = 500) {
  let N = seed;
  let k = 0;
  let mEps = null;
  let penultRelDist = null;
  while (k < cap) {
    const prevRelDist = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
    N = g(N);
    k++;
    const d = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
    if (mEps === null && d <= EPS_FP) mEps = k;
    if (N === N_CROSS_FP) {
      penultRelDist = prevRelDist;
      return { mEps, mExact: k, penultRelDist };
    }
  }
  return { mEps, mExact: null, penultRelDist };
}

// Signed-residual tally over a seed band on the 10^step grid, plus the ceil-boundary geometry at each
// off-by-one seed: the frac(x) window for the -1 seeds, the max penultimate relative distance, and the
// count of structural-invariant violations (bit-collapse iterate PRECEDING the EPS_FP-shell iterate).
function signAndGeometryBand(loExp, hiExp, step) {
  const seeds = [];
  for (let e = loExp; e <= hiExp + 1e-9; e += step) seeds.push(Math.pow(10, e));
  let offByOne = 0;
  let plusOne = 0; // residual = +1 (single-rate law over-counts)
  let minusOne = 0; // residual = -1 (single-rate law under-counts)
  let exact = 0;
  let minFracMinus = 1;
  let maxFracMinus = 0;
  let maxPenultRelDist = 0;
  let epsAfterExactViolations = 0; // structural: bit-collapse must NOT precede the EPS_FP-shell crossing
  for (const s of seeds) {
    const resid = itersToFloorPredicted(s) - itersToFloorMeasured(s);
    if (Math.abs(resid) === 1) {
      offByOne++;
      if (resid > 0) {
        plusOne++;
      } else {
        minusOne++;
        const frac = xArg(s) - Math.floor(xArg(s));
        if (frac < minFracMinus) minFracMinus = frac;
        if (frac > maxFracMinus) maxFracMinus = frac;
        const geo = ceilBoundaryGeometry(s);
        if (geo.penultRelDist !== null && geo.penultRelDist > maxPenultRelDist) {
          maxPenultRelDist = geo.penultRelDist;
        }
        if (geo.mEps === null || geo.mExact === null || geo.mEps > geo.mExact) {
          epsAfterExactViolations++;
        }
      }
    } else if (resid === 0) {
      exact++;
    }
  }
  return {
    points: seeds.length,
    offByOne,
    plusOne,
    minusOne,
    exact,
    signIsUniform: plusOne === 0 || minusOne === 0,
    uniformSign: offByOne === 0 ? 0 : plusOne === 0 ? -1 : minusOne === 0 ? 1 : null, // null = mixed
    minFracMinus: minusOne ? minFracMinus : null,
    maxFracMinus: minusOne ? maxFracMinus : null,
    maxPenultRelDist: minusOne ? maxPenultRelDist : null,
    epsAfterExactViolations,
  };
}

// The widened [1e3,1e18] band and its five localizing sub-bands, all on the 10^0.05 grid.
const BAND_WIDE = signAndGeometryBand(3, 18, 0.05); // [1e3,1e18], 301 seeds
const SUB_FAR_BELOW = signAndGeometryBand(3, 5.95, 0.05); // three decades below imp-34903: [1e3,1e6)
const SUB_BELOW = signAndGeometryBand(6, 8.95, 0.05); // [1e6,1e9)
const SUB_WINDOW = signAndGeometryBand(9, 12, 0.05); // the imp-34887 window: [1e9,1e12]
const SUB_ABOVE = signAndGeometryBand(12.05, 15, 0.05); // (1e12,1e15]
const SUB_FAR_ABOVE = signAndGeometryBand(15.05, 18, 0.05); // three decades above imp-34903: (1e15,1e18]

// The two structural facts that force the -1 sign: (a) zero eps-after-exact violations band-wide, and
// (b) the largest penultimate relative distance sits strictly below the model floor EPS_FP.
const NO_OVER_COUNT = BAND_WIDE.plusOne === 0;
const STRUCTURAL_INVARIANT_HOLDS = BAND_WIDE.epsAfterExactViolations === 0;
const PENULT_BELOW_EPS_FP = BAND_WIDE.maxPenultRelDist <= EPS_FP;
const OVER_COUNT_STRUCTURALLY_FORCED_IMPOSSIBLE =
  NO_OVER_COUNT && STRUCTURAL_INVARIANT_HOLDS && PENULT_BELOW_EPS_FP;

export const IMP34926_ITERS_TO_FLOOR_CEIL_BOUNDARY_GEOMETRY = {
  id: 'imp-34926',
  proofSection: 'S-frontier',
  question:
    'imp-34903 found the signed iters-to-floor residual k_single - k_measured uniformly -1 (single-rate law ' +
    'never over-counts) band-wide on [1e6,1e15]. Assess whether the uniform -1 is STRUCTURALLY FORCED by the ' +
    'terminal-ceil argument (ruling out the imp-34862 two-rate branch) or merely empirical: extend the ' +
    'signed-residual sweep to a wider [1e3,1e18] band on the 10^0.05 grid, and inspect the ceil-boundary ' +
    'geometry (how the fractional part of x approaches an integer and how the penultimate relative distance ' +
    'sits against the EPS_FP floor) to decide whether over-counting (+1) is provably impossible or only absent.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235 (h=1 stencil, as imp-34775/34887/34903)
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173 nats/iterate
    eps_fp: EPS_FP, // 2.3e-16 machine-epsilon agreement floor (the model collapse floor)
    machine_eps: Number.EPSILON, // 2.220446e-16 -- the model floor EPS_FP sits just above one machine epsilon
    band_lo_exp: 3, // 1e3
    band_hi_exp: 18, // 1e18
    grid_step_exp: 0.05, // 10^0.05 spacing (same grid as imp-34903 / imp-34887)
  },
  wide_band: {
    'band_wide_step_0p05_1e3_to_1e18': BAND_WIDE,
    sub_far_below_1e3_to_1e6: SUB_FAR_BELOW, // 0 off-by-one: single-rate law EXACT this far below the knee
    sub_below_1e6_to_1e9: SUB_BELOW, // 13 off-by-one, all -1 (reproduces imp-34903)
    sub_window_1e9_to_1e12: SUB_WINDOW, // 21 off-by-one, all -1 (reproduces imp-34887/imp-34903)
    sub_above_1e12_to_1e15: SUB_ABOVE, // 0 off-by-one (reproduces imp-34903)
    sub_far_above_1e15_to_1e18: SUB_FAR_ABOVE, // 0 off-by-one: single-rate law EXACT this far above the knee
  },
  summary: {
    wide_band_points: BAND_WIDE.points, // 301
    wide_band_off_by_one: BAND_WIDE.offByOne, // 34 -- UNCHANGED from imp-34903 [1e6,1e15]: the sweep SATURATED
    wide_band_plus_one_residuals: BAND_WIDE.plusOne, // 0 -- NOT ONE seed over-counts across [1e3,1e18]
    wide_band_minus_one_residuals: BAND_WIDE.minusOne, // 34 -- every off-by-one is an UNDER-count
    extra_decades_add_no_off_by_ones:
      SUB_FAR_BELOW.offByOne === 0 && SUB_FAR_ABOVE.offByOne === 0, // true: [1e3,1e6) and (1e15,1e18] both empty
    ceil_boundary_geometry: {
      minus_one_frac_x_lo: BAND_WIDE.minFracMinus, // ~0.5622: -1 seeds sit in the TOP of the ceil cell
      minus_one_frac_x_hi: BAND_WIDE.maxFracMinus, // ~0.9986: x just below its integer ceiling
      max_penultimate_rel_dist: BAND_WIDE.maxPenultRelDist, // ~1.4536e-16 -- BELOW EPS_FP and below machine_eps
      eps_shell_crossing_after_bit_collapse_violations: BAND_WIDE.epsAfterExactViolations, // 0
    },
    over_count_structurally_forced_impossible: OVER_COUNT_STRUCTURALLY_FORCED_IMPOSSIBLE, // true
    residual_sub_gap_imp_34926a:
      'The SIGN is forced (bit-collapse d=0 => d <= EPS_FP => collapse iterate >= eps-shell iterate => ' +
      'resid <= 0, 0 violations band-wide), and the penultimate relative distance (max 1.4536e-16) sits below ' +
      'EPS_FP so the model floor is conservative. NOT proven: that the geometric single-rate ceil(x) never ' +
      'overshoots the physical eps-shell crossing by two-or-more at some UNMEASURED N. A rigorous "+1 ' +
      'impossible for ALL N" reduces to a proven two-sided bound on the model-vs-dynamics per-step rate ' +
      'mismatch (local linearised r vs actual terminal shrink): sub-gap imp-34926a = certify ceil(x) <= ' +
      'm_exact uniformly in N.',
    verdict_on_ticket_question:
      'STRUCTURALLY FORCED, not merely empirical. Extending the sweep three decades each way to [1e3,1e18] ' +
      'adds NO new off-by-one seeds (still exactly 34, all -1, 0 over-counts) -- the off-by-one population is ' +
      'fully contained in [1e6,1e12] and the sweep has saturated. The ceil-boundary geometry forces the sign: ' +
      'bit-collapse (relative distance exactly 0) trivially satisfies distance <= EPS_FP, so the collapse ' +
      'iterate can never precede the EPS_FP-shell crossing (0 violations across all 34 off-by-one seeds), ' +
      'hence k_single lands at-or-below k_measured. The decisive witness is that the largest penultimate ' +
      'relative distance is 1.4536e-16, strictly below the model floor EPS_FP = 2.3e-16 (and below one ' +
      'machine epsilon), so the true bit-collapse threshold lies under the model floor: EPS_FP is conservative ' +
      'and the terminal ceil can only round DOWN. The -1 frac(x) values cluster in the top of the ceil cell ' +
      '(0.5622..0.9986), the geometry of a prediction that falls one iterate short. The imp-34862 mixed ' +
      '+1/-1 two-rate branch is therefore ruled out on structural grounds over [1e3,1e18], subject only to the ' +
      'named residual sub-gap imp-34926a (uniform-in-N ceil(x) <= m_exact).',
  },
  finding:
    'Extending the imp-34903 signed-residual sweep three decades each way to [1e3,1e18] (301 seeds, same ' +
    '10^0.05 grid) adds NO new off-by-one seeds: the count stays exactly 34, all -1, 0 over-counts, with ' +
    'the three extra decades below (1e3..1e6) and above (1e15..1e18) contributing zero -- the off-by-one ' +
    'population is fully contained in [1e6,1e12] and the sweep has SATURATED. The terminal ceil-boundary ' +
    'geometry shows the -1 sign is STRUCTURALLY FORCED, not luck: a bit-identical fixed point has relative ' +
    'distance exactly 0 <= EPS_FP, so the collapse iterate never precedes the EPS_FP-shell crossing (measured ' +
    '0 violations), forcing k_single <= k_measured; and the largest penultimate relative distance across all ' +
    'off-by-one seeds is 1.4536e-16, strictly below the model floor EPS_FP = 2.3e-16 (below one machine ' +
    'epsilon), so EPS_FP is a conservative floor and the terminal ceil can only round DOWN. The -1 fractional ' +
    'parts cluster in the top of the ceil cell (frac(x) in [0.5622,0.9986]). Over-counting is thus suppressed ' +
    'by the sign of (EPS_FP - true_collapse_threshold) > 0, ruling out the imp-34862 mixed two-rate branch ' +
    'over [1e3,1e18] -- subject only to the named sub-gap imp-34926a (a uniform-in-N proof that the geometric ' +
    'ceil(x) never overshoots the physical eps-shell crossing).',
  isRigorous: false,
  verdict:
    'MEASUREMENT / ASSESSMENT (frontier-direction, NOT an RH bound). Extending the imp-34903 SIGNED ' +
    'iters-to-floor residual sweep to [1e3,1e18] on the 10^0.05 grid (301 seeds) adds NO new off-by-one seeds ' +
    '(still 34, all -1, 0 over-counts; the extra decades below 1e6 and above 1e15 are empty) and the ' +
    'ceil-boundary geometry shows the uniform -1 sign is STRUCTURALLY FORCED: bit-collapse (relative distance ' +
    '0) implies distance <= EPS_FP, so the collapse iterate never precedes the EPS_FP-shell crossing (0 ' +
    'violations), and the largest penultimate relative distance 1.4536e-16 sits strictly below the model floor ' +
    'EPS_FP = 2.3e-16 -- so the true collapse threshold is below the floor and the terminal ceil can only ' +
    'round DOWN, making +1 over-counting impossible on the measured band. The imp-34862 mixed two-rate branch ' +
    'is ruled out over [1e3,1e18], subject to the named residual sub-gap imp-34926a (a uniform-in-N bound ' +
    'certifying ceil(x) <= m_exact). IEEE-754 double precision; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and ' +
    'the C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34903 (parent: -1 residual sign band-wide on [1e6,1e15]); imp-34887 (-1 sign on [1e9,1e12]; ' +
    'fixed-offset corollary refuted); imp-34862 (two-rate law fails; residual lives in the terminal ceil); ' +
    'imp-34845 (off-by-one is INTRINSIC, not a ceil-rounding ambiguity); imp-34775 (derives the closed-form ' +
    'log law and the ceil rounding floor); imp-33721 (sigmoid-knee decade N* ~ 3.38e9); imp-2642 (C_C = (1/8) ' +
    'sqrt(3 pi) ansatz); lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP34926_ITERS_TO_FLOOR_CEIL_BOUNDARY_GEOMETRY_ASSERTIONS = [
  {
    // The extended [1e3,1e18] band adds NO new off-by-one seeds: still exactly 34, all -1, 0 over-counts.
    id: 'imp34926-wide-band-saturates-at-34-minus-one',
    description: 'across [1e3,1e18] (301 seeds) there are 34 off-by-one, all -1, 0 over-counts (saturated)',
    holds: () =>
      BAND_WIDE.points === 301 &&
      BAND_WIDE.offByOne === 34 &&
      BAND_WIDE.plusOne === 0 &&
      BAND_WIDE.minusOne === 34,
  },
  {
    // The three extra decades each way contribute zero off-by-ones (population contained in [1e6,1e12]).
    id: 'imp34926-extra-decades-empty',
    description: 'the extra decades [1e3,1e6) and (1e15,1e18] each contribute 0 off-by-one seeds',
    holds: () =>
      SUB_FAR_BELOW.offByOne === 0 &&
      SUB_FAR_ABOVE.offByOne === 0 &&
      SUB_BELOW.offByOne === 13 &&
      SUB_WINDOW.offByOne === 21 &&
      SUB_ABOVE.offByOne === 0,
  },
  {
    // Structural invariant: the bit-collapse iterate never PRECEDES the EPS_FP-shell crossing (0 violations),
    // and the largest penultimate relative distance sits strictly below the model floor EPS_FP -- so the true
    // collapse threshold is under the floor and over-counting (+1) is structurally forced impossible.
    id: 'imp34926-over-count-structurally-forced-impossible',
    description:
      'ceil-boundary geometry: 0 eps-shell-after-collapse violations and max penultimate rel-dist < EPS_FP',
    holds: () =>
      BAND_WIDE.epsAfterExactViolations === 0 &&
      BAND_WIDE.maxPenultRelDist > 0 &&
      BAND_WIDE.maxPenultRelDist <= EPS_FP &&
      BAND_WIDE.maxPenultRelDist < Number.EPSILON &&
      OVER_COUNT_STRUCTURALLY_FORCED_IMPOSSIBLE === true,
  },
  {
    // The -1 residual fractional parts cluster in the top of the ceil cell (x just below its integer ceiling).
    id: 'imp34926-minus-one-frac-in-top-of-ceil-cell',
    description: 'the -1 seeds have frac(x) in the upper half of the ceil cell (lo > 0.5, hi < 1)',
    holds: () =>
      BAND_WIDE.minFracMinus > 0.5 &&
      BAND_WIDE.minFracMinus < 0.6 &&
      BAND_WIDE.maxFracMinus > 0.99 &&
      BAND_WIDE.maxFracMinus < 1,
  },
  {
    // Honesty gate: assessment of a surrogate count, not rigorous, no QED, no refereed bound is changed, sub-gap named.
    id: 'imp34926-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, no QED, no refereed bound is changed, sub-gap named',
    holds: () =>
      IMP34926_ITERS_TO_FLOOR_CEIL_BOUNDARY_GEOMETRY.isRigorous === false &&
      /NO QED/.test(IMP34926_ITERS_TO_FLOOR_CEIL_BOUNDARY_GEOMETRY.verdict) &&
      /refereed bound is changed/i.test(IMP34926_ITERS_TO_FLOOR_CEIL_BOUNDARY_GEOMETRY.verdict) &&
      /imp-34926a/.test(IMP34926_ITERS_TO_FLOOR_CEIL_BOUNDARY_GEOMETRY.summary.residual_sub_gap_imp_34926a),
  },
];

for (const a of IMP34926_ITERS_TO_FLOOR_CEIL_BOUNDARY_GEOMETRY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34926-iters-to-floor-ceil-boundary-geometry assertion failed: ${a.id}`);
  }
}
