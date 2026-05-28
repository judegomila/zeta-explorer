// @module imp-1243-imp1147-ghost-margin-audit
// imp-1243: Cross-check the imp-1147 asymptotic Lambda <= 7.98e-4 candidate
//           against the v52 paper Section 17.4 negative-index identity.
//
// CENTRAL QUESTION
// ----------------
// Section 17.4 of the v52 paper (Blaschke ghosts / Krein-Langer):
//
//   ind_-(K_{R_a}) = #{ lambda : X(lambda) = 0, Re(lambda) > a }
//
// Here R_a(w) := X(w - a) / X(w + a) is the shifted scattering ratio,
// X(w) = xi(1/2 + w), and a > 0 is the BRIDGE THICKNESS. The identity
// says: the number of negative squares in the generalized-Schur kernel
// of R_a is EXACTLY the number of off-critical zeros of xi whose
// horizontal displacement from the critical line exceeds a (counted
// with multiplicity).
//
// imp-1147 (src/data/asymptotic-lambda-bound-2026-05-20.js) derives
//
//   Lambda <= a_hi + E_trunc_pt = 7.673e-4 + 3.06e-5 = 7.98e-4
//
// from 9 imp-1136 plateau brackets (N up to 1e6) via an OLS
// interval-arithmetic refit composed with the Polymath15 + Ingham
// E_trunc_pt at T_PT = 3e12. The composition implicitly assumes
// NO off-critical zeros contribute negative squares to the bridge
// at the plateau scales.
//
// QUESTION: At each of the 9 imp-1136 plateau brackets, is there
// "room" for a hypothetical off-critical zero rho = 1/2 + delta + i*gamma
// with delta > a_i (the per-plateau bridge thickness) that would
// invalidate the imp-1147 composition via the Section 17.4 identity?
//
// HONEST VERDICT (forward reference, expanded below)
// ---------------------------------------------------
// COMPOSITION-ROBUST-AT-ALL-PLATEAUS, with one observable margin
// caveat. PT 2021 (Platt-Trudgian 2021) verified all non-trivial
// zeros up to T_PT = 3e12 lie on the critical line. The maximal
// "hidden" off-critical displacement at any height below T_PT is
// therefore delta_max = 0. Margin_i = a_i - 0 = a_i > 0 at all
// plateaus where the bracket upper bound a_i = t_hi is strictly
// positive. The conservative (worst-case) a_i = t_lo choice yields
// margin = 0 at four plateaus (N in {500000, 600000, 800000,
// 1000000} where t_lo = 0), but the composition's actual operating
// point is governed by a_hi = max(t_hi over all plateaus) = 1e-3,
// not the per-plateau t_lo; the t_lo = 0 brackets remain consistent
// with the composition because they do not raise a_hi.
//
// Above T_PT a hypothetical off-critical zero is not constrained by
// PT 2021. But the bridge composition at the plateau scales is
// applied at HEIGHTS T_0(N) <= T_PT (T_0(1e6) ~ 7.3e7 << 3e12), so
// off-critical zeros above T_PT cannot enter the per-plateau ghost
// count.
//
// HONEST SCOPE
// ------------
// This audit makes the implicit "no off-critical zeros" assumption
// of imp-1147 EXPLICIT and quantifies the margin. It does NOT prove
// RH or upgrade the conditional imp-1147 bound to unconditional;
// the conditional dependence on (a) the linear-1/N OLS asymptotic
// model and (b) the Polymath15 bridge step 4 G6a_shock_lipschitz
// rigor gate remain as named imp-1147 residual obstructions.
//
// SYNTAX SAFETY: line comments only, no JSDoc asterisk-slash, no
// apostrophes inside single-quoted strings.

import { ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 } from './asymptotic-lambda-bound-2026-05-20.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// ── Anchors ──────────────────────────────────────────────────────────────

