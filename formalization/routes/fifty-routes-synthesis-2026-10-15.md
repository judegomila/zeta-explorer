# Fifty routes: campaign synthesis (2026-10-15)

Synthesis of the fifty experimental routes of `formalization/routes/fifty-routes-2026-10-06.md` after batch 10. Sources: the 50 result modules
`src/data/route-<id>-*-2026-10-*.js`, the roadmap `src/data/research-routes-roadmap.js`, `src/data/lambda-levers-combined-2026-10-09.js` and
`src/data/qrh-path-push-2026-10-08.js`. Site data with assertions: `src/data/fifty-routes-synthesis-2026-10-15.js`.

Status frame: PT Λ ≤ 0.2 is the accepted benchmark (peer-reviewed). Every route result below had one adversarial internal referee pass and no external
review. 0.1758354 and 0.1787854 remain computer-assisted candidates. RH is open. Nothing here is a QED. Grades: PROVED (written, internal unless stated),
LEAN (machine-checked), CERTIFIED (interval arithmetic; Λ values certified relative to the route-P ledger, hence conditional on it), CONDITIONAL,
MEASURED, HEURISTIC.

## (a) Status of all 50 routes

43 done, 6 partial, 1 in progress (route 1: the certification campaigns are still running), 0 blocked. "Done" means the route's question is answered, whatever the answer.

