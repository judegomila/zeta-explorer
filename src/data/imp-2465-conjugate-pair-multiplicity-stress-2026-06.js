/**
 * @module data/imp-2465-conjugate-pair-multiplicity-stress-2026-06
 * @fileoverview imp-2465 (Wave-4 follow-on to imp-2364 / imp-2425) -- a
 * conjugate-pair MULTIPLICITY stress test of the Attack III winding / SSF
 * detector for the Pontryagin negative index ind_-(K_a) of Theorem 18.3 +
 * Conjecture 18.4. imp-2364 validated the rectangular winding number on a SINGLE
 * injected off-line zero; imp-2425 added a single conjugate pair (read index 2).
 * Neither stressed the realistic case of MANY simultaneous off-line zeros at
 * DIFFERENT real parts, nor located where the argument-principle read becomes
 * unsafe. This module pushes several conjugate pairs off line at varying Re
 * lambda, verifies the integer winding index equals the EXACT pole count #P_a at
 * every safe a, and isolates the near-contour degeneracy (a coincides with or is
 * within sampling resolution of a zero real part) where the rounded read is
 * untrustworthy. NUMERICAL EVIDENCE ONLY -- no proof claim. Self-contained (no
 * heavy zeros-bundle import); same 20 low Odlyzko ordinates as imp-2364/2425.
 * @see imp-2364
 * @see imp-2425
 * @see data/imp-2425-krein-spectral-shift-2026-06.js
 */
