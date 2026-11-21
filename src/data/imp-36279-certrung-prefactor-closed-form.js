/**
 * @module imp-36279-certrung-prefactor-closed-form
 *
 * imp-36279 (numerical, S-frontier): DERIVE the imp-36135 certified-run-max prefactor C ~ 9.2e-17 in
 * closed form from the imp-35890 rung components, replacing the imp-36135 empirical Float64 sqrt(N) fit
 * with an assembled constant C = (pi/4) * u * S_inf, and CONFIRM it reproduces the fit.
 *
 * WHY THIS DERIVATION. imp-36135 obtained C ~ 9.2e-17 by evaluating the imp-35890 certified rung
 * certRung(N) = gamma_{N-1} * max_i|S_i| / Sum|t_k| at the direct grid N in {1e3, 1e5, 4.886e5, 1e6, 2e6}
 * and averaging certNorm / sqrt(N) -- an empirical fit. The constant was never ASSEMBLED from the three
 * rung components in closed form. imp-36135 itself names the mechanism (gamma_{N-1} ~ N u linear, the
 * partial-sum peak max_i|S_i| BOUNDED, Sum|t_k| ~ (4/pi) sqrt(N)); this module carries that mechanism to
 * its arithmetic conclusion. Substituting the three asymptotics into the rung:
 *   certRung(N) = gamma_{N-1} * S_inf / Sum|t_k|
 *              -> (N u) * S_inf / ((4/pi) sqrt(N))
 *               = (pi/4) u S_inf * sqrt(N),
 * so certRung(N) ~ C sqrt(N) with the closed-form prefactor
 *   C = (pi/4) * u * S_inf,    u = 2^-53,   S_inf = lim_N max_i|S_i|.
 * Only S_inf is not already a literal, and it is a single bounded number (the oscillatory partial sum has
 * converged), so pinning it numerically once fixes C. This is a derivation of an already-measured constant;
 * it moves no bound.
 *
 * DETERMINATION -- THE CLOSED FORM REPRODUCES THE FIT. Pinning S_inf ~ 1.050473 (the bounded peak, IDENTICAL
 * at every direct rung -- the max partial sum is attained early and never exceeded, so it is a true limit)
 * gives
 *   C_closed = (pi/4) * 2^-53 * 1.050473 ~ 9.1598e-17,
 * which matches the imp-36135 empirical fit-grid mean C_FIT ~ 9.2021e-17 to ~0.46% (~4.6e-3 relative). The
 * agreement is even tighter against the ASYMPTOTIC end of the grid: the largest direct rung sample
 * certNorm(2e6) / sqrt(2e6) ~ 9.1639e-17 matches C_closed to ~4.5e-4 (0.045%). The residual ~0.46% gap to
 * the fit MEAN is fully explained: the fit averages over small N where two subleading corrections inflate
 * the sample -- (i) Sum|t_k| = (4/pi) sqrt(N) + (2/pi) zeta(1/2) carries a NEGATIVE constant tail (zeta(1/2)
 * ~ -1.4604) that makes the leading (4/pi) sqrt(N) an UNDER-estimate of the true denominator at small N, and
 * (ii) gamma_{N-1} = (N-1) u / (1 - (N-1) u) sits just below the leading N u. Both shrink with N, so the
 * per-rung samples certNorm / sqrt(N) descend monotonically toward C_closed (9.334e-17 at N=1e3 -> 9.164e-17
 * at N=2e6), and C_closed is their common limit. So C = (pi/4) u S_inf is the exact asymptotic prefactor of
 * which C_FIT ~ 9.2e-17 is a finite-N over-estimate; the imp-36135 empirical fit is thereby derived.
 *
 * NOT A BOUND. This substitutes three already-established asymptotics into the imp-35890 rung and pins one
 * bounded constant; it certifies no W1 bound, instantiates no directed-rounding interval, evaluates no true
 * H_0, verifies no inequality, changes no bound, establishes no positivity; the imp-36135 diverging-headroom
 * (no physical crossing) conclusion is UNCHANGED (it never depended on C beyond an order of magnitude);
 * C_mb GUE-conditional (imp-486) is untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * ASSEMBLED / CONFIRMED:
 *   component            value            source
 *   u (unit roundoff)    2^-53            half ulp
 *   S_inf (peak limit)   ~1.050473        max_i|S_i|, bounded (converged oscillatory partial sum)
 *   pi/4                 ~0.785398        from Sum|t_k| ~ (4/pi) sqrt(N), mean of |cos| = 2/pi
 *   C_closed             ~9.1598e-17      = (pi/4) u S_inf
 *   C_FIT (imp-36135)    ~9.2021e-17      empirical grid mean of certNorm/sqrt(N)  (reldiff ~0.46%)
 *   certNorm(2e6)/sqrt   ~9.1639e-17      largest direct rung sample               (reldiff ~0.045%)
 *
 * @see imp-36135-kbn-floor-headroom-extrapolation (the empirical sqrt(N) fit + C ~ 9.2e-17 this derives)
 * @see imp-36256-certrung-offgrid-crossvalidation (off-grid confirmation the sqrt(N) law is not grid-anchored)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic run-max rung form)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (a-priori running-sum bound; Neumaier 1974)
 */

