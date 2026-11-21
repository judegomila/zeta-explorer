/**
 * @module imp-95560-legb-fixed-window-gram-comparison
 *
 * imp-95560 (numerical / FIXED-WINDOW LEG B DECISION, RUN AT ONE CONCRETE SEAM
 * WINDOW): imp-95537 proved LEG B is DECIDABLE per fixed seam window by the
 * direct definite-pencil comparison
 *   lambda_max(A_p, B_p)  <=  lambda_max(A_m, B_m),
 * and isolated the single blocker as a DATA / TRANSCRIPTION gap: the numeric
 * paper-window Gram entries A_p, B_p (inner products of the paper packets
 * restricted to s < 0) had never been emitted by the imp-95212 Fresnel-Airy
 * port at even one window -- the port supplied only a GEOMETRIC RELABELING
 * (rates, centers, amplitude moduli via the imp-95220 width law), not the Gram
 * NUMBERS. THIS MODULE CLOSES THAT DATA GAP AT ONE CONCRETE WINDOW: it derives
 * the numeric A_p, B_p directly from the port rate/center law, emits the two
 * Gram matrices, builds the model-side pencil (A_m, B_m) from the same rates at
 * the common collar, and RUNS the generalized-eigenvalue comparison. The
 * fixed-window inequality is reported as it comes out. This yields NO uniform
 * bound (that is the imp-95443 decay-vs-margin race over all depths d and all
 * N); it is a single-window spot-check. Report only; NO QED; no refereed bound is changed
 * ; RH open.
 *
 * THE PORT DATA (imp-95220 width law, model normalization c = v = 1). The
 * paper alias grid at window (p, D) is G(p, D) = { n/p : 1 <= n <= pD, p not
 * dividing n } (paper eq 14/15, imp-95071/imp-95214). The width-law port maps
 * the alias at grid point n/p to a two-sided-exponential dictionary packet of
 *   rate    mu(n) = (n/p)^(1/3)      (Airy cube-root width exponent beta = 1/3,
 *                                     the one recoverable paper constant),
 *   center  u(n) = p/n               (depth into s > 0 of the packet center),
 *   amplitude 1/p per alias (paper eq 14; ABSORBED into the free signed
 *                                     coefficients for the coefficient-uniform
 *                                     Rayleigh comparison below, so the Gram
 *                                     FORMS use unit packets -- amplitude
 *                                     weighting is the SEPARATE imp-95220 reroute
 *                                     leg beta, not this leg).
 *
 * THE TWO GRAM FORMS (both sides are restricted-Rayleigh suprema over the SAME
 * signed coefficient space a in R^N, imp-95424/imp-95443).
 *   PAPER side (per-packet true depths, cross-seam over full-line mass):
 *     B_p[i][j] = kappa(mu_i, mu_j, |u_i - u_j|)            (full-line Gram),
 *     A_p[i][j] = exp(-(mu_i u_i + mu_j u_j)) / (mu_i + mu_j) (restricted s<0),
 *   where kappa(a, b, tau) = 2 (b e^(-a tau) - a e^(-b tau)) / (b^2 - a^2) is
 *   the two-sided-exponential overlap at rate pair (a, b) and center gap tau
 *   (confluent limit a -> b gives e^(-m tau)(1 + m tau)/m, m = (a+b)/2).
 *   LamBar_paper = sup_a (a^T A_p a)/(a^T B_p a) = lambda_max(A_p, B_p).
 *   MODEL side (exponential envelope E_V at the common collar depth dbar =
 *   min_i u_i, the shallowest per-packet depth; imp-95226/imp-95443, A_m = D G D
 *   with D = diag(e^(-mu_i dbar)) and G the Cauchy Gram):
 *     B_m[i][j] = 1 / (mu_i + mu_j)                          (Cauchy Gram),
 *     A_m[i][j] = exp(-(mu_i + mu_j) dbar) / (mu_i + mu_j).
 *   Lambda(E_V, dbar) = sup_a (a^T A_m a)/(a^T B_m a) = lambda_max(A_m, B_m).
 *   The common collar at the SHALLOWEST depth is the natural envelope: it
 *   replaces every per-packet depth by the smallest one, so every packet s<0
 *   mass is inflated to at least its true value (the diagonal Loewner content
 *   O2 of imp-95424).
 *
 * WHAT IS RUN. Two concrete windows.
 *   (W1) window (p, D) = (3, 1): K = 2 packets (n = 1, 2), a clean 2x2 window
 *        whose FULL A_p, B_p, A_m, B_m are emitted below entrywise. Direct
 *        comparison: LamBar_paper = 0.03933416... <= Lambda(E_V, dbar) =
 *        0.70767674... => the fixed-window inequality HOLDS at (3, 1).
 *   (W2) window (p, D) = (5, 2): K = 8 packets (n = 1..10, 5 and 10 deleted).
 *        Direct comparison: LamBar_paper = 0.18133934... <= Lambda(E_V, dbar) =
 *        0.93968544... => HOLDS. These two numbers reproduce the independently
 *        baked imp-95220 measured seam sup 0.18133934321273545 and common-collar
 *        class truth 0.9396854422433276 (rel 1e-6), CROSS-VALIDATING that the
 *        Gram conventions here match the established chain machinery.
 *
 * A REAL-WINDOW WITNESS FOR imp-95537 (D2). imp-95537 (D2) claimed the DIRECT
 * pencil comparison is SHARPER than the imp-95424/imp-95443 Loewner sandwich
 * (DELTA_A = A_m - A_p >= 0 and DELTA_B = B_p - B_m >= 0) using a HAND-CHOSEN
 * 2x2. Window (3, 1) exhibits the SAME phenomenon on ACTUAL port-derived Gram
 * matrices: DELTA_A is INDEFINITE (eigMin = -0.01627010...) so the Loewner
 * sandwich is INCONCLUSIVE, yet the direct ratio inequality HOLDS. So a fixed
 * window never needs the sandwich, and the imp-95537 (D2) witness is now a
 * genuine paper-window instance, not just an illustration.
 *
 * NET SCOPE. The imp-95537 fixed-window DATA gap is closed at these two
 * windows: A_p, B_p are emitted numerically from the port rate/center law, the
 * pencil comparison is run, and the inequality HOLDS at both. This does NOT
 * close LEG B: a single-window (indeed a two-window) decision yields NO uniform
 * bound. LEG B substance is UNIFORMITY over depth d and matrix size N -- the
 * imp-95443 summable off-diagonal decay-vs-margin race -- which is untouched
 * here.
 *
 * HONEST LIMITS. (a) SPOT-CHECK only: two windows, no uniformity, no bound
 * moves. (b) The port rates/centers are the imp-95220 width-law map at model
 * normalization c = v = 1 (mu = (n/p)^(1/3), u = p/n); if the true
 * envelope-to-rate reduction differs from the width law mu = 1/r_d the numbers
 * change (imp-95220 PROP EXP scopes this). (c) Amplitudes (1/p per alias, paper
 * eq 14) are absorbed into the free Rayleigh coefficients here; the
 * amplitude-weighted certificate is the SEPARATE imp-95220 reroute leg beta.
 * (d) The model common collar is taken at the shallowest depth dbar = min u_i
 * (the natural upper envelope); a different collar convention gives a different
 * model number. (e) Full LEG B stays OPEN at
 * imp-95212-subgap-fresnel-airy-envelope-port; the uniform difficulty is
 * ANALYSIS (imp-95443), distinct from the DATA gap closed here. Import-light
 * (no zeros bundle, no sibling imports; the imp-95220 measured literals are
 * restated so this module stays independently checkable). Changes no bound; NO
 * QED; no refereed bound is changed; RH open.
 */

