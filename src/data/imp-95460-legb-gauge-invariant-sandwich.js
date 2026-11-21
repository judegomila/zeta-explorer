/**
 * @module imp-95460-legb-gauge-invariant-sandwich
 *
 * imp-95460 (fable-5, frontier): THEOREM G-INV + THEOREM G-SANDWICH + THEOREM
 * G-STRICT + COROLLARY G-RACE -- a RIGOROUS strengthening of the imp-95424
 * LEG B sufficient route and a re-scoping of the imp-95443 R1 decay-vs-margin
 * race into normalization-free (correlation / intrinsic-ratio) currency.
 * Pure finite-dimensional linear algebra; every statement proved below and
 * cross-checked by exact witnesses. Closes NOTHING analytic: the off-diagonal
 * correlation control stays OPEN as imp-95212-subgap-fresnel-airy-envelope-
 * port. Changes no bound; NO QED; no refereed bound is changed.
 *
 * SETTING (imp-95424). LEG B of the imp-95376 split verdict is
 *   LamBar_paper(d) <= Lambda(E_V, d),
 * both sides restricted-Rayleigh suprema over the same signed space R^N:
 *   Lambda(A, B) := sup over a != 0 of (a^T A a)/(a^T B a),
 * model pencil (A_m, B_m) with B_m = G Cauchy (PD), A_m = D_w G D_w (PSD,
 * D_w = diag(e^(-d nu_i))); paper pencil (A_p, B_p) the restricted / full
 * Gram matrices of the paper alias packets (B_p PD, A_p PSD). The imp-95424
 * sufficient route is the Loewner sandwich (O1) B_p >= B_m, (O2) A_p <= A_m.
 *
 * THEOREM G-INV (diagonal gauge invariance of the certificate value). For any
 * invertible diagonal D, Lambda(D A D, D B D) = Lambda(A, B). PROOF: the map
 * a -> D a is a bijection of R^N minus 0, and ((Da)^T A (Da))/((Da)^T B (Da))
 * ranges over exactly the values of the original quotient; take sups. QED
 * (this theorem; not the RH program). Interpretation: rescaling packet number
 * i by any t_i != 0 (a NORMALIZATION CONVENTION of the paper packets, carrying
 * no analytic content) maps the pencil by the congruence D = diag(t_i) and
 * leaves both LamBar_paper and Lambda(E_V, d) unchanged.
 *
 * THEOREM G-SANDWICH (gauged sufficient route). Let A_p be PSD, B_p and B_m
 * PD, A_m symmetric. If there EXISTS a positive diagonal D with
 *   (O1g)  D B_p D >= B_m   (PSD)   and   (O2g)  D A_p D <= A_m   (PSD),
 * then Lambda(A_p, B_p) <= Lambda(A_m, B_m). PROOF: by G-INV,
 * Lambda(A_p, B_p) = Lambda(D A_p D, D B_p D). For every a != 0:
 * 0 <= a^T D A_p D a <= a^T A_m a by (O2g) and A_p PSD, and
 * 0 < a^T B_m a <= a^T D B_p D a by (O1g) and B_m PD. Hence
 * (a^T D A_p D a)/(a^T D B_p D a) <= (a^T A_m a)/(a^T B_m a); take sups. QED
 * (this theorem). The imp-95424 route (O1)+(O2) is the special case D = I, so
 * the certifiable set is enlarged to the union over the N-parameter diagonal
 * gauge orbit. The gauged test is itself gauge-invariant: if (A_p, B_p) is
 * certified by gauge D, the renormalized pencil (D0 A_p D0, D0 B_p D0) is
 * certified by gauge D D0^(-1).
 *
 * THEOREM G-STRICT (the enlargement is strict; the ungauged sandwich is
 * normalization-sensitive while the value is not). On the imp-95424
 * configuration (nu = (1, 2.5), d = 1) take the pure per-packet
 * renormalization r = (1, 1/2): A_p := D_r A_m D_r, B_p := D_r B_m D_r.
 * Then (i) the LEG B inequality holds WITH EQUALITY,
 * Lambda(A_p, B_p) = Lambda(A_m, B_m), by G-INV; (ii) BOTH ungauged
 * obligations fail: A_m - A_p = [[0, b/2], [b/2, 3 a22 / 4]] with
 * b = (A_m)_12 > 0 has determinant -(b/2)^2 < 0, hence is INDEFINITE, and
 * B_p - B_m has the strictly negative diagonal entry -(3/4)(B_m)_22, hence is
 * not PSD; (iii) the gauged route fires at D = D_r^(-1) = diag(1, 2) with
 * exact equality in both (O1g) and (O2g). PROOF: (i) is G-INV; (ii) and (iii)
 * are the exact entrywise computations reproduced in the witness block below.
 * QED (this theorem). CONSEQUENCE: the imp-95424 sandwich can be broken by a
 * pure normalization convention that changes neither Rayleigh sup, so running
 * the imp-95443 R1 race on the UNGAUGED differences races against an
 * artifact; the race must be run in gauge-fixed coordinates.
 *
 * COROLLARY G-RACE (the gauge-fixed race, normalization-free currency).
 * Parameters: per-packet intrinsic restricted-energy ratios
 *   q_i := [(A_p)_ii / (B_p)_ii] / [(A_m)_ii / (B_m)_ii],
 * (the FA-2 / imp-95255 diagonal currency: (A_m)_ii/(B_m)_ii = e^(-2 d nu_i)
 * exactly, and the paper-side ratio is the y_min-bracket quantity; q_i is
 * invariant under per-packet rescaling), and the normalization-free
 * correlations beta_ij := (B_p)_ij / sqrt((B_p)_ii (B_p)_jj) (full-line),
 * alpha_ij := (A_p)_ij / sqrt((A_p)_ii (A_p)_jj) (restricted), with model
 * counterpart gamma_ij := G_ij / sqrt(G_ii G_jj). Fix kappa in
 * [1, 1/max_i q_i] (window NONEMPTY iff max_i q_i < 1, i.e. iff the intrinsic
 * diagonal ratio margin holds -- the piece whose direction imp-95255 FA-2
 * pins) and gauge D_ii := sqrt(kappa G_ii / (B_p)_ii). Then, writing
 * s_ij := sqrt(G_ii G_jj):
 *   Delta_B := D B_p D - B_m,  (Delta_B)_ii = (kappa - 1) G_ii,
 *     (Delta_B)_ij = kappa s_ij beta_ij - G_ij  (i != j);
 *   Delta_A := A_m - D A_p D,  (Delta_A)_ii = (A_m)_ii (1 - kappa q_i),
 *     (Delta_A)_ij = w_i w_j [ G_ij - kappa s_ij sqrt(q_i q_j) alpha_ij ].
 * If Delta_B >= 0 and Delta_A >= 0 then G-SANDWICH applies and LEG B holds.
 * For UNIFORM q_i = q and kappa = 1/sqrt(q) both differences take the
 * symmetric form (after the exact congruence by diag(w_i) on the A side):
 *   Delta_B = (kappa - 1) G + kappa E_B,   E_B := [ s_ij (beta_ij - gamma_ij) ],
 *   Delta_A = diag(w) [ (1 - sqrt(q)) G + sqrt(q) E_A ] diag(w),
 *     E_A := [ s_ij (gamma_ij - alpha_ij) ]  (both E zero-diagonal),
 * so a SUFFICIENT operator test is
 *   lambda_min(G) * (1 - sqrt(q)) >= max row sum of |s_ij| |dev_ij|
 * on each side (dev = beta - gamma resp. gamma - alpha), Gershgorin applied
 * to the zero-diagonal deviation term. RE-SCOPING of imp-95443 R1: the
 * diagonal funding of the race is the INTRINSIC ratio margin 1 - sqrt(q)
 * (normalization-free, direction already pinned), the model side contributes
 * the CLOSED-FORM lambda_min(G) of the Cauchy matrix, and the single open
 * deliverable of the imp-95212 port becomes a CORRELATION-DEVIATION decay
 * bound |beta - gamma|, |gamma - alpha| (not an absolute overlap bound, which
 * G-STRICT shows can be normalization-artifact-dominated).
 *
 * WITNESSES (all exact, computed in-module, assertions throw on violation).
 * (W1) G-INV: on the imp-95424 2x2 pencil and D = diag(1.7, 0.4) the two
 *      sups agree to machine precision.
 * (W2) G-STRICT: r = (1, 1/2): value equality exact; det(A_m - A_p) < 0
 *      (indefinite) and (B_p - B_m)_22 < 0 (not PSD) so BOTH ungauged
 *      obligations fail; the gauge D = diag(1, 2) restores both with equality.
 * (W3) G-RACE mechanics, N = 3 Cauchy lattice nu = (1, 2, 4), d = 0.6,
 *      uniform q = 0.8, kappa = 1/sqrt(q), paper-side diagonals carrying the
 *      normalization c = (0.8, 1.5, 1.0) (so BOTH ungauged obligations fail by
 *      strict diagonal violations): with correlation deviation 5e-5 both
 *      gauged differences are PSD (route FIRES; principal-minor test), with
 *      deviation 5e-3 both go non-PSD (the race is real, not free), at zero
 *      deviation the route fires across the window; the uniform-deviation
 *      firing threshold sits in (5e-4, 1.2e-3) (bisected in-module), matching
 *      the (1 - sqrt(q)) lambda_min(G)-scale prediction. An INDEPENDENT
 *      power-iteration evaluation of both pencil sups confirms the certified
 *      ordering Lambda_paper <= Lambda_model on the fired configuration.
 *
 * HONEST LIMITS. (a) The theorems are finite-dimensional linear algebra about
 * the ROUTE; no paper packet is transcribed, no Fresnel-Airy quantity is
 * computed, and the correlation-deviation bound the race needs is NOT proved
 * here -- it is exactly the surviving substance of imp-95212-subgap-fresnel-
 * airy-envelope-port, now in sharper currency. (b) G-SANDWICH is sufficient,
 * not necessary, even over the gauge orbit (Loewner ordering of the gauged
 * pencils is not implied by the eigenvalue ordering). (c) The G-RACE operator
 * test inherits lambda_min(G): for near-degenerate rates lambda_min of the
 * Cauchy matrix is exponentially small and the race stays thin -- the gauge
 * removes the NORMALIZATION obstruction (G-STRICT), not the near-degeneracy
 * obstruction (imp-95443 caveat, unchanged). (d) W3 is a synthetic
 * configuration exhibiting the mechanics, not a paper-window computation.
 * (e) Nothing here moves any Lambda bound; NO QED; no refereed bound is changed
 * . Import-light: no zeros bundle, no sibling
 * imports.
 */

