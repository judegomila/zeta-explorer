// @module data/imp-1328-T_PT-compute-design
// imp-1328 -- OPUS: GPU-accelerated zero-verification compute design for pushing
// the Platt-Trudgian verified-strip height T_PT = 3e12 toward 10^14.
// This is an ENGINEERING DESIGN ONLY -- no zeros are computed here. The output
// is a feasibility study: method stack, cost model, GPU mapping, candidate
// hardware, risk register, and an honest sub-gap naming the two open risks.
//
// PARENT: imp-1323 confirmed (sonnet-4-6, 2026-05-29) that NO peer-reviewed
// successor to Platt-Trudgian 2021 (T_PT = 3e12, Bull. London Math. Soc. 53
// (2021) 792-797) exists. The Lambda lever is therefore purely computational:
// a 10x T_PT increase gives a (T_new / 3e12)^{0.4} ~ 4.07x Lambda tightening at
// T = 1e14 (Ingham e_I(0.75) = 0.6, kappa = 0.4; see imp-1323 / imp-447).
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'feasible-with-amortization-two-engineering-risks-named'
//
//   * NAIVE Riemann-Siegel (one Z(t) main sum per zero bracket) is INFEASIBLE:
//     ~4.6e21 multiply-adds for the strip (3e12, 1e14). Zettaflop-scale.
//   * The Odlyzko-Schonhage (1988) / Platt-FFT band-limited amortization drops
//     the amortized per-evaluation cost from O(sqrt(T)) main-sum terms to a
//     polylog-effective cost shared across an FFT block, bringing total work to
//     ~1e17 - 1e18 effective operations -- exaflop-day to exaflop-month scale,
//     reachable on a modern accelerator cluster over a multi-month campaign.
//   * Two engineering risks are NOT closed by this design and are named as a
//     single sub-gap (SUBGAP-1328): (R-AMORT) the amortization constant is the
//     dominant order-of-magnitude uncertainty in the cost, and (R-RIGOR) the
//     rigorous interval / ball-arithmetic error bound and deterministic FP
//     reduction on a GPU (weak FP128, non-associative parallel sums) are the
//     binding correctness risk -- Platt-Trudgian rigor used CPU interval
//     arithmetic, and porting that guarantee to GPU is unsolved here.
//
// HONEST BOTTOM LINE
// ------------------
// This ships an engineering design, not a verification. No zero is checked, no
// new T_PT is claimed, and the rigorous Lambda bound stays E_trunc_pt = 3.06e-5
// (tighteningFactorRigorous = 1.0). The design says a T = 1e14 campaign is
// plausible on a GPU cluster IF R-RIGOR is solved; until then the GPU route is a
// fast PROBABLE-zero locator, not a rigorous strip certificate.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc block comments). Single-quoted strings only.
// No apostrophes inside single-quoted strings. No star-slash in any comment.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- Problem-size primitives. N(T), Riemann-Siegel main-sum length.
// ─────────────────────────────────────────────────────────────────────────────

const TWO_PI = 2 * Math.PI;
const T_PT_BASELINE = 3e12;
const T_TARGET = 1e14;
const SIGMA_OPT = 0.75;

// Riemann-von Mangoldt zero-count main term: N(T) ~ (T/2pi)(log(T/2pi) - 1) + 7/8.
function zeroCount(T) {
  const x = T / TWO_PI;
  return x * Math.log(x) - x + 7 / 8;
}

// Riemann-Siegel main-sum length nu(t) = floor(sqrt(t / 2pi)).
// This is the per-evaluation arithmetic cost of a NAIVE Z(t) evaluation.
function rsMainSumLength(t) {
  return Math.floor(Math.sqrt(t / TWO_PI));
}

