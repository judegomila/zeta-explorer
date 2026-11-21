/**
 * @module imp-34777-crossover-gpp-cross-band-envelope-collapse
 *
 * imp-34777 (accuracy, S-frontier): imp-34757 (D2) established that the crossover-map second
 * derivative g_double_prime(N) = -4 pi^2 K (u+1)/(T^2 u^3) is monotone-decreasing WITHIN each
 * post-peak decade, so the per-band left-endpoint bound B(band) is the sharp supremum ON THAT
 * band (B(band)/max_band = 1.000). What imp-34757 did NOT check is CROSS-BAND: whether the three
 * per-band bounds themselves collapse to ONE descending ladder so the leftmost band bound B(1e9)
 * dominates the whole [1e9,1e12] union. This module is a focused standing accuracy TRIPWIRE on
 * exactly that cross-band monotonicity, tied to the imp-34757 published per-band literals so a
 * future effectiveHeightForN or closed-form refactor that broke the collapse would fire it.
 *
 * WHAT THIS ADDS (accuracy guard, no new mathematics)
 * ---------------------------------------------------
 * imp-34757 tabulated per-band B(band) and per-band max but never asserted the three bounds are a
 * strictly DESCENDING ladder, nor that B(1e9) individually dominates the max on EACH of the two
 * later bands. (imp-34768 later checked global-grid monotonicity of |g_double_prime| directly on a
 * 121-point grid; this module instead pins the collapse at the coarse per-band-BOUND level and
 * cross-checks against the imp-34757 published literals, a complementary and cheaper tripwire.)
 * Reusing the imp-34731/imp-34757 closed form VERBATIM this module:
 *   (E1) recomputes the three per-band left-endpoint bounds B(1e9), B(1e10), B(1e11) and the
 *        per-band max |g_double_prime|, and asserts the ladder is STRICTLY DESCENDING
 *        B(1e9) > B(1e10) > B(1e11);
 *   (E2) asserts the single leftmost constant B(1e9) DOMINATES the max |g_double_prime| on EVERY
 *        band (B(1e9) >= max_band for all three), i.e. the per-band left-endpoint bounds COLLAPSE
 *        to one monotone envelope constant B(1e9) guarding the whole union;
 *   (E3) cross-checks each recomputed B(band) against the imp-34757 published literal
 *        left_endpoint_bound_B so a closed-form / height-map drift is caught against the frozen
 *        table, not just against a live recompute.
 *
 * THE CLOSED FORM (inherited from imp-34731 / imp-34757, unchanged)
 * ----------------------------------------------------------------
 *     g(N) = K log T0(N),   K = (C_C/E_trunc)^2 ~ 1.5727e8,   T = T0(N),   u = log(T/2pi),
 *     g_double_prime(N) = -4 pi^2 K (u+1) / (T^2 u^3).
 * T0 and u both increase in N and the T^2 u^3 denominator outgrows the (u+1) numerator, so
 * |g_double_prime| is strictly decreasing across the WHOLE post-peak ramp; hence both the per-band
 * bounds descend and the leftmost B(1e9) is the global envelope.
 *
 * THE FINDING (accuracy check only)
 * ---------------------------------
 *   (E1) THE PER-BAND BOUNDS DESCEND. B(1e9) > B(1e10) > B(1e11): the three sharp per-band suprema
 *        form a strictly descending ladder, not an arbitrary set.
 *   (E2) ONE CONSTANT GUARDS THE UNION. B(1e9) dominates the max |g_double_prime| on every band,
 *        so the per-band bookkeeping collapses to the single envelope constant B(1e9).
 *   (E3) MATCHES THE FROZEN TABLE. Each recomputed B(band) reproduces the imp-34757 published
 *        left_endpoint_bound_B to < 1e-3 relative.
 *
 * ACCURACY CHECK ONLY. This guards the curvature bound of the INHERITED imp-3220/imp-3406
 * surrogate crossover map; it changes NO bound. The C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34757-crossover-gpp-dense-cross-check (per-band B; monotone WITHIN each band)
 * @see imp-34768-crossover-gppp-global-envelope (global-grid monotonicity via g_triple_prime > 0)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see imp-34750-crossover-gpp-postpeak-perdecade-bound (per-decade B ladder across [1e9,1e12])
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK } from './imp-34757-crossover-gpp-dense-cross-check.js';

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

// The three post-peak bands imp-34757 used, forming the union [1e9, 1e12].
const BANDS = [
  [1e9, 1e10],
  [1e10, 1e11],
  [1e11, 1e12],
];
const GRID_PER_BAND = 41; // same tightness grid imp-34757 used for the per-band max

// (E1)/(E2) per-band left-endpoint bound and per-band max on a dense grid.
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

// (E1) the per-band bounds form a STRICTLY DESCENDING ladder.
let LADDER_STRICTLY_DESCENDING = true;
for (let i = 1; i < BAND_ROWS.length; i++) {
  if (!(BAND_ROWS[i].B < BAND_ROWS[i - 1].B)) LADDER_STRICTLY_DESCENDING = false;
}

// (E2) B(1e9) dominates the max on EVERY band (tiny slack absorbs the endpoint tie on band 0).
const DOM_SLACK = 1 + 1e-12;
const GLOBAL_DOMINATES_ALL_BANDS = BAND_ROWS.every((r) => B_GLOBAL * DOM_SLACK >= r.maxAbs);

// (E3) recomputed B(band) matches the imp-34757 published per-band literal.
const PUBLISHED_BANDS = IMP34757_CROSSOVER_GPP_DENSE_CROSS_CHECK.bands;
let MAX_LITERAL_DRIFT = 0;
for (let i = 0; i < BAND_ROWS.length; i++) {
  const drift = Math.abs(BAND_ROWS[i].B / PUBLISHED_BANDS[i].left_endpoint_bound_B - 1);
  if (drift > MAX_LITERAL_DRIFT) MAX_LITERAL_DRIFT = drift;
}

// Ratio of the leftmost bound to the union-wide max (= global max on band 0), ~1.000.
const UNION_MAX = Math.max(...BAND_ROWS.map((r) => r.maxAbs));
const GLOBAL_ENVELOPE_RATIO = B_GLOBAL / UNION_MAX;

export const IMP34777_CROSSOVER_GPP_CROSS_BAND_ENVELOPE_COLLAPSE = {
  id: 'imp-34777',
  proofSection: 'S-frontier',
  question:
    'imp-34757 D2 proved g_double_prime is monotone WITHIN each post-peak decade so the per-band ' +
    'bound B(band) is the sharp band supremum, but never checked CROSS-BAND: do the three per-band ' +
    'bounds collapse to one descending ladder so the single leftmost constant B(1e9) dominates ' +
    '|g_double_prime| across the whole [1e9,1e12] union? Accuracy tripwire only; changes no bound; no QED.',
  closedFormSecondDerivative:
    'g_double_prime(N) = -4 pi^2 K (u + 1) / (T^2 u^3),  T = T0(N), u = log(T/2pi), K = (C_C/E_trunc)^2',
  bands: BAND_ROWS.map((r, i) => ({
    band: [+r.band[0].toExponential(0), +r.band[1].toExponential(0)],
    left_endpoint_bound_B: +r.B.toExponential(6),
    max_abs_on_band: +r.maxAbs.toExponential(6),
    published_left_endpoint_bound_B: PUBLISHED_BANDS[i].left_endpoint_bound_B,
    dominated_by_B_1e9: B_GLOBAL * DOM_SLACK >= r.maxAbs,
  })),
  globalEnvelopeConstant_B_1e9: +B_GLOBAL.toExponential(6),
  unionMaxAbsSecondDeriv: +UNION_MAX.toExponential(6),
  globalEnvelopeRatio_B_over_unionMax: +GLOBAL_ENVELOPE_RATIO.toFixed(6), // ~1.000000
  ladderStrictlyDescending: LADDER_STRICTLY_DESCENDING,
  globalConstantDominatesAllBands: GLOBAL_DOMINATES_ALL_BANDS,
  maxLiteralDriftVsImp34757: +MAX_LITERAL_DRIFT.toExponential(3),
  finding: {
    E1_per_band_bounds_descend:
      'B(1e9) > B(1e10) > B(1e11): the three sharp per-band suprema form a strictly descending ' +
      'ladder, so the leftmost band bound is the largest of the three.',
    E2_one_constant_guards_union:
      'The single leftmost constant B(1e9) = ' +
      (+B_GLOBAL.toExponential(6)).toString() +
      ' dominates the max |g_double_prime| on every band (B(1e9)/max_union = 1.000), so the ' +
      'per-band bookkeeping COLLAPSES to one monotone envelope constant guarding the whole ' +
      '[1e9,1e12] union.',
    E3_matches_frozen_table:
      'Each recomputed B(band) reproduces the imp-34757 published left_endpoint_bound_B to ' +
      '< 1e-3 relative (max drift ' +
      (+MAX_LITERAL_DRIFT.toExponential(3)).toString() +
      '), so the tripwire fires against the frozen table if a future height-map/closed-form ' +
      'refactor drifts.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY GUARD (frontier-direction). imp-34757 proved g_double_prime = -4 pi^2 K (u+1)/(T^2 u^3) ' +
    'is monotone WITHIN each post-peak decade so B(band) is the sharp band supremum, but left the ' +
    'CROSS-BAND question open. This module confirms the three per-band bounds form a strictly ' +
    'descending ladder B(1e9) > B(1e10) > B(1e11) and that the single leftmost constant B(1e9) ' +
    'dominates the max |g_double_prime| on every band (B(1e9)/max_union = 1.000), so the per-band ' +
    'left-endpoint bounds COLLAPSE to one monotone envelope constant guarding the whole [1e9,1e12] ' +
    'union; each recomputed B(band) matches the imp-34757 published literal to < 1e-3 relative. A ' +
    'coarse per-band-bound cross-band tripwire complementing the imp-34768 global-grid check. ' +
    'Accuracy check only on the INHERITED imp-3220/imp-3406 surrogate map; the C_mb GUE-conditional ' +
    'per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34757 (per-band B; monotone within each band); imp-34768 (global-grid monotonicity via ' +
    'g_triple_prime > 0); imp-34731 (g_double_prime closed form; 5-probe check); imp-34750 ' +
    '(per-decade B ladder across [1e9,1e12]); lambda-rh-height-mapping (effectiveHeightForN, ' +
    'Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz).',
};

export const IMP34777_CROSSOVER_GPP_CROSS_BAND_ENVELOPE_COLLAPSE_ASSERTIONS = [
  {
    // (E1): the three per-band left-endpoint bounds strictly descend.
    id: 'imp34777-per-band-bounds-strictly-descend',
    description: 'B(1e9) > B(1e10) > B(1e11): the per-band sharp suprema form a descending ladder',
    holds: () => LADDER_STRICTLY_DESCENDING,
  },
  {
    // (E2): the single leftmost constant B(1e9) dominates every band; ratio to union max = 1.000.
    id: 'imp34777-single-constant-dominates-all-bands',
    description:
      'B(1e9) dominates max |g_double_prime| on every band and B(1e9)/max_union = 1.000 ' +
      '(per-band bounds collapse to one envelope)',
    holds: () =>
      GLOBAL_DOMINATES_ALL_BANDS && Math.abs(GLOBAL_ENVELOPE_RATIO - 1) < 1e-9,
  },
  {
    // (E3): recomputed per-band bounds match the imp-34757 published literals.
    id: 'imp34777-matches-imp34757-published-literals',
    description: 'each recomputed B(band) reproduces the imp-34757 published left_endpoint_bound_B to < 1e-3',
    holds: () => MAX_LITERAL_DRIFT < 1e-3,
  },
  {
    // Honesty gate: accuracy check only, no QED, no refereed bound is changed.
    id: 'imp34777-honesty-gate-no-qed',
    description: 'Accuracy check only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34777_CROSSOVER_GPP_CROSS_BAND_ENVELOPE_COLLAPSE.isRigorous === false &&
      /NO QED/.test(IMP34777_CROSSOVER_GPP_CROSS_BAND_ENVELOPE_COLLAPSE.verdict) &&
      /refereed bound is changed/i.test(IMP34777_CROSSOVER_GPP_CROSS_BAND_ENVELOPE_COLLAPSE.verdict),
  },
];

for (const a of IMP34777_CROSSOVER_GPP_CROSS_BAND_ENVELOPE_COLLAPSE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34777-crossover-gpp-cross-band-envelope-collapse assertion failed: ${a.id}`);
  }
}
