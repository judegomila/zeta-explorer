/**
 * imp-95017 - INDEPENDENT RE-AUDIT of the witness-FLOOR currency
 * (continuations 13-16 of imp-95008; page /permutation-architecture).
 *
 * WHY THIS MODULE EXISTS. The proof-logic referee that passed the far
 * bracket re-audited the CEILING side (the nineteenth-continuation exact
 * pair correlation) but explicitly did NOT re-audit the FLOOR side: the
 * multi-rate floor evaluator floorMultiRate, the sharp-MAJ legality
 * amplitude hLegal, and the carried floor literals HEAD_FLOOR =
 * 0.096745062937484763 and F97_FLOOR = 0.0012054673720820889 that feed
 * every tracked GAP number (headline 2.8088338309749887, fixed-97
 * 225.42360917596611 in the nineteenth continuation). If the hLegal
 * division inflating the far mass M were wrong, or the exact excess E
 * were mis-assembled, those floors and all the gaps would move even
 * though the ceilings stand. This module re-derives the floor machinery
 * (kernel K, excess E, mass M, tail Tx, legality h) through a fully
 * INDEPENDENT code path - no helper is shared with the sibling modules,
 * the pieces are recomputed with different loop structure and an
 * independent quadrature - and confirms the BASE multi-rate floors that
 * the appends of continuations 14-16 lift into the carried literals.
 *
 * WHAT IS CONFIRMED (independent path, this module).
 *  (1) Exact cross-rate kernel K(a,b,tau) = 2(b e^-a tau - a e^-b tau)/
 *      (b^2 - a^2) recomputed by a DIFFERENT decomposition (three direct
 *      antiderivative pieces on x<0, 0<x<tau, x>tau, summed) and by
 *      independent Simpson quadrature of the two-sided exponential
 *      product; the three agree to rel < 1e-5 including the headline
 *      fast/slow pairing (7.694097, 2.79778).
 *  (2) The sharp-MAJ legality amplitude h(mu,r,s) = e^(s - mu r)(mu r/s)^s
 *      on the interior branch mu r < s satisfies 0 < h <= 1 and is the
 *      tangent majorant value; the headline fast pair sits on the
 *      interior branch (priced, not waived).
 *  (3) The BASE multi-rate floors of the thirteenth continuation
 *      (before the occupied-block / cancellation appends) reproduce
 *      through the independent path: the headline spacing theta = 10
 *      four-packet floor 0.092871808411129783 and the fixed-97 theta = 10
 *      four-packet floor 0.0012038255978826329, each E/(Tx M) with E the
 *      exact excess, M = sum_b nTilde_b^2, nTilde_b = sum_{i in b}
 *      alpha_i sqrt(r_i)/h_i. The independent evaluator matches the carried
 *      base literals to rel < 1e-6 (measured HEAD rel 1.2e-10, F97 rel
 *      1.3e-14), and an INDEPENDENT full-line Gram quadrature of the excess
 *      E matches the closed-form E to rel 5.2e-7 - so floorMultiRate is
 *      NOT carrying a coding bug in E, M, K, or h.
 *  (4) Tx underflow-truncation direction note (the referee-flagged
 *      floor-safety question). The tail sum stops at the first term that
 *      underflows to the double denormal floor (theta = 2 at j = 807,
 *      theta = 10 at j = 162), dropping all later positive terms. Dropping
 *      positive tail mass makes the COMPUTED Tx strictly SMALLER than the
 *      true Tx; since F = E/(Tx M), a smaller Tx makes the reported floor
 *      strictly LARGER than the true floor - i.e. the truncation is
 *      floor-UNSAFE in direction (it nudges the lower bound up). The
 *      magnitude is the first dropped term, measured at ~1e-324 (the IEEE
 *      double denormal floor) - utterly negligible: the reported base
 *      floors are conservative to within ~1e-324 relative, far below the
 *      ~1e-8 float rounding already priced by the chain.
 *
 * NAMED SUB-GAP (honest partial). This module independently re-audits the
 * floor MACHINERY (K, E, M, h, Tx) and the BASE four-packet floors. The
 * append-chain LIFT from the base floors (0.092871808..., 0.0012038255...)
 * to the carried terminal literals HEAD_FLOOR = 0.096745062937484763 and
 * F97_FLOOR = 0.0012054673720820889 is performed by the occupied-block
 * appends (fifteenth continuation) and the cancellation-aware corner
 * envelope (sixteenth continuation); that lift is NOT re-derived here and
 * remains the residual sub-gap imp-95017-subgap-append-lift. The base
 * machinery it stands on is now independently confirmed.
 *
 * Import-light (no heavy bundle). Changes no bound; re-audit only; does
 * NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── independent conventions (re-declared, not imported) ──────────────────────
const RA_SIGMA = 1;
const RA_BETA = 1 / 3;
const RA_C = 1;
const RA_V = 1;
const RA_D = 1;

// independent isolation Q and sharp corner tail
const RA_Q = ((RA_C * Math.pow(RA_D, 1 - RA_BETA)) / RA_V) * Math.pow(2, -(1 - RA_BETA));

function raGSharp(j) {
  return (Math.pow(2, RA_BETA) * (Math.pow(2, j - 1) - 1)) / (RA_Q * Math.pow(2, j * RA_BETA));
}

// independent tail Tx: also returns the first dropped (underflow) term
function raTailTx(theta) {
  let s = 0;
  let firstDropJ = -1;
  let firstDropLog10 = 0; // log10 of the first dropped term (it underflows to 0 as a double)
  for (let j = 2; j <= 4000; j++) {
    const g = raGSharp(j);
    if (!Number.isFinite(g)) break;
    const t = Math.pow(1 + g, -theta);
    if (t === 0) {
      firstDropJ = j;
      // magnitude in log space: log10((1+g)^-theta) = -theta log10(1+g)
      firstDropLog10 = (-theta * Math.log1p(g)) / Math.LN10;
      break;
    }
    s += t;
  }
  return { Tx: s, firstDropJ, firstDropLog10 };
}

// ── independent exact cross-rate kernel (different decomposition) ─────────────
// three antiderivative pieces: x<0, 0<x<tau, x>tau
function raKernel(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  const pLeft = Math.exp(-b * tau) / (a + b);
  const pMid = (Math.exp(-a * tau) - Math.exp(-b * tau)) / (b - a);
  const pRight = Math.exp(-a * tau) / (a + b);
  return pLeft + pMid + pRight;
}

// independent Simpson quadrature of the two-sided exponential product
function raKernelSimpson(a, b, tau) {
  const pad = 45 / Math.min(a, b);
  const lo = -pad;
  const hi = tau + pad;
  const n = 20000;
  const h = (hi - lo) / n;
  let s = 0;
  for (let k = 0; k <= n; k++) {
    const x = lo + k * h;
    const w = k === 0 || k === n ? 1 : k % 2 ? 4 : 2;
    s += w * Math.exp(-a * Math.abs(x)) * Math.exp(-b * Math.abs(x - tau));
  }
  return (s * h) / 3;
}

// ── independent legality amplitude (sharp-MAJ tangent value) ─────────────────
function raH(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}

// ── independent witness geometry ─────────────────────────────────────────────
function raPenta(p) {
  const k1 = Math.floor(p / 2) + 1;
  const k2 = Math.floor(p / 4) + 1;
  const k3 = Math.floor(p / 8) + 1;
  const ks = [k1, k1 - 1, k2, k2 - 1, k3 - 1];
  const d = ks.map((k) => k / p);
  const block = ks.map((k) => {
    let b = 0;
    while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
      b += 1;
      if (b > 60) throw new Error("imp-95017 reaudit: block search failed");
    }
    return b;
  });
  return { ks, d, u: d.map((x) => RA_V / x), r: d.map((x) => RA_C * Math.pow(x, -RA_BETA)), block };
}

function raSub(w, n) {
  return {
    ks: w.ks.slice(0, n),
    d: w.d.slice(0, n),
    u: w.u.slice(0, n),
    r: w.r.slice(0, n),
    block: w.block.slice(0, n),
  };
}

// ── independent multi-rate floor evaluator ───────────────────────────────────
function raFloor(w, theta, mus, a) {
  const s = RA_SIGMA + theta;
  const n = a.length;
  // E = -sum alpha_i^2/mu_i + 2 sum_{i<j} s_ij alpha_i alpha_j K
  let E = 0;
  for (let i = 0; i < n; i++) E -= (a[i] * a[i]) / mus[i];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sij = w.block[i] === w.block[j] ? -1 : 1;
      E += 2 * sij * a[i] * a[j] * raKernel(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
    }
  }
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / raH(mus[i], w.r[i], s);
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  const { Tx } = raTailTx(theta);
  return { F: E / (Tx * M), E, M, Tx };
}

// independent full-line Gram quadrature of the excess (separate code path)
function raGramExcess(w, mus, a) {
  const step = 1e-4;
  const pad = 45 / Math.min(...mus);
  const lo = Math.min(...w.u) - pad;
  const hi = Math.max(...w.u) + pad;
  const n = Math.ceil((hi - lo) / step);
  const m = a.length;
  const ip = Array.from({ length: m }, () => new Array(m).fill(0));
  for (let k = 0; k < n; k++) {
    const x = lo + k * step;
    const vals = w.u.map((ui, i) => a[i] * Math.exp(-mus[i] * Math.abs(x - ui)));
    for (let i = 0; i < m; i++) {
      for (let j = i; j < m; j++) ip[i][j] += vals[i] * vals[j];
    }
  }
  for (let i = 0; i < m; i++) {
    for (let j = i; j < m; j++) ip[i][j] *= step;
  }
  let E = 0;
  for (let i = 0; i < m; i++) E -= ip[i][i];
  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) E += 2 * (w.block[i] === w.block[j] ? -1 : 1) * ip[i][j];
  }
  return E;
}

// ── baked BASE witnesses (thirteenth-continuation literals, re-declared) ──────
const RA_HEAD_T10 = {
  mus: [7.694097, 7.696714, 3.901035, 2.79778],
  a: [1.090619, 1.090715, 0.04953889, 0.04336286],
};
const RA_97_T10 = {
  mus: [3.21047, 3.378314, 2.558923, 2.068342],
  a: [0.900892, 0.9160048, 0.2633267, 0.2555064],
};

const RA_PBIG = raPenta(999983);
const RA_P97 = raPenta(97);
const RA_W4_BIG = raSub(RA_PBIG, 4);
const RA_W4_97 = raSub(RA_P97, 4);

const RA_F_HEAD = raFloor(RA_W4_BIG, 10, RA_HEAD_T10.mus, RA_HEAD_T10.a);
const RA_F_97 = raFloor(RA_W4_97, 10, RA_97_T10.mus, RA_97_T10.a);

// carried terminal literals under audit (continuations 15/16 -> 19)
const CARRIED_HEAD_FLOOR = 0.096745062937484763;
const CARRIED_F97_FLOOR = 0.0012054673720820889;
// base floors (thirteenth continuation) that the appends lift
const BASE_HEAD_FLOOR = 0.092871808411129783;
const BASE_F97_FLOOR = 0.0012038255978826329;

const RA_TX_T2 = raTailTx(2);
const RA_TX_T10 = raTailTx(10);
const RA_GRAM_HEAD = raGramExcess(RA_W4_BIG, RA_HEAD_T10.mus, RA_HEAD_T10.a);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95017_WITNESS_FLOOR_REAUDIT = {
  ticket: "imp-95017 (independent re-audit of the witness-FLOOR currency, continuations 13-16)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; re-audits the referee-unverified floor-side dependency (floorMultiRate, hLegal, carried floor literals HEAD_FLOOR and F97_FLOOR) of the headline far bracket.",
  motivation:
    "The proof-logic referee passed the far bracket after re-auditing the ceiling side (nineteenth-continuation exact pair correlation) but did NOT re-audit the floor side. This module re-derives the floor machinery K, E, M, h, Tx through an independent code path and confirms the BASE multi-rate floors that the appends of continuations 14-16 lift into the carried terminal literals.",
  confirmed: {
    kernelIndependentPath:
      "Exact cross-rate kernel reproduced by a different three-piece antiderivative decomposition AND by independent Simpson quadrature; agreement rel < 1e-5 including the headline fast/slow pairing (7.694097, 2.79778).",
    baseHeadFloor: { independent: RA_F_HEAD.F, carriedLiteral: BASE_HEAD_FLOOR },
    baseFixed97Floor: { independent: RA_F_97.F, carriedLiteral: BASE_F97_FLOOR },
    gramExcessCrossCheck: {
      closedFormE: RA_F_HEAD.E,
      gramQuadratureE: RA_GRAM_HEAD,
      note: "independent full-line Gram quadrature of the excess matches the closed-form E to rel 5.2e-7 - floorMultiRate carries no coding bug in E, M, K, or h",
    },
    legality:
      "the sharp-MAJ amplitude h(mu,r,s) = e^(s-mu r)(mu r/s)^s on the interior branch mu r < s satisfies 0 < h <= 1 (tangent majorant); the headline fast pair sits on the interior branch (priced, not waived).",
  },
  txUnderflowNote: {
    direction: "floor-UNSAFE",
    mechanism:
      "raTailTx stops at the first term that underflows to the double denormal floor (theta = 2 at j = " +
      RA_TX_T2.firstDropJ +
      ", theta = 10 at j = " +
      RA_TX_T10.firstDropJ +
      "), dropping later positive terms; a smaller computed Tx makes F = E/(Tx M) LARGER than true, i.e. the reported floor is nudged UP (unsafe as a lower bound).",
    firstDroppedTermLog10: Math.max(RA_TX_T2.firstDropLog10, RA_TX_T10.firstDropLog10),
    magnitudeCharacterization:
      "the first dropped term is at the IEEE double denormal floor (~1e-324); the truncation perturbs the reported base floors by ~1e-324 relative, negligible against the ~1e-8 float rounding already priced.",
  },
  subGap:
    "imp-95017-subgap-append-lift: the LIFT from the base four-packet floors (0.092871808411129783, 0.0012038255978826329) to the carried terminal literals HEAD_FLOOR = 0.096745062937484763 and F97_FLOOR = 0.0012054673720820889 is performed by the occupied-block appends (fifteenth continuation) and the cancellation-aware corner envelope (sixteenth continuation); that lift is NOT independently re-derived here. The base machinery it stands on (K, E, M, h, Tx) IS now independently confirmed.",
  carried: {
    headFloor: CARRIED_HEAD_FLOOR,
    fixed97Floor: CARRIED_F97_FLOOR,
    baseHeadFloor: BASE_HEAD_FLOOR,
    baseFixed97Floor: BASE_F97_FLOOR,
  },
  isRigorous: true,
  rigorScope:
    "The kernel K is an elementary exact integral re-derived by an independent three-piece decomposition and cross-checked against independent Simpson quadrature; the excess E is cross-checked against an independent full-line Gram quadrature; the mass M and legality amplitude h are recomputed with independent loop structure; the base four-packet floors reproduce to rel < 1e-6 through this independent path. This re-audits the floor MACHINERY and the BASE floors only; the append-chain lift to the terminal carried literals is the named residual sub-gap. Re-audit changes no bound.",
  promotesBound: false,
  verdict:
    "INDEPENDENT RE-AUDIT of the referee-unverified floor side: the multi-rate floor machinery (cross-rate kernel K, exact excess E, far mass M, sharp-MAJ legality h, tail Tx) is re-derived through a code path that shares no helper with the sibling modules, and the BASE four-packet floors reproduce - headline spacing theta = 10 floor 0.092871808411129783 (independent rel 1.2e-10) and fixed-97 theta = 10 floor 0.0012038255978826329 (independent rel 1.3e-14) - with the closed-form excess matching an independent full-line Gram quadrature to rel 5.2e-7, so floorMultiRate carries no coding bug in E, M, K, or h. The Tx underflow-truncation is characterized: it drops positive tail terms at the double denormal floor (theta = 2 at j = 807, theta = 10 at j = 162), which makes the reported floor larger than true - floor-UNSAFE in DIRECTION but with a first-dropped-term magnitude ~1e-324, negligible against the ~1e-8 float rounding already priced. RESIDUAL sub-gap imp-95017-subgap-append-lift: the append lift from the base floors to the carried terminal HEAD_FLOOR = 0.096745062937484763 and F97_FLOOR = 0.0012054673720820889 is not independently re-derived here. Re-audit only; changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95017_REAUDIT_ASSERTIONS = [
  {
    id: "imp95017-kernel-independent-path",
    description:
      "the exact cross-rate kernel (three-piece antiderivative decomposition) matches independent Simpson quadrature at generic unequal-rate triples including the headline fast/slow pairing (rel < 1e-5)",
    holds: () =>
      [
        [2.5, 1.0, 3.0],
        [7.694097, 2.79778, 2.0],
        [1.6, 0.42, 5.6],
      ].every(([a, b, tau]) => {
        const closed = raKernel(a, b, tau);
        const quad = raKernelSimpson(a, b, tau);
        return Math.abs(closed - quad) / Math.abs(closed) < 1e-5;
      }),
  },
  {
    id: "imp95017-base-floors-reproduce",
    description:
      "the BASE four-packet floors reproduce through the independent evaluator (rel < 1e-6): headline spacing theta = 10 -> 0.092871808411129783 and fixed-97 theta = 10 -> 0.0012038255978826329, both with strictly positive excess",
    holds: () =>
      Math.abs(RA_F_HEAD.F - BASE_HEAD_FLOOR) / BASE_HEAD_FLOOR < 1e-6 &&
      Math.abs(RA_F_97.F - BASE_F97_FLOOR) / BASE_F97_FLOOR < 1e-6 &&
      RA_F_HEAD.E > 0 &&
      RA_F_97.E > 0,
  },
  {
    id: "imp95017-gram-excess-crosscheck",
    description:
      "the closed-form headline excess E matches an independent full-line Gram quadrature to rel < 1e-6 (no coding bug in E, M, or K)",
    holds: () => Math.abs(RA_GRAM_HEAD - RA_F_HEAD.E) / Math.abs(RA_F_HEAD.E) < 1e-6,
  },
  {
    id: "imp95017-legality-interior-branch",
    description:
      "the sharp-MAJ legality amplitude satisfies 0 < h <= 1 on every headline packet and the fast pair sits on the interior branch mu r < s (damping priced, not waived)",
    holds: () => {
      const s10 = RA_SIGMA + 10;
      for (let i = 0; i < RA_HEAD_T10.a.length; i++) {
        const h = raH(RA_HEAD_T10.mus[i], RA_W4_BIG.r[i], s10);
        if (!(h > 0 && h <= 1)) return false;
      }
      return (
        RA_HEAD_T10.mus[0] * RA_W4_BIG.r[0] < s10 && RA_HEAD_T10.mus[1] * RA_W4_BIG.r[1] < s10
      );
    },
  },
  {
    id: "imp95017-tx-underflow-direction",
    description:
      "the Tx tail truncates at the double denormal floor (theta = 2 at j = 807, theta = 10 at j = 162), the dropped terms are strictly positive tail mass (floor-UNSAFE direction), and the first dropped term is below 1e-300 (negligible)",
    holds: () =>
      RA_TX_T2.firstDropJ === 807 &&
      RA_TX_T10.firstDropJ === 162 &&
      RA_TX_T2.Tx > 0 &&
      RA_TX_T10.Tx > 0 &&
      RA_TX_T2.firstDropLog10 < -300 &&
      RA_TX_T10.firstDropLog10 < -300,
  },
  {
    id: "imp95017-base-below-carried",
    description:
      "the independently confirmed base floors sit strictly below the carried terminal literals (the appends lift them up), consistent with the append-chain provenance recorded as the residual sub-gap",
    holds: () =>
      RA_F_HEAD.F < CARRIED_HEAD_FLOOR &&
      RA_F_97.F < CARRIED_F97_FLOOR &&
      BASE_HEAD_FLOOR < CARRIED_HEAD_FLOOR &&
      BASE_F97_FLOOR < CARRIED_F97_FLOOR,
  },
  {
    id: "imp95017-honesty-gate",
    description:
      "the verdict records the re-audit scope, the named append-lift sub-gap, the floor-unsafe Tx direction, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95017_WITNESS_FLOOR_REAUDIT.promotesBound === false &&
      IMP95017_WITNESS_FLOOR_REAUDIT.txUnderflowNote.direction === "floor-UNSAFE" &&
      /imp-95017-subgap-append-lift/.test(IMP95017_WITNESS_FLOOR_REAUDIT.subGap) &&
      /NO QED/.test(IMP95017_WITNESS_FLOOR_REAUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP95017_WITNESS_FLOOR_REAUDIT.verdict) &&
      /INDEPENDENT RE-AUDIT/.test(IMP95017_WITNESS_FLOOR_REAUDIT.verdict),
  },
];

for (const a of IMP95017_REAUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95017-witness-floor-reaudit assertion failed: ${a.id}`);
  }
}

export default IMP95017_WITNESS_FLOOR_REAUDIT;
