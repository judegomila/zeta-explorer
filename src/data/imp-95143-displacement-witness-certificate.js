/**
 * imp-95143 - THEOREM DW (displacement-credit witness certificate,
 * certified class lower end 2320723/10000000 = 0.2320723): the FIRST
 * MULTI-PACKET witness of the parity-pure chain. An explicit in-class
 * witness with TWO packets in the middle block (one at each facing edge)
 * has certified E > 0 at common rate 0.2320723 - a rate that sits
 * 2.64e-7 ABOVE the one-packet-per-block position-polytope limit
 * 0.23207203643507168 (carried measured landmark, imp-95141/95142).
 * Certified sharp-threshold sandwich
 * [11603/50000, 12251/50000] -> [2320723/10000000, 12251/50000]
 * = [0.2320723, 0.24502]. Supersedes THEOREM WS (11603/50000 = 0.23206)
 * as the CLASS lower end; WS remains the certified lower end of the
 * one-packet-per-block SUBCLASS bracket [11603/50000, 2901/12500).
 *
 * STRUCTURAL CONSEQUENCE (why this is more than a 1.2e-5 floor move):
 * the imp-95140-subgap-displacement-credit leg named the surviving
 * ceiling interval as an intra-block aggregation price, and THEOREM FP
 * (imp-95142) certified the interval [0.23208, 0.24502] as
 * MULTI-PACKET-ONLY. The natural closing route from below - prove that
 * multi-packet aggregation NEVER helps, so the class threshold equals
 * the one-per-block threshold - is hereby REFUTED at the certified-floor
 * level: the certified class floor 0.2320723 exceeds the measured
 * one-per-block family limit 0.2320720364 (edge limit over ALL positions
 * and blocks, carried unchanged since imp-95141). The displacement
 * credit is WITNESS-REALIZED: a packet displaced to the far edge of the
 * middle block collects the (block2 -> block4) bond at facing gap 8
 * while the resident packet keeps the (block0 -> block2) bond at gap 2,
 * and the intra-block penalty (same-block pairs enter E NEGATIVELY in
 * packet coordinates - Lemma L2) does not fully cancel the gain.
 *
 * THEOREM DW. In the sibling-chain parity-pure class (nonnegative
 * amplitudes, free positive rates, positions u_i in [2^{b_i}, 2^{b_i+1})
 * - the free-position conventions of THEOREM SA/HS/FP), take the
 * 4-packet witness
 *   u = (2 - 2^{-30}, 4, 8 - 2^{-30}, 16), blocks (0, 2, 2, 4),
 *   amplitudes a = (67604, 68478, 142, 27213), common rate
 *   mu = 2320723/10000000.
 * All blocks even (parity-pure); block 2 carries TWO packets, one at
 * each facing edge. Then E > 0. PROOF (certificate). In packet
 * coordinates at a common rate (Lemma L2, verified below against the
 * imp-95136 cluster ground-truth form),
 *   mu E = -sum a_i^2 + 2 [ a1 a2 g(mu t12) + a1 a3 g(mu t13)
 *          + a1 a4 g(mu t14) + a2 a4 g(mu t24) + a3 a4 g(mu t34) ]
 *          - 2 a2 a3 g(mu t23),
 * with g(z) = exp(-z)(1 + z) and the six separations EXACT dyadic
 * doubles: t12 = 2 + 2^{-30}, t13 = 6, t14 = 14 + 2^{-30},
 * t23 = 4 - 2^{-30}, t24 = 12, t34 = 8 + 2^{-30} (every position and
 * separation is an exact IEEE double - no position rounding exists).
 * Every ADDED g value is lower-bounded by the N = 19 odd-truncation
 * alternating series minus a 1e-12 slack, and the single SUBTRACTED
 * g value (the intra-block pair) is upper-bounded by the N = 20
 * even-truncation series plus a 1e-12 slack (sibling convention, valid
 * for 0 <= z < N + 2; all six arguments are <= 3.24902 < 21). Against
 * the exact integer diagonal 10000104833 this certifies
 *   mu E >= 1622.259060813 > 0
 * (explicit float budget: <= 64 ULP-scaled operations on terms
 * <= 1e10, total < 1e-4, absorbed a fortiori by the 1622 margin).
 * Exact float evaluation gives mu E = 1721.8580820783973 by two
 * independent routes (the displayed packet form and the Lemma L2
 * cluster form via the exact kernel), agreeing to 2.1e-9 relative.
 * Hence the sharp parity-pure class threshold is >= 0.2320723. QED.
 *
 * SIGN-CONVENTION AUDIT (the one place a multi-packet witness could
 * lie). Same-block pairs enter E NEGATIVELY: E = -sum_b norm(F_b)^2
 * + 2 sum_{b<bp} <F_b, F_bp> (the imp-95136 battery ground-truth form),
 * which in packet coordinates is E = -sum_i a_i^2/mu_i
 * - 2 sum_{same-block i<j} a_i a_j K_ij + 2 sum_{cross-block} a_i a_j
 * K_ij. The identity is algebraic (expand norm(F_b)^2); it is verified
 * below on seeded multi-packet draws to 1e-9 relative, and the witness
 * E is computed by BOTH routes. A sign slip on the intra pair would
 * flip the -2 a2 a3 g term by ~7.5e6 and be caught by the cross-route
 * agreement assertion.
 *
 * MEASURED COLOR (float, not certified). Family root at the witness
 * geometry (delta = 2^{-30}): 0.232072387778615; edge limit
 * (delta -> 0): 0.23207238781359468. One-per-block edge limit
 * (recomputed in-module): 0.2320720364350718 - the displacement credit
 * at the position-polytope level is +3.514e-7. The displaced packet
 * carries amplitude fraction 0.00142 (0.14% of the Perron vector) -
 * the credit is a second-order effect made first-order by the torn
 * middle block: one packet cannot hug both facing edges (the exact
 * mechanism THEOREM FP's u_1 cell cover certifies for the one-per-block
 * subclass), but two packets can, paying the intra-block penalty
 * g(4 mu) = 0.7657. Geometry optimality (measured): u2 pins to the left
 * edge 4, u3 pins to the right edge 8^-, in-class (nonnegative-
 * amplitude) rate optimization pins ALL rates to the common floor,
 * extra packets and extra blocks move the root < 2.1e-9. Quantization
 * efficiency of the integer amplitudes: 0.9999090587995272.
 *
 * CORRECTION OF CARRIED MEASURED COLOR (honest errata, certified
 * content untouched): imp-95141 recorded "multi-packet and extra-block
 * variants measured to move < 2.1e-9". That measurement was LOCAL to
 * the WS grid geometry (perturbative re-optimization around the
 * one-per-block witness); the both-edges middle-block split lives in a
 * different basin and moves the family root +3.5e-7 - two orders more.
 * Every CERTIFIED statement of imp-95141 (THEOREM WS, COROLLARY FR) is
 * unaffected; the "entirely ceiling-side" slack diagnosis survives in
 * corrected form with the witness saturation moved to 0.2320724.
 *
 * OUT-OF-CLASS TRAP (in-run refutation preserved so successors do not
 * respend it). An UNRESTRICTED eigenvalue search over per-packet rates
 * at the witness geometry reports lamMax = 1.0056 at rates
 * (mu, mu, 0.57572, mu) - far above the common-rate value. That vector
 * has a NEGATIVE component on a same-block packet: a sign flip converts
 * the intra-block penalty into a gain and is OUT OF CLASS (amplitudes
 * are nonnegative). The sign-constrained (projected) supremum at the
 * same rate tuple is 0.9999994842894873 < 1 - the projection zeroes the
 * decorrelated packet and falls back to the best one-per-block
 * sub-witness (same value, asserted). Rate-splitting does NOT help
 * in-class; unrestricted spectral scans of the SIGNED multi-packet
 * matrix are not witnesses.
 *
 * WHAT THIS NARROWS AND WHAT IT DOES NOT.
 * (1) Witness-side step: the ceiling (THEOREM HS, 12251/50000) is
 *     carried unchanged; imp-95140-subgap-displacement-credit stays
 *     OPEN but is REORIENTED - its resolution must PRICE the intra-
 *     block aggregation, not exclude it (exclusion is refuted here);
 *     the certified sandwich narrows only at the floor.
 * (2) NO certified threshold separation between the class and the
 *     one-per-block subclass: the subclass bracket [11603/50000,
 *     2901/12500) (THEOREM WS + FP) OVERLAPS the new class floor. A
 *     certified separation needs a one-per-block ceiling certificate at
 *     0.2320723, and the FP architecture cannot reach it: its
 *     coupled-corner cap-matrix root is 0.23207302409715935 (carried
 *     ROOT5 literal, ABOVE the required constant), so per-entry
 *     position sups with a single torn variable are structurally too
 *     lossy - a joint frame coupling the (0,2) and (1,2) entries
 *     through their shared positions would be required. Recorded as
 *     the named residual imp-95143-subgap-certified-separation.
 * (3) The separation claim as stated ("floor above the one-per-block
 *     limit") is certified-vs-MEASURED: 0.2320723 is certified, the
 *     one-per-block limit 0.2320720364 is a float landmark (though
 *     reproduced to 13 digits by two independent modules).
 * (4) Parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 *
 * HONEST LIMITS. (a) Model-family constants, not the paper Section 4.5
 * packets. (b) 0.2320723 is a certified floor, not the class threshold
 * (measured saturation 0.2320724; certified ceiling 0.24502). (c) The
 * geometry-optimality and rate-pinning statements are measured
 * batteries, not lemmas. (d) Pushing mu toward the family root
 * 0.23207238778 was considered and STOPPED at 0.2320723: the next digit
 * (0.23207235) leaves margin ~935 against a ~100 truncation-slack floor
 * (9.4x safety, down from 16x) for +5e-8 of bracket width - recorded so
 * successors do not respend it; the honest lever is the family root
 * itself, not the last 8.8e-8. (e) Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 *
 * Import-light (no heavy bundle, no imports). The batteries are
 * cross-checks; the theorem is the displayed certificate.
 */

