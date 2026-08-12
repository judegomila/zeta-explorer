# Positive-trial cone depth and even-ground angle transfer

## 0. Claim boundary

This note proves a finite, source-compatible transfer lemma.  A strictly
positive Fejer or Jackson comparison state determines an open cone in the
real even coefficient space.  The cone has an exact spherical inradius at
that state.  If an independently certified **even-sector** Ritz/resolvent
estimate places the actual simple even ground line inside that spherical
cap, then the complete imaginary-axis response of the ground vector is
positive.  The existing source factorization then implies positivity of the
odd block at the even ground eigenvalue.

The resulting gate is

\[
 \boxed{
 \arctan(\tau_+)+\angle(\kappa,z)
 <\arcsin m_{\mathcal C}(z).}                       \tag{0.1}
\]

Here `z` is a positive unit finite trial state, `kappa` is an independently
specified even Ritz anchor, `tau_+` is obtained solely from the even
complement, and `m_C(z)` is the exact cone depth defined below.  Thus (0.1)
does not assume an odd floor in order to prove the odd sign.

This is not an asymptotic proof.  No admitted estimate establishes (0.1) on
an unbounded source-derived schedule.  Even after (0.1), the shifted
comparison at a Ritz upper value and equation (5.2) of
`DIRECT_RH_ATTACK.md` remain separate obligations.  The all-order and Gevrey
prolate estimates presently control the source comparison state and its
projection; they do not control the actual even ground relative to the cone
depth.

The locked interval, Fourier sign, Lebesgue measure in logarithmic
coordinates, zero extension, and inversion convention are unchanged.  The
complete finite matrix is still assembled as

\[
 Q=Q_{\rm pole}-Q_{\rm arch}-Q_{\rm prime},         \tag{0.2}
\]

with every prime power through the inclusive endpoint and with the minus
sign on the prime block from source equation (3.19).  No zero table or
global Weil-positivity assertion is used.  The formal project state remains
`P0_INVALIDATED`.

## 1. Homogeneous imaginary-axis response

Fix `lambda>1`, put `L=2 log(lambda)`, and use the normalized real even
basis

\[
 e_0^+=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2}\quad(1\leq n\leq N).
                                                               \tag{1.1}
\]

For a real even coefficient vector

\[
 y=(y_0,y_1,\ldots,y_N)\in\mathbb R^{N+1},
\]

the source boundary functional is represented by

\[
 d=(1,\sqrt2,\ldots,\sqrt2),\qquad
 c_y=\langle d,y\rangle
     =y_0+\sqrt2\sum_{n=1}^Ny_n.                   \tag{1.2}
\]

When `c_y` is nonzero, the boundary-normalized response in
`EVEN_GROUND_IMAGINARY_AXIS_ODD_INERTIA.md` is

\[
 A_y(\alpha)=1-\sqrt2\sum_{n=1}^N
 {n^2\over n^2+\alpha^2}{y_n\over c_y}.            \tag{1.3}
\]

It is better for comparison states to retain homogeneity.  Define

\[
\begin{aligned}
 B_y(\alpha)
  &:=c_yA_y(\alpha)\\
  &=y_0+\sqrt2\sum_{n=1}^N
       {\alpha^2\over n^2+\alpha^2}y_n
   =\langle b_\alpha,y\rangle,                     \tag{1.4}\\
 b_\alpha
  &:=\left(1,{\sqrt2\alpha^2\over1+\alpha^2},
       \ldots,{\sqrt2\alpha^2\over N^2+\alpha^2}\right).
                                                               \tag{1.5}
\end{aligned}
\]

Compactify the parameter half-line by adding `alpha=infinity`.  Then

\[
 b_0=e_0^+,
 \qquad b_\infty=d,
 \qquad B_y(0)=y_0,
 \qquad B_y(\infty)=c_y.                            \tag{1.6}
\]

The map `alpha -> b_alpha` is continuous on this compactification, for
example after the coordinate `alpha^2/(1+alpha^2)` is used.

