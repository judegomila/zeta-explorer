/**
 * @module imp-34457-residue-curvature-corrected-viz-data
 * @fileoverview imp-34457 -- VIZ DATA ONLY for the imp-34397 curvature-corrected residue
 *   re-read: the 3-rung quadratic through k=21.0/21.25/21.5 recovering R~-1.740e-8, contrasted
 *   with the imp-34310 2-point linear secant R~-1.979e-8.
 *
 *   imp-34310 measured the eflow_over_resid pole residue at k*~21.28095 with a 2-point secant
 *   over the outer pair of rungs (21.25, 21.5), giving R = -1.97908e-8. imp-34397 used the
 *   THIRD (unused-by-the-secant) rung at k=21.0 to fit a quadratic through all three rungs and
 *   evaluate the local slope AT k* instead of averaging it over the wide secant span -- this
 *   tightens the residue to R = -1.74023e-8, a -12.07% inward shift, while the quadratic zero
 *   independently recovers k* to <5e-4 (9.5x tighter than the linear secant zero).
 *
 *   Values below are baked reference literals, reproduced exactly from the imp-34310 and
 *   imp-34397 modules' exports (direct re-statement, not re-derived here). This module does
 *   NOT import lambda-rh-height-mapping.js or polymath15-constant-C-C.js -- no fresh
 *   computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-34397-eflow-over-resid-residue-curvature-corrected.js (source measurement: quadratic re-read)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (source measurement: linear secant read)
 *
 *   Ticket: imp-34457 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. Component model is the inherited surrogate diagnostic, NOT
 *   rigorous; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED;
 *   no refereed bound is changed.
 */

// -- the three baked imp-34237 rungs feeding both the linear secant and the quadratic fit --
export const IMP34457_RUNGS = Object.freeze([
  Object.freeze({ k: 21.0, residExp: 8.72e-8, usedByLinearSecant: false }),
  Object.freeze({ k: 21.25, residExp: 8.19e-9, usedByLinearSecant: true }),
  Object.freeze({ k: 21.5, residExp: -4.97e-8, usedByLinearSecant: true }),
]);

// -- the two competing residue reads at k* ~ 21.28095 --
export const IMP34457_RESIDUE_COMPARISON = Object.freeze({
  kStar: 21.28095,
  linear: Object.freeze({
    label: 'Linear secant (imp-34310)',
    slopeAtKStar: -2.3156e-7,
    residue: -1.97908e-8,
    kZero: 21.285369,
    kZeroGap: 21.285369 - 21.28095,
  }),
  quadratic: Object.freeze({
    label: 'Quadratic at k* (imp-34397)',
    slopeAtKStar: -2.63341e-7,
    residue: -1.74023e-8,
    kZero: 21.280486,
    kZeroGap: 21.280486 - 21.28095,
  }),
});

export const IMP34457_RESIDUE_REL_SHIFT = Object.freeze({
  relShift: -0.120685, // (R_quad - R_linear) / R_linear
  kZeroGapTighteningFactor: Math.abs(21.285369 - 21.28095) / Math.abs(21.280486 - 21.28095), // ~9.5x
});

export default Object.freeze({
  id: 'imp-34457-residue-curvature-corrected-viz-data',
  ticket: 'imp-34457',
  source: ['imp-34310-eflow-over-resid-pole-residue-simple-pole.js', 'imp-34397-eflow-over-resid-residue-curvature-corrected.js'],
  rungs: IMP34457_RUNGS,
  comparison: IMP34457_RESIDUE_COMPARISON,
  shift: IMP34457_RESIDUE_REL_SHIFT,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34457_ASSERTIONS = [
  {
    id: 'imp34457-three-rungs-bracket-kstar-with-one-unused-by-secant',
    holds: () => {
      const r = IMP34457_RUNGS;
      return (
        r.length === 3 &&
        r[0].k === 21.0 &&
        r[0].usedByLinearSecant === false &&
        r[1].usedByLinearSecant === true &&
        r[2].usedByLinearSecant === true
      );
    },
    why: 'The k=21.0 rung must be present but flagged as unused by the imp-34310 linear secant, since imp-34397 is exactly the re-read that puts it to use.',
  },
  {
    id: 'imp34457-quadratic-residue-tighter-and-smaller-magnitude',
    holds: () => {
      const { linear, quadratic } = IMP34457_RESIDUE_COMPARISON;
      return (
        quadratic.residue < 0 &&
        linear.residue < 0 &&
        quadratic.residue > linear.residue && // smaller magnitude, both negative
        Math.abs(quadratic.residue - -1.74023e-8) < 1e-12 &&
        Math.abs(linear.residue - -1.97908e-8) < 1e-12
      );
    },
    why: 'The curvature-corrected residue must be negative and smaller in magnitude than the linear secant residue, matching the imp-34397 -12.07% inward shift.',
  },
  {
    id: 'imp34457-quadratic-zero-tighter-than-linear-zero',
    holds: () => {
      const { linear, quadratic } = IMP34457_RESIDUE_COMPARISON;
      return (
        Math.abs(quadratic.kZeroGap) < Math.abs(linear.kZeroGap) &&
        IMP34457_RESIDUE_REL_SHIFT.kZeroGapTighteningFactor > 9 &&
        IMP34457_RESIDUE_REL_SHIFT.kZeroGapTighteningFactor < 10
      );
    },
    why: 'The quadratic zero of resid_exp must recover k* tighter than the linear secant zero, by roughly the ~9.5x factor imp-34397 reports.',
  },
];

for (const assertion of IMP34457_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34457-residue-curvature-corrected-viz-data assertion failed: ${assertion.id}`);
  }
}
