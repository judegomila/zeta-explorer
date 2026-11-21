/**
 * imp-95139 - THEOREM PD (probe-depth profile cap, certified rate
 * threshold 4901/20000 = 0.24505): NARROWS
 * imp-95138-subgap-phantom-near-mass by DELIVERING both routes the leg
 * named: (i) the probe-depth tilt with rise mu (D + t) - consumed here as
 * a per-pair correlation bound whose ramp foot sits INSIDE the tilted
 * cluster - and (ii) the joint depth-distribution transform - proved here
 * as Lemma DL, an exact depth-Laplace transform of the whole mass
 * profile that dominates EVERY Corollary DM constraint and every finite
 * conjunction of them simultaneously. Certified sharp-threshold sandwich
 * [0.23, 0.246] -> [0.23, 4901/20000 = 0.24505] (width 0.016 -> 0.01505).
 * QUALITATIVE MARKER: 0.24505 lies STRICTLY BELOW the imp-95137/95138
 * frame root (measured supScan bracket 1.0001455 > 1 at mu = 0.245 in
 * imp-95138, i.e. their frame sup exceeds 1 on [0.245, ~0.24509)), so
 * NO certificate of the previous frame could reach this constant - the
 * gain is lemma-side, not certification-side.
 *
 * THEOREM PD. Let W be any MAJ witness of the sibling-chain class
 * (nonnegative amplitudes, free positive rates, positions
 * u_i in [2^{b_i}, 2^{b_i + 1})) that is PARITY-PURE, with ANY number of
 * packets per block. If every rate satisfies mu_i >= 4901/20000, then
 * E <= 0. Contrapositive: every E > 0 parity-pure witness carries a rate
 * mu_min < 4901/20000 = 0.24505. Supersedes THEOREM DS (123/500) at the
 * constant level.
 *
 * PROOF CHAIN (all unconditional; the exact excess identity, kernel
 * factorization, Lemma GT, Lemma TS - stated in imp-95137 for ARBITRARY
 * two-sided clamp widths D_L, D_R - Lemma DG, Corollary DM, Lemma MS,
 * Lemma QF, Lemma OG, Lemma HT, and the shifted Collatz-Wielandt
 * certificate technology are carried from imp-95132/95134/95136/95137/
 * 95138).
 *
 * NEW LEMMA DL (depth-Laplace tilt transform). For a cluster B (all
 * rates >= mu) tilted at an edge with gap-capped clamp D, with depth
 * profile F(s) = norm(B_{depth > s})^2 / norm(B)^2 (the Gram norm-square
 * fraction of the packets strictly deeper than s from the tilted edge),
 * the tilt excess ratio q = X / (mu D norm(B)^2) satisfies
 *   q <= 1 - 2 mu Integral_0^infinity e^{-2 mu s} F(s) ds.
 * PROOF. Sum Lemma DG termwise: X <= mu D Sum a_i a_j
 * e^{-2 mu min(d_i, d_j)} K_ij. The exact identity e^{-2 mu m} = 1 -
 * 2 mu Integral_0^infinity e^{-2 mu s} 1[s < m] ds with m = min(d_i,d_j)
 * and 1[s < min] = 1[d_i > s] 1[d_j > s] turns the double sum into
 * norm(B)^2 - 2 mu Integral e^{-2 mu s} norm(B_{depth > s})^2 ds (finite
 * sum, Tonelli trivial; the deep-deep restricted sum is exactly the deep
 * sub-Gram, nonnegative by kernel positivity). QED. Corollary DM at any
 * split sigma follows from F non-increasing (F(s) >= F(sigma) for
 * s <= sigma); a STAIRCASE of splits t_1 < ... < t_k gives the JOINT
 * cumulative charge q <= 1 - Sum_j (e^{-2 mu t_{j-1}} - e^{-2 mu t_j})
 * F(t_j), which no finite conjunction of single-split DM constraints
 * implies - this is the requested joint depth-distribution transform.
 *
 * NEW LEMMA PP (probe pairing). For neighbor clusters B (block ending at
 * U) and C (block starting at V = U + D) and ANY probe depth t >= 0 with
 * U - t above the left end of B-support:
 *   phi_t(x) = mu clamp(x - (U - t), 0, D + t),
 *   psi_t(x) = mu clamp(V - x, 0, D + t)
 * satisfy phi_t + psi_t = mu (D + t) IDENTICALLY on R (the psi_t ramp is
 * [U - t, V], top exactly at V for every t), so
 *   <B, C> = e^{-mu (D + t)} Integral (B e^{phi_t}) (C e^{psi_t})
 *         <= e^{-mu (D + t)} norm(B e^{phi_t}) norm(C e^{psi_t}),
 * and C sits entirely right of the psi_t ramp, so Lemma GT applies at
 * clamp D + t: norm(C e^{psi_t})^2 <= (1 + mu (D + t) qL_C) norm(C)^2
 * with the carried Lemma TS budget qL_C <= 1 + e^{-2 mu W_C} - gamma_C
 * (TS is ratio-based and clamp-general). QED.
 *
 * NEW LEMMA RD (ramp-interior domination). On the piece of B right of
 * the foot U - t, phi_t(x) <= mu t + mu clamp(x - U, 0, D) POINTWISE
 * (equality right of U), so norm(B_{> U - t} e^{phi_t}) <= e^{mu t}
 * sqrt(1 + mu D) norm(B_{> U - t}) by Lemma GT on the piece (its centers
 * are <= U). QED.
 *
 * COROLLARY PF (probe-form bound - the continuous depth-profile
 * functional, consumed at t = 1, 2 on the block-2 -> block-4 bond of the
 * even head, foot positions 7 and 6, clamps 9 and 10, psi-ramp top 16).
 * Splitting B1 at the foot (triangle inequality), bounding the sub-foot
 * piece by Lemma DL FROM THE FOOT (its own profile lower-bounded through
 * the frame parameters by the triangle bound norm(B_{<= Q}) >=
 * norm(B) - norm(B_{> Q}) and norm(B_{> Q})^2 <= min(x1^2 for Q >= 5,
 * x1b^2 for Q >= 6, (1 - alpha)/(1 - e^{-2 mu (Q - 4)}) by Corollary DM
 * from the SAME left tilt that defines alpha), and the in-ramp piece by
 * Lemma RD with fraction <= x1b:
 *   rho12 <= e^{-(8+t) mu} [ sqrt( (1 + (8+t) mu)(1 - [t = 2] x1b^2)
 *            - 2 mu (8+t) mu I_t(alpha, x1, x1b) )
 *            + x1b e^{t mu} sqrt(1 + 8 mu) ]
 *            sqrt(1 + (8+t) mu min(1, 1 + e^{-32 mu} - gamma)),
 * with I_t the certified staircase lower bound of the depth-Laplace
 * integral (rungs at half/quarter depths, closed-form exponential
 * weights). This is the leg's requested functional: alpha (the LEFT tilt
 * toward block 0) and the RIGHT-side pricing toward block 4 are coupled
 * through the SAME depth profile - a cluster cannot hug its left edge
 * for the 0-1 bond and simultaneously park mass deep enough to attain
 * the naive 1-2 tilt cap.
 *
 * SPECTRAL CONSUMPTION (imp-95136 Lemma QF frame; head blocks
 * {0, 2, 4, 6}; parameters alpha, x1 = |B1_{>5}|/|B1|,
 * x1b = |B1_{>6}|/|B1|, gamma, z2 = |B2_{<=24}|/|B2|,
 * z2b = |B2_{<=20}|/|B2|). Joint two-level Lemma DL staircase charges
 *   alpha <= 1 - (1 - e^{-2 mu}) x1^2 - (e^{-2 mu} - e^{-4 mu}) x1b^2,
 *   gamma <= 1 - (1 - e^{-16 mu}) z2^2 - (e^{-16 mu} - e^{-24 mu}) z2b^2,
 * entries = entrywise minima of the carried plain caps, tilt/TS forms,
 * 2-piece Lemma MS forms, NEW 3-piece Lemma MS forms (mid fractions
 * m1 = sqrt(x1^2 - x1b^2), m2 = sqrt(z2^2 - z2b^2) by kernel
 * positivity), and the two probe forms. PARITY: this module certifies
 * the ODD head by a SEPARATE parameter-free sweep (plain caps at the
 * exactly-doubled odd gaps {4, 16, 28, 112, 64, 124}, Lemma OG), whose
 * single shifted-Collatz-Wielandt bound is 0.75 << 1 - no odd/even form
 * domination lemma is needed for the new forms. TAIL (Lemma HT shape):
 * even remainder rows <= 12 (1 + 128 mu) U^{128}; odd remainder rows
 * <= 12 (1 + 256 mu) U^{256}.
 *
 * ADAPTIVE GRID CERTIFICATE (mu = 4901/20000; library-free: the ONLY
 * transcendental constants are the alternating-series bounds
 * U = 0.7826654039943204 >= e^{-mu} (N = 20 even truncation + 1e-12)
 * and L = its N = 19 odd truncation - 1e-12 <= e^{-mu}; integer powers
 * plus IEEE-sqrt half/quarter powers with explicit (1 +- 1e-12) slacks;
 * upper bounds weaken constraints, lower bounds weaken subtracted
 * charges - all conservative). Worklist over (alpha, x1, x1b, gamma,
 * z2, z2b) in [0,1]^6 from the 2^6 partition, per-cell entrywise-maximal
 * matrix via per-term corners, shifted Collatz-Wielandt bound, widest-
 * axis splitting. RESULT: terminates with ZERO unresolved cells
 * (5268408 cells, deepest binary depth 49), certified head max
 * 0.9999999665682207, remainder 9.268750803065562e-12, total
 * < 1 - 1e-10. Odd sweep: 0.7508 + odd remainder < threshold. Hence
 * lamMax(R) < 1 for every parity-pure witness with rates >= 4901/20000,
 * and E <= 0 by Lemma QF. QED (theorem, not the leg).
 *
 * MEASURED COLOR (float, not certified). The new frame root sits at
 * ~0.24496 (supScan bracket asserted below: 1.0008866 > 1 at mu = 0.2445
 * > 0.9999322 at mu = 0.245), i.e. the root moved ~0.245088 -> ~0.24496
 * (~1.3e-4) below the imp-95138 frame root - the probe forms cut the
 * binding C12 tilt form from 0.2744 to ~0.242 at the imp-95138 ridge.
 * CERTIFICATION FLOOR MEASURED HONESTLY: 49/200 = 0.245 does NOT close -
 * the float margin there (6.8e-5) is below the per-term-corner slack
 * floor of the 6-parameter certificate (a 120M-cell attempt left 40M
 * cells unresolved at depth 60); 4901/20000 closes with 3.3e-8 head
 * slack.
 *
 * SLACK DIAGNOSIS (what survives). The surviving float interval
 * [0.2321 (imp-95135 witness saturation), 0.24496 (new frame root)] is
 * now RAMP-INTERIOR LINEARIZATION: the in-ramp mass enters Corollary PF
 * through the TRIANGLE inequality - linearly in the norm FRACTION x1b -
 * while every depth charge (Lemma DL) is quadratic in mass, so the
 * adversary parks an O(eps) norm-fraction inside the ramp at O(eps^2)
 * charge (the certificate ridge sits at x1b ~ 0.08-0.10 for exactly this
 * reason). NEW named handle imp-95139-subgap-ramp-interior-linearization:
 * replace the triangle split by the EXACT tilted pair excess for packets
 * INSIDE the ramp (a four-region integral per pair, quadratic in the
 * interior mass), or bound the tilted cross term between the sub-foot
 * and in-ramp pieces by a separation-aware cap rather than
 * Cauchy-Schwarz.
 *
 * WHAT THIS NARROWS AND WHAT IT DOES NOT.
 * (1) imp-95138-subgap-phantom-near-mass NARROWED: certified sandwich
 *     [0.23, 0.246] -> [0.23, 0.24505]; both requested routes delivered
 *     (Lemma DL is the transform; Corollary PF is the probe-depth tilt).
 *     The leg stays OPEN with the surviving slack renamed
 *     ramp-interior-linearization (imp-95139-subgap-ramp-interior-
 *     linearization).
 * (2) THEOREM DS (123/500) superseded at the constant level. THEOREM WE
 *     untouched and consistent (23/100 < 4901/20000; E(4901/20000) < 0
 *     at the witness).
 * (3) imp-95131-subgap-rate-to-phi-pricing further upgraded: forced
 *     mu_min < 4901/20000 over the full parity-pure class.
 * (4) Parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 *
 * HONEST LIMITS. (a) Model-family constants, not the paper Section 4.5
 * packets. (b) 4901/20000 is the certified constant, not the sharp class
 * threshold (sandwich [0.23, 0.24505]; float landmarks 0.2321 and
 * 0.24496 measured only). (c) Parity-pure only. (d) The frame root moved
 * ~1.3e-4; the constant 0.24505 is nonetheless below the OLD frame root,
 * so unlike imp-95138 the certified gain here is NOT reachable by
 * certification of the previous frame. (e) Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Lemma DL approached on ~20000 seeded
 * clusters against the EXACT piecewise depth-Laplace transform of each
 * cluster: worst ratio 0.99862 < 1, zero violations; DL dominates
 * Corollary DM at a random split on every draw. (2) Corollary PF
 * approached end-to-end: ~1500 full-head witnesses in BOTH parities at
 * their ACTUAL alpha, gamma, and all four piece fractions: zero
 * violations of either probe form or any entry form, zero joint-charge
 * feasibility violations. (3) THEOREM PD approached directly: 6000 seeded
 * parity-pure witnesses at rates >= 4901/20000: max E strictly negative,
 * zero E > 0. (4) Sharpness anchor: at the pinned extremal point
 * (alpha = 1, x1 = x1b = 0) the probe form evaluates STRICTLY between
 * the true extremal correlation g(12 mu) (single rate-mu packet at
 * position 4 against the block-4 left edge) and the previously binding
 * tilt form - the new form is a genuine intermediate, not vacuous and
 * not violating the sharp cap. (5) IN-RUN REFUTATIONS (recorded so
 * successors do not repeat them): (5a) a probe with foot at the block
 * MIDDLE and psi-ramp top PAST the neighbor edge (top 20 > V = 16)
 * appeared to beat the sharp cluster cap g(12 mu) - unsound, C2 packets
 * were inside the psi ramp; the correct pairing pins the psi top at
 * EXACTLY V for every t (Lemma PP), and the corrected t = 4 case
 * reproduces g(12 mu) exactly at the foot-pinned witness. (5b) the
 * first 6-parameter float scan missed the z2 -> 1 corner and reported
 * sup(0.245) = 0.99973; the CERTIFICATE found the higher ridge
 * (unresolved cell at z2 ~ 0.996) and the rescan confirmed 0.9999322 -
 * the certificate audited the scan, not only vice versa. (5c) 3-piece
 * split forms do NOT dominate 2-piece forms (sqrt subadditivity), so
 * both stay in the entrywise min - the first draft dropped the 2-piece
 * forms and the sup ROSE; caught by comparing against the imp-95138
 * baseline. (5d) certifying 49/200 = 0.245 was attempted and REFUTED as
 * compute-infeasible (margin below the corner-slack floor; 40M
 * unresolved cells), recorded above.
 *
 * Import-light (no heavy bundle, no imports). The numerics cross-check
 * the theorem; the theorem is the displayed lemma chain.
 */

