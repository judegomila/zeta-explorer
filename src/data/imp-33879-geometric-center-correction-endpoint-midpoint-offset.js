/**
 * @module imp-33879-geometric-center-correction-endpoint-midpoint-offset
 *
 * imp-33879 (numerical, frontier-direction): imp-33856 fit the imp-33620 DISCRETE per-decade
 * residual gap_ecoll = q_disc + 1/2 against the imp-33816 pointwise 1/(2 log T0) shortfall law
 * and disclosed a DISCRETIZATION CAVEAT: the decade slope over [N/10, N] is geometrically
 * centred at the midpoint N/sqrt(10), where 1/(2 log T0) is "~4% LARGER", inflating the fit
 * residual from RMSE ~1.12e-5 (endpoint anchor) to ~6.7e-4 (midpoint anchor, ratio gap/law
 * ~0.96). imp-33856 reported the ~4% as a discretization offset but NEVER derived it as a
 * closed-form correction. This module DERIVES the leading correction factor as a half-log-decade
 * Taylor step of 1/(2 log T0) and MEASURES it against the actual endpoint-vs-midpoint offset
 * across the SAME 1e12..1e15 ladder, confirming the ~4% is exactly the geometric-center offset of
 * the wide decade window and not a model disagreement.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33856 / imp-33816)
 * -----------------------------------------------------------------
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     log T0 = natural log of T0 throughout the cohort (imp-33856 "logT0")
 *     law(N) = 1/(2 log T0(N))                 (imp-33816 pointwise shortfall)
 * No re-derivation, no fresh model: the same log T0 sub-term as imp-33856.
 *
 * THE DERIVATION (leading geometric-center correction factor)
 * ----------------------------------------------------------
 * Write the pointwise law as a function of the decade coordinate x = log10 N:
 *     f(x) = 1/(2 log T0(N)),   log T0(N) = ln N + O(ln ln N),   ln N = x * ln 10.
 * Because log T0 = ln N + (slowly varying), its decade derivative is
 *     d(log T0)/dx = ln 10 * d(log T0)/d(ln N) ~ ln 10.
 * The imp-33620 decade slope over [N/10, N] is geometrically centred at the MIDPOINT x - 1/2
 * (a half decade below the labelling endpoint x). A first-order Taylor step of f from the
 * endpoint x to that midpoint gives
 *     f(x - 1/2) - f(x) ~ -(1/2) f_prime(x),
 *     f_prime(x) = -[1/(2 (log T0)^2)] d(log T0)/dx ~ -ln 10 / (2 L^2),   L = log T0(N),
 * so the absolute step is +ln 10 / (4 L^2) and the FRACTIONAL offset is
 *     [f(x - 1/2) - f(x)] / f(x) = [ln 10 / (4 L^2)] / [1/(2 L)] = ln 10 / (2 L) = (1/2 ln 10) / L.
 * The closed-form leading geometric-center correction factor is therefore
 *     offset_lead(N) = (1/2 ln 10) / log T0(N) = 1.151293.. / L,
 * a pure function of log T0. At L ~ 26.3 (1e12) it is ~4.4%, at L ~ 33.0 (1e15) it is ~3.5%,
 * i.e. the imp-33856 "~4%" is the half-decade log-derivative of the pointwise law.
 *
 * THE MEASUREMENT (derived factor vs actual midpoint-vs-endpoint offset, SAME ladder)
 * ----------------------------------------------------------------------------------
 *   N      log T0(N)   log T0(N/sqrt10)   offset_meas = law_mid/law_end - 1   offset_lead=(1/2 ln10)/L   rel err
 *   1e12   26.3130     25.2098            4.376%                              4.375%                     -0.01%
 *   1e13   28.5255     27.4182            4.038%                              4.036%                     -0.06%
 *   1e14   30.7452     29.6345            3.748%                              3.745%                     -0.09%
 *   1e15   32.9710     31.8574            3.496%                              3.492%                     -0.11%
 * The exact offset law_mid/law_end - 1 = (L_end - L_mid)/L_mid is an algebraic identity in the two
 * log T0 values (verified to ~1e-12); the DERIVED leading factor (1/2 ln10)/L reproduces it to
 * <0.11% relative error at EVERY rung. The residual <0.11% is the second-order Taylor tail plus the
 * ln ln correction (the actual half-decade step L_end - L_mid ~ 1.103..1.114 is slightly below the
 * leading (1/2) ln 10 = 1.15129, but the endpoint-vs-midpoint denominator choice L_end vs L_mid
 * nearly cancels it). The measured offset ranges 3.50%..4.38% (mean ~3.9%) -- the imp-33856 "~4%".
 *
 * THE FINDINGS (derivation + measurement only)
 * --------------------------------------------
 *   (D1) CLOSED-FORM CORRECTION FACTOR. The endpoint-vs-midpoint offset of the pointwise
 *        1/(2 log T0) law over a decade window is, to leading order, the half-log-decade Taylor
 *        step (1/2 ln 10)/log T0 -- a pure function of log T0, ~4.4% at 1e12 falling to ~3.5% at
 *        1e15. This is the closed form of the imp-33856 "~4%" caveat.
 *   (D2) DERIVED FACTOR MATCHES THE ACTUAL OFFSET. (1/2 ln 10)/L reproduces the exact
 *        law_mid/law_end - 1 to <0.11% relative error across 1e12..1e15 (RMSE of the relative
 *        error ~7e-4). The ~4% is exactly the geometric-center offset of the wide decade window,
 *        NOT a model disagreement.
 *   (D3) REPRODUCTION GATE. The endpoint log T0 values match the imp-33856 landmarks
 *        {26.3130, 28.5255, 30.7452, 32.9710} exactly, and the offset reproduces the imp-33856
 *        midpoint ratio gap/law ~0.96 (1/(1 + offset) at each rung), confirming the same object.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33856-ecoll-discrete-residual-log-shortfall-fit (~4% midpoint-vs-endpoint caveat, derived here)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (pointwise gap_sigma ~ 1/(2 log T0))
 * @see imp-33854-log-saturation-exponent-reconciliation (both pointwise shortfalls = g(N))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5;
const HALF_LOG10 = 0.5 * Math.log(10); // (1/2) ln 10 = 1.151293.. leading half-log-decade step

// The imp-33856 ladder rungs whose ~4% midpoint offset we derive: 1e12..1e15.
const DECADE_EXPONENTS = [12, 13, 14, 15];

// Per rung: the pointwise law at the decade endpoint N and geometric midpoint N/sqrt(10),
// the EXACT offset law_mid/law_end - 1, and the DERIVED leading factor (1/2 ln 10)/log T0.
const TABLE = DECADE_EXPONENTS.map((e) => {
  const N = Math.pow(10, e);
  const Nmid = Math.pow(10, e - 0.5); // geometric centre of the decade slope
  const Lend = Math.log(effectiveHeightForN(N)); // imp-33856 logT0_endpoint
  const Lmid = Math.log(effectiveHeightForN(Nmid));
  const lawEnd = HALF / Lend; // 1/(2 log T0) at labelling endpoint N
  const lawMid = HALF / Lmid; // 1/(2 log T0) at slope centre N/sqrt(10)
  const offsetMeasured = lawMid / lawEnd - 1; // exact fractional offset (~0.04)
  const deltaActual = Lend - Lmid; // actual half-decade log T0 step (~1.10)
  const offsetClosed = deltaActual / Lmid; // = law_mid/law_end - 1 (algebraic identity)
  const offsetLead = HALF_LOG10 / Lend; // DERIVED leading factor (1/2 ln 10)/L
  const relErrLead = (offsetLead - offsetMeasured) / offsetMeasured; // <0.11%
  return {
    N_log10: e,
    logT0_endpoint: +Lend.toFixed(4),
    logT0_midpoint: +Lmid.toFixed(4),
    deltaHalfDecade: +deltaActual.toFixed(5), // actual step, vs leading (1/2) ln 10 = 1.15129
    offsetMeasured_pct: +(offsetMeasured * 100).toFixed(3), // 4.376 .. 3.496
    offsetLead_pct: +(offsetLead * 100).toFixed(3), // 4.375 .. 3.492
    relErrLead_pct: +(relErrLead * 100).toFixed(3), // -0.01 .. -0.11
    identityCheck: +Math.abs(offsetClosed - offsetMeasured).toExponential(2), // ~1e-16
    midpointRatioGapLaw: +(1 / (1 + offsetMeasured)).toFixed(4), // imp-33856 ratio ~0.96
  };
});

const rmse = (arr) => Math.sqrt(arr.reduce((s, x) => s + x * x, 0) / arr.length);
const REL_ERRS = TABLE.map((r) => r.relErrLead_pct / 100);
const MAX_REL_ERR = +Math.max(...REL_ERRS.map(Math.abs)).toExponential(3); // ~1.1e-3
const RMSE_REL_ERR = +rmse(REL_ERRS).toExponential(3); // ~7e-4
const MAX_IDENTITY = +Math.max(...TABLE.map((r) => r.identityCheck)).toExponential(2); // ~1e-16
const OFFSET_MIN = Math.min(...TABLE.map((r) => r.offsetMeasured_pct)); // ~3.50
const OFFSET_MAX = Math.max(...TABLE.map((r) => r.offsetMeasured_pct)); // ~4.38
const OFFSET_MEAN = +(TABLE.reduce((s, r) => s + r.offsetMeasured_pct, 0) / TABLE.length).toFixed(3); // ~3.9

// Reproduction gate: endpoint log T0 matches the imp-33856 landmarks exactly.
const IMP33856_LOGT0_ENDPOINTS = [26.313, 28.5255, 30.7452, 32.971];
const LOGT0_MATCH = TABLE.every(
  (r, i) => Math.abs(r.logT0_endpoint - IMP33856_LOGT0_ENDPOINTS[i]) < 1e-3,
);

export const IMP33879_GEOMETRIC_CENTER_CORRECTION_ENDPOINT_MIDPOINT_OFFSET = {
  id: 'imp-33879',
  proofSection: 'S-frontier',
  question:
    'Derive the imp-33856 ~4% midpoint-vs-endpoint anchoring offset as a closed-form correction ' +
    'factor -- a half-log-decade Taylor step of the imp-33816 pointwise 1/(2 log T0) law between N ' +
    'and the geometric decade centre N/sqrt(10) -- and measure it against the actual endpoint-vs-' +
    'midpoint offset across the 1e12..1e15 ladder, confirming the ~4% is the geometric-center ' +
    'offset of the wide decade window and not a model disagreement. Measurement only; no QED.',
  componentModel:
    'law(N) = 1/(2 log T0(N)); T0 = effectiveHeightForN(N). Identical log T0 sub-term to ' +
    'imp-33856. The decade slope over [N/10, N] is geometrically centred at N/sqrt(10).',
  derivation:
    'With x = log10 N and log T0 = ln N + O(ln ln N), d(log T0)/dx ~ ln 10, so a first-order ' +
    'Taylor step of f(x) = 1/(2 log T0) from the endpoint x to the midpoint x - 1/2 gives ' +
    'f(x-1/2) - f(x) ~ -(1/2) f_prime(x) = ln 10 / (4 L^2), and the fractional offset ' +
    '[f(x-1/2) - f(x)] / f(x) = ln 10 / (2 L) = (1/2 ln 10) / log T0. Closed-form leading factor.',
  table: TABLE,
  measurement: {
    offset_lead_formula: '(1/2 ln 10) / log T0(N)',
    max_relative_error: MAX_REL_ERR, // ~1.1e-3
    rmse_relative_error: RMSE_REL_ERR, // ~7e-4
    identity_max_abs_error: MAX_IDENTITY, // ~1e-16 (offsetClosed == offsetMeasured)
    offset_range_pct: [OFFSET_MIN, OFFSET_MAX], // ~[3.50, 4.38]
    offset_mean_pct: OFFSET_MEAN, // ~3.9 (the imp-33856 "~4%")
  },
  reproductionGate: {
    logT0_endpoints_match_imp33856: LOGT0_MATCH,
    midpoint_ratio_gap_law: TABLE.map((r) => r.midpointRatioGapLaw), // ~0.96 (imp-33856 ratio)
  },
  findings: {
    D1_closed_form_correction_factor:
      'The endpoint-vs-midpoint offset of the pointwise 1/(2 log T0) law over a decade window is, ' +
      'to leading order, the half-log-decade Taylor step (1/2 ln 10)/log T0 -- a pure function of ' +
      'log T0, ~4.4% at 1e12 falling to ~3.5% at 1e15. Closed form of the imp-33856 "~4%" caveat.',
    D2_derived_factor_matches_actual_offset:
      '(1/2 ln 10)/log T0 reproduces the exact law_mid/law_end - 1 to <0.11% relative error across ' +
      '1e12..1e15 (RMSE ~7e-4). The ~4% is exactly the geometric-center offset of the wide decade ' +
      'window, NOT a model disagreement.',
    D3_reproduction_gate:
      'Endpoint log T0 matches the imp-33856 landmarks {26.3130, 28.5255, 30.7452, 32.9710} ' +
      'exactly, and the offset reproduces the imp-33856 midpoint ratio gap/law ~0.96 at each rung.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). The imp-33856 ~4% ' +
    'midpoint-vs-endpoint anchoring offset -- disclosed as a discretization caveat but never ' +
    'derived -- is the half-log-decade Taylor step of the imp-33816 pointwise 1/(2 log T0) law: ' +
    'its closed-form leading correction factor is (1/2 ln 10)/log T0, a pure function of log T0 ' +
    '(~4.4% at 1e12, ~3.5% at 1e15). This derived factor reproduces the actual endpoint-vs-' +
    'midpoint offset law_mid/law_end - 1 to <0.11% relative error at every rung across 1e12..1e15 ' +
    '(RMSE ~7e-4), the exact offset being the algebraic identity (log T0(N) - log T0(N/sqrt10))/' +
    'log T0(N/sqrt10) in the two log T0 values (verified to ~1e-16). The measured offset ranges ' +
    '3.50%..4.38% (mean ~3.9%) -- the imp-33856 "~4%" is exactly the geometric-center offset of ' +
    'the wide decade window, NOT a model disagreement; the endpoint log T0 reproduces the ' +
    'imp-33856 landmarks and the imp-33856 midpoint ratio gap/law ~0.96 falls out as 1/(1+offset). ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-33856 (~4% midpoint-vs-endpoint caveat, derived here); imp-33816 (pointwise gap_sigma ~ ' +
    '1/(2 log T0)); imp-33854 (both pointwise shortfalls = g(N)); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33879_GEOMETRIC_CENTER_CORRECTION_ENDPOINT_MIDPOINT_OFFSET_ASSERTIONS = [
  {
    // (D1/D2) The derived leading factor (1/2 ln 10)/L matches the actual offset to <0.2%.
    id: 'imp33879-derived-factor-matches-actual-offset',
    description: '(1/2 ln 10)/log T0 reproduces law_mid/law_end - 1 to <0.2% relative error at every rung',
    holds: () => MAX_REL_ERR < 2e-3 && RMSE_REL_ERR < 1.5e-3,
  },
  {
    // (D2) The exact offset is the algebraic identity in the two log T0 values (to ~1e-12).
    id: 'imp33879-exact-offset-is-logt0-identity',
    description: 'law_mid/law_end - 1 equals (L_end - L_mid)/L_mid to machine precision',
    holds: () => MAX_IDENTITY < 1e-10,
  },
  {
    // (D1) The measured offset is the imp-33856 "~4%": mean ~3.9%, range ~[3.5%, 4.4%].
    id: 'imp33879-offset-is-the-four-percent-caveat',
    description: 'measured midpoint offset ranges within [3.3%, 4.6%] with mean near 4% (imp-33856 caveat)',
    holds: () => OFFSET_MIN > 3.3 && OFFSET_MAX < 4.6 && OFFSET_MEAN > 3.6 && OFFSET_MEAN < 4.2,
  },
  {
    // (D3) Reproduction gate: endpoint log T0 matches imp-33856 landmarks, ratio ~0.96.
    id: 'imp33879-reproduces-imp33856-landmarks',
    description: 'endpoint log T0 matches imp-33856, midpoint ratio gap/law is ~0.96 at every rung',
    holds: () =>
      LOGT0_MATCH && TABLE.every((r) => r.midpointRatioGapLaw > 0.95 && r.midpointRatioGapLaw < 0.97),
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp33879-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33879_GEOMETRIC_CENTER_CORRECTION_ENDPOINT_MIDPOINT_OFFSET.isRigorous === false &&
      /NO QED/.test(IMP33879_GEOMETRIC_CENTER_CORRECTION_ENDPOINT_MIDPOINT_OFFSET.verdict) &&
      /refereed bound is changed/i.test(IMP33879_GEOMETRIC_CENTER_CORRECTION_ENDPOINT_MIDPOINT_OFFSET.verdict),
  },
];

for (const a of IMP33879_GEOMETRIC_CENTER_CORRECTION_ENDPOINT_MIDPOINT_OFFSET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33879-geometric-center-correction-endpoint-midpoint-offset assertion failed: ${a.id}`,
    );
  }
}
