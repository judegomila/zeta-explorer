/**
 * @module imp-34773-crossover-N-stencil-order-spread
 * @fileoverview imp-34773 -- MEASUREMENT ONLY: tabulate how the imp-34754 dp-star probe-band
 *   crossover N (the log10 N where the rising smallest-usable step dp-star(N) meets the FIXED
 *   imp-34691 probe band dp = 0.1/0.05) shifts across the THREE imp-34753 stencil orders
 *   (4th-order 7-point, 6th-order 9-point, 8th-order 11-point), since the scheme-dependent roundoff
 *   prefactor W_max/(2*denom) enters dp-star cubically.
 *
 *   THE QUESTION
 *   -----------
 *   imp-34753 F3 established that the imp-34711 (log N)^(4/3) far-tail SHAPE of the trust boundary
 *   dp-star(N) = (W_max*eps*|q| / (denom*|q3|))^(1/3) is stencil-order-INVARIANT, while the ONLY
 *   scheme-dependent piece is the roundoff amplitude W_max/denom (1.625 / 2.033 / 2.318 across the
 *   7-/9-/11-point stencils). imp-34754 then located the finer-edge no-crossing landmark
 *   log10 N ~ 374.6 (coarser ~630.1) -- but read it on a SINGLE (9-point) stencil. Because dp-star
 *   carries the amplitude cubically [dp-star ~ (W_max/denom)^(1/3)], the crossover N must SHIFT with
 *   stencil choice. This module measures that shift on all three stencils and tabulates the spread in
 *   the extrapolated crossover decade attributable to stencil order alone.
 *
 *   THE MEASUREMENT (identical footing, three stencils by order 4 < 6 < 8)
 *   ---------------------------------------------------------------------
 *   On the identical imp-34753/imp-34754 footing [q(p) = log E_coll; physical q3 from the dp = 0.1/0.05
 *   probe band; each stencil evaluated with its own (W_max, denom)] we form, per stencil:
 *     (i)   the far-tail closed-form asymptote prefactor A_s = (W_max*eps / (2*denom))^(1/3) [= the
 *           imp-34754 (W_max*eps/480)^(1/3) generalized: 480 = 2*240 for the 9-point], so
 *           dp-star(p) ~ A_s * p^(4/3) [because |q|/|q3| ~ p^4/2 in the deep tail];
 *     (ii)  the closed-form crossover log10 N where dp-star reaches the FIXED probe edge:
 *           finer edge dp = 0.05 -> log10 N = (0.05/A_s)^(3/4)/log(10); coarser edge dp = 0.1 similarly;
 *     (iii) the exact-model finer-edge ratio dp-star(N)/0.05 at the imp-34754 deep-tail ceiling N = 1e300.
 *
 *   THE FINDING
 *   -----------
 *   (F1) THE CROSSOVER N SHIFTS BY ~34 DECADES (FINER EDGE) ACROSS THE THREE STENCIL ORDERS. The
 *        finer-edge closed-form crossover is log10 N ~ 396.2 (7-point, amplitude 1.625) -> ~374.6
 *        (9-point, 2.033) -> ~362.6 (11-point, 2.318): a spread of ~33.7 decades (~9% of the central
 *        value). The coarser edge (dp = 0.1) shifts ~56.6 decades, from ~666.4 to ~609.8. The 9-point
 *        imp-34754 landmark 374.6 sits in the MIDDLE of a [362.6, 396.2] stencil band, NOT at an edge.
 *   (F2) THE SHIFT IS AN EXACT (W_max/denom)^(-1/4) POWER LAW -- THE CUBIC-IN-PREFACTOR SIGNATURE. Since
 *        dp-star ~ (W_max/denom)^(1/3) p^(4/3) and the crossover solves dp-star = fixed, the crossover
 *        p ~ (W_max/denom)^(-1/4): larger amplitude -> larger dp-star -> the differencing step reaches
 *        the fixed probe edge SOONER (earlier crossover). The measured ratio 362.56/396.23 = 0.9150
 *        matches (2.318/1.625)^(-1/4) = 0.9150 to 4 digits -- the crossover shift is purely the cubic
 *        roundoff amplitude re-expressed, no independent q-content.
 *   (F3) THE EXACT-MODEL NO-CROSSING VERDICT AT 1e300 HOLDS ON ALL THREE STENCILS, BUT THE MARGIN
 *        NARROWS WITH ORDER. The exact finer-edge ratio dp-star(1e300)/0.05 is 0.730 (7-point) -> 0.806
 *        (9-point) -> 0.855 (11-point): all still below 1 (no crossing through 1e300 on any stencil), but
 *        the higher-amplitude 11-point stencil sits closest to corruption -- consistent with its earlier
 *        crossover. The stencil choice moves the landmark by ~9% but never manufactures a sub-1e300 crossing.
 *
 *   MEASUREMENT ONLY. A stencil-order sweep of the imp-34754 crossover landmark; a property of the
 *   inherited component model, NOT a new bound. Reproduces the imp-34446/imp-34531/imp-34573/imp-34711
 *   primitives and the three imp-34753 stencils inline (imports NOTHING -- no lambda mapping, no
 *   polymath15 module, no zeros bundle), per the no-heavy-imports directive. q1..q3 remain inherited
 *   central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime
 *   (imp-3220/imp-3406 model least trustworthy) is inherited as-is and the crossover N is an asymptotic
 *   extrapolation hundreds of decades past the imp-34711-validated 1e100 window that certifies nothing
 *   about the true q3. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are
 *   UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched;
 *   changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34754-dp-star-probe-band-ratio-deep-tail.js (the 9-point crossover landmark being swept)
 *   @see imp-34753-q3-far-tail-third-stencil-convergence.js (the three stencils + prefactor amplitudes)
 *   @see imp-34711-q3-trust-boundary-far-tail-extension.js (dp-star(N) ~ (log N)^(4/3) far-tail law)
 *
 *   Ticket: imp-34773 (numerical, medium). Crossover-N stencil-order spread measurement; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34573/imp-34711 primitives (imports NOTHING),
//    verbatim from imp-34753/imp-34754 so all three stencils sit on the identical q(p) = log E_coll footing: --
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

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N (stencil-independent)

// -- the THREE antisymmetric central q3 stencils, ORDERED by accuracy order 4 < 6 < 8 (verbatim from
//    imp-34753). Each obeys sum w_k k^3 = 6*denom; W_max is the largest weight magnitude (the roundoff
//    amplitude carried CUBICALLY into dp-star = (W_max*eps*|q|/(denom*|q3|))^(1/3)). --
const STENCIL_7 = Object.freeze({
  name: '7-point 4th-order (independent)',
  order: 4,
  terms: [[3, -1], [2, 8], [1, -13], [-1, 13], [-2, -8], [-3, 1]],
  denom: 8,
  wMax: 13,
});
const STENCIL_9 = Object.freeze({
  name: '9-point 6th-order (inherited)',
  order: 6,
  terms: [[4, 7], [3, -72], [2, 338], [1, -488], [-1, 488], [-2, -338], [-3, 72], [-4, -7]],
  denom: 240,
  wMax: 488,
});
const STENCIL_11 = Object.freeze({
  name: '11-point 8th-order (higher-order)',
  order: 8,
  terms: [
    [5, -205], [4, 2522], [3, -14607], [2, 52428], [1, -70098],
    [-1, 70098], [-2, -52428], [-3, 14607], [-4, -2522], [-5, 205],
  ],
  denom: 30240,
  wMax: 70098,
});
const STENCILS_BY_ORDER = Object.freeze([STENCIL_7, STENCIL_9, STENCIL_11]);

function q3Num(stencil, p, dp) {
  let s = 0;
  for (const [k, w] of stencil.terms) s += w * qOfP(p + k * dp);
  return s;
}

// physical q3(p) from the imp-34691 well-conditioned probe band (dp = 0.1 and 0.05). The SAME two steps
// are the FIXED trust band the rising dp-star climbs toward: finer 0.05 crossed first, coarser 0.1 last.
const PROBE_DP_A = 0.1; // coarser probe step (crossed last)
const PROBE_DP_B = 0.05; // finer probe step (crossed first)
function q3Phys(stencil, p) {
  const a = q3Num(stencil, p, PROBE_DP_A) / (stencil.denom * Math.pow(PROBE_DP_A, 3));
  const b = q3Num(stencil, p, PROBE_DP_B) / (stencil.denom * Math.pow(PROBE_DP_B, 3));
  return (a + b) / 2;
}

// exact-model prefactor C(N) and trust boundary dp-star(N) = C(N)^(1/3), each with its own (wMax, denom).
function prefactorC(stencil, p) {
  const q = qOfP(p);
  const q3p = q3Phys(stencil, p);
  return (stencil.wMax * EPS * Math.abs(q)) / (stencil.denom * Math.abs(q3p));
}
const dpStar = (stencil, p) => Math.cbrt(prefactorC(stencil, p));

// -- far-tail closed-form asymptote prefactor A_s = (W_max*eps / (2*denom))^(1/3). This GENERALIZES the
//    imp-34754 ASYMP_PREF = (W_max*eps/480)^(1/3) [480 = 2*240 for the 9-point]: in the deep tail
//    |q| ~ p/2 and q3*p^3 ~ 1.026 so |q|/|q3| ~ p^4/2, giving dp-star(p) ~ A_s * p^(4/3). --
const asympPrefactor = (stencil) => Math.cbrt((stencil.wMax * EPS) / (2 * stencil.denom));

// closed-form crossover log10 N where dp-star reaches the FIXED probe edge dp: (dp/A_s)^(3/4)/log(10).
function crossoverLog10N(stencil, probeDp) {
  return Math.pow(probeDp / asympPrefactor(stencil), 3 / 4) / Math.log(10);
}

const P_1E300 = Math.log(Math.pow(10, 300)); // imp-34754 numerically-reliable deep-tail ceiling

// per-stencil crossover row: amplitude, asymptote prefactor, finer/coarser closed-form crossover, and the
// exact-model finer-edge ratio dp-star(1e300)/0.05 (must stay < 1 for the no-crossing verdict to hold).
function crossoverRow(stencil) {
  const A_s = asympPrefactor(stencil);
  return Object.freeze({
    stencil: stencil.name,
    order: stencil.order,
    wMax: stencil.wMax,
    denom: stencil.denom,
    roundoff_amplitude_wMax_over_denom: +(stencil.wMax / stencil.denom).toFixed(6),
    asymptote_prefactor_A_s: +A_s.toExponential(4),
    crossover_log10N_finer_0p05: +crossoverLog10N(stencil, PROBE_DP_B).toFixed(2),
    crossover_log10N_coarser_0p1: +crossoverLog10N(stencil, PROBE_DP_A).toFixed(2),
    exact_finer_ratio_1e300: +(dpStar(stencil, P_1E300) / PROBE_DP_B).toFixed(4),
  });
}

const ROWS = STENCILS_BY_ORDER.map(crossoverRow);
const [ROW_4, ROW_6, ROW_8] = ROWS;

// -- THE CORE MEASUREMENT: the spread in the extrapolated crossover decade attributable to stencil order --
const FINER_CROSSOVERS = ROWS.map((r) => r.crossover_log10N_finer_0p05);
const COARSER_CROSSOVERS = ROWS.map((r) => r.crossover_log10N_coarser_0p1);
// F1: finer-edge crossover spread ~34 decades across order 4->6->8 (7-point latest, 11-point earliest).
const FINER_SPREAD_DECADES = +(Math.max(...FINER_CROSSOVERS) - Math.min(...FINER_CROSSOVERS)).toFixed(2); // ~33.67
const COARSER_SPREAD_DECADES = +(Math.max(...COARSER_CROSSOVERS) - Math.min(...COARSER_CROSSOVERS)).toFixed(2); // ~56.62
const FINER_SPREAD_FRACTION = +(FINER_SPREAD_DECADES / ROW_6.crossover_log10N_finer_0p05).toFixed(4); // ~0.09
// F2: the shift is an exact (W_max/denom)^(-1/4) power law -- the cubic-in-prefactor signature. Compare the
// 11-point/7-point crossover ratio to (amp_11/amp_7)^(-1/4).
const CROSSOVER_RATIO_11_OVER_7 = +(ROW_8.crossover_log10N_finer_0p05 / ROW_4.crossover_log10N_finer_0p05).toFixed(4); // ~0.9150
const AMPLITUDE_POWER_LAW_PREDICTION = +Math.pow(
  ROW_8.roundoff_amplitude_wMax_over_denom / ROW_4.roundoff_amplitude_wMax_over_denom,
  -1 / 4,
).toFixed(4); // ~0.9150
const POWER_LAW_HOLDS = Math.abs(CROSSOVER_RATIO_11_OVER_7 - AMPLITUDE_POWER_LAW_PREDICTION) < 1e-3;
// F3: exact-model no-crossing verdict at 1e300 holds on all three stencils (finer ratio < 1), margin
// narrowing with order (higher amplitude -> ratio closest to 1).
const NO_CROSSING_1E300_ALL_STENCILS = ROWS.every((r) => r.exact_finer_ratio_1e300 < 1);
const RATIO_1E300_RISES_WITH_ORDER =
  ROW_8.exact_finer_ratio_1e300 > ROW_6.exact_finer_ratio_1e300 &&
  ROW_6.exact_finer_ratio_1e300 > ROW_4.exact_finer_ratio_1e300;

export const IMP34773_CROSSOVER_N_STENCIL_ORDER_SPREAD = Object.freeze({
  id: 'imp-34773',
  proofSection: 'S-frontier',
  claim_measured:
    'Tabulate how the imp-34754 dp-star probe-band crossover N (where the rising smallest-usable step ' +
    'dp-star(N) meets the FIXED dp = 0.1/0.05 probe band) shifts across the three imp-34753 stencil ' +
    'orders (4th-order 7-point, 6th-order 9-point, 8th-order 11-point), since the roundoff amplitude ' +
    'W_max/denom enters dp-star cubically. RESULT: the finer-edge closed-form crossover shifts log10 N ~ ' +
    '396.2 (7-point, amplitude 1.625) -> ~374.6 (9-point, 2.033) -> ~362.6 (11-point, 2.318), a spread ' +
    'of ~33.7 decades (~9% of the central value); the coarser edge shifts ~56.6 decades (666.4 -> 609.8). ' +
    'The shift is an EXACT (W_max/denom)^(-1/4) power law (11/7 crossover ratio 0.9150 = (2.318/1.625)^' +
    '(-1/4) to 4 digits), the cubic-in-prefactor signature. The exact-model no-crossing verdict at 1e300 ' +
    'holds on ALL three stencils (finer ratio 0.730/0.806/0.855, all < 1), margin narrowing with order.',
  probe_dp_band: Object.freeze({ coarser_crossed_last: PROBE_DP_A, finer_crossed_first: PROBE_DP_B }),
  deep_tail_ceiling: '1e300 (imp-34754 numerically-reliable ceiling: exp(p+4*dp) overflows beyond ~1e305)',
  // the three stencils ordered by accuracy 4 < 6 < 8, each with its crossover landmark.
  stencil_4th_7pt: ROW_4,
  stencil_6th_9pt: ROW_6, // reproduces the imp-34754 9-point landmark (~374.6 finer / ~630.1 coarser)
  stencil_8th_11pt: ROW_8,
  // F1: the crossover shift attributable to stencil order alone.
  finer_crossover_spread_decades: FINER_SPREAD_DECADES, // ~33.67
  coarser_crossover_spread_decades: COARSER_SPREAD_DECADES, // ~56.62
  finer_crossover_spread_fraction_of_central: FINER_SPREAD_FRACTION, // ~0.09 (~9% of the 9-point value)
  crossover_earliest_stencil: ROW_8.stencil, // 11-point (largest amplitude -> earliest crossover)
  crossover_latest_stencil: ROW_4.stencil, // 7-point (smallest amplitude -> latest crossover)
  imp34754_9pt_landmark_is_interior: // the 374.6 landmark sits mid-band, not at an edge
    ROW_6.crossover_log10N_finer_0p05 < ROW_4.crossover_log10N_finer_0p05 &&
    ROW_6.crossover_log10N_finer_0p05 > ROW_8.crossover_log10N_finer_0p05,
  // F2: the shift is an exact (W_max/denom)^(-1/4) power law (cubic-in-prefactor signature).
  crossover_ratio_11pt_over_7pt: CROSSOVER_RATIO_11_OVER_7, // ~0.9150
  amplitude_power_law_prediction: AMPLITUDE_POWER_LAW_PREDICTION, // ~0.9150 = (amp_11/amp_7)^(-1/4)
  crossover_shift_is_amplitude_power_law: POWER_LAW_HOLDS, // true -> no independent q-content
  // F3: exact-model no-crossing verdict at 1e300 holds on all three stencils; margin narrows with order.
  no_crossing_1e300_all_stencils: NO_CROSSING_1E300_ALL_STENCILS,
  exact_finer_ratio_1e300_rises_with_order: RATIO_1E300_RISES_WITH_ORDER,
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (NOT rigorous). Sweeps the imp-34754 dp-star probe-band crossover landmark across ' +
    'the three imp-34753 stencils (4th-order 7-point, 6th-order 9-point, 8th-order 11-point) on the ' +
    'identical q(p) = log E_coll footing and the same dp = 0.1/0.05 probe band, each stencil evaluated ' +
    'with its own (W_max, denom). Because dp-star(N) = (W_max*eps*|q|/(denom*|q3|))^(1/3) carries the ' +
    'roundoff amplitude W_max/denom CUBICALLY, the crossover N shifts with stencil choice. (F1) THE ' +
    'FINER-EDGE CROSSOVER SHIFTS ~34 DECADES ACROSS THE THREE ORDERS: log10 N ~ 396.2 (7-point, ' +
    'amplitude 1.625) -> ~374.6 (9-point, 2.033) -> ~362.6 (11-point, 2.318), a spread of ~33.7 decades ' +
    '(~9% of the central value); the coarser dp = 0.1 edge shifts ~56.6 decades (666.4 -> 609.8), and ' +
    'the imp-34754 9-point landmark 374.6 sits in the MIDDLE of the [362.6, 396.2] stencil band. (F2) ' +
    'THE SHIFT IS AN EXACT (W_max/denom)^(-1/4) POWER LAW -- THE CUBIC-IN-PREFACTOR SIGNATURE: since ' +
    'dp-star ~ (W_max/denom)^(1/3) p^(4/3) and the crossover solves dp-star = fixed, the crossover ' +
    'p ~ (W_max/denom)^(-1/4), so larger amplitude gives a larger dp-star that reaches the fixed probe ' +
    'edge SOONER; the measured 11-point/7-point crossover ratio 0.9150 matches (2.318/1.625)^(-1/4) = ' +
    '0.9150 to 4 digits, i.e. the crossover shift is purely the cubic roundoff amplitude re-expressed, ' +
    'with no independent q-content. (F3) THE EXACT-MODEL NO-CROSSING VERDICT AT 1e300 HOLDS ON ALL ' +
    'THREE STENCILS but the margin narrows with order: the exact finer-edge ratio dp-star(1e300)/0.05 ' +
    'is 0.730 (7-point) -> 0.806 (9-point) -> 0.855 (11-point), all still below 1 so no stencil ' +
    'manufactures a sub-1e300 crossing, while the higher-amplitude 11-point sits closest to corruption, ' +
    'consistent with its earlier crossover. q1..q3 are inherited central differences, NOT fresh ' +
    'analytic closed forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 model least ' +
    'trustworthy) is inherited as-is and the crossover N is an asymptotic extrapolation hundreds of ' +
    'decades past the imp-34711-validated 1e100 window that certifies nothing about the true q3; the ' +
    'crossover shift is a property of the inherited model, not an independent physical claim. The -2 ' +
    'asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34754 (the 9-point crossover landmark log10 N ~ 374.6/630.1 being swept); imp-34753 (the three ' +
    'stencils + roundoff amplitudes 1.625/2.033/2.318 across order 4/6/8); imp-34711 (dp-star(N) ~ ' +
    '(W_max*eps/480)^(1/3)(log N)^(4/3) far-tail law); imp-34691 (dp = 0.1/0.05 probe band); ' +
    'imp-2714 (C_C ansatz); imp-486 (C_mb GUE-conditional share).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34773_ASSERTIONS = [
  {
    id: 'imp34773-all-three-stencils-3rd-deriv-normalized',
    holds: () => {
      const check = (s) => {
        let m3 = 0;
        for (const [k, w] of s.terms) m3 += w * k * k * k;
        return Math.abs(m3 / s.denom / 6 - 1) < 1e-12 &&
          s.wMax === Math.max(...s.terms.map(([, w]) => Math.abs(w)));
      };
      return STENCILS_BY_ORDER.every(check) &&
        STENCILS_BY_ORDER.map((s) => s.order).join(',') === '4,6,8';
    },
    why: 'Guards the three inherited q3 stencils: sum w_k k^3 = 6*denom, correct W_max, ordered by accuracy 4 < 6 < 8.',
  },
  {
    id: 'imp34773-9pt-reproduces-imp34754-landmark',
    holds: () =>
      ROW_6.crossover_log10N_finer_0p05 > 373 && ROW_6.crossover_log10N_finer_0p05 < 376 && // ~374.6
      ROW_6.crossover_log10N_coarser_0p1 > 628 && ROW_6.crossover_log10N_coarser_0p1 < 632 && // ~630.1
      Math.abs(ROW_6.exact_finer_ratio_1e300 - 0.806) < 0.01, // imp-34754 finer ratio at 1e300
    why: 'The 9-point row reproduces the imp-34754 crossover landmark (~374.6 finer / ~630.1 coarser) and the ~0.806 finer ratio at 1e300 -- anchors the sweep.',
  },
  {
    id: 'imp34773-crossover-shifts-with-stencil-order',
    holds: () =>
      ROW_4.crossover_log10N_finer_0p05 > ROW_6.crossover_log10N_finer_0p05 && // 7-point latest
      ROW_6.crossover_log10N_finer_0p05 > ROW_8.crossover_log10N_finer_0p05 && // 11-point earliest
      FINER_SPREAD_DECADES > 30 && FINER_SPREAD_DECADES < 40 && // ~33.7 decades
      COARSER_SPREAD_DECADES > 50 && COARSER_SPREAD_DECADES < 65 && // ~56.6 decades
      FINER_SPREAD_FRACTION > 0.07 && FINER_SPREAD_FRACTION < 0.11, // ~9% of the central value
    why: 'F1: the finer-edge crossover shifts ~34 decades (7-point ~396.2 -> 11-point ~362.6) across the three orders; the 9-point landmark sits mid-band.',
  },
  {
    id: 'imp34773-shift-is-amplitude-power-law',
    holds: () =>
      POWER_LAW_HOLDS &&
      Math.abs(CROSSOVER_RATIO_11_OVER_7 - 0.915) < 0.005 && // ~0.9150
      Math.abs(AMPLITUDE_POWER_LAW_PREDICTION - 0.915) < 0.005, // = (2.318/1.625)^(-1/4)
    why: 'F2: the crossover shift is an exact (W_max/denom)^(-1/4) power law (11/7 ratio 0.9150 matches the amplitude prediction) -- the cubic-in-prefactor signature, no independent q-content.',
  },
  {
    id: 'imp34773-no-crossing-1e300-all-stencils-margin-narrows',
    holds: () =>
      NO_CROSSING_1E300_ALL_STENCILS &&
      RATIO_1E300_RISES_WITH_ORDER &&
      ROW_4.exact_finer_ratio_1e300 > 0.7 && ROW_4.exact_finer_ratio_1e300 < 0.76 && // ~0.730 (7-point)
      ROW_8.exact_finer_ratio_1e300 > 0.83 && ROW_8.exact_finer_ratio_1e300 < 0.88, // ~0.855 (11-point)
    why: 'F3: the exact no-crossing verdict at 1e300 holds on all three stencils (finer ratio 0.730/0.806/0.855 < 1) with the margin narrowing as amplitude/order rises.',
  },
  {
    id: 'imp34773-honesty-gate-no-qed',
    holds: () =>
      IMP34773_CROSSOVER_N_STENCIL_ORDER_SPREAD.isRigorous === false &&
      /NO QED/.test(IMP34773_CROSSOVER_N_STENCIL_ORDER_SPREAD.verdict) &&
      /refereed bound is changed/i.test(IMP34773_CROSSOVER_N_STENCIL_ORDER_SPREAD.verdict) &&
      /UNTOUCHED/.test(IMP34773_CROSSOVER_N_STENCIL_ORDER_SPREAD.verdict) &&
      /extrapolation/.test(IMP34773_CROSSOVER_N_STENCIL_ORDER_SPREAD.verdict),
    why: 'Honesty gate: measurement only, crossover is an extrapolation, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34773_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34773-crossover-N-stencil-order-spread assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34773_CROSSOVER_N_STENCIL_ORDER_SPREAD;
