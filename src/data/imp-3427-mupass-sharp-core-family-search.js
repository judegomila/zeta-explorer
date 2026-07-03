/**
 * @module imp-3427-mupass-sharp-core-family-search
 * @fileoverview imp-3427 -- Search the SHARPER-THAN-SMOOTH near-diagonal
 *   PASSIVE-CORE family (compactly-supported PD lag kernels with a HARD cutoff:
 *   the triangular/tent Wendland-C0 (1-r)_+, Wendland-C2 (1-r)_+^4 (1+4r), and
 *   Wendland-C4 (1-r)_+^6 (1+6r+35/3 r^2), all PD Toeplitz) for the
 *   section26-mupass absolute verdict pair
 *     lag &lt;= 0.2  -&gt; ||R_c|| = 0.876
 *     lag &lt;= 0.40 -&gt; ||R_c|| = 0.711  (scale-free target ratio 1.2321).
 *   imp-3385 ruled out the SMOOTH Gaussian/exponential family (its intrinsic
 *   lag-0.2/lag-0.40 contrast ratio capped ~1.014-1.035, far below 1.2321) and
 *   sharpened the imp-3310 residual to: "the recipe needs a milder, shape-tuned
 *   core with far STRONGER lag-cutoff sensitivity than smooth-decay supplies."
 *   The natural surviving candidate is a compactly-supported kernel, whose HARD
 *   support radius is the sharpest PD lag cutoff available. This module feeds that
 *   family into the SAME imp-3310 rank-2 closed-form evaluator and MEASURES the
 *   highest attainable contrast ratio and the closest joint fit to the pair.
 *
 *   THE EVALUATOR (ported verbatim from imp-3310 via imp-3385)
 *   ---------------------------------------------------------
 *   Gshear = q (x) p - p (x) q is rank-2 on V = span{p,q}, p = Phi cosh(a t),
 *   q = Phi sinh(a t). For any PD passive core C,
 *     ||R_c|| = sqrt( (q^T C^{-1} q)(p^T C^{-1} p) - (q^T C^{-1} p)^2 ).
 *   The sharp dominating core is
 *     Gpass_c(w, L) = c P_V + w * H phi_i phi_j K_L(u_i - u_j) + RIDGE * I,
 *   K_L a compactly-supported PD kernel (r = |u_i-u_j|/L, support r &lt;= 1). Like
 *   the smooth family and UNLIKE the band truncation of imp-3310 finding (A), this
 *   core is PD for EVERY w &gt;= 0, L &gt; 0: it is the Schur (Hadamard) product of the
 *   PSD rank-1 outer product phi phi^T with a PSD (Wendland) Toeplitz kernel K_L,
 *   plus the PSD projector c P_V and a positive ridge.
 *
 *   MEASURED FINDINGS ON THE SHARP FAMILY
 *   -------------------------------------
 *   (0) VALIDATION: w = 0 recovers the full-core tautology ||R|| = 1.0000 (~1e-6),
 *       and every sampled (w, L) Wendland core is PD (Cholesky succeeds).
 *   (A) THE CONTRAST CEILING RISES TO THE VERDICT. Sweeping the weight with the two
 *       widths fixed to the verdict lags, the intrinsic lag-0.2/lag-0.40 ratio of
 *       the compact family reaches ~1.164 (tent), ~1.208 (Wendland-C4), and ~1.218
 *       (Wendland-C2) -- versus the smooth family's ~1.035 ceiling. Wendland-C2 lands
 *       within ~1.2% of the verdict ratio 1.2321: the HARD compact support is exactly
 *       the "far stronger lag-cutoff sensitivity" the imp-3385 residual named. A
 *       re-derived exponential (Matern nu=1/2) inside this module reproduces the
 *       smooth ceiling ~1.035, and the smoother Matern nu=3/2 sits lower at ~1.010,
 *       confirming the monotone contrast &lt;- sharpness ordering.
 *   (B) BUT THE NEAR-VERDICT RATIO LIVES WHERE THE MAGNITUDES COLLAPSE. The ~1.218
 *       ceiling is attained only at large weight (w ~ 3.5), where BOTH norms have
 *       collapsed to ~0.06 (peak lag&lt;=0.2 ~0.061, lag&lt;=0.40 ~0.050) -- nowhere near
 *       the verdict's 0.876. At the magnitude-matched weight (lag&lt;=0.2 = 0.876) the
 *       ratio drops back to ~1.024, and the best free-length joint fit (weight re-fit
 *       to hold lag&lt;=0.2 = 0.876) still floors lag&lt;=0.40 at ~0.817 (residual ~0.106),
 *       only marginally better than the smooth family's ~0.82.
 *
 *   VERDICT (measurement, RH-equivalent, NO QED)
 *   --------------------------------------------
 *   The sharper-than-smooth compactly-supported family CLOSES the contrast-ratio gap
 *   the smooth family could not -- its intrinsic lag-0.2/lag-0.40 ceiling rises from
 *   ~1.035 (smooth) to ~1.218 (Wendland-C2), essentially reaching the verdict ratio
 *   1.2321 -- CONFIRMING the imp-3385 diagnosis that a hard lag cutoff supplies the
 *   missing sensitivity. But the absolute pair 0.876/0.711 is STILL NOT reproduced:
 *   the near-verdict ratio is attained only where both magnitudes collapse to ~0.06,
 *   and holding the magnitude anchor 0.876 drops the ratio back to ~1.02 (joint-fit
 *   floor ~0.817, residual ~0.106). This SHARPENS the residual once more (sub-gap
 *   imp-3427-subgap-magnitude-contrast-decoupling): the missing ingredient is NOT
 *   lag-cutoff sharpness -- compact support supplies enough -- but the DECOUPLING of
 *   the contrast from the absolute magnitude; a single-weight Schur core delivers
 *   ratio 1.23 and magnitude 0.876 at opposite ends of the weight axis, so the exact
 *   recipe needs a magnitude degree of freedom (a two-scale / mixture core) that a
 *   single scalar-weighted kernel lacks. RH-equivalent residual untouched; no
 *   positivity, no reduction; Platt-Trudgian Lambda &lt;= 0.2 remains SOTA.
 *
 *   @see imp-3385-mupass-smooth-core-family-search.js (the smooth-family search this extends; ported evaluator)
 *   @see imp-3310-mupass-passive-core-assembly-recipe.js (the evaluator + the additive-Fejer verdict)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the verdict whose 0.876/0.711 this assesses)
 *
 *   Ticket: imp-3427 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid)
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const U = 6; // genuine-Phi lag cutoff (the headline cell)
const N = 200; // tau-grid panels on [0, U]
const RIDGE = 1e-12; // null-space regularizer (Phi decays fast; core is effectively low-rank)

// The two verdict anchors we assess the sharp family against.
const VERDICT_R_020 = 0.876; // lag <= 0.2  -> ||R_c|| in the section26 verdict
const VERDICT_R_040 = 0.711; // lag <= 0.40 -> ||R_c|| saturation in the verdict
const VERDICT_RATIO = VERDICT_R_020 / VERDICT_R_040; // ~1.2321 (scale-free target)

// The two verdict lags, used directly as the compact-core support radii.
const LAG_020 = 0.2;
const LAG_040 = 0.4;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3385). */
function phiKernel(uu) {
  let s = 0;
  const e4 = Math.exp(4 * uu);
  const e2 = Math.exp(2 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

const H = U / N;
const rootH = Math.sqrt(H);
const u = new Array(N);
const phi = new Array(N);
const p = new Float64Array(N); // p = Phi cosh(a t)
const q = new Float64Array(N); // q = Phi sinh(a t)
const Pw = new Float64Array(N); // whitened p (sqrt(H) p)
const Qw = new Float64Array(N); // whitened q
for (let i = 0; i < N; i++) {
  u[i] = (i + 0.5) * H;
  phi[i] = phiKernel(u[i]);
  p[i] = phi[i] * Math.cosh(A * u[i]);
  q[i] = phi[i] * Math.sinh(A * u[i]);
  Pw[i] = rootH * p[i];
  Qw[i] = rootH * q[i];
}

// H-weighted Gram of {p, q} and the shear scale c = ||Gshear||.
let Pg = 0;
let Qg = 0;
let Mg = 0;
for (let i = 0; i < N; i++) {
  Pg += p[i] * p[i] * H;
  Qg += q[i] * q[i] * H;
  Mg += p[i] * q[i] * H;
}
const cShear = Math.sqrt(Math.max(0, Pg * Qg - Mg * Mg));

// Orthoprojection P_V onto span{p, q} via the 2x2 inverse Gram (same as imp-3385).
const epp = p.reduce((s, x) => s + x * x, 0);
const eqq = q.reduce((s, x) => s + x * x, 0);
const epq = p.reduce((s, x, i) => s + x * q[i], 0);
const detE = epp * eqq - epq * epq;
const giAA = eqq / detE;
const giAB = -epq / detE;
const giBB = epp / detE;
function projV(i, j) {
  const a = p[i] * giAA + q[i] * giAB;
  const b = p[i] * giAB + q[i] * giBB;
  return a * p[j] + b * q[j];
}

/** Dense Cholesky factor; returns { pd:false } if not positive-definite. */
function cholFactor(K) {
  const n = K.length;
  const L = [];
  for (let i = 0; i < n; i++) L.push(new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = K[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) return { pd: false };
        L[i][j] = Math.sqrt(s);
      } else {
        L[i][j] = s / L[j][j];
      }
    }
  }
  return {
    pd: true,
    solve(b) {
      const y = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        let s = b[i];
        for (let k = 0; k < i; k++) s -= L[i][k] * y[k];
        y[i] = s / L[i][i];
      }
      const x = new Float64Array(n);
      for (let i = n - 1; i >= 0; i--) {
        let s = y[i];
        for (let k = i + 1; k < n; k++) s -= L[k][i] * x[k];
        x[i] = s / L[i][i];
      }
      return x;
    },
  };
}

