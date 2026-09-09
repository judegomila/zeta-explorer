# Aristotle / Lean formalization target ledger

Ranked (value × feasibility) list of formalizable targets across the project,
compiled 2026-08-28 by a corpus-wide scout. E = exact/unconditional statement;
C = conditional implication (machine-check the logic; antecedent stays open).

**In flight (wave 1, submitted 2026-08-27 via the dbn audit session pipeline;
projects ba4468a2, cc9ccae7, 7f037bfe, a9a5af2e, db03b70f — DELIVERED 2026-08-28 to
lean-aristotle/permutation-calculus/: all five kernel-verified (lake build green,
zero sorry/axiom, three standard axioms only) and rated FAITHFUL by the
independent review):** permutation-defect
lemma · anti-Hermitian strip bound · five-shell identity E97 · §4.7 implication
chain (consuming the kernel-verified rectangle argument principle, audit-repo
PR #30) · twistor Lemma 6.1. Already verified: the frozen-rung set
(lean-aristotle/frozen-rung/), the DBN base case, RealRootedPreservation.lean.

## Waves 2–3 — DELIVERED 2026-08-28 (nine dirs at lean-aristotle/ +
WAVES_2_3_README.md; all builds green, zero nonstandard axioms; 8× FAITHFUL +
1× MINOR DRIFT: burgers IsHeatFlow is global-in-s, disclosed — carry that
caveat on any app quote). Per-target verdicts in the README. Action items:
newton_inequality port to erase the probe sorry (in progress);
maxmodulus_growth corollary name-collision (rename before landing beside
EntireOrderEquiv.lean:286). #10 ramanujan_reversal (4d99dee9) DELIVERED +
FAITHFUL, all gates green: ALL FOUR theorems for all n, R_n(1)=n^{n−1} proved
FROM SCRATCH (AbelIdentity.lean + TreeSeries.lean — reusable theory mathlib
lacks). BOTH imp-35068 conjectures (row sum, subleading) are now unconditional
theorems; modules updated. Proof direction inverted vs the sketch here:
corollary_1 direct from the tree series, theorem_2 via reversal. Waves 2–3:
10/10 delivered, 10/10 kernel-verified, 9 FAITHFUL + 1 MINOR DRIFT (burgers,
disclosed). newton sorry ERASED from the probe (ported, audit clean). #7/#8/#11/#12/#15 still held. Original submission ids:
wave 3: gilbreath_package d8e586ff, r1fn_sharp_cap 60cbaeb3, isolation_onset
78f6557d, maxmodulus_growth 7a400632. Wave 2 ids: newton_inequality
05cc5d33, crossover_sign_induction 054f776f, theta_trap a8f6f09a,
heat_discriminant_ode 9c625fea, burgers_heat c397b9d1 — with the drafting-pass
corrections noted per-target below)

1. **`newton_inequality` sorry** (E, low) — CORRECTED SHAPE (drafting pass): the
   actual sorried statement is the normalized-coefficient log-concavity form
   (p.coeff k / choose k)² ≥ product of neighbours, NOT literal e_k² ≥ e_{k−1}e_{k+1};
   the submitted job targets the verbatim signature at HeatCorollaries.lean:191 so it
   can drop-in replace the sorry. The naive "iterated differentiation + discriminant"
   route is incomplete as worded (needs a degree-lowering device, e.g. reversal, not
   banked) — proof route left to Aristotle.
2. **Θ-trap core package** (E, med) — dg/ds = −(4/g)(1−Θ) exact; dΘ/ds identity;
   Theorem A (Θ≤1/4 invariant, sharp); Corollary E1 t_c ≤ g²/(8(1−Θ*)) (A1 is the
   Θ*=1/4 case, g²/6). PACKAGING NOTE (drafting pass): flow existence/C¹/no-collision
   and E1's absolute continuity were silent in the sources — now explicit named
   hypotheses; A1's adjacency-persistence is a hypothesis in all but name (imp-3049/
   3277 only measure it); nothing is claimed for Θ* persistence on (0.443, 0.5073)
   per the source's own refutation band.
   src/data/sg1-theta-contraction.js + sg1c-theta-trap-theorems.js (proofs in source).
3. **Heat-discriminant ODE S4-1/S4-2** (E, low-med) — d/ds log Disc = −8Σ 1/(x_i−x_j)²
   + the vanishing symmetric triple-sum lemma. imp-2563-discriminant-tc-characterization.js (QED in source).
