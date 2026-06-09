/**
 * @module k-plateau-monotonicity
 * @fileoverview imp-2484 — HONEST PARTIAL closure of imp-1082-sub-measurement
 * (the deferred measurement of the K_PLATEAU_LADDER batch-1 rows): a
 * CONDITIONAL DOMINATION LEMMA for the K = 0.2014 conservative carryforward
 * on the first unmeasured octave N in (1e4, 2e4].
 *
 * WHAT IS RIGOROUS HERE (data-level, no RK4 needed)
 * -------------------------------------------------
 * The cert constant factors exactly as K_paper_cert(N) = Phi(N) * F_mb(N),
 * where
 *
 *   Phi(N)  = H_raw(N) * sqrt(N) / (log(N) * 0.12751)
 *   F_mb(N) = |t_c_hi(N) - H_raw(N)^2 / 8|     (RK4-measured deviation)
 *
 * (see addKFields in src/math/imp-962-sweep-N10k-to-N1e6.mjs: K_raw_cert =
 * F_mb_upper * H_raw * sqrt(N) / log(N), K_paper_cert_floor = K_raw_cert /
 * 0.12751). Phi is EXACTLY computable from the Odlyzko zeros data alone:
 * H_raw is the running minimum of consecutive zero gaps (monotone
 * non-increasing in N), and sqrt(N)/log(N) is elementary. On the octave
 * (1e4, 2e4] the zeros give exactly two plateaus (imp-962 scan): plateau 0
 * with H_raw = 0.0376985 on [1e4, 18859] and plateau 1 with H_raw =
 * 0.03530732 from N = 18860. Within a plateau Phi is increasing (sqrt(N) /
 * log(N) increases for N >= e^2) and it drops at each H_raw update, so the
 * supremum of Phi over the octave is attained at the plateau-0 right
 * endpoint N = 18859:
 *
 *   sup Phi / Phi(1e4) = Phi(18859) / Phi(1e4) = 1.28479  (EXACT ratio;
 *   the 0.12751 normalisation cancels).
 *
 * THE LEMMA (conditional domination)
 * ----------------------------------
 * Let K_anchor = 3.9275e-4 be the MEASURED K_paper_cert_floor at N = 1e4
 * (imp-911 closed row, maxIntervalWidth 1.28e-9) and F_anchor = 1.2235e-4
 * its measured F_mb_upper. Then for every N in (1e4, 2e4]:
 *
 *   K_paper_cert(N) <= 1.28479 * K_anchor * ( F_mb(N) / F_anchor ).
 *
 * Consequently the shipped carryforward bound K_bound = 0.2014 DOMINATES
 * K_paper_cert on the whole octave IF AND ONLY IF the single hypothesis
 *
 *   (H_F)   sup over N in (1e4, 2e4] of F_mb(N) <= lambdaStar * F_anchor,
 *           lambdaStar = 0.2014 / (1.28479 * K_anchor) = 399.13,
 *           i.e. sup F_mb <= 4.884e-2
 *
 * holds. This module REDUCES imp-1082-sub-measurement at N = 2e4 from
 * "run a ~20 h interval-RK4 cert" to verifying ONE explicit inequality:
 * the many-body deviation F_mb may inflate by up to ~399x across a single
 * octave before the carryforward breaks.
 *
 * EMPIRICAL SUPPORT (labeled as such, NOT part of the lemma)
 * ----------------------------------------------------------
 * Across all 23 measured imp-911/imp-933 closed rows on N in [11, 1e4],
 * the worst adjacent-row F_mb inflation ever observed is 14.51x (between
 * N = 2637 and N = 4271) — a factor ~27 below the lambdaStar threshold.
 * The measured F_mb trend at the top of the range is DECREASING.
 *
 * WHAT REMAINS OPEN (honest)
 * --------------------------
 * Hypothesis (H_F) is NOT proved: F_mb has no a priori bound without
 * integrating the backward Dyson flow, so this is a CONDITIONAL reduction,
 * not a closure. The imp-1082-sub-measurement sub-gap REMAINS OPEN and the
 * batch-1 K_PLATEAU_LADDER rows correctly keep status =
 * projected-not-measured (assertions below tripwire both facts). The
 * remaining core is named imp-2484-sub-fmb-octave-bound: prove or measure
 * sup F_mb <= 4.884e-2 on (1e4, 2e4].
 *
 * @see imp-2484
 * @see imp-1082
 * @see imp-963
 * @see imp-962
 * @see imp-911
 */

