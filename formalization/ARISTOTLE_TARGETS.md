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

## 2026-09-09 — the day's verdicts
- REFEREE PASS (continuations 20–52, three lenses): ALL SOUND-WITH-CAVEATS,
  zero refutations across the ~50-theorem stretch. Load-bearing caveats:
  THEOREM VX's final-strip closure rests on one baked 872M-cell offline run
  with worst margin 1.66e-12 ~ the float-guard scale (directed-rounding re-run
  of the worst cells queued); the chain-wide float-branch-and-bound convention
  is disclosed but its nudge-domination assumption is unproved; lemma-name
  collisions (SA/GA/PD/MC each name 2-3 objects) are a bookkeeping hazard;
  imp-95164's width-monotonicity is measured-only; the class sandwich
  [0.2320723, 0.24502] is a MODEL-FAMILY constant (no arithmetic transfer
  claimed). imp-95169's WP margin over-rounding fixed (3.09e-4 -> 3.086e-4);
  the throwing fable WIP imp-95171 quarantined to .wip.
- G3 FIRST-WINDOW PILOT (archive-free): VERDICT (a) — the STRONGER pilot
  passes on the complete N=690988 window: sup Σ|D_j| = 0.2437541384450471
  < R_ex (margin 12.8%); sup |E97| = 0.1934424506064475 (margin 30.8%);
  telescope verified to 8e-14 over 612,290 dd evaluations + mpmath audit to
  1e-79 at 166/199/265 bits. Sampled sup, not continuum (zoom raised it 2.2%
  — certification needs the G4/G5 interval lane). Under OUR G1 convention;
  the paper's anchor literal remains unreplayable (provenance gap unchanged).
