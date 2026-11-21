/**
 * @fileoverview fifty-routes-synthesis-2026-10-15 — synthesis of the fifty-routes campaign (formalization/routes/fifty-routes-2026-10-06.md;
 * batches 1–10, 2026-10-06 … 2026-10-15). Written after batch 10 from the 50 route result modules (src/data/route-<id>-*-2026-10-*.js) and
 * the roadmap (src/data/research-routes-roadmap.js). Prose version: formalization/routes/fifty-routes-synthesis-2026-10-15.md.
 *
 * Contents: (a) status table of all 50 routes (roadmap status; one-line result each); (b) Λ ledger: accepted benchmark, unconditional-on-QRH
 * best (route-P combined) and conditional-on-QRH best, with dependencies; (c) structural map: which routes reduced to a known wall (pointwise
 * wall, verified height, flow-blindness, RH-equivalence) or to the other recorded classes (Euler-blindness, route-P method caps, superseded,
 * consumes the zeros), and which produced genuinely new objects (with grade); (d) the 15 highest-ranked open next steps across routes;
 * (e) what external review is needed and for what.
 *
 * Grades used: PROVED (written, internal unless stated), LEAN (machine-checked), CERTIFIED (interval arithmetic; for Λ values: relative to the
 * shared route-P ledger, hence conditional), CONDITIONAL (named open hypothesis), MEASURED, HEURISTIC. Every route result is internal-referee
 * only (one adversarial internal pass per route). No route proves RH; no route lowers the accepted benchmark.
 *
 * No refereed bound is changed (accepted, peer-reviewed); 0.1758354 / 0.1787854 remain computer-assisted candidates; RH open; NO QED.
 * Import-light (imports only the import-free roadmap). FIFTY_ROUTES_SYNTHESIS_ASSERTIONS check: 50 routes covered once each, statuses and
 * result modules equal to the roadmap, status counts, wall labels from the allowed set, the Λ ledger as exact rationals and its ordering,
 * the ranked next steps (15, distinct, referencing real routes), and the honesty strings.
 */

import { RESEARCH_ROUTES } from './research-routes-roadmap.js';

export const SYNTHESIS_WALLS = Object.freeze({
  'pointwise-wall': 'needs pointwise / every-window information that averaged, mean-value or modulus-only inputs do not carry',
  'verified-height': 'the outcome is set by the verified RH height (PT 3.0001753e12), not by the route\'s own object',
  'flow-blindness': 'soft hypotheses preserved by the de Bruijn flow (SL2 class); cannot see zero location',
  'rh-equivalence': 'the object is RH (or GRH, or the explicit formula) restated, or reduces to the zero-location wall (T3 = strip)',
});

export const SYNTHESIS_OTHER_CLASSES = Object.freeze({
  'lambda-lever': 'moved a certified route-P value (relative to the shared ledger)',
  'method-cap': 'capped by the method or architecture it works in (θ-grid slack, band 1 binds, U2 cap, λ = 1 best, KKL constant floor, S(T) channel ceiling, …)',
  'euler-blind': 'the method does not see the Euler product (passes a same-gamma-factor twin with off-line zeros)',
  superseded: 'outcome superseded by a known theorem (Rodgers–Tao Λ ≥ 0)',
  'consumes-zeros': 'the construction takes the zeros as input',
  measurement: 'a measurement with no lever content',
  tool: 'infrastructure (formalisation)',
  open: 'question not closed; candidate lever or untested regime remains',
});

// [id, status, one-line result, reducesTo (known walls), other class, new object (or null), grade of the new object]
const T = (id, status, line, reducesTo, cls, newObject = null, grade = null) => Object.freeze({ id, status, line, reducesTo: Object.freeze(reducesTo), cls, newObject, grade });

