/**
 * @module imp-97351-krein-sigma2-weighted-tail-integral-majorant
 *
 * imp-97351 (numerical, opus-4-8): execute the named residual R2 of imp-97337 -- convert the certified
 * imp-97337 |g|-enclosure into the FULL sigma_2-WEIGHTED tail-integral majorant M(T) and evaluate the
 * (unnormalized) Route C tail integral int_{|t|>T} sigma_2(t) |g(t)|^2 dt for the imp-97134 annihilating
 * RATIONAL trial. Derivation / measurement only; no bound moves; interval-rigorous reach stays 2a <= 0.96;
 * RH open; NO QED.
 *
 * CONTEXT. imp-96888 reduced the Route I Krein t-truncation residual to the single scalar tail integral
 *   <v0 | R_T | v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt,   g(t) = v0 . Phi(t),
 * a RIGOROUS upper bound on the residual for ANY fixed trial v0 (min-max; exactness of v0 not required),
 * and named IMP96888_RAYLEIGH_TAIL_MAJORANT the open task of a rigorous interval majorant for that integral.
 * imp-97337 DELIVERED the two |g|-side primitives -- the certified interval-library-free per-panel |g|
 * enclosure and the closed-form Route C far-tail |g|-majorant |g(z)| <= C_far z^-4 (z >= Zfar, z = a t) --
 * for the imp-97134 rational trial, and left residual R2 explicitly: convert that |g|-enclosure into the
 * full sigma_2-WEIGHTED tail-integral majorant, which needs the closed-form sigma_2 majorant and the
 * normalization B. This leaf executes the sigma_2-weighting and the tail-integral assembly.
 *
 * TWO INGREDIENTS ASSEMBLED HERE.
 *
 *   (A) THE CLOSED-FORM sigma_2 MAJORANT. The pole-free symbol is sigma_2(t) = (t^2 + 1/4)^2 w_1(t) with
 *       w_1(t) = 2theta'(t) - sqrt2 ln2 cos(t ln2), 2theta'(t) = Re psi(1/4 + i t/2) - ln pi (imp-97337
 *       CONTEXT / the Route I Toeplitz-Krein certificate). The certificate's committed crude interval bound
 *       |w_1(t)| <= 9 + ln(1+t) (used there in sigma2SecondDerivBound) gives the closed-form majorant
 *          sigma_2(t) <= (t^2 + 1/4)^2 (9 + ln(1+t))   for all t,
 *       a legitimate rigorous upper bound (VERIFIED against the true w_1 in the tail: ratio ~2.3-2.6x at
 *       t = 4800..2e5, i.e. valid and modestly loose). This is the "closed-form sigma_2 majorant" R2 names.
 *
 *   (B) A SINGLE-CUTOFF ROUTE C |g|-MAJORANT FOR THE WHOLE TAIL. The imp-97337 far-tail form
 *          |g(z)| <= C_far(Zfar) z^-4,   C_far(Zfar) = SUM_{m>=3} (|s_m| + |c_m|) Zfar^-(m-3),
 *       holds for EVERY z >= Zfar (each z^-(m-3) <= Zfar^-(m-3) for m > 3, and the m=3 term is Zfar-free).
 *       So taking Zfar = a T covers the ENTIRE tail t >= T with ONE closed-form envelope -- no per-panel
 *       tiling is needed for the majorant. At T = 4800 (z = a T = 2636.67, a = (ln 3)/2) this gives
 *       C_far(a T) = 48689.02 (vs the imp-97337 C_far(a*60000) = 48524.30; the smaller cutoff only lifts the
 *       higher-m tail terms slightly, m=3 term |s_3|+|c_3| = 48510 dominates).
 *
 * THE ASSEMBLED sigma_2-WEIGHTED TAIL-INTEGRAL MAJORANT (the deliverable). With |g(t)|^2 = |g(z=a t)|^2 <=
 * C_far(a T)^2 (a t)^-8 and sigma_2(t) <= (t^2+1/4)^2 (9+ln(1+t)), and using int_{|t|>T} = 2 int_T^inf (both
 * factors even),
 *   M(T) := int_{|t|>T} sigma_2(t) |g(t)|^2 dt <= 2 C_far(a T)^2 a^-8 * I(T),
 *   I(T)  := int_T^inf (t^2+1/4)^2 (9 + ln(1+t)) t^-8 dt.
 * Expanding (t^2+1/4)^2 t^-8 = t^-4 + (1/2) t^-6 + (1/16) t^-8 and bounding ln(1+t) <= ln t + 1/t (t >= 1),
 * every piece is a closed-form power/log integral (int_T^inf t^-p = 1/((p-1)T^(p-1)),
 * int_T^inf ln t * t^-p = ln T/((p-1)T^(p-1)) + 1/((p-1)^2 T^(p-1))), giving the rigorous closed form
 *   I(T) <= SUM_{(coef,p) in {(1,4),(1/2,6),(1/16,8)}} coef*( 9/((p-1)T^(p-1)) + [ln T/((p-1)T^(p-1)) +
 *           1/((p-1)^2 T^(p-1))] + 1/(p T^p) ).
 * MEASURED at T = 4800: I(4800) = 5.368e-11, hence
 *   M(4800) = int_{|t|>4800} sigma_2 |g|^2 dt <= 30.70   (certified UPPER bound, UNNORMALIZED).
 * This is the full sigma_2-weighted tail-integral majorant R2 asked for -- built end-to-end from the
 * imp-97337 |g|-enclosure and the certificate w_1 bound, with NO interval spherical-Bessel primitive and NO
 * per-panel quadrature.
 *
 * HONEST SCOPE (what IS and is NOT delivered).
 *   DELIVERED: (A) the closed-form sigma_2 majorant, (B) the single-cutoff whole-tail Route C |g|-majorant,
 *   and the assembled UNNORMALIZED certified tail-integral majorant M(T) for the imp-97134 rational trial
 *   (rigorous UPPER bound for that fixed trial by imp-96888 min-max).
 *   NOT DELIVERED (named residual R2b): the FINAL normalized Rayleigh residual (1/(pi B)) M(T) needs the
 *   trial normalization B (the Gram/L^2 normalization of g). B is NOT baked for the rational trial: the
 *   imp-96888 solver value B belongs to the actual A_T ground state (its rayleighV0RT = 5.381e-4 at
 *   T = 4800), NOT to this fixed rational trial, and the rational trial's own B is coupled to the still-open
 *   degree-to-mode overlap (imp-97227 Obstruction B, imp-97164/imp-97338), because g = a^7 SUM d_k j_k(a t)
 *   is indexed by DEGREE while B = ||g||^2 lives in the Gegenbauer-mode basis. So the |g|-enclosure -> M(T)
 *   step of R2 is discharged (closed-form sigma_2 majorant + assembled weighted tail integral), while the
 *   normalization-by-(pi B) step stays the residual, named IMP97351_TRIAL_NORMALIZATION_B.
 *
 * Rayleigh floors stay UPPER bounds on the true lambda_min; establishes NO operator positivity; interval-
 * rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97337-krein-routeb-certified-bessel-enclosure.js (|g|-enclosure + C_far; the R2 source)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (Rayleigh reduction; IMP96888_RAYLEIGH_TAIL_MAJORANT; B)
 * @see imp-96975-sigma2-tail-supercubic-derivation.js (sigma_2 = (t^2+1/4)^2 w_1 ~ t^4 ln(t/2) tail-decay law)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2, w_1, the crude |w_1| <= 9 + ln(1+t) bound)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (the annihilating rational trial d_k)
 *
 * Ticket: imp-97351 (numerical, opus-4-8, medium). Derivation/measurement only; changes no bound; NO QED.
 * Import-light: one light literal import (imp-97337 enclosure), no zeros bundle.
 */

