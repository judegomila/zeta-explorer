/**
 * @module imp-3928-inviscid-window-edge-blocksize-viz-data
 * @fileoverview imp-3928 -- lightweight, import-light literal data for a
 *   visualization of the imp-3896 inviscid-window scale-sizing measurement:
 *   how the clean inviscid window upper edge (argmin over multipliers of the
 *   finite-N viscosity fraction visc = |m_zz| / |2 m m_z|) widens with block
 *   size M at the imp-3642 anchor height, the visc floor deepening as it
 *   does, and the edge / half-width ratio falling (logarithmic, not
 *   algebraic, widening).
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3896-g6a-h2-inviscid-window-blocksize-height-scaling.js (windowRows).
 *   This module does NOT import the Odlyzko zeros bundle or re-run the
 *   resolvent sweep, so importing it into a page costs nothing at load time.
 *
 *   @see imp-3896-g6a-h2-inviscid-window-blocksize-height-scaling.js (source measurement + full rows)
 *   @see imp-3872-g6a-h2-discrete-flux-convexity-probe (the [2, 8] window this extends)
 *
 *   Ticket: imp-3928 (ux, low). Presentation only, MEASUREMENT not a
 *   certificate; H2 stays UNWRITTEN; G6a_shock_lipschitz OPEN; imp-3066
 *   untouched; NO QED.
 */

export const IMP3928_WINDOW_ROWS = Object.freeze([
  { M: 161, edge: 8, viscFloor: 0.0004372, halfWidthD: 80.5, edgeOverHalfWidth: 0.09938 },
  { M: 321, edge: 10, viscFloor: 0.0001267, halfWidthD: 160.5, edgeOverHalfWidth: 0.06231 },
  { M: 641, edge: 11, viscFloor: 0.00003518, halfWidthD: 320.5, edgeOverHalfWidth: 0.03432 },
  { M: 1281, edge: 13, viscFloor: 0.00001049, halfWidthD: 640.5, edgeOverHalfWidth: 0.0203 },
]);

export const IMP3928_EDGE_START = 8;
export const IMP3928_EDGE_END = 13;
export const IMP3928_EDGE_OVER_HALFWIDTH_START = 0.09938; // ~9.9%
export const IMP3928_EDGE_OVER_HALFWIDTH_END = 0.0203; // ~2.0%
export const IMP3928_VISC_FLOOR_DEEPEN_FACTOR = 0.0004372 / 0.00001049; // ~41.7x over 8x more particles
