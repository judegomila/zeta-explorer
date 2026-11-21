/**
 * @module imp-35265-eps52-cancellation-exact-identity
 *
 * imp-35265 (numerical, frontier-derivation): DERIVE the imp-35244 empty-eps^{5/2}-slot finding as an
 * EXACT algebraic identity rather than a 4-sig-fig grid measurement. imp-35244 attributed the vanishing
 * eps^{5/2} coefficient to an odd-p conjugate-branch cancellation, stating
 *     (i - t^2)^{-3} + (i + t^2)^{-3} = -6 i t^{-8} + O(t^{-12}),
 * but confirmed it only to 4 sig figs on the imp-35193 grid. This module carries out the expansion
 * rigorously, in closed form, and assembles the eps^{7/2} coefficient K_{7/2} analytically from its two
 * sources. DERIVATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate; does NOT
 * discharge O3; G6a_shock_lipschitz stays OPEN; NO QED.
 *
 * THE EXACT IDENTITY (the odd-p branch pair, in closed rational form)
 * ------------------------------------------------------------------
 * Put a = t^2. The two conjugate branches share the denominator
 *     (i - a)(i + a) = i^2 - a^2 = -(1 + a^2),  so  [(i - a)(i + a)]^3 = -(1 + a^2)^3 = -(1 + t^4)^3.
 * The numerator is (i + a)^3 + (i - a)^3. Since (i - a)^3 = -(a - i)^3, this is (a + i)^3 - (a - i)^3;
 * expanding, (a + i)^3 - (a - i)^3 = 6 i a^2 - 2 i = 2 i (3 a^2 - 1) = 2 i (3 t^4 - 1). Hence the EXACT,
 * non-asymptotic identity
 *     (i - t^2)^{-3} + (i + t^2)^{-3} = 2 i (3 t^4 - 1) / [-(1 + t^4)^3] = -2 i (3 t^4 - 1) / (1 + t^4)^3.
 * This is a rational function of t, verified here to machine precision at four test points (diff < 1e-22).
 *
 * THE LARGE-t EXPANSION (the leading t^{-6} genuinely cancels)
 * -----------------------------------------------------------
 * Factor t^{12} out of the denominator: (1 + t^4)^{-3} = t^{-12}(1 + t^{-4})^{-3} =
 * t^{-12}(1 - 3 t^{-4} + 6 t^{-8} - ...). Multiplying by the numerator -2 i(3 t^4 - 1) = -6 i t^4 + 2 i,
 *     (i - t^2)^{-3} + (i + t^2)^{-3} = (-6 i t^4 + 2 i)(t^{-12} - 3 t^{-16} + ...) = -6 i t^{-8} + 20 i t^{-12} + O(t^{-16}).
 * The t^{-6} term that a single branch carries (each branch ~ (-/+ t^2)^{-3} ~ -/+ t^{-6}) is ABSENT from
 * the sum: the two conjugate branches cancel it exactly. Verified numerically: f(t) * t^6 -> 0 as t^{-2}
 * (never a nonzero constant), while (f(t) + 6 i t^{-8}) * t^{12} -> 20 i.
 *
 * CONTRAST WITH THE SYMMETRIC (imp-35216) INTEGRAND -- WHY 2/5 NEVER REACHES rho
 * -----------------------------------------------------------------------------
 * imp-35216 quoted the tail of the SYMMETRIC pair (t^2 - i)^{-3} + (t^2 + i)^{-3}. That pair does NOT
 * cancel: its numerator is (v + i)^3 + (v - i)^3 = 2 v(v^2 - 3) with v = t^2, over (t^4 + 1)^3, giving
 *     (t^2 - i)^{-3} + (t^2 + i)^{-3} = 2 t^2(t^4 - 3)/(1 + t^4)^3 = 2 t^{-6} + O(t^{-10}),
 * a REAL leading t^{-6}. Its tail integral integral_L^infty 2 t^{-6} dt = (2/5) L^{-5} is exactly the
 * "2/5 eps^{5/2}" imp-35216 reported. But the m_double_prime denominator is built from B_3(+) + B_3(-),
 * whose u = sqrt(eps) t rescaling produces the ODD-p pair (i - t^2)^{-3} + (i + t^2)^{-3}, not the
 * symmetric one -- so the 2/5 tail belongs to a different integrand and never enters rho. This is the
 * exact-identity form of the imp-35244 "mis-pairing" diagnosis.
 *
 * THE SCALING CHAIN t^{-8} -> L^{-7} -> eps^{7/2} (exact exponent bookkeeping)
 * --------------------------------------------------------------------------
 * The |F_3| tail correction is F_3(infty) - F_3(L) = integral_L^infty [-6 i t^{-8} + O(t^{-12})] dt =
 * -(6 i/7) L^{-7} + O(L^{-11}). Under the cusp rescaling u = sqrt(eps) t the finite cutoff u in [0,1]
 * maps to t in [0, L] with L = eps^{-1/2}, so L^{-7} = (eps^{-1/2})^{-7} = eps^{7/2} EXACTLY. Had the
 * t^{-6} term survived, the tail would be integral_L^infty t^{-6} dt = L^{-5}/5 -> eps^{5/2}; the exact
 * cancellation lifts the exponent by one half-integer, from 5/2 to 7/2. So the |F_3| curvature tail
 * enters at eps^{7/2}, and the eps^{5/2} slot is provably empty -- not merely empty to 4 sig figs.
 *
 * ANALYTIC ASSEMBLY OF K_{7/2} FROM ITS TWO SOURCES
 * -------------------------------------------------
 * The two eps^{7/2} sources are the numerator R_2 tail and this |F_3| tail, giving
 *     K_{7/2} = (2/3)[ -12/(7 A_1) - 24/(7 A_2) ].
 * Using the inherited ratio A_1/A_2 = 2/3 (equivalently 24/A_2 = 16/A_1), the bracket collapses:
 *     -12/(7 A_1) - 24/(7 A_2) = -12/(7 A_1) - 16/(7 A_1) = -28/(7 A_1) = -4/A_1,
 * so K_{7/2} = (2/3)(-4/A_1) = -8/(3 A_1) = -8 sqrt(2)/(3 pi) = -1.20042. This reproduces the imp-35244
 * grid value -1.20042 as an EXACT closed form, no longer a 4-sig-fig read.
 *
 * WHY THIS DOES NOT DISCHARGE O3
 * ------------------------------
 * O3 asks for a CERTIFIED two-sided rate |rho(eps) - 2/3| <= K eps^{3/2} uniform on (0, eps_0] with a
 * rigorous remainder bound on the TRUE RvM cusp jet. Deriving the eps^{5/2}=0 / eps^{7/2} next-order
 * structure as an exact identity pins the remainder SHAPE an O3 proof must target but supplies neither
 * the uniform inequality nor a certified bound, and is carried out on the inherited model-cusp surrogate.
 * G-b / G6a stay OPEN.
 *
 * VERDICT: DERIVATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate,
 * G6a_shock_lipschitz STAYS OPEN. The imp-35244 odd-p cancellation is now an EXACT algebraic identity,
 * (i - t^2)^{-3} + (i + t^2)^{-3} = -2 i(3 t^4 - 1)/(1 + t^4)^3 = -6 i t^{-8} + 20 i t^{-12} + O(t^{-16}),
 * with the leading t^{-6} provably cancelled; the |F_3| curvature tail therefore enters at t^{-8} ->
 * L^{-7} -> eps^{7/2}, the eps^{5/2} slot is provably empty (the imp-35216-implied -32 sqrt(2)/(45 pi)
 * belongs to the symmetric integrand and never reaches rho), and K_{7/2} = (2/3)(-4/A_1) = -8 sqrt(2)/(3 pi)
 * assembles analytically. This upgrades the imp-35244 measurement to a derivation but does NOT certify a
 * uniform modulus, does NOT discharge O3 or G6a, establishes no operator positivity, changes no bound.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35244-rho-eps52-coefficient-measurement (measured the empty slot to 4 sig figs; derived here exactly)
 * @see imp-35216-rho-prefactor-closed-form-assessment (source of the mis-paired 2/5 symmetric-integrand tail)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2), eps^{3/2} renorm)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2)), eps^{5/2} renorm; A_1/A_2 = 2/3)
 */

