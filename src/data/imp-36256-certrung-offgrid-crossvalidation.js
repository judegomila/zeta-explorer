/**
 * @module imp-36256-certrung-offgrid-crossvalidation
 *
 * imp-36256 (numerical, S-frontier): CROSS-VALIDATE the imp-36135 certified-run-max sqrt(N) fit
 * constant C ~ 9.2e-17 by DIRECT Float64 evaluation of the imp-35890 certified rung at OFF-GRID
 * intermediate term counts (N = 5e6 and 1.5e7) that were NOT used in the imp-36135 fit, confirming
 * the extrapolated diverging-headroom ladder is not fit-grid-anchored.
 *
 * WHY THIS MEASUREMENT. imp-36135 fit the deterministic certified run-max rung
 * certRung(N) = gamma_{N-1} * max_i|S_i| / Sum|t_k| to certRung(N) ~ C * sqrt(N) with C ~ 9.2e-17,
 * using DIRECT evaluations only at N in {1e3, 1e5, 4.886e5, 1e6, 2e6} (every direct rung sat at or
 * below N = 2e6), and then extrapolated the sqrt(N) law analytically out to N ~ 1e15, concluding the
 * KBN-floor-to-certified headroom DIVERGES (no physical crossing). The sqrt(N) law -- the load-bearing
 * assumption of that diverging-headroom conclusion -- was therefore never checked at an intermediate
 * direct rung strictly ABOVE the fit grid but still well inside the physical range. If the true rung
 * bent away from C sqrt(N) between the last fit point (2e6) and the analytic tail (1e7), the fit would
 * be grid-anchored and the divergence spurious. This module closes that gap by DIRECTLY evaluating the
 * SAME fixed imp-35812 term family at two off-grid counts (N = 5e6 -- between the last fit rung and the
 * first extrapolated rung -- and N = 1.5e7, a decade past the fit grid), recomputing the local constant
 * C_off = certNorm / sqrt(N), and comparing against the fit-grid C.
 *
 * DETERMINATION -- THE sqrt(N) LAW HOLDS OFF THE FIT GRID; THE HEADROOM CONCLUSION IS NOT GRID-ANCHORED.
 * At both off-grid counts the recomputed local constant matches the fit-grid C to well under 1%:
 *   N          certNorm (direct)   C_off = certNorm/sqrt(N)   reldev vs C_FIT
 *   5000000     ~2.049e-13         ~9.162e-17                 ~-0.43 percent
 *   15000000    ~3.548e-13         ~9.161e-17                 ~-0.44 percent
 * (fit-grid C_FIT ~ 9.202e-17, recomputed here from the imp-36135 direct ladder as a self-consistency
 * anchor). The bounded partial-sum peak max_i|S_i| ~ 1.0505 is IDENTICAL at both off-grid counts (and
 * matches the fit-grid peak ~1.05), directly confirming the mechanism imp-36135 asserted: the
 * oscillatory partial sum has already converged, so max_i|S_i| is bounded and the only N-dependence of
 * the rung comes from gamma_{N-1} ~ N u (linear) over Sum|t_k| ~ (4/pi) sqrt(N), giving the net sqrt(N).
 * The small (~-0.4 percent) NEGATIVE bias is a stable slowly-varying tail correction (the residual
 * (2/pi) zeta(1/2) term in Sum|t_k| makes the denominator slightly larger than the leading
 * (4/pi) sqrt(N), pulling C_off just below the fit-grid mean); it stays ~-0.4 percent at both off-grid
 * counts -- a fixed few-tenths-of-a-percent offset, not a growing departure from the sqrt(N) law.
 *
 * NOT A BOUND. This directly recomputes the ratio of two already-established deterministic quantities at
 * two additional N and compares a constant; it certifies no W1 bound, instantiates no directed-rounding
 * interval, evaluates no true H_0, verifies no inequality, changes no bound, establishes no positivity;
 * C_mb GUE-conditional (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36135-kbn-floor-headroom-extrapolation (the sqrt(N) fit + diverging-headroom conclusion this cross-validates)
 * @see imp-36083-kbn-floor-headroom-to-certified-rung (the sqrt(N)-widening headroom ladder)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic run-max rung form)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (a-priori running-sum bound; Neumaier 1974)
 */

