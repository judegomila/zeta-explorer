/**
 * @fileoverview route-43-flow-criticality-classes-2026-10-14 — roadmap route 43 (batch 9, group I): grade inputs by flow-criticality and look
 * for an intermediate class between soft and RH. Paper: formalization/paper/flow-criticality-grading.md (referee corrections R1–R6 added at
 * record time); Lean: formalization/lean/Route43/FlowCriticality.lean. One worker run plus one adversarial internal referee pass (Lean rebuild
 * with sorry control, sympy witness check, independent G4 lattice check, independent mpmath backward-flow roots; not refuted; severity minor:
 * escape-law evidence overstated, Lean Part B trivial, ladder is a lower bound only, "exact" needs the no-Φ>0 caveat). Corrections applied.
 *
 * Definition: κ(P) := sup{Λ(F) : F ∈ P} over the de Bruijn class (largest de Bruijn–Newman constant compatible with P); survival τ_P(ξ) is
 *  NS-RIGID's binary notion.
 * PROVED:
 *  - LEAN (Lean 4.34.1, Mathlib d13f23b7 + OAI; referee rebuild exit 0, 10 theorems [propext, Classical.choice, Quot.sound], sorry control
 *    shows sorryAx): qrh_symmetric_strip — riemannZeta ρ = 0 ∧ 0 < Re ρ ⇒ |2 Re ρ − 1| ≤ 3/4 (from the proved OAI 7/8 theorem, stated for
 *    Mathlib's riemannZeta, plus riemannZeta_one_sub; trusts the locally built OAI proof, not peer-reviewed).
 *  - LEAN, ABSTRACT (trivial arithmetic over a FlowSpace; de Bruijn, the flow law Λ(F_t) = Λ(F) − t and Rodgers–Tao are hypotheses, Y an
 *    arbitrary real function, Λ real-valued, Y(−τ) assumed finite): graded_flow_blindness (F, F_{−τ} ∈ P ⇒ Λ(F) + τ ≤ κ(P)), survival ≤ κ,
 *    κ = 0 forces flow-criticality, {Λ ≤ c} survive exactly c − Λ(F); backward_strip_growth states only 2ε ≤ Y(−ε)² (the form
 *    Y(−τ)² ≥ 2(τ + Λ) is the paper version); qrh_survival_cap τ ≤ 9/32 − Λ ≤ 9/32 (also shows QRH has no soft backward-closed proof).
 *  - PAPER: exact witness Λ((z² + Y²)cos(cz)) = (√(1 + 4c²Y²) − 1)/(4c²) (sympy PDE residual 0; referee sign-change counts flip between
 *    0.99t* and 1.01t*); κ(Strip_Y) = Y²/2 IN THE DE BRUIJN CLASS WITHOUT Φ > 0 (witness zeros at ±iY; upper half cited de Bruijn 1950), so
 *    κ(QRH 7/8) = 9/32, κ(QRH 11/12) = 25/72, κ(critical strip) = 1/2 there; in ξ-like (Φ > 0) classes only κ ≤ 9/32 (≤ 1/2) is established.
 *    G3: proportion, zero-density and "all but finitely many on the line" add no κ beyond the strip they are combined with. G4: for the
 *    witness with c ≥ T, W_T ≥ 0 ⇔ 2c ≥ sinh(2YT)/Y − 2T (referee re-derived; lattice check −2.3315 vs −2.3290 at 0.9c_min). Compact-window
 *    strict-margin statements are flow-stable (Hurwitz).
 * CERTIFIED: nothing interval-certified.
 * CONDITIONAL: on an escape law for EVERY τ > 0 (zeros of H_{−τ} leave every strip at large height), the critical strip, zero-free regions,
 *  QRH and density statements would be flow-critical at ξ without being RH-equivalent. NOT tested where it matters: τ < 1/2 (strip),
 *  τ < 9/32 (QRH); heuristic threshold x ≈ 3·10¹⁸ at τ = 0.1. Route-P κ ≤ 0.1177 package is conditional (imported values).
 * MEASURED: H_{−1} 7 zeros in x ∈ [5000, 5050], y = 1.42…2.39 (none at x ≤ 200); H_{−4} 7 zeros in x ∈ [0.5, 200.5], y = 1.81…3.55 (above
 *  the forced √8 = 2.83). Zeros outside the critical strip are FORCED for every τ > 1/2 by G1d + Rodgers–Tao (Y(−τ) ≥ √(2τ) > 1), so τ = 1, 4
 *  are weak evidence; new are the heights and the τ = 4 excess over √8. Referee mpmath roots 5040.39086 + 1.41159i, 192.93262 + 3.58704i.
 *  Shifted quartets Λ = 0.265318…0.280979 < 9/32. Native span: λ_min(P_S(ε)) > 0 to ε = 1e5 on four node sets (60 digits, not interval) —
 *  "practically soft", κ = ∞ not shown. log Φ u⁴ coefficient −95.3433.
 * HEURISTIC: escape reach |Im z| ≈ τ log(x/4π)/2 − 1, escape from the critical strip once x ≳ 4π e^{4/τ}; second-order ordinate-0 loss
 *  ≈ (Y⁴/2) Σ x_k^{−2} ≈ 0.0036 at Y = 3/4.
 *
 * Verdict: in the graded κ sense an intermediate class exists (close to definitional; the new content is the exact witness value); in NS-RIGID's
 * binary sense the question stays unconditionally open. No Λ bound moves. No refereed bound is changed; RH open; NO QED. Import-free.
 * ROUTE_43_ASSERTIONS recompute live: the witness formula and its Y²/2 limit, the κ ladder values, the κ_low table from G4 (T²κ_low → 0.349),
 * the forced backward strip √(2τ) vs the measured zeros, the escape thresholds, the quartet bound and the second-order loss.
 */

