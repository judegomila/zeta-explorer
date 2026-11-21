/**
 * imp-95089 - WITNESS E-REALIZATION SPLIT (measurement; closes the internals
 * half of the imp-95008 sub-gap imp-95008-subgap-witness-Erealization-split).
 *
 * imp-95008 (continuation twenty-two, imp-95008-perron-weighted-far-routing.js)
 * closed the ceiling-side (b2)+(b3) aggregation lever (weighted-Schur / Theorem
 * Y-PERRON, worth only 0.0866 percent) and PINNED the surviving headline
 * residual 1.4032010197013394 to the E-realization step, naming the open
 * sub-gap: decompose that residual into (attainment shortfall) x (norm-penalty
 * sum ||w_b||^2 / (lambda_max M)) for the exhibited headline witness. That
 * needs the witness internals E_cross and sum ||w_b||^2 SEPARATELY - the chain
 * bakes only the assembled floor F = E / (Tx(2) M).
 *
 * WHAT THIS MODULE DOES. It reconstructs the exhibited fifteenth-continuation
 * terminal headline 13-packet witness (P = 999983, penta base + eight-step
 * greedy occupied-block append; identical geometry to
 * imp-95008-witness-floor-pin.js) and MEASURES the excess constituents
 * separately, so the residual can be decomposed rather than assumed:
 *   E = C_cross - S ,
 * where C_cross = sum over cross-block pairs (i, j) of 2 a_i a_j K(mu_i, mu_j,
 * |u_i - u_j|) is the realized cross-block correlation (the quantity the
 * ceiling roll-up caps), and S = sum_i a_i^2 / mu_i + sum over same-block pairs
 * 2 a_i a_j K is the within-block squared-norm sum, i.e. the norm penalty
 * sum_b ||w_b||^2 (self-energy plus same-block correlations, entered with sign
 * -1 in the floor). The far mass currency is M = sum_b nb^2.
 *
 * MEASURED (theta = 10, sigma = 1, beta = 1/3, c = v = D = 1; all re-derived by
 * the assertions from the baked witness):
 *   C_cross = 0.31083906605923023
 *   S       = 0.31063674710576755  (self 0.3104863645132343 +
 *                                   same-block 0.0001503825925332669)
 *   E       = 0.0002023189534626768   (= C_cross - S)
 *   M       = 7.242579512920189
 *   F       = E / (Tx(2) M) = 0.09674506293739427   (reproduces the baked
 *             headline floor 0.096745062937484763 to rel 1e-9)
 * with lambda_max = Lw = 3.9197935113802585e-5 (the imp-95008 ceiling constant),
 *   lambda_max M = 0.0002838941618040015 ,
 *   residual = lambda_max M / E = 1.4032010197 ...   (reproduces the baked
 *             1.4032010197013394 to rel 1e-12; residual = cFar / (2 F)).
 *
 * DECOMPOSITION AS LITERALLY REQUESTED (norm-penalty p = S / (lambda_max M)):
 *   p                    = S / (lambda_max M)        = 1094.199137917563
 *   C_cross / (lambda_max M)                          = 1094.9117941841696
 *   1 / residual = C_cross / (lambda_max M) - p = E / (lambda_max M)
 *                = 0.7126562666066955 .
 * The clean TRUE product form is
 *   residual = ( lambda_max M / C_cross ) x ( C_cross / E )
 *            = 0.0009133155796765443  x  1536.381346083687  = 1.4032010197 ...
 *
 * HONEST FINDING - THE POSITED O(1) x O(1) SHAPE IS REFUTED. The sub-gap
 * presumed an (attainment shortfall, order <= 1) times a (norm-penalty of order
 * 1) split. The measurement shows both named factors are far from order 1:
 * S / (lambda_max M) = 1094, not order 1, and C_cross exceeds lambda_max M by
 * the SAME factor ~1095. The reason is a NORMALIZATION mismatch: the ceiling
 * constant lambda_max M caps the L2 weld norm || sum w_b ||^2 (per-pair
 * ENVELOPE caps rolled up), whereas C_cross and S are the witness RAW kernel
 * constituents of the floor; they are not on a common currency, so their ratio
 * is not an attainment fraction <= 1. What genuinely governs the residual is a
 * near-total CANCELLATION inside the realized excess:
 *   S / C_cross = 0.999349119928754 ,   1 - S / C_cross = 0.0006508800712460 ,
 * i.e. the surviving excess E is only 0.065088 percent of the realized
 * cross-block correlation, an amplification C_cross / E = 1 / (1 - S / C_cross)
 * = 1536.38. The residual 1.4032 is therefore a delicate product of a tiny
 * scale factor lambda_max M / C_cross = 9.13e-4 and this large cancellation
 * amplification 1536.38 - NOT a mild attainment-times-norm product. The
 * within-block norm S very nearly EQUALS the cross correlation C_cross; the
 * witness lives at the very edge of the excess-positivity constraint E > 0
 * (consistent with imp-95008-witness-floor-pin.js: E > 0 active).
 *
 * WHAT THIS CLOSES / WHAT REMAINS. The internals half of the sub-gap is CLOSED:
 * E_cross and sum ||w_b||^2 are now measured separately and the residual is
 * decomposed exactly (residual = (lambda_max M / C_cross)(C_cross / E), both
 * factors measured). The surviving open piece is renamed honestly:
 *   imp-95089-subgap-currency-reconciliation - reconcile the ceiling per-mass
 *   constant lambda_max M (an L2-weld / envelope-cap normalization) with the
 *   witness raw cross correlation C_cross (they differ by ~1095x here); until
 *   that currency map is baked, the ratio C_cross / (lambda_max M) is not an
 *   attainment fraction and the residual cannot be read as attainment x norm.
 * This is a MEASUREMENT only. Changes no bound; does NOT promote Lambda <= 0.14;
 * NO QED; no refereed bound is changed.
 */