export const SYNTHESIS_STATUS_TABLE = Object.freeze([
  T(1, 'in progress', 'Route P round 7 certified 0.145694083872924; with the campaign (collect6) route P alone 0.145535458600488; campaign at 2026-10-08 03:10: 76 done, 10 budget-stopped, 52 open; Λ < 0.145 not certified.', [], 'lambda-lever'),
  T(2, 'done', 'Lowered barrier floor moves nothing: route P has no floor input and Polymath containment already holds (0.1787854, 0.1758354 unchanged).', ['verified-height'], 'method-cap'),
  T(3, 'done', 'Multi-point joint floor certified but worth −7.86e-7; six new λ < 2 kernels worth −2.28e-4 (0.145465618111039).', [], 'lambda-lever', 'Theorem MP (multi-point joint floor) and certified λ < 2 two-point kernels', 'CERTIFIED (Theorem MP written, unrefereed)'),
  T(4, 'done', 'Fejér–Riesz SOS for WOL-C is exact but gains only θ-grid slack (2.2–4.1e-4 per box) against 0.0024–0.035 needed.', [], 'method-cap'),
  T(5, 'done', 'Four bands give 0.145620383931826 (−7.37e-5); band 1 binds; the 3-band layout is part of the joint value.', [], 'lambda-lever', 'Theorem B\'_m multi-band layout', 'CERTIFIED relative to the ledger (theorem unrefereed)'),
  T(6, 'done', 'In the Lemma-B framework the RH head cannot be replaced; one wide local window replaces ≈ 1.73e12 ordinate units at τ = 0.145.', ['verified-height'], 'open', 'Theorem N (sparse verification, framework-relative)', 'PROVED (written; corrected by referee)'),
  T(7, 'done', 'Per-cell Euler weights on the {2,3,5} mollifier are admissible but λ = 1 is already best; U unchanged.', [], 'method-cap'),
  T(8, 'done', 'Polymath/Raymond hybrid: the best split has no Polymath band; any Polymath band gives 0.1758354.', [], 'method-cap'),
  T(9, 'done', 'One optimised height set gives 0.145637425999752 alone, but adds exactly 0 once the route-3 kernels are present.', [], 'lambda-lever', 'optimised barrier height sets (10-knot multiplier of PLAN)', 'CERTIFIED relative to the ledger'),
  T(10, 'partial', 'Lemma CG / G0-a and the start substitution are Lean theorems; Lemma R Lean-checked conditional on AF (4.6) and Φ\' = Re β_t; G0-c, G0-d not formalised.', [], 'tool', 'Lean theorems: Lemma CG / G0-a, half-plane start substitution', 'LEAN'),
  T(11, 'done', 'Pole-free Weil positivity of ζ certified to 2a ≤ ln 5 (ln 11 conditional on a tiling patch); margins ≈ 10^(−4.8e^{2a}); inside the verified height.', ['verified-height'], 'open', 'multi-rung ARB-LEGE certificates to ln 5 (ln 11 conditional)', 'CERTIFIED'),
  T(12, 'done', 'S = {∞,2,3} trace identity derived; the remainder share equals 1 − λ_W/L_S by definition, so it cannot separate one S from another.', ['rh-equivalence'], 'measurement', 'S = {∞,2,3} semilocal trace identity', 'CONDITIONAL (Connes–Consani framework)'),
  T(13, 'done', 'Weil positivity on the lacunary cone {4^k} certified (Pick ≥ 3.6346e-4); no zero information above a finite horizon on separated lattices; near-threshold regime open.', [], 'open', 'certified lacunary-cone Weil positivity (indeterminate Carathéodory interpolation of ξ′/ξ)', 'CERTIFIED'),
  T(14, 'done', 'Family Weil positivity certified to 2a ≈ 2 log q (10.0 at q = 257) but Euler-blind; at all supports it is GRH for every character mod q.', ['rh-equivalence'], 'euler-blind'),
  T(15, 'done', '27 Epstein twins certified Weil-negative; principal forms fail near log(|D|/4) − 0.13; lower ends even-sector, measured.', [], 'euler-blind'),
  T(16, 'done', 'Alpöge–Furman ≥ 2/3 mechanism reproduced at heights 1e3–2.9e5; sits in NS-RIGID\'s open class (prime-side second moment + signature counting).', [], 'open'),
  T(17, 'done', 'Conditional κ(θ) table (0.5884 at θ = 1); finite-T main-term agreement to θ = 2 within 0.52%; no proof input.', [], 'measurement'),
  T(18, 'done', 'Pair correlation is ordinate-only and β-blind; a count certificate feeds H_desc-mirror only at 1–4-spacing resolution.', ['pointwise-wall'], 'measurement'),
  T(19, 'done', 'A length-N mollified Weil form is the plain Weil form at a + ½ log N on a subset; merges into Route I; Euler-blind to ln 11.', ['rh-equivalence'], 'euler-blind', 'mollified-to-plain Weil reduction lemma', 'PROVED (elementary)'),
  T(20, 'done', 'Explicit Ki–Kim–Lee threshold x0(t) ≈ 4π·exp(c/t), c ≈ 5.3–5.8, Arb-certified; at X = 6e12 it covers only t ≥ 0.217.', ['verified-height'], 'method-cap', 'explicit Ki–Kim–Lee threshold curve x0(t)', 'CERTIFIED (conditional on Polymath15 Thm 1.3, de Bruijn)'),
  T(21, 'done', 'Monotone functionals of the zero flow form a full family (saddle functions, Σ|y|^p); all forward-only and flow-blind.', ['flow-blindness'], 'measurement'),
  T(22, 'done', 'Lehmer pairs over 1.55e6 zeros to 1e13: best Λ ≥ −4.2577e-6, nothing beyond Rodgers–Tao; CUE_Neff correction replicated.', [], 'superseded'),
  T(23, 'partial', 'Zeros miss the Dyson loop identity dV/dτ(0) = −4 by (0.434 ± 0.008)·12Λ_B/L² (measured); finite-τ runs unfinished.', [], 'measurement'),
  T(24, 'done', 'P15 triangle method gives no local count below de Bruijn\'s ceiling for t ≤ 0.137 at X; B2 channel ceiling Λ ≈ 0.148 (below 0.145 only from binding height ≈ 1.75e13).', ['pointwise-wall', 'verified-height'], 'method-cap'),
  T(25, 'done', 'Modular-surface scattering factorises through ζ(2s); soft Lax–Phillips axioms survive moving resonances (RH-blind).', ['flow-blindness'], 'measurement'),
  T(26, 'done', 'GL(2) twin ladders: Ramanujan is RH per rung, not for the ladder; provable statements conductor-driven and Euler-blind.', [], 'euler-blind'),
  T(27, 'done', 'Over F_q the twin-ladder Weil form is minus the intersection form on primitive Frobenius-graph classes (Hodge index ⇒ curve RH); the lift stops at Spec Z × Spec Z.', [], 'open', 'twin-ladder Weil form = −intersection form on primitive classes in NS(C × C)', 'PROVED (internal)'),
  T(28, 'done', 'Freeze calculus on the PSL2(Z) Selberg zeta behaves like ζ; no RH-false control run, so no blindness theorem.', [], 'open'),
  T(29, 'done', 'Interferometer visibility is vacuous, false (Arb, to t = 200) or a gauge choice; its gauge-invariant content is Λ.', ['rh-equivalence', 'pointwise-wall'], 'measurement'),
  T(30, 'done', 'Rung Toeplitz tests detect DH at ln 2 / ln 4 / ln 6, sharp relative to formal local Euler products; multiplicativity, no RH content.', [], 'open', 'finite-support rung Euler detector with sharp onsets', 'PROVED (elementary) + CERTIFIED witnesses'),
  T(31, 'done', 'Regularised xp models reproduce only the smooth N(T); the residual is exactly S(T); fluctuations need primes (explicit formula).', ['rh-equivalence'], 'measurement'),
  T(32, 'done', 'Inverse spectral potentials for the first 5000 zeros: exact discretely, ≈ 1–2% of a spacing in the continuum; consume the ordinates.', [], 'consumes-zeros'),
  T(33, 'done', 'GUE departure of pair correlation = Bogomolny–Keating correction at amplitude 1.0000 ± 0.0008.', [], 'measurement'),
  T(34, 'done', 'de Branges Hamiltonian of Ξ + iΞ\' computable from 16,000 zeros; mass positivity tautological; a → 0 limit of the T3 strip ladder.', ['rh-equivalence'], 'measurement'),
  T(35, 'done', 'Li coefficients certified positive for n ≤ 10^4 (reproduces Johansson); weaker than what the verified height implies.', ['verified-height', 'rh-equivalence'], 'measurement'),
  T(36, 'done', '16 random Platt windows 1.06e13–3.09e19: 146,768 zeros certified simple and on the line; no anomaly.', ['verified-height'], 'measurement'),
  T(37, 'done', 'Gram-law violation density predicts neither binding floors nor barrier difficulty (|ρ| ≤ 0.31).', [], 'measurement'),
  T(38, 'done', 'Barrier slabs certify at 2X, 5X, 10X (cost ∝ X^0.45–0.57); none moves Λ until RH is verified to X\'/2.', ['verified-height'], 'method-cap'),
  T(39, 'partial', 'Lean Yoshida-type small-support reduction (supp 0.1733); Weil\'s explicit formula a hypothesis over an abstract zero functional.', [], 'tool'),
  T(40, 'partial', 'Lean fragments of the WOL-C lemmas L1–L5 and the logical core of Theorem BB; WOL-C and BB1/BB2 not proved.', [], 'tool'),
  T(41, 'done', 'Lean replay (decide +kernel) of the ARB-LEGE linear-algebra leg; transcendental enclosures still Arb-trusted.', [], 'tool', 'Lean certificate-replay format for PSD certificates', 'LEAN'),
  T(42, 'partial', 'MV-CAP is a theorem for zero-side premises (explicit counter-model in every window of [3.1e12, 7.5e16]); function-side L² inputs open.', ['pointwise-wall'], 'open', 'MV-CAP theorem (zero-side premises)', 'PROVED (internal; double-precision margins)'),
  T(43, 'done', 'Graded flow-criticality κ(P) = sup Λ: strip 1/2, QRH 7/8 9/32 (de Bruijn class without Φ > 0); binary class conditional on an escape law.', ['flow-blindness'], 'open', 'flow-criticality grade κ(P) with the exact witness (z² + Y²)cos(cz)', 'PROVED (paper, internal) + LEAN (QRH strip)'),
  T(44, 'done', '387 of 440 Dirichlet DH-type twins (q 5–49) certified Weil-negative at a ∈ [0.36, 3.40]; onset follows root-number phase, conductor slope ≈ 0.2–0.37 (censoring-biased).', [], 'euler-blind'),
  T(45, 'done', 'Random model cannot explain the certified-floor vs Kronecker gap (certification slack); referee: L-damping at t > 0 makes a deterministic finite-window floor a candidate lever.', [], 'open', 'L-damped finite-window form of the source-floor requirement', 'HEURISTIC / referee-derived structural statement'),
  T(46, 'partial', 'Kronecker suprema certified from below at the 12 binding cells (≥ 0.533514111339326 at t = 0.075); floor gains capped at U2 = 0.144254643222956; reduces to WOL-C.', [], 'method-cap'),
  T(47, 'done', 'Learned adversaries find nothing r6 missed; difficulty forecast by K0 (and g within r_23_40); 17 pending 0.88-sharp floors expected budget-stopped (heuristic).', [], 'measurement'),
  T(48, 'done', '|ζ| on the line fixes ζ up to independent off-line flips (Hilbert-transform wall, exactly); FE + reality ⇒ ±ξ; a second line locates zeros (8 DH zeros below 400).', ['pointwise-wall', 'rh-equivalence'], 'measurement', 'two-line zero detector D(w) and the exact one-line ambiguity group', 'PROVED (classical-standard, internal)'),
  T(49, 'done', 'Sawtooth lemma improves |S(T)| by 9–17% at 1e11–1e17 (constant to be checked); no pointwise S(T) input gives a Λ lever.', ['pointwise-wall'], 'method-cap', 'sawtooth S(T) lemma', 'PROVED (elementary; input constant unchecked)'),
  T(50, 'done', 'Λ from the explicit KKL constant still needs RH to X/2; beating route P needs c ≤ 3.912, the triangle method is floored at c > 4.9144.', ['verified-height'], 'method-cap'),
]);

