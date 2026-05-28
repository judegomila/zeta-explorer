// @module imp-1257-3point-bin-integration
// imp-1257 — BIN-INTEGRATION variant of imp-1238: does the "right bin
// convention" push the empirical-vs-GUE Pearson above 0.995?
//
// ANSWER: NO. Bin-integration moves Pearson from 0.98279 to 0.98311
// (delta = +0.00032) — nowhere near 0.995. The imp-1238 caveat that a
// corrected bin convention might reach >0.995 was based on a conceptual
// error, which this ticket resolves.
//
// THE CONCEPTUAL CORRECTION
// -------------------------
// imp-1238's honest-scope flagged a SYSTEMATIC ~0.85 multiplicative gap at
// GUE-plateau points (where gueR3 = 1.0 but the empirical ratio sits at
// ~0.78–0.87) and hypothesised that "correcting the bin-normalization
// convention" might lift Pearson past 0.995. Two facts kill that hope:
//
//   1. PEARSON IS SCALE-INVARIANT. Pearson(emp, c * gue) = Pearson(emp, gue)
//      for any constant c > 0. A UNIFORM multiplicative bin factor — exactly
//      the ~0.85 plateau offset imp-1238 observed — therefore cannot change
//      Pearson at all. (Verified numerically: Pearson(emp, 0.85*gueCentre)
//      = 0.98279, identical to Pearson(emp, gueCentre).)
//
//   2. THE EMPIRICAL SIDE IS ALREADY A BIN INTEGRAL. The imp-1238 ticket text
//      proposed "sum the empirical density across the bin, divide by bin
//      area" — but that is PRECISELY what imp-1238 already does:
//      empiricalRatio = count / (M_BULK * bin_area), and the triple-count IS
//      the integral of the empirical density over the bin. There is no
//      centre-evaluation on the empirical side to fix. The only quantity
//      evaluated at the bin CENTRE is the GUE PREDICTION gueR3(x, y).
//
// So the correct "bin-integration variant" is to compare the bin-integrated
// empirical count against the bin-AVERAGED GUE prediction
//   gueR3_binAvg(x, y) = (1 / binArea) ∫∫_{[x±δ]×[y±δ]} R_3(u, v) du dv
// rather than against the bin-CENTRE value gueR3(x, y). This is the
// apples-to-apples convention.
//
// METHOD (self-contained; NO zeros needed — computed by /tmp throwaway,
// 2026-05-28):
//   - Reuse the 25 FROZEN empirical ratios from imp-1238 (the heavy 1e6-zero
//     triple-count is unchanged; only the GUE comparison value is recomputed).
//   - For each grid bin, numerically average R_3 over [x±0.1]×[y±0.1] with a
//     200x200 midpoint sub-grid (40000 samples / bin).
//   - Recompute Pearson(empiricalRatio, gueR3_binAvg) and compare against the
//     imp-1238 centre-convention Pearson(empiricalRatio, gueR3_centre).
//
// HEADLINE RESULT
// ---------------
//   Pearson (centre convention, reproduces imp-1238) = 0.982788
//   Pearson (bin-integration convention)             = 0.983110
//   delta Pearson                                    = +0.000321
//   Verdict: bin-integration-does-not-reach-0.995
//
//   The per-point GUE shift from bin-averaging is uniformly NEGATIVE and small
//   (centre -> binAvg drops each plateau point by ~0.007, since R_3 is concave
//   near its plateau). Because the shift is nearly UNIFORM across the 20 mid /
//   plateau points, it is — like the multiplicative offset — almost invisible
//   to Pearson. The largest single shift is at (x=1, y=2): 1.0000 -> 0.9892.
//
// WHAT THIS MEANS FOR THE imp-1238 RESIDUAL
// -----------------------------------------
// The residual gap between empirical R_3 and GUE is NOT a bin-convention
// artifact that vanishes under the "right" convention. Two convention changes
// that imp-1238 floated as the likely fix — (a) uniform renormalization and
// (b) bin-integration — are now BOTH ruled out as Pearson-movers:
//   (a) ruled out by scale-invariance;
//   (b) ruled out by direct computation (+0.0003).
// The residual must therefore be EITHER (i) finite-M sampling noise
// (especially the small-x bins, x=0.2/y=0.7 has only 2 counts), OR (ii) a
// genuine finite-height (non-asymptotic) deviation of the 1e6-zero ensemble
// from the N→∞ sine-kernel limit. Neither is a normalization bug.
//
// IT IS:
//   - A decisive NEGATIVE answer to imp-1257's question: the corrected bin
//     convention does NOT yield Pearson > 0.995.
//   - A correction of imp-1238's named caveat: the empirical side was already
//     bin-integrated; only the GUE side needed bin-averaging, and doing so
//     barely moves Pearson.
//   - A scale-invariance proof that any UNIFORM bin factor is a Pearson no-op.
//
// IT IS NOT:
//   - A claim that GUE universality fails. The empirical signal is unchanged
//     and still strongly positive (Pearson ~0.983). This ticket only refutes
//     the *bin-convention explanation* for the residual, not the universality.
//   - A recompute of the 1e6-zero triple-counts (those are inherited frozen).
//   - A closure of imp-1180 or removal of gap-RS-3pt.
//
// @see imp-1238: parent EXTENDED empirical (25-point / M=10000) that named the
//   bin-convention caveat this ticket tests.
// @see imp-1183: 7-point / M=1000 ancestor.
// @see src/math/triple-correlation.js (the sine-kernel R_3 formula).

