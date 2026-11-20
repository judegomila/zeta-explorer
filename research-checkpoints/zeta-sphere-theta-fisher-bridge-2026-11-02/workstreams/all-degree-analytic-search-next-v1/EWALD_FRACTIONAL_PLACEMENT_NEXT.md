# Fractional Ewald placement as a folded sine-series inequality

## Scope and outcome

`EWALD_CURVATURE_PAYMENT_NEXT.md` reduces the corrected paid form to

\[
 \mathfrak q(\pi)=\int_0^\infty K_2(x)J_\pi''(x)\,dx,
 \qquad
 K_2(x)={1\over2}\{x\}(1-\{x\}),               \tag{1}
\]

where the residual is formed globally,

\[
 \pi=p-q_X+q_{Q^{-1}r}=p-q_A.                    \tag{2}
\]

That note leaves the fractional-cell stochastic dominance of the positive
over the negative curvature as a sufficient condition.  The present note
linearizes that condition exactly.

The outcomes are:

1. after folding modulo the integer scale lattice, the stochastic dominance
   is equivalent to positivity of one ordinary sine series whose coefficients
   are the fully assembled samples `n J_pi(n)`;
2. the paid form is a positive weighted average of that sine series, so the
   dominance is sufficient but not necessary;
3. an explicit smooth self-Fourier Gaussian-polynomial source has positive
   paid form but violates the dominance, proving strictness even inside the
   exact self-dual endpoint class;
4. convexity of the assembled sample sequence `n J_pi(n)` is a concrete
   source-specific sufficient condition.  It retains the mismatch correction
   and never estimates the positive channels separately.

No such convexity theorem is proved for the complete-theta residual.  The
result is a sharper noncircular target and a no-go for treating stochastic
dominance as an equivalent reformulation of the paid sign.

## 1. Domain and the folded curvature

Extend `J_pi` evenly to the real line.  The correlation-domain argument in
the two preceding Ewald notes gives

\[
 J_\pi\in\mathcal S(\mathbb R),\qquad
 J_\pi(0)=J_\pi'(0)=0,                           \tag{3}
\]

and the exact Fourier self-duality

\[
 \widehat J_\pi(y)=J_\pi(y)                      \tag{4}
\]

for the convention
`hat f(y)=integral_R f(x) exp(-2 pi i x y) dx`.
All periodizations, differentiated Poisson sums, and rearrangements below
therefore converge absolutely and locally uniformly.

Put

\[
 d(x)=\min(\{x\},1-\{x\})\in[0,1/2]
\]

and define the unnormalized signed folded tail

\[
 \mathcal F_\pi(r)
 :=\int_{\{x>0:d(x)\ge r\}}J_\pi''(x)\,dx,
 \qquad 0\le r\le {1\over2}.                    \tag{5}
\]

On each cell, the set in (5) is `[n+r,n+1-r]`.  Splitting its fractional
coordinate at `1/2`, reflecting the upper half, and using evenness gives

\[
 \boxed{
 \mathcal F_\pi(r)=\int_r^{1/2}\rho_\pi(u)\,du,\qquad
 \rho_\pi(u)=\sum_{k\in\mathbb Z}J_\pi''(k+u).} \tag{6}
\]

In particular `F_pi(0)=F_pi(1/2)=0`.  Poisson summation and (4) give

\[
 \rho_\pi(u)
 =-8\pi^2\sum_{m\ge1}m^2J_\pi(m)\cos(2\pi m u). \tag{7}
\]

Integrating (7) from `r` to `1/2` yields the exact linear formula

\[
 \boxed{
 \mathcal F_\pi(r)
 =4\pi\sum_{m\ge1}mJ_\pi(m)\sin(2\pi m r).}      \tag{8}
\]

This formula uses the single corrected residual (2) before sampling.  In the
frequency and physical coordinates of the preceding notes,

\[
 \begin{aligned}
 J_\pi(m)
 &= {1\over\pi}\int_{\mathbb R}
    \mathcal B(\Xi,C_m)(t)|P_\pi(t)|^2\,dt\\
 &=2[\pi(D)\pi(-D)R_m](0).                       \tag{9}
 \end{aligned}
\]

Thus (8) has not dropped the mismatch `q_(Q^{-1}r)` and is not a sum of
separately bounded `X` and `Y` channels.

## 2. Exact relation to stochastic dominance and to the paid sign

Let

\[
 M=\int_0^\infty(J_\pi'')_+dx
  =\int_0^\infty(J_\pi'')_-dx.
\]

