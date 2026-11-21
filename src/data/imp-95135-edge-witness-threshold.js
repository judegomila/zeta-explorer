/**
 * imp-95135 - THEOREM WE (grid-extremal edge witness, certified rate
 * 23/100) + COROLLARY RM (family threshold pinned to a one-variable root):
 * NARROWS imp-95134-subgap-aggregation-threshold-sharpness on the WITNESS
 * side. The imp-95134 sandwich for the sharp parity-pure class threshold
 * was [0.127, 0.4], whose lower end was the THEOREM PX family at grid
 * positions (u, 4u, 16u) with u = 1.4285 - far from the facing block
 * edges, so the witness side was slack. This module places the three
 * packets at the GRID-EXTREMAL points hugging the facing edges of blocks
 * 0/2/4 and certifies E > 0 at common rate 23/100, raising the certified
 * lower end 0.127 to 0.23.
 *
 * THEOREM WE. At p = 999983 take the grid points k1 = 499992,
 * k2 = 249995, k3 = 62498, i.e. positions u1 = p/k1 = 1.9999979999679995
 * in [1, 2), u2 = p/k2 = 4.000012000240004 in [4, 8), u3 = p/k3 =
 * 16.000240007680247 in [16, 32) - blocks 0, 2, 4, ALL EVEN
 * (parity-pure), and GRID-EXTREMAL: the adjacent indices leave the
 * blocks (p/(k1 - 1) >= 2, p/(k2 + 1) < 4, p/(k3 + 1) < 16), so no legal
 * grid point sits closer to the facing edges. With integer amplitudes
 * a = (675, 685, 276) and ONE common rate mu = 23/100,
 *   mu E = 2 [a1 a2 g(mu t12) + a1 a3 g(mu t13) + a2 a3 g(mu t23)]
 *          - (a1^2 + a2^2 + a3^2) > 4093.236 > 0,
 * where g(z) = exp(-z)(1 + z) and t12 = u2 - u1, t23 = u3 - u2,
 * t13 = u3 - u1 (exact rationals). CERTIFICATE: each g(z) is bounded
 * below by (1 + z) times [the truncated alternating series
 * sum for n = 0..19 of (-z)^n / n!, minus an explicit 1e-12 float
 * slack] - the truncation ends on the NEGATIVE n = 19 term and all
 * z <= 3.2200556617738174 < 21, so the tail magnitudes decrease and the
 * mathematical remainder is positive; the slack absorbs double rounding
 * (both truncations are ulp-tight at small z, true truncation error
 * ~1e-27). The diagonal term 1001026 is exact integer arithmetic. Exact
 * float value mu E = 4093.2446 (E = 17796.7158 at mu = 23/100), the
 * certified lower value 4093.2362. Hence the sharp
 * parity-pure class threshold is >= 23/100: the certified sandwich
 * NARROWS from [0.127, 0.4] to [0.23, 0.4]. QED (witness exhibited).
 *
 * COROLLARY RM (family threshold = a one-variable root; rate mixing is
 * useless). Fix the three positions above, let the rates be FREE with
 * floor r (all mu_i >= r) and the amplitudes free nonnegative. Then an
 * E > 0 assignment exists iff
 *   F3(r) = P12^2 + P13^2 + P23^2 + 2 P12 P13 P23 > 1,
 *   Pij = g(r |ui - uj|).
 * PROOF. (i) Substituting c_i = a_i sqrt(mu_i) gives E = c^T (G - I) c
 * with G_ij = sqrt(mu_i mu_j) K(mu_i, mu_j, tau_ij) >= 0, zero diagonal.
 * Lemma RC (carried, imp-95131) gives sqrt(ab) K(a, b, tau) <=
 * g(min(a, b) tau) <= g(r tau) (g strictly decreasing), so G is
 * entrywise dominated by the equal-floor matrix G_r with entries Pij.
 * For symmetric entrywise-ordered nonnegative matrices 0 <= A <= B,
 * lamMax(A) <= lamMax(B): by Perron-Frobenius the spectral radius of A
 * is its largest eigenvalue with a NONNEGATIVE eigenvector x, and
 * lamMax(A) = x^T A x <= x^T B x <= lamMax(B). So mixing rates above the
 * floor never helps. (ii) det(lam I - G_r) = lam^3 - (sum Pij^2) lam
 * - 2 P12 P13 P23; trace 0 and det(G_r) = 2 P12 P13 P23 > 0 force the
 * eigen signature (+, -, -), so the characteristic value at 1, which is
 * 1 - F3(r), factors as (1 - lam1)(1 - lam2)(1 - lam3) with the last two
 * factors positive: lamMax(G_r) > 1 iff F3(r) > 1. (iii) Attainment on
 * the nonnegative cone: G_r is irreducible nonnegative, its Perron
 * vector is nonnegative and attains lamMax, and a_i = c_i / sqrt(mu_i)
 * >= 0. QED.
 * CERTIFIED BRACKET: F3(23/100) >= 1.0084962051183664 > 1 (lower
 * series, N = 19, minus slack) and F3(47/200) <= 0.988347714 < 1 (upper
 * series, N = 20, plus slack), so the FAMILY threshold lies in
 * (23/100, 47/200) = (0.23, 0.235); float root 0.23206852812691425
 * (measured, NOT certified).
 *
 * MEASURED COLOR (float, not certified): extending the chain with blocks
 * 6 and 8 (one edge packet each) moves the root only to
 * 0.23206853015190532 (shift +2.0e-9, saturated by the 7-block chain),
 * and the u2 grid scan over k in [125000, 249995] peaks at the extremal
 * k2 = 249995 - chain witness families saturate near 0.2321. Since the
 * imp-95134 row-majorant float root is 0.389, the surviving open
 * interval (0.23, 0.4) of the class sandwich is now predominantly
 * AGGREGATION-side: the per-pair AM-GM row reduction charges every block
 * the FULL sorted-gap ladder while a witness realizes only its actual
 * pairs (the witness attains the sharp imp-95134 pair cap exactly on the
 * first rung, tau12 = gap = 2 up to grid quantization).
 *
 * IN-CLASS MEMBERSHIP (same verification as THEOREM PX): at the witness
 * every per-pair kernel value sits below its carried envelope cap
 * (max ratio 1.5280353344413634e-13 <= 1), X_env <= capSum, and
 * occupancy capSum / (LwEven M) = 0.19163454137170494 <= 1. The witness
 * moves NO floor: the legality weight prices rate 23/100 at
 * phi = 1.4149901045612152e-23 (same mechanism as PX; the
 * imp-95131-subgap-rate-to-phi-pricing leg is unaffected).
 *
 * WHAT THIS NARROWS AND WHAT IT DOES NOT.
 * (1) imp-95134-subgap-aggregation-threshold-sharpness NARROWED, not
 *     closed: certified sandwich [0.23, 0.4] (was [0.127, 0.4]); the
 *     fixed-position family is certified exhausted at 47/200, and chain
 *     variants measure out at ~0.2321, so further narrowing must come
 *     from the aggregation side (AM-GM + ladder) or a structurally
 *     different witness family.
 * (2) THEOREM CC (2/5) is untouched and consistent: this witness has
 *     E(2/5) = -564892.9489416687 < 0 and its E > 0 rate 23/100 < 2/5.
 * (3) THEOREM PX is superseded ONLY as the sandwich lower end (0.127 <
 *     0.23); its role in refuting the omega_min lemma form (imp-95130)
 *     is untouched.
 * (4) Parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 *
 * HONEST LIMITS. (a) Model-family constants, not the paper Section 4.5
 * packets. (b) The class threshold remains sandwiched, not determined:
 * [0.23, 0.4] certified endpoints, float landmarks 0.2321 (chain
 * saturation) and 0.389 (majorant root) measured only. (c) COROLLARY RM
 * pins the FIXED-POSITION family, not the class. (d) Parity-pure only.
 * (e) Changes no bound; does NOT promote Lambda <= 0.14; NO QED on any
 * open leg; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) the series bounds were stress-tested at
 * all six z values used: BOTH truncations were caught rounding past
 * Math.exp by ~1 ulp at z = 0.46-0.47 (the true truncation error there
 * is ~1e-27, far below double epsilon), hence the explicit 1e-12 slack
 * on BOTH certificates - the witness margin 4093 and the bracket margin
 * 0.0116 dwarf it. (2) The
 * F3-vs-lamMax dichotomy was stress-tested on 2000 seeded (P12, P13, P23)
 * triples: sign(F3 - 1) agrees with sign(lamMax - 1) in every case and
 * the characteristic identity char(1) = 1 - F3 reproduces to 1e-12.
 * (3) Rate mixing was stress-tested on a 3^6-point grid of rate multipliers
 * over three floors: lamMax(G_mixed) <= lamMax(G_floor) with zero
 * violations (Lemma RC domination re-verified on the same grid).
 * (4) Grid extremality is integer arithmetic: k1 2^0 <= p < k1 2^1,
 * k2 2^2 <= p < k2 2^3, k3 2^4 <= p < k3 2^5, and the adjacent indices
 * k1 - 1, k2 + 1, k3 + 1 each fail their block test. (5) The class
 * battery seeds 6000 multi-packet parity-pure witnesses at rates
 * >= 47/200 (2-5 blocks, up to 4 packets per block, edge-piled every
 * third draw): max E = -0.026646294899386594, zero E > 0 draws -
 * consistent with the family bracket though NOT a class certificate.
 * (6) In-class caps, occupancy, and phi were computed with the identical
 * imp-95130 legality machinery (Lemma PF closed form copied verbatim).
 * (7) Scope honesty: the certificate is the witness inequality; the
 * sandwich upper end 0.4 is THEOREM CC and is not re-proved here.
 *
 * Import-light (no heavy bundle, no imports). The numerics cross-check
 * the two displayed statements; the statements are the certificates.
 */

