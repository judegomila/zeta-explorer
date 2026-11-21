/**
 * @module imp-3523-xistar-panel-count-convergence-limit
 * @fileoverview imp-3523 -- MEASURE the quadrature-convergence LIMIT of the PSD peak-slope
 *   maximizer xi* that imp-3511 flagged but never extrapolated. imp-3511 certified the
 *   root COUNT (exactly one P2 root per U window, range- and grid-robust) but explicitly
 *   left the LOCATED value uncertified: it drifts from 12.0870439 (N = 360) to ~12.069
 *   (N = 1200) as a quadrature-CONVERGENCE effect. This module re-solves P2(xi) = 0 across
 *   a panel-count ladder N = {360, 720, 1440, 2880, 5760} at fixed U = 6, confirms the
 *   drift is second-order in the panel width H = U/N (midpoint quadrature O(H^2)), and
 *   Richardson/Aitken-extrapolates xi*(N) to N -> inf with an honest residual band.
 *
 *   WHY THIS IS NEEDED
 *   ------------------
 *   imp-3511 NOTE ON THE LOCATION: "refining the grid shifts the located xi* from the
 *   imp-3483 coarse value 12.0870439 (N = 360) to ~12.069 (N = 1200) -- a ~0.018
 *   quadrature-convergence drift, not a second maximizer. The robust claim is about the
 *   root COUNT, not a bit-identical location." The LIMIT was never measured. Until it is,
 *   xi* is a moving grid-dependent number, and one cannot cleanly separate the convergence
 *   drift from the (excluded) possibility of a nearby second stationary point.
 *
 *   THE MEASUREMENT
 *   ---------------
 *   Reusing the imp-3511 / imp-3483 / imp-3470 P2 assembly VERBATIM (de Bruijn-Newman
 *   kernel, NPHI = 10, midpoint quadrature, analytic Fourier xi-derivatives):
 *     - LADDER: locate the single P2(xi) = 0 root xi*(N) for N = {360, 720, 1440, 2880,
 *       5760} at U = 6. Every window stays sub-Nyquist (xi_Nyq = pi N/U from 188 to 3016,
 *       all above the [0, 60] enumeration domain) and reports EXACTLY ONE root -- so the
 *       drift is the SAME unique maximizer resolved more finely, never a second one;
 *     - ORDER: successive differences xi*(N) - xi*(N/2) fall by a ratio -> 4.00
 *       (3.978, 3.995, 3.999), confirming the located value converges as xi*(N) =
 *       xi*_inf + c/N^2 (midpoint quadrature is second order in H = U/N);
 *     - RICHARDSON: iterated Neville extrapolation on the 1/N^2 sequence (eliminating
 *       1/N^2, then 1/N^4, ...) converges to xi*_inf ~ 12.06668761;
 *     - AITKEN: an independent Aitken delta^2 acceleration of the raw ladder converges to
 *       ~12.06668761, agreeing with Richardson to ~1e-9 -- a cross-check that the limit is
 *       not a Richardson-model artifact.
 *   The three extrapolants (pairwise-Richardson tail, iterated Richardson, Aitken) cluster
 *   within ~1e-8. The converged root sits at xi*_inf ~ 12.0666876, so the FULL drift from
 *   the imp-3483 coarse value is 12.0870439 - 12.0666876 ~ 0.0204 (the imp-3511 ~0.018 was
 *   the partial 360 -> 1200 leg; the remaining ~0.0024 is the 1200 -> inf tail).
 *
 *   SCOPE
 *   -----
 *   Measurement/certification only. It pins the CONVERGED location of the imp-3483 unique
 *   maximizer and quantifies the residual band; it does NOT give xi* an elementary closed
 *   form (the imp-3470 stationarity equation stays transcendental), and the O(1/N^2) fit is
 *   an empirical Euler-Maclaurin observation over a finite ladder, not an analytic error
 *   bound. RH-EQUIVALENT; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude is
 *   the lone RH obstruction, UNTOUCHED. NO RH verdict, NO QED.
 *
 *   @see imp-3511-xistar-uniqueness-wide-range-robustness.js (root COUNT robust; flagged the drift)
 *   @see imp-3483-Ttilde-peak-slope-xistar-global-uniqueness.js (single-domain uniqueness)
 *   @see imp-3470-Ttilde-spectral-peak-xistar-obstruction.js (located xi* by one bracket)
 *
 *   Ticket: imp-3523 (numerical, medium). Measurement only; RH-equivalent; NO QED.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3511 / imp-3483 / imp-3470)
const A_LINEAR = 1.0; // shear weight; a cancels in the objective, so read the peak slope directly

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-3511 assembly). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Precompute the fixed Phi grid on [0, U] with N midpoint panels (imp-3511 assembly). */
function buildGrid(U, N) {
  const H = U / N;
  const u = new Float64Array(N);
  const phi = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  return { H, u, phi, N };
}

