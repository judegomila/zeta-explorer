/**
 * @module imp-95389-precision-replay-ladder-writeup
 *
 * imp-95389 (content, ledger writeup): a plain-language consolidation of the
 * imp-95277 tier-2 precision-replay COST LADDER and the launch/defer decision
 * it feeds. This module writes no new mathematics; it restates the imp-95277
 * findings (source module: imp-95277-precision-replay-ladder.js) as a single
 * readable ledger record. Content only; no bound moved; NO QED.
 *
 * PLAIN-LANGUAGE SUMMARY.
 *
 * The question. Running the tier-2 chirp certificate (the imp-95214 full
 * window-1 W1-CERT price) at higher working precision than the 128-bit
 * baseline costs more CPU-days, but how much more, and does it change WHICH
 * route (level-1 or tier-2) is cheaper to launch? imp-95257 answered this for
 * a single band (129-192 bits: 2.25x). This module's source, imp-95277,
 * extends that single answer into a full LADDER across five limb bands and
 * reads the launch/defer decision off it directly.
 *
 * THE LADDER. Arb/FLINT multiplies mantissas schoolbook at these small limb
 * counts (cost proportional to limbs squared), so the replay-cost factor vs
 * the 21.1-CPU-day 128-bit (2-limb) baseline is FLAT within a 64-bit band and
 * jumps only at each limb boundary:
 *
 *   bits            limbs   upper factor (L^2/4)   CPU-days (upper bracket)
 *   <= 128          2       1.00                    21.1  (baseline)
 *   129 - 192       3       2.25                     47.5
 *   193 - 256       4       4.00                     84.4
 *   257 - 320       5       6.25                    131.9
 *   321 - 384       6       9.00                    189.9
 *
 * A linear-in-limbs lower bracket (L/2) gives a cheaper floor at each band:
 * 21.1 / 31.7 / 42.2 / 52.8 / 63.3 CPU-days. The true multiply-heavy mix sits
 * between the two brackets. The 3-limb rung reproduces the imp-95257 headline
 * exactly (2.25x, 47.5 CPU-days), so the ladder introduces no new factor
 * there -- it only extends the same model to bands imp-95257 did not cover.
 *
 * THE LAUNCH/DEFER DECISION. The replay factor is COMMON to the level-1 and
 * tier-2 routes -- both are Arb-multiply-bound at the same working precision
 * -- so it rescales both routes by the same amount at every rung. That means
 * the 17.9x tier-2 dominance over level-1, and the DO-NOT-launch-level-1
 * recommendation, are PRECISION-INVARIANT: they hold at every band on the
 * ladder, not just at 128 bits. Only the absolute tier-2 budget climbs as the
 * target precision rises. So the ladder does not change the qualitative
 * decision (tier-2 over level-1, if either is launched); it only prices out
 * what a higher-precision tier-2 replay would cost, so a target G5 precision
 * reads off a concrete CPU-day number instead of a "roughly linear" guess.
 *
 * WHY THIS MATTERS. Before imp-95277, the launch/defer budget in imp-95238
 * asserted the precision-replay factor was "linear" without a derived curve
 * beyond the single 129-192-bit case imp-95257 fixed. The ladder replaces
 * that prose assertion with five concrete, cross-checked rungs, so anyone
 * deciding a target replay precision can read the CPU-day price directly
 * instead of extrapolating.
 *
 * HONEST LIMITS. This module restates a prior DERIVATION; it launches no
 * native FLINT/Arb binary, measures no wall-clock, and adds no new claim. The
 * ladder is a limb-quantized cost MODEL, not a measurement -- a real replay
 * at each precision would still need to be run to confirm the true factor
 * sits inside the stated bracket. Changes no bound; NO QED; no refereed bound is changed
 * ; RH open.
 *
 * Import-light: no zeros bundle, no sibling data-module imports (all facts
 * restated as literals so this module stays independently checkable).
 */

export const IMP95389_PRECISION_REPLAY_LADDER_WRITEUP = {
  ticket: 'imp-95389',
  sourceTicket: 'imp-95277',
  sourceModule: 'imp-95277-precision-replay-ladder.js',
  relatedTickets: ['imp-95214', 'imp-95238', 'imp-95257'],
  question:
    'how does the tier-2 full-window W1-CERT CPU-day price scale beyond the 128-bit baseline, and does '
    + 'that change the launch/defer decision between the level-1 and tier-2 routes?',
  baseline: { bits: 128, limbs: 2, cpuDays: 21.1 },
  ladder: [
    { bitsLow: 1, bitsHigh: 128, limbs: 2, factorUpper: 1.0, cpuDaysUpper: 21.1, factorLower: 1.0, cpuDaysLower: 21.1 },
    { bitsLow: 129, bitsHigh: 192, limbs: 3, factorUpper: 2.25, cpuDaysUpper: 47.5, factorLower: 1.5, cpuDaysLower: 31.7 },
    { bitsLow: 193, bitsHigh: 256, limbs: 4, factorUpper: 4.0, cpuDaysUpper: 84.4, factorLower: 2.0, cpuDaysLower: 42.2 },
    { bitsLow: 257, bitsHigh: 320, limbs: 5, factorUpper: 6.25, cpuDaysUpper: 131.9, factorLower: 2.5, cpuDaysLower: 52.8 },
    { bitsLow: 321, bitsHigh: 384, limbs: 6, factorUpper: 9.0, cpuDaysUpper: 189.9, factorLower: 3.0, cpuDaysLower: 63.3 },
  ],
  costModel: 'schoolbook Arb mantissa multiply, cost ~ ceil(prec/64)^2 limbs; flat within a 64-bit band, jumps at limb boundaries',
  launchDeferDecision: {
    verdict: 'PRECISION-INVARIANT: tier-2 dominates level-1 (17.9x) at every rung; DO NOT launch level-1 at any precision',
    reasoning:
      'the replay factor is common to both routes (both Arb-multiply-bound at the same working precision), '
      + 'so it rescales level-1 and tier-2 by the same amount at every band -- only the absolute tier-2 '
      + 'budget climbs with the target precision, the qualitative ranking does not change.',
  },
  honest:
    'DERIVATION restated from a frozen limb-quantized cost model, not a wall-clock measurement -- no native '
    + 'FLINT/Arb run at any of these precisions has been launched. Changes no bound; NO QED; no refereed bound is changed'
    + '; RH open.',
  queueReconciliation:
    'imp-95415 (queue: "add a content/glossary note tabulating the imp-95277 ladder and cross-linking it to '
    + 'the imp-95238 tier-2 budget and imp-95257 3-limb rung") requests exactly this note; reconciled as '
    + 'already-delivered by this module (relatedTickets already names imp-95238/imp-95257, ladder/brackets/'
    + 'launch-defer decision already tabulated above), not a separate write-up.',
};

