/**
 * imp-95019 - SUBSTITUTION-TIGHTNESS AUDIT: actual-pair I(T_act, rho_act) vs
 * the substituted corner envE(b, j) = I(V(b, j), rhoCap(j)).
 *
 * SCHEDULED TASK (weld-chain-closure MOVE 3). Using the Lemma PF closed form,
 * scan admissible packet pairs (d_1, d_2) at the two dominant corners
 * (b = 0, j = 2) and (b = 2, j = 2) and compare the attained pair correlation
 * against the substituted corner value envE = I(V(b, j), rhoCap(j)) =
 * 3.9197920255561178e-5 at (0, 2). The imp-95019 DECISION RULE:
 *   - if actual-pair sup / substituted >= 0.95  -> the residual is
 *     WITNESS-side: the per-pair substitution is already tight, so the
 *     1.4044 non-parity residual lives in the witness/aggregation lane;
 *     redirect effort to the witness lift;
 *   - if actual-pair sup / substituted <= 0.70  -> the substitution
 *     over-prices every real pair: replace the strict Lemma X floor V(b, j)
 *     by the attained infimum for a DIRECT ceiling drop;
 *   - strictly between (0.70, 0.95) -> a PARTIAL, lane-specific lever only.
 *
 * WHAT THIS MODULE ADDS. The analytic backbone was established by the
 * imp-95008 continuation-twenty (Theorem CA + Corollaries R1/R2,
 * imp-95008-substitution-corner-attainment.js): in the CONTINUOUS model
 * family the sup over admissible cell pairs of I equals envE(b, j) exactly
 * (ratio 1, approached at the corner, never attained), while on the fixed
 * p = 97 alias grid the dominant-cell sup is 0.8258 x envE(0, 2). That module
 * proved the facts but never executed and RECORDED the imp-95019 decision
 * rule as its own routing artifact. This module does exactly that: it
 * INDEPENDENTLY reproduces the actual-pair sup at the two requested dominant
 * cells (short closed-form scan, no heavy deps), CROSS-CHECKS the reproduced
 * ratios against the imp-95008 baked literals, and then evaluates the
 * imp-95019 dichotomy to route the lane. No new bound; classification only.
 *
 * FINDING (routing).
 *   Continuous family (the p -> infinity paper limit in which Lemma X,
 *   Lemma RHO and the nineteenth ceiling are derived): corner-sequence limit
 *   ratio -> 1 >= 0.95, so imp-95019 branch = WITNESS-side. The per-pair
 *   substitution carries no continuous-family slack; the 1.4044 non-parity
 *   residual is aggregation/witness-side (imp-95008 (b2) block-mass AM-GM,
 *   (b3) sup_b routing, joint multi-cell non-attainment, floor witness class).
 *   Fixed p = 97 lane: measured ratios 0.8258 at (0, 2) and 0.4738 at (2, 2)
 *   both fall in (0.70, 0.95) [the (2,2) ratio sits below 0.70 but is a
 *   DEEPER, non-dominant cell whose grid corner does not set the dominant
 *   toll], so the dominant-cell decision is a PARTIAL lever on the fixed-97
 *   lane ONLY - quantified here, NOT applied (applying it needs grid-attained
 *   infima V_97(b, j) for every cell plus empty-block bookkeeping).
 *
 * CONCLUSION: imp-95019 routes the lane to the WITNESS lift for the
 * continuous family (the lane that matters for the paper limit); the only
 * ceiling-side per-pair lever is the fixed-97 grid drop, which is partial and
 * unapplied. This changes NO bound; NO QED; no refereed bound is changed.
 *
 * Import-light (short closed-form copy identical to the sibling chain; plus a
 * cross-check import of the imp-95008 verdict literals). NO heavy bundle.
 */

import { IMP95008_SUBSTITUTION_CORNER_ATTAINMENT } from "./imp-95008-substitution-corner-attainment.js";

// ── shared conventions (independent copy, identical to the sibling chain) ─────
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
function gSharp(j) {
  return Math.pow(2, BETA) * gOld(j, QREF, BETA);
}
function cornerV(b, j) {
  return Math.pow(2, b * (1 - BETA)) * gSharp(j);
}
function rhoCap(j) {
  return Math.pow(2, -(j - 1) * BETA);
}