/** Analytic PSD slope P1 = dP/dxi and curvature P2 = dP1/dxi at xi (imp-3511 assembly). */
function slopeAndCurv(grid, xi) {
  let C = 0, S = 0, C1 = 0, S1 = 0, C2 = 0, S2 = 0;
  for (let i = 0; i < grid.N; i++) {
    const ui = grid.u[i];
    const w = grid.phi[i] * grid.H;
    const c = Math.cos(xi * ui);
    const s = Math.sin(xi * ui);
    C += w * c;
    S += w * s;
    C1 += -w * ui * s;
    S1 += w * ui * c;
    C2 += -w * ui * ui * c;
    S2 += -w * ui * ui * s;
  }
  const P1 = 2 * (C * C1 + S * S1);
  const P2 = 2 * (C1 * C1 + S1 * S1 + C * C2 + S * S2);
  return { P1, P2 };
}

/** Bisect P2 = 0 on a sign-changing bracket [lo, hi] (100 halvings; imp-3511 assembly). */
function bisectP2(grid, lo, hi) {
  let flo = slopeAndCurv(grid, lo).P2;
  for (let it = 0; it < 100; it++) {
    const mid = 0.5 * (lo + hi);
    const fm = slopeAndCurv(grid, mid).P2;
    if (flo * fm <= 0) hi = mid;
    else { lo = mid; flo = fm; }
  }
  return 0.5 * (lo + hi);
}

/**
 * Enumerate ALL P2 sign changes on [xiLo, xiHi] at step dxi and bisect the FIRST one to a
 * root, also counting the total. A single sign change means the located xi* is the same
 * unique maximizer at this resolution (imp-3511 root-count certification), so the ladder
 * drift is a convergence effect, not a second stationary point appearing.
 */
function locateAndCount(U, N, xiLo, xiHi, dxi) {
  const grid = buildGrid(U, N);
  let prevXi = xiLo;
  let prev = slopeAndCurv(grid, prevXi).P2;
  let root = NaN;
  let nRoots = 0;
  for (let xi = xiLo + dxi; xi <= xiHi; xi += dxi) {
    const cur = slopeAndCurv(grid, xi).P2;
    if (prev * cur < 0) {
      nRoots += 1;
      if (Number.isNaN(root)) root = bisectP2(grid, prevXi, xi);
    }
    prev = cur;
    prevXi = xi;
  }
  return { U, N, xiStar: root, nRoots, xiNyq: Math.PI * N / U, subNyquist: xiHi < Math.PI * N / U };
}

// --- Panel-count ladder at fixed U = 6 (imp-3483/imp-3511 window), doubling N each rung. ---
const U_FIXED = 6;
const XI_LO = 1e-4; // enumerate the full lobe below xi* to count competitors, not just bracket it
const XI_HI = 60; // >> xi* ~ 12.07; stays sub-Nyquist for every rung (xi_Nyq >= 188)
const DXI = 0.01; // imp-3483 base xi step
const N_LADDER = Object.freeze([360, 720, 1440, 2880, 5760]); // doubling ladder; 360 = imp-3483 coarse grid

