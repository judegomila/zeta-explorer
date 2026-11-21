/**
 * @module imp-3385-mupass-smooth-core-family-search
 * @fileoverview imp-3385 -- Search the SMOOTH near-diagonal PASSIVE-CORE family
 *   (Gaussian exp(-(u-v)^2/2L^2) and exponential exp(-|u-v|/L), both PD Toeplitz)
 *   for the section26-mupass absolute verdict pair
 *     lag &lt;= 0.2  -&gt; ||R_c|| = 0.876
 *     lag &lt;= 0.40 -&gt; ||R_c|| = 0.711.
 *   imp-3310 (A) ruled out band-truncated bridge symbols (indefinite, not PD)
 *   and (B) showed the additive PSD-Fejer dominating core matches the verdict
 *   SHAPE but not the absolute pair under any single weight, concluding the exact
 *   recipe must be "a milder, shape-tuned core with far stronger lag-cutoff
 *   sensitivity." The natural surviving candidate imp-3310 did NOT test is the
 *   smooth-decay family, whose length scale L is the PD-preserving analog of the
 *   Fejer lag-cutoff. This module feeds the smooth family into the SAME imp-3310
 *   rank-2 closed-form evaluator and MEASURES whether it reaches the pair.
 *
 *   THE EVALUATOR (ported verbatim from imp-3310)
 *   ---------------------------------------------
 *   Gshear = q (x) p - p (x) q is rank-2 on V = span{p,q}, p = Phi cosh(a t),
 *   q = Phi sinh(a t). For any PD passive core C,
 *     ||R_c|| = sqrt( (q^T C^{-1} q)(p^T C^{-1} p) - (q^T C^{-1} p)^2 ).
 *   The smooth dominating core is
 *     Gpass_c(w, L) = c P_V + w * H phi_i phi_j K_L(u_i - u_j) + RIDGE * I,
 *   K_L Gaussian or exponential. UNLIKE the band truncation of imp-3310 finding
 *   (A), this core is PD for EVERY w &gt;= 0, L &gt; 0: it is the Schur (Hadamard)
 *   product of the PSD rank-1 outer product phi phi^T with a PSD Toeplitz kernel
 *   K_L, plus the PSD projector c P_V and a positive ridge -- the smooth family
 *   is admissible where the band-truncated family was not.
 *
 *   THREE MEASURED FINDINGS ON THE SMOOTH FAMILY
 *   --------------------------------------------
 *   (0) VALIDATION: w = 0 recovers the full-core tautology ||R|| = 1.0000 (~1e-6),
 *       and every sampled (w, L) core is PD (Cholesky succeeds) -- the smooth
 *       class clears the imp-3310 (A) admissibility bar the band class failed.
 *   (A) ANCHOR-LAG READING (apples-to-imp-3310: fix the two widths to the verdict
 *       lags L in {0.2, 0.40}, share one weight). Matching the magnitude 0.876 at
 *       lag &lt;= 0.2 forces lag &lt;= 0.40 to ~0.865 (Gaussian) / ~0.868 (exponential),
 *       an intrinsic ratio ~1.01, NOT the verdict 0.711 (ratio 1.2321). Same
 *       failure mode as additive-Fejer, but with even LESS lag contrast.
 *   (B) HARD RATIO CEILING. Sweeping the weight, the intrinsic lag-0.2/lag-0.40
 *       ratio of the smooth family SATURATES at ~1.014 (Gaussian) / ~1.035
 *       (exponential) -- both strictly below the verdict ratio 1.2321. The smooth
 *       family therefore CANNOT even sweep through the verdict ratio (worse than
 *       additive-Fejer, which at least crossed 1.2321 at w* ~ 3.94). Freeing BOTH
 *       the weight and a global length scale, the best joint fit still floors the
 *       lag &lt;= 0.40 norm near ~0.82 (residual ~0.10-0.12) while holding
 *       lag &lt;= 0.2 = 0.876 -- it never descends to 0.711.
 *
 *   VERDICT (measurement, RH-equivalent, NO QED)
 *   --------------------------------------------
 *   The smooth Gaussian / exponential near-diagonal family is RULED OUT as the
 *   section26-mupass core recipe: its lag-0.2/lag-0.40 contrast is capped near
 *   ~1.01-1.03, structurally too flat to reproduce the verdict's 0.876 -&gt; 0.711
 *   descent (ratio 1.2321), and no single length scale L brings the pair within
 *   ~0.10 of both anchors. This SHARPENS the imp-3310 residual: the surviving
 *   "milder, shape-tuned core with far stronger lag-cutoff sensitivity" is NOT a
 *   smooth-decay kernel -- it needs sharper-than-smooth lag structure than either
 *   PD Toeplitz smoothing supplies. RH-equivalent residual untouched; no
 *   positivity, no reduction; no refereed bound is changed.
 *
 *   @see imp-3310-mupass-passive-core-assembly-recipe.js (the evaluator + the additive-Fejer verdict this extends)
 *   @see imp-3214-mupass-symmetric-normalization-port.js (named this residual; ported the functional calculus)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the verdict whose 0.876/0.711 this assesses)
 *
 *   Ticket: imp-3385 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-2841 grid)
const A = 0.5; // headline shear weight (the genuine-Phi cell)
const U = 6; // genuine-Phi lag cutoff (the headline cell)
const N = 200; // tau-grid panels on [0, U]
const RIDGE = 1e-12; // null-space regularizer (Phi decays fast; core is effectively low-rank)

// The two verdict anchors we assess the smooth family against.
const VERDICT_R_020 = 0.876; // lag <= 0.2  -> ||R_c|| in the section26 verdict
const VERDICT_R_040 = 0.711; // lag <= 0.40 -> ||R_c|| saturation in the verdict
const VERDICT_RATIO = VERDICT_R_020 / VERDICT_R_040; // ~1.2321 (scale-free target)

// The two verdict lags, used directly as the smooth-core correlation widths.
const LAG_020 = 0.2;
const LAG_040 = 0.4;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (same as imp-3310). */
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

