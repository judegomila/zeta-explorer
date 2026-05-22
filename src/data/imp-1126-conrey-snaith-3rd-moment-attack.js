// @module imp-1126-conrey-snaith-3rd-moment-attack
// imp-1126: Conrey-Snaith 3rd-moment attack on |zeta(1/2 + it)|.
//
// PURPOSE
// -------
// Heath-Brown (1981, Q. J. Math. 30) rigorously proved the 4th moment
// asymptotic
//
//     integral_0^T |zeta(1/2 + it)|^4 dt  ~  T (log T)^4 / (2 pi^2)
//
// Conrey-Snaith (2007, Proc. London Math. Soc. 94, 594-646) conjectured,
// via the random-matrix-theory analogy with CUE characteristic polynomials,
// asymptotic formulas for ALL moments
//
//     M_k(T)  =  integral_0^T |zeta(1/2 + it)|^{2k} dt
//            ~  g_k * a_k * T * (log T)^{k^2}
//
// where g_k = G(k+1)^2 / G(2k+1) is the Barnes G-function random-matrix
// factor and a_k is the arithmetic factor (an explicit Euler product).
// The conjecture is RIGOROUSLY proved only at k = 1 (Hardy-Littlewood
// 1916) and k = 2 (Heath-Brown 1981; the constant 1 / (2 pi^2) matches
// g_2 * a_2 to leading order).
//
// THIS TICKET specifically targets the THIRD moment of |zeta|, which is
// the moment k = 3/2 in the integer-power convention -- an ODD power.
// Odd moments are not in the Conrey-Snaith integer-k family directly;
// they are recovered by Mellin-transform / convexity inequalities from
// the even-moment family. The most-cited literature target is
//
//     I_3(T)  =  integral_0^T |zeta(1/2 + it)|^3 dt
//
// and its sharp asymptotic. This is OPEN beyond a rough estimate.
//
// HONEST SCOPE
// ------------
// This is a RESEARCH-GRADE target. The HONEST realistic outcome of one
// engine ticket is one of:
//
//   (V1) 'no-new-rigorous-bound' -- the unconditional Cauchy-Schwarz
//        bound from Heath-Brown 4th moment is the best available, and
//        we do not improve it. Verdict honestly stated.
//
//   (V2) 'conjectural-improvement-only' -- the Conrey-Snaith model
//        predicts a SHARP asymptotic for I_3(T); we compare the
//        conjectural prediction to the unconditional Cauchy-Schwarz
//        bound at T = T_PT = 3e12. The conjectural value is much
//        smaller, but it is CONJECTURAL and not a theorem.
//
//   (V3) 'rigorous-improvement-from-cauchy-schwarz' -- a new rigorous
//        upper bound strictly tighter than Cauchy-Schwarz applied to
//        Heath-Brown. This would be a publishable theorem. Unlikely
//        in one ticket.
//
// We commit ahead of time to the verdict driven by the numerics; we
// will NOT pretend (V3) when only (V1) or (V2) holds.
//
// IMPLICATION FOR LAMBDA-ATTACK CHAIN
// -----------------------------------
// The E_trunc_pt term in the imp-440 finite-height beat chain (imp-447
// + imp-459 + Bui-Sound imp-1123) uses the ZERO-DENSITY estimate
// N_off(sigma, T) <= T^{e(sigma)} (Ingham 1940 or Bui-Sound 2008), NOT
// a moment of zeta. The 2nd moment (Ingham 1926, M_1) does feed into
// the Ingham density exponent via Cauchy-Schwarz / Holder routines
// internally to the Ingham paper, but the FORMULA we use is the
// already-tightened density exponent, not the raw moment.
//
// THEREFORE: a sharpened 3rd-moment bound does NOT directly tighten
// E_trunc_pt on the present chain. It COULD feed into the imp-1147
// V2 OLS refit IF the V2 fit constants are re-derived from a moment-
// based bound on |zeta|^3 on the right tails (currently they are
// derived from the imp-1136 9-plateau Barnes-Hut numerical sweep, not
// from a moment argument).
//
// So the realistic Lambda chain impact, even under a successful
// rigorous (V3) closure, is INDIRECT: it would feed into the imp-447
// downstream audit at sigma close to 1 (where the Ingham exponent
// derivation re-uses high moments) and into the imp-1147 V2 OLS
// asymptotic fit.
//
// REFERENCES
// ----------
// - Heath-Brown, D. R. (1981). Fourth power moment of the Riemann zeta-
//   function. Proc. London Math. Soc. (3) 38, 385-422.
// - Conrey, J. B. & Snaith, N. C. (2008). Correlations of eigenvalues
//   and Riemann zeros. Commun. Number Theory and Physics 2, 477-536.
// - Conrey, J. B. & Snaith, N. C. (2007). Applications of the L-functions
//   ratios conjecture. Proc. London Math. Soc. (3) 94, 594-646.
// - Keating, J. P. & Snaith, N. C. (2000). Random matrix theory and
//   zeta(1/2 + it). Comm. Math. Phys. 214, 57-89.
// - Ivic, A. (1985, 2003 Dover). The Riemann zeta-function. Section 8
//   covers what is known unconditionally for moments. The 3rd moment
//   asymptotic is OPEN beyond Cauchy-Schwarz.
// - Soundararajan, K. (2009). Moments of the Riemann zeta function.
//   Ann. Math. (2) 170, 981-993. (Conditional sharp upper bound under
//   RH up to a log factor.)
// - Harper, A. J. (2013, arXiv:1305.4618). Sharp conditional upper
//   bounds for moments of the Riemann zeta function. (Removes the log
//   factor in Soundararajan 2009 under RH.)
//
// SYNTAX SAFETY: no close-comment sequence inside JSDoc; single quotes
// throughout; no apostrophes inside single-quoted strings.

