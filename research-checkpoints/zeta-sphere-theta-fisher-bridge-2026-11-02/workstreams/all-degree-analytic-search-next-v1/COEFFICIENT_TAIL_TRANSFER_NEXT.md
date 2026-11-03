# Coefficient-tail positivity does not by itself cross the endpoint gate

## Scope and conclusion

Two recent unconditional coefficient theorems are relevant but do not, as
stated, prove either the real-frequency first Laguerre inequality or the
endpoint Hankel pivots:

1. Liu--Mao prove strict infinite log-concavity of every central Taylor
   coefficient under every iterate of the nonlinear log-concavity operator.
2. Michałowski proves positivity of every consecutive coefficient Toeplitz
   minor in the explicit far-tail wedge `k >= 10^18 r^3`.

The obstruction is not merely that the published constants are large.  The
first Xi--Laguerre expression is an alternating, all-pair convolution of the
central coefficients, while the endpoint pivots are Hankel determinants of a
different sequence: spectral moments of that Laguerre expression.  Neither
2026 theorem supplies a positivity-preserving map between these objects.

This note gives the exact convolution and an entire positive-coefficient
countermodel.  The countermodel is strictly infinitely log-concave and has
positive consecutive Toeplitz minors in the much stronger wedge `k >= r+1`,
yet its real-frequency first Laguerre expression is negative at `t=1`.
Therefore the two coefficient conclusions, even jointly, cannot imply the
desired sign as abstract coefficient properties.  This does not exclude a
new proof that uses additional, specifically complete-theta structure.

Nothing below proves or disproves the first Laguerre inequality for the
Riemann Xi function, closes an endpoint pivot, or proves RH.

## Normalizations and the two 2026 inputs

Use Liu--Mao's generating function

\[
 F(x)=\xi\!\left(\frac12+\sqrt{x}\right)
     =\sum_{n\geq0}\lambda_nx^n.                 \tag{1}
\]

For the real-frequency function used in this workstream,

\[
 \Xi(t)=\xi\!\left(\frac12+it\right)=F(-t^2).    \tag{2}
\]

Michałowski instead writes

\[
 G(z)=\frac18\xi\!\left(\frac12+\frac{\sqrt z}{2}\right)
     =\sum_{n\geq0}a_nz^n,
 \qquad a_n=\frac{\lambda_n}{8\,4^n}.            \tag{3}
\]

This harmless geometric rescaling preserves every sign at issue.  If
`a_n=c d^n b_n` with `c,d>0`, then

\[
 (\mathcal La)_n=c^2d^{2n}(\mathcal Lb)_n,
 \qquad
 \det[a_{k+j-i}]_{i,j=0}^{r-1}
 =c^rd^{rk}\det[b_{k+j-i}]_{i,j=0}^{r-1}.        \tag{4}
\]

The first identity iterates with a new positive geometric scale at each
step.  Thus signs of all iterates are unchanged.

The precise source results are

\[
 (\mathcal L^m\lambda)_n>0
 \quad(m,n\geq0),
 \qquad
 (\mathcal Lb)_n=b_n^2-b_{n-1}b_{n+1},           \tag{5}
\]

with the standard boundary convention `b_(-1)=0`,

and, with `a_l=0` for `l<0`,

\[
 D^{\rm coef}_{r,k}:=
 \det[a_{k+j-i}]_{i,j=0}^{r-1}>0
 \quad(r\geq2,\ k\geq10^{18}r^3).               \tag{6}
\]

Equation (5) is a hierarchy of adjacent three-term inequalities.  Equation
(6) is a hierarchy of consecutive **Toeplitz** minors, but only in a far
coefficient tail.  The source of (6) explicitly leaves the RH-critical
region `k` comparable to `r` open.  Infinite log-concavity does not fill that
region for minors of order greater than two.

## Exact coefficient formula for the first Xi--Laguerre expression

Put

\[
 \mathcal F(t)=\Xi'(t)^2-\Xi(t)\Xi''(t).
\]

With `x=-t^2`, the chain rule gives the exact identity

\[
 \boxed{
 \mathcal F(t)=
 2F(x)F'(x)-4x\{F'(x)^2-F(x)F''(x)\},
 \qquad x=-t^2.}                                  \tag{7}
\]

Consequently

\[
 \mathcal F(t)=\sum_{k\geq0}(-1)^k\rho_kt^{2k}, \tag{8}
\]

where either of the following equivalent formulas is useful:

\[
\begin{aligned}
 \rho_k
 &=\sum_{i+j=k+1}2j(2j-1)\lambda_i\lambda_j
   -4\!\sum_{\substack{i+j=k+1\\i,j\geq1}}
          ij\lambda_i\lambda_j,                  \tag{9}\\
 &=\sum_{j=0}^{k+1}
   \bigl\{(k+1)(2k+1)-8j(k+1-j)\bigr\}
   \lambda_j\lambda_{k+1-j}.                    \tag{10}
\end{aligned}
\]