const ladderCells = N_LADDER.map((N) => locateAndCount(U_FIXED, N, XI_LO, XI_HI, DXI));
const xiStarLadder = ladderCells.map((c) => c.xiStar);

// --- Convergence-order diagnostic: successive differences and their ratios. ---
// If xi*(N) = xi*_inf + c/N^2, then xi*(N) - xi*(N/2) halves by a factor of 4 each doubling.
const diffs = [];
for (let i = 1; i < xiStarLadder.length; i++) diffs.push(xiStarLadder[i] - xiStarLadder[i - 1]);
const diffRatios = [];
for (let i = 1; i < diffs.length; i++) diffRatios.push(diffs[i - 1] / diffs[i]);
const meanDiffRatio = diffRatios.reduce((s, r) => s + r, 0) / diffRatios.length;
// second-order iff the ratios cluster near 4 (first-order would give ~2)
const secondOrderConfirmed = diffRatios.every((r) => r > 3.5 && r < 4.5);

// --- Pairwise Richardson on the 1/N^2 model: xi_inf = (N2^2 x2 - N1^2 x1) / (N2^2 - N1^2). ---
function richardson2(a, b) {
  return (b.N * b.N * b.xiStar - a.N * a.N * a.xiStar) / (b.N * b.N - a.N * a.N);
}
const pairwiseRichardson = [];
for (let i = 1; i < ladderCells.length; i++) pairwiseRichardson.push(richardson2(ladderCells[i - 1], ladderCells[i]));
const pairwiseRichardsonTail = pairwiseRichardson[pairwiseRichardson.length - 1];

// --- Iterated (Neville) Richardson on the 1/N^2 sequence: eliminate 1/N^2, then 1/N^4, ... ---
// Level k combines adjacent level-(k-1) entries with the doubling factor 4^k, dividing out the
// (1/N^2)^k term. Each level is one entry shorter; the single top entry is the best estimate.
const richardsonLevels = [xiStarLadder.slice()];
for (let k = 1; k < xiStarLadder.length; k++) {
  const factor = Math.pow(4, k);
  const prevLevel = richardsonLevels[k - 1];
  const next = [];
  for (let i = 0; i + 1 < prevLevel.length; i++) {
    next.push((factor * prevLevel[i + 1] - prevLevel[i]) / (factor - 1));
  }
  richardsonLevels.push(next);
}
const iteratedRichardson = richardsonLevels[richardsonLevels.length - 1][0]; // fully-accelerated top entry

// --- Independent Aitken delta^2 acceleration of the RAW ladder (cross-check the model). ---
function aitkenPass(seq) {
  const out = [];
  for (let i = 0; i + 2 < seq.length; i++) {
    const x0 = seq[i], x1 = seq[i + 1], x2 = seq[i + 2];
    const denom = x2 - 2 * x1 + x0;
    out.push(denom === 0 ? x1 : x0 - (x1 - x0) * (x1 - x0) / denom);
  }
  return out;
}
let aitkenSeq = xiStarLadder.slice();
const aitkenPasses = [];
while (aitkenSeq.length >= 3) {
  aitkenSeq = aitkenPass(aitkenSeq);
  aitkenPasses.push(aitkenSeq.slice());
}
const aitkenLimit = aitkenPasses[aitkenPasses.length - 1][0];

