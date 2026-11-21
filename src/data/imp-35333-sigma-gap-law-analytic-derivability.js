/**
 * @module imp-35333-sigma-gap-law-analytic-derivability
 *
 * imp-35333 (proof/assessment, frontier-direction): imp-35036 IDENTIFIED, and imp-35183
 * RENDERED, the residual-gap law for the GUE-conditional share sigma(N) = E_coll/E(N):
 * the per-decade local decay exponent p_dec climbs toward the imp-3463 far-tail 1/2
 * asymptote, but the gap g = 1/2 - p_dec closes only as ~1/(2 ln N). imp-35036 confirmed
 * this by the deep-tail product (1/2 - p_dec) * 2 ln N holding near ~1.007-1.02 -- but that
 * is a numerical FIT to the ladder, not a derivation. This module ASSESSES whether the
 * 1/(2 ln N) envelope is analytically DERIVABLE from the imp-3463 far-tail leading form of
 * sigma, or is only an empirical fit; ENUMERATES what a derivation requires; and judges
 * whether it CLOSES or leaves a residual.
 *
 * THE FAR-TAIL LEADING FORM (imp-3463 / imp-2631 / imp-3220-3406 surrogate)
 * ------------------------------------------------------------------------
 *   In the E_trunc-dominated far tail (E_flow ~ L/T0 and the E_coll self-term in the
 *   denominator both power-law-suppressed) the share collapses to its leading form
 *       sigma_lead(N) = (C_C / E_trunc) * L^m * N^{-q},   L = log T0(N),  m = 1/2, q = 1/2,
 *   i.e. E_coll = C_C sqrt(L / N) over the constant floor E_trunc (imp-2631). T0 is the
 *   Riemann-von Mangoldt height, effectiveHeightForN(N).
 *
 * THE EXACT LOG-DERIVATIVE (the derivation)
 * -----------------------------------------
 *   p_dec is the local exponent -d ln sigma / d ln N. For the leading form,
 *       ln sigma_lead = const + m ln L - q ln N
 *       -d ln sigma_lead / d ln N = q - m * (d ln L / d ln N),   d ln L/d ln N = alpha / L,
 *   where alpha(N) = d ln T0 / d ln N is the height-map log-slope. So the gap to the
 *   q-asymptote is the CLOSED identity
 *       g(N) = q - p_dec = m * alpha(N) / L = alpha(N) / (2 ln T0(N))       (m = 1/2)
 *   verified here to hold EXACTLY (ratio 1.000000) for the leading form. Two facts the
 *   fit alone never exposed fall out:
 *     - the "1/2" coefficient of the envelope is the L-EXPONENT m (the sqrt(log T0) factor
 *       in E_coll), and is INDEPENDENT of the N-exponent q: changing q moves the asymptote
 *       but leaves the gap m*alpha/L untouched; changing m rescales the gap linearly. So the
 *       envelope prefactor is NOT the far-tail 1/2 exponent of imp-3463 -- it is the
 *       square-root-of-log-height power, a DIFFERENT input.
 *     - the clean 1/(2 ln N) is g with two substitutions applied: alpha -> 1 and ln T0 -> ln N.
 *
 * DOES IT CLOSE? -- PARTIAL: FORM CLOSES, RESIDUAL DOES NOT
 * --------------------------------------------------------
 *   Reducing the exact g = alpha/(2 ln T0) to the bare 1/(2 ln N) needs subleading data the
 *   imp-3463 far-tail LEADING exponent does not supply:
 *     (i)  alpha = d ln T0/d ln N -> 1 from below (measured 0.976 at 1e20 -> 0.998 at 1e200);
 *     (ii) ln T0 vs ln N: the RvM offset ln T0 = ln N - ln ln N + O(1) makes ln N/ln T0 > 1.
 *   Their product is the residual factor
 *       R(N) = g_exact / [1/(2 ln N)] = alpha * ln N / ln T0,
 *   which EXCEEDS 1 and closes only ~1/ln N slowly: 1.018 (1e20) -> 1.016 (1e50) -> 1.011
 *   (1e100) -> 1.007 (1e200). R is NOT a determinable numeric constant -- it is a
 *   slowly-varying height-map correction. So the envelope's COEFFICIENT (1/2, from m) and
 *   reciprocal-log FORM are analytically FORCED, not fitted; but a residual-FREE 1/(2 ln N)
 *   is NOT derivable from the far-tail leading form alone -- it leaves the subleading RvM
 *   height-map term as an uncanceled residual. The 1/(2 ln N) is the leading asymptote of an
 *   exact analytic gap g = alpha/(2 ln T0), reconciling why imp-35036 sees the product drift
 *   ABOVE 1 (R > 1) rather than sit exactly at 1.
 *
 * VERDICT: the 1/(2 ln N) residual-gap envelope is PARTIALLY derivable -- the 1/2 prefactor
 * (the L^{1/2} = sqrt(log T0) exponent, not the far-tail N-exponent) and the 1/ln form CLOSE
 * analytically; the residual factor R = alpha*ln N/ln T0 (the RvM height-map correction) does
 * NOT close and is not a constant, so it is neither a bare empirical fit nor a residual-free law.
 *
 * ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic;
 * far-tail exponent stays 1/2 (imp-3463); C_mb GUE-conditional per imp-486 UNTOUCHED; changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35036-sigma-decay-exponent-ladder-extension (identified the 1/(2 ln N) gap law by fit)
 * @see imp-35183-sigma-fartail-exponent-ladder-viz-data (rendered the fit)
 * @see imp-35130-sigma-crossing-spacing-closed-form (sibling: same log T0 running fixes the ~2-decade spacing)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, N-exponent -> 1/2 from below)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip floor (imp-2631/imp-3406/imp-35036)
const M_L_EXPONENT = 0.5; // exponent on L = log T0 in E_coll ~ sqrt(log T0 / N); sets the envelope coefficient
const Q_N_EXPONENT = 0.5; // far-tail N-exponent (imp-3463); fixes the asymptote, NOT the gap coefficient

// Pure far-tail LEADING form ln sigma_lead = const + m ln L - q ln N (E_flow and the E_coll
// self-term dropped: both power-law-suppressed in the E_trunc-dominated tail).
function lnSigmaLead(N, m = M_L_EXPONENT, q = Q_N_EXPONENT) {
  const L = Math.log(effectiveHeightForN(N));
  return Math.log(C_C_PINNED / E_TRUNC_PT) + m * Math.log(L) - q * Math.log(N);
}

// Exact pointwise local decay exponent p_dec = -d ln sigma / d ln N via central difference.
function pExact(N, m = M_L_EXPONENT, q = Q_N_EXPONENT) {
  const h = 1e-4;
  const lnN = Math.log(N);
  const hi = lnSigmaLead(Math.exp(lnN + h), m, q);
  const lo = lnSigmaLead(Math.exp(lnN - h), m, q);
  return -(hi - lo) / (2 * h);
}

// Height-map log-slope alpha = d ln T0 / d ln N (-> 1 from below).
function alpha(N) {
  const h = 1e-4;
  const lnN = Math.log(N);
  const hi = Math.log(effectiveHeightForN(Math.exp(lnN + h)));
  const lo = Math.log(effectiveHeightForN(Math.exp(lnN - h)));
  return (hi - lo) / (2 * h);
}

// The three quantities the assessment compares at a decade 10^k.
function assess(k) {
  const N = Math.pow(10, k);
  const L = Math.log(effectiveHeightForN(N));
  const lnN = Math.log(N);
  const al = alpha(N);
  const gExact = Q_N_EXPONENT - pExact(N); // exact leading-form gap to the q-asymptote
  const closedForm = M_L_EXPONENT * al / L; // the derived identity g = m*alpha/(ln T0)
  const envN = 1 / (2 * lnN); // the claimed empirical envelope 1/(2 ln N)
  const residualR = al * lnN / L; // R = alpha*lnN/lnT0 = gExact/envN
  return {
    decadeStart: `1e${k}`,
    gExact: +gExact.toExponential(5),
    closedForm_m_alpha_over_lnT0: +closedForm.toExponential(5),
    identityRatio: +(closedForm / gExact).toFixed(6), // -> 1.000000 (exact)
    envN_1_over_2lnN: +envN.toExponential(5),
    residualR: +residualR.toFixed(6), // > 1, closing ~1/ln N
    alpha: +al.toFixed(6),
    lnN_over_lnT0: +(lnN / L).toFixed(6),
  };
}

const DECADES = [20, 50, 100, 200];
const ASSESSMENT_TABLE = DECADES.map(assess);

// Coefficient-provenance probe: the gap coefficient tracks m (the L-exponent), NOT q. At a
// fixed decade, doubling m doubles the gap; changing q leaves the gap unchanged.
function gapAt(k, m, q) {
  const N = Math.pow(10, k);
  return q - pExact(N, m, q);
}
const K_PROBE = 100;
const GAP_m05_q05 = gapAt(K_PROBE, 0.5, 0.5);
const GAP_m05_q033 = gapAt(K_PROBE, 0.5, 1 / 3); // same m -> same gap, different asymptote
const GAP_m025_q05 = gapAt(K_PROBE, 0.25, 0.5); // half m -> half gap

export const IMP35333_SIGMA_GAP_LAW_ANALYTIC_DERIVABILITY = {
  id: 'imp-35333',
  proofSection: 'S-frontier',
  question:
    'Is the imp-35036/imp-35183 residual-gap law g = 1/2 - p_dec ~ 1/(2 ln N) DERIVABLE ' +
    'analytically from the imp-3463 far-tail leading form of sigma(N) = E_coll/E(N), or only ' +
    'an empirical fit? Enumerate what a derivation requires and judge whether it closes or ' +
    'leaves a residual. Assessment only; changes no bound; NO QED.',
  leadingForm: 'sigma_lead(N) = (C_C/E_trunc) * L^m * N^{-q}, L = log T0(N), m = 1/2, q = 1/2',
  derivationRequires: [
    'R1: far-tail dominance sigma -> E_coll/E_trunc, dropping E_flow (~L/T0) and the E_coll ' +
      'self-term in the denominator, both power-law-suppressed (imp-2631 constant E_trunc floor).',
    'R2: the E_coll form C_C sqrt(log T0 / N) = C_C L^{1/2} N^{-1/2}; the L^{1/2} = sqrt(log T0) ' +
      'factor is the CRITICAL input -- its exponent m = 1/2 sets the envelope coefficient.',
    'R3: subleading height-map data -- the log-slope alpha = d ln T0/d ln N (-> 1 from below) and ' +
      'the RvM log-offset ln T0 = ln N - ln ln N + O(1) (ln N/ln T0 > 1). NOT supplied by the ' +
      'imp-3463 far-tail LEADING exponent, which is about the N-exponent only.',
  ],
  closedFormIdentity: 'g(N) = 1/2 - p_dec = m * alpha(N) / ln T0(N) = alpha(N)/(2 ln T0(N))  [exact for the leading form]',
  assessmentTable: ASSESSMENT_TABLE,
  coefficientProvenance: {
    // gap coefficient is m (the L-exponent), independent of q (the N-exponent)
    gap_m05_q05: +GAP_m05_q05.toExponential(5),
    gap_m05_q033_sameAsGap_m05_q05: +GAP_m05_q033.toExponential(5), // equal: q does NOT move the gap
    gap_m025_q05_halfOfGap_m05_q05: +GAP_m025_q05.toExponential(5), // half: m rescales the gap
  },
  finding: {
    F1_exact_closed_form:
      'The leading-form gap collapses to the exact closed identity g = m*alpha/ln T0 = ' +
      'alpha/(2 ln T0) (identity ratio 1.000000 at 1e20/1e50/1e100/1e200) -- a derivation, ' +
      'not a fit.',
    F2_coefficient_is_the_L_exponent:
      'The 1/2 in the envelope is the L-exponent m (the sqrt(log T0) factor in E_coll), NOT ' +
      'the far-tail N-exponent 1/2 (imp-3463): changing q leaves the gap unchanged (gap_m05_q033 ' +
      '= gap_m05_q05), changing m rescales it linearly (gap_m025_q05 = half). A different, ' +
      'DISTINCT input from the far-tail exponent.',
    F3_residual_does_not_close:
      'Reducing g = alpha/(2 ln T0) to the bare 1/(2 ln N) needs alpha -> 1 and ln T0 -> ln N. ' +
      'Their product is the residual factor R = alpha*ln N/ln T0 = g_exact/[1/(2 ln N)], which ' +
      'EXCEEDS 1 and closes only ~1/ln N slowly (1.018 at 1e20 -> 1.007 at 1e200). R is a ' +
      'slowly-varying RvM height-map correction, NOT a determinable numeric constant, so a ' +
      'residual-free 1/(2 ln N) is NOT derivable from the far-tail leading form alone. R > 1 ' +
      'reconciles the imp-35036 product drifting ABOVE 1 rather than sitting at 1.',
  },
  isRigorous: false,
  farTailExponent: 0.5, // imp-3463; unchanged by this assessment
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). The 1/(2 ln N) residual-gap envelope is ' +
    'PARTIALLY derivable from the imp-3463 far-tail leading form, NOT a bare empirical fit: the ' +
    'leading-form gap is the EXACT closed identity g = 1/2 - p_dec = alpha(N)/(2 ln T0(N)) ' +
    '(identity ratio 1.000000). The 1/2 prefactor is the L-exponent m (the sqrt(log T0) factor ' +
    'in E_coll), independent of the N-exponent q -- a DIFFERENT input from the far-tail 1/2. But ' +
    'a residual-FREE 1/(2 ln N) does NOT close: reducing g = alpha/(2 ln T0) to it leaves the ' +
    'residual factor R = alpha*ln N/ln T0 > 1, closing only ~1/ln N slowly (1.018 at 1e20 -> ' +
    '1.007 at 1e200) -- a slowly-varying RvM height-map correction (alpha -> 1 from below; ' +
    'ln T0 = ln N - ln ln N + O(1)), not a determinable constant, and not supplied by the ' +
    'far-tail leading exponent alone. So the envelope is the leading asymptote of an exact ' +
    'analytic gap, neither a pure fit nor a residual-free law -- the residual is the height map. ' +
    'Assessment on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; ' +
    'far-tail exponent 1/2 per imp-3463; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35036 (identified 1/(2 ln N) by fit, extended here to a closed form); imp-35183 ' +
    '(rendered the fit); imp-35130 (sibling closed form for the sigma crossing spacing); ' +
    'imp-3463 (far-tail leading form, N-exponent -> 1/2); imp-2631 (E_trunc fixed-strip floor); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35333_SIGMA_GAP_LAW_ANALYTIC_DERIVABILITY_ASSERTIONS = [
  {
    // Reuse gate: the exact leading-form gap reproduces the imp-35036 magnitude (~1.1e-3 at
    // 1e200), proving the identical inherited surrogate and far-tail form are in use.
    id: 'imp35333-reproduces-imp35036-gap-magnitude',
    description: 'exact leading-form gap at 1e200 ~1.09e-3 matches the imp-35036 residual-gap scale',
    holds: () => {
      const row = ASSESSMENT_TABLE[ASSESSMENT_TABLE.length - 1];
      return row.decadeStart === '1e200' && Math.abs(row.gExact - 1.0935e-3) < 5e-5;
    },
  },
  {
    // F1: the closed identity g = m*alpha/ln T0 holds EXACTLY for the leading form at every rung.
    id: 'imp35333-closed-form-identity-exact',
    description: 'g = m*alpha/ln T0 reproduces the exact leading-form gap (ratio -> 1) at all decades',
    holds: () => ASSESSMENT_TABLE.every((r) => Math.abs(r.identityRatio - 1) < 1e-4),
  },
  {
    // F2: the gap coefficient is the L-exponent m, INDEPENDENT of the N-exponent q. Same m gives
    // the same gap for different q; halving m halves the gap.
    id: 'imp35333-coefficient-is-L-exponent-not-N-exponent',
    description: 'gap tracks m (sqrt(log T0) exponent) not q: q-change leaves gap, m-halving halves gap',
    holds: () =>
      Math.abs(GAP_m05_q033 / GAP_m05_q05 - 1) < 1e-6 &&
      Math.abs(GAP_m025_q05 / GAP_m05_q05 - 0.5) < 1e-6,
  },
  {
    // F3: the residual factor R = alpha*ln N/ln T0 exceeds 1 and closes monotonely toward 1 only
    // ~1/ln N slowly -- so 1/(2 ln N) is the leading asymptote, with an uncanceled residual.
    id: 'imp35333-residual-does-not-close',
    description: 'R = alpha*lnN/lnT0 > 1, monotone decreasing toward 1, still ~1.007 at 1e200 (no residual-free law)',
    holds: () => {
      for (let i = 0; i < ASSESSMENT_TABLE.length; i++) {
        const R = ASSESSMENT_TABLE[i].residualR;
        if (!(R > 1.0 && R < 1.03)) return false;
        if (i > 0 && !(R < ASSESSMENT_TABLE[i - 1].residualR)) return false;
      }
      const last = ASSESSMENT_TABLE[ASSESSMENT_TABLE.length - 1].residualR;
      return Math.abs(last - 1.0072) < 5e-4;
    },
  },
  {
    // Honesty gate: assessment only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35333-honesty-gate-no-qed',
    description: 'Assessment only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP35333_SIGMA_GAP_LAW_ANALYTIC_DERIVABILITY.isRigorous === false &&
      IMP35333_SIGMA_GAP_LAW_ANALYTIC_DERIVABILITY.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35333_SIGMA_GAP_LAW_ANALYTIC_DERIVABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP35333_SIGMA_GAP_LAW_ANALYTIC_DERIVABILITY.verdict),
  },
];

for (const a of IMP35333_SIGMA_GAP_LAW_ANALYTIC_DERIVABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35333-sigma-gap-law-analytic-derivability assertion failed: ${a.id}`);
  }
}
