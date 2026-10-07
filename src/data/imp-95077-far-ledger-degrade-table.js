/**
 * imp-95077 - Row-by-row tabulation of the far-ledger DEGRADE factor across the
 * low-theta regime, at sigma = 1. Measurement only, NO QED, promotes no bound.
 *
 * CONTEXT. imp-95026-paper-packet-ceiling-transfer.js Finding 3 states that if
 * the paper packets carry the small decay the twin-ladder tail suggests
 * (theta ~ 2, s = sigma + theta ~ 3), the far coefficient cFar rises to ~0.89
 * and the ledger factor versus the pre-seventeenth 4 falls from ~14.7 to ~4.5 -
 * the far-bracket improvement survives but its quantitative margin shrinks ~3x.
 * That module baked only the two ENDPOINTS of this claim (theta = 10 -> 0.27168
 * and theta = 2 -> 0.89246 as WORST_SCANNED). This module fills in the whole
 * interior, tabulating cFar and the ledger factor 4/cFar for every integer
 * theta in {2, 3, ..., 10} at sigma = 1 (model constants beta = 1/3,
 * c = v = D = 1, isolation Q = 0.6299605249474366), so the concrete
 * transfer-margin degradation is quantified row by row rather than only at its
 * two ends.
 *
 * MACHINERY. Identical to the imp-95026 parameterized far coefficient
 * cFar = 2 (sup_b OmegaE_b) / Tx(2): midpoint quadrature (N = 200000, pad = 120)
 * of the normalized pair correlation I(T, rho) with decay exponent
 * s = sigma + theta, tail Tx(2) = sum phiTail(gSharp(j)), sup over b in 0..8.
 * A_d-free by Finding 0. The two endpoints REPRODUCE the imp-95026 baked
 * literals bit-for-bit (theta = 10 -> MODEL_CFAR_QUAD 0.2717400426244421,
 * theta = 2 -> WORST_SCANNED_CFAR 0.8924623374689161), which is the cross-check.
 *
 * WHAT THE TABLE SHOWS. cFar decreases monotonically as theta rises from 2 to 10
 * (0.8925 -> 0.2717) and the ledger factor 4/cFar rises monotonically from 4.482
 * to 14.720 - a factor 3.284 span. The degradation is smooth and convex-ish:
 * roughly half of the total ledger loss (14.72 -> ~8.34 at theta = 6) is spent
 * over the first FOUR theta steps, so the "~3x margin shrink at low theta" of
 * Finding 3 is concentrated in the theta in [2, 6] band. The far improvement
 * clears the pre-seventeenth 4 (ledger factor > 1) at every scanned theta; the
 * worst row (theta = 2) still beats 4 by 4.48x.
 *
 * SUB-GAP (inherited, honest). The actual Section 4.5 paper packet decay theta
 * is NOT pinned in this repository (imp-95026 openResiduals[0]); this table is a
 * sensitivity ROW-SCAN over the plausible low-theta neighborhood at sigma = 1,
 * not an instantiated paper number. It also does not touch the EXACT-proof break
 * boundary s* = 2.948383274238082 (imp-95026 Finding 4): rows with s < s* (only
 * theta = 2 borders it, s = 3 clears by 0.0238) still have a finite/bounded cFar
 * but would need the eighteenth-window envelope for sharpness within MAJ.
 *
 * The numerics below CROSS-CHECK the endpoints and the arithmetic ledger
 * relation; they are not the claim. Import-light (no heavy bundle). Changes no
 * bound; does NOT promote Lambda <= 0.14; NO QED; Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 */

// ── parameterized ceiling machinery (identical to imp-95026; free theta) ──────
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
  let argb = 0;
  for (let b = 0; b <= 8; b++) {
    const o = omegaE(b);
    if (o > sup) {
      sup = o;
      argb = b;
    }
  }
  return { Q, s, Tx2, sup, argb, ceiling: (2 * sup) / Tx2 };
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

// ── anchor literals shared with imp-95026 (re-derived at full N below) ─────────
const MODEL_CFAR_QUAD = 0.2717400426244421; // theta = 10, s = 11 (imp-95026)
const WORST_SCANNED_CFAR = 0.8924623374689161; // theta = 2, s = 3 (imp-95026)
const PRE17_FAR = 4; // pre-seventeenth far coefficient