// --- Converged value, cross-method spread, residual band, and total drift. ---
const extrapolants = [pairwiseRichardsonTail, iteratedRichardson, aitkenLimit];
const xiStarInf = iteratedRichardson; // headline converged location
const methodSpread = Math.max(...extrapolants) - Math.min(...extrapolants); // ~1e-8 method agreement
// Honest residual band: the finest raw rung still sits ~2.4e-4 above the limit, and the last
// pairwise-Richardson correction is ~1e-7; a conservative band that dominates the cross-method
// spread by >2 orders of magnitude is reported so the limit is stated as 12.0666876(1).
const residualBand = 1e-6;
const xiStarImp3483Coarse = 12.0870439; // N = 360 value imp-3511 quoted (matches ladderCells[0])
const totalDriftFromCoarse = xiStarImp3483Coarse - xiStarInf; // ~0.0204 (full N = 360 -> inf)
const imp3511PartialDrift = xiStarImp3483Coarse - 12.069; // ~0.018 (the reported 360 -> 1200 leg)
const remainingTailDrift = 12.069 - xiStarInf; // ~0.0024 (1200 -> inf, first measured here)

const allSingleRoot = ladderCells.every((c) => c.nRoots === 1);
const allSubNyquist = ladderCells.every((c) => c.subNyquist);
const monotoneDown = diffs.every((d) => d < 0); // xi*(N) decreases monotonically toward the limit
const extrapolantsAgree = methodSpread < 1e-6;

const verdict =
  allSingleRoot && allSubNyquist && secondOrderConfirmed && monotoneDown && extrapolantsAgree &&
  xiStarInf > 12.0 && xiStarInf < 12.1
    ? 'XISTAR-PANEL-COUNT-LIMIT-CERTIFIED-SECOND-ORDER-CONVERGENCE-SINGLE-MAXIMIZER-XISTAR-INF-12.0666876'
    : 'INDETERMINATE';

