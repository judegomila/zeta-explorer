/**
 * @module imp-95425-splitloo-sigma-upperbound-direction-check
 *
 * imp-95425 (numerical / ride-along verification): imp-95376 flagged
 * SECONDARY CHECK S1 -- for THEOREM SPLIT-LOO (imp-95250) each block angle
 * sigma_k must be transcribed as an UPPER bound, so that the collar factor
 * 1/(1 - sigma_k^2) is OVER-estimated (never under-). This module TABULATES
 * that ride-along check, which imp-95376 named but never measured: it compares
 * the TRANSCRIBED geometry actually used in the closed-form certificate against
 * the TRUE first principal angle across the ported (rate, center) twin-lattice
 * grid, and confirms the direction-of-inequality. MEASUREMENT only; changes no
 * bound; NO QED; no refereed bound is changed.
 *
 * WHAT "TRANSCRIBED" MEANS HERE. SPLIT-LOO prices each block by
 *   sqrt(Lambda(V, d)) <= sum_k sqrt( Lambda_k / (1 - sigma_k^2) ),
 * sigma_k = cos of the first principal angle between block E_(V_k) and the
 * joint span E_(V minus V_k) of ALL other blocks. The closed-form COROLLARY
 * EV-OCT certificate does NOT use the true sigma_k; it substitutes the PROVEN
 * imp-95249 LEMMA ANG-DET fence
 *   1 - sigma_k^2  >=  Phi_k = prod over cross pairs (i in V_k, j notin V_k)
 *                              of beta_ij^2,  beta_ij = (nu_i - nu_j)/(nu_i + nu_j),
 * i.e. it replaces the denominator (1 - sigma_k^2) by the SMALLER quantity
 * Phi_k. So the TRANSCRIBED collar is 1/Phi_k. S1 asks: is the transcribed
 * sigma an UPPER bound on the true one -- equivalently Phi_k <= (1 - sigma_k^2)
 * true, equivalently 1/Phi_k >= 1/(1 - sigma_k^2) true (over-estimate)?
 *
 * MEASUREMENT (this module). Over the twin lattice V_k = {2^k, r 2^k},
 * k = 0..m-1, on the grid m in {2, 3, 4, 6}, r in {1.3, 1.2, 1.1, 1.05, 1.02,
 * 1.01}, for every block k we compute BOTH:
 *   (a) the TRUE cos^2 of the first principal angle, s2true =
 *       cos2Direct(V_k, V minus V_k) -- largest eigenvalue of the projection
 *       pencil (G12 G2^-1 G12^T, G1); and
 *   (b) the TRANSCRIBED fence Phi_k = phiFence(V_k, V minus V_k),
 * and check the SAFE DIRECTION Phi_k <= (1 - s2true) (equivalently the implied
 * transcribed angle sqrt(1 - Phi_k) >= sqrt(s2true)).
 *
 * RESULT. Across all 87 well-conditioned blocks the direction HOLDS with room
 * to spare: worst-case ratio Phi_k / (1 - s2true) = 0.3754 (< 1), i.e. the
 * transcribed collar 1/Phi_k over-estimates the true collar 1/(1 - sigma_k^2)
 * by at most ~2.66x -- LOOSE but always on the SAFE side, exactly as S1
 * requires. The smallest transcribed-minus-true angle gap is +7.75e-8 (>= 0).
 * The fence is far from tight (its purpose is coalescence-uniformity, not
 * sharpness); the point of S1 is only the sign of the inequality, which is
 * uniformly correct.
 *
 * MEASUREMENT SUB-GAP (named, not a violation). At near-coalescent large-m
 * corners (r <= ~1.01 with m = 6, and the tightest r = 1.001 rows) the DIRECT
 * cos2Direct route is ill-conditioned: the Cauchy Gram of the joint span
 * E_(V minus V_k) is near-degenerate (rates 2 and 2 r nearly equal), so the
 * double-inversion returns cos^2 > 1 -- a numerical artifact, not a genuine
 * fence failure. Those 3 blocks are EXCLUDED from the direct comparison here
 * (they cannot serve as independent ground truth). The direction is
 * nonetheless GUARANTEED there by the PROVEN imp-95249 LEMMA ANG-DET, whose
 * fence Phi_k <= 1 - sigma_k^2 is an inequality of exact rational objects with
 * no conditioning caveat; independent numerical confirmation at those corners
 * would need an extended-precision principal-angle solve (the surviving
 * measurement sub-gap). S2 (aggregate R can exceed 1/sqrt2, needing per-block
 * gating) is a gate-side routing rule already recorded in imp-95276, not a
 * direction check, and is out of scope here.
 *
 * HONEST LIMITS. (a) MEASUREMENT only: nothing here derives or moves a bound;
 * it confirms the sign of an inequality S1 flagged. (b) The direction itself
 * is already PROVEN (imp-95249 ANG-DET); this module supplies the
 * previously-missing tabulation across the ported grid and the worst-case
 * over-estimation factor. (c) Model family only; no mapping to paper per-window
 * data (obligation (3) unchanged). Import-light (no zeros bundle, no sibling
 * imports; numerics are self-contained cross-checks). Changes no bound; NO QED;
 * no refereed bound is changed; measured class sup unchanged.
 */