/**
 * SHARPER-THAN-SMOOTH PD lag kernels, r = |d|/L (support r &lt;= 1 for the compact ones):
 *   matern32   (1+sqrt3 r) e^{-sqrt3 r}          -- smoother baseline (below exponential)
 *   matern12   e^{-r}                            -- exponential, the imp-3385 smooth ceiling
 *   tent       (1-r)_+                           -- Wendland-C0, hard compact cutoff, sharp cusp
 *   wendland   (1-r)_+^4 (1+4r)                  -- Wendland-C2, compact, C^2 interior
 *   wendlandC4 (1-r)_+^6 (1+6r+35/3 r^2)         -- Wendland-C4, compact, C^4 interior
 */
function sharpKernel(d, L, kind) {
  const r = Math.abs(d) / L;
  switch (kind) {
    case 'matern32': {
      const sr = Math.sqrt(3) * r;
      return (1 + sr) * Math.exp(-sr);
    }
    case 'matern12':
      return Math.exp(-r);
    case 'tent':
      return Math.max(0, 1 - r);
    case 'wendland': {
      const t = Math.max(0, 1 - r);
      return t * t * t * t * (1 + 4 * r);
    }
    case 'wendlandC4': {
      const t = Math.max(0, 1 - r);
      return t * t * t * t * t * t * (1 + 6 * r + (35 / 3) * r * r);
    }
    default:
      return 0;
  }
}

