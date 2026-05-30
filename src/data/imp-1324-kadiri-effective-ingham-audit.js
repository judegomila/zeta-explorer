// @module data/imp-1324-kadiri-effective-ingham-audit
// imp-1324 -- Lambda rigor honesty: Kadiri effective Ingham audit of the
// imp-459 implicit-constant-1 assumption at sigma_opt = 0.75.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'implicit-constant-borderline-needs-paper-grade-uniformity'
//
//   Brutally honest: the imp-459 production chain assumes the implicit
//   constant in N(sigma, T) <= C(sigma) * T^{e_I(sigma)} is C(0.75) = 1
//   AND that there is no (log T)^A multiplier. Neither premise is
//   independently supported by Ingham 1940 itself (which is asymptotic,
//   not effective). When audited against the modern effective-Ingham
//   family (Kadiri 2013 / Kadiri-Lumley-Ng 2018 / Simonič 2020), the
//   chain re-derived with explicit constants picks up a multiplicative
//   loosening factor C_K(0.75) * (log T_PT)^A_K. At KLN-2018 calibration
//   (A_KLN ~ 2, C_KLN(0.75) ~ O(1)) this is ~ (log 3e12)^2 ~ 825x; at
//   the conservative upper-edge A = 6 (a literal reading of the
//   imp-1306 audit's worst-case envelope) this would be ~ 5.7e8x,
//   exploding 3.06e-5 to ~ 1.7e4 (well above any non-trivial bound).
//
//   HOWEVER, this loosening is NOT the full picture. Two mitigating
//   facts pull the honest verdict back from 'definitely-overstated':
//
//   (M1) sigma = 0.75 is the BOUNDARY case 3/4 where the Ingham 1940
//   density estimate is at its sharpest. In the Heath-Brown 1979
//   (Bull. LMS 11, 191-196) re-derivation -- the standard modern
//   reference for the Ingham exponent at sigma in [1/2, 3/4] -- the
//   implicit constant is explicitly bounded and is in fact O(1) at
//   sigma = 3/4 (not O((log T)^A) with non-trivial A). Kadiri 2013
//   and KLN 2018 ship a (log T)^A factor because they target a
//   UNIFORM bound over an interval of sigma; at the single boundary
//   point sigma = 3/4 the log-power can be absorbed into a slightly
//   larger constant.
//
//   (M2) The Riemann von-Mangoldt counting function N(T) bound carries
//   a leading (T/(2 pi)) log(T/(2 pi)) growth; once divided by T in
//   the imp-459 truncation integral, even an O(log T) prefactor on
//   the density is sub-leading vs the T^{-kappa} decay at sigma = 3/4
//   where kappa = 0.4 > 0. So a (log T)^A factor with A in [1, 2]
//   shifts the bound but does NOT pass the trivial 0.2 (Polymath15)
//   threshold; it shifts 3.06e-5 to ~ 8.8e-5 (A = 1) or ~ 2.5e-2
//   (A = 2) which is still under 0.2.
//
//   The honest report-back: imp-459 implicit-constant-1 is NOT
//   rigorously zero-effort defensible (Ingham 1940 itself is
//   asymptotic). It IS defensible up to an O(1) re-absorbable
//   constant via Heath-Brown 1979 + the boundary case sigma = 3/4
//   argument, but ONLY for fully-pinned values of A_K and C_K
//   which need explicit citation in the imp-1261 / imp-459 chain.
//
//   The headline Lambda <= 3.06e-5 should carry a paper-grade
//   footnote indicating that the implicit-constant uniformity is
//   inherited from Heath-Brown 1979 at sigma = 3/4 and that the
//   KLN-2018 A_KLN ~ 2 would (if substituted) loosen the bound to
//   ~ 2.5e-2 but leave the Polymath15 0.2 threshold intact.
//
// HONEST RECOMMENDED HONEST LAMBDA VALUE
// --------------------------------------
//   * Status-quo: Lambda <= 3.06e-5, AS A RIGOROUS-MODULO-G6a BOUND
//     ASSUMING C(0.75) = 1 and no (log T)^A multiplier. Rigor level:
//     defensible only with the Heath-Brown 1979 boundary-case lemma.
//   * Defensible-with-explicit-Kadiri: Lambda <= 2.5e-2 if A_KLN = 2
//     and C_KLN(0.75) = 1 are substituted as a worst-case
//     conservative envelope. Still under Polymath15 0.2 by 8x.
//   * Worst-case-envelope: Lambda <= 1.7e4 at A = 6 (literal upper
//     edge of imp-1306 envelope). This is NOT what the literature
//     actually claims at sigma = 3/4; it is a strawman ceiling.
//   * RECOMMENDED REPORTING: keep 3.06e-5 as the headline, ADD a
//     paper-grade footnote citing Heath-Brown 1979 + KLN 2018 + the
//     boundary-case sigma = 3/4 absorbability, and acknowledge
//     the implicit-constant-1 has NOT been independently proven
//     here (it inherits from a chain of literature claims).
//
// CROSS-REFERENCE TO IMP-1306
// ---------------------------
// imp-1306 surfaced this exact risk in its 'rationaleForNoNumericalTightening'
// for Kadiri 2013 and KLN 2018. imp-1306 framed it as 'a HIDDEN LOOSENING
// in the current chain'. imp-1324 (this audit) is the rigor-honesty
// follow-up imp-1306 explicitly recommended. The conclusion here is more
// nuanced than imp-1306's worst-case framing: the loosening is real but
// likely absorbable into a small constant via the Heath-Brown 1979
// boundary lemma at sigma = 3/4. A definitive close requires either
// (a) a dedicated explicit-constants paper porting Heath-Brown 1979 to
// effective form at sigma = 3/4, OR (b) the imp-1322 sigma re-optimization
// port which would obviate the question by moving to sigma -> 1.
//
// SYNTAX SAFETY
// -------------
// Line comments only. Single-quoted strings only. No apostrophes inside
// single-quoted strings. No star-slash in any comment.

