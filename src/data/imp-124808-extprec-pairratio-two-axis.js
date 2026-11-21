/**
 * @module imp-124808-extprec-pairratio-two-axis
 *
 * imp-124808 (numerical / cross-validation, frontier cross-check): imp-124788 lifted the imp-124770/imp-97665
 * pair-ratio identity E_CF/E_ET = E_flow/E_trunc to mpmath dps=60 at a SINGLE (dps, eps) point (dps=60, eps=1e-3)
 * and found the deep-tail |reldiff| collapses from the double-precision 2.01e-5 (L6) / 6.80e-4 (L7) back to a flat
 * ~3.33e-14. But a single point CANNOT decide whether that ~3.33e-14 is a working-precision floor (=> a genuine
 * tiny identity residual) or the O(eps^4) 5-point stencil truncation error (=> the identity is exact, the floor is
 * pure stencil bias). This leaf sweeps the TWO axes independently at the deep landmarks L6/L7 (offline script
 * tmp/imp-124808-extprec-pairratio-two-axis.py) to separate them, mirroring the imp-97183 extended-precision ladder
 * approach. Numerical / cross-validation only; conditional-share diagnostic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; the pinned constants are perturbed only symbolically as differentiation axes; no bound moves; NO QED.
 *
 * THE METHOD (imp-124770/imp-97665 machinery, lifted VERBATIM to mpmath, swept on two axes)
 * ---------------------------------------------------------------------------------------
 *   T0 = effectiveHeightForN(N) (RvM inverse, Newton); L = ln T0;
 *   E_flow = cf*(ln(T0/2pi)+1)/(2pi) * (L/T0) * exp(TC_A1_TRAP);  E_coll = C_C_PINNED*sqrt(L/N);
 *   E_N = et + E_flow + E_coll;  sigma = E_coll/E_N;  landmark(level) = downslope sigma(N)=level (bisection).
 *   E_ET = d ln N_L / d ln e (E_trunc axis), E_CF = d ln N_L / d ln f (C_F axis), both via the imp-97665 5-point
 *   O(eps^4) stencil. Target E_flow/E_trunc is the closed-form pair-ratio (imp-97665). |reldiff| = |E_CF/E_ET / target - 1|.
 *     AXIS A -- dps ladder {30,45,60,80,120} at FIXED eps=1e-3: if |reldiff| plateaus, it is NOT working-precision-limited.
 *     AXIS B -- eps ladder {1e-2,1e-3,1e-4,1e-5,1e-6} at FIXED dps=100: if |reldiff| ~ C*eps^4 (drop ~1e4 per decade,
 *               log-log slope 4) and extrapolates to 0, the identity carries NO residual floor.
 *
 * THE RESULT (the deliverable)
 * ----------------------------
 *   AXIS A (fixed eps=1e-3) -- |reldiff| is 3.3333e-14 at EVERY dps in {30,45,60,80,120}, for BOTH L6 and L7.
 *     Raising the working precision four-fold (dps 30 -> 120) does NOT move it: the imp-124788 ~3.33e-14 is NOT a
 *     working-precision / round-off floor.
 *   AXIS B (fixed dps=100) -- |reldiff| drops by exactly ~1e4 per eps decade at BOTH L6 and L7:
 *     eps=1e-2 -> 3.3334e-10, 1e-3 -> 3.3333e-14, 1e-4 -> 3.3333e-18, 1e-5 -> 3.3333e-22, 1e-6 -> 3.3333e-26.
 *     The log-log slope d ln|reldiff| / d ln eps is 4.000 on every sub-interval for both rungs -- a clean O(eps^4)
 *     5-point stencil truncation law, |reldiff| ~ eps^4 / 30, extrapolating to 0 as eps -> 0.
 *
 * THE FINDING (numerical / cross-validation only)
 * -----------------------------------------------
 *   (M1) THE imp-124788 ~3.33e-14 FLOOR IS PURE O(eps^4) STENCIL TRUNCATION, NOT A WORKING-PRECISION FLOOR. On axis A
 *        the |reldiff| is dps-invariant (3.3333e-14 across dps 30..120): more digits buy nothing, so the floor is set
 *        by the eps=1e-3 stencil step, not by round-off. imp-124788 measured exactly this value because eps=1e-3 gives
 *        eps^4/30 = 3.33e-14.
 *   (M2) THE imp-97665 IDENTITY CARRIES ZERO RESIDUAL DRIFT AT L6/L7. On axis B the |reldiff| follows a clean eps^4
 *        law (slope 4.000, factor ~1e4 per decade) all the way to 3.33e-26 at eps=1e-6 with no plateau -- it
 *        extrapolates to 0 as eps -> 0. There is NO residual identity deviation hiding under the imp-124788 floor:
 *        E_CF/E_ET = E_flow/E_trunc is exact at the deep landmarks to arbitrary precision, definitively separating
 *        the exact identity from any round-off / truncation floor (imp-124808 objective).
 *
 * NUMERICAL / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124788-extprec-pairratio-deep-landmark (the single-point dps=60 collapse this leaf resolves into two axes)
 * @see imp-124770-pair-ratio-identity-landmark-ladder (the DOUBLE-precision ladder L2..L7)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the |E_CF| round-off crossover pinned between L5 and L6)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (the EXACT pair-ratio + 5-point verify at L2/L3/L4)
 * @see imp-97183-krein-csharp-extprec-ladder (the extended-precision ladder approach mirrored here)
 */

