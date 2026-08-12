# Projected-anchor origin jet and one-height ground gate

## 1. Claim boundary

This note proves two finite/source-asymptotic reductions that sharpen the
zero-height route of checkpoint 0.48.

First, the source-normalized projected prolate anchor has a convergent origin
two-jet.  On the quadratic schedule this gives the desired
`O((log lambda)^(-2))` inverse-square coefficient functional for the anchor
itself.  This conclusion uses the pinned fixed-index prolate theorem and does
not use a zeta-zero table.

Second, for the actual even ground line, bounded zero-height trace is
equivalent to a single fixed-height quotient-product bound.  At height `1/2`
that quotient is exactly a pole-block leverage ratio, a mixed cofactor of the
complete finite source matrix, and a relative odd response.  This is an exact
reduction, not the missing arithmetic estimate.

Nothing here proves that the actual ground line approaches the projected
anchor, that the shifted even complement is positive on an unbounded
schedule, or that the required solve tends to zero.  No locally uniform
determinant limit follows.  The project state remains `P0_INVALIDATED`.

## 2. Locked normalization and centered basis

Put

\[
 L=2\log\lambda,\qquad I_\lambda=[-L/2,L/2],
\]

and retain the source-normalized functions

\[
 h(x)={\pi\over2}x^2(2\pi x^2-3)e^{-\pi x^2},
 \qquad K(y)=E(h)(e^y),
\]

where

\[
 E(f)(u)=u^{1/2}\sum_{m\geq1}f(mu).
\]

The pinned normalization audit gives, with
`s=1/2-iz`,

\[
 \widehat K(z)=\int_{\mathbb R}K(y)e^{-izy}\,dy
 ={\Xi(z)\over4}.                                  \tag{2.1}
\]

The factor `1/4` is mandatory.  It is the value obtained from the printed
source formulas, rather than the inconsistent scalar asserted later in the
source.

Let

\[
 f_\lambda(y)=k_\lambda^+(e^y),\qquad
 p_{\lambda,N}=P_Nf_\lambda,\qquad
 a_{\lambda,N}=\|p_{\lambda,N}\|_2,
 \qquad
 \kappa_{\lambda,N}={p_{\lambda,N}\over a_{\lambda,N}}.  \tag{2.2}
\]

Here `k_lambda^+=(k_lambda+Jk_lambda)/2`; inversion is not assumed before
this evenization.  The centered locked modes are

\[
 \phi_n(y)=(-1)^nL^{-1/2}e^{2\pi iny/L},
 \qquad |n|\leq N.                                \tag{2.3}
\]

The phase `(-1)^n` is the translation from the source interval `[0,L]` to
`I_lambda` and may not be discarded.

Retain the exact comparison quantity

\[
 \mathcal A_\lambda
 =\delta_\lambda\sqrt{\lambda^3-\lambda}+R_h(\lambda),   \tag{2.4}
\]

where `delta_lambda` and the explicit Gaussian term `R_h` are defined in
`notes/PROJECTION_RATE_THEOREM.md`.  The proved finite comparison is

\[
 \|f_\lambda-K\|_{L^2(I_\lambda)}
 \leq\mathcal A_\lambda.                          \tag{2.5}
\]

The only asymptotic prolate input used below is the pinned, non-effective
statement

\[
 \delta_\lambda=O(\lambda^{-2}).                  \tag{2.6}
\]

An unspecified constant in (2.6) must not be inserted into a finite
certificate.

## 3. Exact origin functionals

For an inversion-even function on `I_lambda`, define

\[
 \ell_0(v)=\widehat v(0),\qquad
 \ell_2(v)=\left.{d\over dt}\widehat v(i\sqrt t)
                     \right|_{t=0}
 ={1\over2}\int_{-L/2}^{L/2}y^2v(y)\,dy.          \tag{3.1}
\]

Direct integration in the centered basis gives

\[
 \ell_0(\phi_0)=\sqrt L,\qquad
 \ell_0(\phi_n)=0\quad(n\ne0),                    \tag{3.2}
\]

and

\[
 \ell_2(\phi_0)={L^{5/2}\over24},\qquad
 \ell_2(\phi_n)={L^{5/2}\over4\pi^2n^2}
 \quad(n\ne0).                                    \tag{3.3}
\]

Also

\[
 \|y^2/2\|_{L^2(I_\lambda)}={L^{5/2}\over8\sqrt5}.       \tag{3.4}
\]

### 3.1 Explicit limiting-state tails

The existing pointwise estimate