// exact sibling Gram kernel (identical to imp-95130..95134)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}
function g(z) {
  return Math.exp(-z) * (1 + z);
}

// truncated alternating exponential series: N odd => lower bound of
// exp(-z), N even => upper bound, valid for 0 <= z < N + 2
function expTrunc(z, N) {
  let s = 1;
  let t = 1;
  for (let n = 1; n <= N; n++) {
    t = (t * -z) / n;
    s += t;
  }
  return s;
}
const gLB = (z) => (1 + z) * (expTrunc(z, 19) - 1e-12);
const gUBs = (z) => (1 + z) * (expTrunc(z, 20) + 1e-12);

// THEOREM WE witness: grid-extremal points at the facing edges
const P_WE = 999983;
const K_WE = [499992, 249995, 62498];
const U_WE = K_WE.map((k) => P_WE / k);
const BLOCKS_WE = [0, 2, 4];
const A_WE = [675, 685, 276];
const MU_WE = 23 / 100;
const T12 = U_WE[1] - U_WE[0];
const T23 = U_WE[2] - U_WE[1];
const T13 = U_WE[2] - U_WE[0];

function muEWitness(mu, gFun) {
  const cross =
    2 *
    (A_WE[0] * A_WE[1] * gFun(mu * T12) +
      A_WE[0] * A_WE[2] * gFun(mu * T13) +
      A_WE[1] * A_WE[2] * gFun(mu * T23));
  return cross - (A_WE[0] * A_WE[0] + A_WE[1] * A_WE[1] + A_WE[2] * A_WE[2]);
}
function eWitness(mu) {
  let E = -(A_WE[0] * A_WE[0] + A_WE[1] * A_WE[1] + A_WE[2] * A_WE[2]) / mu;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      E += 2 * A_WE[i] * A_WE[j] * kernelK(mu, mu, Math.abs(U_WE[i] - U_WE[j]));
    }
  }
  return E;
}

