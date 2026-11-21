/**
 * imp-95507: THEOREM MT-BRACKET + THEOREM SLOW-PREFIX + LEMMA X-ELEM +
 * COROLLARY ONSET-PIN -- executes the imp-95506 named successor ("re-price
 * the imp-95501 SORT-OPT / imp-95500 TILT-EIG onset ladder with the exact
 * x_max(L_K)/(2 min P) cap in place of the Gershgorin and 2K/nu caps") and
 * adds the missing LOWER direction: the mean-time top eigenvalue is pinned
 * TWO-SIDEDLY between the coalescent values at the extreme rates,
 *   x_max(L_K) / (2 max P)  <  mu_max(P)  <  x_max(L_K) / (2 min P),
 * both ends sharp, so the TILT-SORT firing onset (= mu_max, imp-95501
 * LEMMA ONSET) is priced to relative width max P / min P -- an exact
 * two-sided pricing for clustered rate sets. Model family only; changes no
 * Lambda bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95501 / imp-95506 normalization). Distinct positive rates
 * P = (p_1 < ... < p_K), E_P = span{ e^(-p_k t) } in L2(0, inf), mean-time
 * pencil (G o G, G) with Cauchy Gram G_ij = 1/(p_i + p_j); top generalized
 * eigenvalue mu_max(P) = sup over 0 != h in E_P of int t h^2 / int h^2.
 * x_max(L_K) = largest zero of the Laguerre polynomial L_K = top eigenvalue
 * of the K x K Jacobi block (diag 2k+1, off-diag -(k+1)). Consumed inputs:
 * THEOREM MT-MONO (imp-95506: d mu_m / d p_k < 0 for every eigenvalue and
 * every rate), THEOREM CONF-DOM-K (imp-95506: the upper end of the bracket,
 * with the Hermite-Genocchi divided-difference continuity of the pencil
 * into the coalescent corner), LEMMA OSC (imp-95506: the top eigenfunction
 * has all K coefficients nonzero), LEMMA ONSET (imp-95501: the credited
 * majorant family fires iff d > tau - c, so onset(TILT-SORT) = mu_max(P)),
 * and the scaling identity mu_max(lambda P) = mu_max(P) / lambda.
 *
 * THEOREM MT-BRACKET (two-sided sharp coalescent bracket). For every K >= 1
 * and distinct positive rates P:
 *   x_max(L_K) / (2 p_K)  <  mu_max(P)  <  x_max(L_K) / (2 p_1)
 * (K = 1: both ends equal 1/(2 p_1) = mu exactly). The upper end is
 * imp-95506 THEOREM CONF-DOM-K. The lower end is NEW. PROOF (lower). Take
 * the ascending affine path Q(s) = (1 - s) P + s (p_K, ..., p_K), s in
 * [0, 1). Rates stay distinct (differences scale by 1 - s) and each
 * coordinate is nondecreasing in s (dq_k/ds = p_K - p_k >= 0, > 0 for
 * k < K). mu_max(Q(s)) is smooth (simple top eigenvalue, LEMMA OSC) with
 *   d/ds mu_max = sum_k (p_K - p_k) (d mu_max / d p_k) < 0
 * strictly for K >= 2: every partial is strictly negative (THEOREM MT-MONO)
 * and at least one weight is strictly positive. As s -> 1 all nodes
 * converge to p_K inside the compact positive interval [p_1, p_K], so the
 * imp-95506 Hermite-Genocchi divided-difference argument applies verbatim
 * (domination t^j e^(-p_1 t)): the pencil converges to the confluent
 * factorial pencil at rate p_K, whose top eigenvalue is
 * x_max(L_K)/(2 p_K) (Gauss quadrature identification, rescaled by the
 * scaling identity). Strict decrease along the path then gives
 * mu_max(P) = mu_max(Q(0)) > lim_{s to 1} mu_max(Q(s)) = x_max(L_K)/(2 p_K).
 * SHARPNESS: each end is attained in the limit of coalescing the whole
 * configuration at the corresponding extreme rate, so neither constant can
 * be improved uniformly over configurations with the given extreme rate.
 *
 * COROLLARY ONSET-PIN (re-priced onset ladder, the imp-95506 successor).
 * By imp-95501 LEMMA ONSET, onset(TILT-SORT)(P) = mu_max(P). Hence
 *   x_max(L_K)/(2 p_K) < onset(TILT-SORT) < x_max(L_K)/(2 p_1):
 * the graded-credit onset is priced a priori to relative width p_K/p_1
 * with NO pencil solve. For clustered sets this is an exact pricing:
 * CLUSTER8 (rates in [1, 1.1]) has bracket [x_8/2.2, x_8/2] =
 * [10.392333, 11.431566] around the imp-95501 exact-inertia onset
 * 10.8954795117 (width 10 percent). The imp-95503 family-uniform cap
 * (HARM-CAP, mu_max < 2K/nu) is superseded by the exact family cap
 * x_max(L_K)/(2 nu) -- improvement factor 4K/x_max(L_K), equal to 2.3431
 * at K = 2, 1.3996 at K = 8, decreasing to 1 as K grows (the harmonic cap
 * was already asymptotically right; the exact cap wins the constant).
 * TILT-DET/TILT-EIG onsets are tau-based and are NOT re-priced by this
 * bracket (they were already exact closed forms, imp-95501 LEMMA ONSET).
 *
 * THEOREM SLOW-PREFIX (subset floor; rescues the lower end for spread
 * sets). With sorted rates p_(1) <= ... <= p_(K):
 *   mu_max(P) > max over 1 <= J <= K of x_max(L_J) / (2 p_(J)).
 * PROOF. For the slow prefix P_J = (p_(1), ..., p_(J)): E_{P_J} is a
 * subspace of E_P, so mu_max(P) >= mu_max(P_J) (sup over a larger space).
 * Strict for J < K: if equal, the (attained, finite-dimensional) maximizer
 * over E_{P_J} would be a top eigenfunction of the FULL pencil supported on
 * J < K exponentials, contradicting LEMMA OSC (all K coefficients nonzero).
 * Then apply the MT-BRACKET lower end to P_J (whose max rate is p_(J)).
 * For J = K this recovers the bracket lower end; for geometric lattices it
 * is strictly better: twin lattices (imp-95501 ledger) have K-bracket lower
 * end x_32/(2 * 140.8) = 0.1836 at m = 16, while the slow-prefix floor is
 * 2.1352433891593496 (J* = 4, = x_4/4.4) -- m-UNIFORM for every m >= 2,
 * because the four slowest twin rates (1, 1.1, 2, 2.2) do not change
 * with m.
 *
 * LEMMA X-ELEM (elementary two-sided Laguerre-edge bracket; restores fully
 * elementary status to the re-priced caps, finishing the imp-95501
 * residual (ii-next2) currency). For K >= 2:
 *   2K - 2 + sqrt((K-1)^2 + 1)  <=  x_max(L_K)  <=  4K - 6 (K >= 4),
 * with cap 3K - 2 at K = 2, 3 (values 4 and 7), and equality on the left
 * iff K = 2. PROOF. Lower: the trailing 2 x 2 principal block of the
 * Laguerre Jacobi matrix is [[2K-3, -(K-1)], [-(K-1), 2K-1]] with top
 * eigenvalue (2K-2) + sqrt((K-1)^2 + 1); Cauchy interlacing (equivalently
 * a Rayleigh quotient on the last two coordinates) bounds x_max from
 * below; at K = 2 the block IS the whole matrix, hence equality. Upper:
 * Gershgorin row sums of the Jacobi block are 2 (first row), 4k + 2
 * (interior row k), 3K - 2 (last row), so x_max <= max(4K - 6, 3K - 2),
 * which is 4K - 6 exactly when K >= 4. Consequently the exact family cap
 * satisfies the elementary sandwich
 *   (2K - 2 + sqrt((K-1)^2 + 1)) / (2 nu) <= x_max(L_K)/(2 nu)
 *   <= (2K - 3)/nu for K >= 4,
 * strictly below the imp-95503 harmonic family cap 2K/nu at every K.
 *
 * RE-PRICED LEDGER (measured cross-checks of the theorems; baked below).
 *  (A) 200 seeded draws, K = 2..5, spread up to 20x: ZERO bracket
 *      violations; the draws come within 2.3 percent of each end
 *      (min mu/lower = 1.02279, min upper/mu = 1.02268) -- both ends are
 *      approached, consistent with sharpness.
 *  (B) CLUSTER8: bracket [10.392333, 11.431566] contains the exact-inertia
 *      mu_max literal 10.8954795117 (imp-95501, carried not recomputed --
 *      float Cholesky fails on that Gram, known trap).
 *  (C) Twins: mu_max = 5.06390899825 (m = 8), 5.09361535799 (m = 16)
 *      (imp-95501 literals, float-reproduced here); slow-prefix floor
 *      2.1352433891593496 at J* = 4 for BOTH (m-uniform), vs K-bracket
 *      lower ends x_16/(2 * 140.8) = 0.18360 (m = 8) and ~0.0014
 *      (m = 16) -- the prefix floor is the binding lower pricing for
 *      lattices.
 *  (D) Strictness witness: mu_max of the four slowest twin rates is
 *      3.2496021302334190, strictly between the J = 4 floor 2.13524 and
 *      the full mu_max 5.06391 -- both SLOW-PREFIX inequalities visible.
 *  (E) Family-cap improvement ladder 4K/x_max(L_K): 2.3431 (K=2), 1.9078
 *      (K=3), 1.7030 (K=4), 1.5016 (K=6), 1.3996 (K=8), 1.2379 (K=16),
 *      strictly decreasing toward 1.
 *
 * ADVERSARIAL SELF-CHECK RECORD. (1) The up-path limit was attacked
 * numerically at s = 0.98: the K = 4 float pencil returned garbage
 * (apparent monotonicity VIOLATION) -- traced to Cauchy-pencil
 * conditioning kappa ~ gap^(-2(K-1)) (the imp-95501 CLUSTER8 trap), NOT to
 * the theorem; at s <= 0.95 both sample paths are strictly monotone and
 * end above the limit, and the K = 3 corner ladder (spacing 0.1, 0.02,
 * 0.004) approaches x_3/(2 p_max) from above with strictly shrinking gap.
 * Assertions stay in the well-conditioned range. (2) The elementary lower
 * bound was probed at K = 2 and found to be an EQUALITY (the 2 x 2 block
 * is the whole matrix) -- the claim was adjusted to "equality iff K = 2"
 * rather than papering over it with a tolerance. (3) The bracket was
 * attacked with 200 seeded draws including near-coalescent-at-an-extreme
 * configs; zero violations and both ends approached within 2.3 percent.
 * (4) SLOW-PREFIX strictness does NOT follow from span nesting alone
 * (sup over a larger space is only >=); the strict step needs LEMMA OSC
 * full support, and the witness (D) makes the strict chain
 * visible numerically. (5) Scope of the onset re-pricing was checked
 * against imp-95501 LEMMA ONSET: only the TILT-SORT onset equals mu_max;
 * tau-based DET/EIG onsets are exact already and are not claimed. (6) Name
 * collisions: SUB-FLOOR is taken (imp-3647), so the subset floor is named
 * SLOW-PREFIX (grep-clean); MT-BRACKET, X-ELEM, ONSET-PIN are new.
 *
 * HONEST LIMITS. (a) The bracket width is the spread ratio p_K/p_1 --
 * vacuous for geometric lattices; SLOW-PREFIX recovers an m-uniform floor
 * (2.135 for twins) but the observed m-uniform SATURATION mu_max(twin m)
 * ~= 5.09 remains MEASURED-ONLY: an m-uniform UPPER bound for geometric
 * lattices (below the exact cap x_max(L_2m)/2, which grows linearly in m)
 * is a NEW named residual (mu-sat). (b) Model family only (exponential
 * spans, mean-time compression); no paper-packet constant is touched and
 * no Lambda bound changes. (c) Numerics here are float-only; the CLUSTER8
 * mu_max is the imp-95501 exact-inertia literal, carried not recomputed.
 *
 * ROUTING. Executes the imp-95506 named successor (onset-ladder re-pricing
 * with the exact cap) and closes the elementary-currency half of the
 * imp-95501 residual (ii-next2) via LEMMA X-ELEM. Surviving residuals:
 * (i) deflation-aware majorant (imp-95499 (a), untouched); (iii) RZ-PEN
 * tilt-det / block-symbol port (untouched); NEW (mu-sat) m-uniform upper
 * bound on mu_max for geometric lattices; plus the chain-level residuals
 * (off-lattice rates, signed WEIGHT and modulus-phase currencies,
 * imp-95212 envelope port). Import-free; numerics are CROSS-CHECKS of the
 * proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// pencil machinery (imp-95506 conventions, import-free)
// ---------------------------------------------------------------------------
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 400; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-22) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let i = 0; i < n; i++) {
          const aip = A[i][p];
          const aiq = A[i][q];
          A[i][p] = c * aip - s * aiq;
          A[i][q] = s * aip + c * aiq;
        }
        for (let i = 0; i < n; i++) {
          const api = A[p][i];
          const aqi = A[q][i];
          A[p][i] = c * api - s * aqi;
          A[q][i] = s * api + c * aqi;
        }
      }
    }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}

function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95507 chol: base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}

function pencilTop(A, G) {
  const K = G.length;
  const L = chol(G);
  const X = A.map((r) => r.slice());
  for (let col = 0; col < K; col++) {
    for (let i = 0; i < K; i++) {
      let s = X[i][col];
      for (let k = 0; k < i; k++) s -= L[i][k] * X[k][col];
      X[i][col] = s / L[i][i];
    }
  }
  const B = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let row = 0; row < K; row++) {
    for (let i = 0; i < K; i++) {
      let s = X[row][i];
      for (let k = 0; k < i; k++) s -= L[i][k] * B[row][k];
      B[row][i] = s / L[i][i];
    }
  }
  return jacobiEig(B)[K - 1];
}

const muMax = (P) =>
  pencilTop(
    P.map((a) => P.map((b) => 1 / ((a + b) * (a + b)))),
    P.map((a) => P.map((b) => 1 / (a + b)))
  );

function xMaxLaguerre(K) {
  const T = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let k = 0; k < K; k++) {
    T[k][k] = 2 * k + 1;
    if (k + 1 < K) {
      T[k][k + 1] = -(k + 1);
      T[k + 1][k] = -(k + 1);
    }
  }
  return jacobiEig(T)[K - 1];
}

const twinLattice = (m, r = 1.1) => {
  const P = [];
  for (let k = 0; k < m; k++) P.push(2 ** k, r * 2 ** k);
  return P.sort((a, b) => a - b);
};

const slowPrefixFloor = (P) => {
  const S = P.slice().sort((a, b) => a - b);
  let best = 0;
  let bestJ = 0;
  for (let J = 1; J <= S.length; J++) {
    const f = xMaxLaguerre(J) / (2 * S[J - 1]);
    if (f > best) {
      best = f;
      bestJ = J;
    }
  }
  return { floor: best, J: bestJ };
};

// deterministic congruential draws (well-separated: float pencil is honest)
function drawConfigs(count, seedInit) {
  let seed = seedInit;
  const rnd = () => {
    seed = (Math.imul(1103515245, seed) + 12345) >>> 0;
    return seed / 4294967296;
  };
  const out = [];
  while (out.length < count) {
    const K = 2 + Math.floor(rnd() * 4); // 2..5
    const P = [0.3 + 3 * rnd()];
    while (P.length < K) {
      const c = 0.3 + 6 * rnd();
      if (P.every((q) => Math.abs(q - c) > 0.05)) P.push(c);
    }
    P.sort((a, b) => a - b);
    out.push(P);
  }
  return out;
}

// baked literals (NEW here unless marked carried)
const X3 = 6.2899450829374794;
const X4 = 9.39507091230114;
const X8 = 22.863131736889255;
const X16 = 51.701160339543371;
const CLUSTER8_MU_MAX = 10.8954795117; // carried: imp-95501 exact inertia
const CLUSTER8_LO = 10.392333; // x_8 / 2.2
const CLUSTER8_HI = 11.431566; // x_8 / 2
const TWIN_M8_MU = 5.06390899825; // carried: imp-95501
const TWIN_M16_MU = 5.09361535799; // carried: imp-95501
const TWIN_PREFIX_FLOOR = 2.1352433891593496; // x_4 / 4.4, J* = 4
const TWIN_SLICE4_MU = 3.249602130233419; // mu_max of (1, 1.1, 2, 2.2)

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95507_MT_BRACKET_REPRICED_ONSETS = {
  id: "imp-95507",
  title:
    "THEOREM MT-BRACKET + THEOREM SLOW-PREFIX + LEMMA X-ELEM + COROLLARY " +
    "ONSET-PIN: two-sided sharp coalescent bracket x_max(L_K)/(2 p_max) < " +
    "mu_max(P) < x_max(L_K)/(2 p_min) and the re-priced TILT-SORT onset " +
    "ladder (imp-95506 named successor executed; lower direction NEW)",
  theoremMtBracket:
    "the ascending affine path onto the fast corner (p_max, ..., p_max) " +
    "strictly DECREASES mu_max (THEOREM MT-MONO termwise with nonnegative " +
    "weights) and converges to the confluent Laguerre value at p_max " +
    "(Hermite-Genocchi continuity + scaling), giving the NEW lower end " +
    "x_max(L_K)/(2 p_max) < mu_max(P); the upper end is imp-95506 " +
    "CONF-DOM-K; both ends sharp (coalescent limits at the extreme rates)",
  corollaryOnsetPin:
    "onset(TILT-SORT) = mu_max (imp-95501 LEMMA ONSET) is priced a priori " +
    "to relative width p_max/p_min with no pencil solve; exact family cap " +
    "x_max(L_K)/(2 nu) supersedes the imp-95503 harmonic cap 2K/nu by the " +
    "factor 4K/x_max(L_K) in (1, 2.344], decreasing to 1",
  theoremSlowPrefix:
    "mu_max(P) > max over J of x_max(L_J)/(2 p_(J)) (sorted rates): span " +
    "nesting gives >= and LEMMA OSC full support forces strictness; for " +
    "twin lattices the floor is m-UNIFORM (2.13524 at J* = 4) where the " +
    "K-bracket lower end collapses geometrically",
  lemmaXElem:
    "elementary Laguerre-edge sandwich 2K - 2 + sqrt((K-1)^2 + 1) <= " +
    "x_max(L_K) <= 4K - 6 (K >= 4; 3K - 2 at K = 2, 3), equality on the " +
    "left iff K = 2 (trailing 2x2 Jacobi block + Gershgorin rows) -- " +
    "restores fully elementary status to the re-priced caps and closes " +
    "the elementary-currency half of imp-95501 (ii-next2)",
  repricedLedger: {
    drawSweep: {
      draws: 200,
      kRange: [2, 5],
      violations: 0,
      minMuOverLower: 1.022785,
      minUpperOverMu: 1.022678,
    },
    cluster8: {
      bracket: [CLUSTER8_LO, CLUSTER8_HI],
      muMaxExactInertia: CLUSTER8_MU_MAX,
      relativeWidth: 0.1,
      source: "mu_max carried from imp-95501 exact-rational inertia",
    },
    twins: {
      m8Mu: TWIN_M8_MU,
      m16Mu: TWIN_M16_MU,
      prefixFloor: TWIN_PREFIX_FLOOR,
      prefixJStar: 4,
      mUniform: true,
      kBracketLowerEndM16: 0.1835976,
    },
    famCapImprovement4KOverXK: {
      k2: 2.343146,
      k3: 1.907807,
      k4: 1.703021,
      k6: 1.501607,
      k8: 1.399633,
      k16: 1.237883,
    },
  },
  residualExecuted:
    "imp-95506 named successor (re-price the SORT-OPT/TILT-EIG onset " +
    "ladder with the exact x_max(L_K)/(2 min P) cap) plus the elementary-" +
    "currency half of imp-95501 (ii-next2) via LEMMA X-ELEM; the lower " +
    "bracket direction is NEW (imp-95506 proved only the upper)",
  rescopedResidual:
    "(i) deflation-aware majorant (imp-95499 (a), untouched); (iii) " +
    "RZ-PEN tilt-det / block-symbol port (untouched); NEW (mu-sat): an " +
    "m-uniform UPPER bound on mu_max for geometric lattices (twin " +
    "saturation ~5.09 is measured-only; the exact cap x_max(L_2m)/2 grows " +
    "linearly in m)",
  honestScope:
    "model family only (exponential spans, mean-time compression); " +
    "bracket width is the spread ratio, vacuous for geometric lattices " +
    "(SLOW-PREFIX is the lattice floor); CLUSTER8 mu_max carried from " +
    "imp-95501, not recomputed (float Cholesky fails there); changes no " +
    "bound; NO QED; no refereed bound is changed",
  promotesBound: false,
  isRigorous: true,
  rigorScope:
    "THEOREM MT-BRACKET (lower end), THEOREM SLOW-PREFIX, LEMMA X-ELEM " +
    "and COROLLARY ONSET-PIN are unconditional theorems about the model " +
    "mean-time pencil, proved in the header from imp-95506 THEOREM " +
    "MT-MONO / LEMMA OSC / the Hermite-Genocchi corner limit and " +
    "imp-95501 LEMMA ONSET (ascending affine path, span nesting with an " +
    "OSC strictness step, trailing-block Rayleigh plus Gershgorin). All " +
    "numerics below are CROSS-CHECKS of proven statements, never the " +
    "claim itself.",
  verdict:
    "RIGOROUS step -- the imp-95506 successor is EXECUTED: the TILT-SORT " +
    "onset ladder is re-priced two-sidedly, x_max(L_K)/(2 p_max) < " +
    "onset = mu_max(P) < x_max(L_K)/(2 p_min), where the LOWER end is a " +
    "new theorem (ascending affine path to the fast corner under THEOREM " +
    "MT-MONO), the upper end consumes CONF-DOM-K, both ends are sharp, " +
    "and LEMMA X-ELEM makes the caps elementary (2K - 2 + " +
    "sqrt((K-1)^2 + 1) <= x_max(L_K) <= 4K - 6). THEOREM SLOW-PREFIX " +
    "rescues the lower pricing for spread sets (m-uniform twin floor " +
    "2.13524 where the K-bracket end collapses to 0.184). MODEL FAMILY " +
    "ONLY: no paper-packet constant is touched and the finite-N Lambda " +
    "beat did NOT become rigorous. Changes no bound; NO QED on any RH " +
    "statement; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// assertions (self-executing; throw on violation)
// ---------------------------------------------------------------------------
export const IMP95507_ASSERTIONS = [
  {
    id: "imp95507-x-elem-sandwich",
    description:
      "LEMMA X-ELEM: 2K - 2 + sqrt((K-1)^2 + 1) <= x_max(L_K) <= " +
      "max(4K - 6, 3K - 2) for K = 2..16, equality on the left iff K = 2 " +
      "(1e-12), strict for K >= 3; baked anchors X3, X4, X8, X16 " +
      "reproduce (rel 1e-10)",
    holds: () => {
      for (let K = 2; K <= 16; K++) {
        const x = xMaxLaguerre(K);
        const lo = 2 * K - 2 + Math.sqrt((K - 1) * (K - 1) + 1);
        const cap = Math.max(4 * K - 6, 3 * K - 2);
        if (!(x <= cap + 1e-12)) return false;
        if (K === 2) {
          if (Math.abs(x - lo) > 1e-12) return false;
        } else if (!(x > lo + 1e-6)) return false;
      }
      return (
        Math.abs(xMaxLaguerre(3) - X3) < 1e-10 * X3 &&
        Math.abs(xMaxLaguerre(4) - X4) < 1e-10 * X4 &&
        Math.abs(xMaxLaguerre(8) - X8) < 1e-10 * X8 &&
        Math.abs(xMaxLaguerre(16) - X16) < 1e-10 * X16
      );
    },
  },
  {
    id: "imp95507-bracket-sweep",
    description:
      "THEOREM MT-BRACKET: x_max(L_K)/(2 p_max) < mu_max(P) < " +
      "x_max(L_K)/(2 p_min) on 200 seeded draws (K = 2..5, spread up to " +
      "20x), zero violations, and both ends are approached within 2.3 " +
      "percent across the sweep (sharpness visible)",
    holds: () => {
      let minLoRatio = Infinity;
      let minHiRatio = Infinity;
      for (const P of drawConfigs(200, 95507)) {
        const K = P.length;
        const xK = xMaxLaguerre(K);
        const m = muMax(P);
        const lo = xK / (2 * P[K - 1]);
        const hi = xK / (2 * P[0]);
        if (!(m > lo && m < hi)) return false;
        minLoRatio = Math.min(minLoRatio, m / lo);
        minHiRatio = Math.min(minHiRatio, hi / m);
      }
      return minLoRatio < 1.03 && minHiRatio < 1.03;
    },
  },
  {
    id: "imp95507-uppath-monotone-decrease",
    description:
      "MT-BRACKET path cross-check: mu_max strictly decreases along " +
      "Q(s) = (1-s) P + s (p_max, ..., p_max) up to s = 0.95 for the two " +
      "imp-95506 sample sets and ends strictly above the corner limit " +
      "x_max(L_K)/(2 p_max) (float range kept well-conditioned)",
    holds: () => {
      for (const P of [
        [0.5, 1.3, 2.9],
        [0.5, 0.9, 1.7, 4.1],
      ]) {
        const K = P.length;
        const pK = P[K - 1];
        const lim = xMaxLaguerre(K) / (2 * pK);
        let prev = Infinity;
        for (let i = 0; i <= 49; i++) {
          const s = (0.95 * i) / 49;
          const m = muMax(P.map((p) => (1 - s) * p + s * pK));
          if (!(m < prev)) return false;
          if (!(m > lim)) return false;
          prev = m;
        }
      }
      return true;
    },
  },
  {
    id: "imp95507-corner-ladder-from-above",
    description:
      "lower-end sharpness: the K = 3 near-corner ladder at p_max = 2.9 " +
      "(spacing 0.1, 0.02, 0.004) approaches x_3/(2 * 2.9) from above " +
      "with strictly shrinking positive gap",
    holds: () => {
      const lim = xMaxLaguerre(3) / (2 * 2.9);
      let gapPrev = Infinity;
      for (const d of [0.1, 0.02, 0.004]) {
        const m = muMax([2.9 - 2 * d, 2.9 - d, 2.9]);
        const gap = m - lim;
        if (!(gap > 0 && gap < gapPrev)) return false;
        gapPrev = gap;
      }
      return true;
    },
  },
  {
    id: "imp95507-cluster8-onset-pin",
    description:
      "COROLLARY ONSET-PIN on CLUSTER8: the baked bracket [x_8/2.2, " +
      "x_8/2] = [10.392333, 11.431566] reproduces (rel 1e-6) and " +
      "contains the imp-95501 exact-inertia onset literal 10.8954795117 " +
      "(relative width 10 percent)",
    holds: () => {
      const lo = X8 / 2.2;
      const hi = X8 / 2;
      if (Math.abs(lo - CLUSTER8_LO) > 1e-6 * lo) return false;
      if (Math.abs(hi - CLUSTER8_HI) > 1e-6 * hi) return false;
      if (!(CLUSTER8_MU_MAX > lo && CLUSTER8_MU_MAX < hi)) return false;
      return Math.abs(hi / lo - 1.1) < 1e-12;
    },
  },
  {
    id: "imp95507-slow-prefix-twins",
    description:
      "THEOREM SLOW-PREFIX on twin lattices: floor = x_4/4.4 = " +
      "2.1352433891593496 at J* = 4 for BOTH m = 8 and m = 16 " +
      "(m-uniform), strictly below the carried mu_max literals and " +
      "strictly above the collapsing K-bracket lower end; float pencil " +
      "reproduces the imp-95501 twin literals (1e-6)",
    holds: () => {
      const P8 = twinLattice(8);
      const P16 = twinLattice(16);
      const f8 = slowPrefixFloor(P8);
      const f16 = slowPrefixFloor(P16);
      if (f8.J !== 4 || f16.J !== 4) return false;
      if (Math.abs(f8.floor - TWIN_PREFIX_FLOOR) > 1e-10) return false;
      if (Math.abs(f16.floor - TWIN_PREFIX_FLOOR) > 1e-10) return false;
      const m8 = muMax(P8);
      const m16 = muMax(P16);
      if (Math.abs(m8 - TWIN_M8_MU) > 1e-6) return false;
      if (Math.abs(m16 - TWIN_M16_MU) > 1e-6) return false;
      if (!(f8.floor < m8 && f16.floor < m16)) return false;
      const kLower16 = xMaxLaguerre(32) / (2 * P16[31]);
      return f16.floor > kLower16 && kLower16 < 0.5;
    },
  },
  {
    id: "imp95507-slow-prefix-strictness-witness",
    description:
      "strictness chain witness: mu_max of the four slowest twin rates " +
      "(1, 1.1, 2, 2.2) = 3.249602130233419 lies strictly between the " +
      "J = 4 floor and the full twin m = 8 mu_max",
    holds: () => {
      const m4 = muMax([1, 1.1, 2, 2.2]);
      if (Math.abs(m4 - TWIN_SLICE4_MU) > 1e-9) return false;
      return TWIN_PREFIX_FLOOR < m4 && m4 < TWIN_M8_MU;
    },
  },
  {
    id: "imp95507-famcap-improvement-ladder",
    description:
      "the exact family cap supersedes the imp-95503 harmonic cap: " +
      "4K/x_max(L_K) matches the baked ladder (rel 1e-5) at K in " +
      "{2, 3, 4, 6, 8, 16}, lies in (1, 2.344], and is strictly " +
      "decreasing in K over 2..16",
    holds: () => {
      const lits = {
        2: 2.343146,
        3: 1.907807,
        4: 1.703021,
        6: 1.501607,
        8: 1.399633,
        16: 1.237883,
      };
      for (const K of [2, 3, 4, 6, 8, 16]) {
        const f = (4 * K) / xMaxLaguerre(K);
        if (Math.abs(f - lits[K]) > 1e-5 * f) return false;
        if (!(f > 1 && f <= 2.3432)) return false;
      }
      let prev = Infinity;
      for (let K = 2; K <= 16; K++) {
        const f = (4 * K) / xMaxLaguerre(K);
        if (!(f < prev)) return false;
        prev = f;
      }
      return true;
    },
  },
  {
    id: "imp95507-honesty-gate",
    description:
      "the record scopes to the model family, names the executed " +
      "successor and the surviving plus new (mu-sat) residuals, promotes " +
      "no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95507_MT_BRACKET_REPRICED_ONSETS.promotesBound === false &&
      /imp-95506 named successor/.test(
        IMP95507_MT_BRACKET_REPRICED_ONSETS.residualExecuted
      ) &&
      /mu-sat/.test(IMP95507_MT_BRACKET_REPRICED_ONSETS.rescopedResidual) &&
      /deflation-aware/.test(
        IMP95507_MT_BRACKET_REPRICED_ONSETS.rescopedResidual
      ) &&
      /RZ-PEN/.test(IMP95507_MT_BRACKET_REPRICED_ONSETS.rescopedResidual) &&
      /MODEL FAMILY/.test(IMP95507_MT_BRACKET_REPRICED_ONSETS.verdict) &&
      /NO QED/.test(IMP95507_MT_BRACKET_REPRICED_ONSETS.verdict) &&
      /refereed bound is changed/i.test(IMP95507_MT_BRACKET_REPRICED_ONSETS.verdict) &&
      /did NOT become rigorous/.test(
        IMP95507_MT_BRACKET_REPRICED_ONSETS.verdict
      ),
  },
];

for (const a of IMP95507_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95507-meantime-bracket-repriced-onsets assertion failed: ${a.id}`
    );
  }
}

export default IMP95507_MT_BRACKET_REPRICED_ONSETS;
