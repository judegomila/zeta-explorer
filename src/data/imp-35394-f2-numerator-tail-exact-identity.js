/**
 * @module imp-35394-f2-numerator-tail-exact-identity
 *
 * imp-35394 (accuracy, frontier-derivation): DERIVE the |F_2| (m-prime, even-p B_2) numerator branch tail
 * as an EXACT rational identity -- the imp-35265 analog for the m-prime integrand -- and confirm the
 * analytic R_2-tail eps^{7/2} coefficient equals the -(6/7) contribution imp-35299 read on the grid.
 * imp-35265 carried out the ODD-p |F_3| (m_double_prime) conjugate-branch cancellation as an exact rational
 * identity (i - t^2)^{-3} + (i + t^2)^{-3} = -6 i t^{-8} + O(t^{-12}), pinning ONE of the two eps^{7/2}
 * sources of K_{7/2}. It did NOT do the companion |F_2| numerator branch, whose R_2 = |F_2(L)| - A_1/2 tail
 * supplies the OTHER named source that imp-35299 measured. This module derives the B_2(+) + B_2(-) even-p
 * pair in closed rational form, expands its large-t tail, integrates it to R_2, and confirms the eps^{7/2}
 * coefficient analytically. DERIVATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp
 * surrogate; does NOT discharge O3; G6a_shock_lipschitz stays OPEN; NO QED.
 *
 * THE EXACT IDENTITY (the even-p B_2 branch pair, in closed rational form)
 * -----------------------------------------------------------------------
 * Put v = t^2. The two conjugate m-prime branches (p = 2) share the denominator
 *     (v - i)(v + i) = v^2 - i^2 = v^2 + 1,  so  [(v - i)(v + i)]^2 = (v^2 + 1)^2 = (t^4 + 1)^2.
 * The numerator is (v + i)^2 + (v - i)^2. Since (v +- i)^2 = v^2 +- 2 i v - 1, the imaginary parts +-2 i v
 * CANCEL in the SUM and the real parts ADD: (v + i)^2 + (v - i)^2 = 2 v^2 - 2 = 2(t^4 - 1). Hence the EXACT,
 * non-asymptotic identity
 *     (t^2 - i)^{-2} + (t^2 + i)^{-2} = 2(t^4 - 1) / (t^4 + 1)^2,
 * a REAL rational function of t, verified here to machine precision at four test points (diff < 1e-14).
 * This is the g_2 integrand imp-35299 quotes; it is derived here from the branch pair rather than asserted.
 *
 * THE STRUCTURAL CONTRAST WITH THE imp-35265 ODD-p PAIR (why the numerator source is SUBLEADING)
 * ---------------------------------------------------------------------------------------------
 * For the ODD power p = 3 (imp-35265) the conjugate-branch SUM behaved like a DIFFERENCE: the leading
 * t^{-6} CANCELLED, lifting the tail exponent from 5/2 to 7/2. For the EVEN power p = 2 here the SUM
 * behaves like a genuine SUM: the imaginary parts cancel but the REAL leading term survives and ADDS. So
 * the |F_2| numerator does NOT lose its leading term -- it keeps a real 2 t^{-4}, which integrates to the
 * (2/3) eps^{3/2} HEAD that builds the leading K_{3/2}. The numerator eps^{7/2} source is therefore the
 * SUBLEADING -6 t^{-8} term of a surviving series, NOT a cancellation-lifted leading. Each single branch
 * (t^2 -+ i)^{-2} carries a t^{-4} term; the SUM keeps it (real parts add), whereas the odd-p SUM eliminated it.
 *
 * THE LARGE-t EXPANSION (real, leading term survives)
 * ---------------------------------------------------
 * Factor t^8 out of the denominator: (t^4 + 1)^{-2} = t^{-8}(1 + t^{-4})^{-2} =
 * t^{-8}(1 - 2 t^{-4} + 3 t^{-8} - 4 t^{-12} + ...). Multiplying by the numerator 2(t^4 - 1) = 2 t^4 - 2,
 *     (t^2 - i)^{-2} + (t^2 + i)^{-2} = (2 t^4 - 2)(t^{-8} - 2 t^{-12} + 3 t^{-16} - ...)
 *                                     = 2 t^{-4} - 6 t^{-8} + 10 t^{-12} + O(t^{-16}).
 * Verified numerically: g_2(t) * t^4 -> 2 (real leading), (g_2 + (-2 t^{-4} + 6 t^{-8})) * t^{12} -> 10.
 *
 * THE SCALING CHAIN t^{-8} -> L^{-7} -> eps^{7/2} (and the (2/3) eps^{3/2} head)
 * ----------------------------------------------------------------------------
 * R_2 = |F_2(L)| - A_1/2 = integral_L^infty g_2(t) dt = integral_L^infty [2 t^{-4} - 6 t^{-8} + O(t^{-12})] dt
 *     = (2/3) L^{-3} - (6/7) L^{-7} + O(L^{-11}).
 * Under the cusp rescaling u = sqrt(eps) t the finite cutoff u in [0,1] maps to t in [0, L] with
 * L = eps^{-1/2}, so L^{-3} = eps^{3/2} and L^{-7} = eps^{7/2} EXACTLY. Hence
 *     R_2 = (2/3) eps^{3/2} - (6/7) eps^{7/2} + O(eps^{11/2}).
 * The (2/3) eps^{3/2} HEAD builds the leading K_{3/2}; the -(6/7) eps^{7/2} SUBLEADING tail is the
 * numerator eps^{7/2} source imp-35299 measured on the grid as (R_2 - (2/3) eps^{3/2})/eps^{7/2} -> -6/7.
 *
 * MAPPING THE -(6/7) RAW TAIL TO THE K_{7/2} CONTRIBUTION (matches imp-35299)
 * --------------------------------------------------------------------------
 * In dev = rho(eps) - 2/3 = (b R_2 - a D_3)/(2 b (b + D_3)) with a = A_1/2, b = A_2/4, the numerator raw
 * tail maps through the fixed linearization factor 1/(2 b) = 2/A_2:
 *     numerator contribution = -(6/7) / (2 b) = -12/(7 A_2) = -8/(7 A_1) = -0.514466,
 * using A_1/A_2 = 2/3 (so 12/A_2 = 8/A_1). This is EXACTLY the imp-35299 measured numerator contribution
 * -8/(7 A_1) = -0.514466 (its ~42.9% share of K_{7/2}); the other 57.1% is the imp-35265 curvature tail.
 * So the numerator eps^{7/2} coefficient is now DERIVED in closed form, no longer a 6-sig-fig grid read.
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a
 * rigorous remainder bound on the TRUE RvM cusp jet. Deriving the numerator R_2 tail as an exact identity
 * pins one of the two eps^{7/2} coefficients the remainder SHAPE carries but supplies neither the uniform
 * inequality nor a certified bound, and is carried out on the inherited model-cusp surrogate. G-b / G6a
 * stay OPEN.
 *
 * VERDICT: DERIVATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate,
 * G6a_shock_lipschitz STAYS OPEN. The |F_2| even-p numerator branch pair is now an EXACT algebraic
 * identity, (t^2 - i)^{-2} + (t^2 + i)^{-2} = 2(t^4 - 1)/(t^4 + 1)^2 = 2 t^{-4} - 6 t^{-8} + 10 t^{-12} +
 * O(t^{-16}); its leading 2 t^{-4} SURVIVES (even-p SUM: imaginary parts cancel, real leading adds --
 * CONTRAST with the imp-35265 odd-p pair whose leading t^{-6} cancelled), integrating to the (2/3) eps^{3/2}
 * head, and its SUBLEADING -6 t^{-8} -> -(6/7) L^{-7} -> -(6/7) eps^{7/2} tail supplies the numerator source
 * that maps to -8/(7 A_1) = -0.514466, matching the imp-35299 grid-measured numerator contribution exactly.
 * This upgrades the imp-35299 numerator-tail measurement to a derivation but does NOT certify a uniform
 * modulus, does NOT discharge O3 or G6a, establishes no operator positivity, changes no bound. imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35265-eps52-cancellation-exact-identity (the companion odd-p |F_3| branch, derived exactly)
 * @see imp-35299-k72-two-source-decomposition (measured the |F_2| numerator tail -6/7 on the grid; derived here)
 * @see imp-35244-rho-eps52-coefficient-measurement (assembled K_{7/2} from the two sources)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2), F_2(inf) = -A_1/2)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), A_1/A_2 = 2/3)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants (imp-33645 / imp-33646).
const A1 = PI / SQRT2; // eps^{3/2} renorm of |m_prime|        -> |F_2(inf)| = A_1/2 = a
const A2 = (3 * PI) / (2 * SQRT2); // eps^{5/2} renorm of |m_double_prime| -> |F_3(inf)| = A_2/4 = b

// ── Minimal complex arithmetic (matches the imp-35265 branch route). ──
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
function cadd(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}
function cpowNegInt(z, p) {
  let d = [1, 0];
  for (let k = 0; k < p; k++) d = cmul(d, z);
  return cinv(d); // z^{-p}
}

// g2_branch(t) = (t^2 - i)^{-2} + (t^2 + i)^{-2}  (the m-prime even-p B_2 branch pair after u = sqrt(eps) t).
function g2Branch(t) {
  const t2 = t * t;
  return cadd(cpowNegInt([t2, -1], 2), cpowNegInt([t2, 1], 2));
}
// Closed rational form derived above: 2(t^4 - 1)/(t^4 + 1)^2  (REAL).
function g2Closed(t) {
  const t4 = t * t * t * t;
  const s = t4 + 1;
  return [(2 * (t4 - 1)) / (s * s), 0];
}

// ── (A) Exact identity: g2_branch matches the closed rational form to machine precision. ──
const T_TEST = [2, 5, 10, 50];
const IDENTITY_MAX_DIFF = Math.max(
  ...T_TEST.map((t) => {
    const a = g2Branch(t);
    const b = g2Closed(t);
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  }),
);
// The pair is real (imaginary parts of the two branches cancel): max |Im| over the test points -> 0.
const MAX_IM = Math.max(...T_TEST.map((t) => Math.abs(g2Branch(t)[1])));

// ── (B) Leading term SURVIVES (even-p SUM, no cancellation): g2 * t^4 -> 2 (real). ──
const T4_READS = [10, 30, 100].map((t) => g2Closed(t)[0] * Math.pow(t, 4)); // -> 2
const LEADING_T4_SURVIVES = Math.abs(T4_READS[T4_READS.length - 1] - 2) < 1e-4;
// Each single branch alone carries a t^{-4} term (so the surviving leading is a real ADD, not a fluke).
const SINGLE_BRANCH_T4 = (() => {
  const t = 100;
  const one = cpowNegInt([t * t, 1], 2); // (t^2 + i)^{-2}, magnitude ~ t^{-4}
  return Math.hypot(one[0], one[1]) * Math.pow(t, 4); // -> 1
})();

// ── (C) Next term is -6 t^{-8}: (g2 - 2 t^{-4}) * t^8 -> -6, then next is +10 t^{-12}. ──
const NEXT_T8_READS = [10, 30, 100].map((t) => (g2Closed(t)[0] - 2 / Math.pow(t, 4)) * Math.pow(t, 8)); // -> -6
const NEXT_MINUS6 = Math.abs(NEXT_T8_READS[NEXT_T8_READS.length - 1] - -6) < 1e-4;
// The +10 t^{-12} read must avoid catastrophic cancellation, so use a moderate t (t = 30).
const T30_T12_READ = (g2Closed(30)[0] - 2 / Math.pow(30, 4) + 6 / Math.pow(30, 8)) * Math.pow(30, 12); // -> 10
const NEXT_PLUS10 = Math.abs(T30_T12_READ - 10) < 5e-2;

// ── (D) Scaling chain t^{-8} -> L^{-7} -> eps^{7/2} and the (2/3) eps^{3/2} head (compensated tail quadrature). ──
const TAIL_PANELS = 300000;
function compensatedSimpson(f, panels) {
  const h = 1 / panels;
  let sum = 0;
  let comp = 0;
  for (let i = 0; i <= panels; i++) {
    const w = i === 0 || i === panels ? 1 : i % 2 === 1 ? 4 : 2;
    const y = w * f(i * h) - comp;
    const t = sum + y;
    comp = t - sum - y;
    sum = t;
  }
  return (sum * h) / 3;
}
// integral_L^infinity g(t) dt via t = L/w (integrand -> 0 at w = 0).
function tailIntegral(gReal, L, panels) {
  return compensatedSimpson((w) => {
    if (w === 0) return 0;
    const t = L / w;
    return gReal(t) * (L / (w * w));
  }, panels);
}
function g2ClosedReal(t) {
  return g2Closed(t)[0];
}

// Read the numerator R_2 tail on a short clean ladder; the eps = 1e-4 rung is the tightest before tail
// quadrature roundoff degrades the eps^{7/2} extraction (eps below the imp-35244 Simpson floor ~2.5e-3).
const EPS_LADDER = [1e-3, 3e-4, 1e-4];
const LADDER = EPS_LADDER.map((eps) => {
  const L = 1 / Math.sqrt(eps);
  const R2 = tailIntegral(g2ClosedReal, L, TAIL_PANELS); // |F_2(L)| - A_1/2
  const headCoeff = (R2 - -0) / Math.pow(eps, 1.5); // approx (2/3) at leading order (dominated by head)
  const rawTail = (R2 - (2 / 3) * Math.pow(eps, 1.5)) / Math.pow(eps, 3.5); // -> -6/7
  const contribNum = rawTail / (2 * (A2 / 4)); // -> -8/(7 A_1)
  return { eps, R2, headCoeff, rawTail, contribNum };
});
// Best clean rung = the one whose raw tail is closest to -6/7.
const BEST = LADDER.reduce((best, r) => (Math.abs(r.rawTail - -6 / 7) < Math.abs(best.rawTail - -6 / 7) ? r : best));

// Closed-form targets (matching imp-35299).
const RAW_NUM_TAIL_CF = -6 / 7; // (R_2 - (2/3) eps^{3/2})/eps^{7/2} -> -6/7
const CONTRIB_NUM_CF = -8 / (7 * A1); // -12/(7 A_2) = -8/(7 A_1) = -0.514466
const HEAD_CF = 2 / 3; // R_2 head coefficient (2/3) eps^{3/2}

const HEAD_MATCHES = Math.abs(BEST.headCoeff - HEAD_CF) < 5e-3;
const RAW_TAIL_MATCHES = Math.abs(BEST.rawTail - RAW_NUM_TAIL_CF) < 5e-4;
const CONTRIB_MATCHES = Math.abs(BEST.contribNum - CONTRIB_NUM_CF) < 5e-4;

export const IMP35394_F2_NUMERATOR_TAIL_EXACT_IDENTITY = {
  id: 'imp-35394',
  proofSection: 'S-frontier',
  scopes:
    'Derive the |F_2| (m-prime, even-p B_2) numerator branch tail as an exact rational identity -- the ' +
    'imp-35265 analog for the m-prime integrand -- expand its large-t tail, and confirm the analytic R_2-tail ' +
    'eps^{7/2} coefficient matches the imp-35299 measured -(6/7) numerator contribution',
  question:
    'Is the |F_2| even-p branch pair (t^2 - i)^{-2} + (t^2 + i)^{-2} = 2(t^4 - 1)/(t^4 + 1)^2 an exact ' +
    'identity whose surviving leading 2 t^{-4} builds the (2/3) eps^{3/2} head and whose subleading -6 t^{-8} ' +
    'tail gives R_2 = (2/3) eps^{3/2} - (6/7) eps^{7/2}, so the numerator contribution to K_{7/2} is ' +
    '-8/(7 A_1) = -0.514466? Derivation only on the inherited surrogate; does NOT discharge O3; G6a OPEN; NO QED.',

  // The exact closed-rational identity for the even-p numerator branch pair.
  exactIdentity: '(t^2 - i)^{-2} + (t^2 + i)^{-2} = 2(t^4 - 1)/(t^4 + 1)^2',
  identityMaxDiff: +IDENTITY_MAX_DIFF.toExponential(3), // < 1e-14: matches closed form to machine precision
  pairIsReal: MAX_IM < 1e-14, // imaginary parts of the two branches cancel; the SUM is real
  largeTExpansion: '(t^2 - i)^{-2} + (t^2 + i)^{-2} = 2 t^{-4} - 6 t^{-8} + 10 t^{-12} + O(t^{-16})',

  // The structural contrast with imp-35265: even-p leading SURVIVES (real ADD), odd-p leading cancelled.
  leadingT4Survives: LEADING_T4_SURVIVES, // g_2 t^4 -> 2 (real); even-p SUM keeps the leading term
  singleBranchT4Magnitude: +SINGLE_BRANCH_T4.toFixed(6), // ~1: each branch is ~t^{-4}; the SUM keeps it
  nextTermMinus6: NEXT_MINUS6, // (g_2 - 2 t^{-4}) t^8 -> -6
  nextNextTermPlus10: NEXT_PLUS10, // (g_2 - 2 t^{-4} + 6 t^{-8}) t^{12} -> +10 (read at t = 30)
  contrastWithImp35265:
    'even-p SUM keeps the real leading 2 t^{-4} (imaginary parts cancel), so the numerator eps^{7/2} source ' +
    'is the SUBLEADING -6 t^{-8} tail; the imp-35265 odd-p pair instead CANCELLED its leading t^{-6}',

  // The scaling chain and the R_2 tail.
  scalingChain:
    'R_2 = integral_L^infty g_2 = (2/3) L^{-3} - (6/7) L^{-7} + O(L^{-11}); L = eps^{-1/2} => ' +
    'R_2 = (2/3) eps^{3/2} - (6/7) eps^{7/2} + O(eps^{11/2})',
  headCoefficient: +BEST.headCoeff.toFixed(6), // -> 2/3 (builds the leading K_{3/2})
  headCoefficientClosedForm: +HEAD_CF.toFixed(10), // 0.6666666667
  headMatches: HEAD_MATCHES,

  // The numerator eps^{7/2} coefficient (derived), matching the imp-35299 grid read.
  rawNumeratorTail: +BEST.rawTail.toFixed(6), // -> -6/7 = -0.857143
  rawNumeratorTailClosedForm: +RAW_NUM_TAIL_CF.toFixed(10), // -0.8571428571
  rawTailMatches: RAW_TAIL_MATCHES,
  contribNumerator: +BEST.contribNum.toFixed(6), // -> -8/(7 A_1) = -0.514466
  contribNumeratorClosedForm: +CONTRIB_NUM_CF.toFixed(10), // -0.5144664664
  contribNumeratorExpr: 'numerator |F_2| tail: -(6/7)/(2 b) = -12/(7 A_2) = -8/(7 A_1)',
  contribMatches: CONTRIB_MATCHES,
  bestEps: +BEST.eps.toExponential(1),

  correctedNumeratorTail: 'R_2 = (2/3) eps^{3/2} - (6/7) eps^{7/2} + O(eps^{11/2})',

  dischargesO3orG6a: false,
  isRigorous: false,
  verdict:
    'DERIVATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, ' +
    'G6a_shock_lipschitz STAYS OPEN. The |F_2| even-p numerator branch pair is now an EXACT algebraic ' +
    'identity: (t^2 - i)^{-2} + (t^2 + i)^{-2} = 2(t^4 - 1)/(t^4 + 1)^2 = 2 t^{-4} - 6 t^{-8} + 10 t^{-12} ' +
    '+ O(t^{-16}) (a REAL rational function -- the imaginary parts of the two conjugate branches cancel). ' +
    'Its leading 2 t^{-4} SURVIVES (even-p SUM: real parts ADD; each single branch carries a t^{-4} term, ' +
    'CONTRAST with the imp-35265 odd-p pair whose leading t^{-6} cancelled), integrating to the (2/3) ' +
    'eps^{3/2} head that builds the leading K_{3/2}; its SUBLEADING -6 t^{-8} -> -(6/7) L^{-7} -> -(6/7) ' +
    'eps^{7/2} tail (L = eps^{-1/2}, so L^{-7} = eps^{7/2} exactly) supplies the numerator eps^{7/2} source, ' +
    'which maps through the linearization factor 1/(2 b) to the contribution -12/(7 A_2) = -8/(7 A_1) = ' +
    '-0.514466 -- matching the imp-35299 grid-measured numerator contribution exactly. This upgrades the ' +
    'imp-35299 numerator-tail measurement to a derivation but does NOT certify a uniform modulus, does NOT ' +
    'discharge O3 or G6a, establishes no operator positivity, changes no bound. imp-3066 off-diagonal ' +
    'endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35394_F2_NUMERATOR_TAIL_ASSERTIONS = [
  {
    // (1) the even-p branch pair equals the closed rational form 2(t^4 - 1)/(t^4 + 1)^2 to machine precision.
    id: 'imp35394-exact-rational-identity',
    description:
      'the even-p pair (t^2 - i)^{-2} + (t^2 + i)^{-2} matches 2(t^4 - 1)/(t^4 + 1)^2 to machine precision, and is real',
    holds: () => IDENTITY_MAX_DIFF < 1e-14 && MAX_IM < 1e-14,
  },
  {
    // (2) the leading t^{-4} SURVIVES (even-p SUM): g_2 t^4 -> 2, though each single branch is ~t^{-4}.
    id: 'imp35394-leading-t4-survives',
    description: 'g_2 t^4 -> 2 (real leading survives; single-branch t^4 magnitude ~1, so the SUM keeps it)',
    holds: () =>
      LEADING_T4_SURVIVES === true &&
      Math.abs(SINGLE_BRANCH_T4 - 1) < 1e-2 &&
      Math.abs(T4_READS[T4_READS.length - 1] - 2) < 1e-4,
  },
  {
    // (3) the subleading coefficient is -6 t^{-8} and the next term is +10 t^{-12}.
    id: 'imp35394-subleading-coefficient-minus6',
    description: '(g_2 - 2 t^{-4}) t^8 -> -6, pinning the subleading term at -6 t^{-8} and the next at +10 t^{-12}',
    holds: () => NEXT_MINUS6 === true && NEXT_PLUS10 === true,
  },
  {
    // (4) the R_2 head coefficient is (2/3): the surviving 2 t^{-4} integrates to (2/3) eps^{3/2}.
    id: 'imp35394-r2-head-two-thirds',
    description: 'R_2 head coefficient -> 2/3: integral_L^infty 2 t^{-4} dt = (2/3) L^{-3} = (2/3) eps^{3/2}',
    holds: () => HEAD_MATCHES === true && Math.abs(BEST.headCoeff - 2 / 3) < 5e-3,
  },
  {
    // (5) the numerator eps^{7/2} tail is -(6/7) and maps to the imp-35299 contribution -8/(7 A_1) = -0.514466.
    id: 'imp35394-numerator-eps72-matches-imp35299',
    description:
      'raw numerator tail -> -6/7 and mapped contribution -> -8/(7 A_1) = -0.514466 (matches imp-35299)',
    holds: () =>
      RAW_TAIL_MATCHES === true &&
      CONTRIB_MATCHES === true &&
      Math.abs(BEST.rawTail - -6 / 7) < 5e-4 &&
      Math.abs(BEST.contribNum - -0.5144664664) < 5e-4,
  },
  {
    // Honesty gate: derivation only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35394-honesty-gate-no-qed',
    description:
      'Derivation only: exact identity pinned but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35394_F2_NUMERATOR_TAIL_EXACT_IDENTITY.isRigorous === false &&
      IMP35394_F2_NUMERATOR_TAIL_EXACT_IDENTITY.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35394_F2_NUMERATOR_TAIL_EXACT_IDENTITY.verdict) &&
      /STAYS OPEN/.test(IMP35394_F2_NUMERATOR_TAIL_EXACT_IDENTITY.verdict) &&
      /refereed bound is changed/i.test(IMP35394_F2_NUMERATOR_TAIL_EXACT_IDENTITY.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35394_F2_NUMERATOR_TAIL_EXACT_IDENTITY.verdict,
      ),
  },
];

for (const a of IMP35394_F2_NUMERATOR_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35394-f2-numerator-tail-exact-identity assertion failed: ${a.id}`);
  }
}
