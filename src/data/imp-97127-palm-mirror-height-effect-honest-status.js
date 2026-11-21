/**
 * @module imp-97127-palm-mirror-height-effect-honest-status
 * @fileoverview imp-97127 -- import-light honest-status note recording the imp-97101 verdict:
 *   the neutral rigid-lattice Palm 2-slot mirror-count parity crossing (ln N* = 18.394, where the
 *   count first reaches p_req = 4.3743) is a HEIGHT effect, not a relaxation at the binding
 *   y0 = 0.165 window that theorem B1 of rh-bridge-mirror-descent-2026-09-25 actually needs.
 *
 *   WHY A NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97080 measured the neutral rigid-lattice Palm baseline at only two heights -- the binding
 *   seam ln N = 13.446 (surplus 1.730x short of p_req) and a far height N1* ln N = 18.509 (surplus
 *   0.989x, near parity) -- and read the near-parity at N1* as "a height effect, not a relaxation
 *   at y0". imp-97101 sharpened that reading into an 11-rung ladder ln N in [13.446, 22]: the
 *   2-slot count grows nearly linearly in ln N (slope ~0.395), the surplus falls MONOTONICALLY
 *   through the ladder, and the exact 2-slot parity crossing sits at ln N* = 18.39359 (N* =
 *   9.733e7), just below N1*. Critically, the fraction of the count against its own asymptotic
 *   mean (~ln N/2) stays well below 1 across the entire ladder (0.376 at the seam, 0.476 at the
 *   crossing, 0.535 at ln N = 22): parity is reached purely because the mean itself grows with
 *   height, never because the y0 = 0.165 window becomes more favorable. This note states that
 *   verdict plainly wherever the imp-97080/imp-97101 Palm mirror-count chain is presented, so a
 *   reader does not mistake the ln N* = 18.39 crossing for evidence that lowering the seam height
 *   would relax the binding hypothesis.
 *
 * @see imp-97080-palm-mirror-baseline-vs-preq-measurement.js (two-height anchor; origin of the reading)
 * @see imp-97101-palm-mirror-parity-crossing-ladder.js (11-rung ladder; exact parity-crossing height)
 * @see rh-bridge-mirror-descent-2026-09-25.js (theorem B1, p_req = 4.3743, binding y0 = 0.165 window)
 *
 * Ticket: imp-97127 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

export const IMP97127_HEIGHT_EFFECT_STATUS = Object.freeze({
  question:
    'Does the imp-97101 2-slot Palm mirror-count parity crossing at ln N* = 18.394 mean the ' +
    'binding y0 = 0.165 window has relaxed, or is it purely a taller-lattice effect?',
  seamLnN: 13.4459, // imp-97080 binding seam anchor
  seamSurplus: 1.7298, // p_req/count at the seam: 1.73x short
  seamFracOfMean: 0.3761,
  crossingLnN: 18.39359, // imp-97101 exact 2-slot parity-crossing height
  crossingN: 9.7327e7,
  crossingFracOfMean: 0.4757,
  farLadderFracOfMean: 0.5345, // at ln N = 22, still well below 1
  fracStaysBelowOneThroughout: true,
  verdictIsHeightEffect: true,
  verdictIsY0Relaxation: false,
  anyBoundMoved: false,
});

export const IMP97127_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. The imp-97101 neutral rigid-lattice Palm ' +
  '2-slot mirror-count parity crossing at ln N* = 18.394 (N* = 9.73e7, surplus p_req/count = ' +
  '1.0) is a HEIGHT effect, NOT a relaxation at the binding y0 = 0.165 window: the count grows ' +
  'nearly linearly in ln N (slope ~0.395) and its fraction of the asymptotic mean ln N/2 stays ' +
  'well below 1 across the whole measured ladder (0.376 at the seam ln N = 13.446, 0.476 at the ' +
  'crossing, 0.535 at ln N = 22 -- never approaching the full mean). Reaching parity purely ' +
  'requires climbing ~5 units of ln N (a factor ~140 in N) above the binding seam; it says ' +
  'nothing about the seam window itself becoming more favorable. No bound is claimed moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97127_ASSERTIONS = [
  {
    id: 'imp97127-status-matches-committed-imp97101-constants',
    holds: () =>
      Math.abs(IMP97127_HEIGHT_EFFECT_STATUS.seamLnN - 13.4459) < 1e-3 &&
      Math.abs(IMP97127_HEIGHT_EFFECT_STATUS.crossingLnN - 18.39359) < 1e-3 &&
      IMP97127_HEIGHT_EFFECT_STATUS.seamFracOfMean <
        IMP97127_HEIGHT_EFFECT_STATUS.crossingFracOfMean &&
      IMP97127_HEIGHT_EFFECT_STATUS.crossingFracOfMean <
        IMP97127_HEIGHT_EFFECT_STATUS.farLadderFracOfMean &&
      IMP97127_HEIGHT_EFFECT_STATUS.fracStaysBelowOneThroughout === true,
    why:
      'The status object must reproduce the imp-97101 seam/crossing constants and record the ' +
      'monotone-below-1 fraction-of-mean pattern that grounds the height-effect verdict.',
  },
  {
    id: 'imp97127-verdict-is-height-not-relaxation',
    holds: () =>
      IMP97127_HEIGHT_EFFECT_STATUS.verdictIsHeightEffect === true &&
      IMP97127_HEIGHT_EFFECT_STATUS.verdictIsY0Relaxation === false,
    why: 'The core claim this note exists to record: height effect, not a y0-window relaxation.',
  },
  {
    id: 'imp97127-honesty-gate-no-qed',
    holds: () =>
      IMP97127_HEIGHT_EFFECT_STATUS.anyBoundMoved === false &&
      /NO QED/.test(IMP97127_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97127_HONEST_BANNER) &&
      /RH open/.test(IMP97127_HONEST_BANNER) &&
      /HEIGHT effect/.test(IMP97127_HONEST_BANNER) &&
      /NOT a relaxation/.test(IMP97127_HONEST_BANNER),
    why:
      'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, and the ' +
      'height-effect-not-relaxation verdict stated explicitly.',
  },
];

for (const assertion of IMP97127_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97127-palm-mirror-height-effect-honest-status assertion failed: ${assertion.id}`,
    );
  }
}

export default {
  status: IMP97127_HEIGHT_EFFECT_STATUS,
  banner: IMP97127_HONEST_BANNER,
};
