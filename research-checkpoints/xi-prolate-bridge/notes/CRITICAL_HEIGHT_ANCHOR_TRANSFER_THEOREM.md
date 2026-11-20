# Critical-height anchor and ground-transfer theorem

## 0. Claim boundary

This note proves a critical-height moment limit for the source-normalized,
projected prolate anchor.  It then gives an exact transfer theorem from that
anchor to the actual finite Weil ground.  The transfer separates two facts
that must not be conflated:

- the prolate anchor has the required critical-height moment by the source
  normalization and an explicit harmonic-sum cancellation;
- the actual Weil ground inherits that moment only after a sufficiently
  strong vector-specific ground comparison has been proved.

In particular, checkpoint 0.52 is not an input to equation (5.2) of
`DIRECT_RH_ATTACK.md`.  Its signed boundary window concerns the actual Weil
ground and is a consequence of the stronger endpoint-rate version of the
resolvent bridge, provided the two strict sector comparisons also hold.

Nothing below proves those sector comparisons or the required shifted solve
on an unbounded schedule.  No global Weil positivity, zero table, or
real-zero assumption is used.  This note proves neither equation (5.2),
locally uniform determinant convergence, nor the Riemann hypothesis.  The
formal project state remains `P0_INVALIDATED`.

The conventions and inputs are those already locked in
`P0_SOURCE_LOCK.json`, `notes/PROJECTION_RATE_THEOREM.md`,
`notes/PROJECTED_ANCHOR_ORIGIN_JET_AND_ONE_HEIGHT_GATE.md`, and
`notes/PROJECTED_STATE_NORM_LOWER_BOUND.md`.  The source function is not
unit-normalized in place of the locked source normalization.

## 1. Locked functions and the critical functional

Put

\[
 a=\log\lambda,\qquad L=2a,
 \qquad I_\lambda=[-a,a].                         \tag{1.1}
\]

Let

\[
 h(x)=\frac\pi2x^2(2\pi x^2-3)e^{-\pi x^2},      \tag{1.2}
\]

and let `h_lambda` be the source-normalized, zero-extended prolate
combination.  Both functions are even and satisfy

\[
 \int_0^\lambda h_\lambda(x)\,dx=0,
 \qquad
 \int_0^\infty h(x)\,dx=0.                       \tag{1.3}
\]

Use the arithmetic transform and explicit evenization

\[
 E(g)(u)=u^{1/2}\sum_{m\geq1}g(mu),
 \qquad
 k_\lambda^+=\frac{E(h_\lambda)+JE(h_\lambda)}2, \tag{1.4}
\]

with `Jf(u)=f(u^(-1))`, and define

\[
 f_\lambda(y)=k_\lambda^+(e^y),
 \qquad p_{\lambda,N}=P_Nf_\lambda.              \tag{1.5}
\]

The critical-height functional is

\[
 \mathcal H(v)=\int_{-a}^a\cosh(y/2)v(y)\,dy.    \tag{1.6}
\]

Because the weight in (1.6) is inversion even, evenization does not alter
its value.

The limiting logarithmic state is

\[
 K(y)=E(h)(e^y),
 \qquad \widehat K(z)=\frac{\Xi(z)}4.             \tag{1.7}
\]

The exact Poisson identity makes `K` even.  Since the completed function in
the project convention satisfies `Xi(i/2)=xi(1)=1/2`, one has

\[
 \int_{\mathbb R}\cosh(y/2)K(y)\,dy
 =\widehat K(i/2)=\frac18.                        \tag{1.8}
\]

## 2. Exact harmonic-sum identity

For `M>=1`, write `H_M=sum_(m=1)^M 1/m`, and put

\[
 B_\lambda(x)=H_{\lfloor\lambda x\rfloor}
              +\frac{\lfloor\lambda x\rfloor}{x}.
                                                               \tag{2.1}
\]

### Lemma 2.1

For every `lambda>1`,

\[
 \boxed{
 \mathcal H(f_\lambda)
 =\frac12\int_{1/\lambda}^{\lambda}
      h_\lambda(x)B_\lambda(x)\,dx.}             \tag{2.2}
\]

**Proof.**  Remove the harmless evenization in (1.4), set `u=e^y`, and use

