/**
 * imp-95114 - FULL APPLIED FIXED-97 GRID-CORNER CEILING LEVER: grid-attained
 * infima V_97(b, j) across ALL admissible cells + empty-block bookkeeping.
 * MEASUREMENT ONLY; no bound change; NO QED.
 *
 * CONTEXT. imp-95090 measured the finite-rate per-pair attainment shortfall
 * only at the dominant cell (0, 2) (0.1742) and the deep cell (2, 2) (0.5262),
 * and its openResiduals[0] flagged the grid-corner ceiling LEVER as
 * "quantified but NOT applied - needs grid-attained infima V_97(b, j) for every
 * cell plus empty-block bookkeeping". This module measures V_97(b, j) for the
 * FULL admissible cell set at the fixed p = 97 alias grid, assembles the
 * empty-block bookkeeping, and reports the AGGREGATE applied grid-corner ceiling
 * reduction (a conservative envE-based ceiling replaced by the grid-attained
 * one) versus the current envE ceiling - so the dominant-cell 0.1742 is placed
 * against the fully-assembled lever. Still a measurement: envE(b, j) remains a
 * valid per-pair upper bound and no bracket moves.
 *
 * WHAT IS ASSEMBLED. The roll-up ceiling sums one per-cell envelope toll
 * envE(b, j) = I(V(b, j), rhoCap(j)) over the cross-block cells (b >= 0,
 * j >= 2). The grid-corner lever replaces envE(b, j) by the p = 97
 * grid-attained sup V_97(b, j) = max over admissible grid pairs (d_1 in block
 * b, d_2 in block b + j; d = 1 - h/97) of the exact pair correlation I(T, rho).
 * A cell is EMPTY when block b or block b + j carries no p = 97 grid point (at
 * p = 97 only blocks b = 0..6 are populated: counts 48, 24, 12, 6, 3, 2, 1;
 * b >= 7 is empty). Empty cells realize NOTHING on the grid - V_97 = 0 there -
 * so they contribute their full envE to the lever (100 pct shortfall). The
 * applied ceiling is C_grid = sum over NON-EMPTY cells of V_97(b, j); the
 * current ceiling is C_env = sum over ALL cells of envE(b, j); the aggregate
 * applied lever is 1 - C_grid / C_env.
 *
 * MEASURED FINDINGS (reference conventions v = c = D = 1, beta = 1/3, sigma = 1,
 * theta = 10, s = 11; p = 97 alias grid; cell scan b, j <= 40 - the envE tail
 * beyond is < 1e-15 of the total).
 *   (1) NON-EMPTY CELL SET. At p = 97 exactly 15 cross-block cells are
 *       non-empty (both blocks populated): b + j <= 6, i.e. (0, 2..6),
 *       (1, 2..5), (2, 2..4), (3, 2..3), (4, 2). Every deeper cell is empty.
 *   (2) CEILING MASS CONCENTRATION. The dominant cell (0, 2) carries
 *       envE(0, 2) = 3.9197920255561178e-5 out of the total C_env =
 *       4.074591641273443e-5, i.e. 96.20 pct of the whole envE ceiling. The
 *       grid-corner lever is therefore PINNED near the dominant-cell shortfall.
 *   (3) FULL APPLIED LEVER. C_grid = 3.34266703344263e-5, so the aggregate
 *       applied grid-corner lever is 1 - C_grid / C_env = 0.17963140168865188
 *       (17.96 pct). It EXCEEDS the dominant-cell 0.17415257650513827 by
 *       0.005478825183513614 (0.55 pct point): the deeper and grid-edge cells,
 *       all of which under-realize MORE than the dominant cell (shortfalls
 *       0.11..0.99, e.g. (2, 2) 0.5262, (3, 2) 0.7513, (4, 2) 0.9992), pull the
 *       aggregate slightly above 0.1742 - but only slightly, because (0, 2)
 *       holds 96 pct of the mass.
 *   (4) EMPTY-BLOCK BOOKKEEPING IS NEGLIGIBLE. The empty cells (b + j >= 7)
 *       carry a combined envE mass fraction of only 1.5803760529118363e-9 of
 *       C_env, so removing them (V_97 = 0) changes the lever in the ninth
 *       decimal: non-empty-only lever 0.17963140039216097 vs full lever
 *       0.17963140168865188. The full applied lever is essentially the
 *       non-empty aggregate; the empty tail is not a material contributor.
 *
 * ANSWER TO THE POSED QUESTION. YES - the full applied fixed-97 grid-corner
 * lever (0.17963) exceeds the dominant-cell 0.17415, but marginally (+0.55 pct
 * point). The dominant cell (0, 2) carries 96.2 pct of the envE ceiling, so the
 * aggregate is pinned near its shortfall; the many deeper/edge cells all
 * under-realize more, nudging the aggregate up, while the empty-block
 * bookkeeping is negligible (mass fraction 1.6e-9). The lever remains a
 * fixed-97-lane, UNAPPLIED conservative-ceiling slack - no bracket moves.
 *
 * ROUTING CONSEQUENCE (unchanged from imp-95008 / imp-95090). The measured
 * aggregate is a fixed-97-lane quantity: the envE-based ceiling is CONSERVATIVE
 * for the exhibited p = 97 witness by ~17.96 pct across the assembled cells (vs
 * ~17.42 pct read off the single dominant cell). In the continuous family the
 * shortfall vanishes (imp-95019 ratio -> 1) and the residual is
 * witness/aggregation-side. NO bracket is moved; envE remains a valid per-pair
 * upper bound.
 *
 * Import-light: an independent closed-form copy identical to the sibling chain,
 * cross-checked against the imp-95008 continuation-twenty baked literals. NO
 * heavy bundle. Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 */

