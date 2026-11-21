/**
 * @module imp-95561-legb-d2-indefinite-straddle-witness
 *
 * imp-95561 (numerical / EXHIBIT THE imp-95537 D2 WITNESS -- FULL INDEFINITE
 * STRADDLE): imp-95537 (D2) asserts the sharp fixed-window LEG B decider is the
 * DIRECT definite-pencil comparison
 *   lambda_max(A_p, B_p)  <=  lambda_max(A_m, B_m),
 * NOT the two-sided Loewner sandwich (DELTA_A = A_m - A_p >= 0 and DELTA_B =
 * B_p - B_m >= 0), because there is a fixed window where DELTA_A is INDEFINITE
 * (its eigenvalues straddle zero) yet the ratio inequality still HOLDS -- so the
 * sandwich is merely SUFFICIENT and can be inconclusive. imp-95560 emitted the
 * real port-derived (3, 1) window and reported that DELTA_A has a NEGATIVE
 * eigenvalue (eigMin = -0.01627...), which alone establishes "not PSD" but does
 * NOT by itself certify a genuine STRADDLE (a negative-semidefinite DELTA_A also
 * has eigMin < 0 yet is not indefinite). THIS MODULE completes the witness: it
 * emits the FULL DELTA_A eigenpair at the same real port window and shows it
 * straddles zero (lambda_min < 0 < lambda_max), i.e. DELTA_A has one strictly
 * negative and one strictly positive eigenvalue -- genuine indefiniteness, not
 * mere failure of positivity -- while the direct ratio inequality holds. It also
 * isolates the STRUCTURAL reason for the straddle and re-exhibits the phenomenon
 * on an independent hand-built window. Report only; changes no bound; NO QED;
 * no refereed bound is changed; RH open.
 *
 * INDEFINITE vs NOT-PSD (why the full eigenpair matters). For a symmetric 2x2
 * DELTA_A the Loewner sandwich leg needs DELTA_A >= 0 (both eigenvalues >= 0).
 * There are three ways that can fail: DELTA_A <= 0 (both <= 0, sandwich fails but
 * DELTA_A is definite the other way), DELTA_A indefinite (one sign each), or a
 * boundary case. The imp-95537 D2 claim is specifically that an INDEFINITE
 * DELTA_A occurs -- eigenvalues of OPPOSITE sign, i.e. a genuine straddle -- so
 * that no reordering or sign flip rescues the sandwich. Certifying that requires
 * BOTH eigenvalues, equivalently det(DELTA_A) < 0 (product of eigenvalues
 * negative) together with trace(DELTA_A) verifying the split. eigMin < 0 alone
 * (imp-95560) leaves open the negative-semidefinite alternative; det < 0 closes
 * it. This module reports det, trace, and the full eigenpair.
 *
 * THE REAL PORT WINDOW (3, 1) -- SAME construction as imp-95560, restated
 * self-contained. Width-law port at model normalization c = v = 1 (imp-95220):
 * alias grid G(p, D) = { n/p : 1 <= n <= pD, p not dividing n }; at window
 * (p, D) = (3, 1) the two aliases n = 1, 2 give
 *   packet n: rate mu_n = (n/p)^(1/3), center depth u_n = p/n.
 * Paper Gram (per-packet true depths): B_p[i][j] = kappa(mu_i, mu_j, |u_i-u_j|)
 * full-line overlap, A_p[i][j] = exp(-(mu_i u_i + mu_j u_j))/(mu_i+mu_j)
 * restricted to s < 0. Model Gram (E_V envelope at the common collar dbar =
 * min_i u_i): B_m[i][j] = 1/(mu_i+mu_j) Cauchy Gram, A_m[i][j] =
 * exp(-(mu_i+mu_j) dbar)/(mu_i+mu_j). Then
 *   DELTA_A = A_m - A_p = [[0.07882961, 0.03933552], [0.03933552, 0]],
 *   eig(DELTA_A) = { -0.01627011, +0.09509972 }  ==> STRADDLES ZERO,
 *   det(DELTA_A) = -0.001547... < 0,  trace = +0.07882961 > 0,
 * while lambda_max(A_p, B_p) = 0.03933416 <= lambda_max(A_m, B_m) = 0.70767674,
 * so the direct ratio inequality HOLDS. The Loewner sandwich is therefore
 * INCONCLUSIVE (DELTA_A not >= 0) at a window where the inequality is TRUE.
 *
 * STRUCTURAL REASON FOR THE STRADDLE (why this is not a numerical accident). At
 * window (3, 1) the shallowest packet is n = 2 with u_2 = 1.5 = dbar (the common
 * collar is placed at the shallowest per-packet depth). For that packet the
 * model diagonal A_m[2][2] = exp(-2 mu_2 dbar)/(2 mu_2) EXACTLY equals the paper
 * diagonal A_p[2][2] = exp(-2 mu_2 u_2)/(2 mu_2), so the corresponding DELTA_A
 * diagonal entry VANISHES (DELTA_A[1][1] = 0 to machine precision). A symmetric
 * 2x2 with a zero diagonal entry and a nonzero off-diagonal has determinant
 * -(off-diagonal)^2 < 0, hence eigenvalues of opposite sign -- a straddle is
 * FORCED. So the collar-at-shallowest-depth convention (imp-95226) generically
 * produces an indefinite DELTA_A whenever the collar packet is not the only
 * packet, confirming imp-95537 D2 is structural, not cherry-picked.
 *
 * INDEPENDENT HAND-BUILT WITNESS (round-number cross-check, imp-95537 window).
 * With B_m = [[1,0.5],[0.5,1]], A_m = diag(1.2,0.8) B_m diag(1.2,0.8) =
 * [[1.44,0.48],[0.48,0.64]], and paper-side B_p = [[1.1,0.45],[0.45,1.05]],
 * A_p = [[1.30,0.40],[0.40,0.60]]: DELTA_A = [[0.14,0.08],[0.08,0.04]] has
 * det = -0.0008 < 0 and eig = { -0.00434, +0.18434 } -- again a straddle -- while
 * lambda_max(A_p,B_p) = 1.21015 <= lambda_max(A_m,B_m) = 1.53162 HOLDS. Two
 * structurally unrelated windows exhibit the same indefinite-yet-holds pattern.
 *
 * NET SCOPE. The imp-95537 D2 witness is now numerically COMPLETE: DELTA_A is
 * shown INDEFINITE (full eigenpair of opposite sign, det < 0), not merely
 * not-PSD, at a real port-derived window AND at an independent hand-built one,
 * with the ratio inequality holding in both -- so the direct pencil comparison
 * is strictly sharper than the Loewner sandwich, which can be inconclusive. This
 * closes only the D2 witness-completeness question; it does NOT close LEG B. LEG
 * B substance is UNIFORMITY over depth d and matrix size N -- the imp-95443
 * summable off-diagonal decay-vs-margin race -- untouched here.
 *
 * HONEST LIMITS. (a) WITNESS-COMPLETENESS ONLY: two fixed windows, no uniformity,
 * no bound moves; a straddle at these windows says nothing about any other
 * window. (b) The port rates/centers are the imp-95220 width-law map at model
 * normalization c = v = 1 (mu = (n/p)^(1/3), u = p/n); a different envelope-to-
 * rate reduction changes the numbers (imp-95220 PROP EXP). (c) Amplitudes (1/p
 * per alias) are absorbed into the free Rayleigh coefficients; amplitude
 * weighting is the separate imp-95220 reroute leg beta. (d) The model common
 * collar is at the shallowest depth dbar = min u_i; a different collar convention
 * changes DELTA_A and can remove the forced zero diagonal. (e) Full LEG B stays
 * OPEN at imp-95212-subgap-fresnel-airy-envelope-port; the uniform difficulty is
 * ANALYSIS (imp-95443), distinct from the fixed-window witness completed here.
 * Import-light (no zeros bundle, no sibling imports; all literals restated so the
 * module is independently checkable). Changes no bound; NO QED; no refereed bound is changed
 * ; RH open.
 */