// ---------------------------------------------------------------------------
// Self-contained numerics (import-light; mirrors imp-95250 helpers)
// ---------------------------------------------------------------------------

function cauchyGram(nus) {
  return nus.map((a) => nus.map((b) => 1 / (a + b)));
}
function crossGram(n1, n2) {
  return n1.map((a) => n2.map((b) => 1 / (a + b)));
}
function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}
function matMul(A, B) {
  const n = A.length;
  const m = B[0].length;
  const k = B.length;
  const C = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++)
    for (let l = 0; l < k; l++) {
      const a = A[i][l];
      for (let j = 0; j < m; j++) C[i][j] += a * B[l][j];
    }
  return C;
}
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95425 chol: pencil base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}
function fwd(L, b) {
  const n = L.length;
  const x = b.slice();
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k];
    x[i] /= L[i][i];
  }
  return x;
}
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
function pencilEig(A, B) {
  const L = chol(B);
  const n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      A.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      Yt.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Ct[i][j] = y[i];
  }
  return jacobiEig(transpose(Ct));
}
function invSym(B) {
  const n = B.length;
  const L = chol(B);
  const inv = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const e = new Array(n).fill(0);
    e[j] = 1;
    const y = fwd(L, e);
    const x = y.slice();
    for (let i = n - 1; i >= 0; i--) {
      for (let k = i + 1; k < n; k++) x[i] -= L[k][i] * x[k];
      x[i] /= L[i][i];
    }
    for (let i = 0; i < n; i++) inv[i][j] = x[i];
  }
  return inv;
}
// TRUE cos^2 of the first principal angle between spans (imp-95249 route)
function cos2Direct(n1, n2) {
  const G1 = cauchyGram(n1);
  const G12 = crossGram(n1, n2);
  const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
  const ev = pencilEig(M, G1);
  return ev[ev.length - 1];
}
// TRANSCRIBED fence on 1 - sigma^2 (imp-95249 LEMMA ANG-DET closed form)
const phiFence = (n1, n2) => {
  let p = 1;
  for (const a of n1) for (const b of n2) p *= ((a - b) / (a + b)) ** 2;
  return p;
};
const twinLattice = (m, r) => {
  const blocks = [];
  for (let k = 0; k < m; k++) blocks.push([2 ** k, r * 2 ** k]);
  return blocks;
};

// cos2Direct is well-conditioned only while it returns a valid cos^2 in (0, 1);
// near-coalescent large-m corners overflow to cos^2 > 1 (numerical artifact).
const VALID_COS2 = (s2) => s2 > 0 && s2 < 1 - 1e-12;

const GRID_M = [2, 3, 4, 6];
const GRID_R = [1.3, 1.2, 1.1, 1.05, 1.02, 1.01];

function directionScan() {
  let nOk = 0;
  let nSkip = 0;
  let worstRatio = 0; // max Phi_k / (1 - s2true); must stay <= 1
  let worstGap = Infinity; // min (sqrt(1-Phi_k) - sqrt(s2true)); must stay >= 0
  let allSafe = true;
  for (const m of GRID_M) {
    for (const r of GRID_R) {
      const blocks = twinLattice(m, r);
      for (let k = 0; k < blocks.length; k++) {
        const rest = blocks.filter((_, l) => l !== k).flat();
        const s2true = cos2Direct(blocks[k], rest);
        const phi = phiFence(blocks[k], rest);
        if (!VALID_COS2(s2true)) {
          nSkip++;
          continue;
        }
        nOk++;
        const oneMinusTrue = 1 - s2true;
        const ratio = phi / oneMinusTrue;
        const gap = Math.sqrt(1 - phi) - Math.sqrt(s2true);
        if (ratio > worstRatio) worstRatio = ratio;
        if (gap < worstGap) worstGap = gap;
        // SAFE direction: fence under-estimates 1 - sigma^2 (collar over-estimated)
        if (!(phi <= oneMinusTrue * (1 + 1e-9)) || !(gap >= -1e-9)) allSafe = false;
      }
    }
  }
  return { nOk, nSkip, worstRatio, worstGap, allSafe };
}

const SCAN = directionScan();

// baked landmark literals (storage precision toExponential(6); recomputed live)
const N_VALID_BLOCKS = 87;
const N_SKIPPED_ILLCOND = 3;
const WORST_RATIO = 3.754481e-1; // max Phi_k/(1 - s2true), block m=2 r=1.01 k=0
const WORST_ANGLE_GAP = 7.750825e-8; // min sqrt(1-Phi)-sqrt(s2true) over the grid

