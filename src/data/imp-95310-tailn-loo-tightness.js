/**
 * imp-95310: TIGHTNESS of the imp-95285 LEMMA TAIL-N cross-Blaschke tail
 * product against the EXACT leave-one-out angle.
 *
 * CONTEXT. The imp-95285 THEOREM EV-OCT-N certificate fences each octave
 * block leave-one-out angle by
 *   1 - sigma_k^2 >= Phi_k >= phiHat_k := prod_(l in K, l != k) b_(|k-l|)^(2 N^2),
 *   b_n = (2^n - R)/(2^n + R),
 * i.e. it (a) replaces every actual cross pair beta_ij by the single worst
 * octave value b_(|k-l|) and (b) pads the number of squared factors per
 * octave pair up to N^2 regardless of how many rates the block really
 * carries. imp-95259 measured only the N = 2 / pair PhiUnif; the N >= 3
 * padding slack was never quantified. This module MEASURES that slack.
 *
 * DECOMPOSITION. Between the exact angle and the crude tail fence sit two
 * distinct over-pricings, which multiply:
 *   totalRatio = (1 - sigma_k^2) / phiHat_k
 *              = [ (1 - sigma_k^2) / phiFence_k ] * [ phiFence_k / phiHat_k ]
 *              =        angDetSlack             *          padRatio,
 * where phiFence_k = prod_(i in V_k, j in V minus V_k) beta_ij^2 is the
 * ACTUAL-rate LEMMA ANG-DET fence (imp-95249). angDetSlack is the ANG-DET
 * ingredient slack; padRatio = phiFence_k / phiHat_k is the pure TAIL-N
 * worst-b_n-plus-count-padding slack -- always closed form (no eigensolve),
 * so it is the fence's OWN over-pricing isolated from the ANG-DET ingredient.
 *
 * MEASUREMENT (edge placement: N rates equally spaced across [2^k, R 2^k],
 * float64 dense generalized-eigensolve for 1 - sigma_k^2, resolvable only
 * where 1 - sigma_k^2 > 1e-11):
 *   occ = {0,2,4}, N=3, R=1.3: edge block total ~3.77e2 (pad 32.2, angDet
 *     11.7); CENTRAL block k=2 total ~1.24e6 (pad 280.8, angDet 4.43e3).
 *   occ = {0,2,4}, N=3, R=1.05: edge total ~1.78e1 (pad 1.80); central
 *     total ~1.26e4 (pad 2.60) -- an order of magnitude TIGHTER than R=1.3.
 *   occ = {0,3,6}, N=3, R=1.3 (separation 3): edge total ~7.06 (pad 4.42);
 *     central total ~5.27e2 (pad 14.1) -- farther octaves are tighter.
 *   occ = {0,2,4}, N=4, R=1.3: central block k=2 total ~6.85e12 (pad
 *     2.43e4). Larger N is much looser (exponent 2 N^2).
 *
 * WHERE THE TAIL PRODUCT IS LOOSEST (four monotone levers):
 *   (1) CENTRAL blocks (two nearest n=1 neighbors) beat edge blocks by
 *       ~3300x in totalRatio at N=3, R=1.3 (1.24e6 vs 3.77e2): the fence
 *       under-prices the two-sided cross mass most.
 *   (2) LARGER N (fence exponent 2 N^2): central padRatio 280.8 (N=3) ->
 *       2.43e4 (N=4); totalRatio 1.24e6 -> 6.85e12.
 *   (3) LARGER R: central padRatio 2.60 (R=1.05) -> 280.8 (R=1.3). As
 *       R -> 1 the window collapses and every beta_ij -> b_n, so the fence
 *       becomes near-exact; the padding slack is a large-R phenomenon.
 *   (4) UNDER-FILLED octaves: the fence pads the count to N^2 even for a
 *       single-rate block, so padRatio explodes -- fill=1 gives 4.54e9
 *       (N=3) and 7.23e17 (N=4). This is the single dominant looseness.
 *
 * ADJACENT-OCTAVE / RESOLUTION LIMIT. For the contiguous every-octave
 * lattices the certificate is built for ({0,1,2}, {0,1,2,3}), the exact
 * 1 - sigma_k^2 is ~1e-13..1e-22 -- BELOW float64 generalized-eig
 * resolution (the direct eig returns small NEGATIVE noise), exactly as the
 * imp-95285 skeptical record states. There the fence looseness can only
 * be lower-bounded by the closed-form padRatio, which reaches 3.52e4
 * ({0,1,2} k=0) and 7.41e7 ({0,1,2,3} k=1). The exact-angle over-pricing on
 * true adjacent octaves is therefore UNRESOLVABLE at float64 and is left as
 * a named honest gap (needs extended precision to close).
 *
 * ONSET COST. Swapping the crude tail fence for a "genie" fence that uses
 * the EXACT edge-placed leave-one-out angle (same coalN numerators) and
 * bisecting the SPLIT-LOO firing onset:
 *   occ={0,2,4}   N=3 R=1.3 : onset 14.27 -> 10.81  (+32.0%)
 *   occ={0,2,4}   N=3 R=1.05: onset 12.08 -> 10.38  (+16.4%)
 *   occ={0,3,6}   N=3 R=1.3 : onset  9.29 ->  8.07  (+15.1%)
 *   occ={0,2,4,6} N=3 R=1.3 : onset 14.69 -> 11.00  (+33.5%)
 * So for the float-resolvable spread lattices the tail fence costs ~15-34%
 * of the SPLIT-LOO onset at N=3. (The N=4 genie is not evaluated: the
 * edge-block exact angle falls below float64 resolution.) This over-pricing
 * is the DELIBERATE PRICE of coalescence-uniformity: the exact angle is
 * placement- and coalescence-dependent (it collapses for near-coalescent
 * clusters), whereas phiHat is uniform over every intra-octave
 * configuration -- which is the property EV-OCT-N exists to provide.
 *
 * SCOPE. Measurement of an existing bound's slack; NO bound is changed, no
 * new bound is claimed. The EV-OCT-N onsets (33.50 / 58.11 finite m=6,
 * 61.31 / 107.26 m-uniform) stand. No refereed bound is changed
 * . Import-light (no imports, no zeros bundle); all numerics below are
 * self-contained recomputations.
 */