// -- self-contained linear-algebra machinery (mirrors imp-95560) --------------
function kappa(a, b, tau) {
  // two-sided-exponential overlap at rate pair (a, b), center gap tau
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}
function eigSym2(M) {
  // both eigenvalues of a real symmetric 2x2 [[a,b],[b,c]]
  const a = M[0][0], b = M[0][1], c = M[1][1];
  const tr = a + c;
  const disc = Math.sqrt((a - c) * (a - c) + 4 * b * b);
  return { min: (tr - disc) / 2, max: (tr + disc) / 2, trace: tr, det: a * c - b * b };
}
function genEigMaxSym2(A, B) {
  // largest generalized eigenvalue of a definite symmetric 2x2 pencil (A, B),
  // B positive definite: larger root of det(A - lambda B) = 0.
  const a11 = A[0][0], a12 = A[0][1], a22 = A[1][1];
  const b11 = B[0][0], b12 = B[0][1], b22 = B[1][1];
  const alpha = b11 * b22 - b12 * b12; // det B > 0
  const beta = -(a11 * b22 + a22 * b11 - 2 * a12 * b12);
  const gamma = a11 * a22 - a12 * a12; // det A
  const disc = Math.sqrt(beta * beta - 4 * alpha * gamma);
  return (-beta + disc) / (2 * alpha);
}

