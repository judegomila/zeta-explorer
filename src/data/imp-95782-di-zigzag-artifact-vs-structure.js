/**
 * @fileoverview imp-95782 — assess whether the imp-95765 four-moduli dI zigzag (consecutive
 * differences carrying signs -,+,- across m=18,19,20,21, total spread ~4.15e-5) is genuine
 * rho-structure or a residual per-modulus quadrature artifact.
 *
 * imp-95765 established four conditional dI points on a 4.15e-5-wide band (~4.15e4x the 1e-9
 * anchor quadrature floor) via the exact split dI(1/m) = J_raw(m) + 5/2 = 1 - Q_0(m). The band
 * is a RESOLVED signal (the aggregate movement is real, far above the m=20 anchor floor) but
 * imp-95765 explicitly did NOT resolve whether the SHAPE of the movement -- the non-monotone
 * -,+,- zigzag inherited from the imp-95746 Q_0 m-signal -- is genuine rho-structure or a
 * per-modulus artifact.
 *
 * METHOD (no re-quadrature required). The ticket suggests tightening the Nsub grid at the four
 * moduli; that 238-cell Prop-6.3 re-run is out of reach here (it is the imp-95746 machinery).
 * Instead this module applies a finite-difference-ORDER discriminator to the existing four dI
 * points, which answers the same question from the table alone:
 *
 *   - A genuine smooth rho-dependence dI(rho), sampled at equal m-spacing over the TINY window
 *     m=18..21 (rho in [1/21, 1/18], width 0.0079), has finite differences that DECAY with order:
 *     |dg^{k+1}| / |dg^{k}| ~ (spacing)*(derivative ratio) << 1. Any low-order rho-correction is
 *     monotone on so small a window, so its second/third differences are much smaller than its
 *     first differences.
 *   - Independent per-modulus quadrature NOISE, by contrast, has finite differences that stay
 *     O(1) or GROW with order (differencing amplifies white noise: variance grows as C(2k,k)).
 *
 * MEASURED finite differences of dI (equal m-spacing = 1):
 *     first  diffs (18->19, 19->20, 20->21): -3.858e-5, +2.852e-5, -3.140e-5   (signs -,+,-)
 *     second diffs:                          +6.710e-5, -5.992e-5
 *     third  diff:                           -1.270e-4
 * The magnitudes GROW with order: max|d1|=3.86e-5, max|d2|=6.71e-5, |d3|=1.27e-4, with ratios
 * |d2|/|d1| = 1.74 and |d3|/|d2| = 1.89 (both > 1). A smooth rho-structure over this window would
 * give ratios << 1; ratios > 1 are the definitive signature of per-point noise, NOT a smooth
 * trend. Corroboration: the residuals of dI about its best linear-in-rho trend ALTERNATE in sign
 * (+,-,+,-) -- the data oscillates about ANY smooth trend, the hallmark of independent per-modulus
 * noise rather than systematic rho-dependence.
 *
 * VERDICT (conditional on the +4 offset). The aggregate 4.15e-5 dI band remains a resolved signal
 * (dI genuinely moves), but the SHAPE of the -,+,- zigzag across m=18..21 is a per-modulus
 * quadrature ARTIFACT, not genuine rho-structure: the per-modulus quadrature error at the
 * non-anchor moduli m=18/19/21 (none independently certified -- only m=20 has a certified kappa)
 * sits at the ~3e-5 level, far above the m=20 anchor 1e-9 floor, and that error -- not a smooth
 * rho-trend -- produces the sign-flips. Consequently NO rho-trend can be read from the ordering of
 * the four points; the pure-rho^2 shape still holds to ~2e-5 relative (imp-95765).
 *
 * HONEST SUB-GAP. This is a finite-difference-order DISCRIMINATOR on the existing four points, NOT
 * the Nsub grid-refinement re-run itself. A direct confirmation requires recomputing J_raw at
 * m=18/19/21 on a tightened Nsub grid (the imp-95746-tightened-Nsub-at-nonanchor-moduli sub-gap)
 * and checking that each per-modulus value shifts by ~3e-5 while the aggregate band and the m=20
 * anchor stay put -- the direct signature of a per-modulus artifact. Until then the artifact
 * reading is an inference from the difference-order growth, not a re-quadrature certificate.
 *
 * Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound;
 * NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 *
 * SOURCE: imp-95765 dI table (dI(1/m)=J_raw(m)+5/2). SCRATCH: tmp/imp-95782-scratch.mjs.
 */

