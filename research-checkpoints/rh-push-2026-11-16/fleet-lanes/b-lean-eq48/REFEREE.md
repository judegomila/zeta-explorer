# Referee report on b-lean-eq48/RESULT.md

Date: 2026-11-16. Scratch work (rebuild, audit file, numerics) is in `/tmp/ref-b-lean-eq48-59946`, outside the repo.
Nothing in the slug directory other than this file was written; the probe sandbox was not modified.

## Verdict

**HOLDS.** Every statement labelled PROVED (Lean) was reproduced by an independent rebuild. No
mathematical error found. Four wording corrections, none affecting a theorem. The result is a
formal verification of an equivalence; it carries no information on zeros and claims none.

## What was re-run

1. **Independent rebuild.** The 7 files were copied to a scratch directory and compiled against
   `formalization/lean-mathlib-probe` (lean-toolchain `v4.22.0`, manifest Mathlib `v4.22.0`,
   `git status` clean for that directory). 0 errors, 0 warnings. All 29 `#print axioms` lines
   return `[propext, Classical.choice, Quot.sound]`. Line count 1612 confirmed. No `sorry`,
   `axiom`, `set_option`, `native_decide`, `unsafe`, `macro`, `notation`, `opaque` in the sources.
2. **Statement pinning (my own file `RefAudit.lean`, compiles).**
   - `xi_theorem2` restated with `pick`, `defect`, `border`, `Nodes`, `ResidualTarget`,
     `FullClass` unfolded by hand to raw Mathlib terms: accepted by `exact Eq48.xi_theorem2`.
   - `Lxi x = Re( deriv xi (1/2+x) / (s(s-1)/2 * completedRiemannZeta s) )` by `rfl`.
   - `PosSemidef` / `PosDef` are `IsHermitian ∧ ∀ x, 0 ≤ xᵀMx` (resp. `x ≠ 0 → 0 <`) by `Iff.rfl`.
   - `ResidualTarget Lxi (Ioi 1/2) → ∀ y > 1/2, 0 ≤ Lxi y` proved: the empty-node instance is a real
     extra conjunct, as RESULT.md says.
   - Extra axiom audits (`fullClass_of_residualTarget`, `Lxi_bounds`, `logDeriv_xi_eq`,
     `residualTarget_of_hadamardOnLine`, ...) clean. `RiemannHypothesis` is Mathlib's definition.
3. **Hand re-derivation.** Schur step (block form, `fromBlocks₁₁`, `det_fromBlocks₁₁`); (a)=>(b)
   induction (openness of "not PSD", perturb only the first n coordinates, PSD + det ≠ 0 => PD);
   Lemma B (|p_i| ≤ K q with q = L(y)/y, |pᵀBp| ≤ S K² q², so Δ ≥ q(1 − S K² q) > 0 for large y;
   identity theorem on the connected ray; det = det·Δ); Lemma A decomposition
   xi'/xi = 1/s + 1/(s−1) − (log π)/2 + ψ(s/2)/2 + ζ'/ζ and the convexity bounds
   log(u−1) ≤ ψ(u) ≤ log u. All correct.
4. **Exact-rational check, different cases** (`chk_exact.py`, Python fractions, no floats decide
   anything): 19087 random configurations (on-line sums, arbitrary values, mixed off-line pair;
   n = 1,2,3 plus one node). `det P_{T+y} = det P_T·Δ` and `bᵀ P b = Δ` in all; in the 14443 with
   P_T PD, PSD <=> Δ ≥ 0 and PD <=> Δ > 0 in all (888 cases with Δ = 0 exactly, so the PSD/PD split
   is exercised). gapL: det P₂ = 0, form at (1,−1,−1/20) = −1/600, det P₃ = −1/400. M3: det −4, all
   2x2 principal minors 0. Off-line toy: det < 0 at three other (β, x₁, x₂).
5. **Lemma A numerics** (`chk_xi.py`, mpmath 40 digits): CΛ = 0.569960993 = −ζ'(2)/ζ(2);
   decomposition agrees with a direct derivative of xi to 1e-40; the Lean two-sided bound holds at
   x = 4, 7.3, 50, 1e3, 1e6, 1e12; Lxi = 1 at x ≈ 42.78 (Lean threshold 147.2, consistent);
   min of Lxi on (1/2, 4] is 0.0231 > 0 (the unformalized positivity is numerically true).
6. **Ball arithmetic** (`chk_arb.py`, python-flint/Arb, 400 bits; signs decided by ball
   comparison only). xi at nodes (0.6, 0.9, 1.7, 5, 11.5, 40) and at 8 nodes 0.5001 + k/3: all
   nested Schur defects certified > 0, and det overlaps the product of defects.

## Davenport–Heilbronn control (run)

