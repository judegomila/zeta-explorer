# pr48-weil: second-referee pass on the stress-test verdict (2026-11-20)

Claim as listed: "The PR-48 residual target equals the Weil functional (Lean-formalised)."
First reviewer: confirmed-weaker-statement, known-in-different-form, arbitrariness 2, importance 2.

## Outcome

I could not fault the first reviewer's mathematics or the main finding (the Lean tag is attached to the
wrong statement). I keep `confirmed-weaker-statement` and `known-in-different-form`. I change
importance 2 -> 1 and arbitrariness 2 -> 3, and add four corrections (section 3).

## 1. What I ran (all under memcap 8 GB; files in `referee/`)

Scripts: `referee/ref_check.py` (own code, written from the PR-48 text, not from `replay.py`),
logs `referee/ref_check_AB.log`, `referee/ref_check_C.log`, JSON outputs alongside.

A. Pick form vs zero sum in Arb ball arithmetic (python-flint, 60 digits; the first reviewer used mpmath).
   L from `acb_series.zeta`, zeros from `acb.zeta_zeros(1,4000)` (not mpmath `zetazero`), coefficients built
   as residues of P(z)/prod(z+x_j) with deg P = n-1-k (not a Vandermonde solve).
   - 8 nodes 0.75..8.5, k=4: Q = 1.3118835399e-12, Q - (zero sum) = +1.228e-34, predicted tail 1.45e-34.
   - 7 nodes 0.52..5.0, k=5: Q = 1.6167881641e-14, Q - (zero sum) = +7.70e-42, predicted tail 9.1e-42.
   - 10 nodes 0.7..12, k=6: Q = 3.1618922974e-17, Q - (zero sum) = +4.12e-49, predicted tail 4.9e-49.
   The discrepancy is positive and matches the size of the omitted zeros (heuristic tail with a 1.2 factor)
   in each case; relative agreement 1e-22 to 1e-32. The identity Q_L = sum_rho V(rho) conj V(-conj rho) holds
   numerically on the computed (on-line) zeros.
B. PR-48 eq. (13) coded from the PR's own definitions (J_lambda(0), ||H_lambda||^2, pole term
   |J_{-1/2}(0)|^2 - ||J_{-1/2}||^2), nodes near 1/2 where the first reviewer did not test the prime side:
   - nodes (1.5,2,2.7,3.5), primes to 4e6: Pick 0.0815243324 vs eq.(13) 0.0815245590; |diff| 2.3e-7, tail bound 6.7e-7.
   - nodes (0.9,1.3,2.2): Pick 0.0281608 vs eq.(13) 0.0299900; |diff| 1.8e-3, tail bound 5.5e-3.
   Consistent, but only to the prime-tail bound. Near x = 1/2 the split in (21) is numerically useless:
   individual terms are O(1), the total O(0.03), and the prime series converges like N^(1/2-x_min).
C. Planted off-line zero (new experiment). L_fake = L_xi + (terms of a quadruple +-a +- ig). Nested Schur
   defects (the PR-48 residual quantity, LDL pivots without pivoting) to order 48, mpmath 700 digits, repeated
   at 1000 digits with identical orders. First order with a negative defect:
     equispaced nodes 0.6+0.5j: (a,g)=(0.3,10): 7; (0.3,17.5): 12; (0.3,23): 18; (0.3,31.5): 29; (0.45,31.5): 28;
                                 (0.3,45): 43; (0.05,23): 21.   xi alone: none to 48.
     equispaced nodes 0.6+2j:   8, 15, 24, 42, 39, none to 48, 30.
     geometric nodes 0.6*1.25^j: 7, 12, 19, none, none, none, 32.
   So the off-line zero is detected (direction "(b) => RH" behaves as stated), and the order needed grows
   about linearly with the height of the planted zero in the best family tried; a poor node family does not
   detect it at all up to order 48. Absence of detection is for these families only, not a lower bound.
   Defect sizes for xi fall to 1e-90 at order 48 (nodes 0.6+0.5j), so the test needs ~2 digits per order.
D. Lean: copied the 7 `Eq48*.lean` files from the lane folder (byte-identical to the first reviewer's copies
   and to origin/main `research-checkpoints/rh-push-2026-11-16/fleet-lanes/b-lean-eq48/`) plus the first
   reviewer's `Eq48Stress.lean`, and recompiled all 8 against the existing `formalization/lean-mathlib-probe`
   build (Lean 4.22.0). 2 min, 0 errors, 32 `depends on axioms` lines, all `[propext, Classical.choice,
   Quot.sound]`, no `sorry`. `referee/lean/build.log`. This is the same code path as the first reviewer
   (their `build/` folder was not left behind, so I re-created it); it is a replay, not an independent proof.
   I read `ResidualTarget`, `FullClass`, `Lxi`, `xi_theorem2`, `xi_residualTarget_iff_RH` in source: the
   statement in the verdict matches.

Not re-run: `replay.py` itself; the chi_4 control; Davenport-Heilbronn.