// ---------- shared 2x2 pencil (imp-95424 configuration) ----------------------
const NU1 = 1.0;
const NU2 = 2.5;
const DEPTH2 = 1.0;
const W1 = Math.exp(-DEPTH2 * NU1);
const W2 = Math.exp(-DEPTH2 * NU2);
const G2 = [
  [1 / (2 * NU1), 1 / (NU1 + NU2)],
  [1 / (NU1 + NU2), 1 / (2 * NU2)],
];
const A_M2 = [
  [W1 * W1 * G2[0][0], W1 * W2 * G2[0][1]],
  [W1 * W2 * G2[1][0], W2 * W2 * G2[1][1]],
];

// larger generalized eigenvalue of a 2x2 pencil (A, B), B PD
function lambdaMax2(A, B) {
  const a = A[0][0], b = A[0][1], d = A[1][1];
  const p = B[0][0], r = B[0][1], q = B[1][1];
  const AA = p * q - r * r;
  const BB = a * q + d * p - 2 * b * r;
  const CC = a * d - b * b;
  const disc = Math.sqrt(BB * BB - 4 * AA * CC);
  return (BB + disc) / (2 * AA);
}

// diagonal congruence D M D for 2x2
function scale2(M, D) {
  return [
    [D[0] * D[0] * M[0][0], D[0] * D[1] * M[0][1]],
    [D[0] * D[1] * M[1][0], D[1] * D[1] * M[1][1]],
  ];
}