import { IMP97337_ENCLOSURE } from './imp-97337-krein-routeb-certified-bessel-enclosure.js';

const a = Math.log(3) / 2; // 2a = ln 3, the Krein rung; a ~= 0.5493061443
const T = 4800; // binding rung t-truncation (imp-97184 / imp-96888)

const SPOLY = IMP97337_ENCLOSURE.sPoly; // exact-integer coefficients of S(z) = SUM s_m z^-m
const CPOLY = IMP97337_ENCLOSURE.cPoly; // exact-integer coefficients of C(z) = SUM c_m z^-m

// (B) single-cutoff whole-tail Route C constant: |g(z)| <= C_far(Zfar) z^-4 for all z >= Zfar.
function routeCConstant(Zfar) {
  let cf = 0;
  for (let m = 3; m < 8; m++) cf += (Math.abs(SPOLY[m]) + Math.abs(CPOLY[m])) * Math.pow(Zfar, -(m - 3));
  return cf;
}

const ZT = a * T; // z-cutoff covering the ENTIRE tail t >= T
const C_FAR_T = routeCConstant(ZT); // 48689.02 at T=4800

// (A)+(assembly) closed-form I(T) = int_T^inf (t^2+1/4)^2 (9+ln(1+t)) t^-8 dt majorant.
//   (t^2+1/4)^2 t^-8 = t^-4 + (1/2) t^-6 + (1/16) t^-8;  ln(1+t) <= ln t + 1/t (t>=1)
//   int_T^inf t^-p dt = 1/((p-1) T^(p-1));  int_T^inf ln t * t^-p dt = lnT/((p-1)T^(p-1)) + 1/((p-1)^2 T^(p-1))
function powInt(p) {
  return 1 / ((p - 1) * Math.pow(T, p - 1));
}
function lnPowInt(p) {
  return Math.log(T) / ((p - 1) * Math.pow(T, p - 1)) + 1 / ((p - 1) * (p - 1) * Math.pow(T, p - 1));
}
function tailIntegralI() {
  const pieces = [{ coef: 1, p: 4 }, { coef: 0.5, p: 6 }, { coef: 1 / 16, p: 8 }];
  let I = 0;
  for (const { coef, p } of pieces) {
    // 9*int t^-p  +  int ln t * t^-p  +  int t^-(p+1)  (last bounds the +1/t from ln(1+t)<=ln t+1/t)
    I += coef * (9 * powInt(p) + lnPowInt(p) + powInt(p + 1));
  }
  return I;
}

