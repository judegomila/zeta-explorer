# 04 krein-inertia-finite (sq-krein-index Theorem A in a finite model; lane is unrefereed)
Status: NO PROOF RETURNED (service declined Lean input). Statement only; typechecks with `sorry`.
- Finite model: L = a z + axis poles + kappa distinct pairs (rho, -conj rho), positive real weights (multiplicities).
- `kernel_identity` = (2.1); `form_nonneg_of_constraints` = upper bound (at most kappa negative squares); `exists_negative_subspace` = lower bound (a kappa-dimensional negative definite subspace on some finite point set).
- Not covered: infinite zero sets (Hadamard convergence), Theorems B and C (Blaschke factorisation, operator form).
- Float check of one negative square for kappa = 1: K(rho - 0.1, rho - 0.1) < 0 (`_scripts/sanity.py`).