const big = (s) => { const [a, b] = String(s).split('/'); return [BigInt(a), BigInt(b ?? '1')]; };
const cmpQ = (x, y) => { const [a, b] = big(x); const [c, d] = big(y); const l = a * d; const r = c * b; return l < r ? -1 : l > r ? 1 : 0; };
const dec15 = (x) => { const [a, b] = big(x); const n = a * 10n ** 15n; return n % b === 0n ? `0.${String(n / b).padStart(15, '0')}` : null; };

export const SYNTHESIS_LAMBDA_LEDGER = Object.freeze({
  accepted: Object.freeze({ value: '0.2', grade: 'PROVED (peer-reviewed; Platt–Trudgian 2021)', note: 'the accepted benchmark; unchanged by the campaign' }),
  candidates: Object.freeze([
    Object.freeze({ value: '0.1758354', grade: 'computer-assisted candidate (unreviewed, unpublished)', note: 'Polymath-track; route 8 recomposes it exactly; routes 2, 7 leave it unchanged' }),
    Object.freeze({ value: '0.1787854', grade: 'publicly posted candidate, not refereed', note: 'unchanged (route 2)' }),
  ]),
  unconditionalOnQRH: Object.freeze({
    exact: '36319092148717/250000000000000', dec: '0.145276368594868',
    grade: 'CERTIFIED relative to the shared route-P ledger (hence conditional on it); internal referee only',
    composition: 'route P + route-1 campaign certificates (collect6, snapshot 2026-10-07 06:54) + route-5 3-band layout + 281 route-3 λ < 2 kernels; route 9 adds exactly 0 jointly',
    source: 'src/data/lambda-levers-combined-2026-10-09.js',
    ladder: Object.freeze([
      Object.freeze({ step: 'r6 route P', dec: '0.146660920737233' }),
      Object.freeze({ step: 'route 1 round 7 (244 floors)', dec: '0.145694083872924' }),
      Object.freeze({ step: 'route P + campaign alone (collect6)', dec: '0.145535458600488' }),
      Object.freeze({ step: 'joint with routes 3 and 5 (collect6)', dec: '0.145276368594868' }),
    ]),
    dependencies: Object.freeze([
      'Raymond\'s analytic chain G0 (internal review passes only; no external reader)', 'G0-c and G0-d (OP)', 'AF Part I/II gaps (expository fixes written)',
      'Lemma B (written)', 'producer layer', 'RH-win (local RH windows, Route-2 driver)', 'RH-head = PT RH verification to 3.0001753e12',
      'single v4c engine for the route-1 floors (independent driver replication only)', 'Theorem B\'_m for the 3-band layout (unrefereed) and RH in W2 via Route 2',
      'recorded X165mid / U2 replays of 2026-10-01 (tables deleted, not re-run)', 'single-implementation consumer tmp/routes-b3-combine-consume.py',
    ]),
    notCertified: 'Λ < 0.145 is NOT certified; measured projection with every remaining floor at target: 0.144962368494868 (hypothetical margins).',
    campaign: '2026-10-08 03:10 (status.tsv): 76 done, 10 budget-stopped, 12 running, 40 pending; no collector run since collect6.',
  }),
  conditionalOnQRH: Object.freeze({
    exact: '116091488672439/1000000000000000', dec: '0.116091488672439',
    grade: 'CERTIFIED exact run relative to the route-P ledger, CONDITIONAL on the 7/8 half-plane; a conditional value, not a bound',
    composition: 'route-P single-band consumer re-tuned on the 7/8 path (start q0 = 9/16 + ε), 59,439 substeps, Track-A floors at lowered heights with route-3 kernels',
    source: 'src/data/qrh-path-push-2026-10-08.js',
    dependencies: Object.freeze([
      'openai/math family 003: ζ(s) ≠ 0 for Re s > 7/8 (Lean-formalised, re-built locally; official comparator not run; not peer-reviewed)',
      'Raymond\'s chain G0 under the 7/8 start (internal review parts A/B; no ERROR found; GAPs expository) — binding premise',
      'PT RH verification to 3.0001753e12', 'the route-P ledger (as above)',
    ]),
    pathNote: 'On the 7/8 path a WOL-C / campaign floor is worth ≈ 3.2e-6 to first order, so the route-1 campaign is not the lever there; the heuristic r2-structured-floor port is worth −1.85e-4 to −4.5e-4 (float clone, not certified).',
  }),
  movedByCampaign: Object.freeze([1, 3, 5, 9]),
  zeroEffect: Object.freeze([2, 4, 6, 7, 8, 20, 24, 38, 46, 47, 49, 50]),
});