// (W1) gauge invariance, numeric cross-check of THEOREM G-INV
const LAMBDA_MODEL_2 = lambdaMax2(A_M2, G2);
const D_W1 = [1.7, 0.4];
const LAMBDA_GAUGED_2 = lambdaMax2(scale2(A_M2, D_W1), scale2(G2, D_W1));

// (W2) THEOREM G-STRICT witness: r = (1, 1/2) per-packet renormalization
const R_STRICT = [1, 0.5];
const A_P2 = scale2(A_M2, R_STRICT);
const B_P2 = scale2(G2, R_STRICT);
const LAMBDA_PAPER_2 = lambdaMax2(A_P2, B_P2);
const DA_UNGAUGED = [
  [A_M2[0][0] - A_P2[0][0], A_M2[0][1] - A_P2[0][1]],
  [A_M2[1][0] - A_P2[1][0], A_M2[1][1] - A_P2[1][1]],
];
const DA_UNGAUGED_DET = DA_UNGAUGED[0][0] * DA_UNGAUGED[1][1] - DA_UNGAUGED[0][1] * DA_UNGAUGED[1][0];
const DB_UNGAUGED_22 = B_P2[1][1] - G2[1][1];
const D_GAUGE_W2 = [1, 2]; // = 1/r entrywise
const A_P2_GAUGED = scale2(A_P2, D_GAUGE_W2);
const B_P2_GAUGED = scale2(B_P2, D_GAUGE_W2);
const W2_GAUGED_MAXDIFF = Math.max(
  Math.abs(A_P2_GAUGED[0][0] - A_M2[0][0]), Math.abs(A_P2_GAUGED[0][1] - A_M2[0][1]),
  Math.abs(A_P2_GAUGED[1][1] - A_M2[1][1]),
  Math.abs(B_P2_GAUGED[0][0] - G2[0][0]), Math.abs(B_P2_GAUGED[0][1] - G2[0][1]),
  Math.abs(B_P2_GAUGED[1][1] - G2[1][1]),
);