// COROLLARY RM one-variable condition and its certified bounds
function F3(mu, gFun) {
  const p = gFun(mu * T12);
  const q = gFun(mu * T13);
  const r = gFun(mu * T23);
  return p * p + q * q + r * r + 2 * p * q * r;
}

// symmetric power iteration (deterministic start) for cross-checks
function lamMaxSym(G) {
  const n = G.length;
  let v = new Array(n).fill(1);
  let lam = 0;
  for (let it = 0; it < 3000; it++) {
    const w = v.map((_, i) => G[i].reduce((s, x, j) => s + x * v[j], 0));
    lam = Math.hypot(...w);
    if (lam === 0) return 0;
    v = w.map((x) => x / lam);
  }
  return lam;
}
function chainRoot(us) {
  const n = us.length;
  const lam = (mu) => {
    const G = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) G[i][j] = g(mu * Math.abs(us[i] - us[j]));
      }
    }
    return lamMaxSym(G);
  };
  let lo = 0.2;
  let hi = 0.3;
  for (let i = 0; i < 60; i++) {
    const m = 0.5 * (lo + hi);
    if (lam(m) > 1) lo = m;
    else hi = m;
  }
  return 0.5 * (lo + hi);
}

// carried legality machinery (Lemma PF closed form, identical to imp-95130)
const SIGMA = 1;
const BETA = 1 / 3;
const CC_ENV = 1;
const VV = 1;
const DD = 1;
const THETA = 10;
const SS = SIGMA + THETA;
const QREF = ((CC_ENV * Math.pow(DD, 1 - BETA)) / VV) * Math.pow(2, -(1 - BETA));
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
function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}
const LWE = 3.9197935113802585e-5; // carried even-class sandwich literal

