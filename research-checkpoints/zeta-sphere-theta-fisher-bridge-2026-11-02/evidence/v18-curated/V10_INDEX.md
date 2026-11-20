# Sphere campaign v10 — integrated covariance and arithmetic references

All 312 v9 payload files remain byte-identical at their original paths. Its manifests are preserved under provenance/v9. Earlier indices intentionally remain unchanged. Baseline Library file: libfile_f9b2404a7e38819180527460a6ac6188.

## New independently reviewed results

- **Exact core/tail Schur transport:** core_schur_v1/ALL_DEGREE_CORE_SCHUR.md gives the derivative law, noncommuting parallel-sum covariance merge, tail-adapted resolvent identity and signed scalar boundary formula. These are exact reductions, not an all-order induction proof.
- **Actual integrated covariance repair:** the full-theta odd H5 core [0,1/16] has negative Schur residual at the normalized zero-shift limit a=0. Its actual core/tail covariance gain exceeds that deficit by more than ninefold. The independent replay explicitly verifies positive lower blocks. This numerical decomposition is a=0 only, in fixed scaling [1,200,80000]; its Schur reserves are not eigenvalue bounds. The all-shift H5 theorem in v8 remains separate.
- **All-order positive non-Gaussian reference:** cosh_core_reference_v1/FULL_LINE_FIRST_THETA_REFERENCE.md proves strictly positive Fourier density for the precisely defined whole-line first-theta-summand bridge for every real frequency and 0<a<=1/2, also its normalized a=0 limit. Exact prefactors and bridge weight are retained. The negative-h extension is not even reflection, and this is not the full modular kernel.
- **Exact remainder and fixed-reference limit:** EXACT_RESIDUAL_AND_TRANSFER_LIMIT.md retains every cross and closure term. Classical universality gives reference/full spectral ratio subsequential limits 2|c|², precluding fixed positive lower domination or a finite uniform absolute relative error. This does not imply a negative full bridge spectrum.
- **Correlated growing arithmetic reference:** arithmetic_dressing_v1/CORRELATED_EULER_BLOCK_THEOREM.md keeps all phases and derivatives for finite prime-power boxes. Its explicit high-frequency sign criterion is uniform in exponent cutoffs, and permits growing prime sets. It proves only high-frequency sign, not full positive-definiteness, and is not accompanied by a zeta approximation or full-theta remainder bound. The earlier nm<=M head has different geometry; its tail estimate cannot be transferred to these boxes.

Independent audit reports and replay files are in core_schur_audit/, first_theta_reference_audit/, and arithmetic_dressing_audit/. Some source headers still say review pending; these audit reports record completed review of the captured bytes. Numerical reference sanity checks are not interval proofs; reference positivity is proved analytically.

No RH proof, all-order integrated core sign, or compatible arithmetic sign-plus-remainder theorem is claimed. New core inertia probes, rank/scale speculation, failed quadrature logs, and other ongoing experiments are excluded.
