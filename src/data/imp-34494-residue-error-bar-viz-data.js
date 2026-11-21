/**
 * @module imp-34494-residue-error-bar-viz-data
 * @fileoverview viz-data companion to imp-34449. imp-34449 converted the imp-34397 heuristic
 *   ~1-2% residue caveat into a MEASURED error bar by extending the 3-rung quadratic to a 4-rung
 *   cubic and 5-rung quartic re-read of the eflow_over_resid residue R at the pole k* ~ 21.28095,
 *   but had no accompanying visualization. This module reshapes the imp-34449 exports VERBATIM
 *   (no recomputation) into an ordered ladder of the three valid nested re-reads plus the measured
 *   error band, and INDEPENDENTLY re-derives the two excluded rung-SWAP outliers imp-34449 flags
 *   in its F4 (doc-comment only, never exported as literals) using the identical Newton
 *   divided-difference method on the same imp-34237 rows, so the viz can plot them flagged as
 *   invalid re-reads without hardcoding undocumented magic numbers.
 *
 *   Import-light: reuses imp-34237/imp-34310/imp-34449 exports only (no 16.7MB zeros bundle), per
 *   [[no_heavy_imports_in_pages]].
 *
 *   NO QED. Viz-data reshaping + outlier re-derivation only; the imp-34449 ladder values and
 *   measured +/-1.1% error bar are UNCHANGED; C_mb GUE-conditional per imp-486 UNTOUCHED; changes
 *   no bound; no refereed bound is changed.
 *
 *   @see imp-34449-residue-curvature-error-bar-extended-rungs.js (source of the ladder + error band)
 */

import { IMP34237_RESID_EXP_ROWS } from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';
import {
  IMP34310_KSTAR,
  IMP34310_EFLOW_ATTR_AT_KSTAR,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';
import {
  IMP34449_RESIDUE_QUAD,
  IMP34449_RESIDUE_CUBIC,
  IMP34449_RESIDUE_QUARTIC,
  IMP34449_SHIFT_QUAD_TO_CUBIC,
  IMP34449_SHIFT_QUAD_TO_QUARTIC,
  IMP34449_RESIDUE_CENTRAL,
  IMP34449_ERROR_BAR_HALFWIDTH,
  IMP34449_ERROR_BAR_REL,
  IMP34449_RESIDUE_MIN,
  IMP34449_RESIDUE_MAX,
} from './imp-34449-residue-curvature-error-bar-extended-rungs.js';

const R20 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 20.0);
const R21 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.0);
const R2125 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.25);
const R215 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.5);
const KSTAR = IMP34310_KSTAR;

// Same Newton divided-difference derivative imp-34449 uses internally, applied here only to
// independently re-derive the two rung-SWAP outliers it flags (F4) but does not export.
function polyDerivAt(nodes, x) {
  const n = nodes.length;
  const xs = nodes.map((p) => p.k);
  const ys = nodes.map((p) => p.residExp);
  const dd = [ys.slice()];
  for (let j = 1; j < n; j++) {
    const col = [];
    for (let i = 0; i < n - j; i++) {
      col.push((dd[j - 1][i + 1] - dd[j - 1][i]) / (xs[i + j] - xs[i]));
    }
    dd.push(col);
  }
  let der = 0;
  for (let j = 1; j < n; j++) {
    let dsum = 0;
    for (let drop = 0; drop < j; drop++) {
      let prod = 1;
      for (let m = 0; m < j; m++) {
        if (m !== drop) prod *= x - xs[m];
      }
      dsum += prod;
    }
    der += dd[j][0] * dsum;
  }
  return der;
}

function residueFromFit(nodes) {
  const slope = polyDerivAt(nodes, KSTAR);
  return IMP34310_EFLOW_ATTR_AT_KSTAR / slope;
}

// (F4) the two excluded rung-SWAP triples: drop a near-pole rung for the far 20.0 rung.
export const IMP34494_OUTLIER_SWAP_A = residueFromFit([R20, R2125, R215]); // ~-1.62882e-8
export const IMP34494_OUTLIER_SWAP_B = residueFromFit([R20, R21, R2125]); // ~-2.09701e-8