If `M>0`, push the two normalized curvature measures forward by `d(x)`.
The difference of their upper tails is exactly

\[
 \mu_+\{d\ge r\}-\mu_-\{d\ge r\}
 ={\mathcal F_\pi(r)\over M}.                   \tag{10}
\]

Consequently the fractional stochastic dominance from equation (35) of
`EWALD_CURVATURE_PAYMENT_NEXT.md` is equivalent to the linear family

\[
 \boxed{
 \mathcal F_\pi(r)\ge0
 \quad(0\le r\le1/2).}                           \tag{11}
\]

No positive/negative-part decomposition is needed to test (11).

Let `k(r)=r(1-r)/2`.  Folding (1), using
`rho_pi=-F_pi'`, and integrating by parts gives

\[
 \boxed{
 \mathfrak q(\pi)
 =\int_0^{1/2}{1-2r\over2}\,\mathcal F_\pi(r)\,dr.} \tag{12}
\]

The endpoint terms vanish because `k(0)=0`, `F_pi(0)=0`, and
`F_pi(1/2)=0`.  Since the weight in (12) is nonnegative, (11) implies the
paid sign.  Conversely, (12) shows that the paid sign controls only one
weighted average of `F_pi`; it does not force pointwise dominance.

The Bernoulli Fourier series gives the companion identity

\[
 \boxed{
 \mathfrak q(\pi)=\sum_{m\ge1}J_\pi(m).}         \tag{13}
\]

Equations (8), (12), and (13) distinguish three levels:

- the original sign is the scalar sum (13);
- stochastic placement is the continuum of sine inequalities (8), (11);
- a proof of (11) is therefore a genuine stronger lemma, not a reformulation
  equivalent to the target.

## 3. A self-dual countermodel to necessity

The strictness can be proved without leaving the smooth self-dual endpoint
class.  Put

\[
 \begin{aligned}
 H(x)&=\left(x^4-{3x^2\over2\pi}\right)e^{-\pi x^2},\\
 G_8(x)&=\left({8\pi^3x^8\over105}
       -{8\pi^2x^6\over15}+x^2\right)e^{-\pi x^2},\\
 G_{12}(x)&=\left(x^{12}-{33x^{10}\over2\pi}
       +{3465x^6\over8\pi^3}
       -{31185x^2\over32\pi^5}\right)e^{-\pi x^2}. \tag{14}
 \end{aligned}
\]

Repeated Fourier differentiation of the Gaussian verifies exactly that each
function in (14) has Fourier eigenvalue `+1`.  Each is even, Schwartz, and
vanishes at zero, so its integral and first derivative at zero vanish as well.
The same is true for

\[
 J_*(x)=H(x)+14G_8(x)+4G_{12}(x).                \tag{15}
\]

This is a source-class countermodel, not an asserted complete-theta residual.
For any source with these domain and self-duality properties, write

\[
 \mathcal T(J):=\int_0^\infty K_2(x)J''(x)\,dx
               =\sum_{n\ge1}J(n).
\]

Here is an elementary rigorous sign check.  For `x>=1`, direct coefficient
bounding gives

\[
 |J_*(x)|<216x^{12}e^{-\pi x^2}.                 \tag{16}
\]

For example, after replacing every lower power by `x^12`, the coefficient
majorant is

\[
 1+{3\over2\pi}
 +14\left({8\pi^3\over105}+{8\pi^2\over15}+1\right)
 +4\left(1+{33\over2\pi}+{3465\over8\pi^3}
             +{31185\over32\pi^5}\right)<216.
\]

Directed rational interval evaluation using `3.1415<pi<3.1416` and Taylor
remainders after range reduction gives

\[
 0.0013<J_*(1)<0.0015,\qquad
 0.0077<J_*(2)<0.0078.                           \tag{17}
\]

For `n>=3`, the ratios of the majorants in (16) decrease, hence

\[
 \sum_{n\ge3}|J_*(n)|
 \le {216\,3^{12}e^{-9\pi}
       \over1-(4/3)^{12}e^{-7\pi}}
 <6.1\cdot10^{-5}.                               \tag{18}
\]

The same Bernoulli identity used in (13), together with (17)--(18), implies

\[
 \mathcal T(J_*)=\sum_{n\ge1}J_*(n)>0.0089.     \tag{19}
\]

At `r=2/5`, use

\[
 \sin(4\pi/5)=\sin(\pi/5)<0.589,\qquad
 \sin(8\pi/5)=-\sin(2\pi/5)<-0.951
\]

