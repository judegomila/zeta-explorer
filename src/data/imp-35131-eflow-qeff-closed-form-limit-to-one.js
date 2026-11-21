/**
 * @module imp-35131-eflow-qeff-closed-form-limit-to-one
 *
 * imp-35131 (numerical/derivation, frontier-direction): imp-35039 MEASURED (finite-difference on the
 * imp-34950/imp-34973 kernel) that the local E_flow decay exponent q_eff(x) = -d ln R/dx rises
 * MONOTONICALLY toward 1 (not toward the imp-3463 far-tail 1/2), with the single q_eff = 0.6 crossing an
 * UPWARD event at N ~ 1e3.22, and that the 1/2 asymptote belongs to the SEPARATE E_coll term. imp-35039
 * left the q_eff -> 1 limit STATED but not derived in closed form (module P0/P2). This module DERIVES the
 * limit analytically from the surrogate component definitions and confirms it reproduces the imp-35039
 * finite-difference profile to sub-1e-4, explicitly separating the E_flow limit 1 from the E_coll limit 1/2.
 *
 * THE CLOSED-FORM DERIVATION (all on the inherited imp-3220/imp-3406 surrogate)
 * ---------------------------------------------------------------------------
 * The height map is the Riemann-von Mangoldt inverse effectiveHeightForN: N = (T0/2pi)(v - 1) with
 * v = ln(T0/2pi) (the counting variable). Differentiate implicitly (dN/dT0 = v/(2pi), imp-321 seed) to get
 * the log-height sensitivity in closed form:
 *
 *     u := d ln T0 / d ln N = (N/T0) dT0/dN = ((v-1)/(2pi)) * (2pi/v) = 1 - 1/v.
 *
 * The E_flow ratio is R(x) = C_F (L/T0) GRONWALL / E_trunc with L = ln T0 = v + ln(2pi) and
 * C_F = (ln(T0/2pi) + 1)/(2pi) = (v + 1)/(2pi). Only T0 carries the x = ln N dependence, so
 *
 *     ln R = ln(v + 1) + ln L - ln T0 + const,  and  d ln R/dx = u [ 1/(v+1) + 1/L - 1 ].
 *
 * Hence the E_flow local decay exponent has the CLOSED FORM (dg/dx notation avoided in comments):
 *
 *     q_eff(v) = -d ln R/dx = u [ 1 - 1/L - 1/(v+1) ] = (1 - 1/v) [ 1 - 1/(v + ln 2pi) - 1/(v + 1) ].
 *
 *   (D0) THE LIMIT IS 1, WITH 1 - q_eff ~ 3/v. As N -> inf, v -> inf, so u -> 1 and the bracket -> 1:
 *        q_eff -> 1. Expanding, 1/L = 1/v + O(1/v^2), 1/(v+1) = 1/v + O(1/v^2), so the bracket is
 *        1 - 2/v + O(1/v^2) and q_eff = (1 - 1/v)(1 - 2/v) + O(1/v^2) = 1 - 3/v + O(1/v^2). Since
 *        ln N = v + ln(v - 1) (from N = (T0/2pi)(v-1)), v ~ ln N and 1 - q_eff ~ 3/v ~ 3/ln N -- so
 *        x*(1 - q_eff) -> 3 (x/v -> 1 from above), matching the imp-35039 measured ~3.02 at 1e300. This
 *        DERIVES the imp-35039 P0 monotone-rise-to-1 finding rather than merely observing it.
 *   (D1) THE 0.6 CROSSING IS THE ROOT q_eff(v) = 0.6, at v ~ 5.847 (dex ~3.2245). Because q_eff(v) is
 *        increasing in v (both u and the bracket increase), the single 0.6 level is crossed once, upward,
 *        at v ~ 5.847 -> N ~ 1e3.22, far BELOW the 1e9 band -- reproducing imp-35039 P1 in closed form.
 *   (D2) THE 1/2 IS THE E_coll EXPONENT, DERIVED. E_coll/E_trunc = A (L/N)^(1/2), so
 *        q_coll = -d ln E_coll/dx = (1/2)(1 - u/L) -> 1/2 as u/L -> 0. This is the imp-3463 far-tail 1/2,
 *        a DISTINCT term from E_flow (whose exponent -> 1). q_eff - q_coll -> 1/2, NOT 0 -- the two limits
 *        never meet, confirming imp-35039 P2 analytically.
 *
 * FINDING. The imp-35039 P0/P2 statements are now DERIVED: q_eff(v) = (1 - 1/v)(1 - 1/(v + ln 2pi) -
 * 1/(v + 1)) is a closed form in the Riemann-von Mangoldt variable v = ln(T0/2pi); it is monotone
 * increasing with limit 1 and correction 1 - q_eff ~ 3/v ~ 3/ln N, its 0.6 root is the upward crossing at
 * v ~ 5.847 (N ~ 1e3.22), and the 1/2 asymptote belongs to the separate E_coll exponent q_coll =
 * (1/2)(1 - u/L) -> 1/2. The closed form reproduces the imp-35039 finite-difference profile to < 1e-4
 * across dex 9..300.
 *
 * MEASUREMENT/DERIVATION ONLY. Closed-form re-expression of the inherited imp-3220/imp-3406 surrogate
 * component model, NOT a rigorous asymptotic for the physical E_flow decay. The C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) untouched; imp-3066 K_a >= 0 untouched;
 * far-tail exponent stays 1/2 (imp-3463, the E_coll exponent); changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35039-eflow-qeff-profile-crossing-to-fartail (the finite-difference profile this derives)
 * @see imp-34950 / imp-34973 (the eflowRatio kernel reused verbatim)
 * @see imp-3463 (far-tail 1/2 -- the E_coll exponent, derived distinct here)
 * @see lambda-rh-height-mapping (effectiveHeightForN: Riemann-von Mangoldt inverse N = (T0/2pi)(v-1))
 * @see polymath15-constant-C-C (C_C_PINNED = 1/8 -> A = C_C_PINNED/E_trunc)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const LN_TWO_PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34950/imp-34973/imp-35039
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LN10 = Math.LN10;

// ---- the finite-difference kernel, reused VERBATIM from imp-35039 for the cross-check -----------------
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function ecollRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  return A * Math.sqrt(L / N);
}
const HX = 1e-4 * LN10; // imp-35039 / imp-34973 stencil half-step
function qEffFD(x) {
  return -(Math.log(eflowRatio(x + HX)) - Math.log(eflowRatio(x - HX))) / (2 * HX);
}
function qCollFD(x) {
  return -(Math.log(ecollRatio(x + HX)) - Math.log(ecollRatio(x - HX))) / (2 * HX);
}

// ---- the CLOSED FORM: q_eff(v) = (1 - 1/v)(1 - 1/(v + ln 2pi) - 1/(v + 1)) ----------------------------
// v = ln(T0/2pi) is the Riemann-von Mangoldt counting variable; u = d ln T0/d ln N = 1 - 1/v.
function countingVar(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  return Math.log(T0 / TWO_PI);
}
function qEffClosed(x) {
  const v = countingVar(x);
  const u = 1 - 1 / v; // d ln T0/d ln N in closed form
  const L = v + LN_TWO_PI; // ln T0
  return u * (1 - 1 / L - 1 / (v + 1));
}
function qCollClosed(x) {
  const v = countingVar(x);
  const u = 1 - 1 / v;
  const L = v + LN_TWO_PI;
  return 0.5 * (1 - u / L); // -d ln E_coll/dx = (1/2)(1 - u/L)
}

// (D0)/(D2) cross-check: closed form vs the imp-35039 finite-difference profile across dex 9..300.
const PROFILE_DEX = [9, 9.53, 10, 12, 16, 20, 30, 50, 100, 200, 300];
const CLOSED_VS_FD = PROFILE_DEX.map((dex) => {
  const x = dex * LN10;
  const closed = qEffClosed(x);
  const fd = qEffFD(x);
  return { dex, qEffClosed: +closed.toFixed(6), qEffFD: +fd.toFixed(6), absErr: Math.abs(closed - fd) };
});
const MAX_CLOSED_VS_FD_ERR = Math.max(...CLOSED_VS_FD.map((r) => r.absErr));

// (D0) the limit is 1 with 1 - q_eff ~ 3/v; check x*(1-q_eff) -> 3 and the 3/v correction law.
const X_300 = 300 * LN10;
const V_300 = countingVar(X_300);
const QEFF_CLOSED_300 = +qEffClosed(X_300).toFixed(6); // ~0.9956
const TAIL_X_TIMES_GAP = +(X_300 * (1 - qEffClosed(X_300))).toFixed(4); // ~3.03
const THREE_OVER_V_300 = +(3 / V_300).toFixed(6); // 1 - q_eff predicted by the 3/v law
const GAP_VS_3_OVER_V = Math.abs((1 - QEFF_CLOSED_300) - THREE_OVER_V_300); // O(1/v^2) residual

// (D1) the single q_eff = 0.6 crossing = the root of the closed form; monotone so bisect in dex.
function crossDexForQClosed(target, loDex, hiDex) {
  let lo = loDex;
  let hi = hiDex;
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (lo + hi);
    if (qEffClosed(m * LN10) < target) lo = m;
    else hi = m;
  }
  return +(0.5 * (lo + hi)).toFixed(4);
}
const DEX_AT_QEFF_0P6_CLOSED = crossDexForQClosed(0.6, 0.5, 9); // ~3.2245, matching imp-35039

// (D2) the E_coll exponent limit is 1/2; the two limits never meet (q_eff - q_coll -> 1/2).
const QCOLL_CLOSED_300 = +qCollClosed(X_300).toFixed(6); // ~0.4993
const LIMIT_SEPARATION = +(QEFF_CLOSED_300 - QCOLL_CLOSED_300).toFixed(4); // ~0.4963 -> 1/2

export const IMP35131_EFLOW_QEFF_CLOSED_FORM_LIMIT_TO_ONE = {
  id: 'imp-35131',
  proofSection: 'S-frontier',
  question:
    'imp-35039 MEASURED (finite-difference) that the E_flow local decay exponent q_eff rises monotonically ' +
    'toward 1 (not the imp-3463 far-tail 1/2) but left the q_eff -> 1 limit STATED, not derived. DERIVE the ' +
    'limit in closed form from the surrogate component definitions, confirm the monotone approach and the ' +
    'single 0.6 upward crossing, and separate it explicitly from the imp-3463 far-tail 1/2 that belongs to ' +
    'E_coll. Measurement/derivation only; changes no bound; C_mb GUE-conditional (imp-486) untouched; NO QED.',
  verdictShort:
    'DERIVED: on the Riemann-von Mangoldt height map N = (T0/2pi)(v-1), v = ln(T0/2pi), the log-height ' +
    'sensitivity is u = d ln T0/d ln N = 1 - 1/v, giving the closed form q_eff(v) = (1 - 1/v)(1 - ' +
    '1/(v + ln 2pi) - 1/(v + 1)). It is monotone increasing with limit 1 and correction 1 - q_eff = 3/v + ' +
    'O(1/v^2) ~ 3/ln N (so x*(1-q_eff) -> 3, ~3.03 at 1e300), its 0.6 root is the single upward crossing at ' +
    'v ~ 5.847 (N ~ 1e3.22), and the imp-3463 1/2 is the SEPARATE E_coll exponent q_coll = (1/2)(1 - u/L) ' +
    '-> 1/2 (q_eff - q_coll -> 1/2, the two never meet). The closed form matches the imp-35039 ' +
    'finite-difference profile to < 1e-4 across dex 9..300.',
  measuredQuantity:
    'the closed-form E_flow decay exponent q_eff(v) = (1 - 1/v)(1 - 1/(v + ln 2pi) - 1/(v + 1)) and its ' +
    'agreement with the imp-35039 finite-difference kernel across dex 9..300, the 3/v correction law, the ' +
    'closed-form 0.6 crossing dex, and the separate E_coll exponent q_coll = (1/2)(1 - u/L) -> 1/2',
  closedFormLatex: 'q_eff(v) = (1 - 1/v)(1 - 1/(v + ln 2pi) - 1/(v + 1)),  v = ln(T0/2pi),  u = 1 - 1/v',
  uClosedForm: 'u = d ln T0/d ln N = (v-1)/v = 1 - 1/v (from N = (T0/2pi)(v-1), dN/dT0 = v/2pi)',
  closedVsFd: CLOSED_VS_FD, // closed form vs imp-35039 finite-difference q_eff across dex 9..300
  maxClosedVsFdErr: +MAX_CLOSED_VS_FD_ERR.toExponential(3), // < 1e-4
  qEffClosed300: QEFF_CLOSED_300, // ~0.9956 at 1e300 (matches imp-35039 qEffFar)
  tailXTimesGap: TAIL_X_TIMES_GAP, // ~3.03: derived 1 - q_eff ~ 3/v ~ 3/ln N
  threeOverV300: THREE_OVER_V_300, // 3/v prediction for 1 - q_eff at 1e300
  gapVs3OverV: +GAP_VS_3_OVER_V.toExponential(3), // O(1/v^2) residual, small
  dexAtQeff0p6Closed: DEX_AT_QEFF_0P6_CLOSED, // ~3.2245 -- the single upward 0.6 crossing (imp-35039 P1)
  qCollClosed300: QCOLL_CLOSED_300, // ~0.4993 -- E_coll exponent approaching 1/2
  limitSeparation: LIMIT_SEPARATION, // q_eff - q_coll -> 1/2: the two limits never meet
  farTailExponent: 0.5, // imp-3463 = 1/2 -- the E_coll exponent, DISTINCT from the E_flow limit 1
  finding: {
    D0_closed_form_limit_is_one:
      'q_eff(v) = (1 - 1/v)(1 - 1/(v + ln 2pi) - 1/(v + 1)) with v = ln(T0/2pi); as v -> inf, u = 1 - 1/v ' +
      '-> 1 and the bracket -> 1, so q_eff -> 1 with 1 - q_eff = 3/v + O(1/v^2) ~ 3/ln N. This DERIVES the ' +
      'imp-35039 P0 monotone-rise-to-1 finding (x*(1-q_eff) ~ 3.03 at 1e300, matching the measured ~3.02).',
    D1_the_0p6_crossing_is_the_root:
      'q_eff(v) is increasing in v, so the single q_eff = 0.6 level is the unique root at v ~ 5.847 ' +
      '(dex ~3.2245, N ~ 1e3.22), an UPWARD crossing far below the 1e9 band -- imp-35039 P1 in closed form.',
    D2_the_half_is_ecolls_derived:
      'E_coll/E_trunc = A (L/N)^(1/2) gives q_coll = -d ln E_coll/dx = (1/2)(1 - u/L) -> 1/2 (imp-3463). ' +
      'This is a SEPARATE term from E_flow (exponent -> 1); q_eff - q_coll -> 1/2, so the two limits never ' +
      'meet -- confirming imp-35039 P2 analytically.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT a rigorous asymptotic). imp-35039 finite-difference ' +
    'MEASURED q_eff rising monotonically toward 1 but left the limit STATED. DERIVED the closed form from ' +
    'the Riemann-von Mangoldt height map: u = d ln T0/d ln N = 1 - 1/v (v = ln(T0/2pi)) yields q_eff(v) = ' +
    '(1 - 1/v)(1 - 1/(v + ln 2pi) - 1/(v + 1)). (D0) monotone increasing with limit 1 and correction ' +
    '1 - q_eff = 3/v + O(1/v^2) ~ 3/ln N (x*(1-q_eff) ~ 3.03 at 1e300). (D1) the single 0.6 crossing is the ' +
    'root at v ~ 5.847 (N ~ 1e3.22), upward far below the band. (D2) the imp-3463 far-tail 1/2 is the ' +
    'SEPARATE E_coll exponent q_coll = (1/2)(1 - u/L) -> 1/2; q_eff - q_coll -> 1/2, so the two limits never ' +
    'meet. The closed form reproduces the imp-35039 finite-difference profile to < 1e-4 across dex 9..300. ' +
    'Closed-form re-expression of the inherited imp-3220/imp-3406 surrogate component model, NOT a rigorous ' +
    'asymptotic for the physical E_flow decay; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) untouched; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'DERIVES imp-35039 P0/P2: q_eff(v) = (1 - 1/v)(1 - 1/(v + ln 2pi) - 1/(v + 1)) in closed form, limit 1 ' +
    'with 1 - q_eff ~ 3/v, 0.6 root at v ~ 5.847, and the separate E_coll exponent -> 1/2. What stays OPEN ' +
    '(deferred, changes no bound): a rigorous asymptotic for the TRUE (non-surrogate) E_flow decay ' +
    'establishing whether the physical log-derivative also approaches 1, and a derivation pinning C_mb below ' +
    'the GUE bound (imp-486).',
  citation:
    'imp-35039 (the finite-difference q_eff profile derived here); imp-34950/imp-34973 (eflowRatio kernel); ' +
    'imp-3463 (far-tail 1/2, the E_coll exponent); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, Riemann-von Mangoldt inverse); polymath15-constant-C-C (C_C = 1/8).',
};

export const IMP35131_EFLOW_QEFF_CLOSED_FORM_LIMIT_TO_ONE_ASSERTIONS = [
  {
    // (D0) the closed form reproduces the imp-35039 finite-difference q_eff profile to < 1e-4.
    id: 'imp35131-closed-form-matches-finite-difference',
    description: 'closed-form q_eff(v) matches the imp-35039 FD kernel to < 1e-4 across dex 9..300',
    holds: () => MAX_CLOSED_VS_FD_ERR < 1e-4 && CLOSED_VS_FD.length === 11,
  },
  {
    // (D0) the derived limit is 1 with 1 - q_eff = 3/v + O(1/v^2): x*(1-q_eff) ~ 3, gap ~ 3/v.
    id: 'imp35131-limit-is-one-3-over-v',
    description: 'q_eff -> 1 with 1 - q_eff ~ 3/v ~ 3/ln N (x*(1-q_eff) ~ 3 at 1e300)',
    holds: () =>
      QEFF_CLOSED_300 > 0.99 &&
      Math.abs(TAIL_X_TIMES_GAP - 3.0) < 0.3 &&
      GAP_VS_3_OVER_V < 5e-4 &&
      Math.abs(QEFF_CLOSED_300 - 0.9956) < 5e-3,
  },
  {
    // (D1) the single closed-form 0.6 crossing is the upward event at dex ~3.2245, below the 1e9 band.
    id: 'imp35131-0p6-crossing-root-below-band',
    description: 'the closed-form q_eff = 0.6 root is the single upward crossing at dex ~3.2245 (N ~ 1e3.22)',
    holds: () => Math.abs(DEX_AT_QEFF_0P6_CLOSED - 3.2245) < 5e-3 && DEX_AT_QEFF_0P6_CLOSED < 9,
  },
  {
    // (D2) the 1/2 is the E_coll exponent; q_eff - q_coll -> 1/2, so the two limits never meet.
    id: 'imp35131-half-is-ecolls-limits-never-meet',
    description: 'E_coll exponent q_coll = (1/2)(1 - u/L) -> 1/2 (~0.4993 at 1e300); q_eff - q_coll -> 1/2',
    holds: () =>
      Math.abs(QCOLL_CLOSED_300 - 0.4993) < 5e-3 &&
      QCOLL_CLOSED_300 < 0.5 &&
      Math.abs(LIMIT_SEPARATION - 0.5) < 0.02,
  },
  {
    // Honesty gate: derivation only, far-tail exponent = 1/2 (E_coll), no QED, no refereed bound is changed.
    id: 'imp35131-honesty-gate-no-qed',
    description: 'Derivation only: far-tail exponent = 1/2 (E_coll), no QED, no refereed bound is changed',
    holds: () =>
      IMP35131_EFLOW_QEFF_CLOSED_FORM_LIMIT_TO_ONE.isRigorous === false &&
      IMP35131_EFLOW_QEFF_CLOSED_FORM_LIMIT_TO_ONE.farTailExponent === 0.5 &&
      typeof IMP35131_EFLOW_QEFF_CLOSED_FORM_LIMIT_TO_ONE.subGap === 'string' &&
      /NO QED/.test(IMP35131_EFLOW_QEFF_CLOSED_FORM_LIMIT_TO_ONE.verdict) &&
      /refereed bound is changed/i.test(IMP35131_EFLOW_QEFF_CLOSED_FORM_LIMIT_TO_ONE.verdict),
  },
];

for (const a of IMP35131_EFLOW_QEFF_CLOSED_FORM_LIMIT_TO_ONE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35131-eflow-qeff-closed-form-limit-to-one assertion failed: ${a.id}`);
  }
}
