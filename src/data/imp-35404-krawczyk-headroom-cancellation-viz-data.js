/**
 * @module imp-35404-krawczyk-headroom-cancellation-viz-data
 * @fileoverview imp-35404 -- VIZ DATA ONLY for the imp-35266 Krawczyk contraction-validity
 *   headroom 2:1 cancellation: at each of the three imp-34693 admissible-band landmarks
 *   (band-bottom, N_cross, band-top) the surplus above the closed-form floor S_inf = 2500
 *   is the net of a POSITIVE FP_LO finite-N push (dFP) against a NEGATIVE asymptotic-floor
 *   G-factor pull (dG), with -dFP/dG ~ 2.00042 essentially N-flat across the band.
 *
 *   imp-35266 tabulated the decomposition but shipped no chart (imp-35275 visualizes only
 *   the S(N) band profile, not this additive split). Values below are baked reference
 *   literals, reproduced verbatim from the imp-35266 measurement block (dG/dFP/surplus at
 *   band-bottom, N_cross, band-top). This module does NOT import lambda-rh-height-mapping.js
 *   -- no fresh computation, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35266-krawczyk-headroom-surplus-decomposition.js (source of the baked literals)
 *   @see imp-35241-krawczyk-headroom-band-profile.js (S(N) band profile, not decomposed)
 *   @see imp-35275 (viz of the band profile; does not show this additive split)
 *
 *   Ticket: imp-35404 (ux, medium). Presentation only of an already-established measurement;
 *   adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

// -- three-landmark 2:1 cancellation ladder: dG (asymptotic-floor pull) vs dFP (FP_LO push) --
export const IMP35404_LADDER = Object.freeze([
  Object.freeze({ label: 'band-bottom', dG: -61.368, dFP: 122.762, surplus: 61.394, ratio: 2.00042 }),
  Object.freeze({ label: 'N_cross', dG: -58.099, dFP: 116.222, surplus: 58.123, ratio: 2.00042 }),
  Object.freeze({ label: 'band-top', dG: -55.1605, dFP: 110.3441, surplus: 55.1835, ratio: 2.00042 }),
]);

export const IMP35404_S_INF = 2500;

export const IMP35404_SUMMARY = Object.freeze({
  ratioNFlat: true,
  surplusShrinksBandBottomToTop: IMP35404_LADDER[0].surplus > IMP35404_LADDER[2].surplus,
});

export default Object.freeze({
  id: 'imp-35404-krawczyk-headroom-cancellation-viz-data',
  ticket: 'imp-35404',
  sources: ['imp-35266-krawczyk-headroom-surplus-decomposition.js'],
  ladder: IMP35404_LADDER,
  sInf: IMP35404_S_INF,
  summary: IMP35404_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35404_ASSERTIONS = [
  {
    id: 'imp35404-three-landmarks-present',
    holds: () => IMP35404_LADDER.length === 3 && IMP35404_LADDER.map((r) => r.label).join(',') === 'band-bottom,N_cross,band-top',
    why: 'The ladder must cover exactly the three imp-34693 band landmarks in band order.',
  },
  {
    id: 'imp35404-split-reconstructs-surplus-every-landmark',
    holds: () => IMP35404_LADDER.every((r) => Math.abs(r.dG + r.dFP - r.surplus) < 5e-3),
    why: 'imp-35266 D1: dG + dFP must reconstruct the additive surplus above S_inf at every landmark.',
  },
  {
    id: 'imp35404-fp-positive-g-negative-every-landmark',
    holds: () => IMP35404_LADDER.every((r) => r.dFP > 0 && r.dG < 0),
    why: 'imp-35266 D1: the FP_LO finite-N part must push above the floor (positive) and the G-factor part must pull below it (negative) at every landmark.',
  },
  {
    id: 'imp35404-ratio-near-two-and-N-flat',
    holds: () =>
      IMP35404_LADDER.every((r) => Math.abs(-r.dFP / r.dG - 2) < 0.001) &&
      Math.abs(IMP35404_LADDER[0].ratio - IMP35404_LADDER[2].ratio) < 1e-4,
    why: 'imp-35266 D2: -dFP/dG must be ~2.00042 and essentially N-flat across band-bottom, N_cross and band-top.',
  },
  {
    id: 'imp35404-surplus-shrinks-down-the-band',
    holds: () => IMP35404_SUMMARY.surplusShrinksBandBottomToTop === true,
    why: 'imp-35266/imp-35241: the net surplus above the S_inf floor decreases from band-bottom to band-top, matching the monotone-descending S(N) profile (imp-34929).',
  },
];

for (const assertion of IMP35404_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35404-krawczyk-headroom-cancellation-viz-data assertion failed: ${assertion.id}`);
  }
}
