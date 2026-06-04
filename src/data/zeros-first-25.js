/**
 * @fileoverview Lightweight, metadata-only list of the first 25 Odlyzko zero
 * ordinates of the Riemann zeta function (gamma_1 .. gamma_25, the imaginary
 * parts of the first 25 non-trivial zeros on the critical line).
 *
 * @module data/zeros-first-25
 *
 * Exports:
 *   - FIRST_25_ZEROS (named + default): a frozen array of 25 numbers, the
 *     positive ordinates gamma_k in increasing order.
 *
 * Proof-chain role: this is a data leaf, not a derivation. It exists purely as
 * a bundle-size optimization for visualization pages that need only the first
 * handful of zeros. Importing it lets those pages avoid transitively pulling
 * the 16.7 MB zeros-to-1e6.js bundle (the full zero database used by the
 * spectral / pair-correlation proof-attack code). Same split pattern as
 * src/data/paper-publication-meta.js -- see memory feedback_no_heavy_imports_in_pages.md.
 *
 * Key assertion: these values match ZEROS_EXTENDED.slice(0, 25) from
 * zeros-to-1e6.js exactly; the two sources must stay in sync. The array is
 * Object.freeze-d so consumers cannot mutate the shared zero data.
 *
 * Tickets: created/maintained under the no-heavy-imports-in-pages effort;
 * module-level JSDoc added by imp-2468.
 */

export const FIRST_25_ZEROS = Object.freeze([
  14.134725141734693790,
  21.022039638771554993,
  25.010857580145688763,
  30.424876125859513210,
  32.935061587739189691,
  37.586178158825671257,
  40.918719012147495187,
  43.327073280914999519,
  48.005150881167159727,
  49.773832477672302182,
  52.970321477714460644,
  56.446247697063394804,
  59.347044002602353079,
  60.831778524609809844,
  65.112544048081606660,
  67.079810529494173714,
  69.546401711173979253,
  72.067157674481907583,
  75.704690699083933168,
  77.144840068874805373,
  79.337375020249367922,
  82.910380854086030184,
  84.735492980517050106,
  87.425274613125229407,
  88.809111207634465423,
]);

export default FIRST_25_ZEROS;
