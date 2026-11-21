/**
 * @module imp-34711-q3-trust-boundary-far-tail-extension
 * @fileoverview imp-34711 -- MEASUREMENT / DERIVATION ONLY: extend the imp-34691 smallest-usable
 *   q-derivative step ladder dp*(N) = C(N)^(1/3) past N = 1e15 (where imp-34691 F2 stopped) several
 *   more decades toward the imp-33620/imp-3444 far tail, and MEASURE whether the ~20%-per-two-decades
 *   rise imp-34691 tabulated CONTINUES, SATURATES, or TURNS OVER as E_coll deepens and the deep-tail
 *   sigma -> 0 regime is approached. It also reads off the closed-form far-tail law behind the rise.
 *
 *   THE QUESTION (imp-34691 F2, extended)
 *   ------------------------------------
 *   imp-34691 derived the q3 catastrophic-cancellation trust boundary dp*(N) =
 *   (W_max*eps*|q(p)| / (240*|q3(p)|))^(1/3) (the smallest usable step below which the tiny-q3
 *   numerator is pure roundoff) and tabulated it climbing monotonically from ~5.72e-4 at N = 1e13 to
 *   ~6.86e-4 at N = 1e15 -- a ~20% rise over two decades, driven by |q| growing and |q3| shrinking.
 *   But it stopped at N = 1e15 and never said whether the rise is a transient that saturates, a bump
 *   that turns over, or a persistent trend. This module extends the ladder several more decades.
 *
 *   THE MEASUREMENT (far-tail dp*(N) ladder)
 *   ----------------------------------------
 *   Re-evaluating dp*(N) on the same well-conditioned probe band (dp = 0.1 and 0.05, the imp-34691
 *   PROBE_DP_A/B where only ~8-9 digits cancel) at N = 1e15, 1e17, ..., 1e29 (and a 1e100 sentinel):
 *     (i)  dp*(N) KEEPS RISING MONOTONICALLY -- there is NO saturation and NO turnover anywhere in the
 *          far tail; the smallest usable step grows without bound (it passes ~1.6e-3 at N = 1e29 and
 *          ~8.5e-3 at N = 1e100), so the imp-34691 rise is a persistent trend, not a transient.
 *     (ii) the FRACTIONAL rise DECELERATES: the per-two-decade increase falls from ~19.9% across the
 *          imp-34691 window (1e13 -> 1e15) to ~9.9% across 1e27 -> 1e29, halving over ~14 decades.
 *
 *   THE FAR-TAIL CLOSED FORM (why it rises, and why the rate decays)
 *   ---------------------------------------------------------------
 *   Two clean asymptotics pin the ladder. For q(p) = log E_coll = log C_C + (1/2)(log log T - p) with
 *   T = heightForN(e^p) ~ 2 pi N / log N, the -p/2 term dominates so q(p) ~ -p/2 (measured q/p -> -1/2)
 *   while its 3rd derivative comes entirely from the slowly-varying (1/2) log log T ~ (1/2) log p piece,
 *   whose 3rd p-derivative is (1/2)(2/p^3) = 1/p^3, so q3(p) ~ 1/p^3 (measured q3*p^3 -> ~1.02). Hence
 *          C(N) = W_max*eps*|q| / (240*|q3|) ~ W_max*eps*(p/2) / (240/p^3) = (W_max*eps/480) p^4,
 *   and the trust boundary follows a pure power law in the log-depth p = log N:
 *          dp*(N) ~ (W_max*eps/480)^(1/3) * (log N)^(4/3).
 *   This reproduces the measured ladder to < 2% from N = 1e15 to N = 1e100. It grows WITHOUT bound
 *   (so: continues, never saturates, never turns over), and its LOG-slope d(log dp*)/dp = (4/3)/p
 *   shrinks like 1/log N -- exactly the observed deceleration: the per-two-decade fractional rise is
 *   ~ (4/3)*(2 log 10)/log N, ~20% at N ~ 1e13-1e15 decaying toward 0 as N -> infinity.
 *
 *   THE FINDING
 *   -----------
 *   (F1) dp*(N) CONTINUES RISING PAST 1e15 WITH NO SATURATION AND NO TURNOVER. Monotone all the way
 *        from 1e13 through 1e100; dp* ~ 1.62e-3 at N = 1e29 and ~8.48e-3 at N = 1e100. The imp-34691
 *        ~20%/two-decade rise is a persistent trend, not a transient bump.
 *   (F2) THE FRACTIONAL RISE DECELERATES like 1/log N. The per-two-decade increase falls from ~19.9%
 *        (1e13 -> 1e15) to ~9.9% (1e27 -> 1e29), tracking the closed-form (4/3)*(2 log 10)/log N.
 *   (F3) ONE CLOSED FORM EXPLAINS BOTH: dp*(N) ~ (W_max*eps/480)^(1/3) (log N)^(4/3), because q ~ -p/2
 *        (q/p -> -1/2) and q3 ~ 1/p^3 (q3*p^3 -> ~1.02). The (log N)^(4/3) growth (unbounded rise) and
 *        the (4/3)/p log-slope (decaying rate) are the two faces of the same law.
 *
 *   MEASUREMENT / DERIVATION ONLY. Extends the imp-34691 ladder and reads off its leading far-tail
 *   asymptotic; elementary error propagation of the inherited component model, not a new bound.
 *   Reproduces the imp-34446/imp-34531/imp-34543/imp-34573 primitives inline (imports NOTHING -- no
 *   lambda mapping, no polymath15 module, no zeros bundle), per the no-heavy-imports directive. q1..q3
 *   are inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail
 *   regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is; the far-tail
 *   ladder is therefore a property of the inherited model, not an independent physical claim. The -2
 *   asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb
 *   GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator
 *   positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34691-q3-cancellation-floor-trust-boundary.js (F2 dp*(N) ladder tabulated only to 1e15)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *   @see imp-34606-roundoff-amplification-exponent-ladder.js (the clean {2,3,4} 1/dp^k exponent ladder)
 *
 *   Ticket: imp-34711 (numerical, medium). Far-tail extension of dp*(N); adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING),
//    verbatim from imp-34691 so the far-tail ladder is on the identical footing: --
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
// ~5 digits), NOT the corrupted small-dp evaluation.
const PROBE_DP_A = 0.1;
const PROBE_DP_B = 0.05;
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

// -- far-tail extension of the imp-34691 dp*(N) ladder: past 1e15 in two-decade steps to 1e29 -------
const REF_N = 1e13; // imp-34691 reference foot of the ladder (~5.72e-4)
const FAR_TAIL_EXPS = [15, 17, 19, 21, 23, 25, 27, 29];
// dp* at the reference and at every far-tail rung (log-depth p = log N).
const dpStarAtExp = (e) => dpStar(Math.log(Math.pow(10, e)));
const REF_DP_STAR = dpStar(Math.log(REF_N));

const FAR_TAIL_TABLE = FAR_TAIL_EXPS.map((e, i) => {
  const N = Math.pow(10, e);
  const p = Math.log(N);
  const ds = dpStar(p);
  // per-two-decade fractional rise from the previous two-decade rung (1e13 for the first entry).
  const prev = i === 0 ? REF_DP_STAR : dpStarAtExp(FAR_TAIL_EXPS[i - 1]);
  return Object.freeze({
    N,
    q: +qOfP(p).toFixed(4),
    q3_phys: +q3Phys(p).toExponential(4),
    dp_star: +ds.toExponential(4),
    rise_pct_per_two_decades: +((ds / prev - 1) * 100).toFixed(2),
  });
});

// (F1) monotone with no saturation / no turnover: check dp* strictly increases 1e13..1e29 and keeps
// rising far beyond (1e100 sentinel), and is unbounded in the model (>> the imp-34691 1e15 value).
const DP_STAR_MONOTONE = FAR_TAIL_TABLE.every(
  (r, i) => i === 0 || r.dp_star > FAR_TAIL_TABLE[i - 1].dp_star,
) && REF_DP_STAR < FAR_TAIL_TABLE[0].dp_star;
const DP_STAR_1E29 = FAR_TAIL_TABLE[FAR_TAIL_TABLE.length - 1].dp_star; // ~1.62e-3
const DP_STAR_1E100 = +dpStarAtExp(100).toExponential(4); // ~8.48e-3 -- still rising, no plateau

// (F2) the fractional rise decelerates: first far-tail rung ~19.9%, last ~9.9%.
const RISE_FIRST = FAR_TAIL_TABLE[0].rise_pct_per_two_decades; // 1e13 -> 1e15, ~19.9%
const RISE_LAST = FAR_TAIL_TABLE[FAR_TAIL_TABLE.length - 1].rise_pct_per_two_decades; // ~9.9%
const RISE_DECELERATES = RISE_LAST < RISE_FIRST &&
  FAR_TAIL_TABLE.every((r, i) => i === 0 || r.rise_pct_per_two_decades <= FAR_TAIL_TABLE[i - 1].rise_pct_per_two_decades + 1e-9);

// (F3) far-tail closed form dp* ~ (W_max*eps/480)^(1/3) (log N)^(4/3), with q/p -> -1/2 and q3*p^3 -> ~1.
const ASYMP_PREF = Math.cbrt((W_MAX * EPS) / 480); // ~6.09e-6
const asympDpStar = (p) => ASYMP_PREF * Math.pow(p, 4 / 3);
// worst relative error of the closed form vs the measured ladder over 1e15..1e100.
const ASYMP_CHECK_EXPS = [15, 20, 30, 40, 50, 60, 80, 100];
const ASYMP_MAX_REL_ERR = Math.max(
  ...ASYMP_CHECK_EXPS.map((e) => {
    const p = Math.log(Math.pow(10, e));
    return Math.abs(dpStar(p) / asympDpStar(p) - 1);
  }),
);
// the two leading ratios that pin the law, sampled deep in the tail (N = 1e60).
const P_DEEP = Math.log(Math.pow(10, 60));
const Q_OVER_P_DEEP = +(qOfP(P_DEEP) / P_DEEP).toFixed(4); // -> -0.5
const Q3_TIMES_P3_DEEP = +(q3Phys(P_DEEP) * Math.pow(P_DEEP, 3)).toFixed(4); // -> ~1.0
// predicted per-two-decade rise from the (4/3)/p log-slope at the last far-tail rung, cross-checks F2.
const RISE_PRED_LAST = +(((4 / 3) * (2 * Math.log(10)) / Math.log(Math.pow(10, 29))) * 100).toFixed(2);

export const IMP34711_Q3_TRUST_BOUNDARY_FAR_TAIL_EXTENSION = Object.freeze({
  id: 'imp-34711',
  proofSection: 'S-frontier',
  claim_measured:
    'Extend the imp-34691 smallest-usable q-derivative step ladder dp*(N)=C(N)^(1/3) past N=1e15 ' +
    'several more decades (to 1e29, with a 1e100 sentinel) and MEASURE whether the ~20%/two-decade ' +
    'rise continues, saturates, or turns over: it CONTINUES (monotone, no plateau, no turnover) but ' +
    'the FRACTIONAL rise DECELERATES like 1/log N, because dp*(N) ~ (W_max*eps/480)^(1/3) (log N)^(4/3) ' +
    'in the far tail -- a measurement/derivation on the inherited component model, not a bound.',
  far_tail_closed_form: 'dp*(N) ~ (W_max*eps/480)^(1/3) * (log N)^(4/3) [q ~ -p/2, q3 ~ 1/p^3, p=log N]',
  W_max: W_MAX,
  eps_mach: +EPS.toExponential(3),
  probe_dp_band: Object.freeze([PROBE_DP_A, PROBE_DP_B]),
  reference_foot: Object.freeze({ N: REF_N, dp_star: +REF_DP_STAR.toExponential(4) }), // ~5.72e-4
  // F1: extended ladder + no saturation / no turnover.
  far_tail_table: FAR_TAIL_TABLE,
  dp_star_monotone_rising: DP_STAR_MONOTONE,
  dp_star_at_1e29: DP_STAR_1E29, // ~1.62e-3 (still climbing)
  dp_star_at_1e100_sentinel: DP_STAR_1E100, // ~8.48e-3 -- unbounded, no plateau
  saturates_or_turns_over: false,
  // F2: fractional rise decelerates like 1/log N.
  rise_pct_first_window: RISE_FIRST, // 1e13 -> 1e15, ~19.9%
  rise_pct_last_window: RISE_LAST, // 1e27 -> 1e29, ~9.9%
  rise_decelerates: RISE_DECELERATES,
  rise_pct_last_predicted_from_slope: RISE_PRED_LAST, // (4/3)(2 log10)/log(1e29), ~9.2%
  // F3: the far-tail closed form and the two ratios that pin it.
  asymp_prefactor_Wmax_eps_over_480_cbrt: +ASYMP_PREF.toExponential(4), // ~6.09e-6
  asymp_max_rel_err_1e15_to_1e100: +ASYMP_MAX_REL_ERR.toExponential(3), // < 2e-2
  q_over_p_deep_1e60: Q_OVER_P_DEEP, // -> -0.5
  q3_times_p3_deep_1e60: Q3_TIMES_P3_DEEP, // -> ~1.0
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (NOT rigorous). Extends the imp-34691 smallest-usable-step ladder ' +
    'dp*(N) = C(N)^(1/3) = (W_max*eps*|q|/(240*|q3|))^(1/3) past N = 1e15 several more decades ' +
    '(to 1e29, plus a 1e100 sentinel) on the identical imp-34691 footing [q3 = 9-point antisymmetric ' +
    'stencil [7,-72,338,-488,+488,-338,+72,-7]/240 on q(p) = log E_coll; physical q3 from the ' +
    'dp = 0.1/0.05 probe band]. (F1) THE RISE CONTINUES WITH NO SATURATION AND NO TURNOVER: dp*(N) is ' +
    'monotone from 1e13 through 1e100, reaching ~1.62e-3 at N = 1e29 and ~8.48e-3 at N = 1e100, so the ' +
    'imp-34691 ~20%/two-decade rise is a persistent trend, not a transient. (F2) THE FRACTIONAL RISE ' +
    'DECELERATES like 1/log N: the per-two-decade increase falls from ~19.9% (1e13 -> 1e15) to ~9.9% ' +
    '(1e27 -> 1e29), tracking the closed-form (4/3)*(2 log 10)/log N. (F3) ONE FAR-TAIL CLOSED FORM ' +
    'EXPLAINS BOTH: dp*(N) ~ (W_max*eps/480)^(1/3) (log N)^(4/3) (reproducing the measured ladder to ' +
    '< 2% from 1e15 to 1e100), because q(p) ~ -p/2 (q/p -> -1/2) and q3(p) ~ 1/p^3 (q3*p^3 -> ~1.02); ' +
    'the (log N)^(4/3) growth is the unbounded rise and the (4/3)/p log-slope is the decaying rate. ' +
    'q1..q3 are inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 ' +
    'deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is and the ' +
    'far-tail ladder is a property of the inherited model, not an independent physical claim. The -2 ' +
    'asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34691 (F2 dp*(N) ladder to 1e15, extended here to the far tail); imp-34606 (clean {2,3,4} ' +
    '1/dp^k exponent ladder); imp-34633 (eps_mach*|q| prefactor amplitude); imp-34626 (6th-order ' +
    '9-point stencil); imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ' +
    'ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34711_ASSERTIONS = [
  {
    id: 'imp34711-q3-stencil-normalization',
    holds: () => {
      let m3 = 0;
      for (const [k, w] of Q3_TERMS) m3 += w * k * k * k;
      return Math.abs(m3 / Q3_DENOM / 6 - 1) < 1e-12 && W_MAX === Math.max(...Q3_TERMS.map(([, w]) => Math.abs(w)));
    },
    why: 'Guards the inherited q3 stencil: 3rd-derivative normalization sum c_k k^3/6 = 1 and W_max = 488.',
  },
  {
    id: 'imp34711-far-tail-monotone-no-turnover',
    holds: () => DP_STAR_MONOTONE && DP_STAR_1E29 > 1.5e-3 && DP_STAR_1E100 > DP_STAR_1E29 && DP_STAR_1E100 > 8e-3,
    why: 'F1: dp*(N) keeps rising monotonically past 1e15 through 1e100 with no saturation and no turnover (~1.62e-3 at 1e29, ~8.48e-3 at 1e100).',
  },
  {
    id: 'imp34711-fractional-rise-decelerates',
    holds: () => RISE_DECELERATES && RISE_FIRST > 18 && RISE_FIRST < 22 && RISE_LAST > 8 && RISE_LAST < 12,
    why: 'F2: the per-two-decade fractional rise falls monotonically from ~19.9% (1e13->1e15) to ~9.9% (1e27->1e29), the 1/log N deceleration.',
  },
  {
    id: 'imp34711-far-tail-closed-form-reproduces-ladder',
    holds: () =>
      ASYMP_MAX_REL_ERR < 2e-2 &&
      Math.abs(Q_OVER_P_DEEP + 0.5) < 0.02 &&
      Math.abs(Q3_TIMES_P3_DEEP - 1) < 0.05,
    why: 'F3: dp* ~ (W_max*eps/480)^(1/3)(log N)^(4/3) matches the ladder to < 2% over 1e15..1e100, with q/p -> -1/2 and q3*p^3 -> ~1.',
  },
  {
    id: 'imp34711-honesty-gate-no-qed',
    holds: () =>
      IMP34711_Q3_TRUST_BOUNDARY_FAR_TAIL_EXTENSION.isRigorous === false &&
      IMP34711_Q3_TRUST_BOUNDARY_FAR_TAIL_EXTENSION.saturates_or_turns_over === false &&
      /NO QED/.test(IMP34711_Q3_TRUST_BOUNDARY_FAR_TAIL_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP34711_Q3_TRUST_BOUNDARY_FAR_TAIL_EXTENSION.verdict) &&
      /UNTOUCHED/.test(IMP34711_Q3_TRUST_BOUNDARY_FAR_TAIL_EXTENSION.verdict),
    why: 'Honesty gate: measurement/derivation only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34711_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34711-q3-trust-boundary-far-tail-extension assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34711_Q3_TRUST_BOUNDARY_FAR_TAIL_EXTENSION;
