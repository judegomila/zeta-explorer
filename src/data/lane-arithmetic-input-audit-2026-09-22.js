/**
 * @module lane-arithmetic-input-audit-2026-09-22
 * @fileoverview
 * Attempt to break the Route VII floor U ~ 0.145-0.150 by supplying ARITHMETIC
 * INPUT to the tail/lane mechanism of the Polymath15 barrier (Theorem 1.2 of
 * arXiv:1904.12438: Lambda <= t0 + y0^2/2 given (i) RH to height X/2, (ii) the
 * barrier at x in [X, X+1], (iii) H_{t0}(x+iy) != 0 for x >= X, y0 <= y <=
 * sqrt(1-2t0)). Result: NO unconditional input closes the lane; ONE precise
 * conditional theorem (flow descent) and ONE precise obstruction (mean values
 * lose to the triangle inequality in the lane) are delivered. NO QED. No refereed bound is changed
 * . RH open.
 *
 * 1. THE EXACT GAP (what must improve).
 * Hypothesis (iii) is certified through the effective approximate functional
 * equation: the B-side is a heat-lifted mollified Dirichlet polynomial
 *   F_N(s) = M(s) sum_{n<=N} b_n^t n^{-s},  b_n^t = exp((t/4) ln^2 n),
 *   Re s = sigma1 = 1/2 + y/2 + (t/2) ln N - delta_hat,  N = sqrt(x/4pi),
 * and the verifier (verify_tail_arb.c, sealed a74738de) closes when the
 * absolute-value (triangle-inequality) contraction D = P + TR + OV + Mmax*AB
 * is < 1, which by the two Arb calibration points happens at
 *   (t/2) ln N1* + y/2 = c0 = 1.2218525, i.e. closing abscissa sigma_c = 1/2 + c0
 *   = 1.7219 (imp-95218: ln N1* = (2c0 - y)/t + L0, L0 = 1.1676).
 * sigma_c = 1.72 is no accident: it is where zeta(sigma) - 1 = 1, i.e. where
 * the UNMOLLIFIED triangle inequality first closes; the P1113 mollifier and the
 * caps buy back only the head. The lane N in [N_seam = 690,988, N1*] must then
 * be certified row by row. For a U = 0.145 row (t0 = 0.1314, y0 = 0.165):
 * ln N1* = 18.51, N1* = 1.09e8, lane = 1.09e8 rows ~ 1.44e3 CPU-days at the
 * landmark-row price 1.143 s/row (2x the K2 economic line 5.5e7).
 *
 * What the lane is NOT about: zeros of zeta. At the seam the B-side abscissa is
 * already sigma1 = 1.466 and even the worst term n = N sits at effective
 * abscissa sigma1 - (t/4) ln N = 1.03-1.15 (> 1): zeta has no zeros there, so
 * no zero-distribution theorem constrains the object whose L1 norm is failing.
 * The lane is the price of the TRIANGLE INEQUALITY over an x-window of height
 * 8 pi N, where the inequality is far from sharp (Bohr/Kronecker alignment of
 * N phases needs height ~ eps^{-N}, not 8 pi N); the rows compute the actual
 * window suprema.
 *
 * The heat flow gives an independent reading of the same threshold. Zeros of
 * H_t obey dz_k/dt = 2 sum_{j != k} 1/(z_k - z_j) (Csordas-Smith-Varga;
 * used rigorously in Rodgers-Tao arXiv:1801.05914). For a nonreal zero
 * x + iy embedded in real zeros of density rho = ln N / (2 pi) (the H_0 zero
 * density at x = 4 pi N^2) the imaginary part obeys dy/dt ~ -1/y - ln N, so
 * a zero starting at y = 1 (beta = 1) reaches y0 when t ln N = 1 - y0, i.e.
 * exactly when 1/2 + y0/2 + (t/2) ln N = 1: the SC-gate abscissa sigma = 1.
 * The triangle inequality needs sigma = 1.72 instead of 1; the shortfall
 * (2c0 - 1)/t + L0 = 12.2 nats = 5.3 decades in N at t = 0.13 IS the lane.
 *
 * 2. THE INPUTS, ASSESSED.
 * (a) Zero density (Guth-Maynard A = 30/13). Two independent reasons it buys
 *     zero margin: the lane object lives at abscissa > 1 where density is
 *     vacuous; and in the flow reading, N(sigma,T) <= T^{A(1-sigma)+o(1)} at
 *     sigma = 1/2 + y0/2 = 0.5825 allows 1.05e12 off-line zeros up to
 *     T = 3e12 (8% of N(T)) and 1.8e16 up to 7.5e16 -- no constraint on the
 *     LOCAL configuration around any one off-line zero. Even the Density
 *     Hypothesis (A = 2) allows 2.6e10 / 1.2e14. Lambda-inert, as recorded in
 *     zero-density-lambda-inert-2026-07-09; this extends the verdict to the lane.
 * (b) Twisted moments / Bettin-Gonek / F(alpha). These are means over a
 *     height window; the lane needs sup over each window. The Riemann-Siegel
 *     length N = sqrt(T/2pi) is far below the window height, so the mean
 *     square IS available (Montgomery-Vaughan diagonal), but converting a
 *     mean square E2 = sum |c_n|^2 n^{-2 sigma_eff} into "no exceptional
 *     unit cell" over a window of height 8 pi N needs E2 < 1/(4 pi N)
 *     (large sieve), which in the same crude tail-cap model requires sigma1 =
 *     1.81 at the seam versus 1.86 for the L1 cap itself: the square-root
 *     gain is eaten by the (4 pi N)^{-1} exceptional-cell budget. Any
 *     mean-value input is at best on par with the triangle inequality in
 *     the lane (MV-CAP of proportion-to-all-bridge-2026-09-22 in its lane
 *     form). Further, b_{mn}^t != b_m^t b_n^t (cross term (t/2) ln m ln n):
 *     the heat lift destroys multiplicativity, so Euler-product / Kloosterman
 *     / explicit-formula structure does not transfer to t > 0 at all.
 * (c) Explicit-formula tail sharper than 2 sum Lambda(n) n^{-1/2}. In the flow
 *     reading the descent rate of a zero z0 of H_t is Im (H_t''/H_t')(z0) =
 *     Im 2 sum_{j != 0} 1/(z0 - z_j): a Hadamard sum over zeros, whose prime
 *     side (explicit formula with the Poisson kernel 2y/(u^2+y^2), transform
 *     e^{-y|xi|}) is a von Mangoldt sum at abscissa 1/2 + y/2 < 1 evaluated at
 *     the height of the off-line zero, POINTWISE. Its trivial majorant exceeds
 *     the main term ln N; any nontrivial pointwise bound there is a
 *     zero-free-region-strength statement at that height (T3 <-> strip
 *     dictionary). Not available.
 *
 * 3. DELIVERABLES.
 * (A) CONDITIONAL THEOREM (flow descent). Fix t0, y0, X = 6.000000185827e12,
 *     Gamma1 = 2 pi N1*(t0,y0)^2. Assume (i) and (ii) of P15 Thm 1.2 and
 *   (H_desc(p)): for every t in [0, t0] and every nonreal zero z = x + iy of
 *   H_t with x >= X and 4 pi N_seam^2 <= x <= 4 pi N1*^2 that is topmost
 *   among zeros within horizontal distance 2 (y >= y_j whenever |x - x_j| <= 2),
 *   the real zeros of H_t pull with total strength
 *       P(z) := sum_{x_j real} 2y / ((x - x_j)^2 + y^2) >= p.
 * Then Lambda <= t0 + y0^2/2 provided p >= p_req(t0, y0), where p_req solves
 *   int_{y0}^{1} Y dY / (1 + p Y) = t0.
 * Proof sketch (rigorous modulo the zero ODE for H_t, Rodgers-Tao Sec. 3):
 * Lemma (far pairs pull down): for a conjugate pair z_j, conj(z_j) at horizontal
 * distance Delta >= 2 from z, the net vertical force
 *   -2a/(Delta^2 + a^2) - 2b/(Delta^2 + b^2),  a = y - y_j, b = y + y_j,
 * is <= 0 since b >= |a| and u -> u/(Delta^2 + u^2) increases on [0, Delta]
 * (all |y| <= 1). Zeros within distance 2 that are lower (a >= 0) pull down;
 * real zeros pull down; the self-term is -1/y. Hence for a locally topmost
 * nonreal zero dy/dt <= -1/y - P(z) <= -1/y - p, and integrating from y(0) <= 1
 * (all zeros of H_0 have |Im| <= 1) gives y(t0) < y0 as soon as
 * int_{y0}^1 Y/(1 + pY) dY < t0; the sup over zeros in the lane is attained
 * or approached by locally topmost zeros, so (iii) holds on the lane, the
 * triangle tail covers x >= 4 pi N1*^2, and de Bruijn's theorem finishes.
 * With p = 0 the criterion reads t0 >= (1 - y0^2)/2, i.e. de Bruijn's
 * Lambda <= 1/2: the flow with no arithmetic input reproduces exactly the
 * classical bound, and every unit of p is arithmetic input.
 * Numbers: U = 0.145 (t0 = 0.1314, y0 = 0.165): p_req = 4.37. Reading p as
 * f * ln N (a fraction f of the nearby zeros real, spread at the mean
 * density): f_req = 0.33 at the seam (ln N = 13.45), 0.24 at N1* (ln N = 18.5).
 * For reference, the P15 headline row (t0 = 0.2, y0 = 0.2) would need
 * p_req = 2.17 (f = 0.16).
 * STATUS OF THE INPUT. (H_desc) at t = 0 is a statement about zeta: near
 * EVERY off-line zero at heights in [3.0e12, Gamma1 ~ 7.5e16], at least about
 * one third of the zeros within a few mean spacings are on the line, with the
 * Poisson weight 2y/(u^2 + y^2) (window half-width ~ y <= 1 in x, i.e. ~2-4
 * mean spacings). It is implied by RH to height Gamma1 (the verified-height
 * lever, 2.5e4x the current height) and by nothing else known: the
 * unconditional 2/3 (Alpoge-Furman / Lamzouri) and Levinson 5/12 are averages
 * over [T, 2T] with errors >= T^{1-delta}; the short-interval Levinson results
 * need H >= T^{1/2+eps} ~ 1.7e6 (about 1e7 zeros) at T = 3e12, ~1e6 times the
 * window required, and carry no explicit constants. MV-CAP: no mean value
 * certifies an every-window statement. Zero-density permits 1e12 off-line
 * zeros in the range and says nothing about their clustering. (H_desc) is
 * strictly weaker than RH-to-Gamma1 (it tolerates off-line zeros provided they
 * do not cluster to > 2/3 of a local window) and is not implied by any
 * zero-free region (those live at sigma > 1 - c/ln T). It is a pointwise
 * anti-clustering hypothesis on off-line zeros -- the same shape as the
 * frontier-dag (ZR) zero-repulsion object.
 * (B) OBSTRUCTION (mean values lose in the lane). For the lane object, the
 *     pointwise certificate over a window of height 8 pi N obtained from any
 *     L2 / large-sieve input needs E2 < 1/(4 pi N), an abscissa threshold
 *     (1.81 at the seam in the tail-cap model) no better than the triangle
 *     inequality's (1.86 same model; 1.72 measured for the full D). Hence
 *     zero-density, twisted moments, F(alpha) and mean-square explicit-formula
 *     bounds cannot lower N1* below the triangle value; the only lane-shrinking
 *     inputs are pointwise: (H_desc), or RH itself to greater height.
 *
 * 4. HONEST VERDICT. Lambda < 0.145 is NOT established. Delivered: the
 * conditional theorem "Lambda <= 0.145 given (H_desc(4.37)) on heights
 * [3e12, 7.5e16]" with the input's status (pointwise anti-clustering of
 * off-line zeros; implied by RH-to-7.5e16; no known theorem approaches it;
 * MV-CAP forbids mean-value proofs), and the quantified obstruction that
 * every mean-value arithmetic input is dominated by the triangle inequality
 * inside the lane. The floor U ~ 0.145-0.150 stands; its breaking input is
 * named and is pointwise, not mean-value. NO QED.
 * Import-free (no zeros bundle, no sibling imports); literals carried from
 * imp-95218 (c0, L0), imp-95206 (Mmax, MHEAD), pt-floor-sensitivity-audit.
 */