| # | Grp | Route | Status | Batch | Result (one line) |
|---|---|---|---|---|---|
| 1 | A | Finish route P | in progress | 1 | Route P round 7 certified 0.145694083872924; with the campaign (collect6) route P alone 0.145535458600488; campaign at 2026-10-08 03:10: 76 done, 10 budget-stopped, 52 open; Λ < 0.145 not certified. |
| 2 | A | Lowered barrier floor into route P | done | 1 | Lowered barrier floor moves nothing: route P has no floor input and Polymath containment already holds (0.1787854, 0.1758354 unchanged). |
| 3 | A | Three-point correlated probes | done | 2 | Multi-point joint floor certified but worth −7.86e-7; six new λ < 2 kernels worth −2.28e-4 (0.145465618111039). |
| 4 | A | Fejér–Riesz certificate for the weak outer lemma | done | 2 | Fejér–Riesz SOS for WOL-C is exact but gains only θ-grid slack (2.2–4.1e-4 per box) against 0.0024–0.035 needed. |
| 5 | A | Many barriers | done | 2 | Four bands give 0.145620383931826 (−7.37e-5); band 1 binds; the 3-band layout is part of the joint value. |
| 6 | A | Sparse verification theorem | done | 2 | In the Lemma-B framework the RH head cannot be replaced; one wide local window replaces ≈ 1.73e12 ordinate units at τ = 0.145. |
| 7 | A | Time-dependent mollifiers | done | 3 | Per-cell Euler weights on the {2,3,5} mollifier are admissible but λ = 1 is already best; U unchanged. |
| 8 | A | Hybrid schedule | done | 3 | Polymath/Raymond hybrid: the best split has no Polymath band; any Polymath band gives 0.1758354. |
| 9 | A | Optimised barrier schedule y(t) | done | 3 | One optimised height set gives 0.145637425999752 alone, but adds exactly 0 once the route-3 kernels are present. |
| 10 | A | Lean core of Raymond's chain | partial | 9 | Lemma CG / G0-a and the start substitution are Lean theorems; Lemma R Lean-checked conditional on AF (4.6) and Φ' = Re β_t; G0-c, G0-d not formalised. |
| 11 | B | Multi-prime Toeplitz–Krein past ln 3 | done | 4 | Pole-free Weil positivity of ζ certified to 2a ≤ ln 5 (ln 11 conditional on a tiling patch); margins ≈ 10^(−4.8e^{2a}); inside the verified height. |
| 12 | B | Semilocal trace identity for S = {∞, 2, 3} | done | 4 | S = {∞,2,3} trace identity derived; the remainder share equals 1 − λ_W/L_S by definition, so it cannot separate one S from another. |
| 13 | B | Lacunary / Müntz-incomplete cones | done | 4 | Weil positivity on the lacunary cone {4^k} certified (Pick ≥ 3.6346e-4); no zero information above a finite horizon on separated lattices; near-threshold regime open. |
| 14 | B | Family Weil positivity | done | 4 | Family Weil positivity certified to 2a ≈ 2 log q (10.0 at q = 257) but Euler-blind; at all supports it is GRH for every character mod q. |
| 15 | B | Euler-blindness radius for Epstein twins | done | 4 | 27 Epstein twins certified Weil-negative; principal forms fail near log(\|D\|/4) − 0.13; lower ends even-sector, measured. |
| 16 | C | Alpöge–Furman ≥ 2/3 in twin-ladder terms | done | 5 | Alpöge–Furman ≥ 2/3 mechanism reproduced at heights 1e3–2.9e5; sits in NS-RIGID's open class (prime-side second moment + signature counting). |
| 17 | C | Mollifiers beyond θ = 4/7 | done | 5 | Conditional κ(θ) table (0.5884 at θ = 1); finite-T main-term agreement to θ = 2 within 0.52%; no proof input. |
| 18 | C | Local Levinson under pair correlation | done | 5 | Pair correlation is ordinate-only and β-blind; a count certificate feeds H_desc-mirror only at 1–4-spacing resolution. |
| 19 | C | Mollified Weil forms | done | 5 | A length-N mollified Weil form is the plain Weil form at a + ½ log N on a subset; merges into Route I; Euler-blind to ln 11. |
| 20 | D | Effective Ki–Kim–Lee | done | 2 | Explicit Ki–Kim–Lee threshold x0(t) ≈ 4π·exp(c/t), c ≈ 5.3–5.8, Arb-certified; at X = 6e12 it covers only t ≥ 0.217. |
| 21 | D | Entropy functional for the zero flow | done | 6 | Monotone functionals of the zero flow form a full family (saddle functions, Σ\|y\|^p); all forward-only and flow-blind. |
| 22 | D | Lehmer-pair hunt at large height | done | 6 | Lehmer pairs over 1.55e6 zeros to 1e13: best Λ ≥ −4.2577e-6, nothing beyond Rodgers–Tao; CUE_Neff correction replicated. |
| 23 | D | H_t dynamics vs Dyson Brownian motion | partial | 6 | Zeros miss the Dyson loop identity dV/dτ(0) = −4 by (0.434 ± 0.008)·12Λ_B/L² (measured); finite-τ runs unfinished. |
| 24 | D | Mean-field descent with local zero counts | done | 6 | P15 triangle method gives no local count below de Bruijn's ceiling for t ≤ 0.137 at X; B2 channel ceiling Λ ≈ 0.148 (below 0.145 only from binding height ≈ 1.75e13). |
| 25 | E | Bridge as scattering | done | 7 | Modular-surface scattering factorises through ζ(2s); soft Lax–Phillips axioms survive moving resonances (RH-blind). |
| 26 | E | Twin ladder for GL(2) | done | 7 | GL(2) twin ladders: Ramanujan is RH per rung, not for the ladder; provable statements conductor-driven and Euler-blind. |
| 27 | E | Function-field twin ladder | done | 1 | Over F_q the twin-ladder Weil form is minus the intersection form on primitive Frobenius-graph classes (Hodge index ⇒ curve RH); the lift stops at Spec Z × Spec Z. |
| 28 | E | Freeze calculus on Selberg zeta | done | 7 | Freeze calculus on the PSL2(Z) Selberg zeta behaves like ζ; no RH-false control run, so no blindness theorem. |
| 29 | E | Interferometer visibility functional | done | 7 | Interferometer visibility is vacuous, false (Arb, to t = 200) or a gauge choice; its gauge-invariant content is Λ. |
| 30 | E | Finite-support Euler detector | done | 7 | Rung Toeplitz tests detect DH at ln 2 / ln 4 / ln 6, sharp relative to formal local Euler products; multiplicativity, no RH content. |
| 31 | F | Berry–Keating xp, regularised | done | 8 | Regularised xp models reproduce only the smooth N(T); the residual is exactly S(T); fluctuations need primes (explicit formula). |
| 32 | F | Inverse spectral potential | done | 8 | Inverse spectral potentials for the first 5000 zeros: exact discretely, ≈ 1–2% of a spacing in the continuum; consume the ordinates. |
| 33 | F | Arithmetic corrections to RMT statistics | done | 8 | GUE departure of pair correlation = Bogomolny–Keating correction at amplitude 1.0000 ± 0.0008. |
| 34 | F | de Branges Hamiltonian for ξ | done | 8 | de Branges Hamiltonian of Ξ + iΞ' computable from 16,000 zeros; mass positivity tautological; a → 0 limit of the T3 strip ladder. |
| 35 | F | Certified Li coefficients | done | 8 | Li coefficients certified positive for n ≤ 10^4 (reproduces Johansson); weaker than what the verified height implies. |
| 36 | G | Random local windows at 10^13–10^20 | done | 9 | 16 random Platt windows 1.06e13–3.09e19: 146,768 zeros certified simple and on the line; no anomaly. |
| 37 | G | Gram-law violation statistics | done | 6 | Gram-law violation density predicts neither binding floors nor barrier difficulty (\|ρ\| ≤ 0.31). |
| 38 | G | Barrier slab at higher X | done | 3 | Barrier slabs certify at 2X, 5X, 10X (cost ∝ X^0.45–0.57); none moves Λ until RH is verified to X'/2. |
| 39 | H | Lean: Weil explicit formula + Yoshida | partial | 9 | Lean Yoshida-type small-support reduction (supp 0.1733); Weil's explicit formula a hypothesis over an abstract zero functional. |
| 40 | H | Aristotle on WOL and BB1/BB2 | partial | 9 | Lean fragments of the WOL-C lemmas L1–L5 and the logical core of Theorem BB; WOL-C and BB1/BB2 not proved. |
| 41 | H | Lean replay of Arb certificates | done | 9 | Lean replay (decide +kernel) of the ARB-LEGE linear-algebra leg; transcendental enclosures still Arb-trusted. |
| 42 | I | Formal MV-CAP theorem | partial | 5 | MV-CAP is a theorem for zero-side premises (explicit counter-model in every window of [3.1e12, 7.5e16]); function-side L² inputs open. |
| 43 | I | Flow-criticality classes | done | 9 | Graded flow-criticality κ(P) = sup Λ: strip 1/2, QRH 7/8 9/32 (de Bruijn class without Φ > 0); binary class conditional on an escape law. |
| 44 | I | Euler-detection depth across conductors | done | 10 | 387 of 440 Dirichlet DH-type twins (q 5–49) certified Weil-negative at a ∈ [0.36, 3.40]; onset follows root-number phase, conductor slope ≈ 0.2–0.37 (censoring-biased). |
| 45 | J | Multiplicative chaos for source-floor tails | done | 10 | Random model cannot explain the certified-floor vs Kronecker gap (certification slack); referee: L-damping at t > 0 makes a deterministic finite-window floor a candidate lever. |
| 46 | J | Exact Kronecker floors | partial | 1 | Kronecker suprema certified from below at the 12 binding cells (≥ 0.533514111339326 at t = 0.075); floor gains capped at U2 = 0.144254643222956; reduces to WOL-C. |
| 47 | J | Learned adversaries | done | 10 | Learned adversaries find nothing r6 missed; difficulty forecast by K0 (and g within r_23_40); 17 pending 0.88-sharp floors expected budget-stopped (heuristic). |
| 48 | J | Phase retrieval for ζ | done | 10 | \|ζ\| on the line fixes ζ up to independent off-line flips (Hilbert-transform wall, exactly); FE + reality ⇒ ±ξ; a second line locates zeros (8 DH zeros below 400). |
| 49 | J | Unconditional S(T) constants | done | 1 | Sawtooth lemma improves \|S(T)\| by 9–17% at 1e11–1e17 (constant to be checked); no pointwise S(T) input gives a Λ lever. |
| 50 | J | Verified-height-free Λ curve | done | 3 | Λ from the explicit KKL constant still needs RH to X/2; beating route P needs c ≤ 3.912, the triangle method is floored at c > 4.9144. |

