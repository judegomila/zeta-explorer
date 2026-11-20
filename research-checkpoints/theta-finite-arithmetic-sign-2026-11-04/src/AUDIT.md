# Audit record and remaining signed estimate

2026-11-04. Analytic work; not machine-formalized. No numerical positivity is used as proof.

## Checks

- Independently derived the degree-four Hankel defect from the half-line source Gram and checked the strict sign using the exact vanishing full-theta odd derivative and the negative omitted summand derivatives.
- Checked the second/third displacement corrections, their parity, and the explicit third-displacement example. The corrections contain odd jets and recover the exact full-theta identities when those jets vanish.
- Checked the distributional Fourier correction and leading algebraic tail. Individual terms in the corrected Fourier expressions must not be integrated as separately convergent high-degree norms.
- Independently verified the exponential reference calculation and the genuine theta summand rescaling. Dominated convergence applies to the entire degree-two Gram, so the minimizer is reselected, not held fixed. The limiting Gram is nondegenerate.
- Audited the determinant/resolvent representation at the full selected inverse column, the leading coefficient factor, both secant bounds, the polynomial shift scales, and the relative-form transfer for reselected minima.
- Checked the polynomial-density proof for the equivalence between universal Q positivity and global first-Laguerre positivity, and the fixed-polynomial limit for growing arithmetic models.
- Inspected the cited primary-source theorem statements, normalizations and quantifiers. Recent computer-assisted certificates were not independently executed or declared validated; the scope audit does not depend on accepting any such certificate as a proof of the requested estimate.

## What is not established

No degree-uniform upper bound tending to zero is proved for the full selected ratio H_M[P_n^M]/A_n^M. No positive selected defect floor, Schur-defect scale, selected coherence, global first-Laguerre positivity, or RH conclusion follows from this package.

The remaining concrete arithmetic target is a selected determinant ratio (equivalently the complete-prefix inverse-column signed expression), with all arithmetic cross terms and boundary corrections retained. The new exact identities specify that target and invalidate several shortcuts; they do not supply its required inequality.

## Reproducibility and preservation

The single-summand asymptotic and boundary signs are analytic, not conclusions from numerical checks. The frozen payloads and SHA256SUMS are the complete allowlist in README.md. Working drafts are excluded. Previously frozen files and all 4CT work are untouched.
