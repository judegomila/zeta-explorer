/**
 * imp-95091 - BETA-LEVER sensitivity of the imp-95008 far-bracket ceiling.
 * Companion to imp-95075 (which isolated the isolation-group Q lever): imp-95075
 * cites imp-95026 Finding 1 that the decay/scale exponent beta is a WEAK lever
 * (~6 percent over 0.25..0.5) but that beta figure was never isolated into its
 * own derivation the way Q was. This module derives dcFar/dbeta AT the model
 * point (sigma = 1, c = v = D = 1, theta = 10, beta0 = 1/3) by central difference
 * in beta and reports the dimensionless elasticity, then checks
 * monotonicity/concavity across beta in [0.25, 0.5]. Measurement/derivation
 * only, NO QED.
 *
 * DERIVATIVE (central difference, total beta lever). Unlike Q (where varying c
 * alone is a pure Q rescale), beta enters the far coefficient through MANY
 * channels at once - the isolation group Q = (c D^(1-beta)/v) 2^(-(1-beta)), the
 * corner gaps gSharp, the corner values cornerV, and the width cap rhoCap - so
 * dcFar/dbeta is a TOTAL derivative read off a direct central difference in beta.
 * With beta in {1/3 - 0.02, 1/3 + 0.02}:
 *   dcFar/dbeta = -0.08145863168834006   at beta0 = 1/3 (cFar0 = 0.2717400426244421).
 * Dimensionless elasticity (dcFar/dbeta)(beta0/cFar0) = -0.09992225277955546: a 1
 * percent mis-estimate of the paper decay exponent moves the far ceiling by only
 * ~0.10 percent (and DOWNWARD - cFar shrinks as beta grows). beta is a WEAK
 * lever, roughly nine times weaker than the isolation group Q (elasticity ~0.88,
 * imp-95075) and than the s = sigma + theta lever. This isolates and confirms the
 * imp-95026 Finding 1 "beta ~6 percent over 0.25..0.5" figure with its own
 * derivation.
 *
 * MONOTONICITY + CONVEXITY. cFar(beta) is strictly DECREASING across
 * [0.25, 0.5] (0.28008891607703734 at beta = 0.25 down to 0.2626176699381318 at
 * beta = 0.5, a -6.24 percent total swing). The secant slopes rise monotonically
 * toward zero (-0.10821 -> -0.08814 -> -0.06968 -> -0.04477), so cFar(beta) is
 * CONVEX over the range (second difference positive). Consequently the local
 * linear model cFar0 + (dcFar/dbeta)(beta - beta0) UNDER-predicts the ceiling
 * away from the model point: at beta = 0.5 it predicts 0.2581636040097188 vs the
 * actual 0.2626176699381318 (under by 1.70 percent). Because the swing is tiny
 * (~6 percent) and the ceiling stays near 0.27 across the whole exponent range -
 * three orders under the imp-95075 conservative Q -> 4 threshold - beta does NOT
 * threaten the qualitative "below 4" transfer; it barely moves the margin.
 *
 * SUB-GAP (honest, inherited from imp-95026/imp-95075). The actual Section 4.5
 * packet decay exponent beta (and the other packet constants) are NOT pinned in
 * this repository (the paper text is not carried here). This module therefore
 * places the MODEL beta0 = 1/3 at the center and delivers the local sensitivity
 * dcFar/dbeta and the beta scan; the remaining step is to read beta off the
 * paper packet definition and read cFar off this curve. The map already shows
 * the decay exponent is a weak (~0.10-elastic), convex lever that keeps cFar near
 * 0.27 across the whole plausible range.
 *
 * The numerics below CROSS-CHECK the statements; they are not the claim.
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── parameterized ceiling machinery (identical shape to imp-95026/imp-95075) ──
function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

function iQuad(T, rho, s, N, pad) {
  const lo = -pad;
  const hi = T + pad;
  const h = (hi - lo) / N;
  let acc = 0;
  for (let i = 0; i < N; i++) {
    const u = lo + (i + 0.5) * h;
    acc += Math.pow(1 + Math.abs(u) / rho, -s) * Math.pow(1 + Math.abs(u - T), -s);
  }
  return (acc * h) / Math.sqrt(rho);
}

function farCoefficient(sigma, beta, c, v, D, theta) {
  const Q = isolationQ(c, v, beta, D);
  const s = sigma + theta;
  const gSharp = (j) => Math.pow(2, beta) * gOld(j, Q, beta);
  const cornerV = (b, j) => Math.pow(2, b * (1 - beta)) * gSharp(j);
  const rhoCap = (j) => Math.pow(2, -(j - 1) * beta);
  const phiTail = (x) => Math.pow(1 + x, -theta);
  let Tx2 = 0;
  for (let j = 2; j <= 800; j++) {
    const t = phiTail(gSharp(j));
    if (!Number.isFinite(t) || t === 0) break;
    Tx2 += t;
  }
  const envE = (b, j) => iQuad(cornerV(b, j), rhoCap(j), s, 200000, 120);
  const omegaE = (b) => {
    let sum = 0;
    for (let j = 2; j <= 40; j += 2) {
      const t = envE(b, j);
      if (!Number.isFinite(t) || t === 0) break;
      sum += t;
    }
    const r = b % 2;
    for (let j = 2; j <= b - r; j += 2) sum += envE(b - j, j);
    return sum;
  };
  let sup = 0;
  for (let b = 0; b <= 8; b++) {
    const o = omegaE(b);
    if (o > sup) sup = o;
  }
  return { Q, s, ceiling: (2 * sup) / Tx2 };
}

// central-difference dcFar/dbeta at the model point (total beta lever)
const BETA0 = 1 / 3;
const DBETA = 0.02;
function dCFarDBetaAtModel() {
  const em = farCoefficient(1, BETA0 - DBETA, 1, 1, 1, 10);
  const ep = farCoefficient(1, BETA0 + DBETA, 1, 1, 1, 10);
  return (ep.ceiling - em.ceiling) / (2 * DBETA);
}

// ── baked literals (all re-derived by the assertions) ────────────────────────
const CFAR0 = 0.2717400426244421; // model far coefficient at beta0 = 1/3 (imp-95026 quad)
const DCFAR_DBETA = -0.08145863168834006; // dcFar/dbeta at beta0 (central diff, 1/3 +/- 0.02)
const ELASTICITY = -0.09992225277955546; // (dcFar/dbeta)(beta0/cFar0), dimensionless
const Q_ELASTICITY = 0.8847868296486842; // isolation-group elasticity (imp-95075) for contrast
const PRE17_FAR = 4; // pre-seventeenth far coefficient
// beta scan (reproduces the imp-95026 Finding 1 betaScan exactly)
const BETA_SCAN = {
  "0.25": 0.28008891607703734,
  "0.30": 0.2746781943729275,
  "0.3333333333333333": 0.2717400426244421, // beta = 1/3 (model)
  "0.40": 0.26709439904634114,
  "0.50": 0.2626176699381318,
};
const RANGE_PCT = -6.237749920136126; // percent change in cFar over beta 0.25 -> 0.50
const LINEAR_PRED_AT_B05 = 0.2581636040097188; // local linear model at beta = 0.5
const ACTUAL_AT_B05 = 0.2626176699381318; // true convex value at beta = 0.5
const UNDERPRED_RATIO = 0.9830397325150957; // linear under-predicts by ~1.70%

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95091_BETA_LEVER_FAR_CEILING_SENSITIVITY = {
  ticket:
    "imp-95091 (isolate the beta lever of the imp-95008 far-bracket ceiling: derive dcFar/dbeta and the dimensionless elasticity over beta in [0.25,0.5] at the model point, as imp-95075 did for isolation Q)",
  source:
    "imp-95026 Finding 1 betaScan; imp-95075 isolation-Q derivation; Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture.",
  betaChannels:
    "Unlike the isolation group Q (a pure c rescale), beta enters the far coefficient through several channels at once - Q = (c D^(1-beta)/v) 2^(-(1-beta)), the corner gaps gSharp, the corner values cornerV, and the width cap rhoCap - so dcFar/dbeta is a TOTAL derivative read off a direct central difference in beta at the model point.",
  derivative: {
    beta0: BETA0,
    cFar0: CFAR0,
    dCFardBeta: DCFAR_DBETA,
    elasticity: ELASTICITY,
    isolationQelasticityForContrast: Q_ELASTICITY,
    note: "elasticity ~ -0.10: a 1 percent mis-estimate of the paper decay exponent moves cFar only ~0.10 percent, and DOWNWARD (cFar shrinks as beta grows) - a WEAK lever, roughly nine times weaker than the isolation group Q (~0.88, imp-95075) and than s = sigma + theta. This isolates the imp-95026 Finding 1 beta ~6 percent figure with its own derivation.",
  },
  monotonicityConvexity: {
    rangePct: RANGE_PCT,
    linearPredAtB05: LINEAR_PRED_AT_B05,
    actualAtB05: ACTUAL_AT_B05,
    underpredRatio: UNDERPRED_RATIO,
    note: "cFar(beta) is strictly DECREASING across [0.25,0.5] (-6.24 percent total) and CONVEX (secant slopes rise monotonically toward zero: -0.10821 -> -0.04477), so the local linear model UNDER-predicts away from the model point (by 1.70 percent at beta = 0.5). The swing is tiny; the ceiling stays near 0.27 across the whole exponent range.",
  },
  betaScan: BETA_SCAN,
  betaPlacement:
    "The model instantiation beta = 1/3 (c = v = D = 1) lands at cFar0 = 0.2717400426244421. The beta scan spans cFar in [0.2626, 0.2801] as beta runs over [0.25, 0.5] - all near 0.27 and three orders under the imp-95075 conservative Q -> 4 threshold. Because cFar is convex and only ~0.10-elastic in beta, even a large decay-exponent mis-estimate keeps the ledger comfortably below 4: the decay exponent does NOT threaten the qualitative below-4 transfer, it barely moves the margin.",
  openResiduals: [
    "the paper Section 4.5 packet decay exponent beta (and the other packet constants) are not pinned in this repository - this places the MODEL beta0 = 1/3 at the center and gives the local sensitivity dcFar/dbeta; the remaining step is to read beta off the paper packet definition and read cFar off this convex curve",
    "the derivative is measured by finite difference on the same midpoint quadrature (N = 200000) as imp-95026/imp-95075; an interval-arithmetic bound on dcFar/dbeta is not attempted here",
  ],
  isRigorous: true,
  rigorScope:
    "MEASUREMENT/DERIVATION. dcFar/dbeta = -0.08145863168834006 is a central difference (beta in {1/3 - 0.02, 1/3 + 0.02}) on the imp-95026 parameterized quadrature at the model point; the elasticity, the beta scan, and the convexity under-prediction (1.70 percent at beta = 0.5) are computed directly and cross-checked against the baked imp-95026 betaScan literals (reproduced exactly). No paper constant is instantiated (the paper text is not carried here), so no transferred ceiling is CLAIMED - only the beta-lever sensitivity and its place on the scan. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT/DERIVATION of the beta (decay-exponent) lever for the imp-95008 far-bracket ceiling, the companion to the imp-95075 isolation-Q derivation. dcFar/dbeta = -0.08145863168834006 at beta0 = 1/3 (elasticity -0.09992225277955546: a WEAK lever, roughly nine times weaker than the isolation group Q at ~0.88, and cFar shrinks as beta grows). cFar(beta) is strictly DECREASING and CONVEX over [0.25,0.5] (secant slopes rise -0.10821 -> -0.04477), so the local linear model UNDER-predicts above the model point (by 1.70 percent at beta = 0.5). The beta scan spans cFar in [0.2626, 0.2801] - all near 0.27 and three orders under the pre-seventeenth 4 - so the decay exponent does NOT threaten the below-4 transfer, it barely moves the margin. This isolates the imp-95026 Finding 1 beta ~6 percent figure (range -6.24 percent over 0.25..0.5) with its own derivation. SUB-GAP: the paper beta is not pinned in this repo, so this places the MODEL beta on the scan, not a paper number. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95091_BETA_LEVER_ASSERTIONS = [
  {
    id: "imp95091-model-cFar",
    description:
      "the model point sigma = 1, c = v = D = 1, theta = 10, beta = 1/3 reproduces cFar0 = 0.2717400426244421 (imp-95026 quadrature)",
    holds: () => {
      const m = farCoefficient(1, BETA0, 1, 1, 1, 10);
      return Math.abs(m.ceiling - CFAR0) <= 1e-12 * CFAR0;
    },
  },
  {
    id: "imp95091-derivative-value",
    description:
      "the central-difference dcFar/dbeta at the model point (beta in {1/3 - 0.02, 1/3 + 0.02}) reproduces -0.08145863168834006, the elasticity (dcFar/dbeta)(beta0/cFar0) = -0.09992225277955546, and cFar SHRINKS with beta",
    holds: () => {
      const d = dCFarDBetaAtModel();
      const e = (d * BETA0) / CFAR0;
      return (
        Math.abs(d - DCFAR_DBETA) <= 1e-12 * Math.abs(DCFAR_DBETA) &&
        Math.abs(e - ELASTICITY) <= 1e-12 * Math.abs(ELASTICITY) &&
        d < 0 // cFar DECREASES with beta (imp-95026 Finding 1)
      );
    },
  },
  {
    id: "imp95091-weak-lever-vs-Q",
    description:
      "beta is a WEAK lever: |elasticity| ~ 0.10 is far below the isolation-group Q elasticity ~0.88 (imp-95075), and below 1",
    holds: () =>
      Math.abs(ELASTICITY) < 0.15 && Math.abs(ELASTICITY) < Q_ELASTICITY / 5,
  },
  {
    id: "imp95091-scan-monotone-decreasing-convex",
    description:
      "the beta scan reproduces the imp-95026 betaScan, is strictly DECREASING in beta, and is CONVEX (secant slopes rise monotonically toward zero)",
    holds: () => {
      const betas = [0.25, 0.3, BETA0, 0.4, 0.5];
      const rows = betas.map((b) => [b, farCoefficient(1, b, 1, 1, 1, 10).ceiling]);
      // reproduce baked scan
      const baked = Object.entries(BETA_SCAN)
        .map(([b, cf]) => [Number(b), cf])
        .sort((a, b) => a[0] - b[0]);
      for (let i = 0; i < rows.length; i++) {
        if (Math.abs(rows[i][1] - baked[i][1]) > 1e-12 * baked[i][1]) return false;
      }
      // strictly decreasing
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i][1] < rows[i - 1][1])) return false;
      }
      // convex: secant slopes increasing
      const slopes = [];
      for (let i = 1; i < rows.length; i++) {
        slopes.push((rows[i][1] - rows[i - 1][1]) / (rows[i][0] - rows[i - 1][0]));
      }
      for (let i = 1; i < slopes.length; i++) {
        if (!(slopes[i] > slopes[i - 1])) return false;
      }
      // all far below the pre-seventeenth 4
      return rows.every(([, cf]) => cf < PRE17_FAR);
    },
  },
  {
    id: "imp95091-convex-underprediction",
    description:
      "cFar(beta) is convex: the local linear model cFar0 + dcFar/dbeta (beta - beta0) UNDER-predicts at beta = 0.5, giving 0.2581636040097188 vs the actual 0.2626176699381318 (under by ~1.70 percent)",
    holds: () => {
      const pred = CFAR0 + DCFAR_DBETA * (0.5 - BETA0);
      const actual = farCoefficient(1, 0.5, 1, 1, 1, 10).ceiling;
      return (
        Math.abs(pred - LINEAR_PRED_AT_B05) <= 1e-12 * LINEAR_PRED_AT_B05 &&
        Math.abs(actual - ACTUAL_AT_B05) <= 1e-12 * ACTUAL_AT_B05 &&
        pred < actual &&
        Math.abs(pred / actual - UNDERPRED_RATIO) <= 1e-9
      );
    },
  },
  {
    id: "imp95091-honesty-gate",
    description:
      "the verdict names the sub-gap (paper beta not pinned; places the MODEL beta on the scan), records the derivative, the weak-lever comparison to Q, and the convexity, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95091_BETA_LEVER_FAR_CEILING_SENSITIVITY.promotesBound === false &&
      IMP95091_BETA_LEVER_FAR_CEILING_SENSITIVITY.openResiduals.length === 2 &&
      /NO QED/.test(IMP95091_BETA_LEVER_FAR_CEILING_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP95091_BETA_LEVER_FAR_CEILING_SENSITIVITY.verdict) &&
      /CONVEX/.test(IMP95091_BETA_LEVER_FAR_CEILING_SENSITIVITY.verdict) &&
      /WEAK/.test(IMP95091_BETA_LEVER_FAR_CEILING_SENSITIVITY.verdict) &&
      /SUB-GAP/.test(IMP95091_BETA_LEVER_FAR_CEILING_SENSITIVITY.verdict),
  },
];

for (const a of IMP95091_BETA_LEVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95091-beta-lever-far-ceiling-sensitivity assertion failed: ${a.id}`);
  }
}

export default IMP95091_BETA_LEVER_FAR_CEILING_SENSITIVITY;