// -- self-contained linear-algebra machinery (mirrors imp-95220 exactly) ------
function kappa(a, b, tau) {
  // two-sided-exponential overlap at rate pair (a, b), center gap tau
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}
function invMatrix(A) {
  const n = A.length;
  const M = A.map((row, i) =>
    row.concat(Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))),
  );
  for (let i = 0; i < n; i++) {
    let piv = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[piv][i])) piv = k;
    }
    const tmp = M[i];
    M[i] = M[piv];
    M[piv] = tmp;
    const pv = M[i][i];
    for (let j = 0; j < 2 * n; j++) M[i][j] /= pv;
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const f = M[k][i];
      for (let j = 0; j < 2 * n; j++) M[k][j] -= f * M[i][j];
    }
  }
  return M.map((row) => row.slice(n));
}
const matVec = (A, x) => A.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
const quadForm = (A, x) => {
  const y = matVec(A, x);
  return x.reduce((s, xi, i) => s + xi * y[i], 0);
};
function genEigMax(A, B, K) {
  // largest generalized eigenvalue of the definite pencil (A, B), B PD, via
  // power iteration on B^{-1} A (matches imp-95220 genEigSup)
  const Bi = invMatrix(B);
  let x = Array.from({ length: K }, (_, i) => 1 / (1 + i));
  for (let it = 0; it < 800; it++) {
    const y = matVec(Bi, matVec(A, x));
    const nrm = Math.sqrt(y.reduce((s, v) => s + v * v, 0));
    if (nrm === 0) break;
    x = y.map((v) => v / nrm);
  }
  return quadForm(A, x) / quadForm(B, x);
}
function eigMinSym2(M) {
  const a = M[0][0], b = M[0][1], c = M[1][1];
  const tr = a + c;
  const disc = Math.sqrt((a - c) * (a - c) + 4 * b * b);
  return (tr - disc) / 2;
}