import { IMP95008_SUBSTITUTION_CORNER_ATTAINMENT } from "./imp-95008-substitution-corner-attainment.js";

// -- shared conventions (independent copy, identical to the sibling chain) -----
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

// -- Lemma PF closed form (independent copy of the nineteenth evaluation) ------
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

// -- cell geometry (v = c = 1 reference) ---------------------------------------
function pairT(d1, d2) {
  return Math.pow(d2, BETA) * (1 / d2 - 1 / d1);
}
function pairRho(d1, d2) {
  return Math.pow(d2 / d1, BETA);
}
function envE(b, j) {
  return iExact(cornerV(b, j), rhoCap(j), SS);
}

// -- p = 97 alias grid ---------------------------------------------------------
const P97 = 97;
function gridPointsP(lo, hi) {
  const out = [];
  for (let h = 1; h <= P97 - 1; h++) {
    const d = 1 - h / P97;
    if (d > lo && d <= hi) out.push(d);
  }
  return out;
}
// grid-attained sup V_97(b, j); returns 0 with empty flag when either block
// carries no grid point (empty-block bookkeeping)
function gridAttained(b, j) {
  const near = gridPointsP(Math.pow(2, -(b + 1)), Math.pow(2, -b));
  const far = gridPointsP(Math.pow(2, -(b + j + 1)), Math.pow(2, -(b + j)));
  if (near.length === 0 || far.length === 0) {
    return { V97: 0, empty: true, nearCount: near.length, farCount: far.length };
  }
  let best = -1;
  for (const d1 of near) {
    for (const d2 of far) {
      const val = iExact(pairT(d1, d2), pairRho(d1, d2), SS);
      if (val > best) best = val;
    }
  }
  return { V97: best, empty: false, nearCount: near.length, farCount: far.length };
}

// -- assemble the full cell scan -----------------------------------------------
const BMAX = 40;
const JMAX = 40;
let CENV_ALL = 0; // sum envE over all cells (current envE ceiling)
let CENV_NONEMPTY = 0; // sum envE over non-empty cells
let CGRID = 0; // sum V_97 over non-empty cells (applied grid-corner ceiling)
const NONEMPTY_CELLS = [];
for (let b = 0; b <= BMAX; b++) {
  for (let j = 2; j <= JMAX; j++) {
    const e = envE(b, j);
    CENV_ALL += e;
    const g = gridAttained(b, j);
    if (!g.empty) {
      CENV_NONEMPTY += e;
      CGRID += g.V97;
      NONEMPTY_CELLS.push({ b, j, envE: e, V97: g.V97, shortfall: 1 - g.V97 / e });
    }
  }
}

