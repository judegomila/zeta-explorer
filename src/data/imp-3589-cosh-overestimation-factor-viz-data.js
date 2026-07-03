/**
 * @module imp-3589-cosh-overestimation-factor-viz-data
 * @fileoverview imp-3589 -- lightweight, import-light literal data for a
 *   visualization of the imp-3552 cosh-certificate over-estimation factor
 *   F_n(a) = bound_sharp(a,n)/|E_n(a)| across the imp-3532 a-ladder
 *   a in {0.5, 0.25, 0.125, 0.0625} for rungs n = 0..4. F_n(a) collapses
 *   from ~10.06 at a=0.5 down to ~1.07 at a=0.0625 on every rung, sitting
 *   just under the cosh(a T_A) envelope (T_A = 6) to within <0.05% (rungs
 *   n=3,4 touch the envelope exactly since their residual-shape factor is 1
 *   at MMAX = 6).
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-3552-cosh-certificate-overestimation-factor.js measured.profile
 *   field; this module does NOT import the imp-3481 moment ladder, so
 *   importing it into a page costs nothing at load time.
 *
 *   @see imp-3552-cosh-certificate-overestimation-factor.js (the source measurement)
 *   @see imp-3532-moment-tail-closed-error-bound.js (the sharp certificate being over-estimated)
 *   @see imp-3586-sigma-crossing-logistic-drop-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-3589 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// The support cap T_A the cosh(a T_A) envelope uses (imp-3481 measured constant).
export const IMP3589_T_A = 6;

// a-ladder (imp-3532), largest first, matching the source profile row order.
export const IMP3589_A_LADDER = Object.freeze([0.5, 0.25, 0.125, 0.0625]);

// Per-rung over-estimation factor F_n(a) across the a-ladder (baked from
// imp-3552 measured.profile). coshInflation is identical across rungs at a
// fixed a (it depends only on a, T_A), included per-row for convenience.
export const IMP3589_PROFILE = Object.freeze([
  {
    n: 0,
    rows: Object.freeze([
      { a: 0.5, factor: 10.063213084805907, coshInflation: 10.067661995777765 },
      { a: 0.25, factor: 2.3521497060492407, coshInflation: 2.352409615243247 },
      { a: 0.125, factor: 1.2946475225664478, coshInflation: 1.2946832846768448 },
      { a: 0.0625, factor: 1.071132949822285, coshInflation: 1.0711403467045868 },
    ]),
  },
  {
    n: 1,
    rows: Object.freeze([
      { a: 0.5, factor: 10.063995417170446, coshInflation: 10.067661995777765 },
      { a: 0.25, factor: 2.352195373560907, coshInflation: 2.352409615243247 },
      { a: 0.125, factor: 1.2946538048967715, coshInflation: 1.2946832846768448 },
      { a: 0.0625, factor: 1.0711342491667788, coshInflation: 1.0711403467045868 },
    ]),
  },
  {
    n: 2,
    rows: Object.freeze([
      { a: 0.5, factor: 10.064559967821832, coshInflation: 10.067661995777765 },
      { a: 0.25, factor: 2.352228368418227, coshInflation: 2.352409615243247 },
      { a: 0.125, factor: 1.2946583452706932, coshInflation: 1.2946832846768448 },
      { a: 0.0625, factor: 1.0711351883020628, coshInflation: 1.0711403467045868 },
    ]),
  },
  {
    n: 3,
    rows: Object.freeze([
      { a: 0.5, factor: 10.067661995777765, coshInflation: 10.067661995777765 },
      { a: 0.25, factor: 2.352409615243247, coshInflation: 2.352409615243247 },
      { a: 0.125, factor: 1.2946832846768448, coshInflation: 1.2946832846768448 },
      { a: 0.0625, factor: 1.0711403467045868, coshInflation: 1.0711403467045868 },
    ]),
  },
  {
    n: 4,
    rows: Object.freeze([
      { a: 0.5, factor: 10.067661995777765, coshInflation: 10.067661995777765 },
      { a: 0.25, factor: 2.352409615243247, coshInflation: 2.352409615243247 },
      { a: 0.125, factor: 1.2946832846768448, coshInflation: 1.2946832846768448 },
      { a: 0.0625, factor: 1.0711403467045868, coshInflation: 1.0711403467045868 },
    ]),
  },
]);

// Ladder endpoints called out in the imp-3552 verdict.
export const IMP3589_TOP_OF_LADDER = Object.freeze({ a: 0.5, coshCeiling: 10.067661995777765, worstFactor: 10.067661995777765 });
export const IMP3589_A_LIMIT = Object.freeze({ a: 0.0625, coshCeiling: 1.0711403467045868, worstFactor: 1.0711403467045868 });

// F2/F5 ceiling-tightness bound: max relative gap between F_n(a) and the
// cosh(a T_A) envelope across every rung/a, i.e. max (cosh - factor)/cosh.
export const IMP3589_MAX_ENVELOPE_GAP_PCT = 0.0442; // % (rung n=0, a=0.5); exact 0.04419