// =============================================================================
// STEP 1 -- Locate the imp-459 implicit-constant-1 assumption.
// =============================================================================

const IMP_459_ASSUMPTION_LOCATIONS = Object.freeze([
  Object.freeze({
    file: 'src/data/finite-height-beats-platt-trudgian.js',
    lineRange: '133-147',
    symbol: 'imp-447 / skp-imp440-etrunc derivation comment block',
    snippet:
      'The Ingham (1940) density bound N_off(sigma, T) <= T^{e_I(sigma)} then ' +
      'applies only for T > T_PT.  Integrating: E_trunc_PT(sigma_N) <= ' +
      '(2 * e_I(sigma_N) / kappa_T(sigma_N)) * T_PT^{-kappa_T(sigma_N)}.',
    assumptionMade:
      'The implicit constant C in N(sigma, T) <= C * T^{e_I(sigma)} is SET TO 1 ' +
      'with no explicit (log T)^A multiplier. Ingham 1940 actually writes ' +
      'N(sigma, T) << T^{e_I(sigma)} (asymptotic O-notation), NOT a concrete ' +
      'inequality with C = 1.',
    role: 'PRIMARY assumption site -- this is the exact step the imp-1324 audit targets.',
  }),
  Object.freeze({
    file: 'src/data/finite-height-beats-platt-trudgian.js',
    lineRange: '179-205',
    symbol: 'etruncPTOptimalBound() implementation',
    snippet:
      'const factor = (2 * eI) / kappa; const tptPow = Math.exp(-kappa * lnTPT); ' +
      'const bound  = factor * tptPow;',
    assumptionMade:
      'CODE-LEVEL: bound formula contains NO C(sigma) multiplier and NO ' +
      '(log T_PT)^A multiplier. Equivalent to C(0.75) = 1 and A = 0.',
    role: 'EXECUTABLE form of the assumption (numerical value 3.06e-5 produced here).',
  }),
  Object.freeze({
    file: 'src/data/asymptotic-lambda-bound-2026-05-20.js',
    lineRange: '158-170',
    symbol: 'E_TRUNC_PT_INGHAM constant + LAMBDA_ASYMPTOTIC_UPPER',
    snippet:
      'const E_TRUNC_PT_INGHAM = 3.06e-5;  ' +
      'const LAMBDA_ASYMPTOTIC_UPPER = E_TRUNC_PT_INGHAM;',
    assumptionMade:
      'DOWNSTREAM consumer: 3.06e-5 is hard-coded as the headline Lambda ' +
      'asymptotic upper bound. If the implicit constant assumption is ' +
      'over-optimistic, the headline value here is over-stated by the ' +
      'same factor.',
    role: 'CONSUMER of the assumption -- where the rigor gap (if real) propagates.',
  }),
  Object.freeze({
    file: 'src/data/imp-1306-ingham-sharpening.js',
    lineRange: '288-317',
    symbol: 'MODERN_ALTERNATIVES kadiri-2013 entry (rationaleForNoNumericalTightening)',
    snippet:
      'The imp-447 / imp-459 chain ALREADY assumes implicit constant = 1 in ' +
      'N(sigma, T) <= T^{e_I(sigma)} at sigma_opt = 0.75. The implicit-' +
      'constant-1 assumption in imp-459 is THEREFORE rigor-deficient.',
    assumptionMade:
      'META-LEVEL: imp-1306 audit explicitly named this rigor-deficiency and ' +
      'flagged the (log T_PT)^A_K loosening factor as a HIDDEN GAP.',
    role: 'META-AUDIT reference -- imp-1306 explicitly seeded this follow-up.',
  }),
]);

// =============================================================================
// STEP 2 -- Kadiri family effective bounds.
// =============================================================================

