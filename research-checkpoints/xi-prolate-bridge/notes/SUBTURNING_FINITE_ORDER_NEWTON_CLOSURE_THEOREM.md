# Subturning finite-order Newton closure theorem

## 0. Exact outcome and claim boundary

Retain

\[
 Y_c=c^{3/4},\qquad
 {\cal D}_c=\{s=x+iy:x\geq1,\ |y|\leq2Y_c\},                  \tag{0.1}
\]

the two fixed labels `j=0,4`, and the exact gauged Riccati equation

\[
 x+\alpha_jSx=-f_j-f_jx-\alpha_jxSx,
 \qquad (Sg)(s)=g(s+2).                                          \tag{0.2}
\]

This note proves the analytic closure which was left conditional in the
minimal-Riccati note.  It does not prove an all-tree estimate and does not
restore the global positive-support Wiener class ruled out by the
first-cherry note.  Instead it uses thirteen fixed perturbative orders,
followed by one polynomially bounded Newton correction.  The result is an
exact Watson-minimal solution of (0.2), analytic on (0.1), with

\[
 |x_j(s)|\leq {C_j\over c}\rho _0(x),\qquad
 |\partial_sx_j(s)|\leq {C_j\over c}\rho _1(x),                  \tag{0.3}
\]

where

\[
 \rho _0(x)={1\over1+x}+{c\over c+x},\qquad
 \rho _1(x)={1\over(1+x)^2}+{c\over(c+x)^2}.                    \tag{0.4}
\]

Consequently the conditional conclusion of the frozen closure note is
unconditional: uniformly for

\[
 s={1\over2}-it,\qquad c^{1/2}\leq t\leq {Y_c\over2},
 \qquad \sigma_j=s+j-1,                                         \tag{0.5}
\]

one has

\[
 P_j(s)=e^{D_c(\sigma_j)}H_j(s)(1+\varepsilon_j(s)),\qquad
 |\varepsilon_j(s)|+|\partial_t\varepsilon_j(s)|
 \leq C_j\left({1\over t}+{t\over c}\right).                  \tag{0.6}
\]

The proof is deliberately restricted to the subturning strip.  It gives
no estimate at the turning height `|Im(s)|=2c`, no global Wiener
invariance, no far-ordinate tail, no operator-relative exterior or row
estimate, no finite-gate synchronization, no arithmetic sign, no eta
decay, no Riemann-hypothesis implication, and no de Bruijn--Newman bound.
The project state remains `P0_INVALIDATED`.  This is an unbound
post-checkpoint-1.46 theorem/test pair and changes none of the standard
eight files.

## 1. Frozen inputs

The following five note/test pairs are imported byte for byte.

| Dependency | SHA-256 |
|---|---|
| notes/SUBTURNING_MINIMAL_RICCATI_EULER_CLOSURE_BARRIER.md | faa787a3cc96fe83f41aeeec44b868feaa1e6755b90b925921e2448c3e029ac8 |
| tests/test_subturning_minimal_riccati_euler_closure_barrier.py | 6b2e347793020deb48730a3d11ce36c1f8f926e2c63768f376f1c4bbbd54a204 |
| notes/SUBTURNING_LAPLACE_VOLTERRA_TURNING_RESONANCE_BARRIER.md | 0c702f4adc6e6487d0511ce6f1dcce308996c943ff52423d100546288b4a3127 |
| tests/test_subturning_laplace_volterra_turning_resonance_barrier.py | bd93da5b3d322cb95d878fff85650f070c1b3f1377349881a246938ddd268622 |
| notes/SUBTURNING_FIRST_CHERRY_GLOBAL_WIENER_CLOSURE_BARRIER.md | e842c084080a4d2a2c101bbb6b113031151065c527685c43095ee5a0ab2b04f7 |
| tests/test_subturning_first_cherry_global_wiener_closure_barrier.py | 1d2c6662e8b09905308a3b08cf8607a4e924aa27df796e392d02397cdbd6eaf8 |
| notes/EXACT_PROLATE_MELLIN_RECURRENCE_BIRKHOFF_CONNECTION_BARRIER.md | d1191bdc6f0d2edd0ae900e1a7d73f61cea7f78693e2074b6850df7aec36a041 |
| tests/test_exact_prolate_mellin_recurrence_birkhoff_connection_barrier.py | 836949d060b03d697574731aad2ede90241b2f6ccb29e58d123908218ef7955f |
| notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md | d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd |
| tests/test_first_prolate_correction.py | 9f424a931f3a9435ec0ce9883b07201afe9b85cf56fcdda81644050e876ef991 |