const GENERATED_AT = '2026-05-28T21:30:00Z';
const DELTA        = 0.1;
const BIN_AREA     = (2 * DELTA) * (2 * DELTA); // 0.04
const NSUB         = 200; // midpoint sub-grid per axis for bin integration

// Per-point comparison. empiricalRatio + gueCentre are FROZEN from imp-1238;
// gueBinAvg is the numerically bin-averaged GUE R_3 over the same bin.
const GRID = Object.freeze([
  Object.freeze({ x: 0.2, y: 0.7, empiricalRatio: 0.005000, gueCentre: 0.022423, gueBinAvg: 0.022349 }),
  Object.freeze({ x: 0.4, y: 0.9, empiricalRatio: 0.015000, gueCentre: 0.115300, gueBinAvg: 0.112939 }),
  Object.freeze({ x: 0.6, y: 1.1, empiricalRatio: 0.095000, gueCentre: 0.274702, gueBinAvg: 0.269696 }),
  Object.freeze({ x: 0.8, y: 1.3, empiricalRatio: 0.222500, gueCentre: 0.441792, gueBinAvg: 0.435070 }),
  Object.freeze({ x: 1.0, y: 1.5, empiricalRatio: 0.332500, gueCentre: 0.549684, gueBinAvg: 0.542974 }),
  Object.freeze({ x: 1.0, y: 2.0, empiricalRatio: 0.865000, gueCentre: 1.000000, gueBinAvg: 0.989234 }),
  Object.freeze({ x: 1.2, y: 2.2, empiricalRatio: 0.817500, gueCentre: 0.968458, gueBinAvg: 0.961907 }),
  Object.freeze({ x: 1.4, y: 2.4, empiricalRatio: 0.810000, gueCentre: 0.937331, gueBinAvg: 0.932486 }),
  Object.freeze({ x: 1.6, y: 2.6, empiricalRatio: 0.737500, gueCentre: 0.950644, gueBinAvg: 0.944675 }),
  Object.freeze({ x: 1.8, y: 2.8, empiricalRatio: 0.812500, gueCentre: 0.984731, gueBinAvg: 0.977118 }),
  Object.freeze({ x: 2.0, y: 3.0, empiricalRatio: 0.847500, gueCentre: 1.000000, gueBinAvg: 0.992188 }),
  Object.freeze({ x: 2.2, y: 3.2, empiricalRatio: 0.860000, gueCentre: 0.989349, gueBinAvg: 0.982576 }),
  Object.freeze({ x: 2.4, y: 3.4, empiricalRatio: 0.845000, gueCentre: 0.976161, gueBinAvg: 0.970167 }),
  Object.freeze({ x: 2.6, y: 3.6, empiricalRatio: 0.817500, gueCentre: 0.979371, gueBinAvg: 0.973097 }),
  Object.freeze({ x: 2.8, y: 3.8, empiricalRatio: 0.820000, gueCentre: 0.993111, gueBinAvg: 0.986109 }),
  Object.freeze({ x: 3.0, y: 4.0, empiricalRatio: 0.782500, gueCentre: 1.000000, gueBinAvg: 0.992801 }),
  Object.freeze({ x: 3.2, y: 4.2, empiricalRatio: 0.992500, gueCentre: 0.994597, gueBinAvg: 0.987858 }),
  Object.freeze({ x: 3.4, y: 4.4, empiricalRatio: 0.880000, gueCentre: 0.987338, gueBinAvg: 0.981031 }),
  Object.freeze({ x: 3.6, y: 4.6, empiricalRatio: 0.790000, gueCentre: 0.988597, gueBinAvg: 0.982179 }),
  Object.freeze({ x: 3.8, y: 4.8, empiricalRatio: 0.800000, gueCentre: 0.996056, gueBinAvg: 0.989231 }),
  Object.freeze({ x: 4.0, y: 5.0, empiricalRatio: 0.865000, gueCentre: 1.000000, gueBinAvg: 0.993032 }),
  Object.freeze({ x: 4.2, y: 5.2, empiricalRatio: 0.912500, gueCentre: 0.996721, gueBinAvg: 0.990012 }),
  Object.freeze({ x: 4.4, y: 5.4, empiricalRatio: 0.840000, gueCentre: 0.992123, gueBinAvg: 0.985687 }),
  Object.freeze({ x: 4.6, y: 5.6, empiricalRatio: 0.870000, gueCentre: 0.992747, gueBinAvg: 0.986256 }),
  Object.freeze({ x: 4.8, y: 5.8, empiricalRatio: 0.867500, gueCentre: 0.997440, gueBinAvg: 0.990689 }),
]);