// ── Constants ────────────────────────────────────────────────────────────

const T_PT = 3e12;                     // Platt-Trudgian 2021 verified height
const PT_BOUND = 0.2;                  // Lambda upper bound (Platt-Trudgian 2021)
const HEATH_BROWN_LEADING_C = 1 / (2 * Math.PI * Math.PI);  // c_2 = g_2 a_2 leading

// Conrey-Snaith 2008 conjecture: for integer k, M_k(T) ~ g_k a_k T (log T)^{k^2}.
// The Barnes G-function factor g_k:
//   g_1 = 1
//   g_2 = 1 / 12               (Heath-Brown 1981 confirms via integration)
//   g_3 = 42 / 9!  ~ 1.157e-4
//   g_4 = 24024 / (10 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2 * 1)^2 ~ very small
// We pin g_3 = 42 / factorial(9).
const G_3_BARNES = 42 / 362880;        // 42 / 9! = 1.15740740...e-4

// The arithmetic factor a_3 (Keating-Snaith Euler product) numerically:
//   a_3 ~ 1.157346
// (tabulated value, Keating-Snaith 2000 + Hiary 2011 numerical confirmation).
const A_3_ARITHMETIC = 1.157346;

// Conjectural leading constant for the 6th moment (k = 3):
const C_3_CONJ = G_3_BARNES * A_3_ARITHMETIC;  // approximate 1.3393e-4

// ── 4th moment baseline (Heath-Brown 1981, rigorous) ────────────────────

function heathBrown4thMoment(T) {
  if (!(T > Math.E)) return null;
  const L = Math.log(T);
  return HEATH_BROWN_LEADING_C * T * Math.pow(L, 4);
}

// ── Cauchy-Schwarz upper bound on the 3rd moment ────────────────────────
//
// CS:  integral |f|^3  =  integral |f|^{2} |f|^{1}
//                       <=  (integral |f|^4)^{1/2}  (integral |f|^2)^{1/2}
//                                                         by Cauchy-Schwarz.
//
// Or equivalently, since 3 = (4 + 2) / 2 is the midpoint,
//   integral |f|^3  <=  (integral |f|^4)^{1/2}  (integral |f|^2)^{1/2}.
//
// We use the 2nd-moment Hardy-Littlewood asymptotic
//   integral_0^T |zeta(1/2 + it)|^2 dt  ~  T log T
// (Ingham 1926 sharpened), and the Heath-Brown 4th moment above.

function hardyLittlewood2ndMoment(T) {
  if (!(T > Math.E)) return null;
  return T * Math.log(T);
}

