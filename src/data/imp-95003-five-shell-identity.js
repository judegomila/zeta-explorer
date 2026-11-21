/**
 * imp-95003 — Exact finite Fourier model of the five-shell P97 identity.
 *
 * Permutation atlas (Permuting the Zeta Twin Ladder, Sections 4.3-4.4, eqs.
 * (11)/(12)): the 25 primes p <= 97 are grouped by the cuts (0,5,10,17,25) into
 * FOUR blocks of sizes 5,5,7,8. Each prime carries a projection
 *
 *     Pi_p = I - A_p ,   A_p = projection onto Fourier modes divisible by p,
 *
 * so Pi_p RETAINS the modes NOT divisible by p. All A_p (hence all Pi_p) are
 * DIAGONAL in the Fourier basis: they are commuting, self-adjoint, idempotent
 * orthogonal projections.
 *
 * Sieving the start vector v block by block produces FIVE SHELLS with mutually
 * DISJOINT Fourier supports:
 *   - block survival S_g retains modes coprime to every prime in block g;
 *   - the LIVE state after all four blocks,  Y_4 = S_4 S_3 S_2 S_1 v, supported
 *     on modes coprime to ALL 25 primes;
 *   - the four Annihilated states  Z_g = (I - S_g) Y_{g-1}  (Y_0 = v), supported on
 *     modes divisible by some prime in block g but coprime to every prime in
 *     blocks 1..g-1.
 * Because block h > g demands coprimality to block g while Z_g demands
 * divisibility by a block-g prime, the supports of the shells are pairwise
 * disjoint, hence the five shells are pairwise ORTHOGONAL. This is the precise
 * sense in which the "bridge packets" are five orthogonal CORRELATED sectors
 * (one Fourier-support partition of the start vector) rather than five
 * independent balls.
 *
 * The block telescoping  Y_{g-1} = Y_g + Z_g  collapses to the exact cocycle
 *
 *     v = Y_4 + sum_{g=1..4} Z_g ,
 *
 * and, writing A97 for the full-kill projection onto modes divisible by at
 * least one of the 25 primes (so 1 - A97 = full survival), A97 annihilates the
 * live state and fixes each eliminated state:  (1 - A97) Y_4 = Y_4,  A97 Z_g = Z_g.
 * Evaluating at the point 0 (value f(0) = sum of Fourier coefficients) gives the
 * EXACT five-shell identity of the ticket,
 *
 *     E97 = (1 - A97) Y_4 (0) - A97 sum_{g=1..4} Z_g (0)
 *         = Y_4(0) - sum_{g=1..4} Z_g(0)
 *         = 2 Y_4(0) - v(0).
 *
 * This module realizes the construction on an explicit finite frequency window
 * and CHECKS every clause exactly (integer/rational masking, no floating drift):
 * commuting self-adjoint idempotents, mutual shell orthogonality, the block
 * telescoping, the live/killed splitting under A97, and the closed E97 form.
 *
 * E-status finite linear-algebra / Fourier identity. It changes no bound and
 * closes no gap (NO QED); no refereed bound is changed.
 */

// ── the 25 primes p <= 97 and the (0,5,10,17,25) block cuts ─────────────────
const PRIMES_LE_97 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
  53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
];
const CUTS = [0, 5, 10, 17, 25]; // four blocks of sizes 5, 5, 7, 8
const BLOCKS = [];
for (let g = 0; g < CUTS.length - 1; g++) {
  BLOCKS.push(PRIMES_LE_97.slice(CUTS[g], CUTS[g + 1]));
}
const BLOCK_SIZES = BLOCKS.map((b) => b.length); // [5, 5, 7, 8]

// ── the finite Fourier window: mode index k = 0 .. N-1 ──────────────────────
// N > 97 so the coprime (live) sector is non-empty; A_p acts diagonally as the
// 0/1 mask [p divides k]. Mode 0 is divisible by every p (eliminated at block 1).
const N = 300;
const MODES = Array.from({ length: N }, (_, k) => k);

// deterministic non-degenerate start vector (nonzero on every mode so all five
// shells are non-trivial); values are exact rationals-as-integers over a scale.
const startVector = MODES.map((k) => 3 + ((k * 7 + 11) % 13));

// f(0) = value at the point 0 = sum of Fourier coefficients
const evalAtZero = (f) => f.reduce((s, x) => s + x, 0);

const dot = (a, b) => {
  let s = 0;
  for (let k = 0; k < a.length; k++) s += a[k] * b[k];
  return s;
};

// support (set of modes with nonzero coefficient), as a Set of indices
const support = (f) => {
  const S = new Set();
  for (let k = 0; k < f.length; k++) if (f[k] !== 0) S.add(k);
  return S;
};
const disjoint = (S, T) => {
  for (const k of S) if (T.has(k)) return false;
  return true;
};