// Orthoprojection P_V onto span{p, q} via the 2x2 inverse Gram (same as imp-3310).
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
    const Li = L[i];
    for (let j = 0; j <= i; j++) {
      const Lj = L[j];
      let s = K[i][j];
      for (let k = 0; k < j; k++) s -= Li[k] * Lj[k];
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

/** Smooth PD Toeplitz lag kernel: Gaussian exp(-d^2/2L^2) or exponential exp(-|d|/L). */
function smoothKernel(d, L, kind) {
  return kind === 'gauss' ? Math.exp(-(d * d) / (2 * L * L)) : Math.exp(-Math.abs(d) / L);
}

/**
 * Symmetric-normalization operator norm ||R_c|| for the SMOOTH dominating core
 *   Gpass_c = c P_V + w * H phi_i phi_j K_L(u_i - u_j) + RIDGE * I,
 * via the imp-3310 rank-2 closed form ||R_c|| = sqrt(Gqq Gpp - Gqp^2), G = Gpass_c^{-1}.
 */
// Active prefix: phi underflows to exactly 0 for u > ~1.37, so for i >= M_ACTIVE
// p = q = phi = Pw = Qw = 0 and row/column i of K is (+-0 off-diagonal, RIDGE on
// the diagonal). Those indices are fully decoupled in the Cholesky factor and the
// two solves (they only contribute +-0 terms to the active rows and to Gqq/Gpp/Gqp),
// so restricting to the active prefix gives bit-identical norms at ~1% of the
// O(N^3) cost (the full 200x200 version took ~6 s at import and stalled
// /closure-routes). If the tail were not exactly zero, M_ACTIVE = N (unchanged).
const M_ACTIVE = (() => {
  let m = N;
  while (m > 0 && phi[m - 1] === 0 && p[m - 1] === 0 && q[m - 1] === 0) m--;
  return m;
})();

function smoothCoreNorm(w, L, kind) {
  const K = [];
  for (let i = 0; i < M_ACTIVE; i++) {
    const row = new Float64Array(M_ACTIVE);
    for (let j = 0; j < M_ACTIVE; j++) {
      const d = u[i] - u[j];
      row[j] = cShear * projV(i, j) + w * H * phi[i] * phi[j] * smoothKernel(d, L, kind) + (i === j ? RIDGE : 0);
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
  for (let i = 0; i < M_ACTIVE; i++) {
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
  for (let c = 0; c < 60 && smoothCoreNorm(hi, L, kind).norm > target; c++) {
    hi *= 2;
    if (hi > 1e12) break;
  }
  if (smoothCoreNorm(hi, L, kind).norm > target) return null;
  let lo = 0;
  for (let k = 0; k < 48; k++) {
    const mid = (lo + hi) / 2;
    if (smoothCoreNorm(mid, L, kind).norm > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// (0) Validation: full-core tautology and universal positive-definiteness.
const fullCoreNorm = smoothCoreNorm(0, LAG_020, 'gauss').norm; // w=0 -> ~1.0000
const PD_PROBES = [
  [0.01, 0.1],
  [1, 0.2],
  [100, 0.4],
  [1e4, 0.8],
];
function smoothFamilyAlwaysPD(kind) {
  return PD_PROBES.every(([w, L]) => smoothCoreNorm(w, L, kind).pd === true);
}
const gaussAllPD = smoothFamilyAlwaysPD('gauss');
const expAllPD = smoothFamilyAlwaysPD('exp');

/** Per-family measurement: anchor-lag reading, ratio ceiling, and free 2-parameter floor. */
function measureFamily(kind) {
  // (A) Anchor-lag reading: single weight matched to magnitude 0.876 at lag<=0.2.
  const wMag = matchWeightForNorm(VERDICT_R_020, LAG_020, kind);
  const anchorNorm020 = smoothCoreNorm(wMag, LAG_020, kind).norm;
  const anchorNorm040 = smoothCoreNorm(wMag, LAG_040, kind).norm;
  const anchorRatio = anchorNorm020 / anchorNorm040;

  // (B) Hard ratio ceiling: max intrinsic lag-0.2/lag-0.40 ratio over a safe weight grid.
  let maxAnchorRatio = 0;
  for (let e = -4; e <= 4; e += 0.1) {
    const w = Math.pow(10, e);
    const a = smoothCoreNorm(w, LAG_020, kind);
    const b = smoothCoreNorm(w, LAG_040, kind);
    if (a.pd && b.pd && a.norm > 0.05 && b.norm > 0.05) {
      maxAnchorRatio = Math.max(maxAnchorRatio, a.norm / b.norm);
    }
  }

  // (B) Free 2-parameter floor: length-scale multiplier s (widths s*0.2, s*0.40),
  //     weight re-fit to hold lag<=0.2 at 0.876; report the closest achievable lag<=0.40.
  let best = null;
  for (let si = 0; si <= 40; si++) {
    const s = 0.05 * Math.pow(1.12, si);
    const w = matchWeightForNorm(VERDICT_R_020, s * LAG_020, kind);
    if (w == null) continue;
    const n040 = smoothCoreNorm(w, s * LAG_040, kind).norm;
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
    bestFitLengthScale: best ? best.s : null,
    bestFitWeight: best ? best.w : null,
    bestFitNorm040: best ? best.n040 : null,
    bestFitResidual: best ? best.res : null,
  };
}

const gauss = measureFamily('gauss');
const exp = measureFamily('exp');

// Whole-family verdict: reproduced only if some family lands within 0.05 of BOTH anchors.
function familyReproducesPair(m) {
  return Math.abs(m.anchorNorm020 - VERDICT_R_020) < 0.05 && m.bestFitResidual < 0.05;
}
const smoothFamilyReproducesPair = familyReproducesPair(gauss) || familyReproducesPair(exp);
const smoothFamilyRuledOut =
  !smoothFamilyReproducesPair &&
  gauss.maxAnchorRatio < VERDICT_RATIO &&
  exp.maxAnchorRatio < VERDICT_RATIO;

export const IMP3385_MUPASS_SMOOTH_CORE_FAMILY_SEARCH = Object.freeze({
  id: 'imp-3385-mupass-smooth-core-family-search',
  ticket: 'imp-3385',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedRecipe: 'imp-3310-mupass-passive-core-assembly-recipe.js',
  relatedResidual: 'imp-3214-mupass-symmetric-normalization-port.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',

  summary:
    'Feeds the SMOOTH near-diagonal passive-core family (Gaussian exp(-(u-v)^2/2L^2) ' +
    'and exponential exp(-|u-v|/L), both PD Toeplitz) into the imp-3310 rank-2 ' +
    'closed-form evaluator ||R_c|| = sqrt((q^T C^{-1} q)(p^T C^{-1} p) - (q^T C^{-1} p)^2) ' +
    'to test whether it reproduces the section26-mupass verdict pair 0.876 (lag<=0.2) / ' +
    '0.711 (lag<=0.40) that the additive-Fejer family could not. FINDING 0: every ' +
    'sampled smooth core is PD (Schur product of phi phi^T with a PSD Toeplitz kernel), ' +
    'clearing the imp-3310 (A) admissibility bar the band-truncated class failed, and w=0 ' +
    'recovers the ||R||=1.0000 tautology. FINDING A: fixing the two widths to the verdict ' +
    'lags and sharing one weight, matching magnitude 0.876 at lag<=0.2 forces lag<=0.40 to ' +
    '~0.865 (Gaussian) / ~0.868 (exponential), ratio ~1.01, not 0.711. FINDING B: the ' +
    'intrinsic lag-0.2/lag-0.40 ratio SATURATES at ~1.014 (Gaussian) / ~1.035 (exponential), ' +
    'both below the verdict 1.2321 -- the smooth family cannot even sweep through the ' +
    'verdict ratio (worse than additive-Fejer, which crossed 1.2321 at w*~3.94); freeing ' +
    'both the weight and a global length scale still floors lag<=0.40 near ~0.82 (residual ' +
    '~0.10-0.12) while holding lag<=0.2=0.876. VERDICT: the smooth Gaussian/exponential ' +
    'family is RULED OUT -- its lag contrast is structurally too flat -- sharpening the ' +
    'imp-3310 residual toward a sharper-than-smooth lag structure. Measurement only, ' +
    'RH-equivalent, no positivity, no reduction, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    shearWronskian: 'Gshear = q (x) p - p (x) q, p = Phi cosh(a t), q = Phi sinh(a t) -- rank-2 antisymmetric',
    evaluator: '||R_c|| = sqrt((q^T C^{-1} q)(p^T C^{-1} p) - (q^T C^{-1} p)^2), C any PD passive core (ported from imp-3310)',
    smoothCore: 'Gpass_c = c P_V + w * H phi_i phi_j K_L(u_i-u_j) + RIDGE*I, K_L Gaussian or exponential',
    pdMechanism: 'Schur product of PSD phi phi^T with PSD Toeplitz K_L is PSD -- smooth core PD for all w>=0, L>0 (contrast imp-3310 band truncation)',
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
    gaussAllPD,
    expAllPD,
    verdictR020: VERDICT_R_020,
    verdictR040: VERDICT_R_040,
    verdictRatio: VERDICT_RATIO, // ~1.2321
    gauss, // { wMag, anchorNorm020, anchorNorm040, anchorRatio, maxAnchorRatio, bestFit* }
    exp,
    smoothFamilyReproducesPair, // false
    smoothFamilyRuledOut, // true
  }),

  interpretation: Object.freeze({
    smoothFamilyIsAdmissible:
      'Every sampled smooth core (Gaussian and exponential, across four lengths and weights spanning 1e-2..1e4) is ' +
      'positive-definite because it is the Schur product of the PSD outer product phi phi^T with a PSD Toeplitz lag ' +
      'kernel, plus the PSD projector c P_V and a positive ridge. This clears the imp-3310 finding (A) admissibility ' +
      'bar that the naive band-truncated bridge symbol failed, so the smooth family is a genuine passive-core class.',
    anchorLagReadingFails:
      'Fixing the two correlation widths to the verdict lags (L=0.2, L=0.40) and sharing a single weight -- the ' +
      'apples-to-imp-3310 comparison -- matching magnitude 0.876 at lag<=0.2 leaves lag<=0.40 at ~0.865 (Gaussian) / ' +
      '~0.868 (exponential), an intrinsic ratio ~1.01, nowhere near the verdict 0.711 (ratio 1.2321).',
    hardRatioCeiling:
      'Sweeping the weight, the intrinsic lag-0.2/lag-0.40 ratio of the smooth family saturates at ~1.014 (Gaussian) ' +
      'and ~1.035 (exponential), BOTH strictly below the verdict ratio 1.2321. The smooth family cannot even sweep ' +
      'THROUGH the verdict ratio -- strictly worse than the additive-Fejer family, which crossed 1.2321 at w*~3.94. ' +
      'Freeing both the weight and a global length scale, the best joint fit floors the lag<=0.40 norm near ~0.82 ' +
      '(residual ~0.10-0.12) while holding lag<=0.2 = 0.876; it never descends to 0.711.',
    smoothFamilyRuledOut:
      'The smooth Gaussian/exponential near-diagonal family is RULED OUT as the section26-mupass core recipe: its ' +
      'lag contrast is structurally too flat (~1.01-1.03 ceiling) to reproduce the verdict 0.876 -> 0.711 descent. ' +
      'This sharpens the imp-3310 residual: the surviving "milder, shape-tuned core with far stronger lag-cutoff ' +
      'sensitivity" is NOT a smooth-decay kernel -- it needs sharper-than-smooth lag structure than PD Toeplitz ' +
      'smoothing supplies.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    usedPortedImp3310Evaluator: true,
    smoothFamilyIsPositiveDefinite: true,
    reproducesVerdictScalarValues: false,
    smoothFamilyRuledOut: true,
    coreAssemblyRecipeStillOutOfRepo: true,
    didNotAttemptPositivity: true,
    necessaryNotSufficient:
      'Ruling out the smooth Gaussian/exponential core family and bounding its lag-contrast ceiling does NOT ' +
      'construct the exact passive-core assembly or attempt the K_a >= 0 positivity, which remains the RH-equivalent ' +
      'obstruction.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3385_MUPASS_SMOOTH_CORE_FAMILY_SEARCH_ASSERTIONS = [
  {
    id: 'imp3385-shear-norm-positive',
    why: 'The evaluator normalizes the core against p and q; the shear scale c = ||Gshear|| must be finite positive.',
    holds: () => Number.isFinite(cShear) && cShear > 0,
  },
  {
    id: 'imp3385-full-core-tautology-recovered',
    why: 'VALIDATION: the ported evaluator with w=0 (core = c P_V) recovers the ||R||=1.0000 tautology, confirming ' +
         'the machinery is identical to imp-3310.',
    holds: () => Math.abs(fullCoreNorm - 1) < 1e-4,
  },
  {
    id: 'imp3385-smooth-family-positive-definite',
    why: 'FINDING 0: every sampled Gaussian and exponential core is PD (Schur product of PSD phi phi^T with a PSD ' +
         'Toeplitz kernel), clearing the imp-3310 (A) bar the band-truncated class failed.',
    holds: () => gaussAllPD === true && expAllPD === true,
  },
  {
    id: 'imp3385-anchor-lag-reading-fails',
    why: 'FINDING A: matching magnitude 0.876 at lag<=0.2 leaves lag<=0.40 near ~0.86 (ratio ~1.01), not the verdict ' +
         '0.711 (ratio 1.2321), for both families.',
    holds: () =>
      Math.abs(gauss.anchorNorm020 - VERDICT_R_020) < 1e-2 &&
      gauss.anchorNorm040 > VERDICT_R_040 + 0.1 &&
      gauss.anchorRatio < 1.1 &&
      exp.anchorNorm040 > VERDICT_R_040 + 0.1 &&
      exp.anchorRatio < 1.1,
  },
  {
    id: 'imp3385-hard-ratio-ceiling-below-verdict',
    why: 'FINDING B: the intrinsic lag-0.2/lag-0.40 ratio saturates below the verdict ratio 1.2321 for BOTH families ' +
         '(~1.014 Gaussian, ~1.035 exponential) -- the smooth family cannot even sweep through the verdict ratio.',
    holds: () =>
      gauss.maxAnchorRatio > 1 && gauss.maxAnchorRatio < VERDICT_RATIO &&
      exp.maxAnchorRatio > 1 && exp.maxAnchorRatio < VERDICT_RATIO,
  },
  {
    id: 'imp3385-free-fit-floor-above-target',
    why: 'FINDING B: freeing both the weight and a global length scale, the best achievable lag<=0.40 norm floors ' +
         'well above the verdict 0.711 (residual > 0.05) while holding lag<=0.2 = 0.876 for both families.',
    holds: () =>
      gauss.bestFitResidual > 0.05 && gauss.bestFitNorm040 > VERDICT_R_040 &&
      exp.bestFitResidual > 0.05 && exp.bestFitNorm040 > VERDICT_R_040,
  },
  {
    id: 'imp3385-smooth-family-ruled-out',
    why: 'THE MEASURED VERDICT: no smooth family reproduces the absolute pair, and both ratio ceilings sit below ' +
         '1.2321 -- the smooth Gaussian/exponential family is ruled out.',
    holds: () => smoothFamilyReproducesPair === false && smoothFamilyRuledOut === true,
  },
  {
    id: 'imp3385-honest-no-qed-no-reproduction',
    why: 'Mandatory honesty: smooth family ruled out and the imp-3310 residual sharpened, but the exact 0.876/0.711 ' +
         'recipe is NOT reproduced (still out-of-repo); MEASUREMENT only, RH-equivalent, positivity not attempted, no refereed bound is changed.',
    holds: () => {
      const c = IMP3385_MUPASS_SMOOTH_CORE_FAMILY_SEARCH.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.usedPortedImp3310Evaluator === true &&
        c.smoothFamilyIsPositiveDefinite === true &&
        c.reproducesVerdictScalarValues === false &&
        c.smoothFamilyRuledOut === true &&
        c.coreAssemblyRecipeStillOutOfRepo === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3385_MUPASS_SMOOTH_CORE_FAMILY_SEARCH_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3385-mupass-smooth-core-family-search assertion failed: ${assertion.id}`);
  }
}

export default IMP3385_MUPASS_SMOOTH_CORE_FAMILY_SEARCH;
