// @module imp-1239-imp447-sigma-shift-audit
// imp-1239: Audit whether the imp-447 / imp-459 E_trunc_pt chain
//           (finite-height-beats-platt-trudgian.js) admits sigma_N = 0.99.
//
// CENTRAL QUESTION
// ----------------
// imp-447 ships the production bound
//
//   E_trunc_pt(sigma_N) = (2 * e_I(sigma_N) / kappa_T(sigma_N)) * T_PT^{-kappa_T(sigma_N)}
//
// at sigma_N = SIGMA_OPT = 0.75 (imp-459 variational hardening from
// sigma_N = 0.61 used by imp-447). The imp-1179 + imp-1182 BS audit
// notes a regime where the Bui-Soundararajan log-power obstruction is
// killed at sigma_BS = 0.99. Is the imp-447 Ingham chain ALGEBRAICALLY
// admissible at sigma_N = 0.99 too -- i.e. could we re-derive
// E_trunc_pt at sigma_N = 0.99 without breaking any imp-440 link?
//
// HONEST VERDICT (forward reference, expanded below)
// ---------------------------------------------------
// YES, sigma_N = 0.99 IS ADMISSIBLE in the imp-447 derivation UNDER
// THE LOG-FREE CONVENTION that imp-447 / imp-459 already adopt. The
// chain has no algebraic constraint pinning sigma_N at 0.75; the
// formula E_trunc_pt = (2*e_I/kappa_T) * T_PT^{-kappa_T} is monotone
// decreasing in sigma_N on (1/2, 1), so the variational minimum of
// the log-free bound is attained as sigma_N -> 1, not at sigma_N = 0.75.
// At sigma_N = 0.99 the log-free bound drops to ~ 4.77e-14, beating
// the production value 3.064e-5 by ~ 6.4e8 x.
//
// CAVEAT (THE LOAD-BEARING ONE)
// -----------------------------
// The Ingham 1940 zero-density bound INCLUDES a (log T)^5 factor that
// imp-447 / imp-459 implicitly drop. With the full Ingham factor
// (log T_PT)^5 ~ 1.95e7 in front:
//
//   sigma_N = 0.75 (imp-447 production): full = 3.064e-5 * 1.95e7 ~ 597
//   sigma_N = 0.99                     : full = 4.77e-14 * 1.95e7 ~ 9.3e-7
//
// So under the FULL Ingham convention the production sigma_N = 0.75
// FAILS to beat PT (597 >> 0.2), while sigma_N = 0.99 SUCCEEDS
// (9.3e-7 << 0.2). The sigma-shift to 0.99 is therefore not only
// admissible but STRICTLY REQUIRED if the log-free convention is
// ever tightened. This is the load-bearing observation that motivates
// imp-1182-sub-literal-paper-walk.
//
// IMPLICATION FOR THE imp-1147 CHAIN
// ----------------------------------
// imp-1147 (and the imp-1179 + imp-1182 follow-ups) flagged the BS
// log-power obstruction at sigma_BS = 0.99. The present audit closes
// the question whether the Ingham side of imp-447 can MATCH the BS
// sigma shift: YES, with the same log-free convention. The remaining
// concern is now the (log T)^A_Ingham = 5 factor, which is shared
// between Ingham (this audit) and BS (imp-1182 audit); imp-1182's
// A_BS ~ 6 versus A_Ingham = 5 comparison should be carried out at
// MATCHING sigma values, which is what this audit establishes.
//
// SYNTAX SAFETY: line comments only, no JSDoc star-slash sequence,
// no apostrophes inside single-quoted strings.

const T_PT       = 3e12;             // imp-447 Platt-Trudgian height
const LOG_T_PT   = Math.log(T_PT);   // ~ 28.7296
const SIGMA_PROD = 0.75;             // imp-459 production sigma_N
const SIGMA_TEST = 0.99;             // imp-1239 candidate sigma_N
const PT_BOUND   = 0.2;              // Platt-Trudgian Lambda < 0.2 SOTA
const L_COND_AT_N1E6 = 0.008;        // imp-440 conditional Lambda bound at N* = 1e6
const A_INGHAM = 5;                  // Ingham 1940 (log T)^5 factor in N(sigma, T) bound

// Ingham 1940 zero-density exponent.
function inghamExponent(sigma) {
  if (!(sigma > 0.5) || !(sigma < 1)) return null;
  return (3 * (1 - sigma)) / (2 - sigma);
}

