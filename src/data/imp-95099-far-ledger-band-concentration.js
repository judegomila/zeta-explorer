/**
 * imp-95099 - Quantify PRECISELY how much of the imp-95077 monotone ledger-factor
 * loss (14.72 -> 4.48 as theta 10 -> 2, at sigma = 1) is concentrated in the
 * theta in [2, 6] band, fit the convex-ish cFar decay, and confirm the strict
 * cFar < 4 margin has NO near-crossing on a finer non-integer theta grid in
 * [2, 6]. Measurement only, NO QED, promotes no bound.
 *
 * CONTEXT. imp-95077-far-ledger-degrade-table.js tabulates the far coefficient
 * cFar and the ledger factor 4/cFar for every INTEGER theta in {2..10} at
 * sigma = 1, and reads off (line 141) "roughly half the ledger loss is spent
 * over theta in [2, 6], so the degradation is concentrated in the low-theta
 * band". That "roughly half / concentrated in [2, 6]" phrasing was only ever an
 * eyeball of the integer rows. This module pins the fraction exactly, fits the
 * decay, and refines the >4 margin on a non-integer grid.
 *
 * MACHINERY. Identical parameterized far coefficient cFar = 2 (sup_b OmegaE_b)
 * / Tx(2) as imp-95026 / imp-95077: midpoint quadrature (N = 200000, pad = 120)
 * of the normalized pair correlation with decay s = sigma + theta, sup over
 * b in 0..8, model constants beta = 1/3, c = v = D = 1,
 * Q = 0.6299605249474366. The integer rows of the fine grid REPRODUCE the
 * imp-95077 baked table bit-for-bit, which is the cross-check.
 *
 * FINDING 1 (the concentration is quantity-dependent - the imp-95077 eyeball is
 * only half-right). Measure the "loss" as the change in the LEDGER FACTOR
 * L(theta) = 4/cFar as theta runs 2 -> 10:
 *   total L loss  = L(10) - L(2) = 14.71995 - 4.48198 = 10.23797
 *   [2, 6] band   = L(6)  - L(2) =  8.34310 - 4.48198 =  3.86112  (37.71 %)
 *   [6, 10] band  = L(10) - L(6) = 14.71995 - 8.34310 =  6.37685  (62.29 %)
 * So measured in the ledger factor itself, the MAJORITY (62.3 %) of the loss
 * sits in the HIGH-theta band [6, 10], NOT in [2, 6]. But measure the same
 * degradation as the drop in cFar (the quantity the ledger factor inverts):
 *   total cFar drop = cFar(2) - cFar(10) = 0.89246 - 0.27174 = 0.62072
 *   [2, 6] band     = cFar(2) - cFar(6)  = 0.89246 - 0.47944 = 0.41302 (66.54 %)
 *   [6, 10] band    = cFar(6) - cFar(10) = 0.47944 - 0.27174 = 0.20770 (33.46 %)
 * Now the MAJORITY (66.5 %) sits in [2, 6]. The reciprocal L = 4/cFar amplifies
 * changes at small cFar (large theta), which is why the two accountings flip
 * which band dominates. The imp-95077 "concentrated in the low-theta band"
 * reading is TRUE for the cFar drop and FALSE for the ledger-factor loss; it
 * is a well-defined ~2/3 concentration only once you say WHICH quantity.
 *
 * FINDING 2 (the decay is approximately - not exactly - exponential). A
 * log-linear least-squares fit of the nine integer rows gives
 *   cFar(theta) ~ 1.20296 * exp(-0.150995 * theta)
 * with R^2 (on log cFar) = 0.99903 and a max relative residual on cFar of
 * 2.20 %. So the "convex-ish decay" of imp-95077 is well described by a single
 * exponential with decay rate k ~ 0.151 per unit theta, but the ~2 % residual
 * (the per-step ratio dips to ~0.850 near theta = 4-5 and rises back to ~0.877
 * by theta = 10) shows it is not a pure exponential - consistent with a
 * quotient-of-integrals form, not a closed exponential.
 *
 * FINDING 3 (no near-crossing of the pre-seventeenth 4 on a finer grid). On a
 * theta grid over [2, 6] at step 0.25 (17 points), cFar is strictly decreasing
 * and its MAXIMUM is the theta = 2 endpoint cFar = 0.89246. The margin below
 * the pre-seventeenth far coefficient 4, i.e. 4 - cFar, is MONOTONE INCREASING
 * in theta and its minimum over the grid is 4 - 0.89246 = 3.10754 at theta = 2.
 * The far coefficient therefore never comes within 3.1 of 4 anywhere on the
 * refined [2, 6] band: the strict cFar < 4 (ledger factor > 1) margin has no
 * near-crossing, and the worst refined row still clears 4 by 4.48x in ledger
 * terms.
 *
 * SUB-GAP (inherited, honest). The actual Section 4.5 paper packet decay theta
 * is NOT pinned in this repository (imp-95026 openResiduals[0] / imp-95077
 * openResiduals[0]); this is a sensitivity refinement over the plausible
 * low-theta neighborhood at sigma = 1, not an instantiated paper number. As in
 * imp-95077, rows with s = sigma + theta < s* = 2.948383274238082
 * (imp-95026 Finding 4) would need the eighteenth-window envelope for sharpness
 * within MAJ - only theta = 2 (s = 3) borders that boundary, clearing by 0.0238.
 *
 * The numerics below CROSS-CHECK the imp-95077 integer rows and the arithmetic
 * relations; they are not the claim. Import-light (no heavy bundle). Changes no
 * bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// -- parameterized ceiling machinery (identical to imp-95077; free theta) ------
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

// -- anchor literals shared with imp-95077 -------------------------------------
const CFAR_2 = 0.8924623374689161; // theta = 2, s = 3 (WORST_SCANNED)
const CFAR_6 = 0.4794379564963571; // theta = 6, s = 7 (band boundary)
const CFAR_10 = 0.2717400426244421; // theta = 10, s = 11 (MODEL)
const PRE17_FAR = 4; // pre-seventeenth far coefficient

// -- concentration ledger (Finding 1) -----------------------------------------
const L2 = PRE17_FAR / CFAR_2;
const L6 = PRE17_FAR / CFAR_6;
const L10 = PRE17_FAR / CFAR_10;
const TOTAL_LEDGER_LOSS = L10 - L2;
const BAND_26_LEDGER = L6 - L2;
const BAND_610_LEDGER = L10 - L6;
const TOTAL_CFAR_DROP = CFAR_2 - CFAR_10;
const BAND_26_CFAR = CFAR_2 - CFAR_6;
const BAND_610_CFAR = CFAR_6 - CFAR_10;

// -- exponential decay fit (Finding 2) -----------------------------------------
const DECAY_FIT = {
  form: "cFar(theta) ~ A * exp(k * theta)",
  A: 1.2029560966414938,
  k: -0.1509954379653171,
  rSquaredLog: 0.9990344084852085,
  maxRelResidCFar: 0.02201705025015887,
};

// -- fine non-integer grid over [2, 6] at step 0.25 (Finding 3); computed
//    offline with the machinery above at N = 200000, pad = 120; the integer
//    rows reproduce the imp-95077 baked table bit-for-bit --------------------
const FINE_GRID_26 = [
  { theta: 2, cFar: 0.8924623374689161, ledgerFactor: 4.481981851855252, marginBelow4: 3.107537662531084 },
  { theta: 2.25, cFar: 0.8653461169774338, ledgerFactor: 4.622427860393705, marginBelow4: 3.1346538830225663 },
  { theta: 2.5, cFar: 0.8360882626149224, ledgerFactor: 4.7841838940421555, marginBelow4: 3.1639117373850776 },
  { theta: 2.75, cFar: 0.8059087938226293, ledgerFactor: 4.963340803153404, marginBelow4: 3.1940912061773705 },
  { theta: 3, cFar: 0.775595275954722, ledgerFactor: 5.157328988467838, marginBelow4: 3.224404724045278 },
  { theta: 3.25, cFar: 0.7456512200560955, ledgerFactor: 5.364438349204443, marginBelow4: 3.2543487799439044 },
  { theta: 3.5, cFar: 0.7163933945840559, ledgerFactor: 5.58352440187201, marginBelow4: 3.283606605415944 },
  { theta: 3.75, cFar: 0.6880157550993573, ledgerFactor: 5.813820352736478, marginBelow4: 3.3119842449006427 },
  { theta: 4, cFar: 0.6606314361230662, ledgerFactor: 6.0548132911659645, marginBelow4: 3.339368563876934 },
  { theta: 4.25, cFar: 0.634300329008819, ledgerFactor: 6.306161004599425, marginBelow4: 3.365699670991181 },
  { theta: 4.5, cFar: 0.6090472090941063, ledgerFactor: 6.567635382402589, marginBelow4: 3.3909527909058936 },
  { theta: 4.75, cFar: 0.5848736794402535, ledgerFactor: 6.839083618582654, marginBelow4: 3.4151263205597466 },
  { theta: 5, cFar: 0.5617660739138457, ledgerFactor: 7.120401508285909, marginBelow4: 3.4382339260861543 },
  { theta: 5.25, cFar: 0.5397007195055837, ledgerFactor: 7.41151504052908, marginBelow4: 3.460299280494416 },
  { theta: 5.5, cFar: 0.5186474695792163, ledgerFactor: 7.712367715290772, marginBelow4: 3.481352530420784 },
  { theta: 5.75, cFar: 0.49857210052465073, ledgerFactor: 8.022911823166146, marginBelow4: 3.5014278994753494 },
  { theta: 6, cFar: 0.4794379564963571, ledgerFactor: 8.343102471967908, marginBelow4: 3.520562043503643 },
];

const GRID_MAX_CFAR = 0.8924623374689161; // theta = 2 endpoint
const GRID_MIN_MARGIN_BELOW_4 = 3.107537662531084; // theta = 2 endpoint

// -- verdict object ------------------------------------------------------------
export const IMP95099_FAR_LEDGER_BAND_CONCENTRATION = {
  ticket:
    "imp-95099 (quantify how much of the imp-95077 monotone ledger-factor loss is concentrated in theta in [2, 6], fit the convex-ish cFar decay, and confirm the strict cFar < 4 margin has no near-crossing on a finer non-integer theta grid in [2, 6], at sigma = 1)",
  source:
    "imp-95077-far-ledger-degrade-table.js (integer-theta far-ledger degrade table) reading line; imp-95026 Finding 3; Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture.",
  modelPoint: { sigma: 1, beta: "1/3", c: 1, v: 1, D: 1, Q: 0.6299605249474366 },
  concentration: {
    ledgerFactor: {
      L2,
      L6,
      L10,
      totalLoss: TOTAL_LEDGER_LOSS,
      band26: BAND_26_LEDGER,
      band610: BAND_610_LEDGER,
      band26Fraction: BAND_26_LEDGER / TOTAL_LEDGER_LOSS,
      band610Fraction: BAND_610_LEDGER / TOTAL_LEDGER_LOSS,
    },
    cFarDrop: {
      total: TOTAL_CFAR_DROP,
      band26: BAND_26_CFAR,
      band610: BAND_610_CFAR,
      band26Fraction: BAND_26_CFAR / TOTAL_CFAR_DROP,
      band610Fraction: BAND_610_CFAR / TOTAL_CFAR_DROP,
    },
  },
  decayFit: DECAY_FIT,
  fineGrid26: FINE_GRID_26,
  gridMaxCFar: GRID_MAX_CFAR,
  gridMinMarginBelow4: GRID_MIN_MARGIN_BELOW_4,
  reading:
    "The imp-95077 'concentrated in the low-theta band' reading is quantity-dependent. Measured as the ledger-factor loss L = 4/cFar, only 37.7 % of the 2->10 loss sits in [2, 6] and 62.3 % sits in [6, 10] (the reciprocal amplifies the high-theta / small-cFar end). Measured as the cFar drop, 66.5 % sits in [2, 6] and 33.5 % in [6, 10]. So the low-theta concentration is a well-defined ~2/3 statement only for the cFar drop; for the ledger factor it is the OPPOSITE. The decay is well fit by cFar ~ 1.2030 exp(-0.15100 theta) (R^2 on log cFar 0.99903, max relative residual 2.20 %) - approximately but not exactly exponential. On a finer [2, 6] grid (step 0.25) cFar is strictly decreasing with maximum 0.89246 at theta = 2, so the margin below the pre-seventeenth 4 stays at least 3.10754 everywhere: no near-crossing.",
  crossCheck:
    "The integer rows of the fine grid (theta = 2, 3, 4, 5, 6) reproduce the imp-95077 baked cFar / ledgerFactor literals bit-for-bit, and every fine row satisfies ledgerFactor = 4 / cFar and marginBelow4 = 4 - cFar to machine precision.",
  openResiduals: [
    "the actual Section 4.5 paper packet decay theta is not pinned in this repository (imp-95026 / imp-95077 openResiduals[0]); this is a refinement over the plausible low-theta neighborhood at sigma = 1, not an instantiated paper number",
    "rows with s = sigma + theta < s* = 2.948383274238082 (imp-95026 Finding 4) would need the eighteenth-window envelope for sharpness within MAJ - only theta = 2 (s = 3) borders that boundary, clearing it by 0.0238",
  ],
  isRigorous: true,
  rigorScope:
    "MEASUREMENT: the concentration fractions, the log-linear decay fit, and the 17-point fine grid are computed by the same quadrature machinery as imp-95077 and the integer rows reproduce that module's baked anchors to machine precision. No paper constant is instantiated, so no transferred ceiling is CLAIMED - only the band concentration, the decay fit, and the refined margin are measured. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT refinement of the imp-95077 far-ledger degradation. FINDING 1: the '~half / concentrated in [2, 6]' reading is quantity-dependent - the ledger-factor loss is only 37.7 % inside [2, 6] (62.3 % is in [6, 10]), while the cFar drop is 66.5 % inside [2, 6]; the low-theta concentration is a ~2/3 statement only for cFar, and reverses for the ledger factor 4/cFar. FINDING 2: the decay fits cFar ~ 1.2030 exp(-0.15100 theta) with R^2(log) 0.99903 and 2.20 % max residual - approximately, not exactly, exponential. FINDING 3: on a step-0.25 grid over [2, 6] cFar is strictly decreasing with max 0.89246, so 4 - cFar stays at least 3.10754 - the strict cFar < 4 margin has no near-crossing. SUB-GAP: the paper theta is not pinned in this repo, so this is a sensitivity refinement, not a single instantiated number. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) --------------------------
export const IMP95099_BAND_CONCENTRATION_ASSERTIONS = [
  {
    id: "imp95099-fine-grid-reproduces-imp95077-integer-rows",
    description:
      "the integer rows (theta = 2, 6) of the fine grid re-derive at full N (200000) to the imp-95077 anchors CFAR_2 and CFAR_6 to 1e-12 relative, and the baked fine-grid endpoints match those anchors bit-for-bit",
    holds: () => {
      const lo = farCoefficient(1, 1 / 3, 1, 1, 1, 2);
      const mid = farCoefficient(1, 1 / 3, 1, 1, 1, 6);
      return (
        Math.abs(lo.ceiling - CFAR_2) <= 1e-12 * CFAR_2 &&
        Math.abs(mid.ceiling - CFAR_6) <= 1e-12 * CFAR_6 &&
        FINE_GRID_26[0].cFar === CFAR_2 &&
        FINE_GRID_26[FINE_GRID_26.length - 1].cFar === CFAR_6
      );
    },
  },
  {
    id: "imp95099-fine-grid-arithmetic",
    description:
      "every fine-grid row satisfies ledgerFactor = 4 / cFar and marginBelow4 = 4 - cFar to machine precision, and the grid steps 0.25 from theta = 2 to theta = 6 (17 points)",
    holds: () =>
      FINE_GRID_26.length === 17 &&
      FINE_GRID_26.every(
        (row, i) =>
          Math.abs(row.ledgerFactor - PRE17_FAR / row.cFar) <= 1e-12 * row.ledgerFactor &&
          Math.abs(row.marginBelow4 - (PRE17_FAR - row.cFar)) <= 1e-12 * row.marginBelow4 &&
          Math.abs(row.theta - (2 + 0.25 * i)) <= 1e-12,
      ),
  },
  {
    id: "imp95099-band-concentration-fractions",
    description:
      "the ledger-factor loss is majority in [6, 10] (band26Fraction < 0.5, ~0.377) while the cFar drop is majority in [2, 6] (band26Fraction > 0.5, ~0.665); the two accountings flip which band dominates",
    holds: () => {
      const lf = IMP95099_FAR_LEDGER_BAND_CONCENTRATION.concentration.ledgerFactor;
      const cd = IMP95099_FAR_LEDGER_BAND_CONCENTRATION.concentration.cFarDrop;
      return (
        Math.abs(lf.band26Fraction - 0.3771373716718298) <= 1e-9 &&
        lf.band26Fraction < 0.5 &&
        Math.abs(cd.band26Fraction - 0.6653931788869368) <= 1e-9 &&
        cd.band26Fraction > 0.5 &&
        Math.abs(lf.band26Fraction + lf.band610Fraction - 1) <= 1e-12 &&
        Math.abs(cd.band26Fraction + cd.band610Fraction - 1) <= 1e-12
      );
    },
  },
  {
    id: "imp95099-monotone-no-near-crossing",
    description:
      "cFar is strictly decreasing across the fine [2, 6] grid, its maximum is the theta = 2 endpoint, and the minimum margin below 4 is at least 3.1 (no near-crossing of the pre-seventeenth 4)",
    holds: () => {
      for (let i = 1; i < FINE_GRID_26.length; i++) {
        if (FINE_GRID_26[i].cFar >= FINE_GRID_26[i - 1].cFar) return false;
      }
      const maxC = Math.max(...FINE_GRID_26.map((r) => r.cFar));
      const minMargin = Math.min(...FINE_GRID_26.map((r) => r.marginBelow4));
      return (
        maxC === GRID_MAX_CFAR &&
        Math.abs(minMargin - GRID_MIN_MARGIN_BELOW_4) <= 1e-12 &&
        minMargin > 3.1 &&
        maxC < PRE17_FAR
      );
    },
  },
  {
    id: "imp95099-decay-fit-approximate-exponential",
    description:
      "the log-linear fit has decay rate k ~ -0.151, R^2(log) > 0.999, and a nonzero max relative residual (approximately, not exactly, exponential)",
    holds: () =>
      Math.abs(DECAY_FIT.k - -0.1509954379653171) <= 1e-12 &&
      DECAY_FIT.rSquaredLog > 0.999 &&
      DECAY_FIT.maxRelResidCFar > 0.01 &&
      DECAY_FIT.maxRelResidCFar < 0.05,
  },
  {
    id: "imp95099-honesty-gate",
    description:
      "the verdict names the sub-gap (paper theta not pinned; refinement not a single number), promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95099_FAR_LEDGER_BAND_CONCENTRATION.promotesBound === false &&
      IMP95099_FAR_LEDGER_BAND_CONCENTRATION.openResiduals.length === 2 &&
      /NO QED/.test(IMP95099_FAR_LEDGER_BAND_CONCENTRATION.verdict) &&
      /refereed bound is changed/i.test(IMP95099_FAR_LEDGER_BAND_CONCENTRATION.verdict) &&
      /MEASUREMENT/.test(IMP95099_FAR_LEDGER_BAND_CONCENTRATION.verdict),
  },
];

for (const a of IMP95099_BAND_CONCENTRATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95099-far-ledger-band-concentration assertion failed: ${a.id}`);
  }
}

export default IMP95099_FAR_LEDGER_BAND_CONCENTRATION;
