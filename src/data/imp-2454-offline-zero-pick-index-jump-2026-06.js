/**
 * imp-2454: finite synthetic Pick-model diagnostics.
 * Correction 2026-11-01: equal-diagonal Jacobi rotations and finite/domain checks
 * replace the historical routine. An own-pole sample is invalid, not index zero.
 * Generalized Nevanlinna functions may be meromorphic: only regular nodes are
 * admissible. See docs/weil-pick-numerical-safety.md for exact model identities.
 * These models do not construct or inject actual off-line Riemann zeros.
 */
import { divideComplex, evaluatePickDiagnostic } from '../math/weil-pick-safety.mjs';

const cSub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cAdd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cDiv = divideComplex;

function imp2454Nodes(xs, ys) {
  const nd = [];
  for (const x of xs) for (const y of ys) nd.push([x, y]);
  return nd;
}

// Four C+ sets (not nested). Global negative index is a supremum over sets;
// arbitrary smaller sets need not attain it.
const IMP2454_NODE_SETS = Object.freeze([
  imp2454Nodes([-2, -1, 1, 2], [0.5, 1.0]),
  imp2454Nodes([-3, -1.5, 1.5, 3], [0.4, 0.8, 1.5]),
  imp2454Nodes([-4, -2, -1, 1, 2, 4], [0.3, 0.7, 1.2, 2.0]),
  imp2454Nodes([-5, -3, -1, 1, 3, 5], [0.25, 0.6, 1.0, 1.8, 3.0]),
]);

const IMP2454_GAMMA = Object.freeze([
  14.134725142, 21.022039639, 25.010857580,
  30.424876126, 32.935061588, 37.586178159,
]);
const IMP2454_T = [];
for (const g of IMP2454_GAMMA) { IMP2454_T.push(g); IMP2454_T.push(-g); }
function imp2454BaselineM(z) {
  let s = [0, 0];
  for (const t of IMP2454_T) s = cAdd(s, cDiv([1, 0], cSub([t, 0], z)));
  return s;
}

// ----- SYNTHETIC NEGATIVE REAL MASSES -----
// Distinct negative real masses disjoint from the positive support give exactly
// kappa global negative squares. This does NOT inject actual zeta zeros.
const IMP2454_INJECTED = Object.freeze([
  Object.freeze({ center: 3.0, height: 1.4 }),
  Object.freeze({ center: -7.5, height: 0.9 }),
  Object.freeze({ center: 18.0, height: 2.1 }),
]);
// Historical manufactured coordinates, not zeros of a reconstructed m or xi.
const IMP2454_OFFLINE_ZEROS = Object.freeze(
  IMP2454_INJECTED.map((d) => Object.freeze({
    center: d.center,
    height: d.height,
    zeroPlus: Object.freeze([d.center, d.height]),
    zeroMinus: Object.freeze([d.center, -d.height]),
  }))
);
function imp2454PerturbedM(kappa) {
  return (z) => {
    let s = imp2454BaselineM(z);
    for (let j = 0; j < kappa; j++) {
      const d = IMP2454_INJECTED[j];
      // + y^2/(z - x): one negative mass in this finite signed model
      s = cAdd(s, cDiv([d.height * d.height, 0], cSub(z, [d.center, 0])));
    }
    return s;
  };
}


const IMP2454_BASELINE_DIAGNOSTICS = Object.freeze(IMP2454_NODE_SETS.map((nodes) => evaluatePickDiagnostic(nodes, imp2454BaselineM)));
const IMP2454_BASELINE_NEG_INDEX = Object.freeze(IMP2454_BASELINE_DIAGNOSTICS.map((d) => d.negIndex));
const IMP2454_BASELINE_IS_N0 = IMP2454_BASELINE_DIAGNOSTICS.every((d) => d.status === 'diagnostic' && d.negIndex === 0);
const IMP2454_KAPPA_VALUES = Object.freeze([1, 2, 3]);
const IMP2454_JUMP_TABLE = Object.freeze(IMP2454_KAPPA_VALUES.map((kappa) => {
  const diagnostics = IMP2454_NODE_SETS.map((nodes) => evaluatePickDiagnostic(nodes, imp2454PerturbedM(kappa)));
  const perNodeSet = diagnostics.map((d) => d.negIndex);
  return Object.freeze({ injectedZeros: kappa, negativeMasses: kappa, predictedKappa: kappa,
    diagnostics: Object.freeze(diagnostics), negIndexPerNodeSet: Object.freeze(perNodeSet),
    jumpsToKappa: diagnostics.every((d) => d.status === 'diagnostic' && d.negIndex === kappa),
    scope: 'finite thresholded signed-mass estimate; injectedZeros is a legacy model-count field, not a zeta-zero count',
  });
}));
const IMP2454_ALL_JUMP_AND_SATURATE = IMP2454_JUMP_TABLE.every((r) => r.jumpsToKappa);

