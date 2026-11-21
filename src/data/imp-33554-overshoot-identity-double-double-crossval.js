/**
 * @module imp-33554-overshoot-identity-double-double-crossval
 *
 * imp-33554 (accuracy, frontier cross-validation): imp-33540 F1 reported that the far-tail
 * overshoot at the imp-3406 interior max (N ~ 9.22e5) factors EXACTLY as the closed-form product
 *     OS = sigma_ft - sigma_full = sigma_ft * sigma_full * (E_flow / E_coll),
 * and that the product identity reproduces the direct subtraction to |OS - OS_closed| ~ 1e-17.
 * But that agreement was measured in fp64 ONLY. Whether ~1e-17 is the TRUE identity floor (the
 * two sides genuinely differ at that scale) or merely the fp64 cancellation/rounding floor (the
 * identity is exact and the gap is pure double-precision roundoff) was left untested. This module
 * settles it by recomputing BOTH sides at double-double (~106-bit, Dekker/Knuth twoSum/twoProd as
 * in imp-33534/imp-33248) from the identical imp-3406/imp-33540 fp64 sub-terms.
 *
 * THE IDENTITY (exact algebra; verify the derivation)
 * ---------------------------------------------------
 * With D_ft = E_trunc + E_coll and D_full = E_trunc + E_flow + E_coll,
 *     sigma_ft   = E_coll / D_ft,
 *     sigma_full = E_coll / D_full,
 *     OS = sigma_ft - sigma_full = E_coll (D_full - D_ft) / (D_ft * D_full)
 *        = E_coll * E_flow / (D_ft * D_full)                             [since D_full - D_ft = E_flow]
 *        = (E_coll / D_ft)(E_coll / D_full)(E_flow / E_coll)
 *        = sigma_ft * sigma_full * (E_flow / E_coll).
 * So OS_direct and OS_closed are the SAME rational function of the three positive fp64 inputs
 * (E_trunc, E_flow, E_coll). In exact real arithmetic they are equal: the true identity floor is
 * ZERO. Any nonzero residual is arithmetic roundoff, which must SHRINK as the working precision is
 * refined. That is the falsifiable prediction this module tests.
 *
 * THE TWO-PRECISION MEASUREMENT (self-computed below)
 * ---------------------------------------------------
 * From the SAME fp64 inputs at the imp-3406 peak (E_trunc = 3.06e-5, E_flow ~ 4.684e-5,
 * E_coll ~ 1.454e-3), both OS_direct and OS_closed are evaluated
 *   (i) in native fp64 (reproducing imp-33540), and
 *   (ii) in double-double (u_dd = 2^-106 ~ 1.23e-32) via full dd add / sub / mul / div.
 *     precision     |OS_direct - OS_closed|
 *     fp64          ~ 1.73e-17      (the imp-33540 ~1e-17 figure)
 *     double-double ~ 3.85e-33      (collapses ~16 orders of magnitude, u_dd floor)
 * The residual drops by a factor ~4.5e15 when the precision is refined from 53-bit to 106-bit,
 * landing at the double-double roundoff floor (~u_dd relative to OS ~ 3.0e-2).
 *
 * THE FINDING (cross-validation / diagnostic only)
 * ------------------------------------------------
 *   (F1) THE ~1e-17 AGREEMENT IS THE fp64 CANCELLATION FLOOR, NOT THE TRUE IDENTITY FLOOR.
 *        Refining to double-double collapses |OS_direct - OS_closed| from ~1.73e-17 to ~3.85e-33
 *        (a ~4.5e15 reduction), exactly as an EXACT algebraic identity must: the residual tracks
 *        the working-precision unit roundoff (~1e-16 in fp64, ~1e-32 in dd), so it is fp64-limited.
 *   (F2) THE IDENTITY OS = sigma_ft * sigma_full * (E_flow/E_coll) IS EXACT TO THE dd FLOOR. At
 *        double-double the two sides agree to ~3.85e-33 ~ u_dd * OS, i.e. to the last representable
 *        bits of the 106-bit format -- no residual survives above roundoff. This confirms the
 *        imp-33540 F1 closed form is an exact identity, not a ~1e-17-accurate approximation.
 *   (F3) NO CANCELLATION CATASTROPHE IN THE SUBTRACTION. Although OS_direct subtracts two O(1)
 *        shares (sigma_ft ~ 0.9794, sigma_full ~ 0.9494) to get OS ~ 3.0e-2, the ~1.5-decade
 *        magnitude drop costs only ~1.5 decimal digits; the dd residual sits ~15 digits below OS,
 *        so double-double leaves ~13 guard digits. The fp64 gap is ordinary rounding, not a
 *        conditioning wall.
 *
 * The punchline: the imp-33540 ~1e-17 identity gap is the fp64 rounding floor of an EXACT algebraic
 * identity, not a genuine discrepancy. Recomputed at double-double it collapses to ~3.85e-33, the
 * ~106-bit roundoff floor -- confirming OS = sigma_ft*sigma_full*(E_flow/E_coll) holds to arithmetic
 * precision and the fp64 agreement was precision-limited, exactly as expected.
 *
 * CROSS-VALIDATION / DIAGNOSTIC ONLY. Confirms an algebraic identity at higher precision; changes
 * NO bound. C_C is GUE-conditional per imp-486; imp-3066 K_a >= 0 untouched; no positivity, no
 * bridge closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-33540-sigma-fartail-overshoot-two-power-decomposition (F1: the ~1e-17 fp64 identity gap)
 * @see imp-33534-min-node-reference-precision-libm (the double-double reference-precision route)
 * @see imp-33248-dd-watson-bracket-high-tau-run (Dekker/Knuth twoSum/twoProd primitives)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-486 (C_C GUE-conditional); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33540)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33540 exactly

// EXACT imp-3406 / imp-33540 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // super-poly negligible on the far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H) two-power form
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, C_F, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigmaFull = (N) => parts(N).sigma;

// Reproduce the imp-3406 interior max (argmax of the full sigma in ln N), identical search to imp-33540.
function argmaxLnN(fn, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (fn(Math.exp(m1)) < fn(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

const N_MAX = argmaxLnN(sigmaFull, 1e4, 1e9); // ~9.219e5 (reproduces imp-3406)
const PM = parts(N_MAX);
const E_TR = E_TRUNC_PT;
const E_FL = PM.E_flow; // ~4.684e-5
const E_CO = PM.E_coll; // ~1.454e-3

// ---- fp64 path (reproduces the imp-33540 ~1e-17 identity gap) -----------------------------------
const SFT_FP64 = E_CO / (E_TR + E_CO); // sigma_ft   ~ 0.9793857
const SFL_FP64 = E_CO / (E_TR + E_FL + E_CO); // sigma_full ~ 0.9494290
const OS_DIRECT_FP64 = SFT_FP64 - SFL_FP64; // ~2.9957e-2
const OS_CLOSED_FP64 = SFT_FP64 * SFL_FP64 * (E_FL / E_CO); // product identity
const IDENTITY_GAP_FP64 = Math.abs(OS_DIRECT_FP64 - OS_CLOSED_FP64); // ~1.73e-17

// ---- Double-double primitives (Dekker/Knuth), u_dd = 2^-106 (as imp-33248/imp-33534) -----------
function quickTwoSum(a, b) {
  const s = a + b;
  const e = b - (s - a);
  return [s, e];
}
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
const SPLITTER = 134217729; // 2^27 + 1
function split(a) {
  const c = SPLITTER * a;
  const hi = c - (c - a);
  const lo = a - hi;
  return [hi, lo];
}
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const err = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, err];
}
const dd = (x) => [x, 0];
function ddAdd(a, b) {
  let [s, e] = twoSum(a[0], b[0]);
  const [s2, e2] = twoSum(a[1], b[1]);
  e += s2;
  [s, e] = quickTwoSum(s, e);
  e += e2;
  [s, e] = quickTwoSum(s, e);
  return [s, e];
}
const ddNeg = (a) => [-a[0], -a[1]];
const ddSub = (a, b) => ddAdd(a, ddNeg(b));
function ddMulD(a, b) {
  let [p, e] = twoProd(a[0], b);
  e += a[1] * b;
  [p, e] = quickTwoSum(p, e);
  return [p, e];
}
function ddMul(a, b) {
  let [p, e] = twoProd(a[0], b[0]);
  e += a[0] * b[1] + a[1] * b[0];
  [p, e] = quickTwoSum(p, e);
  return [p, e];
}
function ddDiv(a, b) {
  const q1 = a[0] / b[0];
  let r = ddSub(a, ddMulD(b, q1));
  const q2 = r[0] / b[0];
  r = ddSub(r, ddMulD(b, q2));
  const q3 = r[0] / b[0];
  const [q, e] = quickTwoSum(q1, q2);
  return ddAdd([q, e], [q3, 0]);
}
const ddToNumber = (a) => a[0] + a[1];

// ---- Double-double path: same rational function, ~106-bit arithmetic --------------------------
const ETR_DD = dd(E_TR);
const EFL_DD = dd(E_FL);
const ECO_DD = dd(E_CO);
const SFT_DD = ddDiv(ECO_DD, ddAdd(ETR_DD, ECO_DD)); // sigma_ft
const SFL_DD = ddDiv(ECO_DD, ddAdd(ddAdd(ETR_DD, EFL_DD), ECO_DD)); // sigma_full
const OS_DIRECT_DD = ddSub(SFT_DD, SFL_DD); // direct subtraction
const OS_CLOSED_DD = ddMul(ddMul(SFT_DD, SFL_DD), ddDiv(EFL_DD, ECO_DD)); // product identity
const IDENTITY_GAP_DD = Math.abs(ddToNumber(ddSub(OS_DIRECT_DD, OS_CLOSED_DD))); // ~3.85e-33

const OS_DD = ddToNumber(OS_DIRECT_DD); // ~2.9957e-2
const U_DD = Math.pow(2, -106); // ~1.23e-32 double-double unit roundoff
const GAP_REDUCTION_RATIO = IDENTITY_GAP_FP64 / IDENTITY_GAP_DD; // ~4.5e15
const DD_GAP_IN_ULP_OF_OS = IDENTITY_GAP_DD / (U_DD * OS_DD); // ~O(1): dd residual is at the dd floor

export const IMP33554_OVERSHOOT_IDENTITY_DOUBLE_DOUBLE_CROSSVAL = {
  id: 'imp-33554',
  proofSection: 'S-frontier',
  question:
    'imp-33540 F1 reports OS = sigma_ft - sigma_full = sigma_ft*sigma_full*(E_flow/E_coll) agrees ' +
    'to |OS - OS_closed| ~ 1e-17 in fp64. Cross-validate at double-double (~106-bit): is the ' +
    '~1e-17 the TRUE identity floor or merely the fp64 cancellation/rounding floor? ' +
    'Diagnostic only; changes no bound; no QED.',
  identity:
    'OS = sigma_ft - sigma_full = E_coll*E_flow/(D_ft*D_full) = sigma_ft*sigma_full*(E_flow/E_coll), ' +
    'D_ft = E_trunc + E_coll, D_full = E_trunc + E_flow + E_coll (EXACT algebra; true floor = 0).',
  inputsAtPeak: {
    N_max: +N_MAX.toExponential(4), // ~9.219e5 (reproduces imp-3406)
    E_trunc: +E_TR.toExponential(6), // 3.06e-5
    E_flow: +E_FL.toExponential(6), // ~4.684e-5
    E_coll: +E_CO.toExponential(6), // ~1.454e-3
    sigma_ft: +SFT_FP64.toFixed(7), // ~0.9793857
    sigma_full: +SFL_FP64.toFixed(7), // ~0.9494290
    overshoot: +OS_DIRECT_FP64.toExponential(6), // ~2.995670e-2
  },
  crossValidation: {
    identity_gap_fp64: +IDENTITY_GAP_FP64.toExponential(4), // ~1.73e-17 (imp-33540 figure)
    identity_gap_doubleDouble: +IDENTITY_GAP_DD.toExponential(4), // ~3.85e-33 (u_dd floor)
    gap_reduction_ratio: +GAP_REDUCTION_RATIO.toExponential(3), // ~4.5e15
    u_fp64: +Math.pow(2, -53).toExponential(3), // ~1.11e-16
    u_doubleDouble: +U_DD.toExponential(3), // ~1.23e-32
    dd_gap_in_dd_ulp_of_OS: +DD_GAP_IN_ULP_OF_OS.toFixed(4), // ~O(1): at the dd roundoff floor
  },
  finding: {
    F1_fp64_gap_is_the_fp64_floor_not_the_identity_floor:
      'Refining from fp64 to double-double collapses |OS_direct - OS_closed| from ~1.73e-17 to ' +
      '~3.85e-33 (a ~4.5e15 reduction), tracking the working-precision unit roundoff (~1e-16 fp64, ' +
      '~1e-32 dd). The ~1e-17 agreement is the fp64 cancellation/rounding floor, NOT the true ' +
      'identity floor -- it is fp64-limited.',
    F2_identity_exact_to_dd_floor:
      'At double-double the two sides agree to ~3.85e-33 ~ u_dd * OS, i.e. to the last bits of the ' +
      '~106-bit format. OS = sigma_ft*sigma_full*(E_flow/E_coll) is an EXACT algebraic identity ' +
      '(true floor 0), not a ~1e-17-accurate approximation.',
    F3_no_cancellation_catastrophe:
      'OS_direct subtracts two O(1) shares (sigma_ft ~ 0.9794, sigma_full ~ 0.9494) for OS ~ 3.0e-2, ' +
      'a ~1.5-digit magnitude drop; the dd residual sits ~15 digits below OS, leaving ~13 guard ' +
      'digits. The fp64 gap is ordinary rounding, not a conditioning wall.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier diagnostic, NOT rigorous). The imp-33540 F1 ~1e-17 identity gap for ' +
    'OS = sigma_ft - sigma_full = sigma_ft*sigma_full*(E_flow/E_coll) at the imp-3406 interior max ' +
    '(N ~ 9.22e5) is the fp64 cancellation/rounding floor, NOT the true identity floor. Recomputing ' +
    'both sides at double-double (~106-bit, Dekker/Knuth twoSum/twoProd) from the identical ' +
    'imp-3406/imp-33540 fp64 sub-terms collapses the gap from ~1.73e-17 to ~3.85e-33 (a ~4.5e15 ' +
    'reduction), landing at the double-double roundoff floor ~u_dd * OS. So the identity is EXACT to ' +
    'arithmetic precision (true floor 0) and the fp64 agreement was precision-limited -- exactly as ' +
    'an exact algebraic identity must behave. C_C is GUE-conditional per imp-486; changes no bound; ' +
    'imp-3066 K_a >= 0 untouched; no positivity, no bridge closure, no RH claim, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33540 F1 (the ~1e-17 fp64 identity gap); imp-33534/imp-33248 (double-double reference ' +
    'precision, Dekker/Knuth twoSum/twoProd); imp-3406 (interior MAX N ~ 9.22e5, sigma_max ~ 0.9494); ' +
    'imp-486 (C_C GUE-conditional); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33554_OVERSHOOT_IDENTITY_DOUBLE_DOUBLE_CROSSVAL_ASSERTIONS = [
  {
    // Reuse gate: the peak reproduces imp-3406 (N_max ~ 9.22e5) and the fp64 overshoot reproduces
    // the imp-33540 ~3.0e-2 value, proving the identical imp-3406/imp-33540 sub-terms are in use.
    id: 'imp33554-reproduces-imp3406-peak-and-imp33540-overshoot',
    description: 'N_max ~ 9.22e5 (imp-3406) and OS ~ 2.996e-2 (imp-33540) reproduced in fp64',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 &&
      Math.abs(OS_DIRECT_FP64 - 2.996e-2) < 5e-4,
  },
  {
    // (baseline) the fp64 identity gap reproduces the imp-33540 ~1e-17 figure.
    id: 'imp33554-fp64-gap-reproduces-imp33540',
    description: 'fp64 |OS_direct - OS_closed| ~ 1.7e-17 (reproduces imp-33540 ~1e-17)',
    holds: () =>
      IDENTITY_GAP_FP64 > 1e-18 && IDENTITY_GAP_FP64 < 1e-15,
  },
  {
    // (F1/F2) the double-double residual COLLAPSES far below the fp64 gap, to the u_dd floor,
    // proving the ~1e-17 was fp64-limited and the identity is exact.
    id: 'imp33554-dd-gap-collapses-to-dd-floor',
    description: 'double-double |OS_direct - OS_closed| ~ 1e-32 or below, far under the fp64 ~1e-17',
    holds: () =>
      IDENTITY_GAP_DD < 1e-28 &&
      IDENTITY_GAP_DD < IDENTITY_GAP_FP64 * 1e-6,
  },
  {
    // (F1) the gap tracks the working-precision unit roundoff: refining fp64 -> dd cuts it by
    // many orders of magnitude (here ~4.5e15), the signature of an EXACT identity.
    id: 'imp33554-gap-reduction-tracks-precision',
    description: 'gap reduction fp64->dd exceeds 1e10 (precision-limited, exact-identity signature)',
    holds: () => GAP_REDUCTION_RATIO > 1e10,
  },
  {
    // (F2) the dd residual sits at the ~106-bit roundoff floor of OS, i.e. within a small multiple
    // of u_dd * OS -- no residual survives above double-double roundoff.
    id: 'imp33554-dd-residual-at-roundoff-floor',
    description: 'dd residual within a small multiple of u_dd*OS (last bits of the 106-bit format)',
    holds: () =>
      DD_GAP_IN_ULP_OF_OS >= 0 && DD_GAP_IN_ULP_OF_OS < 1e3,
  },
  {
    // Honesty gate: cross-validation / diagnostic only, no QED, no refereed bound is changed.
    id: 'imp33554-honesty-gate-no-qed',
    description: 'Cross-validation/diagnostic only: no QED, no refereed bound is changed',
    holds: () =>
      IMP33554_OVERSHOOT_IDENTITY_DOUBLE_DOUBLE_CROSSVAL.isRigorous === false &&
      /NO QED/.test(IMP33554_OVERSHOOT_IDENTITY_DOUBLE_DOUBLE_CROSSVAL.verdict) &&
      /refereed bound is changed/i.test(IMP33554_OVERSHOOT_IDENTITY_DOUBLE_DOUBLE_CROSSVAL.verdict),
  },
];

for (const a of IMP33554_OVERSHOOT_IDENTITY_DOUBLE_DOUBLE_CROSSVAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33554-overshoot-identity-double-double-crossval assertion failed: ${a.id}`);
  }
}
