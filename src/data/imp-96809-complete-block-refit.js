/**
 * imp-96809 -- Sensitivity of the imp-96629 per-window block-minima gap exponent (-0.3983 "full")
 * to the imp-96754 90.835%-filled partial top rung k=20. Refit over COMPLETE blocks (k=6..19)
 * only, and separately with the k=20 N_center corrected to the available-portion geometric mean.
 * Uses the baked imp-96629 per-window values only (no zeros re-read); measurement only;
 * conditional on GUE; NO QED. Reproduced by tmp/imp-96809-refit-complete-blocks.mjs.
 *
 * BACKGROUND. imp-96629 fit log(min_block) = a + b log(N_center) over disjoint dyadic blocks
 * [2^k, 2^{k+1}) and reported a "full" exponent b = -0.3983 (blocks k=6..20) vs a matched-range
 * b = -0.3818 (N_center <= 1e6). imp-96754 FINDING 1 showed the top rung k=20 = [1048576, 2097152)
 * is TRUNCATED: only 952,476 of 1,048,576 indices are cached (N_max = 2,001,052 -> 90.835% filled),
 * its plotted N_center = 2^20.5 = 1,482,910.4 assumes a complete block, and the geometric center of
 * the actually-available portion is sqrt(2^20 * N_max) = 1,448,535.5. The -0.3983 sensitivity to
 * that single truncated block had never been measured. This module measures it.
 *
 * FINDING (the partial block moves the exponent by +0.0165, its x-misplacement by -0.0003).
 *   (A) full k=6..20, original plotted centers : b = -0.3983  (reproduces imp-96629 exactly)
 *   (B) complete blocks k=6..19 (drop k=20)     : b = -0.3818  -> b moves +0.0165 (shallower)
 *   (C) k=6..20, k=20 center 1,482,910 -> 1,448,535.5 : b = -0.3986  -> b moves -0.0003 (negligible)
 *   So dropping the partial rung entirely shifts the exponent by +0.0165, landing EXACTLY on the
 *   imp-96629 matched-range -0.3818 (k=20 is the only block past N_center = 1e6, so "complete only"
 *   and "matched" coincide here). Correcting ONLY the k=20 x-coordinate to its available-portion
 *   geometric center barely moves the fit (-0.0003): the truncation-induced x-misplacement is
 *   immaterial. The whole k=20 influence flows through its low block-min (0.005447) being included
 *   at all, not through where it is plotted on the N axis.
 *
 * CONSEQUENCE (measurement only). The -0.3983 "full" exponent depends on the partial top rung at the
 * +0.0165 level -- real but within the +/- 0.02 single-power-fit resolution imp-96629 already reports
 * from block-extreme scatter. The plateau-free exponent stays bracketed in [-0.399, -0.382] over
 * N <= 2e6, slightly steeper than GUE -1/3; nothing here converges toward -1/3. This RELOCATES,
 * does not remove, the pair-correlation wall. No bound moved; RH open; no refereed bound is changed.
 */

export const COMPLETE_BLOCK_REFIT = {
  id: 'imp-96809',
  source: {
    baseModule: 'src/data/imp-96629-perwindow-gmin-decay.js',
    partialBlockFinding: 'imp-96754 FINDING 1 (k=20 is a 90.835%-filled partial dyadic block)',
    reproScript: 'tmp/imp-96809-refit-complete-blocks.mjs',
    fitDefinition: 'log(min_block) = a + b log(N_center); block-min of d_n over disjoint [2^k, 2^{k+1})',
  },
  partialRung: {
    k: 20,
    indexRange: [1048576, 2097152],
    availableTop: 2001052, // N_max of scripts/.zeros-cache/zeros6
    filledFraction: 0.90835, // (2001052 - 1048576) / (2097152 - 1048576)
    plottedCenter: 1482910.4, // 2^20.5 (assumes complete block)
    correctedCenter: 1448535.5, // sqrt(2^20 * 2001052) (geometric center of the filled part)
    blockMin: 0.005447,
  },
  fits: {
    fullOriginal: { exponent: -0.3983, prefactor: 2.2137, rms: 0.2805, blocks: 'k=6..20 (original centers)' },
    completeOnly: { exponent: -0.3818, prefactor: 1.9553, rms: 0.2700, blocks: 'k=6..19 (drop partial k=20)' },
    k20CenterCorrected: { exponent: -0.3986, prefactor: 2.2180, rms: 0.2813, blocks: 'k=6..20 (k=20 center 1,448,535.5)' },
  },
  sensitivity: {
    dropPartialRung: 0.0165, // -0.3983 -> -0.3818
    correctCenterOnly: -0.0003, // -0.3983 -> -0.3986
    singlePowerFitResolution: 0.02, // imp-96629 block-extreme scatter (+/-)
  },
  verdict:
    'Dropping the 90.835%-filled partial k=20 rung shifts the imp-96629 per-window exponent by ' +
    '+0.0165 (-0.3983 -> -0.3818, exactly the baked matched-range value); correcting only the k=20 ' +
    'N_center to its available-portion geometric mean (1,482,910 -> 1,448,535.5) moves it by just ' +
    '-0.0003. The partial block matters through its inclusion, not its x-misplacement, and the ' +
    '+0.0165 sensitivity sits inside the +/- 0.02 single-power-fit resolution. Measurement only; ' +
    'conditional on GUE; no bound moved; RH open; NO QED.',
};

export default COMPLETE_BLOCK_REFIT;