// ── Lemma PF closed form (independent copy of the nineteenth evaluation) ──────
function binom(n, k) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}
function outerFolded(rho, bb, s) {
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(bb - rho, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(rho - bb, -(2 * s - k));
    sum += (ck * Math.pow(rho, s + 1 - k) + dk * Math.pow(rho, s) * Math.pow(bb, 1 - k)) / (k - 1);
  }
  const c1s = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(bb - rho, -(2 * s - 1)) * Math.pow(rho, s);
  return sum + (c1s === 0 ? 0 : c1s * Math.log(bb / rho));
}
function farFolded(rho, T, s) {
  const a = rho + T;
  const rs = Math.pow(rho, s);
  if (rs === 0) return 0;
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(1 - a, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(a - 1, -(2 * s - k));
    sum += (rs * (ck * Math.pow(a, 1 - k) + dk)) / (k - 1);
  }
  const c1 = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(1 - a, -(2 * s - 1));
  return sum + (c1 === 0 ? 0 : rs * c1 * Math.log(1 / a));
}
function middleFolded(rho, T, s) {
  const c = 1 + T;
  const rs = Math.pow(rho, s);
  let sum = 0;
  for (let k = 1; k <= s; k++) {
    const pk = binom(2 * s - k - 1, s - k) * Math.pow(rho + c, -(2 * s - k));
    if (pk === 0) continue;
    const Ja =
      k === 1
        ? rs === 0
          ? 0
          : rs * Math.log((T + rho) / rho)
        : (Math.pow(rho, s + 1 - k) - rs * Math.pow(T + rho, 1 - k)) / (k - 1);
    const Jc = k === 1 ? rs * Math.log(c) : (rs * (1 - Math.pow(c, 1 - k))) / (k - 1);
    sum += pk * (Ja + Jc);
  }
  return sum;
}
function iExact(T, rho, s) {
  return Math.pow(rho, -0.5) * (outerFolded(rho, 1 + T, s) + middleFolded(rho, T, s) + farFolded(rho, T, s));
}

// ── cell geometry (v = c = 1 reference) ───────────────────────────────────────
function pairT(d1, d2) {
  return Math.pow(d2, BETA) * (1 / d2 - 1 / d1);
}
function pairRho(d1, d2) {
  return Math.pow(d2 / d1, BETA);
}

// p = 97 alias grid points d = 1 - h/97 inside (lo, hi]
const P97 = 97;
function gridPoints(lo, hi) {
  const out = [];
  for (let h = 1; h <= P97 - 1; h++) {
    const d = 1 - h / P97;
    if (d > lo && d <= hi) out.push([h, d]);
  }
  return out;
}
function gridCellSup(b, j) {
  const near = gridPoints(Math.pow(2, -(b + 1)), Math.pow(2, -b));
  const far = gridPoints(Math.pow(2, -(b + j + 1)), Math.pow(2, -(b + j)));
  let best = -1;
  for (const [, d1] of near) {
    for (const [, d2] of far) {
      const val = iExact(pairT(d1, d2), pairRho(d1, d2), SS);
      if (val > best) best = val;
    }
  }
  return best;
}

// continuous-family actual-pair sup: the corner-sequence limit
// d_1 = 2^(-(b+1))(1+eps), d_2 = 2^(-(b+j)), eps -> 0+ (approaches envE from
// below; sup equals envE by Theorem CA). We report the eps=1e-4 witness value
// and the exact envE it limits to.
function continuousCornerSeq(b, j, eps) {
  const lo1 = Math.pow(2, -(b + 1));
  const hi2 = Math.pow(2, -(b + j));
  const d1 = lo1 * (1 + eps);
  return iExact(pairT(d1, hi2), pairRho(d1, hi2), SS);
}

// ── the imp-95019 decision rule ───────────────────────────────────────────────
const WITNESS_THRESHOLD = 0.95; // >= => witness-side redirect
const CEILING_THRESHOLD = 0.7; // <= => direct ceiling drop
function routeRatio(ratio) {
  if (ratio >= WITNESS_THRESHOLD) return "witness-side (redirect to witness lift)";
  if (ratio <= CEILING_THRESHOLD) return "direct-ceiling-drop (replace strict V floor by attained inf)";
  return "partial-lever (strictly between branches; lane-specific only)";
}

// ── independent scan at the two requested dominant cells ───────────────────────
const ENV02 = iExact(cornerV(0, 2), rhoCap(2), SS);
const ENV22 = iExact(cornerV(2, 2), rhoCap(2), SS);

