/**
 * @module rh-bridge-mirror-descent-2026-09-25
 * @fileoverview
 * MIRROR DESCENT: testing whether the lane-audit hypothesis H_desc ("about a third of the zeros near every
 * off-line zero are REAL", lane-arithmetic-input-audit-2026-09-22 section 3(A)) can be replaced by a count
 * of nearby zeros at ANY height, and whether the Euler product at sigma > 1 gives an unconditional descent of
 * high zeros of H_t. Three investigations (lemma / quantitative / empirics on zeta zeros) and four
 * adversarial referee passes, reconciled here. Only claims that survived refereeing are stated as proved;
 * corrected statements replace the originals; the empirics lens had NO referee pass and is recorded as
 * unrefereed measurement.
 *
 * RESULT IN ONE PARAGRAPH. The pair ("mirror") lemma is PROVED for every horizontal offset Delta: a nonreal
 * neighbour no higher than a nonreal zero z = x + iy pulls z down by at least 2y/(Delta^2 + 4y^2) per zero
 * (half-weight Poisson kernel at double width). This gives a PROVED conditional flow-descent theorem
 * (H_desc-mirror => Lambda <= t0 + y0^2/2, modulo flagged technical residuals) whose hypothesis is formally
 * implied by H_desc. It does NOT make the input easier to obtain: measured against the correct Palm
 * (conditioned-on-a-zero) baseline, the constant-p form at U = 0.145 demands a local SURPLUS of zeros around
 * every off-line zero (about 1.7x the neutral-lattice count at the seam), not "no shortage"; any form of it
 * below y = 1/2 is a pointwise statement at sigma < 1 (NS-RIGID class), and for t > 0 it concerns zeros of
 * H_t, which carry no Euler product. The Euler product gives a rigorous descent RATE only at the single
 * instant t = 0, only for a globally topmost zero whose existence is unknown, and yields no Lambda bound.
 * Error-term-free models of a t > 0 version land on P15's existing Lambda = O(1/log X) curve (~0.19 at
 * X = 6e12). No refereed bound is changed. NO QED.
 *
 * CONVENTIONS (as in the lane audit). H_t(z) = int_0^oo e^{tu^2} Phi(u) cos(zu) du, d_t H_t = -d_z^2 H_t,
 * zeros of H_0 at z = 2 gamma (rho = 1/2 + i z/2, so beta - 1/2 = -Im z/2). Zeros move by
 * dz_k/dt = 2 sum_{j != k} 1/(z_k - z_j) (symmetric summation; only the imaginary part converges
 * absolutely), so for z_k = x + iy: dy/dt = -2 sum_{j != k} (y - y_j)/|z_k - z_j|^2, and the conjugate
 * gives the self term -1/y. Real-zero density at x = 4 pi N^2 is ln N/(2 pi); seam ln N = ln 690988 = 13.446;
 * U = 0.145 row t0 = 0.1314, y0 = 0.165, ln N1* = (2 c0 - y0)/t0 + L0 = 18.509 (depends on BOTH t0 and y0).
 * f(h) := h/(Delta^2 + h^2).
 *
 * =====================================================================================================
 * A. PROVED (elementary; each independently re-derived and grid/random-checked by >= 2 referees)
 * =====================================================================================================
 * A1 PAIR LEMMA (all Delta > 0). For a in [0, 2y]: f(a) + f(2y - a) >= f(2y) = 2y/(Delta^2 + 4y^2), equality
 *    only at a in {0, 2y} (a neighbour at the same height). Proof: f(h)/h = 1/(Delta^2 + h^2) is decreasing, so
 *    f(a) >= a/(Delta^2 + (a+b)^2), f(b) >= b/(Delta^2 + (a+b)^2); add (subadditivity). No concavity needed.
 *    (Second proof: concave case Delta >= 2y/sqrt3 plus the symmetry f(h) = f(Delta^2/h) for Delta <= sqrt2*y.)
 *    At Delta = 0 the bound holds non-sharply (1/a + 1/(2y-a) >= 2/y). Consequence: with a = y - y_j,
 *    b = y + y_j, the conjugate pair {z_j, conj z_j} (|y_j| <= y) contributes <= -2 f(2y) to dy/dt; a real
 *    zero contributes -2y/(Delta^2 + y^2), which is more negative for every Delta.
 * A2 SELF-TERM IDENTITY. 1/y = 2 f_0(2y) at Delta = 0, so for a simple GLOBALLY topmost nonreal zero
 *    dy/dt <= -sum over ALL zeros rho (z_k and its conjugate included) of 2y/((x - Re rho)^2 + 4y^2).
 * A3 HIGHER NEIGHBOURS (window-topmost case). If y < y_j <= Y and |Delta| >= (y + Y)/sqrt3 (true for
 *    |Delta| >= 2 when Y <= 1), then f(y - y_j) + f(y + y_j) >= K_Y(Delta) = f(Y + y) - f(Y - y)
 *    = 2y(Delta^2 - Y^2 + y^2)/((Delta^2 + (Y - y)^2)(Delta^2 + (Y + y)^2)) > 0 for Delta^2 > Y^2 - y^2.
 *    This is a quantitative version of the sign-only far-pair argument already in the proof of P15 Prop 3.3.
 *    The hypothesis |Delta| >= (y+Y)/sqrt3 is needed (~33% random violations without it). CORRECTED: for
 *    |Delta| < 2 a higher neighbour has no lower bound UNIFORM as Delta -> 0 (the raw -1/(2|Delta|) ignores
 *    a >= y - Y and is not always attained), so window-topmost within distance 2 is required.
 * A4 POISSON DOMINATION. For a globally topmost zero and every eta >= sqrt5*y:
 *        dy/dt <= -1/y + 4y/(eta^2 - y^2) - (2y/eta) S_t(x, eta),  S_t(x, eta) = -Im(H_t'/H_t)(x + i eta),
 *    from the exact identity (A + (eta-e)^2)(A + (eta+e)^2) - (A + 4y^2)(A + eta^2 - e^2)
 *        = A(eta^2 + 3e^2 - 4y^2) + (eta^2 - e^2)(eta^2 - e^2 - 4y^2),  A = Delta^2, e in [0, y].
 *    At eta = sqrt5*y the self terms cancel exactly. The constant 2y/eta fails below sqrt5*y (eta = 2.1,
 *    y = e = 1, Delta -> 0: L - R = -0.173); at eta = 2y the best constant is exactly 3/4 (a limit, never
 *    attained). CORRECTED c(Y, y) = 0.75 at (2, 1), not the grid value 0.7516; c = 2y/Y for Y >= sqrt5*y.
 * A5 t = 0 INSTANTANEOUS RATE (an implication, vacuous under RH). S_0(x, eta) = (1/2) Re xi'/xi(1/2 + eta/2
 *    + ix/2) (30-digit check). IF H_0 has a simple zero z = x + iy with y >= |Im z_j| for all j (existence
 *    unknown), THEN for every eta >= max(sqrt5*y, 1+):
 *        dy/dt <= -1/y + 4y/(eta^2 - y^2) - (y/eta)[ln N + zeta'/zeta((1+eta)/2)] + O(1/x).
 *    Optimised at the seam: -6.909 (y = 0.165; de Bruijn -6.061), -4.517 (0.5), -5.505 (1; de Bruijn -1).
 *    At N1*: -7.422, -6.043, -7.768. This is a rate at one instant; it is not a flow theorem and gives NO
 *    Lambda bound. The gain over -1/y is about (y/eta) ln N and vanishes linearly as y -> 0 (0.85 at
 *    y = 0.165 vs the 4.37 needed).
 * A6 ARITHMETIC. p_req(0.1314, 0.165) = 4.3743 (int_{y0}^1 Y/(1+pY) dY = t0); mirror mean = density x kernel
 *    mass pi = ln N/2; theta_req = 2 p_req/ln N = 0.650 (seam) / 0.473 (N1*); lane-audit real fraction
 *    f_req = 0.325 / 0.236. Window-only (|Delta| < 2, kernel mass 2 arctan(1/y)) needs 1.028 of the mean at
 *    the seam: that variant is not viable. Window + K-kernel far field: 0.670 / 0.487.
 *
 * =====================================================================================================
 * B. CONDITIONAL (proved implication; the hypothesis is open)
 * =====================================================================================================
 * B1 THEOREM (H_desc-mirror => Lambda <= t0 + y0^2/2). Assume P15 Thm 1.2 (i) RH to X/2 and (ii) the barrier,
 *    and H_desc-mirror(p): every nonreal zero z of H_t (t in (0, t0]) with y >= y0, x >= X + 1, topmost within
 *    horizontal distance 2, has M_t(z) >= p(y), where
 *      M_t(z) = sum_real 2y/(D^2 + y^2) + sum_{nonreal, |D| < 2} 2y/(D^2 + 4y^2) + sum_{nonreal, |D| >= 2} K_{Y(t)}(D).
 *    If int_{y0}^1 dY/(1/Y + p(Y)) <= t0 then Lambda <= t0 + y0^2/2 (constant p: the lane-audit criterion).
 *    H_desc(p) => H_desc-mirror(p) (M_t >= P termwise). The converse fails on explicit polynomial heat-flow
 *    configurations (complex shell: measured -12.21, real-only bound -2.04, mirror -11.42); whether the two
 *    differ for the actual H_t is not established.
 *    RELATION TO THE HEIGHT-BLIND COUNT C_t = sum_all 2y/(D^2 + 4y^2): C_t and H_desc are logically
 *    INCOMPARABLE (the real kernel is 1x-4x the mirror kernel, so H_desc(p) gives C_t >= p/4 only).
 *    Residuals flagged, not proved: (a) Dini/envelope argument through collision times (local picture
 *    corrected: before a collision the pair approaches VERTICALLY with speed ~ 1/sqrt(2(t* - t)), upper
 *    member descending; after, horizontal separation), with uniform-in-t Ki-Kim-Lee finiteness; (b) the P15
 *    localisation keeping topmost zeros at x >= X + 1; (c) the hypothesis is needed on ALL x >= X + 1 for all
 *    t in (0, t0], where zeros of H_t have no Euler-product meaning.
 * B2 WIDE-POISSON FORM. A lower bound S_t(x, eta) >= q at some eta >= sqrt5*y implies B1 with
 *    p = (2y/eta)(q - 2 eta/(eta^2 - y^2)). Unconditional at t = 0 (A5); open for t > 0.
 *
 * =====================================================================================================
 * C. HEURISTIC / MODEL / UNREFEREED (nothing here is claimed)
 * =====================================================================================================
 * C1 PALM CORRECTION (referee, neutral rigid lattice, spacing 2 pi/ln N, pair displacing 2 slots): the
 *    pair-excluded mirror count at y0 = 0.165 is 2.530 = 0.376 of the mean at the seam and 4.421 = 0.478 at
 *    N1* (1-slot: 3.855 = 0.573). Constant p_req = 4.37 at y0 therefore requires a local surplus about 1.73x
 *    neutral at the seam. The pair's own mass at Delta = 0 is 1/y0 = 6.06 = 90% of the seam mean. The same
 *    Palm error sits in the lane-audit f_req framing (all-real neutral pull 2.74 = 0.204 ln N at the seam).
 *    The earlier "Lambda 0.1035 / 0.0809 if the mirror mean held pointwise" is an inconsistent reading
 *    (withdrawn). With p(Y) = neutral Palm profile: Lambda ~ 0.132 (seam, 2-slot), 0.118 (1-slot),
 *    0.099 / 0.090 (N1*) -- a model, and a pointwise hypothesis of NS-RIGID class.
 * C2 EMPIRICS (UNREFEREED; zeta zeros; no data inside the lane 3e12-7.5e16). Location-free min over 1e4-zero
 *    samples of Q/(pi rho), at y = 0.165/0.5/1.0: 0.397/0.782/0.919 at gamma ~ 2.68e11 (ln N 12.24),
 *    0.646/0.903/0.958 at ~1.37e21; minima sit at midpoints of the largest gaps. Descent time T(1 -> 0.165)
 *    at the seam: 0.114 with the location-free 1e12 minima (below 0.1314), but 0.140 with the
 *    pair-replacement (Palm-type) profile, 0.144-0.154 with the GUE largest-gap extrapolation to ~4e17 zeros
 *    (s ~ 5.7), 0.181 window-only, 0.2255 Euler input alone. Under the Palm correction the worst-case data
 *    already fail the U = 0.145 target narrowly. An all-real ODE proxy for t > 0 regularises gaps (0.129 /
 *    0.157 with a planted 5.7-spacing gap); the complex pair is not fed back. Heuristic only.
 * C3 t > 0 MODELS. P15-approximation triangle-quotient model without E_A/E_B/E_C terms: composite
 *    Lambda ~ 0.1906 at X = 6e12 (reproduced 0.1910 by a referee; 0.2063 if the enhancement is off on
 *    (0, 0.03)). It sits on P15 Table 1 (0.20 at X = 5e12, 0.19 at X = 2e13) and its required input is the
 *    same effective-approximation machinery that verifies P15 hypothesis (ii) directly: a constant-level
 *    change on Lambda = O(1/log X) (P15 Sec. 10), not a lever. Lemma-lens scenarios A/B (0.181 / 0.206 at
 *    the seam) were NOT independently reproduced. For the U = 0.145 lane the unconditional input is
 *    immaterial: hybrid q_req = 4.375 vs 4.374 without it.
 * C4 CONSISTENCY WITH PRIOR VERDICTS. The rigorous gain uses arithmetic input (Euler product at sigma > 1),
 *    not a soft hypothesis, so no collision with flow-blindness; it vanishes as y -> 0 and cannot give
 *    Lambda <= 0. The binding budget (Y in [0.165, 0.5]) needs a pointwise statement at sigma < 1, which is
 *    the lane-audit item 2(c) / NS-RIGID wall. The mirror kernel moves the task's abscissa from 1/2 + y/2 to
 *    1/2 + y for REAL zeros only (height-blind count at width 2y equals (1/2) Re xi'/xi(1/2 + y + ix/2) only
 *    when all zeros are real); the loss factor 2y/eta from staying at sigma > 1 is argued, not proved, to be
 *    structurally forced. In the fluid dictionary (rh-supercritical-fluid-bridge-2026-09-24) A1 says a lower
 *    viscous shock (complex pair) still damps the top shock, at half weight and double width.
 *
 * NOVELTY: ingredients are in the literature (de Bruijn topmost-zero argument; P15 Prop 3.3 sign-only far
 * pairs; P15 Remark 9.4 speed O(log x)). The pair lemma and the quantitative combination were not found in
 * the sources checked (search not exhaustive).
 *
 * Import-free. Literals from tmp/mirror-descent-*.py (investigations) and tmp/mirror-descent-referee-*.py.
 */

