# Subturning minimal-Riccati Euler closure barrier

## 0. Exact outcome and claim boundary

Retain

\[
 L=2\log\lambda,\qquad N=\lceil\lambda L^3\rceil,
 \qquad T={2\pi(N+1)\over L},\qquad c=2\pi\lambda^2,
 \qquad Y_c=c^{3/4}.                                  \tag{0.1}
\]

This note does **not** prove the subturning Birkhoff connection estimate.
It records the exact Riccati and gamma-gauge algebra, proves that the
previous fixed-depth finite-Euler closure argument fails, and isolates one
all-order/tail-norm lemma which would suffice for the locked edge.

The two failures are quantitative.

1.  A derivative majorant for the gamma-action gauge must contain
    `|Im(s)|/c`.  At height comparable with `c` that term is order one, so
    twelve fixed Euler differences do not give a uniform symbol inverse.
2.  Adaptive Euler depth does not close a finite top derivative seminorm.
    At the top derivative the remaining Euler depth is zero, and a resonant
    analytic forcing gives an inverse norm growing with the length of its
    envelope.  Moving the top derivative up only moves the loss.

Accordingly, every factorization statement below is explicitly conditional
on Closure Lemma CL in Section 5.  If CL is proved, then uniformly for

\[
 s={1\over2}-it,\qquad c^{1/2}\leq t\leq {Y_c\over2},
 \qquad \sigma_j=s+j-1,                               \tag{0.2}
\]

one obtains, for `j=0,4`,

\[
 P_j(s)=e^{D_c(\sigma_j)}H_j(s)(1+\varepsilon_j(s)),
 \qquad
 |\varepsilon_j(s)|+|\partial_t\varepsilon_j(s)|
 \leq C_j\left({1\over t}+{t\over c}\right).         \tag{0.3}
\]

Since `T/c=L^2/lambda+O(lambda^(-2)L^(-1))` and `T=o(Y_c)`, the
conditional estimate gives `O(L^2/lambda)` on
`|t-T|=O(log L)`.  It gives no far-ordinate tail, operator-relative row or
exterior estimate, Hardy--Cauchy inequality, arithmetic sign, eta decay,
RH implication, or de Bruijn--Newman bound.  The project state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

Exactly two frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/EXACT_PROLATE_MELLIN_RECURRENCE_BIRKHOFF_CONNECTION_BARRIER.md | d1191bdc6f0d2edd0ae900e1a7d73f61cea7f78693e2074b6850df7aec36a041 |
| tests/test_exact_prolate_mellin_recurrence_birkhoff_connection_barrier.py | 836949d060b03d697574731aad2ede90241b2f6ccb29e58d123908218ef7955f |
| notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md | d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd |
| tests/test_first_prolate_correction.py | 9f424a931f3a9435ec0ce9883b07201afe9b85cf56fcdda81644050e876ef991 |

The first pair supplies the exact recurrence, Watson endpoint
normalization, the action, and physical vertical growth.  The second gives
the fixed-label real Hermite anchor with error
`O(lambda^(-2))=O(c^(-1))`.  No general Birkhoff theorem is invoked.

## 2. Exact recurrence, Riccati defect, and gauge

Put

\[
 a_j(c)={\chi_j(c)\over c}=2j+1+O(c^{-1}),\qquad
 b_j(s)={H_j(s)\over G(s)},\qquad
 G(s)=\pi^{-s/2}\Gamma(s/2),                           \tag{2.1}
\]

where

\[
 b_0(s)=2^{-3/4},\qquad
 b_4(s)={4s(s-1)+3\over32a_4},\qquad
 a_4={\sqrt3\over2^{11/4}}.                            \tag{2.2}
\]

For `B_j=P_j/G`, the exact recurrence is

\[
 (s+2)B_j(s+4)
 +\left\{{(s+2)(s+1)\over c}-a_j(c)\right\}B_j(s+2)
 -(s+1)B_j(s)=0.                                      \tag{2.3}
\]

Define

\[
 D_c(z)=c\left\{\sqrt{1+(z/2c)^2}-1
 -{z\over2c}\operatorname {arsinh}(z/2c)\right\},
 \quad
 \phi_j(s)=e^{D_c(s+j-1)}b_j(s),
 \quad p_j(s)={\phi_j(s+2)\over\phi_j(s)}.            \tag{2.4}
\]

