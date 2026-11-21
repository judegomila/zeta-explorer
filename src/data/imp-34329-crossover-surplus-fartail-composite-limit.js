/**
 * @module imp-34329-crossover-surplus-fartail-composite-limit
 *
 * imp-34329 (numerical, opus-4-8): Extend the imp-34248 crossover-surplus ladder
 * to thr in {1e-3, 1e-4} (and a deep-tail probe to 1e-12) to determine whether a
 * well-defined LIMITING super-linear composite exponent exists, and its value.
 *
 * THE OPEN QUESTION (imp-34248 F2/F3)
 * -----------------------------------
 * imp-34248 factorised the imp-34174 crossover surplus into a linear prefactor
 * P(thr) -> thr and a log-softened E_flow ratio r(thr) ~ (log T0)^2 thr^2, giving
 * a super-linear composite ~thr^2.88 collapse (deep-tail OLS 2.878, all-rung
 * 2.961). Its F2 noted the LOCAL r-exponent DROPS below 2 deep in the tail
 * (2.985, 2.235, 1.978, 1.897) because log T0 = -2 log thr + ... grows as thr
 * shrinks. But the ladder stopped at thr = 0.01, so it was UNKNOWN whether the
 * composite exponent keeps drifting downward, stabilises, or reverses -- i.e.
 * whether a well-defined limiting composite exponent exists and what it is.
 *
 * THIS MODULE -- FAR-TAIL EXTENSION AND THE LIMIT
 * -----------------------------------------------
 * Reusing the IDENTICAL imp-34248/imp-34174/imp-33743 sub-terms verbatim, this
 * import-light self-asserting module extends the ladder to thr in {1e-3, 1e-4}
 * (N_cross receding to 5.432e15 and 6.165e17) and adds a deep-tail probe out to
 * thr = 1e-12 (N_cross ~ 1.195e34, log T0 ~ 76), all IEEE-overflow-safe.
 *
 * (F1) The far-tail N_cross log-T0 evaluation is overflow-safe: even at thr =
 *      1e-12 (N_cross ~ 1.195e34) every factor -- N_cross, r, P, surplus -- stays
 *      finite and positive; N_cross recedes MONOTONICALLY as ~thr^-2.
 *
 * (F2) The composite exponent does NOT keep drifting downward -- it REVERSES.
 *      The local d log surplus / d log thr reaches a shallow MINIMUM ~2.8711 in
 *      the 0.05->0.01 window and then climbs back up: 2.8721 (0.01->0.001),
 *      2.8863 (0.001->0.0001). So there is a turning point, not a monotone drift
 *      to a sub-3 plateau.
 *
 * (F3) The genuine LIMIT is the naive thr^3, approached logarithmically slowly.
 *      Past the turn, the local r-exponent climbs MONOTONICALLY back toward 2
 *      (1.876, 1.887, 1.904, 1.922, 1.934, 1.942 as log T0 grows 34.6 -> 76) and
 *      the composite climbs with it toward 3 (2.872 -> 2.942). The correction to
 *      the limit is ~ -O(1/log T0): fitting r-exponent = 2 - c/log T0 gives
 *      c ~ 4.4 across the deep probe, so r-exponent -> 2 and composite -> 3 as
 *      thr -> 0. The apparent ~2.88 "plateau" of imp-34248 is a FINITE-thr
 *      log-T0 softening artifact, NOT a well-defined sub-3 limiting exponent.
 *
 * SO the well-defined limiting composite exponent EXISTS and equals exactly 3
 * (surplus ~ thr^3): the log-T0 growth that softens r below thr^2 itself decays
 * as ~1/log T0, so the softening vanishes and the naive product-of-two-powers
 * reading is restored in the true thr -> 0 limit. The imp-34248 deep-tail 2.878
 * is a shallow-minimum reading, ~0.13 below the limit, taken right at the turn.
 *
 * HONEST SCOPE -- measurement/fit ONLY, NO QED. This extends and fits the
 * inherited imp-34174/imp-33743 extrapolation component model; it changes no
 * bound and introduces no new mathematical claim. The component model is NOT a
 * rigorous asymptotic. E_flow is the benign mesoscopic-Gronwall term (imp-2845);
 * its vanishing here does NOT touch the divergent C_Lip collision-Gronwall. The
 * C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * establishes no operator positivity; no refereed bound is changed.
 *
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (the factorisation and the thr>=0.01 ladder this extends)
 * @see imp-34174-crossover-surplus-threshold-family-decay (the closed form surplus(thr))
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised crossover N_cross(thr), identical sub-terms)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 * @see imp-34326-widening-slope-background-reconciliation (sibling: same k*~21.281-ceiling era, widening-slope background reconciliation)
 * @see imp-34327-widening-slope-minus-one-crossing-location (sibling: same era, exact -1 crossing of the widening-slope background)
 * @see imp-34330-widening-residual-prepole-reversal (sibling: same era, pre-pole residual sign-change reversal)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-34174/imp-34248 exactly (~1.000237)

// EXACT imp-34248 sub-terms (no re-derivation, no fresh model).
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
  // The fixed point N = K_thr log T0(N) converges logarithmically fast; 120 sweeps
  // are ample even in the far tail (thr = 1e-12, N_cross ~ 1.195e34) and stay finite.
  for (let i = 0; i < 120; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}

// surplus(thr) = P(thr) . r(thr), P(thr) = thr(1-thr)/(1 + (1-thr)r) (imp-34174).
function factors(thr) {
  const N = crossoverN(thr);
  const T0 = effectiveHeightForN(N);
  const r = eFlow(N) / E_TRUNC_PT;
  const P = (thr * (1 - thr)) / (1 + (1 - thr) * r); // prefactor -> thr as r,thr -> 0
  const surplus = P * r;
  return { N, T0, r, P, surplus };
}

// ── Extended ladder: imp-34248 rungs {0.5..0.01} PLUS the new far-tail {1e-3, 1e-4} ──
const THRESHOLDS = [0.5, 0.3, 0.1, 0.05, 0.01, 1e-3, 1e-4];
const EXTENDED_LADDER = THRESHOLDS.map((thr) => {
  const { N, T0, r, P, surplus } = factors(thr);
  return {
    thr,
    N_cross: +N.toExponential(4),
    logT0: +Math.log(T0).toFixed(4),
    r_eflow_over_etrunc: +r.toExponential(4),
    prefactor_P: +P.toExponential(4),
    surplus: +surplus.toExponential(4),
    surplus_over_thr_r: +(surplus / (thr * r)).toFixed(6), // prefactor share -> 1
  };
});

// ── Local log-log exponents between adjacent extended-ladder rungs ────────────
function localExponent(field, aThr, bThr) {
  const a = factors(aThr);
  const b = factors(bThr);
  return Math.log(b[field] / a[field]) / Math.log(bThr / aThr);
}
const LOCAL_EXPONENTS = THRESHOLDS.slice(1).map((thr, k) => ({
  window: `${THRESHOLDS[k]}->${thr}`,
  composite: +localExponent('surplus', THRESHOLDS[k], thr).toFixed(4), // d log surplus / d log thr
  r_exponent: +localExponent('r', THRESHOLDS[k], thr).toFixed(4), // d log r / d log thr
  prefactor_share: +(localExponent('surplus', THRESHOLDS[k], thr) - localExponent('r', THRESHOLDS[k], thr)).toFixed(4),
}));

// ── Deep-tail probe: does the r-exponent climb back toward 2 (composite -> 3)? ──
// Decade-and-two-decade windows out to thr = 1e-12, each tagged with the endpoint
// log T0 and the -c/log T0 correction constant c = (2 - r_exponent) . log T0.
const DEEP_THR = [1e-2, 1e-3, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12];
const DEEP_PROBE = DEEP_THR.slice(1).map((thr, k) => {
  const a = DEEP_THR[k];
  const rExp = localExponent('r', DEEP_THR[k], thr);
  const composite = localExponent('surplus', DEEP_THR[k], thr);
  const T0 = factors(thr).T0;
  const logT0 = Math.log(T0);
  return {
    window: `${a.toExponential(0)}->${thr.toExponential(0)}`,
    logT0: +logT0.toFixed(2),
    r_exponent: +rExp.toFixed(5),
    composite: +composite.toFixed(5),
    // r_exponent = 2 - c/logT0 : c should be roughly constant (~4.4), so r_exponent -> 2.
    correction_c: +((2 - rExp) * logT0).toFixed(3),
  };
});

export const IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT = {
  id: 'imp-34329',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-34248 crossover-surplus ladder to thr in {1e-3, 1e-4} (N_cross receding ~thr^-2 ' +
    'into the far tail, log-T0 evaluation guarded against IEEE overflow) and measure whether the ' +
    'super-linear composite exponent d log surplus / d log thr keeps drifting downward, stabilises, or ' +
    'reverses -- determining whether a well-defined limiting composite exponent exists and its value. ' +
    'Measurement/fit only within the inherited extrapolation component model; changes no bound; NO QED.',
  answer:
    'The composite exponent REVERSES. It reaches a shallow minimum ~2.8711 in the 0.05->0.01 window, ' +
    'then climbs back up (2.8721, 2.8863) as the ladder extends to thr = 1e-3, 1e-4. A deep-tail probe ' +
    'out to thr = 1e-12 shows the local r-exponent climbing monotonically back toward 2 (1.876 -> 1.942 ' +
    'as log T0 grows 34.6 -> 76) with a bounded correction r-exponent = 2 - c/log T0, c ~ 4.4, so the ' +
    'WELL-DEFINED limiting composite exponent EXISTS and equals exactly 3 (surplus ~ thr^3), reached ' +
    'logarithmically slowly. The imp-34248 deep-tail ~2.878 is a shallow-minimum reading ~0.13 below ' +
    'the limit, taken right at the turn -- NOT a genuine sub-3 plateau.',
  extendedLadder: EXTENDED_LADDER,
  localExponents: LOCAL_EXPONENTS,
  deepProbe: DEEP_PROBE,
  finding: {
    F1_fartail_overflow_safe:
      'The far-tail N_cross log-T0 evaluation is IEEE-overflow-safe: even at thr = 1e-12 (N_cross ~ 1.195e34, ' +
      'log T0 ~ 76) every factor N_cross, r, P, surplus stays finite and positive, and N_cross recedes ' +
      'monotonically as ~thr^-2 (5.432e15 at thr=1e-3, 6.165e17 at thr=1e-4).',
    F2_composite_reverses:
      'The composite d log surplus / d log thr does NOT keep drifting downward: it reaches a shallow ' +
      'minimum ~2.8711 in the 0.05->0.01 window and then REVERSES upward -- 2.8721 (0.01->0.001), 2.8863 ' +
      '(0.001->0.0001) -- a turning point, not a monotone drift to a sub-3 plateau.',
    F3_limit_is_cubic:
      'The well-defined limit is the naive thr^3: past the turn the local r-exponent climbs monotonically ' +
      'back toward 2 (1.876, 1.887, 1.904, 1.922, 1.934, 1.942 as log T0 grows 34.6 -> 76) and the ' +
      'composite climbs with it toward 3 (2.872 -> 2.942). The correction to the limit is ~ -c/log T0 ' +
      'with c ~ 4.4 roughly constant, so r-exponent -> 2 and composite -> 3 as thr -> 0. The log-T0 ' +
      'softening that lifts r above thr^2 itself decays as ~1/log T0 and vanishes in the limit.',
  },
  limitingCompositeExponent: 3,
  isRigorous: false,
  honestScope:
    'Measurement/fit only within the inherited imp-34248/imp-34174/imp-33743 extrapolation component ' +
    'model; NO QED. The component model is NOT a rigorous asymptotic; E_flow is the benign ' +
    'mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent C_Lip ' +
    'collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator ' +
    'positivity; changes no bound; no refereed bound is changed.',
  citation:
    'imp-34248-crossover-surplus-small-thr-asymptotic.js (the factorisation and thr>=0.01 ladder this ' +
    'extends); imp-34174-crossover-surplus-threshold-family-decay.js (closed form surplus(thr)); ' +
    'imp-33743-sigma-fartail-crossover-closed-form.js (generalised crossover N_cross(thr), identical ' +
    'sub-terms); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT_ASSERTIONS = [
  {
    // F1: the far-tail extension is overflow-safe -- every factor finite and positive, N_cross recedes.
    id: 'imp34329-fartail-overflow-safe',
    description: 'the thr in {1e-3, 1e-4} and deep-probe rungs are IEEE-overflow-safe: N_cross, r, surplus all finite and positive, N_cross recedes monotonically',
    holds: () => {
      const ok = (x) => Number.isFinite(x) && x > 0;
      for (const row of EXTENDED_LADDER) if (!ok(row.N_cross) || !ok(row.r_eflow_over_etrunc) || !ok(row.surplus)) return false;
      for (let i = 1; i < EXTENDED_LADDER.length; i++) if (!(EXTENDED_LADDER[i].N_cross > EXTENDED_LADDER[i - 1].N_cross)) return false;
      for (const p of DEEP_PROBE) if (!Number.isFinite(p.r_exponent) || !Number.isFinite(p.composite)) return false;
      return true;
    },
  },
  {
    // Far-tail landmarks: N_cross ~ 5.43e15 (thr=1e-3) and ~6.16e17 (thr=1e-4).
    id: 'imp34329-fartail-ncross-landmarks',
    description: 'the new far-tail rungs land at N_cross ~ 5.432e15 (thr=1e-3) and ~6.165e17 (thr=1e-4)',
    holds: () => {
      const r3 = EXTENDED_LADDER[5];
      const r4 = EXTENDED_LADDER[6];
      return (
        r3.thr === 1e-3 && Math.abs(r3.N_cross / 5.4323e15 - 1) < 1e-3 &&
        r4.thr === 1e-4 && Math.abs(r4.N_cross / 6.1649e17 - 1) < 1e-3
      );
    },
  },
  {
    // F2: the composite exponent REVERSES -- a shallow minimum ~2.871 then climbs back up.
    id: 'imp34329-composite-reverses',
    description: 'the local composite exponent reaches a shallow minimum ~2.871 (0.05->0.01) and then climbs back up (2.8721, 2.8863), i.e. it reverses rather than drifting down',
    holds: () => {
      const c = LOCAL_EXPONENTS.map((row) => row.composite);
      const minIdx = c.indexOf(Math.min(...c));
      // minimum is interior (the 0.05->0.01 window, index 3), and the tail rungs after it INCREASE.
      return (
        Math.abs(Math.min(...c) - 2.8711) < 0.01 &&
        minIdx === 3 &&
        c[4] > c[3] &&
        c[5] > c[4]
      );
    },
  },
  {
    // F3: the deep-tail r-exponent climbs MONOTONICALLY back toward 2 (never reaching it), composite -> 3.
    id: 'imp34329-r-exponent-climbs-toward-2',
    description: 'the deep-tail local r-exponent climbs monotonically back toward 2 (1.876 -> 1.942, all < 2) and the composite climbs with it toward 3 (< 3)',
    holds: () => {
      const re = DEEP_PROBE.map((p) => p.r_exponent);
      const co = DEEP_PROBE.map((p) => p.composite);
      for (let i = 1; i < re.length; i++) if (!(re[i] > re[i - 1])) return false;
      for (let i = 1; i < co.length; i++) if (!(co[i] > co[i - 1])) return false;
      return re[0] > 1.87 && re[re.length - 1] > 1.94 && re[re.length - 1] < 2 && co[co.length - 1] < 3;
    },
  },
  {
    // F3 model: the correction r-exponent = 2 - c/logT0 has a bounded, roughly constant c ~ 4.4 -> limit 2/3.
    id: 'imp34329-correction-constant-bounded',
    description: 'the -c/logT0 correction constant c = (2 - r_exponent) . logT0 stays bounded ~4.3-4.7 across the deep probe, confirming r-exponent -> 2 and composite -> 3',
    holds: () => {
      const cs = DEEP_PROBE.map((p) => p.correction_c);
      return cs.every((c) => c > 4.0 && c < 5.0);
    },
  },
  {
    // Continuity with imp-34248: the shared thr=0.01 rung reproduces surplus 4.2126e-9.
    id: 'imp34329-continuity-with-imp34248',
    description: 'the extended ladder reproduces the imp-34248 thr=0.01 rung (surplus ~4.2126e-9) and the prefactor share reaches ~0.9999 at thr=1e-4',
    holds: () =>
      Math.abs(EXTENDED_LADDER[4].surplus - 4.2126e-9) < 1e-12 &&
      EXTENDED_LADDER[6].surplus_over_thr_r > 0.9998,
  },
  {
    // Honesty gate: measurement/fit only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34329-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT.honestScope) &&
      /NO QED/.test(IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT.honestScope) &&
      /refereed bound is changed/i.test(IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT.honestScope),
  },
];

for (const a of IMP34329_CROSSOVER_SURPLUS_FARTAIL_COMPOSITE_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34329-crossover-surplus-fartail-composite-limit assertion failed: ${a.id}`);
  }
}
