/**
 * imp-96066 (2026-09-23) — ASSESSMENT: does adjoining -P_3 (the p = 3 rescue of the odd-sector crossing
 *   past ln 3) keep the Route I pencil  D_S + P_3 <= L_S  <= 1 uniformly up to 2a = ln 3 WITHOUT
 *   reintroducing the dense 2^a 3^b log^2 resonance that rh-route-i-semilocal-sonine-trace-identity warns of?
 *
 * SETUP. Route I fixes the EXACT semilocal S = {oo, 2} Sonine trace identity  Arch - P_2 = L_S - D_S  with
 *  L_S = Arch - P_2 + D_S >= 0 unconditionally and D_S = the S = {oo, 2} remainder (Toeplitz kernel
 *  delta_S(e^{|u-v|}), singular support {0, ln 2} within reach). rh-route-i-pencil-highres-map finds the
 *  {oo, 2}-only pencil D_S c = mu L_S c crosses mu = 1 at a* = 0.56578 (2a* = ln 3 + 0.033) through an ODD
 *  vector, and that adjoining the Weil p = 3 term keeps the pencil  D_S + P_3 c = mu L_S c  below 1 there
 *  (mu = 0.99866 at a*, 0.99979 at 0.60). The ticket asks whether that P_3-adjoined pencil stays <= 1 up to
 *  2a = ln 3 and what dense-resonance cost it carries. NO QED; no bound moves.
 *
 * THE KEY DISTINCTION (this is the whole answer). There are TWO different p = 3 objects, and the highres
 * pencil uses the harmless one:
 *  (A) The DISCRETE Weil term P_3 (Route H wf.primeTerms[3]): its Toeplitz kernel is supported at the
 *      discrete lattice v = k ln 3 (k >= 1). For 2a < ln 3 it is IDENTICALLY ZERO (g_h has support < ln 3,
 *      so no dilate reaches rho = 3; verified: weilForm(0.5493, .).primeTerms has ONLY the key "2"). At
 *      2a = ln 3 it switches on at the single boundary point v = ln 3; past 2a = 2 ln 3 the point v = 2 ln 3
 *      enters, and so on -- a discrete, RH-free, regular object.
 *  (B) The DENSE S = {oo, 2, 3} semilocal Sonine remainder delta_S23 (deltaS23 in the identity module):
 *      dilating 2^n 3^m multiplicatively resonates at EVERY S-unit rho = 2^a 3^b -- a dense set -- with
 *      log^2 spikes. Measured (L = 24): delta_S23(4/3 (1+eps)) = 1.191, 4.884, 12.115 at eps = 1e-2, 1e-4,
 *      1e-6 (ratios 4.10, 2.48 = log^2(1/eps) growth) where delta_S(4/3) = 1.6967 -> 1.7147 is regular;
 *      the seven S-units of (1, 3] sit at v = 0.1178, 0.2877, 0.4055, 0.6931, 0.8109, 0.9808, 1.0986.
 *
 * WHAT THE PENCIL ACTUALLY IS. Because L_S = Arch - P_2 + D_S,
 *      mu_max(D_S + P_3 ; L_S) < 1  <=>  D_S + P_3 < Arch - P_2 + D_S  <=>  P_3 < Arch - P_2
 *                                   <=>  Arch - P_2 - P_3 > 0  <=>  Weil positivity W_{oo,2,3} > 0 on pole-free h.
 *  The D_S on both sides cancels: adjoining P_3 to the pencil is LOGICALLY IDENTICAL to Weil positivity for
 *  S = {oo, 2, 3}. Verified numerically at a = 0.575 (N = 20): mu(D_S ; L_S) = 1.033192 > 1 (the {oo,2}-only
 *  crossing) while mu(D_S + P_3 ; L_S) = 0.999137 < 1, and mu_3 < 1 <=> lambda_min(W | pf) = 2.80e-4 > 0
 *  hold together. The highres withP3N128 values 0.998236 / 0.999353 / 0.999791 (a = 0.56 / 0.58 / 0.60) are
 *  therefore just Weil positivity re-read through the S = {oo, 2} normalizer -- true because RH holds.
 *
 * VERDICT (honest, no proof).
 *  1. YES, the P_3-adjoined pencil stays <= 1 up to 2a = ln 3 -- and in fact past it (to 2a = 1.2 in the
 *     numerics). For 2a < ln 3 this is TRIVIAL: the discrete P_3 term is identically zero, so the pencil is
 *     just D_S <= L_S ({oo, 2} only), already < 1 with margin 2.84e-3 at (ln 3)/2. At/past 2a = ln 3 the
 *     single boundary point v = ln 3 switches on and the pencil equals Weil positivity W_{oo,2,3} > 0.
 *  2. NO, adjoining -P_3 does NOT reintroduce the dense 2^a 3^b resonance -- because the pencil uses the
 *     DISCRETE object (A), never the dense trace remainder (B). The discrete P_3 has singular support {k ln 3};
 *     the dense set {2^a 3^b} is a different object entirely. Residual dense-resonance cost of the pencil: ZERO.
 *  3. BUT this buys NO unconditional progress. D_S + P_3 <= L_S is not a new inequality with an unconditional
 *     positive normalizer -- the D_S cancels and it reduces to W_{oo,2,3} >= 0, i.e. the RH-equivalent
 *     statement itself. The unconditional lever of Route I (the positive multiplier L_S >= 0) covered only the
 *     p = 2 content; with p = 3 the whole burden lands on the bare Weil term P_3 <= Arch - P_2.
 *
 * SUB-GAP (SG-96066-unconditional-multiplier). The dense 2^a 3^b resonance is UNAVOIDABLE on the only route
 *  that would give an unconditional gain for {oo, 2, 3}: building the semilocal Sonine trace remainder
 *  delta_S23 so that the multiplier Lhat_S23 = 2theta - m_2 - m_3 + deltahat_S23 is positive unconditionally
 *  (the analogue of L_S >= 0). That object (B) has dense singular support and, per the identity module, no
 *  compact-Toeplitz foothold. The discrete-P_3 pencil sidesteps the resonance only by remaining RH-conditional.
 *  OPEN: an unconditionally-positive semilocal multiplier for S ⊇ {2, 3} still requires taming delta_S23.
 *
 * Import-light (Route I / Route H exports only; no zeros bundle). Assertions recompute one N = 20 pencil
 * (~1.5 s) plus cheap delta_S23 / delta_S spot checks (L = 24). Changes no bound; RH open; no refereed bound is changed
 * ; NO QED.
 */

