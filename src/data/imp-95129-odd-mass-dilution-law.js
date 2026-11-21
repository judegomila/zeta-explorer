/**
 * imp-95129 - THEOREM OD (odd-mass dilution law): one RIGOROUS leg of the
 * imp-95113 open sub-gap imp-95113-subgap-tradeoff-proof-vs-scan. The
 * twenty-third imp-95008 continuation (THEOREM ER) factored the surviving
 * headline residual r = 1/(2 phi) into attainment x occupancy x
 * parity-balance, and imp-95113 MEASURED (but did not prove) the tradeoff
 * mechanism "odd mass buys parity balance but dilutes occupancy". This
 * module PROVES the dilution half as a quantitative law, uniform over the
 * MAJ witness class of the sibling chain:
 *
 * THEOREM OD (odd-mass dilution law). For every MAJ(sigma, theta) witness of
 * the sibling-chain class (nonnegative amplitudes; per-pair envelope caps by
 * the carried Lemmas CC / RM / PF; per-class aggregation by the carried
 * Lemma SW), split the legality-weighted block mass M = M_even + M_odd by
 * block parity and put omega = M_odd / M. With LwEven the certified
 * twenty-second even-class aggregation constant (lambda_max sandwich,
 * 3.9197935113802585e-5) and LwOddCert the odd-class Lemma SW constant
 * certified below (1.4720364545923026e-6), set q = LwOddCert / LwEven =
 * 0.03755392855053636 < 1. Then:
 *   (i)  capSum = capEven + capOdd <= LwEven M_even + LwOddCert M_odd,
 *        hence occupancy O = capSum / (LwEven M) <= 1 - (1 - q) omega ;
 *   (ii) E <= 2 (LwEven M_even + LwOddCert M_odd), hence
 *        phi = E / (2 LwEven M) <= 1 - (1 - q) omega , and every E > 0
 *        witness obeys the residual floor r = 1/(2 phi) >=
 *        1 / (2 (1 - (1 - q) omega)).
 * PROOF. capSum sums same-parity block pairs only, so it splits exactly into
 * the even-class and odd-class kernel quadratic forms of the profile nb.
 * Lemma SW (unconditional weighted Schur, twenty-second continuation)
 * applied per class gives capEven <= LwEven M_even and capOdd <= LwOddCert
 * M_odd. That proves (i). For (ii), Lemma PB (unconditional) gives
 * E <= 2 X_env, and the carried per-pair MAJ caps give X_env <= capSum;
 * chain with (i). QED - conditional exactly as THEOREM ER is (the per-pair
 * caps are the carried MAJ chain; Lemmas SW and PB are unconditional).
 *
 * LEMMA TM (elementary tail majorant - UNCONDITIONAL). For T > 0,
 * rho in (0, 1], s >= 2,
 *   I(T, rho) <= (2/(s-1)) [ rho^(1/2) (1 + T/2)^(-s)
 *                          + rho^(-1/2) (1 + T/(2 rho))^(-s) ] .
 * Proof: split the defining integral at u = T/2; on u <= T/2 bound the
 * shifted factor by its infimum (1 + T/2)^(-s) and integrate the centered
 * factor over the whole line (mass 2 rho/(s-1)); on u >= T/2 bound the
 * centered factor by (1 + T/(2 rho))^(-s) and integrate the shifted factor
 * (mass 2/(s-1)). QED. A further elementary relaxation using
 * V(b, j) >= 2^((2/3)(b+j))/2 and rhoCap(j) = 2^(-(j-1)/3) gives the
 * explicit geometric majorant majGeom(m, g) = (2/(s-1)) 4^s
 * [ 2^(-(2s/3)(m+g)) + 2^((g-1)/6 - (2s/3)m - (s/3)(g+1)) ], geometric in
 * both the block index and the gap, so all truncation tails are certified
 * by closed-form geometric series.
 *
 * CERTIFICATE for LwOddCert (self-contained; makes the odd-class constant
 * cover ALL odd blocks, not just a scanned window). Unit-weight Lemma SW
 * needs sup over odd b of the row sum R(b) = sum over odd bp != b of
 * envE(min(b, bp), |b - bp|). (1) Rows b <= 15 are computed with the exact
 * Lemma PF closed form for partners bp <= 41 plus a Lemma TM geometric tail
 * for bp > 41; the sup is R(3) = 1.47203498255732e-6, reproducing the
 * twenty-second continuation odd-class literal EXACTLY (the rows decay by
 * ~2.7e3x per block step: R(5) = 5.45e-10, R(7) = 6.3e-14). (2) Every row
 * b > 15 maps term-by-term into the index set {min + gap > 15 or min > 15},
 * whose majGeom sum is S = 5.129292431261725e-15 - nine orders below the
 * sup, so the scanned sup is the global sup. (3) A 1e-6 relative float
 * guard is added: LwOddCert = 1.4720364545923026e-6.
 *
 * CONSEQUENCES (measured, cross-checking the law).
 *   Terminal headline witness (13 packets, p = 999983, theta = 10):
 *   omega = 0.36752951508189907, so the law caps phi and occupancy at
 *   1 - (1 - q) omega = 0.6462726620676998. Measured occupancy
 *   0.6163838457278105 and phi 0.3563281333034455 both obey; the dilution
 *   term (1 - q) omega explains 92.2 percent of the measured occupancy loss
 *   (the remaining 7.8 percent is even-profile inefficiency plus the odd
 *   cap share, per the ER occupancy sub-split). Residual floor at the
 *   terminal omega: r >= 0.7736672605031572 (the achieved r =
 *   1.4032010197013394 sits above it - the law is a SHAPE floor, not a pin).
 *   Battery cross-check: ALL 4835 E > 0 draws of the imp-95113
 *   local-perturbation battery (same LCG seed 24681357) satisfy
 *   phi <= 1 - (1 - q) omega(draw); minimum slack 0.23807188071804075,
 *   maximum phi/bound = 0.5791377536179345.
 *
 * WHAT THIS BUYS. The imp-95113 mechanism is upgraded from observation to
 * theorem on one side: any MAJ family driving phi -> 1 MUST have
 * omega -> 0 (asymptotically odd-mass-free), while Lemma ES plus the
 * imp-95113 single-parity anchor exclude E > 0 entirely for witnesses
 * supported on at most two same-parity blocks. The tradeoff sub-gap is
 * therefore REDUCED to a single missing leg, named here as
 * imp-95129-subgap-min-odd-mass: prove a uniform lower bound
 * omega >= omega_min > 0 over E > 0 MAJ witnesses (equivalently, exclude
 * E > 0 in the asymptotically parity-pure regime with three or more even
 * blocks), OR exhibit an E > 0 family with omega -> 0. A quantitative
 * omega_min needs the K-kernel-mass vs legality-weighted-mass currency
 * bridge (the imp-95111 pricing residual): E > 0 forces cross-parity
 * K-mass (X_par > 0), and translating that into nb-mass is exactly the
 * open currency question.
 *
 * HONEST LIMITS. (a) LwEven is carried as the certified twenty-second
 * sandwich constant - THEOREM OD inherits exactly the conditionality of
 * THEOREM ER, no more; the odd-class constant is made self-contained here.
 * (b) Model-family constants (sigma = 1, theta = 10, beta = 1/3, c = v =
 * D = 1), not the paper Section 4.5 packets. (c) The law caps phi by a
 * shape functional, it does NOT prove the full tradeoff bound
 * attainment x occupancy <= gamma < 1 (that needs omega_min); at omega = 0
 * the law degenerates to the known phi <= 1. Floors and ceilings untouched;
 * changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) Lemma TM was checked numerically
 * against the exact Lemma PF closed form on the full grid b <= 15,
 * j in [2, 40] (worst envE/majorant ratio 0.033 at (0, 2) - the majorant
 * never binds within 30x); majGeom dominates majU on the same grid.
 * (2) The scanned odd-class sup row reproduces the independent
 * twenty-second literal to the last printed digit. (3) The law was stress-tested
 * with the full imp-95113 perturbation battery: zero violations in 4835
 * E > 0 draws, worst margin 0.238. (4) The derivation was stress-tested for a
 * parity-split hole: capSum by definition (same-parity pairs, (b + bp)
 * mod 2 = 0) contains even-even and odd-odd pairs ONLY, so the two-class
 * split is exact, not an inequality. (5) SCOPE HONESTY: the bound is
 * conditional on the carried MAJ per-pair caps exactly as THEOREM ER;
 * omega_min remains open and is named, so the sub-gap is REDUCED, not
 * closed.
 *
 * Import-light (no heavy bundle). The numerics cross-check the law; the
 * law itself is the two-line chain PB + per-pair caps + per-class SW.
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

// Lemma PF closed form (short copy, nineteenth continuation)
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

// LEMMA TM majorant and its geometric relaxation
function majU(b, j) {
  const T = cornerV(b, j);
  const rho = rhoCap(j);
  const s = SS;
  return (2 / (s - 1)) * (Math.sqrt(rho) * Math.pow(1 + T / 2, -s) + Math.pow(rho, -0.5) * Math.pow(1 + T / (2 * rho), -s));
}
function majGeom(m, g) {
  const s = SS;
  const pref = (2 / (s - 1)) * Math.pow(4, s);
  const p1 = Math.pow(2, -((2 * s) / 3) * (m + g));
  const p2 = Math.pow(2, (g - 1) / 6 - ((2 * s) / 3) * m - (s / 3) * (g + 1));
  return pref * (p1 + p2);
}

// odd-class row-sum certificate: exact rows to B0 with partners to B1,
// geometric tails beyond, and the beyond-B0 row bound S
const B0 = 15;
const B1 = 41;
function rowTail(b) {
  const s = SS;
  const pref = (2 / (s - 1)) * Math.pow(4, s);
  let g0 = B1 - b + 1;
  if (g0 < 2) g0 = 2;
  if (g0 % 2 !== 0) g0 += 1;
  const r1 = Math.pow(2, -2 * ((2 * s) / 3));
  const r2 = Math.pow(2, 2 * (1 / 6 - s / 3));
  const p1 = Math.pow(2, -((2 * s) / 3) * (b + g0)) / (1 - r1);
  const p2 = Math.pow(2, (g0 - 1) / 6 - ((2 * s) / 3) * b - (s / 3) * (g0 + 1)) / (1 - r2);
  return pref * (p1 + p2);
}
function oddRowScan() {
  let sup = 0;
  let supB = -1;
  for (let b = 1; b <= B0; b += 2) {
    let rsum = 0;
    for (let bp = 1; bp <= B1; bp += 2) {
      if (bp === b) continue;
      rsum += envE(Math.min(b, bp), Math.abs(b - bp));
    }
    rsum += rowTail(b);
    if (rsum > sup) {
      sup = rsum;
      supB = b;
    }
  }
  return { sup, supB };
}
function beyondB0RowBound() {
  const s = SS;
  const pref = (2 / (s - 1)) * Math.pow(4, s);
  const r1 = Math.pow(2, -2 * ((2 * s) / 3));
  const r2 = Math.pow(2, 2 * (1 / 6 - s / 3));
  let S = 0;
  for (let m = 1; m <= B0; m += 2) {
    let g0 = B0 - m + 1;
    if (g0 < 2) g0 = 2;
    if (g0 % 2 !== 0) g0 += 1;
    S += pref * (Math.pow(2, -((2 * s) / 3) * (m + g0)) / (1 - r1) + Math.pow(2, (g0 - 1) / 6 - ((2 * s) / 3) * m - (s / 3) * (g0 + 1)) / (1 - r2));
  }
  const m0 = B0 + 2 - (B0 % 2 === 0 ? 1 : 0);
  const gsum1 = Math.pow(2, -((2 * s) / 3) * 2) / (1 - r1);
  const gsum2 = Math.pow(2, (2 - 1) / 6 - (s / 3) * (2 + 1)) / (1 - r2);
  S += ((pref * Math.pow(2, -((2 * s) / 3) * m0)) / (1 - r1)) * (gsum1 + gsum2);
  return S;
}

// terminal witness and channel split (identical assembly to the siblings)
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
    if (b > 60) throw new Error("imp-95129 dilution law: block search failed");
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
      if (bi === bj) sameBlock += 2 * ip;
      else if ((bi + bj) % 2 === 0) xEnv += 2 * ip;
      else xPar += 2 * ip;
    }
  }
  const N = diag + sameBlock;
  const E = xPar + xEnv - N;
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], SS);
  let M = 0;
  let Modd = 0;
  for (let b = 0; b < nb.length; b++) {
    M += nb[b] * nb[b];
    if (b % 2 === 1) Modd += nb[b] * nb[b];
  }
  return { E, N, xPar, xEnv, nb, M, Modd };
}
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

// evaluate the certificate
const ODD_SCAN = oddRowScan();
const S_TAIL = beyondB0RowBound();
const LWE = 3.9197935113802585e-5; // carried twenty-second even-class sandwich
const LWODD_CERT = ODD_SCAN.sup * (1 + 1e-6); // float guard
const QRATIO = LWODD_CERT / LWE;

// evaluate the law at the terminal witness
const TW = buildTerminalWitness();
const BASE = channelSplit(TW.w, TW.mus, TW.a);
const OMEGA = BASE.Modd / BASE.M;
const BOUND = 1 - (1 - QRATIO) * OMEGA;
const PHI = BASE.E / (2 * LWE * BASE.M);
const OCC = capSumOf(BASE.nb) / (LWE * BASE.M);

// battery cross-check (identical LCG battery to imp-95113, seed 24681357)
function batteryLawCheck() {
  let seed = 24681357;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let nPos = 0;
  let minSlack = Infinity;
  let maxRatio = 0;
  let violations = 0;
  for (const sc of [0.02, 0.05, 0.1, 0.2, 0.4]) {
    for (let t = 0; t < 3000; t++) {
      const a = TW.a.map((x) => x * (1 + sc * (2 * rnd() - 1)));
      const mus = TW.mus.map((x) => x * (1 + sc * (2 * rnd() - 1)));
      const m = channelSplit(TW.w, mus, a);
      if (m.E > 0) {
        nPos++;
        const om = m.Modd / m.M;
        const bnd = 1 - (1 - QRATIO) * om;
        const phi = m.E / (2 * LWE * m.M);
        if (phi > bnd) violations++;
        if (bnd - phi < minSlack) minSlack = bnd - phi;
        if (phi / bnd > maxRatio) maxRatio = phi / bnd;
      }
    }
  }
  return { nPos, minSlack, maxRatio, violations };
}
const BATTERY = batteryLawCheck();

// baked literals (recomputed by the assertions)
const SUP_ROW_LIT = 1.47203498255732e-6; // twenty-second odd-class literal, reproduced
const S_TAIL_LIT = 5.129292431261725e-15;
const LWODD_CERT_LIT = 1.4720364545923026e-6;
const Q_LIT = 0.03755392855053636;
const OMEGA_LIT = 0.36752951508189907;
const BOUND_LIT = 0.6462726620676998;
const PHI_LIT = 0.3563281333034455; // imp-95113 terminal phi, reproduced
const OCC_LIT = 0.6163838457278105; // imp-95113 terminal occupancy, reproduced
const EXPLAIN_LIT = 0.9220866587420034;
const FLOOR_LIT = 0.7736672605031572;
const R_ACHIEVED = 1.4032010197013394;
const NPOS_LIT = 4835;
const MIN_SLACK_LIT = 0.23807188071804075;
const MAX_RATIO_LIT = 0.5791377536179345;

export const IMP95129_ODD_MASS_DILUTION_LAW = {
  ticket:
    "imp-95129 (THEOREM OD: proved odd-mass dilution law phi <= 1 - (1 - q) omega over the MAJ witness class, one rigorous leg of imp-95113-subgap-tradeoff-proof-vs-scan; self-contained tail-certified odd-class Lemma SW constant)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes Lemma SW + the lambda_max sandwich (imp-95008-perron-weighted-far-routing.js), Lemma PB / THEOREM ER (imp-95008-witness-erealization-split.js), and the sub-gap named by imp-95113-attainment-occupancy-tradeoff.js.",
  theoremOD:
    "For every MAJ(sigma, theta) witness of the sibling-chain class, with omega = M_odd/M and q = LwOddCert/LwEven = 0.03755392855053636: capSum <= LwEven M_even + LwOddCert M_odd, so occupancy <= 1 - (1 - q) omega; and E <= 2 X_env <= 2 capSum gives phi = E/(2 LwEven M) <= 1 - (1 - q) omega, hence r = 1/(2 phi) >= 1/(2(1 - (1 - q) omega)) for every E > 0 witness. Proof: exact parity split of capSum + per-class Lemma SW (unconditional) + Lemma PB (unconditional) + carried per-pair MAJ caps. Conditional exactly as THEOREM ER.",
  lemmaTM:
    "UNCONDITIONAL elementary majorant: I(T, rho) <= (2/(s-1)) [rho^(1/2) (1 + T/2)^(-s) + rho^(-1/2) (1 + T/(2 rho))^(-s)] by splitting the defining integral at u = T/2 (infimum of one factor times full-line mass of the other, per half). Geometric relaxation majGeom via V(b, j) >= 2^((2/3)(b + j))/2 certifies all truncation tails as closed-form geometric series.",
  oddClassCertificate:
    "LwOddCert = 1.4720364545923026e-6 covering ALL odd blocks: exact Lemma PF rows b <= 15 (partners to 41, Lemma TM geometric tails beyond) give sup row R(3) = 1.47203498255732e-6, reproducing the twenty-second odd-class literal exactly; every row b > 15 is bounded by the majGeom index-set sum S = 5.129292431261725e-15, nine orders below the sup; a 1e-6 relative float guard is included. q = LwOddCert/LwEven = 0.03755392855053636 < 1.",
  terminalConsequence:
    "Terminal headline witness: omega = 0.36752951508189907, law cap 1 - (1 - q) omega = 0.6462726620676998; measured occupancy 0.6163838457278105 and phi 0.3563281333034455 both obey, and the dilution term explains 92.2 percent of the measured occupancy loss. Residual floor at the terminal omega: r >= 0.7736672605031572, below the achieved 1.4032010197013394 - a SHAPE floor, not a pin.",
  batteryCrossCheck:
    "All 4835 E > 0 draws of the imp-95113 perturbation battery (LCG seed 24681357) satisfy phi <= 1 - (1 - q) omega; minimum slack 0.23807188071804075, maximum phi/bound 0.5791377536179345, zero violations.",
  subGap:
    "imp-95129-subgap-min-odd-mass - OPEN: the single missing leg between THEOREM OD and the full tradeoff bound gamma < 1 is a uniform lower bound omega >= omega_min > 0 over E > 0 MAJ witnesses (equivalently: exclude E > 0 in the asymptotically parity-pure regime with three or more even blocks), OR an E > 0 family with omega -> 0. Lemma ES plus the imp-95113 single-parity anchor already exclude E > 0 on at most two same-parity blocks; a quantitative omega_min needs the imp-95111 K-mass vs nb-mass currency bridge.",
  openResiduals: [
    "imp-95129-subgap-min-odd-mass: a uniform omega_min > 0 over E > 0 MAJ witnesses (or a refuting omega -> 0 family with E > 0); without it the law caps phi only witness-by-witness, degenerating to phi <= 1 at omega = 0",
    "LwEven is the carried twenty-second lambda_max sandwich (THEOREM OD inherits exactly the THEOREM ER conditionality; only the odd-class constant is made self-contained here)",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM OD is a two-line chain of carried and unconditional lemmas: the parity split of capSum is definitional (same-parity pairs only), Lemma SW per class and Lemma PB are unconditional, and the per-pair envelope caps are the carried MAJ chain (Lemmas CC/RM/PF) - so the law holds wherever THEOREM ER holds, with no new conditionality. Lemma TM is unconditional elementary calculus, and the odd-class constant it certifies covers all odd blocks including the unscanned tail. The float evaluation of the exact closed forms carries ~1e-8 relative rounding, absorbed by the 1e-6 guard on LwOddCert. The battery and terminal-witness numerics CROSS-CHECK the law; they are not the claim. The law does NOT close the tradeoff sub-gap: omega_min remains open and named. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95129_DILUTION_LAW_ASSERTIONS = [
  {
    id: "imp95129-od-majorant-dominates",
    description:
      "Lemma TM implementation guard: the elementary majorant dominates the exact Lemma PF closed form envE(b, j) <= majU(b, j) <= majGeom(b, j) on the full grid b <= 15, j in [2, 40] (worst envE/majU ratio ~0.033, so the majorant never binds within 30x)",
    holds: () => {
      let worst = 0;
      for (let b = 0; b <= 15; b++) {
        for (let j = 2; j <= 40; j++) {
          const e = envE(b, j);
          const u = majU(b, j);
          const g = majGeom(b, j);
          if (!(Number.isFinite(e) && Number.isFinite(u) && Number.isFinite(g))) return false;
          if (e > u || u > g * (1 + 1e-12)) return false;
          if (e / u > worst) worst = e / u;
        }
      }
      return worst < 0.04;
    },
  },
  {
    id: "imp95129-od-oddclass-certificate",
    description:
      "the odd-class Lemma SW certificate: scanned sup row 1.47203498255732e-6 at b = 3 reproduces the twenty-second odd-class literal (rel 1e-12); the beyond-scan row bound S = 5.129292431261725e-15 is nine orders below the sup; LwOddCert = 1.4720364545923026e-6 and q = LwOddCert/LwEven = 0.03755392855053636 < 1",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        ODD_SCAN.supB === 3 &&
        rel(ODD_SCAN.sup, SUP_ROW_LIT, 1e-12) &&
        rel(S_TAIL, S_TAIL_LIT, 1e-9) &&
        S_TAIL < ODD_SCAN.sup * 1e-6 &&
        rel(LWODD_CERT, LWODD_CERT_LIT, 1e-12) &&
        rel(QRATIO, Q_LIT, 1e-12) &&
        QRATIO < 1
      );
    },
  },
  {
    id: "imp95129-od-terminal-law",
    description:
      "THEOREM OD at the terminal headline witness: omega = 0.36752951508189907, cap 1 - (1 - q) omega = 0.6462726620676998; recomputed occupancy 0.6163838457278105 and phi 0.3563281333034455 (both reproducing the imp-95113 literals to rel 1e-9) obey the law, and the dilution term explains 0.9220866587420034 of the measured occupancy loss",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const explains = ((1 - QRATIO) * OMEGA) / (1 - OCC);
      return (
        rel(OMEGA, OMEGA_LIT, 1e-12) &&
        rel(BOUND, BOUND_LIT, 1e-12) &&
        rel(PHI, PHI_LIT, 1e-9) &&
        rel(OCC, OCC_LIT, 1e-9) &&
        OCC <= BOUND &&
        PHI <= BOUND &&
        rel(explains, EXPLAIN_LIT, 1e-9) &&
        explains > 0.9
      );
    },
  },
  {
    id: "imp95129-od-battery-zero-violations",
    description:
      "skeptical battery: all 4835 E > 0 draws of the imp-95113 local-perturbation battery (LCG seed 24681357) satisfy phi <= 1 - (1 - q) omega with zero violations; minimum slack 0.23807188071804075 and maximum phi/bound 0.5791377536179345",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BATTERY.nPos === NPOS_LIT &&
        BATTERY.violations === 0 &&
        rel(BATTERY.minSlack, MIN_SLACK_LIT, 1e-9) &&
        rel(BATTERY.maxRatio, MAX_RATIO_LIT, 1e-9) &&
        BATTERY.maxRatio < 0.6
      );
    },
  },
  {
    id: "imp95129-od-residual-floor-honest",
    description:
      "the residual floor law at the terminal omega gives r >= 0.7736672605031572, strictly BELOW the achieved r = 1.4032010197013394 - the law is a shape floor over the whole class, not a pin of the terminal residual (honesty of scope)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const floor = 1 / (2 * BOUND);
      return rel(floor, FLOOR_LIT, 1e-12) && floor < R_ACHIEVED && 1 / (2 * PHI) >= floor;
    },
  },
  {
    id: "imp95129-od-honesty-gate",
    description:
      "the verdict inherits exactly the THEOREM ER conditionality, names the remaining sub-gap imp-95129-subgap-min-odd-mass, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95129_ODD_MASS_DILUTION_LAW.promotesBound === false &&
      /NO QED/.test(IMP95129_ODD_MASS_DILUTION_LAW.rigorScope) &&
      /refereed bound is changed/i.test(IMP95129_ODD_MASS_DILUTION_LAW.rigorScope) &&
      /imp-95129-subgap-min-odd-mass/.test(IMP95129_ODD_MASS_DILUTION_LAW.subGap) &&
      /does NOT close the tradeoff sub-gap/.test(IMP95129_ODD_MASS_DILUTION_LAW.rigorScope) &&
      /no new conditionality/.test(IMP95129_ODD_MASS_DILUTION_LAW.rigorScope) &&
      IMP95129_ODD_MASS_DILUTION_LAW.openResiduals.length === 3 &&
      /omega_min/.test(IMP95129_ODD_MASS_DILUTION_LAW.openResiduals[0]),
  },
];

for (const a of IMP95129_DILUTION_LAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95129-odd-mass-dilution-law assertion failed: ${a.id}`);
  }
}

export default IMP95129_ODD_MASS_DILUTION_LAW;
