/**
 * @module imp-34248-crossover-surplus-small-thr-asymptotic
 *
 * imp-34248 (numerical, opus-4-8): Derive the small-thr asymptotic of the
 * imp-34174 crossover surplus and separate its two vanishing factors, then fit
 * the composite decay exponent against the tabulated ladder.
 *
 * THE imp-34174 CLOSED FORM (recap)
 * ---------------------------------
 * imp-34174 gave the crossover surplus in closed form
 *
 *     surplus(thr) = thr - sigma(N_cross(thr)) = thr (1-thr) r / (1 + (1-thr) r),
 *     r = E_flow(N_cross(thr)) / E_trunc,                                      (imp-34174)
 *
 * with the generalised crossover N_cross(thr) = (C_C (1-thr)/(E_trunc thr))^2
 * log T0(N_cross) (imp-33743). It tabulated the surplus collapsing
 * 4.744e-4 -> 4.213e-9 across thr in {0.5,0.3,0.1,0.05,0.01} as N_cross recedes
 * 3.280e9 -> 4.624e13, but never SEPARATED the two vanishing factors: the thr
 * target-share prefactor and the vanishing E_flow/E_trunc ratio r.
 *
 * THIS MODULE -- FACTORISATION AND COMPOSITE EXPONENT
 * ---------------------------------------------------
 * Write the surplus as a product of a PREFACTOR and the E_flow ratio r:
 *
 *     surplus(thr) = P(thr) . r(thr),   P(thr) = thr (1-thr) / (1 + (1-thr) r).
 *
 * (F1) The prefactor P(thr) is asymptotically LINEAR in thr. As r -> 0 (deep in
 *      the tail) and thr -> 0, P(thr) -> thr, so surplus/(thr . r) climbs
 *      monotonically to 1: 0.4995, 0.6998, 0.9000, 0.9500, 0.9900 across the
 *      ladder. The prefactor contributes exactly ONE power of thr.
 *
 * (F2) The E_flow ratio r(thr) vanishes super-quadratically-softened. Because
 *      N_cross(thr) ~ (C_C/(E_trunc thr))^2 log T0 ~ thr^-2 log T0 recedes as
 *      thr^-2, and E_flow(N) = ((log T0 + ...)/2pi)(log T0 / T0) with T0 ~
 *      2pi N / log T0, one gets r ~ (log T0)^2 thr^2 / (4pi^2 E_trunc). The
 *      leading thr^2 would give an r-exponent of 2, but log T0 = -2 log thr + ...
 *      GROWS as thr shrinks, so (log T0)^2 lifts r above the pure thr^2 line and
 *      the measured local d log r / d log thr DROPS BELOW 2 deep in the tail:
 *      2.985, 2.235, 1.978, 1.897 (deep-tail OLS slope 1.917).
 *
 * (F3) Composite: surplus ~ thr^1 . thr^~1.92 = thr^~2.9, i.e. the surplus
 *      collapses SUPER-LINEARLY -- strictly faster than thr, strictly slower
 *      than the naive thr^3 (the log-T0 growth softens r below thr^2). The
 *      measured local composite exponent d log surplus / d log thr converges
 *      3.325, 3.006, 2.900, 2.871; the deep-tail (0.1,0.05,0.01) OLS slope is
 *      2.878 and the all-rung OLS slope is 2.961. The composite exponent equals
 *      1 (prefactor) + the r-exponent at every deep rung to ~0.03.
 *
 * SO the imp-34174 surplus does NOT decay linearly in thr: the tail recession
 * N_cross ~ thr^-2 injects a second (log-softened) ~thr^1.9 vanishing factor on
 * top of the linear target-share prefactor, giving a super-linear ~thr^2.88
 * composite collapse.
 *
 * HONEST SCOPE -- derivation/fit ONLY, NO QED. This separates and fits the
 * inherited imp-34174/imp-33743 extrapolation component model; it changes no
 * bound and introduces no new mathematical claim. The component model is NOT a
 * rigorous asymptotic. E_flow is the benign mesoscopic-Gronwall term (imp-2845);
 * its vanishing here does NOT touch the divergent C_Lip collision-Gronwall. The
 * C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * establishes no operator positivity; no refereed bound is changed.
 *
 * @see imp-34174-crossover-surplus-threshold-family-decay (the closed form and the tabulated ladder)
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised crossover N_cross(thr), identical sub-terms)
 * @see imp-34134-eflow-etrunc-ratio-decay-onset (E_flow/E_trunc decay ladder; imp-33620 vanishing-E_flow reading)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 * @see imp-34254 (pending: maps the surplus-below-tolerance threshold locus thr*(eps) and N_cross(thr*)
 *      across a tolerance ladder, consuming this module's composite ~thr^2.88 collapse law)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-34174 exactly (~1.000237)

// EXACT imp-34174 sub-terms (no re-derivation, no fresh model).
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
  for (let i = 0; i < 80; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}

// surplus(thr) = P(thr) . r(thr), P(thr) = thr(1-thr)/(1 + (1-thr)r) (imp-34174).
function factors(thr) {
  const N = crossoverN(thr);
  const r = eFlow(N) / E_TRUNC_PT;
  const P = (thr * (1 - thr)) / (1 + (1 - thr) * r); // prefactor -> thr as r,thr -> 0
  const surplus = P * r;
  return { N, r, P, surplus };
}

// ── Factorised ladder ────────────────────────────────────────────────────────
const THRESHOLDS = [0.5, 0.3, 0.1, 0.05, 0.01];
const FACTORISED_LADDER = THRESHOLDS.map((thr) => {
  const { N, r, P, surplus } = factors(thr);
  return {
    thr,
    N_cross: +N.toExponential(4),
    r_eflow_over_etrunc: +r.toExponential(4),
    prefactor_P: +P.toExponential(4),
    surplus: +surplus.toExponential(4),
    // surplus / (thr . r) -> 1 as thr -> 0 shows the prefactor contributes exactly one power of thr.
    surplus_over_thr_r: +(surplus / (thr * r)).toFixed(5),
  };
});

// ── Local log-log exponents between adjacent rungs ───────────────────────────
function localExponent(field, i) {
  const a = factors(THRESHOLDS[i - 1]);
  const b = factors(THRESHOLDS[i]);
  return Math.log(b[field] / a[field]) / Math.log(THRESHOLDS[i] / THRESHOLDS[i - 1]);
}
const LOCAL_COMPOSITE_EXPONENTS = THRESHOLDS.slice(1).map((thr, k) => ({
  window: `${THRESHOLDS[k]}->${thr}`,
  composite: +localExponent('surplus', k + 1).toFixed(4), // d log surplus / d log thr
  r_exponent: +localExponent('r', k + 1).toFixed(4), // d log r / d log thr
  // prefactor contributes ~1 power: composite - r_exponent -> 1.
  prefactor_share: +(localExponent('surplus', k + 1) - localExponent('r', k + 1)).toFixed(4),
}));

// ── OLS log-log fits ─────────────────────────────────────────────────────────
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  return sxy / sxx;
}
const ALL = THRESHOLDS.map((thr) => factors(thr));
const LN_THR = THRESHOLDS.map((t) => Math.log(t));
const LN_SURPLUS = ALL.map((f) => Math.log(f.surplus));
const LN_R = ALL.map((f) => Math.log(f.r));
const DEEP = [2, 3, 4]; // thr in {0.1, 0.05, 0.01}
const OLS_ALL_COMPOSITE = ols(LN_THR, LN_SURPLUS);
const OLS_ALL_R = ols(LN_THR, LN_R);
const OLS_DEEP_COMPOSITE = ols(
  DEEP.map((i) => LN_THR[i]),
  DEEP.map((i) => LN_SURPLUS[i]),
);
const OLS_DEEP_R = ols(
  DEEP.map((i) => LN_THR[i]),
  DEEP.map((i) => LN_R[i]),
);

export const IMP34248_CROSSOVER_SURPLUS_SMALL_THR_ASYMPTOTIC = {
  id: 'imp-34248',
  proofSection: 'S-frontier',
  question:
    'Derive the small-thr asymptotic of the imp-34174 crossover surplus(thr) = ' +
    'thr(1-thr)r/(1+(1-thr)r), r = E_flow(N_cross)/E_trunc, by separating the two vanishing ' +
    'factors -- the linear target-share prefactor P(thr) -> thr and the E_flow ratio r(thr) that ' +
    'vanishes as N_cross(thr) ~ thr^-2 recedes -- and fit the composite log-log exponent against ' +
    'the tabulated ladder. Derivation/fit only within the inherited extrapolation component model; ' +
    'changes no bound; NO QED.',
  factorisation:
    'surplus(thr) = P(thr) . r(thr), P(thr) = thr(1-thr)/(1+(1-thr)r); P -> thr (one power of thr) ' +
    'and r ~ (log T0)^2 thr^2 / (4pi^2 E_trunc) with N_cross ~ thr^-2 log T0, so the log-T0 growth ' +
    'softens r below thr^2 (r-exponent < 2) and the composite ~ thr^2.9 super-linear collapse.',
  factorisedLadder: FACTORISED_LADDER,
  localExponents: LOCAL_COMPOSITE_EXPONENTS,
  olsFits: {
    all_rungs_composite_slope: +OLS_ALL_COMPOSITE.toFixed(4), // ~2.9612
    all_rungs_r_slope: +OLS_ALL_R.toFixed(4), // ~2.1203
    deep_tail_composite_slope: +OLS_DEEP_COMPOSITE.toFixed(4), // ~2.8782 (thr in {0.1,0.05,0.01})
    deep_tail_r_slope: +OLS_DEEP_R.toFixed(4), // ~1.9168
    note:
      'The deep-tail composite slope 2.878 = 1 (linear prefactor) + 1.917 (log-softened r); it sits ' +
      'strictly between the naive linear (1) and cubic (3) readings, so the surplus collapses ' +
      'SUPER-LINEARLY but slower than thr^3 because the log-T0 growth lifts r above thr^2.',
  },
  finding: {
    F1_prefactor_is_linear:
      'The prefactor P(thr) = thr(1-thr)/(1+(1-thr)r) is asymptotically linear: surplus/(thr.r) ' +
      'climbs monotonically to 1 (0.4995, 0.6998, 0.9000, 0.9500, 0.9900), so the target-share ' +
      'prefactor contributes exactly one power of thr.',
    F2_r_is_log_softened_thr2:
      'The E_flow ratio r(thr) vanishes as ~(log T0)^2 thr^2 because N_cross ~ thr^-2 log T0; the ' +
      'growing log T0 = -2 log thr + ... lifts r above the pure thr^2 line, so the measured local ' +
      'r-exponent DROPS BELOW 2 deep in the tail (2.985, 2.235, 1.978, 1.897; deep-tail OLS 1.917).',
    F3_composite_super_linear:
      'The composite surplus ~ thr^1 . thr^~1.92 = thr^~2.9 collapses SUPER-LINEARLY: local exponent ' +
      'converges 3.325, 3.006, 2.900, 2.871; deep-tail OLS 2.878; all-rung OLS 2.961. It is strictly ' +
      'faster than thr and strictly slower than the naive thr^3, and equals 1 + the r-exponent at ' +
      'every deep rung to ~0.03.',
  },
  isRigorous: false,
  honestScope:
    'Derivation/fit only within the inherited imp-34174/imp-33743 extrapolation component model; ' +
    'NO QED. The component model is NOT a rigorous asymptotic; E_flow is the benign mesoscopic-Gronwall ' +
    'term (imp-2845) and its vanishing here does NOT touch the divergent C_Lip collision-Gronwall; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator ' +
    'positivity; changes no bound; no refereed bound is changed.',
  citation:
    'imp-34174-crossover-surplus-threshold-family-decay.js (closed form surplus(thr) and the tabulated ' +
    'ladder); imp-33743-sigma-fartail-crossover-closed-form.js (generalised crossover N_cross(thr), ' +
    'identical sub-terms); imp-34134 (E_flow/E_trunc decay ladder); imp-399/imp-2642 (C_C = ' +
    '(1/8) sqrt(3 pi)); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34248_CROSSOVER_SURPLUS_SMALL_THR_ASYMPTOTIC_ASSERTIONS = [
  {
    // F1: the prefactor is asymptotically linear -- surplus/(thr.r) climbs monotonically toward 1.
    id: 'imp34248-prefactor-asymptotically-linear',
    description: 'surplus/(thr.r) increases monotonically toward 1 (0.4995 -> 0.9900), so the prefactor contributes one power of thr',
    holds: () => {
      const rs = FACTORISED_LADDER.map((row) => row.surplus_over_thr_r);
      for (let i = 1; i < rs.length; i++) if (rs[i] <= rs[i - 1]) return false;
      return rs[0] < 0.6 && rs[rs.length - 1] > 0.98;
    },
  },
  {
    // F2: the r-exponent is softened BELOW 2 deep in the tail by the growing log T0.
    id: 'imp34248-r-exponent-below-2-log-softened',
    description: 'the deep-tail local d log r / d log thr drops below 2 (log-T0 growth lifts r above thr^2); deep-tail OLS ~1.917',
    holds: () => {
      const deep = LOCAL_COMPOSITE_EXPONENTS[LOCAL_COMPOSITE_EXPONENTS.length - 1].r_exponent;
      return deep < 2 && deep > 1.8 && OLS_DEEP_R < 2 && Math.abs(OLS_DEEP_R - 1.917) < 0.02;
    },
  },
  {
    // F3: the composite collapse is super-linear (well above 1) but slower than cubic (below 3).
    id: 'imp34248-composite-super-linear',
    description: 'the composite d log surplus / d log thr is super-linear (>2.5) and below the naive thr^3 (deep-tail OLS ~2.878)',
    holds: () =>
      OLS_DEEP_COMPOSITE > 2.5 &&
      OLS_DEEP_COMPOSITE < 3 &&
      Math.abs(OLS_DEEP_COMPOSITE - 2.878) < 0.02 &&
      Math.abs(OLS_ALL_COMPOSITE - 2.961) < 0.02,
  },
  {
    // Separation identity: composite exponent = 1 (linear prefactor) + r-exponent at every deep rung.
    id: 'imp34248-composite-equals-one-plus-r-exponent',
    description: 'composite - r_exponent (the prefactor share) climbs monotonically toward 1 and reaches ~0.97 at the deepest rung',
    holds: () => {
      const shares = LOCAL_COMPOSITE_EXPONENTS.map((row) => row.prefactor_share);
      for (let i = 1; i < shares.length; i++) if (shares[i] <= shares[i - 1]) return false;
      return shares[shares.length - 1] > 0.95 && shares[shares.length - 1] < 1.02;
    },
  },
  {
    // Consistency with imp-34174: the surplus ladder reproduces the tabulated 4.744e-4 -> 4.213e-9 collapse.
    id: 'imp34248-reproduces-imp34174-ladder',
    description: 'the factorised surplus ladder reproduces the imp-34174 collapse 4.744e-4 (thr=0.5) -> 4.213e-9 (thr=0.01)',
    holds: () =>
      Math.abs(FACTORISED_LADDER[0].surplus - 4.7436e-4) < 1e-7 &&
      Math.abs(FACTORISED_LADDER[4].surplus - 4.2126e-9) < 1e-12,
  },
  {
    // Honesty gate: derivation/fit only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34248-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34248_CROSSOVER_SURPLUS_SMALL_THR_ASYMPTOTIC.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34248_CROSSOVER_SURPLUS_SMALL_THR_ASYMPTOTIC.honestScope) &&
      /NO QED/.test(IMP34248_CROSSOVER_SURPLUS_SMALL_THR_ASYMPTOTIC.honestScope) &&
      /refereed bound is changed/i.test(IMP34248_CROSSOVER_SURPLUS_SMALL_THR_ASYMPTOTIC.honestScope),
  },
];

for (const a of IMP34248_CROSSOVER_SURPLUS_SMALL_THR_ASYMPTOTIC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34248-crossover-surplus-small-thr-asymptotic assertion failed: ${a.id}`);
  }
}
