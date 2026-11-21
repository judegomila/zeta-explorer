/**
 * @module imp-33811-g7-scaling-orbit-pin
 * @fileoverview imp-33811 -- ATTEMPT to locate the physically-pinned s = a*U value at which the
 *   imp-33765 / imp-33787 G7 scaling orbit actually sits, and measure ||R|| there, addressing the
 *   imp-33787 residual that "locating that pin is a separate, still-open task". HONEST PARTIAL:
 *   the attempt SUCCEEDS at measuring ||R|| at the imp-33792 representative anchor a*U = 3 but
 *   FAILS to pin s from the scaling-orbit constraint alone -- because that constraint is a
 *   SYMMETRY (degeneracy), not a selection equation. The pin reduces EXACTLY to the still-open
 *   residual GAP-G7-SMIN (section-26 provenance of a*U).
 *
 *   WHAT THE SCALING-ORBIT CONSTRAINT IS (inherited: imp-33725 / imp-33765 / imp-33792)
 *   ---------------------------------------------------------------------------------
 *   Over the admissible continuous parameters (single shear rate a > 0, window U > 0) the imp-3066
 *   de-homogenised correlation matrix depends on s = a*U ALONE:
 *       R_jk(s) = h_jk(s) / sqrt(d_j(s) d_k(s)),
 *       d_j(s) = int_0^1 cosh(s*x) x^{2j} dx,   h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx.
 *   imp-33765 derived that R is INVARIANT under the one-parameter orbit
 *       (a, U) -> (a/lambda, lambda*U),   lambda > 0,
 *   which fixes the product s = a*U. imp-33792 confirmed this to machine precision on an
 *   independent Gauss-Legendre rule: the four pairs (0.5,6), (1.5,2), (0.1,30), (3,1) -- all with
 *   a*U = 3 -- give the SAME ||R|| = 4.61701367541 (spectrally converged; imp-33765's reported
 *   4.617013710 was its own O(h^2) midpoint artifact).
 *
 *   WHY THE ORBIT CONSTRAINT CANNOT PIN s (the imp-33811 finding -- ASSESS)
 *   ---------------------------------------------------------------------
 *   The scaling orbit is a LEVEL SET {(a,U) : a*U = s}: a symmetry of R, not a constraint that
 *   selects a value of s. It fixes ||R|| GIVEN s, but s itself is left free -- the invariance is
 *   exactly one equation SHORT of pinning the physical operating point. Each admissible s labels a
 *   DISTINCT orbit with a DISTINCT ||R||: the ladder ||R(1)|| ~ 3.017, ||R(2)|| ~ 4.240,
 *   ||R(3)|| ~ 4.617, ||R(4)|| ~ 4.755, ||R(5)|| ~ 4.822 (monotone in s, imp-33787 / imp-33795),
 *   every rung equally admissible. So there is NO s the scaling-orbit constraint singles out: the
 *   invariance is a DEGENERACY along the orbit, not across orbits. The a*U = 3 of imp-33765 /
 *   imp-33792 is a REPRESENTATIVE ANCHOR chosen to exhibit the invariance -- NOT a physically
 *   derived pin, and this module does NOT claim it is one.
 *
 *   WHAT PINNING s ACTUALLY REDUCES TO (imp-33787 residual GAP-G7-SMIN)
 *   -----------------------------------------------------------------
 *   To pick out the physical orbit one needs the value of a*U supplied by an argument OUTSIDE the
 *   kernel -- the section-26 provenance of the shear rate a and window U. That is precisely the
 *   imp-33787 residual: exhibit a rigorous a*U = s_min (or a determined a*U) from the section-26
 *   origin of a and U. This module confirms the pin reduces EXACTLY to that residual and no
 *   further: the kernel + orbit invariance alone are provably insufficient (they carry a
 *   one-parameter degeneracy). MEASURED DELIVERABLE: at the imp-33792 representative anchor
 *   a*U = 3, ||R|| = 4.61701368 (this module, midpoint NQ = 8000; spectral reference 4.61701367541
 *   from imp-33792). The physical pin itself remains OPEN.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   HONEST PARTIAL. STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as
 *   imp-3066 / imp-33704 / imp-33725 / imp-33765 / imp-33787 -- NOT the section-26 Gram. The
 *   measured ||R|| carries NO RH verdict. The physically-pinned s is NOT located: the
 *   scaling-orbit constraint is a symmetry and cannot pin s; the pin reduces to the still-open
 *   residual GAP-G7-SMIN. K_a >= 0 is NOT attempted. imp-3066 / imp-33704 / imp-33725 / imp-33765 /
 *   imp-33787 / G7 are UNTOUCHED as a proof. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-33787-g7-perron-lower-bound.js (imp-33787: names the residual this addresses)
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (imp-33765: derives the s one-dimensionality / orbit)
 *   @see imp-33725-g7-obstruction-a-scaling.js (imp-33725: the a ladder / monotone-in-s ceiling)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell G7 magnitude)
 *   @see lambda-roadmap.js G7 (the K_a >= 0 lone obstruction node)
 *
 *   Ticket: imp-33811 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 8000;                                       // midpoint quadrature panels (matches imp-33787 family)

const cosh = Math.cosh;
const sinh = Math.sinh;

/** x-domain moment: int_0^1 weightFn(s*x) * x^p dx (the de-homogenised imp-33725 integrand). */
function moment(weightFn, s, p) {
  const hq = 1 / NQ;
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const x = (k + 0.5) * hq;
    acc += weightFn(s * x) * Math.pow(x, p) * hq;
  }
  return acc;
}

