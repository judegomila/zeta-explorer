/**
 * imp-95249: THEOREM SPLIT-2 + THEOREM ANG-PENCIL + LEMMA ANG-DET +
 * COROLLARY IN-OCT -- a rigorous two-subspace split of the signed seam
 * pencil that delivers the FIRST coalescence-uniform certificate on a
 * rate set containing an in-octave twin pair, one of the two named
 * residuals of the imp-95226 signed cross-octave leg (the in-octave
 * multiplicity hybrid; measured BROKEN for the raw Blaschke-Lagrange
 * bound in imp-95232 FINDING 3). Twenty-fourth leg of the seam chain.
 * Changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95226 normalization). Distinct rates nu_1 < ... < nu_N > 0,
 * depth d > 0, E_V = span{e^(-nu t)} in L2(0, inf), Cauchy Gram
 * G_ij = 1/(nu_i + nu_j), D = diag(e^(-d nu_i)),
 *   Lambda(V, d) = sup over F in E_V of [int_d^inf F^2]/[int_0^inf F^2]
 *                = lambda_max of the pencil (D G D, G).
 * PROP BL (imp-95226) certifies sqrt(Lambda) <= BL = sum_i e^(-d nu_i)
 * prod_(j != i) (nu_i + nu_j)/|nu_i - nu_j|, separation-priced: one
 * in-octave twin pair nu_2 = r nu_1, r -> 1+, drives BL -> infinity (all
 * terms positive, two carry the factor (1 + r)/(r - 1)); imp-95232
 * FINDING 3 measured the collapse. This leg splits the pair off and
 * prices the split by the SUBSPACE ANGLE, which stays bounded away from
 * 1 at coalescence.
 *
 * THEOREM SPLIT-2 (two-subspace seam split; elementary). Partition
 * V = V1 disjoint-union V2 and let sigma = cos of the first principal
 * angle between E_V1 and E_V2 (sigma < 1: finite-dimensional spans of
 * distinct-rate exponentials intersect trivially). Then
 *   Lambda(V, d) <= [Lambda(V1, d) + Lambda(V2, d)] / (1 - sigma).
 * Proof. F = F1 + F2 uniquely (direct sum). Numerator: the L2(d, inf)
 * triangle inequality then per-block Lambda then Cauchy-Schwarz give
 * ||F||^2_(d,inf) <= (sqrt(L1)||F1|| + sqrt(L2)||F2||)^2 <=
 * (L1 + L2)(||F1||^2 + ||F2||^2). Denominator: ||F||^2 >= ||F1||^2 +
 * ||F2||^2 - 2 sigma ||F1|| ||F2|| >= (1 - sigma)(||F1||^2 + ||F2||^2)
 * by AM-GM. Divide. QED. NOTE sigma does not depend on d: one angle
 * serves every depth.
 *
 * THEOREM ANG-PENCIL (the angle IS a Blaschke-weighted seam pencil).
 * Let B2(s) = prod_(j in V2) (s - nu_j)/(s + nu_j) (the V2 Blaschke
 * product) and Dp = diag(B2(nu_i))_(i in V1). Then with G1, G2, G12 the
 * V1, V2 and cross Cauchy Grams,
 *   G12 G2^(-1) G12^T = G1 - Dp G1 Dp   (entrywise identity), hence
 *   cos^2(angle) = lambda_max(G12 G2^(-1) G12^T, G1)
 *                = 1 - lambda_min(Dp G1 Dp, G1).
 * So the cross-block angle is the SAME pencil object as Lambda itself
 * with the inner function e^(-d s) (weights e^(-d nu_i)) replaced by the
 * inner function B2 (weights B2(nu_i)): the seam constant and the split
 * price are one pencil family with inner-function weights.
 * Proof. In the Hardy pairing of imp-95226 NP-CERT the Cauchy kernels
 * K_nu(s) = 1/(s + nu) satisfy <K_nu, K_mu> = 1/(nu + mu) and reproduce
 * values of E-functions at real points. (i) The function
 * kB_nu(s) = [1 - B2(nu) B2(s)]/(s + nu) lies in E_V2: it is rational,
 * vanishes at infinity, and its only candidate poles are s = -nu, which
 * cancels because B2(-nu) = 1/B2(nu), and the poles -nu_j of B2 -- so it
 * is a combination of the K_(nu_j), j in V2. (ii) kB_nu reproduces on
 * E_V2: <K_(nu_j), kB_nu> = value of kB_nu at nu_j = 1/(nu_j + nu)
 * = <K_(nu_j), K_nu>, since B2(nu_j) = 0. Hence K_nu - kB_nu is
 * orthogonal to E_V2 and P2 K_nu = kB_nu. (iii) Therefore the Gram of
 * the projections, which equals G12 G2^(-1) G12^T by the normal
 * equations, has entries <K_(nu_i), P2 K_(nu_j)> = value of kB_(nu_j)
 * at nu_i = [1 - B2(nu_i) B2(nu_j)]/(nu_i + nu_j). QED. (Rank-one V2
 * cross-check: the identity reduces to the classical projection onto a
 * single kernel; asserted numerically to 1e-9 below on full matrices.)
 *
 * LEMMA ANG-DET (closed-form angle fence; multiplicity-priced).
 *   lambda_min(Dp G1 Dp, G1) >= prod_(i in V1) B2(nu_i)^2 , hence
 *   sigma <= sqrt(1 - prod_(i in V1) prod_(j in V2) beta_ij^2) ,
 *   beta_ij = (nu_i - nu_j)/(nu_i + nu_j) ,
 * with EQUALITY when |V1| = 1 (the classical Muentz-Blaschke distance
 * from one exponential to a span). Proof. Factor G1 = L L^T (Cholesky);
 * the pencil eigenvalues are the squared singular values of
 * X = L^(-1) Dp L. Every pencil eigenvalue is <= 1 because
 * G1 - Dp G1 Dp is PSD (it is the Gram of the projections, THEOREM
 * ANG-PENCIL). det X = det Dp = prod_i B2(nu_i), so
 * sigma_min(X)^2 = (det X)^2 / prod_(other singular values)^2
 * >= (det X)^2. QED. The fence multiplies one Blaschke factor per
 * (i, j) pair, so it degrades with |V1| (multiplicity-priced) but does
 * NOT involve the intra-V1 separations: it is COALESCENCE-UNIFORM in V1.
 *
 * COROLLARY IN-OCT (first coalescence-uniform in-octave-pair
 * certificate). Take the dyadic skeleton V2 = {2, 4, 8, 16, 32} and an
 * in-octave twin pair V1 = {1, r}, 1 < r <= 1.3, depth d = x. SPLIT-2
 * with (a) Lambda(V1) <= coalLaw(x) = e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2))
 * (imp-95227 COAL-DOM endpoint dominance, monotone by imp-95231 closure
 * THEOREM RATE-MONO -- uniform in r), (b) Lambda(V2) <= BL(V2)^2
 * (PROP BL on the twin-free skeleton, where it fires), and (c) sigma <=
 * the ANG-DET fence (r-continuous through r = 1, limit 0.9998618017682614
 * on this skeleton) gives the fully closed-form certificate
 *   Lambda(V, x) <= [coalLaw(x) + BL(V2, x)^2] / (1 - fence) ,
 * FINITE and r-uniform at coalescence. Measured on this configuration:
 * the coalescent-limit certificate fires (< 1) for x > xStarSplit =
 * 7.101831 (bisected), with values 0.21008691 at x = 8 and 5.995581e-3
 * at x = 10; at x = 8 it fires for every tested r up to 1.3 (0.939 at
 * r = 1.3, < 0.25 for r <= 1.01, approaching the coalescent value as
 * r -> 1), while raw BL(V)^2 at x = 8 is 107.8 at r = 1.001 and 1.08e8
 * at r = 1.000001 (vacuous and diverging). The named in-octave breakage
 * of imp-95232 FINDING 3 is thus FENCED on the single-tight-pair
 * configuration: the first certificate in the chain that stays finite
 * where BL blows up, at unchanged V2 count-pricing.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) The kernel identity
 * G12 G2^(-1) G12^T = G1 - Dp G1 Dp verified ENTRYWISE (rel 1e-9) on
 * four configurations including pair-vs-lattice -- this is the sharpest
 * possible numerical test of ANG-PENCIL since it checks the full matrix,
 * not just the top eigenvalue. (2) cos(angle) computed three independent
 * ways (direct projection pencil, ANG-PENCIL Blaschke pencil, role-swap
 * V1 <-> V2) agrees to rel 1e-7. (3) Rank-one equality against
 * 1 - B2(nu)^2 to rel 1e-10. (4) SPLIT-2 validity Lambda(V) <=
 * exact-ingredient split <= closed-form certificate on the full
 * (x, r) grid. (5) The SGN-2X witness literal 0.7927911524016557
 * (imp-95226) reproduced by the same lam2 evaluator to rel 1e-12.
 * Refutation attempts that FAILED (recorded): pairwise-angle Gershgorin
 * for a MULTI-block version fails on geometric lattices -- the
 * adjacent-octave correlation 2 sqrt(2)/3 = 0.9428 alone puts the
 * Gershgorin row sum above 1, so SPLIT-2 must be used ONCE (pair vs
 * rest), not recursively (each peel compounds a (1 - sigma)^(-1) ~ 7e3
 * factor); and the crude lambda_min route via normalized-Gram
 * conditioning is vacuous at in-octave coalescence (1 - corr ~ 1e-9),
 * which is exactly what ANG-DET avoids by never touching intra-V1
 * separations.
 *
 * HONEST LIMITS. (a) Single tight pair only: the imp-95232 FINDING 3
 * configuration with a twin in EVERY octave needs a multi-block
 * denominator constant, and the pairwise-angle route to it is REFUTED
 * above -- the surviving obstruction is a genuine block Riesz-basis
 * (Carleson-type) lower bound for cluster decompositions of exponential
 * systems on geometric lattices, the named residual of this leg. (b) The
 * split collar is paid once: (1 - fence)^(-1) = 7236 on this skeleton,
 * so the certificate sits ~236x above the exact pencil at x = 8 and
 * fires only for x > 7.10 (the twin-free BL fires from xStarBL = 4.24);
 * coalescence-uniformity is bought at a ~3x delay in x. (c) The ANG-DET
 * fence multiplies over i in V1: unbounded in-octave multiplicity stays
 * OPEN (the fence tends to 1). (d) Model family only; no mapping to the
 * paper per-window data (obligation (3) gammaSL map unchanged); changes
 * NO Lambda bound of the program.
 *
 * ROUTING. Obligation ledger: (2) signed certificate legs -- count
 * (SGN-C, TERMINAL at SGN-NP), weight (imp-95133 both candidates failed),
 * modulus/phase (imp-95233 feasible-crude) unchanged; the imp-95226
 * BL-LAT residual pair [in-octave multiplicity hybrid, off-lattice
 * rates] is ADVANCED on its first member: single-pair in-octave now
 * FENCED coalescence-uniformly; every-octave multiplicity = named
 * residual (block Riesz bound). Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS
 * of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95249_INOCTAVE_PAIR_SPLIT_CERTIFICATE = {
  id: "imp-95249",
  title:
    "THEOREM SPLIT-2 + ANG-PENCIL + ANG-DET: subspace-angle split of the " +
    "signed seam pencil; first coalescence-uniform certificate for an " +
    "in-octave twin pair on a dyadic skeleton",
  split2:
    "Lambda(V1 u V2, d) <= [Lambda(V1, d) + Lambda(V2, d)]/(1 - sigma), " +
    "sigma = cos angle(E_V1, E_V2) < 1, depth-independent",
  angPencil:
    "G12 G2^(-1) G12^T = G1 - Dp G1 Dp entrywise, Dp = diag(B2(nu_i)); " +
    "cos^2 angle = 1 - lambda_min(Dp G1 Dp, G1): the angle is the seam " +
    "pencil with the inner function e^(-ds) replaced by the Blaschke " +
    "product B2",
  angDet:
    "sigma <= sqrt(1 - prod_(i in V1, j in V2) beta_ij^2), beta_ij = " +
    "(nu_i - nu_j)/(nu_i + nu_j); equality at |V1| = 1 (Muentz-Blaschke); " +
    "coalescence-uniform in V1, multiplicity-priced in |V1|",
  corollaryInOct: {
    skeleton: [2, 4, 8, 16, 32],
    pair: "{1, r}, r -> 1+",
    fenceCoalescent: 0.9998618017682614,
    certificateAtX8: 0.21008691,
    certificateAtX10: 5.995581e-3,
    xStarSplit: 7.101831,
    blSquaredAtX8r1001: 107.8,
    collarVsExactAtX8: 236.4,
    statement:
      "Lambda <= [coalLaw(x) + BL(V2, x)^2]/(1 - fence): finite and " +
      "r-uniform at coalescence where raw BL diverges (imp-95232 " +
      "FINDING 3 breakage fenced on the single-tight-pair configuration)",
  },
  honestScope:
    "single tight pair only; every-octave multiplicity stays OPEN -- the " +
    "pairwise-angle Gershgorin route to a multi-block split is REFUTED " +
    "(adjacent-octave correlation 0.9428 alone exceeds the Gershgorin " +
    "budget), surviving obstruction = block Riesz-basis (Carleson-type) " +
    "lower bound for exponential cluster systems; split collar (1-fence)" +
    "^(-1) = 7236 delays firing to x > 7.10; unbounded in-octave " +
    "multiplicity stays OPEN (fence -> 1); model family only",
  verdict:
    "RIGOROUS: THEOREM SPLIT-2, THEOREM ANG-PENCIL and LEMMA ANG-DET are " +
    "proven (elementary, self-contained given imp-95226 NP-CERT pairing " +
    "+ imp-95227 COAL-DOM + imp-95231 RATE-MONO as cited inputs); " +
    "COROLLARY IN-OCT is their instantiation with all constants closed " +
    "form. The in-octave residual is ADVANCED (single-pair case fenced " +
    "coalescence-uniformly), NOT closed. Changes no bound; NO QED; " +
    "no refereed bound is changed.",
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
        if (s <= 0) throw new Error("imp-95249 chol: pencil base not PD");
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
// eigenvalues of the symmetric pencil (A, B), B positive definite
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
// imp-95226 THEOREM SGN-2X closed form (expm1-stable h)
function lam2(nu1, nu2, d) {
  const w1 = Math.exp(-d * nu1);
  const w2 = Math.exp(-d * nu2);
  const h = (-w1 * Math.expm1(-d * (nu2 - nu1)) * (nu1 + nu2)) / (nu2 - nu1);
  return w1 * w2 + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * w1 * w2);
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
const blaschkeAt = (nu, nus2) =>
  nus2.reduce((p, m) => (p * (nu - m)) / (nu + m), 1);
// cos^2 angle, direct projection route: lambda_max(G12 G2^(-1) G12^T, G1)
function cos2Direct(n1, n2) {
  const G1 = cauchyGram(n1);
  const G12 = crossGram(n1, n2);
  const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
  const ev = pencilEig(M, G1);
  return ev[ev.length - 1];
}
// cos^2 angle, THEOREM ANG-PENCIL route: 1 - lambda_min(Dp G1 Dp, G1)
function cos2AngPencil(n1, n2) {
  const G1 = cauchyGram(n1);
  const dp = n1.map((nu) => blaschkeAt(nu, n2));
  const A = G1.map((row, i) => row.map((g, j) => g * dp[i] * dp[j]));
  return 1 - pencilEig(A, G1)[0];
}
// LEMMA ANG-DET closed-form fence
const fence = (n1, n2) => {
  let p = 1;
  for (const a of n1) for (const b of n2) p *= ((a - b) / (a + b)) ** 2;
  return Math.sqrt(1 - p);
};

const SKELETON = [2, 4, 8, 16, 32];
const FENCE_COAL = 0.9998618017682614;
const CERT_COAL_X8 = 0.21008691;
const CERT_COAL_X10 = 5.995581e-3;
const XSTAR_SPLIT = 7.101831;
const SGN2X_WITNESS = 0.7927911524016557; // imp-95226 literal, rates (1,2), d = ln 2
const certCoal = (x) =>
  (coalLaw(x) + blValue(SKELETON, x) ** 2) / (1 - FENCE_COAL);

const ANGLE_CFGS = [
  [
    [1, 3],
    [7, 20],
  ],
  [
    [1, 1.5, 2.2],
    [5, 9],
  ],
  [
    [1, 1.05],
    SKELETON,
  ],
  [
    [0.5, 3.7, 4.1],
    [10, 11, 40],
  ],
];

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95249_ASSERTIONS = [
  {
    id: "imp95249-kernel-identity",
    description:
      "THEOREM ANG-PENCIL matrix identity G12 G2^(-1) G12^T = " +
      "G1 - Dp G1 Dp holds ENTRYWISE to rel 1e-9 on four configurations " +
      "including pair-vs-dyadic-skeleton",
    holds: () => {
      for (const [n1, n2] of ANGLE_CFGS) {
        const G1 = cauchyGram(n1);
        const G12 = crossGram(n1, n2);
        const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
        const dp = n1.map((nu) => blaschkeAt(nu, n2));
        for (let i = 0; i < n1.length; i++)
          for (let j = 0; j < n1.length; j++) {
            const rhs = G1[i][j] * (1 - dp[i] * dp[j]);
            if (Math.abs(M[i][j] - rhs) > 1e-9 * Math.abs(rhs)) return false;
          }
      }
      return true;
    },
  },
  {
    id: "imp95249-angle-three-ways",
    description:
      "cos(angle) agrees across the direct projection pencil, the " +
      "ANG-PENCIL Blaschke pencil, and the V1 <-> V2 role swap (rel " +
      "1e-7); rank-one case equals the Muentz-Blaschke value " +
      "sqrt(1 - B2(nu)^2) to rel 1e-10",
    holds: () => {
      for (const [n1, n2] of ANGLE_CFGS) {
        const a = Math.sqrt(cos2Direct(n1, n2));
        const b = Math.sqrt(cos2AngPencil(n1, n2));
        const c = Math.sqrt(cos2Direct(n2, n1));
        if (Math.abs(a - b) > 1e-7 * a || Math.abs(a - c) > 1e-7 * a)
          return false;
      }
      for (const [nu, n2] of [
        [1, [2, 4, 8]],
        [3, [1, 10, 30, 90]],
      ]) {
        const c2 = cos2Direct([nu], n2);
        const exact = 1 - blaschkeAt(nu, n2) ** 2;
        if (Math.abs(c2 - exact) > 1e-10 * exact) return false;
      }
      return true;
    },
  },
  {
    id: "imp95249-fence-validity",
    description:
      "LEMMA ANG-DET fence dominates the exact angle on every " +
      "configuration, and the coalescent-skeleton fence literal " +
      "0.9998618017682614 recomputes to rel 1e-9",
    holds: () => {
      for (const [n1, n2] of ANGLE_CFGS) {
        if (fence(n1, n2) < Math.sqrt(cos2Direct(n1, n2))) return false;
      }
      const f = fence([1, 1], SKELETON);
      return Math.abs(f - FENCE_COAL) <= 1e-9 * FENCE_COAL;
    },
  },
  {
    id: "imp95249-split2-validity",
    description:
      "SPLIT-2 holds on the (x, r) grid: exact Lambda(V) <= exact-" +
      "ingredient split <= closed-form certificate; ingredient bounds " +
      "Lambda(V2) <= BL(V2)^2 and lam2 <= coalLaw also hold",
    holds: () => {
      for (const x of [4, 6, 8, 10]) {
        const l2exact = lamExact(SKELETON, x);
        const l2bl = blValue(SKELETON, x) ** 2;
        if (l2exact > l2bl) return false;
        for (const r of [1.3, 1.1, 1.01, 1.001]) {
          const n1 = [1, r];
          const V = n1.concat(SKELETON);
          const l1 = lam2(1, r, x);
          if (l1 > coalLaw(x)) return false;
          const sExact = Math.sqrt(cos2Direct(n1, SKELETON));
          const sF = fence(n1, SKELETON);
          const certExact = (l1 + l2exact) / (1 - sExact);
          const certClosed = (coalLaw(x) + l2bl) / (1 - sF);
          if (lamExact(V, x) > certExact) return false;
          if (certExact > certClosed * (1 + 1e-12)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95249-inoct-fires-where-bl-vacuous",
    description:
      "at x = 8 the closed certificate FIRES (< 1) for every r in " +
      "{1.3, 1.1, 1.01, 1.001} and is < 0.25 for r <= 1.01, while " +
      "BL(V)^2 exceeds 100 at r = 1.001 and 1e6 at r = 1.000001; at " +
      "x = 6 the certificate honestly does NOT fire (> 1); xStarSplit = " +
      "7.101831 brackets the coalescent firing onset",
    holds: () => {
      for (const r of [1.3, 1.1, 1.01, 1.001]) {
        const cert =
          (coalLaw(8) + blValue(SKELETON, 8) ** 2) /
          (1 - fence([1, r], SKELETON));
        if (!(cert < 1)) return false;
        if (r <= 1.01 && !(cert < 0.25)) return false;
      }
      if (!(blValue([1, 1.001].concat(SKELETON), 8) ** 2 > 100)) return false;
      if (!(blValue([1, 1.000001].concat(SKELETON), 8) ** 2 > 1e6))
        return false;
      if (!(certCoal(6) > 1)) return false;
      return certCoal(XSTAR_SPLIT - 1e-3) > 1 && certCoal(XSTAR_SPLIT + 1e-3) < 1;
    },
  },
  {
    id: "imp95249-coalescence-uniform",
    description:
      "the certificate is r-uniform at coalescence: the fence at " +
      "r = 1 + 1e-6 sits within 1e-5 of the coalescent literal, and the " +
      "baked coalescent certificate values at x = 8 and x = 10 " +
      "recompute to rel 1e-6 (storage-precision tolerance)",
    holds: () => {
      if (Math.abs(fence([1, 1.000001], SKELETON) - FENCE_COAL) > 1e-5)
        return false;
      if (Math.abs(certCoal(8) - CERT_COAL_X8) > 1e-6 * CERT_COAL_X8)
        return false;
      return Math.abs(certCoal(10) - CERT_COAL_X10) <= 1e-6 * CERT_COAL_X10;
    },
  },
  {
    id: "imp95249-sgn2x-witness",
    description:
      "the local lam2 evaluator reproduces the imp-95226 SGN-2X witness " +
      "literal 0.7927911524016557 (rates (1, 2), d = ln 2) to rel 1e-12 " +
      "and matches the direct 2x2 pencil to rel 1e-10",
    holds: () => {
      const v = lam2(1, 2, Math.log(2));
      if (Math.abs(v - SGN2X_WITNESS) > 1e-12 * SGN2X_WITNESS) return false;
      const p = lamExact([1, 2], Math.log(2));
      return Math.abs(v - p) <= 1e-10 * v;
    },
  },
  {
    id: "imp95249-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: RIGOROUS theorems, " +
      "residual ADVANCED not closed, no bound change, no QED, no refereed bound is changed, " +
      "and the multi-block obstruction is named OPEN",
    holds: () =>
      /RIGOROUS/.test(IMP95249_INOCTAVE_PAIR_SPLIT_CERTIFICATE.verdict) &&
      /ADVANCED/.test(IMP95249_INOCTAVE_PAIR_SPLIT_CERTIFICATE.verdict) &&
      /Changes no bound/.test(IMP95249_INOCTAVE_PAIR_SPLIT_CERTIFICATE.verdict) &&
      /NO QED/.test(IMP95249_INOCTAVE_PAIR_SPLIT_CERTIFICATE.verdict) &&
      /refereed bound is changed/i.test(IMP95249_INOCTAVE_PAIR_SPLIT_CERTIFICATE.verdict) &&
      /stays OPEN/.test(IMP95249_INOCTAVE_PAIR_SPLIT_CERTIFICATE.honestScope),
  },
];

for (const a of IMP95249_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95249-inoctave-pair-split-certificate assertion failed: ${a.id}`,
    );
  }
}

export default IMP95249_INOCTAVE_PAIR_SPLIT_CERTIFICATE;