\[
 |K(\log u)|\leq\pi^2S_4u^{9/2}e^{-\pi u^2},
 \qquad u\geq1,                                   \tag{3.5}
\]

with

\[
 S_4=1+{e^\pi\Gamma(5/2,\pi)\over2\pi^{5/2}},     \tag{3.6}
\]

and the evenness of `K` imply

\[
 T_0(\lambda):=\int_{|y|>L/2}|K(y)|\,dy
 \leq S_4\pi^{-1/4}\Gamma(9/4,\pi\lambda^2),     \tag{3.7}
\]

and, using `(log u)^2<=u^2` for `u>=1`,

\[
 T_2(\lambda):={1\over2}\int_{|y|>L/2}y^2|K(y)|\,dy
 \leq {S_4\over2\pi^{5/4}}
       \Gamma(13/4,\pi\lambda^2).                 \tag{3.8}
\]

Both inversion-reflected tails are included.

### 3.2 A sharper Fourier tail for the second moment

Write `K=sum c_n phi_n` on `I_lambda`.  The pinned derivative estimate gives

\[
 \sum_{n\in\mathbb Z}
 \left({2\pi n\over L}\right)^2|c_n|^2
 \leq C_*^2,\qquad C_*={3003\over500}.            \tag{3.9}
\]

Weighted Cauchy--Schwarz and (3.3) give

\[
\begin{aligned}
 |\ell_2((I-P_N)K)|
 &\leq C_*
 \left(\sum_{|n|>N}
 { |\ell_2(\phi_n)|^2\over(2\pi n/L)^2}
 \right)^{1/2}\\
 &\leq {C_*L^{7/2}\over4\sqrt{10}\,\pi^3N^{5/2}}.       \tag{3.10}
\end{aligned}
\]

Indeed, both signs are retained and

\[
 \sum_{|n|>N}
 { |\ell_2(\phi_n)|^2\over(2\pi n/L)^2}
 ={L^7\over32\pi^6}\sum_{n>N}{1\over n^6}
 \leq {L^7\over160\pi^6N^5}.                    \tag{3.11}
\]

Using the ordinary `L^2` Fourier-tail estimate here would impose a much
stronger schedule for no mathematical reason.

## 4. Projected-anchor two-jet theorem

Because `P_N` preserves the zero mode, (2.1), (2.5), and (3.7) give the
finite estimate

\[
 \boxed{
 \left|\ell_0(p_{\lambda,N})-{\Xi(0)\over4}\right|
 \leq\sqrt L\,\mathcal A_\lambda+T_0(\lambda).}   \tag{4.1}
\]

For the second moment, project the comparison error first and apply the
weighted limiting-state tail only to `K`.  Equations (2.1), (3.4), (3.8),
and (3.10) give

\[
 \boxed{
 \left|\ell_2(p_{\lambda,N})+{\Xi''(0)\over8}\right|
 \leq {L^{5/2}\over8\sqrt5}\mathcal A_\lambda
 +{C_*L^{7/2}\over4\sqrt{10}\,\pi^3N^{5/2}}
 +T_2(\lambda).}                                  \tag{4.2}
\]

The sign and factor in (4.2) follow from

\[
 \widehat K(i\sqrt t)
 ={\Xi(i\sqrt t)\over4}
 ={\Xi(0)\over4}-{\Xi''(0)\over8}t+O(t^2).       \tag{4.3}
\]

### Theorem 4.1 (normalized anchor origin jet)

Assume (2.6) and let the integer schedule satisfy

\[
 {N(\lambda)\over L^{7/5}}\longrightarrow\infty. \tag{4.4}
\]

Then every term on the right sides of (4.1)--(4.2) tends to zero.  Condition
(4.4) also implies `log(lambda)/(N+1)->0`, so the pinned norm theorem gives

\[
 a_{\lambda,N}\longrightarrow
 a_\infty:=\|K\|_{L^2(\mathbb R)}>0.              \tag{4.5}
\]

Consequently, for

\[
 K_0=\ell_0(\kappa_{\lambda,N}),\qquad
 K_2=\ell_2(\kappa_{\lambda,N}),                  \tag{4.6}
\]

one has

\[
 K_0\longrightarrow{\Xi(0)\over4a_\infty},
 \qquad
 K_2\longrightarrow-{\Xi''(0)\over8a_\infty},   \tag{4.7}
\]

and therefore

\[
 \boxed{
 {K_2\over K_0}\longrightarrow
 -{\Xi''(0)\over2\Xi(0)}.}                       \tag{4.8}
\]