const PT_BOUND       = 0.2;                      // Platt-Trudgian 2021 SOTA Lambda <= 0.2
const T_PT           = 3e12;                     // Platt-Trudgian 2021 verified height (RH below)
const LAMBDA_TARGET  = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.composition.lambdaAsymptoticUpper;
// NOTE (post imp-1261): the imp-1147 file was rewritten to use the imp-1246
// redirect; the OLS-conditional a_hi is now archived under
// historicalConditionalReference. This ghost-margin audit operates on the
// HISTORICAL composition (the imp-1136 plateau sweep + OLS a_hi) because the
// per-plateau ghost-margin reasoning is about the bracketed |t_c(N)| values
// from the BH sweep, not about the new triangle-inequality bound.
const A_HI_COMPOSED  = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.historicalConditionalReference.a_hi;
const SWEEP_ROWS     = ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.sweepRows;

// ── Per-plateau ghost-margin computation ─────────────────────────────────
//
// For each plateau row (N, t_lo, t_hi):
//   a_i_conservative = t_lo   (smallest bridge thickness in the bracket;
//                              the composition would hold for every value
//                              of |t_c(N)| in [t_lo, t_hi], so the WEAKEST
//                              negative-index constraint is at a = t_lo).
//   a_i_optimistic   = t_hi   (largest bridge thickness in the bracket;
//                              this is the value the imp-1147 OLS uses
//                              as the conservative UPPER bound on |t_c(N)|
//                              when projecting a_hi = 7.673e-4).
//
//   delta_max_i      = 0      (PT 2021 verified RH below T_PT = 3e12;
//                              every plateau effective height T_0(N) <=
//                              T_0(1e6) ~ 7.3e7 sits well below T_PT, so
//                              the maximal "hidden" off-critical
//                              displacement for any zero with imaginary
//                              part in the relevant range is 0.)
//
//   margin_i_cons    = a_i_cons - delta_max_i = t_lo
//   margin_i_opt     = a_i_opt  - delta_max_i = t_hi
//
// STATUS rule:
//   robust   = margin_i_opt > 0  AND  margin_i_cons >= 0
//   marginal = margin_i_opt > 0  AND  margin_i_cons <  0  (cannot happen
//              here because t_lo >= 0 always, but the rule is defensive)
//   tight    = margin_i_opt > 0  AND  margin_i_cons == 0  (a_i_cons = 0)
//   broken   = margin_i_opt <= 0  (would mean a hypothetical zero with
//              delta > t_hi could exist and contribute ind_- >= 1)
//
// Per PT 2021, delta_max = 0 unconditionally for plateaus whose effective
// height T_0(N) is below T_PT = 3e12. We verify this height-domination
// for every plateau and flag any plateau whose T_0 exceeds T_PT (none
// do, in the imp-1136 sweep).

function classifyStatus(marginOpt, marginCons) {
  if (!(marginOpt > 0)) return 'broken';
  if (marginCons === 0)  return 'tight';
  if (marginCons < 0)    return 'marginal';
  return 'robust';
}

const PER_PLATEAU_ROWS = Object.freeze(
  SWEEP_ROWS.map((row) => {
    const T0       = effectiveHeightForN(row.N);
    const t_lo     = row.t_lo;
    const t_hi     = row.t_hi;
    // PT 2021 verifies RH up to T_PT for every plateau whose T_0 < T_PT.
    const ptCovers = T0 < T_PT;
    // delta_max for a hypothetical off-critical zero with imag part in
    // the height range "seen" by this plateau's bridge composition. Per
    // PT 2021 this is 0 when ptCovers is true; otherwise the structural
    // upper bound delta < 1/2 (zero strip) applies vacuously.
    const delta_max = ptCovers ? 0 : 0.5;
    const margin_cons = t_lo - delta_max;
    const margin_opt  = t_hi - delta_max;
    return Object.freeze({
      N:               row.N,
      reason:          row.reason,
      t_lo,
      t_hi,
      T0:              +T0.toExponential(4),
      log10_T0:        +Math.log10(T0).toFixed(3),
      ptCoversBelowT0: ptCovers,
      a_i_conservative: t_lo,
      a_i_optimistic:   t_hi,
      delta_max,
      margin_conservative: +margin_cons.toExponential(4),
      margin_optimistic:   +margin_opt.toExponential(4),
      status: classifyStatus(margin_opt, margin_cons),
    });
  })
);