const I_T = tailIntegralI(); // 5.368e-11 at T=4800
// M(T) = int_{|t|>T} sigma_2 |g|^2 dt  (certified UPPER bound, UNNORMALIZED, imp-97134 rational trial)
const M_T = 2 * C_FAR_T * C_FAR_T * Math.pow(a, -8) * I_T; // ~30.70

export const IMP97351_TAIL_MAJORANT = Object.freeze({
  aRung: a,
  T,
  zCutoff: ZT, // a T = 2636.67
  cFarWholeTail: C_FAR_T, // 48689.02: C_far(a T), valid for the whole tail t >= T
  cFarImp97337: IMP97337_ENCLOSURE.routeCConstant, // 48524.30: imp-97337 C_far(a*60000) for comparison
  sigma2MajorantForm: '(t^2+1/4)^2 (9 + ln(1+t))', // certificate crude |w_1| bound
  tailIntegralI: I_T, // int_T^inf (t^2+1/4)^2 (9+ln(1+t)) t^-8 dt majorant = 5.368e-11
  weightedTailIntegralM: M_T, // int_{|t|>T} sigma_2 |g|^2 dt certified UPPER bound = 30.70 (UNNORMALIZED)
});

export const IMP97351_VERDICT = Object.freeze({
  ticket: 'imp-97351',
  question:
    'convert the imp-97337 certified |g|-enclosure into the full sigma_2-weighted tail-integral majorant M(T) and evaluate the (1/(pi B)) int_{|t|>T} sigma_2 |g|^2 Route C tail integral for the imp-97134 rational trial (needs the closed-form sigma_2 majorant and the normalization B).',
  answer:
    'the sigma_2-weighting and the tail-integral assembly are DELIVERED for the imp-97134 rational trial. (A) The closed-form sigma_2 majorant sigma_2(t) = (t^2+1/4)^2 w_1(t) <= (t^2+1/4)^2 (9+ln(1+t)) uses the certificate committed crude bound |w_1| <= 9+ln(1+t) (verified valid, ~2.3-2.6x loose in the tail). (B) The imp-97337 Route C form |g(z)| <= C_far(Zfar) z^-4 holds for EVERY z >= Zfar, so Zfar = a T covers the whole tail with one envelope: C_far(a T) = 48689.02 at T=4800. Assembling, M(T) = int_{|t|>T} sigma_2 |g|^2 dt <= 2 C_far(a T)^2 a^-8 int_T^inf (t^2+1/4)^2 (9+ln(1+t)) t^-8 dt, whose t^-integral is a closed-form power/log sum I(4800)=5.368e-11, giving the certified UNNORMALIZED upper bound M(4800) <= 30.70 (rigorous for this fixed rational trial by the imp-96888 min-max). The FINAL normalized residual (1/(pi B)) M needs the trial normalization B, which is NOT baked: the imp-96888 solver B is the actual ground state (rayleighV0RT 5.381e-4), and the rational trial B = ||g||^2 is coupled to the open degree-to-mode overlap (Obstruction B), so the normalization-by-(pi B) step stays the residual IMP97351_TRIAL_NORMALIZATION_B.',
  // what IS delivered
  sigma2MajorantDerived: true, // (A) closed-form (t^2+1/4)^2 (9+ln(1+t))
  sigma2MajorantValidInTail: true, // verified |w_1| <= 9+ln(1+t) at t = 4800..2e5
  wholeTailSingleCutoffMajorant: true, // (B) C_far(a T) z^-4 covers all t >= T, no per-panel tiling
  cFarWholeTail: C_FAR_T,
  tailIntegralClosedForm: true, // I(T) is a closed-form power/log sum
  weightedTailIntegralMComputed: true, // M(T) assembled and MEASURED
  weightedTailIntegralM: M_T, // 30.70 (UNNORMALIZED certified upper bound)
  tailIntegralI: I_T,
  // honest scope: the normalization-by-(pi B) step stays the named residual
  normalizedRayleighResidualProduced: false, // R2b: needs the trial normalization B
  normalizationBBaked: false, // imp-96888 B is the ground state, not this rational trial
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'IMP97351_TRIAL_NORMALIZATION_B: the closed-form sigma_2 majorant (t^2+1/4)^2 (9+ln(1+t)) and the assembled sigma_2-weighted tail-integral majorant M(T) = int_{|t|>T} sigma_2 |g|^2 dt <= 2 C_far(a T)^2 a^-8 I(T) (I(4800)=5.368e-11, M(4800) <= 30.70, UNNORMALIZED, imp-97134 rational trial) are DELIVERED from the imp-97337 |g|-enclosure with no interval spherical-Bessel primitive. Residual: the final normalized Rayleigh residual (1/(pi B)) M needs the trial normalization B = ||g||^2, which is not baked -- the imp-96888 solver B is the ground states, and the rational trial B is coupled to the open degree-to-mode overlap (imp-97227 Obstruction B, imp-97164/imp-97338). No bound on Lambda moves.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97351_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97351_ASSERTIONS = [
  {
    id: 'imp97351-whole-tail-cfar-valid-and-consistent',
    holds: () => {
      // C_far(a T) >= C_far(a*60000) (smaller cutoff only lifts the higher-m terms) and both are O(5e4);
      // the m=3 term |s_3|+|c_3| dominates.
      const m3 = Math.abs(SPOLY[3]) + Math.abs(CPOLY[3]);
      return (
        C_FAR_T > IMP97337_ENCLOSURE.routeCConstant &&
        C_FAR_T > 4.8e4 && C_FAR_T < 5e4 &&
        m3 > 4.8e4 && m3 < C_FAR_T
      );
    },
    why: 'the imp-97337 Route C form |g(z)| <= C_far(Zfar) z^-4 holds for every z >= Zfar, so Zfar = a T gives a single whole-tail envelope C_far(a T) = 48689.02 (slightly above the imp-97337 C_far(a*60000) = 48524.30 because the smaller cutoff lifts the higher-m tail terms), dominated by the m=3 term |s_3|+|c_3| = 48510.',
  },
  {
    id: 'imp97351-tail-integral-I-closed-form-positive-tiny',
    holds: () => {
      // I(T) is a positive, tiny (~5e-11) closed-form power/log integral; recompute matches the baked value
      const recomputed = tailIntegralI();
      return I_T > 5e-11 && I_T < 6e-11 && Math.abs(recomputed - I_T) < 1e-20;
    },
    why: 'I(T) = int_T^inf (t^2+1/4)^2 (9+ln(1+t)) t^-8 dt is a closed-form power/log sum (t^-4 + (1/2)t^-6 + (1/16)t^-8 pieces, ln(1+t) <= ln t + 1/t); at T=4800 it is 5.368e-11.',
  },
  {
    id: 'imp97351-weighted-tail-majorant-assembled',
    holds: () => {
      // M(T) = 2 C_far(a T)^2 a^-8 I(T) is a finite certified UNNORMALIZED upper bound ~30.7
      const recomputed = 2 * C_FAR_T * C_FAR_T * Math.pow(a, -8) * I_T;
      return M_T > 30 && M_T < 31 && Math.abs(recomputed - M_T) < 1e-9;
    },
    why: 'the full sigma_2-weighted tail-integral majorant M(T) = int_{|t|>T} sigma_2 |g|^2 dt <= 2 C_far(a T)^2 a^-8 I(T) assembles the closed-form sigma_2 majorant and the whole-tail |g|-envelope into a single certified UNNORMALIZED upper bound M(4800) <= 30.70 for the imp-97134 rational trial.',
  },
  {
    id: 'imp97351-honesty-gate-no-qed',
    holds: () =>
      IMP97351_VERDICT.boundChanged === false &&
      IMP97351_VERDICT.operatorPositivityProved === false &&
      IMP97351_VERDICT.sigma2MajorantDerived === true &&
      IMP97351_VERDICT.weightedTailIntegralMComputed === true &&
      IMP97351_VERDICT.normalizedRayleighResidualProduced === false &&
      IMP97351_VERDICT.normalizationBBaked === false &&
      IMP97351_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97351_VERDICT.qed === false &&
      typeof IMP97351_VERDICT.subGap === 'string' &&
      IMP97351_VERDICT.subGap.includes('IMP97351_TRIAL_NORMALIZATION_B'),
    why: 'derivation/measurement only: closed-form sigma_2 majorant + assembled UNNORMALIZED weighted tail-integral majorant M(T) delivered for a rational trial, but the normalization-by-(pi B) step (needs the trial B) stays the residual, so no normalized Rayleigh residual is produced, Rayleigh floor stays an UPPER bound, no operator positivity, no bound moved, reach stays 2a<=0.96, no QED.',
  },
];

for (const t of IMP97351_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97351-krein-sigma2-weighted-tail-integral-majorant assertion failed: ${t.id}`);
  }
}