// exact sibling Gram kernel (identical to imp-95130..95142)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

const gFun = (z) => Math.exp(-z) * (1 + z);
const rhoPair = (mi, mj, tau) => Math.sqrt(mi * mj) * kernelK(mi, mj, tau);

// truncated alternating exponential series (sibling convention):
// even N => upper bound of exp(-z), odd N => lower bound, for 0 <= z < N + 2
function expTrunc(z, N) {
  let s = 1;
  let t = 1;
  for (let n = 1; n <= N; n++) {
    t = (t * -z) / n;
    s += t;
  }
  return s;
}
const gLo = (z) => (expTrunc(z, 19) - 1e-12) * (1 + z); // <= g(z)
const gHi = (z) => (expTrunc(z, 20) + 1e-12) * (1 + z); // >= g(z)

// ---- the witness (every number below is exact in IEEE double) ----
const DELTA = Math.pow(2, -30);
const U_DW = [2 - DELTA, 4, 8 - DELTA, 16];
const BLK_DW = [0, 2, 2, 4]; // dyadic block indices (all even - parity-pure)
const A_DW = [67604, 68478, 142, 27213];
const MU_DW = 2320723 / 10000000; // certified class lower end 0.2320723
// separations (exact dyadic doubles)
const T12 = U_DW[1] - U_DW[0]; // 2 + 2^-30
const T13 = U_DW[2] - U_DW[0]; // 6 exactly
const T14 = U_DW[3] - U_DW[0]; // 14 + 2^-30
const T23 = U_DW[2] - U_DW[1]; // 4 - 2^-30
const T24 = U_DW[3] - U_DW[1]; // 12 exactly
const T34 = U_DW[3] - U_DW[2]; // 8 + 2^-30

