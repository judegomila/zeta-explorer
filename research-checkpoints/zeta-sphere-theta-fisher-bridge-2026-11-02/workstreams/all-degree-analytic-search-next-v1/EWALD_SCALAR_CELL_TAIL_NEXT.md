# Ewald scalar cells: differentiated expansion and a rapid-tail theorem

## Scope

This note isolates the large-index information that follows directly from
the **complete** Euler cell

\[
 d_n(s)=n^{-s}-{n^{1-s}-(n-1)^{1-s}\over 1-s},
 \qquad s={1\over2}-it,                         \tag{1}
\]

after multiplication by the completed multiplier and after the scalar
cross-Hardy integration.  It does not replace the signed-cell problem by a
pointwise-in-`t` sign claim.  In particular, it makes no RH claim.

The main conclusion is stronger than the previously used absolute
`n^{-3/2}` estimate but is deliberately sign-free:

> For every real polynomial `q` of definite parity (as in each actual
> residual), the fully assembled scalar cells `e_n`
> form a rapidly decreasing sequence.  For every `Y >= 0` there is an
> explicit finite constant `C_(q,Y)` such that
> \[
>  |e_n|\leq C_{q,Y}(1+\log n)^2(n-1)^{-Y-3/2}
>  \qquad(n\geq2).                              \tag{2}
> \]

Thus a finite analytic head plus a certified total-variation tail is
available in principle.  The theorem does **not** determine the eventual
sign of `e_n`, nor the reverse tilted-tail order after splitting the cells
into positive and negative parts.

## 1. Exact integral and its first two `s` derivatives

For `n >= 2`, elementary integration gives the entire-in-`s` identity

\[
 d_n(s)=-s\int_0^1u(n-1+u)^{-s-1}\,du.          \tag{3}
\]

Put `x=n-1+u`.  Differentiation under the integral is unrestricted because
`x >= n-1 > 0`.  The first two derivatives are

\[
 \begin{aligned}
 d_n'(s)
   &=\int_0^1u x^{-s-1}\{-1+s\log x\}\,du,\\
 d_n''(s)
   &=\int_0^1u x^{-s-1}
       \{2\log x-s(\log x)^2\}\,du.             \tag{4}
 \end{aligned}
\]

Consequently, if `sigma=Re(s) > -1`,

\[
 \begin{aligned}
 |d_n(s)|
 &\leq {|s|\over2(n-1)^{\sigma+1}},\\
 |d_n'(s)|
 &\leq {1+|s|\log n\over2(n-1)^{\sigma+1}},\\
 |d_n''(s)|
 &\leq {2\log n+|s|(\log n)^2
          \over2(n-1)^{\sigma+1}}.              \tag{5}
 \end{aligned}
\]

These bounds retain the logarithms needed when the derivatives in
`mathcal B` are taken only after `K d_n` is assembled.

## 2. All-orders large-`n` expansion with a rigorous remainder

Rewrite (3) as

\[
 d_n(s)=-s n^{-s-1}\int_0^1u
 \left(1-{1-u\over n}\right)^{-s-1}\,du.        \tag{6}
\]

Taylor's formula and

\[
 \int_0^1u(1-u)^r\,du={1\over(r+1)(r+2)}        \tag{7}
\]

give, for every integer `R >= 1`,

\[
 d_n(s)=n^{-s-1}\sum_{r=0}^{R-1}{a_r(s)\over n^r}
       +\mathcal R_{R,n}(s),                     \tag{8}
\]

where

\[
 a_r(s)=-{s(s+1)_r\over r!(r+1)(r+2)}.          \tag{9}
\]

In particular,

\[
 \begin{aligned}
 d_n(s)={}&-{s\over2}n^{-s-1}
 -{s(s+1)\over6}n^{-s-2}
 -{s(s+1)(s+2)\over24}n^{-s-3}\\
 &-{s(s+1)(s+2)(s+3)\over120}n^{-s-4}
 +\cdots .                                      \tag{10}
 \end{aligned}
\]

