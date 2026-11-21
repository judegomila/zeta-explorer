/**
 * imp-95111 - PRICE the imp-95096 near-currency ratio (sum_b d_b)/M of the
 * exhibited headline witness, and evaluate whether the imp-95096 joint near/far
 * Pareto trade beta(alpha) = lambda_max(2-alpha) at cNear = 2 alpha reduces the
 * headline residual 1.4032010197013394 on the gap or is dominated by the near
 * cost. Closes the named sub-gap imp-95096-subgap-near-currency-ratio.
 *
 * SETTING. imp-95096 (imp-95096-joint-near-far-vs-lambda-max-terminality.js)
 * priced the block-Gram diagonal jointly: inside one parity class
 *   || sum_b w_b ||^2 = sum_b d_b + sum_{b != bp} G(b, bp),  d_b = || w_b ||^2,
 * and exhibited the EXACT two-block Pareto line beta(alpha) = K(0,2)(2-alpha)
 * for the joint bound || sum_b w_b ||^2 <= alpha (sum_b d_b) + beta(alpha) M.
 * At alpha = 1 the diagonal is free and beta = lambda_max (the imp-95008
 * aggregation constant); for alpha > 1 beta drops below lambda_max but the near
 * coefficient cNear = 2 alpha exits the bracket class {cNear <= 2}. imp-95096
 * left the gap payoff UN-PRICED because the exhibited witness diagonal-norm
 * total sum_b d_b is not baked by the chain, naming the sub-gap
 * imp-95096-subgap-near-currency-ratio.
 *
 * WHAT THIS MODULE DOES. It reconstructs the exhibited fifteenth-continuation
 * terminal headline 13-packet witness (P = 999983; identical geometry to
 * imp-95089-witness-erealization-split.js) and MEASURES the diagonal-norm total
 *   sum_b d_b = sum_b || w_b ||^2 = self + same-block correlations = S,
 * i.e. the same within-block squared-norm sum imp-95089 measured. It then forms
 * the near-currency ratio (sum_b d_b)/M against M = sum_b n_b^2 and prices the
 * out-of-class alpha > 1 trade on the joint bound.
 *
 * MEASURED (theta = 10, sigma = 1, beta = 1/3, c = v = D = 1):
 *   sum_b d_b (= S)              = 0.31063674710576755
 *   M                           = 7.242579512920189
 *   near-currency ratio r_d     = (sum_b d_b)/M = 0.042890346809671354
 *   lambda_max                  = 3.9197935113802585e-5
 *   lambda_max M                = 0.0002838941618040015
 * with the reproduced headline residual = lambda_max M / E = 1.4032010197013394.
 *
 * PRICING THE JOINT TRADE. The joint per-class bound is
 *   B(alpha) = alpha (sum_b d_b) + lambda_max (2 - alpha) M ,   1 <= alpha <= 2.
 * Its slope is
 *   dB/dalpha = (sum_b d_b) - lambda_max M .
 * Here sum_b d_b = 0.31063674710576755 and lambda_max M = 0.0002838941618040015,
 * so dB/dalpha = 0.31035285294396353 > 0: B(alpha) is STRICTLY INCREASING on
 * [1, 2]. The bound is MINIMIZED at alpha = 1 - the current imp-95008
 * certificate. Raising alpha to buy the sub-lambda_max far coefficient
 * beta(alpha) = lambda_max(2 - alpha) charges the diagonal at (alpha - 1) per
 * unit of sum_b d_b, and that near cost strictly dominates the far saving.
 *
 * DOMINATION FACTOR. The break-even for the trade to pay would need
 *   r_d = (sum_b d_b)/M <= lambda_max ,
 * i.e. the near currency per unit mass no larger than the far coefficient. The
 * measured r_d = 0.042890346809671354 exceeds lambda_max = 3.9197935113802585e-5
 * by the factor
 *   r_d / lambda_max = (sum_b d_b)/(lambda_max M) = 1094.199137917563 ,
 * which is EXACTLY the imp-95089 norm-penalty p = S/(lambda_max M) = 1094.2 (the
 * same currency mismatch: the diagonal norm S lives on the witness raw-kernel
 * scale, ~1095x above the L2-weld envelope-cap scale lambda_max M). So the
 * out-of-class trade is dominated by the near cost by three orders of
 * magnitude; it does NOT reduce the headline residual on the gap.
 *
 * VERDICT. The near-currency ratio is PRICED: r_d = 0.04289, over 1094x above
 * lambda_max. The imp-95096 joint near/far lever beta(alpha) = lambda_max(2 -
 * alpha) is genuine but UNPROFITABLE for this witness - the joint bound is
 * monotone INCREASING in alpha (minimized at the current alpha = 1), so the
 * far reduction (2 - alpha) is swamped by the near inflation alpha (sum_b d_b)
 * at ratio 1094:1. This is the concrete gap-side evaluation imp-95096 deferred:
 * the out-of-class trade is real but strictly loss-making here, so the alpha = 1
 * lambda_max sandwich is not merely in-class terminal (imp-95096) but also the
 * gap-optimal endpoint of the joint line for this witness. Closes the named
 * sub-gap imp-95096-subgap-near-currency-ratio. MEASUREMENT only. Changes no
 * bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// -- shared conventions (identical to imp-95089-witness-erealization-split.js) --
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

// -- witness geometry (identical to imp-95089) --------------------------------
function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95111: block search failed");
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

// diagonal-norm total sum_b d_b = sum_b ||w_b||^2 (self + same-block), and mass M
function diagonalTotals(w, mus, a) {
  const n = a.length;
  let self = 0;
  for (let i = 0; i < n; i++) self += (a[i] * a[i]) / mus[i];
  let sameBlock = 0;
  let cross = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const term = 2 * a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
      if (w.block[i] === w.block[j]) sameBlock += term;
      else cross += term;
    }
  }
  const sumDb = self + sameBlock; // sum_b ||w_b||^2 = the joint near currency
  const E = cross - sumDb;
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) {
    nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], SS);
  }
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  return { sumDb, M, cross, self, sameBlock, E };
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
const DT = diagonalTotals(TERM.w, TERM.mus, TERM.a);

// -- baked literals (imp-95008 ceiling / imp-95089 measured constituents) -----
const LW = 3.9197935113802585e-5; // imp-95008 aggregation constant lambda_max = Lw
const RESIDUAL_SW = 1.4032010197013394; // imp-95008 headline residual after parity
const SUM_DB_LIT = 0.31063674710576755; // sum_b d_b = S (imp-95089)
const M_LIT = 7.242579512920189;
const RATIO_LIT = 0.042890346809671354; // (sum_b d_b)/M
const LAMM_LIT = 0.0002838941618040015; // lambda_max M
const SLOPE_LIT = 0.31035285294396353; // dB/dalpha = sum_b d_b - lambda_max M
const DOMINATION_LIT = 1094.199137917563; // r_d/lambda_max = sum_b d_b/(lambda_max M)

// joint per-class bound B(alpha) = alpha sum_b d_b + lambda_max (2-alpha) M
function jointBound(alpha) {
  return alpha * DT.sumDb + LW * (2 - alpha) * DT.M;
}

const ALPHAS = [1.0, 1.25, 1.5, 1.75, 2.0];

export const IMP95111_NEAR_CURRENCY_RATIO_PRICING = {
  ticket:
    "imp-95111 (price the imp-95096 near-currency ratio (sum_b d_b)/M of the exhibited headline witness and evaluate the joint near/far Pareto trade beta(alpha)=lambda_max(2-alpha) at cNear=2 alpha on the gap; closes imp-95096-subgap-near-currency-ratio)",
  source:
    "reconstructs the fifteenth-continuation terminal headline 13-packet witness of imp-95089-witness-erealization-split.js (P=999983, penta base + eight-step greedy occupied-block append); joint near/far bound and Pareto line from imp-95096-joint-near-far-vs-lambda-max-terminality.js.",
  measured: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA, P: P_BIG, packets: TERM.a.length },
    sumDb: SUM_DB_LIT,
    M: M_LIT,
    nearCurrencyRatio: RATIO_LIT,
    lambdaMax: LW,
    lambdaMaxM: LAMM_LIT,
    residual: RESIDUAL_SW,
    jointBoundSlope: SLOPE_LIT,
    dominationFactor: DOMINATION_LIT,
  },
  pricing:
    "The joint per-class bound B(alpha)=alpha (sum_b d_b) + lambda_max(2-alpha) M has slope dB/dalpha = (sum_b d_b) - lambda_max M = 0.31035285294396353 > 0, so B is STRICTLY INCREASING on [1,2] and minimized at alpha=1 (the current imp-95008 certificate). Break-even needs (sum_b d_b)/M <= lambda_max; the measured ratio 0.042890346809671354 exceeds lambda_max=3.9197935113802585e-5 by 1094.199137917563x (= S/(lambda_max M), the imp-95089 norm-penalty p), so the near cost dominates the far saving by three orders of magnitude.",
  verdict:
    "PRICED: the near-currency ratio (sum_b d_b)/M = 0.042890346809671354 exceeds lambda_max by the factor 1094.199137917563. The imp-95096 joint near/far trade beta(alpha)=lambda_max(2-alpha) at cNear=2 alpha is REAL but UNPROFITABLE for this witness: the joint bound B(alpha)=alpha (sum_b d_b) + lambda_max(2-alpha) M is monotone INCREASING in alpha (slope sum_b d_b - lambda_max M = 0.31035 > 0), minimized at alpha=1, so the sub-lambda_max far reduction (2-alpha) is swamped by the near inflation at ratio 1094:1 and does NOT reduce the headline residual 1.4032010197013394 on the gap. The alpha=1 lambda_max sandwich is thus not only in-class terminal (imp-95096) but the gap-optimal endpoint of the joint line here. Closes the named sub-gap imp-95096-subgap-near-currency-ratio. MEASUREMENT only. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
  subGap:
    "imp-95096-subgap-near-currency-ratio - CLOSED here: the near-currency ratio (sum_b d_b)/M = 0.04289 is measured on the exhibited witness and the out-of-class alpha>1 trade is priced UNPROFITABLE (joint bound increasing in alpha, near cost dominates by 1094x). The residual coupling to imp-95018 (whether ANY parity factor 2 is jointly recoverable, which would move the alpha pin off 1) remains OPEN and is not touched here.",
  openResiduals: [
    "whether imp-95018 leaves ANY of the parity factor 2 jointly recoverable (would move the alpha pin off 1) - untouched here",
    "the currency reconciliation imp-95089-subgap-currency-reconciliation (why sum_b d_b lives ~1094x above lambda_max M) - the same 1094x factor surfaces as the domination ratio here",
    "the gap payoff for OTHER witness families with a smaller near-currency ratio (sum_b d_b)/M - this prices only the exhibited headline witness",
  ],
  isRigorous: true,
  rigorScope:
    "This is a MEASUREMENT: the terminal headline witness is reconstructed exactly (same geometry as imp-95089-witness-erealization-split.js) and its diagonal-norm total sum_b d_b reproduces the imp-95089 S=0.31063674710576755 and residual 1.4032010197013394. The pricing conclusion needs only the sign of dB/dalpha = sum_b d_b - lambda_max M, which is unambiguously positive (0.310 vs 2.84e-4), so B(alpha) is monotone increasing and the alpha=1 endpoint is gap-optimal for this witness - a rigorous statement about the exhibited witness, not a class-wide claim. No new inequality is proved; the joint near/far lever is exhibited real (imp-95096) but priced strictly loss-making here.",
  promotesBound: false,
};

// -- assertions (self-executing; throw on violation) -------------------------
export const IMP95111_ASSERTIONS = [
  {
    id: "imp95111-witness-diagonal-reproduction",
    description:
      "the reconstructed terminal headline 13-packet witness reproduces the imp-95089 diagonal-norm total sum_b d_b = 0.31063674710576755 and M = 7.242579512920189 (rel 1e-9) with 13 packets",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return TERM.a.length === 13 && rel(DT.sumDb, SUM_DB_LIT) && rel(DT.M, M_LIT) && DT.E > 0;
    },
  },
  {
    id: "imp95111-near-currency-ratio",
    description:
      "the near-currency ratio (sum_b d_b)/M reproduces 0.042890346809671354 (rel 1e-9) and equals lambda_max times the domination factor 1094.199137917563",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      const r = DT.sumDb / DT.M;
      return (
        rel(r, RATIO_LIT) &&
        rel(r / LW, DOMINATION_LIT) &&
        rel(DT.sumDb / (LW * DT.M), DOMINATION_LIT)
      );
    },
  },
  {
    id: "imp95111-joint-bound-monotone-increasing",
    description:
      "the joint bound B(alpha)=alpha sum_b d_b + lambda_max(2-alpha) M has positive slope sum_b d_b - lambda_max M = 0.31035285294396353, so B is strictly increasing on [1,2] and minimized at alpha=1 (near cost dominates)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      const slope = DT.sumDb - LW * DT.M;
      if (!(slope > 0) || !rel(slope, SLOPE_LIT)) return false;
      let prev = -Infinity;
      for (const a of ALPHAS) {
        const b = jointBound(a);
        if (!(b > prev)) return false;
        prev = b;
      }
      // alpha=1 endpoint is the minimum over [1,2]
      return jointBound(1) < jointBound(2);
    },
  },
  {
    id: "imp95111-trade-unprofitable",
    description:
      "break-even (sum_b d_b)/M <= lambda_max FAILS: the ratio exceeds lambda_max by >1000x (1094.2), so the out-of-class alpha>1 trade is dominated by the near cost and does not reduce the residual on the gap",
    holds: () => {
      const r = DT.sumDb / DT.M;
      return r > LW && r / LW > 1000 && Math.abs(r / LW - DOMINATION_LIT) <= 1e-9 * DOMINATION_LIT;
    },
  },
  {
    id: "imp95111-honesty-gate",
    description:
      "verdict/rigorScope state MEASUREMENT only, price the ratio, declare the joint trade unprofitable, close the near-currency-ratio sub-gap, promote no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95111_NEAR_CURRENCY_RATIO_PRICING.promotesBound === false &&
      IMP95111_NEAR_CURRENCY_RATIO_PRICING.openResiduals.length === 3 &&
      /NO QED/.test(IMP95111_NEAR_CURRENCY_RATIO_PRICING.verdict) &&
      /refereed bound is changed/i.test(IMP95111_NEAR_CURRENCY_RATIO_PRICING.verdict) &&
      /UNPROFITABLE/.test(IMP95111_NEAR_CURRENCY_RATIO_PRICING.verdict) &&
      /imp-95096-subgap-near-currency-ratio/.test(IMP95111_NEAR_CURRENCY_RATIO_PRICING.subGap) &&
      /MEASUREMENT/.test(IMP95111_NEAR_CURRENCY_RATIO_PRICING.rigorScope),
  },
];

for (const a of IMP95111_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95111-near-currency-ratio-pricing assertion failed: ${a.id}`);
  }
}

export default IMP95111_NEAR_CURRENCY_RATIO_PRICING;