The zeros of `b_4` are `(1+i*sqrt(2))/2` and its conjugate.  Thus
`phi_j`, `p_j`, and their reciprocals are analytic and nonzero on the base
strip `1<=Re(s)<=3`, `|Im(s)|<=2Y_c`, and on all its right translates.
Set

\[
\begin{aligned}
 F_j(s)={}&(s+2)p_j(s+2)+{(s+2)(s+1)\over c}
            -a_j(c)-{s+1\over p_j(s)},\\
 A_j(s)={}&{s+1\over p_j(s)},\qquad f_j(s)={F_j(s)\over A_j(s)},\\
 \alpha_j(s)={}&{s+2\over s+1}p_j(s)p_j(s+2).
\end{aligned}                                         \tag{2.5}
\]

If `r_j(s)=B_j(s+2)/B_j(s)` is defined, (2.3) gives

\[
 r_j(s)={s+1\over
 (s+2)r_j(s+2)+(s+2)(s+1)/c-a_j(c)}.                  \tag{2.6}
\]

Writing `r_j=p_j(1+x_j)` gives the exact nonlinear identity

\[
 x_j(s)+\alpha_j(s)x_j(s+2)
 =-f_j(s)-f_j(s)x_j(s)
  -\alpha_j(s)x_j(s)x_j(s+2).                         \tag{2.7}
\]

No asymptotic assertion is used in (2.7).  Now define

\[
 w_j(s)={\Gamma((s+2)/2)\over\Gamma((s+1)/2)}
          \phi_j(s)\phi_j(s+2).                       \tag{2.8}
\]

The gamma functional equation gives the exact cancellation

\[
 {w_j(s+2)\over w_j(s)}=alpha_j(s).                  \tag{2.9}
\]

Consequently, if `eta_j=w_j x_j`, the linear part of (2.7) is exactly

\[
 \eta_j(s)+\eta_j(s+2)=w_j(s)h_j(s).                 \tag{2.10}
\]

Thus the formal Watson-minimal inverse is

\[
 ({\cal E}_jg)(s)={1\over w_j(s)}
   \sum_{n\geq0}(-1)^n w_j(s+2n)g(s+2n).             \tag{2.11}
\]

The issue is not the algebra in (2.9); it is the function space on which
(2.11) is uniformly bounded and the nonlinear map closes.

## 3. Correct action derivative and the first failed majorant

Direct differentiation gives

\[
 D_c'(z)=-{1\over2}\operatorname {arsinh}(z/2c),
 \qquad
 D_c''(z)=-{1\over4c\sqrt{1+(z/2c)^2}}.               \tag{3.1}
\]

The two overlapping charts `1/s,s/c` and `c/s` give, for every fixed
`0<=m<=13`,

\[
 |\partial_s^m f_j(s)|
 \leq C_{j,m}\left\{{1\over c(1+x)^{m+1}}
                    +{1\over(c+x)^{m+1}}\right\},
 \qquad x=\operatorname {Re}s,                        \tag{3.1a}
\]

with the evident `m=0` interpretation, and

\[
 |1+\alpha_j(s)|\geq g_j>0,
 \qquad
 |\partial_s^{m+1}\alpha_j(s)|
 \leq C_{j,m}\left\{(1+x)^{-m-2}
                    +{c\over(c+x)^{m+2}}\right\}.     \tag{3.1b}
\]

These are finite Taylor estimates: the coefficient of `c` cancels by
`r(v)-r(v)^(-1)=-v`, where
`r(v)=sqrt(1+(v/2)^2)-v/2`; the remaining functions are rational on
compact sets avoiding `v=+/-2i`.  The bounded-chart root denominators are
`2s+3` for label zero and
`(2s+3)(4s^2+12s+35)` for label four, whose zeros have real part `-3/2`.
The same calculation on `Re(s)=1/2`, `|Im(s)|>=sqrt(c)`, gives
`|f_j|+|partial_s f_j|<=C_j(1/|t|+|t|/c)`.