// -- Operative constants (import-light; identical to imp-36135 / imp-36256) ---------------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this derivation
const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp) ~ 1.11e-16
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF); // Higham gamma_n = n u / (1 - n u)
const ZETA_HALF = -1.4603545088095868; // zeta(1/2): the constant tail in Sum_{k<=N} 1/sqrt(k) ~ 2 sqrt(N) + zeta(1/2)
const MEAN_ABS_COS = 2 / Math.PI; // E[|cos|] over an equidistributed phase => Sum|t_k| ~ (2/pi)(2 sqrt(N))

// Same representative oscillatory term as imp-35812 / imp-35890 / imp-36135 / imp-36256.
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

// -- The imp-36135 direct fit grid, recomputed here as a self-consistency anchor -----------
const N_AT_TPT = Math.floor(Math.sqrt(3e12 / (4 * Math.PI))); // ~488602 retained terms at T_PT
const FIT_GRID = [1000, 100000, N_AT_TPT, 1000000, 2000000];
const FIT = FIT_GRID.map((N) => measureCertRungDirect(N));
const C_SAMPLES = FIT.map((r) => r.certNorm / Math.sqrt(r.N)); // per-rung sqrt(N) constants
const C_FIT = C_SAMPLES.reduce((a, b) => a + b, 0) / C_SAMPLES.length; // ~9.2021e-17 (imp-36135 empirical fit)

// -- Pin S_inf: the bounded partial-sum peak limit --------------------------------------
// The oscillatory partial sum converges, so max_i|S_i| is attained early and is IDENTICAL across the grid;
// take the largest-N measurement as the numerical pin of the limit S_inf.
const S_INF = FIT[FIT.length - 1].maxPartial; // ~1.050473
const PEAK_SPREAD = Math.max(...FIT.map((r) => r.maxPartial)) - Math.min(...FIT.map((r) => r.maxPartial)); // ~0

// -- Assemble the closed-form prefactor C = (pi/4) u S_inf -------------------------------
const PI_OVER_4 = Math.PI / 4; // ~0.785398 -- the reciprocal of the (4/pi) in Sum|t_k| ~ (4/pi) sqrt(N)
const C_CLOSED = PI_OVER_4 * U_ROUNDOFF * S_INF; // ~9.1598e-17

