/**
 * @module data/imp-96447-ecoll-cselberg-admissible-band
 * @fileoverview imp-96447 -- bound the ABSOLUTE E_coll(0.125, 1e22) magnitude
 *   uncertainty band induced by the ACTUAL admissible C_Selberg placeholder
 *   range, distinct from the arbitrary 0.1x..100x C_KH sweep of imp-96429.
 *
 *   imp-96429 showed the count-model-independence verdict is EXACTLY
 *   C_KH-invariant (C_KH cancels as a common sqrt-prefactor in the relative
 *   gap) and that only the absolute E_coll magnitude moves, as sqrt(C_KH). It
 *   measured that magnitude dependence over an ARBITRARY 3-decade C_KH sweep
 *   (0.1x..100x baseline) that spans and exceeds the range the underlying
 *   C_Selberg placeholder actually admits. This module replaces that wide,
 *   arbitrary sweep with the NARROW admissible band the imp-2641 Trudgian
 *   source really permits.
 *
 *   ADMISSIBLE C_Selberg RANGE (imp-2641 Trudgian 2014, J. Number Theory 134,
 *   Thm 1: |S(T)| <= 0.112 log T + 0.278 log log T + 2.510 for T >= e). Read as
 *   a coefficient on log T (the form C_KH consumes), imp-2641 brackets three
 *   honest readings plus the historical placeholder:
 *     (a) POINT at the top height  : 0.4519  -- NOT a valid uniform bound
 *         (the ratio Trudgian(T)/log T decreases in T, so a point value at the
 *         top under-bounds every lower T), reported for context only.
 *     (b) UNIFORM over actual zeros: 1.1619  -- tightest VALID uniform bound
 *         (sup at the first zero gamma_1 = 14.13).
 *     (c) UNIFORM over T >= e       : 2.622   -- rigorous unconditional headline,
 *         the baseline C_Selberg fed into C_KH = pi * 2.622.
 *     placeholder                   : 3.0     -- conservative historical ceiling
 *         (imp-341 / imp-366), verified an over-estimate by imp-2641.
 *   The admissible band for a VALID C_Selberg is therefore [1.1619, 3.0]:
 *   from the tightest valid uniform bound up to the conservative placeholder,
 *   with the rigorous headline 2.622 sitting inside it.
 *
 *   MAP THROUGH C_KH AND THE sqrt SCALING. E_coll(0.125, 1e22) scales as the
 *   fixed factor sqrt(C_KH) = sqrt(pi * C_Selberg) (imp-96429). Anchoring on the
 *   baseline C_Selberg = 2.622 gives
 *       E_coll(C_Selberg) = E_coll_baseline * sqrt(C_Selberg / 2.622).
 *   With E_coll_baseline(0.125, 1e22) = 2.502828e-11 (imp-96429), the admissible
 *   band is
 *       E_coll in [1.666092e-11, 2.677165e-11]   (span factor 1.6069),
 *   versus the imp-96429 arbitrary 0.1x..100x C_KH sweep span of 31.62x. The
 *   admissible band is ~19.7x tighter than the arbitrary sweep: the true
 *   C_Selberg uncertainty moves the absolute E_coll magnitude by at most ~60%,
 *   not by the 30x the wide sweep suggests.
 *
 *   MEASUREMENT / ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves
 *   no constant. C_H stays UNPROVEN (imp-2642 / imp-2701); the conditional
 *   C_H <= 0.127 is not reclassified; imp-2640 Gronwall discharge of C_Lip stays
 *   NEGATIVE; the Erdos-Turan bridge constant (imp-2641 residual) stays open.
 *   No refereed bound is changed. RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-2641-c-selberg-trudgian-discharge.js: the three Trudgian readings
 *     (0.4519, 1.1619, 2.622) and the placeholder 3.0.
 *   - imp-96429-ecoll-ckh-sensitivity.js: the sqrt(C_KH) magnitude scale law and
 *     the baseline E_coll(0.125, 1e22) = 2.502828e-11; Odlyzko 10^22-nd true
 *     height reused verbatim.
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: rate factor
 *     R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622.
 *
 * Syntax note: this header avoids the close-comment terminator sequence inside
 *   prose and uses brace notation dg_{k*}/dt for derivative-like expressions.
 */

// Baseline Koksma-Hlawka coefficient C_Selberg = 2.622 (imp-2641 Trudgian),
// the value fed into C_KH = pi * C_Selberg in imp-96429 / imp-96311.
const C_SELBERG_BASELINE = 2.622;

// Admissible C_Selberg readings from imp-2641 (coefficient on log T).
const C_SELBERG_POINT_AT_TOP = 0.4519;      // (a) NOT a valid uniform bound
const C_SELBERG_UNIFORM_ZEROS = 1.1619;     // (b) tightest valid uniform bound
const C_SELBERG_UNIFORM_TGEQE = 2.622;      // (c) rigorous unconditional headline
const C_SELBERG_PLACEHOLDER = 3.0;          // conservative historical ceiling

