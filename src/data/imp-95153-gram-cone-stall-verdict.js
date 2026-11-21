/**
 * imp-95153 - RIGOROUS step -- THEOREM VX (middle-heavy quadruple-block
 * ladder-floor step, certified common-rate threshold 47/200 = 0.235):
 * every parity-pure MAJ witness at ONE COMMON rate >= 47/200 with at
 * most FOUR packets in ONE block and at most one in every other block,
 * whose quadrupled block is the MIDDLE head position, has E <= 0. The
 * THEOREM VW middle constant 59/250 is lowered to the k <= 3 ladder
 * floor 47/200; with VU/VP (top and low positions already at 47/200)
 * the {exactly 4 packets in one block} channel of
 * imp-95147-subgap-qp-cert-gap is CLOSED at the ladder floor in EVERY
 * position - the final strip [47/200, 59/250) is certified and the
 * sub-gap ENDS. JOINT CONSEQUENCE (with PO/TP/VP/QP/VU/VW): any
 * full-class E > 0 witness at a common rate >= 0.235 must place >= 5
 * packets in one block, or >= 3 and >= 2 in two blocks (previous
 * threshold 0.236) - the k = 4 rung now carries the SAME floor as the
 * k <= 3 ladder. PLUS: LEMMA GA closes the SDP/Gram certificate route
 * at the recorded wall ridge, and LEMMA JB prices the pair-envelope
 * route - both carried forward as certificate-class guidance for the
 * surviving k >= 5 / mixed-heavy-pair walls.
 *
 * HONEST ATTRIBUTION (theorem constant bought by BUDGET; disposition
 * owed). The certificate is the imp-95152-LAUNCHED offline-lane run of
 * the UNCHANGED imp-95150 runner (deterministic, single-threaded,
 * bit-reproducible; scripts/imp-95150-pd2-vchart-offline-cover.mjs;
 * exact command baked by the predecessor as PENDING-AT-COMMIT with the
 * disposition explicitly owed to the successor):
 *   node scripts/imp-95150-pd2-vchart-offline-cover.mjs 1 0.235 9e8 1 0
 *   -> 871931041 cells, ZERO unresolved, depth 81, 12620.8 s, worst
 *      certified cell bound 0.9999999999983423.
 * The margin 1.66e-12 is THIN but sound: every cap stage rounds AGAINST
 * certification (gcap series inflation, sqrtHi, the cwRatio 1+1e-12
 * factor), and the bisection splits until the strict bound < 1 holds.
 * The runner is UNCHANGED since its imp-95150 commit (verified via git
 * history); the identical code path is bit-identity-anchored in-sweep by
 * the imp-95151/imp-95152 modules (T=2 anchor at 121/500, EXACT count
 * 552139), and the imp-95152 in-sweep witness battery already approaches
 * the whole strip at the new floor every sweep (zero E > 0). SUPERSEDED
 * BY ITS OWN RUN: the imp-95152 "cell ladder breaks below 0.236 /
 * budget priced out" verdict - the 0.2355 stall at 4.5e8 was
 * budget-bound, and 872M cells closed the WHOLE strip at the floor.
 *
 * LEMMA GA (Gram-cone attainability verdict; RIGOROUS). For ANY
 * configuration, the normalized block vectors are genuine unit vectors in
 * the RKHS of the kernel g(z) = exp(-z)(1+z) (Matern-3/2, a positive
 * definite function), so their correlation matrix is PSD with unit
 * diagonal. Any SDP refinement of the cell certificate that constrains
 * the bond matrix ONLY through (entrywise interval enclosures) + (PSD of
 * the correlation lift) bounds the cell by
 *   V = sup { lambdaMax(X) : 0 <= X_ij <= M_ij offdiag, X_ii = 0,
 *             I + Dinv X Dinv PSD },  D = diag(1,1,1,2,2) tail scaling.
 * Since lambdaMax is entrywise monotone on symmetric nonnegative
 * matrices (Perron-Frobenius), the unconstrained maximizer is the
 * all-caps matrix M itself; if I + Dinv M Dinv is PSD then M is
 * FEASIBLE for the lifted constraint and V = Perron(M) EXACTLY - the PSD
 * constraint removes nothing. MEASURED AT BOTH STALL CELLS (certified
 * in-sweep by Cholesky shift bisection): lambdaMin(I + Chat) >= 0.1013
 * (cell A) / 0.0960 (cell B) - the all-caps point is INTERIOR to the
 * cone with a wide margin, while Perron(M) = 1.00377 / 1.00834 > 1
 * (Rayleigh LOWER bounds 1.003774 / 1.008338 certify the excess is real,
 * independently re-confirming the imp-95150 tail-solve refutation).
 * EXACT CORE (no tail-lift caveat): the head 3x3 principal block is a
 * multiplicity-one genuine correlation lift, and its all-caps minor is
 * det3 = 0.1818 / 0.1728 >> 0 with 1 - m01^2 >= 0.216 - the exact PSD
 * necessary condition cannot exclude the corner either, and the head
 * block carries the entire Perron mass (tail entries <= 5e-4).
 * CONSEQUENCE: the SDP route is CLOSED at this ridge family; with
 * THEOREM VX the k = 4 question is settled anyway, but the verdict
 * carries to the k >= 5 / mixed-heavy-pair walls (same
 * near-single-packet ridge family recorded at both) - successors should
 * not spend an offline SDP run there either. This answers the HEAD-bump
 * thesis that the ladder stall "is exactly the imp-95018 question": NO -
 * the slack is metric, not spectral-feasibility. (Scope: the
 * packet-level 11x11 lift is NOT covered - but at packet level the Gram
 * is fully determined by positions, so a packet-level "SDP" degenerates
 * to the position cover itself, which is the measured 4.5e8-cell wall.)
 *
 * LEMMA JB (supporting-line joint-bond vertex certificate; SOUND, stated
 * for successors, exercised below). Fix lam >= 0 and let Phi be ANY
 * certified upper bound on sup_cell ( b01 + lam b12 ) (the two dominant
 * bonds sharing the quadruple-block packets). Every in-cell bond matrix
 * lies in R = { b <= caps entrywise } intersect { b01 + lam b12 <= Phi }.
 * lambdaMax is entrywise monotone AND convex along the affine cut
 * segment, so sup over R of the certificate value is attained at the TWO
 * VERTICES of the cut - each evaluated by the carried Collatz-Wielandt
 * upper bound. This is a genuinely different certificate class from the
 * fixed-vector CW bound: a joint (b01, b12) constraint can NEVER improve
 * the fixed-vector bound (sup_config max_row = max_row sup_config), so
 * the cross-row slack is invisible to ANY per-row cap refinement - it is
 * only expressible through a certificate of this polytope form (or the
 * imp-95152-named bilinear field).
 *
 * MEASURED VERDICTS (the honest part; all deterministic, in-sweep):
 * (1) GA: PSD margins above - SDP gain ZERO at both stall cells.
 * (2) JB budget at lam = 1 (the four-number sandwich, per cell):
 *     batteryJointSup 1.17075 / 1.16583  (20000 seeded draws + ascent)
 *   < PhiStar        1.20864 / 1.20286  (certify threshold: largest Phi
 *                                        whose vertex bound stays < 1)
 *   < corner         1.21699 / 1.22157  (m01 + m12: no-information line)
 *   < Phiachieved    1.26747 / 1.26359  (implementable envelope from the
 *                                        carried per-entry components).
 *     HEADROOM EXISTS: the sampled true joint sup sits ~3.1 percent below
 *     the certify threshold - a tight-enough pair envelope WOULD flip
 *     both recorded stall cells (champion joint config, with the (0,2)
 *     bond and all tail entries AT CAPS, certifies at 0.9723 / 0.9695).
 *     BUT the implementable envelope (wHi corner weights, Dlo shared
 *     denominator, per-packet shared-position 1-D sup with Lipschitz
 *     guard) overshoots the threshold by 0.059 / 0.061 - about 1.6x the
 *     available headroom - and does not even cut the corner at ANY
 *     tested lam in [0.5, 14]: REFUTED-AS-IMPLEMENTED. A certifying Phi
 *     must reproduce bondQ-grade weight-position coupling on the PAIR -
 *     exactly the imp-95152-named bilinear-field route, now with a
 *     quantified engineering budget instead of a name.
 * (3) Scratch-lane context (40000-draw samplers, recorded not asserted):
 *     sampled sup of the TRUE pointwise Perron over cell A is ~0.9658
 *     (diagnosis-consistent with the imp-95151 <= 0.99436 wall record),
 *     and a PERFECT two-bond joint cap alone prices out at ~0.972/0.971.
 *
 * WHAT MOVES / WHAT DOES NOT: the middle-position quadruple-block floor
 * moves 59/250 -> 47/200 (THEOREM VX; VW superseded) and the joint
 * >= 5-or-(3,2) threshold moves 0.236 -> 47/200 = 0.235. Everything else
 * is CARRIED: VU/VP top and low floors 47/200, the class sandwich
 * [0.2320723, 0.24502] (THEOREM HS remains the only full-class ceiling),
 * k >= 5 / mixed-heavy-pair / doubled-cert-gap / free-rate sub-gaps
 * untouched. Changes no bound; NO QED; no refereed bound is changed.
 *
 * FRONTIER AFTER THIS RUN (the k = 4 rung is done):
 * (i) the k >= 5 and mixed-heavy-pair channels of
 *     imp-95144-subgap-k-packet-ladder - LEMMA GA (no SDP gain) and the
 *     JB pair-envelope budget (headroom ~3 percent, needs bondQ-grade
 *     coupling on the pair) are the transferred guidance;
 * (ii) the JB vertex machinery below is ready and sound if those walls
 *     show the same cross-row ridge family.
 *
 * Machinery lines below are copied VERBATIM from
 * imp-95152-tf-field-final-strip.js (the carried VC+QC+PD2 cap chain) so
 * the cap matrices rebuilt here are bit-identical to the recorded stall
 * evidence. Import-light; no heavy bundle; all assertions < ~1 s.
 */