The denominator is nonzero without any zero list.  At `s=1/2`, the
alternating eta series is positive and `1-2^(1-s)<0`, so `zeta(1/2)<0`.
The remaining real factors in `xi(1/2)` show `Xi(0)>0`.

Both `N=3*ceil(lambda^2)` and the locked odd-`p` exponential schedule satisfy
(4.4).  The theorem is qualitative at large `lambda`: the source theorem
(2.6) does not print an effective constant or starting threshold.

## 5. The anchor inverse-square coefficient rate

Use the normalized even basis

\[
 e_0^+=\phi_0,\qquad e_n^+={\phi_n+\phi_{-n}\over\sqrt2}
 \quad(1\leq n\leq N),                            \tag{5.1}
\]

and write a real even vector as

\[
 v=v_0e_0^++\sum_{n=1}^{N}v_ne_n^+,qquad v_0\ne0.       \tag{5.2}
\]

Equations (3.2)--(3.3) give the exact identity

\[
 {\ell_2(v)\over\ell_0(v)}
 =L^2\left({1\over24}
 +{\sqrt2\over4\pi^2}
   \sum_{n=1}^{N}{v_n\over v_0n^2}\right).        \tag{5.3}
\]

Define the checkpoint-0.48 ground-direction functional

\[
 z_N=\left(\sum_{n=1}^{N}{1\over n^2}\right)e_0^+
 +\sqrt2\sum_{n=1}^{N}{e_n^+\over n^2}.           \tag{5.4}
\]

Since `sum_(n>=1)n^(-2)=pi^2/6`, (5.3) is equivalent to

\[
 \boxed{
 \left({L\over2\pi}\right)^2{\langle z_N,v\rangle\over v_0}
 ={\ell_2(v)\over\ell_0(v)}
 -\left({L\over2\pi}\right)^2
  \sum_{n>N}{1\over n^2}.}                       \tag{5.5}
\]

The exterior term in (5.5) is mandatory.  Applying (4.8) to the anchor and
assuming in addition that `N/L^2` is bounded away from zero yields

\[
 \boxed{
 {\langle z_N,\kappa_{\lambda,N}\rangle
   \over(\kappa_{\lambda,N})_0}
 =O(L^{-2}).}                                     \tag{5.6}
\]

Thus the projected source-normalized anchor already occupies the required
quantitative zero-height affine slice on the quadratic and exponential
schedules.  Equation (5.6) is not a statement about the actual finite Weil
ground vector.

Unit-normalizing `h_lambda` would change the unnormalized limiting transform
from `Xi/4` to `2^(17/4)*Xi/(4*sqrt(33))` and would multiply `a_infinity` by
the same factor.  The unit anchor `kappa=p/||p||` and its normalized jets
`K_0,K_2` are exactly invariant under this positive scalar rescaling because
the two factors cancel.  The substitution is nevertheless rejected: it
changes the source-locked unnormalized statements (4.1)--(4.2), the limiting
transform, and the projected-norm normalization.  Normalized projective
invariance is not permission to alter those source formulas.

## 6. One fixed height controls the true-ground trace

Now return to the exact finite even ground line and the checkpoint-0.48
domain: the ground is simple and even, its boundary scalar and zero
coefficient do not vanish, and the shifted odd block is positive.  Let

\[
 Z_{\lambda,N}^{(0)}=\sum_{k=1}^{N}{1\over\rho_k^2}
\]

be the half-paired zero-height trace.  For any fixed `sigma>0`, define the
positive exterior lattice product

\[
 E_N(\sigma)=\prod_{n>N}
 \left(1+{\sigma^2\over(2\pi n/L)^2}\right),      \tag{6.1}
\]

and remove it from the exact ground transform:

\[
 B_\sigma={M_N(\sigma)\over M_N(0)E_N(\sigma)}
 =\prod_{k=1}^{N}\left(1+{\sigma^2\over\rho_k^2}\right). \tag{6.2}
\]

Positivity of every elementary symmetric term and `log(1+u)<=u` give the
sharp finite sandwich

\[
 \boxed{
 {\log B_\sigma\over\sigma^2}
 \leq Z_{\lambda,N}^{(0)}
 \leq {B_\sigma-1\over\sigma^2}.}                 \tag{6.3}
\]

The upper inequality is an equality for one quotient-root pair.  Hence a
uniform bound on `Z^(0)` is equivalent to a uniform bound on `B_sigma` at any
one fixed positive height.  This equivalence requires no pointwise
positivity of the ground polynomial.

At `sigma=1/2`, put