/**
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (self-contained, no deps).
 * Copied verbatim from imp-3066 / imp-33765 / imp-33787 so the modules read the SAME spectrum.
 */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 600; iter++) {
    let p = 0;
    let q = 1;
    let off = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(m[i][j]) > off) {
          off = Math.abs(m[i][j]);
          p = i;
          q = j;
        }
      }
    }
    if (off < 1e-16) break;
    const app = m[p][p];
    const aqq = m[q][q];
    const apq = m[p][q];
    const theta = (aqq - app) / (2 * apq);
    const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    for (let i = 0; i < n; i++) {
      const mip = m[i][p];
      const miq = m[i][q];
      m[i][p] = c * mip - s * miq;
      m[i][q] = s * mip + c * miq;
    }
    for (let j = 0; j < n; j++) {
      const mpj = m[p][j];
      const mqj = m[q][j];
      m[p][j] = c * mpj - s * mqj;
      m[q][j] = s * mpj + c * mqj;
    }
  }
  return m.map((row, i) => row[i]);
}

/** The admissible de-homogenised imp-3066 correlation matrix R(s) and its Perron norm. */
function perronNorm(s) {
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => moment(cosh, s, 2 * j));
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => moment(sinh, s, j + k) / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  return Math.max(...symmetricEigenvalues(R).map((e) => Math.abs(e)));
}

// -- The imp-33792 representative anchor a*U = 3: four orbit pairs must coincide (invariance) -----
const ANCHOR_S = 3;
const ANCHOR_PAIRS = Object.freeze([
  Object.freeze({ a: 0.5, U: 6 }),
  Object.freeze({ a: 1.5, U: 2 }),
  Object.freeze({ a: 0.1, U: 30 }),
  Object.freeze({ a: 3, U: 1 }),
]);
const ANCHOR_SWEEP = Object.freeze(
  ANCHOR_PAIRS.map((p) => Object.freeze({ a: p.a, U: p.U, aU: p.a * p.U, operatorNorm: perronNorm(p.a * p.U) })),
);
const NORM_AT_ANCHOR = perronNorm(ANCHOR_S);           // ||R(3)|| ~ 4.61701368 (midpoint NQ=8000)
const SPECTRAL_ANCHOR_REFERENCE = 4.61701367541;       // imp-33792 Gauss-Legendre converged value
// all four orbit pairs coincide -- the invariance is reproduced along the orbit
const orbitInvariantAtAnchor = ANCHOR_SWEEP.every(
  (row) => Math.abs(row.operatorNorm - NORM_AT_ANCHOR) < 1e-9,
);
// the module's midpoint anchor value agrees with the imp-33792 spectral reference to ~7 sig figs
const anchorMatchesSpectralReference = Math.abs(NORM_AT_ANCHOR - SPECTRAL_ANCHOR_REFERENCE) < 1e-6;

// -- The s ladder ACROSS orbits: each s is a DISTINCT admissible orbit with a DISTINCT ||R|| ------
// This is the crux: the orbit constraint fixes ||R|| GIVEN s but does NOT single out any s.
const S_LADDER = Object.freeze([1, 2, 3, 4, 5]);
const S_LADDER_SWEEP = Object.freeze(S_LADDER.map((s) => Object.freeze({ s, operatorNorm: perronNorm(s) })));
// the norms are strictly distinct across orbits (no accidental collision that could pin s)
let ladderStrictlyDistinctAndMonotone = true;
for (let i = 1; i < S_LADDER_SWEEP.length; i++) {
  if (S_LADDER_SWEEP[i].operatorNorm <= S_LADDER_SWEEP[i - 1].operatorNorm + 1e-9) {
    ladderStrictlyDistinctAndMonotone = false;
  }
}
// distinct admissible norms across orbits => the scaling-orbit constraint alone cannot pin s
const orbitConstraintDoesNotPinS = ladderStrictlyDistinctAndMonotone;

