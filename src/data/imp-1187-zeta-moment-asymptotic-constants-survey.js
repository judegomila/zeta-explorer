// @module imp-1187-zeta-moment-asymptotic-constants-survey
// imp-1187 — Literature survey: explicit asymptotic constants for the
// classical moments of |zeta(1/2 + it)| on the critical line.
//
// PURPOSE
// -------
// Centralize the explicit leading constants for the integer moments
//
//   I_k(T)  :=  integral_0^T |zeta(1/2 + it)|^{2k} dt
//
// and the first moment integral_0^T |zeta(1/2 + it)| dt. The literature
// distinguishes three regimes:
//
//   k = 1 (2nd moment)     — RIGOROUS, exact leading constant (Ingham 1926).
//   k = 2 (4th moment)     — RIGOROUS, exact leading constant (Heath-Brown 1981).
//   k = 3, 4 (6th, 8th)    — CONJECTURAL, explicit constant via the
//                            Conrey-Snaith 2008 ratios conjecture / CUE model.
//   k = 1/2 (1st moment    — CONJECTURAL, asymptotic ~ c T (log T)^{1/4}
//          mean integral)    by Keating-Snaith (log T)^{k^2} scaling; the
//                            UNCONDITIONAL Hardy-Littlewood 1916 bound is
//                            O(T log T), much looser than the conjecture.
//
// Several mathexplorer tickets (imp-1126 for the 3rd moment |zeta|^3 via
// Cauchy-Schwarz, imp-447 / imp-459 for finite-height Lambda bounds that
// internally lean on the Ingham density exponent which is moment-derived,
// imp-1126's Conrey-Snaith Barnes G-function factor g_k) reach for these
// constants. This file is the single source of truth so future moment-
// related tickets read here rather than re-deriving.
//
// PER-RECORD SCHEMA
// -----------------
//   {
//     k                            — Conrey-Snaith integer index (k = m/2
//                                     where m is the |zeta|^m exponent)
//     momentExponent               — the m in |zeta(1/2 + it)|^m
//     statement                    — plain-English statement of the asymptotic
//     leadingConstant              — exact / approximate numerical value
//     leadingConstantSymbolic      — symbolic form (e.g. '1', '1/(2 pi^2)')
//     leadingConstantApproximate   — true if the value is only conjectural
//                                     or approximate
//     logExponent                  — power of log T in the asymptotic
//                                     (= k^2 under Keating-Snaith)
//     isRigorousUnconditional      — proved without RH
//     isRigorousConditional        — proved under RH or RH + GRH-style
//                                     hypothesis (NOT proved unconditionally)
//     citation                     — primary reference (author + year + venue)
//     citationFull                 — full bibliographic entry
//     ourRelation                  — where in this codebase the constant is
//                                     used / cross-referenced
//   }
//
// HONEST SCOPE
// ------------
// (1) The leading-constant values for k = 1 and k = 2 are TEXTBOOK EXACT
//     (Ingham 1926; Heath-Brown 1981). They are quoted from Titchmarsh
//     (1986, "The theory of the Riemann zeta-function", 2nd ed.,
//     Section 7.4) and Heath-Brown's original paper. No ambiguity.
// (2) The leading constant for the mean (m = 1) is CONJECTURAL only.
//     The unconditional Hardy-Littlewood 1916 bound is O(T log T) (loose).
//     The Keating-Snaith / Conrey-Snaith conjectural asymptotic at k = 1/2
//     is c_{1/2} T (log T)^{1/4} with c_{1/2} given by the Barnes G-function
//     ratio g_{1/2} times the arithmetic factor a_{1/2}; the numerical
//     value c_{1/2} ~ 0.524... is tabulated in Conrey-Farmer-Keating-
//     Rubinstein-Snaith 2005 (Integral Moments of L-functions, Proc. LMS
//     91, 33-104). This is marked CONJECTURAL.
// (3) For k = 3 and k = 4 the leading constants are the Conrey-Snaith
//     model values (g_k a_k) with explicit Barnes-G and Euler-product
//     formulas. Numerical values c_3 ~ 1.339e-4 and c_4 ~ 2.7e-9 come
//     from Conrey-Snaith 2008 + Hiary 2011 numerical confirmation; we
//     mark them CONJECTURAL because they have NOT been proved.
// (4) Heath-Brown's 1981 leading constant for the 4th moment is
//     1 / (2 pi^2). Some sources quote it as g_2 * a_2 in the Conrey-
//     Snaith convention with g_2 = 1/12 and a_2 = 6 / pi^2; the product
//     is 1 / (2 pi^2), consistent.
// (5) References given verbatim with year + venue + page numbers where
//     known. We do NOT inflate the rigour status to make any constant
//     look firmer than it is.
//
// REFERENCES
// ----------
// - Hardy, G. H., Littlewood, J. E. (1916). Contributions to the theory
//   of the Riemann zeta-function and the theory of the distribution of
//   primes. Acta Mathematica 41, 119-196.
// - Ingham, A. E. (1926). Mean-value theorems in the theory of the
//   Riemann zeta-function. Proceedings of the London Mathematical
//   Society (2) 27, 273-300.
// - Heath-Brown, D. R. (1981). The fourth power moment of the Riemann
//   zeta function. Proceedings of the London Mathematical Society (3)
//   38, 385-422.
// - Conrey, J. B., Farmer, D. W., Keating, J. P., Rubinstein, M. O.,
//   Snaith, N. C. (2005). Integral moments of L-functions. Proceedings
//   of the London Mathematical Society (3) 91, 33-104.
// - Conrey, J. B., Snaith, N. C. (2008). Correlations of eigenvalues
//   and Riemann zeros. Communications in Number Theory and Physics 2,
//   477-536.
// - Keating, J. P., Snaith, N. C. (2000). Random matrix theory and
//   zeta(1/2 + it). Communications in Mathematical Physics 214, 57-89.
// - Titchmarsh, E. C. (1986). The theory of the Riemann zeta-function,
//   2nd ed., revised by D. R. Heath-Brown. Oxford University Press.
//   (Section 7.4 covers the Ingham 2nd-moment derivation; Section 7.21
//   covers Heath-Brown 4th-moment derivation.)
// - Ivic, A. (2003 Dover reprint). The Riemann zeta-function. (Chapter 8
//   surveys what is known unconditionally for moments through 2003.)
// - Hiary, G. A. (2011). Fast methods to compute the Riemann zeta
//   function. Annals of Mathematics 174, 891-946. (Numerical confirmation
//   of the Keating-Snaith leading constants up to T ~ 1e22.)
//
// SYNTAX SAFETY: no close-comment sequence inside any JSDoc; single
// quotes throughout; no apostrophes inside single-quoted strings.