The integral Taylor remainder gives the pointwise bound

\[
 |\mathcal R_{R,n}(s)|
 \leq {|s(s+1)_R|\over R!(R+1)(R+2)}
 n^{-\sigma-R-1}
 \max\left\{1,
 \left(1-{1\over n}\right)^{-\sigma-R-1}\right\}. \tag{11}
\]

Here the displayed base is positive and the power is determined by
`sigma=Re(s)`; no asymptotic notation is hidden in (11).  On the critical
line the second entry of the maximum is the active one.

Let `L=log n`.  Differentiating (8) yields the useful operator form

\[
 d_n^{(j)}(s)
 =n^{-s-1}\sum_{r=0}^{R-1}{(\partial_s-L)^j a_r(s)\over n^r}
  +\partial_s^j\mathcal R_{R,n}(s),
 \qquad j=0,1,2.                                \tag{12}
\]

On every compact `s` set, direct differentiation of the integral Taylor
remainder in (6) shows

\[
 |\partial_s^j\mathcal R_{R,n}(s)|
 \leq C_{R,j,\mathcal K}(1+\log n)^j
 n^{-\sigma-R-1},\qquad j=0,1,2.               \tag{13}
\]

Equations (8)--(13) are a uniform differentiated expansion on bounded
vertical pieces.  For the unbounded scalar integral, the global bounds (5)
are cleaner and avoid introducing a `t` cutoff.

## 3. Derivatives after completed-multiplier assembly

Define

\[
 F_n(t)=K(t)d_n(s(t)),\qquad s(t)={1\over2}-it. \tag{14}
\]

Then the derivatives required by the scalar cell are exactly

\[
 \begin{aligned}
 F_n'&=K'd_n-iK d_n',\\
 F_n''&=K''d_n-2iK'd_n'-K d_n''.                \tag{15}
 \end{aligned}
\]

This is why differentiating a bare `n^{-s}` term before the residual/Euler
assembly is not an admissible substitute for (15).

For later comparison with the fixed-`t` sinusoid, set

\[
 G_r(t)=K(t)a_r(s(t)).                           \tag{16}
\]

Using (8), the contribution of the `r`th Euler coefficient to
`mathcal B(Xi,F_n)` is

\[
 n^{-3/2-r}e^{itL}
 \left\{
 {L^2\over2}\Xi G_r
 +iL(\Xi'G_r-\Xi G_r')
 +\Xi'G_r'-{1\over2}\Xi G_r''
              -{1\over2}\Xi''G_r
 \right\}.                                     \tag{17}
\]

Thus the apparent leading logarithmic sinusoid is integrated against a
completed analytic amplitude at Fourier frequency `L=log n`.  It is not a
constant-sign coefficient of the assembled scalar cell.

## 4. Exact complex form of the scalar cell

Use

\[
 \mathcal B(U,V)=U'V'-{1\over2}(UV''+U''V).     \tag{18}
\]

On the real axis, the real-coefficient symmetries give

\[
 F_n(-t)=\overline{F_n(t)},\qquad
 E_n(t)={F_n(t)+F_n(-t)\over4}.                 \tag{19}
\]

Because `q^2` and `Xi` are even, a change of variable `t -> -t` gives

\[
 \int_{\mathbb R}q(t)^2\mathcal B(\Xi,F_n(-\cdot))(t)\,dt
 =\int_{\mathbb R}q(t)^2\mathcal B(\Xi,F_n)(t)\,dt. \tag{20}
\]

The integral on the right is real (the integrand at `-t` is its complex
conjugate).  Therefore the complete scalar cell has the exact form

\[
 \boxed{
 e_n={1\over2\pi}\int_{\mathbb R}
 q(t)^2\mathcal B(\Xi,F_n)(t)\,dt.}             \tag{21}
\]

This identity is the point that permits a one-sided contour shift without
discarding the real-part coupling.

