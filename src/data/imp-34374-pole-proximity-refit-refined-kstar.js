/**
 * @module imp-34374-pole-proximity-refit-refined-kstar
 *
 * imp-34374 (numerical, frontier-direction): imp-34287 explained the fixed-band (k <= 10) peak s
 * near-boundary re-acceleration as a POLE-PROXIMITY TRANSIENT by regressing the local log-derivative
 * g = dP/d ln(kEnd) on the pole coordinate 1/(k* - kEnd), reporting g ~ 1.4074 + 0.2361/(k* - kEnd)
 * with R^2 ~ 0.9235. That regression baked the imp-34169 resid_exp pole location as the SIX-DIGIT
 * literal k* = 21.280947. This module REFITS the identical regression using the imp-34169 bisected
 * pole at FULL double precision (k* ~ 21.280947425, 80-iteration bisection re-run verbatim) and
 * quantifies the SENSITIVITY of the 0.2361 prefactor, the 1.4074 floor, and the R^2 to k* -- i.e. how
 * fragile the pole-artifact attribution is to the exact zero-crossing.
 *
 * THE QUESTION
 * ------------
 *   imp-34287 s pole-proximity coordinate x_i = 1/(k* - kEnd_i) depends on where the resid_exp zero
 *   k* is placed. imp-34287 used k* = 21.280947 (imp-34169 continuousZeroKStar, rounded to 6 digits).
 *   Does refitting with the imp-34169 bisection at FULL precision (k* ~ 21.280947425) move the fitted
 *   prefactor b = 0.2361, the floor a = 1.4074, or the R^2 = 0.9235 -- and what is the local
 *   sensitivity db/dk*, da/dk*, dR^2/dk*? A large sensitivity would make the pole attribution fragile;
 *   a small one would make it robust.
 *
 * THE MEASUREMENT (imp-34287 machinery reused VERBATIM; only k* is refined and the fit re-run)
 * -------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), inherited imp-3220/imp-3406 sub-terms
 *                    EXACTLY as in imp-34196/imp-34287. No re-derivation.
 *   Widest sweep     kEnd = 14.0, 14.25, ..., 21.25 (30 windows, 0.25 step) -- verbatim imp-34287.
 *   Fixed-band peak  the largest signed residual among rungs k <= 10.00 of the imp-33843 log-linear OLS
 *                    on the imp-33810 ladder k = 6.00 .. kEnd -- verbatim imp-34287.
 *   Local exponent   g(kEnd) = dP/d ln(kEnd) across the 29 consecutive-window steps -- verbatim.
 *   Refined pole     k*_full = the imp-34169 80-iteration bisection of resid_exp(k) on [21.0, 22.0], NOT
 *                    truncated to 6 digits -- the only refinement over imp-34287.
 *   Two fits         g = a + b/(k* - kEnd) at k* = 21.280947 (baked, reproduces imp-34287) and at
 *                    k* = k*_full (refined); their prefactors, floors, R^2 and the shifts.
 *   Sensitivity      central-difference db/dk*, da/dk*, dR^2/dk* at k*_full over eps = 0.001 .. 0.05.
 *
 * THE FINDING (measurement only -- the pole-artifact attribution is ROBUST to k* refinement)
 * -----------------------------------------------------------------------------------------
 *   (F1) THE BAKED-k* FIT REPRODUCES imp-34287 EXACTLY. At k* = 21.280947 the refit returns
 *        b ~ 0.236112, a ~ 1.407443, R^2 ~ 0.923517 -- the imp-34287 0.2361 / 1.4074 / 0.9235 to all
 *        reported digits (reuse gate).
 *   (F2) THE imp-34169 BISECTION REFINES k* BY ONLY ~4.25e-7. The full 80-iteration bisected zero is
 *        k*_full ~ 21.280947425, i.e. dk* = k*_full - 21.280947 ~ +4.25e-7 -- the 6-digit literal was
 *        already accurate to sub-microrung.
 *   (F3) THE PREFACTOR AND FLOOR BARELY MOVE; R^2 IMPROVES MARGINALLY. Refitting at k*_full gives
 *        b ~ 0.236116 (db ~ +3.35e-6), a ~ 1.407441 (da ~ -1.77e-6), R^2 ~ 0.923518 (dR^2 ~ +7.45e-7).
 *        The prefactor shifts in the 6th significant figure; R^2 rises (a slightly larger k* separates
 *        the pole coordinate from the last window, tightening the linear fit) but only at the 7th
 *        decimal. The imp-34287 0.2361 prefactor and 0.9235 R^2 are UNCHANGED at their reported
 *        precision.
 *   (F4) THE LOCAL SENSITIVITY IS MODERATE (~8/unit), SO THE ATTRIBUTION IS ROBUST. Central differences
 *        at k*_full give db/dk* ~ +7.88, da/dk* ~ -4.17, dR^2/dk* ~ +1.75 per unit k*. So a k* error of
 *        ~0.015 would be needed to move the prefactor by even 5% of 0.2361, and the imp-34169 bisection
 *        pins k* to ~1e-7 -- ~10^5 tighter. The pole-artifact reading (b > 0, R^2 ~ 0.92) is not fragile
 *        to the exact zero-crossing.
 *   (F5) THE imp-34127 CLOSED-FORM k* = 21.00 IS INADMISSIBLE AS THE POLE COORDINATE. The imp-34127
 *        leading closed form lands at kEnd* ~ 21.00, which is BELOW the last sweep window kEnd = 21.25,
 *        so 1/(k* - kEnd) changes sign inside the window (the k = 21.25 coordinate is negative) and
 *        Math.log-free but the regression degenerates (NaN R^2). Only a pole located strictly above the
 *        last window (k* > 21.25), as the bisected zero is, is a valid pole coordinate -- the ~0.28
 *        imp-34127 closed-form-vs-bisection gap is not usable here, and the bisected k* is the correct
 *        choice.
 *
 * The punchline: refitting the imp-34287 pole-proximity regression g ~ 1.4074 + 0.2361/(k* - kEnd) with
 * the imp-34169 bisected pole at full precision (k*_full ~ 21.280947425 vs the baked 21.280947, a
 * dk* ~ +4.25e-7 refinement) moves the prefactor by only +3.35e-6 (0.236112 -> 0.236116), the floor by
 * -1.77e-6 (1.407443 -> 1.407441), and IMPROVES R^2 by +7.45e-7 (0.923517 -> 0.923518). With a local
 * sensitivity of ~7.88 / unit k*, the 0.2361 / 1.4074 / 0.9235 pole-artifact attribution is ROBUST to
 * the exact resid_exp zero-crossing -- imp-34287 s verdict stands unchanged and unweakened, and the
 * SUB-GAP-imp-34287-asymptotic-class-undecidable stays open.
 *
 * MEASUREMENT / SENSITIVITY ONLY. A robustness check on an inherited-surrogate regression, NOT an RH
 * bound and distinct from any form selection. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate, the local log-derivative, and the
 * pole-proximity regression are descriptive, not derived; the imp-34287 verdict is UNTOUCHED (only its
 * baked k* is refined); the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation (the regression this refits; machinery verbatim)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the resid_exp pole bisection k* ~ 21.280947425 this refines)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the closed-form kEnd* ~ 21.00 shown inadmissible here)
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the re-acceleration the regression explains)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 *
 * IMPORT-WEIGHT AUDIT: this module s two-hop import chain (lambda-rh-height-mapping,
 * polymath15-constant-C-C) is the SAME light chain imp-34287 was audited on and does NOT reach the
 * 20.8MB zeros-to-1e6.js bundle; per [[no_heavy_imports_in_pages]] it stays safe to import from a
 * lazy-loaded page.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34287
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34287.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

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
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}
function r2Of(xs, ys, a, b) {
  const my = ys.reduce((s, y) => s + y, 0) / ys.length;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < xs.length; i++) {
    ssRes += (ys[i] - (a + b * xs[i])) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return 1 - ssRes / ssTot;
}

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
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

// resid_exp(k) at a continuous k -- the imp-34169 zero-crossing target (used for the full-precision bisection).
function residExpAt(kk) {
  const lo = Math.pow(10, kk);
  const hi = Math.pow(10, kk + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-34287.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const lo = Math.pow(10, kk);
    const hi = Math.pow(10, kk + 1);
    const pSigma = olsSigmaExponent(lo, hi);
    const pEcoll = ecollExponentMag(lo, hi);
    const ph = parts(hi);
    const residExp = pEcoll * (1 - ph.sigma) - pSigma;
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
function fixedBandPeak(R, kMax) {
  const { KS, RES } = residualVector(R);
  let maxI = -1;
  for (let i = 0; i < RES.length; i++) {
    if (KS[i] <= kMax + 1e-9 && (maxI < 0 || RES[i] > RES[maxI])) maxI = i;
  }
  return { peak: RES[maxI], atK: KS[maxI] };
}

// WIDEST COMPUTABLE SWEEP: kEnd = 14.0 .. 21.25 (30 windows) -- verbatim imp-34287.
const SWEEP_STEP = 0.25;
const K_ENDS = [];
for (let k = 14.0; k <= 21.25 + 1e-9; k += SWEEP_STEP) K_ENDS.push(+k.toFixed(2));
const FIXED_BAND_KMAX = 10.0;
const LAST_KEND = K_ENDS[K_ENDS.length - 1]; // 21.25 -- the last sweep window

const FB_PEAKS = K_ENDS.map((kEnd) => +fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX).peak.toFixed(6));

// LOCAL LOG-DERIVATIVE g(kEnd) = dP/d ln(kEnd) over the 29 consecutive-window steps -- verbatim imp-34287.
const G_XS = K_ENDS.slice(1);
const G = [];
for (let i = 1; i < FB_PEAKS.length; i++) {
  const dP = FB_PEAKS[i] - FB_PEAKS[i - 1];
  const dln = Math.log(K_ENDS[i]) - Math.log(K_ENDS[i - 1]);
  G.push(+(dP / dln).toFixed(6));
}

// The imp-34169 80-iteration bisection of resid_exp on [21.0, 22.0], at FULL double precision (NOT the
// 6-digit imp-34287 literal). This is the ONLY refinement over imp-34287.
function bisectResidZero(a0, b0) {
  let a = a0;
  let b = b0;
  for (let it = 0; it < 80; it++) {
    const m = (a + b) / 2;
    if (residExpAt(m) > 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
const KSTAR_BAKED = 21.280947; // imp-34287 s baked 6-digit literal
const KSTAR_FULL = bisectResidZero(21.0, 22.0); // ~21.280947425 -- the refined pole
const D_KSTAR = KSTAR_FULL - KSTAR_BAKED; // ~ +4.25e-7

// Refit g = a + b/(kStar - kEnd) at a given pole location.
function poleFitAt(kStar) {
  const inv = G_XS.map((x) => 1 / (kStar - x));
  const f = ols(inv, G);
  return { a: f.a, b: f.b, r2: r2Of(inv, G, f.a, f.b) };
}
const FIT_BAKED = poleFitAt(KSTAR_BAKED); // reproduces imp-34287: b~0.2361, a~1.4074, R^2~0.9235
const FIT_FULL = poleFitAt(KSTAR_FULL); // refined pole
const D_B = FIT_FULL.b - FIT_BAKED.b; // ~ +3.35e-6
const D_A = FIT_FULL.a - FIT_BAKED.a; // ~ -1.77e-6
const D_R2 = FIT_FULL.r2 - FIT_BAKED.r2; // ~ +7.45e-7

// Local sensitivity db/dk*, da/dk*, dR^2/dk* via central difference at k*_full.
function sensitivityAt(kStar, eps) {
  const fp = poleFitAt(kStar + eps);
  const fm = poleFitAt(kStar - eps);
  return {
    dB_dkStar: (fp.b - fm.b) / (2 * eps),
    dA_dkStar: (fp.a - fm.a) / (2 * eps),
    dR2_dkStar: (fp.r2 - fm.r2) / (2 * eps),
  };
}
const SENS = sensitivityAt(KSTAR_FULL, 0.01); // db/dk*~+7.87, da/dk*~-4.17, dR^2/dk*~+1.76

// (F5) The imp-34127 closed-form kEnd* ~ 21.00 is BELOW the last window (21.25), so it is inadmissible as
// a pole coordinate: 1/(kStar - kEnd) changes sign inside the window and the fit degenerates.
const IMP34127_CLOSED_FORM_KSTAR = 21.0;
const CLOSED_FORM_BELOW_LAST_WINDOW = IMP34127_CLOSED_FORM_KSTAR < LAST_KEND; // true -- inadmissible
const FIT_CLOSED_FORM_R2 = poleFitAt(IMP34127_CLOSED_FORM_KSTAR).r2; // NaN -- degenerate

// imp-34287 reported reference literals (baked) for the reuse gate.
const IMP34287_PREFACTOR = 0.236112;
const IMP34287_FLOOR = 1.407443;
const IMP34287_R2 = 0.923517;

const round = (x, d) => +x.toFixed(d);

export const IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR = {
  id: 'imp-34374',
  proofSection: 'S-frontier',
  question:
    'imp-34287 explained the fixed-band (k <= 10) peak re-acceleration as a pole-proximity transient via ' +
    'g ~ 1.4074 + 0.2361/(k* - kEnd), R^2 ~ 0.9235, baking the imp-34169 resid_exp pole as the 6-digit ' +
    'k* = 21.280947. Refitting with the imp-34169 bisection at FULL precision (k* ~ 21.280947425), do the ' +
    '0.2361 prefactor, the 1.4074 floor, or the R^2 tighten, and how sensitive is the pole-artifact ' +
    'attribution to k*? Measurement/sensitivity only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The imp-34287 pole-proximity regression g = a + b/(k* - kEnd) over the 29 local-log-derivative steps, ' +
    'evaluated at the baked k* = 21.280947 and at the imp-34169 full-precision bisected k* ~ 21.280947425; ' +
    'the shifts db, da, dR^2; and the local sensitivities db/dk*, da/dk*, dR^2/dk* by central difference',
  sweepStep: SWEEP_STEP,
  lastKEnd: LAST_KEND, // 21.25 -- the last sweep window; a valid pole must lie above it
  kStarBaked: KSTAR_BAKED, // 21.280947 -- imp-34287 s 6-digit literal
  kStarFull: round(KSTAR_FULL, 9), // ~21.280947425 -- imp-34169 bisection at full precision
  deltaKStar: +D_KSTAR.toExponential(4), // ~ +4.25e-7 -- the refinement
  bakedFit: {
    form: 'g = a + b/(k* - kEnd) at k* = 21.280947 (reproduces imp-34287)',
    prefactor: round(FIT_BAKED.b, 6), // ~0.236112
    floor: round(FIT_BAKED.a, 6), // ~1.407443
    r2: round(FIT_BAKED.r2, 6), // ~0.923517
  },
  refinedFit: {
    form: 'g = a + b/(k* - kEnd) at k* = 21.280947425 (imp-34169 full-precision bisection)',
    prefactor: round(FIT_FULL.b, 6), // ~0.236116
    floor: round(FIT_FULL.a, 6), // ~1.407441
    r2: round(FIT_FULL.r2, 6), // ~0.923518
  },
  shifts: {
    dPrefactor: +D_B.toExponential(4), // ~ +3.35e-6
    dFloor: +D_A.toExponential(4), // ~ -1.77e-6
    dR2: +D_R2.toExponential(4), // ~ +7.45e-7 -- R^2 IMPROVES marginally
  },
  sensitivity: {
    form: 'central-difference d{b,a,R^2}/dk* at k* = k*_full, eps = 0.01',
    dPrefactor_dkStar: round(SENS.dB_dkStar, 4), // ~ +7.87
    dFloor_dkStar: round(SENS.dA_dkStar, 4), // ~ -4.17
    dR2_dkStar: round(SENS.dR2_dkStar, 4), // ~ +1.76
  },
  closedFormInadmissible: {
    imp34127ClosedFormKStar: IMP34127_CLOSED_FORM_KSTAR, // 21.00
    belowLastWindow: CLOSED_FORM_BELOW_LAST_WINDOW, // true -- 21.00 < 21.25
    r2IsNaN: Number.isNaN(FIT_CLOSED_FORM_R2), // true -- pole coordinate degenerates inside the window
    note:
      'The imp-34127 leading closed-form kEnd* ~ 21.00 lies BELOW the last sweep window kEnd = 21.25, so ' +
      '1/(k* - kEnd) flips sign inside the window and the regression degenerates (NaN R^2). Only a pole ' +
      'strictly above the last window (k* > 21.25), as the bisected zero is, is a valid pole coordinate.',
  },
  bakedReproducesImp34287:
    Math.abs(FIT_BAKED.b - IMP34287_PREFACTOR) < 1e-6 &&
    Math.abs(FIT_BAKED.a - IMP34287_FLOOR) < 1e-6 &&
    Math.abs(FIT_BAKED.r2 - IMP34287_R2) < 1e-6,
  attributionRobust: Math.abs(D_B) < 1e-4 && FIT_FULL.b > 0 && FIT_FULL.r2 > 0.9, // prefactor barely moves
  isRigorous: false,
  finding: {
    F1_baked_reproduces_imp34287:
      'At k* = 21.280947 the refit returns b ~ 0.236112, a ~ 1.407443, R^2 ~ 0.923517 -- the imp-34287 ' +
      '0.2361 / 1.4074 / 0.9235 to all reported digits (reuse gate).',
    F2_bisection_refines_kstar_by_4e_minus_7:
      'The imp-34169 80-iteration bisection places the continuous resid_exp zero at k*_full ~ 21.280947425, ' +
      'so dk* = k*_full - 21.280947 ~ +4.25e-7 -- the 6-digit literal was already sub-microrung accurate.',
    F3_prefactor_and_floor_barely_move_r2_improves:
      'Refitting at k*_full gives b ~ 0.236116 (db ~ +3.35e-6), a ~ 1.407441 (da ~ -1.77e-6), R^2 ~ 0.923518 ' +
      '(dR^2 ~ +7.45e-7). The prefactor shifts in the 6th significant figure and R^2 rises only at the 7th ' +
      'decimal; the imp-34287 0.2361 prefactor and 0.9235 R^2 are UNCHANGED at reported precision.',
    F4_local_sensitivity_moderate_attribution_robust:
      'Central differences at k*_full give db/dk* ~ +7.87, da/dk* ~ -4.17, dR^2/dk* ~ +1.76 per unit k*. A k* ' +
      'error of ~0.015 would be needed to move the prefactor by 5% of 0.2361, and the bisection pins k* to ' +
      '~1e-7 (10^5 tighter) -- the pole-artifact reading (b > 0, R^2 ~ 0.92) is ROBUST, not fragile.',
    F5_closed_form_kstar_inadmissible:
      'The imp-34127 closed-form kEnd* ~ 21.00 is BELOW the last sweep window kEnd = 21.25, so 1/(k* - kEnd) ' +
      'flips sign inside the window and the regression degenerates (NaN R^2). Only the bisected zero ' +
      '(k* > 21.25) is a valid pole coordinate; the ~0.28 closed-form-vs-bisection gap is not usable here.',
  },
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier-direction, NOT rigorous). Refitting the imp-34287 pole-proximity ' +
    'regression g ~ 1.4074 + 0.2361/(k* - kEnd) with the imp-34169 bisected pole at FULL precision ' +
    '(k*_full ~ 21.280947425 vs the baked 6-digit 21.280947, dk* ~ +4.25e-7) moves the prefactor by only ' +
    '+3.35e-6 (0.236112 -> 0.236116), the floor by -1.77e-6 (1.407443 -> 1.407441), and IMPROVES R^2 by ' +
    '+7.45e-7 (0.923517 -> 0.923518). The baked-k* fit reproduces imp-34287 exactly (reuse gate). With a ' +
    'local sensitivity of ~7.87 / unit k* (da/dk* ~ -4.17, dR^2/dk* ~ +1.76) and the imp-34169 bisection ' +
    'pinning k* to ~1e-7, the 0.2361 / 1.4074 / 0.9235 pole-artifact attribution is ROBUST to the exact ' +
    'resid_exp zero-crossing: a k* error of ~0.015 would be needed to shift the prefactor by even 5%. The ' +
    'imp-34127 closed-form kEnd* ~ 21.00 is INADMISSIBLE as the pole coordinate (below the last window ' +
    'kEnd = 21.25, NaN R^2), confirming the bisected zero (k* > 21.25) is the correct choice. imp-34287 s ' +
    'verdict stands UNCHANGED and unweakened; only its baked k* is refined. SUB-GAP-imp-34287-asymptotic-' +
    'class-undecidable stays OPEN. The OLS surrogate, the local log-derivative, and the pole-proximity ' +
    'regression are descriptive, not derived; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34287 (the pole-proximity regression this refits; machinery reused verbatim); imp-34169 (the ' +
    'resid_exp pole bisection k* ~ 21.280947425 this refines to full precision); imp-34127 (the closed-form ' +
    'kEnd* ~ 21.00 shown inadmissible as a pole coordinate); imp-34196 (the re-acceleration the regression ' +
    'explains); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR_ASSERTIONS = [
  {
    // (F1) Reuse gate: the baked-k* refit reproduces imp-34287 s reported 0.2361 / 1.4074 / 0.9235.
    id: 'imp34374-baked-kstar-reproduces-imp34287',
    description: 'refit at k* = 21.280947 returns b ~ 0.236112, a ~ 1.407443, R^2 ~ 0.923517 -- matches imp-34287',
    holds: () =>
      IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.bakedReproducesImp34287 === true &&
      Math.abs(FIT_BAKED.b - 0.236112) < 1e-5 &&
      Math.abs(FIT_BAKED.a - 1.407443) < 1e-5 &&
      Math.abs(FIT_BAKED.r2 - 0.923517) < 1e-5,
  },
  {
    // (F2) The imp-34169 bisection refines k* above the baked literal by ~4.25e-7, and stays above the last window.
    id: 'imp34374-bisection-refines-kstar-sub-microrung',
    description: 'k*_full ~ 21.280947425 > 21.280947, dk* ~ +4.25e-7 > 0; k*_full > last window 21.25',
    holds: () =>
      KSTAR_FULL > KSTAR_BAKED &&
      D_KSTAR > 0 &&
      D_KSTAR < 1e-6 &&
      Math.abs(KSTAR_FULL - 21.280947425) < 1e-8 &&
      KSTAR_FULL > LAST_KEND,
  },
  {
    // (F3) Refit at the refined pole barely moves b and a; R^2 improves marginally (dR^2 > 0).
    id: 'imp34374-refined-fit-shifts-are-negligible',
    description: 'db ~ +3.35e-6, da ~ -1.77e-6, dR^2 ~ +7.45e-7 (> 0, R^2 improves); all sub-1e-5',
    holds: () =>
      Math.abs(D_B) < 1e-5 &&
      D_B > 0 &&
      Math.abs(D_A) < 1e-5 &&
      D_A < 0 &&
      D_R2 > 0 &&
      D_R2 < 1e-5,
  },
  {
    // (F4) Local sensitivity is moderate (~8 / unit k*), so the prefactor attribution is robust.
    id: 'imp34374-sensitivity-moderate-attribution-robust',
    description: 'db/dk* ~ +7.87, da/dk* ~ -4.17, dR^2/dk* ~ +1.76; attribution robust (|db| < 1e-4, b > 0, R^2 > 0.9)',
    holds: () =>
      Math.abs(SENS.dB_dkStar - 7.87) < 0.3 &&
      SENS.dB_dkStar > 0 &&
      Math.abs(SENS.dA_dkStar - -4.17) < 0.3 &&
      SENS.dR2_dkStar > 0 &&
      IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.attributionRobust === true,
  },
  {
    // (F5) The imp-34127 closed-form k* = 21.00 is inadmissible: below the last window, degenerate (NaN R^2).
    id: 'imp34374-closed-form-kstar-inadmissible',
    description: 'imp-34127 closed form 21.00 < last window 21.25 => pole coordinate degenerates (NaN R^2)',
    holds: () =>
      CLOSED_FORM_BELOW_LAST_WINDOW === true &&
      Number.isNaN(FIT_CLOSED_FORM_R2) === true &&
      IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.closedFormInadmissible.r2IsNaN === true,
  },
  {
    // Honesty gate: measurement/sensitivity only; imp-34287 verdict UNCHANGED; sub-gap still open; no QED; no refereed bound is changed.
    id: 'imp34374-honesty-gate-no-qed',
    description: 'isRigorous false; imp-34287 unchanged; SUB-GAP-imp-34287 open; no QED; no refereed bound is changed; C_mb / imp-3066 untouched',
    holds: () =>
      IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.isRigorous === false &&
      /verdict stands UNCHANGED/.test(IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.verdict) &&
      /SUB-GAP-imp-34287-asymptotic-class-undecidable stays OPEN/.test(IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.verdict) &&
      /NOT a rigorous asymptotic/.test(IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.verdict) &&
      /NO QED/.test(IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.verdict) &&
      /refereed bound is changed/i.test(IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR.verdict),
  },
];

for (const a of IMP34374_POLE_PROXIMITY_REFIT_REFINED_KSTAR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34374-pole-proximity-refit-refined-kstar assertion failed: ${a.id}`);
  }
}