\[
 \cosh(y/2)u^{1/2}\frac{du}{u}
 =\frac12(1+u^{-1})\,du.                          \tag{2.3}
\]

The compact support of `h_lambda` gives

\[
 \mathcal H(f_\lambda)
 =\frac12\int_{1/\lambda}^{\lambda}
  (1+u^{-1})\sum_{m\leq\lambda/u}h_\lambda(mu)\,du.
                                                               \tag{2.4}
\]

In the `m`th summand set `x=mu`, then interchange the finite sum and the
integral.  For fixed `x in [1/lambda,lambda]`, the surviving indices are
exactly `1<=m<=floor(lambda*x)`.  Their two coefficients sum to (2.1),
which proves (2.2).  \(\square\)

The identity retains the integer floor.  Replacing it by `lambda*x` before
the cancellation below is not valid.

## 3. A completely explicit finite comparison

Define the exact finite prolate error

\[
 \delta_\lambda=
 \max_{|x|\leq\lambda}|h_\lambda(x)-h(x)|,        \tag{3.1}
\]

and the Gaussian quantities already used in the projection theorem,

\[
 A_h(\lambda)=h(\lambda)
 =\frac\pi2\lambda^2(2\pi\lambda^2-3)e^{-\pi\lambda^2},
 \qquad
 I_h(\lambda)=\int_\lambda^\infty h(x)\,dx
 =\frac\pi2\lambda^3e^{-\pi\lambda^2}.           \tag{3.2}
\]

For `lambda>=1`, the limiting function is positive and decreasing on
`[lambda,infinity)`.  Put

\[
 S_4=1+\frac{e^\pi\Gamma(5/2,\pi)}{2\pi^{5/2}},  \tag{3.3}
\]

and define

\[
\begin{aligned}
 R_{\rm crit}(\lambda)={}&
 \delta_\lambda\left((\lambda+1)\log\lambda+\frac12\right)
 +\frac\lambda2 I_h(\lambda)\\
 &+\frac{A_h(\lambda)+I_h(\lambda)}2
       \left(\lambda-\lambda^{-1}+2\log\lambda\right)\\
 &+\frac{S_4}{2}\left[
   \frac{\Gamma(5/2,\pi\lambda^2)}{\sqrt\pi}
   +\Gamma(2,\pi\lambda^2)\right].              \tag{3.4}
\end{aligned}
\]

Every quantity in (3.4) is fixed; there is no unspecified finite constant.

### Theorem 3.1

For every `lambda>1`,

\[
 \boxed{
 \left|\mathcal H(f_\lambda)-\frac18\right|
 \leq R_{\rm crit}(\lambda).}                    \tag{3.5}
\]

**Proof.**  Put `g=h_lambda-h`.  If
`M=floor(lambda*x)`, then

\[
 \frac Mx-\lambda=-\frac{\{\lambda x\}}x,
 \qquad H_M\leq1+\log M.                         \tag{3.6}
\]

Consequently,

\[
 |B_\lambda(x)-\lambda|
 \leq1+\log(\lambda x)+x^{-1},                   \tag{3.7}
\]

and direct integration gives

\[
 \int_{1/\lambda}^{\lambda}
  \left(1+\log(\lambda x)+x^{-1}\right)dx
 =2(\lambda+1)\log\lambda.                       \tag{3.8}
\]

The exact zero integrals in (1.3) imply

\[
 \int_0^\lambda g(x)\,dx=I_h(\lambda).           \tag{3.9}
\]

Subtract `lambda` inside (2.2), use (3.7)--(3.9), and bound the omitted
interval `[0,1/lambda]` by `delta_lambda/lambda`.  This gives

\[
 \left|\frac12\int_{1/\lambda}^{\lambda}
             g(x)B_\lambda(x)\,dx\right|
 \leq
 \delta_\lambda\left((\lambda+1)\log\lambda+\frac12\right)
 +\frac\lambda2I_h(\lambda).                     \tag{3.10}
\]

The limiting arithmetic sum contains the additional terms with
`m>lambda/u`.  The exact integral-test estimate from the projection theorem
is

\[
 u^{1/2}\sum_{m>\lambda/u}h(mu)
 \leq A_h(\lambda)u^{1/2}+I_h(\lambda)u^{-1/2}.   \tag{3.11}
\]