// ---------- (W3) G-RACE mechanics on the N = 3 Cauchy lattice ----------------
const NU3 = [1, 2, 4];
const DEPTH3 = 0.6;
const W3V = NU3.map((v) => Math.exp(-DEPTH3 * v));
const N3 = 3;
const G3 = NU3.map((vi) => NU3.map((vj) => 1 / (vi + vj)));
const GAMMA3 = G3.map((row, i) => row.map((g, j) => g / Math.sqrt(G3[i][i] * G3[j][j])));
const Q_UNIF = 0.8;
const KAPPA = 1 / Math.sqrt(Q_UNIF); // interior of the window [1, 1/q]
const C_NORM = [0.8, 1.5, 1.0]; // paper-side normalization: breaks BOTH ungauged obligations

// all seven principal minors of a symmetric 3x3; PSD iff all >= 0
function minors3(M) {
  const d1 = [M[0][0], M[1][1], M[2][2]];
  const d2 = [
    M[0][0] * M[1][1] - M[0][1] * M[0][1],
    M[0][0] * M[2][2] - M[0][2] * M[0][2],
    M[1][1] * M[2][2] - M[1][2] * M[1][2],
  ];
  const d3 = M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[1][2])
    - M[0][1] * (M[0][1] * M[2][2] - M[1][2] * M[0][2])
    + M[0][2] * (M[0][1] * M[1][2] - M[1][1] * M[0][2]);
  return { d1, d2, d3 };
}
function isPSD3(M, tol = 0) {
  const { d1, d2, d3 } = minors3(M);
  return d1.every((x) => x >= -tol) && d2.every((x) => x >= -tol) && d3 >= -tol;
}

