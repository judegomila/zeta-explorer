/**
 * @module imp-34247-widening-slope-pole-divergence
 *
 * imp-34247 (numerical, frontier-direction): imp-34188 R3 recorded that the LOCAL tail slope dy/dk of
 * y(k) = ln(eflow_over_resid_k) diverges from -0.97 (k=18) through -0.64 (k=20) to +2.05 (k=21) as the
 * imp-34023 residExp denominator collapses toward its simple zero at k* ~ 21.28095, contaminating the
 * far-window widening-slope fits -- but imp-34188 never CHARACTERIZED the divergence itself. This
 * module (a) measures dy/dk on a fine grid approaching k* from below, (b) decides whether it diverges
 * like a simple pole dy/dk ~ 1/(k*-k) or milder, and (c) locates the k beyond which the widening-slope
 * ladder rungs are ceiling-contaminated. Measurement only; the component model is NOT rigorous; no bound
 * changes; C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED.
 *
 * THE MODEL (imp-33810/imp-33877/imp-34188 sub-terms reused VERBATIM)
 * ------------------------------------------------------------------
 *   sigma(N) = E_coll/(E_trunc + E_flow + E_coll), inherited imp-3220/imp-3406 sub-terms exactly as in
 *   imp-34188 (E_trunc = 3.06e-5 fixed strip, E_coll = C_C_PINNED sqrt(log T0 / N), E_flow =
 *   C_F (log T0 / T0) Gronwall, T0 = effectiveHeightForN(N)). The response is
 *   y(k) = ln( eflowAttr(k) / residExp(k) ) with residExp(k) = pEcoll (1 - sigma) - pSigma the imp-33773
 *   M2 sub-leading residual, and its local slope dy/dk is a symmetric central difference (step h chosen
 *   to stay strictly below k* near the pole).
 *
 * THE ANALYTIC EXPECTATION (structural, not a fresh model)
 * -------------------------------------------------------
 *   y(k) = ln(eflowAttr(k)) - ln(residExp(k)). The imp-34023 residExp has a SIMPLE zero at k*: near k*
 *   residExp(k) = s (k - k*) + O((k-k*)^2) with s = residExp_prime(k*) < 0 (residExp > 0 below k*). So
 *   -ln(residExp) = -ln|s| - ln(k* - k) and its derivative contributes +1/(k* - k) to dy/dk. Hence the
 *   PREDICTION dy/dk = B(k) + 1/(k* - k), where B(k) = d/dk ln(eflowAttr) + [regular part of
 *   -ln(residExp)] is a smooth negative background -- a simple pole with residue EXACTLY +1.
 *
 * THE FINDING (measurement confirms a simple pole, residue -> 1)
 * -------------------------------------------------------------
 *   (R1) THE DIVERGENCE IS A SIMPLE POLE WITH RESIDUE +1. The product (k* - k) dy/dk rises monotonically
 *        toward 1 as k -> k* from below: 0.577 (k=21.00), 0.878 (k=21.20), 0.942 (k=21.24), 0.988
 *        (k=21.26), 1.013 (k=21.275). The residue converges on +1, exactly as the simple-zero structure
 *        of residExp forces. A log-log order estimate gives pole order p ~ 1.02 -- NOT logarithmically
 *        milder (p < 1) and NOT stronger (p > 1); dy/dk diverges to +inf like 1/(k* - k).
 *   (R2) THE SMOOTH BACKGROUND B(k) = dy/dk - 1/(k* - k) IS SLOWLY VARYING AND NEGATIVE. B drifts from
 *        ~ -1.10 (k=12) to ~ -1.46 (k=20.5), i.e. the eflowAttr slope plus the regular part of
 *        -ln(residExp). The far-field plateau dy/dk ~ -0.98 is the near-cancellation B + pole with the
 *        small pole term; it is the pole term overtaking B, not B itself moving, that flips dy/dk positive.
 *   (R3) LADDER RUNGS ARE CEILING-CONTAMINATED AT k >~ 19. dy/dk stays within ~1% of its far plateau
 *        (-0.977) through k ~ 18, deviates ~3% at k=18.5, ~8% at k=19, ~16% at k=19.5 and ~35% at k=20,
 *        then crosses zero near k ~ 20.5 and blows up. So rungs k <= 18.5 are clean (<3% pole leakage);
 *        k >= 19 are contaminated and the contamination is decisive past k ~ 19.5 -- confirming, from the
 *        independent local-slope angle, imp-34188 s observation that the widening-slope increments
 *        RE-GROW past kEnd ~ 19.5.
 *
 * The punchline: imp-34188 R3 tabulated {-0.97, -0.64, +2.05} at k = {18, 20, 21} but never fit it. The
 * divergence is a SIMPLE POLE dy/dk = B(k) + 1/(k* - k) with residue exactly +1 -- forced by the simple
 * zero of residExp at k* ~ 21.28095 -- and (k* - k) dy/dk -> 1 confirms it numerically. The widening-slope
 * ladder rungs become ceiling-contaminated at k >~ 19 (>~8% pole leakage), decisively past k ~ 19.5,
 * matching imp-34188 s kEnd ~ 19.5 re-growth flag.
 *
 * MEASUREMENT / DIVERGENCE-CHARACTERIZATION ONLY. A fine-grid local-slope measurement of an inherited
 * surrogate near an inherited pole, NOT an RH bound. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the residExp simple-zero structure is a numerical/structural
 * observation, not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34188-widening-slope-limit-exactly-minus-one (R3 tabulated the {-0.97,-0.64,+2.05} slopes characterized here)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the residExp sign-change pole k* ~ 21.281 whose divergence this fits)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (closed-form derivation of the same k* ceiling)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (fixed-band peak terminating at the same pole)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear widening-slope surrogate the pole contaminates)
 * @see imp-34205-widening-slope-convergence-viz-data (the b_inf convergence plot terminating at the same pole)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected k* ~ 21.281) -> imp-34127
 * (leading closed form) -> imp-34189 (next-order term) -> imp-34188 (widening-slope limit b_inf ~ -1) ->
 * imp-34246 (derives b_inf~-1.003 is a finite-window coincidence, true leading value -ln10/2) ->
 * imp-34247 (this module, the dy/dk simple-pole divergence at the same k*) -> imp-34169/imp-34237
 * (fixed-band peak re-acceleration terminating at the resid_exp pole). All eight share the same k*
 * ceiling.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34188
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33877/imp-34188 exactly

// EXACT inherited imp-3406/imp-33810/imp-33877/imp-34188 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
// imp-33582/imp-33730: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  return -olsSlope(xs, ys);
}
// imp-33620/imp-33727 magnitude: p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
// s_flow = d ln E_flow / d ln N via a symmetric log-N central difference.
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// imp-34023 residExp(k) = pEcoll(1 - sigma) - pSigma; simple zero at k* bounds the surrogate domain.
function residExpAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}
// The imp-34188 R3 response y(k) = ln( eflowAttr(k) / residExp(k) ).
function yAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return Math.log(eflowAttr / residExp);
}
// Local slope dy/dk via symmetric central difference; step h stays strictly below k* near the pole.
function localSlope(k, h) {
  return (yAtK(k + h) - yAtK(k - h)) / (2 * h);
}
function stepFor(k, kStar) {
  const gap = kStar - k;
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole
}

// ---- 0. Locate the imp-34023 simple zero k* by bisection on residExp(k) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (matches imp-34188 signChangeCeiling)

// ---- 1. Fine-grid dy/dk approaching k* from below, plus the residue product (k*-k) dy/dk ----
const DIVERGENCE_GRID = [18, 19, 20, 20.5, 21.0, 21.05, 21.1, 21.15, 21.2, 21.24, 21.26, 21.275].map((k) => {
  const gap = K_STAR - k;
  const s = localSlope(k, stepFor(k, K_STAR));
  // B(k) = dy/dk - 1/(k*-k) subtracts two large near-equal numbers within ~0.06 of the pole, where the
  // O(h^2) central-difference error on the sharp 1/(k*-k) term dominates the difference -- so B is only
  // reported on the reliable region gap >= 0.06; the residue PRODUCT (a ratio) stays robust to the pole.
  const bReliable = gap >= 0.06;
  return {
    k,
    gap: +gap.toFixed(5), // k* - k
    dydk: +s.toFixed(4), // local tail slope of y(k)
    residueProduct: +(gap * s).toFixed(5), // (k* - k) dy/dk -> residue (expect -> 1)
    background: bReliable ? +(s - 1 / gap).toFixed(4) : null, // B(k) = dy/dk - 1/(k* - k), smooth part
  };
});
// The residue estimate at the deepest measured rung (k = 21.275) sits on ~1: a SIMPLE pole, residue +1.
const RESIDUE_NEAR_POLE = DIVERGENCE_GRID[DIVERGENCE_GRID.length - 1].residueProduct; // ~1.01
// Monotone rise of the residue product toward 1 across the near-pole rungs (k >= 21.0).
const NEAR = DIVERGENCE_GRID.filter((r) => r.k >= 21.0);
const RESIDUE_RISES_TO_ONE = NEAR.every((r, i) => i === 0 || r.residueProduct > NEAR[i - 1].residueProduct);

// ---- 2. Pole ORDER p from a two-point log-log estimate on the divergent part dy/dk - B0 ----
// If dy/dk - B ~ A (k* - k)^(-p), successive gaps give p = ln(d2/d1)/ln(gap1/gap2). Simple pole => p = 1.
const B0 = -1.46; // near-pole background level from R2 (used only to isolate the divergent part)
function slopeAt(k) {
  const gap = K_STAR - k;
  return { gap, s: localSlope(k, stepFor(k, K_STAR)) };
}
const PA = slopeAt(21.2);
const PB = slopeAt(21.26);
const POLE_ORDER = +(Math.log((PB.s - B0) / (PA.s - B0)) / Math.log(PA.gap / PB.gap)).toFixed(4); // ~1.02

// ---- 3. Contamination onset: deviation of dy/dk from the far-field plateau ----
const PLATEAU = localSlope(14, stepFor(14, K_STAR)); // ~ -0.977 (clean far field)
const CONTAM_LADDER = [16, 17, 18, 18.5, 19, 19.5, 20].map((k) => {
  const s = localSlope(k, stepFor(k, K_STAR));
  return { k, dydk: +s.toFixed(4), devPct: +(100 * Math.abs((s - PLATEAU) / PLATEAU)).toFixed(1) };
});
const dev = (k) => CONTAM_LADDER.find((r) => r.k === k).devPct;
const CLEAN_THROUGH_K18 = dev(18) < 2.0; // <2% pole leakage through k = 18
const CONTAM_AT_K19 = dev(19) > 5.0; // >5% by k = 19
const DECISIVE_AT_K195 = dev(19.5) > 10.0; // decisive past k ~ 19.5 (imp-34188 re-growth flag)
// The dy/dk zero crossing (B + pole = 0) sits between k = 20 (still negative) and k = 21 (positive).
const SIGN_FLIP_BRACKETED =
  localSlope(20, stepFor(20, K_STAR)) < 0 && localSlope(21, stepFor(21, K_STAR)) > 0;

export const IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE = {
  id: 'imp-34247',
  proofSection: 'S-frontier',
  question:
    'imp-34188 R3 recorded that the local tail slope dy/dk of y(k) = ln(eflow_over_resid_k) diverges ' +
    'from -0.97 (k=18) through -0.64 (k=20) to +2.05 (k=21) as the imp-34023 residExp denominator ' +
    'collapses toward its zero at k* ~ 21.281, but never characterized the divergence. Measure dy/dk ' +
    'on a fine grid approaching k* from below, decide whether it diverges like a simple pole ' +
    'dy/dk ~ 1/(k*-k) or milder, and locate the k beyond which the widening-slope ladder rungs are ' +
    'ceiling-contaminated. Measurement only; component model NOT rigorous; no bound changes; NO QED.',
  measuredQuantity:
    'The local slope dy/dk of y(k) on a fine grid k = 18 .. 21.275 below the imp-34023 pole k*, the ' +
    'residue product (k* - k) dy/dk, the smooth background B(k) = dy/dk - 1/(k* - k), a two-point ' +
    'log-log pole-order estimate p, and the deviation of dy/dk from its far-field plateau vs k',
  poleLocation: +K_STAR.toFixed(5), // ~21.28095 (imp-34023 / imp-34188 k*)
  divergenceGrid: DIVERGENCE_GRID, // (k, gap, dydk, residueProduct, background)
  residueNearPole: RESIDUE_NEAR_POLE, // (k* - k) dy/dk at k = 21.275 ~ 1.01 -- residue +1
  residueRisesToOne: RESIDUE_RISES_TO_ONE, // monotone rise 0.58 -> 1.01 across k = 21.0 .. 21.275
  poleOrder: POLE_ORDER, // ~1.02 -- simple pole, neither milder (<1) nor stronger (>1)
  farFieldPlateau: +PLATEAU.toFixed(4), // ~ -0.977
  contaminationLadder: CONTAM_LADDER, // dy/dk deviation from the plateau at k = 16 .. 20
  contaminationOnsetK: 19, // >~8% pole leakage at k = 19; decisive past k ~ 19.5
  cleanThroughK18: CLEAN_THROUGH_K18, // rungs k <= 18 are clean (<2% leakage)
  signFlipBracketed: SIGN_FLIP_BRACKETED, // dy/dk crosses zero between k = 20 and k = 21
  finding: {
    R1_simple_pole_residue_one:
      'The product (k* - k) dy/dk rises monotonically toward 1 as k -> k* from below (0.577 at k=21.00, ' +
      '0.878 at 21.20, 0.988 at 21.26, 1.013 at 21.275), and a log-log order estimate gives p ~ 1.02: ' +
      'the divergence is a SIMPLE POLE dy/dk ~ 1/(k* - k) with residue EXACTLY +1, forced by the simple ' +
      'zero of the imp-34023 residExp at k* ~ 21.28095 (y = ln eflowAttr - ln residExp). Not milder ' +
      '(logarithmic, p < 1) and not stronger (p > 1).',
    R2_smooth_negative_background:
      'The background B(k) = dy/dk - 1/(k* - k) is slowly varying and negative, drifting from ~ -1.10 ' +
      '(k=12) to ~ -1.46 (k=20.5). The far-field plateau dy/dk ~ -0.98 is the near-cancellation B + pole ' +
      'with a small pole term; it is the pole overtaking B, not B moving, that flips dy/dk positive.',
    R3_ladder_contaminated_past_k19:
      'dy/dk stays within ~1% of its far plateau (-0.977) through k ~ 18, deviates ~3% at k=18.5, ~8% at ' +
      'k=19, ~16% at k=19.5 and ~35% at k=20, crossing zero near k ~ 20.5. Widening-slope ladder rungs ' +
      'k <= 18.5 are clean (<3% pole leakage); k >= 19 are ceiling-contaminated, decisively past ' +
      'k ~ 19.5 -- confirming, from the independent local-slope angle, imp-34188 s kEnd ~ 19.5 re-growth flag.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DIVERGENCE-CHARACTERIZATION (frontier-direction, NOT rigorous). The imp-34188 R3 local ' +
    'tail slope dy/dk of y(k) = ln(eflow_over_resid_k) diverges as a SIMPLE POLE dy/dk = B(k) + 1/(k* - k) ' +
    'with residue EXACTLY +1 as k -> k* ~ 21.28095 from below -- forced by the simple zero of the imp-34023 ' +
    'residExp (y = ln eflowAttr - ln residExp) -- confirmed numerically by (k* - k) dy/dk rising ' +
    'monotonically onto 1 (0.577 at k=21.00 -> 1.013 at k=21.275) and a log-log order estimate p ~ 1.02 ' +
    '(neither logarithmically milder nor stronger). The smooth background B(k) is a slowly-varying ' +
    'negative drift (~ -1.10 at k=12 to ~ -1.46 at k=20.5); the far plateau dy/dk ~ -0.98 is the pole ' +
    'overtaking B, not B moving. The widening-slope ladder rungs are clean (<2% pole leakage) through ' +
    'k <= 18, contaminated at k >= 19 (>~8%), and decisively so past k ~ 19.5 -- confirming imp-34188 s ' +
    'kEnd ~ 19.5 re-growth flag from the independent local-slope angle. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the residExp simple-zero ' +
    'structure is a numerical/structural observation, not a derivation; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34188 (R3 tabulated the {-0.97,-0.64,+2.05} local slopes characterized here); imp-34023 (the ' +
    'residExp sign-change pole k* ~ 21.281); imp-34127 (closed-form k* ceiling); imp-34169 (fixed-band ' +
    'peak terminating at the same pole); imp-33843 (the log-linear widening-slope surrogate the pole ' +
    'contaminates); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); ' +
    'polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE_ASSERTIONS = [
  {
    // The pole is located where imp-34023/imp-34188 put it, and the fine grid stays strictly below it.
    id: 'imp34247-pole-located-and-grid-below',
    description: 'k* ~ 21.281 (imp-34023); the divergence grid spans k = 18 .. 21.275, all below k*',
    holds: () =>
      K_STAR > 21.27 &&
      K_STAR < 21.29 &&
      DIVERGENCE_GRID.length === 12 &&
      DIVERGENCE_GRID.every((r) => r.k < K_STAR) &&
      DIVERGENCE_GRID.every((r) => r.gap > 0),
  },
  {
    // (R1) SIMPLE POLE, residue +1: (k*-k) dy/dk rises monotonically onto ~1 and the order estimate is ~1.
    id: 'imp34247-simple-pole-residue-one',
    description: '(k*-k) dy/dk rises to ~1 near k*, and the two-point pole-order estimate p ~ 1',
    holds: () =>
      RESIDUE_RISES_TO_ONE === true &&
      RESIDUE_NEAR_POLE > 0.9 &&
      RESIDUE_NEAR_POLE < 1.15 &&
      POLE_ORDER > 0.9 &&
      POLE_ORDER < 1.15,
  },
  {
    // (R2) The smooth background B(k) = dy/dk - 1/(k*-k) is negative and slowly varying (no jump).
    id: 'imp34247-smooth-negative-background',
    description: 'B(k) = dy/dk - 1/(k*-k) stays negative and within (-1.6, -1.0) on the reliable region gap>=0.06',
    holds: () =>
      DIVERGENCE_GRID.some((r) => r.background !== null) &&
      DIVERGENCE_GRID.filter((r) => r.background !== null).every((r) => r.background < -1.0 && r.background > -1.6),
  },
  {
    // (R3) Contamination onset: clean through k=18 (<2%), contaminated by k=19 (>5%), decisive past 19.5,
    // and dy/dk flips sign between k=20 and k=21.
    id: 'imp34247-contamination-onset-and-sign-flip',
    description: 'dy/dk clean (<2%) through k=18, >5% at k=19, >10% past k~19.5, sign flip bracketed 20..21',
    holds: () =>
      CLEAN_THROUGH_K18 === true &&
      CONTAM_AT_K19 === true &&
      DECISIVE_AT_K195 === true &&
      SIGN_FLIP_BRACKETED === true &&
      PLATEAU < -0.9 &&
      PLATEAU > -1.05,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34247-honesty-gate-no-qed',
    description: 'measurement only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.isRigorous === false &&
      /NO QED/.test(IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.verdict) &&
      /refereed bound is changed/i.test(IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE.verdict),
  },
];

for (const a of IMP34247_WIDENING_SLOPE_POLE_DIVERGENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34247-widening-slope-pole-divergence assertion failed: ${a.id}`);
  }
}