import { IMP_911_PER_PLATEAU_GRONWALL_CERTS } from './imp-911-per-plateau-gronwall-certs.js';
import { IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6 } from './imp-962-plateau-structure-N10k-to-N1e6.js';
import { FINITE_K_C_MB_UNCONDITIONAL } from './finite-k-c-mb-unconditional.js';

const RESCUE_THRESHOLD = 0.12751;
const OCTAVE = { N_lo: 10000, N_hi: 20000 };

// ── Exact part: Phi on the octave, recomputed live from the plateau scan ───

function phi(H, N) {
  return (H * Math.sqrt(N)) / (Math.log(N) * RESCUE_THRESHOLD);
}

const PLATEAUS = IMP_962_PLATEAU_STRUCTURE_N10K_TO_N1E6.plateaus;
const P0 = PLATEAUS.find((p) => p.plateauIndex === 0) ?? null;
const P1 = PLATEAUS.find((p) => p.plateauIndex === 1) ?? null;

// Candidate suprema of Phi on (1e4, 2e4]: right endpoint of plateau 0 and
// the octave cap N = 2e4 inside plateau 1 (Phi increases within a plateau,
// drops at each H_raw update — both facts elementary given H_raw data).
const PHI_ANCHOR = P0 != null ? phi(P0.H_raw, OCTAVE.N_lo) : null;
const PHI_P0_END = P0 != null ? phi(P0.H_raw, Math.min(P0.endN, OCTAVE.N_hi)) : null;
const PHI_OCTAVE_CAP =
  P1 != null && OCTAVE.N_hi >= P1.startN ? phi(P1.H_raw, OCTAVE.N_hi) : null;
const SUP_PHI = Math.max(PHI_P0_END ?? -Infinity, PHI_OCTAVE_CAP ?? -Infinity);
const SUP_PHI_RATIO =
  PHI_ANCHOR != null && PHI_ANCHOR > 0 ? SUP_PHI / PHI_ANCHOR : null;

// ── Measured anchor: the imp-911 closed row at N = 1e4 ────────────────────

const ANCHOR_ROW =
  IMP_911_PER_PLATEAU_GRONWALL_CERTS.closedRows_data.find(
    (r) => r.N === 10000 && r.closed === true,
  ) ?? null;
const K_ANCHOR = ANCHOR_ROW != null ? ANCHOR_ROW.K_paper_cert_floor : null;
const F_ANCHOR = ANCHOR_ROW != null ? ANCHOR_ROW.F_mb_upper : null;

// ── The conditional lemma constants ────────────────────────────────────────

const LADDER_ROW_2E4 =
  FINITE_K_C_MB_UNCONDITIONAL.kPlateauLadder.find((r) => r.N === 20000) ?? null;
const K_CARRYFORWARD = LADDER_ROW_2E4 != null ? LADDER_ROW_2E4.K_bound : null;

const LAMBDA_STAR =
  K_CARRYFORWARD != null && SUP_PHI_RATIO != null && K_ANCHOR != null
    ? K_CARRYFORWARD / (SUP_PHI_RATIO * K_ANCHOR)
    : null;
const F_MB_OCTAVE_THRESHOLD =
  LAMBDA_STAR != null && F_ANCHOR != null ? LAMBDA_STAR * F_ANCHOR : null;

// ── Empirical support (NOT part of the lemma): worst observed adjacent
//    F_mb inflation across the measured rows on [11, 1e4] ──────────────────

const MEASURED_ROWS = IMP_911_PER_PLATEAU_GRONWALL_CERTS.closedRows_data
  .filter((r) => r.closed === true && typeof r.F_mb_upper === 'number')
  .slice()
  .sort((a, b) => a.N - b.N);

let WORST_OBSERVED_INFLATION = 0;
let WORST_OBSERVED_INFLATION_AT = null;
for (let i = 1; i < MEASURED_ROWS.length; i++) {
  const ratio = MEASURED_ROWS[i].F_mb_upper / MEASURED_ROWS[i - 1].F_mb_upper;
  if (ratio > WORST_OBSERVED_INFLATION) {
    WORST_OBSERVED_INFLATION = ratio;
    WORST_OBSERVED_INFLATION_AT = {
      N_from: MEASURED_ROWS[i - 1].N,
      N_to: MEASURED_ROWS[i].N,
    };
  }
}

// ── Exported record ────────────────────────────────────────────────────────