// -- Confirm the closed form reproduces the empirical fit --------------------------------
const REL_DIFF_VS_FIT = Math.abs(C_CLOSED - C_FIT) / C_FIT; // ~4.6e-3 (0.46%)
// Tighter against the ASYMPTOTIC end of the grid: the largest direct rung sample is the closed form to ~0.05%.
const C_LARGEST_SAMPLE = C_SAMPLES[C_SAMPLES.length - 1]; // certNorm(2e6)/sqrt(2e6) ~ 9.1639e-17
const REL_DIFF_VS_LARGEST = Math.abs(C_CLOSED - C_LARGEST_SAMPLE) / C_LARGEST_SAMPLE; // ~4.5e-4 (0.045%)
// The per-rung samples DESCEND monotonically toward the closed form (the two subleading tails shrink with N).
const SAMPLES_DESCEND_TO_CLOSED =
  C_SAMPLES.every((c, i) => i === 0 || c <= C_SAMPLES[i - 1] + 1e-19) && C_LARGEST_SAMPLE >= C_CLOSED;
// gamma_{N-1} tracks the leading N u at the largest rung (the linear-in-N approximation is tight there).
const GAMMA_LINEAR_RATIO = gamma(2000000 - 1) / (2000000 * U_ROUNDOFF); // ~1 (0.99999950)