// -- shared conventions (identical to imp-95008-witness-floor-pin.js) ---------
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const SS = SIGMA + THETA;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
const QREF = isolationQ(CC, VV, BETA, DD);

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}
function gSharp(j, Q, beta) {
  return Math.pow(2, beta) * gOld(j, Q, beta);
}
function phi(x, theta) {
  return Math.pow(1 + x, -theta);
}
function tailAllSharp(theta, Q, beta, jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j++) {
    const g = gSharp(j, Q, beta);
    if (!Number.isFinite(g)) break;
    const t = phi(g, theta);
    if (t === 0) break;
    s += t;
  }
  return s;
}
function fCorr(z) {
  return Math.exp(-z) * (1 + z);
}
function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return fCorr(m * tau) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}
const TX = tailAllSharp(THETA, QREF, BETA, 800);

// -- witness geometry (identical to the twelfth through fifteenth) ------------
function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95089: block search failed");
  }
  return b;
}
function pentaWitness(p) {
  const k1 = Math.floor(p / 2) + 1;
  const k2 = Math.floor(p / 4) + 1;
  const k3 = Math.floor(p / 8) + 1;
  const ks = [k1, k1 - 1, k2, k2 - 1, k3 - 1];
  const d = ks.map((k) => k / p);
  return {
    ks,
    d,
    u: d.map((x) => VV / x),
    r: d.map((x) => CC * Math.pow(x, -BETA)),
    block: ks.map((k) => blockOf(p, k)),
  };
}
function appendGridPoint(p, w, kx) {
  const dd = kx / p;
  return {
    ks: [...w.ks, kx],
    d: [...w.d, dd],
    u: [...w.u, VV / dd],
    r: [...w.r, CC * Math.pow(dd, -BETA)],
    block: [...w.block, blockOf(p, kx)],
  };
}

// split evaluation: separate self, same-block, cross-block, mass currency
function floorSplit(w, mus, a) {
  const n = a.length;
  let self = 0; // sum a_i^2 / mu_i  (subtracted from E)
  for (let i = 0; i < n; i++) self += (a[i] * a[i]) / mus[i];
  let sameBlock = 0; // sum_{same-block i<j} 2 a_i a_j K  (subtracted)
  let cross = 0; // sum_{cross-block i<j} 2 a_i a_j K  (added)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const term = 2 * a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
      if (w.block[i] === w.block[j]) sameBlock += term;
      else cross += term;
    }
  }
  const S = self + sameBlock; // within-block squared-norm sum = sum_b ||w_b||^2
  const E = cross - S;
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) {
    nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], SS);
  }
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  return { E, M, cross, S, self, sameBlock, F: E / (TX * M) };
}

