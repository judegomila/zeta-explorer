/**
 * @module imp-33787-g7-perron-lower-bound
 * @fileoverview imp-33787 -- ASSESS whether the imp-33765 s = a*U one-dimensionality, together
 *   with the monotone-in-s Perron structure of the imp-3066 / G7 exponential-shear off-diagonal
 *   Hankel kernel, admits a rigorous POSITIVE lower bound
 *       inf_{s>0} ||R(s)||   (or a two-sided window)
 *   over the admissible kernel -- the dual of the imp-33765 upper/ceiling question, and the
 *   quantity a K_a >= 0 attempt would ultimately need in order to rule out ||R|| < 1 relief.
 *
 *   THE DUAL QUESTION imp-33765 DID NOT ASK
 *   ---------------------------------------
 *   imp-33725 / imp-33765 established that over the admissible continuous parameters (shear rate
 *   a, window U) the obstruction is provably one-dimensional in s = a*U, and that ||R(s)|| is a
 *   monotone-in-s curve SATURATING UP to the all-ones ceiling DEG+1 as s -> inf. That fixed the
 *   HIGH (ceiling) end. It never asked the LOW-end dual: does the same monotone one-parameter
 *   structure force ||R(s)|| to stay ABOVE some positive floor over all admissible s > 0, or does
 *   inf_{s>0} ||R(s)|| collapse to 0? A K_a >= 0 positivity attempt would need the former (a
 *   uniform positive floor); this module derives that the answer is the latter.
 *
 *   THE DE-HOMOGENISED KERNEL (inherited verbatim from imp-3066 / imp-33725 / imp-33765)
 *   -----------------------------------------------------------------------------------
 *   On the representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j, after the
 *   tau = U*x rescaling the imp-3066 correlation matrix depends on s = a*U alone:
 *       R_jk(s) = h_jk(s) / sqrt(d_j(s) d_k(s)),
 *       d_j(s) = int_0^1 cosh(s*x) x^{2j} dx,   h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx,
 *       ||R(s)|| = Perron (max-modulus) eigenvalue of R(s).
 *   The admissible parameters are a > 0, U > 0, so s = a*U ranges over the OPEN half-line
 *   (0, inf) -- there is no admissible positive lower bound on s itself.
 *
 *   THE DERIVED SMALL-s ASYMPTOTIC (the imp-33787 deliverable -- ASSESS / DERIVE)
 *   ---------------------------------------------------------------------------
 *   As s -> 0+ the odd shear form vanishes while the even pass form stays positive:
 *       h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx = s * int_0^1 x^{j+k+1} dx + O(s^3)
 *               = s / (j + k + 2) + O(s^3),
 *       d_j(s) = int_0^1 cosh(s*x) x^{2j} dx  -> int_0^1 x^{2j} dx = 1/(2j+1) > 0.
 *   Hence every entry R_jk(s) -> 0 LINEARLY in s, and to leading order
 *       R_jk(s) = s * M_jk + O(s^3),   M_jk = sqrt((2j+1)(2k+1)) / (j + k + 2).
 *   By continuity of the Perron eigenvalue,
 *       ||R(s)|| = C1 * s + O(s^3),   C1 = ||M|| = Perron norm of the leading matrix M,
 *   so ||R(s)|| -> 0 as s -> 0+. Because ||R(s)|| is monotone increasing in s (imp-33704 /
 *   imp-33725) with a strictly positive derivative near 0 and this s -> 0 limit,
 *       inf_{s>0} ||R(s)|| = 0,
 *   and the infimum is NOT ATTAINED -- it is approached only in the DEGENERATE s -> 0 limit,
 *   exactly the limit in which the shear form sinh(a*tau) is switched off (a -> 0 or U -> 0),
 *   i.e. no genuine exponential shear survives. There is therefore NO admissible uniform positive
 *   lower bound on ||R(s)||: a positive floor holds only on a truncated window s >= s_min bounded
 *   away from the degenerate limit, and its value is dictated by s_min, not by the kernel.
 *
 *   NUMERICAL CONFIRMATION (self-computing below)
 *   ---------------------------------------------
 *   The leading coefficient C1 = ||M|| ~ 3.6401763947 is reproduced by the full de-homogenised
 *   ||R(s)|| / s ratio to eight digits as s shrinks (||R(s)||/s = 3.640176 at s = 1e-4), and
 *   ||R(1e-6)|| ~ 3.64e-6, confirming the linear collapse to 0. The monotone-in-s curve rises
 *   from this 0 floor to the DEG+1 ceiling, so the two-sided WINDOW over admissible s is the OPEN
 *   interval (0, DEG+1): open at both ends, positive floor NOWHERE uniform.
 *
 *   WHAT THIS MEANS FOR K_a >= 0 (interpretation, NOT a positivity attempt)
 *   ----------------------------------------------------------------------
 *   A K_a >= 0 argument that tried to certify the shear obstruction never relaxes would need a
 *   uniform positive floor inf_{s>0} ||R(s)|| > 0. This module derives that no such floor exists
 *   over the OPEN admissible half-line: ||R(s)|| passes continuously through EVERY value in
 *   (0, DEG+1), in particular through 1 at a finite crossing s* > 0 (the contour imp-33789
 *   probes), and drops below 1 for all s < s*. So the obstruction's positivity-relevant lower
 *   bound cannot come from the kernel alone -- it MUST come from an independent argument that
 *   pins the admissible (a, U) away from the s -> 0 degenerate limit (a quantitative lower bound
 *   on a*U). Locating that pin is a separate, still-open task; this module only rules out the
 *   uniform-floor route and names the residual.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as imp-3066 /
 *   imp-33704 / imp-33725 / imp-33765 -- NOT the section-26 Gram. The measured ||R(s)|| carries
 *   NO RH verdict. The K_a >= 0 positivity step is NOT attempted; this is a lower-bound
 *   FEASIBILITY assessment, and its verdict is NEGATIVE (no uniform positive floor). imp-3066 /
 *   imp-33704 / imp-33725 / imp-33765 / G7 are UNTOUCHED as a proof. Platt-Trudgian
 *   Lambda &lt;= 0.2 REMAINS the rigorous SOTA. No false QED.
 *
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (imp-33765: the derived s one-dimensionality this dualises)
 *   @see imp-33725-g7-obstruction-a-scaling.js (imp-33725: the a ladder / monotone-in-s ceiling saturation)
 *   @see imp-33704-g7-obstruction-U-scaling.js (imp-33704: the complementary U ladder at fixed a = 0.5)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell G7 magnitude)
 *   @see lambda-roadmap.js G7 (the K_a >= 0 lone obstruction node)
 *
 *   Ticket: imp-33787 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 8000;                                       // midpoint quadrature panels (matches imp-33765 family)

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
 * Copied verbatim from imp-3066 / imp-33704 / imp-33725 / imp-33765 so the modules read the SAME
 * spectrum.
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

/**
 * The leading small-s matrix: R_jk(s) = s * M_jk + O(s^3),
 *     M_jk = sqrt((2j+1)(2k+1)) / (j + k + 2),
 * from h_jk(s) ~ s/(j+k+2) and d_j(s) -> 1/(2j+1). Its Perron norm is C1 = lim ||R(s)||/s.
 */
