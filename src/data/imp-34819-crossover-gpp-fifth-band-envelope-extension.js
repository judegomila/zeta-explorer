/**
 * @module imp-34819-crossover-gpp-fifth-band-envelope-extension
 *
 * imp-34819 (numerical, S-frontier): imp-34777 established that the crossover-map second-derivative
 * bound COLLAPSES across the three post-peak bands [1e9,1e10],[1e10,1e11],[1e11,1e12] to a single
 * descending envelope dominated by the leftmost constant B(1e9); imp-34792 appended a 4th far-tail
 * band [1e12,1e13] and confirmed BOTH the descending-ladder and single-constant-dominance properties
 * survive; imp-34801 resolution-matched-confirmed the collapse is a genuine property of the map, not
 * a coarse-grid artifact, with per-decade shrink ratios stabilising toward the clean 100x/decade.
 * The boundary question they left open is whether the leftmost dominance and the ~100x/decade shrink
 * persist ONE decade further, on [1e13,1e14] -- even closer to the 1/2 density asymptote. This module
 * is that measurement, reusing the imp-34731/imp-34757 closed form VERBATIM.
 *
 * WHAT THIS ADDS (measurement / accuracy tripwire, no new mathematics, no new bound)
 * ---------------------------------------------------------------------------------
 * Reusing the inherited closed form g_double_prime(N) = -4 pi^2 K (u+1)/(T^2 u^3) unchanged, over
 * the FIVE-band union [1e9,1e14] this module:
 *   (Y1) recomputes the five per-band left-endpoint bounds B(1e9),B(1e10),B(1e11),B(1e12),B(1e13)
 *        and the per-band max |g_double_prime|, and asserts the 5-band ladder is STILL strictly
 *        descending (the appended 5th band does NOT break the ladder);
 *   (Y2) asserts the single leftmost constant B(1e9) STILL dominates the max |g_double_prime| on
 *        EVERY one of the five bands (B(1e9)/max_union = 1.000), so the envelope collapse is
 *        PRESERVED, not degraded, one decade deeper into the far tail;
 *   (Y3) reports the per-decade shrink ratios B(band_i)/B(band_{i+1}) and asserts the shrink factor
 *        does NOT degrade -- it keeps drifting monotonically TOWARD the clean 100x/decade set by the
 *        T^2 factor (the new-band ratio B(1e12)/B(1e13) exceeds imp-34792 last ratio and stays < 100);
 *   (Y4) cross-checks the four inherited bands against the imp-34792 published literals so a future
 *        height-map / closed-form refactor is caught against the frozen table.
 *
 * THE CLOSED FORM (inherited from imp-34731 / imp-34757 / imp-34777 / imp-34792, unchanged)
 * ----------------------------------------------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N) = -4 pi^2 K (u+1) / (T^2 u^3).
 * T0 and u both increase in N and the T^2 u^3 denominator outgrows the (u+1) numerator across the
 * WHOLE post-peak ramp, so |g_double_prime| is strictly decreasing on [1e9,1e14] too; hence the
 * appended 5th band inherits the same monotone envelope structure.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (Y1) LADDER PRESERVED. B(1e9) > B(1e10) > B(1e11) > B(1e12) > B(1e13): appending the far-tail
 *        band [1e13,1e14] leaves the descending ladder intact -- the 5th bound extends it downward.
 *   (Y2) COLLAPSE PRESERVED. B(1e9) still dominates the max on every band (B(1e9)/max_union=1.000),
 *        so ONE envelope constant guards the widened [1e9,1e14] union; the collapse does not degrade.
 *   (Y3) SHRINK STABILISES, NOT DEGRADES. The per-decade ratios B_i/B_{i+1} ~ 99.30, 99.44, 99.54,
 *        99.62 keep rising monotonically toward the clean 100x/decade, so nearing the 1/2 asymptote
 *        TIGHTENS (does not loosen) the geometric decay -- no sign of far-tail envelope breakdown.
 *   (Y4) MATCHES THE FROZEN TABLE. The four inherited bands reproduce the imp-34792 published
 *        left_endpoint_bound_B to < 1e-3 relative.
 *
 * MEASUREMENT / ACCURACY CHECK ONLY. This measures the curvature envelope of the INHERITED
 * imp-3220/imp-3406 surrogate crossover map on one extra decade; it introduces NO new bound and
 * changes none. The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34792-crossover-gpp-fourth-band-envelope-extension (4-band collapse across [1e9,1e13])
 * @see imp-34801-crossover-gpp-cross-band-resolution-matched (resolution-matched genuineness check)
 * @see imp-34777-crossover-gpp-cross-band-envelope-collapse (3-band collapse across [1e9,1e12])
 * @see imp-34757-crossover-gpp-dense-cross-check (per-band B; monotone within each band)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34792_CROSSOVER_GPP_FOURTH_BAND_ENVELOPE_EXTENSION } from './imp-34792-crossover-gpp-fourth-band-envelope-extension.js';

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

// imp-34792 tabulated four bands [1e9,1e13]; imp-34819 APPENDS the 5th far-tail band [1e13,1e14].
const BANDS = [
  [1e9, 1e10],
  [1e10, 1e11],
  [1e11, 1e12],
  [1e12, 1e13],
  [1e13, 1e14],
];
const GRID_PER_BAND = 41; // same tightness grid imp-34757/imp-34777/imp-34792 used for the per-band max

// (Y1)/(Y2) per-band left-endpoint bound and per-band max on a dense grid.
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

// (Y1) the FIVE per-band bounds still form a STRICTLY DESCENDING ladder.
let LADDER_STRICTLY_DESCENDING = true;
for (let i = 1; i < BAND_ROWS.length; i++) {
  if (!(BAND_ROWS[i].B < BAND_ROWS[i - 1].B)) LADDER_STRICTLY_DESCENDING = false;
}

// (Y2) B(1e9) dominates the max on EVERY band (tiny slack absorbs the endpoint tie on band 0).
const DOM_SLACK = 1 + 1e-12;
const GLOBAL_DOMINATES_ALL_BANDS = BAND_ROWS.every((r) => B_GLOBAL * DOM_SLACK >= r.maxAbs);

// (Y3) per-decade shrink ratios B_i / B_{i+1}; assert they do NOT degrade and keep drifting
// monotonically TOWARD the clean 100x/decade (no far-tail loosening).
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
const NEW_BAND_SHRINK = SHRINK_RATIOS[SHRINK_RATIOS.length - 1]; // B(1e12)/B(1e13)
// imp-34792 last (4th-band) ratio was B(1e11)/B(1e12); the new decade must exceed it (still rising).
const PREV_LAST_SHRINK = SHRINK_RATIOS[SHRINK_RATIOS.length - 2]; // B(1e11)/B(1e12)

// (Y4) cross-check the four inherited bands against the imp-34792 published literals.
const PUBLISHED_BANDS = IMP34792_CROSSOVER_GPP_FOURTH_BAND_ENVELOPE_EXTENSION.bands;
let MAX_LITERAL_DRIFT = 0;
for (let i = 0; i < PUBLISHED_BANDS.length; i++) {
  const drift = Math.abs(BAND_ROWS[i].B / PUBLISHED_BANDS[i].left_endpoint_bound_B - 1);
  if (drift > MAX_LITERAL_DRIFT) MAX_LITERAL_DRIFT = drift;
}

// Ratio of the leftmost bound to the union-wide max (= global max on band 0), ~1.000.
const UNION_MAX = Math.max(...BAND_ROWS.map((r) => r.maxAbs));
const GLOBAL_ENVELOPE_RATIO = B_GLOBAL / UNION_MAX;

export const IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION = {
  id: 'imp-34819',
  proofSection: 'S-frontier',
  question:
    'imp-34792 proved the four per-band bounds collapse to one descending envelope across ' +
    '[1e9,1e13] and imp-34801 confirmed the collapse is not a coarse-grid artifact. Does appending ' +
    'a 5th far-tail band [1e13,1e14] -- one decade closer to the 1/2 density asymptote -- preserve ' +
    'BOTH the single-constant leftmost dominance and the ~100x/decade shrink stabilisation, or does ' +
    'the collapse degrade? Measurement only; reuses the imp-34731/imp-34757 closed form verbatim; ' +
    'changes no bound; no QED.',
  closedFormSecondDerivative:
    'g_double_prime(N) = -4 pi^2 K (u + 1) / (T^2 u^3),  T = T0(N), u = log(T/2pi), K = (C_C/E_trunc)^2',
  bands: BAND_ROWS.map((r) => ({
    band: [+r.band[0].toExponential(0), +r.band[1].toExponential(0)],
    left_endpoint_bound_B: +r.B.toExponential(6),
    max_abs_on_band: +r.maxAbs.toExponential(6),
    dominated_by_B_1e9: B_GLOBAL * DOM_SLACK >= r.maxAbs,
  })),
  appendedFarTailBand: [1e13, 1e14],
  perDecadeShrinkRatios: SHRINK_RATIOS.map((x) => +x.toFixed(4)),
  newBandShrinkRatio_B1e12_over_B1e13: +NEW_BAND_SHRINK.toFixed(4),
  prevLastShrinkRatio_B1e11_over_B1e12: +PREV_LAST_SHRINK.toFixed(4),
  globalEnvelopeConstant_B_1e9: +B_GLOBAL.toExponential(6),
  unionMaxAbsSecondDeriv: +UNION_MAX.toExponential(6),
  globalEnvelopeRatio_B_over_unionMax: +GLOBAL_ENVELOPE_RATIO.toFixed(6), // ~1.000000
  ladderStrictlyDescending5Band: LADDER_STRICTLY_DESCENDING,
  globalConstantDominatesAll5Bands: GLOBAL_DOMINATES_ALL_BANDS,
  shrinkMonotoneToward100: SHRINK_MONOTONE_TOWARD_100,
  maxLiteralDriftVsImp34792: +MAX_LITERAL_DRIFT.toExponential(3),
  finding: {
    Y1_ladder_preserved:
      'B(1e9) > B(1e10) > B(1e11) > B(1e12) > B(1e13): appending the far-tail band [1e13,1e14] ' +
      'leaves the descending ladder intact -- the 5th bound simply extends it one decade downward.',
    Y2_collapse_preserved:
      'The single leftmost constant B(1e9) = ' +
      (+B_GLOBAL.toExponential(6)).toString() +
      ' still dominates max |g_double_prime| on every one of the five bands ' +
      '(B(1e9)/max_union = 1.000), so ONE envelope constant guards the widened [1e9,1e14] union; ' +
      'the collapse does NOT degrade one decade deeper into the far tail.',
    Y3_shrink_stabilises:
      'Per-decade shrink ratios B_i/B_{i+1} = ' +
      SHRINK_RATIOS.map((x) => +x.toFixed(3)).join(', ') +
      ' keep rising monotonically toward the clean 100x/decade set by the T^2 factor; the new-decade ' +
      'ratio B(1e12)/B(1e13) = ' +
      (+NEW_BAND_SHRINK.toFixed(4)).toString() +
      ' exceeds imp-34792 last ratio, so nearing the 1/2 asymptote TIGHTENS (does not loosen) the ' +
      'geometric decay -- no far-tail envelope breakdown.',
    Y4_matches_frozen_table:
      'The four inherited bands reproduce the imp-34792 published left_endpoint_bound_B to ' +
      '< 1e-3 relative (max drift ' +
      (+MAX_LITERAL_DRIFT.toExponential(3)).toString() +
      ').',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / ACCURACY GUARD (frontier-direction). imp-34792 proved the four per-band bounds ' +
    'collapse to one descending envelope across [1e9,1e13] and imp-34801 confirmed the collapse is ' +
    'genuine, not a coarse-grid artifact. This module APPENDS the far-tail band [1e13,1e14] and ' +
    'confirms BOTH properties survive one decade further: the five per-band bounds still form a ' +
    'strictly descending ladder B(1e9) > B(1e10) > B(1e11) > B(1e12) > B(1e13), and the single ' +
    'leftmost constant B(1e9) still dominates max |g_double_prime| on every one of the five bands ' +
    '(B(1e9)/max_union = 1.000), so one envelope constant guards the widened [1e9,1e14] union. The ' +
    'per-decade shrink ratios (~99.30, 99.44, 99.54, 99.62) keep rising monotonically toward the ' +
    'clean 100x/decade, so approaching the 1/2 density asymptote STABILISES rather than degrades the ' +
    'collapse. The four inherited bands match the imp-34792 published literals to < 1e-3 relative. ' +
    'Measurement only on the INHERITED imp-3220/imp-3406 surrogate map; the C_mb GUE-conditional ' +
    'per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34792 (4-band collapse across [1e9,1e13]); imp-34801 (resolution-matched genuineness ' +
    'check); imp-34777 (3-band collapse across [1e9,1e12]); imp-34757 (per-band B; monotone within ' +
    'each band); imp-34731 (g_double_prime closed form; 5-probe check); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION_ASSERTIONS = [
  {
    // (Y1): the five per-band left-endpoint bounds strictly descend.
    id: 'imp34819-five-band-bounds-strictly-descend',
    description:
      'B(1e9) > B(1e10) > B(1e11) > B(1e12) > B(1e13): appending [1e13,1e14] preserves the descending ladder',
    holds: () => LADDER_STRICTLY_DESCENDING,
  },
  {
    // (Y2): the single leftmost constant B(1e9) dominates every one of the five bands.
    id: 'imp34819-single-constant-dominates-all-five-bands',
    description:
      'B(1e9) dominates max |g_double_prime| on every one of the five bands and ' +
      'B(1e9)/max_union = 1.000 (envelope collapse preserved on [1e9,1e14])',
    holds: () =>
      GLOBAL_DOMINATES_ALL_BANDS && Math.abs(GLOBAL_ENVELOPE_RATIO - 1) < 1e-9,
  },
  {
    // (Y3): the far-tail shrink does not degrade -- ratios keep rising toward 100x/decade, stay < 100.
    id: 'imp34819-far-tail-shrink-stabilises',
    description:
      'per-decade shrink ratios keep rising monotonically toward the clean 100x/decade; the new-band ' +
      'ratio B(1e12)/B(1e13) exceeds imp-34792 last ratio and stays in (99, 100) -- no far-tail breakdown',
    holds: () =>
      SHRINK_MONOTONE_TOWARD_100 &&
      NEW_BAND_SHRINK > PREV_LAST_SHRINK &&
      NEW_BAND_SHRINK > 99 &&
      NEW_BAND_SHRINK < 100,
  },
  {
    // (Y4): the four inherited bands match the imp-34792 published literals.
    id: 'imp34819-matches-imp34792-published-literals',
    description: 'the four inherited bands reproduce the imp-34792 published left_endpoint_bound_B to < 1e-3',
    holds: () => MAX_LITERAL_DRIFT < 1e-3,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp34819-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION.isRigorous === false &&
      /NO QED/.test(IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION.verdict),
  },
];

for (const a of IMP34819_CROSSOVER_GPP_FIFTH_BAND_ENVELOPE_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34819-crossover-gpp-fifth-band-envelope-extension assertion failed: ${a.id}`);
  }
}