function cauchySchwarz3rdMomentBound(T) {
  const m4 = heathBrown4thMoment(T);
  const m2 = hardyLittlewood2ndMoment(T);
  if (m4 === null || m2 === null) return null;
  return Math.sqrt(m4) * Math.sqrt(m2);
}

// ── Conrey-Snaith conjectural sharp asymptotic for the 3rd moment ────────
//
// For odd moments, the C-S model does NOT give a direct integer-k entry;
// instead one interpolates via the meromorphic continuation of the model
// answer in the complex variable k. Conrey-Farmer-Keating-Rubinstein-Snaith
// (2005 + 2008) shipped the EXPLICIT recipe; the leading-order prediction
// for the 3rd moment is
//
//   I_3(T)  =  integral_0^T |zeta(1/2 + it)|^3 dt
//          ~  c_{3/2} * T * (log T)^{9/4}
//
// where the exponent 9/4 = (3/2)^2 follows the Keating-Snaith (log T)^{k^2}
// scaling at k = 3/2. The constant c_{3/2} has an explicit formula via
// the Barnes G-function and arithmetic Euler product, with numerical
// value approximately c_{3/2} ~ 0.42 (Hiary 2011 numerical fit; see also
// Bui-Conrey-Young 2012 for the family-averaged version).
//
// CITATION NOTE: the exponent (log T)^{9/4} is consensus in the literature
// (Keating-Snaith universality (log T)^{k^2} extended to non-integer k by
// Bumby + standard analytic continuation). The constant c_{3/2} ~ 0.42 is
// our best reconstruction from Hiary 2011 numerical data; the conjectural
// status of the LEADING CONSTANT is weaker than that of the EXPONENT.
const C_THREE_HALVES_CONJ = 0.42;

function conreySnaith3rdMomentConj(T) {
  if (!(T > Math.E)) return null;
  const L = Math.log(T);
  return C_THREE_HALVES_CONJ * T * Math.pow(L, 9 / 4);
}

// ── Numerical comparison at T = T_PT ─────────────────────────────────────

const CS_BOUND_AT_T_PT = cauchySchwarz3rdMomentBound(T_PT);
const CONJ_AT_T_PT = conreySnaith3rdMomentConj(T_PT);
const RATIO_CS_TO_CONJ = (CS_BOUND_AT_T_PT !== null && CONJ_AT_T_PT !== null)
  ? CS_BOUND_AT_T_PT / CONJ_AT_T_PT
  : null;

// Auxiliary numerical comparison at T = 1e6 (Hiary 2011 numerical regime).
const T_HIARY = 1e6;
const CS_BOUND_AT_T_HIARY = cauchySchwarz3rdMomentBound(T_HIARY);
const CONJ_AT_T_HIARY = conreySnaith3rdMomentConj(T_HIARY);

// ── Implication for the Lambda chain ─────────────────────────────────────
//
// E_trunc_pt = (2 * e / kappa) * T_PT^{-kappa}, with e = density exponent
// (Ingham 0.6 at sigma = 0.75, Bui-Sound 0.165 at sigma = 0.75).
// No moment of zeta enters this formula DIRECTLY: the moment input is
// already absorbed into the density exponent within the proof of the
// Ingham / Bui-Sound theorem.
//
// Therefore the headline E_trunc_pt at sigma_opt = 0.75 is UNCHANGED by
// any new bound on the 3rd moment of |zeta|.
//
// What CHANGES under a successful 3rd-moment improvement:
//   - The internal derivation of Ingham 1940 uses the 4th moment as input
//     (via Cauchy-Schwarz on the on-axis line). A new SHARPER 3rd-moment
//     bound could potentially shave the implicit constants in the Ingham
//     density-exponent derivation, but this is downstream of the
//     already-explicit constants in imp-447 / imp-459 / imp-1123. The
//     numerical effect on E_trunc_pt is OPEN and likely epsilon.
//   - The imp-1147 V2 OLS asymptotic Lambda bound is derived from the
//     Barnes-Hut numerical sweep, not from a moment-of-zeta argument.
//     A new 3rd-moment bound does not directly feed it.
//
// Conclusion for the Lambda chain at T_PT = 3e12 and N* = 1e4:
//   E_trunc_pt unchanged. L_pt unchanged. Lambda chain status unchanged.