const APPLIED_LEVER_FULL = 1 - CGRID / CENV_ALL; // includes empty-block bookkeeping
const APPLIED_LEVER_NONEMPTY = 1 - CGRID / CENV_NONEMPTY; // non-empty cells only
const EMPTY_MASS_FRACTION = (CENV_ALL - CENV_NONEMPTY) / CENV_ALL;
const DOMINANT_SHORTFALL = 0.17415257650513827; // imp-95090 dominant-cell (0,2)
const LEVER_MARGIN = APPLIED_LEVER_FULL - DOMINANT_SHORTFALL;

// -- imp-95008 baked cross-check literals --------------------------------------
const SIB = IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.reference;
const SIB_ENV02 = SIB.cornerLiterals.env02; // 3.9197920255561178e-5
const SIB_RATIO_02 = SIB.grid97DominantCell.ratio; // 0.8258474234948617
const ENV02_LOCAL = envE(0, 2);
const DOMINANT_MASS_FRACTION = ENV02_LOCAL / CENV_ALL;

// -- verdict object ------------------------------------------------------------
export const IMP95114_GRID_ATTAINED_CEILING_LEVER = {
  ticket:
    "imp-95114 (numerical): measure the grid-attained infima V_97(b,j) across ALL admissible cells at the fixed p = 97 alias grid, assemble the empty-block bookkeeping, and report the FULL applied grid-corner ceiling reduction (envE-based ceiling replaced by the grid-attained one) versus the current envE ceiling - resolving the imp-95090 openResiduals[0] unapplied lever. Measurement only; NO QED; no bound change.",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; consumes imp-95008 continuation-twenty (Theorem CA / Corollary R2, imp-95008-substitution-corner-attainment.js) and the imp-95090 finite-rate shortfall; assembles the per-cell grid infima into the full applied lever.",
  parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA, s: SS, p: P97, scan: { bMax: BMAX, jMax: JMAX } },
  cellSet: {
    numNonEmpty: NONEMPTY_CELLS.length,
    condition: "a cell (b,j) is non-empty at p=97 iff both blocks b and b+j carry a grid point, i.e. b+j <= 6 (blocks 0..6 populated with 48,24,12,6,3,2,1 points)",
    cells: NONEMPTY_CELLS.map((c) => ({ b: c.b, j: c.j, envE: c.envE, V97: c.V97, shortfall: c.shortfall })),
  },
  ceilingMass: {
    cEnvAll: CENV_ALL,
    cEnvNonEmpty: CENV_NONEMPTY,
    cGrid: CGRID,
    dominantMassFraction: DOMINANT_MASS_FRACTION,
    note: "the dominant cell (0,2) carries 96.20 pct of the whole envE ceiling, so the aggregate grid-corner lever is pinned near its shortfall.",
  },
  appliedLever: {
    full: APPLIED_LEVER_FULL,
    nonEmptyOnly: APPLIED_LEVER_NONEMPTY,
    dominantCellShortfall: DOMINANT_SHORTFALL,
    marginOverDominant: LEVER_MARGIN,
    emptyMassFraction: EMPTY_MASS_FRACTION,
    exceedsDominant: APPLIED_LEVER_FULL > DOMINANT_SHORTFALL,
    note: "the full applied lever 0.17963 EXCEEDS the dominant-cell 0.17415 by 0.00548 (0.55 pct point); the deeper/edge cells all under-realize more and pull the aggregate up, but only slightly since (0,2) holds 96 pct of the mass. Empty-block bookkeeping is negligible (mass fraction 1.6e-9).",
  },
  routingConsequence:
    "the assembled aggregate is a fixed-97-lane quantity: the envE-based ceiling is CONSERVATIVE for the exhibited p=97 witness by ~17.96 pct across the assembled cells (vs ~17.42 pct read off the single dominant cell). In the continuous family the shortfall vanishes (imp-95019 ratio -> 1) and the residual is witness/aggregation-side. NO bracket moved; envE remains a valid per-pair upper bound.",
  openResiduals: [
    "the FULL fixed-97 grid-corner ceiling lever is now assembled and quantified (0.17963, marginally above the dominant-cell 0.1742) but still NOT APPLIED - it remains a fixed-97-lane conservative-ceiling slack; applying it would move only the fixed-97 lane, not the continuous-family headline",
    "(b2) intra-class block-mass AM-GM routing and (b3) sup_b routing - the continuous-family ceiling-side levers, unchanged",
    "(a) outer parity AM-GM factor 2 - terminal per the seventh-continuation Theorem F floor, untouched",
    "witness side unchanged: multi-packet re-optimization, different grid geometries",
  ],
  isRigorous: true,
  rigorScope:
    "Measurement step. Each V_97(b,j) is an exact finite enumeration over the p=97 admissible grid pairs; envE(b,j) = I(V(b,j), rhoCap(j)) is reproduced by an independent closed-form copy and cross-checked against the imp-95008 continuation-twenty baked literal envE(0,2) = 3.9197920255561178e-5 (rel 1e-12). The aggregate sums are truncated at b,j <= 40; the omitted envE tail is < 1e-15 of C_env (geometric decay in both b and j), far below the reported precision. Every non-empty-cell iExact evaluation has T >= V(0,2) = 1.26, outside the recorded small-T conditioning trap. The lever quantifies conservatism of the envE ceiling for the fixed-97 witness; it moves no bound and envE remains a valid per-pair upper bound.",
  promotesBound: false,
  verdict:
    "MEASUREMENT (no bracket move): the FULL applied fixed-97 grid-corner ceiling lever is assembled from the grid-attained infima V_97(b,j) over all 15 non-empty cells plus empty-block bookkeeping. C_grid = 3.34266703344263e-5 vs the current envE ceiling C_env = 4.074591641273443e-5 gives an aggregate applied lever 1 - C_grid/C_env = 0.17963140168865188 (17.96 pct), which EXCEEDS the imp-95090 dominant-cell 0.17415257650513827 by 0.005478825183513614 (0.55 pct point). The excess is small because the dominant cell (0,2) carries 96.20 pct of the envE ceiling mass, pinning the aggregate near its shortfall; the deeper and grid-edge cells (shortfalls 0.11..0.9992) pull it marginally higher. Empty-block bookkeeping is negligible: the empty cells (b+j >= 7) carry mass fraction 1.5803760529118363e-9, so the non-empty-only lever 0.17963140039216097 agrees with the full lever to the ninth decimal. Independently reproduces and cross-checks the imp-95008 continuation-twenty envE(0,2) literal. The lever is a fixed-97-lane, UNAPPLIED conservative-ceiling slack: it moves no bracket. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) ---------------------------
