// Offline compute for the imp-95008 E-realization split (continuation 23).
// Reconstructs the terminal 13-packet headline witness (fifteenth continuation
// JOINT_BIG + CHAIN_BIG), computes the channel split E = X_par + X_env - N,
// the envelope caps, and the residual factorization. Prints literals to bake.

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
const TX = tailAllSharp(800);

function fCorr(z) {
  return Math.exp(-z) * (1 + z);
}
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return fCorr(m * tau) / m;
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
    if (b > 60) throw new Error("block search failed");
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

let w = pentaWitness(P_BIG);
const mus = [...JOINT_BIG.mus];
const a = [...JOINT_BIG.a];
for (const st of CHAIN_BIG) {
  w = appendGridPoint(P_BIG, w, st.k);
  mus.push(st.nu);
  a.push(st.eps);
}
const n = a.length;
console.log("packets:", n, "blocks:", w.block.join(","));

// exact excess (sibling convention) and the channel split
let E = 0;
for (let i = 0; i < n; i++) E -= (a[i] * a[i]) / mus[i];
let Xpar = 0;
let Xenv = 0;
let sameBlockCross = 0; // 2 sum_{i<j same block} <a_i, a_j>
const pairBlockIP = new Map(); // "b:bp" -> <w_b, w_bp> for b < bp
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    const ip = a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
    const bi = w.block[i];
    const bj = w.block[j];
    if (bi === bj) {
      E -= 2 * ip;
      sameBlockCross += 2 * ip;
    } else {
      E += 2 * ip;
      const lo = Math.min(bi, bj);
      const hi = Math.max(bi, bj);
      const key = lo + ":" + hi;
      pairBlockIP.set(key, (pairBlockIP.get(key) || 0) + ip);
      if ((bi + bj) % 2 === 0) Xenv += 2 * ip;
      else Xpar += 2 * ip;
    }
  }
}
let D = 0;
for (let i = 0; i < n; i++) D += (a[i] * a[i]) / mus[i];
const N = D + sameBlockCross; // sum_b ||w_b||^2
console.log("E        =", E);
console.log("D (diag) =", D);
console.log("sameBlk  =", sameBlockCross);
console.log("N        =", N);
console.log("Xpar     =", Xpar);
console.log("Xenv     =", Xenv);
console.log("split check E - (Xpar + Xenv - N) rel =", Math.abs(E - (Xpar + Xenv - N)) / Math.abs(E));
for (const [k2, v] of [...pairBlockIP.entries()].sort()) console.log("  <w_b,w_bp>", k2, "=", v);

// mass currency
const bmax = Math.max(...w.block);
const nb = new Array(bmax + 1).fill(0);
for (let i = 0; i < n; i++) nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], SS);
const M = nb.reduce((acc, x) => acc + x * x, 0);
console.log("nb =", nb.join(", "));
console.log("M  =", M);
console.log("Tx =", TX);
const F = E / (TX * M);
console.log("F  =", F, " (HEAD_FLOOR lit 0.096745062937484763, rel", Math.abs(F - 0.096745062937484763) / 0.096745062937484763, ")");

// residual factorization with the certified aggregation constant
const LW = 3.9197935113802585e-5;
const r = (LW * M) / E;
console.log("r = Lw M / E =", r, " (RESIDUAL_SW lit 1.4032010197013394, rel", Math.abs(r - 1.4032010197013394) / 1.4032010197013394, ")");
const attainment = Xenv / (LW * M);
const balance = E / (2 * Xenv);
console.log("attainment = Xenv/(Lw M) =", attainment);
console.log("balance    = E/(2 Xenv)  =", balance);
console.log("1/(2*att*bal) =", 1 / (2 * attainment * balance), "(must equal r)");
console.log("lower bound r >= Lw M/(2 Xenv) =", (LW * M) / (2 * Xenv));

// parity-balance defect ||U - V||^2 = N + Xenv - Xpar
const defect = N + Xenv - Xpar;
console.log("||U-V||^2 = N + Xenv - Xpar =", defect, " rel to N:", defect / N);

// norm-penalty framing of the 22nd module: X/E and Lw M/X
const X = Xpar + Xenv;
console.log("X = Xpar + Xenv =", X);
console.log("Lw M / X =", (LW * M) / X);
console.log("X / E    =", X / E);
console.log("N / X    =", N / X);

