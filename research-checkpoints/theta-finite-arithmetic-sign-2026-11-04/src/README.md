# Audit of signed mechanisms in the growing finite-theta model

2026-11-04. This continuation tests possible all-degree sign mechanisms after the uniform finite-arithmetic reduction. It establishes exact analytic obstructions and a selected-only determinant criterion. It does **not** prove the requested fully selected sign, derivative decay, coherence, or RH.

## Established results

1. The reflected finite model has a strictly nonzero boundary defect:

       Q_M(t^4,1)-Q_M(t^3,t)=8 pi r_M(0) r_M'(0)>0.

   It is therefore not an ordinary scalar Hankel/potential form. The corrected Fourier representation, bounded-rank displacement corrections, and their source-relative smallness are explicit. The naive Fourier transform of the reflected finite kernel has a negative Laguerre-potential tail, but that tail is not the signed form Q_M: essential polynomial boundary corrections remain.

2. A genuine individual arithmetic theta summand has negative selected quadratic defect at large summand index:

       H_m[P_(2,m)]/X_m[P_(2,m)] -> 2.

   This uses complete degree-two selection, not only a trial polynomial. The same limit holds on every fixed monic quadratic. Thus positivity cannot be assigned to each arithmetic summand separately. This does not determine the sign after all arithmetic summands and cross terms are combined.

3. For the complete finite model, let A(s) be the monic minimum for X_M+sH_M, a(s)=A(s)/A(0), and kappa the source-relative operator norm of H_M. With q(s)=(a(s)-1)/s, the exact selected ratio h satisfies

       q(s) <= h <= (1+s kappa)q(s)/(1+s q(s)).

   The determinant formula for a(s) retains full selection and all cross terms. The known polynomial kappa bound makes s=N^(-2)(log N)^(-7/4) admissible: a degree-uniform arithmetic estimate a(s)=1+o(s) would imply h->0. That arithmetic estimate is **not proved**. Superexponential approximation accuracy is sufficient to transfer it if established.

4. Positivity of the exact Q on every polynomial is equivalent to the global first Xi Laguerre inequality. Even a vanishing all-vector negative-error allowance for the growing finite models would imply this global inequality. This is distinct from a selected-column estimate. Recent inspected results on finite-height Laguerre positivity, finite-order reciprocal-law total positivity, and theta/Taylor coefficient concavity do not supply selected decay.

## Files and scope

- FINITE_BOUNDARY_DISPLACEMENT_AUDIT.md: exact boundary identities, strict defect sign, Fourier polynomial corrections, and cutoff-scale bounds.
- SINGLE_SUMMAND_SELECTED_NEGATIVITY_AUDIT.md: analytic single-summand counterexample to termwise positivity.
- SELECTED_DETERMINANT_SLOPE_CRITERION.md: selected-only determinant/resolvent criterion, its proof and permitted scales.
- THETA_LAGUERRE_SOURCE_AUDIT.md: primary-source and quantifier audit, with the universal-positivity equivalence.
- AUDIT.md: independent checks and remaining input.
- SHA256SUMS: hashes of the six payload files listed above, including this README.

The exact backup allowlist is those seven files, including SHA256SUMS. The working directory is excluded. Earlier frozen packages are unchanged; no 4CT files were edited.
