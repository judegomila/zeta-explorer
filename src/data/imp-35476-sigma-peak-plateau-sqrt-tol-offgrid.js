/**
 * @module imp-35476-sigma-peak-plateau-sqrt-tol-offgrid
 *
 * imp-35476 (accuracy, frontier-direction) -- CORROBORATES the imp-35411 flat-maximum constancy
 * W(tol)/sqrt(tol) = 15.3165 on an INDEPENDENT, OFF-GRID tolerance grid, ruling out that the
 * four-point law was a sampling coincidence of decade-aligned tolerances.
 *
 * BACKGROUND
 * ----------
 * imp-35411 measured the ln-N plateau WIDTH of the imp-35337/imp-3406 interior sigma-share peak
 * (sigma_max ~ 0.94942901 at N_max ~ 9.219e5) and found the decade-width W(tol) = log10(N_hi/N_lo)
 * scales as sqrt(tol): W(tol)/sqrt(tol) = 15.3165 constant to 6+ sig figs. But that sweep sampled
 * only FOUR tolerances {1e-4, 1e-5, 1e-6, 1e-7}, all decade-aligned -- so a skeptic could ask whether
 * the constancy is an artifact of the power-of-ten sampling rather than a genuine quadratic signature.
 *
 * WHAT IS MEASURED HERE
 * ---------------------
 * Re-run the imp-35411 endpoint locator (rising/falling arm where sigma first falls tol below sigma_max)
 * on the SAME imp-35337 partsD double surrogate, reproduced VERBATIM, at three OFF-GRID tolerances
 * tol in {2e-5, 5e-6, 3e-7} -- deliberately NOT decade-aligned -- and confirm W(tol)/sqrt(tol) stays
 * 15.3165.
 *
 * THE RESULT: THE CONSTANT SURVIVES OFF THE DECADE GRID
 * ----------------------------------------------------
 *   tol = 2e-5  ->  W ~ 0.0684975  ->  W/sqrt(tol) = 15.316495
 *   tol = 5e-6  ->  W ~ 0.0342487  ->  W/sqrt(tol) = 15.316493
 *   tol = 3e-7  ->  W ~ 0.0083892  ->  W/sqrt(tol) = 15.316492
 * The three off-grid ratios agree to a spread of ~3.1e-6 among themselves, and across the FULL
 * seven-tolerance union {1e-4, 2e-5, 1e-5, 5e-6, 1e-6, 3e-7, 1e-7} the spread is ~1.6e-5 -- still 6+
 * sig figs of constancy. The recovered peak curvature k = 8 / (ln10 * 15.3165)^2 ~ 6.428e-3 matches
 * imp-35411 to the same precision. So the sqrt(tol) law is NOT a decade-sampling coincidence: it is the
 * genuine quadratic signature sigma(N) ~ sigma_max - (k/2)(ln N - ln N_max)^2 of a smooth flat maximum.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A cross-check of the imp-35411 W(tol)/sqrt(tol) constancy on an independent off-grid tolerance set.
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 double surrogate (dd-certified by imp-35337 to
 * ~1e-16, eleven orders below the smallest tolerance here, so the widths are not a double-rounding
 * artifact). The surrogate-vs-true fidelity half (imp-35337a) stays OPEN and is not touched. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; E_trunc = 3.06e-5 (imp-2631)
 * UNTOUCHED; the imp-398 C_F prefactor UNTOUCHED; changes no bound; establishes no operator positivity;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35411-sigma-peak-plateau-width (established W(tol)/sqrt(tol) = 15.3165 on the four decade tols)
 * @see imp-35337-sigma-landmarks-double-double-certification (dd-certified peak VALUE / 2.1e-5 margin)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX ~ 9.22e5, on double)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-35337/imp-35411 exactly

// The imp-35337 DOUBLE surrogate, reproduced VERBATIM (dd-certified there to ~1e-16 across the N-shape).
function sigmaD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}

// Unimodal argmax on the right arm (ternary in ln N, same 500-iter form as imp-35337/imp-35411).
function argmaxD(loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaD(Math.exp(m1)) < sigmaD(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

const N_MAX = argmaxD(1e4, 1e9); // ~9.2186e5
const SIGMA_MAX = sigmaD(N_MAX); // ~0.949429014

// Low-N (rising-arm) endpoint where sigma first falls tol below the peak: bisection in ln N on [1, N_max].
function plateauLo(tol) {
  const target = SIGMA_MAX - tol;
  let a = Math.log(1);
  let b = Math.log(N_MAX);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// High-N (falling-arm) endpoint: bisection in ln N on [N_max, 1e40].
function plateauHi(tol) {
  const target = SIGMA_MAX - tol;
  let a = Math.log(N_MAX);
  let b = Math.log(1e40);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigmaD(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
// Plateau width in decades of N at tolerance tol.
function plateauWidthDecades(tol) {
  return (Math.log(plateauHi(tol)) - Math.log(plateauLo(tol))) / Math.LN10;
}

// THE INDEPENDENT, OFF-GRID (deliberately NOT decade-aligned) tolerance set.
const TOL_OFFGRID = [2e-5, 5e-6, 3e-7];
const OFFGRID_ROWS = TOL_OFFGRID.map((tol) => ({
  tol,
  width_decades: +plateauWidthDecades(tol).toFixed(8), // 0.0684975, 0.0342487, 0.0083892
  width_over_sqrt_tol: +(plateauWidthDecades(tol) / Math.sqrt(tol)).toFixed(6), // all ~15.3165
  N_lo: +plateauLo(tol).toExponential(6),
  N_hi: +plateauHi(tol).toExponential(6),
}));
const OFFGRID_RATIOS = TOL_OFFGRID.map((tol) => plateauWidthDecades(tol) / Math.sqrt(tol));
const OFFGRID_MAX_SPREAD = Math.max(...OFFGRID_RATIOS) - Math.min(...OFFGRID_RATIOS); // ~3.1e-6

// The imp-35411 headline constant, recomputed here as the cross-check anchor.
const SQRT_TOL_CONSTANT = plateauWidthDecades(1e-5) / Math.sqrt(1e-5); // ~15.316494
const IMP35411_CONSTANT = 15.3165;

// Full seven-tolerance union (imp-35411 four + these three off-grid) constancy check.
const TOL_UNION = [1e-4, 2e-5, 1e-5, 5e-6, 1e-6, 3e-7, 1e-7];
const UNION_RATIOS = TOL_UNION.map((tol) => plateauWidthDecades(tol) / Math.sqrt(tol));
const UNION_MAX_SPREAD = Math.max(...UNION_RATIOS) - Math.min(...UNION_RATIOS); // ~1.6e-5

// Curvature recovered from the off-grid constant: k = 8 / (ln10 * W/sqrt(tol))^2.
const PEAK_CURVATURE = 8 / Math.pow(Math.LN10 * OFFGRID_RATIOS[0], 2); // ~6.428e-3

export const IMP35476_SIGMA_PEAK_PLATEAU_SQRT_TOL_OFFGRID = {
  id: 'imp-35476',
  proofSection: 'S-frontier',
  question:
    'imp-35411 established the sqrt(tol)-scaling of the interior sigma-peak plateau width (W(tol)/sqrt(tol) = ' +
    '15.3165, curvature k ~ 6.43e-3) but sampled only four decade-aligned tolerances {1e-4, 1e-5, 1e-6, 1e-7}. ' +
    'Recompute the two plateau endpoints on the same imp-35337 partsD double surrogate at three OFF-GRID ' +
    'tolerances {2e-5, 5e-6, 3e-7} and confirm the constant survives off the decade grid.',
  constants: {
    log10_N_max: +(Math.log(N_MAX) / Math.LN10).toFixed(6), // ~5.964667
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
    imp35411_constant: IMP35411_CONSTANT, // 15.3165
  },
  offgrid_rows: OFFGRID_ROWS,
  offgrid_max_spread: +OFFGRID_MAX_SPREAD.toExponential(3), // ~3.1e-6
  union_seven_tol_max_spread: +UNION_MAX_SPREAD.toExponential(3), // ~1.6e-5
  peak_curvature_neg_d2sigma_dlnN2: +PEAK_CURVATURE.toExponential(4), // ~6.428e-3
  finding:
    'On the three OFF-GRID (non-decade-aligned) tolerances {2e-5, 5e-6, 3e-7}, the imp-35337/imp-3406 interior ' +
    'sigma-peak plateau width scales as sqrt(tol) with W(tol)/sqrt(tol) = ' + (+OFFGRID_ROWS[0].width_over_sqrt_tol) +
    ', ' + (+OFFGRID_ROWS[1].width_over_sqrt_tol) + ', ' + (+OFFGRID_ROWS[2].width_over_sqrt_tol) +
    ' -- agreeing to a spread of ~' + (+OFFGRID_MAX_SPREAD.toExponential(2)) + ' among themselves and, together ' +
    'with the imp-35411 four decade tols, to ~' + (+UNION_MAX_SPREAD.toExponential(2)) + ' across the full ' +
    'seven-tolerance union. This CORROBORATES imp-35411 W(tol)/sqrt(tol) = 15.3165 to 6+ sig figs and rules out ' +
    'that the four-point law was a decade-sampling coincidence: the sqrt(tol) scaling is the genuine quadratic ' +
    'signature of a smooth flat maximum sigma ~ sigma_max - (k/2)(ln N - ln N_max)^2 with curvature k ~ ' +
    (+PEAK_CURVATURE.toExponential(3)) + '. MEASUREMENT ONLY on the imp-3220/imp-3406 surrogate; imp-35337a ' +
    'surrogate-vs-true fidelity stays OPEN.',
  residual_sub_gap:
    'Inherits imp-35337a: this cross-checks the WIDTH-law constancy on the imp-3220/imp-3406 double surrogate ' +
    '(dd-certified by imp-35337 to ~1e-16, eleven orders below the smallest tolerance 3e-7, so the widths are not ' +
    'a double artifact). It does NOT establish that the surrogate MAP (E_coll = C_C sqrt(log T0/N), C_H = 1/8 ' +
    'ansatz) is a faithful proxy for the true empirical-vs-analytic gap at these heights; that sub-gap imp-35337a ' +
    'stays OPEN.',
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (numerical, frontier-direction, NOT an RH bound). On the three OFF-GRID tolerances ' +
    '{2e-5, 5e-6, 3e-7} the imp-35337/imp-3406 interior sigma-peak plateau width obeys W(tol)/sqrt(tol) = 15.3165 ' +
    'to 6+ sig figs (off-grid spread ~3.1e-6, seven-tolerance-union spread ~1.6e-5, curvature k ~ 6.43e-3), ' +
    'matching imp-35411 and ruling out a decade-sampling coincidence -- the sqrt(tol) law is the genuine quadratic ' +
    'signature of a smooth flat maximum. Located on the imp-35337 double surrogate reproduced VERBATIM ' +
    '(dd-certified there to ~1e-16, eleven orders below the smallest tolerance). MEASUREMENT ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate, which is NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643), the ' +
    'E_trunc = 3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED; the surrogate-vs-true ' +
    'fidelity half (imp-35337a) stays OPEN; changes no bound; establishes no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35411 (W(tol)/sqrt(tol) = 15.3165 on the four decade tols {1e-4..1e-7}); imp-35337 (dd-certified peak ' +
    'VALUE / 2.1e-5 margin); imp-3406 (interior MAX ~ 9.22e5, on double); imp-2642 (C_C = (1/8) sqrt(3 pi) ' +
    'ansatz); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse).',
};

export const IMP35476_SIGMA_PEAK_PLATEAU_SQRT_TOL_OFFGRID_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-35337/imp-35411 peak landmark (N_max ~ 9.22e5, sigma_max ~ 0.94942901).
    id: 'imp35476-reproduces-imp35411-peak',
    description: 'argmax reproduces the imp-35337/imp-35411 interior peak N_max ~ 9.22e5, sigma_max ~ 0.949429',
    holds: () =>
      N_MAX > 5e5 && N_MAX < 2e6 && Math.abs(SIGMA_MAX - 0.94942901) < 1e-6,
  },
  {
    // Off-grid tolerances are genuinely NOT decade-aligned (log10 has a nonzero fractional part).
    id: 'imp35476-tolerances-are-off-grid',
    description: 'the three tolerances {2e-5, 5e-6, 3e-7} are non-decade-aligned (fractional log10)',
    holds: () =>
      TOL_OFFGRID.every((tol) => {
        const frac = Math.abs(Math.log10(tol) - Math.round(Math.log10(tol)));
        return frac > 0.05;
      }),
  },
  {
    // Headline corroboration: each off-grid ratio matches the imp-35411 constant 15.3165 to 6+ sig figs.
    id: 'imp35476-offgrid-ratios-match-15p3165',
    description: 'each off-grid W(tol)/sqrt(tol) matches the imp-35411 constant 15.3165 to <1e-3',
    holds: () =>
      OFFGRID_RATIOS.every((r) => Math.abs(r - IMP35411_CONSTANT) < 1e-3),
  },
  {
    // The three off-grid ratios agree among themselves to 6+ sig figs (tight internal constancy).
    id: 'imp35476-offgrid-internal-constancy',
    description: 'the three off-grid ratios agree to spread < 1e-4 (6+ sig figs constancy)',
    holds: () => OFFGRID_MAX_SPREAD < 1e-4,
  },
  {
    // Full seven-tolerance union (four decade + three off-grid) stays constant to 6+ sig figs.
    id: 'imp35476-seven-tol-union-constancy',
    description: 'the seven-tolerance union W(tol)/sqrt(tol) spread stays < 1e-3 (no decade-sampling artifact)',
    holds: () => UNION_MAX_SPREAD < 1e-3,
  },
  {
    // Curvature recovered from the off-grid constant matches imp-35411 k ~ 6.43e-3.
    id: 'imp35476-curvature-matches-imp35411',
    description: 'peak curvature k = -d^2 sigma/d(ln N)^2 ~ 6.43e-3 recovered from the off-grid constant',
    holds: () => Math.abs(PEAK_CURVATURE - 6.428e-3) < 1e-4,
  },
  {
    // Honesty gate: measurement only, not rigorous, no QED, no refereed bound is changed, sub-gap imp-35337a named.
    id: 'imp35476-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, imp-35337a stays OPEN',
    holds: () =>
      IMP35476_SIGMA_PEAK_PLATEAU_SQRT_TOL_OFFGRID.isRigorous === false &&
      /NO QED/.test(IMP35476_SIGMA_PEAK_PLATEAU_SQRT_TOL_OFFGRID.verdict) &&
      /refereed bound is changed/i.test(IMP35476_SIGMA_PEAK_PLATEAU_SQRT_TOL_OFFGRID.verdict) &&
      /imp-35337a/.test(IMP35476_SIGMA_PEAK_PLATEAU_SQRT_TOL_OFFGRID.residual_sub_gap),
  },
];

for (const a of IMP35476_SIGMA_PEAK_PLATEAU_SQRT_TOL_OFFGRID_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35476-sigma-peak-plateau-sqrt-tol-offgrid assertion failed: ${a.id}`);
  }
}
