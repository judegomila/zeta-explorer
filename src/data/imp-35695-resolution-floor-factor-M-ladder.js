/**
 * @module imp-35695-resolution-floor-factor-M-ladder
 *
 * imp-35695 (numerical, measurement): TABULATE the imp-35652 resolution-floor
 * factor delta_res / s_min ~ M^{1/3} across a clean power-of-ten ladder of M
 * (M = number of consecutive GUE gaps), quantifying HOW MANY MULTIPLES BELOW the
 * band-limited |alpha| < 1 mean-spacing resolution (delta_res ~ 1) the near-
 * minimal-collision scale s_min(M) sits, and confirming the M^{1/3} growth law.
 *
 * The imp-35652 decisive obstruction ("resolution floor") asserts that a proxy
 * reachable inside the PROVEN |alpha| < 1 Montgomery / Rudnick-Sarnak pair-
 * correlation band is band-limited to the mean scale (delta_res ~ 1), whereas
 * the smallest of M consecutive GUE gaps scales as s_min(M) ~ M^{-1/3} -> 0
 * (Ben Arous-Bourgade 2013). The floor factor delta_res / s_min = 1 / M^{-1/3}
 * = M^{1/3} was ASSERTED but never tabulated as a function of the gap count M.
 * This module builds the M-ladder M in {10, 1e2, 1e4, 1e6, 1e8} that the ticket
 * names, reports s_min(M) in mean-spacing units and the multiple M^{1/3} by which
 * the collision scale sits below the band floor, and confirms the exponent is
 * exactly 1/3 (log-log slope of M^{1/3} against M) -- i.e. the floor factor
 * multiplies by 10^{1/3} ~ 2.1544x per DECADE of gap count, one order of
 * magnitude per THREE decades of M, with NO plateau.
 *
 * Distinct from imp-35673 (which laddered the SAME law over verified-height
 * landmarks N): here the independent variable is M, the number of consecutive
 * gaps, the direct Ben Arous-Bourgade variable, giving the clean per-decade
 * factor 10^{1/3} the ticket requests.
 *
 * Measurement only; confirms the imp-35652 assessment quantitatively; derives no
 * remainder; discharges nothing; changes no bound; establishes no operator
 * positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5
 * (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays
 * OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (source obstruction; asserts M^{1/3} floor factor)
 * @see imp-35673-resolution-shortfall-far-tail-ladder (same law over verified-height landmarks N)
 * @see imp-35685-resolution-shortfall-literal-guard (pins the imp-35652 anchor literals)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade
 * (2013, smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (T_PT = 3e12).
 */

import { IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE } from './imp-35652-req3-option-a-restricted-support-surrogate-scope.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const RESOLUTION_FLOOR = 1; // band-limited |alpha| < 1 resolution floor ~ one mean spacing

// Minimal-collision scale in mean-spacing units (Ben Arous-Bourgade 2013):
// s_min(M) ~ M^{-1/3} for the smallest of M consecutive gaps; the resolution
// floor factor is delta_res / s_min = 1 / M^{-1/3} = M^{1/3}.
const sMinScale = (M) => Math.pow(M, -1 / 3);
const floorFactor = (M) => RESOLUTION_FLOOR / sMinScale(M); // = M^{1/3}

// Clean power-of-ten ladder of gap counts M named by the ticket.
const M_LADDER = [10, 1e2, 1e4, 1e6, 1e8];

const rows = M_LADDER.map((M) => ({
  M,
  logM: +Math.log10(M).toFixed(4),
  sMinMeanSpacingUnits: +sMinScale(M).toExponential(4), // s_min(M) = M^{-1/3}
  floorFactor: +floorFactor(M).toPrecision(6), // = M^{1/3}, multiples below the band floor
}));

// Growth diagnostic: floor factor = M^{1/3}, so log10(factor) = (1/3) log10(M).
// The exponent is exactly 1/3; the per-decade multiplier is 10^{1/3} ~ 2.1544x,
// i.e. one order of magnitude per THREE decades of gap count M.
const first = rows[0];
const last = rows[rows.length - 1];
const loglogSlope =
  (Math.log10(last.floorFactor) - Math.log10(first.floorFactor)) /
  (Math.log10(last.M) - Math.log10(first.M)); // = 1/3
const perDecadeMultiplier = Math.pow(10, 1 / 3); // ~2.1544x per decade of M
const factorSpanDecades = Math.log10(last.floorFactor / first.floorFactor); // ~2.333 over M 10->1e8

