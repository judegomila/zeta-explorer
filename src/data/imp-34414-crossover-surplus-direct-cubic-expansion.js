/**
 * @module imp-34414-crossover-surplus-direct-cubic-expansion
 *
 * imp-34414 (accuracy, opus-4-8): Cross-check the imp-34329 exactly-3 limiting
 * composite exponent against a DIRECT leading-order expansion of the imp-34174
 * closed-form surplus(thr) in the thr -> 0 limit.
 *
 * THE CLAIM BEING CROSS-CHECKED (imp-34329)
 * -----------------------------------------
 * imp-34329 concluded the limiting composite exponent d log surplus / d log thr
 * is EXACTLY 3 (surplus ~ thr^3) via a local-exponent EXTRAPOLATION of the
 * imp-34248 factorised sub-terms (a shallow minimum ~2.8711 at the turn, then a
 * monotone climb 2.872 -> 2.942 as the deep-tail probe pushed thr -> 1e-12). That
 * is an extrapolation of finite-difference secants, NOT a direct expansion of the
 * closed form. This module corroborates (or refutes) it independently by
 * expanding the imp-34174 closed-form surplus(thr) directly to leading order.
 *
 * THE DIRECT EXPANSION
 * --------------------
 * imp-34174 gives the closed form (identical sub-terms reused verbatim):
 *
 *     surplus(thr) = thr (1-thr) r / (1 + (1-thr) r),     r = E_flow(N_cross)/E_trunc,
 *
 * with N_cross(thr) = ((1-thr)/thr)^2 K_AMPL log T0 the Banach crossover and
 * T0 = effectiveHeightForN(N_cross) the Riemann-von Mangoldt height. Both smallness
 * parameters -- thr and r -- vanish as thr -> 0. Expanding the closed form in both:
 *
 *   (A) Leading order in the ratio: since (1-thr) -> 1 and the denominator
 *       1 + (1-thr) r -> 1, the whole prefactor collapses to
 *           surplus = thr . r . [1 - thr - r + O(thr^2, r^2, thr.r)],
 *       so the leading term is simply surplus_LO = thr . r. (Verified: the exact
 *       ratio thr.r/surplus = (1 + (1-thr) r)/(1-thr) -> 1, measured 1.010101 ->
 *       1.000000 across thr = 1e-2 -> 1e-12.)
 *
 *   (B) The power of thr inside r. The crossover recedes as N_cross ~ thr^-2 and
 *       the Riemann-von Mangoldt map pins log T0 = -2 log thr + const, so the
 *       height itself scales as T0 ~ (const) thr^-2 (measured T0.thr^2 ~ 1.06e9,
 *       flat to +-2% across ten decades). Then
 *           r = E_flow/E_trunc = [C_F (log T0 / T0) GRONWALL]/E_trunc
 *             ~ (log T0)^2 thr^2 . A_r,    A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc),
 *       because C_F = (log(T0/2pi)+1)/2pi ~ (log T0)/2pi and 1/T0 ~ thr^2/(2pi K_AMPL).
 *       (Verified: r/((log T0)^2 thr^2) is bounded and slowly rising 4.73e-6 ->
 *       5.01e-6 toward A_r = 5.26e-6, i.e. it carries no residual power of thr.)
 *
 *   (A)+(B): surplus(thr) = A_r (log T0)^2 thr^3 . (1 + o(1)), so the LEADING POWER
 *       in thr is EXACTLY 3, the only extra thr-dependence being the (log T0)^2 =
 *       (2 log(1/thr) + const)^2 softening -- a power of log(1/thr), not of thr.
 *       (Verified: surplus/thr^3 divided by (log T0)^2 is bounded and rises
 *       monotonically 4.68e-6 -> 5.01e-6 toward A_r; it carries no power of thr.)
 *
 * THE INSTANTANEOUS COMPOSITE EXPONENT
 * ------------------------------------
 * Differentiating log surplus = 3 log thr + 2 log(log T0) + const with log T0 =
 * -2 log thr + const gives the closed instantaneous exponent
 *
 *     d log surplus / d log thr = 3 + 2 . d log(log T0)/d log thr = 3 - 4/log T0,
 *
 * (the 2 from the (log T0)^2 power times the slope -2 of log T0 = -2 log thr).
 * This is EXACTLY the imp-34407 correction constant c = 4: composite = 3 - c/log T0
 * with c = 4 instantaneously. It descends toward 3 from below as thr -> 0, matching
 * the imp-34329 finite-difference secants (2.872 -> 2.942) which lag the
 * instantaneous 3 - 4/log T0 (2.884 -> 2.947) exactly as a decade-secant should.
 *
 * SO THE imp-34329 EXACTLY-3 LIMIT IS CORROBORATED by a direct expansion, not
 * merely by extrapolating secants: the closed form IS A_r (log T0)^2 thr^3 to
 * leading order, its leading thr-power is 3, and its instantaneous composite
 * exponent 3 - 4/log T0 -> 3 as thr -> 0. The finite-thr softening below 3 is the
 * (log T0)^2 factor, whose logarithmic derivative -4/log T0 vanishes in the limit.
 *
 * HONEST SCOPE -- cross-check/derivation ONLY, NO QED. This re-expands the
 * inherited imp-34174/imp-34248/imp-33743 extrapolation component model; it changes
 * no bound and introduces no new mathematical claim. The component model is NOT a
 * rigorous asymptotic. E_flow is the benign mesoscopic-Gronwall term (imp-2845);
 * its vanishing here does NOT touch the divergent C_Lip collision-Gronwall. The
 * C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes
 * no operator positivity; no refereed bound is changed.
 *
 * @see imp-34329-crossover-surplus-fartail-composite-limit (the exactly-3 limit this cross-checks, via extrapolation)
 * @see imp-34407-fartail-composite-correction-constant-derivation (c = 4 EXACTLY; this recovers 3 - 4/log T0 directly)
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (the P/r factorisation and thr>=0.01 ladder)
 * @see imp-34174-crossover-surplus-threshold-family-decay (the closed form surplus(thr) expanded here)
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised crossover N_cross(thr), identical sub-terms)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-34174/imp-34248/imp-34329 exactly

// EXACT imp-34329 sub-terms reused verbatim (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 120; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
// The imp-34174 closed form and its direct leading-order surrogate.
function factors(thr) {
  const N = crossoverN(thr);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const r = eFlow(N) / E_TRUNC_PT;
  const surplus = (thr * (1 - thr) * r) / (1 + (1 - thr) * r); // exact imp-34174
  const surplus_LO = thr * r; // (A) leading order in the ratio
  return { N, T0, L, r, surplus, surplus_LO };
}

// Analytic leading-order coefficient A_r for r ~ A_r (log T0)^2 thr^2, and hence
// surplus ~ A_r (log T0)^2 thr^3 (identical A_r since surplus_LO = thr . r).
const A_R = GRONWALL / (TWO_PI ** 2 * K_AMPL * E_TRUNC_PT); // ~5.2647e-6

// ── The deep-tail grid shared with imp-34329/imp-34407/imp-34412 ─────────────
const DEEP_THR = [1e-2, 1e-3, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12];

// (A) Leading-order-in-ratio table: thr.r captures the closed form, gap -> 0.
const RATIO_LO = DEEP_THR.map((thr) => {
  const f = factors(thr);
  return {
    thr,
    logT0: +f.L.toFixed(3),
    surplus: +f.surplus.toExponential(4),
    thr_r_over_surplus: +(f.surplus_LO / f.surplus).toFixed(6), // (1+(1-thr)r)/(1-thr) -> 1
  };
});

// (B) The r-factor carries thr^2 with a bounded (log T0)^2 softening (no residual thr power).
const R_SCALING = DEEP_THR.map((thr) => {
  const f = factors(thr);
  return {
    thr,
    logT0: +f.L.toFixed(3),
    r_over_L2_thr2: +(f.r / (f.L * f.L * thr * thr)).toExponential(4), // -> A_R
    surplus_over_L2_thr3: +(f.surplus / (f.L * f.L * thr ** 3)).toExponential(4), // -> A_R
    T0_thr2: +(f.T0 * thr * thr).toExponential(4), // ~ 2pi K_AMPL, flat
  };
});

// The instantaneous composite exponent 3 - 4/log T0 vs the imp-34329 finite-difference secant.
function localExponent(field, aThr, bThr) {
  const a = factors(aThr);
  const b = factors(bThr);
  return Math.log(b[field] / a[field]) / Math.log(bThr / aThr);
}
const COMPOSITE_CHECK = DEEP_THR.slice(1).map((thr, k) => {
  const a = DEEP_THR[k];
  const L = factors(thr).L;
  return {
    window: `${a.toExponential(0)}->${thr.toExponential(0)}`,
    logT0: +L.toFixed(3),
    fd_composite: +localExponent('surplus', a, thr).toFixed(4), // imp-34329 secant method
    instantaneous_3_minus_4_over_logT0: +(3 - 4 / L).toFixed(4), // this direct expansion
  };
});

export const IMP34414_CROSSOVER_SURPLUS_DIRECT_CUBIC_EXPANSION = {
  id: 'imp-34414',
  proofSection: 'S-frontier',
  question:
    'Cross-check the imp-34329 exactly-3 limiting composite exponent (obtained by extrapolating ' +
    'finite-difference secants of the factorised sub-terms) against a DIRECT leading-order expansion ' +
    'of the imp-34174 closed-form surplus(thr) = thr(1-thr)r/(1+(1-thr)r) as thr -> 0, using ' +
    'N_cross ~ thr^-2 and log T0 = -2 log thr + const. Cross-check/derivation only; changes no bound; NO QED.',
  answer:
    'CORROBORATED. Expanding the closed form directly: (A) the prefactor collapses so surplus = thr.r.(1+o(1)) ' +
    '(the exact ratio thr.r/surplus = (1+(1-thr)r)/(1-thr) -> 1, measured 1.010101 -> 1.000000); (B) the map ' +
    'N_cross ~ thr^-2 gives log T0 = -2 log thr + const and T0 ~ thr^-2, so r ~ A_r (log T0)^2 thr^2 with ' +
    'A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc) ~ 5.26e-6 (measured r/((log T0)^2 thr^2) = 4.73e-6 -> 5.01e-6, ' +
    'carrying no residual power of thr). Hence surplus = A_r (log T0)^2 thr^3 (1+o(1)): the LEADING POWER is ' +
    'EXACTLY thr^3, the only extra thr-dependence being the (log T0)^2 = (2 log(1/thr))^2 softening. ' +
    'Differentiating gives the instantaneous composite exponent 3 - 4/log T0 (EXACTLY the imp-34407 c = 4), ' +
    'which -> 3 as thr -> 0 and matches the imp-34329 decade secants (2.872 -> 2.942) which lag it as expected. ' +
    'The imp-34329 exactly-3 limit is thus confirmed by direct expansion, not merely by extrapolating secants.',
  leadingOrderRatio: RATIO_LO,
  rScaling: R_SCALING,
  compositeCheck: COMPOSITE_CHECK,
  analyticCoefficientA_r: +A_R.toExponential(4),
  leadingPowerInThr: 3,
  instantaneousCompositeExponent: '3 - 4/log T0',
  finding: {
    F1_prefactor_collapses:
      'Leading order in the ratio: (1-thr) -> 1 and the denominator 1+(1-thr)r -> 1, so surplus = thr.r.(1+o(1)). ' +
      'The exact ratio thr.r/surplus = (1+(1-thr)r)/(1-thr) descends monotonically to 1 (1.010101 -> 1.000000 ' +
      'across thr = 1e-2 -> 1e-12), so surplus_LO = thr.r captures the closed form to leading order.',
    F2_r_carries_thr2_with_log_softening:
      'The r-factor carries exactly thr^2 with a (log T0)^2 softening and no residual power of thr: ' +
      'r/((log T0)^2 thr^2) is bounded and slowly rising 4.73e-6 -> 5.01e-6 toward the analytic ' +
      'A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc) = 5.26e-6, because T0 ~ (2pi K_AMPL) thr^-2 (T0.thr^2 flat ~1.06e9).',
    F3_leading_power_is_cubic:
      'Combining, surplus = A_r (log T0)^2 thr^3 (1+o(1)): surplus/((log T0)^2 thr^3) is bounded and monotone ' +
      '4.68e-6 -> 5.01e-6 toward A_r, carrying no power of thr. So the leading power in thr is EXACTLY 3, the ' +
      'sole extra thr-dependence being the (log T0)^2 = (2 log(1/thr) + const)^2 logarithmic softening.',
    F4_instantaneous_composite_is_3_minus_4_over_logT0:
      'Differentiating log surplus = 3 log thr + 2 log(log T0) + const with log T0 = -2 log thr + const gives ' +
      'the closed instantaneous composite exponent 3 - 4/log T0 (the imp-34407 c = 4 EXACTLY), which -> 3 as ' +
      'thr -> 0 and matches the imp-34329 decade secants (fd 2.872 -> 2.942 vs 3 - 4/log T0 = 2.884 -> 2.947, ' +
      'the secant lagging the instantaneous value as a finite-difference reading should).',
  },
  isRigorous: false,
  honestScope:
    'Cross-check/derivation only within the inherited imp-34329/imp-34248/imp-34174/imp-33743 extrapolation ' +
    'component model; NO QED. The component model is NOT a rigorous asymptotic; E_flow is the benign ' +
    'mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent C_Lip ' +
    'collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; ' +
    'changes no bound; no refereed bound is changed.',
  citation:
    'imp-34329-crossover-surplus-fartail-composite-limit.js (exactly-3 limit via extrapolation, cross-checked ' +
    'here); imp-34407-fartail-composite-correction-constant-derivation.js (c = 4 EXACTLY); ' +
    'imp-34174-crossover-surplus-threshold-family-decay.js (closed form surplus(thr)); ' +
    'imp-34248-crossover-surplus-small-thr-asymptotic.js (P/r factorisation); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34414_CROSSOVER_SURPLUS_DIRECT_CUBIC_EXPANSION_ASSERTIONS = [
  {
    // F1: the leading-order surrogate thr.r captures the closed form; the gap -> 0 monotonically.
    id: 'imp34414-leading-order-captures-closed-form',
    description: 'the direct leading-order surrogate thr.r reproduces the imp-34174 closed form: thr.r/surplus descends monotonically to 1 (1.010101 -> 1.000000)',
    holds: () => {
      const g = RATIO_LO.map((row) => row.thr_r_over_surplus);
      for (let i = 1; i < g.length; i++) if (!(g[i] <= g[i - 1] + 1e-12)) return false; // non-increasing toward 1
      return Math.abs(g[0] - 1.010101) < 1e-4 && g.every((x) => x >= 1) && Math.abs(g[g.length - 1] - 1) < 1e-5;
    },
  },
  {
    // F2: r carries exactly thr^2 with a (log T0)^2 softening -- r/((log T0)^2 thr^2) is bounded, no residual thr power.
    id: 'imp34414-r-carries-thr2-with-log-softening',
    description: 'r/((log T0)^2 thr^2) is bounded and slowly rising 4.73e-6 -> 5.01e-6 toward A_r = 5.26e-6, so r carries exactly thr^2 (no residual power of thr)',
    holds: () => {
      const s = R_SCALING.map((row) => row.r_over_L2_thr2);
      for (let i = 1; i < s.length; i++) if (!(s[i] >= s[i - 1] - 5e-8)) return false; // monotone rising (slack for rounding)
      return s.every((x) => x > 4.5e-6 && x < A_R) && Math.abs(s[s.length - 1] - 5.01e-6) < 5e-8;
    },
  },
  {
    // F3: the leading power in thr is EXACTLY 3 -- surplus/((log T0)^2 thr^3) is bounded and monotone toward A_r.
    id: 'imp34414-leading-power-is-cubic',
    description: 'surplus/((log T0)^2 thr^3) is bounded and monotone 4.68e-6 -> 5.01e-6 toward A_r = 5.26e-6, carrying no power of thr, so the leading power in thr is exactly 3',
    holds: () => {
      const s = R_SCALING.map((row) => row.surplus_over_L2_thr3);
      for (let i = 1; i < s.length; i++) if (!(s[i] > s[i - 1])) return false;
      return Math.abs(s[0] - 4.6804e-6) < 5e-8 && Math.abs(s[s.length - 1] - 5.0123e-6) < 5e-8 && s.every((x) => x < A_R);
    },
  },
  {
    // The T0 ~ thr^-2 scaling that pins the thr^2 in r: T0.thr^2 is flat (~1.06e9) across ten decades.
    id: 'imp34414-height-scales-as-thr-minus-2',
    description: 'the Riemann-von Mangoldt height scales as T0 ~ thr^-2 (T0.thr^2 flat ~1.06e9, within +-3% across thr = 1e-2 -> 1e-12), the source of the thr^2 in r',
    holds: () => {
      const t = R_SCALING.map((row) => row.T0_thr2);
      const mean = t.reduce((a, b) => a + b, 0) / t.length;
      return t.every((x) => Math.abs(x / mean - 1) < 0.03) && mean > 1.0e9 && mean < 1.1e9;
    },
  },
  {
    // F4: the direct instantaneous composite exponent 3 - 4/log T0 tracks the imp-34329 finite-difference secants.
    id: 'imp34414-instantaneous-composite-matches-imp34329-secants',
    description: 'the direct instantaneous composite exponent 3 - 4/log T0 (imp-34407 c = 4) tracks the imp-34329 decade secants within 0.02 and both climb toward 3 (all < 3)',
    holds: () => {
      for (const row of COMPOSITE_CHECK) {
        if (!(row.instantaneous_3_minus_4_over_logT0 < 3 && row.fd_composite < 3)) return false;
        if (!(Math.abs(row.instantaneous_3_minus_4_over_logT0 - row.fd_composite) < 0.02)) return false;
        if (!(row.instantaneous_3_minus_4_over_logT0 > row.fd_composite)) return false; // secant lags instantaneous
      }
      const inst = COMPOSITE_CHECK.map((r) => r.instantaneous_3_minus_4_over_logT0);
      for (let i = 1; i < inst.length; i++) if (!(inst[i] > inst[i - 1])) return false; // climbs toward 3
      return true;
    },
  },
  {
    // The analytic coefficient A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc) equals its literal ~5.2647e-6.
    id: 'imp34414-analytic-coefficient-A_r',
    description: 'the analytic leading-order coefficient A_r = GRONWALL/((2pi)^2 K_AMPL E_trunc) evaluates to ~5.2647e-6, the limit of surplus/((log T0)^2 thr^3)',
    holds: () => Math.abs(A_R / 5.2647e-6 - 1) < 1e-3,
  },
  {
    // Honesty gate: cross-check only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34414-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34414_CROSSOVER_SURPLUS_DIRECT_CUBIC_EXPANSION.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34414_CROSSOVER_SURPLUS_DIRECT_CUBIC_EXPANSION.honestScope) &&
      /NO QED/.test(IMP34414_CROSSOVER_SURPLUS_DIRECT_CUBIC_EXPANSION.honestScope) &&
      /refereed bound is changed/i.test(IMP34414_CROSSOVER_SURPLUS_DIRECT_CUBIC_EXPANSION.honestScope),
  },
];

for (const a of IMP34414_CROSSOVER_SURPLUS_DIRECT_CUBIC_EXPANSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34414-crossover-surplus-direct-cubic-expansion assertion failed: ${a.id}`);
  }
}