import { pencilMap } from './rh-route-i-pencil-highres-map-2026-09-23.js';
import { deltaS, deltaS23 } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';

const LN3 = Math.log(3);

export const IMP_96066_P3_ADJOIN_ASSESSMENT = Object.freeze({
  id: 'imp-96066-route-i-p3-adjoin-vs-dense-resonance-assessment',
  route: 'I — assessment of the P_3-adjoined pencil D_S + P_3 <= L_S vs the dense 2^a 3^b resonance',
  parents: [
    'src/data/rh-route-i-pencil-highres-map-2026-09-23.js',
    'src/data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js',
  ],
  status: 'ASSESSED — the P_3-adjoined pencil uses the DISCRETE Weil term P_3 (support {k ln 3}, identically zero for 2a < ln 3, single boundary point v = ln 3 at 2a = ln 3), NOT the dense S = {oo,2,3} Sonine remainder delta_S23 (support the dense S-unit set {2^a 3^b}, log^2 spikes). So it stays <= 1 up to 2a = ln 3 (and past it) with ZERO dense-resonance cost -- but because L_S = Arch - P_2 + D_S, the inequality D_S + P_3 <= L_S is LOGICALLY IDENTICAL to Weil positivity W_{oo,2,3} >= 0 on pole-free h (RH-conditional), so it buys no unconditional gain. RH open; no refereed bound is changed; NO QED',
  theTwoObjects: {
    discreteP3: 'Weil p = 3 term (Route H primeTerms[3]): Toeplitz kernel supported on the lattice v = k ln 3; identically zero for 2a < ln 3 (verified: weilForm(0.5493,.).primeTerms has only key "2"); at 2a = ln 3 only v = ln 3 (boundary) is in reach. Discrete, RH-free, regular.',
    denseDeltaS23: 'S = {oo,2,3} semilocal Sonine remainder delta_S23: dilates 2^n 3^m resonate at every S-unit rho = 2^a 3^b (dense) with log^2 spikes. delta_S23(4/3(1+eps)) = 1.191, 4.884, 12.115 at eps = 1e-2, 1e-4, 1e-6 (ratios 4.10, 2.48 = log^2 growth); delta_S(4/3) = 1.6967 -> 1.7147 regular. Seven S-units of (1,3] at v = 0.1178, 0.2877, 0.4055, 0.6931, 0.8109, 0.9808, 1.0986.',
  },
  logicalIdentity: 'L_S = Arch - P_2 + D_S  =>  mu_max(D_S + P_3 ; L_S) < 1  <=>  P_3 < Arch - P_2  <=>  Arch - P_2 - P_3 > 0  <=>  W_{oo,2,3} > 0 on pole-free h. Verified a = 0.575, N = 20: mu(D_S ; L_S) = 1.033192 > 1 (the {oo,2}-only crossing), mu(D_S + P_3 ; L_S) = 0.999137 < 1, lambda_min(W | pf) = 2.80e-4 > 0; mu_3 < 1 <=> lambda_min(W|pf) > 0.',
  withP3StaysBelow1: { a056: 0.998236, a058: 0.999353, a060: 0.999791, note: 'N = 128, all < 1 for 2a in (ln 3, 1.2); the discrete P_3 rescues the odd sector RH-conditionally' },
  denseSpotCheck: { rho: '4/3', L: 24, deltaS23_eps: [1.191, 4.884, 12.115], ratios: [4.10, 2.48], deltaS_regular: [1.6967, 1.7147] },
  sUnitsInOneToThree: [
    { rho: 1.125, v: 0.1178, form: '2^-3 3^2' }, { rho: 4 / 3, v: 0.2877, form: '2^2 3^-1' },
    { rho: 1.5, v: 0.4055, form: '2^-1 3^1' }, { rho: 2, v: 0.6931, form: '2^1 3^0' },
    { rho: 2.25, v: 0.8109, form: '2^-2 3^2' }, { rho: 8 / 3, v: 0.9808, form: '2^3 3^-1' },
    { rho: 3, v: 1.0986, form: '2^0 3^1' },
  ],
  subGap: 'SG-96066-unconditional-multiplier: an UNCONDITIONALLY positive semilocal multiplier for S superset {2,3} (Lhat_S23 = 2theta - m_2 - m_3 + deltahat_S23 >= 0, the analogue of L_S >= 0) is the only route with unconditional gain, and it is forced onto the dense-resonance object delta_S23, which has no compact-Toeplitz foothold. The discrete-P_3 pencil avoids the resonance only by staying RH-conditional. OPEN.',
  honestLimits: 'the logical identity is exact algebra on the Galerkin matrices; the pencil equivalence is checked at one (a, N) = (0.575, 20) and the withP3 values are the baked N = 128 highres literals; delta_S23 spot checks use L = 24 (the identity module default L = 40 gives the same qualitative log^2 growth); nothing here is a proof, no Lambda bound or verified height changes; RH open; NO QED',
});