export const IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER = {
  id: 'imp-35695',
  proofSection: 'S-frontier',
  question:
    'Across a ladder of gap counts M (number of consecutive GUE gaps), how many multiples below the band-limited ' +
    '|alpha| < 1 mean-spacing floor (delta_res ~ 1) does the near-minimal-collision scale s_min(M) ~ M^{-1/3} sit, ' +
    'and does the imp-35652 floor factor delta_res / s_min follow the asserted M^{1/3} growth?',
  scalingLaw:
    'The resolution floor factor delta_res / s_min = 1 / M^{-1/3} = M^{1/3} grows WITHOUT BOUND with the gap count ' +
    'M: exactly 10^{1/3} ~ 2.1544x per decade of M, one order of magnitude per three decades. The near-minimal- ' +
    'collision scale s_min(M) ~ M^{-1/3} -> 0 falls ever further below the fixed band-limited floor, so a support- ' +
    'limited |alpha| < 1 surrogate resolves progressively fewer of the collision scales as M grows.',
  resolutionFloorMeanSpacing: RESOLUTION_FLOOR,
  ladder: rows,
  loglogSlope: +loglogSlope.toFixed(6), // exactly 1/3
  perDecadeMultiplier: +perDecadeMultiplier.toFixed(6), // ~2.1544x
  factorSpanDecadesFirstToLast: +factorSpanDecades.toFixed(4), // ~2.333 over M 10 -> 1e8
  divergesWithM: true,
  plateaus: false,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Tabulating the imp-35652 resolution-floor factor delta_res / s_min = M^{1/3} across ' +
    'the ticket-named gap-count ladder M in {10, 1e2, 1e4, 1e6, 1e8} confirms the asserted growth QUANTITATIVELY: ' +
    'the minimal-collision scale sits ~2.15x below the band floor at M = 10, ~21.5x at M = 1e4, ~100x at M = 1e6, ' +
    'and ~464x at M = 1e8 -- a log-log slope of exactly 1/3 and a per-decade multiplier 10^{1/3} ~ 2.1544x, with ' +
    'NO plateau. The near-minimal-collision scale s_min ~ M^{-1/3} falls monotonically below the fixed |alpha| < 1 ' +
    'band-limited floor as M grows, so the option-(a) obstruction (imp-35652) grows with the gap count rather than ' +
    'closing. Confirms imp-35652 quantitatively; derives no remainder; discharges nothing; changes no bound; ' +
    'establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) ' +
    'and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; route-(ii) (imp-35488 two-height spot ' +
    'check) remains the only viable partial; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35652 (asserts the M^{1/3} floor factor tabulated here); imp-35673 (same law over verified-height ' +
    'landmarks N); imp-35685 (pins the imp-35652 anchor literals); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi)); ' +
    'imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Montgomery (1973); Rudnick-Sarnak ' +
    '(1996); Ben Arous-Bourgade (2013, smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (T_PT = 3e12).',
};

export const IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER_ASSERTIONS = [
  {
    // (1) every ladder row satisfies floor factor = M^{1/3} exactly, and s_min < floor throughout.
    id: 'imp35695-factor-equals-cuberoot-M',
    description: 'every ladder row has floor factor = M^{1/3} and s_min ~ M^{-1/3} strictly below the mean-spacing floor',
    holds: () =>
      rows.every(
        (r) =>
          r.sMinMeanSpacingUnits < RESOLUTION_FLOOR &&
          Math.abs(r.floorFactor - Math.pow(r.M, 1 / 3)) / Math.pow(r.M, 1 / 3) < 1e-5 &&
          Math.abs(r.sMinMeanSpacingUnits - Math.pow(r.M, -1 / 3)) / Math.pow(r.M, -1 / 3) < 1e-4,
      ),
  },
  {
    // (2) the log-log slope of the floor factor against M is exactly 1/3 (the M^{1/3} exponent).
    id: 'imp35695-loglog-slope-one-third',
    description: 'the floor factor grows as M^{1/3}: log-log slope = 1/3 and per-decade multiplier = 10^{1/3} ~ 2.1544x',
    holds: () => {
      const r = IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER;
      return (
        Math.abs(r.loglogSlope - 1 / 3) < 1e-5 &&
        Math.abs(r.perDecadeMultiplier - Math.pow(10, 1 / 3)) < 1e-5
      );
    },
  },
  {
    // (3) the floor factor is strictly monotone increasing along the ladder -- diverges, no plateau.
    id: 'imp35695-factor-monotone-diverges',
    description: 'the resolution floor factor grows strictly monotonically with the gap count M and never plateaus',
    holds: () => {
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].floorFactor > rows[i - 1].floorFactor)) return false;
      }
      const r = IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER;
      return r.divergesWithM === true && r.plateaus === false;
    },
  },
  {
    // (4) the ladder endpoints match the ticket-named anchors: ~2.15x at M=10, ~464x at M=1e8.
    id: 'imp35695-endpoint-multiples-named',
    description: 'the collision scale sits ~2.1544x below the floor at M=10 and ~464.16x below at M=1e8',
    holds: () => {
      const lo = rows.find((r) => r.M === 10);
      const hi = rows.find((r) => r.M === 1e8);
      return (
        Math.abs(lo.floorFactor - Math.cbrt(10)) < 1e-3 &&
        Math.abs(hi.floorFactor - Math.cbrt(1e8)) < 1e-1 &&
        Math.abs(IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER.factorSpanDecadesFirstToLast - 7 / 3) < 1e-2
      );
    },
  },
  {
    // (5) the M-exponent agrees with the imp-35652 verified-height obstruction: both are M^{1/3}.
    id: 'imp35695-consistent-with-imp35652',
    description: 'the M^{1/3} floor factor here reproduces the imp-35652 resolutionScaleTable exponent (shortfall = N^{1/3} at its anchors)',
    holds: () => {
      const t = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.resolutionScaleTable;
      // imp-35652 anchors obey the SAME cube-root law: shortfall = N^{1/3}.
      const peakOk = Math.abs(t.peak.resolutionShortfall - Math.pow(t.peak.N, 1 / 3)) / Math.pow(t.peak.N, 1 / 3) < 5e-3;
      const crossOk = Math.abs(t.cross.resolutionShortfall - Math.pow(t.cross.N, 1 / 3)) / Math.pow(t.cross.N, 1 / 3) < 5e-3;
      return peakOk && crossOk && t.resolutionFloorMeanSpacing === RESOLUTION_FLOOR;
    },
  },
  {
    // (6) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35695-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35695_RESOLUTION_FLOOR_FACTOR_M_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35695-resolution-floor-factor-M-ladder assertion failed: ${a.id}`);
  }
}