// Baseline absolute magnitude E_coll(0.125, 1e22) = 2.502828e-11 (imp-96429),
// reconstructed here from the same inputs so the module is self-contained.
const CH_A = 0.125;
const GAMMA_TRUE_1E22 = 1370919909931995308226.68016; // Odlyzko (2001) 10^22-nd zero.
const N_ANCHOR = 1e22;
const C_KH_BASELINE = Math.PI * C_SELBERG_BASELINE; // = 8.237256...

function rate(C_KH, gamma, N) {
  return Math.sqrt(C_KH) * Math.sqrt(Math.log(gamma) / N);
}

const E_COLL_BASELINE = CH_A * rate(C_KH_BASELINE, GAMMA_TRUE_1E22, N_ANCHOR);

// E_coll scales as sqrt(C_KH) = sqrt(pi * C_Selberg) (imp-96429), so anchoring
// on the baseline C_Selberg = 2.622 gives the fixed sqrt(C_Selberg/baseline) law.
function eCollForCSelberg(cSel) {
  return E_COLL_BASELINE * Math.sqrt(cSel / C_SELBERG_BASELINE);
}

const READINGS = [
  { key: 'pointAtTop', cSelberg: C_SELBERG_POINT_AT_TOP, validUniformBound: false },
  { key: 'uniformOverZeros', cSelberg: C_SELBERG_UNIFORM_ZEROS, validUniformBound: true },
  { key: 'uniformOverTgeqE', cSelberg: C_SELBERG_UNIFORM_TGEQE, validUniformBound: true },
  { key: 'placeholder', cSelberg: C_SELBERG_PLACEHOLDER, validUniformBound: true },
].map((r) => ({
  ...r,
  sqrtFactorVsBaseline: Math.sqrt(r.cSelberg / C_SELBERG_BASELINE),
  eColl: eCollForCSelberg(r.cSelberg),
}));

// Admissible band for a VALID C_Selberg: [tightest valid uniform bound, ceiling].
const BAND_LO = eCollForCSelberg(C_SELBERG_UNIFORM_ZEROS);
const BAND_HI = eCollForCSelberg(C_SELBERG_PLACEHOLDER);
const BAND_SPAN_FACTOR = BAND_HI / BAND_LO;

// The arbitrary imp-96429 sweep spanned 0.1x..100x C_KH, i.e. sqrt(100/0.1) in E_coll.
const WIDE_SWEEP_SPAN_FACTOR = Math.sqrt(100 / 0.1); // = 31.6228...
const NARROWING_VS_WIDE_SWEEP = WIDE_SWEEP_SPAN_FACTOR / BAND_SPAN_FACTOR;

export const IMP96447_ECOLL_CSELBERG_ADMISSIBLE_BAND = {
  id: 'imp-96447',
  title:
    'Absolute E_coll(0.125, 1e22) magnitude band from the ACTUAL admissible ' +
    'C_Selberg range [1.1619, 3.0] (imp-2641 Trudgian), not the arbitrary ' +
    '0.1x..100x C_KH sweep of imp-96429',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  C_Selberg_baseline: C_SELBERG_BASELINE,
  C_KH_baseline: C_KH_BASELINE,
  eCollBaseline: E_COLL_BASELINE,
  readings: READINGS,
  admissibleBand: {
    cSelbergRange: [C_SELBERG_UNIFORM_ZEROS, C_SELBERG_PLACEHOLDER],
    eCollLo: BAND_LO,
    eCollHi: BAND_HI,
    spanFactor: BAND_SPAN_FACTOR,
    rigorousHeadlineInside: E_COLL_BASELINE >= BAND_LO && E_COLL_BASELINE <= BAND_HI,
  },
  wideSweepComparison: {
    imp96429SweepSpanFactor: WIDE_SWEEP_SPAN_FACTOR,
    narrowingFactor: NARROWING_VS_WIDE_SWEEP,
  },
  measurement: {
    admissibleRange:
      'The imp-2641 Trudgian source admits three honest coefficient readings on ' +
      'log T -- point-at-top 0.4519 (NOT a valid uniform bound), uniform-over-' +
      'zeros 1.1619 (tightest valid uniform bound, sup at gamma_1), and uniform-' +
      'over-T>=e 2.622 (rigorous unconditional headline) -- plus the conservative ' +
      'historical placeholder 3.0. The admissible band for a VALID C_Selberg is ' +
      '[1.1619, 3.0], with the rigorous headline 2.622 inside it.',
    scaleLaw:
      'E_coll(0.125, 1e22) scales as sqrt(C_KH) = sqrt(pi * C_Selberg) (imp-96429), ' +
      'so E_coll(C_Selberg) = E_coll_baseline * sqrt(C_Selberg / 2.622) with ' +
      'E_coll_baseline = ' + E_COLL_BASELINE.toExponential(6) + '.',
    band:
      'Mapping the admissible range through the sqrt law gives E_coll in [' +
      BAND_LO.toExponential(6) + ', ' + BAND_HI.toExponential(6) + '] (span factor ' +
      BAND_SPAN_FACTOR.toFixed(4) + '), versus the imp-96429 arbitrary 0.1x..100x ' +
      'C_KH sweep span of ' + WIDE_SWEEP_SPAN_FACTOR.toFixed(4) + 'x. The admissible ' +
      'band is ~' + NARROWING_VS_WIDE_SWEEP.toFixed(1) + 'x tighter: the true ' +
      'C_Selberg uncertainty moves the absolute E_coll magnitude by at most ~' +
      (100 * (BAND_SPAN_FACTOR - 1)).toFixed(0) + '%, not the ~30x the wide sweep suggests.',
  },
  verdict:
    'VERDICT NARROW BAND. The absolute E_coll(0.125, 1e22) magnitude uncertainty ' +
    'induced by the ACTUAL admissible C_Selberg range [1.1619, 3.0] (imp-2641 ' +
    'Trudgian) is E_coll in [' + BAND_LO.toExponential(6) + ', ' +
    BAND_HI.toExponential(6) + '] (span factor ' + BAND_SPAN_FACTOR.toFixed(4) +
    '), ~' + NARROWING_VS_WIDE_SWEEP.toFixed(1) + 'x tighter than the arbitrary ' +
    '0.1x..100x C_KH sweep of imp-96429 (span 31.6228x). The rigorous headline ' +
    'baseline E_coll = ' + E_COLL_BASELINE.toExponential(6) + ' (C_Selberg = 2.622) ' +
    'sits inside the band. Accuracy audit only: no gap closed, no bound changed, ' +
    'conditional C_H <= 0.127 stays UNPROVEN, C_H isRigorousUpperBound = false ' +
    '(imp-2642/imp-2701), imp-2640 Gronwall discharge of C_Lip NEGATIVE, the ' +
    'Erdos-Turan bridge constant (imp-2641 residual) stays open. No refereed bound is changed' +
    '. RH open. NO QED.',
  provenance:
    'imp-2641-c-selberg-trudgian-discharge.js (Trudgian readings 0.4519/1.1619/' +
    '2.622 and placeholder 3.0); imp-96429-ecoll-ckh-sensitivity.js (sqrt(C_KH) ' +
    'magnitude scale law and baseline E_coll(0.125,1e22)); ' +
    'imp-96311-ecoll-rate-ch-independence-tabulation.js (rate factor, C_KH).',
};