export const IMP95114_GACL_ASSERTIONS = [
  {
    id: "imp95114-gacl-env02-reproduction",
    description:
      "independent code path reproduces the imp-95008 corner literal envE(0,2) = 3.9197920255561178e-5 (rel 1e-12) before any aggregate is quoted against it",
    holds: () =>
      Math.abs(ENV02_LOCAL - SIB_ENV02) <= 1e-12 * SIB_ENV02 &&
      Math.abs(ENV02_LOCAL - 3.9197920255561178e-5) <= 1e-12 * 3.9197920255561178e-5,
  },
  {
    id: "imp95114-gacl-nonempty-cell-count",
    description:
      "exactly 15 cross-block cells are non-empty at p=97 (both blocks populated, b+j <= 6); the max-envE cell is the dominant (0,2), which carries 96.20 pct of the total envE ceiling",
    holds: () => {
      if (NONEMPTY_CELLS.length !== 15) return false;
      let mx = -1;
      let mxCell = null;
      for (const c of NONEMPTY_CELLS) {
        if (c.envE > mx) {
          mx = c.envE;
          mxCell = c;
        }
        if (!(c.b + c.j <= 6)) return false;
      }
      if (!(mxCell.b === 0 && mxCell.j === 2)) return false;
      return Math.abs(DOMINANT_MASS_FRACTION - 0.9620085570909026) <= 1e-9;
    },
  },
  {
    id: "imp95114-gacl-full-lever-exceeds-dominant",
    description:
      "the full applied grid-corner lever 1 - C_grid/C_env = 0.17963140168865188 (rel 1e-9) STRICTLY EXCEEDS the imp-95090 dominant-cell shortfall 0.17415257650513827, by margin 0.005478825183513614 (rel 1e-6); C_env and C_grid reproduce the baked literals",
    holds: () =>
      Math.abs(APPLIED_LEVER_FULL - 0.17963140168865188) <= 1e-9 &&
      Math.abs(CENV_ALL - 4.074591641273443e-5) <= 1e-12 * 4.074591641273443e-5 &&
      Math.abs(CGRID - 3.34266703344263e-5) <= 1e-12 * 3.34266703344263e-5 &&
      APPLIED_LEVER_FULL > DOMINANT_SHORTFALL &&
      Math.abs(LEVER_MARGIN - 0.005478825183513614) <= 1e-6 &&
      IMP95114_GRID_ATTAINED_CEILING_LEVER.appliedLever.exceedsDominant === true,
  },
  {
    id: "imp95114-gacl-empty-bookkeeping-negligible",
    description:
      "the empty cells (b+j >= 7) carry mass fraction 1.5803760529118363e-9 of C_env, so the non-empty-only lever 0.17963140039216097 agrees with the full lever to < 1e-8 (empty-block bookkeeping is not a material contributor)",
    holds: () =>
      EMPTY_MASS_FRACTION > 0 &&
      EMPTY_MASS_FRACTION < 1e-8 &&
      Math.abs(APPLIED_LEVER_NONEMPTY - 0.17963140039216097) <= 1e-9 &&
      Math.abs(APPLIED_LEVER_FULL - APPLIED_LEVER_NONEMPTY) < 1e-8,
  },
  {
    id: "imp95114-gacl-per-cell-shortfalls",
    description:
      "every non-empty cell shortfall lies strictly in (0,1); the dominant cell (0,2) reproduces the imp-95090 shortfall 0.17415257650513827 (rel 1e-9) and its grid ratio matches the sibling 0.8258474234948617; the deep cell (2,2) and grid-edge cell (4,2) under-realize MORE than the dominant cell",
    holds: () => {
      const byKey = {};
      for (const c of NONEMPTY_CELLS) {
        if (!(c.shortfall > 0 && c.shortfall < 1)) return false;
        byKey[`${c.b},${c.j}`] = c;
      }
      const dom = byKey["0,2"];
      const deep = byKey["2,2"];
      const edge = byKey["4,2"];
      if (!dom || !deep || !edge) return false;
      if (!(Math.abs(dom.shortfall - DOMINANT_SHORTFALL) <= 1e-9)) return false;
      if (!(Math.abs(dom.V97 / dom.envE - SIB_RATIO_02) <= 1e-9)) return false;
      return deep.shortfall > dom.shortfall && edge.shortfall > deep.shortfall;
    },
  },
  {
    id: "imp95114-gacl-honesty-gate",
    description:
      "verdict is a measurement/no-go step: promotes no bound, names the still-unapplied fixed-97 lever and the surviving residuals, NO QED, no refereed bound is changed, no bracket move",
    holds: () =>
      IMP95114_GRID_ATTAINED_CEILING_LEVER.promotesBound === false &&
      IMP95114_GRID_ATTAINED_CEILING_LEVER.openResiduals.length === 4 &&
      /NOT APPLIED/.test(IMP95114_GRID_ATTAINED_CEILING_LEVER.openResiduals[0]) &&
      /NO QED/.test(IMP95114_GRID_ATTAINED_CEILING_LEVER.verdict) &&
      /refereed bound is changed/i.test(IMP95114_GRID_ATTAINED_CEILING_LEVER.verdict) &&
      /no bracket move/.test(IMP95114_GRID_ATTAINED_CEILING_LEVER.verdict) &&
      /EXCEEDS/.test(IMP95114_GRID_ATTAINED_CEILING_LEVER.verdict),
  },
];

for (const a of IMP95114_GACL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95114-grid-attained-ceiling-lever assertion failed: ${a.id}`);
  }
}

export default IMP95114_GRID_ATTAINED_CEILING_LEVER;