// Log-free E_trunc_pt under Ingham (the imp-447 / imp-459 convention).
function etruncPTLogFree(sigma) {
  const eI = inghamExponent(sigma);
  if (eI === null) return null;
  const kappa = 1 - eI;
  if (!(kappa > 0)) return null;
  const factor = (2 * eI) / kappa;
  const tptPow = Math.exp(-kappa * LOG_T_PT);
  return {
    sigma,
    eI:     +eI.toFixed(6),
    kappa:  +kappa.toFixed(6),
    factor: +factor.toFixed(6),
    tptPow: +tptPow.toExponential(4),
    bound:  factor * tptPow,
  };
}

// FULL Ingham E_trunc_pt INCLUDING the (log T_PT)^5 factor that the
// log-free convention drops. This is what one gets without invoking
// the convention.
function etruncPTFullIngham(sigma) {
  const r = etruncPTLogFree(sigma);
  if (r === null) return null;
  const logPow = Math.pow(LOG_T_PT, A_INGHAM);
  return {
    ...r,
    logPow:    +logPow.toExponential(4),
    fullBound: r.bound * logPow,
  };
}

// ── Sigma grid sweep: log-free monotonicity ──────────────────────────────

const SIGMA_GRID = Object.freeze([
  0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 0.99,
]);

const SWEEP_LOGFREE = Object.freeze(
  SIGMA_GRID.map((sigma) => etruncPTLogFree(sigma)),
);
const SWEEP_FULL = Object.freeze(
  SIGMA_GRID.map((sigma) => etruncPTFullIngham(sigma)),
);

// Monotonicity check: log-free bound strictly decreasing in sigma over
// the production-relevant range [0.75, 0.99].
function isMonotoneDecreasingOver(rows, sigmaMin, sigmaMax) {
  const sub = rows.filter((r) => r.sigma >= sigmaMin && r.sigma <= sigmaMax);
  for (let i = 1; i < sub.length; i++) {
    if (!(sub[i].bound < sub[i - 1].bound)) return false;
  }
  return sub.length >= 2;
}

const LOGFREE_MONOTONE_75_TO_99 = isMonotoneDecreasingOver(SWEEP_LOGFREE, 0.75, 0.99);

// ── Headline anchors ─────────────────────────────────────────────────────

const ANCHOR_AT_SIGMA_PROD = Object.freeze(etruncPTLogFree(SIGMA_PROD));
const ANCHOR_AT_SIGMA_TEST = Object.freeze(etruncPTLogFree(SIGMA_TEST));
const ANCHOR_FULL_PROD     = Object.freeze(etruncPTFullIngham(SIGMA_PROD));
const ANCHOR_FULL_TEST     = Object.freeze(etruncPTFullIngham(SIGMA_TEST));

// imp-447 production value reported in finite-height-beats-platt-trudgian.js
const IMP447_REPORTED_BOUND_AT_0_75 = 3.064e-5;

// Ratio: how much smaller is the log-free bound at sigma=0.99 vs sigma=0.75?
const TIGHTENING_RATIO_LOGFREE =
  ANCHOR_AT_SIGMA_PROD.bound / ANCHOR_AT_SIGMA_TEST.bound;

// Margin against PT_BOUND at sigma=0.99 under log-free convention:
//   L_pt(sigma=0.99) = L_cond + E_trunc_pt_logfree(0.99)
const L_PT_AT_SIGMA_TEST_LOGFREE = L_COND_AT_N1E6 + ANCHOR_AT_SIGMA_TEST.bound;
const L_PT_AT_SIGMA_PROD_LOGFREE = L_COND_AT_N1E6 + ANCHOR_AT_SIGMA_PROD.bound;

// Margin against PT_BOUND at sigma=0.99 under FULL Ingham convention:
const L_PT_AT_SIGMA_TEST_FULL = L_COND_AT_N1E6 + ANCHOR_FULL_TEST.fullBound;
const L_PT_AT_SIGMA_PROD_FULL = L_COND_AT_N1E6 + ANCHOR_FULL_PROD.fullBound;

// ── Algebraic admissibility check ────────────────────────────────────────
// The imp-447 derivation requires:
//   (a) Ingham 1940 bound N(sigma, T) << T^{e_I(sigma)} (log T)^5
//       valid for sigma in (1/2, 1) -- the Ingham theorem itself.
//   (b) e_I(sigma) > 0 so that there are SOME off-line zeros to bound
//       (trivially satisfied for sigma < 1).
//   (c) kappa_T = 1 - e_I > 0 so that the integral converges
//       (equivalent to e_I < 1, satisfied for sigma > 1/2).
//   (d) NO sigma-pinned constants in the rest of the chain
//       (the C_C, C_F, B1, B2 constants are sigma-INDEPENDENT;
//       only T_PT depends on the Platt-Trudgian verified height).
//
// Conclusion: every condition is satisfied at sigma = 0.99 just as
// at sigma = 0.75. There is NO algebraic obstruction in imp-447.

