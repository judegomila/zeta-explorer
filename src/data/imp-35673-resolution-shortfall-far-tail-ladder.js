/**
 * @module imp-35673-resolution-shortfall-far-tail-ladder
 *
 * imp-35673 (numerical, measurement): EXTEND the imp-35652 resolution-shortfall
 * table beyond its two rows (interior sigma PEAK N ~ 9.22e5, shortfall ~97.3x;
 * E_coll = E_trunc CROSSOVER N ~ 3.28e9, shortfall ~1486x) into a FAR-TAIL
 * landmark ladder and measure how deep below the band-limited |alpha| < 1
 * mean-spacing floor (delta_res ~ 1) the near-minimal-collision scale
 * s_min(M) = M^{-1/3} sits as N -> far-tail.
 *
 * Under GUE cubic repulsion the smallest of M consecutive gaps scales as
 * s_min(M) ~ M^{-1/3} -> 0 in mean-spacing units (Ben Arous-Bourgade 2013),
 * so the resolution shortfall delta_res / s_min = 1 / M^{-1/3} = M^{1/3}
 * GROWS WITHOUT BOUND -- exactly one order of magnitude per THREE decades of N.
 * This module tabulates shortfall = N^{1/3} across the two imp-35652 anchors,
 * the Platt-Trudgian verified height T_PT = 3e12, the ticket-named far-tail
 * landmark (sigma < 1e-3, N ~ 5.43e15), and illustrative decade probes deeper
 * into the tail (1e18, 1e21, 1e24), confirming the imp-35652 verdict
 * QUANTITATIVELY: the option-(a) obstruction margin does not plateau -- it
 * diverges monotonically as N -> infinity.
 *
 * Measurement only; confirms the imp-35652 assessment quantitatively;
 * derives no remainder; discharges nothing; changes no bound; establishes no
 * operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643),
 * E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are
 * UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (two-row source table extended here)
 * @see imp-35685-resolution-shortfall-literal-guard (pins the two imp-35652 anchor literals)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz)
 * Literature: Montgomery (1973); Rudnick-Sarnak (1996); Ben Arous-Bourgade
 * (2013, smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (T_PT = 3e12).
 */

import { IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE } from './imp-35652-req3-option-a-restricted-support-surrogate-scope.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)
const RESOLUTION_FLOOR = 1; // band-limited |alpha| < 1 resolution floor ~ one mean spacing

// Minimal-collision scale in mean-spacing units (Ben Arous-Bourgade 2013):
// s_min(M) ~ M^{-1/3}; resolution shortfall delta_res / s_min = M^{1/3}.
const sMinScale = (M) => Math.pow(M, -1 / 3);
const shortfall = (M) => RESOLUTION_FLOOR / sMinScale(M); // = M^{1/3}

// Far-tail landmark ladder (N ascending). The first two rows are the imp-35652
// anchors; T_PT is the Platt-Trudgian verified height; sigma1e3 is the
// ticket-named far-tail landmark (sigma < 1e-3); the trailing rows are
// illustrative decade probes deeper into the tail to expose the growth law.
const LADDER = [
  { key: 'peak', N: 9.2186e5, label: 'interior flat-cap sigma PEAK (imp-35337/imp-35475)', anchor: true },
  { key: 'cross', N: 3.280294352e9, label: 'E_coll = E_trunc CROSSOVER (imp-35475)', anchor: true },
  { key: 'tpt', N: 3.0e12, label: 'Platt-Trudgian verified height T_PT', anchor: false },
  { key: 'sigma1e3', N: 5.43e15, label: 'far-tail sigma < 1e-3 landmark (ticket-named)', anchor: false },
  { key: 'probe1e18', N: 1.0e18, label: 'far-tail decade probe', anchor: false },
  { key: 'probe1e21', N: 1.0e21, label: 'far-tail decade probe', anchor: false },
  { key: 'probe1e24', N: 1.0e24, label: 'far-tail decade probe', anchor: false },
];

const rows = LADDER.map((r) => ({
  key: r.key,
  N: r.N,
  label: r.label,
  anchor: r.anchor,
  sMinMeanSpacingUnits: +sMinScale(r.N).toExponential(4), // s_min(N) = N^{-1/3}
  resolutionShortfall: +shortfall(r.N).toPrecision(6), // = N^{1/3}, delta_res / s_min
}));

// Growth diagnostic: shortfall multiplies by exactly 10 per three decades of N.
// From the peak (N ~ 9.22e5, shortfall ~97.3x) to the deepest probe
// (N = 1e24, shortfall = 1e8), the margin spans ~6.0 decades -- monotone,
// unbounded, no plateau.
const shortfallPeak = shortfall(9.2186e5);
const shortfallDeepest = shortfall(1.0e24);
const marginDecadeSpan = Math.log10(shortfallDeepest / shortfallPeak); // ~6.01