## (b) The Λ ledger

| Value | What | Grade |
|---|---|---|
| 0.2 | Platt–Trudgian 2021 | PROVED (peer-reviewed; Platt–Trudgian 2021) |
| 0.1758354 | Polymath-track; route 8 recomposes it exactly; routes 2, 7 leave it unchanged | computer-assisted candidate (unreviewed, unpublished) |
| 0.1787854 | unchanged (route 2) | private unreviewed candidate |
| 0.145276368594868 | unconditional-on-QRH best: route P + route-1 campaign certificates (collect6, snapshot 2026-10-07 06:54) + route-5 3-band layout + 281 route-3 λ < 2 kernels; route 9 adds exactly 0 jointly | CERTIFIED relative to the shared route-P ledger (hence conditional on it); internal referee only |
| 0.116091488672439 | conditional-on-QRH best: route-P single-band consumer re-tuned on the 7/8 path (start q0 = 9/16 + ε), 59,439 substeps, Track-A floors at lowered heights with route-3 kernels | CERTIFIED exact run relative to the route-P ledger, CONDITIONAL on the 7/8 half-plane; a conditional value, not a bound |

**Unconditional on QRH (route-P combined): Λ ≤ 36319092148717/250000000000000 = 0.145276368594868** (src/data/lambda-levers-combined-2026-10-09.js).