// ── envelope caps: Lemma PF exact closed form (nineteenth/twenty-second) ─────
function binom(nn, k) {
  let rr = 1;
  for (let i = 1; i <= k; i++) rr = (rr * (nn - k + i)) / i;
  return rr;
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
  const aa = rho + T;
  const rs = Math.pow(rho, s);
  if (rs === 0) return 0;
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(1 - aa, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(aa - 1, -(2 * s - k));
    sum += (rs * (ck * Math.pow(aa, 1 - k) + dk)) / (k - 1);
  }
  const c1 = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(1 - aa, -(2 * s - 1));
  return sum + (c1 === 0 ? 0 : rs * c1 * Math.log(1 / aa));
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
function gOldQ(j) {
  return (Math.pow(2, j - 1) - 1) / (QREF * Math.pow(2, j * BETA));
}
function cornerV(b, j) {
  return Math.pow(2, b * (1 - BETA)) * Math.pow(2, BETA) * gOldQ(j);
}
function rhoCap(j) {
  return Math.pow(2, -(j - 1) * BETA);
}
function envE(b, j) {
  return iExact(cornerV(b, j), rhoCap(j), SS);
}
const e02 = envE(0, 2);
const e12 = envE(1, 2);
console.log("envE(0,2) =", e02, " envE(1,2) =", e12);
const cap02 = 2 * nb[0] * nb[2] * e02;
const cap13 = 2 * nb[1] * nb[3] * e12;
const capSum = cap02 + cap13;
console.log("cap (0,2) =", cap02, " cap (1,3) =", cap13, " capSum =", capSum);
console.log("realized Xenv(0,2) =", 2 * (pairBlockIP.get("0:2") || 0), " Xenv(1,3) =", 2 * (pairBlockIP.get("1:3") || 0));
console.log("Xenv <= capSum ?", Xenv <= capSum, " ratio Xenv/capSum =", Xenv / capSum);
console.log("capSum <= Lw M ?", capSum <= LW * M, " capSum/(Lw M) =", capSum / (LW * M));
console.log("per-pair attainment (0,2): realized/cap =", (2 * (pairBlockIP.get("0:2") || 0)) / cap02);
console.log("per-pair attainment (1,3): realized/cap =", (2 * (pairBlockIP.get("1:3") || 0)) / cap13);

// ── full-line quadrature cross-check: E = ||S||^2 - 2N ──────────────────────
function quadCheck(step) {
  const pad = 45 / Math.min(...mus);
  const lo = Math.min(...w.u) - pad;
  const hi = Math.max(...w.u) + pad;
  const nn = Math.ceil((hi - lo) / step);
  const nBlocks = bmax + 1;
  let s2 = 0;
  const wb2 = new Array(nBlocks).fill(0);
  for (let k = 0; k < nn; k++) {
    const x = lo + k * step;
    const per = new Array(nBlocks).fill(0);
    for (let i = 0; i < n; i++) per[w.block[i]] += a[i] * Math.exp(-mus[i] * Math.abs(x - w.u[i]));
    let tot = 0;
    for (let b = 0; b < nBlocks; b++) {
      tot += per[b];
      wb2[b] += per[b] * per[b];
    }
    s2 += tot * tot;
  }
  s2 *= step;
  let Nq = 0;
  for (let b = 0; b < nBlocks; b++) Nq += wb2[b] * step;
  return { s2, Nq, Eq: s2 - 2 * Nq };
}
const q = quadCheck(1e-4);
console.log("quad ||S||^2 =", q.s2, " quad N =", q.Nq, " quad E =", q.Eq);
console.log("quad E rel vs closed form =", Math.abs(q.Eq - E) / Math.abs(E));
console.log("quad N rel =", Math.abs(q.Nq - N) / Math.abs(N));

// occupancy sub-factors
const Meven = nb[0] * nb[0] + nb[2] * nb[2];
const Modd = nb[1] * nb[1] + nb[3] * nb[3];
console.log("Meven =", Meven, " Modd =", Modd, " evenMassShare =", Meven / M);
console.log("evenProfileEff = 2 n0 n2/(n0^2+n2^2) =", (2 * nb[0] * nb[2]) / Meven);
console.log("bond/Lw =", e02 / LW);
console.log("occupancy product check =", ((2 * nb[0] * nb[2]) / Meven) * (e02 / LW) * (Meven / M) + cap13 / (LW * M), "vs", capSum / (LW * M));
console.log("odd cap share cap13/capSum =", cap13 / capSum);
console.log("attainment 0,2 =", (2 * pairBlockIP.get("0:2")) / cap02, " weight cap02/capSum =", cap02 / capSum);
console.log("phi = E/(2 Lw M) =", E / (2 * LW * M));
console.log("three-factor product =", (Xenv / capSum) * (capSum / (LW * M)) * (E / (2 * Xenv)));
console.log("r recheck =", 1 / (2 * (Xenv / capSum) * (capSum / (LW * M)) * (E / (2 * Xenv))));
console.log("Xpar full =", Xpar, " 2<U,V> check via pair sums =", 2 * (pairBlockIP.get("0:1") + pairBlockIP.get("0:3") + pairBlockIP.get("1:2") + pairBlockIP.get("2:3")));