// imp-2465 -- conjugate-pair multiplicity stress test of ind_-(K_a).
//
// CONTEXT
// -------
// Attack III reduces RH to Conjecture 18.4: ind_-(K_a) = #P_a = 0 for every
// a > 0 and every spectral window, where
//     P_a = { lambda - a : X(lambda) = 0, Re lambda > a }
// and ind_-(K_a) is the Pontryagin negative index of the shifted twin-ladder
// Weil form. imp-2364 read this integer as the winding number of X around a
// rectangle whose left edge is the vertical line Re lambda = a; for the RH-true
// model it is 0, and an OFF-LINE control with ONE injected zero jumps to 1. The
// honest weakness of that test: a single off-line zero. A usable witness must
// return the correct integer when SEVERAL zeros sit off line at DIFFERENT real
// parts -- the generic counterexample geometry RH would have to exclude -- and
// must flag the configurations where the read is numerically unsafe.
//
// METHOD
// ------
// The winding detector is the rectangular argument principle applied to the
// finite zero product X(lambda) = prod_n (lambda - z_n). Around the positively
// oriented rectangle with corners (a, -T), (R, -T), (R, T), (a, T) (R chosen to
// the right of every zero real part, T above every ordinate), the total
// unwrapped increment of arg X equals 2 pi times the number of zeros strictly
// inside -- i.e. those with Re lambda in (a, R) and |Im lambda| < T, which is
// exactly #P_a for the truncated model. Sampling M points per edge and unwrapping
// each wrapped phase step gives
//     windingRaw(a) = (1 / 2pi) * [unwrapped arg X around the rectangle],
//     windingIndex(a) = round(windingRaw(a)).
// The EXACT pole count #P_a is computed combinatorially (count zeros with
// re_n > a). The detector is correct at a iff windingIndex(a) == #P_a.
//
// Two safety diagnostics are reported per cell:
//   - contourMargin(a) = min_n |a - re_n|  (distance from the left edge to the
//     nearest zero real part). When this is 0 the contour passes through a zero
//     and the winding is mathematically ill-defined; when it is small the
//     discrete unwrap can skip or double-count.
//   - fracDefect(a) = |windingRaw(a) - round(windingRaw(a))|  (distance of the
//     raw winding from the nearest integer). For a clean cell this is ~0; it grows
//     when the discrete unwrap skips a step (the secondary, not the dominant,
//     failure mode here).
// A cell is SAFE iff contourMargin >= SAFE_MARGIN and fracDefect <= DEFECT_TOL.
// Empirically contourMargin is the operative diagnostic: when the left edge
// pierces a zero (margin 0) the winding stays a clean integer but counts the
// on-edge zero as ENCLOSED, so windingIndex disagrees with the strict-inequality
// #P_a -- the margin flag, not fracDefect, is what catches it.
//
// CONFIGURATIONS
// --------------
//  (A) MULTI-DELTA staircase: three conjugate pairs pushed off line at
//      Re = 0.15, 0.30, 0.50 (six right-half-plane zeros total). #P_a is the
//      staircase 6 -> 4 -> 2 -> 0 as a crosses each delta. The winding index is
//      checked to equal #P_a at every a away from the three deltas.
//  (B) CLUSTERED pair: two conjugate pairs at nearly equal Re = 0.300 and
//      0.305. Probing a between the cluster members (contourMargin ~ 0.0025)
//      exercises the near-contour regime; a on a cluster real part (margin 0)
//      is the ill-defined degeneracy. The detector is expected to be SAFE and
//      correct outside the thin unsafe band and to self-flag inside it.
//
// RESULT
// ------
//  - (A) windingIndex == #P_a on every safe staircase cell (0 disagreements);
//    the detector counts simultaneous off-line zeros at distinct real parts with
//    correct total multiplicity, extending imp-2425 (one pair) to three.
//  - (B) outside the thin band around the two cluster real parts the read is
//    safe and equals #P_a; in the thin gap between the cluster members the
//    contourMargin is ~0.0025 (< SAFE_MARGIN) so the cell is flagged UNSAFE, and
//    ON a cluster real part the margin is 0 and the winding counts the on-edge
//    zero as enclosed -- windingIndex = 4 while the strict #P_a = 2 -- so the
//    margin flag correctly marks it UNSAFE rather than letting the silent wrong
//    integer pass. This LOCATES the degeneracy Attack III must avoid quoting the
//    witness across.
//
// VERDICT: the winding / SSF detector returns the exact pole count #P_a under
// multiple simultaneous off-line zeros at varying Re lambda, and the only place
// it fails is the measure-zero set where the contour pierces a zero, which the
// fracDefect / contourMargin diagnostics flag automatically. Reinforces (does
// not prove) that ind_-(K_a) faithfully tracks #P_a. NOT a proof of RH.
//
// SUB-GAP (honest partial)
// ------------------------
// Like imp-2364/2425 this uses the FINITE zero-product surrogate for K_a (20
// ordinates, finite T, finite R): it verifies the argument-principle bookkeeping
// of the detector, not the operator-theoretic identity ind_-(K_a) = #P_a for the
// genuine twin-ladder form. The near-contour unsafe band is a property of the
// discrete winding read, not evidence about real zeros (RH forbids any off-line
// zero, so #P_a = 0 unconditionally on the line). What remains open -- the named
// follow-on -- is the SAME realizability gap as imp-2425: an absolute index of
// the actual resolvent via the canonical-system Hamiltonian (see imp-2430),
// rather than the polynomial surrogate. This module sharpens the WITNESS, not
// the operator.

// Same 20 low Odlyzko ordinates as imp-2364 / imp-2425 (RH verified to height
// ~3e12, Platt-Trudgian 2021).
const IMP2465_ZEROS_GAMMA = Object.freeze([
  14.134725142, 21.022039639, 25.010857580, 30.424876126, 32.935061588,
  37.586178159, 40.918719012, 43.327073281, 48.005150881, 49.773832478,
  52.970321478, 56.446247697, 59.347044003, 60.831778525, 65.112544048,
  67.079810529, 69.546401711, 72.067157674, 75.704690699, 77.144840069,
]);

const IMP2465_T = 80;                 // half-height of the rectangle (> max ordinate)
const IMP2465_R = 2.0;                // right edge (> every off-line real part)
const IMP2465_M = 4000;               // phase samples per rectangle edge
const IMP2465_SAFE_MARGIN = 0.02;     // min contour-to-zero distance for a safe read
const IMP2465_DEFECT_TOL = 0.05;      // max |raw - round(raw)| for a safe read

// arg X(x+iy) = sum_n atan2(y - im_n, x - re_n) for X = prod_n ((x+iy) - z_n).
function imp2465ArgX(x, y, zeros) {
  let s = 0;
  for (const z of zeros) s += Math.atan2(y - z.im, x - z.re);
  return s;
}