const C0 = 1.2218525; // imp-95218 calibrated closing threshold (t/2) ln N1* + y/2
const L0 = 1.1676005; // imp-95218 additive offset
const N_SEAM = 690988; // sqrt(X / 4 pi), X = 6.000000185827e12
const SEC_PER_ROW = (1000 * 3600) / 3149013; // imp-95218 landmark-row price
const MMAX = 1.6226059348332891; // imp-95206 Mmax at N1*
const MHEAD = 153814;

export const lnN1Star = (t, y) => (2 * C0 - y) / t + L0;
export const lnNFlow = (t, y) => (1 - y) / t; // sigma = 1/2 + y/2 + (t/2) ln N = 1
export const sigmaClosing = 0.5 + C0; // 1.7219
// zeta(sigma) - 1 = 1 root (unmollified triangle closing); series summed directly
export function zetaMinusOne(s) {
  let acc = 0;
  for (let n = 2; n < 200000; n++) acc += Math.pow(n, -s);
  // Euler-Maclaurin tail from 200000
  acc += Math.pow(200000, 1 - s) / (s - 1);
  return acc;
}
export const tNeeded = (p, y0) => (1 - y0) / p - (Math.log(1 + p) - Math.log(1 + p * y0)) / (p * p);
export function pRequired(t0, y0) {
  let lo = 1e-6, hi = 1e4;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (tNeeded(m, y0) > t0) lo = m; else hi = m;
  }
  return hi;
}
// far-pair net vertical force on a nonreal zero at height y from a conjugate pair (y_j) at distance Delta
export const farPairForce = (y, yj, Delta) => {
  const a = y - yj, b = y + yj;
  return -2 * a / (Delta * Delta + a * a) - 2 * b / (Delta * Delta + b * b);
};
export const densityAllowance = (A, T, sigma) => Math.pow(T, A * (1 - sigma));
export const zeroCount = (T) => (T / (2 * Math.PI)) * Math.log(T / (2 * Math.PI));

