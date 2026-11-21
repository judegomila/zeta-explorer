/**
 * imp-95140 - THEOREM HS (hybrid split-bond cap, certified rate threshold
 * 12251/50000 = 0.24502): NARROWS imp-95139-subgap-ramp-interior-
 * linearization by replacing the L2 TRIANGLE split of Corollary PF with an
 * EXACT BILINEAR split of the bond at the probe foot. Certified
 * sharp-threshold sandwich [0.23, 0.24505] -> [0.23, 12251/50000 = 0.24502]
 * (width 0.01505 -> 0.01502). The certified gain is small; the structural
 * gain is that the in-ramp mass is now priced at its SHARP linear
 * coefficient (the exact extremal correlation g(8 mu) at the qc = 1 ridge,
 * attained in the single-packet limit), where the carried Corollary PF
 * charged chat(8 mu) sqrt(1 + Z qc) - the in-ramp penalty inherited the
 * FULL neighbor-side tilt enhancement it can never realize.
 *
 * THEOREM HS. Let W be any parity-pure MAJ witness of the sibling-chain
 * class (nonnegative amplitudes, free rates >= mu_min, positions
 * u_i in [2^{b_i}, 2^{b_i + 1})) with ANY number of packets per block. If
 * every rate satisfies mu_i >= 12251/50000, then E <= 0. Contrapositive:
 * E > 0 forces mu_min < 12251/50000 = 0.24502. Supersedes THEOREM PD
 * (4901/20000 = 0.24505) at the constant level.
 *
 * PROOF CHAIN (all unconditional; kernel/excess identities, Lemma GT,
 * Lemma TS, Lemma DG, Corollary DM, Lemma MS, Lemma QF, Lemma OG,
 * Lemma HT, Lemma DL, Lemma PP, Lemma RD, Corollary PF, and the adaptive
 * shifted-Collatz-Wielandt certificate technology carried verbatim from
 * imp-95132/95134/95136/95137/95138/95139).
 *
 * NEW COROLLARY PH (hybrid split probe). Fix the probe depth t in {1, 2}
 * on the block-2 -> block-4 bond (foot Q = 8 - t, clamp D + t = 8 + t,
 * psi ramp top pinned at V = 16 by Lemma PP). Split the BOND, not the
 * tilted norm: with S = B1_{<= Q} and R = B1_{> Q},
 *   <B1, C2> = <S, C2> + <R, C2>   (exact bilinearity of the Gram form).
 * (i) <S, C2> <= e^{-mu (8 + t)} norm(S e^{phi_t}) norm(C2 e^{psi_t})
 *     by the Lemma PP identity + Cauchy-Schwarz; S sits ENTIRELY behind
 *     the foot, so Lemma DL applies with the SAME depth staircase as
 *     Corollary PF (for s > 0 the mass deeper than s below the foot is
 *     exactly the deep mass of B1, so the alpha-coupled profile bounds
 *     carry unchanged), and norm(S)^2 <= (1 - x1b^2) norm(B1)^2 for t = 2
 *     (Gram cross positivity; <= norm(B1)^2 for t = 1); the C2 side keeps
 *     the clamp-general Lemma TS budget qc.
 * (ii) <R, C2> <= min( g(8 mu), z2b g(8 mu) + m2 g(12 mu) + x2 g(16 mu) )
 *     norm(R) norm(C2) with norm(R) <= x1b norm(B1): R is supported in
 *     (Q, 8) and C2 in [16, 32), facing-edge gap >= 8, so the SHARP
 *     imp-95134 cluster cap applies at gap 8 - and the carried 3-piece
 *     Lemma MS row applies at gaps 8/12/16 (BOTH are kept: the ridge
 *     parks z2b = 0.75 where the MS row alone evaluates to 0.4501 ABOVE
 *     the sharp cap 0.4169 - pricing by the row alone was measured to
 *     gain ZERO; see the skeptical record).
 * Hence rho12 <= e^{-(8+t) mu} sqrt((1 + Z)(1 - [t = 2] x1b^2)
 *   - 2 mu Z I_t) sqrt(1 + Z qc) + x1b min(g(8 mu), MS row), Z = (8+t) mu.
 * QED (corollary; every ingredient is a carried lemma - the only new move
 * is splitting the bilinear form BEFORE tilting instead of splitting the
 * tilted norm by the triangle inequality).
 *
 * WHY THIS APPROACHES THE LEG. Corollary PF charges the in-ramp fraction
 * x1b at e^{-8 mu} sqrt(1 + 8 mu) sqrt(1 + Z qc) = 0.4501 (mu = 0.24502,
 * qc = 1): the triangle split forces the in-ramp mass through the SAME
 * Cauchy-Schwarz pairing as the sub-foot mass, so it inherits the
 * neighbor-side enhancement sqrt(1 + Z qc). Corollary PH charges it at
 * its true extremal correlation g(8 mu) = 0.4169, SHARP at the
 * all-in-ramp corner (x1b = 1 reproduces g(8 mu) exactly; a single
 * rate-mu packet at position 8^- against the block-4 edge attains it in
 * the limit). NEITHER form dominates: at qc = 0 the PF penalty
 * coefficient chat(8 mu) = 0.2423 is SMALLER than g(8 mu), so both stay
 * in the entrywise minimum (same pattern as the 2-piece vs 3-piece MS
 * forms).
 *
 * SPECTRAL CONSUMPTION: identical imp-95139 six-parameter frame
 * (alpha, x1, x1b, gamma, z2, z2b), joint two-level Lemma DL staircase
 * feasibility charges, entries = entrywise minima of the carried plain /
 * tilt / TS / 2-piece MS / 3-piece MS / probe forms PLUS the two hybrid
 * forms (t = 1, 2). Odd parity: SEPARATE parameter-free plain-cap sweep
 * at the exactly-doubled odd gaps (Lemma OG), bound 0.7506 << 1. Tail:
 * Lemma HT rows as in imp-95139.
 *
 * ADAPTIVE GRID CERTIFICATE (mu = 12251/50000; library-free through
 * U = 0.7826888843086433 >= e^{-mu} (N = 20 even truncation + 1e-12) and
 * its N = 19 lower truncation, IEEE-sqrt half/quarter powers with
 * explicit slacks; upper bounds weaken constraints, lower bounds weaken
 * subtracted charges). Worklist over the 6-cube from the 2^6 partition,
 * per-term corner matrices, shifted Collatz-Wielandt, widest-axis
 * splitting. RESULT: terminates with ZERO unresolved cells (10406330
 * cells, deepest binary depth 55), certified head max
 * 0.9999999998894589, remainder 9.30330734054099e-12, total < 1 - 1e-10.
 * Hence lamMax(R) < 1 for every parity-pure witness with rates
 * >= 12251/50000, and E <= 0 by Lemma QF. QED (theorem, not the leg).
 *
 * MEASURED COLOR (float, not certified). New frame root ~0.24493
 * (supScan bracket asserted below: 1.00006474780072 > 1 at mu = 0.2449
 * > 0.9999693927326598 at mu = 0.24495), moved from ~0.24496. At the
 * certified constant the hybrid frame sup is 0.9998359643731185 vs the
 * imp-95139 frame sup 0.999894109302256 (margin 1.06e-4 -> 1.64e-4).
 * HONEST ATTRIBUTION: 12251/50000 lies ABOVE the imp-95139 frame root
 * ~0.24496, so the old frame could reach this constant in exact
 * arithmetic; certification is where it fails - the old-frame adaptive
 * certificate at 12251/50000 was ATTEMPTED and EXHAUSTS its worklist with
 * 4792158 cells UNRESOLVED at the carried depth-60 cap (40851114 cells
 * total; its 1.06e-4 margin sits below the 6D per-term-corner slack
 * floor), while the hybrid frame terminates with zero unresolved at
 * 10.4M cells and depth 55. The gain is therefore JOINT: the new
 * form buys the margin (1.06e-4 -> 1.64e-4) that makes the constant
 * certifiable. HONEST CERTIFICATION FLOOR: 49/200 = 0.245 remains
 * infeasible EVEN WITH the hybrid form (float margin 1.26e-4, up from
 * 6.8e-5 in imp-95139; 13086962 unresolved cells at an 80M-cell budget,
 * improved from 40M unresolved at 120M without it) - the floor moved,
 * the constant did not clear it.
 *
 * SLACK DIAGNOSIS (what survives). The surviving float interval
 * [0.2321 (imp-95135 witness saturation), ~0.24493 (new frame root)] is
 * DISPLACEMENT CREDIT: Corollary PH still credits the sub-foot piece
 * only QUADRATICALLY (norm(S)^2 <= (1 - x1b^2) norm(B1)^2), because the
 * Gram cross term <S, R> admits NO frame lower bound - free rates let
 * the adversary decorrelate the pieces, so the linear credit for the
 * sub-foot correlation that the in-ramp fraction DISPLACES cannot be
 * collected. NEW named handle imp-95140-subgap-displacement-credit:
 * either a rate-aware lower bound on <S, R> through the same block
 * geometry (packets in a width-4 block at separation <= 4 cannot be
 * Gram-orthogonal at bounded rate ratios), or the exact four-region
 * in-ramp tilted pair excess (the route the parent leg already names).
 *
 * WHAT THIS NARROWS AND WHAT IT DOES NOT.
 * (1) imp-95139-subgap-ramp-interior-linearization NARROWED, not closed:
 *     the in-ramp LINEAR COEFFICIENT is now sharp at the binding (qc = 1)
 *     ridge; the linear-vs-quadratic structure itself survives in the
 *     displacement-credit form (imp-95140-subgap-displacement-credit).
 * (2) THEOREM PD (4901/20000) superseded at the constant level. THEOREM
 *     WE untouched and consistent (23/100 < 12251/50000;
 *     E(12251/50000) < 0 at the witness).
 * (3) imp-95131-subgap-rate-to-phi-pricing upgraded: forced
 *     mu_min < 12251/50000 over the full parity-pure class.
 * (4) Parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 *
 * HONEST LIMITS. (a) Model-family constants, not the paper Section 4.5
 * packets. (b) 12251/50000 is the certified constant, not the sharp
 * class threshold (sandwich [0.23, 0.24502]; float landmarks 0.2321 and
 * ~0.24493 measured only). (c) Parity-pure only. (d) The constant lies
 * above the OLD frame root: the lemma buys certification margin, not
 * frame reach - stated plainly above. (e) Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD (in-run refutations preserved so
 * successors do not repeat them). (1) Pricing <R, C2> by the 3-piece MS
 * row ALONE was measured to gain ZERO: the certificate ridge relocates
 * to z2b = 0.75 where the row evaluates to 0.4501 > g(8 mu) = 0.4169 -
 * the plain sharp cap MUST enter the minimum. (2) Lemma DL staircases on
 * the qR1/qL2 TILT RATIOS (two-sided depth-profile pricing of the TS
 * budgets through the frame fractions) were derived - they are sound and
 * carried-machinery - and MEASURED: the adversary relocates z2b -> 1 and
 * the sup at mu = 0.245 improves only 0.9999322000696287 ->
 * 0.9999321761731788 (2.4e-8); REFUTED as a closing lever, NOT consumed
 * here. (3) The exact-cross-expansion route (norm(B1 e^phi)^2 expanded
 * with the Gram identity 2<S, R> = norm(B1)^2 - norm(S)^2 - norm(R)^2
 * plus separation-aware caps on the tilted cross term) was analyzed and
 * REFUTED: the identity regenerates the linear x1b coefficient at
 * (1 + Z)(e^{2 mu t} - 1) C_sep / sqrt(qt) with C_sep ~ 1, because the
 * sharp cluster cap g(mu sigma) is ~0.97 at unit separation - too flat
 * to price near-foot cross mass below Cauchy-Schwarz. (4) Sharpness
 * anchors (asserted below): at x1b = 0 the hybrid form EQUALS the
 * Corollary PF main term (0.2220288465879442, strictly between
 * g(12 mu) = 0.2082536721245022 and the previously binding tilt form
 * 0.2737200538612934); at x1b = 1 (t = 2) it equals g(8 mu) =
 * 0.41689675445636454 EXACTLY (sharp corner) while Corollary PF gives
 * 0.45008346333118127. (5) Non-domination verified: at qc = 0 the PF
 * form is strictly below the hybrid at the same corner - both retained.
 *
 * Import-light (no heavy bundle, no imports). The numerics cross-check
 * the theorem; the theorem is the displayed corollary + carried chain.
 */

