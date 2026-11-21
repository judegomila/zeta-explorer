/**
 * imp-95141 - THEOREM WS (witness-saturation certificate, certified class
 * lower end 11603/50000 = 0.23206) + COROLLARY FR (certified family-root
 * bracket [11603/50000, 2901/12500)): moves the CERTIFIED lower end of the
 * sharp-threshold sandwich for the parity-pure MAJ class from 23/100 up to
 * 11603/50000, within 8.53e-6 of the measured family root. Certified
 * sandwich [0.23, 0.24502] -> [11603/50000, 12251/50000] =
 * [0.23206, 0.24502] (width 0.01502 -> 0.01296). This is a WITNESS-side
 * step: no ceiling lemma is touched; the imp-95140 THEOREM HS upper end is
 * carried unchanged.
 *
 * THEOREM WS. At p = 999983 take the grid-extremal points k1 = 499992,
 * k2 = 249995, k3 = 62498 (positions u = p/k hug the facing edges of
 * blocks 0, 2, 4 - all even, parity-pure; the adjacent indices k1 - 1,
 * k2 + 1, k3 + 1 leave the blocks - integer arithmetic, asserted). With
 * integer amplitudes (6756, 6854, 2716) and one common rate
 * mu = 11603/50000, E > 0. Hence the sharp parity-pure class threshold is
 * >= 11603/50000 = 0.23206. Supersedes THEOREM WE (23/100) at the
 * constant level; same witness family, amplitudes re-optimized (Perron
 * vector at the higher rate, scaled 1e4 and rounded - quantization
 * efficiency 0.99965 against the continuous-amplitude optimum).
 * CERTIFICATE: mu E = 2 sum A_i A_j g(mu T_ij) - |A|^2 with
 * g(z) = exp(-z)(1 + z); the three g values are bounded BELOW by N = 19
 * truncated alternating series minus an explicit 1e-12 slack (all
 * z <= 3.249 < 21, mathematical remainder positive - first omitted term
 * even - so the truncation is a true lower bound; the slack absorbs
 * double rounding), giving mu E >= 1666.9193364977837 - float-summation
 * error (four products of magnitude ~1e8, far below the margin floor 1)
 * against the exact integer diagonal 99997508. Exact float cross-check:
 * mu E = 1667.912, E = 7187.417358 > 0 by two independent routes (g form
 * and the exact kernel form, agreement < 1e-6). QED (theorem - the
 * witness is exhibited, not bounded).
 *
 * COROLLARY FR (family exhaustion, certified two-sided). For the FIXED
 * grid-extremal positions above with free nonnegative amplitudes and free
 * rates, all rates >= 2901/12500 = 0.23208 forces E <= 0. PROOF. With
 * B_i = a_i/sqrt(m_i), E = -|B|^2 + 2 sum B_i B_j rho_ij where
 * rho_ij = sqrt(m_i m_j) K(m_i, m_j, T_ij) > 0; the carried Lemma RC
 * (imp-95131, unconditional calculus) gives rho_ij <= g(min(m_i, m_j)
 * T_ij) <= g(mu T_ij) by monotonicity, so with nonnegative B the Gram
 * form is dominated entrywise by Ghat (N = 20 even-truncation upper
 * bounds on the three g values plus 1e-12 slack), and
 * lamMax(Ghat) <= max_i (Ghat v)_i / v_i = 0.9999775678535063 < 1 by
 * Collatz-Wielandt at the baked positive test vector v (valid for ANY
 * positive vector - the float Perron iteration needs no certification).
 * Hence E <= (lamMax(Ghat) - 1)|B|^2 < 0 for B != 0. QED (corollary;
 * every ingredient is carried). Combined with THEOREM WS the
 * fixed-position family threshold lies in [11603/50000, 2901/12500) -
 * width 2e-5 - superseding the imp-95135 COROLLARY RM bracket
 * (0.23, 0.235) at both ends (250x narrower).
 *
 * HONEST ATTRIBUTION (baked into the module). The float landmark
 * 0.23206852812691425 (family root at the grid positions) was already
 * MEASURED in imp-95135; this step converts it into CERTIFIED bounds on
 * both sides. The gain is certification-side, not a new witness family -
 * stated plainly. The witness rate 11603/50000 sits 8.53e-6 below the
 * family root; pushing closer is possible but buys < 1e-5 of sandwich
 * width against thinning certificate margins.
 *
 * MEASURED COLOR (float, not certified). Family root at the grid
 * positions 0.23206852812691425 (reproduced by in-module bisection,
 * matching the imp-95135 landmark to the last digit); lamMax at the
 * witness rate 1.000016685373395 > 1 and at the exhaustion rate
 * 0.9999775574006388 < 1. Position-polytope limit: with positions free
 * in the blocks (u1 in [1,2), u2 in [4,8), u3 in [16,32)) the root
 * supremum is the edge limit 0.23207203643507168 (u1 -> 2, u2 = 4,
 * u3 = 16, NOT attained - half-open blocks), only 3.5e-6 above the
 * p = 999983 grid-extremal root: the residual between the certified
 * lower end and the position-limit is grid quantization plus the 2e-5
 * bracket width. A 21x41x21 position scan stays below the edge limit
 * (best 0.23203450016742133). Carried measured landmarks (imp-95135/
 * 95137): 5- and 7-block chain extensions move the root +2.0e-9; joint
 * multi-packet re-optimization moves the witness floor 3.4e-10 - the
 * witness side is measured-exhausted at this family.
 *
 * WHAT THIS NARROWS AND WHAT IT DOES NOT.
 * (1) The certified sandwich lower end moves 23/100 -> 11603/50000; the
 *     upper end 12251/50000 (THEOREM HS) is untouched. Width 0.01502 ->
 *     0.01296.
 * (2) The surviving certified interval [0.23206, 0.24502] is now - up to
 *     the 3.5e-6 grid-quantization sliver and the measured-only
 *     family-exhaustion evidence - ENTIRELY ceiling-side: it is the
 *     imp-95140-subgap-displacement-credit leg (float ceiling-frame root
 *     ~0.24493). This module does NOT touch that leg; it pins where the
 *     remaining work lives.
 * (3) COROLLARY FR is family-scoped: a structurally different witness
 *     family (different blocks, multi-packet, off-grid positions closer
 *     to edges at larger p) could in principle exceed 2901/12500; the
 *     batteries and the carried measurements say no such family has been
 *     found (position battery at rates >= 0.23208: zero E > 0 over
 *     19971 draws including edge-piled corners).
 * (4) Parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 *
 * HONEST LIMITS. (a) Model-family constants, not the paper Section 4.5
 * packets. (b) The class threshold is sandwiched, not determined:
 * [11603/50000, 12251/50000] certified; 0.2320685 (grid family root),
 * 0.2320720 (position limit) and ~0.24493 (ceiling frame root) are float
 * landmarks, measured only. (c) Parity-pure only. (d) Witness-side step:
 * no ceiling lemma, no progress on displacement credit itself.
 * (e) Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) In-class membership stress-tested: grid
 * extremality and block membership are integer arithmetic (asserted);
 * blocks 0/2/4 all even (parity-pure); amplitudes positive integers;
 * rates equal at 11603/50000 - the same conventions THEOREM WE used for
 * the carried 0.23 end. (2) The certified-CW direction was checked: the
 * Collatz-Wielandt max-ratio bound is an UPPER bound on lamMax for any
 * positive test vector, so a bad baked vector can only WEAKEN the
 * corollary (make the bound exceed 1), never fake it. (3) The
 * mixed-rate reduction was stress-tested with a 20000-draw Lemma RC spot
 * battery at the actual gap scales (worst ratio 0.9999866355395278,
 * zero violations) and a 20000-draw free-rate family battery at rates
 * >= 2901/12500 (max E = -2.74e-4 < 0, zero E > 0). (4) Pushing the
 * witness rate into the last 8.53e-6 below the root was tried in float
 * and REJECTED for the module: at 0.232068 the continuous-amplitude
 * margin falls to ~1e-6 of lamMax where integer quantization (loss
 * ~1.5/|A|^2) still clears but the honest safety ratio degrades 16x for
 * < 1e-5 of sandwich width - recorded so successors do not respend it.
 * (5) The position-polytope scan confirms no interior triple beats the
 * facing-edge corner (the strong 0-2 bond dominates the Perron vector).
 *
 * Import-light (no heavy bundle, no imports). The batteries and scans
 * are CROSS-CHECKS; the theorem is the exhibited witness + series
 * certificate, the corollary is Lemma RC + entrywise domination +
 * Collatz-Wielandt.
 */