/**
 * Symmetric-normalization operator norm ||R_c|| for the sharp dominating core
 *   Gpass_c = c P_V + w * H phi_i phi_j K_L(u_i - u_j) + RIDGE * I,
 * via the imp-3310 rank-2 closed form ||R_c|| = sqrt(Gqq Gpp - Gqp^2), G = Gpass_c^{-1}.
 */
function sharpCoreNorm(w, L, kind) {
  const K = [];
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const d = u[i] - u[j];
      row[j] = cShear * projV(i, j) + w * H * phi[i] * phi[j] * sharpKernel(d, L, kind) + (i === j ? RIDGE : 0);
    }
    K.push(row);
  }
  const f = cholFactor(K);
  if (!f.pd) return { pd: false };
  const xq = f.solve(Qw);
  const xp = f.solve(Pw);
  let Gqq = 0;
  let Gpp = 0;
  let Gqp = 0;
  let GqpAlt = 0;
  for (let i = 0; i < N; i++) {
    Gqq += Qw[i] * xq[i];
    Gpp += Pw[i] * xp[i];
    Gqp += Qw[i] * xp[i];
    GqpAlt += Pw[i] * xq[i];
  }
  return {
    pd: true,
    norm: Math.sqrt(Math.max(0, Gqq * Gpp - Gqp * Gqp)),
    symmetryErr: Math.abs(Gqp - GqpAlt),
  };
}