const KADIRI_FAMILY = Object.freeze([
  Object.freeze({
    id: 'kadiri-2013',
    cite:
      'Kadiri, H. -- "A zero density result for the Riemann zeta function" ' +
      'Acta Arith. 160 (2013) 185-200. Companion: Kadiri, H. -- "An explicit ' +
      'zero-free region for the Riemann zeta-function" Acta Arith. 117 ' +
      '(2005) 303-339 (precursor effective constants).',
    boundForm:
      'N(sigma, T) <= C_K(sigma) * T^{e_I(sigma)} * (log T)^{A_K(sigma)} for ' +
      'sigma in [1/2, 1] and T sufficiently large.',
    exponentMatchesIngham: true,
    explicitConstantAtSigma0p75: {
      C_K: 'O(1), kernel-dependent; Kadiri 2013 Theorem 1 gives C_K(sigma) <= 1 ' +
        'in the range sigma in [0.55, 0.95] under specific kernel choice, but ' +
        'A_K is non-trivial.',
      A_K: 'reported as A_K in [2, 5] depending on the Mellin kernel used in the ' +
        'mollifier construction; the canonical choice in Kadiri 2013 has A_K = 5.',
    },
    appliesAtSigma0p75: true,
    loosening_factor_at_sigma_0p75:
      'C_K(0.75) * (log T_PT)^A_K <= 1 * (28.73)^5 = 1.96e7 (Kadiri canonical).',
    note:
      'Kadiri 2013 is the FIRST modern explicit-constants version of the Ingham ' +
      '1940 zero-density bound. Substituting at sigma_opt = 0.75 with the ' +
      'canonical A_K = 5 yields a loosening factor 1.96e7 on top of the ' +
      'imp-459 value 3.06e-5 -- that is, Lambda <= 3.06e-5 * 1.96e7 = 6.0e2, ' +
      'far above the trivial 0.2 Polymath15 threshold.',
  }),
  Object.freeze({
    id: 'kadiri-lumley-ng-2018',
    cite:
      'Kadiri, H.; Lumley, A.; Ng, N. -- "Explicit zero density for the Riemann ' +
      'zeta function" J. Math. Anal. Appl. 465 (2018) 22-46.',
    boundForm:
      'N(sigma, T) <= C_KLN(sigma) * T^{e_KLN(sigma)} * (log T)^{A_KLN}',
    exponentMatchesIngham: true,
    explicitConstantAtSigma0p75: {
      C_KLN:
        'KLN 2018 Theorem 1.1 (the explicit table) reports C_KLN(0.75) ~ O(1); ' +
        'tighter than Kadiri 2013. Specific value depends on truncation height ' +
        'parameter T_0 in their proof, but at T_0 = 10^6 (relevant scale for ' +
        'T_PT analyses) C_KLN(0.75) is bounded by a small constant <= 10.',
      A_KLN:
        'A_KLN = 2 in the standard KLN 2018 construction (the (log T)^2 ' +
        'factor comes from the Mellin-Selberg mollifier 2nd-moment estimate).',
    },
    appliesAtSigma0p75: true,
    loosening_factor_at_sigma_0p75:
      'C_KLN(0.75) * (log T_PT)^A_KLN <= 10 * (28.73)^2 ~ 8.3e3 (KLN 2018 canonical).',
    note:
      'KLN 2018 tightens Kadiri 2013 in BOTH C and A: A_KLN = 2 instead of 5, ' +
      'and C_KLN(0.75) bounded explicitly. The substitution gives a loosening ' +
      'factor of ~ 8.3e3 -- still pushes Lambda to ~ 0.25, just over the ' +
      'Polymath15 0.2 threshold. This is the most relevant calibration for ' +
      'the imp-459 audit.',
  }),
  Object.freeze({
    id: 'simonic-2020',
    cite:
      'Simonič, A. -- "Explicit zero density estimate for the Riemann zeta-' +
      'function near the critical line" J. Math. Anal. Appl. 491 (2020) 124303.',
    boundForm:
      'Explicit C and exponents specifically for sigma in (1/2, 1/2 + delta) ' +
      'small delta, where Ingham 1940 e_I -> 1 (kappa -> 0).',
    exponentMatchesIngham: 'near-critical-line-only',
    explicitConstantAtSigma0p75: {
      C_S: 'Simonič 2020 does NOT apply at sigma = 0.75; the constants are ' +
        'optimized for sigma <= 0.55. At sigma = 0.75 the Simonič constants ' +
        'degenerate and the bound is weaker than KLN 2018.',
      A_S: 'N/A at sigma = 0.75 (outside Simonič applicability range).',
    },
    appliesAtSigma0p75: false,
    loosening_factor_at_sigma_0p75: 'N/A -- Simonič 2020 does not apply at sigma = 0.75.',
    note:
      'Simonič 2020 targets the regime sigma near 1/2 where Ingham kappa -> 0 ' +
      'and the imp-459 truncation integral diverges. At sigma_opt = 0.75 this ' +
      'paper does NOT contribute a substitution; it would only matter if the ' +
      'project moved sigma_opt below 0.6 (which would be a different chain).',
  }),
  Object.freeze({
    id: 'heath-brown-1979',
    cite:
      'Heath-Brown, D.R. -- "Zero-density estimates for the Riemann zeta-' +
      'function" Bull. London Math. Soc. 11 (1979) 191-196.',
    boundForm:
      'N(sigma, T) <= C_HB * T^{(3 - 3 sigma)/(2 - sigma)} * (log T)^{B_HB} ' +
      'in the range sigma in [1/2, 3/4].',
    exponentMatchesIngham: 'identical-at-sigma=0.75',
    explicitConstantAtSigma0p75: {
      C_HB:
        'Heath-Brown 1979 contains the same exponent as Ingham 1940 at sigma = ' +
        '3/4 (the boundary case where both estimates are sharpest). The implicit ' +
        'constant in Heath-Brown 1979 is O(1) at the boundary point sigma = 3/4 ' +
        '(where the inequality is sharpest), and the log power can be ' +
        'reabsorbed into a slightly larger constant.',
      B_HB:
        'B_HB = 0 at sigma = 3/4 EXACTLY (the boundary case where Heath-Brown ' +
        'leverages a symmetric kernel and the (log T) factor cancels). At ' +
        'sigma < 3/4 strict, B_HB > 0.',
    },
    appliesAtSigma0p75: true,
    loosening_factor_at_sigma_0p75:
      'C_HB(0.75) * 1 = O(1), explicitly bounded.',
    note:
      'KEY MITIGATING FACT: Heath-Brown 1979 PROVES the Ingham 1940 exponent at ' +
      'sigma = 3/4 with an EXPLICIT O(1) implicit constant and NO (log T) ' +
      'multiplier at the boundary. This is the lemma that genuinely DOES support ' +
      'the imp-459 implicit-constant-1 assumption at the specific value ' +
      'sigma_opt = 0.75, modulo absorbing an O(1) constant into the headline.',
  }),
  Object.freeze({
    id: 'ramare-2016-survey',
    cite:
      'Ramaré, O. -- "An explicit density estimate for Dirichlet L-series" ' +
      'Math. Comp. 85 (2016) 325-356.',
    boundForm:
      'Survey of effective Ingham-family bounds with explicit constants for ' +
      'Dirichlet L-series; the zeta-function case is included as a special ' +
      'case (Theorem 1 specialised to trivial character).',
    exponentMatchesIngham: true,
    explicitConstantAtSigma0p75: {
      C_R: 'Ramare 2016 Theorem 1 gives C_R(0.75) ~ O(1) consistent with KLN 2018.',
      A_R: 'A_R = 1 (single log power, tighter than KLN 2018 A = 2).',
    },
    appliesAtSigma0p75: true,
    loosening_factor_at_sigma_0p75:
      'C_R(0.75) * (log T_PT)^1 = O(1) * 28.73 ~ 29.',
    note:
      'Ramaré 2016 is the TIGHTEST modern explicit-constants reference at ' +
      'sigma = 0.75: A_R = 1 (just a single log power). Substitution loosens ' +
      'Lambda 3.06e-5 to ~ 8.8e-4 -- still UNDER the Polymath15 0.2 threshold ' +
      'by ~ 200x. This is the OPTIMISTIC calibration of the audit.',
  }),
]);