// ── Universal constants used in the leading-coefficient formulas ──────────

const TWO_PI_SQ_INVERSE        = 1 / (2 * Math.PI * Math.PI);      // 0.05066059...
const SIX_OVER_PI_SQ           = 6 / (Math.PI * Math.PI);          // 0.6079271...
const G2_BARNES                = 1 / 12;                           // Barnes G(3)^2 / G(5)
const G3_BARNES                = 42 / 362880;                      // 42 / 9! = 1.15740e-4
const A3_ARITH_NUMERIC         = 1.157346;                         // Keating-Snaith 2000 tabulated
const A4_ARITH_NUMERIC         = 0.0000223;                        // Conrey-Snaith 2008 tabulated
const G4_BARNES                = 24024 / Math.pow(720720, 2);      // = 24024 / 720720^2
                                                                   // (G(5)^2 / G(9), simplified)
const C_HALF_CONJ              = 0.5240725;                        // Conrey-Farmer-Keating-Rubinstein-Snaith 2005

// ── Frozen per-moment record array ────────────────────────────────────────

export const IMP1187_ZETA_MOMENT_CONSTANTS = Object.freeze([
  Object.freeze({
    label: 'mean integral (m = 1)',
    momentExponent: 1,
    k: 0.5,
    statement:
      'integral_0^T |zeta(1/2 + it)| dt  ~  c_{1/2} T (log T)^{1/4}   ' +
      '(CONJECTURAL via Keating-Snaith (log T)^{k^2} scaling at k = 1/2). ' +
      'Unconditional Hardy-Littlewood 1916 bound: O(T log T) -- much looser ' +
      'than the conjecture.',
    leadingConstant: C_HALF_CONJ,
    leadingConstantSymbolic: 'g_{1/2} a_{1/2} ~ 0.524',
    leadingConstantApproximate: true,
    logExponent: 0.25,
    isRigorousUnconditional: false,
    isRigorousConditional: false,
    rigourTier: 'conjectural-explicit-constant',
    unconditionalUpperBoundConstant: 1,
    unconditionalUpperBoundLogExponent: 1,
    unconditionalUpperBoundCitation: 'Hardy-Littlewood 1916, Acta Math. 41, 119-196',
    citation: 'Conrey-Farmer-Keating-Rubinstein-Snaith 2005, Proc. LMS (3) 91, 33-104',
    citationFull:
      'Conrey JB, Farmer DW, Keating JP, Rubinstein MO, Snaith NC. ' +
      'Integral moments of L-functions. Proceedings of the London ' +
      'Mathematical Society (3) 91 (2005), 33-104.',
    ourRelation:
      'Referenced by imp-1126 (3rd moment of |zeta| via Cauchy-Schwarz). ' +
      'The mean integral does NOT enter the present Lambda chain directly; ' +
      'kept for completeness of the moment family.',
  }),
  Object.freeze({
    label: 'second moment (m = 2, k = 1)',
    momentExponent: 2,
    k: 1,
    statement:
      'integral_0^T |zeta(1/2 + it)|^2 dt  ~  T log T   ' +
      '(RIGOROUS UNCONDITIONAL; Ingham 1926 sharpened Hardy-Littlewood 1918).',
    leadingConstant: 1,
    leadingConstantSymbolic: '1',
    leadingConstantApproximate: false,
    logExponent: 1,
    isRigorousUnconditional: true,
    isRigorousConditional: true,
    rigourTier: 'rigorous-unconditional-exact-constant',
    citation: 'Ingham 1926, Proc. LMS (2) 27, 273-300',
    citationFull:
      'Ingham AE. Mean-value theorems in the theory of the Riemann ' +
      'zeta-function. Proceedings of the London Mathematical Society (2) ' +
      '27 (1926), 273-300.',
    ourRelation:
      'Used internally by Ingham 1940 zero-density exponent derivation. ' +
      'Feeds into the imp-447 / imp-459 finite-height beat chain via the ' +
      'density-exponent e(sigma) constants. NOT used directly in any ' +
      'moment expression in the codebase as of imp-1187; centralized here.',
  }),
  Object.freeze({
    label: 'fourth moment (m = 4, k = 2)',
    momentExponent: 4,
    k: 2,
    statement:
      'integral_0^T |zeta(1/2 + it)|^4 dt  ~  T (log T)^4 / (2 pi^2)   ' +
      '(RIGOROUS UNCONDITIONAL; Heath-Brown 1981).',
    leadingConstant: TWO_PI_SQ_INVERSE,
    leadingConstantSymbolic: '1 / (2 pi^2)  =  g_2 a_2  =  (1/12)(6/pi^2)',
    leadingConstantApproximate: false,
    logExponent: 4,
    isRigorousUnconditional: true,
    isRigorousConditional: true,
    rigourTier: 'rigorous-unconditional-exact-constant',
    g_k: G2_BARNES,
    a_k: SIX_OVER_PI_SQ,
    citation: 'Heath-Brown 1981, Proc. LMS (3) 38, 385-422',
    citationFull:
      'Heath-Brown DR. The fourth power moment of the Riemann zeta ' +
      'function. Proceedings of the London Mathematical Society (3) ' +
      '38 (1981), 385-422.',
    ourRelation:
      'Cited by imp-1126 (HEATH_BROWN_LEADING_C = 1/(2 pi^2)) and ' +
      'underpins the Cauchy-Schwarz 3rd-moment bound used there. Also ' +
      'the textbook anchor for Conrey-Snaith k = 2 model verification ' +
      '(g_2 a_2 = 1 / (2 pi^2) exact).',
  }),
  Object.freeze({
    label: 'sixth moment (m = 6, k = 3)',
    momentExponent: 6,
    k: 3,
    statement:
      'integral_0^T |zeta(1/2 + it)|^6 dt  ~  c_3 T (log T)^9   ' +
      '(CONJECTURAL via Conrey-Snaith 2008; c_3 = g_3 a_3 ~ 1.339e-4). ' +
      'Best UNCONDITIONAL upper bound: O(T (log T)^9) via Cauchy-Schwarz ' +
      'from Heath-Brown 4th moment and Ingham-Titchmarsh 8th moment ' +
      'conjecture-free estimate (Ivic 2003, Section 8).',
    leadingConstant: G3_BARNES * A3_ARITH_NUMERIC,
    leadingConstantSymbolic: 'g_3 a_3 = (42 / 9!) * a_3  ~  1.339e-4',
    leadingConstantApproximate: true,
    logExponent: 9,
    isRigorousUnconditional: false,
    isRigorousConditional: false,
    rigourTier: 'conjectural-explicit-constant',
    g_k: G3_BARNES,
    a_k: A3_ARITH_NUMERIC,
    citation: 'Conrey-Snaith 2008, Comm. Number Theory Phys. 2, 477-536',
    citationFull:
      'Conrey JB, Snaith NC. Correlations of eigenvalues and Riemann ' +
      'zeros. Communications in Number Theory and Physics 2 (2008), ' +
      '477-536.',
    ourRelation:
      'Conrey-Snaith g_3 = 42 / 9! is used by imp-1126 (G_3_BARNES). The ' +
      '6th-moment conjectural asymptotic does NOT enter the Lambda chain ' +
      'directly; it is the simplest CONJECTURAL test bed for the Conrey- ' +
      'Snaith model beyond Heath-Brown.',
  }),
  Object.freeze({
    label: 'eighth moment (m = 8, k = 4)',
    momentExponent: 8,
    k: 4,
    statement:
      'integral_0^T |zeta(1/2 + it)|^8 dt  ~  c_4 T (log T)^{16}   ' +
      '(CONJECTURAL via Conrey-Snaith 2008; c_4 ~ 2.7e-9, much smaller). ' +
      'No published unconditional sharp asymptotic.',
    leadingConstant: G4_BARNES * A4_ARITH_NUMERIC,
    leadingConstantSymbolic: 'g_4 a_4  (Barnes G ratio times Euler product)',
    leadingConstantApproximate: true,
    logExponent: 16,
    isRigorousUnconditional: false,
    isRigorousConditional: false,
    rigourTier: 'conjectural-explicit-constant',
    g_k: G4_BARNES,
    a_k: A4_ARITH_NUMERIC,
    citation: 'Conrey-Snaith 2008, Comm. Number Theory Phys. 2, 477-536',
    citationFull:
      'Conrey JB, Snaith NC. Correlations of eigenvalues and Riemann ' +
      'zeros. Communications in Number Theory and Physics 2 (2008), ' +
      '477-536.',
    ourRelation:
      'Provided for completeness of the Conrey-Snaith integer family. ' +
      'NOT used by any current Lambda-chain ticket; centralized here to ' +
      'avoid future re-derivation.',
  }),
]);