const { abs, sqrt, sinh, log, exp, PI, max } = Math;

export const ROUTE_43 = Object.freeze({
  id: 'route-43-flow-criticality-classes-2026-10-14',
  route: 43,
  date: '2026-10-14',
  title: 'Route 43: graded flow-criticality κ(P) = sup Λ — QRH 7/8 sits at 9/32 (de Bruijn class without Φ > 0); binary question still open',
  status: 'done',
  headline: 'κ(P) = sup{Λ(F) : F ∈ P} grades inputs: critical strip 1/2, QRH 7/8 9/32 and QRH 11/12 25/72 exactly in the de Bruijn class without '
    + 'Φ > 0 (exact witness (z² + Y²)cos(cz)); fixed-support Weil positivity has a lower-bound ladder κ_low(T) with T²κ_low → 0.349; tail-blind inputs '
    + 'add nothing. In NS-RIGID\'s binary sense flow-critical-but-not-RH stays conditional on an escape law untested at small τ.',
  kappa: Object.freeze({ strip: 1 / 2, qrh78: 9 / 32, qrh1112: 25 / 72, pt: 0.2 }),
  witness: Object.freeze({ c: 0.05, Y: 0.75, lambda: 0.280856 }),
  kappaLow: Object.freeze([[0.5, 0.4142], [1, 0.3090], [1.941, 0.0926], [5, 0.01396], [10, 0.00349]]),
  kappaLowQRH: Object.freeze([[0.5, 0.2500]]),
  T2kappaLimit: 0.349,
  backward: Object.freeze({ tau1: Object.freeze({ x: Object.freeze([5000, 5050]), y: Object.freeze([1.42, 2.39]), count: 7, root: Object.freeze([5040.39086, 1.41159]) }),
    tau4: Object.freeze({ x: Object.freeze([0.5, 200.5]), y: Object.freeze([1.81, 3.55]), count: 7, root: Object.freeze([192.93262, 3.58704]) }) }),
  quartets: Object.freeze([0.265318, 0.277810, 0.279960, 0.280979]),
  nativeSpan: Object.freeze({ epsMax: 1e5, nodeSets: 4, lambdaMin12: 4.57e-17, digits: 60, logPhiU4: -95.3433 }),
  secondOrder: Object.freeze({ Y: 0.75, sumInvX2: 0.023, loss: 0.0036 }),
  refereeKilled: Object.freeze([
    'escape-law evidence overstated: zeros outside the critical strip are forced for every τ > 1/2 (G1d + Rodgers–Tao), so τ = 1, 4 do not test the τ < 9/32 / τ < 1/2 regime the conditional claim needs',
    'Lean Part B is trivial arithmetic over an abstract FlowSpace (de Bruijn, flow law, Rodgers–Tao hypotheses; Y arbitrary and finite); backward_strip_growth in Lean is only 2ε ≤ Y(−ε)²',
    'Weil "continuous ladder" is a lower bound only: κ_low(T) ≤ κ(W_T ∧ strip) ≤ 1/2; nothing shows κ(W_T) < 1/2 or continuity; κ_low not tight (c ≥ T restriction)',
    '"intermediate class exists" is close to definitional in the κ sense; the binary NS-RIGID question remains unconditionally open',
    '"exact" κ values hold in the de Bruijn class without Φ > 0; for ξ-like classes only κ ≤ 9/32 is established',
    'native-span κ ≥ 1e5 is a finite non-interval numerical survival measurement on four node sets: "practically soft", not soft',
  ]),
  nextStep: '(1) Test escape at small τ (< 9/32) or prove Y(−τ) = ∞ for every τ > 0 via the Riemann–Siegel saddle (Arb rectangles with interval '
    + 'Gauss–Hermite bounds first, near x = 5000 at τ = 1 as a pilot); (2) an upper bound on κ(W_T), or ξ-like witnesses (Φ > 0) blind to W_T; (3) κ for '
    + 'lacunary native-span families; (4) internal referee of the witness and G4 paper proofs (done once here).',
  files: Object.freeze(['formalization/paper/flow-criticality-grading.md', 'formalization/lean/Route43/FlowCriticality.lean',
    'tmp/routes-b9-r43-lean/{check.sh,run.sh,axioms.log}', 'tmp/routes-b9-r43-{witness,pick,backstrip,locate}.py',
    'tmp/routes-b9-r43-out/{witness.json,pick.json,backstrip-runs.jsonl,locate_tau4.json,locate_tau1_5000.json,lean-axioms.log}',
    'tmp/routes-b9-ref43-{witness,g4,root}.py']),
  verdict: 'Graded map. κ(P) = sup Λ over P places the critical strip at 1/2 and QRH 7/8 at 9/32 (exact in the de Bruijn class without Φ > 0; '
    + 'only ≤ in ξ-like classes), PT\'s package at ≤ 0.2, fixed-support Weil positivity on a lower-bound ladder, tail-blind inputs at the strip value. '
    + 'An intermediate κ-class exists in a near-definitional sense; whether flow-critical-but-not-RH statements exist in NS-RIGID\'s binary sense '
    + 'stays conditional on an escape law not tested at small τ. Lean content: the QRH symmetric strip (trusting OAI 003) plus abstract arithmetic. '
    + 'No Λ bound moves. No refereed bound is changed; RH open; NO QED.',
});

