/**
 * imp-95008 continuation (MEASUREMENT, ticket imp-95031) - is the witness FLOOR
 * genuinely PINNED? The fifteenth continuation
 * (imp-95008-occupied-block-append-floor.js) lifted the headline theta = 10
 * floor to 0.096745062937484763 with an eight-step greedy single-append chain,
 * and left its refined residual at "simultaneous multi-packet re-optimization
 * and different grid geometries". This module MEASURES that residual on both
 * axes. It proves NOTHING new; it quantifies floor movement and states the
 * answer plainly.
 *
 * SETTING (identical to the sibling chain; Permuting the Zeta Twin Ladder
 * Section 4.5; page /permutation-architecture). Multi-rate witnesses: packets
 * alpha_i e^(-mu_i |u - u_i|) at grid centers u_i = 1/d_i, d_i = k_i/p,
 * widths r_i = d_i^(-beta), per-packet Lemma V legality h(mu_i, r_i, s),
 * s = sigma + theta; dyadic blocks b(k): k 2^b <= p < k 2^(b+1); same-block
 * pairs enter the exact excess E with sign -1, cross-block with +1, through
 * the Theorem R kernel K(a, b, tau); floor F = E/(Tx(2) M), M = sum_b nb^2.
 *
 * AXIS 1 - MULTI-PACKET JOINT RE-OPTIMIZATION (the greedy chain is NOT exactly
 * pinned; the movement is modest). The fifteenth continuation built its floor
 * by a GREEDY chain: each append optimized ONE new packet against a frozen
 * base. Freeing all eight appended packets SIMULTANEOUSLY (base five frozen,
 * coordinate ascent over the eight appended rates and amplitudes, exact floor
 * evaluations) lifts the terminal headline floor
 *   0.096745062937484763 (greedy) -> 0.097010871755310580 (joint),
 * a further +0.2747518165320484 percent relative; far bracket gap
 * 41.345779087298143 -> 41.232492066344430. Measured against the five-packet
 * base, the greedy single-append chain therefore captured 93.57 percent of the
 * appended-gain-over-base that a joint re-optimization of the SAME appended
 * structure achieves - the floor is NEARLY, but not exactly, pinned against
 * this lever. The jointly re-optimized appended packets are baked
 * below (optimizer output; optimality NOT claimed) and the lifted floor is an
 * exact evaluation of a componentwise-legal 13-packet witness.
 *
 * AXIS 2 - GRID GEOMETRY (PINNED; scale-invariant at large p). Across a 64x
 * range of spacings p in {249989, ..., 15999989} the penta base geometry is
 * essentially FROZEN: the block structure is IDENTICALLY [0, 1, 1, 2, 3], the
 * centers converge to u -> {2, 2, 4, 4, 8}, the base five-packet floor at the
 * fixed JOINT_BIG parameters stays in [0.09287, 0.09288] (spread below 7e-6),
 * and the first occupied-block-1 append gain (closed-form Theorem Z epsStar at
 * the fixed rate nu = 5.4739) stays in [0.026917, 0.026954] (spread below
 * 4e-5), converging monotonically upward to the headline 2.6945 percent as
 * p -> infinity. Grid geometry is therefore NOT an open witness-side lever at
 * scale: the large-p penta geometry has a scale-invariant limit, and the only
 * genuinely distinct geometry in the chain is the small-p fixed-97 base, which
 * is already tracked separately.
 *
 * COMBINED ANSWER TO imp-95031. The witness floor is PINNED under grid
 * geometry (scale-invariant limit) and NEARLY pinned under joint
 * re-optimization of the appended structure (a residual +0.27 percent beyond
 * the greedy chain, floor 0.096745062937484763 -> 0.097010871755310580, gap
 * 41.345779087298143 -> 41.232492066344430). This is a witness-FLOOR-side
 * measurement: it moves the far-bracket floor, it does NOT touch the
 * ceiling-side ledger factor 2.8488580857094559 (imp-95033) that the "2.81x"
 * headline figure refers to - the two live on opposite sides of the bracket.
 *
 * HONEST SUB-GAP (named, NOT closed here). FULL base-plus-appended joint
 * re-optimization (freeing the five large base packets as well) is
 * gauge-degenerate under the simple coordinate ascent used here: the base
 * amplitudes carry an overall scale gauge (F is invariant under a_i -> t a_i)
 * and the excess-positivity constraint E > 0 is active, so an unconstrained
 * coordinate ascent over the base packets diverges rather than converging. The
 * base was already the fourteenth continuation joint five-parameter optimizer
 * output, so it is near-optimal, but the incremental gain of a gauge-fixed,
 * constraint-aware full re-optimization is UNMEASURED. That is the surviving
 * sub-gap of imp-95031.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) the reconstructed greedy terminal floor
 * matches the fifteenth continuation literal 0.096745062937484763 to rel 1e-9;
 * (2) the baked jointly re-optimized witness evaluates exactly to
 * 0.097010871755310580 with strictly positive excess and strictly beats the
 * greedy terminal (so the joint lever is real, not a rounding artifact);
 * (3) the baked appended re-optimization is componentwise positive with
 * positive rates and every legality constant 0 < h <= 1; (4) the grid sweep
 * block structure is verified identical [0, 1, 1, 2, 3] at every p, the base
 * floors are verified within a 7e-6 band and the append gains within a 4e-5
 * band (scale-invariance, not a coincidence at one p); (5) the append gain is
 * evaluated at a FIXED rate (no scan) so the sweep is fully deterministic;
 * (6) scope stated plainly: these are exact evaluations of optimizer outputs,
 * optimality is NOT claimed, no ceiling is proved on Axis 1 (the joint optimum
 * could be higher), and the full base re-optimization is an explicit unmeasured
 * sub-gap. The numerics ARE the measurement here; there is no theorem.
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope constants
 * (c, beta, sigma, theta, A_d) for the PAPER packets; the curvature ceiling D
 * retained by the window; the paper phase curvature normalization; residual
 * (c), the l2-to-pointwise passage to |C_E,17|. MEASURED (this module): the
 * fifteenth "simultaneous multi-packet re-optimization and different grid
 * geometries" residual is quantified - grid geometry PINNED (scale-invariant),
 * joint re-optimization of the appended structure worth a further +0.27 percent
 * (gap 41.3458 -> 41.2325); the surviving sub-gap is the gauge-degenerate full
 * base-plus-appended re-optimization, unmeasured here.
 *
 * The numerics below ARE the measurement. Import-light (no heavy bundle).
 * Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// -- shared conventions (identical to the sibling modules) --------------------
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

// -- witness geometry (identical to the twelfth through fifteenth) ------------
function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95008 floor-pin: block search failed");
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

// Theorem Z occupied-block append machinery (closed-form epsStar, no scan)
function occAppend(w, mus, a, ev, ux, rx, bx) {
  const nb = bx < ev.nb.length ? ev.nb[bx] : 0;
  const cTilde = (nu) => {
    let c = 0;
    for (let i = 0; i < a.length; i++) {
      const si = w.block[i] === bx ? -1 : 1;
      c += si * a[i] * kernelK(mus[i], nu, Math.abs(ux - w.u[i]));
    }
    return c;
  };
  const gOf = (nu) => Math.sqrt(rx) / hLegal(nu, rx, SS);
  const epsStar = (nu) => {
    const c = cTilde(nu);
    const g = gOf(nu);
    const lead = c * g * g + (nb * g) / nu;
    const lin = ev.M / nu + g * g * ev.E;
    const con = c * ev.M - ev.E * nb * g;
    if (con <= 0) return null;
    return (-lin + Math.sqrt(lin * lin + 4 * lead * con)) / (2 * lead);
  };
  return { nb, cTilde, gOf, epsStar };
}

// -- fifteenth continuation terminal headline 13-packet witness ---------------
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
  return { w, mus, a };
}

const TERM = buildTerminal();
const GREEDY_FLOOR = floorMultiRate(TERM.w, TERM.mus, TERM.a).F;

// -- AXIS 1: baked jointly re-optimized appended packets (optimizer output;
// base five frozen; optimality NOT claimed) ----------------------------------
const REOPT_APPENDED_MUS = [
  6.0989948950783095, 12.997114629365988, 6.42238718999679, 6.254102845039119,
  7.027128026892342, 4.665578663281487, 12.98639112606347, 4.666115769401223,
];
const REOPT_APPENDED_A = [
  0.003852835274894776, 0.007906113018159234, 0.001964401488942666, 0.0012155146495892734,
  0.0005774861617569643, 0.002423898389317212, 0.002892865209230408, 0.0015298125915473365,
];
const REOPT_MUS = [...JOINT_BIG.mus, ...REOPT_APPENDED_MUS];
const REOPT_A = [...JOINT_BIG.a, ...REOPT_APPENDED_A];
const REOPT_EV = floorMultiRate(TERM.w, REOPT_MUS, REOPT_A);
const JOINT_FLOOR = REOPT_EV.F;

// -- AXIS 2: grid-geometry sweep (deterministic; fixed append rate, no scan) --
const GRID_PS = [249989, 499979, 999983, 1999993, 3999971, 7999993, 15999989];
const NU_FIX = 5.4739;
function gridSweep() {
  return GRID_PS.map((p) => {
    const wp = pentaWitness(p);
    const ev = floorMultiRate(wp, JOINT_BIG.mus, JOINT_BIG.a);
    const kx = Math.round(p / 3.4797);
    const wx = appendGridPoint(p, wp, kx);
    const ux = p / kx;
    const rx = Math.pow(kx / p, -BETA);
    const bx = blockOf(p, kx);
    const occ = occAppend(wp, JOINT_BIG.mus, JOINT_BIG.a, ev, ux, rx, bx);
    const es = occ.epsStar(NU_FIX);
    const F = floorMultiRate(wx, [...JOINT_BIG.mus, NU_FIX], [...JOINT_BIG.a, es]).F;
    return { p, blocks: wp.block.slice(), baseFloor: ev.F, appendGainRel: (F - ev.F) / ev.F, appendBlock: bx };
  });
}
const GRID = gridSweep();

// -- verdict object -----------------------------------------------------------
export const IMP95008_WITNESS_FLOOR_PIN = {
  ticket: "imp-95008 continuation (measurement, ticket imp-95031): is the witness floor pinned under joint re-optimization and grid geometry?",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; measures the fifteenth continuation (imp-95008-occupied-block-append-floor.js) refined residual: simultaneous multi-packet re-optimization and different grid geometries.",
  axis1JointReoptimization:
    "The fifteenth continuation floor was built by a GREEDY single-append chain (each append optimized one new packet against a frozen base). Freeing all eight appended packets SIMULTANEOUSLY (base five frozen, coordinate ascent over the appended rates and amplitudes, exact floor evaluations) lifts the terminal headline floor 0.096745062937484763 -> 0.097010871755310580, a further +0.2747518165320484 percent relative; far bracket gap 41.345779087298143 -> 41.232492066344430. Measured against the five-packet base, the greedy chain captured 93.57 percent of the appended-gain-over-base of the jointly re-optimized structure - the floor is NEARLY, not exactly, pinned on this axis.",
  axis2GridGeometry:
    "Across a 64x range of spacings p in {249989, ..., 15999989} the penta base geometry is scale-invariant: block structure IDENTICALLY [0, 1, 1, 2, 3], centers u -> {2, 2, 4, 4, 8}, base five-packet floor within a 7e-6 band and first occupied-block-1 append gain (closed-form Theorem Z epsStar at the fixed rate nu = 5.4739) within a 4e-5 band, converging upward to the headline 2.6945 percent. Grid geometry is PINNED at scale - NOT an open witness-side lever; the only distinct geometry is the tracked small-p fixed-97 base.",
  combinedAnswer:
    "The witness floor is PINNED under grid geometry (scale-invariant limit) and NEARLY pinned under joint re-optimization of the appended structure (a residual +0.27 percent, floor 0.096745062937484763 -> 0.097010871755310580, gap 41.345779087298143 -> 41.232492066344430). This is a witness-FLOOR-side measurement: it moves the far-bracket floor and does NOT touch the ceiling-side ledger factor 2.8488580857094559 (imp-95033) to which the 2.81x headline figure refers - the two live on opposite sides of the bracket.",
  reference: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA, theta: THETA },
    base: JOINT_BIG,
    greedyChain: CHAIN_BIG,
    greedyTerminalFloor: GREEDY_FLOOR,
    jointReoptimizedAppended: { mus: REOPT_APPENDED_MUS, a: REOPT_APPENDED_A },
    jointFloor: JOINT_FLOOR,
    jointGainRelOverGreedy: JOINT_FLOOR / GREEDY_FLOOR - 1,
    greedyGap: 4 / GREEDY_FLOOR,
    jointGap: 4 / JOINT_FLOOR,
    greedyCaptureFraction: (GREEDY_FLOOR - JOINT_BIG_BASE_FLOOR()) / (JOINT_FLOOR - JOINT_BIG_BASE_FLOOR()),
    gridSweep: GRID.map((g) => ({ p: g.p, blocks: g.blocks, baseFloor: g.baseFloor, appendGainRel: g.appendGainRel })),
  },
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "MEASURED here: the fifteenth continuation residual is quantified - grid geometry PINNED (scale-invariant, block structure [0,1,1,2,3] over a 64x spacing range), joint re-optimization of the appended structure worth a further +0.27 percent (floor 0.096745062937484763 -> 0.097010871755310580, gap 41.3458 -> 41.2325); the SURVIVING SUB-GAP is the gauge-degenerate full base-plus-appended re-optimization (base amplitudes carry a scale gauge and the E > 0 constraint is active), UNMEASURED here",
  ],
  isRigorous: false,
  rigorScope:
    "MEASUREMENT only, NO theorem. Every floor is an exact evaluation of a componentwise-legal witness; the jointly re-optimized appended packets and the greedy chain are optimizer outputs, optimality is NOT claimed. Axis 1 proves no ceiling (the true joint optimum could be higher than the baked +0.27 percent). Axis 2 is a finite scale-invariance scan (seven spacings). The full base-plus-appended joint re-optimization is gauge-degenerate under the simple coordinate ascent used here and is left as an explicit unmeasured sub-gap. The numerics ARE the measurement.",
  promotesBound: false,
  verdict:
    "MEASUREMENT settling the fifteenth continuation refined residual on both named axes. AXIS 1 (joint re-optimization): freeing the eight appended packets simultaneously lifts the greedy-chain terminal headline floor 0.096745062937484763 -> 0.097010871755310580 (+0.2747518165320484 percent, gap 41.345779087298143 -> 41.232492066344430) - the greedy chain captured 93.57 percent of the appended-gain-over-base, so the floor is NEARLY but not exactly pinned. AXIS 2 (grid geometry): over a 64x spacing range the penta geometry is scale-invariant (block structure identically [0,1,1,2,3], base floor and append lever geometry-independent to below 1e-4), so grid geometry is PINNED and NOT an open witness-side lever at scale. Witness-FLOOR-side only: does not touch the ceiling-side 2.8488580857094559 ledger factor (imp-95033). Surviving sub-gap named plainly: the gauge-degenerate full base-plus-appended re-optimization is unmeasured. Optimality is NOT claimed. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

function JOINT_BIG_BASE_FLOOR() {
  return floorMultiRate(pentaWitness(P_BIG), JOINT_BIG.mus, JOINT_BIG.a).F;
}

// -- assertions (self-executing; throw on violation) --------------------------
export const IMP95008_WFP_ASSERTIONS = [
  {
    id: "imp95008-wfp-greedy-terminal-reproduction",
    description:
      "the reconstructed greedy single-append chain reproduces the fifteenth continuation terminal headline floor 0.096745062937484763 (rel 1e-9) with strictly positive excess and 13 packets",
    holds: () => {
      const ev = floorMultiRate(TERM.w, TERM.mus, TERM.a);
      return (
        Math.abs(ev.F - 0.096745062937484763) <= 1e-9 * 0.096745062937484763 &&
        ev.E > 0 &&
        TERM.a.length === 13
      );
    },
  },
  {
    id: "imp95008-wfp-joint-reopt-lift",
    description:
      "the baked jointly re-optimized appended witness evaluates exactly to 0.097010871755310580 (rel 1e-9) with strictly positive excess, strictly beats the greedy terminal, and sets the new far-bracket gap 41.232492066344430 (rel 1e-9) below the greedy 41.345779087298143",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(JOINT_FLOOR, 0.097010871755310580) &&
        REOPT_EV.E > 0 &&
        JOINT_FLOOR > GREEDY_FLOOR &&
        rel(4 / JOINT_FLOOR, 41.232492066344430) &&
        rel(4 / GREEDY_FLOOR, 41.345779087298143) &&
        rel(JOINT_FLOOR / GREEDY_FLOOR - 1, 0.002747518165320484)
      );
    },
  },
  {
    id: "imp95008-wfp-joint-reopt-legality",
    description:
      "the jointly re-optimized 13-packet witness is componentwise positive with positive rates, every legality constant satisfies 0 < h <= 1, and the floor stays strictly below the achieved cFar = 4",
    holds: () => {
      if (!REOPT_A.every((x) => x > 0) || !REOPT_MUS.every((x) => x > 0)) return false;
      for (let i = 0; i < REOPT_A.length; i++) {
        const h = hLegal(REOPT_MUS[i], TERM.w.r[i], SS);
        if (!(h > 0 && h <= 1)) return false;
      }
      return JOINT_FLOOR < 4;
    },
  },
  {
    id: "imp95008-wfp-grid-geometry-invariance",
    description:
      "across the seven-spacing grid sweep the block structure is identically [0,1,1,2,3], the base five-packet floors lie within a 7e-6 band, and the first occupied-block-1 append gains lie within a 4e-5 band around 2.695 percent, converging upward - grid geometry is scale-invariant at large p",
    holds: () => {
      const floors = GRID.map((g) => g.baseFloor);
      const gains = GRID.map((g) => g.appendGainRel);
      const within = (arr, band) => Math.max(...arr) - Math.min(...arr) < band;
      const blocksOk = GRID.every(
        (g) => g.appendBlock === 1 && g.blocks.length === 5 && g.blocks.join(",") === "0,1,1,2,3",
      );
      const floorBandOk = within(floors, 7e-6) && floors.every((f) => f > 0.09286 && f < 0.09288);
      const gainBandOk = within(gains, 4e-5) && gains.every((x) => x > 0.0268 && x < 0.0270);
      return blocksOk && floorBandOk && gainBandOk;
    },
  },
  {
    id: "imp95008-wfp-greedy-capture-fraction",
    description:
      "the greedy single-append chain captured between 93 and 94 percent of the jointly re-optimized appended gain over the five-packet base (the floor is nearly, not exactly, pinned on the joint-reoptimization axis)",
    holds: () => {
      const baseF = JOINT_BIG_BASE_FLOOR();
      const frac = (GREEDY_FLOOR - baseF) / (JOINT_FLOOR - baseF);
      return frac > 0.93 && frac < 0.94;
    },
  },
  {
    id: "imp95008-wfp-honesty-gate",
    description:
      "the verdict records the measurement-only status, the +0.27 percent joint-reopt movement, the scale-invariant grid-geometry pinning, the witness-floor-side scope (does not touch the ceiling ledger factor), the surviving gauge-degenerate full-reopt sub-gap, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95008_WITNESS_FLOOR_PIN.promotesBound === false &&
      IMP95008_WITNESS_FLOOR_PIN.isRigorous === false &&
      IMP95008_WITNESS_FLOOR_PIN.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_WITNESS_FLOOR_PIN.verdict) &&
      /refereed bound is changed/i.test(IMP95008_WITNESS_FLOOR_PIN.verdict) &&
      /MEASUREMENT/.test(IMP95008_WITNESS_FLOOR_PIN.verdict) &&
      /PINNED/.test(IMP95008_WITNESS_FLOOR_PIN.verdict) &&
      /optimality is NOT claimed/i.test(IMP95008_WITNESS_FLOOR_PIN.verdict) &&
      /SUB-GAP/.test(IMP95008_WITNESS_FLOOR_PIN.openResiduals[4]) &&
      /MEASUREMENT only/.test(IMP95008_WITNESS_FLOOR_PIN.rigorScope),
  },
];

for (const a of IMP95008_WFP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-witness-floor-pin assertion failed: ${a.id}`);
  }
}

export default IMP95008_WITNESS_FLOOR_PIN;