// ── Composition-level audit ──────────────────────────────────────────────
// At the COMPOSED level, the imp-1147 OLS uses a_hi = 7.673e-4 as the
// asymptotic upper bound on |t_c(N)|. So the operative composition-level
// bridge thickness is a_compose = a_hi. We check that delta_max for any
// hypothetical zero remains strictly below a_compose:

const A_COMPOSE       = A_HI_COMPOSED;
const DELTA_MAX_COMP  = 0;                       // PT 2021 below T_PT
const MARGIN_COMPOSE  = A_COMPOSE - DELTA_MAX_COMP;
const COMPOSE_STATUS  = classifyStatus(MARGIN_COMPOSE, MARGIN_COMPOSE);

// ── Verdict aggregator ───────────────────────────────────────────────────

const STATUS_COUNTS = PER_PLATEAU_ROWS.reduce(
  (acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  },
  { robust: 0, tight: 0, marginal: 0, broken: 0 },
);

const N_BROKEN   = STATUS_COUNTS.broken;
const N_MARGINAL = STATUS_COUNTS.marginal;
const N_TIGHT    = STATUS_COUNTS.tight;
const N_ROBUST   = STATUS_COUNTS.robust;

const MIN_MARGIN_OPT  = PER_PLATEAU_ROWS.reduce(
  (m, r) => Math.min(m, r.margin_optimistic), Infinity,
);
const MIN_MARGIN_CONS = PER_PLATEAU_ROWS.reduce(
  (m, r) => Math.min(m, r.margin_conservative), Infinity,
);

// Overall verdict string (mirrors the imp-1218 paper-audit-dashboard vocabulary)
let OVERALL_VERDICT;
if (N_BROKEN > 0) {
  OVERALL_VERDICT = 'composition-broken-at-' + N_BROKEN + '-plateaus';
} else if (N_MARGINAL > 0) {
  OVERALL_VERDICT = 'composition-marginal-at-' + N_MARGINAL + '-plateaus';
} else {
  // Robust verdict; surface tight subset (where conservative margin == 0)
  // as an annotation, but the composition is not invalidated by tight
  // brackets because the composed a_hi = 7.673e-4 > 0 holds regardless.
  OVERALL_VERDICT = N_TIGHT > 0
    ? 'composition-robust-at-all-plateaus-with-' + N_TIGHT + '-tight-brackets'
    : 'composition-robust-at-all-plateaus';
}

const ALL_PLATEAUS_BELOW_TPT = PER_PLATEAU_ROWS.every((r) => r.ptCoversBelowT0 === true);

// ── Honest-scope record ──────────────────────────────────────────────────

const HONEST_SCOPE = Object.freeze({
  whatThisAuditDoes:
    'Makes the implicit no-off-critical-zero assumption of the imp-1147 ' +
    'Lambda <= 7.98e-4 composition EXPLICIT and quantifies the per-plateau ' +
    'ghost margin via the Section 17.4 Krein-Langer / Pontryagin identity.',
  whatThisAuditDoesNotDo:
    'Does NOT promote the conditional imp-1147 bound to unconditional. The ' +
    'two named imp-1147 residual obstructions (linear-1/N OLS asymptotic ' +
    'model deviation; Polymath15 bridge step 4 G6a_shock_lipschitz rigor ' +
    'gate) are independent of the Section 17.4 ghost-margin check and ' +
    'remain open.',
  ptCoverageAssumption:
    'All 9 plateau effective heights T_0(N) sit well below T_PT = 3e12 ' +
    '(the largest T_0 is T_0(1e6) ~ 7.3e7). PT 2021 verifies RH below ' +
    'T_PT, so the maximal hidden off-critical displacement for any zero ' +
    'in the plateau-relevant height range is delta_max = 0.',
  tightBracketCaveat:
    'At plateaus with t_lo = 0 (N in {500000, 600000, 800000, 1000000}) ' +
    'the CONSERVATIVE per-plateau bridge thickness a_i = t_lo = 0 yields ' +
    'margin = 0 (tight). This does NOT invalidate the composition because ' +
    '(i) the OLS uses the OPTIMISTIC t_hi side as the conservative upper ' +
    'bound on |t_c(N)| when projecting a_hi = 7.673e-4; (ii) PT 2021 ' +
    'continues to forbid any off-critical zero below T_PT regardless of a; ' +
    '(iii) the composed-level bridge thickness a_compose = a_hi = 7.673e-4 ' +
    'is strictly positive and dominates the conservative t_lo = 0 brackets.',
});