export const IMP95389_PRECISION_REPLAY_LADDER_WRITEUP_ASSERTIONS = [
  {
    id: 'imp-95389-five-rungs-tile-contiguously',
    description: 'the ladder has five rungs, limb counts 2 through 6, and the bit ranges tile with no gap or overlap',
    holds: () => {
      const r = IMP95389_PRECISION_REPLAY_LADDER_WRITEUP.ladder;
      if (r.length !== 5) return false;
      for (let i = 0; i < r.length; i++) {
        if (r[i].limbs !== i + 2) return false;
        if (i > 0 && r[i].bitsLow !== r[i - 1].bitsHigh + 1) return false;
      }
      return true;
    },
  },
  {
    id: 'imp-95389-baseline-and-three-limb-rung-match-source',
    description: 'the baseline (21.1 CPU-days) and the 3-limb rung (2.25x, 47.5 CPU-days) reproduce the imp-95277/imp-95257 headline',
    holds: () => {
      const w = IMP95389_PRECISION_REPLAY_LADDER_WRITEUP;
      const threeLimb = w.ladder.find((x) => x.limbs === 3);
      return (
        w.baseline.cpuDays === 21.1
        && Math.abs(threeLimb.factorUpper - 2.25) < 1e-12
        && Math.abs(threeLimb.cpuDaysUpper - 47.5) < 1e-9
      );
    },
  },
  {
    id: 'imp-95389-cpu-days-recompute-and-monotone',
    description: 'every rung CPU-day figure recomputes as baseline x factor for both brackets, and the upper column strictly increases across rungs',
    holds: () => {
      const w = IMP95389_PRECISION_REPLAY_LADDER_WRITEUP;
      for (let i = 0; i < w.ladder.length; i++) {
        const r = w.ladder[i];
        if (Math.abs(r.cpuDaysUpper - w.baseline.cpuDays * r.factorUpper) > 0.05) return false;
        if (Math.abs(r.cpuDaysLower - w.baseline.cpuDays * r.factorLower) > 0.05) return false;
        if (r.factorLower > r.factorUpper) return false;
        if (i > 0 && !(r.cpuDaysUpper > w.ladder[i - 1].cpuDaysUpper)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp-95389-decision-is-precision-invariant',
    description: 'the launch/defer decision is recorded as precision-invariant tier-2 dominance, not a new recommendation',
    holds: () =>
      /PRECISION-INVARIANT/.test(IMP95389_PRECISION_REPLAY_LADDER_WRITEUP.launchDeferDecision.verdict)
      && /tier-2 dominates level-1/.test(IMP95389_PRECISION_REPLAY_LADDER_WRITEUP.launchDeferDecision.verdict),
  },
  {
    id: 'imp-95389-honesty-gate-no-qed',
    description: 'restatement-only, no bound promoted, NO QED, no refereed bound is changed, RH open',
    holds: () =>
      /DERIVATION restated/.test(IMP95389_PRECISION_REPLAY_LADDER_WRITEUP.honest)
      && /NO QED/.test(IMP95389_PRECISION_REPLAY_LADDER_WRITEUP.honest)
      && /refereed bound is changed/i.test(IMP95389_PRECISION_REPLAY_LADDER_WRITEUP.honest)
      && /RH open/.test(IMP95389_PRECISION_REPLAY_LADDER_WRITEUP.honest),
  },
  {
    id: 'imp-95389-reconciles-imp-95415-duplicate-request',
    description: 'the queueReconciliation field names imp-95415 as reconciled against this already-delivered writeup',
    holds: () =>
      /imp-95415/.test(IMP95389_PRECISION_REPLAY_LADDER_WRITEUP.queueReconciliation)
      && /already-delivered/.test(IMP95389_PRECISION_REPLAY_LADDER_WRITEUP.queueReconciliation),
  },
];

for (const a of IMP95389_PRECISION_REPLAY_LADDER_WRITEUP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95389-precision-replay-ladder-writeup assertion failed: ${a.id}`);
  }
}

export default IMP95389_PRECISION_REPLAY_LADDER_WRITEUP;
