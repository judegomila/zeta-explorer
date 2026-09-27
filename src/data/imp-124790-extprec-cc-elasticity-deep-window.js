/**
 * @module imp-124790-extprec-cc-elasticity-deep-window
 *
 * imp-124790 (numerical/measurement, frontier cross-check): imp-97841 confirmed the g^(-1/2)
 * inverse-square-root fold law FOLD-UNIVERSAL by measuring the deep-window least-squares slope of
 * log10|E| vs log10(g) at the SECOND fold node -- the imp-97662 C_C-elasticity fold
 * E = 2/D, D = 1 + 2 d(ln R)/dx - d(ln L)/dx (x = ln N) -- getting p = -0.500593 (downslope) /
 * -0.499359 (upslope) with a log-linear residual ~4e-4, but only at DOUBLE precision over the
 * shallow window g = 1e-5 .. 1e-8. imp-124767 later showed that same shallow window carries a genuine
 * O(sqrt(g)) running correction (~4e-4 at its shallow end), NOT a precision floor, and deepening to
 * g = 1e-8 .. 1e-12 in extended precision sharpens the reconstruction-KERNEL node to ~1.4e-5. THIS leaf
 * mirrors imp-124767 at the C_C-elasticity node: re-run the imp-97662/imp-97841 closed-form E = 2/D at
 * mpmath dps = 60 (offline script tmp/imp-124790-extprec-cc-elasticity-deepwindow.py) over the deep
 * window g = 1e-8 .. 1e-12, measure the sharpened slope and log-linear residual, and test whether
 * fold-universality holds to ~1e-5 (not just ~4e-4) in the deep window -- confirming sqrt(10) is a true
 * quadratic-fold signature at BOTH nodes to the deep limit.
 *
 * THE CLEAN VERDICT
 * -----------------
 *   (W1) THE ~4e-4 RESIDUAL AT THE ELASTICITY NODE IS NOT A PRECISION FLOOR -- IT IS THE GENUINE
 *        O(sqrt(g)) RUNNING CORRECTION. Re-running the ORIGINAL imp-97841 window g = 1e-5 .. 1e-8 at
 *        dps = 60 reproduces the residual essentially unchanged (4.24e-4 upslope / 3.73e-4 downslope,
 *        p = -0.499360 / -0.500593), matching the double-precision imp-97841 values (p ~ -0.499359 /
 *        -0.500593, residual ~4e-4) to their reported digits. A double-precision floor would have
 *        collapsed at dps = 60; it does not. The ~4e-4 is the finite-gap cubic-fold running term at the
 *        SHALLOW end (g = 1e-8, sqrt(g) = 1e-4) of the imp-97841 window.
 *   (W2) EXTENDING FOUR DECADES DEEPER SHARPENS p -> -1/2 BY ~40x AND SHRINKS THE RESIDUAL BY ~25x.
 *        Over g = 1e-8 .. 1e-12 (extended precision only) the slope is p = -0.499985835 (upslope) /
 *        -0.500014133 (downslope), so |p + 1/2| = 1.42e-5 (up) / 1.41e-5 (down) -- down from ~6e-4 over
 *        the imp-97841 window -- and the log-linear residual drops to 1.60e-5 / 1.59e-5. Per-decade
 *        growth is 3.162175 / 3.162381 vs sqrt(10) = 3.162278: fold-universality now holds to ~1.6e-5.
 *   (W3) THE DEVIATION DECAYS EXACTLY BY sqrt(10) PER DECADE, OPPOSITE-SIGNED ON THE TWO ARMS. The deep
 *        per-decade ratios deviate from sqrt(10) by -3.12e-4 -> -9.84e-5 -> -3.11e-5 -> -9.84e-6
 *        (upslope, from below) and the sign-flipped values (downslope, from above); each step is
 *        1/sqrt(10) = 0.31623 of the previous -- the exact O(sqrt(g)) cubic-fold signature, identical to
 *        the imp-124767 kernel node. p -> -1/2 exactly, a vanishing amplitude correction, NOT a shift.
 *
 * So fold-universality (the imp-97841 finding) is confirmed to the DEEP limit: the imp-97662
 * C_C-elasticity fold and the imp-97823 reconstruction kernel both fold as g^(-1/2) with residual
 * ~1.6e-5 over g = 1e-8 .. 1e-12 (elasticity 1.60e-5/1.59e-5; kernel 1.60e-5/1.60e-5 per imp-124767).
 * The two structurally distinct fold objects inherit the same vanishing-linear denominator of the same
 * quadratic fold, and the sqrt(10) per-decade growth is a generic quadratic-fold Jacobian signature.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and
 * the imp-398 C_F prefactor are UNTOUCHED and appear only as the fixed surrogate; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * Literals baked from the offline mpmath run (dps = 60); this leaf is import-light and does NOT
 * re-import the surrogate at load. Regenerate:
 *   /tmp/rhvenv/bin/python tmp/imp-124790-extprec-cc-elasticity-deepwindow.py
 *
 * @see imp-124767-extprec-deep-window-exponent (the KERNEL node deepened to g=1e-8..1e-12, |p+1/2| ~1.4e-5)
 * @see imp-97841-fold-universal-sqrt10-crossvalidation (double-precision C_C-elasticity node, residual ~4e-4)
 * @see imp-97662-cc-elasticity-peak-divergence (the C_C-elasticity square-root fold E ~ +/- K/sqrt(sigma_max - s))
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5)
 */

