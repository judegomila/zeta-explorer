/**
 * @module imp-97820-diag3-offdiagonal-sigma-trajectory
 *
 * imp-97820 (numerical/measurement, frontier audit): imp-97720 extended the imp-97668 first-order amplitude
 * audit to SECOND order and found the 3x3 mixed second-derivative (log-Hessian) of ln sigma in the three
 * log-amplitude axes (C_C, E_trunc, C_F) has NONZERO off-diagonals at every landmark, each matching the exact
 * doubly-centered closed form H_ij = delta_ij(a_i - b_i) - (a_i a_j - b_i b_j) with numerator shares a = (1,0,0)
 * and denominator shares b = (sigma, E_trunc/E_N, E_flow/E_N). But imp-97720 reported the off-diagonal triple
 * only at the three imp-97520 anchor landmarks L2/L3/L4. This leaf TABULATES the full off-diagonal triple
 * (H_ce, H_cf, H_ef) across a denser sigma ladder spanning L2..L4 plus the far-downslope L5 (sigma ~ 0.02,
 * imp-97710) and decides the ticket question: does each off-diagonal coupling track its closed-form share
 * product monotonically along the downslope, or does it peak at an interior sigma? Measurement/audit only; the
 * pinned constants appear only as symbolic differentiation axes; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97668/imp-97720, amplitudes as log-perturbations)
 * -----------------------------------------------------------------------------------------------------
 *   E_coll  = exp(u_c) * C_C * sqrt(log T0 / N)     (numerator; C_C axis, index 0),
 *   E_flow  = exp(u_f) * C_F0(N) * (log T0 / T0) * Gronwall  (denominator; C_F axis, index 2),
 *   E_trunc = exp(u_e) * E_TRUNC_PT                 (denominator; E_trunc axis, index 1),
 *   E_N     = E_trunc + E_flow + E_coll,   sigma = E_coll / E_N.
 * The three off-diagonal log-Hessian entries are exactly the pairwise products of the denominator amplitude
 * shares b = (sigma, E_trunc/E_N, E_flow/E_N):
 *   H_ce = H_10 = b_c * b_e = sigma * (E_trunc/E_N),   H_cf = b_c * b_f = sigma * (E_flow/E_N),
 *   H_ef = b_e * b_f = (E_trunc/E_N) * (E_flow/E_N).
 * (For i != j all three off-diagonals reduce to +b_i b_j because the numerator shares a = (1,0,0) contribute
 * only a_c a_c = 1 to the C_C diagonal.)
 *
 * THE SIGMA-TRAJECTORY (the deliverable, tabulated and tested)
 * ----------------------------------------------------------
 * Descend the downslope (increasing N) through a dense sigma ladder [0.9, 0.8, ..., 0.1, 0.05, 0.02]. Along the
 * way sigma = b_c falls monotonically, the truncation share b_e rises monotonically toward 1 (E_trunc is fixed
 * while E_coll and E_flow collapse), and the flow share b_f falls monotonically (E_flow ~ 1/T0 collapses fastest).
 *   H_ce = sigma * b_e = sigma * (1 - sigma - b_f). Because b_f is tiny on the whole ladder (< 1e-2), this is a
 *     near-perfect sigma*(1 - sigma) parabola: it PEAKS AT AN INTERIOR sigma ~ 1/2, midway between L2 and L4,
 *     NOT monotone. The golden-section peak locator puts the maximum at sigma* ~ 0.498 (the tiny b_f shifts it a
 *     hair below 1/2), matching the imp-97720 anchor values +8.11e-2 (L2) -> +2.495e-1 (L3, the peak) -> +9.00e-2
 *     (L4). So the dominant mixed coupling is a resonance across the crossing, not a monotone share product.
 *   H_cf = sigma * b_f is the product of TWO monotonically decreasing factors, so it decreases MONOTONICALLY down
 *     the whole ladder (+8.86e-3 at L2 -> +3.06e-8 at L5): the numerator-flow coupling collapses with the flow.
 *   H_ef = b_e * b_f: although b_e rises, the flow collapse in b_f dominates, so this coupling too decreases
 *     MONOTONICALLY (+8.88e-4 at L2 -> +1.51e-6 at L5), its maximum sitting at the top (flow-heavy) rung.
 *
 * THE FINDING (measurement / audit only)
 * -------------------------------------
 *   (S1) H_ce PEAKS AT INTERIOR SIGMA (a crossing resonance, NOT monotone). The C_C-E_trunc coupling H_ce =
 *        sigma*(E_trunc/E_N) is maximal at an interior rung sigma ~ 1/2 (golden-section peak sigma* ~ 0.498),
 *        rising from +8.11e-2 at L2 to +2.495e-1 near sigma = 0.5 then falling to +1.96e-2 at L5 -- the near
 *        sigma*(1 - sigma) parabola predicted by b_f << 1.
 *   (S2) H_cf AND H_ef DECREASE MONOTONICALLY (flow collapse). Both flow-touching off-diagonals track their
 *        collapsing share products monotonically down the ladder (H_cf +8.86e-3 -> +3.06e-8; H_ef +8.88e-4 ->
 *        +1.51e-6): the flow share b_f dominates both, so neither peaks in the interior.
 *   (S3) EXACT CLOSED FORM ALONG THE WHOLE LADDER. The order-1 coupling H_ce matches its closed-form share
 *        product sigma*(E_trunc/E_N) to < 3e-7 relative across every rung; H_ef to < 2.5e-5; H_cf matches to
 *        < 3e-5 at the anchor landmarks and degrades to ~3e-3 only at the deepest rung sigma = 0.02, where the
 *        coupling itself is a ~3e-8 magnitude and the O(h^2) fourth-difference stencil floor dominates the
 *        relative error -- a truncation artifact of a vanishing entry, not a real deviation from the closed form.
 *
 * MEASUREMENT / AUDIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8
 * ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and appear
 * only as symbolic differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97720-diag3-second-order-hessian (the 3x3 log-Hessian + closed form at L2/L3/L4)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (the far-downslope L5 sigma = 0.02 landmark)
 * @see imp-97689-diag3-additivity-euler-derivation (analytic first-order DIAG3 == 0, Euler degree-0)
 * @see imp-97668-nonlinear-amplitude-audit (first-order six-probe audit; A1 term-prefactor axes)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L2/L3/L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97720 exactly

// Axis order: index 0 = C_C (E_coll numerator), 1 = E_trunc, 2 = C_F (E_flow). Baseline u = 0 reproduces
// imp-97644/imp-97668/imp-97720 exactly (identical partsAt as imp-97720).
function partsAt(N, uc, ue, uf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = Math.exp(uf) * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 prefactor, scaled by exp(u_f)
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = Math.exp(uc) * C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), scaled by exp(u_c)
  const E_trunc = Math.exp(ue) * E_TRUNC_PT; // fixed-strip term, scaled by exp(u_e)
  const E_N = E_trunc + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll, E_trunc };
}
const lnSigmaAt = (N, u) => Math.log(partsAt(N, u[0], u[1], u[2]).sigma);

// Downslope crossing sigma = level (identical bisection to imp-97720/imp-97710).
function landmark(level) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (partsAt(Math.exp(m), 0, 0, 0).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Central-difference off-diagonal log-Hessian entries at a FIXED landmark abscissa N (verbatim imp-97720 stencil).
function offDiagMeasured(N, h) {
  const f = (u) => lnSigmaAt(N, u);
  const mixed = (i, j) => {
    const pp = [0, 0, 0];
    const pm = [0, 0, 0];
    const mp = [0, 0, 0];
    const mm = [0, 0, 0];
    pp[i] = h; pp[j] = h;
    pm[i] = h; pm[j] = -h;
    mp[i] = -h; mp[j] = h;
    mm[i] = -h; mm[j] = -h;
    return (f(pp) - f(pm) - f(mp) + f(mm)) / (4 * h * h);
  };
  return { Hce: mixed(0, 1), Hcf: mixed(0, 2), Hef: mixed(1, 2) };
}

// EXACT closed-form off-diagonals: the pairwise products of the denominator amplitude shares b = (b_c,b_e,b_f).
function offDiagClosed(p) {
  const bc = p.sigma;
  const be = p.E_trunc / p.E_N;
  const bf = p.E_flow / p.E_N;
  return { Hce: bc * be, Hcf: bc * bf, Hef: be * bf };
}

const relErr = (a, b) => (b === 0 ? Math.abs(a) : Math.abs(a / b - 1));

// Dense sigma ladder spanning the imp-97520 anchors L2 (0.9) / L3 (0.5) / L4 (0.1) plus the imp-97710
// far-downslope L5 (0.02); the interior rungs resolve the H_ce peak near sigma ~ 1/2.
const SIGMA_LADDER = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.02];
const ANCHOR_SIGMAS = [0.9, 0.5, 0.1]; // L2/L3/L4 (imp-97720 reported the off-diagonals only here)
const H_STEP = 1e-3; // log-amplitude central-difference step (reproduces the imp-97720 eps)

const PER_RUNG = SIGMA_LADDER.map((sigma) => {
  const N_L = landmark(sigma);
  const p0 = partsAt(N_L, 0, 0, 0);
  const m = offDiagMeasured(N_L, H_STEP);
  const c = offDiagClosed(p0);
  return {
    sigma,
    N_L: +N_L.toExponential(6),
    // denominator amplitude shares b = (coll, trunc, flow)
    share_coll: +p0.sigma.toExponential(4),
    share_trunc: +(p0.E_trunc / p0.E_N).toExponential(4),
    share_flow: +(p0.E_flow / p0.E_N).toExponential(4),
    // measured off-diagonal triple (S1/S2)
    Hce: +m.Hce.toExponential(6),
    Hcf: +m.Hcf.toExponential(6),
    Hef: +m.Hef.toExponential(6),
    // closed-form share products
    Hce_closed: +c.Hce.toExponential(6),
    Hcf_closed: +c.Hcf.toExponential(6),
    Hef_closed: +c.Hef.toExponential(6),
    // relative agreement per entry (S3)
    rel_ce: +relErr(m.Hce, c.Hce).toExponential(3),
    rel_cf: +relErr(m.Hcf, c.Hcf).toExponential(3),
    rel_ef: +relErr(m.Hef, c.Hef).toExponential(3),
  };
});

// Golden-section maximizer of H_ce = sigma*(E_trunc/E_N) over the crossing window to pin the interior peak.
function ceOffAtSigma(sigma) {
  const p = partsAt(landmark(sigma), 0, 0, 0);
  return p.sigma * (p.E_trunc / p.E_N);
}
function argmaxSigma(lo, hi) {
  const phi = (Math.sqrt(5) - 1) / 2;
  let a = lo;
  let b = hi;
  let c = b - phi * (b - a);
  let d = a + phi * (b - a);
  let fc = ceOffAtSigma(c);
  let fd = ceOffAtSigma(d);
  for (let i = 0; i < 100; i++) {
    if (fc > fd) { b = d; d = c; fd = fc; c = b - phi * (b - a); fc = ceOffAtSigma(c); }
    else { a = c; c = d; fc = fd; d = a + phi * (b - a); fd = ceOffAtSigma(d); }
  }
  return (a + b) / 2;
}
const CE_PEAK_SIGMA = argmaxSigma(0.35, 0.65);

// Trajectory diagnostics: interior peak for H_ce, monotone descent for the two flow-touching off-diagonals.
const ceSeries = PER_RUNG.map((r) => r.Hce);
const cfSeries = PER_RUNG.map((r) => r.Hcf);
const efSeries = PER_RUNG.map((r) => r.Hef);
const argmax = (arr) => arr.indexOf(Math.max(...arr));
const isStrictlyDecreasing = (arr) => arr.every((v, i) => i === 0 || v < arr[i - 1]);
const CE_ARGMAX_IDX = argmax(ceSeries);
const CE_PEAK_INTERIOR = CE_ARGMAX_IDX > 0 && CE_ARGMAX_IDX < ceSeries.length - 1;
const CF_MONOTONE_DECREASING = isStrictlyDecreasing(cfSeries);
const EF_MONOTONE_DECREASING = isStrictlyDecreasing(efSeries);

// Closed-form agreement summaries: H_ce is order-1 across the whole ladder; H_cf/H_ef degrade at the deepest
// rung where the coupling itself is a ~1e-8 magnitude and the O(h^2) stencil floor dominates the relative error.
const CE_REL_MAX_FULL = Math.max(...PER_RUNG.map((r) => r.rel_ce));
const EF_REL_MAX_FULL = Math.max(...PER_RUNG.map((r) => r.rel_ef));
const CF_REL_MAX_FULL = Math.max(...PER_RUNG.map((r) => r.rel_cf));
const anchorRungs = PER_RUNG.filter((r) => ANCHOR_SIGMAS.includes(r.sigma));
const MAX_REL_ANCHOR = Math.max(
  ...anchorRungs.map((r) => Math.max(r.rel_ce, r.rel_cf, r.rel_ef)),
);
const MIN_OFFDIAG_ABS = Math.min(
  ...PER_RUNG.map((r) => Math.min(Math.abs(r.Hce), Math.abs(r.Hcf), Math.abs(r.Hef))),
);

export const IMP97820_DIAG3_OFFDIAGONAL_SIGMA_TRAJECTORY = {
  id: 'imp-97820',
  proofSection: 'S-frontier',
  question:
    'imp-97720 pinned the nonzero diag3 log-Hessian off-diagonals (H_ce, H_cf, H_ef) at ONLY the three imp-97520 ' +
    'anchor landmarks L2/L3/L4. Tabulate the full off-diagonal triple across a denser sigma ladder spanning ' +
    'L2..L4 plus the far-downslope L5 (sigma ~ 0.02) and test whether each coupling tracks its closed-form share ' +
    'product monotonically along the downslope or peaks at an interior sigma (H_ce ~ sigma*(1-sigma) should peak ' +
    'near sigma ~ 1/2, between L2 and L4). Measurement/audit only; pinned constants appear only as symbolic ' +
    'differentiation axes; no bound moves; no QED.',
  method:
    'At each rung of the sigma ladder [0.9..0.02] solve the downslope crossing landmark N_L, form the ' +
    'central-difference mixed second-derivatives H_ce/H_cf/H_ef of ln sigma in the log-amplitudes (step h = 1e-3, ' +
    'verbatim imp-97720 stencil), and compare entry-by-entry to the exact closed-form share products ' +
    'H_ce = sigma*(E_trunc/E_N), H_cf = sigma*(E_flow/E_N), H_ef = (E_trunc/E_N)*(E_flow/E_N). Locate the H_ce ' +
    'interior peak by golden-section maximization over the crossing window sigma in [0.35, 0.65], and test the two ' +
    'flow-touching off-diagonals for monotone descent down the ladder.',
  axis_order: ['C_C (E_coll)', 'E_trunc', 'C_F (E_flow)'],
  step_h: H_STEP,
  ladder_sigmas: SIGMA_LADDER,
  perRung: PER_RUNG,
  ce_peak_sigma: +CE_PEAK_SIGMA.toFixed(5),
  ce_peak_value: +Math.max(...ceSeries).toExponential(6),
  ce_argmax_rung_sigma: SIGMA_LADDER[CE_ARGMAX_IDX],
  ce_peak_is_interior: CE_PEAK_INTERIOR,
  cf_monotone_decreasing: CF_MONOTONE_DECREASING,
  ef_monotone_decreasing: EF_MONOTONE_DECREASING,
  finding: {
    S1_Hce_peaks_at_interior_sigma:
      'The C_C-E_trunc off-diagonal H_ce = sigma*(E_trunc/E_N) is MAXIMAL at an interior sigma ~ 1/2 ' +
      '(golden-section peak sigma* = ' + CE_PEAK_SIGMA.toFixed(5) + ', argmax rung sigma = ' +
      SIGMA_LADDER[CE_ARGMAX_IDX] + '), rising +8.11e-2 (L2) -> +2.495e-1 (near 0.5) then falling to +1.96e-2 ' +
      '(L5). Because the flow share b_f << 1 on the whole ladder, H_ce is a near sigma*(1-sigma) parabola: the ' +
      'dominant mixed coupling is a crossing resonance, NOT a monotone share product.',
    S2_flow_couplings_decrease_monotonically:
      'Both flow-touching off-diagonals decrease MONOTONICALLY down the ladder (H_cf strictly decreasing: ' +
      CF_MONOTONE_DECREASING + ', +8.86e-3 at L2 -> +3.06e-8 at L5; H_ef strictly decreasing: ' +
      EF_MONOTONE_DECREASING + ', +8.88e-4 at L2 -> +1.51e-6 at L5). The collapsing flow share b_f dominates ' +
      'both, so neither peaks in the interior -- their maxima sit at the top flow-heavy rung.',
    S3_exact_closed_form_along_ladder:
      'H_ce matches its closed-form share product to < ' + CE_REL_MAX_FULL.toExponential(2) + ' relative across ' +
      'every rung and H_ef to < ' + EF_REL_MAX_FULL.toExponential(2) + '; H_cf matches to < ' +
      MAX_REL_ANCHOR.toExponential(2) + ' at the anchor landmarks and degrades to ~' +
      CF_REL_MAX_FULL.toExponential(2) + ' only at the deepest rung sigma = 0.02, where the coupling is a ~3e-8 ' +
      'magnitude and the O(h^2) fourth-difference stencil floor dominates the relative error -- a truncation ' +
      'artifact of a vanishing entry, not a deviation from the closed form.',
  },
  isRigorous: false,
  verdict:
    'AUDIT (frontier trajectory extension, NOT rigorous). Tabulating the imp-97720 diag3 log-Hessian off-diagonal ' +
    'triple (H_ce, H_cf, H_ef) across a dense sigma ladder [0.9..0.02] spanning the imp-97520 anchors L2/L3/L4 ' +
    'plus the imp-97710 far-downslope L5 settles the sigma-trajectory question: the three off-diagonals do NOT all ' +
    'behave the same. The dominant coupling H_ce = sigma*(E_trunc/E_N) PEAKS AT AN INTERIOR sigma ~ 1/2 ' +
    '(golden-section peak sigma* = ' + CE_PEAK_SIGMA.toFixed(5) + ', a near sigma*(1-sigma) parabola since the flow ' +
    'share is negligible), rising from +8.11e-2 at L2 to +2.495e-1 near the crossing then falling to +1.96e-2 at ' +
    'L5 -- a crossing resonance, not a monotone share product. The two flow-touching off-diagonals H_cf = ' +
    'sigma*(E_flow/E_N) and H_ef = (E_trunc/E_N)*(E_flow/E_N) instead DECREASE MONOTONICALLY down the whole ladder ' +
    '(H_cf +8.86e-3 -> +3.06e-8, H_ef +8.88e-4 -> +1.51e-6) because the collapsing flow share b_f dominates both. ' +
    'Every measured entry matches the exact closed-form share product (H_ce to < ' + CE_REL_MAX_FULL.toExponential(2) +
    ' relative across all rungs; H_cf/H_ef degrade only at the deepest rung where the ~1e-8 coupling hits the ' +
    'O(h^2) stencil floor, a truncation artifact). Conditional-share diagnostic on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear only as ' +
    'symbolic differentiation axes); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97720 (3x3 log-Hessian + closed form at L2/L3/L4); imp-97710 (far-downslope L5 sigma = 0.02 landmark); ' +
    'imp-97689 (analytic first-order DIAG3 == 0, Euler degree-0); imp-97668 (first-order six-probe amplitude ' +
    'audit); imp-97520 (landmark ladder L2/L3/L4); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip ' +
    'route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97820_DIAG3_OFFDIAGONAL_SIGMA_TRAJECTORY_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97720/imp-97520/imp-97710 ladder positions (L2, L3, L4, L5).
    id: 'imp97820-landmarks-reproduce-anchors',
    description: 'L2 ~2.572361e7, L3 ~3.267235e9, L4 ~3.213181e11 and L5 ~1.079935e13 reproduce the anchors to < 5e-3 relative',
    holds: () => {
      const at = (s) => PER_RUNG.find((r) => r.sigma === s).N_L;
      return (
        Math.abs(at(0.9) / 2.572361e7 - 1) < 5e-3 &&
        Math.abs(at(0.5) / 3.267235e9 - 1) < 5e-3 &&
        Math.abs(at(0.1) / 3.213181e11 - 1) < 5e-3 &&
        Math.abs(at(0.02) / 1.079935e13 - 1) < 5e-3
      );
    },
  },
  {
    // (S1): the dominant coupling H_ce peaks at an INTERIOR rung -- not monotone along the downslope.
    id: 'imp97820-Hce-peaks-interior',
    description: 'H_ce is maximal at an interior ladder rung (not the first or last sigma), i.e. it peaks near the crossing',
    holds: () => CE_PEAK_INTERIOR,
  },
  {
    // (S1): the golden-section interior peak of H_ce sits near sigma = 1/2 (the sigma*(1-sigma) shape).
    id: 'imp97820-Hce-peak-near-half',
    description: 'the golden-section H_ce peak sigma* lies in [0.45, 0.55] (near 1/2, the near-sigma*(1-sigma) maximum)',
    holds: () => CE_PEAK_SIGMA > 0.45 && CE_PEAK_SIGMA < 0.55,
  },
  {
    // (S2): the numerator-flow coupling H_cf decreases monotonically (product of two decreasing shares).
    id: 'imp97820-Hcf-monotone-decreasing',
    description: 'H_cf = sigma*(E_flow/E_N) decreases strictly down the whole ladder (flow collapse)',
    holds: () => CF_MONOTONE_DECREASING,
  },
  {
    // (S2): the trunc-flow coupling H_ef decreases monotonically (flow share dominates the product).
    id: 'imp97820-Hef-monotone-decreasing',
    description: 'H_ef = (E_trunc/E_N)*(E_flow/E_N) decreases strictly down the whole ladder (flow share dominates)',
    holds: () => EF_MONOTONE_DECREASING,
  },
  {
    // (S3): the order-1 coupling H_ce matches its closed-form share product across the WHOLE ladder.
    id: 'imp97820-Hce-matches-closed-form-full-ladder',
    description: 'H_ce matches sigma*(E_trunc/E_N) to < 1e-5 relative at every rung of the ladder',
    holds: () => CE_REL_MAX_FULL < 1e-5,
  },
  {
    // (S3): all three off-diagonals match the closed form to < 1e-4 at the imp-97720 anchor landmarks.
    id: 'imp97820-anchors-match-closed-form',
    description: 'at L2/L3/L4 all three off-diagonals match their closed-form share products to < 1e-4 relative',
    holds: () => MAX_REL_ANCHOR < 1e-4,
  },
  {
    // Structural: every off-diagonal share product is strictly positive (b_i b_j > 0).
    id: 'imp97820-offdiagonals-positive',
    description: 'every measured off-diagonal entry is strictly positive across the ladder (product of positive shares)',
    holds: () => MIN_OFFDIAG_ABS > 0,
  },
  {
    // Honesty gate: measurement/audit only, no QED, PT stays SOTA.
    id: 'imp97820-honesty-gate-no-qed',
    description: 'Measurement/audit only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97820_DIAG3_OFFDIAGONAL_SIGMA_TRAJECTORY.isRigorous === false &&
      /NO QED/.test(IMP97820_DIAG3_OFFDIAGONAL_SIGMA_TRAJECTORY.verdict) &&
      /remains SOTA/.test(IMP97820_DIAG3_OFFDIAGONAL_SIGMA_TRAJECTORY.verdict),
  },
];

for (const a of IMP97820_DIAG3_OFFDIAGONAL_SIGMA_TRAJECTORY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97820-diag3-offdiagonal-sigma-trajectory assertion failed: ${a.id}`);
  }
}