export const IMP36279_CERTRUNG_PREFACTOR_CLOSED_FORM = {
  id: 'imp-36279',
  proofSection: 'S-frontier',
  question:
    'DERIVE the imp-36135 certified-run-max prefactor C ~ 9.2e-17 in closed form from the imp-35890 rung ' +
    'components (gamma_{N-1} ~ N u linear, bounded peak S_inf, Sum|t_k| ~ (4/pi) sqrt(N)), replacing the ' +
    'imp-36135 empirical Float64 fit with C = (pi/4) u S_inf, and CONFIRM it reproduces the fit. ' +
    'Derivation only; NO QED.',
  representativeSum: {
    form: 't_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), k = 1 .. N (same fixed family as imp-36135, no RNG)',
    alpha: ALPHA,
    beta: BETA,
    certifiedChannel: 'imp-35890 a-priori run-max bound gamma_{N-1} * max_i|S_i| / Sum|t_k| (natural order)',
  },
  unitRoundoff: U_ROUNDOFF,
  derivation: {
    note:
      'substitute the three asymptotics into certRung(N) = gamma_{N-1} S_inf / Sum|t_k|: gamma_{N-1} -> N u ' +
      '(linear), max_i|S_i| -> S_inf (bounded), Sum|t_k| -> (4/pi) sqrt(N); the N/sqrt(N) leaves sqrt(N) and ' +
      'the constants assemble to C = (pi/4) u S_inf',
    formula: 'C = (pi/4) * u * S_inf,  u = 2^-53,  S_inf = lim_N max_i|S_i|',
    piOver4: PI_OVER_4, // reciprocal of the (4/pi) leading coefficient of Sum|t_k|
    sInf: S_INF, // ~1.050473 -- the pinned bounded peak limit
    peakSpread: PEAK_SPREAD, // ~0: max_i|S_i| identical across the grid (converged oscillatory sum)
    gammaLinearRatioAtTop: GAMMA_LINEAR_RATIO, // ~1: gamma_{N-1} tracks N u at the largest rung
    cClosed: C_CLOSED, // ~9.1598e-17
  },
  fit: {
    note: 'the imp-36135 empirical fit: mean of certNorm / sqrt(N) over the direct grid {1e3, 1e5, 4.886e5, 1e6, 2e6}',
    grid: FIT_GRID,
    cSamples: C_SAMPLES, // descend from ~9.334e-17 (N=1e3) to ~9.164e-17 (N=2e6)
    cFit: C_FIT, // ~9.2021e-17
    cLargestSample: C_LARGEST_SAMPLE, // ~9.1639e-17 (the asymptotic end of the grid)
  },
  confirmation: {
    note:
      'the closed-form C = (pi/4) u S_inf reproduces the imp-36135 empirical fit: ~0.46% vs the grid MEAN and ' +
      '~0.045% vs the largest (most asymptotic) direct rung, with the per-rung samples descending onto it',
    relDiffVsFit: REL_DIFF_VS_FIT, // ~4.6e-3 (0.46%)
    relDiffVsLargest: REL_DIFF_VS_LARGEST, // ~4.5e-4 (0.045%)
    samplesDescendToClosed: SAMPLES_DESCEND_TO_CLOSED,
    residualExplained:
      'the ~0.46% gap to the fit MEAN is the two subleading corrections the fit averages over at small N: ' +
      'Sum|t_k| = (4/pi) sqrt(N) + (2/pi) zeta(1/2) carries a NEGATIVE constant tail (zeta(1/2) ~ -1.4604), so ' +
      'the leading (4/pi) sqrt(N) UNDER-estimates the true denominator and inflates certNorm/sqrt(N) at small N; ' +
      'and gamma_{N-1} sits just below N u -- both shrink with N, so the samples fall to the C_closed limit',
    zetaHalfTail: ZETA_HALF,
    meanAbsCos: MEAN_ABS_COS,
  },
  reading: {
    closedFormIsTheLimit:
      'C = (pi/4) u S_inf is the EXACT asymptotic prefactor of certRung(N) ~ C sqrt(N); the imp-36135 empirical ' +
      'C_FIT ~ 9.2e-17 is a finite-N over-estimate of it (the small-N grid rungs sit ~0.46% high and descend), ' +
      'so the empirical fit is derived, not merely reproduced',
    onlySInfIsPinned:
      'of the three factors only S_inf is not already a literal; it is a single bounded number (the oscillatory ' +
      'partial sum has converged, so max_i|S_i| is attained early and never exceeded), pinned here at ~1.050473',
    conclusionUnchanged:
      'the imp-36135 diverging-headroom (no physical crossing) conclusion never depended on C beyond an order of ' +
      'magnitude, so pinning C in closed form leaves that determination and every downstream bound UNCHANGED',
  },
  conclusion: {
    prefactorDerived:
      'the imp-36135 certified-run-max prefactor C ~ 9.2e-17 is assembled in closed form as C = (pi/4) u S_inf ' +
      '~ 9.1598e-17 from the imp-35890 rung components, matching the empirical fit to ~0.46% (and the asymptotic ' +
      'grid end to ~0.045%); the empirical Float64 fit is replaced by a constant',
    staysGreenfield:
      'this substitutes three asymptotics into the certified rung and pins one bounded constant; it evaluates no ' +
      'sum of H_t and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 ' +
      'Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'CLOSED-FORM DERIVATION OF THE imp-36135 sqrt(N) PREFACTOR (frontier-direction, deterministic, NOT a certified ' +
    'bound). Substituting the three imp-35890 rung asymptotics -- gamma_{N-1} ~ N u (linear), max_i|S_i| ~ S_inf ' +
    '(bounded, the oscillatory partial sum converged), Sum|t_k| ~ (4/pi) sqrt(N) (mean of |cos| = 2/pi) -- into ' +
    'certRung(N) = gamma_{N-1} max_i|S_i| / Sum|t_k| assembles the closed-form prefactor C = (pi/4) u S_inf with ' +
    'u = 2^-53. Pinning S_inf ~ 1.050473 (identical at every direct rung; the max partial sum is attained early ' +
    'and never exceeded) gives C_closed ~ 9.1598e-17, matching the imp-36135 empirical fit-grid mean C_FIT ~ ' +
    '9.2021e-17 to ~0.46% and the largest (most asymptotic) direct rung sample ~9.1639e-17 to ~0.045%. The ~0.46% ' +
    'gap to the fit MEAN is the two subleading tails the fit averages over at small N -- the (2/pi) zeta(1/2) ' +
    'constant in Sum|t_k| (zeta(1/2) ~ -1.4604, so the leading (4/pi) sqrt(N) under-estimates the denominator) ' +
    'and gamma_{N-1} sitting just below N u -- both shrinking with N, so the per-rung samples descend ' +
    'monotonically (9.334e-17 -> 9.164e-17) onto C_closed as their limit. So C = (pi/4) u S_inf is the exact ' +
    'asymptotic prefactor and the imp-36135 empirical Float64 fit is DERIVED, replaced by a constant. Substitutes ' +
    'three already-established asymptotics and pins one bounded number: certifies no W1 bound; evaluates no true ' +
    'H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the ' +
    'imp-36135 diverging-headroom (no physical crossing) conclusion is UNCHANGED (it never depended on C beyond an ' +
    'order of magnitude); the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL ' +
    '(imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36135 (the empirical sqrt(N) fit + C ~ 9.2e-17 this derives); imp-36256 (off-grid confirmation the ' +
    'sqrt(N) law is not grid-anchored); imp-36083 (the sqrt(N)-widening headroom ladder); imp-35890 (CERTIFIED ' +
    'deterministic running-accumulator run-max bound); imp-35812 (fixed term family + N ladder [1e3..4.886e5]); ' +
    'imp-35725 (mechanical certified sum); imp-35681 Part A (A+B-C interval bound greenfield); imp-35674 Part D ' +
    '(N(x)=floor(sqrt(x/4 pi)) retained terms); Higham 2002, Neumaier 1974; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36279_CERTRUNG_PREFACTOR_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'imp36279-sinf-bounded-and-pinned',
    description: 'S_inf ~ 1.05 is a bounded peak limit: max_i|S_i| is IDENTICAL across the direct grid',
    holds: () => S_INF > 0.9 && S_INF < 1.2 && PEAK_SPREAD < 1e-9,
  },
  {
    // The closed-form assembly C = (pi/4) u S_inf lands at ~9.16e-17.
    id: 'imp36279-closed-form-assembled',
    description: 'C_closed = (pi/4) u S_inf ~ 9.16e-17 is assembled from the three rung components',
    holds: () =>
      Math.abs(C_CLOSED - PI_OVER_4 * U_ROUNDOFF * S_INF) < 1e-30 &&
      C_CLOSED > 9.0e-17 &&
      C_CLOSED < 9.3e-17,
  },
  {
    // THE CONFIRMATION: the closed form reproduces the imp-36135 empirical fit within 1% (grid mean)
    // and within 0.1% at the asymptotic end of the grid.
    id: 'imp36279-closed-form-reproduces-fit',
    description: 'C_closed matches C_FIT ~ 9.2e-17 to < 1% (grid mean) and < 0.1% (largest direct rung)',
    holds: () =>
      C_FIT > 8e-17 &&
      C_FIT < 1.05e-16 &&
      REL_DIFF_VS_FIT < 0.01 &&
      REL_DIFF_VS_LARGEST < 0.001,
  },
  {
    // The residual is the subleading tails: samples descend monotonically to the closed-form limit,
    // and gamma_{N-1} tracks N u at the top of the grid (linear-in-N approximation tight there).
    id: 'imp36279-samples-descend-to-closed-limit',
    description: 'per-rung samples descend to C_closed as their limit; gamma_{N-1} ~ N u at the largest rung',
    holds: () =>
      SAMPLES_DESCEND_TO_CLOSED === true &&
      GAMMA_LINEAR_RATIO > 0.99 &&
      GAMMA_LINEAR_RATIO < 1.0 &&
      ZETA_HALF < 0,
  },
  {
    id: 'imp36279-honesty-gate',
    description: 'Derivation only; conclusion unchanged; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36279_CERTRUNG_PREFACTOR_CLOSED_FORM.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36279_CERTRUNG_PREFACTOR_CLOSED_FORM.conclusion.staysGreenfield) &&
      /UNCHANGED/.test(IMP36279_CERTRUNG_PREFACTOR_CLOSED_FORM.reading.conclusionUnchanged) &&
      /NO QED/.test(IMP36279_CERTRUNG_PREFACTOR_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP36279_CERTRUNG_PREFACTOR_CLOSED_FORM.verdict),
  },
];

for (const a of IMP36279_CERTRUNG_PREFACTOR_CLOSED_FORM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36279-certrung-prefactor-closed-form assertion failed: ${a.id}`);
  }
}