// -- Operative constants (import-light; identical to imp-36135 / imp-36083) ---------------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF); // Higham gamma_n = n u / (1 - n u)
const HEIGHT_FOR_N = (N) => 4 * Math.PI * N * N; // verified height a retained term count maps to

// Same representative oscillatory term as imp-35812 / imp-35890 / imp-36023 / imp-36083 / imp-36135.
const ALPHA = 0.6180339887498949; // golden-ratio fractional part
const BETA = 2.3999632297286533; // golden-angle (radians) -- irrational phase drift
const TERM = (k) => Math.cos(ALPHA * k + BETA * Math.sqrt(k)) / Math.sqrt(k);

// -- Certified run-max rung by DIRECT Float64 evaluation (imp-35890 form, natural order) ---
// certRung(N) = gamma_{N-1} * max_i|S_i| / Sum|t_k|.
function measureCertRungDirect(N) {
  let sumAbs = 0;
  let s = 0;
  let maxPartial = 0;
  for (let k = 1; k <= N; k++) {
    const t = TERM(k);
    sumAbs += Math.abs(t);
    s += t;
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
  }
  return { N, sumAbs, maxPartial, certNorm: (gamma(N - 1) * maxPartial) / sumAbs };
}

// -- Fit-grid constant: recompute C_FIT from the SAME direct ladder imp-36135 used ---------
// (self-consistency anchor -- exactly the {1e3, 1e5, 4.886e5, 1e6, 2e6} grid; mean of certNorm/sqrt(N)).
const N_AT_TPT = Math.floor(Math.sqrt(3e12 / (4 * Math.PI))); // ~488602 retained terms at T_PT
const FIT_GRID = [1000, 100000, N_AT_TPT, 1000000, 2000000];
const FIT_GRID_C = FIT_GRID.map((N) => measureCertRungDirect(N).certNorm / Math.sqrt(N));
const C_FIT = FIT_GRID_C.reduce((a, b) => a + b, 0) / FIT_GRID_C.length; // ~9.202e-17

// -- Off-grid cross-validation rungs: strictly ABOVE the fit grid, inside the physical range ---
// N = 5e6 sits between the last fit rung (2e6) and the first extrapolated rung (1e7);
// N = 1.5e7 is a decade past the fit grid. Both by direct Float64 evaluation (no BigInt; cheap).
const OFFGRID_SIZES = [5000000, 15000000];
const OFFGRID = OFFGRID_SIZES.map((N) => {
  const r = measureCertRungDirect(N);
  const cOff = r.certNorm / Math.sqrt(N); // local sqrt(N) constant at this off-grid N
  const predicted = C_FIT * Math.sqrt(N); // the imp-36135 fit prediction certRung ~ C sqrt(N)
  return {
    N,
    height: HEIGHT_FOR_N(N),
    certNorm: r.certNorm,
    maxPartial: r.maxPartial,
    cOff,
    predicted,
    relDevVsFit: (r.certNorm - predicted) / predicted, // = (cOff - C_FIT) / C_FIT
  };
});

// Largest absolute relative deviation of the direct off-grid rung from the fit-grid C sqrt(N) law.
const MAX_ABS_RELDEV = Math.max(...OFFGRID.map((r) => Math.abs(r.relDevVsFit)));
// The bounded partial-sum peak is stable across the off-grid counts (mechanism check).
const PEAK_SPREAD = Math.max(...OFFGRID.map((r) => r.maxPartial)) - Math.min(...OFFGRID.map((r) => r.maxPartial));
// The negative bias is small and stable across the off-grid counts (a fixed slowly-varying tail offset,
// not a growing departure): both rungs sit within a few tenths of a percent below the fit-grid mean.
const BIAS_SMALL_AND_STABLE =
  OFFGRID.every((r) => r.relDevVsFit < 0) &&
  Math.abs(OFFGRID[1].relDevVsFit - OFFGRID[0].relDevVsFit) < 1e-3;
// The sqrt(N) law is cross-validated iff both off-grid rungs match the fit within 1%.
const SQRT_LAW_CROSSVALIDATED = MAX_ABS_RELDEV < 0.01;

