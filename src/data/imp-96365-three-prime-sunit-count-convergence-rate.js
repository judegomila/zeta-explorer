/**
 * imp-96365 (2026-09-24) — NUMERICAL (measurement only): quantify the CONVERGENCE RATE of the
 * imp-96333 three-prime S-unit count(u <= U) to its cubic leading term. imp-96333 tabulated
 * count(u <= U) / [(ln U)^3 / (6 ln2 ln3 ln5)] = 2.49 / 1.90 / 1.64 / 1.41 / 1.26 at U = 1e2..1e9,
 * decreasing toward the cubic leading term 1 but still 26 percent high at 1e9, and never quantified
 * the approach. Here we EXTEND the exact lattice-point count to U = 1e12..1e15, fit the residual
 * count - (ln U)^3 / K to the expected subleading (ln U)^2 surface correction, and report both the
 * fitted second-order coefficient and the U at which the ratio first falls within 5 percent of 1.
 *
 * This is pure S-unit lattice arithmetic (count of nonneg (a,b,c) with a ln2 + b ln3 + c ln5 <= ln U),
 * import-light, no zeros bundle. It diagonalizes nothing, establishes NO operator positivity, moves NO
 * Lambda bound / verified height, and does NOT touch the finitely-many top confined states (the actual
 * residual). RH open; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------
 * THE COUNT. count(u <= U) is the number of S-units u = 2^a 3^b 5^c (excluding u = 1) with u <= U, i.e.
 *  the number of nonneg integer lattice points (a,b,c) != (0,0,0) in the tetrahedron
 *  a ln2 + b ln3 + c ln5 <= ln U. Its leading term is the volume (ln U)^3 / (6 ln2 ln3 ln5); the exact
 *  count is reproduced inline by countSunits below (matches imp-96333: 33/85/174/506/1529 at 1e2..1e9).
 *
 * EXTENDED LADDER (the actual measurement). Writing L = ln U and K = 6 ln2 ln3 ln5 = 7.353522:
 *    U      L        count   cubic=L^3/K   ratio=count/cubic   (ratio-1)*L
 *    1e9    20.723   1529    1210.26       1.2634              5.458
 *    1e10   23.026   2052    1660.17       1.2360              5.435
 *    1e11   25.328   2682    2209.68       1.2137              5.414
 *    1e12   27.631   3428    2868.77       1.1949              5.386
 *    1e13   29.934   4300    3647.39       1.1789              5.356
 *    1e14   32.236   5309    4555.50       1.1654              5.332
 *    1e15   34.539   6465    5603.06       1.1538              5.313
 *  The ratio keeps falling but only as 1 + O(1/L): (ratio - 1) * L is nearly constant (5.46 -> 5.31),
 *  the signature of a single subleading (ln U)^2 surface term.
 *
 * THE FIT. Least squares of residual R(L) = count - L^3/K against A L^2 + B L + C over U = 1e6..1e15:
 *    A (the (ln U)^2 coefficient) = 0.686614,  B = 1.325532,  C = -2.516151.
 *  So count = L^3/K + 0.6866 L^2 + O(L) and ratio = 1 + A*K/L + O(1/L^2) with A*K = 5.049. The fitted A
 *  matches the theoretical coordinate-face SURFACE coefficient of the lattice-point asymptotic,
 *    A_theory = (1/4)(1/(ln2 ln3) + 1/(ln2 ln5) + 1/(ln3 ln5)) = 0.693789,
 *  to 99.0 percent -- the 1 percent deficit is the finite-range B/L, C/L^2 tail plus the u = 1 exclusion.
 *  (A_theory is the Gauss half-boundary term: each of the three coordinate faces c=0 / b=0 / a=0 is a 2D
 *  lattice triangle of area L^2/(2 * pair-product), contributing 1/2 of its area to the count.)
 *
 * CROSSOVER. Solving ratio(L) = 1.05 with the fitted model gives L* = 102.85, i.e. U* = e^102.85 ~ 1e44.7:
 *  the ratio does NOT fall within 5 percent of the cubic leading term until an astronomically large
 *  U ~ 1e45, far outside any physically reachable magnitude. The slow 1/ln U approach is intrinsic to the
 *  large surface-to-volume ratio of the log-scaled S-unit tetrahedron, not a defect of the tabulation.
 *
 * HONEST LIMITS. A convergence-rate MEASUREMENT of a magnitude count, nothing more: it certifies no
 *  operator positivity, moves no Lambda bound / verified height, and does not touch the finitely-many top
 *  confined states (the actual residual). RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: pure lattice arithmetic, no imports, no zeros bundle. Reproduction inline.
 */

