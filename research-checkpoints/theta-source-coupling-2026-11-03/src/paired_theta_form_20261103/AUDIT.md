# Independent analytic audit

Date: 2026-11-03. Result: PASS.

An independent AI-assisted reviewer inspected the proposed theorem and complete written note against the frozen audited contour and interpolation identities. This is not peer review or a machine-formalized proof.

Checked:
- Exact odd pole forms and their indefinite two-by-two matrices.
- L^2(W) domination of both original and archimedean real-axis forms, and their polarized bilinear forms.
- Joint unboundedness via analytic sine transforms and divergence of the smallest jet-Gram eigenvalue.
- Both signs and both W-Rayleigh divergences for every nonzero real fixed fractional sieve.
- Invariance of the obstruction under W-bounded perturbations.
- Generalized Rayleigh nesting, without incorrectly identifying whitened matrices as nested principal submatrices.
- Conditional divergence of both arithmetic whitened spectral extremes and the exact interval between their reciprocal endpoints.
- Fixed original-prefix projection, with preservation of LIMITING jet values, rather than an unjustified claim of exact projected jet interpolation.
- Unconditional squeezing of all admissible fractions to zero using two fixed finite-degree test polynomials, without any positivity assumption on the original form.
- Consequent original all-degree nonnegativity when positive modified prefixes exist at arbitrarily large degrees.
- The contraposition: an original negative witness would force a finite prefix beyond which no real scalar sieve fraction can restore positivity.
- The EVEN parity residue signs, derivative sign at a=0, cosine-transform argument, and parity decoupling needed for full-polynomial statements.
- Essential endpoint exclusions. The known positive half-source endpoint statement is ODD-only.

The reviewer requested two wording refinements, both implemented: use 'W-continuous' for auxiliary constraints; do not claim an original inverse-conditioning estimate is necessary for a possible quantitative shrinkage rate.

The reviewer additionally noted that the bounded-form constants can be uniform on a compact shift interval 0<=a<=A<1/2. At zero shift, the identity

    (partial_a |F(t+ia)|^2)/(2a)
       = (1/2) integral_0^1 partial_a^2 |F(t+i s a)|^2 ds

removes the apparent 1/a singularity. The note only needs and claims fixed-shift domination; no uniform obstruction-degree estimate is supplied.

Scope: no actual original-selected Schur sign is established, no constructed witness is identified with the moving full-prefix-selected residual, and no RH conclusion follows.

## Different full-pair methods: follow-up review

FULL_PAIR_ZERO_FACTOR_BOUND.md: independent analytic audit PASS. The reviewer verified paired order-one canonical product normalization, cancellation of the exponential factor, absolute convergence of the scalar zero-pair contributions, real-zero multiplicities, the reciprocal-mean constant 2, strict positivity of the integrated reference for |a|>=1/2, and the sharper interior finite-band radius T-sqrt(1/4-a^2). The zero-shift quotient is used only away from real zeros; undivided inequalities extend by continuity. The global result is outside/intersecting the boundary of the critical shift interval, not throughout its interior.

ORIGINAL_DENSITY_NEGATIVE_INDEX_RIGIDITY.md: a separate worker derived the theorem and this parent reviewed the complete proof. Review PASS: exponential moments give polynomial density; the exact projection certificate B_N=C_N^T M_N^(-1) C_N controls a k-dimensional negative subspace by 1-2 lambda_min(B_N); min-max gives convergence to -1; finite-rank/codimension arguments do not need boundedness; compact corrections preserve arbitrary finite negative dimensions. Compact corrections can create eigenvalues below -1, so only the stated limsup bound is claimed for them. No actual negative theta interval is asserted.

SRA_PREPRINT_TRANSFER_AUDIT.md records inspection of relevant parts of the 2 November 2026 preprint, NOT an independent referee audit of its full 53-page argument. Its finite PF-order and finite-band statements are not promoted to the requested global all-degree theorem.

No independent full-line, interior-shift all-degree lower bound was obtained in this follow-up.
