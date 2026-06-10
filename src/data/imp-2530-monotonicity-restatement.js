/**
 * @module imp-2530-monotonicity-restatement
 * @fileoverview imp-2530: POSITIVE closure of the named open sub-gap
 * imp-336-sub-monotonicity-restatement (declared in
 * imp-336-sub-monotonicity-trajectory.js by imp-2516).
 *
 * The sub-gap asked: find and PROVE the weakest monotonicity-type statement
 * (M-restated) that is (a) consistent with the certified small-N violations
 * of (M) recorded by imp-2516, and (b) still sufficient for the imp-328
 * conditional intercept upgrade — auditing first which form of (M) the
 * imp-328 / lambda-intercept-* records actually consume.
 *
 * CONSUMER AUDIT (what imp-328 actually needs)
 * --------------------------------------------
 * The imp-328 conditional theorem (lambda-intercept-analytic.js) reads:
 * under (M) |t_c(N+1)| <= |t_c(N)| for all N >= 2,
 *
 *   (P1)  a := lim_{N to inf} |t_c(N)| exists and equals inf_N |t_c(N)|,
 *   (P2)  hence a <= |t_c(N_max)| for any baseline N_max  (= 0.0086).
 *
 * Splitting the conclusion shows the per-N hypothesis (M) is consumed only
 * through these two corollaries, and each is discharged by a strictly
 * weaker input:
 *
 *   (P2) needs only the ENVELOPE FORM below — a theorem, no hypothesis.
 *   (P1) needs limit existence, which (M) supplied via monotone
 *        convergence; but the imp-341 / imp-344 route B record
 *        (lambda-intercept-unconditional.js) already gives
 *        lim sup_N |t_c(N)| = 0 UNCONDITIONALLY, and since |t_c(N)| >= 0
 *        this forces 0 <= lim inf <= lim sup = 0, so the limit EXISTS and
 *        equals 0 = inf_N |t_c(N)| (the infimum of a nonnegative sequence
 *        with limit 0 is 0). (P1) holds with no monotonicity input at all,
 *        at the evidentiary standard of the imp-341 record.
 *
 * THE RESTATEMENT (M-restated) — envelope form, PROVED
 * ----------------------------------------------------
 *   THEOREM (M-env). Let E(N) := min_{M <= N} |t_c(M)| (running minimum of
 *   the backward Calogero-Moser collision times). Then E is non-increasing
 *   in N, lim_{N to inf} E(N) exists and equals inf_N |t_c(N)|, and
 *   inf_N |t_c(N)| <= |t_c(N_max)| for every N_max.
 *
 *   Proof. E(N+1) = min(E(N), |t_c(N+1)|) <= E(N), so E is non-increasing;
 *   it is bounded below by 0 because each |t_c(N)| is a positive collision
 *   time, so lim E(N) exists by monotone convergence and equals
 *   inf_N E(N) = inf_N |t_c(N)| (every term enters some E(N)). Finally
 *   inf_N |t_c(N)| <= E(N_max) <= |t_c(N_max)|. QED — unconditional,
 *   elementary, no flow input beyond positivity of collision times.
 *
 * Sufficiency: (M-env) discharges (P2) alone, and (M-env) + the shipped
 * imp-341 lim-sup record discharges (P1), so the FULL conclusion of the
 * imp-328 conditional theorem holds with (M) replaced by (M-env). Since
 * (M-env) is a theorem, no statement weaker than it is needed, and nothing
 * weaker exists in the ordering of hypotheses (a theorem is the minimum).
 * (M-restated) := (M-env).
 *
 * Consistency with the imp-2516 refutation (certified, computed below)
 * --------------------------------------------------------------------
 * On the imp-2516 certified scan rows (N in [2, 20], interval brackets
 * [lo, hi] for each |t_c(N)|), the running-minimum envelope brackets
 * EnvLo / EnvHi resolve EVERY one of the 18 consecutive pairs:
 *
 *   - certified FLAT  (lo_{N+1} > EnvHi(N), so E(N+1) = E(N) exactly) at
 *     precisely the 12 CERT-VIOL pairs where pointwise (M) fails, and
 *   - certified DROP  (hi_{N+1} < EnvLo(N), so E(N+1) = |t_c(N+1)| < E(N))
 *     at precisely the 6 argmin-relocation pairs.
 *
 * So the envelope is blind to the violations by construction — the
 * violations land exactly where E is flat — and the certified trichotomy
 * is complete: no pair is left unresolved by the brackets. This is the
 * strongest possible form of requirement (a).
 *
 * What this closure does NOT claim (honest scope)
 * -----------------------------------------------
 *   - (M-env) gives NO per-N quantitative bound and NO rate: the residual
 *     "turn lim sup = 0 into an explicit per-N bound" is the pre-existing
 *     imp-344 rate-upgrade gap (routes A-rate / B-rate / C, G3_density via
 *     imp-342), already tracked there — deliberately NOT re-declared here
 *     as a new sub-gap to avoid queue duplication.
 *   - Eventual monotonicity (|t_c(N+1)| <= |t_c(N)| for N >= N0 with
 *     explicit N0) is NOT claimed: the imp-2516 margins decay through
 *     N = 18 -> 19 and no proof of an N0 exists. It is also not needed:
 *     it would imply (M-env) restricted to the tail but buys imp-328
 *     nothing beyond what (M-env) + imp-341 already deliver, since a = 0
 *     beats every finite sample value.
 *   - The argmin-relocation-subsequence candidate is subsumed: the
 *     certified-drop pairs ARE the relocation pairs (biconditional pinned
 *     below), so that candidate is exactly "where the envelope drops" and
 *     carries no extra strength for imp-328.
 *
 * Created by imp-2530 (api-pool, opus-4-8). Coordinated flip: the
 * openSubGap record in imp-336-sub-monotonicity-trajectory.js is flipped
 * to closed with resolvedBy imp-2530 in the same commit, and its
 * stay-open tripwire is replaced by the coordinated-flip tripwire there.
 */