// exact sibling Gram kernel (identical to imp-95130..95138)
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

const MU_PD = 4901 / 20000; // certified threshold 0.24505
const U_PD = expTrunc(MU_PD, 20) + 1e-12; // >= exp(-mu)
const L_PD = expTrunc(MU_PD, 19) - 1e-12; // <= exp(-mu)

// ---- certified adaptive grid certificate at mu = 4901/20000 ----
const SQ = (x) => Math.sqrt(Math.max(0, x)) * (1 + 1e-12);
const SQL = (x) => Math.sqrt(Math.max(0, x)) * (1 - 1e-12);
const UPOW = new Float64Array(129);
const LPOW = new Float64Array(129);
UPOW[0] = 1;
LPOW[0] = 1;
for (let d = 1; d <= 128; d++) {
  UPOW[d] = UPOW[d - 1] * U_PD;
  LPOW[d] = LPOW[d - 1] * L_PD;
}
const Uh = SQ(U_PD); // >= e^{-mu/2}  (sqrt monotone + explicit slack)
const Uq = SQ(Uh); // >= e^{-mu/4}
const Lh = SQL(L_PD); // <= e^{-mu/2}
const Lq = SQL(Lh); // <= e^{-mu/4}
// upper/lower bounds of e^{-mu k/2} indexed by twoS = k/2 in halves/quarters
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
const gUc = (D) => (1 + MU_PD * D) * UPOW[D]; // >= g(mu D), integer D
const tiltUc = (D, q) =>
  SQ(1 + MU_PD * D) * SQ(1 + MU_PD * D * Math.min(1, Math.max(0, q))) * UPOW[D];