The weights in (10) change sign, and every pair of indices on the
anti-diagonal `i+j=k+1` occurs.  This is neither one entry of
`mathcal L lambda` nor one coefficient Toeplitz minor.  Already

\[
 \mathcal F(t)
 =2\lambda_0\lambda_1
  +(2\lambda_1^2-12\lambda_0\lambda_2)t^2+O(t^4).
                                                               \tag{11}
\]

Strict log-concavity gives the lower comparison
`lambda_1^2 > lambda_0 lambda_2`; an alternating second Taylor coefficient
in (11) requires the different upper comparison
`lambda_1^2 < 6 lambda_0 lambda_2`.  The former does not imply the latter.

There is a second important separation.  In the actual complete-theta
normalization, `mathcal F=widehat R` with `R>0`.  Hence

\[
 \rho_k=\frac1{(2k)!}\int_{\mathbb R}u^{2k}R(u)\,du>0.          \tag{12}
\]

Thus all alternating Taylor signs in (8) are already available from the
positive physical-space profile.  They still do not imply
`mathcal F(t)>=0`: the underlying representation
`mathcal F=widehat R`, `R>=0`, gives positive definiteness, and (12) is its
Taylor-moment shadow.  The endpoint target is instead pointwise
nonnegativity of `mathcal F`.

## A joint no-transfer countermodel

Let

\[
 b_0=1,\qquad b_1=\frac95,\qquad b_2=1,
 \qquad
 b_{n+1}=\frac{b_n^2}{100b_{n-1}}\quad(n\geq2),                \tag{13}
\]

and define the entire function

\[
 B(x)=\sum_{n\geq0}b_nx^n,
 \qquad X(t)=B(-t^2).                                         \tag{14}
\]

All coefficients are positive.  The adjacent ratios satisfy

\[
 \frac{b_1^2}{b_0b_2}=\frac{81}{25},
 \qquad
 \frac{b_n^2}{b_{n-1}b_{n+1}}=100\quad(n\geq2).               \tag{15}
\]

Let `r_*=(3+sqrt(5))/2`.  The standard strong-log-concavity closure can be
checked directly here.  If
`c_n^2>r_*c_{n-1}c_{n+1}` and
`y=c_{n-1}c_{n+1}/c_n^2<1/r_*`, then

\[
 (\mathcal Lc)_n^2=c_n^4(1-y)^2
 >r_*y^2c_n^4
 \geq r_*(\mathcal Lc)_{n-1}(\mathcal Lc)_{n+1},              \tag{16}
\]

because `(r_*-1)^2=r_*` and
`(mathcal Lc)_{n-1}(mathcal Lc)_{n+1}` is at most
`c_{n-1}^2c_{n+1}^2`.  Equations (15)--(16) prove strict infinite
log-concavity of `(b_n)`.

Moreover,

\[
 \frac{b_{n+1}}{b_n}=\frac1{180}\,100^{-(n-2)}\quad(n\geq2), \tag{17}
\]

so `B` is entire.  For `n>=2` its tail is exactly log-quadratic:

\[
 b_n=d^{n-2}q^{(n-2)(n-3)/2},
 \qquad d=\frac1{180},\quad q=\frac1{100}.                    \tag{18}
\]

Equivalently, on this tail `b_n=C D^nq^{n(n-1)/2}` for positive constants
`C,D`.  If `k>=r+1`, every index in
`[b_{k+j-i}]_(i,j=0)^(r-1)` is at least two.  Positive row and column
factors then reduce its determinant to

\[
 \det[q^{-ij}]_{i,j=0}^{r-1}
 =\prod_{0\leq p<\ell\leq r-1}(q^{-\ell}-q^{-p})>0.           \tag{19}
\]

Thus this sequence satisfies a consecutive-Toeplitz wedge much stronger
than (6).

Nevertheless its real-frequency first Laguerre expression is negative.
Write

\[
 P(t)=1-\frac95t^2+t^4,
 \qquad E(t)=X(t)-P(t).
\]

At `t=1`,

\[
 P=\frac15,\qquad P'=\frac25,\qquad P''=\frac{42}{5},
 \qquad P'^2-PP''=-\frac{38}{25}.                              \tag{20}
\]

Since `b_(3+j)<=b_3(1/180)^j`, direct geometric summation gives

\[
\begin{aligned}
 |E(1)|&\leq S_0=\frac1{179}<0.005587,\\
 |E'(1)|&\leq S_1=\frac{1076}{32041}<0.033582,\\
 |E''(1)|&\leq S_2=\frac{965892}{5735339}<0.168411.            \tag{21}
\end{aligned}
\]

Therefore