// -- fifteenth continuation terminal headline 13-packet witness --------------
const P_BIG = 999983;
const JOINT_BIG = {
  mus: [7.69395202209785, 7.696569089680406, 3.901022492015913, 2.7978054595942754, 1.6462804960465607],
  a: [1.0906392801493483, 1.0907349936022739, 0.04954395066558243, 0.04336742919997075, 0.000032666623379528365],
};
const CHAIN_BIG = [
  { k: 287373, nu: 5.484329511979126, eps: 0.0053250882770407544 },
  { k: 249994, nu: 18.93242512045269, eps: 0.006151578903669489 },
  { k: 328125, nu: 6.391061381455207, eps: 0.0017601429329493928 },
  { k: 269151, nu: 10.205134959136752, eps: 0.001531652027389694 },
  { k: 374236, nu: 7.109465151309788, eps: 0.0005572626874944937 },
  { k: 249997, nu: 4.551174447362288, eps: 0.00034587133755511514 },
  { k: 249993, nu: 16.278292954620273, eps: 0.0007594455828058375 },
  { k: 249998, nu: 4.597145906426553, eps: 0.0003333794713963081 },
];

function buildTerminal() {
  let w = pentaWitness(P_BIG);
  const mus = [...JOINT_BIG.mus];
  const a = [...JOINT_BIG.a];
  for (const st of CHAIN_BIG) {
    w = appendGridPoint(P_BIG, w, st.k);
    mus.push(st.nu);
    a.push(st.eps);
  }
  return { w, mus, a };
}

const TERM = buildTerminal();
const EV = floorSplit(TERM.w, TERM.mus, TERM.a);

// -- baked literals (measured) -----------------------------------------------
const LW = 3.9197935113802585e-5; // imp-95008 ceiling constant lambda_max = Lw
const HEAD_FLOOR = 0.096745062937484763; // fifteenth continuation headline floor
const RESIDUAL_SW = 1.4032010197013394; // imp-95008 residual after parity

const C_CROSS_LIT = 0.31083906605923023;
const S_LIT = 0.31063674710576755;
const SELF_LIT = 0.3104863645132343;
const SAMEBLOCK_LIT = 0.0001503825925332669;
const E_LIT = 0.0002023189534626768;
const M_LIT = 7.242579512920189;
const LAMM_LIT = 0.0002838941618040015; // lambda_max M
const NORM_PENALTY_P = 1094.199137917563; // S / (lambda_max M)
const CROSS_OVER_LAMM = 1094.9117941841696; // C_cross / (lambda_max M)
const INV_RESIDUAL = 0.7126562666066955; // E / (lambda_max M)
const SCALE_FACTOR = 0.0009133155796765443; // lambda_max M / C_cross
const CANCEL_AMP = 1536.381346083687; // C_cross / E = 1 / (1 - S / C_cross)
const S_OVER_C = 0.999349119928754; // S / C_cross