export const IMP34494_LADDER = [
  { key: 'quad', label: '3-rung quad (imp-34397)', residue: IMP34449_RESIDUE_QUAD, valid: true },
  { key: 'cubic', label: '4-rung cubic (+20.0)', residue: IMP34449_RESIDUE_CUBIC, valid: true },
  { key: 'quartic', label: '5-rung quartic (+19.0)', residue: IMP34449_RESIDUE_QUARTIC, valid: true },
];

export const IMP34494_OUTLIERS = [
  { key: 'swapA', label: 'swap (20.0,21.25,21.5)', residue: IMP34494_OUTLIER_SWAP_A, valid: false },
  { key: 'swapB', label: 'swap (20.0,21.0,21.25)', residue: IMP34494_OUTLIER_SWAP_B, valid: false },
];

export const IMP34494_ERROR_BAND = {
  min: IMP34449_RESIDUE_MIN,
  max: IMP34449_RESIDUE_MAX,
  central: IMP34449_RESIDUE_CENTRAL,
  halfWidth: IMP34449_ERROR_BAR_HALFWIDTH,
  rel: IMP34449_ERROR_BAR_REL,
};

export const IMP34494_SHIFTS = {
  quadToCubic: IMP34449_SHIFT_QUAD_TO_CUBIC,
  quadToQuartic: IMP34449_SHIFT_QUAD_TO_QUARTIC,
};

export const IMP34494_RESIDUE_ERROR_BAR_VIZ_DATA = {
  id: 'imp-34494',
  kStar: KSTAR,
  ladder: IMP34494_LADDER,
  outliers: IMP34494_OUTLIERS,
  errorBand: IMP34494_ERROR_BAND,
  shifts: IMP34494_SHIFTS,
  isRigorous: false,
};

export const IMP34494_ASSERTIONS = [
  {
    id: 'imp-34494-ladder-reproduces-imp34449-verbatim',
    description:
      'the three ladder rungs reproduce the imp-34449 quad/cubic/quartic residues exactly (===)',
    holds: () =>
      IMP34494_LADDER[0].residue === IMP34449_RESIDUE_QUAD &&
      IMP34494_LADDER[1].residue === IMP34449_RESIDUE_CUBIC &&
      IMP34494_LADDER[2].residue === IMP34449_RESIDUE_QUARTIC,
  },
  {
    id: 'imp-34494-outliers-match-imp34449-doc-values',
    description:
      'the independently re-derived swap outliers match the imp-34449 F4 doc-comment values to 1e-12 abs',
    holds: () =>
      Math.abs(IMP34494_OUTLIER_SWAP_A - -1.62882e-8) < 1e-12 &&
      Math.abs(IMP34494_OUTLIER_SWAP_B - -2.09701e-8) < 1e-12,
  },
  {
    id: 'imp-34494-outliers-outside-error-band',
    description:
      'both swap outliers fall OUTSIDE the measured error band, confirming they are invalid re-reads',
    holds: () =>
      IMP34494_OUTLIER_SWAP_A > IMP34494_ERROR_BAND.max && IMP34494_OUTLIER_SWAP_B < IMP34494_ERROR_BAND.min,
  },
  {
    id: 'imp-34494-ladder-inside-error-band',
    description: 'all three valid ladder rungs fall inside (or bound) the measured error band',
    holds: () =>
      IMP34494_LADDER.every(
        (r) => r.residue >= IMP34494_ERROR_BAND.min - 1e-20 && r.residue <= IMP34494_ERROR_BAND.max + 1e-20
      ),
  },
  {
    id: 'imp-34494-shifts-decrease',
    description:
      'the order-by-order shift decreases quad->quartic vs quad->cubic, matching imp-34449 F2',
    holds: () => IMP34494_SHIFTS.quadToQuartic < IMP34494_SHIFTS.quadToCubic,
  },
];

for (const a of IMP34494_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34494-residue-error-bar-viz-data assertion failed: ${a.id}`);
  }
}