const C0 = 1.2218525; // imp-95218 closing threshold
const L0 = 1.1676005; // imp-95218 offset
const N_SEAM = 690988;
const LN_SEAM = Math.log(N_SEAM); // 13.4459
const T0 = 0.1314;
const Y0 = 0.165;
const SQRT5 = Math.sqrt(5);

export const lnN1Star = (t, y) => (2 * C0 - y) / t + L0;
const LN_N1 = lnN1Star(T0, Y0); // 18.509

export const f = (h, D) => h / (D * D + h * h);
// pair term of a neighbour at height yj on a zero at height y, offset D (conjugate included)
export const pairTerm = (y, yj, D) => f(y - yj, D) + f(y + yj, D);
export const K_Y = (y, Y, D) => (2 * y * (D * D - Y * Y + y * y)) / ((D * D + (Y - y) ** 2) * (D * D + (Y + y) ** 2));
// residual (c): pointwise ratio real kernel / mirror kernel at horizontal offset D and height y.
// = 4 at D = 0 (coincident), -> 1 as D -> infinity; in (1, 4] always. This is the factor that makes
// the height-blind count C_t and H_desc incomparable: real pull <= (this ratio) x mirror pull termwise,
// bounded above by 4, so H_desc(p) yields only C_t >= p/4 unconditionally.
export const realOverMirror = (D, y) => (D * D + 4 * y * y) / (D * D + y * y);