export const K_PLATEAU_MONOTONICITY = Object.freeze({
  id: 'imp-2484-k-plateau-monotonicity',
  ticket: 'imp-2484',
  parentSubGap: 'imp-1082-sub-measurement',
  status: 'conditional-reduction-sub-gap-remains-open',

  lemma:
    'For every N in (1e4, 2e4]: K_paper_cert(N) = Phi(N) * F_mb(N) with ' +
    'Phi exactly computable from the zeros data, and sup Phi / Phi(1e4) = ' +
    '1.28479 (attained at N = 18859, the plateau-0 right endpoint). Hence ' +
    'the shipped carryforward K_bound = 0.2014 dominates K_paper_cert on ' +
    'the whole octave if and only if hypothesis (H_F) holds: sup F_mb on ' +
    '(1e4, 2e4] is at most lambdaStar * F_mb(1e4) with lambdaStar = ' +
    '0.2014 / (1.28479 * 3.9275e-4) = 399.13, i.e. sup F_mb <= 4.884e-2.',

  exactPart: {
    octave: OCTAVE,
    phiAnchor_at_1e4: PHI_ANCHOR,
    phiSup_on_octave: SUP_PHI,
    supPhiRatio: SUP_PHI_RATIO,
    supAttainedAt: P0 != null ? Math.min(P0.endN, OCTAVE.N_hi) : null,
    rigor:
      'Phi(N) = H_raw(N) * sqrt(N) / (log(N) * 0.12751) uses only the ' +
      'running-min zero-gap H_raw (monotone non-increasing, exact from ' +
      'ZEROS_EXTENDED via the imp-962 plateau scan) and elementary ' +
      'monotonicity of sqrt(N)/log(N) for N >= e^2. No RK4 input.',
  },

  measuredAnchor: {
    N: 10000,
    K_paper_cert_floor: K_ANCHOR,
    F_mb_upper: F_ANCHOR,
    source: 'imp-911 closed row (imp-857-L1 sweep, maxIntervalWidth 1.28e-9)',
  },

  hypothesis: {
    id: 'imp-2484-sub-fmb-octave-bound',
    status: 'open',
    blocker: false,
    statement:
      '(H_F) sup over N in (1e4, 2e4] of F_mb(N) <= lambdaStar * F_mb(1e4). ' +
      'NOT proved here: F_mb has no a priori bound without integrating the ' +
      'backward Dyson flow. Closing it needs either the deferred interval-' +
      'RK4 measurement at the plateau-0 and plateau-1 interiors, or an ' +
      'analytic upper bound on the many-body collision-time deviation.',
    lambdaStar: LAMBDA_STAR,
    fMbOctaveThreshold: F_MB_OCTAVE_THRESHOLD,
  },

  conclusionUnderHypothesis:
    'Under (H_F) the conservative carryforward K_bound = 0.2014 at every ' +
    'N in (1e4, 2e4] — in particular the batch-1 K_PLATEAU_LADDER row at ' +
    'N = 2e4 — is a VALID upper bound on K_paper_cert, by the exact Phi ' +
    'factorisation. The reduction replaces a ~20 h JS-sandbox interval-RK4 ' +
    'run with one explicit inequality carrying ~399x headroom.',

  empiricalSupport: {
    label: 'EMPIRICAL — not part of the lemma',
    measuredRowCount: MEASURED_ROWS.length,
    worstObservedAdjacentFmbInflation: WORST_OBSERVED_INFLATION,
    worstObservedAt: WORST_OBSERVED_INFLATION_AT,
    marginVsLambdaStar:
      LAMBDA_STAR != null && WORST_OBSERVED_INFLATION > 0
        ? LAMBDA_STAR / WORST_OBSERVED_INFLATION
        : null,
    note:
      'The worst F_mb inflation ever observed between adjacent measured ' +
      'rows on [11, 1e4] is ~14.5x, a factor ~27 below the lambdaStar ' +
      'threshold; the F_mb trend at the top of the measured range is ' +
      'decreasing. Supports plausibility of (H_F); proves nothing.',
  },

  honestFraming: [
    'This is a CONDITIONAL REDUCTION of imp-1082-sub-measurement at the ' +
      'first unmeasured octave, NOT a closure. The sub-gap remains open.',
    'No K_PLATEAU_LADDER row is flipped to measured by this module; the ' +
      'tripwires below fail the build if either fact drifts.',
  ],
});