// ---------------------------------------------------------------------------
// Closed-form fences (no imports)
// ---------------------------------------------------------------------------

const bLat = (n, R) => (2 ** n - R) / (2 ** n + R);
// LEMMA TAIL-N lattice fence: prod_(l in occ, l != k) b_(|k-l|)^(2 N^2)
function phiHatOcc(occ, k, N, R) {
  let p = 1;
  for (const l of occ) if (l !== k) p *= bLat(Math.abs(k - l), R) ** (2 * N * N);
  return p;
}
// LEMMA ANG-DET actual-rate fence: prod beta_ij^2, i in block, j in rest
function phiFence(blk, rest) {
  let p = 1;
  for (const a of blk) for (const b of rest) p *= ((a - b) / (a + b)) ** 2;
  return p;
}
// imp-95251 COAL-N right side (sqrt level), for the onset-cost comparison
function lagNeg(k, y) {
  let s = 0, c = 1, p = 1;
  for (let l = 0; l <= k; l++) { s += c * p; c = (c * (k - l)) / (l + 1); p = (p * y) / (l + 1); }
  return s;
}
function coalN(N, R, x) {
  const y = 2 * R * x;
  let s = lagNeg(N - 1, y);
  for (let k = 0; k <= N - 2; k++) s += 2 * lagNeg(k, y);
  return Math.exp(-x) * s;
}
// edge placement: N rates equally spaced across the octave window [2^k, R 2^k]
function placeEdge(k, N, R) {
  const lo = 2 ** k, hi = R * 2 ** k, out = [];
  for (let i = 0; i < N; i++)
    out.push(N === 1 ? (lo + hi) / 2 : lo + ((hi - lo) * i) / (N - 1));
  return out;
}