// lane-audit descent time for constant p: int_{y0}^1 Y/(1+pY) dY (closed form)
export const tNeeded = (p, y0) =>
  p === 0 ? (1 - y0 * y0) / 2 : (1 - y0) / p - (Math.log(1 + p) - Math.log(1 + p * y0)) / (p * p);
export function pRequired(t0, y0) {
  let lo = 1e-9, hi = 1e4;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (tNeeded(m, y0) > t0) lo = m; else hi = m;
  }
  return hi;
}
// descent time for a Y-dependent pull: int_{y0}^1 Y/(1 + Y p(Y)) dY, trapezoid
export function descentTime(pfun, y0 = Y0, n = 4000) {
  let s = 0;
  const h = (1 - y0) / n;
  for (let i = 0; i <= n; i++) {
    const Y = y0 + i * h;
    const v = Y / (1 + Y * pfun(Y));
    s += (i === 0 || i === n ? 0.5 : 1) * v;
  }
  return s * h;
}

// residual (a) collision-time drop: the corrected local picture gives a topmost-member rate
// ~ -1/sqrt(2(tStar - t)) into a collision (vertical approach, upper member descending). This helper
// returns the total height drop over [tStar - Delta, tStar - eps] by midpoint quadrature; it is used to
// certify that the singular rate is integrable (finite limit as eps -> 0) and signed (negative/downward),
// so the envelope Y(t) stays absolutely continuous across a collision and the Dini integration is valid.
export function collisionDrop(tStar, Delta, eps = 1e-6, n = 50000) {
  const h = (Delta - eps) / n;
  let drop = 0;
  for (let i = 0; i < n; i++) {
    const t = tStar - Delta + (i + 0.5) * h;
    drop += (-1 / Math.sqrt(2 * (tStar - t))) * h;
  }
  return drop; // -> -(sqrt(2 Delta) - sqrt(2 eps)), a finite limit as eps -> 0
}

// Riemann zeta for real s > 1 via Euler-Maclaurin (M = 40, 8 Bernoulli terms), and zeta'/zeta by central difference
const B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510];
export function zetaReal(s) {
  const M = 40;
  let acc = 0;
  for (let n = 1; n < M; n++) acc += Math.pow(n, -s);
  acc += Math.pow(M, 1 - s) / (s - 1) + 0.5 * Math.pow(M, -s);
  let poch = s, fact = 2; // s(s+1)...(s+2k-2), (2k)!
  for (let k = 1; k <= B2K.length; k++) {
    acc += (B2K[k - 1] / fact) * poch * Math.pow(M, -s - 2 * k + 1);
    poch *= (s + 2 * k - 1) * (s + 2 * k);
    fact *= (2 * k + 1) * (2 * k + 2);
  }
  return acc;
}
export const zetaLogDeriv = (s) => {
  const h = 1e-5;
  return (Math.log(zetaReal(s + h)) - Math.log(zetaReal(s - h))) / (2 * h);
};

// A5: optimised t = 0 rate bound for a (hypothetical) simple globally topmost zero at height y
export function t0RateBound(y, lnN) {
  const etaMin = Math.max(SQRT5 * y, 1.0005);
  let best = Infinity;
  for (let i = 0; i <= 1200; i++) {
    const eta = etaMin + i * 0.0025;
    const v = -1 / y + (4 * y) / (eta * eta - y * y) - (y / eta) * (lnN + zetaLogDeriv((1 + eta) / 2));
    if (v < best) best = v;
  }
  return best;
}

// C1: neutral rigid-lattice Palm counts (spacing s = 2 pi/ln N), mirror kernel, pair excluded
export function palmMirrorCount(y, lnN, slots = 2) {
  const s = (2 * Math.PI) / lnN;
  const off = slots === 2 ? 1.5 : 1; // first neighbour at off*s
  const K = 20000;
  let acc = 0;
  for (let k = 0; k <= K; k++) {
    const D = (k + off) * s;
    acc += (2 * 2 * y) / (D * D + 4 * y * y);
  }
  // integral tail from k = K + 1/2
  acc += (2 / s) * (Math.PI / 2 - Math.atan(((K + 0.5 + off) * s) / (2 * y)));
  return acc;
}
export function palmRealPull(y, lnN) {
  const s = (2 * Math.PI) / lnN;
  let acc = 0;
  for (let k = 0; k <= 20000; k++) {
    const D = (k + 1.5) * s;
    acc += (2 * 2 * y) / (D * D + y * y); // both sides: 2 * [2y/(D^2+y^2)]
  }
  acc += (4 / s) * (Math.PI / 2 - Math.atan(((20000.5 + 1.5) * s) / y));
  return acc;
}