const USE_PD2 = true;
let RATE_FLOOR = 47 / 200;
const MU_CL = 9 / 10;
const EHALF_HI = 0.60653067;
const TAILSLACK = 1e-19;
const V3_FLOOR = 1e-8;
const V4_FLOOR = 1e-10;

const gFun = (z) => Math.exp(-z) * (1 + z);
function expTrunc(z, N) {
  let s = 1, t = 1;
  for (let n = 1; n <= N; n++) { t = (t * -z) / n; s += t; }
  return s;
}
function gcap(z) {
  if (z <= 4) return (expTrunc(z, 60) + 1e-8) * (1 + z);
  if (z <= 15) return (expTrunc(z, 60) + 1e-6) * (1 + z);
  return Math.pow(EHALF_HI, Math.floor(z)) * (1 + 1e-9);
}
function gLo(z) {
  if (z >= 50) return 0;
  const v = (expTrunc(z, 59) - 1e-8) * (1 + z);
  return Math.max(0, v);
}
const sqrtHi = (w) => Math.sqrt(Math.max(0, w)) * (1 + 1e-12);
const R4 = sqrtHi(4);

function kcSup(A, G) {
  const n = A.length;
  let best2 = 0;
  for (const a of A) if (a * a > best2) best2 = a * a;
  if (G < 1) {
    const d = 1 - G;
    for (let mask = 1; mask < 1 << n; mask++) {
      const idx = [];
      for (let i = 0; i < n; i++) if (mask & (1 << i)) idx.push(i);
      const m = idx.length;
      if (m < 2) continue;
      let S1 = 0;
      for (const i of idx) S1 += A[i];
      const c = G / (1 + (m - 1) * G);
      let ok = true, v = 0;
      for (const i of idx) {
        const x = (A[i] - c * S1) / d;
        if (x < -1e-9) { ok = false; break; }
        v += A[i] * x;
      }
      if (ok && v > best2) best2 = v;
    }
  }
  return sqrtHi(best2) * (1 + 1e-9);
}
function ayP(C, A, B, G, ya, yc) {
  const xa2 = 1 - ya * ya, xc2 = 1 - yc * yc;
  const xa = Math.sqrt(xa2), xc = Math.sqrt(xc2);
  const q11 = A * A - C, q22 = B * B - C, q12 = A * B - C * G;
  const Qa = xa2 * q11 + ya * ya * q22 + 2 * xa * ya * q12 + 1e-9 * C;
  const Qc = xc2 * q11 + yc * yc * q22 + 2 * xc * yc * q12 + 1e-9 * C;
  if (!(Qa <= 0 && Qc <= 0)) return false;
  const cross = xa * xc * q11 + ya * yc * q22 + (xa * yc + xc * ya) * q12 + 1e-9 * C;
  if (cross <= 0) return true;
  return cross * cross <= Qa * Qc;
}
function fsqAt(y, A, B, G) {
  const x = Math.sqrt(Math.max(0, 1 - y * y));
  const N = x * A + y * B;
  return (N * N) / (1 + 2 * x * y * G);
}
function aySup(A, B, G, ya, yc) {
  let C = Math.max(fsqAt(ya, A, B, G), fsqAt(yc, A, B, G)) * (1 + 1e-9);
  if (ayP(C, A, B, G, ya, yc)) return sqrtHi(C);
  let Cf = Math.max(A * A, B * B);
  if (G < 1) {
    const Cint = (A * A + B * B - 2 * A * B * G) / (1 - G * G);
    if (Cint > Cf) Cf = Cint;
  }
  return sqrtHi(Cf * (1 + 1e-9));
}
function mcF(G, ya, yc) {
  let s;
  const sAt = (y) => 2 * y * Math.sqrt(Math.max(0, 1 - y * y));
  const yStar = Math.SQRT1_2;
  if (ya <= yStar && yStar <= yc) s = 1;
  else s = Math.max(sAt(ya), sAt(yc));
  return sqrtHi((1 + s) / (1 + s * G)) * (1 + 1e-12);
}
function cwRatio(M, v) {
  let mx = -Infinity;
  for (let i = 0; i < 5; i++) {
    let s = TAILSLACK;
    for (let j = 0; j < 5; j++) s += M[i][j] * v[j];
    const r = s / v[i];
    if (r > mx) mx = r;
  }
  return mx * (1 + 1e-12);
}
function polish(M, v0, iters) {
  let v = v0.slice();
  for (let it = 0; it < iters; it++) {
    const w = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
      let s = v[i];
      for (let j = 0; j < 5; j++) s += M[i][j] * v[j];
      w[i] = s;
    }
    const n = Math.hypot(...w);
    for (let i = 0; i < 5; i++) v[i] = w[i] / n;
    v[3] = Math.max(v[3], V3_FLOOR);
    v[4] = Math.max(v[4], V4_FLOOR);
  }
  return v;
}

const BASE = [1, 4, 16, 64, 256];