const SQRT10 = Math.sqrt(10); // 3.16227766...

// --- Extended-precision peak (mpmath dps=60), matching the imp-97662/imp-97841/imp-97520 L1 maximum. ---
const N_PEAK = 921863.3139; // ~9.218633e5
const SIGMA_MAX = 0.949429014246; // ~0.949429014

// --- (W2/W3) Deep window g = 1e-8 .. 1e-12 (extended precision only; double precision cannot reach it). ---
const DEEP_GAPS = [1e-8, 1e-9, 1e-10, 1e-11, 1e-12];
const DEEP_ABS_E = {
  up: [4233.90868805, 13387.4757516, 42333.5979327, 133869.273943, 423330.497453],
  down: [4232.69066825, 13386.257732, 42332.3799131, 133868.055923, 423329.279433],
};
// Per-decade ratios and their signed deviation from sqrt(10) (decay by ~1/sqrt(10) per decade).
const DEEP_RATIOS = {
  up: [3.1619661, 3.16217924, 3.16224655, 3.16226782],
  down: [3.16258824, 3.16237598, 3.16230876, 3.1622875],
};
const DEEP_DEV_FROM_SQRT10 = {
  up: [-3.12e-4, -9.84e-5, -3.11e-5, -9.84e-6],
  down: [3.11e-4, 9.83e-5, 3.11e-5, 9.84e-6],
};
// Deep-window least-squares slope of log10|E| vs log10(g).
const DEEP_LS = {
  up: { slope_p: -0.499985835, growth_per_decade: 3.16217452, abs_p_plus_half: 1.417e-5, max_resid_log10: 1.599e-5 },
  down: { slope_p: -0.500014133, growth_per_decade: 3.162380568, abs_p_plus_half: 1.413e-5, max_resid_log10: 1.594e-5 },
};

// --- (W1) The ORIGINAL imp-97841 window g = 1e-5 .. 1e-8, RE-RUN at dps = 60 (isolates window from precision). ---
// Reproduces the imp-97841 double-precision residual ~4e-4 unchanged => it is NOT a precision floor.
const REPLICA_97841_WINDOW = {
  up: { slope_p: -0.499359553, max_resid_log10: 4.243e-4 },
  down: { slope_p: -0.500592947, max_resid_log10: 3.732e-4 },
  imp97841_reported_slope: { up: -0.499359, down: -0.500593 },
  imp97841_reported_resid_log10: 4.0e-4,
};

// imp-124767 KERNEL-node deep-window reference (reported values) for the cross-node comparison.
const KERNEL_REF = {
  up_slope: -0.499985852, down_slope: -0.50001415,
  up_resid_log10: 1.596e-5, down_resid_log10: 1.597e-5,
};

