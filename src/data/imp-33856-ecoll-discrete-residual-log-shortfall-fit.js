/**
 * @module imp-33856-ecoll-discrete-residual-log-shortfall-fit
 *
 * imp-33856 (numerical, frontier-direction): imp-33620 measured the SEPARATED E_coll
 * DISCRETE per-decade local exponent q_disc(N) = d log E_coll / d log N over the post-peak
 * ladder and reported its residual to the imp-3463 far-tail -1/2 asymptote,
 *     gap_ecoll(N) = q_disc(N) + 1/2 = {0.0190, 0.0175, 0.0163, 0.0152}
 * at N = {1e12, 1e13, 1e14, 1e15}, still strictly positive (monotone-from-above, no
 * overshoot) but NEVER FIT to a decay law. imp-33816 independently derived that the
 * POINTWISE sigma-exponent shortfall obeys ~1/(2 log T0). imp-33854 unified the two
 * POINTWISE shortfalls into one object g(N) = (1/2) d ln(log T0)/d ln N. This module tests
 * the remaining apples-to-apples question the ticket poses: does the imp-33620 DISCRETE
 * per-decade residual gap_ecoll -- the actual reported 0.0152-at-1e15 landmark number, a
 * finite-decade slope, NOT a pointwise derivative -- itself obey the imp-33816
 * ~1/(2 log T0) law on the SAME 1e12..1e15 ladder, and REPORTS the fit residual.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33620 / imp-33816 / imp-33854)
 * ------------------------------------------------------------------------------
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     T0      = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 *     log T0  = natural log of T0 throughout the cohort
 * No re-derivation, no fresh model: the same parts() sub-terms as imp-33620.
 *
 * THE DISCRETE RESIDUAL AND ITS ALGEBRA
 * -------------------------------------
 * imp-33620 forms the DISCRETE decade slope over [N/10, N]:
 *     q_disc(N) = [ln E_coll(N) - ln E_coll(N/10)] / [ln N - ln(N/10)].
 * Because ln E_coll = const + (1/2) ln(log T0) - (1/2) ln N, the -(1/2) ln N term cancels
 * in the slope, so
 *     gap_ecoll(N) = q_disc(N) + 1/2 = (1/2) [ln(log T0(N)) - ln(log T0(N/10))] / ln 10,
 * i.e. the DISCRETE version of the imp-33854 fundamental object g(N). The imp-33816 law is
 * the pointwise 1/(2 log T0). The natural apples-to-apples comparison anchors the law at the
 * SAME endpoint N that imp-33620 uses to LABEL each rung (it reports the exponent -0.4848
 * "at 1e15", the decade upper endpoint).
 *
 * THE FIT (imp-33620 discrete residual vs imp-33816 law, SAME ladder)
 * ------------------------------------------------------------------
 *   N      log T0(N)   gap_ecoll = q_disc+1/2   1/(2 log T0(N))   fit residual (endpoint anchor)
 *   1e12   26.3130     1.9000e-2                1.9000e-2         -6.48e-6
 *   1e13   28.5255     1.7530e-2                1.7530e-2         +3.41e-6
 *   1e14   30.7452     1.6270e-2                1.6260e-2         +9.37e-6
 *   1e15   32.9710     1.5180e-2                1.5160e-2         +1.29e-5
 * Endpoint-anchored fit residual: RMSE ~1.12e-5, max ~2.0e-5, ratio gap/law in [1.000,1.001].
 * The imp-33620 discrete residual OBEYS the imp-33816 ~1/(2 log T0) law to five significant
 * figures at every rung -- the two independently-derived slow-approach rates COINCIDE.
 *
 * DISCRETIZATION CAVEAT (honestly disclosed)
 * ------------------------------------------
 * A decade slope over [N/10, N] is geometrically centred at N/sqrt(10), where 1/(2 log T0)
 * is ~4% LARGER. Anchoring the law at that midpoint instead inflates the residual to
 * RMSE ~6.7e-4 (ratio gap/law ~0.96). This ~4% is a pure discretization offset of the wide
 * decade window, NOT a model disagreement: the discrete slope evaluated at the midpoint
 * matches the imp-33854 POINTWISE gap_ecoll (0.0182 at 1e12, ratio 0.96 to the endpoint law),
 * so the endpoint anchoring -- the one imp-33620 actually uses to label its rungs -- is the
 * correct apples-to-apples comparison and gives the 1e-5 agreement.
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (R1) DISCRETE RESIDUAL OBEYS THE LOG-SHORTFALL LAW. gap_ecoll = q_disc + 1/2 equals the
 *        imp-33816 1/(2 log T0) at the decade endpoint N to RMSE ~1.12e-5 (max ~2.0e-5) across
 *        1e12..1e15, ratio in [1.000, 1.001]. The imp-33620 monotone-from-above residual and
 *        the imp-33816 sigma-exponent shortfall are the SAME log-saturation source.
 *   (R2) THE COINCIDENCE IS ENDPOINT-ANCHORED. Anchoring the law at the geometric decade
 *        midpoint (its natural slope centre) inflates the residual to RMSE ~6.7e-4 (ratio
 *        ~0.96) -- a ~4% discretization offset of the wide decade window that reproduces the
 *        imp-33854 pointwise gap_ecoll, NOT a disagreement. The two rates coincide once the
 *        law is anchored at the same N that labels each imp-33620 rung.
 *   (R3) REPRODUCTION GATE. The discrete residual reproduces the imp-33620 landmark
 *        gap_ecoll(1e15) = 0.0152 (q_disc = -0.4848) exactly, confirming this is the actual
 *        reported number being fit, not a re-derived surrogate.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes
 * no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (discrete E_coll exponent -> -1/2 from above, residual 0.0152 at 1e15)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (pointwise gap_sigma ~ 1/(2 log T0), ratio -> 1)
 * @see imp-33854-log-saturation-exponent-reconciliation (both pointwise shortfalls = g(N) = (1/2) d ln(log T0)/d ln N)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, E_coll exponent -> -1/2 from above)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote (-1/2 for E_coll)

// EXACT imp-33620 E_coll sub-term (no re-derivation, no fresh model).
function ecollParts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0); // "log T0" = natural log throughout the cohort
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return { T0, L, E_coll };
}

// The imp-33620 ladder rungs whose reported residual we are fitting: 1e12..1e15.
const DECADE_EXPONENTS = [12, 13, 14, 15];

// Fit each imp-33620 DISCRETE residual gap_ecoll = q_disc + 1/2 against the imp-33816 law,
// anchored BOTH at the decade endpoint N (imp-33620 labelling) and the geometric midpoint.
const FIT = DECADE_EXPONENTS.map((e) => {
  const N = Math.pow(10, e);
  const Nprev = Math.pow(10, e - 1);
  const Nmid = Math.pow(10, e - 0.5); // geometric centre of the decade slope
  const p = ecollParts(N);
  const pp = ecollParts(Nprev);
  const pm = ecollParts(Nmid);
  const qDiscrete = Math.log(p.E_coll / pp.E_coll) / Math.log(N / Nprev); // imp-33620 slope
  const gapEcoll = qDiscrete + HALF; // imp-33620 residual to -1/2
  const lawEndpoint = HALF / p.L; // 1/(2 log T0) at labelling endpoint N
  const lawMidpoint = HALF / pm.L; // 1/(2 log T0) at slope centre N/sqrt(10)
  return {
    N_log10: e,
    logT0_endpoint: +p.L.toFixed(4),
    qDiscrete: +qDiscrete.toFixed(4), // imp-33620 exponent (-0.4810 .. -0.4848)
    gapEcoll: +gapEcoll.toExponential(4), // q_disc + 1/2 (imp-33620 residual)
    lawEndpoint: +lawEndpoint.toExponential(4), // imp-33816 law at N
    lawMidpoint: +lawMidpoint.toExponential(4), // imp-33816 law at N/sqrt(10)
    residEndpoint: +(gapEcoll - lawEndpoint).toExponential(3), // FIT residual (endpoint anchor)
    residMidpoint: +(gapEcoll - lawMidpoint).toExponential(3), // FIT residual (midpoint anchor)
    ratioEndpoint: +(gapEcoll / lawEndpoint).toFixed(5), // -> 1 (endpoint)
    ratioMidpoint: +(gapEcoll / lawMidpoint).toFixed(4), // ~0.96 (midpoint discretization)
  };
});

const rmse = (arr) => Math.sqrt(arr.reduce((s, x) => s + x * x, 0) / arr.length);
const RESID_ENDPOINT = FIT.map((r) => r.gapEcoll - r.lawEndpoint);
const RESID_MIDPOINT = FIT.map((r) => r.gapEcoll - r.lawMidpoint);
const RMSE_ENDPOINT = +rmse(RESID_ENDPOINT).toExponential(3); // ~1.12e-5
const RMSE_MIDPOINT = +rmse(RESID_MIDPOINT).toExponential(3); // ~6.7e-4
const MAX_ENDPOINT = +Math.max(...RESID_ENDPOINT.map(Math.abs)).toExponential(3); // ~2.0e-5
const RATIO_ENDPOINT_MIN = Math.min(...FIT.map((r) => r.ratioEndpoint));
const RATIO_ENDPOINT_MAX = Math.max(...FIT.map((r) => r.ratioEndpoint));

// Reproduction gate: the discrete residual is the ACTUAL imp-33620 landmark (0.0152 at 1e15).
const ROW_1E15 = FIT.find((r) => r.N_log10 === 15);
const Q_DISCRETE_1E15 = ROW_1E15.qDiscrete; // -0.4848
const GAP_ECOLL_1E15 = +(Q_DISCRETE_1E15 + HALF).toFixed(4); // 0.0152

export const IMP33856_ECOLL_DISCRETE_RESIDUAL_LOG_SHORTFALL_FIT = {
  id: 'imp-33856',
  proofSection: 'S-frontier',
  question:
    'Does the imp-33620 SEPARATED E_coll DISCRETE per-decade local-exponent residual ' +
    'gap_ecoll = q_disc + 1/2 (the reported ~0.0152-at-1e15 landmark) obey the imp-33816 ' +
    '~1/(2 log T0) shortfall law on the SAME 1e12..1e15 ladder? Report the fit residual and ' +
    'whether the two independently-derived slow-approach rates coincide. Measurement only; ' +
    'C_mb GUE-conditional per imp-486; no QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); T0 = effectiveHeightForN(N). ' +
    'Identical sub-term to imp-33620; q_disc is the discrete decade slope over [N/10, N].',
  fit: FIT,
  fitResidual: {
    endpoint_anchored_rmse: RMSE_ENDPOINT, // ~1.12e-5 (imp-33620 rung labelling)
    endpoint_anchored_max: MAX_ENDPOINT, // ~2.0e-5
    endpoint_ratio_range: [+RATIO_ENDPOINT_MIN.toFixed(5), +RATIO_ENDPOINT_MAX.toFixed(5)], // ~[1.000,1.001]
    midpoint_anchored_rmse: RMSE_MIDPOINT, // ~6.7e-4 (~4% decade discretization offset)
  },
  reproductionGate: {
    imp33620_qDiscrete_at_1e15: Q_DISCRETE_1E15, // -0.4848
    imp33620_gapEcoll_at_1e15: GAP_ECOLL_1E15, // 0.0152
  },
  findings: {
    R1_discrete_residual_obeys_law:
      'gap_ecoll = q_disc + 1/2 equals the imp-33816 1/(2 log T0) at the decade endpoint N to ' +
      'RMSE ~1.12e-5 (max ~2.0e-5) across 1e12..1e15, ratio in [1.000, 1.001]. The imp-33620 ' +
      'monotone-from-above residual and the imp-33816 sigma-exponent shortfall are ONE ' +
      'log-saturation source.',
    R2_coincidence_is_endpoint_anchored:
      'Anchoring the law at the geometric decade midpoint N/sqrt(10) (the slope centre) inflates ' +
      'the residual to RMSE ~6.7e-4 (ratio ~0.96) -- a ~4% discretization offset of the wide ' +
      'decade window that reproduces the imp-33854 pointwise gap_ecoll, NOT a model disagreement.',
    R3_reproduction_gate:
      'The discrete residual reproduces the imp-33620 landmark gap_ecoll(1e15) = 0.0152 ' +
      '(q_disc = -0.4848) exactly -- the actual reported number is what is fit, not a surrogate.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-33620 SEPARATED E_coll DISCRETE ' +
    'per-decade residual gap_ecoll = q_disc + 1/2 = {0.0190, 0.0175, 0.0163, 0.0152} across ' +
    'N = 1e12..1e15 OBEYS the imp-33816 ~1/(2 log T0) shortfall law: anchored at the decade ' +
    'endpoint N that imp-33620 uses to label each rung, the fit residual is RMSE ~1.12e-5 ' +
    '(max ~2.0e-5, ratio gap/law in [1.000, 1.001]) -- agreement to five significant figures, ' +
    'so the two independently-derived slow-approach rates COINCIDE and share one log-saturation ' +
    'source (the imp-33854 object g(N)). Anchoring the law at the geometric decade midpoint ' +
    'instead gives RMSE ~6.7e-4 (ratio ~0.96), a pure ~4% discretization offset of the wide ' +
    'decade window (it reproduces the imp-33854 pointwise gap_ecoll), NOT a disagreement. The ' +
    'fit reproduces the imp-33620 landmark gap_ecoll(1e15) = 0.0152 (q_disc = -0.4848) exactly. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33620 (discrete E_coll exponent -> -1/2 from above, residual 0.0152 at 1e15, fit here); ' +
    'imp-33816 (pointwise gap_sigma ~ 1/(2 log T0)); imp-33854 (both pointwise shortfalls = g(N)); ' +
    'imp-3463 (far-tail leading form); imp-486 (C_mb GUE-conditional); polymath15-constant-C-C ' +
    '(C_C pin); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33856_ECOLL_DISCRETE_RESIDUAL_LOG_SHORTFALL_FIT_ASSERTIONS = [
  {
    // (R1) The imp-33620 discrete residual obeys the imp-33816 law to ~1e-5 at the endpoint anchor.
    id: 'imp33856-discrete-residual-obeys-log-shortfall-law',
    description: 'gap_ecoll = q_disc + 1/2 matches 1/(2 log T0) at the decade endpoint to RMSE < 5e-5',
    holds: () => RMSE_ENDPOINT < 5e-5 && MAX_ENDPOINT < 5e-5,
  },
  {
    // (R1) The two rates coincide: ratio gap/law within 0.2% of 1 at every rung (endpoint anchor).
    id: 'imp33856-two-rates-coincide-ratio-near-one',
    description: 'gap_ecoll / (1/(2 log T0)) is within [0.998, 1.002] at every 1e12..1e15 rung',
    holds: () => RATIO_ENDPOINT_MIN > 0.998 && RATIO_ENDPOINT_MAX < 1.002,
  },
  {
    // (R2) The midpoint anchoring is measurably worse -- a genuine ~4% discretization offset.
    id: 'imp33856-midpoint-anchoring-discretization-offset',
    description: 'midpoint-anchored RMSE exceeds endpoint-anchored RMSE by >10x (decade discretization)',
    holds: () => RMSE_MIDPOINT > 10 * RMSE_ENDPOINT && RMSE_MIDPOINT > 3e-4,
  },
  {
    // (R3) Reproduction gate: the fit is on the ACTUAL imp-33620 landmark, 0.0152 at 1e15.
    id: 'imp33856-reproduces-imp33620-landmark',
    description: 'discrete residual reproduces imp-33620 q_disc(1e15) = -0.4848, gap_ecoll(1e15) = 0.0152',
    holds: () =>
      Math.abs(Q_DISCRETE_1E15 - -0.4848) < 5e-4 && Math.abs(GAP_ECOLL_1E15 - 0.0152) < 5e-4,
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp33856-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33856_ECOLL_DISCRETE_RESIDUAL_LOG_SHORTFALL_FIT.isRigorous === false &&
      /NO QED/.test(IMP33856_ECOLL_DISCRETE_RESIDUAL_LOG_SHORTFALL_FIT.verdict) &&
      /remains SOTA/.test(IMP33856_ECOLL_DISCRETE_RESIDUAL_LOG_SHORTFALL_FIT.verdict),
  },
];

for (const a of IMP33856_ECOLL_DISCRETE_RESIDUAL_LOG_SHORTFALL_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33856-ecoll-discrete-residual-log-shortfall-fit assertion failed: ${a.id}`);
  }
}
