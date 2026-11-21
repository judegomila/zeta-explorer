/**
 * @module imp-35148-g7-truncation-deg-lever-probe
 * @fileoverview imp-35148 -- MEASURE whether the imp-35075 admissible-but-ceiling-setting
 *   DISCRETE truncation-size DEG axis acts as a SOFTENING lever on the imp-3066 kernel. imp-35075
 *   proved the two ruled-out CONTINUOUS levers (decoupled pass rate, shear coefficient) exhaust the
 *   2-dim off-orbit tangent space, leaving NO third continuous admissible lever -- but explicitly
 *   set aside the DISCRETE truncation-size DEG axis as "admissible-but-ceiling-setting" and never
 *   numerically probed it as a softening direction. This module executes exactly that probe.
 *
 *   THE GAP THIS FILLS (the imp-35148 ticket)
 *   -----------------------------------------
 *   imp-35075 counted the continuous tangent space and named DEG as the sole un-probed admissible
 *   axis, deferring to imp-33765 / imp-33791 that it "sets the all-ones ceiling DEG+1, not a
 *   softening". But imp-33791 measured the CEILING behaviour, not the sign of d||R||/dDEG on the
 *   imp-3066 kernel at the roadmap anchor directly. This module measures the discrete forward
 *   difference Delta||R||(DEG) = ||R||(DEG+1) - ||R||(DEG) across a DEG ladder at the anchor
 *   (s_pass, s_shear, c) = (3, 3, 1) and reports its sign: a NEGATIVE sign anywhere would be a
 *   genuine discrete softening lever; a uniformly NON-NEGATIVE sign confirms no softening.
 *
 *   THE CONSTRUCTION (inherited verbatim from imp-3066 / imp-33765 / imp-35075)
 *   --------------------------------------------------------------------------
 *   On the monomial truncation phi_j = (tau/U)^j, de-homogenised to x in [0,1] (s = a*U folded in
 *   per imp-33765):
 *       D_jj = int_0^1 cosh(s_pass * x) x^{2j} dx,
 *       H_jk = c * int_0^1 sinh(s_shear * x) x^{j+k} dx,
 *       R_jk = H_jk / sqrt(D_jj D_kk),   ||R||(DEG) = Perron eigenvalue of the (DEG+1)x(DEG+1) R.
 *   The imp-3066 ADMISSIBLE kernel is the anchor slice s_pass = s_shear = 3, c = 1. The DISCRETE
 *   knob is the truncation size DEG+1; this module holds the continuous coordinates at the anchor
 *   and steps DEG.
 *
 *   THE MEASUREMENT (the imp-35148 deliverable -- MEASURE)
 *   -----------------------------------------------------
 *   Across DEG = 1..12 at the anchor:
 *       ||R||(DEG)  = 1.845, 2.777, 3.701, 4.617, 5.528, 6.435, 7.337, 8.237, 9.134, 10.029,
 *                     10.922, 11.813   (DEG=4 reproduces the roadmap anchor ~4.617013710)
 *       Delta||R|| = +0.9317, +0.9233, +0.9165, +0.9110, +0.9066, +0.9028, +0.8997, +0.8971,
 *                    +0.8948, +0.8928, +0.8910   (every forward difference POSITIVE)
 *   Every d||R||/dDEG is strictly POSITIVE (~0.89..0.93, a slowly decaying near-unit step that
 *   trails the all-ones ceiling gap DEG+1 - ||R||). So ||R||(DEG) is STRICTLY MONOTONE INCREASING:
 *   enlarging the truncation NEVER softens the Perron norm -- the discrete DEG axis INFLATES it,
 *   exactly as imp-33791 predicted for the ceiling. There is NO discrete softening lever here.
 *
 *   THE VERDICT (measurement)
 *   -------------------------
 *   The discrete truncation-size DEG axis is monotone-NONDECREASING (in fact strictly increasing)
 *   in ||R|| at the imp-3066 anchor -- it does NOT act as a softening lever. Combined with
 *   imp-35075 (no third continuous lever off the orbit) this closes the last un-probed admissible
 *   softening axis of the imp-3066 exponential-shear metric-pair construction: neither the
 *   continuous transverse directions NOR the discrete truncation axis soften ||R||. The only
 *   direction that changes ||R|| within admissibility is the coupled s-flow, and it too increases
 *   it (imp-33765). MEASUREMENT ONLY.
 *
 *   HONEST CAVEAT (mandatory -- ticket + verdict)
 *   ---------------------------------------------
 *   MEASUREMENT on the SAME representative monomial truncation and inherited surrogate as
 *   imp-3066 / imp-33765 / imp-35075 -- NOT the section-26 Gram. "No softening lever" is a
 *   statement about the sign of the discrete forward difference of ||R|| on the imp-3066
 *   exponential-shear kernel at the anchor; it establishes NO operator positivity and does NOT rule
 *   out entirely different kernel CLASSES (non-exponential multiplier, non-monomial basis).
 *   Monotone-increasing ||R|| is NOT itself an RH verdict -- it neither shows the cover fails nor
 *   that it holds. imp-3066 K_a &gt;= 0 and G7 remain OPEN and UNTOUCHED; this changes no bound;
 *   ||R|| carries NO RH verdict; NO QED. No refereed bound is changed.
 *
 *   @see imp-35075-g7-orthogonal-lever-tangent-completeness.js (imp-35075: the continuous tangent count this completes on the discrete axis)
 *   @see imp-33791-deg-ceiling-saturation.js (imp-33791: the truncation-size ceiling DEG+1)
 *   @see imp-33765-g7-obstruction-orthogonal-lever.js (imp-33765: the one-dimensionality + two-lever classification)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js (imp-3066: the single-cell G7 magnitude, K_a >= 0 OPEN)
 *   @see lambda-roadmap.js G7 (the K_a >= 0 lone obstruction node)
 *
 *   Ticket: imp-35148 (proof, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const NQ = 4000;                                      // midpoint quadrature panels (matches imp-3066 / imp-33765 / imp-35075)
const ANCHOR_S = 3;                                   // roadmap G7 anchor product s = a*U
const DEG_MIN = 1;                                    // truncation-size ladder start (2x2 R)
const DEG_MAX = 12;                                   // truncation-size ladder end (13x13 R)

const cosh = Math.cosh;
const sinh = Math.sinh;

/** x-domain moment: int_0^1 weightFn(s*x) * x^p dx (the de-homogenised imp-33765 integrand). */
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
 * Copied verbatim from imp-3066 / imp-33765 / imp-35075 so the modules read the SAME spectrum.
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
 * The Perron norm ||R|| of the imp-3066 kernel at a given truncation size DEG (holding the
 * continuous coordinates at the anchor s_pass = s_shear = sPass, c = 1 unless overridden).
 */
