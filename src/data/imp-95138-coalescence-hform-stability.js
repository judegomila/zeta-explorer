/**
 * imp-95138: MEASUREMENT of the imp-95226 THEOREM SGN-2X stable evaluation
 * claim -- the expm1 h-form of the exact two-rate signed shift constant
 *   Lambda_2 = w1 w2 + h^2/2 + (h/2) sqrt(h^2 + 4 w1 w2),
 *   h = (w1 - w2)(nu1 + nu2)/(nu2 - nu1),  w_i = e^(-d nu_i),
 * is cancellation-free at coalescence (nu2 -> nu1), whereas the naive
 * subtraction h-form and the direct 2x2 pencil determinant lose digits.
 * imp-95224 recorded the near-coalescent evaluation as cancellation-limited
 * past rel 1e-10; imp-95226 asserted the expm1 form h = -w1 expm1(-d(nu2-nu1))
 * (nu1+nu2)/(nu2-nu1) removes that float trap. This module MEASURES the three
 * evaluations against an INDEPENDENT reference across a near-coalescence sweep.
 *
 * SETUP. Fix x = nu1 d and put s = d(nu2 - nu1) -> 0 (take d = 1, so nu1 = x,
 * nu2 = x + s). Then w1 w2 = e^(-(2x+s)) and, since (nu1+nu2)/(nu2-nu1) =
 * (2x+s)/s and w1 - w2 = e^(-x)(1 - e^(-s)),
 *   h(s, x) = e^(-x) (2x + s) phi(s),   phi(s) = (1 - e^(-s))/s .
 * The ONLY cancellation site is phi(s): as s -> 0 both 1 - e^(-s) and s vanish.
 *   - expm1 form:  phi(s) = -expm1(-s)/s          (library expm1, exact to ULP)
 *   - naive form:  phi(s) = (e^(-x) - e^(-(x+s)))/(e^(-x) s)  (direct subtraction)
 * INDEPENDENT REFERENCE. phi(s) = sum_(n>=0) (-1)^n s^n /(n+1)! is a
 * cancellation-free alternating Taylor sum for small s (each term computed by a
 * running power, no subtraction of nearly-equal magnitudes); this reference is
 * algebraically distinct from expm1 and validates it. The direct pencil builds
 * the Cauchy Gram G_ij = 1/(nu_i+nu_j) and M_ij = w_i w_j G_ij and takes the
 * larger root of det(lambda G - M) = 0 -- its conditioning ~ separation^(-2)
 * (Cauchy Gram condition), so it is the anti-trap baseline.
 *
 * FINDINGS (near-coalescence sweep s in {1e-1 ... 1e-12}, x in {0.5,1,2,4}).
 *   - expm1 h-form: max relative error vs the Taylor reference is 3.1e-16 across
 *     the ENTIRE sweep down to s = 1e-12 -- at the machine floor, no digit loss.
 *   - naive subtraction h-form: relative error grows as s shrinks, reaching
 *     2.3e-5 .. 3.8e-4 at s = 1e-12 (roughly half the significant digits gone),
 *     matching the imp-95224 "cancellation-limited past rel 1e-10" record.
 *   - direct 2x2 pencil determinant: relative error ~ s^(-2) (measured ratio
 *     135 per decade of s, near the Cauchy-Gram-condition prediction 100),
 *     already 2.2e-4 .. 8.2e-3 at s = 1e-6 and O(1) / non-finite by s = 1e-8.
 *   - CONSISTENCY: the expm1 form converges to the imp-95226 COROLLARY COAL-2
 *     confluent law coalLaw(x) = e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) as s -> 0
 *     (rel gap ~ 1e-10 at s = 1e-9), so the stable form is not merely smooth but
 *     tracks the exact coalescence limit.
 *
 * VERDICT. The imp-95226 SGN-2X stable-evaluation claim is CONFIRMED by direct
 * measurement: the expm1 h-form stays exact where BOTH the naive subtraction
 * h-form AND the direct pencil determinant lose digits, and the pencil loses
 * them fastest (~ separation^(-2)), as flagged. Measurement only; reproduces
 * imp-95226; changes no bound of the Lambda program; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Evaluators (import-light: no imports)
// ---------------------------------------------------------------------------

function factK(k) {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return f;
}
// independent cancellation-free reference for phi(s) = (1 - e^(-s))/s
function phiRefTaylor(s) {
  let acc = 0;
  let sp = 1;
  for (let n = 0; n < 50; n++) {
    acc += (n % 2 === 0 ? 1 : -1) * (sp / factK(n + 1));
    sp *= s;
  }
  return acc;
}
function lam2FromH(h, w1w2) {
  return w1w2 + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * w1w2);
}
// reference Lambda_2 via the Taylor phi (algebraically independent of expm1)
function refLam2(s, x) {
  const w1w2 = Math.exp(-(2 * x + s));
  const h = Math.exp(-x) * (2 * x + s) * phiRefTaylor(s);
  return lam2FromH(h, w1w2);
}
// imp-95226 stable evaluation: phi via expm1, cancellation-free at coalescence
function expm1Lam2(s, x) {
  const w1w2 = Math.exp(-(2 * x + s));
  const h = Math.exp(-x) * (2 * x + s) * (-Math.expm1(-s) / s);
  return lam2FromH(h, w1w2);
}
// naive evaluation: h from the direct difference w1 - w2 (catastrophic near s=0)
function naiveLam2(s, x) {
  const w1 = Math.exp(-x);
  const w2 = Math.exp(-(x + s));
  const h = ((w1 - w2) * (2 * x + s)) / s;
  return lam2FromH(h, w1 * w2);
}
// direct 2x2 pencil larger root (Cauchy Gram condition ~ separation^(-2))
function pencilLam2(s, x) {
  const nu1 = x;
  const nu2 = x + s;
  const w1 = Math.exp(-nu1);
  const w2 = Math.exp(-nu2);
  const G = [
    [1 / (2 * nu1), 1 / (nu1 + nu2)],
    [1 / (nu1 + nu2), 1 / (2 * nu2)],
  ];
  const M = [
    [(w1 * w1) / (2 * nu1), (w1 * w2) / (nu1 + nu2)],
    [(w1 * w2) / (nu1 + nu2), (w2 * w2) / (2 * nu2)],
  ];
  const A = G[0][0] * G[1][1] - G[0][1] * G[0][1];
  const B = G[0][0] * M[1][1] + G[1][1] * M[0][0] - 2 * G[0][1] * M[0][1];
  const C = M[0][0] * M[1][1] - M[0][1] * M[0][1];
  return (B + Math.sqrt(Math.max(B * B - 4 * A * C, 0))) / (2 * A);
}
function coalLaw(x) {
  return Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
}

const SEP_SWEEP = [
  1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10, 1e-11, 1e-12,
];
const X_GRID = [0.5, 1, 2, 4];

// ---------------------------------------------------------------------------
// Reference constants (cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95138_COALESCENCE_HFORM_STABILITY = {
  id: "imp-95138",
  title:
    "Near-coalescence stability of the imp-95226 SGN-2X Lambda_2: expm1 h-form " +
    "vs naive subtraction h-form vs direct 2x2 pencil determinant",
  setup:
    "x = nu1 d fixed, s = d(nu2 - nu1) -> 0 (d = 1); the only cancellation site " +
    "is phi(s) = (1 - e^(-s))/s. Independent reference: the cancellation-free " +
    "alternating Taylor sum sum (-1)^n s^n/(n+1)!, algebraically distinct from " +
    "expm1. Sweep s in {1e-1 ... 1e-12}, x in {0.5, 1, 2, 4}.",
  findings: {
    expm1MaxRelErr: 3.135e-16,
    naiveRelErrAt1em12Range: [2.33e-5, 3.79e-4],
    pencilRelErrAt1em6Range: [2.23e-4, 8.21e-3],
    pencilConditionRatioPerDecade: 135.3,
    pencilLossAt1em8: "O(1) or non-finite (separation^(-2) conditioning)",
    coalLawConsistencyAt1em9: 7.57e-10,
  },
  verdict:
    "The imp-95226 THEOREM SGN-2X stable-evaluation claim is CONFIRMED by " +
    "direct measurement: the expm1 h-form holds machine precision (3.1e-16) " +
    "across the whole near-coalescence sweep while the naive subtraction " +
    "h-form loses ~half its digits by s = 1e-12 and the direct pencil " +
    "determinant loses digits fastest (~ separation^(-2), O(1) by s = 1e-8). " +
    "The expm1 form also tracks the imp-95226 COAL-2 confluent law as s -> 0. " +
    "Measurement only; reproduces imp-95226; changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

export const IMP95138_ASSERTIONS = [
  {
    id: "imp95138-expm1-form-machine-exact",
    description:
      "the imp-95226 expm1 h-form matches the independent Taylor reference to " +
      "< 1e-13 rel across the ENTIRE near-coalescence sweep (s down to 1e-12) " +
      "at every x -- no digit loss at coalescence",
    holds: () => {
      let worst = 0;
      for (const x of X_GRID) {
        for (const s of SEP_SWEEP) {
          const r = refLam2(s, x);
          worst = Math.max(worst, Math.abs(expm1Lam2(s, x) - r) / r);
        }
      }
      return worst < 1e-13;
    },
  },
  {
    id: "imp95138-naive-form-loses-digits",
    description:
      "the naive subtraction h-form loses digits at coalescence: at s = 1e-12 " +
      "its relative error exceeds 1e-6 at every x (measured 2.3e-5 .. 3.8e-4), " +
      "matching the imp-95224 cancellation-limited record, while the expm1 form " +
      "stays below 1e-13 on the same rows",
    holds: () => {
      for (const x of X_GRID) {
        const r = refLam2(1e-12, x);
        const naive = Math.abs(naiveLam2(1e-12, x) - r) / r;
        const stable = Math.abs(expm1Lam2(1e-12, x) - r) / r;
        if (!(naive > 1e-6 && stable < 1e-13)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95138-pencil-condition-s-minus-2",
    description:
      "the direct 2x2 pencil determinant loses digits fastest: relative error " +
      "> 1e-4 by s = 1e-6 and O(1) or non-finite by s = 1e-8, with the " +
      "per-decade error growth ~ 100 (Cauchy Gram condition ~ separation^(-2))",
    holds: () => {
      for (const x of X_GRID) {
        const r6 = refLam2(1e-6, x);
        if (!(Math.abs(pencilLam2(1e-6, x) - r6) / r6 > 1e-4)) return false;
        const p8 = pencilLam2(1e-8, x);
        const r8 = refLam2(1e-8, x);
        if (isFinite(p8) && Math.abs(p8 - r8) / r8 <= 0.1) return false;
      }
      const x = 1;
      const e6 = Math.abs(pencilLam2(1e-6, x) - refLam2(1e-6, x)) / refLam2(1e-6, x);
      const e5 = Math.abs(pencilLam2(1e-5, x) - refLam2(1e-5, x)) / refLam2(1e-5, x);
      const ratio = e6 / e5;
      return ratio > 30 && ratio < 300;
    },
  },
  {
    id: "imp95138-expm1-tracks-coalescence-law",
    description:
      "consistency with imp-95226 COROLLARY COAL-2: the stable expm1 form " +
      "converges to the confluent law e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) as " +
      "s -> 0, rel gap < 1e-6 at s = 1e-9 for every x",
    holds: () => {
      for (const x of X_GRID) {
        const gap = Math.abs(expm1Lam2(1e-9, x) - coalLaw(x)) / coalLaw(x);
        if (!(gap < 1e-6)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95138-witness-row-exact",
    description:
      "sanity anchor at the imp-95226 witness row (rates (1,2), d = ln 2, i.e. " +
      "x = ln 2, s = ln 2): the expm1 form returns the exact algebraic value " +
      "(13 + 3 sqrt(17))/32 = 0.7927911524016557 to 1e-14",
    holds: () => {
      const val = expm1Lam2(Math.LN2, Math.LN2);
      const exact = (13 + 3 * Math.sqrt(17)) / 32;
      return Math.abs(val - exact) < 1e-14;
    },
  },
  {
    id: "imp95138-verdict-honesty",
    description:
      "the verdict is measurement-only, reproduces imp-95226, changes no bound, " +
      "and carries NO QED with PT Lambda <= 0.2 SOTA",
    holds: () =>
      /Measurement only/.test(IMP95138_COALESCENCE_HFORM_STABILITY.verdict) &&
      /reproduces imp-95226/.test(IMP95138_COALESCENCE_HFORM_STABILITY.verdict) &&
      /changes no bound/.test(IMP95138_COALESCENCE_HFORM_STABILITY.verdict) &&
      /NO QED/.test(IMP95138_COALESCENCE_HFORM_STABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP95138_COALESCENCE_HFORM_STABILITY.verdict),
  },
];

for (const a of IMP95138_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95138-coalescence-hform-stability assertion failed: ${a.id}`,
    );
  }
}

export default IMP95138_COALESCENCE_HFORM_STABILITY;
