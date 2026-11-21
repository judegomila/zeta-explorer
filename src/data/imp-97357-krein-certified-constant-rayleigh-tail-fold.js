/**
 * @module imp-97357-krein-certified-constant-rayleigh-tail-fold
 *
 * imp-97357 (numerical, opus-4-8): PROPAGATE the imp-97331 interval-CERTIFIED z^-4 tail constant
 * C_certified = 45504.154 into the imp-96888 Rayleigh tail integral and MEASURE its contribution to the
 * c_sharp floor. Measurement only; couples to the imp-97351 sigma_2 majorant; no operator positivity;
 * no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * CONTEXT. imp-96888 reduced the Route I Krein t-truncation residual to the single scalar tail integral
 *   <v0 | R_T | v0> = (1/(pi B)) int_{|t|>T} sigma_2(t) |g(t)|^2 dt,   g(t) = v0 . Phi(t),
 * a RIGOROUS upper bound on the residual for ANY fixed trial v0 (min-max; exactness of v0 not required).
 * imp-97351 assembled the UNNORMALIZED sigma_2-weighted tail-integral majorant
 *   M(T) := int_{|t|>T} sigma_2 |g|^2 dt <= 2 C^2 a^-8 I(T),  I(T) = int_T^inf (t^2+1/4)^2 (9+ln(1+t)) t^-8 dt,
 * for the imp-97134 annihilating rational trial, using the imp-97337 z^-4 |g|-envelope constant C = C_far.
 * That C_far = 48689.02 was a TRIANGLE-inequality bound (|g| <= (|S|+|C|) z^-4) evaluated in IEEE double --
 * legitimate but neither the sharp Cauchy-Schwarz form nor interval-certified.
 *
 * WHAT imp-97331 SUPPLIES (the constant this leaf propagates). imp-97294/imp-97312 collapsed the combined
 * spherical-Bessel remainder of the same imp-97134 trial into a single {cos z, sin z} harmonic and, by
 * Cauchy-Schwarz on that pair, bounded it by F(z) = sqrt(Atil(z)^2 + Btil(z)^2) with Atil, Btil polynomials
 * in u = 1/z with EXACT-INTEGER coefficients. imp-97331 then interval-CERTIFIED
 *   sup_{z >= Z0} F(z)  in  [ 45504.1205 , 45504.154 ]   (Z0 = a*100 = 54.9306, argmax at the tail edge),
 * so | SUM_k d_k R_k(z) | <= C_certified z^-4 for all z >= Z0 with the rigorous single constant
 * C_certified = 45504.154. Because the imp-97134 trial ANNIHILATES the leading Bessel asymptotics, the
 * combined remainder IS the tail g, so C_certified z^-4 is a rigorous |g|-envelope on the whole integration
 * tail (Z0 = 54.93 <= a*T = 2636.67, so the imp-97331 certified domain covers the imp-96888/imp-97351 tail
 * t >= T = 4800). C_certified (Cauchy-Schwarz, interval-certified) < C_far (triangle, IEEE): the sqrt form
 * dominates the sum-of-magnitudes form.
 *
 * THE FOLD (the deliverable). Substituting the interval-certified |g|-side constant C_certified for the
 * imp-97337 IEEE triangle constant C_far in the imp-97351 assembly (a, T, I(T) unchanged) gives
 *   M_cert(T) = 2 C_certified^2 a^-8 I(T),
 *   M_cert(4800) = 26.818   (certified UPPER bound, UNNORMALIZED, imp-97134 rational trial),
 * a factor (C_certified/C_far)^2 = 0.8735 tighter than the imp-97351 M(4800) = 30.704 (a 12.65% reduction),
 * AND upgraded on the |g| side from an IEEE triangle bound to an interval-certified Cauchy-Schwarz bound.
 * Using the matching interval LOWER edge value Fedge_lower = 45504.1205 in place of C_certified moves M by
 * only ~4e-5 (M_cert_lo = 26.8183), so the |g|-side enclosure contributes negligible width: the residual
 * looseness is now entirely in the sigma_2 majorant (imp-97351, ~2.3-2.6x) and the normalization B, NOT the
 * |g|-envelope.
 *
 * CONTRIBUTION TO THE c_sharp FLOOR (honest scope). The tail contribution to the Rayleigh floor is
 * (1/(pi B)) M_cert(T). This leaf DELIVERS the interval-certified UNNORMALIZED numerator M_cert(4800) = 26.818;
 * it does NOT produce the normalized floor contribution, because the trial normalization B = ||g||^2 is NOT
 * baked -- the imp-96888 solver B belongs to the actual A_T ground state (rayleighV0RT = 5.381e-4), NOT to
 * this fixed rational trial, and the rational trial B is coupled to the still-open degree-to-mode overlap
 * (imp-97227 Obstruction B, imp-97164/imp-97338). So the normalization-by-(pi B) step remains the inherited
 * residual IMP97351_TRIAL_NORMALIZATION_B; the c_sharp floor contribution is delivered only up to that factor.
 * A FURTHER tightening (not taken here, since the ticket propagates the baked 45504.154) would re-certify the
 * interval sup of F over the SMALLER domain z >= a*T = 2636.67 (the actual integration cutoff, vs the imp-97331
 * z >= Z0 = 54.93), where F is far below its tail-edge peak -- named IMP97357_CERTIFIED_SUP_AT_BINDING_CUTOFF.
 *
 * Rayleigh floors stay UPPER bounds on the true lambda_min; establishes NO operator positivity; interval-
 * rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97331-krein-bessel-z4-interval-certified-tail-constant.js (C_certified = 45504.154; the propagated constant)
 * @see imp-97351-krein-sigma2-weighted-tail-integral-majorant.js (M(T) assembly; sigma_2 majorant; B residual)
 * @see imp-96888-krein-tresidual-rayleigh-permode-bound.js (Rayleigh reduction; IMP96888_RAYLEIGH_TAIL_MAJORANT)
 * @see imp-97337-krein-routeb-certified-bessel-enclosure.js (the C_far triangle IEEE envelope this sharpens)
 * @see imp-97134-krein-annihilating-rational-trial-execution.js (the annihilating rational trial d_k)
 *
 * Ticket: imp-97357 (numerical, opus-4-8, medium). Measurement only; changes no bound; NO QED.
 * Import-light: two light literal imports (imp-97331 constant, imp-97351 assembly), no zeros bundle.
 */

