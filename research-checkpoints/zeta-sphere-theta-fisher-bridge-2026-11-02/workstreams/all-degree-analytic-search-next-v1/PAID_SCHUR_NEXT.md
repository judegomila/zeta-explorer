# Two-regression decomposition of the paid-twin border

## Scope

This note sharpens the exact defect identity in `DEFECT_FACTORIZATION.md`.
It separates the new paid-twin border into one positive `X`-channel
innovation, one unavoidable opposite-parity `Y`-channel innovation, and one
nonnegative mismatch between the two old-channel regressions.  No Cauchy
split of the corrected feature, residue, or residue drift is used.

The result is a finite-dimensional Hilbert-space identity.  It does not prove
the resulting inequality at every grade, does not supply a lower bound for an
old signed pivot, and has no RH conclusion.

## Exact setting

Work in

\[
 \mathcal H=L^2((0,\infty),dh)
\]

and, on one fixed-parity polynomial space, use the exact endpoint operators

\[
 Xp=2h\,p(D)\psi+p'(D)\psi,
 \qquad
 Yp=p'(D)\psi.                                      \tag{1}
\]

Let `P` be the old same-parity polynomial space and suppose its actual target
form is positive definite:

\[
 \mathfrak q(q)=\frac12(\|Xq\|^2-\|Yq\|^2)>0
 \quad(0\ne q\in P).                                \tag{2}
\]

Put

\[
 \mathcal M=XP,\qquad \mathcal N=YP.
\]

Then `X` is injective on `P`, and

\[
 T(Xq)=Yq\qquad(q\in P)                              \tag{3}
\]

defines a strict contraction from `M` into `H`.  Finite dimensionality and
strict positivity in (2) imply `||T||<1`; hence

\[
 D_T=(I-T^*T)^{1/2},\qquad
 D_{T^*}=(I-TT^*)^{1/2}                              \tag{4}
\]

are invertible on their relevant finite-dimensional ranges.  On
`N^perp`, `D_(T*)` is the identity.

For a new polynomial `p`, set `x=Xp`, `y=Yp`.  Let `q_X in P` be the unique
`X`-channel regression defined by

\[
 Xq_X=P_{\mathcal M}x,                               \tag{5}
\]

and choose any `q_Y in P` satisfying

\[
 Yq_Y=P_{\mathcal N}y.                               \tag{6}
\]

The vector `Yq_Y` is unique.  The polynomial `q_Y` itself is unique only
modulo `ker(Y|_P)`; every formula below is invariant under that ambiguity.

Define the three nonnegative quantities

\[
 A_X=\|X(p-q_X)\|^2,                                 \tag{7}
\]

\[
 B_Y=\|Y(p-q_Y)\|^2,                                 \tag{8}
\]

and

\[
 C_{XY}=\left\|
 \left(I_{\mathcal N}-TT^*|_{\mathcal N}\right)^{-1/2}
 Y(q_Y-q_X)
 \right\|^2.                                        \tag{9}
\]

There is no sign uncertainty in (9): `C_XY>=0`, and it vanishes exactly when
the two fitted old `Y`-channel vectors agree,
`Yq_X=Yq_Y`.

## Three-term paid-border identity

Let `S(p)` be the Schur complement of the old actual target block after
adjoining `p`.  Then

\[
 \boxed{2S(p)=A_X-B_Y-C_{XY}.}                       \tag{10}
\]

Consequently the exact paid-twin statement is

\[
 \boxed{A_X\ge B_Y+C_{XY}.}                          \tag{11}
\]

In particular,

\[
 A_X\ge B_Y                                          \tag{12}
\]

is necessary but not sufficient.  Equality in (12) can yield a nonnegative
border only if the two regressions match in the `Y` image.

### Proof

Write

\[
 x_0=P_{\mathcal M}x=Xq_X,\qquad
 x_\perp=X(p-q_X),
\]

and decompose the defect numerator from `DEFECT_FACTORIZATION.md` as

\[
\begin{aligned}
 y-Tx_0
 &= (I-P_{\mathcal N})y
    +P_{\mathcal N}y-Yq_X\\
 &=Y(p-q_Y)+Y(q_Y-q_X).                              \tag{13}
\end{aligned}
\]

The two terms in (13) lie in `N^perp` and `N`, respectively.  The subspaces
`N` and `N^perp` reduce `TT^*`; on the second one `TT^*=0`.  Therefore

\[
 \|D_{T^*}^{-1}(y-Tx_0)\|^2
 =B_Y+C_{XY}.                                        \tag{14}
\]

Substitution into the exact defect identity

\[
 2S(p)=\|x_\perp\|^2-
       \|D_{T^*}^{-1}(y-Tx_0)\|^2
\]

proves (10).

## Coordinate formula using only old matrices

Choose any coefficient basis of `P`.  Let

\[
 G_X=(\langle Xq_i,Xq_j\rangle),\qquad
 G_Y=(\langle Yq_i,Yq_j\rangle),                    \tag{15}
\]

and let

\[
 Q=G_X-G_Y.                                          \tag{16}
\]

Thus `Q` is twice the old actual target Gram.  Under (2), `G_X` and `Q` are
positive definite, while `G_Y` is positive semidefinite.  Define cross
columns

\[
 b_X=(\langle Xq_i,x\rangle)_i,\qquad
 b_Y=(\langle Yq_i,y\rangle)_i.                     \tag{17}
\]

