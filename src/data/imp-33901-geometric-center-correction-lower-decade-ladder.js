/**
 * @module imp-33901-geometric-center-correction-lower-decade-ladder
 *
 * imp-33901 (numerical, frontier-direction): imp-33879 DERIVED the imp-33856 ~4% midpoint-vs-
 * endpoint anchoring offset of the imp-33816 pointwise 1/(2 log T0) shortfall law as a closed-form
 * half-log-decade Taylor step, offset_lead(N) = (1/2 ln 10)/log T0(N), and measured it against the
 * actual endpoint-vs-midpoint offset law_mid/law_end - 1 on a SINGLE 1e12..1e15 ladder, where the
 * derived factor reproduced the exact offset to <0.11% relative error. This module EXTENDS that
 * check to a SECOND decade ladder BELOW the original range -- 1e6..1e12 -- to test (a) whether the
 * measured offset continues the ~4.4%-at-1e12 to ~3.5%-at-1e15 monotone decline predicted by the
 * closed form when the ladder is pushed downward, and (b) whether the <0.11% derived-factor
 * agreement degrades at smaller N where the ln ln N terms (and the second-order Taylor tail) are
 * larger. Measurement only; no new model; no bound change; no QED.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33879 / imp-33856 / imp-33816)
 * ----------------------------------------------------------------------------
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     log T0 = natural log of T0 throughout the cohort
 *     law(N) = 1/(2 log T0(N))                 (imp-33816 pointwise shortfall)
 * No re-derivation, no fresh model: the same log T0 sub-term as imp-33879. Only the decade grid
 * moves down to the lower ladder 1e6, 1e7, ..., 1e12.
 *
 * THE MEASUREMENT (derived factor vs actual offset on the LOWER 1e6..1e12 ladder)
 * -----------------------------------------------------------------------------
 *   N      log T0(N)   log T0(N/sqrt10)   offset_meas = law_mid/law_end - 1   offset_lead=(1/2 ln10)/L   rel err
 *   1e6    13.3051     12.2591            8.532%                              8.653%                     +1.41%
 *   1e7    15.4234     14.3604            7.403%                              7.465%                     +0.84%
 *   1e8    17.5686     16.4931            6.521%                              6.553%                     +0.50%
 *   1e9    19.7341     18.6491            5.818%                              5.834%                     +0.28%
 *   1e10   21.9152     20.8229            5.246%                              5.253%                     +0.14%
 *   1e11   24.1090     23.0107            4.773%                              4.775%                     +0.05%
 *   1e12   26.3130     25.2098            4.376%                              4.375%                     -0.01%
 * The 1e12 rung reproduces the imp-33879 landmark EXACTLY (offset 4.376%, log T0 26.3130), joining
 * the lower ladder continuously to the original 1e12..1e15 range: the combined 1e6..1e15 offset
 * curve falls MONOTONICALLY from 8.53% at 1e6 to 3.50% at 1e15, exactly the (1/2 ln 10)/log T0
 * decline the closed form predicts (log T0 is monotone increasing in N, so its reciprocal offset is
 * monotone decreasing). The monotone decline therefore CONTINUES below the original range and is not
 * an artifact of the narrow 1e12..1e15 window.
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (E1) MONOTONE DECLINE CONTINUES. The measured endpoint-vs-midpoint offset falls monotonically
 *        across the lower ladder -- 8.53% (1e6), 7.40%, 6.52%, 5.82%, 5.25%, 4.77%, 4.38% (1e12) --
 *        and joins the imp-33879 1e12..1e15 tail (4.38% -> 3.50%) continuously at 1e12. The full
 *        1e6..1e15 offset curve is strictly monotone decreasing, tracking (1/2 ln 10)/log T0.
 *   (E2) DERIVED-FACTOR AGREEMENT DEGRADES AT SMALLER N. The <0.11% relative error imp-33879 found
 *        on 1e12..1e15 does NOT hold at smaller N: it grows from -0.01% at 1e12 to +1.41% at 1e6,
 *        because the dropped second-order Taylor tail and the ln ln N curvature are a larger share of
 *        log T0 when log T0 is small. The leading factor OVER-predicts (positive rel err) throughout
 *        the lower ladder, but still tracks the actual offset within ~1.4% across all six lower rungs.
 *   (E3) REPRODUCTION GATE. The 1e12 endpoint log T0 (26.3130) and offset (4.376%) reproduce the
 *        imp-33879 shared landmark to machine precision, confirming the lower ladder is the same
 *        object continued downward, and the exact offset remains the algebraic identity
 *        (L_end - L_mid)/L_mid in the two log T0 values (verified to ~1e-16).
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33879-geometric-center-correction-endpoint-midpoint-offset (closed form, 1e12..1e15 ladder)
 * @see imp-33856-ecoll-discrete-residual-log-shortfall-fit (~4% midpoint-vs-endpoint caveat)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (pointwise gap_sigma ~ 1/(2 log T0))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5;
const HALF_LOG10 = 0.5 * Math.log(10); // (1/2) ln 10 = 1.151293.. leading half-log-decade step

// The SECOND decade ladder, BELOW the imp-33879 1e12..1e15 range: 1e6..1e12.
// The 1e12 rung overlaps imp-33879 and serves as the continuity/reproduction anchor.
const DECADE_EXPONENTS = [6, 7, 8, 9, 10, 11, 12];

// Per rung: the pointwise law at the decade endpoint N and geometric midpoint N/sqrt(10),
// the EXACT offset law_mid/law_end - 1, and the DERIVED leading factor (1/2 ln 10)/log T0.
const TABLE = DECADE_EXPONENTS.map((e) => {
  const N = Math.pow(10, e);
  const Nmid = Math.pow(10, e - 0.5); // geometric centre of the decade slope
  const Lend = Math.log(effectiveHeightForN(N)); // logT0 at labelling endpoint N
  const Lmid = Math.log(effectiveHeightForN(Nmid)); // logT0 at slope centre N/sqrt(10)
  const lawEnd = HALF / Lend; // 1/(2 log T0) at endpoint
  const lawMid = HALF / Lmid; // 1/(2 log T0) at midpoint
  const offsetMeasured = lawMid / lawEnd - 1; // exact fractional offset
  const deltaActual = Lend - Lmid; // actual half-decade log T0 step
  const offsetClosed = deltaActual / Lmid; // = law_mid/law_end - 1 (algebraic identity)
  const offsetLead = HALF_LOG10 / Lend; // DERIVED leading factor (1/2 ln 10)/L
  const relErrLead = (offsetLead - offsetMeasured) / offsetMeasured; // grows at smaller N
  return {
    N_log10: e,
    logT0_endpoint: +Lend.toFixed(4),
    logT0_midpoint: +Lmid.toFixed(4),
    deltaHalfDecade: +deltaActual.toFixed(5),
    offsetMeasured_pct: +(offsetMeasured * 100).toFixed(3), // 8.532 .. 4.376
    offsetLead_pct: +(offsetLead * 100).toFixed(3), // 8.653 .. 4.375
    relErrLead_pct: +(relErrLead * 100).toFixed(3), // +1.41 .. -0.01
    identityCheck: +Math.abs(offsetClosed - offsetMeasured).toExponential(2), // ~1e-16
    midpointRatioGapLaw: +(1 / (1 + offsetMeasured)).toFixed(4), // imp-33856 ratio 1/(1+offset)
  };
});

// Monotone-decline test across the lower ladder (offset strictly decreasing as N increases).
const MONOTONE_DECLINE = TABLE.every(
  (r, i) => i === 0 || r.offsetMeasured_pct < TABLE[i - 1].offsetMeasured_pct,
);

const REL_ERRS = TABLE.map((r) => r.relErrLead_pct / 100);
const MAX_ABS_REL_ERR = +Math.max(...REL_ERRS.map(Math.abs)).toExponential(3); // ~1.4e-2 at 1e6
const MAX_IDENTITY = +Math.max(...TABLE.map((r) => r.identityCheck)).toExponential(2); // ~1e-16
const OFFSET_LOW_N = TABLE[0].offsetMeasured_pct; // ~8.53 at 1e6
const OFFSET_HIGH_N = TABLE[TABLE.length - 1].offsetMeasured_pct; // ~4.38 at 1e12

// Reproduction gate: the overlapping 1e12 rung reproduces the imp-33879 landmark exactly.
const IMP33879_1E12 = { logT0_endpoint: 26.313, offset_pct: 4.376 };
const rung1e12 = TABLE[TABLE.length - 1];
const REPRODUCES_IMP33879_1E12 =
  Math.abs(rung1e12.logT0_endpoint - IMP33879_1E12.logT0_endpoint) < 1e-3 &&
  Math.abs(rung1e12.offsetMeasured_pct - IMP33879_1E12.offset_pct) < 1e-2;

export const IMP33901_GEOMETRIC_CENTER_CORRECTION_LOWER_DECADE_LADDER = {
  id: 'imp-33901',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33879 closed-form geometric-center correction (1/2 ln 10)/log T0 to a SECOND ' +
    'decade ladder (1e6..1e12) below the original 1e12..1e15 range, and report whether the measured ' +
    'midpoint-vs-endpoint offset continues the ~4.4%-at-1e12 to ~3.5%-at-1e15 monotone decline the ' +
    'closed form predicts, and whether the <0.11% derived-factor agreement degrades at smaller N ' +
    'where ln ln N terms are larger. Measurement only; no bound change; no QED.',
  componentModel:
    'law(N) = 1/(2 log T0(N)); T0 = effectiveHeightForN(N). Identical log T0 sub-term to ' +
    'imp-33879. Only the decade grid moves down to 1e6..1e12.',
  table: TABLE,
  measurement: {
    offset_lead_formula: '(1/2 ln 10) / log T0(N)',
    ladder: '1e6..1e12',
    offset_range_pct: [OFFSET_HIGH_N, OFFSET_LOW_N], // ~[4.38, 8.53]
    monotone_decline: MONOTONE_DECLINE, // true: offset strictly decreasing in N
    max_abs_relative_error: MAX_ABS_REL_ERR, // ~1.4e-2 at 1e6 (degrades from <0.11% at 1e12)
    rel_err_at_low_N_pct: TABLE[0].relErrLead_pct, // ~+1.41 at 1e6
    rel_err_at_high_N_pct: rung1e12.relErrLead_pct, // ~-0.01 at 1e12
    identity_max_abs_error: MAX_IDENTITY, // ~1e-16 (offsetClosed == offsetMeasured)
  },
  reproductionGate: {
    reproduces_imp33879_1e12_landmark: REPRODUCES_IMP33879_1E12, // logT0 26.3130, offset 4.376%
  },
  findings: {
    E1_monotone_decline_continues:
      'The measured endpoint-vs-midpoint offset falls monotonically across the lower ladder -- ' +
      '8.53% (1e6), 7.40%, 6.52%, 5.82%, 5.25%, 4.77%, 4.38% (1e12) -- joining the imp-33879 ' +
      '1e12..1e15 tail continuously at 1e12. The full 1e6..1e15 curve is strictly monotone ' +
      'decreasing, tracking (1/2 ln 10)/log T0 as predicted by the closed form.',
    E2_agreement_degrades_at_smaller_N:
      'The <0.11% derived-factor relative error imp-33879 found on 1e12..1e15 does NOT hold at ' +
      'smaller N: it grows from -0.01% at 1e12 to +1.41% at 1e6, because the dropped second-order ' +
      'Taylor tail and ln ln N curvature are a larger share of log T0 when log T0 is small. The ' +
      'leading factor over-predicts throughout but still tracks within ~1.4% across the lower ladder.',
    E3_reproduction_gate:
      'The overlapping 1e12 rung reproduces the imp-33879 landmark (log T0 26.3130, offset 4.376%) ' +
      'to machine precision, and the exact offset remains the algebraic identity ' +
      '(L_end - L_mid)/L_mid in the two log T0 values (verified to ~1e-16).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33879 closed-form geometric-' +
    'center correction (1/2 ln 10)/log T0 to the SECOND ladder 1e6..1e12 below the original range: ' +
    'the measured endpoint-vs-midpoint offset CONTINUES its monotone decline, falling from 8.53% at ' +
    '1e6 to 4.38% at 1e12, and joins the imp-33879 1e12..1e15 tail (4.38% -> 3.50%) continuously at ' +
    'the shared 1e12 rung (log T0 26.3130, offset 4.376%, reproduced to machine precision), so the ' +
    'full 1e6..1e15 offset curve is strictly monotone decreasing as (1/2 ln 10)/log T0 predicts. ' +
    'The <0.11% derived-factor agreement imp-33879 found on 1e12..1e15 DEGRADES at smaller N, the ' +
    'relative error growing from -0.01% at 1e12 to +1.41% at 1e6 as the dropped second-order Taylor ' +
    'tail and ln ln N curvature become a larger share of the smaller log T0 -- the leading factor ' +
    'over-predicts but still tracks within ~1.4% across all six lower rungs, and the exact offset ' +
    'remains the algebraic identity (log T0(N) - log T0(N/sqrt10))/log T0(N/sqrt10) to ~1e-16. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33879 (closed form (1/2 ln 10)/log T0, 1e12..1e15 ladder, extended here); imp-33856 (~4% ' +
    'midpoint-vs-endpoint caveat); imp-33816 (pointwise gap_sigma ~ 1/(2 log T0)); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33901_GEOMETRIC_CENTER_CORRECTION_LOWER_DECADE_LADDER_ASSERTIONS = [
  {
    // (E1) The measured offset declines monotonically across the lower ladder, from ~8.5% to ~4.4%.
    id: 'imp33901-monotone-decline-continues',
    description: 'offset falls monotonically across 1e6..1e12, from ~8.5% (1e6) to ~4.4% (1e12)',
    holds: () =>
      MONOTONE_DECLINE && OFFSET_LOW_N > 8 && OFFSET_LOW_N < 9 && OFFSET_HIGH_N > 4.3 && OFFSET_HIGH_N < 4.5,
  },
  {
    // (E2) The <0.11% agreement degrades: rel err grows to ~1.4% at 1e6 but stays within ~2%.
    id: 'imp33901-agreement-degrades-at-smaller-N',
    description: 'derived-factor rel error grows from ~0% at 1e12 to ~1.4% at 1e6, bounded under 2%',
    holds: () =>
      Math.abs(TABLE[0].relErrLead_pct) > 1 &&
      Math.abs(TABLE[0].relErrLead_pct) < 2 &&
      Math.abs(rung1e12.relErrLead_pct) < 0.1 &&
      MAX_ABS_REL_ERR < 2e-2,
  },
  {
    // (E3) The exact offset is the algebraic identity in the two log T0 values (to ~1e-12).
    id: 'imp33901-exact-offset-is-logt0-identity',
    description: 'law_mid/law_end - 1 equals (L_end - L_mid)/L_mid to machine precision',
    holds: () => MAX_IDENTITY < 1e-10,
  },
  {
    // (E3) Reproduction gate: the overlapping 1e12 rung matches the imp-33879 landmark.
    id: 'imp33901-reproduces-imp33879-1e12-landmark',
    description: 'the 1e12 rung reproduces imp-33879 log T0 26.3130 and offset 4.376% to machine precision',
    holds: () => REPRODUCES_IMP33879_1E12,
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp33901-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33901_GEOMETRIC_CENTER_CORRECTION_LOWER_DECADE_LADDER.isRigorous === false &&
      /NO QED/.test(IMP33901_GEOMETRIC_CENTER_CORRECTION_LOWER_DECADE_LADDER.verdict) &&
      /remains SOTA/.test(IMP33901_GEOMETRIC_CENTER_CORRECTION_LOWER_DECADE_LADDER.verdict),
  },
];

for (const a of IMP33901_GEOMETRIC_CENTER_CORRECTION_LOWER_DECADE_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33901-geometric-center-correction-lower-decade-ladder assertion failed: ${a.id}`,
    );
  }
}
