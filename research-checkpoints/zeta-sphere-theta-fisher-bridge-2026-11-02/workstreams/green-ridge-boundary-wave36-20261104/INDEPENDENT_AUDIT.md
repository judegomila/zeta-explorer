# Independent audit

The Green identity and the ridge formulas were independently rederived.

For the infinite response, `f=v g` with `g=h psi` gives

\[
 f'g-fg'=v'g^2=h^2\psi^2v'.
\]

Together with `(fg)'=f'g+fg'`, this yields the factor `1/2` and the
positive integral in the main note.  Even analyticity at zero and complete
theta decay at infinity kill the boundary term.  The normalization
`psi(h)=4 Phi(h/2)` scales both sides quadratically and introduces no missing
constant.  Strict positivity uses the previously audited actual-theta input
`v'(h)>0`.

For the ridge calculation, direct minimization in the `Q`-orthonormal
stiffness basis gives

\[
 {m(\tau)\over A}=1-h+\tau
 -\sum_j{a_j^2\over1+\tau(1+\mu_j)}.
\]

Differentiation and termwise integration reproduce exactly
`R(0)=s_2` and `integral R=s_1`.  The rank-one model has zero determinant
for `H`, positive old and enlarged `Q` pivots in the stated range, and the
claimed height-width-area response.  These identities are finite-dimensional;
an infinite-dimensional limit would require separate convergence hypotheses.

The finite-`J=1` shell obstruction was also checked: the first-shell term
is positive, but every natural `n>=2` shell contributes negatively at the
modular center, so an aggregate compensation argument is genuinely required.
The proposed ratio monotonicity additionally needs the response sign topology
listed in the main note; that topology is not supplied here.

No missing sign or normalization was found after the explicit shell
normalization was restored.  This audit covers the displayed analytic
identities; the packet has no claim of machine formalization.  It is an
independent AI-assisted analytic audit, not external peer review.
