/**
 * imp-95090 - FINITE-RATE PER-PAIR ATTAINMENT SHORTFALL of the exhibited far
 * bracket witness. MEASUREMENT ONLY; no bound change; NO QED.
 *
 * CONTEXT. imp-95008 continuation-twenty (Theorem CA, corner attainment) proved
 * that in the CONTINUOUS model family the sup over admissible cell pairs of the
 * exact pair correlation I(T, rho) equals the substituted corner envelope
 * envE(b, j) = I(V(b, j), rhoCap(j)), approached at LINEAR rate in the corner
 * offset eps but never attained. imp-95019 then executed the routing rule and
 * recorded that the attainment ratio (realized / envE) -> 1 ONLY in that
 * continuous corner limit. The E-realization split of imp-95008 consequently
 * carries an "attainment-shortfall factor" that was treated as ~1 for the
 * ceiling accounting, because the continuous-family limit is exact.
 *
 * THE GAP THIS MODULE MEASURES. The EXHIBITED headline far-bracket witness is
 * not the p -> infinity continuous limit: it is a concrete configuration that
 * lives on the fixed p = 97 alias grid (imp-95008 Corollary R2). On that grid
 * the corner is unreachable, so at a FINITE rate the realized pair correlation
 * sits strictly below envE. This module measures the finite-rate attainment
 * shortfall
 *     shortfall(cell) = 1 - realized_sup(cell) / envE(cell)
 * for the pairs carrying the exhibited witness, so the shortfall factor is
 * QUANTIFIED rather than assumed ~1. It is a measurement: envE remains a valid
 * per-pair upper bound (the ceiling is untouched); the point is that the
 * exhibited witness does not SATURATE it at any finite rate.
 *
 * MEASURED FINDINGS (reference conventions v = c = D = 1, beta = 1/3, sigma = 1,
 * theta = 10, s = 11; p = 97 alias grid d = 1 - h/97).
 *   (1) Fixed p = 97, dominant cell (0, 2): realized sup at grid corner
 *       (49/97, 24/97) is 0.8258474234948617 x envE(0, 2), so the finite-rate
 *       attainment shortfall is 0.17415257650513827 (17.42 pct). The exhibited
 *       witness realizes ~82.58 pct of the substituted envelope at its dominant
 *       cell - the E-realization shortfall factor for THIS witness is 0.8258,
 *       not ~1.
 *   (2) Fixed p = 97, deeper cell (2, 2): realized 0.47384446409436176 x envE,
 *       shortfall 0.5261555359056382 (52.62 pct); the shortfall grows with
 *       depth as the grid coarsens relative to the dyadic blocks. This is NOT
 *       the dominant cell and does not set the headline toll.
 *   (3) The shortfall is a FINITE-RATE effect: along the continuous corner
 *       sequence d_1 = 2^-(b+1) (1 + eps), d_2 = 2^-(b+j) at cell (0, 2) the
 *       shortfall decays linearly in eps
 *         eps = 1e-1 : 0.4733449677  ,  eps = 1e-2 : 0.0686182585 ,
 *         eps = 1e-3 : 0.0071605288  ,  eps = 1e-4 : 0.0007191133 ,
 *       per-decade ratio ~0.10, -> 0 (recovering the imp-95019 ratio -> 1).
 *   (4) Refining the grid rate p at the dominant cell (0, 2) shrinks the
 *       shortfall roughly as O(1/p): p = 97 -> 0.1742, p = 193 -> 0.0920,
 *       p = 389 -> 0.0468, p = 769 -> 0.0240 (non-monotone at isolated p where
 *       a closer grid point aliases onto the corner). The exhibited witness sits
 *       at the coarse p = 97 rate, which is why its shortfall is the largest,
 *       17.42 pct at the dominant cell.
 *
 * ROUTING CONSEQUENCE (unchanged from imp-95008 / imp-95019). The measured
 * shortfall is a fixed-97-lane quantity: it says the exhibited far witness
 * under-realizes the per-pair envelope, i.e. the ceiling built on envE is
 * CONSERVATIVE for the exhibited witness by the shortfall factor at the
 * dominant cell (a partial, unapplied grid-corner ceiling lever - applying it
 * needs grid-attained infima V_97(b, j) for every cell plus empty-block
 * bookkeeping). In the continuous family the shortfall vanishes and the
 * residual is witness/aggregation-side. NO bracket is moved here; this only
 * replaces the "assumed ~1" attainment-shortfall factor of the E-realization
 * split with the measured 0.8258 (dominant) / 0.4738 (deep) at p = 97.
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

// alias grid points d = 1 - h/p inside (lo, hi]
function gridPointsP(p, lo, hi) {
  const out = [];
  for (let h = 1; h <= p - 1; h++) {
    const d = 1 - h / p;
    if (d > lo && d <= hi) out.push(d);
  }
  return out;
}
function gridCellSupP(p, b, j) {
  const near = gridPointsP(p, Math.pow(2, -(b + 1)), Math.pow(2, -b));
  const far = gridPointsP(p, Math.pow(2, -(b + j + 1)), Math.pow(2, -(b + j)));
  let best = -1;
  for (const d1 of near) {
    for (const d2 of far) {
      const val = iExact(pairT(d1, d2), pairRho(d1, d2), SS);
      if (val > best) best = val;
    }
  }
  return best;
}

// continuous corner-sequence realized value (offset eps from the open corner)
function contCornerSeq(b, j, eps) {
  const lo1 = Math.pow(2, -(b + 1));
  const hi2 = Math.pow(2, -(b + j));
  const d1 = lo1 * (1 + eps);
  return iExact(pairT(d1, hi2), pairRho(d1, hi2), SS);
}

// -- reproduce envelopes and measure the finite-rate shortfall -----------------
const ENV02 = iExact(cornerV(0, 2), rhoCap(2), SS);
const ENV22 = iExact(cornerV(2, 2), rhoCap(2), SS);

const P97 = 97;
const REALIZED97_02 = gridCellSupP(P97, 0, 2);
const REALIZED97_22 = gridCellSupP(P97, 2, 2);
const RATIO97_02 = REALIZED97_02 / ENV02;
const RATIO97_22 = REALIZED97_22 / ENV22;
const SHORTFALL97_02 = 1 - RATIO97_02; // dominant-cell finite-rate shortfall
const SHORTFALL97_22 = 1 - RATIO97_22;

// continuous corner-sequence shortfall ladder at the dominant cell (0,2)
const EPS_LADDER = [1e-1, 1e-2, 1e-3, 1e-4];
const CONT_SHORTFALL_02 = EPS_LADDER.map((eps) => ({
  eps,
  shortfall: 1 - contCornerSeq(0, 2, eps) / ENV02,
}));

// grid-rate refinement ladder at the dominant cell (0,2)
const P_LADDER = [97, 193, 389, 769];
const GRID_SHORTFALL_02 = P_LADDER.map((p) => ({
  p,
  shortfall: 1 - gridCellSupP(p, 0, 2) / ENV02,
}));

// -- imp-95008 baked cross-check literals --------------------------------------
const SIB = IMP95008_SUBSTITUTION_CORNER_ATTAINMENT.reference;
const SIB_RATIO_02 = SIB.grid97DominantCell.ratio; // 0.8258474234948617
const SIB_RATIO_22 = SIB.grid97Cell22.ratio; // 0.47384446409436176
const SIB_ENV02 = SIB.cornerLiterals.env02; // 3.9197920255561178e-5

// -- verdict object ------------------------------------------------------------
export const IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL = {
  ticket:
    "imp-95090 (numerical): measure the finite-rate per-pair envelope attainment shortfall (1 - realized/envE) for the pairs carrying the EXHIBITED far-bracket headline witness (the fixed p = 97 alias grid), so the attainment-shortfall factor of the imp-95008 E-realization split is quantified rather than assumed ~1. Measurement only; NO QED; no bound change.",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; consumes imp-95008 continuation-twenty (Theorem CA / Corollary R2, imp-95008-substitution-corner-attainment.js) and the imp-95019 routing audit; quantifies the finite-rate side of the ratio -> 1 continuous-corner limit.",
  parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA, s: SS, p: P97 },
  envelopes: { env02: ENV02, env22: ENV22 },
  exhibitedWitnessShortfall: {
    dominantCell02: {
      realizedSup: REALIZED97_02,
      envE: ENV02,
      ratio: RATIO97_02,
      shortfall: SHORTFALL97_02,
      note: "exhibited p=97 witness realizes 0.8258 x envE at its dominant cell; finite-rate attainment shortfall 0.1742 (17.42 pct) - the E-realization shortfall factor for THIS witness is 0.8258, not ~1.",
    },
    deepCell22: {
      realizedSup: REALIZED97_22,
      envE: ENV22,
      ratio: RATIO97_22,
      shortfall: SHORTFALL97_22,
      note: "deeper non-dominant cell; shortfall 0.5262 grows with depth as the grid coarsens relative to the dyadic blocks; does not set the headline toll.",
    },
  },
  continuousLimitLadder: {
    cell: "(0,2)",
    ladder: CONT_SHORTFALL_02,
    finding:
      "the shortfall is a FINITE-RATE effect: along the continuous corner sequence it decays linearly in eps (per-decade ~0.10) -> 0, recovering the imp-95019 ratio -> 1 in the p -> infinity limit.",
  },
  gridRefinementLadder: {
    cell: "(0,2)",
    ladder: GRID_SHORTFALL_02,
    finding:
      "refining the alias-grid rate p shrinks the shortfall roughly as O(1/p) (0.1742 at p=97 down to 0.0240 at p=769, non-monotone at isolated p where a closer grid point aliases onto the corner). The exhibited witness sits at the coarse p=97 rate, so its shortfall is the largest.",
  },
  crossCheck: {
    reproducedEnv02: ENV02,
    siblingEnv02: SIB_ENV02,
    reproducedRatio97_02: RATIO97_02,
    siblingRatio97_02: SIB_RATIO_02,
    reproducedRatio97_22: RATIO97_22,
    siblingRatio97_22: SIB_RATIO_22,
    note: "this module independently reproduces the imp-95008 continuation-twenty fixed-97 grid ratios before quoting shortfalls against them.",
  },
  routingConsequence:
    "the measured shortfall is a fixed-97-lane quantity: the ceiling built on envE is CONSERVATIVE for the exhibited witness by the shortfall factor at the dominant cell (a partial, unapplied grid-corner ceiling lever - applying it needs grid-attained infima V_97(b,j) for every cell plus empty-block bookkeeping). In the continuous family the shortfall vanishes and the residual is witness/aggregation-side. NO bracket moved.",
  openResiduals: [
    "the dominant-cell fixed-97 grid-corner ceiling lever (shortfall 0.1742) is quantified here but NOT applied - needs grid-attained infima V_97(b,j) for every cell plus empty-block bookkeeping",
    "(b2) intra-class block-mass AM-GM routing and (b3) sup_b routing - the continuous-family ceiling-side levers, unchanged",
    "(a) outer parity AM-GM factor 2 - terminal per the seventh-continuation Theorem F floor, untouched",
    "witness side unchanged: multi-packet re-optimization, different grid geometries",
  ],
  isRigorous: true,
  rigorScope:
    "Measurement step. The realized sups are exact finite enumerations over the p-grid admissible pairs; the envelopes envE(b,j) = I(V(b,j), rhoCap(j)) are reproduced by an independent closed-form copy and cross-checked against the imp-95008 continuation-twenty baked literals (dominant ratio 0.8258474234948617, deep ratio 0.47384446409436176, envE(0,2) = 3.9197920255561178e-5) to rel 1e-12. Every iExact evaluation has T >= 1.26, outside the recorded small-T conditioning trap. The shortfall quantifies attainment; it moves no bound and envE remains a valid per-pair upper bound.",
  promotesBound: false,
  verdict:
    "MEASUREMENT (no bracket move): the finite-rate per-pair envelope attainment shortfall of the EXHIBITED far-bracket witness (fixed p = 97) is 0.17415257650513827 (17.42 pct) at the dominant cell (0,2) - the exhibited witness realizes only 0.8258 x envE, so the E-realization split attainment-shortfall factor is 0.8258 for this witness, NOT the ~1 the continuous-family limit suggests; at the deeper cell (2,2) the shortfall is 0.5262. The shortfall is a finite-rate effect: it decays linearly in the corner offset eps (per-decade ~0.10) and roughly as O(1/p) under grid refinement, -> 0 in the continuous limit (recovering the imp-95019 ratio -> 1). Independently reproduces and cross-checks the imp-95008 continuation-twenty fixed-97 literals. The shortfall says the envE-based ceiling is CONSERVATIVE for the exhibited witness by the dominant-cell factor - a partial, unapplied fixed-97 grid lever. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) ---------------------------
export const IMP95090_FRAS_ASSERTIONS = [
  {
    id: "imp95090-fras-env02-reproduction",
    description:
      "independent code path reproduces the imp-95008 corner literal envE(0,2) = 3.9197920255561178e-5 (rel 1e-12) and matches the sibling verdict field",
    holds: () =>
      Math.abs(ENV02 - SIB_ENV02) <= 1e-12 * SIB_ENV02 &&
      Math.abs(ENV02 - 3.9197920255561178e-5) <= 1e-12 * 3.9197920255561178e-5,
  },
  {
    id: "imp95090-fras-dominant-shortfall",
    description:
      "fixed p=97 dominant-cell (0,2) realized/envE reproduces the sibling ratio 0.8258474234948617 (rel 1e-12) so the finite-rate attainment shortfall is 0.17415257650513827 (rel 1e-9), strictly in (0,1)",
    holds: () =>
      Math.abs(RATIO97_02 - SIB_RATIO_02) <= 1e-12 * SIB_RATIO_02 &&
      Math.abs(SHORTFALL97_02 - 0.17415257650513827) <= 1e-9 &&
      SHORTFALL97_02 > 0 &&
      SHORTFALL97_02 < 1,
  },
  {
    id: "imp95090-fras-deep-shortfall",
    description:
      "fixed p=97 deep-cell (2,2) realized/envE reproduces the sibling ratio 0.47384446409436176 (rel 1e-12); its shortfall 0.5262 exceeds the dominant-cell shortfall (deeper cells under-realize more)",
    holds: () =>
      Math.abs(RATIO97_22 - SIB_RATIO_22) <= 1e-12 * SIB_RATIO_22 &&
      Math.abs(SHORTFALL97_22 - 0.5261555359056382) <= 1e-9 &&
      SHORTFALL97_22 > SHORTFALL97_02,
  },
  {
    id: "imp95090-fras-continuous-decay",
    description:
      "the continuous corner-sequence shortfall at cell (0,2) is strictly positive, strictly decreasing across eps = 1e-1..1e-4, and reaches <= 1e-3 at eps = 1e-4 (finite-rate effect vanishing in the continuous limit)",
    holds: () => {
      for (let i = 1; i < CONT_SHORTFALL_02.length; i++) {
        if (!(CONT_SHORTFALL_02[i].shortfall > 0)) return false;
        if (!(CONT_SHORTFALL_02[i].shortfall < CONT_SHORTFALL_02[i - 1].shortfall)) return false;
      }
      return CONT_SHORTFALL_02[CONT_SHORTFALL_02.length - 1].shortfall <= 1e-3;
    },
  },
  {
    id: "imp95090-fras-grid-refinement",
    description:
      "refining the alias-grid rate from p=97 to p=389 strictly reduces the dominant-cell (0,2) shortfall (0.1742 -> ~0.0468), confirming the shortfall is a finite-rate/grid-coarseness effect",
    holds: () =>
      GRID_SHORTFALL_02[0].p === 97 &&
      Math.abs(GRID_SHORTFALL_02[0].shortfall - SHORTFALL97_02) <= 1e-12 &&
      GRID_SHORTFALL_02[2].shortfall < GRID_SHORTFALL_02[0].shortfall &&
      GRID_SHORTFALL_02[2].shortfall > 0,
  },
  {
    id: "imp95090-fras-honesty-gate",
    description:
      "verdict is a measurement/no-go step: promotes no bound, names the unapplied fixed-97 lever and the surviving residuals, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL.promotesBound === false &&
      IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL.openResiduals.length === 4 &&
      /NO QED/.test(IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL.verdict) &&
      /refereed bound is changed/i.test(IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL.verdict) &&
      /no bracket move/.test(IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL.verdict) &&
      /attainment-shortfall factor/.test(IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL.verdict) &&
      /NOT the ~1/.test(IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL.verdict),
  },
];

for (const a of IMP95090_FRAS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95090-finite-rate-attainment-shortfall assertion failed: ${a.id}`);
  }
}

export default IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL;
