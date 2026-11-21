/**
 * @module imp-33765-g7-obstruction-orthogonal-lever
 * @fileoverview imp-33765 -- DERIVE whether the imp-3066 / G7 shear obstruction admits any
 *   genuinely ORTHOGONAL, non-product lever that could soften the Perron norm ||R|| WITHOUT
 *   merely rescaling the product s = a*U, or ASSESS that the obstruction is provably
 *   one-dimensional in s. Direct follow-on to imp-33725, which swept the shear weight a at
 *   fixed U = 6 and found NO nontrivial favorable a-window -- both a and U act only through
 *   s = a*U, so the obstruction is EMPIRICALLY one-dimensional. imp-33765 promotes that
 *   observation to a DERIVED scaling-invariance statement and enumerates the candidate
 *   orthogonal levers, classifying each as admissible or inadmissible.
 *
 *   THE GAP THIS FILLS (the imp-33765 ticket)
 *   -----------------------------------------
 *   imp-33725 established that ||R|| is a function of s = a*U alone by MEASURING two ladders
 *   that reparametrise the same one-parameter curve. It never asked whether some OTHER knob of
 *   the imp-3066 construction -- the shear-form coefficient, a non-product combination of the
 *   two exponential rates -- lies OFF the s axis and could soften ||R|| without touching s.
 *   This module derives the answer.
 *
 *   THE ADMISSIBLE KERNEL (inherited verbatim from imp-3066)
 *   -------------------------------------------------------
 *   On the representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j the imp-3066
 *   metric pair is the even/odd split of a SINGLE exponential shear e^{a*tau}:
 *       D_jj = int_0^U cosh(a*tau) phi_j^2 d(tau)    (the pass form, even part),
 *       H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau) (the shear form, odd part),
 *       R_jk = H_jk / sqrt(D_jj D_kk),   ||R|| = Perron eigenvalue.
 *   The ADMISSIBLE continuous parameters are exactly two: the shear rate a and the window U.
 *   Substituting tau = U*x maps both integrands onto [0,1] and factors the shared U prefactor
 *   out of R, leaving R a function of s = a*U alone:
 *       R_jk = h_jk(s) / sqrt(d_j(s) d_k(s)),
 *       d_j(s) = int_0^1 cosh(s*x) x^{2j} dx,   h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx.
 *
 *   THE DERIVED ONE-DIMENSIONALITY (the imp-33765 deliverable -- DERIVE / ASSESS)
 *   ----------------------------------------------------------------------------
 *   (1) SCALING-INVARIANCE ORBIT. R is invariant under the one-parameter group
 *       (a, U) -> (a/lambda, lambda*U), which fixes s = a*U. The level sets {a*U = const} are
 *       hyperbolic degeneracy orbits: every (a,U) on an orbit yields the IDENTICAL R. So the
 *       two-parameter kernel family collapses to a one-parameter curve indexed by s. Among the
 *       admissible continuous parameters (a, U) there is provably NO orthogonal lever -- the
 *       map (a,U) -> ||R|| factors through the single scalar s. (Verified numerically: four
 *       (a,U) pairs with a*U = 3 -- (0.5,6), (1.5,2), (0.1,30), (3,1) -- give ||R|| = 4.617013710
 *       to nine digits.)
 *   (2) CANDIDATE ORTHOGONAL LEVERS, ENUMERATED AND CLASSIFIED.
 *       (i) SHEAR-FORM COEFFICIENT c. Replace sinh(a*tau) by c*sinh(a*tau). Then H_jk -> c*H_jk,
 *           so R -> c*R and every eigenvalue, in particular ||R||, scales LINEARLY by c. This is
 *           a genuinely orthogonal lever (it moves ||R|| without changing s). But it is
 *           INADMISSIBLE: cosh(a*tau) + c*sinh(a*tau) is a genuine exponential shear e^{a*tau}
 *           ONLY at c = 1; any other c redefines the kernel away from the exponential multiplier,
 *           so c is not a free parameter of the imp-3066 construction, it is a different kernel.
 *       (ii) DECOUPLED PASS / SHEAR RATES b != a. Let the pass form carry rate b and the shear
 *           form rate a: d_j -> d_j(s_b), h_jk -> h_jk(s_a) with s_b = b*U, s_a = a*U. Now R
 *           depends on TWO parameters (s_a, s_b) -- a genuinely non-product, two-dimensional
 *           dependence -- and raising the pass rate above the shear rate (b > a) inflates the
 *           diagonal cosh normalisers and STRICTLY SHRINKS ||R||: at s_a = 3 the norm falls
 *           20.94 (s_b=1) -> 4.617 (s_b=3, the coupled anchor) -> 0.338 (s_b=6). So decoupling
 *           IS an orthogonal softening lever. But it is INADMISSIBLE: cosh(b*tau) and
 *           sinh(a*tau) are the even and odd parts of ONE exponential only when b = a; b != a
 *           breaks the coherent single-multiplier metric pair that defines the imp-3066 shear.
 *       (iii) TRUNCATION SIZE DEG (basis dimension). Genuinely orthogonal and ADMISSIBLE, but it
 *           is not a softening lever: increasing DEG raises the all-ones Perron ceiling DEG+1
 *           that the monotone-in-s curve saturates to (imp-33704 / imp-33725). It sets the
 *           ceiling, it does not walk the obstruction down.
 *   (3) THE VERDICT (derived). The G7 / imp-3066 obstruction is PROVABLY one-dimensional in
 *       s = a*U over its admissible continuous parameters -- the scaling orbit (a,U) ->
 *       (a/lambda, lambda*U) forces the map through the single scalar s, so no admissible
 *       orthogonal lever exists. The two candidate NON-product levers that DO move ||R|| off the
 *       s-curve -- the shear coefficient c (linear rescale) and the decoupled pass rate b (a
 *       genuine softening for b > a) -- both require BREAKING the even/odd exponential
 *       decomposition e^{a*tau} = cosh(a*tau) + sinh(a*tau) that defines the shear kernel, and
 *       are therefore inadmissible. The one admissible orthogonal axis, the truncation size,
 *       sets the ceiling rather than softening the curve. This upgrades imp-33725 "both act only
 *       through s" from an empirical observation to a derived scaling-invariance statement and
 *       pins down exactly where the (inadmissible) orthogonal levers live.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as imp-3066 /
 *   imp-33704 / imp-33725 -- NOT the section-26 Gram. The measured ||R|| carries NO RH verdict.
 *   The decoupled-rate probe is a DIAGNOSTIC device used to LOCATE the orthogonal lever, not an
 *   admissible modification of imp-3066: it deliberately breaks the exponential shear to show
 *   that the s one-dimensionality is a CONSEQUENCE of the shared-rate exponential, not an
 *   accident. imp-3066 / imp-33704 / imp-33725 / G7 are UNTOUCHED as a proof; the K_a >= 0
 *   positivity step is NOT attempted; the bare-V pilot (imp-1240) is NOT re-run. No refereed bound is changed
 *   . No false QED.
 *
 *   @see imp-33725-g7-obstruction-a-scaling.js (imp-33725: the a ladder that found the s-product degeneracy)
 *   @see imp-33704-g7-obstruction-U-scaling.js (imp-33704: the complementary U ladder at fixed a = 0.5)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell G7 magnitude)
 *   @see imp-3107-dehomogenized-offdiag-aU-grid.js (imp-3107: the de-homogenized off-diag entries track s = a*U)
 *   @see lambda-roadmap.js G7 (the K_a >= 0 lone obstruction node)
 *
 *   Ticket: imp-33765 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;                                       // midpoint quadrature panels (matches imp-3066 / imp-33725)

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
 * Copied verbatim from imp-3066 / imp-33704 / imp-33725 so the modules read the SAME spectrum.
 */
