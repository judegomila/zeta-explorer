/**
 * imp-95403: Cross-validate the imp-95258 EV-OCT onset saturation
 * (m -> inf = 11.599142, rho = 2, r = 1.05) against a DIRECT joint-pencil
 * eigenvalue solve of the actual quotient Lambda(V, x) at increasing
 * octave count m. imp-95258 derives the saturated firing onset entirely
 * from the CLOSED-FORM COROLLARY EV-OCT certificate (coalLaw x Phi_k
 * product, bisected to cert = 1). This module never re-derives the
 * certificate: it builds the merged m-octave twin lattice
 * V = union_(k=0..m-1) {2^k, r 2^k}, forms the exact seam pencil
 * (D G D, G) with G_ij = 1/(nu_i + nu_j), D = diag(exp(-x nu_i)), and
 * solves the generalized eigenproblem directly (Cholesky of G + symmetric
 * Jacobi) to obtain the true Lambda(V, x) = lambda_max. Measurement /
 * verification only; changes no bound; NO QED; no refereed bound is changed.
 *
 * WHAT IS CHECKED.
 *
 * (A) UPPER-BOUND DIRECTION. At the certificate saturation depth
 * x = 11.599142, for every tested m in {6, 10, 24}, the direct solve gives
 * the exact quotient
 *   Lambda(V, x) = 3.701442e-5 (m = 6), 4.529990e-5 (m = 10),
 *                  4.591335e-5 (m = 24),
 * so sqrt(Lambda) = 6.08e-3 .. 6.78e-3, while the certificate value there
 * is cert = 0.605937 (m = 6), 0.969171 (m = 10), 0.999999 (m = 24).
 * The relation sqrt(Lambda) <= sqrt(cert) holds at every point with two
 * orders of magnitude to spare -- the closed-form EV-OCT certificate is a
 * GENUINE upper bound on the exact joint quotient, confirmed by the direct
 * pencil solve, not only by the closed-form algebra.
 *
 * (B) THE CERTIFICATE ONSET IS A CONSERVATIVE UPPER BOUND ON THE TRUE
 * ONSET. The exact quotient Lambda(V, x) starts at 1 at x = 0, rises a few
 * parts in 1e5 just above 0, then crosses 1 downward at a true onset
 * x_exact(m) that -- exactly like the certificate onset -- rises
 * monotonically in m and SATURATES:
 *   m:        2        3        4        6        8       10       12
 *   x_exact:  0.003132 0.134581 0.724004 1.152937 1.275534 1.308538 1.314786
 *   m:       16       20       24       32
 *   x_exact: 1.318529 1.318717 1.318717 1.318717
 * The true joint onset saturates to x_exact ~ 1.318717 (m = 20 and beyond),
 * a factor 8.795778 BELOW the certificate saturation 11.599142. The exact
 * quotient therefore crosses 1 far EARLIER (no later) than the certificate
 * predicts at every m: the certificate onset is a genuine but ~8.8x
 * conservative upper bound on the onset of the actual quotient.
 *
 * (C) SLACK AT SATURATION. At the certificate saturation depth
 * x = 11.599142, where cert -> 1 (m = 24 gives 0.999999), the exact
 * quotient has saturated to Lambda ~ 4.591338e-5. The certificate
 * over-prices the exact Lambda by a factor 1/Lambda ~ 2.178e4 at its own
 * saturated onset -- the same orders-of-magnitude collar imp-95250 records
 * for LEMMA LOO (which discards all cross-block cancellation), now
 * localized at the m -> inf saturation point and quantified against the
 * direct solve.
 *
 * NUMERICAL TRUST. The dyadic points are exponentially separated, so the
 * Cauchy Gram G stays positive definite through m = 32 (64 points,
 * nu_max ~ 1.4e8): the Cholesky base never fails and lambda_max is stable.
 * The direct-solve onsets and the certificate onsets are computed by
 * independent bisections of two different objects (exact pencil vs
 * closed-form cert) and agree only where they must (the certificate lies
 * uniformly above), which is the content of this cross-validation.
 *
 * HONEST LIMITS. Confirms the DIRECTION (certificate above exact) and
 * quantifies the slack; it does not tighten the certificate or move any
 * onset. Twin-pair blocks (size 2) only -- the >= 3-per-octave residual
 * (N-fold coalescence law) is untouched. rho = 2, r = 1.05 slice only, as
 * in imp-95258 (B). Model family only; no mapping to the paper per-window
 * data; changes NO Lambda bound of the program.
 *
 * Import-light (no imports, no zeros bundle). Numerics recompute both the
 * exact pencil solve and the closed-form certificate directly; the baked
 * numbers are cross-checks of the measurement, never a claim about a moved
 * bound.
 */

