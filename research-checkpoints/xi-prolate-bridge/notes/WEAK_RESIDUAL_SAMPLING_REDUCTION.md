# Weak-residual duality and the absolute-sampling window target

## 1. Claim boundary

This note upgrades the exact radical leakage identity to a dual formulation
of the missing residual action.  It also gives a sufficient absolute-sampling
window theorem and an exact counterexample showing why the already-proved
scalar quadratic cancellations cannot imply that theorem.

Everything below is finite-dimensional linear algebra or ordinary
Cauchy--Schwarz on an absolutely summable sequence.  No reality of a zeta
zero, positivity of the Weil form, or zero table is used.  The required
window sampling estimates, left-preconditioned sector comparisons, and odd
sector floor are not proved here.  Equation (5.2) of `DIRECT_RH_ATTACK.md`
therefore remains open, and the repository state remains `P0_INVALIDATED`.

## 2. Exact graph-dual identity

Use the notation of `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`.  Let

\[
 p=a\kappa,\qquad a=\|p\|>0,\qquad
 R=K_{\rm global}-p=O+P,
\]

and put

\[
 \mathcal K=E_N^+\cap\kappa^\perp,
 \qquad b=(Q-q)\kappa,
 \qquad A=P_{\mathcal K}Q|_{\mathcal K}.
\]

Equation (4.5) of the leakage note says, for every
`v in mathcal K`,

\[
 \langle v,b\rangle=-\frac1a\,\mathcal W_Z(v,R).             \tag{2.1}
\]

Let `D` be any positive self-adjoint operator on `mathcal K`.  The change of
variables `w=Dv` in Hilbert-space duality gives the exact identity

\[
\boxed{
 \|D^{-1}b\|
 =\frac1a\sup_{v\ne0}
       \frac{|\mathcal W_Z(v,R)|}{\|Dv\|}.}                  \tag{2.2}
\]

This is not an inequality and does not use positivity of `mathcal W_Z`.
It identifies the precise test ball

\[
 \mathcal T_D=\{v\in\mathcal K:\|Dv\|\le1\}.                \tag{2.3}
\]

The graph norm in (2.2) is `||Dv||`, not `||D^(1/2)v||`.
The latter gives the different dual quantity `||D^(-1/2)b||`; converting it
to the Euclidean resolvent norm can reintroduce the smallest scale in `D`,
exactly as warned in equations (2.10)--(2.11) of
`notes/PRECONDITIONED_RESOLVENT_PROGRAM.md`.

Let `U>=u`, set `B=A-U I`, and suppose the already-proved left-preconditioned
hypothesis holds:

\[
 \rho=\|D^{-1}(B-D)\|\le\rho_0<1.                            \tag{2.4}
\]

Lemma 1 of the preconditioner note and (2.2) then give

\[
\boxed{
 \tau\le\|B^{-1}b\|
 \le\frac1{a(1-\rho_0)}
   \sup_{v\ne0}\frac{|\mathcal W_Z(v,R)|}{\|Dv\|}.}         \tag{2.5}
\]

Thus a weak estimate on the explicit ball (2.3), rather than another scalar
estimate on `R` alone, is the exact missing residual input.

## 3. A positive sampling seminorm that is not Weil positivity

For a state `f`, let

\[
 \|f\|_{\mathfrak Z}^2
 =\sum_\rho\left(
   |F_f(s_\rho)|^2+|F_f(\overline{s_\rho})|^2\right),        \tag{3.1}
\]

whenever the right side converges absolutely.  This is a positive seminorm
of two ordinary value sequences (and a norm on the quotient by their common
kernel).  It is not the signed Weil quadratic form.
Ordinary sequence Cauchy--Schwarz gives

\[
 |\mathcal W_Z(f,g)|
 \le\|f\|_{\mathfrak Z}\|g\|_{\mathfrak Z}.                 \tag{3.2}
\]

Equation (3.2) is valid without putting any zero on the real parameter axis.
It is the same noncircular sequence argument used in equation (4.9) of
`notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md`.

Let

\[
 \mathcal K=\bigoplus_m\mathcal K_m,
 \qquad D=\sum_m d_mP_m,
 \qquad d_m>0,                                               \tag{3.3}
\]

where the windows are defined from source-normalized prolate data, not from
Weil eigenvectors.  Suppose explicit quantities `epsilon_lambda` and
`beta_m` satisfy

\[
 \|R\|_{\mathfrak Z}^2\le\epsilon_\lambda,                  \tag{3.4}
\]

and

\[
 \sup_{\substack{v\in\mathcal K_m\\\|v\|=1}}
       \|v\|_{\mathfrak Z}^2\le\beta_m d_m.                  \tag{3.5}
\]

Then (2.1)--(3.2), applied separately on every orthogonal window, prove