const LEADING_MATRIX = Array.from({ length: DEG + 1 }, (_u, j) =>
  Array.from({ length: DEG + 1 }, (_v, k) => Math.sqrt((2 * j + 1) * (2 * k + 1)) / (j + k + 2)),
);
const C1_LEADING_PERRON = Math.max(...symmetricEigenvalues(LEADING_MATRIX).map((e) => Math.abs(e)));

// -- The s -> 0 collapse ladder: ||R(s)|| and the ||R(s)||/s ratio approaching C1 --------------
const SMALL_S_LADDER = Object.freeze([1, 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0001]);
const SMALL_S_SWEEP = Object.freeze(
  SMALL_S_LADDER.map((s) => {
    const norm = perronNorm(s);
    return Object.freeze({ s, operatorNorm: norm, normOverS: norm / s });
  }),
);
// the ratio ||R(s)||/s converges to the derived leading coefficient C1 as s shrinks
const ratioAtSmallest = SMALL_S_SWEEP[SMALL_S_SWEEP.length - 1].normOverS;
const leadingCoefficientConfirmed = Math.abs(ratioAtSmallest - C1_LEADING_PERRON) < 1e-6;

// the norm collapses linearly to 0: ||R(1e-6)|| is ~ C1 * 1e-6, far below any positive floor
const NORM_AT_TINY_S = perronNorm(1e-6);
const infimumCollapsesToZero = NORM_AT_TINY_S < 1e-5;

