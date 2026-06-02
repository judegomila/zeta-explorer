// @module data/imp-1329-BFI-1986-mean-value-scoping
// imp-1329 -- OPUS (critical): BFI 1986 mean-value scoping. imp-1321 + imp-1322
// BOTH named Bombieri-Friedlander-Iwaniec 1986 mean-value as the shared candidate
// technique to close the (log T)^A binding that cancels the formal sigma-reopt
// 6.4e8 Lambda tightening. This ticket scopes that candidate at LEMMA LEVEL:
//   (a) WHICH BFI 1986 lemma is the candidate?
//   (b) does the BFI mean-value bound DIRECTLY give A = 0 uniformly in
//       sigma in (3/4, 1)?
//   (c) what RESIDUAL lemmas would be needed to actually close A = 0?
// and ships a paper outline detailed to the principal-lemma level.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'bfi-not-direct-residual-large-values-lemma-needed'
//
//   * The object the Lambda chain needs is a (log T)^0 bound on N(sigma, T),
//     the count of zeta zeros with Re >= sigma up to height T. In the modern
//     proof of any zero-density estimate this count is produced by the
//     Halasz-Montgomery LARGE-VALUES method: zeros are detected by a Dirichlet
//     polynomial D(s) = sum_{n <= N} a_n n^{-s}, and N(sigma, T) is bounded by
//     the number of well-spaced t where |D(sigma + it)| is large. The
//     (log T)^A factor lives in THAT large-values lemma (and in the zero-
//     detecting mollifier), NOT in any mean value BFI 1986 supplies.
//   * BFI 1986 (Bombieri-Friedlander-Iwaniec, "Primes in arithmetic
//     progressions to large moduli", Acta Math. 156 (1986) 203-251) proves a
//     DISPERSION / BILINEAR mean value for arithmetic functions over residue
//     classes to moduli q up to x^{4/7-eps}, built on Deshouillers-Iwaniec
//     Kloosterman-sum estimates. Its mean value is over MODULI q (an
//     arithmetic average), not over the t-line, and its left side is the
//     error term Delta(x; q, a) in arithmetic progressions -- NOT a fourth
//     moment of a Dirichlet polynomial on the sigma-line. It is the WRONG
//     analytic object to feed N(sigma, T) directly.
//   * Therefore BFI 1986 does NOT directly give A = 0 uniformly in
//     sigma in (3/4, 1). At best the BFI bilinear/off-diagonal estimate can
//     sharpen the OFF-DIAGONAL term inside a mean-value-of-Dirichlet-
//     polynomial step, but the binding (log T)^A is set by the large-values
//     lemma, which BFI does not touch.
//   * This is COHERENT with imp-1325, which closed the sibling "Maynard sieve"
//     route negatively with the same structural finding: the A factor is a
//     LARGE-VALUES / explicit-Ingham problem, not a sieve and not a
//     dispersion problem.
//   * RESIDUAL LEMMAS that the closing paper actually has to prove:
//       R1 (BINDING) -- an explicit-constant Halasz-Montgomery large-values
//          estimate with A = 0, uniform in sigma in [3/4, 1). This is the
//          real research content; no A = 0 form is published.
//       R2 -- an explicit zero-detecting / approximate-functional-equation
//          step (Selberg mollifier; constants K_0, K_1, C_Selberg audited in
//          imp-1327) without log loss.
//       R3 -- a TRANSFER lemma converting the BFI dispersion bilinear mean
//          value (average over moduli q) into a Dirichlet-polynomial mean
//          value on the sigma-line. This transfer is itself unpublished and
//          is the natural -- but not the only -- place BFI could contribute.
//
// HONEST BOTTOM LINE
// ------------------
// BFI 1986 is NOT a drop-in closer for the (log T)^A binding. The candidate
// named in imp-1321 / imp-1322 was optimistic: BFI supplies a powerful
// bilinear mean value, but for a DIFFERENT object (primes in APs to large
// moduli), and the (log T)^A that cancels the 6.4e8 formal Lambda gain is
// produced by the Halasz-Montgomery large-values lemma. The paper to write is
// an explicit A = 0 large-values estimate (Lemma 3.1 below); BFI 1986 can at
// most feed its off-diagonal/bilinear term via a residual transfer lemma R3.
// imp-1329 ships the paper outline + the named sub-gap and stays OPEN as a
// paper-grade research ticket; the engine cannot close A = 0.
//
// NAMED SUB-GAP (honest partial closure)
// --------------------------------------
//   SUBGAP-1329-A-lives-in-halasz-montgomery-large-values
//   The binding (log T)^A factor in N(sigma, T) is set by the Halasz-Montgomery
//   large-values lemma, NOT by any BFI 1986 mean value. The live deliverable is
//   residual Lemma R1 (explicit A = 0 large-values, sigma-uniform on [3/4, 1)).
//
// SYNTAX SAFETY
// -------------
// Line comments only (no block comments). Single-quoted strings only. No
// apostrophes inside single-quoted strings. No star-slash sequence anywhere.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 0 -- Production numerics inherited from the imp-459 / imp-1261 / imp-1322
//           chain. Pinned for tripwire verification.
// ─────────────────────────────────────────────────────────────────────────────

