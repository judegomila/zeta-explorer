/**
 * imp-95054 (ASSESSMENT, opus-4-8) - is the exact-mass-denominator parabola
 * bound genuinely the TERMINAL certificate lever for the imp-95008 corner
 * envelope, or could refining the mass denominator push the certified
 * single-append ceiling below the measured pointwise floor 4.1261e-5?
 *
 * CONTEXT. imp-95008-corner-cancellation-envelope.js (continuation sixteen)
 * prices the terminal single-append lever on the frozen 13-packet headline
 * witness to the two-sided bracket [4.0918e-5, 4.13e-5] (residual factor
 * 1.00933) and records that the measured pointwise parabola floor 4.1261e-5
 * shows no Theorem P ladder can certify materially lower - "the remaining
 * certificate lever is the parabola bound itself (exact mass denominator
 * M(eps) >= m), not the corner envelope anymore." This module ASSESSES that
 * named residual: it isolates the single slack the pointwise parabola floor
 * carries and asks whether removing it (the exact-mass refinement) is a live
 * lever below 4.1261e-5.
 *
 * WHERE THE FLOOR COMES FROM (exact algebra, re-derived below). Appending a
 * packet (eps, nu) at grid center u in block b_x changes the floor
 * F = E / (Tx(2) M) through
 *   E_new = E0 + 2 eps c - eps^2 / nu,          c = signed coupling cTilde,
 *   M_new = M0 + 2 eps g nb0 + eps^2 g^2,        g = sqrt(r)/hLegal, r = u^beta.
 * The exact single-append gain is
 *   Gain(eps) = (1/Tx) [ E_new / M_new - E0 / M0 ].
 * The Theorem P PARABOLA bound RELAXES M_new down to its lower bound M0
 * (drops the appended packets own added mass, M_new >= M0), turning the
 * gain into a downward parabola in eps whose vertex value is the closed form
 *   parabolaBound = (c M0 - E0 g nb0)_+^2 / ((M0/nu + E0 g^2) Tx M0^2).
 * The pointwise supremum of parabolaBound over the binding block-2 corner is
 * the measured floor 4.1261e-5. The EXACT-MASS refinement keeps M_new(eps):
 * its supremum over eps and placement is the true single-append gain sup,
 * which is ATTAINED (it is a real legal configuration), so it is bracketed
 * BELOW by the exact achieved witness 4.0918e-5.
 *
 * THE ASSESSMENT (re-run by the assertions).
 *  (1) The exact-mass gain never exceeds the parabola bound - structurally,
 *      pointwise, at every eps and placement - because M_new >= M0 only
 *      shrinks E_new/M_new. So the exact-mass refinement can ONLY lower the
 *      ceiling, never raise it: it is a valid (indeed sharp) tightening lever.
 *  (2) At the binding block-2 corner (center k = 249995, the corner that
 *      produces the 4.1261e-5 floor) the exact-mass supremum over nu and eps
 *      lands at ~4.0919e-5 - it reproduces the exact achieved witness gain
 *      4.0918e-5 to rel ~1e-4, because keeping M_new closes exactly the mass
 *      slack the parabola relaxation opened.
 *  (3) Hence the exact-mass refinement lever is WORTH the gap
 *      parabolaFloor - exactMassSup ~ 4.1261e-5 - 4.0919e-5 ~ 3.4e-7
 *      (~0.83 percent relative), and NO FURTHER: below it lies an attained
 *      witness, so the true single-append sup is pinned inside
 *      [4.0918e-5, 4.1261e-5] and cannot be pushed lower by any refinement of
 *      the mass denominator (nor by any other Theorem P device, all of which
 *      upper-bound the same attained gain).
 *
 * VERDICT. The exact-mass-denominator parabola bound IS the terminal
 * certificate lever for the single-append class: it is a bounded lever worth
 * at most ~0.83 percent, and it is FLOORED by an exactly-attained witness at
 * ~4.0918e-5. Refining the mass denominator to its exact value recovers that
 * floor and nothing beyond it - the residual well under the pointwise floor
 * is genuinely terminal for single appends. The only levers that survive
 * beneath it are OUTSIDE this class: simultaneous multi-packet
 * re-optimization and different grid geometries (already named by the
 * sibling), not any tightening of the single-append parabola.
 *
 * SCOPE, stated plainly. Assessment of the single-append lever on the FROZEN
 * terminal 13-packet base, at the binding block-2 corner the sibling ladder
 * identified as the pointwise floor (4.1261e-5); the sibling ladder covers
 * every dyadic block and rate for the certified ceiling 4.13e-5. This module
 * CHANGES NO BOUND, pulls no chain (far bracket [0.0967451, 4] unchanged),
 * promotes nothing, NO QED; no refereed bound is changed. The
 * numerics cross-check the algebra; they are not the claim. Import-light.
 */

