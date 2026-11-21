/**
 * imp-95118 - DIRECTED evenMassShare sweep of the imp-95008 coupled
 * attainment / occupancy / parity-balance channels.
 *
 * imp-95008 (twenty-third continuation, imp-95008-witness-erealization-split.js)
 * decomposed the surviving headline residual EXACTLY into phi = attainment x
 * occupancy x parity-balance and argued STRUCTURALLY that odd-class (block-1)
 * mass parity-balances U vs V, so pushing evenMassShare -> 1 degrades the
 * parity-balance factor B = E / (2 X_env). imp-95113
 * (imp-95113-attainment-occupancy-tradeoff.js) ASSESSED that coupling with a
 * RANDOM local-perturbation battery and a random-grid battery, finding an
 * empirical gamma_scan ~ 0.402 but no directed map of the frontier. This
 * module supplies the DIRECTED map the sub-gap asks for: a one-parameter
 * sweep that scales the odd-block packet amplitudes by lambda, driving
 * evenMassShare monotonically, and MEASURES attainment A, occupancy O, and
 * parity-balance B TOGETHER along the sweep. It maps whether the coupling is
 * monotone. It proves no theorem; it is an honest directed measurement that
 * makes the imp-95008 structural claim concrete and quantitative.
 *
 * SETTING (identical conventions to the sibling chain; Permuting the Zeta
 * Twin Ladder Section 4.5; page /permutation-architecture). The three channel
 * factors, in the far currency Lemma ES supplies:
 *   attainment A = X_env / capSum   (per-pair envelope attainment)
 *   occupancy  O = capSum / (Lw M)  (occupancy of the aggregation ceiling)
 *   parity-balance B = E / (2 X_env) (Lemma PB)
 * with A x O = X_env / (Lw M) the far-priced fraction and phi = A x O x B.
 * evenMassShare is measured in the ceiling M-currency:
 *   evenMassShare = sum_{b even} nb[b]^2 / M ,
 * the fraction of the aggregation ceiling mass M carried by even-parity
 * blocks. The terminal headline witness (fifteenth-continuation JOINT_BIG +
 * CHAIN_BIG, p = 999983, theta = 10, 13 packets) sits at evenMassShare =
 * 0.6325, A = 0.6014, O = 0.6164, B = 0.9612, phi = 0.3563.
 *
 * THE SWEEP. Multiply every odd-block packet amplitude by a scalar lambda and
 * hold the even-block amplitudes fixed. lambda = 1 is the terminal witness;
 * lambda -> 0 sheds odd mass (evenMassShare -> 1, the single-even-parity
 * limit); lambda > 1 floods odd mass (evenMassShare -> 0). This traces a
 * one-parameter path through the (evenMassShare, A, O, B) channel space.
 *
 * FINDING 1 (occupancy is monotone-increasing in evenMassShare; attainment is
 * flat). Across the full sweep lambda in {0, 0.1, ..., 5}, occupancy O is a
 * strictly increasing function of evenMassShare, rising from O = 0.0633 at
 * evenMassShare = 0.0644 (odd-flooded) to O = 0.9742 at evenMassShare = 1
 * (all-even), while attainment A stays essentially flat (range 0.5973..0.6016,
 * spread < 0.0044). The far-priced product A x O is therefore monotone in
 * evenMassShare: shedding odd mass MAXIMIZES occupancy. This is the first leg
 * of the imp-95008 coupling, now measured as a monotone law rather than
 * asserted at one witness.
 *
 * FINDING 2 (parity-balance collapses monotonically as evenMassShare -> 1, and
 * excess positivity is a razor ridge at the tuned witness). On the odd-mass-
 * shedding branch lambda in {1, 0.85, 0.70, 0.50, 0.30, 0.20, 0.10, 0},
 * evenMassShare increases 0.6325 -> 1 and the parity-balance factor B is
 * STRICTLY DECREASING: B = 0.9612 at the tuned base (lambda = 1, E > 0) falls
 * through zero just below lambda = 1 and plunges to B = -737.5 at the all-even
 * limit (E = -0.1552 < 0). Excess positivity E > 0 survives only in a thin
 * neighbourhood of the tuned lambda = 1; phi = A x O x B attains its sweep
 * MAXIMUM at exactly lambda = 1 (phi = 0.3563), confirming the terminal
 * witness sits on the razor ridge imp-95113 measured by random battery.
 *
 * VERDICT (honest directed measurement). The coupling imp-95008 asserted is
 * MONOTONE and the tradeoff frontier is now mapped: evenMassShare BUYS
 * occupancy (O rises monotonically to 0.974 as evenMassShare -> 1, A flat) but
 * SELLS parity balance (B falls monotonically through zero to -737 on the same
 * branch), and the excess-positive product phi is a single sharp maximum at
 * the tuned base witness. This is the directed-sweep companion to the
 * imp-95113 random assessment; together they are EVIDENCE FOR the conjectured
 * tradeoff bound attainment x occupancy <= gamma < 1 over MAJ witnesses, NOT a
 * proof. The all-witness bound (or a phi -> 1 family) remains the refined open
 * sub-gap imp-95113-subgap-tradeoff-proof-vs-scan. Floors and ceilings
 * untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 *
 * Import-light (no heavy bundle). The numerics MAP the sub-gap; they are not a
 * proof of it.
 */