// mu E in packet coordinates at a common rate; gAdd prices the five added
// cross-block terms, gSub prices the single subtracted intra-block term
function muEForm(mu, a, gAdd, gSub) {
  return (
    -(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]) +
    2 *
      (a[0] * a[1] * gAdd(mu * T12) +
        a[0] * a[2] * gAdd(mu * T13) +
        a[0] * a[3] * gAdd(mu * T14) +
        a[1] * a[3] * gAdd(mu * T24) +
        a[2] * a[3] * gAdd(mu * T34)) -
    2 * a[1] * a[2] * gSub(mu * T23)
  );
}
const MUE_CERT = muEForm(MU_DW, A_DW, gLo, gHi); // certified lower bound
const MUE_FLOAT = muEForm(MU_DW, A_DW, gFun, gFun); // exact float route 1

// independent route 2: Lemma L2 cluster form via the exact kernel
function eClusterForm(mu, a) {
  let tot = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      tot += a[i] * a[j] * (i === j ? 1 / mu : kernelK(mu, mu, Math.abs(U_DW[i] - U_DW[j])));
    }
  }
  let nb = (a[0] * a[0]) / mu + (a[3] * a[3]) / mu;
  nb += (a[1] * a[1]) / mu + (a[2] * a[2]) / mu + 2 * a[1] * a[2] * kernelK(mu, mu, T23);
  return tot - 2 * nb;
}
const MUE_L2 = MU_DW * eClusterForm(MU_DW, A_DW);

// ---- measured color: family roots via exact 4x4 Jacobi eigenvalues ----
function jacobiMax(Min) {
  const n = Min.length;
  const A = Min.map((r) => r.slice());
  const V = Array.from({ length: n }, (_, i) => {
    const r = new Array(n).fill(0);
    r[i] = 1;
    return r;
  });
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-32) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-19) continue;
        const th = (0.5 * (A[q][q] - A[p][p])) / A[p][q];
        const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  let bi = 0;
  for (let i = 1; i < n; i++) if (A[i][i] > A[bi][bi]) bi = i;
  return { lam: A[bi][bi], vec: V.map((r) => r[bi]) };
}

// signed packet-level matrix (same-block bond NEGATIVE) at common rate
function signedMatrix(mu, taus) {
  const gg = (t) => gFun(mu * t);
  return [
    [0, gg(taus[0]), gg(taus[1]), gg(taus[2])],
    [gg(taus[0]), 0, -gg(taus[3]), gg(taus[4])],
    [gg(taus[1]), -gg(taus[3]), 0, gg(taus[5])],
    [gg(taus[2]), gg(taus[4]), gg(taus[5]), 0],
  ];
}
const TAUS_DW = [T12, T13, T14, T23, T24, T34];
const TAUS_EDGE = [2, 6, 14, 4, 12, 8];