// C2: measured 1e12-block minima (gamma ~ 2.68e11, 1e4 zeros), fraction of the mean pi*rho
const EMP_Y = Object.freeze([0.165, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);
const EMP_1E12_MINFRAC_Q = Object.freeze([0.3969, 0.463, 0.5446, 0.6121, 0.7132, 0.7815, 0.8288, 0.8627, 0.8877, 0.9056, 0.9192]);
const EMP_1E12_MINFRAC_QREP = Object.freeze([0.2244, 0.268, 0.3266, 0.3808, 0.4756, 0.5533, 0.6165, 0.6672, 0.7068, 0.7396, 0.767]);
const EMP_1E22_MINFRAC_Q = Object.freeze([0.6463, 0.712, 0.7804, 0.8286, 0.8759, 0.9032, 0.9206, 0.9334, 0.9431, 0.9512, 0.9581]);
const interp = (xs, ys) => (v) => {
  if (v <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) if (v <= xs[i]) return ys[i - 1] + ((ys[i] - ys[i - 1]) * (v - xs[i - 1])) / (xs[i] - xs[i - 1]);
  return ys[ys.length - 1];
};
export const empiricalDescentTime = (fracs, lnN = LN_SEAM) => {
  const g = interp(EMP_Y, fracs);
  return descentTime((Y) => g(Y) * (lnN / 2));
};

const P_REQ = pRequired(T0, Y0);

export const RH_BRIDGE_MIRROR_DESCENT = Object.freeze({
  id: 'rh-bridge-mirror-descent-2026-09-25',
  date: '2026-09-25',
  status:
    'Pair lemma, higher-neighbour lemma, Poisson domination PROVED; conditional flow-descent theorem H_desc-mirror => Lambda <= t0 + y0^2/2 PROVED modulo flagged residuals; t = 0 Euler-product rate PROVED as an implication (vacuous under RH, single instant); no new Lambda bound; hypothesis open and pointwise (NS-RIGID class); no refereed bound is changed; RH open; NO QED',
  target: Object.freeze({ t0: T0, y0: Y0, U: T0 + (Y0 * Y0) / 2, lnNSeam: LN_SEAM, lnN1Star: LN_N1 }),
  theorems: Object.freeze({
    pairLemma: 'For Delta > 0, a in [0,2y]: f(a) + f(2y-a) >= f(2y) = 2y/(Delta^2+4y^2), f(h) = h/(Delta^2+h^2); equality only at a in {0,2y}. PROVED (subadditivity).',
    selfTermIdentity: 'Globally topmost simple nonreal zero: dy/dt <= -sum_{all zeros rho} 2y/((x - Re rho)^2 + 4y^2). PROVED.',
    higherNeighbour: 'y < y_j <= Y, |Delta| >= (y+Y)/sqrt3: pair term >= K_Y(Delta) = f(Y+y) - f(Y-y) > 0 for Delta^2 > Y^2 - y^2. PROVED; quantitative version of the sign-only argument in P15 Prop 3.3. No lower bound uniform as Delta -> 0 for |Delta| < 2.',
    poissonDomination: 'Globally topmost zero, eta >= sqrt5*y: dy/dt <= -1/y + 4y/(eta^2-y^2) - (2y/eta) S_t(x,eta). PROVED; fails below sqrt5*y; best constant at eta = 2y is 3/4.',
    t0Rate: 'IF H_0 has a simple zero with y >= |Im z_j| for all j (unknown), THEN dy/dt <= -1/y + 4y/(eta^2-y^2) - (y/eta)[ln N + zeta\'/zeta((1+eta)/2)] + O(1/x) for eta >= max(sqrt5*y, 1+). PROVED as an implication; instantaneous; no Lambda bound.',
    conditionalDescent: 'P15 (i),(ii) + H_desc-mirror(p) with int_{y0}^1 dY/(1/Y + p(Y)) <= t0 => Lambda <= t0 + y0^2/2. PROVED modulo residuals (collision/Dini envelope, P15 localisation, hypothesis needed for all x >= X+1 and all t in (0,t0]). H_desc => H_desc-mirror; height-blind count C_t and H_desc are incomparable.',
  }),
  numbers: Object.freeze({
    pReq: 4.3743,
    thetaReqSeam: 0.650,
    thetaReqN1Star: 0.473,
    fReqRealSeam: 0.325,
    fReqRealN1Star: 0.236,
    windowOnlyThetaReqSeam: 1.028,
    windowPlusFarThetaReq: Object.freeze([0.670, 0.487]),
    t0RateSeam: Object.freeze({ y0165: -6.909, y05: -4.517, y1: -5.505, deBruijnY0165: -6.061, deBruijnY1: -1 }),
    t0RateN1Star: Object.freeze({ y0165: -7.422, y05: -6.043, y1: -7.768 }),
    etaTwoYBestConstant: 0.75,
    palmNeutral2SlotSeam: 2.530,
    palmNeutral2SlotFracSeam: 0.376,
    palmNeutral1SlotSeam: 3.855,
    palmNeutral2SlotN1Star: 4.421,
    palmSurplusFactorSeam: 1.73,
    palmFlowLambdaModel: Object.freeze({ seam2slot: 0.1317, seam1slot: 0.1178, n1Star2slot: 0.0990, n1Star1slot: 0.0900 }),
    withdrawnMeanPointwiseLambda: Object.freeze([0.1035, 0.0809]),
    empiricsDescentTimeSeam: Object.freeze({
      locationFree1e12: 0.1139, pairReplacement1e12: 0.1400, extrapolatedGap57: Object.freeze([0.144, 0.154]),
      windowOnly: 0.181, eulerOnly: 0.2255, target: T0,
    }),
    heatFlowComplexShell: Object.freeze({ measured: -12.214, oldRealOnly: -2.044, mirror: -11.420, domination: -10.216 }),
    tPositiveModelComposite: 0.1906,
    tPositiveModelCompositeEnhancementOff: 0.2063,
    p15Table1: Object.freeze({ X5e12: 0.20, X2e13: 0.19 }),
    hybridQReq: Object.freeze({ withE: 4.375, withoutE: 4.374 }),
  }),
  refereeCorrections: Object.freeze([
    'no-shortage framing REFUTED: against the Palm baseline the constant-p form needs a local surplus (~1.73x neutral at the seam)',
    'mirror-mean-pointwise Lambda 0.1035/0.0809 withdrawn (inconsistent baseline); Palm-profile model 0.132/0.099',
    'strictly weaker: formal only (M_t form); height-blind count C_t is incomparable with H_desc (p/4)',
    't = 0 bound: implication on a simple globally topmost zero whose existence is unknown; vacuous under RH; single instant',
    'c(2,1) = 0.75 (limit), not 0.7516; c = 2y/Y for Y >= sqrt5*y, not ~2.4y',
    'y = 1 seam speed 5.36 is valid but not sharp (5.48-5.505)',
    'ln N1* depends on both t0 and y0 (not on the descent path)',
    'near higher neighbour: no bound uniform as Delta -> 0 (raw -1/(2|Delta|) ignores a >= y - Y)',
    'collision picture: vertical approach before t*, horizontal separation after',
    'flow composite 0.1906 is an error-term-free model on the P15 Table 1 curve; same machinery as P15 (ii)',
    'height-blind count at width 2y equals (1/2)Re xi\'/xi at 1/2 + y only when all zeros are real',
    'lemma-lens scenario A/B reach numbers unreproduced; empirics lens unrefereed',
  ]),
  residualAssessment: Object.freeze({
    id: 'MIRROR_RESIDUAL_A_UNIFORM_FINITENESS_SUBGAP',
    ticket: 'imp-97051',
    residual: '(a) Dini/envelope argument through collision times with uniform-in-t Ki-Kim-Lee finiteness',
    verdict: 'HALF-CLOSED: the collision/Dini/envelope mechanics are rigorous; the remaining obstruction is the uniform-in-t finiteness / envelope-attainment on the unbounded x-strip, which Ki-Kim-Lee does not supply as stated. No new Lambda bound. No refereed bound is changed. NO QED.',
    a1_rigorous:
      'The topmost-height envelope Y(t) = sup{ y : nonreal zero of H_t with x >= X+1 } is continuous in t (Rouche/Hurwitz, zeros vary continuously). Away from collisions it is locally Lipschitz and its upper Dini derivative satisfies D+ Y(t) <= max over the active topmost zeros of dy/dt <= -1/y_top - (mirror pull), i.e. the B1 descent inequality (Danskin/envelope theorem for a max of C^1 trajectories). At a collision the corrected local picture gives the topmost member rate ~ -1/sqrt(2(t*-t)): (i) NEGATIVE (downward), so a collision is sign-favourable and only accelerates descent -- it can never push the running max UP; (ii) INTEGRABLE (int dt/sqrt(t*-t) converges; finite total drop, verified by collisionDrop). Hence across finitely many collisions Y stays absolutely continuous and the FTC-for-Dini bound Y(t0) - Y(0) <= int_0^{t0} D+ Y dt is valid. Collision times are isolated: they are zeros of the analytic-in-t discriminant, not identically zero for t > 0.',
    a2_subgap:
      'The envelope integration needs the number of nonreal zeros AND collision times inside { x >= X+1 } x { t in [0, t0] } to be finite UNIFORMLY in t, and the sup over the unbounded x-strip to be ATTAINED (a max fed by finitely many zeros, not a sequence of zeros marching in from x = +infinity as t varies). Ki-Kim-Lee gives per-t / asymptotic-in-t finiteness (for each fixed t all but finitely many zeros are real; real-eventually as t grows), NOT the uniform-over-a-compact-t-interval-on-an-unbounded-x-strip statement the argument consumes. This uniform finiteness + envelope-attainment is the precise, still-open obstruction of residual (a).',
  }),
  residualAssessmentB: Object.freeze({
    id: 'MIRROR_RESIDUAL_B_LARGEX_LOCALISATION_IS_RESIDUAL_A',
    ticket: 'imp-97052',
    residual: '(b) the P15 localisation keeping topmost nonreal zeros at x >= X+1 throughout the flow',
    verdict:
      'HALF-TRANSFERS: the P15 barrier supplies the LOWER-EDGE localisation t-uniformly (every nonreal zero of H_t has x > X for all t in [0, t0]); the LARGE-x half does NOT transfer and coincides with the residual (a) unbounded-strip sub-gap -- in P15 it is furnished only by the effective-approximation kill that mirror-descent is trying to replace. No new Lambda bound. No refereed bound is changed. NO QED.',
    b1_transfers:
      'B1 assumes P15 (ii) the barrier only, NOT the large-x effective kill (that is the piece the descent is meant to replace). The barrier is a rectangular-contour winding computation near x = X whose argument-principle count is constant in t BY CONSTRUCTION (H_t is nonzero on the contour for every t in [0, t0]); it is a genuine FLOW statement, not an endpoint one. Combined with RH verified below the barrier it forces the zero count in the box [0, X] x [y-range] to equal the full real count for every t, so no nonreal zero has x <= X during (0, t0]. The extra unit buffer to x >= X+1 is a minor strengthening (barrier placed at X+1, or a cheap Rouche estimate that [X, X+1] carries no nonreal zero) inside the same P15 framework. This lower-edge localisation transfers cleanly.',
    b2_does_not_transfer:
      'The topmost nonreal zero the descent tracks is the sup over the SEMI-INFINITE strip x >= X+1, which the single-abscissa barrier does not bound from above: a nonreal zero at arbitrarily large x is not excluded by the barrier alone. In P15 the large-x nonreal zeros are killed by the effective approximation A_t + B_t - C_t with the ratio |C_t| below |A_t + B_t| -- precisely the machinery B1 forgoes. So the localisation of the RUNNING MAX is not supplied by the barrier; it needs the uniform-in-t finiteness / envelope-attainment on the unbounded x-strip, which is exactly the still-open sub-gap of residual (a) (MIRROR_RESIDUAL_A_UNIFORM_FINITENESS_SUBGAP). Residuals (a) and (b) are therefore NOT independent: the hard half of (b) IS the sub-gap of (a). Without the P15 effective approximation there is no barrier-only route to it.',
  }),
  residualAssessmentC: Object.freeze({
    id: 'MIRROR_RESIDUAL_C_ALLXALLT_NOEULER_AND_INCOMPARABILITY_INTRINSIC',
    ticket: 'imp-97053',
    residual: '(c) the hypothesis is needed on ALL x >= X+1 for all t in (0, t0], where zeros of H_t carry no Euler product; and C_t vs H_desc are logically incomparable',
    verdict:
      'MEASURED, NOT CLOSED: the all-x-all-t gap is essentially total -- the only UNCONDITIONAL input (the A5 Euler-product rate) covers a Lebesgue-measure-zero slice {t = 0} of the required interval (0, t0] and only a single globally topmost zero, not all x >= X+1; and the C_t <-> H_desc incomparability admits only the one direction C_t >= p/4, whose factor 4 is narrowable solely with pointwise horizontal-spacing input at sigma < 1 (NS-RIGID class), so it cannot be tightened unconditionally. Residual (c) is therefore a genuine standalone gap, coinciding with the C4 NS-RIGID wall, not a technicality. No new Lambda bound. No refereed bound is changed. NO QED.',
    c1_allxallt_measured:
      'REQUIRED regime for B1: H_desc-mirror(p) at every nonreal zero of H_t with y >= y0, x >= X+1, for EVERY t in (0, t0] (t0 = 0.1314). UNCONDITIONALLY SUPPLIED: only the A5/A5-Euler instantaneous rate, which holds (i) at the single instant t = 0 (Lebesgue measure 0 inside (0, t0]) and (ii) only for a globally topmost zero whose existence is unknown, NOT for the running max over the semi-infinite strip x >= X+1. For t > 0 the zeros are zeros of H_t and carry NO Euler product, so the sigma > 1 arithmetic input (the only unconditional lever) is unavailable on the entire positive-measure set (0, t0]. Measured coverage fraction of the required t-interval = 0 (a measure-zero endpoint slice); the gap is 100 percent of the flow.',
    c2_incomparability_measured:
      'C_t = sum_all 2y/(D^2 + 4y^2) (height-blind, mirror kernel on every zero) vs H_desc (real-zero pull, real kernel 2y/(D^2 + y^2)). Pointwise realOverMirror(D, y) = (D^2 + 4y^2)/(D^2 + y^2) lies in (1, 4], = 4 only at D = 0, -> 1 as D -> infinity. Hence real pull <= 4 x (mirror pull of the same zeros) <= 4 C_t, giving the ONLY unconditional direction C_t >= p/4. The reverse (C_t >= p => H_desc(p)) fails: C_t also counts nonreal zeros and uses the smaller kernel. The factor 4 is a worst case attained only at coincident abscissa (D = 0); for the ACTUAL nearest real neighbour at the seam spacing s = 2 pi/ln N = 0.4673 the loss is far smaller (ratio 1.333 at Y0 = 0.165, 2.601 at Y = 0.5, 3.462 at Y = 1). But bounding D below -- to replace 4 by these smaller effective ratios unconditionally -- is precisely a pointwise horizontal-spacing statement at sigma < 1: a nonreal zero may sit arbitrarily close in abscissa to a real one without a repulsion input, so D cannot be bounded below and c = 4 is the only unconditional constant.',
    c3_subgap:
      'The precise still-open obstruction: replace the A5 t = 0 / topmost-zero Euler rate by a lower bound valid for all t in (0, t0] and all x >= X+1 (a sigma < 1 pointwise input on H_t, which has no Euler product), OR narrow C_t >= p/4 to C_t >= p/c with c < 4 via an unconditional lower bound on the real-to-nonreal abscissa gap. Both are pointwise statements at sigma < 1 of NS-RIGID class -- the same wall recorded in C4 and lane-audit item 2(c). Residual (c) is thus not narrowable to a usable one-directional bound without arithmetic input beyond the sigma > 1 Euler product.',
  }),
  nextStep:
    'Prove the loss factor 2y/eta is forced: construct zero configurations satisfying every sigma > 1 (eta >= 1) wide-Poisson lower bound that H_0 satisfies, yet with pull at width y below the Palm-neutral profile near a topmost zero. This would close the mirror-descent route as a theorem (as done for Sonine / rank-one fixes) instead of leaving it to modelling.',
  verdict:
    'The pair lemma is a proved, elementary sharpening of the de Bruijn topmost-zero argument and gives a proved conditional descent theorem whose hypothesis is formally implied by H_desc, but it does not replace "a third of nearby zeros real" by a no-shortage count: against the Palm baseline the U = 0.145 requirement is a local surplus, pointwise at sigma < 1 (NS-RIGID class), and for t > 0 it concerns zeros of H_t without Euler product. The unconditional Euler input is an instantaneous t = 0 rate only. No new Lambda bound. No refereed bound is changed. RH open. NO QED.',
  files: Object.freeze([
    'src/data/lane-arithmetic-input-audit-2026-09-22.js',
    'src/data/rh-supercritical-fluid-bridge-2026-09-24.js',
    'src/data/rh-bridge-supercritical-fluid-shock-scaling-2026-09-24.js',
    'tmp/mirror-descent-lemma-pair.py', 'tmp/mirror-descent-lemma-heatflow.py', 'tmp/mirror-descent-part1.py',
    'tmp/mirror-descent-part2c.py', 'tmp/mirror-descent-hybrid.py', 'tmp/mirror-descent-empirics-main.py',
    'tmp/mirror-descent-empirics-descent.py', 'tmp/mirror-descent-referee-lemma-1.py',
    'tmp/mirror-descent-referee-quant-0.c.py', 'tmp/mirror-descent-referee-quant-0.d.py',
  ]),
});

const near = (a, b, tol) => Math.abs(a - b) <= tol;

export const RH_BRIDGE_MIRROR_DESCENT_ASSERTIONS = Object.freeze([
  {
    id: 'mirror-pair-lemma-grid',
    name: 'pair lemma: f(a)+f(2y-a) >= f(2y) on a grid over Delta in [1e-4,100], y in [0.01,1]; equality at a = 0',
    why: 'A1 subadditivity; interior points strictly above, endpoint exactly equal',
    holds: () => {
      let minRel = Infinity;
      for (let lD = -4; lD <= 2; lD += 0.1) {
        const D = Math.pow(10, lD);
        for (let y = 0.01; y <= 1.0001; y += 0.033) {
          const ref = f(2 * y, D);
          for (let i = 0; i <= 200; i++) {
            const a = (2 * y * i) / 200, b = (2 * y * (200 - i)) / 200;
            const rel = (f(a, D) + f(b, D)) / ref - 1;
            if (rel < minRel) minRel = rel;
          }
          if (Math.abs(f(0, D) + f(2 * y, D) - ref) > 1e-15 * ref) return false;
          if (!(f(y, D) + f(y, D) > ref)) return false;
        }
      }
      return minRel >= -1e-12;
    },
  },
  {
    id: 'mirror-real-beats-complex-and-self-term',
    name: 'real-zero kernel 2y/(D^2+y^2) exceeds mirror kernel for all D; self term 1/y = 2 f_0(2y)',
    why: 'A1 normalisation, A2 identity',
    holds: () => {
      for (let D = 0; D <= 50; D += 0.05)
        for (let y = 0.02; y <= 1; y += 0.07) if (!(2 * y / (D * D + y * y) > f(2 * y, D))) return false;
      return near(2 * f(0.33, 0), 1 / 0.165, 1e-12);
    },
  },
  {
    id: 'mirror-higher-neighbour-closed-form',
    name: 'K_Y = f(Y+y) - f(Y-y) and is a lower bound for higher pairs when |D| >= (y+Y)/sqrt3; fails without it',
    why: 'A3; hypothesis genuinely needed',
    holds: () => {
      let ok = true, violationFound = false;
      for (let y = 0.05; y <= 0.95; y += 0.1)
        for (let Y = y + 0.02; Y <= 1; Y += 0.07) {
          for (let D = 0.05; D <= 20; D *= 1.15) {
            if (!near(K_Y(y, Y, D), f(Y + y, D) - f(Y - y, D), 1e-12)) ok = false;
            for (let yj = y + 1e-3; yj <= Y; yj += (Y - y) / 20) {
              const below = pairTerm(y, yj, D) < K_Y(y, Y, D) - 1e-12;
              if (D >= (y + Y) / Math.sqrt(3) && below) ok = false;
              if (D < (y + Y) / Math.sqrt(3) && below) violationFound = true;
            }
          }
          if (!(K_Y(y, Y, 2) > 0)) ok = false;
        }
      return ok && violationFound;
    },
  },
  {
    id: 'mirror-poisson-domination',
    name: 'kernel inequality 2 f_D(2y) >= (2y/eta)[f_D(eta-e)+f_D(eta+e)] for eta >= sqrt5*y; fails at eta=2.1,y=e=1; identity; self-cancel at sqrt5*y',
    why: 'A4',
    holds: () => {
      for (let y = 0.1; y <= 1; y += 0.15)
        for (let r = SQRT5; r <= 12; r += 0.37) {
          const eta = r * y;
          for (let e = 0; e <= y + 1e-12; e += y / 10)
            for (let D = 1e-4; D <= 100; D *= 1.3) {
              const L = 2 * f(2 * y, D), R = (2 * y / eta) * (f(eta - e, D) + f(eta + e, D));
              if (L < R * (1 - 1e-12)) return false;
              const A = D * D;
              const lhs = (A + (eta - e) ** 2) * (A + (eta + e) ** 2) - (A + 4 * y * y) * (A + eta * eta - e * e);
              const rhs = A * (eta * eta + 3 * e * e - 4 * y * y) + (eta * eta - e * e) * (eta * eta - e * e - 4 * y * y);
              if (Math.abs(lhs - rhs) > 1e-9 * Math.max(1, Math.abs(lhs))) return false;
            }
        }
      const D = 1e-6, y = 1, eta = 2.1;
      const fail = 2 * f(2 * y, D) - (2 * y / eta) * (f(eta - 1, D) + f(eta + 1, D));
      const selfCancel = -1 / 0.3 + (4 * 0.3) / (5 * 0.09 - 0.09);
      return near(fail, -0.173, 2e-3) && Math.abs(selfCancel) < 1e-12;
    },
  },
  {
    id: 'mirror-eta-2y-constant-three-quarters',
    name: 'c(Y,y) at D -> 0, y_j -> y equals (Y^2-y^2)/(2yY): 0.75 at (2,1) and (1.5,0.75); equals 2y/Y at Y = sqrt5*y',
    why: 'A4 correction (referee: 0.7516 was a grid artefact)',
    holds: () => {
      const c = (Y, y) => (Y * Y - y * y) / (2 * y * Y);
      const lim = (Y, y) => { const D = 1e-7; return (2 * (0 + f(2 * y, D))) / (f(Y - y, D) + f(Y + y, D)); };
      return near(c(2, 1), 0.75, 1e-12) && near(lim(2, 1), 0.75, 1e-9) && near(lim(1.5, 0.75), 0.75, 1e-9) &&
        near(c(SQRT5, 1), 2 / SQRT5, 1e-12);
    },
  },
  {
    id: 'mirror-descent-thresholds',
    name: 'p_req(0.1314,0.165) = 4.3743; theta_req 0.650/0.473; f_req 0.325/0.236; p = 0 gives de Bruijn',
    why: 'A6, recomputed live',
    holds: () =>
      near(P_REQ, 4.3743, 5e-4) && near(tNeeded(P_REQ, Y0), T0, 1e-9) &&
      near((2 * P_REQ) / LN_SEAM, 0.650, 1.5e-3) && near((2 * P_REQ) / LN_N1, 0.473, 1.5e-3) &&
      near(P_REQ / LN_SEAM, 0.325, 1.5e-3) && near(P_REQ / LN_N1, 0.236, 1.5e-3) &&
      near(tNeeded(0, Y0), (1 - Y0 * Y0) / 2, 1e-15) && near(LN_N1, 18.509, 2e-3) &&
      near(descentTime(() => P_REQ), T0, 1e-6),
  },
  {
    id: 'mirror-t0-euler-rate',
    name: 't = 0 instantaneous rate bound (implication) reproduces -6.909/-4.517/-5.505 (seam) and -7.422/-6.043/-7.768 (N1*)',
    why: 'A5 with live Euler-Maclaurin zeta\'/zeta; gain over -1/y below p_req at y0',
    holds: () => {
      const s = [t0RateBound(0.165, LN_SEAM), t0RateBound(0.5, LN_SEAM), t0RateBound(1, LN_SEAM)];
      const n = [t0RateBound(0.165, 18.51), t0RateBound(0.5, 18.51), t0RateBound(1, 18.51)];
      const zc = near(zetaLogDeriv(1.5), -1.5061, 1e-3) && near(zetaReal(2), (Math.PI ** 2) / 6, 1e-12);
      const gainY0 = -1 / 0.165 - s[0];
      return zc && near(s[0], -6.909, 3e-3) && near(s[1], -4.517, 3e-3) && near(s[2], -5.505, 3e-3) &&
        near(n[0], -7.422, 3e-3) && near(n[1], -6.043, 3e-3) && near(n[2], -7.768, 3e-3) &&
        gainY0 > 0.8 && gainY0 < 0.9 && gainY0 < P_REQ;
    },
  },
  {
    id: 'mirror-palm-baseline-surplus',
    name: 'neutral Palm count at y0: 2.530 (0.376 of mean) seam, 4.421 N1*, 1-slot 3.855; p_req needs ~1.73x surplus; self-mass 1/y0 = 90% of seam mean',
    why: 'C1 referee refutation of the no-shortage framing',
    holds: () => {
      const p2 = palmMirrorCount(Y0, LN_SEAM, 2), p1 = palmMirrorCount(Y0, LN_SEAM, 1), pn = palmMirrorCount(Y0, 18.509, 2);
      const realPull = palmRealPull(Y0, LN_SEAM);
      return near(p2, 2.530, 5e-3) && near(p2 / (LN_SEAM / 2), 0.376, 2e-3) && near(p1, 3.855, 5e-3) &&
        near(pn, 4.421, 5e-3) && near(P_REQ / p2, 1.73, 0.01) && near(1 / Y0 / (LN_SEAM / 2), 0.90, 0.01) &&
        near(realPull / LN_SEAM, 0.204, 2e-3) && p1 / (LN_SEAM / 2) < 0.65;
    },
  },
  {
    id: 'mirror-palm-flow-model-and-withdrawn-mean',
    name: 'Palm-profile flow model Lambda ~ 0.132 (seam 2-slot) vs withdrawn mean-pointwise 0.1035/0.0809',
    why: 'C1: the mean-pointwise value is an inconsistent reading; the Palm model is heuristic',
    holds: () => {
      const meanSeam = tNeeded(LN_SEAM / 2, 0), meanN1 = tNeeded(18.51 / 2, 0);
      const palmSeam = descentTime((Y) => palmMirrorCount(Y, LN_SEAM, 2), 1e-6, 400);
      return near(meanSeam, 0.1035, 1e-3) && near(meanN1, 0.0809, 1e-3) && near(palmSeam, 0.1317, 3e-3) && palmSeam > meanSeam;
    },
  },
  {
    id: 'mirror-empirics-descent-times',
    name: 'unrefereed empirics: location-free 1e12 minima give T = 0.114 < 0.1314, pair-replacement gives 0.140 > 0.1314',
    why: 'C2 recomputed from baked minima (linear interpolation, trapezoid)',
    holds: () => {
      const tq = empiricalDescentTime(EMP_1E12_MINFRAC_Q), tr = empiricalDescentTime(EMP_1E12_MINFRAC_QREP);
      return near(tq, 0.1139, 1e-3) && near(tr, 0.1400, 1e-3) && tq < T0 && tr > T0 &&
        EMP_1E22_MINFRAC_Q.every((v, i) => v >= EMP_1E12_MINFRAC_Q[i]);
    },
  },
  {
    id: 'mirror-heat-flow-sanity-ordering',
    name: 'complex-shell heat-flow row: measured <= mirror <= domination bound; old real-only bound far weaker',
    why: 'B1 converse fails on a polynomial configuration (baked literals)',
    holds: () => {
      const r = RH_BRIDGE_MIRROR_DESCENT.numbers.heatFlowComplexShell;
      return r.measured <= r.mirror && r.mirror <= r.domination && r.oldRealOnly > r.domination && -r.oldRealOnly < 4.37;
    },
  },
  {
    id: 'mirror-residual-a-collision-integrable-signed',
    name: 'residual (a): the collision-time rate ~ -1/sqrt(2(t*-t)) is NEGATIVE (downward) and INTEGRABLE (finite drop -> -sqrt(2 Delta)); assessment recorded as HALF-CLOSED with a named uniform-finiteness sub-gap',
    why: 'imp-97051 residual (a): Dini/envelope through collisions is rigorous (singular rate integrable + signed); remaining obstruction = uniform-in-t finiteness / envelope-attainment on the unbounded x-strip (Ki-Kim-Lee gives only per-t / asymptotic finiteness)',
    holds: () => {
      const tStar = 0.05, Delta = 0.02, eps = 1e-6;
      const drop = collisionDrop(tStar, Delta, eps, 50000);
      const closed = -(Math.sqrt(2 * Delta) - Math.sqrt(2 * eps));
      const finiteLimit = Math.abs((-(Math.sqrt(2 * Delta) - Math.sqrt(2 * 1e-6))) - (-Math.sqrt(2 * Delta))) < 2e-3;
      const a = RH_BRIDGE_MIRROR_DESCENT.residualAssessment;
      return drop < 0 && Number.isFinite(drop) && near(drop, closed, 1e-4) && finiteLimit &&
        a.id === 'MIRROR_RESIDUAL_A_UNIFORM_FINITENESS_SUBGAP' && /HALF-CLOSED/.test(a.verdict) &&
        /NO QED/.test(a.verdict) && /refereed bound is changed/i.test(a.verdict);
    },
  },
  {
    id: 'mirror-residual-b-localisation-half-transfers',
    name: 'residual (b): P15 barrier supplies the lower-edge localisation t-uniformly (nonreal zeros at x > X); the large-x running-max half is the residual (a) unbounded-strip sub-gap, not an independent gap; recorded HALF-TRANSFERS with NO QED',
    why: 'imp-97052 residual (b): the barrier is a t-uniform flow statement (argument-principle winding count constant in t), so the lower-edge localisation transfers; the semi-infinite-strip running-max localisation is only furnished in P15 by the effective-approximation kill that mirror-descent replaces, and coincides with residual (a)',
    holds: () => {
      const b = RH_BRIDGE_MIRROR_DESCENT.residualAssessmentB;
      const a = RH_BRIDGE_MIRROR_DESCENT.residualAssessment;
      return b.id === 'MIRROR_RESIDUAL_B_LARGEX_LOCALISATION_IS_RESIDUAL_A' &&
        b.ticket === 'imp-97052' && /HALF-TRANSFERS/.test(b.verdict) && /NO QED/.test(b.verdict) &&
        /refereed bound is changed/i.test(b.verdict) &&
        /MIRROR_RESIDUAL_A_UNIFORM_FINITENESS_SUBGAP/.test(b.b2_does_not_transfer) &&
        a.id === 'MIRROR_RESIDUAL_A_UNIFORM_FINITENESS_SUBGAP';
    },
  },
  {
    id: 'mirror-residual-c-incomparability-intrinsic',
    name: 'residual (c): realOverMirror(D,y) in (1,4] (=4 at D=0, ->1 far), so C_t >= p/4 is the only unconditional direction; nearest-neighbour loss 1.333/2.601/3.462 at Y=0.165/0.5/1; all-x-all-t Euler coverage is a measure-zero t=0 slice; recorded MEASURED-NOT-CLOSED with an NS-RIGID sub-gap, NO QED',
    why: 'imp-97053 residual (c): the C_t <-> H_desc incomparability narrows to nothing unconditional tighter than p/4 (factor 4 attained only at coincident abscissa, narrowable only with pointwise sigma<1 spacing input), and the sigma>1 Euler input covers a Lebesgue-measure-zero t=0 slice of the required (0,t0] flow where H_t carries no Euler product',
    holds: () => {
      const s = (2 * Math.PI) / LN_SEAM;
      // pointwise ratio bounds: in (1,4], = 4 at D = 0, -> 1 far
      let mx = 0, mn = Infinity;
      for (let D = 0; D <= 50; D += 0.05)
        for (let y = 0.02; y <= 1.0001; y += 0.02) {
          const r = realOverMirror(D, y);
          if (r > mx) mx = r;
          if (r < mn) mn = r;
        }
      const c = RH_BRIDGE_MIRROR_DESCENT.residualAssessmentC;
      return near(realOverMirror(0, 0.5), 4, 1e-12) && realOverMirror(1e6, 0.5) < 1.001 &&
        mx <= 4 + 1e-9 && mn > 1 - 1e-6 &&
        near(realOverMirror(s, 0.165), 1.333, 3e-3) && near(realOverMirror(s, 0.5), 2.601, 3e-3) &&
        near(realOverMirror(s, 1), 3.462, 3e-3) &&
        c.id === 'MIRROR_RESIDUAL_C_ALLXALLT_NOEULER_AND_INCOMPARABILITY_INTRINSIC' &&
        c.ticket === 'imp-97053' && /MEASURED, NOT CLOSED/.test(c.verdict) && /NO QED/.test(c.verdict) &&
        /refereed bound is changed/i.test(c.verdict) && /NS-RIGID/.test(c.c3_subgap);
    },
  },
  {
    id: 'mirror-no-new-bound-honest-scope',
    name: 'verdict says PT Lambda <= 0.2 stands and NO QED; model composite not below P15 Table 1 envelope by a proved margin',
    why: 'project rule: no false QED',
    holds: () => {
      const m = RH_BRIDGE_MIRROR_DESCENT;
      return /refereed bound is changed/i.test(m.verdict) && /NO QED/.test(m.verdict) && /NO QED/.test(m.status) &&
        /No new Lambda bound/i.test(m.verdict) && m.numbers.tPositiveModelComposite > m.numbers.p15Table1.X2e13 - 0.01 &&
        m.numbers.tPositiveModelCompositeEnhancementOff > 0.2 && m.numbers.hybridQReq.withE >= m.numbers.hybridQReq.withoutE;
    },
  },
]);

export default RH_BRIDGE_MIRROR_DESCENT;