// exact sibling Gram kernel (identical to imp-95130..95139)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// exact per-pair gap-capped tilt excess (imp-95134 Lemma GT identity)
function excessPair(mi, mj, di, dj, mu, D) {
  const s = mi + mj;
  const y = s - 2 * mu;
  const h = Math.exp(-(mi * di + mj * dj));
  const f = y < 1e-12 * s ? D : (1 - Math.exp(-y * D)) / y;
  return h * ((2 * mu) / s) * f;
}

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

const MU_HS = 12251 / 50000; // certified threshold 0.24502
const U_HS = expTrunc(MU_HS, 20) + 1e-12; // >= exp(-mu)
const L_HS = expTrunc(MU_HS, 19) - 1e-12; // <= exp(-mu)

// ---- certified adaptive grid certificate at mu = 12251/50000 ----
const SQ = (x) => Math.sqrt(Math.max(0, x)) * (1 + 1e-12);
const SQL = (x) => Math.sqrt(Math.max(0, x)) * (1 - 1e-12);
const UPOW = new Float64Array(129);
const LPOW = new Float64Array(129);
UPOW[0] = 1;
LPOW[0] = 1;
for (let d = 1; d <= 128; d++) {
  UPOW[d] = UPOW[d - 1] * U_HS;
  LPOW[d] = LPOW[d - 1] * L_HS;
}
const Uh = SQ(U_HS);
const Uq = SQ(Uh);
const Lh = SQL(L_HS);
const Lq = SQL(Lh);
function upowH(twoS) {
  const i = Math.floor(twoS);
  let r = UPOW[i];
  const f = twoS - i;
  if (Math.abs(f - 0.5) < 1e-9) r *= Uh;
  else if (Math.abs(f - 0.25) < 1e-9) r *= Uq;
  return r;
}
function lpowH(twoS) {
  const i = Math.floor(twoS);
  let r = LPOW[i];
  const f = twoS - i;
  if (Math.abs(f - 0.5) < 1e-9) r *= Lh;
  else if (Math.abs(f - 0.25) < 1e-9) r *= Lq;
  return r;
}
const gUc = (D) => (1 + MU_HS * D) * UPOW[D]; // >= g(mu D), integer D
const tiltUc = (D, q) =>
  SQ(1 + MU_HS * D) * SQ(1 + MU_HS * D * Math.min(1, Math.max(0, q))) * UPOW[D];
const E1C = UPOW[8]; // >= e^{-8 mu}
const E2C = UPOW[32]; // >= e^{-32 mu}
const EFAC = UPOW[2]; // >= e^{-2 mu}
const EFGC = UPOW[16]; // >= e^{-16 mu}
const CA_LB = Math.max(0, LPOW[2] - UPOW[4]); // <= e^{-2mu} - e^{-4mu}
const CG_LB = Math.max(0, LPOW[16] - UPOW[24]); // <= e^{-16mu} - e^{-24mu}