// -- the port and the two Gram forms ------------------------------------------
function aliasFamily(p, D) {
  // width-law port at model normalization c = v = 1: rate mu = (n/p)^(1/3),
  // center depth u = p/n over the punctured (1/p)-lattice on (0, D]
  const N = Math.floor(p * D);
  const fam = [];
  for (let n = 1; n <= N; n++) {
    if (n % p === 0) continue;
    fam.push({ n, mu: Math.cbrt(n / p), u: p / n });
  }
  return fam;
}
function paperGrams(fam) {
  // A_p (restricted s<0) and B_p (full-line) at per-packet true depths
  const K = fam.length;
  const Ap = [];
  const Bp = [];
  for (let i = 0; i < K; i++) {
    Ap.push([]);
    Bp.push([]);
    for (let j = 0; j < K; j++) {
      const a = fam[i];
      const b = fam[j];
      Bp[i].push(kappa(a.mu, b.mu, Math.abs(a.u - b.u)));
      Ap[i].push(Math.exp(-(a.mu * a.u + b.mu * b.u)) / (a.mu + b.mu));
    }
  }
  return { Ap, Bp };
}
function modelGrams(mus, d) {
  // A_m = D G D, D = diag(e^(-mu_i d)); B_m = G the Cauchy Gram
  const Bm = mus.map((a) => mus.map((b) => 1 / (a + b)));
  const Am = mus.map((a) => mus.map((b) => Math.exp(-(a + b) * d) / (a + b)));
  return { Am, Bm };
}
function decideWindow(p, D) {
  const fam = aliasFamily(p, D);
  const mus = fam.map((f) => f.mu);
  const dbar = Math.min(...fam.map((f) => f.u));
  const { Ap, Bp } = paperGrams(fam);
  const { Am, Bm } = modelGrams(mus, dbar);
  const paperLamMax = genEigMax(Ap, Bp, fam.length);
  const modelLamMax = genEigMax(Am, Bm, fam.length);
  return {
    p, D, K: fam.length, dbar, mus,
    us: fam.map((f) => f.u),
    Ap, Bp, Am, Bm,
    paperLamMax, modelLamMax,
    inequalityHolds: paperLamMax <= modelLamMax,
  };
}