// pair index for the three off-diagonal slots (0,1)->0, (0,2)->1, (1,2)->2
function pairIdx(i, j) { return Math.min(i, j) + Math.max(i, j) - 1; }

// build a synthetic paper pencil with prescribed correlation deviations
function buildPaperPencil(delB, delA) {
  const Bp = NU3.map((_, i) => NU3.map((_, j) => {
    if (i === j) return C_NORM[i] * G3[i][i];
    const beta = GAMMA3[i][j] + delB[pairIdx(i, j)];
    return beta * Math.sqrt(C_NORM[i] * G3[i][i] * C_NORM[j] * G3[j][j]);
  }));
  const Ap = NU3.map((_, i) => NU3.map((_, j) => {
    if (i === j) return Q_UNIF * W3V[i] * W3V[i] * Bp[i][i];
    const alpha = GAMMA3[i][j] - delA[pairIdx(i, j)];
    return alpha * Math.sqrt(
      Q_UNIF * W3V[i] * W3V[i] * Bp[i][i] * Q_UNIF * W3V[j] * W3V[j] * Bp[j][j],
    );
  }));
  return { Bp, Ap };
}

const A_M3 = NU3.map((_, i) => NU3.map((_, j) => W3V[i] * W3V[j] * G3[i][j]));

// gauged differences at gauge D_ii = sqrt(kappa G_ii / (B_p)_ii)
function gaugedDeltas(Bp, Ap) {
  const D = NU3.map((_, i) => Math.sqrt(KAPPA * G3[i][i] / Bp[i][i]));
  const dB = NU3.map((_, i) => NU3.map((_, j) => D[i] * D[j] * Bp[i][j] - G3[i][j]));
  const dA = NU3.map((_, i) => NU3.map((_, j) => A_M3[i][j] - D[i] * D[j] * Ap[i][j]));
  return { dB, dA };
}

const DEV_SMALL = [5e-5, 5e-5, 5e-5];
const DEV_LARGE = [5e-3, 5e-3, 5e-3];
const DEV_ZERO = [0, 0, 0];

const PENCIL_SMALL = buildPaperPencil(DEV_SMALL, DEV_SMALL);
const DELTAS_SMALL = gaugedDeltas(PENCIL_SMALL.Bp, PENCIL_SMALL.Ap);
const PENCIL_LARGE = buildPaperPencil(DEV_LARGE, DEV_LARGE);
const DELTAS_LARGE = gaugedDeltas(PENCIL_LARGE.Bp, PENCIL_LARGE.Ap);
const PENCIL_ZERO = buildPaperPencil(DEV_ZERO, DEV_ZERO);
const DELTAS_ZERO = gaugedDeltas(PENCIL_ZERO.Bp, PENCIL_ZERO.Ap);

// ungauged diagonal violations on the small-deviation configuration
const UNGAUGED_O1_DIAG_VIOLATION = PENCIL_SMALL.Bp[0][0] - G3[0][0]; // < 0 => O1 fails at D = I
const UNGAUGED_O2_DIAG_VIOLATION = A_M3[1][1] - PENCIL_SMALL.Ap[1][1]; // < 0 => O2 fails at D = I

// bisect the uniform-deviation firing threshold of the gauged race
function raceFires(dev) {
  const dv = [dev, dev, dev];
  const { Bp, Ap } = buildPaperPencil(dv, dv);
  const { dB, dA } = gaugedDeltas(Bp, Ap);
  return isPSD3(dB) && isPSD3(dA);
}
let THRESH_LO = 0;
let THRESH_HI = 5e-3;
for (let k = 0; k < 50; k += 1) {
  const mid = (THRESH_LO + THRESH_HI) / 2;
  if (raceFires(mid)) THRESH_LO = mid; else THRESH_HI = mid;
}
const FIRING_THRESHOLD = THRESH_LO;