// Positively oriented rectangle (a,-T)->(R,-T)->(R,T)->(a,T)->(a,-T). Returns the
// raw winding (unwrapped arg increment / 2pi) of X around it.
function imp2465RectWinding(a, R, T, M, zeros) {
  const pts = [];
  for (let i = 0; i <= M; i++) pts.push([a + (R - a) * (i / M), -T]);          // bottom
  for (let i = 1; i <= M; i++) pts.push([R, -T + (2 * T) * (i / M)]);          // right
  for (let i = 1; i <= M; i++) pts.push([R - (R - a) * (i / M), T]);           // top
  for (let i = 1; i <= M; i++) pts.push([a, T - (2 * T) * (i / M)]);           // left
  let total = 0;
  let prev = imp2465ArgX(pts[0][0], pts[0][1], zeros);
  for (let i = 1; i < pts.length; i++) {
    const cur = imp2465ArgX(pts[i][0], pts[i][1], zeros);
    let d = cur - prev;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d <= -Math.PI) d += 2 * Math.PI;
    total += d;
    prev = cur;
  }
  return total / (2 * Math.PI);
}

// Exact pole count #P_a = number of zeros with re > a (and inside the rectangle,
// which all included zeros are by construction).
function imp2465PoleCount(a, zeros) {
  let n = 0;
  for (const z of zeros) if (z.re > a) n++;
  return n;
}

// Minimum distance from the left contour edge Re = a to any zero real part.
function imp2465ContourMargin(a, zeros) {
  let m = Infinity;
  for (const z of zeros) m = Math.min(m, Math.abs(a - z.re));
  return m;
}

// Build a zero set: all on-line ordinates with gamma <= T, with the listed
// (gammaIndex, re) entries moved off line as conjugate pairs (both +/- copies).
function imp2465Config(moved) {
  const movedIdx = new Map(moved.map((m) => [m.gammaIndex, m.re]));
  const z = [];
  for (let k = 0; k < IMP2465_ZEROS_GAMMA.length; k++) {
    const g = IMP2465_ZEROS_GAMMA[k];
    if (g > IMP2465_T) continue;
    const re = movedIdx.has(k) ? movedIdx.get(k) : 0;
    z.push({ re, im: g });
    z.push({ re, im: -g });
  }
  return z;
}

function imp2465Evaluate(a, zeros) {
  const raw = imp2465RectWinding(a, IMP2465_R, IMP2465_T, IMP2465_M, zeros);
  const index = Math.round(raw);
  const exact = imp2465PoleCount(a, zeros);
  const margin = imp2465ContourMargin(a, zeros);
  const fracDefect = Math.abs(raw - index);
  const safe = margin >= IMP2465_SAFE_MARGIN && fracDefect <= IMP2465_DEFECT_TOL;
  return Object.freeze({
    a,
    windingRaw: raw,
    windingIndex: index,
    exactPoleCount: exact,
    contourMargin: margin,
    fracDefect,
    safe,
    matches: index === exact,
  });
}

// (A) MULTI-DELTA staircase: three conjugate pairs off line at 0.15, 0.30, 0.50.
const IMP2465_MULTI_DELTAS = Object.freeze([0.15, 0.30, 0.50]);
const IMP2465_MULTI_ZEROS = imp2465Config([
  { gammaIndex: 0, re: 0.15 },
  { gammaIndex: 1, re: 0.30 },
  { gammaIndex: 2, re: 0.50 },
]);
const IMP2465_MULTI_A_GRID = Object.freeze([
  0.05, 0.10, 0.20, 0.25, 0.40, 0.45, 0.60, 0.80, 1.0,
]);
const IMP2465_MULTI_TABLE = Object.freeze(
  IMP2465_MULTI_A_GRID.map((a) => imp2465Evaluate(a, IMP2465_MULTI_ZEROS))
);
const IMP2465_MULTI_ALL_SAFE = IMP2465_MULTI_TABLE.every((r) => r.safe);
const IMP2465_MULTI_ALL_MATCH = IMP2465_MULTI_TABLE.every((r) => r.matches);
const IMP2465_MULTI_DISAGREEMENTS = IMP2465_MULTI_TABLE.filter(
  (r) => r.safe && !r.matches
).length;
const IMP2465_MULTI_MAX_INDEX = IMP2465_MULTI_TABLE.reduce(
  (m, r) => Math.max(m, r.windingIndex), 0
);