export const SYNTHESIS_NEXT_STEPS = Object.freeze([
  Object.freeze({ rank: 1, routes: Object.freeze([10, 1]), step: 'External referee of Raymond\'s analytic chain G0 (AF Part I/II, Lemma 2, Lemma 3, Theorem 4/4′, G0-c, G0-d) under both starts.', why: 'Binding premise of both the 0.1452… and the 0.1160… values; only internal passes exist.' }),
  Object.freeze({ rank: 2, routes: Object.freeze([5, 6]), step: 'Regenerate and re-replay the X165mid and U2 tables; referee the Route-2 driver and Theorem B\'_m.', why: 'The 3-band joint value rests on 2026-10-01 replays whose tables were deleted.' }),
  Object.freeze({ rank: 3, routes: Object.freeze([1, 5, 3]), step: 'Let the route-1 campaigns finish, then run the collector and the joint consumer (3 bands, 281 kernels) on the final certfile with E1–E8.', why: 'Measured projection 0.14496 < 0.145 if the remaining floors reach target; the only near-term change to the unconditional-on-QRH value.' }),
  Object.freeze({ rank: 4, routes: Object.freeze([47, 1]), step: 'Test a policy change on ONE 0.88-sharp floor (split the (t, a) piece, raise g) and test the g hypothesis on r_23_40 (idx 283 vs 292).', why: 'Cells 392–424 are forecast budget-stopped under the current policy (≈ 187 CPU-h at stake).' }),
  Object.freeze({ rank: 5, routes: Object.freeze([9, 46]), step: 'Certify the r2-structured-floor port on the 7/8 path.', why: 'Heuristic −1.85e-4 to −4.5e-4 on the conditional value, where campaign floors are worth only ≈ 3.2e-6.' }),
  Object.freeze({ rank: 6, routes: Object.freeze([10, 40]), step: 'Lean: AF (4.6) and Φ\' = Re β_t (Lemma R unconditional), Lemma 2/3, a Theorem 4′ skeleton; then G0-c / G0-d and WOL-C as a Lean implication from engine output.', why: 'Reduces the referee load on G0 and the ledger.' }),
  Object.freeze({ rank: 7, routes: Object.freeze([46, 4, 40]), step: 'A structured, label-factorised WOL-C bound (outer-lemma-weak §6.2) replacing T^k box covers for the P47 late cells.', why: 'Worth 0.146660920737233 → 0.144797588795776 at margin 0.0223 on the strip/band path; box covers stop at k = 5.' }),
  Object.freeze({ rank: 8, routes: Object.freeze([45, 46]), step: 'Deterministic finite-window source floor at t > 0: include activated labels in the L-damping runs, then bound x ∈ [X − 2, X e^{2 s1}] and certify torus floors at L_lo = L0 + 2 s1.', why: 'Referee-derived candidate lever (realised heights 0.05–0.10 below U_lo, heuristic).' }),
  Object.freeze({ rank: 9, routes: Object.freeze([9, 3]), step: 'r2-layer lever at the W4 / 0.97 / 0.94 heights and a denser certified λ < 2 kernel grid.', why: 'Heuristic −2.55e-4 on the unconditional path.' }),
  Object.freeze({ rank: 10, routes: Object.freeze([30, 44, 15]), step: 'Euler-aware Weil radius: SDP over the formal unitary degree-1 rung class, compared with the archimedean radius 0.9385 and DH\'s 1.72.', why: 'Decides whether rung unitarity alone buys Weil positivity past the archimedean radius — the only way the Euler detector could feed Weil positivity.' }),
  Object.freeze({ rank: 11, routes: Object.freeze([43]), step: 'Escape law at small τ (< 9/32): Arb rectangles for H_{−τ} zeros, or a proof that Y(−τ) = ∞ for every τ > 0.', why: 'Decides whether a flow-critical-but-not-RH class exists in NS-RIGID\'s binary sense.' }),
  Object.freeze({ rank: 12, routes: Object.freeze([42, 18]), step: 'Function-side MV-CAP: a counter-model surviving explicit σ ≥ 1 L² inputs, or a proof that explicit L² mean values at σ > 1/2 force the local count.', why: 'The latter would make short-interval mean values a genuine partial lane input.' }),
  Object.freeze({ rank: 13, routes: Object.freeze([13]), step: 'Near-Müntz-threshold cones ν_k = k^p (p = 1.1–1.25, K ≥ 200, ≥ 300 digits).', why: 'The only regime of NS-RIGID\'s A6 loophole that could carry new zero information.' }),
  Object.freeze({ rank: 14, routes: Object.freeze([28, 25]), step: 'RH-true / RH-false Selberg control pair (cocompact arithmetic group vs a group with an exceptional eigenvalue).', why: 'Without a control, no blindness statement about the freeze calculus follows.' }),
  Object.freeze({ rank: 15, routes: Object.freeze([39, 41, 11]), step: 'Discharge the explicit-formula hypothesis in Lean (PNT+ Kadiri scaffold) and port the Lean replay format to the Toeplitz–Krein and barrier PSD certificates; close the ln 7–ln 11 tiling patch.', why: 'Moves certified Weil-positivity results toward machine-checked ones.' }),
]);