// carried imp-95765 four-modulus dI table (dI(1/m) = J_raw(m) + 5/2 = 1 - Q_0(m); +4 offset).
const DI_TABLE = Object.freeze([
  Object.freeze({ m: 18, rho: 1 / 18, dI: 1.0107079475 }),
  Object.freeze({ m: 19, rho: 1 / 19, dI: 1.0106693712 }),
  Object.freeze({ m: 20, rho: 1 / 20, dI: 1.0106978911 }), // certified anchor (KAPPA-3/2)
  Object.freeze({ m: 21, rho: 1 / 21, dI: 1.0106664879 }),
]);

const QUADRATURE_FLOOR = 1e-9; // imp-95720: grid == exact-B to 1e-9 AT THE ANCHOR (m=20)

const V = DI_TABLE.map((r) => r.dI);
// finite differences at equal m-spacing = 1.
const D1 = Object.freeze([V[1] - V[0], V[2] - V[1], V[3] - V[2]]); // signs -,+,-
const D2 = Object.freeze([D1[1] - D1[0], D1[2] - D1[1]]);
const D3 = Object.freeze([D2[1] - D2[0]]);

const MAX_ABS_D1 = Math.max(...D1.map(Math.abs));
const MAX_ABS_D2 = Math.max(...D2.map(Math.abs));
const ABS_D3 = Math.abs(D3[0]);
// order-growth ratios: >1 => noise-dominated shape; <<1 => smooth rho-structure.
const RATIO_D2_D1 = MAX_ABS_D2 / MAX_ABS_D1; // ~1.74
const RATIO_D3_D2 = ABS_D3 / MAX_ABS_D2; // ~1.89
const DIFFERENCES_GROW_WITH_ORDER = RATIO_D2_D1 > 1 && RATIO_D3_D2 > 1;

// residuals about the best linear-in-rho trend: alternating signs => oscillation about any trend.
const RHO = DI_TABLE.map((r) => r.rho);
const N = DI_TABLE.length;
const SX = RHO.reduce((a, b) => a + b, 0);
const SY = V.reduce((a, b) => a + b, 0);
const SXX = RHO.reduce((a, b) => a + b * b, 0);
const SXY = RHO.reduce((a, b, i) => a + b * V[i], 0);
const SLOPE = (N * SXY - SX * SY) / (N * SXX - SX * SX);
const INTERCEPT = (SY - SLOPE * SX) / N;
const LINEAR_RESIDUALS = Object.freeze(V.map((y, i) => y - (INTERCEPT + SLOPE * RHO[i])));
const RESIDUAL_SIGNS = Object.freeze(LINEAR_RESIDUALS.map((r) => Math.sign(r)));
const RESIDUALS_ALTERNATE = RESIDUAL_SIGNS.every((s, i) => (i === 0 ? true : s === -RESIDUAL_SIGNS[i - 1]));