function capsAtWitness() {
  const d = K_WE.map((k) => k / P_WE);
  const r = d.map((x) => CC_ENV * Math.pow(x, -BETA));
  let maxPairRatio = 0;
  let xEnv = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      const K = kernelK(MU_WE, MU_WE, Math.abs(U_WE[i] - U_WE[j]));
      const nbi = Math.sqrt(r[i]) / hLegal(MU_WE, r[i], SS);
      const nbj = Math.sqrt(r[j]) / hLegal(MU_WE, r[j], SS);
      const cap = nbi * nbj * envE(Math.min(BLOCKS_WE[i], BLOCKS_WE[j]), Math.abs(BLOCKS_WE[i] - BLOCKS_WE[j]));
      const ratio = K / cap;
      if (ratio > maxPairRatio) maxPairRatio = ratio;
      xEnv += 2 * A_WE[i] * A_WE[j] * K;
    }
  }
  const nb = new Array(5).fill(0);
  for (let i = 0; i < 3; i++) nb[BLOCKS_WE[i]] += (A_WE[i] * Math.sqrt(r[i])) / hLegal(MU_WE, r[i], SS);
  let M = 0;
  for (let b = 0; b < nb.length; b++) M += nb[b] * nb[b];
  let capSum = 0;
  for (let b = 0; b < 5; b++) {
    for (let bp = b + 1; bp < 5; bp++) {
      if ((b + bp) % 2 === 0 && nb[b] > 0 && nb[bp] > 0) capSum += 2 * nb[b] * nb[bp] * envE(b, bp - b);
    }
  }
  return { maxPairRatio, xEnv, capSum, occ: capSum / (LWE * M), phi: eWitness(MU_WE) / (2 * LWE * M) };
}
const CAPS = capsAtWitness();

// seeded LCG (deterministic batteries)
let seedState = 77777;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}

// battery A: F3-vs-lamMax dichotomy on seeded (P12, P13, P23) triples
function runDichotomyBattery() {
  seedState = 424242;
  let signAgree = true;
  let worstCharId = 0;
  for (let t = 0; t < 2000; t++) {
    const p = 0.02 + 0.96 * rnd();
    const q = 0.02 + 0.96 * rnd();
    const r = 0.02 + 0.96 * rnd();
    const G = [
      [0, p, q],
      [p, 0, r],
      [q, r, 0],
    ];
    const lam = lamMaxSym(G);
    const f3 = p * p + q * q + r * r + 2 * p * q * r;
    if (Math.abs(f3 - 1) > 1e-6 && (f3 > 1) !== (lam > 1)) signAgree = false;
    const charAt1 = 1 - (p * p + q * q + r * r) - 2 * p * q * r;
    const id = Math.abs(charAt1 - (1 - f3));
    if (id > worstCharId) worstCharId = id;
  }
  return { signAgree, worstCharId };
}
const BAT_DICH = runDichotomyBattery();

// battery B: rate-mixing approach (Corollary RM step i)
function runMixingBattery() {
  const mults = [1, 1.2, 5];
  let viol = 0;
  let rcViol = 0;
  for (const floor of [0.2321, 0.25, 0.3]) {
    const pF = g(floor * T12);
    const qF = g(floor * T13);
    const rF = g(floor * T23);
    const lamFloor = lamMaxSym([
      [0, pF, qF],
      [pF, 0, rF],
      [qF, rF, 0],
    ]);
    for (const m1 of mults) {
      for (const m2 of mults) {
        for (const m3 of mults) {
          const ms = [floor * m1, floor * m2, floor * m3];
          const taus = [
            [0, T12, T13],
            [T12, 0, T23],
            [T13, T23, 0],
          ];
          const G = Array.from({ length: 3 }, () => new Array(3).fill(0));
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              if (i === j) continue;
              const Kij = Math.sqrt(ms[i] * ms[j]) * kernelK(ms[i], ms[j], taus[i][j]);
              G[i][j] = Kij;
              if (Kij > g(Math.min(ms[i], ms[j]) * taus[i][j]) * (1 + 1e-9)) rcViol++;
            }
          }
          if (lamMaxSym(G) > lamFloor * (1 + 1e-12)) viol++;
        }
      }
    }
  }
  return { viol, rcViol };
}
const BAT_MIX = runMixingBattery();