export const SYNTHESIS_EXTERNAL_REVIEW = Object.freeze([
  Object.freeze({ object: 'Raymond\'s analytic chain G0 (AF Part I/II, Lemmas 2–3, Theorem 4/4′, G0-c, G0-d)', forWhat: 'both Λ values below 0.2 on the Raymond/route-P architecture (0.145276368594868 and 0.116091488672439)', priority: 1 }),
  Object.freeze({ object: 'openai/math 003 Lean proof (Re s > 7/8): official comparator, lean4checker, peer review', forWhat: 'the conditional value 0.116091488672439 and route 43\'s κ(QRH 7/8) = 9/32 application', priority: 2 }),
  Object.freeze({ object: 'route-P ledger: Lemma B, producer layer, Theorem B\'_m (3 bands), Theorem MP, the v4c engine (independent implementation of the bounds), the single-implementation consumer', forWhat: 'the certified route-P values', priority: 3 }),
  Object.freeze({ object: 'patched FLINT Platt lemmas (FLINT_AUDIT_2, single reader) and the Route-2 RH-window driver', forWhat: 'RH-win inputs (routes 5, 6) and route 36\'s certified windows', priority: 4 }),
  Object.freeze({ object: 'route 6 Theorem N / Lemma G; route 8 Theorem B\'_P; route 20 block lemma and gates M1–M4 (feeds route 50)', forWhat: 'framework statements about verified height and hybrids', priority: 5 }),
  Object.freeze({ object: 'structural theorems: route 27 intersection-form identity, route 42 MV-CAP, route 43 witness and G4, route 48 Thm 48.1–48.5, route 13 Pick certificate, route 44 twin construction', forWhat: 'the map results (no Λ change); currently one internal referee pass each', priority: 6 }),
  Object.freeze({ object: 'literature constants: Trudgian 2011/2014 S(T) constants (route 49), Trudgian 2014 S(t) (route 36), Alpöge–Furman preprint (route 16)', forWhat: 'inputs quoted from memory or preprints', priority: 7 }),
]);