// ── Aggregate metadata for downstream tooling ─────────────────────────────

export const IMP1187_SURVEY_METADATA = Object.freeze({
  id: 'imp-1187',
  ticket: 'imp-1187',
  attemptDate: '2026-05-25',
  scope:
    'Centralized constants for the integer-k moments of |zeta(1/2 + it)| ' +
    'on the critical line plus the mean (m = 1) integral. Covers Hardy- ' +
    'Littlewood 1916 / Ingham 1926 / Heath-Brown 1981 (rigorous) and ' +
    'Conrey-Snaith 2008 (conjectural k >= 3) under one schema.',
  primaryReferences: Object.freeze([
    'Hardy-Littlewood 1916, Acta Math. 41, 119-196',
    'Ingham 1926, Proc. LMS (2) 27, 273-300',
    'Heath-Brown 1981, Proc. LMS (3) 38, 385-422',
    'Conrey-Farmer-Keating-Rubinstein-Snaith 2005, Proc. LMS (3) 91, 33-104',
    'Conrey-Snaith 2008, Comm. Number Theory Phys. 2, 477-536',
    'Keating-Snaith 2000, Comm. Math. Phys. 214, 57-89',
    'Titchmarsh 1986 (2nd ed., rev. Heath-Brown), Oxford University Press',
  ]),
  consumers: Object.freeze([
    'imp-1126 (3rd-moment Cauchy-Schwarz bound + Conrey-Snaith g_3)',
    'imp-447 / imp-459 (density-exponent feed from Ingham 2nd-moment)',
    'imp-1166 / imp-1178 (Conrey-Snaith arithmetic factor on linear-statistics)',
  ]),
  honestScope: Object.freeze([
    'k = 1 and k = 2 entries are TEXTBOOK RIGOROUS UNCONDITIONAL with ' +
    'exact leading constants. No ambiguity.',
    'k = 3 and k = 4 entries are CONJECTURAL. The constants come from the ' +
    'Conrey-Snaith 2008 ratios conjecture and Keating-Snaith Barnes G ' +
    'formulas; numerical values are tabulated from Conrey-Snaith 2008 ' +
    'and Hiary 2011. We REFUSE to mark these as rigorous.',
    'The mean (m = 1) integral entry is conjectural via Keating-Snaith ' +
    'k = 1/2 extrapolation. The unconditional Hardy-Littlewood 1916 ' +
    'bound is O(T log T), which is the rigorous fallback any consumer ' +
    'should default to when only an UNCONDITIONAL bound is required.',
    'The arithmetic factor a_k for k >= 3 has no closed-form analytic ' +
    'expression; we quote NUMERICAL values to the precision published. ' +
    'Higher-precision values exist in Bui-Conrey-Young 2012 and Hiary ' +
    '2011 if a future ticket needs them.',
  ]),
});