Multiplication by the critical weight and integration over
`u in [lambda^(-1),lambda]` bounds those terms by the second line of (3.4).

Finally, for `u>=1`, the locked limiting-state estimate is

\[
 |K(\log u)|\leq\pi^2S_4u^{9/2}e^{-\pi u^2}.     \tag{3.12}
\]

Evenness of `K`, the substitution `u=e^y`, and the two elementary incomplete
gamma integrals bound the portion of (1.8) outside `I_lambda` by the final
line of (3.4).  Combining these three estimates proves (3.5).  \(\square\)

The pinned source comparison `delta_lambda=O(lambda^(-2))` therefore gives

\[
 \mathcal H(f_\lambda)
 =\frac18+O\!\left(\frac{\log\lambda}{\lambda}\right).
                                                               \tag{3.13}
\]

The `O` notation in (3.13) is only an asymptotic reading of the exact finite
bound (3.4); it is not inserted into a finite certificate.

## 4. Projection at the critical height

Use the centered locked modes

\[
 \phi_n(y)=(-1)^nL^{-1/2}e^{2\pi iny/L}.          \tag{4.1}
\]

Direct integration gives the exact coefficient

\[
 \boxed{
 \langle\phi_n,\cosh(\cdot/2)\rangle
 =\frac{\sinh(a/2)}
 {\sqrt L\left(1/4+(2\pi n/L)^2\right)}.}        \tag{4.2}
\]

For `N>=1`, both signs of `n` are retained.  Since
`sum_(n>N)n^(-4)<=1/(3N^3)`, (4.2) gives

\[
 \boxed{
 \|(I-P_N)\cosh(\cdot/2)\|_2
 \leq\frac{\sinh(a/2)L^{3/2}}
 {2\sqrt6\,\pi^2N^{3/2}}.}                      \tag{4.3}
\]

Let

\[
 \mathcal A_\lambda
 =\delta_\lambda\sqrt{\lambda^3-\lambda}+R_h(\lambda)
                                                               \tag{4.4}
\]

be the exact comparison bound in `notes/PROJECTION_RATE_THEOREM.md`.  Since
`||f_lambda||_2<=||K||_2+mathcal A_lambda`, orthogonality of `P_N` and
(3.5), (4.3) prove the finite estimate

\[
\boxed{
\begin{aligned}
 \left|\mathcal H(p_{\lambda,N})-\frac18\right|
 \leq{}&R_{\rm crit}(\lambda)\\
 &+\frac{\sinh(a/2)L^{3/2}}
 {2\sqrt6\,\pi^2N^{3/2}}
 \left(\|K\|_2+\mathcal A_\lambda\right).
                                                               \tag{4.5}
\end{aligned}}
\]

### Corollary 4.1

Assume the pinned asymptotic `delta_lambda=O(lambda^(-2))` and let

\[
 \frac{N(\lambda)^3}{\lambda L^3}\longrightarrow\infty.
                                                               \tag{4.6}
\]

Then

\[
 \boxed{\mathcal H(p_{\lambda,N(\lambda)})\longrightarrow\frac18.}
                                                               \tag{4.7}
\]

Both `N=3*ceil(lambda^2)` and the locked half-integer exponential schedule
satisfy (4.6).

The zero mode is already controlled by the projected-anchor origin theorem:

\[
 X(p_{\lambda,N})=\int_{I_\lambda}p_{\lambda,N}(y)\,dy
 \longrightarrow\frac{\Xi(0)}4.                 \tag{4.8}
\]

Therefore the scale-invariant anchor ratio obeys

\[
 \boxed{
 \frac{\mathcal H(p_{\lambda,N})}{X(p_{\lambda,N})}
 \longrightarrow\frac1{2\Xi(0)}.}               \tag{4.9}
\]

Here `Xi(0)>0`; numerically the limiting ratio is approximately
`1.005791795350375`, but that decimal is not used in the theorem.

If `kappa=p/||p||`, the separate projected-norm theorem also gives

\[
 X(\kappa)\longrightarrow\frac{\Xi(0)}{4a_\infty},
 \qquad
 \mathcal H(\kappa)\longrightarrow\frac1{8a_\infty},
 \quad a_\infty=\|K\|_2>0.                       \tag{4.10}
\]

