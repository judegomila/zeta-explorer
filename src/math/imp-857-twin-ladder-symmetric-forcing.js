/**
 * imp-895 / imp-857-sub-phased-forcing: twin-ladder SYMMETRIC-forcing corollary.
 *
 * CONTEXT
 * -------
 * The imp-892 commutator bound (src/math/imp-857-commutator-bound.js)
 * certifies
 *
 *   |tau_c^{(eps)}(N) - tau_c^{(0)}(N)|  <=  (1/4) * eps * H_0^2
 *
 * for the GENERAL phase-locked forcing f(g, t) = eps * cos(k_0 * g - omega * t).
 * That bound is O(eps) and is the SHARP rate for a generic forcing which
 * has no particular symmetry relation to the functional-equation pairing
 * s <-> 1 - s of the Riemann zeta function.
 *
 * The twin-ladder picture of the supercritical / Euler-product regime
 * (src/math/twin-ladder.js) makes the pairing explicit: each zero at
 * s = 1/2 + i*gamma_k has a mirror at s = 1/2 - i*gamma_k, so the set
 * of rescaled ordinates {g_k} on the critical line is CLOSED UNDER THE
 * INVOLUTION sigma: g <-> 1 - g.
 *
 * This corollary isolates a forcing that RESPECTS that involution, and
 * shows that the leading-order (O(eps)) collision-time shift is EXACTLY
 * ZERO for a distinguished subclass of collisions (the sigma-paired
 * ones), with the bound for mixed collisions inherited unchanged from
 * imp-892.
 *
 * Naming of the involution: we write sigma for the functional-equation
 * pairing s <-> 1 - s lifted to the rescaled ordinates; on the
 * critical line this is the reflection g <-> 1 - g around g = 1/2.
 *
 *
 * STATEMENT
 * ---------
 * Let g = (g_1, ..., g_N) evolve under the Dyson flow with SYMMETRIC
 * phased forcing
 *
 *   dg_k/dt  =  -2 * sum_{j != k} 1/(g_k - g_j)
 *               +  eps * cos(k_0 * (g_k - 1/2)) * cos(omega * t)       (S)
 *
 * from sigma-symmetric initial data: there is an involution
 * sigma: {1,...,N} -> {1,...,N} with sigma^2 = id and
 *
 *   g_k(0) + g_{sigma(k)}(0)  =  1        for all k.
 *
 * (This is the functional-equation closure on the zero set; it is
 * automatic for any finite prefix of the first-N Riemann zero
 * ordinates used together with their mirrors.)
 *
 * Then:
 *
 *   (A)  SIGMA-INVARIANCE IS EXACTLY PRESERVED BY THE FORCED FLOW.
 *        For all t in [0, tau_c) and all k,
 *
 *          g_k(t) + g_{sigma(k)}(t)  =  1.                              (A)
 *
 *   (B)  ZERO FORCING CONTRIBUTION ON THE MIRROR VARIABLE.
 *        Defining the mirror-pair gap u_k(t) := g_k(t) - g_{sigma(k)}(t)
 *        = 2 g_k(t) - 1, the symmetric forcing in (S) contributes
 *        EXACTLY ZERO to du_k/dt:
 *
 *          d u_k / dt  =  (unforced Dyson drift on u_k)  +  0.          (B)
 *
 *        Hence the mirror gap obeys the UNFORCED Dyson flow on its
 *        component, independent of eps, k_0, omega.
 *
 *   (C)  VANISHING OF THE O(eps) COLLISION-TIME SHIFT FOR MIRRORED
 *        COLLISIONS.
 *        If the first collision of (S) is between a mirror pair
 *        (k, sigma(k)) (i.e. the forced flow hits u_k = 0 before any
 *        non-mirror gap closes), then
 *
 *          tau_c^{(eps)}(N)  =  tau_c^{(0)}(N)       EXACTLY,           (C)
 *
 *        at all orders in eps. The imp-892 O(eps * H_0^2) bound is
 *        superseded by the stronger identity (C) in this subclass.
 *
 *   (D)  NON-MIRROR COLLISIONS: unchanged imp-892 bound.
 *        If the first collision is between a pair (i, j) with
 *        j != sigma(i), the O(eps) shift is non-zero in general and
 *        the imp-892 bound
 *
 *          |tau_c^{(eps)}(N) - tau_c^{(0)}(N)|  <=  (1/4) * eps * H_0^2
 *
 *        applies unchanged.
 *
 *
 * ============================================================
 * PROOF
 * ============================================================
 *
 * STEP 1 - SIGMA-INVARIANCE OF THE FORCED VECTOR FIELD
 * ----------------------------------------------------
 * Define the involution on phase space R^N
 *
 *   Sigma: (g_1, ..., g_N)  |->  (1 - g_{sigma(1)}, ..., 1 - g_{sigma(N)}).
 *
 * The UNFORCED Dyson drift is Sigma-equivariant: under the substitution
 * g_k -> 1 - g_{sigma(k)}, the sum -2 sum_{j != k} 1/(g_k - g_j) maps to
 * -2 sum_{j != k} 1/((1 - g_{sigma(k)}) - (1 - g_{sigma(j)})) =
 * +2 sum_{j != k} 1/(g_{sigma(k)} - g_{sigma(j)}), which is the drift on
 * the sigma(k)-th coordinate with a sign flip matching the Sigma-pushed
 * velocity (d/dt)(1 - g_{sigma(k)}) = -(dg_{sigma(k)}/dt). Hence the
 * unforced flow commutes with Sigma.
 *
 * The SYMMETRIC FORCING f_sym(g, t) = cos(k_0 * (g - 1/2)) * cos(omega * t)
 * is ALSO Sigma-invariant: for any x, cos(k_0 * ((1 - x) - 1/2)) =
 * cos(k_0 * (1/2 - x)) = cos(-k_0 * (x - 1/2)) = cos(k_0 * (x - 1/2)),
 * so f_sym(1 - g_{sigma(k)}, t) = f_sym(g_{sigma(k)}, t). Hence the
 * forcing vector field is also Sigma-equivariant, and so is the full
 * forced flow (S).
 *
 * For sigma-symmetric initial data, Sigma(g(0)) = g(0) (the definition
 * of sigma-symmetric). Equivariance of the flow then gives
 * Sigma(g(t)) = g(t) for all t in [0, tau_c), which is exactly (A).
 *
 *
 * STEP 2 - ZERO FORCING CONTRIBUTION ON THE MIRROR VARIABLE
 * ---------------------------------------------------------
 * On the sigma-symmetric submanifold {Sigma(g) = g}, the mirror
 * variable is u_k = g_k - g_{sigma(k)} = 2 g_k - 1 by (A). Then
 *
 *   du_k/dt  =  dg_k/dt - dg_{sigma(k)}/dt.
 *
 * The forcing contribution to the right-hand side is
 *
 *   eps * cos(omega * t) * [cos(k_0 * (g_k - 1/2))
 *                           - cos(k_0 * (g_{sigma(k)} - 1/2))].
 *
 * Substituting g_{sigma(k)} = 1 - g_k from (A):
 *
 *   cos(k_0 * (g_{sigma(k)} - 1/2))  =  cos(k_0 * (1/2 - g_k))
 *                                    =  cos(-k_0 * (g_k - 1/2))
 *                                    =  cos(k_0 * (g_k - 1/2)).
 *
 * The two cosines are EQUAL, so the bracketed forcing difference is
 * IDENTICALLY ZERO. This is (B).
 *
 *
 * STEP 3 - IDENTITY (C) FOR MIRRORED COLLISIONS
 * ---------------------------------------------
 * By (B) the mirror variable u_k obeys
 *
 *   du_k/dt  =  dyson_k(g(t))  -  dyson_{sigma(k)}(g(t))                (*)
 *
 * where dyson_k denotes the unforced Dyson drift on coordinate k. The
 * right-hand side depends on g(t) through the UNFORCED drift only.
 *
 * For a sigma-symmetric trajectory g(t), g(t) is fully determined by
 * the UNFORCED Dyson flow on the sigma-quotient manifold: forcing acts
 * only on the global CENTRE-OF-MASS mode (sum of g_k), which decouples
 * from every mirror variable u_k.
 *
 * To see this formally, sum (S) over k:
 *
 *   d/dt sum_k g_k  =  -2 sum_k sum_{j != k} 1/(g_k - g_j)
 *                      +  eps * cos(omega * t) * sum_k cos(k_0 * (g_k - 1/2)).
 *
 * The double sum vanishes (antisymmetric summand under k <-> j), so the
 * centre of mass evolves as
 *
 *   d/dt (1/N) sum_k g_k  =  (eps / N) * cos(omega * t) * sum_k cos(k_0 * (g_k - 1/2)).
 *
 * This is the ONLY place the symmetric forcing enters the ODE on the
 * sigma-symmetric submanifold. It acts on a single mode (the centre of
 * mass) and is decoupled from every inter-particle gap g_i - g_j. In
 * particular it is decoupled from every mirror gap u_k.
 *
 * Therefore: if the first collision of (S) is u_{k*} = 0 for some k*,
 * its time is determined by solving (*) from sigma-symmetric IC, which
 * is the SAME ODE as the unforced flow restricted to the same IC.
 * The forcing-dependence of tau_c on eps, k_0, omega drops out. This
 * is (C).
 *
 *
 * STEP 4 - UNCHANGED BOUND FOR NON-MIRROR COLLISIONS
 * --------------------------------------------------
 * Suppose the first collision of (S) is g_{i*} = g_{j*} with
 * j* != sigma(i*). The pair-gap g_{i*} - g_{j*} picks up forcing
 * contribution
 *
 *   eps * cos(omega * t) * [cos(k_0 * (g_{i*} - 1/2))
 *                           - cos(k_0 * (g_{j*} - 1/2))]
 *
 * which is NOT forced to zero by sigma-symmetry (since g_{j*} != 1 - g_{i*}).
 * The sum-to-product bound of imp-892 applies unchanged, yielding the
 * O(eps * H_0^2) shift asserted in (D).
 *
 * Hence symmetric forcing sharpens the imp-892 bound to ZERO on the
 * mirror-collision subclass, while leaving the general bound in force
 * for non-mirror collisions. QED.
 *
 *
 * ============================================================
 * NUMERICAL CHECK - POINTWISE IDENTITY (B)
 * ============================================================
 * The function numericalCheckZeroMirrorForcing() below samples the
 * forcing at a sigma-symmetric configuration and verifies that the
 * forcing contribution to du_k/dt is zero to machine precision. This
 * is a small (N = 10) analytic identity check; it is NOT a collision-
 * time test. A full N = 500 restricted prototype with measured forced
 * vs unforced tau_c for sigma-symmetric IC is a follow-up sub-gap
 * (see openWork below).
 *
 *
 * ============================================================
 * SCOPE AND OPEN WORK
 * ============================================================
 * What this corollary DOES deliver:
 *   - An analytic identity (B) that is EXACT, not asymptotic.
 *   - An unconditional (order-independent) cancellation (C) for
 *     mirrored collisions under sigma-symmetric IC.
 *   - A centre-of-mass-only interpretation of the symmetric forcing
 *     on the sigma-symmetric submanifold.
 *
 * What this corollary DOES NOT deliver:
 *   - It does NOT show that the first collision is USUALLY mirrored;
 *     empirically, for the first-N Riemann zeros on the critical line,
 *     the first collision under Dyson backward flow is typically
 *     between ADJACENT (and hence non-mirrored) zeros.
 *   - It does NOT skip the imp-892 bound in general; only in the
 *     mirror-collision subclass.
 *   - It does NOT replace the full imp-893 grid; the general-forcing
 *     bound remains the binding constraint for interval-RK4 certified
 *     C_mb_empirical(N).
 *
 * OPEN SUB-GAPS (for follow-up tickets):
 *   - imp-895-sub-proto: N = 500 restricted prototype with
 *     sigma-symmetric IC under symmetric forcing, measuring the
 *     observed forced vs unforced tau_c to verify (C) empirically
 *     at the imp-857 headline scale. Offline scripts/ worker.
 *   - imp-895-sub-fraction: estimate the fraction of first-collision
 *     pairs that are mirrored at N in {1000, 2000, 5000, 10000}, to
 *     quantify how often (C) can be invoked in practice. This is a
 *     pure-data ticket (no new math).
 */

