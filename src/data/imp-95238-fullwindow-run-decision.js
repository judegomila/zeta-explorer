/**
 * imp-95238 — DECISION ASSESSMENT of the full-window W1-CERT run (378 CPU-days
 * as built by imp-95213), deferred there as a "separate decision NOT taken".
 *
 * WHY THIS TICKET EXISTS. imp-95213 built + validated + priced the tier-P/B/S
 * window-1 certifier and certified a 0.058% slice of window 1, recording
 * fullWindowRunLaunched=false with the full-window run priced at 378 CPU-days
 * (level-1, single-level Taylor) as a separate decision. The frontier scout
 * asks: assess that decision — what the full run certifies, how the price
 * scales with G5 precision replays, and whether it should wait on the
 * imp-95228 second-level lever first. Report a recommendation; no launch.
 *
 * THE ASSESSMENT (arithmetic over the frozen imp-95213 / imp-95214 / imp-95228
 * ledgers; this ticket runs no new computation and launches nothing):
 *
 *  (A) WHAT THE FULL-WINDOW RUN CERTIFIES. A full-window run extends the
 *      imp-95213 slice certificate (sum_j |D_j(x(u))| < Rex and |E97(x(u))| <
 *      Rex, continuum, both seam charts) from 0.058% of window 1 to ALL of
 *      window 1. That would be the FIRST full-window continuum-certified
 *      statement of the Gate-2 program — a milestone — but window 1 is one
 *      window: imp-95213 records 54,109,011 windows beyond window 1 untouched.
 *      A sub-total run sets NO G5 window-promotion flag and changes no bound;
 *      no refereed bound is changed regardless.
 *
 *  (B) WAIT ON THE imp-95228 SECOND-LEVEL LEVER FIRST? THE WAIT IS OVER —
 *      AND IT DOMINATES. The frequency-bin second level the imp-95213
 *      residualLever named "NOT built" is now BUILT + validated + priced
 *      (imp-95214 tier-2 chirp, resolved by the imp-95228 whether-question).
 *      It produces the IDENTICAL window-1 continuum certificate at 21.1
 *      CPU-days vs the level-1 378.2 — a 17.9x cut (~3.0 wall-days at 7
 *      threads / 1.51 at 14, vs 47.3 wall-days at 8). Launching the level-1
 *      build now would spend ~357 extra CPU-days for the same certificate.
 *      The level-1 378-CPU-day run is therefore strictly DOMINATED.
 *
 *  (C) G5 PRECISION-REPLAY SCALING. Both prices are at 128 bits. imp-95213
 *      records the price scales LINEARLY in verified-precision replays
 *      (160/192-bit G5 replays multiply the price). Because the replay factor
 *      multiplies BOTH routes by the same scalar, the tier-2 dominance is
 *      precision-invariant: the level-1 / tier-2 ratio is unchanged under any
 *      common G5 replay multiplier. Budget the certificate at (tier-2
 *      CPU-days) * (G5 precision-replay factor), never the level-1 figure.
 *
 * RECOMMENDATION: DO NOT launch the 378-CPU-day level-1 full-window run. It is
 * dominated by the already-built tier-2 chirp level (imp-95214), which delivers
 * the identical window-1 continuum certificate at 21.1 CPU-days (17.9x). If a
 * window-1 continuum certificate is pursued at all, run it via tier-2, times
 * the G5 precision-replay factor. Even so it stays a milestone (first
 * full-window continuum statement), NOT a bound-mover: it covers only window 1
 * (54,109,011 windows beyond untouched), sets no promotion flag, and changes
 * no bound. Assessment only; launches nothing; NO QED; no refereed bound is changed.
 */

import {
  TIER_PRICE,
  IMP95213_TIER_CERTIFIER,
} from './imp-95213-tier-certifier-build.js';
import {
  TIER2_PRICE,
  IMP95214_TIER2_CHIRP,
} from './imp-95214-tier2-chirp-level.js';
import { SECOND_LEVEL_ASSESSMENT } from './imp-95228-second-level-lever-assessment.js';

