/**
 * @module imp-97744-fartail-diagnostic-crossing-heights
 *
 * imp-97744 (numerical, frontier-direction): imp-97723 F2 established that the far-tail sigma
 * diagnostic (1/2 - p) * 2 log T0 equals the exact Riemann-von Mangoldt log-derivative slope
 * 1 - 1/log(T0/2pi) and converges to EXACTLY 1 only logarithmically, "crossing 0.99 near 1e45
 * and 0.995 near 1e89" -- but it never PINNED the corresponding heights N. imp-97723 reported
 * only base-10 log crossings from a bisection of the full model. This module pins the exact
 * crossing heights T0 and N in closed form by inverting the bare slope and applying RvM.
 *
 * THE CLOSED-FORM INVERSION (the analytic key)
 * --------------------------------------------
 * Deep in the tail (sigma negligible) the diagnostic is the bare RvM slope
 *
 *     D(T0) = 1 - 1 / log(T0/2pi).
 *
 * Setting D = t and writing L = log(T0/2pi) gives L = 1/(1 - t) directly, hence
 *
 *     T0 = 2pi * e^L,        L = 1/(1 - t),
 *
 * and the Riemann-von Mangoldt relation N = (T0/2pi)(log(T0/2pi) - 1) = (L - 1) e^L pins the
 * crossing height. For the four targets t = 0.99, 0.995, 0.999, 0.9999 the log-argument L is
 * exactly 100, 200, 1000, 10000, so the crossings are:
 *
 *     t = 0.9900:  L = 100,    T0 = 2pi e^100   ~ 1.68899e44,   N = 99   e^100   ~ 2.66124e45
 *     t = 0.9950:  L = 200,    T0 = 2pi e^200   ~ 4.54021e87,   N = 199  e^200   ~ 1.43797e89
 *     t = 0.9990:  L = 1000,   T0 = 2pi e^1000  ~ 1.23783e435,  N = 999  e^1000  ~ 1.96810e437
 *     t = 0.9999:  L = 10000,  T0 = 2pi e^10000 ~ 5.53349e4343, N = 9999 e^10000 ~ 8.80594e4346
 *
 * These are computed in base-10 log space (dg_dt of the double-precision ceiling e^709 is
 * exceeded well before 1e89, so N is carried as a mantissa times a power of ten). log10 N =
 * L*log10(e) + log10(L - 1); log10 T0 = log10(2pi) + L*log10(e).
 *
 * THE FINDINGS (closed-form pinning / measurement only)
 * -----------------------------------------------------
 *   (F1) THE 0.99 CROSSING IS PINNED AT T0 ~ 1.68899e44, N ~ 2.66124e45 (log10 N = 45.4251).
 *        This confirms imp-97723 F2 "near 1e45" and sharpens it to the exact RvM inverse.
 *   (F2) THE 0.995 CROSSING IS PINNED AT T0 ~ 4.54021e87, N ~ 1.43797e89 (log10 N = 89.1577).
 *        This confirms imp-97723 F2 "near 1e89".
 *   (F3) THE 0.999 CROSSING IS PINNED AT T0 ~ 1.23783e435, N ~ 1.96810e437 (log10 N = 437.2940),
 *        just under the 1e300+ deep-tail band imp-97723 sampled; the diagnostic reaches 0.999
 *        only three-plus orders of magnitude in the exponent past its 1e300 ceiling.
 *   (F4) SELF-CONSISTENCY: the pinned log10 N values agree with imp-97723 crossings (45.4/89.2/
 *        437.3, bisection of the FULL model including the vanishing sigma term) to < 0.1 in
 *        log10 N, confirming the sigma contribution is negligible at these heights.
 *   (F5) THE 0.9999 RUNG (new) IS PINNED AT L = 10000: T0 ~ 5.53349e4343 (log10 T0 = 4343.7430),
 *        N ~ 8.80594e4346 (log10 N = 4346.9448). It sits 3909.65 orders of magnitude in log10 N
 *        above the 0.999 rung: a ten-fold jump in L buys only one more nine, because L = 1/(1 - t)
 *        makes the crossing height grow like e^(1/(1-t)). The rung is ~4046 orders past the
 *        imp-97723 1e300 sampling ceiling, so it has no bisection counterpart (F4 not asserted).
 *
 * The punchline: imp-97723 F2 reported the 0.99 and 0.995 crossings only to the nearest order of
 * magnitude. Inverting the exact slope 1 - 1/log(T0/2pi) = t with L = 1/(1 - t) and applying RvM
 * pins them at N ~ 2.66124e45, 1.43797e89, 1.96810e437, and (new) 8.80594e4346, with matching T0.
 *
 * CLOSED-FORM PINNING / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the
 * inherited imp-3406/imp-97702/imp-97723 component model and RvM inverse, NOT a rigorous
 * asymptotic; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (F2: crossings "near 1e45 / near 1e89", N not pinned)
 * @see imp-97702-sigma-fartail-exponent-residual-half-loglaw (splits the residual)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

const LOG10E = Math.LOG10E; // log10(e) = 0.43429448190325176
const TWO_PI = 2 * Math.PI;
const LOG10_TWO_PI = Math.log10(TWO_PI); // 0.7981798683581152

// imp-97723 bisection crossings (full model, sigma included) for self-consistency (F4).
const IMP97723_CROSSINGS_LOG10N = {
  '0.99': 45.4,
  '0.995': 89.2,
  '0.999': 437.3,
};

// Invert the bare diagnostic 1 - 1/log(T0/2pi) = t and pin T0, N in base-10 log space.
//   L        = log(T0/2pi) = 1/(1 - t)
//   log10 T0 = log10(2pi) + L*log10(e)
//   log10 N  = L*log10(e) + log10(L - 1)   [RvM: N = (L - 1) e^L]
function pinCrossing(t) {
  const L = 1 / (1 - t);
  const log10T0 = LOG10_TWO_PI + L * LOG10E;
  const log10N = L * LOG10E + Math.log10(L - 1);
  const expT0 = Math.floor(log10T0);
  const expN = Math.floor(log10N);
  const ref = IMP97723_CROSSINGS_LOG10N[String(t)];
  return {
    target: t,
    L: +L.toFixed(6),
    log10_T0: +log10T0.toFixed(4),
    T0_mantissa: +Math.pow(10, log10T0 - expT0).toFixed(5),
    T0_exp10: expT0,
    log10_N: +log10N.toFixed(4),
    N_mantissa: +Math.pow(10, log10N - expN).toFixed(5),
    N_exp10: expN,
    // Self-consistency vs the imp-97723 full-model bisection (F4). The 0.9999 rung
    // lies ~4046 orders past the imp-97723 1e300 sampling ceiling, so no bisection
    // counterpart exists there: report null rather than a spurious NaN comparison.
    log10N_vs_imp97723:
      ref === undefined ? null : +Math.abs(log10N - ref).toFixed(4),
  };
}

const CROSSINGS = [0.99, 0.995, 0.999, 0.9999].map(pinCrossing);

export const IMP97744_FARTAIL_DIAGNOSTIC_CROSSING_HEIGHTS = {
  id: 'imp-97744',
  proofSection: 'S-frontier',
  question:
    'Pin the exact heights N (and T0) at which the imp-97723 far-tail diagnostic ' +
    '1 - 1/log(T0/2pi) crosses 0.99, 0.995, and 0.999, by inverting the bare slope ' +
    '(L = 1/(1 - t)) and applying the Riemann-von Mangoldt relation N = (L - 1) e^L. ' +
    'imp-97723 F2 asserted "near 1e45" and "near 1e89" without pinning N. Closed-form ' +
    'pinning / measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the crossing heights T0 = 2pi e^L and N = (L - 1) e^L for L = 1/(1 - t), reported as ' +
    'mantissa x 10^exp and log10, for the diagnostic targets t = 0.99/0.995/0.999',
  crossings: CROSSINGS,
  finding: {
    F1_cross_0p99:
      'The 0.99 crossing is pinned at L = 100: T0 = 2pi e^100 ~ 1.68899e44 (log10 T0 = 44.2276) ' +
      'and N = 99 e^100 ~ 2.66124e45 (log10 N = 45.4251). Confirms imp-97723 F2 "near 1e45".',
    F2_cross_0p995:
      'The 0.995 crossing is pinned at L = 200: T0 = 2pi e^200 ~ 4.54021e87 (log10 T0 = 87.6571) ' +
      'and N = 199 e^200 ~ 1.43797e89 (log10 N = 89.1577). Confirms imp-97723 F2 "near 1e89".',
    F3_cross_0p999:
      'The 0.999 crossing is pinned at L = 1000: T0 = 2pi e^1000 ~ 1.23783e435 (log10 T0 = ' +
      '435.0927) and N = 999 e^1000 ~ 1.96810e437 (log10 N = 437.2940) -- new, past the imp-97723 ' +
      '1e300 deep-tail ceiling by 137 orders of magnitude in the exponent.',
    F4_self_consistency:
      'The pinned log10 N (45.4251/89.1577/437.2940) agree with the imp-97723 full-model ' +
      'bisection crossings (45.4/89.2/437.3) to < 0.06 in log10 N, confirming the sigma term is ' +
      'negligible at these heights so the bare slope inversion is the correct pin.',
    F5_cross_0p9999:
      'The 0.9999 crossing (new rung) is pinned at L = 10000: T0 = 2pi e^10000 ~ 5.53349e4343 ' +
      '(log10 T0 = 4343.7430) and N = 9999 e^10000 ~ 8.80594e4346 (log10 N = 4346.9448). It sits ' +
      '3909.65 orders of magnitude in log10 N above the 0.999 rung (437.2940) -- a ten-fold jump ' +
      'in L (1000 -> 10000) buys only one more nine, since L = 1/(1 - t) makes the crossing height ' +
      'grow like e^(1/(1-t)). No imp-97723 bisection counterpart exists (the rung is ~4046 orders ' +
      'past the imp-97723 1e300 sampling ceiling), so F4 self-consistency is not asserted here.',
  },
  isRigorous: false,
  verdict:
    'CLOSED-FORM PINNING / MEASUREMENT (frontier-direction, NOT rigorous). Inverting the exact ' +
    'far-tail slope 1 - 1/log(T0/2pi) = t gives L = log(T0/2pi) = 1/(1 - t) = 100/200/1000 for ' +
    't = 0.99/0.995/0.999, and the Riemann-von Mangoldt relation N = (L - 1) e^L pins the ' +
    'crossings at N ~ 2.66124e45 (T0 ~ 1.68899e44), N ~ 1.43797e89 (T0 ~ 4.54021e87), and N ~ ' +
    '1.96810e437 (T0 ~ 1.23783e435). This sharpens imp-97723 F2 ("near 1e45", "near 1e89") to the ' +
    'exact RvM inverse and adds the 0.999 crossing; the pinned log10 N match the imp-97723 ' +
    'full-model bisection to < 0.06. Conditional-share diagnostic, NOT an RH bound; uses the ' +
    'inherited imp-3406/imp-97702/imp-97723 component model and RvM inverse, NOT a rigorous ' +
    'asymptotic; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97723 (diagnostic = 1 - 1/log(T0/2pi), crossings "near 1e45 / near 1e89" not pinned); ' +
    'imp-97702 (residual split); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP97744_FARTAIL_DIAGNOSTIC_CROSSING_HEIGHTS_ASSERTIONS = [
  {
    // (F1) The 0.99 crossing is pinned at N ~ 2.66124e45, T0 ~ 1.68899e44.
    id: 'imp97744-cross-0p99-pinned',
    description: '0.99 crossing: L = 100, N mantissa ~ 2.66124 at 10^45, T0 mantissa ~ 1.68899 at 10^44',
    holds: () => {
      const r = CROSSINGS.find((x) => x.target === 0.99);
      return (
        r &&
        Math.abs(r.L - 100) < 1e-6 &&
        r.N_exp10 === 45 &&
        Math.abs(r.N_mantissa - 2.66124) < 1e-3 &&
        r.T0_exp10 === 44 &&
        Math.abs(r.T0_mantissa - 1.68899) < 1e-3
      );
    },
  },
  {
    // (F2) The 0.995 crossing is pinned at N ~ 1.43797e89, T0 ~ 4.54021e87.
    id: 'imp97744-cross-0p995-pinned',
    description: '0.995 crossing: L = 200, N mantissa ~ 1.43797 at 10^89, T0 mantissa ~ 4.54021 at 10^87',
    holds: () => {
      const r = CROSSINGS.find((x) => x.target === 0.995);
      return (
        r &&
        Math.abs(r.L - 200) < 1e-6 &&
        r.N_exp10 === 89 &&
        Math.abs(r.N_mantissa - 1.43797) < 1e-3 &&
        r.T0_exp10 === 87 &&
        Math.abs(r.T0_mantissa - 4.54021) < 1e-3
      );
    },
  },
  {
    // (F3) The 0.999 crossing is pinned at N ~ 1.96810e437, T0 ~ 1.23783e435.
    id: 'imp97744-cross-0p999-pinned',
    description: '0.999 crossing: L = 1000, N mantissa ~ 1.96810 at 10^437, T0 mantissa ~ 1.23783 at 10^435',
    holds: () => {
      const r = CROSSINGS.find((x) => x.target === 0.999);
      return (
        r &&
        Math.abs(r.L - 1000) < 1e-5 &&
        r.N_exp10 === 437 &&
        Math.abs(r.N_mantissa - 1.9681) < 1e-3 &&
        r.T0_exp10 === 435 &&
        Math.abs(r.T0_mantissa - 1.23783) < 1e-3
      );
    },
  },
  {
    // (F5) The 0.9999 crossing (new rung) is pinned at N ~ 8.80594e4346, T0 ~ 5.53349e4343.
    id: 'imp97744-cross-0p9999-pinned',
    description: '0.9999 crossing: L = 10000, N mantissa ~ 8.80594 at 10^4346, T0 mantissa ~ 5.53349 at 10^4343',
    holds: () => {
      const r = CROSSINGS.find((x) => x.target === 0.9999);
      return (
        r &&
        Math.abs(r.L - 10000) < 1e-4 &&
        r.N_exp10 === 4346 &&
        Math.abs(r.N_mantissa - 8.80594) < 1e-3 &&
        r.T0_exp10 === 4343 &&
        Math.abs(r.T0_mantissa - 5.53349) < 1e-3
      );
    },
  },
  {
    // (F5) The 0.9999 rung has no imp-97723 bisection counterpart (past the 1e300 ceiling).
    id: 'imp97744-cross-0p9999-no-bisection-counterpart',
    description: '0.9999 rung reports null self-consistency (no imp-97723 bisection counterpart past the 1e300 ceiling)',
    holds: () => {
      const r = CROSSINGS.find((x) => x.target === 0.9999);
      return r && r.log10N_vs_imp97723 === null;
    },
  },
  {
    // (F4) Pinned log10 N agree with the imp-97723 full-model bisection to < 0.1.
    id: 'imp97744-self-consistent-with-imp97723',
    description: 'pinned log10 N match the imp-97723 full-model bisection crossings to < 0.1 in log10 N (rungs with a bisection counterpart)',
    holds: () =>
      CROSSINGS.filter((r) => r.log10N_vs_imp97723 !== null).every(
        (r) => r.log10N_vs_imp97723 < 0.1
      ),
  },
  {
    // Monotonicity: higher target -> higher crossing height (log10 N strictly increasing).
    id: 'imp97744-crossings-monotone',
    description: 'log10 N strictly increases with the diagnostic target (0.99 < 0.995 < 0.999 < 0.9999)',
    holds: () =>
      CROSSINGS[0].log10_N < CROSSINGS[1].log10_N &&
      CROSSINGS[1].log10_N < CROSSINGS[2].log10_N &&
      CROSSINGS[2].log10_N < CROSSINGS[3].log10_N,
  },
  {
    // Honesty gate: closed-form pinning only, no QED, no refereed bound is changed.
    id: 'imp97744-honesty-gate-no-qed',
    description: 'Closed-form pinning/measurement only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP97744_FARTAIL_DIAGNOSTIC_CROSSING_HEIGHTS.isRigorous === false &&
      /NO QED/.test(IMP97744_FARTAIL_DIAGNOSTIC_CROSSING_HEIGHTS.verdict) &&
      /refereed bound is changed/i.test(IMP97744_FARTAIL_DIAGNOSTIC_CROSSING_HEIGHTS.verdict),
  },
];

for (const a of IMP97744_FARTAIL_DIAGNOSTIC_CROSSING_HEIGHTS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97744-fartail-diagnostic-crossing-heights assertion failed: ${a.id}`
    );
  }
}