// crude tail-cap model at the seam (n > MHEAD, |c_n| <= Mmax, effective abscissa sigma1 - (t/4) ln n)
export function l1CapThreshold(t, y, N) {
  const lnMH = Math.log(MHEAD);
  let s = 0.6;
  while (s < 5) {
    const E1 = (MMAX * Math.exp((0.75 + y / 4 - s / 2) * lnMH)) / (s / 2 - 0.25 - y / 4);
    if (E1 < 0.5) return s;
    s += 1e-3;
  }
  return s;
}
export function l2PointwiseThreshold(t, y, N) {
  const lnMH = Math.log(MHEAD);
  let s = 0.6;
  while (s < 5) {
    const E2 = (MMAX * MMAX * Math.exp((0.5 - y / 2 - s) * lnMH)) / (s - 0.5 + y / 2);
    if (E2 < 1 / (4 * Math.PI * N)) return s;
    s += 1e-3;
  }
  return s;
}

const TARGET = Object.freeze({ t0: 0.1314, y0: 0.165, U: 0.1314 + 0.165 * 0.165 / 2 }); // 0.14501
const N1_TARGET = Math.exp(lnN1Star(TARGET.t0, TARGET.y0));
const GAMMA1 = 2 * Math.PI * N1_TARGET * N1_TARGET;

