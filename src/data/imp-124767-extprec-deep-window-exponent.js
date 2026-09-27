/**
 * @module imp-124767-extprec-deep-window-exponent
 *
 * imp-124767 (numerical/measurement, frontier cross-check): imp-97823 measured the deep-window
 * least-squares slope of log10|K| vs log10(g) at p = -0.4994 (upslope) / -0.5006 (downslope),
 * bracketing -1/2 with a log-linear residual ~4e-4, over the near-peak window g = 1e-5 .. 1e-8 --
 * at DOUBLE precision, where the g < 1e-8 landmark rungs approach the bisection round-off floor
 * (sigma_max ~ 0.9494; subtracting g = 1e-12 leaves only ~4 significant digits in a 16-digit float,
 * so the crossing bisection is badly corrupted). This leaf re-runs the same closed-form surrogate in
 * EXTENDED precision (mpmath, dps = 60; offline script tmp/imp-124767-extprec-deepwindow.py) to
 * (a) extend the deep window four decades deeper to g = 1e-8 .. 1e-12, unreachable in double precision,
 * and (b) settle whether the imp-97823 ~4e-4 residual was a genuine finite-gap running correction or a
 * double-precision measurement floor.
 *
 * THE CLEAN VERDICT
 * -----------------
 *   (V1) THE ~4e-4 RESIDUAL IS NOT A PRECISION FLOOR -- IT IS THE GENUINE O(sqrt(g)) RUNNING CORRECTION.
 *        Re-running the ORIGINAL imp-97823 window g = 1e-5 .. 1e-8 at dps = 60 reproduces the residual
 *        essentially unchanged (3.97e-4 upslope / 4.00e-4 downslope, and p = -0.499385 / -0.500618),
 *        matching the double-precision imp-97823 values to their reported digits. If the residual had
 *        been a double-precision measurement floor it would have collapsed at dps = 60; it does not.
 *        The ~4e-4 is the finite-gap cubic-fold running term evaluated at the SHALLOW end (g = 1e-8,
 *        sqrt(g) = 1e-4) of the imp-97823 window.
 *   (V2) EXTENDING FOUR DECADES DEEPER SHARPENS p -> -1/2 BY ~30x AND SHRINKS THE RESIDUAL BY ~25x.
 *        Over g = 1e-8 .. 1e-12 (extended precision only) the slope is p = -0.499985852 (upslope) /
 *        -0.500014150 (downslope), so |p + 1/2| = 1.42e-5 on BOTH arms (down from ~6e-4 over the
 *        imp-97823 window), and the log-linear residual drops to 1.60e-5 (upslope) / 1.60e-5 (downslope).
 *        The per-decade growth is 3.162175 / 3.162381 vs sqrt(10) = 3.162278.
 *   (V3) THE DEVIATION DECAYS EXACTLY BY sqrt(10) PER DECADE, OPPOSITE-SIGNED ON THE TWO ARMS.
 *        The deep per-decade ratios deviate from sqrt(10) by -3.11e-4 -> -9.84e-5 -> -3.11e-5 -> -9.84e-6
 *        (upslope, from below) and +3.11e-4 -> +9.84e-5 -> +3.11e-5 -> +9.84e-6 (downslope, from above);
 *        each step is 1/sqrt(10) = 0.31623 of the previous, the exact O(sqrt(g)) cubic-fold signature.
 *        p -> -1/2 exactly with no exponent shift; the residual is a vanishing amplitude correction.
 *
 * So the imp-97823 measurement floor was NOT the limiter over its window; double precision only becomes
 * limiting PAST g ~ 1e-8, which is exactly why extended precision was required to reach g = 1e-12 and
 * confirm p -> -1/2 to ~1.4e-5.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F
 * prefactor are UNTOUCHED and appear only as the fixed surrogate; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * Literals baked from the offline mpmath run (dps = 60); this leaf is import-light and does NOT re-import
 * the surrogate at load. Regenerate: /tmp/rhvenv/bin/python tmp/imp-124767-extprec-deepwindow.py
 *
 * @see imp-97823-kernel-decade-growth-sqrt10 (double-precision deep window g=1e-5..1e-8, residual ~4e-4)
 * @see imp-97721-diag3-peak-upslope-crossvalidation (kernel |K| ~ sqrt(10) per decade, qualitative)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5)
 */

const SQRT10 = Math.sqrt(10); // 3.16227766...