The first pair supplies the exact recurrence, gauge, finite Euler identity,
and the downstream Watson/Casoratian/annulus implication conditional on
closure.  The next two pairs identify why unrestricted Volterra/Wiener
closure is false.  They are not used as positive closure hypotheses.  The
fourth pair supplies the exact physical recurrence and Watson endpoint
normalization; the fifth supplies the fixed-label real anchor.

## 2. Exact symbols and arbitrary fixed derivative order

Put

\[
 D_c(z)=c\left\{\sqrt{1+(z/2c)^2}-1
 -{z\over2c}\operatorname {arsinh}(z/2c)\right\},                \tag{2.1}
\]

\[
 \phi_j(s)=e^{D_c(s+j-1)}b_j(s),\qquad
 w_j(s)={\Gamma((s+2)/2)\over\Gamma((s+1)/2)}
          \phi_j(s)\phi_j(s+2),                                  \tag{2.2}
\]

with `b_0=2^(-3/4)` and

\[
 b_4(s)={4s(s-1)+3\over32a_4},\qquad
 a_4={\sqrt3\over2^{11/4}}.                                     \tag{2.3}
\]

The exact gauge identity is

\[
 \alpha_j(s)={w_j(s+2)\over w_j(s)}.                              \tag{2.4}
\]

The zeros of the label-four polynomial have real part `1/2`; the action
branch points have imaginary part asymptotic to `+/-2c`.  Hence every
fixed number of derivatives is uniformly separated from all singularities
on (0.1).  The finite Taylor calculation used in the frozen closure note
therefore extends, with a constant depending on the fixed order, to every
integer `r>=0`:

\[
 |\partial_s^m f_j(s)|
 \leq C_{j,r}\left\{{1\over c(1+x)^{m+1}}
                    +{1\over(c+x)^{m+1}}\right\},
 \qquad 0\leq m\leq r,                                           \tag{2.5}
\]

and

\[
 |\partial_s^{m+1}\alpha_j(s)|
 \leq C_{j,r}\left\{(1+x)^{-m-2}
                    +{c\over(c+x)^{m+2}}\right\},
 \qquad 0\leq m\leq r.                                         \tag{2.6}
\]

No all-order constant is asserted: `C_(j,r)` may grow arbitrarily with
`r`.  Only the finite value `r=168` is needed below.

For bookkeeping define

\[
 \delta_c(x,y)=
 \begin{cases}
 (1+x)^{-1}+c^{-1/2}+x/c+|y|/c,&x\leq4c,\\
 1+\log(x/c),&x>4c,
 \end{cases}                                                       \tag{2.7}
\]

and, for `ell=0,1`,

\[
 \|g\|_{r,\ell}=
 \max_{0\leq m\leq r}\sup_{{\cal D}_c}
 { |\partial_s^m g(s)|\over\rho_\ell(x)\delta_c(x,y)^m}.        \tag{2.8}
\]

Taylor's integral formula shows that `S` is bounded on each fixed
seminorm.  Leibniz' rule and (0.4) give

\[
 \|gh\|_{r,0}\leq C_r\|g\|_{r,0}\|h\|_{r,0},\qquad
 \|gh\|_{r,1}\leq C_r\|g\|_{r,1}\|h\|_{r,0}.                  \tag{2.9}
\]

Equations (2.5)--(2.6) say, in particular,

\[
 \|f_j\|_{r,0}+\|\partial_sf_j\|_{r-1,1}\leq {C_{j,r}\over c}, \tag{2.10}
\]

and multiplication by `alpha_j` is bounded on the two fixed-order
symbol classes.

## 3. A finite-loss Euler inverse

For a normally convergent right-hand side set

\[
 ({\cal E}_jg)(s)={1\over w_j(s)}
 \sum_{n\geq0}(-1)^nw_j(s+2n)g(s+2n).                             \tag{3.1}
\]

The exact twelve-step Euler identity in the frozen closure note, applied
after each of at most `r` exterior derivatives, gives the finite-loss
estimate