// (B) CLUSTERED pair: two conjugate pairs at nearly equal Re = 0.300, 0.305.
const IMP2465_CLUSTER_RES = Object.freeze([0.300, 0.305]);
const IMP2465_CLUSTER_ZEROS = imp2465Config([
  { gammaIndex: 0, re: 0.300 },
  { gammaIndex: 1, re: 0.305 },
]);
// a values: two clearly safe (below / above the cluster), one in the thin gap
// (margin ~ 0.0025, unsafe), one exactly on a cluster real part (margin 0,
// ill-defined). Demonstrates the detector self-flags rather than lying.
const IMP2465_CLUSTER_A_GRID = Object.freeze([0.20, 0.3025, 0.300, 0.40]);
const IMP2465_CLUSTER_TABLE = Object.freeze(
  IMP2465_CLUSTER_A_GRID.map((a) => imp2465Evaluate(a, IMP2465_CLUSTER_ZEROS))
);
const IMP2465_CLUSTER_SAFE_ALL_MATCH = IMP2465_CLUSTER_TABLE.filter(
  (r) => r.safe
).every((r) => r.matches);
// The near-contour / on-contour cells must be flagged UNSAFE (margin < SAFE_MARGIN).
const IMP2465_CLUSTER_UNSAFE_FLAGGED = IMP2465_CLUSTER_TABLE.filter(
  (r) => r.contourMargin < IMP2465_SAFE_MARGIN
).every((r) => !r.safe);
const IMP2465_CLUSTER_ON_CONTOUR = IMP2465_CLUSTER_TABLE.find(
  (r) => r.contourMargin === 0
);

// REFINEMENT stability of a representative SAFE staircase cell (a = 0.25, which
// should read #P_a = 4): the integer index is invariant under sample refinement.
const IMP2465_REFINE_TABLE = Object.freeze(
  [1000, 4000, 16000].map((M) => {
    const raw = imp2465RectWinding(0.25, IMP2465_R, IMP2465_T, M, IMP2465_MULTI_ZEROS);
    return Object.freeze({ M, windingRaw: raw, windingIndex: Math.round(raw) });
  })
);
const IMP2465_REFINE_STABLE = IMP2465_REFINE_TABLE.every((r) => r.windingIndex === 4);