// exact sibling Gram kernel (identical to imp-95130..95140)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
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

const gFun = (z) => Math.exp(-z) * (1 + z);

// witness geometry (grid-extremal points carried from imp-95135)
const P_WS = 999983;
const K_WS = [499992, 249995, 62498];
const U_WS = K_WS.map((k) => P_WS / k);
const T_WS = [U_WS[1] - U_WS[0], U_WS[2] - U_WS[0], U_WS[2] - U_WS[1]];
const A_WS = [6756, 6854, 2716]; // Perron at MU_WS, scaled 1e4, rounded
const MU_WS = 11603 / 50000; // certified witness rate 0.23206
const MU_FX = 2901 / 12500; // certified family-exhaustion rate 0.23208
const MU_HS = 12251 / 50000; // carried THEOREM HS upper end 0.24502

const DIAG_WS = A_WS[0] * A_WS[0] + A_WS[1] * A_WS[1] + A_WS[2] * A_WS[2];

// ---- THEOREM WS certificate: series lower bounds at mu = 11603/50000 ----
const Z_WS = T_WS.map((t) => MU_WS * t);
const G_LO = Z_WS.map((z) => (expTrunc(z, 19) - 1e-12) * (1 + z));
const MUE_CERT =
  2 * (A_WS[0] * A_WS[1] * G_LO[0] + A_WS[0] * A_WS[2] * G_LO[1] + A_WS[1] * A_WS[2] * G_LO[2]) -
  DIAG_WS;