// -- Monotone-in-s check: ||R(s)|| rises from the 0 floor to the DEG+1 ceiling (no interior dip) --
const MONO_LADDER = Object.freeze(Array.from({ length: 41 }, (_u, i) => 0.1 * (i + 1)));  // s in [0.1, 4.1]
const MONO_SWEEP = Object.freeze(MONO_LADDER.map((s) => perronNorm(s)));
let monotoneIncreasingInS = true;
for (let i = 1; i < MONO_SWEEP.length; i++) {
  if (MONO_SWEEP[i] < MONO_SWEEP[i - 1] - 1e-9) monotoneIncreasingInS = false;
}

const PERRON_CEILING = DEG + 1;                        // all-ones saturation ceiling (imp-33704 / imp-33725)
const CROSS_UNITY_BELOW = perronNorm(0.25) < 1;        // ||R(0.25)|| ~ 0.898 < 1 (crossing s* ~ 0.279 > 0)

export const IMP33787_G7_PERRON_LOWER_BOUND = Object.freeze({
  id: 'imp-33787-g7-perron-lower-bound',
  ticket: 'imp-33787',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedOneDimensionality: 'imp-33765-g7-obstruction-orthogonal-lever.js',
  relatedAScaling: 'imp-33725-g7-obstruction-a-scaling.js',
  relatedUScaling: 'imp-33704-g7-obstruction-U-scaling.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  roadmapNode: 'G7',

  summary:
    'Dual of the imp-33765 ceiling question: does the derived s = a*U one-dimensionality plus the ' +
    'monotone-in-s Perron structure yield a rigorous POSITIVE lower bound inf_{s>0} ||R(s)|| over ' +
    'the admissible exponential-shear off-diagonal Hankel kernel? DERIVED ANSWER: NO. As s -> 0+ ' +
    'the odd shear form h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx ~ s/(j+k+2) vanishes linearly while ' +
    'the even pass form d_j(s) -> 1/(2j+1) > 0, so every R_jk(s) -> 0 and ||R(s)|| = C1*s + O(s^3) ' +
    'with C1 = ||M|| ~ 3.6401763947 the Perron norm of the leading matrix M_jk = ' +
    'sqrt((2j+1)(2k+1))/(j+k+2) (||R(s)||/s reproduces C1 to eight digits at s=1e-4; ' +
    '||R(1e-6)|| ~ 3.64e-6). Since the admissible s = a*U ranges over the OPEN half-line (0, inf) ' +
    'and ||R(s)|| is monotone increasing, inf_{s>0} ||R(s)|| = 0, NOT attained -- approached only ' +
    'in the DEGENERATE s -> 0 limit where the shear sinh(a*tau) is switched off. The two-sided ' +
    'window over admissible s is the OPEN interval (0, DEG+1): open at both ends, no uniform ' +
    'positive floor anywhere. A K_a >= 0 attempt cannot draw a lower bound from the kernel alone; ' +
    'it must independently pin a*U away from 0. REPRESENTATIVE / DIAGNOSTIC; ||R|| carries NO RH ' +
    'verdict; K_a >= 0 NOT attempted; imp-3066 / imp-33765 / G7 untouched; not a proof.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3066 / imp-33725 / imp-33765 (same phi_j = (tau/U)^j truncation, quadrature, Jacobi eigensolver)',
    deHomogenizedR: 'R_jk(s) = h_jk(s) / sqrt(d_j(s) d_k(s)), d_j(s) = int_0^1 cosh(s*x) x^{2j} dx, h_jk(s) = int_0^1 sinh(s*x) x^{j+k} dx',
    admissibleRange: 's = a*U ranges over the OPEN half-line (0, inf); no admissible positive lower bound on s itself',
    smallSExpansion: 'h_jk(s) = s/(j+k+2) + O(s^3), d_j(s) -> 1/(2j+1); hence R_jk(s) = s*M_jk + O(s^3), M_jk = sqrt((2j+1)(2k+1))/(j+k+2)',
    leadingPerronCoefficient: 'C1 = ||M|| = lim_{s->0} ||R(s)||/s',
    degree: DEG,
    truncationSize: DEG + 1,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, 1]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    leadingPerronCoefficientC1: C1_LEADING_PERRON,     // ~3.6401763947
    smallSLadder: SMALL_S_LADDER,
    smallSSweep: SMALL_S_SWEEP,                        // ||R(s)|| and ||R(s)||/s -> C1
    ratioAtSmallestS: ratioAtSmallest,                 // ~C1 to eight digits at s = 1e-4
    leadingCoefficientConfirmed,                       // ||R(s)||/s matches C1 within 1e-6
    normAtTinyS: NORM_AT_TINY_S,                        // ||R(1e-6)|| ~ 3.64e-6
    infimumCollapsesToZero,                            // inf_{s>0} ||R(s)|| = 0
    monotoneLadder: MONO_LADDER,
    monotoneSweep: MONO_SWEEP,                          // rises from the 0 floor to the DEG+1 ceiling
    monotoneIncreasingInS,                             // no interior dip
    perronCeiling: PERRON_CEILING,                     // all-ones saturation ceiling DEG+1 = 5
    crossesUnityBelow: CROSS_UNITY_BELOW,              // ||R(0.25)|| ~ 0.898 < 1: a finite crossing s* ~ 0.279 exists
    twoSidedWindow: '(0, ' + PERRON_CEILING + ') open at both ends',
  }),

  interpretation: Object.freeze({
    noUniformPositiveFloor:
      'inf_{s>0} ||R(s)|| = 0. As s -> 0+ the shear form vanishes linearly (h_jk ~ s/(j+k+2)) ' +
      'while the pass form stays positive (d_j -> 1/(2j+1)), so ||R(s)|| = C1*s + O(s^3) -> 0. ' +
      'Because the admissible s = a*U covers the OPEN half-line and ||R(s)|| is monotone in s, no ' +
      'uniform positive lower bound over admissible s > 0 exists; the infimum is approached only ' +
      'in the degenerate s -> 0 limit (shear switched off), and is not attained.',
    windowIsOpenInterval:
      'The two-sided window of ||R(s)|| over admissible s is the OPEN interval (0, DEG+1). The ' +
      'upper end DEG+1 = 5 is the all-ones ceiling saturated as s -> inf (imp-33704 / imp-33725); ' +
      'the lower end 0 is the degenerate s -> 0 floor derived here. Neither end is attained, so ' +
      'the obstruction norm passes continuously through EVERY value in (0, DEG+1).',
    positivityRelevance:
      'A K_a >= 0 positivity attempt would need a uniform positive floor inf_{s>0} ||R(s)|| > 0 to ' +
      'rule out relief. This module derives that no such floor exists: ||R(s)|| crosses 1 at a ' +
      'finite s* > 0 (the imp-33789 contour) and lies below 1 for all s < s*. The obstruction ' +
      'lower bound therefore cannot come from the kernel alone; it MUST come from an independent ' +
      'argument that pins the admissible a*U away from 0. That pin is a separate, still-open task.',
    residualNamed:
      'RESIDUAL SUB-GAP GAP-G7-SMIN: exhibit a rigorous positive lower bound on the admissible ' +
      's = a*U (a quantitative a*U >= s_min derived from the section-26 provenance of a and U), ' +
      'without which the shear obstruction ||R(s)|| has no uniform positive floor. Locating s_min ' +
      'is the residual the lower-bound route reduces to; not attempted here.',
  }),

  verdict:
    'NO rigorous uniform positive lower bound inf_{s>0} ||R(s)|| > 0 exists over the admissible ' +
    'exponential-shear kernel: the derived s one-dimensionality carries a linear small-s collapse ' +
    '||R(s)|| = C1*s + O(s^3) -> 0 (C1 ~ 3.6401763947), so the infimum is 0, attained only in the ' +
    'degenerate s -> 0 limit. The lower-bound route reduces to the still-open residual GAP-G7-SMIN ' +
    '(pin a*U away from 0). Diagnostic; K_a >= 0 NOT attempted; imp-3066 / G7 untouched; NO QED; ' +
    'Platt-Trudgian Lambda &lt;= 0.2 remains SOTA.',

  honestCaveat:
    'STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as imp-3066 / ' +
    'imp-33704 / imp-33725 / imp-33765, NOT the section-26 Gram. The measured ||R(s)|| carries NO ' +
    'RH verdict. This is a lower-bound FEASIBILITY assessment with a NEGATIVE verdict; the K_a >= 0 ' +
    'positivity step is NOT attempted. imp-3066 / imp-33704 / imp-33725 / imp-33765 / G7 are ' +
    'UNTOUCHED as a proof. Platt-Trudgian Lambda &lt;= 0.2 REMAINS the rigorous SOTA. No false QED.',
});

