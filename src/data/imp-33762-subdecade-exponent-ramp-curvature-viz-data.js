/**
 * @module imp-33762-subdecade-exponent-ramp-curvature-viz-data
 * @fileoverview imp-33762 -- VIZ DATA ONLY for the imp-33721 sub-decade exponent-ramp
 *   curvature result: three aligned series over [1e9,1e11] --
 *     (1) the quarter-decade local exponent p_dec ladder (the ramp itself),
 *     (2) its first difference D1 (velocity), peaking near center 1e9.5,
 *     (3) its second difference D2 (acceleration), crossing zero exactly once --
 *   plus a single knee marker at the imp-33721 D2 zero-crossing N* ~ 3.38e9
 *   (log10 N* ~ 9.529), so the "one sign change on the interior sub-decade grid"
 *   finding is visible directly on a chart instead of read off a table.
 *
 *   This module imports ONLY the light imp-33721 baked ladder/D1/D2/knee exports --
 *   it does NOT recompute sigma(N) or re-import the heavy zeros-to-1e6.js bundle,
 *   per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-33721-sigma-ramp-inflection-subdecade.js (the sub-decade ladder, D1/D2, and knee baked here)
 *   @see imp-33701-sigma-postpeak-ramp-curvature-inflection.js (the coarse whole-decade ladder imp-33721 refines)
 *
 *   Ticket: imp-33762 (ux, low). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. imp-3066 K_a>=0 UNTOUCHED. RH-EQUIVALENT. NO QED.
 *   No refereed bound is changed.
 */

import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';

const SRC = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE;

// -- series 1: the quarter-decade local-exponent ladder p_dec, one point per sub-bracket --
export const IMP33762_EXPONENT_LADDER = Object.freeze(
  SRC.subLadder.map((row) => Object.freeze({ bracket: row.bracket, p_local: row.p_local })),
);

// -- series 2: D1 (velocity), one point per adjacent-bracket pair, centered in log10 N --
export const IMP33762_VELOCITY_D1 = Object.freeze(
  SRC.subVelocityD1.map((row) => Object.freeze({ centerLog10: row.centerLog10, d1: row.d1 })),
);

// -- series 3: D2 (acceleration), one point per adjacent-D1 pair, centered in log10 N --
export const IMP33762_ACCELERATION_D2 = Object.freeze(
  SRC.subAccelerationD2.map((row) => Object.freeze({ centerLog10: row.centerLog10, d2: row.d2 })),
);

// -- the single D2 zero-crossing knee marker --
export const IMP33762_KNEE_MARKER = Object.freeze({
  log10Nstar: SRC.inflectionLog10Nstar,
  Nstar: SRC.inflectionNstar,
  numSignChanges: SRC.numSignChanges,
});

// -- the D1 peak (steepest ramp velocity), plotted alongside the knee for context --
export const IMP33762_STEEPEST_VELOCITY_MARKER = Object.freeze({
  Nnear: SRC.steepestVelocityNear,
});

export default Object.freeze({
  id: 'imp-33762-subdecade-exponent-ramp-curvature-viz-data',
  ticket: 'imp-33762',
  source: ['imp-33721-sigma-ramp-inflection-subdecade.js'],
  exponentLadder: IMP33762_EXPONENT_LADDER,
  velocityD1: IMP33762_VELOCITY_D1,
  accelerationD2: IMP33762_ACCELERATION_D2,
  kneeMarker: IMP33762_KNEE_MARKER,
  steepestVelocityMarker: IMP33762_STEEPEST_VELOCITY_MARKER,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP33762_ASSERTIONS = [
  {
    id: 'imp33762-ladder-matches-source-length',
    holds: () => IMP33762_EXPONENT_LADDER.length === SRC.subLadder.length,
    why: 'The plotted exponent ladder must reproduce every imp-33721 sub-bracket, not a subset.',
  },
  {
    id: 'imp33762-d1-one-shorter-than-ladder',
    holds: () => IMP33762_VELOCITY_D1.length === IMP33762_EXPONENT_LADDER.length - 1,
    why: 'D1 is a first difference over adjacent brackets, so it has exactly one fewer point than the ladder.',
  },
  {
    id: 'imp33762-d2-one-shorter-than-d1',
    holds: () => IMP33762_ACCELERATION_D2.length === IMP33762_VELOCITY_D1.length - 1,
    why: 'D2 is a first difference of D1, so it has exactly one fewer point than the D1 series.',
  },
  {
    id: 'imp33762-single-sign-change-in-d2',
    holds: () => {
      let signChanges = 0;
      for (let i = 1; i < IMP33762_ACCELERATION_D2.length; i++) {
        if (Math.sign(IMP33762_ACCELERATION_D2[i].d2) !== Math.sign(IMP33762_ACCELERATION_D2[i - 1].d2)) {
          signChanges += 1;
        }
      }
      return signChanges === IMP33762_KNEE_MARKER.numSignChanges && signChanges === 1;
    },
    why: 'The chart must show the exact single D2 sign change the imp-33721 finding rests on.',
  },
  {
    id: 'imp33762-knee-in-1e9-decade',
    holds: () => IMP33762_KNEE_MARKER.log10Nstar >= 9.0 && IMP33762_KNEE_MARKER.log10Nstar < 10.0,
    why: 'The imp-33721 F1 finding places the refined knee inside [1e9,1e10], a full decade below the coarse [1e10,1e11] bracket.',
  },
  {
    id: 'imp33762-honesty-gate-no-qed',
    holds: () => SRC.isRigorous === false && /NO QED/.test(SRC.verdict),
    why: 'Presentation of a non-rigorous curvature measurement must inherit the source NO-QED gate.',
  },
];

for (const assertion of IMP33762_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33762-subdecade-exponent-ramp-curvature-viz-data assertion failed: ${assertion.id}`);
  }
}