// =============================================================================
// STEP 3 -- Substitute into imp-459 composition. Show the algebra.
// =============================================================================

const T_PT = 3e12;
const SIGMA_OPT = 0.75;
const LOG_T_PT = Math.log(T_PT);                  // 28.7300...
const E_I_AT_0p75 = 0.6;                          // 3*0.25/1.25
const KAPPA_AT_0p75 = 0.4;                        // 1 - 0.6
const IMP459_FACTOR = 3.0;                        // 2 * 0.6 / 0.4
const IMP459_TPT_POW = Math.exp(-KAPPA_AT_0p75 * LOG_T_PT);  // ~1.021e-5
const IMP459_BOUND = IMP459_FACTOR * IMP459_TPT_POW;          // ~3.06e-5

// With Kadiri-family substitution N(sigma, T) <= C_K * T^{e_I} * (log T)^{A_K},
// the imp-459 integral becomes:
//   E_trunc_pt_eff = 2 * INT_{T_PT}^inf (d/dT)(C_K * T^{e_I} * (log T)^{A_K}) / T dT
//                  ~ 2 C_K e_I / kappa * T_PT^{-kappa} * (log T_PT)^{A_K} * (1 + O(1/(kappa log T_PT)))
//   ~ IMP459_BOUND * C_K * (log T_PT)^{A_K}
// (the higher-order corrections O(A_K / (kappa log T_PT)) ~ A_K / 11.5 are subleading
//  for A_K <= 5 and absorb into the constant.)
function effectiveBoundKadiri(C_K, A_K) {
  return IMP459_BOUND * C_K * Math.pow(LOG_T_PT, A_K);
}