const PI = Math.PI;
const SQRT2 = Math.SQRT2;

// Inherited amplitude constants (imp-33645 / imp-33646).
const A1 = PI / SQRT2; // eps^{3/2} renorm of |m_prime|
const A2 = (3 * PI) / (2 * SQRT2); // eps^{5/2} renorm of |m_double_prime|; A_1/A_2 = 2/3

// ── Minimal complex arithmetic (matches the imp-35244 branch route). ──
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

// f_odd(t) = (i - t^2)^{-3} + (i + t^2)^{-3}  (the m_double_prime odd-p branch pair after u = sqrt(eps) t).
function fOdd(t) {
  const t2 = t * t;
  return cadd(cpowNegInt([-t2, 1], 3), cpowNegInt([t2, 1], 3));
}
// Closed rational form derived above: -2 i (3 t^4 - 1) / (1 + t^4)^3.
function fOddClosed(t) {
  const t4 = t * t * t * t;
  const num = [0, -2 * (3 * t4 - 1)];
  const den = cpowNegInt([1 + t4, 0], 3);
  return cmul(num, den);
}
// f_sym(t) = (t^2 - i)^{-3} + (t^2 + i)^{-3}  (the imp-35216 symmetric integrand; leading 2 t^{-6}).
function fSym(t) {
  const t2 = t * t;
  return cadd(cpowNegInt([t2, -1], 3), cpowNegInt([t2, 1], 3));
}