// certified probe staircases (carried imp-95139 rungs):
// [2*s0, 2*s1, 2*dq, fracKind] with fracKind 0: cap x1^2, 1: cap x1b^2,
// 2: DM-from-alpha only
const RUNGS_T2 = [
  [0, 1, 3, 0],
  [1, 2, 2, 0],
  [2, 3, 1, 2],
  [3, 3.5, 0.5, 2],
  [3.5, 4, 0.25, 2],
];
const RUNGS_T1 = [
  [0, 1, 5, 1],
  [1, 2, 4, 1],
  [2, 3, 3, 0],
  [3, 4, 2, 0],
  [4, 5, 1, 2],
  [5, 5.5, 0.5, 2],
  [5.5, 6, 0.25, 2],
];
function stairICert(a0, x1hi, x1bHi, rungs) {
  const rem = Math.max(0, 1 - a0);
  let I = 0;
  for (let k = 0; k < rungs.length; k++) {
    const t0 = rungs[k][0];
    const t1 = rungs[k][1];
    const tdq = rungs[k][2];
    const fk = rungs[k][3];
    const w = Math.max(0, (lpowH(t0) - upowH(t1)) / (2 * MU_HS));
    const den = 1 - upowH(tdq);
    let R = den > 0 ? rem / den : 1;
    if (fk === 0) R = Math.min(R, x1hi * x1hi);
    if (fk === 1) R = Math.min(R, x1bHi * x1bHi);
    R = Math.min(1, R);
    const u = 1 - SQ(R);
    if (u > 0) I += w * u * u;
  }
  return I * (1 - 1e-9);
}
// carried Corollary PF certified form (triangle split, imp-95139)
function probeCert(t, rungs, a0, x1hi, x1bLo, x1bHi, g0) {
  const Z = (8 + t) * MU_HS;
  const I = stairICert(a0, x1hi, x1bHi, rungs);
  let qt = (1 + Z) * (1 - (t === 2 ? x1bLo * x1bLo : 0)) - 2 * MU_HS * Z * I;
  if (qt < 0) qt = 0;
  const pen = x1bHi * (1 / LPOW[t]) * (1 + 1e-12) * SQ(1 + 8 * MU_HS);
  const qc = Math.min(1, 1 + E2C - g0);
  return UPOW[8 + t] * (SQ(qt) + pen) * SQ(1 + Z * qc) * (1 + 1e-9);
}
// NEW Corollary PH certified form (hybrid split): exact bilinear split at
// the foot; probe main term on the sub-foot piece, min(sharp cap, 3-piece
// MS row) on the in-ramp piece
function probeHybCert(t, rungs, a0, x1hi, x1bLo, x1bHi, g0, rowCap) {
  const Z = (8 + t) * MU_HS;
  const I = stairICert(a0, x1hi, x1bHi, rungs);
  let qt = (1 + Z) * (1 - (t === 2 ? x1bLo * x1bLo : 0)) - 2 * MU_HS * Z * I;
  if (qt < 0) qt = 0;
  const qc = Math.min(1, 1 + E2C - g0);
  return (UPOW[8 + t] * SQ(qt) * SQ(1 + Z * qc) + x1bHi * rowCap) * (1 + 1e-9);
}

// shifted Collatz-Wielandt (imp-95138 technology)
function cwShifted(C01, C02, C03, C12, C13, C23, iters) {
  let z0 = 1;
  let z1 = 1;
  let z2 = 1;
  let z3 = 1;
  for (let it = 0; it < iters; it++) {
    const w0 = z0 + C01 * z1 + C02 * z2 + C03 * z3;
    const w1 = C01 * z0 + z1 + C12 * z2 + C13 * z3;
    const w2 = C02 * z0 + C12 * z1 + z2 + C23 * z3;
    const w3 = C03 * z0 + C13 * z1 + C23 * z2 + z3;
    const m = Math.max(w0, w1, w2, w3);
    z0 = w0 / m + 1e-300;
    z1 = w1 / m + 1e-300;
    z2 = w2 / m + 1e-300;
    z3 = w3 / m + 1e-300;
  }
  const w0 = z0 + C01 * z1 + C02 * z2 + C03 * z3;
  const w1 = C01 * z0 + z1 + C12 * z2 + C13 * z3;
  const w2 = C02 * z0 + C12 * z1 + z2 + C23 * z3;
  const w3 = C03 * z0 + C13 * z1 + C23 * z2 + z3;
  return Math.max(w0 / z0, w1 / z1, w2 / z2, w3 / z3) * (1 + 1e-9) - 1;
}

// per-cell entrywise-max certified matrix and CW bound; -1 = infeasible cell
function cellBoundHS(a0, a1, u0, u1, ub0, ub1, g0, g1, w0, w1, wb0, wb1) {
  if (ub0 > u1 || wb0 > w1) return -1;
  const alCap = 1 - (1 - EFAC) * u0 * u0 - CA_LB * ub0 * ub0;
  if (alCap < a0) return -1;
  const gaCap = 1 - (1 - EFGC) * w0 * w0 - CG_LB * wb0 * wb0;
  if (gaCap < g0) return -1;
  const alBar = Math.min(a1, alCap);
  const gaBar = Math.min(g1, gaCap);
  const z1 = SQ(1 - u0 * u0);
  const m1 = SQ(u1 * u1 - ub0 * ub0);
  const x1b = ub1;
  const x2 = SQ(1 - w0 * w0);
  const m2 = SQ(w1 * w1 - wb0 * wb0);
  const z2b = wb1;
  const qR1 = Math.min(1, 1 + E1C - a0);
  const qL2 = Math.min(1, 1 + E2C - g0);
  const C01 = Math.min(
    gUc(2),
    tiltUc(2, alBar),
    z1 * gUc(2) + u1 * gUc(3),
    z1 * gUc(2) + m1 * gUc(3) + x1b * gUc(4),
  );
  const rowCap = Math.min(gUc(8), z2b * gUc(8) + m2 * gUc(12) + x2 * gUc(16));
  const C12 = Math.min(
    gUc(8),
    tiltUc(8, qR1),
    tiltUc(8, qL2),
    z1 * w1 * gUc(11) + z1 * x2 * gUc(19) + u1 * w1 * gUc(8) + u1 * x2 * gUc(16),
    z1 * (z2b * gUc(11) + m2 * gUc(15) + x2 * gUc(19)) +
      m1 * (z2b * gUc(10) + m2 * gUc(14) + x2 * gUc(18)) +
      x1b * (z2b * gUc(8) + m2 * gUc(12) + x2 * gUc(16)),
    probeCert(2, RUNGS_T2, a0, u1, ub0, ub1, g0),
    probeCert(1, RUNGS_T1, a0, u1, ub0, ub1, g0),
    probeHybCert(2, RUNGS_T2, a0, u1, ub0, ub1, g0, rowCap),
    probeHybCert(1, RUNGS_T1, a0, u1, ub0, ub1, g0, rowCap),
  );
  const C13 = Math.min(
    gUc(56),
    tiltUc(56, qR1),
    z1 * gUc(59) + u1 * gUc(56),
    z1 * gUc(59) + m1 * gUc(58) + x1b * gUc(56),
  );
  const C02 = Math.min(
    gUc(14),
    tiltUc(14, qL2),
    w1 * gUc(14) + x2 * gUc(22),
    z2b * gUc(14) + m2 * gUc(18) + x2 * gUc(22),
  );
  const C23 = Math.min(
    gUc(32),
    tiltUc(32, gaBar),
    w1 * gUc(40) + x2 * gUc(32),
    z2b * gUc(44) + m2 * gUc(40) + x2 * gUc(32),
  );
  return cwShifted(C01, C02, gUc(62), C12, C13, C23, 60);
}