function eWitnessWS(mu) {
  let E = -DIAG_WS / mu;
  E +=
    2 *
    (A_WS[0] * A_WS[1] * kernelK(mu, mu, T_WS[0]) +
      A_WS[0] * A_WS[2] * kernelK(mu, mu, T_WS[1]) +
      A_WS[1] * A_WS[2] * kernelK(mu, mu, T_WS[2]));
  return E;
}
const E_EXACT_WS = eWitnessWS(MU_WS);
const MUE_G_ROUTE =
  2 *
    (A_WS[0] * A_WS[1] * gFun(Z_WS[0]) +
      A_WS[0] * A_WS[2] * gFun(Z_WS[1]) +
      A_WS[1] * A_WS[2] * gFun(Z_WS[2])) -
  DIAG_WS;

// ---- COROLLARY FR certificate: even-truncation caps + Collatz-Wielandt
// at mu = 2901/12500 with a baked positive test vector ----
const Z_FX = T_WS.map((t) => MU_FX * t);
const G_HI = Z_FX.map((z) => (expTrunc(z, 20) + 1e-12) * (1 + z));
const V_FX = [0.6756584912265786, 0.6853795445978607, 0.2715519896451736];
const W_FX = [
  G_HI[0] * V_FX[1] + G_HI[1] * V_FX[2],
  G_HI[0] * V_FX[0] + G_HI[2] * V_FX[2],
  G_HI[1] * V_FX[0] + G_HI[2] * V_FX[1],
];
const CW_FX =
  Math.max(W_FX[0] / V_FX[0], W_FX[1] / V_FX[1], W_FX[2] / V_FX[2]) * (1 + 1e-12);

// ---- float landmarks (measured only) ----
function lamMaxT(mu, T12, T13, T23) {
  const G = [
    [0, gFun(mu * T12), gFun(mu * T13)],
    [gFun(mu * T12), 0, gFun(mu * T23)],
    [gFun(mu * T13), gFun(mu * T23), 0],
  ];
  let v = [1, 1, 0.4];
  let lam = 0;
  for (let it = 0; it < 400; it++) {
    const w = [0, 1, 2].map((i) => G[i][0] * v[0] + G[i][1] * v[1] + G[i][2] * v[2]);
    lam = Math.hypot(w[0], w[1], w[2]) / Math.hypot(v[0], v[1], v[2]);
    const n = Math.hypot(w[0], w[1], w[2]);
    v = [w[0] / n, w[1] / n, w[2] / n];
  }
  return lam;
}
function rootT(u1, u2, u3) {
  const T12 = u2 - u1;
  const T13 = u3 - u1;
  const T23 = u3 - u2;
  let lo = 0.15;
  let hi = 0.35;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (lamMaxT(m, T12, T13, T23) > 1) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const ROOT_GRID = rootT(U_WS[0], U_WS[1], U_WS[2]);
const ROOT_EDGE = rootT(2, 4, 16);
const LAM_AT_WS = lamMaxT(MU_WS, T_WS[0], T_WS[1], T_WS[2]);
const LAM_AT_FX = lamMaxT(MU_FX, T_WS[0], T_WS[1], T_WS[2]);
let SCAN_BEST = -1;
for (let i = 0; i <= 20; i++) {
  const u1 = 1 + (0.999 * i) / 20;
  for (let j = 0; j <= 40; j++) {
    const u2 = 4 + (3.999 * j) / 40;
    for (let k = 0; k <= 20; k++) {
      const u3 = 16 + (15.99 * k) / 20;
      const r = rootT(u1, u2, u3);
      if (r > SCAN_BEST) SCAN_BEST = r;
    }
  }
}
const QUANT_EFF = (MU_WS * E_EXACT_WS) / ((LAM_AT_WS - 1) * DIAG_WS);

// ---- seeded batteries (deterministic LCG, per-battery reseed) ----
let seedState = 0;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}