## 5. Rapid-tail theorem

Fix `Y >= 0` and move the contour in (21) to `t=x+iY`.  Along this line put

\[
 \sigma={1\over2}+Y,qquad s_Y(x)=\sigma-ix.    \tag{22}
\]

There are no poles in the closed upper strip:

* `d_n(s)` is entire for `n >= 2` by (3);
* `K(t)=s(s-1)pi^{-s/2}Gamma(s/2)` has gamma poles only when
  `s=0,-2,-4,...`, outside `Re(s)>0`;
* `Xi` is entire.

Stirling's estimate and the standard polynomial vertical-line bound for
the completed zeta factor show exponential decay on both horizontal edges,
so the vertical sides vanish.  Thus the shifted integral equals (21).

For a completely explicit bound, define on the shifted line

\[
 \begin{aligned}
 U_0(x)&=|K|\,|s_Y|,\\
 U_1(x)&=|K'|\,|s_Y|+|K|(1+|s_Y|),\\
 U_2(x)&=|K''|\,|s_Y|+2|K'|(1+|s_Y|)
                         +|K|(2+|s_Y|),         \tag{23}
 \end{aligned}
\]

where all `K` derivatives are `t` derivatives evaluated at `x+iY`, and set

\[
 \begin{aligned}
 C_{q,Y}:={1\over4\pi}\int_{\mathbb R}|q(x+iY)|^2
 \bigg(&|\Xi'|U_1+{1\over2}|\Xi|U_2
                  +{1\over2}|\Xi''|U_0\bigg)\,dx. \tag{24}
 \end{aligned}
\]

The same exponential decay proves `C_(q,Y) < infinity`.  Combining (5),
(15), and (18) now proves (2):

\[
 |e_n|\leq C_{q,Y}(1+\log n)^2
                  (n-1)^{-Y-3/2}.              \tag{25}
\]

Since `Y` is arbitrary, for every pair of nonnegative integers `A,r`,

\[
 e_n=O_{q,A}(n^{-A}),\qquad
 \sum_{n\geq2}n^r|e_n|<\infty.                 \tag{26}
\]

This rapid decay occurs only **after** the completed scalar integration.
It does not contradict the fixed-`t` `n^{-3/2}` logarithmic sinusoid.

## 6. A certified finite-head/tail mechanism

For any `r >= 0`, `N >= 2`, and `Y > r-1/2`, (25) gives the uniform Abel
tail estimate

\[
 \sup_{0\leq z\leq1}
 \sum_{n>N}n^r|e_n|z^n
 \leq C_{q,Y}\sum_{n>N}
 {n^r(1+\log n)^2\over(n-1)^{Y+3/2}}.          \tag{27}
\]

The series on the right is elementary and convergent.  Writing
`p=Y+3/2-r > 1` and using `n <= 2(n-1)` reduces it to

\[
 2^r C_{q,Y}\sum_{m\geq N}
 {\{1+\log(2m)\}^2\over m^p}.                  \tag{28}
\]

For any `N` for which `p{1+log(2N)} >= 2`, the summand is decreasing and
the usual first-term-plus-integral bound is explicit.  With
`A_N=1+log(2N)`, the integral is

\[
 N^{1-p}\left{
 {A_N^2\over p-1}+{2A_N\over(p-1)^2}
                   +{2\over(p-1)^3}\right}.   \tag{29}
\]

Taking `r=1` controls the uncomputed part of `S'(z)` uniformly through
`z=1`.  Taking `r=0,1` controls the total variation entering `P,N` and
their tails.  Thus a rigorous reverse-order computation can, in principle,
combine interval enclosures of finitely many actual cells with (27).

## 7. Exact index moments and the endpoint derivative

The same contour argument gives more than absolute convergence.  For an
integer `m >= 0`, define in the half-plane `Re(s) > m`

\[
 M_m(s):=\sum_{n\geq1}n^m d_n(s).               \tag{30}
\]