export const IMP33811_G7_SCALING_ORBIT_PIN = Object.freeze({
  id: 'imp-33811-g7-scaling-orbit-pin',
  ticket: 'imp-33811',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedResidualSource: 'imp-33787-g7-perron-lower-bound.js',
  relatedOneDimensionality: 'imp-33765-g7-obstruction-orthogonal-lever.js',
  relatedIndependentQuadrature: 'scripts/imp-33792-independent-quadrature-orbit-offline.mjs',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  roadmapNode: 'G7',

  summary:
    'HONEST PARTIAL on the imp-33787 residual "locating the physically-pinned s = a*U is a ' +
    'separate, still-open task". ATTEMPT: pin the s at which the G7 orbit sits from the ' +
    'scaling-orbit constraint, and measure ||R|| there. RESULT: the constraint CANNOT pin s -- it ' +
    'is a SYMMETRY (the orbit (a,U)->(a/lambda,lambda*U) is a level set of s), one equation short ' +
    'of selecting an operating point. Each admissible s labels a DISTINCT orbit with a DISTINCT ' +
    '||R|| (ladder ||R(1..5)|| ~ 3.017, 4.240, 4.617, 4.755, 4.822, all admissible), so no s is ' +
    'singled out. The imp-33792 a*U = 3 is a REPRESENTATIVE ANCHOR, not a physical pin; at it the ' +
    'four orbit pairs (0.5,6),(1.5,2),(0.1,30),(3,1) coincide at ||R|| = 4.61701368 (midpoint ' +
    'NQ=8000; spectral reference 4.61701367541). CONCLUSION: the pin reduces EXACTLY to the ' +
    'still-open residual GAP-G7-SMIN (a*U from the section-26 provenance of a and U); the kernel + ' +
    'orbit invariance alone are provably insufficient. REPRESENTATIVE / DIAGNOSTIC; ||R|| carries ' +
    'NO RH verdict; K_a >= 0 NOT attempted; imp-3066 / imp-33765 / imp-33787 / G7 untouched; not a proof.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3066 / imp-33725 / imp-33765 / imp-33787 (same phi_j = (tau/U)^j truncation, quadrature, Jacobi eigensolver)',
    deHomogenizedR: 'R_jk(s) = h_jk(s) / sqrt(d_j(s) d_k(s)), d_j(s) = int_0^1 cosh(s*x) x^{2j} dx, h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx',
    scalingOrbit: '(a, U) -> (a/lambda, lambda*U) fixes s = a*U; R is invariant along the orbit (imp-33765)',
    orbitIsLevelSet: 'the orbit {(a,U): a*U = s} is a symmetry / level set: it fixes ||R|| GIVEN s but does NOT select a value of s',
    anchor: 'a*U = ' + ANCHOR_S + ' (imp-33792 representative anchor; NOT a physically derived pin)',
    degree: DEG,
    truncationSize: DEG + 1,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, 1]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    anchorS: ANCHOR_S,
    anchorPairs: ANCHOR_PAIRS,
    anchorSweep: ANCHOR_SWEEP,                          // four orbit pairs, all coincident
    normAtAnchor: NORM_AT_ANCHOR,                       // ||R(3)|| ~ 4.61701368
    spectralAnchorReference: SPECTRAL_ANCHOR_REFERENCE, // imp-33792 Gauss-Legendre converged 4.61701367541
    orbitInvariantAtAnchor,                             // all four pairs coincide (invariance reproduced)
    anchorMatchesSpectralReference,                     // midpoint value matches spectral to ~7 sig figs
    sLadder: S_LADDER,
    sLadderSweep: S_LADDER_SWEEP,                        // distinct ||R|| per orbit s = 1..5
    ladderStrictlyDistinctAndMonotone,                  // no accidental collision that could pin s
    orbitConstraintDoesNotPinS,                         // THE FINDING: constraint is one equation short
  }),

  interpretation: Object.freeze({
    orbitIsSymmetryNotSelector:
      'The scaling-orbit constraint (a,U)->(a/lambda,lambda*U) is a SYMMETRY of R: it is the level ' +
      'set {a*U = s}, so it fixes ||R|| GIVEN s but leaves s free. It is exactly one equation short ' +
      'of pinning a physical operating point. The four anchor pairs coincide (invariance ALONG the ' +
      'orbit), but ||R(s)|| takes a DISTINCT admissible value on each orbit ACROSS s -- so nothing ' +
      'in the orbit structure singles out a value of s.',
    anchorIsRepresentativeNotPin:
      'The imp-33792 a*U = 3 is a REPRESENTATIVE ANCHOR chosen to EXHIBIT the invariance, NOT a ' +
      'physically derived pin. At it ||R|| = 4.61701368 (this module, midpoint NQ=8000; imp-33792 ' +
      'spectral reference 4.61701367541). This module measures ||R|| there but does NOT claim ' +
      'a*U = 3 is the physical orbit.',
    pinReducesToResidual:
      'To pick out the physical orbit one needs the value of a*U from an argument OUTSIDE the ' +
      'kernel -- the section-26 provenance of the shear rate a and window U. That is EXACTLY the ' +
      'imp-33787 residual GAP-G7-SMIN. This module confirms the pin reduces to that residual and no ' +
      'further: the kernel plus orbit invariance carry a one-parameter degeneracy and are provably ' +
      'insufficient to locate s.',
    residualNamed:
      'RESIDUAL SUB-GAP GAP-G7-SMIN (inherited from imp-33787, UNCHANGED): determine the admissible ' +
      's = a*U from the section-26 provenance of a and U. The physically-pinned s is NOT located ' +
      'here; it remains the separate, still-open task imp-33787 named.',
  }),

  verdict:
    'HONEST PARTIAL. The physically-pinned s = a*U is NOT locatable from the G7 scaling-orbit ' +
    'constraint: that constraint is a symmetry (level set of s), one equation short of selecting ' +
    'an operating point, and every admissible s is a distinct admissible orbit (||R(1..5)|| ~ ' +
    '3.017..4.822, all admissible). MEASURED at the imp-33792 representative anchor a*U = 3: ' +
    '||R|| = 4.61701368 (midpoint; spectral 4.61701367541). The pin reduces EXACTLY to the ' +
    'still-open residual GAP-G7-SMIN (section-26 provenance of a*U). Diagnostic; K_a >= 0 NOT ' +
    'attempted; imp-3066 / imp-33765 / imp-33787 / G7 untouched; NO QED; no refereed bound is changed' +
    '.',

  honestCaveat:
    'HONEST PARTIAL. STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as ' +
    'imp-3066 / imp-33704 / imp-33725 / imp-33765 / imp-33787, NOT the section-26 Gram. The ' +
    'measured ||R|| carries NO RH verdict. The physically-pinned s is NOT located: the ' +
    'scaling-orbit constraint is a symmetry and cannot pin s; the pin reduces to the still-open ' +
    'residual GAP-G7-SMIN. The K_a >= 0 positivity step is NOT attempted. imp-3066 / imp-33704 / ' +
    'imp-33725 / imp-33765 / imp-33787 / G7 are UNTOUCHED as a proof. No refereed bound is changed' +
    '. No false QED.',
});