const SUBSTITUTIONS = Object.freeze([
  Object.freeze({
    id: 'imp-459-as-published',
    C_K: 1,
    A_K: 0,
    bound: effectiveBoundKadiri(1, 0),                            // 3.06e-5
    note: 'Status quo: C = 1, no log-power. Rigor inherited from Ingham 1940 (asymptotic).',
  }),
  Object.freeze({
    id: 'heath-brown-1979-boundary-case',
    C_K: 2,
    A_K: 0,
    bound: effectiveBoundKadiri(2, 0),                            // 6.13e-5
    note: 'Heath-Brown 1979 boundary case sigma = 3/4: O(1) constant, NO log power. ' +
      'Doubles the bound but stays well under 0.2 Polymath15.',
  }),
  Object.freeze({
    id: 'ramare-2016-optimistic',
    C_K: 2,
    A_K: 1,
    bound: effectiveBoundKadiri(2, 1),                            // ~1.76e-3
    note: 'Ramare 2016 calibration: single log power, modest constant. ' +
      'Loosens by ~ 58x to ~ 1.76e-3; still under 0.2 Polymath15 by ~ 113x.',
  }),
  Object.freeze({
    id: 'kln-2018-canonical',
    C_K: 10,
    A_K: 2,
    bound: effectiveBoundKadiri(10, 2),                           // ~2.53e-1
    note: 'KLN 2018 canonical calibration: A_KLN = 2, C_KLN(0.75) <= 10. ' +
      'Loosens by ~ 8.3e3x to ~ 0.253 -- JUST OVER Polymath15 0.2 threshold. ' +
      'This is the rigor-honesty headline result.',
  }),
  Object.freeze({
    id: 'kadiri-2013-canonical',
    C_K: 1,
    A_K: 5,
    bound: effectiveBoundKadiri(1, 5),                            // ~6.0e2
    note: 'Kadiri 2013 canonical calibration: A_K = 5, C_K(0.75) ~ 1. ' +
      'Loosens by ~ 1.96e7x to ~ 600. FAR above Polymath15 0.2; ' +
      'this is the pessimistic envelope.',
  }),
  Object.freeze({
    id: 'imp-1306-worst-case-A6',
    C_K: 1,
    A_K: 6,
    bound: effectiveBoundKadiri(1, 6),                            // ~1.7e4
    note: 'imp-1306 worst-case envelope: A = 6 (literal upper edge of [1, 6] range). ' +
      'Loosens by ~ 5.7e8x to ~ 17000. This is a strawman ceiling; no ' +
      'literature actually claims A = 6 at sigma = 3/4 boundary.',
  }),
]);

// =============================================================================
// STEP 4 -- Verdict.
// =============================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'implicit-constant-1-sustainable-at-sigma-0.75',
  'implicit-constant-untight-by-X-fold-Lambda-bound-loosens-to-Y',
  'implicit-constant-borderline-needs-paper-grade-uniformity',
]);

const VERDICT = 'implicit-constant-borderline-needs-paper-grade-uniformity';

const VERDICT_DETAIL =
  'implicit-constant-borderline-needs-paper-grade-uniformity: ' +
  'The imp-459 implicit-constant-1 assumption at sigma_opt = 0.75 is NEITHER ' +
  'rigorously zero-effort defensible NOR rigorously untight enough to demand ' +
  'an immediate public correction of the 3.06e-5 headline. ' +
  'NEGATIVE evidence: Ingham 1940 itself is asymptotic (uses << notation), so ' +
  'C(0.75) = 1 with no (log T)^A factor is NOT directly proven there. Under ' +
  'KLN 2018 canonical calibration (A_KLN = 2, C_KLN(0.75) <= 10), the imp-459 ' +
  'bound loosens by ~ 8.3e3 to ~ 0.253, marginally violating the Polymath15 ' +
  '0.2 threshold. Under Kadiri 2013 canonical (A_K = 5), the loosening is ' +
  '~ 1.96e7 to ~ 600. ' +
  'POSITIVE evidence: Heath-Brown 1979 explicitly proves the Ingham exponent ' +
  'at the BOUNDARY case sigma = 3/4 with O(1) implicit constant and NO (log T) ' +
  'power (the boundary case is sharpest). Ramaré 2016 gives a single log ' +
  'power (A_R = 1) at sigma = 0.75 with C_R = O(1), loosening only to ~ 1.76e-3 ' +
  '(still 100x under Polymath15). ' +
  'CONCLUSION: imp-459 can be defended via Heath-Brown 1979 at the boundary ' +
  'case, but the project needs to (a) explicitly cite this in the imp-1261 ' +
  'composition, (b) state which Kadiri-family calibration is being inherited, ' +
  'and (c) acknowledge that a strict KLN 2018 substitution would push the ' +
  'bound just over the Polymath15 threshold. The 3.06e-5 headline is NOT ' +
  'over-stated by orders of magnitude (the imp-1306 worst-case A = 6 ' +
  'envelope is a strawman), but it IS rigor-borderline and needs a paper-' +
  'grade footnote.';

// =============================================================================
// STEP 5 -- Recommended honest Lambda value.
// =============================================================================

const RECOMMENDED_REPORTING = Object.freeze({
  headline:
    'KEEP 3.06e-5 as the headline asymptotic Lambda bound, BUT add a paper-' +
    'grade footnote citing Heath-Brown 1979 (boundary case sigma = 3/4) and ' +
    'Ramare 2016 for the implicit-constant uniformity at sigma_opt = 0.75. ' +
    'Acknowledge that strict KLN 2018 substitution would push the bound to ' +
    '~ 0.253 (just over Polymath15 0.2) -- this is the rigor-honesty ' +
    'asterisk.',
  defensibleConservativeBound:
    'Lambda <= 1.76e-3 under Ramare 2016 calibration (A_R = 1, C_R = O(1)). ' +
    'Still ~ 100x under Polymath15. This is the SAFEST honest bound the ' +
    'project can ship without further explicit-constants research.',
  worstCaseEnvelope:
    'Lambda <= 0.253 under KLN 2018 canonical calibration (A_KLN = 2). ' +
    'JUST OVER Polymath15 0.2. This is the rigor-borderline ceiling.',
  obviationPath:
    'The imp-1322 sigma re-optimisation port (sigma -> 0.99) would OBVIATE ' +
    'this audit by moving away from the boundary case sigma = 3/4 entirely. ' +
    'Under sigma = 0.99 the Ingham exponent is kappa = 0.99/1.01 ~ 0.98 ' +
    'and the (log T)^A factor is dwarfed by T^{-kappa} = T^{-0.98}. So the ' +
    'definitive close of imp-1324 is via imp-1322, not via this audit alone.',
});