// Ingham 1940 zero-density exponent and the T_PT Lambda tightening factor
// (carried verbatim from imp-1323 so this file is self-checking against it).
function inghamExponent(sigma) {
  return (3 * (1 - sigma)) / (2 - sigma);
}
function tighteningFactor(T_new) {
  const kappa = 1 - inghamExponent(SIGMA_OPT); // 0.4 at sigma = 0.75
  return Math.pow(T_new / T_PT_BASELINE, kappa);
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- Method stack. The named hybrid from the ticket, layer by layer.
// ─────────────────────────────────────────────────────────────────────────────

const METHOD_STACK = Object.freeze([

  Object.freeze({
    layer: 'L1-fast-evaluation',
    name: 'Riemann-Siegel + Gourdon hybrid main-sum evaluation',
    role: 'Evaluate Z(t) = e^{i theta(t)} zeta(1/2 + it) on the critical line.',
    detail:
      'The Riemann-Siegel formula reduces zeta(1/2 + it) to a main sum of ' +
      'nu(t) = floor(sqrt(t/2pi)) terms plus an asymptotic correction series in ' +
      't^{-1/4}. Gourdon (2004) couples this with a multi-evaluation scheme so ' +
      'many nearby t are handled together. At T = 1e14 the naive main sum is ' +
      '~3.99e6 terms per evaluation -- this is the layer the GPU accelerates.',
    gpuFit: 'excellent -- the main sum is an embarrassingly parallel reduction',
  }),

  Object.freeze({
    layer: 'L2-amortization',
    name: 'Odlyzko-Schonhage (1988) band-limited multi-point evaluation',
    role: 'Amortize the sqrt(T) main-sum cost across a block of many t.',
    detail:
      'Naively evaluating Z at every one of the ~4.56e14 zero brackets in the ' +
      'strip costs O(ZeroCount * sqrt(T)). Odlyzko-Schonhage evaluates zeta at M ' +
      'equally-spaced points in a height window in O((M + sqrt(T)) polylog) via a ' +
      'Taylor expansion of n^{-it} around block centers and an FFT. Amortized ' +
      'per-point cost collapses from O(sqrt(T)) to O(polylog T). This is the ' +
      'single most important layer for feasibility -- without it the campaign is ' +
      'zettaflop-scale and hopeless.',
    gpuFit: 'good -- batched FFTs map to cuFFT/rocFFT; precision is the catch',
  }),

  Object.freeze({
    layer: 'L3-counting',
    name: 'Booker-Trudgian-Platt rigorous Turing method',
    role: 'Certify that the count of sign changes equals N(T) exactly.',
    detail:
      'Turing (1953) bounds the argument S(T) = (1/pi) arg zeta(1/2 + iT) by ' +
      'integrating just above the critical line, giving a rigorous a-posteriori ' +
      'certificate that the number of observed sign changes of Z equals the ' +
      'analytic zero count N(T) -- hence ALL zeros below T are simple and on the ' +
      'line. Booker and Trudgian sharpened the explicit S(T) constants; Platt ' +
      'wrapped the whole pipeline in interval arithmetic. This layer is what ' +
      'makes the result a PROOF rather than a numerical observation.',
    gpuFit: 'partial -- the S(T) integral is cheap; rigor lives in L4',
  }),

  Object.freeze({
    layer: 'L4-rigor',
    name: 'Platt interval / ball-arithmetic error envelope',
    role: 'Bound every floating-point and truncation error rigorously.',
    detail:
      'Platt-Trudgian rigor rests on CPU interval arithmetic (or ball arithmetic ' +
      'a la Arb): every Z(t) value carries a certified enclosure, so a sign is ' +
      'only accepted when the enclosure excludes zero. Porting this to a GPU is ' +
      'the open problem (R-RIGOR): GPUs have weak / no FP128, and parallel ' +
      'reductions are non-associative, so a naive GPU sum is not bit-reproducible ' +
      'and its rounding error is not a priori bounded. Deterministic (pairwise / ' +
      'fixed-point superaccumulator) reductions and double-double arithmetic are ' +
      'the candidate fixes, each carrying a constant-factor slowdown.',
    gpuFit: 'hard -- this layer is the binding correctness risk for any GPU port',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- Cost model. Two scenarios bracket the answer.
// ─────────────────────────────────────────────────────────────────────────────
//
// Strip of interest: (T_PT_BASELINE, T_TARGET) = (3e12, 1e14).
// Incremental zeros to certify: dN = ZeroCount(1e14) - ZeroCount(3e12) ~ 4.56e14.

const D_ZEROS_STRIP = zeroCount(T_TARGET) - zeroCount(T_PT_BASELINE); // ~4.555e14

// Model A -- NAIVE: ~1 main-sum evaluation per zero bracket (lower bound; real
// sign-change bracketing + Rosser-rule exceptions push the constant to 2-5x).
// Per-evaluation cost ~ rsMainSumLength at the top of the strip.
const NAIVE_OPS_PER_EVAL = rsMainSumLength(T_TARGET); // ~3.99e6 multiply-adds
const NAIVE_TOTAL_OPS = D_ZEROS_STRIP * NAIVE_OPS_PER_EVAL; // ~1.8e21 (c = 1)

// Model B -- AMORTIZED (Odlyzko-Schonhage / Platt FFT): amortized per-evaluation
// cost drops to an effective polylog. We model it as a constant AMORT_EFF
// effective operations per zero bracket. This constant is the DOMINANT
// uncertainty (R-AMORT): published OS implementations land in the few-hundred to
// few-thousand effective-op range per evaluated point once the shared FFT and
// Taylor coefficients are charged. We pin a central estimate and a band.
const AMORT_EFF_CENTRAL = 2000;  // effective ops per zero bracket (central)
const AMORT_EFF_LOW = 300;       // optimistic
const AMORT_EFF_HIGH = 20000;    // pessimistic (heavy precision overhead)

const AMORT_TOTAL_OPS_CENTRAL = D_ZEROS_STRIP * AMORT_EFF_CENTRAL; // ~9.1e17
const AMORT_TOTAL_OPS_LOW = D_ZEROS_STRIP * AMORT_EFF_LOW;         // ~1.4e17
const AMORT_TOTAL_OPS_HIGH = D_ZEROS_STRIP * AMORT_EFF_HIGH;       // ~9.1e18

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- GPU throughput model and wall-clock estimate.
// ─────────────────────────────────────────────────────────────────────────────
//
// We require HIGH PRECISION (double-double, ~ FP128 effective) for L1/L2 to keep
// the L4 enclosure tight. Double-double multiply costs ~15-25x an FP64 multiply,
// so effective high-precision throughput is FP64_PEAK / ~20.

const H100_FP64_PEAK = 34e12;          // ~34 TFLOP/s FP64 (non-tensor), per H100
const DD_PRECISION_OVERHEAD = 20;      // double-double slowdown vs raw FP64
const H100_HP_EFFECTIVE = H100_FP64_PEAK / DD_PRECISION_OVERHEAD; // ~1.7e12 hp-op/s

// Wall-clock for the AMORTIZED central model on a single H100, and on a cluster.
const SECONDS_SINGLE_H100_CENTRAL = AMORT_TOTAL_OPS_CENTRAL / H100_HP_EFFECTIVE; // ~5.4e5 s
const GPU_CLUSTER_SIZE = 256;          // candidate campaign cluster
const SECONDS_CLUSTER_CENTRAL =
  SECONDS_SINGLE_H100_CENTRAL / GPU_CLUSTER_SIZE; // ~2100 s of pure compute
// NOTE: the ~2100 s figure is PURE FLOP time and is deliberately optimistic; it
// ignores FFT memory traffic, host-device transfer, the L4 enclosure overhead,
// Rosser-exception re-refinement, and the (large) R-AMORT uncertainty band. The
// honest planning figure is a multi-MONTH campaign, dominated by R-AMORT.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 -- Candidate hardware.
// ─────────────────────────────────────────────────────────────────────────────

const HARDWARE_CANDIDATES = Object.freeze([
  Object.freeze({
    id: 'nvidia-h100-h200',
    fp64PeakTFLOPs: 34,
    note:
      'Strong FP64 + cuFFT make H100/H200 the default. No native FP128: double- ' +
      'double via two FP64 mantissas is the practical high-precision path, costing ' +
      'the ~20x DD_PRECISION_OVERHEAD modelled above. Best ecosystem maturity.',
    rigorRisk: 'non-associative warp reductions break bit-reproducibility (R-RIGOR)',
  }),
  Object.freeze({
    id: 'amd-mi300a-mi300x',
    fp64PeakTFLOPs: 81,
    note:
      'MI300 has roughly 2x the H100 FP64 peak and a large unified HBM pool, ' +
      'helpful for big OS / FFT blocks. rocFFT is less mature than cuFFT. Strong ' +
      'candidate precisely because L1/L2 are FP64-bound, not tensor-bound.',
    rigorRisk: 'same deterministic-reduction problem; ROCm tooling less battle-tested',
  }),
  Object.freeze({
    id: 'cpu-avx512-cluster',
    fp64PeakTFLOPs: 3,
    note:
      'The INCUMBENT path -- Platt-Trudgian rigor was achieved on CPU interval ' +
      'arithmetic. Per-socket FP64 is ~10x below a GPU, but FP128 / interval ' +
      'libraries (MPFR, Arb) are native and bit-reproducible, so L4 rigor is a ' +
      'solved problem here. The honest baseline the GPU design must BEAT on a ' +
      'rigor-adjusted basis, not just on raw FLOP.',
    rigorRisk: 'none -- this is the reference for correctness; the risk is wall-clock',
  }),
]);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 -- Risk register and the named sub-gap.
// ─────────────────────────────────────────────────────────────────────────────

const RISK_REGISTER = Object.freeze([
  Object.freeze({
    id: 'R-AMORT',
    severity: 'high',
    title: 'Amortization constant is the dominant cost uncertainty',
    detail:
      'Total compute scales linearly in AMORT_EFF, the effective ops per zero ' +
      'bracket after Odlyzko-Schonhage amortization. The central / low / high band ' +
      '(2000 / 300 / 20000) spans ~2 orders of magnitude, so the wall-clock ' +
      'estimate is only order-of-magnitude. Closing this needs a prototype OS ' +
      'block benchmarked at height ~1e13 before any 1e14 campaign is budgeted.',
  }),
  Object.freeze({
    id: 'R-RIGOR',
    severity: 'critical',
    title: 'Rigorous GPU error enclosure + deterministic reduction unsolved',
    detail:
      'Platt-Trudgian rigor relies on CPU interval arithmetic. A GPU port must ' +
      'reproduce a CERTIFIED enclosure on hardware with weak/no FP128 and ' +
      'non-associative parallel sums. Without a deterministic superaccumulator or ' +
      'a verified double-double error bound, the GPU output is a PROBABLE-zero ' +
      'list, not a proof. This is the binding correctness risk and the reason the ' +
      'rigorous Lambda bound stays 3.06e-5 until it is solved.',
  }),
  Object.freeze({
    id: 'R-ROSSER',
    severity: 'medium',
    title: 'Rosser-rule exceptions grow with height',
    detail:
      'Gram-point / Rosser-rule violations (bad Gram blocks) become denser as T ' +
      'grows, forcing adaptive re-sampling that inflates the effective per-zero ' +
      'evaluation count. Handled by Platt-Trudgian at 3e12 but a non-trivial ' +
      'scheduling and load-balance problem on a GPU at 1e14.',
  }),
]);

const ALLOWED_VERDICTS = Object.freeze([
  'feasible-with-amortization-two-engineering-risks-named',
  'infeasible-even-with-amortization',
  'feasible-and-rigor-solved',
]);

const VERDICT = 'feasible-with-amortization-two-engineering-risks-named';

const SUBGAP = Object.freeze({
  id: 'SUBGAP-1328-gpu-rigor-and-amortization-constant',
  liveLever:
    'Odlyzko-Schonhage / Platt-FFT amortization makes the FLOP budget (~1e17-1e18 ' +
    'effective ops) reachable on a 256-accelerator cluster over a multi-month ' +
    'campaign -- the compute is NOT the wall.',
  deadLever:
    'A naive Riemann-Siegel-only GPU campaign (no amortization) is ~1.8e21+ ops ' +
    'and is hopeless regardless of cluster size.',
  openRisks: Object.freeze(['R-AMORT', 'R-RIGOR']),
  honest:
    'This is an engineering design only. No zero is verified, no new T_PT is ' +
    'claimed, and tighteningFactorRigorous stays 1.0. The GPU route is a fast ' +
    'PROBABLE-zero locator today; it becomes a rigorous strip certificate only ' +
    'when R-RIGOR (certified GPU enclosure + deterministic reduction) is closed.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 -- Honest scope.
// ─────────────────────────────────────────────────────────────────────────────

const HONEST_SCOPE = Object.freeze([
  'NO EXECUTION. This file computes problem-size primitives (N(T), main-sum ' +
    'length) and a parametric cost model. It does NOT evaluate Z(t), does NOT ' +
    'locate any zero, and does NOT certify any height. The rigorous Lambda bound ' +
    'is unchanged at E_trunc_pt = 3.06e-5; tighteningFactorRigorous = 1.0.',

  'The PAYOFF if a future campaign succeeds: at T = 1e14 the Lambda tightening ' +
    'factor is (1e14/3e12)^{0.4} ~ 4.07x, taking E_trunc_pt from 3.06e-5 to ' +
    '~7.53e-6 (see imp-1323 hypothetical scenarios, reproduced here). The ' +
    'intermediate T = 1e13 gives ~1.62x (E_trunc_pt ~ 1.89e-5).',

  'The cost model is ORDER-OF-MAGNITUDE only. The amortization constant ' +
    '(R-AMORT) spans the 300-20000 effective-op band, so the total work estimate ' +
    'spans ~1.4e17 to ~9.1e18 ops. The pure-FLOP cluster wall-clock (~2100 s) is ' +
    'deliberately optimistic and must NOT be read as a campaign duration -- the ' +
    'realistic figure is multi-month once memory traffic, the L4 enclosure, and ' +
    'Rosser re-refinement are charged.',

  'The binding risk is RIGOR, not FLOP. Platt-Trudgian rigor is CPU interval ' +
    'arithmetic; reproducing a certified enclosure on a GPU (no FP128, ' +
    'non-associative reductions) is unsolved here and is the reason the headline ' +
    'verdict is feasible-WITH-risks rather than feasible-and-rigor-solved. A ' +
    'high-FP64 CPU cluster (Platt baseline) remains the rigor reference the GPU ' +
    'design must beat on a rigor-adjusted basis, not just on raw throughput.',
]);

// ─────────────────────────────────────────────────────────────────────────────
// Frozen export record.
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1328_T_PT_COMPUTE_DESIGN = Object.freeze({
  id: 'imp-1328',
  ticket: 'imp-1328',
  title: 'Compute design: GPU-accelerated zero verification past T_PT = 3e12 toward 10^14',
  shippedAt: '2026-06-03T00:00:00Z',
  shippedBy: 'opus-4-8 (api-pool)',

  // Anchors.
  T_PT_baseline: T_PT_BASELINE,
  T_target: T_TARGET,
  sigmaOpt: SIGMA_OPT,

  // Problem size.
  zeroCount_baseline: zeroCount(T_PT_BASELINE),   // ~1.236e13
  zeroCount_target: zeroCount(T_TARGET),          // ~4.679e14
  dZerosStrip: D_ZEROS_STRIP,                     // ~4.555e14
  rsMainSumLength_target: rsMainSumLength(T_TARGET), // ~3.99e6

  // Method stack and hardware.
  methodStack: METHOD_STACK,
  hardwareCandidates: HARDWARE_CANDIDATES,

  // Cost model.
  costModel: Object.freeze({
    naiveOpsPerEval: NAIVE_OPS_PER_EVAL,
    naiveTotalOps: NAIVE_TOTAL_OPS,                // ~1.8e21
    amortEffCentral: AMORT_EFF_CENTRAL,
    amortEffLow: AMORT_EFF_LOW,
    amortEffHigh: AMORT_EFF_HIGH,
    amortTotalOpsCentral: AMORT_TOTAL_OPS_CENTRAL, // ~9.1e17
    amortTotalOpsLow: AMORT_TOTAL_OPS_LOW,         // ~1.4e17
    amortTotalOpsHigh: AMORT_TOTAL_OPS_HIGH,       // ~9.1e18
    h100HpEffective: H100_HP_EFFECTIVE,
    ddPrecisionOverhead: DD_PRECISION_OVERHEAD,
    gpuClusterSize: GPU_CLUSTER_SIZE,
    secondsSingleH100Central: SECONDS_SINGLE_H100_CENTRAL,
    secondsClusterCentral: SECONDS_CLUSTER_CENTRAL,
  }),

  // Verdict, risks, sub-gap.
  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  riskRegister: RISK_REGISTER,
  subGap: SUBGAP,

  // Lambda payoff (reproduced from imp-1323 so the two files cannot drift).
  lambdaPayoff: Object.freeze({
    tightening_1e13: tighteningFactor(1e13),       // ~1.619
    tightening_1e14: tighteningFactor(1e14),       // ~4.066
    etruncPt_baseline: 3.06e-5,
    etruncPt_1e14: 3.06e-5 / tighteningFactor(1e14), // ~7.53e-6
    tighteningFactorRigorous: 1.0,                  // NO gain delivered today
  }),

  honestScope: HONEST_SCOPE,

  // Cross-references.
  crossReferences: Object.freeze({
    'imp-1323': 'src/data/imp-1323-T-PT-successor-audit.js (parent; no peer-reviewed T_PT successor; named this design follow-up)',
    'imp-1326': 'src/data/imp-1326-riemann-siegel-error-sharpening.js (Riemann-Siegel truncation-error analysis feeding L4 enclosure)',
    'imp-447':  'src/data/finite-height-beats-platt-trudgian.js (E_trunc_pt = 3.06e-5 derivation consuming T_PT)',
    'imp-1261': 'src/data/imp-1261-asymptotic-lambda-redirect-shipped.js (Lambda composition consuming T_PT)',
  }),

  // Pinned numerics for tripwire verification.
  pinnedNumerics: Object.freeze({
    T_PT_baseline: 3e12,
    T_target: 1e14,
    dZerosStrip: 4.555e14,
    rsMainSumLength_3e12: 690988,
    rsMainSumLength_1e14: 3989422,
    naiveTotalOps: 1.817e21,
    amortTotalOpsCentral: 9.11e17,
    tightening_1e14: 4.066,
    etruncPt_1e14: 7.53e-6,
  }),
});

export default IMP_1328_T_PT_COMPUTE_DESIGN;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (8 shipped; ticket spec requires 8).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_1328_T_PT_COMPUTE_DESIGN_ASSERTIONS = [

  // Tripwire 1: anchors are the canonical T_PT = 3e12 baseline and 1e14 target.
  {
    id: 'imp1328-anchors-correct',
    why:
      'T_PT_baseline must equal 3e12 (Platt-Trudgian 2021) and T_target must equal ' +
      '1e14 (the ticket goal). If either drifts the entire design is mis-anchored ' +
      'and the cost model is computed for the wrong heights.',
    holds: () => {
      const r = IMP_1328_T_PT_COMPUTE_DESIGN;
      return r.T_PT_baseline === 3e12 && r.T_target === 1e14;
    },
  },

  // Tripwire 2: verdict is in the allowed set and is the feasible-with-risks one.
  {
    id: 'imp1328-verdict-in-allowed-set',
    why:
      'The verdict must be one of the allowed strings so downstream engine ticks ' +
      'can route on it. A verdict outside the set means a non-canonical conclusion ' +
      'shipped.',
    holds: () => {
      const r = IMP_1328_T_PT_COMPUTE_DESIGN;
      return typeof r.verdict === 'string' && r.allowedVerdicts.includes(r.verdict);
    },
  },

  // Tripwire 3: NO rigorous Lambda gain is claimed (this is a design, not a run).
  {
    id: 'imp1328-no-rigorous-lambda-gain-claimed',
    why:
      'This ticket is an engineering design with NO execution. tighteningFactorRigorous ' +
      'must equal 1.0 -- the rigorous E_trunc_pt stays 3.06e-5. A regression claiming ' +
      'a rigorous gain > 1 would falsely report an unearned Lambda improvement from a ' +
      'study that verified no zeros.',
    holds: () => {
      const p = IMP_1328_T_PT_COMPUTE_DESIGN.lambdaPayoff;
      return Number.isFinite(p.tighteningFactorRigorous) &&
        Math.abs(p.tighteningFactorRigorous - 1.0) < 1e-12;
    },
  },

  // Tripwire 4: Riemann-Siegel main-sum length at 1e14 matches floor(sqrt(T/2pi)).
  {
    id: 'imp1328-rs-main-sum-length-1e14-correct',
    why:
      'The naive per-evaluation cost is the Riemann-Siegel main-sum length ' +
      'floor(sqrt(1e14 / 2pi)) ~ 3.99e6. Drift here corrupts the naive-cost branch ' +
      'and therefore the feasibility argument for amortization.',
    holds: () => {
      const r = IMP_1328_T_PT_COMPUTE_DESIGN;
      return Math.abs(r.rsMainSumLength_target - 3989422) <= 2;
    },
  },

  // Tripwire 5: amortization strictly beats naive by many orders of magnitude.
  {
    id: 'imp1328-amortization-beats-naive',
    why:
      'The whole feasibility claim rests on Odlyzko-Schonhage amortization. The ' +
      'central amortized op count must be at least 100x below the naive op count; ' +
      'if it is not, the design has lost the argument that makes 1e14 reachable.',
    holds: () => {
      const c = IMP_1328_T_PT_COMPUTE_DESIGN.costModel;
      return Number.isFinite(c.naiveTotalOps) &&
        Number.isFinite(c.amortTotalOpsCentral) &&
        c.amortTotalOpsCentral > 0 &&
        c.naiveTotalOps / c.amortTotalOpsCentral > 100;
    },
  },

  // Tripwire 6: both binding risks (R-AMORT, R-RIGOR) are registered and named in the sub-gap.
  {
    id: 'imp1328-both-binding-risks-registered',
    why:
      'An honest feasibility study must name its two open engineering risks: the ' +
      'amortization constant (R-AMORT) and the rigorous GPU enclosure (R-RIGOR). ' +
      'Both must appear in the risk register AND in the sub-gap openRisks list. ' +
      'Omitting either would overstate the readiness of the GPU route.',
    holds: () => {
      const r = IMP_1328_T_PT_COMPUTE_DESIGN;
      const ids = new Set(r.riskRegister.map((x) => x.id));
      const sub = r.subGap.openRisks;
      return ids.has('R-AMORT') && ids.has('R-RIGOR') &&
        sub.includes('R-AMORT') && sub.includes('R-RIGOR');
    },
  },

  // Tripwire 7: the named method-stack hybrid is present (RS-Gourdon, OS, Turing/Platt).
  {
    id: 'imp1328-method-stack-hybrid-present',
    why:
      'The ticket specifies a Riemann-Siegel-Gourdon hybrid + Booker-Trudgian-Platt ' +
      'Turing method, with amortization. All four layers (fast-eval, amortization, ' +
      'counting, rigor) must be present or the design does not match its spec.',
    holds: () => {
      const layers = new Set(IMP_1328_T_PT_COMPUTE_DESIGN.methodStack.map((m) => m.layer));
      return layers.has('L1-fast-evaluation') &&
        layers.has('L2-amortization') &&
        layers.has('L3-counting') &&
        layers.has('L4-rigor');
    },
  },

  // Tripwire 8: Lambda payoff at 1e14 matches the imp-1323 formula (no drift between files).
  {
    id: 'imp1328-lambda-payoff-1e14-matches-imp1323',
    why:
      'The T = 1e14 Lambda tightening must equal (1e14/3e12)^{0.4} ~ 4.066 and ' +
      'E_trunc_pt must drop to ~7.53e-6, matching the imp-1323 hypothetical ' +
      'scenarios. Drift > 0.01 (factor) or > 1e-7 (E_trunc) means this design has ' +
      'diverged from the canonical Ingham chain.',
    holds: () => {
      const p = IMP_1328_T_PT_COMPUTE_DESIGN.lambdaPayoff;
      return Math.abs(p.tightening_1e14 - 4.066) < 0.01 &&
        Math.abs(p.etruncPt_1e14 - 7.53e-6) < 1e-7;
    },
  },
];
