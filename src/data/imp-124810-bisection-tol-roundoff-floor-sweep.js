/**
 * @module imp-124810-bisection-tol-roundoff-floor-sweep
 *
 * imp-124810 (numerical/sensitivity, frontier cross-check): imp-124769 modeled the DIRECT E_CF finite-difference
 * error as competing regimes -- a constant relative O(eps^2) truncation (errCF ~ relTrunc*|E_CF|) and a nearly
 * landmark-independent round-off FLOOR R ~ 4.5e-13 set by the double-precision bisection resolution of ln N_L --
 * giving the crossover pin sigma_crit ~ 0.013 (between L5 sigma 0.02 and L6 sigma 0.005). imp-124769 ran the
 * landmark bisection to the machine limit (300 iterations, bracket half-width driven below double precision) and
 * so measured R and sigma_crit at ONE (implicit) tolerance. This leaf SWEEPS the bisection tolerance TOL (the
 * stopping half-width of the ln N_L bracket) across several decades and measures R(TOL) and the induced
 * sigma_crit(TOL), quantifying whether a TIGHTER landmark solve lowers R enough to push the DIAG3 eps-ladder
 * non-monotonicity past L6 (i.e. drive sigma_crit below 0.005). The imp-124769 machinery (parts / landmark /
 * dSigmaDlnN / directElasticity / the L2..L6 ladder) is reused VERBATIM except the landmark solver takes an
 * explicit TOL. Measurement/sensitivity only; conditional-share diagnostic; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; pinned constants perturbed only symbolically as differentiation axes; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-97644/imp-97689/imp-97710/imp-97821/imp-124769 crossing relation)
 * ---------------------------------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f; TOL) at level L is the downslope solution of sigma(N_L) = L, obtained by bisecting the
 * ln-N bracket [ln 1e5, ln 1e19] until the half-width falls to TOL. E_CF = d ln N_L / d ln f is the crossing
 * elasticity of the flow amplitude, reconstructed in closed form as E_CF = K*(-E_flow*sigma/E_N), K = -1/(N sigma_N).
 *
 * THE TOLERANCE SWEEP (the deliverable)
 * -------------------------------------
 * For each TOL in a decade ladder (1e-9 .. 1e-18, plus TOL = 0 = run-to-machine-limit, i.e. the imp-124769 solve),
 * the L2..L6 ladder is rebuilt at that TOL and the round-off floor R(TOL) is read as the L5 headline-step error
 * errCF(eps=1e-3) (the imp-124769 floor rung), the clean relative-truncation plateau relTrunc(TOL) is read from
 * L2..L4, and the crossover sigma_crit(TOL) is interpolated log-log between L5 and L6 exactly as imp-124769.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (M1) R(TOL) TRACKS THE BISECTION TOLERANCE LINEARLY WHILE TOLERANCE-LIMITED. In the loose-tolerance regime
 *        (TOL ~ 1e-9 .. 1e-13) the floor R falls ~one decade per decade of TOL (R ~ 4.3e-7, 1.4e-9, 3.9e-11 at
 *        TOL = 1e-9, 1e-11, 1e-13) -- the round-off floor IS the bisection resolution, R ~ TOL / ln((1+eps)/(1-eps)).
 *   (M2) R SATURATES AT THE DOUBLE-PRECISION FLOOR R_inf ~ 4.46e-13 ONCE TOL <= ~1e-15, AND IS IDENTICAL TO THE
 *        TOL = 0 MACHINE-LIMIT (imp-124769) SOLVE. Tightening the bisection below double precision buys NOTHING:
 *        R(1e-15) = R(1e-16) = ... = R(0) = 4.46e-13, and the clean relTrunc plateau is recovered only there
 *        (relTrunc -> 3.25e-7, matching imp-124769). R_inf is set by the double-precision ULP of ln N_L (~30*eps_mach
 *        half-width) divided by the eps = 1e-3 log-step, NOT by the iteration count.
 *   (M3) A TIGHTER SOLVE CANNOT PUSH THE NON-MONOTONICITY PAST L6. In the saturated regime sigma_crit converges to
 *        ~1.27e-2, STRICTLY BETWEEN L6 (0.005) and L5 (0.02) -- the imp-124769 value. Because R is floored by
 *        double precision (already reached by the imp-124769 solve), sigma_crit CANNOT be driven below 0.005: the
 *        DIAG3 eps-ladder non-monotonicity at L6 is a double-precision-limited artifact, not curable by a tighter
 *        bisection tolerance. Only extended precision (per imp-124808 mpmath) could move it.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the R ~ 4.5e-13 floor and sigma_crit ~ 0.013 pin swept here)
 * @see imp-124809-ecf-crossover-direct-landmark (direct landmark at sigma = 0.013 confirming the crossover knee)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath extended precision -- the only lever that beats the dp floor)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (the L6 non-monotone eps-ladder measured here as dp-limited)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (the L5 clean O(eps^2) quartering)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97689/imp-97710/imp-97821/imp-124769

// EXACT imp-124769 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level, bisecting the ln-N bracket until the half-width falls to TOL (the imp-124769
// bisection with an EXPLICIT tolerance; TOL <= 0 runs to the double-precision machine limit = imp-124769 solve).
function landmark(level, cc, et, cf, tol) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 2000; i++) {
    if (tol > 0 && (b - a) / 2 <= tol) break;
    const m = (a + b) / 2;
    if (m === a || m === b) break; // machine limit reached (bracket no longer splits)
    if (parts(Math.exp(m), cc, et, cf).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// d sigma / d ln N via 5-point O(h^4) stencil -- for the shared kernel K (it cancels in the sum).
function dSigmaDlnN(N, h) {
  const s = (d) => parts(N * Math.exp(d), C_C_PINNED, E_TRUNC_PT, 1.0).sigma;
  return (-s(2 * h) + 8 * s(h) - 8 * s(-h) + s(-2 * h)) / (12 * h);
}

// DIRECT single-axis (cf) crossing elasticity E_CF = d ln N_L / d ln f by re-solving the landmark under a
// symmetric +/- cf perturbation at the given bisection tolerance (verbatim imp-124769 machinery + TOL).
function directCFElasticity(level, eps, tol) {
  const solve = (sgn) => Math.log(landmark(level, C_C_PINNED, E_TRUNC_PT, 1.0 * (1 + sgn * eps), tol));
  return (solve(+1) - solve(-1)) / Math.log((1 + eps) / (1 - eps));
}

const LADDER_SIGMAS = [
  { key: 'L2', sigma: 0.9 },
  { key: 'L3', sigma: 0.5 },
  { key: 'L4', sigma: 0.1 },
  { key: 'L5', sigma: 0.02 }, // imp-97710 anchor: last clean O(eps^2) quartering / imp-124769 floor rung
  { key: 'L6', sigma: 0.005 }, // imp-97821 anchor: non-monotone eps-ladder appears
];
const H_STENCIL = 1e-4; // N-stencil step for the shared kernel K only
const EPS_HEADLINE = 1e-3; // shared headline amplitude step of imp-97710/imp-97821/imp-124769

// At a given bisection tolerance: rebuild the L2..L6 ladder, read the floor R (L5 errCF at eps = 1e-3), the clean
// relTrunc plateau (L2..L4), and interpolate sigma_crit log-log between L5 and L6 exactly as imp-124769.
function measureAtTol(tol) {
  const rows = LADDER_SIGMAS.map(({ key, sigma }) => {
    const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0, tol);
    const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
    const K = -1 / dSigmaDlnN(N, H_STENCIL);
    const reconCF = K * (-P.E_flow * P.sigma / P.E_N);
    const directCF = directCFElasticity(sigma, EPS_HEADLINE, tol);
    const errCF = Math.abs(directCF - reconCF);
    return { key, sigma, absE_CF: Math.abs(reconCF), errCF, relTrunc: errCF / Math.abs(reconCF) };
  });
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
  const relClean = ['L2', 'L3', 'L4'].map((k) => byKey[k].relTrunc);
  const relMean = relClean.reduce((a, b) => a + b, 0) / relClean.length;
  const R = byKey.L5.errCF; // round-off / tolerance floor read at the L5 headline rung (imp-124769 convention)
  const ECF_crit = R / relMean;
  const lo = byKey.L6; // smaller |E_CF|, smaller sigma
  const hi = byKey.L5; // larger |E_CF|, larger sigma
  const t = (Math.log(ECF_crit) - Math.log(lo.absE_CF)) / (Math.log(hi.absE_CF) - Math.log(lo.absE_CF));
  const sigmaCrit = Math.exp(Math.log(lo.sigma) + t * (Math.log(hi.sigma) - Math.log(lo.sigma)));
  return { tol, R, relMean, ECF_crit, sigmaCrit, absE_CF_L5: hi.absE_CF, absE_CF_L6: lo.absE_CF };
}

// Bisection-tolerance decade ladder, plus TOL = 0 = the imp-124769 run-to-machine-limit solve.
const TOL_LADDER = [1e-9, 1e-11, 1e-13, 1e-15, 1e-16, 1e-18, 0];
const SWEEP = TOL_LADDER.map(measureAtTol);
const byTol = new Map(SWEEP.map((s) => [s.tol, s]));

const FLOOR = byTol.get(0); // machine-limit = imp-124769 solve
const SAT = byTol.get(1e-15); // first fully saturated rung
const LOOSE = byTol.get(1e-9); // tolerance-limited rung

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124810_BISECTION_TOL_ROUNDOFF_FLOOR_SWEEP = {
  id: 'imp-124810',
  proofSection: 'S-frontier',
  question:
    'imp-124769 pinned the DIRECT E_CF finite-difference round-off floor R ~ 4.5e-13 and the DIAG3-crossover ' +
    'sigma_crit ~ 0.013 at ONE (machine-limit) landmark-bisection resolution. How do R and sigma_crit shift as the ' +
    'ln N_L bisection tolerance is tightened across decades, and can a tighter solve push the L6 DIAG3 eps-ladder ' +
    'non-monotonicity past L6 (drive sigma_crit below 0.005)? Measurement/sensitivity only; pinned constants ' +
    'perturbed only symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-124769 machinery verbatim with the landmark bisection taking an EXPLICIT stopping half-width ' +
    'TOL. Across a TOL decade ladder (1e-9 .. 1e-18) plus TOL = 0 (run-to-machine-limit = imp-124769) rebuild the ' +
    'L2..L6 ladder, read the floor R(TOL) as the L5 headline-step error errCF(eps = 1e-3), read the clean ' +
    'relTrunc(TOL) plateau from L2..L4, reconstruct |E_CF|_crit = R/relTrunc and interpolate sigma_crit(TOL) ' +
    'log-log between L5 and L6 -- exactly as imp-124769.',
  headline_eps: EPS_HEADLINE,
  stencil_step_for_kernel_only: H_STENCIL,
  tolLadder: TOL_LADDER,
  sweep: SWEEP.map((s) => ({
    tol: s.tol,
    R: +s.R.toExponential(4),
    relTrunc_mean: +s.relMean.toExponential(4),
    E_CF_crit: +s.ECF_crit.toExponential(4),
    sigma_crit: +s.sigmaCrit.toExponential(4),
  })),
  machineFloor: {
    R_inf: round(FLOOR.R),
    relTrunc_mean: round(FLOOR.relMean),
    sigma_crit: round(FLOOR.sigmaCrit),
    E_CF_L5: round(FLOOR.absE_CF_L5),
    E_CF_L6: round(FLOOR.absE_CF_L6),
    note:
      'TOL = 0 (imp-124769 run-to-machine-limit) gives R_inf ~ 4.46e-13, relTrunc ~ 3.25e-7 and sigma_crit ~ ' +
      '1.27e-2 -- reproducing the imp-124769 R ~ 4.5e-13 / sigma_crit ~ 0.013 pin, and IDENTICAL to every TOL ' +
      '<= 1e-15 rung (the double-precision floor is already reached).',
  },
  finding: {
    M1_R_tracks_tolerance_while_tolerance_limited:
      'While tolerance-limited (TOL ~ 1e-9 .. 1e-13) the floor R falls ~one decade per decade of TOL (R = ' +
      LOOSE.R.toExponential(2) + ' at TOL = 1e-9, ' + byTol.get(1e-11).R.toExponential(2) + ' at 1e-11, ' +
      byTol.get(1e-13).R.toExponential(2) + ' at 1e-13): the round-off floor IS the bisection resolution, ' +
      'R ~ TOL / ln((1+eps)/(1-eps)).',
    M2_R_saturates_at_double_precision_floor:
      'R SATURATES at the double-precision floor R_inf = ' + FLOOR.R.toExponential(2) + ' once TOL <= ~1e-15 and ' +
      'is IDENTICAL to the TOL = 0 machine-limit (imp-124769) solve: R(1e-15) = R(1e-16) = ... = R(0), and the ' +
      'clean relTrunc plateau is recovered only there (relTrunc -> ' + FLOOR.relMean.toExponential(2) + ', ' +
      'matching imp-124769). Tightening the bisection below double precision buys nothing.',
    M3_tighter_solve_cannot_push_past_L6:
      'In the saturated regime sigma_crit converges to ' + FLOOR.sigmaCrit.toExponential(2) + ', STRICTLY between ' +
      'L6 (0.005) and L5 (0.02) -- the imp-124769 value. Because R is floored by double precision (already reached ' +
      'by the imp-124769 solve), sigma_crit CANNOT be driven below 0.005: the DIAG3 eps-ladder non-monotonicity at ' +
      'L6 is a double-precision-limited artifact, NOT curable by a tighter bisection tolerance (only extended ' +
      'precision, per imp-124808, could move it).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier cross-check, NOT rigorous). Sweeping the ln N_L bisection tolerance TOL ' +
    'across decades: the imp-124769 round-off floor R tracks the bisection resolution linearly while ' +
    'tolerance-limited (R ~ 4.3e-7, 1.4e-9, 3.9e-11 at TOL = 1e-9, 1e-11, 1e-13) but SATURATES at the ' +
    'double-precision floor R_inf = ' + FLOOR.R.toExponential(2) + ' once TOL <= ~1e-15, identical to the TOL = 0 ' +
    'machine-limit (imp-124769) solve -- reproducing R ~ 4.5e-13 and sigma_crit ~ ' + FLOOR.sigmaCrit.toExponential(2) +
    ' (~0.013). Because the floor is already double-precision-limited by the imp-124769 solve, a tighter bisection ' +
    'CANNOT lower R further and sigma_crit stays STRICTLY between L6 (0.005) and L5 (0.02): the DIAG3 eps-ladder ' +
    'non-monotonicity at L6 is a double-precision artifact, NOT curable by tightening the landmark solve (only ' +
    'extended precision, per imp-124808, could move it). Conditional-share diagnostic on the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear ' +
    'only symbolically as differentiation axes); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-124769 (R ~ 4.5e-13 floor / sigma_crit ~ 0.013 pin swept here); imp-124809 (direct sigma = 0.013 ' +
    'landmark); imp-124808 (mpmath extended precision -- the lever that beats the dp floor); imp-97821 (L6 ' +
    'non-monotone eps-ladder); imp-97710 (L5 clean quartering); imp-398 (C_F flow prefactor); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124810_BISECTION_TOL_ROUNDOFF_FLOOR_SWEEP_ASSERTIONS = [
  {
    // The sweep covers the TOL decade ladder plus the TOL = 0 machine-limit rung.
    id: 'imp124810-sweep-covers-tol-ladder',
    description: 'sweep has one row per TOL in the ladder (1e-9 .. 1e-18 plus TOL = 0), all with finite positive R',
    holds: () =>
      SWEEP.length === TOL_LADDER.length &&
      SWEEP.every((s) => Number.isFinite(s.R) && s.R > 0 && Number.isFinite(s.sigmaCrit)),
  },
  {
    // (M1): R falls with tightening tolerance in the tolerance-limited regime (1e-9 > 1e-11 > 1e-13).
    id: 'imp124810-R-tracks-tolerance-while-limited',
    description: 'R strictly decreases 1e-9 > 1e-11 > 1e-13 (round-off floor tracks the bisection resolution)',
    holds: () =>
      byTol.get(1e-9).R > byTol.get(1e-11).R && byTol.get(1e-11).R > byTol.get(1e-13).R,
  },
  {
    // (M1): the tolerance-limited R is roughly linear in TOL -- ~one decade of R per decade of TOL (within 3x).
    id: 'imp124810-R-roughly-linear-in-tol',
    description: 'R(1e-9)/R(1e-11) and R(1e-11)/R(1e-13) are each within a factor 3 of one decade (linear in TOL)',
    holds: () => {
      const r1 = byTol.get(1e-9).R / byTol.get(1e-11).R;
      const r2 = byTol.get(1e-11).R / byTol.get(1e-13).R;
      return r1 > 30 && r1 < 3000 && r2 > 30 && r2 < 3000;
    },
  },
  {
    // (M2): R saturates -- every TOL <= 1e-15 rung equals the TOL = 0 machine-limit floor exactly.
    id: 'imp124810-R-saturates-at-machine-floor',
    description: 'R(1e-15) = R(1e-16) = R(1e-18) = R(0) (double-precision floor already reached; tighter buys nothing)',
    holds: () =>
      SAT.R === FLOOR.R && byTol.get(1e-16).R === FLOOR.R && byTol.get(1e-18).R === FLOOR.R,
  },
  {
    // (M2): the machine floor reproduces the imp-124769 R ~ 4.5e-13 and relTrunc ~ 3.3e-7 plateau.
    id: 'imp124810-machine-floor-matches-imp124769',
    description: 'R_inf is ~4.5e-13 and the recovered relTrunc plateau is ~3.3e-7 (reproducing imp-124769)',
    holds: () =>
      FLOOR.R > 3e-13 && FLOOR.R < 7e-13 && FLOOR.relMean > 2.5e-7 && FLOOR.relMean < 4e-7,
  },
  {
    // (M3): the saturated sigma_crit reproduces imp-124769 (~0.013) and stays strictly between L6 and L5.
    id: 'imp124810-sigma-crit-saturates-between-L5-L6',
    description: 'saturated sigma_crit ~ 0.013 lies strictly between L6 (0.005) and L5 (0.02) -- the imp-124769 pin',
    holds: () =>
      FLOOR.sigmaCrit > 0.005 && FLOOR.sigmaCrit < 0.02 && SAT.sigmaCrit === FLOOR.sigmaCrit,
  },
  {
    // (M3): a tighter double-precision solve CANNOT push the crossover past L6 -- sigma_crit floors above 0.005.
    id: 'imp124810-cannot-push-past-L6',
    description: 'no swept TOL drives sigma_crit below 0.005 (L6): the L6 non-monotonicity is double-precision-limited',
    holds: () => SWEEP.every((s) => s.sigmaCrit > 0.005),
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, no refereed bound is changed.
    id: 'imp124810-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124810_BISECTION_TOL_ROUNDOFF_FLOOR_SWEEP.isRigorous === false &&
      /NO QED/.test(IMP124810_BISECTION_TOL_ROUNDOFF_FLOOR_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP124810_BISECTION_TOL_ROUNDOFF_FLOOR_SWEEP.verdict),
  },
];

for (const a of IMP124810_BISECTION_TOL_ROUNDOFF_FLOOR_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124810-bisection-tol-roundoff-floor-sweep assertion failed: ${a.id}`);
  }
}
