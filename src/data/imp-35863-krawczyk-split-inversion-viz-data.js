/**
 * @module imp-35863-krawczyk-split-inversion-viz-data
 * @fileoverview imp-35863 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35809 shift-vs-curvature
 *   Krawczyk D3 residual-split INVERSION along the height axis.
 *
 *   imp-35809 measured the imp-35762 additive residual split (a-shift piece vs O(a^2)
 *   curvature piece) both across the imp-34693 admissible seed band (flat ~98/2) and
 *   along the height axis up to the Platt-Trudgian anchor N(T_PT) ~ 1.236e13 (INVERTS
 *   to ~1.5/98.5). This module bakes the height-ladder points, the 50/50 crossover
 *   (a ~ 4.delta, N ~ 1.88e11), and the band-top / PT-anchor landmarks as reference
 *   literals copied verbatim from the imp-35809 module exports -- it does not import
 *   imp-35809 (or its lambda-rh-height-mapping / polymath15-constant-C-C dependency
 *   chain) so pages consuming it stay import-light.
 *
 *   @see imp-35809-krawczyk-surplus-split-band-and-height-profile.js (source measurement)
 *   @see imp-35824-krawczyk-surplus-waterfall-viz-data.js (same viz-data pattern, band-anchor waterfall)
 *
 *   Ticket: imp-35863 (ux, medium). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; imp-34714a stays OPEN; NO QED.
 */

// Height-ladder points from the imp-34693 band-top up to N=1e14, indexed by log10(N).
export const IMP35863_HEIGHT_LADDER = Object.freeze([
  { N: 3.45154e9, log10N: 9.53802, a: 0.0431758, shiftFraction: 0.01895, curvatureFraction: 0.98105, label: 'band-top' },
  { N: 1.0e10, log10N: 10, a: 0.0149438, shiftFraction: 0.051434, curvatureFraction: 0.948566, label: null },
  { N: 1.0e11, log10N: 11, a: 0.00150209, shiftFraction: 0.347439, curvatureFraction: 0.652561, label: null },
  { N: 1.0e12, log10N: 12, a: 0.000150845, shiftFraction: 0.841181, curvatureFraction: 0.158819, label: null },
  { N: 1.236e13, log10N: 13.09202, a: 0.000012251, shiftFraction: 0.9849, curvatureFraction: 0.0151, label: 'PT anchor' },
  { N: 1.0e14, log10N: 14, a: 0.0000015183, shiftFraction: 0.998104, curvatureFraction: 0.001896, label: null },
]);

// The 50/50 crossover: shift_fraction = curvature_fraction, at a ~ 4.delta (closed form).
export const IMP35863_CROSSOVER = Object.freeze({
  N: 1.88166e11,
  log10N: 11.27454,
  a: 0.00079927,
  aClosedForm4Delta: 0.0008,
  shiftFraction: 0.5,
  curvatureFraction: 0.5,
});

// Band-top and PT-anchor landmark fractions (the near-mirror inversion imp-35809 found).
export const IMP35863_BAND_TOP = Object.freeze({ log10N: 9.53802, shiftFraction: 0.01895, curvatureFraction: 0.98105 });
export const IMP35863_PT_ANCHOR = Object.freeze({ log10N: 13.09202, shiftFraction: 0.9849, curvatureFraction: 0.0151 });

export const IMP35863_SPLIT_INVERSION_VIZ_DATA = {
  ticket: 'imp-35863',
  sourceTicket: 'imp-35809',
  heightLadder: IMP35863_HEIGHT_LADDER,
  crossover: IMP35863_CROSSOVER,
  bandTop: IMP35863_BAND_TOP,
  ptAnchor: IMP35863_PT_ANCHOR,
  note:
    'Along the height axis from the imp-34693 band-top (N~3.45e9) to the Platt-Trudgian anchor ' +
    '(N~1.236e13) the imp-35762 shift/curvature D3 residual split INVERTS: the curvature share ' +
    'collapses from ~98.1% to ~1.5% while the shift share rises from ~1.9% to ~98.5%, crossing ' +
    '50/50 at a ~ 4.delta (N ~ 1.88e11) -- a near-mirror of the band-top split at the PT anchor.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35809 measurement; adds no new derivation ' +
    'and changes no bound. Measurement on the inherited imp-3220/imp-3406 surrogate; imp-34714a ' +
    'machine certificate REMAINS OPEN and F(m)=0 stays a double-precision artifact; C_C 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; NO QED; no refereed bound is changed' +
    '.',
};

export const IMP35863_VIZ_ASSERTIONS = [
  {
    id: 'imp35863-height-ladder-six-points-monotone-log10N',
    description: 'height ladder has 6 points strictly increasing in log10N from band-top (~9.538) to 1e14 (14)',
    holds: () => {
      const L = IMP35863_HEIGHT_LADDER;
      if (L.length !== 6) return false;
      for (let i = 1; i < L.length; i++) if (L[i].log10N <= L[i - 1].log10N) return false;
      return Math.abs(L[0].log10N - 9.53802) < 1e-3 && L[L.length - 1].log10N === 14;
    },
  },
  {
    id: 'imp35863-split-inverts-band-top-to-pt-anchor',
    description: 'curvature dominant at band-top (~98.1%), shift dominant at PT anchor (~98.5%), a near-mirror',
    holds: () =>
      IMP35863_BAND_TOP.curvatureFraction > 0.97 &&
      IMP35863_BAND_TOP.shiftFraction < 0.03 &&
      IMP35863_PT_ANCHOR.shiftFraction > 0.97 &&
      IMP35863_PT_ANCHOR.curvatureFraction < 0.03 &&
      Math.abs(IMP35863_BAND_TOP.curvatureFraction + IMP35863_BAND_TOP.shiftFraction - 1) < 1e-9 &&
      Math.abs(IMP35863_PT_ANCHOR.curvatureFraction + IMP35863_PT_ANCHOR.shiftFraction - 1) < 1e-9,
  },
  {
    id: 'imp35863-crossover-matches-4delta-and-between-band-and-pt',
    description: 'crossover a matches the closed-form 4.delta=8e-4, and its log10N sits strictly between band-top and PT anchor',
    holds: () =>
      Math.abs(IMP35863_CROSSOVER.a - IMP35863_CROSSOVER.aClosedForm4Delta) < 5e-5 &&
      IMP35863_CROSSOVER.log10N > IMP35863_BAND_TOP.log10N &&
      IMP35863_CROSSOVER.log10N < IMP35863_PT_ANCHOR.log10N &&
      IMP35863_CROSSOVER.shiftFraction === 0.5 &&
      IMP35863_CROSSOVER.curvatureFraction === 0.5,
  },
  {
    id: 'imp35863-honesty-gate-no-qed',
    description: 'honest status references no-bound-change, imp-34714a open, NO QED, no refereed bound is changed',
    holds: () =>
      /imp-34714a/.test(IMP35863_SPLIT_INVERSION_VIZ_DATA.honest) &&
      /REMAINS OPEN/.test(IMP35863_SPLIT_INVERSION_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35863_SPLIT_INVERSION_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35863_SPLIT_INVERSION_VIZ_DATA.honest),
  },
];

for (const a of IMP35863_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35863-krawczyk-split-inversion-viz-data assertion failed: ${a.id}`);
  }
}
