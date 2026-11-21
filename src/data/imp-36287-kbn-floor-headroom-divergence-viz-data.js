/**
 * @module imp-36287-kbn-floor-headroom-divergence-viz-data
 *
 * imp-36287 (content, viz-only): import-light (baked-literal) viz-data module for a routed page
 * plotting the imp-36083 / imp-36135 KBN-compensated-floor versus certified-run-max headroom --
 * the N-flat KBN floor (~1.89e-20) against the sqrt(N)-rising certified rung, with the divergence
 * rate (~+0.5 orders/decade) and the unphysical N_cross < 1 crossing annotated.
 *
 * All numbers below are baked copies of the imp-36135 extrapolation ladder / crossing fields (which
 * itself extends the imp-36083 direct ladder). No recomputation here -- literals only, per the
 * "import-light" instruction.
 *
 * NOT A BOUND. Presentation only; changes no bound; certifies no W1 bound; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36083-kbn-floor-headroom-to-certified-rung (the sqrt(N)-widening headroom ladder)
 * @see imp-36135-kbn-floor-headroom-extrapolation (the extrapolation + crossing determination this bakes)
 */

// KBN floor: N-flat, anchored at the T_PT retained-term count N ~ 488602 (imp-36023 / imp-36083 / imp-36135).
export const KBN_FLOOR_ANCHOR = 1.89e-20;

// Certified run-max rung + headroom ladder (log10 of certRung / KBN_FLOOR_ANCHOR), imp-36083 direct
// rows through the anchor, imp-36135 direct rows two decades past it, then analytic extrapolation.
export const HEADROOM_LADDER = [
  { N: 1000, certRung: 2.95e-15, headroomLog10: 3.9, source: 'direct' },
  { N: 100000, certRung: 2.9e-14, headroomLog10: 5.47, source: 'direct' },
  { N: 488602, certRung: 6.41e-14, headroomLog10: 6.53, source: 'direct (T_PT anchor)' },
  { N: 1000000, certRung: 9.2e-14, headroomLog10: 6.69, source: 'direct' },
  { N: 2000000, certRung: 1.3e-13, headroomLog10: 6.84, source: 'direct' },
  { N: 1e7, certRung: 2.9e-13, headroomLog10: 7.19, source: 'extrapolated' },
  { N: 1e9, certRung: 2.9e-12, headroomLog10: 8.19, source: 'extrapolated' },
  { N: 1e12, certRung: 9.2e-11, headroomLog10: 9.69, source: 'extrapolated' },
  { N: 1e15, certRung: 3.3e-9, headroomLog10: 11.2, source: 'extrapolated' },
];

// certRung(N) ~ C * sqrt(N) fit constant (imp-36135); the sqrt(N) rise underlying the ladder above.
export const C_FIT = 9.2e-17;

// Headroom divergence rate: (orders at 1e12 - orders at 1e6) / 6 decades.
export const HEADROOM_SLOPE_PER_DECADE = 0.5;

// The crossing determination: solving C*sqrt(N) = KBN_FLOOR_ANCHOR gives N_cross = (F/C)^2 < 1 term.
export const N_CROSS = 4e-8; // unphysical: below one retained term
export const N_CROSS_CONSERVATIVE = 1.7e-5; // using the largest ladder floor (~3.74e-19); still < 1
export const NO_PHYSICAL_CROSSING = true;

export const IMP36287_KBN_FLOOR_HEADROOM_DIVERGENCE_VIZ_DATA = {
  id: 'imp-36287',
  kbnFloorAnchor: KBN_FLOOR_ANCHOR,
  ladder: HEADROOM_LADDER,
  cFit: C_FIT,
  slopePerDecade: HEADROOM_SLOPE_PER_DECADE,
  crossing: {
    nCross: N_CROSS,
    nCrossConservative: N_CROSS_CONSERVATIVE,
    noPhysicalCrossing: NO_PHYSICAL_CROSSING,
  },
  isRigorous: false,
};