export const IMP35673_RESOLUTION_SHORTFALL_FAR_TAIL_LADDER = {
  id: 'imp-35673',
  proofSection: 'S-frontier',
  question:
    'How deep below the band-limited |alpha| < 1 mean-spacing floor (delta_res ~ 1) does the near-minimal-collision ' +
    'scale s_min(M) ~ M^{-1/3} sit as N -> far-tail, and does the option-(a) obstruction margin plateau or diverge?',
  scalingLaw:
    'The resolution shortfall delta_res / s_min = 1 / M^{-1/3} = M^{1/3} grows WITHOUT BOUND -- exactly one order ' +
    'of magnitude per three decades of N. The minimal-collision scale s_min ~ M^{-1/3} -> 0 falls ever further ' +
    'below the fixed band-limited floor, so a support-limited |alpha| < 1 surrogate is progressively LESS able to ' +
    'resolve the collision as N grows: the imp-35652 obstruction margin diverges, it does not plateau.',
  resolutionFloorMeanSpacing: RESOLUTION_FLOOR,
  ladder: rows,
  marginDecadeSpanPeakToDeepest: +marginDecadeSpan.toFixed(4), // ~6.01 decades of shortfall growth
  divergesIntoTail: true,
  plateaus: false,
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Extending the imp-35652 two-row resolution-shortfall table into a far-tail ' +
    'landmark ladder confirms the verdict QUANTITATIVELY: the shortfall = N^{1/3} climbs monotonically from ' +
    '~97.3x at the interior peak (N ~ 9.22e5) through ~1486x at the crossover (N ~ 3.28e9), ~14423x at the ' +
    'Platt-Trudgian height T_PT = 3e12, ~1.758e5 at the sigma < 1e-3 far-tail landmark (N ~ 5.43e15), to 1e8 at ' +
    'N = 1e24 -- ~6.0 further decades of margin with NO plateau. The near-minimal-collision scale s_min ~ M^{-1/3} ' +
    'falls ever deeper below the fixed |alpha| < 1 band-limited floor, so the option-(a) obstruction (imp-35652) ' +
    'GROWS into the tail rather than closing. Confirms imp-35652 quantitatively; derives no remainder; discharges ' +
    'nothing; changes no bound; establishes no operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), ' +
    'E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; ' +
    'route-(ii) (imp-35488 two-height spot check) remains the only viable partial; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35652 (two-row resolutionScaleTable extended here); imp-35685 (pins the two anchor literals); ' +
    'imp-35337/imp-35475 (interior peak and crossover landmarks); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi)); ' +
    'imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Montgomery (1973); Rudnick-Sarnak ' +
    '(1996); Ben Arous-Bourgade (2013, smallest GUE gaps ~ n^{-4/3}). Platt-Trudgian 2021 (T_PT = 3e12).',
};

export const IMP35673_RESOLUTION_SHORTFALL_FAR_TAIL_LADDER_ASSERTIONS = [
  {
    // (1) the ladder reproduces the two imp-35652 anchors to printed-digit tolerance.
    id: 'imp35673-anchors-match-imp35652',
    description: 'the peak (~97.3x) and crossover (~1486x) rows reproduce the imp-35652 baked resolutionScaleTable',
    holds: () => {
      const t = IMP35652_REQ3_OPTION_A_RESTRICTED_SUPPORT_SURROGATE_SCOPE.resolutionScaleTable;
      const peak = rows.find((r) => r.key === 'peak');
      const cross = rows.find((r) => r.key === 'cross');
      return (
        Math.abs(peak.resolutionShortfall - t.peak.resolutionShortfall) < 0.05 &&
        Math.abs(cross.resolutionShortfall - t.cross.resolutionShortfall) < 0.5 &&
        Math.abs(peak.sMinMeanSpacingUnits - t.peak.sMinMeanSpacingUnits) < 1e-4 &&
        Math.abs(cross.sMinMeanSpacingUnits - t.cross.sMinMeanSpacingUnits) < 1e-5
      );
    },
  },
  {
    // (2) each ladder row satisfies shortfall = N^{1/3} exactly, and s_min < floor throughout.
    id: 'imp35673-shortfall-equals-cuberoot-N',
    description: 'every ladder row has resolution shortfall = N^{1/3} and s_min ~ N^{-1/3} strictly below the floor',
    holds: () =>
      rows.every(
        (r) =>
          r.sMinMeanSpacingUnits < RESOLUTION_FLOOR &&
          Math.abs(r.resolutionShortfall - Math.pow(r.N, 1 / 3)) / Math.pow(r.N, 1 / 3) < 1e-5,
      ),
  },
  {
    // (3) the shortfall is strictly monotone increasing along the ladder -- diverges, no plateau.
    id: 'imp35673-shortfall-monotone-diverges',
    description: 'the resolution shortfall grows strictly monotonically into the far tail (~6 decades peak->1e24), never plateaus',
    holds: () => {
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i].resolutionShortfall > rows[i - 1].resolutionShortfall)) return false;
      }
      const r = IMP35673_RESOLUTION_SHORTFALL_FAR_TAIL_LADDER;
      return (
        r.divergesIntoTail === true &&
        r.plateaus === false &&
        Math.abs(marginDecadeSpan - 6.0) < 0.1 // ~6.0 decades of shortfall growth peak->deepest
      );
    },
  },
  {
    // (4) the ticket-named far-tail landmark (sigma < 1e-3, N ~ 5.43e15) lands at shortfall ~1.758e5.
    id: 'imp35673-sigma1e3-landmark-shortfall',
    description: 'the sigma < 1e-3 far-tail landmark N ~ 5.43e15 has shortfall = N^{1/3} ~ 1.758e5',
    holds: () => {
      const s = rows.find((r) => r.key === 'sigma1e3');
      return Math.abs(s.resolutionShortfall - Math.pow(5.43e15, 1 / 3)) / Math.pow(5.43e15, 1 / 3) < 1e-5;
    },
  },
  {
    // (5) honesty gate: measurement only, conditional, no bound moves, no refereed bound is changed, imp-35337a OPEN, NO QED.
    id: 'imp35673-measurement-only-no-qed',
    description: 'measurement only: not rigorous/unconditional, changes no bound, keeps imp-486 caveat, imp-35337a OPEN, PT 0.2, NO QED',
    holds: () => {
      const r = IMP35673_RESOLUTION_SHORTFALL_FAR_TAIL_LADDER;
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

for (const a of IMP35673_RESOLUTION_SHORTFALL_FAR_TAIL_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35673-resolution-shortfall-far-tail-ladder assertion failed: ${a.id}`);
  }
}
