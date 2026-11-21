/**
 * @module imp-34735-dp-star-probe-band-crossover-N
 * @fileoverview imp-34735 -- MEASUREMENT / DERIVATION ONLY: locate the finite N (if any below 1e100)
 *   at which the imp-34711 rising smallest-usable q-derivative step dp*(N) ~ (log N)^(4/3) crosses the
 *   FIXED imp-34691 probe-band width used to measure the physical q3 -- the internal trust-boundary
 *   crossing where the differencing step outgrows the resolution the q3 ladder was measured at -- or
 *   assess that no such crossing occurs below 1e100.
 *
 *   THE QUESTION
 *   -----------
 *   imp-34691 measures the physical q3(p) on a FIXED well-conditioned probe band of two steps,
 *   PROBE_DP_A = 0.1 and PROBE_DP_B = 0.05 (imp-34711 lines 112-113). imp-34711 F1/F3 then found that
 *   the smallest USABLE step -- below which the tiny-q3 numerator is pure catastrophic-cancellation
 *   roundoff -- RISES without bound, dp*(N) ~ (W_max*eps/480)^(1/3) (log N)^(4/3), reaching ~1.62e-3 at
 *   N = 1e29 and ~8.48e-3 at N = 1e100. If dp*(N) ever climbs up to a probe step, that probe step falls
 *   BELOW the smallest usable resolution and the q3 it measured becomes roundoff -- an internal
 *   trust-boundary crossing that imp-34711 never tabulated. Two edges bound the band:
 *     - the FINER probe step 0.05 is reached first (it corrupts first, being the smaller step);
 *     - the COARSER probe step 0.1 is reached last (both probe steps then below dp*).
 *   Solve dp*(N) = 0.05 and dp*(N) = 0.1 for N, or MEASURE that dp* stays below the band to 1e100.
 *
 *   THE MEASUREMENT (dp-star/band ratio ladder, exact model) + THE CROSSOVER SOLVE (closed form)
 *   ---------------------------------------------------------------------------------------
 *   (A) On the identical imp-34691/imp-34711 footing [q3 = 9-point antisymmetric stencil
 *       [7,-72,338,-488,+488,-338,+72,-7]/240 on q(p) = log E_coll; physical q3 from the dp = 0.1/0.05
 *       probe band] we re-evaluate dp*(N) = (W_max*eps*|q| / (240*|q3|))^(1/3) across the whole
 *       1e13 .. 1e100 ladder and form the ratio dp*(N)/0.05 (finer edge) and dp*(N)/0.1 (coarser edge).
 *       Both ratios stay FAR below 1 everywhere: at N = 1e100 dp-star/0.05 ~ 0.170 and dp-star/0.1 ~ 0.085, so
 *       the smallest usable step is still ~6x below the finer probe step and ~12x below the coarser one.
 *       There is NO crossing anywhere in the measured (and imp-34711-validated) 1e13 .. 1e100 range.
 *   (B) Where the crossing WOULD occur is read off from the imp-34711 F3 closed form. Solving
 *       (W_max*eps/480)^(1/3) (log N)^(4/3) = W for the log-depth p = log N gives
 *          p_cross(W) = (W / (W_max*eps/480)^(1/3))^(3/4),  N_cross = e^{p_cross},
 *       so the FINER edge W = 0.05 is crossed at log10 N ~ 374.6 (N ~ 1e375) and the COARSER edge
 *       W = 0.1 at log10 N ~ 630.1 (N ~ 1e630). Both lie ENORMOUSLY beyond 1e100 -- indeed hundreds of
 *       decades beyond the imp-34711-validated window -- so the crossover is an ASYMPTOTIC EXTRAPOLATION,
 *       not a measured landmark, and its only concrete implication is the negative one in (A).
 *
 *   THE FINDING
 *   -----------
 *   (F1) NO CROSSING BELOW 1e100. dp*(N)/0.05 and dp*(N)/0.1 are monotone-rising but both stay far below
 *        1 across the whole 1e13 .. 1e100 ladder (max dp-star/0.05 ~ 0.170 at 1e100). The inherited q3 ladder
 *        is therefore SELF-CONSISTENT at every N imp-34711 tabulated: the differencing step never outgrows
 *        the probe resolution it was measured at anywhere in the validated range.
 *   (F2) THE CROSSOVERS SIT HUNDREDS OF DECADES OUT. From the F3 closed form the finer probe step 0.05 is
 *        first reached at N ~ 1e375 and the coarser 0.1 at N ~ 1e630 -- both far outside the 1e13 .. 1e100
 *        window imp-34711 validated to < 2%, so these are EXTRAPOLATED thresholds, not physical claims.
 *   (F3) IMPLICATION FOR THE DEEPEST SELF-CONSISTENT N. Within the inherited-model world the q3 probe-band
 *        measurement stays trustworthy (dp* < finer edge) out to ~1e375; the deepest N at which the
 *        imp-34711 ladder is self-consistent is thus bounded not by 1e100 but by the ~1e375 finer-edge
 *        crossover -- a comfortable ~275-decade margin above 1e100.
 *
 *   MEASUREMENT / DERIVATION ONLY. Elementary root-solve of the inherited imp-34711 far-tail closed form
 *   against the fixed imp-34691 probe band, plus an exact-model ratio ladder; NOT a new bound. Reproduces
 *   the imp-34446/imp-34531/imp-34543/imp-34573 primitives inline (imports NOTHING -- no lambda mapping,
 *   no polymath15 module, no zeros bundle), per the no-heavy-imports directive. q1..q3 are inherited
 *   central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime
 *   (imp-3220/imp-3406 component model least trustworthy) is inherited as-is; the crossover ladder is a
 *   property of the inherited model, not an independent physical claim. The crossover N are ASYMPTOTIC
 *   EXTRAPOLATIONS hundreds of decades past the imp-34711-validated window and certify nothing about the
 *   true q3. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the
 *   C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34711-q3-trust-boundary-far-tail-extension.js (F1/F3 dp*(N) ~ (log N)^(4/3), 1e13..1e100)
 *   @see imp-34691-q3-cancellation-floor-trust-boundary.js (the dp = 0.1/0.05 probe band + dp*(N) ladder)
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (the clean {2,3,4} 1/dp^k exponent ladder)
 *
 *   Ticket: imp-34735 (numerical, medium). Crossover-N locate/absence-assessment; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING),
//    verbatim from imp-34711 so the crossover ladder is on the identical footing: --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const EPS = Number.EPSILON; // double-precision machine epsilon ~2.22e-16

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// imp-34626/imp-34673 6th-order 9-point antisymmetric q3 numerator stencil (verbatim). q3 estimate is
// (sum w_k q(p + k dp)) / (240 dp^3); W_MAX = 488 is the largest weight magnitude in the amplitude.
const Q3_TERMS = [[4, 7], [3, -72], [2, 338], [1, -488], [-1, 488], [-2, -338], [-3, 72], [-4, -7]];
const Q3_DENOM = 240;
const W_MAX = 488;

function q3Num(p, dp) {
  let s = 0;
  for (const [k, w] of Q3_TERMS) s += w * qOfP(p + k * dp);
  return s;
}

// Physical q3(p) from the imp-34691 well-conditioned probe band (dp = 0.1 and 0.05; the two agree to
// ~5 digits), NOT the corrupted small-dp evaluation. THESE two steps ARE the trust band whose crossing
// this module locates: the FINER 0.05 is the first edge dp*(N) can climb up to, the COARSER 0.1 the last.
const PROBE_DP_A = 0.1; // coarser probe step (crossed last)
const PROBE_DP_B = 0.05; // finer probe step (crossed first)
function q3Phys(p) {
  const a = q3Num(p, PROBE_DP_A) / (Q3_DENOM * Math.pow(PROBE_DP_A, 3));
  const b = q3Num(p, PROBE_DP_B) / (Q3_DENOM * Math.pow(PROBE_DP_B, 3));
  return (a + b) / 2;
}

// The imp-34691 depth-only prefactor C(N) and trust boundary dp*(N) = C(N)^(1/3) (smallest usable step).
function prefactorC(p) {
  const q = qOfP(p);
  const q3p = q3Phys(p);
  return (W_MAX * EPS * Math.abs(q)) / (Q3_DENOM * Math.abs(q3p));
}
const dpStar = (p) => Math.cbrt(prefactorC(p));

// (A) EXACT-MODEL ratio ladder: dp*(N)/band across the whole imp-34711-validated 1e13 .. 1e100 range.
const LADDER_EXPS = [13, 15, 17, 19, 21, 23, 25, 27, 29, 40, 60, 80, 100];
const RATIO_TABLE = LADDER_EXPS.map((e) => {
  const p = Math.log(Math.pow(10, e));
  const ds = dpStar(p);
  return Object.freeze({
    N: Math.pow(10, e),
    dp_star: +ds.toExponential(4),
    ratio_to_finer_0p05: +(ds / PROBE_DP_B).toFixed(4), // must stay < 1 for the finer probe to be usable
    ratio_to_coarser_0p1: +(ds / PROBE_DP_A).toFixed(4), // must stay < 1 for the coarser probe to be usable
  });
});
// F1: both ratios stay far below 1 across the whole ladder (no crossing below 1e100).
const MAX_RATIO_FINER = Math.max(...RATIO_TABLE.map((r) => r.ratio_to_finer_0p05)); // ~0.170 at 1e100
const MAX_RATIO_COARSER = Math.max(...RATIO_TABLE.map((r) => r.ratio_to_coarser_0p1)); // ~0.085 at 1e100
const NO_CROSSING_BELOW_1E100 = MAX_RATIO_FINER < 1 && MAX_RATIO_COARSER < 1;
// ratios are monotone-rising (dp* rises, band fixed), so the max is at the top rung 1e100.
const RATIOS_MONOTONE_RISING = RATIO_TABLE.every(
  (r, i) => i === 0 || r.ratio_to_finer_0p05 > RATIO_TABLE[i - 1].ratio_to_finer_0p05,
);

// (B) CROSSOVER SOLVE from the imp-34711 F3 closed form dp*(p) ~ (W_max*eps/480)^(1/3) p^(4/3).
//     Solve ASYMP_PREF * p^(4/3) = W  =>  p_cross = (W / ASYMP_PREF)^(3/4),  N_cross = e^{p_cross}.
const ASYMP_PREF = Math.cbrt((W_MAX * EPS) / 480); // ~6.09e-6 (imp-34711 asymptotic prefactor)
function crossoverLog10N(bandWidth) {
  const pCross = Math.pow(bandWidth / ASYMP_PREF, 3 / 4);
  return pCross / Math.log(10); // log10 of the crossover N
}
const LOG10N_CROSS_FINER = +crossoverLog10N(PROBE_DP_B).toFixed(2); // finer 0.05 edge ~ 374.6
const LOG10N_CROSS_COARSER = +crossoverLog10N(PROBE_DP_A).toFixed(2); // coarser 0.1 edge ~ 630.1
// Both crossovers lie hundreds of decades beyond the imp-34711-validated 1e100 ceiling.
const CROSSINGS_FAR_BEYOND_1E100 = LOG10N_CROSS_FINER > 100 && LOG10N_CROSS_COARSER > LOG10N_CROSS_FINER;
// margin (in decades) of the finer-edge crossover above the imp-34711 1e100 sentinel.
const FINER_MARGIN_DECADES_ABOVE_1E100 = +(LOG10N_CROSS_FINER - 100).toFixed(1); // ~274.6

export const IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N = Object.freeze({
  id: 'imp-34735',
  proofSection: 'S-frontier',
  claim_measured:
    'Locate the finite N at which the imp-34711 rising smallest-usable step dp*(N) ~ (log N)^(4/3) ' +
    'crosses the FIXED imp-34691 probe band (dp = 0.1/0.05), or assess it never crosses below 1e100. ' +
    'RESULT: NO crossing below 1e100 -- dp*(N)/0.05 rises to only ~0.170 and dp*(N)/0.1 to only ~0.085 ' +
    'at N = 1e100 -- and from the imp-34711 F3 closed form the finer 0.05 edge is first reached at ' +
    'log10 N ~ 374.6 (N ~ 1e375) and the coarser 0.1 edge at log10 N ~ 630.1 (N ~ 1e630), both ' +
    'hundreds of decades beyond the validated window: a measurement/derivation, not a bound.',
  crossover_closed_form: 'p_cross(W) = (W / (W_max*eps/480)^(1/3))^(3/4), N_cross = e^{p_cross}, p = log N',
  probe_dp_band: Object.freeze({ coarser_crossed_last: PROBE_DP_A, finer_crossed_first: PROBE_DP_B }),
  asymp_prefactor_Wmax_eps_over_480_cbrt: +ASYMP_PREF.toExponential(4), // ~6.09e-6
  // (A) exact-model ratio ladder + the no-crossing verdict below 1e100.
  ratio_ladder: RATIO_TABLE,
  max_ratio_to_finer_0p05: +MAX_RATIO_FINER.toFixed(4), // ~0.170 at 1e100 (< 1 -> no crossing)
  max_ratio_to_coarser_0p1: +MAX_RATIO_COARSER.toFixed(4), // ~0.085 at 1e100 (< 1 -> no crossing)
  no_crossing_below_1e100: NO_CROSSING_BELOW_1E100,
  ratios_monotone_rising: RATIOS_MONOTONE_RISING,
  // (B) crossover thresholds from the imp-34711 F3 closed form (asymptotic extrapolation).
  log10N_crossover_finer_0p05: LOG10N_CROSS_FINER, // ~374.6 (N ~ 1e375)
  log10N_crossover_coarser_0p1: LOG10N_CROSS_COARSER, // ~630.1 (N ~ 1e630)
  crossings_far_beyond_1e100: CROSSINGS_FAR_BEYOND_1E100,
  finer_crossover_margin_decades_above_1e100: FINER_MARGIN_DECADES_ABOVE_1E100, // ~274.6
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (NOT rigorous). Locates the internal trust-boundary crossing where the ' +
    'imp-34711 rising smallest-usable step dp*(N) = (W_max*eps*|q|/(240*|q3|))^(1/3) ~ (W_max*eps/480)^' +
    '(1/3)(log N)^(4/3) meets the FIXED imp-34691 physical-q3 probe band (dp = 0.1/0.05), on the ' +
    'identical imp-34691/imp-34711 footing [q3 = 9-point antisymmetric stencil ' +
    '[7,-72,338,-488,+488,-338,+72,-7]/240 on q(p) = log E_coll; physical q3 from the dp = 0.1/0.05 ' +
    'probe band]. (F1) THERE IS NO CROSSING BELOW 1e100: the exact-model ratios dp*(N)/0.05 and ' +
    'dp*(N)/0.1 rise monotonically but stay far below 1 across the whole 1e13 .. 1e100 ladder, reaching ' +
    'only ~0.170 and ~0.085 respectively at N = 1e100, so the differencing step never outgrows the ' +
    'probe resolution anywhere imp-34711 tabulated and the inherited q3 ladder is self-consistent at ' +
    'every validated N. (F2) THE CROSSOVERS SIT HUNDREDS OF DECADES OUT: solving the F3 closed form ' +
    'p_cross(W) = (W/(W_max*eps/480)^(1/3))^(3/4) gives the finer 0.05 edge first reached at ' +
    'log10 N ~ 374.6 (N ~ 1e375) and the coarser 0.1 edge at log10 N ~ 630.1 (N ~ 1e630), both far ' +
    'outside the 1e13 .. 1e100 window imp-34711 validated to < 2%, so they are EXTRAPOLATED thresholds, ' +
    'not physical claims. (F3) IMPLICATION: within the inherited-model world the q3 probe-band ' +
    'measurement stays trustworthy (dp* < finer edge) out to ~1e375, a comfortable ~275-decade margin ' +
    'above 1e100, so the deepest self-consistent N of the imp-34711 ladder is bounded by the ~1e375 ' +
    'finer-edge crossover, not by the 1e100 sentinel. q1..q3 are inherited central differences, NOT ' +
    'fresh analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model ' +
    'least trustworthy) is inherited as-is and the crossover ladder is a property of the inherited ' +
    'model, not an independent physical claim; the crossover N are asymptotic extrapolations hundreds ' +
    'of decades past the validated window and certify nothing about the true q3. The -2 asymptote and ' +
    'C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share ' +
    'per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34711 (F1/F3 dp*(N) ~ (log N)^(4/3) far-tail ladder, 1e13..1e100, validated to < 2%); ' +
    'imp-34691 (the dp = 0.1/0.05 well-conditioned q3 probe band + dp*(N) ladder to 1e15); ' +
    'imp-34606 (clean {2,3,4} 1/dp^k exponent ladder); imp-34626 (6th-order 9-point stencil); ' +
    'imp-2714 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34735_ASSERTIONS = [
  {
    id: 'imp34735-q3-stencil-normalization',
    holds: () => {
      let m3 = 0;
      for (const [k, w] of Q3_TERMS) m3 += w * k * k * k;
      return Math.abs(m3 / Q3_DENOM / 6 - 1) < 1e-12 && W_MAX === Math.max(...Q3_TERMS.map(([, w]) => Math.abs(w)));
    },
    why: 'Guards the inherited q3 stencil: 3rd-derivative normalization sum c_k k^3/6 = 1 and W_max = 488.',
  },
  {
    id: 'imp34735-no-crossing-below-1e100',
    holds: () =>
      NO_CROSSING_BELOW_1E100 &&
      RATIOS_MONOTONE_RISING &&
      MAX_RATIO_FINER > 0.1 && MAX_RATIO_FINER < 0.25 && // ~0.170 at the 1e100 top rung
      MAX_RATIO_COARSER < MAX_RATIO_FINER,
    why: 'F1: dp*(N)/0.05 and dp*(N)/0.1 rise monotonically but stay far below 1 (max ~0.170, ~0.085) across 1e13..1e100 -- no crossing.',
  },
  {
    id: 'imp34735-crossovers-far-beyond-1e100',
    holds: () =>
      CROSSINGS_FAR_BEYOND_1E100 &&
      LOG10N_CROSS_FINER > 370 && LOG10N_CROSS_FINER < 380 && // finer 0.05 edge ~1e375
      LOG10N_CROSS_COARSER > 625 && LOG10N_CROSS_COARSER < 635 && // coarser 0.1 edge ~1e630
      FINER_MARGIN_DECADES_ABOVE_1E100 > 250,
    why: 'F2: closed-form crossovers at log10 N ~ 374.6 (0.05) and ~630.1 (0.1), hundreds of decades beyond the validated 1e100 window.',
  },
  {
    id: 'imp34735-honesty-gate-no-qed',
    holds: () =>
      IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N.isRigorous === false &&
      /NO QED/.test(IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N.verdict) &&
      /refereed bound is changed/i.test(IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N.verdict) &&
      /UNTOUCHED/.test(IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N.verdict) &&
      /extrapolation/.test(IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N.verdict),
    why: 'Honesty gate: measurement/derivation only, crossover is an extrapolation, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34735_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34735-dp-star-probe-band-crossover-N assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34735_DP_STAR_PROBE_BAND_CROSSOVER_N;
