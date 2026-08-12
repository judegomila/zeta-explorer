# Ritz-shifted tail-discrepancy Schur gate

## 0. Claim boundary and outcome

The direct finite bridge uses the lower two-vector Ritz value `u`, not the
raw Rayleigh value `q`.  This note transports the cumulative-discrepancy
Schur normal form from `q` to that exact live shift.

Put

\[
 t=q-u\geq0.
\]

For the endpoint direction `x=D kappa`, the transport is especially simple:

\[
 \boxed{B_u=B_q+tI,\qquad a_u=a_q+t,\qquad c_u=c_q.}
\]

Thus the first Ritz lowering improves both diagonal parts and decreases the
inverse load, while the transverse combined pole--archimedean--minus-prime
functional is unchanged.  In particular, `q<mu_-` is a strictly stronger
condition than the odd hypothesis actually used in Theorem 2 of
`DIRECT_RH_ATTACK.md`.  An exact rational example below has

\[
 u<\mu_-<q.
\]

This correction narrows the remaining obligation; it does not prove the
shifted inequality for the arithmetic matrices on an unbounded schedule.
It proves no sector asymptotic, equation (5.2), determinant limit, or
Riemann-hypothesis conclusion.  The formal project state remains
`P0_INVALIDATED`.

All source conventions remain those pinned in `P0_SOURCE_LOCK.json`.  The
prime block keeps the minus sign in source equation (3.19), every prime
power `n<=lambda^2` is retained, zero extension is used, and inversion is
reflection.

## 1. Exact first-Ritz lowering

Let `Q=Q*`, let `kappa` be a unit inversion-even vector, and put

\[
 q=\langle\kappa,Q\kappa\rangle,
 \qquad b=(Q-qI)\kappa,
 \qquad r=\|b\|.
\]

When `r>0`, set `w=b/r` and

\[
 c_R=\langle w,Qw\rangle.
\]

The compression to `span{kappa,w}` is

\[
 H_R=\begin{pmatrix}q&r\\r&c_R\end{pmatrix},
\]

and its lower eigenvalue is

\[
 u={q+c_R-\sqrt{(c_R-q)^2+4r^2}\over2}.
\]

Consequently

\[
 \boxed{
 t=q-u={\sqrt{(c_R-q)^2+4r^2}-(c_R-q)\over2}>0.}       \tag{1.1}
\]

If `c_R>=q`, the cancellation-free rationalization is

\[
 t={2r^2\over
 \sqrt{(c_R-q)^2+4r^2}+(c_R-q)}.                    \tag{1.2}
\]

For `r=0`, the source convention is `u=q`, hence `t=0`.  No eigenvector or
cached spectral datum is used in (1.1).

The phrase **Ritz upper bound** means that `u` is an upper bound for the
unknown lowest even eigenvalue.  It does not mean `u>=q`.  Interlacing gives
`mu_+<=u`, while (1.1) gives `u<q` whenever `r>0`.  Reversing this order
would reverse the shift in (2.3) and invalidate the gate.

The scale of the improvement has an exact dichotomy.  Put
`d_R=c_R-q`.  If `d_R>0`, rationalization and
`d_R<=sqrt(d_R^2+4r^2)<=d_R+2r` give

\[
 \boxed{
 {r^2\over d_R+r}\leq t\leq
 \min\left\{r,{r^2\over d_R}\right\}.}              \tag{1.3}
\]

For `d_R=0`, one has `t=r`.  If `d_R<0` and `e_R=q-c_R`, then

\[
 \boxed{r+{e_R\over2}\leq t\leq r+e_R.}             \tag{1.4}
\]

Thus a residual-direction Rayleigh value separated above `q` makes the
first lowering second order, `t` comparable to `r^2/d_R`; a direction below
`q` exposes a hidden low even direction and produces a larger lowering.  In
the latter case the even-complement and weighted-solve hypotheses still
have to be checked rather than inferred from the large value of `t`.

## 2. Transport of the endpoint Schur complement

Retain the exact source objects