Expanding `(k+1)^m` after shifting `k=n-1` gives first in a far-right
half-plane, and then by analytic continuation throughout `Re(s)>m`,

\[
 \boxed{
 M_m(s)=\zeta(s-m)+{1\over1-s}
 \sum_{j=0}^{m-1}{m\choose j}\zeta(s-j-1).}    \tag{31}
\]

The sum is empty when `m=0`.  For `m>=1`, the apparent zeta poles strictly
to the right of the convergence boundary cancel.  For `m=0`, the expected
`s=1` pole of `M_0=zeta(s)` comes from the special first cell and is
cancelled after multiplication by `K`.  If `Y>m-1/2` and the horizontal
line avoids a boundary pole, absolute convergence on `t=x+iY` and (21)
justify termwise summation:

\[
 \sum_{n\geq1}n^m e_n
 ={1\over2\pi}\int_{\mathbb R+iY}q(t)^2
 \mathcal B\{\Xi,K M_m\}(t)\,dt.               \tag{32}
\]

For `m=0`, `M_0=\zeta(s)` and `K M_0=2\Xi`; (32) recovers the audited
endpoint normalization

\[
 \sum_{n\geq1}e_n={1\over\pi}\int_{\mathbb R}
 q(t)^2\{\Xi'(t)^2-\Xi(t)\Xi''(t)\}\,dt.       \tag{33}
\]

For the derivative required by `S'(1)`, (31) becomes

\[
 M_1(s)={2-s\over1-s}\zeta(s-1).               \tag{34}
\]

Multiplication by `K` cancels the boundary pole:

\[
 H_1(t):=K(t)M_1(s)
 =-s(2-s)\pi^{-s/2}\Gamma(s/2)\zeta(s-1).      \tag{35}
\]

The zeta pole at `s=2` is also cancelled by `2-s`, so `H_1` is holomorphic
in the upper `t` half-plane and has the required completed vertical decay.
Equation (32) can therefore be shifted back to the real line:

\[
 \boxed{
 S'(1)=\sum_{n\geq1}n e_n
 ={1\over2\pi}\int_{\mathbb R}q(t)^2
             \mathcal B(\Xi,H_1)(t)\,dt.}      \tag{36}
\]

This is an exact analytic endpoint test, not a positivity proof.  For
`m>=2`, shifting (32) back requires accounting for any lower moment-boundary
poles of `K M_m`; the far-right formula itself remains valid.

## 8. What this does and does not settle

1. Every fixed inverse-`n` coefficient in (17) is a Fourier transform at
   frequency `log n` of an analytic, exponentially decaying amplitude.
   Shifting that coefficient upward shows it is itself smaller than every
   fixed power of `n`.  Hence no finite Euler expansion produces a
   nonzero algebraic leading coefficient for `e_n`.

2. The fixed-`t` phase in (10) therefore cannot certify an eventual sign
   of the scalar cells.  The sign is a beyond-all-algebraic-orders feature
   of the completed correlation (equivalently, it requires a physical-space
   or saddle/steepest-descent analysis of the exact cell).

3. Rapid total-variation control alone does not imply
   `P(z)B_k(z) >= N(z)A_k(z)`.  That inequality compares two quantities
   which may both be much smaller than the absolute tail envelope.  A
   separate signed asymptotic, regional compensation identity, or certified
   finite-head dominance margin is still required.

4. The `n=1` half-seed is outside this tail argument and must continue to
   be handled from its exact special formula.

5. Formula (24) is an explicit finite majorant, but this note does not
   evaluate it by interval arithmetic.  A deployed finite-head certificate
   must pair (24) with certified vertical-line bounds or interval quadrature;
   floating evaluation of `C_(q,Y)` is not a proof.

The accompanying standard-library checker
`src/verify_ewald_scalar_cell_tail.py` replays the rational Taylor moments,
the first four coefficient polynomials, and the two differentiated kernel
identities used above.  It does not claim to verify the contour theorem.
