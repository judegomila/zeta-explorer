/**
 * @module imp-124829-diag3-elasticity-kernel-ladder
 *
 * imp-124829 (accuracy, measurement/cross-validation): imp-124812 (finding B2) flags that the
 * three individual DIAG3 crossing elasticities E_CC/E_ET/E_CF are MEASUREMENT-ONLY -- each needs
 * the numerically located common kernel K = -1/(N_L sigma_N), only their SUM being kernel-free --
 * yet the prior modules report the trio at a SINGLE landmark (E_CC ~ +2.555 at L2, imp-97644) or
 * only across the short L2/L3/L4 rungs. Neither tabulated the trio AND the shared kernel K across
 * the full imp-97520 landmark ladder deep into the tail. This LIGHT standalone module supplies that
 * tie: it measures E_CC, E_ET, E_CF and K = -1/(N_L sigma_N) at every landmark level
 * {0.9, 0.5, 0.1, 0.02, 0.005, 0.001} (L2..L7) from the EXACT inherited imp-3406/imp-97644 sigma(N)
 * model (no new model, no new constants), confirms E_CC + E_ET + E_CF stays machine-zero at every
 * rung, cross-validates the closed-form trio against a direct central-difference elasticity, and
 * reports how the kernel K and the individual magnitudes scale as the landmark descends into the tail.
 *
 * THE ELASTICITY / KERNEL DECOMPOSITION (inherited imp-124812 closed forms)
 * -----------------------------------------------------------------------
 *   sigma(N; c, e, f) = E_coll / E_N,   E_N = e + E_flow + E_coll,
 *     E_coll = c * sqrt(log T0/N)  (numerator, c = C_C),  E_flow = f * C_F0 (log T0/T0) Gronwall,
 *     E_trunc = e = 3.06e-5 (fixed-strip).
 *   At a downslope crossing sigma(N_L) = level, implicit differentiation gives the crossing
 *   elasticity of each amplitude p as E_p = d ln N_L / d ln p = K * (p sigma_p), with the SHARED
 *   kernel K = -1/(N_L sigma_N) (sigma_N = d sigma/dN < 0 on the downslope, so K > 0). The three
 *   amplitude-weighted partials have the closed forms (imp-124812 (A)):
 *     c sigma_c = sigma(1 - sigma),   e sigma_e = -e sigma/E_N,   f sigma_f = -E_flow sigma/E_N,
 *   so E_CC = K sigma(1-sigma), E_ET = -K e sigma/E_N, E_CF = -K E_flow sigma/E_N. Their sum is
 *   K*(c sigma_c + e sigma_e + f sigma_f) = K*0 = 0 by the imp-97644/imp-97689 degree-0 homogeneity;
 *   only the SUM is kernel-free, the individual magnitudes carry the numerically located K -- exactly
 *   the imp-124812 B2 measurement-only boundary this leaf tabulates.
 *
 * THE LADDER (the deliverable) -- E_CC/E_ET/E_CF and K across L2..L7
 * -----------------------------------------------------------------
 *   LEVEL  N_L            K = -1/(N_L sigma_N)   E_CC        E_ET        E_CF           SUM3
 *   0.9    2.572361e7     +2.839283e1            +2.555354   -2.303723   -2.516313e-1   ~1e-15
 *   0.5    3.267235e9     +8.409389e0            +2.102347   -2.098348   -3.998879e-3   ~6e-16
 *   0.1    3.213181e11    +2.310027e1            +2.079025   -2.078951   -7.377777e-5   ~3e-16
 *   0.02   1.079935e13    +1.055954e2            +2.069669   -2.069666   -3.245644e-6   ~2e-16
 *   0.005  1.955164e14    +4.147756e2            +2.063508   -2.063508   -2.393499e-7   ~3e-16
 *   0.001  5.432330e15    +2.059697e3            +2.057637   -2.057637   -1.164735e-8   ~3e-16
 *
 * HOW K AND THE MAGNITUDES SCALE INTO THE TAIL
 * --------------------------------------------
 *   - K is NON-monotone across the whole ladder: it DIPS to its minimum (~8.41) at the halving L3
 *     (near the inflection where |sigma_N| is largest relative to N_L) and then GROWS without bound
 *     into the tail. Deep in the tail (levels <= 0.1) K grows by a per-decade factor approaching ~5
 *     as the level drops by a factor ~5 per rung: K ~ const/sigma, i.e. K*sigma tends to the common
 *     limit ~2.06 (=2.310, 2.112, 2.074, 2.060 at 0.1/0.02/0.005/0.001).
 *   - E_CC and -E_ET both converge to a COMMON deep-tail limit ~2.057: as sigma -> 0 the collision
 *     numerator vanishes (E_coll = sigma E_N -> 0), E_N -> E_trunc, so E_CC = K sigma(1-sigma) and
 *     -E_ET = K e sigma/E_N become equal, and E_CF = -K E_flow sigma/E_N -> 0 with the flow share
 *     (E_flow/E_N falls 9.85e-3 -> 5.65e-9 across the ladder). The trio therefore collapses to an
 *     equal-and-opposite C_C/E_trunc pair in the tail, with E_CF the vanishing third leg that closes
 *     the sum to zero.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic on the inherited imp-3220/imp-3406
 * surrogate component model, NOT a rigorous asymptotic; the pinned constants (C_C 1/8 ansatz
 * imp-2642/imp-2643, E_trunc 3.06e-5, imp-398 C_F prefactor) appear only as symbolic differentiation
 * axes, not re-pinned; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124812-diag3-additivity-exact-identity-assessment (closed-form partials + B2 boundary)
 * @see imp-97644-three-axis-additivity-flow-prefactor (E_CC/E_ET/E_CF at L2/L3/L4; DIAG3 == 0)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the sigma(N) landmark ladder + crossing)
 * @see imp-97823-kernel-decade-growth-sqrt10 (kernel per-decade growth on the two peak arms)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-124812 exactly

// EXACT imp-3406/imp-97644/imp-124812 sub-terms (no re-derivation, no fresh model). cc/et/cf are the
// three perturbable amplitudes (baseline C_C_PINNED / E_TRUNC_PT / 1.0), used only as probes.
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll, et };
}

// Downslope crossing sigma = level (identical bisection to imp-97644, widened to 1e30 for the tail).
function landmark(level, cc, et, cf) {
  let a = Math.log(1e5);
  let b = Math.log(1e30);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// The shared kernel K = -1/(N_L sigma_N) from a central difference of sigma in N (relative step 1e-6).
function kernelAt(N) {
  const rel = 1e-6;
  const dN = N * rel;
  const sp = parts(N + dN, C_C_PINNED, E_TRUNC_PT, 1.0).sigma;
  const sm = parts(N - dN, C_C_PINNED, E_TRUNC_PT, 1.0).sigma;
  const sigmaN = (sp - sm) / (2 * dN); // d sigma/dN < 0 on the downslope
  return -1 / (N * sigmaN); // > 0
}

// Direct central-difference crossing elasticity (imp-97644 method) -- cross-checks the closed forms.
const lnN = (level, cc, et, cf) => Math.log(landmark(level, cc, et, cf));
function directElasticities(level, eps) {
  const at = (dCC, dEt, dCF) =>
    lnN(level, C_C_PINNED * Math.exp(dCC), E_TRUNC_PT * Math.exp(dEt), 1.0 * Math.exp(dCF));
  return {
    E_CC: (at(eps, 0, 0) - at(-eps, 0, 0)) / (2 * eps),
    E_ET: (at(0, eps, 0) - at(0, -eps, 0)) / (2 * eps),
    E_CF: (at(0, 0, eps) - at(0, 0, -eps)) / (2 * eps),
  };
}

// L2..L7: the imp-97520 landmark ladder extended into the tail.
const LEVELS = [0.9, 0.5, 0.1, 0.02, 0.005, 0.001];
const EPS = 1e-3; // matches imp-97644 central-difference step

let prevK = null;
const PER_LANDMARK = LEVELS.map((level, i) => {
  const N_L = landmark(level, C_C_PINNED, E_TRUNC_PT, 1.0);
  const p = parts(N_L, C_C_PINNED, E_TRUNC_PT, 1.0);
  const K = kernelAt(N_L);
  // Closed-form amplitude-weighted partials -> elasticities via the shared kernel K.
  const csc = p.sigma * (1 - p.sigma); // c sigma_c
  const ese = -p.et * p.sigma / p.E_N; // e sigma_e
  const fsf = -p.E_flow * p.sigma / p.E_N; // f sigma_f
  const E_CC = K * csc;
  const E_ET = K * ese;
  const E_CF = K * fsf;
  const SUM3 = E_CC + E_ET + E_CF; // kernel-free zero (K * 0)
  const d = directElasticities(level, EPS); // independent cross-check
  const kRatio = prevK !== null ? K / prevK : null;
  prevK = K;
  return {
    level,
    N_L: +N_L.toExponential(6),
    sigma: +p.sigma.toFixed(8),
    flow_share_of_E_N: +(p.E_flow / p.E_N).toExponential(4),
    kernel_K: +K.toExponential(6), // = -1/(N_L sigma_N), > 0
    K_ratio_over_prev: kRatio === null ? null : +kRatio.toFixed(4),
    K_times_sigma: +(K * level).toFixed(6), // -> ~2.06 deep-tail limit
    elasticity_CC: +E_CC.toFixed(6),
    elasticity_Et: +E_ET.toFixed(6),
    elasticity_CF: +E_CF.toExponential(6),
    sum_three_axis: +SUM3.toExponential(3), // machine-zero at every rung
    closed_vs_direct_reldiff_CC: +Math.abs(E_CC / d.E_CC - 1).toExponential(3),
    closed_vs_direct_reldiff_Et: +Math.abs(E_ET / d.E_ET - 1).toExponential(3),
  };
});

const MAX_SUM3 = Math.max(...PER_LANDMARK.map((r) => Math.abs(r.sum_three_axis)));
const MAX_XCHECK = Math.max(
  ...PER_LANDMARK.map((r) => Math.max(r.closed_vs_direct_reldiff_CC, r.closed_vs_direct_reldiff_Et)),
);
const TAIL = PER_LANDMARK[PER_LANDMARK.length - 1]; // level 0.001

export const IMP124829_DIAG3_ELASTICITY_KERNEL_LADDER = {
  id: 'imp-124829',
  proofSection: 'S-frontier',
  title:
    'Tabulate the three individual DIAG3 crossing elasticities E_CC/E_ET/E_CF and the shared kernel ' +
    'K = -1/(N_L sigma_N) across the imp-97520 landmark ladder L2..L7 {0.9,0.5,0.1,0.02,0.005,0.001}',
  isRigorous: false,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
  question:
    'imp-124812 (B2) flags the individual DIAG3 elasticities E_CC/E_ET/E_CF as measurement-only -- each ' +
    'needs the numerically located kernel K = -1/(N_L sigma_N), only their sum being kernel-free -- but ' +
    'the trio is reported at a single landmark and never tabulated with K across the ladder. Measure ' +
    'E_CC, E_ET, E_CF and K at every level {0.9,0.5,0.1,0.02,0.005,0.001}, confirm the sum stays ' +
    'machine-zero at every rung, and report how K and the individual magnitudes scale into the tail. ' +
    'Measurement/cross-validation only; pinned constants as symbolic axes; changes no bound; no QED.',
  method:
    'From the exact inherited imp-3406/imp-124812 sigma(N) = E_coll/E_N model, locate each downslope ' +
    'crossing sigma(N_L) = level by bisection, compute the shared kernel K = -1/(N_L sigma_N) from a ' +
    'central difference of sigma in N, and form the elasticities via the imp-124812 closed forms ' +
    'E_CC = K sigma(1-sigma), E_ET = -K e sigma/E_N, E_CF = -K E_flow sigma/E_N. Cross-validate the trio ' +
    'against a direct central-difference elasticity (imp-97644 method) and confirm E_CC + E_ET + E_CF is ' +
    'machine-zero at every rung.',
  levels: LEVELS,
  perLandmark: PER_LANDMARK,
  max_abs_sum_three_axis: +MAX_SUM3.toExponential(3),
  max_closed_vs_direct_reldiff: +MAX_XCHECK.toExponential(3),
  finding: {
    trio_and_kernel_tabulated:
      'E_CC/E_ET/E_CF and K = -1/(N_L sigma_N) are tabulated across L2..L7. K > 0 at every rung ' +
      '(downslope sigma_N < 0); E_CC = +2.555 -> +2.058, -E_ET = +2.304 -> +2.058, and E_CF (the flow ' +
      'leg) shrinks -2.516e-1 -> -1.165e-8 as the flow share of E_N falls 9.85e-3 -> 5.65e-9.',
    sum_is_kernel_free_zero:
      'E_CC + E_ET + E_CF stays below ' + MAX_SUM3.toExponential(3) + ' (IEEE round-off) at every rung: ' +
      'the sum is K*(c sigma_c + e sigma_e + f sigma_f) = K*0, kernel-free by the imp-97644/imp-97689 ' +
      'degree-0 homogeneity, while each individual magnitude carries the numerically located K (the ' +
      'imp-124812 B2 measurement-only boundary).',
    kernel_scaling:
      'K is NON-monotone: it dips to a minimum ~8.41 at the halving L3 then grows without bound into the ' +
      'tail as K ~ const/sigma (K*sigma -> the common limit ~2.06). The individual C_C and E_trunc ' +
      'elasticities converge to a common deep-tail value ~2.057 (equal-and-opposite) as E_CF -> 0.',
    cross_validation:
      'The closed-form trio matches a direct central-difference elasticity to ' +
      MAX_XCHECK.toExponential(3) + ' relative across the whole ladder.',
  },
  verdict:
    'MEASUREMENT / CROSS-VALIDATION (frontier tabulation, NOT rigorous). The three individual DIAG3 ' +
    'crossing elasticities E_CC/E_ET/E_CF and the shared kernel K = -1/(N_L sigma_N) are tabulated across ' +
    'the imp-97520 landmark ladder L2..L7 {0.9,0.5,0.1,0.02,0.005,0.001}: K > 0 at every rung (downslope ' +
    'sigma_N < 0), E_CC = +2.555 -> +2.058 and -E_ET = +2.304 -> +2.058 converge to a common deep-tail ' +
    'value ~2.057 while the flow leg E_CF shrinks -2.516e-1 -> -1.165e-8 with the vanishing flow share ' +
    '(E_flow/E_N: 9.85e-3 -> 5.65e-9). The sum E_CC + E_ET + E_CF stays below ' + MAX_SUM3.toExponential(3) +
    ' (IEEE round-off) at every rung -- kernel-free zero by the imp-97644/imp-97689 degree-0 homogeneity, ' +
    'while each individual magnitude carries the numerically located K (the imp-124812 B2 measurement-only ' +
    'boundary). K is NON-monotone: it dips to a minimum ~8.41 at the halving L3, then grows without bound ' +
    'into the tail as K ~ const/sigma (K*sigma -> ~2.06). The closed-form trio matches a direct ' +
    'central-difference elasticity to ' + MAX_XCHECK.toExponential(3) + ' relative. Conditional-share ' +
    'diagnostic on the inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; the pinned ' +
    'constants (C_C 1/8 ansatz, E_trunc 3.06e-5, imp-398 C_F prefactor) appear only as symbolic ' +
    'differentiation axes, not re-pinned; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-124812 (closed-form partials + B2 measurement-only boundary); imp-97644 (E_CC/E_ET/E_CF at ' +
    'L2/L3/L4; DIAG3 == 0 scaling symmetry); imp-97689 (three-axis Euler additivity); imp-97520 (sigma(N) ' +
    'landmark ladder + crossing procedure); imp-97823 (kernel per-decade growth); imp-398 (C_F flow ' +
    'prefactor); imp-2642/imp-2643 (C_C 1/8 ansatz); imp-2631 (E_trunc fixed-strip); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124829_DIAG3_ELASTICITY_KERNEL_LADDER_ASSERTIONS = [
  {
    // Landmarks reproduce the imp-97520/imp-97644 L2/L3/L4 ladder positions with the tail extended.
    id: 'imp124829-landmarks-reproduce-ladder',
    description: 'L2 ~2.572361e7, L3 ~3.267235e9, L4 ~3.213181e11 reproduce imp-97644 to < 5e-3 relative',
    holds: () => {
      const [l2, l3, l4] = PER_LANDMARK;
      return (
        Math.abs(l2.N_L / 2.572361e7 - 1) < 5e-3 &&
        Math.abs(l3.N_L / 3.267235e9 - 1) < 5e-3 &&
        Math.abs(l4.N_L / 3.213181e11 - 1) < 5e-3
      );
    },
  },
  {
    // Tail landmarks are strictly increasing in N across the full L2..L7 ladder.
    id: 'imp124829-ladder-strictly-increasing',
    description: 'the six landmarks L2..L7 are strictly increasing in N',
    holds: () => PER_LANDMARK.every((r, i) => i === 0 || r.N_L > PER_LANDMARK[i - 1].N_L),
  },
  {
    // The shared kernel K = -1/(N_L sigma_N) is positive at every rung (downslope sigma_N < 0).
    id: 'imp124829-kernel-positive',
    description: 'K = -1/(N_L sigma_N) > 0 at every landmark (downslope crossing)',
    holds: () => PER_LANDMARK.every((r) => r.kernel_K > 0),
  },
  {
    // The trio sums to a kernel-free machine-zero at every rung (only the SUM is kernel-free).
    id: 'imp124829-sum-three-axis-machine-zero',
    description: 'E_CC + E_ET + E_CF < 1e-12 at every level {0.9..0.001}',
    holds: () => PER_LANDMARK.every((r) => Math.abs(r.sum_three_axis) < 1e-12),
  },
  {
    // The closed-form trio matches a direct central-difference elasticity (validates the closed forms).
    id: 'imp124829-closed-form-matches-direct',
    description: 'closed-form E_CC and E_ET match a direct central-difference elasticity to < 1e-5 relative',
    holds: () =>
      PER_LANDMARK.every(
        (r) => r.closed_vs_direct_reldiff_CC < 1e-5 && r.closed_vs_direct_reldiff_Et < 1e-5,
      ),
  },
  {
    // Kernel is non-monotone: dips to its minimum at the halving L3, then grows into the tail.
    id: 'imp124829-kernel-nonmonotone-dip-at-halving',
    description: 'K reaches its ladder minimum at the halving level 0.5, then grows toward the tail',
    holds: () => {
      const Ks = PER_LANDMARK.map((r) => r.kernel_K);
      const minIdx = Ks.indexOf(Math.min(...Ks));
      return PER_LANDMARK[minIdx].level === 0.5 && Ks[Ks.length - 1] > Ks[minIdx];
    },
  },
  {
    // Deep-tail collapse: C_C and E_trunc elasticities become equal-and-opposite as E_CF -> 0.
    id: 'imp124829-tail-cc-et-equal-and-opposite',
    description: 'at level 0.001, E_CC ~ -E_ET (to < 1e-3) and |E_CF| < 1e-6 (flow leg vanishes)',
    holds: () =>
      Math.abs(TAIL.elasticity_CC + TAIL.elasticity_Et) < 1e-3 &&
      Math.abs(TAIL.elasticity_CF) < 1e-6,
  },
  {
    // K ~ const/sigma into the tail: K*sigma converges toward the common ~2.06 limit.
    id: 'imp124829-kernel-times-sigma-tail-limit',
    description: 'K*sigma at level 0.001 sits near the ~2.06 deep-tail limit (K ~ const/sigma)',
    holds: () => Math.abs(TAIL.K_times_sigma - 2.06) < 0.05,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp124829-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no operator positivity, no bound moves, qed false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124829_DIAG3_ELASTICITY_KERNEL_LADDER.isRigorous === false &&
      IMP124829_DIAG3_ELASTICITY_KERNEL_LADDER.operatorPositivityProved === false &&
      IMP124829_DIAG3_ELASTICITY_KERNEL_LADDER.boundMoves === false &&
      IMP124829_DIAG3_ELASTICITY_KERNEL_LADDER.qed === false &&
      /NO QED/.test(IMP124829_DIAG3_ELASTICITY_KERNEL_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP124829_DIAG3_ELASTICITY_KERNEL_LADDER.verdict),
  },
];

for (const a of IMP124829_DIAG3_ELASTICITY_KERNEL_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124829-diag3-elasticity-kernel-ladder assertion failed: ${a.id}`);
  }
}
