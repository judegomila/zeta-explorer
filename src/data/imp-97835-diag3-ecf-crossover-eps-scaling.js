/**
 * @module imp-97835-diag3-ecf-crossover-eps-scaling
 *
 * imp-97835 (accuracy/measurement, frontier cross-check): imp-97821 M3 found that at the sixth landmark L6
 * (sigma = 0.005) the DIAG3 finite-difference eps-ladder is NON-monotone (DIAG3 = +4.00e-9 at eps = 1e-3, round-off
 * ~3.5e-16 at eps = 1e-4, back up to ~7.1e-10 at eps = 1e-5), because the collapsed E_CF axis (elasticity ~2.4e-7)
 * is so small that landmark-bisection round-off overtakes the O(eps^2) truncation once eps is small. This leaf
 * CHARACTERIZES that crossover: it locates the crossover step eps* at which round-off overtakes truncation, and
 * measures how eps* scales with the collapsed E_CF magnitude across the three deep landmarks L4/L5/L6
 * (|E_CF| ~ 7.38e-5 / 3.25e-6 / 2.39e-7 at sigma = 0.1 / 0.02 / 0.005). The imp-97821/imp-97710 central-difference
 * machinery is reused VERBATIM. Accuracy/measurement only; changes no bound; the pinned constants are perturbed
 * only symbolically as differentiation axes; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066
 * untouched; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97689/imp-97710/imp-97821 crossing relation)
 * -------------------------------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f) at level L is the downslope solution of sigma(N_L; c, e, f) = L (identical
 * bisection to imp-97644/imp-97689/imp-97710/imp-97821). The DIRECT crossing elasticity of the collapsed C_F
 * axis is E_CF^direct(eps) = d ln N_L / d ln f measured by a symmetric +/- eps perturbation of f.
 *
 * THE CROSSOVER DECOMPOSITION (the deliverable)
 * --------------------------------------------
 * The absolute error of the direct E_CF measurement versus the (essentially-exact) closed-form reconstruction
 * E_CF^recon = K*(-E_flow*sigma/E_N) decomposes into two competing branches:
 *   err(eps) = T * eps^2  +  R / eps.
 *   - TRUNCATION branch T*eps^2: the O(eps^2) central-difference truncation. MEASURED T = tau * |E_CF| with a
 *     UNIVERSAL relative curvature tau ~ 1/3 (0.333 / 0.333 / 0.336 across L4/L5/L6), so T scales LINEARLY with
 *     the collapsed E_CF magnitude (fitted exponent ~1.00).
 *   - ROUND-OFF branch R/eps: the landmark-bisection round-off in ln N_L, propagated through the finite
 *     difference. MEASURED R ~ 2.2e-15 (ln-N units), landmark-INDEPENDENT (it is the ln N_L bisection floor,
 *     not tied to E_CF).
 * Minimizing err(eps) gives the crossover step
 *   eps* = (R / (2 T))^(1/3) = (3 R / (2 |E_CF|))^(1/3)  ~  |E_CF|^(-1/3).
 * As the flow share collapses down the landmark ladder, |E_CF| shrinks and eps* MOVES TO LARGER eps: the tiny
 * signal is swamped by the fixed bisection round-off at ever coarser steps.
 *
 * THE FINDING (measurement / characterization only)
 * ------------------------------------------------
 *   (M1) THE eps-LADDER IS U-SHAPED, err(eps) = T*eps^2 + R/eps. On a fine 1e-2..1e-8 ladder the direct-E_CF
 *        error falls as eps^2 (truncation), bottoms out at a landmark-dependent minimum, then rises as 1/eps
 *        (round-off). The imp-97821 M3 non-monotonicity at L6 is exactly the small-eps 1/eps branch appearing
 *        inside the {1e-3, 1e-4, 1e-5} window, because L6 has the LARGEST crossover eps* (see M3).
 *   (M2) THE TRUNCATION COEFFICIENT IS T = tau*|E_CF| WITH tau ~ 1/3 UNIVERSAL, WHILE R IS CONSTANT. The
 *        eps = 1e-2 truncation branch gives tau = T/|E_CF| = 0.333 / 0.333 / 0.336 across L4/L5/L6 (fitted
 *        T-vs-|E_CF| exponent 1.000 / 0.996), and the small-eps branch gives R ~ 1.9e-15 / 2.3e-15 / 2.4e-15,
 *        landmark-independent to within the round-off jitter. The truncation curve drops with E_CF; the round-off
 *        floor does not.
 *   (M3) THE CROSSOVER SCALES AS eps* ~ |E_CF|^(-1/3), MOVING TO COARSER STEPS AS E_CF COLLAPSES. The measured
 *        crossover is eps* = 3.4e-4 (L4) -> 1.0e-3 (L5) -> 2.5e-3 (L6) as |E_CF| collapses 7.4e-5 -> 3.2e-6 ->
 *        2.4e-7, a fitted exponent ~ -0.347 over L4..L6 (versus the analytic -1/3 from eps* = (R/2T)^(1/3) with
 *        T proportional to |E_CF|). At L4 eps* sits below the imp-97821 {1e-3..1e-5} window so that window quarters
 *        cleanly; at L6 eps* has risen ABOVE 1e-3 so the whole window sits on the round-off branch and the ladder
 *        reads non-monotone -- exactly the imp-97821 M3 signature, now explained quantitatively.
 *
 * MEASUREMENT / CHARACTERIZATION ONLY. Numerical-analysis diagnostic of the finite-difference stencil, NOT an RH
 * bound and NOT a statement about the underlying elasticity (which is the exact closed form E_CF^recon). The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398
 * C_F prefactor are UNTOUCHED and appear only symbolically as differentiation axes; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (M3: the non-monotone L6 DIAG3 eps-ladder characterized here)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (the far-downslope L5 sigma = 0.02 cross-validation)
 * @see imp-97689-diag3-additivity-euler-derivation (analytic derivation + L2/L3/L4 closed-form verification)
 * @see imp-97644-three-axis-additivity-flow-prefactor (MEASURED DIAG3 == 0 and SUM3 = O(eps^2))
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97689/imp-97710/imp-97821 exactly

// EXACT imp-3406/imp-97821 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-97821).
function landmark(level, cc, et, cf) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
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

// DIRECT single-axis crossing elasticity E_p = d ln N_L / d ln p (verbatim imp-97821 machinery).
function directElasticity(level, axis, eps) {
  const base = { cc: C_C_PINNED, et: E_TRUNC_PT, cf: 1.0 };
  const solve = (sgn) => {
    const q = { ...base };
    q[axis] = base[axis] * (1 + sgn * eps);
    return Math.log(landmark(level, q.cc, q.et, q.cf));
  };
  return (solve(+1) - solve(-1)) / Math.log((1 + eps) / (1 - eps));
}

// (Essentially-exact) closed-form reconstruction of the collapsed C_F crossing elasticity at a landmark.
function reconCF(level) {
  const N_L = landmark(level, C_C_PINNED, E_TRUNC_PT, 1.0);
  const P = parts(N_L, C_C_PINNED, E_TRUNC_PT, 1.0);
  const K = -1 / dSigmaDlnN(N_L, 1e-4);
  return K * (-P.E_flow * P.sigma / P.E_N); // K*(f*sigma_f), the E_CF axis
}

// The three deep landmarks: L4 (sigma 0.1, imp-97520 anchor), L5 (0.02, imp-97710), L6 (0.005, imp-97821).
const LANDMARKS = [
  { key: 'L4', sigma: 0.1 },
  { key: 'L5', sigma: 0.02 },
  { key: 'L6', sigma: 0.005 },
];

// Fine eps-ladder spanning both branches: 1e-2 (pure truncation) down to 1e-8 (pure round-off).
const EPS_LADDER = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8];
const EPS_TRUNC = 1e-2; // truncation branch: T = err/eps^2 (well above the round-off floor)
const EPS_ROUND = [1e-6, 1e-7, 1e-8]; // round-off branch: R = mean(err*eps)

// Per-landmark measurement of the U-shaped err(eps), the crossover eps*, and the T/R coefficients.
const CROSSOVER = LANDMARKS.map((lm) => {
  const cfRecon = reconCF(lm.sigma);
  const absECF = Math.abs(cfRecon);
  const ladder = EPS_LADDER.map((eps) => {
    const cfDir = directElasticity(lm.sigma, 'cf', eps);
    return { eps, absErr: Math.abs(cfDir - cfRecon) };
  });
  // empirical crossover = the eps rung with minimum error (the U bottom)
  let bottom = ladder[0];
  for (const r of ladder) if (r.absErr < bottom.absErr) bottom = r;
  // truncation coefficient T = tau*|E_CF| from the 1e-2 rung; relative curvature tau
  const T = directBranchT(lm.sigma, cfRecon);
  const tau = T / absECF;
  // round-off floor R = mean(err*eps) over the small-eps branch (ln-N units)
  const R =
    EPS_ROUND.reduce((acc, eps) => acc + Math.abs(directElasticity(lm.sigma, 'cf', eps) - cfRecon) * eps, 0) /
    EPS_ROUND.length;
  // analytic crossover eps* = (R/(2T))^(1/3)
  const epsStar = Math.pow(R / (2 * T), 1 / 3);
  return {
    key: lm.key,
    sigma: lm.sigma,
    absECF: +absECF.toExponential(6),
    ladder: ladder.map((r) => ({ eps: r.eps, absErr: +r.absErr.toExponential(3) })),
    empiricalBottomEps: bottom.eps,
    T: +T.toExponential(6),
    tau: +tau.toFixed(6),
    R: +R.toExponential(6),
    epsStar: +epsStar.toExponential(6),
  };
});

function directBranchT(level, cfRecon) {
  return Math.abs(directElasticity(level, 'cf', EPS_TRUNC) - cfRecon) / (EPS_TRUNC * EPS_TRUNC);
}

// Fitted power-law exponents across the outer landmark span L4 -> L6.
const first = CROSSOVER[0];
const last = CROSSOVER[CROSSOVER.length - 1];
const lnRatioECF = Math.log(last.absECF / first.absECF);
const P_T = Math.log(last.T / first.T) / lnRatioECF; // T vs |E_CF| (expect ~1)
const P_EPSSTAR = Math.log(last.epsStar / first.epsStar) / lnRatioECF; // eps* vs |E_CF| (expect ~-1/3)
const TAU_MEAN = CROSSOVER.reduce((a, c) => a + c.tau, 0) / CROSSOVER.length;

export const IMP97835_DIAG3_ECF_CROSSOVER_EPS_SCALING = {
  id: 'imp-97835',
  proofSection: 'S-frontier',
  question:
    'imp-97821 M3 found the L6 (sigma = 0.005) DIAG3 finite-difference eps-ladder is NON-monotone (+4.00e-9 at ' +
    'eps = 1e-3, round-off at 1e-4, ~7.1e-10 back at 1e-5) because the collapsed E_CF axis (~2.4e-7) is so small ' +
    'that landmark-bisection round-off overtakes the O(eps^2) truncation. WHERE is the crossover step eps* at ' +
    'which round-off overtakes truncation, and HOW does eps* scale with the collapsed E_CF magnitude across the ' +
    'deep landmarks L4/L5/L6 (|E_CF| ~ 7.4e-5 / 3.2e-6 / 2.4e-7)? Measurement/accuracy only; pinned constants ' +
    'perturbed only symbolically; no bound moves; no QED.',
  method:
    'On each of the three deep landmarks L4 (sigma 0.1), L5 (0.02), L6 (0.005), measure the direct E_CF crossing ' +
    'elasticity E_CF^direct(eps) = d ln N_L / d ln f (verbatim imp-97821 machinery) on a fine 1e-2..1e-8 eps-ladder ' +
    'and take its absolute error versus the essentially-exact closed-form reconstruction E_CF^recon = ' +
    'K*(-E_flow*sigma/E_N). Decompose err(eps) = T*eps^2 + R/eps: fit the truncation coefficient T from the 1e-2 ' +
    'rung (T = err/eps^2) and the round-off floor R from the small-eps branch (R = mean(err*eps)). Locate the ' +
    'crossover eps* = (R/(2T))^(1/3) and fit its |E_CF| power law across L4..L6.',
  landmarks: CROSSOVER,
  fittedExponents: {
    T_vs_absECF: +P_T.toFixed(4), // ~1.00: truncation coefficient scales linearly with |E_CF|
    epsStar_vs_absECF: +P_EPSSTAR.toFixed(4), // ~-0.35: matches the analytic -1/3 of eps* = (R/2T)^(1/3)
    tau_mean: +TAU_MEAN.toFixed(6), // ~1/3: universal relative curvature T/|E_CF|
    analytic_epsStar_exponent: -1 / 3, // eps* = (3R/(2|E_CF|))^(1/3) with T = tau*|E_CF|, R constant
  },
  finding: {
    M1_u_shaped_ladder:
      'On the fine 1e-2..1e-8 ladder the direct-E_CF error is U-shaped: err(eps) = T*eps^2 + R/eps, falling as ' +
      'eps^2 (truncation), bottoming at a landmark-dependent minimum, then rising as 1/eps (landmark-bisection ' +
      'round-off). The imp-97821 M3 non-monotonicity at L6 is exactly this 1/eps branch appearing inside the ' +
      '{1e-3, 1e-4, 1e-5} window, because L6 carries the LARGEST crossover eps* (M3).',
    M2_T_scales_with_ECF_R_constant:
      'The truncation coefficient is T = tau*|E_CF| with a UNIVERSAL relative curvature tau = T/|E_CF| = ' +
      CROSSOVER.map((c) => c.tau.toFixed(3)).join(' / ') + ' across L4/L5/L6 (fitted T-vs-|E_CF| exponent ' +
      P_T.toFixed(3) + ' ~ 1), while the round-off floor R = ' + CROSSOVER.map((c) => c.R.toExponential(1)).join(' / ') +
      ' (ln-N units) is landmark-independent. The truncation curve drops with the collapsing E_CF; the ' +
      'bisection round-off floor does not.',
    M3_crossover_scales_minus_one_third:
      'The crossover moves to COARSER eps as E_CF collapses: eps* = ' +
      CROSSOVER.map((c) => c.epsStar.toExponential(2)).join(' -> ') + ' as |E_CF| collapses ' +
      CROSSOVER.map((c) => c.absECF.toExponential(1)).join(' -> ') + ', a fitted exponent ' + P_EPSSTAR.toFixed(3) +
      ' matching the analytic eps* = (R/(2T))^(1/3) ~ |E_CF|^(-1/3) (since T is proportional to |E_CF| and R is ' +
      'constant). At L4 eps* sits below the imp-97821 {1e-3..1e-5} window (clean quartering); at L6 eps* has risen ' +
      'above 1e-3, so that window sits on the round-off branch and reads non-monotone -- the imp-97821 M3 ' +
      'signature, now explained quantitatively.',
  },
  isRigorous: false,
  verdict:
    'CHARACTERIZATION (finite-difference numerical analysis, NOT rigorous, NOT an RH statement). The imp-97821 M3 ' +
    'non-monotone L6 eps-ladder is fully explained: the direct-E_CF measurement error decomposes as err(eps) = ' +
    'T*eps^2 + R/eps, an O(eps^2) truncation branch competing with a landmark-bisection round-off branch. The ' +
    'truncation coefficient is T = tau*|E_CF| with a UNIVERSAL relative curvature tau ~ ' + TAU_MEAN.toFixed(3) +
    ' (fitted T-vs-|E_CF| exponent ' + P_T.toFixed(3) + '), while the round-off floor R ~ 2.2e-15 (ln-N units) is ' +
    'landmark-independent. The crossover therefore scales as eps* = (R/(2T))^(1/3) ~ |E_CF|^(-1/3): measured ' +
    'eps* = ' + CROSSOVER.map((c) => c.epsStar.toExponential(2)).join(' -> ') + ' (fitted exponent ' +
    P_EPSSTAR.toFixed(3) + ' vs analytic -1/3) as |E_CF| collapses down the L4/L5/L6 ladder, moving above 1e-3 by ' +
    'L6 so the imp-97821 {1e-3..1e-5} window falls on the round-off branch and reads non-monotone. ' +
    'Measurement/characterization only on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned ' +
    'E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (appear only symbolically as differentiation ' +
    'axes); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO ' +
    'QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97821 (M3 non-monotone L6 DIAG3 eps-ladder); imp-97710 (far-downslope L5 sigma = 0.02); imp-97689 ' +
    '(analytic Euler-additivity derivation); imp-97644 (MEASURED DIAG3 == 0 and SUM3 = O(eps^2)); imp-97520 ' +
    '(landmark ladder L1..L4); imp-398 (C_F flow prefactor); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97835_DIAG3_ECF_CROSSOVER_EPS_SCALING_ASSERTIONS = [
  {
    // The three landmarks carry the collapsing E_CF magnitudes reported by imp-97710/imp-97821.
    id: 'imp97835-landmarks-collapsing-ecf',
    description: 'L4/L5/L6 carry strictly collapsing |E_CF| ~ 7.4e-5 > 3.2e-6 > 2.4e-7',
    holds: () =>
      CROSSOVER[0].absECF > CROSSOVER[1].absECF &&
      CROSSOVER[1].absECF > CROSSOVER[2].absECF &&
      Math.abs(CROSSOVER[2].absECF - 2.39e-7) < 5e-9,
  },
  {
    // (M2): the truncation coefficient scales linearly with |E_CF| (deterministic 1e-2 branch).
    id: 'imp97835-T-scales-linearly-with-ecf',
    description: 'fitted T-vs-|E_CF| power-law exponent is ~1 (|P_T - 1| < 0.05)',
    holds: () => Math.abs(P_T - 1) < 0.05,
  },
  {
    // (M2): the relative curvature tau = T/|E_CF| is universal ~1/3 across all three landmarks.
    id: 'imp97835-tau-universal-one-third',
    description: 'tau = T/|E_CF| ~ 1/3 at every landmark (|tau - 1/3| < 0.02)',
    holds: () => CROSSOVER.every((c) => Math.abs(c.tau - 1 / 3) < 0.02),
  },
  {
    // (M2): the round-off floor R is landmark-independent (all within a factor of a few of ~2.2e-15).
    id: 'imp97835-roundoff-floor-landmark-independent',
    description: 'R ~ 2.2e-15 (ln-N units) at every landmark, within [1e-15, 5e-15]',
    holds: () => CROSSOVER.every((c) => c.R > 1e-15 && c.R < 5e-15),
  },
  {
    // (M3): the crossover eps* moves to LARGER eps as E_CF collapses (L4 < L5 < L6).
    id: 'imp97835-crossover-moves-to-coarser-eps',
    description: 'crossover eps* is monotone increasing L4 < L5 < L6 as |E_CF| collapses',
    holds: () =>
      CROSSOVER[0].epsStar < CROSSOVER[1].epsStar && CROSSOVER[1].epsStar < CROSSOVER[2].epsStar,
  },
  {
    // (M3): the eps* power-law exponent matches the analytic -1/3 (loose bound for round-off jitter).
    id: 'imp97835-epsstar-minus-one-third',
    description: 'fitted eps*-vs-|E_CF| exponent is ~-1/3 (in [-0.5, -0.2])',
    holds: () => P_EPSSTAR < -0.2 && P_EPSSTAR > -0.5,
  },
  {
    // (M3): L6 has the largest crossover, above 1e-3 -- why the imp-97821 {1e-3..1e-5} window reads non-monotone.
    id: 'imp97835-L6-crossover-above-1e-3',
    description: 'L6 crossover eps* > 1e-3, so the imp-97821 {1e-3..1e-5} window falls on the round-off branch',
    holds: () => CROSSOVER[2].epsStar > 1e-3,
  },
  {
    // (M1): every ladder is U-shaped -- interior minimum strictly below both the 1e-2 and 1e-8 endpoints.
    id: 'imp97835-ladder-u-shaped',
    description: 'each eps-ladder has an interior minimum below both endpoints (truncation vs round-off U)',
    holds: () =>
      CROSSOVER.every((c) => {
        const errs = c.ladder.map((r) => r.absErr);
        const minErr = Math.min(...errs);
        return minErr < errs[0] && minErr < errs[errs.length - 1] && c.empiricalBottomEps < 1e-2 && c.empiricalBottomEps > 1e-8;
      }),
  },
  {
    // Honesty gate: measurement/characterization only, no QED, PT stays SOTA.
    id: 'imp97835-honesty-gate-no-qed',
    description: 'Measurement/characterization only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97835_DIAG3_ECF_CROSSOVER_EPS_SCALING.isRigorous === false &&
      /NO QED/.test(IMP97835_DIAG3_ECF_CROSSOVER_EPS_SCALING.verdict) &&
      /remains SOTA/.test(IMP97835_DIAG3_ECF_CROSSOVER_EPS_SCALING.verdict),
  },
];

for (const a of IMP97835_DIAG3_ECF_CROSSOVER_EPS_SCALING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97835-diag3-ecf-crossover-eps-scaling assertion failed: ${a.id}`);
  }
}
