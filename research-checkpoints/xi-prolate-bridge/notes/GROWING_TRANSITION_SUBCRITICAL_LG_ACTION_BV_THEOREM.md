# Growing-transition subcritical LG action-BV theorem

## 0. Result and exact claim boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda .                 \tag{0.1}
\]

Let `mu<c^2` be a radial prolate separation value and put

\[
 r^2=1-{\mu\over c^2},\qquad \kappa=(1-r^2)^{1/2},\qquad
 \alpha=cr^2.                                             \tag{0.2}
\]

This note treats the subcritical bulk

\[
 \boxed{\alpha\geq\alpha_0=(\log L)^4.}                  \tag{0.3}
\]

All asymptotic bounds below hold for sufficiently large locked `lambda`;
their constants are absolute and independent of the radial label.

It proves, uniformly even when `r` tends to zero, the following radial
facts.

1. The exact Bessel Liouville--Green transformation has perturbation

\[
 \boxed{
 \Psi_r(q)={1\over16\tau_r(q)^2}-{1\over4q(1+q)}
 +{3+(8+r^2)q+6r^2q^2\over16q(1+q)^3}.}                  \tag{0.4}
\]

2. For `j+k<=2`, its differentiated variation norm is bounded by an
absolute constant:

\[
 \boxed{
 \int_0^\infty
 \left|(r\partial_r)^j(q\partial_q)^k\Psi_r(q)\right|
 \tau_r'(q)\,dq\leq C_{jk}.}                              \tag{0.5}
\]

3. After retaining the `J_0/Y_0` carriers, the complete Volterra transfer
matrix and its first two logarithmic `r` derivatives at fixed `s` differ
from their unperturbed values by `O(alpha^(-1))`.  At fixed `q`, the same
bound holds only through the first logarithmic `r` derivative.  The second
fixed-`q` logarithmic derivative is asserted only to be `O(1)`.  The first
logarithmic derivative at fixed `x` is also `O(alpha^(-1))`.  The fixed-`q`
total variation over any bulk interval is `O(alpha_0^(-1))`.

4. The exact action derivative of the completed exterior phase is a
distribution function `1-u_r`; it has total action variation `O(log L)`.
The elliptic leakage normalizer and the geometric amplitude have bounded
variation.  The endpoint-normalized radial `L^2` mass is

\[
 \boxed{
 \mathcal N_r={J(r)\over\pi c}\{1+\varepsilon_r\},\qquad
 |(r\partial_r)^j\varepsilon_r|
 \leq C_j{\log(2+\alpha)\over\alpha},\quad 0\leq j\leq2.} \tag{0.6}
\]

Consequently the scalar, exterior-defect-whitened radial row has
action-amplitude variation `O(log L)=o(L)` on (0.3).  The Volterra part is
in fact `O((log L)^(-4))` in total variation.

The conclusion is deliberately radial and fail-closed.  It proves no
assembly over samples `m,l`, no cancellation of a same-side Hankel
derivative, no reflected reciprocal Fourier-integral estimate, no
transition/Weber edge estimate for `alpha<alpha_0`,
no endpoint-shear coefficient estimate, no `P_0` comparison, no prime floor, no equation
(5.2) of `DIRECT_RH_ATTACK.md`, and no RH conclusion.  In particular,
(0.5)--(0.6) do not by themselves turn a formal `1/(sigma_j-sigma_k)`
boundary term into a bounded operator.  The project state remains
`P0_INVALIDATED`.

## 1. Frozen and external inputs

The repository inputs used here are frozen at the following bytes.

| Dependency | SHA-256 |
|---|---|
| `P2_SOURCE_LOCK.json` | `8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `notes/LEADING_PROLATE_OSCILLATION_THEOREM.md` | `d65e9221642b09cb66b0f0c46d716f5d7fae98980f4c3ed3289033dacb9a266b` |

The exact algebraic transformation (2.3)--(2.5) below is the `m=0`
specialization of equations (3.1)--(3.4) in T. M. Dunster,
*Asymptotics of Prolate Spheroidal Wave Functions*, Journal of Classical
Analysis **11** (2017), 1--21, arXiv:1601.00699.  That article is not
vendored or source-locked in this checkpoint.

Dunster's uniform asymptotic theorem is **not** used.  Its hypotheses keep
the mode a fixed fraction away from the separatrix, whereas (0.3) permits
`r` to tend to zero.  Every uniform perturbation and differentiated bound
below is instead derived directly from the displayed exact `Psi`.
Olver's Chapter-12 error theorem, cited by Dunster, is likewise not an
input here and is not vendored.  Only elementary `J_0,Y_0` Wronskian,
origin, and large-argument bounds are used in Section 6.

No numerical prolate eigenvalue, eigenfunction, or zero list is used.

## 2. Exact radial and Bessel transformations

Write the dimensionless exterior coordinate as `z=t/lambda>1`.  The radial
equation is

\[
 ((z^2-1)Y')'+c^2(z^2-\kappa^2)Y=0.                       \tag{2.1}
\]

Set

\[
 x=(z^2-1)^{1/2},\qquad
 T_r(x)=\int_0^x\sqrt{{v^2+r^2\over1+v^2}}\,dv,
 \qquad \eta=T_r(x)^2.                                    \tag{2.2}
\]

Removing the first derivative and then applying the exact simple-pole
transformation gives

\[
 \widehat W=\{T_r(x)^2x^2(x^2+r^2)\}^{1/4}Y,
\]

\[
 {d^2\widehat W\over d\eta^2}
 =\left[-{c^2\over4\eta}-{1\over4\eta^2}
       +{\widehat\Psi_r(\eta)\over\eta}\right]\widehat W.
                                                                    \tag{2.3}
\]

For a direct near-separatrix scaling put

\[
 q={x^2\over r^2},\qquad
 T_r(x)=r^2\tau_r(q),\qquad
 \bar\eta=\tau_r(q)^2,                                   \tag{2.4}
\]

where

\[
 \tau_r(q)=\int_0^{\sqrt q}
       \sqrt{{1+v^2\over1+r^2v^2}}\,dv,
 \qquad
 \tau_r'(q)={\sqrt{1+q}\over2\sqrt q\sqrt{1+r^2q}}.     \tag{2.5}
\]

Multiplying (2.3) by `r^8` and substituting `z^2=1+r^2q`
gives

\[
 {d^2\widehat W\over d\bar\eta^2}
 =\left[-{\alpha^2\over4\bar\eta}-{1\over4\bar\eta^2}
       +{\Psi_r(q)\over\bar\eta}\right]\widehat W,     \tag{2.6}
\]

where `Psi_r=r^4 widehat(Psi)_r` is exactly (0.4).  To check the last
rational term without any limiting argument, Dunster's numerator at
`m=0` is

\[
 (1-\kappa^2)\{6z^4-(3+\kappa^2)z^2-2\kappa^2\}
 =r^4\{3+(8+r^2)q+6r^2q^2\}.                             \tag{2.7}
\]

For the endpoint-normalized regular solution write

\[
 \widehat W=r^2\tau_r W,
 \qquad W(0)=1,\quad W_s(0)=0,
 \qquad s=\alpha\tau_r(q)=cT_r(x).                       \tag{2.8}
\]

Then the exact scalar equation is

\[
 \boxed{
 W_{ss}+{1\over s}W_s+W=P_r(s)W,\qquad
 P_r(s)={4\over\alpha^2}\Psi_r(q_r(s)),}                 \tag{2.9}
\]

where `q_r(s)` is the inverse of `s=alpha tau_r(q)`.  The unperturbed
regular carrier is `J_0(s)`.  No fixed-distance-from-separatrix asymptotic
has entered (2.9).

## 3. Three-region differentiated perturbation bounds

Put

\[
 R=r\partial_r,\qquad Q=q\partial_q,\qquad a=r^2.         \tag{3.1}
\]

The following estimates prove (0.5).

### 3.1 The pole region `0<q<=1`

Uniformly for `0<=a<=1`, Taylor expansion of (2.5) gives

\[
 \tau_r(q)=\sqrt q+{1-a\over6}q^{3/2}
 +{3a^2-2a-1\over40}q^{5/2}+O(q^{7/2}).                  \tag{3.2}
\]

Thus

\[
 \tau_r(q)^2=q+{1-a\over3}q^2
              +{8a^2-7a-1\over45}q^3+O(q^4).            \tag{3.3}
\]

In (0.4), the three apparent `1/q` coefficients are respectively
`1/16,-1/4,3/16` and cancel exactly: after multiplication by `16q` the
pole coefficient is `1-4+3=0`.  The next coefficient gives the fragile
endpoint value

\[
 \boxed{\Psi_r(0)={r^2+2\over12}.}                         \tag{3.3a}
\]

Equations (3.2)--(3.3) show that
`Psi_r`, and every fixed `R,Q` derivative of it, extends smoothly to the
compact rectangle `0<=q<=1, 0<=a<=1`.  In particular, for `j+k<=2`,

\[
 |R^jQ^k\Psi_r(q)|\leq C_{jk},\qquad
 \tau_r'(q)\leq Cq^{-1/2}.                               \tag{3.4}
\]

The first region therefore contributes `O(1)` to (0.5).

### 3.2 The intermediate region `1<=q<=r^(-2)`

The integral representation in (2.5) gives

\[
 c_1q\leq\tau_r(q)\leq c_2q,\qquad
 c_1\leq\tau_r'(q)\leq c_2.                              \tag{3.5}
\]

Moreover

\[
 R\log\tau_r'(q)=-{r^2q\over1+r^2q},                     \tag{3.6}
\]

and fixed iterates of `R,Q` of the right side are bounded.  Integration
of (3.6), followed by the product rule, controls all fixed derivatives of
`tau^(-2)` by `C tau^(-2)`.  Direct differentiation of the two rational
terms in (0.4) then yields, for `j+k<=2`,

\[
 |R^jQ^k\Psi_r(q)|
 \leq C_{jk}\left(q^{-2}+{r^2\over q}\right).            \tag{3.7}
\]

Hence

\[
 \int_1^{r^{-2}}|R^jQ^k\Psi_r|\,d\tau_r
 \leq C_{jk}\int_1^{r^{-2}}(q^{-2}+r^2q^{-1})\,dq
 \leq C_{jk}.                                             \tag{3.8}
\]

### 3.3 The far region `q>=r^(-2)`

Here (2.5) gives

\[
 c_1{\sqrt q\over r}\leq\tau_r(q)\leq
 c_2{\sqrt q\over r},\qquad
 \tau_r'(q)\leq {C\over r\sqrt q}.                      \tag{3.9}
\]

The same logarithmic differentiation and the rational formula give

\[
 |R^jQ^k\Psi_r(q)|
 \leq C_{jk}\left({r^2\over q}+q^{-2}\right),
 \qquad j+k\leq2.                                       \tag{3.10}
\]

Consequently

\[
 \int_{r^{-2}}^\infty|R^jQ^k\Psi_r|\,d\tau_r
 \leq {C_{jk}\over r}\int_{r^{-2}}^\infty
       (r^2q^{-3/2}+q^{-5/2})\,dq
 \leq C_{jk}r^2.                                         \tag{3.11}
\]

Equations (3.4), (3.8), and (3.11) prove (0.5).  The proof actually works
for every fixed derivative order: for each fixed `N`, the left side of
(0.5), summed over `j+k<=N`, is bounded by a constant `C_N`.  No uniformity
as `N` tends to infinity is asserted or used.

## 4. Exact action derivative and elliptic variation

Define the complete elliptic integrals

\[
 J(r)=K(\kappa),\qquad C(r)=E(\kappa)-r^2K(\kappa),
 \qquad \kappa=(1-r^2)^{1/2}.                             \tag{4.1}
\]

and the action

\[
 \sigma(r)=cC(r)-{\pi\over4}.                             \tag{4.2}
\]

The standard integral definitions, differentiated directly, give

\[
 C'(r)=-rJ(r),\qquad
 J'(r)=-{C(r)\over r(1-r^2)},\qquad
 {d\sigma\over dr}=-crJ(r).                              \tag{4.3}
\]

Also set

\[
 I_r(x)=\int_0^x{dt\over\sqrt{(1+t^2)(r^2+t^2)}},
 \qquad u_r(x)={I_r(x)\over J(r)}.                        \tag{4.4}
\]

Since `I_r(infinity)=J(r)` and `partial_r T_r=r I_r`, (4.3) implies the
two exact identities

\[
 \boxed{\partial_\sigma\{cT_r(x)\}=-u_r(x),\qquad
 \partial_\sigma\{c[T_r(x)+C(r)]\}=1-u_r(x).}            \tag{4.5}
\]

The second identity is the one needed after the exterior connection phase
is included.  Using only `cT_r` loses the `1` in (4.5) and does not have the
correct limiting action derivative at infinity.

There is a useful probability proof of uniform variation.  The density

\[
 p_r(t)={1\over J(r)\sqrt{(1+t^2)(r^2+t^2)}}              \tag{4.6}
\]

has total mass one on the positive half-line, and

\[
 R\log p_r(t)=-{r^2\over r^2+t^2}
 +{C(r)\over(1-r^2)J(r)}.                                 \tag{4.7}
\]

The second term is the `p_r` expectation of the first.  Since

\[
 {C(r)\over1-r^2}
 =\int_0^{\pi/2}{\cos^2\theta\,d\theta
       \over\sqrt{\cos^2\theta+r^2\sin^2\theta}}
 \leq {\pi\over2},                                       \tag{4.8}
\]

the `L^1(p_r)` norm of (4.7) is at most `pi/J(r)`.  Thus

\[
 |Ru_r(x)|\leq {\pi\over J(r)}.                           \tag{4.9}
\]

The elementary comparison

\[
 c_1\{1+\log(1/r)\}\leq J(r)
 \leq c_2\{1+\log(1/r)\}                                \tag{4.10}
\]

follows by splitting (4.4) at `t=r,1`.  Therefore, if
`r_min^2=alpha_0/c`,

\[
 \operatorname {Var}_{[r_{\min},1]}u_r(x)
 \leq C\int_{r_{\min}}^1{dr\over rJ(r)}
 \leq C\{1+\log L\},                                    \tag{4.11}
\]

uniformly in `x`.  Equivalently, the action weight `1-u_r(x)` has the same
bound.

The leakage factor itself is harmless.  Since `J` is decreasing,

\[
 \operatorname {Var}_{[r_{\min},1]}J(r)^{-1/2}\leq C.    \tag{4.12}
\]

For the geometric Bessel amplitude

\[
 G_r(x)=T_r(x)^{1/2}(x^2+r^2)^{-1/4},                     \tag{4.13}
\]

direct differentiation gives the cancellation identity

\[
 \boxed{
 \partial_\sigma\log G_r(x)
 ={1\over2cJ(r)}\left\{{1\over x^2+r^2}
                    -{I_r(x)\over T_r(x)}\right}.}      \tag{4.14}
\]

As `x` decreases to zero, the difference of the two apparently singular
terms tends to zero; we define the limiting endpoint value of
`partial_sigma log G_r` to be zero.  For `x>0`, `I_r/T_r` is the weighted
average of `(r^2+t^2)^(-1)` on `[0,x]`.
Multiplying (4.14) by R sigma=-cr^2J gives the positive identity

\[
 R\log G_r(x)={r^2\over2}
 \left\{{I_r(x)\over T_r(x)}-{1\over r^2+x^2}\right\}\geq0. \tag{4.14a}
\]

The inequality follows because I_r/T_r is an average of the decreasing
function (r^2+t^2)^(-1).  The three required integrals can now be written
without a hidden endpoint constant.

If r>=x, the same average lies between (r^2+x^2)^(-1) and r^(-2), so

\[
 0\leq R\log G_r(x)\leq {x^2\over2(r^2+x^2)}
 \leq {x^2\over2r^2}.                                    \tag{4.14b}
\]

Its integral against dr/r over r>=x is at most 1/4.  If r<=x<=1, then

\[
 T_r(x)\geq\int_{x/2}^x{t\,dt\over\sqrt{1+t^2}}\geq c_0x^2,
 \qquad
 I_r(x)\leq\operatorname {arsinh}(x/r),
\]

and hence

\[
 0\leq R\log G_r(x)
 \leq C{r^2\over x^2}\log(1+x/r).                         \tag{4.14c}
\]

After r=xv, its dr/r integral is bounded by
C times the integral of v log(1+1/v) over [0,1].  Finally, if x>=1, then
T_r(x)>=c_0x and I_r(x)<=J(r)<=C(1+log(1/r)), so

\[
 0\leq R\log G_r(x)
 \leq C{r^2\{1+\log(1/r)\}\over x}.                       \tag{4.14d}
\]

This too is integrable against dr/r, uniformly in x>=1.  Therefore

\[
 \sup_{x>0}\operatorname {Var}_{[r_{\min},1]}
       \log G_r(x)\leq C.                                \tag{4.15}
\]

This is the cancellation of the apparent small-`r` amplitude loss.

## 5. Fixed-carrier parameter bounds

The remaining point is to differentiate the **complete** Volterra error
without differentiating away its oscillatory carrier.  First observe that

\[
 b(r,q):=R\log\tau_r(q)\in[-1,0],\qquad
 h(r,q):=Q\log\tau_r(q)\in[1/2,1].                        \tag{5.1}
\]

Indeed, (3.6) says that `b` is minus a `d tau` average of
`r^2q/(1+r^2q)`.  For `h`, write

\[
 \tau_r(q)=\int_0^u F_r(v)\,dv,\qquad
 u=\sqrt q,\qquad F_r(v)=\sqrt{{1+v^2\over1+r^2v^2}}.     \tag{5.2}
\]

The function `F_r` is increasing and its logarithmic slope is at most one.
Thus

\[
 {uF_r(u)\over2}\leq\int_0^uF_r(v)\,dv\leq uF_r(u),     \tag{5.3}
\]

which is exactly the bound for `h` in (5.1).

At fixed Bessel phase `s=alpha tau`, logarithmic `r` differentiation is

\[
 \mathcal R=R+\nu(r,q)Q,
 \qquad \nu=-{2+b\over h},\qquad |\nu|\leq4.              \tag{5.4}
\]

Differentiating the averages in (5.1), using (3.6), shows that the first
two `R,Q` derivatives of `b,h,nu` are uniformly bounded.  Combining (0.5)
with (5.4), and using `ds=alpha d tau`, proves

\[
 \boxed{
 \|\mathcal R^j(s\partial_s)^kP_r\|_{L^1(ds)}
 +\sup_{s>0}s|\mathcal R^j(s\partial_s)^kP_r(s)|
 \leq {C_{jk}\over\alpha},\qquad j+k\leq2.}             \tag{5.5}
\]

The supremum follows directly from the same three regions: `s Psi` is
`O(alpha)` at worst near `q=1` and is smaller on both sides.

Use the fixed carrier matrix made from `J_0,Y_0`.  Variation of constants
for (2.9) has coefficient matrix `mathcal C_r(0)=I` and

\[
 {d\mathcal C_r\over ds}=\mathcal M_r(s)\mathcal C_r(s),
\]

\[
 \mathcal M_r(s)={\pi s\over2}P_r(s)
 \begin{pmatrix}
  -J_0(s)Y_0(s)&-Y_0(s)^2\\
   J_0(s)^2&J_0(s)Y_0(s)
 \end{pmatrix}.                                           \tag{5.6}
\]

The Wronskian is `2/(pi s)`.  The elementary origin and infinity bounds
give

\[
 \sup_{s>0}s\{J_0(s)^2+Y_0(s)^2\}<\infty,                \tag{5.7}
\]

so `||M_r(s)||<=C|P_r(s)|`.  Gronwall, (5.5), and
differentiation of (5.6) give, for `j=0,1,2`,

\[
 \sup_{s\geq0}
 \|\mathcal R^j\{\mathcal C_r(s)-I\}\|
 \leq {C_j\over\alpha}.                                 \tag{5.8}
\]

For a fixed `q`, compose with `s(r,q)=alpha tau_r(q)`.  Since

\[
 R\log s=2+b\in[1,2],                                    \tag{5.9}
\]

the extra chain-rule term is controlled by the supremum in (5.5).  Hence

\[
 \sup_{q\geq0}\|R^j\{\mathcal C_r(s(r,q))-I\}\|
 \leq {C_j\over\alpha},\qquad j=0,1.                    \tag{5.10}
\]

A second fixed-`q` differentiation also differentiates the Bessel carrier.
The weighted carrier bounds used in (5.7) give the uniform, weaker estimate

\[
 \sup_{q\geq0}\|R^2\{\mathcal C_r(s(r,q))-I\}\|\leq C, \tag{5.10a}
\]

but do not give `O(alpha^(-1))`.  This distinction does not affect total
variation, which uses only the first derivative.  For completeness, if
`R_x=(r\partial_r)|_x`, then at fixed `x>0`

\[
 R_x\log\{cT_r(x)\}={r^2I_r(x)\over T_r(x)}\in[0,1].
\]

The same first-derivative chain rule therefore gives

\[
 \sup_{x>0}\|R_x\{\mathcal C_r(cT_r(x))-I\}\|
 \leq {C\over\alpha};                                  \tag{5.10b}
\]

the left side extends by zero at `x=0` because `mathcal C_r(0)=I`.

In particular, over `alpha>=alpha_0`,

\[
 \operatorname {Var}_r\mathcal C_r(s(r,q))
 \leq C\int_{r_{\min}}^1{dr\over cr^3}
 \leq {C\over\alpha_0}.                                 \tag{5.11}
\]

This is the complete parameter-differentiated Volterra estimate.  It is
uniform at the separatrix because the small parameter is `alpha^(-1)`,
not a fixed positive lower bound for `r`.

## 6. Defect whitening and the elliptic normalization

Let `Y_r` be the exact solution of (2.1) normalized by `Y_r(1)=1`.  From
(2.3), (2.8), and (2.9),

\[
 Y_r(z)=\left\{{T_r(x)^2\over x^2(x^2+r^2)}\right\}^{1/4}
 W_r(cT_r(x)).                                            \tag{6.1}
\]

Its dimensionless one-tail mass is

\[
 \begin{aligned}
 \mathcal N_r
 &=\int_1^\infty |Y_r(z)|^2\,dz\\
 &={1\over c\alpha}\int_0^\infty
   {s\over1+q_r(s)}|W_r(s)|^2\,ds .                       \tag{6.2}
 \end{aligned}
\]

The comparison integral obtained by replacing J_0(s)^2 by its
nonoscillatory leading density 1/(pi s) is exactly

\[
 {1\over c\alpha}\int_0^\infty
 {s\over1+q_r(s)}{ds\over\pi s}
 ={J(r)\over\pi c}.                                      \tag{6.3}
\]

Indeed, `ds=c dT_r` and

\[
 \int_0^\infty{dT_r\over x^2+r^2}
 =\int_0^\infty{dx\over\sqrt{(1+x^2)(r^2+x^2)}}=J(r).    \tag{6.4}
\]

Equation (5.8) gives
`W_r=J_0+O(alpha^(-1))( |J_0|+|Y_0| )`, with the regular
cancellation at the origin.  For `s>=1`,

\[
 J_0(s)^2={1+\sin(2s)\over\pi s}+O(s^{-2}).               \tag{6.5}
\]

This does **not** say that the integral containing J_0(s)^2 is exactly
(6.3).  To control it and its parameter derivatives, put

\[
 g_r(s)={1\over1+q_r(s)}
\]

and let D_r denote logarithmic r differentiation at fixed s.  From (5.4),

\[
 D_rq_r=\nu q_r,\qquad |\nu|\leq4,\qquad
 D_rg_r=-\nu{q_r\over(1+q_r)^2}.                          \tag{6.5a}
\]

Differentiating the averages defining b,h,nu shows, for j=0,1,2,

\[
 |D_r^jg_r(s)|\leq C_jg_r(s),\qquad
 |Q D_r^jg_r(s)|\leq C_j{q_r(s)\over(1+q_r(s))^2},
\]

\[
 \int_0^\infty\left|\partial_sD_r^jg_r(s)\right|\,ds
 \leq C_j.                                                \tag{6.5b}
\]

For completeness, the last integral is uniform because q_r(s) is
increasing, the q partial_q derivatives of b,h,nu are bounded, and for
j>=1 every term contains the transition factor q/(1+q)^2.  The displayed
Q bound and the change of variables from s to q reduce its variation to
a constant multiple of the integral of (1+q)^(-2) over the positive
half-line.  For j=0, it is simply the total variation of the decreasing
function g_r.

Equations (6.5a)--(6.5b) and one integration by parts give

\[
 \left|\int_1^\infty D_r^jg_r(s)\sin(2s)\,ds\right|\leq C_j.
                                                                    \tag{6.5c}
\]

The Bessel remainder costs

\[
 \int_1^\infty {g_r(s)\over s}\,ds\leq C\log(2+\alpha).   \tag{6.5d}
\]

Indeed, the part q<=1 has s<=C alpha.  On q>=1, use
d log s=d log tau=h dq/q and h<=1 to obtain the convergent integral
of 1/[q(1+q)] over [1,infinity).  The same estimate holds after D_r^j,
j<=2, by (6.5b).  Finally, (5.8) makes the difference between W_r^2 and
J_0^2 at most C/alpha times the Bessel-envelope square; its weighted
integral and its first two fixed-s derivatives are at most C alpha J(r).
Dividing by the exact comparison mass alpha J(r)/pi, and noting that the
first two logarithmic derivatives of alpha J(r) are bounded, proves (0.6).

For a physical exterior tail `H(t)=A Y_r(t/lambda)`, evenness gives

\[
 d=2\int_\lambda^\infty|H(t)|^2\,dt
   =2\lambda |A|^2\mathcal N_r.                           \tag{6.6}
\]

Thus its exact defect-whitened positive tail is, up to the phase of `A`,

\[
 {H(t)\over\sqrt d}
 ={Y_r(t/\lambda)\over\sqrt{2\lambda\mathcal N_r}},      \tag{6.7}
\]

and (0.6) gives the leading scalar

\[
 {1\over\sqrt{2\lambda\mathcal N_r}}
 =\sqrt{{\pi c\over2\lambda J(r)}}
 \left\{1+O\left({\log(2+\alpha)\over\alpha}\right)\right\}. \tag{6.8}
\]

Its elliptic factor has bounded variation by (4.12), and its Volterra
correction has total variation `O(log(2+alpha_0)/alpha_0)`.  Together with
(4.11) and (4.15), this proves the radial action-BV assertion in Section 0.

## 7. Why the carrier must not be discarded

A scalar envelope statement such as

\[
 W_r(s)=J_0(s)+O(\alpha^{-1})\operatorname {env}J_0(s)   \tag{7.1}
\]

is insufficient for action differentiation.  At fixed `q`,

\[
 R J_0(s)=-J_1(s)(2+b)s.                                 \tag{7.2}
\]

The factor `s` is unbounded.  Differentiating the absolute envelope in
(7.1) therefore spends the full oscillatory budget; in the growing block
this can lose an `O(L)` term.  Equations (5.6)--(5.10) avoid the loss by
keeping `J_0,Y_0` as exact carriers and differentiating only their slow
coefficient matrix.

At the concrete cutoff (0.3),

\[
 {\log(2+\alpha_0)\over\alpha_0}
 =O\left({\log\log L\over(\log L)^4}\right),
 \qquad \log L=o(L).                                     \tag{7.3}
\]

Thus no coherent-packet obstruction occurs in the scalar radial amplitude.
What remains is an operator identity preserving this carrier decomposition
through the complete sample assembly.  The same-side problem must show
that its first `1/(sigma_j-sigma_k)` boundary contribution is a weighted
Hilbert commutator (or otherwise skew-cancels) and that the second remainder
has square action-gap decay.  The reflected reciprocal problem is a
different Fourier-integral operator and is not covered here.  Neither
operator conclusion is asserted by this note.
