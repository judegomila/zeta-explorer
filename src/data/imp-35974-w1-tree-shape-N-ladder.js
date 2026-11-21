/**
 * @module imp-35974-w1-tree-shape-N-ladder
 *
 * imp-35974 (numerical, S-frontier): MEASURE whether the imp-35893 pairing-tree SHAPE
 * penalty -- the worst-shape (caterpillarR) pairwise error as a fraction of the
 * log2(N)*eps ceiling -- GROWS with problem size N. imp-35893 measured tree-shape
 * sensitivity only at the single N ~ 488602 (T_PT retained-term) family, where the worst
 * caterpillarR shape reached ~4.42e-4 of the ceiling. Since a caterpillar of depth ~N/leaf
 * grows LINEARLY with N while the log2(N)*eps ceiling grows only LOGARITHMICALLY, the
 * worst/ceiling ratio could in principle climb with N -- that is the open concern this
 * module settles by re-running the balanced and caterpillarR shapes at an N ladder.
 *
 * METHOD (identical to imp-35893, re-run offline at each N; literals baked here import-light):
 *   - fixed oscillatory multiset t_k = cos(alpha*k + beta*sqrt(k))/sqrt(k), k = 1..N;
 *   - LEAF = 128 base block; balanced midpoint tree vs right caterpillar (mid = hi - leaf),
 *     both evaluated on the imp-35893 EXPLICIT work stack (no call-stack overflow at depth
 *     ~N/leaf);
 *   - exact association-invariant reference: each IEEE-754 double summed as a dyadic
 *     rational on a 2^{-96} fixed-point BigInt grid, so |scheme - trueSum| is EXACT;
 *   - normalized by Sum|t_k| (Higham scale); ceiling = log2(N)*eps (imp-35761).
 *   The offline runner is scripts/imp-35974-tree-shape-N-ladder.mjs; N = 488602 reproduces
 *   the imp-35893 baseline (worst 4.42e-4, balanced 8.48e-5) exactly.
 *
 * MEASURED LADDER (N spanning ~205x; caterpillarR depth spanning ~205x)
 * -----------------------------------------------------------------------------
 *   N            catR depth   worst err     worst/ceiling   balanced err
 *   488602          3817      ~1.854e-18    ~4.418e-4       ~3.557e-19
 *   1e6             7812      ~2.540e-18    ~5.740e-4       ~1.008e-20
 *   1e7            78124      ~6.866e-19    ~1.330e-4       ~8.560e-20
 *   1e8           781249      ~6.841e-19    ~1.159e-4       ~2.137e-20
 *
 * READING: the caterpillarR tree DEPTH grows LINEARLY with N -- from 3817 at N ~ 488602 to
 * 781249 at N = 1e8, a ~205x increase -- exactly as a ~N/leaf caterpillar must. Yet the
 * worst-shape normalized error stays in [~6.8e-19, ~2.5e-18] and its ratio to the log2(N)*eps
 * ceiling stays in [~1.16e-4, ~5.74e-4]: NON-MONOTONE and, if anything, DECLINING at the top
 * of the ladder (peaks ~5.74e-4 at N = 1e6, falls to ~1.16e-4 at N = 1e8). The worst/ceiling
 * ratio does NOT scale with N. Equivalently the worst shape UNDER-realizes its own depth*eps
 * bound by a factor that DEEPENS with N (~2.2e-6 at N ~ 488602 to ~3.9e-9 at N = 1e8): a
 * longer caterpillar spine does not let the per-addition rounding errors accumulate more
 * coherently -- it lets them accumulate LESS coherently relative to the depth*eps envelope.
 * The linear-depth worst case (depth*eps ~1.7e-10 at N = 1e8) is not approached at any N.
 *
 * CONCLUSION: the imp-35893 tree-shape penalty does NOT grow with problem size. Across N from
 * ~488602 to 1e8 the worst pairing-tree shape stays >1700x below the log2(N)*eps ceiling and
 * >10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760). Worst-case tree
 * SHAPE is non-binding on precision at every measured N, so the obstruction remains the
 * ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725); the W1
 * A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A).
 *
 * MEASUREMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no interval;
 * verifies no inequality; changes no bound; establishes no positivity; C_mb GUE-conditional
 * (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35893-w1-summation-pairwise-tree-shape (tree-SHAPE stress at the single N ~ 488602 -- this scales it in N)
 * @see imp-35852-w1-summation-adversarial-ordering (term-ORDER stress)
 * @see imp-35761-w1-certified-rounding-cost-scope (log2(N)*eps pairwise ceiling; N*eps naive ceiling)
 * @see imp-35760-w1-margin-allocation-scope (O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (pairwise summation error vs tree depth)
 */