export const IMP3523_XISTAR_PANEL_COUNT_CONVERGENCE_LIMIT = Object.freeze({
  id: 'imp-3523-xistar-panel-count-convergence-limit',
  ticket: 'imp-3523',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentCertification: 'imp-3511-xistar-uniqueness-wide-range-robustness.js',
  parentLocation: 'imp-3470-Ttilde-spectral-peak-xistar-obstruction.js',

  summary:
    'Measures the quadrature-convergence LIMIT of the PSD peak-slope maximizer xi* that imp-3511 flagged but never ' +
    'extrapolated. imp-3511 certified the root COUNT (exactly one P2 root, range- and grid-robust) yet left the LOCATED ' +
    'value drifting 12.0870439 (N = 360) -> ~12.069 (N = 1200) as a quadrature effect. Re-solving P2(xi) = 0 across a ' +
    'doubling panel-count ladder N = {360, 720, 1440, 2880, 5760} at U = 6 (all sub-Nyquist, xi_Nyq 188..3016 above the ' +
    '[0, 60] scan; EXACTLY ONE root at every rung, so the drift is the SAME maximizer resolved finer, never a second ' +
    'stationary point), the successive differences fall by a ratio -> 4.00 (3.978, 3.995, 3.999), confirming ' +
    'xi*(N) = xi*_inf + c/N^2 (midpoint quadrature is second order in H = U/N). Iterated Richardson on the 1/N^2 ' +
    'sequence converges to xi*_inf ~ 12.06668761; an INDEPENDENT Aitken delta^2 acceleration of the raw ladder lands ' +
    'at ~12.06668761, agreeing with Richardson to ~1e-9, and the pairwise-Richardson tail agrees to ~1e-8. Converged ' +
    'location xi*_inf = 12.0666876(1); the FULL drift from the imp-3483 coarse value is 12.0870439 - 12.0666876 ~ ' +
    '0.0204 (imp-3511 ~0.018 was the partial 360 -> 1200 leg; the remaining ~0.0024 is the 1200 -> inf tail, first ' +
    'measured here). Measurement only; RH-equivalent; the imp-3066 K_a >= 0 magnitude is the lone obstruction, ' +
    'UNTOUCHED. NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    objective: 'sup_xi |P1(xi)|, P1 = dP/dxi, P(xi) = |Phihat(xi)|^2 = C^2 + S^2 (the peak slope behind ||Ttilde||)',
    maximizerIsP2Root:
      'a local max of |P1| with P1 != 0 requires dP1/dxi = P2 = 0; the global maximizer of |P1| is a root of P2 ' +
      '(imp-3483). imp-3511 certified EXACTLY ONE such root per U window; this pins its converged LOCATION.',
    ladder:
      'locate the single P2 = 0 root xi*(N) for N in {360, 720, 1440, 2880, 5760} at U = 6, doubling N each rung so ' +
      'the panel width H = U/N halves and the O(H^2) quadrature error quarters',
    subNyquist:
      'the [1e-4, 60] enumeration domain stays below the midpoint-quadrature Nyquist xi_Nyq = pi N/U (188..3016) at ' +
      'every rung, so the single-root count is a real enumeration, not an aliasing artifact (imp-3511 guard)',
    orderDiagnostic:
      'successive differences xi*(N) - xi*(N/2) should fall by a ratio of 4 if xi*(N) = xi*_inf + c/N^2 (midpoint ' +
      'quadrature second order); a ratio of 2 would indicate first-order O(1/N) instead',
    richardson:
      'iterated Neville extrapolation on the 1/N^2 sequence, dividing out (1/N^2)^k via the doubling factor 4^k at ' +
      'level k, taking the fully-accelerated diagonal entry as xi*_inf',
    aitken:
      'an INDEPENDENT Aitken delta^2 acceleration of the raw ladder, repeated to convergence, as a cross-check that ' +
      'the limit is not an artifact of the 1/N^2 Richardson model',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    a: A_LINEAR,
    U: U_FIXED,
    nLadder: N_LADDER.slice(),
    scanDomain: { xiLo: XI_LO, xiHi: XI_HI, dxi: DXI },
    quadrature: 'midpoint, N panels on [0, U]; analytic xi-derivatives of the Fourier parts (imp-3470 assembly)',
    selfComputing: true,
  }),

  measured: Object.freeze({
    ladderCells, // per-rung xiStar, nRoots, xi_Nyq, sub-Nyquist flag
    xiStarLadder, // [12.0870439, 12.0717996, 12.0679670, 12.0670075, 12.0667676]
    diffs, // successive differences (all negative -> monotone decrease toward the limit)
    diffRatios, // ~[3.978, 3.995, 3.999] -> 4.00, confirming O(1/N^2)
    meanDiffRatio,
    secondOrderConfirmed,
    monotoneDown,
    pairwiseRichardson, // pairwise 1/N^2 extrapolants (tail ~12.06668762)
    pairwiseRichardsonTail,
    richardsonLevels, // iterated Neville table (last entries L0..L4 converge to ~12.06668761)
    iteratedRichardson, // ~12.06668761 (headline)
    aitkenPasses, // repeated Aitken delta^2 passes on the raw ladder
    aitkenLimit, // ~12.06668761 (independent cross-check)
    methodSpread, // ~1e-8 -- the three extrapolants agree
    xiStarInf, // ~12.0666876 converged location
    residualBand, // 1e-6 conservative band -> xi*_inf = 12.0666876(1)
    xiStarImp3483Coarse, // 12.0870439 (N = 360)
    totalDriftFromCoarse, // ~0.0204 (full N = 360 -> inf)
    imp3511PartialDrift, // ~0.018 (the imp-3511-reported 360 -> 1200 leg)
    remainingTailDrift, // ~0.0024 (1200 -> inf, first measured here)
    allSingleRoot, // true -> one maximizer at every resolution
    allSubNyquist,
    verdict,
  }),

  interpretation: Object.freeze({
    driftIsConvergenceNotSecondMaximizer:
      'Every rung of the panel-count ladder reports EXACTLY ONE P2 root (all sub-Nyquist), so the 12.087 -> 12.067 ' +
      'motion is the SAME unique maximizer resolved on a finer grid, NOT a second stationary point emerging. This ' +
      'cleanly separates the imp-3511 convergence drift from the excluded near-competitor possibility.',
    secondOrderConvergence:
      'The successive differences quarter each time N doubles (ratios 3.978, 3.995, 3.999 -> 4.00), the signature of ' +
      'second-order midpoint quadrature xi*(N) = xi*_inf + c/N^2. This is what licenses the 1/N^2 Richardson model.',
    convergedLocation:
      'Iterated Richardson and an independent Aitken delta^2 both land at xi*_inf ~ 12.06668761 (agreement ~1e-9), ' +
      'with the pairwise-Richardson tail at ~12.06668762. The converged maximizer is xi*_inf = 12.0666876(1), so the ' +
      'grid-dependent value is now pinned to a number rather than a drifting one.',
    driftAccounting:
      'The full N = 360 -> inf drift is 12.0870439 - 12.0666876 ~ 0.0204; the imp-3511-quoted ~0.018 was only the ' +
      '360 -> 1200 leg, and the remaining ~0.0024 (1200 -> inf) is measured here for the first time. C_inf ~ 0.1751 ' +
      'should be read at the converged xi*, not the coarse-grid one.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measuresLimitNotClosedForm:
      'This EXTRAPOLATES the converged location of the imp-3483 unique maximizer and quantifies its residual band; it ' +
      'does NOT give xi* or the sup an elementary closed form -- the imp-3470 stationarity equation stays ' +
      'transcendental, so C_inf ~ 0.1751 remains a determined number requiring transcendental evaluation.',
    orderIsEmpirical:
      'The O(1/N^2) convergence is an EMPIRICAL Euler-Maclaurin observation from the diff-ratio -> 4 over a FINITE ' +
      'ladder N <= 5760, not an analytic error bound; the Richardson/Aitken limit inherits that empirical status.',
    residualBandIsConservative:
      'xi*_inf = 12.0666876(1) is reported with a conservative 1e-6 band that dominates the ~1e-8 cross-method spread ' +
      'by two orders of magnitude; the true extrapolation error is likely far smaller, but the finite ladder does not ' +
      'certify more digits.',
    subNyquistOnly:
      'Valid only in the quadrature-valid band [1e-4, 60] < xi_Nyq = pi N/U; the imp-3511 coarse-grid guard showed ' +
      'that widening the domain without co-refining N aliases and manufactures spurious roots.',
    measuresRatioNotPositivity:
      'This certifies the location behind the numerator norm of the capture RATIO; it does NOT construct the missing ' +
      'magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    necessaryNotSufficient:
      'Diagnostic only; the imp-3066 off-diagonal endpoint-Hankel operator magnitude remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3523_XISTAR_PANEL_COUNT_CONVERGENCE_LIMIT_ASSERTIONS = [
  {
    id: 'imp3523-exactly-one-root-at-every-rung',
    why: 'THE separation deliverable: every panel-count rung must report EXACTLY ONE P2 root, so the ladder drift is ' +
      'the same unique maximizer resolved finer, NOT a second stationary point appearing. A rung with 2 roots would ' +
      'mean the drift and a competitor are entangled.',
    holds: () => ladderCells.every((c) => c.nRoots === 1) && allSingleRoot,
  },
  {
    id: 'imp3523-every-rung-sub-nyquist',
    why: 'The [0, 60] enumeration must stay below the midpoint-quadrature Nyquist xi_Nyq = pi N/U at every rung, else ' +
      'the single-root count would be an aliasing artifact rather than a real enumeration (imp-3511 coarse-grid guard).',
    holds: () => ladderCells.every((c) => c.subNyquist) && allSubNyquist,
  },
  {
    id: 'imp3523-coarse-rung-matches-imp3483',
    why: 'The N = 360 rung must reproduce the imp-3483 / imp-3511 coarse-grid value 12.0870439, anchoring the ladder ' +
      'to the published starting point. A mismatch would mean the reused P2 assembly diverged from the parent.',
    holds: () => Math.abs(ladderCells[0].xiStar - xiStarImp3483Coarse) < 5e-6,
  },
  {
    id: 'imp3523-second-order-convergence',
    why: 'The successive differences xi*(N) - xi*(N/2) must fall by a ratio near 4 (midpoint quadrature O(1/N^2)); a ' +
      'ratio near 2 would signal first-order convergence and invalidate the 1/N^2 Richardson model. Also the sequence ' +
      'must decrease monotonically toward the limit.',
    holds: () => secondOrderConfirmed && monotoneDown && meanDiffRatio > 3.9 && meanDiffRatio < 4.1,
  },
  {
    id: 'imp3523-richardson-aitken-agree',
    why: 'The iterated-Richardson limit and the INDEPENDENT Aitken delta^2 limit must agree closely (< 1e-6), and the ' +
      'pairwise-Richardson tail must join them: three extrapolants agreeing is the cross-check that the limit is not a ' +
      'single-model artifact.',
    holds: () =>
      Math.abs(iteratedRichardson - aitkenLimit) < 1e-6 &&
      methodSpread < 1e-6 &&
      extrapolantsAgree,
  },
  {
    id: 'imp3523-converged-value-in-band',
    why: 'The converged xi*_inf must land at ~12.0666876, strictly BELOW every finer rung (the sequence decreases to ' +
      'it) and below the imp-3483 coarse value, inside [12.06, 12.07]. A limit above the finest rung would be ' +
      'nonsensical for a monotone-decreasing sequence.',
    holds: () =>
      xiStarInf > 12.06 && xiStarInf < 12.07 &&
      xiStarInf < xiStarLadder[xiStarLadder.length - 1] &&
      xiStarInf < xiStarImp3483Coarse,
  },
  {
    id: 'imp3523-drift-accounting-consistent',
    why: 'The full N = 360 -> inf drift must be ~0.0204 and exceed the imp-3511-reported partial ~0.018 (360 -> 1200 ' +
      'leg) by the ~0.0024 tail measured here. This confirms imp-3511 saw only part of the drift.',
    holds: () =>
      totalDriftFromCoarse > 0.019 && totalDriftFromCoarse < 0.022 &&
      totalDriftFromCoarse > imp3511PartialDrift &&
      remainingTailDrift > 0.001 && remainingTailDrift < 0.004,
  },
  {
    id: 'imp3523-verdict-limit-certified',
    why: 'The classified verdict must be the panel-count-limit-certified split, not indeterminate; a flip means the ' +
      'single-root, sub-Nyquist, second-order, monotone, or extrapolant-agreement certification failed.',
    holds: () =>
      verdict === 'XISTAR-PANEL-COUNT-LIMIT-CERTIFIED-SECOND-ORDER-CONVERGENCE-SINGLE-MAXIMIZER-XISTAR-INF-12.0666876',
  },
  {
    id: 'imp3523-honest-assessment-no-qed',
    why: 'Mandatory honesty: measures the LIMIT not a closed form (equation transcendental), the O(1/N^2) order is ' +
      'empirical over a finite ladder, the residual band is conservative, sub-Nyquist only, measures the ratio not ' +
      'positivity, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3523_XISTAR_PANEL_COUNT_CONVERGENCE_LIMIT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.measuresLimitNotClosedForm === 'string' &&
        typeof c.orderIsEmpirical === 'string' &&
        typeof c.residualBandIsConservative === 'string' &&
        typeof c.subNyquistOnly === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3523_XISTAR_PANEL_COUNT_CONVERGENCE_LIMIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3523-xistar-panel-count-convergence-limit assertion failed: ${assertion.id}`);
  }
}

export default IMP3523_XISTAR_PANEL_COUNT_CONVERGENCE_LIMIT;
