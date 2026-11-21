/**
 * @module imp-34772-dp-star-loglog-correction
 * @fileoverview imp-34772 -- DERIVATION / MEASUREMENT ONLY: derive the next-order (log log N / log N)
 *   correction to the imp-34754 dp-star(N) ~ (W_max*eps/480)^(1/3)(log N)^(4/3) closed-form asymptote, and
 *   test whether it accounts for the ~7.7% exact-vs-asymptote excess imp-34754 F3 reported at N = 1e300.
 *
 *   THE QUESTION
 *   -----------
 *   imp-34754 F3 found that the EXACT-model smallest-usable step dp-star(N) = (W_max*eps*|q|/(240*|q3|))^(1/3)
 *   runs ABOVE the imp-34735 closed-form asymptote dp-star ~ (W_max*eps/480)^(1/3)(log N)^(4/3) by a growing
 *   margin, reaching ~7.7% at 1e300, and concluded the finer-edge crossover therefore sits EARLIER than the
 *   closed-form log10 N ~ 374.6 extrapolation. imp-34754 itself flagged that the exact ratio "loses
 *   monotonicity by ~1e305" -- a warning that the deep-tail q3 was becoming numerically unreliable. This
 *   module derives the genuine leading sub-asymptotic correction analytically and asks: does a
 *   (log log N)/(log N) term account for that ~7.7% excess, or is the excess something else?
 *
 *   THE DERIVATION (closed-form q3, NO finite differencing)
 *   ------------------------------------------------------
 *   Write q(p) = log E_coll in p = log N. With E_coll = C_C sqrt(log T / N) and T = height(N),
 *   q(p) = log C_C + (1/2) log(u) - p/2, where u = log T. The RvM main term N = (T/2pi)(log(T/2pi) - 1)
 *   gives, with w = log(T/2pi), the clean chain p = w + log(w-1), u = w + log(2pi), so
 *     w'(p) = (w-1)/w,  w''(p) = (w-1)/w^3,  w'''(p) = (w-1)(3-2w)/w^5.
 *   The third derivative q3 = (1/2) L''' with L = log(u) follows in CLOSED FORM
 *     L''' = u'''/u - 3 u'' u'/u^2 + 2 (u')^3/u^3   (u = w + log 2pi, u^(k) = w^(k)),
 *   so q3 needs NO finite difference at all. Feeding q and q3 into dp-star and dividing by the asymptote,
 *   R(N) = dp-star_exact / dp-star_asymptote decomposes as R^3 = A * B with
 *     A = 2|q|/p = 1 - (log u + 2 log C_C)/p        (the |q| = |log E_coll| prefactor channel), and
 *     B = 1/(p^3 |q3|) -> 1                          (the q3 third-derivative channel, since q3*p^3 -> 1).
 *   Both channels contribute a NEGATIVE (log log N)/(log N) term (log u ~ log w ~ log p = log log N), giving
 *     R(N) = 1 - c * (log log N)/(log N) + o(1/log N),  c -> 1,
 *   so the exact dp-star runs BELOW the asymptote, not above.
 *
 *   THE FINDING
 *   -----------
 *   (F1) THE GENUINE SUB-ASYMPTOTIC CORRECTION IS A NEGATIVE (log log N)/(log N) TERM, COEFFICIENT c -> 1.
 *        Computed with the closed-form q3 (no differencing), R(N) = dp-star_exact/asymptote stays BELOW 1
 *        across 1e100..1e300 (R ~ 0.988 at 1e100 -> ~0.994 at 1e300) and the normalized deviation
 *        (R-1)/((log p)/p) climbs monotonically toward -1 (-0.53 at 1e100, -0.98 by 1e100000). So the exact
 *        step sits slightly UNDER the closed-form asymptote and approaches it from below like -log log N/log N.
 *   (F2) THE ~7.7% "EXCESS" OF imp-34754 F3 IS A FINITE-DIFFERENCE ROUNDOFF ARTIFACT, NOT A MODEL CORRECTION.
 *        The imp-34754 exact ladder built q3 from the fixed dp = 0.1/0.05 probe-band 9-point stencil; in the
 *        deep tail that differencing of q ~ -p/2 values loses ~11 of 16 digits to cancellation. The closed-form
 *        q3 AGREES with the probe-band q3 to ~1e-5 relative where the difference is trustworthy (N <= ~1e50),
 *        then the probe-band q3*p^3 COLLAPSES from ~1.02 to ~0.76 by 1e300 while the closed-form q3*p^3 stays
 *        ~1.01 -> exactly the "loses monotonicity by ~1e305" the ladder flagged. The apparent +7.7% is that
 *        shrinking (roundoff-deflated) q3 in the denominator, not a genuine sub-asymptotic term.
 *   (F3) CORRECTING THE ARTIFACT MOVES THE CROSSOVER LATER, NOT EARLIER. Because the true correction is
 *        NEGATIVE, dp-star_exact reaches the finer 0.05 probe edge at a LARGER N than the leading asymptote:
 *        solving the closed-form dp-star = 0.05 gives log10 N ~ 376.2 vs the asymptote-only ~374.6 (coarser
 *        0.1 edge: ~631.8 vs ~630.1), a shift of ~+1.5 decades LATER -- the OPPOSITE direction to the
 *        imp-34754 F3 artifact-driven "earlier." The ~1e375 landmark is a mild UNDER-estimate of the true
 *        crossover, still hundreds of decades past the imp-34711-validated 1e100 window.
 *
 *   DERIVATION / MEASUREMENT ONLY. A closed-form third-derivative of the inherited log-E_coll model plus a
 *   deep-tail sub-asymptotic expansion; NOT a new bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34573
 *   primitives inline (imports NOTHING -- no lambda mapping, no polymath15 module, no zeros bundle), per the
 *   no-heavy-imports directive. q1..q3 are properties of the inherited component model (imp-3220/imp-3406
 *   least trustworthy as sigma -> 1); the correction is a property of that model, not an independent physical
 *   claim, and the crossover N remains an asymptotic extrapolation hundreds of decades past the 1e100 window
 *   that certifies NOTHING about the true q3. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8)
 *   ansatz are UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched;
 *   changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34754-dp-star-probe-band-ratio-deep-tail.js (F3 reported the ~7.7% excess this module explains)
 *   @see imp-34735-dp-star-probe-band-crossover-N.js (exact ratio ladder to 1e100 + closed-form crossover)
 *   @see imp-34711-q3-trust-boundary-far-tail-extension.js (dp-star(N) ~ (log N)^(4/3), 1e13..1e100)
 *
 *   Ticket: imp-34772 (numerical, medium). Sub-asymptotic loglog/log correction + artifact diagnosis; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING),
//    verbatim from imp-34754 so the correction is on the identical footing: --
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
const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N (finite-difference input)

// imp-34626/imp-34673 6th-order 9-point antisymmetric q3 numerator stencil (verbatim). Probe-band q3 is
// (sum w_k q(p + k dp)) / (240 dp^3); W_MAX = 488 is the largest weight magnitude in the amplitude.
const Q3_TERMS = [[4, 7], [3, -72], [2, 338], [1, -488], [-1, 488], [-2, -338], [-3, 72], [-4, -7]];
const Q3_DENOM = 240;
const W_MAX = 488;
const PROBE_DP_A = 0.1; // coarser probe step (crossed last)
const PROBE_DP_B = 0.05; // finer probe step (crossed first)

function q3Num(p, dp) {
  let s = 0;
  for (const [k, w] of Q3_TERMS) s += w * qOfP(p + k * dp);
  return s;
}
// imp-34754 probe-band q3 (the finite-difference route that goes roundoff-noisy in the deep tail).
function q3PhysFD(p) {
  const a = q3Num(p, PROBE_DP_A) / (Q3_DENOM * Math.pow(PROBE_DP_A, 3));
  const b = q3Num(p, PROBE_DP_B) / (Q3_DENOM * Math.pow(PROBE_DP_B, 3));
  return (a + b) / 2;
}

// -- THE NEW TOOL: closed-form q(p) and q3(p) via the RvM w-chain, needing NO finite difference. --
// w = log(T/2pi) solves p = w + log(w-1); u = log T = w + log(2pi). Smooth, O(p), no cancellation.
function wOfP(p) {
  let w = p;
  for (let i = 0; i < 200; i++) {
    const f = w + Math.log(w - 1) - p;
    const fp = 1 + 1 / (w - 1);
    const dw = f / fp;
    w -= dw;
    if (Math.abs(dw) < 1e-15 * w) break;
  }
  return w;
}
function qClosed(p) {
  const w = wOfP(p);
  const u = w + Math.log(TWO_PI);
  return Math.log(C_C) + 0.5 * Math.log(u) - p / 2; // q(p) = log C_C + (1/2) log(log T) - p/2
}
// q3 = (1/2) L''' with L = log(u), u = w + log 2pi, and w-chain derivatives w'=(w-1)/w, w''=(w-1)/w^3,
// w'''=(w-1)(3-2w)/w^5. L''' = u'''/u - 3 u'' u'/u^2 + 2 (u')^3/u^3.
function q3Closed(p) {
  const w = wOfP(p);
  const u = w + Math.log(TWO_PI);
  const wp = (w - 1) / w;
  const wpp = (w - 1) / Math.pow(w, 3);
  const wppp = ((w - 1) * (3 - 2 * w)) / Math.pow(w, 5);
  const Lppp = wppp / u - (3 * wpp * wp) / (u * u) + (2 * Math.pow(wp, 3)) / Math.pow(u, 3);
  return 0.5 * Lppp;
}

// dp-star from the CLOSED-FORM q,q3 (the artifact-free exact-model step) and from the leading asymptote.
function dpStarClosed(p) {
  return Math.cbrt((W_MAX * EPS * Math.abs(qClosed(p))) / (Q3_DENOM * Math.abs(q3Closed(p))));
}
const ASYMP_PREF = Math.cbrt((W_MAX * EPS) / 480); // ~6.09e-6 (imp-34711/imp-34735 leading prefactor)
const dpStarAsymp = (p) => ASYMP_PREF * Math.pow(p, 4 / 3);

// (F1) closed-form correction ladder 1e100..1e300: R = dp-star_closed/asymptote stays BELOW 1 and
//   (R-1)/((log p)/p) climbs toward -1 -- the genuine negative (log log N)/(log N) sub-asymptotic term.
const LADDER_EXPS = [100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
const CORRECTION_TABLE = LADDER_EXPS.map((e) => {
  const p = Math.log(Math.pow(10, e));
  const R = dpStarClosed(p) / dpStarAsymp(p);
  const q3ClP3 = q3Closed(p) * Math.pow(p, 3); // -> 1 (closed-form third derivative stays well-behaved)
  const q3FdP3 = q3PhysFD(p) * Math.pow(p, 3); // COLLAPSES in the deep tail (roundoff artifact)
  return Object.freeze({
    N: `1e${e}`,
    R_exact_over_asymptote: +R.toFixed(5), // < 1: exact runs BELOW asymptote (opposite to imp-34754 F3)
    norm_dev_over_loglogN_over_logN: +((R - 1) / (Math.log(p) / p)).toFixed(4), // -> -1 (coefficient c)
    q3_closed_times_p3: +q3ClP3.toFixed(4), // ~1.01, stays put
    q3_probeband_times_p3: +q3FdP3.toFixed(4), // ~1.02 -> ~0.76: the finite-difference collapse
  });
});

const R_1E100 = CORRECTION_TABLE[0].R_exact_over_asymptote; // ~0.988
const R_1E300 = CORRECTION_TABLE[CORRECTION_TABLE.length - 1].R_exact_over_asymptote; // ~0.994
const R_ALL_BELOW_ONE = CORRECTION_TABLE.every((r) => r.R_exact_over_asymptote < 1); // F1: exact below asymptote
// coefficient c of the -(log log N)/(log N) term, sampled deep (1e100000) where the slow approach settles.
const P_DEEP = Math.log(10) * 100000;
const C_COEFF_DEEP = +(-(dpStarClosed(P_DEEP) / dpStarAsymp(P_DEEP) - 1) / (Math.log(P_DEEP) / P_DEEP)).toFixed(3); // ~0.98 -> 1

// (F2) the ~7.7% excess is a probe-band roundoff artifact: closed-form q3 agrees with the trustworthy
//   probe-band q3 to ~1e-5 at moderate N, then the probe-band q3*p^3 collapses while the closed form holds.
const VALIDATION_EXPS = [15, 20, 30, 50];
const Q3_VALIDATION = VALIDATION_EXPS.map((e) => {
  const p = Math.log(10) * e;
  const fd = q3PhysFD(p);
  const cl = q3Closed(p);
  return Object.freeze({ N: `1e${e}`, rel_diff_fd_vs_closed: +((fd - cl) / cl).toExponential(2) });
});
const CLOSED_MATCHES_FD_MODERATE = Q3_VALIDATION.every((v) => Math.abs(v.rel_diff_fd_vs_closed) < 1e-3);
const Q3FD_P3_1E300 = CORRECTION_TABLE[CORRECTION_TABLE.length - 1].q3_probeband_times_p3; // ~0.76 (collapsed)
const Q3CL_P3_1E300 = CORRECTION_TABLE[CORRECTION_TABLE.length - 1].q3_closed_times_p3; // ~1.01 (intact)
const EXCESS_IS_ROUNDOFF_ARTIFACT = Q3FD_P3_1E300 < 0.85 && Q3CL_P3_1E300 > 0.95; // probe-band collapsed, closed intact

// (F3) correcting the artifact moves the crossover LATER: solve the closed-form dp-star = probe edge.
function solveCross(fn, target) {
  let lo = 100, hi = 5000;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (fn(mid) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const LOG10 = Math.log(10);
const CROSS_FINER_ASYMP = +(solveCross(dpStarAsymp, PROBE_DP_B) / LOG10).toFixed(2); // ~374.63 (imp-34754)
const CROSS_FINER_CORRECTED = +(solveCross(dpStarClosed, PROBE_DP_B) / LOG10).toFixed(2); // ~376.16 (LATER)
const CROSS_COARSER_ASYMP = +(solveCross(dpStarAsymp, PROBE_DP_A) / LOG10).toFixed(2); // ~630.06
const CROSS_COARSER_CORRECTED = +(solveCross(dpStarClosed, PROBE_DP_A) / LOG10).toFixed(2); // ~631.81
const CROSS_SHIFT_FINER_DECADES = +(CROSS_FINER_CORRECTED - CROSS_FINER_ASYMP).toFixed(2); // ~+1.53 (LATER)
const CROSSOVER_MOVES_LATER = CROSS_SHIFT_FINER_DECADES > 0; // F3: opposite direction to imp-34754 F3

export const IMP34772_DP_STAR_LOGLOG_CORRECTION = Object.freeze({
  id: 'imp-34772',
  proofSection: 'S-frontier',
  claim_measured:
    'Derive the next-order (log log N)/(log N) correction to the imp-34754 dp-star(N) ~ ' +
    '(W_max*eps/480)^(1/3)(log N)^(4/3) asymptote and test whether it accounts for the ~7.7% exact-vs-' +
    'asymptote excess imp-34754 F3 reported at 1e300. RESULT: the genuine correction, obtained from a ' +
    'CLOSED-FORM q3 via the RvM w-chain (no finite differencing), is NEGATIVE -- ' +
    'R(N) = dp-star_exact/asymptote = 1 - c (log log N)/(log N) + o(1/log N) with c -> 1 -- so the exact ' +
    'step runs slightly BELOW the asymptote (R ~ 0.988 at 1e100 -> ~0.994 at 1e300), NOT ~7.7% above. The ' +
    'imp-34754 +7.7% is a finite-difference ROUNDOFF ARTIFACT: the closed-form q3 matches the dp=0.1/0.05 ' +
    'probe-band q3 to ~1e-5 at N <= ~1e50, then the probe-band q3*p^3 collapses from ~1.02 to ~0.76 by ' +
    '1e300 (deflating the denominator) while the closed-form q3*p^3 stays ~1.01. Correcting the artifact ' +
    'moves the finer-edge crossover LATER (log10 N ~ 376.2 vs ~374.6), the OPPOSITE direction to imp-34754 ' +
    'F3: a derivation/measurement, not a bound.',
  // (F1) the genuine negative loglog/log correction (closed-form q3 ladder)
  correction_form: 'dp-star(N) = (W_max*eps/480)^(1/3)(log N)^(4/3) [1 - c (log log N)/(log N) + o(1/log N)], c -> 1',
  correction_ladder: CORRECTION_TABLE,
  R_exact_over_asymptote_1e100: R_1E100, // ~0.988
  R_exact_over_asymptote_1e300: R_1E300, // ~0.994
  exact_runs_below_asymptote: R_ALL_BELOW_ONE, // F1: R < 1 everywhere (correction is negative)
  loglog_over_log_coefficient_c: C_COEFF_DEEP, // ~0.98 -> 1 (leading coefficient of the -loglogN/logN term)
  // (F2) the imp-34754 ~7.7% excess is a probe-band finite-difference roundoff artifact
  q3_closed_vs_probeband_moderate_N: Q3_VALIDATION, // rel diff ~1e-5 where the difference is trustworthy
  closed_form_q3_validated_against_fd: CLOSED_MATCHES_FD_MODERATE,
  q3_probeband_times_p3_1e300: Q3FD_P3_1E300, // ~0.76 (collapsed by cancellation)
  q3_closed_times_p3_1e300: Q3CL_P3_1E300, // ~1.01 (intact)
  imp34754_excess_is_roundoff_artifact: EXCESS_IS_ROUNDOFF_ARTIFACT, // F2
  imp34754_reported_excess_1e300: '~7.7% (exact_over_asymptote ~1.077) -- artifact of the deflated probe-band q3',
  // (F3) correcting the artifact moves the crossover LATER, not earlier
  crossover_finer_asymptote_log10N: CROSS_FINER_ASYMP, // ~374.63 (imp-34754 leading-order landmark)
  crossover_finer_corrected_log10N: CROSS_FINER_CORRECTED, // ~376.16 (LATER, closed-form dp-star = 0.05)
  crossover_coarser_asymptote_log10N: CROSS_COARSER_ASYMP, // ~630.06
  crossover_coarser_corrected_log10N: CROSS_COARSER_CORRECTED, // ~631.81
  crossover_shift_finer_decades: CROSS_SHIFT_FINER_DECADES, // ~+1.53 decades LATER
  crossover_moves_later_not_earlier: CROSSOVER_MOVES_LATER, // F3: opposite to imp-34754 F3 direction
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (NOT rigorous). Derives the next-order sub-asymptotic correction to the ' +
    'imp-34754 dp-star(N) ~ (W_max*eps/480)^(1/3)(log N)^(4/3) closed-form asymptote using a CLOSED-FORM ' +
    'q3 built from the RvM w-chain (w = log(T/2pi) solving p = w + log(w-1); u = log T = w + log 2pi; ' +
    'q3 = (1/2)(log u)\'\'\' with w\' = (w-1)/w, w\'\' = (w-1)/w^3, w\'\'\' = (w-1)(3-2w)/w^5), so q3 needs NO ' +
    'finite difference. (F1) THE GENUINE CORRECTION IS A NEGATIVE (log log N)/(log N) TERM, coefficient ' +
    'c -> 1: R(N) = dp-star_exact/asymptote = 1 - c (log log N)/(log N) + o(1/log N), so R stays BELOW 1 ' +
    'across 1e100..1e300 (~0.988 -> ~0.994) and (R-1)/((log p)/p) climbs monotonically toward -1 -- the ' +
    'exact step sits slightly UNDER the asymptote and approaches from below, it does NOT run ~7.7% above. ' +
    '(F2) THE imp-34754 F3 ~7.7% EXCESS IS A FINITE-DIFFERENCE ROUNDOFF ARTIFACT of the fixed dp = 0.1/0.05 ' +
    'probe-band 9-point stencil: differencing q ~ -p/2 in the deep tail loses ~11 of 16 digits to ' +
    'cancellation. The closed-form q3 agrees with the probe-band q3 to ~1e-5 relative where the difference ' +
    'is trustworthy (N <= ~1e50), then the probe-band q3*p^3 COLLAPSES from ~1.02 to ~0.76 by 1e300 ' +
    '(deflating the |q3| denominator of dp-star and inflating dp-star) while the closed-form q3*p^3 stays ' +
    '~1.01 -- exactly the "loses monotonicity by ~1e305" imp-34754 flagged. (F3) CORRECTING THE ARTIFACT ' +
    'MOVES THE CROSSOVER LATER, NOT EARLIER: because the true correction is negative, dp-star reaches the ' +
    'finer 0.05 probe edge at a LARGER N -- solving the closed-form dp-star = 0.05 gives log10 N ~ 376.2 ' +
    'vs the asymptote-only ~374.6 (coarser 0.1 edge ~631.8 vs ~630.1), ~+1.5 decades LATER, the OPPOSITE ' +
    'direction to the imp-34754 F3 artifact-driven "earlier." q1..q3 are properties of the inherited ' +
    'component model (imp-3220/imp-3406 least trustworthy as sigma -> 1); the correction is a property of ' +
    'that model, not an independent physical claim, and the crossover N remains an asymptotic ' +
    'extrapolation hundreds of decades past the imp-34711-validated 1e100 window that certifies NOTHING ' +
    'about the true q3. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are ' +
    'UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34754 (F3 reported the ~7.7% exact-vs-asymptote excess this module diagnoses as a probe-band artifact); ' +
    'imp-34735 (exact-model ratio ladder to 1e100 + closed-form crossover log10 N ~ 374.6/630.1); ' +
    'imp-34711 (dp-star(N) ~ (log N)^(4/3) far-tail ladder, 1e13..1e100); ' +
    'imp-34691 (the dp = 0.1/0.05 well-conditioned q3 probe band); imp-2714 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34772_ASSERTIONS = [
  {
    id: 'imp34772-q3-stencil-normalization',
    holds: () => {
      let m3 = 0;
      for (const [k, w] of Q3_TERMS) m3 += w * k * k * k;
      return Math.abs(m3 / Q3_DENOM / 6 - 1) < 1e-12 && W_MAX === Math.max(...Q3_TERMS.map(([, w]) => Math.abs(w)));
    },
    why: 'Guards the inherited q3 stencil: 3rd-derivative normalization sum c_k k^3/6 = 1 and W_max = 488.',
  },
  {
    id: 'imp34772-closed-form-q3-validated-against-trustworthy-fd',
    holds: () =>
      CLOSED_MATCHES_FD_MODERATE &&
      Q3_VALIDATION.every((v) => Math.abs(v.rel_diff_fd_vs_closed) < 1e-3),
    why: 'The closed-form w-chain q3 matches the probe-band FD q3 to < 1e-3 at N <= 1e50 (where FD is trustworthy) -- validates the new tool.',
  },
  {
    id: 'imp34772-correction-is-negative-loglog-over-log',
    holds: () =>
      R_ALL_BELOW_ONE &&
      R_1E100 < 1 && R_1E100 > 0.98 && // ~0.988
      R_1E300 < 1 && R_1E300 > 0.99 && // ~0.994
      R_1E300 > R_1E100 && // approaches 1 from below as N grows
      C_COEFF_DEEP > 0.9 && C_COEFF_DEEP < 1.1, // coefficient c -> 1
    why: 'F1: R = dp-star_exact/asymptote = 1 - c loglogN/logN with c -> 1, staying below 1 (0.988 -> 0.994) -- the genuine correction is NEGATIVE.',
  },
  {
    id: 'imp34772-excess-is-roundoff-artifact-not-correction',
    holds: () =>
      EXCESS_IS_ROUNDOFF_ARTIFACT &&
      Q3FD_P3_1E300 < 0.85 && // probe-band q3*p^3 collapsed
      Q3CL_P3_1E300 > 0.95 && Q3CL_P3_1E300 < 1.05, // closed-form q3*p^3 intact ~1
    why: 'F2: the imp-34754 ~7.7% excess is a finite-difference artifact -- probe-band q3*p^3 collapses to ~0.76 by 1e300 while the closed-form q3*p^3 stays ~1.01.',
  },
  {
    id: 'imp34772-crossover-moves-later-not-earlier',
    holds: () =>
      CROSSOVER_MOVES_LATER &&
      CROSS_SHIFT_FINER_DECADES > 0.5 && CROSS_SHIFT_FINER_DECADES < 3 && // ~+1.5 decades LATER
      CROSS_FINER_CORRECTED > CROSS_FINER_ASYMP && // corrected finer crossover is larger N
      CROSS_FINER_ASYMP > 370 && CROSS_FINER_ASYMP < 380, // ~374.6 anchor to imp-34754
    why: 'F3: correcting the negative loglog/log term moves the finer-edge crossover LATER (log10 N ~376.2 vs ~374.6), the opposite direction to imp-34754 F3.',
  },
  {
    id: 'imp34772-honesty-gate-no-qed',
    holds: () =>
      IMP34772_DP_STAR_LOGLOG_CORRECTION.isRigorous === false &&
      /NO QED/.test(IMP34772_DP_STAR_LOGLOG_CORRECTION.verdict) &&
      /refereed bound is changed/i.test(IMP34772_DP_STAR_LOGLOG_CORRECTION.verdict) &&
      /UNTOUCHED/.test(IMP34772_DP_STAR_LOGLOG_CORRECTION.verdict) &&
      /extrapolation/.test(IMP34772_DP_STAR_LOGLOG_CORRECTION.verdict),
    why: 'Honesty gate: derivation/measurement only, crossover is an extrapolation, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34772_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-34772-dp-star-loglog-correction assertion failed: ${assertion.id}`);
  }
}

export default IMP34772_DP_STAR_LOGLOG_CORRECTION;
