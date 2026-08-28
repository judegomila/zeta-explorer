# Summary of changes for run fea45708-0b66-40b4-b9f7-b9a51b8ad321
Formalized Lemma R1-FN (the sharp finite-N excursion cap) from `job22_r1fn_sharp_cap.tex` in `RequestProject/Main.lean`. The file builds cleanly and is free of `sorry`, `admit`, and added axioms (the proved theorems depend only on `propext`, `Classical.choice`, `Quot.sound`).

Setting (as in the source, encoded with ℕ indices `1, …, N`): `T j = 1/((x i - x j)(x_{i+1} - x j))`, `E = ∑_{j ∉ {i,i+1}} T j`, `Θ = ½ g² E` with `g = x_{i+1} - x_i`, and `Θmax N = ½[f(⌈(N-2)/2⌉) + f(⌊(N-2)/2⌋)]` with `f K = K/(K+1)`. The hypotheses are bundled in `R1FN.Config`: `1 ≤ i < N`, `x i < x (i+1)`, and H_min (`g ≤ x_{k+1} - x_k` for all `1 ≤ k < N`). H_min together with `g > 0` already implies `x 1 < ⋯ < x N`, so strict monotonicity is derived rather than assumed; `N ≥ 2` follows from `1 ≤ i < N`.

The four requested statements, all proved:
- (i) Per-side telescoping bounds: `Eright_le` (`g² E_right ≤ f(K_R)`, `K_R = N-1-i`) and `Eleft_le` (`g² E_left ≤ f(K_L)`, `K_L = i-1`), obtained from a reusable abstract one-sided lemma (`side_bound`, with its equality case `side_bound_eq_iff`) and the telescoping identity `∑_{r=1}^{K} 1/(r(r+1)) = K/(K+1)`.
- (ii) `Theta_le_half_f_add_f` (`Θ ≤ ½[f(K_R)+f(K_L)]`), `half_f_add_f_le_Thetamax` (`½[f(K_R)+f(K_L)] ≤ Θmax N`, via the discrete concavity of `K ↦ K/(K+1)`), and their composition `Theta_le_Thetamax`.
- (iii) `Theta_le_one_sub_two_div_N`: `Θ ≤ 1 - 2/N`.
- (iv) Sharpness and equality: `Config_arithmetic` (the uniform lattice `x k = a + k d` with the tracked pair at the balanced split satisfies all hypotheses) and `Theta_arithmetic` (it attains `Θ = Θmax N`); `eq_Thetamax_forces` (`Θ = Θmax N` forces every adjacent gap to equal `g`, i.e. a uniform minimal-spacing lattice, and forces the balanced split `K_L ∈ {⌊(N-2)/2⌋, ⌈(N-2)/2⌉}`); `eq_one_sub_two_div_N_forces_even` (`Θ = 1 - 2/N` additionally forces `N` even, via the strict inequality `Θmax N < 1 - 2/N` for odd `N`).

Three small machine-checked numerical examples are included as sanity checks on the definitions: the uniform 4-point lattice gives `Θ = 1/2 = 1 - 2/4` (cap attained), and for `N = 3` both the configuration value and `Θmax 3` equal `1/4 < 1 - 2/3`.

The original `.tex` file is left untouched; no divergence from its statement was found.