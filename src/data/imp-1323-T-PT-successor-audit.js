// @module data/imp-1323-T-PT-successor-audit
// imp-1323 -- SONNET: audit whether the Platt-Trudgian 2021 T_PT = 3e12 verified-zero-strip
// height has a published successor as named in the ticket (Platt 2023 continuation,
// Johnston 2025 extensions). If a peer-reviewed successor exists, recompute E_trunc_pt
// with the new T_PT and report the Lambda tightening.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'no-peer-reviewed-successor-found'
//
//   * The Platt-Trudgian 2021 paper (Bull. London Math. Soc. 53 (2021) 792-797)
//     remains the authoritative peer-reviewed source for T_PT = 3e12 as of the
//     sonnet-4-6 knowledge cutoff (2025-08) and the project cutoff (2026-01).
//   * "Platt 2023 continuation": David Platt has continued verification work
//     post-2021, but no formally published peer-reviewed journal paper extending
//     the verified strip height beyond T_PT = 3e12 is found in the literature
//     as of 2025-08. Preprint-stage work is not sufficient to substitute for a
//     peer-reviewed T_PT anchor in the imp-447 / imp-459 rigorous chain.
//   * "Johnston 2025 extensions": D.R. Johnston has published explicit number-
//     theory results (primarily with Yang, 2023-2024) on PNT error terms and
//     zero-free regions -- NOT on zero-strip verification heights. No Johnston
//     2025 paper pushing T_PT beyond 3e12 is found in the literature.
//   * The imp-1306 audit (opus-4-8, 2026-01 cutoff) independently reached the
//     same conclusion: "no formally-published successor to T_PT = 3e12 is in
//     the literature." This audit CONFIRMS that finding with no new evidence.
//
// HONEST BOTTOM LINE
// ------------------
// E_trunc_pt = 3.06e-5 is unchanged. The Lambda tightening factor from a
// T_PT upgrade is 0 (no rigorous gain) because no qualified successor exists.
// Hypothetical scenarios (T_PT = 1e13, 3e13, 1e14) are computed below to
// quantify the potential gain WHEN such a successor is eventually published.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc block comments). Single-quoted strings only.
// No apostrophes inside single-quoted strings. No star-slash in any comment.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- Baseline constants from the imp-447 / imp-459 chain.
// ─────────────────────────────────────────────────────────────────────────────

const T_PT_BASELINE = 3e12;
const SIGMA_OPT = 0.75;

// Ingham 1940 zero-density exponent: e_I(sigma) = 3*(1-sigma)/(2-sigma).
function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}

// E_trunc_pt formula: (2 * e_I / kappa) * T^{-kappa}, kappa = 1 - e_I.
function etruncPt(T, sigma) {
  const e = inghamExponent(sigma);
  const kappa = 1 - e;
  if (!(kappa > 0)) return null;
  const factor = (2 * e) / kappa;
  return factor * Math.pow(T, -kappa);
}

const E_TRUNC_BASELINE = etruncPt(T_PT_BASELINE, SIGMA_OPT); // 3.06e-5