L_DH = log-derivative of (5/π)^{s/2} Γ((s+1)/2) f(s) at s = 1/2 + x, Arb balls.
- f(1/2+x) > 0 at all sampled real x ≥ 0.51; L_DH > 0; L_DH = 0.0996 (x = 0.51) ... 5.64 (x = 1e5);
  L_DH/x → 0. So (H-AN), (H-LOW), (H-GROW) are numerically true for DH on (1/2, ∞): the generic
  theorem applies to DH as stated and yields only (a_DH) <=> (b_DH). PASS: no step of the
  formalization distinguishes xi from DH.
- DH nested defects at the same two node sets (orders 6 and 8): all certified > 0. This agrees with
  euler/RESULT.md (finite orders are Euler-blind).
- Complex-quartet toy (exact rationals, `chk_quartet.py`; the Lean control uses a real pair only):
  quartet alone fails at order 3; quartet + 5 on-line zeros fails at order 9; quartet + 40 on-line
  zeros shows no failure through order 12.

## Corrections (wording, not theorems)

1. **DH paragraph: "both sides are then false because DH has off-line zeros" is not established
   here.** It needs Prop. 5 for DH, which is neither formalized nor proved in this directory, and
   eq48 §8 itself labels the DH statement "a remark (sketch, not a theorem)". Finite orders pass
   for DH (above). Label it CLASSICAL-sketch / unverified. Also "right-half-plane facts of the same
   kind" is loose: for xi, (H-AN) on all of (1/2, ∞) uses ζ(s) ≠ 0 for Re s > 1 (Euler product in
   Mathlib); DH has zeros with Re s > 1, so for DH (H-AN) is a real-axis fact, not a half-plane fact.
2. **`literal_a'_gap` is narrower than eq48's (a').** eq48 (a') requires a sequence whose closure
   contains an interval; gapX = 1, 2, 3, ... has discrete closure. The Lean statement refutes the
   Lean-form implication (literal (a') => PSD on prefixes), not literally eq48's. The gap is
   repairable: any sequence starting 1, 2 and then dense in an interval has P₂ singular, so the
   literal (a') is vacuous from n = 2, and the gapL Pick kernel is not PSD on 4 equally spaced
   nodes in each of four intervals I tried (exact minors). That upgrade is not machine-checked.
   Also gapL violates (H-GROW) (gapL(y)/y → ∞), so the example lies outside the class of
   `residualTarget_iff_fullClass_of_analytic`.
3. **"referee fix 1, generalized-Schur reading" overstates `bI_of_prefix_posSemidef`.** Its
   hypothesis is "every prefix PSD" directly. The generalized Schur conditions (p ∈ ran P_T,
   d − pᵀP⁺p ≥ 0) are not formalized; `defect` uses `Matrix.inv` (0 on singular matrices), not a
   pseudo-inverse. The theorem is a submatrix + continuity statement.
4. **"Theorem 2 of eq48 is machine-checked" needs its two qualifiers kept attached** (both are in
   "weakest steps", not in the Verdict): (i) Lean (a) is Δ_T(y) ≥ 0, not eq. (21); the link is
   Theorem 1, unformalized. (ii) `xi_theorem2` proves (a ∧ Lxi ≥ 0 on (1/2,∞)) <=> (b); eq48's
   (a) (nonempty T, n = 1 from Lemma A) is `xi_theorem2_pos`, which has the unformalized
   hypothesis Lxi ≥ 0.

## Checks against the brief

- RH assumed anywhere: no. `RiemannHypothesis` appears only as a hypothesis/conclusion in the
  Theorem 3 skeleton; `hProp5` and `hHadamard` are stated correctly (both true classically:
  Prop. 5 refereed in eq48; on-line Hadamard pairing has positive terms, so enumeration order is
  immaterial) and are disclosed as not formalized.
- Verified height restated as new: no. No certified numerics are claimed in RESULT.md.
- Novelty: the only other Lean files under `formalization/` using `PosSemidef` are
  `lean-aristotle/frozen-rung/Inertia.lean` and `Leakage.lean` (negative index, Blaschke leakage
  bounds); neither has the Pick matrix, the Schur step or the (a) <=> (b) induction. The
  one-variable Lemma B is a different proof from eq48's Gershgorin argument.
- Reproducibility note: the `build/` directory is not shipped; `build.sh` recreates it.

## Surviving claim

Lean 4.22 / Mathlib v4.22.0, 7 files, 1612 lines, axiom-clean: Schur step and determinant identity
for Pick matrices; (a) <=> (b) for every L analytic on (a, ∞), a ≥ 0, with L ≥ c > 0 eventually and
L(y)/y → 0; these hypotheses proved for Mathlib's xi, giving `xi_theorem2` with (a) including the
empty node set; prefix-PD <=> all defects > 0; prefix-PSD => (b_I); finite (1.7); on-line Hadamard
limit => PSD; Theorem 3 only as an assembly with Prop. 5 and the Hadamard pairing as hypotheses.
A logical gap in the literal (a') is machine-checked for a discrete sequence only. No RH progress.