\[
 E=E_N(1/2),\qquad \alpha={L\over4\pi}.            \tag{6.4}
\]

Then

\[
 4\log\left({M_N(1/2)\over M_N(0)E}\right)
 \leq Z_{\lambda,N}^{(0)}
 \leq4\left({M_N(1/2)\over M_N(0)E}-1\right).    \tag{6.5}
\]

The exterior product is never silently replaced by one.

## 7. Height `1/2` is exactly pole leverage

In the raw centered basis, the closed pole block is

\[
 (P)_{nm}=32L\sinh^2(L/4)
 {L^2-16\pi^2mn
  \over(L^2+16\pi^2m^2)(L^2+16\pi^2n^2)}.         \tag{7.1}
\]

Set

\[
 a_n={L\over L^2+16\pi^2n^2},\qquad
 d_n={4\pi n\over L^2+16\pi^2n^2}.               \tag{7.2}
\]

Then

\[
 P=32L\sinh^2(L/4)(aa^*-dd^*).                   \tag{7.3}
\]

For a real inversion-even ground vector `x`, `d^*x=0` and direct Fourier
integration gives

\[
 \widehat x(i/2)=4\sqrt L\sinh(L/4)a^*x,
 \qquad
 \langle x,Px\rangle=2|\widehat x(i/2)|^2.        \tag{7.4}
\]

Since `widehat x(0)=sqrt(L)*x_0`, the positive product formula fixes the
sign and yields

\[
 \boxed{
 {M_N(1/2)\over M_N(0)}
 =\sqrt{{\langle x,Px\rangle\over2L|x_0|^2}}.}    \tag{7.5}
\]

The complete finite matrix is assembled as pole minus archimedean minus
prime before its ground projector is formed.  If

\[
 T_+=Q_+-\epsilon I,
\]

then its one-dimensional kernel and positive complement give the
eigenvector-free form

\[
 \boxed{
 \left({M_N(1/2)\over M_N(0)}\right)^2
 ={\operatorname {Tr}(P_+\operatorname {adj}T_+)
   \over
   2L\langle e_0^+,\operatorname {adj}(T_+)e_0^+\rangle}.} \tag{7.6}
\]

Taking separate norms of pole, archimedean, and prime blocks before (7.6)
would destroy the cancellation in the actual ground projector.

There is also an exact odd-response form.  In the normalized odd basis let

\[
 (g_a)_n={\sqrt2\,n\over n^2+a^2},\qquad
 A(a)=1+\langle g_a,T_-^{-1}\beta\rangle.         \tag{7.7}
\]

The source commutator identity gives

\[
 \boxed{
 {M_N(1/2)\over M_N(0)}
 ={4\sinh(L/4)\over L}
 {1+\langle g_\alpha,T_-^{-1}\beta\rangle
  \over1+\langle g_0,T_-^{-1}\beta\rangle}.}     \tag{7.8}
\]

Combining (6.5) and (7.8) makes the missing arithmetic estimate explicit.
For any `C>=0`,

\[
 Z_{\lambda,N}^{(0)}\leq C
 \quad\Longrightarrow\quad
 {A(\alpha)\over A(0)}
 \leq {LE\over4\sinh(L/4)}e^{C/4},               \tag{7.9}
\]

while

\[
 {A(\alpha)\over A(0)}
 \leq {LE\over4\sinh(L/4)}\left(1+{C\over4}\right)
 \quad\Longrightarrow\quad
 Z_{\lambda,N}^{(0)}\leq C.                      \tag{7.10}
\]

On schedules with `N/L^2` bounded away from zero, `E` is uniformly bounded.
Thus the true-ground rate is reduced to the single cancellation-preserving
relative response

\[
 {A(L/(4\pi))\over A(0)}=O(Le^{-L/4}).            \tag{7.11}
\]

Neither odd positivity nor a norm bound for `T_-^(-1)` proves (7.11).
The exact `N=1` Cauchy family from checkpoint 0.48 realizes arbitrary
positive quotient scale and makes the upper inequality in (6.3) an equality.

## 8. Exact scale of the remaining ground transfer

Decompose the complete even source matrix relative to the unit anchor:

\[
 Q_+=\begin{bmatrix}q&b^*\\b&A\end{bmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus\mathcal K,
 \qquad \mathcal K=\kappa^\perp.                 \tag{8.1}
\]

Let `U` be a Ritz upper bound and assume the presently unproved
unbounded-schedule sign

\[
 B=A-U I\succ0.                                   \tag{8.2}
\]

Put

\[
 \gamma=\lambda_{\min}(B),\qquad r=\|b\|,
 \qquad E_U=\langle b,B^{-1}b\rangle.             \tag{8.3}
\]

The residual `b` is assembled from the combined complete matrix before its
norm is taken.

Let `ell_0^*` and `ell_2^*` denote the Riesz vectors on the even space and
define

\[
 j=K_0\ell_2^*-K_2\ell_0^*.                      \tag{8.4}
\]

Because `j` represents the projective Wronskian functional,
`j` lies in `mathcal K`.  Equations (3.2)--(3.3) give the exact norms

\[
 \|P_\mathcal K\ell_0^*\|^2=L-|K_0|^2,           \tag{8.5}
\]

and

\[
 \boxed{
 \|j\|^2
 =\left|{K_0L^{5/2}\over24}-K_2\sqrt L\right|^2
 +{|K_0|^2L^5\over8\pi^4}
  \sum_{n=1}^{N}{1\over n^4}.}                   \tag{8.6}
\]

In particular, Theorem 4.1 makes `K_0` eventually bounded away from zero and
gives `||j||` of exact order `L^(5/2)`.

Let

\[
 \mathcal L_0(U)=\|B^{-1/2}P_\mathcal K\ell_0^*\|^2,
 \qquad
 \mathcal L_{J,0}(U)=\|B^{-1/2}j\|^2.            \tag{8.7}
\]

The orientation-free residual--gap estimates are

\[
 E_U\leq{r^2\over\gamma},\qquad
 \mathcal L_0(U)\leq{L-|K_0|^2\over\gamma},
 \qquad
 \mathcal L_{J,0}(U)\leq{\|j\|^2\over\gamma}.   \tag{8.8}
\]

Therefore

\[
 {E_U\mathcal L_0(U)\over|K_0|^2}
 \leq\left({r\over\gamma}\right)^2
       {L-|K_0|^2\over|K_0|^2},                  \tag{8.9}
\]

and

\[
 {E_U\mathcal L_{J,0}(U)\over|K_0|^4}
 \leq\left({r\over\gamma}\right)^2
       {\|j\|^2\over|K_0|^4}.                   \tag{8.10}
\]

Hence

\[
 \boxed{{r\over\gamma}=O(L^{-5/2})}              \tag{8.11}
\]

is sufficient for bounded true-ground origin curvature; little-`o` in
(8.11) identifies it with the anchor limit (4.8).  The power is sharp for an
orientation-free residual--gap argument: take `B=gamma*I` and choose `b`
parallel to `j`.

An even weaker one-solve criterion is available.  Define

\[
 \tau_U=\|B^{-1}b\|.                              \tag{8.12}
\]

For the actual ground correction
`z_mu=(A-mu*I)^(-1)b`, scalar-shift commutation and `mu<=U` give
`||z_mu||<=tau_U`.  Thus

\[
 |\ell_0(z_\mu)|\leq\sqrt L\,\tau_U,
 \qquad
 |K_0\ell_2(z_\mu)-K_2\ell_0(z_\mu)|
 \leq\|j\|\tau_U.                                \tag{8.13}
\]

It follows that

\[
 \boxed{\tau_U=O(L^{-5/2})}                       \tag{8.14}
\]

also suffices for bounded true-ground origin curvature, and little-`o`
identifies the anchor limit.  This logarithmic gate is substantially weaker
than the full weighted correction demanded by equation (5.2), but no current
source estimate proves (8.2), (8.11), or (8.14) on an unbounded schedule.

## 9. What remains open

The projected anchor is now quantitatively in the correct zero-height slice.
The unresolved step is transfer to the actual ground line.  In particular,
the repository still lacks:

- positivity of `B=A-U*I` on a common unbounded schedule;
- a positive lower enclosure for `gamma` on that schedule;
- a complete physical-complement preconditioner or an equivalent bound for
  `r/gamma` or `tau_U`;
- the actual arithmetic coefficient cone and the actual
  `p_1/p_0=O(L^(-2))` rate;
- the higher trace-moment limits and locally uniform characteristic-function
  convergence.

The radical sampling estimate is not a bound for `r`, `E_U`, or `tau_U`.
The existing scalar-to-action counterexample has all tested scalar radical
pairings zero while the action remains nonzero.  Likewise, Fourier-high
coercivity cannot be transferred to the physical complement without the
missing geometric comparison.

Accordingly, this checkpoint is a stronger exact reduction and an anchor
theorem, not an asymptotic proof for the finite Weil ground states.