For fixed `m` and `1<=b<=3`, product differentiation of (2.8) on
`b<=x<=4c`, `|y|<=2Y_c`, gives the valid majorant

\[
 { |\partial_x^m w_j(x+iy)|\over |w_j(b+iy)| }
 \leq C_{j,m}(1+x)^{9/2}
 \left\{{1\over1+x}+{1\over\sqrt c}+{x\over c}
                    +{|y|\over c}\right\}^{m}
 \exp\left\{-{x^2-b^2\over C_jc}\right\}.           \tag{3.2}
\]

The gamma ratio contributes the half power, the two label-four
polynomials contribute degree four, and Bell's product formula applied to
(3.1) gives the bracket in (3.2).  Beyond `x=4c`, it is replaced by
`C_{j,m}(1+x)^{9/2}(1+log(x/c))^m`
times `exp(-x log(x/c)/C_j)`.  The crucial term is `|y|/c`.

It cannot be dropped.  Take `x=sqrt(c)`, `y=c/2`.  The logarithmic
derivatives of the gamma ratio and the fixed polynomials tend to zero,
whereas

\[
 D_c'(x+iy+j-1)+D_c'(x+iy+j+1)
 \longrightarrow-i\arcsin(1/4).                     \tag{3.3}
\]

Hence

\[
 \left|{w_j'(\sqrt c+ic/2)\over w_j(\sqrt c+ic/2)}\right|
 \longrightarrow \arcsin(1/4)>0,                    \tag{3.4}
\]

while `1/(1+x)+c^(-1/2)+x/c` tends to zero.  This is a
counterexample to the earlier slow-symbol derivative claim at height
`c/2`, not a matter of enlarging a constant.

At the smaller height `2Y_c`, the missing phase is `O(c^(-1/4))`.
Twelve derivatives then give the useful prescribed-symbol power count

\[
 c^{9/4+1/2}(Y_c/c)^{12}=c^{-1/4}.                   \tag{3.5}
\]

Equation (3.5) explains why `Y_c=c^(3/4)` is a viable annulus height, but
it does not prove nonlinear closure.

## 4. Finite Euler identity and the top-seminorm obstruction

For `Delta q_n=q_(n+1)-q_n`, repeated use of
`S(q)=(q_0-S(Delta q))/2` gives, for every integer `K>=0`,

\[
 \sum_{n\geq0}(-1)^nq_n
 =\sum_{k=0}^{K-1}{(-1)^k\over2^{k+1}}\Delta^kq_0
  +{(-1)^K\over2^K}
    \sum_{n\geq0}(-1)^n\Delta^Kq_n.                 \tag{4.1}
\]

For `K=0`, the finite sum is empty.  Formula (4.1) is exact.  For a
prescribed symbol whose first twelve derivatives have the weights in
(3.2), make this precise by putting

\[
 \delta_c(x,y)=
 \begin{cases}
 (1+x)^{-1}+c^{-1/2}+x/c+|y|/c,&x\leq4c,\\
 1+\log(x/c),&x>4c,
 \end{cases}
 \quad
 \|g\|_{12,*}=
 \max_{0\leq m\leq12}\sup_{{\cal D}_c}
 { |\partial_s^m g(s)|
  \over \rho_0(x)\delta_c(x,y)^m}.                    \tag{4.2}
\]

Here `rho_0` is the envelope in (5.1).  Taylor's integral formula and
Leibniz' rule then prove

\[
 \sum_{n\geq0}
 |\Delta^{12}\{w_jg\}(s+2n)|
 \leq C_j|w_j(s)|\,\|g\|_{12,*}.                    \tag{4.3}
\]

on `|Im(s)|<=2Y_c`.  Every Leibniz term has twelve total derivatives;
before the Gaussian maximum (3.5) controls the polynomial and integration
width, and after it `exp(-x log(x/c)/C_j)` controls every factor.  Thus
(4.1) is a valid bounded inverse estimate for each prescribed sufficiently
smooth right-hand side.

What fails is using this estimate as a self-map of a finite top derivative
space.  If `m` derivatives fall on (2.11), an adaptive proof may take
`K=12-m`, so the tail still contains twelve total derivatives.  At the top
seminorm `m=12`, however, `K=0`; its tail is the unsmoothed alternating sum
of the twelfth derivative.  One more Euler step requires derivative
thirteen and simply moves the same problem to the new top seminorm.

The obstruction already occurs for the constant-coefficient model
`(I+S)y=g`, where

\[
 ({\cal E}_0g)(s)=\sum_{n\geq0}(-1)^ng(s+2n).
\]

For `R>1`, `xi=pi/2`, and

\[
 g_R(s)=A e^{i\xi s}e^{-s/R},                         \tag{4.4}
\]

the sum is exact:

\[
 ({\cal E}_0g_R)(s)
 ={A e^{i\xi s}e^{-s/R}\over1-e^{-2/R}}.             \tag{4.5}
\]

All derivatives of order at most any fixed `M` are bounded by a constant
depending only on `M` times the same exponential envelope, both before and
after applying the inverse.  Nevertheless

\[
 {\|{\cal E}_0g_R\|_{C^1(e^{x/R})}
  \over\|g_R\|_{C^1(e^{x/R})}}
 ={1\over1-e^{-2/R}}\sim {R\over2}.                  \tag{4.6}
\]

The same ratio holds for every fixed finite top derivative norm.  On a
finite vertical strip the amplitude `A` can be normalized to absorb the
vertical type of `exp(i*pi*s/2)` without changing (4.6).  Therefore a
finite list of pointwise derivative bounds, even with adaptive Euler
depth, cannot by itself prove a uniformly bounded minimal Green operator.

## 5. The single remaining closure lemma

Let

\[
 {\cal D}_c=\{s:\operatorname {Re}s\geq1,
                    |\operatorname {Im}s|\leq2Y_c\},
 \quad
 \rho_0(x)={1\over1+x}+{c\over c+x},
 \quad
 \rho_1(x)={1\over(1+x)^2}+{c\over(c+x)^2}.           \tag{5.1}
\]

The exact next lemma is the following.

**Closure Lemma CL (unproved).**  There are shift-invariant Banach spaces
`X_(0,c)` and `X_(1,c)` of analytic functions on `D_c`, defined by an
all-order analytic norm or an equivalent norm containing the alternating
tail seminorm, with constants independent of large `c`, such that:

\[
 |g(s)|\leq\rho_\ell(\operatorname {Re}s)
             \|g\|_{X_{\ell,c}},\qquad \ell=0,1,     \tag{5.2}
\]

\[
 \|Sg\|_{X_{\ell,c}}\leq C\|g\|_{X_{\ell,c}},
 \quad
 \|gh\|_{X_{0,c}}\leq C\|g\|_{X_{0,c}}\|h\|_{X_{0,c}},
 \quad
 \|gh\|_{X_{1,c}}\leq C\|g\|_{X_{1,c}}\|h\|_{X_{0,c}}, \tag{5.3}
\]

The unitizations are multiplier algebras as well: if `h` is in `X_(0,c)`,
multiplication by `1+h` has norm at most
`C(1+||h||_(X_(0,c)))` on both spaces.  The normally convergent operator
(2.11) satisfies

\[
 \|{\cal E}_jg\|_{X_{\ell,c}}
 \leq C_j\|g\|_{X_{\ell,c}},\qquad \ell=0,1.        \tag{5.4}
\]

Moreover, multiplication by `alpha_j` is bounded on both spaces, and the
exact symbols obey

\[
 \|f_j\|_{X_{0,c}}\leq {C_j\over c},\qquad
 \|\partial_sf_j\|_{X_{1,c}}\leq {C_j\over c},
 \qquad
 \|\partial_s\alpha_j\|_{X_{1,c}}\leq C_j.          \tag{5.5}
\]

For precision, an admissible tail component is required to dominate, for
every derivative order `m`, the Euler remainder

\[
 {1\over |w_j(s)|\rho_\ell(x)}
 \sum_{n\geq0}
 \left|\Delta^{K_m}\partial_s^m
       \{w_jg\}(s+2n)\right|,                        \tag{5.6}
\]

with `K_m>=1` and with `m+K_m` unbounded as `m` grows.  This condition
excludes (4.4); a fixed maximal `m+K_m` does not.  Proving that a concrete
all-order version of (5.6) is an algebra and satisfies (5.4) is the sole
unproved analytic step.

This formulation is stronger than merely postulating the desired
solution: it names the Green operator, the two weights needed for the
solution and its derivative, the multiplication properties needed by the
nonlinearity, and the precise resonant tail which a valid norm must see.

## 6. What CL would prove

This section is an implication, not an unconditional proof.  Assume CL.
Apply (2.11) to (2.7).  In the ball
`||x||_(X_(0,c))<=R_j/c`, (5.3)--(5.5) give

\[
 \|{\cal E}_j[-f_j-f_jx-\alpha_jxSx]\|_{X_{0,c}}
 \leq {C_j\over c}+{C_j\over c}\|x\|_{X_{0,c}}
             +C_j\|x\|_{X_{0,c}}^2,                 \tag{6.1}
\]

and the Lipschitz constant is `O_j(c^(-1))`.  Banach iteration therefore
constructs a unique analytic Watson-minimal solution of (2.7), with

\[
 |x_j(s)|\leq {C_j\over c}\rho_0(\operatorname {Re}s). \tag{6.2}
\]

Differentiating (2.7), setting `y=partial_s x_j`, and grouping all terms
containing `y` gives

\[
\begin{aligned}
 y+\alpha_jSy={}&-f_jy-\alpha_jySx_j-\alpha_jx_jSy\\
 &-(\partial_sf_j)(1+x_j)
  -(\partial_s\alpha_j)(1+x_j)Sx_j.
\end{aligned}                                         \tag{6.3}
\]

On `X_(1,c)` the first three terms have operator norm `O_j(c^(-1))`, and
the last two have norm `O_j(c^(-1))`.  A second contraction gives

\[
 |\partial_sx_j(s)|
 \leq {C_j\over c}\rho_1(\operatorname {Re}s),
 \qquad
 \sum_{n\geq0}|\partial_sx_j(s+2n)|\leq {C_j\over c}. \tag{6.4}
\]

Thus the series

\[
 Q_{j,0}'(s)=-\sum_{n\geq0}
     \partial_s\log\{1+x_j(s+2n)\}                  \tag{6.5}
\]

converges normally.  After subtracting a linear function and adding a
constant, it has the exact normalization

\[
 Q_j(2)=0,\qquad
 Q_j(s+2)-Q_j(s)=\log\{1+x_j(s)\},
 \qquad |Q_j'(s)|\leq {C_j\over c}.                  \tag{6.6}
\]

Then

\[
 W_j(s)=\phi_j(s)e^{Q_j(s)}                           \tag{6.7}
\]

is an exact, analytic, nonvanishing solution of (2.3) with ratio `r_j`.
The logarithm is legitimate because (6.2) keeps `1+x_j` away from zero.
The construction is compatible across residue classes because (6.6), not
an independently chosen value on each lattice, defines `Q_j`.

For `s=1/2-it`, define `W_j(s)=W_j(s+2)/r_j(s)`.  Direct use of (2.7) in
this one backward step, together with the action-symbol estimates, gives

\[
 W_j(s)=\phi_j(s)(1+u_j(s)),\qquad
 |u_j(s)|+|\partial_tu_j(s)|
 \leq C_j\left({1\over t}+{t\over c}\right)          \tag{6.8}
\]

for the range (0.2).  This step also shows that possible zeros of `b_4` at
real part `1/2` are harmless when `|t|>=sqrt(c)`.

## 7. Conditional Watson uniqueness and periodic quotient

Still assuming CL, Watson's endpoint normalization gives, on each fixed
right lattice `q_n=s+2n`,

\[
 {B_j(q_n+2)\over B_j(q_n)}
 ={c\over q_n+2}\{1+O_{j,c,s}(q_n^{-2})\},
 \qquad
 {W_j(q_n+2)\over W_j(q_n)}
 ={c\over q_n+2}\{1+O_{j,c,s}(q_n^{-2})\}.           \tag{7.1}
\]

In particular, for all large `n`, both ratio magnitudes are at most
`4c/|q_n|`.  Hence `B_j(q_n)` and `W_j(q_n)` are each
`O_(A,j,c,s)(n^(-A))` for every fixed `A`.

Their Casoratian

\[
 \Omega_j(s)=B_j(s+2)W_j(s)-B_j(s)W_j(s+2)            \tag{7.2}
\]

obeys, exactly,

\[
 \Omega_j(s+2)=-{s+1\over s+2}\Omega_j(s).           \tag{7.3}
\]

On the one hand, both products in (7.2) are `o(n^(-1/2))` at `q_n`.
On the other hand, exact iteration gives

\[
 \Omega_j(q_n)=(-1)^n
 {\Gamma(n+(s+1)/2)\Gamma((s+2)/2)
  \over\Gamma((s+1)/2)\Gamma(n+(s+2)/2)}\Omega_j(s)
 =(-1)^n n^{-1/2}\{K(s)+o(1)\}\Omega_j(s),           \tag{7.4}
\]

where `K(s)` is finite and nonzero on the base strip.  Therefore
`Omega_j=0`, and

\[
 B_j(s)=C_j(s;c)W_j(s),\qquad C_j(s+2;c)=C_j(s;c).   \tag{7.5}
\]

This is why the same normalized Watson-minimal asymptotic removes the
second solution and leaves an exactly periodic quotient.

## 8. Conditional annulus suppression and anchor

Assume CL.  Physical Mellin growth, Stirling's formula for `G`, (6.6), and
the action at `|Im(s)|=Y_c` give

\[
 |C_j(s;c)|
 \leq M_c:=c^{K_j}
 \exp\left\{{\pi Y_c\over4}+C_j{Y_c^2\over c}\right\},
 \qquad 1\leq\operatorname {Re}s\leq3.               \tag{8.1}
\]

The same bound holds on the conjugate boundary.  With

\[
 z=e^{i\pi s},\qquad R_c=e^{\pi Y_c},                 \tag{8.2}
\]

the periodic quotient is holomorphic on
`R_c^(-1)<|z|<R_c`.  If
`C_j=sum_(n in Z)c_(j,n)z^n`, Cauchy's estimate gives

\[
 |c_{j,n}(c)|\leq M_cR_c^{-|n|},\qquad n\ne0.         \tag{8.3}
\]

Thus, for `0<=t<=Y_c/2`,

\[
 |C_j(s;c)-c_{j,0}(c)|+|\partial_tC_j(s;c)|
 \leq C M_c e^{-\pi(Y_c-t)}
 \leq \exp\{-\pi Y_c/5\}                            \tag{8.4}
\]

for all sufficiently large `c`; here `Y_c^2/c=c^(1/2)=o(Y_c)`.

At the real anchor `s=2`, the frozen first-correction estimate gives

\[
 B_j(2)=b_j(2)\{1+O_j(c^{-1})\}.                     \tag{8.5}
\]

There is no missing lambda factor: its `L^2` remainder is
`O(lambda^(-4))`, while the Mellin weight costs

\[
 \|x\|_{L^2(0,\lambda)}={\lambda^{3/2}\over\sqrt3}.
\]

The resulting moment error is `O(lambda^(-5/2))=o(c^(-1))`; the first
displayed correction is `O(lambda^(-2))=O(c^(-1))`, and Hermite tails are
exponentially small.  Since `Q_j(2)=0` and
`D_c(j+1)=O_j(c^(-1))`, (6.7) gives the same normalized value for `W_j(2)`.
Equations (8.3)--(8.5) therefore yield

\[
 c_{j,0}(c)=1+O_j(c^{-1}).                            \tag{8.6}
\]

Combining (6.8), (7.5), (8.4), and (8.6) proves (0.3) under CL; this chain
is unconditional only after CL is discharged.  Until then, (0.3) remains
conditional.  Complex conjugation supplies negative `t` under the same
hypothesis.

## 9. Exact stopping point

The exact gauge, finite Euler identity, normalized Casoratian, annulus
calculation, and real-anchor scaling are no longer the obstruction.  The
single remaining task is to prove CL with a genuine all-order analytic or
tail-seminorm space.  A finite pointwise derivative norm cannot do it by
(4.4)--(4.6), and a height-comparable-to-`c` slow-symbol estimate cannot do
it by (3.3)--(3.4).  No stronger conclusion is claimed here.