With the locked transform sign and

\[
 \alpha={\sigma L\over2\pi},
\]

the exact finite transform formula is

\[
 \boxed{
 \widehat y(i\sigma)
 ={2\sinh(\sigma L/2)\over\sigma\sqrt L}
 B_y\!\left({\sigma L\over2\pi}\right)}           \tag{1.7}
\]

for `sigma>0`, with continuous prefactor `sqrt(L)` at `sigma=0`.
Thus the homogeneous response retains the combined cancellation before any
normalization is divided out.

Define the open response cone

\[
 \mathcal C_N
 =\{y\in\mathbb R^{N+1}:
       \langle b_\alpha,y\rangle>0
       \text{ for every }\alpha\in[0,\infty]\}.    \tag{1.8}
\]

If a real even trigonometric state is strictly positive on the complete
source interval, including its identified endpoint, then its integral
against `exp(sigma*t)` is positive for every real `sigma`; hence it belongs
to `C_N`.  In particular the positive Fejer and Jackson states constructed
in `POSITIVE_XI_KERNEL_FEJER_GROUND_TRANSFER_AUDIT.md` belong to this cone.
Pointwise positivity is only a sufficient way to enter `C_N`; the cone
itself is exactly the all-imaginary-axis condition relevant here.

## 2. Exact spherical-cap theorem

For a unit vector `z in C_N`, define its normalized cone depth by

\[
 \boxed{
 m_{\mathcal C}(z)
 =\min_{\alpha\in[0,\infty]}
   {\langle b_\alpha,z\rangle\over\|b_\alpha\|}.}  \tag{2.1}
\]

Compactness and strict cone membership give

\[
 0<m_{\mathcal C}(z)\leq1.                         \tag{2.2}
\]

### Theorem 2.1 (largest spherical cap)

Assume `N>=1`.  On the unit sphere in the real even coefficient space, the
geodesic distance from `z` to the complement of `C_N` is exactly

\[
 \boxed{
 \operatorname {dist}_{S}(z,\mathcal C_N^c)
 =\arcsin m_{\mathcal C}(z).}                      \tag{2.3}
\]

Consequently, if a unit vector `x` is phased so that
`<x,z>>=0` and

\[
 \sin\angle(x,z)<m_{\mathcal C}(z),                \tag{2.4}
\]

then `x in C_N`.

**Proof.**  Fix `alpha`, put

\[
 \widehat b={b_\alpha\over\|b_\alpha\|},
 \qquad m_\alpha=\langle\widehat b,z\rangle>0,
\]

and write a unit `x` at angle `theta` from `z` as

\[
 x=\cos\theta\,z+\sin\theta\,u,
 \qquad u\perp z,\quad\|u\|=1.
\]

Cauchy--Schwarz on the component of `widehat b` perpendicular to `z` gives

\[
 \langle\widehat b,x\rangle
 \geq m_\alpha\cos\theta
      -\sqrt{1-m_\alpha^2}\sin\theta.              \tag{2.5}
\]

The right side is positive exactly when
`theta<arcsin(m_alpha)`.  Taking the minimum over `alpha` proves that the
open cap of radius `arcsin(m_C(z))` lies in `C_N`.

For sharpness, let `alpha_*` attain the minimum in (2.1).  If
`m=m_C(z)<1`, the unit vector

\[
 y_*={z-m\widehat b_*
          \over\sqrt{1-m^2}}                       \tag{2.6}
\]

lies on the hyperplane `<b_(alpha_*),y>=0` and has
`angle(z,y_*)=arcsin(m)`.  If `m=1`, any unit vector perpendicular to `z`
lies on that hyperplane and is at angle `pi/2`.  Thus no larger spherical
cap can be guaranteed.  This proves (2.3) and (2.4).  \(\square\)

The theorem is optimal among arguments that know only the Hilbert-space
angle from the trial state.  It is stronger than transferring pointwise
positivity: the halfspaces in (1.8) are precisely the transform signs that
the odd-inertia theorem needs.

