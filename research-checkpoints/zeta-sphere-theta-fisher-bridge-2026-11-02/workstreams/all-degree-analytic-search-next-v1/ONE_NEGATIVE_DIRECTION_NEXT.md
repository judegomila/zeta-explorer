# Exact one-negative-direction continuation after the `M_0` no-go

## Scope

The all-prefix assertion `M_(0,N)>=0` is false in both complete parity
ladders.  This note gives the exact continuation that still permits one
negative direction.  Its main criterion is an unconditional finite-
dimensional inertia identity; it does not assume endpoint positivity, the
sign of the Xi--Laguerre density, or RH.

The criterion is useful for proof design, but it is not a shortcut.  Requiring
it at every grade is equivalent, by `M0_INERTIA_EQUIVALENCE_AUDIT.md`, to the
endpoint density sign.  The point is to isolate the correct scalar theta
inequality after the stronger positive-semidefinite route has been retired.

Fix one parity and let

\[
 \mathcal P_N=\operatorname{span}\{p_0,\ldots,p_N\}
\]

be compatible nested polynomial prefixes.  Write `B_N` for the matrix of the
frozen-residue form

\[
 \mathfrak m_0(p,q)
 ={1\over2}\{\langle X_0p,X_0q\rangle
              -\langle Y_0p,Y_0q\rangle\},             \tag{1}
\]

where

\[
 X_0p=2hF_p+\Psi_{p'},\qquad Y_0p=\Psi_{p'},
 \qquad F_p=p(D)\psi.                                  \tag{2}
\]

## General bordered-inertia lemma

Let `B` be any finite Hermitian matrix, `b` a column, and `c` real.  Put

\[
 \mathcal B=\begin{pmatrix}B&b\\b^*&c\end{pmatrix}.    \tag{3}
\]

If `b` belongs to `Ran B`, congruence with the Moore--Penrose solution gives

\[
 \operatorname{In}(\mathcal B)
 =\operatorname{In}(B)
  +\operatorname{In}\bigl(c-b^*B^\dagger b\bigr).      \tag{4}
\]

If `b` does not belong to `Ran B`, decompose `b=b_R+b_K` with
`b_K` nonzero in `ker B`.  Eliminating `b_R` leaves, besides `B` restricted
to its range and unused zero directions, a block

\[
 \begin{pmatrix}0&\|b_K\|\\\|b_K\|&c-b_R^*B^\dagger b_R\end{pmatrix}. \tag{5}
\]

Its determinant is negative, so it has exactly one positive and one negative
eigenvalue.  Hence

\[
 n_-(\mathcal B)=
 \begin{cases}
 n_-(B)+{\bf1}_{\{c-b^*B^\dagger b<0\}},&b\in\operatorname{Ran}B,\\
 n_-(B)+1,&b\notin\operatorname{Ran}B.
 \end{cases}                                           \tag{6}
\]

In particular, if `n_-(B)<=1`, then

\[
 \boxed{
 n_-(\mathcal B)\leq1
 \Longleftrightarrow
 \begin{cases}
 \text{no additional condition},&n_-(B)=0,\\
 b\in\operatorname{Ran}B\ \text{and}\
 c-b^*B^\dagger b\geq0,&n_-(B)=1.
 \end{cases}}                                          \tag{7}
\]

This includes singular old blocks.  For an invertible old block of index one,
the range condition is automatic and the entire extension test is the single
scalar inequality

\[
 \boxed{c-b^*B^{-1}b\geq0.}                            \tag{8}
\]

No positive target matrix occurs in (3)--(8).

## The exact theta residual

Apply (7) to the old frozen-residue matrix `B_(N-1)` and the border produced
by `p_N`.  When `B_(N-1)` is invertible, let

\[
 \alpha=B_{N-1}^{-1}
 \bigl(\mathfrak m_0(p_j,p_N)\bigr)_{j<N},
 \qquad
 R_N=p_N-\sum_{j<N}\alpha_jp_j.                        \tag{9}
\]

