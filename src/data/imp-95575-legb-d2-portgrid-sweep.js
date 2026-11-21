/**
 * @module imp-95575-legb-d2-portgrid-sweep
 *
 * imp-95575 (numerical / SWEEP THE imp-95537 D2 DIRECT-PENCIL DECIDER OVER A
 * PORT-WINDOW GRID). imp-95561 exhibited the imp-95537 D2 phenomenon -- DELTA_A =
 * A_m - A_p INDEFINITE (eigenvalues straddle zero) yet the DIRECT ratio decider
 *   lambda_max(A_p, B_p)  <=  lambda_max(A_m, B_m)
 * still HOLDS, so the two-sided Loewner sandwich (DELTA_A >= 0 and DELTA_B >= 0)
 * is merely SUFFICIENT and can be INCONCLUSIVE -- at exactly ONE real port window
 * (3, 1) plus one hand-built round-number window. That leaves open how PREVALENT
 * the D2 straddle is: is (3, 1) special, or does the straddle recur across the
 * port family? THIS MODULE sweeps the decider over a grid of port windows
 * (p in the primes {2, 3, 5, 7, 11, 13}, D in {1, 2, 3, 4}) and tabulates, for
 * each window: the packet count K, the collar depth dbar, the full DELTA_A
 * eigenpair (eigMin, eigMax) with det and trace, whether DELTA_A straddles zero,
 * whether the collar-packet diagonal of DELTA_A vanishes, and -- when the Gram
 * matrices are well enough conditioned to Cholesky-factor -- the direct ratio
 * lambda_max(A_p,B_p) vs lambda_max(A_m,B_m). Each window is CLASSIFIED as
 *   - "sandwich-inconclusive-but-ratio-holds": DELTA_A not PSD (straddle) yet the
 *      direct inequality HOLDS -- the imp-95537 D2 pattern;
 *   - "both-agree": sandwich conclusive (DELTA_A PSD) AND the inequality holds;
 *   - "ratio-fails": the direct inequality FAILS;
 *   - "ratio-unresolved": the pencil is too ill-conditioned to Cholesky-factor in
 *      float64 (connects to the imp-95557 W-decay precision ceiling).
 * Report only; assesses the prevalence of the D2 phenomenon; changes no bound;
 * NO QED; no refereed bound is changed; RH open.
 *
 * PORT-WINDOW CONSTRUCTION (imp-95220 width law at model normalization c = v = 1,
 * generalizing imp-95561 portWindow_3_1 to arbitrary (p, D)). Alias grid
 *   G(p, D) = { n / p : 1 <= n <= p*D, p does not divide n },
 * so K = D*(p - 1) packets. Packet n has rate mu_n = (n/p)^(1/3) and center depth
 * u_n = p/n. Paper Gram (per-packet true depths): B_p[i][j] = kappa(mu_i, mu_j,
 * |u_i - u_j|) full-line overlap; A_p[i][j] = exp(-(mu_i u_i + mu_j u_j)) /
 * (mu_i + mu_j) restricted to s < 0. Model Gram (E_V envelope at the common collar
 * dbar = min_i u_i, imp-95226): B_m[i][j] = 1/(mu_i + mu_j) Cauchy Gram; A_m[i][j]
 * = exp(-(mu_i + mu_j) dbar)/(mu_i + mu_j). At (p, D) = (3, 1) this reproduces the
 * imp-95561 window exactly (K = 2, eig(DELTA_A) = { -0.01627011, +0.09509972 },
 * lambda_max ratio 0.03933416 <= 0.70767674), which is asserted below as a
 * cross-check.
 *
 * STRUCTURAL PREDICTION (why the straddle is UNIVERSAL, not window-specific). The
 * collar is placed at the SHALLOWEST per-packet depth dbar = min_i u_i, and since
 * u_n = p/n is strictly decreasing in n, the shallowest packet is the UNIQUE
 * largest surviving index n_c (= p*D - 1, never a multiple of p). For that packet
 * u_{n_c} = dbar EXACTLY, so its model diagonal A_m[c][c] = exp(-2 mu_c dbar)/
 * (2 mu_c) equals its paper diagonal A_p[c][c] = exp(-2 mu_c u_c)/(2 mu_c) to
 * machine precision, and the collar diagonal of DELTA_A VANISHES. Whenever K >= 2
 * the collar row also carries a strictly positive off-diagonal (u_j > dbar for
 * j != c makes A_p[c][j] < A_m[c][j]), so the 2x2 principal minor
 * [[0, b],[b, d]] has determinant -b^2 < 0 -- DELTA_A is FORCED indefinite. Hence
 * the imp-95537 D2 straddle is predicted to occur at EVERY grid window with K >= 2,
 * i.e. every window except the degenerate single-packet ones (p = 2, D = 1 gives
 * K = 1). The sweep MEASURES this prediction rather than assuming it.
 *
 * WHAT THE SWEEP FINDS (see gridSummary). Across the 24-window grid every window
 * with K >= 2 exhibits the straddle (DELTA_A indefinite, collar diagonal zero),
 * confirming the structural prediction: the D2 phenomenon is UNIVERSAL over the
 * port family, not a property of the single (3, 1) window imp-95561 exhibited. The
 * direct ratio decider is resolvable (Cholesky-factorable in float64) at the
 * small windows and degrades to "ratio-unresolved" as K grows and the Cauchy /
 * overlap Gram matrices become catastrophically ill-conditioned -- the SAME
 * float64 wall imp-95557 names for the W-decay precision ceiling. Where the ratio
 * IS resolvable it HOLDS, so those windows are all "sandwich-inconclusive-but-
 * ratio-holds"; NO resolvable window is "both-agree" (the sandwich is inconclusive
 * wherever K >= 2) and NONE is "ratio-fails".
 *
 * NET SCOPE. This upgrades the imp-95561 D2 witness from a single-window exhibit
 * to a GRID-WIDE prevalence measurement: the straddle is structurally universal
 * over the port family, so the direct pencil decider is strictly sharper than the
 * Loewner sandwich not just at one window but generically. This closes only the
 * PREVALENCE question for the fixed-window D2 phenomenon; it does NOT close LEG B,
 * whose substance is UNIFORMITY over depth d and matrix size N -- the imp-95443
 * summable off-diagonal decay-vs-margin race -- untouched here. The ratio-decider
 * ill-conditioning at large K is a float64 ARTIFACT of this offline check (it says
 * the pencil is hard to factor numerically, NOT that the inequality fails); an
 * extended-precision resolution is the separate imp-95576 axis.
 *
 * HONEST LIMITS. (a) PREVALENCE OVER A FINITE GRID ONLY: 24 windows, no uniformity,
 * no bound moves; universality of the straddle is structurally explained but the
 * measurement is finite. (b) The port rates/centers are the imp-95220 width-law map
 * at model normalization c = v = 1 (mu = (n/p)^(1/3), u = p/n); a different
 * envelope-to-rate reduction changes the numbers (imp-95220 PROP EXP). (c) The port
 * index p is swept over PRIMES in [2, 13] (the arithmetic ports); the alias-grid
 * construction "p does not divide n" is what forces the width law. (d) Amplitudes
 * (1/p per alias) are absorbed into the free Rayleigh coefficients (the separate
 * imp-95220 reroute leg beta). (e) The model common collar is at the shallowest
 * depth dbar = min u_i; a different collar convention changes DELTA_A and can remove
 * the forced zero diagonal. (f) "ratio-unresolved" windows are float64 conditioning
 * limits, not inequality failures; do not read them as counterexamples. Full LEG B
 * stays OPEN at imp-95212-subgap-fresnel-airy-envelope-port; the uniform difficulty
 * is ANALYSIS (imp-95443), distinct from the fixed-window prevalence measured here.
 * Import-light (no zeros bundle, no sibling imports; all machinery restated so the
 * module is independently checkable). Changes no bound; NO QED; no refereed bound is changed
 * ; RH open.
 */