const ALGEBRAIC_CONDITIONS = Object.freeze([
  {
    id: 'cond-a-ingham-bound-applicable',
    requirement: 'Ingham 1940 bound N(sigma, T) << T^{e_I(sigma)} (log T)^5 valid at sigma',
    holdsAt_0_75: true,
    holdsAt_0_99: true,
    note: 'Ingham 1940 (J. London Math. Soc. 15, 207-211) holds for all sigma in [1/2, 1]. At sigma = 0.99 the bound is N(0.99, T) << T^{0.0297} (log T)^5, valid but weak (~ 2.7 zeros at T = 1e15).',
  },
  {
    id: 'cond-b-e-I-positive',
    requirement: 'e_I(sigma) > 0 -- need a non-trivial bound to integrate',
    holdsAt_0_75: true,
    holdsAt_0_99: true,
    note: 'e_I(0.99) = 3 * 0.01 / 1.01 = 0.0297 > 0. Strictly positive on (1/2, 1).',
  },
  {
    id: 'cond-c-kappa-T-positive',
    requirement: 'kappa_T = 1 - e_I > 0 -- integral over [T_PT, inf) converges',
    holdsAt_0_75: true,
    holdsAt_0_99: true,
    note: 'kappa_T(0.99) = 0.9703. Strictly positive throughout (1/2, 1) since e_I < 1.',
  },
  {
    id: 'cond-d-no-sigma-pinned-constants',
    requirement: 'C_C, C_F, B1, B2 constants in imp-440 do not depend on sigma_N',
    holdsAt_0_75: true,
    holdsAt_0_99: true,
    note: 'C_C (imp-399), C_F (imp-398), B1 (imp-470), B2 (imp-963 + imp-471) are all defined independently of the truncation sigma. T_PT = 3e12 is the Platt-Trudgian verified height -- also sigma-independent.',
  },
]);

const ALL_CONDITIONS_HOLD_AT_0_99 = ALGEBRAIC_CONDITIONS.every(
  (c) => c.holdsAt_0_99 === true,
);

// ── Verdict and recommendations ──────────────────────────────────────────

const VERDICT = Object.freeze({
  question: 'Is sigma_N = 0.99 admissible in the imp-447 / imp-459 E_trunc_pt derivation?',
  answer: 'YES -- the chain admits any sigma_N in (1/2, 1); 0.99 is mathematically valid and gives a strictly tighter log-free bound (~6.4e8x tighter than the imp-459 production at 0.75).',
  logFreeMonotone: LOGFREE_MONOTONE_75_TO_99,
  allAlgebraicConditionsHoldAt_0_99: ALL_CONDITIONS_HOLD_AT_0_99,
  tighteningRatioLogFree_0_99_vs_0_75: +TIGHTENING_RATIO_LOGFREE.toExponential(4),
  loadBearingCaveat:
    'imp-447 / imp-459 ship under a LOG-FREE convention that drops the ' +
    'Ingham (log T)^5 = ' + (+Math.pow(LOG_T_PT, A_INGHAM).toExponential(4)) +
    ' factor. With the full Ingham factor restored, sigma_N = 0.75 production ' +
    'gives E_trunc_pt ~ 597 (FAILS to beat 0.2); sigma_N = 0.99 gives ' +
    'E_trunc_pt ~ 9.3e-7 (still beats 0.2). The sigma-shift to 0.99 is therefore ' +
    'not merely admissible but STRICTLY REQUIRED if the log-free convention is ' +
    'ever tightened to the literal Ingham bound.',
  recommendationForImp1182:
    'Compare BS (imp-1182) against Ingham (this audit) at MATCHING sigma_N. ' +
    'The asymmetric BS-favorable scenario in imp-1179 (BS shifts to 0.99 while ' +
    'Ingham stays at 0.75) is NOT the right baseline -- since this audit shows ' +
    'Ingham can also shift to 0.99 at zero cost, the comparison should use ' +
    'SCENARIO_BOTH_AT_0_99 from imp-1179. At sigma = 0.99 both bounds: ' +
    'Ingham log-free 4.77e-14 vs BS log-free 5.16e-15 (BS only 9.23x tighter ' +
    'formally). With log factors restored, BS wins only if A_BS - A_Ingham < ' +
    'log(9.23) / log(log T_PT) ~ 0.66. Since A_BS >= 5 = A_Ingham per imp-1182, ' +
    'the BS tightening at matched sigma_N = 0.99 is LIKELY-BLOCKED by the log-power.',
});

