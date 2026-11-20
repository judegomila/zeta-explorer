# Defect-angle form of the paid-Schur mismatch

## Scope

This note diagonalizes the mismatch payment in `PAID_SCHUR_NEXT.md` and
separates the sharp generic Hilbert-space statement from the additional
theta information still required.  It also shows that the graded commutator
identities alone do not imply the paid border.  The resulting criterion is
exact, but no all-degree theta estimate or RH conclusion is proved.

Let `P` be an old same-parity polynomial prefix with positive actual target
form.  Use

\[
 Xp=2h\,p(D)\psi+p'(D)\psi,
 \qquad Yp=p'(D)\psi,
\]

and put

\[
 \mathcal M=XP,\qquad \mathcal N=YP,
 \qquad T(Xq)=Yq\quad(q\in P).
\]

Then `T:M->N` is a strict contraction.  For a new polynomial `p`, let
`q_X,q_Y` be its `X`- and `Y`-regressions as in `PAID_SCHUR_NEXT.md`, and
define the regression-disagreement vector

\[
 w=Y(q_Y-q_X)
   =P_{\mathcal N}Yp-T P_{\mathcal M}Xp\in\mathcal N. \tag{1}
\]

The paid-border identity is

\[
 2S=A_X-B_Y-C_{XY},
 \qquad
 C_{XY}=\left\|(I_{\mathcal N}-TT^*)^{-1/2}w\right\|^2. \tag{2}
\]

## Exact defect-angle diagonalization

Choose a singular system on the nonzero part of `T`,

\[
 Tu_j=\sigma_jv_j,
 \qquad T^*v_j=\sigma_ju_j,
 \qquad 0<\sigma_j<1,
\]

where the `v_j` span `N` because `T:M->N` is surjective.  Define the defect
angles `theta_j in (0,pi/2)` by

\[
 \sigma_j=\cos\theta_j;
\]

Expanding `w=sum w_jv_j` in (2) gives

\[
 \boxed{
 C_{XY}=\sum_j\frac{|w_j|^2}{1-\sigma_j^2}
       =\sum_j\csc^2\theta_j\,|w_j|^2.}             \tag{3}
\]

Thus the exact paid-twin condition is the directional angle inequality

\[
 \boxed{
 \sum_j\csc^2\theta_j\,|w_j|^2\leq A_X-B_Y.}       \tag{4}
\]

Near-isometric old modes have `theta_j` close to zero and amplify only the
component of the actual mismatch in that direction.  Replacing this
directional information by the worst old angle gives the sharp generic
bounds

\[
 \|w\|^2\leq C_{XY}
 \leq\frac{\|w\|^2}{1-\|T\|^2}.                    \tag{5}
\]

Consequently

\[
 \|w\|^2\leq(1-\|T\|^2)(A_X-B_Y)                  \tag{6}
\]

is a sufficient condition based only on the operator norm.  It is generally
too strong when the old contraction gap shrinks.  Equation (4), rather than
(6), identifies the useful theta target: the mismatch must avoid or be paid
more strongly in precisely the near-isometric old modes.

There is also an exact feedback split.  Put `R_X=p-q_X`.  Since

\[
 XR_X=a,
 \qquad YR_X=Y(p-q_Y)+w
\]

and the two terms in the second expression lie in `N^perp` and `N`,
respectively,

\[
 2\mathfrak q(R_X)=A_X-B_Y-\|w\|^2.                 \tag{6a}
\]

Moreover,

\[
 C_{XY}=\|w\|^2+
 \left\|T^*(I-TT^*)^{-1/2}w\right\|^2.             \tag{6b}
\]

Hence

\[
 \boxed{
 2S=2\mathfrak q(R_X)-
 \left\|T^*(I-TT^*)^{-1/2}w\right\|^2.}            \tag{6c}
\]

The first term is the signed theta energy after the positive `X` regression;
the second is the exact old-graph feedback cost.  This is still an identity,
not a sign estimate, but it locates the cost lost by treating `q_X` as though
it were the signed-target regression.

There is an equivalent coefficient form.  In an old coefficient basis put

\[
 G_X=X^*X,\qquad G_Y=Y^*Y,
 \qquad Q=G_X-G_Y>0,
\]

and let `delta=q_Y-q_X` modulo `ker Y`.  With

\[
 K=Q^{-1/2}G_YQ^{-1/2},
 \qquad u=Q^{1/2}\delta,
\]

the formula in `PAID_SCHUR_NEXT.md` becomes

\[
 \boxed{C_{XY}=\langle u,K(I+K)u\rangle.}           \tag{7}
\]

For each nonzero eigenvalue `kappa_j` of `K`,

\[
 \kappa_j=\frac{\sigma_j^2}{1-\sigma_j^2}
          =\cot^2\theta_j.                          \tag{8}
\]

Hence (7) weights the old-target-normalized mismatch by
`kappa_j(1+kappa_j)`.  A uniform bound on `K` would be a uniform old
contraction gap, which is not available.  A viable estimate must instead
control the spectral alignment of the actual `u`.

The same covector gives the exact correction from the positive `X`
regression to the signed-target regression.  With

\[
 \alpha_X=G_X^{-1}b_X,
 \qquad r=b_Y-G_Y\alpha_X,
\]

the signed regression coefficients are

\[
 \boxed{
 \alpha_Q=Q^{-1}(b_X-b_Y)=\alpha_X-Q^{-1}r.}        \tag{8a}
\]

Thus the signed-orthogonal residual is
`p-q_X+q_(Q^-1 r)`.  This is another way to see that the mismatch cannot be
discarded: it is exactly the inverse-target correction to the apparently
natural positive-channel fit.