function opNormAtDeg(DEG, sPass, sShear, c) {
  const Ddiag = Array.from({ length: DEG + 1 }, (_u, j) => moment(cosh, sPass, 2 * j));
  const Hshear = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => c * moment(sinh, sShear, j + k)),
  );
  const R = Array.from({ length: DEG + 1 }, (_u, j) =>
    Array.from({ length: DEG + 1 }, (_v, k) => Hshear[j][k] / Math.sqrt(Ddiag[j] * Ddiag[k])),
  );
  return Math.max(...symmetricEigenvalues(R).map((e) => Math.abs(e)));
}

// -- The DEG ladder at the imp-3066 admissible anchor (s_pass, s_shear, c) = (3, 3, 1) ----------
const ladder = [];
for (let DEG = DEG_MIN; DEG <= DEG_MAX; DEG++) {
  const norm = opNormAtDeg(DEG, ANCHOR_S, ANCHOR_S, 1);
  ladder.push(Object.freeze({ deg: DEG, truncationSize: DEG + 1, ceiling: DEG + 1, opNorm: norm }));
}

// Forward differences Delta||R||(DEG) = ||R||(DEG+1) - ||R||(DEG): the discrete d||R||/dDEG probe.
const forwardDiffs = [];
for (let i = 1; i < ladder.length; i++) {
  forwardDiffs.push(
    Object.freeze({
      fromDeg: ladder[i - 1].deg,
      toDeg: ladder[i].deg,
      delta: ladder[i].opNorm - ladder[i - 1].opNorm,
    }),
  );
}