and the weighted tail bound

\[
 \sum_{n\ge3}n|J_*(n)|
 \le {216\,3^{13}e^{-9\pi}
       \over1-(4/3)^{13}e^{-7\pi}}
 <1.82\cdot10^{-4}.                              \tag{20}
\]

Then (8) gives

\[
 {\mathcal F_*(2/5)\over4\pi}
 <0.0015(0.589)-2(0.0077)(0.951)+1.82\cdot10^{-4}
 <-0.0135.                                       \tag{21}
\]

Thus `mathcal T(J_*)>0` while `F_*(2/5)<0`.  Fractional stochastic
dominance is not necessary for positivity, even under exact Gaussian
self-duality, zero endpoint data, Schwartz decay, and all forced curvature
moments.  A proof of dominance for the actual residual must use additional
complete-theta arithmetic.

## 4. A positive-kernel difference representation

Formula (8) does yield a concrete sufficient route that is linear in the
assembled source.  Set

\[
 a_m=mJ_\pi(m),\qquad
 \Delta^2a_m=a_m-2a_{m+1}+a_{m+2}.               \tag{22}
\]

Rapid decay gives the exact discrete reconstruction

\[
 a_m=\sum_{k\ge m}(k-m+1)\Delta^2a_k.            \tag{23}
\]

For `0<theta<pi`, define the triangular sine kernel

\[
 \begin{aligned}
 T_k(\theta)
 &:=\sum_{m=1}^k(k-m+1)\sin(m\theta)\\
 &={ (k+1)\sin\theta-\sin((k+1)\theta)
       \over2(1-\cos\theta)}\ge0.                \tag{24}
 \end{aligned}
\]

The last inequality follows from
`abs(sin((k+1)theta)) <= (k+1) sin(theta)` on `(0,pi)`.
Substituting (23) into (8) gives the exact positive-kernel decomposition

\[
 \boxed{
 \mathcal F_\pi(r)
 =4\pi\sum_{k\ge1}\Delta^2a_k\,T_k(2\pi r),
 \qquad0<r<1/2.}                                 \tag{25}
\]

Therefore the source-specific sample inequalities

\[
 \boxed{
 a_m=mJ_\pi(m)\ge0,\qquad
 \Delta^2a_m\ge0
 \quad(m\ge1)}                                  \tag{26}
\]

are sufficient for fractional placement and hence for the paid sign.  The
first condition is redundant if convexity, decay, and the limiting first
difference are tracked explicitly; it is retained in (26) to make the cone
closed and unambiguous.

Condition (26) is not obtained by separate Cauchy estimates.  By (9), every
entry is the combined complete-theta directional value with the same global
regression correction.  It is also visibly stronger than (13), as the
countermodel (15)--(21) demonstrates.

Equation (25) permits a less rigid continuation as well: negative second
differences may be paid by positive ones through the explicit kernels `T_k`.
The exact remaining arithmetic target can therefore be stated without
positive/negative curvature measures:

\[
 \sum_{k\ge1}\Delta^2[kJ_\pi(k)]T_k(\theta)\ge0
 \quad(0\le\theta\le\pi),                        \tag{27}
\]

uniformly for every actual corrected residual in the ladder.  Proving (27),
or a weaker integrated estimate sufficient in (12), is still open.
At `theta=0,pi`, the expression is understood by the continuous limits of
the sine kernels; both endpoint values are zero.

## Resulting route status

The nonlinear-looking placement condition now has exact linear coordinates:

- folding and Poisson summation turn it into the sine family (8), (11);
- the target pivot is only the weighted average (12), equivalently (13);
- the explicit self-dual source (15) proves that dominance is strictly
  stronger than the paid sign;
- (25)--(27) isolate a combined-vector arithmetic cone that never separates
  the corrected feature, residue, or mismatch.

This makes fractional placement a valid sufficient route, but not a necessary
one.  Failure of (11) or (26) for an actual rung would retire only that
stronger route, not the rung or the first Xi Laguerre sign.

## Nonclaims

- `J_*` is not generated by the complete theta profile and is not an Xi, zeta,
  paid-border, or RH counterexample.
- No finite set of sample inequalities proves (26) or (27) for all indices.
- The sine series is absolutely convergent because the assembled `J_pi` is
  Schwartz; no raw nonintegrable orbit transform is periodized separately.
- Equations (26)--(27) are sufficient targets, not established properties of
  the complete-theta residual and not equivalents of RH.