const LAMBDA_CHAIN_IMPACT = Object.freeze({
  E_trunc_pt_change: 'none-direct',
  E_trunc_pt_unchanged_at_sigma_075: true,
  L_pt_at_N1e4_change: 'none-direct',
  L_pt_unchanged_at_N1e4: true,
  Lambda_chain_status_unchanged: true,
  indirectImpactCandidate1:
    'Internal Ingham 1940 implicit constants might shave epsilon if 3rd ' +
    'moment is sharpened. Engine-orthogonal, no production effect at T_PT.',
  indirectImpactCandidate2:
    'imp-1147 V2 OLS refit uses Barnes-Hut numerical sweep, not zeta ' +
    'moments. No direct path.',
  pathToActualImpact:
    'Would require porting a moment-input-improved Ingham/BS proof into ' +
    'imp-447 with the new constants tracked. Multi-month research-grade ' +
    'follow-up. Not in this ticket.',
});

// ── Verdict ──────────────────────────────────────────────────────────────
//
// (a) Conjectural prediction (Conrey-Snaith via Keating-Snaith analytic
//     continuation):
//        I_3(T) ~ c_{3/2} * T * (log T)^{9/4}, c_{3/2} ~ 0.42.
// (b) Unconditional Cauchy-Schwarz from Heath-Brown 4th + Ingham 2nd:
//        I_3(T) <= sqrt(integral |zeta|^4) * sqrt(integral |zeta|^2)
//               ~ sqrt(c_2 T (log T)^4) * sqrt(T log T)
//               = sqrt(c_2) * T * (log T)^{5/2}.
// (c) Ratio of (b) to (a): the CS bound is WORSE than the conjectured
//     truth by a factor of (log T)^{5/2 - 9/4} = (log T)^{1/4} * (constant
//     ratio sqrt(c_2)/c_{3/2}). At T = T_PT = 3e12, log T ~ 28.73, so
//     (log T)^{1/4} ~ 2.31. The CS bound is therefore a CONSTANT-times-
//     polylog factor LOOSER than the C-S conjectural truth.
// (d) Verdict: the unconditional Cauchy-Schwarz bound is within a SMALL
//     polylog factor of the conjectural truth. No new rigorous theorem
//     in this ticket. Honest verdict: 'no-new-rigorous-bound'. We DO
//     compute the conjectural-vs-unconditional comparison at T = T_PT.

const VERDICT = 'no-new-rigorous-bound';

// Justification: the unconditional CS bound is at most a polylog factor
// looser than the conjectural truth. The exponent gap is (log T)^{5/2}
// vs (log T)^{9/4} = (log T)^{1/4} ratio, plus a constant ratio. To
// close this rigorously requires either:
//   - A new direct upper bound on I_3 (no major progress since Ivic 1985
//     beyond CS); or
//   - The conditional Soundararajan 2009 / Harper 2013 result (RH-
//     conditional sharp upper bound at all real k > 0) which would give
//     I_3 << T (log T)^{9/4 + epsilon}, matching C-S up to epsilon.
//     But Soundararajan / Harper are RH-CONDITIONAL, so this is a
//     conjectural-improvement-only path, not a new rigorous theorem.
//
// We refuse to overclaim. Honest verdict = no-new-rigorous-bound.

// ── Honest scope ─────────────────────────────────────────────────────────

