/**
 * @module imp-34970-ecoll-log-slope-band-and-reconciliation
 *
 * imp-34970 (numerical, frontier-direction): imp-34954 reconciled the L1-L3 landmark
 * gap to floating point AT N_cross using the MEASURED local log-slope
 * d ln E_coll / d ln N = -0.47729 (NOT the ideal -1/2) plus the E_flow drift across the
 * gap, but measured that slope at ONE point only. This module MEASURES the E_coll local
 * log-slope across the FULL imp-34693 N-band (1e6 .. 1e13), assesses whether it drifts
 * toward -1/2 as N grows, and RE-RUNS the imp-34954 surplus -> L1-L3-gap reconciliation
 * band-wide (at each rung, not only at N_cross).
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-34954 / imp-34923 / imp-33601)
 * ----------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent fixed strip, imp-2631)
 *     T0      = effectiveHeightForN(N)             (Riemann-von Mangoldt inverse)
 *     GRONWALL= exp(2.37e-4)                       (matches imp-34954/imp-34923 exactly)
 *
 * THE E_coll LOG-SLOPE IDENTITY (why it is NOT -1/2, and how it drifts)
 * --------------------------------------------------------------------
 * Since ln E_coll = ln C_C + (1/2)(ln L - ln N) with L = log T0,
 *
 *     d ln E_coll / d ln N = -1/2 + (1/2) * (d ln L / d ln N).
 *
 * The log T0 / N drift term d ln L / d ln N > 0 makes E_coll decay SLOWER than N^{-1/2},
 * so the slope sits ABOVE -1/2. As N grows, T0 grows and d ln L / d ln N ~ 1/(ln T0 * ...)
 * shrinks toward 0, so the slope drifts TOWARD -1/2 -- but only LOGARITHMICALLY SLOWLY:
 * it is still only -0.48313 at N = 1e13 (deficit -0.5 - slope ~ +0.01687), and never
 * reaches -1/2 at any finite N. This band-wide measurement CONFIRMS the -0.47729 that
 * imp-34954 found at N_cross ~3.28e9 is a single point on a slowly-drifting curve, not a
 * fixed constant.
 *
 * THE BAND-WIDE RECONCILIATION (generalizing imp-34954 off N_cross)
 * ----------------------------------------------------------------
 * At the physical crossover N_cross, E_trunc = E_coll(N_cross) and the sigma = 1/2 half
 * point N_half < N_cross satisfies E_coll(N_half) = E_trunc + E_flow(N_half). imp-34954
 * showed the relative-N gap G = (N_cross - N_half)/N_cross is reproduced by
 *
 *     G = 1 - exp( ln(1 + r_half) / slope ),   r_half := E_flow(N_half)/E_trunc,
 *
 * to ~4e-6 at N_cross. This is EXACT up to the constant-slope approximation of E_coll
 * over the tiny interval [N_half, N_cross]. To run it band-wide we treat EACH ladder rung
 * N_c as a hypothetical crossover with a local E_trunc = E_coll(N_c); then the local
 * surplus 1/2 - sigma(N_c) = r/(2(2+r)) is exact by construction (r := E_flow(N_c)/E_coll(N_c)),
 * and we test whether the same G-conversion stays floating-point-exact at every rung.
 *
 * WHAT WE FIND BAND-WIDE
 * ----------------------
 *   (Q1) SLOPE DRIFT: the measured slope rises MONOTONICALLY toward -1/2 as N grows:
 *        -0.46570 (1e6), -0.46997 (1e7), ... , -0.47608 (1e9), ... , -0.48313 (1e13).
 *        The identity slope = -1/2 + (1/2) d ln L/d ln N holds to ~1e-9 at every rung.
 *        The approach is only logarithmic: the deficit halves over ~7 decades of N.
 *   (Q2) LEADING conversion (2r, constant E_flow, ideal -1/2 slope) reproduces the local
 *        gap to a residual that STAYS ~3.4%..7.1% across the whole band (~4.9% at 1e9,
 *        confirming the ~4.6% imp-34954 found near N_cross is representative, not special).
 *   (Q3) FULL-REFINED conversion (measured local slope + E_flow drift r_half) stays
 *        FLOATING-POINT-SMALL band-wide and TIGHTENS with N: residual 1.5e-4 (1e6),
 *        7.0e-6 (1e9), down to 9.3e-8 (1e13). The tightening is because the gap shrinks
 *        with N (r decays), so the constant-slope approximation over [N_half, N_c] gets
 *        better. The imp-34954 ~4e-6 at N_cross sits between the 1e9 and 1e10 rungs.
 *
 * The punchline: imp-34954's floating-point reconciliation is NOT a coincidence at
 * N_cross -- it is band-wide, with the residual monotonically tightening as N grows and
 * the measured E_coll log-slope monotonically approaching (but never reaching at finite N)
 * the ideal -1/2.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34954-surplus-closed-form-vs-landmark-gap-crosscheck (the -0.47729 slope and
 *      the floating-point reconciliation AT N_cross that this generalizes band-wide)
 * @see imp-34923-gronwall-halving-surplus-identity-derivation (surplus closed form r/(2(2+r)))
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (leading (1+r)^2 N-gap prediction)
 * @see imp-34693 (the 1e6 .. 1e13 admissible band this ladder spans)
 * @see imp-3444 (E_coll=E_trunc crossover); imp-33582 (sigma=1/2 halving landmark);
 *      imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34954/imp-34923 exactly

// EXACT imp-34954/imp-34923/imp-3406 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Central-difference log-slope in log N (h = 1e-4), matching imp-34954 exactly.
const H = 1e-4;
function logSlope(getter, N) {
  const ln = Math.log(N);
  return (
    (Math.log(getter(parts(Math.exp(ln + H)))) - Math.log(getter(parts(Math.exp(ln - H)))))
    / (2 * H)
  );
}
const eCollLogSlope = (N) => logSlope((p) => p.E_coll, N);
const lnLLogSlope = (N) => logSlope((p) => p.L, N);

// Downslope bisection in log N (imp-34954 crossBelow).
function crossBelow(f, target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (f(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The physical imp-3444 crossover, used to anchor the band to imp-34954.
const N_CROSS = crossBelow((N) => parts(N).E_coll, E_TRUNC_PT, 1e6, 1e18); // ~3.280e9
const SLOPE_AT_N_CROSS = eCollLogSlope(N_CROSS); // ~-0.47729 (reproduces imp-34954)

// Band-wide local half-crossing: with E_trunc_local = E_coll(N_c), find N_h < N_c where
// sigma = 1/2, i.e. E_coll(N_h) = E_coll(N_c) + E_flow(N_h).
function findLocalHalf(N_c) {
  const eColl_c = parts(N_c).E_coll;
  const g = (N) => parts(N).E_coll - eColl_c - parts(N).E_flow; // >0 below N_c, decreasing
  let a = Math.log(N_c / 10);
  let b = Math.log(N_c);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (g(Math.exp(m)) > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const RUNGS = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13]; // the imp-34693 band

const BAND = RUNGS.map((Nc) => {
  const pc = parts(Nc);
  const eTruncLocal = pc.E_coll; // treat this rung as a hypothetical crossover
  const r = pc.E_flow / eTruncLocal; // local E_flow/E_trunc
  const slope = eCollLogSlope(Nc);
  const dlnL = lnLLogSlope(Nc);
  const Nh = findLocalHalf(Nc);
  const ph = parts(Nh);
  const rHalf = ph.E_flow / eTruncLocal; // r_half > r (E_flow rises toward N_h)
  const G_meas = (Nc - Nh) / Nc;
  const G_lead = 2 * r; // leading: constant E_flow, ideal -1/2 slope
  const G_slope = 1 - Math.exp(Math.log(1 + r) / slope); // measured slope, constant E_flow
  const G_full = 1 - Math.exp(Math.log(1 + rHalf) / slope); // measured slope + E_flow drift
  return {
    N: Nc,
    slope,
    dlnL_dlnN: dlnL,
    slope_identity: -0.5 + 0.5 * dlnL, // must equal slope
    r,
    rHalf,
    G_meas,
    resid_leading: Math.abs(G_meas - G_lead) / G_meas,
    resid_slope: Math.abs(G_meas - G_slope) / G_meas,
    resid_full: Math.abs(G_meas - G_full) / G_meas,
  };
});

const SLOPE_1E6 = BAND[0].slope; // ~-0.46570
const SLOPE_1E13 = BAND[BAND.length - 1].slope; // ~-0.48313
const MAX_RESID_FULL = Math.max(...BAND.map((b) => b.resid_full)); // ~1.52e-4 (at 1e6)
const RESID_FULL_1E13 = BAND[BAND.length - 1].resid_full; // ~9.27e-8

export const IMP34970_ECOLL_LOG_SLOPE_BAND_AND_RECONCILIATION = {
  id: 'imp-34970',
  proofSection: 'S-frontier',
  question:
    'imp-34954 reconciled the L1-L3 landmark gap to floating point AT N_cross using the measured local ' +
    'log-slope d ln E_coll/d ln N = -0.47729 (not -1/2) plus the E_flow drift, but measured that slope at one ' +
    'point only. Reuse the imp-34954/imp-33601 component model verbatim, MEASURE the E_coll log-slope across ' +
    'the full imp-34693 band (1e6 .. 1e13), assess its approach to -1/2, and RE-RUN the surplus -> L1-L3-gap ' +
    'reconciliation band-wide. Measurement only; C_mb GUE-conditional per imp-486 untouched; changes no bound; no QED.',
  measuredQuantity:
    'the local log-slope d ln E_coll/d ln N and its identity decomposition -1/2 + (1/2) d ln L/d ln N at each ' +
    'rung 1e6 .. 1e13, the monotone drift of the slope toward -1/2, and the band-wide residuals of the leading, ' +
    'measured-slope, and full-refined (measured slope + E_flow drift) sigma-to-N gap conversions at each rung.',
  anchorToImp34954: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    slope_at_N_cross: +SLOPE_AT_N_CROSS.toFixed(8), // ~-0.47728831 (reproduces imp-34954)
  },
  slopeBand: BAND.map((b) => ({
    N: +b.N.toExponential(0),
    d_ln_Ecoll_d_ln_N: +b.slope.toFixed(8),
    d_ln_L_d_ln_N: +b.dlnL_dlnN.toFixed(8),
    identity_minus_half_plus_half_dlnL: +b.slope_identity.toFixed(8), // == slope
  })),
  slopeDrift: {
    slope_at_1e6: +SLOPE_1E6.toFixed(8), // ~-0.46570
    slope_at_1e13: +SLOPE_1E13.toFixed(8), // ~-0.48313
    deficit_below_half_at_1e13: +(-0.5 - SLOPE_1E13).toFixed(8), // ~+0.01687 (slope still above -1/2)
    monotone_toward_minus_half: true,
    note:
      'The slope drifts MONOTONICALLY toward -1/2 as N grows but only logarithmically slowly (the log T0/N ' +
      'drift term d ln L/d ln N shrinks like ~1/ln T0): still only -0.48313 at N=1e13, never -1/2 at finite N. ' +
      'The identity slope = -1/2 + (1/2) d ln L/d ln N holds to ~1e-9 at every rung.',
  },
  reconciliationBand: BAND.map((b) => ({
    N: +b.N.toExponential(0),
    r_Eflow_over_Etrunc: +b.r.toExponential(4),
    G_measured: +b.G_meas.toExponential(6),
    resid_leading_2r: +b.resid_leading.toExponential(3),
    resid_measured_slope: +b.resid_slope.toExponential(3),
    resid_full_slope_plus_eflow_drift: +b.resid_full.toExponential(3),
  })),
  reconciliationSummary: {
    max_resid_full_over_band: +MAX_RESID_FULL.toExponential(3), // ~1.524e-4 (at 1e6)
    resid_full_at_1e13: +RESID_FULL_1E13.toExponential(3), // ~9.270e-8
    note:
      'The full-refined conversion (measured local slope + E_flow drift r_half) stays floating-point-small ' +
      'across the WHOLE band and TIGHTENS with N: 1.5e-4 at 1e6 down to 9.3e-8 at 1e13. The leading 2r ' +
      'conversion holds a ~3.4%..7.1% residual band-wide, confirming the ~4.6% imp-34954 saw near N_cross is ' +
      'representative. imp-34954 floating-point reconciliation is band-wide, not a point coincidence.',
  },
  finding:
    'MEASURED band-wide: the E_coll local log-slope d ln E_coll/d ln N drifts MONOTONICALLY toward -1/2 as N ' +
    'grows -- -0.46570 (1e6), -0.47608 (1e9), -0.48313 (1e13) -- but only logarithmically slowly (deficit ' +
    '-0.5 - slope ~0.01687 still at 1e13), exactly tracking the identity -1/2 + (1/2) d ln L/d ln N (holds to ' +
    '~1e-9 at every rung); it never reaches -1/2 at any finite N. Re-running the imp-34954 surplus -> L1-L3-gap ' +
    'reconciliation band-wide, the full-refined conversion (measured local slope + E_flow drift) stays ' +
    'floating-point-small at every rung and TIGHTENS with N (1.5e-4 at 1e6, 7.0e-6 near N_cross ~3.28e9, ' +
    '9.3e-8 at 1e13), while the leading 2r conversion holds a representative ~3.4%..7.1% residual band-wide. ' +
    'So the imp-34954 floating-point reconciliation and the -0.47729 slope are one point on smooth, ' +
    'monotone band-wide curves, not coincidences at N_cross.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-34954 -0.47729 E_coll log-slope and its ' +
    'floating-point L1-L3-gap reconciliation at N_cross are shown to be band-wide: across 1e6 .. 1e13 the local ' +
    'slope drifts monotonically toward -1/2 (logarithmically slowly, -0.48313 at 1e13, never -1/2 at finite N) ' +
    'per the exact identity -1/2 + (1/2) d ln L/d ln N, and the full-refined surplus -> gap conversion stays ' +
    'floating-point-small (max ~1.5e-4, tightening to ~9.3e-8) at every rung. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34954 (the -0.47729 slope and floating-point reconciliation AT N_cross); imp-34923 (surplus closed ' +
    'form r/(2(2+r))); imp-33601 (leading (1+r)^2 N-gap prediction); imp-34693 (the 1e6 .. 1e13 band); ' +
    'imp-3444 (E_coll=E_trunc crossover); imp-33582 (sigma=1/2 halving landmark); imp-398 (E_flow C_F ' +
    'prefactor); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34970_ECOLL_LOG_SLOPE_BAND_AND_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-34954 slope at N_cross on the identical inherited model.
    id: 'imp34970-reproduces-imp34954-slope-at-N-cross',
    description: 'N_cross ~3.280e9 and d ln E_coll/d ln N at N_cross ~-0.47729 (reproduces imp-34954)',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 5e-3 &&
      Math.abs(SLOPE_AT_N_CROSS - -0.47728831) < 1e-6,
  },
  {
    // (Q1): the log-slope identity slope = -1/2 + (1/2) d ln L/d ln N holds to ~1e-9 at every rung.
    id: 'imp34970-slope-identity-holds-band-wide',
    description: 'slope == -1/2 + (1/2) d ln L/d ln N to <1e-8 at every rung of the 1e6..1e13 band',
    holds: () => BAND.every((b) => Math.abs(b.slope - b.slope_identity) < 1e-8),
  },
  {
    // (Q1): the slope drifts MONOTONICALLY toward -1/2, in (-0.5, -0.46), never reaching -1/2.
    id: 'imp34970-slope-drifts-monotonically-toward-minus-half',
    description:
      'slope strictly decreases (toward -1/2) with N across the band, stays in (-0.5,-0.46), never reaches -1/2',
    holds: () => {
      for (let i = 1; i < BAND.length; i++) {
        if (!(BAND[i].slope < BAND[i - 1].slope)) return false;
      }
      return BAND.every((b) => b.slope > -0.5 && b.slope < -0.46);
    },
  },
  {
    // (Q3): the full-refined conversion stays floating-point-small band-wide AND tightens with N.
    id: 'imp34970-full-refinement-floating-point-band-wide',
    description:
      'full-refined gap residual < 2e-4 at every rung and tightens with N (residual at 1e13 < residual at 1e6)',
    holds: () =>
      BAND.every((b) => b.resid_full < 2e-4) &&
      RESID_FULL_1E13 < BAND[0].resid_full &&
      RESID_FULL_1E13 < 1e-6,
  },
  {
    // (Q2): the leading 2r conversion holds a representative ~3.4%..7.1% residual band-wide.
    id: 'imp34970-leading-conversion-residual-band-wide',
    description: 'leading 2r conversion residual stays in ~[3%,8%] at every rung (the ~4.6% at N_cross is representative)',
    holds: () => BAND.every((b) => b.resid_leading > 0.03 && b.resid_leading < 0.08),
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp34970-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34970_ECOLL_LOG_SLOPE_BAND_AND_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP34970_ECOLL_LOG_SLOPE_BAND_AND_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP34970_ECOLL_LOG_SLOPE_BAND_AND_RECONCILIATION.verdict),
  },
];

for (const a of IMP34970_ECOLL_LOG_SLOPE_BAND_AND_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34970-ecoll-log-slope-band-and-reconciliation assertion failed: ${a.id}`);
  }
}