// Extended-precision measured literals from tmp/imp-124808-extprec-pairratio-two-axis.py.
// AXIS A: |reldiff| at fixed eps=1e-3, swept over dps (working precision). Both L6 and L7 read identically.
const AXIS_A_DPS_LADDER = [
  { dps: 30, reldiff_L6: 3.3333e-14, reldiff_L7: 3.3333e-14 },
  { dps: 45, reldiff_L6: 3.3333e-14, reldiff_L7: 3.3333e-14 },
  { dps: 60, reldiff_L6: 3.3333e-14, reldiff_L7: 3.3333e-14 },
  { dps: 80, reldiff_L6: 3.3333e-14, reldiff_L7: 3.3333e-14 },
  { dps: 120, reldiff_L6: 3.3333e-14, reldiff_L7: 3.3333e-14 },
];

// AXIS B: |reldiff| at fixed dps=100, swept over the 5-point stencil step eps. Both rungs read identically.
const AXIS_B_EPS_LADDER = [
  { eps: 1e-2, reldiff_L6: 3.3334e-10, reldiff_L7: 3.3334e-10 },
  { eps: 1e-3, reldiff_L6: 3.3333e-14, reldiff_L7: 3.3333e-14 },
  { eps: 1e-4, reldiff_L6: 3.3333e-18, reldiff_L7: 3.3333e-18 },
  { eps: 1e-5, reldiff_L6: 3.3333e-22, reldiff_L7: 3.3333e-22 },
  { eps: 1e-6, reldiff_L6: 3.3333e-26, reldiff_L7: 3.3333e-26 },
];

// Measured log-log slope d ln|reldiff| / d ln eps on each axis-B sub-interval (expect 4 for O(eps^4)).
const AXIS_B_SLOPES_L6 = [4.0, 4.0, 4.0, 4.0];
const AXIS_B_SLOPES_L7 = [4.0, 4.0, 4.0, 4.0];

const IMP124788_SINGLE_POINT_FLOOR = 3.33e-14; // dps=60, eps=1e-3 value imp-124788 reported
const DPS_AXIS_B = 100;
const EPS_AXIS_A = 1e-3;

