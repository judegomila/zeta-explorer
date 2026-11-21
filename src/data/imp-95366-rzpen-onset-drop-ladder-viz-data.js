/**
 * @module imp-95366-rzpen-onset-drop-ladder-viz-data
 *
 * imp-95366 (ux): lightweight, import-light viz-data module baking the
 * RZ-PEN symbol-pencil every-octave firing-onset ladder across the
 * committed chain legs imp-95328 (baseline THEOREM RZ-PEN2), imp-95329
 * (LEMMA BCAP / THEOREM RZ-PEN3, beta-trace cap), imp-95330 (LEMMA
 * G-MONO / THEOREM RZ-PEN4, K = 256 chart refinement), imp-95331
 * (LEMMA ROOT-MONO + LEMMA W-SPLIT / THEOREM RZ-PEN5, split-weight
 * exact-root), and imp-95332 (LEMMA TAIL-CHART / THEOREM RZ-PEN6,
 * per-chart tail cap), on all three reported onset tracks: m-and-r-
 * uniform, r = 1.3, and r = 1.05.
 *
 * The imp-95349 viz-data module already charts the per-leg floor GAIN
 * factor at rho = e^6; this module covers the complementary axis the
 * imp-95366 ticket asks for -- the every-octave ONSET-DROP ladder,
 * which was not yet visualized anywhere (imp-95349 does not touch
 * onsets at all). Per-leg deltas show which currency (trace, chart,
 * side-weight/root, tail) contributed each onset drop:
 *   RZ-PEN2 -> RZ-PEN3 (beta-trace cap): ~0.0606 per track
 *   RZ-PEN3 -> RZ-PEN4 (K=256 chart cover): ~0.9453 per track (the bulk)
 *   RZ-PEN4 -> RZ-PEN5 (side-weight split + exact root): 0 (rho = 2 is
 *     below the imp-95331 activation crossover rho ~ 6.5)
 *   RZ-PEN5 -> RZ-PEN6 (per-chart tail cap): 0 (same reason, imp-95332)
 *
 * All onset and gain values are taken verbatim from the cited modules'
 * own exported records -- no re-derivation, no re-execution of the
 * underlying 256-chart / pair-identity numerics beyond what those
 * modules already compute at import time. This module only subtracts
 * and re-presents already-baked numbers (per-leg deltas telescope to
 * the total drop by construction). Follows the imp-95317 / imp-95319 /
 * imp-95349 import-light viz-data pattern.
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-95328-two-chart-pencil-floor.js (THEOREM RZ-PEN2 baseline
 *   onsets, corollarySplitPen2)
 * @see imp-95329-beta-trace-capped-pencil-floor.js (THEOREM RZ-PEN3
 *   onsets, corollarySplitPen3; gainRhoE6)
 * @see imp-95330-chart-refined-pencil-floor.js (THEOREM RZ-PEN4 onsets,
 *   corollarySplitPen4; gainRhoE6)
 * @see imp-95331-split-weight-exact-root-pencil-floor.js (THEOREM
 *   RZ-PEN5 onsets, onsetsUnchanged; gainRhoE6R2)
 * @see imp-95332-chart-tail-pencil-floor.js (THEOREM RZ-PEN6 onsets,
 *   onsetsUnchanged; gainRhoE6R2)
 * @see imp-95349-rz-pen-gain-ladder-viz-data.js (companion: the
 *   floor-gain axis at rho = e^6, which this module does not repeat)
 *
 * Ticket: imp-95366 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP95328_TWO_CHART_PENCIL_FLOOR } from './imp-95328-two-chart-pencil-floor.js';
import { IMP95329_BETA_TRACE_CAPPED_PENCIL_FLOOR } from './imp-95329-beta-trace-capped-pencil-floor.js';
import { IMP95330_CHART_REFINED_PENCIL_FLOOR } from './imp-95330-chart-refined-pencil-floor.js';
import { IMP95331_SPLIT_WEIGHT_EXACT_ROOT_PENCIL_FLOOR } from './imp-95331-split-weight-exact-root-pencil-floor.js';
import { IMP95332_CHART_TAIL_PENCIL_FLOOR } from './imp-95332-chart-tail-pencil-floor.js';

const pen2 = IMP95328_TWO_CHART_PENCIL_FLOOR.corollarySplitPen2;
const pen3 = IMP95329_BETA_TRACE_CAPPED_PENCIL_FLOOR.corollarySplitPen3;
const pen4 = IMP95330_CHART_REFINED_PENCIL_FLOOR.corollarySplitPen4;
const pen5onsets = IMP95331_SPLIT_WEIGHT_EXACT_ROOT_PENCIL_FLOOR.onsetsUnchanged;
const pen6onsets = IMP95332_CHART_TAIL_PENCIL_FLOOR.onsetsUnchanged;

// every-octave firing onsets on all three reported tracks, one row per
// chain leg (rho = 2, dyadic twin skeleton)
export const IMP95366_ONSET_LADDER = [
  {
    leg: 'RZ-PEN2',
    module: 'imp-95328',
    currency: 'baseline (pre-existing two-chart trace majorant)',
    xStarUniform: pen2.xStarUniform2,
    xStarR13: pen2.xStarR13,
    xStarR105: pen2.xStarR105,
  },
  {
    leg: 'RZ-PEN3',
    module: 'imp-95329',
    currency: 'beta-trace cap (LEMMA BCAP / LEMMA ACAP)',
    xStarUniform: pen3.xStarUniform3,
    xStarR13: pen3.xStarR13,
    xStarR105: pen3.xStarR105,
  },
  {
    leg: 'RZ-PEN4',
    module: 'imp-95330',
    currency: 'K=256 uniform chart cover (LEMMA G-MONO)',
    xStarUniform: pen4.xStarUniform4,
    xStarR13: pen4.xStarR13,
    xStarR105: pen4.xStarR105,
  },
  {
    leg: 'RZ-PEN5',
    module: 'imp-95331',
    currency: 'side-weight split + exact root (LEMMA W-SPLIT / ROOT-MONO)',
    xStarUniform: pen5onsets.xStarUniform,
    xStarR13: pen5onsets.xStarR13,
    xStarR105: pen5onsets.xStarR105,
  },
  {
    leg: 'RZ-PEN6',
    module: 'imp-95332',
    currency: 'per-chart tail cap (LEMMA TAIL-CHART)',
    xStarUniform: pen6onsets.xStarUniform,
    xStarR13: pen6onsets.xStarR13,
    xStarR105: pen6onsets.xStarR105,
  },
];

// per-leg onset drop (previous leg's onset minus this leg's onset),
// one row per track; RZ-PEN2 has no predecessor and is omitted
export const IMP95366_ONSET_DROPS = IMP95366_ONSET_LADDER.slice(1).map((row, i) => {
  const prev = IMP95366_ONSET_LADDER[i];
  return {
    leg: row.leg,
    module: row.module,
    currency: row.currency,
    dropUniform: prev.xStarUniform - row.xStarUniform,
    dropR13: prev.xStarR13 - row.xStarR13,
    dropR105: prev.xStarR105 - row.xStarR105,
  };
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP95366_ASSERTIONS = [
  {
    id: 'imp95366-ladder-matches-source-records',
    description:
      'every baked onset in the ladder is copied verbatim from its source module record field',
    holds: () =>
      IMP95366_ONSET_LADDER[0].xStarUniform === pen2.xStarUniform2 &&
      IMP95366_ONSET_LADDER[0].xStarR13 === pen2.xStarR13 &&
      IMP95366_ONSET_LADDER[0].xStarR105 === pen2.xStarR105 &&
      IMP95366_ONSET_LADDER[1].xStarUniform === pen3.xStarUniform3 &&
      IMP95366_ONSET_LADDER[2].xStarUniform === pen4.xStarUniform4 &&
      IMP95366_ONSET_LADDER[3].xStarUniform === pen5onsets.xStarUniform &&
      IMP95366_ONSET_LADDER[4].xStarUniform === pen6onsets.xStarUniform,
  },
  {
    id: 'imp95366-ladder-nonincreasing-on-every-track',
    description:
      'the onset ladder is nonincreasing rung by rung on all three tracks (each leg is a proven unconditional floor dominance, so a certificate can only fire earlier or at the same depth, never later)',
    holds: () =>
      ['xStarUniform', 'xStarR13', 'xStarR105'].every((key) =>
        IMP95366_ONSET_LADDER.every(
          (row, i) => i === 0 || row[key] <= IMP95366_ONSET_LADDER[i - 1][key] + 1e-9,
        ),
      ),
  },
  {
    id: 'imp95366-drops-are-nonnegative-and-telescope',
    description:
      'every per-leg drop is >= 0 on every track, and the drops sum to the total ladder drop (RZ-PEN2 onset minus RZ-PEN6 onset) on every track',
    holds: () => {
      const okNonneg = IMP95366_ONSET_DROPS.every(
        (d) => d.dropUniform >= -1e-9 && d.dropR13 >= -1e-9 && d.dropR105 >= -1e-9,
      );
      const first = IMP95366_ONSET_LADDER[0];
      const last = IMP95366_ONSET_LADDER[IMP95366_ONSET_LADDER.length - 1];
      const sumUniform = IMP95366_ONSET_DROPS.reduce((s, d) => s + d.dropUniform, 0);
      const sumR13 = IMP95366_ONSET_DROPS.reduce((s, d) => s + d.dropR13, 0);
      const sumR105 = IMP95366_ONSET_DROPS.reduce((s, d) => s + d.dropR105, 0);
      return (
        okNonneg &&
        Math.abs(sumUniform - (first.xStarUniform - last.xStarUniform)) < 1e-9 &&
        Math.abs(sumR13 - (first.xStarR13 - last.xStarR13)) < 1e-9 &&
        Math.abs(sumR105 - (first.xStarR105 - last.xStarR105)) < 1e-9
      );
    },
  },
  {
    id: 'imp95366-chart-leg-is-the-dominant-drop-and-tail-root-legs-are-zero',
    description:
      'the K=256 chart-cover leg (RZ-PEN4) supplies most of the total onset drop on every track (as the imp-95330 module itself notes, "~0.94 drop concentrated at the K-chart leg"), while the side-weight/root leg (RZ-PEN5) and the tail-cap leg (RZ-PEN6) contribute exactly zero onset drop at rho = 2 (both modules record the rho = 2 onsets as UNCHANGED)',
    holds: () => {
      const [rzPen3, rzPen4, rzPen5, rzPen6] = IMP95366_ONSET_DROPS;
      const totalUniform =
        rzPen3.dropUniform + rzPen4.dropUniform + rzPen5.dropUniform + rzPen6.dropUniform;
      const chartMajority = rzPen4.dropUniform > 0.5 * totalUniform;
      const tailAndRootZero =
        Math.abs(rzPen5.dropUniform) < 1e-9 &&
        Math.abs(rzPen5.dropR13) < 1e-9 &&
        Math.abs(rzPen5.dropR105) < 1e-9 &&
        Math.abs(rzPen6.dropUniform) < 1e-9 &&
        Math.abs(rzPen6.dropR13) < 1e-9 &&
        Math.abs(rzPen6.dropR105) < 1e-9;
      return chartMajority && tailAndRootZero;
    },
  },
];

for (const a of IMP95366_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95366-rzpen-onset-drop-ladder-viz-data assertion failed: ${a.id}`);
  }
}
