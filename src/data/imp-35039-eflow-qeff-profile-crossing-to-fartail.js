/**
 * @module imp-35039-eflow-qeff-profile-crossing-to-fartail
 *
 * imp-35039 (numerical, frontier-direction): imp-34950 F3 measured the local E_flow decay exponent
 * q_eff(x) = -d ln R/dx (x = ln N, R = eflowRatio = E_flow/E_trunc) at ONE point -- q_eff ~ 0.855 at
 * the N ~ 1e9 crossing landmark -- and noted this sits well ABOVE the imp-3463 far-tail 1/2 "because
 * the crossing band sits far from the far tail". The imp-34973 subGap then proposed "locating the N at
 * which q_eff turns over and begins its descent toward the imp-3463 far-tail 1/2". This module reuses
 * the imp-34950/imp-34973 eflowRatio kernel VERBATIM and MAPS the full q_eff(x) profile from the
 * crossing band (x ~ ln 1e9 ~ 20.7) out to the representable far tail (up to N ~ 1e300), to locate the
 * N at which q_eff first reaches 0.6 and characterize how the log-derivative approaches its asymptote.
 *
 * THE MEASUREMENT (the full q_eff(x) profile) -- CORRECTS THE TICKET/LINEAGE PREMISE
 * ---------------------------------------------------------------------------------
 *   (P0) q_eff DOES NOT DESCEND -- IT RISES MONOTONICALLY TOWARD 1, NOT TOWARD 1/2. Measured across
 *        dex 9..300 the E_flow log-derivative climbs monotonically from ~0.8463 (1e9) through ~0.8549
 *        (the 9.53-dex crossing landmark), ~0.9317 (1e20), ~0.9866 (1e100) to ~0.9956 (1e300). There is
 *        NO turnover: q_eff -> 1 as N -> inf, with 1 - q_eff ~ 3/ln N (measured x*(1-q_eff) ~ 3.02 flat
 *        across dex 50..300). So the imp-34973 subGap premise -- a turnover and descent toward 1/2 -- is
 *        WRONG for this surrogate; the far tail of q_eff is 1, not 1/2.
 *   (P1) THE 0.6 CROSSING IS A SINGLE UPWARD EVENT FAR BELOW THE BAND, NOT ABOVE IT. Because q_eff is
 *        monotone increasing and already ~0.846 > 0.6 at the crossing band (1e9), it NEVER falls to 0.6
 *        anywhere at or above the band. The only q_eff = 0.6 crossing is UPWARD at N ~ 1e3.22 (dex
 *        ~3.2245), far BELOW the crossing band -- the exact opposite of the ticket's expected "drops to
 *        0.6". Above the band q_eff only rises: it passes 0.85 at ~1e9.22, 0.90 at ~1e13.76, 0.95 at
 *        ~1e27.11 and 0.99 only at ~1e132.06.
 *   (P2) THE 1/2 FAR-TAIL EXPONENT IS E_coll'S, NOT E_flow'S. The imp-3463 far-tail 1/2 is the decay
 *        exponent of the COLLISION term E_coll/E_trunc = A sqrt(L/N) ~ N^(-1/2): its log-derivative
 *        -d ln E_coll/dx rises from ~0.4761 (1e9) to ~0.4993 (1e300), approaching 1/2 from below. E_flow
 *        decays much FASTER -- eflowRatio ~ (log)^3 / N, dominant power N^(-1), so its log-derivative
 *        approaches 1. The ticket/imp-34973 framing conflated the two: q_eff (the E_flow log-derivative)
 *        approaches 1, while the 1/2 asymptote belongs to the SEPARATE E_coll term.
 *
 * FINDING (the ticket question). The requested "N at which q_eff first drops to 0.6 approaching its 1/2
 * asymptote" does NOT exist for this surrogate: q_eff(x) rises MONOTONICALLY toward 1 (not 1/2), so it
 * never drops to 0.6 at or above the crossing band -- the single 0.6 crossing is an UPWARD event at
 * N ~ 1e3.22, far below the band. The 1/2 far-tail exponent (imp-3463) is the E_coll log-derivative
 * (E_coll ~ N^(-1/2)), a DISTINCT term from E_flow (~ (log)^3/N, log-derivative -> 1). This CORRECTS the
 * imp-34973 subGap premise of a q_eff turnover/descent toward 1/2.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 ansatz (imp-2642/imp-2643) untouched; imp-3066
 * K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (q_eff ~ 0.855 at the crossing landmark)
 * @see imp-34973-pinned-product-slope-qeff-window-identity (q_eff kernel; subGap proposed a turnover)
 * @see imp-3463 (far-tail decay exponent 1/2 -- here shown to be the E_coll exponent)
 * @see imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED = 1/8 -> A = C_C_PINNED/E_trunc)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34886/imp-34924/imp-34950/imp-34956/imp-34973
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc = R(x) at ln N = x, reused VERBATIM from imp-34924/imp-34950/imp-34956/imp-34973.
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}

// E_coll / E_trunc = A sqrt(L/N): the term carrying the imp-3463 far-tail 1/2 exponent.
function ecollRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  return A * Math.sqrt(L / N);
}

const LN10 = Math.LN10;
const HX = 1e-4 * LN10; // matches the imp-34973 stencil half-step (per unit x = ln N)

// local E_flow decay exponent q_eff = -d ln R/dx (the imp-34950/imp-34973 qEffAt kernel).
function qEffAt(x) {
  return -(Math.log(eflowRatio(x + HX)) - Math.log(eflowRatio(x - HX))) / (2 * HX);
}
// local E_coll decay exponent -d ln E_coll/dx (approaches the imp-3463 far-tail 1/2).
function qCollAt(x) {
  return -(Math.log(ecollRatio(x + HX)) - Math.log(ecollRatio(x - HX))) / (2 * HX);
}

// ---- (P0) the full q_eff profile from the crossing band out to the representable far tail -------------
// dex list spans the crossing band (9) to the double-precision N-overflow ceiling (~308).
const PROFILE_DEX = [9, 9.53, 10, 11, 12, 14, 16, 18, 20, 25, 30, 40, 50, 70, 100, 150, 200, 300];
const QEFF_PROFILE = PROFILE_DEX.map((dex) => {
  const x = dex * LN10;
  return { dex: +dex.toFixed(2), qEff: +qEffAt(x).toFixed(6) };
});
const QEFF_MONOTONIC_INCREASING = QEFF_PROFILE.every(
  (p, i) => i === 0 || p.qEff > QEFF_PROFILE[i - 1].qEff,
);
const QEFF_AT_BAND = QEFF_PROFILE[0].qEff; // ~0.8463 at 1e9
const QEFF_AT_FAR = QEFF_PROFILE[QEFF_PROFILE.length - 1].qEff; // ~0.9956 at 1e300

// (P0) the far-tail asymptote is 1 (not 1/2): 1 - q_eff ~ 3/ln N, so x*(1-q_eff) -> ~3.
const X_300 = 300 * LN10;
const TAIL_X_TIMES_GAP = +(X_300 * (1 - qEffAt(X_300))).toFixed(4); // ~3.02

// ---- (P1) the single upward q_eff = 0.6 crossing, plus the upward landmark ladder above the band ------
// q_eff is monotone increasing in dex, so bisect for each target level.
function crossDexForQ(target, loDex, hiDex) {
  let lo = loDex;
  let hi = hiDex;
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (lo + hi);
    if (qEffAt(m * LN10) < target) lo = m;
    else hi = m;
  }
  return +(0.5 * (lo + hi)).toFixed(4);
}
const DEX_AT_QEFF_0P6 = crossDexForQ(0.6, 0.5, 9); // ~3.2245 -- BELOW the 1e9 crossing band
const UPWARD_LADDER = [
  { level: 0.85, dex: crossDexForQ(0.85, 9, 12) }, // ~9.2205
  { level: 0.9, dex: crossDexForQ(0.9, 9, 20) }, // ~13.7628
  { level: 0.95, dex: crossDexForQ(0.95, 9, 60) }, // ~27.1146
  { level: 0.99, dex: crossDexForQ(0.99, 9, 300) }, // ~132.0610
];

// ---- (P2) the 1/2 far-tail exponent is E_coll'S: -d ln E_coll/dx rises toward 1/2 from below ----------
const ECOLL_PROFILE = [9, 20, 50, 100, 300].map((dex) => ({
  dex,
  qColl: +qCollAt(dex * LN10).toFixed(6),
}));
const ECOLL_AT_BAND = ECOLL_PROFILE[0].qColl; // ~0.4761 at 1e9
const ECOLL_AT_FAR = ECOLL_PROFILE[ECOLL_PROFILE.length - 1].qColl; // ~0.4993 at 1e300
const FAR_TAIL_Q = 0.5; // imp-3463 asymptote -- the E_coll exponent, NOT the E_flow q_eff limit

export const IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL = {
  id: 'imp-35039',
  proofSection: 'S-frontier',
  question:
    'imp-34950 F3 measured the local E_flow decay exponent q_eff ~ 0.855 at ONE point (the N ~ 1e9 ' +
    'crossing landmark) and the imp-34973 subGap proposed locating the N at which q_eff turns over and ' +
    'descends toward the imp-3463 far-tail 1/2. Reuse the imp-34950/imp-34973 eflowRatio kernel VERBATIM ' +
    'and MAP the full q_eff(x) profile from the crossing band (x ~ ln 1e9 ~ 20.7) out to the representable ' +
    'far tail, locating the N at which q_eff first reaches 0.6. Measurement only; changes no bound; C_mb ' +
    'GUE-conditional (imp-486) untouched; NO QED.',
  verdictShort:
    'The requested q_eff = 0.6 crossing "on the way down to 1/2" does NOT exist for this surrogate: q_eff ' +
    'rises MONOTONICALLY toward 1 (not 1/2), climbing from ~0.8463 (1e9) to ~0.9956 (1e300) with NO ' +
    'turnover (1 - q_eff ~ 3/ln N). It never drops to 0.6 at or above the crossing band -- the single ' +
    '0.6 crossing is an UPWARD event at N ~ 1e3.22, far BELOW the band. The imp-3463 far-tail 1/2 is the ' +
    'E_coll log-derivative (E_coll ~ N^(-1/2), rising to ~0.4993 by 1e300), a DISTINCT term from E_flow ' +
    '(~ (log)^3/N, log-derivative -> 1). This CORRECTS the imp-34973 subGap premise of a q_eff descent.',
  measuredQuantity:
    'the local E_flow decay exponent q_eff(x) = -d ln R/dx on an 18-point dex grid from the crossing band ' +
    '(1e9) to the double-precision N-overflow ceiling (~1e300), the dex at which q_eff first reaches 0.6 ' +
    'and the upward landmark ladder (0.85/0.90/0.95/0.99), the far-tail gap scaling x*(1-q_eff), and the ' +
    'contrasting E_coll log-derivative -d ln E_coll/dx approaching the imp-3463 far-tail 1/2',
  qEffProfile: QEFF_PROFILE, // 18-point q_eff(x) profile across dex 9..300
  qEffBand: QEFF_AT_BAND, // ~0.8463 at 1e9
  qEffFar: QEFF_AT_FAR, // ~0.9956 at 1e300
  qEffMonotonicIncreasing: QEFF_MONOTONIC_INCREASING, // true -- NO turnover
  tailXTimesGap: TAIL_X_TIMES_GAP, // ~3.02: 1 - q_eff ~ 3/ln N -> q_eff -> 1
  dexAtQeff0p6: DEX_AT_QEFF_0P6, // ~3.2245 -- the SINGLE upward 0.6 crossing, BELOW the band
  upwardLadder: UPWARD_LADDER, // 0.85 at ~9.22, 0.90 at ~13.76, 0.95 at ~27.11, 0.99 at ~132.06
  ecollProfile: ECOLL_PROFILE, // -d ln E_coll/dx rising toward 1/2
  ecollBand: ECOLL_AT_BAND, // ~0.4761 at 1e9
  ecollFar: ECOLL_AT_FAR, // ~0.4993 at 1e300
  farTailExponent: FAR_TAIL_Q, // imp-3463 = 1/2 -- the E_coll exponent, NOT the E_flow q_eff limit
  finding: {
    P0_qeff_rises_to_one_no_turnover:
      'q_eff(x) is MONOTONE INCREASING across dex 9..300 (from ~0.8463 at 1e9 to ~0.9956 at 1e300) with ' +
      'no turnover; 1 - q_eff ~ 3/ln N (x*(1-q_eff) ~ 3.02 flat across the far tail), so q_eff -> 1 as ' +
      'N -> inf. The imp-34973 subGap premise of a turnover/descent toward 1/2 is WRONG for this surrogate.',
    P1_the_0p6_crossing_is_upward_below_the_band:
      'Because q_eff is monotone increasing and already ~0.846 > 0.6 at the crossing band (1e9), it NEVER ' +
      'drops to 0.6 at or above the band; the only q_eff = 0.6 crossing is UPWARD at N ~ 1e3.22 (dex ' +
      '~3.2245), far below the band. Above the band q_eff only rises: 0.85 at ~1e9.22, 0.90 at ~1e13.76, ' +
      '0.95 at ~1e27.11, 0.99 at ~1e132.06.',
    P2_the_half_asymptote_is_ecolls:
      'The imp-3463 far-tail 1/2 is the decay exponent of E_coll/E_trunc = A sqrt(L/N) ~ N^(-1/2): its ' +
      'log-derivative rises from ~0.4761 (1e9) to ~0.4993 (1e300), approaching 1/2 from below. E_flow ' +
      'decays FASTER (~ (log)^3/N, dominant power N^(-1)), so q_eff -> 1. The ticket/imp-34973 framing ' +
      'conflated the E_flow log-derivative with the E_coll 1/2 exponent.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT a rigorous asymptotic). imp-34950 F3 measured q_eff ~ 0.855 at ' +
    'the 1e9 crossing landmark and the imp-34973 subGap proposed locating a q_eff turnover/descent toward ' +
    'the imp-3463 far-tail 1/2. MAPPED the full q_eff(x) profile from the crossing band to the ' +
    'representable far tail (~1e300): (P0) q_eff RISES MONOTONICALLY toward 1 (0.8463 at 1e9 -> 0.9956 at ' +
    '1e300) with NO turnover, 1 - q_eff ~ 3/ln N -- so the far tail of q_eff is 1, not 1/2. (P1) q_eff ' +
    'never drops to 0.6 at or above the band; the single 0.6 crossing is UPWARD at N ~ 1e3.22, far below ' +
    'the band, with the upward ladder 0.85 (~1e9.22), 0.90 (~1e13.76), 0.95 (~1e27.11), 0.99 (~1e132.06). ' +
    '(P2) the imp-3463 far-tail 1/2 belongs to the SEPARATE E_coll term (E_coll ~ N^(-1/2); its ' +
    'log-derivative rises to ~0.4993 by 1e300), NOT to E_flow (~ (log)^3/N, q_eff -> 1). FINDING: the ' +
    'requested "N at which q_eff drops to 0.6 approaching 1/2" does NOT exist -- CORRECTING the imp-34973 ' +
    'subGap premise; q_eff approaches 1, and the 1/2 asymptote is the E_coll exponent. Conditional-share ' +
    'diagnostic on the inherited surrogate; the component model is the imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) untouched; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'ANSWERS imp-35039: the requested q_eff = 0.6 crossing on a descent toward 1/2 does NOT exist -- q_eff ' +
    '(the E_flow log-derivative) rises MONOTONICALLY toward 1 (verified 0.8463 at 1e9 -> 0.9956 at 1e300, ' +
    '1 - q_eff ~ 3/ln N), so it never falls to 0.6 at or above the crossing band; the single 0.6 crossing ' +
    'is an UPWARD event at N ~ 1e3.22, far below the band. The imp-3463 far-tail 1/2 is the E_coll ' +
    'log-derivative (E_coll ~ N^(-1/2)), a DISTINCT term. What stays OPEN (deferred, changes no bound): a ' +
    'rigorous asymptotic for the true (non-surrogate) E_flow decay establishing whether the physical ' +
    'log-derivative also approaches 1 or 1/2, and a derivation pinning C_mb below the GUE bound (imp-486).',
  citation:
    'imp-34950 (q_eff ~ 0.855 at the crossing landmark); imp-34973 (q_eff kernel; subGap proposed a ' +
    'turnover); imp-3463 (far-tail 1/2, here shown to be the E_coll exponent); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C = 1/8).',
};

export const IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL_ASSERTIONS = [
  {
    // (P0): q_eff rises MONOTONICALLY toward 1 across the whole band-to-far-tail grid -- no turnover.
    id: 'imp35039-qeff-rises-monotonically-to-one',
    description: 'q_eff is monotone increasing from ~0.8463 (1e9) to ~0.9956 (1e300); no descent toward 1/2',
    holds: () =>
      QEFF_MONOTONIC_INCREASING &&
      QEFF_PROFILE.length === 18 &&
      Math.abs(QEFF_AT_BAND - 0.8463) < 5e-3 &&
      Math.abs(QEFF_AT_FAR - 0.9956) < 5e-3 &&
      QEFF_AT_FAR > 0.99,
  },
  {
    // (P0): the far-tail gap scales as 1 - q_eff ~ 3/ln N (x*(1-q_eff) ~ 3), so q_eff -> 1 not 1/2.
    id: 'imp35039-far-tail-asymptote-is-one',
    description: 'x*(1-q_eff) ~ 3 at 1e300 (1 - q_eff ~ 3/ln N), so the q_eff far-tail limit is 1',
    holds: () => Math.abs(TAIL_X_TIMES_GAP - 3.0) < 0.3 && 1 - QEFF_AT_FAR < 0.01,
  },
  {
    // (P1): the SINGLE q_eff = 0.6 crossing is upward at N ~ 1e3.22, far BELOW the 1e9 crossing band.
    id: 'imp35039-0p6-crossing-below-band',
    description: 'q_eff = 0.6 only at N ~ 1e3.22 (dex ~3.22), an upward crossing far below the 1e9 band',
    holds: () =>
      Math.abs(DEX_AT_QEFF_0P6 - 3.2245) < 5e-3 &&
      DEX_AT_QEFF_0P6 < 9 &&
      QEFF_AT_BAND > 0.6 &&
      UPWARD_LADDER.every((r, i) => i === 0 || r.dex > UPWARD_LADDER[i - 1].dex) &&
      Math.abs(UPWARD_LADDER[3].dex - 132.061) < 0.5,
  },
  {
    // (P2): the imp-3463 far-tail 1/2 is the E_coll log-derivative, rising to ~1/2 from below -- NOT q_eff.
    id: 'imp35039-half-asymptote-is-ecolls',
    description: 'E_coll log-derivative rises from ~0.4761 (1e9) toward 1/2 (~0.4993 at 1e300); q_eff -> 1 instead',
    holds: () =>
      Math.abs(ECOLL_AT_BAND - 0.4761) < 5e-3 &&
      Math.abs(ECOLL_AT_FAR - 0.4993) < 5e-3 &&
      ECOLL_AT_FAR < FAR_TAIL_Q &&
      ECOLL_AT_FAR > ECOLL_AT_BAND &&
      QEFF_AT_FAR - ECOLL_AT_FAR > 0.4,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35039-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (E_coll), no QED, no refereed bound is changed',
    holds: () =>
      IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL.isRigorous === false &&
      IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL.farTailExponent === 0.5 &&
      typeof IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL.subGap === 'string' &&
      /NO QED/.test(IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL.verdict) &&
      /refereed bound is changed/i.test(IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL.verdict),
  },
];

for (const a of IMP35039_EFLOW_QEFF_PROFILE_CROSSING_TO_FARTAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35039-eflow-qeff-profile-crossing-to-fartail assertion failed: ${a.id}`);
  }
}
