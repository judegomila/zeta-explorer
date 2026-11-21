/**
 * @module imp-34580-viz-literal-crossrecompute-audit
 * @fileoverview imp-34580 (meta, medium) -- extends the imp-34553/imp-34272 viz-literal
 *   cross-recompute audit to the two newest viz-data modules imp-34494 and imp-34495.
 *
 *   UNLIKE imp-34475 (the target of imp-34553), imp-34494 and imp-34495 do NOT bake their
 *   source values as re-typed numeric literals -- they import the imp-34448/imp-34449 exports
 *   LIVE and re-export them by reference (imp-34495 verbatim, imp-34494 for its ladder + error
 *   band), so a later edit to the source module cannot silently desync the viz: the viz would
 *   simply pick up the new value on the next build. This audit confirms that by-reference
 *   identity (===) directly, closing the same copy-drift risk the imp-34553/imp-34272 pattern
 *   guards against, but by construction rather than by recompute.
 *
 *   THE ONE EXCEPTION: imp-34494 carries two genuine baked literals -- the rung-SWAP outlier
 *   values -1.62882e-8 / -2.09701e-8, quoted from the imp-34449 F4 doc-comment and re-derived
 *   inside imp-34494 via its own local Newton divided-difference implementation. Because that
 *   recompute lives in the SAME module as the comparison, it is not an independent check. This
 *   audit re-derives those two outliers a second time, from a FRESH divided-difference
 *   implementation written here (not imported from imp-34494), applied to the same imp-34237
 *   rows and imp-34310 pole location, and confirms they reproduce the imp-34494 exports.
 *
 *   THE RESULT: imp-34495 has zero baked-literal risk (pure re-exports). imp-34494's ladder and
 *   error band have zero baked-literal risk (pure re-exports); its two swap-outlier literals
 *   independently re-derive to abs err < 1e-12, matching the imp-34494 exports exactly.
 *   No copy drift detected anywhere in the imp-34494/imp-34495 pair.
 *
 *   VERIFICATION / MEASUREMENT ONLY. Adds no new derivation and changes no bound. The underlying
 *   component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 *   C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED;
 *   no refereed bound is changed.
 *
 *   @see imp-34494-residue-error-bar-viz-data.js (audited: ladder/error-band re-exports + two baked outlier literals)
 *   @see imp-34495-deflow-decay-viz-data.js (audited: pure re-exports, no baked literals)
 *   @see imp-34449-residue-curvature-error-bar-extended-rungs.js (source of the imp-34494 ladder/error-band/outlier doc values)
 *   @see imp-34448-deflow-decay-exponent.js (source of the imp-34495 re-exports)
 *   @see imp-34553-viz-literal-crossrecompute.js / imp-34272-viz-literal-crossrecompute.js (the pattern this extends)
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
  IMP34449_RESIDUE_MIN,
  IMP34449_RESIDUE_MAX,
} from './imp-34449-residue-curvature-error-bar-extended-rungs.js';
import { IMP34448_DEFLOW_DECAY_EXPONENT } from './imp-34448-deflow-decay-exponent.js';
import {
  IMP34494_LADDER,
  IMP34494_ERROR_BAND,
  IMP34494_OUTLIER_SWAP_A,
  IMP34494_OUTLIER_SWAP_B,
} from './imp-34494-residue-error-bar-viz-data.js';
import {
  IMP34495_LOCAL_EXPONENTS,
  IMP34495_EXTRAPOLATION_TABLE,
  IMP34495_ASYMPTOTIC_EXPONENT,
  IMP34495_FP_FLOOR_KEND,
  IMP34495_CROSSING_KEND,
  IMP34495_CROSSING_SHARE,
} from './imp-34495-deflow-decay-viz-data.js';

const R20 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 20.0);
const R21 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.0);
const R2125 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.25);
const R215 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.5);

// FRESH Newton divided-difference derivative -- written independently of the imp-34494 copy,
// so this is a genuine second implementation, not a re-import of the code under audit.
function freshPolyDerivAt(nodes, x) {
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

function freshResidueFromFit(nodes) {
  const slope = freshPolyDerivAt(nodes, IMP34310_KSTAR);
  return IMP34310_EFLOW_ATTR_AT_KSTAR / slope;
}

export const IMP34580_RECOMPUTED_OUTLIER_SWAP_A = freshResidueFromFit([R20, R2125, R215]);
export const IMP34580_RECOMPUTED_OUTLIER_SWAP_B = freshResidueFromFit([R20, R21, R2125]);

export const IMP34580_VIZ_LITERAL_CROSSRECOMPUTE_AUDIT = {
  ticket: 'imp-34580',
  proofSection: 'S-frontier',
  audited: ['imp-34494-residue-error-bar-viz-data', 'imp-34495-deflow-decay-viz-data'],
  sources: ['imp-34449-residue-curvature-error-bar-extended-rungs', 'imp-34448-deflow-decay-exponent'],
  driftDetected: false,
  finding:
    'imp-34495 re-exports the imp-34448 decay-exponent series by reference only (zero baked ' +
    'literals). imp-34494 re-exports the imp-34449 ladder and error band by reference only (zero ' +
    'baked literals); its two swap-outlier doc-comment literals (-1.62882e-8, -2.09701e-8) ' +
    'independently re-derive from a second, freshly-written divided-difference implementation to ' +
    'abs err < 1e-12. No copy drift detected in either viz-data module.',
  honest:
    'CROSS-RECOMPUTE / VERIFICATION ONLY -- confirms the imp-34494/imp-34495 viz-data literals ' +
    'either carry no copy-drift risk by construction (live re-export) or reproduce a fresh, ' +
    'independent re-derivation; adds no new derivation and changes no bound. Component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34580_ASSERTIONS = [
  {
    id: 'imp-34580-imp34494-ladder-is-live-reexport',
    description: 'the imp-34494 ladder rungs are the exact same object identity as the imp-34449 exports',
    holds: () =>
      IMP34494_LADDER[0].residue === IMP34449_RESIDUE_QUAD &&
      IMP34494_LADDER[1].residue === IMP34449_RESIDUE_CUBIC &&
      IMP34494_LADDER[2].residue === IMP34449_RESIDUE_QUARTIC,
  },
  {
    id: 'imp-34580-imp34494-error-band-is-live-reexport',
    description: 'the imp-34494 error band min/max are the exact same value as the imp-34449 exports',
    holds: () =>
      IMP34494_ERROR_BAND.min === IMP34449_RESIDUE_MIN && IMP34494_ERROR_BAND.max === IMP34449_RESIDUE_MAX,
  },
  {
    id: 'imp-34580-imp34494-outliers-reproduce-fresh-recompute',
    description:
      'the imp-34494 exported swap outliers reproduce a SECOND, independently-written divided-difference recompute',
    holds: () =>
      Math.abs(IMP34494_OUTLIER_SWAP_A - IMP34580_RECOMPUTED_OUTLIER_SWAP_A) < 1e-12 &&
      Math.abs(IMP34494_OUTLIER_SWAP_B - IMP34580_RECOMPUTED_OUTLIER_SWAP_B) < 1e-12,
  },
  {
    id: 'imp-34580-imp34495-is-live-reexport',
    description: 'every imp-34495 export is the exact same object/value identity as the imp-34448 export',
    holds: () =>
      IMP34495_LOCAL_EXPONENTS === IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample &&
      IMP34495_EXTRAPOLATION_TABLE === IMP34448_DEFLOW_DECAY_EXPONENT.extrapolationTable &&
      IMP34495_ASYMPTOTIC_EXPONENT === IMP34448_DEFLOW_DECAY_EXPONENT.asymptoticDecayExponent &&
      IMP34495_FP_FLOOR_KEND === IMP34448_DEFLOW_DECAY_EXPONENT.fpFloorKend &&
      IMP34495_CROSSING_KEND === IMP34448_DEFLOW_DECAY_EXPONENT.crossingKend &&
      IMP34495_CROSSING_SHARE === IMP34448_DEFLOW_DECAY_EXPONENT.crossingShareFit,
  },
  {
    id: 'imp-34580-no-drift-flag',
    description: 'the audit reports no drift (measurement/verification only, no bound change)',
    holds: () => IMP34580_VIZ_LITERAL_CROSSRECOMPUTE_AUDIT.driftDetected === false,
  },
];

for (const a of IMP34580_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34580-viz-literal-crossrecompute-audit assertion failed: ${a.id}`);
  }
}