\[
 \|P_mb\|^2
 \le\frac{\epsilon_\lambda\beta_m d_m}{a^2},                \tag{3.6}
\]

and hence

\[
\boxed{
 \|D^{-1}b\|^2
 \le\frac{\epsilon_\lambda}{a^2}
       \sum_m\frac{\beta_m}{d_m}.}                           \tag{3.7}
\]

Combining (2.4), (2.5), and `D_chord(t)<=t` gives the normalization-free
form needed by the determinant bridge:

\[
\boxed{
 aD_{\rm chord}(\tau)
 \le a\tau
 \le\frac1{1-\rho_0}
   \left(\epsilon_\lambda
         \sum_m\frac{\beta_m}{d_m}\right)^{1/2}.}           \tag{3.8}
\]

The factor `a=||p||` cancels.  No lower bound for the norm of the projected
comparison state is required by this route.

## 4. Why the scale is promising, and what is still absent

The proof of `notes/OUTER_OUTER_SPECTRAL_THEOREM.md` bounds the complete
absolute sample-square sequence for the actual corrected physical outer
state by an explicit constant times

\[
 D_S(\lambda)d_4=O(\lambda^7d_4).                            \tag{4.1}
\]

The pinned fixed-index prolate asymptotic gives

\[
 \lambda^8\frac{d_4}{d_8}
 \longrightarrow\frac{105}{4096\pi^4}.                     \tag{4.2}
\]

Consequently, if the full remainder satisfies (3.4) at the scale in (4.1)
and the growing source windows satisfy

\[
 \sum_m\frac{\beta_m}{d_m}=O(d_8^{-1}),                     \tag{4.3}
\]

then the square of the right side of (3.8) is `O(lambda^(-1))`.
This would give the desired `O(lambda^(-1/2))` weighted action.
Equations (4.1)--(4.3) are a route, not a completed theorem: the current
repository still lacks

1. an absolute zero-sampling bound for the compact projection remainder;
2. the window Bessel constants `beta_m` through the growing transition
   range, including physical lift and Gram conditioning;
3. the reciprocal-window sum (4.3); and
4. the left-preconditioned comparisons in both parity sectors.

A natural proof of (3.5) would construct, for every window vector, a
uniformly conditioned two-sided radical lift

\[
 K_v=v+R_v.
\]

At every zero parameter, radicality gives `F_v=-F_(R_v)`.  A
defect-relative absolute-sampling estimate for `R_v` would then prove (3.5)
without invoking Weil positivity.

## 5. Exact obstruction to a scalar-to-action inference

The need for new bilinear information is logical, not merely technical.
On the finite space with basis `(kappa,e,o)`, let

\[
 J=\operatorname{diag}(1,1,-1),\qquad
 Q=\begin{bmatrix}
 0&-1&0\\
 -1&1&0\\
 0&0&2
 \end{bmatrix}.                                               \tag{5.1}
\]

Then

\[
 q=0,\qquad b=-e,\qquad A=1,\qquad
 \alpha=1,\qquad\omega=2,                                  \tag{5.2}
\]

and the lower two-dimensional Ritz value and weighted action are

\[
 u=\frac{1-\sqrt5}{2},\qquad
 \tau=\frac1{1-u}=\frac{\sqrt5-1}{2}.                       \tag{5.3}
\]

Both strict sector comparisons hold.  With `U=0` and `D=1`, the
left-preconditioned defect is exactly zero, but `tau` remains bounded away
from zero.

This example can also satisfy the complete two-sided radical algebra and
all four scalar P/O conclusions.  On the global basis `(p,O,P,e,o)`, put

\[
 W=\begin{bmatrix}
 0&0&0&-1&0\\
 0&0&0& 1&0\\
 0&0&0& 0&0\\
 -1&1&0&1&0\\
 0&0&0&0&2
 \end{bmatrix}.                                               \tag{5.4}
\]

The compression to `(p,e,o)` is (5.1).  Moreover,

\[
 K_{\rm global}=p+O+P
\]

is a two-sided radical, while, for `R=O+P`,

\[
 W(O,O)=W(O,P)=W(P,O)=W(P,P)=W(R,R)=0.                       \tag{5.5}
\]

Nevertheless,

\[
 W(e,R)=1,\qquad W(e,p)=-1.                                  \tag{5.6}
\]

Thus `W(p,p)=W(R,R)=0=o(d_8)` for any positive sequence `d_8->0`, but the
residual column and `tau` do not decay.  Polarization within
`span(O,P)` remains identically zero and cannot recover the missing row
against `e`.  The counterexample does not refute a source-specific sampling
window theorem or another source-specific operator argument.  It proves only
that the existing scalar P/O identities and their polarization cannot supply
the missing graph-dual action bound.  The sampling-window theorem above is
one explicit sufficient route to that bound.