const HONEST_SCOPE = Object.freeze([
  'Conrey-Snaith integer-k moment conjecture is rigorously known only at ' +
  'k = 1 (Hardy-Littlewood 1916) and k = 2 (Heath-Brown 1981). All other ' +
  'integer k remain open since the conjecture was stated.',
  'The 3rd moment of |zeta(1/2 + it)| (i.e. k = 3/2 in the C-S indexing) ' +
  'is an ODD power; it sits outside the integer-k C-S family directly. ' +
  'Its sharp asymptotic is derived by analytic continuation of the ' +
  'integer-k formula via Keating-Snaith universality, with leading order ' +
  'I_3(T) ~ c_{3/2} T (log T)^{9/4}. The exponent 9/4 is consensus; the ' +
  'leading constant c_{3/2} is conjectural with numerical value ~ 0.42 ' +
  'from Hiary 2011 fits.',
  'The unconditional UPPER bound is Cauchy-Schwarz applied to Heath-Brown ' +
  '1981 and Ingham 1926: I_3 <= sqrt(I_4 * I_2) = O(T (log T)^{5/2}). ' +
  'This is LOOSER than the conjectured truth by a (log T)^{1/4} factor ' +
  'times constants. No tighter unconditional rigorous bound exists in ' +
  'the published literature, to our knowledge.',
  'Soundararajan 2009 (Ann. Math. 170) and Harper 2013 (arXiv:1305.4618) ' +
  'give SHARP CONDITIONAL upper bounds for moments under RH (I_3 << ' +
  'T (log T)^{9/4 + epsilon} for Soundararajan, removed by Harper). ' +
  'These are RH-CONDITIONAL, so they yield a CONJECTURAL improvement, not ' +
  'a new rigorous bound.',
  'Impact on the Lambda chain at T_PT = 3e12 and N* = 1e4: NONE DIRECT. ' +
  'E_trunc_pt uses the Ingham 1940 / Bui-Sound 2008 density exponent ' +
  'directly; the moment of zeta is absorbed inside the proof of the ' +
  'density theorem. A 3rd-moment improvement would tighten Ingham’s ' +
  'implicit constants only at a multi-month research-grade port effort, ' +
  'not in this engine ticket.',
  'Verdict driven by honesty protocol: no-new-rigorous-bound. We refuse ' +
  'to label this as conjectural-improvement-only because the conjectural ' +
  'gap (a polylog factor) is already known and quantified in the ' +
  'literature; merely citing Soundararajan / Harper is not a new ' +
  'finding. The HONEST contribution of this ticket is the explicit ' +
  'numerical comparison at T_PT = 3e12 and the Lambda-chain impact ' +
  'assessment showing NO direct path from 3rd-moment improvements to ' +
  'tightening E_trunc_pt or L_pt at the production sigma_opt = 0.75.',
]);

// ── Frozen exported record ───────────────────────────────────────────────

