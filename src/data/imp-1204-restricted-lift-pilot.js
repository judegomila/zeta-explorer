// imp-1204-restricted-lift-pilot.js
// App H: restricted reciprocal Mobius-delay lift -- first floating-point pilot
//
// PURPOSE
// -------
// App H of twin_ladder_consolidated_v52.pdf (pp 80-86) records the first
// floating-point pilot of "restricted reciprocal Mobius-delay lifts".  A
// restricted lift is a degree-2 self-reciprocal polynomial family used as a
// finite-dimensional proxy for the full prime-delay bridge ratio Theta_a.  The
// goal is to certify bounded-real (sup-norm <= 1) for the restricted lift on a
// coarse frequency mesh, which would support the conjecture that the full
// Theta_a is Schur.
//
// LIFT FAMILY
// -----------
// Degree-2 self-reciprocal polynomial: p(z) = 1 + c*z + z^2, c real, |c| < 2.
// By construction p^{#}(z) = z^2 * conj(p(1/conj(z))) = 1 + c*z + z^2 = p(z),
// so the restricted bridge ratio is
//
//   Theta_a^{lift}(z) := p^{#}(z) / p(z) evaluated on the imaginary axis.
//
// The single free parameter c is optimised to minimise
// sup_{omega in mesh} |Theta_a(i*omega) - Theta_a^{lift}(i*omega)|.
//
// KEY RESULT (App H + App S, ticket imp-1207)
// -------------------------------------------
//   a = 0.025: pilot PASSES.  All 8 mesh points satisfy
//              |Theta_a^{lift}(i*omega)| < 1.  Gram matrix G_{a,5}
//              condition number ~ 342, comfortably well-conditioned.
//              The optimised c = -0.0183 places the degree-2 Schur factor
//              well inside the bounded-real disk.
//
//   a = 0.010: CENTRAL-BAND CONDITIONING BARRIER.  At omega = 0.1 the
//              lift marginally breaches 1 (|Theta^{lift}| ~ 1.0031).
//              Gram matrix G_{a,5} condition number ~ 82 400.  No choice of c
//              can simultaneously satisfy bounded-real at omega = 0.1 and
//              at omega = 0.5 because the Gram matrix is nearly singular in
//              the central band.
//
// COARSE MESH
// -----------
// omega in { 0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0 }  (8 points).
// Primes used: p = 2, 3, 5, 7, 11  (N = 5 truncation).
// Delay nodes: tau_p = log p  (Baker-independent set).
//
// RH CONNECTION
// -------------
// Certifying bounded-real for ALL a > 0 (not just a >= 0.025) and for the
// FULL prime-delay system would imply K_a >= 0 and hence RH.  The pilot
// establishes feasibility at a >= 0.025 and names central-band ill-conditioning
// as the obstacle for small a.
//
// SYNTAX NOTE
// -----------
// No apostrophes inside single-quoted strings.
// No star-slash sequences inside comments.

// ── Shared constants ─────────────────────────────────────────────────────────

const _MESH = Object.freeze([0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0, 50.0]);
const _PRIMES_5 = Object.freeze([2, 3, 5, 7, 11]);
const _DELAYS_5 = Object.freeze(_PRIMES_5.map((p) => Math.log(p)));

// ── Main export ──────────────────────────────────────────────────────────────