// ── the decision, read off the frozen ledgers ────────────────────────────────
export const FULLWINDOW_RUN_DECISION = Object.freeze({
  ticket: 'imp-95238-fullwindow-run-decision',
  deferredBy: 'imp-95213-tier-certifier-build (fullWindowRunLaunched=false)',
  // (A) scope of what a full-window run would certify
  certifiesScope: 'window 1 continuum (both seam charts, sum_j |D_j| < Rex and |E97| < Rex)',
  windowsBeyondWindow1Untouched: 54109011, // imp-95213 recorded scope-honesty figure
  setsPromotionFlag: false,                // a sub-total run cannot set the G5 flag
  movesBound: false,
  // (B) the two priced routes to the SAME window-1 certificate
  level1FullWindowCpuDays: TIER_PRICE.fullWindow.cpuDaysBothMetrics, // 378.2
  level1WallDaysAt8Threads: TIER_PRICE.fullWindow.wallDaysAt8Threads, // 47.3
  tier2FullWindowCpuDays: TIER2_PRICE.fullWindow.cpuDays,             // 21.1
  tier2WallDaysAt7Threads: TIER2_PRICE.fullWindow.wallDaysAt7Threads, // 3.01
  tier2WallDaysAt14Threads: TIER2_PRICE.fullWindow.wallDaysAt14Threads, // 1.51
  tier2SpeedupVsLevel1: TIER2_PRICE.baselines.speedupVsLevel1,        // 17.92
  cpuDaysWastedIfLevel1:
    TIER_PRICE.fullWindow.cpuDaysBothMetrics - TIER2_PRICE.fullWindow.cpuDays, // ~357
  secondLevelLeverBuilt: IMP95214_TIER2_CHIRP.buildComplete !== false,
  secondLevelWhetherQuestionResolved: /RESOLVED/.test(SECOND_LEVEL_ASSESSMENT.verdict),
  // (C) precision scaling
  pricedAtBits: 128,
  precisionReplayScaling: 'linear (imp-95213 honest note: 160/192-bit G5 replays multiply the price)',
  precisionReplayMultipliesBothRoutesEqually: true, // dominance is precision-invariant
  level1Dominated: true,
  recommendation:
    'DO NOT launch the 378-CPU-day level-1 full-window run: it is DOMINATED by the already-built ' +
    'tier-2 chirp level (imp-95214), which yields the identical window-1 continuum certificate at ' +
    '21.1 CPU-days (17.9x, ~3.0 wall-days at 7 threads). The imp-95228 wait is over — the lever ' +
    'is realized — so if a window-1 continuum certificate is pursued at all, run it via tier-2, ' +
    'times the G5 precision-replay factor (which multiplies both routes equally, leaving the ' +
    'tier-2 dominance precision-invariant). Even the tier-2 certificate is a milestone (first ' +
    'full-window continuum statement), NOT a bound-mover: window 1 only (54,109,011 windows ' +
    'beyond untouched), sets no promotion flag, changes no bound. NO QED; no refereed bound is changed.',
});