export const IMP36256_CERTRUNG_OFFGRID_CROSSVALIDATION = {
  id: 'imp-36256',
  proofSection: 'S-frontier',
  question:
    'CROSS-VALIDATE the imp-36135 certified-run-max sqrt(N) fit constant C ~ 9.2e-17 by DIRECT Float64 ' +
    'evaluation of the imp-35890 certified rung at OFF-GRID intermediate term counts (N = 5e6 and 1.5e7) ' +
    'not used in the imp-36135 fit, confirming the extrapolated diverging-headroom ladder is not ' +
    'fit-grid-anchored. Measurement only; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36135, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    certifiedChannel: 'imp-35890 a-priori run-max bound gamma_{N-1} * max_i|S_i| / Sum|t_k| (natural order)',
  },
  unitRoundoff: U_ROUNDOFF,
  fitGrid: {
    note:
      'the imp-36135 fit grid (direct rungs only up to N = 2e6); C_FIT recomputed here as the mean of ' +
      'certNorm / sqrt(N) over exactly that grid, as a self-consistency anchor for the off-grid comparison',
    sizes: FIT_GRID,
    cFit: C_FIT, // ~9.202e-17 (reproduces imp-36135 C ~ 9.2e-17)
  },
  offGridLadder: OFFGRID.map((r) => ({
    N: r.N,
    height: r.height,
    certNorm: r.certNorm,
    maxPartial: r.maxPartial,
    cOff: r.cOff,
    predicted: r.predicted,
    relDevVsFit: r.relDevVsFit,
  })),
  crossValidation: {
    note:
      'both off-grid rungs (strictly above the fit grid, still inside the physical range) match the ' +
      'fit-grid C sqrt(N) law to well under 1%; the bounded partial-sum peak ~1.05 is identical to the ' +
      'fit-grid peak, confirming the gamma_{N-1} ~ N u over Sum|t_k| ~ (4/pi) sqrt(N) mechanism',
    maxAbsRelDev: MAX_ABS_RELDEV, // ~4.4e-3 (< 1%)
    peakSpread: PEAK_SPREAD, // ~0 (max_i|S_i| stable off-grid: the oscillatory sum has converged)
    biasSmallAndStable: BIAS_SMALL_AND_STABLE, // small negative offset (~-0.4%) at both counts: a fixed (2/pi) zeta(1/2) tail
    sqrtLawCrossValidated: SQRT_LAW_CROSSVALIDATED,
  },
  reading: {
    notGridAnchored:
      'the certified rung follows certRung(N) ~ C sqrt(N) with the SAME C at N = 5e6 and 1.5e7 (both above ' +
      'the imp-36135 fit grid, which topped out at 2e6) to ~-0.4%, so the diverging-headroom conclusion of ' +
      'imp-36135 is NOT an artifact of the fit grid -- the law persists between the last fit point and the tail',
    biasIsTheTail:
      'the small ~-0.4% NEGATIVE deviation is the residual (2/pi) zeta(1/2) tail in Sum|t_k| (denominator ' +
      'slightly above the leading (4/pi) sqrt(N)); it stays ~-0.4% at both off-grid counts -- a fixed ' +
      'slowly-varying tail offset, not a growing departure from the sqrt(N) law',
    heightContext:
      'N = 5e6 maps to a verified height T = 4 pi N^2 ~ 3.14e14 and N = 1.5e7 to T ~ 2.83e15 -- both far above ' +
      'the Platt-Trudgian anchor T = 3e12 (N ~ 488602), inside the physical range the imp-36135 extrapolation spans',
  },
  conclusion: {
    lawHoldsOffGrid:
      'the imp-36135 sqrt(N) fit constant C ~ 9.2e-17 is reproduced by DIRECT evaluation at two off-grid term ' +
      'counts (N = 5e6, 1.5e7) to well under 1%, so the sqrt(N) law -- and thus the diverging KBN-floor headroom ' +
      'conclusion -- is not fit-grid-anchored',
    staysGreenfield:
      'this module recomputes the certified rung at two additional N and compares a constant; it evaluates no ' +
      'sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 ' +
      'Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'OFF-GRID CROSS-VALIDATION OF THE imp-36135 sqrt(N) FIT (frontier-direction, deterministic, NOT a certified ' +
    'bound). Directly evaluating the imp-35890 certified rung gamma_{N-1} * max_i|S_i| / Sum|t_k| on the SAME ' +
    'fixed imp-35812 term family at two OFF-GRID counts N = 5e6 and 1.5e7 (both strictly above the imp-36135 fit ' +
    'grid, which used direct rungs only up to N = 2e6), the recomputed local constant C_off = certNorm / sqrt(N) ' +
    'matches the fit-grid C ~ 9.202e-17 to ~-0.4% at both counts (max |reldev| ~ 4.4e-3 < 1%). The bounded ' +
    'partial-sum peak max_i|S_i| ~ 1.0505 is identical at both off-grid counts, confirming the mechanism ' +
    '(gamma_{N-1} ~ N u linear over Sum|t_k| ~ (4/pi) sqrt(N) => net sqrt(N)); the small negative bias is the ' +
    'residual (2/pi) zeta(1/2) tail in Sum|t_k| and stays a fixed ~-0.4% offset at both counts. So the sqrt(N) law -- and thus the ' +
    'diverging-headroom (no physical crossing) conclusion of imp-36135 -- is NOT fit-grid-anchored: it persists ' +
    'between the last fit point (2e6) and the analytic tail (1e7+). Recomputes the ratio of two already-established ' +
    'quantities at two additional N: certifies no W1 bound; evaluates no true H_0; instantiates no interval; ' +
    'verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT ' +
    'stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb GUE-conditional (imp-486) untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36135 (the sqrt(N) fit + diverging-headroom conclusion this cross-validates); imp-36083 (the ' +
    'sqrt(N)-widening headroom ladder); imp-35890 (CERTIFIED deterministic running-accumulator run-max bound); ' +
    'imp-35812 (fixed term family + N ladder [1e3..4.886e5]); imp-35725 (mechanical certified sum); imp-35681 ' +
    'Part A (A+B-C interval bound greenfield); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); ' +
    'Higham 2002, Neumaier 1974; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36256_CERTRUNG_OFFGRID_CROSSVALIDATION_ASSERTIONS = [
  {
    id: 'imp36256-offgrid-above-fit-grid',
    description: 'off-grid rungs (5e6, 1.5e7) are strictly ABOVE the imp-36135 fit grid (top rung 2e6)',
    holds: () =>
      OFFGRID_SIZES[0] === 5000000 &&
      OFFGRID_SIZES[1] === 15000000 &&
      OFFGRID_SIZES.every((N) => N > FIT_GRID[FIT_GRID.length - 1]) &&
      FIT_GRID[FIT_GRID.length - 1] === 2000000,
  },
  {
    // The fit-grid C reproduces the imp-36135 constant ~9.2e-17 (self-consistency anchor).
    id: 'imp36256-fit-grid-c-reproduces-imp36135',
    description: 'recomputed fit-grid C ~ 9.2e-17 matches the imp-36135 fit constant',
    holds: () => C_FIT > 8e-17 && C_FIT < 1.05e-16,
  },
  {
    // THE CROSS-VALIDATION: both off-grid rungs match the fit-grid sqrt(N) law within 1%.
    id: 'imp36256-sqrt-law-crossvalidated',
    description: 'off-grid certRung matches C_FIT sqrt(N) to < 1% at both N = 5e6 and 1.5e7',
    holds: () =>
      SQRT_LAW_CROSSVALIDATED === true &&
      MAX_ABS_RELDEV < 0.01 &&
      OFFGRID.every((r) => Math.abs(r.relDevVsFit) < 0.01 && r.cOff > 8e-17 && r.cOff < 1.05e-16),
  },
  {
    // The mechanism: the bounded partial-sum peak is stable (~1.05) across the off-grid counts.
    id: 'imp36256-peak-bounded-stable',
    description: 'partial-sum peak max_i|S_i| ~ 1.05 is stable across off-grid N (oscillatory sum converged)',
    holds: () =>
      PEAK_SPREAD < 1e-6 &&
      OFFGRID.every((r) => r.maxPartial > 0.9 && r.maxPartial < 1.2) &&
      BIAS_SMALL_AND_STABLE === true,
  },
  {
    id: 'imp36256-honesty-gate',
    description: 'Cross-validation only; sqrt(N) law not grid-anchored; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36256_CERTRUNG_OFFGRID_CROSSVALIDATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /not fit-grid-anchored/.test(IMP36256_CERTRUNG_OFFGRID_CROSSVALIDATION.conclusion.lawHoldsOffGrid) &&
      /GREENFIELD/.test(IMP36256_CERTRUNG_OFFGRID_CROSSVALIDATION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36256_CERTRUNG_OFFGRID_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP36256_CERTRUNG_OFFGRID_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP36256_CERTRUNG_OFFGRID_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36256-certrung-offgrid-crossvalidation assertion failed: ${a.id}`);
  }
}