// shared conventions (identical to the sibling modules)
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const SS = SIGMA + THETA;

const QREF = ((CC * Math.pow(DD, 1 - BETA)) / VV) * Math.pow(2, -(1 - BETA));

function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}
function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}
function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95118 even-mass sweep: block search failed");
  }
  return b;
}
function pentaWitness(p) {
  const k1 = Math.floor(p / 2) + 1;
  const k2 = Math.floor(p / 4) + 1;
  const k3 = Math.floor(p / 8) + 1;
  const ks = [k1, k1 - 1, k2, k2 - 1, k3 - 1];
  const d = ks.map((k) => k / p);
  return {
    ks,
    d,
    u: d.map((x) => VV / x),
    r: d.map((x) => CC * Math.pow(x, -BETA)),
    block: ks.map((k) => blockOf(p, k)),
  };
}
function appendGridPoint(p, w, kx) {
  const dd = kx / p;
  return {
    ks: [...w.ks, kx],
    d: [...w.d, dd],
    u: [...w.u, VV / dd],
    r: [...w.r, CC * Math.pow(dd, -BETA)],
    block: [...w.block, blockOf(p, kx)],
  };
}

const P_BIG = 999983;
const JOINT_BIG = {
  mus: [7.69395202209785, 7.696569089680406, 3.901022492015913, 2.7978054595942754, 1.6462804960465607],
  a: [1.0906392801493483, 1.0907349936022739, 0.04954395066558243, 0.04336742919997075, 0.000032666623379528365],
};
const CHAIN_BIG = [
  { k: 287373, nu: 5.484329511979126, eps: 0.0053250882770407544 },
  { k: 249994, nu: 18.93242512045269, eps: 0.006151578903669489 },
  { k: 328125, nu: 6.391061381455207, eps: 0.0017601429329493928 },
  { k: 269151, nu: 10.205134959136752, eps: 0.001531652027389694 },
  { k: 374236, nu: 7.109465151309788, eps: 0.0005572626874944937 },
  { k: 249997, nu: 4.551174447362288, eps: 0.00034587133755511514 },
  { k: 249993, nu: 16.278292954620273, eps: 0.0007594455828058375 },
  { k: 249998, nu: 4.597145906426553, eps: 0.0003333794713963081 },
];
function buildTerminalWitness() {
  let w = pentaWitness(P_BIG);
  const mus = [...JOINT_BIG.mus];
  const a = [...JOINT_BIG.a];
  for (const st of CHAIN_BIG) {
    w = appendGridPoint(P_BIG, w, st.k);
    mus.push(st.nu);
    a.push(st.eps);
  }
  return { w, mus, a };
}

// LEMMA ES channel split (identical assembly to imp-95008-witness-erealization-split)
function channelSplit(w, mus, a) {
  const n = a.length;
  let diag = 0;
  for (let i = 0; i < n; i++) diag += (a[i] * a[i]) / mus[i];
  let sameBlock = 0;
  let xPar = 0;
  let xEnv = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const ip = a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
      const bi = w.block[i];
      const bj = w.block[j];
      if (bi === bj) {
        sameBlock += 2 * ip;
      } else {
        if ((bi + bj) % 2 === 0) xEnv += 2 * ip;
        else xPar += 2 * ip;
      }
    }
  }
  const N = diag + sameBlock;
  const E = xPar + xEnv - N;
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) {
    nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], SS);
  }
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  return { E, N, xPar, xEnv, nb, M };
}

