/**
 * imp-95228 — ASSESSMENT of the frequency-bin second-level residual lever
 * for the W1-CERT tier certifier (panel chirp recurrence + Lemma-A derotated
 * bin remainders + Lemma-B subpanel collapse) as the claimed 10-100x
 * ball-op-gap closer.
 *
 * WHY THIS TICKET EXISTS. The frontier scout seeded imp-95228 from the
 * imp-95213 TIER_PRICE.residualLever field, which named the frequency-bin
 * second level as the identified 10-100x lever between the measured ~1.0e15
 * ball-ops and the 1.1e13 two-level design budget (~92x gap) but recorded it
 * as "NOT built here". The ticket asks: prototype and measure the achievable
 * amortization of the per-panel O(N) pass on a sub-slice, and report whether
 * the second level realistically REACHES the design budget or is BLOCKED.
 *
 * FINDING (assessment, not a fresh build). The lever named by imp-95213 has
 * SINCE been built, validated and priced by imp-95214-tier2-chirp-level (a
 * later ticket than the imp-95213 field the scout read). This ticket does not
 * duplicate that build; it records the honest ANSWER to the whether-question
 * the scout asked, from imp-95214's measured numbers:
 *
 *  (1) ACHIEVABLE AMORTIZATION OF THE PANEL O(N) PASS — REALIZED, LARGE.
 *      One O(N) Arb super-pass now covers K = 31 level-1 panels (HXused
 *      = 97.32 x-units), so the per-panel O(N) pass rate collapsed from the
 *      level-1 0.9159 CPU-s/x-unit to the amortized 0.0170 (a ~54x cut on the
 *      pass itself). The panel pass fell from 97.4% of level-1 cost to 32% of
 *      tier-2 cost: it is no longer the dominant term.
 *
 *  (2) DOES THE SECOND LEVEL REACH THE DESIGN BUDGET? NO. The full-window
 *      analytic ball-op count is 1.5456e14 = 6.5x below level 1's 1.0086e15
 *      but still 14.05x ABOVE the 1.1e13 two-level design budget. The overall
 *      CPU speedup is 17.9x (21.1 vs 378 CPU-days) — the identified "10-100x
 *      lever" lands INSIDE its band at ~18x, NOT at the ~92x that reaching the
 *      design budget would require.
 *
 *  (3) IS IT BLOCKED? The PANEL O(N) lever is SPENT. Reaching the design
 *      budget by further panel-pass batching is blocked: after amortization
 *      the cost floor is cell (37%) + reconstruction (31%) dominated, and the
 *      1.1e13 design estimate priced only ~1e3 ball-ops/cell with no
 *      reconstruction term at all. The residual is cell/reconstruction-
 *      dominated, honestly out of reach of the frequency-bin lever. (The
 *      cell/reconstruction decomposition is the scope of the successor
 *      imp-95229, not this whether-question.)
 *
 * VERDICT: the scout ticket is RESOLVED — the lever is built and measured;
 * it delivers ~18x (inside its named band) but does NOT reach the 1.1e13
 * design budget; the panel-pass lever is spent and the residual gap is
 * cell/reconstruction-dominated. Assessment only; carries no new computation
 * beyond arithmetic over the imp-95214 measured ledger; promotes nothing;
 * changes no bound; NO QED; no refereed bound is changed.
 */

import {
  TIER2_LEDGER,
  TIER2_PRICE,
  IMP95214_TIER2_CHIRP,
} from './imp-95214-tier2-chirp-level.js';

// ── the frozen scout premise (imp-95213 residualLever field values) ──────────
export const SCOUT_PREMISE = Object.freeze({
  source: 'imp-95213-tier-certifier-build TIER_PRICE.residualLever',
  level1BallOpsFullWindow: 1.0086e15,     // "measured 1.0e15 ball-ops"
  designTierBudgetBallOps: 1.1e13,        // "1.1e13 design budget"
  gapRatioVsDesign: 91.7,                 // "~92x" single-level Taylor
  identifiedLeverBandLow: 10,             // "10-100x" residual lever band
  identifiedLeverBandHigh: 100,
  builtAtScoutTime: false,                // "NOT built here"
});

// ── the answer, read off the imp-95214 measured ledger ───────────────────────
export const SECOND_LEVEL_ASSESSMENT = Object.freeze({
  ticket: 'imp-95228-second-level-lever-assessment',
  supersedingBuild: 'imp-95214-tier2-chirp-level (built + validated + priced)',
  // (1) achievable panel-pass amortization
  panelsAmortizedPerSuperPass: TIER2_LEDGER.panelsPerSuper,  // K = 31
  panelPassRateLevel1: 0.9159,             // CPU-s/x-unit, the O(N) pass alone
  panelPassRateTier2: TIER2_PRICE.measured.superSecondsPerXUnit, // 0.0170
  panelPassShareOfLevel1Cost: 0.974,       // 97.4% at level 1
  panelPassShareOfTier2Cost:
    TIER2_PRICE.measured.superSecondsPerXUnit / TIER2_PRICE.measured.cpuSecondsPerXUnit, // ~0.32
  // (2) does it reach the design budget?
  fullWindowBallOps: TIER2_PRICE.fullWindow.ballOpsAtSliceRate, // 1.5456e14
  ballOpsRatioVsDesign: TIER2_PRICE.baselines.ballOpsRatioVsDesign, // 14.05
  overallSpeedupVsLevel1: TIER2_PRICE.baselines.speedupVsLevel1,    // 17.9x
  reachesDesignBudget: false,
  // (3) is it blocked?
  panelLeverSpent: true,
  residualIsCellReconstructionDominated: true,
  cellShareOfTier2Cost:
    TIER2_PRICE.measured.cellSecondsPerXUnit / TIER2_PRICE.measured.cpuSecondsPerXUnit, // ~0.37
  reconShareOfTier2Cost:
    TIER2_PRICE.measured.reconSecondsPerXUnit / TIER2_PRICE.measured.cpuSecondsPerXUnit, // ~0.31
  successorForResidual: 'imp-95229 (cell vs reconstruction cost decomposition)',
  verdict:
    'RESOLVED: the frequency-bin second level named by imp-95213 was built + measured in ' +
    'imp-95214; it amortizes the per-panel O(N) pass 31x (pass rate 0.9159 -> 0.017 CPU-s/x-unit) ' +
    'for a ~18x overall speedup that lands INSIDE the identified 10-100x band, but it does NOT ' +
    'reach the 1.1e13 two-level design budget: full-window ball-ops 1.55e14 sit 14x above it. ' +
    'The panel O(N) lever is SPENT; the residual gap is cell/reconstruction-dominated (out of ' +
    'reach of further panel batching), which is the successor imp-95229 scope. Assessment only; ' +
    'changes no bound; NO QED; no refereed bound is changed.',
});

