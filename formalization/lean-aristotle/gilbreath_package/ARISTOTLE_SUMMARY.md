# Summary of changes for run d4f7c5d3-0b1f-4616-bb25-7006aadbf749
I formalized the full Gilbreath lemma package from `job21_gilbreath_package.tex` in a new file `RequestProject/Gilbreath.lean`. The whole file builds cleanly against Mathlib with no `sorry`, and every theorem depends only on the standard axioms (`propext`, `Classical.choice`, `Quot.sound`).

Setting: rows are sequences `ℕ → ℕ`, and `D a i = Nat.dist (a (i+1)) (a i)` is the absolute-difference operator, so `D^[k] a` is the k-th row of the difference triangle.

Proved:
- **A1** `A1_binomial_transform`: `(Dᵏ a)(i) ≡ Σ_{j≤k} C(k,j)·a(i+j) (mod 2)` (proved by casting to `ZMod 2`, where `|x−y| ↦ x+y`, and inducting with Pascal's rule).
- **A2** `A2_parity_invariant`: if `a 0` is odd and `a j` is even for all `j ≥ 1`, then `(Dᵏ a)(0)` is odd for every `k`.
- **A3** `A3_prime_leading_odd`: unconditional prime instantiation. With `primeGap j = p_{j+2} − p_{j+1}` (via `Nat.nth Nat.Prime`), every leading entry `(Dᵏ primeGap)(0)` is odd. Both parity facts (`primeGap 0 = 1` odd; gaps between odd primes even) are discharged from Mathlib, so no parity hypothesis is assumed.
- **B** `B_propagation` and **B′** `B'_propagation_prefix`: the propagation fixed point, infinite and finite-prefix forms.
- **C** `C_window_determinacy`: agreement of `a` and `b` on `[i, i+k]` forces `(Dᵏ a)(i) = (Dᵏ b)(i)`.
- **WL** `WL_window_lock` and the row-indexed packaging `WL_lock_certificate`, which is the formal content of the source's finite-triangle report (`guaranteedThrough = r + W`).
- **IL** `IL_infinite_lock`.
- **R** `R_odd_le_two` and `R_reduction`, plus `R_reduction_prime`, the instance at the prime triangle obtained from A3 and R.

One statement needed adjustment: Lemma B′ as literally worded is false at `W = 0` (the window hypothesis is then vacuous, so nothing constrains `a 1`, and `D a 0 = 1` can fail). I added the hypothesis `1 ≤ W`, noted in the docstring; the window-lock corollary only ever invokes B′ with `W ≥ 1`, so nothing downstream is weakened.

Nothing in the file assumes or proves Gilbreath's conjecture: the open "Reduction" direction flagged in the source was deliberately not targeted, and `R_reduction_prime` is an equivalence that asserts neither side.