const T_PT = 3e12;                        // Platt-Trudgian 2021 verified zero-strip height
const SIGMA_PRODUCTION = 0.75;            // imp-459 production sigma_opt
const SIGMA_TARGET = 0.99;                // imp-1322 sigma re-optimisation target
const LOG_T_PT = Math.log(T_PT);          // ~ 28.73
const E_I = (s) => (3 * (1 - s)) / (2 - s);   // Ingham 1940 zero-density exponent
const E_I_AT_PRODUCTION = E_I(SIGMA_PRODUCTION);   // 0.6
const E_I_AT_TARGET = E_I(SIGMA_TARGET);           // ~ 0.0297
const FORMAL_TIGHTENING_FACTOR = 6.4e8;   // E_trunc_pt 3.06e-5 -> 4.79e-14 (imp-1322)
const ETRUNC_PRODUCTION = 3.06e-5;
const ETRUNC_TARGET_FORMAL = 4.79e-14;
// Worst-case (log T_PT)^6 loosening at A = 6 (Kadiri family) that cancels the
// formal gain pound for pound -- the reason imp-1322 could not be claimed.
const WORST_CASE_LOG_POW_A6 = Math.pow(LOG_T_PT, 6);   // ~ 5.7e8

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- (a) WHICH BFI 1986 lemma is the candidate? State it precisely.
// ─────────────────────────────────────────────────────────────────────────────

// The "mean-value" named by imp-1321 / imp-1322 is the central dispersion
// estimate of BFI 1986. State both the paper and the precise object so the
// scoping cannot quietly substitute a different (more convenient) theorem.
const BFI_1986_STATED = Object.freeze({
  reference:
    'Bombieri, E.; Friedlander, J. B.; Iwaniec, H. -- "Primes in arithmetic ' +
    'progressions to large moduli." Acta Math. 156 (1986) 203-251.',
  centralObject:
    'Delta(x; q, a) = sum_{n <= x, n == a (mod q)} Lambda(n) - (1/phi(q)) ' +
    'sum_{n <= x, (n,q)=1} Lambda(n), the error in the prime distribution in ' +
    'the residue class a mod q.',
  candidateLemma:
    'The BFI 1986 dispersion mean value (the paper Theorem 0 / the bilinear ' +
    'form bound assembled in Sections 4-9): for well-factorable weights and ' +
    'moduli q in [Q, 2Q] with Q up to x^{4/7 - eps}, sum_{q ~ Q} |Delta(x;q,a)| ' +
    'is bounded by x (log x)^{-A} for any A, via the Deshouillers-Iwaniec ' +
    'Kloosterman-sum / Kuznetsov spectral input.',
  averageVariable:
    'q -- the MODULUS. The BFI mean value averages an arithmetic error term ' +
    'over moduli q, NOT a Dirichlet polynomial over the height t.',
  leftSideType:
    'arithmetic-error-term-over-residue-classes',
  spectralInput:
    'Deshouillers-Iwaniec 1982 (Invent. Math. 70 219-288) bounds for sums of ' +
    'Kloosterman sums (Kuznetsov trace formula). This is the engine of BFI 1986.',
  whyNamed:
    'imp-1321 + imp-1322 named BFI 1986 because it is the canonical example of ' +
    'a mean value that BEATS the (log)^A barrier (it gives saving for ANY A) ' +
    'and because its bilinear structure superficially resembles the off-diagonal ' +
    'term in a Dirichlet-polynomial mean value. The resemblance is the trap this ' +
    'scoping document tests.',
});