## 2. Is "confirmed" deserved?

- The first reviewer's `replay.py` is their own script, not a re-execution of `eq48/check_identities.py`,
  so their numerics count as an independent check. My A/B use a third code path and a different library.
- Their two 1e-33 agreements ("PR-48 side - Pick" and "textbook Guinand-Weil side - Pick") show identical
  residuals (7.73e-34, 5.87e-33, 7.46e-33). Both share one truncated prime sum and the residual is its tail.
  They are one check of the prime side plus a check that pole + digamma quadrature match the closed forms,
  not two independent 33-digit confirmations.
- The first equality in their statement (E_gamma - 2c0||v||^2 - 2Re int M C_v' = Q_L) is PR-48's own
  eq. (16); it is how the target was derived. It is a term-by-term linear decomposition of L on x > 1/2
  (pole + digamma series + absolutely convergent Dirichlet series) and carries no content beyond that.
  The content of "equals the Weil functional" is the second equality, which is partial fractions
  1/((x_i+rho)(x_j-rho)) = [1/(x_i+rho)+1/(x_j-rho)]/(x_i+x_j) plus the Hadamard product of xi. PR #50
  eq. (1.7) already states it. What the lane adds is the equivalence chain and the Lean file.
- "Confirmed-weaker-statement" is the right label: the listed sentence says the equality is Lean-formalised;
  it is not.

## 3. Corrections to the first verdict

1. Test class. The verdict says the one-sided exponential is "not a C_c^infty test", which reads as if the
   functional were being used outside its domain. h = g*g~ is continuous, piecewise smooth, decays like
   e^{-x_min |t|} with x_min > 1/2, and its transform |V(ir)|^2 is O(r^-2): this is inside the standard
   (Barner / Weil) class for the explicit formula. The condition x_j > 1/2 is exactly that decay condition
   (and the abscissa of the Dirichlet series). So it is a legitimate, non-compactly-supported Weil test.
2. Independence of their two 1e-33 numbers (above).
3. Literature. Add: (i) S. K. Sekatskii, Ukr. Math. J. 66 (2014), arXiv:1304.7895: Li's criterion at an
   arbitrary real point a != 1/2; with Bombieri-Lagarias this is the confluent (single-node, Toeplitz) form
   of the same real-node positivity. (ii) arXiv:2611.02944 (Nov 2026 preprint), Prop. A.1 as summarised by the
   search engine: RH <=> [H(u_i+u_j)] PSD for all finite real node sets u_i > 0, with H built from Xi; a
   real-node finite-matrix criterion of the same type. Seen only as a search summary; not opened.
   (iii) Suzuki, arXiv:2606.09096 "Weil's quadratic form via the screw function". (iv) Grigutis et al.
   arXiv:2201.08599, 2509.18963 and Broughan (Canad. Math. Bull. 2009) on Re xi'/xi > 0.
   I ran 7 searches and opened no paper in full. I did not find the kernel (L(x)+L(y))/(x+y) at real nodes
   > 1/2 or the Schur-residual reduction stated verbatim; given Lagarias/Hinkkanen plus the Caratheodory-Pick
   kernel theorem and the identity theorem, the first is a routine restriction and the second is the
   Schur-complement criterion for positive semidefiniteness. The first reviewer's "weak negative" stands and
   should not be read as novelty.
4. Scores. Importance 2 -> 1. The result is: (explicit formula on a Barner-class test) + (Schur complement
   lemma with a density argument, in Lean) + (two unformalised steps to RH). Its only consequence is internal:
   four project lanes are one RH-equivalent target. It constrains no zero, no Lambda bound, and experiment C
   shows the finite-order tests see an off-line zero only at an order comparable to its height (in the node
   families tried), so verified positivity to any feasible order says nothing beyond low heights. A specialist
   would not need to be told. Arbitrariness 2 -> 3: the underlying kernel is canonical, but the claim as listed
   is about a project-defined target; the anchor 5/4, c0, the compensator 2(e^{l/2}-1), the split into
   "E_gamma" and "prime forcing", the node domain (1/2, inf) and the Schur-residual restriction are choices
   (the total is choice-free; the node domain could be any interval by Theorem 3 (b_I), or (0, inf) with a
   different proof of the decomposition).

## 4. One-line statement check

The first reviewer's one-line is accurate but should say the equality is the explicit formula. Proposed:
"On finite sums of decaying exponentials with rates above 1/2, the PR-48 residual quantity equals the zero
side of the Weil explicit formula (proved in notes, checked numerically); Lean checks only that its
Schur-residual form is equivalent to positive semidefiniteness of all real-node Pick matrices of xi'/xi; the
link to RH is not in Lean."

## 5. Residual items (unchanged from earlier referees)

Margin version refuted only on the full exponential class; single nested sequence needs all prefixes PD;
DH remark is a sketch; the two hypotheses of `xi_residualTarget_iff_RH` (off-line zero => negative finite
test; Hadamard pairing under RH) are unformalised. Experiment C supports the first numerically on a planted
zero but is not a proof.
