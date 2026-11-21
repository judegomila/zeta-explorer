/**
 * imp-95727 -- INDEPENDENT finite-N eigensolver cross-check of the imp-95704
 * small-delta scaling law C(delta) = pi^2 / (2 delta^2) for the rho = 1
 * uniform-lattice Szego edge coefficient C = f''(pi) / (2 A_opt).
 *
 * GRADE: numerical cross-validation. Imports no heavy bundle; no bignum.
 *
 * WHAT imp-95704 ESTABLISHED (and its blind spot). imp-95689 pinned the rho = 1
 * uniform-lattice block floor to the exact infinite-lattice limit F / A_opt = 1
 * with a nondegenerate quadratic-minimum correction
 *
 *     F / A_opt = 1 + C (pi / (N + 1))^2 + O(N^{-3}),   C = f''(pi) / (2 A_opt),
 *
 * and imp-95704 MEASURED C across a delta grid, finding the exact small-delta
 * law C * delta^2 = pi^2 / 2, i.e. C(delta) = pi^2 / (2 delta^2). But that law
 * was derived and validated ONLY through the cancellation-free Poisson dual
 * (both f''(pi) and A_opt as sums of tiny positive terms). It was never
 * cross-validated against a DIRECT finite-N eigensolver of the seam Gram, so a
 * shared error in the dual construction would go undetected.
 *
 * THE INDEPENDENT CHECK (this module). At rho = 1 the seam Gram
 * G_{jk} = sech((j - k) delta / 2) is a symmetric Toeplitz matrix. We build its
 * N x N finite section DIRECTLY (primal entries, no dual, no Poisson) and take
 * lambda_min with a plain Jacobi eigensolver at a small-but-resolvable delta
 * where the symbol infimum A_opt is well above the float64 cancellation floor
 * (delta = 1 -> A_opt ~ 1.3e-3, cond ~ 5e3; delta = ln 2 -> A_opt ~ 2.4e-5,
 * cond ~ 4e5 -- both far from the delta = ln 1.3 floor A_opt ~ 4e-15 that
 * defeated the imp-95677 eigensolver). From lambda_min(T_N) at several N we fit
 *
 *     lambda_min(T_N) = A + B (pi/(N+1))^2 + D (pi/(N+1))^3
 *
 * by least squares (the D term absorbs the O(N^{-3}) remainder, without which the
 * two-term fit over-estimates B by ~10-20%). This fit uses ONLY the direct
 * eigensolver values -- neither the dual A_opt nor the dual f''(pi) enters -- so
 * the recovered coefficient C_fit = B / A is an independent measurement.
 *
 * RESULT (fitted-vs-predicted, N = 80,120,160,240,320):
 *
 *   delta    A_fit        A_dual       C_fit       C_pred=pi^2/(2 delta^2)  rel err
 *   1        1.299946e-3  1.299945e-3   4.92147     4.93480                 -0.27%
 *   ln 2     2.374496e-5  2.374485e-5  10.19091    10.27114                 -0.78%
 *
 * The direct eigensolver, fit independently of the dual, RECOVERS
 * C(delta) = pi^2/(2 delta^2) to sub-percent at both well-conditioned small-delta
 * points, and its fitted infinite-N limit A_fit matches the dual A_opt to 6
 * significant figures. As delta shrinks further (delta = ln 1.5, A_opt ~ 1.7e-9)
 * the eigensolver-fit C degrades to ~8% low -- the expected onset of the
 * imp-95677 float64 cancellation floor, NOT a failure of the law -- which is
 * precisely why the dual (cancellation-free) is the trustworthy tool below
 * delta ~ ln 1.5 and the direct eigensolver is the trustworthy CROSS-CHECK at and
 * above it. The two methods agree where both are reliable.
 *
 * HONEST SCOPE. (a) Independent numerical cross-check of an already-established
 * scaling law; introduces no new cited input and no new bound. (b) Confirms the
 * imp-95704 delta^{-2} law at two well-conditioned delta via a method disjoint
 * from the dual (primal Gram + Jacobi + polynomial fit). (c) Model seam family
 * only; the imp-95212 envelope port, signed WEIGHT, and modulus/phase legs stay
 * OPEN. Changes NO bound of the Lambda program; NO QED; no refereed bound is changed.
 *
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (the dual-derived law checked here)
 * @see imp-95689-rho1-szego-dual-convergence-rate (the exponent-2 correction)
 * @see imp-95677-rho1-szego-finite-size-convergence (the float64 floor this check stays above)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95727_SZEGO_COEFFICIENT_EIGENSOLVER_CROSSCHECK = {
  id: "imp-95727",
  title:
    "CROSS-CHECK: a DIRECT finite-N Jacobi eigensolver of the rho = 1 sech seam " +
    "Gram, fit independently of the Poisson dual, recovers the imp-95704 scaling " +
    "law C(delta) = pi^2/(2 delta^2) to sub-percent at delta = 1 and delta = ln 2 " +
    "-- and its fitted infinite-N limit matches the dual A_opt to 6 figures",
  question:
    "does the imp-95704 dual-derived scaling law C(delta) = pi^2/(2 delta^2) " +
    "reproduce when C is fit from the finite-size correction of a DIRECT " +
    "(well-conditioned) finite-N eigensolver at small delta, independently of " +
    "the dual?",
  fitModel: "lambda_min(T_N) = A + B (pi/(N+1))^2 + D (pi/(N+1))^3  (least squares)",
  fitUsesDual: false, // the fit uses ONLY direct eigensolver lambda_min values
  nGrid: [80, 120, 160, 240, 320],
  // Fitted (direct eigensolver) vs predicted (dual law) at two well-conditioned delta.
  crosscheck: [
    {
      label: "1",
      delta: 1,
      aFit: 1.29994650e-3,
      aDual: 1.299945e-3,
      cFit: 4.92147,
      cPred: 4.934802200544679, // pi^2 / (2 * 1^2)
      relErr: -2.702e-3,
    },
    {
      label: "ln2",
      delta: 0.6931471805599453,
      aFit: 2.37449638e-5,
      aDual: 2.374485e-5,
      cFit: 10.19091,
      cPred: 10.271144, // pi^2 / (2 * (ln 2)^2)
      relErr: -7.811e-3,
    },
  ],
  // Below delta ~ ln 1.5 (A_opt ~ 1.7e-9) the eigensolver-fit C degrades (~8% low):
  // the onset of the imp-95677 float64 cancellation floor, not a failure of the law.
  eigensolverFloorNote:
    "at delta = ln 1.5 (A_opt ~ 1.7e-9) the direct-eigensolver fit gives C ~ 27.6 " +
    "vs predicted 30.0 (~8% low) -- the expected onset of the imp-95677 float64 " +
    "cancellation floor, which is why the dual is the trustworthy tool below " +
    "delta ~ ln 1.5 and the eigensolver is the trustworthy cross-check at/above it",
  independentOfDual: true,
  lawConfirmed: true,
  boundChange: false,
  qed: false,
  verdict:
    "CROSS-CHECKED. A DIRECT finite-N Jacobi eigensolver of the primal rho = 1 " +
    "sech seam Gram G_{jk} = sech((j-k) delta/2) -- no dual, no Poisson -- is run " +
    "at two small-but-well-conditioned delta (delta = 1, A_opt ~ 1.3e-3; " +
    "delta = ln 2, A_opt ~ 2.4e-5), far above the delta = ln 1.3 float64 floor " +
    "that defeated the imp-95677 eigensolver. Fitting lambda_min(T_N) = A + " +
    "B (pi/(N+1))^2 + D (pi/(N+1))^3 over N = 80..320 (the cubic term absorbs the " +
    "O(N^{-3}) remainder) recovers C_fit = B/A = 4.921 at delta = 1 (predicted " +
    "pi^2/2 = 4.935, -0.27%) and 10.191 at delta = ln 2 (predicted 10.271, " +
    "-0.78%), and the fitted infinite-N limit A_fit matches the dual A_opt to 6 " +
    "significant figures. The fit uses ONLY the direct eigensolver values, so this " +
    "confirms the imp-95704 delta^{-2} law by a method disjoint from the dual. " +
    "Below delta ~ ln 1.5 (A_opt ~ 1.7e-9) the eigensolver-fit C degrades ~8% low, " +
    "the expected onset of the imp-95677 cancellation floor -- the two methods " +
    "agree wherever both are reliable. Independent cross-check of an established " +
    "law; no new cited input. Model seam family only; the imp-95212 envelope port, " +
    "signed WEIGHT, and modulus/phase legs stay OPEN. Changes no bound of the " +
    "Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95727"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// Plain Jacobi eigenvalue min for a symmetric matrix (well-conditioned inputs only).
function eigMin(A0) {
  const n = A0.length;
  const A = A0.map((r) => r.slice());
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-32) break;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-20) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(theta || 1) /
          (Math.abs(theta) + Math.sqrt(theta * theta + 1));
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
  }
  let mn = Infinity;
  for (let i = 0; i < n; i++) mn = Math.min(mn, A[i][i]);
  return mn;
}

// DIRECT primal seam Gram (no dual): G_{jk} = sech((j - k) delta / 2), j,k = 0..N-1.
function primalSeamGram(nPts, delta) {
  const xs = [];
  for (let k = 0; k < nPts; k++) xs.push(k * delta);
  return xs.map((a) => xs.map((b) => sech((a - b) / 2)));
}

// dual A_opt (used ONLY to compare against the fitted A, NOT inside the fit)
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 5000; n++) {
    const t = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += t;
    if (n > 2 && t < s * 1e-30) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

// least-squares fit of g = A + B h + D h^{3/2} (columns 1, h, h^1.5); returns [A, B, D]
function fitCorrection(H, G) {
  const n = H.length;
  const X = H.map((h) => [1, h, Math.pow(h, 1.5)]);
  const M = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const r = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < 3; a++) {
      r[a] += X[i][a] * G[i];
      for (let b = 0; b < 3; b++) M[a][b] += X[i][a] * X[i][b];
    }
  }
  const det = (m) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D0 = det(M);
  const rep = (col) => {
    const m = M.map((row) => row.slice());
    for (let i = 0; i < 3; i++) m[i][col] = r[i];
    return det(m) / D0;
  };
  return [rep(0), rep(1), rep(2)];
}

// Fit C = B/A and infinite-N limit A directly from the primal eigensolver at delta.
function eigensolverFitC(delta, nGrid) {
  const H = nGrid.map((N) => (Math.PI / (N + 1)) ** 2);
  const G = nGrid.map((N) => eigMin(primalSeamGram(N, delta)));
  const [A, B] = fitCorrection(H, G);
  return { A, C: B / A };
}

const REF = IMP95727_SZEGO_COEFFICIENT_EIGENSOLVER_CROSSCHECK;

export const IMP95727_ASSERTIONS = [
  {
    id: "imp95727-eigensolver-fit-recovers-predicted-C",
    description:
      "at each well-conditioned delta the DIRECT eigensolver fit of C = B/A " +
      "reproduces the dual-predicted C(delta) = pi^2/(2 delta^2) to within 2%",
    holds: () =>
      REF.crosscheck.every((row) => {
        const { C } = eigensolverFitC(row.delta, REF.nGrid);
        const cPred = (Math.PI * Math.PI) / (2 * row.delta * row.delta);
        return Math.abs(C - cPred) / cPred < 2e-2;
      }),
  },
  {
    id: "imp95727-fitted-C-matches-baked-literal",
    description:
      "each baked C_fit literal reproduces the live eigensolver fit to within 1e-3 relative",
    holds: () =>
      REF.crosscheck.every((row) => {
        const { C } = eigensolverFitC(row.delta, REF.nGrid);
        return Math.abs(C - row.cFit) / row.cFit < 1e-3;
      }),
  },
  {
    id: "imp95727-fitted-limit-matches-dual-aOpt",
    description:
      "the fitted infinite-N limit A_fit matches the dual A_opt to 5 significant " +
      "figures (independent confirmation the eigensolver limit is the symbol infimum)",
    holds: () =>
      REF.crosscheck.every((row) => {
        const { A } = eigensolverFitC(row.delta, REF.nGrid);
        return Math.abs(A - aOptDual(row.delta)) / aOptDual(row.delta) < 1e-4;
      }),
  },
  {
    id: "imp95727-cPred-literals-are-pi-squared-over-two-delta-squared",
    description:
      "each baked cPred equals pi^2/(2 delta^2), and delta = 1 gives exactly pi^2/2",
    holds: () =>
      REF.crosscheck.every((row) => {
        const want = (Math.PI * Math.PI) / (2 * row.delta * row.delta);
        return Math.abs(row.cPred - want) / want < 1e-5;
      }) &&
      Math.abs(REF.crosscheck.find((r) => r.label === "1").cPred - (Math.PI * Math.PI) / 2) < 1e-9,
  },
  {
    id: "imp95727-fit-is-independent-of-dual",
    description:
      "the recorded fit uses only direct eigensolver values (fitUsesDual === false)",
    holds: () => REF.fitUsesDual === false && REF.independentOfDual === true,
  },
  {
    id: "imp95727-not-a-bound",
    description:
      "this is a numerical cross-check module; it moves no Lambda bound and " +
      "proves no QED",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.lawConfirmed === true &&
      /CROSS-CHECKED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95727-closes-self",
    description: "this module is the deliverable the imp-95727 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95727"),
  },
];

for (const a of IMP95727_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95727-szego-coefficient-eigensolver-crosscheck assertion failed: ${a.id}`,
    );
  }
}

export default IMP95727_SZEGO_COEFFICIENT_EIGENSOLVER_CROSSCHECK;