// independent cross-check of the certified ordering: power iteration on B^(-1) A
function inv3(M) {
  const { d3 } = minors3(M);
  const cof = (r, s) => {
    const idx = [0, 1, 2].filter((x) => x !== r);
    const jdx = [0, 1, 2].filter((x) => x !== s);
    const m = M[idx[0]][jdx[0]] * M[idx[1]][jdx[1]] - M[idx[0]][jdx[1]] * M[idx[1]][jdx[0]];
    return ((r + s) % 2 === 0 ? 1 : -1) * m;
  };
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => cof(j, i) / d3));
}
function matvec(M, x) { return M.map((row) => row.reduce((s, v, j) => s + v * x[j], 0)); }
function lamMaxPencil3(A, B) {
  const Bi = inv3(B);
  let x = [1, 0.5, -0.3];
  for (let k = 0; k < 20000; k += 1) {
    const y = matvec(Bi, matvec(A, x));
    const nn = Math.hypot(y[0], y[1], y[2]);
    x = y.map((v) => v / nn);
  }
  const Ax = matvec(A, x);
  const Bx = matvec(B, x);
  return (x[0] * Ax[0] + x[1] * Ax[1] + x[2] * Ax[2]) / (x[0] * Bx[0] + x[1] * Bx[1] + x[2] * Bx[2]);
}
const LAMBDA_MODEL_3 = lamMaxPencil3(A_M3, G3);
const LAMBDA_PAPER_3 = lamMaxPencil3(PENCIL_SMALL.Ap, PENCIL_SMALL.Bp);