4. **Exact finite-N Burgers/heat identity** (E, low-med) — SIGN NOTE (drafting pass):
   M(z,s) = Σ_k 1/(x_k(s)−z) = −P′/P (NOT +P′/P; the PDE ∂_s M = ∂_z²M − 2M∂_zM is not
   invariant under M ↦ −M — with +P′/P the nonlinear term flips sign). Monic P satisfies
   the forward heat equation ⇒ finite Taylor sum; signs per ENTIRE_ROADMAP §3 e^{−tD²}.
   Bridges to RealRootedPreservation heatOp.
5. **Crossover all-orders sign induction imp-34880** (E, low) — P_{n+1} = nuP_n+(2n−1)P_n−uP_n′,
   positivity via multiplier (2n−1−k) ≥ n; boundary forms (n−1)!, (2n−3)!!. Prose QED in source,
   never machine-executed (numerics double-inexact past n=15). SCOPE (drafting pass): the
   submitted job covers the polynomial-family package only (the source's rigorous H2 part);
   the surrogate-map H1 derivation is excluded per the source's own NO-QED scope note.
6. **Lemma R1-FN sharp excursion cap** (E, low-med) — Θ ≤ 1−2/N sharp, exact Θ_max(N),
   balanced-lattice maximiser. sg1c-theta-trap-theorems.js:844 (full static proof).
7. **Min-gap sandwich Theorem B + s=0 β-discharge** (C, med-high) — two-sided t_c pinch
   under βg²<2; the s=0 telescoping bound is exact. Isolates the open imp-2683 residual.
8. **Theorem B sharp trap threshold (√73−5)/8** (E, med) — capped-greedy Schur-convex
   majorization + one-variable boundary algebra; sharp.
9. **Isolation-onset closed forms** (E, low-med) — R2-T sign law; c* = √(2+√3)−1 as the
   unique (0,1) root via u = ρ²+2ρ ⇒ u²−2u−2 = 0. (Class theorem; c_glob stays open.)
10. **Ramanujan-reversal identity imp-35068** (E, low-med) — P_n(u) = u^{n−1}R_n(1/u) for all n
    (currently numeric n≤12); corollary row sum P_n(1) = n^{n−1} (Cayley). NOTE (drafting pass):
    the row-sum corollary needs R_n(1) = n^{n−1} (classical Shor/Zeng, cited-not-proved in-repo) —
    if Aristotle proves it, bonus theorem; if hypothesized, the corollary is CONDITIONAL on it.
    Upgrades an identification to a theorem + closes the unproved row-sum conjecture.
11. **Jet-lemma corollary** (E, low-med) — e^{−sD²}x^{2m} = scaled Hermite (2m simple real
    roots, s>0; none s<0); mostly free from HeatCorollaries hermiteReal results.
12. **Flow-blindness SL2 no-go package** (C on Rodgers–Tao, med-high) — soft-class closure of
    Φ_ε + cosine-transform = H_{−ε} identity; RT as named hypothesis (hRT pattern exists).
13. **`MaxModulusGrowthFromOrder` discharge** (E, low) — CORRECTED (drafting pass, source
    wins): the actual def at EntireOrderEquiv.lean:185 is STRICT order < σ ⇒ eventually
    M_f(R) ≤ exp(R^σ) (no ε); job 7a400632 targets the verbatim def. Makes
    coefficientOrder_le_order unconditional.
14. **Gilbreath lemma package** (E, low) — mod-2 binomial-transform lemma + row propagation +
    finite lock certificate. src/math/gilbreath.js (complete proofs in source).
15. **Shear-Gram norm identity imp-3343** (E, low-med) — ‖G‖_HS = √2‖G‖_op for rank-2
    antisymmetric + Volterra half-mass ⇒ ‖V‖_HS = ‖G‖_op (state finite-dimensionally).

## Do not attempt (per formalization triage)
Jensen/Hadamard/argument-principle-from-scratch (superseded by the verified rectangle
argument principle), H5′ heatOp approx (needs full Hadamard stack; naive route provably
dead per HeatFlowCounterexample.lean:191), Ξ/H_t construction, Rodgers–Tao Λ≥0 itself,
de Bruijn Thm 13 itself, Koksma–Hlawka (absent from mathlib, heavy).

## Repo flags raised by the scout (fixed alongside this ledger)
- imp-35068's `isRigorous: true` means exact-integer-arithmetic n≤12, NOT all-n — clarified in-module.
- POLYNOMIAL_DE_BRUIJN.md:88 wrote the flow as forward convolution Ξ∗G_t; ENTIRE_ROADMAP.md:108
  and imp-34813 fix the sign — corrected to the ENTIRE_ROADMAP convention.

## Wave 4 — SUBMITTED 2026-08-28 (six jobs; poller armed)
- entirelp_sorry 8e391235 — BONUS: ATTEMPTED / OUT_OF_BUDGET (the first quota
  event in 31 jobs; per-job compute budget on a genuinely deep analytic target
  — locally-uniform approximation with heat-flow control — not account
  exhaustion; the five simultaneous siblings completed fine). NOT retried
  pending the user's call: (a) retry as-is, (b) split into stages (polynomial
  approximant for IsLaguerrePolya via Hadamard factorization first, then the
  heat-flow transfer), or (c) park — the probe keeps its one sorry. Target was
  the verbatim exists_heatOp_approx_tendsto at EntireLP.lean:328-334, drafted
  with the false-former-axiom counterexample F_n = (n!/(2n)!)z^{2n} as a
  warning (generic approximants fail; order/type control mandatory).
