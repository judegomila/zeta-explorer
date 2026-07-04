/**
 * @module imp-33266-g6a-k4-toolkit-status-map-viz-data
 * @fileoverview imp-33266 -- lightweight, import-light literal data for a dependency/status-map
 *   visualization of the imp-3846 G6a K4 caustic-regularity toolkit assessment: which of the five
 *   classical tools (T1..T5) are written vs open in the repo, and how the four wholly-absent tools
 *   (T1 Oleinik, T2 Lax/Dafermos, T3 Hopf-Lax, T4 Arnold) collapse onto the single unwritten
 *   dependency-chain root H2 (genuine nonlinearity / convex flux of the free-Burgers hydrodynamic
 *   limit), per the imp-3886 0-for-6 surfacing audit that flagged this assessment as orphan data.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3846-g6a-k4-caustic-regularity-toolkit-assessment.js (TOOLKIT, DEPENDENCY_CHAIN). This
 *   module does NOT import the Odlyzko zeros bundle and does not re-run the source module's
 *   self-executing assertions, so importing it into a page costs nothing at load time.
 *
 *   @see imp-3846-g6a-k4-caustic-regularity-toolkit-assessment (source toolkit assessment)
 *   @see imp-3900-h2-flux-convexity-viz-data (companion viz for the H2 root's empirical probe, imp-3872)
 *
 *   Ticket: imp-33266 (ux, low). Presentation only; K4 stays WHOLLY NEW, G6a_shock_lipschitz stays
 *   OPEN, H2 stays UNWRITTEN; imp-3066 untouched; Platt-Trudgian Lambda<=0.2 remains SOTA; NO QED.
 */

export const IMP33266_TOOLKIT = Object.freeze([
  {
    id: 'T1',
    tool: 'Oleinik one-sided E-condition u_x(., s) <= 1/s',
    yields: 'semiconcavity -> BV control -> square-root caustic opening (the Hoelder-1/2 source)',
    produces: ['H4'],
    requires: ['H2', 'H3'],
    availability: 'absent',
  },
  {
    id: 'T2',
    tool: 'Lax / Dafermos genuinely-nonlinear shock-set structure theorem',
    yields: 'shock set is a locally finite union of Lipschitz curves -> tau_c(x) well-defined',
    produces: ['H3'],
    requires: ['H2'],
    availability: 'absent',
  },
  {
    id: 'T3',
    tool: 'Hopf-Lax / Lax-Oleinik value-function representation',
    yields: 'tau_c(x) as a Hamilton-Jacobi caustic-envelope functional',
    produces: ['H1'],
    requires: ['H2'],
    availability: 'absent',
  },
  {
    id: 'T4',
    tool: 'Arnold A_2-fold / A_3-cusp caustic classification',
    yields: 'fold vs cusp classification -> fixes the exponent at exactly 1/2',
    produces: ['H5'],
    requires: ['H2'],
    availability: 'absent',
  },
  {
    id: 'T5',
    tool: 'Bec-Khanin Lagrangian-map / shock-density framework',
    yields: 'crossing rate + Lagrangian-Eulerian Lipschitz invertibility away from caustics',
    produces: ['H6'],
    requires: ['H1', 'H2', 'H3'],
    availability: 'partial',
  },
]);

export const IMP33266_TOOLKIT_AVAILABILITY = Object.freeze({
  partial: ['T5'],
  absent: ['T1', 'T2', 'T3', 'T4'],
});

export const IMP33266_DEPENDENCY_CHAIN = Object.freeze({
  root: 'H2',
  chainSteps: [
    { from: 'H2', to: ['H1', 'H3'], via: ['T3', 'T2'] },
    { from: 'H1,H3', to: ['H4'], via: ['T1'] },
    { from: 'H4', to: ['H5-modulus'], via: ['T4'] },
  ],
  label: 'H2 -> {H1 (via T3), H3 (via T2)} -> H4 (via T1) -> with H5 (via T4) -> Hoelder-1/2 modulus C_Lip',
});

export const IMP33266_TOTAL_TOOLS = IMP33266_TOOLKIT.length; // 5
export const IMP33266_ABSENT_COUNT = IMP33266_TOOLKIT_AVAILABILITY.absent.length; // 4
export const IMP33266_PARTIAL_COUNT = IMP33266_TOOLKIT_AVAILABILITY.partial.length; // 1