## 5. Transfer to the actual Weil ground

Let `xi` be the unit actual finite Weil ground and align its phase with the
unit projected anchor `kappa`.  Put

\[
 d_{\lambda,N}=\|\xi-\kappa\|_2.                 \tag{5.1}
\]

The exact Riesz norms of the two functionals are

\[
 \|1_{I_\lambda}\|_2=\sqrt L,
 \qquad
 \|\cosh(\cdot/2)\|_2=\sqrt{a+\sinh a}.          \tag{5.2}
\]

Hence

\[
 \boxed{
 |X(\xi)-X(\kappa)|\leq\sqrt L\,d_{\lambda,N},
 \qquad
 |\mathcal H(\xi)-\mathcal H(\kappa)|
 \leq\sqrt{a+\sinh a}\,d_{\lambda,N}.}          \tag{5.3}
\]

### Theorem 5.1

Assume one common unbounded schedule on which:

1. the two strict sector comparisons in Theorem 2 of
   `DIRECT_RH_ATTACK.md` hold;
2. `d_(lambda,N)=O(lambda^(-1/2))`; and
3. the anchor hypotheses of Corollary 4.1 hold.

Then, eventually,

\[
 X(\xi)\ne0,
 \qquad
 0<\frac{\mathcal H(\xi)}{X(\xi)}\leq B           \tag{5.4}
\]

for some finite schedule-independent `B`.  If the second hypothesis is
strengthened to

\[
 d_{\lambda,N}=o(\lambda^{-1/2}),                 \tag{5.5}
\]

then

\[
 \boxed{
 \frac{\mathcal H(\xi)}{X(\xi)}
 \longrightarrow\frac1{2\Xi(0)}.}               \tag{5.6}
\]

**Proof.**  Equations (4.10) and (5.3) show that `X(xi)` has the same
eventual positive sign as `X(kappa)`, because
`sqrt(L/lambda)->0`.  Under the strict sector comparisons, the actual ground
is simple and even, its odd shifted block is positive, and the source
commutator gives its nonzero boundary value.  The exact quotient product in
`notes/PROJECTED_ANCHOR_ORIGIN_JET_AND_ONE_HEIGHT_GATE.md` then gives

\[
 \frac{\mathcal H(\xi)}{X(\xi)}
 =E_N(1/2)\prod_{k=1}^N
       \left(1+\frac1{4\rho_k^2}\right)>0.        \tag{5.7}
\]

The second inequality in (5.3), together with
`sqrt(a+sinh(a))=O(sqrt(lambda))`, bounds the numerator in (5.4), while the
first bounds its denominator away from zero.  This proves (5.4).  Under
(5.5), both errors in (5.3) tend to zero, and (4.10) proves (5.6).
\(\square\)

The resolvent-weighted bridge gives

\[
 d_{\lambda,N}\leq D(\tau_{\lambda,N})
 \leq\tau_{\lambda,N}.                            \tag{5.8}
\]

Therefore the convenient strong target

\[
 \tau_{\lambda,N}=O(\lambda^{-1/2})               \tag{5.9}
\]

would imply (5.4), while a little-`o` version would imply (5.6).

## 6. Consequence for checkpoint 0.52 and route priority

For the actual ground, checkpoint 0.52 proves exactly

\[
 \mathcal C_\lambda(\xi)+\epsilon-c_*
 =-\frac4{\sqrt\lambda}
   \frac{\mathcal H(\xi)}{X(\xi)}.                \tag{6.1}
\]

Theorem 5.1 therefore puts the signed convolution in the required one-sided
window as a consequence of the strong vector-specific ground comparison.
It does not use the window to prove that comparison.

This direction matters logically.  Using `xi approximately kappa` to
transfer the critical moment and then using that transferred moment to prove
the same ground comparison would be circular.  The open theorem remains a
common-schedule, cancellation-preserving signed graph-resolvent estimate
that proves both strict sector signs and (5.9).  Once that theorem is
available, the critical-height anchor theorem closes the checkpoint-0.52
scalar reserve without a separate pointwise-positivity or direct
`F`-majorization argument.