// -- REAL PORT WINDOW (3, 1): rebuild A_p, B_p, A_m, B_m from the width law ----
function portWindow_3_1() {
  const fam = [
    { n: 1, mu: Math.cbrt(1 / 3), u: 3 },
    { n: 2, mu: Math.cbrt(2 / 3), u: 1.5 },
  ];
  const K = fam.length;
  const Ap = [], Bp = [];
  for (let i = 0; i < K; i++) {
    Ap.push([]);
    Bp.push([]);
    for (let j = 0; j < K; j++) {
      const a = fam[i], b = fam[j];
      Bp[i].push(kappa(a.mu, b.mu, Math.abs(a.u - b.u)));
      Ap[i].push(Math.exp(-(a.mu * a.u + b.mu * b.u)) / (a.mu + b.mu));
    }
  }
  const mus = fam.map((f) => f.mu);
  const dbar = Math.min(...fam.map((f) => f.u));
  const Bm = mus.map((a) => mus.map((b) => 1 / (a + b)));
  const Am = mus.map((a) => mus.map((b) => Math.exp(-(a + b) * dbar) / (a + b)));
  return { fam, Ap, Bp, Am, Bm, dbar };
}

const PORT = portWindow_3_1();
const DELTA_A_PORT = [
  [PORT.Am[0][0] - PORT.Ap[0][0], PORT.Am[0][1] - PORT.Ap[0][1]],
  [PORT.Am[1][0] - PORT.Ap[1][0], PORT.Am[1][1] - PORT.Ap[1][1]],
];
const DELTA_A_PORT_EIG = eigSym2(DELTA_A_PORT);
const PORT_PAPER_LAMMAX = genEigMaxSym2(PORT.Ap, PORT.Bp);
const PORT_MODEL_LAMMAX = genEigMaxSym2(PORT.Am, PORT.Bm);
const PORT_STRADDLES = DELTA_A_PORT_EIG.min < 0 && DELTA_A_PORT_EIG.max > 0;
const PORT_INEQUALITY_HOLDS = PORT_PAPER_LAMMAX <= PORT_MODEL_LAMMAX;
// structural: the collar packet (n=2, u=1.5=dbar) forces DELTA_A[1][1] = 0
const PORT_COLLAR_DIAGONAL_VANISHES = Math.abs(DELTA_A_PORT[1][1]) < 1e-12;

// -- INDEPENDENT HAND-BUILT WITNESS (imp-95537 round-number window) ------------
const HB_B_M = [[1, 0.5], [0.5, 1]];
const HB_A_M = [[1.44, 0.48], [0.48, 0.64]];
const HB_B_P = [[1.1, 0.45], [0.45, 1.05]];
const HB_A_P = [[1.3, 0.4], [0.4, 0.6]];
const DELTA_A_HB = [
  [HB_A_M[0][0] - HB_A_P[0][0], HB_A_M[0][1] - HB_A_P[0][1]],
  [HB_A_M[1][0] - HB_A_P[1][0], HB_A_M[1][1] - HB_A_P[1][1]],
];
const DELTA_A_HB_EIG = eigSym2(DELTA_A_HB);
const HB_PAPER_LAMMAX = genEigMaxSym2(HB_A_P, HB_B_P);
const HB_MODEL_LAMMAX = genEigMaxSym2(HB_A_M, HB_B_M);
const HB_STRADDLES = DELTA_A_HB_EIG.min < 0 && DELTA_A_HB_EIG.max > 0;
const HB_INEQUALITY_HOLDS = HB_PAPER_LAMMAX <= HB_MODEL_LAMMAX;