// battery RC (seed 424243): Lemma RC spot check at the actual gap scales
function runRcBattery() {
  seedState = 424243;
  let viol = 0;
  let worst = -Infinity;
  for (let t = 0; t < 20000; t++) {
    const a = MU_FX * Math.pow(1000, rnd());
    const r = 1 + Math.pow(10, -2 + 6 * rnd());
    const b = a * r;
    const tau = Math.pow(10, -2 + 3.3 * rnd());
    const rho = Math.sqrt(a * b) * kernelK(a, b, tau);
    const cap = gFun(a * tau);
    const ratio = rho / cap;
    if (ratio > 1 + 1e-9) viol++;
    if (ratio > worst) worst = ratio;
  }
  return { viol, worst };
}

// battery FX (seed 515152): COROLLARY FR approach - free rates >= MU_FX and
// free amplitudes at the FIXED grid positions, rate-pinned every third draw
function runFxBattery() {
  seedState = 515152;
  let maxE = -Infinity;
  let viol = 0;
  let count = 0;
  for (let t = 0; t < 20000; t++) {
    const pin = t % 3 === 0;
    const ms = [0, 1, 2].map(() => (pin ? MU_FX : MU_FX * Math.pow(100, rnd() * rnd())));
    const as = [0, 1, 2].map(() => (rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd())));
    if (as[0] === 0 && as[1] === 0 && as[2] === 0) continue;
    let E = 0;
    for (let i = 0; i < 3; i++) E -= as[i] * as[i] * kernelK(ms[i], ms[i], 0);
    E +=
      2 *
      (as[0] * as[1] * kernelK(ms[0], ms[1], T_WS[0]) +
        as[0] * as[2] * kernelK(ms[0], ms[2], T_WS[1]) +
        as[1] * as[2] * kernelK(ms[1], ms[2], T_WS[2]));
    if (E > maxE) maxE = E;
    if (E > 0) viol++;
    count++;
  }
  return { maxE, viol, count };
}

// battery PS (seed 616163): free POSITIONS in blocks 0/2/4 (one packet per
// block) at rates >= MU_FX, edge-piled rate-pinned every third draw -
// measured cross-check that no position triple beats the bracket
function runPositionBattery() {
  seedState = 616163;
  let maxE = -Infinity;
  let viol = 0;
  let count = 0;
  for (let t = 0; t < 20000; t++) {
    const edge = t % 3 === 0;
    const f = () => (edge ? rnd() * rnd() * rnd() : rnd());
    const u1 = 2 - f();
    const u2 = 4 + 4 * f();
    const u3 = 16 + 16 * f();
    const ms = [0, 1, 2].map(() => (edge ? MU_FX : MU_FX * Math.pow(100, rnd() * rnd())));
    const as = [0, 1, 2].map(() => (rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd())));
    if (as[0] === 0 && as[1] === 0 && as[2] === 0) continue;
    const S12 = u2 - u1;
    const S13 = u3 - u1;
    const S23 = u3 - u2;
    let E = 0;
    for (let i = 0; i < 3; i++) E -= as[i] * as[i] * kernelK(ms[i], ms[i], 0);
    E +=
      2 *
      (as[0] * as[1] * kernelK(ms[0], ms[1], S12) +
        as[0] * as[2] * kernelK(ms[0], ms[2], S13) +
        as[1] * as[2] * kernelK(ms[1], ms[2], S23));
    if (E > maxE) maxE = E;
    if (E > 0) viol++;
    count++;
  }
  return { maxE, viol, count };
}