import { IMP336_TRAJECTORY_REFUTATION } from './imp-336-sub-monotonicity-trajectory.js';
import {
  LAMBDA_INTERCEPT_ANALYTIC,
  CONDITIONAL_UPPER_BOUND,
} from './lambda-intercept-analytic.js';
import { LAMBDA_INTERCEPT_UNCONDITIONAL } from './lambda-intercept-unconditional.js';
import { PATH_C_BASELINE_FIT } from '../math/dyson-scaling-N5000.js';

// ── Certified envelope over the imp-2516 scan rows ──────────────────────────
// Each scan row brackets |t_c(N)| in [lo, hi]. The running-min envelope is
// bracketed by EnvLo(N) = min_{M <= N} lo_M and EnvHi(N) = min_{M <= N} hi_M.
// Pair classification against the PREVIOUS envelope bracket:
//   flat: lo_{N+1} > EnvHi(N)  (certified E(N+1) = E(N) exactly)
//   drop: hi_{N+1} < EnvLo(N)  (certified E(N+1) = |t_c(N+1)| < E(N))

function computeEnvelopePairs(rows) {
  const pairs = [];
  let envLo = Infinity;
  let envHi = Infinity;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (i > 0) {
      pairs.push({
        N_from: rows[i - 1].N,
        N_to: r.N,
        certifiedFlat: r.lo > envHi,
        certifiedDrop: r.hi < envLo,
        envLoPrev: envLo,
        envHiPrev: envHi,
      });
    }
    envLo = Math.min(envLo, r.lo);
    envHi = Math.min(envHi, r.hi);
  }
  return { pairs, finalEnvLo: envLo, finalEnvHi: envHi };
}

const SCAN = IMP336_TRAJECTORY_REFUTATION.scan;
const ENVELOPE = computeEnvelopePairs(SCAN.rows);

// Join envelope classification with the imp-2516 violation flags, pair by pair.
const JOINED_PAIRS = ENVELOPE.pairs.map((e, i) => ({
  ...e,
  certifiedViolation: SCAN.pairs[i].certifiedViolation,
  argminUnchanged: SCAN.pairs[i].argminUnchanged,
}));