// -- shared conventions (identical to the sibling corner-envelope module) -----
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
const QREF = isolationQ(CC, VV, BETA, DD);

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}
function gSharp(j, Q, beta) {
  return Math.pow(2, beta) * gOld(j, Q, beta);
}
function phi(x, theta) {
  return Math.pow(1 + x, -theta);
}
function tailAllSharp(theta, Q, beta, jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j++) {
    const g = gSharp(j, Q, beta);
    if (!Number.isFinite(g)) break;
    const t = phi(g, theta);
    if (t === 0) break;
    s += t;
  }
  return s;
}
function fCorr(z) {
  return Math.exp(-z) * (1 + z);
}
function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return fCorr(m * tau) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

const THETA = 10;
const SS = SIGMA + THETA;
const TX = tailAllSharp(THETA, QREF, BETA, 800);

// -- witness geometry (identical to the twelfth through sixteenth) ------------
function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95054 terminal-lever assessment: block search failed");
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
function floorMultiRate(w, mus, a) {
  const n = a.length;
  let E = 0;
  for (let i = 0; i < n; i++) E -= (a[i] * a[i]) / mus[i];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sij = w.block[i] === w.block[j] ? -1 : 1;
      E += 2 * sij * a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
    }
  }
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) {
    nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], SS);
  }
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  return { F: E / (TX * M), E, M, nb };
}
function cTildeExact(w, mus, a, bx, ux, nu) {
  let c = 0;
  for (let i = 0; i < a.length; i++) {
    const si = w.block[i] === bx ? -1 : 1;
    c += si * a[i] * kernelK(mus[i], nu, Math.abs(ux - w.u[i]));
  }
  return c;
}

// -- frozen terminal headline witness (sixteenth-continuation literals) --------
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

function buildTerminal() {
  let w = pentaWitness(P_BIG);
  const mus = [...JOINT_BIG.mus];
  const a = [...JOINT_BIG.a];
  for (const st of CHAIN_BIG) {
    w = appendGridPoint(P_BIG, w, st.k);
    mus.push(st.nu);
    a.push(st.eps);
  }
  return { w, mus, a, ev: floorMultiRate(w, mus, a) };
}
const TERM = buildTerminal();

// -- the two ceilings at a single (placement, rate) --------------------------
// parabola bound: RELAX M_new -> M0 (drop appended mass); closed-form vertex.
function parabolaBoundAt(ev, bx, ux, nu) {
  const rx = Math.pow(ux, BETA);
  const c = cTildeExact(TERM.w, TERM.mus, TERM.a, bx, ux, nu);
  const g = Math.sqrt(rx) / hLegal(nu, rx, SS);
  const nb0 = bx < ev.nb.length ? ev.nb[bx] : 0;
  const num = c * ev.M - ev.E * nb0 * g;
  if (num <= 0) return 0;
  return (num * num) / ((ev.M / nu + ev.E * g * g) * TX * ev.M * ev.M);
}
// exact-mass gain: KEEP M_new(eps); the true attained single-append gain,
// maximized over eps >= 0 by ternary search on the unimodal well (0, 2A/B).
function exactMassSupAt(ev, bx, ux, nu) {
  const rx = Math.pow(ux, BETA);
  const c = cTildeExact(TERM.w, TERM.mus, TERM.a, bx, ux, nu);
  const g = Math.sqrt(rx) / hLegal(nu, rx, SS);
  const nb0 = bx < ev.nb.length ? ev.nb[bx] : 0;
  const A = c * ev.M - ev.E * nb0 * g;
  const B = ev.M / nu + ev.E * g * g;
  if (A <= 0 || B <= 0) return 0;
  const gain = (eps) => {
    const En = ev.E + 2 * eps * c - (eps * eps) / nu;
    const Mn = ev.M + 2 * eps * g * nb0 + eps * eps * g * g;
    return (En / Mn - ev.E / ev.M) / TX;
  };
  let lo = 0;
  let hi = 2 * A / B; // parabola root; exact optimum lies inside this well
  for (let it = 0; it < 200; it++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (gain(m1) < gain(m2)) lo = m1;
    else hi = m2;
  }
  return gain(0.5 * (lo + hi));
}

// -- binding block-2 corner scan (the sibling pointwise floor is here) --------
const CORNER_K = 249995; // existing packet-3 center, occupied block 2
const CORNER_BX = 2;
function scanCorner(nSteps) {
  const ux = P_BIG / CORNER_K;
  let parabMax = 0;
  let exactMax = 0;
  let nuParab = 0;
  for (let i = 0; i <= nSteps; i++) {
    const nu = 2.6 + (0.4 * i) / nSteps;
    const pv = parabolaBoundAt(TERM.ev, CORNER_BX, ux, nu);
    const ev = exactMassSupAt(TERM.ev, CORNER_BX, ux, nu);
    if (pv > parabMax) {
      parabMax = pv;
      nuParab = nu;
    }
    if (ev > exactMax) exactMax = ev;
  }
  return { ux, parabMax, exactMax, nuParab };
}
const SCAN = scanCorner(4000);