### Corollary 2.2 (odd sign at the even ground)

Let `x` be the unit eigenvector of a simple lowest eigenvalue `epsilon` of
the source even compression.  If (2.4) holds for a unit `z in C_N`, then

\[
 x_0=B_x(0)>0,
 \qquad c_x=B_x(\infty)>0,
 \qquad A_x(\alpha)={B_x(\alpha)\over c_x}>0.       \tag{2.7}
\]

The two required nonvanishing hypotheses are therefore automatic.  The
source factorization and inertia theorem give

\[
 \boxed{Q_- -\epsilon I\succ0.}                    \tag{2.8}
\]

This conclusion concerns the odd block at `epsilon`, not yet at a larger
Ritz upper value.

## 3. Endpoint conditioning and a sharp boundary obstruction

The two endpoint functionals in (1.6) immediately imply

\[
 \boxed{
 m_{\mathcal C}(z)\leq z_0,
 \qquad
 m_{\mathcal C}(z)\leq{c_z\over\sqrt{2N+1}}.}      \tag{3.1}
\]

The second estimate is the exact boundary-conditioning obstruction.  For
the positive constant unit state `z=e_0^+`, the weights in (1.5) increase
from zero to one and therefore

\[
 m_{\mathcal C}(e_0^+)={1\over\sqrt{2N+1}}.         \tag{3.2}
\]

The value in (3.2) is sharp: the nearest cone boundary is the endpoint
hyperplane `<d,y>=0`.

More generally, if `k` and `z` are unit vectors and `c_k=<d,k>`, then

\[
 |c_z-c_k|\leq\sqrt{2N+1}\,\|z-k\|.                \tag{3.3}
\]

If `c_k=0` and `z in C_N`, the spherical distance from `z` to `k` is at
least the distance from `z` to the hyperplane `d^perp`, namely

\[
 \angle(z,k)
 \geq\arcsin{c_z\over\sqrt{2N+1}}
 \geq\arcsin m_{\mathcal C}(z).                    \tag{3.4}
\]

Thus adding a positive boundary lift to a state on the endpoint hyperplane
cannot, by an ordinary norm estimate alone, create a spherical cap large
enough to recapture the original state.  For a small nonzero `c_k`, (3.3)
gives the corresponding quantitative conditioning loss.  This does not
exclude a source-specific directional estimate; it excludes a generic
boundary-lift argument based only on Hilbert norm.

## 4. Noncircular even-resolvent gate

Let `kappa` be a real unit even anchor and decompose the complete even block
as

\[
 Q_+=
 \begin{bmatrix}q&b^*\\ b&A\end{bmatrix}
 \quad\text{on}\quad
 \mathbb R\kappa\oplus(\kappa^\perp\cap H_+).      \tag{4.1}
\]

Suppose `U` is a rigorously established variational upper bound for the
lowest even eigenvalue `mu`, and

\[
 A-U I\succ0.                                      \tag{4.2}
\]

Define the even-only shifted-solve quantity

\[
 \tau_+=\|(A-U I)^{-1}b\|.                         \tag{4.3}
\]

### Lemma 4.1 (even angle without an odd hypothesis)

The lowest even eigenvalue is simple.  Its unit eigenvector `x`, phased so
that `<kappa,x>>0`, satisfies

\[
 \boxed{
 \tan\angle(x,\kappa)\leq\tau_+,
 \qquad
 \angle(x,\kappa)\leq\arctan\tau_+.}              \tag{4.4}
\]

**Proof.**  Write `x=a*kappa+v`, where `v` is in the complementary even
space and `a>0`.  Interlacing and (4.2) give simplicity and `a!=0`.  The
complementary eigenvector equation is

\[
 (A-\mu I)v=-ab.                                   \tag{4.5}
\]

Because `mu<=U<lambda_min(A)`, spectral calculus for the one Hermitian
matrix `A` gives

\[
 {\|v\|\over a}
 =\|(A-\mu I)^{-1}b\|
 \leq\|(A-U I)^{-1}b\|.                            \tag{4.6}
\]

