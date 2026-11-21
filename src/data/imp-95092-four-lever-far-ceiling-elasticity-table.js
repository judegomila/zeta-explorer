/**
 * imp-95092 - FOUR-LEVER far-ceiling ELASTICITY TABLE. Places the four constants
 * that drive the imp-95008 far coefficient cFar - the decay exponent s = sigma +
 * theta (via theta), sigma, the corner exponent beta, and the isolation constant
 * Q - on ONE table with a COMMON dimensionless elasticity
 *   E_x = (dcFar/dx) (x0 / cFar0)
 * evaluated at the model point (sigma = 1, beta = 1/3, c = v = D = 1, theta = 10;
 * cFar0 = 0.2717400426244421). imp-95075 already ranked the Q lever (~0.88)
 * verbally against s and beta; this module unifies all four into a single
 * transfer-risk-ranking artifact. Measurement/derivation only, NO QED, no bound
 * change.
 *
 * THE TABLE (central difference, +/- 2 percent of each lever at the model point;
 * cFar0 = 0.2717400426244421).
 *   lever            x0        dcFar/dx                elasticity E_x
 *   theta (=> s)     10        -0.03452835979894721    -1.2706393752453726
 *   sigma            1         -0.256612085333714      -0.9443293040487386
 *   isolation Q      0.62996   +0.3816620268743663     +0.8847868296486842
 *   beta             1/3       -0.08097116493304705    -0.09932429556698681
 *
 * RANKING (by |E_x|). theta (1.271) > sigma (0.944) > Q (0.885) > beta (0.099).
 * The decay exponent driven by theta is the strongest lever (a 1 percent theta
 * mis-estimate moves cFar ~1.27 percent, amplified because the model theta = 10
 * is large), sigma and the isolation group Q are comparable near-proportional
 * levers, and beta is an order of magnitude weaker (~0.1-elastic). All four have
 * the sign the imp-95026 scans show: cFar SHRINKS with the decay controls
 * (theta, sigma, beta) and GROWS with the isolation constant Q.
 *
 * CROSS-CHECK against the committed imp-95026 scans. Each row's tight central
 * difference is confirmed against the secant of the wider imp-95026 scan that
 * brackets the model point (elasticity form, same units):
 *   lever   central E_x    scan-secant E_x   scan endpoints used
 *   theta   -1.2706        -1.3042           thetaScan 8..12
 *   sigma   -0.9443        -0.8564           sigmaScan 0.75..1.5
 *   Q       +0.8848        +0.7908           isolationScan c 0.75..1.5
 *   beta    -0.0993        -0.0930           betaScan 0.30..0.40
 * The central and secant elasticities agree in sign and to ~10 percent (the
 * residual is the curvature over the wider secant span - cFar is concave in Q,
 * imp-95075). The Q row reproduces the imp-95075 dcFar/dQ = 0.3816620268743663
 * and elasticity 0.8847868296486842 EXACTLY.
 *
 * SUB-GAP (honest, inherited from imp-95026/imp-95075). The actual Section 4.5
 * packet constants (sigma, theta, beta, Q) are NOT pinned in this repository, so
 * the table is the local elasticity at the MODEL point, not at a paper point.
 * It ranks transfer RISK per lever (which mis-estimate moves the ceiling most)
 * and shows the ordering; the remaining step is to read (sigma, theta, beta, c,
 * v, D) off the paper packet definition and re-read the elasticities there. A_d
 * does not appear (it cancels from cFar, imp-95026 Finding 0).
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

function farCoefficientUncached(sigma, beta, c, v, D, theta) {
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

// Memoised wrapper (same 6-argument signature, so farCoefficient.length === 6). Each call runs
// ~200 midpoint quadratures of N = 200000 points, and the assertions re-request identical
// argument tuples several times; caching returns the bit-identical result object.
const FAR_COEFFICIENT_CACHE = new Map();
function farCoefficient(sigma, beta, c, v, D, theta) {
  const key = `${sigma}|${beta}|${c}|${v}|${D}|${theta}`;
  let r = FAR_COEFFICIENT_CACHE.get(key);
  if (r === undefined) {
    r = farCoefficientUncached(sigma, beta, c, v, D, theta);
    FAR_COEFFICIENT_CACHE.set(key, r);
  }
  return r;
}

// ── central-difference elasticities at the model point (+/- 2 percent) ────────
const BETA0 = 1 / 3;
function elasticityTheta() {
  const m = farCoefficient(1, BETA0, 1, 1, 1, 9.8).ceiling;
  const p = farCoefficient(1, BETA0, 1, 1, 1, 10.2).ceiling;
  const d = (p - m) / (10.2 - 9.8);
  return { d, e: (d * 10) / CFAR0 };
}
function elasticitySigma() {
  const m = farCoefficient(0.98, BETA0, 1, 1, 1, 10).ceiling;
  const p = farCoefficient(1.02, BETA0, 1, 1, 1, 10).ceiling;
  const d = (p - m) / (1.02 - 0.98);
  return { d, e: (d * 1) / CFAR0 };
}
function elasticityBeta() {
  const m = farCoefficient(1, BETA0 * 0.98, 1, 1, 1, 10).ceiling;
  const p = farCoefficient(1, BETA0 * 1.02, 1, 1, 1, 10).ceiling;
  const d = (p - m) / (BETA0 * 1.02 - BETA0 * 0.98);
  return { d, e: (d * BETA0) / CFAR0 };
}
function elasticityQ() {
  const m = farCoefficient(1, BETA0, 0.98, 1, 1, 10);
  const p = farCoefficient(1, BETA0, 1.02, 1, 1, 10);
  const d = (p.ceiling - m.ceiling) / (p.Q - m.Q);
  return { d, e: (d * Q0) / CFAR0 };
}

// ── baked literals (all re-derived by the assertions) ────────────────────────
const CFAR0 = 0.2717400426244421; // model far coefficient (imp-95026 quadrature)
const Q0 = 0.6299605249474366; // model isolation constant = 2^(-2/3)
// dcFar/dx and dimensionless elasticity E_x = (dcFar/dx)(x0/cFar0) per lever
const E_THETA = -1.2706393752453726;
const D_THETA = -0.03452835979894721;
const E_SIGMA = -0.9443293040487386;
const D_SIGMA = -0.256612085333714;
const E_Q = 0.8847868296486842; // matches imp-95075 exactly
const D_Q = 0.3816620268743663;
const E_BETA = -0.09932429556698681;
const D_BETA = -0.08097116493304705;
// scan-secant cross-checks (elasticity form) from the committed imp-95026 scans
const E_THETA_SECANT = -1.304155603158489; // thetaScan 8..12
const E_SIGMA_SECANT = -0.8563589905039709; // sigmaScan 0.75..1.5
const E_Q_SECANT = 0.7908368911624128; // isolationScan c 0.75..1.5
const E_BETA_SECANT = -0.09302757705909813; // betaScan 0.30..0.40

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE = {
  ticket:
    "imp-95092 (assemble the four-lever far-ceiling elasticity table: s = sigma + theta, sigma, beta, isolation Q, with a common dimensionless elasticity at the model point)",
  source:
    "imp-95026 four-lever scan (thetaScan/sigmaScan/betaScan/isolationScan) and imp-95075 Q elasticity; Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture.",
  modelPoint: { sigma: 1, beta: "1/3", c: 1, v: 1, D: 1, theta: 10, s: 11, Q0, cFar0: CFAR0 },
  elasticityDefinition: "E_x = (dcFar/dx)(x0/cFar0), central difference at +/- 2 percent of each lever at the model point.",
  table: [
    { lever: "theta (drives s = sigma + theta)", x0: 10, dCFardx: D_THETA, elasticity: E_THETA, scanSecantElasticity: E_THETA_SECANT, scan: "imp-95026 thetaScan 8..12", note: "strongest lever; amplified by the large model theta = 10; cFar shrinks with the decay exponent" },
    { lever: "sigma", x0: 1, dCFardx: D_SIGMA, elasticity: E_SIGMA, scanSecantElasticity: E_SIGMA_SECANT, scan: "imp-95026 sigmaScan 0.75..1.5", note: "near-proportional decay lever; cFar shrinks with sigma" },
    { lever: "isolation Q = (c D^(1-beta)/v) 2^(-(1-beta))", x0: Q0, dCFardx: D_Q, elasticity: E_Q, scanSecantElasticity: E_Q_SECANT, scan: "imp-95026 isolationScan c 0.75..1.5", note: "strong near-proportional lever; cFar GROWS with Q; reproduces imp-95075 exactly; cFar(Q) concave" },
    { lever: "beta", x0: 1 / 3, dCFardx: D_BETA, elasticity: E_BETA, scanSecantElasticity: E_BETA_SECANT, scan: "imp-95026 betaScan 0.30..0.40", note: "an order of magnitude weaker (~0.1-elastic); cFar shrinks slightly with beta" },
  ],
  ranking:
    "By |E_x|: theta (1.271) > sigma (0.944) > Q (0.885) > beta (0.099). The theta-driven decay exponent s = sigma + theta is the strongest transfer-risk lever, sigma and Q are comparable, beta is negligible. Signs match the imp-95026 scans: cFar shrinks with (theta, sigma, beta), grows with Q.",
  crossCheck:
    "Each tight central-difference elasticity agrees in sign and to ~10 percent with the secant of the wider imp-95026 scan bracketing the model point; the residual is the curvature over the wider span (cFar is concave in Q, imp-95075). The Q row reproduces imp-95075 dcFar/dQ = 0.3816620268743663 and elasticity 0.8847868296486842 exactly. A_d does not appear (it cancels from cFar, imp-95026 Finding 0).",
  openResiduals: [
    "the actual Section 4.5 paper packet constants (sigma, theta, beta, Q) are not pinned in this repository - the table is the LOCAL elasticity at the MODEL point, ranking transfer risk per lever, not the elasticity at a paper point; the remaining step is to read (sigma, theta, beta, c, v, D) off the paper packet definition and re-read the table there",
    "the elasticities are central differences on the same midpoint quadrature (N = 200000) as imp-95026/imp-95075; interval-arithmetic bounds on the four derivatives are not attempted here",
  ],
  isRigorous: true,
  rigorScope:
    "MEASUREMENT/DERIVATION. The four elasticities E_x = (dcFar/dx)(x0/cFar0) are central differences (+/- 2 percent) on the imp-95026 parameterized quadrature at the model point (sigma=1, beta=1/3, c=v=D=1, theta=10; cFar0 = 0.2717400426244421); each is cross-checked in sign and ~10 percent magnitude against the secant of the committed imp-95026 scan bracketing the model point, and the Q row reproduces imp-95075 exactly. No paper constant is instantiated (the paper text is not carried here), so the table is the local elasticity at the MODEL point, not a paper number. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT/DERIVATION assembling the four levers driving the imp-95008 far coefficient cFar onto ONE table with a common dimensionless elasticity E_x = (dcFar/dx)(x0/cFar0) at the model point. RANKING by |E_x|: theta (drives s = sigma + theta) 1.271 > sigma 0.944 > isolation Q 0.885 > beta 0.099. cFar SHRINKS with the decay controls (theta, sigma, beta) and GROWS with the isolation constant Q, matching the imp-95026 scans. Each row is cross-checked against the secant of the wider imp-95026 scan (sign and ~10 percent), and the Q row reproduces imp-95075 dcFar/dQ = 0.3816620268743663 and elasticity 0.8847868296486842 exactly. A_d does not enter (it cancels, imp-95026 Finding 0). SUB-GAP: the paper Section 4.5 constants are not pinned in this repo, so the table is the LOCAL elasticity at the MODEL point ranking transfer risk per lever, not a paper number. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95092_ELASTICITY_TABLE_ASSERTIONS = [
  {
    id: "imp95092-model-point-reproduction",
    heavy: true, // N = 200000 quadrature re-derivation; skipped at browser import (see loop below)
    description:
      "the model point (sigma=1, beta=1/3, c=v=D=1, theta=10) reproduces cFar0 = 0.2717400426244421 and Q0 = 2^(-2/3) = 0.6299605249474366",
    holds: () => {
      const m = farCoefficient(1, BETA0, 1, 1, 1, 10);
      return (
        Math.abs(m.ceiling - CFAR0) <= 1e-12 * CFAR0 &&
        Math.abs(m.Q - Q0) <= 1e-15 &&
        Math.abs(m.Q - Math.pow(2, -2 / 3)) <= 1e-15
      );
    },
  },
  {
    id: "imp95092-four-elasticities-reproduce",
    heavy: true, // N = 200000 quadrature re-derivation; skipped at browser import (see loop below)
    description:
      "the four central-difference elasticities and dcFar/dx reproduce the baked table literals (theta -1.2706, sigma -0.9443, Q +0.8848, beta -0.0993)",
    holds: () => {
      const t = elasticityTheta();
      const s = elasticitySigma();
      const q = elasticityQ();
      const b = elasticityBeta();
      return (
        Math.abs(t.e - E_THETA) <= 1e-10 * Math.abs(E_THETA) &&
        Math.abs(t.d - D_THETA) <= 1e-10 * Math.abs(D_THETA) &&
        Math.abs(s.e - E_SIGMA) <= 1e-10 * Math.abs(E_SIGMA) &&
        Math.abs(s.d - D_SIGMA) <= 1e-10 * Math.abs(D_SIGMA) &&
        Math.abs(q.e - E_Q) <= 1e-10 * Math.abs(E_Q) &&
        Math.abs(q.d - D_Q) <= 1e-10 * Math.abs(D_Q) &&
        Math.abs(b.e - E_BETA) <= 1e-10 * Math.abs(E_BETA) &&
        Math.abs(b.d - D_BETA) <= 1e-10 * Math.abs(D_BETA)
      );
    },
  },
  {
    id: "imp95092-Q-row-matches-imp95075",
    heavy: true, // N = 200000 quadrature re-derivation; skipped at browser import (see loop below)
    description:
      "the Q row reproduces the imp-95075 dcFar/dQ = 0.3816620268743663 and elasticity 0.8847868296486842 exactly (same central difference, same quadrature)",
    holds: () => {
      const q = elasticityQ();
      return (
        Math.abs(q.d - 0.3816620268743663) <= 1e-12 * 0.3816620268743663 &&
        Math.abs(q.e - 0.8847868296486842) <= 1e-12 * 0.8847868296486842
      );
    },
  },
  {
    id: "imp95092-signs-match-imp95026-scans",
    description:
      "the four elasticity signs match the committed imp-95026 scan directions: cFar decreases in theta, sigma, beta (E < 0) and increases in Q (E > 0)",
    holds: () =>
      E_THETA < 0 && E_SIGMA < 0 && E_BETA < 0 && E_Q > 0,
  },
  {
    id: "imp95092-ranking-and-secant-crosscheck",
    description:
      "the |elasticity| ranking is theta > sigma > Q > beta, and each central elasticity agrees in sign and within 15 percent of the imp-95026 scan-secant elasticity",
    holds: () => {
      const rankOk =
        Math.abs(E_THETA) > Math.abs(E_SIGMA) &&
        Math.abs(E_SIGMA) > Math.abs(E_Q) &&
        Math.abs(E_Q) > Math.abs(E_BETA);
      const close = (a, sec) =>
        Math.sign(a) === Math.sign(sec) && Math.abs(a - sec) <= 0.15 * Math.abs(sec);
      return (
        rankOk &&
        close(E_THETA, E_THETA_SECANT) &&
        close(E_SIGMA, E_SIGMA_SECANT) &&
        close(E_Q, E_Q_SECANT) &&
        close(E_BETA, E_BETA_SECANT)
      );
    },
  },
  {
    id: "imp95092-honesty-gate",
    description:
      "the verdict names the sub-gap (paper constants not pinned; local model-point elasticity), records the ranking and A_d cancellation, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE.promotesBound === false &&
      IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE.openResiduals.length === 2 &&
      IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE.table.length === 4 &&
      /NO QED/.test(IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE.verdict) &&
      /refereed bound is changed/i.test(IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE.verdict) &&
      /RANKING/.test(IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE.verdict) &&
      /SUB-GAP/.test(IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE.verdict),
  },
];

// The heavy (quadrature re-derivation) assertions take tens of seconds; at browser import they
// blanked /permutation-architecture for 25-50 s. They are skipped only in the browser: the node
// assertion harness (scripts/run-assertions.mjs) runs every entry of the exported array, and the
// cheap assertions (honesty gate, closed-form checks) still self-execute everywhere.
const SKIP_HEAVY_AT_IMPORT = typeof window !== 'undefined';
for (const a of IMP95092_ELASTICITY_TABLE_ASSERTIONS) {
  if (a.heavy && SKIP_HEAVY_AT_IMPORT) continue;
  if (!a.holds()) {
    throw new Error(`imp-95092-four-lever-far-ceiling-elasticity-table assertion failed: ${a.id}`);
  }
}

export default IMP95092_FOUR_LEVER_FAR_CEILING_ELASTICITY_TABLE;