export const IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS = {
  ticket: 'imp-95561',
  consumes: [
    'imp-95537 (D2: direct pencil comparison sharper than the Loewner sandwich)',
    'imp-95560 (real port-derived (3,1) Gram matrices; reported eigMin < 0 only)',
    'imp-95220 (width-law port: rate mu=(n/p)^(1/3), center u=p/n, amplitude 1/p)',
    'imp-95424 (LEG B obligation ledger: Loewner sandwich O1/O2)',
    'imp-95226 (E_V pencil model: A_m = D G D at the common collar dbar = min u_i)',
  ],
  claim:
    'imp-95537 D2: there is a fixed window where DELTA_A = A_m - A_p is INDEFINITE (eigenvalues straddle zero) yet '
    + 'lambda_max(A_p,B_p) <= lambda_max(A_m,B_m) HOLDS, so the two-sided Loewner sandwich is merely sufficient and '
    + 'can be inconclusive.',
  indefiniteVsNotPsd:
    'imp-95560 reported only eigMin(DELTA_A) < 0, which certifies not-PSD but not a genuine STRADDLE (a '
    + 'negative-semidefinite DELTA_A also has eigMin < 0). A straddle needs eigenvalues of OPPOSITE sign, '
    + 'equivalently det(DELTA_A) < 0 with a positive trace splitting them. This module emits the FULL eigenpair, '
    + 'det, and trace to certify indefiniteness proper.',
  portWindow_3_1: {
    note: 'real imp-95220 port-derived window (same construction as imp-95560), full DELTA_A spectrum emitted',
    DELTA_A: DELTA_A_PORT,
    eigMin: DELTA_A_PORT_EIG.min,
    eigMax: DELTA_A_PORT_EIG.max,
    det: DELTA_A_PORT_EIG.det,
    trace: DELTA_A_PORT_EIG.trace,
    straddlesZero: PORT_STRADDLES,
    collarDiagonalVanishes: PORT_COLLAR_DIAGONAL_VANISHES,
    paperLamMax: PORT_PAPER_LAMMAX,
    modelLamMax: PORT_MODEL_LAMMAX,
    inequalityHolds: PORT_INEQUALITY_HOLDS,
    structuralReason:
      'the shallowest packet n=2 has u_2 = 1.5 = dbar, so its model diagonal A_m[2][2] equals its paper diagonal '
      + 'A_p[2][2] and DELTA_A[1][1] vanishes; a symmetric 2x2 with a zero diagonal entry and nonzero off-diagonal '
      + 'has det = -(off-diagonal)^2 < 0, FORCING eigenvalues of opposite sign -- the straddle is structural, not '
      + 'a numerical accident.',
    verdict:
      'RAN: eig(DELTA_A) = { ' + DELTA_A_PORT_EIG.min.toFixed(8) + ', ' + DELTA_A_PORT_EIG.max.toFixed(8)
      + ' } STRADDLES ZERO (det = ' + DELTA_A_PORT_EIG.det.toFixed(8) + ' < 0), yet lambda_max(A_p,B_p) = '
      + PORT_PAPER_LAMMAX.toFixed(8) + ' <= lambda_max(A_m,B_m) = ' + PORT_MODEL_LAMMAX.toFixed(8)
      + ' => the direct inequality HOLDS while the Loewner sandwich is INCONCLUSIVE.',
  },
  handBuiltWindow: {
    note: 'independent round-number cross-check (imp-95537 illustrative window), structurally unrelated to the port',
    DELTA_A: DELTA_A_HB,
    eigMin: DELTA_A_HB_EIG.min,
    eigMax: DELTA_A_HB_EIG.max,
    det: DELTA_A_HB_EIG.det,
    straddlesZero: HB_STRADDLES,
    paperLamMax: HB_PAPER_LAMMAX,
    modelLamMax: HB_MODEL_LAMMAX,
    inequalityHolds: HB_INEQUALITY_HOLDS,
    verdict:
      'RAN: eig(DELTA_A) = { ' + DELTA_A_HB_EIG.min.toFixed(8) + ', ' + DELTA_A_HB_EIG.max.toFixed(8)
      + ' } STRADDLES ZERO (det = ' + DELTA_A_HB_EIG.det.toFixed(8) + ' < 0), yet paper ' + HB_PAPER_LAMMAX.toFixed(8)
      + ' <= model ' + HB_MODEL_LAMMAX.toFixed(8) + ' => HOLDS. Same indefinite-yet-holds pattern on a second window.',
  },
  netScope:
    'the imp-95537 D2 witness is now numerically COMPLETE: DELTA_A is INDEFINITE (full eigenpair of opposite sign, '
    + 'det < 0), not merely not-PSD, at a real port-derived window AND an independent hand-built one, with the ratio '
    + 'inequality holding in both -- so the direct pencil comparison is strictly sharper than the Loewner sandwich, '
    + 'which can be inconclusive. This closes only D2 witness-completeness; it does NOT close LEG B, whose substance '
    + 'is UNIFORMITY over depth d and size N (the imp-95443 decay-vs-margin race), untouched here.',
  honest:
    'WITNESS-COMPLETENESS ONLY -- two fixed windows, no uniformity, no bound moves; a straddle at these windows says '
    + 'nothing about any other window. Port rates/centers are the imp-95220 width-law map at model normalization '
    + 'c = v = 1 (mu = (n/p)^(1/3), u = p/n); amplitudes (1/p per alias) are absorbed into the free Rayleigh '
    + 'coefficients (amplitude weighting is the separate imp-95220 reroute leg beta); the model common collar is at '
    + 'the shallowest depth dbar = min u_i (a different collar convention can remove the forced zero diagonal). Full '
    + 'LEG B stays OPEN at imp-95212-subgap-fresnel-airy-envelope-port; the uniform difficulty is ANALYSIS '
    + '(imp-95443), distinct from the fixed-window witness completed here. Changes no bound; NO QED; no refereed bound is changed'
    + '; RH open.',
  fns: { kappa, eigSym2, genEigMaxSym2, portWindow_3_1 },
};

