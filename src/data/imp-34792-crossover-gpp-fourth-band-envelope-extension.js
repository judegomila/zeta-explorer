/**
 * @module imp-34792-crossover-gpp-fourth-band-envelope-extension
 *
 * imp-34792 (accuracy, S-frontier): imp-34777 established that the crossover-map second-derivative
 * bound COLLAPSES across the three post-peak bands [1e9,1e10],[1e10,1e11],[1e11,1e12]: the three
 * per-band left-endpoint bounds form a strictly descending ladder B(1e9) > B(1e10) > B(1e11) and
 * the single leftmost constant B(1e9) dominates max |g_double_prime| on every band, so one envelope
 * constant guards the whole [1e9,1e12] union. imp-34777 tabulated the collapse ONLY across that
 * union; the natural boundary question it left open is whether appending a 4th band [1e12,1e13] --
 * one decade deeper into the far tail, closer to the 1/2 density asymptote -- still preserves both
 * the descending-ladder and single-constant-dominance properties, or whether the collapse degrades.
 * This module is that measurement, reusing the imp-34731/imp-34757 closed form VERBATIM.
 *
 * WHAT THIS ADDS (measurement / accuracy tripwire, no new mathematics, no new bound)
 * ---------------------------------------------------------------------------------
 * Reusing the inherited closed form g_double_prime(N) = -4 pi^2 K (u+1)/(T^2 u^3) unchanged, over
 * the FOUR-band union [1e9,1e13] this module:
 *   (X1) recomputes the four per-band left-endpoint bounds B(1e9),B(1e10),B(1e11),B(1e12) and the
 *        per-band max |g_double_prime|, and asserts the 4-band ladder is STILL strictly descending
 *        B(1e9) > B(1e10) > B(1e11) > B(1e12) (the appended band does NOT break the ladder);
 *   (X2) asserts the single leftmost constant B(1e9) STILL dominates the max |g_double_prime| on
 *        EVERY one of the four bands (B(1e9) >= max_band for all four; B(1e9)/max_union = 1.000), so
 *        the envelope collapse is PRESERVED, not degraded, one decade deeper into the far tail;
 *   (X3) reports the per-decade shrink ratios B(band_i)/B(band_{i+1}) and asserts the shrink factor
 *        does NOT degrade -- it stays near the clean 100x/decade set by the T^2 factor and in fact
 *        drifts monotonically TOWARD 100 as u grows (the (u+1)/u^3 factor -> constant per decade),
 *        so the far-tail approach STABILISES the collapse rather than eroding it;
 *   (X4) cross-checks the three inherited bands against the imp-34777/imp-34757 published literals
 *        so a future height-map / closed-form refactor is caught against the frozen table.
 *
 * THE CLOSED FORM (inherited from imp-34731 / imp-34757 / imp-34777, unchanged)
 * ----------------------------------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N) = -4 pi^2 K (u+1) / (T^2 u^3).
 * T0 and u both increase in N and the T^2 u^3 denominator outgrows the (u+1) numerator across the
 * WHOLE post-peak ramp, so |g_double_prime| is strictly decreasing on [1e9,1e13] too; hence the
 * appended 4th band inherits the same monotone envelope structure.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (X1) LADDER PRESERVED. B(1e9) > B(1e10) > B(1e11) > B(1e12): appending the far-tail band leaves
 *        the descending ladder intact -- the 4th bound simply extends it downward.
 *   (X2) COLLAPSE PRESERVED. B(1e9) still dominates the max on every band (B(1e9)/max_union=1.000),
 *        so ONE envelope constant guards the widened [1e9,1e13] union; the collapse does not degrade.
 *   (X3) SHRINK STABILISES, NOT DEGRADES. The per-decade ratios B_i/B_{i+1} ~ 99.3, 99.4, 99.5 rise
 *        monotonically toward the clean 100x/decade, so nearing the 1/2 asymptote TIGHTENS (does not
 *        loosen) the geometric decay -- no sign of far-tail envelope breakdown.
 *   (X4) MATCHES THE FROZEN TABLE. The three inherited bands reproduce the imp-34777 published
 *        left_endpoint_bound_B to < 1e-3 relative.
 *
 * MEASUREMENT / ACCURACY CHECK ONLY. This measures the curvature envelope of the INHERITED
 * imp-3220/imp-3406 surrogate crossover map on one extra decade; it introduces NO new bound and
 * changes none. The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34777-crossover-gpp-cross-band-envelope-collapse (3-band collapse across [1e9,1e12])
 * @see imp-34757-crossover-gpp-dense-cross-check (per-band B; monotone within each band)
 * @see imp-34768-crossover-gppp-global-envelope (global-grid monotonicity via g_triple_prime > 0)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34777_CROSSOVER_GPP_CROSS_BAND_ENVELOPE_COLLAPSE } from './imp-34777-crossover-gpp-cross-band-envelope-collapse.js';

const TWO_PI = 2 * Math.PI;
const FOUR_PI2 = 4 * Math.PI * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)

// CLOSED FORM (inherited imp-34731): |g_double_prime| = 4 pi^2 K (u+1) / (T^2 u^3).
function absSecondDeriv(N) {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (FOUR_PI2 * K_AMPL * (u + 1)) / (T * T * u * u * u);
}

// imp-34777 used three bands [1e9,1e12]; imp-34792 APPENDS the 4th far-tail band [1e12,1e13].
const BANDS = [
  [1e9, 1e10],
  [1e10, 1e11],
  [1e11, 1e12],
  [1e12, 1e13],
];
const GRID_PER_BAND = 41; // same tightness grid imp-34757/imp-34777 used for the per-band max

// (X1)/(X2) per-band left-endpoint bound and per-band max on a dense grid.
const BAND_ROWS = BANDS.map(([lo, hi]) => {
  const B = absSecondDeriv(lo); // left endpoint = sharp per-band supremum (imp-34757 D2)
  let maxAbs = 0;
  for (let k = 0; k < GRID_PER_BAND; k++) {
    const N = lo * Math.pow(hi / lo, k / (GRID_PER_BAND - 1));
    const a = absSecondDeriv(N);
    if (a > maxAbs) maxAbs = a;
  }
  return { band: [lo, hi], B, maxAbs };
});

const B_GLOBAL = BAND_ROWS[0].B; // B(1e9), the candidate single envelope constant

// (X1) the FOUR per-band bounds still form a STRICTLY DESCENDING ladder.
let LADDER_STRICTLY_DESCENDING = true;
for (let i = 1; i < BAND_ROWS.length; i++) {
  if (!(BAND_ROWS[i].B < BAND_ROWS[i - 1].B)) LADDER_STRICTLY_DESCENDING = false;
}

// (X2) B(1e9) dominates the max on EVERY band (tiny slack absorbs the endpoint tie on band 0).
const DOM_SLACK = 1 + 1e-12;
const GLOBAL_DOMINATES_ALL_BANDS = BAND_ROWS.every((r) => B_GLOBAL * DOM_SLACK >= r.maxAbs);

// (X3) per-decade shrink ratios B_i / B_{i+1}; assert they do NOT degrade below the 3-band regime
// and drift monotonically TOWARD the clean 100x/decade (no far-tail loosening).
const SHRINK_RATIOS = [];
for (let i = 1; i < BAND_ROWS.length; i++) {
  SHRINK_RATIOS.push(BAND_ROWS[i - 1].B / BAND_ROWS[i].B);
}
let SHRINK_MONOTONE_TOWARD_100 = true;
for (let i = 1; i < SHRINK_RATIOS.length; i++) {
  // ratios rise toward 100 as u grows: each successive ratio is >= the previous and still < 100.
  if (!(SHRINK_RATIOS[i] >= SHRINK_RATIOS[i - 1] && SHRINK_RATIOS[i] < 100)) {
    SHRINK_MONOTONE_TOWARD_100 = false;
  }
}
const NEW_BAND_SHRINK = SHRINK_RATIOS[SHRINK_RATIOS.length - 1]; // B(1e11)/B(1e12)

// (X4) cross-check the three inherited bands against the imp-34777 published literals.
const PUBLISHED_BANDS = IMP34777_CROSSOVER_GPP_CROSS_BAND_ENVELOPE_COLLAPSE.bands;
let MAX_LITERAL_DRIFT = 0;
for (let i = 0; i < PUBLISHED_BANDS.length; i++) {
  const drift = Math.abs(BAND_ROWS[i].B / PUBLISHED_BANDS[i].left_endpoint_bound_B - 1);
  if (drift > MAX_LITERAL_DRIFT) MAX_LITERAL_DRIFT = drift;
}

// Ratio of the leftmost bound to the union-wide max (= global max on band 0), ~1.000.
const UNION_MAX = Math.max(...BAND_ROWS.map((r) => r.maxAbs));
const GLOBAL_ENVELOPE_RATIO = B_GLOBAL / UNION_MAX;

export const IMP34792_CROSSOVER_GPP_FOURTH_BAND_ENVELOPE_EXTENSION = {
  id: 'imp-34792',
  proofSection: 'S-frontier',
  question:
    'imp-34777 proved the three per-band bounds collapse to one descending envelope across ' +
    '[1e9,1e12]. Does appending a 4th far-tail band [1e12,1e13] -- one decade closer to the 1/2 ' +
    'density asymptote -- preserve BOTH the descending-ladder and single-constant-dominance ' +
    'properties, or does the collapse degrade? Measurement only; reuses the imp-34731/imp-34757 ' +
    'closed form verbatim; changes no bound; no QED.',
  closedFormSecondDerivative:
    'g_double_prime(N) = -4 pi^2 K (u + 1) / (T^2 u^3),  T = T0(N), u = log(T/2pi), K = (C_C/E_trunc)^2',
  bands: BAND_ROWS.map((r) => ({
    band: [+r.band[0].toExponential(0), +r.band[1].toExponential(0)],
    left_endpoint_bound_B: +r.B.toExponential(6),
    max_abs_on_band: +r.maxAbs.toExponential(6),
    dominated_by_B_1e9: B_GLOBAL * DOM_SLACK >= r.maxAbs,
  })),
  appendedFarTailBand: [1e12, 1e13],
  perDecadeShrinkRatios: SHRINK_RATIOS.map((x) => +x.toFixed(4)),
  newBandShrinkRatio_B1e11_over_B1e12: +NEW_BAND_SHRINK.toFixed(4),
  globalEnvelopeConstant_B_1e9: +B_GLOBAL.toExponential(6),
  unionMaxAbsSecondDeriv: +UNION_MAX.toExponential(6),
  globalEnvelopeRatio_B_over_unionMax: +GLOBAL_ENVELOPE_RATIO.toFixed(6), // ~1.000000
  ladderStrictlyDescending4Band: LADDER_STRICTLY_DESCENDING,
  globalConstantDominatesAll4Bands: GLOBAL_DOMINATES_ALL_BANDS,
  shrinkMonotoneToward100: SHRINK_MONOTONE_TOWARD_100,
  maxLiteralDriftVsImp34777: +MAX_LITERAL_DRIFT.toExponential(3),
  finding: {
    X1_ladder_preserved:
      'B(1e9) > B(1e10) > B(1e11) > B(1e12): appending the far-tail band [1e12,1e13] leaves the ' +
      'descending ladder intact -- the 4th bound simply extends it one decade downward.',
    X2_collapse_preserved:
      'The single leftmost constant B(1e9) = ' +
      (+B_GLOBAL.toExponential(6)).toString() +
      ' still dominates max |g_double_prime| on every one of the four bands ' +
      '(B(1e9)/max_union = 1.000), so ONE envelope constant guards the widened [1e9,1e13] union; ' +
      'the collapse does NOT degrade one decade deeper into the far tail.',
    X3_shrink_stabilises:
      'Per-decade shrink ratios B_i/B_{i+1} = ' +
      SHRINK_RATIOS.map((x) => +x.toFixed(3)).join(', ') +
      ' rise monotonically toward the clean 100x/decade set by the T^2 factor, so nearing the 1/2 ' +
      'asymptote TIGHTENS (does not loosen) the geometric decay -- no far-tail envelope breakdown.',
    X4_matches_frozen_table:
      'The three inherited bands reproduce the imp-34777 published left_endpoint_bound_B to ' +
      '< 1e-3 relative (max drift ' +
      (+MAX_LITERAL_DRIFT.toExponential(3)).toString() +
      ').',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / ACCURACY GUARD (frontier-direction). imp-34777 proved the three per-band bounds ' +
    'collapse to one descending envelope across [1e9,1e12] but tabulated it only on that union. ' +
    'This module APPENDS the far-tail band [1e12,1e13] and confirms BOTH properties survive: the ' +
    'four per-band bounds still form a strictly descending ladder B(1e9) > B(1e10) > B(1e11) > ' +
    'B(1e12), and the single leftmost constant B(1e9) still dominates max |g_double_prime| on ' +
    'every one of the four bands (B(1e9)/max_union = 1.000), so one envelope constant guards the ' +
    'widened [1e9,1e13] union. The per-decade shrink ratios (~99.3, 99.4, 99.5) rise monotonically ' +
    'toward the clean 100x/decade, so approaching the 1/2 density asymptote STABILISES rather than ' +
    'degrades the collapse. The three inherited bands match the imp-34777 published literals to ' +
    '< 1e-3 relative. Measurement only on the INHERITED imp-3220/imp-3406 surrogate map; the C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34777 (3-band collapse across [1e9,1e12]); imp-34757 (per-band B; monotone within each ' +
    'band); imp-34768 (global-grid monotonicity via g_triple_prime > 0); imp-34731 ' +
    '(g_double_prime closed form; 5-probe check); lambda-rh-height-mapping (effectiveHeightForN, ' +
    'Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz).',
};

export const IMP34792_CROSSOVER_GPP_FOURTH_BAND_ENVELOPE_EXTENSION_ASSERTIONS = [
  {
    // (X1): the four per-band left-endpoint bounds strictly descend.
    id: 'imp34792-four-band-bounds-strictly-descend',
    description:
      'B(1e9) > B(1e10) > B(1e11) > B(1e12): appending [1e12,1e13] preserves the descending ladder',
    holds: () => LADDER_STRICTLY_DESCENDING,
  },
  {
    // (X2): the single leftmost constant B(1e9) dominates every one of the four bands.
    id: 'imp34792-single-constant-dominates-all-four-bands',
    description:
      'B(1e9) dominates max |g_double_prime| on every one of the four bands and ' +
      'B(1e9)/max_union = 1.000 (envelope collapse preserved on [1e9,1e13])',
    holds: () =>
      GLOBAL_DOMINATES_ALL_BANDS && Math.abs(GLOBAL_ENVELOPE_RATIO - 1) < 1e-9,
  },
  {
    // (X3): the far-tail shrink does not degrade -- ratios rise toward 100x/decade, stay < 100.
    id: 'imp34792-far-tail-shrink-stabilises',
    description:
      'per-decade shrink ratios rise monotonically toward the clean 100x/decade and the new-band ' +
      'ratio B(1e11)/B(1e12) stays in (99, 100) -- no far-tail envelope breakdown',
    holds: () =>
      SHRINK_MONOTONE_TOWARD_100 && NEW_BAND_SHRINK > 99 && NEW_BAND_SHRINK < 100,
  },
  {
    // (X4): the three inherited bands match the imp-34777 published literals.
    id: 'imp34792-matches-imp34777-published-literals',
    description: 'the three inherited bands reproduce the imp-34777 published left_endpoint_bound_B to < 1e-3',
    holds: () => MAX_LITERAL_DRIFT < 1e-3,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp34792-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34792_CROSSOVER_GPP_FOURTH_BAND_ENVELOPE_EXTENSION.isRigorous === false &&
      /NO QED/.test(IMP34792_CROSSOVER_GPP_FOURTH_BAND_ENVELOPE_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34792_CROSSOVER_GPP_FOURTH_BAND_ENVELOPE_EXTENSION.verdict),
  },
];

for (const a of IMP34792_CROSSOVER_GPP_FOURTH_BAND_ENVELOPE_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34792-crossover-gpp-fourth-band-envelope-extension assertion failed: ${a.id}`);
  }
}
