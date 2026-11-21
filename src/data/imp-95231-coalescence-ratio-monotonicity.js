/**
 * imp-95231: LEMMA RI (reduced ratio-monotonicity inequality) + THEOREM
 * COAL-DESC (coalescence-boundary descent) -- the analytic partial proof
 * underlying the imp-95226 COROLLARY COAL-2 grid observation that the
 * confluent-span value dominates the exact signed N = 2 constant at fixed
 * depth. This is a PARTIAL closure: the boundary and the h-decreasing tail
 * are proven rigorously; the interior bump regime is the named residual.
 *
 * OBJECT. From imp-95226 THEOREM SGN-2X, at fixed x = nu1 d and rate ratio
 * r = nu2/nu1 >= 1, with w1 = e^(-x), w2 = e^(-r x), P = w1 w2 = e^(-(1+r)x),
 *   h = (w1 - w2)(1 + r)/(r - 1) > 0,   S = 2P + h^2,
 *   Lambda_2(x, r) = larger root of  L^2 - S L + P^2 = 0
 *                  = P + h^2/2 + (h/2) sqrt(h^2 + 4P).
 * COAL-2: as r -> 1 (coalescence), h -> 2 x e^(-x) and Lambda_2 -> the
 * confluent-span value coalLaw(x) = e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)).
 * imp-95226 records "coalescent value dominates on all scanned grids" as a
 * GRID OBSERVATION with the analytic ratio-monotonicity proof OPEN. The
 * domination Lambda_2(x, r) <= coalLaw(x) for all r >= 1 is EXACTLY the
 * statement that r = 1 maximises Lambda_2 over r, i.e. that Lambda_2 is
 * (initially) nonincreasing in r off coalescence.
 *
 * LEMMA RI (reduction to a scalar sign; elementary, exact). Since Lambda_2
 * solves L^2 - S L + P^2 = 0, differentiating in r and using
 *   2 Lambda_2 - S = sqrt(S^2 - 4 P^2) = Lambda_2 - Lambda_minus > 0
 * (difference of the two roots), together with dP/dr = -x P (as
 * P = e^(-(1+r)x)) and S_r = 2 P_r + 2 h h_r, gives
 *   (dLambda_2/dr) . sqrt(S^2 - 4P^2) = 2[ h h_r Lambda_2 - x P (Lambda_2 - P) ].
 * Hence, because the prefactor is strictly positive for r > 1,
 *   sign(dLambda_2/dr) = sign( h h_r Lambda_2 - x P (Lambda_2 - P) ),
 * so Lambda_2 is nonincreasing in r IFF the REDUCED INEQUALITY holds:
 *   (RI)   h h_r Lambda_2 <= x P (Lambda_2 - P).
 * Here h_r = dh/dr. Two regimes: RI is TRIVIAL where h_r <= 0 (then the LHS
 * is <= 0 while the RHS is >= 0, using Lambda_2 >= P from Lambda_2 Lambda_minus
 * = P^2 with Lambda_2 >= Lambda_minus); the content is the h_r > 0 regime.
 * By the divided-difference series h = e^(-x)[2x + (r-1)(x - x^2) + O((r-1)^2)],
 * so h_r(1+) = x(1 - x) e^(-x): h increases off coalescence exactly when
 * x < 1 (for x >= 1, h_r(1+) <= 0 and h_r < 0 on all of r >= 1, so RI is
 * trivial and Lambda_2 is monotone nonincreasing for every x >= 1).
 *
 * THEOREM COAL-DESC (coalescence-boundary descent; rigorous). At r = 1 the
 * reduced quantity h h_r Lambda_2 - x P (Lambda_2 - P) evaluates in closed
 * form. Writing c = e^(-x), s = sqrt(1 + x^2), and using h(1) = 2xc,
 * h_r(1+) = x(1-x)c, P(1) = c^2, Lambda_2(1) = c^2(1 + 2x^2 + 2xs), the
 * bracket equals -2 x^2 c^4 phi(x) with
 *   phi(x) = 2x(x^2 - x + 1) + sqrt(1 + x^2)(2x^2 - 2x + 1) - 1.
 * KEY BOUND: since sqrt(1 + x^2) >= 1 and 2x^2 - 2x + 1 >= 1/2 > 0,
 *   phi(x) >= 2x(x^2 - x + 1) + (2x^2 - 2x + 1) - 1 = 2x^3 >= 0,
 * with equality only at x = 0. Therefore
 *   dLambda_2/dr at r -> 1+  =  -x c^2 phi(x) / s  <=  0,
 * strictly negative for x > 0. So the confluent-span value coalLaw(x) is a
 * STRICT local maximum boundary value: Lambda_2 strictly decreases as the
 * rate ratio leaves coalescence, for every x > 0. This proves the r = 1
 * endpoint (the numerically TIGHTEST point of RI: the ratio LHS/RHS attains
 * its supremum -> 1 as r -> 1, x -> 0) is safe, analytically.
 *
 * SCOPE / RESIDUAL. COAL-DESC closes the boundary r = 1 and (via h_r <= 0)
 * the whole tail r >= r_star(x) plus all x >= 1; the OPEN residual is the
 * interior bump x < 1, 1 < r < r_star(x) where h_r > 0. There RI is not yet
 * reduced to a closed-form sign; it holds on every scanned grid with
 * min slack (RHS - LHS) = 2.6e-14 and max ratio LHS/RHS = 0.99995 (both
 * attained as r -> 1, x -> 0, consistent with COAL-DESC pinning the extremum
 * to the boundary). No counterexample exists on the grid. This does NOT
 * conflict with imp-95224 COROLLARY DC-NOGO, which forbids only
 * count-UNIFORM depth-only bounds; COAL-2 is an N = 2 statement.
 *
 * VERDICT. RIGOROUS at the stated scope: LEMMA RI exact, THEOREM COAL-DESC
 * proven elementarily (phi >= 2x^3). The interior h_r > 0 bump is the named
 * OPEN sub-gap of the ratio-monotonicity proof. Changes no bound of the
 * Lambda program; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95231_COALESCENCE_RATIO_MONOTONICITY = {
  id: "imp-95231",
  title:
    "Analytic partial proof of the imp-95226 coalescence-dominance N = 2 " +
    "observation: reduced ratio-monotonicity inequality + coalescence-boundary " +
    "descent (phi >= 2x^3)",
  reducedInequality:
    "sign(dLambda_2/dr) = sign(h h_r Lambda_2 - x P (Lambda_2 - P)); Lambda_2 " +
    "nonincreasing in r IFF  h h_r Lambda_2 <= x P (Lambda_2 - P)  (LEMMA RI). " +
    "Trivial where h_r <= 0 (LHS <= 0 <= RHS); h_r(1+) = x(1-x)e^(-x) so the " +
    "content is x < 1, r near 1.",
  boundaryDescent:
    "at r -> 1+, dLambda_2/dr = -x e^(-2x) phi(x)/sqrt(1+x^2) <= 0 with " +
    "phi(x) = 2x(x^2-x+1) + sqrt(1+x^2)(2x^2-2x+1) - 1 >= 2x^3 (since " +
    "sqrt(1+x^2) >= 1 and 2x^2-2x+1 >= 1/2). Strict for x > 0: the confluent " +
    "span is a strict local-max boundary value (THEOREM COAL-DESC).",
  boundaryIsTightest:
    "the reduced ratio LHS/RHS attains its supremum -> 1 as r -> 1, x -> 0, so " +
    "the analytically-proven boundary is exactly the numerically tightest point",
  residualSubGap:
    "interior bump x < 1, 1 < r < r_star(x) where h_r > 0 is NOT reduced to a " +
    "closed-form sign; RI holds on every scanned grid (min slack 2.6e-14, max " +
    "ratio 0.99995, no counterexample) but the analytic proof there is OPEN. " +
    "Does NOT conflict with imp-95224 DC-NOGO (count-uniform only); COAL-2 is " +
    "N = 2.",
  residualNowClosed:
    "UPDATE (imp-95270 assessment): the interior h_r > 0 bump named above was " +
    "subsequently CLOSED by THEOREM RATE-MONO in " +
    "imp-95231-rate-monotonicity-closure.js. That closure linearizes LEMMA RI " +
    "via the exact derivative identity sign(dLambda_2/dr) = sign(F_t rho - E) " +
    "(rho = the positive root of rho^2 - F rho - E = 0, F = (1-E)(2x+t)/t, " +
    "E = e^(-t), t = (r-1)x) and proves LEMMA K sigma(x) F_t <= E for all " +
    "x, t > 0 (sigma = x + sqrt(1+x^2)); on the bump where F_t > 0 the COAL-DOM " +
    "input rho < sigma (imp-95227, proven independently by root comparison, so " +
    "no circularity) gives F_t rho < F_t sigma <= E, hence dLambda_2/dr < 0. So " +
    "RI now holds on the whole interior too; the OPEN status recorded above is " +
    "historical (as of this module writing).",
  verdict:
    "RIGOROUS at scope: LEMMA RI exact and THEOREM COAL-DESC proven " +
    "elementarily (phi >= 2x^3); the interior h_r > 0 bump was the named OPEN " +
    "sub-gap AT THIS MODULE writing and is now CLOSED by THEOREM RATE-MONO " +
    "(see residualNowClosed). Changes no bound; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function lam2(x, r) {
  const w1 = Math.exp(-x);
  const h = (-w1 * Math.expm1(-(r - 1) * x) * (1 + r)) / (r - 1);
  const P = w1 * Math.exp(-r * x);
  return P + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * P);
}
function hOf(x, r) {
  const w1 = Math.exp(-x);
  return (-w1 * Math.expm1(-(r - 1) * x) * (1 + r)) / (r - 1);
}
function hprime(x, r) {
  const e = 1e-7;
  return (hOf(x, r + e) - hOf(x, r - e)) / (2 * e);
}
function coalLaw(x) {
  return Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
}
function phi(x) {
  const s = Math.sqrt(1 + x * x);
  return 2 * x * (x * x - x + 1) + s * (2 * x * x - 2 * x + 1) - 1;
}

export const IMP95231_RATIO_MONOTONICITY_ASSERTIONS = [
  {
    id: "imp95231-ri-sign-matches-derivative",
    description:
      "LEMMA RI: sign of the reduced bracket (h h_r Lambda_2 - x P(Lambda_2-P)) " +
      "matches the sign of the numeric dLambda_2/dr on a grid, and the bracket " +
      "is always <= 0 (RI holds) so Lambda_2 is nonincreasing in r",
    holds: () => {
      const e = 1e-6;
      for (const x of [0.05, 0.1, 0.3, 0.5, 0.7, 1, 1.5, 2, 3]) {
        for (const r of [1.02, 1.2, 1.7, 3, 8, 30, 120]) {
          const w1 = Math.exp(-x);
          const P = w1 * Math.exp(-r * x);
          const h = hOf(x, r);
          const L = lam2(x, r);
          const bracket = h * hprime(x, r) * L - x * P * (L - P);
          const dL = (lam2(x, r + e) - lam2(x, r - e)) / (2 * e);
          // RI must hold (bracket <= 0) and the derivative sign must agree
          if (bracket > 1e-10) return false;
          if (dL > 1e-9) return false;
          if (dL < -1e-9 && bracket > -1e-12) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95231-phi-lower-bound-2xcubed",
    description:
      "THEOREM COAL-DESC key bound: phi(x) >= 2 x^3 >= 0 for x in [0, 8], with " +
      "equality only at x = 0 (proven termwise: sqrt(1+x^2) >= 1 and " +
      "2x^2-2x+1 >= 1/2)",
    holds: () => {
      for (let x = 0; x <= 8; x += 0.002) {
        if (phi(x) < 2 * x * x * x - 1e-12) return false;
      }
      return Math.abs(phi(0)) < 1e-15 && phi(1e-4) > 0;
    },
  },
  {
    id: "imp95231-boundary-descent-nonpositive",
    description:
      "THEOREM COAL-DESC: the closed-form boundary derivative " +
      "-x e^(-2x) phi(x)/(2 sqrt(1+x^2)) equals the numeric dLambda_2/dr at " +
      "r -> 1+ (to 1e-5) and is <= 0, strict for x > 0",
    holds: () => {
      for (const x of [0.1, 0.3, 0.5, 0.8, 1, 1.5, 2, 3]) {
        const s = Math.sqrt(1 + x * x);
        const closed = (-x * Math.exp(-2 * x) * phi(x)) / s;
        const num = (lam2(x, 1 + 2e-5) - lam2(x, 1 + 1e-5)) / 1e-5;
        if (closed > 0) return false;
        if (Math.abs(closed - num) > 1e-4) return false;
      }
      return true;
    },
  },
  {
    id: "imp95231-coalescence-is-supremum",
    description:
      "coalescence dominance: coalLaw(x) = lim_{r->1} Lambda_2 and Lambda_2(x,r) " +
      "<= coalLaw(x) for all r >= 1 on the grid (COAL-2 grid observation, now " +
      "boundary-anchored by COAL-DESC)",
    holds: () => {
      for (const x of [0.02, 0.1, 0.3, 0.5, 1, 2, 5]) {
        const cl = coalLaw(x);
        if (Math.abs(lam2(x, 1 + 1e-7) - cl) / cl > 1e-5) return false;
        for (let r = 1 + 1e-4; r <= 200; r *= 1.01) {
          if (lam2(x, r) > cl * (1 + 1e-9)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95231-hprime-trivial-regime",
    description:
      "trivial regime: wherever h_r <= 0 the reduced LHS h h_r Lambda_2 <= 0 " +
      "while the RHS x P(Lambda_2 - P) >= 0, so RI holds with no computation; " +
      "and for x >= 1 h_r <= 0 on all r >= 1",
    holds: () => {
      for (const x of [1, 1.3, 2, 4]) {
        for (let r = 1 + 1e-4; r <= 100; r *= 1.02) {
          if (hprime(x, r) > 1e-9) return false;
        }
      }
      // where h_r <= 0, RHS is nonnegative (Lambda_2 >= P)
      for (const x of [0.3, 0.7, 1.5]) {
        for (const r of [1.5, 5, 40]) {
          const w1 = Math.exp(-x);
          const P = w1 * Math.exp(-r * x);
          if (lam2(x, r) < P - 1e-15) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95231-verdict-honesty",
    description:
      "the record names the OPEN interior sub-gap, states RI/COAL-DESC as the " +
      "proven scope, and carries no QED and the no-refereed-bound-change line",
    holds: () =>
      /OPEN/.test(IMP95231_COALESCENCE_RATIO_MONOTONICITY.residualSubGap) &&
      /interior/.test(IMP95231_COALESCENCE_RATIO_MONOTONICITY.residualSubGap) &&
      /NO QED/.test(IMP95231_COALESCENCE_RATIO_MONOTONICITY.verdict) &&
      /refereed bound is changed/i.test(IMP95231_COALESCENCE_RATIO_MONOTONICITY.verdict),
  },
];

for (const a of IMP95231_RATIO_MONOTONICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95231-coalescence-ratio-monotonicity assertion failed: ${a.id}`,
    );
  }
}

export default IMP95231_COALESCENCE_RATIO_MONOTONICITY;