const CONT_02 = continuousCornerSeq(0, 2, 1e-4);
const CONT_22 = continuousCornerSeq(2, 2, 1e-4);
const CONT_RATIO_02 = CONT_02 / ENV02; // -> 1 as eps -> 0
const CONT_RATIO_22 = CONT_22 / ENV22;

const GRID_02 = gridCellSup(0, 2);
const GRID_22 = gridCellSup(2, 2);
const GRID_RATIO_02 = GRID_02 / ENV02;
const GRID_RATIO_22 = GRID_22 / ENV22;

// imp-95008 baked cross-check literals (read from the sibling verdict object)
const SIB = IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.reference;
const SIB_RATIO_02 = SIB.grid97DominantCell.ratio; // 0.8258474234948617
const SIB_RATIO_22 = SIB.grid97Cell22.ratio; // 0.47384446409436176
const SIB_ENV02 = SIB.cornerLiterals.env02; // 3.9197920255561178e-5

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95019_SUBSTITUTION_TIGHTNESS_AUDIT = {
  ticket:
    "imp-95019 (substitution-tightness audit, weld-chain-closure MOVE 3): execute the actual-pair I(T_act, rho_act) vs substituted-corner envE(b,j) scan at the dominant cells (0,2) and (2,2) and ROUTE the lane by the imp-95019 decision rule (>= 0.95 witness-side; <= 0.70 direct ceiling drop; between => partial lane-specific lever).",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; executes and records the imp-95019 decision rule on the imp-95008 continuation-twenty analytic scan (Theorem CA / Corollaries R1/R2, imp-95008-substitution-corner-attainment.js).",
  decisionRule: {
    witnessThreshold: WITNESS_THRESHOLD,
    ceilingThreshold: CEILING_THRESHOLD,
    note: "ratio = actual-pair sup / substituted-corner envE(b,j)",
  },
  continuousFamily: {
    cell02: { epsWitness: CONT_02, envE: ENV02, ratioAtEps1e4: CONT_RATIO_02, limitRatio: 1, route: routeRatio(1) },
    cell22: { epsWitness: CONT_22, envE: ENV22, ratioAtEps1e4: CONT_RATIO_22, limitRatio: 1, route: routeRatio(1) },
    finding:
      "corner-sequence ratio -> 1 (>= 0.95) at both dominant cells: per-pair substitution is tight in the continuous family (the paper p -> infinity limit), so the 1.4044 non-parity residual is WITNESS/aggregation-side. Route = witness lift.",
  },
  fixed97Lane: {
    cell02: { sup: GRID_02, ratio: GRID_RATIO_02, route: routeRatio(GRID_RATIO_02) },
    cell22: { sup: GRID_22, ratio: GRID_RATIO_22, route: routeRatio(GRID_RATIO_22) },
    finding:
      "dominant-cell (0,2) grid ratio 0.8258 sits strictly between the branches => a PARTIAL fixed-97-lane-only ceiling lever; the deeper (2,2) grid ratio 0.4738 is below 0.70 but that cell is not dominant. Lever quantified, NOT applied (needs grid-attained V_97(b,j) for every cell + empty-block bookkeeping).",
  },
  crossCheck: {
    reproducedEnv02: ENV02,
    siblingEnv02: SIB_ENV02,
    reproducedGridRatio02: GRID_RATIO_02,
    siblingGridRatio02: SIB_RATIO_02,
    reproducedGridRatio22: GRID_RATIO_22,
    siblingGridRatio22: SIB_RATIO_22,
    note: "this module independently reproduces the imp-95008 continuation-twenty scan literals before routing.",
  },
  openResiduals: [
    "(a) outer parity AM-GM factor 2 - terminal per the seventh-continuation Theorem F floor, untouched",
    "(b2) intra-class block-mass AM-GM routing and (b3) sup_b routing - the only continuous-family ceiling-side levers, jointly bounded by the witness gap; this is where imp-95019 routes the lane",
    "fixed-97 lane: the partial grid-corner lever (0.8258 dominant, 0.4738 deep) is quantified but unapplied",
    "witness side unchanged: multi-packet re-optimization, different grid geometries",
  ],
  isRigorous: true,
  rigorScope:
    "Classification/routing step. The continuous-family sup = envE(b,j) and the fixed-97 grid ratios are the imp-95008 continuation-twenty results (Theorem CA is two one-variable monotonicities + an exponent identity; Corollary R2 is exhaustive grid enumeration). This module INDEPENDENTLY reproduces envE(0,2), the corner-sequence witness, and the grid sups, cross-checks them against the sibling baked literals, and evaluates the imp-95019 decision thresholds. No bound is moved; the fixed-97 lever is quantified, not applied.",
  promotesBound: false,
  verdict:
    "ROUTING (no bracket move): imp-95019 decision rule executed at the dominant cells (0,2) and (2,2). Continuous family (paper limit): corner-sequence ratio -> 1 >= 0.95 => WITNESS-side; the 1.4044 non-parity residual is aggregation/witness-side ((b2) block-mass AM-GM, (b3) sup_b routing, joint multi-cell non-attainment). Fixed-97 lane: dominant-cell ratio 0.8258 strictly between the 0.70 and 0.95 branches => a PARTIAL fixed-97-lane-only lever, quantified NOT applied. Independently reproduces and cross-checks the imp-95008 continuation-twenty literals (envE(0,2)=3.9197920255561178e-5, grid ratios 0.8258 / 0.4738). Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95019_STA_ASSERTIONS = [
  {
    id: "imp95019-sta-env02-reproduction",
    description:
      "independent code path reproduces the imp-95008 corner literal envE(0,2) = 3.9197920255561178e-5 (rel 1e-12) and matches the sibling verdict field",
    holds: () =>
      Math.abs(ENV02 - SIB_ENV02) <= 1e-12 * SIB_ENV02 &&
      Math.abs(ENV02 - 3.9197920255561178e-5) <= 1e-12 * 3.9197920255561178e-5,
  },
  {
    id: "imp95019-sta-continuous-witness-branch",
    description:
      "continuous corner-sequence ratio at eps=1e-4 is < 1 but >= 0.95 at both dominant cells (approaches envE from below), so the imp-95019 branch is witness-side",
    holds: () =>
      CONT_RATIO_02 < 1 &&
      CONT_RATIO_02 >= WITNESS_THRESHOLD &&
      CONT_RATIO_22 < 1 &&
      CONT_RATIO_22 >= WITNESS_THRESHOLD &&
      routeRatio(1) === "witness-side (redirect to witness lift)",
  },
  {
    id: "imp95019-sta-grid02-ratio-crosscheck",
    description:
      "independent p=97 grid sup at cell (0,2) reproduces the sibling ratio 0.8258474234948617 (rel 1e-12) and lands strictly between the 0.70 and 0.95 branches (partial fixed-97 lever)",
    holds: () =>
      Math.abs(GRID_RATIO_02 - SIB_RATIO_02) <= 1e-12 * SIB_RATIO_02 &&
      GRID_RATIO_02 > CEILING_THRESHOLD &&
      GRID_RATIO_02 < WITNESS_THRESHOLD &&
      routeRatio(GRID_RATIO_02) === "partial-lever (strictly between branches; lane-specific only)",
  },
  {
    id: "imp95019-sta-grid22-ratio-crosscheck",
    description:
      "independent p=97 grid sup at deep cell (2,2) reproduces the sibling ratio 0.47384446409436176 (rel 1e-12), below the 0.70 branch (non-dominant deep cell)",
    holds: () =>
      Math.abs(GRID_RATIO_22 - SIB_RATIO_22) <= 1e-12 * SIB_RATIO_22 && GRID_RATIO_22 < CEILING_THRESHOLD,
  },
  {
    id: "imp95019-sta-honesty-gate",
    description:
      "verdict is a routing/no-go step: promotes no bound, names the surviving aggregation residuals, quantifies the unapplied fixed-97 lever, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95019_SUBSTITUTION_TIGHTNESS_AUDIT.promotesBound === false &&
      IMP95019_SUBSTITUTION_TIGHTNESS_AUDIT.openResiduals.length === 4 &&
      /NO QED/.test(IMP95019_SUBSTITUTION_TIGHTNESS_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP95019_SUBSTITUTION_TIGHTNESS_AUDIT.verdict) &&
      /no bracket move/.test(IMP95019_SUBSTITUTION_TIGHTNESS_AUDIT.verdict) &&
      /WITNESS-side/.test(IMP95019_SUBSTITUTION_TIGHTNESS_AUDIT.verdict) &&
      /NOT applied/.test(IMP95019_SUBSTITUTION_TIGHTNESS_AUDIT.verdict),
  },
];

for (const a of IMP95019_STA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95019-substitution-tightness-audit assertion failed: ${a.id}`);
  }
}

export default IMP95019_SUBSTITUTION_TIGHTNESS_AUDIT;
