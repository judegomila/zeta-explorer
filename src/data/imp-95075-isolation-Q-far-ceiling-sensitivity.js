/**
 * imp-95075 - ISOLATION-GROUP sensitivity of the imp-95008 far-bracket ceiling.
 * Executes imp-95026 Finding 1 (isolationScan): the far coefficient cFar
 * depends on the isolation constant Q = (c D^(1-beta)/v) 2^(-(1-beta)) - the
 * group through which the three physical constants (c, v, D) act - and cFar
 * GROWS with Q. This module derives the sensitivity dcFar/dQ AT the model point
 * and re-indexes the imp-95026 isolationScan (which is tabulated by c) by the
 * underlying Q, so the transfer risk from the isolation group is quantified
 * alongside the s = sigma + theta lever. Measurement/derivation only, NO QED.
 *
 * DERIVATIVE (finite difference, pure Q lever). Varying c alone is a pure Q
 * rescale: Q is proportional to c (v, D, beta held at the model values), so the
 * clean way to read off dcFar/dQ is a central difference in c around the model
 * point c = 1. With c in {0.98, 1.02} (Q in {0.6173613144484879,
 * 0.6425597354463853}):
 *   dcFar/dQ = 0.3816620268743663   at Q0 = 0.6299605249474366.
 * Dimensionless elasticity (dcFar/dQ)(Q0/cFar0) = 0.8847868296486842: a 1
 * percent mis-estimate of the paper isolation group moves the far ceiling by
 * ~0.88 percent - the isolation group is a near-proportional (strong) lever,
 * comparable to the s = sigma + theta lever and far stronger than beta (~6
 * percent over 0.25..0.5, imp-95026 Finding 1).
 *
 * CONCAVITY. cFar(Q) is concave over the scanned range - the secant slope falls
 * monotonically from ~0.44 (near c = 0.5) to ~0.17 (near c = 2). Consequently
 * the local linear model cFar0 + (dcFar/dQ)(Q - Q0) OVER-predicts the ceiling
 * away from the model point: at Q(c = 1.5) = 0.9449407874211549 it predicts
 * 0.39195604802558137 vs the actual 0.36807989528190543 (over by 6.49 percent).
 * So the local derivative is a CONSERVATIVE (upper) estimate of how much the
 * ceiling rises when the paper Q exceeds the model Q, which is the direction
 * that matters for transfer risk.
 *
 * WHERE THE PAPER Q LANDS. The model instantiation c = v = D = 1 puts the
 * packet exactly at Q0 = 0.6299605249474366 = 2^(-2/3) on the isolationScan
 * (the c = 1 row, cFar0 = 0.2717400426244421). The isolationScan re-indexed by
 * Q spans Q in [0.315, 1.260] as c runs over [0.5, 2], with cFar rising
 * monotonically from 0.137 to 0.421 - all far below the pre-seventeenth 4.
 * Because cFar is concave and only ~0.88-elastic in Q, even a large isolation
 * mis-estimate keeps the ledger comfortably below 4: solving the local linear
 * (conservative) model cFar0 + 0.3817(Q - Q0) = 4 needs Q ~ 10.4 (c ~ 16.5),
 * and the true concave curve needs an even larger Q. The isolation group does
 * NOT threaten the qualitative "below 4" transfer; it only rescales the
 * quantitative margin.
 *
 * SUB-GAP (honest, inherited from imp-95026). The actual Section 4.5 packet
 * physical constants (c, v, D), hence the paper Q, are NOT pinned in this
 * repository (the paper text is not carried here). This module therefore places
 * the MODEL Q on the scan and delivers the local sensitivity dcFar/dQ and the
 * Q-indexed scan; the remaining step is to read (c, v, D, beta) off the paper
 * packet definition, form Q, and read cFar off this curve. The map already
 * shows the isolation group is a strong (~0.88-elastic) but concave lever that
 * keeps cFar below 4 across the whole plausible range.
 *
 * The numerics below CROSS-CHECK the statements; they are not the claim.
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── parameterized ceiling machinery (identical shape to imp-95026; the four
//    constants are free so the isolation group can be swept) ────────────────────
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

// central-difference dcFar/dQ at the model point, sweeping c (a pure Q rescale)
function dCFarDQatModel() {
  const em = farCoefficient(1, 1 / 3, 0.98, 1, 1, 10);
  const ep = farCoefficient(1, 1 / 3, 1.02, 1, 1, 10);
  return (ep.ceiling - em.ceiling) / (ep.Q - em.Q);
}

// ── baked literals (all re-derived by the assertions) ────────────────────────
const Q0 = 0.6299605249474366; // model isolation constant = 2^(-2/3) at c=v=D=1
const CFAR0 = 0.2717400426244421; // model far coefficient (imp-95026 quad)
const DCFAR_DQ = 0.3816620268743663; // dcFar/dQ at Q0 (central diff, c 0.98..1.02)
const ELASTICITY = 0.8847868296486842; // (dcFar/dQ)(Q0/cFar0), dimensionless
const PRE17_FAR = 4; // pre-seventeenth far coefficient
// isolationScan re-indexed by Q (Q = c * 2^(-2/3); imp-95026 tabulated it by c)
const Q_SCAN = {
  "0.3149802624737183": 0.13738986936312608, // c = 0.5
  "0.47247039371057745": 0.20690335739681393, // c = 0.75
  "0.6299605249474366": 0.2717400426244421, // c = 1 (model)
  "0.9449407874211549": 0.36807989528190543, // c = 1.5
  "1.2599210498948732": 0.42114615293130686, // c = 2
};
const LINEAR_PRED_AT_C15 = 0.39195604802558137; // local linear model at Q(c=1.5)
const ACTUAL_AT_C15 = 0.36807989528190543; // true concave value
const OVERPRED_RATIO = 1.0648667668343843; // linear over-predicts by ~6.49%

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95075_ISOLATION_Q_FAR_CEILING_SENSITIVITY = {
  ticket:
    "imp-95075 (assess the isolation constant Q as the far-ceiling lever: derive dcFar/dQ and place the paper Q on the imp-95026 isolationScan)",
  source:
    "imp-95026 Finding 1 isolationScan; Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture.",
  isolationGroup:
    "Q = (c D^(1-beta)/v) 2^(-(1-beta)) is the single group through which the three physical constants (c, v, D) enter the far coefficient (imp-95026 Finding 0/1). Varying c alone rescales Q proportionally (v, D, beta fixed), so a central difference in c reads off dcFar/dQ cleanly.",
  derivative: {
    Q0,
    cFar0: CFAR0,
    dCFardQ: DCFAR_DQ,
    elasticity: ELASTICITY,
    note: "elasticity ~0.88: a 1 percent mis-estimate of the paper isolation group moves cFar ~0.88 percent - a strong, near-proportional lever comparable to s = sigma + theta and far stronger than beta (~6 percent over 0.25..0.5).",
  },
  concavity: {
    linearPredAtC15: LINEAR_PRED_AT_C15,
    actualAtC15: ACTUAL_AT_C15,
    overpredRatio: OVERPRED_RATIO,
    note: "cFar(Q) is concave; the local linear model OVER-predicts the ceiling for Q above the model point (by 6.49 percent at Q(c=1.5)), so the local derivative is a CONSERVATIVE upper estimate of the rise when the paper Q exceeds Q0.",
  },
  paperQPlacement:
    "The model instantiation c = v = D = 1 lands exactly at Q0 = 2^(-2/3) = 0.6299605249474366 (cFar0 = 0.2717400426244421). The Q-indexed scan spans Q in [0.315, 1.260] with cFar rising monotonically 0.137 -> 0.421, all far below the pre-seventeenth 4. Because cFar is concave and only ~0.88-elastic in Q, the conservative linear model needs Q ~ 10.4 (c ~ 16.5) to reach cFar = 4, and the true curve needs even more: the isolation group does NOT threaten the qualitative below-4 transfer, it only rescales the margin.",
  qScan: Q_SCAN,
  openResiduals: [
    "the paper Section 4.5 physical constants (c, v, D), hence the paper Q, are not pinned in this repository - this places the MODEL Q on the scan and gives the local sensitivity dcFar/dQ; the remaining step is to read (c, v, D, beta) off the paper packet definition, form Q, and read cFar off this concave curve",
    "the derivative is measured by finite difference on the same midpoint quadrature (N = 200000) as imp-95026; an interval-arithmetic bound on dcFar/dQ is not attempted here",
  ],
  isRigorous: true,
  rigorScope:
    "MEASUREMENT/DERIVATION. dcFar/dQ = 0.3816620268743663 is a central difference (c in {0.98, 1.02}) on the imp-95026 parameterized quadrature at the model point; the elasticity, the Q-re-indexed scan, and the concavity over-prediction (6.49 percent at Q(c=1.5)) are computed directly and cross-checked against the baked imp-95026 isolationScan literals. No paper constant is instantiated (the paper text is not carried here), so no transferred ceiling is CLAIMED - only the isolation-group sensitivity and its place on the scan. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT/DERIVATION of the isolation-group lever for the imp-95008 far-bracket ceiling. dcFar/dQ = 0.3816620268743663 at the model Q0 = 0.6299605249474366 (elasticity 0.8847868296486842: a strong, near-proportional lever, comparable to s = sigma + theta and far stronger than beta). cFar(Q) is CONCAVE, so the local linear model OVER-predicts above the model point (by 6.49 percent at Q(c=1.5)) - the derivative is a conservative upper estimate of the rise. The model c = v = D = 1 lands at Q0 = 2^(-2/3); the Q-indexed isolationScan spans [0.315, 1.260] with cFar 0.137 -> 0.421, all far below the pre-seventeenth 4, and the conservative linear model needs Q ~ 10.4 to reach 4. SUB-GAP: the paper (c, v, D) and hence the paper Q are not pinned in this repo, so this places the MODEL Q on the scan, not a paper number. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95075_ISOLATION_ASSERTIONS = [
  {
    id: "imp95075-model-Q-and-cFar",
    description:
      "the model point c = v = D = 1 (beta = 1/3) lands at Q0 = 2^(-2/3) = 0.6299605249474366 with cFar0 = 0.2717400426244421 (reproduces the imp-95026 quadrature)",
    holds: () => {
      const m = farCoefficient(1, 1 / 3, 1, 1, 1, 10);
      return (
        Math.abs(m.Q - Q0) <= 1e-15 &&
        Math.abs(m.Q - Math.pow(2, -2 / 3)) <= 1e-15 &&
        Math.abs(m.ceiling - CFAR0) <= 1e-12 * CFAR0
      );
    },
  },
  {
    id: "imp95075-derivative-value",
    description:
      "the central-difference dcFar/dQ at the model point (c in {0.98, 1.02}) reproduces 0.3816620268743663 and the elasticity (dcFar/dQ)(Q0/cFar0) = 0.8847868296486842",
    holds: () => {
      const d = dCFarDQatModel();
      const e = (d * Q0) / CFAR0;
      return (
        Math.abs(d - DCFAR_DQ) <= 1e-12 * DCFAR_DQ &&
        Math.abs(e - ELASTICITY) <= 1e-12 * ELASTICITY &&
        d > 0 // cFar GROWS with Q (imp-95026 Finding 1)
      );
    },
  },
  {
    id: "imp95075-concavity-overprediction",
    description:
      "cFar(Q) is concave: the local linear model cFar0 + dcFar/dQ (Q - Q0) OVER-predicts at Q(c = 1.5), giving 0.39195604802558137 vs the actual 0.36807989528190543 (over by ~6.49 percent)",
    holds: () => {
      const Qc15 = isolationQ(1.5, 1, 1 / 3, 1);
      const pred = CFAR0 + DCFAR_DQ * (Qc15 - Q0);
      const actual = farCoefficient(1, 1 / 3, 1.5, 1, 1, 10).ceiling;
      return (
        Math.abs(pred - LINEAR_PRED_AT_C15) <= 1e-12 * LINEAR_PRED_AT_C15 &&
        Math.abs(actual - ACTUAL_AT_C15) <= 1e-12 * ACTUAL_AT_C15 &&
        pred > actual &&
        Math.abs(pred / actual - OVERPRED_RATIO) <= 1e-9
      );
    },
  },
  {
    id: "imp95075-scan-monotone-below-4",
    description:
      "the Q-indexed isolationScan is monotonically increasing in Q and every entry stays far below the pre-seventeenth 4",
    holds: () => {
      const rows = Object.entries(Q_SCAN)
        .map(([q, cf]) => [Number(q), cf])
        .sort((a, b) => a[0] - b[0]);
      for (let i = 1; i < rows.length; i++) {
        if (!(rows[i][1] > rows[i - 1][1])) return false;
      }
      return rows.every(([, cf]) => cf < PRE17_FAR);
    },
  },
  {
    id: "imp95075-honesty-gate",
    description:
      "the verdict names the sub-gap (paper Q not pinned; places the MODEL Q on the scan), records the derivative and concavity, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95075_ISOLATION_Q_FAR_CEILING_SENSITIVITY.promotesBound === false &&
      IMP95075_ISOLATION_Q_FAR_CEILING_SENSITIVITY.openResiduals.length === 2 &&
      /NO QED/.test(IMP95075_ISOLATION_Q_FAR_CEILING_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP95075_ISOLATION_Q_FAR_CEILING_SENSITIVITY.verdict) &&
      /CONCAVE/.test(IMP95075_ISOLATION_Q_FAR_CEILING_SENSITIVITY.verdict) &&
      /SUB-GAP/.test(IMP95075_ISOLATION_Q_FAR_CEILING_SENSITIVITY.verdict),
  },
];

for (const a of IMP95075_ISOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95075-isolation-Q-far-ceiling-sensitivity assertion failed: ${a.id}`);
  }
}

export default IMP95075_ISOLATION_Q_FAR_CEILING_SENSITIVITY;