The left side is the tangent of the angle.  No information about `Q_-` was
used.  \(\square\)

Choose the harmless sign of `kappa` so that `<kappa,z>>=0`, and put

\[
 \theta_0=\angle(\kappa,z)\in[0,\pi/2].            \tag{4.7}
\]

The spherical triangle inequality and Theorem 2.1 prove the announced
noncircular gate

\[
 \boxed{
 \arctan(\tau_+)+\theta_0
 <\arcsin m_{\mathcal C}(z)
 \quad\Longrightarrow\quad
 Q_- -\mu I\succ0.}                                \tag{4.8}
\]

A certified upper enclosure `T_+>=tau_+` may replace `tau_+`.  In
particular, the residual-checked shifted solve in equation (4.15) of
`DIRECT_RH_ATTACK.md` can supply `T_+` using only the even complement.  If
`kappa=z`, (4.8) is equivalently

\[
 {\tau_+\over\sqrt{1+\tau_+^2}}<m_{\mathcal C}(z). \tag{4.9}
\]

For a trigonometric-free check of (4.8), put
`s_0=sin(theta_0)` and `c_0=cos(theta_0)`.  It is enough to verify

\[
 \theta_0+\arctan T_+<\frac\pi2,
 \qquad
 {s_0+T_+c_0\over\sqrt{1+T_+^2}}
 <m_{\mathcal C}(z).                               \tag{4.10}
\]

The first inequality selects the monotone branch of sine; the second is
then exactly (4.8).

After (4.8), the direct bridge still needs

\[
 U-\mu<\lambda_{\min}(Q_- -\mu I)                  \tag{4.11}
\]

to conclude `Q_- - U I` is positive.  Neither (4.8) nor (4.11) implies the
locally uniform determinant limit or the weighted convergence in equation
(5.2) of `DIRECT_RH_ATTACK.md`.

## 5. Exact boundary-normalized robustness radius

There is a complementary affine formulation.  Let `p` and `y` be
boundary-normalized, so

\[
 \langle d,p\rangle=\langle d,y\rangle=1,
 \qquad h=y-p\in d^\perp.                           \tag{5.1}
\]

Put

\[
 r_n(\alpha)={n^2\over n^2+\alpha^2},
 \qquad
 a_\alpha=(0,-\sqrt2r_1,\ldots,-\sqrt2r_N).        \tag{5.2}
\]

Then

\[
 A_y(\alpha)-A_p(\alpha)=\langle a_\alpha,h\rangle.
                                                               \tag{5.3}
\]

The exact norm of this functional restricted to `d^perp` is

\[
\boxed{
 s_N(\alpha)^2
 =2\sum_{n=1}^Nr_n(\alpha)^2
  -{4\left(\sum_{n=1}^Nr_n(\alpha)\right)^2
     \over2N+1}.}                                  \tag{5.4}
\]

If `p` has positive response, the largest open ordinary `L2` ball about
`p`, inside the boundary-normalized affine space and contained in the
response cone, has radius

\[
 \boxed{
 \rho_A(p)=\inf_{\alpha\in[0,\infty]}
 {A_p(\alpha)\over s_N(\alpha)},}                  \tag{5.5}
\]

where a ratio with zero denominator is interpreted as infinity.
Indeed, Cauchy--Schwarz proves sufficiency.  Conversely, whenever
`s_N(alpha)>0`, the perturbation

\[
 h_\alpha
 =-{A_p(\alpha)\over s_N(\alpha)^2}
   P_{d^\perp}a_\alpha                             \tag{5.6}
\]

has boundary zero, norm `A_p(alpha)/s_N(alpha)`, and puts the response
exactly on the hyperplane `A_(p+h)(alpha)=0`.  Thus (5.5) is sharp, not a
triangle-inequality artifact.

For any positive diagonal weight matrix `W`, the exact restricted dual norm
is