// ── Baseline inf-bound (requirement (b), part (P2)) ─────────────────────────

const BASELINE_TCS = PATH_C_BASELINE_FIT.map((p) => p.tc);
const BASELINE_INF = Math.min(...BASELINE_TCS);

// ── The record ───────────────────────────────────────────────────────────────

export const IMP2530_MONOTONICITY_RESTATEMENT = {
  id: 'imp-2530',
  closes: 'imp-336-sub-monotonicity-restatement',
  resolution: 'RESOLVED-POSITIVE — (M-restated) found, proved, and audited sufficient',
  statement: {
    name: '(M-env) envelope monotonicity',
    body:
      'E(N) := min over M <= N of |t_c(M)| is non-increasing in N; ' +
      'lim E(N) exists and equals inf over N of |t_c(N)|; and ' +
      'inf over N of |t_c(N)| <= |t_c(N_max)| for every N_max.',
    proofStatus:
      'THEOREM (unconditional, elementary): running minima are ' +
      'non-increasing, bounded below by 0 since collision times are ' +
      'positive, so monotone convergence gives the limit = infimum; the ' +
      'infimum is <= any sampled term. No flow input beyond positivity.',
  },
  consumerAudit: {
    consumer: LAMBDA_INTERCEPT_ANALYTIC.id + ' conditionalTheorem',
    decomposition: [
      '(P1) a := lim |t_c(N)| exists and equals inf_N |t_c(N)|',
      '(P2) a <= |t_c(N_max)| on the baseline (= ' +
        String(CONDITIONAL_UPPER_BOUND.upperBound) +
        ')',
    ],
    p2Discharge: '(M-env) alone, unconditionally: inf <= E(N_max) <= |t_c(N_max)|.',
    p1Discharge:
      'imp-341 / imp-344 route B: lim sup_N |t_c(N)| = 0 unconditionally; ' +
      'with |t_c(N)| >= 0 this forces lim = 0 = inf. No monotonicity input ' +
      'is consumed for limit existence at the imp-341 evidentiary standard.',
    verdict:
      'Per-N (M) is NOT load-bearing for the imp-328 intercept conclusion. ' +
      '(M-restated) = (M-env) is sufficient and, being a theorem, weakest ' +
      'possible. The refuted small-N pointwise (M) costs the chain nothing.',
  },
  consistencyWithRefutation: {
    scanRows: SCAN.rows.length,
    pairsResolved: JOINED_PAIRS.length,
    certifiedFlatPairs: JOINED_PAIRS.filter((p) => p.certifiedFlat).length,
    certifiedDropPairs: JOINED_PAIRS.filter((p) => p.certifiedDrop).length,
    flatIffViolation: JOINED_PAIRS.every(
      (p) => p.certifiedFlat === p.certifiedViolation,
    ),
    dropIffArgminRelocation: JOINED_PAIRS.every(
      (p) => p.certifiedDrop === !p.argminUnchanged,
    ),
    trichotomyComplete: JOINED_PAIRS.every(
      (p) => p.certifiedFlat !== p.certifiedDrop,
    ),
    headline:
      'Envelope brackets resolve all 18 pairs: certified FLAT exactly at ' +
      'the 12 CERT-VIOL pairs (the envelope never sees the violations), ' +
      'certified DROP exactly at the 6 argmin-relocation pairs.',
  },
  baselineApplication: {
    rows: CONDITIONAL_UPPER_BOUND.baselineRows,
    infOverBaseline: BASELINE_INF,
    tcAtNMax: CONDITIONAL_UPPER_BOUND.tcAtNMax,
    envelopeAttainedAtNMax: BASELINE_INF === CONDITIONAL_UPPER_BOUND.tcAtNMax,
  },
  notClaimed: [
    'No per-N quantitative bound or rate — that residual is the ' +
      'pre-existing imp-344 rate-upgrade gap (G3_density via imp-342, or a ' +
      'psi_N rate on route B), tracked there, deliberately not re-declared.',
    'No eventual monotonicity with explicit N0 — unproven and unneeded.',
    'Nothing about Lambda beyond what imp-328 / imp-344 already record.',
  ],
};

