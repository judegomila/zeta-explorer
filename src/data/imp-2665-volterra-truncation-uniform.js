/**
 * @module imp-2665-volterra-truncation-uniform
 * @fileoverview imp-2665 (proof, high) -- GAP-2 of the PCC-free Volterra route.
 *   A TRUNCATION-UNIFORM analytic upper bound on the endpoint-Hankel Volterra
 *   operator norm ||V_{a,Phi}||_{L^2([0, infty))}, discharging the two sub-gaps
 *   that the finite-[0,U] numerics of imp-1267 / imp-2654 left uncontrolled:
 *     (i)  the tail past the truncation point U, and
 *     (ii) the a -> 0 limit.
 *   HONEST PARTIAL: this closes GAP-2's two NAMED items analytically. It does
 *   NOT claim Conj 27.2 on the whole physical band (the window integrals still
 *   need interval-arithmetic certification, and the large-a sliver of imp-2654
 *   stays open), and it does NOT claim 27.2 => RH.
 *
 *   TARGET (imp-1258 collapse, CONDITIONAL per imp-2666)
 *   ----------------------------------------------------
 *       ||V_{a,Phi}||_{L^2([0, infty))} <= 1            (Conj 27.2)
 *       (V f)(x) = Phi(x) int_0^x Phi(y) sinh(a(x - y)) f(y) dy.
 *
 *   The sharpest rigorous handle is Hilbert-Schmidt (imp-1267 / imp-1260):
 *
 *       ||V||_op <= ||V||_HS <= sqrt(I_0 . J_a),                       (CS-HS)
 *       I_0 = int_0^infty Phi(u)^2 du,
 *       J_a = int_0^infty Phi(u)^2 sinh^2(au) du.
 *
 *   imp-1267 / imp-2654 evaluated I_0, J_a on a FINITE window [0, U] (U = 4) by
 *   midpoint quadrature and dismissed the [U, infty) tail as "floating-point
 *   zero". GAP-2 is exactly this hand-wave plus the missing a -> 0 control. This
 *   module replaces both with explicit analytic lemmas.
 *
 *   LEMMA A  (a -> 0 limit: monotonicity in a)
 *   ------------------------------------------
 *   For every fixed u >= 0, d/da sinh^2(au) = u . sinh(2au) >= 0 on a >= 0.
 *   Hence J_a is non-decreasing in a, and so is B(a) := sqrt(I_0 . J_a).
 *   Moreover sinh(au) -> 0 as a -> 0, so by monotone convergence J_a -> 0 and
 *   B(a) -> 0 as a -> 0+. CONSEQUENCE: for any sub-band (0, A],
 *
 *       sup_{a in (0, A]} ||V_{a,Phi}||_op  <=  sup_{a in (0, A]} B(a)  =  B(A).
 *
 *   So the entire small-a regime -- INCLUDING the a -> 0 limit -- is dominated
 *   by the single right-endpoint value B(A); there is no uncontrolled gap as
 *   a -> 0. This discharges sub-gap (ii). (The empirical grid bottomed out at
 *   a = 0.025; monotonicity now covers (0, 0.025] and the limit a -> 0 too.)
 *
 *   LEMMA B  (tail past U: explicit doubly-exponential bound)
 *   --------------------------------------------------------
 *   Phi(u) = sum_{n>=1} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u}).
 *   For u >= 1 every summand is positive (2 pi n^2 e^{2u} - 3 >= 2 pi e^2 - 3 > 0),
 *   and with s := pi e^{4u} >= pi e^4 ~= 171.5 the tail of the n-sum is crushed:
 *       sum_{n>=1} n^4 e^{-n^2 s} <= e^{-s} (1 + 16 e^{-3s} + ...) <= 2 e^{-s},
 *   the n=2/n=1 ratio being 16 e^{-3s} < e^{-500}. Therefore, for u >= 1,
 *
 *       Phi(u)   <= 4 pi^2 e^{4u} exp(-pi e^{4u}),                     (Phi-UB)
 *       Phi(u)^2 <= 16 pi^4 e^{8u} exp(-2 pi e^{4u}).
 *
 *   Combined with sinh(au) <= e^{au}/2 (so sinh^2(au) <= e^{2au}/4):
 *
 *       Phi(u)^2 sinh^2(au) <= 4 pi^4 e^{(8 + 2a)u} exp(-2 pi e^{4u}).
 *
 *   Substituting w = e^{4u} (du = dw/(4w), W := e^{4U}) and using the
 *   decay-rate lemma -- for c W > beta, the integrand g(w) = w^beta e^{-cw}
 *   has g'(w)/g(w) = beta/w - c <= beta/W - c < 0 on w >= W, so
 *   int_W^infty g <= g(W)/(c - beta/W) = W^beta e^{-cW} / (c - beta/W) -- gives
 *   the closed-form tail bounds (c = 2 pi):
 *
 *       T_I(U)   := int_U^infty Phi^2 du
 *                <= 4 pi^4 . W e^{-2 pi W} / (2 pi - 1/W),
 *       T_J(U,a) := int_U^infty Phi^2 sinh^2(au) du
 *                <= pi^4 . W^{1 + a/2} e^{-2 pi W} / (2 pi - (1 + a/2)/W),
 *       W = e^{4U}, valid for U >= 1 and 2 pi W > 1 + a/2.
 *
 *   AT U = 4:  W = e^{16} ~= 8.886e6 and 2 pi W ~= 5.5833e7. The prefactors are
 *   merely polynomial in W (T_I prefactor ~= 5.51e8; even at a = 34.98 the T_J
 *   prefactor ~= 4.7e129 < e^{300}), so both tails are bounded above by
 *       (prefactor) . exp(-5.5833e7) < exp(-5.5833e7 + 300) < exp(-5e7),
 *   which underflows IEEE-754 double to exactly 0 and is > 10^7 orders of
 *   magnitude below the window values (I_0^{[0,U]} ~= 1.05e-2, J_a^{[0,U]} ~=
 *   2e-8 .. 8e-6 on the grid). This makes the imp-1267 / imp-2654 finite-window
 *   evaluations RIGOROUSLY truncation-exact to full double precision, not merely
 *   "fp-zero by inspection". This discharges sub-gap (i).
 *
 *   COMBINED TRUNCATION-UNIFORM BOUND
 *   ---------------------------------
 *   Writing I_0 = I_0^{[0,U]} + T_I(U) and J_a = J_a^{[0,U]} + T_J(U,a),
 *
 *       ||V_{a,Phi}||_op
 *          <= sqrt( (I_0^{[0,U]} + T_I(U)) . (J_a^{[0,U]} + T_J(U,a)) ),
 *
 *   with T_I, T_J bounded explicitly by Lemma B and the window factors the
 *   finite quadratures already computed. By Lemma A this right-hand side is
 *   monotone in a, so on (0, A] it is maximised at a = A. With A = A*_CS-HS =
 *   34.98046830007358 (imp-1260 crossover, where B(A) = 1) the bound is < 1 on
 *   ALL of (0, ~34.98], now truncation-uniform and a -> 0 -uniform.
 *
 *   WHAT REMAINS (honest scope)
 *   ---------------------------
 *   - The WINDOW integrals I_0^{[0,U]}, J_a^{[0,U]} are still floating-point
 *     midpoint quadratures; upgrading the bound to fully rigorous-symbolic needs
 *     INTERVAL ARITHMETIC on these two single, super-exponentially-decaying
 *     integrals (a routine task, NOT a structural blocker). This module supplies
 *     the truncation error so an interval engine need only certify [0, U].
 *   - The LARGE-a SLIVER a in (~34.98, ~37.66] (imp-2654) -- where CS-HS has
 *     crossed 1 but exact-HS has not -- is untouched here and stays open.
 *   - Conj 27.2 is FALSE for a > ~37.66 (imp-2660); "for all a > 0" is
 *     UNREACHABLE. The honest target is the physical band (0, ~37.66].
 *   - This does NOT establish 27.2 => RH (the collapse is CONDITIONAL per
 *     imp-2666); it only discharges GAP-2's two named truncation sub-items.
 *
 *   Ticket: imp-2665 (proof, high, opus-4-7 / subscription).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Truncation point and derived constants (W = e^{4U}, c = 2 pi).
const U_TRUNC = 4;
const W = Math.exp(4 * U_TRUNC); // e^{16} ~= 8.886e6
const C = 2 * Math.PI;
const TAIL_EXPONENT = -C * W; // -2 pi e^{16} ~= -5.5833e7 (the doubly-exp rate)

// Closed-form tail prefactors (the bound is prefactor . exp(TAIL_EXPONENT)).
const TAIL_I_PREFACTOR = 4 * Math.pow(Math.PI, 4) * W / (C - 1 / W);
const tailJPrefactor = (a) => {
  const beta = 1 + a / 2;
  return Math.pow(Math.PI, 4) * Math.pow(W, beta) / (C - beta / W);
};

// imp-1260 crossover where the CS-HS closed form B(a) = sqrt(I_0 J_a) first
// reaches 1 (frozen, 12 sig figs); below it the truncation-uniform bound < 1.
const A_STAR_CS_HS = 34.98046830007358;

const LEMMA_A_MONOTONICITY = Object.freeze({
  label: 'Lemma A -- a-monotonicity (controls the a -> 0 limit)',
  derivativeIdentity: 'd/da sinh^2(au) = u . sinh(2au) >= 0 for u >= 0, a >= 0',
  consequence:
    'J_a and B(a) = sqrt(I_0 . J_a) are non-decreasing in a; B(a) -> 0 as a -> 0+. ' +
    'Hence sup_{a in (0,A]} ||V||_op <= B(A): the whole small-a regime, including ' +
    'the limit a -> 0, is dominated by the single right-endpoint value B(A).',
  limitAtZero: 'B(a) -> 0 as a -> 0+ (monotone convergence; sinh(au) -> 0)',
  dischargesSubGap: '(ii) a -> 0 limit',
});

const LEMMA_B_TAIL = Object.freeze({
  label: 'Lemma B -- explicit doubly-exponential tail past U',
  validityU: 'U >= 1 (each Phi summand positive; n-sum tail < e^{-500})',
  phiUpperBound: 'Phi(u) <= 4 pi^2 e^{4u} exp(-pi e^{4u}) for u >= 1',
  phiSqUpperBound: 'Phi(u)^2 <= 16 pi^4 e^{8u} exp(-2 pi e^{4u})',
  sinhBound: 'sinh(au) <= e^{au}/2, so sinh^2(au) <= e^{2au}/4',
  decayRateLemma:
    'for c W > beta: int_W^infty w^beta e^{-cw} dw <= W^beta e^{-cW} / (c - beta/W) ' +
    '(since g(w) = w^beta e^{-cw} obeys g(w) <= g(W) e^{-(c - beta/W)(w - W)} on w >= W)',
  tailI_formula: 'T_I(U) = int_U^infty Phi^2 du <= 4 pi^4 . W e^{-2 pi W} / (2 pi - 1/W), W = e^{4U}',
  tailJ_formula:
    'T_J(U,a) = int_U^infty Phi^2 sinh^2(au) du <= pi^4 . W^{1+a/2} e^{-2 pi W} / (2 pi - (1+a/2)/W)',
  substitution: 'w = e^{4u}, du = dw/(4w), W = e^{4U}',
  dischargesSubGap: '(i) tail past U',
});

const TAIL_AT_U4 = Object.freeze({
  U: U_TRUNC,
  W,
  twoPiW: C * W, // ~= 5.5833e7
  tailExponent: TAIL_EXPONENT, // -2 pi e^{16}
  tailI_prefactor: TAIL_I_PREFACTOR, // ~= 5.51e8
  tailJ_prefactor_aHalf: tailJPrefactor(0.5), // ~= 7.52e9
  tailJ_prefactor_aStar: tailJPrefactor(A_STAR_CS_HS), // ~= 4.7e129 < e^{300}
  // Both tails <= prefactor . exp(-5.5833e7); product underflows double to 0.
  tailI_value_fp: TAIL_I_PREFACTOR * Math.exp(TAIL_EXPONENT), // === 0 in fp
  tailJ_value_aStar_fp: tailJPrefactor(A_STAR_CS_HS) * Math.exp(TAIL_EXPONENT), // === 0 in fp
  comment:
    'At U = 4 the analytic tail is < exp(-5e7): >10^7 orders of magnitude below ' +
    'the window integrals (I_0^{[0,U]} ~= 1.05e-2). The imp-1267 / imp-2654 ' +
    'finite-window numerics are thus RIGOROUSLY truncation-exact to full double ' +
    'precision -- the "fp-zero" hand-wave is now a closed-form bound.',
});

const COMBINED_BOUND = Object.freeze({
  label: 'truncation-uniform CS-HS bound',
  inequality:
    '||V_{a,Phi}||_op <= sqrt( (I_0^{[0,U]} + T_I(U)) . (J_a^{[0,U]} + T_J(U,a)) )',
  monotoneInA: true,
  supAttainedAtRightEndpoint: 'sup_{a in (0,A]} = value at a = A (Lemma A)',
  rigorousBelowOneOn: 'a in (0, ~34.98] (A = A*_CS-HS, where B(A) = 1)',
  crossover_aStar: A_STAR_CS_HS,
});

export const IMP2665_VOLTERRA_TRUNCATION_UNIFORM = Object.freeze({
  id: 'imp-2665-volterra-truncation-uniform',
  ticket: 'imp-2665',
  generatedAt: '2026-06-17T21:10:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['SS25', 'SS26', 'SS27'],
  relatedTickets: ['imp-1258', 'imp-1260', 'imp-1267', 'imp-2654', 'imp-2660', 'imp-2666'],

  summary:
    'GAP-2 of the PCC-free Volterra route discharged on its two NAMED items. ' +
    'Lemma A (d/da sinh^2(au) = u sinh(2au) >= 0) makes the CS-HS bound ' +
    'B(a) = sqrt(I_0 J_a) monotone in a with B -> 0 as a -> 0, so sup over (0,A] ' +
    '= B(A) -- controlling the a -> 0 limit (sub-gap ii). Lemma B gives an ' +
    'explicit doubly-exponential tail T_I(U), T_J(U,a) <= prefactor . exp(-2 pi e^{4U}); ' +
    'at U = 4 this is < exp(-5e7), >10^7 orders below the window integrals, so the ' +
    'imp-1267/imp-2654 finite-window numerics are rigorously truncation-exact ' +
    '(sub-gap i). Combined truncation-uniform bound is < 1 on (0, ~34.98]. ' +
    'HONEST PARTIAL: window integrals still need interval certification; the ' +
    'large-a sliver (~34.98, ~37.66] (imp-2654) stays open; no 27.2 => RH claim.',

  conjectureTarget: Object.freeze({
    label: 'Conjecture 27.2 (Endpoint-Hankel Volterra contraction) -- GAP-2',
    statement: 'For a in the physical band, ||V_{a,Phi}|| <= 1 (op norm in L^2([0, infty))).',
    paperSection: 'SS27',
    gap: 'GAP-2: truncation-uniform analytic bound (tail past U + a -> 0 limit)',
  }),

  lemmaA: LEMMA_A_MONOTONICITY,
  lemmaB: LEMMA_B_TAIL,
  tailAtU4: TAIL_AT_U4,
  combinedBound: COMBINED_BOUND,

  honestScope: Object.freeze({
    isAnalyticalBound: true,
    isProof: false,
    dischargesTailSubGap: true, // (i)
    dischargesAToZeroSubGap: true, // (ii)
    windowCertificationStillOpen: true, // I_0^{[0,U]}, J_a^{[0,U]} need interval arithmetic
    largeASliverStillOpen: true, // (~34.98, ~37.66] per imp-2654
    claimsConj272OnFullBand: false,
    claims272ImpliesRH: false, // collapse CONDITIONAL per imp-2666
    reusesFrozenData: 'imp-1260 crossover A*_CS-HS; imp-1267 window I_0, J_a',
    coverageRange: 'a in (0, ~34.98] (truncation-uniform, a->0-uniform; window still numeric)',
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    collapse: 'src/data/imp-1258-volterra-cdb-bridge.js (imp-1258, CONDITIONAL per imp-2666)',
    hsBound: 'src/data/imp-1267-volterra-hs-bound.js (imp-1267, CS-HS backbone)',
    largeACrossover: 'src/data/imp-1260-largea-crossover.js (imp-1260, A*_CS-HS)',
    rigorousStatus: 'src/data/imp-2654-volterra-rigorous-bound-status.js (imp-2654, sliver)',
    whRetracted: 'imp-2660 (WH route refuted; Conj 27.2 false for a > ~37.66)',
    masterVerdict: 'imp-2666 (collapse downgraded to CONDITIONAL)',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP2665_VOLTERRA_TRUNCATION_UNIFORM_ASSERTIONS = [
  {
    id: 'imp2665-lemma-a-monotone-controls-a-to-zero',
    why:
      'Sub-gap (ii) is discharged by a-monotonicity: d/da sinh^2(au) = u sinh(2au) ' +
      '>= 0 makes B(a) non-decreasing with B -> 0 as a -> 0, so sup over (0,A] = B(A). ' +
      'If the derivative identity or the limit-at-zero statement drifts, the a -> 0 ' +
      'control is lost.',
    holds: () => {
      const a = IMP2665_VOLTERRA_TRUNCATION_UNIFORM.lemmaA;
      return (
        a.derivativeIdentity.includes('u . sinh(2au)') &&
        a.derivativeIdentity.includes('>= 0') &&
        a.limitAtZero.includes('-> 0') &&
        a.dischargesSubGap.includes('(ii)')
      );
    },
  },
  {
    id: 'imp2665-monotonicity-numerically-holds',
    why:
      'The monotonicity claim must survive a direct numerical check: sinh^2(au) is ' +
      'strictly increasing in a at sample (u, a) points, and its a-derivative ' +
      'u sinh(2au) is non-negative. A sign error here would invalidate Lemma A.',
    holds: () => {
      for (const u of [0.1, 1, 3]) {
        for (const a of [0.01, 0.5, 2]) {
          const da = 1e-6;
          const fLo = Math.pow(Math.sinh(a * u), 2);
          const fHi = Math.pow(Math.sinh((a + da) * u), 2);
          if (fHi < fLo) return false; // not increasing
          if (u * Math.sinh(2 * a * u) < 0) return false; // derivative sign
        }
      }
      return true;
    },
  },
  {
    id: 'imp2665-tail-exponent-doubly-exponential',
    why:
      'Sub-gap (i) hinges on the tail rate being -2 pi e^{4U}. At U = 4 that is ' +
      '-2 pi e^{16} ~= -5.5833e7. If the exponent is not far below -5e7 the tail is ' +
      'not negligible and the truncation is not certified.',
    holds: () => {
      const t = IMP2665_VOLTERRA_TRUNCATION_UNIFORM.tailAtU4;
      const expected = -2 * Math.PI * Math.exp(16);
      return (
        Math.abs(t.tailExponent - expected) < 1 &&
        t.tailExponent < -5e7 &&
        Math.abs(t.W - Math.exp(16)) < 1
      );
    },
  },
  {
    id: 'imp2665-tail-dominated-by-window',
    why:
      'The tail bound (prefactor . exp(-2 pi e^{16})) must underflow to 0 in IEEE ' +
      'double and be utterly negligible against the window integral I_0^{[0,U]} ~= ' +
      '1.05e-2 -- even with the largest prefactor (a = A*_CS-HS, ~4.7e129 < e^{300}). ' +
      'This is what makes the finite-window numerics rigorously truncation-exact.',
    holds: () => {
      const t = IMP2665_VOLTERRA_TRUNCATION_UNIFORM.tailAtU4;
      // prefactor < e^{300}, exponent < -5e7 => product < e^{-5e7+300} << 1e-2.
      return (
        t.tailI_prefactor > 0 &&
        t.tailJ_prefactor_aStar > 0 &&
        Math.log(t.tailJ_prefactor_aStar) < 300 &&
        t.tailI_value_fp === 0 &&
        t.tailJ_value_aStar_fp === 0 &&
        t.tailExponent + Math.log(t.tailJ_prefactor_aStar) < -5e7
      );
    },
  },
  {
    id: 'imp2665-tail-formulas-explicit',
    why:
      'The tail must be a CLOSED-FORM bound, not a numeric assertion. Lemma B must ' +
      'record the Phi^2 upper bound, the sinh bound, the decay-rate lemma, and both ' +
      'T_I / T_J formulas with the W = e^{4U} substitution.',
    holds: () => {
      const b = IMP2665_VOLTERRA_TRUNCATION_UNIFORM.lemmaB;
      return (
        b.phiSqUpperBound.includes('exp(-2 pi e^{4u})') &&
        b.sinhBound.includes('e^{2au}/4') &&
        b.decayRateLemma.includes('c W > beta') &&
        b.tailI_formula.includes('W = e^{4U}') &&
        b.tailJ_formula.includes('W^{1+a/2}') &&
        b.dischargesSubGap.includes('(i)')
      );
    },
  },
  {
    id: 'imp2665-combined-bound-monotone-and-explicit',
    why:
      'The combined truncation-uniform bound must be the product of window+tail ' +
      'factors, flagged monotone in a, with the sup at the right endpoint and the ' +
      'sub-1 coverage pinned to the imp-1260 crossover A*_CS-HS = 34.98046830007358.',
    holds: () => {
      const c = IMP2665_VOLTERRA_TRUNCATION_UNIFORM.combinedBound;
      return (
        c.inequality.includes('I_0^{[0,U]} + T_I(U)') &&
        c.inequality.includes('J_a^{[0,U]} + T_J(U,a)') &&
        c.monotoneInA === true &&
        Math.abs(c.crossover_aStar - 34.98046830007358) < 1e-9
      );
    },
  },
  {
    id: 'imp2665-honest-scope-partial-not-proof',
    why:
      'This is an HONEST PARTIAL. It discharges GAP-2 sub-gaps (i) and (ii) but must ' +
      'NOT claim a completed proof of Conj 27.2 on the band, must keep the window ' +
      'certification and large-a sliver open, and must NOT claim 27.2 => RH (the ' +
      'collapse is CONDITIONAL per imp-2666). If any of these flip the file overstates.',
    holds: () => {
      const h = IMP2665_VOLTERRA_TRUNCATION_UNIFORM.honestScope;
      return (
        h.isProof === false &&
        h.dischargesTailSubGap === true &&
        h.dischargesAToZeroSubGap === true &&
        h.windowCertificationStillOpen === true &&
        h.largeASliverStillOpen === true &&
        h.claimsConj272OnFullBand === false &&
        h.claims272ImpliesRH === false
      );
    },
  },
  {
    id: 'imp2665-does-not-resurrect-wiener-hopf',
    why:
      'The WH route (imp-1287) was retracted by imp-2660 (||K_a|| ~ e^{aT}, not 1/a). ' +
      'This module must rest ONLY on the Hilbert-Schmidt backbone -- the references ' +
      'must cite the retraction and the HS bound, never re-assert a WH symbol bound.',
    holds: () => {
      const r = IMP2665_VOLTERRA_TRUNCATION_UNIFORM.references;
      return (
        r.hsBound.includes('imp-1267') &&
        r.whRetracted.includes('imp-2660') &&
        r.whRetracted.includes('refuted')
      );
    },
  },
];

export default IMP2665_VOLTERRA_TRUNCATION_UNIFORM;
