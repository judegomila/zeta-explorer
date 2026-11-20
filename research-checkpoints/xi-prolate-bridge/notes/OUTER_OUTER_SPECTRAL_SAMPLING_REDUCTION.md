# Outer--outer endpoint: divisor discrepancy and a spectral-sampling bypass

## 1. Claim boundary

This note records two reductions of the remaining physical outer--outer
term.  It proves an exact derivative formula for the leading hard-endpoint
correlation and a conditional sampling theorem which would bypass that
derivative altogether.  It does not prove the required full outer--outer
bound: the weighted fractional-Sobolev estimate for the complete Volterra
profile has not yet been established, and the zero-free-region input used in
the conditional sampling theorem has not been admitted to a project source
lock.

No zero table, reality of a zero parameter, or positivity of the Weil form is
used below.  The project status remains `P0_INVALIDATED`.

## 2. The endpoint correlation is a divisor discrepancy

Put

\[
 P(x)=\frac12-\{x\}
\]

away from the integers, with arbitrary midpoint values at the integers.  Let

\[
 A=\lambda^2,\qquad f_A(t)=P(Ae^t),\qquad
 C_A(y)=(f_A*f_A)(y).
\]

Thus

\[
 C_A(y)=\int_0^yP(Ae^t)P(Ae^{y-t})\,dt,             \tag{2.1}
\]

which is exactly equation (7.1) of
`OUTER_OUTER_ENDPOINT_OBSTRUCTION.md`.  Write

\[
 U=Ae^y,\qquad X=AU=A^2e^y,
 \qquad p_A=P(A+)=\frac12-\{A\}.                    \tag{2.2}
\]

As a distribution on the open positive half-line,

\[
 f_A'(t)=-Ae^t+\sum_{n>A}\delta_{\log(n/A)}.        \tag{2.3}
\]

Since a locally-BV function convolved with itself is locally absolutely
continuous, differentiating (2.1) with the right boundary trace gives, for
almost every `y>0`,

\[
\boxed{
\begin{aligned}
 C_A'(y)
 &=p_AP(U)+\sum_{A<n<U}P(X/n)
      -X\int_A^U P(s)\frac{ds}{s^2}\\
 &=p_AP(U)+\sum_{A<n<U}P(X/n)
      -\int_A^U P(X/t)\,dt .                       \tag{2.4}
\end{aligned}}
\]

The second line uses `s=X/t`.  Formula (2.4) is therefore the exact centered
sum--integral discrepancy for the Dirichlet hyperbola `nt=X`.  On the locked
half-integer diagonal,

\[
 A=(j+1/2)^2\in\mathbb Z+\frac14,qquad p_A=\frac14. \tag{2.5}
\]

This is not merely an analogy with a Vasyunin sum.  At `A=1`, for noninteger
`X` and `N=floor(X)`, (2.4) reads

\[
 C_1'(\log X)
 =D(X)+\frac N2-XH_N-\frac12P(X)
   -X\int_1^X P(s)\frac{ds}{s^2},                 \tag{2.6}
\]

where `D(X)=sum_(n<=X) floor(X/n)` is the divisor summatory function.
Subtracting

\[
 \Delta(X)=D(X)-X\log X-(2\gamma-1)X
\]

leaves the completely explicit endpoint expression

\[
\begin{aligned}
 C_1'(\log X)-\Delta(X)
 ={}&X(\log X-H_N)+(\gamma-\tfrac12)X+\frac N2\\
 &+X\int_X^\infty P(s)\frac{ds}{s^2}-\frac12P(X). \tag{2.7}
\end{aligned}
\]

The last integral is controlled by one integration by parts using the
bounded primitive of the mean-zero periodic function `P`.  Equation (2.7)
identifies the precise classical divisor-error component without importing
any estimate for it.