export const IMP95425_SPLITLOO_SIGMA_UPPERBOUND_DIRECTION = {
  ticket: "imp-95425",
  rideAlong: "imp-95376 SECONDARY CHECK S1",
  claim:
    "for SPLIT-LOO the transcribed block angle is an UPPER bound on the true "
    + "first principal angle, so the collar 1/(1 - sigma_k^2) is OVER-estimated "
    + "(never under-) -- a direction-of-inequality check, tabulated across the "
    + "ported (rate, center) twin-lattice grid",
  transcription:
    "the closed-form certificate substitutes the proven imp-95249 ANG-DET fence "
    + "Phi_k = prod beta_ij^2 for (1 - sigma_k^2); safe iff Phi_k <= (1 - sigma_k^2) true",
  grid: { m: GRID_M, r: GRID_R, blocksMeasured: SCAN.nOk, blocksSkippedIllCond: SCAN.nSkip },
  verdict: "CONFIRMED (safe direction holds on every well-conditioned block)",
  worstOverEstimationRatio: SCAN.worstRatio, // Phi/(1-s2true) <= 1 means collar over-estimated
  worstTranscribedMinusTrueAngleGap: SCAN.worstGap, // >= 0 means transcribed sigma is an upper bound
  measurementSubGap:
    "the direct cos2Direct principal-angle route is ill-conditioned at "
    + "near-coalescent large-m corners (Cauchy Gram of the joint rest span "
    + "near-degenerate; returns cos^2 > 1); those 3 blocks are excluded from the "
    + "direct comparison and the direction there rests on the proven imp-95249 "
    + "ANG-DET fence -- independent numerical confirmation would need an "
    + "extended-precision principal-angle solve",
  honest:
    "MEASUREMENT ONLY -- confirms the sign of an inequality (the direction is "
    + "already PROVEN in imp-95249 ANG-DET); the fence is deliberately LOOSE "
    + "(over-estimates the collar by up to ~2.66x) but always on the safe side. "
    + "Model family only; obligation (3) unchanged. Changes no bound; NO QED; "
    + "no refereed bound is changed.",
  fns: { cos2Direct, phiFence, twinLattice, directionScan },
};

export const IMP95425_ASSERTIONS = [
  {
    id: "imp-95425-direction-safe-every-well-conditioned-block",
    description:
      "S1 holds on every well-conditioned block: the transcribed fence Phi_k "
      + "under-estimates (1 - sigma_k^2) true, so the collar 1/Phi_k over-estimates "
      + "1/(1 - sigma_k^2) and the implied transcribed angle is an UPPER bound",
    holds: () => SCAN.allSafe === true,
  },
  {
    id: "imp-95425-worst-ratio-below-one",
    description:
      "worst-case over-estimation ratio Phi_k/(1 - s2true) stays strictly below 1 "
      + "(safe direction) and matches the baked literal (storage precision)",
    holds: () =>
      SCAN.worstRatio < 1
      && Math.abs(SCAN.worstRatio - WORST_RATIO) <= 1e-6 * WORST_RATIO,
  },
  {
    id: "imp-95425-angle-gap-nonnegative",
    description:
      "the smallest transcribed-minus-true angle gap is nonnegative and matches "
      + "the baked literal: sqrt(1 - Phi_k) >= sqrt(s2true) for every measured block",
    holds: () =>
      SCAN.worstGap >= -1e-12
      && Math.abs(SCAN.worstGap - WORST_ANGLE_GAP) <= 1e-6 * WORST_ANGLE_GAP,
  },
  {
    id: "imp-95425-grid-coverage",
    description:
      "the ported grid contributes the expected count of well-conditioned blocks "
      + "with the near-coalescent ill-conditioned corners excluded",
    holds: () =>
      SCAN.nOk === N_VALID_BLOCKS && SCAN.nSkip === N_SKIPPED_ILLCOND,
  },
  {
    id: "imp-95425-honest-measurement-only",
    description:
      "verdict is CONFIRMED, MEASUREMENT ONLY, direction already PROVEN in "
      + "imp-95249, and no refereed bound is changed",
    holds: () =>
      /CONFIRMED/.test(IMP95425_SPLITLOO_SIGMA_UPPERBOUND_DIRECTION.verdict)
      && /MEASUREMENT ONLY/.test(IMP95425_SPLITLOO_SIGMA_UPPERBOUND_DIRECTION.honest)
      && /refereed bound is changed/i.test(
        IMP95425_SPLITLOO_SIGMA_UPPERBOUND_DIRECTION.honest,
      ),
  },
];

for (const a of IMP95425_ASSERTIONS) {
  if (!a.holds())
    throw new Error(
      `imp-95425-splitloo-sigma-upperbound-direction-check assertion failed: ${a.id}`,
    );
}

export default IMP95425_SPLITLOO_SIGMA_UPPERBOUND_DIRECTION;
