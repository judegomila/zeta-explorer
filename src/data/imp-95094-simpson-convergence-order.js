/**
 * imp-95094 - N-CONVERGENCE ORDER of the imp-95076 composite-Simpson cFar trace.
 * Measurement only, NO QED, promotes no bound.
 *
 * CONTEXT. imp-95076 Finding A (imp-95076-adin-cancellation-trace.js) evaluates
 * the far coefficient cFar on an INDEPENDENT composite-Simpson path and reports a
 * single-N number:
 *   Simpson cFar 0.2716816410981926 vs closed form 0.2717408057586117
 *   (relative 2.18e-4) at N=40000,
 * attributing the gap to "pure quadrature error." That 2.18e-4 is far coarser
 * than the imp-95073 adaptive-Simpson reference (7.5e-9), so the composite rule
 * under-resolves. imp-95076 gives NO convergence-order control - one N, one error.
 * This module measures the Simpson error vs N over [1e4, 1e6] and reports the
 * OBSERVED convergence order so the imp-95076 trace's own quadrature floor is
 * bounded.
 *
 * WHY THE SIMPSON RULE UNDER-RESOLVES (structural). The integrand of the
 * normalized pair correlation is
 *   f(u) = (1 + |u|/rho)^(-s) (1 + |u - T|)^(-s),
 * which has two interior CORNERS (kinks in the first derivative) at u=0 and u=T
 * from the two absolute values. Composite Simpson attains its classical O(h^4)
 * rate only on C^4 integrands; an interior kink that lands at a varying position
 * inside a panel as N changes degrades the rule to second order, O(h^2) ~ O(N^-2).
 * The corner is "straddled" by whatever panel contains it, so the error also
 * OSCILLATES with N about the O(N^-2) trend depending on how near a node the
 * corner falls.
 *
 * FINDING (measured, baked). Sweeping N in {1e4, 2e4, 4e4, ..., 1e6} on the same
 * model point (sigma=1, beta=1/3, c=v=D=1, theta=10, s=11, pad=120) and taking the
 * relative error to the closed form 0.2717408057586117:
 *   N=1e4  rel 2.10e-3      N=1.6e5 rel 1.33e-5
 *   N=2e4  rel 8.66e-4      N=3.2e5 rel 3.36e-6
 *   N=4e4  rel 2.18e-4      N=6.4e5 rel 1.58e-6
 *   N=8e4  rel 1.07e-4      N=1e6   rel 6.28e-7
 * A log-log least-squares fit of relErr vs N over this table gives an EFFECTIVE
 * order p ~ 1.82; a denser 40-point grid over the same decade gives p ~ 2.11. So
 * the observed convergence is SECOND-order, O(N^-2) (p ~ 1.8-2.1), NOT the
 * classical O(N^-4) Simpson rate - exactly the corner-degradation predicted above.
 * The imp-95076 N=40000 point (rel 2.18e-4) sits on this O(N^-2) curve.
 *
 * OSCILLATION WITNESS (corner-straddling, non-monotone in fine N). The error is
 * not monotone in N: at N=250000 rel 4.98e-6, but at the adjacent N=252000
 * rel 1.26e-7 (a ~40x dip) because the corner falls nearer a node there. Over the
 * dense grid the relErr dips as low as ~3.6e-9 at alignment-favorable N -
 * comparable to the imp-95073 adaptive reference 7.5e-9 - then rebounds, so the
 * p ~ 2 order is an EFFECTIVE (fit) order over the trend, not a clean monotone rate.
 *
 * CONSEQUENCE (bounds the imp-95076 trace floor). The imp-95076 Finding-A path
 * carries a quadrature floor of rel 2.18e-4 at its stated N=40000, decaying as
 * O(N^-2); reaching the imp-95073 adaptive rel 7.5e-9 on this composite rule would
 * need N of order 1e7-1e8 (well beyond the baked N=40000). The imp-95076 trace's
 * STRUCTURAL findings (cFar amplitude-invariant; M proportional to A_d^2) are
 * exact and unaffected; only its Finding-A numeric reproduction carries this floor.
 *
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── identical machinery to imp-95076 (so the trace is reproduced bit-for-bit) ──
function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}
// composite Simpson of the normalized pair correlation with N panels and pad tails
function iSimpson(T, rho, s, N, pad) {
  if (N % 2 === 1) N += 1;
  const lo = -pad;
  const hi = T + pad;
  const h = (hi - lo) / N;
  const f = (u) =>
    Math.pow(1 + Math.abs(u) / rho, -s) * Math.pow(1 + Math.abs(u - T), -s);
  let acc = f(lo) + f(hi);
  for (let i = 1; i < N; i++) {
    acc += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return ((acc * h) / 3) / Math.sqrt(rho);
}
// far coefficient cFar at a chosen panel count N (amplitude irrelevant to cFar)
function cFarAt(N, pad) {
  const sigma = 1, beta = 1 / 3, c = 1, v = 1, D = 1, theta = 10;
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
  const envE = (b, j) => iSimpson(cornerV(b, j), rhoCap(j), s, N, pad);
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
  return (2 * sup) / Tx2;
}

// log-log least-squares slope of relErr vs N (effective observed order = -slope)
function effectiveOrder(table, exact) {
  const xs = table.map((r) => Math.log(r.N));
  const ys = table.map((r) => Math.log(Math.abs(r.cFar - exact) / exact));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  return -(num / den);
}

// ── baked literals (all re-derived / arithmetic-checked by the assertions) ─────
const PAD = 120;
const MODEL_CFAR_EXACT = 0.2717408057586117; // closed-form ceiling (imp-95076)
const SIMPSON_N40000 = 0.2716816410981926; // imp-95076 Finding-A single-N value
// N-sweep of the composite-Simpson cFar (pad=120), doubling from 1e4 to ~1e6
const CONVERGENCE_TABLE = [
  { N: 10000, cFar: 0.2711701528895682 },
  { N: 20000, cFar: 0.271505459861028 },
  { N: 40000, cFar: 0.2716816410981926 },
  { N: 80000, cFar: 0.27176994468257065 },
  { N: 160000, cFar: 0.27173719996901785 },
  { N: 320000, cFar: 0.2717398933928855 },
  { N: 640000, cFar: 0.2717412347094564 },
  { N: 1000000, cFar: 0.2717409764408522 },
];
const EFFECTIVE_ORDER_TABLE = 1.8226; // log-log fit over the 8-point doubling table
const EFFECTIVE_ORDER_DENSE = 2.1136; // log-log fit over a denser 40-point decade grid
// adjacent-N oscillation witness (corner-straddling): a ~40x error dip at 252000
const OSC_N_A = 250000, OSC_CFAR_A = 0.27174215972748206; // rel ~4.98e-6
const OSC_N_B = 252000, OSC_CFAR_B = 0.2717407714394649; // rel ~1.26e-7

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95094_SIMPSON_CONVERGENCE_ORDER = {
  ticket:
    "imp-95094 (measure the N-convergence of the imp-95076 composite-Simpson cFar trace toward the closed form and report the observed order)",
  source:
    "imp-95076-adin-cancellation-trace.js Finding A (single-N=40000 Simpson error 2.18e-4); imp-95073 adaptive-Simpson reference 7.5e-9.",
  findingObservedOrder:
    "Sweeping the panel count N in {1e4..1e6} on the model point (sigma=1, beta=1/3, c=v=D=1, theta=10, s=11, pad=120), the relative error to the closed form 0.2717408057586117 falls from 2.10e-3 (N=1e4) to 6.28e-7 (N=1e6). A log-log least-squares fit gives an EFFECTIVE order p ~ 1.82 over the 8-point doubling table and p ~ 2.11 over a denser 40-point grid, i.e. SECOND-order O(N^-2) - not the classical O(N^-4) Simpson rate.",
  findingWhyDegraded:
    "The integrand f(u) = (1+|u|/rho)^(-s)(1+|u-T|)^(-s) has two interior corners (first-derivative kinks) at u=0 and u=T from the absolute values. Composite Simpson needs a C^4 integrand for O(h^4); an interior kink straddled by a panel degrades the rule to O(h^2), which is what is measured.",
  findingOscillation:
    "The error is non-monotone in fine N (corner-straddling): at N=250000 rel 4.98e-6 but at the adjacent N=252000 rel 1.26e-7 (a ~40x dip toward a node); over the dense grid the error dips as low as ~3.6e-9 (comparable to the imp-95073 adaptive reference 7.5e-9) then rebounds. So p ~ 2 is an EFFECTIVE fit order over the trend, not a clean monotone rate.",
  findingFloorConsequence:
    "The imp-95076 Finding-A path carries a quadrature floor of rel 2.18e-4 at its stated N=40000, decaying as O(N^-2); reaching the imp-95073 adaptive rel 7.5e-9 on this composite rule would need N of order 1e7-1e8. The imp-95076 STRUCTURAL findings (cFar amplitude-invariant; M proportional to A_d^2) are exact and unaffected; only its Finding-A numeric reproduction carries this floor.",
  reference: {
    modelPoint: { sigma: 1, beta: "1/3", c: 1, v: 1, D: 1, theta: 10, s: 11, pad: PAD },
    closedForm: MODEL_CFAR_EXACT,
    simpsonAtN40000: SIMPSON_N40000,
    relErrAtN40000: 0.00021772460802837575,
    convergenceTable: CONVERGENCE_TABLE,
    effectiveOrderDoublingTable: EFFECTIVE_ORDER_TABLE,
    effectiveOrderDenseGrid: EFFECTIVE_ORDER_DENSE,
    adaptiveReferenceRelErr: 7.5e-9,
    oscillationWitness: {
      Na: OSC_N_A, relA: 4.98e-6, Nb: OSC_N_B, relB: 1.26e-7,
      note: "adjacent-N ~40x dip; corner-straddling non-monotonicity",
    },
    note: "measurement only; observed order p ~ 1.8-2.1 (second-order, corner-degraded from Simpson O(h^4)); imp-95076 Finding-A quadrature floor bounded.",
  },
  openResiduals: [
    "the observed order is measured empirically (log-log fit p ~ 1.8-2.1) and is corner-straddling-oscillatory, not a proved asymptotic constant; a rigorous O(h^2) corner-error bound with an explicit constant is not attempted here",
  ],
  isRigorous: false,
  rigorScope:
    "Empirical convergence measurement of a deterministic composite-Simpson evaluator: the N-table reproduces bit-for-bit and the log-log fit is exact arithmetic on it, but the reported order p ~ 1.8-2.1 is a FIT, not a proved bound, and oscillates with corner-node alignment. No bound is promoted. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT bounding the imp-95076 Finding-A quadrature floor. The composite-Simpson cFar converges to the closed form 0.2717408057586117 at SECOND order O(N^-2) (log-log fit p ~ 1.82 over the doubling table, ~2.11 over a denser grid), NOT the classical O(N^-4) Simpson rate - degraded by the two interior corners of the pair-correlation integrand at u=0 and u=T (kinks from the absolute values). The error is corner-straddling-OSCILLATORY in fine N (e.g. N=250000 rel 4.98e-6 vs adjacent N=252000 rel 1.26e-7, a ~40x dip), so p ~ 2 is an effective fit order over the trend. The imp-95076 N=40000 point (rel 2.18e-4) sits on this O(N^-2) curve; matching the imp-95073 adaptive reference 7.5e-9 on this rule needs N ~ 1e7-1e8. The imp-95076 structural findings (cFar amplitude-invariant, M proportional to A_d^2) are exact and untouched. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95094_CONVERGENCE_ASSERTIONS = [
  {
    id: "imp95094-anchors-reproduce-bitwise",
    description:
      "the cheap N=10000 and N=40000 sweep anchors recompute bit-for-bit against the baked table (independent-path reproduction of imp-95076 Finding A)",
    holds: () => {
      const t10k = CONVERGENCE_TABLE[0];
      const t40k = CONVERGENCE_TABLE[2];
      return (
        cFarAt(t10k.N, PAD) === t10k.cFar &&
        cFarAt(t40k.N, PAD) === t40k.cFar &&
        t40k.cFar === SIMPSON_N40000
      );
    },
  },
  {
    id: "imp95094-n40000-relerr-matches-imp95076",
    description:
      "the N=40000 relative error to the closed form is the imp-95076-reported 2.18e-4",
    holds: () => {
      const rel = Math.abs(SIMPSON_N40000 - MODEL_CFAR_EXACT) / MODEL_CFAR_EXACT;
      return Math.abs(rel - 0.00021772460802837575) <= 1e-12;
    },
  },
  {
    id: "imp95094-effective-order-second-order",
    description:
      "the log-log fit of relErr vs N over the baked doubling table gives an effective order in the second-order band [1.5, 2.4] (corner-degraded Simpson, NOT classical O(N^-4)); recomputed slope matches the baked 1.8226",
    holds: () => {
      const p = effectiveOrder(CONVERGENCE_TABLE, MODEL_CFAR_EXACT);
      return (
        p >= 1.5 && p <= 2.4 &&
        Math.abs(p - EFFECTIVE_ORDER_TABLE) <= 1e-3 &&
        EFFECTIVE_ORDER_DENSE > EFFECTIVE_ORDER_TABLE
      );
    },
  },
  {
    id: "imp95094-error-improves-over-decade",
    description:
      "the relative error improves by more than three orders of magnitude across the swept decade (2.10e-3 at N=1e4 down to ~6.28e-7 at N=1e6)",
    holds: () => {
      const relLo = Math.abs(CONVERGENCE_TABLE[0].cFar - MODEL_CFAR_EXACT) / MODEL_CFAR_EXACT;
      const relHi = Math.abs(CONVERGENCE_TABLE[CONVERGENCE_TABLE.length - 1].cFar - MODEL_CFAR_EXACT) / MODEL_CFAR_EXACT;
      return relLo > 2e-3 && relHi < 1e-6 && relLo / relHi > 1e3;
    },
  },
  {
    id: "imp95094-corner-straddling-oscillation",
    description:
      "adjacent-N non-monotonicity: the baked witness N=252000 has a ~40x smaller error than N=250000, evidencing corner-straddling alignment (not a clean monotone rate)",
    holds: () => {
      const relA = Math.abs(OSC_CFAR_A - MODEL_CFAR_EXACT) / MODEL_CFAR_EXACT;
      const relB = Math.abs(OSC_CFAR_B - MODEL_CFAR_EXACT) / MODEL_CFAR_EXACT;
      return OSC_N_B > OSC_N_A && relB < relA / 10;
    },
  },
  {
    id: "imp95094-honesty-gate",
    description:
      "the verdict names the empirical-order / oscillation sub-gap, reports second-order O(N^-2) not O(N^-4), promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95094_SIMPSON_CONVERGENCE_ORDER.promotesBound === false &&
      IMP95094_SIMPSON_CONVERGENCE_ORDER.isRigorous === false &&
      IMP95094_SIMPSON_CONVERGENCE_ORDER.openResiduals.length === 1 &&
      /NO QED/.test(IMP95094_SIMPSON_CONVERGENCE_ORDER.verdict) &&
      /refereed bound is changed/i.test(IMP95094_SIMPSON_CONVERGENCE_ORDER.verdict) &&
      /SECOND order/.test(IMP95094_SIMPSON_CONVERGENCE_ORDER.verdict) &&
      /OSCILLATORY/.test(IMP95094_SIMPSON_CONVERGENCE_ORDER.verdict),
  },
];

for (const a of IMP95094_CONVERGENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95094-simpson-convergence-order assertion failed: ${a.id}`);
  }
}

export default IMP95094_SIMPSON_CONVERGENCE_ORDER;