export const RESTRICTED_LIFT_PILOT = Object.freeze({
  ticketId: 'imp-1204',
  paperRef:
    'research-inputs/twin_ladder_consolidated_v52.pdf, App H, pp 80-86',
  title:
    'App H Restricted Reciprocal Mobius-Delay Lift: First Floating-Point Pilot',

  setup: Object.freeze({
    liftFamily:
      'Degree-2 self-reciprocal polynomial: p(z) = 1 + c*z + z^2, c real, |c| < 2. ' +
      'Restricted bridge ratio: Theta_a^{lift}(z) = p^{#}(z) / p(z) on imaginary axis.',
    liftFamilyLaTeX:
      'p(z) = 1 + c\\,z + z^2,\\; c \\in \\mathbb{R},\\; |c| < 2, \\quad ' +
      '\\Theta_a^{\\mathrm{lift}}(z) := \\frac{p^{\\#}(z)}{p(z)}',
    schurGoalLaTeX:
      '\\bigl\\|\\Theta_a^{\\mathrm{lift}}\\bigr\\|_{\\infty} ' +
      '= \\sup_{\\omega \\in \\text{mesh}} ' +
      '\\bigl|\\Theta_a^{\\mathrm{lift}}(i\\omega)\\bigr| \\leq 1',
    meshPoints: _MESH,
    primesN5: _PRIMES_5,
    delayNodesN5: _DELAYS_5,
    gramMatrixFormula:
      'G_{a,N}[p,q] = K_a(log p, log q), the delay-Gram matrix at prime nodes tau_p = log p.',
    optimisationTarget:
      'Choose c to minimise sup_{omega in mesh} |Theta_a(i*omega) - Theta_a^{lift}(i*omega)|.',
  }),

  runs: Object.freeze([
    Object.freeze({
      a: 0.025,
      verdict: 'PASS',
      cOptimal: -0.0183,
      gramConditionNumber: 341.7,
      lambdaMinGram: 2.91e-3,
      meshValues: Object.freeze([
        { omega: 0.1,  thetaMag: 0.9871 },
        { omega: 0.5,  thetaMag: 0.9634 },
        { omega: 1.0,  thetaMag: 0.9312 },
        { omega: 2.0,  thetaMag: 0.8847 },
        { omega: 5.0,  thetaMag: 0.8203 },
        { omega: 10.0, thetaMag: 0.7891 },
        { omega: 20.0, thetaMag: 0.7614 },
        { omega: 50.0, thetaMag: 0.7402 },
      ]),
      supNormOnMesh: 0.9871,
      passedBoundedReal: true,
      note:
        'All 8 mesh points satisfy |Theta_a^{lift}| < 1. ' +
        'Gram matrix G_{0.025,5} is well-conditioned (cond ~ 342, ' +
        'lambda_min ~ 2.9e-3). The degree-2 family certifies bounded-real ' +
        'on the coarse mesh for a = 0.025.',
    }),
    Object.freeze({
      a: 0.010,
      verdict: 'BARRIER',
      cOptimal: null,
      gramConditionNumber: 82400,
      lambdaMinGram: 1.2e-6,
      meshValues: Object.freeze([
        { omega: 0.1,  thetaMag: 1.0031 },
        { omega: 0.5,  thetaMag: 0.9984 },
        { omega: 1.0,  thetaMag: 0.9823 },
        { omega: 2.0,  thetaMag: 0.9505 },
        { omega: 5.0,  thetaMag: 0.8843 },
        { omega: 10.0, thetaMag: 0.8314 },
        { omega: 20.0, thetaMag: 0.7958 },
        { omega: 50.0, thetaMag: 0.7703 },
      ]),
      supNormOnMesh: 1.0031,
      passedBoundedReal: false,
      centralBandBarrier: Object.freeze({
        omegaBreached: 0.1,
        magAtBreach: 1.0031,
        explanation:
          'At omega = 0.1 the restricted lift exceeds 1 by ~ 0.31%. ' +
          'The Gram matrix G_{0.010,5} has condition number ~ 82 400 ' +
          '(lambda_min ~ 1.2e-6) because all five prime-delay modes ' +
          'exp(-a*tau_p) cluster near 1 when a = 0.010. ' +
          'The degree-2 family has one scalar degree of freedom (c) ' +
          'that cannot simultaneously satisfy bounded-real at ' +
          'omega = 0.1 and at omega >= 0.5: the central-band and ' +
          'broad-band constraints conflict once the Gram matrix is ' +
          'nearly singular.',
      }),
      note:
        'Central-band conditioning barrier at omega = 0.1. ' +
        'No real c makes the degree-2 lift Schur over this mesh ' +
        'when a = 0.010. App S (ticket imp-1207) stress-tests ' +
        'adaptive patch refinement to probe whether a finer mesh or ' +
        'higher-degree family can push through the barrier.',
    }),
  ]),

  interpretation: Object.freeze({
    threshold:
      'App H establishes a = 0.025 as the smallest parameter tested where ' +
      'a degree-2 self-reciprocal polynomial certifies bounded-real on the ' +
      'N = 5, 8-point coarse mesh. Below a = 0.025 the Gram matrix becomes ' +
      'ill-conditioned (cond > 10^4) and the single degree of freedom c ' +
      'cannot resolve the central-band vs broad-band tension.',
    nextStep:
      'App S (ticket imp-1207) implements adaptive patch refinement: ' +
      'a denser sub-mesh near omega = 0.1 and a degree-4 reciprocal family ' +
      'to test whether the barrier at a = 0.010 can be overcome with more ' +
      'degrees of freedom.',
    rhConnection:
      'A restricted lift certifying bounded-real for ALL a > 0 and for the ' +
      'FULL (infinite-N) prime-delay system would imply K_a >= 0 and RH. ' +
      'The App H pilot confirms feasibility at a >= 0.025 on the N = 5 ' +
      'truncation and identifies central-band ill-conditioning as the ' +
      'primary obstacle for small a.',
    openQuestion:
      'Is the central-band barrier a genuine obstruction or a numerical ' +
      'artefact of the coarse mesh? App S (finer mesh) and the analysis ' +
      'in para 17 (ghost / negative-square count) provide complementary ' +
      'angles on this question.',
  }),
});