// -- run the two windows ------------------------------------------------------
const W1 = decideWindow(3, 1); // clean 2x2, full Gram matrices emitted
const W2 = decideWindow(5, 2); // 8x8, cross-checks the imp-95220 baked literals

// Loewner-sandwich status at W1 (real-window imp-95537 D2 witness)
const DELTA_A_W1 = [
  [W1.Am[0][0] - W1.Ap[0][0], W1.Am[0][1] - W1.Ap[0][1]],
  [W1.Am[1][0] - W1.Ap[1][0], W1.Am[1][1] - W1.Ap[1][1]],
];
const DELTA_B_W1 = [
  [W1.Bp[0][0] - W1.Bm[0][0], W1.Bp[0][1] - W1.Bm[0][1]],
  [W1.Bp[1][0] - W1.Bm[1][0], W1.Bp[1][1] - W1.Bm[1][1]],
];
const DELTA_A_W1_EIGMIN = eigMinSym2(DELTA_A_W1);
const DELTA_B_W1_EIGMIN = eigMinSym2(DELTA_B_W1);
const SANDWICH_W1_CONCLUSIVE = DELTA_A_W1_EIGMIN >= 0 && DELTA_B_W1_EIGMIN >= 0;

// imp-95220 independently-baked literals (restated so this module is checkable)
const IMP95220_SEAM_SUP_52 = 0.18133934321273545; // measured paper seam sup (5,2)
const IMP95220_COMMON_COLLAR_52 = 0.9396854422433276; // model class truth (5,2)