export const LANE_ARITHMETIC_INPUT_AUDIT = Object.freeze({
  id: 'lane-arithmetic-input-audit-2026-09-22',
  date: '2026-09-22',
  objective: 'Lambda < 0.145 via arithmetic input to the P15 tail/lane mechanism',
  outcome: 'NOT ESTABLISHED; conditional theorem + obstruction delivered',
  target: TARGET,
  gap: Object.freeze({
    sigmaClosing,
    sigmaFlow: 1,
    lnN1Star: lnN1Star(TARGET.t0, TARGET.y0), // 18.51
    n1Star: N1_TARGET, // 1.09e8
    laneRows: N1_TARGET - N_SEAM,
    laneCpuDays: ((N1_TARGET - N_SEAM) * SEC_PER_ROW) / 86400, // ~1.44e3
    lnNFlow: lnNFlow(TARGET.t0, TARGET.y0), // 6.35
    shortfallNats: lnN1Star(TARGET.t0, TARGET.y0) - lnNFlow(TARGET.t0, TARGET.y0), // 12.2
    shortfallDecades: (lnN1Star(TARGET.t0, TARGET.y0) - lnNFlow(TARGET.t0, TARGET.y0)) / Math.LN10, // 5.3
    sigma1AtSeam: 0.5 + TARGET.y0 / 2 + (TARGET.t0 / 2) * Math.log(N_SEAM), // 1.466
    worstTermAbscissaAtN1Star: 0.25 + TARGET.y0 / 4 + sigmaClosing / 2, // 1.15
    gamma1: GAMMA1, // 7.5e16 (zeta height where the triangle tail takes over)
  }),
  inputs: Object.freeze({
    zeroDensity: Object.freeze({
      verdict: 'Lambda-inert in the lane: vacuous at abscissa > 1; permits ~1e12 off-line zeros with beta >= 0.5825 up to 3e12',
      guthMaynardA: 30 / 13,
      allowedOffLineTo3e12: densityAllowance(30 / 13, 3e12, 0.5825),
      allowedOffLineToGamma1: densityAllowance(30 / 13, GAMMA1, 0.5825),
      densityHypothesisTo3e12: densityAllowance(2, 3e12, 0.5825),
    }),
    meanValues: Object.freeze({
      verdict: 'L2/large-sieve to pointwise over a window of height 8 pi N needs E2 < 1/(4 pi N): threshold no better than L1',
      l1CapThresholdAtSeam: l1CapThreshold(TARGET.t0, TARGET.y0, N_SEAM),
      l2PointwiseThresholdAtSeam: l2PointwiseThreshold(TARGET.t0, TARGET.y0, N_SEAM),
      multiplicativityBroken: 'b_{mn}^t / (b_m^t b_n^t) = exp((t/2) ln m ln n) != 1',
    }),
    explicitFormula: Object.freeze({
      verdict: 'descent rate = Im(H_t\'\'/H_t\')(z0): a POINTWISE von Mangoldt sum at abscissa 1/2 + y/2 at the height of the off-line zero; nontrivial bound = zero-free-region strength there',
    }),
  }),
  conditionalTheorem: Object.freeze({
    statement:
      'Lambda <= t0 + y0^2/2 given P15 (i),(ii) and H_desc(p): every locally topmost nonreal zero of H_t (t <= t0) at heights in the lane is pulled by real zeros with total Poisson strength >= p, for p >= p_req(t0,y0) solving int_{y0}^1 Y/(1+pY) dY = t0',
    pReq: pRequired(TARGET.t0, TARGET.y0), // 4.37
    fReqAtSeam: pRequired(TARGET.t0, TARGET.y0) / Math.log(N_SEAM), // 0.33
    fReqAtN1Star: pRequired(TARGET.t0, TARGET.y0) / lnN1Star(TARGET.t0, TARGET.y0), // 0.24
    deBruijnCheck: 'p = 0 reproduces Lambda <= 1/2: t0 >= (1 - y0^2)/2',
    heightRange: [3.0e12, GAMMA1],
    inputStatus:
      'pointwise anti-clustering of off-line zeros near every off-line zero; implied by RH to 7.5e16; implied by no known theorem (averages over [T,2T] or windows >= T^{1/2+eps}; MV-CAP); not a zero-free region; same shape as the (ZR) repulsion object',
    rigorCaveat: 'proof uses the zero ODE dz/dt = 2 sum 1/(z - z_j) for H_t (Rodgers-Tao Sec. 3) and a sup-attainment step; both flagged for referee',
  }),
  // C1 Palm correction (rh-bridge-mirror-descent-2026-09-25, imp-97059): the f_req = p_req / ln N
  // reading above implicitly used the FULL mean pull ln N (mean density ln N/(2 pi) times the real
  // Poisson kernel mass 2 pi) as the all-real baseline. That is the wrong (unconditioned) baseline.
  // Conditioned on the topmost zero z being present (neutral rigid lattice, spacing 2 pi/ln N, the
  // topmost pair pair-excluded, first neighbour at 1.5 s, both sides), the all-real neutral pull is
  // only P_neutral(y0) = 2.741 = 0.204 ln N at the seam and 5.063 = 0.274 ln N at N1*, not ln N. So
  // p_req is not a fraction f < 2/3 of an all-real window; the corrected fraction f_req_corrected =
  // p_req / P_neutral is 1.596 at the seam (> 1: a LOCAL SURPLUS over even the all-real neutral
  // configuration, the lane analog of the mirror 1.73x) and 0.864 at N1*. No shortage vanishes; the
  // constant-p form demands a surplus at the seam. Model/measurement only; NS-RIGID class; no bound.
  palmCorrection: Object.freeze({
    baselineError: 'the f_req = p_req / ln N reading used the unconditioned full mean pull ln N as the all-real baseline; the correct conditioned-on-a-zero (neutral rigid Palm) all-real pull is smaller',
    allRealNeutralPullSeam: 2.741, // 0.204 ln N (ln N = 13.446)
    allRealNeutralPullN1Star: 5.063, // 0.274 ln N (ln N = 18.509)
    fReqNaiveSeam: 0.325,
    fReqNaiveN1Star: 0.236,
    fReqCorrectedSeam: 1.596, // p_req / all-real neutral pull; > 1 = local surplus over all-real neutral
    fReqCorrectedN1Star: 0.864,
    verdict: 'the naive f_req UNDERSTATES the requirement by 1/0.204 ~ 4.9x at the seam; corrected f_req_corrected = 1.596 > 1 means the constant-p form needs a local surplus over the all-real neutral configuration at the seam (0.864 at N1*), not a sub-2/3 fraction; no-shortage framing REFUTED, matching the mirror-descent C1 correction',
  }),
  status: 'RH open; no refereed bound is changed; Lambda < 0.145 NOT established; NO QED',
  files: [
    'src/data/imp-95218-route7-cost-curve.js',
    'src/data/imp-95206-t-p1-tail-repricing.js',
    'src/data/pt-floor-sensitivity-audit-2026-07-08.js',
    'src/data/zero-density-lambda-inert-2026-07-09.js',
    'src/data/proportion-to-all-bridge-2026-09-22.js',
    'src/data/levinson-mollifier-frontier-audit-2026-09.js',
    'tmp/ytransfer_proof.md',
    '~/dbn-lambda-audit-review/verifiers/verify_tail_arb.c',
  ],
});

