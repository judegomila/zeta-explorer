# Independent audit

## Verdict

PASS for the block residual identities, gap-relative transfer bound, and the
sharp rank-one obstruction.  The result is linear algebra for generic
quadratic forms; it is not an actual-theta counterexample.

In an `X`-orthonormal basis, `Q(q,E)=0` gives

\[
 q/\sqrt A=u+(I-K)^{-1}b.
\]

Direct expansion independently reproduces all three identities in (7).  For
the sharp bound, diagonalize `K` and write `w_lambda=b_lambda^2/lambda`.
Positive semidefiniteness gives `sum w_lambda<=h`.  The ratio `H[q]/X[q]` is
linear-fractional on this simplex, so its maximum is at an extreme point.
For `h<rho`, the denominator

\[
 (1-\lambda)^2+h\lambda
\]

decreases on `0<=lambda<=1-rho`; hence the maximizing eigenvalue is
`lambda=1-rho`, giving

\[
 H[q]/X[q]\le h/[\rho^2+(1-\rho)h].
\]

The favorable-trial estimate follows independently from the triangle
inequality in the `H` seminorm and `H<=(1-rho)X` on the old prefix.

For the countermodel, the audit checks exactly

\[
 \det H=0,\qquad \det Q=\rho-h>0,
\]

the `H`-null monic trial, and the selected residual ratio in (23).  Taking
`rho=N^-2`, `h=N^-3` makes the trial ratio zero and `D->1` while the selected
ratio tends to one.

The conditional actual-family statement uses the separately audited remote
Pollaczek synthesis at `fc148eaa2da1ecf22ac14b148288b6562b424064`.
It requires membership in the relevant positive old prefix and does not
determine the actual endpoint coupling `b`.

The later remote checkpoint
`3263f5a74a4d321107b2184c6ba116502f660c42` was fetched and its package
checksums/verifier passed independently.  Its selected-column theorem blocks
uniform stretched-exponential absolute localization only; the present audit
does not broaden it to slower or signed decay.

The relative-column follow-up at
`859300d1ff3bb8cf4863961da28d9b6c5d0df498` was also fetched; its isolated
package verifier and checksums pass.  It blocks relative and low-head
stretched-exponential bounds, not the signed energy estimate asserted as the
remaining target here.

The Christoffel-column rewrite was checked separately: interpolation of
`w=q-P` at the roots of `q`, Gaussian exactness for `L_iL_j`, and the two
stationarity equations give the displayed node values and signs.  Expanding
`X[w]=Q[w]+H[w]` yields the scalar Gaussian term plus the complete squared
derivative combination, without dropping cross terms.

The kernel form follows by expanding the old `Q`-Christoffel kernel in the
cardinal basis and using `H(P,L_j)=-lambda_j P(rho_j)`.  Integration by parts
uses `(F^2P')'=F*T(P')`; no quotient by `F` is introduced.  Finally,
`Q[w]>=rho X[w]` gives `s2<=s1/rho` with
`A*s1=Q[P]-Q[q]`.
