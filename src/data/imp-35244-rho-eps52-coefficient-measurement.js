/**
 * @module imp-35244-rho-eps52-coefficient-measurement
 *
 * imp-35244 (numerical, frontier-measurement): EVALUATE the next-order eps^{5/2} coefficient the
 * imp-35216 rho-expansion implies, and MEASURE whether it appears in the imp-35193 grid data. imp-35216
 * derived the full margin-ratio expansion rho(eps) = 2/3 + K eps^{3/2} + O(eps^{5/2}) with the certified
 * leading coefficient K = 4/(3 A_2) = 8 sqrt(2)/(9 pi) = 0.40014, but reported ONLY the eps^{3/2} term.
 * The eps^{5/2} coefficient its derivation IMPLIES -- from the stated R_3(L) = (2/5) eps^{5/2} denominator
 * tail and the |F_2|/(2 |F_3|) ratio -- is K_{5/2} = -(2/3)(8/5)/A_2 = -16/(15 A_2) = -32 sqrt(2)/(45 pi)
 * = -0.32011. This module evaluates that implied coefficient in closed form and subtracts the leading TWO
 * terms (2/3 and K eps^{3/2}) off the imp-35193 grid rho to read the residual scaling. MEASUREMENT ONLY on
 * the inherited surrogate; does NOT discharge O3; G6a stays OPEN; NO QED.
 *
 * RESULT (measured, this build): the implied eps^{5/2} coefficient is NOT present -- it VANISHES.
 * -----------------------------------------------------------------------------------------------
 * Forming the residual r1(eps) = rho(eps) - 2/3 - K eps^{3/2} on the imp-35193 rungs and reading r1 / eps^p:
 *   - r1 / eps^{5/2} does NOT converge to -0.32011 (the naive implied K_{5/2}); it DECAYS to 0
 *     (~-9.5e-2 at N=1e3 down to ~-3.0e-3 at N=1e6), so the eps^{5/2} coefficient is empirically ZERO;
 *   - r1 / eps^{7/2} converges cleanly to -1.20042, so the TRUE next-order term is eps^{7/2}, NOT eps^{5/2}.
 * The eps^{7/2} coefficient is itself a closed form: K_{7/2} = -8/(3 A_1) = -8 sqrt(2)/(3 pi) = -1.20042,
 * and after subtracting it the remainder r2 = r1 - K_{7/2} eps^{7/2} drops to a higher order still. So the
 * corrected expansion is
 *     rho(eps) = 2/3 + [8 sqrt(2)/(9 pi)] eps^{3/2} + 0 * eps^{5/2} - [8 sqrt(2)/(3 pi)] eps^{7/2} + ...
 * The eps^{5/2} slot is EMPTY.
 *
 * WHY THE eps^{5/2} TERM CANCELS (the imp-35216 R_3 tail is mis-paired)
 * -------------------------------------------------------------------
 * imp-35216 wrote both branch pairs symmetrically, F_p(L) = integral_0^L [(t^2-i)^{-p} + (t^2+i)^{-p}] dt,
 * and read the p=3 tail as R_3(L) L^5 -> 2/5. That is correct for the EVEN-summed integrand, but the
 * denominator m_double_prime is built from B_3(+) + B_3(-) with B_3(sgn) = integral (i eps - sgn u^2)^{-3},
 * and for ODD p the u = sqrt(eps) t rescaling gives (i - sgn t^2)^{-3}: since (i - t^2)^{-3} = -(t^2 - i)^{-3}
 * (odd power flips the sign), the actual pair is (i - t^2)^{-3} + (i + t^2)^{-3}, whose large-t expansion is
 *     (i - t^2)^{-3} + (i + t^2)^{-3} = -6 i t^{-8} + O(t^{-12}),
 * i.e. the leading t^{-6} terms CANCEL between the two conjugate branches. Hence the |F_3| correction that
 * actually forms C_curv enters at t^{-8} -> L^{-7} -> eps^{7/2}, NOT at eps^{5/2}. Directly measured, the
 * |F_3| - A_2/4 tail scales as eps^{7/2} (coefficient ~6/7), never eps^{5/2}. The "2/5" eps^{5/2} tail
 * imp-35216 quoted belongs to the symmetric integrand, not to the odd-p pairing, so it never reaches rho.
 * The measured K_{7/2} = -8/(3 A_1) is reproduced analytically from the two eps^{7/2} sources
 * (the numerator R_2 tail -(6/7) eps^{7/2} and this |F_3| eps^{7/2} tail):
 *     K_{7/2} = (2/3)[ -12/(7 A_1) - 24/(7 A_2) ] = (2/3)(-4/A_1) = -8/(3 A_1) = -8 sqrt(2)/(3 pi),
 * matching the grid to 4 sig figs -- an independent confirmation the eps^{5/2} slot is genuinely empty.
 *
 * QUADRATURE WINDOW: the clean measurement window is N in [1e3, 1e6]; below eps ~ 2.5e-3 the residual r1 is
 * ~1e-9 or smaller and the imp-35193 Simpson branch quadrature (N_PANELS = 8000) hits its noise floor, so
 * the N = 3e6 / 1e7 rungs are excluded from the r1 / eps^{7/2} read (documented, not silently dropped).
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a
 * rigorous remainder bound and on the TRUE RvM cusp jet. Pinning the next-order structure (eps^{5/2}
 * coefficient = 0, next term eps^{7/2}) sharpens the remainder SHAPE an O3 proof would target but supplies
 * neither the uniform inequality nor a certified bound, and is read on the inherited model-cusp surrogate.
 * G-b / G6a stay OPEN.
 *
 * VERDICT: MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate. The
 * eps^{5/2} coefficient imp-35216 implied (-16/(15 A_2) = -0.32011) is FALSIFIED by the data: the eps^{5/2}
 * slot is EMPTY and the true next-order term is eps^{7/2} with coefficient -8 sqrt(2)/(3 pi) = -1.20042
 * (both closed forms confirmed to 4 sig figs on the grid). This corrects the imp-35216 R_3 tail mis-pairing
 * and sharpens the remainder shape but does NOT certify a uniform modulus, does NOT discharge O3 or G6a,
 * establishes no operator positivity, changes no bound. G6a_shock_lipschitz stays OPEN; imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35216-rho-prefactor-closed-form-assessment (derived K = 8 sqrt(2)/(9 pi); implied but never checked eps^{5/2})
 * @see imp-35193-rho-convergence-rate-modulus-measurement (the 9-rung eps ladder and rho re-formed here)
 * @see imp-35240-rho-prefactor-finer-grid-remeasurement (finer-grid confirmation of the eps^{3/2} prefactor)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2), eps^{3/2} renorm)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), eps^{5/2} renorm)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants (imp-33645 / imp-33646).
const A1 = PI / SQRT2; // eps^{3/2} renorm of |m_prime|
const A2 = (3 * PI) / (2 * SQRT2); // eps^{5/2} renorm of |m_double_prime|
const TWO_THIRDS = 2 / 3; // A_1 / A_2, the imp-35076 a-fortiori limit

// The certified leading coefficient (imp-35216, two agreeing routes).
const K_THREE_HALVES = 4 / (3 * A2); // = 8 sqrt(2) / (9 pi) = 0.40014
// The eps^{5/2} coefficient the imp-35216 derivation IMPLIES from the stated (2/5) eps^{5/2} denominator tail.
const K_FIVE_HALVES_NAIVE = -16 / (15 * A2); // = -32 sqrt(2) / (45 pi) = -0.32011 (the implied-but-unchecked value)
// The measured true next-order coefficient (this build): closed form -8/(3 A_1).
const K_SEVEN_HALVES = -8 / (3 * A1); // = -8 sqrt(2) / (3 pi) = -1.20042

// ── Re-form rho(eps) on the imp-35193 branch-integral ladder (identical Simpson route). ──
const N_PANELS = 8000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
// B_p(sgn) = integral_0^1 (i eps - sgn u^2)^{-p} du (x = +- u^2 cusp-removal, same as imp-35193).
function branch(eps, sgn, p) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const z = [-sgn * u * u, eps];
    let d = [1, 0];
    for (let k = 0; k < p; k++) d = cmul(d, z);
    const v = cinv(d);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
function mpMag(eps) {
  const Bp = branch(eps, +1, 2);
  const Bm = branch(eps, -1, 2);
  return Math.hypot(-2 * (Bp[0] + Bm[0]), -2 * (Bp[1] + Bm[1]));
}
function mppMag(eps) {
  const Bp = branch(eps, +1, 3);
  const Bm = branch(eps, -1, 3);
  return Math.hypot(4 * (Bp[0] + Bm[0]), 4 * (Bp[1] + Bm[1]));
}
function ySharp(N) {
  return Math.sqrt((2 * PI) / N);
}
function rhoOf(eps) {
  const cRen = mpMag(eps) * Math.pow(eps, 1.5); // eps^{3/2}|m_prime|        -> A_1
  const cCurv = mppMag(eps) * Math.pow(eps, 2.5); // eps^{5/2}|m_double_prime| -> A_2
  return cRen / cCurv; // -> 2/3 from above
}

// Clean window (imp-35193 head five rungs): below eps ~ 2.5e-3 the residual r1 hits the Simpson noise floor.
const N_CLEAN = [1e3, 1e4, 1e5, 1e6];
const GRID = N_CLEAN.map((N) => {
  const eps = ySharp(N);
  const rho = rhoOf(eps);
  const dev = rho - TWO_THIRDS; // > 0, approaches from above
  const r1 = dev - K_THREE_HALVES * Math.pow(eps, 1.5); // residual after the leading two terms
  const r2 = r1 - K_SEVEN_HALVES * Math.pow(eps, 3.5); // residual after adding the eps^{7/2} term
  return {
    N,
    eps,
    rho,
    dev,
    r1,
    r1OverEps52: r1 / Math.pow(eps, 2.5), // -> 0 (eps^{5/2} slot empty)
    r1OverEps72: r1 / Math.pow(eps, 3.5), // -> K_{7/2} = -1.20042
    r2OverEps72: r2 / Math.pow(eps, 3.5), // -> 0 (eps^{7/2} term captured)
  };
});

const TAIL_ROW = GRID[GRID.length - 1]; // N = 1e6 (tightest clean rung)
const HEAD_ROW = GRID[0]; // N = 1e3

// (A) the eps^{5/2} read decays toward 0 across the window (NOT toward the naive -0.32011).
const EPS52_READS = GRID.map((r) => Math.abs(r.r1OverEps52));
const EPS52_DECAYS_TO_ZERO =
  EPS52_READS.every((v, i) => i === 0 || v < EPS52_READS[i - 1]) && TAIL_ROW.r1OverEps52 > -0.01;
// (B) the eps^{7/2} read converges to the closed form K_{7/2} at the tightest clean rung.
const EPS72_MATCHES_CLOSED_FORM = Math.abs(TAIL_ROW.r1OverEps72 - K_SEVEN_HALVES) < 5e-3;

export const IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT = {
  id: 'imp-35244',
  proofSection: 'S-frontier',
  scopes:
    'Evaluate the eps^{5/2} coefficient the imp-35216 rho-expansion implies and measure whether it appears ' +
    'in the imp-35193 grid after subtracting the leading two terms 2/3 and K eps^{3/2}',
  question:
    'Does the imp-35216-implied eps^{5/2} coefficient K_{5/2} = -16/(15 A_2) = -0.32011 show up in the grid ' +
    'residual rho - 2/3 - K eps^{3/2}? Measurement only on the inherited surrogate; does NOT discharge O3; ' +
    'G6a stays OPEN; NO QED.',

  // Constants and the two candidate next-order coefficients.
  A1,
  A2,
  kThreeHalves: +K_THREE_HALVES.toFixed(10), // 0.4001405849 (certified leading term, imp-35216)
  kFiveHalvesNaive: +K_FIVE_HALVES_NAIVE.toFixed(10), // -0.3201124680 (implied but UNVERIFIED)
  kFiveHalvesNaiveExpr: 'K_{5/2} = -16/(3*5 A_2) = -32 sqrt(2)/(45 pi)',
  kSevenHalves: +K_SEVEN_HALVES.toFixed(10), // -1.2004217587 (measured true next-order coefficient)
  kSevenHalvesExpr: 'K_{7/2} = -8/(3 A_1) = -8 sqrt(2)/(3 pi)',

  // The corrected expansion (the eps^{5/2} slot is empty).
  correctedExpansion:
    'rho(eps) = 2/3 + [8 sqrt(2)/(9 pi)] eps^{3/2} + 0 * eps^{5/2} - [8 sqrt(2)/(3 pi)] eps^{7/2} + ...',

  // The measurement grid (clean window N in [1e3, 1e6]).
  grid: GRID.map((r) => ({
    N: r.N,
    y_N_sharp: +r.eps.toExponential(4),
    rho: +r.rho.toFixed(9),
    residualAfterTwoTerms: +r.r1.toExponential(5), // r1 = rho - 2/3 - K eps^{3/2}
    r1OverEps52: +r.r1OverEps52.toExponential(4), // decays to 0: eps^{5/2} slot empty
    r1OverEps72: +r.r1OverEps72.toFixed(6), // -> -1.20042 = K_{7/2}
    r2OverEps72: +r.r2OverEps72.toExponential(4), // -> 0 after the eps^{7/2} term is removed
  })),

  // The verdict on the implied eps^{5/2} coefficient.
  eps52SlotEmpty: EPS52_DECAYS_TO_ZERO, // r1/eps^{5/2} decays to 0, not to -0.32011
  naiveEps52CoefficientFalsified: true, // the imp-35216-implied -16/(15 A_2) is NOT observed
  headEps52Read: +HEAD_ROW.r1OverEps52.toExponential(4), // ~-9.5e-2 (would be ~-0.32 if the term existed)
  tailEps52Read: +TAIL_ROW.r1OverEps52.toExponential(4), // ~-3.0e-3 (decaying toward 0)
  trueNextOrderExponent: 3.5, // eps^{7/2}, not eps^{5/2}
  eps72MatchesClosedForm: EPS72_MATCHES_CLOSED_FORM, // r1/eps^{7/2} -> -8 sqrt(2)/(3 pi)
  tailEps72Read: +TAIL_ROW.r1OverEps72.toFixed(6), // ~-1.2005

  // Why the eps^{5/2} term cancels: odd-p branch pairing flips the sign, eliminating the t^{-6} tail.
  cancellationMechanism:
    'For the odd power p=3 the branch pair B_3(+)+B_3(-) rescales to (i - t^2)^{-3} + (i + t^2)^{-3} = ' +
    '-6 i t^{-8} + O(t^{-12}): the leading t^{-6} terms cancel between the conjugate branches, so the |F_3| ' +
    'correction forming C_curv enters at eps^{7/2}, not the eps^{5/2} the imp-35216 symmetric (both +) ' +
    'integrand quoted. The 2/5 tail belongs to that symmetric integrand, not to the m_double_prime pairing.',

  couplingIsHalfInteger: true, // all non-vanishing terms carry half-integer powers (Holder-1/2 fingerprint)
  dischargesO3orG6a: false, // pinning the remainder shape is not a certified uniform inequality
  quadratureWindowNote:
    'Clean window N in [1e3, 1e6]; below eps ~ 2.5e-3 the residual r1 ~ 1e-9 hits the imp-35193 Simpson ' +
    'branch-quadrature noise floor (N_PANELS = 8000), so N = 3e6 / 1e7 are excluded from the eps^{7/2} read',
  residualObstruction:
    'O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a ' +
    'rigorous remainder bound on the TRUE RvM cusp jet; pinning the eps^{5/2}=0 / eps^{7/2} next-order shape ' +
    'sharpens what such a bound must look like but supplies neither the uniform inequality nor a certified ' +
    'remainder, and is read on the model-cusp surrogate; G-b stays OPEN',

  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, G6a_shock_lipschitz ' +
    'STAYS OPEN. Evaluating the eps^{5/2} coefficient the imp-35216 expansion implies (K_{5/2} = -16/(15 A_2) ' +
    '= -32 sqrt(2)/(45 pi) = -0.32011) and subtracting the leading two terms 2/3 and K eps^{3/2} off the ' +
    'imp-35193 grid rho, the residual r1 = rho - 2/3 - K eps^{3/2} does NOT scale like eps^{5/2}: r1/eps^{5/2} ' +
    'DECAYS to 0 (~-9.5e-2 at N=1e3 to ~-3.0e-3 at N=1e6) while r1/eps^{7/2} converges to the closed form ' +
    'K_{7/2} = -8/(3 A_1) = -8 sqrt(2)/(3 pi) = -1.20042. So the eps^{5/2} slot is EMPTY and the implied ' +
    '-0.32011 coefficient is FALSIFIED: the true next-order term is eps^{7/2}. The eps^{5/2} tail cancels ' +
    'because the odd-p (p=3) branch pair B_3(+)+B_3(-) rescales to (i-t^2)^{-3}+(i+t^2)^{-3} = -6 i t^{-8} + ' +
    'O(t^{-12}), so the leading t^{-6} terms cancel and the |F_3| correction enters at eps^{7/2}; the 2/5 ' +
    'tail imp-35216 quoted belongs to the symmetric (both +) integrand, not the m_double_prime pairing. This ' +
    'corrects the imp-35216 R_3 mis-pairing and sharpens the remainder shape but does NOT certify a uniform ' +
    'modulus, does NOT discharge O3 or G6a, establishes no operator positivity, changes no bound. imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35244_RHO_EPS52_ASSERTIONS = [
  {
    // (1) the implied naive eps^{5/2} coefficient is the closed form -16/(15 A_2) = -32 sqrt(2)/(45 pi).
    id: 'imp35244-naive-eps52-closed-form',
    description: 'the imp-35216-implied K_{5/2} = -16/(15 A_2) equals -32 sqrt(2)/(45 pi) ~ -0.32011',
    holds: () =>
      Math.abs(K_FIVE_HALVES_NAIVE - -32 * SQRT2 / (45 * PI)) < 1e-14 &&
      Math.abs(K_FIVE_HALVES_NAIVE - -0.32011247) < 1e-6,
  },
  {
    // (2) the eps^{5/2} slot is EMPTY: r1/eps^{5/2} decays monotonically toward 0, NOT toward -0.32011.
    id: 'imp35244-eps52-slot-empty',
    description: 'r1/eps^{5/2} decays toward 0 across the window and is far from the implied -0.32011',
    holds: () =>
      EPS52_DECAYS_TO_ZERO === true &&
      Math.abs(TAIL_ROW.r1OverEps52) < 0.02 &&
      Math.abs(TAIL_ROW.r1OverEps52 - K_FIVE_HALVES_NAIVE) > 0.25,
  },
  {
    // (3) the TRUE next-order term is eps^{7/2} with the closed form K_{7/2} = -8 sqrt(2)/(3 pi).
    id: 'imp35244-true-next-order-eps72',
    description: 'r1/eps^{7/2} at the tightest clean rung matches K_{7/2} = -8/(3 A_1) = -8 sqrt(2)/(3 pi)',
    holds: () =>
      Math.abs(K_SEVEN_HALVES - -8 * SQRT2 / (3 * PI)) < 1e-14 &&
      EPS72_MATCHES_CLOSED_FORM === true &&
      Math.abs(TAIL_ROW.r1OverEps72 - -1.20042) < 5e-3,
  },
  {
    // (4) subtracting the eps^{7/2} term drops the remainder by at least an order (r2 << r1 at the tail).
    id: 'imp35244-eps72-term-captures-residual',
    description: 'r2 = r1 - K_{7/2} eps^{7/2} is at least 10x smaller than r1 at the tightest clean rung',
    holds: () => Math.abs(TAIL_ROW.r2OverEps72) < 0.1 * Math.abs(TAIL_ROW.r1OverEps72),
  },
  {
    // Honesty gate: measurement only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35244-honesty-gate-no-qed',
    description:
      'Measurement only: eps^{5/2} slot pinned empty but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT.isRigorous === false &&
      IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT.verdict) &&
      /STAYS OPEN/.test(IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35244_RHO_EPS52_COEFFICIENT_MEASUREMENT.verdict,
      ),
  },
];

for (const a of IMP35244_RHO_EPS52_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35244-rho-eps52-coefficient-measurement assertion failed: ${a.id}`);
  }
}