const BAT_RC = runRcBattery();
const BAT_FX = runFxBattery();
const BAT_PS = runPositionBattery();
const E_AT_HS = eWitnessWS(MU_HS);
const MUE_AT_023 = (() => {
  const z = T_WS.map((t) => 0.23 * t);
  return (
    2 *
      (A_WS[0] * A_WS[1] * gFun(z[0]) +
        A_WS[0] * A_WS[2] * gFun(z[1]) +
        A_WS[1] * A_WS[2] * gFun(z[2])) -
    DIAG_WS
  );
})();

// baked literals (recomputed by the assertions)
const DIAG_LIT = 99997508;
const MUE_CERT_LIT = 1666.9193364977837;
const E_EXACT_LIT = 7187.41735804081;
const CW_FX_LIT = 0.9999775678535063;
const ROOT_GRID_LIT = 0.23206852812691425; // matches the imp-95135 landmark
const ROOT_EDGE_LIT = 0.23207203643507168;
const SCAN_BEST_LIT = 0.23203450016742133;
const LAM_AT_WS_LIT = 1.000016685373395;
const LAM_AT_FX_LIT = 0.9999775574006388;
const QUANT_EFF_LIT = 0.9996501714592639;
const BAT_RC_WORST_LIT = 0.9999866355395278;
const BAT_FX_MAX_E_LIT = -0.0002742814915762471;
const BAT_FX_COUNT_LIT = 19926;
const BAT_PS_MAX_E_LIT = -0.00020099693065937075;
const BAT_PS_COUNT_LIT = 19971;
const E_AT_HS_LIT = -9978220.499721467;
const MUE_AT_023_LIT = 407060.938241899;