export const ATTACK_III_CONJUGATE_PAIR_MULTIPLICITY_STRESS = Object.freeze({
  id: 'imp-2465-conjugate-pair-multiplicity-stress',
  ticket: 'imp-2465',
  parent: 'imp-2364',
  sibling: 'imp-2425',
  parentAttack: 'attack-III-weil-pontryagin',
  conjecture: 'Theorem 18.3 + Conjecture 18.4',
  builtAt: '2026-06-04T00:00:00Z',
  method:
    'Rectangular argument-principle winding number of the finite zero product ' +
    'X(lambda) = prod_n (lambda - z_n) around the positively oriented rectangle ' +
    'with left edge Re lambda = a; the unwrapped increment / 2pi counts the ' +
    'zeros with Re > a, i.e. #P_a. Stressed with MULTIPLE simultaneous off-line ' +
    'conjugate pairs at distinct real parts and compared cell-by-cell against ' +
    'the exact combinatorial pole count, with contourMargin and fracDefect ' +
    'safety diagnostics flagging the near-contour degeneracy.',
  description:
    'A conjugate-pair multiplicity stress test of the Attack III winding / SSF ' +
    'negative-index detector. imp-2364 validated the winding number on ONE ' +
    'off-line zero and imp-2425 on ONE conjugate pair; this module pushes THREE ' +
    'pairs off line at Re = 0.15, 0.30, 0.50 and verifies the integer index ' +
    'tracks the exact #P_a staircase (6 -> 4 -> 2 -> 0) at every safe a, then ' +
    'CLUSTERS two pairs at Re = 0.300, 0.305 to locate the near-contour band ' +
    'where the discrete read is unsafe and confirm the detector self-flags it ' +
    '(contourMargin -> 0; on a cluster real part the winding counts the on-edge ' +
    'zero so windingIndex = 4 while strict #P_a = 2) instead of letting a silent ' +
    'wrong integer pass. Numerical support for Conjecture 18.4 -- NOT a proof of RH.',
  zerosGamma: IMP2465_ZEROS_GAMMA,
  rectangle: Object.freeze({ leftEdgeIsA: true, rightR: IMP2465_R, halfHeightT: IMP2465_T }),
  phaseSamplesPerEdge: IMP2465_M,
  safeMargin: IMP2465_SAFE_MARGIN,
  defectTol: IMP2465_DEFECT_TOL,
  multiDelta: Object.freeze({
    deltas: IMP2465_MULTI_DELTAS,
    aGrid: IMP2465_MULTI_A_GRID,
    table: IMP2465_MULTI_TABLE,
    allCellsSafe: IMP2465_MULTI_ALL_SAFE,
    allCellsMatchExactPoleCount: IMP2465_MULTI_ALL_MATCH,
    safeCellDisagreements: IMP2465_MULTI_DISAGREEMENTS,
    maxWindingIndex: IMP2465_MULTI_MAX_INDEX,
  }),
  cluster: Object.freeze({
    realParts: IMP2465_CLUSTER_RES,
    aGrid: IMP2465_CLUSTER_A_GRID,
    table: IMP2465_CLUSTER_TABLE,
    safeCellsAllMatch: IMP2465_CLUSTER_SAFE_ALL_MATCH,
    unsafeCellsAllFlagged: IMP2465_CLUSTER_UNSAFE_FLAGGED,
    onContourFracDefect: IMP2465_CLUSTER_ON_CONTOUR
      ? IMP2465_CLUSTER_ON_CONTOUR.fracDefect
      : null,
  }),
  refinementStability: Object.freeze({
    table: IMP2465_REFINE_TABLE,
    integerIndexStable: IMP2465_REFINE_STABLE,
  }),
  verdict:
    'winding-index-equals-exact-pole-count-under-multiple-offline-zeros-' +
    'near-contour-degeneracy-self-flagged-no-proof',
  honestScope:
    'NUMERICAL Wave-4 stress test of Attack III. The rectangular winding index ' +
    'returns the EXACT pole count #P_a for three simultaneous off-line ' +
    'conjugate pairs at distinct real parts (multiplicity up to 6), extending ' +
    'imp-2425 (one pair, index 2). The ONLY failure is the measure-zero set ' +
    'where the contour Re lambda = a pierces a zero real part; there the ' +
    'contourMargin and fracDefect diagnostics flag the cell UNSAFE rather than ' +
    'reporting a wrong integer. Because the test uses the same finite zero- ' +
    'product surrogate for K_a (20 ordinates, finite T and R), it sharpens the ' +
    'WITNESS / bookkeeping, not the operator identity ind_-(K_a) = #P_a; it does ' +
    'NOT prove Conjecture 18.4 = RH. The named follow-on sub-gap is the same ' +
    'realizability question as imp-2425: an absolute index of the genuine ' +
    'twin-ladder resolvent via the canonical-system Hamiltonian (imp-2430), not ' +
    'the polynomial surrogate.',
  proofClaim: false,
  references: Object.freeze({
    imp2364: 'imp-2364 -- rectangular winding-number route to ind_-(K_a) (single off-line zero).',
    imp2425: 'imp-2425 -- Krein spectral-shift route, single conjugate pair (index 2).',
    argumentPrinciple:
      'Argument principle: the winding of a meromorphic function around a closed ' +
      'contour counts enclosed zeros minus poles with multiplicity.',
    plattTrudgian2021:
      'Platt, D., Trudgian, T., The Riemann hypothesis is true up to ' +
      '3 * 10^12, Bull. London Math. Soc. 53 (2021), 792-797.',
  }),
});