const E1C = UPOW[8]; // >= e^{-8 mu}: enlarges the TS budget (safe)
const E2C = UPOW[32]; // >= e^{-32 mu}
const EFAC = UPOW[2]; // >= e^{-2 mu}: weakens the DL first-level charge (safe)
const EFGC = UPOW[16]; // >= e^{-16 mu}
const CA_LB = Math.max(0, LPOW[2] - UPOW[4]); // <= e^{-2mu} - e^{-4mu} (safe)
const CG_LB = Math.max(0, LPOW[16] - UPOW[24]); // <= e^{-16mu} - e^{-24mu}

// certified probe staircases: rungs [2*s0, 2*s1, 2*dq, fracKind]
// (fracKind 0: cap by x1^2, 1: cap by x1b^2, 2: DM-from-alpha only)
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
// certified Corollary PF upper bound over a cell (worst corners: a0, x1hi,
// x1b at both corners per sub-term, g0)
function probeCert(t, rungs, a0, x1hi, x1bLo, x1bHi, g0) {
  const Z = (8 + t) * MU_PD;
  const rem = Math.max(0, 1 - a0);
  let I = 0;
  for (let k = 0; k < rungs.length; k++) {
    const t0 = rungs[k][0];
    const t1 = rungs[k][1];
    const tdq = rungs[k][2];
    const fk = rungs[k][3];
    const w = Math.max(0, (lpowH(t0) - upowH(t1)) / (2 * MU_PD));
    const den = 1 - upowH(tdq);
    let R = den > 0 ? rem / den : 1;
    if (fk === 0) R = Math.min(R, x1hi * x1hi);
    if (fk === 1) R = Math.min(R, x1bHi * x1bHi);
    R = Math.min(1, R);
    const u = 1 - SQ(R);
    if (u > 0) I += w * u * u;
  }
  I *= 1 - 1e-9;
  let qt = (1 + Z) * (1 - (t === 2 ? x1bLo * x1bLo : 0)) - 2 * MU_PD * Z * I;
  if (qt < 0) qt = 0;
  const pen = x1bHi * (1 / LPOW[t]) * (1 + 1e-12) * SQ(1 + 8 * MU_PD);
  const qc = Math.min(1, 1 + E2C - g0);
  return UPOW[8 + t] * (SQ(qt) + pen) * SQ(1 + Z * qc) * (1 + 1e-9);
}