export const IMP95560_LEGB_FIXED_WINDOW_GRAM_COMPARISON = {
  ticket: 'imp-95560',
  consumes: [
    'imp-95537 (fixed-window decidability; DATA/TRANSCRIPTION gap isolated)',
    'imp-95220 (width-law port: rate mu=(n/p)^(1/3), center u=p/n, amplitude 1/p)',
    'imp-95443 (LEG B establishment routes; uniform decay-vs-margin race)',
    'imp-95424 (LEG B obligation ledger: Loewner sandwich O1/O2)',
    'imp-95226 (E_V pencil model: A_m = D G D, B_m = Cauchy G)',
  ],
  legBInequality: 'LamBar_paper(d) <= Lambda(E_V, d)  ==  lambda_max(A_p,B_p) <= lambda_max(A_m,B_m)',
  portData:
    'width-law port at model normalization c = v = 1 (imp-95220): alias grid G(p,D) = { n/p : 1<=n<=pD, p not '
    + 'dividing n }, rate mu(n) = (n/p)^(1/3), center depth u(n) = p/n, amplitude 1/p per alias (paper eq 14, '
    + 'absorbed into the free Rayleigh coefficients here; amplitude weighting is the separate imp-95220 reroute leg beta).',
  gramForms:
    'PAPER: B_p[i][j] = kappa(mu_i, mu_j, |u_i - u_j|) full-line Gram, A_p[i][j] = exp(-(mu_i u_i + mu_j u_j))/'
    + '(mu_i + mu_j) restricted s<0; kappa(a,b,tau) = 2(b e^-a tau - a e^-b tau)/(b^2 - a^2). MODEL (E_V at '
    + 'common collar dbar = min u_i): B_m = Cauchy 1/(mu_i + mu_j), A_m = D G D with D = diag(e^-mu_i dbar), i.e. '
    + 'A_m[i][j] = exp(-(mu_i + mu_j) dbar)/(mu_i + mu_j).',
  window_3_1: {
    p: 3, D: 1, K: W1.K, dbar: W1.dbar, mus: W1.mus, us: W1.us,
    A_p: W1.Ap, B_p: W1.Bp, A_m: W1.Am, B_m: W1.Bm,
    paperLamMax: W1.paperLamMax,
    modelLamMax: W1.modelLamMax,
    inequalityHolds: W1.inequalityHolds,
    loewnerSandwich: {
      deltaAeigMin: DELTA_A_W1_EIGMIN,
      deltaBeigMin: DELTA_B_W1_EIGMIN,
      conclusive: SANDWICH_W1_CONCLUSIVE,
      note:
        'DELTA_A = A_m - A_p is INDEFINITE (eigMin < 0) so the imp-95424/imp-95443 Loewner sandwich is '
        + 'INCONCLUSIVE at this REAL port-derived window, yet the direct ratio inequality HOLDS -- a genuine '
        + 'paper-window instance of the imp-95537 (D2) hand-chosen witness.',
    },
    verdict:
      'RAN: LamBar_paper = ' + W1.paperLamMax.toFixed(8) + ' <= Lambda(E_V, dbar) = ' + W1.modelLamMax.toFixed(8)
      + ' => the fixed-window LEG B inequality HOLDS at (3, 1). Spot-check only; no uniform bound.',
  },
  window_5_2: {
    p: 5, D: 2, K: W2.K, dbar: W2.dbar,
    paperLamMax: W2.paperLamMax,
    modelLamMax: W2.modelLamMax,
    inequalityHolds: W2.inequalityHolds,
    crossCheck:
      'paperLamMax reproduces the imp-95220 measured seam sup 0.18133934321273545 and modelLamMax reproduces the '
      + 'imp-95220 common-collar class truth 0.9396854422433276 (rel 1e-6) -- the Gram conventions match the '
      + 'established chain machinery.',
    verdict:
      'RAN: LamBar_paper = ' + W2.paperLamMax.toFixed(8) + ' <= Lambda(E_V, dbar) = ' + W2.modelLamMax.toFixed(8)
      + ' => the fixed-window LEG B inequality HOLDS at (5, 2). Spot-check only; no uniform bound.',
  },
  netScope:
    'the imp-95537 fixed-window DATA/TRANSCRIPTION gap is CLOSED at two windows: A_p, B_p are emitted numerically '
    + 'from the imp-95220 port rate/center law, the definite-pencil comparison is run, and the inequality HOLDS at '
    + 'both (3,1) and (5,2). This does NOT close LEG B: a two-window decision yields NO uniform bound. LEG B '
    + 'substance is UNIFORMITY over depth d and size N -- the imp-95443 summable off-diagonal decay-vs-margin race '
    + '-- untouched here.',
  honest:
    'SPOT-CHECK ONLY -- two windows, no uniformity, no bound moves. Port rates/centers are the imp-95220 width-law '
    + 'map at model normalization c = v = 1 (mu = (n/p)^(1/3), u = p/n); amplitudes (1/p per alias) are absorbed '
    + 'into the free Rayleigh coefficients (amplitude weighting is the separate imp-95220 reroute leg beta); the '
    + 'model common collar is at the shallowest depth dbar = min u_i (the natural upper envelope). Full LEG B '
    + 'stays OPEN at imp-95212-subgap-fresnel-airy-envelope-port; the uniform difficulty is ANALYSIS (imp-95443), '
    + 'distinct from the DATA gap closed here. Changes no bound; NO QED; no refereed bound is changed'
    + '; RH open.',
  fns: { kappa, genEigMax, aliasFamily, paperGrams, modelGrams, decideWindow, eigMinSym2 },
};