function bisectRoot(fLam) {
  let lo = 0.2320715;
  let hi = 0.2320735;
  for (let i = 0; i < 50; i++) {
    const m = (lo + hi) / 2;
    if (fLam(m) > 1) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const ROOT_DW = bisectRoot((mu) => jacobiMax(signedMatrix(mu, TAUS_DW)).lam);
const ROOT_DW_EDGE = bisectRoot((mu) => jacobiMax(signedMatrix(mu, TAUS_EDGE)).lam);
const ROOT_1PB_EDGE = bisectRoot((mu) => {
  const S = [
    [0, gFun(mu * 2), gFun(mu * 14)],
    [gFun(mu * 2), 0, gFun(mu * 12)],
    [gFun(mu * 14), gFun(mu * 12), 0],
  ];
  return jacobiMax(S).lam;
});
const LAM_DW = jacobiMax(signedMatrix(MU_DW, TAUS_DW));

// sign-constrained (in-class) supremum of c^T S c over nonnegative unit c
function supNonneg(S, iters, starts) {
  const n = S.length;
  let best = -Infinity;
  for (let t = 0; t < starts; t++) {
    let c = new Array(n).fill(0).map((_, i) => ((i * 2654435761 + t * 7919 + 13) % 997) / 997 + 0.02);
    let nrm = Math.hypot(...c);
    c = c.map((x) => x / nrm);
    for (let it = 0; it < iters; it++) {
      let w = c.map((_, i) => S[i].reduce((s, x, j) => s + x * c[j], 0) + 2 * c[i]);
      w = w.map((x) => Math.max(0, x));
      const nn = Math.hypot(...w);
      if (nn === 0) break;
      c = w.map((x) => x / nn);
    }
    const val = c.reduce((s, ci, i) => s + ci * S[i].reduce((u, x, j) => u + x * c[j], 0), 0);
    if (val > best) best = val;
  }
  return best;
}

// out-of-class trap: unrestricted eigen at rate-split vs projected sup
function trapMatrices() {
  const rs = [MU_DW, MU_DW, 0.57572, MU_DW];
  const S = Array.from({ length: 4 }, () => new Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const e = BLK_DW[i] === BLK_DW[j] ? -1 : 1;
      const r = e * rhoPair(rs[i], rs[j], Math.abs(U_DW[i] - U_DW[j]));
      S[i][j] = r;
      S[j][i] = r;
    }
  }
  return S;
}
const TRAP_S = trapMatrices();
const TRAP_EIG = jacobiMax(TRAP_S);
const TRAP_NN = supNonneg(TRAP_S, 20000, 6);
// best one-per-block sub-witness of the geometry at MU_DW (drop packet 3)
const SUB_1PB_LAM = jacobiMax([
  [0, gFun(MU_DW * T12), gFun(MU_DW * T14)],
  [gFun(MU_DW * T12), 0, gFun(MU_DW * T24)],
  [gFun(MU_DW * T14), gFun(MU_DW * T24), 0],
]).lam;

// ---- seeded batteries (deterministic LCG, per-battery reseed) ----
let seedState = 0;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}

// battery A (seed 434343): packet-form vs cluster-form E identity on seeded
// multi-packet mixed-rate draws (the sign-convention ground truth)
function runIdentityBattery() {
  seedState = 434343;
  let worst = 0;
  let count = 0;
  for (let t = 0; t < 3000; t++) {
    const odd = t % 2 === 1;
    const pk = [];
    for (let b = 0; b < 4; b++) {
      const base = Math.pow(4, b) * (odd ? 2 : 1);
      const kk = 1 + Math.floor(rnd() * 3);
      for (let k = 0; k < kk; k++) {
        pk.push({ u: base * (1 + rnd()), m: 0.2 * Math.pow(10, rnd()), a: rnd(), b });
      }
    }
    // packet form
    let e1 = 0;
    for (const p of pk) e1 -= (p.a * p.a) / p.m;
    for (let i = 0; i < pk.length; i++) {
      for (let j = i + 1; j < pk.length; j++) {
        const e = pk[i].b === pk[j].b ? -1 : 1;
        e1 += 2 * e * pk[i].a * pk[j].a * kernelK(pk[i].m, pk[j].m, Math.abs(pk[i].u - pk[j].u));
      }
    }
    // cluster form
    let e2 = 0;
    for (let b = 0; b < 4; b++) {
      const cl = pk.filter((p) => p.b === b);
      let nb = 0;
      for (const p of cl) nb += (p.a * p.a) / p.m;
      for (let i = 0; i < cl.length; i++) {
        for (let j = i + 1; j < cl.length; j++) {
          nb += 2 * cl[i].a * cl[j].a * kernelK(cl[i].m, cl[j].m, Math.abs(cl[i].u - cl[j].u));
        }
      }
      e2 -= nb;
    }
    for (let b = 0; b < 4; b++) {
      for (let bp = b + 1; bp < 4; bp++) {
        const cb = pk.filter((p) => p.b === b);
        const cp = pk.filter((p) => p.b === bp);
        for (const x of cb) for (const y of cp) e2 += 2 * x.a * y.a * kernelK(x.m, y.m, Math.abs(x.u - y.u));
      }
    }
    const rel = Math.abs(e1 - e2) / Math.max(1e-30, Math.abs(e1));
    if (rel > worst) worst = rel;
    count++;
  }
  return { worst, count };
}

