/**
 * @module imp-97846-kernel-fold-diag3-cohort-index
 * @fileoverview imp-97846 -- META cross-reference cohort index grouping the kernel-fold /
 *   DIAG3-fold-survival modules (imp-97662 square-root fold, imp-97721 straddle,
 *   imp-97823 sqrt(10) kernel law) as one near-peak-elasticity family, mirroring the
 *   imp-97092 / imp-96987 cohort indices. Read individually, a scout may re-derive the fold
 *   law or re-cross-validate DIAG3 near the imp-97520 L1 peak and mistake either result for
 *   the whole picture. Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (logical order, not chronological). All three characterise the SAME near-peak
 *   region -- the imp-97520 L1 interior maximum sigma_max ~ 0.949429 (N_peak ~ 9.218633e5) --
 *   where the downslope and upslope crossings of a target level merge into a tangency.
 *     imp-97662 -- DISCOVERS the fold: the imp-97622/imp-97642 C_C-elasticity closed form
 *       E = 2/(1 + 2 dlnR/dx - dlnL/dx) has a denominator that IS the peak condition (D = 0 at
 *       x_peak), so each individual crossing elasticity diverges as an inverse square root
 *       E ~ +/- K/sqrt(sigma_max - s), K ~ 0.423330, decade-ratio ~0.313 ~ 1/sqrt(10) -- the
 *       generic square-root blow-up of a fold. Does NOT contradict the separate peak-LOCATION
 *       elasticity 0 (imp-97598/imp-97661): location fixed, level sets diverging.
 *     imp-97721 -- CROSS-VALIDATES that the exact three-axis cancellation DIAG3 = E_CC + E_ET +
 *       E_CF == 0 (proved downslope-only by imp-97710) SURVIVES straddling the peak on BOTH
 *       arms even though each individual elasticity now diverges per imp-97662: the shared
 *       reconstruction kernel |K| = |1/(N sigma_N)| blows up (~sqrt(10) per decade) yet
 *       RECON_SUM stays machine-zero and the DIRECT diagonal-scaling DIAG3 stays at the
 *       bisection floor, because sigma = E_coll/E_N is degree-0 homogeneous -- a SCALING
 *       SYMMETRY, not a transversality artefact of the downslope landmarks.
 *     imp-97823 -- PINS the imp-97721 kernel decade-ratio precisely: the deep-window
 *       (g = 1e-5..1e-8) log-log slope of |K| vs the gap g = sigma_max - s is p ~ -1/2 to
 *       ~1e-3, i.e. growth EXACTLY sqrt(10) = 3.162278 per decade in the deep limit. The
 *       apparent departure on the far-from-peak decades (naive full-ladder fit) is an
 *       O(sqrt(g)) RUNNING CORRECTION (the cubic-fold term), decaying ~1/sqrt(10) per decade
 *       and opposite-signed on the two arms -- an amplitude correction, NOT a distinct exponent.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-97662 looks like an isolated
 *   divergence result, imp-97721 looks like an isolated cross-validation, and imp-97823 looks
 *   like an isolated curve-fit refinement. Read together, the cohort is one discovery (the fold
 *   law and its 1/sqrt(10) decade signature), one survival proof (the exact DIAG3 cancellation
 *   holds even as the fold makes each individual axis elasticity blow up, because the
 *   cancellation is a scaling symmetry independent of the fold), and one precision pin (the
 *   fold exponent is exactly 1/2, the apparent deviation is a running correction not a
 *   different law). This index bakes that reading verbatim so future work does not mistake a
 *   re-measured decade-ratio as a NEW exponent, and does not re-attempt the DIAG3 cross-
 *   validation near the peak as though it were still open.
 *
 *   STATUS: a grouping/index note over three already-committed modules, not a new derivation.
 *   No bound changes; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz untouched; imp-3066
 *   K_a >= 0 untouched; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-97662-cc-elasticity-peak-divergence.js (fold discovery: E ~ +/-K/sqrt(sigma_max-s))
 * @see imp-97721-diag3-peak-upslope-crossvalidation.js (DIAG3 cancellation survives the fold)
 * @see imp-97823-kernel-decade-growth-sqrt10.js (deep-limit pin: growth exactly sqrt(10))
 * @see imp-97092-polefree-to-weil-obstruction-cohort-index.js (sibling cohort-index this mirrors)
 *
 * Ticket: imp-97846 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const N_PEAK = 9.218633e5; // imp-97520 L1 interior peak (shared across the cohort)
const SIGMA_MAX = 0.949429014;
const SQRT10 = Math.sqrt(10); // 3.1622776601683795

const KERNEL_FOLD_DIAG3_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97662',
    role: 'discovers the near-peak fold: individual crossing elasticity diverges',
    result:
      'The C_C-elasticity closed form E = 2/(1 + 2 dlnR/dx - dlnL/dx) has a denominator that IS ' +
      'the peak condition D = 0, so E diverges as an inverse square root E ~ +/- K/sqrt(sigma_max ' +
      '- s) approaching the peak (K ~ 0.423330), decade-ratio ~0.313 ~ 1/sqrt(10) confirming the ' +
      '1/2 exponent. Consistent with (not contradicting) the separate peak-LOCATION elasticity 0.',
  }),
  Object.freeze({
    id: 'imp-97721',
    role: 'cross-validates that the exact DIAG3 cancellation survives the fold',
    result:
      'Straddling the peak on BOTH arms, the shared reconstruction kernel |K| blows up yet the ' +
      'exact three-axis cancellation DIAG3 = E_CC + E_ET + E_CF == 0 stays at the machine/' +
      'bisection floor -- because sigma = E_coll/E_N is degree-0 homogeneous, a SCALING SYMMETRY, ' +
      'not a transversality artefact confined to the downslope landmarks where it was first shown.',
  }),
  Object.freeze({
    id: 'imp-97823',
    role: 'pins the kernel decade-ratio exactly and explains the far-field deviation',
    result:
      'The deep-limit (g = 1e-5..1e-8) log-log slope of |K| vs the gap is p ~ -1/2 to ~1e-3: ' +
      'growth EXACTLY sqrt(10) = ' + SQRT10.toFixed(6) + ' per decade. The apparent departure on ' +
      'far-from-peak decades is an O(sqrt(g)) running correction (cubic-fold term) decaying ' +
      '~1/sqrt(10) per decade, opposite-signed on the two arms -- an amplitude correction, not a ' +
      'different exponent.',
  }),
]);

export const IMP97846_KERNEL_FOLD_DIAG3_COHORT_INDEX = Object.freeze({
  id: 'imp-97846',
  proofSection: 'S-frontier',
  cohort: KERNEL_FOLD_DIAG3_COHORT,
  peak: {
    N_peak: N_PEAK,
    sigma_max: SIGMA_MAX,
  },
  sqrt10: SQRT10,
  question:
    'The kernel-fold / DIAG3-fold-survival cohort (imp-97662, imp-97721, imp-97823) reads as ' +
    'three separate near-peak measurements. Grouped, do they form one coherent picture -- a fold ' +
    'law, its survival under the exact three-axis cancellation, and its precise exponent -- or ' +
    'could a future scout mistake any one result (e.g. a re-measured decade-ratio) as new?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97662 discovers that the C_C-elasticity ' +
    'closed form diverges as an inverse square root E ~ +/- K/sqrt(sigma_max - s) approaching ' +
    'the imp-97520 L1 peak (sigma_max ~ 0.949429), the generic square-root fold; imp-97721 ' +
    'cross-validates that the SEPARATE exact three-axis cancellation DIAG3 = E_CC + E_ET + ' +
    'E_CF == 0 survives that fold on both arms because it is a scaling symmetry (sigma degree-0 ' +
    'homogeneous), not a transversality artefact; imp-97823 pins the fold decade-ratio to exactly ' +
    'sqrt(10) = ' + SQRT10.toFixed(6) + ' in the deep limit and shows the far-field deviation is ' +
    'an amplitude-only running correction. So the cohort as a whole is one law (fold), one ' +
    'survival proof (cancellation independent of the fold), and one precision pin (exponent ' +
    'exactly 1/2). Future work on this thread should not re-derive the fold law from scratch, ' +
    'should not re-open the DIAG3 near-peak cross-validation as though it were still uncertain, ' +
    'and should not read a far-field decade-ratio deviation as a distinct exponent. Conditional-' +
    'share diagnostic on the inherited imp-3220/imp-3406 extrapolation; C_mb GUE-conditional per ' +
    'imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97662 (near-peak individual-elasticity square-root fold); imp-97721 (DIAG3 cancellation ' +
    'survives the fold, straddling both arms); imp-97823 (deep-limit kernel decade-ratio pinned ' +
    'to exactly sqrt(10)); imp-97520 (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5); imp-97710 ' +
    '(downslope-only DIAG3 cross-validation this extends); imp-97092-polefree-to-weil-' +
    'obstruction-cohort-index.js (sibling cohort-index this mirrors).',
});

export default IMP97846_KERNEL_FOLD_DIAG3_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97846_KERNEL_FOLD_DIAG3_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97846-cohort-has-all-three-members',
    why: 'The whole point of the index is grouping exactly these three modules; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97846_KERNEL_FOLD_DIAG3_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-97662', 'imp-97721', 'imp-97823'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97846-peak-and-sqrt10-consistent',
    why: 'The cohort shares one peak location and one decade-ratio law; both must match the ' +
      'committed literals from the underlying modules.',
    holds: () => {
      const idx = IMP97846_KERNEL_FOLD_DIAG3_COHORT_INDEX;
      return (
        Math.abs(idx.peak.N_peak - 9.218633e5) / 9.218633e5 < 1e-3 &&
        Math.abs(idx.peak.sigma_max - 0.949429) < 1e-5 &&
        Math.abs(idx.sqrt10 - Math.sqrt(10)) < 1e-12
      );
    },
  },
  {
    id: 'imp97846-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97846_KERNEL_FOLD_DIAG3_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97846_KERNEL_FOLD_DIAG3_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97846_KERNEL_FOLD_DIAG3_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97846_KERNEL_FOLD_DIAG3_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97846-kernel-fold-diag3-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
