# Summary of changes for run 16c8b8a9-67ea-4ad2-b85a-0d169662c80b
I formalized `job33_lp_approximants.tex` in `RequestProject/LPApproximants.lean` (builds cleanly, no `sorry`, only the standard axioms `propext`, `Classical.choice`, `Quot.sound`).

**Definitions (verbatim from the job description).** `MathlibBridge.HasOnlyRealRoots`, `EntireLP.toEntire`, `EntireLP.IsLaguerrePolya`, and the new predicate `EntireLP.HeatMajorized`, all in the requested namespaces and with the requested unicode statements.

**Main finding: the requested seam statement `exists_LP_approx_heatMajorized` is false for every `t > 0`.** As the job description asked ("if the analysis forces a restriction on `t`, REPORT it — do not weaken the statement"), I did not weaken it: the requested statement is kept verbatim in a comment at the end of the file, and what is proved is its refutation plus the sharp positive case.

The obstruction is in the predicate itself, not in the choice of approximants. If `P n → f` locally uniformly, then all iterated derivatives converge locally uniformly, so `HeatMajorized t P` forces `∑_k t^k/k! · ‖f^(2k)(0)‖ < ∞`. For `f z = exp(-(c z)^2)` one has `‖f^(2k)(0)‖ = (c²)^k (2k)!/k!`, so each term is at least `(t c²)^k ≥ 1` whenever `t c² ≥ 1`; a summable sequence cannot dominate a sequence bounded below by 1. Given any `t > 0`, `c = √(1/t)` produces such a Laguerre–Pólya function.

**Proved theorems.**
- `EntireLP.gaussian_isLaguerrePolya` and `EntireLP.gaussianScaled_isLaguerrePolya`: the (scaled) Gaussians really are in the class, via the explicit real-rooted approximants `(1 - (cX)²/n)^n`, with an explicit convergence rate `exp(r²)·r⁴/n` on `‖z‖ ≤ r`.
- `EntireLP.not_exists_heatMajorized_of_one_le`: the general obstruction lemma.
- `EntireLP.not_exists_heatMajorized_gaussian`, `EntireLP.not_exists_heatMajorized_gaussianScaled`: the counterexamples (they do not even use real-rootedness of the hypothetical approximants).
- `EntireLP.not_forall_exists_LP_approx_heatMajorized`: refutation of the requested statement.
- `EntireLP.not_forall_exists_LP_approx_heatMajorized_of_pos`: the failure holds for every `t > 0`, not just large `t`.
- `EntireLP.exists_LP_approx_heatMajorized_zero`: the requested statement *is* true at `t = 0` (via a uniform-boundedness lemma for locally uniformly convergent sequences on closed balls). Combined with the previous item this determines exactly the values of `t` for which the seam statement holds: only `t = 0`.

Supporting material developed along the way and reusable: locally uniform convergence passes to iterated derivatives of entire functions, a Leibniz rule for multiplication by the identity, the derivative recursion `f^(k+2)(0) = -2(k+1) f^(k)(0)` for the Gaussian and its closed form `‖f^(2k)(0)‖ = (2k)!/k!`, and a `(1+w/n)^n → e^w` type estimate.

`REPORT.md` gives a prose account of the finding and of what it means for the stage-2 seam (assuming `HeatMajorized t P` with `t > 0` as a hypothesis would be vacuous exactly for the order-two functions the parent target cares about, so the seam needs renegotiating).