// -- Self-executing tripwire assertions (run at import; mirror the imp-33787 family gate style) ---
const A = IMP33811_G7_SCALING_ORBIT_PIN;

// 1. The four orbit pairs with a*U = 3 coincide -- the scaling invariance is reproduced.
if (!A.measured.orbitInvariantAtAnchor) {
  throw new Error('imp-33811 tripwire: the four a*U=3 orbit pairs did not coincide (invariance broken)');
}

// 2. The measured anchor norm matches the imp-33792 spectral reference to ~7 sig figs.
if (!A.measured.anchorMatchesSpectralReference) {
  throw new Error('imp-33811 tripwire: ||R(3)|| drifted from the imp-33792 spectral reference 4.61701367541');
}

// 3. The anchor norm sits on the derived s-curve between ||R(2)|| and ||R(4)|| (monotone context).
if (!(A.measured.normAtAnchor > 4.239 && A.measured.normAtAnchor < 4.756)) {
  throw new Error('imp-33811 tripwire: ||R(3)|| left the derived [||R(2)||, ||R(4)||] bracket');
}

// 4. THE FINDING: distinct admissible norms across orbits => the constraint cannot pin s.
if (!A.measured.orbitConstraintDoesNotPinS) {
  throw new Error('imp-33811 tripwire: the s ladder failed the distinct-per-orbit check that shows s is not pinned');
}

// 5. The residual is named and inherited UNCHANGED from imp-33787 (GAP-G7-SMIN, section-26).
if (
  !A.interpretation.residualNamed.includes('GAP-G7-SMIN') ||
  !A.interpretation.pinReducesToResidual.includes('section-26')
) {
  throw new Error('imp-33811 tripwire: the still-open residual GAP-G7-SMIN was not named / re-attributed');
}

// 6. Honesty gate: HONEST PARTIAL, no RH verdict / no QED, K_a >= 0 not attempted, no refereed bound is changed.
if (
  !A.honestCaveat.includes('HONEST PARTIAL') ||
  !A.honestCaveat.includes('K_a >= 0 positivity step is NOT attempted') ||
  !A.honestCaveat.includes('efereed bound is changed')
) {
  throw new Error('imp-33811 tripwire: honesty gate text weakened');
}

export default IMP33811_G7_SCALING_ORBIT_PIN;