import { IMP97331_INTERVAL_TAIL_CONSTANT } from './imp-97331-krein-bessel-z4-interval-certified-tail-constant.js';
import { IMP97351_TAIL_MAJORANT } from './imp-97351-krein-sigma2-weighted-tail-integral-majorant.js';

const a = IMP97351_TAIL_MAJORANT.aRung; // 2a = ln 3, the Krein rung; a ~= 0.5493061443
const T = IMP97351_TAIL_MAJORANT.T; // 4800: binding rung t-truncation (imp-96888)
const I_T = IMP97351_TAIL_MAJORANT.tailIntegralI; // int_T^inf (t^2+1/4)^2 (9+ln(1+t)) t^-8 dt = 5.368e-11
const C_FAR = IMP97351_TAIL_MAJORANT.cFarWholeTail; // 48689.02: imp-97337 IEEE triangle z^-4 |g|-constant
const M_FAR = IMP97351_TAIL_MAJORANT.weightedTailIntegralM; // 30.704: imp-97351 M(4800) with C_far

const C_CERT = IMP97331_INTERVAL_TAIL_CONSTANT.C_certified; // 45504.154: interval upper bound of sup F
const C_CERT_LO = IMP97331_INTERVAL_TAIL_CONSTANT.Fedge_lower; // 45504.1205: interval lower bound at z=Z0
const Z0 = IMP97331_INTERVAL_TAIL_CONSTANT.Z0; // 54.9306: imp-97331 far-tail cutoff (a*100)
const Z_CUTOFF = a * T; // 2636.67: imp-97351 integration cutoff; Z0 <= Z_CUTOFF, so C_CERT covers the tail

// The fold: substitute the interval-certified Cauchy-Schwarz |g|-constant for the IEEE triangle C_far.
const foldM = (C) => 2 * C * C * Math.pow(a, -8) * I_T;
const M_CERT = foldM(C_CERT); // 26.818: certified UNNORMALIZED tail-integral majorant with C_certified
const M_CERT_LO = foldM(C_CERT_LO); // 26.8183: same fold with the interval lower edge value
const RATIO = M_CERT / M_FAR; // 0.8735 = (C_certified/C_far)^2: the tightening factor over imp-97351