- mingap_sandwich 2dd89653 (#7) — imp-2563 wording wins on the h_β
  sup-over-all-pairs question; residual imp-2683-sub-punctured named, left open.
- trap_threshold 675c3e09 (#8) — exact (√73−5)/8 and (√73−7)/4; DRAFTING-PASS
  CATCH: the static inequality corrected to NON-strict (equality at S=1/2 and
  S=2Θ_b); consumes the delivered theta_trap interfaces.
- jet_lemma 6e628722 (#11) — banked hermiteReal results cited verbatim;
  simplicity + the s<0 half flagged as NOT covered by them.
- flow_blindness db607b47 (#12) — hRT packaging mirrored verbatim from
  MathlibBridge:126-172; Rodgers–Tao stays a hypothesis per the triage.
- shear_gram 4a97dec3 (#15) — finite-dimensional per the ledger; the op-norm
  spelling flagged as the load-bearing mathlib choice.
No ledger-vs-source overrides needed in jobs 26-30. CLOSE-OUT 2026-09-01:
wave 4 DELIVERED — 15/15 ledger targets delivered and kernel-verified, ALL
FAITHFUL (jet_lemma proved BOTH not-banked pieces from scratch: s<0 strict
positivity + root simplicity via IVT interlacing; flow_blindness formalizes
the program's headline no-go with hRT as a variable, project axiom-free).
Packaging notes: jobs 26/27 re-declare IsCMFlow locally (identical to
theta_trap's — unify when landing); job29 generalizes the source axiom H to a
variable. PROGRAM TALLY: 31 jobs, 30 delivered kernel-verified, 1
budget-parked (the entirelp bonus — user's retry/split/park call pending).

## Wave 5 — SUBMITTED 2026-09-02 (imp-95024)
- weld_cc_rm 6a923863 — the weld chain's newest load-bearing lemmas under
  their SOURCE names: Lemma PF (exact partial-fraction closed form; stretch),
  Lemma CC (separation/layer-cake monotonicity; +s>1/2 Fubini hypothesis),
  Lemma RM (width-ratio monotonicity; +domination hypothesis). Exact
  constants; Y*(s)=(2s-1)^{1/(s-1)}-1; 0.3558821066938467 as cross-check only.
  DRAFTING-PASS CATCH #13: the ticket had mis-named PF as CC.
- l2_detection_modulus 0f641447 — the L2 detection-modulus conditional theorem
  composing against Kernels.lean (modulus_witness,
  one_le_negIndex_gram_of_modulus_gt_one); (ZR) a named hypothesis. Success
  plugs into the frozen-rung⟺PT chain. DRAFTING-PASS CATCH #14: the queued
  λ_min(G) < −η mesh-refinement route is the margin route the paper itself
  REFUTES (faint ghosts / mesh-blind) — forbidden in the job.
Poller armed; OUT_OF_BUDGET now a terminal state in the pipeline vocabulary.

## Archive recovery (2026-09-09)
References [17]-[19] of the permutation paper pin strict_sub014_extension_v1/
to "the companion source archive" of the paper itself, with SHA-256 digests
for two supplement files. Exhaustive machine hunt (Spotlight name+content on
the digests, all Downloads archives, GitHub releases across the research
repos): the companion archive was NEVER DOWNLOADED to this machine — the
Aug-25 download session took only the PDF (the same-minute
lambda-015-clean-proof-package is the separate 0.15 campaign). Recovery
requires the originating ChatGPT session to re-export the companion archive
(or strict_sub014_extension_v1's conventions). MEANWHILE the paper's own
§12.1 G1-G5 stop/go program provides an ARCHIVE-FREE path: G1 (source-closed
25-term evaluator verified against the telescope — our Lane-A scanner already
satisfies this to ~1e-14) + G3 (prove the complete N=690988 window FIRST and
test the stronger pilot Σ|D_j| < R_ex; pilot failure = stop signal, not
disproof). The G3 lane is launched 2026-09-09.