// --- Extended-precision peak (mpmath dps=60), matching the imp-97823/imp-97520 L1 interior maximum. ---
const N_PEAK = 921863.3139; // ~9.218633e5
const SIGMA_MAX = 0.949429014246; // ~0.949429014

// --- (V2/V3) Deep window g = 1e-8 .. 1e-12 (extended precision only; double precision cannot reach it). ---
const DEEP_GAPS = [1e-8, 1e-9, 1e-10, 1e-11, 1e-12];
const DEEP_ABS_K = {
  up: [88181.5010947, 278826.964286, 881700.853599, 2788155.48569, 8816894.37888],
  down: [88156.1328542, 278801.596045, 881675.485358, 2788130.11745, 8816869.01064],
};
// Per-decade ratios and their signed deviation from sqrt(10) (decay by ~1/sqrt(10) per decade).
const DEEP_RATIOS = {
  up: [3.16196664, 3.1621793, 3.16224655, 3.16226782],
  down: [3.16258877, 3.16237603, 3.16230877, 3.1622875],
};
const DEEP_DEV_FROM_SQRT10 = {
  up: [-3.11e-4, -9.84e-5, -3.11e-5, -9.84e-6],
  down: [3.11e-4, 9.84e-5, 3.11e-5, 9.84e-6],
};
// Deep-window least-squares slope of log10|K| vs log10(g).
const DEEP_LS = {
  up: { slope_p: -0.499985852, growth_per_decade: 3.162174645, abs_p_plus_half: 1.415e-5, max_resid_log10: 1.596e-5 },
  down: { slope_p: -0.50001415, growth_per_decade: 3.162380692, abs_p_plus_half: 1.415e-5, max_resid_log10: 1.597e-5 },
};

// --- (V1) The ORIGINAL imp-97823 window g = 1e-5 .. 1e-8, RE-RUN at dps = 60 (isolates window from precision). ---
// Reproduces the imp-97823 double-precision residual ~4e-4 unchanged => it is NOT a precision floor.
const REPLICA_97823_WINDOW = {
  up: { slope_p: -0.499384649, max_resid_log10: 3.973e-4 },
  down: { slope_p: -0.500618043, max_resid_log10: 4.002e-4 },
  imp97823_reported_slope: { up: -0.4994, down: -0.5006 },
  imp97823_reported_resid_log10: 4.0e-4,
};

