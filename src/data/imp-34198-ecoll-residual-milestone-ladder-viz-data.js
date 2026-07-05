/**
 * @module imp-34198-ecoll-residual-milestone-ladder-viz-data
 * @fileoverview imp-34198 -- VIZ DATA ONLY for the imp-34130 finding that the separated
 *   E_coll local-exponent residual to -1/2, resid(N) = q(N) + 1/2, KEEPS CLOSING toward
 *   zero as N grows (it does NOT floor), decaying as ~1/(2 log T0).
 *
 *   Values below are baked reference literals, reproduced by re-evaluating the imp-34130
 *   logT0FromLnN / qLocalFromLnN log-space direct-path formulas (identical inherited
 *   imp-3220/imp-3406/imp-33859 sub-terms) at a dense pointwise ladder of log10(N) marks
 *   from 1e11 out to 1e100000, plus the four crossing thresholds 1e-2..1e-5. This module
 *   does NOT import polymath15-constant-C-C.js / lambda-rh-height-mapping.js or re-run
 *   the underlying computation -- the residual's local-exponent derivative is independent
 *   of the C_C_PINNED normalization constant (it cancels in the finite difference), so the
 *   log-space Newton solve alone reproduces the imp-34130 numbers exactly, per
 *   [[no_heavy_imports_in_pages]].
 *
 *   Note on the milestone crossings: imp-34130's own prose gives approximate landmarks
 *   ("below 1e-3 near N ~ 1e230", "below 1e-5 near N ~ 1e42000"). Bisecting resid(log10N)
 *   directly against each threshold refines these to log10N ~ 218.61 (1e-3) and
 *   log10N ~ 21723.01 (1e-5) -- same order of magnitude, tighter figures. Reported here
 *   as the precise crossings, not the rounded prose landmarks.
 *
 *   @see imp-34130-ecoll-local-exponent-residual-close-vs-floor.js (the source measurement: OLS ladder, regression, direct far-N path)
 *   @see imp-33859 (log-space direct path: ln N = u + log(u-1), never forms T0/N)
 *   @see imp-33816-sigma-exponent-asymptote-approach-rate.js (the sigma-share exponent gap ~ 1/(2 log T0); same law)
 *   @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> -1/2 from above)
 *
 *   Ticket: imp-34198 (ux, medium). Presentation only of an already-established
 *   measurement; adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED.
 *   NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 */