\[
\begin{aligned}
 &\left|\{X'(1)^2-X(1)X''(1)\}
       -\{P'(1)^2-P(1)P''(1)\}\right|\\
 &\quad\leq\frac45S_1+S_1^2+\frac15S_2
             +\frac{42}{5}S_0+S_0S_2
 =\frac{112460342}{1026625681}<0.109544.          \tag{22}
\end{aligned}
\]

Combining (20)--(22),

\[
 \boxed{X'(1)^2-X(1)X''(1)<-1.4104<0.}             \tag{23}
\]

This is a clean logical separation: strict infinite log-concavity plus a
uniform all-order Toeplitz tail does not imply the first real-frequency
Laguerre sign.  The model is not the Riemann Xi function and is not asserted
to have the complete-theta moment representation.  In particular, it is a
countermodel to a transfer from the two **stated coefficient properties**,
not to a theorem that might additionally exploit the theta kernel.

## Why a coefficient tail is not an endpoint-Hankel tail

The endpoint sequence in this workstream is

\[
 s_m=\frac1{2\pi}\int_{\mathbb R}t^{2m}\mathcal F(t)\,dt,
 \qquad
 H_n^{(r)}=(s_{r+i+j})_{i,j=0}^n.                              \tag{24}
\]

The next even and odd pivots, when the old prefix is positive definite, are

\[
 2\frac{\det H_n^{(0)}}{\det H_{n-1}^{(0)}},
 \qquad
 2\frac{\det H_n^{(1)}}{\det H_{n-1}^{(1)}}.                  \tag{25}
\]

These are **Hankel** determinants in the spectral-moment sequence `(s_m)`.
They are not Toeplitz determinants in `(lambda_n)` or `(a_n)`.  The Taylor
coefficients `(rho_k)` in (8) are a third sequence, dual to `(s_m)`:
`rho_k` are moments of the physical profile `R`, whereas `s_m` are local
even derivatives of `R` at zero, `s_m=(-1)^m R^(2m)(0)`.  Positivity of one
moment sequence does not give positivity of the other Hankel matrices.

There is an exact coefficient core/tail identity, but it exposes rather than
removes the obstruction.  For `F=P+T`, define

\[
 \mathcal A[F]=2FF'-4x(F'^2-FF'').
\]

Then

\[
\begin{aligned}
 \mathcal A[P+T]
 &=\mathcal A[P]+\mathcal A[T]\\
 &\quad+2(PT'+TP')
 -4x\{2P'T'-PT''-TP''\}.                         \tag{26}
\end{aligned}
\]

The mixed term has no sign.  A Toeplitz-minor statement about the
coefficients of `T` supplies no pointwise or integrable bound on the three
mixed products in (26).

For the actual Xi function this coefficient-index split is especially
unsuitable for (24).  On the negative ray `x=-t^2`, the full series
`F(-t^2)=Xi(t)` has gamma-factor decay, but every nonconstant finite Taylor
core `P(-t^2)` grows polynomially.  The complementary tail cancels that
growth.  Consequently the separate core, tail, and mixed terms in (26) need
not have finite spectral moments even though their sum does.  Thus (24)
cannot be split into a finite coefficient core plus the wedge (6) without a
new uniform cancellation theorem.

A genuine tail/core route would have to operate in a domain where the
pieces remain integrable--for example, directly in the complete-theta
integral or in real frequency--and retain the signed cross compensation.
The 2026 coefficient theorems may help estimate ingredients of such a new
argument, but they do not provide it.

## Primary-source record

- Yanxin Liu and Jianxi Mao, *Infinite log-concavity of the Taylor
  coefficients of the Riemann xi-function*, Theorem 1.1, proves (5)
  unconditionally and defines the normalization (1):
  <https://arxiv.org/abs/2610.04972>.
- Wojciech Michałowski, *An explicit uniform cubic wedge for consecutive
  Toeplitz minors of the Riemann xi coefficients*, Theorem 1.1 and Remark
  1.2, proves (6), explicitly restricts it to the far-tail regime, and notes
  that coefficient Toeplitz positivity and continuous-kernel total
  positivity are distinct:
  <https://arxiv.org/abs/2607.16795>.
- George Csordas, *Fourier transforms of positive definite kernels and the
  Riemann xi-Function*, states the global first Laguerre sign as Open Problem
  4.7 and identifies it with positive definiteness of the associated
  physical-space kernel:
  <https://arxiv.org/abs/1309.0055>.

## Exact nonclaims

1. The countermodel does not say that either 2026 coefficient theorem is
   false, and it is not a counterexample involving the Riemann Xi function.
2. It does not prove that the actual `mathcal F` changes sign or that any
   actual endpoint pivot is negative.
3. It only rules out a deduction from strict infinite log-concavity and the
   cubic Toeplitz wedge as bare coefficient properties.  It does not rule
   out a new theta-specific bridge using more of the proofs' analytic input.
4. The alternating Taylor signs (12), any finite collection of positive
   endpoint pivots, and the far-tail certificates (6) are not all-degree
   spectral positivity and do not prove RH.
5. Even a proof of the global first Laguerre sign would close the endpoint
   Hankel ladders in this workstream, but that first inequality alone is not
   a general sufficient criterion for all zeros of an entire function to be
   real.  No RH claim follows from that sign in isolation.