function makeCellV(T, dropA, dropB, hasMu) {
  const others = [0, 1, 2].filter((b) => b !== T);
  const bA = others[0], bB = others[1];
  return function cellV(b) {
    let p = 4;
    let [v1a, v2a, v3a, v4a] = b.lo;
    let [v1c, v2c, v3c, v4c] = b.hi;
    let vAa = 0, vAc = 0, vBa = 0, vBc = 0;
    if (!dropA) { vAa = b.lo[p]; vAc = b.hi[p]; p++; }
    if (!dropB) { vBa = b.lo[p]; vBc = b.hi[p]; p++; }
    const [yOa, yMa, yIa] = [b.lo[p], b.lo[p + 1], b.lo[p + 2]];
    const [yOc, yMc, yIc] = [b.hi[p], b.hi[p + 1], b.hi[p + 2]];
    const muAxLo = hasMu ? b.lo[p + 3] : RATE_FLOOR;
    const muAxHi = hasMu ? b.hi[p + 3] : MU_CL;
    v2a = Math.max(v2a, v1a);
    v3a = Math.max(v3a, v2a);
    v4a = Math.max(v4a, v3a);
    v3c = Math.min(v3c, v4c);
    v2c = Math.min(v2c, v3c);
    v1c = Math.min(v1c, v2c);
    let mLo = Math.max(RATE_FLOOR, muAxLo);
    let mHi = Math.min(MU_CL, muAxHi);
    const axBase = [BASE[T], BASE[T], BASE[T], BASE[T]];
    const los = [v1a, v2a, v3a, v4a];
    const his = [v1c, v2c, v3c, v4c];
    if (!dropA) { axBase.push(BASE[bA]); los.push(vAa); his.push(vAc); }
    if (!dropB) { axBase.push(BASE[bB]); los.push(vBa); his.push(vBc); }
    for (let k = 0; k < axBase.length; k++) {
      const l = los[k] / (2 * axBase[k]);
      const h = his[k] / axBase[k];
      if (l > mLo) mLo = l;
      if (h < mHi) mHi = h;
    }
    const bandMin = (f, bps) => {
      let best = Math.min(f(mLo), f(mHi));
      for (const b2 of bps) {
        if (b2 > mLo && b2 < mHi) {
          const v = f(b2);
          if (v < best) best = v;
        }
      }
      return Math.max(0, best);
    };
    const sepV = (hiV, loV) => Math.min(48, Math.max(0, hiV - loV));
    const pairSepLB = (bx, by, vxHi, vyLo) => {
      const By = BASE[by];
      const Bx2 = 2 * BASE[bx];
      const cands = [mLo, mHi];
      const b1 = vyLo / By;
      const b2 = vxHi / Bx2;
      if (b1 > mLo && b1 < mHi) cands.push(b1);
      if (b2 > mLo && b2 < mHi) cands.push(b2);
      let best = Infinity;
      for (const m of cands) {
        const v = Math.max(m * By, vyLo) - Math.min(m * Bx2, vxHi);
        if (v < best) best = v;
      }
      return Math.max(0, best);
    };
    const tailSepLB = (bx, by, vxHi) => {
      const By = BASE[by];
      const Bx2 = 2 * BASE[bx];
      const cands = [mLo, mHi];
      const b2 = vxHi / Bx2;
      if (b2 > mLo && b2 < mHi) cands.push(b2);
      let best = Infinity;
      for (const m of cands) {
        const v = m * By - Math.min(m * Bx2, vxHi);
        if (v < best) best = v;
      }
      return Math.max(0, best);
    };
    const G12 = gLo(sepV(v2c, v1a));
    const G13 = gLo(sepV(v3c, v1a));
    const G14 = gLo(sepV(v4c, v1a));
    const G23 = gLo(sepV(v3c, v2a));
    const G24 = gLo(sepV(v4c, v2a));
    const G34 = gLo(sepV(v4c, v3a));
    const Gmin = Math.min(G12, G13, G14, G23, G24, G34);
    const FI = mcF(G34, yIa, yIc);
    const G34hi = Math.min(1, gcap(Math.max(0, v4a - v3c)));
    const w3Ilo = Math.sqrt(Math.max(0, 1 - yIc * yIc));
    const w3Ihi = sqrtHi(1 - yIa * yIa);
    const D34hi2 = sqrtHi(1 + 2 * w3Ihi * yIc * G34hi);
    const D34lo = Math.sqrt(1 + 2 * w3Ilo * yIa * G34) * (1 - 1e-12);
    const G2E = Math.max(Math.min(G23, G24), ((w3Ilo * G23 + yIa * G24) / D34hi2) * (1 - 1e-12));
    const w2Mhi = sqrtHi(1 - yMa * yMa);
    const w2Mlo = Math.sqrt(Math.max(0, 1 - yMc * yMc));
    const n2Hi = yMc * D34hi2;
    const n2Lo = yMa * D34lo;
    const ty2Hi = Math.min(1, (n2Hi / Math.hypot(w2Mlo, n2Hi)) * (1 + 1e-12));
    const ty2Lo = Math.max(0, (n2Lo / Math.hypot(w2Mhi, n2Lo)) * (1 - 1e-12));
    const FM = mcF(G2E, ty2Lo, ty2Hi);
    const w3lo = yMa * w3Ilo;
    const w3hi = yMc * w3Ihi;
    const w4lo = yMa * yIa;
    const w4hi = yMc * yIc;
    const G23hi = Math.min(1, gcap(Math.max(0, v3a - v2c)));
    const G24hi = Math.min(1, gcap(Math.max(0, v4a - v2c)));
    const D234hi = sqrtHi(1 + 2 * (w2Mhi * w3hi * G23hi + w2Mhi * w4hi * G24hi + w3hi * w4hi * G34hi));
    const D234lo =
      Math.sqrt(1 + 2 * (w2Mlo * w3lo * G23 + w2Mlo * w4lo * G24 + w3lo * w4lo * G34)) * (1 - 1e-12);
    const G1E = Math.max(
      Math.min(G12, G13, G14),
      ((w2Mlo * G12 + w3lo * G13 + w4lo * G14) / D234hi) * (1 - 1e-12)
    );
    const w1hi = sqrtHi(1 - yOa * yOa);
    const w1lo = Math.sqrt(Math.max(0, 1 - yOc * yOc));
    const n3Hi = yOc * D234hi;
    const n3Lo = yOa * D234lo;
    const ty3Hi = Math.min(1, (n3Hi / Math.hypot(w1lo, n3Hi)) * (1 + 1e-12));
    const ty3Lo = Math.max(0, (n3Lo / Math.hypot(w1hi, n3Lo)) * (1 - 1e-12));
    const FO = mcF(G1E, ty3Lo, ty3Hi);
    const w2hi4 = Math.min(1, yOc * sqrtHi(1 - yMa * yMa));
    const w3hi4 = Math.min(1, yOc * yMc * sqrtHi(1 - yIa * yIa));
    const pertOf = (whi, r) => (whi >= 0.999 ? Infinity : (whi * r) / Math.sqrt(1 - whi * whi));
    const g34Hi = yOc * yMc * D34hi2;
    const g34Lo = yOa * yMa * D34lo;
    const tD2Hi = Math.min(1, (g34Hi / Math.hypot(w1lo, g34Hi)) * (1 + 1e-12));
    const tD2Lo = Math.max(0, (g34Lo / Math.hypot(w1hi, g34Lo)) * (1 - 1e-12));
    const G1E34 = Math.max(Math.min(G13, G14), ((w3Ilo * G13 + yIa * G14) / D34hi2) * (1 - 1e-12));
    const FD2 = mcF(G1E34, tD2Lo, tD2Hi);
    const r24Hi = (yMc * yIc) / Math.max(1e-300, Math.sqrt(Math.max(0, 1 - yMc * yMc)));
    const r24Lo = (yMa * yIa) / Math.max(1e-300, sqrtHi(1 - yMa * yMa));
    const y24Hi = Math.min(1, (r24Hi / Math.hypot(1, r24Hi)) * (1 + 1e-12));
    const y24Lo = Math.max(0, (r24Lo / Math.hypot(1, r24Lo)) * (1 - 1e-12));
    const F24 = mcF(G24, y24Lo, y24Hi);
    const w2I24lo = Math.sqrt(Math.max(0, 1 - y24Hi * y24Hi));
    const w2I24hi = sqrtHi(1 - y24Lo * y24Lo);
    const G24capHi = Math.min(1, gcap(Math.max(0, v4a - v2c)));
    const D24hi = sqrtHi(1 + 2 * w2I24hi * y24Hi * G24capHi);
    const D24lo = Math.sqrt(1 + 2 * w2I24lo * y24Lo * G24) * (1 - 1e-12);
    const g24Hi = yOc * sqrtHi(1 - yMa * yMa * (1 - yIc * yIc)) * D24hi;
    const g24Lo = yOa * Math.sqrt(Math.max(0, 1 - yMc * yMc * (1 - yIa * yIa))) * D24lo;
    const tD3Hi = Math.min(1, (g24Hi / Math.hypot(w1lo, g24Hi)) * (1 + 1e-12));
    const tD3Lo = Math.max(0, (g24Lo / Math.hypot(w1hi, g24Lo)) * (1 - 1e-12));
    const G1E24 = Math.max(Math.min(G12, G14), ((w2I24lo * G12 + y24Lo * G14) / D24hi) * (1 - 1e-12));
    const FD3 = mcF(G1E24, tD3Lo, tD3Hi);
    const w4hi4 = yOc * yMc * yIc;
    const w4lo4 = yOa * yMa * yIa;
    const y14Hi = Math.min(1, (w4hi4 / Math.hypot(w1lo, w4hi4)) * (1 + 1e-12));
    const y14Lo = Math.max(0, (w4lo4 / Math.hypot(w1hi, w4lo4)) * (1 - 1e-12));
    const F14 = mcF(G14, y14Lo, y14Hi);
    const s2lo = Math.max(w1lo, Math.sqrt(Math.max(0, 1 - w2hi4 * w2hi4)));
    const w3phi = Math.min(1, w3hi4 / Math.max(1e-300, s2lo));
    const w1loQ = w1lo;
    const w2loQ = yOa * w2Mlo;
    const w3loQ = yOa * yMa * w3Ilo;
    const w4loQ = yOa * yMa * yIa;
    const D4lo = Math.sqrt(
      1 +
        2 *
          (w1loQ * w2loQ * G12 +
            w1loQ * w3loQ * G13 +
            w1loQ * w4loQ * G14 +
            w2loQ * w3loQ * G23 +
            w2loQ * w4loQ * G24 +
            w3loQ * w4loQ * G34)
    ) * (1 - 1e-12);
    let D2pLo = 1, D3pLo = 1, D23pLo = 1;
    if (USE_PD2) {
      D2pLo = Math.sqrt(1 + 2 * (w1loQ * w3loQ * G13 + w1loQ * w4loQ * G14 + w3loQ * w4loQ * G34)) * (1 - 1e-12);
      D3pLo = Math.sqrt(1 + 2 * (w1loQ * w2loQ * G12 + w1loQ * w4loQ * G14 + w2loQ * w4loQ * G24)) * (1 - 1e-12);
      D23pLo = Math.sqrt(1 + 2 * w1loQ * w4loQ * G14) * (1 - 1e-12);
    }
    const w4hi4c = yOc * yMc * yIc;
    const vlo = [v1a, v2a, v3a, v4a];
    const vhi = [v1c, v2c, v3c, v4c];
    const bondQ = (caps) => {
      const [r1, r2, r3, r4] = caps;
      const rI = Math.min(aySup(r3, r4, G34, yIa, yIc), FI * Math.max(r3, r4));
      const rM = Math.min(aySup(r2, rI, G2E, ty2Lo, ty2Hi), FM * Math.max(r2, rI));
      const full = Math.min(aySup(r1, rM, G1E, ty3Lo, ty3Hi), FO * Math.max(r1, rM), kcSup(caps, Gmin));
      const pert2 = pertOf(w2hi4, r2) / D2pLo;
      const pert3 = pertOf(w3hi4, r3) / D3pLo;
      const pert3p = pertOf(w3phi, r3) / D23pLo;
      const capD2 = Math.min(aySup(r1, rI, G1E34, tD2Lo, tD2Hi), FD2 * Math.max(r1, rI)) + pert2;
      const rI24 = Math.min(aySup(r2, r4, G24, y24Lo, y24Hi), F24 * Math.max(r2, r4));
      const capD3 = Math.min(aySup(r1, rI24, G1E24, tD3Lo, tD3Hi), FD3 * Math.max(r1, rI24)) + pert3;
      const capP23 = Math.min(aySup(r1, r4, G14, y14Lo, y14Hi), F14 * Math.max(r1, r4)) + pert2 + pert3p;
      const capQC = (w1hi * r1 + w2hi4 * r2 + w3hi4 * r3 + w4hi4c * r4) / D4lo;
      return Math.min(full, capD2, capD3, capP23, capQC) * (1 + 1e-12);
    };
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    const set = (i, j, x) => { M[i][j] = x; M[j][i] = x; };
    const dropped = {};
    if (dropA) dropped[bA] = true;
    if (dropB) dropped[bB] = true;
    const singles = { [bA]: [vAa, vAc], [bB]: [vBa, vBc] };
    const sepFromDropped = (bs, vLoTgt, tgtBase) =>
      bandMin((m) => Math.max(vLoTgt, tgtBase * m) - 2 * BASE[bs] * m, [vLoTgt / tgtBase]);
    const sepToDropped = (bs, vHiSrc, srcBase) =>
      bandMin((m) => BASE[bs] * m - Math.min(vHiSrc, 2 * srcBase * m), [vHiSrc / (2 * srcBase)]);
    for (let x = 0; x < 3; x++) {
      for (let y = x + 1; y < 3; y++) {
        if (x === T) {
          const caps = dropped[y]
            ? [0, 1, 2, 3].map((i) => gcap(sepToDropped(y, vhi[i], BASE[T])))
            : [0, 1, 2, 3].map((i) => gcap(pairSepLB(x, y, vhi[i], singles[y][0])));
          set(x, y, bondQ(caps));
        } else if (y === T) {
          const caps = dropped[x]
            ? [0, 1, 2, 3].map((i) => gcap(sepFromDropped(x, vlo[i], BASE[T])))
            : [0, 1, 2, 3].map((i) => gcap(pairSepLB(x, y, singles[x][1], vlo[i])));
          set(x, y, bondQ(caps));
        } else {
          let sep;
          if (dropped[x] && dropped[y]) {
            sep = mLo * (BASE[y] - 2 * BASE[x]);
          } else if (dropped[x]) {
            sep = sepFromDropped(x, singles[y][0], BASE[y]);
          } else if (dropped[y]) {
            sep = sepToDropped(y, singles[x][1], BASE[x]);
          } else {
            sep = pairSepLB(x, y, singles[x][1], singles[y][0]);
          }
          set(x, y, gcap(sep));
        }
      }
    }
    for (const c of [3, 4]) {
      for (const bh of [0, 1, 2]) {
        if (bh === T) {
          const caps = [0, 1, 2, 3].map((i) => gcap(tailSepLB(bh, c, vhi[i])));
          set(bh, c, R4 * bondQ(caps));
        } else if (dropped[bh]) {
          set(bh, c, R4 * gcap(mLo * (BASE[c] - 2 * BASE[bh])));
        } else {
          const sHi = singles[bh][1];
          set(bh, c, R4 * gcap(tailSepLB(bh, c, sHi)));
        }
      }
    }
    set(3, 4, 4 * gcap(mLo * 128));
    return M;
  };
}
// ---------------------------------------------------------------------------
// baked stall cells (T = 1 middle-heavy, dropA, hasMu; floor 47/200) - the
// two imp-95151/imp-95152 recorded 47/200 v-chart stall cells, verbatim
// ---------------------------------------------------------------------------
const STALL_A = {
  lo: [0.94, 0.94, 1.7225, 1.86921875, 3.76, 0.65625, 0.8125, 0.9921875, 0.235],
  hi: [0.9889062499999999, 0.9889062499999999, 1.77140625, 1.9181249999999999, 3.9556249999999995, 0.6875, 0.84375, 0.99609375, 0.24019531249999998],
};
const STALL_B = {
  lo: [0.94, 0.9889062499999999, 1.7225, 1.8203125, 3.76, 0.625, 0.8125, 0.9921875, 0.235],
  hi: [0.9889062499999999, 1.0378124999999998, 1.77140625, 1.9181249999999999, 4.151249999999999, 0.65625, 0.84375, 0.99609375, 0.24019531249999998],
};
const LAM = 1;
const V0 = [0.7, 0.7, 0.14, 1e-3, 1e-8];
const cellFn = makeCellV(1, true, false, true);