/** Bisect the weight w so ||R_c||(w, L) = target (norm is decreasing in w from 1). */
function matchWeightForNorm(target, L, kind) {
  let hi = 1;
  for (let c = 0; c < 60 && sharpCoreNorm(hi, L, kind).norm > target; c++) {
    hi *= 2;
    if (hi > 1e12) break;
  }
  if (sharpCoreNorm(hi, L, kind).norm > target) return null;
  let lo = 0;
  for (let k = 0; k < 48; k++) {
    const mid = (lo + hi) / 2;
    if (sharpCoreNorm(mid, L, kind).norm > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// (0) Validation: full-core tautology and universal positive-definiteness.
const fullCoreNorm = sharpCoreNorm(0, LAG_020, 'wendland').norm; // w=0 -> ~1.0000
const PD_PROBES = [
  [0.01, 0.1],
  [1, 0.2],
  [100, 0.4],
  [1e4, 0.8],
];
function sharpFamilyAlwaysPD(kind) {
  return PD_PROBES.every(([w, L]) => sharpCoreNorm(w, L, kind).pd === true);
}
const tentAllPD = sharpFamilyAlwaysPD('tent');
const wendlandAllPD = sharpFamilyAlwaysPD('wendland');
const wendlandC4AllPD = sharpFamilyAlwaysPD('wendlandC4');

/** Per-family measurement: anchor-lag reading, contrast ceiling, ratio-peak magnitudes, free-length floor. */
function measureFamily(kind) {
  // (A) Anchor-lag reading: single weight matched to magnitude 0.876 at lag<=0.2.
  const wMag = matchWeightForNorm(VERDICT_R_020, LAG_020, kind);
  const anchorNorm020 = sharpCoreNorm(wMag, LAG_020, kind).norm;
  const anchorNorm040 = sharpCoreNorm(wMag, LAG_040, kind).norm;
  const anchorRatio = anchorNorm020 / anchorNorm040;

  // (A) Contrast ceiling: max intrinsic lag-0.2/lag-0.40 ratio over a safe weight grid.
  let maxAnchorRatio = 0;
  let maxRatioWeight = 0;
  for (let e = -4; e <= 6; e += 0.02) {
    const w = Math.pow(10, e);
    const a = sharpCoreNorm(w, LAG_020, kind);
    const b = sharpCoreNorm(w, LAG_040, kind);
    if (a.pd && b.pd && a.norm > 0.05 && b.norm > 0.05) {
      const rr = a.norm / b.norm;
      if (rr > maxAnchorRatio) {
        maxAnchorRatio = rr;
        maxRatioWeight = w;
      }
    }
  }
  // (B) Magnitudes AT the ratio-peak weight -- where the near-verdict ratio lives.
  const peakNorm020 = sharpCoreNorm(maxRatioWeight, LAG_020, kind).norm;
  const peakNorm040 = sharpCoreNorm(maxRatioWeight, LAG_040, kind).norm;

  // (B) Free 2-parameter floor: length-scale multiplier s (radii s*0.2, s*0.40),
  //     weight re-fit to hold lag<=0.2 at 0.876; report the closest achievable lag<=0.40.
  let best = null;
  for (let si = 0; si <= 40; si++) {
    const s = 0.05 * Math.pow(1.12, si);
    const w = matchWeightForNorm(VERDICT_R_020, s * LAG_020, kind);
    if (w == null) continue;
    const n040 = sharpCoreNorm(w, s * LAG_040, kind).norm;
    const res = Math.abs(n040 - VERDICT_R_040);
    if (best == null || res < best.res) best = { s, w, n040, res };
  }

  return {
    kind,
    wMag,
    anchorNorm020,
    anchorNorm040,
    anchorRatio,
    maxAnchorRatio,
    maxRatioWeight,
    peakNorm020,
    peakNorm040,
    bestFitLengthScale: best ? best.s : null,
    bestFitWeight: best ? best.w : null,
    bestFitNorm040: best ? best.n040 : null,
    bestFitResidual: best ? best.res : null,
  };
}

const matern32 = measureFamily('matern32'); // smoother baseline (below exponential)
const matern12 = measureFamily('matern12'); // exponential -- reproduces the imp-3385 smooth ceiling
const tent = measureFamily('tent'); // Wendland-C0
const wendland = measureFamily('wendland'); // Wendland-C2 -- the sharpest contrast reached
const wendlandC4 = measureFamily('wendlandC4'); // Wendland-C4

// Best-attainable contrast ratio across the whole sharp family, and the tightest joint fit.
const COMPACT = [tent, wendland, wendlandC4];
const bestAttainableRatio = Math.max(...COMPACT.map((m) => m.maxAnchorRatio));
const bestRatioFamily = COMPACT.find((m) => m.maxAnchorRatio === bestAttainableRatio).kind;
const bestJointFitResidual = Math.min(...COMPACT.map((m) => m.bestFitResidual));

// The sharp family reaches the verdict RATIO but not the absolute PAIR.
const sharpReachesVerdictRatio = bestAttainableRatio > matern12.maxAnchorRatio + 0.1 &&
  Math.abs(bestAttainableRatio - VERDICT_RATIO) < 0.05;
const sharpFamilyReproducesPair =
  Math.abs(wendland.anchorNorm020 - VERDICT_R_020) < 0.05 && bestJointFitResidual < 0.05;

export const IMP3427_MUPASS_SHARP_CORE_FAMILY_SEARCH = Object.freeze({
  id: 'imp-3427-mupass-sharp-core-family-search',
  ticket: 'imp-3427',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedSmoothSearch: 'imp-3385-mupass-smooth-core-family-search.js',
  relatedRecipe: 'imp-3310-mupass-passive-core-assembly-recipe.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',

  summary:
    'Feeds the SHARPER-THAN-SMOOTH near-diagonal passive-core family (compactly-supported ' +
    'PD Wendland kernels with a HARD lag cutoff: tent (1-r)_+ = Wendland-C0, Wendland-C2 ' +
    '(1-r)_+^4 (1+4r), Wendland-C4 (1-r)_+^6 (1+6r+35/3 r^2)) into the imp-3310 rank-2 ' +
    'closed-form evaluator ||R_c|| = sqrt((q^T C^{-1} q)(p^T C^{-1} p) - (q^T C^{-1} p)^2) ' +
    'to test whether it reaches the section26-mupass verdict pair 0.876 (lag<=0.2) / 0.711 ' +
    '(lag<=0.40) after imp-3385 ruled out the smooth Gaussian/exponential family (contrast ' +
    'ceiling ~1.035, far below the verdict ratio 1.2321). FINDING 0: every sampled Wendland ' +
    'core is PD (Schur product of phi phi^T with a PSD compact Toeplitz kernel) and w=0 ' +
    'recovers ||R||=1.0000. FINDING A: the HARD compact support lifts the intrinsic ' +
    'lag-0.2/lag-0.40 contrast ceiling to ~1.164 (tent), ~1.208 (Wendland-C4) and ~1.218 ' +
    '(Wendland-C2) -- within ~1.2% of the verdict ratio 1.2321, a ~5x reduction of the ' +
    'smooth family contrast deficit; a re-derived exponential (Matern nu=1/2) reproduces the ' +
    '~1.035 smooth ceiling and Matern nu=3/2 sits lower (~1.010), confirming the monotone ' +
    'contrast-vs-sharpness ordering. FINDING B: BUT the near-verdict ratio is attained only ' +
    'at large weight (w~3.5) where both norms collapse to ~0.06 (peak lag<=0.2 ~0.061, ' +
    'lag<=0.40 ~0.050); at the magnitude-matched weight (lag<=0.2=0.876) the ratio falls back ' +
    'to ~1.024, and the best free-length joint fit still floors lag<=0.40 at ~0.817 (residual ' +
    '~0.106). VERDICT: the compact family CLOSES the contrast-ratio gap the smooth family ' +
    'could not (confirming the imp-3385 hard-cutoff diagnosis) but STILL does not reproduce ' +
    'the absolute pair 0.876/0.711 -- sharpening the residual to a magnitude/contrast ' +
    'DECOUPLING sub-gap (a single scalar-weighted Schur core delivers ratio 1.23 and ' +
    'magnitude 0.876 at opposite ends of the weight axis). Measurement only, RH-equivalent, ' +
    'no positivity, no reduction, NO QED. PT Lambda <= 0.2 remains SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearWronskian: 'Gshear = q (x) p - p (x) q, p = Phi cosh(a t), q = Phi sinh(a t) -- rank-2 antisymmetric',
    evaluator: '||R_c|| = sqrt((q^T C^{-1} q)(p^T C^{-1} p) - (q^T C^{-1} p)^2), C any PD passive core (ported from imp-3310 via imp-3385)',
    sharpCore: 'Gpass_c = c P_V + w * H phi_i phi_j K_L(u_i-u_j) + RIDGE*I, K_L a compactly-supported Wendland kernel',
    kernels: 'matern32 (1+sqrt3 r)e^{-sqrt3 r}; matern12 e^{-r}; tent (1-r)_+; wendland (1-r)_+^4(1+4r); wendlandC4 (1-r)_+^6(1+6r+35/3 r^2), r=|d|/L',
    pdMechanism: 'Schur product of PSD phi phi^T with a PSD Wendland Toeplitz K_L is PSD -- compact core PD for all w>=0, L>0',
    ridge: RIDGE,
    a: A,
    U,
    N,
    quadrature: 'midpoint N panels on [0,U]; whitened basis, dense Cholesky solves; exact rank-2 norm',
    selfComputing: true,
  }),

  measured: Object.freeze({
    shearOperatorNorm: cShear,
    fullCoreNorm, // w=0 tautology -> ~1.0000
    tentAllPD,
    wendlandAllPD,
    wendlandC4AllPD,
    verdictR020: VERDICT_R_020,
    verdictR040: VERDICT_R_040,
    verdictRatio: VERDICT_RATIO, // ~1.2321
    matern32, // smoother baseline (contrast ~1.010)
    matern12, // exponential -> reproduces the imp-3385 smooth ceiling ~1.035
    tent, // Wendland-C0 (contrast ~1.164)
    wendland, // Wendland-C2 (contrast ~1.218 -- the sharpest reached)
    wendlandC4, // Wendland-C4 (contrast ~1.208)
    bestAttainableRatio, // ~1.218 (Wendland-C2)
    bestRatioFamily, // 'wendland'
    bestJointFitResidual, // ~0.102-0.106
    sharpReachesVerdictRatio, // true -- within ~1.2% of 1.2321
    sharpFamilyReproducesPair, // false -- absolute pair still out of reach
  }),

  interpretation: Object.freeze({
    sharpFamilyIsAdmissible:
      'Every sampled compactly-supported Wendland core (tent, C2, C4 across four lengths and weights spanning ' +
      '1e-2..1e4) is positive-definite because it is the Schur product of the PSD outer product phi phi^T with a ' +
      'PSD Wendland Toeplitz lag kernel, plus the PSD projector c P_V and a positive ridge -- a genuine passive-core ' +
      'class, like the smooth family and unlike the band-truncated bridge symbol of imp-3310 finding (A).',
    contrastCeilingRisesToVerdict:
      'The HARD compact support supplies the "far stronger lag-cutoff sensitivity" the imp-3385 residual named: the ' +
      'intrinsic lag-0.2/lag-0.40 contrast ceiling rises from the smooth family ~1.035 to ~1.164 (tent), ~1.208 ' +
      '(Wendland-C4) and ~1.218 (Wendland-C2), the last within ~1.2% of the verdict ratio 1.2321 -- a ~5x reduction ' +
      'of the smooth-family contrast deficit. The re-derived exponential (Matern nu=1/2) reproduces the ~1.035 ' +
      'smooth ceiling and Matern nu=3/2 sits lower (~1.010), so contrast rises monotonically with kernel sharpness.',
    nearVerdictRatioLivesWhereMagnitudesCollapse:
      'The ~1.218 ceiling is attained only at large weight (w~3.5) where BOTH norms have collapsed to ~0.06 (peak ' +
      'lag<=0.2 ~0.061, lag<=0.40 ~0.050), nowhere near the verdict magnitude 0.876. At the magnitude-matched weight ' +
      '(lag<=0.2 = 0.876) the ratio drops back to ~1.024, and the best free-length joint fit (weight re-fit to hold ' +
      'lag<=0.2 = 0.876) still floors lag<=0.40 at ~0.817 (residual ~0.106), only marginally better than the smooth ' +
      'family ~0.82; the absolute pair 0.876/0.711 is not reproduced.',
    subgapMagnitudeContrastDecoupling:
      'imp-3427-subgap-magnitude-contrast-decoupling: the missing ingredient is NOT lag-cutoff sharpness -- compact ' +
      'support supplies enough to reach the verdict ratio -- but the DECOUPLING of contrast from absolute magnitude. ' +
      'A single scalar-weighted Schur core delivers ratio 1.23 and magnitude 0.876 at opposite ends of the weight ' +
      'axis, so the exact section26-mupass recipe needs a magnitude degree of freedom independent of the lag-contrast ' +
      '(a two-scale / mixture core), which no single-kernel single-weight family can provide.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    usedPortedImp3310Evaluator: true,
    sharpFamilyIsPositiveDefinite: true,
    reachesVerdictRatio: true,
    reproducesVerdictScalarValues: false,
    coreAssemblyRecipeStillOutOfRepo: true,
    didNotAttemptPositivity: true,
    subgap: 'imp-3427-subgap-magnitude-contrast-decoupling',
    necessaryNotSufficient:
      'Reaching the verdict lag-contrast RATIO with a compactly-supported Wendland core and bounding where it lives ' +
      'does NOT construct the exact passive-core assembly (the absolute 0.876/0.711 pair is not reproduced) nor ' +
      'attempt the K_a >= 0 positivity, which remains the RH-equivalent imp-3066 obstruction.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3427_MUPASS_SHARP_CORE_FAMILY_SEARCH_ASSERTIONS = [
  {
    id: 'imp3427-shear-norm-positive',
    why: 'The evaluator normalizes the core against p and q; the shear scale c = ||Gshear|| must be finite positive.',
    holds: () => Number.isFinite(cShear) && cShear > 0,
  },
  {
    id: 'imp3427-full-core-tautology-recovered',
    why: 'VALIDATION: the ported evaluator with w=0 (core = c P_V) recovers the ||R||=1.0000 tautology, confirming ' +
         'the machinery is identical to imp-3310/imp-3385.',
    holds: () => Math.abs(fullCoreNorm - 1) < 1e-4,
  },
  {
    id: 'imp3427-sharp-family-positive-definite',
    why: 'FINDING 0: every sampled compactly-supported Wendland core (tent, C2, C4) is PD (Schur product of PSD ' +
         'phi phi^T with a PSD compact Toeplitz kernel).',
    holds: () => tentAllPD === true && wendlandAllPD === true && wendlandC4AllPD === true,
  },
  {
    id: 'imp3427-exponential-recovers-smooth-ceiling',
    why: 'CROSS-CHECK: the re-derived exponential (Matern nu=1/2) inside this module reproduces the imp-3385 smooth ' +
         'contrast ceiling ~1.035, and the smoother Matern nu=3/2 sits below it -- the monotone contrast-vs-sharpness ordering.',
    holds: () =>
      matern12.maxAnchorRatio > 1 && matern12.maxAnchorRatio < 1.06 &&
      matern32.maxAnchorRatio > 1 && matern32.maxAnchorRatio < matern12.maxAnchorRatio,
  },
  {
    id: 'imp3427-compact-contrast-beats-smooth',
    why: 'FINDING A: the hard compact support lifts the contrast ceiling well above the smooth family -- tent ~1.16, ' +
         'Wendland-C2 ~1.22, each strictly greater than the exponential ceiling ~1.035.',
    holds: () =>
      tent.maxAnchorRatio > matern12.maxAnchorRatio + 0.05 &&
      wendland.maxAnchorRatio > tent.maxAnchorRatio &&
      wendland.maxAnchorRatio > 1.18,
  },
  {
    id: 'imp3427-best-ratio-reaches-verdict',
    why: 'FINDING A: the best attainable contrast ratio (Wendland-C2 ~1.218) lands within ~2% of the verdict ratio ' +
         '1.2321 -- the compact family essentially reaches it, but does not exceed it.',
    holds: () =>
      bestRatioFamily === 'wendland' &&
      bestAttainableRatio > 1.2 &&
      bestAttainableRatio < VERDICT_RATIO &&
      Math.abs(bestAttainableRatio - VERDICT_RATIO) < 0.05,
  },
  {
    id: 'imp3427-near-verdict-ratio-collapses-magnitude',
    why: 'FINDING B: the near-verdict ratio lives only where the magnitudes collapse -- at the ratio-peak weight both ' +
         'Wendland-C2 norms are ~0.06 (well below 0.2), and the magnitude-matched anchor ratio falls back below ~1.05.',
    holds: () =>
      wendland.peakNorm020 < 0.2 && wendland.peakNorm040 < 0.2 &&
      wendland.anchorRatio < 1.05,
  },
  {
    id: 'imp3427-joint-fit-floor-above-target',
    why: 'FINDING B: the best free-length joint fit (holding lag<=0.2=0.876) still floors lag<=0.40 well above the ' +
         'verdict 0.711 (residual > 0.05) -- the absolute pair is not reproduced.',
    holds: () =>
      bestJointFitResidual > 0.05 && wendland.bestFitNorm040 > VERDICT_R_040,
  },
  {
    id: 'imp3427-sharp-reaches-ratio-not-pair',
    why: 'THE MEASURED VERDICT: the sharp compact family reaches the verdict RATIO (~1.218 vs 1.2321) but NOT the ' +
         'absolute PAIR 0.876/0.711 -- sharpening the imp-3385 residual to a magnitude/contrast decoupling sub-gap.',
    holds: () => sharpReachesVerdictRatio === true && sharpFamilyReproducesPair === false,
  },
  {
    id: 'imp3427-honest-no-qed-no-reproduction',
    why: 'Mandatory honesty: the contrast ratio reached but the absolute 0.876/0.711 recipe NOT reproduced (still ' +
         'out-of-repo); MEASUREMENT only, RH-equivalent, positivity not attempted, imp-3066 untouched, PT 0.2 SOTA.',
    holds: () => {
      const c = IMP3427_MUPASS_SHARP_CORE_FAMILY_SEARCH.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.usedPortedImp3310Evaluator === true &&
        c.sharpFamilyIsPositiveDefinite === true &&
        c.reachesVerdictRatio === true &&
        c.reproducesVerdictScalarValues === false &&
        c.coreAssemblyRecipeStillOutOfRepo === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3427_MUPASS_SHARP_CORE_FAMILY_SEARCH_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3427-mupass-sharp-core-family-search assertion failed: ${assertion.id}`);
  }
}

export default IMP3427_MUPASS_SHARP_CORE_FAMILY_SEARCH;
