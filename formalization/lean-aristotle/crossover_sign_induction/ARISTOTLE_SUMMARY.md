# Summary of changes for run 0928c6de-53a1-42c6-a326-ca014dae5ccd
Formalized the polynomial-family package of `job16_crossover_sign_induction.tex` in `RequestProject/Main.lean`. The file builds cleanly with no `sorry`, and all results depend only on the standard axioms (`propext`, `Classical.choice`, `Quot.sound`).

Definition (`Crossover.P`): real polynomials given by `P 2 = X + 1` and, for `n ≥ 2`,
`P (n+1) = (n·X + (2n−1))·P n − X·(P n)′` (the values at `n = 0, 1` are irrelevant padding).

Proved theorems:
- `P_succ`: the defining recurrence holds for every `n ≥ 2`; `P_succ_coeff_zero` and `P_succ_coeff_succ` give its coefficient form `a_0^{(n+1)} = (2n−1)a_0^{(n)}`, `a_{k+1}^{(n+1)} = n·a_k^{(n)} + (2n−1−(k+1))·a_{k+1}^{(n)}`.
- Theorem 1: `P_coeff_pos` — for `n ≥ 2` every coefficient `a_k^{(n)}` with `k ≤ n−1` is strictly positive; `P_coeff_eq_zero` — all coefficients of index `≥ n` vanish; `P_natDegree` — `deg (P n) = n − 1`; and the consequence `P_eval_pos` — `P n (u) > 0` for all `u > 0`. The proof follows the source's induction: the only subtractive contribution combines into the multiplier `2n−1−k ≥ n > 0` on the whole support.
- Theorem 2: `P_coeff_leading` — `a_{n−1}^{(n)} = (n−1)!`, and `P_coeff_const` — `a_0^{(n)} = (2n−3)!!` (Mathlib's `Nat.doubleFactorial`, with the truncated-subtraction convention giving `1!! = 1` at `n = 2`), both for every `n ≥ 2`.
- Cross-checks `P_three`, `P_four`, `P_five`, `P_six` verify the source's measured literals `2u²+4u+3`, `6u³+18u²+25u+15`, `24u⁴+96u³+190u²+210u+105`, `120u⁵+600u⁴+1526u³+2380u²+2205u+945`.

As flagged in the source document, the calculus derivation of the recurrence from the surrogate crossover map was excluded from the target and is not formalized. All work is committed and pushed.