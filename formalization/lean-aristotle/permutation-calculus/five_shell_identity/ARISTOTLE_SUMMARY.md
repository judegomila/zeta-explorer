# Summary of changes for run 209df53a-fa10-43b3-86c6-eaf8504b9b51
The formalization of `job12_five_shell_identity.tex` is complete in Lean and lives in `RequestProject/FiveShell.lean` (389 lines, imported by `RequestProject/Main.lean`). `lake build` succeeds, the file contains no `sorry`/`admit`/`axiom`, and the main theorem depends only on the standard axioms `propext`, `Classical.choice`, `Quot.sound`.

Setting (all with `N : ℕ` universally quantified):
- `V = (ℕ → ℂ)` coefficient vectors; `L N c = ∑_{n=1}^{N} c n` (evaluation at θ = 0) and `ip N c d = ∑_{n=1}^{N} c n * conj (d n)`.
- `Proj p` (= Π_p) keeps exactly the modes not divisible by `p`; `primesLE97` is the decreasing list of primes ≤ 97, proved in `mem_primesLE97_iff` to be exactly `{p : p prime, p ≤ 97}`.
- `R97` is the product of all `Proj p`, and `R97_apply'` identifies it with the diagonal projection onto integers having no prime factor ≤ 97.
- `cut` encodes the cuts (0,5,10,17,25); `grp g` (= 𝓡_g) is the corresponding block product; `Y c g` and `Z c g` are the live and annihilated shells (`Y₀ = c`, `Y_g = 𝓡_g Y_{g-1}`, `Z_g = (I − 𝓡_g) Y_{g-1}`); `E97 N A c = L N (R97 c − A • c)`.

Results proved:
- Lemma 1: `Proj_add`, `Proj_smul`, `Proj_comm`, `Proj_idem`, `Proj_selfadjoint`; `grp_add`, `grp_smul`, `grp_idem`, `grp_comm`, `grp_selfadjoint`; `projList_perm` (order of the factors is irrelevant, the paper's remark on all 25! orders); and `grp_comp_eq_R97 : grp 4 (grp 3 (grp 2 (grp 1 c))) = R97 c`.
- Lemma 2: `shell_step : Y c g = Y c (g+1) + Z c (g+1)`, `telescope : c = Y c 4 + ∑_{g ∈ Icc 1 4} Z c g`, `Y_four_eq_R97 : Y c 4 = R97 c`.
- Lemma 3: `ip_Z_Z` (annihilated shells with distinct indices in 1..4 are orthogonal) and `ip_Z_Y4` (each eliminated shell is orthogonal to the live shell Y₄), both derived from the explicit disjoint-support description `Z_apply`.
- Theorem 4 (principal target, paper eq. (12)): `five_shell_identity (N : ℕ) (A : ℂ) (c : V) : E97 N A c = (1 - A) * L N (Y c 4) - A * ∑ g ∈ Finset.Icc 1 4, L N (Z c g)`, for arbitrary `N`, arbitrary coefficient vector `c`, and arbitrary complex scalar `A₉₇`.

All work is committed and pushed.