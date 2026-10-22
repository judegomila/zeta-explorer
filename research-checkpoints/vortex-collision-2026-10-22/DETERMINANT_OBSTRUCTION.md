# Collision barriers for the backward-heat xi family

22 October 2026. Mathematical checkpoint, not a proof of RH or a novelty claim.

## 1. Exact family and the unresolved target

Use

\[
H_\tau(z)=\int_0^\infty e^{\tau u^2}\Phi(u)\cos(zu)\,du,
\quad H_0(z)=\xi(1/2+iz/2)/8,
\]
\[
\Phi(u)=\sum_{n\ge1}(2\pi^2n^4e^{9u}-3\pi n^2e^{5u})e^{-\pi n^2e^{4u}}.
\]

The super-exponential decay justifies differentiation on compact parameter sets and gives \(\partial_\tau H=-H_{xx}\). The intended collision-exclusion target is

\[
(H_\tau(x),H'_\tau(x))\ne(0,0),\qquad x\in\mathbb R,\quad0<\tau\le1/2.
\]

Together with the established real-root anchor and suitable uniform positive-time tail control, this is the proposed route to RH. Neither the target nor a new theta inequality proving it is established here. Sources for the family, real-root transition, and effective positive-time analysis are [Rodgers–Tao](https://arxiv.org/abs/1801.05914) and [Polymath](https://arxiv.org/abs/1904.12438).

## 2. Determinant evolution: the source points the wrong way

Set \(D(\tau,x)=H_x^2-HH_{xx}\). Direct differentiation gives

\[
D_x=H_xH_{xx}-HH_{xxx},\qquad D_{xx}=H_{xx}^2-HH_{xxxx},
\]
\[
D_\tau=-2H_xH_{xxx}+H_{xx}^2+HH_{xxxx},
\]
\[
\boxed{(\partial_\tau+\partial_x^2)D=2(H_{xx}^2-H_xH_{xxx})=2D[H_x].}
\]

In the direction needed for RH, put \(s=T-\tau\). Then

\[
\boxed{D_s=D_{xx}-2D[H_x].}
\]

Even knowing \(D[H_x]\ge0\) produces a *negative* source, not a positivity-preserving source. Thus this identity does not support a maximum-principle proof that positive \(D\) persists toward smaller \(\tau\).

At an ordinary double root \((\tau_*,x_*)\), write \(c=H_{xx}(\tau_*,x_*)\ne0\). Exactly,

\[
D=D_x=0,\qquad D_{xx}=D_\tau=c^2>0.
\]

With \(y=x-x_*\) and \(\delta=\tau-\tau_*\), the leading expansion is

\[
H=c(y^2/2-\delta)+O(|y|^3+|y\delta|+\delta^2),
\]
\[
D=c^2(y^2/2+\delta)+O(|y|^3+|y\delta|+\delta^2).
\]

Real roots separate for \(\delta>0\); the central determinant turns negative for \(\delta<0\). This is the permitted collision geometry, not a contradiction. Higher multiplicity makes \(c=0\); it cannot be dismissed by this ordinary-double-root computation.

On a zero-free region, \(q=H_x/H\) and \(r=D/H^2=-q_x\) satisfy

\[
q_\tau=-q_{xx}-2qq_x,\qquad
r_\tau=-r_{xx}-2qr_x+2r^2.
\]

After reversing time the apparent scalar positivity equation is valid only where these coefficients are regular. They have poles at the zeros being studied. A maximum principle requiring bounded drift and a regular domain cannot be extended across their collision without a separate argument.

## 3. Positive, strictly log-concave kernel with a collision

For \(0\le\tau\le1/2\), let

\[
K_\tau(u)=e^{-(2-\tau)u^2}(1+e^{-1/7}\cosh u),\qquad a=2-\tau.
\]

It is even and strictly positive. The second derivative of \(\log(1+e^{-1/7}\cosh u)\) is the variance of slopes in \(\{-1,0,1\}\), hence at most 1. Therefore

\[
(\log K_\tau)''\le-2a+1\le-2.
\]

Its cosine transform is explicitly

\[
F_\tau(x)=\frac{\sqrt\pi}{2\sqrt a}e^{-x^2/(4a)}
[1+c_\tau\cos(x/(2a))],\quad
c_\tau=e^{-1/7+1/(4a)}.
\]

It solves the same backward heat equation. At \(\tau_*=1/4\), \(c=1\), giving ordinary double zeros at
\(x=(7\pi/2)(2k+1)\). For \(\tau>1/4\), \(c>1\), and every zero is real and simple. For \(\tau<1/4\), \(c<1\), and zeros are nonreal.

Thus positivity, strict log-concavity, the heat equation, and a real-root anchor at \(1/2\) do not exclude a positive-time collision. This example has Gaussian, not theta-type super-exponential, decay. Below contact it has nonreal zeros at unbounded real parts, so it does **not** satisfy the theta positive-time all-real-tail property.

## 4. Positive kernel with uniform zero-free tails and a collision

A complementary example includes a strong tail property. Put

\[
K_\tau(u)=e^{-(2-\tau)u^2}(u^4+\varepsilon),\quad
\varepsilon=24/49,\quad a=2-\tau.
\]

Its cosine transform is

\[
F_\tau(x)=\frac{\sqrt\pi}{32a^{9/2}}e^{-x^2/(4a)}P_a(x),
\quad P_a=x^4-12ax^2+12a^2+16\varepsilon a^4.
\]

As a polynomial in \(y=x^2\), its discriminant is

\[
\Delta=32a^2(3-2\varepsilon a^2).
\]

It vanishes at \(a=7/4\), or \(\tau=1/4\). At that time \(P_a=(x^2-6a)^2\), giving double roots \(\pm\sqrt{21/2}\). Above that time the two \(y\)-roots are distinct positive numbers, so all four \(x\)-zeros are real and simple. Below it the \(y\)-roots are nonreal, hence all four \(x\)-zeros are nonreal.

There are no other zeros. Their locations remain uniformly bounded on the compact interval \(0\le\tau\le1/2\). This supplies uniform zero-free tails as well as a real-root anchor, but still a positive-time collision. This second kernel is positive and even; no log-concavity claim is made. Neither countermodel has the theta kernel's decay and infinite-zero structure. Their assumptions must not be combined as if one example satisfied all of them.

## 5. A precise theta-specific inequality, still unproved

Extend the theta kernel evenly to the real axis and let \(K_\tau(u)=e^{\tau u^2}\Phi(u)\). Define

\[
Q_\tau(v)=\int_{\mathbb R}u^2K_\tau(v+u)K_\tau(v-u)\,du
=e^{2\tau v^2}\int_{\mathbb R}u^2e^{2\tau u^2}\Phi(v+u)\Phi(v-u)\,du.
\]

With the normalization in Section 1, an exact symmetrization gives

\[
\boxed{D(\tau,x)=\int_{\mathbb R}Q_\tau(v)\cos(2xv)\,dv.}
\]

Indeed, writing \(2H=\int K(u)e^{ixu}du\), the determinant is one eighth of the double integral with factor \((u-v)^2\); the substitution \((u,v)=(w+t,w-t)\) gives the displayed formula.

The following is a concrete sufficient target:

\[
\int_{\mathbb R}e^{2\tau v^2}
\left[\int_{\mathbb R}u^2e^{2\tau u^2}\Phi(v+u)\Phi(v-u)\,du\right]
\cos(2xv)\,dv>0
\]

for every real \(x\) and \(0<\tau\le1/2\). It implies no real multiple roots. Pointwise positivity of \(Q_\tau\) is not enough: the outer cosine oscillates. Positive definiteness gives a nonnegative Fourier transform under these regularity assumptions, but strict spectral positivity remains necessary for this particular sufficient criterion. Merely obtaining \(D\ge0\) permits a multiple root where \(D=0\).

The positive-definite-kernel/Laguerre bridge is established background, not a new criterion: see [Csordas, Fourier transforms of positive definite kernels and the Riemann ξ-function](https://arxiv.org/abs/1309.0055). The task is to prove additional theta-specific spectral positivity rather than rename kernel positivity or moment inequalities as a collision barrier.

## 6. What entropy can and cannot supply here

For the normalized positive kernel density \(p_\tau=K_\tau/\int K_\tau\),
\(\partial_\tau p_\tau=(u^2-\mathbb E_\tau u^2)p_\tau\).
In particular, \(\partial_\tau\mathbb E_\tau u^2=\operatorname{Var}_\tau(u^2)\ge0\). This true moment monotonicity also holds in both countermodels and therefore cannot by itself exclude their collisions. Fourier cancellation constraints \(H=H'=0\) require an additional inequality linking this positive measure to oscillatory transforms.

**Outcome:** the determinant route has an exact sign obstruction; two explicit countermodels identify insufficient hypotheses. The remaining useful target is a strict theta-specific oscillatory or spectral inequality. No RH proof has been obtained.
