# Release review: direct geometric attempt

21 November 2026. This is an internal, AI-assisted mathematical and artifact review. It is not external peer review or formal verification.

## Reviewed mathematical results

Two separate internal passes checked the exact two-variable transform, all factors of two, signed lower-endpoint cancellation, decay and boundary conditions, Gaussian-weighted Hilbert--Schmidt construction, density of the actual sparse exponential family, and the transfer between operator and pointwise kernel positivity.

Both checked the exact Gaussian comparison and the asymptotic obstruction for fixed constant-coefficient polynomial differential channels. One wording correction was applied before release: the result excludes that specified class; it does not establish that every possible local or variable-coefficient construction fails. The complex rank-one vector is explicitly `z_j = p(-x_j/2)`. A final consistency pass also made the corollary quantifiers explicit: for each polynomial and coefficient there exists a finite detecting prefix, which may depend on both.

A separate derivation constructed the prime-delay feature map and all reverse-endpoint counterterms. A cross-review checked the convergence interval, square coefficients, ground-state substitution, powers-of-two lower bound, and the divided-difference approximation inside the actual sparse test space.

The generic negative control has the same transform normalization as the manuscript: Gaussian variance eight, means `0, -2, 2`, and transform `exp(z^2)(3+cosh z)`. Its strong log-concavity bound and exact negative two-node value were verified symbolically.

## Verification levels

| Result | Verification |
|---|---|
| Analytic theorems | Complete written arguments and internal cross-review |
| Generic control and tail algebra | 10 exact SymPy/rational checks |
| Prime-square matrix identity | 112 exact rational mixed-entry checks and 28 negative-counterterm controls |
| Gaussian remainder sign | Executed python-flint 0.9.0 ball-arithmetic certificate with independently reviewed analytic tails |
| Integral identity numerical samples | Floating-point comparison with independently evaluated completed zeta; explicitly exploratory |
| Positive seven-point kernel sample | Exploratory only; no all-point conclusion |
| Complete kernel positivity / RH | Not proved |
| External Lean proof / kernel replay | Not used as a verified input; no replay performed |

The two mathematical reviewers checked the interval script and analytic tails; they do not claim independent executions of the Arb runtime. The recorded run and exact script identify the executable verification that was performed.

## Certificate interpretation

The strict conclusion is `R_alpha(0,0) < -1/2500`, for the specific curvature-matched Gaussian subtraction. The sign follows from interval enclosures and explicit theta/integration tails. Exploratory decimal approximations are not used to certify it. The sign does not say that the complete Riemann kernel has a negative direction.

The accompanying exact and numerical checks support specific calculations. They do not replace the universal analytic proofs, certify arbitrary matrix sizes, or prove the missing coupled inequality.

## Source and claim boundary

The analytic normalization and sparse Pick endpoint are taken from the project's arithmetic-theta manuscript at public commit `694eb35f9144ad223d6f8a6afa7398a116146b1b`. The classical completed-xi and digamma facts are cited to DLMF. Suzuki's canonical-system paper is background, not a theorem supplying the missing positive factorization.

The release preserves the distinction between a constructed positive feature map and positivity of the whole target. Both direct constructions retain a substantive open sign condition. No historical novelty claim is made for the criteria, square expansions, interpolation, or standard functional-analytic ingredients.

## Artifact verification

The manuscript compiled successfully in two LaTeX passes. All eleven rendered pages were visually inspected; formulas, page boundaries, headings, and references are readable without clipping. The public PDF and editable source are byte-identical copies of the checkpoint files.