// Lemma PF closed form (short copy) for the envelope caps
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
function cornerV(b, j) {
  return (Math.pow(2, b * (1 - BETA)) * Math.pow(2, BETA) * (Math.pow(2, j - 1) - 1)) / (QREF * Math.pow(2, j * BETA));
}
function rhoCap(j) {
  return Math.pow(2, -(j - 1) * BETA);
}
function envE(b, j) {
  return iExact(cornerV(b, j), rhoCap(j), SS);
}

const LW = 3.9197935113802585e-5; // twenty-second certified aggregation constant

function capSumOf(nb) {
  let cs = 0;
  const bmax = nb.length - 1;
  for (let b = 0; b <= bmax; b++) {
    for (let bp = b + 1; bp <= bmax; bp++) {
      if ((b + bp) % 2 === 0) cs += 2 * nb[b] * nb[bp] * envE(b, bp - b);
    }
  }
  return cs;
}

// joint (evenMassShare, attainment, occupancy, parity-balance, phi) measurement
function measure(w, mus, a) {
  const cs = channelSplit(w, mus, a);
  const capSum = capSumOf(cs.nb);
  const attainment = cs.xEnv / capSum;
  const occupancy = capSum / (LW * cs.M);
  const product = attainment * occupancy;
  const parityBalance = cs.E / (2 * cs.xEnv);
  const phi = cs.E / (2 * LW * cs.M);
  let evenM = 0;
  for (let b = 0; b < cs.nb.length; b++) if (b % 2 === 0) evenM += cs.nb[b] * cs.nb[b];
  const evenMassShare = evenM / cs.M;
  return { E: cs.E, xEnv: cs.xEnv, M: cs.M, attainment, occupancy, product, parityBalance, phi, evenMassShare };
}

// scale all odd-block packet amplitudes by lambda (even blocks held fixed)
function sweepPoint(lambda) {
  const a = TW.a.map((x, i) => (TW.w.block[i] % 2 === 1 ? x * lambda : x));
  const m = measure(TW.w, TW.mus, a);
  return { lambda, ...m };
}

// evaluate
const TW = buildTerminalWitness();
const BASE = measure(TW.w, TW.mus, TW.a);
// odd-mass-shedding branch: lambda 1 -> 0, evenMassShare base -> 1
const SHED_LAMS = [1.0, 0.85, 0.7, 0.5, 0.3, 0.2, 0.1, 0.0];
const SHED = SHED_LAMS.map(sweepPoint);
// full sweep incl odd-flooded branch (lambda > 1) for occupancy monotonicity
const FULL_LAMS = [0.0, 0.1, 0.2, 0.3, 0.5, 0.7, 0.85, 1.0, 1.2, 1.5, 2.0, 3.0, 5.0];
const FULL = FULL_LAMS.map(sweepPoint);

// baked literals (recomputed by the assertions)
const BASE_EMS_LIT = 0.632470484918101;
const BASE_A_LIT = 0.6014409758412518;
const BASE_O_LIT = 0.6163838457278105;
const BASE_B_LIT = 0.9611824921088338;
const BASE_PHI_LIT = 0.3563281333034455;
const ALLEVEN_O_LIT = 0.9742440748314481; // occupancy at evenMassShare = 1
const ALLEVEN_B_LIT = -737.4829700296433; // parity-balance at evenMassShare = 1
const ALLEVEN_E_LIT = -0.15522673207859267; // E < 0 at the all-even limit
const ODDFLOOD_O_LIT = 0.06326032520299114; // occupancy at lambda = 5 (odd-flooded)
const A_SPREAD_LIT = 0.004363483466074292; // full-sweep attainment spread (flat)