export const IMP124790_EXTPREC_CC_ELASTICITY_DEEP_WINDOW = {
  id: 'imp-124790',
  proofSection: 'S-frontier',
  question:
    'imp-97841 confirmed the g^(-1/2) fold law fold-universal at the imp-97662 C_C-elasticity node ' +
    'E = 2/(1 + 2 d ln R/dx - d ln L/dx), slope p = -0.500593/-0.499359 with residual ~4e-4, but only at ' +
    'DOUBLE precision over the shallow window g = 1e-5 .. 1e-8 (the window imp-124767 showed carries a ' +
    'genuine O(sqrt(g)) running correction). Mirror imp-124767 at this node: re-run E = 2/D in extended ' +
    'precision (mpmath dps = 60) over g = 1e-8 .. 1e-12 -- does the slope sharpen to -1/2 to ~1e-5, and ' +
    'does fold-universality hold to the deep limit? Measurement/cross-validation only; pinned constants ' +
    'untouched; no bound moves; NO QED.',
  method:
    'Reconstruct the imp-97662/imp-97841 closed-form C_C-elasticity fold EXACTLY in mpmath (dps = 60): ' +
    'T0 = RvM-inverse effectiveHeightForN(N) by Newton, C_F = (ln(T0/2pi)+1)/(2pi), ' +
    'E_flow = C_F*(L/T0)*exp(2.37e-4), R = E_trunc + E_flow, E_coll = (1/8)*sqrt(3*pi)*sqrt(L/N), ' +
    'sigma = E_coll/(R+E_coll). Solve d sigma/dx = 0 for the peak, bisect sigma(x) = sigma_max - g on each ' +
    'arm, form D = 1 + 2 d ln R/dx - d ln L/dx via high-precision differentiation, and least-squares fit ' +
    'log10|E| (E = 2/D) vs log10(g). Extend the window to g = 1e-8 .. 1e-12 (unreachable in double ' +
    'precision) AND re-run the original g = 1e-5 .. 1e-8 window at dps = 60 to isolate window from ' +
    'precision. Offline script tmp/imp-124790-extprec-cc-elasticity-deepwindow.py; literals baked below.',
  peak: { N_peak: N_PEAK, sigma_max: SIGMA_MAX },
  sqrt10: +SQRT10.toFixed(6),
  fold_object: 'imp-97662 C_C-elasticity E = 2/(1 + 2 d ln R/dx - d ln L/dx) (structurally distinct from the imp-97823 reconstruction kernel |K| = |1/(N sigma_N)|; both fold at the same L1 peak)',
  deep_window: { gaps: DEEP_GAPS, abs_E: DEEP_ABS_E, per_decade_ratios: DEEP_RATIOS, deviation_from_sqrt10: DEEP_DEV_FROM_SQRT10, least_squares: DEEP_LS },
  imp97841_window_replica_at_dps60: REPLICA_97841_WINDOW,
  kernel_reference_imp124767: KERNEL_REF,
  finding: {
    W1_residual_is_running_correction_not_precision_floor:
      'Re-running the ORIGINAL imp-97841 window g = 1e-5 .. 1e-8 at dps = 60 reproduces the residual ' +
      'essentially unchanged (' + REPLICA_97841_WINDOW.up.max_resid_log10.toExponential(2) + ' upslope / ' +
      REPLICA_97841_WINDOW.down.max_resid_log10.toExponential(2) + ' downslope, p = ' +
      REPLICA_97841_WINDOW.up.slope_p + ' / ' + REPLICA_97841_WINDOW.down.slope_p + '), matching the ' +
      'double-precision imp-97841 values (p ~ -0.499359/-0.500593, residual ~4e-4) to their reported ' +
      'digits. A double-precision measurement floor would have collapsed at dps = 60; it does not. The ' +
      '~4e-4 is the genuine finite-gap O(sqrt(g)) cubic-fold running term at the SHALLOW end (g = 1e-8, ' +
      'sqrt(g) = 1e-4).',
    W2_deeper_window_sharpens_p_to_minus_half:
      'Over g = 1e-8 .. 1e-12 (extended precision only) the slope is p = ' + DEEP_LS.up.slope_p +
      ' (upslope) / ' + DEEP_LS.down.slope_p + ' (downslope), so |p + 1/2| = ' +
      DEEP_LS.up.abs_p_plus_half.toExponential(2) + ' (up) / ' + DEEP_LS.down.abs_p_plus_half.toExponential(2) +
      ' (down), down ~40x from ~6e-4 over the imp-97841 window, and the log-linear residual drops to ' +
      DEEP_LS.up.max_resid_log10.toExponential(2) + ' / ' + DEEP_LS.down.max_resid_log10.toExponential(2) +
      ' (~25x smaller than 4e-4). Growth ' + DEEP_LS.up.growth_per_decade + ' / ' +
      DEEP_LS.down.growth_per_decade + ' vs sqrt(10) = ' + SQRT10.toFixed(6) + '. Fold-universality now ' +
      'holds to ~1.6e-5, matching the imp-124767 KERNEL-node residual (' +
      KERNEL_REF.up_resid_log10.toExponential(2) + ' / ' + KERNEL_REF.down_resid_log10.toExponential(2) +
      ') to the deep-limit floor.',
    W3_deviation_decays_by_sqrt10_per_decade:
      'The deep per-decade ratios deviate from sqrt(10) by -3.12e-4 -> -9.84e-5 -> -3.11e-5 -> -9.84e-6 ' +
      '(upslope, from below) and the sign-flipped values (downslope, from above); each step is 1/sqrt(10) = ' +
      '0.31623 of the previous -- the exact O(sqrt(g)) cubic-fold signature, identical to the imp-124767 ' +
      'kernel node, a vanishing amplitude correction to a genuine 1/2 exponent, NOT a distinct exponent.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier cross-check, extended precision, NOT rigorous). Mirroring ' +
    'imp-124767 at the imp-97662 C_C-elasticity fold node E = 2/(1 + 2 d ln R/dx - d ln L/dx): the ' +
    'imp-97841 deep-window ~4e-4 log-linear residual is NOT a double-precision measurement floor -- ' +
    're-running the SAME window g = 1e-5 .. 1e-8 at mpmath dps = 60 reproduces it (4.24e-4 / 3.73e-4) ' +
    'unchanged, so it is the genuine finite-gap O(sqrt(g)) cubic-fold running correction at the shallow ' +
    'end. Extending four decades deeper to g = 1e-8 .. 1e-12 (unreachable in double precision) sharpens ' +
    'the log10|E|-vs-log10(g) slope to p = ' + DEEP_LS.up.slope_p + ' (upslope) / ' + DEEP_LS.down.slope_p +
    ' (downslope), |p + 1/2| ~ 1.4e-5 on both arms, residual ' + DEEP_LS.up.max_resid_log10.toExponential(2) +
    ' / ' + DEEP_LS.down.max_resid_log10.toExponential(2) + ', with the per-decade deviation from sqrt(10) ' +
    'decaying by exactly 1/sqrt(10) per decade and opposite-signed on the two arms. Fold-universality thus ' +
    'holds to the ~1.6e-5 deep-limit floor at BOTH nodes (this elasticity node and the imp-124767 kernel ' +
    'node agree), confirming sqrt(10) is a true quadratic-fold Jacobian signature to the deep limit -- ' +
    'p -> -1/2 exactly; the residual is a vanishing running correction, not an exponent shift. ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned ' +
    'E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124767 (kernel node deepened to g=1e-8..1e-12, |p+1/2| ~1.4e-5); imp-97841 (double-precision ' +
    'C_C-elasticity node, residual ~4e-4); imp-97662 (C_C-elasticity square-root fold E ~ +/- ' +
    'K/sqrt(sigma_max - s)); imp-97520 (L1 peak sigma_max ~ 0.949429, N_peak ~ 9.22e5); imp-398 (C_F flow ' +
    'prefactor); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-2631 (E_trunc fixed-strip); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP124790_EXTPREC_CC_ELASTICITY_DEEP_WINDOW_ASSERTIONS = [
  {
    // The extended-precision peak matches the imp-97662/imp-97841/imp-97520 L1 interior maximum.
    id: 'imp124790-peak-matches-l1',
    description: 'the extended-precision peak is at N_peak ~ 9.22e5 with sigma_max ~ 0.949429 (imp-97520 L1)',
    holds: () => Math.abs(N_PEAK - 9.218633e5) / 9.218633e5 < 1e-3 && Math.abs(SIGMA_MAX - 0.949429) < 1e-5,
  },
  {
    // (W1) Re-running the imp-97841 window at dps=60 reproduces its ~4e-4 residual => NOT a precision floor.
    id: 'imp124790-97841-residual-reproduces-at-dps60',
    description: 'the imp-97841 window g=1e-5..1e-8 residual reproduces ~4e-4 at dps=60 on both arms (not a precision floor)',
    holds: () =>
      Math.abs(REPLICA_97841_WINDOW.up.max_resid_log10 - REPLICA_97841_WINDOW.imp97841_reported_resid_log10) < 1e-4 &&
      Math.abs(REPLICA_97841_WINDOW.down.max_resid_log10 - REPLICA_97841_WINDOW.imp97841_reported_resid_log10) < 1e-4,
  },
  {
    // (W2) The deeper window sharpens |p+1/2| well below the imp-97841 ~6e-4 tolerance on both arms.
    id: 'imp124790-deeper-window-sharpens-slope',
    description: 'the deep window g=1e-8..1e-12 gives |p+1/2| < 3e-5 on both arms (sharper than imp-97841 ~6e-4)',
    holds: () => DEEP_LS.up.abs_p_plus_half < 3e-5 && DEEP_LS.down.abs_p_plus_half < 3e-5,
  },
  {
    // (W2) The deeper-window residual is far below the imp-97841 ~4e-4 (the running term vanishes deeper).
    id: 'imp124790-deeper-window-residual-shrinks',
    description: 'the deep window residual drops below 5e-5 on both arms, well under the imp-97841 ~4e-4',
    holds: () => DEEP_LS.up.max_resid_log10 < 5e-5 && DEEP_LS.down.max_resid_log10 < 5e-5,
  },
  {
    // (W2) The deep-window growth equals sqrt(10) to < 0.1% on both arms (fold-universal to the deep limit).
    id: 'imp124790-deep-growth-is-sqrt10',
    description: 'the deep-window per-decade growth equals sqrt(10) = 3.162278 to < 0.1% on both arms',
    holds: () =>
      Math.abs(DEEP_LS.up.growth_per_decade - SQRT10) / SQRT10 < 1e-3 &&
      Math.abs(DEEP_LS.down.growth_per_decade - SQRT10) / SQRT10 < 1e-3,
  },
  {
    // (W2) The elasticity-node deep residual agrees with the imp-124767 kernel-node deep residual (~1.6e-5).
    id: 'imp124790-agrees-with-kernel-node-deep',
    description: 'the elasticity-node deep residual matches the imp-124767 kernel-node deep residual to < 5e-6 (fold-universal to deep limit)',
    holds: () =>
      Math.abs(DEEP_LS.up.max_resid_log10 - KERNEL_REF.up_resid_log10) < 5e-6 &&
      Math.abs(DEEP_LS.down.max_resid_log10 - KERNEL_REF.down_resid_log10) < 5e-6,
  },
  {
    // (W3) The two arms bracket sqrt(10) with opposite-signed deep deviations (the cubic-fold asymmetry).
    id: 'imp124790-arms-bracket-sqrt10',
    description: 'the deep per-decade ratios bracket sqrt(10): upslope deviation < 0, downslope deviation > 0',
    holds: () =>
      DEEP_DEV_FROM_SQRT10.up.every((d) => d < 0) && DEEP_DEV_FROM_SQRT10.down.every((d) => d > 0),
  },
  {
    // (W3) The per-decade deviation from sqrt(10) decays by ~1/sqrt(10) each decade (O(sqrt(g)) running term).
    id: 'imp124790-deviation-decays-by-sqrt10',
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
    id: 'imp124790-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124790_EXTPREC_CC_ELASTICITY_DEEP_WINDOW.isRigorous === false &&
      /NO QED/.test(IMP124790_EXTPREC_CC_ELASTICITY_DEEP_WINDOW.verdict) &&
      /remains SOTA/.test(IMP124790_EXTPREC_CC_ELASTICITY_DEEP_WINDOW.verdict),
  },
];

for (const a of IMP124790_EXTPREC_CC_ELASTICITY_DEEP_WINDOW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124790-extprec-cc-elasticity-deep-window assertion failed: ${a.id}`);
  }
}
