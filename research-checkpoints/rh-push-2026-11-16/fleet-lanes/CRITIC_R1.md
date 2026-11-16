# Critic report, round 1 (2026-11-16)

Inputs read: BRIEF.md; the 24-row round-1 ledger with referee outcomes; verdict sections of the seven outside
agents (tro6-spectral, tro6-sieve, bypass-78, bootstrap, weil-onesided, ff-transplant, pick-induction; none has a
REFEREE.md); verdict lines of the b-* and g-* lanes and SYNTHESIS_GEOMETRIC.md. euler/RESULT.md was opened for
its header only; its content is taken from the brief's one-line summary.

Headline: no bound moved unconditionally. 0 of 24 ledger rows proves eta > 0, a lower abscissa, or a new
zero statement. 11 of 24 referee reports found at least one failed PROVED step. One number moved conditionally:
Lambda <= 0.116060107834762 (fixed-mode replay, conditional on the unrefereed 0.874886647 half-plane).

## 1. Ranking by real promise (after referee discounts)

Tier A: can move a number or become a theorem about the binding object.

1. lambda-from-halfplane. Only row that changes a number. Replay value independently reproduced in exact
   rationals. The referee broke the 13.34 "ceiling" (P4): it bounds only triangle-inequality floors, so the
   headroom above the F2 start rate 11.01 is not capped by anything proved. The LP measured t = 0 only, while
   almost all 59439 substeps are at t > 0. Discount: the estimated 0.002-0.006 gain is heuristic; the
   re-optimised run was mis-configured and never redone.
2. TRO6 polar/diagonal cluster (tro6-spectral section 3, tro6-numerics item 2, tro6-period Lemma L,
   tro6-shifted-conv referee's Poisson reduction, tro6-sieve Prop S). Three agents measured the same object
   independently: twisted first moments of the theta coefficients against chi_c carry a coherent term with phase
   gamma_1(c) conj chi_c(-e0). Amplitudes agree: spectral predicts N(c)^{-1/3} and measures -0.28..-0.30;
   numerics measures |S|^2 ~ N(c)^{-0.60}, i.e. -0.30. This is a zero-independent law that looks provable
   (residue of a twisted Kubota series). Discounts: the spectral derivation is HEURISTIC and unrefereed; numerics
   E1 shows the resonant class is sigma'(c), not class(c), on rows prime to 6; period Cor L' has the wrong weight
   (alpha^2 G nu, G not multiplicative). Proving the law does not lower theta; it isolates the non-polar remainder
   as the whole of TRO6.
3. zf-hecke-all-fields + bypass-78 price list. Refereed and exact: B_flat is the infimum of the method, and the
   only inputs that move it are counts at the critical class (dB/dtau = -0.138 per count saving U^-tau; price
   list: uniform saving 1/120 gives 0.87374) and TRO6. A count is a mean-value statement that the method
   consumes, so MV-CAP does not block it. Discount: everything is relative to the unrefereed Liu II Lemma 14.10;
   no saving is in hand.

Tier B: real but narrow, or high payoff at low probability.

4. zf-higher-rows after refutation of Theorem 4(ii). The referee's counterexample (conjugate-paired order-4 rows
   with diagonal density of order 2) is a new object the note wrongly excluded, and the obstruction for r = 3, 4, 5
   is exactly the unproved dual exponent a (MODEL values 0.743 / 0.810 / 0.849 at a = 2). Low probability, large
   payoff; everything is a 6->r transplant.
5. tro6-functionfield. Lemma G, Theorems 1 and 2 are exact and confirmed at q = 13. The headline "FF TRO6 is true"
   did not survive (squarefree-moduli localisation false, even blocks excluded, range N <= d). A complete proof in
   the model would show which input a number-field proof needs.
6. zf-audit-inputs. Holds. Concrete gap: Lean plain moment needs kappa >= 3/4; Xu-Sang stage 1 has no Lean base.
   Xu-Sang Prop 3.1 for l > 1/6 and Appendices B, C, E, F are unverified, and the 0.874886647 value rests on them.
7. zf-large-values. Holds after repair. One live window: coefficient-specific Guth-Maynard on the inverse witness
   at lengths 0.7605 < n < 0.8927 in the Xu-Sang system; its reduction to TRO6 is asserted only.
8. weil-onesided Theorem F (unrefereed): unconditional positivity of Q_L on products of exponentials, all orders.
   If it holds it is the largest explicit unconditional sub-cone on record; likely Euler-blind (kernel positivity),
   not checked for DH. Composes with dh-separator Theorem C and screw-canonical Lemma 2.
9. pick-induction (unrefereed): DH fails real-Pick positivity at order 149 (Arb-certified at one node); levels
   1-5 gates carry no Euler content; Theorem R rules out proofs from Lambda >= 0 alone. Open and concrete: where
   between level 6 and 146 the Euler product enters.

Tier C: closed; correct restatements that move nothing. Do not rerun.