// ── Exported audit payload ───────────────────────────────────────────────

export const IMP_1243_GHOST_MARGIN_AUDIT = Object.freeze({
  id: 'imp-1243',
  ticket: 'imp-1243',
  parentChain: ['imp-1147', 'imp-1136', 'imp-1198'],
  paperSection: 'Section 17.4 (Blaschke ghosts / Krein-Langer)',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  auditFile: 'src/data/asymptotic-lambda-bound-2026-05-20.js',
  auditDate: '2026-05-28',

  ptAnchors: {
    T_PT,
    PT_BOUND,
    citation: 'Platt & Trudgian, Bull. Lond. Math. Soc. 53 (2021), 792-797',
  },

  composedTarget: {
    lambdaAsymptoticUpper: LAMBDA_TARGET,
    a_compose:             A_COMPOSE,
    delta_max_compose:     DELTA_MAX_COMP,
    margin_compose:        +MARGIN_COMPOSE.toExponential(4),
    status_compose:        COMPOSE_STATUS,
    note:
      'The imp-1147 composition Lambda <= a_hi + E_trunc_pt = 7.98e-4 ' +
      'operates with composed bridge thickness a_compose = a_hi = ' +
      A_COMPOSE.toExponential(4) + ' which strictly exceeds the PT-2021-bounded ' +
      'delta_max = 0. The composition is robust at the composed level.',
  },

  perPlateauRows: PER_PLATEAU_ROWS,

  statusCounts: STATUS_COUNTS,

  minMargin: {
    optimistic:   +MIN_MARGIN_OPT.toExponential(4),
    conservative: +MIN_MARGIN_CONS.toExponential(4),
    note:
      'minMargin.conservative = 0 across all plateaus is driven by the ' +
      'four t_lo = 0 brackets (N in {500000, 600000, 800000, 1000000}). ' +
      'Per the honestScope tightBracketCaveat, this does not invalidate ' +
      'the composition.',
  },

  overallVerdict: OVERALL_VERDICT,

  allPlateausBelowTPT: ALL_PLATEAUS_BELOW_TPT,

  honestScope: HONEST_SCOPE,

  references: Object.freeze({
    paperSection17:    'research-inputs/twin_ladder_consolidated_v52.pdf, Section 17.4',
    imp1147:           'src/data/asymptotic-lambda-bound-2026-05-20.js (composed Lambda <= 7.98e-4)',
    imp1136:           '9-plateau Barnes-Hut multipole sweep at N up to 1e6',
    imp1198:           'src/data/blaschke-ghosts-section.js (structured v52 Section 17 record)',
    plattTrudgian2021: 'Bull. Lond. Math. Soc. 53 (2021), 792-797',
    kreinLanger:       'Krein-Langer generalized Schur functions / Pontryagin spaces, 1973-77',
    deBruijnNewman:    'de Bruijn 1950 / Newman 1976 (Lambda definition + finiteness)',
    rodgersTao2020:    'Rodgers-Tao, Acta Math. 2020 (Lambda >= 0)',
  }),
});

// ── Build-time tripwires ─────────────────────────────────────────────────