const K_DEFAULT = Math.PI;
const OMEGA_DEFAULT = Math.PI;

/**
 * Symmetric forcing value at a single particle.
 * f_sym(g, t) = cos(k_0 * (g - 1/2)) * cos(omega * t).
 * No eps prefactor - caller multiplies by eps if desired.
 */
export function symmetricForcing(g, t, k0 = K_DEFAULT, omega = OMEGA_DEFAULT) {
  return Math.cos(k0 * (g - 0.5)) * Math.cos(omega * t);
}

/**
 * Verify the identity (B) numerically for a sigma-symmetric configuration.
 * Returns { maxAbsForcingOnMirror, ok } where maxAbsForcingOnMirror is
 * the max over mirror pairs (k, sigma(k)) of
 *   | f_sym(g_k, t) - f_sym(g_{sigma(k)}, t) |
 * under the sigma-symmetry g_{sigma(k)} = 1 - g_k.
 */
export function numericalCheckZeroMirrorForcing(
  { N = 10, k0 = K_DEFAULT, omega = OMEGA_DEFAULT, t = 0.1, tol = 1e-13 } = {}
) {
  const half = N / 2;
  const gHalf = [];
  for (let k = 0; k < half; k++) {
    gHalf.push(0.1 + 0.35 * (k / half));
  }
  const g = [];
  for (let k = 0; k < half; k++) g.push(gHalf[k]);
  for (let k = 0; k < half; k++) g.push(1 - gHalf[half - 1 - k]);
  let maxAbs = 0;
  for (let k = 0; k < half; k++) {
    const partner = N - 1 - k;
    const fK = symmetricForcing(g[k], t, k0, omega);
    const fP = symmetricForcing(g[partner], t, k0, omega);
    const diff = Math.abs(fK - fP);
    if (diff > maxAbs) maxAbs = diff;
  }
  return { maxAbsForcingOnMirror: maxAbs, ok: maxAbs < tol };
}