function symmetricEigenvalues(matrix) {
  const n = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 500; iter++) {
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
    if (off < 1e-15) break;
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

/**
 * The DECOUPLED-rate probe: pass form at rate s_pass, shear form at rate s_shear, shear
 * coefficient c. This is the imp-3066 R generalised so the pass rate, the shear rate and the
 * shear coefficient are INDEPENDENT knobs -- the device that locates any orthogonal lever.
 * The ADMISSIBLE imp-3066 kernel is exactly the diagonal slice sPass = sShear = s, c = 1.
 */
function decoupledMetrics(sPass, sShear, shearCoefficient) {
  const c = shearCoefficient === undefined ? 1 : shearCoefficient;
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => moment(cosh, sPass, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => c * moment(sinh, sShear, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  const eig = symmetricEigenvalues(R);
  const operatorNorm = Math.max(...eig.map((e) => Math.abs(e)));
  const diagR = R.map((row, i) => row[i]);
  const diagMax = Math.max(...diagR);
  return Object.freeze({
    sPass,
    sShear,
    shearCoefficient: c,
    operatorNorm,
    diagMax,
    operatorDiagonalGap: operatorNorm - diagMax,
  });
}

/** The ADMISSIBLE coupled cell: the imp-3066 R as a function of s = a*U alone. */
function coupledCell(s) {
  return decoupledMetrics(s, s, 1);
}

/**
 * Full tau-domain rebuild at explicit (a, U): confirms the scaling orbit
 * (a,U) -> (a/lambda, lambda*U) leaves every metric of R invariant.
 */
function tauDomainCell(a, lagWindow) {
  const wm = (weightFn, p) => {
    const hq = lagWindow / NQ;
    let acc = 0;
    for (let k = 0; k < NQ; k++) {
      const tau = (k + 0.5) * hq;
      acc += weightFn(a * tau) * Math.pow(tau / lagWindow, p) * hq;
    }
    return acc;
  };
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => wm(cosh, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => wm(sinh, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  const eig = symmetricEigenvalues(R);
  const operatorNorm = Math.max(...eig.map((e) => Math.abs(e)));
  const diagMax = Math.max(...R.map((row, i) => row[i]));
  return Object.freeze({ a, U: lagWindow, s: a * lagWindow, operatorNorm, operatorDiagonalGap: operatorNorm - diagMax });
}

// -- The scaling-invariance orbit at s = 3 (the roadmap G7 anchor product) --------------------
const ANCHOR_S = 3;
const anchorCell = coupledCell(ANCHOR_S);                          // ||R|| ~ 4.617014, gap ~ 3.626095
const ORBIT_PAIRS = Object.freeze([[0.5, 6], [1.5, 2], [0.1, 30], [3, 1]]);  // all a*U = 3
const ORBIT = Object.freeze(ORBIT_PAIRS.map(([a, U]) => tauDomainCell(a, U)));
const orbitInvariant = ORBIT.every(
  (c) => Math.abs(c.operatorNorm - anchorCell.operatorNorm) < 1e-8 &&
         Math.abs(c.operatorDiagonalGap - anchorCell.operatorDiagonalGap) < 1e-8,
);

// -- Candidate lever (ii): decouple the pass rate from the shear rate (fixed s_shear = 3) ------
const PASS_RATE_LADDER = Object.freeze([1, 2, 3, 4, 6]);
const PASS_SWEEP = Object.freeze(PASS_RATE_LADDER.map((sPass) => decoupledMetrics(sPass, ANCHOR_S, 1)));
let passRateSoftensMonotonically = true;                           // ||R|| strictly DECREASES as s_pass rises
for (let i = 1; i < PASS_SWEEP.length; i++) {
  if (PASS_SWEEP[i].operatorNorm >= PASS_SWEEP[i - 1].operatorNorm) passRateSoftensMonotonically = false;
}
const coupledSliceReproducesAnchor =
  Math.abs(PASS_SWEEP[PASS_RATE_LADDER.indexOf(ANCHOR_S)].operatorNorm - anchorCell.operatorNorm) < 1e-9;

// -- Candidate lever (i): the shear-form coefficient c scales ||R|| LINEARLY --------------------
const coeffAnchor = decoupledMetrics(ANCHOR_S, ANCHOR_S, 1);
const coeffDoubled = decoupledMetrics(ANCHOR_S, ANCHOR_S, 2);
const shearCoefficientScalesNormLinearly =
  Math.abs(coeffDoubled.operatorNorm - 2 * coeffAnchor.operatorNorm) < 1e-9;

export const IMP33765_G7_OBSTRUCTION_ORTHOGONAL_LEVER = Object.freeze({
  id: 'imp-33765-g7-obstruction-orthogonal-lever',
  ticket: 'imp-33765',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedAScaling: 'imp-33725-g7-obstruction-a-scaling.js',
  relatedUScaling: 'imp-33704-g7-obstruction-U-scaling.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedOffDiagGrid: 'imp-3107-dehomogenized-offdiag-aU-grid.js',
  roadmapNode: 'G7',

  summary:
    'Derives whether the imp-3066 / G7 shear obstruction admits any orthogonal, non-product ' +
    'lever that softens ||R|| without rescaling s = a*U, following imp-33725 (which found both a ' +
    'and U act only through s). RESULT: over the ADMISSIBLE continuous parameters (single shear ' +
    'rate a, window U) the obstruction is PROVABLY one-dimensional in s -- R is invariant under ' +
    'the scaling orbit (a,U) -> (a/lambda, lambda*U), so the map (a,U) -> ||R|| factors through ' +
    'the single scalar s (four pairs with a*U = 3 give ||R|| = 4.617013710 to nine digits). The ' +
    'candidate orthogonal levers DO move ||R|| off the s-curve but are INADMISSIBLE: (i) the ' +
    'shear-form coefficient c scales ||R|| linearly (c=2 doubles it) yet cosh + c*sinh is a ' +
    'genuine exponential shear only at c=1; (ii) decoupling the pass rate from the shear rate ' +
    'makes R depend on two parameters (s_pass, s_shear) and a larger pass rate STRICTLY softens ' +
    '||R|| (20.94 at s_pass=1 -> 4.617 at the coupled anchor s_pass=3 -> 0.338 at s_pass=6), yet ' +
    'cosh(b*tau) and sinh(a*tau) are the even/odd parts of ONE exponential only when b=a. The ' +
    'only admissible orthogonal axis, the truncation size DEG, sets the all-ones ceiling DEG+1 ' +
    'the monotone-in-s curve saturates to, not a softening. VERDICT: the obstruction is provably ' +
    'one-dimensional in s within the imp-3066 kernel; the orthogonal levers live only OUTSIDE ' +
    'admissibility, requiring the even/odd exponential decomposition to be broken. ' +
    'REPRESENTATIVE / DIAGNOSTIC; ||R|| carries NO RH verdict; imp-3066 / imp-33725 / G7 ' +
    'untouched; not a proof.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3066 / imp-33725 (same phi_j = (tau/U)^j truncation, quadrature, Jacobi eigensolver)',
    admissibleKernel: 'D_jj = int cosh(a*tau) phi_j^2, H_jk = int sinh(a*tau) phi_j phi_k -- the even/odd split of one exponential e^{a*tau}',
    deHomogenizedR: 'R_jk = h_jk(s) / sqrt(d_j(s) d_k(s)), d_j(s) = int_0^1 cosh(s*x) x^{2j} dx, h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx',
    scalingOrbit: 'R invariant under (a,U) -> (a/lambda, lambda*U); level sets a*U = const are the degeneracy orbits',
    decoupledProbe: 'a diagnostic generalisation with independent (s_pass, s_shear, shear coefficient c); the admissible kernel is the slice s_pass = s_shear, c = 1',
    degree: DEG,
    truncationSize: DEG + 1,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, 1]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    anchorProduct: ANCHOR_S,                                       // s = a*U = 3 (roadmap G7 anchor)
    anchorOperatorNorm: anchorCell.operatorNorm,                   // ~4.617014
    anchorGap: anchorCell.operatorDiagonalGap,                     // ~3.626095
    orbitPairs: ORBIT_PAIRS,                                       // four (a,U) with a*U = 3
    orbit: ORBIT,                                                  // identical ||R|| / gap to nine digits
    orbitInvariant,                                                // scaling orbit leaves R invariant
    passRateLadder: PASS_RATE_LADDER,                              // s_pass at fixed s_shear = 3
    passRateSweep: PASS_SWEEP,                                     // ||R|| falls 20.94 -> 4.617 -> 0.338
    passRateSoftensMonotonically,                                  // larger pass rate strictly shrinks ||R||
    coupledSliceReproducesAnchor,                                  // s_pass = s_shear = 3 reproduces the anchor
    shearCoefficientScalesNormLinearly,                            // c = 2 doubles ||R||
    perronCeiling: DEG + 1,                                        // truncation-size-fixed all-ones ceiling
  }),

  interpretation: Object.freeze({
    provablyOneDimensionalInS:
      'Over the admissible continuous parameters (shear rate a, window U) the obstruction is ' +
      'PROVABLY one-dimensional in s = a*U. R is invariant under the one-parameter scaling group ' +
      '(a,U) -> (a/lambda, lambda*U), so the map (a,U) -> ||R|| factors through the single scalar ' +
      's -- there is no admissible orthogonal lever. This upgrades imp-33725 empirical ' +
      '"both act only through s" to a derived scaling-invariance statement.',
    shearCoefficientLeverInadmissible:
      'Rescaling the shear form sinh(a*tau) by a coefficient c scales ||R|| LINEARLY (c=2 doubles ' +
      'it), which is genuinely orthogonal to s. But cosh(a*tau) + c*sinh(a*tau) is an exponential ' +
      'shear e^{a*tau} only at c=1, so c is not a free knob of the imp-3066 kernel -- it is a ' +
      'different kernel. Inadmissible.',
    decoupledRateLeverInadmissible:
      'Decoupling the pass rate b from the shear rate a makes R depend on TWO parameters ' +
      '(s_pass, s_shear); raising b above a inflates the diagonal cosh normalisers and STRICTLY ' +
      'softens ||R|| (20.94 -> 4.617 -> 0.338). This IS an orthogonal, non-product softening ' +
      'lever -- but cosh(b*tau) and sinh(a*tau) are the even/odd parts of one exponential only ' +
      'when b=a, so decoupling breaks the coherent single-multiplier shear. Inadmissible.',
    truncationAxisSetsCeilingNotRelief:
      'The one admissible orthogonal axis is the discrete truncation size DEG. It is not a ' +
      'softening lever: it sets the all-ones Perron ceiling DEG+1 that the monotone-in-s curve ' +
      'saturates to (imp-33704 / imp-33725), it does not walk the obstruction down.',
    verdict:
      'The imp-3066 / G7 obstruction is provably one-dimensional in s = a*U within the admissible ' +
      'exponential-shear kernel. Every orthogonal non-product lever that moves ||R|| off the ' +
      's-curve requires breaking the even/odd decomposition e^{a*tau} = cosh + sinh and is ' +
      'therefore inadmissible; the admissible orthogonal axis sets the ceiling, not a relief. ' +
      'Assessment only; K_a >= 0 untouched.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    decoupledProbeIsDiagnosticNotAdmissibleModification: true,
    opNormCarriesNoRHVerdict:
      'The measured ||R|| is on the SAME representative monomial-moment truncation as imp-3066 / ' +
      'imp-33704 / imp-33725, chosen to EXHIBIT the off-diagonal cross-terms; NOT the section-26 ' +
      'Gram. The decoupled-rate probe deliberately breaks the exponential shear as a DIAGNOSTIC ' +
      'device to locate the orthogonal lever, not as an admissible modification of imp-3066. ' +
      'Neither the one-dimensionality derivation nor the lever classification claims the cover ' +
      'fails or holds.',
    imp3066Untouched: true,
    imp33704Untouched: true,
    imp33725Untouched: true,
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33765_G7_OBSTRUCTION_ORTHOGONAL_LEVER_ASSERTIONS = [
  {
    id: 'imp33765-anchor-matches-roadmap',
    why: 'Cross-check the s = a*U = 3 anchor against the imp-3066 / imp-33725 / roadmap G7 ' +
         'numbers: ||R|| ~ 4.617014, gap ~ 3.626095. A mismatch means the inherited construction ' +
         'drifted.',
    holds: () =>
      Math.abs(anchorCell.operatorNorm - 4.617014) < 1e-5 &&
      Math.abs(anchorCell.operatorDiagonalGap - 3.626095) < 1e-5,
  },
  {
    id: 'imp33765-scaling-orbit-invariant',
    why: 'THE DERIVATION (part 1): R is invariant under (a,U) -> (a/lambda, lambda*U), so every ' +
         '(a,U) with a*U = 3 -- (0.5,6),(1.5,2),(0.1,30),(3,1) -- must give the IDENTICAL ||R|| ' +
         'and gap to eight digits, factoring the map through s alone. A mismatch would break the ' +
         'one-dimensionality.',
    holds: () => orbitInvariant,
  },
  {
    id: 'imp33765-pass-rate-decoupling-softens',
    why: 'THE DERIVATION (part 2): decoupling the pass rate from the shear rate IS a genuine ' +
         'orthogonal softening lever -- at fixed s_shear = 3 the norm ||R|| must strictly ' +
         'DECREASE as s_pass rises (larger diagonal normalisers), and the coupled slice ' +
         's_pass = s_shear = 3 must reproduce the anchor. This lever is inadmissible (breaks the ' +
         'shared-rate exponential) but demonstrably exists.',
    holds: () => passRateSoftensMonotonically && coupledSliceReproducesAnchor,
  },
  {
    id: 'imp33765-shear-coefficient-scales-norm-linearly',
    why: 'THE DERIVATION (part 3): rescaling the shear form by a coefficient c scales R and hence ' +
         '||R|| linearly -- c = 2 must exactly double ||R||. A genuine orthogonal lever, but ' +
         'inadmissible because cosh + c*sinh is an exponential shear only at c = 1.',
    holds: () => shearCoefficientScalesNormLinearly,
  },
  {
    id: 'imp33765-pass-sweep-brackets-anchor',
    why: 'Quantify the softening: the smallest pass rate (s_pass = 1) must give a norm well ABOVE ' +
         'the anchor and the largest (s_pass = 6) well BELOW it, bracketing the coupled anchor -- ' +
         'confirming the decoupled probe moves ||R|| off the s = 3 value in BOTH directions.',
    holds: () =>
      PASS_SWEEP[0].operatorNorm > anchorCell.operatorNorm + 1 &&
      PASS_SWEEP[PASS_SWEEP.length - 1].operatorNorm < anchorCell.operatorNorm - 1,
  },
  {
    id: 'imp33765-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE derivation / diagnostic, the decoupled probe ' +
         'is a diagnostic device (not an admissible imp-3066 modification), ||R|| carries no RH ' +
         'verdict, imp-3066 / imp-33704 / imp-33725 / G7 are untouched, positivity was not ' +
         'attempted, it is not a proof or a reduction, and no refereed bound is changed.',
    holds: () => {
      const c = IMP33765_G7_OBSTRUCTION_ORTHOGONAL_LEVER.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.decoupledProbeIsDiagnosticNotAdmissibleModification === true &&
        c.imp3066Untouched === true &&
        c.imp33704Untouched === true &&
        c.imp33725Untouched === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33765_G7_OBSTRUCTION_ORTHOGONAL_LEVER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33765-g7-obstruction-orthogonal-lever assertion failed: ${assertion.id}`);
  }
}

export default IMP33765_G7_OBSTRUCTION_ORTHOGONAL_LEVER;