export const IMP96447_ECOLL_CSELBERG_ADMISSIBLE_BAND_ASSERTIONS = [
  {
    id: 'imp96447-baseline-ecoll-matches-imp96429',
    holds: () => Math.abs(E_COLL_BASELINE - 2.502828e-11) < 1e-16,
    why:
      'The reconstructed baseline E_coll(0.125, 1e22) must match the imp-96429 ' +
      'baseline value 2.502828e-11 (C_Selberg = 2.622), confirming the module ' +
      'anchors on the same magnitude the sqrt(C_KH) scale law starts from.',
  },
  {
    id: 'imp96447-admissible-band-endpoints',
    holds: () =>
      Math.abs(BAND_LO - 1.666092e-11) < 1e-16 &&
      Math.abs(BAND_HI - 2.677165e-11) < 1e-16,
    why:
      'The admissible band endpoints must be E_coll(1.1619) = 1.666092e-11 (tightest ' +
      'valid uniform bound) and E_coll(3.0) = 2.677165e-11 (conservative placeholder ' +
      'ceiling), the sqrt(C_Selberg/2.622) images of the imp-2641 range.',
  },
  {
    id: 'imp96447-band-far-narrower-than-wide-sweep',
    holds: () =>
      BAND_SPAN_FACTOR < 1.7 &&
      Math.abs(BAND_SPAN_FACTOR - Math.sqrt(3.0 / 1.1619)) < 1e-9 &&
      NARROWING_VS_WIDE_SWEEP > 15,
    why:
      'The admissible band span (sqrt(3.0/1.1619) = 1.6069) must be far narrower ' +
      'than the arbitrary 0.1x..100x C_KH sweep span (31.6228), by more than 15x, ' +
      'making the point that the real C_Selberg uncertainty is ~60% not ~30x.',
  },
  {
    id: 'imp96447-rigorous-headline-inside-band',
    holds: () =>
      E_COLL_BASELINE >= BAND_LO &&
      E_COLL_BASELINE <= BAND_HI &&
      IMP96447_ECOLL_CSELBERG_ADMISSIBLE_BAND.admissibleBand.rigorousHeadlineInside === true,
    why:
      'The rigorous unconditional headline E_coll (C_Selberg = 2.622) must lie inside ' +
      'the admissible band [1.1619, 3.0] image, since 2.622 is between the tightest ' +
      'valid uniform bound and the conservative placeholder.',
  },
  {
    id: 'imp96447-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96447_ECOLL_CSELBERG_ADMISSIBLE_BAND.verdict,
      ) && IMP96447_ECOLL_CSELBERG_ADMISSIBLE_BAND.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure, must ' +
      'not change any bound, and must not reclassify the unproven conditional ' +
      'C_H <= 0.127 as rigorous.',
  },
];

for (const a of IMP96447_ECOLL_CSELBERG_ADMISSIBLE_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96447-ecoll-cselberg-admissible-band assertion failed: ${a.id}`);
  }
}