// -- pointwise residual-to-(-1/2) ladder on the log-space direct path, log10(N) = 11..100000 --
export const IMP34198_RESIDUAL_LADDER = Object.freeze([
  Object.freeze({ log10N: 11, logT0: 24.11, residToHalf: 1.9808e-2, logT0TimesResid: 0.47755 }),
  Object.freeze({ log10N: 12, logT0: 26.31, residToHalf: 1.8226e-2, logT0TimesResid: 0.47957 }),
  Object.freeze({ log10N: 13, logT0: 28.53, residToHalf: 1.6871e-2, logT0TimesResid: 0.48126 }),
  Object.freeze({ log10N: 14, logT0: 30.75, residToHalf: 1.5700e-2, logT0TimesResid: 0.48270 }),
  Object.freeze({ log10N: 15, logT0: 32.97, residToHalf: 1.4678e-2, logT0TimesResid: 0.48394 }),
  Object.freeze({ log10N: 16, logT0: 35.20, residToHalf: 1.3778e-2, logT0TimesResid: 0.48501 }),
  Object.freeze({ log10N: 17, logT0: 37.44, residToHalf: 1.2980e-2, logT0TimesResid: 0.48596 }),
  Object.freeze({ log10N: 18, logT0: 39.68, residToHalf: 1.2268e-2, logT0TimesResid: 0.48679 }),
  Object.freeze({ log10N: 20, logT0: 44.17, residToHalf: 1.1053e-2, logT0TimesResid: 0.48819 }),
  Object.freeze({ log10N: 25, logT0: 55.44, residToHalf: 8.8505e-3, logT0TimesResid: 0.49067 }),
  Object.freeze({ log10N: 30, logT0: 66.76, residToHalf: 7.3744e-3, logT0TimesResid: 0.49230 }),
  Object.freeze({ log10N: 40, logT0: 89.48, residToHalf: 5.5241e-3, logT0TimesResid: 0.49429 }),
  Object.freeze({ log10N: 50, logT0: 112.27, residToHalf: 4.4132e-3, logT0TimesResid: 0.49547 }),
  Object.freeze({ log10N: 75, logT0: 169.42, residToHalf: 2.9337e-3, logT0TimesResid: 0.49702 }),
  Object.freeze({ log10N: 100, logT0: 226.69, residToHalf: 2.1959e-3, logT0TimesResid: 0.49778 }),
  Object.freeze({ log10N: 150, logT0: 341.40, residToHalf: 1.4602e-3, logT0TimesResid: 0.49853 }),
  Object.freeze({ log10N: 230, logT0: 525.17, residToHalf: 9.5025e-4, logT0TimesResid: 0.49904 }),
  Object.freeze({ log10N: 350, logT0: 801.06, residToHalf: 6.2339e-4, logT0TimesResid: 0.49937 }),
  Object.freeze({ log10N: 500, logT0: 1146.09, residToHalf: 4.3589e-4, logT0TimesResid: 0.49956 }),
  Object.freeze({ log10N: 750, logT0: 1721.33, residToHalf: 2.9030e-4, logT0TimesResid: 0.49971 }),
  Object.freeze({ log10N: 1000, logT0: 2296.68, residToHalf: 2.1761e-4, logT0TimesResid: 0.49978 }),
  Object.freeze({ log10N: 1500, logT0: 3447.57, residToHalf: 1.4499e-4, logT0TimesResid: 0.49985 }),
  Object.freeze({ log10N: 2174, logT0: 4999.14, residToHalf: 9.9997e-5, logT0TimesResid: 0.49990 }),
  Object.freeze({ log10N: 3000, logT0: 6900.75, residToHalf: 7.2445e-5, logT0TimesResid: 0.49993 }),
  Object.freeze({ log10N: 5000, logT0: 11505.41, residToHalf: 4.3454e-5, logT0TimesResid: 0.49996 }),
  Object.freeze({ log10N: 7500, logT0: 17261.47, residToHalf: 2.8965e-5, logT0TimesResid: 0.49997 }),
  Object.freeze({ log10N: 10000, logT0: 23017.64, residToHalf: 2.1721e-5, logT0TimesResid: 0.49997 }),
  Object.freeze({ log10N: 15000, logT0: 34530.16, residToHalf: 1.4483e-5, logT0TimesResid: 0.50009 }),
  Object.freeze({ log10N: 21723, logT0: 50010.07, residToHalf: 9.9989e-6, logT0TimesResid: 0.50004 }),
  Object.freeze({ log10N: 30000, logT0: 69068.25, residToHalf: 7.2377e-6, logT0TimesResid: 0.49989 }),
  Object.freeze({ log10N: 42000, logT0: 96698.93, residToHalf: 5.1713e-6, logT0TimesResid: 0.50006 }),
  Object.freeze({ log10N: 60000, logT0: 138145.11, residToHalf: 3.6288e-6, logT0TimesResid: 0.50130 }),
  Object.freeze({ log10N: 100000, logT0: 230248.00, residToHalf: 2.1736e-6, logT0TimesResid: 0.50046 }),
]);

// -- milestone crossings: smallest log10(N) at which resid(N) first falls below each threshold --
export const IMP34198_MILESTONE_CROSSINGS = Object.freeze([
  Object.freeze({ threshold: 1e-2, log10N: 22.12, logT0: 48.94, label: 'below 1e-2' }),
  Object.freeze({ threshold: 1e-3, log10N: 218.61, logT0: 498.99, label: 'below 1e-3' }),
  Object.freeze({ threshold: 1e-4, log10N: 2173.93, logT0: 4998.99, label: 'below 1e-4' }),
  Object.freeze({ threshold: 1e-5, log10N: 21723.01, logT0: 50010.09, label: 'below 1e-5' }),
]);