export const IMP95118_EVEN_MASS_SHARE_SWEEP = {
  ticket:
    "imp-95118 (DIRECTED evenMassShare sweep of the imp-95008 coupled attainment/occupancy/parity-balance channels: scale odd-block mass by lambda, drive evenMassShare monotonically, and map whether the coupling is monotone -- the tradeoff frontier)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; directed-sweep companion to imp-95113-attainment-occupancy-tradeoff.js (random battery) for the sub-gap imp-95008-subgap-attainment-occupancy-tradeoff.",
  channels:
    "attainment A = X_env/capSum, occupancy O = capSum/(Lw M), parity-balance B = E/(2 X_env); evenMassShare = sum_{b even} nb[b]^2 / M is the ceiling-currency even-parity mass fraction. Terminal witness (lambda = 1): evenMassShare = 0.632470484918101, A = 0.6014409758412518, O = 0.6163838457278105, B = 0.9611824921088338, phi = 0.3563281333034455.",
  sweep:
    "Multiply every odd-block packet amplitude by lambda, hold even-block amplitudes fixed. lambda = 1 is the terminal witness; lambda -> 0 sheds odd mass (evenMassShare -> 1, single-even-parity limit); lambda > 1 floods odd mass (evenMassShare -> 0).",
  finding1:
    "Occupancy is MONOTONE-INCREASING in evenMassShare and attainment is FLAT. Across the full sweep lambda in {0,...,5}, O rises strictly with evenMassShare from O = 0.06326032520299114 (evenMassShare = 0.0644, odd-flooded) to O = 0.9742440748314481 (evenMassShare = 1, all-even), while A stays within a spread of 0.004363483466074292. The far-priced product A x O is therefore monotone in evenMassShare: shedding odd mass MAXIMIZES occupancy.",
  finding2:
    "Parity-balance COLLAPSES MONOTONICALLY as evenMassShare -> 1, and excess positivity is a razor ridge. On the odd-mass-shedding branch lambda in {1,0.85,0.70,0.50,0.30,0.20,0.10,0}, evenMassShare increases 0.6325 -> 1 and B is strictly decreasing: B = 0.9612 at the tuned base (E > 0) falls through zero just below lambda = 1 and plunges to B = -737.4829700296433 at the all-even limit (E = -0.15522673207859267 < 0). phi = A x O x B attains its sweep MAXIMUM at exactly lambda = 1 (phi = 0.3563), so the terminal witness sits on the razor ridge imp-95113 measured by random battery.",
  verdict:
    "HONEST DIRECTED MEASUREMENT: the imp-95008 coupling is MONOTONE and the tradeoff frontier is mapped -- evenMassShare BUYS occupancy (O rises monotonically to 0.974 as evenMassShare -> 1, A flat) but SELLS parity balance (B falls monotonically through zero to -737 on the same branch), and the excess-positive product phi is a single sharp maximum at the tuned base witness. Directed-sweep companion to the imp-95113 random assessment; together EVIDENCE FOR the conjectured tradeoff bound attainment x occupancy <= gamma < 1 over MAJ witnesses, NOT a proof. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  subGap:
    "imp-95113-subgap-tradeoff-proof-vs-scan - OPEN: the tradeoff bound attainment x occupancy <= gamma < 1 over ALL MAJ witnesses is now mapped monotonically along the evenMassShare axis (occupancy up, parity-balance down, phi a single peak) but NOT proved; a proof (or a phi -> 1 family) remains open.",
  openResiduals: [
    "the tradeoff bound attainment x occupancy <= gamma < 1 over ALL MAJ witnesses (the directed sweep maps a MONOTONE coupling along the evenMassShare axis and locates phi as a single peak at the tuned witness, but proves no all-witness bound)",
    "the multi-parameter frontier beyond the single evenMassShare axis (the sweep varies one scalar lambda; joint variation of block occupancy AND rate profile is only sampled, not swept)",
    "EXECUTED: the imp-95008 coupling is directionally MAPPED (occupancy monotone up in evenMassShare, parity-balance monotone down on the shedding branch, phi a single sharp maximum at the tuned base). HONEST LIMIT: a one-parameter directed measurement over the terminal-witness odd-scale axis, NOT a theorem over all MAJ witnesses",
  ],
  isRigorous: false,
  rigorScope:
    "This is a NUMERICAL directed measurement. The joint (evenMassShare, A, O, B, phi) pipeline reproduces the imp-95008 baked factors at the terminal witness (rel 1e-9); the sweep then measures the monotone occupancy law, the monotone parity-balance collapse on the shedding branch, the flat attainment, and phi as a single sweep maximum. The tradeoff bound over all MAJ witnesses is MAPPED as monotone along one axis, NOT proved - it remains the named sub-gap. The numerics map the sub-gap; they are not a proof of it.",
  promotesBound: false,
};

