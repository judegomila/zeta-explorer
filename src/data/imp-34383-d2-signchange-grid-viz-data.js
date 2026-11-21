/**
 * @module imp-34383-d2-signchange-grid-viz-data
 * @fileoverview imp-34383 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-34291 D2 sign-change
 *   count grid: 39 width x offset x domain configurations testing whether the
 *   imp-33701/imp-33721 single-sigmoid-knee reading of sigma(N) is robust.
 *
 *   imp-34291 counted D2 (ramp-acceleration) sign changes across three sweeps:
 *   an 11-width sweep on [1e9,1e11] (edge phase 0), a 16-config width/offset
 *   sweep on the same narrow domain, and a 12-config wider-domain sweep on
 *   [1e8,1e12] and [1e8.5,1e11.5]. Across all 39 configurations the count never
 *   exceeds 1 -- no configuration ever fabricates a spurious SECOND knee. The
 *   only failure mode is the coarsest narrow-domain grids (W=0.4, W=0.5, and the
 *   phase-shifted W=0.25 offset 0.1875) UNDER-counting to zero -- too few
 *   sub-brackets to resolve the curvature at all -- never over-counting.
 *   Widening the domain restores exactly one crossing at every coarse width.
 *
 *   All numbers are baked reference literals recomputed from the imp-34291
 *   module's widthSweep/offsetSweep/widerDomainSweep exports -- this module does
 *   not import imp-34291 (or its lambda-rh-height-mapping /
 *   polymath15-constant-C-C dependency chain) so pages consuming it stay
 *   import-light.
 *
 *   @see imp-34291-sigma-inflection-uniqueness-robustness.js (source measurement)
 *   @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee LOCATION, width-robust)
 *   @see imp-33701-sigma-postpeak-ramp-curvature-inflection (whole-decade single D2 knee)
 *   @see imp-34378-trough-peak-ratio-ceiling-viz-data.js (same viz-data pattern)
 *
 *   Ticket: imp-34383 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; imp-3066 untouched; NO QED.
 */

// (S1) Narrow-domain [1e9,1e11] width sweep, edge phase 0 -- 11 widths, W=0.4/0.5 under-count to zero.
export const IMP34383_NARROW_WIDTH_SWEEP = Object.freeze([
  { widthDecades: 0.05, numD2: 38, signChanges: 1 },
  { widthDecades: 0.0625, numD2: 30, signChanges: 1 },
  { widthDecades: 0.075, numD2: 24, signChanges: 1 },
  { widthDecades: 0.1, numD2: 18, signChanges: 1 },
  { widthDecades: 0.125, numD2: 14, signChanges: 1 },
  { widthDecades: 0.15, numD2: 11, signChanges: 1 },
  { widthDecades: 0.2, numD2: 8, signChanges: 1 },
  { widthDecades: 0.25, numD2: 6, signChanges: 1 },
  { widthDecades: 0.3, numD2: 4, signChanges: 1 },
  { widthDecades: 0.4, numD2: 3, signChanges: 0 },
  { widthDecades: 0.5, numD2: 2, signChanges: 0 },
]);

// (S2) Narrow-domain [1e9,1e11] offset sweep -- 4 widths x 4 phase fractions {0,0.25W,0.5W,0.75W}.
// Only one config (W=0.25, offset 0.75W = 0.1875 decades) under-counts to zero.
export const IMP34383_OFFSET_SWEEP = Object.freeze([
  { widthDecades: 0.1, offsetFraction: 0, numD2: 18, signChanges: 1 },
  { widthDecades: 0.1, offsetFraction: 0.25, numD2: 17, signChanges: 1 },
  { widthDecades: 0.1, offsetFraction: 0.5, numD2: 17, signChanges: 1 },
  { widthDecades: 0.1, offsetFraction: 0.75, numD2: 17, signChanges: 1 },
  { widthDecades: 0.125, offsetFraction: 0, numD2: 14, signChanges: 1 },
  { widthDecades: 0.125, offsetFraction: 0.25, numD2: 13, signChanges: 1 },
  { widthDecades: 0.125, offsetFraction: 0.5, numD2: 13, signChanges: 1 },
  { widthDecades: 0.125, offsetFraction: 0.75, numD2: 13, signChanges: 1 },
  { widthDecades: 0.2, offsetFraction: 0, numD2: 8, signChanges: 1 },
  { widthDecades: 0.2, offsetFraction: 0.25, numD2: 7, signChanges: 1 },
  { widthDecades: 0.2, offsetFraction: 0.5, numD2: 7, signChanges: 1 },
  { widthDecades: 0.2, offsetFraction: 0.75, numD2: 7, signChanges: 1 },
  { widthDecades: 0.25, offsetFraction: 0, numD2: 6, signChanges: 1 },
  { widthDecades: 0.25, offsetFraction: 0.25, numD2: 5, signChanges: 1 },
  { widthDecades: 0.25, offsetFraction: 0.5, numD2: 5, signChanges: 1 },
  { widthDecades: 0.25, offsetFraction: 0.75, numD2: 5, signChanges: 0 },
]);