There is a useful elementary all-`A` bound.  Split the discrepancy in (2.4)
at `sqrt(X)`.  Below that point, bound the sum and integral separately by
`|P|<=1/2`.  Above it, the continuous variation of `P(X/t)` is at most
`sqrt(X)`, and at most `sqrt(X)+1` unit jumps occur.  The elementary
sum--integral inequality for a BV function then gives

\[
 \boxed{|C_A'(y)|\leq4\sqrt X+4
       =4A e^{y/2}+4.}                            \tag{2.8}
\]

Also `|C_A(y)|<=y/4`.  These estimates are deliberately elementary; their
role is to expose the obstruction, not to compete with divisor-problem
bounds.

## 3. Exact mixed cancellation still required on the explicit side

For two leading endpoint pieces, equation (4.3) of the obstruction note
gives

\[
 \Omega_{00}(L+y)
 =\frac{\epsilon h_n(\lambda)h_m(\lambda)}2 C_A(y). \tag{3.1}
\]

Consequently their complete combined-kernel contribution is

\[
 \frac{\epsilon h_n(\lambda)h_m(\lambda)}2
 \mathcal M_A(Y),
\]

where the exact truncated mixed quantity is

\[
 \boxed{
 \mathcal M_A(Y)=\int_0^Y
  \delta_*(L+y)\bigl(C_A'(y)-C_A(y)\bigr)\,dy.}   \tag{3.2}
\]

The endpoint theorem supplies

\[
 \frac{|h_n(\lambda)h_m(\lambda)|}{2}
 \leq128\pi^2\lambda\sqrt{d_nd_m}.               \tag{3.3}
\]

Thus a polynomial-in-`A` bound for the limit of (3.2) would be sufficient at
the geometric-mean defect scale.

The existing absolute estimates cannot prove such a bound.  Combining
(2.8) with the pinned PNT envelope produces a majorant containing

\[
 e^{y/2}(L+y)^{3/2}e^{-\alpha\sqrt{L+y}},          \tag{3.4}
\]

whose integral diverges.  More generally, any positive-power pointwise
majorant for the divisor discrepancy remains nonintegrable against this
subexponential PNT envelope.  This is a rigorous no-go for every argument
which takes absolute values of the PNT error and the divisor discrepancy
separately.  It is not a claim that the signed integral (3.2) diverges.

The explicit-distribution route must therefore prove cancellation in the
mixed Chebyshev-error--divisor-discrepancy integral itself.  Integrating once
more by parts only restores the separately infinite continuous and prime
variations and does not supply that cancellation.

## 4. A spectral route which does not assume zero reality

There is a different possible route.  Write a nontrivial zero as

\[
 \rho=\frac12+is_\rho,qquad
 s_\rho=\gamma+i(\tfrac12-\beta)
 \quad(\rho=\beta+i\gamma).                      \tag{4.1}
\]

Then

\[
 \frac12-|\Im s_\rho|=\min\{\beta,1-\beta\}.     \tag{4.2}
\]

No assertion that `Im(s_rho)=0` is made.  Suppose an unconditional
zero-free region and local zero count provide explicit functions
`eta(T)>0` and `Z(T)` such that every zero parameter with
`T<=|Re(s_rho)|<2T` satisfies

\[
 \frac12-|\Im s_\rho|\geq\eta(T),                \tag{4.3}
\]

and every disk of radius at most one in that block contains at most `Z(T)`
parameters, counted with multiplicity.

For an outer profile `O`, put

\[
 F(z)=\int_{\mathbb R}O(t)e^{-izt}\,dt.
\]

Assume the following full-profile estimate, uniformly for
`0<epsilon<=1/4`:

\[
\boxed{
 \sup_{|b|\leq1/2-\epsilon}
 \int_{\mathbb R}(1+|\tau|)^{\epsilon/2}
       |F(\tau+ib)|^2\,d\tau
 \leq D_\lambda\epsilon^{-M}.}                  \tag{4.4}
\]

Here `M` is a displayed fixed integer and `D_lambda` must be bounded by an
explicit polynomial times the relevant prolate defect.  Equation (4.4) is a
fractional Sobolev estimate of order `epsilon/4`, not an `H1` assertion.

### Conditional sampling theorem

Take `r_T=eta(T)/4`.  Subharmonicity on the disk centered at each zero
parameter, followed by the overlap bound `Z(T)`, gives

\[
\begin{aligned}
 \sum_{T\leq|\Re s_\rho|<2T}|F(s_\rho)|^2
 \leq{}&\frac{16Z(T)}{\pi\eta(T)^2}
 \int_{|b|\leq1/2-\eta(T)/2}
 \int_{T/2\leq|\tau|\leq3T}|F(\tau+ib)|^2\,d\tau\,db\\
 \leq{}&\frac{16\,2^M Z(T)}{\pi}
 D_\lambda\eta(T)^{-M-2}
 T^{-\eta(T)/4}.                                  \tag{4.5}
\end{aligned}
\]

The harmless enlargement of the real block also covers negative heights.
Thus, if

\[
 \sum_{k\geq k_0}Z(2^k)\eta(2^k)^{-M-2}
       2^{-k\eta(2^k)/4}<\infty,                 \tag{4.6}
\]

then the zero parameters form a square-summable sampling set for `F`, with
an explicit bound proportional to `D_lambda`.

A Vinogradov--Korobov shape

\[
 \eta(T)=\frac{1}{C(\log T)^{2/3}(\log\log T)^{1/3}},
 \qquad Z(T)\leq C_Z\log(3T),                    \tag{4.7}
\]

makes (4.6) converge: its dyadic exponential factor is

\[
 \exp\!\left(-\frac{(\log2)^{1/3}}{4C}
   \frac{k^{1/3}}{(\log k+\log\log2)^{1/3}}\right),           \tag{4.8}
\]

which dominates every polynomial in `k`.

For two profiles, ordinary Cauchy--Schwarz on the absolutely convergent
number sequence, not in the Weil form, then gives

\[
 \sum_\rho|F_n(s_\rho)F_m(\overline{s_\rho})|
 \leq
 \left(\sum_\rho|F_n(s_\rho)|^2\right)^{1/2}
 \left(\sum_\rho|F_m(\overline{s_\rho})|^2\right)^{1/2}.     \tag{4.9}
\]

Functional-equation symmetry gives the same boundary margin for the second
sampling set.  Therefore (4.3)--(4.6), together with (4.4), would define the
outer--outer spectral pairing absolutely and bound it at the geometric-mean
defect scale.  This uses the locations only through unconditional region and
counting theorems; it neither enumerates zeros nor assigns them to the real
axis.

This route also requires a domain passage showing that the resulting
absolutely convergent spectral pairing agrees with the combined explicit
distribution under hard-endpoint approximation.  Absolute convergence and
uniform versions of (4.4) are the natural hypotheses for that passage, but
it has not been written out here.

## 5. The leading sawtooth has exactly the needed fractional margin

The leading endpoint itself supports (4.4).  For `A>=1`,
`0<epsilon<=1/4`, define

\[
 g_{A,\epsilon}(t)=1_{t\geq0}e^{-\epsilon t}P(Ae^t).
\]

The same unit-interval split as in equation (6.3) of the obstruction note,
now with weight `s^(-1-2epsilon)`, gives for `0<h<=1`

\[
 \boxed{
 \|g_{A,\epsilon}(\cdot+h)-g_{A,\epsilon}\|_2^2
 \leq32\epsilon^{-1}A^{2\epsilon}h^{2\epsilon}.} \tag{5.1}
\]

Indeed, below `s=1/h` the jump sets contribute
`h*sum_(r<=1/h)r^(-2epsilon)`; above that point the trivial bound contributes
`sum_(r>1/h)r^(-1-2epsilon)`.  The smooth pieces, the exponential multiplier,
and the zero-extension boundary are smaller than the displayed slack.

The Gagliardo characterization now implies, at order
`theta=epsilon/4`,

\[
 [g_{A,\epsilon}]_{H^\theta}^2
 \leq C_{\rm Gal}(\epsilon)
       \epsilon^{-2}A^{2\epsilon},               \tag{5.2}
\]

where the elementary Fourier/Gagliardo conversion factor must be serialized
before (5.2) is used as a finite theorem.  The important point is that this
factor is polynomial in `epsilon^(-1)`; no exponential loss occurs.  Since

\[
 |h_n(\lambda)|^2\leq256\pi^2\lambda d_n,         \tag{5.3}
\]

the shifted right and left leading tails have (4.4) with a polynomial loss
in `lambda` and `epsilon^(-1)`, times `d_n`.

The next boundary term follows from three integrations by parts in the
additive Fourier integral.  With

\[
 B_2(x)=\{x\}^2-\{x\}+\frac16,
\]

the first two exact sampled terms are

\[
\begin{aligned}
 B_{0,h}(t)&=\frac{h(\lambda)}{2\sqrt{\lambda e^t}}
                  P(Ae^t),\\
 B_{1,h}(t)&=\frac{h'(\lambda)}{4(\lambda e^t)^{3/2}}
                  B_2(Ae^t).                     \tag{5.4}
\end{aligned}
\]

The exterior regularity condition gives

\[
 h'(\lambda)=\frac{\mu-c^2}{2\lambda}h(\lambda), \tag{5.5}
\]

so its coefficient is also endpoint-defect relative with only a polynomial
loss.  After an exponential weight with strip margin `epsilon`, the second
term has decay at least `e^(-(1+epsilon)t)` and supports fractional orders
strictly below one by the same interval split.

What remains is a uniform analogue of (5.1) for the complete Volterra
remainder after (5.4).  The direct three-integration-by-parts remainder is
not sufficient: bounding its interior derivative norm loses the prolate
defect.  The exterior ODE instead writes

\[
 w''+(k^2+V)w=0,qquad
 V(t)=\frac{c^2-\mu}{t^2-\lambda^2}
      +\frac{\lambda^2}{(t^2-\lambda^2)^2},       \tag{5.6}
\]

and its first asymptotic correction is

\[
 w(t)=\frac{h(\lambda)}\pi
 \left(\sin kt-\frac{c^2-\mu}{2kt}\cos kt\right)
 +\mathcal R(t).                                  \tag{5.7}
\]

An explicit translation-modulus bound for the sampled `mathcal R`, derived
from the Volterra equation and proportional to `|h(lambda)|`, would complete
(4.4).  The existing pointwise Volterra estimate proves the required decay
but not yet the uniform fractional translation bound.  This is now the
narrow missing lemma for the spectral route.

## 6. Source-lock requirement and outcome

The explicit region

\[
 \beta\leq1-
 \frac{1}{55.241(\log|\gamma|)^{2/3}
                    (\log\log|\gamma|)^{1/3}}
\]

for `|gamma|>=3` is stated in Mossinghoff--Trudgian--Yang,
*Explicit zero-free regions for the Riemann zeta-function*,
arXiv:2212.06867.  It is only a candidate source in this note: its exact
version bytes, formula location, local zero-count companion, and constants
have not been vendored or locked.  No project theorem may depend on (4.7)
until that audit is complete.

The route audit therefore has two precise outcomes:

1. on the explicit side, the hard derivative is a mixed PNT--divisor-error
   cancellation problem, and separate pointwise bounds cannot solve it;
2. on the spectral side, an unconditional zero-free region plus the
   full-profile weighted fractional estimate (4.4) would bypass the
   Vasyunin derivative and give an absolute outer--outer bound without using
   positivity.

The second route is noncircular, but it remains conditional on the Volterra
fractional lemma and a new exact source lock.