// A_p : diagonal projection onto modes divisible by p  (A_p f)[k] = [p|k] f[k]
const applyA = (f, p) => f.map((x, k) => (k % p === 0 ? x : 0));
// Pi_p = I - A_p : retain modes NOT divisible by p
const applyPi = (f, p) => f.map((x, k) => (k % p === 0 ? 0 : x));

// block survival S_g : retain modes coprime to EVERY prime in the block
const survivesBlock = (k, block) => block.every((p) => k % p !== 0);
const applyS = (f, block) => f.map((x, k) => (survivesBlock(k, block) ? x : 0));

// ── build the five shells by block-by-block sieving ─────────────────────────
const Y = [startVector.slice()]; // Y[0] = v
const Z = []; // Z[g-1] = eliminated state at block g
for (let g = 0; g < BLOCKS.length; g++) {
  const Yg = applyS(Y[g], BLOCKS[g]);
  const Zg = Y[g].map((x, k) => x - Yg[k]); // eliminated part at this block
  Y.push(Yg);
  Z.push(Zg);
}
const Y4 = Y[Y.length - 1]; // live state, coprime to all 25 primes
const shells = [Y4, ...Z]; // the five shells

// ── A97 : full-kill projection onto modes divisible by SOME prime <= 97 ──────
const killedByAny = (k) => PRIMES_LE_97.some((p) => k % p === 0);
const applyA97 = (f) => f.map((x, k) => (killedByAny(k) ? x : 0));
const applyOneMinusA97 = (f) => f.map((x, k) => (killedByAny(k) ? 0 : x));

const sumZ = MODES.map((_, k) => Z.reduce((s, Zg) => s + Zg[k], 0));

// ── the exact cocycle E97 = (1-A97) Y4(0) - A97 sum Z_g (0) ──────────────────
const liveTerm = evalAtZero(applyOneMinusA97(Y4)); // = Y4(0)
const killedTerm = evalAtZero(applyA97(sumZ)); // = sum Z_g(0)
const E97 = liveTerm - killedTerm;

// closed forms it must equal exactly
const Y4AtZero = evalAtZero(Y4);
const sumZAtZero = evalAtZero(sumZ);
const vAtZero = evalAtZero(startVector);
const E97_closed = Y4AtZero - sumZAtZero;
const E97_alt = 2 * Y4AtZero - vAtZero;

// telescoping residual  v - (Y4 + sum Z_g)  (must be exactly zero on every mode)
const telescopeResidual = MODES.reduce(
  (m, _, k) => Math.max(m, Math.abs(startVector[k] - (Y4[k] + sumZ[k]))),
  0
);

// ── pairwise shell orthogonality via disjoint supports ──────────────────────
const shellSupports = shells.map(support);
let maxCross = 0;
let allSupportsDisjoint = true;
for (let i = 0; i < shells.length; i++) {
  for (let j = i + 1; j < shells.length; j++) {
    maxCross = Math.max(maxCross, Math.abs(dot(shells[i], shells[j])));
    if (!disjoint(shellSupports[i], shellSupports[j])) allSupportsDisjoint = false;
  }
}

// ── live/killed splitting under A97 ─────────────────────────────────────────
const liveAnnihilated = evalAtZero(applyA97(Y4).map(Math.abs)); // A97 Y4 == 0
const oneMinusA97OnKilled = Z.reduce(
  (m, Zg) => Math.max(m, evalAtZero(applyOneMinusA97(Zg).map(Math.abs))),
  0
); // (1-A97) Z_g == 0 for every g