Then `R_N` is `m_0`-orthogonal to the old prefix and

\[
 c-b^*B_{N-1}^{-1}b=\mathfrak m_0[R_N].                \tag{10}
\]

Consequently, once the old prefix has exactly one negative direction, the
next prefix retains at most one negative direction if and only if

\[
 \boxed{
 \mathfrak m_0[R_N]
 ={1\over2}\left(\|2hF_{R_N}+\Psi_{R_N'}\|_2^2
                  -\|\Psi_{R_N'}\|_2^2\right)\geq0.}  \tag{11}
\]

Equivalently, with ordinary `dh` measure,

\[
 \boxed{
 \int_0^\infty
 \left\{h^2|F_{R_N}(h)|^2
 +\operatorname{Re}\bigl(hF_{R_N}(h)
   \overline{\Psi_{R_N'}(h)}\bigr)\right\}\,dh
 \geq0.}                                               \tag{12}
\]

The coefficients in (9) are determined by lower frozen-residue theta
moments.  Thus (11)--(12) are source-specific and noncircular: they do not
presume that the actual endpoint target is positive.  They are also strictly
narrower than `m_0[p]>=0` for every polynomial, which the fixed-`tau`
obstruction has ruled out.

For a singular old block of index one, the exact replacement is the range
condition in (7), followed by

\[
 \mathfrak m_0[p_N]-b^*B_{N-1}^\dagger b\geq0.         \tag{13}
\]

Failure of the range condition itself creates a second negative direction.

## Krein-space and finite Pontryagin interpretation

Put the fundamental form on the ambient Krein space

\[
 [(x,y),(x',y')]
 ={1\over2}\{\langle x,x'\rangle-\langle y,y'\rangle\}
 \tag{14}
\]

on `L2(0,infinity) direct-sum L2(0,infinity)`, and define the finite theta
graph

\[
 \mathcal G_N=\{(X_0p,Y_0p):p\in\mathcal P_N\}.        \tag{15}
\]

The restricted negative index of (14) on `G_N` is exactly `n_-(B_N)`.
If the old graph has index one and is nondegenerate, subtracting its
`[.,.]`-orthogonal projection from `(X_0p_N,Y_0p_N)` produces precisely
`(X_0R_N,Y_0R_N)`.  The Pontryagin index stays one exactly when this residual
graph vector has nonnegative square.  This is (11).

Thus the surviving route is a one-negative-square extension problem, not an
ordinary contraction.  Invoking a Hilbert-space contraction theorem would
erase the one direction that the asymptotic no-go shows must eventually be
present.

## Determinant and pivot version

When all relevant leading blocks are nonsingular, (10) is the determinant
ratio

\[
 s_N^{(0)}:=\mathfrak m_0[R_N]
 ={\det B_N\over\det B_{N-1}}.                         \tag{16}
\]

LDL inertia then gives a particularly simple scalar description:

\[
 \boxed{
 n_-(B_N)\leq1\ \text{for every }N
 \Longleftrightarrow
 \text{the pivot sequence }s_N^{(0)}
 \text{ contains at most one negative term}.}         \tag{17}
\]

After the first negative pivot, every later pivot must be nonnegative; before
that pivot, a new border can add at most the one allowed negative direction.
Zero pivots are governed by the range alternative (7), not by an arbitrary
choice of generalized inverse.

Equation (17) is an exact secular target.  It is not the positive Hankel-
determinant criterion for the actual target density: its moments include the
nonlocal `v d^*+d v^*` correction.

## Spectral form of the remaining scalar inequality

The exact identity `M_0=Q+vd^*+dv^*` gives

\[
 \boxed{
 \mathfrak m_0[R_N]
 ={1\over\pi}\int_{\mathbb R}
  \{\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)\}
  |R_N(i\nu)|^2\,d\nu
 +2\operatorname{Re}\{v(R_N)\overline{d(R_N)}\}.}     \tag{18}
\]

Here

\[
 v(p)=\int_0^\infty h[p(D)\psi](h)\chi(h)\,dh,
 \qquad d(p)=e(p'),                                   \tag{19}
\]

with the real-frequency and shifted-first-orbit formulas for `d` recorded in
`M0_REAL_LINE_TRACE_KERNEL.md`.  Formula (18) identifies the exact
theta-specific obligation: for the actual indefinite-orthogonal residuals
`R_N`, prove the combined signed expression nonnegative after the first
negative pivot.  Separate Cauchy estimates for `v` and `d`, or positivity of
the undifferentiated parent, do not establish (18).

## Equivalent undivided theta-curvature target

The all-prefix version can also be stated directly in complete-theta data.
Use the Fourier convention
`uhat(kappa)=integral_R u(w)exp(-i kappa w)dw` and define

\[
 M_1(w)=\int_0^\infty h^2\psi(h-w)\psi(h+w)\,dh.       \tag{A1}
\]

The function `M_1` is pointwise positive, even, and Schwartz. Differentiating
the exact tilted autocorrelation twice at zero gives

\[
 \Xi'(t)^2-\Xi(t)\Xi''(t)=2\widehat M_1(2t).           \tag{A2}
\]

Thus the one-negative-direction closure is equivalent to positive
definiteness of `M_1`, not merely to its pointwise positivity.

There is an exact undivided scalar target for this positive-definiteness,
valid from the primitive factorization for `|a|<1/2`.
Let `k` be the positive theta primitive satisfying
`psi=(1/4-D^2)k`, define
`Lambda(s)=pi^(-s/2)Gamma(s/2)zeta(s)`, and put

\[
 \mathcal F_a(\kappa)=
 \left|\Lambda\left({1\over2}+a+{i\kappa\over2}\right)\right|^2,
 \qquad
 P_a(\kappa)=
 [\kappa^2+(2a-1)^2][\kappa^2+(2a+1)^2].             \tag{A3}
\]

The primitive autocorrelation factorization audited in
`evidence/v18-curated/foundations/ORIGINAL_FACTORIZATION_AUDIT.md` implies

\[
 \widehat M_1(\kappa)
 ={1\over256}
 \left.\partial_a^2\{P_a(\kappa)\mathcal F_a(\kappa)\}
 \right|_{a=0}.                                      \tag{A4}
\]

The functional equation makes `mathcal F_a` even in `a`, while

\[
 P_a(\kappa)=(1+\kappa^2)^2
 +8a^2(\kappa^2-1)+16a^4.
\]

Consequently the exact undivided inequality is

\[
 \boxed{
 (1+\kappa^2)^2
 \left.\partial_a^2\mathcal F_a(\kappa)\right|_{a=0}
 +16(\kappa^2-1)\mathcal F_0(\kappa)\geq0
 \quad(\kappa\in\mathbb R).}                         \tag{A5}
\]

Where `mathcal F_0` is nonzero, this is equivalently the transverse-curvature
bound

\[
 \left.\partial_a^2\log\mathcal F_a(\kappa)\right|_{a=0}
 \geq {16(1-\kappa^2)\over(1+\kappa^2)^2}.            \tag{A6}
\]

At a zero, (A5), not (A6), is the valid formulation. Equations (A4)--(A6)
use the reviewed positive primitive factorization, but do not prove its
parameter-curvature sign. They expose a possible theta-specific analytic
attack that does not use the disproved all-prefix `M_0>=0` gate.

The constant-matrix signed-SOS contraction studied in
`evidence/v18-curated/hierarchy/coupled_v2/coupled_hierarchy.md` has an
unavoidable negative channel already at order one. Therefore pointwise
positivity of (A1), a constant output matrix, or separate orbit positivity
do not by themselves establish (A5). Any proof must supply additional
theta-specific compensation, for example a frequency-dependent modular
estimate.

## Relation to the rank-two secular matrix

For orientation, suppose a finite actual target matrix `Q` is invertible and
put

\[
 U=(v\ d),\qquad
 J=\begin{pmatrix}0&1\\1&0\end{pmatrix},\qquad
 S=J+U^*Q^{-1}U.                                      \tag{20}
\]

The Haynsworth formula gives

\[
 n_-(Q+UJU^*)
 =n_-(Q)+n_+(S)-1.                                    \tag{21}
\]

This follows by taking Schur complements of
`[[Q,U],[U^*,-J]]`: the complementary block is `-S`, so the positive,
rather than negative, index of `S` enters (21). If `n_-(Q)=1`, the
one-negative-direction condition is exactly that the `2 by 2` matrix `S` not
be positive definite.
Writing

\[
 V=v^*Q^{-1}v,\quad D=d^*Q^{-1}d,\quad Z=v^*Q^{-1}d,
\]

this excludes only

\[
 V>0,\qquad D>0,\qquad VD>|1+Z|^2.                    \tag{22}
\]

Equation (22) is a useful finite secular audit, but it assumes the inverse and
known inertia of the full `Q`; it is not the proposed proof criterion.  The
unconditional rung-by-rung criterion is (7)--(13).

## Conditional shape of the allowed negative direction

This subsection is interpretation only.  If a finite actual target `Q` is
positive definite, put

\[
 V=v^*Q^{-1}v,\qquad D=d^*Q^{-1}d,\qquad
 C=\operatorname{Re}(v^*Q^{-1}d),\qquad
 g=\sqrt{VD}-C.                                       \tag{23}
\]

For real theta data and independent nonzero `v,d`, the actual eigenvectors of
the whitened matrix are proportional to
`Q^(-1/2)v/sqrt(V) plus-or-minus Q^(-1/2)d/sqrt(D)`. Pulled back to coefficient
space, these are the generalized eigen-directions of the pair `(M_0,Q)`:

\[
 Q^{-1}v/\sqrt V\ \mathbin\pm\ Q^{-1}d/\sqrt D.       \tag{24}
\]

The corresponding whitened eigenvalues are

\[
 1+C+\sqrt{VD},\qquad 1+C-\sqrt{VD}=1-g.              \tag{25}
\]

Thus failure of the old unit gate `g<=1` creates exactly one negative
direction, the minus direction in (24); it does not create an uncontrolled
negative subspace.  On the endpoint-positive branch, the fixed-`tau` no-go
implies that such a direction must appear at some finite prefix.  Interlacing
then makes it persist, while target positivity prevents a second one.

This conditional picture explains why the asymptotic obstruction retires
`M_0>=0` but is compatible with the criterion in this note.  It must not be
used to prove endpoint positivity, because (23)--(25) assume it.

## What remains open

The exact next analytic statement is (11), (12), or (18) for the actual
`m_0`-orthogonal residual sequence after its first negative pivot, together
with the singular range condition (7) if a zero pivot occurs.  Proving it
uniformly would establish the endpoint-equivalent one-negative-direction
closure.

No argument currently derives this scalar inequality from positive-parent
moments, the first theta orbit, or separate norm bounds.  The generic
positive-parent countermodel in `M0_INERTIA_COUNTERMODEL.md` shows that such
inputs alone are insufficient.  A successful proof must use the complete-
theta differential/modular arithmetic of the residual `R_N` and preserve the
combined term in (18).

## Nonclaims

- This note does not prove (11) at every grade or prove the endpoint density
  nonnegative.
- It does not locate the first negative frozen-residue pivot.
- It does not turn finite midpoint diagnostics into interval certificates.
- It does not prove or disprove RH.
- The conditional target-whitening formulas (23)--(25) are structural
  consequences of endpoint positivity, not evidence for it.