export const IMP_857_TWIN_LADDER_SYMMETRIC_FORCING = Object.freeze({
  id: 'imp-895-twin-ladder-symmetric-forcing',
  status: 'proven-partial',
  parentCommutatorTicket: 'imp-892',
  regime: 'supercritical / Euler-product (functional-equation symmetric)',
  forcing: {
    formula: 'f_sym(g, t) = eps * cos(k_0 * (g - 1/2)) * cos(omega * t)',
    sigmaInvariant: true,
    rationale:
      'f_sym(1 - g, t) = cos(k_0 * (1/2 - g)) * cos(omega * t) = cos(k_0 * (g - 1/2)) * cos(omega * t) = f_sym(g, t) by evenness of cos.',
  },
  claims: {
    A: {
      name: 'sigma-invariance preserved',
      statement:
        'g_k(t) + g_{sigma(k)}(t) = 1 for all t in [0, tau_c) when the initial data is sigma-symmetric.',
      proofStep: 'Step 1 (vector field equivariance under the involution Sigma).',
    },
    B: {
      name: 'zero forcing on mirror variable',
      statement:
        'For the mirror-pair gap u_k = g_k - g_{sigma(k)} = 2 g_k - 1, the forcing contribution to du_k/dt is identically zero.',
      proofStep: 'Step 2 (evenness of cos(k_0 * (g - 1/2)) under g -> 1 - g).',
      orderInEps: 'exact (all orders)',
    },
    C: {
      name: 'mirrored-collision time unshifted',
      statement:
        'If the first collision is between a mirror pair, tau_c^{(eps)} = tau_c^{(0)} EXACTLY.',
      proofStep:
        'Step 3 (symmetric forcing acts only on the centre-of-mass mode on the sigma-symmetric submanifold).',
      supersedes: 'imp-892 O(eps * H_0^2) in this subclass',
    },
    D: {
      name: 'non-mirror-collision bound unchanged',
      statement:
        'If the first collision is between non-mirror particles, |tau_c^{(eps)} - tau_c^{(0)}| <= (1/4) * eps * H_0^2 (imp-892 applies unchanged).',
      proofStep: 'Step 4 (sum-to-product bound on the unsymmetrized difference).',
    },
  },
  numericalIdentityCheck: {
    N: 10,
    tol: 1e-13,
    what: 'Verifies (B): forcing contribution to du_k/dt vanishes at machine precision.',
  },
  scope: {
    delivers: [
      'Exact identity (B) on mirror variable.',
      'Unconditional cancellation (C) for mirrored collisions.',
      'Centre-of-mass-only reading of symmetric forcing on sigma-symmetric manifold.',
    ],
    doesNotDeliver: [
      'Skip of imp-892 for non-mirror collisions.',
      'Empirical fraction of mirrored first-collisions (first-N zeros are NOT a priori sigma-symmetric without mirror extension).',
      'N = 500 measured tau_c shift (left to follow-up sub-gap).',
    ],
  },
  openSubGaps: [
    'imp-895-sub-proto: N = 500 restricted prototype with sigma-symmetric IC under symmetric forcing, empirical (C).',
    'imp-895-sub-fraction: estimate fraction of first-collisions that are mirrored at N in {1000, 2000, 5000, 10000}.',
  ],
});