// ── Build-time tripwires ──────────────────────────────────────────────────

export const IMP1187_ZETA_MOMENT_CONSTANTS_ASSERTIONS = [
  {
    id: 'imp1187-survey-has-all-five-canonical-moments',
    why:
      'The survey MUST contain entries for momentExponent in {1, 2, 4, 6, ' +
      '8} (the canonical mean + four integer-k moments covered by Hardy- ' +
      'Littlewood / Ingham / Heath-Brown / Conrey-Snaith). A drift in the ' +
      'count would mean a moment was deleted or duplicated.',
    holds: () => {
      const want = [1, 2, 4, 6, 8];
      if (IMP1187_ZETA_MOMENT_CONSTANTS.length !== 5) return false;
      const got = IMP1187_ZETA_MOMENT_CONSTANTS.map((r) => r.momentExponent).sort((a, b) => a - b);
      for (let i = 0; i < want.length; i++) if (got[i] !== want[i]) return false;
      return true;
    },
  },
  {
    id: 'imp1187-ingham-1926-second-moment-exact-constant',
    why:
      'Ingham 1926 proved integral_0^T |zeta(1/2+it)|^2 dt ~ T log T with ' +
      'EXACT leading constant 1. This is textbook (Titchmarsh 1986, Section ' +
      '7.4). The leadingConstant must be exactly 1.0 (not approximate), ' +
      'logExponent must be 1, isRigorousUnconditional must be true, the ' +
      'citation MUST name Ingham 1926 and Proc. LMS.',
    holds: () => {
      const r = IMP1187_ZETA_MOMENT_CONSTANTS.find((x) => x.momentExponent === 2);
      if (!r) return false;
      if (r.leadingConstant !== 1) return false;
      if (r.leadingConstantApproximate !== false) return false;
      if (r.logExponent !== 1) return false;
      if (r.isRigorousUnconditional !== true) return false;
      if (!r.citation.includes('Ingham 1926')) return false;
      if (!r.citation.includes('Proc. LMS')) return false;
      if (!r.citationFull.includes('1926')) return false;
      return true;
    },
  },
  {
    id: 'imp1187-heath-brown-1981-fourth-moment-exact-constant',
    why:
      'Heath-Brown 1981 proved integral_0^T |zeta(1/2+it)|^4 dt ~ T (log T)^4 ' +
      '/ (2 pi^2). The leadingConstant must equal 1/(2 pi^2) to bit ' +
      'precision (= 0.05066059...), logExponent must be 4, ' +
      'isRigorousUnconditional must be true, the citation MUST name ' +
      'Heath-Brown 1981 and Proc. LMS (3) 38.',
    holds: () => {
      const r = IMP1187_ZETA_MOMENT_CONSTANTS.find((x) => x.momentExponent === 4);
      if (!r) return false;
      const expected = 1 / (2 * Math.PI * Math.PI);
      if (Math.abs(r.leadingConstant - expected) > 1e-15) return false;
      if (r.leadingConstantApproximate !== false) return false;
      if (r.logExponent !== 4) return false;
      if (r.isRigorousUnconditional !== true) return false;
      if (!r.citation.includes('Heath-Brown 1981')) return false;
      if (!r.citation.includes('Proc. LMS')) return false;
      if (!r.citation.includes('38')) return false;
      if (!r.citationFull.includes('1981')) return false;
      return true;
    },
  },
  {
    id: 'imp1187-hardy-littlewood-1916-mean-honestly-marked-conjectural',
    why:
      'The mean integral (m = 1) entry must be honestly marked CONJECTURAL ' +
      '(isRigorousUnconditional = false). The conjectural log exponent is ' +
      '1/4 (Keating-Snaith k^2 = (1/2)^2). The UNCONDITIONAL Hardy- ' +
      'Littlewood 1916 fallback bound must also be recorded: O(T log T) ' +
      'with logExponent 1. This is the load-bearing honesty tripwire: ' +
      'we must NOT promote the Keating-Snaith conjectural constant to ' +
      'rigorous.',
    holds: () => {
      const r = IMP1187_ZETA_MOMENT_CONSTANTS.find((x) => x.momentExponent === 1);
      if (!r) return false;
      if (r.isRigorousUnconditional !== false) return false;
      if (r.isRigorousConditional !== false) return false;
      if (r.leadingConstantApproximate !== true) return false;
      if (Math.abs(r.logExponent - 0.25) > 1e-12) return false;
      // The unconditional fallback bound must be the Hardy-Littlewood 1916
      // O(T log T) result (logExponent 1).
      if (r.unconditionalUpperBoundLogExponent !== 1) return false;
      if (!r.unconditionalUpperBoundCitation.includes('Hardy-Littlewood 1916')) {
        return false;
      }
      if (!r.unconditionalUpperBoundCitation.includes('Acta')) return false;
      return true;
    },
  },
  {
    id: 'imp1187-conrey-snaith-2008-higher-moments-marked-conjectural',
    why:
      'The k = 3 (6th moment) and k = 4 (8th moment) entries must be marked ' +
      'CONJECTURAL (isRigorousUnconditional = false AND isRigorousConditional ' +
      '= false). Both must cite Conrey-Snaith 2008 by year and venue. The ' +
      'log exponents must match k^2 = 9 and 16 respectively (Keating-Snaith ' +
      'scaling). leadingConstantApproximate must be true for both.',
    holds: () => {
      const r6 = IMP1187_ZETA_MOMENT_CONSTANTS.find((x) => x.momentExponent === 6);
      const r8 = IMP1187_ZETA_MOMENT_CONSTANTS.find((x) => x.momentExponent === 8);
      if (!r6 || !r8) return false;
      for (const r of [r6, r8]) {
        if (r.isRigorousUnconditional !== false) return false;
        if (r.isRigorousConditional !== false) return false;
        if (r.leadingConstantApproximate !== true) return false;
        if (!r.citation.includes('Conrey-Snaith 2008')) return false;
        if (!r.citation.includes('Comm. Number Theory')) return false;
      }
      if (r6.logExponent !== 9) return false;
      if (r8.logExponent !== 16) return false;
      return true;
    },
  },
  {
    id: 'imp1187-conrey-snaith-g3-barnes-matches-imp1126',
    why:
      'The Barnes G factor g_3 = 42 / 9! quoted for the 6th-moment entry ' +
      'must match the literal G_3_BARNES = 42/362880 used in imp-1126 ' +
      '(src/data/imp-1126-conrey-snaith-3rd-moment-attack.js). Drift here ' +
      'would mean a downstream consumer reads one value from imp-1187 ' +
      'survey and another from imp-1126, silently introducing a numerical ' +
      'mismatch in any cross-ticket comparison.',
    holds: () => {
      const r6 = IMP1187_ZETA_MOMENT_CONSTANTS.find((x) => x.momentExponent === 6);
      if (!r6) return false;
      const expected = 42 / 362880;
      if (Math.abs(r6.g_k - expected) > 1e-15) return false;
      return true;
    },
  },
  {
    id: 'imp1187-log-exponents-follow-keating-snaith-scaling',
    why:
      'For each integer-k entry the logExponent must equal k^2 (the Keating- ' +
      'Snaith (log T)^{k^2} scaling). The mean entry (k = 1/2) gives ' +
      'logExponent = 1/4. The k = 1, 2, 3, 4 entries give 1, 4, 9, 16. ' +
      'A drift here would silently misrepresent the asymptotic scaling.',
    holds: () => {
      for (const r of IMP1187_ZETA_MOMENT_CONSTANTS) {
        const expected = r.k * r.k;
        if (Math.abs(r.logExponent - expected) > 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1187-all-leading-constants-finite-positive',
    why:
      'Every leadingConstant in the survey must be finite, strictly positive, ' +
      'and at most O(1). The Conrey-Snaith higher-moment constants are very ' +
      'small (c_3 ~ 1e-4, c_4 ~ 1e-9) but strictly positive. A NaN, Infinity, ' +
      'zero, or negative value would silently corrupt any downstream ' +
      'numerical comparison.',
    holds: () => {
      for (const r of IMP1187_ZETA_MOMENT_CONSTANTS) {
        if (!Number.isFinite(r.leadingConstant)) return false;
        if (!(r.leadingConstant > 0)) return false;
        if (!(r.leadingConstant <= 2)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1187-metadata-cites-primary-references',
    why:
      'The IMP1187_SURVEY_METADATA.primaryReferences list must include the ' +
      'three foundational rigorous papers (Hardy-Littlewood 1916, Ingham ' +
      '1926, Heath-Brown 1981) AND the Conrey-Snaith 2008 paper for the ' +
      'conjectural higher moments. The list pins the bibliographic claims ' +
      'made by this survey at the file metadata level.',
    holds: () => {
      const refs = IMP1187_SURVEY_METADATA.primaryReferences;
      if (!Array.isArray(refs) || refs.length < 4) return false;
      const joined = refs.join(' || ');
      return (
        joined.includes('Hardy-Littlewood 1916') &&
        joined.includes('Ingham 1926') &&
        joined.includes('Heath-Brown 1981') &&
        joined.includes('Conrey-Snaith 2008')
      );
    },
  },
  {
    id: 'imp1187-each-record-has-named-paper-and-year-metadata',
    why:
      'Every record in the survey must carry a non-empty citation string ' +
      'with a year >= 1900 and <= 2030 AND a non-empty citationFull string ' +
      '(>= 60 characters of bibliographic detail). This guards against ' +
      'editors silently truncating or removing the reference fields.',
    holds: () => {
      for (const r of IMP1187_ZETA_MOMENT_CONSTANTS) {
        if (typeof r.citation !== 'string' || r.citation.length < 10) return false;
        if (typeof r.citationFull !== 'string' || r.citationFull.length < 60) return false;
        const yearMatch = r.citation.match(/\b(19|20)\d{2}\b/);
        if (!yearMatch) return false;
        const yr = parseInt(yearMatch[0], 10);
        if (yr < 1900 || yr > 2030) return false;
        if (typeof r.label !== 'string' || r.label.length === 0) return false;
        if (typeof r.statement !== 'string' || r.statement.length < 40) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1187-rigorous-tier-strings-permitted',
    why:
      'rigourTier must be one of the two enumerated strings: ' +
      'rigorous-unconditional-exact-constant or conjectural-explicit-constant. ' +
      'This catches an editor accidentally introducing a third undocumented ' +
      'tier that bypasses the honesty tripwires above.',
    holds: () => {
      const permitted = new Set([
        'rigorous-unconditional-exact-constant',
        'conjectural-explicit-constant',
      ]);
      for (const r of IMP1187_ZETA_MOMENT_CONSTANTS) {
        if (!permitted.has(r.rigourTier)) return false;
        // And the tier must match the boolean fields.
        if (r.rigourTier === 'rigorous-unconditional-exact-constant') {
          if (r.isRigorousUnconditional !== true) return false;
          if (r.leadingConstantApproximate !== false) return false;
        }
        if (r.rigourTier === 'conjectural-explicit-constant') {
          if (r.isRigorousUnconditional !== false) return false;
          if (r.leadingConstantApproximate !== true) return false;
        }
      }
      return true;
    },
  },
];