const BY_ID = new Map(SYNTHESIS_STATUS_TABLE.map((r) => [r.id, r]));
const count = (f) => SYNTHESIS_STATUS_TABLE.filter(f).length;
export const SYNTHESIS_COUNTS = Object.freeze({
  done: count((r) => r.status === 'done'), partial: count((r) => r.status === 'partial'), blocked: count((r) => r.status === 'blocked'), inProgress: count((r) => r.status === 'in progress'),
  walls: Object.freeze(Object.fromEntries(Object.keys(SYNTHESIS_WALLS).map((w) => [w, count((r) => r.reducesTo.includes(w))]))),
  anyWall: count((r) => r.reducesTo.length > 0),
  newObjects: count((r) => r.newObject !== null),
  classes: Object.freeze(Object.fromEntries(Object.keys(SYNTHESIS_OTHER_CLASSES).map((c) => [c, count((r) => r.cls === c)]))),
});

export const FIFTY_ROUTES_SYNTHESIS = Object.freeze({
  id: 'fifty-routes-synthesis-2026-10-15',
  date: '2026-10-15',
  title: 'Fifty routes: campaign synthesis after batch 10',
  doc: 'formalization/routes/fifty-routes-synthesis-2026-10-15.md',
  headline: 'All 50 routes have result modules: 43 done, 6 partial, 1 in progress (route 1, campaigns running), 0 blocked. Four routes moved a certified '
    + 'route-P value (1, 3, 5, 9; joint best 0.145276368594868 relative to the ledger; Λ < 0.145 not certified). The best conditional value, 0.116091488672439, '
    + 'comes from the 7/8 half-plane start, not from the routes. Most other routes reduced to a known wall (verified height, pointwise information, '
    + 'flow-blindness, RH-equivalence) or to Euler-blindness / route-P method caps; the genuinely new objects are certificates and structural statements '
    + 'graded internal.',
  statusTable: SYNTHESIS_STATUS_TABLE,
  ledger: SYNTHESIS_LAMBDA_LEDGER,
  nextSteps: SYNTHESIS_NEXT_STEPS,
  externalReview: SYNTHESIS_EXTERNAL_REVIEW,
  counts: SYNTHESIS_COUNTS,
  verdict: 'The campaign mapped all fifty routes with one internal referee pass each. The unconditional-on-QRH best is 0.145276368594868 (certified relative to the '
    + 'route-P ledger; dependencies G0, Lemma B, Theorem B\'_m, the v4c engine, PT\'s verified height); the conditional-on-QRH best is 0.116091488672439 (additionally '
    + 'conditional on the openai/math 7/8 half-plane), a conditional value, not a bound. Neither is externally reviewed; the binding premise of both is G0. '
    + 'No route proves RH or a new zero-free region, and the structural results are maps of what each class of input can see. '
    + 'No refereed bound is changed; RH open; NO QED.',
});