const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const EPS_DOUBLE = 2 ** -52; // machine epsilon
const LEAF = 128; // base block size (identical to imp-35893)

// Baked literals from scripts/imp-35974-tree-shape-N-ladder.mjs (offline, exact BigInt reference).
// The N ~ 488602 rung reproduces the imp-35893 baseline (worst 4.418e-4, balanced 8.476e-5).
const LADDER = [
  {
    N: 488602,
    conditionNumber: 1391.0045053572817,
    balancedDepth: 12,
    balancedNormErr: 3.556628498813625e-19,
    caterpillarRDepth: 3817,
    caterpillarRNormErr: 1.853976417305593e-18,
    naiveNormErr: 3.032193419836597e-17,
    ceilPairwise: 4.196265611312305e-15,
    ceilNaive: 1.0849143805558015e-10,
    worstRatioToPairwiseCeiling: 0.0004418157926675657,
    balancedRatioToPairwiseCeiling: 0.00008475699176967387,
  },
  {
    N: 1000000,
    conditionNumber: 1994.3719174981852,
    balancedDepth: 13,
    balancedNormErr: 1.0079369231692707e-20,
    caterpillarRDepth: 7812,
    caterpillarRNormErr: 2.540406896714119e-18,
    naiveNormErr: 2.0839847914434185e-18,
    ceilPairwise: 4.425697268511758e-15,
    ceilNaive: 2.220446049250313e-10,
    worstRatioToPairwiseCeiling: 0.0005740128035391786,
    balancedRatioToPairwiseCeiling: 0.000002277464684131485,
  },
  {
    N: 10000000,
    conditionNumber: 6292.575965080787,
    balancedDepth: 17,
    balancedNormErr: 8.559956752456957e-20,
    caterpillarRDepth: 78124,
    caterpillarRNormErr: 6.86629572035335e-19,
    naiveNormErr: 1.5888717316375473e-17,
    ceilPairwise: 5.163313479930384e-15,
    ceilNaive: 2.220446049250313e-9,
    worstRatioToPairwiseCeiling: 0.00013298235226356868,
    balancedRatioToPairwiseCeiling: 0.00001657841768803929,
  },
  {
    N: 100000000,
    conditionNumber: 19912.90757167205,
    balancedDepth: 20,
    balancedNormErr: 2.1368148851602672e-20,
    caterpillarRDepth: 781249,
    caterpillarRNormErr: 6.841056596972897e-19,
    naiveNormErr: 4.0116987555015664e-17,
    ceilPairwise: 5.90092969134901e-15,
    ceilNaive: 2.220446049250313e-8,
    worstRatioToPairwiseCeiling: 0.00011593184387541761,
    balancedRatioToPairwiseCeiling: 0.0000036211495424067163,
  },
];

// Worst shape's under-realization of its OWN depth*eps bound, per rung (dimensionless).
const withDepthEps = LADDER.map((r) => ({
  ...r,
  worstRatioToDepthEpsBound: r.caterpillarRNormErr / (r.caterpillarRDepth * EPS_DOUBLE),
}));

const worstRatios = LADDER.map((r) => r.worstRatioToPairwiseCeiling);
const WORST_RATIO_MAX = Math.max(...worstRatios);
const WORST_RATIO_MIN = Math.min(...worstRatios);
const DEPTH_SWEEP_FACTOR =
  LADDER[LADDER.length - 1].caterpillarRDepth / LADDER[0].caterpillarRDepth;
const N_SWEEP_FACTOR = LADDER[LADDER.length - 1].N / LADDER[0].N;
// Peak ratio is at N=1e6 and the top rung (N=1e8) is LOWER, so the trend is not upward.
const RATIO_TOP_BELOW_PEAK =
  LADDER[LADDER.length - 1].worstRatioToPairwiseCeiling < WORST_RATIO_MAX;