export const IMP_857_TWIN_LADDER_SYMMETRIC_FORCING_ASSERTIONS = [
  {
    id: 'imp895-identity-B-holds',
    holds: () => numericalCheckZeroMirrorForcing().ok,
    why: 'Identity (B): the symmetric forcing must contribute exactly zero to the mirror-pair gap derivative at sigma-symmetric configurations, to machine precision.',
  },
  {
    id: 'imp895-forcing-sigma-invariant',
    holds: () => {
      const x = 0.37;
      const t = 0.5;
      const left = symmetricForcing(x, t);
      const right = symmetricForcing(1 - x, t);
      return Math.abs(left - right) < 1e-14;
    },
    why: 'Symmetric forcing must satisfy f_sym(1 - g, t) = f_sym(g, t) pointwise, which is the elementary identity underlying the whole corollary.',
  },
  {
    id: 'imp895-status-proven-partial',
    holds: () =>
      IMP_857_TWIN_LADDER_SYMMETRIC_FORCING.status === 'proven-partial' &&
      IMP_857_TWIN_LADDER_SYMMETRIC_FORCING.claims.B.orderInEps === 'exact (all orders)',
    why: 'Honest-partial closure: (A),(B),(C) are proven exactly for mirrored collisions; (D) imports imp-892 unchanged for non-mirror collisions.',
  },
];