\[
 d=\delta\kappa,
 \qquad x=D\kappa\ne0,
 \qquad s_q=D(Q_+-qI)\kappa-d\beta.
\]

The source commutator gives the unsplit identity

\[
 \boxed{s_q=(Q_--qI)x.}                              \tag{2.1}
\]

At the live Ritz shift `u=q-t`, define

\[
 s_u=D(Q_+-uI)\kappa-d\beta.
\]

Then, before any absolute value or block norm is taken,

\[
 \boxed{s_u=s_q+tx=(Q_--uI)x.}                       \tag{2.2}
\]

Let `y=x/||x||`, `G=y^perp`, and define

\[
 B_q=P_G(Q_--qI)P_G|_G,
 \quad a_q={\langle x,s_q\rangle\over\|x\|^2},
 \quad c_q={P_Gs_q\over\|x\|}.
\]

Define `B_u,a_u,c_u` by the same formulas with `q,s_q` replaced by
`u,s_u`.  Since `P_Gx=0`, (2.2) proves

\[
 \boxed{
 B_u=B_q+tI_G,\qquad a_u=a_q+t,\qquad c_u=c_q.}       \tag{2.3}
\]

Ordinary block Gaussian elimination now gives the exact necessary and
sufficient odd gate used by the direct bridge:

\[
 \boxed{
 u<\mu_-\quad\Longleftrightarrow\quad
 B_q+tI_G\succ0,
 \quad
 a_q+t-\langle c_q,(B_q+tI_G)^{-1}c_q\rangle>0.}     \tag{2.4}
\]

Equation (2.4), not the same formula at `t=0`, is the minimal first-Ritz
odd-sector obligation.

The transport is not limited to the mandatory two-vector value.  Let `U`
be any source-reconstructed variational upper bound for the lowest even
eigenvalue such that

\[
 \mu_+\leq U\leq q,
 \qquad t_U=q-U.
\]

For example, `U` may be the lowest Ritz value of a declared finite
source-defined even Krylov space containing `kappa`; enlarging that space can
only decrease `U`.  The proof above applies verbatim:

\[
 \boxed{
 B_U=B_q+t_UI,
 \qquad a_U=a_q+t_U,
 \qquad c_U=c_q.}                                     \tag{2.5}
\]

Both sector conditions in the direct bridge become weaker as such a valid
upper bound is lowered: `alpha-U` and `omega-U` increase.  The comparison
state used in the limiting transform remains `kappa`; the auxiliary Ritz
space changes only the certified upper shift.  What is not automatic is an
asymptotic source estimate for `U`, or the weighted resolvent bound at that
shift.

## 3. Cumulative-discrepancy form at the live shift

Use the notation of
`notes/TAIL_DISCREPANCY_TRANSVERSE_SCHUR_NORMAL_FORM.md`.  Thus

\[
 Q_\lambda=c_*I+\mathfrak h_\lambda,
 \qquad
 \mathfrak h_\lambda(f,g)
 =\int_0^L\mathcal F(h)C'_{f,g}(h)\,dh,
\]

where `mathcal F=D_lambda-H_tail` contains the inclusive prime-power
inventory and the combined archimedean tail.  For `z,w in G`, (2.3) becomes