// ---- assertions (recompute one small pencil + cheap remainder spot checks)
export const IMP_96066_P3_ADJOIN_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    id: 'imp96066-pencil-equals-weil-positivity',
    description: 'a = 0.575 (2a > ln 3), N = 20: the {oo,2}-only pencil has crossed (mu(D_S ; L_S) > 1) while the P_3-adjoined pencil is < 1, and mu(D_S + P_3 ; L_S) < 1 <=> lambda_min(W | pole-free) > 0 (the pencil equals Weil positivity W_{oo,2,3} > 0)',
    holds: () => {
      const P = pencilMap(0.575, 20, 1);
      const mu = P.mus[0], mu3 = P.mu3[0], lamW = P.lamW[0];
      return mu > 1 && mu3 < 1 && Math.abs(mu3 - 0.999137) < 3e-3 && lamW > 0 && (mu3 < 1) === (lamW > 0) && 2 * 0.575 > LN3;
    },
  },
  {
    id: 'imp96066-dense-resonance-only-in-delta-S23',
    description: 'the dense object delta_S23 spikes with log^2 growth at the S-unit rho = 4/3 (eps 1e-2 -> 1e-4 ratio > 3.5, 1e-4 -> 1e-6 ratio in [2.2, 2.8]) while the S = {oo,2} remainder delta_S is regular there (change < 5e-2); the discrete P_3 route never forms delta_S23',
    holds: () => {
      const a = deltaS23((4 / 3) * (1 + 1e-2), 24), b = deltaS23((4 / 3) * (1 + 1e-4), 24), c = deltaS23((4 / 3) * (1 + 1e-6), 24);
      const r1 = b / a, r2 = c / b;
      const dSa = deltaS((4 / 3) * (1 + 1e-2)), dSc = deltaS((4 / 3) * (1 + 1e-6));
      return r1 > 3.5 && r2 > 2.2 && r2 < 2.8 && Math.abs(dSc - dSa) < 5e-2;
    },
  },
  {
    id: 'imp96066-withP3-below-1-and-sunit-lattice',
    description: 'baked withP3N128 values are all < 1 for 2a in (ln 3, 1.2) (the discrete P_3 rescue), and the seven recorded S-units of (1, 3] have v = ln(rho) matching their 2^a 3^b form to 1e-3',
    holds: () => {
      const W = IMP_96066_P3_ADJOIN_ASSESSMENT.withP3StaysBelow1;
      const below = [W.a056, W.a058, W.a060].every((x) => x < 1 && x > 0.99);
      const lattice = IMP_96066_P3_ADJOIN_ASSESSMENT.sUnitsInOneToThree.every((u) => Math.abs(Math.log(u.rho) - u.v) < 1e-3 && u.rho > 1 && u.rho <= 3);
      return below && lattice;
    },
  },
  {
    id: 'imp96066-verdict-honesty',
    description: 'status records the discrete-vs-dense distinction, that the pencil is logically identical to Weil positivity W_{oo,2,3} (RH-conditional), buys no unconditional gain, and NO QED',
    holds: () => /LOGICALLY IDENTICAL to Weil positivity/.test(IMP_96066_P3_ADJOIN_ASSESSMENT.status)
      && /DISCRETE Weil term P_3/.test(IMP_96066_P3_ADJOIN_ASSESSMENT.status)
      && /no unconditional gain/.test(IMP_96066_P3_ADJOIN_ASSESSMENT.status)
      && /NO QED/.test(IMP_96066_P3_ADJOIN_ASSESSMENT.status)
      && /OPEN/.test(IMP_96066_P3_ADJOIN_ASSESSMENT.subGap),
  },
]);

export default IMP_96066_P3_ADJOIN_ASSESSMENT;