export const IMP95460_LEGB_GAUGE_INVARIANT_SANDWICH = {
  ticket: 'imp-95460',
  consumes: [
    'imp-95376 (LEG B split verdict)',
    'imp-95424 (obligation ledger: Loewner sandwich O1/O2, the D = I case)',
    'imp-95443 (establishment routes: R1 decay-vs-margin race)',
    'imp-95226 (E_V pencil model)',
    'imp-95255 (FA-2 intrinsic diagonal ratio direction)',
  ],
  theorems: {
    gInv: 'Lambda(D A D, D B D) = Lambda(A, B) for every invertible diagonal D '
      + '(substitution a -> D a; exact). Per-packet normalization is a gauge of the pencil; '
      + 'both LEG B Rayleigh sups are gauge-invariant.',
    gSandwich: 'if SOME positive diagonal D gives D B_p D >= B_m and D A_p D <= A_m (PSD), then '
      + 'Lambda(A_p, B_p) <= Lambda(A_m, B_m). Strictly contains the imp-95424 route (its D = I case); '
      + 'the gauged test is itself invariant under paper-side renormalization.',
    gStrict: 'strictness witness: a pure per-packet renormalization r = (1, 1/2) of the model pencil '
      + 'keeps both sups EQUAL (G-INV) yet breaks BOTH ungauged obligations (A_m - A_p indefinite, '
      + 'B_p - B_m with a negative diagonal entry); the gauge D = diag(1, 2) restores both with equality. '
      + 'The ungauged imp-95424/95443 race can therefore race against a normalization artifact.',
    gRace: 'gauge-fixed race at D_ii = sqrt(kappa G_ii / (B_p)_ii), kappa in [1, 1/max q_i] '
      + '(window nonempty iff the intrinsic diagonal ratio margin max q_i < 1, the FA-2-pinned direction): '
      + 'both gauged differences reduce (uniform q, kappa = 1/sqrt(q)) to '
      + '(1 - sqrt(q)) G + sqrt(q) [s o (correlation deviation)] up to exact congruences, so the '
      + 'imp-95212 port needs ONE deliverable: a decay bound on the normalization-free correlation '
      + 'deviations |beta - gamma| (full-line) and |gamma - alpha| (restricted) versus '
      + '(1 - sqrt(q)) lambda_min(G).',
  },
  config2x2: { nu: [NU1, NU2], depth: DEPTH2, rStrict: R_STRICT },
  config3x3: { nu: NU3, depth: DEPTH3, qUniform: Q_UNIF, kappa: KAPPA, cNorm: C_NORM },
  witness: {
    w1GaugeInvariance: {
      lambdaModel: LAMBDA_MODEL_2,
      lambdaGauged: LAMBDA_GAUGED_2,
      relDiff: Math.abs(LAMBDA_GAUGED_2 - LAMBDA_MODEL_2) / LAMBDA_MODEL_2,
    },
    w2Strictness: {
      lambdaPaper: LAMBDA_PAPER_2,
      lambdaModel: LAMBDA_MODEL_2,
      daUngaugedDet: DA_UNGAUGED_DET,
      dbUngaugedDiag22: DB_UNGAUGED_22,
      gaugedMaxEntryDiff: W2_GAUGED_MAXDIFF,
      note: 'values EQUAL, ungauged O2 indefinite (det < 0) and O1 broken (negative diagonal), '
        + 'gauged route fires with exact equality',
    },
    w3RaceMechanics: {
      smallDeviation: DEV_SMALL[0],
      smallFires: isPSD3(DELTAS_SMALL.dB) && isPSD3(DELTAS_SMALL.dA),
      largeDeviation: DEV_LARGE[0],
      largeFails: !(isPSD3(DELTAS_LARGE.dB) && isPSD3(DELTAS_LARGE.dA)),
      zeroFires: isPSD3(DELTAS_ZERO.dB, 1e-15) && isPSD3(DELTAS_ZERO.dA, 1e-15),
      ungaugedO1DiagViolation: UNGAUGED_O1_DIAG_VIOLATION,
      ungaugedO2DiagViolation: UNGAUGED_O2_DIAG_VIOLATION,
      firingThreshold: FIRING_THRESHOLD,
      lambdaModel: LAMBDA_MODEL_3,
      lambdaPaper: LAMBDA_PAPER_3,
      note: 'gauged route certifies a configuration where BOTH ungauged obligations provably fail '
        + '(strict diagonal violations); independent power-iteration confirms the certified ordering; '
        + 'past the deviation threshold the race is genuinely lost',
    },
  },
  reScoping:
    'imp-95443 R1 re-scoped: the diagonal funding of the decay-vs-margin race is the intrinsic '
    + 'restricted-ratio margin 1 - sqrt(q) (normalization-free), the model contributes the closed-form '
    + 'lambda_min of the Cauchy matrix, and the single surviving port deliverable is a CORRELATION-'
    + 'DEVIATION decay bound, not an absolute overlap bound. The gauge removes the normalization '
    + 'obstruction; it does NOT remove the near-degenerate-rate thinness (lambda_min(G) exponentially '
    + 'small for close rates), which stands as before.',
  honest:
    'RIGOROUS finite-dimensional theorems about the ROUTE (G-INV, G-SANDWICH, G-STRICT proved in the '
    + 'header; witnesses exact), but NOTHING analytic is closed: no paper packet is transcribed and the '
    + 'correlation-deviation bound the gauged race needs is NOT proved here -- it is the surviving '
    + 'substance of imp-95212-subgap-fresnel-airy-envelope-port in sharper currency. G-SANDWICH is '
    + 'sufficient, not necessary, even over the gauge orbit. W3 is a synthetic mechanics configuration, '
    + 'not a paper-window computation. Changes no bound; NO QED; no refereed bound is changed.',
  fns: { lambdaMax2, scale2, minors3, isPSD3, buildPaperPencil, gaugedDeltas, lamMaxPencil3 },
};

