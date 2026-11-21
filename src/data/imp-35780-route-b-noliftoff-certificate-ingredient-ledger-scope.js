/**
 * @module imp-35780-route-b-noliftoff-certificate-ingredient-ledger-scope
 *
 * imp-35780 (proof/assessment, S-frontier): ENUMERATE the individual analytic
 * ingredients a de Bruijn Theorem-13-style NO-LIFT-OFF certificate, uniform in the
 * ordinate x at T_PT = 3e12, requires in order to run imp-35726 Route (b) --
 * FORWARD-evolving the repo held negative-time proxy across the time interval
 * [t_repo, 0, t_PM15] up to the positive-time Polymath15 barrier -- and mark which
 * ingredients the HELD proxy contributes versus which are GREENFIELD.
 *
 * imp-35726 Part C priced Route (b) at ~ the cost of building the direct positive-t
 * barrier and REJECTED Route (a) (analytic continuation = inverse heat operator,
 * unbounded exp(+(dt)u^2) amplification, ill-posed). But Part C never ITEMISED the
 * ingredient ledger of the Route (b) certificate. imp-35717 R2 established the only
 * well-posed bridge: treat the held negative-time proxy (de Bruijn flow at
 * t_repo = -4 tau_repo, the winding-thread identity) as INITIAL DATUM and evolve it
 * FORWARD through the shared Riemann-xi endpoint t = 0 up to the positive barrier
 * time t_PM15. This module enumerates what such a forward no-lift-off certificate
 * needs and audits held-versus-greenfield, so the "~ cost of the direct barrier"
 * verdict is grounded in a line-item list rather than a single cost figure.
 *
 * ASSESSMENT / ENUMERATION ONLY. Continues nothing; discharges nothing; changes no
 * bound; establishes no positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * WHAT A "NO-LIFT-OFF CERTIFICATE" MEANS HERE
 * -----------------------------------------------------------------------------
 * de Bruijn Theorem 13 is a forward-time statement: if H_t has only REAL zeros at
 * some time t, they stay real for every t-prime > t (no zero "lifts off" the real
 * axis into the complex plane). Route (b) would use it to transport the held object
 * forward. But as a CERTIFICATE at a finite verified height it must hold UNIFORMLY in
 * the ordinate x out to the T_PT = 3e12 range -- a per-x qualitative reality
 * statement is not enough; a quantitative x-uniform margin is required. The ledger
 * below separates the structural inputs (held) from that x-uniform quantitative core
 * (greenfield).
 *
 * I1 -- INITIAL-DATUM REGULARITY / ADMISSIBILITY (from the proxy)  [HELD, PARTIAL]
 * -----------------------------------------------------------------------------
 * The forward flow needs a valid initial datum: an entire function of order 1 in the
 * Laguerre-Polya-admissible class, real on the axis, with the correct Gaussian-
 * convolution (heat-kernel) structure. The held proxy SUPPLIES this in kind -- by the
 * winding-thread identity it IS a genuine H_t member at the negative de Bruijn time
 * t_repo = -4 tau_repo, so it lives in exactly the right class and can serve as t = 0-
 * minus initial datum. This is the ONE ingredient the proxy contributes. CAVEAT: it
 * contributes it only where the proxy is actually evaluable -- the double-precision
 * window x ~< 104 (imp-35726 Part D / imp-35759, |H_0| ~ exp(-pi x/8) under the
 * ~1e-17 floor). The initial datum uniform in x AT T_PT-scale is NOT held; only the
 * structural class is. Hence HELD but PARTIAL.
 *
 * I2 -- UNIFORM-IN-x FORWARD-FLOW CONTROL  [GREENFIELD]
 * -----------------------------------------------------------------------------
 * Transporting across [t_repo, 0, t_PM15] needs control of the forward flow map (the
 * smoothing heat semigroup on the xi-side; imp-35717 R2 forward branch) UNIFORM in x
 * out to the T_PT range. The proxy is a single-time snapshot; it gives no x-uniform
 * bound on the evolution operator over an interval. This is the flow-control ingredient
 * the ticket names, and it is greenfield.
 *
 * I3 -- ENDPOINT-CROSSING CONTINUITY AT t = 0  [GREENFIELD]
 * -----------------------------------------------------------------------------
 * The interval [t_repo, 0, t_PM15] passes through the Riemann-xi endpoint t = 0. The
 * certificate needs continuity/regularity of the zero configuration across that
 * crossing -- the family H_t must vary continuously with no zero escaping to infinity
 * at the endpoint. This is the most delicate ingredient: the t = 0 configuration IS
 * the Riemann xi function, whose zero-reality on the crossing window is exactly what
 * is at stake, so an unqualified endpoint-crossing claim risks circularity. Greenfield,
 * and flagged as the circularity-sensitive line item.
 *
 * I4 -- x-UNIFORM NO-LIFT-OFF / ZERO-REALITY PRESERVATION  [GREENFIELD, SAME TIER AS DIRECT BARRIER]
 * -----------------------------------------------------------------------------
 * The load-bearing ingredient. de Bruijn Thm 13 gives forward reality preservation
 * ONLY given a real start; the certificate must guarantee the zeros stay on the axis
 * over the whole transported window UNIFORMLY in x. Made quantitative at a finite
 * height this IS the Polymath15 barrier positivity |A + B| > |C| -- i.e. work-item W1.
 * imp-35726 Part C already priced exactly this at ~ the cost of the DIRECT positive-t
 * barrier; the ledger confirms it is the same-tier item, not a re-use of the proxy.
 *
 * I5 -- QUANTITATIVE MARGIN AT T_PT (interval error caps)  [GREENFIELD]
 * -----------------------------------------------------------------------------
 * A certificate at a finite verified height needs the quantitative x-uniform margin:
 * the Polymath15 A + B - C effective approximation with its per-term interval error
 * caps E_A, E_B, E_{C_0}, instantiated at the positive barrier time and re-anchored to
 * T_PT = 3e12 (N(x) = floor(sqrt(x / 4 pi)) retained terms; ~488602 at T_PT). This is
 * precisely the imp-35717 R4 greenfield seed for W1.
 *
 * HELD-VERSUS-GREENFIELD TALLY
 * -----------------------------------------------------------------------------
 * Of the five ingredients the proxy contributes exactly ONE (I1), and only PARTIALLY
 * (structural class held; T_PT-scale evaluation not). The other four (I2-I5) are
 * greenfield, and the load-bearing one (I4) is the same-tier-as-the-direct-barrier
 * work imp-35726 Part C already costed. This grounds the Part C "~ cost of the direct
 * barrier" verdict in a line-item ledger: the proxy supplies the initial-datum CLASS
 * and nothing else; every ingredient that would make the transport a certificate at
 * T_PT is greenfield. Route (b) is confirmed NET-NEUTRAL-to-NEGATIVE versus building
 * the positive-t A + B - C directly.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Enumeration only. It builds no certificate, evolves no flow, evaluates no H_t,
 * establishes no zero-reality, and changes no bound. It re-affirms (does not re-derive)
 * the imp-35717 R2 well-posedness fork and the imp-35726 Part C cost verdict, now as a
 * ledger. NO QED. No refereed bound is changed.
 *
 * @see imp-35726-w1-sign-reconciliation-cost-scope (Part C: Route (b) ~ cost of direct barrier; Part D: proxy x ~< 104 cap)
 * @see imp-35717-w1-tsign-reconciliation-scope (R2 forward-evolution fork; R4 greenfield quantitative seed)
 * @see imp-35759-exact-debruijn-precision-digit-cost-scope (the exact evaluator caps at x ~< 104; T_PT-scale evaluation infeasible)
 * @see project_winding_thread_closed_corrected (Gaussian conv proxy = EXACT de Bruijn flow at negative time t = -4 tau_repo)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; de Bruijn Thm 13); Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed)
 */

