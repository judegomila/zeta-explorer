# Cancellation-preserving Chebyshev-error rewrite

## 1. Scope

This note rewrites the exact finite Weil form, after its Rayleigh shift, as a
single signed integral.  Pole, archimedean, and prime contributions are
combined before any absolute value is taken.  The identity uses no zeta-zero
table and no Weil-positivity assumption.

The resulting Chebyshev-error kernel has no fixed sign.  Accordingly, this is
an exact reduction of the missing estimate, not a positivity theorem, a
shifted-resolvent bound, determinant convergence, or an RH conclusion.

## 2. Source distribution and Stieltjes convention

Let

\[
 \psi_C(X)=\sum_{2\leq n\leq X}\Lambda(n)
\]

be right-continuous.  Thus

\[
 d\psi_C(e^x)=\sum_{n\geq2}\Lambda(n)\,\delta_{\log n},
\]

and the source prime integral is over `(0,L]`.  A prime power at
`n=e^L=lambda^2` is included.

For a source correlation `omega` on `[0,L]`, zero-extended after `L`, put

\[
 w(x)=e^{-x/2}\omega(x),\quad
 E_C(x)=e^x-\psi_C(e^x),
\]

\[
 \sigma(x)=\frac1{e^x-e^{-x}},\qquad
 \tau(x)=\frac{e^{-5x/2}}{1-e^{-2x}},
\]

and `C_0=gamma+log(4*pi)`.  Direct substitution into locked source
equations (3.13)--(3.16), with the minus sign on the prime block, gives

\[
\begin{aligned}
 \Psi^\#(\omega)
 &=\int_{(0,L]}w\,dE_C\\
 &\quad+\int_0^\infty
   \bigl(\sigma(x)\omega(0)-\tau(x)\omega(x)\bigr)\,dx
 -\frac{C_0}{2}\omega(0).                         \tag{2.1}
\end{aligned}
\]

When `omega(0)` is nonzero, the bracket in (2.1) is a single locally
integrable bracket and must not be split into two divergent integrals.

## 3. The zero-origin identity

Every source correlation satisfies `omega(L)=0`.  If also `omega(0)=0`, then
(2.1) reduces to

\[
 \Psi^\#(\omega)=\int_{(0,L]}w\,dE_C-\int_0^L\tau\omega\,dx. \tag{3.1}
\]

Lebesgue--Stieltjes integration by parts gives

\[
 \int_{(0,L]}w\,dE_C=-\int_0^L E_C(x)w'(x)\,dx.   \tag{3.2}
\]

There is no endpoint correction: `w(0)=w(L)=0`; if `e^L` is a prime power,
the jump at `L` is killed by `w(L)`.

Now set

\[
 H(x)=-\frac12\log(1-e^{-2x}),\qquad
 H'(x)=-\frac1{e^{2x}-1}.
\]

Because `omega(x)=O(x)` at zero, `H(x)w(x)` tends to zero there.  A second
integration by parts shows

\[
 \int_0^L H(x)w'(x)\,dx=\int_0^L\tau(x)\omega(x)\,dx.
\]

Consequently, with the single combined kernel

\[
 G(x)=e^x-\psi_C(e^x)-\frac12\log(1-e^{-2x}),      \tag{3.3}
\]

one has

\[
\boxed{
 \Psi^\#(\omega)
 =-\int_0^L G(x)\frac{d}{dx}
       \left(e^{-x/2}\omega(x)\right)\,dx .}       \tag{3.4}
\]

Equivalently, putting

\[
 \delta_*(x)=e^{-x}G(x)
 =1-e^{-x}\psi_C(e^x)-\frac12e^{-x}\log(1-e^{-2x})
\]

and `Omega=e^(x/2) omega`,