const S = FIFTY_ROUTES_SYNTHESIS;

export const FIFTY_ROUTES_SYNTHESIS_ASSERTIONS = Object.freeze([
  {
    id: 'syn-fifty-covered',
    holds: () => SYNTHESIS_STATUS_TABLE.length === 50 && SYNTHESIS_STATUS_TABLE.every((r, i) => r.id === i + 1) && BY_ID.size === 50
      && SYNTHESIS_STATUS_TABLE.every((r) => typeof r.line === 'string' && r.line.length > 40),
    why: 'Every one of the 50 routes appears exactly once, in order, with a one-line result.',
  },
  {
    id: 'syn-statuses-match-roadmap',
    holds: () => RESEARCH_ROUTES.length === 50 && RESEARCH_ROUTES.every((r) => BY_ID.get(r.id).status === r.status && typeof r.resultModule === 'string'
      && r.resultModule.startsWith(`src/data/route-${r.id}-`) && /-2026-10-\d\d\.js$/.test(r.resultModule)),
    why: 'Each route\'s status equals its roadmap status and every route has a route-<id>-*-2026-10-*.js result module in the roadmap.',
  },
  {
    id: 'syn-status-counts',
    holds: () => { const c = S.counts; return c.done === 43 && c.partial === 6 && c.inProgress === 1 && c.blocked === 0 && c.done + c.partial + c.inProgress + c.blocked === 50
      && SYNTHESIS_STATUS_TABLE.filter((r) => r.status === 'partial').map((r) => r.id).join(',') === '10,23,39,40,42,46'; },
    why: '43 done, 6 partial (10, 23, 39, 40, 42, 46), 1 in progress (route 1), 0 blocked.',
  },
  {
    id: 'syn-walls-and-classes-valid',
    holds: () => SYNTHESIS_STATUS_TABLE.every((r) => r.reducesTo.every((w) => w in SYNTHESIS_WALLS) && new Set(r.reducesTo).size === r.reducesTo.length
      && r.cls in SYNTHESIS_OTHER_CLASSES && (r.newObject === null) === (r.grade === null))
      && Object.keys(SYNTHESIS_WALLS).every((w) => S.counts.walls[w] > 0)
      && SYNTHESIS_STATUS_TABLE.filter((r) => r.cls === 'tool').map((r) => r.id).join(',') === '10,39,40,41'
      && SYNTHESIS_STATUS_TABLE.filter((r) => r.cls === 'lambda-lever').map((r) => r.id).join(',') === S.ledger.movedByCampaign.join(','),
    why: 'Wall labels come from {pointwise wall, verified height, flow-blindness, RH-equivalence}, each used at least once; other classes from the legend; every new object carries a grade; the formalisation routes are 10, 39, 40, 41; the Λ levers are exactly routes 1, 3, 5, 9.',
  },
  {
    id: 'syn-ledger-exact',
    holds: () => { const u = S.ledger.unconditionalOnQRH; const c = S.ledger.conditionalOnQRH;
      return dec15(u.exact) === u.dec && dec15(c.exact) === c.dec && cmpQ(c.exact, u.exact) < 0 && cmpQ(u.exact, '145/1000') > 0 && cmpQ(u.exact, '1/5') < 0
        && u.ladder.every((s, i) => i === 0 || Number(s.dec) < Number(u.ladder[i - 1].dec)) && u.ladder[u.ladder.length - 1].dec === u.dec
        && Number(u.ladder[0].dec) < 0.1758354 && /NOT certified/.test(u.notCertified) && /not a bound/.test(c.grade) && /G0/.test(c.dependencies.join(' '))
        && /G0/.test(u.dependencies.join(' ')) && S.ledger.zeroEffect.every((id) => !S.ledger.movedByCampaign.includes(id)); },
    why: '36319092148717/2.5e14 = 0.145276368594868 and 116091488672439/1e15 = 0.116091488672439 exactly; conditional < unconditional-on-QRH; 0.145 < unconditional < 0.2 (Λ < 0.145 not certified); the route-P ladder decreases monotonically; both depend on G0.',
  },
  {
    id: 'syn-next-steps',
    holds: () => SYNTHESIS_NEXT_STEPS.length === 15 && SYNTHESIS_NEXT_STEPS.every((s, i) => s.rank === i + 1 && s.routes.length > 0 && s.routes.every((id) => BY_ID.has(id)) && s.step.length > 30)
      && new Set(SYNTHESIS_NEXT_STEPS.map((s) => s.step)).size === 15 && SYNTHESIS_NEXT_STEPS[0].routes.includes(10)
      && SYNTHESIS_EXTERNAL_REVIEW.length >= 5 && SYNTHESIS_EXTERNAL_REVIEW[0].priority === 1 && /G0/.test(SYNTHESIS_EXTERNAL_REVIEW[0].object),
    why: 'Fifteen distinct ranked next steps, each tied to real routes; G0 external review ranks first; external-review list headed by G0.',
  },
  {
    id: 'syn-honesty',
    holds: () => /refereed bound is changed/i.test(S.verdict) && /NO QED/.test(S.verdict) && /not a bound/.test(S.verdict)
      && !SYNTHESIS_STATUS_TABLE.some((r) => /\b(proves RH|RH proved|QED)\b/.test(r.line)) && S.ledger.accepted.value === '0.2',
    why: 'Verdict keeps PT Λ ≤ 0.2 as the benchmark, calls the 7/8 value conditional (not a bound) and claims no QED; no route line claims RH.',
  },
]);

export default FIFTY_ROUTES_SYNTHESIS;