// -- Anchor + operative constants (import-light; matching imp-35717 / imp-35726 / imp-35759) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified zero-ordinate height (barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this enumeration
const X_EXACT_CAP = 104; // proxy/exact-evaluator double-precision x-ceiling (imp-35726 Part D / imp-35759)
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms at T_PT (imp-35674 Part D / imp-35717 R4)

// Ledger tally: 1 of 5 ingredients held (and that one only partial), 4 of 5 greenfield.
const INGREDIENT_COUNT = 5;
const HELD_COUNT = 1; // I1 only (and PARTIAL)
const GREENFIELD_COUNT = INGREDIENT_COUNT - HELD_COUNT; // I2-I5

export const IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE = {
  id: 'imp-35780',
  proofSection: 'S-frontier',
  question:
    'Enumerate the individual analytic ingredients a de Bruijn Theorem-13-style no-lift-off certificate, ' +
    'uniform in x at T_PT = 3e12, requires to run imp-35726 Route (b) -- forward-evolving the held ' +
    'negative-time proxy across [t_repo, 0, t_PM15] to the positive-t Polymath15 barrier -- and mark which ' +
    'ingredients the held proxy contributes versus greenfield. Enumeration only; changes no bound; NO QED.',
  certificateMeaning:
    'de Bruijn Thm 13 preserves zero-reality FORWARD in t (no zero lifts off the axis) given a real start. ' +
    'As a certificate at a finite verified height it must hold UNIFORMLY in the ordinate x out to the ' +
    'T_PT = 3e12 range -- a per-x qualitative reality statement is insufficient; a quantitative x-uniform ' +
    'margin is required.',
  I1_initialDatumRegularity: {
    ingredient:
      'A valid initial datum for the forward flow: an entire order-1 Laguerre-Polya-admissible function, ' +
      'real on the axis, with the correct Gaussian-convolution (heat-kernel) structure.',
    status: 'HELD (PARTIAL)',
    heldBecause:
      'By the winding-thread identity the proxy IS a genuine H_t member at the negative de Bruijn time ' +
      't_repo = -4 tau_repo, so it lives in exactly the right class and can serve as initial datum.',
    caveat:
      'It contributes only where the proxy is evaluable -- the double-precision window x ~< 104 (|H_0| ~ ' +
      'exp(-pi x/8) under the ~1e-17 floor, imp-35726 Part D / imp-35759). The initial datum uniform in x ' +
      'AT T_PT-scale is NOT held; only the structural class is.',
  },
  I2_uniformFlowControl: {
    ingredient:
      'Control of the forward flow map (smoothing heat semigroup on the xi-side) UNIFORM in x out to the ' +
      'T_PT range, over the interval [t_repo, 0, t_PM15].',
    status: 'GREENFIELD',
    note: 'The proxy is a single-time snapshot; it gives no x-uniform bound on the evolution over an interval.',
  },
  I3_endpointCrossingContinuity: {
    ingredient:
      'Continuity/regularity of the zero configuration across the Riemann-xi endpoint t = 0 -- H_t varies ' +
      'continuously with no zero escaping to infinity at the crossing.',
    status: 'GREENFIELD',
    circularityFlag:
      'Most delicate line item: the t = 0 configuration IS the Riemann xi function, whose zero-reality on ' +
      'the crossing window is exactly what is at stake, so an unqualified endpoint-crossing claim risks ' +
      'circularity.',
  },
  I4_uniformNoLiftOff: {
    ingredient:
      'x-uniform guarantee that zeros stay on the axis over the whole transported window (the de Bruijn ' +
      'Thm 13 core made quantitative), which at a finite height IS the Polymath15 barrier positivity ' +
      '|A + B| > |C| -- i.e. work-item W1.',
    status: 'GREENFIELD (SAME TIER AS DIRECT BARRIER)',
    loadBearing: true,
    note: 'imp-35726 Part C already priced exactly this at ~ the cost of the DIRECT positive-t barrier.',
  },
  I5_quantitativeMargin: {
    ingredient:
      'The Polymath15 A + B - C effective approximation with per-term interval error caps E_A, E_B, ' +
      'E_{C_0} at the positive barrier time, re-anchored to T_PT = 3e12 (N(x) = floor(sqrt(x / 4 pi)) ' +
      'retained terms).',
    status: 'GREENFIELD',
    retainedTermsAtTPT: N_AT_TPT,
    note: 'Precisely the imp-35717 R4 greenfield seed for W1.',
  },
  tally: {
    ingredients: INGREDIENT_COUNT,
    held: HELD_COUNT,
    heldPartial: true,
    greenfield: GREENFIELD_COUNT,
    statement:
      'Of five ingredients the proxy contributes exactly ONE (I1) and only PARTIALLY (structural class ' +
      'held; T_PT-scale evaluation not). The other four (I2-I5) are greenfield; the load-bearing one (I4) ' +
      'is the same-tier-as-direct-barrier work imp-35726 Part C already costed. Route (b) is confirmed ' +
      'NET-NEUTRAL-to-NEGATIVE versus building the positive-t A + B - C directly.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / ENUMERATION (frontier-direction, NOT rigorous). A de Bruijn Thm-13-style no-lift-off ' +
    'certificate transporting the held negative-time proxy FORWARD across [t_repo, 0, t_PM15] to the ' +
    'positive-t barrier, uniform in x at T_PT = 3e12, decomposes into five ingredients. (I1) Initial-datum ' +
    'regularity is HELD but PARTIAL: the proxy IS a genuine H_t member at t_repo = -4 tau_repo so it ' +
    'supplies the Laguerre-Polya-admissible CLASS, but only over the double-precision window x ~< 104 -- ' +
    'the T_PT-scale initial datum is not held. (I2) Uniform-in-x forward-flow control, (I3) endpoint- ' +
    'crossing continuity at t = 0 (circularity-sensitive: t = 0 IS xi), (I4) the x-uniform no-lift-off / ' +
    'zero-reality preservation -- load-bearing, = the barrier positivity |A + B| > |C| = W1, which ' +
    'imp-35726 Part C already priced at ~ the direct barrier -- and (I5) the quantitative margin (E_A, ' +
    'E_B, E_{C_0} at T_PT, the imp-35717 R4 seed) are ALL GREENFIELD. Tally: 1 of 5 held (partial), 4 of ' +
    '5 greenfield. The ledger grounds the imp-35726 Part C "~ cost of the direct barrier" verdict in ' +
    'line items: the proxy supplies the initial-datum class and nothing else, so Route (b) is ' +
    'NET-NEUTRAL-to-NEGATIVE versus building A + B - C directly. Continues nothing; discharges nothing; ' +
    'changes no bound; establishes no positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35726 Part C (Route (b) ~ cost of direct barrier; Part D: proxy x ~< 104 cap); imp-35717 R2 ' +
    '(forward-evolution well-posedness fork) / R4 (greenfield quantitative seed); imp-35759 (exact ' +
    'evaluator caps at x ~< 104); winding-thread (Gaussian conv proxy = de Bruijn flow at t = -4 ' +
    'tau_repo); Polymath15 2019 (A + B - C; de Bruijn Thm 13); Platt-Trudgian 2021 (T_PT = 3e12; ' +
    'no refereed bound is changed).',
};

export const IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE_ASSERTIONS = [
  {
    // I1: initial-datum regularity is the ONE held ingredient, and only PARTIAL (x ~< 104 window).
    id: 'imp35780-i1-initial-datum-held-partial',
    description: 'I1: initial-datum regularity HELD but PARTIAL -- proxy supplies the class, not T_PT-scale evaluation (x ~< 104)',
    holds: () =>
      /HELD \(PARTIAL\)/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I1_initialDatumRegularity.status) &&
      /t_repo = -4 tau_repo/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I1_initialDatumRegularity.heldBecause) &&
      /x ~< 104/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I1_initialDatumRegularity.caveat),
  },
  {
    // I2 + I3: uniform-in-x flow control and endpoint-crossing continuity are greenfield; I3 circularity-flagged.
    id: 'imp35780-i2-i3-greenfield-endpoint-circularity',
    description: 'I2 uniform flow control GREENFIELD; I3 endpoint-crossing continuity GREENFIELD and circularity-flagged (t=0 IS xi)',
    holds: () =>
      /GREENFIELD/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I2_uniformFlowControl.status) &&
      /GREENFIELD/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I3_endpointCrossingContinuity.status) &&
      /circularity/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I3_endpointCrossingContinuity.circularityFlag),
  },
  {
    // I4: the x-uniform no-lift-off core is load-bearing, = barrier positivity |A+B|>|C| = W1, same tier as direct barrier.
    id: 'imp35780-i4-loadbearing-equals-w1',
    description: 'I4: x-uniform no-lift-off = |A+B|>|C| = W1, load-bearing, GREENFIELD same tier as the direct barrier',
    holds: () =>
      IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I4_uniformNoLiftOff.loadBearing === true &&
      /SAME TIER AS DIRECT BARRIER/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I4_uniformNoLiftOff.status) &&
      /W1/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I4_uniformNoLiftOff.ingredient),
  },
  {
    // I5 + tally: quantitative margin (E_A,E_B,E_{C_0} at T_PT) greenfield; tally = 1 of 5 held (partial), 4 greenfield.
    id: 'imp35780-i5-tally-one-of-five-held',
    description: 'I5: E_A,E_B,E_{C_0} at T_PT greenfield (R4 seed); tally = 1 of 5 held (partial), 4 of 5 greenfield',
    holds: () =>
      /E_A, E_B, E_\{C_0\}/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.I5_quantitativeMargin.ingredient) &&
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5 &&
      INGREDIENT_COUNT === 5 && HELD_COUNT === 1 && GREENFIELD_COUNT === 4 &&
      IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.tally.heldPartial === true,
  },
  {
    // Honesty gate: enumeration only, builds no certificate, changes no bound, NO QED, no refereed bound is changed.
    id: 'imp35780-honesty-gate-no-qed',
    description: 'Enumeration only; builds no certificate; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      X_EXACT_CAP === 104 &&
      /NET-NEUTRAL-to-NEGATIVE/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.tally.statement) &&
      /changes no bound/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.verdict) &&
      /NO QED/.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE.verdict),
  },
];

for (const a of IMP35780_ROUTE_B_NOLIFTOFF_CERTIFICATE_INGREDIENT_LEDGER_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35780-route-b-noliftoff-certificate-ingredient-ledger-scope assertion failed: ${a.id}`);
  }
}