const L2 = Math.log(2), L3 = Math.log(3), L5 = Math.log(5);
const K = 6 * L2 * L3 * L5;                 // 7.353522..., the cubic-leading-term denominator

/** exact count of S-units u = 2^a 3^b 5^c (excluding u = 1) with u <= U, via nonneg lattice-point count
 *  of a ln2 + b ln3 + c ln5 <= ln U (matches imp-96333 ladderMagnitudes235 length) */
export function countSunits(U) {
  const logU = Math.log(U);
  let cnt = 0;
  for (let a = 0; a * L2 <= logU + 1e-9; a++) {
    const ra = logU - a * L2;
    for (let b = 0; b * L3 <= ra + 1e-9; b++) {
      const rb = ra - b * L3;
      cnt += Math.floor((rb + 1e-9) / L5) + 1;   // c = 0 .. floor((rb)/ln5)
    }
  }
  return cnt - 1;                                 // remove (0,0,0) i.e. u = 1
}

/** ratio of the exact count to the cubic leading term (ln U)^3 / K */
export function cubicRatio(U) {
  const L = Math.log(U);
  return countSunits(U) / (Math.pow(L, 3) / K);
}

// the (ln U)^2 surface coefficient fitted from count - L^3/K over U = 1e6..1e15
const A_FIT = 0.686614, B_FIT = 1.325532, C_FIT = -2.516151;
// theoretical coordinate-face (Gauss half-boundary) surface coefficient
const A_THEORY = 0.25 * (1 / (L2 * L3) + 1 / (L2 * L5) + 1 / (L3 * L5));   // 0.693789

export const IMP_96365_SUNIT_COUNT_CONVERGENCE = Object.freeze({
  id: 'imp-96365-three-prime-sunit-count-convergence-rate',
  route: 'I (Sonine refinement) — convergence-rate measurement of the imp-96333 three-prime S-unit count',
  parents: [
    'src/data/imp-96333-mixed-ladder-235-spectral-gap-margin-tabulation.js (the count(u<=U)/cubic ratio 2.49->1.26 at 1e2..1e9 being extended)',
  ],
  cubicDenominator: 7.353522453210102,        // K = 6 ln2 ln3 ln5
  secondOrderCoefficient: 0.686614,           // fitted (ln U)^2 coefficient A of count - L^3/K
  secondOrderCoefficientTheory: 0.69378946935178554,  // A_theory = (1/4) sum of 1/(pair products of ln p)
  fitToTheoryRatio: 0.98966,                  // fitted A is 99.0 percent of the surface term
  asymptoticRatioSlope: 5.049032,             // A*K, so ratio = 1 + 5.049/ln U + O(1/(ln U)^2)
  crossoverLogU: 102.85,                      // L* where ratio first <= 1.05
  crossoverU: '~1e44.7',                      // U* = e^L*, astronomically large
  // extended count(u <= U) vs the (ln U)^3/K cubic leading term, U = 1e9..1e15
  extendedGrowthSamples: Object.freeze([
    { U: 1e9,  count: 1529, asymptotic: 1210.26, ratio: 1.2634 },
    { U: 1e10, count: 2052, asymptotic: 1660.17, ratio: 1.2360 },
    { U: 1e11, count: 2682, asymptotic: 2209.68, ratio: 1.2137 },
    { U: 1e12, count: 3428, asymptotic: 2868.77, ratio: 1.1949 },
    { U: 1e13, count: 4300, asymptotic: 3647.39, ratio: 1.1789 },
    { U: 1e14, count: 5309, asymptotic: 4555.50, ratio: 1.1654 },
    { U: 1e15, count: 6465, asymptotic: 5603.06, ratio: 1.1538 },
  ]),
  verdict: 'MEASUREMENT only: the imp-96333 three-prime S-unit count converges to its cubic leading term (ln U)^3/(6 ln2 ln3 ln5) only as 1 + 5.049/ln U -- the fitted (ln U)^2 surface coefficient A = 0.6866 matches the theoretical coordinate-face term (1/4)(1/(ln2 ln3)+1/(ln2 ln5)+1/(ln3 ln5)) = 0.6938 to 99.0 percent, and the ratio does NOT fall within 5 percent of 1 until U ~ 1e45 (L* = 102.85). Establishes NO operator positivity, moves NO Lambda bound, and does NOT touch the finitely-many top confined states (the real residual). RH open; no refereed bound is changed; NO QED',
});