// ── (A) Exact identity: f_odd matches the closed rational form to machine precision. ──
const T_TEST = [2, 5, 10, 50];
const IDENTITY_MAX_DIFF = Math.max(
  ...T_TEST.map((t) => {
    const a = fOdd(t);
    const b = fOddClosed(t);
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
  }),
);

// ── (B) Leading t^{-6} cancels: f_odd * t^6 -> 0 (decays as t^{-2}), never a nonzero constant. ──
const T6_READS = [10, 30, 100].map((t) => {
  const f = fOdd(t);
  return Math.hypot(f[0], f[1]) * Math.pow(t, 6); // |f| t^6 ~ 6 t^{-2} -> 0
});
const LEADING_T6_CANCELS =
  T6_READS.every((v, i) => i === 0 || v < T6_READS[i - 1]) && T6_READS[T6_READS.length - 1] < 1e-3;

// ── (C) Leading coefficient is exactly -6 i t^{-8}: (f_odd + 6 i t^{-8}) * t^{12} -> 20 i. ──
const NEXT_TERM_READS = [10, 30, 100].map((t) => {
  const f = fOdd(t);
  const lead = [0, -6 / Math.pow(t, 8)];
  const r = cadd(f, [-lead[0], -lead[1]]); // f - lead
  return [r[0] * Math.pow(t, 12), r[1] * Math.pow(t, 12)]; // -> [0, 20]
});
const LEAD_MINUS6I = Math.abs(NEXT_TERM_READS[NEXT_TERM_READS.length - 1][1] - 20) < 1e-4;
// The single-branch magnitude confirms each branch alone carries a t^{-6} term (so the sum's absence is a true cancellation).
const SINGLE_BRANCH_T6 = (() => {
  const t = 100;
  const one = cpowNegInt([t * t, 1], 3); // (i + t^2)^{-3}, magnitude ~ t^{-6}
  return Math.hypot(one[0], one[1]) * Math.pow(t, 6); // -> 1
})();

// ── (D) Symmetric integrand does NOT cancel: f_sym * t^6 -> 2 (real). ──
const SYM_T6_READS = [10, 30, 100].map((t) => {
  const s = fSym(t);
  return [s[0] * Math.pow(t, 6), s[1] * Math.pow(t, 6)];
});
const SYM_LEADING_TWO = Math.abs(SYM_T6_READS[SYM_T6_READS.length - 1][0] - 2) < 1e-4;