// battery C: class approach at rates >= 47/200 (multi-packet, multi-block)
function runClassBattery() {
  seedState = 77777;
  let maxE = -Infinity;
  let eViol = 0;
  for (let t = 0; t < 6000; t++) {
    const parity = t % 2;
    const nbk = 2 + Math.floor(rnd() * 4);
    const bs = [];
    while (bs.length < nbk) {
      const b = parity + 2 * Math.floor(rnd() * 8);
      if (!bs.includes(b)) bs.push(b);
    }
    const us = [];
    const as = [];
    const mus = [];
    for (const b of bs) {
      const m = 1 + Math.floor(rnd() * 4);
      for (let i = 0; i < m; i++) {
        const frac = t % 3 === 0 ? rnd() * rnd() * rnd() : rnd();
        us.push(rnd() < 0.5 ? Math.pow(2, b + 1) - frac * Math.pow(2, b) : Math.pow(2, b) + frac * Math.pow(2, b));
        as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
        mus.push(0.235 * Math.pow(40, rnd() * rnd()));
      }
    }
    const bOf = us.map((u) => Math.floor(Math.log2(u)));
    let E = 0;
    for (let i = 0; i < us.length; i++) {
      for (let j = 0; j < us.length; j++) {
        const ip = as[i] * as[j] * kernelK(mus[i], mus[j], Math.abs(us[i] - us[j]));
        E += bOf[i] === bOf[j] ? -ip : ip;
      }
    }
    if (E > maxE) maxE = E;
    if (E > 0) eViol++;
  }
  return { maxE, eViol };
}
const BAT_CLASS = runClassBattery();

// baked literals (recomputed by the assertions)
const CERT_MUE_LOWER_LIT = 4093.236247746623;
const EXACT_MUE_LIT = 4093.2446343394695;
const E_WITNESS_LIT = 17796.715801475395;
const E_AT_CC_RATE_LIT = -564892.9489416687;
const F3LB_023_LIT = 1.0084962051183664;
const F3_023_LIT = 1.008496222581168;
const F3_0235_LIT = 0.9883477092247759;
const ROOT3_LIT = 0.23206852812691425;
const ROOT5_LIT = 0.23206853015190532;
const MAX_PAIR_RATIO_LIT = 1.5280353344413634e-13;
const OCC_LIT = 0.19163454137170494;
const PHI_LIT = 1.4149901045612152e-23;
const BAT_CLASS_MAX_E_LIT = -0.026646294899386594;
const PX_LOWER_END = 0.127;
const S_MAJORANT_ROOT_FLOAT = 0.389; // imp-95134 float landmark (measured)