// (S3) Wider-domain sweep on [1e8,1e12] and [1e8.5,1e11.5] -- every coarse width up to 0.5
// restores exactly ONE sign change, confirming the narrow-domain zeros were under-resolution.
export const IMP34383_WIDE_DOMAIN_SWEEP = Object.freeze([
  { domain: '1e8->1e12', widthDecades: 0.1, numD2: 38, signChanges: 1 },
  { domain: '1e8->1e12', widthDecades: 0.2, numD2: 18, signChanges: 1 },
  { domain: '1e8->1e12', widthDecades: 0.25, numD2: 14, signChanges: 1 },
  { domain: '1e8->1e12', widthDecades: 0.3, numD2: 11, signChanges: 1 },
  { domain: '1e8->1e12', widthDecades: 0.4, numD2: 8, signChanges: 1 },
  { domain: '1e8->1e12', widthDecades: 0.5, numD2: 6, signChanges: 1 },
  { domain: '1e8.5->1e11.5', widthDecades: 0.1, numD2: 28, signChanges: 1 },
  { domain: '1e8.5->1e11.5', widthDecades: 0.2, numD2: 13, signChanges: 1 },
  { domain: '1e8.5->1e11.5', widthDecades: 0.25, numD2: 10, signChanges: 1 },
  { domain: '1e8.5->1e11.5', widthDecades: 0.3, numD2: 8, signChanges: 1 },
  { domain: '1e8.5->1e11.5', widthDecades: 0.4, numD2: 5, signChanges: 1 },
  { domain: '1e8.5->1e11.5', widthDecades: 0.5, numD2: 4, signChanges: 1 },
]);

export const IMP34383_NUM_CONFIGS = 39;
export const IMP34383_MAX_SIGN_CHANGES = 1;
export const IMP34383_NUM_UNDERCOUNT_ZERO = 3;

export const IMP34383_D2_SIGNCHANGE_GRID_VIZ_DATA = {
  ticket: 'imp-34383',
  sourceTicket: 'imp-34291',
  narrowWidthSweep: IMP34383_NARROW_WIDTH_SWEEP,
  offsetSweep: IMP34383_OFFSET_SWEEP,
  wideDomainSweep: IMP34383_WIDE_DOMAIN_SWEEP,
  numConfigsTested: IMP34383_NUM_CONFIGS,
  maxSignChanges: IMP34383_MAX_SIGN_CHANGES,
  numUndercountZero: IMP34383_NUM_UNDERCOUNT_ZERO,
  note:
    'Across all 39 width x offset x domain configurations the D2 sign-change count never exceeds ' +
    '1 -- no configuration ever fabricates a spurious SECOND knee. The only failure mode is the ' +
    'coarsest narrow-domain grids (W=0.4, W=0.5 in the width sweep; W=0.25 offset 0.75W in the ' +
    'offset sweep) UNDER-counting to zero, never over-counting. Widening the domain to [1e8,1e12] ' +
    'or [1e8.5,1e11.5] restores exactly one crossing at every coarse width up to 0.5.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-34291 measurement; adds no new derivation ' +
    'and changes no bound. Descriptive OLS surrogate/fit, NOT a rigorous asymptotic; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34383_VIZ_ASSERTIONS = [
  {
    id: 'imp34383-39-configs-total',
    description: '11 width-sweep + 16 offset-sweep + 12 wide-domain-sweep = 39 configurations',
    holds: () =>
      IMP34383_NARROW_WIDTH_SWEEP.length === 11 &&
      IMP34383_OFFSET_SWEEP.length === 16 &&
      IMP34383_WIDE_DOMAIN_SWEEP.length === 12 &&
      IMP34383_NARROW_WIDTH_SWEEP.length + IMP34383_OFFSET_SWEEP.length + IMP34383_WIDE_DOMAIN_SWEEP.length ===
        IMP34383_NUM_CONFIGS,
  },
  {
    id: 'imp34383-no-spurious-second-sign-change',
    description: 'signChanges never exceeds 1 across all 39 configurations',
    holds: () =>
      [...IMP34383_NARROW_WIDTH_SWEEP, ...IMP34383_OFFSET_SWEEP, ...IMP34383_WIDE_DOMAIN_SWEEP].every(
        (r) => r.signChanges <= IMP34383_MAX_SIGN_CHANGES,
      ),
  },
  {
    id: 'imp34383-undercount-zero-count-matches-source',
    description: 'exactly 3 configs under-count to zero (W=0.4, W=0.5, offset W=0.25/0.75W)',
    holds: () => {
      const zeros = [...IMP34383_NARROW_WIDTH_SWEEP, ...IMP34383_OFFSET_SWEEP].filter((r) => r.signChanges === 0);
      return zeros.length === IMP34383_NUM_UNDERCOUNT_ZERO;
    },
  },
  {
    id: 'imp34383-wide-domain-all-single',
    description: 'every wide-domain config recovers exactly one D2 sign change',
    holds: () => IMP34383_WIDE_DOMAIN_SWEEP.every((r) => r.signChanges === 1),
  },
  {
    id: 'imp34383-honesty-gate-no-qed',
    description: 'honest status references no-bound-change, NOT rigorous, NO QED, no refereed bound is changed',
    holds: () =>
      /NOT a rigorous asymptotic/.test(IMP34383_D2_SIGNCHANGE_GRID_VIZ_DATA.honest) &&
      /NO QED/.test(IMP34383_D2_SIGNCHANGE_GRID_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP34383_D2_SIGNCHANGE_GRID_VIZ_DATA.honest),
  },
];

for (const a of IMP34383_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34383-d2-signchange-grid-viz-data assertion failed: ${a.id}`);
  }
}