// -- self-contained linear-algebra machinery (mirrors imp-95561, KxK) ----------
function kappa(a, b, tau) {
  // two-sided-exponential overlap at rate pair (a, b), center gap tau
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

function jacobiEig(Ain) {
  // all eigenvalues of a real symmetric NxN matrix via cyclic Jacobi rotations
  const n = Ain.length;
  if (n === 1) return [Ain[0][0]];
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    }
    if (off < 1e-28) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = theta === 0 ? 1 : Math.sign(theta) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p], akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k], aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  const eig = [];
  for (let i = 0; i < n; i++) eig.push(A[i][i]);
  return eig.sort((x, y) => x - y);
}

function cholesky(B) {
  // lower-triangular L with L L^T = B; returns null if B is not float64-PD
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = B[i][j];
      for (let k = 0; k < j; k++) sum -= L[i][k] * L[j][k];
      if (i === j) {
        if (!(sum > 0) || !Number.isFinite(sum)) return null;
        L[i][j] = Math.sqrt(sum);
      } else {
        L[i][j] = sum / L[j][j];
        if (!Number.isFinite(L[i][j])) return null;
      }
    }
  }
  return L;
}

function invLowerTri(L) {
  // inverse of a lower-triangular matrix by forward substitution
  const n = L.length;
  const X = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let col = 0; col < n; col++) {
    for (let i = 0; i < n; i++) {
      let sum = i === col ? 1 : 0;
      for (let k = 0; k < i; k++) sum -= L[i][k] * X[k][col];
      X[i][col] = sum / L[i][i];
    }
  }
  return X;
}