\[
 \Psi^\#(\omega)
 =-\int_0^L\delta_*(x)(\Omega'(x)-\Omega(x))\,dx.  \tag{3.5}
\]

This is the source pole--archimedean--minus-prime cancellation in one
formula.

For completeness, a general finite correlation can be reduced to (3.4).
With

\[
 \rho_L(x)=(1-x/L)\mathbf 1_{[0,L]}(x)
           =\frac12q(U_0,U_0)(x),
\]

the function `omega-omega(0)rho_L` has both endpoints zero, and

\[
 \Psi^\#(\omega)=\frac{\omega(0)}2Q_{00}
 -\int_0^LG(x)\frac d{dx}
  \left[e^{-x/2}(\omega(x)-\omega(0)\rho_L(x))\right]dx. \tag{3.6}
\]

## 4. Exact full shifted-form theorem

The source correlation `q_corr(v,w)` is antilinear in `v`, linear in `w`,
and satisfies

\[
 q_{\rm corr}(v,w;0)=2\langle v,w\rangle.          \tag{4.1}
\]

Let `kappa` be normalized and put

\[
 q=\langle\kappa,Q\kappa\rangle,
\]

\[
 \omega^q_{v,w}
 =q_{\rm corr}(v,w)-\langle v,w\rangle
                     q_{\rm corr}(\kappa,\kappa). \tag{4.2}
\]

Then `omega^q_(v,w)(0)=0` for every `v,w`, and linearity gives

\[
 \Psi^\#(\omega^q_{v,w})
 =\langle v,(Q-qI)w\rangle.
\]

Applying (3.4) proves the full matrix identity

\[
\boxed{
 \langle v,(Q-qI)w\rangle
 =-\int_0^LG(x)\frac d{dx}
       \left(e^{-x/2}\omega^q_{v,w}(x)\right)dx .} \tag{4.3}
\]

At the two-vector Ritz shift `u`, therefore,

\[
\boxed{
 \langle v,(Q-uI)w\rangle
 =(q-u)\langle v,w\rangle
 -\int_0^LG(x)\frac d{dx}
       \left(e^{-x/2}\omega^q_{v,w}(x)\right)dx .} \tag{4.4}
\]

Thus (4.4) represents the complete even and odd shifted blocks, not merely
the residual vector.

The independent replay
`artifacts/chebyshev_rewrite/lambda2_N2_dps80.json` reconstructs the Weil
matrix from source parameters, uses a separately implemented correlation
formula and sieve-and-powers von Mangoldt enumeration on the integral side,
and checks three off-diagonal entries and a complex full shifted form.  The
two exact prime-power lists are compared explicitly, including the otherwise
numerically invisible endpoint term.  A 160-decimal repeat is serialized
beside it.  The replay does not read a producer matrix, but both sides share
`mpmath` transcendental arithmetic and are point-valued rather than interval
enclosures.

## 5. Residual as a leakage correlation

Let the corrected global radical state be `K=S E(tilde h_lambda)`, let
`p=P_N C_lambda K=a kappa`, and put `R=K-p`.  For
`v perpendicular kappa`, with `b=(Q-q)kappa`, (4.3) gives

\[
 a\langle v,b\rangle
 =-\int_0^LG(x)\frac d{dx}
       \left(e^{-x/2}q_{\rm corr}(v,p;x)\right)dx. \tag{5.1}
\]

The exact two-sided global radical identity says

\[
 W(v,K)=W(v,p)+W(v,R)=0.
\]

Moreover `v` lies in the projection space, so `<v,R>=0` and the correlation
with `R` again vanishes at the origin.  After the bounded-variation passage
in the next section,

\[
\boxed{
 a\langle v,b\rangle
 =+\int_0^\infty G(x)\frac d{dx}
       \left(e^{-x/2}q_{\rm corr}(v,R;x)\right)dx.} \tag{5.2}
\]

The plus sign is mandatory: `W(v,p)=-W(v,R)`.  In normalized form,

\[
 r=\frac1a\sup_{\substack{v\ {\rm even},\ \|v\|=1\\v\perp\kappa}}
 \left|\int_0^\infty
 \delta_*(x)(\Omega'_{v,R}(x)-\Omega_{v,R}(x))dx\right|. \tag{5.3}
\]

## 6. Bounded-variation passage and far-prime domination

For the corrected compact state `f=tilde h_lambda`, one has
`f(0)=integral(f)=0`, `f(x)=O(x^2)` at zero, and

\[
 g(x)=f(x)/x
\]

is compactly supported and of bounded variation.  In centered logarithmic
coordinates, for a finite even test vector `v` and `x>2log(lambda)`, direct
Poisson expansion gives

\[
 q_{\rm corr}(v,K;x)=e^{x/2}\sum_{m\geq1}
 \int_{\lambda^{-1}}^\lambda A_v(u)
       \widehat f(me^xu)\,du,                      \tag{6.1}
\]

where

\[
 A_v(u)=\overline{v(\log u)}u^{-1/2}.
\]

With the locked positive additive-Fourier sign,

\[
 \widehat g'(\xi)=2\pi i\widehat f(\xi),\qquad
 |\widehat g(\xi)|\leq\frac{\operatorname{Var}(g)}{2\pi|\xi|}.
\]

Integration by parts in `u`, followed by
`sum_(m>=1)m^(-2)=pi^2/6`, yields the explicit estimate

\[
 |q_{\rm corr}(v,K;x)|
 \leq\frac{\operatorname{Var}(g)C_v}{24}e^{-3x/2}, \tag{6.2}
\]

\[
 C_v=\frac{|A_v(\lambda^{-1})|}{\lambda^{-1}}
     +\frac{|A_v(\lambda)|}{\lambda}
     +\int_{\lambda^{-1}}^\lambda\frac{|A_v'(u)|}{u}\,du.
\]

Hence the far-prime part is absolutely bounded by

\[
 \frac{\operatorname{Var}(g)C_v}{24}
 \sum_{k>\lambda^2}\frac{\Lambda(k)}{k^2}.         \tag{6.3}
\]

Writing `M=floor(lambda^2)>=2`, this is fully effective because

\[
 \sum_{k>\lambda^2}\frac{\Lambda(k)}{k^2}
 \leq\sum_{n>M}\frac{\log n}{n^2}
 \leq\frac{\log M+1}{M}.                           \tag{6.4}
\]

The growing pole and archimedean tails are easier.  This supplies the
dominated passage from smooth radical representatives to the exact corrected
bounded-variation state against every finite test vector.

For a sharp asymptotic estimate, the generic variation constant should be
replaced by the prolate tail envelope

\[
 B_f(\lambda)=\sup_{\xi\geq\lambda}
       \xi|\widehat{f/x}(\xi)|.                    \tag{6.5}
\]

Ordinary `L^2` concentration does not control (6.5); endpoint or prolate-ODE
information is required.

## 7. What remains

The normalized kernel `delta_*` is locally integrable at zero.  A classical
quantitative prime-number-theorem error bound makes it integrable at
infinity.  No numerical value of its `L1` norm is used here, because that
external zero-free-region input has not been added to the source lock.

More importantly, `delta_*` is sign-indefinite.  Equation (4.4) therefore
does not turn the shifted Weil matrix into a positive Gram.  It identifies
the exact remaining comparison:

1. control the complete shifted correlation derivative in (4.4) relative to
   the positive prolate leakage model;
2. use (5.2)/(6.5) to retain the actual residual forcing orientation;
3. prove the resulting bounds uniformly through the growing transition
   window and both inversion sectors.

These are direct source-form estimates, not consequences of assumed global
Weil positivity.