const IMP2454_NAIVE_NODE_SETS = Object.freeze([
  imp2454Nodes([-5, -2, 2, 5], [0.25, 0.6]),
  imp2454Nodes([-6, -3, 3, 6], [0.3, 0.7, 1.2]),
  imp2454Nodes([-8, -4, 4, 8], [0.2, 0.5, 1.0, 2.0]),
  imp2454Nodes([-12, -6, -2, 2, 6, 12], [0.2, 0.5, 1.0, 2.0]),
]);
const IMP2454_NAIVE_DELTA = 2.0;
function imp2454NaivePoleM(z) {
  let s = imp2454BaselineM(z);
  s = cAdd(s, cDiv([1, 0], cSub([8, IMP2454_NAIVE_DELTA], z))); // pole inside C+
  return s;
}

const IMP2454_NAIVE_DIAGNOSTICS = Object.freeze(IMP2454_NAIVE_NODE_SETS.map((nodes) =>
  evaluatePickDiagnostic(nodes, imp2454NaivePoleM, { poles: [[8, IMP2454_NAIVE_DELTA]] })
));
const IMP2454_NAIVE_NEG_INDEX = Object.freeze(IMP2454_NAIVE_DIAGNOSTICS.map((d) => d.negIndex));

export const TWIN_LADDER_OFFLINE_ZERO_PICK_INDEX_JUMP = Object.freeze({
  id: 'imp-2454-offline-zero-pick-index-jump',
  ticket: 'imp-2454',
  parent: 'imp-2442',
  parentAttack: 'attack-III-weil-pontryagin',
  builtAt: '2026-06-04T16:30:00Z',
  correctedAt: '2026-11-01',
  status: 'finite-synthetic-model-diagnostics-not-certified',
  framework: 'Generalized Nevanlinna negative squares on the regular meromorphic domain',
  question: 'Which finite synthetic Pick models attain their known negative-square index on these selected nodes?',
  method: 'Finite-domain validation, Hermitian real embedding, scaled Jacobi rotations with convergence and eigenpair residual checks. Thresholded floating estimates, not outward error bounds.',
  historicalInvalidated: Object.freeze({
    recordedNaiveIndices: Object.freeze([7, 10, 0, 20]),
    status: 'invalidated-pre-correction-not-current-evidence',
    reason: 'The third node set contains the pole 8+2i. NaN comparisons returned zero; the old Jacobi sign(0) rotation also failed on equal diagonals.',
    withdrawnClaims: Object.freeze([
      'Every pole in C+ excludes finite generalized-Nevanlinna index.',
      'Every finite node set must attain the global negative index.',
      'Synthetic negative masses inject actual off-line Riemann zeros.',
    ]),
  }),
  parentSubGap: 'GAP-2442-GENUINE-M-IS-N0',
  baselineModel: 'Twelve fixed positive real point masses; PSD by a feature-Gram identity, regardless of zeta.',
  baseline: Object.freeze({ negIndexPerNodeSet: IMP2454_BASELINE_NEG_INDEX,
    diagnostics: IMP2454_BASELINE_DIAGNOSTICS, isOrdinaryN0: IMP2454_BASELINE_IS_N0 }),
  offlineInjection: Object.freeze({
    injected: IMP2454_INJECTED, offlineZeros: IMP2454_OFFLINE_ZEROS,
    coordinateStatus: 'manufactured-model-coordinates-not-verified-zeros',
    table: IMP2454_JUMP_TABLE, allJumpAndSaturate: IMP2454_ALL_JUMP_AND_SATURATE,
    note: 'Negative point masses have a proved global finite index. The metadata x +/- i*y are not established zeros of this perturbed m, an HB function or completed zeta. Not all smaller node sets must attain the global index.',
  }),
  naivePoleContrast: Object.freeze({
    model: 'positive real point masses PLUS the unpaired term 1/(8+2i-z)',
    delta: IMP2454_NAIVE_DELTA, diagnostics: IMP2454_NAIVE_DIAGNOSTICS,
    negIndexPerNodeSet: IMP2454_NAIVE_NEG_INDEX,
    doesNotSaturate: null, status: 'incomplete-invalid-domain',
    note: 'Third set is invalid at its own pole. No finite-to-infinite inference is made from this array; see the separate negative-boundary argument for this particular unpaired model.',
  }),
  indexBookkeeping: Object.freeze([
    Object.freeze({ regime: 'finite positive-mass model', mClass: 'N_0', pickNegIndex: 0, space: 'Hilbert model', indMinusKa: 'not identified' }),
    Object.freeze({ regime: 'finite signed / monomial model', mClass: 'N_kappa', pickNegIndex: 'global supremum kappa', space: 'Pontryagin model', indMinusKa: 'not identified' }),
  ]),
  verdict: 'synthetic-finite-index-model-only-arithmetic-transfer-open',
  verdictPlain: 'Finite model identities and thresholded diagnostics do not identify the actual Riemann kernel or its zero count. A meromorphic function can have finite negative index even with a C+ pole; pole nodes must be excluded.',
  honestScope: 'No arithmetic kernel construction, actual off-line-zero injection, certified floating inertia or RH proof. The particular unpaired pole has unbounded negative index by a separate boundary argument, not by the invalid four-set run. Lambda unchanged.',
  subGap: Object.freeze({
    id: 'GAP-2454-GENUINE-M-IS-N0',
    aliasOf: 'GAP-2442-GENUINE-M-IS-N0',
    statement: 'An exact arithmetic m-function/kernel identification, domain and zero-count theorem, and independent positivity proof remain missing. The finite synthetic models do not supply these.',
  }),
  proofClaim: false,
  references: Object.freeze({
    kreinLanger:
      'M. G. Krein, H. Langer, Acta Sci. Math. (Szeged) 34 (1973); generalized ' +
      'Nevanlinna functions N_kappa and Pontryagin-space realization, kappa = ' +
      'negative squares of the Pick kernel.',
    deBranges:
      'L. de Branges, Hilbert Spaces of Entire Functions, Prentice-Hall (1968); ' +
      'inverse spectral theorem for canonical systems / trace-normed Hamiltonians.',
    imp2442: 'imp-2442 -- synthetic monomial model; arithmetic identification remains unproved.',
    imp2438: 'imp-2438 -- explicit tridiagonal Jacobi / 2x2 de Branges chain (N_0 baseline perturbed here).',
    imp2430: 'imp-2430 -- on-line canonical-system realizability; the naive pole-in-C+ surrogate.',
    plattTrudgian2021:
      'Platt, D., Trudgian, T., The Riemann hypothesis is true up to 3 * 10^12, ' +
      'Bull. London Math. Soc. 53 (2021), 792-797.',
  }),
});

