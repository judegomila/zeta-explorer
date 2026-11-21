/**
 * imp-95117 - CHARACTERIZE the O(1/p) ALIASING NON-MONOTONICITY of the imp-95090
 * grid-corner attainment shortfall. MEASUREMENT / DERIVATION ONLY; no bound
 * change; NO QED.
 *
 * CONTEXT. imp-95090 Finding (4) reported that refining the alias-grid rate p at
 * the dominant cell (0, 2) shrinks the finite-rate attainment shortfall
 *     shortfall(p) = 1 - realized_sup_p(0,2) / envE(0,2)
 * roughly as O(1/p) (p = 97 -> 0.1742, 193 -> 0.0920, 389 -> 0.0468,
 * 769 -> 0.0240) but is "NON-MONOTONE at isolated p where a closer grid point
 * aliases onto the corner" - the mechanism was left uncharacterized. This module
 * measures the shortfall across a dense p sweep, LOCATES the aliasing dips, and
 * DERIVES the number-theoretic condition on p that produces each dip.
 *
 * THE MECHANISM (derived). The open corner of cell (0, 2) sits at the DYADIC
 * coordinates (d_1, d_2) = (2^-(b+1), 2^-(b+j)) = (1/2, 1/4). The alias grid is
 * d = 1 - h/p = (p - h)/p, h = 1..p-1. A grid point lands EXACTLY on a target
 * coordinate 2^-k iff (p - h)/p = 2^-k has an integer solution, i.e. iff
 * 2^k | p:
 *     d_1 = 1/2 hit exactly  <=>  2 | p        (h = p/2),
 *     d_2 = 1/4 hit exactly  <=>  4 | p        (h = 3p/4).
 * The best-rational-approximation framework the ticket asks for DEGENERATES for a
 * dyadic corner: the continued fraction of 2^-k is finite, so h/p approximates
 * 2^-k with error EXACTLY 0 when 2^k | p and otherwise bounded below by
 * 1/(2^k p) (the nearest h gives |2^-k - (p-h)/p| = |2^k(p-h) - p| / (2^k p) >=
 * 1/(2^k p) since the numerator is a non-zero integer). The corner-approach rate
 * is therefore O(1/p) with a phase set entirely by the residue p mod 2^(b+j) =
 * p mod 4 at this cell. The "aliasing dips" are precisely the p with 4 | p, where
 * BOTH corner coordinates are exact grid points and the realized sup sits on the
 * open corner itself.
 *
 * MEASURED FINDINGS (reference conventions v = c = D = 1, beta = 1/3, sigma = 1,
 * theta = 10, s = 11; envE(0,2) = 3.9197920255561178e-5).
 *   (1) The shortfall x p asymptotic CONSTANT is set entirely by p mod 4
 *       (mean over p in [360, 420]):
 *         p = 0 mod 4 (both 1/2 and 1/4 are grid points)  : C ~ 14.04  DIP FLOOR
 *         p = 1 mod 4 (neither hit; the imp-95090 ladder)  : C ~ 18.22
 *         p = 2 mod 4 (only 1/2 is a grid point)           : C ~ 35.53
 *         p = 3 mod 4 (neither; worst phase)               : C ~ 39.55
 *       so shortfall(p) ~ C(p mod 4) / p - four interleaved O(1/p) branches, an
 *       envelope C_3/p ~ 39.5/p and a dip floor C_0/p ~ 14.0/p.
 *   (2) The imp-95090 ladder {97, 193, 389, 769} is entirely p = 1 mod 4 (all
 *       primes), so ALONG that ladder the shortfall is internally monotone
 *       (0.1742 > 0.0920 > 0.0468 > ...). The non-monotonicity Finding (4) refers
 *       to appears only when the p = 0 mod 4 dips BETWEEN the ladder rungs are
 *       included: e.g. p = 95 -> 0.3551, p = 96 -> 0.1360, p = 97 -> 0.1742 - as
 *       p increases through the multiple of 4 (96) the shortfall DROPS, then
 *       rises again at 97, so shortfall(p) is not monotone in p.
 *   (3) The divisibility <-> exact-corner-hit equivalence (2|p <=> 1/2 hit,
 *       4|p <=> 1/4 hit) was verified to hold for every p in the sweep [60, 420].
 *
 * ROUTING CONSEQUENCE (unchanged from imp-95090). This is a fixed-lane
 * measurement of a witness-side finite-rate effect: it characterizes HOW the
 * exhibited-witness shortfall depends on the grid rate p, confirming the O(1/p)
 * envelope of imp-95090 Finding (4) and explaining its non-monotonicity as a
 * mod-4 aliasing phase. No bracket is moved; envE remains a valid per-pair upper
 * bound; the ceiling is untouched.
 *
 * Import-light: a self-contained closed-form copy identical to the imp-95090
 * sibling chain, cross-checked against the imp-95008 continuation-twenty baked
 * corner literal. NO heavy bundle. Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

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

// nearest grid-point error to a target coordinate (min over h of |1 - h/p - t|)
function nearestGridErr(target, p) {
  let best = Infinity;
  for (let h = 1; h <= p - 1; h++) {
    const e = Math.abs(1 - h / p - target);
    if (e < best) best = e;
  }
  return best;
}

// -- reproduce the dominant-cell envelope and the shortfall functional ---------
const ENV02 = iExact(cornerV(0, 2), rhoCap(2), SS);
const shortfall = (p) => 1 - gridCellSupP(p, 0, 2) / ENV02;

// -- dense sweep (measurement) -------------------------------------------------
const SWEEP_LO = 60;
const SWEEP_HI = 420;
const SWEEP = [];
for (let p = SWEEP_LO; p <= SWEEP_HI; p++) {
  SWEEP.push({ p, mod4: p % 4, shortfall: shortfall(p) });
}

// asymptotic shortfall*p constant per residue class (large-p tail)
function classConstant(r) {
  const tail = SWEEP.filter((x) => x.mod4 === r && x.p >= 360);
  const s = tail.reduce((a, x) => a + x.shortfall * x.p, 0);
  return s / tail.length;
}
const CLASS_CONSTANTS = { 0: classConstant(0), 1: classConstant(1), 2: classConstant(2), 3: classConstant(3) };

// aliasing dips = the p = 0 mod 4 rungs (both dyadic corners are grid points)
const DIP_SAMPLES = [96, 100, 392].map((p) => ({ p, mod4: p % 4, shortfall: shortfall(p) }));
// the imp-95090 ladder (all 1 mod 4)
const LADDER_95090 = [97, 193, 389].map((p) => ({ p, mod4: p % 4, shortfall: shortfall(p) }));
// the explicit consecutive-p non-monotone triple 95 -> 96 -> 97
const NONMONO_TRIPLE = [95, 96, 97].map((p) => ({ p, mod4: p % 4, shortfall: shortfall(p) }));

// divisibility <-> exact-corner-hit equivalence across the whole sweep
const DIVISIBILITY_EXACT = SWEEP.every(
  (x) => (x.p % 2 === 0) === (nearestGridErr(0.5, x.p) === 0) && (x.p % 4 === 0) === (nearestGridErr(0.25, x.p) === 0),
);

// -- imp-95008 baked cross-check literal ---------------------------------------
const SIB_ENV02 = 3.9197920255561178e-5; // imp-95008 continuation-twenty envE(0,2)

// -- verdict object ------------------------------------------------------------
export const IMP95117_ALIASING_NONMONOTONICITY_MOD4 = {
  ticket:
    "imp-95117 (numerical): characterize the O(1/p) aliasing NON-MONOTONICITY of the imp-95090 grid-corner attainment shortfall - dense p sweep, locate the aliasing dips, derive the number-theoretic (divisibility mod 2^(b+j)) condition producing each dip, report the O(1/p) envelope constant and dip depths. Derivation/measurement only; NO QED; no bound change.",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; consumes imp-95090 Finding (4) (imp-95090-finite-rate-attainment-shortfall.js) and the imp-95008 continuation-twenty corner literal.",
  parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA, s: SS, cell: "(0,2)" },
  cornerCoordinates: { d1: "1/2 = 2^-1", d2: "1/4 = 2^-2", note: "dyadic corner of cell (0,2); alias grid d = (p - h)/p" },
  numberTheoreticCondition: {
    statement:
      "a grid point lands exactly on the dyadic corner coordinate 2^-k iff 2^k | p (d_1 = 1/2 hit iff 2|p, d_2 = 1/4 hit iff 4|p); the best-rational-approximation of a dyadic corner degenerates (finite continued fraction) so the approach error is 0 when 2^k|p and >= 1/(2^k p) otherwise. The aliasing dips are exactly p = 0 mod 4.",
    verifiedDivisibilityEquivalence: DIVISIBILITY_EXACT,
    residue: "p mod 2^(b+j) = p mod 4 sets the O(1/p) phase at cell (0,2)",
  },
  envelope: {
    form: "shortfall(p) ~ C(p mod 4) / p (four interleaved O(1/p) branches)",
    classConstants: CLASS_CONSTANTS,
    dipFloorConstant: CLASS_CONSTANTS[0],
    worstEnvelopeConstant: CLASS_CONSTANTS[3],
    note: "constant per residue class (mean of shortfall*p over p in [360,420]); p=0 mod 4 is the dip floor (~14.0/p), p=3 mod 4 the worst envelope (~39.5/p).",
  },
  aliasingDips: {
    samples: DIP_SAMPLES,
    finding:
      "the aliasing dips are the p = 0 mod 4 rungs, where BOTH dyadic corner coordinates 1/2 and 1/4 are exact grid points and the realized sup sits on the open corner - the shortfall drops to the C_0/p floor.",
  },
  ladder95090: {
    samples: LADDER_95090,
    finding:
      "the imp-95090 ladder {97,193,389,769} is entirely p = 1 mod 4 (primes), so ALONG that ladder the shortfall is internally monotone (0.1742 > 0.0920 > 0.0468); the non-monotonicity is only visible when the p = 0 mod 4 dips between the rungs are included.",
  },
  nonMonotoneTriple: {
    samples: NONMONO_TRIPLE,
    finding:
      "explicit consecutive-p non-monotonicity: p=95 (3 mod 4) 0.3551 -> p=96 (0 mod 4) 0.1360 -> p=97 (1 mod 4) 0.1742; the shortfall DROPS through the multiple of 4 then rises, so shortfall(p) is not monotone in p.",
  },
  crossCheck: {
    reproducedEnv02: ENV02,
    siblingEnv02: SIB_ENV02,
    reproducedShortfall97: LADDER_95090[0].shortfall,
    siblingShortfall97: 0.17415257650513827,
    note: "independently reproduces the imp-95008 corner literal envE(0,2) and the imp-95090 fixed-97 dominant-cell shortfall before quoting the sweep.",
  },
  routingConsequence:
    "fixed-lane characterization of a witness-side finite-rate effect: confirms the O(1/p) envelope of imp-95090 Finding (4) and explains its non-monotonicity as a mod-4 aliasing phase (dips at 4|p where the dyadic corner is a grid point). NO bracket moved; envE remains a valid per-pair upper bound.",
  openResiduals: [
    "extends imp-95090 Finding (4) only for the dominant cell (0,2); deeper cells (b,j) alias on 2^-(b+j) so their dips sit at p = 0 mod 2^(b+j) - the same mechanism, not tabulated here",
    "the per-class asymptotic constants C(p mod 4) are measured, not derived in closed form from the corner Taylor expansion (that O(eps) rate is the sibling imp-95121 ticket)",
  ],
  isRigorous: true,
  rigorScope:
    "Measurement + elementary number-theoretic derivation. The realized sups are exact finite enumerations over the p-grid admissible pairs; envE(0,2) is reproduced by an independent closed-form copy and cross-checked against the imp-95008 continuation-twenty baked literal 3.9197920255561178e-5 to rel 1e-12, and the fixed-97 shortfall against imp-95090s 0.17415257650513827 to rel 1e-9. The divisibility <-> exact-hit equivalence is verified over the whole sweep. The characterization moves no bound; envE remains a valid per-pair upper bound.",
  promotesBound: false,
  verdict:
    "DERIVATION/MEASUREMENT (no bracket move): the imp-95090 grid-corner attainment shortfall at cell (0,2) obeys shortfall(p) ~ C(p mod 4)/p, four interleaved O(1/p) branches whose constant is set by the residue of p modulo 4 = 2^(b+j) - the number-theoretic condition is DIVISIBILITY: a grid point hits the dyadic corner coordinate 2^-k exactly iff 2^k | p, so the aliasing dips are precisely p = 0 mod 4 (both 1/2 and 1/4 are grid points) with dip-floor constant C_0 ~ 14.0, versus C_1 ~ 18.2 (the imp-95090 prime ladder, internally monotone), C_2 ~ 35.5, C_3 ~ 39.5 (worst envelope). The non-monotonicity of Finding (4) is the mod-4 phase: p=95 -> 96 -> 97 gives 0.3551 -> 0.1360 -> 0.1742. Independently reproduces the imp-95008 corner literal and the imp-95090 fixed-97 shortfall. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) ---------------------------
export const IMP95117_ALIASING_ASSERTIONS = [
  {
    id: "imp95117-env02-reproduction",
    description:
      "independent code path reproduces the imp-95008 corner literal envE(0,2) = 3.9197920255561178e-5 (rel 1e-12)",
    holds: () => Math.abs(ENV02 - SIB_ENV02) <= 1e-12 * SIB_ENV02,
  },
  {
    id: "imp95117-fixed97-crosscheck",
    description:
      "the reproduced fixed p=97 dominant-cell shortfall matches the imp-95090 literal 0.17415257650513827 (rel 1e-9)",
    holds: () => Math.abs(LADDER_95090[0].shortfall - 0.17415257650513827) <= 1e-9,
  },
  {
    id: "imp95117-divisibility-exact-hit",
    description:
      "the divisibility <-> exact-corner-hit equivalence (2|p <=> 1/2 hit, 4|p <=> 1/4 hit) holds for every p in the sweep [60,420]",
    holds: () => DIVISIBILITY_EXACT === true,
  },
  {
    id: "imp95117-class-constant-ordering",
    description:
      "the per-residue-class shortfall*p asymptotic constants are strictly ordered C_0 < C_1 < C_2 < C_3 (dip floor at 0 mod 4, worst at 3 mod 4), with C_0 ~ 14 and C_3 ~ 40",
    holds: () =>
      CLASS_CONSTANTS[0] < CLASS_CONSTANTS[1] &&
      CLASS_CONSTANTS[1] < CLASS_CONSTANTS[2] &&
      CLASS_CONSTANTS[2] < CLASS_CONSTANTS[3] &&
      CLASS_CONSTANTS[0] > 12 &&
      CLASS_CONSTANTS[0] < 16 &&
      CLASS_CONSTANTS[3] > 36 &&
      CLASS_CONSTANTS[3] < 44,
  },
  {
    id: "imp95117-nonmonotone-triple",
    description:
      "explicit non-monotonicity: shortfall(95) > shortfall(96) < shortfall(97) - the shortfall DIPS at the multiple of 4 (96) then rises, so it is not monotone in p",
    holds: () =>
      NONMONO_TRIPLE[0].shortfall > NONMONO_TRIPLE[1].shortfall &&
      NONMONO_TRIPLE[1].shortfall < NONMONO_TRIPLE[2].shortfall &&
      NONMONO_TRIPLE[1].mod4 === 0,
  },
  {
    id: "imp95117-dip-below-ladder",
    description:
      "the p=0 mod 4 aliasing dips sit strictly below the neighbouring imp-95090 ladder rung of the same magnitude (dip at 96 below the 97 rung; dip at 392 below the 389 rung), confirming the dip floor is the deepest branch",
    holds: () =>
      DIP_SAMPLES[0].shortfall < LADDER_95090[0].shortfall && // 96 < 97
      DIP_SAMPLES[2].shortfall < LADDER_95090[2].shortfall, // 392 < 389
  },
  {
    id: "imp95117-honesty-gate",
    description:
      "verdict is a measurement/derivation step: promotes no bound, NO QED, no refereed bound is changed, names the divisibility mechanism and residuals",
    holds: () =>
      IMP95117_ALIASING_NONMONOTONICITY_MOD4.promotesBound === false &&
      IMP95117_ALIASING_NONMONOTONICITY_MOD4.openResiduals.length === 2 &&
      /NO QED/.test(IMP95117_ALIASING_NONMONOTONICITY_MOD4.verdict) &&
      /refereed bound is changed/i.test(IMP95117_ALIASING_NONMONOTONICITY_MOD4.verdict) &&
      /no bracket move/.test(IMP95117_ALIASING_NONMONOTONICITY_MOD4.verdict) &&
      /DIVISIBILITY/.test(IMP95117_ALIASING_NONMONOTONICITY_MOD4.verdict),
  },
];

for (const a of IMP95117_ALIASING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95117-aliasing-nonmonotonicity-mod4 assertion failed: ${a.id}`);
  }
}

export default IMP95117_ALIASING_NONMONOTONICITY_MOD4;
