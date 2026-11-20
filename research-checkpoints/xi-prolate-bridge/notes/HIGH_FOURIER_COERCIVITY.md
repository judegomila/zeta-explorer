# Explicit high-Fourier coercivity for the finite Weil matrix

Status: analytic component theorem, uniform in the outer Fourier cutoff.
This note proves a high-mode compression bound and a low/high coupling bound.
It does **not** prove a sign for the remaining low block, a complementary
sector gap, equation (5.2) of `DIRECT_RH_ATTACK.md`, or any conclusion about
the Riemann hypothesis.

The binding source is Connes--Consani--Moscovici, *Zeta Spectral Triples*,
arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf` with SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The exact inputs used here are source (3.13)--(3.16), (4.1)--(4.4), and
Lemma 5.1 (5.2).  In particular, throughout this note

\[
 Q=W_{0,2}-W_R-W_p,                                      \tag{1.1}
\]

so the minus sign on the prime block is retained.  We use defining formula
(4.4), not the duplicated `c(L)` in printed (4.14); this is the locked repair
already recorded in `P0_SOURCE_ERRATA.md`.

## 1. Source Cauchy form

Fix \(\lambda>1\), put \(L=2\log\lambda\), and use the source orthonormal
modes \(V_n\), \(-N\leq n\leq N\).  Lemma 5.1 gives

\[
 Q_{nn}=a_n,\qquad
 Q_{nm}=\frac{b_n-b_m}{n-m}\quad(n\ne m),          \tag{1.2}
\]

where \(a_{-n}=a_n\), \(b_{-n}=-b_n\), and \(b_0=0\).  Define

\[
 H_{nm}=\begin{cases}(n-m)^{-1},&n\ne m,\\0,&n=m,
 \end{cases}
 \qquad D_b=\operatorname{diag}(b_{-N},\ldots,b_N).
\]

Then, exactly,

\[
 Q=D_a+D_bH-HD_b.                                   \tag{1.3}
\]

There is no eigenvalue or eigenvector input in (1.3).

On \(\ell^2(\mathbb Z)\), convolution by \(1/k\), \(k\ne0\), has Fourier
multiplier \(i(\theta-\pi)\), \(0<\theta<2\pi\), up to the harmless Fourier
sign convention.  Its norm is therefore \(\pi\).  Every finite consecutive
compression satisfies

\[
 \|H\|\leq\pi,
 \qquad
 \|D_bH-HD_b\|\leq2\pi\sup_{|n|\leq N}|b_n|.       \tag{1.4}
\]

This Fourier-series proof fixes the constant; no unspecified Hilbert-transform
constant is used.

## 2. Explicit source-parameter constants

Put

\[
 \sigma_L=\log\!\left(\frac{L}{2\tanh(L/2)}\right)\geq0,                 \tag{2.1}
\]

and define

\[
\begin{aligned}
 P_\lambda&=\frac{8(\lambda+\lambda^{-1}-2)}{L},\\
 A_\lambda&=\lambda+2\sigma_L,\\
 R_\lambda&=4L(\lambda-1),\\
 C_a(\lambda)&=P_\lambda+A_\lambda+R_\lambda,                          \tag{2.2}\\
 B_0(\lambda)&=\frac{2(\lambda-\lambda^{-1})}{\pi},\\
 B_\infty(\lambda)&=\frac14+\frac{1}{2\pi^2}
              +\frac{\lambda-1+\sigma_L}{2\pi},\\
 B_p(\lambda)&=\frac{2L(\lambda-1)}{\pi},\\
 B_b(\lambda)&=B_0(\lambda)+B_\infty(\lambda)+B_p(\lambda),\\
 c_\lambda&=2\pi B_b(\lambda).                                        \tag{2.3}
\end{aligned}
\]

Every constant is a displayed elementary function of the source parameter;
there is no `O(1)` in the finite statement.

## 3. Uniform bound for the Cauchy coefficients

For \(n\ne0\), insert the source kernel

\[
 q(U_n,U_0)(x)=-\frac{\sin(2\pi n x/L)}{\pi n}
\]

into the three terms of (1.1).  Writing

\[
 \rho(x)=\frac{e^{x/2}}{e^x-e^{-x}},
\]

the signs forced by (1.1) give

\[
\begin{aligned}
 b_n={}&-\frac1\pi\int_0^L
       \sin(2\pi nx/L)(e^{x/2}+e^{-x/2})\,dx\\
 &+\frac1\pi\int_0^L\sin(2\pi nx/L)\rho(x)\,dx\\
 &+\frac1\pi\sum_{1<k\leq e^L}
       \frac{\Lambda(k)}{\sqrt{k}}
       \sin(2\pi n\log k/L).                              \tag{3.1}
\end{aligned}
\]

The last plus sign is the result of the source minus-prime sign together with
the minus sign in \(q(U_n,U_0)\); it is not a change of convention.

For the archimedean sine integral, use

\[
 \int_0^L\left(\frac1x-\frac1{\sinh x}\right)dx
 =\sigma_L,                                                     \tag{3.2}
\]

and

\[
 \int_0^L\left|\rho(x)-\frac1{2x}\right|dx
 \leq\frac{\lambda-1+\sigma_L}{2}.                            \tag{3.3}
\]

Indeed,

\[
 \left|\frac{e^{x/2}}{\sinh x}-\frac1x\right|
 \leq\frac{e^{x/2}-1}{\sinh x}
       +\left(\frac1x-\frac1{\sinh x}\right),
\]

and the first term has integral at most \(\lambda-1\), because
`sinh(x)>=x` and
`exp(x/2)-1 <= (x/2)exp(x/2)`.  Also

\[
 |\operatorname{Si}(2\pi n)|
 \leq\frac\pi2+\frac1{\pi|n|},                               \tag{3.4}
\]

by one integration by parts in the tail integral.  Equations
(3.2)--(3.4) give the middle bound in (2.3).

For the prime block, the endpoint is inclusive and \(e^L=\lambda^2\).
The elementary inequalities \(\Lambda(k)\leq\log k\leq L\) and

\[
 \sum_{k=2}^{\lfloor\lambda^2\rfloor}k^{-1/2}
 \leq2(\lambda-1)                                             \tag{3.5}
\]

give the last bound in (2.3).  No zero table and no prime-number-theorem
estimate is used.  The pole integral gives the first bound directly.  Thus

\[
 \boxed{|b_n|\leq B_b(\lambda)\quad(n\in\mathbb Z).}           \tag{3.6}
\]

Together with (1.4), this proves

\[
 \boxed{\|D_bH-HD_b\|\leq c_\lambda}                          \tag{3.7}
\]

for every outer cutoff \(N\).

## 4. Logarithmic diagonal lower and upper bounds

For \(n\ne0\), put \(\kappa=2\pi|n|/L\).  The source diagonal kernel is

\[
 q(U_n,U_n)(x)=2(1-x/L)\cos(\kappa x).
\]

The pole and prime pieces obey

\[
 |(W_{0,2})_{nn}|\leq P_\lambda,
 \qquad |(W_p)_{nn}|\leq R_\lambda.                           \tag{4.1}
\]

The first equality follows by integrating the positive majorant exactly;
the second uses (3.5) and \(0\leq1-\log k/L\leq1\).

For the archimedean block, defining (4.4) gives

\[
\begin{aligned}
 (W_R)_{nn}={}&\gamma+\log(4\pi)
 +\int_0^L\frac{e^{x/2}(1-x/L)\cos(\kappa x)-1}{\sinh x}\,dx\\
 &-\int_L^\infty\frac{dx}{\sinh x}.                           \tag{4.2}
\end{aligned}
\]

Set

\[
 R_L(x)=\frac{e^{x/2}(1-x/L)}{\sinh x}-\frac1x,
 \qquad S(x)=\frac1x-\frac1{\sinh x}.
\]

The integrand on `[0,L]` is exactly

\[
 \frac{\cos(\kappa x)-1}{x}+R_L(x)\cos(\kappa x)+S(x).        \tag{4.3}
\]

Moreover

\[
 \int_0^L|R_L(x)|dx\leq\lambda+\sigma_L,
 \qquad \int_0^L S(x)dx=\sigma_L.                             \tag{4.4}
\]

To see the first bound without hiding a constant, put
`g(x)=exp(x/2)(1-x/L)`.  Since
`R_L=(g-1)/sinh(x)-S`, split the interval into the sets where `g>=1` and
`g<=1`.  On the first, `g-1<=exp(x/2)-1`, whose quotient by `sinh(x)` has
integral at most `lambda-1` by `sinh(x)>=x` and
`exp(x/2)-1<=(x/2)exp(x/2)`.  On the second,
`1-g<=x/L`, so its quotient has integral at most one.  Thus
`integral |g-1|/sinh <= lambda`; adding `integral S=sigma_L` proves (4.4).

Since \(\kappa L=2\pi|n|\),

\[
 \int_0^L\frac{\cos(\kappa x)-1}{x}\,dx
 =\operatorname{Ci}(2\pi|n|)-\gamma-\log(2\pi|n|),           \tag{4.5}
\]

and a tail integration by parts gives

\[
 |\operatorname{Ci}(2\pi|n|)|\leq\frac1{2\pi|n|}.            \tag{4.6}
\]

Dropping the negative final term in (4.2), and preserving the minus sign
`Q=W_0,2-W_R-W_p`, yields

\[
 \boxed{
 a_n\geq\log\frac{|n|}{2}
       -\frac1{2\pi|n|}-C_a(\lambda),\qquad n\ne0.}           \tag{4.7}
\]

The same decomposition, now taking absolute values and using

\[
 \int_L^\infty\frac{dx}{\sinh x}=\log\coth(L/2),
 \qquad |\log(|n|/2)|\leq\log(|n|+2),                         \tag{4.8}
\]

proves the complementary growth bound

\[
 \boxed{
 |a_n|\leq\log(|n|+2)+C_{|a|}(\lambda),\quad n\ne0,}          \tag{4.9}
\]

where

\[
 C_{|a|}(\lambda)=C_a(\lambda)+\log\coth(L/2)+\frac1{2\pi}.  \tag{4.10}
\]

Thus both sides are explicit; in particular, no unnamed diagonal constant is
hidden in the high-mode argument.

## 5. High compression and coupling theorem

For integers \(0\leq M<N\), let \(P_{\rm lo}\) project onto modes
`|n|<=M` and let \(P_{\rm hi}=I-P_{\rm lo}\) inside `[-N,N]`.  Define

\[
 g_{\lambda,M}=\log\frac{M+1}{2}
 -\frac1{2\pi(M+1)}-C_a(\lambda)-c_\lambda.                   \tag{5.1}
\]

**Theorem 5.1.** For every finite outer cutoff \(N>M\),

\[
 \boxed{P_{\rm hi}QP_{\rm hi}\geq g_{\lambda,M}P_{\rm hi}}, \tag{5.2}
\]

and

\[
 \boxed{\|P_{\rm hi}QP_{\rm lo}\|\leq c_\lambda.}           \tag{5.3}
\]

For every real shift \(U\),

\[
 P_{\rm hi}(Q-U I)P_{\rm hi}
 \geq(g_{\lambda,M}-U)P_{\rm hi},                            \tag{5.4}
\]

while the coupling bound is unchanged.

**Proof.** The diagonal part of (1.3) has no low/high coupling.  On the high
set, the right side of (4.7) is increasing in \(|n|\), so its minimum occurs
at \(M+1\).  Subtracting the operator-norm bound (3.7) proves (5.2).
Compression of the same off-diagonal operator proves (5.3), and subtracting a
scalar identity proves (5.4).  \(\square\)

There is also a completely explicit cutoff.  For a desired high shifted floor
\(G\geq0\), put

\[
 M_*(\lambda,U,G)=\max\!\left\{0,
 \left\lceil2\exp\!\left(C_a(\lambda)+c_\lambda+U+G
                       +\frac1{2\pi}\right)\right\rceil-1\right\}.       \tag{5.5}
\]

Then every \(M\geq M_*\) satisfies

\[
 P_{\rm hi}(Q-U I)P_{\rm hi}\geq G P_{\rm hi}                \tag{5.6}
\]

for every \(N>M\).  This is an `exp(O(lambda log lambda))`
cutoff under the displayed elementary bounds, hence it is subexponential in
`lambda^2`; the statement does not optimize cost.

If \(G>0\), the elementary Schur consequence is

\[
 \|(P_{\rm hi}(Q-U I)P_{\rm hi})^{-1}\|\leq G^{-1},
 \qquad
 C^*H_{\rm hi}^{-1}C\leq\frac{c_\lambda^2}{G}I,               \tag{5.7}
\]

where \(C=P_{\rm hi}QP_{\rm lo}\).  The scalar correction in (5.7) can be
far too wasteful at the exponentially small leading-prolate scale.  Failure
of that scalar test is not failure of an anisotropic Schur comparison.

## 6. Conditional logarithmic-tail corollary

Equation (4.9) can be combined with a separately proved log-weighted Fourier
tail, but this note does not assume such a theorem.  Precisely, if a state
`p` has Fourier coefficients `p_n` satisfying

\[
 \sum_{|n|>M}\log(|n|+2)|p_n|^2\leq E_{\log}(M),
 \qquad
 \sum_{|n|>M}|p_n|^2\leq E_0(M),                               \tag{6.1}
\]

then the *diagonal part only* obeys

\[
 \left|\langle P_{\rm hi}p,D_aP_{\rm hi}p\rangle\right|
 \leq E_{\log}(M)+C_{|a|}(\lambda)E_0(M).                     \tag{6.2}
\]

Together with (3.7), this gives the complete high--high form estimate

\[
 |\langle P_{\rm hi}p,QP_{\rm hi}p\rangle|
 \leq E_{\log}(M)+
       (C_{|a|}(\lambda)+c_\lambda)E_0(M).                    \tag{6.3}
\]

For two possibly different high tails `x` and `y`, define

\[
 \mathcal E_\lambda(x)=
 \sum_{|n|>M}\bigl(\log(|n|+2)+C_{|a|}(\lambda)\bigr)|x_n|^2.
\]

Weighted Cauchy--Schwarz on the *ordinary diagonal operator* (not on the
Weil form), followed by (3.7), gives the bilinear version

\[
 |\langle x,Qy\rangle|
 \leq\sqrt{\mathcal E_\lambda(x)\mathcal E_\lambda(y)}
      +c_\lambda\|x\|_2\|y\|_2.                              \tag{6.4}
\]

Thus separate log-weighted estimates for two projection remainders control
their complete `P--P` correlation at their geometric-mean scale.  This use of
Cauchy--Schwarz is valid because it is applied to the explicit positive
weight `log(|n|+2)+C_|a|`, not to the sign-indefinite Weil form.

This is a conditional plug-in statement: (6.1) must be supplied with the
normalization and schedule of the actual projected prolate state, and cross
terms with other remainders must still be retained.  Neither (6.2) nor (6.3)
is a signed low-sector floor.

## 7. Exact scope and obstruction left open

The theorem genuinely isolates all sufficiently high Fourier modes uniformly
in a possibly much larger outer cutoff.  It does not finish the bridge:

1. the explicit low window still has
   `M=exp(O(lambda log lambda))` under these coarse source triangles;
2. (5.3) is bounded but not small, because modes adjacent to the split have
   no denominator separation;
3. a scalar use of (5.7) can destroy the cancellation and the tiny prolate
   defect scale;
4. no sign has been proved for the exact combined Weil form on the growing
   low window; and
5. no locally uniform determinant convergence follows from high coercivity.

The result is therefore an analytic conditioning component, not an
asymptotic proof.
