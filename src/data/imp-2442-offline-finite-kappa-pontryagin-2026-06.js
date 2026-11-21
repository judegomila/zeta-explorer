/**
 * imp-2442: finite synthetic Pick-model diagnostics.
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
const cMul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cPow = (z, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = cMul(r, z); return r; };

function imp2442Nodes(xs, ys) {
  const nd = [];
  for (const x of xs) for (const y of ys) nd.push([x, y]);
  return nd;
}

// Four distinct-node C+ sets, not nested refinements. The monomial model
// attains its global index here because its evaluation matrix has full rank.
const IMP2442_NODE_SETS = Object.freeze([
  imp2442Nodes([-2, -1, 1, 2], [0.5, 1.0]),
  imp2442Nodes([-3, -1.5, 1.5, 3], [0.4, 0.8, 1.5]),
  imp2442Nodes([-4, -2, -1, 1, 2, 4], [0.3, 0.7, 1.2, 2.0]),
  imp2442Nodes([-5, -3, -1, 1, 3, 5], [0.25, 0.6, 1.0, 1.8, 3.0]),
]);

const IMP2442_KAPPA_VALUES = Object.freeze([0, 1, 2, 3]);
const IMP2442_GENUINE_TABLE = Object.freeze(IMP2442_KAPPA_VALUES.map((kappa) => {
  const exponent = 2 * kappa + 1;
  const diagnostics = IMP2442_NODE_SETS.map((nodes) => evaluatePickDiagnostic(nodes, (z) => cPow(z, exponent)));
  const perNodeSet = diagnostics.map((d) => d.negIndex);
  return Object.freeze({ label: 'z^' + exponent, predictedKappa: kappa, exponent,
    diagnostics: Object.freeze(diagnostics), negIndexPerNodeSet: Object.freeze(perNodeSet),
    saturatesAtKappa: diagnostics.every((d) => d.status === 'diagnostic' && d.negIndex === kappa),
    scope: 'finite thresholded estimate; exact monomial theorem is separate',
  });
}));
const IMP2442_ALL_SATURATE = IMP2442_GENUINE_TABLE.every((r) => r.saturatesAtKappa);

const IMP2442_GAMMA = Object.freeze([
  14.134725142, 21.022039639, 25.010857580,
  30.424876126, 32.935061588, 37.586178159,
]);
const IMP2442_OFF_DELTA = 2.0;
function imp2442PoleInCplusM(z) {
  let s = [0, 0];
  for (const g of IMP2442_GAMMA) {
    s = cAdd(s, cDiv([1, 0], cSub([g, 0], z)));
    s = cAdd(s, cDiv([1, 0], cSub([-g, 0], z)));
  }
  // One additional UNPAIRED pole; this is not a zeta-zero injection.
  s = cAdd(s, cDiv([1, 0], cSub([8, IMP2442_OFF_DELTA], z)));
  return s;
}
const IMP2442_NAIVE_OFFLINE_NODE_SETS = Object.freeze([
  imp2442Nodes([-5, -2, 2, 5], [0.25, 0.6]),
  imp2442Nodes([-6, -3, 3, 6], [0.3, 0.7, 1.2]),
  imp2442Nodes([-8, -4, 4, 8], [0.2, 0.5, 1.0, 2.0]),
  imp2442Nodes([-12, -6, -2, 2, 6, 12], [0.2, 0.5, 1.0, 2.0]),
]);

const IMP2442_NAIVE_DIAGNOSTICS = Object.freeze(IMP2442_NAIVE_OFFLINE_NODE_SETS.map((nodes) =>
  evaluatePickDiagnostic(nodes, imp2442PoleInCplusM, { poles: [[8, IMP2442_OFF_DELTA]] })
));
const IMP2442_NAIVE_OFFLINE_NEG_INDEX = Object.freeze(IMP2442_NAIVE_DIAGNOSTICS.map((d) => d.negIndex));

export const TWIN_LADDER_OFFLINE_FINITE_KAPPA_PONTRYAGIN = Object.freeze({
  id: 'imp-2442-offline-finite-kappa-pontryagin',
  ticket: 'imp-2442',
  parent: 'imp-2430',
  parentAttack: 'attack-III-weil-pontryagin',
  builtAt: '2026-06-04T15:20:51Z',
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
  genuineNkappa: Object.freeze({
    family: 'm(z)=z^(2k+1), global negative index k',
    table: IMP2442_GENUINE_TABLE,
    allSaturateAtKappa: IMP2442_ALL_SATURATE,
    note: 'The coefficient reversal matrix has k negative eigenvalues. Full-rank Vandermonde evaluation attains k on these sets; not every arbitrary finite node set must do so.',
  }),
  naiveOfflineContrast: Object.freeze({
    model: 'positive real point masses PLUS the unpaired term 1/(8+2i-z)',
    delta: IMP2442_OFF_DELTA,
    diagnostics: IMP2442_NAIVE_DIAGNOSTICS,
    negIndexPerNodeSet: IMP2442_NAIVE_OFFLINE_NEG_INDEX,
    doesNotSaturate: null,
    status: 'incomplete-invalid-domain',
    note: 'The third set hits 8+2i and has no Pick matrix. Four finite samples cannot prove an infinite negative index. For this specific unpaired model, the negative real-boundary imaginary part supplies a separate all-dimension argument.',
  }),
  indexBookkeeping: Object.freeze([
    Object.freeze({ regime: 'finite positive-mass model', mClass: 'N_0', pickNegIndex: 0, space: 'Hilbert model', indMinusKa: 'not identified' }),
    Object.freeze({ regime: 'finite signed / monomial model', mClass: 'N_kappa', pickNegIndex: 'global supremum kappa', space: 'Pontryagin model', indMinusKa: 'not identified' }),
  ]),
  verdict: 'synthetic-finite-index-model-only-arithmetic-transfer-open',
  verdictPlain: 'Finite model identities and thresholded diagnostics do not identify the actual Riemann kernel or its zero count. A meromorphic function can have finite negative index even with a C+ pole; pole nodes must be excluded.',
  honestScope: 'No arithmetic kernel construction, actual off-line-zero injection, certified floating inertia or RH proof. The particular unpaired pole has unbounded negative index by a separate boundary argument, not by the invalid four-set run. Lambda unchanged.',
  subGap: Object.freeze({
    id: 'GAP-2442-GENUINE-M-IS-N0',
    statement: 'An exact arithmetic m-function/kernel identification, domain and zero-count theorem, and independent positivity proof remain missing. The finite synthetic models do not supply these.',
  }),
  proofClaim: false,
  references: Object.freeze({
    kreinLanger:
      'M. G. Krein, H. Langer, Ueber einige Fortsetzungsprobleme ... Q-Funktion ' +
      'eines pi-hermiteschen Operators im Raume Pi_kappa, Acta Sci. Math. ' +
      '(Szeged) 34 (1973); generalized Nevanlinna functions N_kappa and ' +
      'Pontryagin-space realization, kappa = negative squares of the Pick kernel.',
    deBranges:
      'L. de Branges, Hilbert Spaces of Entire Functions, Prentice-Hall (1968); ' +
      'inverse spectral theorem for canonical systems / trace-normed Hamiltonians.',
    derkachHassiSnoo:
      'V. Derkach, S. Hassi, H. de Snoo, Generalized Nevanlinna functions ... ' +
      'realizations in Pontryagin spaces; N_kappa classes and the z^(2k+1) ' +
      'representatives in N_k.',
    imp2430: 'imp-2430 -- on-line canonical-system realizability; historical off-line sub-gap; old pole-run numerical claims are invalidated.',
    imp2364: 'imp-2364 -- rectangular winding-number route to ind_-(K_a).',
    imp2425: 'imp-2425 -- Krein spectral-shift route to ind_-(K_a).',
    plattTrudgian2021:
      'Platt, D., Trudgian, T., The Riemann hypothesis is true up to 3 * 10^12, ' +
      'Bull. London Math. Soc. 53 (2021), 792-797.',
  }),
});

export const IMP2442_OFFLINE_FINITE_KAPPA_PONTRYAGIN_ASSERTIONS = [
  { id: 'imp2442-monomial-diagnostics-finite', why: 'Finite estimates must be valid and match the exact full-rank model on these selected nodes.',
    holds: () => IMP2442_ALL_SATURATE },
  { id: 'imp2442-kappa0-model-positive', why: 'm(z)=z gives a rank-one positive Pick kernel, independent of zeta.',
    holds: () => IMP2442_GENUINE_TABLE[0].diagnostics.every((d) => d.status === 'diagnostic' && d.negIndex === 0) },
  { id: 'imp2442-own-pole-invalid-not-zero', why: 'Sampling the pole is invalid, never an index-zero certificate.',
    holds: () => IMP2442_NAIVE_DIAGNOSTICS[2].status === 'invalid' && IMP2442_NAIVE_OFFLINE_NEG_INDEX[2] === null },
  { id: 'imp2442-historical-results-invalidated', why: 'Preserve the old sequence as invalidated history, never as corrected output.',
    holds: () => TWIN_LADDER_OFFLINE_FINITE_KAPPA_PONTRYAGIN.historicalInvalidated.status === 'invalidated-pre-correction-not-current-evidence' &&
      JSON.stringify(TWIN_LADDER_OFFLINE_FINITE_KAPPA_PONTRYAGIN.historicalInvalidated.recordedNaiveIndices) === '[7,10,0,20]' },
  { id: 'imp2442-no-proof-claim', why: 'Synthetic finite-model results do not establish RH.',
    holds: () => TWIN_LADDER_OFFLINE_FINITE_KAPPA_PONTRYAGIN.proofClaim === false && TWIN_LADDER_OFFLINE_FINITE_KAPPA_PONTRYAGIN.subGap.id === 'GAP-2442-GENUINE-M-IS-N0' },
];