// The SIGN measurement: is every forward difference non-negative (no softening) or does any dip
// below zero (a genuine discrete softening lever)?
const minForwardDiff = Math.min(...forwardDiffs.map((d) => d.delta));
const maxForwardDiff = Math.max(...forwardDiffs.map((d) => d.delta));
const allForwardDiffsPositive = forwardDiffs.every((d) => d.delta > 0);
const anyForwardDiffNegative = forwardDiffs.some((d) => d.delta < 0);
const isMonotoneNondecreasing = minForwardDiff >= 0;
const degActsAsSofteningLever = anyForwardDiffNegative;

// Cross-check the DEG = 4 rung against the shared roadmap anchor ~4.617013710.
const anchorDeg4Norm = ladder.find((r) => r.deg === 4).opNorm;

export const IMP35148_G7_TRUNCATION_DEG_LEVER_PROBE = Object.freeze({
  id: 'imp-35148-g7-truncation-deg-lever-probe',
  ticket: 'imp-35148',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedTangentCompleteness: 'imp-35075-g7-orthogonal-lever-tangent-completeness.js',
  relatedDegCeiling: 'imp-33791-deg-ceiling-saturation.js',
  relatedOneDimensionality: 'imp-33765-g7-obstruction-orthogonal-lever.js',
  relatedObstruction: 'imp-3066-offdiagonal-hankel-obstruction.js',
  roadmapNode: 'G7',

  summary:
    'Measures whether the imp-35075 admissible-but-ceiling-setting DISCRETE truncation-size DEG ' +
    'axis -- the one G7 / imp-3066 softening axis left unquantified after imp-35075 ruled out ALL ' +
    'continuous transverse levers -- acts as a softening lever. Steps DEG = 1..12 at the imp-3066 ' +
    'admissible anchor (s_pass, s_shear, c) = (3, 3, 1) and measures the sign of the discrete ' +
    'forward difference Delta||R||(DEG). RESULT: ||R||(DEG) = 1.845, 2.777, 3.701, 4.617, 5.528, ' +
    '..., 11.813 with EVERY forward difference strictly POSITIVE (~0.89..0.93, a slowly decaying ' +
    'near-unit step trailing the all-ones ceiling gap). So ||R||(DEG) is strictly monotone ' +
    'INCREASING -- enlarging the truncation NEVER softens the Perron norm; the discrete DEG axis ' +
    'INFLATES it, confirming imp-33791. VERDICT: DEG does NOT act as a softening lever; combined ' +
    'with imp-35075 this closes the last un-probed admissible softening axis of the imp-3066 ' +
    'construction. MEASUREMENT ONLY; imp-3066 K_a >= 0 / G7 OPEN and untouched; ||R|| carries NO ' +
    'RH verdict; changes no bound; not a proof.',

  construction: Object.freeze({
    inheritedFrom:
      'imp-3066 / imp-33765 / imp-35075 (same phi_j = (tau/U)^j truncation, de-homogenised ' +
      'x-moments, midpoint quadrature, Jacobi eigensolver)',
    kernel:
      'D_jj = int_0^1 cosh(s_pass x) x^{2j} dx, H_jk = c int_0^1 sinh(s_shear x) x^{j+k} dx, ' +
      'R_jk = H_jk / sqrt(D_jj D_kk); ||R||(DEG) = Perron eigenvalue of the (DEG+1)x(DEG+1) R',
    anchorSlice: 's_pass = s_shear = ' + ANCHOR_S + ', c = 1 (the imp-3066 admissible kernel)',
    discreteKnob: 'truncation size DEG+1, stepped over DEG = ' + DEG_MIN + '..' + DEG_MAX,
    quadrature: 'midpoint, NQ = ' + NQ + ' panels on [0, 1]',
    selfComputing: true,
  }),

  measured: Object.freeze({
    anchorProduct: ANCHOR_S,                                       // s = a*U = 3 (roadmap G7 anchor)
    anchorDeg4OperatorNorm: anchorDeg4Norm,                        // ~4.617013710 (matches imp-35075 anchor)
    degLadder: Object.freeze(ladder),                             // ||R||(DEG) for DEG = 1..12
    forwardDifferences: Object.freeze(forwardDiffs),             // Delta||R||(DEG) = discrete d||R||/dDEG
    minForwardDiff,                                               // ~ +0.891 (smallest step, still positive)
    maxForwardDiff,                                               // ~ +0.932 (largest step)
    allForwardDiffsPositive,                                      // true (no rung softens)
    anyForwardDiffNegative,                                       // false (no discrete softening anywhere)
    isMonotoneNondecreasing,                                      // true (strictly increasing, in fact)
    degActsAsSofteningLever,                                      // false -- THE VERDICT
  }),

  interpretation: Object.freeze({
    degIsMonotoneIncreasingNotSoftening:
      'Every forward difference Delta||R||(DEG) is strictly positive (~0.89..0.93), so ||R||(DEG) ' +
      'is strictly monotone increasing across the ladder DEG = 1..12 at the imp-3066 anchor. ' +
      'Enlarging the truncation size INFLATES the Perron norm rather than softening it -- the ' +
      'discrete DEG axis is not a softening lever.',
    stepsTrailTheAllOnesCeilingGap:
      'The near-unit step (slightly below 1, slowly decaying) is consistent with ||R||(DEG) ' +
      'climbing toward but staying below the all-ones ceiling DEG+1 (imp-33791): the ceiling grows ' +
      'by exactly 1 per rung while ||R|| grows by ~0.89..0.93, so the ceiling gap widens and ||R|| ' +
      'never overtakes or reverses.',
    closesTheLastUnprobedAdmissibleAxis:
      'imp-35075 proved the two ruled-out continuous levers exhaust the 2-D off-orbit tangent ' +
      'space, leaving only the discrete DEG axis un-probed as a softening direction. This ' +
      'measurement shows that axis too is non-softening (monotone increasing), so neither the ' +
      'continuous transverse directions NOR the discrete truncation axis soften ||R|| on the ' +
      'imp-3066 exponential-shear metric pair.',
    verdict:
      'The discrete truncation-size DEG axis is monotone-NONDECREASING (strictly increasing) in ' +
      '||R|| at the imp-3066 anchor and does NOT act as a softening lever. Measurement only; the ' +
      'imp-3066 K_a >= 0 obstruction and G7 stay OPEN and untouched; establishes no operator ' +
      'positivity; changes no bound.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurementOnly: true,
    isRepresentativeTruncationNotTheSection26Gram: true,
    noSofteningIsWithinTheExponentialShearMetricPairFamilyOnly:
      'The phrase "no softening lever" is a statement about the sign of the discrete forward ' +
      'difference of ||R|| on the imp-3066 exponential-shear scalar-multiplier kernel at the ' +
      'anchor. It does NOT rule out entirely different kernel CLASSES -- a non-exponential ' +
      'multiplier, a non-monomial basis -- which are a different discrete / kernel-class axis, not ' +
      'the truncation-size knob probed here.',
    monotoneIncreaseIsNotAnRHVerdict:
      'A strictly increasing ||R||(DEG) neither shows the imp-3066 cover fails nor that it holds; ' +
      'it only classifies the truncation axis as ceiling-setting rather than softening, exactly as ' +
      'imp-33791 anticipated.',
    imp3066Untouched: true,
    imp33765Untouched: true,
    imp35075Untouched: true,
    didNotAttemptPositivity: true,
    changesNoBound: true,
    sota: 'No refereed bound is changed',
    noQED: true,
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP35148_G7_TRUNCATION_DEG_LEVER_PROBE_ASSERTIONS = [
  {
    id: 'imp35148-anchor-deg4-matches-imp35075',
    why: 'Cross-check the DEG = 4 rung ||R|| at the anchor against imp-3066 / imp-33765 / ' +
         'imp-35075: ~4.617014. A mismatch means the inherited de-homogenised construction drifted.',
    holds: () => Math.abs(anchorDeg4Norm - 4.617014) < 1e-5,
  },
  {
    id: 'imp35148-ladder-covers-the-deg-range',
    why: 'The DEG ladder must span the full probed range DEG = 1..12 (12 rungs) so the forward ' +
         'difference sign is measured across a genuine truncation-size sweep, not a single point.',
    holds: () =>
      ladder.length === DEG_MAX - DEG_MIN + 1 &&
      ladder[0].deg === DEG_MIN &&
      ladder[ladder.length - 1].deg === DEG_MAX,
  },
  {
    id: 'imp35148-every-forward-difference-is-positive',
    why: 'THE MEASUREMENT: every discrete forward difference Delta||R||(DEG) is strictly positive ' +
         '(~0.89..0.93), so ||R||(DEG) is strictly monotone increasing -- the DEG axis inflates ' +
         'the Perron norm and NEVER softens it.',
    holds: () => allForwardDiffsPositive && minForwardDiff > 0 && !anyForwardDiffNegative,
  },
  {
    id: 'imp35148-deg-is-not-a-softening-lever',
    why: 'THE VERDICT: monotone-nondecreasing ||R||(DEG) means the discrete truncation-size axis ' +
         'does NOT act as a softening lever, closing the last un-probed admissible axis left by ' +
         'imp-35075 after it ruled out all continuous transverse levers.',
    holds: () => isMonotoneNondecreasing && degActsAsSofteningLever === false,
  },
  {
    id: 'imp35148-steps-stay-below-unit-ceiling-growth',
    why: 'Consistency with imp-33791: ||R|| grows by less than 1 per rung (max step ~0.932 < 1) ' +
         'while the all-ones ceiling DEG+1 grows by exactly 1, so ||R|| trails the widening ' +
         'ceiling gap rather than overtaking it.',
    holds: () => maxForwardDiff < 1 && minForwardDiff > 0.8,
  },
  {
    id: 'imp35148-honest-measurement-not-a-verdict',
    why: 'Mandatory honesty: this is a REPRESENTATIVE measurement on the inherited surrogate, the ' +
         '"no softening" claim is scoped to the exponential-shear metric-pair family, a monotone ' +
         'increase carries no RH verdict, imp-3066 / imp-33765 / imp-35075 / G7 are untouched, ' +
         'positivity was not attempted, it changes no bound and is not a proof, and no refereed bound is changed' +
         '.',
    holds: () => {
      const c = IMP35148_G7_TRUNCATION_DEG_LEVER_PROBE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurementOnly === true &&
        c.isRepresentativeTruncationNotTheSection26Gram === true &&
        c.imp3066Untouched === true &&
        c.imp33765Untouched === true &&
        c.imp35075Untouched === true &&
        c.didNotAttemptPositivity === true &&
        c.changesNoBound === true &&
        c.noQED === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP35148_G7_TRUNCATION_DEG_LEVER_PROBE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35148-g7-truncation-deg-lever-probe assertion failed: ${assertion.id}`);
  }
}

export default IMP35148_G7_TRUNCATION_DEG_LEVER_PROBE;