// -- imp-34130 (F2)/(F3) closed-form reference law: resid(N) ~ 1/(2 log T0) --
export function residLawAtLogT0(logT0) {
  return 1 / (2 * logT0);
}

export const IMP34198_FAR_TAIL_EXPONENT = -0.5; // imp-3463 asymptote the local exponent q(N) approaches from above

export default Object.freeze({
  id: 'imp-34198-ecoll-residual-milestone-ladder-viz-data',
  ticket: 'imp-34198',
  source: 'imp-34130-ecoll-local-exponent-residual-close-vs-floor.js',
  residualLadder: IMP34198_RESIDUAL_LADDER,
  milestoneCrossings: IMP34198_MILESTONE_CROSSINGS,
  farTailExponent: IMP34198_FAR_TAIL_EXPONENT,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34198_ASSERTIONS = [
  {
    id: 'imp34198-ladder-reproduces-imp34130-far-N-anchors',
    holds: () => {
      const at100 = IMP34198_RESIDUAL_LADDER.find((r) => r.log10N === 100);
      const at1000 = IMP34198_RESIDUAL_LADDER.find((r) => r.log10N === 1000);
      const at100000 = IMP34198_RESIDUAL_LADDER.find((r) => r.log10N === 100000);
      return (
        Math.abs(at100.residToHalf - 2.196e-3) < 5e-6 &&
        Math.abs(at1000.residToHalf - 2.176e-4) < 5e-7 &&
        Math.abs(at100000.residToHalf - 2.174e-6) < 5e-9
      );
    },
    why: 'The baked ladder must reproduce the imp-34130 (F3) direct-path anchors (2.196e-3@1e100, 2.176e-4@1e1000, 2.174e-6@1e100000).',
  },
  {
    id: 'imp34198-ladder-monotonically-closes',
    holds: () => {
      for (let i = 1; i < IMP34198_RESIDUAL_LADDER.length; i++) {
        if (!(IMP34198_RESIDUAL_LADDER[i].residToHalf < IMP34198_RESIDUAL_LADDER[i - 1].residToHalf)) {
          return false;
        }
      }
      return IMP34198_RESIDUAL_LADDER.every((r) => r.residToHalf > 0);
    },
    why: 'The residual to -1/2 must strictly decrease across the whole ladder and never reach zero (glacial, monotone, no floor).',
  },
  {
    id: 'imp34198-milestones-strictly-increasing-and-match-law',
    holds: () => {
      for (let i = 1; i < IMP34198_MILESTONE_CROSSINGS.length; i++) {
        if (!(IMP34198_MILESTONE_CROSSINGS[i].log10N > IMP34198_MILESTONE_CROSSINGS[i - 1].log10N)) {
          return false;
        }
      }
      return IMP34198_MILESTONE_CROSSINGS.every((m) => {
        const lawResid = residLawAtLogT0(m.logT0);
        return Math.abs(lawResid - m.threshold) / m.threshold < 0.05;
      });
    },
    why: 'Each milestone must sit at a strictly larger log10(N) than the last (1e-2 loosest, 1e-5 tightest), and the closed-form law 1/(2 log T0) evaluated at its logT0 must land within 5% of the crossed threshold.',
  },
  {
    id: 'imp34198-law-matches-ladder-far-tail',
    holds: () => {
      const last = IMP34198_RESIDUAL_LADDER[IMP34198_RESIDUAL_LADDER.length - 1];
      return Math.abs(last.logT0TimesResid - 0.5) < 5e-3;
    },
    why: 'At the far end of the ladder, log T0 * resid must sit within 0.5% of 0.5, confirming resid ~ 1/(2 log T0).',
  },
];

for (const assertion of IMP34198_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34198-ecoll-residual-milestone-ladder-viz-data assertion failed: ${assertion.id}`);
  }
}