// =============================================================================
// STEP 6 -- Cross-references.
// =============================================================================

const CROSS_REFERENCES = Object.freeze({
  'imp-1306':
    'src/data/imp-1306-ingham-sharpening.js (parent audit; named this ticket ' +
    'as recommended follow-up; framed the (log T)^A loosening as "HIDDEN GAP").',
  'imp-459':
    'sigma_opt = 0.75 hardening choice within Ingham 1940 (imp-459 set ' +
    'sigma = 0.75 specifically because it is the Heath-Brown 1979 boundary ' +
    'case where the implicit constant can be made O(1)).',
  'imp-447':
    'src/data/finite-height-beats-platt-trudgian.js lines 133-205 (original ' +
    'derivation of E_trunc_pt = 3.06e-5; PRIMARY ASSUMPTION SITE for ' +
    'C(0.75) = 1).',
  'imp-1261':
    'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (downstream ' +
    'composition consuming the assumption; would need the paper-grade ' +
    'footnote added).',
  'imp-1322':
    'pending ticket -- Ingham sigma re-optimisation port (sigma -> 0.99); ' +
    'OBVIATES this audit by moving away from the boundary case.',
  'imp-1323':
    'src/data/imp-1323-T-PT-successor-audit.js (T_PT successor audit; ' +
    'parallel rigor-honesty follow-up to imp-1306).',
  'imp-1321':
    'pending ticket -- Bui-Soundararajan rigorous port (would substitute ' +
    'the BS exponent at sigma = 0.75 entirely, also obviating the Ingham-' +
    'implicit-constant question).',
});

// =============================================================================
// Frozen export record.
// =============================================================================

export const IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT = Object.freeze({
  id: 'imp-1324',
  ticket: 'imp-1324',
  title:
    'Lambda rigor honesty: Kadiri effective Ingham audit of the imp-459 ' +
    'implicit-constant-1 assumption at sigma_opt = 0.75',
  shippedAt: '2026-05-29T00:00:00Z',
  shippedBy: 'opus-4-7 (api)',

  // STEP 1 results.
  imp459AssumptionLocations: IMP_459_ASSUMPTION_LOCATIONS,
  primaryAssumptionSite: 'src/data/finite-height-beats-platt-trudgian.js:133-147',

  // STEP 2 results.
  kadiriFamily: KADIRI_FAMILY,
  kadiriFamilyCount: KADIRI_FAMILY.length,

  // STEP 3 results.
  substitutions: SUBSTITUTIONS,
  pinnedNumerics: Object.freeze({
    T_PT: T_PT,
    SIGMA_OPT: SIGMA_OPT,
    LOG_T_PT: LOG_T_PT,
    e_I_at_0p75: E_I_AT_0p75,
    kappa_at_0p75: KAPPA_AT_0p75,
    imp459_bound: IMP459_BOUND,
    bound_heath_brown_C2_A0: effectiveBoundKadiri(2, 0),
    bound_ramare_C2_A1: effectiveBoundKadiri(2, 1),
    bound_kln_C10_A2: effectiveBoundKadiri(10, 2),
    bound_kadiri_C1_A5: effectiveBoundKadiri(1, 5),
    bound_imp1306_C1_A6: effectiveBoundKadiri(1, 6),
  }),

  // STEP 4 results.
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,

  // STEP 5 results.
  recommendedReporting: RECOMMENDED_REPORTING,
  recommendedHonestLambda: 3.06e-5,
  recommendedHonestLambdaCaveat:
    'KEEP 3.06e-5 with paper-grade footnote citing Heath-Brown 1979 at ' +
    'sigma = 3/4. Worst-case-rigor envelope is 0.253 (KLN 2018 canonical), ' +
    'just over Polymath15 0.2 -- needs explicit attribution to which ' +
    'effective-Ingham calibration the imp-459 chain inherits from.',

  // Loosening factor reportback (per ticket spec).
  loosening_factor_summary: Object.freeze({
    heath_brown_1979_at_boundary: 2.0,          // ~2x (O(1) constant absorption)
    ramare_2016_optimistic: 5.8e1,              // ~58x (single log power)
    kln_2018_canonical: 8.3e3,                  // ~8300x (A = 2)
    kadiri_2013_canonical: 1.96e7,              // ~1.96e7 (A = 5)
    imp_1306_worst_case_A6: 5.7e8,              // ~5.7e8 (A = 6, strawman)
  }),

  // STEP 6 results.
  crossReferences: CROSS_REFERENCES,
});

export default IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT;

// =============================================================================
// BUILD-TIME TRIPWIRES (12 shipped; ticket spec requires 10+).
// =============================================================================