// battery B (seed 565656): rate-pinning approached - seeded in-class rate
// tuples >= MU_DW at the witness geometry; the sign-constrained sup never
// exceeds the common-rate value (measured; the projected value is a valid
// lower bound of the true sup, so a violation would be a REAL witness)
function runRatePinBattery() {
  seedState = 565656;
  let viol = 0;
  let maxSup = -Infinity;
  const lamRef = LAM_DW.lam;
  for (let t = 0; t < 600; t++) {
    const rs = [0, 1, 2, 3].map(() => MU_DW * (t % 3 === 0 ? 1 + 3 * rnd() * rnd() : 1 + 0.02 * rnd()));
    rs[t % 4] = MU_DW; // keep one at the floor
    const S = Array.from({ length: 4 }, () => new Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const e = BLK_DW[i] === BLK_DW[j] ? -1 : 1;
        const r = e * rhoPair(rs[i], rs[j], Math.abs(U_DW[i] - U_DW[j]));
        S[i][j] = r;
        S[j][i] = r;
      }
    }
    const s = supNonneg(S, 1500, 2);
    if (s > maxSup) maxSup = s;
    if (s > lamRef + 1e-9) viol++;
  }
  return { viol, maxSup };
}

// battery C (seed 686868): position optimality approached - seeded in-class
// position tuples (u1 in [1,2), u2/u3 in [4,8), u4 in [16,32), edge-biased
// every third draw) at common rate MU_DW; none exceeds the edge-limit lam
function runPositionBattery() {
  seedState = 686868;
  let viol = 0;
  let maxLam = -Infinity;
  const lamEdge = jacobiMax(signedMatrix(MU_DW, TAUS_EDGE)).lam;
  for (let t = 0; t < 1500; t++) {
    const edge = t % 3 === 0;
    const u1 = edge ? 2 - 1e-6 * rnd() : 1 + rnd();
    let u2 = edge ? 4 + 1e-6 * rnd() : 4 + 4 * rnd();
    let u3 = edge ? 8 - 1e-6 * rnd() : 4 + 4 * rnd();
    if (u2 > u3) {
      const tmp = u2;
      u2 = u3;
      u3 = tmp;
    }
    const u4 = edge ? 16 + 1e-6 * rnd() : 16 + 16 * rnd();
    const taus = [u2 - u1, u3 - u1, u4 - u1, u3 - u2, u4 - u2, u4 - u3];
    const { lam } = jacobiMax(signedMatrix(MU_DW, taus));
    if (lam > maxLam) maxLam = lam;
    if (lam > lamEdge + 1e-9) viol++;
  }
  return { viol, maxLam };
}

const BAT_A = runIdentityBattery();
const BAT_B = runRatePinBattery();
const BAT_C = runPositionBattery();

// baked literals (recomputed by the assertions)
const MUE_CERT_LIT = 1622.259060813114;
const MUE_FLOAT_LIT = 1721.8580820783973;
const DIAG_LIT = 10000104833;
const ROOT_DW_LIT = 0.232072387778615;
const ROOT_DW_EDGE_LIT = 0.23207238781359468;
const ROOT_1PB_EDGE_LIT = 0.2320720364350718;
const ROOT_1PB_CARRIED = 0.23207203643507168; // imp-95141/95142 landmark
const ROOT5_FP_CARRIED = 0.23207302409715935; // imp-95142 cap-matrix root
const MU_WS = 11603 / 50000; // superseded class lower end (0.23206)
const MU_FP = 2901 / 12500; // one-per-block subclass ceiling (0.23208)
const MU_HS = 12251 / 50000; // class ceiling constant (0.24502)
const TRAP_EIG_LIT = 1.005623376002021;
const TRAP_NN_LIT = 0.9999994842894873;
const QUANT_EFF_LIT = 0.9999090587995272;