const REMAINDER_HS = 12 * (1 + 128 * MU_HS) * UPOW[128]; // Lemma HT, even rows
const REM_ODD_HS = 12 * (1 + 256 * MU_HS) * UPOW[128] * UPOW[128]; // odd rows
const THRESH_HS = 1 - 1e-10 - REMAINDER_HS;

function runAdaptiveCertificateHS() {
  const stack = [];
  for (let a = 0; a < 2; a++)
    for (let b = 0; b < 2; b++)
      for (let c = 0; c < 2; c++)
        for (let d = 0; d < 2; d++)
          for (let e = 0; e < 2; e++)
            for (let f = 0; f < 2; f++)
              stack.push([
                a / 2, (a + 1) / 2, b / 2, (b + 1) / 2, c / 2, (c + 1) / 2,
                d / 2, (d + 1) / 2, e / 2, (e + 1) / 2, f / 2, (f + 1) / 2, 0,
              ]);
  let cells = 0;
  let maxOK = -Infinity;
  let failed = 0;
  let deepest = 0;
  while (stack.length) {
    const cell = stack.pop();
    cells++;
    const b = cellBoundHS(
      cell[0], cell[1], cell[2], cell[3], cell[4], cell[5],
      cell[6], cell[7], cell[8], cell[9], cell[10], cell[11],
    );
    const d = cell[12];
    if (b < THRESH_HS) {
      if (b > maxOK) maxOK = b;
      if (d > deepest) deepest = d;
      continue;
    }
    if (d >= 60) {
      failed++;
      continue;
    }
    const ws = [
      cell[1] - cell[0], cell[3] - cell[2], cell[5] - cell[4],
      cell[7] - cell[6], cell[9] - cell[8], cell[11] - cell[10],
    ];
    let ax = 0;
    for (let k = 1; k < 6; k++) if (ws[k] > ws[ax]) ax = k;
    const o = 2 * ax;
    const m = (cell[o] + cell[o + 1]) / 2;
    const c1 = cell.slice();
    const c2 = cell.slice();
    c1[o + 1] = m;
    c2[o] = m;
    c1[12] = d + 1;
    c2[12] = d + 1;
    stack.push(c1, c2);
  }
  return { cells, maxOK, failed, deepest };
}

// odd-parity sweep: parameter-free plain caps at the exactly-doubled gaps
const ODD_CW_HS = cwShifted(gUc(4), gUc(28), gUc(124), gUc(16), gUc(112), gUc(64), 60);

// ---- float (measured-only) frame with and without the hybrid forms ----
const g = (z) => Math.exp(-z) * (1 + z);
const chat = (z) => Math.exp(-z) * Math.sqrt(1 + z);
function stairIFloat(mu, sp, al, rungs) {
  const rem = Math.max(0, 1 - al);
  let I = 0;
  for (let k = 0; k < rungs.length; k++) {
    const w = (Math.exp(-2 * mu * sp * rungs[k][0]) - Math.exp(-2 * mu * sp * rungs[k][1])) / (2 * mu);
    const dm = rem / (1 - Math.exp(-2 * mu * sp * rungs[k][2]));
    const R = Math.min(1, rungs[k][3], dm);
    const u = 1 - Math.sqrt(R);
    I += w * (u > 0 ? u * u : 0);
  }
  return I;
}
function probeFloat(mu, sp, t, al, x1b, ga, rungs) {
  const Z = (8 + t) * mu * sp;
  const e2 = Math.exp(-32 * mu * sp);
  const qL2c = Math.min(1, Math.max(0, 1 + e2 - ga));
  const I = stairIFloat(mu, sp, al, rungs);
  let qt = (1 + Z) * (t === 2 ? 1 - x1b * x1b : 1) - 2 * mu * Z * I;
  if (qt < 0) qt = 0;
  const pen = x1b * Math.exp(t * mu * sp) * Math.sqrt(1 + 8 * mu * sp);
  return Math.exp(-Z) * (Math.sqrt(qt) + pen) * Math.sqrt(1 + Z * qL2c);
}
function probeHybridFloat(mu, sp, t, al, x1b, ga, rungs, z2, z2b) {
  const Z = (8 + t) * mu * sp;
  const e2 = Math.exp(-32 * mu * sp);
  const qL2c = Math.min(1, Math.max(0, 1 + e2 - ga));
  const I = stairIFloat(mu, sp, al, rungs);
  let qt = (1 + Z) * (t === 2 ? 1 - x1b * x1b : 1) - 2 * mu * Z * I;
  if (qt < 0) qt = 0;
  const G = (d) => g(mu * d * sp);
  const m2 = Math.sqrt(Math.max(0, z2 * z2 - z2b * z2b));
  const x2 = Math.sqrt(Math.max(0, 1 - z2 * z2));
  const row = Math.min(G(8), z2b * G(8) + m2 * G(12) + x2 * G(16));
  return Math.exp(-Z) * Math.sqrt(qt) * Math.sqrt(1 + Z * qL2c) + x1b * row;
}
const rungsT2f = (x1) => [
  [0, 0.5, 1.5, x1 * x1], [0.5, 1, 1, x1 * x1], [1, 1.5, 0.5, 1],
  [1.5, 1.75, 0.25, 1], [1.75, 2, 0.125, 1],
];
const rungsT1f = (x1, x1b) => [
  [0, 0.5, 2.5, x1b * x1b], [0.5, 1, 2, x1b * x1b], [1, 1.5, 1.5, x1 * x1],
  [1.5, 2, 1, x1 * x1], [2, 2.5, 0.5, 1], [2.5, 2.75, 0.25, 1], [2.75, 3, 0.125, 1],
];
function entriesFloat(mu, sp, al, x1, x1b, ga, z2, z2b, withHybrid) {
  const z1 = Math.sqrt(Math.max(0, 1 - x1 * x1));
  const m1 = Math.sqrt(Math.max(0, x1 * x1 - x1b * x1b));
  const x2 = Math.sqrt(Math.max(0, 1 - z2 * z2));
  const m2 = Math.sqrt(Math.max(0, z2 * z2 - z2b * z2b));
  const e1 = Math.exp(-8 * mu * sp);
  const e2 = Math.exp(-32 * mu * sp);
  const tilt = (D, q) =>
    chat(mu * D * sp) * Math.sqrt(1 + mu * D * sp * Math.min(1, Math.max(0, q)));
  const G = (d) => g(mu * d * sp);
  const qR1 = Math.min(1, 1 + e1 - al);
  const qL2 = Math.min(1, 1 + e2 - ga);
  const p2 = probeFloat(mu, sp, 2, al, x1b, ga, rungsT2f(x1));
  const p1 = probeFloat(mu, sp, 1, al, x1b, ga, rungsT1f(x1, x1b));
  const C01 = Math.min(G(2), tilt(2, al), z1 * G(2) + x1 * G(3), z1 * G(2) + m1 * G(3) + x1b * G(4));
  let C12 = Math.min(
    G(8), tilt(8, qR1), tilt(8, qL2),
    z1 * z2 * G(11) + z1 * x2 * G(19) + x1 * z2 * G(8) + x1 * x2 * G(16),
    z1 * (z2b * G(11) + m2 * G(15) + x2 * G(19)) +
      m1 * (z2b * G(10) + m2 * G(14) + x2 * G(18)) +
      x1b * (z2b * G(8) + m2 * G(12) + x2 * G(16)),
    p2, p1,
  );
  if (withHybrid) {
    const h2 = probeHybridFloat(mu, sp, 2, al, x1b, ga, rungsT2f(x1), z2, z2b);
    const h1 = probeHybridFloat(mu, sp, 1, al, x1b, ga, rungsT1f(x1, x1b), z2, z2b);
    C12 = Math.min(C12, h2, h1);
  }
  const C13 = Math.min(G(56), tilt(56, qR1), z1 * G(59) + x1 * G(56), z1 * G(59) + m1 * G(58) + x1b * G(56));
  const C02 = Math.min(G(14), tilt(14, qL2), z2 * G(14) + x2 * G(22), z2b * G(14) + m2 * G(18) + x2 * G(22));
  const C23 = Math.min(G(32), tilt(32, ga), z2 * G(40) + x2 * G(32), z2b * G(44) + m2 * G(40) + x2 * G(32));
  return [C01, C02, G(62), C12, C13, C23];
}
function lamFloatHS(mu, al, x1, x1b, ga, z2, z2b, withHybrid) {
  const en = entriesFloat(mu, 1, al, x1, x1b, ga, z2, z2b, withHybrid);
  const C = [
    [0, en[0], en[1], en[2]],
    [en[0], 0, en[3], en[4]],
    [en[1], en[3], 0, en[5]],
    [en[2], en[4], en[5], 0],
  ];
  let v = [0.5, 0.5, 0.5, 0.5];
  let lam = 0;
  for (let it = 0; it < 100; it++) {
    const w = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      w[i] += v[i];
      for (let j = 0; j < 4; j++) w[i] += C[i][j] * v[j];
    }
    const nn = Math.sqrt(w.reduce((s, x) => s + x * x, 0));
    if (nn === 0) return 0;
    lam = nn;
    v = w.map((x) => x / nn);
  }
  return lam - 1;
}
function supScanHS(mu, n, nf, withHybrid) {
  const eA = Math.exp(-2 * mu);
  const eA2 = Math.exp(-4 * mu);
  const eG = Math.exp(-16 * mu);
  const eG2 = Math.exp(-24 * mu);
  let best = -Infinity;
  for (let i = 0; i <= n; i++) {
    const x1 = i / n;
    for (let ib = 0; ib <= nf; ib++) {
      const x1b = (ib / nf) * x1;
      for (let j = 0; j <= n; j++) {
        const z2 = j / n;
        for (let jb = 0; jb <= nf; jb++) {
          const z2b = (jb / nf) * z2;
          const alC = 1 - (1 - eA) * x1 * x1 - (eA - eA2) * x1b * x1b;
          const gaC = 1 - (1 - eG) * z2 * z2 - (eG - eG2) * z2b * z2b;
          for (let a = 0; a <= 4; a++) {
            for (let c = 0; c <= 4; c++) {
              const l = lamFloatHS(mu, (alC * a) / 4, x1, x1b, (gaC * c) / 4, z2, z2b, withHybrid);
              if (l > best) best = l;
            }
          }
        }
      }
    }
  }
  return best;
}