- T-P1: the 0.1399 tail lane K2-KILLED (N1* = 220,495,706, 4.01x the economic
  line; Arb 320/512-bit, exact integer boundary). SPLIT-COLLAR: 0.139981915
  ELIMINATED twice over (sealed minima live on the 0.1787854 face; at the 0.14
  row's own t* the lemma fails O(1)); SALVAGE found — a days-scale
  delivered-face y-thaw to 0.17759432 (shadow-positive across the stretch,
  ~12 CPU-hr sharp-weight re-sweep). FRAMING (audit-session): under the freeze
  this is a NEW candidate package at 0.17759432 citing the sealed 0.1787854 as
  its base (the 0.1782354 lower-time-extension precedent), landing in a new
  lane — never on the sealed repo. ORDERING: the sharp-weight native-binding
  NOTE (the theorem-level piece) is drafted FIRST; the sweep is only its
  certificate. User's call to fire.

## Wave 5 delivery (2026-09-09)
- l2_detection_modulus (job32, 0f641447) DELIVERED: build green, zero
  nonstandard axioms, faithfulness MINOR (faithful in substance; five
  disclosed non-material deviations: mesh ρ₀/2 conservative, strip widened to
  |Re|≤2, extra hT: 1≤T, restatement-vs-import packaging). The composition
  endpoint is REAL: the re-supplied Inertia/Kernels interfaces diffed
  statement-identical to the banked frozen-rung originals, and
  one_le_negIndex_gram_of_detection concludes by DIRECT INVOCATION of the
  banked theorem. Target 1 UNCONDITIONAL (detection_radius_robust, paper's
  exact radius, puncture dropped — stronger than briefed); Target 2
  CONDITIONAL on the named ZeroRepulsion structure only (grep-verified; λ_min
  route absent + disclaimed). THE FROZEN-RUNG⟺PT PROMOTION NOW RESTS ON
  EXACTLY ONE NAMED HYPOTHESIS: (ZR). Landing note: swap the re-supplied
  interfaces for imports of the originals (diff says drop-in).
- weld_cc_rm (job31, 6a923863) OUT_OF_BUDGET — second budget event; parked
  like entirelp pending the user. Natural split: three single-lemma jobs
  (PF / CC / RM).

## Wave 6 (2026-09-10, sequential through the single-slot throttle)
job34 heat transfer (entirelp stage 1) → job38 sharp_mass_monotonicity (the
y-thaw O1 theorem: gates G1–G4, per-cell hull form over 3^|P| divisor-pattern
cells; success reduces O1 to a producer run) → weld PF / CC / RM singles.

## 2026-09-14 — ROUTE VII COST CURVE (imp-95218): the program's floor, derived
N1*(t,y) is EXPONENTIAL in 1/t — derived from the tail architecture, not fit
(ln N1* = (2·1.221852 − y)/t + 1.1676, constant to 1.6% across the two Arb
points despite 57x in N1*; unconditional SC3 floor ln N1* > 2/t). Halving U
squares the row count; technology moves prefactors (<= 1.59e6x), never the
exponent; verified height shares the same logarithm (3.3e5x more height buys
U 0.150 -> 0.135 only). CITABLE NO-GO: the diagonal t↓0 family — the only
path from the quantitative machinery to Λ ≤ 0 — is COMPUTE-BLOCKED below
U ≈ 0.14–0.15. Reachable floor of the whole program under current
mechanisms: U ≈ 0.150 (t ≈ 0.137, y = 0.165), stretch 0.145 with unpriced
K3 slab risk. Below that requires a NEW TAIL MECHANISM breaking the
σ−1/2 = (t/2)ln N heat-lift coupling — i.e. arithmetic input, consistent
with flow-blindness and the T3⟺strip dictionary. Falsifiable side-prediction:
the 0.14-row tail repriced through THIS architecture gives N1* ≈ 2.85e8
(the paper's own contract shell, closed in its separate scope, is unaffected).

---

## Defective-target discovery (2026-09-18) — a pipeline first

The parked `entirelp` sorry (`formalization/lean-mathlib-probe/EntireLP.lean`,
`exists_heatOp_approx_tendsto`) was found FALSE AS STATED, not merely unproven —
the first time the pipeline found a *target statement itself* defective.

- **Refutation (kernel-verified, wave 5 / jobs 33+39):** for the full Laguerre–Pólya
  class the intended (everywhere-`Summable`) reading is false — the Gaussian
  `f = exp(−(c z)²) ∈ LP` has heat coefficients `~c^{2k}(2k)!/k!` admitting no summable
  majorant for any `t > 0` (`c = √(1/t)`). Package `lp_retirement/`:
  `Probe.not_exists_heatOp_approx_tendsto_full_LP` (capstone),
  `Probe.not_forall_exists_LP_approx_heatMajorized(_of_pos)`,
  `Probe.not_exists_heatMajorized_gaussianScaled`.
- **Faithfulness (two rounds):** round 1 caught MATERIAL vocabulary drift in two
  reconstructed defs (HasOnlyRealRoots complex-root definiens ≠ probe root-count form
  at P=0; IsLaguerrePolya dropped the conjugation clause) → a refutation in drifted
  vocabulary is non-quotable. Round 2 on the repaired probe-vocabulary package:
  VERIFIED-FAITHFUL (Probe defs byte/character-identical; capstone diffs mechanically
  to the sorried statement; non-vacuity confirmed; 40 decls on 3 standard axioms).
- **Scope (locked wording):** RETIRED AS FALSE in its intended reading; the literal
  mathlib-tsum-junk-semantics variant is vacuously degenerate and left OPEN; both
  superseded by the order-≤1 (finite-type) restatement — all `ξ` / `H_t` need
  (job40, pending). The probe `sorry` is retained ONLY to keep the leaf consumer
  `heat_preserves_LP_entire` building until it is re-based on the restatement.
- **Pipeline rules banked:** (a) never let Aristotle reconstruct a definition from
  prose — supply external vocabulary verbatim in the brief (heatFlow, quoted verbatim,
  came back character-exact; the two paraphrased defs drifted); (b) axcheck generation
  needs wrap-proof parsing + comment-aware name extraction + a theorem-count invariant
  vs the source grep (a suffix-anchor bug had silently dropped the two refutation
  theorems from an earlier audit, caught only by a 31-vs-33 count regression).

No Λ / RH consequence. Platt–Trudgian Λ ≤ 0.2 stands; RH open. NO QED.

### Arc closed (2026-09-18) — the order-≤1 replacement, composed and kernel-verified

The defective target is now fully resolved, housed at v4.28 (the in-repo probe is v4.22
and cannot import the v4.28 proof; the consumer `heat_preserves_LP_entire` lives only there).

- **job40 (order-≤1 stage-1), VERIFIED-FAITHFUL:** `Probe.exists_LP_approx_heatMajorized_order_le_one`
  — for `f ∈ LP` with `‖f z‖ ≤ A·exp(B‖z‖)` (order ≤ 1, finite type), real-rooted heat-majorized
  approximants exist for ALL `t ≥ 0`. Proved from scratch (truncation operator: reverse →
  iterate-derivative → reverse → rescale; coefficient weights in [0,1] with `1−wgt ≤ j²/m`; Cauchy
  estimates give the summable majorant `u_k = C_r(t(eB)²)^k/k!`), sidestepping both flagged mathlib
  gaps (no Hadamard, no Pólya–Schur).
- **Composition (entirelp_splice428/), VERIFIED-FAITHFUL, build green:**
  `EntireLP.heat_preserves_LP_entire_of_growth` = the probe's `heat_preserves_LP_entire`
  (EntireLP.lean) with EXACTLY one added `hgrowth` hypothesis, byte-identical vocabulary,
  discharge chain fully unconditional. 8034 build jobs; 98 thms + 19 defs on the three standard
  axioms; non-vacuity witnessed at `f = id`. Consolidates job34's base + job40's construction +
  an upward port of RealRootedPreservation.lean (byte-identical statements, 4 API-rename deltas,
  diff-verified) + the probe's `real_symm_of_tendsto`/`toEntire_conj`.
- **Final probe-tree state:** every statement is kernel-PROVED, kernel-REFUTED, or explicitly OPEN.
  The v4.22 probe retains one `sorryAx` — the explicitly-open literal tsum-junk variant — which
  cannot be removed there only because the tree cannot import the v4.28 proof; the resolved content
  (refutation of the intended reading + the true restricted theorem) is kernel-verified at v4.28.

Two-gate discipline (kernel + faithfulness) held throughout: it caught the defective target, a
silent axcheck-masking bug, and THREE rounds of definition vocabulary drift before anything was
quoted. No Λ / RH consequence — Platt–Trudgian Λ ≤ 0.2 stands; RH open. NO QED.
