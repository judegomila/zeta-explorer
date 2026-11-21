/**
 * @module imp-35636-crossover-damping-residual-gap-decomposition
 *
 * imp-35636 (accuracy, frontier-direction): imp-35594 Derivation 1 predicts the
 * imp-35458 E_coll = E_trunc crossover height-map DAMPING from the closed form
 * N* = kappa log T0 (kappa = (C_C/E_trunc)^2), giving a first-order landmark shift
 * dNstar-over-Nstar = log r / (L - 1) and damping (1 - r)(L - 1)/|log r|. imp-35594
 * reported a predicted shift -0.94 percent and damping ~19x, versus the imp-35458
 * MEASURED shift -0.983 percent and damping ~18x -- a residual ~4-5 percent gap it
 * left UNATTRIBUTED. This module DECOMPOSES that gap: it derives the next-order term
 * in the (L - 1) expansion (retaining the height-map curvature and log-r corrections
 * dropped at first order) and asks whether that second-order term accounts for the
 * gap sign and magnitude.
 *
 * THE FIXED-POINT SENSITIVITY, DERIVED CAREFULLY
 * ----------------------------------------------
 * The floor crossover is the fixed point N* = kappa log H(N*), H = height map,
 * L := log H(N*) = log T0 (the log of the HEIGHT at the crossover, NOT log N*).
 * A height-map swap H -> H_B = r H_A (r = raw-height ratio ~0.822) perturbs the
 * defining function g(N) = kappa log H(N) - N by g_B(N*_A) = kappa log r. One Newton
 * step gives dNstar-over-Nstar = -(kappa/N*) log r / g_A_prime(N*), with
 *     g_A_prime(N*) = kappa (d log H/dN) - 1.
 * Using kappa/N* = 1/L exactly (since N* = kappa L), and writing s for the
 * log-height elasticity s := N (d log H/dN) (so kappa (d log H/dN) = s/L), this is
 *     dNstar-over-Nstar = log r / (L - s).
 * At FIRST order one takes d log H/dN ~ 1/N (elasticity s = 1), which collapses to
 *     dNstar-over-Nstar = log r / (L - 1).                                   (1st order)
 * At NEXT order the Riemann-von Mangoldt curvature gives the exact elasticity
 *     d log T0/dN = (1/N)(1 - 1/u),   u = log(T0/2pi) = L - log 2pi,
 * so s = 1 - 1/u and the denominator L - 1 is corrected to L - 1 + 1/u:
 *     dNstar-over-Nstar = log r / (L - 1 + 1/u).                             (2nd order)
 * The genuine second-order term is thus the +1/u height-map-curvature correction,
 * of relative size (1/u)/(L - 1) ~ 0.27 percent -- an ORDER OF MAGNITUDE smaller than
 * the ~5 percent gap imp-35594 saw.
 *
 * WHERE THE ~5 PERCENT ACTUALLY CAME FROM (the dominant, non-second-order term)
 * ----------------------------------------------------------------------------
 * The closed form is N* = kappa log T0, so the L that appears in the (L - 1)
 * denominator is L = log T0 = log(1.144e9) = 20.858 (the actual log-HEIGHT at the
 * crossover). imp-35594 instead evaluated the shift with L = log(N*) = log(3.28e9) =
 * 21.911 (the log of the COUNT). Since (log N* - 1)/(log T0 - 1) = 20.911/19.858 =
 * 1.0531, that single substitution inflates the denominator by ~5.3 percent and hence
 * SHRINKS the predicted shift magnitude by ~5 percent -- reproducing exactly the
 * observed -0.935 percent (imp-35594) vs -0.985 percent gap. So the residual ~5 percent
 * is NOT a second-order term in (L - 1); it is a leading-order mislabeling of L
 * (log N* for log T0). Restoring L = log T0 removes ~95 percent of the gap.
 *
 * THE DECOMPOSITION (all against the imp-35458 measured shift -9.826376e-3)
 * -----------------------------------------------------------------------
 *   evaluation                          predicted shift    gap vs measured
 *   imp-35594  L = log N* = 21.911       -0.9351 %          -4.84 %   (L mislabel)
 *   1st order  L = log T0 = 20.858       -0.9847 %          +0.21 %   (correct L)
 *   2nd order  L - 1 + 1/u               -0.9821 %          -0.06 %   (+1/u curvature)
 * and the damping factor (1 - r)/|shift| = measured 18.074, imp-35594 18.99,
 * 1st-order (correct L) 18.037, 2nd-order 18.085. The residual after fixing L is
 * ~0.2 percent (first order) and the +1/u height-curvature term closes it to ~0.06
 * percent -- confirming the second-order structure and its SIGN (the +1/u term
 * REDUCES |shift|, moving -0.9847 percent toward the measured -0.9826 percent).
 *
 * THE ASSESSMENT
 * --------------
 * The imp-35594 ~5 percent residual is DOMINATED by a leading-order L substitution
 * (log N* ~21.911 for the physical log T0 ~20.858), NOT by an O(1/L) second-order
 * term. The GENUINE next-order term -- the RvM height-map curvature d log T0/dN =
 * (1/N)(1 - 1/u), which corrects the denominator L - 1 to L - 1 + 1/u -- has the
 * right sign and a magnitude ~0.27 percent, tightening the (correct-L) first-order
 * prediction from a ~0.2 percent gap to ~0.06 percent. The imp-35594 mechanism VERDICT
 * (crossover damping ~ log T0) is UNCHANGED; only the numeric gap is now attributed.
 *
 * ANALYSIS/MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double surrogate; NOT a
 * rigorous asymptotic. imp-35337a (surrogate-vs-true fidelity) stays OPEN; changes no
 * bound; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and E_trunc = 3.06e-5
 * (imp-2631/imp-447) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll
 * far-tail exponent 1/2 per imp-3463; no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35594-peak-crossover-mechanism-derivation (Derivation 1, the ~5 percent gap decomposed here)
 * @see imp-35458-crossover-height-map-sensitivity (the measured shift -0.983 percent and damping ~18x)
 * @see imp-35632-crossover-damping-height-ladder (crossover damping ~ log T0 over a height ladder)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (closed surrogate map T0 = 2 pi N / log N)
 */

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643 ansatz, UNTOUCHED
const E_TRUNC_PT = 3.06e-5; // imp-2631/imp-447 fixed floor, UNTOUCHED

