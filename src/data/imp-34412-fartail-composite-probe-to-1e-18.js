/**
 * @module imp-34412-fartail-composite-probe-to-1e-18
 *
 * imp-34412 (numerical, opus-4-8): Extend the imp-34329 far-tail
 * crossover-surplus probe to thr = 1e-18 to confirm the composite exponent keeps
 * climbing MONOTONICALLY toward 3, and quantify the residual to the limit deeper.
 *
 * THE OPEN QUESTION (imp-34329 F3)
 * -------------------------------
 * imp-34329 measured the deep-tail local composite exponent d log surplus /
 * d log thr climbing back toward 3 (2.872 -> 2.942) only out to thr = 1e-12
 * (N_cross ~ 1.195e34, log T0 ~ 76). It concluded the well-defined limit is
 * exactly 3 with a bounded correction ~ -c/log T0. But the climb was tabulated
 * only to thr = 1e-12: it was UNKNOWN whether the monotone climb continues three
 * more decade-pairs deeper, and how far the composite still sits below 3 there.
 *
 * THIS MODULE -- THREE DECADE-PAIRS DEEPER
 * ----------------------------------------
 * Reusing the IDENTICAL imp-34329/imp-34248/imp-34174/imp-33743 sub-terms
 * verbatim, this import-light self-asserting module extends the deep-tail probe
 * out to thr = 1e-18, adding the three new windows 1e-12->1e-14, 1e-14->1e-16 and
 * 1e-16->1e-18 past the imp-34329 endpoint.
 *
 * (F1) The evaluation stays IEEE-overflow-safe out to thr = 1e-18: N_cross recedes
 *      MONOTONICALLY as ~thr^-2 (1.340e38 at 1e-14, 1.485e42 at 1e-16, 1.630e46 at
 *      thr = 1e-18, log T0 ~ 103.6) and every factor N_cross, r, P, surplus stays
 *      finite and positive. (The ticket estimate N_cross ~ 6e41 / log T0 ~ 114 was
 *      a rough guess; the measured landmarks are N_cross ~ 1.630e46, log T0 ~ 103.6.)
 *
 * (F2) The composite exponent keeps climbing MONOTONICALLY toward 3 across all
 *      three new windows -- 2.94918 (1e-12->1e-14), 2.95451 (1e-14->1e-16),
 *      2.95882 (1e-16->1e-18) -- extending the imp-34329 climb (2.872 -> 2.942)
 *      with no plateau and no sign of stalling below 3. The r-exponent climbs with
 *      it, 1.94918 -> 1.95882, all still < 2.
 *
 * (F3) The residual to the limit shrinks as ~c/log T0 and is quantified deeper:
 *      3 - composite = 2 - r-exponent = 0.04118 at thr = 1e-18 (log T0 ~ 103.6),
 *      down from 0.05756 at thr = 1e-12 (log T0 ~ 76). The SECANT correction
 *      c = (2 - r-exponent) . log T0 has PEAKED (4.625 at the 1e-4->1e-6 window)
 *      and now DESCENDS monotonically -- 4.331, 4.296, 4.267 across the three new
 *      windows -- toward the imp-34407 analytically-derived limit c = 4, so the
 *      residual continues to shrink and the composite continues toward exactly 3.
 *
 * SO the imp-34329 monotone climb toward the exactly-3 limit is CONFIRMED three
 * decade-pairs deeper: at thr = 1e-18 the composite is 2.95882, still 0.04118
 * below 3, with the secant correction constant descending from its ~4.63 peak
 * toward the imp-34407 derived c = 4. No plateau, no reversal; the residual is
 * ~c/log T0 with c heading to 4, so composite -> 3 as thr -> 0.
 *
 * HONEST SCOPE -- measurement/fit ONLY, NO QED. This extends the inherited
 * imp-34329/imp-34248/imp-34174/imp-33743 extrapolation component model deeper; it
 * changes no bound and introduces no new mathematical claim. The component model
 * is NOT a rigorous asymptotic. E_flow is the benign mesoscopic-Gronwall term
 * (imp-2845); its vanishing here does NOT touch the divergent C_Lip
 * collision-Gronwall. The C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll
 * untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066
 * K_a >= 0 untouched; establishes no operator positivity; no refereed bound is changed.
 *
 * @see imp-34329-crossover-surplus-fartail-composite-limit (the deep probe to thr=1e-12 this extends)
 * @see imp-34407-fartail-composite-correction-constant-derivation (the derived correction limit c = 4)
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (the r ~ (log T0)^2 thr^2 factorisation)
 * @see imp-34174-crossover-surplus-threshold-family-decay (the closed form surplus(thr))
 * @see imp-33743-sigma-fartail-crossover-closed-form (generalised crossover N_cross(thr), identical sub-terms)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-34174/imp-34248/imp-34329 exactly (~1.000237)

// EXACT imp-34329/imp-34248 sub-terms (no re-derivation, no fresh model).
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
  // The fixed point N = K_thr log T0(N) converges logarithmically fast; 200 sweeps
  // are ample even at thr = 1e-18 (N_cross ~ 1.630e46) and stay finite.
  for (let i = 0; i < 200; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
function factors(thr) {
  const N = crossoverN(thr);
  const T0 = effectiveHeightForN(N);
  const r = eFlow(N) / E_TRUNC_PT;
  const P = (thr * (1 - thr)) / (1 + (1 - thr) * r); // prefactor -> thr as r,thr -> 0
  return { N, T0, r, P, surplus: P * r };
}
function localExponent(field, aThr, bThr) {
  const a = factors(aThr);
  const b = factors(bThr);
  return Math.log(b[field] / a[field]) / Math.log(bThr / aThr);
}

// ── Deep-tail ladder extended three decade-pairs past imp-34329 (thr=1e-12) ─────
const DEEP_THR = [1e-2, 1e-3, 1e-4, 1e-6, 1e-8, 1e-10, 1e-12, 1e-14, 1e-16, 1e-18];
const DEEP_LADDER = DEEP_THR.map((thr) => {
  const { N, T0, r, P, surplus } = factors(thr);
  return {
    thr: +thr.toExponential(0),
    N_cross: +N.toExponential(4),
    logT0: +Math.log(T0).toFixed(3),
    r_eflow_over_etrunc: +r.toExponential(4),
    surplus: +surplus.toExponential(4),
    prefactor_share: +(surplus / (thr * r)).toFixed(6), // -> 1
  };
});

// ── Local log-log exponents between adjacent deep rungs (secant readings) ───────
const DEEP_PROBE = DEEP_THR.slice(1).map((thr, k) => {
  const a = DEEP_THR[k];
  const rExp = localExponent('r', DEEP_THR[k], thr);
  const composite = localExponent('surplus', DEEP_THR[k], thr);
  const logT0 = Math.log(factors(thr).T0);
  return {
    window: `${a.toExponential(0)}->${thr.toExponential(0)}`,
    logT0: +logT0.toFixed(2),
    r_exponent: +rExp.toFixed(5),
    composite: +composite.toFixed(5),
    resid_to_3: +(3 - composite).toFixed(5), // how far the composite still sits below 3
    // secant correction c = (2 - r_exponent) . logT0 -> imp-34407 derived limit 4.
    correction_c: +((2 - rExp) * logT0).toFixed(3),
  };
});

// The three NEW windows past the imp-34329 thr = 1e-12 endpoint.
const NEW_WINDOWS = DEEP_PROBE.filter((p) => /1e-12|1e-14|1e-16/.test(p.window) && /1e-14|1e-16|1e-18/.test(p.window.split('->')[1]));
const DEEPEST = DEEP_PROBE[DEEP_PROBE.length - 1]; // 1e-16 -> 1e-18

export const IMP34412_FARTAIL_COMPOSITE_PROBE_TO_1E18 = {
  id: 'imp-34412',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-34329 far-tail crossover-surplus probe to thr = 1e-18 (three decade-pairs past its ' +
    'thr = 1e-12 endpoint) to confirm the composite exponent d log surplus / d log thr keeps climbing ' +
    'MONOTONICALLY toward 3 with no plateau, and quantify the residual 3 - composite deeper. ' +
    'Measurement/fit only within the inherited extrapolation component model; changes no bound; NO QED.',
  answer:
    'CONFIRMED three decade-pairs deeper. The evaluation stays IEEE-overflow-safe out to thr = 1e-18 ' +
    '(N_cross ~ 1.630e46, log T0 ~ 103.6, every factor finite and positive; the ticket N_cross ~ 6e41 / ' +
    'log T0 ~ 114 estimate was rough). The composite keeps climbing monotonically toward 3 across all ' +
    'three new windows -- 2.94918, 2.95451, 2.95882 -- with the r-exponent climbing 1.94918 -> 1.95882 ' +
    '(all < 2). The residual to the limit shrinks as ~c/log T0: 3 - composite = 0.04118 at thr = 1e-18, ' +
    'down from 0.05756 at thr = 1e-12, with the SECANT correction c = (2 - r-exponent) . log T0 past its ' +
    '~4.63 peak and descending 4.331 -> 4.296 -> 4.267 toward the imp-34407 derived limit c = 4. No ' +
    'plateau, no reversal -- the imp-34329 exactly-3 limit stands, reached logarithmically slowly.',
  deepLadder: DEEP_LADDER,
  deepProbe: DEEP_PROBE,
  newWindows: NEW_WINDOWS,
  finding: {
    F1_overflow_safe_to_1e18:
      'The probe stays IEEE-overflow-safe out to thr = 1e-18: N_cross recedes monotonically as ~thr^-2 ' +
      '(1.340e38 at 1e-14, 1.485e42 at 1e-16, 1.630e46 at 1e-18, log T0 ~ 103.6) and every factor ' +
      'N_cross, r, P, surplus stays finite and positive.',
    F2_composite_climbs_monotonically:
      'The composite exponent keeps climbing monotonically toward 3 across all three new windows -- ' +
      '2.94918 (1e-12->1e-14), 2.95451 (1e-14->1e-16), 2.95882 (1e-16->1e-18) -- extending the imp-34329 ' +
      'climb (2.872 -> 2.942) with no plateau and no stalling; the r-exponent climbs with it, ' +
      '1.94918 -> 1.95882, all still < 2.',
    F3_residual_shrinks_toward_c4:
      'The residual 3 - composite = 2 - r-exponent = 0.04118 at thr = 1e-18 (log T0 ~ 103.6), down from ' +
      '0.05756 at thr = 1e-12 (log T0 ~ 76). The secant correction c = (2 - r-exponent) . log T0 has ' +
      'peaked (4.625 at 1e-4->1e-6) and descends monotonically 4.331 -> 4.296 -> 4.267 across the three ' +
      'new windows toward the imp-34407 analytically-derived limit c = 4, so the residual keeps shrinking ' +
      'and the composite keeps heading to exactly 3.',
  },
  limitingCompositeExponent: 3,
  residualAt1e18: +DEEPEST.resid_to_3,
  isRigorous: false,
  honestScope:
    'Measurement/fit only within the inherited imp-34329/imp-34248/imp-34174/imp-33743 extrapolation ' +
    'component model; NO QED. The component model is NOT a rigorous asymptotic; E_flow is the benign ' +
    'mesoscopic-Gronwall term (imp-2845) and its vanishing here does NOT touch the divergent C_Lip ' +
    'collision-Gronwall; the C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator ' +
    'positivity; changes no bound; no refereed bound is changed.',
  citation:
    'imp-34329-crossover-surplus-fartail-composite-limit.js (the deep probe to thr=1e-12 this extends); ' +
    'imp-34407-fartail-composite-correction-constant-derivation.js (the derived correction limit c = 4); ' +
    'imp-34248-crossover-surplus-small-thr-asymptotic.js (the r ~ (log T0)^2 thr^2 factorisation); ' +
    'imp-34174-crossover-surplus-threshold-family-decay.js (closed form surplus(thr)); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34412_FARTAIL_COMPOSITE_PROBE_TO_1E18_ASSERTIONS = [
  {
    // F1: overflow-safe out to thr = 1e-18 -- every factor finite/positive, N_cross recedes monotonically.
    id: 'imp34412-overflow-safe-to-1e18',
    description: 'the deep ladder out to thr = 1e-18 is IEEE-overflow-safe: N_cross, r, surplus all finite and positive, N_cross recedes monotonically as ~thr^-2',
    holds: () => {
      const ok = (x) => Number.isFinite(x) && x > 0;
      for (const row of DEEP_LADDER) if (!ok(row.N_cross) || !ok(row.r_eflow_over_etrunc) || !ok(row.surplus)) return false;
      for (let i = 1; i < DEEP_LADDER.length; i++) if (!(DEEP_LADDER[i].N_cross > DEEP_LADDER[i - 1].N_cross)) return false;
      return true;
    },
  },
  {
    // F1 landmark: thr = 1e-18 lands at N_cross ~ 1.630e46 with log T0 ~ 103.6.
    id: 'imp34412-deepest-landmark',
    description: 'the deepest rung lands at N_cross ~ 1.6298e46 (thr = 1e-18) with log T0 ~ 103.63',
    holds: () => {
      const last = DEEP_LADDER[DEEP_LADDER.length - 1];
      return (
        last.thr === 1e-18 &&
        Math.abs(last.N_cross / 1.6298e46 - 1) < 1e-3 &&
        Math.abs(last.logT0 - 103.632) < 0.05
      );
    },
  },
  {
    // F2: the composite climbs MONOTONICALLY toward 3 across the whole deep probe, all rungs < 3.
    id: 'imp34412-composite-climbs-monotone',
    description: 'the local composite exponent climbs monotonically toward 3 across all deep windows out to thr = 1e-18 (all < 3), extending the imp-34329 climb with no plateau',
    holds: () => {
      const co = DEEP_PROBE.map((p) => p.composite);
      for (let i = 1; i < co.length; i++) if (!(co[i] > co[i - 1])) return false;
      return co.every((c) => c < 3) && DEEPEST.composite > 2.958 && DEEPEST.composite < 2.96;
    },
  },
  {
    // F2b: the r-exponent climbs monotonically back toward 2 across the deep probe (all < 2).
    id: 'imp34412-r-exponent-climbs-monotone',
    description: 'the local r-exponent climbs monotonically back toward 2 across the deep probe (1.876 -> 1.959, all < 2), the composite being the r-exponent plus the ->1 prefactor share',
    holds: () => {
      const re = DEEP_PROBE.map((p) => p.r_exponent);
      for (let i = 1; i < re.length; i++) if (!(re[i] > re[i - 1])) return false;
      return re.every((x) => x < 2) && DEEPEST.r_exponent > 1.958 && DEEPEST.r_exponent < 1.96;
    },
  },
  {
    // F3: the residual 3 - composite shrinks deeper -- 0.04118 at thr=1e-18, below the 0.05756 at thr=1e-12.
    id: 'imp34412-residual-shrinks-deeper',
    description: 'the residual to the limit 3 - composite = 2 - r_exponent shrinks with depth: ~0.0412 at thr = 1e-18, strictly below the ~0.0576 at thr = 1e-12',
    holds: () => {
      const resids = DEEP_PROBE.map((p) => p.resid_to_3);
      for (let i = 1; i < resids.length; i++) if (!(resids[i] < resids[i - 1])) return false;
      return (
        Math.abs(DEEPEST.resid_to_3 - 0.04118) < 5e-4 &&
        Math.abs(DEEPEST.resid_to_3 - (2 - DEEPEST.r_exponent)) < 1e-3
      );
    },
  },
  {
    // F3: the SECANT correction c has peaked (~4.63) and descends across the three new windows toward c = 4.
    id: 'imp34412-secant-c-descends-toward-4',
    description: 'the secant correction c = (2 - r_exponent) . logT0 has peaked (~4.625 at the 1e-4->1e-6 window) and descends monotonically across the three new deep windows (4.331 -> 4.296 -> 4.267) toward the imp-34407 derived limit c = 4',
    holds: () => {
      const cs = NEW_WINDOWS.map((p) => p.correction_c);
      if (NEW_WINDOWS.length !== 3) return false;
      for (let i = 1; i < cs.length; i++) if (!(cs[i] < cs[i - 1])) return false;
      const peak = Math.max(...DEEP_PROBE.map((p) => p.correction_c));
      return Math.abs(peak - 4.625) < 0.02 && cs[cs.length - 1] > 4.0 && cs[cs.length - 1] < peak;
    },
  },
  {
    // Continuity with imp-34329: the shared thr=1e-12 window reproduces composite ~2.9424 and r-exp ~1.9424.
    id: 'imp34412-continuity-with-imp34329',
    description: 'the shared thr = 1e-10 -> 1e-12 window reproduces the imp-34329 endpoint (composite ~2.9424, r-exponent ~1.9424), and the deepest prefactor share reaches ~0.9999',
    holds: () => {
      const shared = DEEP_PROBE.find((p) => p.window === '1e-10->1e-12');
      return (
        shared &&
        Math.abs(shared.composite - 2.94244) < 1e-3 &&
        Math.abs(shared.r_exponent - 1.94244) < 1e-3 &&
        DEEP_LADDER[DEEP_LADDER.length - 1].prefactor_share > 0.9998
      );
    },
  },
  {
    // Honesty gate: measurement/fit only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34412-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34412_FARTAIL_COMPOSITE_PROBE_TO_1E18.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34412_FARTAIL_COMPOSITE_PROBE_TO_1E18.honestScope) &&
      /NO QED/.test(IMP34412_FARTAIL_COMPOSITE_PROBE_TO_1E18.honestScope) &&
      /refereed bound is changed/i.test(IMP34412_FARTAIL_COMPOSITE_PROBE_TO_1E18.honestScope),
  },
];

for (const a of IMP34412_FARTAIL_COMPOSITE_PROBE_TO_1E18_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34412-fartail-composite-probe-to-1e-18 assertion failed: ${a.id}`);
  }
}