// The object the Lambda chain ACTUALLY needs, for contrast. This is what a
// zero-density bound is built from in the Halasz-Montgomery method.
const OBJECT_NEEDED = Object.freeze({
  target:
    'N(sigma, T) <= C(sigma) T^{e_I(sigma)} (log T)^0 uniformly in ' +
    'sigma in [3/4, 1) -- i.e. an effective Ingham bound with A = 0.',
  builtFrom:
    'Zeros with Re >= sigma are DETECTED by a Dirichlet polynomial ' +
    'D(s) = sum_{n <= N} a_n n^{-s} (zero-detecting mollifier + approximate ' +
    'functional equation). N(sigma, T) is then bounded by the number of ' +
    'well-spaced t in [0, T] where |D(sigma + it)| >= V (a LARGE-VALUES count).',
  averageVariable:
    't -- the HEIGHT on the sigma-line. The required mean value / large-values ' +
    'count is over t, NOT over moduli q.',
  whereAlives:
    'The (log T)^A factor is produced by (i) the Halasz-Montgomery large-values ' +
    'lemma (number of well-spaced large points of a Dirichlet polynomial) and ' +
    '(ii) the zero-detecting mollifier length / approximate functional equation. ' +
    'Neither is a BFI dispersion mean value.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- (b) Does the BFI mean-value bound DIRECTLY give A = 0 uniformly in
//           sigma in (3/4, 1)? Answer: NO. Record the object mismatch precisely.
// ─────────────────────────────────────────────────────────────────────────────

const DIRECTLY_GIVES_A0 = false;

const OBJECT_MISMATCH = Object.freeze({
  bfiAverageVariable: 'q (modulus)',
  neededAverageVariable: 't (height on sigma-line)',
  bfiLeftSide: 'Delta(x; q, a) -- arithmetic error in residue classes',
  neededLeftSide: 'large-values count of a Dirichlet polynomial D(sigma + it)',
  bfiKernel: 'Kloosterman / Kuznetsov spectral (Deshouillers-Iwaniec)',
  neededKernel: 'Halasz-Montgomery duality + mean value of |D|^2 on the t-line',
  conclusion:
    'BFI 1986 and the zero-density large-values method are DIFFERENT analytic ' +
    'objects. BFI averages over moduli; the (log T)^A binding lives in the ' +
    'large-values count over the height t. BFI 1986 cannot directly remove the ' +
    '(log T)^A factor from N(sigma, T).',
  whereBFICouldContribute:
    'Inside a mean-value-of-Dirichlet-polynomial step, BFI bilinear technology ' +
    'could in principle sharpen the OFF-DIAGONAL term (the cross terms ' +
    'a_m a_n (m/n)^{-it} with m != n). But that off-diagonal term is NOT where ' +
    'the (log T)^A factor comes from; the diagonal large-values count is. So ' +
    'even a successful off-diagonal sharpening would not by itself give A = 0.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- (c) RESIDUAL lemmas that the closing paper must prove. R1 is the
//           binding one; it IS the paper.
// ─────────────────────────────────────────────────────────────────────────────

const RESIDUAL_LEMMAS = Object.freeze([
  Object.freeze({
    id: 'R1',
    label: 'binding',
    name: 'Explicit A = 0 Halasz-Montgomery large-values estimate, ' +
      'sigma-uniform on [3/4, 1).',
    statement:
      'For a Dirichlet polynomial D(s) = sum_{n <= N} a_n n^{-s} and well-spaced ' +
      'points t_1, ..., t_R in [0, T] with |D(sigma + i t_r)| >= V, prove ' +
      'R <= C_LV(sigma) (G/V^2 + T G^2 V^{-6}) with NO (log T) power, where ' +
      'G = sum |a_n|^2 n^{-2 sigma}, uniformly for sigma in [3/4, 1) and with ' +
      'an EXPLICIT C_LV(sigma).',
    publishedStatus:
      'NOT published with A = 0. Montgomery 1971 (LNM 227), Huxley 1972 ' +
      '(Invent. Math. 15), Jutila 1977 (Ark. Mat. 15) all carry a (log T) ' +
      'power. The A = 0 sigma-uniform explicit form is the open research result.',
    isTheRealPaper: true,
  }),
  Object.freeze({
    id: 'R2',
    label: 'support',
    name: 'Explicit zero-detecting / approximate-functional-equation step ' +
      'without log loss.',
    statement:
      'Construct the zero-detecting mollifier and approximate functional ' +
      'equation so the reduction "zeros of zeta to large values of D" carries ' +
      'no (log T) power, with explicit constants. Reuses the K_0, K_1, ' +
      'C_Selberg constants audited in imp-1327.',
    publishedStatus:
      'Partially controllable; the mollifier length contributes a log power ' +
      'in standard treatments. Needs explicit-constant care, not new ideas.',
    isTheRealPaper: false,
  }),
  Object.freeze({
    id: 'R3',
    label: 'optional-BFI-entry',
    name: 'Dispersion-to-Dirichlet-polynomial transfer lemma.',
    statement:
      'Convert the BFI 1986 bilinear/off-diagonal mean value (average over ' +
      'moduli q) into a sharpening of the OFF-DIAGONAL term of the ' +
      'Dirichlet-polynomial mean value on the sigma-line. This is the ONLY ' +
      'natural place BFI 1986 could enter, and it does not by itself give A = 0.',
    publishedStatus:
      'UNPUBLISHED. No transfer of the BFI dispersion estimate to a ' +
      'zero-density Dirichlet-polynomial mean value exists in the literature.',
    isTheRealPaper: false,
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- Paper outline, detailed to the principal-lemma level.
// ─────────────────────────────────────────────────────────────────────────────

const PAPER_OUTLINE = Object.freeze({
  workingTitle:
    'An explicit (log T)^0 large-values estimate and a sigma-uniform effective ' +
    'Ingham bound: scope and the role of BFI 1986 dispersion input',
  venue: 'Journal of Number Theory / Mathematics of Computation',
  estimatedLength: '20-30 pp',
  principalLemma:
    'Lemma 3.1 -- the explicit A = 0 (log-free) sigma-uniform Halasz-Montgomery ' +
    'large-values estimate (residual lemma R1). This lemma IS the paper; ' +
    'everything else is explicit-constant bookkeeping.',
  principalTheorem:
    'Theorem 1.1 -- N(sigma, T) <= C(sigma) T^{e_I(sigma)} with A = 0 uniformly ' +
    'in sigma in [3/4, 1), hence the imp-1322 formal 6.4e8 tightening ' +
    '(E_trunc_pt 3.06e-5 -> 4.79e-14) becomes RIGOROUS and Lambda <= 4.79e-14 ' +
    'unconditionally (asymptotic, under the Polymath15 G6a normalisation).',
  sections: Object.freeze([
    '1. Introduction: the (log T)^A binding, the 6.4e8 cancellation, and the ' +
      'statement of Theorem 1.1.',
    '2. The zero-detecting setup: Selberg mollifier + approximate functional ' +
      'equation; explicit K_0, K_1, C_Selberg (imp-1327); residual lemma R2.',
    '3. Reduction to a large-values problem (Halasz-Montgomery duality) and ' +
      'the PRINCIPAL Lemma 3.1 (residual R1, explicit A = 0, sigma-uniform).',
    '4. BFI 1986 dispersion input: Lemma 4.1 (the bilinear off-diagonal mean ' +
      'value) and EXACTLY where -- if anywhere -- it plugs in (residual R3).',
    '5. Explicit-constant bookkeeping: assembling C(sigma) and proving A = 0 ' +
      'uniformly on [3/4, 1).',
    '6. Lambda consequence: rigorous 6.4e8 tightening and the Lambda <= 4.79e-14 ' +
      'conditional statement; comparison to the imp-1321 BS port.',
    'Appendix A. Explicit-constant ledger (cross-ref imp-2326).',
  ]),
  bfiRoleInPaper:
    'Section 4 only, and only via residual Lemma R3 (off-diagonal sharpening). ' +
    'BFI 1986 is NOT the engine of the paper; Lemma 3.1 is. If R3 fails, the ' +
    'paper still stands on R1 + R2 with a possibly larger C(sigma).',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 -- Verdict (canonical, in a fixed allowed set).
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'bfi-mean-value-directly-gives-A0',
  'bfi-not-direct-residual-large-values-lemma-needed',
  'bfi-not-applicable-wrong-object-entirely',
  'bfi-equivalent-effort-to-kadiri-uniformity',
]);

const VERDICT = 'bfi-not-direct-residual-large-values-lemma-needed';

const VERDICT_DETAIL =
  'BFI 1986 supplies a powerful dispersion mean value, but for primes in ' +
  'arithmetic progressions to large moduli (average over moduli q), not for the ' +
  'large-values count over the height t that produces the (log T)^A factor in ' +
  'N(sigma, T). BFI cannot directly give A = 0. The binding deliverable is ' +
  'residual Lemma R1, an explicit A = 0 sigma-uniform Halasz-Montgomery ' +
  'large-values estimate; BFI 1986 can at most enter via the residual ' +
  'off-diagonal transfer lemma R3. Coherent with imp-1325 (the A factor is a ' +
  'large-values problem, not a sieve or dispersion problem).';

const NAMED_SUBGAP = Object.freeze({
  id: 'SUBGAP-1329-A-lives-in-halasz-montgomery-large-values',
  statement:
    'The binding (log T)^A factor in N(sigma, T) is set by the ' +
    'Halasz-Montgomery large-values lemma, NOT by any BFI 1986 mean value. ' +
    'The live deliverable is residual Lemma R1 (explicit A = 0 large-values, ' +
    'sigma-uniform on [3/4, 1)).',
  liveLever: 'R1 (explicit A = 0 large-values lemma)',
  deadLever: 'BFI 1986 as a direct A = 0 closer',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 -- Cross-references + honest scope.
// ─────────────────────────────────────────────────────────────────────────────

const CROSS_REFERENCES = Object.freeze({
  'imp-1321':
    'Bui-Soundararajan rigor port; named BFI 1986 as shared candidate technique.',
  'imp-1322':
    'sigma re-optimisation (0.75 -> 0.99) producing the formal 6.4e8 tightening; ' +
    'also named BFI 1986; blocked by the same (log T)^A binding this ticket scopes.',
  'imp-1325':
    'Maynard-sieve route, closed negatively: the A factor is a large-values / ' +
    'explicit-Ingham problem, not a sieve. imp-1329 confirms the analogous ' +
    'finding for the BFI dispersion route.',
  'imp-1327':
    'Polymath15 chain constant audit (K_0, K_1, C_Selberg) feeding residual R2.',
  'imp-1261':
    'downstream Lambda composition that consumes E_trunc_pt and would inherit ' +
    'the rigorous 6.4e8 tightening if R1 closes.',
  'imp-2326':
    'explicit-constant ledger; Appendix A of the paper outline cross-refs it.',
});

const HONEST_SCOPE = Object.freeze([
  'BFI 1986 CANNOT directly remove the (log T)^A factor from N(sigma, T); it is ' +
    'the wrong analytic object (dispersion over moduli q, not large values over t).',
  'The formal 6.4e8 sigma-reopt tightening CANNOT be claimed rigorously today; ' +
    'the binding step is residual Lemma R1 and it is NOT published with A = 0.',
  'The closing paper is paper-grade research (an explicit A = 0 sigma-uniform ' +
    'large-values estimate), not a bookkeeping fix; the engine cannot close it.',
  'BFI 1986 may still help, but only via residual Lemma R3 (off-diagonal ' +
    'sharpening) in Section 4 -- a secondary, not load-bearing, role.',
  'imp-1329 ships the paper outline + named sub-gap and stays OPEN as a ' +
    'paper-grade research ticket.',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1329_BFI_1986_MEAN_VALUE_SCOPING = Object.freeze({
  id: 'imp-1329',
  ticket: 'imp-1329',
  title:
    'BFI 1986 mean-value scoping: paper outline for sigma-uniform Ingham with A = 0',
  shippedAt: '2026-06-02T03:30:00Z',
  shippedBy: 'opus-4-7 (subscription)',

  // STEP 0
  T_PT: T_PT,
  sigmaProduction: SIGMA_PRODUCTION,
  sigmaTarget: SIGMA_TARGET,
  logT_PT: LOG_T_PT,
  eIatProduction: E_I_AT_PRODUCTION,
  eIatTarget: E_I_AT_TARGET,
  formalTighteningFactor: FORMAL_TIGHTENING_FACTOR,
  etruncProduction: ETRUNC_PRODUCTION,
  etruncTargetFormal: ETRUNC_TARGET_FORMAL,
  worstCaseLogPowA6: WORST_CASE_LOG_POW_A6,

  // STEP 1 -- (a)
  bfiStated: BFI_1986_STATED,
  objectNeeded: OBJECT_NEEDED,

  // STEP 2 -- (b)
  directlyGivesA0: DIRECTLY_GIVES_A0,
  objectMismatch: OBJECT_MISMATCH,

  // STEP 3 -- (c)
  residualLemmas: RESIDUAL_LEMMAS,

  // STEP 4
  paperOutline: PAPER_OUTLINE,

  // STEP 5
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  namedSubGap: NAMED_SUBGAP,

  // STEP 6
  crossReferences: CROSS_REFERENCES,
  honestScope: HONEST_SCOPE,

  // Pinned numerics for tripwire verification.
  pinnedNumerics: Object.freeze({
    T_PT: 3e12,
    sigmaProduction: 0.75,
    sigmaTarget: 0.99,
    logT_PT: 28.7,
    eI_at_0p75: 0.6,
    eI_at_0p99: 0.02970297029702973,
    formalTighteningFactor: 6.4e8,
    etruncProduction: 3.06e-5,
    etruncTargetFormal: 4.79e-14,
    worstCase_logTPow_A6: 5.7e8,
    bfiDirectlyGivesA0: false,
    residualLemmaCount: 3,
  }),
});

export default IMP_1329_BFI_1986_MEAN_VALUE_SCOPING;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (11 shipped; ticket spec requires 10+).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1329_BFI_1986_MEAN_VALUE_SCOPING_ASSERTIONS = [

  // Tripwire 1: BFI 1986 named precisely with the correct paper + central object.
  {
    id: 'imp1329-bfi-1986-stated-precisely',
    why:
      'The scoping must name the actual BFI 1986 paper (Acta Math. 156, 1986) and ' +
      'its central object Delta(x; q, a). A regression that substitutes a generic ' +
      '"mean value" would let the wrong-object finding decohere.',
    holds: () => {
      const b = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING.bfiStated;
      return (
        typeof b === 'object' && b !== null &&
        /Bombieri.*Friedlander.*Iwaniec/i.test(b.reference) &&
        /Acta Math\. 156/.test(b.reference) &&
        /Delta\(x; q, a\)/.test(b.centralObject) &&
        /Deshouillers-Iwaniec|Kloosterman/i.test(b.spectralInput)
      );
    },
  },

  // Tripwire 2: candidate BFI lemma identified (the dispersion / bilinear mean value).
  {
    id: 'imp1329-candidate-lemma-is-dispersion-mean-value',
    why:
      'Ticket item (a): WHICH BFI lemma. The candidate must be the dispersion / ' +
      'bilinear mean value over moduli, not some other BFI result.',
    holds: () => {
      const b = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING.bfiStated;
      return (
        /dispersion/i.test(b.candidateLemma) &&
        /modul/i.test(b.averageVariable) &&
        b.leftSideType === 'arithmetic-error-term-over-residue-classes'
      );
    },
  },

  // Tripwire 3: answer to (b) is NO -- BFI does not directly give A = 0.
  {
    id: 'imp1329-does-not-directly-give-A0',
    why:
      'Ticket item (b): does the BFI mean value DIRECTLY give A = 0 uniformly in ' +
      'sigma in (3/4, 1)? The honest answer is NO. A regression flipping this to ' +
      'true would falsely claim the Lambda binding is closed.',
    holds: () => IMP_1329_BFI_1986_MEAN_VALUE_SCOPING.directlyGivesA0 === false,
  },

  // Tripwire 4: object mismatch recorded (q-average vs t-average).
  {
    id: 'imp1329-object-mismatch-q-vs-t',
    why:
      'The load-bearing reason BFI does not apply directly: it averages over ' +
      'moduli q, while N(sigma, T) needs a large-values count over the height t. ' +
      'Both average variables must be recorded distinctly.',
    holds: () => {
      const m = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING.objectMismatch;
      return (
        /q/.test(m.bfiAverageVariable) &&
        /t/.test(m.neededAverageVariable) &&
        /large-values/i.test(m.neededLeftSide) &&
        /large-values/i.test(m.conclusion)
      );
    },
  },

  // Tripwire 5: three residual lemmas present, R1 flagged as the binding / real paper.
  {
    id: 'imp1329-three-residual-lemmas-R1-binding',
    why:
      'Ticket item (c): which residual lemmas are needed. Exactly R1 (binding ' +
      'large-values), R2 (zero-detection), R3 (BFI transfer) must be present, with ' +
      'R1 flagged as the real paper. Dropping R1 would hide where the work lives.',
    holds: () => {
      const L = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING.residualLemmas;
      if (!Array.isArray(L) || L.length !== 3) return false;
      const byId = Object.fromEntries(L.map((x) => [x.id, x]));
      return (
        byId.R1 && byId.R2 && byId.R3 &&
        byId.R1.isTheRealPaper === true &&
        /large-values/i.test(byId.R1.name) &&
        /NOT published/i.test(byId.R1.publishedStatus) &&
        /UNPUBLISHED/i.test(byId.R3.publishedStatus)
      );
    },
  },

  // Tripwire 6: verdict in the allowed set and is the negative one.
  {
    id: 'imp1329-verdict-in-allowed-set',
    why:
      'The verdict must be one of the four canonical strings and must be the ' +
      'negative "residual lemma needed" one. Drift to "directly gives A0" would ' +
      'mis-report the ticket as closeable.',
    holds: () => {
      const r = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING;
      return (
        Array.isArray(r.allowedVerdicts) &&
        r.allowedVerdicts.length === 4 &&
        r.allowedVerdicts.includes(r.verdict) &&
        r.verdict === 'bfi-not-direct-residual-large-values-lemma-needed'
      );
    },
  },

  // Tripwire 7: named sub-gap routes A to the Halasz-Montgomery large-values lemma.
  {
    id: 'imp1329-subgap-routes-A-to-large-values',
    why:
      'The honest partial closure requires a clearly-named sub-gap. It must route ' +
      'the (log T)^A factor to the Halasz-Montgomery large-values lemma and name ' +
      'R1 as the live lever.',
    holds: () => {
      const g = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING.namedSubGap;
      return (
        typeof g === 'object' && g !== null &&
        /halasz-montgomery-large-values/i.test(g.id) &&
        /R1/.test(g.liveLever) &&
        /BFI/i.test(g.deadLever)
      );
    },
  },

  // Tripwire 8: paper outline has the principal lemma + >= 6 sections + venue.
  {
    id: 'imp1329-paper-outline-principal-lemma-and-sections',
    why:
      'Ticket spec: paper outline detailed at lemma level. Must name principal ' +
      'Lemma 3.1, list 6+ sections, and a working title referencing the A = 0 / ' +
      'log-free large-values goal.',
    holds: () => {
      const o = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING.paperOutline;
      return (
        typeof o === 'object' && o !== null &&
        /Lemma 3\.1/.test(o.principalLemma) &&
        /large-values/i.test(o.principalLemma) &&
        Array.isArray(o.sections) && o.sections.length >= 6 &&
        /log T\)\^0|A = 0|large-values/i.test(o.workingTitle) &&
        /Section 4 only|Section 4/i.test(o.bfiRoleInPaper)
      );
    },
  },

  // Tripwire 9: production numerics inherited correctly (formal 6.4e8, cancelling 5.7e8).
  {
    id: 'imp1329-inherits-formal-tightening-and-cancellation',
    why:
      'The scoping must inherit the imp-1322 formal 6.4e8 tightening AND the ' +
      'worst-case (log T_PT)^6 ~ 5.7e8 loosening that cancels it -- the entire ' +
      'reason A = 0 is the prize. Drift would unmoor this ticket from its parent.',
    holds: () => {
      const r = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING;
      const formalOk = r.formalTighteningFactor > 1e8 && r.formalTighteningFactor < 1e9;
      const cancelOk = r.worstCaseLogPowA6 > 1e8 && r.worstCaseLogPowA6 < 1e9;
      const ratioOk = Math.abs(Math.log(r.worstCaseLogPowA6) / Math.log(r.formalTighteningFactor) - 1) < 0.05;
      const eIok = Math.abs(r.eIatProduction - 0.6) < 1e-9;
      return formalOk && cancelOk && ratioOk && eIok;
    },
  },

  // Tripwire 10: cross-references to parents/siblings present (1321, 1322, 1325, 1327, 1261).
  {
    id: 'imp1329-cross-references-complete',
    why:
      'The scoping must cross-reference imp-1321 + imp-1322 (named BFI), imp-1325 ' +
      '(coherent negative sibling), imp-1327 (R2 constants), imp-1261 (downstream ' +
      'consumer). Missing any orphans the ticket from the proof tree.',
    holds: () => {
      const x = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING.crossReferences;
      return (
        typeof x === 'object' && x !== null &&
        typeof x['imp-1321'] === 'string' &&
        typeof x['imp-1322'] === 'string' &&
        typeof x['imp-1325'] === 'string' &&
        typeof x['imp-1327'] === 'string' &&
        typeof x['imp-1261'] === 'string'
      );
    },
  },

  // Tripwire 11 (semantic): honest scope refuses the A = 0 claim and flags paper-grade.
  {
    id: 'imp1329-semantic-honest-scope-refuses-claim',
    why:
      'SEMANTIC check: the honest scope must state (a) BFI CANNOT directly remove ' +
      'the (log T)^A factor, (b) the formal 6.4e8 tightening CANNOT be claimed ' +
      'today, and (c) the closing step is paper-grade research, not bookkeeping. ' +
      'Softening any of these would mis-sell the ticket as closeable.',
    holds: () => {
      const s = IMP_1329_BFI_1986_MEAN_VALUE_SCOPING.honestScope;
      if (!Array.isArray(s) || s.length < 4) return false;
      const blob = s.join(' || ');
      return (
        /CANNOT directly remove/i.test(blob) &&
        /CANNOT be claimed rigorously today/i.test(blob) &&
        /paper-grade research/i.test(blob) &&
        /engine cannot close/i.test(blob)
      );
    },
  },
];