// ---------------------------------------------------------------------------
// Dense generalized-eigensolve for the EXACT leave-one-out angle
// ---------------------------------------------------------------------------

function cauchyGram(nus) { return nus.map((a) => nus.map((b) => 1 / (a + b))); }
function crossGram(n1, n2) { return n1.map((a) => n2.map((b) => 1 / (a + b))); }
function transpose(A) { return A[0].map((_, j) => A.map((r) => r[j])); }
function matMul(A, B) {
  const n = A.length, m = B[0].length, kk = B.length;
  const C = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++)
    for (let l = 0; l < kk; l++) { const a = A[i][l]; for (let j = 0; j < m; j++) C[i][j] += a * B[l][j]; }
  return C;
}
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) { if (!(s > 0)) throw new Error("imp-95310 chol: float non-PD"); L[i][i] = Math.sqrt(s); }
      else L[i][j] = s / L[j][j];
    }
  return L;
}
function fwd(L, b) {
  const n = L.length, x = b.slice();
  for (let i = 0; i < n; i++) { for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k]; x[i] /= L[i][i]; }
  return x;
}
function invSym(B) {
  const n = B.length, L = chol(B);
  const inv = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const e = new Array(n).fill(0); e[j] = 1;
    const y = fwd(L, e); const x = y.slice();
    for (let i = n - 1; i >= 0; i--) { for (let k = i + 1; k < n; k++) x[i] -= L[k][i] * x[k]; x[i] /= L[i][i]; }
    for (let i = 0; i < n; i++) inv[i][j] = x[i];
  }
  return inv;
}
function jacobiEig(Ain) {
  const n = Ain.length, A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
        for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
function pencilEig(A, B) {
  const L = chol(B), n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) { const y = fwd(L, A.map((r) => r[j])); for (let i = 0; i < n; i++) Y[i][j] = y[i]; }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) { const y = fwd(L, Yt.map((r) => r[j])); for (let i = 0; i < n; i++) Ct[i][j] = y[i]; }
  return jacobiEig(transpose(Ct));
}
// sigma_k^2 = largest generalized eig of (G12 G2^-1 G12^T, G1)
function cos2Direct(n1, n2) {
  const G1 = cauchyGram(n1), G12 = crossGram(n1, n2);
  const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
  const ev = pencilEig(M, G1);
  return ev[ev.length - 1];
}