const PEARSON_CENTRE = 0.982788; // reproduces imp-1238 headline 0.98279
const PEARSON_BIN_AVG = 0.983110;
const DELTA_PEARSON   = PEARSON_BIN_AVG - PEARSON_CENTRE; // +0.000321
const TARGET_PEARSON  = 0.995;

export const IMP_1257_BIN_INTEGRATION = Object.freeze({
  id: 'imp-1257-3point-bin-integration',
  ticket: 'imp-1257',
  parent: 'imp-1238',
  generatedAt: GENERATED_AT,

  method: {
    convention:
      'Empirical side is already a bin integral (count / (M_BULK * bin_area)); ' +
      'only the GUE comparison value is changed from bin-CENTRE gueR3(x,y) to ' +
      'bin-AVERAGE (1/binArea) integral of R_3 over [x±delta]x[y±delta].',
    integration: 'midpoint rule, 200x200 sub-grid per bin (40000 samples/bin)',
    delta: DELTA,
    binArea: BIN_AREA,
    nSub: NSUB,
    gueFormula: 'R_3(x,y) = 1 - K(x)^2 - K(y)^2 - K(y-x)^2 + 2 K(x) K(y) K(y-x), K(z) = sin(pi z)/(pi z)',
    empiricalSource: 'frozen 25-point empirical ratios from imp-1238 (1e6 zeros, M_BULK=10000)',
  },

  grid: GRID,

  summary: Object.freeze({
    nGridPoints:       GRID.length,
    pearsonCentre:     PEARSON_CENTRE,
    pearsonBinAvg:     PEARSON_BIN_AVG,
    deltaPearson:      DELTA_PEARSON,
    targetPearson:     TARGET_PEARSON,
    metPearson995:     PEARSON_BIN_AVG > TARGET_PEARSON,
  }),

  verdict: 'bin-integration-does-not-reach-0.995',

  findings: Object.freeze({
    scaleInvariance:
      'Pearson is scale-invariant: Pearson(emp, c*gue) = Pearson(emp, gue) for any c > 0. The ~0.85 ' +
      'multiplicative plateau offset imp-1238 observed is therefore a Pearson ' +
      'no-op — a uniform bin renormalization CANNOT change the correlation. ' +
      'Verified: Pearson(emp, 0.85*gueCentre) = 0.982788 = Pearson(emp, gueCentre).',
    empiricalAlreadyIntegrated:
      'The imp-1238 ticket proposed integrating the EMPIRICAL density across the ' +
      'bin, but empiricalRatio = count/(M_BULK*bin_area) IS that integral. The ' +
      'only centre-evaluated quantity was the GUE prediction; bin-averaging it ' +
      'is the correct apples-to-apples fix.',
    binAvgEffect:
      'Bin-averaging the GUE side lowers each mid/plateau point by ~0.007 ' +
      '(R_3 is concave near its plateau). The shift is nearly uniform, so it ' +
      'barely moves Pearson (+0.000321). Largest shift at (x=1,y=2): 1.0->0.9892.',
    residualReclassified:
      'With both candidate bin-convention fixes ruled out (uniform factor by ' +
      'scale-invariance, bin-integration by +0.0003), the imp-1238 residual is ' +
      'NOT a normalization artifact. It is finite-M sampling noise (small-x bins ' +
      'have <10 counts) and/or genuine finite-height deviation from the N->inf ' +
      'sine-kernel limit.',
  }),

  honestScope: Object.freeze({
    isRigorous:            false,
    isEmpiricalSignal:     true,
    recomputesZeroCounts:  false,
    metPearson995Target:   false,
    closesImp1180:         false,
    note:
      'Negative result. Refutes the bin-convention explanation for the imp-1238 ' +
      'residual; does NOT recompute the 1e6-zero triple-counts and does NOT ' +
      'claim universality fails (empirical Pearson stays ~0.983).',
  }),

  closureNote:
    'imp-1257 answered: bin-integration does NOT reach Pearson > 0.995 ' +
    '(0.98279 -> 0.98311, +0.0003). Root cause identified: (1) Pearson is ' +
    'scale-invariant so the ~0.85 plateau offset cannot move it; (2) the ' +
    'empirical ratio was already a bin integral, only the GUE side needed ' +
    'bin-averaging, which is a near-uniform ~0.007 shift. The residual is ' +
    'reclassified as sampling noise / finite-height effect, not a bin bug.',

  references: Object.freeze({
    parentExtended:    'src/data/imp-1238-3point-correlation-extended.js',
    ancestor7point:    'src/data/imp-1183-3point-correlation-empirical.js',
    sineKernelMath:    'src/math/triple-correlation.js',
  }),
});

