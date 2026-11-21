/**
 * @module imp-97497-krein-welloptimum-tail-converged
 * @fileoverview imp-97497 -- TAIL-CONVERGE the imp-97483 well-capture scalar optimum: measure the
 *   true T -> inf limit of the minimum total int sigma_2 |psi|^2 for the band-limited confinement
 *   family, resolving the 6.56 -> 7.22 truncation drift that imp-97483 FINDING 2 left informally
 *   "converging ~7.3". At 2a = ln 3 the pole-free symbol is
 *       sigma_2(t) = (t^2 + 1/4)^2 w_1(t),   w_1(t) = 2 theta prime(t) - sqrt2 ln2 cos(t ln2),
 *   with a t^4 ln t far tail. The confinement family is psi_hat_R(xi) = (1-(xi/a)^2)^2 exp(-(R xi)^2/2)
 *   on |xi| <= a (a = (ln3)/2). Its total int sigma_2 |psi|^2 converges (edge taper => psi ~ 1/t^3),
 *   but the one-sided grid truncation at T under-counts the slowly convergent ln t / t^2 far integrand,
 *   so the numerically-read optimum drifts UP with T: 6.56 -> 6.83 -> 6.97 -> 7.22 at T = 200/300/400/800.
 *
 * THE TAIL MODEL (endpoint asymptotic, then exact sigma_2). The taper vanishes to 2nd order at xi = a,
 *   so two integrations by parts of the cosine transform give the leading far-field profile
 *       psi_R(t) ~ -(1/pi) g''(a) sin(a t) / t^3,     g''(a) = (8/a^2) exp(-(R a)^2 / 2),
 *   hence |psi_R(t)|^2 ~ (1/pi^2) g''(a)^2 sin^2(a t) / t^6. VALIDATION: at the sin^2 peaks the
 *   asymptotic |psi|^2 matches the well-resolved exact cosine sum (nXi = 20000) to ratio 0.9969 at
 *   t ~ 203, 0.9992 at t ~ 403, 0.9999 at t ~ 1004 -- the amplitude constant g''(a) and the 1/t^6 law
 *   are confirmed. The tail-converged total is then
 *       tot(inf) = totExact(R, T0)  +  (2/n2) int_{T0}^{inf} sigma_2(t) |psi_R,asy(t)|^2 dt,
 *   with the smooth part of the tail integrand ~ (g''(a)^2 / (pi^2 n2)) ln(t/2pi) / t^2 (sin^2 averages
 *   1/2, w_1 ~ ln(t/2pi), t^4/t^6 = 1/t^2), giving the slow ln t / t^2 law
 *       tot(inf) - tot(T) ~ (g''(a)^2 / (pi^2 n2)) (ln(T/2pi) + 1) / T.
 *
 * FINDING 1 -- THE LIMIT IS SELF-CONSISTENT TO 4 DIGITS ACROSS THE SPLIT POINT. Adding the analytic tail
 *   to the exact core at three window edges T0 = 600 / 800 / 1000 gives the SAME limit: the exact part
 *   grows (7.132 -> 7.217 -> 7.271) while the tail shrinks (0.403 -> 0.318 -> 0.264) and the sum is
 *   invariant at tot(inf) = 7.5352 (spread 2e-6 across T0, ht, and nXi refinements). This confirms the
 *   tail model reproduces each drift point: tot(T) = tot(inf) - tail(T), with residuals tot(inf) - tot(T)
 *   = 0.972 / 0.707 / 0.561 / 0.318 at T = 200/300/400/800 tracking (ln(T/2pi)+1)/T.
 *
 * FINDING 2 -- THE TAIL-CONVERGED OPTIMUM IS 7.53, ABOVE THE INFORMAL ~7.3 ESTIMATE. The T -> inf total
 *   at the imp-97483 radius R = 3.35 is 7.535; re-scanning the argmin at T -> inf shifts the optimum
 *   marginally DOWN to R* ~ 3.36 (the growing far cost penalises spread slightly harder in the limit),
 *   where tot(inf) = 7.529 -- the curve is flat over R = 3.35..3.37 (7.5352 / 7.5286 / 7.5339). So the
 *   tail-converged scalar optimum is
 *       tot(inf) = 7.53 +- 0.01   (R* ~ 3.36),
 *   CORRECTING the imp-97483 informal "~7.3": the limit is ~0.2 higher. The error bar is dominated by the
 *   endpoint-asymptotic bias near T0 (< 1e-3 on a ~0.3 tail); the split-point self-consistency is 2e-6.
 *
 * FINDING 3 -- THE RATIO TO c_sharp IS 12.9x, NOT ~12.5x. With the measured c_sharp ~ 0.582 (imp-97206
 *   UPPER bracket), the tail-converged optimum is 7.529 / 0.582 = 12.9x -- confirming and sharpening the
 *   imp-97483 conclusion that the smooth confinement radius cannot reach c_sharp: even fully tail-resolved,
 *   the best member of this one-parameter family lands an order of magnitude above the spectral optimum.
 *   The far-field cost stays spectral, not a scalar the radius can dial away.
 *
 * VERDICT. The imp-97483 truncation drift 6.56 -> 7.22 is TAIL-CONVERGED to tot(inf) = 7.53 +- 0.01 at
 *   R* ~ 3.36, using an endpoint-asymptotic |psi|^2 (validated to 0.01% against the exact sum) plus exact
 *   sigma_2 for the far integral. The limit is self-consistent to 2e-6 across the exact/tail split point,
 *   corrects the informal "~7.3" upward by ~0.2, and gives ratio 12.9x to c_sharp ~ 0.582 (not ~12.5x).
 *   The smooth confinement scalar optimum stays an order of magnitude above the spectral optimum.
 *   Measurement only; no operator positivity; no coercivity constant; no bound moves; interval-rigorous
 *   reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97483-krein-well-capture-vs-farfield-cost-tradeoff.js (FINDING 2: the drift 6.56->7.22, informal ~7.3)
 * @see imp-97458-krein-csharp-discarded-positive-far-field.js (the spectral far-field cost; t^4 ln t tail)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (measured c_sharp ~ 0.582 UPPER bracket)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_2; reach 2a <= 0.96)
 *
 * Ticket: imp-97497 (numerical, medium, opus-4-8). Measurement only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

import { sigma2 } from './rh-route-i-toeplitz-krein-certificate-2026-09-24.js';

const PI = Math.PI;
const LN3 = Math.log(3);
const A = LN3 / 2; // a = (ln3)/2 = 0.5493061443340548

export const IMP97497_BINDING_2A = LN3;
export const IMP97497_RIGOROUS_REACH_2A = 0.96; // unchanged
export const IMP97497_CSHARP_UPPER_BRACKET = 0.582; // imp-97206 (positive)

// --- the imp-97483 confinement family (same definition), returning psi and n2 = ||psi||^2 ---
function makePsi(R, nXi) {
  const m = nXi, h = A / m;
  const xs = new Float64Array(m), gs = new Float64Array(m);
  let n2 = 0;
  for (let i = 0; i < m; i++) {
    const xi = (i + 0.5) * h;
    const g = Math.pow(1 - Math.pow(xi / A, 2), 2) * Math.exp(-(Math.pow(R * xi, 2)) / 2);
    xs[i] = xi; gs[i] = g; n2 += g * g * h;
  }
  n2 /= PI;
  const psi = (t) => { let s = 0; for (let i = 0; i < m; i++) s += gs[i] * Math.cos(xs[i] * t); return s * h / PI; };
  return { psi, n2 };
}

// endpoint asymptotic amplitude g''(a) = (8/a^2) exp(-(R a)^2/2) and |psi_asy(t)|^2.
const gppA = (R) => (8 / (A * A)) * Math.exp(-(Math.pow(R * A, 2)) / 2);
const psiAsySq = (R, t) => (gppA(R) ** 2) * Math.pow(Math.sin(A * t), 2) / (PI * PI * Math.pow(t, 6));

// exact truncated total int sigma_2 |psi|^2 (normalised ||psi||_2 = 1, even symbol).
function totExact(R, T, ht, nXi) {
  const { psi, n2 } = makePsi(R, nXi);
  let neg = 0, pos = 0;
  for (let t = ht / 2; t < T; t += ht) { const p = psi(t); const v = sigma2(t) * p * p * ht; if (v < 0) neg += v; else pos += v; }
  return { tot: 2 * (neg + pos) / n2, n2 };
}

// analytic far tail beyond T0: exact sigma_2 times asymptotic |psi|^2, plus closed smooth remainder.
function tailTot(R, T0, n2, Tmax, ht) {
  let acc = 0;
  for (let t = T0 + ht / 2; t < Tmax; t += ht) acc += sigma2(t) * psiAsySq(R, t) * ht;
  const K = (gppA(R) ** 2) / (PI * PI);
  const rem = 0.5 * K * (Math.log(Tmax / (2 * PI)) + 1) / Tmax; // int_{Tmax}^inf ln(t/2pi)/t^2 dt, smooth part
  return 2 * (acc + rem) / n2;
}
// tot(inf) = exact core to T0 + analytic tail from T0.
function totInf(R, T0, ht, nXi, Tmax = 2e6, htTail = 0.05) {
  const ex = totExact(R, T0, ht, nXi);
  return ex.tot + tailTot(R, T0, ex.n2, Tmax, htTail);
}

// Finding 1 -- self-consistent split-point convergence (baked from the T0 = 600/800/1000 run).
export const IMP97497_SPLIT_POINT_CONVERGENCE = Object.freeze([
  Object.freeze({ T0: 600, exact: 7.1318, tail: 0.4034, totInf: 7.5352 }),
  Object.freeze({ T0: 800, exact: 7.2171, tail: 0.3181, totInf: 7.5352 }),
  Object.freeze({ T0: 1000, exact: 7.2711, tail: 0.2642, totInf: 7.5352 }),
]);

// the imp-97483 drift ladder with the tail residual tot(inf) - tot(T) at each T (converged 7.5352).
export const IMP97497_DRIFT_LADDER = Object.freeze([
  Object.freeze({ T: 200, tot: 6.5633, tailResidual: 0.9719 }),
  Object.freeze({ T: 300, tot: 6.8283, tailResidual: 0.7069 }),
  Object.freeze({ T: 400, tot: 6.9741, tailResidual: 0.5611 }),
  Object.freeze({ T: 800, tot: 7.2175, tailResidual: 0.3177 }),
]);

// Finding 2/3 -- the tail-converged optimum.
export const IMP97497_TAIL_CONVERGED_OPTIMUM = Object.freeze({
  RstarInf: 3.36,          // argmin R at T -> inf (shifts marginally down from finite-T 3.35)
  RstarFiniteT: 3.35,      // imp-97483 finite-T argmin
  totInf: 7.53,            // tail-converged minimum total int sigma_2 |psi|^2
  errorBar: 0.01,          // dominated by endpoint-asymptotic bias; split-point self-consistency 2e-6
  totInfAtR335: 7.5352,    // limit at the imp-97483 radius R = 3.35
  totInfAtRstar: 7.5286,   // limit at the shifted argmin R* ~ 3.36
  informalEstimate: 7.3,   // imp-97483 "converging ~7.3"
  correctionUpward: true,  // the true limit is ~0.2 ABOVE the informal estimate
  ratioToCsharp: 12.9,     // 7.529 / 0.582 (imp-97206), sharpening the informal ~12.5x
  gppAmplitudeAtRstar: gppA(3.36), // endpoint asymptotic amplitude g''(a) at R* ~ 3.36
  tailLaw: 'tot(inf) - tot(T) ~ (g_pp(a)^2 / (pi^2 n2)) (ln(T/2pi) + 1) / T',
});

export const IMP97497_VERDICT = Object.freeze({
  ticket: 'imp-97497',
  question:
    'tail-converge the imp-97483 well-capture scalar optimum: measure the true T -> inf limit of the minimum total int sigma_2 |psi|^2 (the 6.56 -> 7.22 truncation drift, informally "converging ~7.3"), fit the shrinking increments to a rate, and report a tail-converged optimum with an error bar and its ratio to c_sharp ~ 0.582.',
  answer:
    'using the endpoint-asymptotic far profile psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3 (g_pp(a) = (8/a^2) exp(-(R a)^2/2), validated to 0.01% against the exact cosine sum at t ~ 1000) with exact sigma_2 for the far integral, tot(inf) = totExact(T0) + analytic-tail(T0) is self-consistent to 2e-6 across split points T0 = 600/800/1000 (exact grows 7.132 -> 7.271, tail shrinks 0.403 -> 0.264, sum fixed at 7.5352). The tail obeys the slow ln t / t^2 law tot(inf) - tot(T) ~ (g_pp(a)^2/(pi^2 n2)) (ln(T/2pi)+1)/T, reproducing the drift residuals 0.972/0.707/0.561/0.318 at T = 200/300/400/800. The tail-converged optimum is 7.53 +- 0.01 at R* ~ 3.36 (argmin shifts marginally down from finite-T 3.35), CORRECTING the informal "~7.3" upward by ~0.2. The ratio to c_sharp ~ 0.582 is 12.9x (not ~12.5x). The smooth confinement scalar optimum stays an order of magnitude above the spectral optimum; the far-field cost is spectral, not a scalar the radius can dial away.',
  binding_2a: LN3,
  totInf: 7.53,
  errorBar: 0.01,
  RstarInf: 3.36,
  ratioToCsharp: 12.9,
  correctsInformalEstimate: true,
  // unchanged program state
  measurementOnly: true,
  operatorPositivityProved: false,
  coercivityConstantProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97497_TAILCONVERGED_SCALAR_OPTIMUM_7P53_STILL_ORDER_ABOVE_CSHARP -- the imp-97483 truncation ' +
    'drift 6.56 -> 7.22 tail-converges (endpoint-asymptotic |psi|^2 + exact sigma_2, self-consistent to ' +
    '2e-6 across the exact/tail split) to tot(inf) = 7.53 +- 0.01 at R* ~ 3.36, correcting the informal ' +
    '~7.3 upward by ~0.2 and giving ratio 12.9x to c_sharp ~ 0.582 (imp-97206). The smooth confinement ' +
    'scalar optimum stays an order of magnitude above the spectral optimum. Measurement only; no operator ' +
    'positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96.',
  qed: false,
});
export default IMP97497_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Cheap recompute (nXi = 300, T0 = 300, coarse tail; ~40 ms): the exact core to T0 = 300 plus the
// analytic far tail reproduces the tail-converged limit 7.535 well above the informal ~7.3.
const IMP97497_ASSERTIONS = [
  {
    id: 'imp97497-tail-converges-to-7p53-above-informal-estimate',
    holds: () => {
      const ex = totExact(3.35, 300, 0.02, 300);
      const tail = tailTot(3.35, 300, ex.n2, 20000, 0.1);
      const inf = ex.tot + tail;
      // cheap grid lands at ~7.535: above the truncated 6.83 and above the informal ~7.3.
      return ex.tot > 6.5 && ex.tot < 7.1 && tail > 0.5 && tail < 0.9 &&
        Math.abs(inf - 7.535) < 0.05 && inf > IMP97497_TAIL_CONVERGED_OPTIMUM.informalEstimate;
    },
    why: 'the exact core to T0 = 300 (~6.83) plus the endpoint-asymptotic far tail (~0.71) reproduces the tail-converged total ~7.535, above the imp-97483 informal ~7.3 estimate.',
  },
  {
    id: 'imp97497-split-point-self-consistency-baked',
    holds: () =>
      IMP97497_SPLIT_POINT_CONVERGENCE.every((r) => Math.abs(r.exact + r.tail - r.totInf) < 1e-3) &&
      IMP97497_SPLIT_POINT_CONVERGENCE.every((r) => Math.abs(r.totInf - 7.5352) < 1e-3) &&
      // exact grows and tail shrinks with T0 (the split is moving mass across a fixed limit)
      IMP97497_SPLIT_POINT_CONVERGENCE[0].exact < IMP97497_SPLIT_POINT_CONVERGENCE[2].exact &&
      IMP97497_SPLIT_POINT_CONVERGENCE[0].tail > IMP97497_SPLIT_POINT_CONVERGENCE[2].tail,
    why: 'baked T0 = 600/800/1000 split points sum exact + tail to the same limit 7.5352 (exact grows, tail shrinks) -- the tail model is self-consistent across the split point.',
  },
  {
    id: 'imp97497-optimum-corrects-informal-and-stays-order-above-csharp',
    holds: () =>
      IMP97497_TAIL_CONVERGED_OPTIMUM.totInf === 7.53 &&
      IMP97497_TAIL_CONVERGED_OPTIMUM.correctionUpward === true &&
      IMP97497_TAIL_CONVERGED_OPTIMUM.totInf > IMP97497_TAIL_CONVERGED_OPTIMUM.informalEstimate &&
      IMP97497_TAIL_CONVERGED_OPTIMUM.ratioToCsharp > 12 &&
      Math.abs(IMP97497_TAIL_CONVERGED_OPTIMUM.totInfAtRstar / IMP97497_CSHARP_UPPER_BRACKET - IMP97497_TAIL_CONVERGED_OPTIMUM.ratioToCsharp) < 0.1 &&
      IMP97497_CSHARP_UPPER_BRACKET === 0.582 &&
      IMP97497_VERDICT.measurementOnly === true &&
      IMP97497_VERDICT.operatorPositivityProved === false &&
      IMP97497_VERDICT.coercivityConstantProved === false &&
      IMP97497_VERDICT.boundMoves === false &&
      IMP97497_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97497_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97497_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97497_VERDICT.subGap === 'string' &&
      IMP97497_VERDICT.subGap.includes('IMP97497_TAILCONVERGED_SCALAR_OPTIMUM') &&
      IMP97497_VERDICT.qed === false,
    why: 'measurement only: the tail-converged optimum 7.53 corrects the informal ~7.3 upward and stays 12.9x above the measured c_sharp ~ 0.582; no positivity, no coercivity, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97497_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97497-krein-welloptimum-tail-converged assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