// ── self-executing assertions (import-light; arithmetic over imp-95214) ──────
export const IMP95228_ASSERTIONS = [
  {
    id: 'imp95228-panel-pass-amortized-not-dominant',
    description:
      'the achievable panel-pass amortization is realized and large: 31 level-1 panels per O(N) super-pass, the pass rate collapses from 0.9159 to the measured super rate (< 0.03 CPU-s/x-unit, > 30x), and the panel pass is no longer dominant (< 40% of tier-2 cost vs 97.4% at level 1)',
    holds: () =>
      SECOND_LEVEL_ASSESSMENT.panelsAmortizedPerSuperPass === 31 &&
      TIER2_PRICE.measured.superSecondsPerXUnit < 0.03 &&
      SECOND_LEVEL_ASSESSMENT.panelPassRateLevel1 / TIER2_PRICE.measured.superSecondsPerXUnit > 30 &&
      SECOND_LEVEL_ASSESSMENT.panelPassShareOfTier2Cost < 0.4 &&
      SECOND_LEVEL_ASSESSMENT.panelPassShareOfLevel1Cost > 0.9,
  },
  {
    id: 'imp95228-does-not-reach-design-budget',
    description:
      'the whether-answer is NO: the tier-2 full-window ball-op count is 6.5x below level 1 yet still 14x ABOVE the 1.1e13 design budget, and the overall speedup 17.9x lands inside the identified 10-100x band but far short of the ~92x that reaching the design budget requires',
    holds: () => {
      const ratio =
        TIER2_PRICE.fullWindow.ballOpsAtSliceRate / SCOUT_PREMISE.designTierBudgetBallOps;
      return (
        SECOND_LEVEL_ASSESSMENT.reachesDesignBudget === false &&
        Math.abs(ratio - SECOND_LEVEL_ASSESSMENT.ballOpsRatioVsDesign) < 0.3 &&
        ratio > 1 &&
        SECOND_LEVEL_ASSESSMENT.overallSpeedupVsLevel1 >= SCOUT_PREMISE.identifiedLeverBandLow &&
        SECOND_LEVEL_ASSESSMENT.overallSpeedupVsLevel1 <= SCOUT_PREMISE.identifiedLeverBandHigh &&
        SECOND_LEVEL_ASSESSMENT.overallSpeedupVsLevel1 < SCOUT_PREMISE.gapRatioVsDesign
      );
    },
  },
  {
    id: 'imp95228-residual-is-cell-reconstruction-dominated',
    description:
      'the block is honestly localized: after amortization the panel lever is spent and cell + reconstruction shares dominate the tier-2 cost (their sum exceeds the panel-pass share), the three component rates sum to the total, and the successor for the residual decomposition is named (imp-95229)',
    holds: () => {
      const m = TIER2_PRICE.measured;
      const cellShare = SECOND_LEVEL_ASSESSMENT.cellShareOfTier2Cost;
      const reconShare = SECOND_LEVEL_ASSESSMENT.reconShareOfTier2Cost;
      return (
        SECOND_LEVEL_ASSESSMENT.panelLeverSpent === true &&
        SECOND_LEVEL_ASSESSMENT.residualIsCellReconstructionDominated === true &&
        cellShare + reconShare > SECOND_LEVEL_ASSESSMENT.panelPassShareOfTier2Cost &&
        Math.abs(
          m.superSecondsPerXUnit + m.reconSecondsPerXUnit + m.cellSecondsPerXUnit -
            m.cpuSecondsPerXUnit
        ) < 1e-3 &&
        /imp-95229/.test(SECOND_LEVEL_ASSESSMENT.successorForResidual)
      );
    },
  },
  {
    id: 'imp95228-honesty-gate-no-qed',
    description:
      'fail-closed honesty: the scout premise is faithfully carried (NOT built at scout time, ~92x gap), the assessment supersedes onto the imp-95214 build which promotes no bound, and the verdict states NO QED and no-refereed-bound-change',
    holds: () =>
      SCOUT_PREMISE.builtAtScoutTime === false &&
      Math.abs(SCOUT_PREMISE.gapRatioVsDesign - 91.7) < 0.1 &&
      IMP95214_TIER2_CHIRP.promotesBound === false &&
      /RESOLVED/.test(SECOND_LEVEL_ASSESSMENT.verdict) &&
      /NO QED/.test(SECOND_LEVEL_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(SECOND_LEVEL_ASSESSMENT.verdict),
  },
];

for (const a of IMP95228_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95228-second-level-lever-assessment assertion failed: ${a.id}`);
  }
}

export default SECOND_LEVEL_ASSESSMENT;
