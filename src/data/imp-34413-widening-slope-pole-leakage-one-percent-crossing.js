/**
 * @module imp-34413-widening-slope-pole-leakage-one-percent-crossing
 *
 * imp-34413 (numerical, frontier-direction): imp-34326 F3 and imp-34330 F2 both flag the imp-34188
 * widening-slope LOCAL estimate dy/dk as corrupted past k >= 19 by imp-34247 resid_exp pole leakage
 * (>~8% by k=19) plus the imp-34246 V2 hump-turn -- but the exact decade index k where that leakage
 * FIRST crosses 1% was never pinned. imp-34247 R3 tabulated the deviation of dy/dk from its clean far
 * plateau on a COARSE grid (within ~1% through k~18, ~3% at 18.5, ~8% at 19) but only bracketed the 1%
 * threshold between k=18 and k=18.5; it never located the exact crossing. This module bisects the
 * imp-34247 deviation metric to pin the exact 1% crossing, giving the shared clean-window ceiling
 * referenced (but left un-quantified) by imp-34246 / imp-34326 / imp-34330.
 *
 * Measurement only; the component model is NOT rigorous; no bound changes; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED.
 *
 * THE METRIC (imp-34247 R3, reused VERBATIM)
 * ------------------------------------------
 *   y(k) = ln( eflowAttr(k) / residExp(k) ); dy/dk is the symmetric central-difference local slope. The
 *   pole-leakage that corrupts the widening-slope estimate is the DEVIATION of dy/dk from its clean
 *   far-field plateau P = dy/dk(k=14) ~ -0.977, measured as leak(k) = 100 |dy/dk(k) - P| / |P|. This is
 *   exactly the imp-34247 contaminationLadder devPct (the >~8% at k=19 the three tickets cite). Its
 *   growth is driven by the imp-34247 simple pole dy/dk = B(k) + 1/(k* - k) at k* ~ 21.28095: as k -> k*
 *   the pole term 1/(k* - k) grows and leaks into the slope estimate. NOTE the RAW pole-term ratio
 *   (1/(k* - k)) / |dy/dk| is already large in-window (~31% at k=18) because the pole term is present but
 *   largely CANCELLED by the smooth negative background B in the plateau; the physically-meaningful
 *   leakage is the deviation-from-clean-plateau increment, NOT the raw ratio.
 *
 * THE FINDING (exact 1% crossing at k ~ 18.106, with a deep interior minimum at k ~ 17.80)
 * ---------------------------------------------------------------------------------------
 *   (R1) THE POLE-SIDE 1% CROSSING IS k* ~ 18.106. Bisecting leak(k) = 1 on the rising pole-side branch
 *        gives k_1pct ~ 18.10597 -- refining imp-34247 R3 s coarse "within ~1% through k~18, ~3% at 18.5"
 *        bracket to an exact decade index. Rungs k <= 18.10 carry sub-1% pole leakage; k >= 18.11 exceed
 *        it. This is the shared clean-window ceiling imp-34246 / imp-34326 / imp-34330 reference.
 *   (R2) THE LEAKAGE METRIC HAS A DEEP INTERIOR MINIMUM AT k ~ 17.80 (leak ~ 0.009%), then rises
 *        MONOTONICALLY through 1% (k~18.106), 3% (k~18.5), 8% (k=19). The minimum location k ~ 17.80
 *        coincides with imp-34330 F2 s "leading -ln10/2 + ln10*3/u form STOPS IMPROVING at k ~ 17.80" --
 *        an independent cross-consistency: the widening-slope estimate is cleanest exactly where the
 *        imp-34246 leading algebra bottoms out, and both the leading-form residual and the pole leakage
 *        start re-growing from that same k ~ 17.80 knee.
 *   (R3) THE CROSSING IS WELL BELOW k=19. The 1% ceiling k ~ 18.106 sits ~0.89 decades below the k >= 19
 *        break the three tickets flagged and ~3.17 decades below the pole k* ~ 21.281 -- so the honest
 *        clean window for the widening-slope local estimate is k <~ 18.1, TIGHTER than the k~19 the
 *        coarse >~8% figure suggested.
 *
 * The punchline: the three tickets said "corrupted past k >= 19, >~8% by k=19" but never located where
 * leakage FIRST crosses 1%. It crosses at k ~ 18.106 -- ~0.89 decades below k=19 -- after bottoming at a
 * deep ~0.009% minimum at k ~ 17.80 (the same knee where imp-34330 s leading form stops improving). The
 * shared clean-window ceiling is k <~ 18.1, not k~19.
 *
 * MEASUREMENT / THRESHOLD-LOCATION ONLY. A bisection of an inherited surrogate deviation metric near an
 * inherited pole, NOT an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the residExp simple-zero structure is a numerical/structural observation,
 * not a derivation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34247-widening-slope-pole-divergence (R3 contaminationLadder devPct bisected here to the exact 1% crossing)
 * @see imp-34326-widening-slope-background-reconciliation (F3 clean-window match breaks past k>=19)
 * @see imp-34330-widening-residual-prepole-reversal (F2 leading form stops improving at k~17.80 -- matches the leak minimum here)
 * @see imp-34246-widening-slope-limit-analytic-derivation (leading -ln10/2 form whose plateau this clean window shares)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the widening-slope surrogate the pole leakage corrupts)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the residExp sign-change pole k* ~ 21.281)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), exactly as imp-34247
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34247 exactly

// EXACT inherited imp-3406/imp-34247 sub-terms (no re-derivation, no fresh model).
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
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
function residExpAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}
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
function localSlope(k, h) {
  return (yAtK(k + h) - yAtK(k - h)) / (2 * h);
}
function stepFor(k, kStar) {
  const gap = kStar - k;
  return Math.min(0.005, gap / 4); // keep k + h < k* near the pole (imp-34247 convention)
}

// ---- 0. Locate the imp-34023 simple zero k* by bisection on residExp(k) (imp-34247 convention) ----
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 80; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const K_STAR = 0.5 * (clo + chi); // ~ 21.28095 (imp-34023 / imp-34188 / imp-34247 k*)

// The clean far-field plateau P = dy/dk(k=14) ~ -0.977 (imp-34247 PLATEAU), and the pole-leakage metric.
const PLATEAU = localSlope(14, stepFor(14, K_STAR));
const leakPct = (k) => 100 * Math.abs((localSlope(k, stepFor(k, K_STAR)) - PLATEAU) / PLATEAU);

// ---- 1. Locate the deep interior minimum of the leakage metric on the clean window k = 17 .. 18.5 ----
let minK = 17.0;
let minV = Infinity;
for (let k = 17.0; k <= 18.5 + 1e-9; k += 0.01) {
  const v = leakPct(k);
  if (v < minV) {
    minV = v;
    minK = k;
  }
}
const LEAK_MIN_K = +minK.toFixed(3); // ~17.80 -- coincides with imp-34330 F2 leading-form knee
const LEAK_MIN_PCT = +minV.toFixed(4); // ~0.009%

// ---- 2. Bisect the RISING pole-side branch (from the minimum toward k=19) for leak(k) = 1% ----
let a = LEAK_MIN_K;
let b = 19.0;
for (let it = 0; it < 100; it++) {
  const m = 0.5 * (a + b);
  if (leakPct(m) < 1.0) a = m;
  else b = m;
}
const K_ONE_PCT = +(0.5 * (a + b)).toFixed(5); // ~18.10597 -- exact 1% pole-leakage crossing

// ---- 3. Coarse ladder for context (matches imp-34247 R3 milestones) ----
const LEAK_LADDER = [17.8, 18.0, K_ONE_PCT, 18.5, 19.0, 19.5, 20.0].map((k) => ({
  k,
  leakPct: +leakPct(k).toFixed(4),
}));
// Monotone rise from the minimum through the coarse ladder (each rung >= the previous past the knee).
const MONOTONE_RISE = LEAK_LADDER.every((r, i) => i === 0 || r.leakPct >= LEAK_LADDER[i - 1].leakPct - 1e-9);
const DECADES_BELOW_K19 = +(19.0 - K_ONE_PCT).toFixed(3); // ~0.894 decades below the k>=19 break
const DECADES_BELOW_POLE = +(K_STAR - K_ONE_PCT).toFixed(3); // ~3.175 decades below the pole

export const IMP34413_WIDENING_SLOPE_POLE_LEAKAGE_ONE_PERCENT_CROSSING = {
  id: 'imp-34413',
  proofSection: 'S-frontier',
  question:
    'imp-34326 F3 and imp-34330 F2 both flag the imp-34188 widening-slope local estimate dy/dk as ' +
    'corrupted past k >= 19 by imp-34247 resid_exp pole leakage (>~8% by k=19), but the exact decade ' +
    'index k where that leakage FIRST crosses 1% was never pinned -- imp-34247 R3 only bracketed it ' +
    'between k=18 and k=18.5 on a coarse grid. Bisect the imp-34247 deviation-from-plateau metric to ' +
    'locate the exact 1% crossing, giving the shared clean-window ceiling. Measurement only; component ' +
    'model NOT rigorous; no bound changes; NO QED.',
  measuredQuantity:
    'The imp-34247 pole-leakage metric leak(k) = 100 |dy/dk(k) - P| / |P| (P = dy/dk(k=14) ~ -0.977): ' +
    'its deep interior minimum on k = 17 .. 18.5, and the exact k where the rising pole-side branch ' +
    'first crosses 1%, bisected to 5 decimals',
  poleLocation: +K_STAR.toFixed(5), // ~21.28095 (imp-34023 / imp-34247 k*)
  plateau: +PLATEAU.toFixed(4), // ~ -0.977 (imp-34247 far-field clean plateau)
  leakMinK: LEAK_MIN_K, // ~17.80 -- coincides with imp-34330 F2 leading-form knee
  leakMinPct: LEAK_MIN_PCT, // ~0.009% -- the cleanest rung
  onePctCrossingK: K_ONE_PCT, // ~18.10597 -- the exact 1% pole-leakage crossing
  leakLadder: LEAK_LADDER, // leak(k) at the k~17.8..20 milestones (matches imp-34247 R3)
  monotoneRiseFromMin: MONOTONE_RISE, // leak rises monotonically from the k~17.8 minimum onward
  decadesBelowK19: DECADES_BELOW_K19, // ~0.894 -- the 1% ceiling sits below the k>=19 break
  decadesBelowPole: DECADES_BELOW_POLE, // ~3.175 -- and well below the pole k*
  finding: {
    R1_one_percent_crossing_k18_106:
      'Bisecting the imp-34247 pole-leakage metric leak(k) = 100 |dy/dk(k) - P| / |P| on its rising ' +
      'pole-side branch gives the exact 1% crossing k ~ 18.10597 -- refining imp-34247 R3 s coarse ' +
      '"within ~1% through k~18, ~3% at 18.5" bracket to an exact decade index. Rungs k <= 18.10 carry ' +
      'sub-1% pole leakage; k >= 18.11 exceed it. This is the shared clean-window ceiling.',
    R2_deep_minimum_at_k17_80:
      'The leakage metric has a deep interior minimum leak ~ 0.009% at k ~ 17.80, then rises ' +
      'monotonically through 1% (k~18.106), 3% (k~18.5), 8% (k=19). The minimum k ~ 17.80 coincides ' +
      'with imp-34330 F2 s leading-form knee (the -ln10/2 + ln10*3/u form stops improving at k ~ 17.80): ' +
      'the widening-slope estimate is cleanest exactly where the imp-34246 leading algebra bottoms out.',
    R3_ceiling_tighter_than_k19:
      'The 1% ceiling k ~ 18.106 sits ~0.89 decades below the k >= 19 break the three tickets flagged ' +
      'and ~3.17 decades below the pole k* ~ 21.281 -- so the honest clean window for the widening-slope ' +
      'local estimate is k <~ 18.1, TIGHTER than the k~19 the coarse >~8% figure suggested.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / THRESHOLD-LOCATION (frontier-direction, NOT rigorous). The imp-34247 pole-leakage ' +
    'metric leak(k) = 100 |dy/dk(k) - P| / |P| into the imp-34188 widening-slope local estimate first ' +
    'crosses 1% at k ~ 18.10597 -- refining imp-34247 R3 s coarse k=18..18.5 bracket -- after bottoming ' +
    'at a deep ~0.009% minimum at k ~ 17.80 (the same knee where imp-34330 F2 s leading form stops ' +
    'improving) and rising monotonically through 3% (k~18.5) and 8% (k=19). The shared clean-window ' +
    'ceiling for the widening-slope estimate is therefore k <~ 18.1 -- ~0.89 decades below the k >= 19 ' +
    'break imp-34326 F3 / imp-34330 F2 flagged and ~3.17 decades below the pole k* ~ 21.28095. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'residExp simple-zero structure is a numerical/structural observation, not a derivation; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34247 (R3 contaminationLadder devPct bisected here to the exact 1% crossing); imp-34326 (F3 ' +
    'clean-window match breaks past k>=19); imp-34330 (F2 leading form stops improving at k~17.80, ' +
    'matching the leak minimum); imp-34246 (leading -ln10/2 form plateau); imp-34188 (the widening-slope ' +
    'surrogate); imp-34023 (residExp pole k* ~ 21.281); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34413_WIDENING_SLOPE_POLE_LEAKAGE_ONE_PERCENT_CROSSING_ASSERTIONS = [
  {
    // The pole and plateau match imp-34247, and the crossing is bracketed strictly below the pole.
    id: 'imp34413-pole-plateau-inherited',
    description: 'k* ~ 21.281 and P ~ -0.977 match imp-34247; the 1% crossing lies below both',
    holds: () =>
      K_STAR > 21.27 &&
      K_STAR < 21.29 &&
      PLATEAU < -0.9 &&
      PLATEAU > -1.05 &&
      K_ONE_PCT < K_STAR,
  },
  {
    // (R1) The exact 1% crossing sits in imp-34247 R3 s coarse (18, 18.5) bracket, near 18.106.
    id: 'imp34413-one-percent-crossing-located',
    description: 'leak(k)=1% crossing k ~ 18.106, inside imp-34247 R3 s coarse k=18..18.5 bracket',
    holds: () =>
      K_ONE_PCT > 18.0 &&
      K_ONE_PCT < 18.5 &&
      Math.abs(K_ONE_PCT - 18.106) < 0.01 &&
      leakPct(K_ONE_PCT) > 0.99 &&
      leakPct(K_ONE_PCT) < 1.01,
  },
  {
    // (R2) Deep interior minimum near k~17.80 (matching imp-34330 F2), rising monotonically past it.
    id: 'imp34413-deep-minimum-at-knee',
    description: 'leak metric bottoms ~0.01% at k ~ 17.80 (imp-34330 knee) then rises monotonically',
    holds: () =>
      LEAK_MIN_K > 17.6 &&
      LEAK_MIN_K < 18.0 &&
      LEAK_MIN_PCT < 0.1 &&
      MONOTONE_RISE === true,
  },
  {
    // (R3) The ceiling is meaningfully below the k>=19 break and well below the pole.
    id: 'imp34413-ceiling-below-k19',
    description: 'the 1% ceiling k ~ 18.106 is ~0.89 decades below k=19 and ~3.17 below the pole',
    holds: () =>
      DECADES_BELOW_K19 > 0.8 &&
      DECADES_BELOW_K19 < 1.0 &&
      DECADES_BELOW_POLE > 3.0 &&
      DECADES_BELOW_POLE < 3.4,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34413-honesty-gate-no-qed',
    description: 'measurement only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34413_WIDENING_SLOPE_POLE_LEAKAGE_ONE_PERCENT_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP34413_WIDENING_SLOPE_POLE_LEAKAGE_ONE_PERCENT_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP34413_WIDENING_SLOPE_POLE_LEAKAGE_ONE_PERCENT_CROSSING.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34413_WIDENING_SLOPE_POLE_LEAKAGE_ONE_PERCENT_CROSSING.verdict),
  },
];

for (const a of IMP34413_WIDENING_SLOPE_POLE_LEAKAGE_ONE_PERCENT_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34413-widening-slope-pole-leakage-one-percent-crossing assertion failed: ${a.id}`);
  }
}