## No generic Hilbert-space bound

The positive innovation gap and the old contraction angles do not control
the regression mismatch for arbitrary Hilbert-space extensions.  A minimal
countermodel already occurs in `H=R^2`.  With orthonormal `e_1,e_2`, one old
polynomial `q`, and one new polynomial `p`, define

\[
 Xq=\sqrt2\,e_1,\qquad Yq=e_1,
\]

\[
 Xp=e_2,\qquad
 Yp=t e_1+\frac12e_2.                               \tag{9}
\]

The old target is positive, and

\[
 G_X=2,\quad G_Y=1,\quad Q=1,
 \quad \|T\|=\frac1{\sqrt2}.
\]

The two positive-channel innovations and the mismatch are

\[
 A_X=1,\qquad B_Y=\frac14,
 \qquad w=t e_1,\qquad C_{XY}=2t^2.                \tag{10}
\]

At `t=3/4`, even the new diagonal target value is positive, because
`||Xp||^2-||Yp||^2=3/16`, while

\[
 2S=1-\frac14-2\left(\frac34\right)^2
    =-\frac38.                                      \tag{11}
\]

Varying `t` makes `C_XY` arbitrarily large while `T`, `A_X`, and `B_Y`
remain fixed.  Thus no inequality involving only the old contraction angle
and the two innovation norms can prove the target.  This is an abstract
Hilbert-space countermodel, not a theta or RH counterexample.

## What the graded theta commutator retains

The actual polynomial shift supplies additional correlated data.  Let
`S:p->zp`, `Vq=q(D)psi`, and let `D` denote spatial differentiation.  For a
same-parity two-grade step, choose a representative `p=S^2q` modulo the old
prefix and put

\[
 W=DVq.
\]

The exact commutators

\[
 XS^2=D^2X-2DV,
 \qquad YS^2=D^2Y+2DV
\]

give

\[
 x=Xp=D^2Xq-2W,
 \qquad y=Yp=D^2Yq+2W.                              \tag{12}
\]

Therefore the innovation vectors and the regression mismatch are exactly

\[
 a=(I-P_{\mathcal M})(D^2Xq-2W),
 \qquad
 b=(I-P_{\mathcal N})(D^2Yq+2W),                   \tag{13}
\]

\[
 \boxed{
 w=J_D(q)+2\{P_{\mathcal N}W+T P_{\mathcal M}W\},} \tag{14}
\]

where

\[
 J_D(q)=P_{\mathcal N}D^2Yq
       -T P_{\mathcal M}D^2Xq.                     \tag{15}
\]

The exact directional target (4) is equivalently

\[
 \left\|D_{T^*}^{-1}
 \left[J_D(q)+2\{P_{\mathcal N}W+T P_{\mathcal M}W\}\right]
 \right\|^2
 \leq \|a\|^2-\|b\|^2.                            \tag{16}
\]

The auxiliary channel `W` enters with opposite signs in the two innovations
but with a correlated plus sign in the regression mismatch.  Estimating the
three occurrences separately discards exactly the compensation that (16)
requires.

The displayed shift identities by themselves are still insufficient.  The
countermodel (9) can be embedded in an abstract two-step commutator chain.
Set `t=3/4`, `c=1+sqrt(2)`, and define an invertible operator `D` on `R^2` by

\[
 De_1=e_2,
 \qquad
 De_2=\frac{3}{4c}e_1+\frac{3}{2c}e_2.             \tag{17}
\]

Then

\[
 D^2(Xq+Yq)=Xp+Yp.
\]

Define

\[
 Vq=\frac12D^{-1}(D^2Xq-Xp),
\]

and, for an intermediate symbol `r=S q`, set

\[
 Xr=DXq-Vq,
 \qquad Yr=DYq+Vq,
 \qquad Vr=DXr-Xp.                                  \tag{18}
\]

The definitions and the two-step identity also give `Vr=DVq`, so this is a
consistent realization of `VS=DV` on the two-symbol chain.

The identity above then gives

\[
 Xr=DXq-Vq,\quad Yr=DYq+Vq,
 \quad Xp=DXr-Vr,\quad Yp=DYr+Vr.                  \tag{19}
\]

Thus the one-step and two-step shift commutators hold, yet the paid border
is negative by (11).  This realization lacks the actual complete-theta
cyclic vector, spatial multiplication, modular reflection, and boundary
relations.  It proves only that the formal grade-shift algebra is not the
missing analytic input.

## Resulting proof target

The exact remaining problem is not a uniform angle bound.  It is a
theta-specific spectral-alignment estimate for the combined vector in
(14):

\[
 \sum_j\csc^2\theta_j
 \left|
 \left\langle
 J_D(q)+2(P_{\mathcal N}+T P_{\mathcal M})DVq,
 v_j
 \right\rangle
 \right|^2
 \leq A_X-B_Y.                                      \tag{20}
\]

Any successful argument must use more than Hilbert geometry and the formal
commutator.  The remaining available structure is the actual complete-theta
cyclic vector together with modular reflection, the linked residue/drift
boundary data, and the directional old target metric.  Formula (20) states
where that arithmetic information must enter without replacing it by a
separate Cauchy payment.

## Nonclaims

- This note does not prove (20) for the theta ladder.
- The finite-dimensional models are not generated by the complete-theta
  kernel and are not RH counterexamples.
- No uniform old contraction gap or degree-independent operator norm is
  asserted.
- The commutator embedding refutes only proofs using the formal shift
  identities without the additional theta/modular data.