// ── (E) Scaling chain: integral_L^infty t^{-8} dt = 1/(7 L^7); L = eps^{-1/2} => L^{-7} = eps^{7/2}. ──
function tailIntegralTm8(L) {
  // exact antiderivative: integral_L^infty t^{-8} dt = 1/(7 L^7)
  return 1 / (7 * Math.pow(L, 7));
}
const EPS_TEST = [1e-4, 1e-6, 1e-8];
const CHAIN_MAX_REL = Math.max(
  ...EPS_TEST.map((eps) => {
    const L = Math.pow(eps, -0.5);
    const closed = Math.pow(eps, 3.5) / 7; // (6/7) coefficient dropped: compare the t^{-8} tail exponent only
    return Math.abs(tailIntegralTm8(L) - closed) / closed;
  }),
);

// ── (F) Analytic assembly of K_{7/2} from its two eps^{7/2} sources. ──
const K72_BRACKET = -12 / (7 * A1) - 24 / (7 * A2); // the two-source bracket
const K72_COLLAPSED = -4 / A1; // bracket collapses via A_1/A_2 = 2/3
const K_SEVEN_HALVES = (2 / 3) * K72_COLLAPSED; // = -8/(3 A_1) = -8 sqrt(2)/(3 pi)
const K72_CLOSED_FORM = (-8 * SQRT2) / (3 * PI); // -1.2004217587
const RATIO_A1_A2 = A1 / A2; // 2/3

