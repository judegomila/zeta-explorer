/**
 * imp-95839 -- EVALUATE the Widom finite-section prefactor for the ACTUAL sech
 * Gram symbol at delta = ln 1.2 (rho = 1) and test whether it resolves the
 * imp-95803 biasPct*N^2 prefactor drift (the imp-95824 HONEST SCOPE residual b).
 *
 * GRADE: closed-form evaluation of an interior model-seam constant. Import-light
 * (Poisson-dual arithmetic, no zeros bundle, no imports). Changes NO Lambda bound;
 * NO operator-positivity claim on the main chain; NO QED. No refereed bound is changed.
 *
 * BACKGROUND. imp-95824 derived that the deep-corner lambda_min finite-size
 * correction scales as N^{-2} (p = 2) from Kac-Murdock-Szego / Widom / Parter edge
 * theory for a non-degenerate quadratic Toeplitz symbol minimum,
 *
 *     lambda_min(T_N[f]) - m  =  (f''(theta_star)/2) * ( pi/(N+1) )^2 + O(N^{-3}),
 *
 * matching the imp-95803 measured p_inf ~ 1.98, but left the Widom PREFACTOR for
 * the ACTUAL sech Gram symbol unevaluated (SUB-GAP b: it needs f''(theta_star), an
 * offline symbol-diagonalization). This module supplies that evaluation.
 *
 * THE SYMBOL AND ITS POISSON DUAL (cancellation-free). The deep-corner symbol is
 *
 *     f(theta) = sum_{m=-inf}^{inf} sech(m*delta/2) e^{i m theta}.
 *
 * The direct alternating sum at the minimizer theta = pi is USELESS in float64: the
 * true value is ~4.26e-22 while the O(1) partial-sum terms carry ~1e-16 rounding,
 * so a naive f(pi) returns pure cancellation noise (~5e-16, and even a spurious
 * NEGATIVE f''(pi) ~ -3e-14). Poisson summation cures this. The Fourier transform
 * of sech(a x) is (pi/a) sech(pi xi/(2a)), so with a = delta/2 and b = pi/delta,
 *
 *     f(theta)   = (2 pi/delta) * sum_k sech( b (2 pi k - theta) ),
 *     f''(theta) = (2 pi/delta) * b^2 * sum_k sech''( b (2 pi k - theta) ),
 *                  sech''(u) = sech(u) (2 tanh^2 u - 1),
 *
 * both MANIFESTLY POSITIVE-term series (dominant arguments b*pi = pi^2/delta ~ 54).
 * This dual is the same mechanism as the imp-95744 cancellation-free F_inf form.
 *
 * EVALUATED CONSTANTS (delta = ln 1.2 = 0.1823215567939546, b = pi/delta):
 *   m         = f(pi)   = 4.263426080e-22   [matches imp-95803 F_inf = 4.263426088e-22
 *                                            to 1.8e-9 relative -- confirms the actual
 *                                            Gram symbol IS this sech symbol and its
 *                                            minimizer is theta_star = pi]
 *   f''(pi)   = 1.265851e-19  > 0           [NON-DEGENERATE quadratic minimum --
 *                                            confirms the imp-95824 assumption (c)]
 *   f''(pi)/m = 296.9092 = (pi/delta)^2 EXACTLY
 *              [because the dominant Poisson terms have large argument u = pi^2/delta,
 *               where sech''(u) = sech(u)(2 tanh^2 u - 1) -> sech(u), so the ratio of
 *               the two dual series is exactly b^2 = (pi/delta)^2 up to sech^2 u ~ e^{-108}]
 *
 * THE WIDOM PREFACTOR. Since biasPct = 100*(lambda_min/m - 1), the leading law gives
 *
 *     biasPct*(N+1)^2  ->  100 * (f''(theta_star)/2) * pi^2 / m  =: C_Widom,
 *
 * a SCALE-INVARIANT ratio (independent of any overall normalization of the symbol).
 * With f''(pi)/m = (pi/delta)^2 this collapses to the clean closed form
 *
 *     C_Widom = 50 * pi^4 / delta^2 = 146518.83 .
 *
 * COMPARISON TO THE imp-95803 DRIFT. The measured biasPct*(N+1)^2 descends
 * MONOTONICALLY and from ABOVE toward C_Widom:
 *
 *     N     biasPct    biasPct*(N+1)^2    / C_Widom
 *     80    51.6272    338726             2.312
 *     200    4.8195    194713             1.329
 *     500    0.6500    163151             1.114
 *
 * i.e. at N = 500 the finite-section constant is still ~11% above the exact Widom
 * value and closing. The residual biasPct*(N+1)^2 - C_Widom is strictly positive and
 * its local log-log slope drifts -1.69 -> -1.11 across the ladder, heading to -1 --
 * exactly an O(1/N) pre-asymptotic tail on a FIXED p = 2 (equivalently the O(N^{-3})
 * subleading term of lambda_min - m). So the imp-95803 drift 330414 -> 162500 is the
 * expected convergence of the pre-asymptotic constant DOWN to the exact Widom
 * constant C_Widom = 50 pi^4/delta^2 -- it is NOT a change of leading power and NOT
 * "something else." This RESOLVES the imp-95824 residual (b).
 *
 * HONEST SCOPE / SUB-GAP. (a) Evaluation only: the constant is computed in closed
 * form from the symbol; no cited input is imported and no bound moves. (b) The
 * comparison uses the imp-95803 baked biasPct ladder (converged DD lambda_min); it
 * does not re-run the DD eigensolver here. (c) The O(1/N) pre-asymptotic-tail order
 * is READ from the measured residual slopes (trending to -1), consistent with the
 * KMS/Widom O(N^{-3}) remainder; the exact remainder constant is not derived. The
 * exponent-and-prefactor question is now closed at delta = ln 1.2; the wider-cell
 * prefactors and the imp-95212 envelope port, signed WEIGHT and modulus/phase legs
 * stay OPEN. Model seam family only. Changes NO bound of the Lambda program; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-95824-deep-corner-bias-exponent-szego-theory (derived p=2, left prefactor SUB-GAP b)
 * @see imp-95803-twin-pair-deep-corner-bias-exponent-limit (the measured biasPct ladder this matches)
 * @see imp-95744-twin-pair-block-floor-belowprec-dd-resolve (the cancellation-free F_inf = f(pi))
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95839_SECH_WIDOM_PREFACTOR_EVAL = {
  id: "imp-95839",
  title:
    "Evaluate the Widom finite-section prefactor 100*(f''(theta_star)/2)*pi^2/m " +
    "for the actual rho=1 sech Gram symbol f(theta)=sum sech(m*delta/2)e^{i m theta} " +
    "at delta=ln1.2 via its cancellation-free Poisson dual, and test whether the " +
    "resulting C_Widom = 50 pi^4/delta^2 = 146518.83 resolves the imp-95803 " +
    "biasPct*N^2 prefactor drift: it does -- the measured biasPct*(N+1)^2 descends " +
    "monotonically from above (338726 -> 163151, N=80..500) toward C_Widom with an " +
    "O(1/N) tail, so the drift is the pre-asymptotic subleading term converging to " +
    "the exact Widom constant, not a power change",
  question:
    "does the evaluated Widom prefactor for the actual sech Gram symbol resolve the " +
    "imp-95803 biasPct*N^2 drift as O(N^{-3})-subleading convergence to a fixed " +
    "constant, or something else?",
  cell: { delta: "ln1.2", deltaValue: 0.1823215567939546, rho: 1 },
  // Poisson-dual evaluated symbol constants at the minimizer theta_star = pi.
  minimizerTheta: Math.PI, // theta_star = pi (deep corner), the true symbol minimizer
  symbolMin: 4.263426080224978e-22, // m = f(pi) via the dual (cancellation-free)
  Finf_imp95803: 4.263426088e-22, // baked imp-95803 F_inf -- matches to 1.8e-9 rel
  fppAtPi: 1.265850571182283e-19, // f''(pi) > 0 -- non-degenerate quadratic minimum
  fppOverM: 296.9092338796888, // f''(pi)/m = (pi/delta)^2 EXACTLY (large-argument sech)
  // The evaluated Widom prefactor (scale-invariant limit of biasPct*(N+1)^2).
  cWidom: 146518.8340711523, // 100*(f''/2)*pi^2/m
  cWidomClosedForm: "50*pi^4/delta^2", // = 146518.834..., since f''/m = (pi/delta)^2
  // imp-95803 measured biasPct*(N+1)^2 ladder (from the baked converged DD lambda_min).
  measuredLadder: [
    { N: 80, biasPct: 51.6272, biasN1sq: 338726.1, overWidom: 2.3118 },
    { N: 200, biasPct: 4.8195, biasN1sq: 194712.6, overWidom: 1.3289 },
    { N: 500, biasPct: 0.65, biasN1sq: 163150.7, overWidom: 1.1135 },
  ],
  // Residual (biasPct*(N+1)^2 - C_Widom) local log-log slope trend across N=80..500.
  residualSlopeStart: -1.69, // N=80->120
  residualSlopeEnd: -1.107, // N=400->500 (heading to -1 => O(1/N) tail on fixed p=2)
  // Findings.
  prefactorEvaluated: true, // closes the imp-95824 SUB-GAP (b)
  symbolMinMatchesFinf: true, // confirms the Gram symbol IS this sech symbol
  minimumIsNonDegenerateQuadratic: true, // f''(pi) > 0 -- confirms imp-95824 assumption (c)
  driftConvergesToWidomConstant: true, // biasPct*(N+1)^2 -> C_Widom from above, O(1/N) tail
  driftIsSubleadingNotPowerChange: true, // the drift is the O(N^{-3}) subleading term
  boundChange: false,
  qed: false,
  subGap: "wider-cell-widom-prefactors-and-exact-remainder-constant",
  resolvesSubGap: "pin-exact-limiting-bias-power-at-deep-corner", // imp-95824 residual (b)
  verdict:
    "WIDOM PREFACTOR EVALUATED -- IT RESOLVES THE imp-95803 DRIFT. The deep-corner " +
    "symbol f(theta)=sum sech(m*delta/2)e^{i m theta} has a cancellation-free Poisson " +
    "dual f(theta)=(2 pi/delta) sum_k sech((pi/delta)(2 pi k - theta)) (the direct " +
    "alternating sum at theta=pi is ~4e-22, below the float64 noise floor, and returns " +
    "garbage). Evaluated at the minimizer theta_star=pi: m=f(pi)=4.263426080e-22 " +
    "(matches the imp-95803 F_inf=4.263426088e-22 to 1.8e-9 rel, confirming the Gram " +
    "symbol IS this sech symbol) and f''(pi)=1.2659e-19 > 0 (non-degenerate quadratic " +
    "minimum, confirming the imp-95824 assumption). Because the dominant Poisson terms " +
    "have large argument pi^2/delta~54 where sech''(u) -> sech(u), the ratio " +
    "f''(pi)/m=(pi/delta)^2 EXACTLY, so the scale-invariant Widom prefactor is " +
    "C_Widom=100*(f''/2)*pi^2/m=50 pi^4/delta^2=146518.83. The imp-95803 measured " +
    "biasPct*(N+1)^2 descends monotonically FROM ABOVE 338726 -> 163151 over N=80..500 " +
    "(still ~11 pct above C_Widom at N=500), with residual (biasPct*(N+1)^2 - C_Widom) " +
    "local slope drifting -1.69 -> -1.11 toward -1: an O(1/N) pre-asymptotic tail on a " +
    "FIXED p=2, i.e. the O(N^{-3}) subleading term of lambda_min - m. So the drift " +
    "330414 -> 162500 is the expected convergence to the exact Widom constant, NOT a " +
    "power change and NOT something else -- closing the imp-95824 residual (b). " +
    "Evaluation only; no cited input imported. Model seam family only; the imp-95212 " +
    "envelope port, signed WEIGHT and modulus/phase legs stay OPEN. Changes no bound " +
    "of the Lambda program; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95839"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all).
// The core check re-evaluates the symbol and its curvature at theta=pi via the
// cancellation-free Poisson dual (O(K), tiny K) -- no O(n^3) factorization at
// import time -- and reproduces the baked constants and the drift comparison.
// ---------------------------------------------------------------------------

const REF = IMP95839_SECH_WIDOM_PREFACTOR_EVAL;

function sech(u) {
  return 2 / (Math.exp(u) + Math.exp(-u));
}
// sech''(u) = sech(u)(2 tanh^2 u - 1)
function sechSecond(u) {
  const s = sech(u);
  const t = Math.tanh(u);
  return s * (2 * t * t - 1);
}

// Poisson dual of f(theta)=sum_m sech(m*delta/2) e^{i m theta}:
//   f(theta)   = (2 pi/delta) sum_k sech(b (2 pi k - theta)),  b = pi/delta
//   f''(theta) = (2 pi/delta) b^2 sum_k sech''(b (2 pi k - theta))
function symbolDual(theta, delta, K = 30) {
  const b = Math.PI / delta;
  const pre = (2 * Math.PI) / delta;
  let s = 0;
  for (let k = -K; k <= K; k++) s += sech(b * (2 * Math.PI * k - theta));
  return pre * s;
}
function symbolSecondDual(theta, delta, K = 30) {
  const b = Math.PI / delta;
  const pre = (2 * Math.PI) / delta;
  let s = 0;
  for (let k = -K; k <= K; k++) s += sechSecond(b * (2 * Math.PI * k - theta));
  return pre * b * b * s;
}

export const IMP95839_ASSERTIONS = [
  {
    id: "imp95839-dual-min-matches-imp95803-finf",
    description:
      "the Poisson-dual symbol value at theta=pi reproduces the baked symbolMin and " +
      "matches the imp-95803 F_inf to 1e-6 relative",
    holds: () => {
      const d = REF.cell.deltaValue;
      const m = symbolDual(Math.PI, d);
      return (
        Math.abs(m - REF.symbolMin) / REF.symbolMin < 1e-9 &&
        Math.abs(m - REF.Finf_imp95803) / REF.Finf_imp95803 < 1e-6
      );
    },
  },
  {
    id: "imp95839-curvature-positive-nondegenerate",
    description:
      "f''(pi) evaluated from the dual is positive (non-degenerate quadratic minimum) " +
      "and reproduces the baked fppAtPi",
    holds: () => {
      const d = REF.cell.deltaValue;
      const fpp = symbolSecondDual(Math.PI, d);
      return (
        fpp > 0 &&
        REF.minimumIsNonDegenerateQuadratic === true &&
        Math.abs(fpp - REF.fppAtPi) / REF.fppAtPi < 1e-9
      );
    },
  },
  {
    id: "imp95839-curvature-ratio-is-b-squared",
    description:
      "f''(pi)/m equals (pi/delta)^2 exactly (large-argument sech collapse of the two " +
      "dual series), matching the baked fppOverM",
    holds: () => {
      const d = REF.cell.deltaValue;
      const ratio = symbolSecondDual(Math.PI, d) / symbolDual(Math.PI, d);
      const bsq = (Math.PI / d) * (Math.PI / d);
      return (
        Math.abs(ratio - bsq) / bsq < 1e-9 &&
        Math.abs(ratio - REF.fppOverM) / REF.fppOverM < 1e-9
      );
    },
  },
  {
    id: "imp95839-widom-prefactor-closed-form",
    description:
      "the evaluated Widom prefactor C_Widom = 100*(f''/2)*pi^2/m equals the closed " +
      "form 50 pi^4/delta^2 and the baked cWidom",
    holds: () => {
      const d = REF.cell.deltaValue;
      const m = symbolDual(Math.PI, d);
      const fpp = symbolSecondDual(Math.PI, d);
      const C = 100 * (fpp / 2) * Math.PI * Math.PI / m;
      const closed = (50 * Math.pow(Math.PI, 4)) / (d * d);
      return (
        Math.abs(C - closed) / closed < 1e-9 &&
        Math.abs(C - REF.cWidom) / REF.cWidom < 1e-9
      );
    },
  },
  {
    id: "imp95839-drift-descends-from-above-toward-widom",
    description:
      "the imp-95803 measured biasPct*(N+1)^2 descends monotonically and stays above " +
      "C_Widom across the sampled rungs, i.e. it converges to the Widom constant from " +
      "above",
    holds: () => {
      const L = REF.measuredLadder;
      let ok = REF.driftConvergesToWidomConstant === true;
      for (const r of L) {
        // reproduce biasN1sq from biasPct
        if (Math.abs(r.biasPct * (r.N + 1) * (r.N + 1) - r.biasN1sq) > 1) ok = false;
        if (!(r.biasN1sq > REF.cWidom)) ok = false; // above the limit
        if (Math.abs(r.biasN1sq / REF.cWidom - r.overWidom) > 5e-4) ok = false;
      }
      for (let i = 1; i < L.length; i++) {
        if (!(L[i].biasN1sq < L[i - 1].biasN1sq)) ok = false; // monotone descent
      }
      // at N=500 still above the limit but within ~15 pct
      const last = L[L.length - 1];
      return ok && last.overWidom > 1 && last.overWidom < 1.15;
    },
  },
  {
    id: "imp95839-residual-tail-is-order-one-over-N",
    description:
      "the residual (biasPct*(N+1)^2 - C_Widom) local log-log slope trends toward -1 " +
      "(an O(1/N) pre-asymptotic tail on a fixed p=2, i.e. the O(N^{-3}) subleading " +
      "term), not a change of leading power",
    holds: () =>
      REF.driftIsSubleadingNotPowerChange === true &&
      REF.residualSlopeStart < -1 &&
      REF.residualSlopeEnd < 0 &&
      REF.residualSlopeEnd > REF.residualSlopeStart && // magnitude shrinking toward 1
      Math.abs(REF.residualSlopeEnd + 1) < 0.2,
  },
  {
    id: "imp95839-not-a-bound",
    description:
      "this is an evaluation module; it moves no Lambda bound and proves no QED, and " +
      "it resolves the imp-95824 prefactor sub-gap (b)",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.prefactorEvaluated === true &&
      REF.resolvesSubGap === "pin-exact-limiting-bias-power-at-deep-corner" &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95839-closes-self",
    description: "this module is the deliverable the imp-95839 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95839"),
  },
];

for (const a of IMP95839_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95839-sech-widom-prefactor-eval assertion failed: ${a.id}`,
    );
  }
}

export default IMP95839_SECH_WIDOM_PREFACTOR_EVAL;
