# Claim delta

| Claim | Grade | Evidence | Limitation |
|---|---|---|---|
| The selected residual is `q/sqrt(A)=u+(I-K)^(-1)b`, with the three exact form identities (7). | exact linear algebra | Main note, Sections 1--2; rational replay | Requires positivity of `X` and of the old `Q` prefix. |
| The selected-column interpolation obeys `p(1)=Q[q]/A`, `-p'(1)=H[q]/A`, and `p''<=0`. | exact | Block Schur differentiation | Concavity supplies only a wrong-way endpoint bound. |
| `H[q]/X[q] <= h/[rho^2+(1-rho)h]` for `h<rho`. | proved, sharp | Spectral simplex/extreme-point proof; equality model | Useful only with a theta-specific bound on `h` relative to `rho^2`. |
| A favorable monic trial transfers under the gap-relative condition (20). | proved sufficient condition | Full signed triangle estimate (18) plus sharp ratio bound | Current Pollaczek estimates are far too coarse. |
| Favorable trial ratio, relative near-minimality, full pivot positivity, and good conditioning do not generically force a favorable selected residual. | exact generic countermodel | Rank-one `2 x 2` model (18)--(23) | Generic forms are not actual complete theta. |
| Current signed Pollaczek synthesis rules out a uniform-gap shortcut. | conditional actual-family consequence | Remote audited commit `fc148eaa...`; (24)--(25) | Applies only when the synthesis lies in the relevant positive old prefix. |
| Actual selected inverse-Gram columns cannot be uniformly stretched-exponentially localized. | imported audited actual-source obstruction | Remote audited commit `3263f5a7...` | Does not exclude algebraic, column-dependent, or signed localization. |
| Uniform stretched-exponential relative/fractional-head localization is also impossible. | imported audited actual-source obstruction | Remote audited commit `859300d1...` | Still does not exclude the signed Christoffel-kernel angle. |
| The remaining endpoint-resolvent quantity is invariantly `s2=X[q-P]/X[P]`. | exact | Coordinate-free rewrite of (5)--(8) | No actual-theta `o(1)` bound is yet proved. |
| `s2` has an exact Gaussian-cardinal formula in the actual node values `P(rho_j)` and full derivative Gram. | exact | Section 6; Gaussian exactness and both stationarity relations | Neither factor has the required all-degree bound. |
| The correction is an exact signed Christoffel-kernel angle, and `Q[P]-Q[q]=o(A*rho)` is a sufficient scalar target. | exact reduction / sufficient condition | Section 6; integration by parts and old-gap inequality | The required theta-specific estimate is open. |
| The residual ratio is equivalently an adjacent inverse-Gram trace difference, and `s2` is a ridge-pivot derivative. | exact | Section 7; determinant differentiation and envelope theorem | Current inputs do not control either sensitivity. |
