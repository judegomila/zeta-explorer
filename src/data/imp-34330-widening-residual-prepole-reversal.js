/**
 * @module imp-34330-widening-residual-prepole-reversal
 *
 * imp-34330 (numerical, opus-4-8): Measure whether the imp-34246 two-term prediction residual
 * (measured local widening-slope minus -ln10/2 + ln10*3/u) keeps shrinking toward the resid_exp pole
 * or REVERSES when the hump turns -- on the finer grid k = 18..20.5 approaching k* ~ 21.281.
 *
 * THE OPEN QUESTION (imp-34246 S3 vs V2)
 * -------------------------------------
 * imp-34246 S3 reported the two-term prediction  pred(k) = -ln10/2 + ln10*3/u  (u = log(T0/2pi))
 * tracks the measured local widening-slope  dy/dk,  y = ln(eflow_attr/resid_exp),  across k = 12..18
 * with the residual  meas - pred  shrinking in magnitude 0.099 -> 0.008. But imp-34246 V2 also noted
 * resid_exp is a HUMP through zero at k* ~ 21.281 (the imp-34023 M2 ceiling): past the hump peak
 * (k ~ 15.9) the local d ln resid_exp/d ln N turns and diverges to +inf at k* (the imp-34247 simple
 * pole, residue +1). The imp-34246 ladder stopped at k = 18, leaving unmeasured whether the residual
 * continues its monotone shrink toward zero as the pole is approached, or REVERSES / re-grows as the
 * hump-turn + pole contamination corrupts the finite-decade local slope estimate.
 *
 * THIS MODULE -- FINER PRE-POLE GRID AND THE REVERSAL
 * --------------------------------------------------
 * Reusing the IDENTICAL imp-34246 sub-terms verbatim (parts, rung, localSlope, the two-term pred),
 * this import-light self-asserting module extends the residual measurement onto a fine k grid to
 * k = 20.5..20.75 (one step short of the pole) and locates the k beyond which the leading form
 * stops improving.
 *
 * (F1) The residual does NOT keep shrinking toward the pole -- it REVERSES. Its magnitude shrinks
 *      monotonically 0.0991 (k=12) -> ~0.0016 (k=17.75), passing through zero (meas == pred) at
 *      k_best ~ 17.80, and then FLIPS SIGN (negative -> positive) and re-grows/DIVERGES: +0.008
 *      (k=18), +0.036 (k=18.5), +0.358 (k=20), +0.818 (k=20.5), +1.401 (k=20.75). By k = 20.5 the
 *      residual magnitude (0.82) is ~8x its k=12 starting value -- the opposite of convergence.
 *
 * (F2) The leading -ln10/2 + ln10*3/u form STOPS IMPROVING at k ~ 17.80 -- ~3.48 decades BELOW the
 *      M2 ceiling k* ~ 21.281 and ~1.90 decades PAST the resid_exp hump peak (k ~ 15.90, f ~ 0.401).
 *      So the "improving toward the pole" reading of imp-34246 S3 holds ONLY on the pre-turn side;
 *      the zero-crossing is a finite-window coincidence (the shrinking negative residual happens to
 *      pass through zero just as the pole-driven up-turn overtakes it), NOT an approach to the limit.
 *
 * (F3) The re-growth is HUMP-TURN / POLE contamination, not a failure of the leading algebra. Past
 *      the hump peak the local d ln resid_exp/d ln N turns toward +inf at k* (imp-34247), so resid_exp
 *      collapses FASTER than E_coll (the hump coefficient f = resid_exp/(E_coll/E_trunc) decays 0.401
 *      -> 0.168) and the MEASURED local slope is lifted up toward 0 and beyond (it is POSITIVE by
 *      k >= 20.75), while the two-term PREDICTION keeps its smooth monotone decline toward -ln10/2.
 *      The residual divergence is therefore the imp-34246 V2 pole truncation made quantitative: the
 *      descriptive fit samples ONLY the pre-turn shrink window k < 17.8, and the -1.151 leading value
 *      is never approached because the pole corrupts the slope ~3.5 decades before k*.
 *
 * SO the imp-34246 residual has a well-defined pre-pole MINIMUM (a sign-change through zero) at
 * k ~ 17.80, not a monotone shrink to zero: the two-term form improves up to k ~ 17.8 and then
 * REVERSES and diverges as the resid_exp hump turns and the imp-34247 pole is approached.
 *
 * HONEST SCOPE -- measurement only, NO QED. This measures the inherited imp-34246/imp-33810 component
 * model on a finer grid; it changes no bound and introduces no new mathematical claim. The component
 * model is NOT a rigorous asymptotic. resid_exp is the E_coll-order finite-decade remnant (imp-34246 S2)
 * and its pole is the imp-34023 M2 sign-change ceiling, NOT a statement about the divergent C_Lip
 * collision-Gronwall. The C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C
 * 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator
 * positivity; changes no bound; NO QED; no refereed bound is changed.
 *
 * @see imp-34246-widening-slope-limit-analytic-derivation (the two-term prediction and k<=18 residual this extends)
 * @see imp-34247-widening-slope-pole-divergence (the resid_exp simple pole at k*~21.281, residue +1)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the resid_exp sign-change ceiling k*~21.281)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the eflow_attr/resid_exp ladder and inherited parts)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg))
 * @see imp-34326-widening-slope-background-reconciliation (sibling: reconciles the two-term prediction this residual is measured against)
 * @see imp-34327-widening-slope-minus-one-crossing-location (sibling: the exact -1 crossing this module finds reappears as a pre-pole sign flip)
 * @see imp-34329-crossover-surplus-fartail-composite-limit (sibling: same k*~21.281-ceiling era, far-tail composite-exponent extension)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5;
const GRONWALL = Math.exp(1.0 * 2.37e-4); // matches imp-33810/imp-34246 exactly
const LN10 = Math.LN10;

// EXACT inherited imp-34246/imp-33810 parts (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExp(lo, hi, ppd = 4) {
  const step = 1 / ppd;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(lo); d <= Math.log10(hi) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
const ecollExpMag = (lo, hi) => -Math.log(parts(hi).E_coll / parts(lo).E_coll) / Math.log(hi / lo);
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * LN10);
}
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExp(lo, hi);
  const pEcoll = ecollExpMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return { k, residExp, eflowAttr, y: Math.log(eflowAttr / residExp), ph };
}
function localSlope(k) {
  const dk = 0.01;
  return (rung(k + dk).y - rung(k - dk).y) / (2 * dk);
}

// The imp-34246 two-term prediction: pred(k) = -ln10/2 + ln10*3/u, u = log(T0(hi)/2pi).
const LEADING_SLOPE = -LN10 / 2; // -1.15129...
function predAt(k) {
  const u = Math.log(parts(Math.pow(10, k + 1)).T0 / TWO_PI);
  return { u, pred: LEADING_SLOPE + (LN10 * 3) / u };
}
function residualAt(k) {
  const { u, pred } = predAt(k);
  const meas = localSlope(k);
  return { k, u, pred, meas, residual: meas - pred };
}

// ── Fine pre-pole grid k = 12..20.75 (quarter-decade steps; one step short of k*~21.281) ──────
const GRID = [];
for (let i = 0; i <= 35; i++) {
  const k = +(12 + 0.25 * i).toFixed(2); // 12.00 .. 20.75
  const r = residualAt(k);
  const rr = rung(k);
  GRID.push({
    k,
    u: +r.u.toFixed(3),
    predicted: +r.pred.toFixed(5),
    measured: +r.meas.toFixed(5),
    residual: +r.residual.toFixed(5),
    residExp: +rr.residExp.toExponential(4),
    humpF: +(rr.residExp / (rr.ph.E_coll / E_TRUNC)).toFixed(4), // resid_exp/(E_coll/E_trunc)
  });
}

// ── Locate the residual magnitude minimum (the k where the leading form stops improving) ──────
let MIN_ABS = Infinity;
let MIN_IDX = -1;
for (let i = 0; i < GRID.length; i++) {
  const a = Math.abs(GRID[i].residual);
  if (a < MIN_ABS) {
    MIN_ABS = a;
    MIN_IDX = i;
  }
}
const K_MIN_ABS = GRID[MIN_IDX].k;

// Fine zero-crossing (meas == pred) of the residual, bisection on the sign flip near the minimum.
function residualValue(k) {
  return residualAt(k).residual;
}
let lo = 17.0;
let hi = 18.5;
// residual is negative at lo, positive at hi in this window (shrinking negative -> pole up-turn).
for (let i = 0; i < 80; i++) {
  const mid = 0.5 * (lo + hi);
  if (residualValue(mid) < 0) lo = mid;
  else hi = mid;
}
const K_BEST = +(0.5 * (lo + hi)).toFixed(4); // ~17.798: leading form stops improving here

// resid_exp hump peak (imp-34246 S2 landmark, for the "hump turn" location).
let HUMP_K = 0;
let HUMP_F = -1;
for (let k = 10; k <= 20; k += 0.05) {
  const rr = rung(k);
  const f = rr.residExp / (rr.ph.E_coll / E_TRUNC);
  if (f > HUMP_F) {
    HUMP_F = f;
    HUMP_K = +k.toFixed(2);
  }
}

const SIGN_CHANGE_CEILING = 21.281; // imp-34023/imp-34246 bisected kEnd*
const RES_K12 = GRID[0].residual; // -0.0991 (start)
const RES_K18 = GRID.find((g) => g.k === 18).residual; // already POSITIVE: sign flipped
const RES_K205 = GRID.find((g) => g.k === 20.5).residual; // diverged, magnitude >> start

export const IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL = {
  id: 'imp-34330',
  proofSection: 'S-frontier',
  question:
    'imp-34246 S3 reported the two-term prediction -ln10/2 + ln10*3/u tracks the measured local ' +
    'widening-slope across k=12..18 with residual shrinking 0.099 -> 0.008, but V2 noted resid_exp is a ' +
    'hump through zero at k*~21.281 whose local exponent turns past the peak (k~15.9). Measure the residual ' +
    'on the finer grid k=18..20.5 approaching the pole: does it keep shrinking toward zero, or REVERSE and ' +
    're-grow as the hump-turn + imp-34247 pole contamination corrupts the local slope? Locate the k beyond ' +
    'which the leading form stops improving. Measurement only; component model NOT rigorous; NO QED.',
  answer:
    'The residual does NOT keep shrinking -- it REVERSES. Its magnitude shrinks monotonically 0.0991 (k=12) ' +
    '-> ~0.0016 (k=17.75), passes through zero (meas == pred) at k_best ~ 17.80, then FLIPS SIGN and ' +
    're-grows/DIVERGES: +0.008 (k=18), +0.036 (k=18.5), +0.358 (k=20), +0.818 (k=20.5), +1.401 (k=20.75). ' +
    'The leading -ln10/2 + ln10*3/u form STOPS IMPROVING at k ~ 17.80 -- ~3.48 decades below the M2 ceiling ' +
    'k*~21.281 and ~1.90 decades past the resid_exp hump peak (k~15.90). The re-growth is hump-turn / pole ' +
    'contamination: past the peak the local d ln resid_exp/d ln N turns toward +inf at k* (imp-34247), so ' +
    'resid_exp collapses faster than E_coll (hump coefficient 0.401 -> 0.168) and the MEASURED slope is lifted ' +
    'up toward 0 (positive by k>=20.75) while the two-term PREDICTION keeps declining toward -ln10/2. So the ' +
    'imp-34246 zero-crossing is a finite-window coincidence, NOT an approach to the -1.151 leading value; the ' +
    'descriptive fit samples only the pre-turn shrink window k<17.8, exactly as imp-34246 V2 warned.',
  grid: GRID,
  residualMinAbs: +MIN_ABS.toFixed(5),
  kAtResidualMinAbs: K_MIN_ABS,
  kWhereLeadingFormStopsImproving: K_BEST, // ~17.80
  decadesBelowCeiling: +(SIGN_CHANGE_CEILING - K_BEST).toFixed(3),
  humpPeakK: HUMP_K,
  humpPeakF: +HUMP_F.toFixed(4),
  decadesPastHumpPeak: +(K_BEST - HUMP_K).toFixed(3),
  signChangeCeilingKStar: SIGN_CHANGE_CEILING,
  residualAtK12: +RES_K12.toFixed(5),
  residualAtK18: +RES_K18.toFixed(5),
  residualAtK205: +RES_K205.toFixed(5),
  residualReverses: true,
  residualMonotoneShrinkToZero: false,
  isRigorous: false,
  finding: {
    F1_residual_reverses:
      'The imp-34246 two-term residual does NOT continue its monotone shrink toward the pole: |residual| ' +
      'shrinks 0.0991 (k=12) -> ~0.0016 (k=17.75), crosses zero at k_best ~ 17.80, then flips sign and ' +
      're-grows/diverges to +0.818 (k=20.5) and +1.401 (k=20.75) -- by k=20.5 the magnitude is ~8x its k=12 ' +
      'start, the opposite of convergence.',
    F2_leading_form_stops_improving_k17_8:
      'The leading -ln10/2 + ln10*3/u form stops improving at k ~ 17.80, ~3.48 decades below the M2 ceiling ' +
      'k*~21.281 and ~1.90 decades past the resid_exp hump peak (k~15.90, f~0.401). The zero-crossing is a ' +
      'finite-window coincidence -- the shrinking negative residual passes through zero just as the ' +
      'pole-driven up-turn overtakes it -- NOT an approach to the -1.151 leading value.',
    F3_regrowth_is_pole_contamination:
      'The re-growth is hump-turn / pole contamination: past the peak the local d ln resid_exp/d ln N turns ' +
      'toward +inf at k* (imp-34247), so resid_exp collapses faster than E_coll (hump coefficient decays ' +
      '0.401 -> 0.168) and the MEASURED slope is lifted up toward 0 and beyond (positive by k>=20.75) while ' +
      'the two-term PREDICTION keeps its smooth monotone decline toward -ln10/2. This makes the imp-34246 V2 ' +
      'pole truncation quantitative: the fit samples only the pre-turn shrink window k<17.8.',
  },
  honestScope:
    'Measurement only on the inherited imp-34246/imp-33810 component model on a finer grid; NO QED. The ' +
    'component model is NOT a rigorous asymptotic; resid_exp is the E_coll-order finite-decade remnant ' +
    '(imp-34246 S2) and its pole is the imp-34023 M2 sign-change ceiling, NOT a statement about the ' +
    'divergent C_Lip collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll ' +
    'untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'establishes no operator positivity; changes no bound; NO QED; no refereed bound is changed' +
    '.',
  citation:
    'imp-34246-widening-slope-limit-analytic-derivation.js (the two-term prediction and k<=18 residual this ' +
    'extends); imp-34247-widening-slope-pole-divergence.js (the resid_exp simple pole at k*~21.281, residue ' +
    '+1); imp-34023-eflow-widening-ratio-f4-collapse-extrapolation.js (the sign-change ceiling); ' +
    'imp-33810-eflow-resid-ratio-N-ladder.js (inherited parts); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL_ASSERTIONS = [
  {
    // F1: the residual REVERSES sign -- negative at k=12 (start), positive at k=18 (past crossing).
    id: 'imp34330-residual-flips-sign',
    description: 'the two-term residual is negative at k=12 (~ -0.099) and has flipped POSITIVE by k=18 -- a sign reversal, not a monotone shrink to zero',
    holds: () => RES_K12 < -0.05 && RES_K18 > 0,
  },
  {
    // F1: the residual DIVERGES -- magnitude at k=20.5 far exceeds the k=12 starting magnitude.
    id: 'imp34330-residual-diverges-past-crossing',
    description: 'the residual magnitude re-grows past the crossing so that |residual(k=20.5)| >> |residual(k=12)| (diverging, not converging)',
    holds: () => Math.abs(RES_K205) > 5 * Math.abs(RES_K12) && RES_K205 > 0.5,
  },
  {
    // F2: the residual magnitude minimum is INTERIOR (near k~17.8), not at the pole-side endpoint.
    id: 'imp34330-min-is-interior-near-17-8',
    description: 'the residual magnitude minimum occurs at an interior k in (17.5, 18.0), NOT at the pole-side endpoint k=20.75; |residual| there is < 0.01',
    holds: () =>
      K_MIN_ABS > 17.5 &&
      K_MIN_ABS < 18.0 &&
      MIN_ABS < 0.01 &&
      MIN_IDX > 0 &&
      MIN_IDX < GRID.length - 1,
  },
  {
    // F2: the leading form stops improving at k_best ~ 17.80, well below the ceiling and past the hump peak.
    id: 'imp34330-kbest-below-ceiling-past-hump',
    description: 'k_best (leading form stops improving) is ~17.80, ~3.48 decades below the M2 ceiling 21.281 and past the resid_exp hump peak k~15.90',
    holds: () =>
      Math.abs(K_BEST - 17.798) < 0.05 &&
      K_BEST < SIGN_CHANGE_CEILING - 3 &&
      K_BEST > HUMP_K &&
      HUMP_K > 15.5 &&
      HUMP_K < 16.5,
  },
  {
    // F1 shape: |residual| shrinks monotonically before the crossing and grows monotonically after it.
    id: 'imp34330-monotone-shrink-then-monotone-regrowth',
    description: 'on the grid, |residual| decreases monotonically up to the minimum index and increases monotonically after it (a single interior minimum)',
    holds: () => {
      for (let i = 1; i <= MIN_IDX; i++) if (!(Math.abs(GRID[i].residual) < Math.abs(GRID[i - 1].residual))) return false;
      for (let i = MIN_IDX + 1; i < GRID.length; i++) if (!(Math.abs(GRID[i].residual) > Math.abs(GRID[i - 1].residual))) return false;
      return true;
    },
  },
  {
    // F3: the hump coefficient turns down (collapses toward the pole) -- peak ~0.401 at k~15.9, decayed by k=20.5.
    id: 'imp34330-hump-coefficient-turns-down',
    description: 'the resid_exp hump coefficient peaks ~0.401 near k~15.9 and has collapsed well below it (< 0.25) by k=20.5, driving the measured-slope up-turn',
    holds: () => {
      const peak = HUMP_F;
      const late = GRID.find((g) => g.k === 20.5).humpF;
      return peak > 0.38 && peak < 0.42 && late < 0.25 && late < peak;
    },
  },
  {
    // F3: the measured local slope is lifted up toward 0 and turns POSITIVE by the last pre-pole rung.
    id: 'imp34330-measured-slope-turns-positive',
    description: 'the measured local slope, tracking the prediction while shrinking, peels up and turns POSITIVE by k=20.75 (predicted still ~ -1.0) -- pole contamination',
    holds: () => {
      const last = GRID.find((g) => g.k === 20.75);
      return last.measured > 0 && last.predicted < -0.99;
    },
  },
  {
    // Honesty gate: measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34330-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause and imp-3066 K_a>=0; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL.honestScope) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL.honestScope) &&
      /NO QED/.test(IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL.honestScope) &&
      /refereed bound is changed/i.test(IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL.honestScope),
  },
];

for (const a of IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34330-widening-residual-prepole-reversal assertion failed: ${a.id}`);
  }
}

export default IMP34330_WIDENING_RESIDUAL_PREPOLE_REVERSAL;