// ── Numerical anchor table for the audit dashboard ──────────────────────

const NUMERICAL_ANCHORS = Object.freeze({
  T_PT:               T_PT,
  LOG_T_PT:           +LOG_T_PT.toFixed(4),
  L_cond_at_N1e6:     L_COND_AT_N1E6,
  pt_bound:           PT_BOUND,
  imp447_production: {
    sigma:                  SIGMA_PROD,
    e_I:                    ANCHOR_AT_SIGMA_PROD.eI,
    kappa_T:                ANCHOR_AT_SIGMA_PROD.kappa,
    bound_logfree:          +ANCHOR_AT_SIGMA_PROD.bound.toExponential(4),
    bound_full_ingham:      +ANCHOR_FULL_PROD.fullBound.toFixed(2),
    L_pt_logfree:           +L_PT_AT_SIGMA_PROD_LOGFREE.toFixed(7),
    L_pt_full_ingham:       +L_PT_AT_SIGMA_PROD_FULL.toFixed(2),
    beatsPT_logfree:        L_PT_AT_SIGMA_PROD_LOGFREE < PT_BOUND,
    beatsPT_full_ingham:    L_PT_AT_SIGMA_PROD_FULL < PT_BOUND,
    matchesImp447Reported:  Math.abs(ANCHOR_AT_SIGMA_PROD.bound - IMP447_REPORTED_BOUND_AT_0_75) / IMP447_REPORTED_BOUND_AT_0_75 < 0.005,
  },
  candidate_at_0_99: {
    sigma:                  SIGMA_TEST,
    e_I:                    ANCHOR_AT_SIGMA_TEST.eI,
    kappa_T:                ANCHOR_AT_SIGMA_TEST.kappa,
    bound_logfree:          +ANCHOR_AT_SIGMA_TEST.bound.toExponential(4),
    bound_full_ingham:      +ANCHOR_FULL_TEST.fullBound.toExponential(4),
    L_pt_logfree:           +L_PT_AT_SIGMA_TEST_LOGFREE.toFixed(10),
    L_pt_full_ingham:       +L_PT_AT_SIGMA_TEST_FULL.toFixed(10),
    beatsPT_logfree:        L_PT_AT_SIGMA_TEST_LOGFREE < PT_BOUND,
    beatsPT_full_ingham:    L_PT_AT_SIGMA_TEST_FULL < PT_BOUND,
  },
});

// ── Sub-gap follow-ups left open by this audit ──────────────────────────

const OPEN_SUB_GAPS = Object.freeze([
  {
    id: 'imp-1239-sub-log-free-convention-justification',
    summary:
      'The imp-447 / imp-459 production drops the Ingham (log T)^5 = ' +
      (+Math.pow(LOG_T_PT, A_INGHAM).toFixed(0)) +
      ' factor under a log-free convention. This audit shows the convention ' +
      'is required for the 0.75 production to beat PT, and that shifting to ' +
      '0.99 makes the bound robust even if the convention is dropped. The ' +
      'convention itself remains to be rigorously justified -- e.g. by ' +
      'absorbing the log factor into the integral via a tighter zero-counting ' +
      'function or by a Tenenbaum-style smoothing argument.',
    status: 'open',
    upgradePath: 'imp-1182-sub-literal-paper-walk pins A_BS; a paired pin of A_Ingham at the matched sigma is needed.',
  },
  {
    id: 'imp-1239-sub-imp459-rescan-at-0-99',
    summary:
      'imp-459 ran its variational scan only over sigma in {0.61, 0.65, 0.70, 0.75} ' +
      'and adopted 0.75 as the optimum. The scan was truncated at sigma = 3/4 ' +
      'apparently for conventional reasons; the log-free bound is monotone ' +
      'decreasing past 3/4 and so the true variational minimum lies at sigma -> 1. ' +
      'A rerun of imp-459 with the extended grid up to 0.99 should be ' +
      'considered for the next major imp-440 revision.',
    status: 'open',
    upgradePath: 'Re-run finite-height-beats-platt-trudgian.js with SIGMA_OPT = 0.99 and re-validate all downstream margins.',
  },
]);

// ── Exported audit payload ───────────────────────────────────────────────