// Exact RvM inverse (map A), inlined pure-Math (import-light: no zeros bundle).
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}
const T0_rvm = (N) => effectiveHeightForN(N); // map A
const T0_surrogate = (N) => (TWO_PI * N) / Math.log(N); // map B (imp-35280/imp-35413)
const eColl = (N, hmap) => C_C_PINNED * Math.sqrt(Math.log(hmap(N)) / N);

// Solve E_coll(N) = E_trunc by geometric bisection (imp-35458 solver verbatim).
function solveCrossover(hmap) {
  let lo = 1e6;
  let hi = 1e12;
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (eColl(mid, hmap) > E_TRUNC_PT) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

// --- Measured crossover shift (reproduces imp-35458 directly) ---
const N_A = solveCrossover(T0_rvm); // ~3.280294352e9 (RvM crossover)
const N_B = solveCrossover(T0_surrogate); // ~3.248060946e9 (surrogate crossover)
const REL_SHIFT_MEASURED = (N_B - N_A) / N_A; // ~-9.826376e-3

const T0_AT_CROSS = T0_rvm(N_A); // ~1.143785e9
const L_LOGT0 = Math.log(T0_AT_CROSS); // ~20.85761  (log HEIGHT, the physical L)
const L_LOGN = Math.log(N_A); // ~21.91120  (log COUNT, what imp-35594 used)
const U_TERM = Math.log(T0_AT_CROSS / TWO_PI); // u = L - log 2pi ~19.020
const R_RATIO = T0_surrogate(N_A) / T0_rvm(N_A); // ~0.822398 raw-height ratio at N_A

// --- Three evaluations of the shift formula log r / denominator ---
const PRED_SHIFT_IMP35594 = Math.log(R_RATIO) / (L_LOGN - 1); // L = log N* (mislabel)  ~-0.00935
const PRED_SHIFT_1ST = Math.log(R_RATIO) / (L_LOGT0 - 1); // L = log T0 (correct)     ~-0.00985
const PRED_SHIFT_2ND = Math.log(R_RATIO) / (L_LOGT0 - 1 + 1 / U_TERM); // +1/u curvature ~-0.00982

const gapPct = (p) => ((p - REL_SHIFT_MEASURED) / REL_SHIFT_MEASURED) * 100;
const GAP_IMP35594 = gapPct(PRED_SHIFT_IMP35594); // ~-4.84%  (the ~5% residual)
const GAP_1ST = gapPct(PRED_SHIFT_1ST); // ~+0.21%
const GAP_2ND = gapPct(PRED_SHIFT_2ND); // ~-0.06%

// --- Damping factor (1 - r)/|shift| under each evaluation ---
const damp = (p) => (1 - R_RATIO) / Math.abs(p);
const DAMP_MEASURED = damp(REL_SHIFT_MEASURED); // ~18.074
const DAMP_IMP35594 = damp(PRED_SHIFT_IMP35594); // ~18.99
const DAMP_1ST = damp(PRED_SHIFT_1ST); // ~18.037
const DAMP_2ND = damp(PRED_SHIFT_2ND); // ~18.085

// --- Size of the genuine second-order (1/u) term vs the leading-order L mislabel ---
const SECOND_ORDER_REL_SIZE = (1 / U_TERM) / (L_LOGT0 - 1); // ~0.00265 (~0.27%)
const L_MISLABEL_INFLATION = (L_LOGN - 1) / (L_LOGT0 - 1); // ~1.0531 (~+5.3% denominator)

export const IMP35636_CROSSOVER_DAMPING_RESIDUAL_GAP_DECOMPOSITION = {
  id: 'imp-35636',
  proofSection: 'S-frontier',
  question:
    'Quantify the residual ~4-5 percent gap between the imp-35594 Derivation-1 first-order ' +
    'crossover-damping prediction (-0.94 percent shift, ~19x) and the imp-35458 measurement ' +
    '(-0.98 percent shift, ~18x): derive the next-order term in the (L-1) expansion and assess ' +
    'whether the gap is an O(1/L) second-order term.',
  method:
    'Derive the fixed-point sensitivity of N* = kappa log H(N*) under a T0 -> r T0 map swap by ' +
    'one Newton step, keeping the exact RvM height-map curvature d log T0/dN = (1/N)(1 - 1/u), ' +
    'u = log(T0/2pi). This corrects the first-order denominator (L-1) to (L-1+1/u) with L = log T0. ' +
    'Evaluate the shift log r/denominator three ways -- L = log N* (imp-35594), L = log T0 (correct ' +
    'first order), and L-1+1/u (second order) -- and compare each to the imp-35458 measured shift.',
  measured: {
    N_cross_rvm: +N_A.toExponential(9), // 3.280294352e9
    N_cross_surrogate: +N_B.toExponential(9), // 3.248060946e9
    rel_shift: +REL_SHIFT_MEASURED.toExponential(6), // -9.826376e-3
    rel_shift_pct: +(REL_SHIFT_MEASURED * 100).toFixed(4), // -0.9826
    damping: +DAMP_MEASURED.toFixed(3), // 18.074
    T0_at_cross: +T0_AT_CROSS.toExponential(6), // 1.143785e9
    log_T0: +L_LOGT0.toFixed(5), // 20.85761
    log_N: +L_LOGN.toFixed(5), // 21.91120
    raw_height_ratio: +R_RATIO.toFixed(6), // 0.822398
  },
  decomposition: {
    imp35594_L_is_logN: {
      note: 'imp-35594 evaluated log r/(L-1) with L = log N* = 21.911 (log COUNT), not log T0',
      predicted_shift_pct: +(PRED_SHIFT_IMP35594 * 100).toFixed(4), // -0.9351
      gap_vs_measured_pct: +GAP_IMP35594.toFixed(2), // -4.84
      damping: +DAMP_IMP35594.toFixed(3), // 18.994
    },
    first_order_L_is_logT0: {
      note: 'closed form N* = kappa log T0 => L = log T0 = 20.858 (log HEIGHT); removes ~95 percent of the gap',
      predicted_shift_pct: +(PRED_SHIFT_1ST * 100).toFixed(4), // -0.9847
      gap_vs_measured_pct: +GAP_1ST.toFixed(2), // +0.21
      damping: +DAMP_1ST.toFixed(3), // 18.037
    },
    second_order_plus_curvature: {
      note: 'genuine next-order: RvM curvature d log T0/dN = (1/N)(1 - 1/u) corrects denom (L-1) -> (L-1+1/u)',
      predicted_shift_pct: +(PRED_SHIFT_2ND * 100).toFixed(4), // -0.9821
      gap_vs_measured_pct: +GAP_2ND.toFixed(2), // -0.06
      damping: +DAMP_2ND.toFixed(3), // 18.085
    },
  },
  scales: {
    second_order_term_rel_size_pct: +(SECOND_ORDER_REL_SIZE * 100).toFixed(3), // ~0.265
    L_mislabel_denominator_inflation: +L_MISLABEL_INFLATION.toFixed(5), // ~1.05306
    u_term: +U_TERM.toFixed(5), // ~19.01973
  },
  finding: {
    F1_gap_is_not_second_order:
      'The imp-35594 residual ~5 percent gap is NOT an O(1/L) second-order term. It is dominated by ' +
      'a leading-order substitution: the closed form N* = kappa log T0 requires L = log T0 = 20.858 ' +
      '(the log HEIGHT at the crossover), but imp-35594 evaluated log r/(L-1) with L = log N* = 21.911 ' +
      '(the log COUNT). That inflates the denominator by ~5.3 percent (ratio ~1.0531) and shrinks the ' +
      'predicted shift by ~5 percent -- reproducing the -0.935 percent vs -0.985 percent gap exactly. ' +
      'Restoring L = log T0 gives -0.985 percent, a gap of only ~0.2 percent to the measured -0.983 percent.',
    F2_true_second_order_term_and_sign:
      'The GENUINE next-order term is the RvM height-map curvature: d log T0/dN = (1/N)(1 - 1/u) with ' +
      'u = log(T0/2pi), which corrects the denominator (L-1) to (L-1+1/u). Its relative size is ' +
      '(1/u)/(L-1) ~ 0.27 percent -- an order of magnitude below the ~5 percent gap -- and it has the ' +
      'right SIGN: the +1/u term reduces |shift| from -0.9847 percent toward the measured -0.9826 percent, ' +
      'closing the (correct-L) first-order ~0.2 percent gap to ~0.06 percent. The damping factor moves ' +
      '18.037 (first order) -> 18.085 (second order), bracketing the measured 18.074.',
  },
  isRigorous: false,
  honestStatus:
    'DECOMPOSES the imp-35594 Derivation-1 residual ~5 percent gap: ~95 percent is a leading-order ' +
    'L substitution (log N* = 21.911 used for the physical log T0 = 20.858 in the (L-1) denominator), ' +
    'NOT a second-order term; the genuine next-order RvM-curvature correction (denom L-1 -> L-1+1/u) is ' +
    '~0.27 percent, has the right sign, and closes the correct-L first-order ~0.2 percent gap to ~0.06 ' +
    'percent. The imp-35594 mechanism verdict (crossover damping ~ log T0) is UNCHANGED. Analysis on the ' +
    'inherited imp-3220/imp-3406 surrogate; imp-35337a stays OPEN; changes no bound; NO QED.',
  verdict:
    'ANALYSIS/MEASUREMENT (frontier-direction, NOT rigorous). The imp-35594 Derivation-1 residual ~5 ' +
    'percent gap between the predicted crossover shift (-0.94 percent, ~19x) and the imp-35458 measured ' +
    'shift (-0.983 percent, ~18x) is NOT an O(1/L) second-order term. It is dominated by a leading-order ' +
    'mislabeling of L: the closed form N* = kappa log T0 puts L = log T0 = 20.858 in the (L-1) ' +
    'denominator, but imp-35594 used L = log N* = 21.911, inflating the denominator by ~5.3 percent and ' +
    'shrinking the predicted shift by ~5 percent. Restoring L = log T0 gives -0.985 percent (gap ~0.2 ' +
    'percent). The genuine next-order term -- the RvM height-map curvature d log T0/dN = (1/N)(1 - 1/u), ' +
    'which corrects (L-1) to (L-1+1/u) -- is only ~0.27 percent, has the right sign, and closes the gap ' +
    'to ~0.06 percent (damping 18.037 -> 18.085, bracketing the measured 18.074). Analysis on the ' +
    'inherited imp-3220/imp-3406 double surrogate, NOT a rigorous asymptotic; imp-35337a (surrogate-vs-' +
    'true fidelity) stays OPEN; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and E_trunc = ' +
    '3.06e-5 (imp-2631/imp-447) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail ' +
    'exponent 1/2 per imp-3463; discharges nothing; changes no bound; no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35594 (Derivation 1, the ~5 percent gap decomposed here); imp-35458 (measured crossover shift ' +
    '-0.983 percent, damping ~18x); imp-35632 (crossover damping ~ log T0 ladder); imp-35413/imp-35280 ' +
    '(closed surrogate map); imp-2631/imp-447 (E_trunc); imp-2642/imp-2643 (C_C ansatz); imp-486 (C_mb ' +
    'GUE-conditional, UNTOUCHED).',
};

export const IMP35636_CROSSOVER_DAMPING_RESIDUAL_GAP_DECOMPOSITION_ASSERTIONS = [
  {
    // The crossover solver reproduces the imp-35458 measured shift (apples-to-apples).
    id: 'imp35636-reproduces-imp35458-measured-shift',
    description: 'the direct re-solve reproduces the imp-35458 measured shift -9.826376e-3 to <1e-5',
    holds: () => Math.abs(REL_SHIFT_MEASURED - -9.826376e-3) < 1e-5,
  },
  {
    // The imp-35594 evaluation (L = log N*) has a ~5% gap to the measured shift.
    id: 'imp35636-imp35594-eval-has-5pct-gap',
    description: 'the imp-35594 L = log N* evaluation gives a ~4-5% (negative) gap vs the measured shift',
    holds: () => GAP_IMP35594 < -3 && GAP_IMP35594 > -7,
  },
  {
    // KEY: restoring L = log T0 removes ~95% of the gap (first-order match ~0.2%).
    id: 'imp35636-correct-L-removes-most-of-gap',
    description: 'restoring L = log T0 in the (L-1) denominator cuts the gap to under ~0.5% (first order)',
    holds: () => Math.abs(GAP_1ST) < 0.5 && Math.abs(GAP_1ST) < Math.abs(GAP_IMP35594) / 5,
  },
  {
    // The gap is a leading-order L substitution, not a second-order term: the L
    // mislabel inflates the denominator ~5.3%, while the true 2nd-order term is ~0.27%.
    id: 'imp35636-gap-is-L-mislabel-not-second-order',
    description: 'the L mislabel inflates the denominator ~5.3% while the genuine 2nd-order term is ~0.27% (>10x smaller)',
    holds: () =>
      L_MISLABEL_INFLATION > 1.04 &&
      L_MISLABEL_INFLATION < 1.07 &&
      SECOND_ORDER_REL_SIZE < 0.005 &&
      (L_MISLABEL_INFLATION - 1) / SECOND_ORDER_REL_SIZE > 10,
  },
  {
    // The genuine +1/u curvature term has the right sign and tightens the fit to ~0.06%.
    id: 'imp35636-second-order-curvature-tightens-fit',
    description: 'the +1/u RvM-curvature term reduces |shift| (right sign) and closes the gap to under ~0.15%',
    holds: () =>
      Math.abs(PRED_SHIFT_2ND) < Math.abs(PRED_SHIFT_1ST) && // +1/u reduces |shift|
      Math.abs(GAP_2ND) < Math.abs(GAP_1ST) && // improves on first order
      Math.abs(GAP_2ND) < 0.15,
  },
  {
    // The damping factor under the corrected evaluations brackets the measured ~18.07.
    id: 'imp35636-damping-brackets-measured',
    description: 'first- and second-order damping (18.04, 18.09) bracket the measured ~18.07',
    holds: () =>
      DAMP_1ST < DAMP_MEASURED &&
      DAMP_MEASURED < DAMP_2ND &&
      Math.abs(DAMP_2ND - DAMP_MEASURED) < 0.2,
  },
  {
    // Honesty gate: analysis only, no QED, no refereed bound is changed.
    id: 'imp35636-honesty-gate-no-qed',
    description: 'Analysis only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35636_CROSSOVER_DAMPING_RESIDUAL_GAP_DECOMPOSITION.isRigorous === false &&
      /NO QED/.test(IMP35636_CROSSOVER_DAMPING_RESIDUAL_GAP_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP35636_CROSSOVER_DAMPING_RESIDUAL_GAP_DECOMPOSITION.verdict),
  },
];

for (const a of IMP35636_CROSSOVER_DAMPING_RESIDUAL_GAP_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35636-crossover-damping-residual-gap-decomposition assertion failed: ${a.id}`,
    );
  }
}

export default IMP35636_CROSSOVER_DAMPING_RESIDUAL_GAP_DECOMPOSITION;