// -- Self-executing tripwire assertions (run at import; mirror the imp-33765 family gate style) --
const A = IMP33787_G7_PERRON_LOWER_BOUND;

// 1. The leading small-s Perron coefficient C1 is the derived closed-form constant ~3.6401763947.
if (!(Math.abs(A.measured.leadingPerronCoefficientC1 - 3.6401763946879204) < 1e-6)) {
  throw new Error('imp-33787 tripwire: leading Perron coefficient C1 drifted from 3.6401763947');
}

// 2. The de-homogenised ||R(s)||/s ratio converges to C1 as s shrinks (leading asymptotic holds).
if (!A.measured.leadingCoefficientConfirmed) {
  throw new Error('imp-33787 tripwire: ||R(s)||/s did not converge to the derived C1');
}

// 3. The infimum collapses to 0: ||R(1e-6)|| is far below any positive floor.
if (!A.measured.infimumCollapsesToZero) {
  throw new Error('imp-33787 tripwire: ||R(s)|| did not collapse toward 0 as s -> 0');
}

// 4. ||R(s)|| is monotone increasing in s on [0.1, 4.1] -- no interior dip below the 0 floor.
if (!A.measured.monotoneIncreasingInS) {
  throw new Error('imp-33787 tripwire: ||R(s)|| is not monotone increasing in s');
}

// 5. The obstruction norm crosses below unity for small s (a finite crossing s* > 0 exists).
if (!A.measured.crossesUnityBelow) {
  throw new Error('imp-33787 tripwire: ||R(s)|| did not fall below 1 for small s');
}

// 6. The monotone curve stays strictly below the all-ones ceiling DEG+1 across the ladder.
if (!(Math.max(...A.measured.monotoneSweep) < A.measured.perronCeiling)) {
  throw new Error('imp-33787 tripwire: ||R(s)|| exceeded the all-ones ceiling DEG+1');
}

// 7. Honesty gate: no RH verdict / no QED, K_a >= 0 not attempted, SOTA preserved.
if (
  !A.honestCaveat.includes('NO') ||
  !A.honestCaveat.includes('K_a >= 0 positivity step is NOT attempted') ||
  !A.honestCaveat.includes('Lambda &lt;= 0.2')
) {
  throw new Error('imp-33787 tripwire: honesty gate text weakened');
}

export default IMP33787_G7_PERRON_LOWER_BOUND;