export const IMP95460_LEGB_GAUGE_INVARIANT_SANDWICH_ASSERTIONS = [
  {
    id: 'imp-95460-g-inv-numeric',
    description: 'THEOREM G-INV numeric cross-check: diagonal congruence leaves the 2x2 pencil sup '
      + 'invariant to machine precision',
    holds: () => Math.abs(LAMBDA_GAUGED_2 - LAMBDA_MODEL_2) <= 1e-12 * LAMBDA_MODEL_2,
  },
  {
    id: 'imp-95460-g-strict-value-equal',
    description: 'G-STRICT (i): the renormalized paper pencil has EXACTLY the model sup (pure gauge)',
    holds: () => Math.abs(LAMBDA_PAPER_2 - LAMBDA_MODEL_2) <= 1e-12 * LAMBDA_MODEL_2,
  },
  {
    id: 'imp-95460-g-strict-ungauged-fails',
    description: 'G-STRICT (ii): BOTH ungauged obligations fail -- A_m - A_p indefinite (det < 0) and '
      + 'B_p - B_m has a negative diagonal entry',
    holds: () => DA_UNGAUGED_DET < 0 && DB_UNGAUGED_22 < 0,
  },
  {
    id: 'imp-95460-g-strict-gauged-fires',
    description: 'G-STRICT (iii): the gauge D = diag(1, 2) restores both obligations with exact equality',
    holds: () => W2_GAUGED_MAXDIFF <= 1e-15,
  },
  {
    id: 'imp-95460-race-fires-small-deviation',
    description: 'G-RACE: at correlation deviation 5e-5 both gauged differences are PSD (route fires) '
      + 'while BOTH ungauged obligations fail by strict diagonal violations',
    holds: () => isPSD3(DELTAS_SMALL.dB) && isPSD3(DELTAS_SMALL.dA)
      && UNGAUGED_O1_DIAG_VIOLATION < -1e-3 && UNGAUGED_O2_DIAG_VIOLATION < -1e-4,
  },
  {
    id: 'imp-95460-race-lost-large-deviation',
    description: 'G-RACE: at correlation deviation 5e-3 the gauged race is lost (a difference goes '
      + 'non-PSD) -- the race is margin-vs-deviation, not free',
    holds: () => !(isPSD3(DELTAS_LARGE.dB) && isPSD3(DELTAS_LARGE.dA)),
  },
  {
    id: 'imp-95460-race-threshold-bracket',
    description: 'the bisected uniform-deviation firing threshold sits in (5e-4, 1.2e-3), the '
      + '(1 - sqrt(q)) lambda_min(G) scale',
    holds: () => FIRING_THRESHOLD > 5e-4 && FIRING_THRESHOLD < 1.2e-3,
  },
  {
    id: 'imp-95460-certified-ordering-crosscheck',
    description: 'independent power-iteration cross-check: the certified ordering '
      + 'Lambda_paper <= Lambda_model holds on the fired configuration',
    holds: () => Number.isFinite(LAMBDA_PAPER_3) && Number.isFinite(LAMBDA_MODEL_3)
      && LAMBDA_PAPER_3 <= LAMBDA_MODEL_3 + 1e-12,
  },
  {
    id: 'imp-95460-kappa-window-interior',
    description: 'the chosen kappa = 1/sqrt(q) lies strictly inside the admissible window [1, 1/q]',
    holds: () => KAPPA > 1 && KAPPA < 1 / Q_UNIF,
  },
  {
    id: 'imp-95460-honest-no-qed',
    description: 'the verdict records that nothing analytic closes, the port deliverable stays open, '
      + 'NO QED, no refereed bound is changed',
    holds: () => /NOT proved here/.test(IMP95460_LEGB_GAUGE_INVARIANT_SANDWICH.honest)
      && /NO QED/.test(IMP95460_LEGB_GAUGE_INVARIANT_SANDWICH.honest)
      && /refereed bound is changed/i.test(IMP95460_LEGB_GAUGE_INVARIANT_SANDWICH.honest),
  },
];

for (const a of IMP95460_LEGB_GAUGE_INVARIANT_SANDWICH_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95460-legb-gauge-invariant-sandwich assertion failed: ${a.id}`);
}

export default IMP95460_LEGB_GAUGE_INVARIANT_SANDWICH;