\[
 \boxed{
 \langle z,B_uw\rangle
 =(c_*-u)\langle z,w\rangle
 +\int_0^L\mathcal F(h)C'_{z,w}(h)\,dh.}             \tag{3.1}
\]

The scalar direction is

\[
 \boxed{
 a_u=c_*-u+\int_0^L\mathcal F(h)C'_{y,y}(h)\,dh,}    \tag{3.2}
\]

whereas the transverse functional is independent of the scalar shift:

\[
 \boxed{
 \langle z,c_u\rangle
 =\int_0^L\mathcal F(h)C'_{z,y}(h)\,dh
 =\langle z,c_q\rangle.}                             \tag{3.3}
\]

Therefore the actual tail-discrepancy odd gate is

\[
\boxed{
\begin{gathered}
 B_q+tI_G\succ0,\\
 c_*-q+t+\int_0^L\mathcal F C'_{y,y}
 >\sup_{0\ne z\in G}
 {\left|\int_0^L\mathcal F C'_{z,y}\right|^2
  \over
  (c_*-q+t)\|z\|^2+\int_0^L\mathcal F C'_{z,z}}.
\end{gathered}}                                      \tag{3.4}
\]

No separate pole, archimedean, prime, `Dr`, or `d beta` norm occurs in
(3.4).  The only new term is the exact scalar Ritz lowering `t` reconstructed
from (1.1).

## 4. Monotonicity of the live Schur short

Whenever `B_q+tI_G` is positive definite, put

\[
 \Phi(t)=a_q+t-
 \langle c_q,(B_q+tI_G)^{-1}c_q\rangle.             \tag{4.1}
\]

On every interval of positivity, differentiation through the finite inverse
gives

\[
 \boxed{
 \Phi'(t)=1+\|(B_q+tI_G)^{-1}c_q\|^2\geq1,}          \tag{4.2}
\]

and

\[
 \Phi''(t)=-2\langle c_q,(B_q+tI_G)^{-3}c_q\rangle
 \leq0.                                              \tag{4.3}
\]

Thus the live scalar short improves by at least the applied Ritz lowering,
and strictly more when the transverse coupling is nonzero.  If `B_q` is
already positive and `t>0`, the resolvent identity gives the division-free
comparison

\[
 \boxed{
 \Phi(t)-\Phi(0)-t
 =t\langle c_q,B_q^{-1}(B_q+tI_G)^{-1}c_q\rangle
 \geq0.}                                             \tag{4.4}
\]

This is a real improvement, not a relabeling of the `q` gate.  It does not,
however, provide a lower bound for the source value of `t` relative to the
arithmetic Schur deficit.

## 5. Exact rational separation of the two gates

Take the even compression in the orthonormal basis `(kappa,w)` to be

\[
 Q_+=\begin{pmatrix}5&2\\2&8\end{pmatrix}.           \tag{5.1}
\]

Then `q=5`, `r=2`, `c_R=8`, and its lower Ritz value is exactly `u=4`, so
`t=1`.  Take the odd compression to be

\[
 Q_-=5I+
 \begin{pmatrix}
 1&3/2&0\\
 3/2&1&0\\
 0&0&2
 \end{pmatrix}.                                      \tag{5.2}
\]

Its eigenvalues are `9/2,7,15/2`.  Hence

\[
 \boxed{u=4<\mu_-=9/2<q=5.}                          \tag{5.3}
\]

Using the first odd coordinate as `y`, the `q`-shifted data are

\[
 a_q=1,
 \qquad B_q=\operatorname{diag}(1,2),
 \qquad c_q=(3/2,0)^T.
\]

The stronger short fails:

\[
 \Phi(0)=1-{9\over4}=-{5\over4}<0.                  \tag{5.4}
\]

At the actual Ritz shift,

\[
 \Phi(1)=2-{9/4\over2}={7\over8}>0,                 \tag{5.5}
\]

and `B_q+I` is positive.  The even complementary floor is `8>u`, so the
two strict sector hypotheses of the direct residual--Ritz theorem hold.
This exact model proves that replacing (2.4) by the `t=0` gate can discard
valid bridge instances.

## 6. Remaining source-specific estimate

For the arithmetic family, a closing odd-sector argument may now use either
the stronger `q` gate, the exact first-Ritz gate (3.4), or (2.5) with a lower
source-defined even Ritz upper bound.  The first-Ritz route requires a joint
estimate of

1. the source Ritz lowering `t=q-u`;
2. the least transverse floor of `B_q+tI`; and
3. the unchanged cumulative-discrepancy inverse load.

Absolute decay of `q`, `r`, or the projection error does not compare these
three quantities.  A proof must retain their common source scale and the
combined residual (2.2).  The even complementary floor, weighted shifted
solve in equation (5.2), and locally uniform determinant convergence remain
separate obligations.