export const IMP97357_CERTIFIED_FOLD = Object.freeze({
  aRung: a,
  T,
  tailIntegralI: I_T,
  Z0, // imp-97331 certified-sup cutoff (a*100)
  zCutoff: Z_CUTOFF, // imp-97351 integration cutoff (a*T); Z0 <= zCutoff so C_certified covers the tail
  cFarImp97337: C_FAR, // 48689.02: IEEE triangle z^-4 |g|-constant (the one imp-97351 used)
  cCertifiedImp97331: C_CERT, // 45504.154: interval-certified Cauchy-Schwarz z^-4 constant (propagated here)
  cCertifiedLowerEdge: C_CERT_LO, // 45504.1205: interval lower edge, for the enclosure-width check
  cRatio: C_CERT / C_FAR, // 0.93459: interval-certified constant is below the IEEE triangle constant
  weightedTailIntegralMImp97351: M_FAR, // 30.704: imp-97351 M(4800) with C_far
  weightedTailIntegralMCertified: M_CERT, // 26.818: M(4800) with C_certified (interval-certified, UNNORMALIZED)
  weightedTailIntegralMCertifiedLowerEdge: M_CERT_LO, // 26.8183: fold using the lower edge (enclosure width ~4e-5)
  ratioOverImp97351: RATIO, // 0.8735 = (C_certified/C_far)^2
  reductionFraction: 1 - RATIO, // 0.1265: 12.65% tighter than imp-97351
});