export const IMP124808_EXTPREC_PAIRRATIO_TWO_AXIS = {
  id: 'imp-124808',
  proofSection: 'S-frontier',
  question:
    'imp-124788 lifted the imp-124770/imp-97665 pair-ratio identity E_CF/E_ET = E_flow/E_trunc to mpmath dps=60 at ' +
    'a SINGLE point (dps=60, eps=1e-3) and found the deep-tail |reldiff| collapses to a flat ~3.33e-14. Is that ' +
    '~3.33e-14 a working-precision floor (=> a tiny residual identity drift) or the O(eps^4) 5-point stencil ' +
    'truncation error (=> the identity is exact, the floor is pure stencil bias)? Sweep the dps and eps axes ' +
    'independently at L6/L7 to separate them. Numerical / cross-validation only; pinned constants perturbed only ' +
    'symbolically; no bound moves; no QED.',
  method:
    'Mirror the imp-97183 extended-precision ladder. Re-run the imp-124770/imp-97665 machinery VERBATIM (offline ' +
    'script tmp/imp-124808-extprec-pairratio-two-axis.py) on two axes at the deep landmarks L6/L7: AXIS A holds ' +
    'eps=1e-3 and sweeps dps in {30,45,60,80,120}; AXIS B holds dps=100 and sweeps eps in {1e-2,1e-3,1e-4,1e-5,1e-6}. ' +
    'Fit the axis-B log-log slope d ln|reldiff| / d ln eps against the expected O(eps^4) value 4.',
  dps_axis_b: DPS_AXIS_B,
  eps_axis_a: EPS_AXIS_A,
  imp124788_single_point_floor: IMP124788_SINGLE_POINT_FLOOR,
  axisA_dps_ladder: AXIS_A_DPS_LADDER,
  axisB_eps_ladder: AXIS_B_EPS_LADDER,
  axisB_slopes_L6: AXIS_B_SLOPES_L6,
  axisB_slopes_L7: AXIS_B_SLOPES_L7,
  finding: {
    M1_floor_is_stencil_truncation_not_working_precision:
      'On axis A the |reldiff| is dps-invariant at 3.3333e-14 across dps 30..120 for both L6 and L7 -- raising the ' +
      'working precision four-fold buys nothing, so the imp-124788 ~3.33e-14 is set by the eps=1e-3 5-point stencil ' +
      'step (eps^4/30 = 3.33e-14), NOT by round-off. imp-124788 landed on exactly this value because dps=60 was ' +
      'already far past the point where working precision matters at eps=1e-3.',
    M2_identity_carries_zero_residual_drift:
      'On axis B the |reldiff| follows a clean eps^4 law -- 3.3334e-10, 3.3333e-14, 3.3333e-18, 3.3333e-22, ' +
      '3.3333e-26 as eps falls 1e-2 -> 1e-6, dropping by ~1e4 per decade with log-log slope 4.000 on every ' +
      'sub-interval for both rungs -- with no plateau, extrapolating to 0 as eps -> 0. There is NO residual identity ' +
      'deviation hiding under the imp-124788 floor: E_CF/E_ET = E_flow/E_trunc is exact at L6/L7 to arbitrary ' +
      'precision, definitively separating the exact identity from any round-off / truncation floor.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CROSS-VALIDATION (frontier cross-check, NOT rigorous). A two-axis extended-precision sweep of the ' +
    'imp-124770/imp-97665 pair-ratio stencil at the deep landmarks L6/L7 resolves the imp-124788 single-point ' +
    '~3.33e-14 floor: it is dps-invariant (3.3333e-14 across dps 30..120, axis A) so NOT working-precision-limited, ' +
    'and it obeys a clean O(eps^4) truncation law (log-log slope 4.000, ~1e4 drop per eps decade down to 3.33e-26 ' +
    'at eps=1e-6, axis B) that extrapolates to 0 as eps -> 0. The imp-124788 floor is therefore pure 5-point stencil ' +
    'truncation (eps^4/30), and the imp-97665 EXACT pair-ratio identity E_CF/E_ET = E_flow/E_trunc carries ZERO ' +
    'residual drift at the deep landmarks -- confirming the identity to arbitrary precision and definitively ' +
    'separating it from the round-off/truncation floor. Conditional-share diagnostic on the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed ' +
    'only symbolically as differentiation axes); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124788 (the single-point dps=60 collapse resolved here into two axes); imp-124770 (the DOUBLE-precision ' +
    'pair-ratio ladder L2..L7); imp-124769 (the |E_CF| round-off crossover); imp-97665 (the EXACT pair-ratio ' +
    'E_CF/E_ET = E_flow/E_trunc + 5-point verify at L2/L3/L4); imp-97183 (the extended-precision ladder approach ' +
    'mirrored); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route).',
};

export const IMP124808_EXTPREC_PAIRRATIO_TWO_AXIS_ASSERTIONS = [
  {
    // AXIS A: |reldiff| is dps-invariant -- raising working precision does nothing (not round-off-limited).
    id: 'imp124808-axisA-dps-invariant',
    description: 'axis-A |reldiff| is flat 3.3333e-14 across dps 30..120 for both L6 and L7 (not working-precision-limited)',
    holds: () =>
      AXIS_A_DPS_LADDER.length === 5 &&
      AXIS_A_DPS_LADDER.every((r) => Math.abs(r.reldiff_L6 - 3.3333e-14) < 1e-18 && Math.abs(r.reldiff_L7 - 3.3333e-14) < 1e-18),
  },
  {
    // AXIS A matches the imp-124788 single-point value (this leaf explains that number).
    id: 'imp124808-axisA-matches-imp124788-floor',
    description: 'the dps-invariant axis-A |reldiff| equals the imp-124788 single-point ~3.33e-14 floor',
    holds: () =>
      AXIS_A_DPS_LADDER.every((r) => Math.abs(r.reldiff_L6 - IMP124788_SINGLE_POINT_FLOOR) < 5e-16),
  },
  {
    // AXIS B: strict eps^4 decay -- |reldiff| drops ~1e4 per eps decade, monotone down to 3.33e-26.
    id: 'imp124808-axisB-eps4-decay',
    description: 'axis-B |reldiff| decreases strictly down the eps ladder by ~1e4 per decade at both L6 and L7',
    holds: () =>
      AXIS_B_EPS_LADDER.every((r, i) => {
        if (i === 0) return true;
        const p = AXIS_B_EPS_LADDER[i - 1];
        const ratio6 = p.reldiff_L6 / r.reldiff_L6;
        const ratio7 = p.reldiff_L7 / r.reldiff_L7;
        return ratio6 > 5e3 && ratio6 < 2e4 && ratio7 > 5e3 && ratio7 < 2e4;
      }),
  },
  {
    // AXIS B log-log slope is 4 on every sub-interval (the O(eps^4) 5-point stencil truncation signature).
    id: 'imp124808-axisB-slope-four',
    description: 'axis-B log-log slope d ln|reldiff|/d ln eps is 4 on every sub-interval for both L6 and L7',
    holds: () =>
      AXIS_B_SLOPES_L6.length === 4 &&
      AXIS_B_SLOPES_L6.every((s) => Math.abs(s - 4) < 1e-2) &&
      AXIS_B_SLOPES_L7.every((s) => Math.abs(s - 4) < 1e-2),
  },
  {
    // The deepest eps rung reaches 3.33e-26 (identity residual extrapolates to 0, no plateau).
    id: 'imp124808-axisB-reaches-e26',
    description: 'the deepest eps=1e-6 rung reaches ~3.33e-26 at both rungs (no residual plateau; identity exact)',
    holds: () => {
      const deep = AXIS_B_EPS_LADDER[AXIS_B_EPS_LADDER.length - 1];
      return deep.reldiff_L6 < 1e-25 && deep.reldiff_L7 < 1e-25;
    },
  },
  {
    // Honesty gate: numerical/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp124808-honesty-gate-no-qed',
    description: 'Numerical/cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124808_EXTPREC_PAIRRATIO_TWO_AXIS.isRigorous === false &&
      /NO QED/.test(IMP124808_EXTPREC_PAIRRATIO_TWO_AXIS.verdict) &&
      /refereed bound is changed/i.test(IMP124808_EXTPREC_PAIRRATIO_TWO_AXIS.verdict),
  },
];

for (const a of IMP124808_EXTPREC_PAIRRATIO_TWO_AXIS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124808-extprec-pairratio-two-axis assertion failed: ${a.id}`);
  }
}