dh-separator (positivity region = zero-free region, order 1), screw-canonical (obstruction narrowed to
single-coefficient windows; collapse rate unproved), ff-transplant, cc-latest, nyman-baez-duarte (f(theta) = theta),
bootstrap (no contraction map), vertical-statistics, li-coefficients (verified-height corollary; Coffey 2005 may
already cover it), jensen-hyperbolicity (Chasse criterion; factor 16/9), twist-rigidity, sym-power-positivity
(obstruction real after three repairs), mollifier-halfplane, support-rigidity (silent RH in "W > 0 unconditional"),
flow-euler-defect (O2 and O3 both false as stated), tro6-shifted-conv (ledger correct; Lemma N bulk only),
tro6-sieve Prop L, bypass-78 (term-free design is worse: 0.87524).

ideation-panel: Angle 1 necessary condition holds, converse open, referee sees no way round; Angle 3 Lemma 3.2
proved for N = 3 only; Angle 5 untested and cheap. The T-NR twin (Euler product + functional equation + off-line
zeros) is a stronger control than DH and no sibling used it.

## 2. Combinations

C1. Polar law as a theorem: Lemma L (period) + polar law P (spectral) + measured phase/amplitude (numerics) +
    Prop S range D < Q^{1/2} (sieve). Output: sum_m rho(m) chi_c(m) W = K u_c N(c)^{-1/3} Q^{5/6} + R(c), explicit
    K and class map sigma'(c); then TRO6-natural = [Moebius sum = 1/L(5/6+t, eta)] + sum_c mu(c)... R(c).
C2. Non-polar remainder = (PS-U): the shifted-conv referee's Poisson-in-mu reduction says (PS-U) is a power saving
    for twisted first moments. With C1 the polar part is removed exactly, so (PS-U) becomes a statement about R(c)
    alone, testable numerically at manuscript scale R = Q^{1.4} (not sampled by anyone).
C3. Count saving at the critical class: hecke-all-fields price (-0.138 tau) + spectral section 7 Bessel/Halasz
    averaged form + large-values window (n in 0.76-0.89). A density bound for sextic twists near real part 0.7347
    below U^{0.590} lowers B_flat directly.
C4. Lambda: referee's broken ceiling + t > 0 LP + range-split floors + a correct re-optimised consumer run.
C5. Unconditional cone: weil-onesided Theorem F + dh-separator Theorem C (complex rates on the VK region) +
    screw-canonical window lemma: how much of the one-sided cone is covered unconditionally, and whether DH's
    order-149 failure vector lies outside that cover.
C6. zf-higher-rows nu-involution + tro6-period Lemma L are the same Gauss-sum identity mu(pi) g(chi) ~
    g(chi rho); the "same 6-fold object" claim was not proved in either note. Folded into C1.

## 3. Missing

- No referee on the seven outside agents; weil-onesided Theorem F, pick-induction Theorem R and the order-149
  certificate, tro6-spectral S and tro6-sieve Lemma R / Prop S carry weight above.
- Xu-Sang low estimate (l > 1/6), Appendices B, C, E, F; Raymond W, FC, CE and tables J, K: unverified. The value
  0.874886647 and both conditional Lambda numbers depend on them. Liu II Lemma 14.10 not replayed in intervals.
- Hybrid target-row mean value (sum over targets inside the remainder): open and unpriced.
- TRO6 numerics at manuscript geometry (R = Q^{1.4}, target-twisted rows, A = c n^3): never sampled; item 3 of
  tro6-numerics (eta = 0 vs eta = 1) is unresolved for that reason.
- Lambda LP at t > 0; signed kernels with certified domination; re-optimised run at the new theta.
- Dual exponent a for Gauss sums of order 4, 5 (mean square over h; fields without mu_2n).
- Full leanchecker replay (8 of 2924 modules done); faithfulness of the OAI Hecke L-function definition.
- Angles not run: ideation 4-12; log-derivative defect along the flow; multi-piece mollifiers.
- T-NR twin not applied as a control anywhere.
- Literature: Coffey math-ph/0507042 (Li range), Chasse (Jensen), Burnol / de Roton (Nyman rate) before any
  novelty statement.

## 4. Round-2 tasks (full text in the structured output)

| slug | type | source |
|---|---|---|
| r2-lambda-reopt-run | deepen | lambda-from-halfplane |
| r2-lambda-tpos-floors | repair + deepen | lambda-from-halfplane referee (1),(2) |
| r2-tro6-polar-theorem | compose C1 | spectral + numerics + period |
| r2-tro6-nonpolar-scale | compose C2 | numerics + shifted-conv, motherbox |
| r2-tro6-type12-split | repair + deepen | tro6-period referee |
| r2-ff-tro6-complete | repair | tro6-functionfield referee |
| r2-zf-critical-density | compose C3 | hecke-all-fields + spectral section 7 |
| r2-zf-gm-inverse-witness | deepen | zf-large-values referee item 5 |
| r2-zf-paired-rows | repair + new | zf-higher-rows referee |
| r2-lean-kappa-1318 | repair | zf-audit-inputs |
| r2-xs-lowestimate-audit | verify | zf-audit-inputs open list |
| r2-lowpass-cone | referee + compose C5 | weil-onesided F + dh-separator + screw |
| r2-pick-euler-entry | referee + deepen | pick-induction |
| r2-classgroup-homotopy | new angle | ideation Angle 5 + T-NR control |

Capacity: 14 agents fit the project's 100 GB local budget (about 2 GB each); motherbox tasks stay within the
brief's 8-core / 20 GB cap per agent.