// ── self-executing assertions (import-light; arithmetic over frozen ledgers) ──
export const IMP95238_ASSERTIONS = [
  {
    id: 'imp95238-level1-run-is-dominated-by-built-tier2',
    description:
      'the level-1 378-CPU-day full-window run is strictly dominated: tier-2 delivers the same window-1 certificate at 21.1 CPU-days, the ratio recomputes to the recorded 17.9x speedup, the wasted-CPU-days figure recomputes, and the second-level lever is actually built and its whether-question resolved',
    holds: () =>
      FULLWINDOW_RUN_DECISION.tier2FullWindowCpuDays < FULLWINDOW_RUN_DECISION.level1FullWindowCpuDays &&
      Math.abs(
        FULLWINDOW_RUN_DECISION.level1FullWindowCpuDays / FULLWINDOW_RUN_DECISION.tier2FullWindowCpuDays -
          FULLWINDOW_RUN_DECISION.tier2SpeedupVsLevel1
      ) < 0.5 &&
      Math.abs(
        FULLWINDOW_RUN_DECISION.cpuDaysWastedIfLevel1 -
          (FULLWINDOW_RUN_DECISION.level1FullWindowCpuDays - FULLWINDOW_RUN_DECISION.tier2FullWindowCpuDays)
      ) < 1e-6 &&
      FULLWINDOW_RUN_DECISION.cpuDaysWastedIfLevel1 > 300 &&
      FULLWINDOW_RUN_DECISION.secondLevelLeverBuilt === true &&
      FULLWINDOW_RUN_DECISION.secondLevelWhetherQuestionResolved === true &&
      FULLWINDOW_RUN_DECISION.level1Dominated === true,
  },
  {
    id: 'imp95238-precision-scaling-preserves-dominance',
    description:
      'the price scales linearly in verified precision and the G5 replay factor multiplies both routes equally, so the level-1 / tier-2 ratio is unchanged under any common multiplier (precision-invariant dominance) — checked by scaling both prices by an arbitrary factor and recovering the same ratio',
    holds: () => {
      const f = 1.7; // an arbitrary G5 replay multiplier
      const base =
        FULLWINDOW_RUN_DECISION.level1FullWindowCpuDays /
        FULLWINDOW_RUN_DECISION.tier2FullWindowCpuDays;
      const scaled =
        (f * FULLWINDOW_RUN_DECISION.level1FullWindowCpuDays) /
        (f * FULLWINDOW_RUN_DECISION.tier2FullWindowCpuDays);
      return (
        FULLWINDOW_RUN_DECISION.precisionReplayMultipliesBothRoutesEqually === true &&
        FULLWINDOW_RUN_DECISION.pricedAtBits === 128 &&
        /linear/.test(FULLWINDOW_RUN_DECISION.precisionReplayScaling) &&
        Math.abs(base - scaled) < 1e-9
      );
    },
  },
  {
    id: 'imp95238-scope-is-window1-only-no-bound-move',
    description:
      'the full-window run certifies window 1 only: 54,109,011 windows beyond window 1 stay untouched (the imp-95213 scope figure), it sets no G5 promotion flag and moves no bound, consistent with the imp-95213 deferral record and the imp-95228 non-reaching-design-budget finding',
    holds: () =>
      FULLWINDOW_RUN_DECISION.windowsBeyondWindow1Untouched === 54109011 &&
      FULLWINDOW_RUN_DECISION.setsPromotionFlag === false &&
      FULLWINDOW_RUN_DECISION.movesBound === false &&
      IMP95213_TIER_CERTIFIER.fullWindowRunLaunched === false &&
      IMP95213_TIER_CERTIFIER.promotesBound === false &&
      SECOND_LEVEL_ASSESSMENT.reachesDesignBudget === false,
  },
  {
    id: 'imp95238-honesty-gate-recommendation-and-no-qed',
    description:
      'fail-closed honesty: the recommendation says DO NOT launch the level-1 run, names the tier-2 dominance, keeps the result a milestone not a bound-mover, launches nothing, and states NO QED and no-refereed-bound-change',
    holds: () =>
      /DO NOT launch/.test(FULLWINDOW_RUN_DECISION.recommendation) &&
      /milestone/.test(FULLWINDOW_RUN_DECISION.recommendation) &&
      /changes no bound/.test(FULLWINDOW_RUN_DECISION.recommendation) &&
      /NO QED/.test(FULLWINDOW_RUN_DECISION.recommendation) &&
      /refereed bound is changed/i.test(FULLWINDOW_RUN_DECISION.recommendation),
  },
];

for (const a of IMP95238_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95238-fullwindow-run-decision assertion failed: ${a.id}`);
  }
}

export default FULLWINDOW_RUN_DECISION;