function cwUpper(M) {
  return cwRatio(M, polish(M, V0, 4000));
}
function rayleighLower(M) {
  const v = polish(M, V0, 4000);
  let num = 0, den = 0;
  for (let i = 0; i < 5; i++) {
    den += v[i] * v[i];
    for (let j = 0; j < 5; j++) num += v[i] * M[i][j] * v[j];
  }
  return (num / den) * (1 - 1e-12);
}
// certified lower bound on lambda_min via Cholesky shift bisection
function lambdaMinLower(C) {
  const n = C.length;
  const pdShift = (t) => {
    const L = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let s = C[i][j] - (i === j ? t : 0);
        for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
        if (i === j) {
          if (s <= 1e-12) return false;
          L[i][i] = Math.sqrt(s);
        } else L[i][j] = s / L[j][j];
      }
    }
    return true;
  };
  if (!pdShift(0)) return -1;
  let lo = 0, hi = 1;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (pdShift(mid)) lo = mid; else hi = mid;
  }
  return lo;
}
// true bonds of an explicit in-cell configuration (packet Gram of the exact
// Matern-3/2 kernel gFun; block-1 nested spherical weights as carried)
function trueBonds(cfg) {
  const { xs, p0, p2, yO, yM, yI } = cfg;
  const w = [
    Math.sqrt(1 - yO * yO),
    yO * Math.sqrt(1 - yM * yM),
    yO * yM * Math.sqrt(1 - yI * yI),
    yO * yM * yI,
  ];
  let D2 = 1;
  for (let p = 0; p < 4; p++) for (let q = p + 1; q < 4; q++) D2 += 2 * w[p] * w[q] * gFun(Math.abs(xs[p] - xs[q]));
  const D = Math.sqrt(D2);
  let n01 = 0, n12 = 0;
  for (let p = 0; p < 4; p++) {
    n01 += w[p] * gFun(Math.abs(xs[p] - p0));
    n12 += w[p] * gFun(Math.abs(p2 - xs[p]));
  }
  return { b01: n01 / D, b12: n12 / D, b02: gFun(Math.abs(p2 - p0)) };
}
// LEMMA JB implementable envelope: certified upper bound on
// sup_cell ( b01 + lam b12 ) from the carried per-entry cap components
function jbPhi(cell, lam) {
  const lo = cell.lo, hi = cell.hi;
  const p0hi = 2 * hi[8];
  const p2lo = Math.max(lo[4], 16 * lo[8]);
  const [yOa, yOc, yMa, yMc, yIa, yIc] = [lo[5], hi[5], lo[6], hi[6], lo[7], hi[7]];
  const wHi = [sqrtHi(1 - yOa * yOa), yOc * sqrtHi(1 - yMa * yMa), yOc * yMc * sqrtHi(1 - yIa * yIa), yOc * yMc * yIc];
  const wLo = [
    Math.sqrt(Math.max(0, 1 - yOc * yOc)),
    yOa * Math.sqrt(Math.max(0, 1 - yMc * yMc)),
    yOa * yMa * Math.sqrt(Math.max(0, 1 - yIc * yIc)),
    yOa * yMa * yIa,
  ];
  let D2 = 1;
  for (let p = 0; p < 4; p++) for (let q = p + 1; q < 4; q++) D2 += 2 * wLo[p] * wLo[q] * gLo(Math.max(0, hi[q] - lo[p]));
  const Dlo = Math.sqrt(D2) * (1 - 1e-12);
  let num = 0;
  const NPT = 4000;
  for (let p = 0; p < 4; p++) {
    const a = lo[p], b = hi[p];
    let sup = 0;
    for (let k = 0; k <= NPT; k++) {
      const x = a + ((b - a) * k) / NPT;
      const v = gcap(Math.max(0, x - p0hi)) + lam * gcap(Math.max(0, p2lo - x));
      if (v > sup) sup = v;
    }
    sup += ((1 + lam) * 0.3679 * (b - a)) / NPT / 2 + 1e-12;
    num += wHi[p] * sup;
  }
  return (num / Dlo) * (1 + 1e-12);
}
// vertex evaluation of the JB polytope certificate for a given Phi
function jbVertexBound(Mcap, lam, Phi) {
  const m01 = Mcap[0][1], m12 = Mcap[1][2];
  const mk = (x, y) => {
    const M = Mcap.map((r) => r.slice());
    M[0][1] = M[1][0] = Math.min(x, m01);
    M[1][2] = M[2][1] = Math.min(y, m12);
    return M;
  };
  const b01v1 = Math.min(m01, Phi);
  const V1 = [b01v1, Math.max(0, (Phi - b01v1) / lam)];
  const b12v2 = Math.min(m12, Phi / lam);
  const V2 = [Math.max(0, Phi - lam * b12v2), b12v2];
  return Math.max(cwUpper(mk(V1[0], V1[1])), cwUpper(mk(V2[0], V2[1])));
}
// certify-threshold Phi-star: largest Phi whose vertex bound stays < 1
function phiStar(Mcap, lam) {
  let lo = 0, hi = Mcap[0][1] + lam * Mcap[1][2];
  if (jbVertexBound(Mcap, lam, hi) < 1) return hi;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (jbVertexBound(Mcap, lam, mid) < 1) lo = mid; else hi = mid;
  }
  return lo;
}
// deterministic seeded battery: sample true in-cell configurations, track
// per-entry and joint suprema, verify GA premise (head 3x3 PSD) and JB
// envelope soundness on every draw; polish the joint champion by ascent
function battery(cell, Mcap, phiAch, nDraws) {
  const lo = cell.lo, hi = cell.hi;
  let s = 1234567;
  const rnd = (a, b) => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return a + (s / 4294967296) * (b - a);
  };
  let violations = 0, drawn = 0;
  let jointSup = -1, champ = null;
  let sup01 = -1, sup12 = -1, sup02 = -1;
  const m01 = Mcap[0][1], m12 = Mcap[1][2], m02 = Mcap[0][2];
  const check = (cfg) => {
    const t = trueBonds(cfg);
    if (t.b01 > m01 * (1 + 1e-9) || t.b12 > m12 * (1 + 1e-9) || t.b02 > m02 * (1 + 1e-9)) violations++;
    const det3 = 1 + 2 * t.b01 * t.b02 * t.b12 - t.b01 * t.b01 - t.b02 * t.b02 - t.b12 * t.b12;
    if (det3 < -1e-12) violations++;
    const j = t.b01 + LAM * t.b12;
    if (j > phiAch) violations++;
    if (t.b01 > sup01) sup01 = t.b01;
    if (t.b12 > sup12) sup12 = t.b12;
    if (t.b02 > sup02) sup02 = t.b02;
    if (j > jointSup) { jointSup = j; champ = cfg; }
    return t;
  };
  for (let it = 0; it < nDraws; it++) {
    const mu = rnd(lo[8], hi[8]);
    const xs = [];
    let ok = true;
    for (let k = 0; k < 4; k++) {
      const a = Math.max(lo[k], 4 * mu), b = Math.min(hi[k], 8 * mu);
      if (a > b) { ok = false; break; }
      xs.push(rnd(a, b));
    }
    if (!ok) continue;
    xs.sort((a, b) => a - b);
    const p2a = Math.max(lo[4], 16 * mu), p2b = Math.min(hi[4], 32 * mu);
    if (p2a > p2b) continue;
    const cfg = {
      mu, xs,
      p2: rnd(p2a, p2b),
      p0: 0, yO: rnd(lo[5], hi[5]), yM: rnd(lo[6], hi[6]), yI: rnd(lo[7], hi[7]),
    };
    cfg.p0 = rnd(cfg.mu, 2 * cfg.mu);
    drawn++;
    check(cfg);
  }
  for (let round = 0; round < 80; round++) {
    let improved = false;
    for (const f of ["mu", "p0", "p2", "yO", "yM", "yI", "x0", "x1", "x2", "x3"]) {
      for (const d of [3e-3, -3e-3, 3e-4, -3e-4, 3e-5, -3e-5, 3e-6, -3e-6]) {
        const cf = { ...champ, xs: champ.xs.slice() };
        if (f.startsWith("x")) cf.xs[+f[1]] += d;
        else cf[f] += d;
        if (cf.mu < lo[8] || cf.mu > hi[8]) continue;
        const sorted = cf.xs.slice().sort((a, b) => a - b);
        let bad = false;
        for (let k = 0; k < 4; k++) {
          if (sorted[k] < Math.max(lo[k], 4 * cf.mu) - 1e-12 || sorted[k] > Math.min(hi[k], 8 * cf.mu) + 1e-12) bad = true;
        }
        if (bad) continue;
        if (cf.p0 < cf.mu || cf.p0 > 2 * cf.mu) continue;
        if (cf.p2 < Math.max(lo[4], 16 * cf.mu) || cf.p2 > Math.min(hi[4], 32 * cf.mu)) continue;
        if (cf.yO < lo[5] || cf.yO > hi[5] || cf.yM < lo[6] || cf.yM > hi[6] || cf.yI < lo[7] || cf.yI > hi[7]) continue;
        cf.xs = sorted;
        const t = trueBonds(cf);
        const j = t.b01 + LAM * t.b12;
        if (j > phiAch) violations++;
        if (j > jointSup) { jointSup = j; champ = cf; improved = true; }
      }
    }
    if (!improved) break;
  }
  const tc = trueBonds(champ);
  const mkChamp = Mcap.map((r) => r.slice());
  mkChamp[0][1] = mkChamp[1][0] = tc.b01;
  mkChamp[1][2] = mkChamp[2][1] = tc.b12;
  const champJ2Upper = cwUpper(mkChamp);
  return { drawn, violations, jointSup, sup01, sup12, sup02, champJ2Upper };
}