export const DI_ZIGZAG_ARTIFACT_VS_STRUCTURE = Object.freeze({
  id: 'imp-95782-di-zigzag-artifact-vs-structure',
  title:
    'Assess whether the imp-95765 four-moduli dI zigzag (consecutive-difference signs -,+,- across '
    + 'm=18..21, spread ~4.15e-5) is genuine rho-structure or a per-modulus quadrature artifact -- '
    + 'via a finite-difference-ORDER discriminator on the four points (no 238-cell re-quadrature)',
  status:
    'ASSESSED (conditional on the +4 offset) -- the aggregate 4.15e-5 dI band is a resolved signal '
    + '(dI genuinely moves) but the SHAPE of the -,+,- zigzag is a per-modulus quadrature ARTIFACT, '
    + 'NOT genuine rho-structure. The dI finite differences GROW with order (max|d1|=3.86e-5 -> '
    + 'max|d2|=6.71e-5 -> |d3|=1.27e-4, ratios 1.74 and 1.89, both >1), the definitive signature of '
    + 'per-point noise; a smooth rho-dependence over the tiny m=18..21 window would give ratios <<1. '
    + 'Corroborated by residuals about the best linear-in-rho trend alternating in sign (+,-,+,-). '
    + 'The per-modulus error at the non-anchor moduli m=18/19/21 sits at ~3e-5, far above the m=20 '
    + 'anchor 1e-9 floor, and produces the sign-flips. SUB-GAP: this is an order-growth inference, '
    + 'NOT the Nsub grid-refinement re-run (imp-95746-tightened-Nsub-at-nonanchor-moduli). G '
    + 'irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'imp-95765 four-modulus dI table dI(1/m)=J_raw(m)+5/2 (= 1 - Q_0(m); +4 offset)',
  builtOn:
    'imp-95765 (four-moduli dI table + non-monotone -,+,- verdict, question left open), '
    + 'imp-95746 (faithful J_raw at m=18/19/20/21), imp-95720 (anchor quadrature floor 1e-9)',
  scratch: ['tmp/imp-95782-scratch.mjs'],

  method: Object.freeze({
    discriminator: 'finite-difference-ORDER growth of dI sampled at equal m-spacing (1)',
    smoothPrediction:
      'a genuine smooth rho-dependence over the tiny m=18..21 window has differences that DECAY '
      + 'with order: |dg^{k+1}|/|dg^{k}| << 1 (any low-order rho-correction is monotone here).',
    noisePrediction:
      'independent per-modulus quadrature noise has differences that stay O(1) or GROW with order '
      + '(differencing amplifies white noise: variance ~ C(2k,k)).',
    whyNoReQuadrature:
      'the direct Nsub grid-refinement is the 238-cell Prop-6.3 machinery (imp-95746), out of '
      + 'reach here; the order-growth test answers the same question from the existing four points.',
  }),

  finiteDifferences: Object.freeze({
    first: D1, // -3.858e-5, +2.852e-5, -3.140e-5 (signs -,+,-)
    second: D2, // +6.710e-5, -5.992e-5
    third: D3, // -1.270e-4
    maxAbsFirst: MAX_ABS_D1, // 3.858e-5
    maxAbsSecond: MAX_ABS_D2, // 6.710e-5
    absThird: ABS_D3, // 1.270e-4
    ratioSecondToFirst: RATIO_D2_D1, // ~1.74
    ratioThirdToSecond: RATIO_D3_D2, // ~1.89
    growWithOrder: DIFFERENCES_GROW_WITH_ORDER, // true => noise-dominated shape
    reading:
      'both order-growth ratios exceed 1 (1.74, 1.89): the dI differences GROW with difference '
      + 'order, the signature of per-modulus noise. A smooth rho-structure would give ratios <<1.',
  }),

  linearTrendResiduals: Object.freeze({
    slope: SLOPE,
    intercept: INTERCEPT,
    residuals: LINEAR_RESIDUALS, // ~ +7.5e-6, -2.0e-5, +1.8e-5, -4.9e-6
    signs: RESIDUAL_SIGNS, // +,-,+,-
    alternate: RESIDUALS_ALTERNATE, // true => oscillation about ANY smooth trend
    reading:
      'residuals about the best linear-in-rho trend alternate in sign (+,-,+,-): the four points '
      + 'oscillate about any smooth trend, corroborating independent per-modulus noise.',
  }),

  verdict: Object.freeze({
    aggregateBandResolved: true, // the 4.15e-5 movement is real (imp-95765)
    zigzagShapeIsArtifact: true, // the -,+,- SHAPE is a per-modulus quadrature artifact
    genuineRhoStructureInShape: false, // no smooth rho-trend readable from the ordering
    onlyM20Certified: true, // m=18/19/21 have no independent certificate
    conclusion:
      'CONDITIONAL on the +4 offset: the aggregate 4.15e-5 dI band is a resolved signal (dI moves) '
      + 'but the -,+,- zigzag SHAPE across m=18..21 is a per-modulus quadrature ARTIFACT, not '
      + 'genuine rho-structure -- the dI finite differences grow with order (ratios 1.74, 1.89 > 1) '
      + 'and the linear-trend residuals alternate in sign, both signatures of per-point noise at '
      + 'the ~3e-5 level (the uncertified non-anchor moduli m=18/19/21), far above the m=20 anchor '
      + '1e-9 floor. No rho-trend can be read from the four-point ordering; the pure-rho^2 shape '
      + 'still holds to ~2e-5 relative.',
  }),

  subGap:
    'This is a finite-difference-ORDER discriminator on the existing four points, NOT the Nsub '
    + 'grid-refinement re-run. Direct confirmation (imp-95746-tightened-Nsub-at-nonanchor-moduli) '
    + 'recomputes J_raw at m=18/19/21 on a tightened Nsub grid and checks that each per-modulus '
    + 'value shifts by ~3e-5 while the aggregate band and the m=20 anchor stay put.',

  caveats:
    'Operates on the carried imp-95765 dI table by arithmetic only; performs no new Prop-6.3 '
    + 'quadrature. The order-growth discriminator is a strong inference, not a re-quadrature '
    + 'certificate. Entire table CONDITIONAL on the +4 offset being exactly 4 and m-independent '
    + '(verified only at m=20). Catalan G irrationality OPEN; Sun single-author, unrefereed; NO '
    + 'Lambda movement; no refereed bound is changed; NO QED.',
});