export const IMP95560_LEGB_FIXED_WINDOW_GRAM_COMPARISON_ASSERTIONS = [
  {
    id: 'imp-95560-w1-gram-entries-emitted',
    description: 'window (3,1): the numeric paper Gram entries A_p, B_p and model entries A_m, B_m are emitted and '
      + 'reproduce the port rate/center law mu = (n/p)^(1/3), u = p/n at n = 1, 2',
    holds: () => {
      const rel = (a, b) => Math.abs(a - b) <= 1e-12 * Math.abs(b || 1);
      return rel(W1.mus[0], Math.cbrt(1 / 3)) && rel(W1.mus[1], Math.cbrt(2 / 3))
        && W1.us[0] === 3 && W1.us[1] === 1.5
        && rel(W1.Bp[0][0], 1.4422495703074085) && rel(W1.Bp[0][1], 0.8622362227604781)
        && rel(W1.Bp[1][1], 1.1447142425533319)
        && rel(W1.Ap[0][0], 0.011253110153604256) && rel(W1.Ap[0][1], 0.02150262403980454)
        && rel(W1.Ap[1][1], 0.04163835510685725)
        && rel(W1.Bm[0][0], 0.7211247851537043) && rel(W1.Am[0][0], 0.09008272110581939);
    },
  },
  {
    id: 'imp-95560-w1-inequality-holds',
    description: 'window (3,1): the direct pencil comparison RUNS and decides the inequality TRUE '
      + '(paper 0.03933416 <= model 0.70767674)',
    holds: () =>
      Math.abs(W1.paperLamMax - 0.03933416090409958) < 1e-9
      && Math.abs(W1.modelLamMax - 0.7076767351647516) < 1e-9
      && W1.inequalityHolds === true && W1.paperLamMax <= W1.modelLamMax,
  },
  {
    id: 'imp-95560-w1-sandwich-inconclusive-witness',
    description: 'window (3,1): the Loewner sandwich is INCONCLUSIVE (DELTA_A indefinite, eigMin < 0) even though '
      + 'the direct inequality holds -- a real port-derived witness for imp-95537 (D2)',
    holds: () =>
      DELTA_A_W1_EIGMIN < 0 && SANDWICH_W1_CONCLUSIVE === false
      && W1.inequalityHolds === true
      && Math.abs(DELTA_A_W1_EIGMIN + 0.0162701087409865) < 1e-9
      && DELTA_B_W1_EIGMIN > 0,
  },
  {
    id: 'imp-95560-w2-cross-checks-imp95220',
    description: 'window (5,2): paperLamMax and modelLamMax reproduce the imp-95220 baked measured seam sup and '
      + 'common-collar class truth (rel 1e-6), cross-validating the Gram conventions, and the inequality HOLDS',
    holds: () => {
      const rel = (a, b) => Math.abs(a - b) <= 1e-6 * Math.abs(b);
      return rel(W2.paperLamMax, IMP95220_SEAM_SUP_52)
        && rel(W2.modelLamMax, IMP95220_COMMON_COLLAR_52)
        && W2.inequalityHolds === true && W2.paperLamMax <= W2.modelLamMax;
    },
  },
  {
    id: 'imp-95560-spot-check-honest',
    description: 'explicitly SPOT-CHECK ONLY: no uniform bound, NO QED, no refereed bound is changed, RH open, LEG '
      + 'B substance (uniformity) untouched',
    holds: () =>
      /SPOT-CHECK ONLY/.test(IMP95560_LEGB_FIXED_WINDOW_GRAM_COMPARISON.honest)
      && /NO QED/.test(IMP95560_LEGB_FIXED_WINDOW_GRAM_COMPARISON.honest)
      && /refereed bound is changed/i.test(IMP95560_LEGB_FIXED_WINDOW_GRAM_COMPARISON.honest)
      && /RH open/.test(IMP95560_LEGB_FIXED_WINDOW_GRAM_COMPARISON.honest)
      && /UNIFORMITY/.test(IMP95560_LEGB_FIXED_WINDOW_GRAM_COMPARISON.netScope),
  },
];

for (const a of IMP95560_LEGB_FIXED_WINDOW_GRAM_COMPARISON_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95560-legb-fixed-window-gram-comparison assertion failed: ${a.id}`);
  }
}

export default IMP95560_LEGB_FIXED_WINDOW_GRAM_COMPARISON;