// ── baked table (sigma = 1, beta = 1/3, c = v = D = 1); computed offline with
//    the machinery above at N = 200000, pad = 120; endpoints reproduce the
//    imp-95026 anchors bit-for-bit ────────────────────────────────────────────
const FAR_LEDGER_TABLE = [
  { theta: 2, s: 3, cFar: 0.8924623374689161, ledgerFactor: 4.481981851855252 },
  { theta: 3, s: 4, cFar: 0.775595275954722, ledgerFactor: 5.157328988467838 },
  { theta: 4, s: 5, cFar: 0.6606314361230662, ledgerFactor: 6.0548132911659645 },
  { theta: 5, s: 6, cFar: 0.5617660739138457, ledgerFactor: 7.120401508285909 },
  { theta: 6, s: 7, cFar: 0.4794379564963571, ledgerFactor: 8.343102471967908 },
  { theta: 7, s: 8, cFar: 0.4115506963887728, ledgerFactor: 9.719337216772406 },
  { theta: 8, s: 9, cFar: 0.3557081074842825, ledgerFactor: 11.245175231708055 },
  { theta: 9, s: 10, cFar: 0.3097239765865292, ledgerFactor: 12.914725053203941 },
  { theta: 10, s: 11, cFar: 0.2717400426244421, ledgerFactor: 14.719950587216891 },
];

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95077_FAR_LEDGER_DEGRADE_TABLE = {
  ticket:
    "imp-95077 (tabulate the far-ledger degrade factor cFar and 4/cFar across theta in {2..10} at sigma = 1 so the imp-95026 Finding 3 low-theta margin degradation is quantified row by row)",
  source:
    "imp-95026-paper-packet-ceiling-transfer.js Finding 3 (DEGRADES ~3x at low theta); Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture.",
  modelPoint: { sigma: 1, beta: "1/3", c: 1, v: 1, D: 1, Q: 0.6299605249474366 },
  table: FAR_LEDGER_TABLE,
  endpoints: {
    lowTheta: { theta: 2, s: 3, cFar: WORST_SCANNED_CFAR, ledgerFactor: 4.481981851855252 },
    highTheta: { theta: 10, s: 11, cFar: MODEL_CFAR_QUAD, ledgerFactor: 14.719950587216891 },
    ledgerFactorSpan: 3.284250377123633,
  },
  reading:
    "cFar decreases monotonically (0.8925 at theta = 2 -> 0.2717 at theta = 10) and the ledger factor 4/cFar rises monotonically (4.482 -> 14.720), a 3.284x span - so the far-bracket margin shrinks ~3x as the decay drops from the model theta = 10 to the twin-ladder-tail theta ~ 2. The far coefficient stays below the pre-seventeenth 4 (ledger factor > 1) at EVERY scanned theta; the worst row (theta = 2) still clears 4 by 4.48x. Roughly half the ledger loss is spent over theta in [2, 6], so the degradation is concentrated in the low-theta band.",
  crossCheck:
    "The two endpoints reproduce the imp-95026 baked anchors bit-for-bit (theta = 10 -> MODEL_CFAR_QUAD 0.2717400426244421; theta = 2 -> WORST_SCANNED_CFAR 0.8924623374689161), and every row satisfies ledgerFactor = 4 / cFar to machine precision.",
  openResiduals: [
    "the actual Section 4.5 paper packet decay theta is not pinned in this repository (imp-95026 openResiduals[0]); this is a row-scan over the plausible low-theta neighborhood at sigma = 1, not an instantiated paper number",
    "rows with s = sigma + theta < s* = 2.948383274238082 (imp-95026 Finding 4) would need the eighteenth-window envelope for sharpness within MAJ - only theta = 2 (s = 3) borders that boundary, clearing it by 0.0238",
  ],
  isRigorous: true,
  rigorScope:
    "MEASUREMENT: the nine-row table is computed by the same quadrature machinery as imp-95026 and its endpoints reproduce that module's baked anchors to machine precision. No paper constant is instantiated, so no transferred ceiling is CLAIMED - only the row-by-row degradation of the ledger factor across theta at sigma = 1 is tabulated. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT tabulation of the imp-95026 Finding 3 far-ledger degradation. Across theta in {2..10} at sigma = 1 the far coefficient cFar falls monotonically 0.8925 -> 0.2717 and the ledger factor 4/cFar rises monotonically 4.482 -> 14.720 (span 3.284x), quantifying the ~3x low-theta margin shrink row by row. The far coefficient stays strictly below the pre-seventeenth 4 at every scanned theta (worst row theta = 2 still clears 4 by 4.48x). Endpoints reproduce the imp-95026 anchors bit-for-bit. SUB-GAP: the paper theta is not pinned in this repo, so this is a row-scan not a single instantiated number. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95077_DEGRADE_ASSERTIONS = [
  {
    id: "imp95077-endpoints-reproduce-imp95026-anchors",
    heavy: true, // N = 200000 quadrature re-derivation; skipped at browser import (see loop below)
    description:
      "the theta = 10 and theta = 2 rows re-derive at full N (200000) to the imp-95026 baked anchors MODEL_CFAR_QUAD and WORST_SCANNED_CFAR to 1e-12 relative, and the baked table endpoints match those anchors bit-for-bit",
    holds: () => {
      const hi = farCoefficient(1, 1 / 3, 1, 1, 1, 10);
      const lo = farCoefficient(1, 1 / 3, 1, 1, 1, 2);
      return (
        Math.abs(hi.ceiling - MODEL_CFAR_QUAD) <= 1e-12 * MODEL_CFAR_QUAD &&
        Math.abs(lo.ceiling - WORST_SCANNED_CFAR) <= 1e-12 * WORST_SCANNED_CFAR &&
        FAR_LEDGER_TABLE[FAR_LEDGER_TABLE.length - 1].cFar === MODEL_CFAR_QUAD &&
        FAR_LEDGER_TABLE[0].cFar === WORST_SCANNED_CFAR
      );
    },
  },
  {
    id: "imp95077-ledger-factor-arithmetic",
    description:
      "every baked row satisfies ledgerFactor = 4 / cFar to machine precision and lists s = 1 + theta",
    holds: () =>
      FAR_LEDGER_TABLE.every(
        (row) =>
          Math.abs(row.ledgerFactor - PRE17_FAR / row.cFar) <= 1e-12 * row.ledgerFactor &&
          row.s === 1 + row.theta,
      ),
  },
  {
    id: "imp95077-monotone-degradation",
    description:
      "cFar is strictly decreasing and the ledger factor 4/cFar strictly increasing across theta = 2..10; every row clears the pre-seventeenth 4 (ledgerFactor > 1); the endpoint span is 3.284x",
    holds: () => {
      for (let i = 1; i < FAR_LEDGER_TABLE.length; i++) {
        if (FAR_LEDGER_TABLE[i].cFar >= FAR_LEDGER_TABLE[i - 1].cFar) return false;
        if (FAR_LEDGER_TABLE[i].ledgerFactor <= FAR_LEDGER_TABLE[i - 1].ledgerFactor) return false;
      }
      if (!FAR_LEDGER_TABLE.every((row) => row.ledgerFactor > 1)) return false;
      const span =
        FAR_LEDGER_TABLE[FAR_LEDGER_TABLE.length - 1].ledgerFactor / FAR_LEDGER_TABLE[0].ledgerFactor;
      return Math.abs(span - 3.284250377123633) <= 1e-9;
    },
  },
  {
    id: "imp95077-honesty-gate",
    description:
      "the verdict names the sub-gap (paper theta not pinned; row-scan not a single number), promotes no bound, NO QED, PT stays SOTA",
    holds: () =>
      IMP95077_FAR_LEDGER_DEGRADE_TABLE.promotesBound === false &&
      IMP95077_FAR_LEDGER_DEGRADE_TABLE.openResiduals.length === 2 &&
      /NO QED/.test(IMP95077_FAR_LEDGER_DEGRADE_TABLE.verdict) &&
      /remains SOTA/.test(IMP95077_FAR_LEDGER_DEGRADE_TABLE.verdict) &&
      /MEASUREMENT/.test(IMP95077_FAR_LEDGER_DEGRADE_TABLE.verdict),
  },
];

// The heavy (quadrature re-derivation) assertions take tens of seconds; at browser import they
// blanked /permutation-architecture for 25-50 s. They are skipped only in the browser: the node
// assertion harness (scripts/run-assertions.mjs) runs every entry of the exported array, and the
// cheap assertions (honesty gate, closed-form checks) still self-execute everywhere.
const SKIP_HEAVY_AT_IMPORT = typeof window !== 'undefined';
for (const a of IMP95077_DEGRADE_ASSERTIONS) {
  if (a.heavy && SKIP_HEAVY_AT_IMPORT) continue;
  if (!a.holds()) {
    throw new Error(`imp-95077-far-ledger-degrade-table assertion failed: ${a.id}`);
  }
}

export default IMP95077_FAR_LEDGER_DEGRADE_TABLE;