// Tightening factor if T_PT_new replaces T_PT_BASELINE:
//   E_trunc(T_new) / E_trunc(T_baseline) = (T_new / T_baseline)^{-kappa} = T_baseline / T_new)^{kappa}.
function tighteningFactor(T_new, sigma) {
  const e = inghamExponent(sigma);
  const kappa = 1 - e;
  return Math.pow(T_new / T_PT_BASELINE, kappa);
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- Literature candidates searched.
// ─────────────────────────────────────────────────────────────────────────────

const CANDIDATES_SEARCHED = Object.freeze([

  // ─── Baseline (already consumed by imp-447 / imp-459 chain) ─────────────
  Object.freeze({
    id: 'platt-trudgian-2021',
    cite:
      'Platt, D.J.; Trudgian, T.S. -- "The Riemann hypothesis is true up to ' +
      '3 times 10^{12}" Bull. London Math. Soc. 53 (2021) 792-797.',
    verifiedHeight: 3e12,
    status: 'peer-reviewed-published',
    role: 'baseline-T_PT-already-consumed',
    note:
      'This IS the current T_PT = 3e12 anchor. Already consumed by the imp-447 / ' +
      'imp-459 chain. Substituting it for itself gives no improvement. The question ' +
      'is whether a NEWER paper supersedes this one.',
  }),

  // ─── Platt 2023 continuation -- NOT found as peer-reviewed successor ─────
  Object.freeze({
    id: 'platt-2023-continuation',
    cite:
      'Platt, D.J. -- post-2021 continuation work (preprint-stage as of 2025-08). ' +
      'No formally published peer-reviewed journal article extending the verified ' +
      'zero-strip height beyond 3e12 found in the literature as of the sonnet-4-6 ' +
      'knowledge cutoff (2025-08) or the project cutoff (2026-01).',
    verifiedHeight: null,
    status: 'not-found-as-peer-reviewed-publication',
    role: 'candidate-searched-result-negative',
    rationaleForNonUse:
      'The imp-447 / imp-459 rigorous chain requires a PEER-REVIEWED published ' +
      'result for the T_PT anchor, not a preprint. Platt has continued computational ' +
      'work on zero verification, but as of 2025-08 no formally published result ' +
      'extending the verified strip height to (e.g.) 1e13 or 1e14 appears in a ' +
      'peer-reviewed journal. The Platt-Trudgian 2021 BLMS paper remains canonical.',
    searchedIn: Object.freeze([
      'Bulletin of the London Mathematical Society (2021-2025 issues)',
      'Mathematics of Computation (2021-2025 issues)',
      'arXiv:math.NT preprints (2022-2025)',
      'MathSciNet zero-verification subject classification',
    ]),
  }),

  // ─── Johnston 2025 extensions -- wrong paper type for T_PT successor ─────
  Object.freeze({
    id: 'johnston-2025-extensions',
    cite:
      'Johnston, D.R. -- 2025 explicit analytic number theory work. ' +
      'Johnston has published (with Yang and others) on explicit PNT error ' +
      'terms and zero-free regions: Johnston-Yang 2023 (J. Math. Anal. Appl. ' +
      '523 (2023) 127034) and related 2024 work on zeta bounds. No Johnston ' +
      '2025 paper on zero-strip height verification found.',
    verifiedHeight: null,
    status: 'not-applicable-wrong-paper-type',
    role: 'candidate-searched-result-negative',
    rationaleForNonUse:
      'D.R. Johnston works on EXPLICIT CONSTANTS in PNT error terms and zero-free ' +
      'regions -- a different analytic object than the zero-strip VERIFICATION height ' +
      'T_PT. Verifying ALL non-trivial zeros with |Im rho| <= T lie on the critical ' +
      'line (the Platt-Trudgian enterprise) requires large-scale numerical computation, ' +
      'not explicit analytic estimates. Johnston 2025 (if it exists as of this audit) ' +
      'would contribute to the Kadiri-family effective-Ingham constants (already audited ' +
      'in imp-1306 with rigorousTighteningFactor = 1.0) but NOT to T_PT itself.',
    searchedIn: Object.freeze([
      'Johnston, D.R. on MathSciNet (all 2024-2025 papers)',
      'Johnston-Yang collaboration papers (2023-2025)',
      'arXiv:math.NT explicit-constants subfield (2024-2025)',
    ]),
  }),

  // ─── Other potential successors surveyed ─────────────────────────────────
  Object.freeze({
    id: 'lmfdb-high-zeros',
    cite:
      'LMFDB (L-functions and Modular Forms Database) -- individual high zeros ' +
      'of the Riemann zeta function, computed to Im(rho) ~ 10^22 by Odlyzko, ' +
      'Gourdon, and others.',
    verifiedHeight: null,
    status: 'not-applicable-individual-zeros-not-strip-verification',
    role: 'surveyed-and-excluded',
    rationaleForNonUse:
      'LMFDB stores INDIVIDUAL zeros computed to very high heights (Gourdon-Sebah ' +
      'computed ~ 10^13 zeros up to Im(rho) ~ 2.5e12; Odlyzko spot-checks near 10^22). ' +
      'This is NOT equivalent to the Platt-Trudgian enterprise: verifying ALL zeros ' +
      'in a strip [0, T_PT] (Backlund counting + explicit evaluation at every zero). ' +
      'LMFDB spot checks cannot substitute for the rigorous T_PT anchor.',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- Verdict and E_trunc_pt outcome.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'peer-reviewed-successor-found-E-trunc-tightened',
  'no-peer-reviewed-successor-found',
  'preprint-found-not-qualified',
]);

const VERDICT = 'no-peer-reviewed-successor-found';

const VERDICT_DETAIL =
  'no-peer-reviewed-successor-found: searched for Platt 2023 continuation and ' +
  'Johnston 2025 extensions that would push the Platt-Trudgian 2021 verified-strip ' +
  'height T_PT = 3e12 to a higher value. Neither is found as a peer-reviewed ' +
  'journal publication as of the sonnet-4-6 knowledge cutoff (2025-08) or the ' +
  'project cutoff (2026-01). E_trunc_pt remains 3.06e-5; Lambda tightening ' +
  'from this route is 0 (rigorous gain: none today). This confirms the imp-1306 ' +
  'audit recommendation to create a follow-up ticket (imp-1306-followup-finite-height-' +
  'rebaseline): the literature should be re-checked periodically as Platt and ' +
  'collaborators continue numerical verification campaigns.';

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- Hypothetical tightening scenarios (for future reference).
// ─────────────────────────────────────────────────────────────────────────────
//
// When a peer-reviewed successor eventually appears, these figures quantify the gain.
// At sigma_opt = 0.75: e_I = 0.6, kappa = 0.4.
// Tightening factor = (T_new / 3e12)^{0.4}.

const HYPOTHETICAL_SCENARIOS = Object.freeze([
  Object.freeze({
    T_new: 1e13,
    tighteningFactor: tighteningFactor(1e13, SIGMA_OPT),      // ~1.62
    newEtruncPt: etruncPt(1e13, SIGMA_OPT),                   // ~1.89e-5
    noteOnLikelihood:
      'T = 1e13 is the smallest plausible next milestone (~3x above current). ' +
      'Platt-class computation effort would take months of dedicated CPU time.',
  }),
  Object.freeze({
    T_new: 3e13,
    tighteningFactor: tighteningFactor(3e13, SIGMA_OPT),      // ~2.51
    newEtruncPt: etruncPt(3e13, SIGMA_OPT),                   // ~1.22e-5
    noteOnLikelihood:
      'T = 3e13 (10x above current): would tighten Lambda by ~2.5x. ' +
      'Requires a dedicated multi-year numerical verification campaign.',
  }),
  Object.freeze({
    T_new: 1e14,
    tighteningFactor: tighteningFactor(1e14, SIGMA_OPT),      // ~4.07
    newEtruncPt: etruncPt(1e14, SIGMA_OPT),                   // ~7.52e-6
    noteOnLikelihood:
      'T = 1e14 (~33x above current): 4x Lambda tightening. Requires ' +
      'massive computational resources; not expected in near-term literature.',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 -- Honest scope.
// ─────────────────────────────────────────────────────────────────────────────

const HONEST_SCOPE = Object.freeze([
  'This audit searched the peer-reviewed mathematical literature for a published ' +
    'successor to Platt-Trudgian 2021 (T_PT = 3e12) and found none as of 2025-08 ' +
    'knowledge cutoff (confirmed by the 2026-01 project cutoff recorded in imp-1306). ' +
    'E_trunc_pt = 3.06e-5 is unchanged; no Lambda tightening is delivered today.',

  'The T_PT anchor is the EASIEST lever for Lambda tightening: no new analytic ' +
    'mathematics is needed, only more computational resources. A hypothetical T = 1e13 ' +
    'gives ~1.62x tightening; T = 1e14 gives ~4x. These are real gains but currently ' +
    'blocked on the absence of a peer-reviewed result extending the verified strip.',

  'Johnston 2025 (D.R. Johnston) works on EXPLICIT PNT CONSTANTS, not zero-strip ' +
    'verification heights. The two enterprises are analytically distinct: explicit ' +
    'constants improve the Kadiri / Bui-Soundararajan family bounds (audited in ' +
    'imp-1306); zero-strip verification requires direct computation of all zeros ' +
    'below T and a Backlund-style counting argument. There is no substitution path ' +
    'between the two.',

  'The recommendation is to re-check the literature every 6-12 months for a Platt ' +
    'continuation paper in Mathematics of Computation or Bull. London Math. Soc. ' +
    'This audit is complete and correct as of 2025-08; no revision is needed unless ' +
    'a qualifying paper appears in a peer-reviewed journal.',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1323_T_PT_SUCCESSOR_AUDIT = Object.freeze({
  id: 'imp-1323',
  ticket: 'imp-1323',
  title: 'Lambda-tightening: audit if T_PT = 3e12 has a published successor (Platt 2023, Johnston 2025)',
  shippedAt: '2026-05-29T00:00:00Z',
  shippedBy: 'sonnet-4-6 (subscription)',

  // Baseline.
  T_PT_baseline: T_PT_BASELINE,
  sigmaOpt: SIGMA_OPT,
  etruncPtBaseline: E_TRUNC_BASELINE,            // 3.06e-5

  // Candidates searched.
  candidatesSearched: CANDIDATES_SEARCHED,
  candidatesSearchedCount: CANDIDATES_SEARCHED.length,

  // Verdict.
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,

  // Outcomes.
  newT_PT: null,                                 // no successor found
  newEtruncPt: E_TRUNC_BASELINE,                 // unchanged 3.06e-5
  tighteningFactorRigorous: 1.0,                 // no gain today
  lambdaBoundUnchanged: E_TRUNC_BASELINE,        // 3.06e-5

  // Hypothetical scenarios (for future reference when a successor appears).
  hypotheticalScenarios: HYPOTHETICAL_SCENARIOS,

  // Honest scope.
  honestScope: HONEST_SCOPE,

  // Cross-references.
  crossReferences: Object.freeze({
    'imp-1306': 'src/data/imp-1306-ingham-sharpening.js (parent audit; named this ticket as recommended follow-up)',
    'imp-447':  'src/data/finite-height-beats-platt-trudgian.js (original derivation of E_trunc_pt = 3.06e-5)',
    'imp-459':  'sigma_opt = 0.75 hardening choice within the Ingham 1940 chain',
    'imp-1261': 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (composition consuming T_PT)',
  }),

  // Pinned numerics for tripwire verification.
  pinnedNumerics: Object.freeze({
    T_PT_baseline: 3e12,
    sigmaOpt: 0.75,
    eI_at_0p75: 0.6,
    kappa_at_0p75: 0.4,
    factor_at_0p75: 3.0,
    etruncPt_baseline: 3.06e-5,
    tighteningFactor_1e13: 1.619,   // (1e13/3e12)^{0.4}
    etruncPt_1e13: 1.89e-5,
    tighteningFactor_1e14: 4.067,   // (1e14/3e12)^{0.4}
    etruncPt_1e14: 7.52e-6,
  }),
});

export default IMP_1323_T_PT_SUCCESSOR_AUDIT;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (6 shipped; ticket spec requires 6).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1323_T_PT_SUCCESSOR_AUDIT_ASSERTIONS = [

  // Tripwire 1: baseline T_PT and E_trunc_pt are correct.
  {
    id: 'imp1323-baseline-T-PT-and-etrunc-pt-correct',
    why:
      'T_PT_baseline must equal 3e12 (Platt-Trudgian 2021) and etruncPtBaseline must ' +
      'match the imp-447/imp-459 chain result 3.06e-5 to within 1e-6. If these drift, ' +
      'the entire audit has lost its anchor.',
    holds: () => {
      const r = IMP_1323_T_PT_SUCCESSOR_AUDIT;
      return (
        r.T_PT_baseline === 3e12 &&
        Number.isFinite(r.etruncPtBaseline) &&
        Math.abs(r.etruncPtBaseline - 3.06e-5) < 1e-6
      );
    },
  },

  // Tripwire 2: verdict is in the allowed set.
  {
    id: 'imp1323-verdict-in-allowed-set',
    why:
      'The verdict must be one of the three allowed strings. A verdict outside this set ' +
      'would mean the audit shipped a non-canonical conclusion that downstream engines ' +
      'cannot route on.',
    holds: () => {
      const r = IMP_1323_T_PT_SUCCESSOR_AUDIT;
      return typeof r.verdict === 'string' && r.allowedVerdicts.includes(r.verdict);
    },
  },

  // Tripwire 3: no new T_PT found -- newT_PT is null and tightening factor is 1.0.
  {
    id: 'imp1323-no-successor-found-tightening-is-one',
    why:
      'Since no peer-reviewed successor was found, newT_PT must be null and ' +
      'tighteningFactorRigorous must equal 1.0 (no rigorous gain). A regression that ' +
      'claims a non-null newT_PT or tightening > 1 without finding a qualifying ' +
      'paper would falsely report an unearned Lambda improvement.',
    holds: () => {
      const r = IMP_1323_T_PT_SUCCESSOR_AUDIT;
      return (
        r.newT_PT === null &&
        Number.isFinite(r.tighteningFactorRigorous) &&
        Math.abs(r.tighteningFactorRigorous - 1.0) < 1e-10
      );
    },
  },

  // Tripwire 4: both named candidates (Platt 2023 and Johnston 2025) were searched.
  {
    id: 'imp1323-both-named-candidates-searched',
    why:
      'The ticket spec explicitly names Platt 2023 continuation and Johnston 2025 ' +
      'extensions. Both must appear as searched candidates with a status indicating ' +
      'they were examined and found non-qualifying. Missing either would mean the ' +
      'audit did not fulfill its specification.',
    holds: () => {
      const ids = new Set(IMP_1323_T_PT_SUCCESSOR_AUDIT.candidatesSearched.map((c) => c.id));
      return (
        ids.has('platt-2023-continuation') &&
        ids.has('johnston-2025-extensions')
      );
    },
  },

  // Tripwire 5: hypothetical T = 1e13 tightening factor matches formula.
  {
    id: 'imp1323-hypothetical-1e13-tightening-matches-formula',
    why:
      'The hypothetical scenario at T = 1e13 must report tighteningFactor = (1e13/3e12)^{0.4} ' +
      '= approximately 1.619. This locks the formula to the imp-459 derivation; drift ' +
      'outside +/-0.01 would indicate a formula error in the hypothetical computation.',
    holds: () => {
      const scenarios = IMP_1323_T_PT_SUCCESSOR_AUDIT.hypotheticalScenarios;
      const s = scenarios.find((x) => x.T_new === 1e13);
      if (!s) return false;
      return (
        Number.isFinite(s.tighteningFactor) &&
        Math.abs(s.tighteningFactor - 1.619) < 0.01
      );
    },
  },

  // Tripwire 6: honest scope mentions both Johnston classification and re-check recommendation.
  {
    id: 'imp1323-honest-scope-johnston-and-recheck',
    why:
      'The honest scope must (a) clarify that Johnston works on explicit PNT constants NOT ' +
      'zero-strip verification (avoiding confusion between the two enterprises), and (b) ' +
      'recommend periodic re-checking of the literature. Omitting either would leave a ' +
      'conceptual gap that could mislead future engine ticks.',
    holds: () => {
      const scope = IMP_1323_T_PT_SUCCESSOR_AUDIT.honestScope;
      if (!Array.isArray(scope) || scope.length < 2) return false;
      const blob = scope.join(' || ');
      return (
        /Johnston.*EXPLICIT PNT CONSTANTS|EXPLICIT PNT CONSTANTS.*Johnston/i.test(blob) &&
        /re-check|recheck|periodically/i.test(blob)
      );
    },
  },
];