Ladder at PT height:

- r6 route P: 0.146660920737233
- route 1 round 7 (244 floors): 0.145694083872924
- route P + campaign alone (collect6): 0.145535458600488
- joint with routes 3 and 5 (collect6): 0.145276368594868

Dependencies:

- Raymond's analytic chain G0 (internal review passes only; no external reader)
- G0-c and G0-d (OP)
- AF Part I/II gaps (expository fixes written)
- Lemma B (written)
- producer layer
- RH-win (local RH windows, Route-2 driver)
- RH-head = PT RH verification to 3.0001753e12
- single v4c engine for the route-1 floors (independent driver replication only)
- Theorem B'_m for the 3-band layout (unrefereed) and RH in W2 via Route 2
- recorded X165mid / U2 replays of 2026-10-01 (tables deleted, not re-run)
- single-implementation consumer tmp/routes-b3-combine-consume.py

Λ < 0.145 is NOT certified; measured projection with every remaining floor at target: 0.144962368494868 (hypothetical margins). Campaign state: 2026-10-08 03:10 (status.tsv): 76 done, 10 budget-stopped, 12 running, 40 pending; no collector run since collect6.

**Conditional on QRH: Λ ≤ 116091488672439/1000000000000000 = 0.116091488672439** (src/data/qrh-path-push-2026-10-08.js). This is a conditional value, not a bound.

Dependencies:

- openai/math family 003: ζ(s) ≠ 0 for Re s > 7/8 (Lean-formalised, re-built locally; official comparator not run; not peer-reviewed)
- Raymond's chain G0 under the 7/8 start (internal review parts A/B; no ERROR found; GAPs expository) — binding premise
- PT RH verification to 3.0001753e12
- the route-P ledger (as above)

On the 7/8 path a WOL-C / campaign floor is worth ≈ 3.2e-6 to first order, so the route-1 campaign is not the lever there; the heuristic r2-structured-floor port is worth −1.85e-4 to −4.5e-4 (float clone, not certified).

Routes that moved a certified route-P value: 1, 3, 5, 9 (route 9 only alone; it adds exactly 0 once the route-3 kernels are present). Routes that asked a Λ question and found no gain: 2, 4, 6, 7, 8, 20, 24, 38, 46, 47, 49, 50. Most of the step from 0.1453 to 0.1161 comes from the 7/8 half-plane start (openai/math 003; the start does −0.0309 of the work in the integration record, src/data/openai-math-integration-2026-10-08.js); route-P levers add ≈ −0.0008 there and the 7/8-path re-tune −0.0016, using the route-3 kernels.