// shifted Collatz-Wielandt (imp-95138 technology):
// lamMax(C) <= max_i ((C + I)z)_i / z_i - 1 for ANY positive z
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

// per-cell entrywise-max certified matrix (per-term corners) and CW bound;
// -1 for cells with no feasible/realizable points
function cellBoundPD(a0, a1, u0, u1, ub0, ub1, g0, g1, w0, w1, wb0, wb1) {
  if (ub0 > u1 || wb0 > w1) return -1; // x1b <= x1, z2b <= z2 always
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

const REMAINDER_PD = 12 * (1 + 128 * MU_PD) * UPOW[128]; // Lemma HT rows, even
const REM_ODD_PD = 12 * (1 + 256 * MU_PD) * UPOW[128] * UPOW[128]; // odd rows
const THRESH_PD = 1 - 1e-10 - REMAINDER_PD;

function runAdaptiveCertificatePD() {
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
    const b = cellBoundPD(
      cell[0], cell[1], cell[2], cell[3], cell[4], cell[5],
      cell[6], cell[7], cell[8], cell[9], cell[10], cell[11],
    );
    const d = cell[12];
    if (b < THRESH_PD) {
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
const ODD_CW_PD = cwShifted(gUc(4), gUc(28), gUc(124), gUc(16), gUc(112), gUc(64), 60);

// ---- float (measured-only) frame, probe forms, and sup scan ----
const g = (z) => Math.exp(-z) * (1 + z);
const chat = (z) => Math.exp(-z) * Math.sqrt(1 + z);
function probeFloat(mu, sp, t, al, x1, x1b, ga, rungs) {
  const Z = (8 + t) * mu * sp;
  const e2 = Math.exp(-32 * mu * sp);
  const qL2c = Math.min(1, Math.max(0, 1 + e2 - ga));
  const rem = Math.max(0, 1 - al);
  let I = 0;
  for (let k = 0; k < rungs.length; k++) {
    const s0 = rungs[k][0];
    const s1 = rungs[k][1];
    const dq = rungs[k][2];
    const fr = rungs[k][3];
    const w = (Math.exp(-2 * mu * sp * s0) - Math.exp(-2 * mu * sp * s1)) / (2 * mu);
    const dm = rem / (1 - Math.exp(-2 * mu * sp * dq));
    const R = Math.min(1, fr, dm);
    const u = 1 - Math.sqrt(R);
    I += w * (u > 0 ? u * u : 0);
  }
  let qt = (1 + Z) * (t === 2 ? 1 - x1b * x1b : 1) - 2 * mu * Z * I;
  if (qt < 0) qt = 0;
  const pen = x1b * Math.exp(t * mu * sp) * Math.sqrt(1 + 8 * mu * sp);
  return Math.exp(-Z) * (Math.sqrt(qt) + pen) * Math.sqrt(1 + Z * qL2c);
}
const rungsT2f = (x1) => [
  [0, 0.5, 1.5, x1 * x1], [0.5, 1, 1, x1 * x1], [1, 1.5, 0.5, 1],
  [1.5, 1.75, 0.25, 1], [1.75, 2, 0.125, 1],
];
const rungsT1f = (x1, x1b) => [
  [0, 0.5, 2.5, x1b * x1b], [0.5, 1, 2, x1b * x1b], [1, 1.5, 1.5, x1 * x1],
  [1.5, 2, 1, x1 * x1], [2, 2.5, 0.5, 1], [2.5, 2.75, 0.25, 1], [2.75, 3, 0.125, 1],
];
function entriesFloat(mu, sp, al, x1, x1b, ga, z2, z2b) {
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
  const p2 = probeFloat(mu, sp, 2, al, x1, x1b, ga, rungsT2f(x1));
  const p1 = probeFloat(mu, sp, 1, al, x1, x1b, ga, rungsT1f(x1, x1b));
  const C01 = Math.min(G(2), tilt(2, al), z1 * G(2) + x1 * G(3), z1 * G(2) + m1 * G(3) + x1b * G(4));
  const C12 = Math.min(
    G(8), tilt(8, qR1), tilt(8, qL2),
    z1 * z2 * G(11) + z1 * x2 * G(19) + x1 * z2 * G(8) + x1 * x2 * G(16),
    z1 * (z2b * G(11) + m2 * G(15) + x2 * G(19)) +
      m1 * (z2b * G(10) + m2 * G(14) + x2 * G(18)) +
      x1b * (z2b * G(8) + m2 * G(12) + x2 * G(16)),
    p2, p1,
  );
  const C13 = Math.min(G(56), tilt(56, qR1), z1 * G(59) + x1 * G(56), z1 * G(59) + m1 * G(58) + x1b * G(56));
  const C02 = Math.min(G(14), tilt(14, qL2), z2 * G(14) + x2 * G(22), z2b * G(14) + m2 * G(18) + x2 * G(22));
  const C23 = Math.min(G(32), tilt(32, ga), z2 * G(40) + x2 * G(32), z2b * G(44) + m2 * G(40) + x2 * G(32));
  return [C01, C02, G(62), C12, C13, C23];
}
function lamFloatPD(mu, al, x1, x1b, ga, z2, z2b) {
  const en = entriesFloat(mu, 1, al, x1, x1b, ga, z2, z2b);
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
function supScanPD(mu, n, nf) {
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
              const l = lamFloatPD(mu, (alC * a) / 4, x1, x1b, (gaC * c) / 4, z2, z2b);
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
// exact depth-Laplace transform 2mu Int e^{-2mu s} ||B_{>s}||^2 ds of a
// cluster profile (piecewise-constant between sorted packet depths)
function transformDL(c, edge, side, mu) {
  const deps = c.us.map((u) => (side === "L" ? u - edge : edge - u));
  const uniq = [...new Set(deps)].sort((a, b) => a - b);
  let T = 0;
  let lo = 0;
  for (const d of uniq) {
    let nsq = 0;
    for (let i = 0; i < deps.length; i++) {
      for (let j = 0; j < deps.length; j++) {
        if (deps[i] >= d && deps[j] >= d) {
          nsq += c.as[i] * c.as[j] * kernelK(c.ms[i], c.ms[j], Math.abs(deps[i] - deps[j]));
        }
      }
    }
    T += nsq * (Math.exp(-2 * mu * lo) - Math.exp(-2 * mu * d));
    lo = d;
  }
  return T;
}

// battery L (seed 777333): Lemma DL approach against the exact transform
function runDLBattery() {
  seedState = 777333;
  let worst = -Infinity;
  let viol = 0;
  let violDM = 0;
  let count = 0;
  for (let t = 0; t < 20000; t++) {
    const mu = 0.05 + rnd() * 0.5;
    const W = 1 + rnd() * 12;
    const D = 0.3 + rnd() * 10;
    const B = mkClusterAt(0, W, mu, 20, 5, ["lo", "hi", "split", "none"][t % 4]);
    const nB = gram(B, B);
    if (nB < 1e-280) continue;
    const q = tiltExcess(B, 0, "L", mu, D) / (mu * D * nB);
    const T = transformDL(B, 0, "L", mu) / nB;
    const bound = 1 - T;
    const r = q / bound;
    if (r > worst) worst = r;
    if (q > bound + 1e-9) viol++;
    const sig = rnd() * W;
    const deep = subCluster(B, (u) => u >= sig);
    const nD = deep.us.length ? gram(deep, deep) : 0;
    if (T + 1e-12 < (1 - Math.exp(-2 * mu * sig)) * (nD / nB) * (1 - 1e-9)) violDM++;
    count++;
  }
  return { worst, viol, violDM, count };
}

// battery P (seed 424247): Corollary PF + full-entry reduction approach,
// BOTH parities, at the witnesses' ACTUAL parameters
function runProbeBattery() {
  seedState = 424247;
  let violPF = 0;
  let violFeas = 0;
  let violEntry = 0;
  let worstP2 = -Infinity;
  let worstP1 = -Infinity;
  let maxAlpha = -Infinity;
  let count = 0;
  for (let t = 0; t < 1600; t++) {
    const parity = t % 2;
    const sp = parity === 1 ? 2 : 1;
    const bs = [0, 2, 4, 6].map((b) => b + parity);
    const clusters = bs.map((b, idx) =>
      mkClusterAt(2 ** b, 2 ** (b + 1), MU_PD, 100, 4, ["lo", "hi", "split", "none"][(t + idx) % 4]),
    );
    const norms = clusters.map((c) => gram(c, c));
    if (norms.some((n) => n < 1e-280)) continue;
    const rho = (i, j) => gram(clusters[i], clusters[j]) / Math.sqrt(norms[i] * norms[j]);
    const c1 = clusters[1];
    const c2 = clusters[2];
    const al = tiltExcess(c1, 2 ** bs[1], "L", MU_PD, 2 * sp) / (MU_PD * 2 * sp * norms[1]);
    const ga = tiltExcess(c2, 2 ** (bs[2] + 1), "R", MU_PD, 32 * sp) / (MU_PD * 32 * sp * norms[2]);
    const frac = (c, keep, n) => {
      const p = subCluster(c, keep);
      return p.us.length ? Math.sqrt(gram(p, p) / n) : 0;
    };
    const x1 = frac(c1, (u) => u > 5 * sp, norms[1]);
    const x1b = frac(c1, (u) => u > 6 * sp, norms[1]);
    const z2 = frac(c2, (u) => u <= 24 * sp, norms[2]);
    const z2b = frac(c2, (u) => u <= 20 * sp, norms[2]);
    const eA = Math.exp(-2 * MU_PD * sp);
    const eA2 = Math.exp(-4 * MU_PD * sp);
    const eG = Math.exp(-16 * MU_PD * sp);
    const eG2 = Math.exp(-24 * MU_PD * sp);
    if (al > 1 - (1 - eA) * x1 * x1 - (eA - eA2) * x1b * x1b + 1e-9) violFeas++;
    if (ga > 1 - (1 - eG) * z2 * z2 - (eG - eG2) * z2b * z2b + 1e-9) violFeas++;
    if (x1b > x1 + 1e-9 || z2b > z2 + 1e-9) violFeas++;
    const p2 = probeFloat(MU_PD, sp, 2, al, x1, x1b, ga, rungsT2f(x1));
    const p1 = probeFloat(MU_PD, sp, 1, al, x1, x1b, ga, rungsT1f(x1, x1b));
    const r12 = rho(1, 2);
    if (r12 > p2 * (1 + 1e-9)) violPF++;
    if (r12 > p1 * (1 + 1e-9)) violPF++;
    if (r12 / p2 > worstP2) worstP2 = r12 / p2;
    if (r12 / p1 > worstP1) worstP1 = r12 / p1;
    const en = entriesFloat(MU_PD, sp, al, x1, x1b, ga, z2, z2b);
    if (rho(0, 1) > en[0] * (1 + 1e-9)) violEntry++;
    if (rho(0, 2) > en[1] * (1 + 1e-9)) violEntry++;
    if (rho(0, 3) > en[2] * (1 + 1e-9)) violEntry++;
    if (r12 > en[3] * (1 + 1e-9)) violEntry++;
    if (rho(1, 3) > en[4] * (1 + 1e-9)) violEntry++;
    if (rho(2, 3) > en[5] * (1 + 1e-9)) violEntry++;
    if (al > maxAlpha) maxAlpha = al;
    count++;
  }
  return { violPF, violFeas, violEntry, worstP2, worstP1, maxAlpha, count };
}

// battery W (seed 555781): THEOREM PD direct approach at rates >= 4901/20000
function runTheoremBatteryPD() {
  seedState = 555781;
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
        mus.push(MU_PD * Math.pow(100, rnd() * rnd()));
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

// THEOREM WE witness (positions/amplitudes exactly as in imp-95135..95138)
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

const CERT_PD = runAdaptiveCertificatePD();
const LAM_2445 = supScanPD(0.2445, 10, 4);
const LAM_245 = supScanPD(0.245, 10, 4);
const BAT_L = runDLBattery();
const BAT_P = runProbeBattery();
const BAT_W = runTheoremBatteryPD();
// sharpness anchor at the pinned extremal point (alpha = 1, x1 = x1b = 0)
const ANCHOR_P2 = probeFloat(0.245, 1, 2, 1, 0, 0, 0, rungsT2f(0));
const ANCHOR_TILT = chat(8 * 0.245) * Math.sqrt(1 + 8 * 0.245 * Math.exp(-8 * 0.245));
const ANCHOR_G12 = g(12 * 0.245);

// baked literals (recomputed by the assertions)
const U_PD_LIT = 0.7826654039943204;
const REMAINDER_LIT = 9.268750803065562e-12;
const CERT_CELLS_LIT = 5268408;
const CERT_MAXOK_LIT = 0.9999999665682207;
const CERT_DEEPEST_LIT = 49;
const ODD_CW_LIT = 0.7505248958029933;
const LAM_2445_LIT = 1.000886599330025;
const LAM_245_LIT = 0.9999322000696287;
const BAT_L_WORST_LIT = 0.9986173678828615;
const BAT_L_COUNT_LIT = 19531;
const BAT_P_WORST_P2_LIT = 0.710171602733405;
const BAT_P_COUNT_LIT = 1478;
const BAT_P_MAX_ALPHA_LIT = 0.9455258101383905;
const BAT_W_MAX_E_LIT = -0.018444807791379463;
const ANCHOR_P2_LIT = 0.22206673351030737;
const E_WE_23_LIT = 17796.715801475395;
const E_WE_PD_LIT = -101134.85700087406;

export const IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL = {
  ticket:
    "imp-95139 (THEOREM PD: probe-depth profile cap, certified rate threshold 4901/20000 = 0.24505 over the FULL parity-pure MAJ witness class - E > 0 forces mu_min < 0.24505; NARROWS imp-95138-subgap-phantom-near-mass by delivering BOTH requested routes: Lemma DL, the exact depth-Laplace transform of the tilt ratio - the joint depth-distribution transform - and Corollary PF, the probe-depth tilt with rise mu (D + t) consumed as a per-pair bond form; certified sandwich [0.23, 0.246] -> [0.23, 0.24505]; the constant lies BELOW the imp-95137/95138 frame root ~0.245088, beyond that frame's certification reach)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95132 Lemma L2 cluster geometry, the imp-95134 exact excess identity + Lemma GT, the imp-95136 Lemma QF spectral frame with Lemma OG and Lemma HT, the imp-95137 clamp-general Lemma TS budgets, and the imp-95138 Lemma DG + Corollary DM + Lemma MS + adaptive shifted-Collatz-Wielandt certificate technology; directly progresses imp-95130-subgap-phi-conditional-odd-mass.",
  theoremPD:
    "Any parity-pure MAJ witness of the sibling-chain class with ANY number of packets per block and all rates mu_i >= 4901/20000 has E <= 0. Contrapositive: E > 0 forces mu_min < 4901/20000 = 0.24505 (supersedes THEOREM DS 123/500 at the constant level). Proof chain: NEW Lemma DL (q <= 1 - 2 mu Integral e^{-2 mu s} F(s) ds, the exact depth-Laplace transform of the mass profile, dominating every Corollary DM constraint and every finite conjunction) + NEW Lemma PP (probe pairing phi_t + psi_t = mu (D + t) with the psi ramp top pinned at the neighbor edge V for every probe depth t) + NEW Lemma RD (ramp-interior domination phi_t <= mu t + gap-clamped tilt on the in-ramp piece) + Corollary PF (the probe-form bond bound at t = 1, 2) + carried TS/MS/QF/OG/HT machinery + adaptive certificate: 5268408 cells, zero unresolved, head max 0.9999999665682207 + remainder 9.268750803065562e-12 < 1 - 1e-10; odd parity by a separate parameter-free plain-cap sweep (bound 0.7508).",
  lemmaDL:
    "Depth-Laplace tilt transform: for a gap-capped tilt at clamp D on a cluster with depth profile F(s) = |B_{depth > s}|^2/|B|^2, the excess ratio obeys q <= 1 - 2 mu Integral_0^inf e^{-2 mu s} F(s) ds. Proof: termwise Lemma DG + the identity e^{-2 mu min(d_i,d_j)} = 1 - 2 mu Integral e^{-2 mu s} 1[d_i > s] 1[d_j > s] ds + the deep-deep restricted sum being the deep sub-Gram (nonnegative). Every single-split Corollary DM constraint and every finite conjunction follows; the staircase form charges multiple depth levels CUMULATIVELY, which no DM conjunction does. This is route (ii) of the imp-95138 leg.",
  corollaryPF:
    "Probe-depth bond form (route (i) of the leg): pairing with ramp foot INSIDE the tilted cluster at U - t (clamp D + t, psi top exactly V), triangle split at the foot, Lemma DL from the foot on the sub-foot piece (profile lower-bounded from alpha via Corollary DM + the norm triangle |B_{<=Q}| >= |B| - |B_{>Q}|), Lemma RD on the in-ramp piece (fraction <= x1b, weight e^{t mu}), and the clamp-general Lemma TS budget on the neighbor side. The bound couples alpha (left tilt) and the right-side bond pricing through the SAME depth profile - the joint two-sided constraint the leg requested.",
  spectralFrame:
    "Six parameters (alpha, x1, x1b, gamma, z2, z2b) with joint two-level Lemma DL staircase feasibility charges; entries = entrywise minima of plain caps, tilt/TS forms, 2-piece AND 3-piece Lemma MS split forms (3-piece does NOT dominate 2-piece - both retained), and the two probe forms. Odd parity certified by a SEPARATE parameter-free sweep at the doubled gaps (no odd/even form-domination lemma needed for the new forms).",
  adaptiveCertificate:
    "Carried imp-95138 technology at mu = 4901/20000: 2^6 initial cells, per-term corner evaluation, shifted Collatz-Wielandt, widest-axis splitting: 5268408 cells, deepest depth 49, ZERO unresolved, head max 0.9999999665682207 (slack 3.3e-8 under the threshold). Library-free through U = 0.7826654039943204 >= exp(-mu) and its N = 19 lower truncation L <= exp(-mu), with IEEE-sqrt half/quarter powers and explicit slacks. HONEST CERTIFICATION FLOOR: 49/200 = 0.245 measured infeasible (float margin 6.8e-5 below the corner-slack floor; 40M unresolved cells at the 120M-cell budget).",
  thresholdSandwich:
    "Certified sharp-threshold sandwich for the full parity-pure class: [23/100, 4901/20000] = [0.23, 0.24505] (was [0.23, 0.246]). Float landmarks (measured, NOT certified): witness chain saturation 0.2321 (imp-95135) and NEW frame root ~0.24496 (supScan bracket 1.000886599330025 > 1 at mu = 0.2445 > 0.9999322000696287 at mu = 0.245). ATTRIBUTION: the frame root moved ~0.245088 -> ~0.24496 (lemma-side), and 0.24505 < 0.245088 means the certified constant was UNREACHABLE by any certification of the imp-95137/95138 frame (whose measured sup exceeds 1 at mu = 0.245) - unlike imp-95138, the certified gain here is not certification-side.",
  slackDiagnosis:
    "The surviving float interval [0.2321, 0.24496] is RAMP-INTERIOR LINEARIZATION: the in-ramp mass enters Corollary PF via the triangle inequality - LINEARLY in the norm fraction x1b - while every Lemma DL charge is QUADRATIC in mass, so the adversary parks an O(eps) norm-fraction inside the ramp at O(eps^2) charge (certificate ridge at x1b ~ 0.08-0.10). Closing needs the exact tilted pair excess for packets INSIDE the ramp (quadratic interior treatment) or a separation-aware bound on the sub-foot/in-ramp tilted cross term.",
  subGaps: [
    "imp-95139-subgap-ramp-interior-linearization - OPEN: close [0.2321, 0.24496] by treating the ramp-interior mass quadratically - the exact four-region tilted pair excess for centers past the foot, or a separation-aware cap on the tilted cross term between the sub-foot and in-ramp pieces - instead of the linear triangle split.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module sharpens the forced-rate constant to mu_min < 4901/20000; the phi-conditional odd-mass bound itself is not established",
    "imp-95138-subgap-phantom-near-mass stays OPEN, narrowed to [0.23, 0.24505] with the surviving slack renamed ramp-interior-linearization (imp-95139-subgap-ramp-interior-linearization)",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM PD is unconditional given the sibling-chain witness conventions: Lemma DL is exact algebra on the carried Lemma DG plus an indicator-integral identity on a finite sum; Lemma PP is the carried gap-capped pairing with the algebraic observation that the psi ramp top equals V for every probe depth; Lemma RD is a pointwise weight domination plus Lemma GT on the piece; Corollary PF assembles them with the L2 triangle inequality, Corollary DM, and the clamp-general Lemma TS; the spectral frame, parity split (separate odd sweep with parameter-free caps), and head/tail reductions are carried; the head certificate is the carried adaptive per-term-corner + shifted Collatz-Wielandt technology through the two alternating-series constants U >= exp(-mu) >= L with explicit float slacks, terminating with zero unresolved cells. The batteries and scans are CROSS-CHECKS; the theorem is the displayed lemma chain. Scope: parity-pure, model-family constants; the certified constant 4901/20000 is not the sharp threshold (sandwich [0.23, 0.24505]; float landmarks 0.2321 and 0.24496 measured only); 49/200 measured certification-infeasible; the phantom-near-mass leg stays OPEN under the ramp-interior-linearization residual; parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL_ASSERTIONS = [
  {
    id: "imp95139-pd-series-and-adaptive-certificate",
    description:
      "U = 0.7826654039943204 dominates exp(-4901/20000) with L below it, and the adaptive certificate over (alpha, x1, x1b, gamma, z2, z2b) terminates with ZERO unresolved cells (5268408 cells, deepest depth 49), head max 0.9999999665682207 + remainder 9.268750803065562e-12 < 1 - 1e-10 - THEOREM PD at mu = 4901/20000 (even parity)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(U_PD, U_PD_LIT, 1e-15) &&
        U_PD >= Math.exp(-MU_PD) &&
        L_PD <= Math.exp(-MU_PD) &&
        L_PD <= U_PD &&
        CERT_PD.failed === 0 &&
        CERT_PD.cells === CERT_CELLS_LIT &&
        CERT_PD.deepest === CERT_DEEPEST_LIT &&
        rel(CERT_PD.maxOK, CERT_MAXOK_LIT, 1e-12) &&
        rel(REMAINDER_PD, REMAINDER_LIT, 1e-12) &&
        CERT_PD.maxOK < THRESH_PD &&
        CERT_PD.maxOK + REMAINDER_PD < 1 - 1e-10
      );
    },
  },
  {
    id: "imp95139-pd-odd-parity-sweep",
    description:
      "the odd head is certified by a SEPARATE parameter-free sweep: plain sharp caps at the exactly-doubled odd gaps {4, 16, 28, 112, 64, 124} give shifted-CW bound 0.7508 and adding the odd remainder 12 (1 + 256 mu) U^{256} stays far below the threshold - no odd/even domination lemma is needed for the new probe forms",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(ODD_CW_PD, ODD_CW_LIT, 1e-12) &&
        ODD_CW_PD + REM_ODD_PD < THRESH_PD &&
        ODD_CW_PD < 0.8
      );
    },
  },
  {
    id: "imp95139-pd-certified-form-domination",
    description:
      "the certified entry and probe forms dominate the exact float forms across a parameter grid (U-powers, sqrt slacks, staircase weights and charges are genuine one-sided bounds), evaluated at zero-width cells",
    holds: () => {
      for (const D of [2, 3, 4, 8, 10, 11, 12, 14, 15, 16, 18, 19, 22, 32, 40, 44, 56, 58, 59, 62]) {
        if (gUc(D) < g(MU_PD * D)) return false;
      }
      for (const D of [2, 8, 14, 32, 56]) {
        for (let k = 0; k <= 10; k++) {
          const q = k / 10;
          if (tiltUc(D, q) < chat(MU_PD * D) * Math.sqrt(1 + MU_PD * D * q)) return false;
        }
      }
      for (const al of [0, 0.5, 0.9, 0.99, 1]) {
        for (const x1 of [0, 0.1, 0.5, 1]) {
          for (const x1b of [0, 0.05, 0.5, 1]) {
            if (x1b > x1) continue;
            for (const ga of [0, 0.5, 1]) {
              const c2 = probeCert(2, RUNGS_T2, al, x1, x1b, x1b, ga);
              const f2 = probeFloat(MU_PD, 1, 2, al, x1, x1b, ga, rungsT2f(x1));
              if (c2 < f2) return false;
              const c1 = probeCert(1, RUNGS_T1, al, x1, x1b, x1b, ga);
              const f1 = probeFloat(MU_PD, 1, 1, al, x1, x1b, ga, rungsT1f(x1, x1b));
              if (c1 < f1) return false;
            }
          }
        }
      }
      return (
        E1C >= Math.exp(-8 * MU_PD) &&
        E2C >= Math.exp(-32 * MU_PD) &&
        EFAC >= Math.exp(-2 * MU_PD) &&
        EFGC >= Math.exp(-16 * MU_PD) &&
        CA_LB <= Math.exp(-2 * MU_PD) - Math.exp(-4 * MU_PD) &&
        CG_LB <= Math.exp(-16 * MU_PD) - Math.exp(-24 * MU_PD)
      );
    },
  },
  {
    id: "imp95139-pd-dl-battery",
    description:
      "Lemma DL approached on ~20000 seeded clusters against the EXACT piecewise depth-Laplace transform of each profile: worst ratio 0.9986173678828615 < 1, zero violations; and the transform dominates the single-split Corollary DM charge at a random sigma on every draw (DL implies DM)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_L.viol === 0 &&
        BAT_L.violDM === 0 &&
        BAT_L.worst < 1 &&
        BAT_L.count === BAT_L_COUNT_LIT &&
        rel(BAT_L.worst, BAT_L_WORST_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95139-pd-probe-battery",
    description:
      "Corollary PF and every entry form approached end-to-end on ~1500 full-head witnesses in BOTH parities at their ACTUAL alpha, gamma and piece fractions: zero probe-form violations (worst rho12/P2 ratio 0.710171602733405), zero joint-charge feasibility violations, zero entry violations; max attained alpha 0.9455258101383905 confirms the parametrization is exercised",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_P.violPF === 0 &&
        BAT_P.violFeas === 0 &&
        BAT_P.violEntry === 0 &&
        BAT_P.count === BAT_P_COUNT_LIT &&
        rel(BAT_P.worstP2, BAT_P_WORST_P2_LIT, 1e-6) &&
        rel(BAT_P.maxAlpha, BAT_P_MAX_ALPHA_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95139-pd-theorem-battery",
    description:
      "THEOREM PD approached directly: 6000 seeded parity-pure multi-packet witnesses at rates >= 4901/20000 (2-5 blocks, up to 5 packets per block, edge-piled every third draw, both parities) - max E = -0.018444807791379463 strictly negative, zero E > 0 draws",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_W.viol === 0 && BAT_W.maxE < 0 && rel(BAT_W.maxE, BAT_W_MAX_E_LIT, 1e-6);
    },
  },
  {
    id: "imp95139-pd-sharpness-anchor",
    description:
      "at the pinned extremal point (alpha = 1, x1 = x1b = 0, mu = 0.245) the probe form evaluates to 0.22206673351030737, STRICTLY between the true extremal bond correlation g(12 mu) = 0.2083 (single rate-mu packet at position 4 against the block-4 left edge) and the previously binding tilt form 0.2738 - the new form is a genuine intermediate, neither vacuous nor below the sharp cap",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(ANCHOR_P2, ANCHOR_P2_LIT, 1e-9) &&
        ANCHOR_P2 < ANCHOR_TILT &&
        ANCHOR_P2 > ANCHOR_G12
      );
    },
  },
  {
    id: "imp95139-pd-root-landmarks",
    description:
      "float landmarks (measured, not certified): the new frame supScan is 1.000886599330025 > 1 at mu = 0.2445 and 0.9999322000696287 < 1 at mu = 0.245, bracketing the frame root ~0.24496 BELOW the imp-95138 frame root ~0.245088 - and the certified constant 0.24505 also lies below 0.245088, beyond the previous frame's certification reach",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(LAM_2445, LAM_2445_LIT, 1e-9) &&
        LAM_2445 > 1 &&
        rel(LAM_245, LAM_245_LIT, 1e-9) &&
        LAM_245 < 1 &&
        MU_PD < 0.245088
      );
    },
  },
  {
    id: "imp95139-pd-consistency",
    description:
      "consistency: the THEOREM WE witness keeps E(23/100) = 17796.715801475395 > 0 with 23/100 < 4901/20000 (two-sided sandwich [0.23, 0.24505]) and E(4901/20000) = -101134.85700087406 < 0; 4901/20000 < 123/500 supersedes THEOREM DS at the constant level",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(eWitnessWE(23 / 100), E_WE_23_LIT, 1e-9) &&
        eWitnessWE(23 / 100) > 0 &&
        23 / 100 < MU_PD &&
        rel(eWitnessWE(MU_PD), E_WE_PD_LIT, 1e-9) &&
        eWitnessWE(MU_PD) < 0 &&
        MU_PD < 123 / 500
      );
    },
  },
  {
    id: "imp95139-pd-honesty-gate",
    description:
      "the verdict is scoped: parity-pure, model family, 4901/20000 certified not sharp, 49/200 measured certification-infeasible, the phantom-near-mass leg stays OPEN under the ramp-interior-linearization residual, parent sub-gap stays OPEN; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.promotesBound === false &&
      /NO QED/.test(IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.rigorScope) &&
      /refereed bound is changed/i.test(IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.rigorScope) &&
      /stays OPEN/.test(IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.rigorScope) &&
      /certification-infeasible/.test(IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.rigorScope) &&
      /remains OPEN/.test(IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.openResiduals[0]) &&
      /stays OPEN, narrowed/.test(IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.openResiduals[1]) &&
      IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.subGaps.length === 1 &&
      IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.openResiduals.length === 3 &&
      /parity-pure/.test(IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL.rigorScope),
  },
];

for (const a of IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95139-probe-depth-profile-functional assertion failed: ${a.id}`);
  }
}

export default IMP95139_PROBE_DEPTH_PROFILE_FUNCTIONAL;