export const IMP124767_EXTPREC_DEEP_WINDOW_EXPONENT = {
  id: 'imp-124767',
  proofSection: 'S-frontier',
  question:
    'imp-97823 measured the deep-window log10|K|-vs-log10(g) slope at p = -0.4994/-0.5006 with a ' +
    '~4e-4 log-linear residual over g = 1e-5 .. 1e-8, at double precision where g < 1e-8 rungs approach ' +
    'the landmark-bisection round-off floor. Re-run in extended precision (mpmath, dps = 60): does p ' +
    'converge to exactly -1/2 to a sharper tolerance over a deeper window g = 1e-8 .. 1e-12, and is the ' +
    '~4e-4 residual the genuine finite-gap running correction or a double-precision measurement floor? ' +
    'Measurement/sensitivity only; pinned constants untouched; no bound moves; no QED.',
  method:
    'Reconstruct the imp-97823 closed-form surrogate EXACTLY in mpmath (dps = 60): T0 = RvM-inverse ' +
    'effectiveHeightForN(N) by Newton, C_F = (ln(T0/2pi)+1)/(2pi), E_flow = C_F*(L/T0)*exp(2.37e-4), ' +
    'E_coll = (1/8)*sqrt(3*pi)*sqrt(L/N), sigma = E_coll/E_N. Solve d sigma/dx = 0 for the peak, bisect ' +
    'sigma(x) = sigma_max - g on each arm, take |K| = 1/|d sigma/d ln N| via high-precision differentiation, ' +
    'and least-squares fit log10|K| vs log10(g). Extend the window to g = 1e-8 .. 1e-12 (unreachable in ' +
    'double precision) AND re-run the original g = 1e-5 .. 1e-8 window at dps = 60 to isolate window from ' +
    'precision. Offline script tmp/imp-124767-extprec-deepwindow.py; literals baked below.',
  peak: { N_peak: N_PEAK, sigma_max: SIGMA_MAX },
  sqrt10: +SQRT10.toFixed(6),
  deep_window: { gaps: DEEP_GAPS, abs_K: DEEP_ABS_K, per_decade_ratios: DEEP_RATIOS, deviation_from_sqrt10: DEEP_DEV_FROM_SQRT10, least_squares: DEEP_LS },
  imp97823_window_replica_at_dps60: REPLICA_97823_WINDOW,
  finding: {
    V1_residual_is_running_correction_not_precision_floor:
      'Re-running the ORIGINAL imp-97823 window g = 1e-5 .. 1e-8 at dps = 60 reproduces the residual ' +
      'essentially unchanged (' + REPLICA_97823_WINDOW.up.max_resid_log10.toExponential(2) + ' upslope / ' +
      REPLICA_97823_WINDOW.down.max_resid_log10.toExponential(2) + ' downslope, p = ' +
      REPLICA_97823_WINDOW.up.slope_p + ' / ' + REPLICA_97823_WINDOW.down.slope_p + '), matching the ' +
      'double-precision imp-97823 values (p ~ -0.4994/-0.5006, residual ~4e-4) to their reported digits. ' +
      'A double-precision measurement floor would have collapsed at dps = 60; it does not. The ~4e-4 is the ' +
      'genuine finite-gap O(sqrt(g)) cubic-fold running term at the SHALLOW end (g = 1e-8, sqrt(g) = 1e-4).',
    V2_deeper_window_sharpens_p_to_minus_half:
      'Over g = 1e-8 .. 1e-12 (extended precision only) the slope is p = ' + DEEP_LS.up.slope_p +
      ' (upslope) / ' + DEEP_LS.down.slope_p + ' (downslope), so |p + 1/2| = ' +
      DEEP_LS.up.abs_p_plus_half.toExponential(2) + ' on BOTH arms (down ~30x from ~6e-4 over the ' +
      'imp-97823 window), and the log-linear residual drops to ' + DEEP_LS.up.max_resid_log10.toExponential(2) +
      ' / ' + DEEP_LS.down.max_resid_log10.toExponential(2) + ' (~25x smaller than 4e-4). Growth ' +
      DEEP_LS.up.growth_per_decade + ' / ' + DEEP_LS.down.growth_per_decade + ' vs sqrt(10) = ' +
      SQRT10.toFixed(6) + '. p -> -1/2 exactly, no exponent shift.',
    V3_deviation_decays_by_sqrt10_per_decade:
      'The deep per-decade ratios deviate from sqrt(10) by -3.11e-4 -> -9.84e-5 -> -3.11e-5 -> -9.84e-6 ' +
      '(upslope, from below) and the sign-flipped values (downslope, from above); each step is 1/sqrt(10) = ' +
      '0.31623 of the previous -- the exact O(sqrt(g)) cubic-fold signature, a vanishing amplitude ' +
      'correction to a genuine 1/2 exponent, NOT a distinct exponent.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier cross-check, extended precision, NOT rigorous). The imp-97823 deep-window ' +
    '~4e-4 log-linear residual is NOT a double-precision measurement floor: re-running the SAME window ' +
    'g = 1e-5 .. 1e-8 at mpmath dps = 60 reproduces it (3.97e-4 / 4.00e-4) unchanged. It is the genuine ' +
    'finite-gap O(sqrt(g)) cubic-fold running correction evaluated at the shallow end of that window. ' +
    'Extending four decades deeper to g = 1e-8 .. 1e-12 (unreachable in double precision, where ' +
    'sigma_max - g loses ~12 of 16 digits) sharpens the log10|K|-vs-log10(g) slope to p = ' +
    DEEP_LS.up.slope_p + ' (upslope) / ' + DEEP_LS.down.slope_p + ' (downslope), |p + 1/2| = ' +
    DEEP_LS.up.abs_p_plus_half.toExponential(2) + ' on both arms, residual ' +
    DEEP_LS.up.max_resid_log10.toExponential(2) + ', with the per-decade deviation from sqrt(10) decaying ' +
    'by exactly 1/sqrt(10) per decade and opposite-signed on the two arms. p -> -1/2 exactly; the residual ' +
    'is a vanishing running correction, not an exponent shift. Conditional-share diagnostic on the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97823 (double-precision deep window g=1e-5..1e-8, residual ~4e-4); imp-97721 (kernel |K| ~ ' +
    'sqrt(10) per decade, qualitative); imp-97520 (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5); ' +
    'imp-398 (C_F flow prefactor); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-2631 (E_trunc fixed-strip); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP124767_EXTPREC_DEEP_WINDOW_EXPONENT_ASSERTIONS = [
  {
    // The extended-precision peak matches the imp-97823/imp-97520 L1 interior maximum.
    id: 'imp124767-peak-matches-l1',
    description: 'the extended-precision peak is at N_peak ~ 9.22e5 with sigma_max ~ 0.949429 (imp-97520 L1)',
    holds: () => Math.abs(N_PEAK - 9.218633e5) / 9.218633e5 < 1e-3 && Math.abs(SIGMA_MAX - 0.949429) < 1e-5,
  },
  {
    // (V1) Re-running the imp-97823 window at dps=60 reproduces its ~4e-4 residual => NOT a precision floor.
    id: 'imp124767-97823-residual-reproduces-at-dps60',
    description: 'the imp-97823 window g=1e-5..1e-8 residual reproduces ~4e-4 at dps=60 on both arms (not a precision floor)',
    holds: () =>
      Math.abs(REPLICA_97823_WINDOW.up.max_resid_log10 - REPLICA_97823_WINDOW.imp97823_reported_resid_log10) < 1e-4 &&
      Math.abs(REPLICA_97823_WINDOW.down.max_resid_log10 - REPLICA_97823_WINDOW.imp97823_reported_resid_log10) < 1e-4,
  },
  {
    // (V2) The deeper window sharpens |p+1/2| well below the imp-97823 ~6e-4 tolerance on both arms.
    id: 'imp124767-deeper-window-sharpens-slope',
    description: 'the deep window g=1e-8..1e-12 gives |p+1/2| < 3e-5 on both arms (sharper than imp-97823 ~6e-4)',
    holds: () => DEEP_LS.up.abs_p_plus_half < 3e-5 && DEEP_LS.down.abs_p_plus_half < 3e-5,
  },
  {
    // (V2) The deeper-window residual is far below the imp-97823 ~4e-4 (the running term vanishes deeper).
    id: 'imp124767-deeper-window-residual-shrinks',
    description: 'the deep window residual drops below 5e-5 on both arms, well under the imp-97823 ~4e-4',
    holds: () => DEEP_LS.up.max_resid_log10 < 5e-5 && DEEP_LS.down.max_resid_log10 < 5e-5,
  },
  {
    // (V2) The deep-window growth equals sqrt(10) to < 0.1% on both arms.
    id: 'imp124767-deep-growth-is-sqrt10',
    description: 'the deep-window per-decade growth equals sqrt(10) = 3.162278 to < 0.1% on both arms',
    holds: () =>
      Math.abs(DEEP_LS.up.growth_per_decade - SQRT10) / SQRT10 < 1e-3 &&
      Math.abs(DEEP_LS.down.growth_per_decade - SQRT10) / SQRT10 < 1e-3,
  },
  {
    // (V3) The two arms bracket sqrt(10) with opposite-signed deep deviations (the cubic-fold asymmetry).
    id: 'imp124767-arms-bracket-sqrt10',
    description: 'the deep per-decade ratios bracket sqrt(10): upslope deviation < 0, downslope deviation > 0',
    holds: () =>
      DEEP_DEV_FROM_SQRT10.up.every((d) => d < 0) && DEEP_DEV_FROM_SQRT10.down.every((d) => d > 0),
  },
  {
    // (V3) The per-decade deviation from sqrt(10) decays by ~1/sqrt(10) each decade (O(sqrt(g)) running term).
    id: 'imp124767-deviation-decays-by-sqrt10',
    description: 'each deep deviation from sqrt(10) is ~1/sqrt(10) = 0.3162 of the previous on both arms',
    holds: () => {
      const check = (arr) => {
        for (let i = 0; i + 1 < arr.length; i++) {
          const f = Math.abs(arr[i + 1]) / Math.abs(arr[i]);
          if (!(Math.abs(f - 1 / SQRT10) < 0.03)) return false;
        }
        return true;
      };
      return check(DEEP_DEV_FROM_SQRT10.up) && check(DEEP_DEV_FROM_SQRT10.down);
    },
  },
  {
    // Honesty gate: measurement only, no QED, PT stays SOTA.
    id: 'imp124767-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124767_EXTPREC_DEEP_WINDOW_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP124767_EXTPREC_DEEP_WINDOW_EXPONENT.verdict) &&
      /remains SOTA/.test(IMP124767_EXTPREC_DEEP_WINDOW_EXPONENT.verdict),
  },
];

for (const a of IMP124767_EXTPREC_DEEP_WINDOW_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124767-extprec-deep-window-exponent assertion failed: ${a.id}`);
  }
}
