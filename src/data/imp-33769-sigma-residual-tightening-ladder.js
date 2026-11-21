/**
 * @module imp-33769-sigma-residual-tightening-ladder
 *
 * imp-33769 (numerical, frontier-direction): imp-33743 (D2) reported that the closed-form-vs-
 * empirical crossover residual at the sigma < 0.1 far-tail landmark (~7.4e-5) is ~54x TIGHTER
 * than the sigma = 1/2 halving residual (~3.98e-3), and attributed the drop to the vanishing
 * Gronwall flow term (residual ~ 2 * E_flow/E_trunc). But imp-33743 measured only that SINGLE
 * halving-to-sub-0.1 pair, so the ~54x could be a one-off spot factor rather than one rung of a
 * decay LAW. This module reuses the imp-33751 sub-0.01 landmark to add a THIRD rung: it measures
 * the closed-form-vs-empirical residual at ALL THREE landmarks (sigma = 0.5, sigma < 0.1,
 * sigma < 0.01), tabulates the pairwise tightening ratios, and checks whether they track the
 * predicted 2 * E_flow/E_trunc decay ACROSS the ladder rather than matching at a single point.
 * Measurement only.
 *
 * THE QUANTITIES (identical formulas to imp-33743 / imp-33751 / imp-3406, no fresh model)
 * ------------------------------------------------------------------------------------
 *     sigma(N)   = E_coll / (E_trunc + E_flow + E_coll)
 *     E_coll     = C_C_PINNED * sqrt(log T0 / N)                (GUE-conditional, dominant)
 *     E_flow     = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc    = 3.06e-5                                      (imp-2631 fixed-strip floor)
 * For each threshold thr the CLOSED FORM drops the flow term (imp-33743) and solves the leading
 * balance E_coll = E_trunc*thr/(1-thr) as the fixed point
 *     N_cf(thr) = (C_C_PINNED (1-thr)/(E_trunc thr))^2 * log T0(N_cf).       (closed form)
 * The EMPIRICAL landmark N_emp(thr) is the full-sigma downslope bisection (all three terms). The
 * residual is rel(thr) = (N_cf - N_emp)/N_cf. Every sub-term is reused byte-for-byte, so thr=0.5
 * and thr=0.1 reproduce the imp-33743 landmarks and thr=0.01 reproduces the imp-33751 landmark.
 *
 * WHY THE RESIDUAL SHOULD FOLLOW 2 * E_flow/E_trunc (the decay law being tested)
 * ----------------------------------------------------------------------------
 * The closed form drops E_flow from the threshold balance, so its RHS is E_trunc rather than the
 * true E_trunc + E_flow -- a fractional RHS error of E_flow/E_trunc. Since N is proportional to
 * E_coll^-2 and E_coll is set proportional to that RHS, dN/N = -2 * d(RHS)/RHS, giving
 * rel(thr) ~ 2 * E_flow/E_trunc. E_flow ~ log T0 / T0 decays down the tail, so the PREDICTED
 * residual ladder is 2 * E_flow/E_trunc evaluated at each landmark, and the pairwise tightening
 * ratio rel(thr_i)/rel(thr_{i+1}) should equal the ratio of E_flow/E_trunc between the two
 * landmarks -- decade after decade, not just once.
 *
 * A NOTE ON THE PREDICTOR (honest correction of the ticket phrasing)
 * -----------------------------------------------------------------
 * The residual tracks 2 * E_flow/E_trunc, NOT 2 * E_flow/E_coll. At threshold
 * E_coll = E_trunc*thr/(1-thr), so E_flow/E_coll = (E_flow/E_trunc)*(1-thr)/thr, which decays far
 * more slowly (measured 1.9e-3 -> 3.2e-4 -> 4.2e-5, only ~6x then ~8x per rung). The residual
 * ladder tightens ~54x then ~84x, matching the E_trunc-normalised ratio, so E_trunc -- the fixed
 * quantity the flow error is measured against -- is the correct normaliser, and the E_coll form is
 * ruled OUT by the data.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (D1) THE ~54x IS ONE RUNG OF A LADDER, NOT A SPOT FACTOR. The three residuals run
 *        3.98e-3 (sigma = 0.5) -> 7.38e-5 (sigma < 0.1) -> 8.79e-7 (sigma < 0.01), giving pairwise
 *        tightening ratios ~53.97x THEN ~83.90x. The imp-33743 ~54x is reproduced exactly and the
 *        NEXT step continues to tighten (~84x), so the collapse is a monotone decay across the
 *        ladder, not a single halving-to-sub-0.1 coincidence.
 *   (D2) THE TIGHTENING TRACKS THE E_flow/E_trunc DECAY DECADE-BY-DECADE. The E_flow/E_trunc
 *        ratios between successive landmarks are ~53.70x then ~83.40x -- the SAME ladder as the
 *        residual tightening to within ~0.6% (ratio-of-ratios 1.005, 1.006). So the tightening IS
 *        the flow-term decay, confirmed at two independent rungs rather than asserted from one.
 *   (D3) THE RESIDUAL EQUALS 2 * E_flow/E_trunc AND THE SMALL EXCESS SHRINKS WITH DEPTH. At each
 *        landmark the measured residual is 2 * E_flow/E_trunc times 1.0445 -> 1.0394 -> 1.0332: the
 *        prediction lands within ~3-4.5% and the residual excess (the slow log T0 drift, the only
 *        thing beyond the flow term) shrinks monotonically deeper in the tail. Restoring E_flow in
 *        the threshold balance closes each closed-form-vs-empirical gap to ~1e-15, confirming the
 *        whole ladder is the flow term with no grid or rounding artifact.
 *
 * The punchline: the imp-33743 ~54x far-tail residual tightening is NOT a spot factor -- it is one
 * rung of the 2 * E_flow/E_trunc decay ladder, which continues to ~84x at the sigma < 0.01 landmark
 * and tracks the E_flow/E_trunc decade-by-decade decay to ~0.6%. The residual normaliser is
 * E_trunc, not E_coll. Measurement/assessment only; conditional-share diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED
 * (imp-2642/imp-2643); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33743-sigma-fartail-crossover-closed-form (D2: the single ~54x halving-to-sub-0.1 pair extended here)
 * @see imp-33751-sigma-deep-tail-001-etrunc-floor-sensitivity (the sigma < 0.01 sub-0.01 landmark reused as the third rung)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the halving-landmark closed form, thr = 1/2)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the far-tail landmark ladder)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-33751 exactly

// EXACT imp-33743/imp-33751 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, decays down the tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Empirical landmark: full-sigma downslope bisection in log N (all three terms; reference).
function crossBelowSigma(thr, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).sigma > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Closed form: N_cf(thr) = (C_C (1-thr)/(E_trunc thr))^2 log T0(N_cf), the E_flow-dropped balance.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude (imp-33723/imp-33743)
function crossoverFixedPoint(thr, seed, iters) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}

// E_flow-restored threshold fixed point: E_coll = thr/(1-thr) * (E_trunc + E_flow) (D3 gap check).
function crossoverFixedPointWithFlow(thr, seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) {
    const rhs = (thr / (1 - thr)) * (E_TRUNC_PT + parts(N).E_flow);
    N = (C_C_PINNED / rhs) ** 2 * Math.log(effectiveHeightForN(N));
  }
  return N;
}

// The three landmarks: sigma = 0.5 halving, sigma < 0.1, sigma < 0.01 (reuses imp-33751 depth).
const THRESHOLDS = [
  { thr: 0.5, label: 'sigma_0_5_halving', seed: 1e9 },
  { thr: 0.1, label: 'sigma_below_0_1', seed: 1e11 },
  { thr: 0.01, label: 'sigma_below_0_01', seed: 1e13 },
];

const LANDMARKS = THRESHOLDS.map(({ thr, label, seed }) => {
  const N_cf = crossoverFixedPoint(thr, seed, 80);
  const N_emp = crossBelowSigma(thr, 1e6, 1e18);
  const N_flow = crossoverFixedPointWithFlow(thr, seed, 120);
  const relOffset = (N_cf - N_emp) / N_cf; // closed form sits above the empirical
  const p = parts(N_emp);
  const eFlowOverETrunc = p.E_flow / E_TRUNC_PT; // the residual normaliser
  const eFlowOverEColl = p.E_flow / p.E_coll; // the rejected E_coll-normalised alternative
  const predResidual = 2 * eFlowOverETrunc; // 2 * E_flow/E_trunc leading model
  const withFlowVsEmp = Math.abs(N_flow - N_emp) / N_emp; // ~1e-15 gap once E_flow restored
  return {
    threshold: thr,
    label,
    N_closed_form: +N_cf.toExponential(6),
    N_empirical: +N_emp.toExponential(6),
    rel_offset: +relOffset.toExponential(4),
    rel_offset_abs: Math.abs(relOffset),
    E_flow_over_E_trunc: +eFlowOverETrunc.toExponential(4),
    E_flow_over_E_coll: +eFlowOverEColl.toExponential(4),
    predicted_residual_2eflow_etrunc: +predResidual.toExponential(4),
    measured_over_predicted: +(Math.abs(relOffset) / predResidual).toFixed(4),
    with_flow_vs_empirical_rel: +withFlowVsEmp.toExponential(3),
  };
});

// Pairwise tightening ratios and the E_flow/E_trunc decay ratios they should track.
const RUNGS = [];
for (let i = 0; i < LANDMARKS.length - 1; i++) {
  const hi = LANDMARKS[i];
  const lo = LANDMARKS[i + 1];
  const residualTightening = hi.rel_offset_abs / lo.rel_offset_abs;
  const eFlowRatio = hi.E_flow_over_E_trunc / lo.E_flow_over_E_trunc;
  const eCollRatio = hi.E_flow_over_E_coll / lo.E_flow_over_E_coll;
  RUNGS.push({
    step: `${hi.label} -> ${lo.label}`,
    residual_tightening: +residualTightening.toFixed(3),
    e_flow_over_e_trunc_ratio: +eFlowRatio.toFixed(3),
    ratio_of_ratios_etrunc: +(residualTightening / eFlowRatio).toFixed(4), // ~1 => tracks E_trunc form
    e_flow_over_e_coll_ratio: +eCollRatio.toFixed(3), // the rejected alternative (does NOT track)
  });
}

export const IMP33769_SIGMA_RESIDUAL_TIGHTENING_LADDER = {
  id: 'imp-33769',
  proofSection: 'S-frontier',
  question:
    'imp-33743 D2 reported the sigma < 0.1 closed-form residual (~7.4e-5) is ~54x tighter than the ' +
    'sigma = 1/2 halving residual (~3.98e-3) and attributed it to the vanishing E_flow term, but ' +
    'measured only that ONE landmark pair. Reusing the imp-33751 sigma < 0.01 landmark, measure the ' +
    'closed-form-vs-empirical residual at ALL THREE landmarks, tabulate the pairwise tightening ' +
    'ratios, and check whether the ~54x and next-step ratios track the predicted 2 * E_flow/E_trunc ' +
    'decay ACROSS the ladder rather than a single spot factor. Measurement only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  predictorModel:
    'The closed form drops E_flow from the threshold balance E_coll = E_trunc*thr/(1-thr), a ' +
    'fractional RHS error E_flow/E_trunc; N proportional to E_coll^-2 gives rel(thr) ~ ' +
    '2 * E_flow/E_trunc. The residual tracks 2 * E_flow/E_trunc, NOT 2 * E_flow/E_coll ' +
    '(E_flow/E_coll = (E_flow/E_trunc)(1-thr)/thr decays far slower and is ruled out by the data).',
  landmarks: LANDMARKS,
  tighteningLadder: RUNGS,
  finding: {
    D1_fiftyfourx_is_one_rung_not_a_spot_factor:
      'The three residuals run 3.98e-3 (sigma = 0.5) -> 7.38e-5 (sigma < 0.1) -> 8.79e-7 ' +
      '(sigma < 0.01), giving pairwise tightening ratios ~53.97x THEN ~83.90x. The imp-33743 ~54x is ' +
      'reproduced exactly and the NEXT step continues to tighten (~84x), so the collapse is a monotone ' +
      'decay across the ladder, not a single halving-to-sub-0.1 coincidence.',
    D2_tightening_tracks_e_flow_decay_decade_by_decade:
      'The E_flow/E_trunc ratios between successive landmarks are ~53.70x then ~83.40x -- the SAME ' +
      'ladder as the residual tightening to within ~0.6% (ratio-of-ratios 1.005, 1.006). The tightening ' +
      'IS the flow-term decay, confirmed at two independent rungs. The E_coll-normalised alternative ' +
      '(ratios ~6x then ~8x) does not track and is ruled out.',
    D3_residual_equals_2eflow_etrunc_and_excess_shrinks:
      'At each landmark the measured residual is 2 * E_flow/E_trunc times 1.0445 -> 1.0394 -> 1.0332: ' +
      'the prediction lands within ~3-4.5% and the residual excess (the slow log T0 drift, the only ' +
      'term beyond the flow contribution) shrinks monotonically deeper in the tail. Restoring E_flow in ' +
      'the threshold balance closes each closed-form-vs-empirical gap to ~1e-15, so the whole ladder is ' +
      'the flow term with no grid or rounding artifact.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). The imp-33743 ~54x far-tail residual ' +
    'tightening is NOT a one-off spot factor: it is one rung of the 2 * E_flow/E_trunc decay ladder. ' +
    'The closed-form-vs-empirical residual measured at all three landmarks runs 3.98e-3 (sigma = 0.5) ' +
    '-> 7.38e-5 (sigma < 0.1) -> 8.79e-7 (sigma < 0.01), pairwise tightening ~53.97x then ~83.90x, ' +
    'tracking the E_flow/E_trunc decay ladder (~53.70x, ~83.40x) decade-by-decade to ~0.6%. The ' +
    'measured residual equals 2 * E_flow/E_trunc to ~3-4.5% with the excess (log T0 drift) shrinking ' +
    'with depth (1.0445 -> 1.0394 -> 1.0332), and restoring E_flow closes each gap to ~1e-15. The ' +
    'correct normaliser is E_trunc, not E_coll (the E_flow/E_coll ratios ~6x/~8x do not track). ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-33743 (D2: single ~54x halving-to-sub-0.1 residual pair, extended here); imp-33751 ' +
    '(sigma < 0.01 sub-0.01 landmark reused as the third rung); imp-33723 (halving closed form); ' +
    'imp-33582 (far-tail landmark ladder); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi), 1/8 ansatz); ' +
    'imp-2631 (E_trunc fixed-strip route); imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping ' +
    '(effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP33769_SIGMA_RESIDUAL_TIGHTENING_LADDER_ASSERTIONS = [
  {
    // Reuse gate: the closed-form and empirical landmarks reproduce imp-33743 / imp-33751.
    id: 'imp33769-reproduces-cohort-landmarks',
    description:
      'N_emp reproduces imp-33743 sigma=0.5 @ ~3.27e9 and sigma<0.1 @ ~3.21e11, and imp-33751 ' +
      'sigma<0.01 @ ~4.62e13',
    holds: () =>
      Math.abs(LANDMARKS[0].N_empirical / 3.267e9 - 1) < 5e-3 &&
      Math.abs(LANDMARKS[1].N_empirical / 3.213e11 - 1) < 5e-3 &&
      Math.abs(LANDMARKS[2].N_empirical / 4.624e13 - 1) < 1e-2,
  },
  {
    // D1: the residual tightens monotonically across all three landmarks (not one halving pair).
    id: 'imp33769-residual-tightens-monotonically',
    description: 'rel offsets strictly decrease 3.98e-3 -> 7.38e-5 -> 8.79e-7 across the ladder',
    holds: () =>
      LANDMARKS[0].rel_offset_abs > LANDMARKS[1].rel_offset_abs &&
      LANDMARKS[1].rel_offset_abs > LANDMARKS[2].rel_offset_abs,
  },
  {
    // D1: the imp-33743 ~54x is reproduced AND the next rung continues to tighten (~84x).
    id: 'imp33769-fiftyfourx-is-one-rung-of-a-ladder',
    description: 'pairwise tightening ~54x (reproduces imp-33743) then ~84x (next rung), not a spot factor',
    holds: () =>
      Math.abs(RUNGS[0].residual_tightening - 54) < 3 &&
      RUNGS[1].residual_tightening > 70 &&
      RUNGS[1].residual_tightening > RUNGS[0].residual_tightening,
  },
  {
    // D2: the tightening ratios track the E_flow/E_trunc decay ratios decade-by-decade (< 2%).
    id: 'imp33769-tightening-tracks-eflow-etrunc-decay',
    description: 'residual tightening / (E_flow/E_trunc ratio) ~ 1 at both rungs (tracks the decay law)',
    holds: () =>
      RUNGS.every((r) => Math.abs(r.ratio_of_ratios_etrunc - 1) < 0.02),
  },
  {
    // D2: the E_coll-normalised alternative does NOT track (rules out 2 * E_flow/E_coll).
    id: 'imp33769-ecoll-normaliser-ruled-out',
    description: 'E_flow/E_coll ratios (~6x, ~8x) are far below the residual tightening (~54x, ~84x)',
    holds: () =>
      RUNGS.every((r) => r.e_flow_over_e_coll_ratio < 0.3 * r.residual_tightening),
  },
  {
    // D3: the measured residual equals 2 * E_flow/E_trunc to a few percent, excess shrinking deeper.
    id: 'imp33769-residual-matches-2eflow-etrunc',
    description: 'measured/predicted in [1.02, 1.06] at each landmark and shrinks monotonically with depth',
    holds: () =>
      LANDMARKS.every((l) => l.measured_over_predicted > 1.02 && l.measured_over_predicted < 1.06) &&
      LANDMARKS[0].measured_over_predicted > LANDMARKS[1].measured_over_predicted &&
      LANDMARKS[1].measured_over_predicted > LANDMARKS[2].measured_over_predicted,
  },
  {
    // D3: restoring E_flow closes each closed-form-vs-empirical gap to floating-point zero.
    id: 'imp33769-eflow-restored-closes-every-gap',
    description: 'E_flow-inclusive threshold fixed point matches each empirical landmark to < 1e-9',
    holds: () => LANDMARKS.every((l) => l.with_flow_vs_empirical_rel < 1e-9),
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp33769-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33769_SIGMA_RESIDUAL_TIGHTENING_LADDER.isRigorous === false &&
      /NO QED/.test(IMP33769_SIGMA_RESIDUAL_TIGHTENING_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP33769_SIGMA_RESIDUAL_TIGHTENING_LADDER.verdict),
  },
];

for (const a of IMP33769_SIGMA_RESIDUAL_TIGHTENING_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33769-sigma-residual-tightening-ladder assertion failed: ${a.id}`);
  }
}