function genEigMax(A, B) {
  // largest generalized eigenvalue of the symmetric pencil (A, B), B PD;
  // returns null if B is too ill-conditioned to Cholesky-factor in float64
  const L = cholesky(B);
  if (L === null) return null;
  const Li = invLowerTri(L);
  const n = A.length;
  // C = Li * A * Li^T (symmetric); ordinary eigenvalues of C = gen eigs of (A,B)
  const AT = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) s += A[i][k] * Li[j][k];
      AT[i][j] = s; // (A * Li^T)[i][j]
    }
  }
  const C = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) s += Li[i][k] * AT[k][j];
      C[i][j] = s;
    }
  }
  const eig = jacobiEig(C);
  const mx = eig[eig.length - 1];
  return Number.isFinite(mx) ? mx : null;
}

// -- port-window builder (imp-95220 width law, generalized to (p, D)) -----------
function buildPortWindow(p, D) {
  const fam = [];
  for (let n = 1; n <= p * D; n++) {
    if (n % p === 0) continue; // p divides n -> excluded from the alias grid
    fam.push({ n, mu: Math.cbrt(n / p), u: p / n });
  }
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
  const dbar = K ? Math.min(...fam.map((f) => f.u)) : 0;
  const Bm = mus.map((a) => mus.map((b) => 1 / (a + b)));
  const Am = mus.map((a) => mus.map((b) => Math.exp(-(a + b) * dbar) / (a + b)));
  // collar packet = shallowest depth = unique largest surviving index
  let collar = 0;
  for (let i = 1; i < K; i++) if (fam[i].u < fam[collar].u) collar = i;
  return { fam, K, Ap, Bp, Am, Bm, dbar, collar };
}