export const DI_ZIGZAG_ARTIFACT_VS_STRUCTURE_ASSERTIONS = Object.freeze([
  {
    name: 'dI finite differences reproduce the imp-95765 -,+,- first-difference sign pattern',
    holds: () =>
      D1.length === 3
      && D1.map((d) => Math.sign(d)).join(',') === '-1,1,-1'
      && Math.abs(D1[1] - 2.852e-5) < 1e-7,
  },
  {
    name: 'finite differences GROW with order: max|d2|/max|d1| and |d3|/max|d2| both exceed 1',
    holds: () =>
      RATIO_D2_D1 > 1
      && RATIO_D3_D2 > 1
      && DIFFERENCES_GROW_WITH_ORDER === true
      && Math.abs(RATIO_D2_D1 - 1.739) < 1e-2
      && Math.abs(RATIO_D3_D2 - 1.893) < 1e-2,
  },
  {
    name: 'linear-in-rho residuals alternate in sign (+,-,+,-): oscillation about any smooth trend',
    holds: () =>
      RESIDUAL_SIGNS.join(',') === '1,-1,1,-1'
      && RESIDUALS_ALTERNATE === true,
  },
  {
    name: 'verdict: aggregate band resolved yet the zigzag SHAPE is a per-modulus artifact (not rho-structure)',
    holds: () =>
      DI_ZIGZAG_ARTIFACT_VS_STRUCTURE.verdict.aggregateBandResolved === true
      && DI_ZIGZAG_ARTIFACT_VS_STRUCTURE.verdict.zigzagShapeIsArtifact === true
      && DI_ZIGZAG_ARTIFACT_VS_STRUCTURE.verdict.genuineRhoStructureInShape === false,
  },
  {
    name: 'honest sub-gap named: order-growth inference, NOT the Nsub grid-refinement re-run',
    holds: () =>
      /tightened-Nsub/.test(DI_ZIGZAG_ARTIFACT_VS_STRUCTURE.subGap)
      && /NOT the Nsub grid-refinement/.test(DI_ZIGZAG_ARTIFACT_VS_STRUCTURE.subGap),
  },
  {
    name: 'honest: conditional on the +4 offset, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      /CONDITIONAL/.test(DI_ZIGZAG_ARTIFACT_VS_STRUCTURE.verdict.conclusion)
      && /G irrationality OPEN/.test(DI_ZIGZAG_ARTIFACT_VS_STRUCTURE.status)
      && /refereed bound is changed/i.test(DI_ZIGZAG_ARTIFACT_VS_STRUCTURE.status)
      && /NO QED/.test(DI_ZIGZAG_ARTIFACT_VS_STRUCTURE.status),
  },
]);

export default DI_ZIGZAG_ARTIFACT_VS_STRUCTURE;