// ── Build-time assertions (tripwires) ────────────────────────────────────────

export const IMP2530_MONOTONICITY_RESTATEMENT_ASSERTIONS = [
  {
    id: 'imp2530-envelope-trichotomy-complete-on-certified-scan',
    holds: () =>
      JOINED_PAIRS.length === 18 &&
      JOINED_PAIRS.every((p) => p.certifiedFlat !== p.certifiedDrop) &&
      ENVELOPE.finalEnvLo <= ENVELOPE.finalEnvHi &&
      SCAN.rows.every((r) => r.lo < r.hi),
    why:
      'The running-min envelope brackets computed from the imp-2516 scan ' +
      'must resolve every one of the 18 consecutive pairs as exactly one ' +
      'of certified-flat or certified-drop, with valid interval brackets ' +
      'throughout. An unresolved or doubly-classified pair means the scan ' +
      'table or the envelope arithmetic changed.',
  },
  {
    id: 'imp2530-envelope-blind-to-violations-biconditional',
    holds: () =>
      JOINED_PAIRS.filter((p) => p.certifiedFlat).length === 12 &&
      JOINED_PAIRS.filter((p) => p.certifiedDrop).length === 6 &&
      JOINED_PAIRS.every((p) => p.certifiedFlat === p.certifiedViolation) &&
      JOINED_PAIRS.every((p) => p.certifiedDrop === !p.argminUnchanged),
    why:
      'Requirement (a) of the sub-gap in its strongest form: the envelope ' +
      'is certified FLAT exactly at the 12 pairs where pointwise (M) is ' +
      'certifiably violated, and certified to DROP exactly at the 6 ' +
      'argmin-relocation pairs. This double biconditional is the proof ' +
      'that (M-env) is consistent with — indeed blind to — the imp-2516 ' +
      'refutation. A mismatch means the scan table was edited.',
  },
  {
    id: 'imp2530-inf-bound-discharges-p2-on-baseline',
    holds: () =>
      BASELINE_INF === CONDITIONAL_UPPER_BOUND.tcAtNMax &&
      BASELINE_INF <= 0.0086 &&
      CONDITIONAL_UPPER_BOUND.monotoneObserved === true,
    why:
      'On the sampled baseline the running-min envelope attains its value ' +
      'at N_max, so the (M-env) inf-bound reproduces the imp-328 ' +
      'conditional number a <= 0.0086 with NO hypothesis. If the baseline ' +
      'gains a non-monotone row, the envelope still applies but no longer ' +
      'attains at N_max — re-audit baselineApplication then.',
  },
  {
    id: 'imp2530-limsup-record-pinned-for-p1',
    holds: () =>
      LAMBDA_INTERCEPT_UNCONDITIONAL.routes.B.claim.includes('lim sup') &&
      LAMBDA_INTERCEPT_UNCONDITIONAL.routes.B.claim.includes('UNCONDITIONALLY') &&
      LAMBDA_INTERCEPT_UNCONDITIONAL.currentStrongestUnconditional.statement.includes('= 0'),
    why:
      'The (P1) limit-existence leg of the sufficiency audit leans on the ' +
      'imp-341 / imp-344 route B record lim sup |t_c(N)| = 0 holding ' +
      'unconditionally. If that record is ever weakened, (P1) falls back ' +
      'to needing a monotonicity-type input stronger than (M-env) and this ' +
      'closure must be re-audited in the same commit.',
  },
  {
    id: 'imp2530-coordinated-subgap-flip',
    holds: () =>
      IMP336_TRAJECTORY_REFUTATION.openSubGap.id ===
        'imp-336-sub-monotonicity-restatement' &&
      IMP336_TRAJECTORY_REFUTATION.openSubGap.status.startsWith('closed') &&
      IMP336_TRAJECTORY_REFUTATION.openSubGap.resolvedBy === 'imp-2530',
    why:
      'The declaring record in imp-336-sub-monotonicity-trajectory.js must ' +
      'carry the closed status and resolvedBy imp-2530 in the same commit ' +
      'as this module — the coordinated flip demanded by the original ' +
      'imp2516 successor tripwire.',
  },
];