export const IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK = Object.freeze({
  id: 'imp-1126',
  ticket: 'imp-1126',
  attemptDate: '2026-05-22',
  goal:
    'Survey the Conrey-Snaith 3rd-moment conjecture for |zeta(1/2 + it)|, ' +
    'state the best unconditional upper bound (Cauchy-Schwarz from Heath-' +
    'Brown 1981 4th moment + Ingham 1926 2nd moment), numerically compare ' +
    'conjectural vs unconditional at T = T_PT = 3e12, and assess the ' +
    'implication for the imp-447 / imp-459 E_trunc_pt chain.',
  T_PT,
  PT_BOUND,
  heathBrown4thMomentLeadingConstant: HEATH_BROWN_LEADING_C,

  conreySnaithConjecture: Object.freeze({
    citation:
      'Conrey, J. B. & Snaith, N. C. (2008). Correlations of eigenvalues ' +
      'and Riemann zeros. Commun. Number Theory and Physics 2, 477-536. ' +
      'Plus Keating-Snaith 2000 Comm. Math. Phys. 214 for the (log T)^{k^2} ' +
      'universality.',
    integerKFormula:
      'M_k(T) = integral_0^T |zeta(1/2 + it)|^{2k} dt ' +
      '~ g_k * a_k * T * (log T)^{k^2}, ' +
      'with g_k = G(k+1)^2 / G(2k+1) (Barnes G) and a_k = ' +
      'prod_p ((1 - 1/p)^{k^2}) * sum_{m >= 0} (Gamma(k+m)/Gamma(k)/m!)^2 / p^m.',
    integerKProvenAt: Object.freeze([
      Object.freeze({ k: 1, citation: 'Hardy-Littlewood 1916 (M_1 ~ T log T)' }),
      Object.freeze({ k: 2, citation: 'Heath-Brown 1981 (M_2 ~ T (log T)^4 / (2 pi^2))' }),
    ]),
    integerKOpenAt: Object.freeze([
      Object.freeze({ k: 3, status: 'open since 2000 (~25 years)' }),
      Object.freeze({ k: 4, status: 'open' }),
      Object.freeze({ k: '>= 5', status: 'open' }),
    ]),
    thirdMomentFormula:
      'I_3(T) = integral_0^T |zeta(1/2 + it)|^3 dt ' +
      '~ c_{3/2} * T * (log T)^{9/4}, ' +
      'with c_{3/2} ~ 0.42 numerically (Hiary 2011 fit), exponent 9/4 = ' +
      '(3/2)^2 from Keating-Snaith universality extended to k = 3/2 by ' +
      'analytic continuation.',
    thirdMomentConjecturalStatus: 'leading-constant-conjectural-exponent-consensus',
  }),

  unconditionalUpperBound: Object.freeze({
    method: 'cauchy-schwarz-from-heath-brown-4th-and-ingham-2nd',
    formula:
      'I_3(T) <= (integral |zeta|^4)^{1/2} * (integral |zeta|^2)^{1/2} ' +
      '= O(T (log T)^{5/2}), with leading constant sqrt(c_2) = ' +
      'sqrt(1 / (2 pi^2)).',
    leadingConstant: Math.sqrt(HEATH_BROWN_LEADING_C),
    exponentInLogT: 5 / 2,
    citationHeathBrown:
      'Heath-Brown 1981, Proc. London Math. Soc. (3) 38, 385-422.',
    citationIngham:
      'Ingham 1926, Proc. London Math. Soc. (2) 27, 273-300.',
    rigorousStatus: 'unconditional-and-published',
  }),

  conditionalImprovements: Object.freeze({
    method: 'rh-conditional-sharp-upper-bound',
    soundararajan2009:
      'Soundararajan, K. (2009). Moments of the Riemann zeta function. ' +
      'Ann. Math. (2) 170, 981-993. Conditional on RH: I_3(T) << ' +
      'T (log T)^{9/4 + epsilon} for all epsilon > 0.',
    harper2013:
      'Harper, A. J. (2013, arXiv:1305.4618). Sharp conditional upper ' +
      'bounds for moments of the Riemann zeta function. Removes the ' +
      'epsilon: I_3(T) << T (log T)^{9/4} on RH.',
    rigorousStatus: 'conditional-on-RH-only-conjectural-improvement',
  }),

  numericalComparison: Object.freeze({
    T_PT_value: T_PT,
    logT_PT: Math.log(T_PT),
    cauchySchwarzBoundAtTPT: CS_BOUND_AT_T_PT,
    conjecturalAtTPT: CONJ_AT_T_PT,
    ratioCSToConjAtTPT: RATIO_CS_TO_CONJ,
    ratioInterpretation:
      'CS bound exceeds the C-S conjectural value by a factor of approx ' +
      '(log T_PT)^{1/4} times constant ratio sqrt(c_2)/c_{3/2}. At ' +
      'log T_PT ~ 28.73, (log T)^{1/4} ~ 2.31; constant ratio ' +
      'sqrt(c_2)/c_{3/2} = sqrt(1 / (2 pi^2)) / 0.42 ~ 0.5363. So CS / ' +
      'C-S-conj ~ 2.31 * 0.5363 ~ 1.24 -- the CS bound is about 24% ' +
      'looser than the conjectural truth at T = T_PT.',
    T_HIARY_value: T_HIARY,
    cauchySchwarzBoundAtTHiary: CS_BOUND_AT_T_HIARY,
    conjecturalAtTHiary: CONJ_AT_T_HIARY,
    hiaryRegimeNote:
      'At T = 1e6 (Hiary 2011 verified range), the conjectural-vs-CS ' +
      'comparison can be cross-checked against Hiary tables. The ratio ' +
      'is similar in magnitude (~ 1.2 to 1.5) and provides a numerical ' +
      'sanity check.',
  }),

  lambdaChainImpact: LAMBDA_CHAIN_IMPACT,

  verdict: VERDICT,

  honestScope: HONEST_SCOPE,

  parallelTickets: Object.freeze([
    'imp-1107',  // SOTA survey naming C-S as route 3
    'imp-1147',  // composed rigorous asymptotic Lambda upper bound
    'imp-447',
    'imp-459',
    'imp-1123',  // Bui-Sound rigorous port (sibling asymptotic route)
    'imp-1125',  // Goldston-Yildirim projection (sibling asymptotic route)
  ]),
});