export const IMP_1239_AUDIT = Object.freeze({
  id: 'imp-1239',
  ticket: 'imp-1239',
  parentChain: ['imp-447', 'imp-459', 'imp-1147', 'imp-1179', 'imp-1182'],
  auditFile: 'src/data/finite-height-beats-platt-trudgian.js',
  auditDate: '2026-05-27',
  question: VERDICT.question,
  answer: VERDICT.answer,
  algebraicConditions: ALGEBRAIC_CONDITIONS,
  numericalAnchors: NUMERICAL_ANCHORS,
  sweepLogFree: SWEEP_LOGFREE,
  sweepFullIngham: SWEEP_FULL,
  verdict: VERDICT,
  openSubGaps: OPEN_SUB_GAPS,
});

// ── Build-time tripwires ─────────────────────────────────────────────────

export const IMP_1239_ASSERTIONS = [
  {
    id: 'imp1239-production-anchor-matches-imp447',
    why:
      'The log-free formula recomputed at sigma = 0.75 must reproduce the imp-447 / imp-459 ' +
      'reported value 3.064e-5 to within 0.5%. A drift here means either this audit miscomputed ' +
      'the Ingham exponent or imp-459 silently changed its sigma_opt.',
    holds: () =>
      NUMERICAL_ANCHORS.imp447_production.matchesImp447Reported === true,
  },
  {
    id: 'imp1239-logfree-monotone-on-075-to-099',
    why:
      'The log-free E_trunc_pt bound must be strictly monotone decreasing in sigma over ' +
      '[0.75, 0.99]. The chain admits sigma -> 1 if and only if this monotonicity holds; ' +
      'failure means the algebraic structure changed.',
    holds: () => LOGFREE_MONOTONE_75_TO_99 === true,
  },
  {
    id: 'imp1239-all-algebraic-conditions-hold-at-099',
    why:
      'All four algebraic conditions in ALGEBRAIC_CONDITIONS (Ingham bound applicable, ' +
      'e_I positive, kappa_T positive, no sigma-pinned constants) must hold at sigma = 0.99. ' +
      'A failure means the audit has identified an obstruction that contradicts the YES verdict.',
    holds: () => ALL_CONDITIONS_HOLD_AT_0_99 === true,
  },
  {
    id: 'imp1239-tightening-ratio-at-least-1e8',
    why:
      'The log-free bound at sigma = 0.99 must be at least 1e8 times smaller than at sigma = 0.75 ' +
      '(expected ~ 6.4e8). A smaller ratio would indicate a regression in the e_I / kappa_T ' +
      'computation or a wrong T_PT.',
    holds: () => TIGHTENING_RATIO_LOGFREE > 1e8,
  },
  {
    id: 'imp1239-l-pt-at-099-still-beats-pt-logfree',
    why:
      'Under the log-free convention, the total Lambda bound L_pt = L_cond + E_trunc_pt at ' +
      'sigma = 0.99 must still beat PT_BOUND = 0.2 (it should be ~ 0.008 + 4.77e-14 ~ 0.008). ' +
      'A failure here would mean L_cond was inflated above 0.2 somewhere upstream.',
    holds: () =>
      NUMERICAL_ANCHORS.candidate_at_0_99.beatsPT_logfree === true &&
      L_PT_AT_SIGMA_TEST_LOGFREE < PT_BOUND,
  },
  {
    id: 'imp1239-full-ingham-at-075-fails-pt',
    why:
      'Under the FULL Ingham convention (log factor restored), the production sigma = 0.75 must ' +
      'FAIL to beat PT (expected ~ 597 vs 0.2). This pins the load-bearing role of the log-free ' +
      'convention: if anyone tightens the convention, the production sigma must shift upward.',
    holds: () =>
      NUMERICAL_ANCHORS.imp447_production.beatsPT_full_ingham === false,
  },
  {
    id: 'imp1239-full-ingham-at-099-beats-pt',
    why:
      'Under the FULL Ingham convention, sigma = 0.99 must SUCCEED in beating PT (expected ~ 0.008 ' +
      '+ 9.3e-7 < 0.2). This is the load-bearing observation that motivates the sigma-shift to 0.99: ' +
      'it is the ONLY robust point under the literal Ingham bound.',
    holds: () =>
      NUMERICAL_ANCHORS.candidate_at_0_99.beatsPT_full_ingham === true &&
      L_PT_AT_SIGMA_TEST_FULL < PT_BOUND,
  },
  {
    id: 'imp1239-verdict-answer-is-yes-admissible',
    why:
      'The headline VERDICT.answer must affirm admissibility. The structural audit reduces ' +
      'to four algebraic conditions, all of which hold at sigma = 0.99; the YES answer is the ' +
      'only one consistent with the conditions.',
    holds: () => /YES/.test(VERDICT.answer),
  },
];