export const IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE = {
  ticket:
    "imp-95143 (THEOREM DW: displacement-credit witness certificate - the first MULTI-PACKET witness of the parity-pure chain: 4 packets at exact dyadic positions (2 - 2^-30, 4, 8 - 2^-30, 16) in even blocks (0, 2, 2, 4) - TWO packets in block 2, one at each facing edge - with integer amplitudes (67604, 68478, 142, 27213) and common rate 2320723/10000000 = 0.2320723 has certified E > 0. Certified class sandwich [0.23206, 0.24502] -> [0.2320723, 0.24502]; the certified class floor now sits 2.64e-7 ABOVE the measured one-packet-per-block position-polytope limit 0.2320720364 - the displacement credit named by imp-95140-subgap-displacement-credit is WITNESS-REALIZED and the multi-packet-never-helps closing route is refuted)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95132 Lemma L2 cluster identity (same-block pairs enter E negatively in packet coordinates - audited against the imp-95136 battery ground-truth form), the imp-95135/95141 alternating-series certificate pattern, and the free-position class conventions of THEOREM SA/HS/FP; carries THEOREM HS (12251/50000) unchanged; supersedes THEOREM WS (11603/50000) as the class lower end while WS remains the lower end of the one-per-block subclass bracket.",
  theoremDW:
    "In the parity-pure sibling-chain class, the 4-packet witness u = (2 - 2^-30, 4, 8 - 2^-30, 16), blocks (0, 2, 2, 4), amplitudes (67604, 68478, 142, 27213), common rate mu = 2320723/10000000 has E > 0: mu E >= 1622.259060813 certified by N = 19 odd-truncation lower bounds on the five ADDED cross-block g values and an N = 20 even-truncation UPPER bound on the single SUBTRACTED intra-block g value (all arguments <= 3.24902 < 21, explicit 1e-12 slacks, exact dyadic separations 2 + 2^-30, 6, 14 + 2^-30, 4 - 2^-30, 12, 8 + 2^-30), against the exact integer diagonal 10000104833. Exact float mu E = 1721.8580820783973 by two independent routes (packet form; Lemma L2 cluster form), agreement 2.1e-9. Hence the sharp parity-pure class threshold is >= 0.2320723.",
  displacementCredit:
    "Certified class floor 0.2320723 > 0.2320720364350718 (one-per-block position-polytope limit over ALL positions and blocks, measured landmark carried from imp-95141/95142, reproduced in-module to 13 digits). The mechanism: THEOREM FP certifies that a SINGLE middle-block packet cannot hug both facing edges (the torn variable u_1); two packets can - the displaced packet (amplitude fraction 0.14%) collects the gap-8 bond to block 4 while the resident packet keeps the gap-2 bond to block 0, and the intra-block penalty g(4 mu) = 0.7657 (same-block pairs enter E negatively) does not fully cancel the gain. Measured family root 0.232072387778615 at delta = 2^-30 (edge limit 0.23207238781359468); displacement credit +3.514e-7 at the polytope level.",
  sandwich:
    "Certified sharp-threshold sandwich for the full parity-pure class: [2320723/10000000, 12251/50000] = [0.2320723, 0.24502] (was [0.23206, 0.24502]; lower end this module, upper end THEOREM HS carried). Subclass bracket [11603/50000, 2901/12500) (THEOREM WS + THEOREM FP, one packet per block) carried unchanged and OVERLAPS the class floor - no certified threshold separation between class and subclass is claimed.",
  correctionOfCarriedColor:
    "imp-95141 recorded multi-packet and extra-block variants as moving the root < 2.1e-9; that was a LOCAL measurement around the WS grid geometry. The both-edges middle-block split is a different basin and moves the family root +3.5e-7 (two orders more). All CERTIFIED imp-95141 statements (THEOREM WS, COROLLARY FR) are unaffected; the witness-saturation landmark moves 0.2320685 (grid) / 0.2320720 (one-per-block limit) -> 0.2320724 (multi-packet limit, measured).",
  outOfClassTrap:
    "Unrestricted eigen search over per-packet rates at the witness geometry reports lamMax = 1.0056 at rates (mu, mu, 0.57572, mu) - but the eigenvector has a NEGATIVE component on a same-block packet (sign flip converts the intra-block penalty into a gain; out of class). The sign-constrained supremum at the same rates is 0.9999994842894873 < 1 and equals the best one-per-block sub-witness value (the projection zeroes the decorrelated packet). Rate-splitting does not help in-class; in-class optimization pins all rates at the common floor (battery, measured).",
  subGaps: [
    "imp-95140-subgap-displacement-credit - OPEN, REORIENTED: the ceiling resolution must PRICE intra-block aggregation (down to at least the certified floor 0.2320723 and the measured saturation 0.2320724); excluding it is refuted by this witness. The rate-aware Gram cross-term lower bound and the exact four-region in-ramp tilted pair excess remain the named ceiling routes.",
    "imp-95143-subgap-certified-separation - NEW: certify the class/subclass threshold separation by a one-per-block ceiling certificate at 0.2320723; the THEOREM FP architecture cannot reach it (coupled-corner cap-matrix root 0.23207302409715935 sits ABOVE the required constant) - needs a joint frame coupling the (0,2) and (1,2) cap entries through their shared positions.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this is a witness-side floor move; the phi-conditional odd-mass bound is untouched",
    "the surviving certified interval [0.2320723, 0.24502] remains ceiling-side up to the measured saturation 0.2320724 - the displacement-credit ceiling lemma is the whole remaining program",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM DW is unconditional: the witness is exhibited with exact dyadic positions (in-class membership is exact interval arithmetic: 2 - 2^-30 in [1, 2), 4 and 8 - 2^-30 in [4, 8), 16 in [16, 32); blocks all even - parity-pure; TWO packets in one block is expressly in-class per the THEOREM SA/HS/FP conventions), the certificate is sign-correct on every term (added terms lower-bounded by N = 19 odd truncations minus slack, the subtracted intra-block term upper-bounded by the N = 20 even truncation plus slack, all arguments < 21), the diagonal is exact integer arithmetic, and the margin floor 1622 dominates the < 1e-4 float-summation budget. The same-block NEGATIVE sign is the Lemma L2 cluster identity, audited in-module against the imp-95136 ground-truth form on 3000 seeded mixed-rate multi-packet draws (worst 1e-9 relative) and cross-checked by two independent E routes at the witness. Scope: parity-pure model family; witness-side step - THEOREM HS carried, not re-proved; the class/one-per-block separation is certified-vs-MEASURED (the landmark 0.2320720364 is a float literal, reproduced by two modules to 13 digits, and the certified subclass bracket [0.23206, 0.23208) overlaps the class floor); geometry optimality, rate pinning, and the family roots are measured batteries and literals, not lemmas; the imp-95140-subgap-displacement-credit leg stays OPEN (reoriented, not closed); parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings of the Lambda program untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE_ASSERTIONS = [
  {
    id: "imp95143-in-class-membership",
    description:
      "exact in-class membership: u1 = 2 - 2^-30 in [1, 2), u2 = 4 and u3 = 8 - 2^-30 in [4, 8), u4 = 16 in [16, 32); blocks (0, 2, 2, 4) all even with TWO packets in block 2; amplitudes positive integers; all six separations exactly the stated dyadics; rate 2320723/10000000 positive",
    holds: () =>
      U_DW[0] >= 1 &&
      U_DW[0] < 2 &&
      U_DW[1] >= 4 &&
      U_DW[1] < 8 &&
      U_DW[2] >= 4 &&
      U_DW[2] < 8 &&
      U_DW[3] >= 16 &&
      U_DW[3] < 32 &&
      BLK_DW.every((b) => b % 2 === 0) &&
      BLK_DW[1] === BLK_DW[2] &&
      A_DW.every((a) => Number.isInteger(a) && a > 0) &&
      T12 === 2 + DELTA &&
      T13 === 6 &&
      T14 === 14 + DELTA &&
      T23 === 4 - DELTA &&
      T24 === 12 &&
      T34 === 8 + DELTA &&
      MU_DW > 0,
  },
  {
    id: "imp95143-certified-positivity",
    description:
      "the certificate: mu E >= 1622.259060813114 > 0 with sign-correct series bounds (five added cross terms lower-bounded, one subtracted intra term upper-bounded), all six series arguments <= 3.24902 < 21, exact integer diagonal 10000104833, and the bound direction is verified termwise (gLo <= g <= gHi at all six arguments)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const args = [MU_DW * T12, MU_DW * T13, MU_DW * T14, MU_DW * T23, MU_DW * T24, MU_DW * T34];
      return (
        args.every((z) => z > 0 && z < 21 && z <= 3.24902 && gLo(z) <= gFun(z) && gHi(z) >= gFun(z)) &&
        A_DW.reduce((s, a) => s + a * a, 0) === DIAG_LIT &&
        MUE_CERT > 0 &&
        MUE_CERT > 1600 &&
        rel(MUE_CERT, MUE_CERT_LIT, 1e-9)
      );
    },
  },
  {
    id: "imp95143-two-route-agreement",
    description:
      "exact float mu E = 1721.8580820783973 by the packet form and the Lemma L2 cluster form independently (agreement < 1e-8 relative), certified bound strictly below the float value, and the float value strictly above the certified bound by the expected N = 19 truncation gap (< 110)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(MUE_FLOAT, MUE_FLOAT_LIT, 1e-9) &&
        Math.abs(MUE_L2 - MUE_FLOAT) / MUE_FLOAT < 1e-8 &&
        MUE_CERT < MUE_FLOAT &&
        MUE_FLOAT - MUE_CERT < 110
      );
    },
  },
  {
    id: "imp95143-bracket-ordering",
    description:
      "constant and landmark ordering: 11603/50000 (WS) < one-per-block edge limit 0.2320720364350718 (recomputed; matches the carried imp-95141 landmark to 1e-12) < 2320723/10000000 (this floor) < family root 0.232072387778615 (delta = 2^-30) < edge limit 0.23207238781359468 < FP cap root 0.23207302409715935 < 2901/12500 (FP) < 12251/50000 (HS) - in particular the FP cap root sits ABOVE this floor, so the FP architecture cannot certify the separation",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        MU_WS < ROOT_1PB_EDGE &&
        rel(ROOT_1PB_EDGE, ROOT_1PB_EDGE_LIT, 1e-12) &&
        rel(ROOT_1PB_EDGE, ROOT_1PB_CARRIED, 1e-12) &&
        ROOT_1PB_EDGE < MU_DW &&
        MU_DW - ROOT_1PB_CARRIED > 2.6e-7 &&
        MU_DW < ROOT_DW &&
        rel(ROOT_DW, ROOT_DW_LIT, 1e-11) &&
        ROOT_DW < ROOT_DW_EDGE &&
        rel(ROOT_DW_EDGE, ROOT_DW_EDGE_LIT, 1e-11) &&
        ROOT_DW_EDGE < ROOT5_FP_CARRIED &&
        MU_DW < ROOT5_FP_CARRIED &&
        ROOT5_FP_CARRIED < MU_FP &&
        MU_FP < MU_HS
      );
    },
  },
  {
    id: "imp95143-displacement-credit-strictness",
    description:
      "the displacement credit is strict (measured): the multi-packet edge-limit root exceeds the one-per-block edge limit by more than 3.4e-7; at the witness rate the top eigenvector of the signed matrix is entrywise positive (in-class) with lam = 1 + 1.72e-7, while the best one-per-block sub-witness of the same geometry has lam < 1",
    holds: () => {
      const sgn = LAM_DW.vec[0] < 0 ? -1 : 1;
      return (
        ROOT_DW_EDGE - ROOT_1PB_EDGE > 3.4e-7 &&
        LAM_DW.lam > 1 + 1.5e-7 &&
        LAM_DW.lam < 1 + 2e-7 &&
        LAM_DW.vec.every((x) => sgn * x > 0) &&
        SUB_1PB_LAM < 1 &&
        MUE_FLOAT / ((LAM_DW.lam - 1) * DIAG_LIT) > 0.9999 &&
        Math.abs(MUE_FLOAT / ((LAM_DW.lam - 1) * DIAG_LIT) - QUANT_EFF_LIT) < 1e-6
      );
    },
  },
  {
    id: "imp95143-carried-theorem-consistency",
    description:
      "consistency with the carried chain at the witness amplitudes: E < 0 at the FP constant 2901/12500 (the witness root sits below 0.23208), at the HS constant 12251/50000, and at the SA constant 69/250 - the new floor does not contradict any carried ceiling",
    holds: () =>
      muEForm(MU_FP, A_DW, gFun, gFun) < 0 &&
      muEForm(MU_HS, A_DW, gFun, gFun) < 0 &&
      muEForm(69 / 250, A_DW, gFun, gFun) < 0,
  },
  {
    id: "imp95143-out-of-class-trap",
    description:
      "the out-of-class trap is preserved: unrestricted eigen at rates (mu, mu, 0.57572, mu) reports lamMax = 1.005623376002021 > 1 with a sign-mixed eigenvector, while the sign-constrained supremum at the same matrix is 0.9999994842894873 < 1 and matches the best one-per-block sub-witness value to 1e-9",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const sgnT = TRAP_EIG.vec[0] < 0 ? -1 : 1;
      const mixed = TRAP_EIG.vec.some((x) => sgnT * x < 0);
      return (
        rel(TRAP_EIG.lam, TRAP_EIG_LIT, 1e-9) &&
        TRAP_EIG.lam > 1.005 &&
        mixed &&
        TRAP_NN < 1 &&
        rel(TRAP_NN, TRAP_NN_LIT, 1e-8) &&
        Math.abs(TRAP_NN - SUB_1PB_LAM) < 1e-9
      );
    },
  },
  {
    id: "imp95143-identity-battery",
    description:
      "sign-convention ground truth stress-tested: 3000 seeded mixed-rate multi-packet draws (both parities, 1-3 packets per block) - the packet form (same-block pairs negative) equals the imp-95136 cluster form to 1e-9 relative on every draw",
    holds: () => BAT_A.count === 3000 && BAT_A.worst < 1e-9,
  },
  {
    id: "imp95143-rate-pin-battery",
    description:
      "rate pinning stress-tested: 600 seeded in-class rate tuples >= mu at the witness geometry (spreads to 4x every third draw) - the sign-constrained supremum (a valid lower bound of the true sup) never exceeds the common-rate value; a violation would itself be a better witness and fail the build",
    holds: () => BAT_B.viol === 0 && BAT_B.maxSup <= LAM_DW.lam + 1e-9,
  },
  {
    id: "imp95143-position-battery",
    description:
      "position optimality stress-tested: 1500 seeded in-class position tuples at the witness rate (edge-hugging every third draw) - no tuple exceeds the both-edges edge-limit lam; the facing-edge corner is the family optimum (measured)",
    holds: () => BAT_C.viol === 0 && BAT_C.maxLam <= jacobiMax(signedMatrix(MU_DW, TAUS_EDGE)).lam + 1e-9,
  },
  {
    id: "imp95143-honesty-gate",
    description:
      "the verdict is scoped: witness-side only, ceiling carried, separation certified-vs-MEASURED and stated, subclass bracket overlap stated, imp-95141 color correction scoped to measured content, leg OPEN (reoriented not closed), parent OPEN; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.promotesBound === false &&
      /NO QED/.test(IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.rigorScope) &&
      /refereed bound is changed/i.test(IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.rigorScope) &&
      /certified-vs-MEASURED/.test(IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.rigorScope) &&
      /reoriented, not closed/.test(IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.rigorScope) &&
      /overlaps the class floor/.test(IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.rigorScope) &&
      /CERTIFIED imp-95141 statements/.test(
        IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.correctionOfCarriedColor,
      ) &&
      /remains OPEN/.test(IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.openResiduals[0]) &&
      IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.subGaps.length === 2 &&
      IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE.openResiduals.length === 3,
  },
];

for (const a of IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95143-displacement-witness-certificate assertion failed: ${a.id}`);
  }
}

export default IMP95143_DISPLACEMENT_WITNESS_CERTIFICATE;