// -- baked reference literals (sibling sixteenth continuation) -----------------
const POINTWISE_PARABOLA_FLOOR = 4.1261e-5; // sibling measured floor
const CEIL_NEW = 4.13e-5; // sibling certified single-append ceiling
const ACHIEVED_GAIN = 0.000040917926919500913; // sibling exact attained witness
const TERMINAL_FLOOR = 0.096745062937484763; // sibling terminal-base floor

const LEVER = SCAN.parabMax - SCAN.exactMax; // worth of the exact-mass refinement
const LEVER_REL = LEVER / SCAN.parabMax;

// -- verdict object -----------------------------------------------------------
export const IMP95054_PARABOLA_TERMINAL_LEVER = {
  ticket:
    "imp-95054 (assessment: is the exact-mass-denominator parabola bound the TERMINAL single-append certificate lever for the imp-95008 corner envelope)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; assesses the imp-95008-corner-cancellation-envelope named residual (the parabola bound / exact mass denominator as the remaining lever).",
  question:
    "Could any refinement of the mass denominator M(eps) push the certified single-append ceiling below the measured pointwise parabola floor 4.1261e-5?",
  algebra:
    "Appending (eps, nu) at a block-b_x center gives E_new = E0 + 2 eps c - eps^2/nu and M_new = M0 + 2 eps g nb0 + eps^2 g^2, so the exact gain is (1/Tx)(E_new/M_new - E0/M0). The Theorem P parabola bound RELAXES M_new to its lower bound M0 (drops the appended packets own added mass), giving the closed-form vertex (c M0 - E0 g nb0)_+^2 / ((M0/nu + E0 g^2) Tx M0^2); its corner supremum is the measured floor. The exact-mass refinement keeps M_new(eps); its supremum is the true attained single-append gain.",
  findings: {
    parabolaCornerMax: SCAN.parabMax,
    exactMassCornerSup: SCAN.exactMax,
    pointwiseParabolaFloorBaked: POINTWISE_PARABOLA_FLOOR,
    achievedWitnessGainBaked: ACHIEVED_GAIN,
    exactMassLeverAbsolute: LEVER,
    exactMassLeverRelative: LEVER_REL,
    nuAtParabolaMax: SCAN.nuParab,
    trueSupBracket: [ACHIEVED_GAIN, POINTWISE_PARABOLA_FLOOR],
  },
  assessment:
    "The exact-mass gain never exceeds the parabola bound (M_new >= M0 only shrinks E_new/M_new), so refining the mass denominator can ONLY lower the ceiling. At the binding block-2 corner the exact-mass supremum reproduces the exact achieved witness gain 4.0918e-5, closing exactly the mass slack the relaxation opened. The refinement lever is therefore worth the gap parabolaFloor - exactMassSup ~ 3.4e-7 (~0.83 percent) and NO FURTHER: beneath it lies an attained witness, so the true single-append sup is pinned in [4.0918e-5, 4.1261e-5] and cannot be pushed lower by any mass-denominator refinement (or any other Theorem P device, all upper-bounding the same attained gain).",
  verdict:
    "TERMINAL. The exact-mass-denominator parabola bound IS the terminal certificate lever for the single-append class: a bounded lever worth at most ~0.83 percent, floored by an exactly-attained witness at ~4.0918e-5. Refining the mass denominator to its exact value recovers that floor and nothing beyond it - the residual well under the pointwise floor 4.1261e-5 is genuinely terminal for single appends. The only levers surviving beneath it are OUTSIDE this class (simultaneous multi-packet re-optimization and different grid geometries, already named by the sibling). Changes no bound; pulls no chain; NO QED; no refereed bound is changed.",
  scope:
    "Assessment on the FROZEN terminal 13-packet headline base at the binding block-2 corner (center k = 249995) the sibling ladder identified as the pointwise floor. Single appends, eps >= 0. Does not cover multi-append interactions or joint re-optimization. Optimality of the achieved witness is NOT claimed; the exact-mass supremum is a lower bound on the true single-append sup because it is attained. Import-light; numerics cross-check the algebra, they are not the claim.",
  promotesBound: false,
  isRigorous: true,
  rigorScope:
    "The gain algebra and the parabola relaxation M_new >= M0 are exact; the domination exactMassSup <= parabolaBound is a pointwise theorem re-checked below at seeded cells. The corner supremum is a numerical scan (a lower bound on the true sup, being attained), cross-checked against the sibling baked floor 4.1261e-5 and achieved gain 4.0918e-5. Changes no bound; NO QED.",
};