## (c) Structural map

### Known walls

- **pointwise** (needs pointwise / every-window information that averaged, mean-value or modulus-only inputs do not carry): routes 18, 24, 29, 42, 48, 49.
- **verified height** (the outcome is set by the verified RH height (PT 3.0001753e12), not by the route's own object): routes 2, 6, 11, 20, 24, 35, 36, 38, 50.
- **flow-blindness** (soft hypotheses preserved by the de Bruijn flow (SL2 class); cannot see zero location): routes 21, 25, 43.
- **RH-equivalence** (the object is RH (or GRH, or the explicit formula) restated, or reduces to the zero-location wall (T3 = strip)): routes 12, 14, 19, 29, 31, 34, 35, 48.

22 routes reduce to at least one of these four walls. The other recorded classes:

- **lambda-lever** (moved a certified route-P value (relative to the shared ledger)): routes 1, 3, 5, 9.
- **method-cap** (capped by the method or architecture it works in (θ-grid slack, band 1 binds, U2 cap, λ = 1 best, KKL constant floor, S(T) channel ceiling, …)): routes 2, 4, 7, 8, 20, 24, 38, 46, 49, 50.
- **euler-blind** (the method does not see the Euler product (passes a same-gamma-factor twin with off-line zeros)): routes 14, 15, 19, 26, 44.
- **superseded** (outcome superseded by a known theorem (Rodgers–Tao Λ ≥ 0)): route 22.
- **consumes-zeros** (the construction takes the zeros as input): route 32.
- **measurement** (a measurement with no lever content): routes 12, 17, 18, 21, 23, 25, 29, 31, 33, 34, 35, 36, 37, 47, 48.
- **tool** (infrastructure (formalisation)): routes 10, 39, 40, 41.
- **open** (question not closed; candidate lever or untested regime remains): routes 6, 11, 13, 16, 27, 28, 30, 42, 43, 45.

Readings across groups:

- Λ architecture (group A and the Λ-tagged routes): the route-P value is limited by the P47 late-cell majorant (WOL-C floors) and band 1; barrier slack, floors, mollifier weights, hybrids and KKL constants are not binding (routes 2, 4, 7, 8, 20, 38, 50). Below that, verified height binds (routes 6, 24, 38, 50).
- Weil positivity (groups B, E, I): every certified positivity result so far is either inside the verified height (route 11), blind above a finite horizon (route 13), Euler-blind (routes 14, 15, 19, 26, 44) or equivalent to (G)RH at full support (routes 12, 14, 19). Route 30 detects the Euler product at small support but only as a multiplicativity test; route 44 measures that the Weil form's own detection depth follows the twin's root-number phase and first off-line zero (fitted law, heuristic).
- Flow and soft structure (groups D, E, I): forward-monotone functionals, scattering axioms and soft hypotheses are flow-blind (routes 21, 25); route 43 grades this (κ(P) = sup Λ) but the binary question stays open.
- Spectral (group F): every operator model either reproduces only the smooth count, consumes the zeros, or restates RH (routes 31, 32, 34).
- Modulus-only and averaged inputs: mean values, pair correlation, pointwise S(T) and |ζ| on one line cannot see off-line zeros pointwise (routes 18, 42, 49, 48); route 48 states the Hilbert-transform wall exactly (independent flips ρ ↔ 1 − ρ̄).

### Genuinely new objects (with grade)

- Route 3: Theorem MP (multi-point joint floor) and certified λ < 2 two-point kernels — CERTIFIED (Theorem MP written, unrefereed).
- Route 5: Theorem B'_m multi-band layout — CERTIFIED relative to the ledger (theorem unrefereed).
- Route 6: Theorem N (sparse verification, framework-relative) — PROVED (written; corrected by referee).
- Route 9: optimised barrier height sets (10-knot multiplier of PLAN) — CERTIFIED relative to the ledger.
- Route 10: Lean theorems: Lemma CG / G0-a, half-plane start substitution — LEAN.
- Route 11: multi-rung ARB-LEGE certificates to ln 5 (ln 11 conditional) — CERTIFIED.
- Route 12: S = {∞,2,3} semilocal trace identity — CONDITIONAL (Connes–Consani framework).
- Route 13: certified lacunary-cone Weil positivity (indeterminate Carathéodory interpolation of ξ′/ξ) — CERTIFIED.
- Route 19: mollified-to-plain Weil reduction lemma — PROVED (elementary).
- Route 20: explicit Ki–Kim–Lee threshold curve x0(t) — CERTIFIED (conditional on Polymath15 Thm 1.3, de Bruijn).
- Route 27: twin-ladder Weil form = −intersection form on primitive classes in NS(C × C) — PROVED (internal).
- Route 30: finite-support rung Euler detector with sharp onsets — PROVED (elementary) + CERTIFIED witnesses.
- Route 41: Lean certificate-replay format for PSD certificates — LEAN.
- Route 42: MV-CAP theorem (zero-side premises) — PROVED (internal; double-precision margins).
- Route 43: flow-criticality grade κ(P) with the exact witness (z² + Y²)cos(cz) — PROVED (paper, internal) + LEAN (QRH strip).
- Route 45: L-damped finite-window form of the source-floor requirement — HEURISTIC / referee-derived structural statement.
- Route 48: two-line zero detector D(w) and the exact one-line ambiguity group — PROVED (classical-standard, internal).
- Route 49: sawtooth S(T) lemma — PROVED (elementary; input constant unchecked).

None of these is RH-level. The ones that moved a value are routes 3, 5, 9 (and the route-1 campaign certificates). The ones that leave an open question with lever content are routes 6 (sparse windows), 13 (near-threshold cones), 27 (the missing Spec Z × Spec Z object), 30 (Euler-aware radius), 42 (function-side MV-CAP), 43 (escape law) and 45 (finite-window floor).

## (d) Top 15 open next steps (ranked)

1. **External referee of Raymond's analytic chain G0 (AF Part I/II, Lemma 2, Lemma 3, Theorem 4/4′, G0-c, G0-d) under both starts.** (routes 10, 1). Binding premise of both the 0.1452… and the 0.1160… values; only internal passes exist.
2. **Regenerate and re-replay the X165mid and U2 tables; referee the Route-2 driver and Theorem B'_m.** (routes 5, 6). The 3-band joint value rests on 2026-10-01 replays whose tables were deleted.
3. **Let the route-1 campaigns finish, then run the collector and the joint consumer (3 bands, 281 kernels) on the final certfile with E1–E8.** (routes 1, 5, 3). Measured projection 0.14496 < 0.145 if the remaining floors reach target; the only near-term change to the unconditional-on-QRH value.
4. **Test a policy change on ONE 0.88-sharp floor (split the (t, a) piece, raise g) and test the g hypothesis on r_23_40 (idx 283 vs 292).** (routes 47, 1). Cells 392–424 are forecast budget-stopped under the current policy (≈ 187 CPU-h at stake).
5. **Certify the r2-structured-floor port on the 7/8 path.** (routes 9, 46). Heuristic −1.85e-4 to −4.5e-4 on the conditional value, where campaign floors are worth only ≈ 3.2e-6.
6. **Lean: AF (4.6) and Φ' = Re β_t (Lemma R unconditional), Lemma 2/3, a Theorem 4′ skeleton; then G0-c / G0-d and WOL-C as a Lean implication from engine output.** (routes 10, 40). Reduces the referee load on G0 and the ledger.
7. **A structured, label-factorised WOL-C bound (outer-lemma-weak §6.2) replacing T^k box covers for the P47 late cells.** (routes 46, 4, 40). Worth 0.146660920737233 → 0.144797588795776 at margin 0.0223 on the strip/band path; box covers stop at k = 5.
8. **Deterministic finite-window source floor at t > 0: include activated labels in the L-damping runs, then bound x ∈ [X − 2, X e^{2 s1}] and certify torus floors at L_lo = L0 + 2 s1.** (routes 45, 46). Referee-derived candidate lever (realised heights 0.05–0.10 below U_lo, heuristic).
9. **r2-layer lever at the W4 / 0.97 / 0.94 heights and a denser certified λ < 2 kernel grid.** (routes 9, 3). Heuristic −2.55e-4 on the unconditional path.
10. **Euler-aware Weil radius: SDP over the formal unitary degree-1 rung class, compared with the archimedean radius 0.9385 and DH's 1.72.** (routes 30, 44, 15). Decides whether rung unitarity alone buys Weil positivity past the archimedean radius — the only way the Euler detector could feed Weil positivity.
11. **Escape law at small τ (< 9/32): Arb rectangles for H_{−τ} zeros, or a proof that Y(−τ) = ∞ for every τ > 0.** (route 43). Decides whether a flow-critical-but-not-RH class exists in NS-RIGID's binary sense.
12. **Function-side MV-CAP: a counter-model surviving explicit σ ≥ 1 L² inputs, or a proof that explicit L² mean values at σ > 1/2 force the local count.** (routes 42, 18). The latter would make short-interval mean values a genuine partial lane input.
13. **Near-Müntz-threshold cones ν_k = k^p (p = 1.1–1.25, K ≥ 200, ≥ 300 digits).** (route 13). The only regime of NS-RIGID's A6 loophole that could carry new zero information.
14. **RH-true / RH-false Selberg control pair (cocompact arithmetic group vs a group with an exceptional eigenvalue).** (routes 28, 25). Without a control, no blindness statement about the freeze calculus follows.
15. **Discharge the explicit-formula hypothesis in Lean (PNT+ Kadiri scaffold) and port the Lean replay format to the Toeplitz–Krein and barrier PSD certificates; close the ln 7–ln 11 tiling patch.** (routes 39, 41, 11). Moves certified Weil-positivity results toward machine-checked ones.

## (e) External review needed

1. Raymond's analytic chain G0 (AF Part I/II, Lemmas 2–3, Theorem 4/4′, G0-c, G0-d) — for both Λ values below 0.2 on the Raymond/route-P architecture (0.145276368594868 and 0.116091488672439).
2. openai/math 003 Lean proof (Re s > 7/8): official comparator, lean4checker, peer review — for the conditional value 0.116091488672439 and route 43's κ(QRH 7/8) = 9/32 application.
3. route-P ledger: Lemma B, producer layer, Theorem B'_m (3 bands), Theorem MP, the v4c engine (independent implementation of the bounds), the single-implementation consumer — for the certified route-P values.
4. patched FLINT Platt lemmas (FLINT_AUDIT_2, single reader) and the Route-2 RH-window driver — for RH-win inputs (routes 5, 6) and route 36's certified windows.
5. route 6 Theorem N / Lemma G; route 8 Theorem B'_P; route 20 block lemma and gates M1–M4 (feeds route 50) — for framework statements about verified height and hybrids.
6. structural theorems: route 27 intersection-form identity, route 42 MV-CAP, route 43 witness and G4, route 48 Thm 48.1–48.5, route 13 Pick certificate, route 44 twin construction — for the map results (no Λ change); currently one internal referee pass each.
7. literature constants: Trudgian 2011/2014 S(T) constants (route 49), Trudgian 2014 S(t) (route 36), Alpöge–Furman preprint (route 16) — for inputs quoted from memory or preprints.

## Verdict

The campaign mapped all fifty routes with one internal referee pass each. The unconditional-on-QRH best is 0.145276368594868 (certified relative to the route-P ledger; dependencies G0, Lemma B, Theorem B'_m, the v4c engine, PT's verified height); the conditional-on-QRH best is 0.116091488672439 (additionally conditional on the openai/math 7/8 half-plane), a conditional value, not a bound. Neither is externally reviewed; the binding premise of both is G0. No route proves RH or a new zero-free region, and the structural results are maps of what each class of input can see. PT Lambda <= 0.2 stands; RH open; NO QED.
