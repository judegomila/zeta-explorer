/**
 * imp-95426: DERIVATION + MEASUREMENT -- the DIRECT seam-pencil two-block
 * bound, a single 2x2 reduction of the imp-95249 seam that is uniformly
 * sharper than the imp-95378 pointwise min(SPLIT-2, SPLIT-LOO), and an honest
 * measurement of whether it closes the collar-limited nearby-cluster residual
 * wedge imp-95378 named (it does NOT). Derive/measure only; changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * MOTIVATION (imp-95378 VERDICT). imp-95378 showed min(SPLIT-2, SPLIT-LOO)
 * absorbs the imp-95256 <=2x INTER-certificate wedge completely but leaves a
 * LARGE residual wedge vs the EXACT joint pencil, unbounded as sigma -> 1,
 * because BOTH splits carry the SAME angular collar denominator ((1 - sigma)
 * resp. (1 - sigma^2)) and the min of two blow-ups still blows up. Its named
 * fix: use the imp-95249 seam pencil DIRECTLY (a non-diagonal joint bound)
 * rather than the (1 - sigma) relaxation. This leg derives that direct bound
 * and measures its looseness against both the min and the exact pencil.
 *
 * SETUP (imp-95249 / imp-95250 / imp-95378 normalization). Two disjoint
 * blocks of exponential rates V1, V2 in L2(0, inf), Cauchy Gram
 * G_ij = 1/(nu_i + nu_j), depth d = x, per-block quotient
 * Lambda_k = lambda_max of the pencil (D_k G_k D_k, G_k), D_k = diag(e^(-x nu)).
 * sigma = cos of the first principal angle between span E(V1) and span E(V2).
 *
 * THEOREM DIRECT-2 (the 2x2 seam reduction). Write any F in E(V1 u V2)
 * uniquely as F = F1 + F2 (direct sum), a = ||F1||, b = ||F2|| the block
 * L2(0, inf) norms. Then
 *   Lambda(V1 u V2, x) <= DIRECT := (L1 + L2 + 2 sigma sqrt(L1 L2))/(1-sigma^2).
 * Proof. Numerator: the L2(x, inf) triangle inequality then per-block Lambda
 * give ||F||_(x,inf) <= sqrt(L1) a + sqrt(L2) b, so the numerator quadratic
 * form is bounded by (a, b) P (a, b)^T with P = c c^T, c = (sqrt(L1), sqrt(L2)).
 * Denominator: ||F||^2 = a^2 + b^2 + 2 <F1, F2> >= a^2 + b^2 - 2 sigma a b =
 * (a, b) M (a, b)^T, M = [[1, -sigma], [-sigma, 1]] (positive definite for
 * sigma < 1 since |<F1, F2>| <= sigma a b by the principal-angle definition).
 * Hence the joint quotient is bounded by the 2x2 generalized Rayleigh quotient
 * sup over real (a, b) of (a,b)P(a,b)^T / (a,b)M(a,b)^T = lambda_max(P, M),
 * and because P has rank one this equals c^T M^(-1) c. With
 * M^(-1) = (1/(1-sigma^2)) [[1, sigma], [sigma, 1]] this is
 * (L1 + L2 + 2 sigma sqrt(L1 L2))/(1-sigma^2). QED. NOTE the unconstrained
 * maximizer (a, b) proportional to M^(-1) c has both entries positive, so
 * dropping the a, b >= 0 constraint does not loosen the bound.
 *
 * ORDERING (elementary; DIRECT is uniformly the tightest of the three).
 *   DIRECT <= SPLIT-2   because (SPLIT-2 - DIRECT)(1-sigma^2) =
 *     (L1+L2)(1+sigma) - (L1+L2+2 sigma sqrt(L1 L2)) =
 *     sigma((L1+L2) - 2 sqrt(L1 L2)) = sigma (sqrt(L1) - sqrt(L2))^2 >= 0
 *     (AM-GM; equality iff L1 = L2).
 *   DIRECT <= SPLIT-LOO because 2 sigma sqrt(L1 L2) <= 2 sqrt(L1 L2)
 *     (sigma <= 1; equality iff sigma = 1) and both share (1-sigma^2).
 * So DIRECT <= min(SPLIT-2, SPLIT-LOO) = MIN(x) EVERYWHERE. DIRECT fuses the
 * arithmetic (SPLIT-2) and sqrt (SPLIT-LOO) numerator pricings into one 2x2
 * reduction and is never worse than either.
 *
 * MEASUREMENT (recomputed on the imp-95378 / imp-95256 35-point surface).
 *  (A) ADMISSIBILITY. DIRECT >= exact joint pencil at every surface point.
 *  (B) SHARPER THAN THE MIN, UNIFORMLY. DIRECT/MIN in [0.8945, 1.0]: never
 *      worse than the min, up to 11.79% tighter (MIN/DIRECT = 1.117915 at
 *      {1,2} u {100,200}, x = 0.02, the most ASYMMETRIC block pair L1 = 1.0
 *      vs L2 = 0.128). The gain is exactly the AM-GM slack sigma(sqrt(L1) -
 *      sqrt(L2))^2 over SPLIT-2, largest when the two block quotients differ.
 *  (C) DOES NOT CLOSE THE COLLAR WEDGE. DIRECT/exact spans [1.1937, 3.22e6],
 *      the SAME range as MIN/exact: at the worst point ({1,1.1} u {1.2,1.32},
 *      x = 3, sigma -> 1) DIRECT/exact = 3221141.66 vs MIN/exact = 3221141.72,
 *      i.e. DIRECT/MIN = 0.99999998. The collar 1/(1-sigma^2) survives intact.
 *  (D) SYMMETRIC-TWIN COLLAPSE (the mechanism). In the every-octave symmetric
 *      twin limit L1 = L2 the AM-GM slack vanishes and DIRECT collapses EXACTLY
 *      to SPLIT-2: near-identical twins give DIRECT/SPLIT-2 = 0.99999993. So on
 *      exactly the regime the certificate is built to serve (nearby symmetric
 *      clusters) the direct bound buys nothing over the min -- the residual
 *      wedge is untouched.
 *  (E) COLLAR LAW. On the sweep {1,1.1} u {1+e,1.1+e}, x = 6, DIRECT/exact *
 *      (1 - sigma) stays O(1e-2) while DIRECT/exact runs to thousands, so
 *      DIRECT/exact ~ C/(1-sigma) -- the wedge is the shared angular collar,
 *      exactly as imp-95378 found for the min.
 *
 * VERDICT. The direct imp-95249 seam pencil, reduced to the 2x2 generalized
 * eigenproblem (P, M), gives DIRECT = (L1 + L2 + 2 sigma sqrt(L1 L2))/
 * (1-sigma^2): a single admissible closed-form certificate that is UNIFORMLY
 * <= min(SPLIT-2, SPLIT-LOO) and up to ~12% tighter where the block quotients
 * are asymmetric. But it does NOT close the collar-limited nearby-cluster
 * residual wedge of imp-95378 and CANNOT at this level of information: it still
 * carries the 1/(1-sigma^2) collar, and in the symmetric-twin (L1 = L2)
 * every-octave regime it collapses exactly to SPLIT-2. The wedge is intrinsic
 * to the ANGLE RELAXATION <F1, F2> >= -sigma a b of the denominator, not to the
 * arithmetic-vs-sqrt numerator pricing that DIRECT fixes; a single scalar sigma
 * plus the two block norms cannot see the cross inner product's dependence on
 * the two DIFFERENT quadratic forms (L2(0,inf) vs L2(x,inf)) that the exact
 * pencil couples. Named residual (carried forward): the collar wedge closes
 * only with the full joint pencil, which is NOT reducible to a 2x2 form.
 * Changes no bound; NO QED; no refereed bound is changed.
 *
 * HONEST LIMITS. (a) THEOREM DIRECT-2 is elementary (rank-one 2x2 Rayleigh
 * quotient); the content is the ordering DIRECT <= MIN, the measurement of the
 * ~12% gain and its asymmetry dependence, and the symmetric-collapse proof that
 * the collar survives. (b) m = 2 only. (c) Model family only (twin-lattice +
 * wide-separation surface of imp-95256 / imp-95378); no mapping to paper
 * per-window data; changes NO Lambda bound. Numerics are CROSS-CHECKS of proven
 * closed forms and a directly-computed exact pencil, never a claim in itself.
 *
 * Import-light (no imports, no zeros bundle).
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND = {
  id: "imp-95426",
  title:
    "DIRECT seam-pencil two-block bound (2x2 reduction of the imp-95249 seam): " +
    "uniformly sharper than min(SPLIT-2, SPLIT-LOO) but retains the shared " +
    "angular collar, so it does NOT close the imp-95378 nearby-cluster wedge",
  bound:
    "Lambda(V1 u V2, x) <= DIRECT = (L1 + L2 + 2 sigma sqrt(L1 L2))/(1-sigma^2)" +
    "; = lambda_max(c c^T, M), c = (sqrt(L1), sqrt(L2)), M = [[1,-sigma],[-sigma,1]]",
  ordering:
    "DIRECT <= SPLIT-2 (AM-GM slack sigma(sqrt(L1)-sqrt(L2))^2, eq iff L1=L2) " +
    "and DIRECT <= SPLIT-LOO (sigma<=1, eq iff sigma=1); so DIRECT <= MIN always",
  sharperThanMin: {
    claim:
      "DIRECT is uniformly <= min(SPLIT-2, SPLIT-LOO) and up to ~12% tighter " +
      "where the block quotients are asymmetric",
    directOverMinRange: [0.8945223169112093, 1.0],
    maxImprovementMinOverDirect: 1.117915094005710, // MIN/DIRECT
    maxImprovementConfig: "{1,2} u {100,200}, x = 0.02 (L1=1.0, L2=0.128)",
  },
  doesNotCloseCollar: {
    claim:
      "DIRECT retains the 1/(1-sigma^2) collar and collapses exactly to SPLIT-2 " +
      "in the symmetric-twin limit, so the imp-95378 nearby-cluster wedge survives",
    directOverExactRange: [1.193732003605846, 3221141.6638600994],
    worstConfig: "{1,1.1} u {1.2,1.32}, x = 3 (nearby twin lattice, sigma -> 1)",
    worstDirectOverExact: 3221141.6638600994,
    worstMinOverExact: 3221141.7215002393, // imp-95378 literal; DIRECT ~ MIN here
    symmetricTwinCollapseDirectOverSplit2: 0.9999999302356093,
    collarLaw:
      "DIRECT/exact ~ C/(1-sigma): on {1,1.1} u {1+e,1.1+e} x=6, " +
      "DIRECT/exact*(1-sigma) stays O(1e-2) while DIRECT/exact runs to thousands",
  },
  anchor: {
    config: "{1,1.1} u {2,2.2}, x = 6 (imp-95250 / imp-95378 anchor)",
    exact: 0.0154579142964125,
    direct: 1.4423022557392733,
    split2: 2.8624514140987447,
    splitLoo: 1.4423043894311507,
    directOverExact: 93.30509726,
    note: "DIRECT ties SPLIT-LOO here (L2 << L1, sigma -> 1); both ~ 93.3x exact",
  },
  residual:
    "the collar wedge closes only with the full joint pencil (NOT 2x2-reducible)" +
    "; the AM-GM numerator gain DIRECT delivers is bounded and vanishes at L1=L2",
  honestScope:
    "THEOREM DIRECT-2 is elementary (rank-one 2x2 Rayleigh quotient); content = " +
    "the ordering DIRECT <= MIN, the ~12% asymmetric gain, and the symmetric- " +
    "collapse proof that the collar survives; m = 2 only; model family only; " +
    "changes no bound; NO QED; no refereed bound is changed",
  verdict:
    "DERIVATION + MEASUREMENT: the direct imp-95249 seam pencil reduces to the " +
    "2x2 eigenproblem (c c^T, M), giving DIRECT = (L1+L2+2 sigma sqrt(L1 L2))/" +
    "(1-sigma^2), a single admissible certificate UNIFORMLY <= min(SPLIT-2, " +
    "SPLIT-LOO) and up to ~12% tighter for asymmetric blocks. It does NOT close " +
    "the imp-95378 collar-limited nearby-cluster wedge (same 1/(1-sigma^2) " +
    "collar; collapses to SPLIT-2 at L1=L2); the wedge is intrinsic to the angle " +
    "relaxation of the denominator, closable only by the full joint pencil. " +
    "Changes no bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-contained numeric machinery (import-light; mirrors imp-95378)
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
        if (s <= 0) throw new Error("imp-95426 chol: pencil base not PD");
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
function cos2Direct(n1, n2) {
  const G1 = cauchyGram(n1);
  const G12 = crossGram(n1, n2);
  const M = matMul(matMul(G12, invSym(cauchyGram(n2))), transpose(G12));
  const ev = pencilEig(M, G1);
  return ev[ev.length - 1];
}

// SPLIT-2, SPLIT-LOO, their min, the DIRECT 2x2 seam bound, and the EXACT
// joint pencil over V1 u V2
function certs(b1, b2, x) {
  const s2 = cos2Direct(b1, b2);
  const sigma = Math.sqrt(s2);
  const l1 = lamExact(b1, x);
  const l2 = lamExact(b2, x);
  const split2 = (l1 + l2) / (1 - sigma);
  const splitLoo = (Math.sqrt(l1 / (1 - s2)) + Math.sqrt(l2 / (1 - s2))) ** 2;
  const mn = Math.min(split2, splitLoo);
  const direct = (l1 + l2 + 2 * sigma * Math.sqrt(l1 * l2)) / (1 - s2);
  const exact = lamExact([...b1, ...b2], x);
  return {
    sigma,
    l1,
    l2,
    split2,
    splitLoo,
    mn,
    direct,
    exact,
    directOverMin: direct / mn,
    directOverExact: direct / exact,
  };
}

// ---------------------------------------------------------------------------
// Measured surface (recomputed at load; same grid as imp-95378 / imp-95256)
// ---------------------------------------------------------------------------

const SURFACE = (() => {
  const rows = [];
  for (const x of [3, 4, 6, 8, 10])
    for (const s of [1.2, 1.5, 2, 3, 5])
      rows.push(certs([1, 1.1], [s, s * 1.1], x));
  for (const [b1, b2] of [
    [[1, 1.05], [50, 52]],
    [[1, 2], [100, 200]],
  ])
    for (const x of [0.01, 0.02, 0.05, 0.1, 0.2])
      rows.push(certs(b1, b2, x));
  return rows;
})();

export const IMP95426_SURFACE_SUMMARY = {
  points: SURFACE.length,
  directOverMinRange: [
    Math.min(...SURFACE.map((r) => r.directOverMin)),
    Math.max(...SURFACE.map((r) => r.directOverMin)),
  ],
  maxImprovementMinOverDirect: Math.max(...SURFACE.map((r) => r.mn / r.direct)),
  directOverExactRange: [
    Math.min(...SURFACE.map((r) => r.directOverExact)),
    Math.max(...SURFACE.map((r) => r.directOverExact)),
  ],
  allAdmissible: SURFACE.every((r) => r.direct >= r.exact * (1 - 1e-9)),
  directNeverWorseThanMin: SURFACE.every((r) => r.direct <= r.mn * (1 + 1e-9)),
};

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95426_ASSERTIONS = [
  {
    id: "imp95426-direct-is-admissible",
    description:
      "DIRECT = (L1+L2+2 sigma sqrt(L1 L2))/(1-sigma^2) >= exact joint pencil " +
      "at every surface point (valid upper bound, 2x2 rank-one reduction)",
    holds: () => SURFACE.every((r) => r.direct >= r.exact * (1 - 1e-9)),
  },
  {
    id: "imp95426-direct-never-worse-than-min",
    description:
      "DIRECT <= min(SPLIT-2, SPLIT-LOO) at every surface point (uniformly the " +
      "tightest of the three closed forms)",
    holds: () => SURFACE.every((r) => r.direct <= r.mn * (1 + 1e-9)),
  },
  {
    id: "imp95426-direct-ordering-closed-form",
    description:
      "the elementary ordering identities hold to machine precision: " +
      "(SPLIT-2 - DIRECT)(1-sigma^2) = sigma(sqrt(L1)-sqrt(L2))^2 (AM-GM slack) " +
      "and DIRECT(1-sigma^2) = SPLIT-LOO(1-sigma^2) - 2(1-sigma)sqrt(L1 L2)",
    holds: () =>
      SURFACE.every((r) => {
        const gap2 = (r.split2 - r.direct) * (1 - r.sigma ** 2);
        const amgm = r.sigma * (Math.sqrt(r.l1) - Math.sqrt(r.l2)) ** 2;
        const looId =
          r.direct * (1 - r.sigma ** 2) -
          (r.splitLoo * (1 - r.sigma ** 2) -
            2 * (1 - r.sigma) * Math.sqrt(r.l1 * r.l2));
        const scale = Math.max(1, r.split2, r.splitLoo);
        return (
          Math.abs(gap2 - amgm) < 1e-9 * scale && Math.abs(looId) < 1e-9 * scale
        );
      }),
  },
  {
    id: "imp95426-direct-improves-on-min-asymmetric",
    description:
      "DIRECT is up to ~12% tighter than the min where the block quotients are " +
      "asymmetric: max MIN/DIRECT ~ 1.1179 at {1,2} u {100,200}, x = 0.02",
    holds: () => {
      const r = certs([1, 2], [100, 200], 0.02);
      const m = Math.max(...SURFACE.map((s) => s.mn / s.direct));
      return (
        Math.abs(r.mn / r.direct - 1.117915094005710) < 1e-6 &&
        m > 1.11 &&
        m < 1.12
      );
    },
  },
  {
    id: "imp95426-collar-not-closed-symmetric-collapse",
    description:
      "DIRECT does NOT close the collar: in the symmetric-twin limit L1=L2 it " +
      "collapses exactly to SPLIT-2 (near-identical twins: DIRECT/SPLIT-2 ~ 1), " +
      "and the worst-point DIRECT/exact ~ 3.22e6 matches MIN/exact",
    holds: () => {
      const rsym = certs([1, 1.1], [1.0001, 1.10011], 6);
      const rworst = certs([1, 1.1], [1.2, 1.32], 3);
      return (
        Math.abs(rsym.direct / rsym.split2 - 1) < 1e-6 &&
        rworst.directOverExact > 1e6 &&
        Math.abs(rworst.direct / rworst.mn - 1) < 1e-6
      );
    },
  },
  {
    id: "imp95426-collar-law",
    description:
      "the residual looseness tracks the shared collar 1/(1-sigma): on the " +
      "sweep {1,1.1} u {1+e,1.1+e} x=6, DIRECT/exact*(1-sigma) stays O(1e-1) " +
      "while 1/(1-sigma) diverges, so DIRECT/exact ~ C/(1-sigma)",
    holds: () => {
      const products = [2, 1, 0.6, 0.4].map((e) => {
        const r = certs([1, 1.1], [1 + e, 1.1 + e], 6);
        return r.directOverExact * (1 - r.sigma);
      });
      return products.every((p) => p > 0 && p < 0.2);
    },
  },
  {
    id: "imp95426-anchor-reproduces",
    description:
      "the imp-95378 anchor {1,1.1} u {2,2.2} x=6 recomputes (rel 1e-6): " +
      "exact 0.0154579, DIRECT 1.442302 (ties SPLIT-LOO), DIRECT/exact ~ 93.3",
    holds: () => {
      const r = certs([1, 1.1], [2, 2.2], 6);
      const A = IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.anchor;
      return (
        Math.abs(r.exact - A.exact) < 1e-6 * A.exact &&
        Math.abs(r.direct - A.direct) < 1e-6 * A.direct &&
        Math.abs(r.directOverExact - A.directOverExact) <
          1e-3 * A.directOverExact &&
        r.direct <= r.mn * (1 + 1e-9)
      );
    },
  },
  {
    id: "imp95426-verdict-honesty",
    description:
      "verdict and scope carry the honest labels: DERIVATION + MEASUREMENT, " +
      "uniformly sharper than the min, does NOT close the collar wedge, no bound " +
      "change, no QED, no refereed bound is changed",
    holds: () =>
      /DERIVATION \+ MEASUREMENT/.test(
        IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.verdict,
      ) &&
      /UNIFORMLY <= min/.test(
        IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.verdict,
      ) &&
      /does NOT close/.test(
        IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.verdict,
      ) &&
      /Changes no bound/.test(
        IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.verdict,
      ) &&
      /NO QED/.test(IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND.verdict),
  },
];

for (const a of IMP95426_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95426-direct-seam-pencil-twoblock-bound assertion failed: ${a.id}`,
    );
  }
}

export default IMP95426_DIRECT_SEAM_PENCIL_TWOBLOCK_BOUND;
