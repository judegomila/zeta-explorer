/**
 * @module imp-commutator-diagonal-positivity
 *
 * imp-2850 correction (2026-08-28).
 *
 * The old record correctly evaluated the commutator integrand at u=v, but
 * incorrectly promoted that restriction to a non-zero summand of an ordinary
 * two-dimensional Lebesgue integral.  The line u=v has measure zero.  The
 * positive one-dimensional expression is therefore a comparison kernel (or a
 * delta-measure insertion), not the literal "diagonal part" of K_a.
 */

const { cosh, sinh, cos, sin, abs } = Math;

function commutator(a, wb, z, u, v) {
  return (
    cosh(a * u) * sinh(a * v) * cos(z * u) * sin(wb * v) -
    sinh(a * u) * cosh(a * v) * sin(z * u) * cos(wb * v)
  );
}

function diagonalRestriction(a, wb, z, u) {
  return 0.5 * sinh(2 * a * u) * sin((wb - z) * u);
}

// Pair s and -s after u=r-s, v=r+s.  This is the exact replacement for the
// false diagonal/off-diagonal split.
function pairedCommutator(a, wb, z, r, s) {
  const delta = wb - z;
  const sigma = wb + z;
  return (
    sinh(2 * a * r) * sin(delta * r) * cos(sigma * s) +
    sinh(2 * a * s) * sin(delta * s) * cos(sigma * r)
  );
}

export const IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY = Object.freeze({
  id: 'imp-2850-correction',
  supersedes: 'imp-2850',
  updatedAt: '2026-08-28',
  status: 'RETRACTED-AS-DECOMPOSITION / ALGEBRAIC-RESTRICTION-ONLY',
  rigorousBeat: false,
  result1_diagonalReduction: Object.freeze({
    valid: true,
    identity: 'C_a(w,z;u,u) = (1/2) sinh(2au) sin((wb-z)u)',
    meaning: 'A correct pointwise restriction of the integrand.',
  }),
  result2_diagonalPositivity: Object.freeze({
    signDefinite: true,
    energyDiagonalLimit: '(1/(2 pi)) int Phi(u)^2 u sinh(2au) du',
    literalSummandOfDoubleIntegral: false,
    reason:
      'The set {(u,v):u=v} has two-dimensional Lebesgue measure zero. A non-zero ' +
      'one-dimensional integral requires a delta measure or an independently proved add-subtract identity.',
  }),
  exactRepair: Object.freeze({
    coordinates: 'u=r-s, v=r+s, r>=0, |s|<=r',
    pairedIdentity:
      'C(r-s,r+s)+C(r+s,r-s) = sinh(2ar)sin((wb-z)r)cos((wb+z)s) + ' +
      'sinh(2as)sin((wb-z)s)cos((wb+z)r)',
    verdict:
      'Use the paired r,s integral for K_a. Any positive comparison core must be added and subtracted explicitly.',
  }),
  rawShear: Object.freeze({
    kernel: 'Phi(u)Phi(v)sinh(a(v-u)) = p(u)q(v)-q(u)p(v)',
    rank: 'at most 2',
    positivity: false,
    reason: 'The raw operator is skew-adjoint; i times it has a symmetric +/- eigenvalue pair unless it vanishes.',
  }),
  verdict:
    'The algebraic value on u=v remains correct, but the claimed continuum diagonal/off-diagonal decomposition ' +
    'is withdrawn. This correction does not prove or disprove RH; it removes an invalid reduction step. NO QED.',
});

export const IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY_ASSERTIONS = [
  {
    id: 'imp2850-pointwise-diagonal-identity-survives',
    description: 'The pointwise restriction C(u,u) is algebraically correct.',
    holds: () => [
      [0.7, 1.3, 0.4, 2.1],
      [1.0, 0.5, 1.7, 0.2],
      [0.3, 2.0, 0.9, 1.1],
    ].every(([a, u, z, wb]) =>
      abs(commutator(a, wb, z, u, u) - diagonalRestriction(a, wb, z, u)) < 1e-11),
  },
  {
    id: 'imp2850-exact-paired-coordinate-identity',
    description: 'The r,s paired identity agrees with the original two commutator terms.',
    holds: () => [
      [0.7, 2.1, 0.4, 1.3, 0.3],
      [1.1, 0.3, 1.9, 1.4, 0.6],
      [0.5, 1.4, 0.7, 2.0, 0.1],
    ].every(([a, wb, z, r, s]) => {
      const lhs = commutator(a, wb, z, r - s, r + s) +
        commutator(a, wb, z, r + s, r - s);
      return abs(lhs - pairedCommutator(a, wb, z, r, s)) < 1e-10;
    }),
  },
  {
    id: 'imp2850-riemann-mesh-diagonal-vanishes',
    description: 'A genuine 2D mesh diagonal scales like O(h), unlike an inserted 1D measure.',
    holds: () => {
      const diagonalMass = (n) => {
        const h = 1 / n;
        let sum = 0;
        for (let j = 1; j <= n; j++) sum += h * h * Math.exp(-2 * (j * h) ** 2);
        return sum;
      };
      const coarse = diagonalMass(200);
      const fine = diagonalMass(400);
      return fine < 0.51 * coarse && fine > 0.49 * coarse;
    },
  },
  {
    id: 'imp2850-honesty-no-qed',
    description: 'The correction is explicitly not an RH claim.',
    holds: () =>
      IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY.rigorousBeat === false &&
      /NO QED/.test(IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY.verdict) &&
      IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY.result2_diagonalPositivity.literalSummandOfDoubleIntegral === false,
  },
];

for (const assertion of IMP2850_COMMUTATOR_DIAGONAL_POSITIVITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-commutator-diagonal-positivity assertion failed: ${assertion.id}`);
  }
}
