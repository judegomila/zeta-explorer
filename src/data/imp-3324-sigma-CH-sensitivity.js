/**
 * @module imp-3324-sigma-CH-sensitivity
 *
 * imp-3324 (numerical, frontier-direction): imp-3220 finds the empirical-vs-analytic
 * bridge fidelity gap is WIDEST -- the GUE-conditional share sigma(N) = E_coll/E(N)
 * peaks at ~0.949 -- at the N* = 10^6 assembly ceiling. That headline 94.9% rests on
 * the single ansatz constant C_H = 1/8 (imp-2642): the collision term is
 *     E_coll = C_C sqrt(log T0 / N),  C_C = C_H sqrt(C_KH),  C_KH = pi C_Selberg = 3pi,
 * and C_H = 1/8 is the EXACT leading-order quadratic-tangency coefficient, NOT a
 * rigorous Holder-1/2 modulus upper bound (imp-2642 classification; a rigorous audit
 * loosens the effective coefficient to ~0.127 > 1/8, imp-2643). This module measures
 * how LOAD-BEARING that single constant is for the headline share: it computes
 * d(sigma)/d(C_H) at N* = 10^6 and re-tabulates sigma(10^6) as C_H sweeps a plausible
 * bracket, reusing the EXACT imp-3220 sub-term formulas.
 *
 * THE QUANTITY (identical to imp-3220, now parametrized by C_H)
 * ------------------------------------------------------------
 *     sigma(C_H) = E_coll(C_H) / (E_trunc + E_flow + E_coll(C_H))
 *                = E_coll(C_H) / (R + E_coll(C_H)),    R = E_trunc + E_flow  (C_H-free)
 * with the same repo sub-terms at N* = 10^6:
 *     T0     = effectiveHeightForN(1e6)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_H sqrt(C_KH) sqrt(log T0 / N),  sqrt(C_KH) = 8 C_C_PINNED = sqrt(3pi)
 *     E_flow = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                              (N-independent, imp-2631)
 * At C_H = 1/8 this reproduces the imp-3220 pinned E_coll = C_C_PINNED sqrt(log T0/N)
 * exactly, so sigma(1/8) = 0.9494 recovers the imp-3220 widest-gap value.
 *
 * Only E_coll carries C_H, and it is LINEAR in C_H, so R stays fixed as C_H sweeps.
 * Writing x = E_coll = C_H sqrt(C_KH) sqrt(log T0/N), sigma = x/(R + x) is a saturating
 * (Michaelis-Menten-type) function of C_H with the CLOSED-FORM derivative
 *     d(sigma)/d(C_H) = R sqrt(C_KH) sqrt(log T0/N) / (R + x)^2 = (1 - sigma) sigma / C_H,
 * hence the dimensionless SEMI-ELASTICITY d(sigma)/d(log C_H) = sigma (1 - sigma).
 *
 * THE FINDING (assessment only)
 * -----------------------------
 *   (F1) DERIVATIVE. At the ansatz C_H = 1/8, sigma(10^6) = 0.949408 and the local
 *        slope is d(sigma)/d(C_H) = 0.38426 per unit C_H (analytic = central-difference
 *        numeric to 1e-6); the semi-elasticity d(sigma)/d(log C_H) = sigma(1-sigma) =
 *        0.04803, so sigma responds to C_H only ~1/20 as fast in log terms.
 *   (F2) THE HEADLINE IS ROBUST. Threading the imp-2643 audited-loosened effective
 *        coefficient 0.127 moves the share by only 7.6e-4 (0.94941 -> 0.95017). Even
 *        an 8x increase to the imp-366 symbolic placeholder C_H = 1.0 moves it only
 *        +4.40 percentage points (0.9494 -> 0.9934), and HALVING it to 0.0625
 *        (C_collision = 16) only drops it to 0.9037. Over the whole plausible bracket
 *        [0.0625, 1.0] the share stays in [0.9037, 0.9934] -- a ~9-point band spanning
 *        a 16x range of C_H, never leaving the >= 84% E_coll-dominant regime.
 *   (F3) WHY. sigma is near its saturation ceiling 1, where the SHARE is insensitive
 *        by construction: the more load-bearing C_H is (the larger E_coll), the LESS
 *        the fraction sigma responds, since d(sigma)/d(log C_H) = sigma(1-sigma) -> 0
 *        as sigma -> 1. C_H is load-bearing for the ABSOLUTE budget E_coll (linear, so
 *        a 16x C_H range is a 16x E_coll range: 7.0e-4 -> 1.12e-2) but NOT for the
 *        conditional SHARE. The two must not be conflated.
 *
 * The punchline: the "94.9% of E(N) rests on the C_H = 1/8 ansatz" headline is a robust
 * qualitative statement -- the E_coll dominance and the sole-GUE-conditional conclusion
 * survive any plausible C_H, shifting the exact percentage by at most a few points --
 * even though C_H fully controls the ABSOLUTE size of the collision budget. The
 * load-bearing role of C_H is on E_coll, not on sigma.
 *
 * ASSESSMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-3220-en-bridge-fidelity-frontier (the widest-gap sigma(10^6) ~ 0.949)
 * @see imp-3323-sigma-argmin-locator (the U-shape argmin, sibling reuse of the formulas)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(3pi); C_H = 1/8 ansatz; imp-2642 label)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3323 exactly
const N_STAR = 1e6; // the imp-3220 widest-gap assembly ceiling

// C_H bracket anchors. The ansatz 1/8 is the imp-2642 leading-order quadratic-tangency
// coefficient (NOT a rigorous Holder-1/2 upper bound); 0.127 is the imp-2643
// audited-loosened effective coefficient; 1.0 is the imp-366 symbolic placeholder.
const C_H_ANSATZ = 0.125;
const C_H_AUDITED = 0.127; // imp-2643 effective-coefficient loosening
const C_H_PLACEHOLDER = 1.0; // imp-366 symbolic placeholder (upper end of the bracket)
const C_H_LO = 0.0625; // half the ansatz (C_collision = 16) -- lower end of the bracket

// sqrt(C_KH) = sqrt(3*pi), recovered from the pinned C_C so the formulas stay IDENTICAL
// to imp-3220 (C_C_PINNED = (1/8) sqrt(C_KH), so sqrt(C_KH) = C_C_PINNED / (1/8)).
const SQRT_C_KH = C_C_PINNED / C_H_ANSATZ;

// Fixed (C_H-independent) part of E(N) at N* = 10^6: the two unconditionally-rigorous terms.
const T0 = effectiveHeightForN(N_STAR);
const L = Math.log(T0);
const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
const E_FLOW = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
const R_FIXED = E_TRUNC_PT + E_FLOW; // E_trunc + E_flow, does NOT depend on C_H

// E_coll is LINEAR in C_H; sigma is the saturating share E_coll / (R + E_coll).
const eColl = (C_H) => C_H * SQRT_C_KH * Math.sqrt(L / N_STAR);
const sigmaOf = (C_H) => {
  const e = eColl(C_H);
  return e / (R_FIXED + e);
};

// Closed-form derivative d(sigma)/d(C_H) = (1 - sigma) sigma / C_H, cross-checked numerically.
const SIGMA_ANSATZ = sigmaOf(C_H_ANSATZ);
const D_SIGMA_D_CH_ANALYTIC = ((1 - SIGMA_ANSATZ) * SIGMA_ANSATZ) / C_H_ANSATZ;
const H = 1e-6;
const D_SIGMA_D_CH_NUMERIC =
  (sigmaOf(C_H_ANSATZ + H) - sigmaOf(C_H_ANSATZ - H)) / (2 * H);
const SEMI_ELASTICITY = SIGMA_ANSATZ * (1 - SIGMA_ANSATZ); // d(sigma)/d(log C_H)

// Re-tabulate sigma(10^6) across the plausible C_H bracket.
const SWEEP_CH = [0.0625, 0.1, 0.125, 0.127, 0.15, 0.2, 0.25, 0.5, 1.0];
const SWEEP = SWEEP_CH.map((C_H) => ({
  C_H,
  E_coll: +eColl(C_H).toExponential(4),
  sigma: +sigmaOf(C_H).toFixed(6),
  deltaVsAnsatz: +(sigmaOf(C_H) - SIGMA_ANSATZ).toFixed(6),
}));

const SIGMA_LO = sigmaOf(C_H_LO); // ~0.9037 at half the ansatz
const SIGMA_PLACEHOLDER = sigmaOf(C_H_PLACEHOLDER); // ~0.9934 at C_H = 1.0
const SIGMA_AUDITED = sigmaOf(C_H_AUDITED); // ~0.9502 at 0.127
const AUDITED_MOVE = SIGMA_AUDITED - SIGMA_ANSATZ; // ~7.6e-4
const PLACEHOLDER_MOVE = SIGMA_PLACEHOLDER - SIGMA_ANSATZ; // ~+0.044
const BRACKET_SPAN = SIGMA_PLACEHOLDER - SIGMA_LO; // ~0.090 over a 16x C_H range

export const IMP3324_SIGMA_CH_SENSITIVITY = {
  id: 'imp-3324',
  proofSection: 'S-frontier',
  question:
    'Measure the sensitivity of the imp-3220 widest-gap conditional share ' +
    'sigma(10^6) ~ 0.949 to the C_H = 1/8 ansatz: compute d(sigma)/d(C_H) and ' +
    're-tabulate sigma(10^6) as C_H sweeps a plausible bracket, quantifying how ' +
    'load-bearing the single ansatz constant is for the headline 94.9% GUE-conditional ' +
    'share of E(N) at the N* = 10^6 assembly ceiling. Assessment only, no QED.',
  bracket: {
    C_H_low: C_H_LO,
    C_H_ansatz: C_H_ANSATZ,
    C_H_audited: C_H_AUDITED,
    C_H_placeholder: C_H_PLACEHOLDER,
    note:
      'Plausible bracket [0.0625, 1.0]: lower end 0.0625 = half the ansatz ' +
      '(C_collision = 16); anchor 0.125 = imp-2642 leading-order quadratic-tangency ' +
      'coefficient (the ansatz); 0.127 = imp-2643 audited-loosened effective coefficient; ' +
      'upper end 1.0 = imp-366 symbolic placeholder. Spans a 16x range of C_H.',
  },
  derivative: {
    sigma_at_ansatz: +SIGMA_ANSATZ.toFixed(7), // 0.9494076
    d_sigma_d_CH_analytic: +D_SIGMA_D_CH_ANALYTIC.toFixed(6), // 0.384263
    d_sigma_d_CH_numeric: +D_SIGMA_D_CH_NUMERIC.toFixed(6), // 0.384263 (cross-check)
    semi_elasticity_d_sigma_d_logCH: +SEMI_ELASTICITY.toFixed(6), // 0.048033 = sigma(1-sigma)
    note:
      'At the ansatz C_H = 1/8, sigma(10^6) = 0.949408 with local slope ' +
      'd(sigma)/d(C_H) = (1-sigma)sigma/C_H = 0.38426 per unit C_H (analytic = ' +
      'central-difference numeric to 1e-6). The dimensionless semi-elasticity ' +
      'd(sigma)/d(log C_H) = sigma(1-sigma) = 0.04803 -- the share responds ~1/20 as ' +
      'fast in log terms, because sigma sits near its saturation ceiling 1.',
  },
  sweep: SWEEP,
  robustness: {
    sigma_at_half_ansatz: +SIGMA_LO.toFixed(6), // 0.903688
    sigma_at_placeholder: +SIGMA_PLACEHOLDER.toFixed(6), // 0.993383
    audited_move_vs_ansatz: +AUDITED_MOVE.toExponential(3), // ~7.57e-4
    placeholder_move_vs_ansatz: +PLACEHOLDER_MOVE.toFixed(6), // ~0.043975 (+4.40 pp)
    bracket_share_span: +BRACKET_SPAN.toFixed(6), // ~0.089695 over 16x C_H
    note:
      'The headline is ROBUST. Threading the imp-2643 audited coefficient 0.127 moves ' +
      'the share only 7.6e-4 (0.94941 -> 0.95017). An 8x increase to the imp-366 ' +
      'placeholder C_H = 1.0 moves it only +4.40 pp (-> 0.9934), and halving it to ' +
      '0.0625 only drops it to 0.9037. Over the whole [0.0625, 1.0] bracket the share ' +
      'stays in [0.9037, 0.9934] (~9-point band across a 16x C_H range), never leaving ' +
      'the >= 84% E_coll-dominant regime.',
  },
  loadBearingAssessment:
    'C_H is load-bearing for the ABSOLUTE collision budget E_coll (linear in C_H, so ' +
    'the 16x bracket is a 16x E_coll range: 7.0e-4 -> 1.12e-2 at N* = 10^6) but NOT for ' +
    'the conditional SHARE sigma. Because sigma = E_coll/(R + E_coll) saturates toward 1, ' +
    'the more load-bearing C_H is, the LESS the share responds: d(sigma)/d(log C_H) = ' +
    'sigma(1-sigma) -> 0 as sigma -> 1. So the "94.9% rests on the ansatz" headline is a ' +
    'robust qualitative statement -- E_coll dominance and the sole-GUE-conditional ' +
    'conclusion survive any plausible C_H, shifting the exact percentage by at most a few ' +
    'points. The absolute-budget and share roles of C_H must not be conflated.',
  isRigorous: false,
  honestStatus:
    'HONEST STATUS (imp-3392): C_H = 1/8 is LOAD-BEARING for the ABSOLUTE collision ' +
    'budget E_coll -- E_coll is linear in C_H, so the 16x plausible bracket ' +
    '[0.0625, 1.0] is a 16x E_coll range (7.0e-4 -> 1.12e-2 at N* = 10^6). It is NOT ' +
    'load-bearing for the conditional SHARE sigma = E_coll/(R + E_coll), which ' +
    'saturates toward 1 and so stays within [0.9037, 0.9934] over the same bracket. ' +
    'These two roles of C_H (absolute-budget driver vs near-saturated-share driver) ' +
    'must not be conflated: a large swing in C_H produces an equally large swing in ' +
    'E_coll but only a small swing in sigma. No positivity, no bridge closure, no RH ' +
    'claim, NO QED. No refereed bound is changed.',
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). At the N* = 10^6 assembly ceiling the ' +
    'imp-3220 widest-gap conditional share sigma(10^6) = 0.949408 has local slope ' +
    'd(sigma)/d(C_H) = 0.38426 (semi-elasticity sigma(1-sigma) = 0.04803). Sweeping C_H ' +
    'over its plausible bracket [0.0625, 1.0] (a 16x range: half the ansatz up to the ' +
    'imp-366 placeholder, through the imp-2643 audited 0.127) moves the share only within ' +
    '[0.9037, 0.9934] -- the audited loosening shifts it 7.6e-4 and the full 8x placeholder ' +
    'shifts it +4.40 pp. C_H is load-bearing for the ABSOLUTE E_coll budget (linear) but ' +
    'NOT for the SHARE, which saturates toward 1; the "94.9% rests on the C_H = 1/8 ansatz" ' +
    'headline is therefore robust to the ansatz value. No positivity, no bridge closure, ' +
    'no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-3220 (widest-gap sigma(10^6) ~ 0.949); imp-3323 (sibling argmin locator, same ' +
    'formulas); imp-2642 (C_H = 1/8 ansatz classification); imp-2643 (audited effective ' +
    'coefficient ~0.127); imp-366 (C_H = 1.0 symbolic placeholder); imp-486 (no ' +
    'unconditional C_mb bound); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3324_SIGMA_CH_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: at the ansatz C_H = 1/8 the share reproduces the imp-3220 widest-gap
    // value ~0.949, proving the identical sub-term formulas are in use (not a fresh model).
    id: 'imp3324-reproduces-imp3220-widest-gap',
    description: 'sigma(1/8) at N*=10^6 reproduces the imp-3220 widest-gap value ~0.9494',
    holds: () => Math.abs(SIGMA_ANSATZ - 0.9494) < 5e-4,
  },
  {
    // The closed-form derivative (1-sigma)sigma/C_H matches the central-difference numeric
    // slope, validating the saturating-share sensitivity model.
    id: 'imp3324-analytic-derivative-matches-numeric',
    description: 'Closed-form d(sigma)/d(C_H) matches central-difference numeric to 1e-5',
    holds: () => Math.abs(D_SIGMA_D_CH_ANALYTIC - D_SIGMA_D_CH_NUMERIC) < 1e-5,
  },
  {
    // Semi-elasticity IS sigma(1-sigma) and is small (~0.048): the share is ~1/20 as
    // responsive in log terms as a linear quantity would be -- the saturation signature.
    id: 'imp3324-semi-elasticity-is-sigma-1minus-sigma',
    description: 'd(sigma)/d(log C_H) = sigma(1-sigma) ~ 0.048 (near-saturation, small response)',
    holds: () =>
      Math.abs(SEMI_ELASTICITY - SIGMA_ANSATZ * (1 - SIGMA_ANSATZ)) < 1e-12 &&
      SEMI_ELASTICITY > 0 &&
      SEMI_ELASTICITY < 0.1,
  },
  {
    // Robustness to the imp-2643 audited loosening: threading 0.127 moves the headline
    // share by < 1e-3 -- the audit barely touches the 94.9% figure.
    id: 'imp3324-audited-coefficient-barely-moves-share',
    description: 'The imp-2643 audited C_H = 0.127 moves sigma(10^6) by < 1e-3',
    holds: () => AUDITED_MOVE > 0 && AUDITED_MOVE < 1e-3,
  },
  {
    // Robustness across the full bracket: even the 8x jump to the imp-366 placeholder
    // C_H = 1.0 moves the share by < 5 pp, and the whole 16x bracket stays >= 0.90.
    id: 'imp3324-share-robust-over-full-bracket',
    description: 'Over [0.0625,1.0] (16x C_H) the share stays in [0.90,1.0); placeholder move < 0.05',
    holds: () =>
      PLACEHOLDER_MOVE > 0 &&
      PLACEHOLDER_MOVE < 0.05 &&
      SIGMA_LO > 0.9 &&
      SIGMA_PLACEHOLDER < 1 &&
      SWEEP.every((r) => r.sigma >= 0.9 && r.sigma < 1),
  },
  {
    // sigma is strictly increasing in C_H (E_coll linear up, share saturates up), so the
    // sweep is monotone -- guards against a sign error in the sensitivity direction.
    id: 'imp3324-share-monotone-increasing-in-CH',
    description: 'sigma(10^6) is strictly increasing in C_H across the sweep',
    holds: () => SWEEP.every((r, i) => i === 0 || r.sigma > SWEEP[i - 1].sigma),
  },
  {
    // Honesty gate: assessment only, robustness verdict, no QED, no refereed bound is changed, and the
    // absolute-budget-vs-share distinction is stated.
    id: 'imp3324-honesty-gate-no-qed',
    description: 'Assessment only: robustness verdict, absolute-vs-share distinction, no QED, no refereed bound is changed',
    holds: () =>
      IMP3324_SIGMA_CH_SENSITIVITY.isRigorous === false &&
      /ABSOLUTE/.test(IMP3324_SIGMA_CH_SENSITIVITY.loadBearingAssessment) &&
      /NO QED/.test(IMP3324_SIGMA_CH_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP3324_SIGMA_CH_SENSITIVITY.verdict),
  },
  {
    // imp-3392: explicit honestStatus stamp so the absolute-budget-vs-share distinction
    // is discoverable as its own field, not just inline prose in loadBearingAssessment.
    id: 'imp3392-honest-status-field-present',
    description: 'honestStatus field states C_H is load-bearing for E_coll but NOT for sigma',
    holds: () =>
      typeof IMP3324_SIGMA_CH_SENSITIVITY.honestStatus === 'string' &&
      /LOAD-BEARING/.test(IMP3324_SIGMA_CH_SENSITIVITY.honestStatus) &&
      /NOT.*load-bearing/.test(IMP3324_SIGMA_CH_SENSITIVITY.honestStatus) &&
      /must not be conflated/.test(IMP3324_SIGMA_CH_SENSITIVITY.honestStatus),
  },
];

for (const a of IMP3324_SIGMA_CH_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3324-sigma-CH-sensitivity assertion failed: ${a.id}`);
  }
}