export const IMP97357_VERDICT = Object.freeze({
  ticket: 'imp-97357',
  question:
    'propagate the imp-97331 interval-certified z^-4 tail constant C_certified = 45504.154 into the imp-96888 Rayleigh tail integral (assembled by imp-97351 as M(T) = 2 C^2 a^-8 I(T)) and measure its contribution to the c_sharp floor.',
  answer:
    'the imp-97134 annihilating trial makes the combined Bessel remainder equal the tail g, so the imp-97331 interval-certified constant C_certified = 45504.154 is a rigorous z^-4 |g|-envelope on the whole integration tail (its certified domain z >= Z0 = 54.93 covers the imp-97351 cutoff z >= a*T = 2636.67). Substituting it for the imp-97337 IEEE triangle constant C_far = 48689.02 in the imp-97351 assembly (a, T, I(T) unchanged) folds through to M_cert(4800) = 26.818, a factor (C_certified/C_far)^2 = 0.8735 tighter (12.65% reduction) than the imp-97351 M(4800) = 30.704, AND upgraded on the |g| side from an IEEE triangle bound to an interval-certified Cauchy-Schwarz bound. The |g|-side enclosure is negligibly wide: using the matching lower edge Fedge_lower = 45504.1205 changes M by only ~4e-5. The contribution to the c_sharp floor is (1/(pi B)) M_cert; this delivers the interval-certified UNNORMALIZED numerator M_cert(4800) = 26.818, but NOT the normalized floor contribution -- the trial normalization B is not baked (imp-96888 B is the ground state, the rational trial B is coupled to the open degree-to-mode overlap), so the normalization-by-(pi B) step stays the inherited residual IMP97351_TRIAL_NORMALIZATION_B.',
  // what IS delivered
  certifiedConstantPropagated: true, // C_certified = 45504.154 substituted for C_far in the M(T) assembly
  certifiedDomainCoversTail: Z0 <= Z_CUTOFF, // imp-97331 sup domain z>=Z0=54.93 covers the tail z>=a*T=2636.67
  certifiedConstantTighterThanIEEE: C_CERT < C_FAR, // Cauchy-Schwarz sqrt < triangle sum-of-magnitudes
  weightedTailIntegralMCertified: M_CERT, // 26.818 (UNNORMALIZED, interval-certified |g| side)
  ratioOverImp97351: RATIO, // 0.8735 = (C_certified/C_far)^2
  gEnvelopeEnclosureNegligible: Math.abs(M_CERT - M_CERT_LO) / M_CERT < 1e-5, // lower edge moves M by ~4e-5
  // honest scope: the normalization-by-(pi B) step stays the inherited residual
  normalizedFloorContributionProduced: false, // needs the trial normalization B
  normalizationBBaked: false, // imp-96888 B is the ground state, not this rational trial
  operatorPositivityProved: false, // Rayleigh floor stays an UPPER bound
  boundChanged: false,
  subGap:
    'the imp-97331 interval-certified z^-4 tail constant C_certified = 45504.154 is propagated into the imp-96888/imp-97351 sigma_2-weighted tail integral, folding to the interval-certified UNNORMALIZED majorant M_cert(4800) = 2 C_certified^2 a^-8 I(4800) = 26.818 for the imp-97134 rational trial -- a factor (C_certified/C_far)^2 = 0.8735 tighter than the imp-97351 M(4800) = 30.704 and interval-certified on the |g| side (the enclosure width contributes only ~4e-5). Two residuals remain: (i) the inherited IMP97351_TRIAL_NORMALIZATION_B -- the final c_sharp floor contribution (1/(pi B)) M_cert needs the trial normalization B = ||g||^2, coupled to the open degree-to-mode overlap (imp-97227 Obstruction B, imp-97164/imp-97338); (ii) IMP97357_CERTIFIED_SUP_AT_BINDING_CUTOFF -- re-certifying the interval sup of F over the tighter domain z >= a*T = 2636.67 (vs z >= Z0 = 54.93) would shrink M_cert further, since F sits far below its tail-edge peak on the actual integration domain. No bound on Lambda moves.',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97357_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97357_ASSERTIONS = [
  {
    id: 'imp97357-certified-constant-tighter-than-ieee-triangle',
    holds: () =>
      C_CERT < C_FAR &&
      C_CERT / C_FAR > 0.93 && C_CERT / C_FAR < 0.94 &&
      C_CERT_LO <= C_CERT && C_CERT_LO > 4.55e4,
    why: 'the imp-97331 interval-certified Cauchy-Schwarz constant C_certified = 45504.154 is below the imp-97337 IEEE triangle constant C_far = 48689.02 (sqrt(A^2+B^2) <= |A|+|B|), with C_certified/C_far = 0.9346, and its interval lower edge Fedge_lower = 45504.1205 sits just below it.',
  },
  {
    id: 'imp97357-certified-domain-covers-integration-tail',
    holds: () => Z0 > 0 && Z_CUTOFF > Z0 && Math.abs(Z0 - a * 100) < 1e-6 && Math.abs(Z_CUTOFF - a * T) < 1e-6,
    why: 'the imp-97331 certified supremum holds for z >= Z0 = a*100 = 54.93, which covers the imp-97351 integration cutoff z >= a*T = 2636.67, so C_certified z^-4 is a rigorous |g|-envelope on the whole tail t >= T = 4800.',
  },
  {
    id: 'imp97357-fold-recomputes-and-is-tighter',
    holds: () => {
      const recomputed = 2 * C_CERT * C_CERT * Math.pow(a, -8) * I_T;
      return (
        Math.abs(recomputed - M_CERT) < 1e-9 &&
        M_CERT > 26 && M_CERT < 27 &&
        M_CERT < M_FAR &&
        Math.abs(RATIO - (C_CERT / C_FAR) ** 2) < 1e-12
      );
    },
    why: 'substituting C_certified for C_far in the imp-97351 assembly M(T) = 2 C^2 a^-8 I(T) recomputes to M_cert(4800) = 26.818, tighter than the imp-97351 M(4800) = 30.704 by exactly the factor (C_certified/C_far)^2 = 0.8735.',
  },
  {
    id: 'imp97357-g-envelope-enclosure-negligible',
    holds: () => {
      const relWidth = Math.abs(M_CERT - M_CERT_LO) / M_CERT;
      return relWidth > 0 && relWidth < 1e-5;
    },
    why: 'folding the interval lower edge Fedge_lower instead of C_certified moves M by only ~4e-5 (relative width < 1e-5), so the |g|-side interval enclosure contributes negligibly -- the residual looseness lives in the sigma_2 majorant and the normalization B, not the |g|-envelope.',
  },
  {
    id: 'imp97357-measurement-only-no-qed',
    holds: () =>
      IMP97357_VERDICT.certifiedConstantPropagated === true &&
      IMP97357_VERDICT.certifiedDomainCoversTail === true &&
      IMP97357_VERDICT.certifiedConstantTighterThanIEEE === true &&
      IMP97357_VERDICT.normalizedFloorContributionProduced === false &&
      IMP97357_VERDICT.normalizationBBaked === false &&
      IMP97357_VERDICT.operatorPositivityProved === false &&
      IMP97357_VERDICT.boundChanged === false &&
      IMP97357_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97357_VERDICT.qed === false &&
      typeof IMP97357_VERDICT.subGap === 'string' &&
      IMP97357_VERDICT.subGap.includes('IMP97351_TRIAL_NORMALIZATION_B'),
    why: 'measurement only: the interval-certified constant is propagated into an UNNORMALIZED tail-integral majorant, but the normalization-by-(pi B) step (needs the trial B) stays the inherited residual, so no normalized floor contribution is produced, Rayleigh floor stays an UPPER bound, no operator positivity, no bound moved, reach stays 2a<=0.96, no QED.',
  },
];

for (const t of IMP97357_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97357-krein-certified-constant-rayleigh-tail-fold assertion failed: ${t.id}`);
  }
}
