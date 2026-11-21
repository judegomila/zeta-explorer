/**
 * @module imp-34260-crossover-surplus-family-viz-data
 * @fileoverview imp-34260 -- VIZ DATA ONLY for the imp-34174 crossover surplus(thr) family
 *   and its N_cross(thr) tail recession across the generalised threshold family
 *   thr in {0.5, 0.3, 0.1, 0.05, 0.01}.
 *
 *   surplus(thr) = thr - sigma(N_cross(thr)) = thr(1-thr)r/(1+(1-thr)r), r = E_flow(N_cross)/E_trunc
 *   (imp-34174, reusing the IDENTICAL imp-33743/imp-33848 sub-terms). As thr shrinks the
 *   crossover N_cross(thr) RECEDES deep into the tail (3.280e9 -> 4.624e13), E_flow/E_trunc
 *   decays there (1.899e-3 -> 4.255e-7, the imp-33620 vanishing-E_flow reading), and the
 *   surplus collapses monotonically. The surplus first drops below 1e-4 at thr ~ 0.3137
 *   (N_cross ~ 1.687e10).
 *
 *   Values below are baked reference literals, reproduced exactly by re-evaluating the
 *   imp-34174 module's surplusLadder/surplusBelow1em4 fields (direct import + JSON dump,
 *   not re-derived here). This module does NOT import lambda-rh-height-mapping.js or
 *   polymath15-constant-C-C.js -- no fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34174-crossover-surplus-threshold-family-decay.js (source measurement: closed form + ladder)
 *   @see imp-33848 (roadmap: sigma(N_cross) = 1/(2 + E_flow/E_trunc), surplus is the E_flow/E_trunc term)
 *   @see imp-33743-sigma-fartail-crossover-closed-form.js (generalised crossover N_cross(thr))
 *
 *   Ticket: imp-34260 (ux, low). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

// -- surplus(thr) family ladder, thr = 0.5 -> 0.01 (baked from imp-34174 surplusLadder) --
export const IMP34260_SURPLUS_FAMILY_LADDER = Object.freeze([
  Object.freeze({ thr: 0.5, N_cross: 3.280294e9, eFlowOverETrunc: 1.8992e-3, surplus: 4.7436e-4 }),
  Object.freeze({ thr: 0.3, N_cross: 1.930037e10, eFlowOverETrunc: 4.1348e-4, surplus: 8.6806e-5 }),
  Object.freeze({ thr: 0.1, N_cross: 3.213418e11, eFlowOverETrunc: 3.5486e-5, surplus: 3.1936e-6 }),
  Object.freeze({ thr: 0.05, N_cross: 1.516599e12, eFlowOverETrunc: 9.009e-6, surplus: 4.2793e-7 }),
  Object.freeze({ thr: 0.01, N_cross: 4.624385e13, eFlowOverETrunc: 4.2552e-7, surplus: 4.2126e-9 }),
]);

// -- surplus-below-1e-4 crossing marker (imp-34174 surplusBelow1em4) --
export const IMP34260_SURPLUS_1EM4_CROSSING = Object.freeze({
  thrStar: 0.313723,
  N_cross_at_thrStar: 1.686719e10,
  threshold: 1e-4,
  label: 'surplus first drops below 1e-4 at thr ~ 0.3137 (N_cross ~ 1.687e10)',
});

export default Object.freeze({
  id: 'imp-34260-crossover-surplus-family-viz-data',
  ticket: 'imp-34260',
  source: 'imp-34174-crossover-surplus-threshold-family-decay.js',
  surplusFamilyLadder: IMP34260_SURPLUS_FAMILY_LADDER,
  surplus1em4Crossing: IMP34260_SURPLUS_1EM4_CROSSING,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34260_ASSERTIONS = [
  {
    id: 'imp34260-ladder-has-five-thresholds-in-descending-order',
    holds: () => {
      const thrs = IMP34260_SURPLUS_FAMILY_LADDER.map((r) => r.thr);
      return (
        thrs.length === 5 &&
        thrs.every((t, i) => i === 0 || t < thrs[i - 1]) &&
        thrs[0] === 0.5 &&
        thrs[thrs.length - 1] === 0.01
      );
    },
    why: 'The threshold family must be exactly {0.5,0.3,0.1,0.05,0.01} in strictly descending order (imp-34174).',
  },
  {
    id: 'imp34260-surplus-and-Ncross-monotone-across-shrinking-thr',
    holds: () =>
      IMP34260_SURPLUS_FAMILY_LADDER.every(
        (r, i) =>
          i === 0 ||
          (r.surplus < IMP34260_SURPLUS_FAMILY_LADDER[i - 1].surplus &&
            r.N_cross > IMP34260_SURPLUS_FAMILY_LADDER[i - 1].N_cross)
      ),
    why: 'As thr shrinks the surplus must collapse monotonically while N_cross recedes monotonically deeper into the tail.',
  },
  {
    id: 'imp34260-halving-anchor-matches-imp34174',
    holds: () => {
      const half = IMP34260_SURPLUS_FAMILY_LADDER.find((r) => r.thr === 0.5);
      return Math.abs(half.surplus - 4.7436e-4) < 1e-8 && Math.abs(half.N_cross - 3.280294e9) / 3.280294e9 < 1e-6;
    },
    why: 'The thr=1/2 rung must reproduce the imp-33848 halving surplus and N_cross anchor exactly.',
  },
  {
    id: 'imp34260-crossing-marker-between-half-and-thr0p3-rungs',
    holds: () =>
      IMP34260_SURPLUS_1EM4_CROSSING.thrStar > 0.3 &&
      IMP34260_SURPLUS_1EM4_CROSSING.thrStar < 0.5 &&
      IMP34260_SURPLUS_1EM4_CROSSING.N_cross_at_thrStar > IMP34260_SURPLUS_FAMILY_LADDER[0].N_cross &&
      IMP34260_SURPLUS_1EM4_CROSSING.N_cross_at_thrStar < IMP34260_SURPLUS_FAMILY_LADDER[1].N_cross,
    why: 'The surplus-below-1e-4 crossing thr* ~ 0.3137 must sit strictly between the thr=0.5 and thr=0.3 rungs, consistent with N_cross(thr*) sitting between their N_cross values.',
  },
];

for (const assertion of IMP34260_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34260-crossover-surplus-family-viz-data assertion failed: ${assertion.id}`);
  }
}
