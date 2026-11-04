# Actual selected-column localization obstruction

Frozen research package, 2026-11-04.

**Result:** In either parity, the actual source-normalized selected inverse-Gram columns in the natural Pollaczek hierarchy cannot satisfy a uniform stretched-exponential distance bound of any positive exponent. This is an actual selected-polynomial obstruction, not an arbitrary-trial counterexample.

The proof combines a uniform finite-matrix localization lemma with a simple-zero differential resonance. The matrix argument derives the needed Riesz bound from the proposed locality and exact diagonal normalization; it does not assume it. The analytic argument uses the proved actual-source/W4 comparison and unconditional simple real zeros. All source cross terms are retained.

Files:

- `ACTUAL_SELECTED_COLUMN_OBSTRUCTION.md`: definitions, theorem, inputs, and complete synthesis of the argument.
- `NO_FAST_SELECTED_MULTIPLICATION_TAIL.md`: the analytic simple-zero resonance proof.
- `MATRIX_LOCALITY_LEMMA.md`: full finite-dimensional proof and exact finite-prefix identification.
- `COMBINED_ANALYTIC_AUDIT.md`: independent combined check, including normalization, parity, boundary, and primary-source verification.
- `SHA256SUMS`: hashes of the five payload files.

Dependencies are the previously frozen `theta_pollaczek_trial_20261104` and `theta_pollaczek_natural_20261104` proof packages. They were not modified. No numerical scan or live 4CT script is involved.

**Scope:** This rules out a strong absolute synthesis-column localization mechanism. It does not rule out algebraic or nonuniform localization, relative near-optimality, or selected cancellation estimates, and proves neither selected derivative coherence nor RH. The audits are independent mathematical rechecks within this research effort, not external peer review or machine-formal verification.