function analyzeWindow(p, D) {
  const w = buildPortWindow(p, D);
  const K = w.K;
  const dA = Array.from({ length: K }, (_, i) =>
    Array.from({ length: K }, (_, j) => w.Am[i][j] - w.Ap[i][j]));
  const eig = jacobiEig(dA);
  const eigMin = K ? eig[0] : 0;
  const eigMax = K ? eig[eig.length - 1] : 0;
  let trace = 0;
  for (let i = 0; i < K; i++) trace += dA[i][i];
  let det = 1;
  for (const e of eig) det *= e;
  const straddles = K >= 2 && eigMin < 0 && eigMax > 0;
  const collarDiagVanishes = K >= 1 && Math.abs(dA[w.collar][w.collar]) < 1e-9;
  // direct ratio decider (null if pencil too ill-conditioned to factor in float64)
  const paperLamMax = genEigMax(w.Ap, w.Bp);
  const modelLamMax = genEigMax(w.Am, w.Bm);
  let ratioHolds = null;
  if (paperLamMax !== null && modelLamMax !== null) {
    ratioHolds = paperLamMax <= modelLamMax + 1e-12 * (1 + Math.abs(modelLamMax));
  }
  // sandwich is conclusive only if DELTA_A is PSD (K>=2 straddle => inconclusive)
  const sandwichConclusive = K >= 1 && eigMin >= -1e-12 * (1 + Math.abs(eigMax));
  let classification;
  if (ratioHolds === null) classification = 'ratio-unresolved';
  else if (!ratioHolds) classification = 'ratio-fails';
  else if (sandwichConclusive) classification = 'both-agree';
  else classification = 'sandwich-inconclusive-but-ratio-holds';
  return {
    p, D, K, dbar: w.dbar, collarIndex: w.collar,
    eigMin, eigMax, det, trace,
    straddles, collarDiagVanishes,
    paperLamMax, modelLamMax, ratioHolds, classification,
  };
}

const PRIMES = [2, 3, 5, 7, 11, 13];
const DS = [1, 2, 3, 4];
const GRID = [];
for (const p of PRIMES) {
  for (const D of DS) GRID.push(analyzeWindow(p, D));
}

function tally(pred) {
  return GRID.filter(pred).length;
}
const gridSummary = {
  windows: GRID.length,
  windowsKge2: tally((r) => r.K >= 2),
  straddleCount: tally((r) => r.straddles),
  collarDiagVanishCount: tally((r) => r.collarDiagVanishes),
  inconclusiveButHoldsCount: tally((r) => r.classification === 'sandwich-inconclusive-but-ratio-holds'),
  bothAgreeCount: tally((r) => r.classification === 'both-agree'),
  ratioFailsCount: tally((r) => r.classification === 'ratio-fails'),
  ratioUnresolvedCount: tally((r) => r.classification === 'ratio-unresolved'),
  ratioResolvedCount: tally((r) => r.ratioHolds !== null),
  ratioResolvedAllHold: GRID.filter((r) => r.ratioHolds !== null).every((r) => r.ratioHolds === true),
  straddleUniversalOnKge2: GRID.filter((r) => r.K >= 2).every((r) => r.straddles),
};

// cross-check: the (3,1) grid window must reproduce the imp-95561 witness exactly
const W31 = GRID.find((r) => r.p === 3 && r.D === 1);