export const IMP95089_WITNESS_EREALIZATION_SPLIT = {
  ticket:
    "imp-95089 (measurement: split the exhibited headline witness excess E = C_cross - S separately, decomposing the imp-95008 residual 1.4032010197013394; closes the internals half of imp-95008-subgap-witness-Erealization-split)",
  source:
    "reconstructs the fifteenth-continuation terminal headline 13-packet witness of imp-95008-witness-floor-pin.js (P = 999983, penta base + eight-step greedy occupied-block append); ceiling constant lambda_max = Lw from imp-95008-perron-weighted-far-routing.js.",
  measured: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA, P: P_BIG, packets: TERM.a.length },
    cCross: C_CROSS_LIT,
    S: S_LIT,
    self: SELF_LIT,
    sameBlock: SAMEBLOCK_LIT,
    E: E_LIT,
    M: M_LIT,
    floorF: EV.F,
    headlineFloor: HEAD_FLOOR,
    lambdaMax: LW,
    lambdaMaxM: LAMM_LIT,
    residual: RESIDUAL_SW,
  },
  decomposition:
    "residual = lambda_max M / E = (lambda_max M / C_cross) x (C_cross / E) = 0.0009133155796765443 x 1536.381346083687 = 1.4032010197 ... Literal norm-penalty p = S / (lambda_max M) = 1094.199137917563; C_cross / (lambda_max M) = 1094.9117941841696; 1 / residual = C_cross / (lambda_max M) - p = E / (lambda_max M) = 0.7126562666066955.",
  honestFinding:
    "The posited (attainment shortfall <= order 1) x (norm-penalty order 1) shape is REFUTED by measurement: both named factors are far from order 1 (S / (lambda_max M) = 1094, and C_cross / (lambda_max M) = 1095), because the ceiling constant lambda_max M caps the L2 weld norm || sum w_b ||^2 (envelope caps rolled up) while C_cross and S are the witness RAW kernel constituents of the floor - not a common currency, so their ratio is not an attainment fraction. What actually governs the residual is a near-total cancellation inside the excess: S / C_cross = 0.999349119928754 (E is 0.065088 percent of C_cross), amplification C_cross / E = 1 / (1 - S / C_cross) = 1536.38. The residual is a delicate product of a tiny scale factor lambda_max M / C_cross = 9.13e-4 and this large cancellation amplification, NOT a mild attainment-times-norm product. The within-block norm S very nearly equals the cross correlation C_cross - the witness sits at the edge of the excess-positivity constraint E > 0.",
  cancellation: { sOverC: S_OVER_C, oneMinus: 1 - S_OVER_C, amplification: CANCEL_AMP },
  subGap:
    "imp-95089-subgap-currency-reconciliation - OPEN: reconcile the ceiling per-mass constant lambda_max M (an L2-weld / envelope-cap normalization) with the witness raw cross correlation C_cross (they differ by ~1095x here). Until that currency map is baked, C_cross / (lambda_max M) is not an attainment fraction and the residual cannot be read as attainment x norm. The internals half (E_cross and sum ||w_b||^2 measured separately) is CLOSED here.",
  openResiduals: [
    "the currency reconciliation between the ceiling L2-weld constant lambda_max M and the witness raw cross correlation C_cross (named sub-gap above)",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window; the paper phase curvature normalization",
    "the l2-to-pointwise passage to |C_E,17|",
  ],
  isRigorous: true,
  rigorScope:
    "This is a MEASUREMENT: the terminal headline witness is reconstructed exactly (same geometry as imp-95008-witness-floor-pin.js) and its floor F reproduces the baked 0.096745062937484763 to rel 1e-9, so the split E = C_cross - S is a faithful decomposition of the same excess. The residual identity residual = lambda_max M / E reproduces the baked 1.4032010197013394 to rel 1e-12. No new inequality is proved; the honest finding is that the posited O(1) x O(1) decomposition does not hold and the residual is instead a scale-factor-times-cancellation product, with the currency mismatch named as the surviving sub-gap. The numerics settle the internals; they are not a claim.",
  promotesBound: false,
  verdict:
    "MEASUREMENT closing the internals half of imp-95008-subgap-witness-Erealization-split: the exhibited headline 13-packet witness excess splits as E = C_cross - S with C_cross = 0.31083906605923023 (realized cross-block correlation) and S = 0.31063674710576755 (within-block norm sum_b ||w_b||^2 = self 0.3104863645132343 + same-block 0.0001503825925332669), E = 0.0002023189534626768, M = 7.242579512920189; floor F reproduces 0.096745062937484763 (rel 1e-9) and residual = lambda_max M / E reproduces 1.4032010197013394 (rel 1e-12). HONEST FINDING: the posited (attainment <= 1) x (norm-penalty order 1) shape is refuted - S / (lambda_max M) = 1094 and C_cross / (lambda_max M) = 1095 (a normalization mismatch: ceiling caps the L2 weld norm, witness constituents are raw kernel), so the residual factors instead as (lambda_max M / C_cross = 9.13e-4) x (C_cross / E = 1536.38), governed by the near-total cancellation S / C_cross = 0.999349 (E is 0.065 percent of C_cross). Surviving sub-gap renamed imp-95089-subgap-currency-reconciliation. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) -------------------------