const R = ROUTE_43;
const lam = (c, Y) => (sqrt(1 + 4 * c * c * Y * Y) - 1) / (4 * c * c);
const kappaLow = (T, Ymax = 1, n = 4000) => { let best = 0;
  for (let i = 1; i <= n; i += 1) { const Y = (Ymax * i) / n; const c = max(T, (sinh(2 * Y * T) / Y - 2 * T) / 2); best = max(best, lam(c, Y)); } return best; };

export const ROUTE_43_ASSERTIONS = Object.freeze([
  {
    id: 'r43-witness-formula',
    holds: () => { const { c, Y } = R.witness; return abs(lam(c, Y) - R.witness.lambda) < 1e-6 && abs(lam(1e-4, Y) - (Y * Y) / 2) < 1e-6
        && lam(0.05, Y) < (Y * Y) / 2 && lam(0.01, 0.75) > lam(0.05, 0.75); },
    why: 'Λ((z² + Y²)cos(cz)) = (√(1 + 4c²Y²) − 1)/(4c²) = 0.280856 at (0.05, 3/4), increasing to Y²/2 = 9/32 as c ↓ 0 (strip value, de Bruijn class without Φ > 0).',
  },
  {
    id: 'r43-kappa-ladder',
    holds: () => { const k = (th) => (2 * th - 1) ** 2 / 2; return abs(k(7 / 8) - R.kappa.qrh78) < 1e-15 && abs(k(11 / 12) - R.kappa.qrh1112) < 1e-15
        && abs(k(1) - R.kappa.strip) < 1e-15 && R.kappa.pt < R.kappa.qrh78 && R.quartets.every((q) => q < R.kappa.qrh78); },
    why: 'κ(QRH_θ) = (2θ − 1)²/2: 9/32, 25/72, 1/2 (θ = 7/8, 11/12, 1); PT\'s 0.2 package lies below; shifted quartets Λ = 0.2653…0.2810 < 9/32.',
  },
  {
    id: 'r43-kappa-low-g4-live',
    holds: () => R.kappaLow.every(([T, v]) => abs(kappaLow(T) - v) < 2e-4 * max(1, v / 0.01)) && abs(kappaLow(R.kappaLowQRH[0][0], 0.75) - R.kappaLowQRH[0][1]) < 2e-4
      && abs(100 * kappaLow(10) - R.T2kappaLimit) < 1e-3 && abs(400 * kappaLow(20) - R.T2kappaLimit) < 1e-3,
    why: 'G4: W_T ≥ 0 ⇔ 2c ≥ sinh(2YT)/Y − 2T (c ≥ T); maximising the witness Λ over Y ≤ 1 gives κ_low = 0.4142, 0.3090, 0.0926, 0.01396, 0.00349 at T = 0.5, 1, 1.941, 5, 10, T²κ_low → 0.349; with Y ≤ 3/4 (∧ QRH) 0.25 at T = 0.5. A lower bound only.',
  },
  {
    id: 'r43-forced-backward-strip',
    holds: () => { const f = (tau) => sqrt(2 * tau); const b = R.backward;
      return f(1) > 1 && f(4) > 1 && f(0.5) === 1 && b.tau1.y[0] >= f(1) - 0.01 && b.tau4.y[1] > f(4) && abs(b.tau1.root[1] - 1.41159) < 1e-9 && f(9 / 32) < 1; },
    why: 'G1d + Rodgers–Tao: Y(−τ) ≥ √(2τ), > 1 for τ > 1/2 — so zeros outside the critical strip at τ = 1, 4 are forced (weak evidence); at τ = 9/32 the forced value √(9/16) = 0.75 < 1 says nothing; τ = 4 zeros reach 3.55 > √8.',
  },
  {
    id: 'r43-escape-thresholds-heuristic',
    holds: () => { const x = (tau) => 4 * PI * exp(4 / tau); const tauAt = (X) => 4 / log(X / (4 * PI));
      return abs(x(1) - 686) < 5 && abs(x(4) - 34.2) < 0.5 && abs(tauAt(6e12) - 0.149) < 0.002 && x(0.1) > 1e18; },
    why: 'Heuristic escape from the critical strip once x ≳ 4π e^{4/τ}: ≈ 690 (τ = 1), 34 (τ = 4); at x = 6e12 (top of the verified range in z) τ ≳ 0.149; τ = 0.1 needs x ≈ 3·10¹⁸ (untested regime).',
  },
  {
    id: 'r43-second-order-and-scope',
    holds: () => { const s = R.secondOrder; return abs((s.Y ** 4 / 2) * s.sumInvX2 - s.loss) < 1e-4 && R.nativeSpan.lambdaMin12 > 0
        && /de Bruijn class without Φ > 0/.test(R.verdict) && /conditional on an escape law/.test(R.verdict) && /refereed bound is changed/i.test(R.verdict)
        && /NO QED/.test(R.verdict) && R.refereeKilled.length === 6; },
    why: 'Second-order ordinate-0 loss (Y⁴/2)·Σx_k^{−2} ≈ 0.0036 at Y = 3/4; native-span λ_min positive (measured); exact κ only without Φ > 0; binary class conditional; no Λ change; no QED.',
  },
]);

export default ROUTE_43;
