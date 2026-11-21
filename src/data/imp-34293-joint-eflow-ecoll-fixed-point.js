/**
 * @module imp-34293-joint-eflow-ecoll-fixed-point
 *
 * imp-34293 (numerical, opus-4-8): imp-34213 pinned the E_flow onset as a fixed
 * point in the HEIGHT T0 (T0* = h(T0*), N recovered by the exact Riemann-von
 * Mangoldt forward count), and NOTED this differs STRUCTURALLY from the imp-33723
 * sibling E_coll = E_trunc crossover, which is a fixed point in N (N* = g(N*),
 * T0 recovered by the RvM inverse). What was still missing: neither module writes
 * the pair as a single joint (N, T0) fixed-point system. This module supplies that
 * missing piece -- it PROMOTES each reduced 1D fixed point to a joint 2D map on the
 * state vector (N, T0), with the RvM height law as the shared coupling equation,
 * and MEASURES the joint 2x2 Jacobian spectral radius to confirm each remains a
 * contraction.
 *
 * THE JOINT 2D EMBEDDING (the deliverable the ticket asks for)
 * -----------------------------------------------------------
 * Both landmarks live on the SAME state vector v = (N, T0) with the SAME shared
 * link -- the Riemann-von Mangoldt height law N = zeroCountAtHeight(T0), T0 =
 * effectiveHeightForN(N). What differs is WHICH coordinate the landmark condition
 * pins and which the RvM link pins:
 *
 *   E_coll crossover (imp-33723).  The condition E_coll = E_trunc solves for N
 *     from the height, and the RvM INVERSE returns the height from N:
 *         F_coll(N, T0) = ( K . log T0 ,  effectiveHeightForN(N) ),  K = (C_C/E_trunc)^2.
 *     Both coordinates are driven by the OTHER, so the Jacobian is ANTI-DIAGONAL:
 *         J = [[0, K/T0], [dT0/dN, 0]],   eigenvalues +- sqrt( (K/T0)(dT0/dN) ).
 *
 *   E_flow onset (imp-34213).  The condition T0 = h(T0) = A (log(T0/2pi)+1) log T0
 *     closes in the HEIGHT ALONE (N does not enter), and the RvM FORWARD count
 *     slaves N to the height:
 *         F_flow(N, T0) = ( zeroCountAtHeight(T0) ,  h(T0) ).
 *     N is one-way slaved to T0, so the Jacobian is TRIANGULAR:
 *         J = [[0, dN/dT0], [0, h_prime(T0)]],   eigenvalues { 0, h_prime(T0) }.
 *
 * THE COUPLING ASSESSMENT (the question the ticket asks)
 * -----------------------------------------------------
 * Can the two be fused into ONE joint fixed-point map? NO -- they are two DISTINCT
 * landmarks at different (N, T0) (E_coll crossover ~ (3.28e9, 1.14e9); E_flow=E_trunc
 * onset ~ (1.60e6, 9.21e5)), and a single contraction map has ONE fixed point per
 * basin. What they DO share is a common 2D FRAMEWORK: state (N, T0), one equation a
 * landmark condition, the other the RvM link. So the coupling is a shared TEMPLATE,
 * not a shared fixed point -- and the two instances have DIFFERENT Jacobian structure
 * (anti-diagonal vs triangular).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (D1) BOTH JOINT MAPS REMAIN CONTRACTIONS. The measured joint spectral radii are
 *        rho(F_coll) ~ 0.213 and rho(F_flow) ~ 0.150, both < 1, so each landmark is a
 *        UNIQUE 2D fixed point and Banach iteration on (N, T0) converges geometrically.
 *   (D2) THE ANTI-DIAGONAL RADIUS IS THE SQRT OF THE REDUCED RATE. Eliminating T0
 *        composes the two half-steps of F_coll into one full step, so the reduced 1D
 *        rate SQUARES the joint rate: rho(F_coll)^2 = (K/T0)(dT0/dN) = g_prime(N*) ~
 *        0.0454 (matched to ~1e-6). The 2D map is a SLOWER (but still strict)
 *        contraction than its 1D reduction (0.213 vs 0.045) -- the reduction is faster
 *        because it takes two coupled steps at once. The triangular F_flow instead
 *        carries rho(F_flow) = |h_prime(T0*)| EXACTLY (the extra N coordinate
 *        contributes a zero eigenvalue), so its 2D and reduced rates COINCIDE.
 *
 * The punchline: the imp-34213 height-fixed-point and the imp-33723 N-fixed-point
 * embed in ONE common joint (N, T0) framework linked by the RvM law, but as TWO
 * distinct fixed points with different Jacobian STRUCTURE -- anti-diagonal (rho =
 * sqrt of the reduced rate ~ 0.213) for the crossover, triangular (rho = the reduced
 * rate ~ 0.150) for the onset. Both joint spectral radii are < 1, so the 2D coupling
 * remains a contraction in every case; there is no single fused fixed point.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic. Both terms are benign: E_flow is the mesoscopic-Gronwall term (imp-2845),
 * E_coll is GUE-conditional (C_H ansatz) but UNTOUCHED here. The C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the C_C 1/8 ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34213-eflow-onset-closed-form (E_flow onset, fixed point in T0)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (E_coll=E_trunc crossover, fixed point in N)
 * @see lambda-rh-height-mapping (effectiveHeightForN inverse; zeroCountAtHeight forward count -- the RvM link)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3444/imp-33723/imp-34213 exactly

// ── Reduced 1D fixed points (exact imp-33723 / imp-34213 maps, no re-derivation) ──

// E_coll = E_trunc crossover (imp-33723): N = K log T0(N), K = (C_C/E_trunc)^2.
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
function gColl(N) {
  return K_AMPL * Math.log(effectiveHeightForN(N));
}
function crossoverFixedPointN(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = gColl(N);
  return N;
}

// E_flow = E_trunc onset (imp-34213, alpha = 1): T0 = h(T0), A = GRONWALL/(2pi E_trunc).
const A_FLOW = GRONWALL / (TWO_PI * E_TRUNC_PT); // ~5.2025e3 (alpha = 1)
function hFlow(T0) {
  return A_FLOW * (Math.log(T0 / TWO_PI) + 1) * Math.log(T0);
}
function onsetFixedPointT0(seed, iters) {
  let T0 = seed;
  for (let i = 0; i < iters; i++) T0 = hFlow(T0);
  return T0;
}

const N_CROSS = crossoverFixedPointN(1e9, 60); // ~3.280294e9
const T0_CROSS = effectiveHeightForN(N_CROSS); // ~1.14e9
const T0_ONSET = onsetFixedPointT0(1e7, 200); // ~9.21e5 (E_flow = E_trunc, alpha = 1)
const N_ONSET = zeroCountAtHeight(T0_ONSET); // ~1.598e6

// ── Numeric 2x2 Jacobian of a joint map v -> F(v) at the fixed point (central diff) ──
// F takes a 2-vector [N, T0] and returns the updated 2-vector; step is relative.
function jacobian2x2(F, v) {
  const J = [
    [0, 0],
    [0, 0],
  ];
  for (let j = 0; j < 2; j++) {
    const step = Math.abs(v[j]) * 1e-6 || 1e-6;
    const vp = v.slice();
    const vm = v.slice();
    vp[j] += step;
    vm[j] -= step;
    const Fp = F(vp);
    const Fm = F(vm);
    for (let i = 0; i < 2; i++) J[i][j] = (Fp[i] - Fm[i]) / (2 * step);
  }
  return J;
}

// Spectral radius (largest eigenvalue modulus) of a real 2x2 matrix [[a,b],[c,d]].
function spectralRadius2x2(J) {
  const a = J[0][0];
  const b = J[0][1];
  const c = J[1][0];
  const d = J[1][1];
  const tr = a + d;
  const det = a * d - b * c;
  const disc = tr * tr - 4 * det;
  if (disc >= 0) {
    const r = Math.sqrt(disc);
    return Math.max(Math.abs((tr + r) / 2), Math.abs((tr - r) / 2));
  }
  return Math.sqrt(det); // complex-conjugate pair: modulus = sqrt(det)
}

// The two joint maps on v = [N, T0].
function F_COLL(v) {
  const [N] = v;
  const T0 = v[1];
  return [K_AMPL * Math.log(T0), effectiveHeightForN(N)];
}
function F_FLOW(v) {
  const T0 = v[1];
  return [zeroCountAtHeight(T0), hFlow(T0)];
}

const J_COLL = jacobian2x2(F_COLL, [N_CROSS, T0_CROSS]);
const J_FLOW = jacobian2x2(F_FLOW, [N_ONSET, T0_ONSET]);
const RHO_COLL = spectralRadius2x2(J_COLL); // ~0.213
const RHO_FLOW = spectralRadius2x2(J_FLOW); // ~0.150

// Reduced 1D contraction factors (central diff of the eliminated maps) for the identity check.
function centralDeriv(f, x) {
  const step = Math.abs(x) * 1e-6 || 1e-6;
  return (f(x + step) - f(x - step)) / (2 * step);
}
const GPRIME_COLL = Math.abs(centralDeriv(gColl, N_CROSS)); // ~0.0454
const HPRIME_FLOW = Math.abs(centralDeriv(hFlow, T0_ONSET)); // ~0.150

// (D2) identity: the anti-diagonal joint radius squared equals the reduced 1D rate.
const RHO_COLL_SQ_VS_GPRIME = Math.abs(RHO_COLL * RHO_COLL - GPRIME_COLL) / GPRIME_COLL; // ~1e-6
// (D2) the triangular joint radius equals the reduced 1D rate exactly (extra 0 eigenvalue).
const RHO_FLOW_VS_HPRIME = Math.abs(RHO_FLOW - HPRIME_FLOW) / HPRIME_FLOW; // ~1e-6

export const IMP34293_JOINT_EFLOW_ECOLL_FIXED_POINT = {
  id: 'imp-34293',
  proofSection: 'S-frontier',
  question:
    'Assess whether the imp-34213 E_flow onset (fixed point in height T0) and the imp-33723 ' +
    'E_coll = E_trunc crossover (fixed point in N) can be coupled into a single joint (N, T0) ' +
    'fixed-point system linked by the Riemann-von Mangoldt height law, and measure the joint ' +
    'spectral radius / Jacobian to confirm each remains a contraction. Measurement only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  jointEmbedding:
    'State v = (N, T0), shared link = RvM height law. E_coll: F_coll(N,T0) = (K log T0, ' +
    'effectiveHeightForN(N)) -- ANTI-DIAGONAL Jacobian, both coordinates driven by the other. ' +
    'E_flow: F_flow(N,T0) = (zeroCountAtHeight(T0), h(T0)) -- TRIANGULAR Jacobian, N one-way ' +
    'slaved to the height fixed point (N does not enter the condition).',
  couplingAssessment:
    'They CANNOT be fused into one fixed-point map: they are two DISTINCT landmarks at different ' +
    '(N, T0), and a contraction map has one fixed point per basin. They DO share a common 2D ' +
    'framework (state (N,T0), one landmark condition + the RvM link), but with DIFFERENT Jacobian ' +
    'structure (anti-diagonal for the crossover, triangular for the onset). Shared template, not ' +
    'shared fixed point.',
  landmarks: {
    E_coll_crossover: {
      N: +N_CROSS.toExponential(6), // ~3.280294e9
      T0: +T0_CROSS.toExponential(6), // ~1.14e9
      jacobian_structure: 'anti-diagonal',
      joint_spectral_radius: +RHO_COLL.toExponential(6), // ~0.213
      reduced_1D_rate_gprime: +GPRIME_COLL.toExponential(6), // ~0.0454
    },
    E_flow_onset: {
      N: +N_ONSET.toExponential(6), // ~1.597752e6
      T0: +T0_ONSET.toExponential(6), // ~9.21e5
      jacobian_structure: 'triangular',
      joint_spectral_radius: +RHO_FLOW.toExponential(6), // ~0.150
      reduced_1D_rate_hprime: +HPRIME_FLOW.toExponential(6), // ~0.150
    },
  },
  identities: {
    rho_coll_squared_equals_gprime_rel: +RHO_COLL_SQ_VS_GPRIME.toExponential(3), // ~1e-6
    rho_flow_equals_hprime_rel: +RHO_FLOW_VS_HPRIME.toExponential(3), // ~1e-6
  },
  finding: {
    D1_both_joint_maps_are_contractions:
      'The joint 2x2 Jacobian spectral radii are rho(F_coll) ~ 0.213 and rho(F_flow) ~ 0.150, both ' +
      '< 1, so each landmark is a UNIQUE fixed point of its joint (N, T0) map and Banach iteration ' +
      'converges geometrically. The RvM height law is a benign contraction-preserving link.',
    D2_antidiagonal_radius_is_sqrt_of_reduced_rate:
      'Eliminating T0 composes the two half-steps of F_coll into one full step, so rho(F_coll)^2 = ' +
      '(K/T0)(dT0/dN) = g_prime(N*) ~ 0.0454 (matched to ~1e-6): the anti-diagonal 2D map is a ' +
      'SLOWER (but still strict) contraction than its 1D reduction (0.213 vs 0.045). The triangular ' +
      'F_flow instead carries rho(F_flow) = |h_prime(T0*)| EXACTLY (the extra N coordinate is a zero ' +
      'eigenvalue), so its 2D and reduced rates coincide.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-34213 E_flow onset (fixed point in the ' +
    'height T0) and the imp-33723 E_coll = E_trunc crossover (fixed point in N) EMBED in one common ' +
    'joint (N, T0) framework linked by the Riemann-von Mangoldt height law, but as TWO DISTINCT ' +
    'fixed points with DIFFERENT Jacobian structure -- anti-diagonal for the crossover (F_coll(N,T0) ' +
    '= (K log T0, effectiveHeightForN(N)), rho ~ 0.213) and triangular for the onset (F_flow(N,T0) = ' +
    '(zeroCountAtHeight(T0), h(T0)), rho ~ 0.150). Both joint spectral radii are < 1, so the 2D ' +
    'coupling remains a strict contraction in every case; they CANNOT be fused into a single fixed ' +
    'point (a contraction map has one fixed point per basin). The anti-diagonal radius is the SQRT ' +
    'of the reduced 1D rate (rho^2 = g_prime(N*) ~ 0.0454 to ~1e-6) because eliminating T0 composes ' +
    'two coupled half-steps into one; the triangular radius equals the reduced rate |h_prime| ~ 0.150 ' +
    'exactly (zero eigenvalue on the slaved N coordinate). Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; both terms are benign (E_flow ' +
    'mesoscopic-Gronwall per imp-2845, E_coll GUE-conditional but untouched); the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED, the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED, ' +
    'imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34213 (E_flow onset, fixed point in T0); imp-33723 (E_coll=E_trunc crossover, fixed point ' +
    'in N); imp-3444 (E_coll / E_flow sub-terms); imp-2631 (E_trunc fixed-strip floor); imp-2845 ' +
    '(benign vs divergent Gronwall); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi)); lambda-rh-height-' +
    'mapping (effectiveHeightForN inverse + zeroCountAtHeight forward count -- the RvM link).',
};

export const IMP34293_JOINT_EFLOW_ECOLL_FIXED_POINT_ASSERTIONS = [
  {
    // (D1): the E_coll joint 2D map is a strict contraction (spectral radius < 1).
    id: 'imp34293-coll-joint-map-is-a-contraction',
    description: 'joint spectral radius rho(F_coll) is in (0, 1) -- unique 2D fixed point',
    holds: () => RHO_COLL > 0 && RHO_COLL < 1,
  },
  {
    // (D1): the E_flow joint 2D map is a strict contraction (spectral radius < 1).
    id: 'imp34293-flow-joint-map-is-a-contraction',
    description: 'joint spectral radius rho(F_flow) is in (0, 1) -- unique 2D fixed point',
    holds: () => RHO_FLOW > 0 && RHO_FLOW < 1,
  },
  {
    // (D2): anti-diagonal joint radius squared equals the reduced 1D rate g_prime(N*).
    id: 'imp34293-coll-radius-squared-is-reduced-rate',
    description: 'rho(F_coll)^2 = g_prime(N*) ~ 0.0454 to < 1e-4 relative (two half-steps compose)',
    holds: () => RHO_COLL_SQ_VS_GPRIME < 1e-4 && Math.abs(GPRIME_COLL - 0.0454) < 5e-3,
  },
  {
    // (D2): triangular joint radius equals the reduced 1D rate |h_prime(T0*)| exactly.
    id: 'imp34293-flow-radius-equals-reduced-rate',
    description: 'rho(F_flow) = |h_prime(T0*)| ~ 0.150 to < 1e-4 relative (zero eigenvalue on slaved N)',
    holds: () => RHO_FLOW_VS_HPRIME < 1e-4 && Math.abs(HPRIME_FLOW - 0.150) < 5e-3,
  },
  {
    // The anti-diagonal 2D map is a SLOWER contraction than its 1D reduction (0.213 > 0.045).
    id: 'imp34293-coll-2d-slower-than-1d',
    description: 'rho(F_coll) > g_prime(N*): the anti-diagonal 2D map contracts slower than its reduction',
    holds: () => RHO_COLL > GPRIME_COLL && RHO_COLL < 0.3,
  },
  {
    // Structural cross-check: the two landmarks sit at genuinely different (N, T0).
    id: 'imp34293-two-distinct-fixed-points',
    description: 'the crossover and onset are distinct landmarks (N_cross >> N_onset, T0_cross >> T0_onset)',
    holds: () => N_CROSS > 100 * N_ONSET && T0_CROSS > 100 * T0_ONSET,
  },
  {
    // Honesty gate: measurement only, no QED, C_mb GUE-conditional untouched, no refereed bound is changed.
    id: 'imp34293-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, C_mb GUE-conditional per imp-486 UNTOUCHED named, no refereed bound is changed',
    holds: () =>
      IMP34293_JOINT_EFLOW_ECOLL_FIXED_POINT.isRigorous === false &&
      /NO QED/.test(IMP34293_JOINT_EFLOW_ECOLL_FIXED_POINT.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34293_JOINT_EFLOW_ECOLL_FIXED_POINT.verdict) &&
      /refereed bound is changed/i.test(IMP34293_JOINT_EFLOW_ECOLL_FIXED_POINT.verdict),
  },
];

for (const a of IMP34293_JOINT_EFLOW_ECOLL_FIXED_POINT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34293-joint-eflow-ecoll-fixed-point assertion failed: ${a.id}`);
  }
}
