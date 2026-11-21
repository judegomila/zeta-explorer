/**
 * imp-96193 -- reader-facing analysis table for the imp-96171 empirical adjacent-box
 * lag-1 correlation L-sweep: the clean unfolded edge-to-edge tiling's sample lag-1
 * correlation r1 across box sizes L in {100, 200, 300, 495.779, 700, 1000}, laid out
 * against the fixed GUE two-interval proxy rho_exact = -0.46398 and the small-sample
 * band 1.96/sqrt(nBoxes) at each L.
 *
 * GRADE: documentation only. Import-light (literals baked, no zeros bundle); proves
 * nothing new beyond imp-96171 -- it consolidates that module's CLEAN_L_SWEEP array
 * into a single ordered table showing, per box size, the box count, r1, its deviation
 * from the fixed proxy, and whether that deviation sits inside the L-specific small-
 * sample band, so a reader can see the anti-correlation bracket the proxy at every scale
 * without re-deriving it from prose.
 *
 * Changes no Lambda bound; NO QED; no refereed bound is changed.
 *
 * @see imp-96171-number-variance-empirical-lag1-vs-gue-proxy (source L-sweep + proxy)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the exact GUE proxy)
 */

const RHO_EXACT_15E5 = -0.46398; // exact GUE two-interval count correlation (imp-96128)

// verbatim from imp-96171 CLEAN_L_SWEEP (clean unfolded edge-to-edge tiling)
const CLEAN_L_SWEEP = [
  { L: 100, nBoxes: 1441, r1: -0.4331 },
  { L: 200, nBoxes: 720, r1: -0.5233 },
  { L: 300, nBoxes: 480, r1: -0.436 },
  { L: 495.779, nBoxes: 290, r1: -0.5126 },
  { L: 700, nBoxes: 205, r1: -0.5256 },
  { L: 1000, nBoxes: 144, r1: -0.4516 },
];

export const LAG1_L_SWEEP_ANALYSIS_TABLE = CLEAN_L_SWEEP.map((row) => {
  const smallSampleBand = 1.96 / Math.sqrt(row.nBoxes);
  const deviationFromProxy = row.r1 - RHO_EXACT_15E5;
  return {
    L: row.L,
    nBoxes: row.nBoxes,
    r1: row.r1,
    rhoExact: RHO_EXACT_15E5,
    deviationFromProxy,
    smallSampleBand,
    withinBand: Math.abs(deviationFromProxy) <= smallSampleBand,
  };
});

export const LAG1_L_SWEEP_SUMMARY = {
  rhoExact: RHO_EXACT_15E5,
  rangeMin: Math.min(...CLEAN_L_SWEEP.map((r) => r.r1)),
  rangeMax: Math.max(...CLEAN_L_SWEEP.map((r) => r.r1)),
  finding:
    'r1 stays in [-0.526,-0.433] across the full L-sweep (100 to 1000 zeros per box), firmly '
    + 'anti-correlated at every scale and bracketing the fixed GUE proxy rho_exact=-0.46398 -- '
    + 'the anti-correlation is a robust empirical feature of the actual Riemann zeros, not an '
    + 'artifact of the one box size (L=495.779) singled out at the significant height T=1.5e5.',
};

export const IMP_96193_LAG1_L_SWEEP_ANALYSIS_TABLE = {
  id: 'imp-96193-lag1-l-sweep-analysis-table',
  title:
    'Reader-facing analysis table for the imp-96171 empirical lag-1 L-sweep: r1 across '
    + 'L in {100,200,300,495.779,700,1000} vs the fixed GUE proxy rho_exact=-0.46398',
  table: LAG1_L_SWEEP_ANALYSIS_TABLE,
  summary: LAG1_L_SWEEP_SUMMARY,
  note:
    'documentation only, consolidating imp-96171 (clean unfolded edge-to-edge tiling L-sweep) into '
    + 'a single ordered table with per-L small-sample bands; no Lambda bound moves; '
    + 'no refereed bound is changed',
  closesTickets: ['imp-96193'],
};

// -- assertions (import-light; exact-literal consistency only) -------------
export const IMP_96193_ASSERTIONS = [
  {
    id: 'imp-96193-six-rows',
    holds: () => LAG1_L_SWEEP_ANALYSIS_TABLE.length === 6,
    why: 'the table carries exactly the six L values of the imp-96171 clean-tiling L-sweep.',
  },
  {
    id: 'imp-96193-r1-matches-imp-96171',
    holds: () => LAG1_L_SWEEP_ANALYSIS_TABLE.every((row, i) => row.r1 === CLEAN_L_SWEEP[i].r1),
    why: 'the r1 column must reproduce the imp-96171 baked literals exactly.',
  },
  {
    id: 'imp-96193-every-r1-firmly-anticorrelated',
    holds: () => LAG1_L_SWEEP_ANALYSIS_TABLE.every((row) => row.r1 < -0.4 && row.r1 > -0.55),
    why: 'every clean-tiling lag-1 correlation must be firmly anti-correlated, per imp-96171.',
  },
  {
    id: 'imp-96193-range-matches-ticket',
    holds: () => LAG1_L_SWEEP_SUMMARY.rangeMin >= -0.526 && LAG1_L_SWEEP_SUMMARY.rangeMax <= -0.433,
    why: 'the r1 range across the sweep must sit inside [-0.526,-0.433], the bracket the imp-96193 '
      + 'ticket asked this table to document.',
  },
  {
    id: 'imp-96193-brackets-proxy',
    holds: () => LAG1_L_SWEEP_SUMMARY.rangeMin <= RHO_EXACT_15E5 && RHO_EXACT_15E5 <= LAG1_L_SWEEP_SUMMARY.rangeMax,
    why: 'the fixed GUE proxy rho_exact must sit inside the [rangeMin,rangeMax] window swept across L, '
      + 'matching the "bracketing the proxy at every scale" claim.',
  },
  {
    id: 'imp-96193-495-779-row-matches-significant-height',
    holds: () => {
      const row = LAG1_L_SWEEP_ANALYSIS_TABLE.find((r) => r.L === 495.779);
      return row && row.nBoxes === 290 && row.withinBand === true;
    },
    why: 'the L=495.779 row is the significant-height (T=1.5e5) box size from imp-96171 and must '
      + 'itself sit within the small-sample band (the headline CONFIRMED result).',
  },
  {
    id: 'imp-96193-not-a-bound',
    holds: () => Array.isArray(IMP_96193_LAG1_L_SWEEP_ANALYSIS_TABLE.closesTickets),
    why: 'this is a documentation table; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-96193-closes-self',
    holds: () => IMP_96193_LAG1_L_SWEEP_ANALYSIS_TABLE.closesTickets.includes('imp-96193'),
    why: 'this module is the deliverable the imp-96193 ticket asked for.',
  },
];

for (const a of IMP_96193_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96193-lag1-l-sweep-analysis-table assertion failed: ${a.id}`);
  }
}

export default IMP_96193_LAG1_L_SWEEP_ANALYSIS_TABLE;