// per-block tightness record; ex is resolvable only above the eig noise floor
function blockTightness(occ, ki, N, R) {
  const blocks = occ.map((k) => placeEdge(k, N, R));
  const blk = blocks[ki];
  const rest = blocks.filter((_, l) => l !== ki).flat();
  const phiHat = phiHatOcc(occ, occ[ki], N, R);
  const phiF = phiFence(blk, rest);
  let ex = NaN, resolvable = false;
  try {
    ex = 1 - cos2Direct(blk, rest);
    resolvable = ex > 1e-11 && ex <= 1;
  } catch (e) { /* float non-PD: unresolvable */ }
  return {
    phiHat, phiF, ex, resolvable,
    padRatio: phiF / phiHat,
    totalRatio: resolvable ? ex / phiHat : NaN,
    angDetSlack: resolvable ? ex / phiF : NaN,
  };
}
// pure padding slack for a block of `fill` rates whose fence is padded to N^2
function padRatioUnderfill(occ, ki, N, R, fill) {
  const blocks = occ.map((k) => placeEdge(k, fill, R));
  const rest = blocks.filter((_, l) => l !== ki).flat();
  return phiFence(blocks[ki], rest) / phiHatOcc(occ, occ[ki], N, R);
}
// SPLIT-LOO onset with a given fence rule; genie uses the exact edge angle
function onsetPhiHat(occ, N, R) {
  const f = (x) => {
    let s = 0;
    for (const k of occ) s += coalN(N, R, 2 ** k * x) / Math.sqrt(phiHatOcc(occ, k, N, R));
    return s * s;
  };
  return bisectOnset(f);
}
function onsetGenie(occ, N, R) {
  const blocks = occ.map((k) => placeEdge(k, N, R));
  const f = (x) => {
    let s = 0;
    for (let ki = 0; ki < occ.length; ki++) {
      const rest = blocks.filter((_, l) => l !== ki).flat();
      const ex = 1 - cos2Direct(blocks[ki], rest);
      s += coalN(N, R, 2 ** occ[ki] * x) / Math.sqrt(ex);
    }
    return s * s;
  };
  return bisectOnset(f);
}
function bisectOnset(f) {
  let lo = 1, hi = 200;
  for (let i = 0; i < 120; i++) { const mid = (lo + hi) / 2; if (f(mid) < 1) hi = mid; else lo = mid; }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Reference record (measured literals; recomputed by the assertions)
// ---------------------------------------------------------------------------

export const IMP95310_TAILN_LOO_TIGHTNESS = {
  id: "imp-95310",
  title:
    "Tightness of the imp-95285 LEMMA TAIL-N cross-Blaschke tail product " +
    "phiHat_k = prod b_(|k-l|)^(2 N^2) against the exact leave-one-out " +
    "angle 1 - sigma_k^2 for N >= 3 every-octave lattices",
  measures:
    "over-pricing totalRatio = (1 - sigma_k^2)/phiHat_k, factored as " +
    "padRatio (phiFence/phiHat: worst-b_n + count-to-N^2 padding) times " +
    "angDetSlack ((1 - sigma^2)/phiFence: the imp-95249 ANG-DET ingredient)",
  fenceTightness: [
    // occ, N, R, block index, {padRatio, totalRatio, angDetSlack}
    { occ: [0, 2, 4], N: 3, R: 1.3, ki: 0, padRatio: 32.17, totalRatio: 3.770e2, angDetSlack: 11.72 },
    { occ: [0, 2, 4], N: 3, R: 1.3, ki: 1, padRatio: 280.8, totalRatio: 1.243e6, angDetSlack: 4.427e3 },
    { occ: [0, 2, 4], N: 3, R: 1.05, ki: 0, padRatio: 1.803, totalRatio: 1.781e1, angDetSlack: 9.881 },
    { occ: [0, 2, 4], N: 3, R: 1.05, ki: 1, padRatio: 2.598, totalRatio: 1.264e4, angDetSlack: 4.867e3 },
    { occ: [0, 3, 6], N: 3, R: 1.3, ki: 0, padRatio: 4.421, totalRatio: 7.055, angDetSlack: 1.596 },
    { occ: [0, 3, 6], N: 3, R: 1.3, ki: 1, padRatio: 14.13, totalRatio: 5.269e2, angDetSlack: 37.29 },
    { occ: [0, 2, 4], N: 4, R: 1.3, ki: 1, padRatio: 2.431e4, totalRatio: 6.846e12, angDetSlack: 2.816e8 },
  ],
  loosestLevers: {
    central_vs_edge_N3_R13: { central: 1.243e6, edge: 3.770e2, factor: 3298 },
    N_growth_central_pad: { N3: 280.8, N4: 2.431e4 },
    R_growth_central_pad: { R105: 2.598, R13: 280.8 },
    underfill_pad: { N3_fill1: 4.544e9, N4_fill1: 7.227e17 },
  },
  adjacentOctaveResolutionLimit: {
    note:
      "on true adjacent octaves ({0,1,2},{0,1,2,3}) the exact 1 - sigma^2 " +
      "is ~1e-13..1e-22, below float64 generalized-eig resolution (the eig " +
      "returns small NEGATIVE noise); the fence looseness is only " +
      "lower-bounded by the closed-form padRatio there",
    padRatio012_k0: 3.523e4,
    padRatio0123_k1: 7.407e7,
  },
  onsetCost: [
    { occ: [0, 2, 4], N: 3, R: 1.3, phiHat: 14.27, genie: 10.81, pct: 32.0 },
    { occ: [0, 2, 4], N: 3, R: 1.05, phiHat: 12.08, genie: 10.38, pct: 16.4 },
    { occ: [0, 3, 6], N: 3, R: 1.3, phiHat: 9.292, genie: 8.074, pct: 15.1 },
    { occ: [0, 2, 4, 6], N: 3, R: 1.3, phiHat: 14.69, genie: 11.00, pct: 33.5 },
  ],
  verdict:
    "The LEMMA TAIL-N tail product over-prices the exact leave-one-out " +
    "angle by ~1e2 (edge) to ~1e6 (central) at N=3 R=1.3 and ~1e13 " +
    "(central) at N=4; the pure padding slack (worst-b_n + count-to-N^2) " +
    "is loosest for central blocks, large N, large R and above all " +
    "under-filled octaves (padRatio up to 7e17). On the resolvable spread " +
    "lattices this costs ~15-34% of the SPLIT-LOO onset at N=3 -- the " +
    "deliberate price of coalescence-uniformity. On true adjacent octaves " +
    "the exact angle is below float64 resolution (named honest gap, needs " +
    "extended precision). Measurement only; no bound changed; NO QED; " +
    "no refereed bound is changed.",
  subGap:
    "the exact-angle over-pricing on genuine adjacent octaves (n=1) is " +
    "UNRESOLVABLE at float64 (1 - sigma^2 ~ 1e-13..1e-22); an " +
    "extended-precision generalized-eigensolve is needed to measure the " +
    "true totalRatio there rather than the closed-form padRatio lower " +
    "bound. The imp-95285 EV-OCT-N onsets and PhiUnifN fences are unchanged.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (recompute every reported number)
// ---------------------------------------------------------------------------

export const IMP95310_ASSERTIONS = [
  {
    id: "imp95310-fence-tightness-literals",
    description:
      "per-block padRatio, totalRatio and angDetSlack recompute to the " +
      "reported literals (rel 2e-2), on the float-resolvable spread " +
      "lattices ({0,2,4},{0,3,6}), edge placement",
    holds: () => {
      for (const row of IMP95310_TAILN_LOO_TIGHTNESS.fenceTightness) {
        const t = blockTightness(row.occ, row.ki, row.N, row.R);
        if (!t.resolvable) return false;
        if (Math.abs(t.padRatio - row.padRatio) > 2e-2 * row.padRatio) return false;
        if (Math.abs(t.totalRatio - row.totalRatio) > 2e-2 * row.totalRatio) return false;
        if (Math.abs(t.angDetSlack - row.angDetSlack) > 2e-2 * row.angDetSlack) return false;
      }
      return true;
    },
  },
  {
    id: "imp95310-product-decomposition",
    description:
      "totalRatio = padRatio * angDetSlack exactly (rel 1e-9): the " +
      "over-pricing factors cleanly into the TAIL-N padding slack and the " +
      "ANG-DET ingredient slack",
    holds: () => {
      for (const row of IMP95310_TAILN_LOO_TIGHTNESS.fenceTightness) {
        const t = blockTightness(row.occ, row.ki, row.N, row.R);
        if (Math.abs(t.totalRatio - t.padRatio * t.angDetSlack) > 1e-9 * t.totalRatio)
          return false;
      }
      return true;
    },
  },
  {
    id: "imp95310-phifence-dominates-phihat",
    description:
      "the actual-rate ANG-DET fence phiFence always dominates the padded " +
      "lattice fence phiHat (padRatio >= 1): the tail product never " +
      "over-states the angle",
    holds: () => {
      for (const row of IMP95310_TAILN_LOO_TIGHTNESS.fenceTightness) {
        const t = blockTightness(row.occ, row.ki, row.N, row.R);
        if (!(t.padRatio >= 1)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95310-central-loosest",
    description:
      "central blocks (two nearest n=1 neighbors) are looser than edge " +
      "blocks: totalRatio central >> edge at {0,2,4} N=3 R=1.3, factor > 1e3",
    holds: () => {
      const edge = blockTightness([0, 2, 4], 0, 3, 1.3);
      const central = blockTightness([0, 2, 4], 1, 3, 1.3);
      return central.totalRatio / edge.totalRatio > 1e3;
    },
  },
  {
    id: "imp95310-N-and-R-monotone-pad",
    description:
      "the pure padding slack grows with N (exponent 2 N^2) and with R " +
      "(window widening): central padRatio N=4 > N=3 and R=1.3 > R=1.05",
    holds: () => {
      const cN3 = blockTightness([0, 2, 4], 1, 3, 1.3).padRatio;
      const cN4 = blockTightness([0, 2, 4], 1, 4, 1.3).padRatio;
      const cR105 = blockTightness([0, 2, 4], 1, 3, 1.05).padRatio;
      return cN4 > cN3 && cN3 > cR105;
    },
  },
  {
    id: "imp95310-underfill-explosion",
    description:
      "under-filled octaves are the dominant looseness: fence padded to " +
      "N^2 on a single-rate block gives padRatio 4.5e9 (N=3) and 7.2e17 " +
      "(N=4), recomputed rel 2e-2, and both exceed the full-fill padRatio " +
      "by more than 1e6",
    holds: () => {
      const p3 = padRatioUnderfill([0, 2, 4], 1, 3, 1.3, 1);
      const p4 = padRatioUnderfill([0, 2, 4], 1, 4, 1.3, 1);
      const full3 = blockTightness([0, 2, 4], 1, 3, 1.3).padRatio;
      if (Math.abs(p3 - 4.544e9) > 2e-2 * 4.544e9) return false;
      if (Math.abs(p4 - 7.227e17) > 2e-2 * 7.227e17) return false;
      return p3 / full3 > 1e6;
    },
  },
  {
    id: "imp95310-adjacent-octave-resolution-floor",
    description:
      "on genuine adjacent octaves ({0,1,2}) the exact 1 - sigma^2 is " +
      "below the float64 eig resolution floor (unresolvable), so only the " +
      "closed-form padRatio (3.5e4 at k=0) is available -- the named " +
      "honest gap",
    holds: () => {
      const t = blockTightness([0, 1, 2], 0, 3, 1.3);
      if (t.resolvable) return false; // must be below resolution
      return Math.abs(t.padRatio - 3.523e4) < 2e-2 * 3.523e4;
    },
  },
  {
    id: "imp95310-onset-cost",
    description:
      "swapping the tail fence for the exact edge-placed leave-one-out " +
      "angle lowers the SPLIT-LOO onset by ~15-34% at N=3 on the resolvable " +
      "spread lattices (onset literals recompute rel 2e-2, all positive cost)",
    holds: () => {
      for (const row of IMP95310_TAILN_LOO_TIGHTNESS.onsetCost) {
        const xh = onsetPhiHat(row.occ, row.N, row.R);
        const xg = onsetGenie(row.occ, row.N, row.R);
        if (!(xh > xg)) return false; // tail fence always costs onset
        const pct = (xh / xg - 1) * 100;
        if (Math.abs(xh - row.phiHat) > 2e-2 * row.phiHat) return false;
        if (Math.abs(xg - row.genie) > 2e-2 * row.genie) return false;
        if (Math.abs(pct - row.pct) > 2.0) return false; // within 2 pct points
      }
      return true;
    },
  },
  {
    id: "imp95310-scope-honesty",
    description:
      "verdict and sub-gap carry the honest labels: measurement only, no " +
      "bound changed, adjacent-octave float64 resolution gap named, NO QED, " +
      "no refereed bound is changed",
    holds: () =>
      /Measurement only/.test(IMP95310_TAILN_LOO_TIGHTNESS.verdict) &&
      /no bound changed/.test(IMP95310_TAILN_LOO_TIGHTNESS.verdict) &&
      /NO QED/.test(IMP95310_TAILN_LOO_TIGHTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP95310_TAILN_LOO_TIGHTNESS.verdict) &&
      /UNRESOLVABLE at float64/.test(IMP95310_TAILN_LOO_TIGHTNESS.subGap),
  },
];

for (const a of IMP95310_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95310-tailn-loo-tightness assertion failed: ${a.id}`);
  }
}

export default IMP95310_TAILN_LOO_TIGHTNESS;