export const IMP_1243_GHOST_MARGIN_AUDIT_ASSERTIONS = [
  {
    id: 'imp1243-nine-plateau-rows-present',
    why:
      'The audit must enumerate all 9 imp-1136 plateau brackets (N in ' +
      '{20000, 50000, 100000, 200000, 300000, 500000, 600000, 800000, 1000000}). ' +
      'Missing a row would let a hypothetical ghost-margin failure slip ' +
      'through unchecked.',
    holds: () => {
      const expected = [20000, 50000, 100000, 200000, 300000, 500000, 600000, 800000, 1000000];
      const actual   = PER_PLATEAU_ROWS.map((r) => r.N);
      return actual.length === 9 &&
             expected.every((N, i) => actual[i] === N);
    },
  },
  {
    id: 'imp1243-all-plateau-effective-heights-below-TPT',
    why:
      'The PT 2021 ghost-protection argument only applies to plateaus ' +
      'whose effective height T_0(N) is strictly below T_PT = 3e12. The ' +
      'largest plateau (N = 1e6) has T_0 ~ 7.3e7, comfortably below T_PT. ' +
      'A failure here means one of the imp-1136 plateaus has a height ' +
      'above PT-verified range, breaking the no-ghost protection at that ' +
      'plateau and requiring a separate height-extension argument.',
    holds: () => ALL_PLATEAUS_BELOW_TPT === true,
  },
  {
    id: 'imp1243-no-broken-plateaus',
    why:
      'No plateau may have status broken (margin_optimistic <= 0). A ' +
      'broken plateau would mean there is room for a hypothetical off-' +
      'critical zero with delta > t_hi which would contribute a ' +
      'non-trivial negative index ind_-(K_{R_a}) >= 1 at that plateau ' +
      'under the Section 17.4 identity, invalidating the imp-1147 ' +
      'composition.',
    holds: () => N_BROKEN === 0,
  },
  {
    id: 'imp1243-no-marginal-plateaus',
    why:
      'No plateau may have status marginal (mixed-sign margins). Because ' +
      't_lo >= 0 always in the imp-1136 sweep, marginal cannot occur ' +
      'unless delta_max is somehow positive, which would only happen if ' +
      'PT 2021 did not cover the plateau height. This assertion is a ' +
      'belt-and-braces check that the height check above did not silently ' +
      'mis-classify a plateau.',
    holds: () => N_MARGINAL === 0,
  },
  {
    id: 'imp1243-overall-verdict-is-robust',
    why:
      'Given no broken / no marginal plateaus AND every effective height ' +
      'below T_PT, the overall verdict must read composition-robust-at-' +
      'all-plateaus (optionally annotated with the count of tight ' +
      'brackets). A different verdict means status aggregation has a bug.',
    holds: () => /^composition-robust-at-all-plateaus/.test(OVERALL_VERDICT),
  },
  {
    id: 'imp1243-min-margin-optimistic-strictly-positive',
    why:
      'The minimum optimistic margin (= min over plateaus of t_hi - 0) ' +
      'must be strictly positive (expected 2e-4 from the N=20000 plateau ' +
      'with t_hi = 2.0e-4). If this dropped to 0 or below, some plateau ' +
      'has t_hi = 0, which would mean the OLS upper bracket vanished at ' +
      'that scale and the imp-1147 a_hi extrapolation would be unsound.',
    holds: () => MIN_MARGIN_OPT > 0 && MIN_MARGIN_OPT >= 1e-4,
  },
  {
    id: 'imp1243-composed-level-margin-matches-imp1147-a-hi',
    why:
      'The composition-level bridge thickness a_compose used by the ' +
      'audit must equal the imp-1147 a_hi value 7.673e-4. A drift here ' +
      'means either imp-1147 silently changed its OLS upper bracket or ' +
      'this audit pulled the wrong field. The audit then surfaces ' +
      'margin_compose = a_hi - 0 = a_hi as the headline composition-level ' +
      'margin.',
    holds: () => {
      const expected = 7.673e-4;
      return Math.abs(A_COMPOSE - expected) / expected < 1e-3 &&
             Math.abs(MARGIN_COMPOSE - A_COMPOSE) < 1e-15;
    },
  },
  {
    id: 'imp1243-tight-bracket-count-matches-tlo-zero-rows',
    why:
      'The number of tight-status plateaus must equal the number of ' +
      'imp-1136 rows with t_lo = 0 (expected 4: N in {500000, 600000, ' +
      '800000, 1000000}). A mismatch means status classification has ' +
      'lost track of the t_lo = 0 brackets and the honestScope ' +
      'tightBracketCaveat no longer applies to the correct rows.',
    holds: () => {
      const tloZeroCount = PER_PLATEAU_ROWS.filter((r) => r.t_lo === 0).length;
      return N_TIGHT === tloZeroCount && tloZeroCount === 4;
    },
  },
];