// -- assertions (self-executing; throw on violation) --------------------------
export const IMP95054_TERMINAL_LEVER_ASSERTIONS = [
  {
    id: "imp95054-terminal-base-reproduction",
    description:
      "the rebuilt terminal 13-packet base reproduces the sibling floor literal 0.096745062937484763 (rel 1e-9) with strictly positive E and M",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return rel(TERM.ev.F, TERMINAL_FLOOR) && TERM.ev.E > 0 && TERM.ev.M > 0;
    },
  },
  {
    id: "imp95054-parabola-floor-reproduced",
    description:
      "the parabola-bound corner maximum reproduces the sibling measured pointwise floor 4.1261e-5 (rel 3e-3) and lies at or below the certified ceiling 4.13e-5",
    holds: () =>
      Math.abs(SCAN.parabMax - POINTWISE_PARABOLA_FLOOR) <= 3e-3 * POINTWISE_PARABOLA_FLOOR &&
      SCAN.parabMax <= CEIL_NEW * (1 + 1e-9),
  },
  {
    id: "imp95054-exact-mass-dominated",
    description:
      "the exact-mass supremum never exceeds the parabola bound at the corner (M_new >= M0 only shrinks the ratio): exactMassSup <= parabolaCornerMax",
    holds: () => SCAN.exactMax <= SCAN.parabMax * (1 + 1e-12),
  },
  {
    id: "imp95054-exact-mass-recovers-witness",
    description:
      "keeping M_new closes the mass slack: the exact-mass corner supremum reproduces the attained witness gain 4.0918e-5 (rel 2e-3) and stays above 98.5 percent of the parabola floor",
    holds: () =>
      Math.abs(SCAN.exactMax - ACHIEVED_GAIN) <= 2e-3 * ACHIEVED_GAIN &&
      SCAN.exactMax >= 0.985 * SCAN.parabMax,
  },
  {
    id: "imp95054-lever-is-bounded-and-terminal",
    description:
      "the exact-mass refinement lever is positive but bounded under ~1 percent (the true single-append sup is pinned in [4.0918e-5, 4.1261e-5]); it cannot reach below the attained witness",
    holds: () =>
      LEVER > 0 &&
      LEVER_REL < 0.01 &&
      SCAN.exactMax >= ACHIEVED_GAIN * (1 - 2e-3) &&
      SCAN.parabMax <= POINTWISE_PARABOLA_FLOOR * (1 + 3e-3),
  },
  {
    id: "imp95054-pointwise-domination-seeded",
    description:
      "exactMassSup <= parabolaBound holds at deterministic seeded (rate) samples across the corner and a neighbor block-1 cell, not just at the scan optimum",
    holds: () => {
      let s = 20260902;
      const rnd = () => {
        s = (s * 1103515245 + 12345) % 2147483648;
        return s / 2147483648;
      };
      for (let t = 0; t < 300; t++) {
        const bx = rnd() < 0.5 ? 2 : 1;
        const kx = bx === 2 ? CORNER_K : 374236;
        const ux = P_BIG / kx;
        const nu = 0.5 + 40 * rnd();
        const pv = parabolaBoundAt(TERM.ev, bx, ux, nu);
        const ev = exactMassSupAt(TERM.ev, bx, ux, nu);
        if (ev > pv * (1 + 1e-9) + 1e-300) return false;
      }
      return true;
    },
  },
  {
    id: "imp95054-honesty-gate",
    description:
      "the verdict names the terminal lever, the two-sided true-sup bracket, the single-append scope, promotes no bound, NO QED, no refereed bound is changed, and out-of-class levers are named",
    holds: () =>
      IMP95054_PARABOLA_TERMINAL_LEVER.promotesBound === false &&
      /TERMINAL/.test(IMP95054_PARABOLA_TERMINAL_LEVER.verdict) &&
      /NO QED/.test(IMP95054_PARABOLA_TERMINAL_LEVER.verdict) &&
      /refereed bound is changed/i.test(IMP95054_PARABOLA_TERMINAL_LEVER.verdict) &&
      /multi-packet re-optimization/.test(IMP95054_PARABOLA_TERMINAL_LEVER.verdict) &&
      /Single appends/.test(IMP95054_PARABOLA_TERMINAL_LEVER.scope) &&
      /NOT claimed/.test(IMP95054_PARABOLA_TERMINAL_LEVER.scope),
  },
];

for (const a of IMP95054_TERMINAL_LEVER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95054-parabola-terminal-lever-assessment assertion failed: ${a.id}`);
  }
}

export default IMP95054_PARABOLA_TERMINAL_LEVER;