\[
 \boxed{
 s_W(\alpha)^2
 =a_\alpha^*W^{-1}a_\alpha
  -{|d^*W^{-1}a_\alpha|^2\over d^*W^{-1}d}.}       \tag{5.7}
\]

Replacing `s_N` by `s_W` in (5.5) gives the exact weighted robustness
radius.  For Sobolev weights `W_nn=(1+n^2)^s`,

\[
 s_W(\alpha)^2
 \leq2\sum_{n=1}^N(1+n^2)^{-s},                   \tag{5.8}
\]

which is bounded uniformly in `N` for `s>1/2`.  With the mode derivative
`mathcal D`, one has the sharper elementary estimate

\[
 |A_y(\alpha)-A_p(\alpha)|
 \leq
 \left(2\sum_{n=1}^N{n^2\over(n^2+\alpha^2)^2}\right)^{1/2}
 \|\mathcal D h\|
 <{\pi\over\sqrt3}\|\mathcal D h\|.              \tag{5.9}
\]

Thus a boundary-normalized `H^1` estimate could bypass the generic
`N^(-1/2)` ordinary-norm barrier.  No admitted source theorem supplies that
estimate for the actual ground line.

## 6. Exact boundary-zero reproducing kernel

For completeness, write `t=L/2-y`, `theta=2*pi*y/L`.  Endpoint evaluation
on the real even basis has vector

\[
 v(y)=L^{-1/2}
 (1,\sqrt2\cos\theta,\ldots,\sqrt2\cos N\theta).   \tag{6.1}
\]

For a boundary-zero even state `h`, so `<d,h>=0`, the exact evaluation norm
is

\[
\boxed{
 R_N(y)^2
 ={2N+1+D_N(2\theta)\over2L}
  -{D_N(\theta)^2\over L(2N+1)},}                  \tag{6.2}
\]

where `D_N(theta)=1+2 sum_(n=1)^N cos(n*theta)`.  Hence

\[
 |h(L/2-y)|\leq R_N(y)\|h\|,                       \tag{6.3}
\]

with equality for the projected evaluation vector.  Formula (6.2) is just
`||P_(d^perp)v(y)||^2`.  It gives `R_N(0)=0`; in fact the zero is of order
two because a periodic even boundary-zero polynomial and its first
derivative vanish at the endpoint.

For the `W` norm, replace (6.2) by

\[
 R_W(y)^2
 =v(y)^*W^{-1}v(y)
  -{|d^*W^{-1}v(y)|^2\over d^*W^{-1}d}.            \tag{6.4}
\]

If `p` is boundary-normalized and pointwise positive, the exact weighted
ball that preserves pointwise positivity has radius

\[
 \inf_{|t|\leq L/2}{p(t)\over R_W(L/2-t)},          \tag{6.5}
\]

with zero denominators omitted.  This improves the crude global evaluation
bound, but it is stronger than necessary: the response-cone radii (2.1) and
(5.5) target precisely the odd sign.

## 7. Source commutator correction and the remaining inverse action

There is an exact source-structured alternative to a raw norm comparison.
Let

\[
 \bar x={x\over c_x},\qquad
 \bar p={p\over c_p},\qquad
 \rho=(Q_+-\epsilon I)\bar p,
 \qquad T_-=Q_- -\epsilon I.                       \tag{7.1}
\]

Both barred states have boundary value one.  The source commutator gives

\[
 T_-\mathcal D\bar x=-\beta,
 \qquad
 T_-\mathcal D\bar p=\mathcal D\rho-\beta,        \tag{7.2}
\]

and hence

\[
 \boxed{
 T_-\mathcal D(\bar x-\bar p)=-\mathcal D\rho.}   \tag{7.3}
\]

Under the explicit simple-even-ground and nonvanishing hypotheses of the
source factorization, `T_-` is invertible before its sign is known.  Put

\[
 w=T_-^{-1}\mathcal D\rho,
 \qquad
 g_\alpha=\sum_{n=1}^N
 {\sqrt2n\over n^2+\alpha^2}e_n^- .                \tag{7.4}
\]