The vector `b_Y` lies in `Ran G_Y`; this follows by testing it against
`ker G_Y=ker(Y|_P)`.  With the Moore--Penrose inverse used only for this
possibly singular positive Gram, put

\[
 r=b_Y-G_YG_X^{-1}b_X.                               \tag{18}
\]

Then `r in Ran G_Y`, and (7)--(9) become

\[
 A_X=\|x\|^2-b_X^*G_X^{-1}b_X,                      \tag{19}
\]

\[
 B_Y=\|y\|^2-b_Y^*G_Y^\dagger b_Y,                  \tag{20}
\]

\[
 \boxed{
 C_{XY}=r^*(G_Y^\dagger+Q^{-1})r.}                  \tag{21}
\]

Every inverse in (21) is therefore domain-safe: `Q^-1` uses only the
stipulated positive old target, and `G_Y^dagger` is applied only on
`Ran G_Y`.  Equation (21) also makes the sign and the equality case of the
mismatch term explicit.

All three terms are invariants of the new quotient class `p+P`.  Replacing
`p` by `p+q_0` with `q_0 in P` shifts both regressions by `q_0`, while
`X(p-q_X)`, `Y(p-q_Y)`, and `Y(q_Y-q_X)` remain unchanged.  Thus the
decomposition does not depend on an arbitrary choice of lower coefficients
for the new monic representative.

To verify (21), let `delta=q_Y-q_X` in coefficient coordinates, modulo
`ker G_Y`.  Then `r=G_Y delta`.  Defect intertwining gives

\[
 D_{T^*}^{-1}T=TD_T^{-1},
\]

so, with `m=X delta`,

\[
\begin{aligned}
 C_{XY}
 &=\|TD_T^{-1}m\|^2\\
 &=\|D_T^{-1}m\|^2-\|m\|^2\\
 &=\delta^*(G_Y+G_YQ^{-1}G_Y)\delta\\
 &=r^*(G_Y^\dagger+Q^{-1})r.                         \tag{22}
\end{aligned}
\]

The factor of two is fixed by (16): if `A_old` denotes the old target matrix
in the normalization of `RESULTS.md`, then `Q=2A_old` and
`Q^-1=(1/2)A_old^-1`.  Equations (10) and (21) compute `2S`, not `S`.

## Adjacent opposite-parity innovation

Suppose `p` is monic of degree `n>=1` and `P` contains all lower polynomials
of the same parity through degree `n-2`.  Since

\[
 Yp=p'(D)\psi,
\]

the image `YP` is the complete opposite-parity derivative-feature space
through degree `n-3`.  Therefore

\[
 \boxed{B_Y=n^2 h_{n-1}^{(Y)},}                      \tag{23}
\]

where `h_(n-1)^(Y)` is the monic `L2(0,infinity;dh)` Christoffel pivot of
`D^(n-1)psi` against the lower opposite-parity derivatives.  There is no
extra factor of two in (23): the factor `n^2` is solely the square of the
leading coefficient of `p'`.

This is adjacent lower-degree positive-channel data.  It does not use the
unknown degree-`n` signed target pivot or a future degree-`n+1` norm.  Relative
to the old same-parity space it introduces the degree-`n-1` opposite-parity
feature, but its Gram is an unconditional positive `L2` Gram rather than a
signed-target assumption.

The `X` term `A_X` is likewise the positive Hilbert-space Schur pivot of the
new `Xp` vector against `XP`.  Thus the necessary inequality (12) compares
two positive, source-defined Christoffel innovations.  The entire old signed
inverse is confined to the additional mismatch payment in (21).

## Relation to the residue and drift channels

Equations (1), (5), and (6) use the actual corrected theta features.  If one
substitutes

\[
 p(D)\psi=\Psi_p-e(p)\chi,
 \qquad
 p'(D)\psi=\Psi_{p'}-e(p')\chi,
\]

then both regression columns and the mismatch `r` depend jointly on the
corrected feature, residue, and residue drift generated by `-C(t)` and
`-tC(t)`.  Formula (21) is formed only after those channels have been
assembled.  Estimating their pieces separately would change `r` and would no
longer be the identity above.

The sharpened analytic target is therefore

\[
 r^*(G_Y^\dagger+Q^{-1})r\le A_X-B_Y,                \tag{24}
\]

together with the necessary nonnegativity of its right side.  This isolates
the genuinely signed cost as the disagreement of two positive-channel
regressions, rather than as separate absolute payments for residue and drift.

## Nonclaims and next use

- Equation (10) is exactly equivalent to the next signed target pivot; it is
  not an easier positivity theorem by itself.
- The necessary positive-channel comparison `A_X>=B_Y` is not sufficient
  unless the mismatch payment in (21) is also controlled.
- No uniform lower bound for `A_X-B_Y`, no estimate of `r`, and no old-target
  conditioning bound is proved here.
- The identity does not revive the refuted all-prefix `M_0>=0` route.
- Finite checks of (19)--(24) can reject a proposed bound, but cannot establish
  the all-degree result or RH.

A useful next analytic attack is to derive `r` directly from the complete
theta modular/reflection formulas.  A successful estimate must compare its
combined `G_Y^dagger+Q^-1` norm with the positive innovation gap
`A_X-B_Y`, without replacing `Q` by the positive parent or separating the
residue and drift contributions.