\[
 \|{\cal E}_jg\|_{r,\ell}
 \leq C_{j,r}\|g\|_{r+12,\ell},
 \qquad \ell=0,1.                                                  \tag{3.2}
\]

For \(r\geq1\), introduce the mixed seminorm

\[
 \|g\|_{r,*}=\|g\|_{r,0}+\|\partial_sg\|_{r-1,1}.                 \tag{3.2a}
\]

The pure estimate (3.2) does not by itself preserve this mixed norm.
Indeed, if \(y={\cal E}_jg\), differentiation of
\(y+\alpha_jSy=g\) gives

\[
 y'+\alpha_jSy'=g'-\alpha_j'Sy.                                  \tag{3.2b}
\]

Apply (3.2) with \(\ell=1\) to (3.2b).  The term
\(\alpha_j'Sy\) requires twelve extra \(\rho_0\)-derivatives of \(y\);
obtaining those from the undifferentiated equation costs a second block
of twelve input derivatives.  Leibniz' rule, (2.6), and (2.9) therefore
give the conservative mixed finite-loss estimate

\[
 \|{\cal E}_jg\|_{r,*}\leq C_{j,r}\|g\|_{r+24,*}.                 \tag{3.2c}
\]

This is the point which distinguishes (3.2c) from the false
finite-top-norm self-map.  The input has twenty-four more derivatives
than the mixed output.  If \(m\) derivatives fall outside (3.1), twelve
Euler differences are still taken inside; the differentiated equation
pays separately for the coefficient term in (3.2b).  There is no top
seminorm at which the Euler depth becomes zero.

For completeness, the large factor before differencing is at most

\[
 C(1+x)^{9/2}\exp\{-x^2/(C_jc)\}.                                 \tag{3.3}
\]

On the worst boundary `|y|=2c^(3/4)`, twelve differences contribute
`(Y_c/c)^12=c^(-3)`, while summing the degree-`9/2` Gaussian envelope
costs at most `c^(11/4)`.  The product is `O(c^(-1/4))`.  At smaller
height the difference factor is stronger.  For `x>4c`, the
`exp(-x log(x/c)/C_j)` tail absorbs every fixed logarithmic derivative.
The extra weight `rho_1` only improves the summed tail.  This proves (3.2)
for each fixed `r`; it makes no uniform assertion as `r` tends to infinity.

## 4. Thirteen exact perturbative orders

Suppress the fixed label.  Let `L=I+alpha S`, and introduce a formal
parameter only to count occurrences of `f`.  Define

\[
 Lx_1=-f,                                                          \tag{4.1}
\]

and, for `2<=n<=13`,

\[
 Lx_n=-fx_{n-1}
 -\alpha\sum_{a=1}^{n-1}x_aSx_{n-a}.                              \tag{4.2}
\]

Starting with the derivatives in (2.5)--(2.6), apply (3.2) from the
highest order down by first building the complete \(\rho_0\) hierarchy
and then the differentiated hierarchy.  This avoids paying the second
twelve-derivative block anew at every degree.  More precisely, let

\[
 D(n,q)=q+12(n+1).                                                \tag{4.2a}
\]

To control \(q\) derivatives of \(x_n'\), equation (3.2b) needs
\(q+12\) derivatives of every lower-degree derivative and \(q+12\)
undifferentiated derivatives of \(x_n\).  The worst lower degree is
\(n-1\), and

\[
 D(n-1,q+12)=q+12(n+1)=D(n,q).                                   \tag{4.2b}
\]

The undifferentiated depth-\(n\) hierarchy has the same upper ledger.
Thus \(D(13,0)=168\) fixed symbol derivatives suffice.  In every
differentiated recurrence exactly one factor lies in the \(\rho_1\)
class and all remaining factors lie in the \(\rho_0\) class, so (2.9)
applies.  Induction using (2.9)--(2.10) proves

\[
 \|x_n\|_{1,0}+\|\partial_sx_n\|_{0,1}
 \leq C_{j,n}c^{-n},\qquad 1\leq n\leq13.                         \tag{4.3}
\]

Put

\[
 x^{[13]}=\sum_{n=1}^{13}x_n.                                    \tag{4.4}
\]

For all sufficiently large `c` (with the threshold allowed to depend on
the two fixed labels), (4.3) gives

\[
 |x^{[13]}|\leq {C_j\over c}\rho_0,\qquad
 |\partial_sx^{[13]}|\leq {C_j\over c}\rho_1.                    \tag{4.5}
\]

Let

\[
 {\cal F}(x)=Lx+f+fx+\alpha xSx.                                  \tag{4.6}
\]

Every coefficient through degree thirteen cancels exactly by
(4.1)--(4.2).  Therefore the residual is not an asymptotic shorthand but
the finite identity

\[
 R:={\cal F}(x^{[13]})
 =fx_{13}+\alpha
   \sum_{\substack{1\leq a,b\leq13\\a+b>13}}x_aSx_b.             \tag{4.7}
\]

Equations (2.9) and (4.3) yield

\[
 |R(s)|\leq C_jc^{-14}\rho_0(x),\qquad
 |\partial_sR(s)|\leq C_jc^{-14}\rho_1(x).                       \tag{4.8}
\]

This finite construction is why no `O(C^|tau|)` all-tree bound is needed.

## 5. Explicit action decrease and a polynomial Green bound

Write

\[
 w_j(s)=g_j(s)e^{{\cal A}_j(s)},\qquad
 {\cal A}_j(s)=D_c(s+j-1)+D_c(s+j+1).                            \tag{5.1}
\]

The gamma quotient and the two fixed label-four quadratics give, uniformly
for `r>=0`,

\[
 \left|{g_j(s+r)\over g_j(s)}\right|
 \leq C_j\left({1+x+r\over1+x}\right)^5.                         \tag{5.2}
\]

The exponent five is deliberately rounded up from the sharp `9/2`.
Since

\[
 {\cal A}_j'(s)=-{1\over2}\left\{
 \operatorname {arsinh}{s+j-1\over2c}
 +\operatorname {arsinh}{s+j+1\over2c}\right\},                 \tag{5.3}
\]

and `|y|/(2c)<=c^(-1/4)`, elementary compact comparison with the positive
real axis gives constants `kappa>0,c_0` such that

\[
 \operatorname {Re}\{-{\cal A}_j'(x+iy)\}\geq\kappa m_c(x),\qquad
 m_c(x)=
 \begin{cases}
 x/c,&1\leq x\leq c,\\
 1+\log(x/c),&x\geq c.
 \end{cases}                                                       \tag{5.4}
\]

The finitely many shifts by `j+/-1` are absorbed by decreasing `kappa`.
Integrating (5.4) and using (5.2) proves the uniform forward ratio

\[
 \left|{w_j(s+r)\over w_j(s)}\right|
 \leq C_j\left({1+x+r\over1+x}\right)^5
 \exp\left\{-\kappa\int_x^{x+r}m_c(u)\,du\right\}.              \tag{5.5}
\]

Consider now a coefficient `beta=alpha theta` for which

\[
 \left|\prod_{k=0}^{n-1}\theta(s+2k)\right|
 \leq C\left({c+x+2n\over c+x}\right)^B                         \tag{5.6}
\]

with fixed \(B\), and suppose also that

\[
 \left|\partial_s\log
 \prod_{k=0}^{n-1}\theta(s+2k)\right|\leq C_B.                  \tag{5.6a}
\]

The value estimate below uses (5.6), while the \(C^1\) estimate also uses
(5.6a).  Equations (2.4) and (5.5) give

\[
 \prod_{k=0}^{n-1}\beta(s+2k)
 ={w_j(s+2n)\over w_j(s)}
  \prod_{k=0}^{n-1}\theta(s+2k).                                \tag{5.7}
\]

If `x<=c`, split the sum at `x+2n=c`.  Before the split, the exponential
in (5.5) is at most

\[
 \exp\{-\kappa((x+2n)^2-x^2)/(2c)\};                             \tag{5.8}
\]

the degree-five Gaussian sum is `O(c^3)`.  On this range the factor in
(5.6) is bounded.  After the split, and for `x>=c` from the start, the
second line of (5.4) absorbs every fixed power in (5.2) and (5.6).
Because both weights in (0.4) decrease, this proves

\[
 \sup_{{\cal D}_c}{1\over\rho_\ell(x)}
 \sum_{n\geq0}
 \left|\prod_{k=0}^{n-1}\beta(s+2k)\right|
 \rho_\ell(x+2n)
 \leq Cc^3,\qquad \ell=0,1.                                      \tag{5.9}
\]

Consequently the minimal Green series

\[
 ({\cal G}_\beta h)(s)=\sum_{n\geq0}(-1)^n
 \left\{\prod_{k=0}^{n-1}\beta(s+2k)\right\}h(s+2n)            \tag{5.10}
\]

converges normally and is an exact inverse of `I+beta S`.  Direct
differentiation of (5.7) gives a conservative weighted estimate.  If
\(P_n\) denotes the product in braces in (5.10), then

\[
 {\partial_sP_n\over P_n}
 ={\partial_sw_j(s+2n)\over w_j(s+2n)}
  -{\partial_sw_j(s)\over w_j(s)}
  +\partial_s\log\prod_{k=0}^{n-1}\theta(s+2k).                  \tag{5.11}
\]

On \(x\leq c\), the ratio \(\rho_0(x)/\rho_1(x)\) is at most \(Cc\).
The first two logarithmic derivatives in (5.11) have only the fixed
symbol factor \(1+\log(2+(x+2n)/c)\), which the action tail absorbs.
Thus (5.9) costs at most one additional power of \(c\) after
differentiation.  For \(c<x\leq Kc\), with a fixed sufficiently large
\(K\), the same weight ratio is \(O_K(c)\).  For \(x>Kc\), the explicit
large-real-part action gives

\[
 |\beta(s)|+|\partial_s\beta(s)|\leq C_B(c/x)^2,                 \tag{5.12}
\]

while \(\rho_0(x)/\rho_1(x)\leq Cx\).  The \(n=0\) product has zero
derivative, and (5.12) makes every \(n\geq1\) derivative term at most
\(O(c)\) after the weight ratio; the remaining products form a stronger
summable tail.  The derivative of the theta product is bounded by the
hypothesis verified in Section 6.  These three ranges give

\[
 \|{\cal G}_\beta h\|_{C^1(\rho_0,\rho_1)}
 \leq Cc^6\|h\|_{C^1(\rho_0,\rho_1)}.                            \tag{5.13}
\]

Here the norm on either side is

\[
 \|h\|_{C^1(\rho_0,\rho_1)}=
 \sup_{{\cal D}_c}{|h|\over\rho_0}
 +\sup_{{\cal D}_c}{|\partial_sh|\over\rho_1}.                  \tag{5.14}
\]

The exponent six is not sharp.  Equation (5.9) gives exponent three for
the undifferentiated inverse; three additional powers harmlessly cover
the weight ratio, the logarithmic derivative in (5.7), and the far-range
split.  Equation (5.12) shows explicitly that no unbounded factor in
\(x\) is hidden in (5.13).

This polynomial bound is compatible with the frozen resonant model
\(g_R=Ae^{i\pi s/2}e^{-s/R}\).  When \(R\gg c\), normalization by
\(\rho_0\) forces \(A=O(c/R)\) near \(x=R\); its inverse amplification
\(R/2\) is therefore only \(O(c)\), not superpolynomial.

## 6. The linearized coefficient satisfies the product hypothesis

Let `X=x^[13]`.  Differentiating (4.6) in its argument gives

\[
 D{\cal F}(X)y=a\,y+b\,Sy,\qquad
 a=1+f+\alpha SX,\quad b=\alpha(1+X).                             \tag{6.1}
\]

The residual identity has a second exact use:

\[
 1+R=(1+X)(1+f+\alpha SX).                                       \tag{6.2}
\]

Thus `a` is nonzero for large `c`, and after division by `a` the shifted
coefficient is exactly

\[
 \beta={b\over a}=\alpha{(1+X)^2\over1+R}.                        \tag{6.3}
\]

Put `theta=(1+X)^2/(1+R)`.  From (4.5) and (4.8),

\[
 |\log\theta(s)|\leq {C_j\over c}\rho_0(x),\qquad
 |\partial_s\log\theta(s)|\leq {C_j\over c}\rho_1(x).          \tag{6.4}
\]

Integral comparison gives the two exact summability scales

\[
 {1\over c}\sum_{k=0}^{n-1}\rho_0(x+2k)
 \leq C+B\log{c+x+2n\over c+x},                                  \tag{6.5}
\]

\[
 {1\over c}\sum_{k=0}^{\infty}\rho_1(x+2k)\leq C.               \tag{6.6}
\]

Exponentiating (6.5) proves (5.6), while (6.6) controls the derivative of
the product.  Equation (6.2) and the same two bounds show that
multiplication by \(a^{-1}=(1+X)/(1+R)\) is bounded in the weighted
\(C^1\) norm.  Therefore `D F(X)` has a normally convergent inverse and

\[
 \|D{\cal F}(X)^{-1}\|_{C^1(\rho_0,\rho_1)}\leq C_jc^6.          \tag{6.7}
\]

The same statement applies to any `x` satisfying (0.3), because for an
exact solution (6.2) has `R=0` and the normalized coefficient is simply

\[
 \beta_x=\alpha(1+x)^2.                                           \tag{6.8}
\]

## 7. Newton closure

Write `x=X+y`.  Since the Riccati nonlinearity is quadratic, there is no
Taylor remainder beyond

\[
 {\cal F}(X+y)=R+D{\cal F}(X)y+\alpha ySy.                         \tag{7.1}
\]

On the weighted analytic \(C^1(\rho_0,\rho_1)\) space define

\[
 {\cal T}(y)=-D{\cal F}(X)^{-1}\{R+\alpha ySy\}.                  \tag{7.2}
\]

Use the deliberately conservative exponent `A=6` from (6.7).  Equations
(4.8) and (6.7) put `T` in a ball of radius

\[
 r_c=K_jc^{A-14}=K_jc^{-8}.                                      \tag{7.3}
\]

The product estimates
\(\rho_0^2\leq C\rho_0\) and
\(\rho_0\rho_1\leq C\rho_1\) give the \(C^1\) Lipschitz bound

\[
 \operatorname {Lip}({\cal T})
 \leq C_jc^Ar_c=O_j(c^{-2}).                                     \tag{7.4}
\]

For large `c`, (7.2) is a contraction in the weighted \(C^1\) space.  It
produces an analytic exact solution with

\[
 |y(s)|\leq C_jc^{-8}\rho_0(x),\qquad
 |\partial_sy(s)|\leq C_jc^{-8}\rho_1(x).                       \tag{7.5}
\]

Combining (4.5) and (7.5) proves (0.3).  Notice the two strict
exponent inequalities which make the construction work:

\[
 14-A=8>0,
 \qquad 14-2A=2>0.                                                \tag{7.6}
\]

This is a finite-order Newton argument, not an all-order Banach algebra
argument.

## 8. Exact correction, Watson uniqueness, and the connection formula

Equation (0.3) implies

\[
 \sum_{n\geq0}|\partial_sx_j(s+2n)|\leq {C_j\over c},             \tag{8.1}
\]

because the shift sum of `rho_1` is uniformly bounded.  Hence

\[
 Q_{j,0}'(s)=-\sum_{n\geq0}
 {\partial_sx_j(s+2n)\over1+x_j(s+2n)}                            \tag{8.2}
\]

converges normally and is `O_j(c^(-1))`.  Its primitive satisfies

\[
 \partial_s\{Q_{j,0}(s+2)-Q_{j,0}(s)
              -\log(1+x_j(s))\}=0.                               \tag{8.3}
\]

The constant in (8.3) is \(O_j(c^{-1})\): integrate \(Q_{j,0}'\) over a
two-unit segment and use \(\log(1+x_j)=O_j(c^{-1})\).  The linear
function which removes it therefore has \(O_j(c^{-1})\) slope.  Add a
constant to obtain the exact normalization

\[
 Q_j(2)=0,\qquad
 Q_j(s+2)-Q_j(s)=\log(1+x_j(s)),\qquad
 |Q_j'(s)|\leq {C_j\over c}.                                     \tag{8.4}
\]

Therefore

\[
 W_j(s)=\phi_j(s)e^{Q_j(s)}                                      \tag{8.5}
\]

is analytic, nonzero, and satisfies the exact physical recurrence on
\({\cal D}_c\).  No value of \(x_j\) outside that domain is assumed.
For \(z=1/2-it\) in (0.5), define instead the one-step Riccati extension

\[
 x_{j,-}(z)=-
 {f_j(z)+\alpha_j(z)x_j(z+2)\over
  1+f_j(z)+\alpha_j(z)x_j(z+2)}.                                \tag{8.5a}
\]

The critical-line symbol bounds from the frozen recurrence pair and
(0.3) make the denominator \(1+o(1)\), uniformly in (0.5), and give

\[
 |x_{j,-}(z)|+|\partial_tx_{j,-}(z)|
 \leq C_j\left({1\over t}+{t\over c}\right).                    \tag{8.5b}
\]

Put \(p_j(z)=\phi_j(z+2)/\phi_j(z)\) and
\(d_j(z)=(z+2)(z+1)/c-a_j(c)\).  The original three-term recurrence
defines the lower-strip value explicitly by

\[
\begin{split}
 W_{j,-}(z)
 &={(z+2)W_j(z+4)+d_j(z)W_j(z+2)\over z+1}\\
 &={W_j(z+2)\over p_j(z)(1+x_{j,-}(z))}.
\end{split}                                                       \tag{8.5c}
\]

The equality of the two lines follows by substituting (8.5a) and the
exact defect identities defining \(f_j\) and \(\alpha_j\).  In
particular, (8.5c), rather than an evaluation of (0.2) outside
\({\cal D}_c\), proves the physical recurrence at \(z\).  Since

\[
 {1\over1+x_{j,-}(z)}
 =1+f_j(z)+\alpha_j(z)x_j(z+2),
\]

equations (8.4)--(8.5c) give the exact comparison

\[
 {W_{j,-}(z)\over\phi_j(z)}
 =e^{Q_j(z+2)}
  \{1+f_j(z)+\alpha_j(z)x_j(z+2)\}.                              \tag{8.5d}
\]

Here \(|Q_j(z+2)|\leq C_j(1+t)/c\) and
\(|\partial_tQ_j(z+2)|\leq C_j/c\).  The same critical-line symbol
bounds used in (8.5b) therefore give, after writing
\(W_j(z)=W_{j,-}(z)\),

\[
 W_j(z)=\phi_j(z)(1+u_j(z)),\qquad
 |u_j(z)|+|\partial_tu_j(z)|
 \leq C_j\left({1\over t}+{t\over c}\right)                     \tag{8.6}
\]

on (0.5).

Let `B_j=P_j/G` be the physical Watson-normalized solution.  The
Casoratian

\[
 \Omega_j(s)=B_j(s+2)W_j(s)-B_j(s)W_j(s+2)                        \tag{8.7}
\]

obeys

\[
 \Omega_j(s+2)=-{s+1\over s+2}\Omega_j(s).                       \tag{8.8}
\]

Both solutions decrease faster than every fixed power on a right lattice.
Iteration of (8.8), on the other hand, is a nonzero constant times
`(-1)^n n^(-1/2) Omega_j(s)`.  Hence `Omega_j=0` and

\[
 B_j(s)=C_j(s;c)W_j(s),\qquad C_j(s+2;c)=C_j(s;c).                 \tag{8.9}
\]

On the one-step lower strip define \(C_j(z;c)=C_j(z+2;c)\).
Because both \(B_j\) and the value (8.5c) obey the original recurrence,
the proportionality in (8.9) extends to \(z=1/2-it\).

Physical Mellin growth and (8.4) bound this periodic quotient on the
annulus `e^(-pi Y_c)<|e^(i pi s)|<e^(pi Y_c)`.  Cauchy's estimate makes
all nonconstant Laurent modes `O(exp(-pi Y_c/5))` on
`|Im(s)|<=Y_c/2`.  Finally the frozen real Hermite anchor gives

\[
 B_j(2)=b_j(2)(1+O_j(c^{-1})),\qquad
 \phi_j(2)=b_j(2)(1+O_j(c^{-1})),\qquad Q_j(2)=0,                \tag{8.10}
\]

so the constant Laurent mode is `1+O_j(c^(-1))`.  Combining
(8.5)--(8.10) proves (0.6).

## 9. Exact stopping point

The finite-top Euler obstruction and the global Wiener obstruction remain
correct statements about those two proposed proof spaces.  They do not
prevent finite-order symbolic cancellation followed by a polynomial-loss
Newton solve.  Thirteen orders dominate the conservative sixth-power
Green loss, and the exact identity (6.2) keeps the Newton coefficient in
the same action class.

Thus the subturning Birkhoff connection estimate (0.6) is closed for the
two fixed labels.  The all-tree `O(C^|tau|)` kernel theorem remains neither
proved nor needed here.  All arithmetic, finite-gate, exterior, and global
Riemann-hypothesis gates listed in Section 0 remain open, and the formal
project state remains `P0_INVALIDATED`.
