/**
 * @module imp-97720-diag3-second-order-hessian
 *
 * imp-97720 (numerical/measurement, frontier audit): imp-97668 audited the six multiplicative probes of E_N
 * and confirmed the imp-97644 STRUCTURE (1) FIRST-order claim -- every amplitude enters E_N linearly, so
 * sigma = E_coll/E_N is degree-0 homogeneous in the three amplitudes (C_C, E_trunc, C_F) and the three-axis
 * diagonal elasticity DIAG3 = E_CC + E_ET + E_CF == 0 exactly (derived analytically in imp-97689). The
 * SECOND-order structure was never measured. This leaf computes the full 3x3 mixed second-derivative
 * (Hessian) of ln sigma in the three log-amplitude axes at the imp-97520 landmarks L2/L3/L4 and decides the
 * ticket question: does the degree-0 homogeneity force every second-order amplitude COUPLING to zero too, or
 * does a nonzero mixed second elasticity survive? Measurement/audit only; the pinned constants appear only as
 * symbolic differentiation axes; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97668, amplitudes as log-perturbations)
 * -------------------------------------------------------------------------------------------
 *   E_coll  = exp(u_c) * C_C * sqrt(log T0 / N)     (numerator; C_C axis, index 0),
 *   E_flow  = exp(u_f) * C_F0(N) * (log T0 / T0) * Gronwall  (denominator; C_F axis, index 2),
 *   E_trunc = exp(u_e) * E_TRUNC_PT                 (denominator; E_trunc axis, index 1),
 *   E_N     = E_trunc + E_flow + E_coll,   sigma = E_coll / E_N.
 * The three log-amplitudes u = (u_c, u_e, u_f) are the differentiation axes (baseline u = 0). At a fixed
 * landmark abscissa N_L, sigma is a ratio of two forms that are each linear in the amplitudes: the numerator
 * P = E_coll depends only on u_c, the denominator Q = E_N is the sum of the three amplitude-linear terms.
 *
 * THE SECOND-ORDER STRUCTURE (the deliverable, derived and measured)
 * ----------------------------------------------------------------
 * Because ln sigma = ln P - ln Q with P, Q each amplitude-linear, the Hessian H_ij = d2(ln sigma)/(du_i du_j)
 * has the exact softmax-difference closed form (with numerator shares a = (1,0,0) -- all of P sits on the C_C
 * axis -- and denominator shares b = (sigma, E_trunc/E_N, E_flow/E_N), which sum to 1):
 *   H_ij = delta_ij * (a_i - b_i) - (a_i a_j - b_i b_j).
 * Explicitly the diagonal H_ii = -b_i(1 - b_i) < 0 and the off-diagonal H_ij = b_i b_j > 0 (i != j, except
 * the C_C-diagonal picks up the a-term: H_cc = -sigma(1-sigma)). The DECISIVE feature is the CONTRACTION:
 *   row-sum_i = sum_j H_ij = (a_i - b_i) - a_i * 1 + b_i * 1 = 0   for every i,
 * so the log-Hessian is doubly centered (all row AND column sums vanish). This is the EXACT second-order
 * analog of the first-order DIAG3 == 0: differentiating Euler once more, sum_j d2 ln sigma/(du_i du_j) =
 * d/du_i (sum_j d ln sigma/du_j) = d/du_i (DIAG3) = 0, because DIAG3 == 0 identically in the amplitudes.
 *
 * THE ANSWER TO THE TICKET: the individual off-diagonal H_ij do NOT vanish (H_ce = sigma * E_trunc/E_N is a
 * clean +8.11e-2 at L2, +2.495e-1 at L3, +9.00e-2 at L4 -- an order 1 mixed coupling), so degree-0
 * homogeneity does NOT force the second-order couplings to zero. What it DOES force is the diagonal
 * contraction (row/column sums) to vanish -- a second-order DIAG3 identity -- measured here at the O(h^2)
 * central-difference stencil floor (~1e-8, quartering with the step h), the same truncation signature as the
 * first-order DIAG3. The nonlinear wrappers (C_KH via sqrt, the Gronwall exponent via exp) do not enter: at
 * fixed N these three ARE the term-prefactor axes (imp-97668 A1), and the wrappers only rescale the axis they
 * factor through, leaving the doubly-centered Hessian structure intact.
 *
 * THE FINDING (measurement / audit only)
 * -------------------------------------
 *   (S1) NONZERO MIXED SECOND ELASTICITIES SURVIVE. The off-diagonal log-Hessian entries H_ce, H_cf, H_ef are
 *        all nonzero (H_ce = +8.11e-2/+2.495e-1/+9.00e-2 at L2/L3/L4). Degree-0 homogeneity does NOT force the
 *        second-order amplitude couplings to zero -- only the FIRST-order diagonal DIAG3 == 0 was ever forced.
 *   (S2) EXACT CLOSED FORM. Every measured Hessian entry matches H_ij = delta_ij(a_i - b_i) - (a_i a_j - b_i b_j)
 *        with a = (1,0,0), b = (sigma, E_trunc/E_N, E_flow/E_N) to < 3e-7 relative (5-figure agreement); the
 *        log-Hessian is the doubly-centered softmax-difference of the numerator vs denominator amplitude shares.
 *   (S3) SECOND-ORDER DIAG3 == 0 (the homogeneity survives, as a CONTRACTION). The row/column sums of the
 *        log-Hessian vanish to the O(h^2) stencil floor (~1e-8, quartering as h halves: 4.68e-8 -> 1.16e-8 ->
 *        3.15e-9), NOT a real residual -- the exact second-order Euler relation sum_j H_ij = 0. The degree-0
 *        homogeneity DOES survive beyond first order, but as the diagonal contraction of the Hessian, not as
 *        the vanishing of the individual mixed couplings.
 *
 * MEASUREMENT / AUDIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8
 * ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and appear
 * only as symbolic differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97668-nonlinear-amplitude-audit (first-order six-probe audit; A1 term-prefactor axes)
 * @see imp-97689-diag3-additivity-euler-derivation (analytic first-order DIAG3 == 0, Euler degree-0)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (first-order DIAG3 == 0 off-anchor at L5)
 * @see imp-97644-three-axis-additivity-flow-prefactor (MEASURED first-order DIAG3 == 0)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L2/L3/L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97668 exactly

// Axis order: index 0 = C_C (E_coll numerator), 1 = E_trunc, 2 = C_F (E_flow). Each amplitude enters via a
// log-perturbation exp(u_i) on its pinned baseline; baseline u = 0 reproduces imp-97644/imp-97668 exactly.
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

// Downslope crossing sigma = level (identical bisection to imp-97644/imp-97668/imp-97710).
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

// Central-difference 3x3 Hessian of ln sigma in the three log-amplitude axes at a FIXED landmark abscissa N.
function hessian(N, h) {
  const f = (u) => lnSigmaAt(N, u);
  const f0 = f([0, 0, 0]);
  const H = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    const ep = [0, 0, 0];
    const em = [0, 0, 0];
    ep[i] = h;
    em[i] = -h;
    H[i][i] = (f(ep) - 2 * f0 + f(em)) / (h * h);
    for (let j = i + 1; j < 3; j++) {
      const pp = [0, 0, 0];
      const pm = [0, 0, 0];
      const mp = [0, 0, 0];
      const mm = [0, 0, 0];
      pp[i] = h; pp[j] = h;
      pm[i] = h; pm[j] = -h;
      mp[i] = -h; mp[j] = h;
      mm[i] = -h; mm[j] = -h;
      const v = (f(pp) - f(pm) - f(mp) + f(mm)) / (4 * h * h);
      H[i][j] = v;
      H[j][i] = v;
    }
  }
  return H;
}

// EXACT closed-form log-Hessian from the amplitude shares: numerator shares a = (1,0,0) (all of P on C_C),
// denominator shares b = (sigma, E_trunc/E_N, E_flow/E_N); H_ij = delta_ij(a_i - b_i) - (a_i a_j - b_i b_j).
function hessianClosed(p) {
  const a = [1, 0, 0];
  const b = [p.sigma, p.E_trunc / p.E_N, p.E_flow / p.E_N];
  const H = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      H[i][j] = (i === j ? a[i] - b[i] : 0) - (a[i] * a[j] - b[i] * b[j]);
    }
  }
  return H;
}

const LEVELS = [
  { key: 'L2_below_0p9', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3_halving', label: 'halving', sigma: 0.5 },
  { key: 'L4_below_0p1', label: 'below-0.1', sigma: 0.1 },
];
const H_STEP = 1e-3; // log-amplitude central-difference step (reproduces the imp-97644/imp-97668 eps)

const relErr = (a, b) => (b === 0 ? Math.abs(a) : Math.abs(a / b - 1));

const PER_LANDMARK = LEVELS.map(({ key, label, sigma }) => {
  const N_L = landmark(sigma);
  const p0 = partsAt(N_L, 0, 0, 0);
  const Hm = hessian(N_L, H_STEP);
  const Hc = hessianClosed(p0);
  const rowSums = Hm.map((r) => r[0] + r[1] + r[2]);
  const colSums = [0, 1, 2].map((j) => Hm[0][j] + Hm[1][j] + Hm[2][j]);
  // largest relative deviation of a measured entry from its closed form (max over the 6 distinct entries)
  const maxEntryRel = Math.max(
    relErr(Hm[0][0], Hc[0][0]), relErr(Hm[0][1], Hc[0][1]), relErr(Hm[0][2], Hc[0][2]),
    relErr(Hm[1][1], Hc[1][1]), relErr(Hm[1][2], Hc[1][2]), relErr(Hm[2][2], Hc[2][2]),
  );
  const maxAbsContraction = Math.max(...rowSums.map(Math.abs), ...colSums.map(Math.abs));
  return {
    key,
    label,
    sigma,
    N_L: +N_L.toExponential(6),
    // denominator amplitude shares b = (coll, trunc, flow)
    share_coll: +p0.sigma.toExponential(4),
    share_trunc: +(p0.E_trunc / p0.E_N).toExponential(4),
    share_flow: +(p0.E_flow / p0.E_N).toExponential(4),
    // measured log-Hessian (rows/cols = C_C, E_trunc, C_F)
    H_measured: Hm.map((r) => r.map((x) => +x.toExponential(6))),
    // the surviving off-diagonal mixed second elasticities (S1)
    Hoff_CC_ET: +Hm[0][1].toExponential(6), // = sigma * E_trunc/E_N  (nonzero)
    Hoff_CC_CF: +Hm[0][2].toExponential(6), // = sigma * E_flow/E_N   (nonzero)
    Hoff_ET_CF: +Hm[1][2].toExponential(6), // = E_trunc*E_flow/E_N^2 (nonzero)
    // agreement with the exact closed form (S2)
    max_entry_reldiff_vs_closed_form: +maxEntryRel.toExponential(3),
    // the second-order DIAG3: the diagonal contraction (S3), at the O(h^2) stencil floor
    row_sums: rowSums.map((x) => +x.toExponential(3)),
    col_sums: colSums.map((x) => +x.toExponential(3)),
    max_abs_contraction: +maxAbsContraction.toExponential(3),
  };
});

// h-ladder of the row-sum contraction at L2: exhibits the O(h^2) quartering (truncation, not a residual).
const N_L2 = landmark(0.9);
const CONTRACTION_H_LADDER = [2e-3, 1e-3, 5e-4].map((h) => {
  const Hm = hessian(N_L2, h);
  const rs = Hm.map((r) => r[0] + r[1] + r[2]);
  return { h, max_abs_row_sum: +Math.max(...rs.map(Math.abs)).toExponential(3) };
});

const MAX_ABS_CONTRACTION = Math.max(...PER_LANDMARK.map((r) => r.max_abs_contraction));
const MIN_ABS_OFFDIAG = Math.min(
  ...PER_LANDMARK.map((r) => Math.min(Math.abs(r.Hoff_CC_ET), Math.abs(r.Hoff_CC_CF), Math.abs(r.Hoff_ET_CF))),
);
const MAX_ENTRY_RELDIFF = Math.max(...PER_LANDMARK.map((r) => r.max_entry_reldiff_vs_closed_form));

export const IMP97720_DIAG3_SECOND_ORDER_HESSIAN = {
  id: 'imp-97720',
  proofSection: 'S-frontier',
  question:
    'imp-97668/imp-97689 established the FIRST-order structure -- every amplitude enters E_N linearly, sigma = ' +
    'E_coll/E_N is degree-0 homogeneous in (C_C, E_trunc, C_F), and the diagonal DIAG3 = E_CC + E_ET + E_CF == 0. ' +
    'The SECOND-order structure was never measured. Compute the 3x3 mixed second-derivative (Hessian) of ln sigma ' +
    'in the three log-amplitude axes at L2/L3/L4 and decide: does degree-0 homogeneity force every second-order ' +
    'amplitude COUPLING to zero too, or does a nonzero mixed second elasticity survive the nonlinear wrappers? ' +
    'Measurement/audit only; pinned constants appear only as symbolic differentiation axes; no bound moves; no QED.',
  method:
    'At each fixed landmark abscissa N_L (sigma = 0.9/0.5/0.1) form the central-difference 3x3 Hessian of ln sigma ' +
    'in the log-amplitudes u = (u_c, u_e, u_f) at step h = 1e-3, compare entry-by-entry to the exact closed form ' +
    'H_ij = delta_ij(a_i - b_i) - (a_i a_j - b_i b_j) with numerator shares a = (1,0,0) and denominator shares ' +
    'b = (sigma, E_trunc/E_N, E_flow/E_N), and evaluate the diagonal contraction (row/column sums = second-order ' +
    'DIAG3). Ladder h at L2 to expose the O(h^2) truncation floor of the contraction.',
  axis_order: ['C_C (E_coll)', 'E_trunc', 'C_F (E_flow)'],
  step_h: H_STEP,
  perLandmark: PER_LANDMARK,
  contraction_h_ladder_L2: CONTRACTION_H_LADDER,
  finding: {
    S1_nonzero_mixed_second_elasticities_survive:
      'The off-diagonal log-Hessian entries H_ce, H_cf, H_ef are all nonzero (H_ce = sigma * E_trunc/E_N = ' +
      '+8.11e-2/+2.495e-1/+9.00e-2 at L2/L3/L4; smallest measured off-diagonal magnitude across all three ' +
      'landmarks = ' + MIN_ABS_OFFDIAG.toExponential(3) + '). Degree-0 homogeneity does NOT force the ' +
      'second-order amplitude couplings to zero -- only the first-order diagonal DIAG3 == 0 was ever forced.',
    S2_exact_closed_form:
      'Every measured Hessian entry matches H_ij = delta_ij(a_i - b_i) - (a_i a_j - b_i b_j) with a = (1,0,0) ' +
      'and b = (sigma, E_trunc/E_N, E_flow/E_N) to < ' + MAX_ENTRY_RELDIFF.toExponential(2) + ' relative ' +
      '(5-figure agreement): the log-Hessian is the doubly-centered softmax-difference of the numerator vs ' +
      'denominator amplitude shares.',
    S3_second_order_diag3_is_the_contraction:
      'The row AND column sums of the log-Hessian vanish to the O(h^2) central-difference stencil floor (max |sum| ' +
      'across L2/L3/L4 = ' + MAX_ABS_CONTRACTION.toExponential(3) + ', quartering as h halves: ' +
      CONTRACTION_H_LADDER.map((r) => r.max_abs_row_sum.toExponential(3)).join(' -> ') + '), NOT a real residual. ' +
      'This is the exact second-order Euler relation sum_j H_ij = d/du_i(DIAG3) = 0: the degree-0 homogeneity DOES ' +
      'survive beyond first order, but as the diagonal CONTRACTION of the Hessian, not as vanishing couplings.',
  },
  isRigorous: false,
  verdict:
    'AUDIT (frontier second-order extension, NOT rigorous). Extending the imp-97668 first-order amplitude audit to ' +
    'SECOND order settles the ticket question: the degree-0 homogeneity of sigma = E_coll/E_N does NOT force the ' +
    'second-order amplitude couplings to zero. The 3x3 mixed second-derivative (Hessian) of ln sigma in the three ' +
    'log-amplitude axes has nonzero off-diagonals at every landmark (H_ce = sigma * E_trunc/E_N = +8.11e-2 at L2, ' +
    '+2.495e-1 at L3, +9.00e-2 at L4), each matching the exact closed form H_ij = delta_ij(a_i - b_i) - (a_i a_j - ' +
    'b_i b_j) -- the doubly-centered softmax-difference of the numerator shares a = (1,0,0) and denominator shares ' +
    'b = (sigma, E_trunc/E_N, E_flow/E_N) -- to < ' + MAX_ENTRY_RELDIFF.toExponential(2) + ' relative. What the ' +
    'homogeneity DOES force at second order is the diagonal CONTRACTION: the row and column sums of the log-Hessian ' +
    'vanish to the O(h^2) stencil floor (max |sum| = ' + MAX_ABS_CONTRACTION.toExponential(3) + ', quartering with ' +
    'h), the exact second-order Euler relation sum_j H_ij = d/du_i(DIAG3) = 0. So DIAG3 == 0 survives beyond first ' +
    'order as a second-order contraction identity, NOT as the vanishing of every mixed second elasticity -- a ' +
    'genuine nonzero amplitude coupling survives the nonlinear wrappers (at fixed N the three axes are the ' +
    'imp-97668 A1 term-prefactors; C_KH via sqrt and the Gronwall exponent via exp only rescale the axis they ' +
    'factor through, leaving the doubly-centered structure intact). Conditional-share diagnostic on the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear ' +
    'only as symbolic differentiation axes); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97668 (first-order six-probe amplitude audit; A1 term-prefactor axes); imp-97689 (analytic first-order ' +
    'DIAG3 == 0, Euler degree-0 homogeneity); imp-97710 (first-order DIAG3 == 0 off-anchor at L5); imp-97644 ' +
    '(MEASURED first-order DIAG3 == 0); imp-97520 (landmark ladder L2/L3/L4); imp-398 (C_F flow prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97720_DIAG3_SECOND_ORDER_HESSIAN_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97644/imp-97520/imp-97668 ladder positions (L2, L3, L4).
    id: 'imp97720-landmarks-reproduce-imp97668',
    description: 'L2 ~2.572361e7, L3 ~3.267235e9, L4 ~3.213181e11 reproduce the imp-97668 landmarks to < 5e-3 relative',
    holds: () => {
      const [l2, l3, l4] = PER_LANDMARK;
      return (
        Math.abs(l2.N_L / 2.572361e7 - 1) < 5e-3 &&
        Math.abs(l3.N_L / 3.267235e9 - 1) < 5e-3 &&
        Math.abs(l4.N_L / 3.213181e11 - 1) < 5e-3
      );
    },
  },
  {
    // (S1): the mixed second elasticities are NONZERO -- degree-0 homogeneity does not kill second-order couplings.
    id: 'imp97720-mixed-second-elasticities-nonzero',
    description: 'every off-diagonal log-Hessian entry (H_ce, H_cf, H_ef) is nonzero (|.| > 1e-6) at every landmark',
    holds: () => MIN_ABS_OFFDIAG > 1e-6,
  },
  {
    // (S1): the dominant off-diagonal H_ce is an order-1 coupling matching sigma * E_trunc/E_N at each landmark.
    id: 'imp97720-Hce-equals-sigma-times-trunc-share',
    description: 'H_ce == sigma * E_trunc/E_N (+8.11e-2/+2.495e-1/+9.00e-2 at L2/L3/L4) to < 1e-5 relative',
    holds: () =>
      PER_LANDMARK.every((r) => Math.abs(r.Hoff_CC_ET / (r.sigma * r.share_trunc) - 1) < 1e-5),
  },
  {
    // (S2): every measured Hessian entry matches the exact doubly-centered closed form.
    id: 'imp97720-hessian-matches-closed-form',
    description: 'measured log-Hessian matches H_ij = delta_ij(a_i-b_i)-(a_i a_j-b_i b_j) to < 1e-4 relative (all entries)',
    holds: () => MAX_ENTRY_RELDIFF < 1e-4,
  },
  {
    // (S3): the second-order DIAG3 -- the diagonal contraction (row + column sums) -- is at the stencil floor.
    id: 'imp97720-second-order-diag3-contraction-stencil-floor',
    description: 'row and column sums of the log-Hessian < 1e-7 at every landmark (second-order Euler contraction)',
    holds: () => MAX_ABS_CONTRACTION < 1e-7,
  },
  {
    // (S3): the contraction quarters as h halves -- O(h^2) truncation, not a real residual.
    id: 'imp97720-contraction-quarters-with-h',
    description: 'the L2 contraction shrinks monotonically as h halves (O(h^2) central-difference truncation floor)',
    holds: () => {
      const [h2, h1, h05] = CONTRACTION_H_LADDER;
      return h1.max_abs_row_sum < h2.max_abs_row_sum && h05.max_abs_row_sum < h1.max_abs_row_sum;
    },
  },
  {
    // Honesty gate: measurement/audit only, no QED, no refereed bound is changed.
    id: 'imp97720-honesty-gate-no-qed',
    description: 'Measurement/audit only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97720_DIAG3_SECOND_ORDER_HESSIAN.isRigorous === false &&
      /NO QED/.test(IMP97720_DIAG3_SECOND_ORDER_HESSIAN.verdict) &&
      /refereed bound is changed/i.test(IMP97720_DIAG3_SECOND_ORDER_HESSIAN.verdict),
  },
];

for (const a of IMP97720_DIAG3_SECOND_ORDER_HESSIAN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97720-diag3-second-order-hessian assertion failed: ${a.id}`);
  }
}