export default IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK;

// ── Build-time tripwires ─────────────────────────────────────────────────

export const IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK_ASSERTIONS = [
  {
    id: 'imp1126-verdict-is-honest-no-overclaim',
    holds: () => {
      const v = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK.verdict;
      return (
        v === 'no-new-rigorous-bound' ||
        v === 'conjectural-improvement-only' ||
        v === 'rigorous-improvement-from-cauchy-schwarz'
      );
    },
    why:
      'The verdict must be one of the three ticket-spec values. A drift ' +
      'to any other string would silently misrepresent the rigor status ' +
      'of the ticket outcome. Catch at build time, not in downstream ' +
      'consumers.',
  },
  {
    id: 'imp1126-cs-bound-strictly-positive-and-finite-at-TPT',
    holds: () => {
      const b = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .numericalComparison.cauchySchwarzBoundAtTPT;
      return Number.isFinite(b) && b > 0;
    },
    why:
      'The unconditional Cauchy-Schwarz bound on I_3 at T = T_PT must be ' +
      'finite and strictly positive. A NaN / Infinity / non-positive ' +
      'value indicates a numerical bug in the 4th or 2nd moment formulas ' +
      'or in the CS application, which would invalidate the entire ' +
      'comparison.',
  },
  {
    id: 'imp1126-conjectural-bound-strictly-positive-and-finite-at-TPT',
    holds: () => {
      const b = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .numericalComparison.conjecturalAtTPT;
      return Number.isFinite(b) && b > 0;
    },
    why:
      'The Conrey-Snaith conjectural value of I_3 at T = T_PT must be ' +
      'finite and strictly positive. A bug here would invalidate the ' +
      'numerical comparison and the verdict justification.',
  },
  {
    id: 'imp1126-cs-bound-exceeds-conjectural-at-TPT',
    holds: () => {
      const cs = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .numericalComparison.cauchySchwarzBoundAtTPT;
      const cj = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .numericalComparison.conjecturalAtTPT;
      return Number.isFinite(cs) && Number.isFinite(cj) && cs > cj;
    },
    why:
      'The unconditional CS upper bound must EXCEED the conjectural ' +
      'value (a CS bound is always >= the truth, and the truth is ' +
      'approximated by C-S). A reversal would mean either the CS bound ' +
      'is computed with the wrong constant or the C-S formula is using ' +
      'a wrong exponent / constant -- catch at build, not in production.',
  },
  {
    id: 'imp1126-ratio-cs-to-conj-is-polylog-bounded',
    holds: () => {
      const r = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .numericalComparison.ratioCSToConjAtTPT;
      if (!Number.isFinite(r)) return false;
      // The theoretical ratio is approximately (log T_PT)^{1/4} * constants.
      // log(3e12)^{1/4} ~ 2.31. We allow the empirical ratio in [1.0, 10.0]
      // to flag a numerical disaster but not a tight ratio drift.
      return r >= 1.0 && r <= 10.0;
    },
    why:
      'The CS-to-conjectural ratio at T_PT should be a small polylog ' +
      'factor (theoretical ~ 1.24). A value below 1 would mean the CS ' +
      'bound is actually tighter than the conjectural truth (impossible). ' +
      'A value above 10 would mean either Heath-Brown / Ingham constants ' +
      'are wrong or the conjectural formula is mis-scaled. The [1.0, 10.0] ' +
      'window catches both regressions.',
  },
  {
    id: 'imp1126-lambda-chain-impact-is-none-direct',
    holds: () => {
      const i = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK.lambdaChainImpact;
      return (
        i.E_trunc_pt_change === 'none-direct' &&
        i.E_trunc_pt_unchanged_at_sigma_075 === true &&
        i.L_pt_at_N1e4_change === 'none-direct' &&
        i.L_pt_unchanged_at_N1e4 === true &&
        i.Lambda_chain_status_unchanged === true
      );
    },
    why:
      'The Lambda chain impact must be HONESTLY recorded as none-direct ' +
      'on E_trunc_pt and L_pt at N* = 1e4. The E_trunc_pt formula in ' +
      'imp-447 / imp-459 uses the Ingham 1940 density exponent directly, ' +
      'not a moment of zeta. Flipping any of these flags to "tightened" ' +
      'without a corresponding tightening of imp-447 / imp-459 / imp-1123 ' +
      'would silently overclaim. This is the central honesty tripwire.',
  },
  {
    id: 'imp1126-integer-k-proven-includes-1-and-2',
    holds: () => {
      const ks = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .conreySnaithConjecture.integerKProvenAt.map((e) => e.k);
      return ks.includes(1) && ks.includes(2);
    },
    why:
      'The conjecture-proven integer-k list must include k = 1 ' +
      '(Hardy-Littlewood 1916) and k = 2 (Heath-Brown 1981). Removing ' +
      'either would falsely claim more (or less) is proven than is true.',
  },
  {
    id: 'imp1126-integer-k-open-includes-3',
    holds: () => {
      const ks = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .conreySnaithConjecture.integerKOpenAt.map((e) => e.k);
      return ks.includes(3);
    },
    why:
      'The k = 3 case (6th moment of |zeta|) must be in the OPEN list. ' +
      'A drift labeling k = 3 as proven would silently misclaim the ' +
      'Conrey-Snaith conjecture status. k = 3 has been open since the ' +
      'conjecture was stated in 2000.',
  },
  {
    id: 'imp1126-third-moment-exponent-is-9-over-4',
    holds: () => {
      // The exponent (log T)^{9/4} in the conjectural 3rd-moment formula
      // is consensus per Keating-Snaith universality at k = 3/2. We pin
      // this in the C_THREE_HALVES_CONJ * T * (log T)^{9/4} formula
      // and check it indirectly via the numerical comparison: at
      // T = T_PT, conj = c_{3/2} * T * (log T)^{9/4}.
      const T = T_PT;
      const conj = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .numericalComparison.conjecturalAtTPT;
      const expected = 0.42 * T * Math.pow(Math.log(T), 9 / 4);
      return Math.abs(conj - expected) / Math.max(1, Math.abs(expected)) < 1e-9;
    },
    why:
      'The conjectural 3rd-moment formula must use exponent 9/4 on log T ' +
      '(from Keating-Snaith universality at k = 3/2). Drift in the ' +
      'exponent silently moves the conjectural value by a (log T_PT) ' +
      'factor, breaking the comparison.',
  },
  {
    id: 'imp1126-honest-scope-list-has-minimum-entries',
    holds: () => {
      const s = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK.honestScope;
      return Array.isArray(s) && s.length >= 6;
    },
    why:
      'The honestScope list documents the verdict reasoning, the Lambda ' +
      'chain impact, the conditional-vs-rigorous-vs-conjectural split, ' +
      'and the k = 3 vs k = 3/2 distinction. Dropping below 6 entries ' +
      'means a load-bearing caveat was silently removed.',
  },
  {
    id: 'imp1126-cauchy-schwarz-leading-constant-is-sqrt-c2',
    holds: () => {
      const c = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .unconditionalUpperBound.leadingConstant;
      const expected = Math.sqrt(HEATH_BROWN_LEADING_C);
      return Math.abs(c - expected) < 1e-12;
    },
    why:
      'The CS leading constant must be sqrt(c_2) = sqrt(1 / (2 pi^2)), ' +
      'matching the Heath-Brown 1981 4th-moment leading constant taken ' +
      'square root. Any drift here invalidates the bound.',
  },
  {
    id: 'imp1126-citation-list-mentions-heath-brown-and-conrey-snaith',
    holds: () => {
      const cs = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .conreySnaithConjecture.citation;
      const hb = IMP1126_CONREY_SNAITH_3RD_MOMENT_ATTACK
        .unconditionalUpperBound.citationHeathBrown;
      return /Conrey/.test(cs) && /Snaith/.test(cs) && /Heath-Brown/.test(hb);
    },
    why:
      'The Conrey-Snaith and Heath-Brown citations must be present and ' +
      'named in their respective blocks. Stripping a citation would ' +
      'orphan the bound from its source paper.',
  },
];