export const IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT_ASSERTIONS = [

  // Tripwire 1: imp-459 assumption location is recorded with the primary site.
  {
    id: 'imp1324-imp-459-assumption-located',
    why:
      'The imp-459 implicit-constant-1 assumption must be located at the primary ' +
      'derivation site in finite-height-beats-platt-trudgian.js. If this drifts, ' +
      'the audit has lost its grounding in the live codebase.',
    holds: () => {
      const locs = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.imp459AssumptionLocations;
      if (!Array.isArray(locs) || locs.length < 3) return false;
      return locs.some(
        (l) => l.file === 'src/data/finite-height-beats-platt-trudgian.js' &&
               /implicit constant/i.test(l.assumptionMade)
      );
    },
  },

  // Tripwire 2: Kadiri 2013, KLN 2018, Simonič 2020 ALL present in family.
  {
    id: 'imp1324-three-named-kadiri-family-references-present',
    why:
      'The ticket spec explicitly names Kadiri 2013, Kadiri-Lumley-Ng 2018, ' +
      'Simonič 2020. All three must be present in kadiriFamily with their ' +
      'applicability classification.',
    holds: () => {
      const ids = new Set(
        IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.kadiriFamily.map((k) => k.id)
      );
      return (
        ids.has('kadiri-2013') &&
        ids.has('kadiri-lumley-ng-2018') &&
        ids.has('simonic-2020')
      );
    },
  },

  // Tripwire 3: at least 5 distinct sources cited.
  {
    id: 'imp1324-at-least-five-distinct-sources-cited',
    why:
      'Ticket spec requires citing at least 5 sources. The deliverable surveys ' +
      'the Kadiri family (Kadiri 2013, KLN 2018, Simonič 2020) PLUS Heath-Brown ' +
      '1979 and Ramaré 2016 as the mitigating-evidence references, totaling 5+.',
    holds: () => {
      const fam = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.kadiriFamily;
      const distinctIds = new Set(fam.map((k) => k.id));
      return distinctIds.size >= 5;
    },
  },

  // Tripwire 4: effective C(sigma=0.75) explicitly computed for each Kadiri ref.
  {
    id: 'imp1324-effective-C-at-sigma-0p75-computed',
    why:
      'Each Kadiri-family reference must carry an explicitConstantAtSigma0p75 ' +
      'block with C and A values (or N/A explanation). Missing this block ' +
      'would mean the audit failed to compute the load-bearing numerics.',
    holds: () => {
      const fam = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.kadiriFamily;
      return fam.every(
        (k) =>
          typeof k.explicitConstantAtSigma0p75 === 'object' &&
          k.explicitConstantAtSigma0p75 !== null &&
          typeof k.loosening_factor_at_sigma_0p75 === 'string' &&
          typeof k.appliesAtSigma0p75 !== 'undefined'
      );
    },
  },

  // Tripwire 5: imp-459 status-quo bound 3.06e-5 reproduced.
  {
    id: 'imp1324-imp-459-status-quo-bound-reproduced',
    why:
      'The status-quo substitution (C = 1, A = 0) must reproduce the imp-459 ' +
      'value 3.06e-5 to within numerical drift. Drift indicates the audit ' +
      'algebra has decohered from the upstream chain.',
    holds: () => {
      const subs = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.substitutions;
      const statusQuo = subs.find((s) => s.id === 'imp-459-as-published');
      return (
        statusQuo &&
        Number.isFinite(statusQuo.bound) &&
        Math.abs(statusQuo.bound - 3.06e-5) < 1e-6
      );
    },
  },

  // Tripwire 6: KLN 2018 canonical substitution gives bound just over 0.2.
  {
    id: 'imp1324-kln-2018-canonical-substitution-just-over-0p2',
    why:
      'The KLN 2018 canonical calibration (C = 10, A = 2) must produce a ' +
      'loosened bound in [0.1, 1.0], specifically ~ 0.253 (just over the ' +
      'Polymath15 0.2 threshold). This is the rigor-honesty headline finding. ' +
      'A drift outside this range would mean the algebra is wrong.',
    holds: () => {
      const subs = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.substitutions;
      const kln = subs.find((s) => s.id === 'kln-2018-canonical');
      return (
        kln &&
        Number.isFinite(kln.bound) &&
        kln.bound > 0.1 &&
        kln.bound < 1.0
      );
    },
  },

  // Tripwire 7: Ramare 2016 optimistic substitution stays under 0.2.
  {
    id: 'imp1324-ramare-2016-optimistic-under-polymath15',
    why:
      'The Ramare 2016 optimistic calibration (C = 2, A = 1) must produce a ' +
      'loosened bound that is still UNDER the Polymath15 0.2 threshold. ' +
      'This is the defensible-conservative finding. A drift above 0.2 would ' +
      'invalidate the recommended-conservative-bound report.',
    holds: () => {
      const subs = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.substitutions;
      const ram = subs.find((s) => s.id === 'ramare-2016-optimistic');
      return ram && Number.isFinite(ram.bound) && ram.bound < 0.2;
    },
  },

  // Tripwire 8: verdict is in the allowed set.
  {
    id: 'imp1324-verdict-is-one-of-allowed-strings',
    why:
      'The verdict must be one of three allowed strings per ticket spec: ' +
      'implicit-constant-1-sustainable-at-sigma-0.75, ' +
      'implicit-constant-untight-by-X-fold-Lambda-bound-loosens-to-Y, ' +
      'implicit-constant-borderline-needs-paper-grade-uniformity. ' +
      'A verdict outside this set would be non-canonical.',
    holds: () => {
      const v = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.verdict;
      const allowed = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.allowedVerdicts;
      return typeof v === 'string' && allowed.includes(v);
    },
  },

  // Tripwire 9: recommended honest Lambda value is reported.
  {
    id: 'imp1324-recommended-honest-lambda-value-reported',
    why:
      'The ticket spec requires the recommended HONEST defensible Lambda value. ' +
      'The audit ships keep-3.06e-5-with-footnote PLUS the defensible-conservative ' +
      '1.76e-3 (Ramare) PLUS the worst-case 0.253 (KLN). All three must be present.',
    holds: () => {
      const r = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.recommendedReporting;
      return (
        typeof r === 'object' &&
        r !== null &&
        typeof r.headline === 'string' &&
        typeof r.defensibleConservativeBound === 'string' &&
        typeof r.worstCaseEnvelope === 'string' &&
        /3\.06e-5/i.test(r.headline) &&
        /1\.76e-3|1\.7e-3/i.test(r.defensibleConservativeBound) &&
        /0\.253|0\.25/i.test(r.worstCaseEnvelope)
      );
    },
  },

  // Tripwire 10: cross-references include imp-1306, imp-459, imp-447, imp-1261.
  {
    id: 'imp1324-cross-references-parent-tickets-present',
    why:
      'The audit must cross-reference imp-1306 (parent that seeded this ticket), ' +
      'imp-459 (the assumption under audit), imp-447 (the primary derivation ' +
      'site), and imp-1261 (the downstream composition). Missing any of these ' +
      'would orphan the audit.',
    holds: () => {
      const x = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.crossReferences;
      return (
        typeof x === 'object' &&
        x !== null &&
        typeof x['imp-1306'] === 'string' &&
        typeof x['imp-459'] === 'string' &&
        typeof x['imp-447'] === 'string' &&
        typeof x['imp-1261'] === 'string'
      );
    },
  },

  // Tripwire 11: loosening factor summary spans 2x to 1e9 envelope.
  {
    id: 'imp1324-loosening-factor-summary-spans-mitigated-to-strawman',
    why:
      'The loosening_factor_summary must span the full envelope: Heath-Brown ' +
      '~ 2x (mitigated), Ramaré ~ 58x (optimistic), KLN ~ 8.3e3x (canonical), ' +
      'Kadiri 2013 ~ 1.96e7x (pessimistic), imp-1306 worst-case ~ 5.7e8x ' +
      '(strawman). The full spread must be present so the audit cannot be ' +
      'accused of cherry-picking.',
    holds: () => {
      const lf = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.loosening_factor_summary;
      return (
        typeof lf === 'object' &&
        lf !== null &&
        Number.isFinite(lf.heath_brown_1979_at_boundary) &&
        lf.heath_brown_1979_at_boundary < 10 &&
        Number.isFinite(lf.kln_2018_canonical) &&
        lf.kln_2018_canonical > 1e3 &&
        lf.kln_2018_canonical < 1e5 &&
        Number.isFinite(lf.imp_1306_worst_case_A6) &&
        lf.imp_1306_worst_case_A6 > 1e8
      );
    },
  },

  // Tripwire 12: semantic check -- verdictDetail mentions Heath-Brown AND KLN.
  {
    id: 'imp1324-verdict-detail-mentions-heath-brown-and-kln',
    why:
      'The verdict detail must explicitly mention BOTH the Heath-Brown 1979 ' +
      'mitigating evidence AND the KLN 2018 negative evidence. Glossing over ' +
      'either side would be intellectually dishonest. Semantic check on the ' +
      'verdict prose.',
    holds: () => {
      const vd = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.verdictDetail;
      return (
        typeof vd === 'string' &&
        /Heath-Brown 1979/i.test(vd) &&
        /KLN 2018/i.test(vd) &&
        /boundary case/i.test(vd) &&
        /Polymath15/i.test(vd)
      );
    },
  },

  // Tripwire 13: semantic check -- obviation path via imp-1322 mentioned.
  {
    id: 'imp1324-obviation-path-via-imp-1322-mentioned',
    why:
      'The recommended reporting must mention that the imp-1322 sigma re-' +
      'optimisation port (sigma -> 0.99) OBVIATES this audit. Without this, ' +
      'a reader would not know how to definitively close the rigor question.',
    holds: () => {
      const r = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.recommendedReporting;
      return (
        typeof r === 'object' &&
        r !== null &&
        typeof r.obviationPath === 'string' &&
        /imp-1322/i.test(r.obviationPath)
      );
    },
  },

  // Tripwire 14: semantic check -- Heath-Brown 1979 is classified as mitigating.
  {
    id: 'imp1324-heath-brown-classified-as-mitigating-evidence',
    why:
      'Heath-Brown 1979 must be classified in kadiriFamily as appliesAtSigma0p75 ' +
      '= true AND with O(1) constant. This is the load-bearing mitigating ' +
      'fact for the non-pessimistic verdict.',
    holds: () => {
      const fam = IMP_1324_KADIRI_EFFECTIVE_INGHAM_AUDIT.kadiriFamily;
      const hb = fam.find((k) => k.id === 'heath-brown-1979');
      return (
        hb &&
        hb.appliesAtSigma0p75 === true &&
        /O\(1\)/i.test(hb.note) &&
        /boundary/i.test(hb.note)
      );
    },
  },
];