// ---- seeded batteries (deterministic LCG, per-battery reseed) ----
let seedState = 0;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}
function mkClusterAt(lo, hi, mu, rateMax, nMax, bias) {
  const n = 1 + Math.floor(rnd() * nMax);
  const us = [];
  const as = [];
  const ms = [];
  for (let i = 0; i < n; i++) {
    let frac = rnd();
    if (bias === "lo") frac = rnd() * rnd() * rnd();
    if (bias === "hi") frac = 1 - rnd() * rnd() * rnd();
    if (bias === "split") frac = rnd() < 0.5 ? rnd() * rnd() * rnd() : 1 - rnd() * rnd() * rnd();
    us.push(lo + frac * (hi - lo));
    as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
    ms.push(mu * Math.pow(rateMax, rnd() * rnd()));
  }
  return { us, as, ms };
}
function gram(c1, c2) {
  let s = 0;
  for (let i = 0; i < c1.us.length; i++) {
    for (let j = 0; j < c2.us.length; j++) {
      s += c1.as[i] * c2.as[j] * kernelK(c1.ms[i], c2.ms[j], Math.abs(c1.us[i] - c2.us[j]));
    }
  }
  return s;
}
function subCluster(c, keep) {
  const us = [];
  const as = [];
  const ms = [];
  for (let i = 0; i < c.us.length; i++) {
    if (keep(c.us[i])) {
      us.push(c.us[i]);
      as.push(c.as[i]);
      ms.push(c.ms[i]);
    }
  }
  return { us, as, ms };
}
function tiltExcess(c, edge, side, mu, D) {
  let s = 0;
  for (let i = 0; i < c.us.length; i++) {
    for (let j = 0; j < c.us.length; j++) {
      const di = side === "L" ? c.us[i] - edge : edge - c.us[i];
      const dj = side === "L" ? c.us[j] - edge : edge - c.us[j];
      s += c.as[i] * c.as[j] * excessPair(c.ms[i], c.ms[j], di, dj, mu, D);
    }
  }
  return s;
}

// battery H (seed 909091): Corollary PH approach, BOTH parities, at the
// witnesses ACTUAL parameters: hybrid forms, the exact bilinear split
// identity at both feet, and the in-ramp piece row cap
function runHybridBattery() {
  seedState = 909091;
  let violH = 0;
  let violSplit = 0;
  let violRow = 0;
  let worstH2 = -Infinity;
  let worstH1 = -Infinity;
  let count = 0;
  for (let t = 0; t < 1600; t++) {
    const parity = t % 2;
    const sp = parity === 1 ? 2 : 1;
    const bs = [0, 2, 4, 6].map((b) => b + parity);
    const clusters = bs.map((b, idx) =>
      mkClusterAt(2 ** b, 2 ** (b + 1), MU_HS, 100, 4, ["lo", "hi", "split", "none"][(t + idx) % 4]),
    );
    const norms = clusters.map((c) => gram(c, c));
    if (norms.some((n) => n < 1e-280)) continue;
    const c1 = clusters[1];
    const c2 = clusters[2];
    const al = tiltExcess(c1, 2 ** bs[1], "L", MU_HS, 2 * sp) / (MU_HS * 2 * sp * norms[1]);
    const ga = tiltExcess(c2, 2 ** (bs[2] + 1), "R", MU_HS, 32 * sp) / (MU_HS * 32 * sp * norms[2]);
    const frac = (c, keep, n) => {
      const p = subCluster(c, keep);
      return p.us.length ? Math.sqrt(gram(p, p) / n) : 0;
    };
    const x1 = frac(c1, (u) => u > 5 * sp, norms[1]);
    const x1b = frac(c1, (u) => u > 6 * sp, norms[1]);
    const z2 = frac(c2, (u) => u <= 24 * sp, norms[2]);
    const z2b = frac(c2, (u) => u <= 20 * sp, norms[2]);
    const rho12 = gram(c1, c2) / Math.sqrt(norms[1] * norms[2]);
    for (const tt of [1, 2]) {
      const foot = (8 - tt) * sp;
      const S = subCluster(c1, (u) => u <= foot);
      const R = subCluster(c1, (u) => u > foot);
      const gS = S.us.length ? gram(S, c2) : 0;
      const gR = R.us.length ? gram(R, c2) : 0;
      const tot = gram(c1, c2);
      if (Math.abs(gS + gR - tot) > 1e-9 * Math.max(1e-280, Math.abs(tot))) violSplit++;
      if (R.us.length) {
        const nR = Math.sqrt(gram(R, R));
        const m2v = Math.sqrt(Math.max(0, z2 * z2 - z2b * z2b));
        const x2v = Math.sqrt(Math.max(0, 1 - z2 * z2));
        const row = Math.min(
          g(8 * MU_HS * sp),
          z2b * g(8 * MU_HS * sp) + m2v * g(12 * MU_HS * sp) + x2v * g(16 * MU_HS * sp),
        );
        if (gR > row * nR * Math.sqrt(norms[2]) * (1 + 1e-9)) violRow++;
      }
    }
    const h2 = probeHybridFloat(MU_HS, sp, 2, al, x1b, ga, rungsT2f(x1), z2, z2b);
    const h1 = probeHybridFloat(MU_HS, sp, 1, al, x1b, ga, rungsT1f(x1, x1b), z2, z2b);
    if (rho12 > h2 * (1 + 1e-9)) violH++;
    if (rho12 > h1 * (1 + 1e-9)) violH++;
    if (rho12 / h2 > worstH2) worstH2 = rho12 / h2;
    if (rho12 / h1 > worstH1) worstH1 = rho12 / h1;
    count++;
  }
  return { violH, violSplit, violRow, worstH2, worstH1, count };
}