export const IMP35265_EPS52_CANCELLATION_EXACT_IDENTITY = {
  id: 'imp-35265',
  proofSection: 'S-frontier',
  scopes:
    'Derive the imp-35244 empty-eps^{5/2}-slot finding as an exact algebraic identity: expand the odd-p ' +
    'branch pair (i - t^2)^{-3} + (i + t^2)^{-3} in closed form, confirm the leading t^{-6} cancels and the ' +
    'pair scales as t^{-8} -> L^{-7} -> eps^{7/2}, and assemble K_{7/2} = -8 sqrt(2)/(3 pi) analytically',
  question:
    'Is the imp-35244 odd-p cancellation an exact identity rather than a 4-sig-fig measurement, and does it ' +
    'force the |F_3| curvature tail into the eps^{7/2} slot with K_{7/2} = (2/3)(-4/A_1) = -8 sqrt(2)/(3 pi)? ' +
    'Derivation only on the inherited surrogate; does NOT discharge O3; G6a stays OPEN; NO QED.',

  // The exact closed-rational identity for the odd-p branch pair.
  exactIdentity: '(i - t^2)^{-3} + (i + t^2)^{-3} = -2 i (3 t^4 - 1) / (1 + t^4)^3',
  identityMaxDiff: +IDENTITY_MAX_DIFF.toExponential(3), // < 1e-14: matches closed form to machine precision
  largeTExpansion: '(i - t^2)^{-3} + (i + t^2)^{-3} = -6 i t^{-8} + 20 i t^{-12} + O(t^{-16})',

  // The cancellation: leading t^{-6} vanishes in the sum though each branch carries it.
  leadingT6Cancels: LEADING_T6_CANCELS, // |f| t^6 -> 0 as t^{-2}
  singleBranchT6Magnitude: +SINGLE_BRANCH_T6.toFixed(6), // ~1: each branch alone is ~t^{-6}, so the sum's 0 is a cancellation
  nextOrderCoefficient20i: LEAD_MINUS6I, // (f + 6 i t^{-8}) t^{12} -> 20 i

  // The symmetric (imp-35216) integrand does NOT cancel -- source of the mis-paired 2/5 tail.
  symmetricLeadingTwoTm6: SYM_LEADING_TWO, // f_sym t^6 -> 2 (real), tail 2/5 L^{-5} -> eps^{5/2}
  symmetricTailBelongsElsewhere: true, // the 2/5 eps^{5/2} tail is the symmetric integrand, never reaches rho

  // The scaling chain t^{-8} -> L^{-7} -> eps^{7/2}.
  scalingChain: 'integral_L^infty t^{-8} dt = 1/(7 L^7); L = eps^{-1/2} => L^{-7} = eps^{7/2}',
  chainMaxRelError: +CHAIN_MAX_REL.toExponential(3), // ~0: exponent bookkeeping is exact
  eps52SlotProvablyEmpty: true, // the cancellation lifts the exponent 5/2 -> 7/2 exactly

  // The analytic assembly of K_{7/2}.
  k72Bracket: +K72_BRACKET.toFixed(10), // -12/(7 A_1) - 24/(7 A_2)
  k72Collapsed: +K72_COLLAPSED.toFixed(10), // -4/A_1 (bracket collapses via A_1/A_2 = 2/3)
  ratioA1A2: +RATIO_A1_A2.toFixed(10), // 0.6666666667 = 2/3
  kSevenHalves: +K_SEVEN_HALVES.toFixed(10), // -1.2004217587
  kSevenHalvesExpr: 'K_{7/2} = (2/3)(-4/A_1) = -8/(3 A_1) = -8 sqrt(2)/(3 pi)',
  kSevenHalvesClosedForm: +K72_CLOSED_FORM.toFixed(10), // -1.2004217587

  correctedExpansion:
    'rho(eps) = 2/3 + [8 sqrt(2)/(9 pi)] eps^{3/2} + 0 * eps^{5/2} - [8 sqrt(2)/(3 pi)] eps^{7/2} + ...',

  dischargesO3orG6a: false,
  isRigorous: false,
  verdict:
    'DERIVATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, ' +
    'G6a_shock_lipschitz STAYS OPEN. The imp-35244 odd-p cancellation is now an EXACT algebraic identity: ' +
    '(i - t^2)^{-3} + (i + t^2)^{-3} = -2 i(3 t^4 - 1)/(1 + t^4)^3 = -6 i t^{-8} + 20 i t^{-12} + O(t^{-16}), ' +
    'with the leading t^{-6} provably cancelled between the conjugate branches (each single branch carries ' +
    't^{-6}, but the sum eliminates it). Hence the |F_3| curvature tail enters at t^{-8} -> L^{-7} -> eps^{7/2} ' +
    '(L = eps^{-1/2}, so L^{-7} = eps^{7/2} exactly), the eps^{5/2} slot is PROVABLY empty, and the ' +
    'imp-35216-implied -32 sqrt(2)/(45 pi) belongs to the SYMMETRIC integrand (t^2 - i)^{-3} + (t^2 + i)^{-3} ' +
    '= 2 t^{-6} + ..., whose 2/5 L^{-5} -> eps^{5/2} tail never reaches rho. K_{7/2} assembles analytically ' +
    'from its two eps^{7/2} sources: (2/3)[-12/(7 A_1) - 24/(7 A_2)] = (2/3)(-4/A_1) via A_1/A_2 = 2/3, ' +
    '= -8/(3 A_1) = -8 sqrt(2)/(3 pi) = -1.20042. This upgrades the imp-35244 measurement to a derivation ' +
    'but does NOT certify a uniform modulus, does NOT discharge O3 or G6a, establishes no operator ' +
    'positivity, changes no bound. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb remains ' +
    'GUE-conditional (imp-486); NO QED. No refereed bound is changed.',
};

