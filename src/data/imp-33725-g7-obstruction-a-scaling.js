/**
 * @module imp-33725-g7-obstruction-a-scaling
 * @fileoverview imp-33725 -- Assess the a-DEPENDENCE (holding U = 6 fixed) of the
 *   imp-3066 G7 off-diagonal endpoint-Hankel operator/diagonal gap (the ~3.626
 *   obstruction at a = 0.5, U = 6) by MEASURING the Perron operator norm ||R||, the
 *   diagonal maximum, the off-diagonal Frobenius norm and the operator/diagonal gap
 *   across an a ladder at FIXED U = 6, then DERIVING whether any a-window softens the
 *   K_a >= 0 barrier. Complementary to imp-33704 (which sweeps U at fixed a = 0.5).
 *
 *   THE GAP THIS FILLS (the imp-33725 ticket)
 *   -----------------------------------------
 *   imp-33704 tabulated the U-scaling of the G7 obstruction at fixed a = 0.5. The shear
 *   weight a itself (anchored at a = 0.5 in imp-3066 / the lambda-roadmap G7 node) was
 *   never swept. This module sweeps a at FIXED U = 6, reusing the imp-3066 construction
 *   verbatim, and DERIVES the a-scaling -- specifically whether the obstruction magnitude
 *   shrinks, saturates or grows in a, i.e. whether a favorable a-window exists.
 *
 *   THE SETUP (inherited verbatim from imp-3066)
 *   --------------------------------------------
 *   On the same representative degree-DEG monomial truncation phi_j(tau) = (tau/U)^j:
 *       D_jj = int_0^U cosh(a*tau) phi_j^2 d(tau),
 *       H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau),
 *       R_jk = H_jk / sqrt(D_jj D_kk),   ||R|| = Perron eigenvalue of R.
 *   Substituting tau = U*x cancels the shared U prefactor, so R -- and hence EVERY metric
 *   (||R||, max diag, off-diagonal Frobenius, gap) -- is a function of s = a*U alone (the
 *   imp-33704 / imp-3107 scale reduction). At FIXED U = 6 the a ladder is therefore the s
 *   ladder s = 6a: the a-dependence of the obstruction IS the SAME one-parameter curve as
 *   the U-dependence, only reparametrized. Neither a nor U is an independent lever; only
 *   the product s = a*U is.
 *
 *   WHAT IS MEASURED / DERIVED (the imp-33725 deliverable -- MEASURE ONLY)
 *   ---------------------------------------------------------------------
 *   (1) THE a LADDER. Per a in {0.0625,0.125,0.25,0.5,1,2,4} at fixed U = 6 (s = 6a =
 *       0.375..24): ||R||, max diag(R), off-diagonal Frobenius norm of R, and the
 *       operator/diagonal gap ||R|| - max diag. The a = 0.5 cell (s = 3) reproduces the
 *       roadmap G7 anchor exactly (gap ~ 3.626, ||R|| ~ 4.617, off-diag Frobenius ~ 4.082).
 *   (2) THE DERIVED SCALING. The obstruction gap GROWS MONOTONICALLY with a: it climbs
 *       0.999 (a=0.0625) -> 3.626 (a=0.5, the roadmap headline) -> 3.985 (a=4). As a -> inf
 *       it SATURATES at the same all-ones ceiling as the U ladder; as a -> 0 it VANISHES.
 *   (3) THE TWO LIMITS (derived).
 *       - a -> inf (s -> inf): every R_jk -> 1 (cosh, sinh -> e^{s*x}), so R -> the all-ones
 *         (DEG+1) x (DEG+1) matrix J, Perron(J) = DEG+1 = 5. Hence ||R|| -> 5, max diag -> 1,
 *         gap -> DEG = 4, off-diagonal Frobenius -> sqrt(DEG(DEG+1)) = sqrt(20) ~ 4.4721 --
 *         the IDENTICAL truncation-size-fixed ceiling imp-33704 derived for U -> inf.
 *       - a -> 0 (s -> 0): sinh(a*tau) -> 0 while cosh(a*tau) -> 1, so H_jk -> 0, D_jj -> a
 *         positive constant, hence every R_jk -> 0 and ||R|| -> 0, gap -> 0 (linearly in s).
 *         The obstruction VANISHES -- but only because the shear form itself is switched off
 *         (sinh(a*tau) -> 0), a TRIVIAL relief, not a genuine positivity window.
 *   (4) THE VERDICT (derived). There is NO nontrivial favorable a-window that softens the
 *       K_a >= 0 barrier. The gap is strictly monotone in a with a single trivial soft end
 *       (a -> 0, where the shear vanishes) and a saturating hard end (a -> inf, the all-ones
 *       ceiling). Combined with imp-33704: neither a nor U individually is a lever on the G7
 *       obstruction -- both act only through s = a*U, and the obstruction grows monotonically
 *       in s toward the truncation-size-fixed ceiling. Narrowing a (like narrowing U) merely
 *       walks down the same monotone curve toward the trivial zero-shear limit.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   STRUCTURAL / DIAGNOSTIC on the SAME representative monomial truncation as imp-3066 /
 *   imp-33704 -- NOT the section-26 Gram. The measured ||R|| and gap carry NO RH verdict:
 *   this is a pure measurement of how the off-diagonal obstruction magnitude scales with the
 *   shear weight a at fixed U = 6, and a derivation that it is monotone in a (no favorable
 *   interior window), vanishing trivially as a -> 0 and saturating at the all-ones ceiling as
 *   a -> inf. imp-3066 / imp-33704 / G7 are UNTOUCHED as a proof; the K_a >= 0 positivity
 *   step is NOT attempted; the bare-V pilot (imp-1240) is NOT re-run. Platt-Trudgian
 *   Lambda &lt;= 0.2 REMAINS the rigorous SOTA. No false QED.
 *
 *   @see imp-33704-g7-obstruction-U-scaling.js (imp-33704: the complementary U ladder at fixed a = 0.5)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell G7 magnitude)
 *   @see imp-3107-dehomogenized-offdiag-aU-grid.js (imp-3107: the de-homogenized off-diag entries track s = a*U)
 *   @see lambda-roadmap.js G7 (the K_a >= 0 lone obstruction node)
 *
 *   Ticket: imp-33725 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const U = 6;                                            // FIXED lag window (the imp-3066 headline grid)
const A_LADDER = Object.freeze([0.0625, 0.125, 0.25, 0.5, 1, 2, 4]);  // shear weights (s = a*U = 0.375..24)
const DEG = 4;                                         // same representative (DEG+1) x (DEG+1) truncation
const NQ = 4000;                                       // midpoint quadrature panels (matches imp-3066)

const cosh = Math.cosh;
const sinh = Math.sinh;

/** Midpoint quadrature of int_0^U weightFn(a*tau) * (tau/U)^p d(tau) on the lag tau. */
function weightedMoment(weightFn, a, lagWindow, p) {
  const hq = lagWindow / NQ;
  let acc = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * hq;
    acc += weightFn(a * tau) * Math.pow(tau / lagWindow, p) * hq;
  }
  return acc;
}