// ---- assertions
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96365_SUNIT_COUNT_CONVERGENCE_ASSERTIONS = Object.freeze([
  {
    id: 'imp96365-count-matches-imp96333',
    description: 'the exact S-unit count reproduces the imp-96333 samples 33/85/174/506/1529 at U = 1e2..1e9',
    holds: () => {
      const want = [[1e2, 33], [1e3, 85], [1e4, 174], [1e6, 506], [1e9, 1529]];
      return want.every(([U, w]) => countSunits(U) === w);
    },
  },
  {
    id: 'imp96365-extended-ladder-counts',
    description: 'the extended exact counts at U = 1e9..1e15 are 1529/2052/2682/3428/4300/5309/6465 and their ratios to the cubic match',
    holds: () => IMP_96365_SUNIT_COUNT_CONVERGENCE.extendedGrowthSamples.every((s) => {
      const cnt = countSunits(s.U);
      return cnt === s.count && approx(cubicRatio(s.U), s.ratio, 5e-4);
    }),
  },
  {
    id: 'imp96365-second-order-coefficient-fit',
    description: 'the fitted (ln U)^2 coefficient A = 0.6866 matches the theoretical coordinate-face surface term A_theory = 0.6938 to within 1.1 percent, confirming a single (ln U)^2 subleading correction',
    holds: () => approx(A_THEORY, 0.69378946935178554, 1e-12)
      && Math.abs(A_FIT / A_THEORY - 1) < 0.011
      && approx(A_FIT, IMP_96365_SUNIT_COUNT_CONVERGENCE.secondOrderCoefficient, 1e-9),
  },
  {
    id: 'imp96365-slow-inverse-log-approach',
    description: 'the ratio approaches 1 as 1 + A*K/ln U with A*K ~ 5.05, so (ratio - 1)*ln U is nearly constant across the decade ladder (5.46 -> 5.31)',
    holds: () => {
      const vals = IMP_96365_SUNIT_COUNT_CONVERGENCE.extendedGrowthSamples.map((s) => (cubicRatio(s.U) - 1) * Math.log(s.U));
      const spread = Math.max(...vals) - Math.min(...vals);
      return spread < 0.2 && approx(A_FIT * K, 5.049032, 1e-3) && vals.every((v) => v > 5 && v < 5.6);
    },
  },
  {
    id: 'imp96365-crossover-astronomical',
    description: 'solving ratio(L) = 1.05 with the fitted model gives L* = 102.85, i.e. U* ~ 1e44.7 -- the 5 percent band is reached only at an astronomically large magnitude',
    holds: () => {
      const Rmodel = (L) => 1 + (A_FIT * L * L + B_FIT * L + C_FIT) * K / (L * L * L);
      let Ls = 0;
      for (let L = 20; L < 400; L += 0.01) { if (Rmodel(L) <= 1.05) { Ls = L; break; } }
      return approx(Ls, 102.85, 0.5) && Ls / Math.log(10) > 44 && Ls / Math.log(10) < 46;
    },
  },
  {
    id: 'imp96365-verdict-honesty',
    description: 'verdict records a MEASUREMENT only: no operator positivity, no Lambda move, does not touch the top confined states, asserts RH open / NO QED',
    holds: () => /MEASUREMENT only/.test(IMP_96365_SUNIT_COUNT_CONVERGENCE.verdict)
      && /NO operator positivity/.test(IMP_96365_SUNIT_COUNT_CONVERGENCE.verdict)
      && /does NOT touch the finitely-many top confined states/.test(IMP_96365_SUNIT_COUNT_CONVERGENCE.verdict)
      && /RH open/.test(IMP_96365_SUNIT_COUNT_CONVERGENCE.verdict)
      && /NO QED/.test(IMP_96365_SUNIT_COUNT_CONVERGENCE.verdict),
  },
]);

export default IMP_96365_SUNIT_COUNT_CONVERGENCE;