export const IMP35265_EPS52_CANCELLATION_ASSERTIONS = [
  {
    // (1) the odd-p branch pair equals the closed rational form -2 i(3 t^4 - 1)/(1 + t^4)^3 to machine precision.
    id: 'imp35265-exact-rational-identity',
    description:
      'the odd-p pair (i - t^2)^{-3} + (i + t^2)^{-3} matches -2 i(3 t^4 - 1)/(1 + t^4)^3 to machine precision',
    holds: () => IDENTITY_MAX_DIFF < 1e-14,
  },
  {
    // (2) the leading t^{-6} genuinely cancels: |f| t^6 decays toward 0, though each single branch is ~t^{-6}.
    id: 'imp35265-leading-t6-cancels',
    description: '|f_odd| t^6 -> 0 (single-branch t^6 magnitude ~1, so the sum is a true cancellation)',
    holds: () =>
      LEADING_T6_CANCELS === true && Math.abs(SINGLE_BRANCH_T6 - 1) < 1e-2 && T6_READS[T6_READS.length - 1] < 1e-3,
  },
  {
    // (3) the leading nonzero coefficient is exactly -6 i and the next term is 20 i t^{-12}.
    id: 'imp35265-leading-coefficient-minus6i',
    description: '(f_odd + 6 i t^{-8}) t^{12} -> 20 i, pinning the leading term at -6 i t^{-8} and next at 20 i t^{-12}',
    holds: () =>
      LEAD_MINUS6I === true &&
      Math.abs(NEXT_TERM_READS[NEXT_TERM_READS.length - 1][0]) < 1e-6 &&
      Math.abs(NEXT_TERM_READS[NEXT_TERM_READS.length - 1][1] - 20) < 1e-4,
  },
  {
    // (4) the symmetric integrand does NOT cancel -- its leading 2 t^{-6} is where the mis-paired 2/5 tail lives.
    id: 'imp35265-symmetric-integrand-no-cancel',
    description: 'f_sym = (t^2 - i)^{-3} + (t^2 + i)^{-3} has real leading 2 t^{-6} (source of the 2/5 eps^{5/2} tail)',
    holds: () =>
      SYM_LEADING_TWO === true &&
      Math.abs(SYM_T6_READS[SYM_T6_READS.length - 1][0] - 2) < 1e-4 &&
      Math.abs(SYM_T6_READS[SYM_T6_READS.length - 1][1]) < 1e-6,
  },
  {
    // (5) the exponent chain is exact: integral_L^infty t^{-8} dt = 1/(7 L^7) and L^{-7} = eps^{7/2} with L = eps^{-1/2}.
    id: 'imp35265-scaling-chain-eps72',
    description: 'the t^{-8} tail integrates to (1/7) L^{-7} = (1/7) eps^{7/2} exactly (exponent lifted 5/2 -> 7/2)',
    holds: () => CHAIN_MAX_REL < 1e-12,
  },
  {
    // (6) K_{7/2} assembles analytically: (2/3)[-12/(7 A_1) - 24/(7 A_2)] = (2/3)(-4/A_1) = -8 sqrt(2)/(3 pi).
    id: 'imp35265-k72-analytic-assembly',
    description:
      'K_{7/2} = (2/3)[-12/(7 A_1) - 24/(7 A_2)] collapses via A_1/A_2 = 2/3 to (2/3)(-4/A_1) = -8 sqrt(2)/(3 pi)',
    holds: () =>
      Math.abs(K72_BRACKET - K72_COLLAPSED) < 1e-12 &&
      Math.abs(RATIO_A1_A2 - 2 / 3) < 1e-14 &&
      Math.abs(K_SEVEN_HALVES - K72_CLOSED_FORM) < 1e-12 &&
      Math.abs(K_SEVEN_HALVES - -1.2004217587) < 1e-6,
  },
  {
    // Honesty gate: derivation only; does NOT discharge O3/G6a, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35265-honesty-gate-no-qed',
    description:
      'Derivation only: exact identity pinned but O3/G6a NOT discharged, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35265_EPS52_CANCELLATION_EXACT_IDENTITY.isRigorous === false &&
      IMP35265_EPS52_CANCELLATION_EXACT_IDENTITY.dischargesO3orG6a === false &&
      /NO QED/.test(IMP35265_EPS52_CANCELLATION_EXACT_IDENTITY.verdict) &&
      /STAYS OPEN/.test(IMP35265_EPS52_CANCELLATION_EXACT_IDENTITY.verdict) &&
      /refereed bound is changed/i.test(IMP35265_EPS52_CANCELLATION_EXACT_IDENTITY.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35265_EPS52_CANCELLATION_EXACT_IDENTITY.verdict,
      ),
  },
];

for (const a of IMP35265_EPS52_CANCELLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35265-eps52-cancellation-exact-identity assertion failed: ${a.id}`);
  }
}