const near = (a, b, tol) => Math.abs(a - b) <= tol;

export const LANE_ARITHMETIC_INPUT_AUDIT_ASSERTIONS = Object.freeze([
  {
    id: 'laia-closing-abscissa-is-unmollified-triangle-root',
    why: 'sigma_c = 1/2 + c0 = 1.722 coincides with the root of zeta(sigma) - 1 = 1 (1.7286) to 7e-3: the mollifier buys back only the head',
    holds: () => near(sigmaClosing, 1.7219, 1e-3) && near(zetaMinusOne(1.7286), 1, 2e-3) && Math.abs(sigmaClosing - 1.7286) < 7e-3,
  },
  {
    id: 'laia-lane-size-at-0145',
    why: 'U = 0.145 (t0 = 0.1314, y0 = 0.165) prices N1* ~ 1.09e8, 1.4e3 CPU-days, 2x the K2 line; shortfall vs the sigma = 1 flow floor is 12.2 nats',
    holds: () => {
      const g = LANE_ARITHMETIC_INPUT_AUDIT.gap;
      return near(LANE_ARITHMETIC_INPUT_AUDIT.target.U, 0.14501, 1e-5) && g.n1Star > 1.0e8 && g.n1Star < 1.2e8 &&
        g.laneRows > 5.5e7 && g.laneRows < 3 * 5.5e7 && g.laneCpuDays > 1300 && g.laneCpuDays < 1600 &&
        near(g.shortfallNats, 12.15, 0.05) && g.sigma1AtSeam > 1 && g.worstTermAbscissaAtN1Star > 1;
    },
  },
  {
    id: 'laia-far-pair-lemma',
    why: 'a conjugate pair at horizontal distance >= 2 exerts a net downward force on any nonreal zero with 0 < y, y_j <= 1, even when y_j > y (grid check), while a nearer higher zero can push up',
    holds: () => {
      for (let D = 2; D <= 50; D += 0.5)
        for (let y = 0.01; y <= 1; y += 0.03)
          for (let yj = 0.01; yj <= 1; yj += 0.03)
            if (farPairForce(y, yj, D) > 0) return false;
      return farPairForce(0.2, 0.9, 0.5) > 0;
    },
  },
  {
    id: 'laia-descent-criterion-reproduces-de-bruijn',
    why: 'with p -> 0 the descent criterion is t0 >= (1 - y0^2)/2 (Lambda <= 1/2); p_req(0.1314, 0.165) = 4.37 and p_req grows as t0 falls',
    holds: () =>
      near(tNeeded(1e-3, 0.165), (1 - 0.165 * 0.165) / 2, 1e-3) &&
      near(pRequired(0.1314, 0.165), 4.374, 5e-3) &&
      pRequired(0.1262875, 0.165) > pRequired(0.1314, 0.165) &&
      near(pRequired(0.2, 0.2), 2.174, 5e-3) &&
      near(tNeeded(pRequired(0.1314, 0.165), 0.165), 0.1314, 1e-9),
  },
  {
    id: 'laia-required-local-real-fraction',
    why: 'p_req read as f * ln N gives f ~ 0.33 at the seam and ~ 0.24 at N1*: below the unconditional average 2/3 but required in EVERY window',
    holds: () => {
      const c = LANE_ARITHMETIC_INPUT_AUDIT.conditionalTheorem;
      return near(c.fReqAtSeam, 0.325, 5e-3) && near(c.fReqAtN1Star, 0.236, 5e-3) && c.fReqAtSeam < 2 / 3 && c.fReqAtSeam < 5 / 12;
    },
  },
  {
    id: 'laia-palm-corrected-real-fraction-is-a-surplus',
    why: 'C1 (imp-97059): under the conditioned-on-a-zero neutral Palm baseline the all-real pull is only 0.204 ln N at the seam, so p_req is a local SURPLUS (corrected f_req = 1.596 > 1), not a sub-2/3 fraction; naive reading understates ~4.9x',
    holds: () => {
      const pc = LANE_ARITHMETIC_INPUT_AUDIT.palmCorrection;
      const pReq = pRequired(TARGET.t0, TARGET.y0);
      return near(pc.fReqCorrectedSeam, pReq / pc.allRealNeutralPullSeam, 5e-3) &&
        near(pc.fReqCorrectedN1Star, pReq / pc.allRealNeutralPullN1Star, 5e-3) &&
        pc.fReqCorrectedSeam > 1 && pc.fReqCorrectedSeam > pc.fReqNaiveSeam &&
        near(pc.allRealNeutralPullSeam / Math.log(N_SEAM), 0.204, 3e-3);
    },
  },
  {
    id: 'laia-zero-density-allowance',
    why: 'Guth-Maynard permits ~1e12 off-line zeros with beta >= 0.5825 below 3e12 (8% of N(T)); DH permits 2.6e10; neither is < 1 anywhere in the lane',
    holds: () => {
      const z = LANE_ARITHMETIC_INPUT_AUDIT.inputs.zeroDensity;
      return z.allowedOffLineTo3e12 > 1e12 && z.allowedOffLineTo3e12 / zeroCount(3e12) > 0.05 &&
        z.allowedOffLineToGamma1 > 1e16 && z.densityHypothesisTo3e12 > 1e10;
    },
  },
  {
    id: 'laia-mean-value-no-gain-over-triangle',
    why: 'in the same tail-cap model the L2-to-pointwise threshold (1.81) is within 0.05 of the L1 threshold (1.86): the (4 pi N)^{-1} cell budget eats the square-root gain',
    holds: () => {
      const m = LANE_ARITHMETIC_INPUT_AUDIT.inputs.meanValues;
      return near(m.l1CapThresholdAtSeam, 1.856, 5e-3) && near(m.l2PointwiseThresholdAtSeam, 1.809, 5e-3) &&
        Math.abs(m.l1CapThresholdAtSeam - m.l2PointwiseThresholdAtSeam) < 0.06 && m.l2PointwiseThresholdAtSeam > sigmaClosing;
    },
  },
  {
    id: 'laia-heat-lift-breaks-multiplicativity',
    why: 'b_{mn}^t != b_m^t b_n^t for t > 0: exp((t/4) ln^2(mn)) / (exp((t/4) ln^2 m) exp((t/4) ln^2 n)) = exp((t/2) ln m ln n)',
    holds: () => {
      const t = 0.1314, m = 6, n = 35;
      const b = (k) => Math.exp((t / 4) * Math.log(k) ** 2);
      return near(b(m * n) / (b(m) * b(n)), Math.exp((t / 2) * Math.log(m) * Math.log(n)), 1e-12) && b(m * n) / (b(m) * b(n)) > 1.5;
    },
  },
  {
    id: 'laia-honest-scope',
    why: 'record says NOT established / NO QED / RH open / no refereed bound is changed and names the input as pointwise, not mean-value',
    holds: () =>
      /NOT established/.test(LANE_ARITHMETIC_INPUT_AUDIT.status) && /NO QED/.test(LANE_ARITHMETIC_INPUT_AUDIT.status) &&
      /RH open/.test(LANE_ARITHMETIC_INPUT_AUDIT.status) && /refereed bound is changed/i.test(LANE_ARITHMETIC_INPUT_AUDIT.status) &&
      /pointwise/.test(LANE_ARITHMETIC_INPUT_AUDIT.conditionalTheorem.inputStatus) &&
      /flagged for referee/.test(LANE_ARITHMETIC_INPUT_AUDIT.conditionalTheorem.rigorCaveat),
  },
]);

export default LANE_ARITHMETIC_INPUT_AUDIT;