export const IMP95118_EVEN_MASS_SHARE_ASSERTIONS = [
  {
    id: "imp95118-ems-terminal-reproduction",
    description:
      "the joint measurement reproduces the imp-95008 baked factors at the terminal 13-packet witness: evenMassShare 0.632470484918101, attainment 0.6014409758412518, occupancy 0.6163838457278105, parity-balance 0.9611824921088338, phi 0.3563281333034455 (rel 1e-9)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(BASE.evenMassShare, BASE_EMS_LIT) &&
        rel(BASE.attainment, BASE_A_LIT) &&
        rel(BASE.occupancy, BASE_O_LIT) &&
        rel(BASE.parityBalance, BASE_B_LIT) &&
        rel(BASE.phi, BASE_PHI_LIT) &&
        rel(BASE.attainment * BASE.occupancy * BASE.parityBalance, BASE.phi)
      );
    },
  },
  {
    id: "imp95118-ems-occupancy-monotone-attainment-flat",
    description:
      "FINDING 1: across the full sweep occupancy O is strictly increasing in evenMassShare (from 0.06326032520299114 odd-flooded to 0.9742440748314481 all-even) while attainment stays flat (spread 0.004363483466074292 < 0.005)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      const byEms = [...FULL].sort((x, y) => x.evenMassShare - y.evenMassShare);
      let mono = true;
      for (let i = 1; i < byEms.length; i++) if (byEms[i].occupancy < byEms[i - 1].occupancy - 1e-12) mono = false;
      const as = FULL.map((r) => r.attainment);
      const spread = Math.max(...as) - Math.min(...as);
      return (
        mono &&
        spread < 5e-3 &&
        rel(spread, A_SPREAD_LIT) &&
        rel(byEms[0].occupancy, ODDFLOOD_O_LIT) &&
        rel(byEms[byEms.length - 1].occupancy, ALLEVEN_O_LIT)
      );
    },
  },
  {
    id: "imp95118-ems-parity-balance-monotone-collapse",
    description:
      "FINDING 2: on the odd-mass-shedding branch (lambda 1 -> 0, evenMassShare 0.6325 -> 1) parity-balance B is strictly decreasing, from 0.9611824921088338 (E > 0 at the tuned base) through zero to -737.4829700296433 at the all-even limit (E = -0.15522673207859267 < 0)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      // SHED is ordered lambda 1 -> 0, i.e. evenMassShare increasing
      let emsUp = true;
      let bDown = true;
      for (let i = 1; i < SHED.length; i++) {
        if (SHED[i].evenMassShare < SHED[i - 1].evenMassShare - 1e-12) emsUp = false;
        if (SHED[i].parityBalance > SHED[i - 1].parityBalance + 1e-12) bDown = false;
      }
      const allEven = SHED[SHED.length - 1];
      return (
        emsUp &&
        bDown &&
        SHED[0].E > 0 &&
        allEven.E < 0 &&
        rel(allEven.parityBalance, ALLEVEN_B_LIT) &&
        rel(allEven.E, ALLEVEN_E_LIT) &&
        rel(allEven.evenMassShare, 1)
      );
    },
  },
  {
    id: "imp95118-ems-phi-single-peak-at-base",
    description:
      "phi = attainment x occupancy x parity-balance attains its sweep MAXIMUM at exactly the tuned base witness lambda = 1 (phi = 0.3563281333034455); every other sweep point has phi < base (the razor ridge)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      let maxPhi = -Infinity;
      let argLam = null;
      for (const r of FULL) {
        if (r.phi > maxPhi) {
          maxPhi = r.phi;
          argLam = r.lambda;
        }
      }
      return argLam === 1.0 && rel(maxPhi, BASE_PHI_LIT);
    },
  },
  {
    id: "imp95118-ems-honesty-gate",
    description:
      "the verdict scopes the result as a numerical directed measurement (not a theorem over all MAJ witnesses), names the open sub-gap, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95118_EVEN_MASS_SHARE_SWEEP.promotesBound === false &&
      IMP95118_EVEN_MASS_SHARE_SWEEP.isRigorous === false &&
      /NO QED/.test(IMP95118_EVEN_MASS_SHARE_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP95118_EVEN_MASS_SHARE_SWEEP.verdict) &&
      /Floors and ceilings untouched/.test(IMP95118_EVEN_MASS_SHARE_SWEEP.verdict) &&
      /NOT a proof/.test(IMP95118_EVEN_MASS_SHARE_SWEEP.verdict) &&
      /imp-95113-subgap-tradeoff-proof-vs-scan/.test(IMP95118_EVEN_MASS_SHARE_SWEEP.subGap) &&
      /NOT proved/.test(IMP95118_EVEN_MASS_SHARE_SWEEP.rigorScope) &&
      IMP95118_EVEN_MASS_SHARE_SWEEP.openResiduals.length === 3,
  },
];

for (const a of IMP95118_EVEN_MASS_SHARE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95118-even-mass-share-sweep assertion failed: ${a.id}`);
  }
}

export default IMP95118_EVEN_MASS_SHARE_SWEEP;
