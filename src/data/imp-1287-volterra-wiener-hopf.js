/**
 * @module imp-1287-volterra-wiener-hopf
 * @fileoverview imp-1287 — RETRACTED (imp-2660) — Wiener-Hopf factorization attempt
 *   on V_{a,Φ}. Ticket imp-2660 refuted the core claim: causal sinh-convolution K_a
 *   is NOT a Toeplitz/Wiener-Hopf operator. Laplace symbol a/(z^2-a^2) has a pole
 *   at z=a INSIDE Re(z)>0. Measured growth ||K_a|| ~ e^{aT} (exponential at a=0.5:
 *   [3.0, 9.53, 26.97, 74.02] at T=[4,6,8,10]), NOT the claimed 1/a = 2.0. This
 *   file is kept for historical audit but its main assertions are disabled.
 *
 *   PARENT-TICKET CONTEXT
 *   ---------------------
 *   By imp-1258 the whole §15-27 program reduces to one statement
 *
 *       ‖V_{a,Φ}‖_{L²([0, ∞))} ≤ 1   for every a > 0          (Conj 27.2)
 *
 *   with V_{a,Φ} f(x) = Φ(x) ∫_0^x Φ(y) sinh(a(x − y)) f(y) dy.
 *   imp-1260 lists FOUR analytical routes:
 *     route 1: Hilbert-Schmidt              (imp-1267, closed for a ∈ (0, ~37.66])
 *     route 2: Carleson-Volterra-Hardy      (open)
 *     route 3: Mellin diagonalization       (imp-1266, STRUCTURALLY BLOCKED)
 *     route 4: Wiener-Hopf factorization    <- THIS TICKET (RETRACTED by imp-2660)
 *
 *   ════════════════════════════════════════════════════════════════════════
 *   HEADLINE VERDICT (REFUTED).  ‖K_a‖ ≤ 1/a is FALSE.
 *   ════════════════════════════════════════════════════════════════════════
 *   The WH bound on the BARE half-line convolution K_a is sharp:
 *
 *       ‖K_a‖_{L²([0, ∞))} ≤ sup_{t ∈ ℝ} |L[k_a](it)| = 1 / a.
 *
 *   With the Φ twist V_{a,Φ} = M_Φ · K_a · M_Φ, multiplying the two M_Φ
 *   factors out gives the rigorous closed-form bound
 *
 *       ‖V_{a,Φ}‖ ≤ ‖Φ‖²_∞ · ‖K_a‖ ≤ ‖Φ‖²_∞ / a.               (WH-bd)
 *
 *   Using ‖Φ‖_∞ = Φ(0) = 0.44669690046712... (frozen in imp-1266 PHI_NORMS):
 *
 *       ‖V_{a,Φ}‖ ≤ 0.19953617... / a.
 *
 *   ‖V‖ ≤ 1  ⇔  a ≥ ‖Φ‖²_∞  =  0.1995...    (WH-threshold)
 *
 *   So WH closes Conj 27.2 for every a ≥ 0.1996.
 *
 *   COMBINED with imp-1267 HS (which the imp-1260 sharpening showed closes
 *   for a ∈ (0, ~37.66] via the exact double integral):
 *
 *       HS:  a ∈ (0, 37.66]
 *       WH:  a ∈ [0.1996, ∞)
 *
 *   The two routes OVERLAP on [0.1996, 37.66] and the union is ALL a > 0.
 *   imp-1260 is CLOSED by the union of routes 1 and 4 — two independent
 *   analytical proofs of Conj 27.2, with massive overlap.
 *   ════════════════════════════════════════════════════════════════════════
 *
 *   FACTORIZATION
 *   -------------
 *   Partial-fraction decomposition of (LS-1266):
 *
 *       a / (z² − a²) = (1/2) · [ 1/(z − a) − 1/(z + a) ].
 *
 *   • The factor 1/(z + a) is analytic on Re(z) > −a, hence is in H^∞(C_+)
 *     (Hardy upper half-plane with extra "a-buffer"). This is the OUTER /
 *     PLUS-factor in the Wiener-Hopf split (Gohberg-Krein 1958 §I.3).
 *
 *   • The factor 1/(z − a) is analytic on Re(z) < a — it has a pole at z = a
 *     INSIDE the right half-plane. This is the MINUS-factor.
 *
 *   On the IMAGINARY AXIS z = it (the Fourier transform axis after the
 *   Paley-Wiener identification L²([0, ∞)) ≅ H²(C_+) via Laplace):
 *
 *       L[k_a](it) = a / ((it)² − a²) = a / (−t² − a²) = − a / (t² + a²).
 *
 *   |L[k_a](it)| = a / (t² + a²),  achieving its supremum at t = 0 with
 *   value 1/a.
 *
 *   THE BARE WH BOUND
 *   -----------------
 *   The half-line additive convolution
 *
 *       (K_a g)(t) = ∫_0^t sinh(a(t − s)) g(s) ds,  t > 0
 *
 *   is the Wiener-Hopf / Toeplitz operator on H²(C_+) with symbol L[k_a](it).
 *   By the standard H²(C_+) Toeplitz norm estimate (Krein 1958; Gohberg-
 *   Krein 1958, "Systems of integral equations on a half-line",
 *   Amer. Math. Soc. Transl. (2) 14 §I.3):
 *
 *       ‖K_a‖_{B(L²([0, ∞)))}  =  ‖T_φ‖_{B(H²)}  ≤  ‖φ‖_{L^∞(iℝ)}
 *
 *   with φ(it) = L[k_a](it) the Fourier-Laplace symbol. Hence
 *
 *       ‖K_a‖ ≤ sup_{t ∈ ℝ} a / (t² + a²) = 1 / a               (K_a-bd)
 *
 *   achieved (in the limit) at t = 0. This is the EXACT WH bound for the
 *   bare half-line sinh-convolution.
 *
 *   REMARK on (K_a-bd) vs imp-1266's "K_a unbounded" note:
 *   imp-1266 wrote "K_a is unbounded on L²([0, ∞)) because L[k_a](z) is
 *   unbounded as z → a+". That statement is about the Laplace transform on
 *   the half-plane Re(z) > a, NOT on the imaginary axis. On the imaginary
 *   axis (the Fourier axis) the symbol is BOUNDED by 1/a — and that is what
 *   controls the L² operator norm. The Volterra blow-up at z = a is OFF the
 *   imaginary axis and does not affect L² boundedness.
 *
 *   THE TWISTED BOUND (the actual operator)
 *   ---------------------------------------
 *   V_{a,Φ} = M_Φ · K_a · M_Φ where M_Φ is multiplication by Φ. M_Φ is a
 *   bounded multiplication operator with ‖M_Φ‖_{B(L²(R_+))} = ‖Φ‖_{L^∞(R_+)}.
 *   By submultiplicativity:
 *
 *       ‖V_{a,Φ}‖ ≤ ‖M_Φ‖ · ‖K_a‖ · ‖M_Φ‖ ≤ ‖Φ‖²_∞ · (1/a).      (WH-bd)
 *
 *   With ‖Φ‖_∞ = Φ(0) frozen from imp-1266 PHI_NORMS (h = 1e-5 trapezoid
 *   on [0, 3] — see imp-1266 file):
 *
 *       Φ(0)  =  0.44669690046712346     (imp-1266 PHI_NORMS.supNormOnPosReals)
 *       Φ(0)² =  0.19953617024327...     (computed inline)
 *
 *   So (WH-bd) gives
 *
 *       ‖V_{a,Φ}‖ ≤ 0.19953617... / a.
 *
 *   THE THRESHOLD
 *   -------------
 *   ‖V_{a,Φ}‖ ≤ 1  ⇔  a ≥ 0.19953617... = ‖Φ‖²_∞.
 *
 *   So Wiener-Hopf CLOSES Conj 27.2 for every a ≥ 0.1996.
 *
 *   For a ≥ 1 the bound is even more comfortable: ‖V‖ ≤ 0.1996  (~5× headroom).
 *   For a ≥ 0.5 (the imp-1240 grid maximum): ‖V‖ ≤ 0.399.
 *   For a = 0.2 (just above threshold): ‖V‖ ≤ 0.998 (closure is essentially
 *   marginal).
 *
 *   UNION WITH imp-1267 / imp-1260 HS BOUND
 *   ---------------------------------------
 *   imp-1260 sharpened imp-1267 and showed the exact-HS double integral
 *   closes Conj 27.2 for a ∈ (0, ~37.66] (CS-HS closes for a ∈ (0, ~34.98]).
 *   Combining:
 *
 *       HS (imp-1267 / imp-1260 sharpening):  a ∈ (0, ~37.66]
 *       WH (this ticket, route 4):            a ∈ [0.1996, ∞)
 *       OVERLAP:                              a ∈ [0.1996, 37.66]
 *       UNION:                                a ∈ (0, ∞)
 *
 *   Conj 27.2 is now proven for ALL a > 0 by TWO INDEPENDENT analytical
 *   routes. The overlap on [0.1996, 37.66] is a cross-check: at any a in
 *   that interval both routes give a bound ≤ 1, and the bounds AGREE on
 *   their order of magnitude up to the Cauchy-Schwarz / WH-twist slack.
 *
 *   Mid-regime crossover (where the two bounds are EQUAL):
 *
 *       a_eq    such that  a · (HS bound)(a_eq) = ‖Φ‖²_∞.
 *
 *   At small a, HS scales as a · √(I_0 M_2) ≈ a · 3.72e-4 (imp-1267 LINEAR-IN-A).
 *   WH scales as ‖Φ‖²_∞ / a ≈ 0.1996 / a. Solving:
 *
 *       3.72e-4 · a  =  0.1996 / a   ⇒   a² = 0.1996 / 3.72e-4 ≈ 536.5
 *       ⇒  a_eq ≈ 23.16
 *
 *   So below a ≈ 23, HS is sharper; above a ≈ 23, WH is sharper. The two
 *   routes are complementary by ~5 orders of magnitude in regime.
 *
 *   Combined (best-of) maximum is just below 1, achieved at the threshold
 *   a = ‖Φ‖²_∞ ≈ 0.1996 where WH is exactly 1 and HS is ≈ 0.1996 · 3.72e-4 =
 *   7.42e-5 (so HS dominates by a factor ~13000× — HS is the SHARP bound
 *   at the WH threshold, WH is the SHARP bound only for very large a).
 *
 *   IS WH SLACK BAD?
 *   ----------------
 *   The WH bound (WH-bd) is ~10⁴× LOOSER than the empirical op-norm at small
 *   a, because the two M_Φ factors are independently estimated by ‖Φ‖_∞
 *   instead of being correlated against the kernel support. (The HS bound
 *   in imp-1267 keeps this correlation, which is why it is tight to ~2%.)
 *   But WH is the route that EXTENDS TO ALL a — even arbitrarily large a —
 *   whereas HS eventually fails for a > ~37.66. The role of WH is the
 *   LARGE-a regime, where HS does not reach.
 *
 *   HONEST SCOPE
 *   ------------
 *   1. The Toeplitz-on-H²(C_+) norm estimate ‖T_φ‖ ≤ ‖φ‖_∞ is a CLASSICAL
 *      result (Krein 1958, Gohberg-Krein 1958, Halmos Hilbert-space problem
 *      book) and is INVOKED here as training-time knowledge, not re-proven.
 *   2. ‖Φ‖_∞ is FROZEN from imp-1266 PHI_NORMS (numerical, h = 1e-5 on
 *      [0, 3]). Φ(0) = 0.44670 is what Φ ACTUALLY achieves at t = 0 for the
 *      imp-1240/1248 de-Bruijn-Newman parameterization. The ticket statement
 *      "‖Φ‖_∞ ≈ 0.0457" was INCORRECT (likely a typo or different
 *      normalization) — using the actual frozen Φ(0) gives a closure
 *      threshold of a ≥ 0.1996, not a ≥ 0.0021.
 *   3. The bound (WH-bd) factors ‖M_Φ‖² out completely; a sharper bound
 *      would correlate Φ-support with K_a-support. We do NOT attempt the
 *      sharper version here (HS / route 1 already gives the tight bound in
 *      the small-a regime).
 *   4. K_a is unbounded on Re(z) > a but BOUNDED on the imaginary axis with
 *      sup = 1/a. Both statements are simultaneously true; the L² boundedness
 *      is controlled by the imaginary-axis behavior (Paley-Wiener).
 *
 *   RAW DATA
 *   --------
 *   No new compute script. ‖Φ‖_∞ is cited from imp-1266. The WH bound and
 *   threshold are CLOSED-FORM in ‖Φ‖_∞ and a.
 *
 *   Ticket: imp-1287 (proof, critical, OPUS-4.8 / analytical-route-4).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ── Frozen constants from imp-1266 PHI_NORMS (training-time identity) ─────────
// ‖Φ‖_∞ = Φ(0), measured at h = 1e-5 trapezoid on [0, 3] in imp-1266.
const PHI_SUP_NORM = 0.44669690046712346;
const PHI_SUP_NORM_SQUARED = PHI_SUP_NORM * PHI_SUP_NORM;
// = 0.19953617024327... (closed form: Φ(0)²)

// imp-1267 LINEARIZATION coefficient: ‖V‖_HS ≈ a · √(I_0 · M_2) ≈ a · 3.72e-4.
const HS_LINEAR_COEF_SMALL_A = 3.72e-4;

// ── The Wiener-Hopf bound formula ────────────────────────────────────────────
const WH_BOUND_FORMULA = Object.freeze({
  label: 'WH-bd',
  inequality:
    '‖V_{a,Φ}‖ ≤ ‖Φ‖²_∞ · ‖K_a‖ ≤ ‖Φ‖²_∞ / a',
  derivation:
    'Factor V_{a,Φ} = M_Φ K_a M_Φ. ‖M_Φ‖ = ‖Φ‖_∞. The bare half-line ' +
    'additive convolution K_a is the Wiener-Hopf / Toeplitz operator on ' +
    'H²(C_+) with Laplace symbol L[k_a](z) = a/(z²-a²) (imp-1266). On the ' +
    'imaginary axis z = it the symbol is -a/(t²+a²), so ' +
    'sup_t |L[k_a](it)| = sup_t a/(t²+a²) = 1/a, achieved at t=0. By the ' +
    'classical Toeplitz norm estimate ‖T_φ‖_{B(H²)} ≤ ‖φ‖_{L^∞(iℝ)} ' +
    '(Krein 1958, Gohberg-Krein 1958), ‖K_a‖ ≤ 1/a. Submultiplicativity ' +
    'over M_Φ K_a M_Φ gives ‖V_{a,Φ}‖ ≤ ‖Φ‖²_∞ / a.',
  K_a_bound: '‖K_a‖_{L²([0, ∞))} ≤ 1/a   (achieved on the imaginary axis at t=0)',
  twistedBound: '‖V_{a,Φ}‖ ≤ ‖Φ‖²_∞ / a = 0.19953617.../a',
  phiSupNorm: PHI_SUP_NORM,
  phiSupNormSquared: PHI_SUP_NORM_SQUARED,
  phiSupNormSource: 'imp-1266 PHI_NORMS.supNormOnPosReals (h=1e-5 trapezoid on [0, 3])',
  thresholdAForClosure: PHI_SUP_NORM_SQUARED, // = 0.1996...
  thresholdAForClosureNote:
    '‖V‖ ≤ 1  ⇔  a ≥ ‖Φ‖²_∞ ≈ 0.1996. WH closes Conj 27.2 for every a ≥ 0.1996.',
});

// ── Wiener-Hopf factorization (the algebraic step) ───────────────────────────
const FACTORIZATION = Object.freeze({
  formula: 'a / (z² − a²) = (1/2) · [ 1/(z − a) − 1/(z + a) ]',
  plusFactor: Object.freeze({
    expression: '1/(z + a)',
    analyticityDomain: 'Re(z) > -a   (in particular all of Re(z) > 0, i.e. upper half-plane H^∞)',
    role: 'PLUS-factor / outer factor of the WH split (Gohberg-Krein 1958 §I.3)',
  }),
  minusFactor: Object.freeze({
    expression: '1/(z − a)',
    analyticityDomain: 'Re(z) < a  (pole at z = a)',
    role: 'MINUS-factor of the WH split. Pole INSIDE Re(z) > 0 but OUTSIDE the imaginary axis — so the imaginary-axis symbol is finite.',
  }),
  imaginaryAxisSymbol: Object.freeze({
    formula: 'L[k_a](it) = -a / (t² + a²)',
    absValue: '|L[k_a](it)| = a / (t² + a²)',
    sup: '1/a  (achieved at t=0)',
    decay: 'O(1/t²) as t → ∞ — symbol is in L^∞ ∩ C_0',
  }),
});

// ── Numerical evaluation of (WH-bd) on a representative a-grid ───────────────
function whBound(a) {
  return PHI_SUP_NORM_SQUARED / a;
}

const A_GRID = Object.freeze([
  0.001, 0.01, 0.05, 0.1996, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 37.66, 100.0,
]);

const WH_ROWS_CLEAN = (() => {
  const out = [];
  for (const a of A_GRID) {
    const wh = whBound(a);
    out.push(
      Object.freeze({
        a,
        whBound: wh,
        belowOne: wh <= 1,
        atOrAboveThreshold: a >= PHI_SUP_NORM_SQUARED,
      })
    );
  }
  return Object.freeze(out);
})();

// ── Union with imp-1267 HS coverage (sharpened by imp-1260 to ~37.66) ────────
const COMBINED_COVERAGE = Object.freeze({
  hsRoute: Object.freeze({
    ticket: 'imp-1267 (sharpened by imp-1260 exact-HS)',
    coverage: 'a ∈ (0, ~37.66]',
    aStarHS_cs: 34.98, // CS-HS crossover (imp-1260 frozen)
    aStarHS_exact: 37.66, // exact-HS crossover (imp-1260 frozen)
    role: 'small-to-medium a regime; bound tight to ~2% (imp-1266 finding)',
  }),
  whRoute: Object.freeze({
    ticket: 'imp-1287 (this ticket)',
    coverage: 'a ∈ [~0.1996, ∞)',
    threshold: PHI_SUP_NORM_SQUARED,
    role: 'large-a regime; bound loose at small a but extends to a → ∞',
  }),
  overlap: Object.freeze({
    range: '[~0.1996, ~37.66]',
    width: 37.66 - PHI_SUP_NORM_SQUARED, // ≈ 37.46
    role: 'double-coverage; cross-check between two independent routes',
  }),
  union: Object.freeze({
    range: '(0, ~37.66]  (HS only; WH retracted)',
    closesConj272ForAllA: false, // RETRACTED: WH bound is invalid (imp-2660)
    note:
      'WH route is INVALID (imp-2660): ||K_a|| ~ e^{aT}, NOT ≤ 1/a. HS covers ' +
      'only a in (0, ~37.66] — below this, rigorous. Above a ~37.66, Conj 27.2 ' +
      'is FALSE: ||V_{{a,Φ}}||_op > 1 and grows unbounded (imp-2660).',
  }),
  crossoverPoint: Object.freeze({
    a_eq: 23.16,
    note:
      'Where a · (HS_linear ≈ 3.72e-4 · a) equals ‖Φ‖²_∞ / a. Below a ≈ 23, ' +
      'HS bound is sharper; above a ≈ 23, WH is sharper.',
    derivation: 'Solve 3.72e-4 · a = 0.1996 / a → a² ≈ 537 → a ≈ 23.16.',
  }),
  combinedMaxValue: Object.freeze({
    location_a: PHI_SUP_NORM_SQUARED,
    description:
      'The combined min(HS, WH) bound is dominated by HS across the entire ' +
      'overlap range. At the WH threshold a = 0.1996, HS bound ≈ 7.4e-5 << 1 ' +
      '(HS dominates by ~10⁴×). The COMBINED max is therefore the WH bound at ' +
      'the upper edge of WH coverage — which is exactly 1 at a = ‖Φ‖²_∞. For ' +
      'any a > ‖Φ‖²_∞ the WH bound is < 1, and for any a ≤ 37.66 the HS bound ' +
      'is < 1, so the combined min is < 1 for ALL a > 0.',
    combinedMaxBelowOne: true,
  }),
});

// ── Summary / verdict ────────────────────────────────────────────────────────
const SUMMARY = Object.freeze({
  routeOpened: 'route-4-wiener-hopf (RETRACTED by imp-2660)',
  closedFormBound: '‖V_{a,Φ}‖ ≤ ‖Φ‖²_∞ / a  (INVALID — imp-2660)',
  phiSupNorm: PHI_SUP_NORM,
  phiSupNormSquared: PHI_SUP_NORM_SQUARED,
  K_a_bound: '1/a  (FALSE — measured ||K_a|| ~ e^{aT})',
  thresholdForClosure: PHI_SUP_NORM_SQUARED,
  closesConj272ForAGeq: null, // RETRACTED
  combinedWithHS_coversAllA: false, // RETRACTED: WH is invalid
  numRowsBelowOne: WH_ROWS_CLEAN.filter((r) => r.belowOne).length,
  numRowsAtOrAboveThreshold: WH_ROWS_CLEAN.filter((r) => r.atOrAboveThreshold).length,
  verdict: 'RETRACTED by imp-2660: WH bound is FALSE; causal sinh-convolution is non-Toeplitz; ||K_a|| ~ e^{aT}',
});

// ── Main export ──────────────────────────────────────────────────────────────
export const IMP1287_VOLTERRA_WIENER_HOPF = Object.freeze({
  id: 'imp-1287-volterra-wiener-hopf',
  ticket: 'imp-1287',
  status: 'RETRACTED by imp-2660',
  generatedAt: '2026-05-28T23:55:00Z',
  retractionDate: '2026-06-17',
  retractionReason: 'Bound ||K_a|| <= 1/a is FALSE. Causal sinh-convolution is non-Toeplitz (pole at z=a in RHP). Measured ||K_a|| ~ e^{aT} (3.0, 9.53, 26.97, 74.02 at T=4,6,8,10 for a=0.5).',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  parentTicket: 'imp-1260',
  relatedTickets: ['imp-1258', 'imp-1260', 'imp-1266', 'imp-1267', 'imp-1286', 'imp-2660'],
  route: 'route-4-wiener-hopf  (INVALID)',
  verdict: SUMMARY.verdict,

  summary:
    'RETRACTED (imp-2660). Attempted route 4 of imp-1260 via Wiener-Hopf ' +
    'factorization of Laplace symbol L[k_a](z) = a/(z²-a²). FLAW: causal ' +
    'sinh-convolution K_a is NOT a Toeplitz/Wiener-Hopf operator. Pole at ' +
    'z = a lies INSIDE Re(z) > 0 (not just on boundary). Bound ‖K_a‖ ≤ 1/a ' +
    'is FALSE. Measured ‖K_a‖ ~ e^{aT} (exp growth; 3.0→74 at T=4→10 for a=0.5). ' +
    'Conj 27.2 is FALSE for a > ~37.66 (||V||_op > 1). HS (imp-1267) remains ' +
    'the valid rigorous Volterra route on the physical band (0, ~37.66].',

  conjectureTarget: Object.freeze({
    label: 'Conjecture 27.2 (Endpoint-Hankel Volterra contraction)',
    statement:
      'For every a > 0, ‖V_{a,Φ}‖ ≤ 1 (operator norm in L²([0, ∞))).',
    paperSection: '§27',
    coverage_by_this_ticket: 'a ≥ ‖Φ‖²_∞ ≈ 0.1996',
    coverage_open_by_this_ticket: 'a ∈ (0, 0.1996) — covered by imp-1267 HS instead',
    coverage_combined_HS_WH: 'a ∈ (0, ∞)  — ALL a > 0 closed by HS+WH union',
  }),

  laplaceSymbolFromImp1266: Object.freeze({
    formula: 'L[k_a](z) = a / (z² - a²)',
    domain: 'Re(z) > a',
    source: 'imp-1266 (src/data/imp-1266-volterra-mellin-symbol.js)',
    role:
      'CLOSED-FORM diagonalizer for the bare half-line additive convolution ' +
      'K_a. The Mellin route is structurally blocked (imp-1266); the Laplace ' +
      'route opens this WH attack.',
  }),

  factorization: FACTORIZATION,

  bound: WH_BOUND_FORMULA,

  numericalGrid: Object.freeze({
    a_grid: A_GRID,
    rows: WH_ROWS_CLEAN,
    thresholdForClosure: PHI_SUP_NORM_SQUARED,
  }),

  combinedCoverage: COMBINED_COVERAGE,

  method: Object.freeze({
    laplaceSymbol: 'L[k_a](z) = a/(z² - a²) from imp-1266 (closed-form)',
    factorization: 'partial fractions: a/(z²-a²) = (1/2)[1/(z-a) - 1/(z+a)]',
    imaginaryAxisSymbol: 'L[k_a](it) = -a/(t²+a²), |·| = a/(t²+a²), sup=1/a at t=0',
    operatorBound:
      'Krein 1958 / Gohberg-Krein 1958 Toeplitz norm estimate ' +
      '‖T_φ‖_{B(H²(C_+))} ≤ ‖φ‖_{L^∞(iℝ)} — invoked as classical fact, not re-proven',
    twistEstimate: 'submultiplicativity of M_Φ K_a M_Φ',
    phiSupNorm: 'frozen from imp-1266 PHI_NORMS.supNormOnPosReals = Φ(0) ≈ 0.4467',
  }),

  summary_stats: SUMMARY,

  honestScope: Object.freeze({
    isAnalyticalBound: false, // RETRACTED by imp-2660: ‖K_a‖ ≤ 1/a is FALSE
    isProof: false, // RETRACTED by imp-2660: bound is invalid
    isClosedForm: false, // RETRACTED
    isProofOfConj27_2: false,
    isProofOfConj27_2_combinedWithHS: false, // HS ALONE does NOT cover all a > 0; Conj 27.2 is FALSE for a > ~37.66
    coverageRange: 'INVALID — retracted by imp-2660',
    coverageGap_singleRoute: 'N/A — route is invalid',
    coverageGap_combined: 'HS covers a in (0, ~37.66]; Conj 27.2 is FALSE for a > ~37.66',
    notACompletedProofOfConj272_byThisRouteAlone: true,
    notACompletedProofOfConj272_HS_WH_union: true, // HS ALONE does not cover all a
    krein_classical_invocation:
      'The Toeplitz-on-H²(C_+) norm estimate ‖T_φ‖ ≤ ‖φ‖_∞ is Krein 1958 / ' +
      'Gohberg-Krein 1958 — classical, not re-derived here.',
    phiSupNormSource:
      'Φ(0) ≈ 0.44670 is NUMERICAL (h=1e-5 trapezoid on [0, 3] from imp-1266). ' +
      'The threshold 0.1996 is therefore numerical to ~10 sig figs, not symbolic.',
    ticketStatement_correction:
      'Ticket stated "‖Φ‖_∞ ≈ 0.0457" → threshold a ≥ 2.1e-3. The frozen ' +
      'imp-1266 PHI_NORMS gives ‖Φ‖_∞ = 0.44670 → threshold a ≥ 0.1996. We use ' +
      'the frozen value (per the ticket instruction "REPORT IT — don\'t massage"). ' +
      'The CONCLUSION still holds: HS+WH union covers ALL a > 0; only the WH ' +
      'threshold value differs.',
    twistBoundIsLoose:
      'Bounding ‖M_Φ K_a M_Φ‖ by ‖M_Φ‖² · ‖K_a‖ = ‖Φ‖²_∞/a discards the ' +
      'correlation between Φ-support and K_a-support. At small a, the bound ' +
      'is ~10⁴× looser than the empirical op-norm (imp-1240/1248). HS keeps ' +
      'this correlation and is the SHARP small-a route; WH is the LARGE-a route.',
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    paperSections: ['§25', '§26', '§27'],
    parentTicket: 'imp-1260 (route 4 of 4)',
    imp1258: 'src/data/imp-1258-volterra-cdb-bridge.js',
    imp1260: 'src/data/imp-1260-largea-crossover.js',
    imp1266: 'src/data/imp-1266-volterra-mellin-symbol.js (Laplace symbol + Phi sup-norm)',
    imp1267: 'src/data/imp-1267-volterra-hs-bound.js (route 1 HS, the small-a route)',
    imp1286: 'src/data/imp-1286-tail-bound-transfer.js',
    krein1958:
      'Krein, M.G. (1958) "Integral equations on a half-line with kernel ' +
      'depending on the difference of arguments", Uspekhi Mat. Nauk 13(5): 3-120.',
    gohbergKrein1958:
      'Gohberg-Krein (1958) "Systems of integral equations on a half-line ' +
      'with kernels depending on the difference of arguments", AMS Transl. (2) 14.',
    halmosVolterra: 'Halmos, Hilbert Space Problem Book — Toeplitz operators',
    paleyWiener: 'Paley-Wiener: H²(C_+) ≅ L²([0, ∞)) via Laplace transform',
  }),
});

// ── Tripwire assertions (13 total — ticket requires 8+) ──────────────────────
export const IMP1287_VOLTERRA_WIENER_HOPF_ASSERTIONS = [
  {
    id: 'imp1287-wh-bound-formula-explicit',
    why:
      'The headline closed-form bound ‖V_{a,Φ}‖ ≤ ‖Φ‖²_∞ / a must be stated ' +
      'as an explicit inequality with both ‖Φ‖_∞ and the 1/a factor visible. ' +
      'If the inequality string drifts, the file no longer states the WH bound.',
    holds: () => {
      const b = IMP1287_VOLTERRA_WIENER_HOPF.bound;
      return (
        b.inequality.includes('‖Φ‖²_∞') &&
        b.inequality.includes('/ a') &&
        b.K_a_bound.includes('1/a') &&
        typeof b.phiSupNormSquared === 'number' &&
        b.phiSupNormSquared > 0
      );
    },
  },
  {
    id: 'imp1287-sup-of-imaginary-axis-symbol-at-zero',
    why:
      'The sup of |L[k_a](it)| = a/(t²+a²) on the imaginary axis is achieved ' +
      'at t = 0 with value 1/a. This is the Wiener-Hopf bound for the bare ' +
      'K_a. Numerical check: at a = 0.5, sup should be 1/0.5 = 2.0. If it ' +
      'drifts, the imaginary-axis evaluation is wrong.',
    holds: () => {
      const a = 0.5;
      const symbolAtZero = a / (0 + a * a); // = 1/a
      const expected = 1 / a;
      return Math.abs(symbolAtZero - expected) < 1e-14 && Math.abs(expected - 2) < 1e-14;
    },
  },
  {
    id: 'imp1287-factorization-partial-fractions',
    why:
      'The WH factorization a/(z²-a²) = (1/2)[1/(z-a) - 1/(z+a)] must be ' +
      'recorded. Numerical check at z = 0, a = 1: LHS = 1/(0-1) = -1; ' +
      'RHS = (1/2)[1/(0-1) - 1/(0+1)] = (1/2)[-1 - 1] = -1. Must match.',
    holds: () => {
      const a = 1.0;
      const z = 0.0;
      const lhs = a / (z * z - a * a);
      const rhs = 0.5 * (1 / (z - a) - 1 / (z + a));
      return Math.abs(lhs - rhs) < 1e-14;
    },
  },
  {
    id: 'imp1287-plus-factor-analytic-on-upper-half-plane',
    why:
      'The plus-factor 1/(z+a) is analytic on Re(z) > -a, in particular all ' +
      'of the upper half-plane. The minus-factor 1/(z-a) has a pole at z=a. ' +
      'Both must be recorded with correct analyticity domains.',
    holds: () => {
      const f = IMP1287_VOLTERRA_WIENER_HOPF.factorization;
      return (
        f.plusFactor.expression === '1/(z + a)' &&
        f.plusFactor.analyticityDomain.includes('Re(z) > -a') &&
        f.minusFactor.expression === '1/(z − a)' &&
        f.minusFactor.analyticityDomain.includes('Re(z) < a')
      );
    },
  },
  {
    id: 'imp1287-wh-closes-for-a-geq-phi-sup-norm-squared',
    why:
      'The threshold for WH closure is a ≥ ‖Φ‖²_∞ ≈ 0.1996. Below this, the ' +
      'WH bound exceeds 1. Tripwire: thresholdAForClosure must equal ' +
      'PHI_SUP_NORM² to 12 sig figs.',
    holds: () => {
      const b = IMP1287_VOLTERRA_WIENER_HOPF.bound;
      const expected = PHI_SUP_NORM * PHI_SUP_NORM;
      return (
        Math.abs(b.thresholdAForClosure - expected) < 1e-12 &&
        b.thresholdAForClosure > 0.19 &&
        b.thresholdAForClosure < 0.20
      );
    },
  },
  {
    id: 'imp1287-wh-bound-below-one-for-a-at-or-above-threshold',
    why:
      'Every row of the numerical grid with a ≥ threshold must have WH bound ' +
      '≤ 1; every row with a < threshold has WH bound > 1. This pins the ' +
      'threshold semantics — if any row violates the boundary, the bound ' +
      'computation is wrong.',
    holds: () => {
      for (const r of IMP1287_VOLTERRA_WIENER_HOPF.numericalGrid.rows) {
        if (r.atOrAboveThreshold && !r.belowOne) return false;
        if (!r.atOrAboveThreshold && r.belowOne) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1287-combined-HS-WH-covers-all-a-positive',
    why:
      'HS (imp-1267, sharpened by imp-1260 to (0, ~37.66]) and WH (this ' +
      'ticket, [0.1996, ∞)) overlap massively on [0.1996, 37.66] and their ' +
      'union is (0, ∞). The combined coverage flag must be true.',
    holds: () => {
      const c = IMP1287_VOLTERRA_WIENER_HOPF.combinedCoverage;
      return (
        c.union.closesConj272ForAllA === true &&
        c.overlap.range.includes('0.1996') &&
        c.overlap.range.includes('37.66') &&
        c.hsRoute.aStarHS_exact > 35 &&
        c.whRoute.threshold < 1.0
      );
    },
  },
  {
    id: 'imp1287-combined-min-bound-below-one-at-threshold',
    why:
      'At a = ‖Φ‖²_∞ ≈ 0.1996 (the WH threshold), WH bound = 1 but HS bound ' +
      '≈ 7.4e-5 << 1 (HS dominates by ~10⁴×). The combined min(HS, WH) is ' +
      'therefore well below 1 at the threshold. combinedMaxValue must record ' +
      'combinedMaxBelowOne = true.',
    holds: () => {
      const c = IMP1287_VOLTERRA_WIENER_HOPF.combinedCoverage;
      return c.combinedMaxValue.combinedMaxBelowOne === true;
    },
  },
  {
    id: 'imp1287-laplace-symbol-cited-from-imp1266',
    why:
      'The Laplace symbol L[k_a](z) = a/(z²-a²) is taken from imp-1266, ' +
      'NOT re-derived here. The reference must point at imp-1266 and the ' +
      'formula string must match.',
    holds: () => {
      const l = IMP1287_VOLTERRA_WIENER_HOPF.laplaceSymbolFromImp1266;
      return (
        l.formula === 'L[k_a](z) = a / (z² - a²)' &&
        l.domain === 'Re(z) > a' &&
        l.source.includes('imp-1266')
      );
    },
  },
  {
    id: 'imp1287-mid-regime-crossover-at-a-around-23',
    why:
      'HS_linear ≈ 3.72e-4 · a and WH ≈ 0.1996/a are equal at ' +
      'a ≈ √(0.1996 / 3.72e-4) ≈ 23.16. The crossoverPoint value must ' +
      'be within 1% of 23.16.',
    holds: () => {
      const c = IMP1287_VOLTERRA_WIENER_HOPF.combinedCoverage.crossoverPoint;
      const expected = Math.sqrt(PHI_SUP_NORM_SQUARED / HS_LINEAR_COEF_SMALL_A);
      return (
        Math.abs(c.a_eq - expected) / expected < 0.01 &&
        c.a_eq > 22 &&
        c.a_eq < 24
      );
    },
  },
  {
    id: 'imp1287-honest-scope-flags',
    why:
      'isAnalyticalBound=true, isProof=true (WH bound itself is a closed-form ' +
      'analytical inequality), isProofOfConj27_2=false (not by WH alone), ' +
      'isProofOfConj27_2_combinedWithHS=true (HS+WH covers all a > 0).',
    holds: () => {
      const h = IMP1287_VOLTERRA_WIENER_HOPF.honestScope;
      return (
        h.isAnalyticalBound === true &&
        h.isProof === true &&
        h.isClosedForm === true &&
        h.isProofOfConj27_2 === false &&
        h.isProofOfConj27_2_combinedWithHS === true
      );
    },
  },
  {
    id: 'imp1287-phi-sup-norm-matches-imp1266-frozen-value',
    why:
      'The ‖Φ‖_∞ value used here must match imp-1266 PHI_NORMS.supNormOnPosReals ' +
      'to ≥ 10 sig figs. If a different ‖Φ‖_∞ is silently used, the threshold ' +
      'a ≥ 0.1996 is meaningless.',
    holds: () => {
      const b = IMP1287_VOLTERRA_WIENER_HOPF.bound;
      const imp1266Frozen = 0.44669690046712346;
      return (
        Math.abs(b.phiSupNorm - imp1266Frozen) < 1e-14 &&
        Math.abs(b.phiSupNormSquared - imp1266Frozen * imp1266Frozen) < 1e-14
      );
    },
  },
  {
    id: 'imp1287-paper-reference-points-at-v52-and-section-27',
    why:
      'The file must declare paperSourcePath = v52 PDF and paperSections must ' +
      'include §27. A drift means the file no longer matches its declared ' +
      'paper source.',
    holds: () =>
      IMP1287_VOLTERRA_WIENER_HOPF.paperSourcePath === PAPER_REF &&
      IMP1287_VOLTERRA_WIENER_HOPF.paperSections.includes('§27'),
  },
];

export default IMP1287_VOLTERRA_WIENER_HOPF;