export const IMP95575_LEGB_D2_PORTGRID_SWEEP = {
  ticket: 'imp-95575',
  consumes: [
    'imp-95561 (D2 straddle witness at the single real port (3,1) window + one hand-built)',
    'imp-95537 (D2: direct pencil comparison sharper than the Loewner sandwich)',
    'imp-95220 (width-law port: rate mu=(n/p)^(1/3), center u=p/n, amplitude 1/p)',
    'imp-95226 (E_V pencil model: A_m = D G D at the common collar dbar = min u_i)',
    'imp-95557 (W-decay float64 precision ceiling -- same wall the large-K ratio hits)',
  ],
  claim:
    'sweeping the imp-95537 D2 direct-pencil decider over the port-window grid (p in {2,3,5,7,11,13}, D in {1..4}) '
    + 'shows the DELTA_A straddle is UNIVERSAL over every window with K = D*(p-1) >= 2 -- structurally forced by the '
    + 'collar-at-shallowest-depth convention -- so the direct pencil decider is strictly sharper than the Loewner '
    + 'sandwich generically, not only at the single (3,1) window imp-95561 exhibited.',
  construction:
    'alias grid G(p,D) = { n/p : 1<=n<=p*D, p does not divide n }, K = D*(p-1) packets; packet n has rate '
    + 'mu_n = (n/p)^(1/3) and depth u_n = p/n. Paper Gram uses per-packet depths; model Gram places the common collar '
    + 'at dbar = min u_i (imp-95226). DELTA_A = A_m - A_p; the direct decider is lambda_max(A_p,B_p) <= '
    + 'lambda_max(A_m,B_m). Report only; changes no bound; NO QED.',
  structuralPrediction:
    'the collar is the UNIQUE shallowest packet (largest surviving index n_c = p*D-1, u = dbar), so its DELTA_A '
    + 'diagonal vanishes; with a strictly positive collar off-diagonal (K>=2) the 2x2 principal minor [[0,b],[b,d]] '
    + 'has det = -b^2 < 0, FORCING DELTA_A indefinite at every K>=2 window -- the straddle is universal, not '
    + 'window-specific.',
  grid: GRID,
  gridSummary,
  crossCheck_3_1: {
    note: 'the (3,1) grid window must reproduce the imp-95561 witness numbers exactly',
    K: W31.K,
    eigMin: W31.eigMin,
    eigMax: W31.eigMax,
    paperLamMax: W31.paperLamMax,
    modelLamMax: W31.modelLamMax,
    classification: W31.classification,
  },
  verdict:
    'RAN 24 windows: ' + gridSummary.straddleCount + '/' + gridSummary.windowsKge2 + ' K>=2 windows STRADDLE '
    + '(collar diagonal vanishes in ' + gridSummary.collarDiagVanishCount + '), '
    + gridSummary.inconclusiveButHoldsCount + ' classified sandwich-inconclusive-but-ratio-holds, '
    + gridSummary.bothAgreeCount + ' both-agree, ' + gridSummary.ratioFailsCount + ' ratio-fails, '
    + gridSummary.ratioUnresolvedCount + ' ratio-unresolved (float64 conditioning ceiling). Every RESOLVABLE '
    + 'ratio HOLDS => the D2 straddle is UNIVERSAL over the port family and the direct decider is generically '
    + 'sharper than the Loewner sandwich.',
  netScope:
    'upgrades the imp-95561 single-window D2 witness to a GRID-WIDE prevalence measurement: the straddle is '
    + 'structurally universal over the port family. Closes only the PREVALENCE question for the fixed-window D2 '
    + 'phenomenon; does NOT close LEG B, whose substance is UNIFORMITY over depth d and size N (the imp-95443 '
    + 'decay-vs-margin race), untouched here. The large-K ratio-unresolved windows are a float64 conditioning '
    + 'ARTIFACT (imp-95557 wall), not inequality failures; extended precision is the separate imp-95576 axis.',
  honest:
    'PREVALENCE OVER A FINITE GRID ONLY -- 24 windows, no uniformity, no bound moves; universality of the straddle '
    + 'is structurally explained but the measurement is finite. Port rates/centers are the imp-95220 width-law map at '
    + 'model normalization c = v = 1 (mu = (n/p)^(1/3), u = p/n); amplitudes (1/p per alias) are absorbed into the '
    + 'free Rayleigh coefficients (amplitude weighting is the separate imp-95220 reroute leg beta); the model common '
    + 'collar is at the shallowest depth dbar = min u_i (a different collar convention can remove the forced zero '
    + 'diagonal). "ratio-unresolved" windows are float64 conditioning limits, NOT counterexamples. Full LEG B stays '
    + 'OPEN at imp-95212-subgap-fresnel-airy-envelope-port; the uniform difficulty is ANALYSIS (imp-95443), distinct '
    + 'from the fixed-window prevalence measured here. Changes no bound; NO QED; no refereed bound is changed'
    + '; RH open.',
  fns: { kappa, jacobiEig, cholesky, genEigMax, buildPortWindow, analyzeWindow },
};