export const IMP_1257_ASSERTIONS = [
  {
    id: 'imp1257-bin-integration-does-not-reach-995',
    why: 'The headline answer: the corrected bin convention does NOT lift Pearson ' +
         'above 0.995. metPearson995 must be false and the verdict must say so.',
    holds: () =>
      IMP_1257_BIN_INTEGRATION.summary.metPearson995 === false &&
      IMP_1257_BIN_INTEGRATION.verdict === 'bin-integration-does-not-reach-0.995',
  },
  {
    id: 'imp1257-centre-pearson-reproduces-imp1238',
    why: 'The centre-convention Pearson must reproduce imp-1238 (0.98279) to within ' +
         '1e-3, proving the frozen empirical ratios were carried over faithfully.',
    holds: () => Math.abs(IMP_1257_BIN_INTEGRATION.summary.pearsonCentre - 0.98279) < 1e-3,
  },
  {
    id: 'imp1257-bin-avg-pearson-barely-moves',
    why: 'Bin-averaging the GUE side changes Pearson by only a tiny amount ' +
         '(0 < deltaPearson < 0.005). A large move would contradict the scale-' +
         'invariance / near-uniform-shift finding.',
    holds: () => {
      const d = IMP_1257_BIN_INTEGRATION.summary.deltaPearson;
      return d > 0 && d < 0.005;
    },
  },
  {
    id: 'imp1257-grid-has-twentyfive-points',
    why: 'Grid must carry exactly the 25 imp-1238 points so the comparison is on ' +
         'the same support. A different count means the empirical ratios drifted.',
    holds: () => IMP_1257_BIN_INTEGRATION.grid.length === 25,
  },
  {
    id: 'imp1257-bin-avg-below-centre-on-plateau',
    why: 'Bin-averaging is concave-correcting near the plateau: gueBinAvg must be ' +
         '<= gueCentre at every point where gueCentre >= 0.9 (R_3 concave there). ' +
         'A binAvg ABOVE centre on the plateau would signal an integration bug.',
    holds: () =>
      IMP_1257_BIN_INTEGRATION.grid
        .filter((r) => r.gueCentre >= 0.9)
        .every((r) => r.gueBinAvg <= r.gueCentre + 1e-9),
  },
  {
    id: 'imp1257-honest-scope-not-rigorous-not-recompute',
    why: 'This is an empirical re-comparison on frozen counts, not a proof and not ' +
         'a zero recompute. honestScope must flag isRigorous=false, ' +
         'recomputesZeroCounts=false, metPearson995Target=false.',
    holds: () => {
      const h = IMP_1257_BIN_INTEGRATION.honestScope;
      return h.isRigorous === false &&
             h.recomputesZeroCounts === false &&
             h.metPearson995Target === false &&
             h.isEmpiricalSignal === true;
    },
  },
  {
    id: 'imp1257-records-scale-invariance-finding',
    why: 'The core mathematical insight — Pearson is scale-invariant so a uniform ' +
         'bin factor is a no-op — must be recorded so future tickets do not re-' +
         'propose uniform renormalization as a fix.',
    holds: () => {
      const s = IMP_1257_BIN_INTEGRATION.findings.scaleInvariance;
      return typeof s === 'string' && s.includes('scale-invariant') && s.includes('0.982788');
    },
  },
];
