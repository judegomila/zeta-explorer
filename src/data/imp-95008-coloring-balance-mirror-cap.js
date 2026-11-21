/**
 * imp-95008 continuation (twenty-fourth) - LEMMA CB + LEMMA UC + THEOREM CC
 * + LEMMA MB + THEOREM MIR + PROPOSITION WD: the COLORING-BALANCE identity,
 * the mirror witnesses, and the first macroscopic tradeoff constant
 * gamma < 1 on a fully balanced family. Executes the sub-gap named by the
 * twenty-third continuation (imp-95008-subgap-attainment-occupancy-tradeoff:
 * prove or refute attainment x occupancy <= gamma < 1 over MAJ witnesses,
 * or exhibit a witness family with phi -> 1) IN PART, with a SPLIT verdict:
 * one leg is decided in each direction and the surviving global leg is
 * re-scoped to a named currency-crossing residual.
 *
 * SETTING (identical to the sibling chain; Permuting the Zeta Twin Ladder
 * Section 4.5; page /permutation-architecture; direct parent
 * imp-95008-witness-erealization-split.js). Model family, one branch sign:
 * packets a_d in L2(R) at shifted alias denominators d (globally
 * (1/p)-separated, 1/p <= d <= D), centers u_d = v/d, width scale
 * r_d = c d^(-beta); dyadic curvature block b holds d in
 * (2^(-(b+1)) D, 2^(-b) D]; w_b = block sums; excess E = ||sum w_b||^2 - 2N
 * with N = sum_b ||w_b||^2 (Theorem R currency); MAJ(sigma, theta) envelope
 * hypothesis with n_d = A_d sqrt(r_d), block masses nTilde_b, M = sum
 * nTilde_b^2; Lw = the twenty-second certified aggregation constant;
 * phi = E / (2 Lw M) (the twenty-third three-factor product
 * attainment x occupancy x parity-balance).
 *
 * LEMMA CB (coloring-balance identity - UNCONDITIONAL bilinear algebra).
 * For EVERY 2-coloring chi of the occupied blocks (every partition into two
 * classes, the trivial partition included), with U = sum of one class of
 * block sums, V = sum of the other, and X_chi = the cross-block coupling
 * WITHIN the color classes (2 sum over same-color block pairs of
 * <w_b, w_bp>),
 *   E = 2 X_chi - ||U - V||^2 .
 * Proof: ||U||^2 + ||V||^2 = N + X_chi (block bilinearity within classes),
 * so E = ||U + V||^2 - 2N = (N + X_chi + 2<U,V>) - 2N
 *      = 2 X_chi - (N + X_chi - 2<U,V>) = 2 X_chi - ||U - V||^2. QED.
 * The parity coloring gives exactly Lemma ES of the twenty-third module
 * (X_chi = X_env, and the Lemma PB cap E <= 2 X_env with equality iff
 * U = V); the trivial coloring gives E = 2 X_all - ||sum w_b||^2. So ONE
 * identity generates the whole family, and
 *   COROLLARY CB1: E <= 2 min over colorings chi of X_chi ,
 * with per-coloring equality iff the two color-class sums coincide in L2.
 *
 * LEMMA UC (universal near cap - conditional on MAJ, Cauchy-Schwarz). For
 * any two packets, <a_i, a_j> <= ||a_i|| ||a_j|| <= K1 n_i n_j with
 *   K1 = 2 / (2 s - 1) ,  s = sigma + theta
 * (the exact envelope L2 norm is n sqrt(2/(2s-1))). This prices the pairs
 * the far machinery never priced: gap-1 (adjacent-block) pairs, where the
 * Lemma G annulus gap ratio is vacuous (G(1) = 0). Reference family
 * (s = 11): K1 = 2/21 = 0.09523809523809523.
 *
 * THEOREM CC (coloring cap - conditional on MAJ, carried per-pair caps).
 *   E <= 2 min over colorings chi of capSum_chi ,
 *   capSum_chi = sum over ordered same-color cross-block pairs of
 *                nTilde_b nTilde_bp K(b, bp) ,
 *   K(b, bp) = envE(min(b,bp), |b - bp|) for |b - bp| >= 2 (Lemma T/CC/RM/PF
 *              carried),  K1 nTilde-currency for |b - bp| = 1 (Lemma UC).
 * The parity coloring reproduces the twenty-third bound E <= 2 capSum;
 * every OTHER coloring is new information. In particular the coloring that
 * SEPARATES a dominant same-parity bond (b, b+2) prices E entirely by the
 * OTHER blocks: a witness whose envelope mass concentrates on the
 * parity-Perron corner (blocks 0 and 2, the occupancy -> 1 direction) has
 * E -> 0 under the {0}|{2}-separating colorings. The extremal profile is
 * repelled from the corner that occupancy -> 1 demands: this is the
 * tradeoff MECHANISM, exhibited at the cap level.
 *
 * LEMMA MB (mirror balance - the balance factor admits NO gamma < 1).
 * Boundary mirroring: place a class of packets at block LOWER edges
 * (d = 2^(-(b+1)) D (1 + eta), block b) and their exact L2 TRANSLATES at
 * the adjacent grid point across the boundary (d~ = 2^(-(b+1)) D side,
 * block b+1), one copy per packet, eta >= the (1/p)-separation floor.
 * (i) LEGALITY: the copy is MAJ with the SAME amplitude, because the
 * translate satisfies |a~(u)| <= A (1 + |u - u~|/r_d)^(-s) <=
 * A (1 + |u - u~|/r_{d~})^(-s), the copy width r_{d~} = c d~^(-beta) being
 * LARGER (d~ < d). (ii) BALANCE: as eta shrinks to the separation floor,
 * the parity classes converge in L2 (translation continuity), so by the
 * exact identity (Lemma CB, parity instance) the balance factor
 * E / (2 X_env) = 1 - ||U - V||^2 / (2 X_env) tends to 1 whenever the
 * limit coupling is positive. CONSEQUENCE: sup over MAJ witnesses of the
 * parity-balance factor is EXACTLY 1 (constructively approached), so the
 * conjectured tradeoff constant gamma < 1 CANNOT be extracted from the
 * parity-balance factor alone. This leg of the sub-gap is decided in the
 * REFUTE direction.
 *
 * THEOREM MIR (double pricing of exact balance - conditional on MAJ). In
 * the exact-balance mirror limit over one bond, class-even = packets in
 * blocks (b, b+2), class-odd = their translates in blocks (b+1, b+3), the
 * SAME L2 coupling X = <w_b, w_{b+2}> = <w_{b+1}, w_{b+3}> is priced by
 * BOTH parity classes: X <= nTilde_b nTilde_{b+2} envE(b, 2) AND
 * X <= nTilde_{b+1} nTilde_{b+3} envE(b+1, 2). With the odd copies carrying
 * declared envelope amplitude inflation t >= 1 (minimal legal t = 1; any
 * larger t legal but charged to M), E = 2 X_env = 8 X in the limit,
 * M = (1 + t^2)(nTilde_b^2 + nTilde_{b+2}^2), and nTilde_b nTilde_{b+2}
 * <= (nTilde_b^2 + nTilde_{b+2}^2)/2 give
 *   phi <= 2 min( envE(b,2), t^2 envE(b+1,2) ) / ( Lw (1 + t^2) ) ,
 * maximized over the inflation at t^2 = envE(b,2)/envE(b+1,2):
 *   phi <= gammaMirror(b) = 2 envE(b,2) envE(b+1,2)
 *                           / ( (envE(b,2) + envE(b+1,2)) Lw ) ,
 * a harmonic-mean ceiling. envE(., 2) is strictly decreasing in the base
 * block (measured: envE(0,2) = 3.919792025556118e-5, envE(1,2) =
 * 1.4714918024288777e-6, envE(2,2) = 3.398047003867178e-8), so b = 0
 * dominates and the family ceiling is
 *   GAMMA_MIRROR = 0.07236353663297679  (< 1, macroscopic) ,
 * with the minimal-legal (t = 1) instance capped lower still at
 * envE(1,2)/Lw = 0.0375400336307697. This leg of the sub-gap is decided in
 * the PROVE direction ON THE FULLY BALANCED FAMILY: exact balance is
 * doubly priced, and gamma exists and is SMALL there. Multi-bond mirrors
 * obey the same statement with the two class quadratic forms in place of
 * the single bond products (min of the two, same 1 + t^2 charge).
 *
 * QUANTITATIVE PUNCHLINE (mirror vs measured). The terminal headline
 * witness (twenty-third: balance 0.9612, phi = 0.356328133303681) sits
 * 4.92x ABOVE the full-balance ceiling GAMMA_MIRROR. So exact balance is
 * strictly SUBOPTIMAL: pushing the third factor to its supremum 1 caps the
 * product at 0.0724, while backing off to 0.961 balance measurably buys
 * phi = 0.356. The extremum of the three-factor product is INTERIOR in the
 * balance variable - the three channels are genuinely coupled, confirming
 * the twenty-third structural observation as a proved phenomenon (on the
 * balanced end) rather than a measurement.
 *
 * PROPOSITION WD (currency wedge - the coloring caps alone cannot decide
 * the global leg). At the explicit PROFILE nTilde = (1, delta, 1, delta)
 * with delta = Lw / K1 = 4.115783186949272e-4, EVERY one of the 7
 * nontrivial colorings of blocks {0,1,2,3} has
 * capSum_chi / (Lw M) >= 1 - 1e-6 (measured min 0.9999994579058, attained
 * by the parity coloring). So Theorem CC by itself certifies NO macroscopic
 * global gamma: the coloring caps are envelope-currency statements, and
 * balance lives in L2 currency - a light block (envelope mass ~ Lw/K1) can
 * carry all the L2 norm that balance needs, at a cap price the colorings
 * cannot distinguish from 1. HONEST LIMIT: this does NOT exhibit
 * phi -> 1; caps are necessary conditions only, and whether per-pair
 * ATTAINMENT (a shape statement) is compatible with the wedge profile and
 * with partial balance simultaneously is exactly the surviving question.
 *
 * SUB-GAP LEDGER for imp-95008-subgap-attainment-occupancy-tradeoff:
 *   (a) balance-factor leg: REFUTED (no gamma < 1 from the parity factor;
 *       Lemma MB constructive sup = 1);
 *   (b) fully-balanced leg: PROVED with gamma = GAMMA_MIRROR = 0.0724
 *       (Theorem MIR double pricing);
 *   (c) global partial-balance leg: OPEN, re-scoped by Proposition WD to a
 *       CURRENCY-CROSSING bound - new named sub-gap
 *       imp-95008-subgap-partial-balance-currency-crossing: prove a
 *       witness-side ceiling on phi that couples the L2 balance defect to
 *       envelope attainment (shape level), or exhibit a partial-balance
 *       family with phi -> 1 at a cap-relaxation-tight profile.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) Lemma CB is verified at the terminal
 * headline witness for ALL 7 nontrivial colorings of its blocks by two
 * independent assemblies of E (identity residual under 1e-11 of the
 * uncancelled scale; E itself is a 1536x cancellation, tolerances set from
 * that depth); (2) Theorem CC is stress-tested on a deterministic
 * 40-config LCG battery (random blocks 0..5, rates, amplitudes, centers):
 * E <= 2 capSum_chi holds for every witness and EVERY coloring of its
 * occupied blocks, and Lemma UC holds for every packet pair including
 * same-block pairs; (3) the mirror ladder (4 rungs, boundary offsets
 * shrinking to the 1/p separation floor) shows the balance factor climbing
 * 0.53 -> 1 - 8e-9 monotonically with X13/X02 -> 1, E > 0 throughout, and
 * phi below the Theorem MIR ceiling at every rung; the numeric mirror
 * instance has microscopic attainment (the hLegal penalty at the small
 * rates needed for visible cross-block coupling), so it exercises the
 * balance limb and the identity, NOT cap tightness - cap tightness at gap
 * 2 is already exercised by the terminal witness (0.60 attainment,
 * twenty-third); (4) the t-optimization in Theorem MIR is checked against
 * a 10^4-point grid (grid max below the closed form by < 5e-5 relative);
 * (5) Proposition WD enumerates all 7 colorings exactly; (6) SCOPE
 * HONESTY: Lemma CB is unconditional algebra; Lemma UC, Theorem CC and
 * Theorem MIR are conditional on MAJ(sigma, theta) exactly like the
 * carried chain; Theorem MIR ceilings the EXACT-mirror (translate) family,
 * not every balanced witness - a non-translate balanced witness is not
 * covered, which is part of why leg (c) stays open; nothing here is a
 * statement about the paper packets (that residual is carried unchanged).
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the l2-to-pointwise passage to |C_E,17|.
 * EXECUTED IN PART by this module:
 * imp-95008-subgap-attainment-occupancy-tradeoff (legs (a) and (b)
 * decided, leg (c) re-scoped). NEW named sub-gap:
 * imp-95008-subgap-partial-balance-currency-crossing.
 *
 * The numerics below CROSS-CHECK the lemma statements; they are not the
 * claim. Import-light (no heavy bundle). Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── shared conventions (identical to the sibling modules) ────────────────────
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

// ── Lemma PF exact closed form (short copy, nineteenth continuation) ─────────
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

// Lemma UC universal near cap constant (envelope L2 Cauchy-Schwarz)
const K1_UC = 2 / (2 * SS - 1);

// pair cap in the nTilde currency: envE for gaps >= 2, Lemma UC for gap 1
function pairCap(b, bp) {
  const gap = Math.abs(b - bp);
  if (gap >= 2) return envE(Math.min(b, bp), gap);
  return K1_UC;
}

// ── witness geometry (identical to the fifteenth continuation) ───────────────
function blockOf(p, k) {
  let b = 0;
  while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
    b += 1;
    if (b > 60) throw new Error("imp-95008 coloring-balance: block search failed");
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

// ── terminal headline witness (fifteenth-continuation baked literals) ────────
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

// ── generic witness internals: per-block-pair couplings + masses ─────────────
function witnessInternals(w, mus, a) {
  const n = a.length;
  let diag = 0;
  for (let i = 0; i < n; i++) diag += (a[i] * a[i]) / mus[i];
  let sameBlock = 0;
  const pairIP = new Map(); // "lo:hi" -> 2<w_lo, w_hi> for cross-block pairs
  let ucViolations = 0;
  const nPer = a.map((ai, i) => (ai * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], SS));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const ip = a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
      if (ip > K1_UC * nPer[i] * nPer[j] * (1 + 1e-12)) ucViolations += 1;
      const bi = w.block[i];
      const bj = w.block[j];
      if (bi === bj) {
        sameBlock += 2 * ip;
      } else {
        const key = Math.min(bi, bj) + ":" + Math.max(bi, bj);
        pairIP.set(key, (pairIP.get(key) || 0) + 2 * ip);
      }
    }
  }
  const N = diag + sameBlock;
  let X_all = 0;
  for (const vIP of pairIP.values()) X_all += vIP;
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) nb[w.block[i]] += nPer[i];
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  const blocks = [...new Set(w.block)].sort((x, y) => x - y);
  const E = X_all - N; // = ||sum w_b||^2 - 2N by bilinearity
  return { E, N, X_all, pairIP, nb, M, blocks, ucViolations };
}

// coloring = Set of blocks in one class; returns X_chi and capSum_chi
function coloringData(internals, classSet) {
  let xChi = 0;
  let crossColor = 0; // 2 <U, V>
  let capSum = 0;
  const { pairIP, nb, blocks } = internals;
  for (let bi = 0; bi < blocks.length; bi++) {
    for (let bj = bi + 1; bj < blocks.length; bj++) {
      const b = blocks[bi];
      const bp = blocks[bj];
      const sameColor = classSet.has(b) === classSet.has(bp);
      const key = b + ":" + bp;
      const ipD = pairIP.get(key) || 0;
      if (sameColor) {
        xChi += ipD;
        capSum += 2 * nb[b] * nb[bp] * pairCap(b, bp);
      } else {
        crossColor += ipD;
      }
    }
  }
  const defect = internals.N + xChi - crossColor; // ||U - V||^2
  return { xChi, crossColor, defect, capSum };
}

function allNontrivialColorings(blocks) {
  const out = [];
  const nB = blocks.length;
  for (let mask = 1; mask < 1 << (nB - 1); mask++) {
    const cls = new Set();
    for (let i = 0; i < nB; i++) if (mask & (1 << i)) cls.add(blocks[i]);
    out.push(cls);
  }
  return out;
}

// ── mirror witness ladder (Lemma MB / Theorem MIR instance) ──────────────────
// even class: blocks 0 and 2 at lower edges; odd class: adjacent-grid copies
// (same rate, same amplitude) across the 0|1 and 2|3 block boundaries.
const MIRROR_MU0 = 0.8;
const MIRROR_MU2 = 0.8;
const MIRROR_RUNGS = [
  { m0: 32000, m2: 2000 },
  { m0: 3200, m2: 200 },
  { m0: 320, m2: 20 },
  { m0: 0, m2: 0 },
];

function buildMirrorWitness(m0, m2) {
  const ks = [499992 + m0, 499991 - m0, 124998 + m2, 124997 - m2];
  const d = ks.map((k) => k / P_BIG);
  const w = {
    ks,
    d,
    u: d.map((x) => VV / x),
    r: d.map((x) => CC * Math.pow(x, -BETA)),
    block: ks.map((k) => blockOf(P_BIG, k)),
  };
  const mus = [MIRROR_MU0, MIRROR_MU0, MIRROR_MU2, MIRROR_MU2];
  const a = [1, 1, 1, 1];
  return { w, mus, a };
}

// ── deterministic LCG battery (Theorem CC / Lemma UC stress test) ────────────
function lcg(seed) {
  let sVal = seed >>> 0;
  return () => {
    sVal = (1664525 * sVal + 1013904223) >>> 0;
    return sVal / 4294967296;
  };
}

function randomWitness(rng) {
  const nPk = 3 + Math.floor(rng() * 6);
  const ks = [];
  const mus = [];
  const a = [];
  for (let i = 0; i < nPk; i++) {
    const b = Math.floor(rng() * 6);
    const lo = Math.floor(P_BIG / Math.pow(2, b + 1)) + 2;
    const hi = Math.floor(P_BIG / Math.pow(2, b));
    let k = lo + Math.floor(rng() * (hi - lo - 1));
    while (ks.includes(k)) k += 1;
    ks.push(k);
    mus.push(0.3 + rng() * 19);
    a.push(Math.pow(10, -3 + 3 * rng()));
  }
  let w = null;
  for (const k of ks) {
    const dd = k / P_BIG;
    const row = {
      ks: [k],
      d: [dd],
      u: [VV / dd],
      r: [CC * Math.pow(dd, -BETA)],
      block: [blockOf(P_BIG, k)],
    };
    if (!w) w = row;
    else {
      w = {
        ks: [...w.ks, k],
        d: [...w.d, dd],
        u: [...w.u, VV / dd],
        r: [...w.r, CC * Math.pow(dd, -BETA)],
        block: [...w.block, blockOf(P_BIG, k)],
      };
    }
  }
  return { w, mus, a };
}

// ── baked literals (carried from the sibling chain) ──────────────────────────
const LW_LIT = 3.9197935113802585e-5; // twenty-second certified aggregation constant
const ENV02_LIT = 3.9197920255561178e-5; // nineteenth corner bond envE(0, 2)
const ENV12_LIT = 1.4714918024288777e-6; // envE(1, 2)
const E_LIT = 0.00020231895346286606; // twenty-third terminal excess
const XENV_LIT = 0.00010524481829607855; // twenty-third same-parity coupling
const DEFECT_LIT = 8.170683129471445e-6; // twenty-third parity defect
const CAPSUM_LIT = 1.749877752324237e-4; // twenty-third parity capSum
const PHI_LIT = 0.356328133303681; // twenty-third terminal phi

// ── baked literals (NEW, this module; recomputed by the assertions) ──────────
const ENV22_LIT = 3.398047003867178e-8; // envE(2, 2)
const ENV03_LIT = 4.10998791908257e-8; // envE(0, 3)
const K1_LIT = 0.09523809523809523; // Lemma UC constant 2/21 at s = 11
const GAMMA_MIRROR = 0.07236353663297679; // Theorem MIR family ceiling (b = 0)
const GAMMA_MIRROR_T1 = 0.0375400336307697; // minimal-legal (t = 1) instance cap
const WEDGE_DELTA = 4.115783186949272e-4; // Lw / K1
const WEDGE_MIN_RATIO = 0.9999994579058; // Proposition WD measured min ratio

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95008_COLORING_BALANCE_MIRROR_CAP = {
  ticket:
    "imp-95008 (continuation twenty-four: executes imp-95008-subgap-attainment-occupancy-tradeoff IN PART - balance leg refuted as a gamma source, fully-balanced leg proved with gamma = 0.0724, global leg re-scoped to currency crossing)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; parent imp-95008-witness-erealization-split.js (Lemma ES / Lemma PB / Theorem ER and the named sub-gap).",
  lemmaCB:
    "UNCONDITIONAL coloring-balance identity: for EVERY 2-coloring chi of the occupied blocks, E = 2 X_chi - ||U_chi - V_chi||^2, where X_chi is the same-color cross-block coupling. The parity coloring is Lemma ES; the trivial coloring gives E = 2 X_all - ||sum w_b||^2. Corollary: E <= 2 min_chi X_chi.",
  lemmaUC:
    "Conditional on MAJ: <a_i, a_j> <= K1 n_i n_j with K1 = 2/(2s-1) = 2/21 (exact envelope L2 norm + Cauchy-Schwarz). Prices the gap-1 and same-block pairs the far machinery never priced.",
  theoremCC:
    "Conditional on MAJ: E <= 2 min over colorings of capSum_chi (envE for gaps >= 2, K1 for gap 1). Every non-parity coloring is new information; the coloring separating a dominant even bond prices E by the LIGHT blocks, so occupancy -> 1 (parity-Perron corner) forces E -> 0 under that coloring: the tradeoff mechanism at cap level.",
  lemmaMB:
    "Boundary mirroring (exact L2 translates across a block boundary, legal under MAJ with the same amplitude because the copy width is larger) drives the parity-balance factor to 1 at positive coupling. Sup of the balance factor over MAJ witnesses = 1: NO tradeoff constant gamma < 1 can come from the balance factor alone. REFUTES that leg of the sub-gap.",
  theoremMIR:
    "Exact-balance double pricing: in the mirror limit the SAME coupling is priced by BOTH parity classes, phi <= 2 min(envE(b,2), t^2 envE(b+1,2)) / (Lw (1+t^2)) <= 2 envE(b,2) envE(b+1,2) / ((envE(b,2)+envE(b+1,2)) Lw), maximal at b = 0: GAMMA_MIRROR = 0.07236353663297679 < 1. First macroscopic tradeoff constant, on the fully balanced family. Minimal-legal instance cap envE(1,2)/Lw = 0.0375400336307697.",
  propositionWD:
    "Currency wedge: at profile nTilde = (1, delta, 1, delta), delta = Lw/K1 = 4.115783186949272e-4, all 7 colorings of blocks 0..3 have capSum_chi/(Lw M) >= 1 - 1e-6 (min 0.9999994579058 at parity). The coloring caps alone certify no macroscopic GLOBAL gamma; balance lives in L2 currency, caps in envelope currency. Global leg re-scoped, NOT closed.",
  punchline:
    "The terminal witness (balance 0.9612, phi 0.3563) sits 4.92x above the full-balance ceiling 0.0724: the extremum of attainment x occupancy x balance is INTERIOR in the balance variable - the channels are coupled, now proved on the balanced end, not just measured.",
  constants: {
    Lw: LW_LIT,
    envE02: ENV02_LIT,
    envE12: ENV12_LIT,
    envE22: ENV22_LIT,
    envE03: ENV03_LIT,
    K1: K1_LIT,
    gammaMirror: GAMMA_MIRROR,
    gammaMirrorT1: GAMMA_MIRROR_T1,
    wedgeDelta: WEDGE_DELTA,
    wedgeMinRatio: WEDGE_MIN_RATIO,
  },
  subGapLedger: {
    executed: "imp-95008-subgap-attainment-occupancy-tradeoff (legs a and b decided; leg c re-scoped)",
    legA: "balance factor: REFUTED as a gamma source (Lemma MB, sup = 1)",
    legB: "fully balanced family: PROVED gamma = 0.07236353663297679 (Theorem MIR)",
    legC: "global partial balance: OPEN, re-scoped to imp-95008-subgap-partial-balance-currency-crossing",
  },
  openResiduals: [
    "imp-95008-subgap-partial-balance-currency-crossing: a witness-side phi ceiling coupling the L2 balance defect to envelope attainment (shape level), or a partial-balance family with phi -> 1 at a cap-relaxation-tight profile",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
  ],
  rigorScope:
    "Lemma CB unconditional bilinear algebra; Lemma UC, Theorem CC, Theorem MIR conditional on MAJ(sigma, theta) exactly like the carried chain; Theorem MIR covers the exact-translate mirror family only; Proposition WD is a relaxation-insufficiency statement, not a phi -> 1 construction. Model family only. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── precomputed shared state for the assertions ──────────────────────────────
const TW = buildTerminalWitness();
const TI = witnessInternals(TW.w, TW.mus, TW.a);
const relEq = (x, lit, t) => Math.abs(x - lit) <= (t || 1e-12) * Math.max(Math.abs(lit), 1e-300);

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_CBM_ASSERTIONS = [
  {
    id: "imp95008-cbm-envelope-constants",
    description:
      "the Lemma PF closed form reproduces the carried literals envE(0,2), envE(1,2) (rel 1e-12) and the new literals envE(2,2), envE(0,3) (rel 1e-9); envE(., 2) is strictly decreasing in the base block (the Theorem MIR double-pricing premise); K1 = 2/(2s-1) = 2/21",
    holds: () =>
      relEq(envE(0, 2), ENV02_LIT) &&
      relEq(envE(1, 2), ENV12_LIT) &&
      relEq(envE(2, 2), ENV22_LIT, 1e-9) &&
      relEq(envE(0, 3), ENV03_LIT, 1e-9) &&
      envE(1, 2) < envE(0, 2) &&
      envE(2, 2) < envE(1, 2) &&
      relEq(K1_UC, K1_LIT, 1e-15),
  },
  {
    id: "imp95008-cbm-lemma-cb-identity-all-colorings",
    description:
      "Lemma CB holds at the terminal 13-packet witness for ALL 7 nontrivial colorings of its blocks {0,1,2,3}: E = 2 X_chi - ||U_chi - V_chi||^2 (residual under 1e-11 of the uncancelled scale; E is a 1536x cancellation), every squared defect is nonnegative, and the parity coloring reproduces the twenty-third literals X_env (rel 1e-9), defect (rel 1e-6, a 3.8e4x cancellation) and capSum (rel 1e-9)",
    holds: () => {
      if (!relEq(TI.E, E_LIT, 1e-9)) return false;
      const colorings = allNontrivialColorings(TI.blocks);
      if (colorings.length !== 7) return false;
      let parityOK = false;
      for (const cls of colorings) {
        const cd = coloringData(TI, cls);
        if (Math.abs(TI.E - (2 * cd.xChi - cd.defect)) > 1e-11 * Math.max(TI.N, Math.abs(cd.crossColor), 1)) return false;
        if (cd.defect < -1e-11 * TI.N) return false;
        const inCls = [...cls];
        const outCls = TI.blocks.filter((b) => !cls.has(b));
        const isParity =
          (inCls.every((b) => b % 2 === 0) && outCls.every((b) => b % 2 === 1)) ||
          (inCls.every((b) => b % 2 === 1) && outCls.every((b) => b % 2 === 0));
        if (isParity) {
          parityOK =
            relEq(cd.xChi, XENV_LIT, 1e-9) && relEq(cd.defect, DEFECT_LIT, 1e-6) && relEq(cd.capSum, CAPSUM_LIT, 1e-9);
        }
      }
      return parityOK;
    },
  },
  {
    id: "imp95008-cbm-theorem-cc-terminal-min-is-parity",
    description:
      "Theorem CC holds at the terminal witness for every coloring (E <= 2 capSum_chi), and the binding (minimal) coloring cap there IS the parity one - at the terminal mass profile no non-parity coloring sharpens the twenty-third bound, consistent with its heavy adjacent blocks pricing at K1",
    holds: () => {
      let minCap = Infinity;
      let parityCap = NaN;
      for (const cls of allNontrivialColorings(TI.blocks)) {
        const cd = coloringData(TI, cls);
        if (TI.E > 2 * cd.capSum + 1e-11 * Math.max(TI.N, 1)) return false;
        if (cd.capSum < minCap) minCap = cd.capSum;
        const inCls = [...cls];
        if (inCls.every((b) => b % 2 === 0) && inCls.length === 2) parityCap = cd.capSum;
      }
      return relEq(minCap, parityCap, 1e-12) && TI.ucViolations === 0;
    },
  },
  {
    id: "imp95008-cbm-lemma-cb-cc-uc-battery",
    description:
      "deterministic 40-config LCG battery (random blocks 0..5, rates 0.3..19.3, log-uniform amplitudes): the Lemma CB identity holds for EVERY nontrivial coloring of every config (residual under 1e-10 of the uncancelled scale), Theorem CC (E <= 2 capSum_chi) holds for every coloring, and Lemma UC (pair coupling <= K1 n_i n_j) holds for every packet pair including same-block pairs - a violation would falsify the conditional caps at a concrete MAJ witness",
    holds: () => {
      const rng = lcg(95008);
      for (let cfg = 0; cfg < 40; cfg++) {
        const RW = randomWitness(rng);
        const RI = witnessInternals(RW.w, RW.mus, RW.a);
        if (RI.ucViolations !== 0) return false;
        for (const cls of allNontrivialColorings(RI.blocks)) {
          const cd = coloringData(RI, cls);
          if (Math.abs(RI.E - (2 * cd.xChi - cd.defect)) > 1e-10 * Math.max(RI.N, Math.abs(cd.crossColor), 1)) return false;
          if (RI.E > 2 * cd.capSum + 1e-10 * Math.max(RI.N, 1)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95008-cbm-lemma-mb-mirror-ladder",
    description:
      "the 4-rung boundary-mirror ladder (offsets shrinking to the 1/p separation floor) exercises Lemma MB: blocks are exactly {0,1,2,3}, every copy width exceeds its original (the MAJ legality direction), E > 0 at every rung, the parity-balance factor E/(2 X_env) increases monotonically and exceeds 0.999999 at the tightest rung, and the mirrored couplings converge (|X13/X02 - 1| < 1e-3)",
    holds: () => {
      let prev = -Infinity;
      let last = null;
      for (const rung of MIRROR_RUNGS) {
        const MW = buildMirrorWitness(rung.m0, rung.m2);
        if (MW.w.block.join(",") !== "0,1,2,3") return false;
        if (!(MW.w.r[1] > MW.w.r[0] && MW.w.r[3] > MW.w.r[2])) return false;
        const MI = witnessInternals(MW.w, MW.mus, MW.a);
        const cd = coloringData(MI, new Set([0, 2]));
        if (!(MI.E > 0)) return false;
        const balance = MI.E / (2 * cd.xChi);
        if (!(balance > prev)) return false;
        prev = balance;
        last = { balance, ratio13: (MI.pairIP.get("1:3") || 0) / (MI.pairIP.get("0:2") || 1) };
      }
      return last.balance > 0.999999 && Math.abs(last.ratio13 - 1) < 1e-3;
    },
  },
  {
    id: "imp95008-cbm-theorem-mir-ceiling",
    description:
      "Theorem MIR: the closed-form family ceiling 2 envE(0,2) envE(1,2) / ((envE(0,2)+envE(1,2)) Lw) reproduces GAMMA_MIRROR = 0.07236353663297679 (rel 1e-12), the minimal-legal cap envE(1,2)/Lw reproduces 0.0375400336307697, a 10^4-point t-grid stays below the closed form (within 1e-4 relative at its max), the ceiling is macroscopic (0.01 < gamma < 1), and the measured mirror phi respects both ceilings at every rung",
    holds: () => {
      const gm = (2 * envE(0, 2) * envE(1, 2)) / ((envE(0, 2) + envE(1, 2)) * LW_LIT);
      if (!relEq(gm, GAMMA_MIRROR)) return false;
      if (!relEq(envE(1, 2) / LW_LIT, GAMMA_MIRROR_T1)) return false;
      let gridMax = 0;
      for (let i = 0; i <= 10000; i++) {
        const t2 = Math.pow(10, -3 + (6 * i) / 10000);
        const g = (2 * Math.min(envE(0, 2), envE(1, 2) * t2)) / (LW_LIT * (1 + t2));
        if (g > gridMax) gridMax = g;
      }
      if (!(gridMax <= gm * (1 + 1e-12) && gridMax >= gm * (1 - 1e-4))) return false;
      if (!(gm < 1 && gm > 0.01)) return false;
      for (const rung of MIRROR_RUNGS) {
        const MW = buildMirrorWitness(rung.m0, rung.m2);
        const MI = witnessInternals(MW.w, MW.mus, MW.a);
        const phi = MI.E / (2 * LW_LIT * MI.M);
        if (!(phi <= GAMMA_MIRROR_T1 && phi <= GAMMA_MIRROR)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-cbm-proposition-wd-wedge",
    description:
      "Proposition WD: at the explicit wedge profile nTilde = (1, delta, 1, delta) with delta = Lw/K1 = 4.115783186949272e-4, the minimum over all 7 colorings of capSum_chi/(Lw M) equals 0.9999994579058 (rel 1e-9) and lies in (1 - 1e-6, 1) - so the coloring-cap relaxation cannot certify any macroscopic global gamma",
    holds: () => {
      const delta = LW_LIT / K1_UC;
      if (!relEq(delta, WEDGE_DELTA)) return false;
      const nbW = [1, delta, 1, delta];
      const mW = nbW.reduce((acc, x) => acc + x * x, 0);
      let wedgeMin = Infinity;
      for (const cls of allNontrivialColorings([0, 1, 2, 3])) {
        let capSum = 0;
        for (let bi = 0; bi < 4; bi++) {
          for (let bj = bi + 1; bj < 4; bj++) {
            if (cls.has(bi) === cls.has(bj)) capSum += 2 * nbW[bi] * nbW[bj] * pairCap(bi, bj);
          }
        }
        const ratio = capSum / (LW_LIT * mW);
        if (ratio < wedgeMin) wedgeMin = ratio;
      }
      return relEq(wedgeMin, WEDGE_MIN_RATIO, 1e-9) && wedgeMin >= 1 - 1e-6 && wedgeMin < 1;
    },
  },
  {
    id: "imp95008-cbm-honesty-gate",
    description:
      "honesty gate: the full-balance ceiling GAMMA_MIRROR = 0.0724 sits strictly BELOW the measured terminal phi 0.3563 (exact balance is suboptimal - the tradeoff extremum is interior, no contradiction with the twenty-third measurement), the rigor scope carries the NO QED and no-refereed-bound-change lines, and the 5-entry open-residual ledger (new currency-crossing sub-gap first) is carried",
    holds: () =>
      GAMMA_MIRROR < PHI_LIT &&
      /NO QED/.test(IMP95008_COLORING_BALANCE_MIRROR_CAP.rigorScope) &&
      /refereed bound is changed/i.test(IMP95008_COLORING_BALANCE_MIRROR_CAP.rigorScope) &&
      IMP95008_COLORING_BALANCE_MIRROR_CAP.openResiduals.length === 5 &&
      /partial-balance-currency-crossing/.test(IMP95008_COLORING_BALANCE_MIRROR_CAP.openResiduals[0]),
  },
];

for (const a of IMP95008_CBM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-coloring-balance-mirror-cap assertion failed: ${a.id}`);
  }
}

export default IMP95008_COLORING_BALANCE_MIRROR_CAP;