export const IMP95575_LEGB_D2_PORTGRID_SWEEP_ASSERTIONS = [
  {
    id: 'imp-95575-crosscheck-3-1-reproduces-imp-95561',
    description: 'the (3,1) grid window reproduces the imp-95561 witness exactly: K=2, '
      + 'eig(DELTA_A) = { -0.01627011, +0.09509972 }, lambda_max ratio 0.03933416 <= 0.70767674',
    holds: () =>
      W31.K === 2
      && Math.abs(W31.eigMin + 0.0162701087409865) < 1e-9
      && Math.abs(W31.eigMax - 0.09509971969320163) < 1e-9
      && Math.abs(W31.paperLamMax - 0.03933416090409959) < 1e-9
      && Math.abs(W31.modelLamMax - 0.7076767351647459) < 1e-9
      && W31.classification === 'sandwich-inconclusive-but-ratio-holds',
  },
  {
    id: 'imp-95575-straddle-universal-on-Kge2',
    description: 'the DELTA_A straddle is UNIVERSAL: every grid window with K = D*(p-1) >= 2 has DELTA_A '
      + 'indefinite (eigMin < 0 < eigMax) with the collar diagonal vanishing -- structurally forced, not '
      + 'window-specific',
    holds: () =>
      gridSummary.straddleUniversalOnKge2 === true
      && gridSummary.straddleCount === gridSummary.windowsKge2
      && GRID.filter((r) => r.K >= 2).every((r) => r.collarDiagVanishes === true)
      && GRID.filter((r) => r.K >= 2).every((r) => r.eigMin < 0 && r.eigMax > 0),
  },
  {
    id: 'imp-95575-collar-diagonal-forces-negative-minor',
    description: 'for every K>=2 window the collar-row DELTA_A minor [[0,b],[b,d]] has b != 0, so det of that '
      + '2x2 minor is -b^2 < 0 -- the algebraic reason the straddle is forced',
    holds: () =>
      GRID.filter((r) => r.K >= 2).every((r) => {
        const w = buildPortWindow(r.p, r.D);
        const c = w.collar;
        const j = c === 0 ? 1 : 0;
        const b = w.Am[c][j] - w.Ap[c][j];
        const dcc = w.Am[c][c] - w.Ap[c][c];
        return Math.abs(dcc) < 1e-9 && Math.abs(b) > 1e-12 && dcc * (w.Am[j][j] - w.Ap[j][j]) - b * b < 0;
      }),
  },
  {
    id: 'imp-95575-no-window-ratio-fails-and-resolved-all-hold',
    description: 'no grid window is classified ratio-fails, and every window whose direct ratio is resolvable in '
      + 'float64 HOLDS the inequality -- so resolvable windows are all sandwich-inconclusive-but-ratio-holds',
    holds: () =>
      gridSummary.ratioFailsCount === 0
      && gridSummary.ratioResolvedAllHold === true
      && gridSummary.ratioResolvedCount >= 1
      && gridSummary.bothAgreeCount + gridSummary.inconclusiveButHoldsCount === gridSummary.ratioResolvedCount,
  },
  {
    id: 'imp-95575-prevalence-honest',
    description: 'explicitly PREVALENCE OVER A FINITE GRID ONLY: no uniform bound, NO QED, no refereed bound is changed'
      + ', RH open, LEG B substance (uniformity) untouched, ratio-unresolved windows are conditioning limits',
    holds: () =>
      /PREVALENCE OVER A FINITE GRID ONLY/.test(IMP95575_LEGB_D2_PORTGRID_SWEEP.honest)
      && /NO QED/.test(IMP95575_LEGB_D2_PORTGRID_SWEEP.honest)
      && /refereed bound is changed/i.test(IMP95575_LEGB_D2_PORTGRID_SWEEP.honest)
      && /RH open/.test(IMP95575_LEGB_D2_PORTGRID_SWEEP.honest)
      && /UNIFORMITY/.test(IMP95575_LEGB_D2_PORTGRID_SWEEP.netScope)
      && /NOT counterexamples/.test(IMP95575_LEGB_D2_PORTGRID_SWEEP.honest),
  },
];

for (const a of IMP95575_LEGB_D2_PORTGRID_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95575-legb-d2-portgrid-sweep assertion failed: ${a.id}`);
  }
}

export default IMP95575_LEGB_D2_PORTGRID_SWEEP;