// battery W (seed 606061): THEOREM HS direct approach at rates >= 12251/50000
function runTheoremBatteryHS() {
  seedState = 606061;
  let maxE = -Infinity;
  let viol = 0;
  for (let t = 0; t < 6000; t++) {
    const parity = t % 2;
    const nbk = 2 + Math.floor(rnd() * 4);
    const bs = [];
    while (bs.length < nbk) {
      const b = parity + 2 * Math.floor(rnd() * 10);
      if (!bs.includes(b)) bs.push(b);
    }
    bs.sort((x, y) => x - y);
    const clusters = bs.map((b) => {
      const m = 1 + Math.floor(rnd() * 5);
      const us = [];
      const as = [];
      const mus = [];
      const lo = 2 ** b;
      const hi = 2 ** (b + 1);
      const edge = t % 3 === 0;
      const at = rnd() < 0.5 ? "hi" : "lo";
      for (let i = 0; i < m; i++) {
        const fracp = edge ? rnd() * rnd() * rnd() : rnd();
        us.push(at === "hi" ? hi - fracp * (hi - lo) : lo + fracp * (hi - lo));
        as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
        mus.push(MU_HS * Math.pow(100, rnd() * rnd()));
      }
      return { us, as, ms: mus };
    });
    const norms = clusters.map((c) => gram(c, c));
    let E = -norms.reduce((x, y) => x + y, 0);
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) E += 2 * gram(clusters[i], clusters[j]);
    }
    if (E > maxE) maxE = E;
    if (E > 0) viol++;
  }
  return { maxE, viol };
}

// THEOREM WE witness (positions/amplitudes exactly as in imp-95135..95139)
const P_WE = 999983;
const K_WE = [499992, 249995, 62498];
const U_WE = K_WE.map((k) => P_WE / k);
const A_WE = [675, 685, 276];
function eWitnessWE(mu) {
  let E = -(A_WE[0] * A_WE[0] + A_WE[1] * A_WE[1] + A_WE[2] * A_WE[2]) / mu;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      E += 2 * A_WE[i] * A_WE[j] * kernelK(mu, mu, Math.abs(U_WE[i] - U_WE[j]));
    }
  }
  return E;
}

const CERT_HS = runAdaptiveCertificateHS();
const LAM_2449 = supScanHS(0.2449, 10, 4, true);
const LAM_24495 = supScanHS(0.24495, 10, 4, true);
const LAM_MU_BASE = supScanHS(MU_HS, 10, 4, false);
const LAM_MU_HYB = supScanHS(MU_HS, 10, 4, true);
const BAT_H = runHybridBattery();
const BAT_W = runTheoremBatteryHS();
// sharpness anchors at mu = 12251/50000, t = 2
const ANCHOR_HYB0 = probeHybridFloat(MU_HS, 1, 2, 1, 0, 0, rungsT2f(0), 1, 1);
const ANCHOR_PF0 = probeFloat(MU_HS, 1, 2, 1, 0, 0, rungsT2f(0));
const ANCHOR_HYB1 = probeHybridFloat(MU_HS, 1, 2, 1, 1, 0, rungsT2f(1), 1, 1);
const ANCHOR_PF1 = probeFloat(MU_HS, 1, 2, 1, 1, 0, rungsT2f(1));
const ANCHOR_G8 = g(8 * MU_HS);
const ANCHOR_G12 = g(12 * MU_HS);
const ANCHOR_TILT = chat(8 * MU_HS) * Math.sqrt(1 + 8 * MU_HS * Math.exp(-8 * MU_HS));
// non-domination corner: ga -> qc = 0 side handled via ga = 1 + e^{-32mu}
const GA_QC0 = 1 + Math.exp(-32 * MU_HS);
const ND_HYB = probeHybridFloat(MU_HS, 1, 2, 1, 1, GA_QC0, rungsT2f(1), 1, 1);
const ND_PF = probeFloat(MU_HS, 1, 2, 1, 1, GA_QC0, rungsT2f(1));

// baked literals (recomputed by the assertions)
const U_HS_LIT = 0.7826888843086433;
const REMAINDER_LIT = 9.30330734054099e-12;
const CERT_CELLS_LIT = 10406330;
const CERT_MAXOK_LIT = 0.9999999998894589;
const CERT_DEEPEST_LIT = 55;
const ODD_CW_LIT = 0.7505746854548871;
const LAM_2449_LIT = 1.00006474780072;
const LAM_24495_LIT = 0.9999693927326598;
const LAM_MU_BASE_LIT = 0.999894109302256;
const LAM_MU_HYB_LIT = 0.9998359643731185;
const BAT_H_WORST_H2_LIT = 0.7105060135250242;
const BAT_H_WORST_H1_LIT = 0.4346541717229754;
const BAT_H_COUNT_LIT = 1482;
const BAT_W_MAX_E_LIT = -0.036167673486760386;
const ANCHOR_HYB0_LIT = 0.2220288465879442;
const ANCHOR_G8_LIT = 0.41689675445636454;
const ANCHOR_G12_LIT = 0.2082536721245022;
const ANCHOR_TILT_LIT = 0.2737200538612934;
const ANCHOR_PF1_LIT = 0.45008346333118127;
const E_WE_23_LIT = 17796.715801475395;
const E_WE_HS_LIT = -100922.01008305361;