export const IMP_95003_FIVE_SHELL_IDENTITY = {
  id: 'imp-95003',
  title: 'Exact five-shell P97 identity on a finite Fourier model',
  proofSection: 'permutation-architecture',
  model: {
    primesLe97: PRIMES_LE_97.length, // 25
    cuts: CUTS,
    blockSizes: BLOCK_SIZES, // [5, 5, 7, 8]
    frequencyWindow: N,
    startVector: 'deterministic, nonzero on every mode (all five shells non-trivial)',
  },
  projections: {
    form: 'Pi_p = I - A_p with A_p f = [p divides k] f (diagonal in Fourier basis)',
    commutingSelfAdjointIdempotent: true,
    piRetainsModesNotDivisibleByP: true,
  },
  shells: {
    count: 5,
    live: 'Y_4 = S_4 S_3 S_2 S_1 v, supported on modes coprime to all 25 primes',
    killed: 'Z_g = (I - S_g) Y_{g-1}, one per block g = 1..4',
    mutuallyDisjointSupports: allSupportsDisjoint,
    maxPairwiseInnerProduct: maxCross, // 0: pairwise orthogonal
    interpretation:
      'five orthogonal CORRELATED sectors (one Fourier-support partition of v), ' +
      'not five independent balls',
  },
  telescoping: {
    identity: 'v = Y_4 + sum_{g=1..4} Z_g',
    maxResidual: telescopeResidual, // 0 exactly
  },
  cocycle: {
    identity: 'E97 = (1 - A97) Y_4 (0) - A97 sum_{g=1..4} Z_g (0)',
    liveTerm, // = Y4(0)
    killedTerm, // = sum Z_g(0)
    E97,
    closedForm: E97_closed, // = Y4(0) - sum Z_g(0)
    altForm: E97_alt, // = 2 Y4(0) - v(0)
    matchesClosedForm: E97 === E97_closed && E97 === E97_alt,
    a97AnnihilatesLive: liveAnnihilated === 0, // A97 Y_4 == 0
    oneMinusA97KillsKilled: oneMinusA97OnKilled === 0, // (1-A97) Z_g == 0
  },
  verdict:
    'EXACT finite Fourier realization of the five-shell P97 identity: 25 primes ' +
    'in four (5,5,7,8) blocks, diagonal commuting self-adjoint projections Pi_p, ' +
    'five Fourier-disjoint (hence orthogonal) shells Y_4, Z_1..Z_4, the block ' +
    'telescoping v = Y_4 + sum Z_g, and the closed cocycle ' +
    'E97 = (1-A97) Y_4(0) - A97 sum Z_g(0) = Y4(0) - sum Z_g(0) = 2 Y4(0) - v(0). ' +
    'Every clause holds exactly. Changes no bound; closes no gap; NO QED. ' +
    'No refereed bound is changed.',
};

// ── assertions (import-light; no heavy bundle) ─────────────────────────────
export const IMP_95003_ASSERTIONS = [
  {
    id: 'imp-95003-block-partition',
    holds: () =>
      PRIMES_LE_97.length === 25 &&
      BLOCK_SIZES.join(',') === '5,5,7,8' &&
      BLOCKS.flat().join(',') === PRIMES_LE_97.join(','),
    why: 'The 25 primes p <= 97 are partitioned by the cuts (0,5,10,17,25) into four blocks of sizes 5,5,7,8 (paper Sections 4.3-4.4).',
  },
  {
    id: 'imp-95003-projections-commute-selfadjoint',
    holds: () => {
      // diagonal masks: Pi_p Pi_q = Pi_q Pi_p and Pi_p^2 = Pi_p, checked on all modes
      const p = 7;
      const q = 11;
      for (let k = 0; k < N; k++) {
        const both = k % p !== 0 && k % q !== 0 ? 1 : 0;
        const pq = applyPi(applyPi(MODES.map((x) => (x === k ? 1 : 0)), p), q)[k];
        const qp = applyPi(applyPi(MODES.map((x) => (x === k ? 1 : 0)), q), p)[k];
        const idem = applyPi(applyPi(MODES.map((x) => (x === k ? 1 : 0)), p), p)[k];
        const once = applyPi(MODES.map((x) => (x === k ? 1 : 0)), p)[k];
        if (pq !== both || qp !== both || pq !== qp || idem !== once) return false;
      }
      return true;
    },
    why: 'A_p (hence Pi_p = I - A_p) is diagonal in the Fourier basis, so the projections are commuting, self-adjoint and idempotent orthogonal projections.',
  },
  {
    id: 'imp-95003-five-shells-orthogonal',
    holds: () => allSupportsDisjoint && maxCross === 0,
    why: 'The live shell Y_4 and the four annihilated shells Z_1..Z_4 have mutually disjoint Fourier supports, so the five shells are pairwise orthogonal (max pairwise inner product = 0).',
  },
  {
    id: 'imp-95003-telescoping-exact',
    holds: () => telescopeResidual === 0,
    why: 'The block recursion Y_{g-1} = Y_g + Z_g telescopes to v = Y_4 + sum_{g=1..4} Z_g exactly on every Fourier mode.',
  },
  {
    id: 'imp-95003-a97-splits-live-killed',
    holds: () => liveAnnihilated === 0 && oneMinusA97OnKilled === 0,
    why: 'A97 (eliminate by some prime <= 97) annihilates the live state Y_4 and fixes every eliminated state Z_g: (1-A97) Y_4 = Y_4 and A97 Z_g = Z_g.',
  },
  {
    id: 'imp-95003-cocycle-closed-form',
    holds: () =>
      E97 === liveTerm - killedTerm &&
      E97 === Y4AtZero - sumZAtZero &&
      E97 === 2 * Y4AtZero - vAtZero,
    why: 'The exact cocycle E97 = (1-A97) Y4(0) - A97 sum Z_g(0) equals Y4(0) - sum Z_g(0) = 2 Y4(0) - v(0), evaluated at the point 0.',
  },
];

export default IMP_95003_FIVE_SHELL_IDENTITY;
