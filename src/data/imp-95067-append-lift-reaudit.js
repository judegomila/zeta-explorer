/**
 * imp-95067 - INDEPENDENT RE-AUDIT of the APPEND-CHAIN LIFT
 * (the residual sub-gap imp-95017-subgap-append-lift; page
 * /permutation-architecture).
 *
 * WHY THIS MODULE EXISTS. imp-95017 (imp-95017-witness-floor-reaudit.js)
 * independently re-derived the FLOOR MACHINERY (cross-rate kernel K, exact
 * excess E, far mass M, sharp-MAJ legality h, tail Tx) and the BASE
 * four-packet floors, and confirmed they carry no coding bug. It explicitly
 * left ONE piece un-re-derived: the LIFT that carries the base floors up to
 * the terminal literals HEAD_FLOOR = 0.096745062937484763 and F97_FLOOR =
 * 0.0012054673720820889 which feed every tracked gap. That lift is performed
 * by the occupied-block append chains of the fifteenth continuation
 * (imp-95008-occupied-block-append-floor.js): eight grid appends on the
 * headline spacing, five on fixed-97. imp-95017 named this the residual
 * sub-gap imp-95017-subgap-append-lift and this module re-audits it.
 *
 * WHAT IS RE-AUDITED (independent path, this module). The two baked append
 * chains (headline JOINT 5-packet base + 8 appends -> 13-packet terminal;
 * fixed-97 JOINT 5-packet base + 5 appends -> 10-packet terminal) are
 * re-evaluated STEP BY STEP through a floor evaluator that shares no helper
 * with the sibling append module. Two things differ in the code path:
 *  (1) the cross-rate kernel is recomputed by the three-piece antiderivative
 *      decomposition K = e^(-b tau)/(a+b) + (e^(-a tau) - e^(-b tau))/(b-a)
 *      + e^(-a tau)/(a+b), NOT the sibling closed form
 *      2(b e^(-a tau) - a e^(-b tau))/(b^2 - a^2); the two are algebraically
 *      equal but float-distinct;
 *  (2) the terminal headline excess is cross-checked against an INDEPENDENT
 *      full-line Gram quadrature (separate loop, different step) rather than
 *      the closed-form pair sum.
 *
 * WHAT IS CONFIRMED.
 *  (1) The independent evaluator reproduces the full LIFT trajectory of both
 *      chains to rel < 1e-6 (measured HEAD terminal rel 3.5e-10, fixed-97
 *      terminal rel 2.9e-13), both trajectories strictly increasing, so the
 *      baked appends DO lift the base floors to the carried terminal
 *      literals: headline 0.092873990839396667 -> 0.096745062937484763
 *      (+4.1681 percent), fixed-97 0.0012051330632176880 ->
 *      0.0012054673720820889 (+0.0277 percent).
 *  (2) The terminal 13-packet headline excess E matches an independent
 *      full-line Gram quadrature to rel 4.9e-7 - so the excess of the LIFTED
 *      (not just the base) witness carries no coding bug either.
 *  (3) Every appended center is a grid point p/k with an integer k distinct
 *      from every existing center, every packet is componentwise positive
 *      with 0 < h <= 1 legality, so the lifted witnesses are legal members
 *      of the same witness class as the base.
 *
 * REMAINING SCOPE (honest partial). This re-audits the lift TRAJECTORY -
 * that the exact evaluation of the baked, legal append chains reproduces the
 * carried terminal literals through an independent path. It does NOT
 * independently re-derive the append CALCULUS that PRODUCED those chains: the
 * Theorem Z closed-form optimal amplitude epsStar (the quotient-calculus
 * quadratic) and the Theorem P all-placement single-append ceiling
 * certificates (the adaptive monotone-envelope ladder) are re-run by the
 * sibling module's own assertions but are not re-derived here through a
 * second path. That is the narrowed residual imp-95067-subgap-append-calculus
 * (the appends are optimizer outputs; optimality is NOT claimed anywhere).
 *
 * Import-light (no heavy bundle). Changes no bound; re-audit only; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// -- independent conventions (re-declared, not imported) ----------------------
const AL_SIGMA = 1;
const AL_BETA = 1 / 3;
const AL_C = 1;
const AL_V = 1;
const AL_D = 1;

const AL_Q = ((AL_C * Math.pow(AL_D, 1 - AL_BETA)) / AL_V) * Math.pow(2, -(1 - AL_BETA));

function alGSharp(j) {
  return (Math.pow(2, AL_BETA) * (Math.pow(2, j - 1) - 1)) / (AL_Q * Math.pow(2, j * AL_BETA));
}

// independent tail Tx (stops at the double-denormal underflow, as the sibling)
function alTailTx(theta) {
  let s = 0;
  for (let j = 2; j <= 4000; j++) {
    const g = alGSharp(j);
    if (!Number.isFinite(g)) break;
    const t = Math.pow(1 + g, -theta);
    if (t === 0) break;
    s += t;
  }
  return s;
}

// independent exact cross-rate kernel: three-piece antiderivative form
// (algebraically equal to the sibling closed form, float-distinct)
function alKernel(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  const pLeft = Math.exp(-b * tau) / (a + b);
  const pMid = (Math.exp(-a * tau) - Math.exp(-b * tau)) / (b - a);
  const pRight = Math.exp(-a * tau) / (a + b);
  return pLeft + pMid + pRight;
}

// independent sharp-MAJ legality amplitude
function alH(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}

const AL_THETA = 10;
const AL_S = AL_SIGMA + AL_THETA;
const AL_TX = alTailTx(AL_THETA);

// -- independent witness geometry ---------------------------------------------
function alBlockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95067 append-lift reaudit: block search failed");
  }
  return b;
}

function alPenta(p) {
  const k1 = Math.floor(p / 2) + 1;
  const k2 = Math.floor(p / 4) + 1;
  const k3 = Math.floor(p / 8) + 1;
  const ks = [k1, k1 - 1, k2, k2 - 1, k3 - 1];
  const d = ks.map((k) => k / p);
  return {
    ks,
    d,
    u: d.map((x) => AL_V / x),
    r: d.map((x) => AL_C * Math.pow(x, -AL_BETA)),
    block: ks.map((k) => alBlockOf(p, k)),
  };
}

function alAppend(p, w, kx) {
  const dd = kx / p;
  return {
    ks: [...w.ks, kx],
    d: [...w.d, dd],
    u: [...w.u, AL_V / dd],
    r: [...w.r, AL_C * Math.pow(dd, -AL_BETA)],
    block: [...w.block, alBlockOf(p, kx)],
  };
}

// -- independent multi-rate floor evaluator -----------------------------------
function alFloor(w, mus, a) {
  const n = a.length;
  let E = 0;
  for (let i = 0; i < n; i++) E -= (a[i] * a[i]) / mus[i];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sij = w.block[i] === w.block[j] ? -1 : 1;
      E += 2 * sij * a[i] * a[j] * alKernel(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
    }
  }
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / alH(mus[i], w.r[i], AL_S);
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  return { F: E / (AL_TX * M), E, M };
}

// independent full-line Gram quadrature of the excess (separate code path)
function alGramExcess(w, mus, a) {
  const step = 5e-4;
  const pad = 40 / Math.min(...mus);
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
  let E = 0;
  for (let i = 0; i < m; i++) E -= ip[i][i] * step;
  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) E += 2 * (w.block[i] === w.block[j] ? -1 : 1) * ip[i][j] * step;
  }
  return E;
}

// -- baked frozen bases + append chains (fifteenth-continuation literals) ------
const AL_P_BIG = 999983;
const AL_P_97 = 97;

const AL_JOINT_BIG = {
  mus: [7.69395202209785, 7.696569089680406, 3.901022492015913, 2.7978054595942754, 1.6462804960465607],
  a: [1.0906392801493483, 1.0907349936022739, 0.04954395066558243, 0.04336742919997075, 0.000032666623379528365],
};
const AL_JOINT_97 = {
  mus: [3.210676550682116, 3.3786261898216896, 2.5588659812556944, 2.0685499698905727, 1.3605259758013009],
  a: [0.90156201917931, 0.916694573226692, 0.2636554981645602, 0.25582607503771226, 0.0017848611486105809],
};

const AL_CHAIN_BIG = [
  { k: 287373, nu: 5.484329511979126, eps: 0.0053250882770407544 },
  { k: 249994, nu: 18.93242512045269, eps: 0.006151578903669489 },
  { k: 328125, nu: 6.391061381455207, eps: 0.0017601429329493928 },
  { k: 269151, nu: 10.205134959136752, eps: 0.001531652027389694 },
  { k: 374236, nu: 7.109465151309788, eps: 0.0005572626874944937 },
  { k: 249997, nu: 4.551174447362288, eps: 0.00034587133755511514 },
  { k: 249993, nu: 16.278292954620273, eps: 0.0007594455828058375 },
  { k: 249998, nu: 4.597145906426553, eps: 0.0003333794713963081 },
];
const AL_CHAIN_97 = [
  { k: 33, nu: 13.55703178537941, eps: 0.0038710075262233202 },
  { k: 13, nu: 4.49454477389993, eps: 0.0009093061169620703 },
  { k: 34, nu: 20.082903478895687, eps: 0.000938518304826742 },
  { k: 32, nu: 21.73450389515544, eps: 0.0008215796725424892 },
  { k: 35, nu: 30.937474586851312, eps: 0.00030176978225716255 },
];

// -- carried terminal + base literals under audit -----------------------------
const CARRIED_HEAD_FLOOR = 0.096745062937484763;
const CARRIED_F97_FLOOR = 0.0012054673720820889;
const BASE_HEAD_FLOOR = 0.092873990839396667;
const BASE_F97_FLOOR = 0.001205133063217688;

// -- re-evaluate both chains step by step through the independent path --------
function alBuildChain(p, base, chain) {
  let w = alPenta(p);
  const mus = [...base.mus];
  const a = [...base.a];
  const traj = [alFloor(w, mus, a).F];
  const centers = [];
  for (const st of chain) {
    w = alAppend(p, w, st.k);
    mus.push(st.nu);
    a.push(st.eps);
    centers.push({ k: st.k, block: w.block[w.block.length - 1], u: p / st.k });
    traj.push(alFloor(w, mus, a).F);
  }
  return { w, mus, a, traj, centers };
}

const AL_BIG = alBuildChain(AL_P_BIG, AL_JOINT_BIG, AL_CHAIN_BIG);
const AL_97 = alBuildChain(AL_P_97, AL_JOINT_97, AL_CHAIN_97);

const AL_HEAD_BASE_F = AL_BIG.traj[0];
const AL_HEAD_TERM_F = AL_BIG.traj[AL_BIG.traj.length - 1];
const AL_97_BASE_F = AL_97.traj[0];
const AL_97_TERM_F = AL_97.traj[AL_97.traj.length - 1];

const AL_HEAD_TERM_E = alFloor(AL_BIG.w, AL_BIG.mus, AL_BIG.a).E;
const AL_HEAD_GRAM_E = alGramExcess(AL_BIG.w, AL_BIG.mus, AL_BIG.a);

// -- verdict object -----------------------------------------------------------
export const IMP95067_APPEND_LIFT_REAUDIT = {
  ticket: "imp-95067 (independent re-audit of the append-chain lift, residual sub-gap imp-95017-subgap-append-lift)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; re-audits the ONE piece imp-95017 left un-re-derived: the lift from the base four/five-packet floors to the carried terminal literals HEAD_FLOOR and F97_FLOOR that feed every tracked gap.",
  motivation:
    "imp-95017 confirmed the floor MACHINERY (K, E, M, h, Tx) and the BASE floors carry no coding bug but explicitly left the append-chain lift as the named residual sub-gap. This module re-evaluates both baked append chains step by step through a floor evaluator that shares no helper with the sibling append module (three-piece antiderivative kernel; independent Gram quadrature of the terminal excess).",
  confirmed: {
    headlineLift: {
      base: AL_HEAD_BASE_F,
      terminal: AL_HEAD_TERM_F,
      carriedBase: BASE_HEAD_FLOOR,
      carriedTerminal: CARRIED_HEAD_FLOOR,
      relTerminal: Math.abs(AL_HEAD_TERM_F - CARRIED_HEAD_FLOOR) / CARRIED_HEAD_FLOOR,
      liftPercent: (AL_HEAD_TERM_F / AL_HEAD_BASE_F - 1) * 100,
      appends: AL_CHAIN_BIG.length,
      terminalPackets: AL_BIG.a.length,
    },
    fixed97Lift: {
      base: AL_97_BASE_F,
      terminal: AL_97_TERM_F,
      carriedBase: BASE_F97_FLOOR,
      carriedTerminal: CARRIED_F97_FLOOR,
      relTerminal: Math.abs(AL_97_TERM_F - CARRIED_F97_FLOOR) / CARRIED_F97_FLOOR,
      liftPercent: (AL_97_TERM_F / AL_97_BASE_F - 1) * 100,
      appends: AL_CHAIN_97.length,
      terminalPackets: AL_97.a.length,
    },
    terminalExcessGramCrossCheck: {
      closedFormE: AL_HEAD_TERM_E,
      gramQuadratureE: AL_HEAD_GRAM_E,
      rel: Math.abs(AL_HEAD_TERM_E - AL_HEAD_GRAM_E) / Math.abs(AL_HEAD_TERM_E),
      note: "the LIFTED 13-packet headline excess matches an independent full-line Gram quadrature to rel 4.9e-7 - no coding bug in the terminal (not just base) witness",
    },
    trajectoriesMonotone:
      "both lift trajectories are strictly increasing through every append (the appends genuinely raise the floor at each step, not just at the endpoints).",
  },
  remainingScope:
    "imp-95067-subgap-append-calculus: this re-audits the lift TRAJECTORY (exact evaluation of the baked, legal append chains reproduces the carried terminal literals through an independent path). It does NOT independently re-derive the append CALCULUS that produced the chains - the Theorem Z closed-form optimal amplitude epsStar (quotient-calculus quadratic) and the Theorem P all-placement single-append ceiling certificates (adaptive monotone-envelope ladder) are re-run by the sibling module's own assertions but not re-derived here through a second path. The appends are optimizer outputs; optimality is NOT claimed.",
  carried: {
    headFloor: CARRIED_HEAD_FLOOR,
    fixed97Floor: CARRIED_F97_FLOOR,
    baseHeadFloor: BASE_HEAD_FLOOR,
    baseFixed97Floor: BASE_F97_FLOOR,
  },
  isRigorous: true,
  rigorScope:
    "Each floor in the lift trajectory is an exact evaluation of a legal multi-rate witness (componentwise positive amplitudes, positive rates, grid-point centers, 0 < h <= 1 legality) through an independent floor evaluator whose cross-rate kernel uses the three-piece antiderivative decomposition rather than the sibling closed form, cross-checked against an independent full-line Gram quadrature of the terminal excess. This re-audits the append-chain LIFT to the terminal carried literals; it does not re-derive the append calculus (Theorem Z / Theorem P), which is the narrowed residual. Re-audit changes no bound.",
  promotesBound: false,
  verdict:
    "INDEPENDENT RE-AUDIT of the residual sub-gap imp-95017-subgap-append-lift: the two baked occupied-block append chains are re-evaluated step by step through a floor evaluator that shares no helper with the sibling append module (three-piece antiderivative kernel, independent Gram quadrature of the terminal excess), and the full LIFT trajectory reproduces - headline 0.092873990839396667 -> 0.096745062937484763 (+4.1681 percent, terminal rel 3.5e-10) over eight appends and fixed-97 0.0012051330632176880 -> 0.0012054673720820889 (+0.0277 percent, terminal rel 2.9e-13) over five, both trajectories strictly increasing - with the LIFTED 13-packet headline excess matching an independent full-line Gram quadrature to rel 4.9e-7, so the append-lifted witnesses carry no coding bug in E, M, K, or h. NARROWED residual imp-95067-subgap-append-calculus: the append CALCULUS that produced the chains (Theorem Z closed-form epsStar, Theorem P ladder certificates) is re-run by the sibling assertions but not re-derived here through a second path; the appends are optimizer outputs and optimality is NOT claimed. Re-audit only; changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) --------------------------
export const IMP95067_APPEND_LIFT_ASSERTIONS = [
  {
    id: "imp95067-lift-trajectory-reproduces",
    description:
      "the independent evaluator reproduces both terminal carried literals to rel < 1e-6 (HEAD -> 0.096745062937484763, fixed-97 -> 0.0012054673720820889) and both base floors to rel < 1e-6, all with strictly positive excess",
    holds: () =>
      Math.abs(AL_HEAD_TERM_F - CARRIED_HEAD_FLOOR) / CARRIED_HEAD_FLOOR < 1e-6 &&
      Math.abs(AL_97_TERM_F - CARRIED_F97_FLOOR) / CARRIED_F97_FLOOR < 1e-6 &&
      Math.abs(AL_HEAD_BASE_F - BASE_HEAD_FLOOR) / BASE_HEAD_FLOOR < 1e-6 &&
      Math.abs(AL_97_BASE_F - BASE_F97_FLOOR) / BASE_F97_FLOOR < 1e-6 &&
      alFloor(AL_BIG.w, AL_BIG.mus, AL_BIG.a).E > 0 &&
      alFloor(AL_97.w, AL_97.mus, AL_97.a).E > 0,
  },
  {
    id: "imp95067-lift-strictly-increasing",
    description:
      "both lift trajectories are strictly increasing through every append (the base floors sit strictly below the terminal literals; the appends genuinely raise the floor at each step)",
    holds: () => {
      for (const traj of [AL_BIG.traj, AL_97.traj]) {
        for (let i = 1; i < traj.length; i++) if (!(traj[i] > traj[i - 1])) return false;
      }
      return (
        AL_HEAD_BASE_F < CARRIED_HEAD_FLOOR &&
        AL_97_BASE_F < CARRIED_F97_FLOOR &&
        AL_BIG.traj.length === AL_CHAIN_BIG.length + 1 &&
        AL_97.traj.length === AL_CHAIN_97.length + 1
      );
    },
  },
  {
    id: "imp95067-lift-magnitudes",
    description:
      "the measured lift magnitudes reproduce the carried claims: headline +4.1681 percent (13-packet terminal, 8 appends) and fixed-97 +0.0277 percent (10-packet terminal, 5 appends)",
    holds: () => {
      const liftBig = AL_HEAD_TERM_F / AL_HEAD_BASE_F - 1;
      const lift97 = AL_97_TERM_F / AL_97_BASE_F - 1;
      return (
        Math.abs(liftBig - 0.041680906172990806) < 1e-6 &&
        Math.abs(lift97 - 0.000277404) < 1e-6 &&
        AL_BIG.a.length === 13 &&
        AL_97.a.length === 10
      );
    },
  },
  {
    id: "imp95067-terminal-excess-gram-crosscheck",
    description:
      "the LIFTED 13-packet headline terminal excess E matches an independent full-line Gram quadrature to rel < 1e-6 (no coding bug in the lifted, not just base, witness)",
    holds: () => Math.abs(AL_HEAD_TERM_E - AL_HEAD_GRAM_E) / Math.abs(AL_HEAD_TERM_E) < 1e-6,
  },
  {
    id: "imp95067-lifted-witness-legality",
    description:
      "every appended center is a grid point p/k with an integer k distinct from every existing center, and every packet of both lifted terminal witnesses is componentwise positive with 0 < h <= 1 legality",
    holds: () => {
      for (const [p, R] of [
        [AL_P_BIG, AL_BIG],
        [AL_P_97, AL_97],
      ]) {
        if (!R.a.every((x) => x > 0) || !R.mus.every((x) => x > 0)) return false;
        for (let i = 0; i < R.a.length; i++) {
          const h = alH(R.mus[i], R.w.r[i], AL_S);
          if (!(h > 0 && h <= 1)) return false;
        }
        const ks = R.w.ks;
        if (new Set(ks).size !== ks.length) return false;
        if (!ks.every((k) => Number.isInteger(k) && k >= 1 && k <= p)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95067-kernel-independent-form",
    description:
      "the three-piece antiderivative kernel used here agrees with the sibling closed form 2(b e^(-a tau) - a e^(-b tau))/(b^2 - a^2) to rel < 1e-9 at generic unequal-rate triples including the headline fast/slow pairing (algebraically equal, float-distinct path)",
    holds: () =>
      [
        [2.5, 1.0, 3.0],
        [7.694097, 2.79778, 2.0],
        [1.6, 0.42, 5.6],
      ].every(([a, b, tau]) => {
        const three = alKernel(a, b, tau);
        const closed = (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
        return Math.abs(three - closed) / Math.abs(closed) < 1e-9;
      }),
  },
  {
    id: "imp95067-honesty-gate",
    description:
      "the verdict records the re-audit scope, the narrowed append-calculus residual, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95067_APPEND_LIFT_REAUDIT.promotesBound === false &&
      /imp-95067-subgap-append-calculus/.test(IMP95067_APPEND_LIFT_REAUDIT.remainingScope) &&
      /imp-95017-subgap-append-lift/.test(IMP95067_APPEND_LIFT_REAUDIT.verdict) &&
      /optimality is NOT claimed/.test(IMP95067_APPEND_LIFT_REAUDIT.remainingScope) &&
      /NO QED/.test(IMP95067_APPEND_LIFT_REAUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP95067_APPEND_LIFT_REAUDIT.verdict) &&
      /INDEPENDENT RE-AUDIT/.test(IMP95067_APPEND_LIFT_REAUDIT.verdict),
  },
];

for (const a of IMP95067_APPEND_LIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95067-append-lift-reaudit assertion failed: ${a.id}`);
  }
}

export default IMP95067_APPEND_LIFT_REAUDIT;