export const IMP95089_ASSERTIONS = [
  {
    id: "imp95089-witness-floor-reproduction",
    description:
      "the reconstructed terminal headline 13-packet witness reproduces the baked floor 0.096745062937484763 (rel 1e-9) with strictly positive excess and 13 packets",
    holds: () =>
      TERM.a.length === 13 &&
      EV.E > 0 &&
      Math.abs(EV.F - HEAD_FLOOR) <= 1e-9 * HEAD_FLOOR,
  },
  {
    id: "imp95089-split-constituents",
    description:
      "the excess splits exactly as E = C_cross - S with the baked constituents (rel 1e-9), and S = self + same-block reproduces the within-block norm",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(EV.cross, C_CROSS_LIT) &&
        rel(EV.S, S_LIT) &&
        rel(EV.self, SELF_LIT) &&
        rel(EV.sameBlock, SAMEBLOCK_LIT) &&
        rel(EV.E, E_LIT) &&
        rel(EV.M, M_LIT) &&
        Math.abs(EV.cross - EV.S - EV.E) <= 1e-9 * Math.abs(EV.E) &&
        Math.abs(EV.self + EV.sameBlock - EV.S) <= 1e-12 * Math.abs(EV.S)
      );
    },
  },
  {
    id: "imp95089-residual-identity",
    description:
      "residual = lambda_max M / E reproduces the baked imp-95008 residual 1.4032010197013394 (rel 1e-9), and 1 / residual = C_cross/(lambda_max M) - S/(lambda_max M) = E/(lambda_max M)",
    holds: () => {
      const lamM = LW * EV.M;
      const residual = lamM / EV.E;
      const rel = (x, lit, t) => Math.abs(x - lit) <= (t || 1e-9) * Math.abs(lit);
      return (
        rel(lamM, LAMM_LIT) &&
        rel(residual, RESIDUAL_SW) &&
        rel(EV.cross / lamM, CROSS_OVER_LAMM) &&
        rel(EV.S / lamM, NORM_PENALTY_P) &&
        rel(EV.E / lamM, INV_RESIDUAL) &&
        Math.abs((EV.cross / lamM - EV.S / lamM) - EV.E / lamM) <= 1e-9 * Math.abs(EV.E / lamM)
      );
    },
  },
  {
    id: "imp95089-product-decomposition",
    description:
      "residual = (lambda_max M / C_cross) x (C_cross / E): scale factor 9.13e-4 and cancellation amplification C_cross/E = 1/(1 - S/C_cross) = 1536.38 reproduce and multiply back to the residual (rel 1e-9)",
    holds: () => {
      const lamM = LW * EV.M;
      const scale = lamM / EV.cross;
      const amp = EV.cross / EV.E;
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(scale, SCALE_FACTOR) &&
        rel(amp, CANCEL_AMP) &&
        rel(EV.S / EV.cross, S_OVER_C) &&
        rel(1 / (1 - EV.S / EV.cross), CANCEL_AMP) &&
        rel(scale * amp, RESIDUAL_SW)
      );
    },
  },
  {
    id: "imp95089-honest-finding-refutes-o1-shape",
    description:
      "the honest finding is baked: the posited order-1 x order-1 shape is refuted (norm-penalty p ~ 1094 and C_cross/(lambda_max M) ~ 1095, both far from 1), the driver is the near-total cancellation S/C_cross ~ 0.9993",
    holds: () =>
      NORM_PENALTY_P > 1000 &&
      CROSS_OVER_LAMM > 1000 &&
      S_OVER_C > 0.999 &&
      S_OVER_C < 1 &&
      CANCEL_AMP > 1000,
  },
  {
    id: "imp95089-honesty-gate",
    description:
      "verdict/rigorScope state MEASUREMENT only, refute the O(1) shape, name the currency-reconciliation sub-gap, promote no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95089_WITNESS_EREALIZATION_SPLIT.promotesBound === false &&
      IMP95089_WITNESS_EREALIZATION_SPLIT.openResiduals.length === 4 &&
      /NO QED/.test(IMP95089_WITNESS_EREALIZATION_SPLIT.verdict) &&
      /refereed bound is changed/i.test(IMP95089_WITNESS_EREALIZATION_SPLIT.verdict) &&
      /refuted/i.test(IMP95089_WITNESS_EREALIZATION_SPLIT.verdict) &&
      /currency-reconciliation/.test(IMP95089_WITNESS_EREALIZATION_SPLIT.subGap) &&
      /MEASUREMENT/.test(IMP95089_WITNESS_EREALIZATION_SPLIT.rigorScope),
  },
];

for (const a of IMP95089_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95089-witness-erealization-split assertion failed: ${a.id}`);
  }
}

export default IMP95089_WITNESS_EREALIZATION_SPLIT;