export const IMP2454_OFFLINE_ZERO_PICK_INDEX_JUMP_ASSERTIONS = [
  { id: 'imp2454-baseline-model-positive', why: 'Positive real masses give a PSD finite model; numerical diagnostics must remain finite.',
    holds: () => IMP2454_BASELINE_IS_N0 },
  { id: 'imp2454-negative-mass-diagnostics-finite', why: 'Each finite diagnostic must be valid; smaller node sets need not attain the global index.',
    holds: () => IMP2454_JUMP_TABLE.every((r) => r.diagnostics.every((d) => d.status === 'diagnostic' && Number.isInteger(d.negIndex) && d.negIndex >= 0 && d.negIndex <= r.predictedKappa)) },
  { id: 'imp2454-own-pole-invalid-not-zero', why: 'Pole-domain violation is not a zero-index certificate.',
    holds: () => IMP2454_NAIVE_DIAGNOSTICS[2].status === 'invalid' && IMP2454_NAIVE_NEG_INDEX[2] === null },
  { id: 'imp2454-coordinates-not-actual-zeros', why: 'Manufactured coordinates are retained as such, without an actual zero equation.',
    holds: () => TWIN_LADDER_OFFLINE_ZERO_PICK_INDEX_JUMP.offlineInjection.coordinateStatus === 'manufactured-model-coordinates-not-verified-zeros' },
  { id: 'imp2454-historical-results-invalidated', why: 'Preserve the old sequence as invalidated history, never as corrected output.',
    holds: () => TWIN_LADDER_OFFLINE_ZERO_PICK_INDEX_JUMP.historicalInvalidated.status === 'invalidated-pre-correction-not-current-evidence' &&
      JSON.stringify(TWIN_LADDER_OFFLINE_ZERO_PICK_INDEX_JUMP.historicalInvalidated.recordedNaiveIndices) === '[7,10,0,20]' },
  { id: 'imp2454-no-proof-claim', why: 'Synthetic finite-model results do not establish RH.',
    holds: () => TWIN_LADDER_OFFLINE_ZERO_PICK_INDEX_JUMP.proofClaim === false && TWIN_LADDER_OFFLINE_ZERO_PICK_INDEX_JUMP.subGap.id === 'GAP-2454-GENUINE-M-IS-N0' },
];