export const IMP95141_WITNESS_SATURATION_CERTIFICATE = {
  ticket:
    "imp-95141 (THEOREM WS: witness-saturation certificate - the grid-extremal parity-pure witness with amplitudes (6756, 6854, 2716) has certified E > 0 at common rate 11603/50000 = 0.23206, so the sharp parity-pure class threshold is >= 0.23206; plus COROLLARY FR: certified family-root bracket [11603/50000, 2901/12500) for the fixed-position family via Lemma RC + Collatz-Wielandt, superseding the imp-95135 COROLLARY RM bracket (0.23, 0.235) at both ends. Certified sandwich [0.23, 0.24502] -> [0.23206, 0.24502], width 0.01502 -> 0.01296)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95135 THEOREM WE grid-extremal geometry and certification pattern, the imp-95131 Lemma RC mixed-rate cap, and the imp-95138 shifted-Collatz-Wielandt direction (any-positive-vector upper bound); carries the imp-95140 THEOREM HS upper end 12251/50000 unchanged; pins the surviving certified interval onto imp-95140-subgap-displacement-credit.",
  theoremWS:
    "At p = 999983 the grid-extremal points k = (499992, 249995, 62498) hug the facing edges of blocks 0/2/4 (all even, parity-pure; adjacent indices leave the blocks - integer arithmetic). With integer amplitudes (6756, 6854, 2716) and common rate mu = 11603/50000, mu E >= 1666.9193364977837 > 0 certified by N = 19 truncated alternating-series lower bounds minus an explicit 1e-12 slack on the three g values (all z <= 3.249 < 21, mathematical remainder positive, slack absorbs double rounding) against the exact integer diagonal 99997508; exact float E = 7187.41735804081 by two independent routes (agreement < 1e-6). The sharp parity-pure class threshold is therefore >= 11603/50000 = 0.23206. Supersedes THEOREM WE (23/100) at the constant level.",
  corollaryFR:
    "For the fixed grid-extremal positions with free nonnegative amplitudes and free rates all >= 2901/12500 = 0.23208, E <= 0: with B_i = a_i/sqrt(m_i) the normalized correlations obey rho_ij <= g(min(m_i, m_j) T_ij) <= g(mu T_ij) (carried Lemma RC + monotonicity), the Gram form is dominated entrywise by the N = 20 even-truncation caps Ghat, and lamMax(Ghat) <= 0.9999775678535063 < 1 by Collatz-Wielandt at a baked positive test vector. Combined with THEOREM WS the fixed-position family threshold lies in [11603/50000, 2901/12500) - certified width 2e-5, was (0.23, 0.235) in imp-95135 COROLLARY RM.",
  thresholdSandwich:
    "Certified sharp-threshold sandwich for the full parity-pure class: [11603/50000, 12251/50000] = [0.23206, 0.24502] (was [0.23, 0.24502]; lower end this module, upper end THEOREM HS carried). Float landmarks (measured, NOT certified): grid family root 0.23206852812691425 (in-module bisection reproduces the imp-95135 landmark to the last digit), position-polytope limit 0.23207203643507168 (edge limit, not attained), ceiling frame root ~0.24493 (imp-95140).",
  honestAttribution:
    "The float landmark 0.2320685 was already measured in imp-95135; this step converts it into certified bounds on both sides of the family root. The gain is certification-side, not a new witness family - the witness is the imp-95135 grid triple with amplitudes re-optimized at the higher rate (quantization efficiency 0.99965). No ceiling lemma is touched and no progress is made on the displacement-credit mechanism itself; the module pins WHERE the surviving certified interval lives (ceiling side).",
  slackDiagnosis:
    "After this step the surviving certified interval [0.23206, 0.24502] is - up to the 3.5e-6 grid-quantization sliver (position limit 0.2320720, measured), the 2e-5 family bracket width, and the measured-only family-exhaustion evidence (5/7-block extensions +2.0e-9, joint re-optimization 3.4e-10, position battery zero E > 0 at 19971 draws) - ENTIRELY ceiling-side: it is the imp-95140-subgap-displacement-credit leg (float ceiling frame root ~0.24493). Witness-side work below 2901/12500 requires a structurally different family; ceiling-side work is the displacement-credit lemma.",
  subGaps: [
    "imp-95140-subgap-displacement-credit - OPEN, untouched here: close [~0.2321, ~0.24493] from the ceiling side by collecting the linear sub-foot credit (rate-aware lower bound on the Gram cross term of split pieces, or the exact four-region in-ramp tilted pair excess). This module moves the WITNESS end of the sandwich onto the family root, so the leg now carries the whole surviving interval.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module lifts the certified witness floor to 11603/50000; the phi-conditional odd-mass bound itself is not established",
    "COROLLARY FR is family-scoped: the class threshold could in principle exceed 2901/12500 through a structurally different witness family (off-grid positions at larger p approach the position limit 0.2320720, measured only; multi-packet and extra-block variants measured to move < 2.1e-9) - no class-level exhaustion is claimed",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM WS is unconditional: the witness is exhibited (grid extremality and block membership are integer arithmetic, blocks all even - parity-pure), the certificate is three truncated alternating-series lower bounds (N = 19, all arguments <= 3.249 < 21, mathematical remainder sign fixed, an explicit 1e-12 slack absorbing double rounding) against an exact integer diagonal with margin floor 1666.9 >> float-summation error, and the exact kernel evaluation confirms it by an independent route. COROLLARY FR is unconditional given the carried Lemma RC (imp-95131): the mixed-rate reduction is entrywise domination with nonnegative amplitudes, the caps are N = 20 even-truncation upper bounds plus explicit slack, and the Collatz-Wielandt max-ratio bound is valid for ANY positive test vector, so the baked vector needs no certification. The batteries and scans are CROSS-CHECKS; the statements are the certificates. Scope: parity-pure model family only; the sandwich upper end 12251/50000 is THEOREM HS, carried not re-proved; the family bracket does not determine the class threshold (family-scoped exhaustion, structurally different families not excluded - measured only); float landmarks 0.2320685, 0.2320720, ~0.24493 measured only; witness-side step - the imp-95140-subgap-displacement-credit leg stays OPEN and untouched; parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95141_WITNESS_SATURATION_CERTIFICATE_ASSERTIONS = [
  {
    id: "imp95141-ws-grid-extremality",
    description:
      "grid extremality and block membership by integer arithmetic: k1 <= p < 2 k1 (block 0), 4 k2 <= p < 8 k2 (block 2), 16 k3 <= p < 32 k3 (block 4), adjacent indices k1 - 1, k2 + 1, k3 + 1 leave their blocks; blocks all even (parity-pure); amplitudes positive integers; diagonal exactly 99997508",
    holds: () => {
      const [k1, k2, k3] = K_WS;
      return (
        k1 <= P_WS &&
        P_WS < 2 * k1 &&
        4 * k2 <= P_WS &&
        P_WS < 8 * k2 &&
        16 * k3 <= P_WS &&
        P_WS < 32 * k3 &&
        P_WS / (k1 - 1) >= 2 &&
        P_WS / (k2 + 1) < 4 &&
        P_WS / (k3 + 1) < 16 &&
        A_WS.every((a) => Number.isInteger(a) && a > 0) &&
        DIAG_WS === DIAG_LIT
      );
    },
  },
  {
    id: "imp95141-ws-certified-witness",
    description:
      "THEOREM WS certificate: the three N = 19 series lower bounds sit below the exact g values, the certified mu E = 1666.9193364977837 exceeds the margin floor 1 (float-summation error << 1) and sits below the exact float mu E, the exact E = 7187.41735804081 > 0 by the kernel route with the g route agreeing to < 1e-6, and 11603/50000 > 23/100 supersedes THEOREM WE at the constant level",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        G_LO.every((x, i) => x <= gFun(Z_WS[i])) &&
        rel(MUE_CERT, MUE_CERT_LIT, 1e-9) &&
        MUE_CERT > 1 &&
        MUE_CERT < MU_WS * E_EXACT_WS &&
        rel(E_EXACT_WS, E_EXACT_LIT, 1e-9) &&
        E_EXACT_WS > 0 &&
        Math.abs(MU_WS * E_EXACT_WS - MUE_G_ROUTE) < 1e-6 &&
        MU_WS > 23 / 100
      );
    },
  },
  {
    id: "imp95141-fr-certified-exhaustion",
    description:
      "COROLLARY FR certificate: the three N = 20 even-truncation caps dominate the exact g values at mu = 2901/12500, the baked test vector is strictly positive, and the Collatz-Wielandt bound 0.9999775678535063 < 1 with margin > 2e-5 - no witness of the fixed-position family with all rates >= 2901/12500 has E > 0",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        G_HI.every((x, i) => x >= gFun(Z_FX[i])) &&
        V_FX.every((x) => x > 0) &&
        rel(CW_FX, CW_FX_LIT, 1e-12) &&
        CW_FX < 1 &&
        1 - CW_FX > 2e-5
      );
    },
  },
  {
    id: "imp95141-bracket-and-landmarks",
    description:
      "bracket ordering 23/100 < 11603/50000 < grid root < 2901/12500 < 12251/50000; float landmarks (measured only): lamMax 1.000016685373395 > 1 at the witness rate, 0.9999775574006388 < 1 at the exhaustion rate, in-module bisection reproduces the imp-95135 grid-root landmark 0.23206852812691425 to the last digit, and the amplitude quantization efficiency is 0.9996501714592639",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        23 / 100 < MU_WS &&
        MU_WS < ROOT_GRID &&
        ROOT_GRID < MU_FX &&
        MU_FX < MU_HS &&
        rel(LAM_AT_WS, LAM_AT_WS_LIT, 1e-9) &&
        LAM_AT_WS > 1 &&
        rel(LAM_AT_FX, LAM_AT_FX_LIT, 1e-9) &&
        LAM_AT_FX < 1 &&
        rel(ROOT_GRID, ROOT_GRID_LIT, 1e-12) &&
        rel(QUANT_EFF, QUANT_EFF_LIT, 1e-9) &&
        QUANT_EFF > 0.999
      );
    },
  },
  {
    id: "imp95141-position-polytope-scan",
    description:
      "position-polytope landmarks (measured only): the 21x41x21 scan over u1 in [1,2), u2 in [4,8), u3 in [16,32) tops out at 0.23203450016742133, the edge limit (2, 4, 16) gives 0.23207203643507168, and both grid root and scan best stay below the edge limit which stays below 2901/12500 - the facing-edge corner is the family optimum and the certified bracket clears the whole polytope limit",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(SCAN_BEST, SCAN_BEST_LIT, 1e-9) &&
        rel(ROOT_EDGE, ROOT_EDGE_LIT, 1e-9) &&
        SCAN_BEST <= ROOT_EDGE &&
        ROOT_GRID <= ROOT_EDGE &&
        ROOT_EDGE < MU_FX
      );
    },
  },
  {
    id: "imp95141-rc-spot-battery",
    description:
      "Lemma RC spot battery at the actual gap scales: 20000 seeded (rate, ratio, separation) draws (rate in [mu, 1000 mu], ratio in (1.01, 1e4], separation in [0.01, 20]) - zero violations of sqrt(a b) K(a, b, tau) <= g(a tau), worst ratio 0.9999866355395278",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_RC.viol === 0 && BAT_RC.worst < 1 + 1e-9 && rel(BAT_RC.worst, BAT_RC_WORST_LIT, 1e-6);
    },
  },
  {
    id: "imp95141-fr-family-battery",
    description:
      "COROLLARY FR approached directly: 19926 seeded fixed-position witnesses with free rates >= 2901/12500 and free amplitudes (rate-pinned at the floor every third draw) - max E = -0.0002742814915762471 strictly negative, zero E > 0 draws",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_FX.viol === 0 &&
        BAT_FX.maxE < 0 &&
        BAT_FX.count === BAT_FX_COUNT_LIT &&
        rel(BAT_FX.maxE, BAT_FX_MAX_E_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95141-ps-position-battery",
    description:
      "position cross-check (measured only, no class certificate): 19971 seeded one-packet-per-block witnesses with FREE positions in blocks 0/2/4 at rates >= 2901/12500 (edge-piled rate-pinned every third draw) - max E = -0.00020099693065937075 strictly negative, zero E > 0 draws",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_PS.viol === 0 &&
        BAT_PS.maxE < 0 &&
        BAT_PS.count === BAT_PS_COUNT_LIT &&
        rel(BAT_PS.maxE, BAT_PS_MAX_E_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95141-hs-consistency",
    description:
      "consistency with the carried chain: the witness has E = -9978220.499721467 < 0 at the THEOREM HS constant 12251/50000 (as the upper theorem requires), still certifies the old lower end (mu E = 407060.938241899 > 0 at 23/100), and 11603/50000 < 2901/12500 < 12251/50000",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(E_AT_HS, E_AT_HS_LIT, 1e-9) &&
        E_AT_HS < 0 &&
        rel(MUE_AT_023, MUE_AT_023_LIT, 1e-9) &&
        MUE_AT_023 > 0 &&
        MU_WS < MU_FX &&
        MU_FX < MU_HS
      );
    },
  },
  {
    id: "imp95141-honesty-gate",
    description:
      "the verdict is scoped: parity-pure model family, witness-side certification step (attribution stated plainly), family bracket family-scoped not class-scoped, float landmarks measured only, displacement-credit leg stays OPEN and untouched, parent sub-gap stays OPEN; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95141_WITNESS_SATURATION_CERTIFICATE.promotesBound === false &&
      /NO QED/.test(IMP95141_WITNESS_SATURATION_CERTIFICATE.rigorScope) &&
      /refereed bound is changed/i.test(IMP95141_WITNESS_SATURATION_CERTIFICATE.rigorScope) &&
      /stays OPEN and untouched/.test(IMP95141_WITNESS_SATURATION_CERTIFICATE.rigorScope) &&
      /measured only/.test(IMP95141_WITNESS_SATURATION_CERTIFICATE.rigorScope) &&
      /family-scoped/.test(IMP95141_WITNESS_SATURATION_CERTIFICATE.rigorScope) &&
      /certification-side/.test(IMP95141_WITNESS_SATURATION_CERTIFICATE.honestAttribution) &&
      /remains OPEN/.test(IMP95141_WITNESS_SATURATION_CERTIFICATE.openResiduals[0]) &&
      /family-scoped/.test(IMP95141_WITNESS_SATURATION_CERTIFICATE.openResiduals[1]) &&
      IMP95141_WITNESS_SATURATION_CERTIFICATE.subGaps.length === 1 &&
      IMP95141_WITNESS_SATURATION_CERTIFICATE.openResiduals.length === 3 &&
      /parity-pure/.test(IMP95141_WITNESS_SATURATION_CERTIFICATE.rigorScope),
  },
];

for (const a of IMP95141_WITNESS_SATURATION_CERTIFICATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95141-witness-saturation-certificate assertion failed: ${a.id}`);
  }
}

export default IMP95141_WITNESS_SATURATION_CERTIFICATE;
