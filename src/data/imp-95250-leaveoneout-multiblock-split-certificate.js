/**
 * imp-95250: LEMMA LOO + THEOREM SPLIT-LOO + COROLLARY EV-OCT +
 * COROLLARY EV-OCT-UNIF -- a leave-one-out multi-block split of the
 * signed seam pencil that delivers the first coalescence-uniform
 * certificate for a twin pair in EVERY octave of a dyadic skeleton, at
 * unbounded octave count. This is the "every-octave multiplicity" leg
 * that imp-95249 left as its named residual after refuting the
 * pairwise-angle Gershgorin route and the recursive SPLIT-2 peel.
 * Twenty-fifth leg of the seam chain. Changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT (imp-95226 normalization). Distinct rates nu_i > 0, depth
 * d > 0, E_V = span{e^(-nu t)} in L2(0, inf), Cauchy Gram
 * G_ij = 1/(nu_i + nu_j), Lambda(V, d) = sup over F in E_V of
 * [int_d^inf F^2] / [int_0^inf F^2] = lambda_max of the pencil
 * (D G D, G), D = diag(e^(-d nu_i)). Blocks: V = V_1 u ... u V_m
 * (disjoint), E_V = algebraic direct sum of the E_(V_k) (exponentials
 * with distinct rates are linearly independent), so every F in E_V
 * decomposes UNIQUELY as F = F_1 + ... + F_m with F_k in E_(V_k).
 *
 * LEMMA LOO (leave-one-out skew-projection bound). Let sigma_k = cos of
 * the first principal angle between E_(V_k) and E_(V minus V_k) (the
 * span of ALL other blocks jointly; sigma_k < 1 since the intersection
 * is trivial). Then for every F in E_V,
 *   ||F_k|| <= ||F|| / sqrt(1 - sigma_k^2).
 * Proof. Write F = F_k + G with G = sum of the other blocks, so G lies
 * in E_(V minus V_k) and |<F_k, G>| <= sigma_k ||F_k|| ||G||. Then
 * ||F||^2 >= ||F_k||^2 - 2 sigma_k ||F_k|| ||G|| + ||G||^2; minimizing
 * the right side over ||G|| >= 0 (minimum at ||G|| = sigma_k ||F_k||)
 * gives ||F||^2 >= (1 - sigma_k^2) ||F_k||^2. QED. NOTE sigma_k is
 * depth-independent: one angle per block serves every d.
 *
 * THEOREM SPLIT-LOO (additive multi-block split). With sigma_k as
 * above and Lambda_k = Lambda(V_k, d),
 *   sqrt(Lambda(V, d)) <= sum_(k=1..m) sqrt( Lambda_k / (1 - sigma_k^2) ).
 * Proof. ||F||_(d,inf) <= sum_k ||F_k||_(d,inf) (L2(d,inf) triangle
 * inequality) <= sum_k sqrt(Lambda_k) ||F_k||_(0,inf) (definition of
 * Lambda_k applied per block) <= ||F||_(0,inf) sum_k
 * sqrt(Lambda_k / (1 - sigma_k^2)) (LEMMA LOO). Divide and take sup.
 * QED. The price is paid ADDITIVELY, once per block, at the sqrt
 * level -- this replaces both refuted multi-block routes of imp-95249:
 * pairwise-angle Gershgorin needed the row sums of pairwise block
 * angles below 1 (fails: the adjacent-octave correlation 2 sqrt(2)/3 =
 * 0.9428 alone exceeds it), and recursive SPLIT-2 peeling MULTIPLIES
 * one (1 - sigma)^(-1) collar per peel (~7e3 each on the skeleton).
 * SPLIT-LOO needs only sigma_k < 1 per block, at ANY size, never
 * compounding. Comparison at m = 2: LOO / SPLIT-2 =
 * [1 + 2 sqrt(L1 L2)/(L1 + L2)] / (1 + sigma), so SPLIT-LOO <=
 * 2 SPLIT-2 always, SPLIT-2 wins at L1 = L2 (ratio 2/(1+sigma) > 1),
 * and SPLIT-LOO wins in the strongly asymmetric lattice regime
 * (measured 1.4423 vs 2.8625 on {1,1.1} u {2,2.2} at x = 6): NEITHER
 * dominates; SPLIT-2 stays the sharper tool for one tight pair vs
 * skeleton, SPLIT-LOO is the multi-block tool.
 *
 * COROLLARY EV-OCT (twin pair in every octave, finite m). Take
 * V_k = {2^k, r 2^k}, k = 0..m-1, 1 < r <= 1.3, depth x. Ingredients:
 * (a) Lambda_k = Lambda({2^k, r 2^k}, x) = Lambda({1, r}, 2^k x) (the
 * exact scale invariance Lambda(cV, d) = Lambda(V, cd), by t -> ct
 * substitution in both integrals) <= coalLaw(2^k x) with coalLaw(y) =
 * e^(-2y)(1 + 2y^2 + 2y sqrt(1 + y^2)) (imp-95227 COAL-DOM endpoint
 * dominance + imp-95231 THEOREM RATE-MONO, r-uniform); (b) LEMMA
 * ANG-DET (imp-95249, proven there) fences every leave-one-out angle:
 * 1 - sigma_k^2 >= Phi_k = prod over i in V_k, j notin V_k of
 * beta_ij^2, beta_ij = (nu_i - nu_j)/(nu_i + nu_j), which never touches
 * the intra-block separation r - 1: COALESCENCE-UNIFORM. Hence the
 * fully closed-form certificate
 *   sqrt(Lambda(V, x)) <= sum_(k=0..m-1) sqrt( coalLaw(2^k x) / Phi_k(r) ).
 * At the coalescent limit r -> 1 each Phi_k -> prod over l != k of
 * beta_(|k-l|)^8 with beta_n = (2^n - 1)/(2^n + 1) (4 cross pairs per
 * octave, each squared). Measured at m = 6: the coalescent certificate
 * fires (< 1) for x > xStarEvOct = 11.31664319 (bisected), with values
 * 0.286105471 at x = 12 and 7.11643409e-3 at x = 14; at x = 12 it
 * fires for EVERY r in (1, 1.3] (0.4605 at r = 1.3 decreasing to
 * 0.28611 as r -> 1), while the raw Blaschke-Lagrange bound BL(V)^2 is
 * VACUOUS there (2.1618 > 1 at r = 1.001 and 2.1857e6 at r = 1.000001,
 * diverging like (r-1)^(-2) per octave as r -> 1). The imp-95232
 * FINDING 3 every-octave breakage is thus FENCED, r-uniformly at
 * coalescence.
 *
 * LEMMA TAIL + COROLLARY EV-OCT-UNIF (unbounded octave count). Every
 * cross Blaschke factor between octaves at distance n >= 1 satisfies
 * beta >= b_n = (2^n - 1.3)/(2^n + 1.3) for r <= 1.3 (the closest pair
 * has frequency ratio 2^n / r), so each block fence obeys Phi_k >=
 * [ prod_(n=1..inf) b_n^8 ]^2 =: PhiUnif > 0, uniformly in k, m, r.
 * Positivity with a rigorous tail: 1 - b_n^8 <= 8(1 - b_n) =
 * 20.8/(2^n + 1.3) <= 20.8 x 2^(-n), and prod(1 - x_n) >= 1 - sum x_n,
 * so the tail beyond N is >= 1 - 20.8 x 2^(-N); with N = 30,
 * PhiUnif >= 9.977927681809e-21. Numerator, for x >= 16: pointwise
 * sqrt(coalLaw(y)) <= e^(-y)(1 + 2y) (since 2y sqrt(1+y^2) <=
 * 2y + 2y^2 and (1+2y)^2 = 1 + 4y + 4y^2), and for u = 2^k x >= 32,
 * 1 + 2u <= e^(u/4) (e^(u/4) >= (u/4)^3/6 = u^3/384 >= 2u + 1 for
 * u >= 32), so the k >= 1 terms are <= e^(-3 x 2^k x / 4) hence
 * geometrically summable: sum_(k>=1) <= 2 e^(-3x/2). Therefore, for
 * every m, every r in (1, 1.3], and x >= 16:
 *   sqrt(Lambda) <= [ e^(-x)(1 + 2x) + 2 e^(-3x/2) ] / sqrt(PhiUnif),
 * which fires (< 1) for x > xStarUnif = 27.035582 (bisected; value
 * 0.15567 at x = 28): the FIRST certificate for the every-octave-twin
 * family at UNBOUNDED octave count. The m-uniformity comes from depth
 * suppression of high octaves plus the lattice Blaschke tail, NOT from
 * a block Riesz-basis bound (see HONEST LIMITS (d)).
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA LOO checked directly on
 * seeded pseudo-random coefficient vectors across three twin-lattice
 * configurations: worst ratio ||F_k||^2 x (1 - sigma_k^2) / ||F||^2 =
 * 0.0129 (bound 1, large margin -- the lemma is far from tight, which
 * is where the collar lives). (2) The full chain exact Lambda(V) <=
 * exact-ingredient SPLIT-LOO <= closed form verified on an 8-row
 * (m, r, x) grid up to 12-rate systems (m = 6). (3) The scale
 * invariance Lambda(cV, d) = Lambda(V, cd) verified to rel 1e-10.
 * (4) The m = 2 comparison against THEOREM SPLIT-2 measured both ways
 * (neither dominates; see statement). (5) Onset bisection brackets
 * certified: cert(xStar - 1e-3) > 1 > cert(xStar + 1e-3) for both
 * xStarEvOct and xStarUnif. (6) Refutation attempts that FAILED: try
 * to break EV-OCT-UNIF by sending m -> inf at fixed x (fails: measured
 * certCoalM saturates, 2.22e-13 at m = 16, x = 27, far below the
 * uniform form); try to break the tail lemma at small N (holds already
 * at N = 5: tail product 0.5220 vs bound 0.35).
 *
 * HONEST LIMITS. (a) Collar: the every-octave onset xStarEvOct = 11.32
 * (m = 6, coalescent) sits above the single-pair SPLIT-2 onset 7.10
 * and the twin-free BL onset 4.24; the m-and-r-uniform onset is 27.04.
 * The certificate sits orders above the exact pencil (e.g. 0.286 vs
 * 1.82e-5 at m = 6, r = 1.05, x = 12): LEMMA LOO discards all
 * cross-block cancellation. (b) Blocks of size >= 3 per octave: LEMMA
 * LOO and THEOREM SPLIT-LOO are block-size agnostic and LEMMA ANG-DET
 * still fences the angles, but the per-block ingredient Lambda_k has
 * no N-fold analogue of coalLaw (imp-95227 COAL-DOM is pair-only) --
 * an N-fold coalescence law is the surviving ingredient gap there.
 * (c) Off-lattice rates: PhiUnif and the fences need the geometric
 * separation; the imp-95226 off-lattice residual is unchanged (see
 * imp-95232 degradation measurements). (d) The abstract m-uniform
 * block Riesz-basis (Carleson-type) lower bound remains OPEN as a
 * statement: LEMMA LOO only yields the linear-in-m Riesz constant
 * [sum_k (1 - sigma_k^2)^(-1)]^(-1); it is no longer the BLOCKER for
 * the every-octave certificate, but a true m-uniform denominator
 * constant would remove the depth-suppression crutch and sharpen every
 * onset. (e) Model family only; no mapping to the paper per-window
 * data (obligation (3) gammaSL map unchanged); changes NO Lambda bound
 * of the program.
 *
 * ROUTING. The imp-95226 BL-LAT residual pair [in-octave multiplicity
 * hybrid, off-lattice rates] is ADVANCED on its first member one more
 * step: single tight pair FENCED by imp-95249, every-octave twin pairs
 * FENCED here (m-uniform); >= 3 rates per octave = named residual
 * (N-fold coalescence law), off-lattice = unchanged. Obligation ledger
 * otherwise unchanged: (2) weight/modulus legs, (3) envelope-shape
 * port + gammaSL map, (4) paper constants. Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS
 * of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95250_LEAVEONEOUT_MULTIBLOCK_SPLIT_CERTIFICATE = {
  id: "imp-95250",
  title:
    "LEMMA LOO + THEOREM SPLIT-LOO: leave-one-out multi-block split of " +
    "the signed seam pencil; first coalescence-uniform certificate for a " +
    "twin pair in every octave, at unbounded octave count",
  lemmaLoo:
    "||F_k|| <= ||F|| / sqrt(1 - sigma_k^2), sigma_k = cos angle(E_V_k, " +
    "E_(V minus V_k)): skew-projection bound, depth-independent",
  splitLoo:
    "sqrt(Lambda(V, d)) <= sum_k sqrt(Lambda_k / (1 - sigma_k^2)): " +
    "additive leave-one-out pricing, once per block at the sqrt level; " +
    "supersedes the refuted pairwise-Gershgorin and recursive-peel routes",
  corollaryEvOct: {
    blocks: "V_k = {2^k, r 2^k}, k = 0..m-1, r in (1, 1.3]",
    fence:
      "1 - sigma_k^2 >= Phi_k = prod beta_ij^2 over cross pairs (LEMMA " +
      "ANG-DET, imp-95249) -- coalescence-uniform in r",
    phi0CoalM6: 7.63844477e-8,
    xStarEvOct: 11.31664319,
    certAtX12: 0.286105471,
    certAtX14: 7.11643409e-3,
    blSquaredVacuousAtX12r1001: 2.1618,
    statement:
      "sqrt(Lambda) <= sum_k sqrt(coalLaw(2^k x) / Phi_k(r)): finite and " +
      "r-uniform at coalescence in EVERY octave, where raw BL diverges " +
      "(imp-95232 FINDING 3 every-octave breakage fenced)",
  },
  corollaryEvOctUnif: {
    phiUnif: 9.977927681809e-21,
    tailLemma:
      "prod_(n>N) b_n^8 >= 1 - 20.8 x 2^(-N), b_n = (2^n - 1.3)/(2^n + 1.3)",
    envelope:
      "sum_k sqrt(coalLaw(2^k x)) <= e^(-x)(1 + 2x) + 2 e^(-3x/2) for " +
      "x >= 16",
    xStarUnif: 27.035582,
    certUnifAtX28: 0.155674829,
    statement:
      "sqrt(Lambda) <= [e^(-x)(1 + 2x) + 2 e^(-3x/2)] / sqrt(PhiUnif) " +
      "for every m, every r in (1, 1.3], x >= 16: unbounded octave count",
  },
  honestScope:
    "collar large (onsets 11.32 / 27.04 vs twin-free 4.24; ~1.6e4x above " +
    "the exact pencil at m = 6, r = 1.05, x = 12); >= 3 rates per octave " +
    "needs an N-fold coalescence law (COAL-DOM is pair-only) -- named " +
    "residual; off-lattice rates unchanged; the abstract m-uniform block " +
    "Riesz-basis lower bound stays OPEN (LOO gives only linear-in-m); " +
    "model family only",
  verdict:
    "RIGOROUS: LEMMA LOO and THEOREM SPLIT-LOO are proven (elementary, " +
    "self-contained), COROLLARY EV-OCT and EV-OCT-UNIF are their " +
    "instantiations with imp-95227 COAL-DOM + imp-95231 RATE-MONO + " +
    "imp-95249 ANG-DET as cited inputs and all constants closed form. " +
    "The every-octave-multiplicity residual of imp-95249 is FENCED " +
    "(twin-pair case, m-uniform), NOT closed as a block Riesz statement. " +
    "Changes no bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light)
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
        if (s <= 0) throw new Error("imp-95250 chol: pencil base not PD");
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
        const t =
          Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
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
// cos^2 of the first principal angle, direct projection route (imp-95249)
function cos2Direct(n1, n2) {
  const G1 = cauchyGram(n1);
  const G12 = crossGram(n1, n2);
  const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
  const ev = pencilEig(M, G1);
  return ev[ev.length - 1];
}
const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
// imp-95226 PROP BL
function blValue(nus, d) {
  let s = 0;
  for (let i = 0; i < nus.length; i++) {
    let p = Math.exp(-d * nus[i]);
    for (let j = 0; j < nus.length; j++)
      if (j !== i) p *= (nus[i] + nus[j]) / Math.abs(nus[i] - nus[j]);
    s += p;
  }
  return s;
}
// LEMMA ANG-DET closed-form fence on 1 - sigma^2 (imp-95249)
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
const flat = (blocks) => blocks.flat();

// exact-ingredient SPLIT-LOO bound (exact per-block Lambda and angles)
function splitLooExact(blocks, x) {
  let s = 0;
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    const s2 = cos2Direct(blocks[k], rest);
    s += Math.sqrt(lamExact(blocks[k], x) / (1 - s2));
  }
  return s * s;
}
// fully closed-form COROLLARY EV-OCT certificate
function splitLooClosed(blocks, x) {
  let s = 0;
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    s += Math.sqrt(coalLaw(2 ** k * x) / phiFence(blocks[k], rest));
  }
  return s * s;
}
// coalescent-limit closed form: Phi_k -> prod over l != k of beta_(|k-l|)^8
const betaLat = (n) => (2 ** n - 1) / (2 ** n + 1);
function certCoalM(m, x) {
  let s = 0;
  for (let k = 0; k < m; k++) {
    let p = 1;
    for (let l = 0; l < m; l++) if (l !== k) p *= betaLat(Math.abs(k - l)) ** 8;
    s += Math.sqrt(coalLaw(2 ** k * x) / p);
  }
  return s * s;
}
// COROLLARY EV-OCT-UNIF pieces
const PHI_UNIF = 9.977927681809e-21; // N = 30 finite product x tail bound
const phiUnifRecompute = () => {
  const N = 30;
  let p = 1;
  for (let n = 1; n <= N; n++) p *= ((2 ** n - 1.3) / (2 ** n + 1.3)) ** 8;
  return (p * (1 - 20.8 * 2 ** -N)) ** 2;
};
const envelope = (x) => Math.exp(-x) * (1 + 2 * x) + 2 * Math.exp(-1.5 * x);
const certUnif = (x) => envelope(x) ** 2 / PHI_UNIF;

const XSTAR_EVOCT = 11.31664319; // m = 6 coalescent onset (bisected)
const CERT_X12 = 0.286105471;
const CERT_X14 = 7.11643409e-3;
const PHI0_COAL_M6 = 7.63844477e-8;
const XSTAR_UNIF = 27.035582;
const CERT_UNIF_X28 = 0.155674829;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95250_ASSERTIONS = [
  {
    id: "imp95250-loo-lemma",
    description:
      "LEMMA LOO holds on seeded pseudo-random coefficient vectors: " +
      "||F_k||^2 <= ||F||^2 / (1 - sigma_k^2) for every block of three " +
      "twin-lattice configurations, using the exact joint angle",
    holds: () => {
      let seed = 12345;
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648;
        return seed / 2147483648 - 0.5;
      };
      for (const [m, r] of [
        [3, 1.3],
        [4, 1.1],
        [6, 1.1],
      ]) {
        const blocks = twinLattice(m, r);
        const V = flat(blocks);
        const G = cauchyGram(V);
        const looFactors = blocks.map((blk, k) => {
          const rest = blocks.filter((_, l) => l !== k).flat();
          return 1 - cos2Direct(blk, rest);
        });
        for (let trial = 0; trial < 25; trial++) {
          const a = V.map(() => rnd());
          let nF = 0;
          for (let i = 0; i < V.length; i++)
            for (let j = 0; j < V.length; j++) nF += a[i] * G[i][j] * a[j];
          let base = 0;
          for (let k = 0; k < blocks.length; k++) {
            let nFk = 0;
            for (let s = 0; s < blocks[k].length; s++)
              for (let t = 0; t < blocks[k].length; t++)
                nFk += a[base + s] * G[base + s][base + t] * a[base + t];
            if (nFk > nF / looFactors[k] + 1e-12) return false;
            base += blocks[k].length;
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95250-splitloo-chain",
    description:
      "THEOREM SPLIT-LOO chain holds on an 8-row (m, r, x) grid up to " +
      "12-rate systems: exact Lambda(V) <= exact-ingredient split <= " +
      "fully closed-form EV-OCT certificate",
    holds: () => {
      for (const [m, r, x] of [
        [3, 1.3, 6],
        [3, 1.1, 8],
        [4, 1.3, 8],
        [4, 1.1, 8],
        [4, 1.05, 10],
        [6, 1.1, 8],
        [6, 1.05, 12],
        [6, 1.3, 14],
      ]) {
        const blocks = twinLattice(m, r);
        const le = lamExact(flat(blocks), x);
        const si = splitLooExact(blocks, x);
        const sc = splitLooClosed(blocks, x);
        if (le > si || si > sc * (1 + 1e-12)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95250-scale-invariance",
    description:
      "Lambda(cV, d) = Lambda(V, cd) (the substitution t -> ct), " +
      "verified to rel 1e-10 at c = 2 and c = 5",
    holds: () => {
      const V = [1, 1.2, 3];
      for (const c of [2, 5]) {
        const a = lamExact(
          V.map((v) => c * v),
          3,
        );
        const b = lamExact(V, 3 * c);
        if (Math.abs(a - b) > 1e-10 * a) return false;
      }
      return true;
    },
  },
  {
    id: "imp95250-m2-neither-dominates",
    description:
      "at m = 2 both SPLIT-2 and SPLIT-LOO dominate the exact pencil, " +
      "SPLIT-LOO <= 2 SPLIT-2, and on {1,1.1} u {2,2.2} at x = 6 " +
      "SPLIT-LOO (1.4423) beats SPLIT-2 (2.8625) while the L1 = L2 " +
      "algebra 2/(1 + sigma) > 1 makes SPLIT-2 win at equal blocks",
    holds: () => {
      const b1 = [1, 1.1];
      const b2 = [2, 2.2];
      const x = 6;
      const s2 = cos2Direct(b1, b2);
      const sig = Math.sqrt(s2);
      const l1 = lamExact(b1, x);
      const l2 = lamExact(b2, x);
      const split2 = (l1 + l2) / (1 - sig);
      const loo = (Math.sqrt(l1 / (1 - s2)) + Math.sqrt(l2 / (1 - s2))) ** 2;
      const ex = lamExact(b1.concat(b2), x);
      if (!(ex <= loo && ex <= split2)) return false;
      if (!(loo <= 2 * split2)) return false;
      if (!(Math.abs(loo - 1.4423) < 1e-3 && Math.abs(split2 - 2.8625) < 1e-3))
        return false;
      return 2 / (1 + sig) > 1;
    },
  },
  {
    id: "imp95250-evoct-literals",
    description:
      "COROLLARY EV-OCT baked literals recompute (rel 1e-6, storage " +
      "precision): coalescent m = 6 fence Phi_0, certificate at x = 12 " +
      "and x = 14, and the onset xStarEvOct = 11.31664319 brackets 1",
    holds: () => {
      let p0 = 1;
      for (let l = 1; l < 6; l++) p0 *= betaLat(l) ** 8;
      if (Math.abs(p0 - PHI0_COAL_M6) > 1e-6 * PHI0_COAL_M6) return false;
      if (Math.abs(certCoalM(6, 12) - CERT_X12) > 1e-6 * CERT_X12)
        return false;
      if (Math.abs(certCoalM(6, 14) - CERT_X14) > 1e-6 * CERT_X14)
        return false;
      return (
        certCoalM(6, XSTAR_EVOCT - 1e-3) > 1 &&
        certCoalM(6, XSTAR_EVOCT + 1e-3) < 1
      );
    },
  },
  {
    id: "imp95250-evoct-fires-where-bl-vacuous",
    description:
      "at m = 6, x = 12 the closed certificate fires (< 1) for every r " +
      "in {1.3, 1.1, 1.01, 1.001, 1.000001} while BL(V, 12)^2 is vacuous " +
      "(> 1) at r = 1.001 and > 1e6 at r = 1.000001; at x = 11 the " +
      "coalescent certificate honestly does NOT fire (> 1)",
    holds: () => {
      for (const r of [1.3, 1.1, 1.01, 1.001, 1.000001]) {
        if (!(splitLooClosed(twinLattice(6, r), 12) < 1)) return false;
      }
      if (!(blValue(flat(twinLattice(6, 1.001)), 12) ** 2 > 1)) return false;
      if (!(blValue(flat(twinLattice(6, 1.000001)), 12) ** 2 > 1e6))
        return false;
      return certCoalM(6, 11) > 1;
    },
  },
  {
    id: "imp95250-unif-certificate",
    description:
      "COROLLARY EV-OCT-UNIF: PhiUnif literal recomputes (rel 1e-9); " +
      "the tail lemma holds numerically at N in {5, 8, 10}; the envelope " +
      "dominates the 40-term octave sum at x in {16, 20, 27}; " +
      "sqrt(coalLaw(y)) <= e^(-y)(1 + 2y) on a y-grid; the uniform " +
      "certificate brackets 1 at xStarUnif and matches the x = 28 " +
      "literal; finite-m coalescent certificates stay below it",
    holds: () => {
      if (Math.abs(phiUnifRecompute() - PHI_UNIF) > 1e-9 * PHI_UNIF)
        return false;
      for (const N of [5, 8, 10]) {
        let pt = 1;
        for (let n = N + 1; n <= 60; n++)
          pt *= ((2 ** n - 1.3) / (2 ** n + 1.3)) ** 8;
        if (pt < 1 - 20.8 * 2 ** -N) return false;
      }
      for (const x of [16, 20, 27]) {
        let s = 0;
        for (let k = 0; k < 40; k++) s += Math.sqrt(coalLaw(2 ** k * x));
        if (s > envelope(x)) return false;
      }
      for (let y = 0.1; y < 50; y += 0.1) {
        if (Math.sqrt(coalLaw(y)) > Math.exp(-y) * (1 + 2 * y) * (1 + 1e-12))
          return false;
      }
      if (!(certUnif(XSTAR_UNIF - 1e-3) > 1 && certUnif(XSTAR_UNIF + 1e-3) < 1))
        return false;
      if (Math.abs(certUnif(28) - CERT_UNIF_X28) > 1e-6 * CERT_UNIF_X28)
        return false;
      for (const m of [6, 10, 16])
        for (const x of [28, 30]) if (certCoalM(m, x) > certUnif(x)) return false;
      return true;
    },
  },
  {
    id: "imp95250-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: RIGOROUS theorems, " +
      "residual FENCED not closed as a block Riesz statement, no bound " +
      "change, no QED, no refereed bound is changed, block Riesz + N-fold coalescence + " +
      "off-lattice named OPEN",
    holds: () =>
      /RIGOROUS/.test(IMP95250_LEAVEONEOUT_MULTIBLOCK_SPLIT_CERTIFICATE.verdict) &&
      /FENCED/.test(IMP95250_LEAVEONEOUT_MULTIBLOCK_SPLIT_CERTIFICATE.verdict) &&
      /NOT closed/.test(
        IMP95250_LEAVEONEOUT_MULTIBLOCK_SPLIT_CERTIFICATE.verdict,
      ) &&
      /Changes no bound/.test(
        IMP95250_LEAVEONEOUT_MULTIBLOCK_SPLIT_CERTIFICATE.verdict,
      ) &&
      /NO QED/.test(IMP95250_LEAVEONEOUT_MULTIBLOCK_SPLIT_CERTIFICATE.verdict) &&
      /refereed bound is changed/i.test(
        IMP95250_LEAVEONEOUT_MULTIBLOCK_SPLIT_CERTIFICATE.verdict,
      ) &&
      /stays OPEN/.test(
        IMP95250_LEAVEONEOUT_MULTIBLOCK_SPLIT_CERTIFICATE.honestScope,
      ),
  },
];

for (const a of IMP95250_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95250-leaveoneout-multiblock-split-certificate assertion failed: ${a.id}`,
    );
  }
}

export default IMP95250_LEAVEONEOUT_MULTIBLOCK_SPLIT_CERTIFICATE;