/**
 * Classic cyclic Jacobi eigenvalues for a small SYMMETRIC matrix (self-contained, no deps).
 * For our strictly-positive R the largest is the Perron operator norm. Copied verbatim from
 * imp-3066 / imp-33704 so the three modules read the SAME spectrum.
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

/** One (a, U) cell: build R exactly as imp-3066 and read off the G7 obstruction metrics. */
function cellMetrics(a, lagWindow) {
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => weightedMoment(cosh, a, lagWindow, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => weightedMoment(sinh, a, lagWindow, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  const eig = symmetricEigenvalues(R);
  const operatorNorm = Math.max(...eig.map((e) => Math.abs(e)));   // ||R|| = Perron eigenvalue
  const diagR = R.map((row, i) => row[i]);
  const diagMax = Math.max(...diagR);
  let offDiagFrobeniusSq = 0;
  for (let j = 0; j <= DEG; j++) {
    for (let k = 0; k <= DEG; k++) {
      if (j === k) continue;
      offDiagFrobeniusSq += R[j][k] * R[j][k];
    }
  }
  return Object.freeze({
    a,
    U: lagWindow,
    s: a * lagWindow,
    operatorNorm,                          // ||R||
    diagMax,                               // max diag(R) (the scalar-cover ceiling < 1)
    offDiagonalFrobeniusNormOfR: Math.sqrt(offDiagFrobeniusSq),
    operatorDiagonalGap: operatorNorm - diagMax,   // the G7 obstruction magnitude
  });
}

// The a ladder at fixed U = 6.
const LADDER = Object.freeze(A_LADDER.map((a) => cellMetrics(a, U)));

// Derived all-ones ceiling (a -> inf): R -> J (all-ones) as s -> inf, Perron(J) = DEG+1.
const PERRON_CEILING = DEG + 1;                                   // ||R|| -> 5
const GAP_CEILING = DEG;                                          // gap -> 4 (Perron - 1)
const OFFDIAG_FROBENIUS_CEILING = Math.sqrt(DEG * (DEG + 1));     // -> sqrt(20) ~ 4.4721

// Is the obstruction gap monotone increasing in a across the whole ladder?
let gapMonotoneIncreasingInA = true;
for (let i = 1; i < LADDER.length; i++) {
  if (LADDER[i].operatorDiagonalGap <= LADDER[i - 1].operatorDiagonalGap) gapMonotoneIncreasingInA = false;
}

// Every metric sits strictly below its all-ones ceiling on the whole ladder.
const allBelowCeiling = LADDER.every(
  (c) =>
    c.operatorNorm < PERRON_CEILING &&
    c.operatorDiagonalGap < GAP_CEILING &&
    c.offDiagonalFrobeniusNormOfR < OFFDIAG_FROBENIUS_CEILING &&
    c.diagMax < 1,
);

const headlineCell = cellMetrics(0.5, U);        // the roadmap G7 anchor cell (a = 0.5, s = 3)
const smallACell = LADDER[0];                    // a = 0.0625, s = 0.375: closest to the trivial zero-shear end
const tailCell = LADDER[LADDER.length - 1];      // a = 4, s = 24: closest to the all-ones ceiling

export const IMP33725_G7_OBSTRUCTION_A_SCALING = Object.freeze({
  id: 'imp-33725-g7-obstruction-a-scaling',
  ticket: 'imp-33725',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedUScaling: 'imp-33704-g7-obstruction-U-scaling.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  relatedOffDiagGrid: 'imp-3107-dehomogenized-offdiag-aU-grid.js',
  roadmapNode: 'G7',

  summary:
    'Sweeps the shear weight a at FIXED U = 6 across the imp-3066 representative degree-4 monomial ' +
    'truncation and DERIVES the a-scaling of the G7 K_a >= 0 obstruction magnitude, complementary to ' +
    'imp-33704 (which sweeps U at fixed a = 0.5). By the imp-33704 / imp-3107 scale reduction every ' +
    'metric of R depends on s = a*U alone, so at fixed U = 6 the a ladder is the s ladder s = 6a: the ' +
    'a-dependence is the SAME one-parameter curve as the U-dependence, reparametrized. FINDING: the ' +
    'obstruction gap GROWS MONOTONICALLY with a -- 0.999 (a=0.0625) -> 3.626 (a=0.5, the roadmap ' +
    'headline) -> 3.985 (a=4). TWO LIMITS: as a -> inf (s -> inf) every R_jk -> 1, so R -> the all-ones ' +
    '5x5 matrix J with Perron eigenvalue DEG+1 = 5, hence ||R|| -> 5, gap -> DEG = 4, off-diagonal ' +
    'Frobenius -> sqrt(20) ~ 4.4721 (the IDENTICAL ceiling imp-33704 derived for U -> inf); as a -> 0 ' +
    '(s -> 0) sinh(a*tau) -> 0 so every R_jk -> 0 and the gap VANISHES linearly -- but only because the ' +
    'shear form itself is switched off, a TRIVIAL relief. VERDICT: NO nontrivial favorable a-window ' +
    'softens the K_a >= 0 barrier; the gap is strictly monotone in a between a trivial zero-shear soft ' +
    'end and the saturating all-ones hard end. Combined with imp-33704: neither a nor U individually is ' +
    'a lever -- both act only through s = a*U. REPRESENTATIVE / DIAGNOSTIC; ||R|| carries NO RH verdict; ' +
    'imp-3066 / imp-33704 / G7 untouched; not a proof.',

  construction: Object.freeze({
    inheritedFrom: 'imp-3066-offdiagonal-hankel-obstruction.js (same phi_j = (tau/U)^j truncation, quadrature, Jacobi eigensolver)',
    deHomogenizedR: 'R_jk = H_jk / sqrt(D_jj D_kk), D_jj = int cosh(a*tau)(tau/U)^{2j}, H_jk = int sinh(a*tau)(tau/U)^{j+k}',
    scaleReduction: 'tau = U*x => every metric of R depends on s = a*U alone; at fixed U the a ladder is the s ladder s = 6a',
    U,
    aLadder: A_LADDER,
    degree: DEG,
    truncationSize: DEG + 1,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, U]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladder: LADDER,                                    // per a: s, ||R||, max diag, off-diag Frobenius, gap
    headlineGapAtA05: headlineCell.operatorDiagonalGap,          // ~3.626095 (matches roadmap G7)
    headlineOperatorNormAtA05: headlineCell.operatorNorm,        // ~4.617014
    headlineOffDiagFrobeniusAtA05: headlineCell.offDiagonalFrobeniusNormOfR,  // ~4.081529
    headlineDiagMaxAtA05: headlineCell.diagMax,                  // ~0.990918
    smallAGap: smallACell.operatorDiagonalGap,                   // ~0.999290 at a = 0.0625 (heading to 0 as a -> 0)
    smallAOperatorNorm: smallACell.operatorNorm,                 // ~1.324525
    tailGapAtA4: tailCell.operatorDiagonalGap,                   // ~3.985464 (closest to the ceiling 4)
    tailOperatorNormAtA4: tailCell.operatorNorm,                 // ~4.985464 (closest to 5)
    gapMonotoneIncreasingInA,                          // gap rises with a (no favorable interior window)
    allMetricsBelowAllOnesCeiling: allBelowCeiling,
    perronCeiling: PERRON_CEILING,                     // ||R|| -> DEG+1 = 5
    gapCeiling: GAP_CEILING,                           // gap -> DEG = 4
    offDiagFrobeniusCeiling: OFFDIAG_FROBENIUS_CEILING,  // -> sqrt(DEG(DEG+1)) ~ 4.4721
  }),

  interpretation: Object.freeze({
    obstructionGrowsWithA:
      'The G7 operator/diagonal gap increases monotonically with the shear weight a at fixed U = 6 ' +
      '(0.999 at a=0.0625 to 3.985 at a=4). Increasing a strengthens the off-diagonal cross-terms, so ' +
      'it CANNOT relieve the K_a >= 0 obstruction -- the obstruction is worst at large shear weight.',
    aAndUActOnlyThroughS:
      'By tau = U*x every metric depends on s = a*U alone, so the a ladder at fixed U = 6 IS the s ' +
      'ladder s = 6a -- the SAME curve imp-33704 traced by sweeping U at fixed a = 0.5. The a = 0.5 ' +
      'cell (s = 3) reproduces the roadmap anchor exactly. Neither a nor U is an independent lever on ' +
      'G7; only their product s matters, and the obstruction grows monotonically in s.',
    noFavorableAWindow:
      'There is NO nontrivial favorable a-window. Shrinking a walks DOWN the same monotone curve toward ' +
      'the a -> 0 (s -> 0) limit, where sinh(a*tau) -> 0 switches the shear form off entirely: the gap ' +
      'vanishes linearly, but the obstruction is relieved only by DELETING the shear, not by a genuine ' +
      'positivity window. Growing a saturates at the all-ones ceiling (gap -> DEG = 4), the identical ' +
      'truncation-size-fixed limit imp-33704 found for U -> inf. Assessment only; K_a >= 0 untouched.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    opNormCarriesNoRHVerdict:
      'The measured ||R|| and gap are on the SAME representative monomial-moment truncation as ' +
      'imp-3066 / imp-33704, chosen to EXHIBIT the off-diagonal cross-terms; NOT the section-26 Gram, ' +
      'so they neither claim the cover fails nor that it holds. Only the a-scaling of the obstruction ' +
      'magnitude, its vanishing trivial a -> 0 limit and its all-ones a -> inf saturation are asserted.',
    imp3066Untouched: true,
    imp33704Untouched: true,
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
    didNotRerunBarePilot: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33725_G7_OBSTRUCTION_A_SCALING_ASSERTIONS = [
  {
    id: 'imp33725-ladder-shape',
    why: 'The sweep covers the full a ladder at fixed U = 6; a count drift means the ladder build ' +
         'dropped or duplicated a cell.',
    holds: () => LADDER.length === A_LADDER.length && LADDER.every((c) => c.U === U),
  },
  {
    id: 'imp33725-headline-matches-imp3066-and-roadmap',
    why: 'Cross-check the (a,U) = (0.5,6) anchor against the imp-3066 / imp-33704 / lambda-roadmap G7 ' +
         'numbers: operator/diagonal gap ~ 3.626, ||R|| ~ 4.617, off-diagonal Frobenius ~ 4.082, max ' +
         'diag ~ 0.9909. A mismatch means the inherited construction drifted from imp-3066.',
    holds: () =>
      Math.abs(headlineCell.operatorDiagonalGap - 3.626095) < 1e-5 &&
      Math.abs(headlineCell.operatorNorm - 4.617014) < 1e-5 &&
      Math.abs(headlineCell.offDiagonalFrobeniusNormOfR - 4.081529) < 1e-5 &&
      Math.abs(headlineCell.diagMax - 0.990918) < 1e-5,
  },
  {
    id: 'imp33725-gap-monotone-increasing-in-a',
    why: 'THE FINDING (part 1): the G7 obstruction gap ||R|| - max diag GROWS with the shear weight a ' +
         'at fixed U = 6. It must be strictly increasing across the ladder; a non-monotone trend would ' +
         'mean some interior a-window relieves the obstruction (there is none).',
    holds: () => gapMonotoneIncreasingInA,
  },
  {
    id: 'imp33725-a-ladder-is-the-s-ladder',
    why: 'THE FINDING (part 2): every metric depends on s = a*U alone, so the a ladder at fixed U = 6 ' +
         'IS the s ladder s = 6a. Rebuild the anchor as (a,U) = (0.25,12) (s = 3, a DIFFERENT a and U ' +
         'with the same product) and require its gap to coincide with the (0.5,6) anchor to machine ' +
         'precision -- confirming a and U act only through s. A mismatch would break the reduction.',
    holds: () => Math.abs(cellMetrics(0.25, 12).operatorDiagonalGap - headlineCell.operatorDiagonalGap) < 1e-9,
  },
  {
    id: 'imp33725-small-a-relieves-toward-zero',
    why: 'THE FINDING (part 3): the ONLY soft direction is a -> 0. The smallest-a cell (a = 0.0625, ' +
         's = 0.375) must have a STRICTLY SMALLER gap than the anchor and a strictly positive ||R|| ' +
         'heading toward 0 -- the trivial zero-shear relief (sinh(a*tau) -> 0), not a genuine window.',
    holds: () =>
      smallACell.operatorDiagonalGap < headlineCell.operatorDiagonalGap &&
      smallACell.operatorDiagonalGap > 0 &&
      smallACell.operatorNorm > 0 &&
      smallACell.operatorNorm < headlineCell.operatorNorm,
  },
  {
    id: 'imp33725-every-metric-below-all-ones-ceiling',
    why: 'THE DERIVED CEILING: as s = a*U -> inf every R_jk -> 1, so R -> the all-ones (DEG+1)x(DEG+1) ' +
         'matrix J with Perron eigenvalue DEG+1 -- the IDENTICAL ceiling imp-33704 derived for U. Every ' +
         'measured ||R||, gap and off-diagonal Frobenius must sit strictly below DEG+1, DEG, ' +
         'sqrt(DEG(DEG+1)) (and every max diag < 1). A value at or above a ceiling would break the limit.',
    holds: () => allBelowCeiling,
  },
  {
    id: 'imp33725-tail-approaches-ceiling-from-below',
    why: 'Saturation, quantified: the tail cell a = 4 (s = 24) must be the CLOSEST to the ceilings and ' +
         'within a small margin -- ||R|| within 0.1 of DEG+1 = 5 and gap within 0.1 of DEG = 4 -- ' +
         'confirming the a ladder approaches the all-ones limit from below, matching imp-33704.',
    holds: () =>
      PERRON_CEILING - tailCell.operatorNorm > 0 &&
      PERRON_CEILING - tailCell.operatorNorm < 0.1 &&
      GAP_CEILING - tailCell.operatorDiagonalGap > 0 &&
      GAP_CEILING - tailCell.operatorDiagonalGap < 0.1,
  },
  {
    id: 'imp33725-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE diagnostic sweep, ||R|| carries no RH verdict, ' +
         'imp-3066 / imp-33704 / G7 are untouched, positivity was not attempted, it is not a proof or a ' +
         'reduction, and PT 0.2 stays SOTA. If any of these flip the module is over-claiming.',
    holds: () => {
      const c = IMP33725_G7_OBSTRUCTION_A_SCALING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.imp3066Untouched === true &&
        c.imp33704Untouched === true &&
        c.didNotAttemptPositivity === true &&
        c.didNotRerunBarePilot === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33725_G7_OBSTRUCTION_A_SCALING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33725-g7-obstruction-a-scaling assertion failed: ${assertion.id}`);
  }
}

export default IMP33725_G7_OBSTRUCTION_A_SCALING;