export const IMP35974_W1_TREE_SHAPE_N_LADDER = {
  id: 'imp-35974',
  proofSection: 'S-frontier',
  question:
    'Does the imp-35893 pairing-tree SHAPE penalty (worst caterpillarR error / log2(N)*eps ceiling) GROW ' +
    'with problem size N, since imp-35893 measured tree-shape sensitivity only at the fixed N ~ 488602 ' +
    'family? Measurement only; certifies no W1 bound; changes no bound; NO QED.',
  method: {
    family: 't_k = cos(alpha*k + beta*sqrt(k))/sqrt(k), k = 1..N (same fixed multiset as imp-35893)',
    leafBlock: LEAF,
    shapes: 'balanced midpoint vs right caterpillar (mid = hi - leaf), imp-35893 explicit work stack',
    reference: 'exact association-invariant dyadic-BigInt sum on a 2^{-96} grid; error is EXACT per rung',
    ceiling: 'log2(N)*eps pairwise ceiling (imp-35761), normalized by Sum|t_k| (Higham scale)',
    offlineRunner: 'scripts/imp-35974-tree-shape-N-ladder.mjs',
    reproducesImp35893: 'the N ~ 488602 rung reproduces the imp-35893 worst 4.418e-4 / balanced 8.476e-5',
  },
  ladder: withDepthEps,
  summary: {
    nSweepFactor: N_SWEEP_FACTOR, // ~205x
    caterpillarRDepthSweepFactor: DEPTH_SWEEP_FACTOR, // ~205x (grows linearly in N)
    worstRatioToPairwiseCeilingMin: WORST_RATIO_MIN,
    worstRatioToPairwiseCeilingMax: WORST_RATIO_MAX,
    worstRatioAtLargestN: LADDER[LADDER.length - 1].worstRatioToPairwiseCeiling,
    ratioTopBelowPeak: RATIO_TOP_BELOW_PEAK,
  },
  reading: {
    depthGrowsLinearly:
      'the caterpillarR tree depth grows LINEARLY with N (3817 -> 781249, a ~205x increase over the ' +
      '~205x N range), exactly as a ~N/leaf caterpillar must',
    ratioDoesNotScale:
      'yet the worst/ceiling ratio stays in [~1.16e-4, ~5.74e-4] and is NON-MONOTONE, peaking at N = 1e6 ' +
      'and DECLINING to ~1.16e-4 at N = 1e8 -- it does NOT climb with N',
    depthEpsUnderRealizedMore:
      'the worst shape under-realizes its own depth*eps bound by a factor that DEEPENS with N ' +
      '(~2.2e-6 at N ~ 488602 to ~3.9e-9 at N = 1e8): a longer spine accumulates rounding LESS coherently ' +
      'relative to depth*eps, not more',
    farBelowCeiling:
      'at every measured N the worst pairing-tree shape stays >1700x below the log2(N)*eps ceiling and ' +
      '>10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760)',
  },
  conclusion: {
    penaltyDoesNotGrowWithN:
      'the imp-35893 tree-shape penalty does NOT grow with problem size: the worst caterpillarR / log2(N)*eps ' +
      'ratio stays bounded (and declines at the top of the ladder) as N sweeps ~205x from 488602 to 1e8, even ' +
      'though the caterpillar depth grows linearly in N',
    precisionNotBinding:
      'achievable double precision leaves overwhelming strict headroom under worst-case pairing-tree shape at ' +
      'every N; precision is NOT the binding constraint at any measured problem size',
    staysGreenfield:
      'this module re-runs pairwise errors under the worst tree shape across N only; it evaluates no sum of H_t ' +
      'and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) ' +
      'and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Re-running the imp-35893 balanced and ' +
    'right-caterpillar pairing-tree shapes on the fixed oscillatory multiset at a ladder N in ' +
    '{488602, 1e6, 1e7, 1e8} against the same association-invariant exact BigInt reference, the caterpillarR ' +
    'tree depth grows LINEARLY with N (3817 -> 781249, ~205x) while the log2(N)*eps ceiling grows only ' +
    'logarithmically -- yet the worst-shape normalized error stays in [~6.8e-19, ~2.5e-18] and its ratio to the ' +
    'ceiling stays in [~1.16e-4, ~5.74e-4], NON-MONOTONE and DECLINING at the top rung (peak ~5.74e-4 at N = 1e6, ' +
    '~1.16e-4 at N = 1e8). The worst/ceiling ratio does NOT scale with N; equivalently the worst shape ' +
    'under-realizes its own depth*eps bound by a factor that DEEPENS with N (~2.2e-6 to ~3.9e-9), so a longer ' +
    'caterpillar spine accumulates rounding LESS coherently relative to depth*eps, not more. The linear-depth ' +
    'worst case is not approached at any N; the worst shape stays >1700x below the ceiling and >10 orders below ' +
    'the O(1) barrier margin |A_t + B_t| - |C_t| at every measured N. The imp-35893 tree-shape penalty does NOT ' +
    'grow with problem size; precision is NOT the binding constraint at any measured N, and the obstruction stays ' +
    'the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). Certifies no W1 bound; ' +
    'evaluates no true H_0; instantiates no interval; verifies no inequality; changes no bound; establishes no ' +
    'positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional (imp-486) untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35893 (tree-SHAPE stress at the single N ~ 488602, scaled in N here); imp-35852 (term-ORDER stress); ' +
    'imp-35761 (pairwise log2(N)*eps and naive N*eps ceilings); imp-35760 (barrier-margin allocation); ' +
    'imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); imp-35681 Part A (A+B-C interval bound ' +
    'greenfield); Higham 2002 (pairwise summation error vs tree depth); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35974_W1_TREE_SHAPE_N_LADDER_ASSERTIONS = [
  {
    // Four rungs; N ~ 488602 rung reproduces the imp-35893 worst 4.418e-4 / balanced 8.476e-5.
    id: 'imp35974-rung0-reproduces-imp35893',
    description: 'N ~ 488602 rung reproduces the imp-35893 worst 4.418e-4 / balanced 8.476e-5 (within 1%)',
    holds: () =>
      LADDER.length === 4 &&
      LADDER[0].N === 488602 &&
      Math.abs(LADDER[0].worstRatioToPairwiseCeiling - 4.418e-4) / 4.418e-4 < 0.01 &&
      Math.abs(LADDER[0].balancedRatioToPairwiseCeiling - 8.476e-5) / 8.476e-5 < 0.01,
  },
  {
    // Caterpillar depth grows ~linearly in N: depth sweep factor tracks the N sweep factor.
    id: 'imp35974-caterpillar-depth-linear-in-N',
    description: 'caterpillarR depth grows ~linearly in N (depth sweep ~ N sweep, both ~205x)',
    holds: () =>
      DEPTH_SWEEP_FACTOR > 150 &&
      Math.abs(DEPTH_SWEEP_FACTOR - N_SWEEP_FACTOR) / N_SWEEP_FACTOR < 0.05 &&
      LADDER.every((r) => Math.abs(r.caterpillarRDepth - r.N / LEAF) / (r.N / LEAF) < 0.01),
  },
  {
    // THE MEASUREMENT: worst/ceiling ratio does NOT grow with N -- bounded and top rung below peak.
    id: 'imp35974-worst-ratio-does-not-grow-with-N',
    description: 'Worst/ceiling ratio stays bounded ~[1e-4, 6e-4] and the largest-N rung is BELOW the peak',
    holds: () =>
      WORST_RATIO_MAX < 1e-3 &&
      WORST_RATIO_MIN > 1e-5 &&
      RATIO_TOP_BELOW_PEAK &&
      LADDER[LADDER.length - 1].worstRatioToPairwiseCeiling < LADDER[0].worstRatioToPairwiseCeiling,
  },
  {
    // Every rung stays >1700x below the log2(N)*eps ceiling and well below the naive N*eps ceiling.
    id: 'imp35974-every-rung-far-below-ceiling',
    description: 'Every rung stays >1700x below the log2(N)*eps ceiling; worst err well below the naive N*eps ceiling',
    holds: () =>
      LADDER.every(
        (r) =>
          r.caterpillarRNormErr > 0 &&
          r.caterpillarRNormErr < r.ceilPairwise / 1700 &&
          r.caterpillarRNormErr < 1e-6 * r.ceilNaive,
      ),
  },
  {
    // Depth*eps bound is under-realized MORE at larger N (longer spine -> less coherent vs depth*eps).
    id: 'imp35974-depth-eps-under-realized-deepens',
    description: 'Worst shape under-realizes its depth*eps bound by a factor that deepens with N',
    holds: () =>
      withDepthEps[0].worstRatioToDepthEpsBound < 1e-5 &&
      withDepthEps[withDepthEps.length - 1].worstRatioToDepthEpsBound <
        withDepthEps[0].worstRatioToDepthEpsBound &&
      withDepthEps.every((r) => r.worstRatioToDepthEpsBound < 1e-5),
  },
  {
    // Honesty gate: measurement only; penalty does not grow; obstruction greenfield; no QED; no refereed bound is changed.
    id: 'imp35974-honesty-gate',
    description: 'Measurement only; tree-shape penalty does not grow with N; obstruction greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35974_W1_TREE_SHAPE_N_LADDER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /does NOT grow with problem size/.test(
        IMP35974_W1_TREE_SHAPE_N_LADDER.conclusion.penaltyDoesNotGrowWithN,
      ) &&
      /GREENFIELD/.test(IMP35974_W1_TREE_SHAPE_N_LADDER.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35974_W1_TREE_SHAPE_N_LADDER.verdict) &&
      /refereed bound is changed/i.test(IMP35974_W1_TREE_SHAPE_N_LADDER.verdict),
  },
];

for (const a of IMP35974_W1_TREE_SHAPE_N_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35974-w1-tree-shape-N-ladder assertion failed: ${a.id}`);
  }
}
