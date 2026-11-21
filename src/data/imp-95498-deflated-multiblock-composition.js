/**
 * imp-95498: THEOREM DEFL-ORTH-N + THEOREM SPLIT-DEFL-N -- the deflated
 * MULTI-BLOCK composition, executing the named residual of imp-95446
 * ("deflated multi-block composition: every-octave still routes through
 * collared SPLIT-LOO/SPLIT-RZ"). The two-block orthogonal deflation of
 * imp-95446 iterates into an EXACT orthogonal m-block decomposition, and
 * the resulting sandwich is COLLAR-FREE at every m: no principal-angle
 * denominator appears anywhere. On the every-octave dyadic twin lattice
 * the certificate is m-UNIFORM (the deflated sum converges as m grows)
 * with measured firing onset x* = 3.5586 at m = 16 vs the exact-ingredient
 * SPLIT-LOO onset 8.8747 already at m = 6 (and unbounded-m SPLIT-LOO
 * onsets sit at 27.04 / RZ-PEN-improved 12.8-16.0 in the closed-form
 * uniform currency -- a different, weaker-ingredient currency; see HONEST
 * LIMITS (e)). Derivation + measurement; changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT (imp-95226 / imp-95249 / imp-95446 normalization). Pairwise
 * disjoint finite rate blocks V_1, ..., V_m of positive reals,
 * E_V = span{e^(-nu t)} in L2(0, inf), Cauchy Gram G_ij = 1/(nu_i + nu_j),
 * depth d > 0, Lambda(V, d) = sup over F in E_V of
 * [int_d^inf F^2] / [int_0^inf F^2]. For a rate set U, B_U(s) =
 * prod_(mu in U) (s - mu)/(s + mu) is its Blaschke product (inner in the
 * right-half-plane Hardy space H^2; |B_U| = 1 on the axis, so
 * multiplication by B_U is an H^2 isometry).
 *
 * THEOREM DEFL-ORTH-N (iterated exact orthogonal decomposition). Set
 * U_k = union of V_j for j > k (so U_m is empty, B_(U_m) = 1). Then
 *   E_(V_1 u ... u V_m) = (+perp over k = 1..m) W_k,
 *   W_k = B_(U_k) E_(V_k),
 * an ORTHOGONAL direct sum, and each restriction map is a Gram isometry:
 * the Gram of {B_(U_k) K_nu : nu in V_k} equals the Cauchy Gram G_k of
 * V_k exactly.
 * Proof. (1) W_k is inside the union span: the TWO-block LEMMA DEFL-ORTH
 * of imp-95446 applied to the pair (V_k, U_k) (disjoint by hypothesis)
 * gives E_(V_k u U_k) = E_(U_k) (+perp) B_(U_k) E_(V_k), so W_k is a
 * subspace of E_(V_k u U_k), hence of the union span. (2) Orthogonality
 * for k < l: B_(U_k) = B_(U_l) B_(V_l) P with P the (inner) Blaschke
 * product of the blocks strictly between l and k, so W_k is inside
 * B_(U_l) B_(V_l) H^2; since E_(V_l) is the model space H^2 (-) B_(V_l) H^2
 * (imp-95446 DEFL-ORTH (i)) and multiplication by B_(U_l) is an isometry,
 * W_l = B_(U_l) E_(V_l) is orthogonal to B_(U_l) B_(V_l) H^2, which
 * contains W_k. (3) Spanning: multiplication by an inner function is
 * injective, so dim W_k = |V_k|; the W_k are pairwise orthogonal
 * subspaces of the union span whose dimensions add to its dimension, so
 * the sum is the whole span. (4) Isometry: |B_(U_k)| = 1 a.e. on the
 * axis, so the H^2 inner products of {B_(U_k) K_nu} equal those of
 * {K_nu}, i.e. the Cauchy Gram G_k. QED.
 *
 * THEOREM SPLIT-DEFL-N (collar-free m-block sandwich). Define the k-th
 * DEFLATED constant LambdaPerp_k = sup over 0 != h in W_k of
 * [int_d^inf h^2] / [int_0^inf h^2] = lambda_max(T_k, G_k), where T_k is
 * the tail Gram of the deflated basis -- EXACTLY the two-block imp-95446
 * deflated pencil of V_k against U_k, with the same closed-form entries
 * (partial fractions: g_i(t) = e^(-nu_i t)/B_(U_k)(nu_i) +
 * sum_(mu in U_k) [rho_mu/(nu_i - mu)] e^(-mu t), rho_mu the residue of
 * B_(U_k) at -mu). Note LambdaPerp_m = Lambda(V_m, d). Then
 *   max_k LambdaPerp_k <= Lambda(V_1 u ... u V_m, d)
 *                      <= sum_(k=1..m) LambdaPerp_k .
 * Proof. Upper: F = sum F_k with F_k in W_k (DEFL-ORTH-N); the L2(d, inf)
 * triangle inequality gives ||F||_(d,inf) <= sum ||F_k||_(d,inf) <=
 * sum sqrt(LambdaPerp_k) ||F_k||; Cauchy-Schwarz then exact Pythagoras
 * (sum ||F_k||^2 = ||F||^2) give ||F||_(d,inf)^2 <= (sum LambdaPerp_k)
 * ||F||^2. Lower: each W_k is a subspace of the union span, so each
 * ratio-sup LambdaPerp_k is <= Lambda. QED.
 * COLLAR-FREE: no principal angle appears; each LambdaPerp_k <= 1
 * unconditionally (tail integral <= full integral), so the upper bound
 * never exceeds m and stays finite uniformly in ALL inter-block gaps --
 * where every collared certificate (SPLIT-2, SPLIT-LOO, SPLIT-RZ,
 * DIRECT-2/SPLIT-Q) diverges. The m = 2 case is verbatim imp-95446
 * THEOREM SPLIT-DEFL. The bound holds for EVERY ordering of the blocks
 * (m! valid certificates; take the min).
 *
 * MEASURED (cross-checks of the proven statements, never the claim).
 *  (A) DECOMPOSITION AT THE MATRIX LEVEL (m = 3): worst normalized
 *      cross-block inner product 1.6e-11 on {1,1.1}u{2,2.2}u{4,4.4};
 *      worst Gram-isometry relative error 8.3e-7 across the sandwich grid
 *      (float partial-fraction cancellation, see HONEST LIMITS (c)).
 *  (B) SANDWICH (m = 3, 15-point grid over x in {1,2,3,6,10}, spacing
 *      s in {1.2,2,5}): max_k LambdaPerp_k <= exact <= sum everywhere;
 *      worst sum/exact = 2.485 -- BOUNDED, vs the collared certificates
 *      whose looseness is unbounded on the same family.
 *  (C) NEARBY-CLUSTER WEDGE AT m = 3 (three mutually close twin blocks,
 *      offsets 2e/e/0, x = 6): at e = 0.4, sum/exact = 1.0065 while
 *      exact-ingredient SPLIT-LOO/exact = 1.70e5; at e = 0.2 SPLIT-LOO
 *      is not even float-computable (rest-Gram Cholesky fails) while
 *      SPLIT-DEFL-N evaluates to 1.0165x of exact.
 *  (D) ORDERING: all m! orderings are valid; deflating LOW rates against
 *      HIGH (ascending blocks, U_k = higher blocks) is tightest on the
 *      dyadic lattice: at m = 3, x = 6 the six orderings give
 *      sum/exact in [1.0000012, 1.000631].
 *  (E) EVERY-OCTAVE m-UNIFORMITY (dyadic twin lattice, r = 1.1): firing
 *      onsets (sum < 1) x* = 1.7040 / 2.6112 / 3.4394 / 3.5289 / 3.5586
 *      at m = 2/3/6/8/16, CONVERGING in m (the deflated sum converges:
 *      sum at x = 6 is 2.1215e-1 at m = 12 vs 2.1257e-1 at m = 16),
 *      vs exact-ingredient SPLIT-LOO onsets 6.2065 (m = 2) and 8.8747
 *      (m = 6), still growing in m. The deflated composition fires
 *      ~2.6x earlier at m = 6 and stays finite as m -> inf.
 *  (F) WIDE-SEPARATION COLLAPSE: at m = 4, r = 1.5 lattice, x = 8 the
 *      certificate is exact to 7.6e-9 relative (sum/exact - 1).
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Attempted refutation of the
 * orthogonality claim W_k perp W_l via direct closed-form inner products
 * of the partial-fraction bases: worst normalized cosine 1.6e-11 (clean
 * configs) -- the decomposition is real, not an artifact of the pencil
 * solver. (2) Attempted refutation of the upper bound at near-coalescent
 * multi-block configs: at 3 mutually-close blocks the bound HOLDS but
 * WIDENS (1.70x at e = 1e-2), and below e ~ 1e-3 the float evaluation
 * (not the theorem) breaks down by residue cancellation -- detectable,
 * since any computed LambdaPerp_k > 1 contradicts the PROVEN cap <= 1
 * (at offsets 2e-3/1e-3/0 the first computed perp is 44.7: flagged
 * breakdown, not a bound). (3) A duplicated rate across blocks (violating
 * pairwise disjointness) makes the partial fraction divide by zero --
 * hypothesis, not bug. (4) The m = 2 reduction reproduces the imp-95446
 * wedge literal: sum = 1.5063567e-1 vs the baked 1.506357e-1 at
 * e = 1e-3, x = 6.
 *
 * HONEST LIMITS. (a) The theorem is a composition device: it reduces the
 * m-block constant to m two-block deflated pencils (single-shell
 * objects), but each LambdaPerp_k is still a numerically-solved |V_k| x
 * |V_k| pencil with closed-form ENTRIES -- the coalescence-uniform
 * closed-form MAJORANT of LambdaPerp (Laguerre-type, imp-95251 COAL-N
 * style) is NOT derived here and stays the surviving residual, inherited
 * from imp-95446 (b). (b) The sum's width (sum - max) can reach ~2.5x on
 * mutually-close 3-block configs -- bounded, but not sharp. (c) Float
 * evaluation degrades near inter-block coalescence (residues ~ 1/gap);
 * the PROOFS are exact and the breakdown is self-detecting via the
 * LambdaPerp <= 1 cap. (d) Model family only (exponential-rate blocks,
 * Cauchy Gram); no mapping to paper per-window data; changes NO Lambda
 * bound of the program. (e) The onset comparison vs SPLIT-LOO uses the
 * exact-ingredient variants of BOTH certificates; the closed-form
 * m-and-r-uniform chains (EV-OCT 27.04, RZ-PEN 12.8-16.0) are a
 * different currency (fully closed-form uniform majorants) and are NOT
 * superseded until residual (a) is closed. (f) x* onset literals are
 * 60-step bisections of float evaluations; asserted with 5e-3 absolute
 * tolerances.
 *
 * ROUTING. Executes the imp-95446 NAMED RESIDUAL (deflated multi-block
 * composition). Pairs with the concurrently-delivered sibling imp-95485
 * (nblock-direct-collar-vacuity), which proved the COLLARED N-block
 * DIRECT reduction is VACUOUS for N >= 3 (the worst-case angle Gram
 * M = I - Sigma is generically indefinite, so no finite collared N-block
 * bound exists): the collared route is dead at N >= 3, and THIS module
 * supplies the escape -- the DEFLATED N-block composition is collar-free
 * and bounded at every m, the multi-block analogue of the imp-95426 /
 * imp-95446 pairing at m = 2. The sibling statement "the wedge closes
 * only with the full joint pencil" concerns EXACT closure; SPLIT-DEFL-N
 * is a bounded-looseness certificate (width sum - max), not exact. The
 * every-octave certificate chain (imp-95250 SPLIT-LOO, imp-95252
 * SPLIT-RZ, imp-95285 EV-OCT-N) is NOT retired: it remains the
 * closed-form uniform currency until the LambdaPerp majorant exists.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS
 * of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95498_DEFLATED_MULTIBLOCK_COMPOSITION = {
  id: "imp-95498",
  title:
    "THEOREM DEFL-ORTH-N + THEOREM SPLIT-DEFL-N: iterated exact orthogonal " +
    "deflation of the m-block seam; collar-free sandwich max_k LambdaPerp_k " +
    "<= Lambda <= sum_k LambdaPerp_k; m-uniform on the every-octave lattice",
  deflOrthN:
    "E_(V_1 u ... u V_m) = (+perp)_k B_(U_k) E_(V_k), U_k = union of later " +
    "blocks; multiplication by the inner B_(U_k) is a Gram isometry, so each " +
    "deflated block keeps its Cauchy Gram G_k exactly",
  splitDeflN:
    "max_k LambdaPerp_k <= Lambda(union, d) <= sum_k LambdaPerp_k with " +
    "LambdaPerp_k = lambda_max(T_k, G_k) the imp-95446 two-block deflated " +
    "pencil of V_k against U_k; LambdaPerp_k <= 1 unconditionally: NO " +
    "angular collar at any m, finite uniformly in every inter-block gap",
  everyOctave: {
    claim:
      "m-UNIFORM collar-free firing on the dyadic twin lattice (r = 1.1): " +
      "deflated onsets converge in m while exact-ingredient SPLIT-LOO " +
      "onsets keep growing",
    onsetDeflByM: {
      m2: 1.703993484769972,
      m3: 2.611248068870514,
      m6: 3.439423092053575,
      m8: 3.5289,
      m16: 3.558610629153877,
    },
    onsetSplitLooM2: 6.206545839579734,
    onsetSplitLooM6: 8.8746939369166,
    sumAtX6: { m12: 0.2121511199449444, m16: 0.2125724361563681 },
  },
  wedgeM3: {
    config: "twin blocks at offsets 2e/e/0 from {1,1.1}, x = 6",
    e0p4: { exact: 0.4478976054536251, deflN: 0.4508229831364732, looOverExact: 170123.06979236452 },
    note:
      "at e = 0.2 SPLIT-LOO is not float-computable (rest-Gram Cholesky " +
      "fails) while SPLIT-DEFL-N gives 1.0165x of exact",
  },
  ordering:
    "valid for every ordering (m! certificates); ascending rate blocks " +
    "(deflate low against high) tightest on the dyadic lattice: m = 3 x = 6 " +
    "orderings span sum/exact in [1.0000012, 1.000631]",
  wideSeparation: {
    config: "m = 4 lattice r = 1.5, x = 8",
    exact: 9.974148170427595e-4,
    sum: 9.974148245911825e-4,
  },
  m2Reduction: {
    config: "V1 = {1+1e-3, 1.1+1e-3} vs V2 = {1, 1.1}, x = 6",
    sum: 0.1506356669723913,
    imp95446Literal: 0.1506357,
  },
  residual:
    "coalescence-uniform closed-form MAJORANT of LambdaPerp (Laguerre-type) " +
    "not derived -- inherited from imp-95446 (b); until it exists the " +
    "closed-form uniform chains (EV-OCT / RZ-PEN) keep the m-and-r-uniform " +
    "currency; sum width (sum - max) reaches ~2.5x on mutually-close blocks",
  honestScope:
    "derivation + measurement; model family only; exact-ingredient currency " +
    "(numerically-solved 2x2 pencils with closed-form entries); float " +
    "evaluation self-detects near-coalescent breakdown via the proven " +
    "LambdaPerp <= 1 cap; changes no bound; NO QED; no refereed bound is changed" +
    "",
  verdict:
    "DERIVATION + MEASUREMENT: the imp-95446 two-block deflation iterates " +
    "into an exact orthogonal m-block decomposition (THEOREM DEFL-ORTH-N), " +
    "giving the collar-free sandwich max_k LambdaPerp_k <= Lambda <= sum_k " +
    "LambdaPerp_k (THEOREM SPLIT-DEFL-N) -- the deflated MULTI-BLOCK " +
    "composition named as the surviving residual by imp-95446. No principal " +
    "angle appears at any m; on the every-octave dyadic lattice the " +
    "certificate is m-uniform with onset x* = 3.5586 at m = 16 vs " +
    "exact-ingredient SPLIT-LOO 8.8747 at m = 6, and it stays within 2.5x " +
    "of exact where every collared certificate diverges. The closed-form " +
    "LambdaPerp majorant stays open. Changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (import-light; mirrors imp-95426/95446)
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
        if (s <= 0) throw new Error("imp-95498 chol: pencil base not PD");
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
  for (let sweep = 0; sweep < 300; sweep++) {
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
const lamExact = (nus, d) => {
  const G = cauchyGram(nus);
  const DGD = G.map((row, i) =>
    row.map((g, j) => g * Math.exp(-d * (nus[i] + nus[j]))),
  );
  const ev = pencilEig(DGD, G);
  return ev[ev.length - 1];
};
function cos2Direct(n1, n2) {
  const G1 = cauchyGram(n1);
  const G12 = crossGram(n1, n2);
  const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
  const ev = pencilEig(M, G1);
  return ev[ev.length - 1];
}

// Deflated basis of block rate nu_i against pole set U (partial fractions of
// B_U(s)/(s + nu_i); imp-95446 LEMMA DEFL-ORTH closed form)
const blaschkeAt = (U, nu) => U.reduce((p, m) => (p * (nu - m)) / (nu + m), 1);
const residueAt = (U, m) =>
  -2 *
  U[m] *
  U.reduce((p, x, l) => (l === m ? p : (p * (U[m] + x)) / (U[m] - x)), 1);
function deflCoeffs(nuI, U) {
  const c = new Map();
  c.set(nuI, 1 / blaschkeAt(U, nuI));
  for (let m = 0; m < U.length; m++) c.set(U[m], residueAt(U, m) / (nuI - U[m]));
  return c;
}
// int_d^inf of the product of two exponential-sum coefficient maps
function innerTail(c1, c2, d) {
  let s = 0;
  for (const [p, cp] of c1)
    for (const [q, cq] of c2) s += (cp * cq * Math.exp(-d * (p + q))) / (p + q);
  return s;
}
// LambdaPerp of block V deflated against U at depth d
function lamPerp(V, U, d) {
  if (U.length === 0) return lamExact(V, d);
  const coeffs = V.map((nu) => deflCoeffs(nu, U));
  const n = V.length;
  const T = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) T[i][j] = innerTail(coeffs[i], coeffs[j], d);
  const ev = pencilEig(T, cauchyGram(V));
  return ev[ev.length - 1];
}
// THEOREM SPLIT-DEFL-N certificate for blocks in the given order
function splitDeflN(blocks, d) {
  let sum = 0;
  let mx = 0;
  const perps = [];
  for (let k = 0; k < blocks.length; k++) {
    const lam = lamPerp(blocks[k], blocks.slice(k + 1).flat(), d);
    perps.push(lam);
    sum += lam;
    mx = Math.max(mx, lam);
  }
  return { sum, mx, perps };
}
// exact-ingredient SPLIT-LOO (imp-95250) for comparison
function splitLooExact(blocks, x) {
  let s = 0;
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    const s2 = cos2Direct(blocks[k], rest);
    s += Math.sqrt(lamExact(blocks[k], x) / (1 - s2));
  }
  return s * s;
}
const twinLattice = (m, r = 1.1) => {
  const blocks = [];
  for (let k = 0; k < m; k++) blocks.push([2 ** k, r * 2 ** k]);
  return blocks;
};
function onset(fn, lo = 0.01, hi = 60) {
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (fn(mid) < 1) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}
// worst normalized cross-block inner product of the full deflated bases
function orthWorstCos(blocks) {
  const bases = blocks.map((V, k) => {
    const U = blocks.slice(k + 1).flat();
    return V.map((nu) => (U.length ? deflCoeffs(nu, U) : new Map([[nu, 1]])));
  });
  let worst = 0;
  for (let k = 0; k < blocks.length; k++)
    for (let l = k + 1; l < blocks.length; l++)
      for (const c1 of bases[k])
        for (const c2 of bases[l]) {
          const ip = innerTail(c1, c2, 0);
          const n1 = Math.sqrt(innerTail(c1, c1, 0));
          const n2 = Math.sqrt(innerTail(c2, c2, 0));
          worst = Math.max(worst, Math.abs(ip) / (n1 * n2));
        }
  return worst;
}

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95498_ASSERTIONS = [
  {
    id: "imp95498-defl-orth-n-matrix-level",
    description:
      "THEOREM DEFL-ORTH-N at the matrix level (m = 3 dyadic twins): every " +
      "cross-block normalized inner product of the deflated bases is < 1e-8, " +
      "and the deflated full Gram of each block matches its Cauchy Gram " +
      "(isometry) to rel 1e-8",
    holds: () => {
      const blocks = [
        [1, 1.1],
        [2, 2.2],
        [4, 4.4],
      ];
      if (orthWorstCos(blocks) >= 1e-8) return false;
      for (let k = 0; k < blocks.length - 1; k++) {
        const U = blocks.slice(k + 1).flat();
        const coeffs = blocks[k].map((nu) => deflCoeffs(nu, U));
        const GC = cauchyGram(blocks[k]);
        for (let i = 0; i < blocks[k].length; i++)
          for (let j = 0; j < blocks[k].length; j++) {
            const g = innerTail(coeffs[i], coeffs[j], 0);
            if (Math.abs(g - GC[i][j]) > 1e-8 * Math.abs(GC[i][j])) return false;
          }
      }
      return true;
    },
  },
  {
    id: "imp95498-sandwich-m3-grid",
    description:
      "THEOREM SPLIT-DEFL-N sandwich on the 15-point m = 3 grid (x in " +
      "{1,2,3,6,10}, spacing s in {1.2,2,5}): max_k LambdaPerp_k <= exact " +
      "joint pencil <= sum_k LambdaPerp_k, and every LambdaPerp_k <= 1",
    holds: () => {
      for (const x of [1, 2, 3, 6, 10])
        for (const s of [1.2, 2, 5]) {
          const blocks = [
            [1, 1.1],
            [s, s * 1.1],
            [s * s, s * s * 1.1],
          ];
          const ex = lamExact(blocks.flat(), x);
          const { sum, mx, perps } = splitDeflN(blocks, x);
          if (!(mx <= ex * (1 + 1e-6))) return false;
          if (!(ex <= sum * (1 + 1e-9))) return false;
          if (!perps.every((p) => p <= 1 + 1e-9)) return false;
        }
      return true;
    },
  },
  {
    id: "imp95498-m2-reduces-to-imp95446",
    description:
      "the m = 2 case reproduces imp-95446 THEOREM SPLIT-DEFL: on the wedge " +
      "config {1+1e-3, 1.1+1e-3} vs {1, 1.1} at x = 6 the deflated sum " +
      "matches the imp-95446 literal 1.506357e-1 (rel 1e-4; near-coalescent " +
      "float tolerance per imp-95446)",
    holds: () => {
      const { sum } = splitDeflN(
        [
          [1 + 1e-3, 1.1 + 1e-3],
          [1, 1.1],
        ],
        6,
      );
      return Math.abs(sum - 0.1506357) < 1e-4 * 0.1506357;
    },
  },
  {
    id: "imp95498-collar-free-wedge-m3",
    description:
      "collar-free where the collared certificates diverge: 3 mutually close " +
      "twin blocks (offsets 0.8/0.4/0 from {1,1.1}, x = 6) give sum/exact " +
      "< 1.01 while exact-ingredient SPLIT-LOO/exact > 1e4",
    holds: () => {
      const e = 0.4;
      const blocks = [
        [1 + 2 * e, 1.1 + 2 * e],
        [1 + e, 1.1 + e],
        [1, 1.1],
      ];
      const ex = lamExact(blocks.flat(), 6);
      const { sum } = splitDeflN(blocks, 6);
      const loo = splitLooExact(blocks, 6);
      return sum / ex < 1.01 && sum >= ex && loo / ex > 1e4;
    },
  },
  {
    id: "imp95498-every-octave-m-uniform-onsets",
    description:
      "m-uniform every-octave firing (dyadic twins r = 1.1): deflated onsets " +
      "1.7040 (m=2), 3.4394 (m=6), 3.5586 (m=16) each abs 5e-3, converging " +
      "in m (m16 - m6 < 0.2), vs exact-ingredient SPLIT-LOO 8.8747 at m = 6",
    holds: () => {
      const x2 = onset((x) => splitDeflN(twinLattice(2), x).sum);
      const x6 = onset((x) => splitDeflN(twinLattice(6), x).sum);
      const x16 = onset((x) => splitDeflN(twinLattice(16), x).sum);
      const loo6 = onset((x) => splitLooExact(twinLattice(6), x));
      return (
        Math.abs(x2 - 1.703993484769972) < 5e-3 &&
        Math.abs(x6 - 3.439423092053575) < 5e-3 &&
        Math.abs(x16 - 3.558610629153877) < 5e-3 &&
        Math.abs(loo6 - 8.8746939369166) < 5e-3 &&
        x16 > x6 &&
        x16 - x6 < 0.2 &&
        loo6 / x6 > 2.5
      );
    },
  },
  {
    id: "imp95498-ordering-and-wide-separation",
    description:
      "ascending-rate ordering is near-exact on the m = 3 dyadic lattice at " +
      "x = 6 (sum/exact < 1 + 1e-5) and every ordering stays valid (reverse " +
      "ordering also admissible, sum/exact < 1.001); wide separation m = 4 " +
      "r = 1.5 x = 8 collapses to exact within rel 1e-6",
    holds: () => {
      const B = [
        [1, 1.1],
        [2, 2.2],
        [4, 4.4],
      ];
      const ex = lamExact(B.flat(), 6);
      const fwdSum = splitDeflN(B, 6).sum;
      const revSum = splitDeflN(B.slice().reverse(), 6).sum;
      const W = twinLattice(4, 1.5);
      const exW = lamExact(W.flat(), 8);
      const sumW = splitDeflN(W, 8).sum;
      return (
        fwdSum >= ex &&
        fwdSum / ex < 1 + 1e-5 &&
        revSum >= ex &&
        revSum / ex < 1.001 &&
        sumW >= exW &&
        sumW / exW < 1 + 1e-6
      );
    },
  },
  {
    id: "imp95498-breakdown-self-detecting",
    description:
      "the near-coalescent float breakdown is self-detecting: at inter-block " +
      "offsets 2e-3/1e-3/0 the computed first LambdaPerp exceeds the PROVEN " +
      "cap 1 (flagging residue cancellation), while clean configs stay <= 1",
    holds: () => {
      const dirty = splitDeflN(
        [
          [1.002, 1.102],
          [1.001, 1.101],
          [1, 1.1],
        ],
        6,
      );
      const clean = splitDeflN(
        [
          [1, 1.1],
          [2, 2.2],
          [4, 4.4],
        ],
        6,
      );
      return dirty.perps.some((p) => p > 1) && clean.perps.every((p) => p <= 1);
    },
  },
  {
    id: "imp95498-verdict-honesty",
    description:
      "verdict and scope carry the honest labels: DERIVATION + MEASUREMENT, " +
      "collar-free sandwich, LambdaPerp majorant stays open, no bound change, " +
      "NO QED, no refereed bound is changed",
    holds: () =>
      /DERIVATION \+ MEASUREMENT/.test(
        IMP95498_DEFLATED_MULTIBLOCK_COMPOSITION.verdict,
      ) &&
      /collar-free sandwich/.test(
        IMP95498_DEFLATED_MULTIBLOCK_COMPOSITION.verdict,
      ) &&
      /majorant stays open/.test(
        IMP95498_DEFLATED_MULTIBLOCK_COMPOSITION.verdict,
      ) &&
      /Changes no bound/.test(IMP95498_DEFLATED_MULTIBLOCK_COMPOSITION.verdict) &&
      /NO QED/.test(IMP95498_DEFLATED_MULTIBLOCK_COMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP95498_DEFLATED_MULTIBLOCK_COMPOSITION.verdict),
  },
];

for (const a of IMP95498_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95498-deflated-multiblock-composition assertion failed: ${a.id}`,
    );
  }
}

export default IMP95498_DEFLATED_MULTIBLOCK_COMPOSITION;