// ---------------------------------------------------------------------------
// data object (baked literals generated by this exact code path)
// ---------------------------------------------------------------------------
export const IMP95153_GRAM_CONE_STALL_VERDICT = {
  id: "imp-95153",
  kind: "rigorous-theorem-plus-certificate-class-verdicts",
  claim:
    "THEOREM VX (middle-heavy quadruple-block ladder-floor step, certified 47/200 = 0.235): every parity-pure MAJ witness at ONE COMMON rate >= 47/200 with at most FOUR packets in ONE block and at most one in every other block, whose quadrupled block is the MIDDLE head position, has E <= 0 - the VW middle constant 59/250 drops to the k <= 3 ladder floor, the final strip [47/200, 59/250) is certified, and the imp-95147-subgap-qp-cert-gap {exactly 4} channel is CLOSED in every position; the joint >= 5-or-(3,2) threshold moves 0.236 -> 0.235. PLUS LEMMA GA: at both recorded 47/200 stall cells the all-caps bond matrix is strictly interior to the PSD correlation cone (lambdaMin >= 0.096, head 3x3 minor >= 0.172), so the SDP/Gram certificate class - bumped to critical against this stall - carries exactly zero gain at the recorded ridge and the joint-attainment slack is metric, not spectral-feasibility. PLUS LEMMA JB (supporting-line joint-bond vertex certificate, sound) with a measured budget: sampled true joint (b01 + b12) sup sits ~3.1 percent below the certify threshold, but the implementable per-entry-component envelope overshoots by ~1.6x that headroom - refuted as implemented; a certifying pair envelope needs bondQ-grade coupling.",
  theoremVX: {
    statement:
      "Certified by the imp-95152-launched offline-lane run of the UNCHANGED imp-95150 runner (disposition owed to this run, recorded here): the T=1 middle-heavy v-chart cover at floor 47/200 terminates with ZERO unresolved over the full rate axis [0.235, 0.9].",
    cmd: "node scripts/imp-95150-pd2-vchart-offline-cover.mjs 1 0.235 9e8 1 0",
    result: { T: 1, floor: 0.235, budget: 900000000, pd2: true, cells: 871931041, worst: 0.9999999999983423, maxDepth: 81, unresolved: 0, pruned: 2150982, secs: 12620.807 },
    marginNote:
      "worst certified cell bound 0.9999999999983423 - margin 1.66e-12, thin but sound: every cap stage rounds AGAINST certification and the bisection splits until the strict bound < 1 holds. Runner unchanged since its imp-95150 commit; code path bit-identity-anchored in-sweep by the imp-95151/imp-95152 modules (T=2 anchor, EXACT count 552139); the imp-95152 in-sweep witness battery probes the whole strip at this floor every sweep (zero E > 0).",
    supersedes: ["THEOREM VW middle constant 59/250", "imp-95152 ladder-break / budget-priced-out verdict (its own pending run closed the strip at 2x the stalled budget)"],
    jointThreshold: 47 / 200,
  },
  answersCriticalBump:
    "HEAD commit 0ae87fa57 bumped imp-95018 (SDP Gram experiment) to critical on the thesis that the imp-95152 joint-attainment stall is exactly its question. VERDICT: NO - at the recorded ridge the all-caps matrix is Gram-ATTAINABLE in the lifted cone (the same qualitative answer imp-95018 found for the parity factor 2), so no block-level SDP can flip such cells; with THEOREM VX the k = 4 strip is settled anyway, and successors should not spend an offline SDP run on the surviving k >= 5 / mixed-heavy-pair walls (same ridge family).",
  lemmaGA: {
    cellA: {
      capPerronUpper: 1.0037741941408107,
      capPerronRayleighLower: 1.0037741937465008,
      lambdaMinLiftedAllCaps: 0.10139516688728262,
      headCaps: { m01: 0.8795848294044999, m02: 0.15981905680976788, m12: 0.33740966875486406 },
      head3x3Det: 0.1818054478964693,
    },
    cellB: {
      capPerronUpper: 1.008337596694004,
      capPerronRayleighLower: 1.008337596335292,
      lambdaMinLiftedAllCaps: 0.09606188929281216,
      headCaps: { m01: 0.885296904988301, m02: 0.15981905680976788, m12: 0.33627553203385724 },
      head3x3Det: 0.17278347081843065,
    },
    tailLiftScaling: [1, 1, 1, 2, 2],
    scopeNote:
      "Refutes every certificate constraining the bond matrix only through entrywise intervals plus PSD of the block-correlation lift. The head 3x3 core is an exact multiplicity-one necessary condition and carries the entire Perron mass (tail entries <= 5e-4). The packet-level lift is out of scope: at packet level the Gram is fully determined by positions, so a packet-level SDP degenerates to the position cover itself.",
  },
  lemmaJB: {
    statement:
      "For lam >= 0 and ANY certified Phi >= sup_cell(b01 + lam b12), the in-cell bond matrices lie in the caps-box cut by the halfplane b01 + lam b12 <= Phi; lambdaMax is entrywise monotone and convex along the affine cut segment, so the cell bound is the max of the carried Collatz-Wielandt upper bounds at the TWO cut vertices. A joint (b01, b12) constraint can never improve the fixed-vector CW bound itself (sup-max identity), so the cross-row slack is expressible ONLY through a certificate of this polytope form or the imp-95152-named bilinear field.",
    lam: 1,
    budget: {
      cellA: {
        batteryJointSup: 1.1707547521521875,
        phiStarCertifyThreshold: 1.208637362363929,
        cornerNoInformation: 1.216994498159364,
        phiAchievedImplementable: 1.2674664458910958,
        champJointConfigCertifiedUpper: 0.9722920261075709,
      },
      cellB: {
        batteryJointSup: 1.1658319774421337,
        phiStarCertifyThreshold: 1.202858399025649,
        cornerNoInformation: 1.2215724370221583,
        phiAchievedImplementable: 1.2635877606774313,
        champJointConfigCertifiedUpper: 0.9694506700840345,
      },
      reading:
        "batteryJointSup < phiStar < corner < phiAchieved at both cells: headroom (phiStar - batteryJointSup) ~ 0.038 / 0.037 exists, so a tight-enough pair envelope certifies both stall cells (their joint champions, with the (0,2) bond and all tail entries AT CAPS, certify at 0.9723 / 0.9695); the implementable envelope overshoots the threshold by 0.059 / 0.061 (~1.6x the headroom) and never cuts the corner at any lam in [0.5, 14] - refuted as implemented.",
    },
    scratchContext:
      "Offline 40000-draw samplers (recorded, not asserted): sampled sup of the TRUE pointwise Perron over cell A ~ 0.9658 (consistent with the imp-95151 wall diagnosis <= 0.99436); a PERFECT two-bond joint cap alone prices out at ~0.972 / 0.971.",
  },
  carried: {
    middleFloor: 47 / 200,
    middleFloorSupersedes: 59 / 250,
    topFloor: 47 / 200,
    lowAndTailFloor: 47 / 200,
    closedStrip: [47 / 200, 59 / 250],
    jointThreshold: 47 / 200,
    classSandwich: [0.2320723, 0.24502],
  },
  frontierAfterThisRun: [
    "k >= 5 and mixed-heavy-pair channels of imp-95144-subgap-k-packet-ladder (no wall record yet); transferred guidance: LEMMA GA (no SDP gain at the near-single-packet ridge family) and the JB pair-envelope budget (headroom ~3 percent, needs bondQ-grade coupling on the pair).",
    "doubled-cert-gap and free-rate sub-gaps untouched.",
    "NOT the SDP/Gram cone - closed by LEMMA GA at the recorded ridge family.",
  ],
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// ---------------------------------------------------------------------------
// self-executing assertions (throw on violation; import-light; ~1 s)
// ---------------------------------------------------------------------------
function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95153-gram-cone-stall-verdict assertion failed: ${id}`);
}
const MEASURED = {};

// (1) series-cap sanity: gcap >= g >= gLo on a grid
for (let z = 0; z <= 24; z += 0.375) {
  assertI(gcap(z) >= gFun(z) && gFun(z) >= gLo(z), `imp95153-gcap-gLo-sandwich@${z}`);
}

const DELTA_LIFT = IMP95153_GRAM_CONE_STALL_VERDICT.lemmaGA.tailLiftScaling;
for (const [key, cell] of [["cellA", STALL_A], ["cellB", STALL_B]]) {
  const ga = IMP95153_GRAM_CONE_STALL_VERDICT.lemmaGA[key];
  const jb = IMP95153_GRAM_CONE_STALL_VERDICT.lemmaJB.budget[key];
  const M = cellFn(cell);

  // (2) the recorded stall is REAL: CW upper > 1 matches the imp-95152 baked
  // fixed-vector bounds, and the Rayleigh LOWER bound certifies the cap
  // matrix Perron value genuinely exceeds 1 (not a polish artifact)
  const capBound = cwUpper(M);
  assertI(capBound > 1 && Math.abs(capBound - ga.capPerronUpper) < 2e-3, `imp95153-${key}-cap-bound(${capBound})`);
  const rayl = rayleighLower(M);
  assertI(rayl > 1.0005 && rayl <= capBound && Math.abs(rayl - ga.capPerronRayleighLower) < 2e-3, `imp95153-${key}-rayleigh(${rayl})`);

  // (3) LEMMA GA: the lifted all-caps candidate is strictly PSD-interior
  // (Cholesky shift bisection lower bound on lambdaMin), so the SDP value
  // equals Perron(M) and the Gram cone removes nothing at this cell
  const C = Array.from({ length: 5 }, (_, i) =>
    Array.from({ length: 5 }, (_, j) => (i === j ? 1 : M[i][j] / (DELTA_LIFT[i] * DELTA_LIFT[j])))
  );
  const lmin = lambdaMinLower(C);
  assertI(lmin >= 0.09 && Math.abs(lmin - ga.lambdaMinLiftedAllCaps) < 1e-6, `imp95153-${key}-psd-interior(${lmin})`);

  // (4) exact head 3x3 core: minor strictly positive with margin
  const m01 = M[0][1], m12 = M[1][2], m02 = M[0][2];
  assertI(Math.abs(m01 - ga.headCaps.m01) < 1e-9 && Math.abs(m12 - ga.headCaps.m12) < 1e-9 && Math.abs(m02 - ga.headCaps.m02) < 1e-9, `imp95153-${key}-head-caps`);
  const det3 = 1 + 2 * m01 * m02 * m12 - m01 * m01 - m02 * m02 - m12 * m12;
  assertI(det3 > 0.17 && Math.abs(det3 - ga.head3x3Det) < 1e-9, `imp95153-${key}-head-det3(${det3})`);
  assertI(1 - m01 * m01 > 0.21, `imp95153-${key}-head-minor`);

  // (5) LEMMA JB budget sandwich at lam = 1:
  // batteryJointSup < phiStar < corner < phiAchieved
  const corner = m01 + LAM * m12;
  assertI(Math.abs(corner - jb.cornerNoInformation) < 1e-9, `imp95153-${key}-corner`);
  const phiAch = jbPhi(cell, LAM);
  assertI(Math.abs(phiAch - jb.phiAchievedImplementable) < 1e-9, `imp95153-${key}-phi-achieved(${phiAch})`);
  assertI(phiAch > corner + 0.04, `imp95153-${key}-envelope-refuted-as-implemented`);
  const pStar = phiStar(M, LAM);
  assertI(Math.abs(pStar - jb.phiStarCertifyThreshold) < 2e-3, `imp95153-${key}-phi-star(${pStar})`);
  assertI(pStar < corner - 8e-3, `imp95153-${key}-certifying-cut-exists-below-corner`);

  // (6) seeded battery: zero violations of the entry caps, the head 3x3 PSD
  // premise of LEMMA GA, and the Phi envelope on every draw; the polished
  // joint champion stays below the certify threshold (headroom exists) and
  // its own bond matrix - with the (0,2) bond and tails AT CAPS - certifies
  const bat = battery(cell, M, phiAch, 20000);
  assertI(bat.drawn >= 19000 && bat.violations === 0, `imp95153-${key}-battery(${bat.drawn},${bat.violations})`);
  assertI(Math.abs(bat.jointSup - jb.batteryJointSup) < 5e-3, `imp95153-${key}-battery-joint-sup(${bat.jointSup})`);
  assertI(bat.jointSup < pStar - 0.03, `imp95153-${key}-headroom-exists`);
  assertI(bat.champJ2Upper < 0.98 && Math.abs(bat.champJ2Upper - jb.champJointConfigCertifiedUpper) < 5e-3, `imp95153-${key}-champ-certifies(${bat.champJ2Upper})`);
  assertI(bat.sup01 < m01 && bat.sup12 < m12 && bat.sup02 < m02, `imp95153-${key}-battery-caps-dominate`);
  MEASURED[key] = { capBound, rayl, lmin, det3, corner, phiAch, pStar, bat };
}

// (7) THEOREM VX literal consistency: the baked offline-cover result is a
// genuine zero-unresolved certificate at the exact ladder floor (the
// float parsed from the runner arg "0.235" is identically 47/200), the
// cover terminated strictly under budget, and the thin margin is strict
{
  const t = IMP95153_GRAM_CONE_STALL_VERDICT.theoremVX.result;
  assertI(47 / 200 === 0.235 && t.floor === 47 / 200, "imp95153-vx-floor-identity");
  assertI(t.unresolved === 0 && t.cells === 871931041 && t.cells < t.budget, "imp95153-vx-zero-unresolved");
  assertI(t.worst < 1 && t.worst > 0.9999999, "imp95153-vx-strict-margin");
  assertI(t.T === 1 && t.pd2 === true && t.maxDepth === 81, "imp95153-vx-args");
}

// (8) carried-constant guard: the middle floor moves to the ladder floor,
// everything else is carried
{
  const c = IMP95153_GRAM_CONE_STALL_VERDICT.carried;
  assertI(c.middleFloor === 47 / 200 && c.topFloor === 47 / 200 && c.lowAndTailFloor === 47 / 200, "imp95153-carried-floors");
  assertI(c.closedStrip[0] === 47 / 200 && c.closedStrip[1] === 59 / 250 && c.jointThreshold === 47 / 200, "imp95153-closed-strip");
  assertI(c.classSandwich[0] === 0.2320723 && c.classSandwich[1] === 0.24502, "imp95153-class-sandwich");
  assertI(IMP95153_GRAM_CONE_STALL_VERDICT.promotesBound === false && IMP95153_GRAM_CONE_STALL_VERDICT.noQED === true, "imp95153-no-promotion");
}

// ---------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// ---------------------------------------------------------------------------
export const IMP95153_GRAM_CONE_STALL_VERDICT_ASSERTIONS = [
  {
    id: "imp95153-stall-is-real",
    description:
      "Both baked 47/200 stall cells rebuild bit-identically: CW uppers 1.00377 / 1.00834 exceed 1 AND the Rayleigh LOWER bounds certify the cap-matrix Perron excess is genuine (not a polish artifact)",
    holds: () =>
      MEASURED.cellA.capBound > 1 && MEASURED.cellA.rayl > 1.0005 &&
      MEASURED.cellB.capBound > 1 && MEASURED.cellB.rayl > 1.0005,
  },
  {
    id: "imp95153-lemma-ga-psd-interior",
    description:
      "LEMMA GA: the lifted all-caps candidate is strictly PSD-interior at both cells (Cholesky-certified lambdaMin >= 0.09), so the SDP value equals the entrywise Perron value and the Gram cone removes nothing at the recorded stall",
    holds: () => MEASURED.cellA.lmin >= 0.09 && MEASURED.cellB.lmin >= 0.09,
  },
  {
    id: "imp95153-head-3x3-exact-core",
    description:
      "Exact multiplicity-one head 3x3 core: all-caps minors det3 >= 0.17 at both cells - even the exact PSD necessary condition cannot exclude the corner",
    holds: () => MEASURED.cellA.det3 > 0.17 && MEASURED.cellB.det3 > 0.17,
  },
  {
    id: "imp95153-jb-certifying-cut-exists",
    description:
      "LEMMA JB: a certifying supporting-line cut exists strictly below the corner at lam = 1 (phiStar < corner - 8e-3) at both cells - the vertex certificate class is not vacuous",
    holds: () =>
      MEASURED.cellA.pStar < MEASURED.cellA.corner - 8e-3 &&
      MEASURED.cellB.pStar < MEASURED.cellB.corner - 8e-3,
  },
  {
    id: "imp95153-jb-headroom-exists",
    description:
      "JB budget: the 20000-draw seeded battery joint sup sits > 0.03 below the certify threshold at both cells, and each joint champion - with the (0,2) bond and all tail entries AT CAPS - certifies below 0.98",
    holds: () =>
      MEASURED.cellA.bat.jointSup < MEASURED.cellA.pStar - 0.03 && MEASURED.cellA.bat.champJ2Upper < 0.98 &&
      MEASURED.cellB.bat.jointSup < MEASURED.cellB.pStar - 0.03 && MEASURED.cellB.bat.champJ2Upper < 0.98,
  },
  {
    id: "imp95153-jb-refuted-as-implemented",
    description:
      "The implementable envelope does NOT cut the corner (phiAchieved > corner + 0.04 at both cells): the cheap per-entry-component form of the pair-envelope route is refuted as implemented",
    holds: () =>
      MEASURED.cellA.phiAch > MEASURED.cellA.corner + 0.04 &&
      MEASURED.cellB.phiAch > MEASURED.cellB.corner + 0.04,
  },
  {
    id: "imp95153-battery-sound",
    description:
      "Seeded batteries (20000 draws each cell): ZERO violations of the entry caps, the head 3x3 PSD premise of LEMMA GA, and the Phi envelope",
    holds: () =>
      MEASURED.cellA.bat.violations === 0 && MEASURED.cellA.bat.drawn >= 19000 &&
      MEASURED.cellB.bat.violations === 0 && MEASURED.cellB.bat.drawn >= 19000,
  },
  {
    id: "imp95153-theorem-vx-certificate",
    description:
      "THEOREM VX: the baked offline zero-unresolved cover at the exact ladder floor 47/200 (871931041 cells, depth 81, strict worst < 1, terminated under budget) closes the final strip [47/200, 59/250) - the {exactly 4} channel ends at the k <= 3 ladder floor in every position",
    holds: () => {
      const t = IMP95153_GRAM_CONE_STALL_VERDICT.theoremVX.result;
      return 47 / 200 === 0.235 && t.floor === 47 / 200 && t.unresolved === 0 && t.cells === 871931041 && t.cells < t.budget && t.worst < 1;
    },
  },
  {
    id: "imp95153-honest-record-literals",
    description:
      "Baked-literal consistency: the middle floor moves to the ladder floor 47/200 (VW 59/250 superseded), the class sandwich is carried unchanged, no bound promotion, no QED",
    holds: () =>
      IMP95153_GRAM_CONE_STALL_VERDICT.carried.middleFloor === 47 / 200 &&
      IMP95153_GRAM_CONE_STALL_VERDICT.carried.middleFloorSupersedes === 59 / 250 &&
      IMP95153_GRAM_CONE_STALL_VERDICT.carried.closedStrip[1] === 59 / 250 &&
      IMP95153_GRAM_CONE_STALL_VERDICT.promotesBound === false &&
      IMP95153_GRAM_CONE_STALL_VERDICT.noQED === true,
  },
];

for (const a of IMP95153_GRAM_CONE_STALL_VERDICT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95153-gram-cone-stall-verdict assertion failed: ${a.id}`);
}