export const K_PLATEAU_MONOTONICITY_ASSERTIONS = [
  {
    id: 'imp2484-phi-sup-ratio-exact-band',
    holds: () =>
      K_PLATEAU_MONOTONICITY.exactPart.supPhiRatio != null &&
      K_PLATEAU_MONOTONICITY.exactPart.supPhiRatio > 1.0 &&
      K_PLATEAU_MONOTONICITY.exactPart.supPhiRatio < 1.29,
    why:
      'The exact Phi growth across (1e4, 2e4], recomputed live from the ' +
      'imp-962 plateau scan, must equal ~1.28479 and in particular stay ' +
      'inside (1.0, 1.29). Drift means the zeros data or the plateau scan ' +
      'changed and every lemma constant must be re-derived.',
  },
  {
    id: 'imp2484-h-raw-non-increasing-on-octave',
    holds: () => {
      const p0 = PLATEAUS.find((p) => p.plateauIndex === 0);
      const p1 = PLATEAUS.find((p) => p.plateauIndex === 1);
      return (
        p0 != null &&
        p1 != null &&
        p0.H_raw > 0 &&
        p1.H_raw > 0 &&
        p1.H_raw < p0.H_raw &&
        p0.endN === 18859 &&
        p1.startN === 18860
      );
    },
    why:
      'H_raw is a running minimum so it must drop (not rise) at the single ' +
      'update point N = 18860 inside the octave. The lemma locates the Phi ' +
      'supremum at the plateau-0 right endpoint 18859 using exactly this.',
  },
  {
    id: 'imp2484-measured-anchor-present',
    holds: () =>
      ANCHOR_ROW != null &&
      ANCHOR_ROW.closed === true &&
      typeof F_ANCHOR === 'number' &&
      F_ANCHOR > 0 &&
      typeof K_ANCHOR === 'number' &&
      K_ANCHOR > 0 &&
      K_ANCHOR < 5e-4,
    why:
      'The lemma anchors on the MEASURED imp-911 closed row at N = 1e4 ' +
      '(K_paper_cert_floor ~3.93e-4). If the row vanishes or its K leaves ' +
      'the sub-5e-4 band the reduction loses its measured base case.',
  },
  {
    id: 'imp2484-lambda-star-headroom',
    holds: () => LAMBDA_STAR != null && LAMBDA_STAR > 100 && LAMBDA_STAR < 1000,
    why:
      'The F_mb inflation headroom lambdaStar = K_carryforward / ' +
      '(supPhiRatio * K_anchor) must compute to ~399 and stay above 100. ' +
      'Headroom below 100 would mean the carryforward is much closer to ' +
      'breaking than the prose claims; above 1000 means an input drifted.',
  },
  {
    id: 'imp2484-lambda-star-self-consistent',
    holds: () =>
      LAMBDA_STAR != null &&
      K_CARRYFORWARD != null &&
      Math.abs(LAMBDA_STAR * SUP_PHI_RATIO * K_ANCHOR - K_CARRYFORWARD) <
        1e-12,
    why:
      'lambdaStar is DEFINED by lambdaStar * supPhiRatio * K_anchor = ' +
      'K_carryforward; the identity must hold to floating-point exactness. ' +
      'Failure means the lemma constants were edited inconsistently.',
  },
  {
    id: 'imp2484-empirical-inflation-far-below-threshold',
    holds: () =>
      WORST_OBSERVED_INFLATION > 0 &&
      WORST_OBSERVED_INFLATION < 20 &&
      LAMBDA_STAR != null &&
      WORST_OBSERVED_INFLATION < LAMBDA_STAR / 10,
    why:
      'EMPIRICAL tripwire: the worst adjacent-row F_mb inflation on the ' +
      'measured range [11, 1e4] is ~14.5x and must stay below 20 and below ' +
      'a tenth of lambdaStar. If new measured rows ever show inflation ' +
      'approaching the threshold, the (H_F) plausibility argument is dead ' +
      'and the prose here must be rewritten.',
  },
  {
    id: 'imp2484-sub-gap-still-open-and-rows-unflipped',
    holds: () => {
      const g = FINITE_K_C_MB_UNCONDITIONAL.imp1082SubMeasurement;
      const row = LADDER_ROW_2E4;
      return (
        g != null &&
        g.status === 'open' &&
        row != null &&
        row.status === 'projected-not-measured' &&
        row.K_bound === K_CARRYFORWARD
      );
    },
    why:
      'This module is a conditional reduction, NOT a measurement: the ' +
      'imp-1082-sub-measurement sub-gap must remain open and the N = 2e4 ' +
      'ladder row must remain projected-not-measured. If either flips ' +
      'without an actual interval-RK4 cert, that is a false claim of rigor.',
  },
];