export const IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD = {
  ticket:
    "imp-95140 (THEOREM HS: hybrid split-bond cap, certified rate threshold 12251/50000 = 0.24502 over the FULL parity-pure MAJ witness class - E > 0 forces mu_min < 0.24502; NARROWS imp-95139-subgap-ramp-interior-linearization by replacing the L2 triangle split of Corollary PF with the EXACT bilinear split of the bond at the probe foot: the in-ramp mass is now priced at its sharp extremal correlation g(8 mu) instead of chat(8 mu) sqrt(1 + Z qc); certified sandwich [0.23, 0.24505] -> [0.23, 0.24502])",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95132 Lemma L2 cluster geometry, the imp-95134 exact excess identity + Lemma GT + sharp cluster cap, the imp-95136 Lemma QF spectral frame with Lemma OG and Lemma HT, the imp-95137 clamp-general Lemma TS budgets, the imp-95138 Lemma DG + Corollary DM + Lemma MS + adaptive certificate technology, and the imp-95139 Lemma DL + Lemma PP + Corollary PF probe machinery; directly progresses imp-95130-subgap-phi-conditional-odd-mass.",
  theoremHS:
    "Any parity-pure MAJ witness of the sibling-chain class with ANY number of packets per block and all rates mu_i >= 12251/50000 has E <= 0. Contrapositive: E > 0 forces mu_min < 12251/50000 = 0.24502 (supersedes THEOREM PD 4901/20000 = 0.24505 at the constant level). Proof chain: NEW Corollary PH (hybrid split probe - exact bilinear split of the bond at the probe foot, Lemma PP + Cauchy-Schwarz + Lemma DL on the sub-foot piece, min(sharp imp-95134 cluster cap at facing gap 8, 3-piece Lemma MS row) on the in-ramp piece) + carried DL/PP/PF/TS/MS/QF/OG/HT machinery + adaptive certificate: 10406330 cells, zero unresolved, head max 0.9999999998894589 + remainder 9.30330734054099e-12 < 1 - 1e-10; odd parity by the separate parameter-free plain-cap sweep (bound 0.7506).",
  corollaryPH:
    "Hybrid split probe: <B1, C2> = <B1_{<=Q}, C2> + <B1_{>Q}, C2> exactly (bilinearity), with Q = 8 - t the probe foot. The sub-foot term goes through the Lemma PP pairing, Cauchy-Schwarz, Lemma DL from the foot (same alpha-coupled staircase as Corollary PF; norm(S)^2 <= (1 - x1b^2) norm(B1)^2 at t = 2 by Gram cross positivity), and the clamp-general Lemma TS budget on the C2 side. The in-ramp term is capped by min(g(8 mu), z2b g(8 mu) + m2 g(12 mu) + x2 g(16 mu)) x1b: facing-edge gap >= 8 for B1_{>Q} against C2. The in-ramp penalty no longer inherits the neighbor-side enhancement sqrt(1 + Z qc) that the triangle split forced on it, and the form is SHARP at the all-in-ramp corner (x1b = 1 evaluates to exactly g(8 mu), attained in the single-packet limit). Neither PH nor PF dominates (at qc = 0 the PF coefficient chat(8 mu) is smaller) - both stay in the entrywise minimum.",
  thresholdSandwich:
    "Certified sharp-threshold sandwich for the full parity-pure class: [23/100, 12251/50000] = [0.23, 0.24502] (was [0.23, 0.24505]). Float landmarks (measured, NOT certified): witness chain saturation 0.2321 (imp-95135) and NEW frame root ~0.24493 (supScan bracket 1.00006474780072 > 1 at mu = 0.2449 > 0.9999693927326598 at mu = 0.24495), moved from ~0.24496.",
  honestAttribution:
    "12251/50000 lies ABOVE the imp-95139 frame root ~0.24496, so the previous frame reaches this constant in exact arithmetic; it fails at CERTIFICATION: the old-frame adaptive certificate at 12251/50000 was attempted and EXHAUSTS its worklist with 4792158 cells UNRESOLVED at the carried depth-60 cap (40851114 cells total; margin 1.06e-4 below the 6D per-term-corner slack floor), while the hybrid frame terminates with ZERO unresolved at 10406330 cells and depth 55 (margin 1.64e-4). The gain is JOINT lemma+certification: the new form buys the margin that makes the constant certifiable. HONEST CERTIFICATION FLOOR: 49/200 = 0.245 remains infeasible EVEN WITH the hybrid form (margin 1.26e-4, up from 6.8e-5; 13086962 unresolved cells at an 80M-cell budget, improved from 40M unresolved at a 120M budget without it).",
  slackDiagnosis:
    "The surviving float interval [0.2321, ~0.24493] is DISPLACEMENT CREDIT: Corollary PH credits the sub-foot piece only quadratically (norm(S)^2 <= (1 - x1b^2) norm(B1)^2) because the Gram cross term <S, R> admits no frame lower bound - free rates decorrelate the pieces, so the linear credit for the sub-foot correlation displaced by the in-ramp fraction cannot be collected. Closing needs a rate-aware lower bound on <S, R> through the block geometry, or the exact four-region in-ramp tilted pair excess the parent leg names.",
  subGaps: [
    "imp-95140-subgap-displacement-credit - OPEN: close [0.2321, ~0.24493] by collecting the linear sub-foot credit - a rate-aware lower bound on the Gram cross term <S, R> for pieces of a width-4 block (separation <= 4), or the exact four-region in-ramp tilted pair excess - instead of the quadratic-only credit norm(S)^2 <= (1 - x1b^2) norm(B1)^2.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module sharpens the forced-rate constant to mu_min < 12251/50000; the phi-conditional odd-mass bound itself is not established",
    "imp-95139-subgap-ramp-interior-linearization stays OPEN, narrowed: the in-ramp linear coefficient is now sharp at the qc = 1 ridge; the surviving linear-vs-quadratic structure is renamed displacement-credit (imp-95140-subgap-displacement-credit)",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM HS is unconditional given the sibling-chain witness conventions: Corollary PH is the exact bilinearity of the Gram form plus carried lemmas only (Lemma PP pairing, Cauchy-Schwarz, Lemma DL with the identical alpha-coupled staircase, Gram cross positivity for the sub-foot norm cap, the sharp imp-95134 cluster cap at facing gap 8 and the 3-piece Lemma MS row for the in-ramp piece, the clamp-general Lemma TS budget on the neighbor side); the spectral frame, parity split, head/tail reductions, and the adaptive per-term-corner + shifted Collatz-Wielandt certificate are carried from imp-95136..95139, library-free through the two alternating-series constants U >= exp(-mu) >= L with explicit float slacks, terminating with zero unresolved cells. The batteries and scans are CROSS-CHECKS; the theorem is the displayed corollary + carried chain. Scope: parity-pure, model-family constants; 12251/50000 is certified, not the sharp threshold (sandwich [0.23, 0.24502]; float landmarks 0.2321 and ~0.24493 measured only); the constant lies above the old frame root - the lemma gain is certification margin, stated plainly; 49/200 measured certification-infeasible even with the hybrid form; the ramp-interior-linearization leg stays OPEN under the displacement-credit residual; parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD_ASSERTIONS = [
  {
    id: "imp95140-hs-series-and-adaptive-certificate",
    description:
      "U = 0.7826888843086433 dominates exp(-12251/50000) with L below it, and the adaptive certificate over (alpha, x1, x1b, gamma, z2, z2b) with the two hybrid forms terminates with ZERO unresolved cells (10406330 cells, deepest depth 55), head max 0.9999999998894589 + remainder 9.30330734054099e-12 < 1 - 1e-10 - THEOREM HS at mu = 12251/50000 (even parity)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(U_HS, U_HS_LIT, 1e-15) &&
        U_HS >= Math.exp(-MU_HS) &&
        L_HS <= Math.exp(-MU_HS) &&
        L_HS <= U_HS &&
        CERT_HS.failed === 0 &&
        CERT_HS.cells === CERT_CELLS_LIT &&
        CERT_HS.deepest === CERT_DEEPEST_LIT &&
        rel(CERT_HS.maxOK, CERT_MAXOK_LIT, 1e-12) &&
        rel(REMAINDER_HS, REMAINDER_LIT, 1e-12) &&
        CERT_HS.maxOK < THRESH_HS &&
        CERT_HS.maxOK + REMAINDER_HS < 1 - 1e-10
      );
    },
  },
  {
    id: "imp95140-hs-odd-parity-sweep",
    description:
      "the odd head is certified by the SEPARATE parameter-free sweep: plain sharp caps at the exactly-doubled odd gaps {4, 16, 28, 112, 64, 124} give shifted-CW bound 0.7506, and adding the odd remainder stays far below the threshold",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(ODD_CW_HS, ODD_CW_LIT, 1e-12) &&
        ODD_CW_HS + REM_ODD_HS < THRESH_HS &&
        ODD_CW_HS < 0.8
      );
    },
  },
  {
    id: "imp95140-hs-certified-form-domination",
    description:
      "the certified hybrid form dominates the exact float hybrid form across a parameter grid (U-powers, sqrt slacks, staircase weights and the in-ramp row corners are genuine one-sided bounds), evaluated at zero-width cells",
    holds: () => {
      for (const al of [0, 0.5, 0.9, 0.99, 1]) {
        for (const x1 of [0, 0.1, 0.5, 1]) {
          for (const x1b of [0, 0.05, 0.5, 1]) {
            if (x1b > x1) continue;
            for (const ga of [0, 0.5, 1]) {
              for (const z2 of [0.5, 1]) {
                for (const z2b of [0, 0.5]) {
                  if (z2b > z2) continue;
                  const m2c = SQ(z2 * z2 - z2b * z2b);
                  const x2c = SQ(1 - z2 * z2);
                  const rowCap = Math.min(gUc(8), z2b * gUc(8) + m2c * gUc(12) + x2c * gUc(16));
                  const c2 = probeHybCert(2, RUNGS_T2, al, x1, x1b, x1b, ga, rowCap);
                  const f2 = probeHybridFloat(MU_HS, 1, 2, al, x1b, ga, rungsT2f(x1), z2, z2b);
                  if (c2 < f2) return false;
                  const c1 = probeHybCert(1, RUNGS_T1, al, x1, x1b, x1b, ga, rowCap);
                  const f1 = probeHybridFloat(MU_HS, 1, 1, al, x1b, ga, rungsT1f(x1, x1b), z2, z2b);
                  if (c1 < f1) return false;
                }
              }
            }
          }
        }
      }
      return (
        E1C >= Math.exp(-8 * MU_HS) &&
        E2C >= Math.exp(-32 * MU_HS) &&
        gUc(8) >= g(8 * MU_HS) &&
        gUc(12) >= g(12 * MU_HS) &&
        gUc(16) >= g(16 * MU_HS)
      );
    },
  },
  {
    id: "imp95140-hs-hybrid-battery",
    description:
      "Corollary PH approached end-to-end on ~1500 full-head witnesses in BOTH parities at their ACTUAL alpha, gamma and piece fractions: zero hybrid-form violations (worst rho12/H2 ratio 0.7105060135250242, worst rho12/H1 ratio 0.4346541717229754), zero exact-bilinear-split identity violations at both feet, zero in-ramp row-cap violations",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_H.violH === 0 &&
        BAT_H.violSplit === 0 &&
        BAT_H.violRow === 0 &&
        BAT_H.count === BAT_H_COUNT_LIT &&
        rel(BAT_H.worstH2, BAT_H_WORST_H2_LIT, 1e-6) &&
        rel(BAT_H.worstH1, BAT_H_WORST_H1_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95140-hs-theorem-battery",
    description:
      "THEOREM HS approached directly: 6000 seeded parity-pure multi-packet witnesses at rates >= 12251/50000 (2-5 blocks, up to 5 packets per block, edge-piled every third draw, both parities) - max E = -0.036167673486760386 strictly negative, zero E > 0 draws",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_W.viol === 0 && BAT_W.maxE < 0 && rel(BAT_W.maxE, BAT_W_MAX_E_LIT, 1e-6);
    },
  },
  {
    id: "imp95140-hs-sharpness-anchors",
    description:
      "at x1b = 0 the hybrid form EQUALS the Corollary PF main term (0.2220288465879442, strictly between g(12 mu) = 0.2082536721245022 and the tilt form 0.2737200538612934); at x1b = 1 (t = 2, qc = 1... ga = 0) it equals g(8 mu) = 0.41689675445636454 EXACTLY (sharp all-in-ramp corner) while Corollary PF gives 0.45008346333118127; and at qc = 0 the PF form is strictly BELOW the hybrid - neither dominates, both stay in the entrywise min",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(ANCHOR_HYB0, ANCHOR_HYB0_LIT, 1e-9) &&
        Math.abs(ANCHOR_HYB0 - ANCHOR_PF0) < 1e-15 &&
        ANCHOR_HYB0 > ANCHOR_G12 &&
        ANCHOR_HYB0 < ANCHOR_TILT &&
        rel(ANCHOR_G8, ANCHOR_G8_LIT, 1e-12) &&
        rel(ANCHOR_G12, ANCHOR_G12_LIT, 1e-12) &&
        rel(ANCHOR_TILT, ANCHOR_TILT_LIT, 1e-12) &&
        Math.abs(ANCHOR_HYB1 - ANCHOR_G8) < 1e-12 &&
        rel(ANCHOR_PF1, ANCHOR_PF1_LIT, 1e-9) &&
        ANCHOR_HYB1 < ANCHOR_PF1 &&
        ND_PF < ND_HYB
      );
    },
  },
  {
    id: "imp95140-hs-root-landmarks-and-attribution",
    description:
      "float landmarks (measured, not certified): hybrid-frame supScan 1.00006474780072 > 1 at mu = 0.2449 and 0.9999693927326598 < 1 at mu = 0.24495 (frame root ~0.24493, moved from ~0.24496); at the certified constant the base-frame sup is 0.999894109302256 (margin 1.06e-4, certification-infeasible as recorded) vs hybrid-frame 0.9998359643731185 (margin 1.64e-4, certified) - the hybrid form buys the certification margin",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(LAM_2449, LAM_2449_LIT, 1e-9) &&
        LAM_2449 > 1 &&
        rel(LAM_24495, LAM_24495_LIT, 1e-9) &&
        LAM_24495 < 1 &&
        rel(LAM_MU_BASE, LAM_MU_BASE_LIT, 1e-9) &&
        rel(LAM_MU_HYB, LAM_MU_HYB_LIT, 1e-9) &&
        LAM_MU_HYB < LAM_MU_BASE &&
        MU_HS < 4901 / 20000
      );
    },
  },
  {
    id: "imp95140-hs-consistency",
    description:
      "consistency: the THEOREM WE witness keeps E(23/100) = 17796.715801475395 > 0 with 23/100 < 12251/50000 (two-sided sandwich [0.23, 0.24502]) and E(12251/50000) = -100922.01008305361 < 0; 12251/50000 < 4901/20000 supersedes THEOREM PD at the constant level",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(eWitnessWE(23 / 100), E_WE_23_LIT, 1e-9) &&
        eWitnessWE(23 / 100) > 0 &&
        23 / 100 < MU_HS &&
        rel(eWitnessWE(MU_HS), E_WE_HS_LIT, 1e-9) &&
        eWitnessWE(MU_HS) < 0 &&
        MU_HS < 4901 / 20000
      );
    },
  },
  {
    id: "imp95140-hs-honesty-gate",
    description:
      "the verdict is scoped: parity-pure, model family, 12251/50000 certified not sharp, the constant lies above the old frame root (joint lemma+certification gain, stated plainly), 49/200 still certification-infeasible, the ramp-interior-linearization leg stays OPEN under the displacement-credit residual, parent sub-gap stays OPEN; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.promotesBound === false &&
      /NO QED/.test(IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.rigorScope) &&
      /refereed bound is changed/i.test(IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.rigorScope) &&
      /stays OPEN/.test(IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.rigorScope) &&
      /certification-infeasible/.test(IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.rigorScope) &&
      /above the old frame root/.test(IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.rigorScope) &&
      /remains OPEN/.test(IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.openResiduals[0]) &&
      /stays OPEN, narrowed/.test(IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.openResiduals[1]) &&
      IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.subGaps.length === 1 &&
      IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.openResiduals.length === 3 &&
      /parity-pure/.test(IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD.rigorScope),
  },
];

for (const a of IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95140-hybrid-split-probe-threshold assertion failed: ${a.id}`);
  }
}

export default IMP95140_HYBRID_SPLIT_PROBE_THRESHOLD;