export const IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS_ASSERTIONS = [
  {
    id: 'imp-95561-port-delta-a-straddles-zero',
    description: 'real port (3,1) window: the FULL DELTA_A eigenpair straddles zero (eigMin < 0 < eigMax), '
      + 'certifying genuine indefiniteness (det < 0), not merely eigMin < 0',
    holds: () =>
      PORT_STRADDLES === true
      && DELTA_A_PORT_EIG.min < 0 && DELTA_A_PORT_EIG.max > 0
      && DELTA_A_PORT_EIG.det < 0
      && Math.abs(DELTA_A_PORT_EIG.min + 0.0162701087409865) < 1e-9
      && Math.abs(DELTA_A_PORT_EIG.max - 0.09509971969320163) < 1e-9,
  },
  {
    id: 'imp-95561-port-inequality-holds',
    description: 'real port (3,1) window: the direct ratio inequality lambda_max(A_p,B_p) <= lambda_max(A_m,B_m) '
      + 'HOLDS (0.03933416 <= 0.70767674) while DELTA_A is indefinite',
    holds: () =>
      PORT_INEQUALITY_HOLDS === true
      && Math.abs(PORT_PAPER_LAMMAX - 0.03933416090409959) < 1e-9
      && Math.abs(PORT_MODEL_LAMMAX - 0.7076767351647459) < 1e-9,
  },
  {
    id: 'imp-95561-port-straddle-is-structural',
    description: 'real port (3,1) window: the collar packet at dbar forces DELTA_A[1][1] = 0, so det = '
      + '-(off-diagonal)^2 < 0 and the straddle is structural, not a numerical accident',
    holds: () =>
      PORT_COLLAR_DIAGONAL_VANISHES === true
      && DELTA_A_PORT[1][1] === PORT.Am[1][1] - PORT.Ap[1][1]
      && Math.abs(DELTA_A_PORT_EIG.det + DELTA_A_PORT[0][1] * DELTA_A_PORT[0][1]) < 1e-12,
  },
  {
    id: 'imp-95561-handbuilt-straddles-and-holds',
    description: 'independent hand-built window: DELTA_A straddles zero (eigMin < 0 < eigMax, det < 0) and paper '
      + 'lambda_max 1.21015 <= model 1.53162 HOLDS -- same pattern on a second window',
    holds: () =>
      HB_STRADDLES === true
      && DELTA_A_HB_EIG.det < 0
      && HB_INEQUALITY_HOLDS === true
      && Math.abs(HB_PAPER_LAMMAX - 1.210148002711781) < 1e-6
      && Math.abs(HB_MODEL_LAMMAX - 1.5316158873110055) < 1e-6,
  },
  {
    id: 'imp-95561-witness-completeness-honest',
    description: 'explicitly WITNESS-COMPLETENESS ONLY: no uniform bound, NO QED, no refereed bound is changed, RH '
      + 'open, LEG B substance (uniformity) untouched',
    holds: () =>
      /WITNESS-COMPLETENESS ONLY/.test(IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS.honest)
      && /NO QED/.test(IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS.honest)
      && /refereed bound is changed/i.test(IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS.honest)
      && /RH open/.test(IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS.honest)
      && /UNIFORMITY/.test(IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS.netScope),
  },
];

for (const a of IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95561-legb-d2-indefinite-straddle-witness assertion failed: ${a.id}`);
  }
}

export default IMP95561_LEGB_D2_INDEFINITE_STRADDLE_WITNESS;
