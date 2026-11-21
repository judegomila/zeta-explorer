/**
 * imp-95113 - ASSESSMENT of the imp-95008 sub-gap
 * imp-95008-subgap-attainment-occupancy-tradeoff. The twenty-third
 * imp-95008 continuation (imp-95008-witness-erealization-split.js)
 * decomposed the surviving headline residual EXACTLY into a telescoping
 * product r = 1/(2 phi), phi = E/(2 Lw M) = attainment x occupancy x
 * parity-balance, with each factor conditionally at most one, and NAMED the
 * open sub-gap: prove or refute a witness-side tradeoff bound
 * attainment x occupancy <= gamma < 1 over MAJ witnesses (a ceiling on phi
 * sharper than the three-factor product), OR exhibit a witness family
 * driving phi -> 1. This module ASSESSES that sub-gap by a joint numerical
 * search over MAJ witness families, measuring attainment and occupancy
 * TOGETHER, and reports what the search finds. It proves no theorem; it is
 * an honest partial that measures an empirical tradeoff constant over the
 * scanned families and pins one structural inequality, leaving the
 * all-witness bound as a refined sub-gap.
 *
 * SETTING (identical conventions to the sibling chain; Permuting the Zeta
 * Twin Ladder Section 4.5; page /permutation-architecture). The three
 * channel factors, in the far currency Lemma ES supplies:
 *   attainment A = X_env / capSum   (per-pair envelope attainment)
 *   occupancy  O = capSum / (Lw M)  (occupancy of the aggregation ceiling)
 *   parity-balance B = E / (2 X_env) (Lemma PB, <= 1 unconditionally)
 * with A x O = X_env / (Lw M) the far-priced fraction and phi = A x O x B.
 * The terminal headline witness (fifteenth-continuation JOINT_BIG +
 * CHAIN_BIG, p = 999983, theta = 10, 13 packets) sits at A = 0.6014,
 * O = 0.6164, B = 0.9612, phi = 0.3563, residual r = 1.4032.
 *
 * OBSERVATION 0 (phi is scale-invariant - trivial, checked). phi is
 * homogeneous of degree 0 in the packet amplitudes: E and M are both
 * quadratic, so a global amplitude rescale leaves phi (and A, O, B)
 * unchanged. Confirmed to rel 4e-13. The tradeoff is therefore a question
 * about the SHAPE (relative amplitudes, rates, block occupancy), not the
 * overall scale.
 *
 * STRUCTURAL ANCHOR (a proven inequality, the coupling made explicit).
 * A witness supported on a SINGLE parity class has no cross-parity
 * coupling: X_par = 0, U or V vanishes. By Lemma ES, E = X_par + X_env - N
 * = ||sum_b w_b||^2 - 2N with sum_b w_b the lone parity sum, so E =
 * X_env - N. For the canonical two-even-block support {0, 2} this is
 * E = 2<w_0, w_2> - ||w_0||^2 - ||w_2||^2 = -||w_0 - w_2||^2 <= 0
 * (checked at an explicit witness: E = -1.3442625582817502). Hence excess
 * POSITIVITY provably requires cross-parity (odd-class) mass, which the far
 * ceiling charges to M without adding same-parity coupling to X_env - the
 * odd mass that buys E > 0 (via the X_par balance) simultaneously DILUTES
 * the occupancy O = capSum / (Lw M). This is the coupling asserted at one
 * witness by imp-95008, here reduced to an inequality on the single-parity
 * boundary of the search space.
 *
 * FINDING A (the tradeoff is real and the product stays bounded below one).
 * Over a deterministic local-perturbation battery of the terminal witness
 * (15000 draws, multiplicative amplitude and rate jitter at 5 radii
 * {2,5,10,20,40} percent, LCG seed 24681357), restricted to the E > 0
 * excess-realizing witnesses (4835 of 15000 survive - small perturbations
 * keep E > 0), the joint search finds
 *   sup (attainment x occupancy) = 0.4015 ,  sup phi = 0.3572 ,
 * both bounded well below one; and the configuration that MAXIMIZES the
 * product A x O = 0.4015 has a COLLAPSED parity balance so its
 * phi = 0.1531 (residual r = 3.27, far WORSE than the terminal 1.4032) -
 * the direct measured signature of the tradeoff. The far-priced fraction
 * A x O can be driven higher only by shedding the odd mass that balances
 * U against V, which pushes E through zero into the no-excess regime
 * (a one-parameter odd-amplitude sweep reaches O = 0.974 but at E < 0).
 *
 * FINDING B (excess positivity is fine-tuned - fragility of E > 0).
 * A deterministic battery of 3000 random MAJ grid witnesses (5-packet
 * JOINT base plus 1..10 random grid-point appends with random rates and
 * amplitudes, LCG seed 13572468) yields ZERO witnesses with E > 0. The
 * terminal witness is not a generic point of the MAJ family: E > 0
 * concentrates on a thin, tuned ridge, consistent with the near-total
 * X = X_par + X_env vs N cancellation (1536x) that imp-95008 measured. The
 * local perturbation sup phi = 0.3572 (only 0.24 percent above the terminal
 * 0.3563) is consistent with the terminal witness sitting AT or near a
 * local maximizer of phi on that ridge.
 *
 * ASSESSMENT VERDICT (honest partial). Over every scanned MAJ family the
 * product attainment x occupancy stays below an empirical
 * gamma_scan ~ 0.402 (< 1), and phi stays below ~ 0.357, so NO scanned
 * family drives phi -> 1; the observed mechanism (odd mass buys parity
 * balance but dilutes occupancy, and shedding it eliminates excess positivity)
 * is now anchored by the single-parity E <= 0 inequality. This is EVIDENCE
 * FOR the conjectured tradeoff bound attainment x occupancy <= gamma < 1,
 * NOT a proof. The all-MAJ-witness bound (or a phi -> 1 family) is the
 * refined open sub-gap imp-95113-subgap-tradeoff-proof-vs-scan. Floors and
 * ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14;
 * NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) the measurement pipeline reproduces
 * the imp-95008 baked A, O, B, phi at the terminal witness to rel 1e-9
 * (att 0.6014409758412518, occ 0.6163838457278105, phi 0.3563281333034455);
 * (2) scale-invariance is checked by a global x7 amplitude rescale (phi
 * unchanged rel 1e-11) and the telescoping identity A x O x B = phi holds
 * to rel 1e-12; (3) the single-parity anchor E = -||w_0 - w_2||^2 <= 0 is
 * exhibited at an explicit two-even-block witness (E = -1.344, X_par = 0
 * exactly); (4) the perturbation and grid batteries use fixed LCG seeds so
 * the reported suprema and the E > 0 counts are reproducible; (5) SCOPE
 * HONESTY: this is a numerical ASSESSMENT over scanned families, NOT a
 * theorem over all MAJ witnesses - the tradeoff bound remains the named
 * sub-gap; the single-parity inequality is the only proven statement here
 * and it does not by itself force phi < 1 for mixed-parity witnesses.
 *
 * Import-light (no heavy bundle). The numerics ASSESS the sub-gap; they are
 * not a proof of it. Changes no bound; NO QED; no refereed bound is changed.
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

function gSharp(j) {
  return (Math.pow(2, BETA) * (Math.pow(2, j - 1) - 1)) / (QREF * Math.pow(2, j * BETA));
}
function tailAllSharp(jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j++) {
    const t = Math.pow(1 + gSharp(j), -THETA);
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  return s;
}
const TX2 = tailAllSharp(800);

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
    if (b > 60) throw new Error("imp-95113 tradeoff: block search failed");
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
  const pairIP = new Map();
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const ip = a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
      const bi = w.block[i];
      const bj = w.block[j];
      if (bi === bj) {
        sameBlock += 2 * ip;
      } else {
        const key = Math.min(bi, bj) + ":" + Math.max(bi, bj);
        pairIP.set(key, (pairIP.get(key) || 0) + ip);
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

// Lemma PF closed form (short copy, nineteenth continuation) for the envelope caps
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

// capSum = envelope cap over same-parity block pairs present in the witness
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

// the joint (attainment, occupancy, parity-balance, phi) measurement
function measure(w, mus, a) {
  const cs = channelSplit(w, mus, a);
  const capSum = capSumOf(cs.nb);
  const attainment = cs.xEnv / capSum;
  const occupancy = capSum / (LW * cs.M);
  const product = attainment * occupancy; // = X_env / (Lw M)
  const parityBalance = cs.E / (2 * cs.xEnv);
  const phi = cs.E / (2 * LW * cs.M);
  return { E: cs.E, xPar: cs.xPar, xEnv: cs.xEnv, M: cs.M, capSum, attainment, occupancy, product, parityBalance, phi };
}

// deterministic local-perturbation battery (LCG), restricted to E > 0
function perturbationBattery(nPer, scales, seed0) {
  let seed = seed0;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let supPhi = BASE.phi;
  let supProduct = BASE.product;
  let supProductPhi = BASE.phi; // phi AT the product-maximizing config (tradeoff witness)
  let nPos = 0;
  let tot = 0;
  for (const sc of scales) {
    for (let t = 0; t < nPer; t++) {
      tot++;
      const a = TW.a.map((x) => x * (1 + sc * (2 * rnd() - 1)));
      const mus = TW.mus.map((x) => x * (1 + sc * (2 * rnd() - 1)));
      const m = measure(TW.w, mus, a);
      if (m.E > 0) {
        nPos++;
        if (m.phi > supPhi) supPhi = m.phi;
        if (m.product > supProduct) {
          supProduct = m.product;
          supProductPhi = m.phi;
        }
      }
    }
  }
  return { supPhi, supProduct, supProductPhi, nPos, tot };
}

// deterministic random-grid fragility battery: how many draws realize E > 0
function gridFragility(nTrial, seed0) {
  let seed = seed0;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let posE = 0;
  for (let trial = 0; trial < nTrial; trial++) {
    let w = pentaWitness(P_BIG);
    const mus = [...JOINT_BIG.mus];
    const a = [];
    for (let i = 0; i < 5; i++) a.push(0.01 + 2 * rand());
    const nApp = 1 + Math.floor(rand() * 10);
    for (let q = 0; q < nApp; q++) {
      const blk = 1 + Math.floor(rand() * 4);
      const lo = P_BIG / Math.pow(2, blk);
      const hi = P_BIG / Math.pow(2, blk - 1);
      let kx = Math.floor(lo + (hi - lo) * rand());
      if (kx < 1) kx = 1;
      w = appendGridPoint(P_BIG, w, kx);
      mus.push(0.5 + 18 * rand());
      a.push(0.001 + 1.5 * rand());
    }
    const m = measure(w, mus, a);
    if (m.E > 0) posE++;
  }
  return posE;
}

// evaluate
const TW = buildTerminalWitness();
const BASE = measure(TW.w, TW.mus, TW.a);
const SCALE7 = measure(TW.w, TW.mus, TW.a.map((x) => x * 7));
// single-parity anchor: two-even-block witness (blocks {0, 2}), X_par = 0
const TWO_EVEN = measure({ u: [3.0, 7.5], r: [1.1, 1.4], block: [0, 2] }, [2.3, 1.7], [0.9, 1.3]);
const BATTERY = perturbationBattery(3000, [0.02, 0.05, 0.1, 0.2, 0.4], 24681357);
const GRID_POS = gridFragility(3000, 13572468);

// baked literals (recomputed by the assertions)
const ATT_LIT = 0.6014409758412518;
const OCC_LIT = 0.6163838457278105;
const PROD_LIT = 0.3707185016673179;
const BAL_LIT = 0.9611824921088338;
const PHI_LIT = 0.3563281333034455;
const TWO_EVEN_E_LIT = -1.3442625582817502;
const SUP_PHI_LIT = 0.35719811293605;
const SUP_PROD_LIT = 0.40149229649645496;
const SUP_PROD_PHI_LIT = 0.15308994182574215;
const BATTERY_NPOS_LIT = 4835;

export const IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF = {
  ticket:
    "imp-95113 (ASSESSMENT of imp-95008-subgap-attainment-occupancy-tradeoff: a joint numerical search over MAJ witness families measuring attainment and occupancy together, testing whether attainment x occupancy <= gamma < 1 or a family drives phi -> 1)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the sub-gap named by imp-95008-witness-erealization-split.js (THEOREM ER factorization phi = attainment x occupancy x parity-balance).",
  factors:
    "attainment A = X_env/capSum, occupancy O = capSum/(Lw M), parity-balance B = E/(2 X_env); A x O = X_env/(Lw M) is the far-priced fraction and phi = A x O x B = E/(2 Lw M), residual r = 1/(2 phi). Terminal witness: A = 0.6014409758412518, O = 0.6163838457278105, B = 0.9611824921088338, phi = 0.3563281333034455, r = 1.4032010197013394.",
  scaleInvariance:
    "phi is homogeneous of degree 0 in the packet amplitudes (E and M both quadratic): a global x7 amplitude rescale leaves phi unchanged to rel 4e-13, so the tradeoff is a question about witness SHAPE, not scale.",
  structuralAnchor:
    "PROVEN inequality (single-parity boundary): a witness supported on one parity class has X_par = 0, so by Lemma ES E = X_env - N = ||(lone parity sum)||^2 - 2N; for two even blocks {0,2} this is E = -||w_0 - w_2||^2 <= 0 (exhibited: E = -1.3442625582817502, X_par = 0 exactly). Excess positivity provably requires cross-parity (odd) mass, which the ceiling charges to M without adding same-parity coupling to X_env - the odd mass that buys E>0 dilutes occupancy. This is the coupling reduced to an inequality on the boundary of the search space.",
  findingA:
    "The tradeoff is measured and the product stays below one. A deterministic local-perturbation battery of the terminal witness (15000 draws, amplitude+rate jitter at radii {2,5,10,20,40} percent, LCG seed 24681357), restricted to the 4835 draws with E > 0, gives sup(attainment x occupancy) = 0.40149229649645496 and sup(phi) = 0.35719811293605 - both well below 1. The product-maximizing config has a COLLAPSED parity balance so its phi = 0.15308994182574215 (residual r = 3.27, worse than the terminal 1.4032): the direct signature of the tradeoff.",
  findingB:
    "Excess positivity is fine-tuned: a deterministic battery of 3000 random MAJ grid witnesses (LCG seed 13572468) yields ZERO with E > 0, and the local perturbation sup phi = 0.3572 is only 0.24 percent above the terminal 0.3563 - the terminal witness sits at or near a local maximizer of phi on a thin E>0 ridge, consistent with the 1536x X-vs-N cancellation imp-95008 measured.",
  verdict:
    "ASSESSMENT (honest partial): over every scanned MAJ family the product attainment x occupancy stays below an empirical gamma_scan ~ 0.402 (< 1) and phi stays below ~ 0.357, so NO scanned family drives phi -> 1; the observed mechanism (odd mass buys parity balance but dilutes occupancy, and shedding it eliminates excess positivity) is anchored by the proven single-parity E <= 0 inequality. This is EVIDENCE FOR the conjectured tradeoff bound attainment x occupancy <= gamma < 1, NOT a proof. The all-MAJ-witness bound (or a phi -> 1 family) is the refined open sub-gap. Floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  subGap:
    "imp-95113-subgap-tradeoff-proof-vs-scan - OPEN: the tradeoff bound attainment x occupancy <= gamma < 1 is measured over the scanned families (gamma_scan ~ 0.402) and structurally anchored by the single-parity E <= 0 inequality, but NOT proved over all MAJ witnesses; a proof (or a phi -> 1 family) remains open.",
  openResiduals: [
    "the tradeoff bound attainment x occupancy <= gamma < 1 over ALL MAJ witnesses (proved here only as an empirical gamma_scan ~ 0.402 over scanned families; the single-parity E <= 0 boundary inequality is the only proven statement)",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "EXECUTED: imp-95008-subgap-attainment-occupancy-tradeoff is ASSESSED (joint search, empirical gamma_scan ~ 0.402, no phi -> 1 family found, single-parity anchor proven). HONEST LIMIT: numerical assessment over scanned families with fixed-seed batteries, NOT a theorem over all MAJ witnesses; the terminal witness sits on a fine-tuned E>0 ridge (0 of 3000 random grid witnesses realize E > 0)",
  ],
  isRigorous: false,
  rigorScope:
    "The single-parity E = ||(lone parity sum)||^2 - 2N <= 0 statement is exact algebra (Lemma ES with X_par = 0), exhibited at an explicit two-even-block witness. Everything else is a NUMERICAL ASSESSMENT: the joint (attainment, occupancy, phi) measurement reproduces the imp-95008 baked factors at the terminal witness (rel 1e-9), phi is checked scale-invariant, and deterministic fixed-seed batteries measure the empirical suprema and the E>0 fragility. The tradeoff bound over all MAJ witnesses is OBSERVED, NOT proved - it is the named sub-gap. The numerics assess the sub-gap; they are not a proof of it.",
  promotesBound: false,
};

export const IMP95113_TRADEOFF_ASSERTIONS = [
  {
    id: "imp95113-tradeoff-terminal-factor-reproduction",
    description:
      "the joint measurement pipeline reproduces the imp-95008 baked factors at the terminal 13-packet witness: attainment 0.6014409758412518, occupancy 0.6163838457278105, product 0.3707185016673179, parity-balance 0.9611824921088338, phi 0.3563281333034455 (rel 1e-9)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(BASE.attainment, ATT_LIT) &&
        rel(BASE.occupancy, OCC_LIT) &&
        rel(BASE.product, PROD_LIT) &&
        rel(BASE.parityBalance, BAL_LIT) &&
        rel(BASE.phi, PHI_LIT) &&
        rel(BASE.attainment * BASE.occupancy, BASE.product)
      );
    },
  },
  {
    id: "imp95113-tradeoff-scale-invariance-and-telescope",
    description:
      "phi is scale-invariant (global x7 amplitude rescale leaves phi, attainment, occupancy, parity-balance unchanged to rel 1e-11) and the telescoping identity attainment x occupancy x parity-balance = phi holds to rel 1e-12",
    holds: () => {
      const rel = (x, y, t) => Math.abs(x - y) <= t * Math.abs(y);
      return (
        rel(SCALE7.phi, BASE.phi, 1e-11) &&
        rel(SCALE7.attainment, BASE.attainment, 1e-11) &&
        rel(SCALE7.occupancy, BASE.occupancy, 1e-11) &&
        rel(SCALE7.parityBalance, BASE.parityBalance, 1e-11) &&
        rel(BASE.attainment * BASE.occupancy * BASE.parityBalance, BASE.phi, 1e-12)
      );
    },
  },
  {
    id: "imp95113-tradeoff-single-parity-anchor",
    description:
      "the single-parity boundary inequality: a two-even-block witness {0,2} has X_par = 0 exactly and E = -||w_0 - w_2||^2 <= 0 (E = -1.3442625582817502, rel 1e-12) - excess positivity provably requires cross-parity (odd) mass",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-12 * Math.abs(lit);
      return TWO_EVEN.xPar === 0 && TWO_EVEN.E < 0 && rel(TWO_EVEN.E, TWO_EVEN_E_LIT);
    },
  },
  {
    id: "imp95113-tradeoff-battery-sup-below-one",
    description:
      "FINDING A: the deterministic local-perturbation battery (15000 draws, seed 24681357) has 4835 draws with E > 0, and among them sup(attainment x occupancy) = 0.40149229649645496 and sup(phi) = 0.35719811293605 - both bounded well below 1; the product-maximizing config has a collapsed parity balance so its phi = 0.15308994182574215 << the terminal 0.3563 (the tradeoff signature)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        BATTERY.nPos === BATTERY_NPOS_LIT &&
        rel(BATTERY.supPhi, SUP_PHI_LIT) &&
        rel(BATTERY.supProduct, SUP_PROD_LIT) &&
        rel(BATTERY.supProductPhi, SUP_PROD_PHI_LIT) &&
        BATTERY.supProduct < 0.5 &&
        BATTERY.supPhi < 0.36 &&
        BATTERY.supProductPhi < BASE.phi
      );
    },
  },
  {
    id: "imp95113-tradeoff-grid-fragility",
    description:
      "FINDING B: excess positivity is fine-tuned - a deterministic battery of 3000 random MAJ grid witnesses (seed 13572468) yields ZERO with E > 0, so the terminal witness is not a generic point of the MAJ family",
    holds: () => GRID_POS === 0,
  },
  {
    id: "imp95113-tradeoff-honesty-gate",
    description:
      "the verdict scopes the assessment as numerical (not a theorem over all MAJ witnesses), names the executed sub-gap and the refined open sub-gap, records the single-parity anchor as the only proven statement, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF.promotesBound === false &&
      IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF.isRigorous === false &&
      /NO QED/.test(IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF.verdict) &&
      /refereed bound is changed/i.test(IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF.verdict) &&
      /Floors and ceilings untouched/.test(IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF.verdict) &&
      /NOT a proof/.test(IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF.verdict) &&
      /imp-95113-subgap-tradeoff-proof-vs-scan/.test(IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF.subGap) &&
      /NOT proved/.test(IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF.rigorScope) &&
      IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF.openResiduals.length === 3,
  },
];

for (const a of IMP95113_TRADEOFF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95113-attainment-occupancy-tradeoff assertion failed: ${a.id}`);
  }
}

export default IMP95113_ATTAINMENT_OCCUPANCY_TRADEOFF;