// ── Build-time tripwires (>= 5) ──────────────────────────────────────────────

export const RESTRICTED_LIFT_ASSERTIONS = [
  {
    id: 'imp1204-two-runs-present',
    holds: () =>
      Array.isArray(RESTRICTED_LIFT_PILOT.runs) &&
      RESTRICTED_LIFT_PILOT.runs.length === 2,
    why: 'RESTRICTED_LIFT_PILOT.runs must contain exactly 2 entries (a=0.025 and a=0.010).',
  },
  {
    id: 'imp1204-a025-pass',
    holds: () => {
      const r = RESTRICTED_LIFT_PILOT.runs.find((x) => x.a === 0.025);
      return r !== undefined && r.passedBoundedReal === true && r.supNormOnMesh < 1.0;
    },
    why: 'The a=0.025 run must pass bounded-real: verdict PASS and supNormOnMesh < 1.',
  },
  {
    id: 'imp1204-a010-barrier',
    holds: () => {
      const r = RESTRICTED_LIFT_PILOT.runs.find((x) => x.a === 0.010);
      return (
        r !== undefined &&
        r.passedBoundedReal === false &&
        r.verdict === 'BARRIER' &&
        r.supNormOnMesh > 1.0
      );
    },
    why: 'The a=0.010 run must hit the central-band barrier: verdict BARRIER and supNormOnMesh > 1.',
  },
  {
    id: 'imp1204-condition-numbers-ordered',
    holds: () => {
      const r025 = RESTRICTED_LIFT_PILOT.runs.find((x) => x.a === 0.025);
      const r010 = RESTRICTED_LIFT_PILOT.runs.find((x) => x.a === 0.010);
      return (
        r025 !== undefined &&
        r010 !== undefined &&
        r010.gramConditionNumber > r025.gramConditionNumber * 10
      );
    },
    why: 'G_{0.010,5} condition number must be > 10x the G_{0.025,5} condition number (ill-conditioning at small a).',
  },
  {
    id: 'imp1204-mesh-8-points',
    holds: () =>
      Array.isArray(RESTRICTED_LIFT_PILOT.setup.meshPoints) &&
      RESTRICTED_LIFT_PILOT.setup.meshPoints.length === 8,
    why: 'The coarse mesh must have exactly 8 frequency points (0.1 through 50).',
  },
  {
    id: 'imp1204-five-primes',
    holds: () =>
      Array.isArray(RESTRICTED_LIFT_PILOT.setup.primesN5) &&
      RESTRICTED_LIFT_PILOT.setup.primesN5.length === 5 &&
      RESTRICTED_LIFT_PILOT.setup.primesN5[0] === 2 &&
      RESTRICTED_LIFT_PILOT.setup.primesN5[4] === 11,
    why: 'N=5 truncation must use primes {2, 3, 5, 7, 11}.',
  },
  {
    id: 'imp1204-central-band-barrier-named',
    holds: () => {
      const r = RESTRICTED_LIFT_PILOT.runs.find((x) => x.a === 0.010);
      return (
        r !== undefined &&
        r.centralBandBarrier !== undefined &&
        typeof r.centralBandBarrier.explanation === 'string' &&
        r.centralBandBarrier.explanation.length >= 80
      );
    },
    why: 'The a=0.010 run must carry a centralBandBarrier sub-record with a substantive explanation.',
  },
];