Equations (5.3) and (7.3) give the exact signed correction

\[
 \boxed{
 A_x(\alpha)
 =A_p(\alpha)+\langle g_\alpha,w\rangle.}          \tag{7.5}
\]

In particular,

\[
 \|g_\alpha\|^2
 =2\sum_{n=1}^N{n^2\over(n^2+\alpha^2)^2}
 <{\pi^2\over3}.                                  \tag{7.6}
\]

Therefore the noncircular sufficient condition

\[
 \boxed{
 \|T_-^{-1}\mathcal D\rho\|
 <{\sqrt3\over\pi}
   \inf_{\alpha\geq0}A_p(\alpha)}                \tag{7.7}
\]

also proves the odd sign.  Invertibility, rather than positivity, is all
that is assumed in forming the solve.  The exact all-axis condition (7.5)
is sharper than (7.7).

For (7.3)--(7.7), `rho` must be formed with the **complete** source matrix
in (0.2) before a norm or absolute value is taken.  Splitting the pole,
archimedean, and prime responses and then applying a triangle inequality
destroys the cancellation being tested.  Existing prolate asymptotics do
not bound the inverse action in (7.7); the identity isolates rather than
solves that missing estimate.

## 8. Why the current prolate asymptotics do not close the gate

For a positive Fejer state `p_(a,N)` and its unit representative
`z=p_(a,N)/||p_(a,N)||`, (3.1) reads

\[
 m_{\mathcal C}(z)
 \leq {\sqrt L\,p_{a,N}(a)
           \over\sqrt{2N+1}\,\|p_{a,N}\|}.         \tag{8.1}
\]

On the existence diagonal in the positive-kernel audit,

\[
 \|p_{a,N}-K\|_{L^\infty([-a,a])}\leq e^{-a^2}.
\]

The Gaussian arithmetic formula makes `K(a)` tend to zero faster than any
ordinary exponential in `a`, while the zero-extended states converge in
`L2` to the nonzero `K`.  Thus the right side of (8.1), and hence the cone
depth, tends to zero on that diagonal.  Positivity at every finite pair does
not provide a useful uniform depth.

The source-derived prolate results currently provide:

1. order-by-order, and separately Gevrey/exponential, approximation for the
   source comparison state;
2. projection and transform estimates for that state; and
3. no even-complement solve placing the actual ground inside a shrinking
   response cone, no projective endpoint lower bound, and no estimate of
   the inverse action in (7.7).

Accordingly, an actionable sufficient target on one explicit unbounded
schedule is

\[
 \boxed{
 \arctan T_+(\lambda,N)
 +\angle(\kappa_{\lambda,N},z_{\lambda,N})
 <\arcsin m_{\mathcal C}(z_{\lambda,N}),}           \tag{8.2}
\]

where every quantity is independently enclosed and `z_(lambda,N)` is an
explicit positive finite state.  One must then prove the separate shifted
reserve (4.11) and the weighted local-uniform condition (5.2) of
`DIRECT_RH_ATTACK.md`.  No theorem presently in the source lock proves
(8.2), (4.11), or their required unbounded-schedule combination.

## 9. Finite verification requirements

At a finite pilot pair, an honest replay of this route must reconstruct the
trial coefficients and the complete source matrix rather than trust a
stored eigensystem or a producer pass flag.  It must enclose:

1. the minimum in (2.1), including `alpha=0` and `alpha=infinity`;
2. the angle from the independently reconstructed even anchor;
3. the upper variational value, the positive even-complement reserve, and a
   residual-checked enclosure of `tau_+`;
4. the strict inequality (4.8), followed separately by (4.11); and
5. the transform/projection quantities required by equation (5.2) of the
   direct attack.

Point samples of `alpha`, binary64 parsing of source parameters, real-axis
eigenvalue agreement, or positivity of a non-ground comparison vector do
not certify any of these strict gates.  The present note supplies the exact
finite geometry and identifies the missing estimates; it does not supply
the asymptotic schedule.