export const IMP95135_EDGE_WITNESS_THRESHOLD = {
  ticket:
    "imp-95135 (THEOREM WE: grid-extremal edge witness with certified E > 0 at common rate 23/100 + COROLLARY RM pinning the fixed-position family threshold to the one-variable root F3 = 1, certified bracket (0.23, 0.235) - NARROWS imp-95134-subgap-aggregation-threshold-sharpness: sandwich [0.127, 0.4] to [0.23, 0.4])",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95130 witness/legality machinery (Lemma PF caps, hLegal, grid positions) and the imp-95131 Lemma RC; witness-side progress on the imp-95134 open leg; parent imp-95130-subgap-phi-conditional-odd-mass unaffected.",
  theoremWE:
    "At p = 999983 the grid-extremal points k = (499992, 249995, 62498) hug the facing edges of blocks 0/2/4: u = (1.9999979999679995, 4.000012000240004, 16.000240007680247), adjacent indices leave the blocks. With integer amplitudes (675, 685, 276) and common rate mu = 23/100, mu E >= 4093.236247746623 > 0 certified by N = 19 truncated alternating-series lower bounds minus an explicit 1e-12 float slack on the three g values (all z <= 3.221 < 21, mathematical remainder positive, slack absorbs double rounding) against the exact integer diagonal 1001026; exact float mu E = 4093.2446343394695, E = 17796.715801475395. The sharp parity-pure class threshold is therefore >= 23/100.",
  corollaryRM:
    "For the fixed three positions with free rates >= r and free nonnegative amplitudes, E > 0 is possible iff F3(r) = P12^2 + P13^2 + P23^2 + 2 P12 P13 P23 > 1 at Pij = g(r tau_ij): Lemma RC + Perron-Frobenius entrywise monotonicity reduce mixed rates to the equal floor (mixing never helps), the zero-trace positive-determinant signature (+, -, -) gives lamMax > 1 iff F3 > 1, and the Perron vector realizes the supremum on the nonnegative cone. Certified: F3(23/100) >= 1.0084962051183664 > 1 and F3(47/200) <= 0.988347723 < 1 (both with the 1e-12 per-exponential float slack), so the family threshold lies in (0.23, 0.235); float root 0.23206852812691425 (measured only).",
  sandwichUpdate:
    "Certified sharp-threshold sandwich for the full parity-pure class: [0.23, 0.4] (lower end this module, upper end THEOREM CC) - was [0.127, 0.4] (THEOREM PX). Float landmarks (measured, NOT certified): chain families saturate at 0.23206853 (5- and 7-block extensions add +2.0e-9); the imp-95134 row-majorant root is 0.389. The surviving open interval is now predominantly aggregation-side: the AM-GM row reduction charges every block the full sorted-gap ladder while a witness realizes only its actual pairs.",
  inClass:
    "Verified with the identical imp-95130 legality machinery: max per-pair kernel-to-cap ratio 1.5280353344413634e-13 <= 1, X_env <= capSum, occupancy 0.19163454137170494 <= 1. The witness moves no floor: phi = 1.4149901045612152e-23 (legality prices the rate exactly as it priced PX).",
  subGaps: [
    "imp-95134-subgap-aggregation-threshold-sharpness - NARROWED, still OPEN: certified sandwich now [0.23, 0.4]; the fixed-position family is certified exhausted at 47/200 and chain variants measure out at 0.2321, so the remaining slack to the 0.4 majorant constant (float root 0.389) is aggregation-side (per-pair AM-GM + full-ladder row charging) or requires a structurally different witness family.",
    "imp-95131-subgap-rate-to-phi-pricing - OPEN, unchanged: this witness reproduces the PX pricing mechanism (phi = 1.41e-23 at rate 23/100), so the rate-to-phi chain still lacks a uniform statement.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: witness-side sandwich progress only; the phi-conditional odd-mass bound is not established",
    "the class threshold is sandwiched, not determined: [0.23, 0.4] certified; 0.2321 (chain saturation) and 0.389 (majorant root) are float landmarks, measured only",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM WE is unconditional: the witness is exhibited (grid extremality and block membership are integer arithmetic), the certificate is three truncated alternating-series lower bounds (N = 19, all arguments < 21, mathematical remainder sign fixed, an explicit 1e-12 float slack absorbing double rounding) against an exact integer diagonal, and the exact kernel evaluation confirms it. COROLLARY RM is unconditional given the carried Lemma RC (imp-95131): the reduction to the equal-rate floor is entrywise Perron-Frobenius monotonicity, the dichotomy is the zero-trace positive-determinant eigen-signature argument, and the bracket endpoints are series-certified with the same explicit slack on both sides (both truncations are ulp-tight at small arguments). The batteries and scans are CROSS-CHECKS; the statements are the certificates. Scope: parity-pure model family only; the family bracket does not determine the class threshold; the sandwich upper end 0.4 is THEOREM CC, not re-proved here; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED on any open leg; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95135_EDGE_WITNESS_THRESHOLD_ASSERTIONS = [
  {
    id: "imp95135-we-grid-extremal",
    description:
      "grid extremality and block membership by integer arithmetic: k1 <= p < 2 k1 (block 0), 4 k2 <= p < 8 k2 (block 2), 16 k3 <= p < 32 k3 (block 4), and the adjacent indices k1 - 1, k2 + 1, k3 + 1 each leave their block; blocks all even (parity-pure)",
    holds: () => {
      const [k1, k2, k3] = K_WE;
      return (
        k1 <= P_WE &&
        P_WE < 2 * k1 &&
        4 * k2 <= P_WE &&
        P_WE < 8 * k2 &&
        16 * k3 <= P_WE &&
        P_WE < 32 * k3 &&
        P_WE / (k1 - 1) >= 2 &&
        P_WE / (k2 + 1) < 4 &&
        P_WE / (k3 + 1) < 16 &&
        BLOCKS_WE.every((b) => b % 2 === 0)
      );
    },
  },
  {
    id: "imp95135-we-series-bounds-sane",
    description:
      "the slack-padded truncated series bounds hold at all six arguments used: expTrunc(z, 19) - 1e-12 <= exp(-z) <= expTrunc(z, 20) + 1e-12 with z < 21 (both truncations are ulp-tight at small z - true truncation error ~1e-27 - so the certificates carry an explicit 1e-12 float slack on BOTH sides)",
    holds: () => {
      for (const mu of [MU_WE, 47 / 200]) {
        for (const tau of [T12, T23, T13]) {
          const z = mu * tau;
          if (expTrunc(z, 19) - 1e-12 > Math.exp(-z)) return false;
          if (Math.exp(-z) > expTrunc(z, 20) + 1e-12) return false;
          if (z >= 21) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95135-we-certified-witness",
    description:
      "THEOREM WE certificate: the series-certified lower bound on mu E at mu = 23/100 with amplitudes (675, 685, 276) equals 4093.2362520907773 > 0; the exact float mu E = 4093.2446343394695 sits above it; E = 17796.715801475395 > 0",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const cert = muEWitness(MU_WE, gLB);
      const exact = muEWitness(MU_WE, g);
      return (
        cert > 0 &&
        rel(cert, CERT_MUE_LOWER_LIT, 1e-9) &&
        exact >= cert &&
        rel(exact, EXACT_MUE_LIT, 1e-9) &&
        rel(eWitness(MU_WE), E_WITNESS_LIT, 1e-9) &&
        eWitness(MU_WE) > 0 &&
        Math.abs(eWitness(MU_WE) - exact / MU_WE) < 1e-6 * Math.abs(exact / MU_WE)
      );
    },
  },
  {
    id: "imp95135-rm-certified-bracket",
    description:
      "COROLLARY RM bracket: series-certified F3(23/100) = 1.0084962051183664 > 1 (float F3 = 1.008496222581168) and slack-padded upper F3(47/200) < 1 (float F3 = 0.9883477092247759; the certified upper sits <= 1e-8 above it, dominated by the N = 20 truncation error ~1.2e-9 per exponential at z = 3.29), so the fixed-position family threshold lies in (0.23, 0.235)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const lb = F3(MU_WE, gLB);
      const ub = F3(47 / 200, gUBs);
      return (
        lb > 1 &&
        rel(lb, F3LB_023_LIT, 1e-9) &&
        rel(F3(MU_WE, g), F3_023_LIT, 1e-9) &&
        ub < 1 &&
        rel(F3(47 / 200, g), F3_0235_LIT, 1e-9) &&
        ub - F3(47 / 200, g) < 1e-8
      );
    },
  },
  {
    id: "imp95135-rm-dichotomy-battery",
    description:
      "the F3-vs-lamMax dichotomy (eigen-signature argument): on 2000 seeded (P12, P13, P23) triples sign(F3 - 1) agrees with sign(lamMax - 1) in every non-degenerate case, and char(1) = 1 - F3 reproduces to 1e-12",
    holds: () => BAT_DICH.signAgree && BAT_DICH.worstCharId < 1e-12,
  },
  {
    id: "imp95135-rm-mixing-battery",
    description:
      "rate mixing never helps (Corollary RM step i): over a 3^3 multiplier grid at three floors, lamMax(G_mixed) <= lamMax(G_floor) with zero violations, and Lemma RC domination sqrt(mi mj) K <= g(min rate x tau) re-verifies with zero violations",
    holds: () => BAT_MIX.viol === 0 && BAT_MIX.rcViol === 0,
  },
  {
    id: "imp95135-we-chain-saturation",
    description:
      "measured chain saturation (float, NOT certified): 3-chain root 0.23206852812691425, 5-chain root 0.23206853015190532 (shift < 1e-8), 7-chain equals the 5-chain root to 1e-12 - extra blocks are exhausted",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const r3 = chainRoot(U_WE);
      const r5 = chainRoot([...U_WE, 64.0001, 256.0001]);
      const r7 = chainRoot([...U_WE, 64.0001, 256.0001, 1024.0001, 4096.0001]);
      return (
        rel(r3, ROOT3_LIT, 1e-9) &&
        rel(r5, ROOT5_LIT, 1e-9) &&
        r5 >= r3 &&
        r5 - r3 < 1e-8 &&
        Math.abs(r7 - r5) < 1e-12
      );
    },
  },
  {
    id: "imp95135-we-in-class-caps",
    description:
      "in-class membership at rate 23/100 under the identical imp-95130 legality machinery: max per-pair kernel-to-cap ratio 1.5280353344413634e-13 <= 1, X_env <= capSum, occupancy 0.19163454137170494 <= 1",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        CAPS.maxPairRatio <= 1 &&
        rel(CAPS.maxPairRatio, MAX_PAIR_RATIO_LIT, 1e-6) &&
        CAPS.xEnv <= CAPS.capSum &&
        CAPS.occ <= 1 &&
        rel(CAPS.occ, OCC_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95135-we-moves-no-floor",
    description:
      "floor honesty: the witness phi = 1.4149901045612152e-23 (legality prices rate 23/100 exactly as it priced the PX rates) - no floor, ceiling, or bound moves",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return CAPS.phi < 1e-20 && rel(CAPS.phi, PHI_LIT, 1e-6);
    },
  },
  {
    id: "imp95135-we-sibling-consistency",
    description:
      "consistency with the siblings: witness rate 23/100 < 2/5 as THEOREM CC requires and E(2/5) = -564892.9489416687 < 0; the PX lower end 0.127 is superseded (0.23 > 0.127); ordering 0.23 < 0.235 < 0.388 < 0.389 < 0.4 holds",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        MU_WE < 2 / 5 &&
        eWitness(2 / 5) < 0 &&
        rel(eWitness(2 / 5), E_AT_CC_RATE_LIT, 1e-9) &&
        MU_WE > PX_LOWER_END &&
        MU_WE < 47 / 200 &&
        47 / 200 < 0.388 &&
        0.388 < S_MAJORANT_ROOT_FLOAT &&
        S_MAJORANT_ROOT_FLOAT < 2 / 5
      );
    },
  },
  {
    id: "imp95135-we-class-battery",
    description:
      "class approach at rates >= 47/200: 6000 seeded parity-pure multi-packet witnesses (2-5 blocks, up to 4 packets per block, edge-piled every third draw, both parities) - max E = -0.026646294899386594 < 0, zero E > 0 draws (cross-check, NOT a class certificate)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_CLASS.maxE < 0 && rel(BAT_CLASS.maxE, BAT_CLASS_MAX_E_LIT, 1e-6) && BAT_CLASS.eViol === 0;
    },
  },
  {
    id: "imp95135-we-honesty-gate",
    description:
      "the verdict is scoped: sandwich narrowed to [0.23, 0.4] not closed, family bracket is family-scoped, chain saturation and majorant root are float landmarks measured only, parent sub-gap stays OPEN; promotes no bound, NO QED on open legs, no refereed bound is changed",
    holds: () =>
      IMP95135_EDGE_WITNESS_THRESHOLD.promotesBound === false &&
      /NO QED/.test(IMP95135_EDGE_WITNESS_THRESHOLD.rigorScope) &&
      /refereed bound is changed/i.test(IMP95135_EDGE_WITNESS_THRESHOLD.rigorScope) &&
      /remains OPEN/.test(IMP95135_EDGE_WITNESS_THRESHOLD.openResiduals[0]) &&
      /measured only/.test(IMP95135_EDGE_WITNESS_THRESHOLD.openResiduals[1]) &&
      IMP95135_EDGE_WITNESS_THRESHOLD.subGaps.length === 2 &&
      /NARROWED, still OPEN/.test(IMP95135_EDGE_WITNESS_THRESHOLD.subGaps[0]) &&
      /OPEN, unchanged/.test(IMP95135_EDGE_WITNESS_THRESHOLD.subGaps[1]) &&
      IMP95135_EDGE_WITNESS_THRESHOLD.openResiduals.length === 3 &&
      /parity-pure model family only/.test(IMP95135_EDGE_WITNESS_THRESHOLD.rigorScope) &&
      /not re-proved here/.test(IMP95135_EDGE_WITNESS_THRESHOLD.rigorScope),
  },
];

for (const a of IMP95135_EDGE_WITNESS_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95135-edge-witness-threshold assertion failed: ${a.id}`);
  }
}

export default IMP95135_EDGE_WITNESS_THRESHOLD;