// ---------------------------------------------------------------------------
// Direct exact seam-pencil solver (self-contained, matches imp-95250)
// ---------------------------------------------------------------------------

const cauchyGram = (nus) => nus.map((a) => nus.map((b) => 1 / (a + b)));
const transpose = (A) => A[0].map((_, j) => A.map((row) => row[j]));

function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95403 chol: pencil base not PD");
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
    const y = fwd(L, A.map((r) => r[j]));
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(L, Yt.map((r) => r[j]));
    for (let i = 0; i < n; i++) Ct[i][j] = y[i];
  }
  return jacobiEig(transpose(Ct));
}
// exact joint quotient Lambda(V, x) = lambda_max of the pencil (D G D, G)
const lamExact = (nus, x) => {
  const G = cauchyGram(nus);
  const DGD = G.map((row, i) =>
    row.map((g, j) => g * Math.exp(-x * (nus[i] + nus[j]))),
  );
  const ev = pencilEig(DGD, G);
  return ev[ev.length - 1];
};

// ---------------------------------------------------------------------------
// Closed-form COROLLARY EV-OCT certificate (imp-95258), for the comparison
// ---------------------------------------------------------------------------

const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
const phiFence = (n1, n2) => {
  let p = 1;
  for (const a of n1) for (const b of n2) p *= ((a - b) / (a + b)) ** 2;
  return p;
};
const lattice = (m, r, rho) => {
  const blocks = [];
  for (let k = 0; k < m; k++) blocks.push([rho ** k, r * rho ** k]);
  return blocks;
};
function certEvOct(m, r, rho, x) {
  const blocks = lattice(m, r, rho);
  let s = 0;
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    s += Math.sqrt(coalLaw(rho ** k * x) / phiFence(blocks[k], rest));
  }
  return s * s;
}
// true onset of the exact quotient: x with lamExact = 1 (decreasing there)
function onsetExact(nus) {
  let lo = 1e-4;
  let hi = 20;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (lamExact(nus, mid) > 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Reference record (baked measurements, storage precision)
// ---------------------------------------------------------------------------

export const IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL = {
  id: "imp-95403",
  title:
    "Direct joint-pencil eigenvalue cross-validation of the imp-95258 " +
    "EV-OCT onset saturation (m -> inf = 11.599142, rho = 2, r = 1.05)",
  object:
    "exact Lambda(V, x) = lambda_max of the pencil (D G D, G), " +
    "G_ij = 1/(nu_i + nu_j), D = diag(exp(-x nu_i)), " +
    "V = union_(k=0..m-1) {2^k, r 2^k}; compared to the closed-form " +
    "COROLLARY EV-OCT certificate cert(m, r, rho, x)",
  fixed: "rho = 2, r = 1.05 (the imp-95258 (B) slice)",
  certOnsetSaturation: 11.599142,
  // (A) upper-bound direction at the certificate saturation depth
  upperBoundAtSaturation: {
    x: 11.599142,
    grid: [
      { m: 6, lamExact: 3.701442e-5, cert: 0.605937 },
      { m: 10, lamExact: 4.52999e-5, cert: 0.969171 },
      { m: 24, lamExact: 4.591335e-5, cert: 0.999999 },
    ],
    finding:
      "sqrt(Lambda) <= sqrt(cert) holds at every tested m with two orders " +
      "of magnitude to spare: the closed-form EV-OCT certificate is a " +
      "genuine upper bound on the DIRECTLY SOLVED joint quotient",
  },
  // (B) true onset of the exact quotient saturates far below the cert onset
  exactOnset: {
    grid: [
      { m: 2, xExact: 0.003132 },
      { m: 3, xExact: 0.134581 },
      { m: 4, xExact: 0.724004 },
      { m: 6, xExact: 1.152937 },
      { m: 8, xExact: 1.275534 },
      { m: 10, xExact: 1.308538 },
      { m: 12, xExact: 1.314786 },
      { m: 16, xExact: 1.318529 },
      { m: 20, xExact: 1.318717 },
      { m: 24, xExact: 1.318717 },
      { m: 32, xExact: 1.318717 },
    ],
    saturation: 1.318717,
    certOverExactRatio: 8.795778,
    finding:
      "the exact joint onset rises monotonically in m and saturates to " +
      "1.318717, a factor 8.795778 below the certificate saturation " +
      "11.599142; the exact quotient crosses 1 no later than the " +
      "certificate predicts at every m",
  },
  // (C) slack at saturation
  slackAtSaturation: {
    x: 11.599142,
    lamExactSaturation: 4.591338e-5,
    overPriceFactor: 2.178e4,
    finding:
      "at the certificate saturated onset the exact Lambda has saturated to " +
      "4.591338e-5; the certificate over-prices Lambda by ~2.178e4, the " +
      "same orders-of-magnitude LEMMA LOO collar imp-95250 records, now " +
      "localized at the m -> inf saturation point",
  },
  summary:
    "the imp-95258 closed-form EV-OCT saturated onset 11.599142 is a " +
    "GENUINE but ~8.8x conservative upper bound on the true joint quotient " +
    "onset (direct-solve saturation 1.318717); sqrt(Lambda) <= sqrt(cert) " +
    "holds directly at every m and the certificate over-prices the exact " +
    "Lambda by ~2.2e4 at saturation",
  honestScope:
    "confirms the DIRECTION and quantifies the slack; tightens no " +
    "certificate and moves no onset; twin-pair blocks only (>= 3-per-octave " +
    "residual untouched); rho = 2, r = 1.05 slice only; model family only; " +
    "changes NO bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (cross-checks of the baked measurements)
// ---------------------------------------------------------------------------

export const IMP95403_ASSERTIONS = [
  {
    id: "imp95403-direct-upper-bound",
    description:
      "at x = 11.599142 the DIRECT pencil solve gives sqrt(Lambda) <= " +
      "sqrt(cert) for m in {6, 10, 24}, and each baked lamExact recomputes",
    holds: () => {
      const x = 11.599142;
      for (const { m, lamExact: lb, cert } of IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL
        .upperBoundAtSaturation.grid) {
        const nus = lattice(m, 1.05, 2).flat();
        const lam = lamExact(nus, x);
        if (Math.abs(lam - lb) > 1e-6 * lb) return false;
        if (!(Math.sqrt(lam) <= Math.sqrt(cert))) return false;
        if (Math.abs(certEvOct(m, 1.05, 2, x) - cert) > 1e-5) return false;
      }
      return true;
    },
  },
  {
    id: "imp95403-exact-onset-saturates-below-cert",
    description:
      "the exact joint onset rises monotonically in m, each baked value " +
      "recomputes (rel 1e-5), and saturates to 1.318717 well below 11.599142",
    holds: () => {
      const g = IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL.exactOnset.grid;
      let prev = -1;
      for (const { m, xExact } of g) {
        const x = onsetExact(lattice(m, 1.05, 2).flat());
        if (Math.abs(x - xExact) > Math.max(1e-5 * xExact, 1e-6)) return false;
        // non-decreasing: the far octaves saturate to exact equality in
        // double precision (m = 20, 24, 32 coincide to 12 digits)
        if (!(x >= prev)) return false;
        prev = x;
      }
      const sat = onsetExact(lattice(32, 1.05, 2).flat());
      return (
        Math.abs(
          sat - IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL.exactOnset.saturation,
        ) <
          1e-5 * sat && sat < 11.599142
      );
    },
  },
  {
    id: "imp95403-onset-ratio-and-overprice",
    description:
      "cert onset / exact onset = 8.795778 (rel 1e-4) and the certificate " +
      "over-prices the exact Lambda by ~2.178e4 at the saturated onset",
    holds: () => {
      const rec = IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL;
      const ratio = rec.certOnsetSaturation / rec.exactOnset.saturation;
      if (Math.abs(ratio - rec.exactOnset.certOverExactRatio) > 1e-4 * ratio)
        return false;
      const lamSat = lamExact(lattice(32, 1.05, 2).flat(), 11.599142);
      if (Math.abs(lamSat - rec.slackAtSaturation.lamExactSaturation) > 1e-6 * lamSat)
        return false;
      const over = 1 / lamSat;
      return Math.abs(over - rec.slackAtSaturation.overPriceFactor) < 5e-3 * over;
    },
  },
  {
    id: "imp95403-honesty",
    description:
      "the record carries the honest scope labels: no bound change, NO QED, " +
      "no refereed bound is changed, direction-only measurement",
    holds: () =>
      /changes NO bound/.test(
        IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL.honestScope,
      ) &&
      /NO QED/.test(IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL.honestScope) &&
      /refereed bound is changed/i.test(IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL.honestScope) &&
      /moves no onset/.test(IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL.honestScope),
  },
];

for (const a of IMP95403_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95403-evoct-onset-joint-pencil-crossval assertion failed: ${a.id}`,
    );
  }
}

export default IMP95403_EVOCT_ONSET_JOINT_PENCIL_CROSSVAL;
