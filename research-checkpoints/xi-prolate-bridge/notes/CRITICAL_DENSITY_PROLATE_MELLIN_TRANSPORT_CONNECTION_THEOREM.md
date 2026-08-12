# Critical-density prolate Mellin transport and connection theorem

## 0. Exact outcome and claim boundary

Put `c=2*pi*lambda^2` and retain the two fixed even labels `j=0,4`.
For

\[
 z={s\over c},\qquad q(z)=\sqrt{z^2+4},\qquad
 r(z)={q(z)-z\over2},                                      \tag{0.1}
\]

use the branches with `q(0)=2` and `r(0)=1`, and define

\[
 T_j(z)={2^{j+1}r(z)\over
 (1+r(z))^{j+1/2}\sqrt{1+r(z)^2}}.                       \tag{0.2}
\]

Let

\[
 \phi_j(s)=e^{D_c(s+j-1)}b_j(s),\qquad
 b_0=2^{-3/4},\qquad
 b_4(s)={4s(s-1)+3\over32\mathfrak a_4},                \tag{0.3}
\]

where `mathfrak a_4=sqrt(3)/2^(11/4)`.  The result proved here is the
correct fixed-density continuation of the frozen subturning theorem.
For every compact

\[
 K\Subset(1/(2\pi),1/2)                                  \tag{0.4}
\]

and bounded real `u`, uniformly for `D in K`,

\[
 \boxed{
 P_j(1/2-i(Dc+u))
 =e^{D_c(j-1/2-i(Dc+u))}H_j(1/2-i(Dc+u))
 T_j((1/2-i(Dc+u))/c)\{1+O_K(c^{-1/2})\}.}              \tag{0.5}
\]

The same estimate holds after one `t` derivative of the relative error.
The exact outer solution used to prove (0.5) has a forward-minimal
normalization, so no arbitrary nonconstant two-periodic multiplier is
inserted into the construction.

The factor `T_j` is essential.  At fixed `D>0`, `T_j(-iD)` is not one;
therefore the earlier factorization with `T_j=1` is false at constant
density.  The theorem is deliberately limited to (0.4).  It proves no
operator-relative endpoint or row transfer, no finite-gate
synchronization, no arithmetic sign, no decay of the actual quotient, no
Riemann-hypothesis implication, and no de Bruijn--Newman bound.  The
project state remains `P0_INVALIDATED`.

There is also a useful sharp stopping point.  A formal analytic correction
`exp(U_(j,1)(z)/c)` cancels the fixed-`z` coefficient of order `c^(-2)`,
but for label four it does **not** leave a uniform `O(c^(-3))` defect down
to `|z|=A/sqrt(c)`.  The first uncancelled transition term is
`3c^(-4)z^(-3)`.  The stronger refinement is false and is not used in
(0.5).

This is an unbound post-checkpoint-1.51 theorem pair.  It changes none of
the standard eight files and adds no numerical zero sample or serialized
artifact.

## 1. Frozen inputs

Exactly four note/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| notes/EXACT_PROLATE_MELLIN_RECURRENCE_BIRKHOFF_CONNECTION_BARRIER.md | d1191bdc6f0d2edd0ae900e1a7d73f61cea7f78693e2074b6850df7aec36a041 |
| tests/test_exact_prolate_mellin_recurrence_birkhoff_connection_barrier.py | 836949d060b03d697574731aad2ede90241b2f6ccb29e58d123908218ef7955f |
| notes/SUBTURNING_FINITE_ORDER_NEWTON_CLOSURE_THEOREM.md | b6597337ed033bf889eb31d06da669edb7a97ddc1e32a4c9c90fb5185dad7dc4 |
| tests/test_subturning_finite_order_newton_closure_theorem.py | 763d6a7b5d641d013d05ece675a3aaa7496bebbeb4e6111bb12878d33180f526 |
| notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md | aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6 |
| tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py | 6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6 |
| notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md | d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd |
| tests/test_first_prolate_correction.py | 9f424a931f3a9435ec0ce9883b07201afe9b85cf56fcdda81644050e876ef991 |

The first pair supplies the exact recurrence and Watson normalization.  The
second supplies the already-proved inner connection through height
`c^(3/4)/2`, including one derivative.  The third supplies the exact action,
Hermite label mixture, physical growth bound, and carrier/exterior scale
comparison.  The fourth supplies

\[
 a_j(c)=2j+1-{2j^2+2j+3\over4c}+O(c^{-2}).              \tag{1.1}
\]

No second eigenvalue correction is used in the proof of (0.5).

## 2. Branch domain

The estimates are first made on the slightly enlarged outer collar

\[
 {A\over\sqrt c}\leq-\operatorname {Im}z\leq1+\eta,
 \qquad \operatorname {Re}z\geq c^{-1},                 \tag{2.1}
\]

where `A>0` is fixed and `0<eta<1` is fixed.  This enlargement permits
Cauchy estimates at the two horizontal boundaries.  It stays a fixed
distance from the turning point `z=-2i`.

The identity

\[
 z=r^{-1}-r                                             \tag{2.2}
\]

shows that on the closure with `eta=0`,

\[
 0<|r|\leq1,\qquad 0\leq\arg r\leq\pi/6.               \tag{2.3}
\]

The same conclusions, with a slightly larger sector strictly below
`pi/2`, hold on (2.1).  Thus `1+r` and `1+r^2` stay away from zero.  Their
principal logarithms define both fractional powers in (0.2).  The label
four zeros `(1+/-i*sqrt(2))/2` are also outside the outer collar.  Hence
`T_j`, `phi_j`, and all ratios used below are analytic and nonzero.  There
is no hidden branch or zero-domain issue.

## 3. Exact normalized defect and the missing transport

Write `h=1/c`, set

\[
 \psi_j(s)=\phi_j(s)T_j(s/c),\qquad
 p_j(s)={\psi_j(s+2)\over\psi_j(s)},                    \tag{3.1}
\]

and normalize the exact forward recurrence by

\[
\begin{aligned}
 F_j(s)={}&(s+2)p_j(s+2)+{(s+2)(s+1)\over c}
             -a_j(c)-{s+1\over p_j(s)},\\
 A_j(s)={}&{s+1\over p_j(s)},\qquad f_j(s)={F_j(s)\over A_j(s)}.
\end{aligned}                                                   \tag{3.2}
\]

Put `d(z)=D_c(cz)/c` and `L_j=log T_j`.  Since

\[
 2d'(z)=\log r,\quad
 d''(z)=-{r\over2(1+r^2)},\quad
 d'''(z)={r^2(1-r^2)\over2(1+r^2)^3},                  \tag{3.3}
\]

the logarithm of `p_j` has, for `j=0,4`,

\[
 \log p_j=\log r+h\ell_{j,1}+h^2\ell_{j,2}+\cdots,     \tag{3.4}
\]

where

\[
\begin{aligned}
 \ell_{j,1}&=2j d''+{j\over z}+2L_j',\\
 \ell_{j,2}&=(j^2+1/3)d'''-{j\over2z^2}+2L_j''.
\end{aligned}                                                   \tag{3.5}
\]

The terms containing `1/z` and `1/z^2` are absent when `j=0`; for `j=4`
they are the expansion of the exact rational quotient

\[
 {b_4(s+2)\over b_4(s)}
 ={4z^2+12hz+11h^2\over4z^2-4hz+3h^2}.                \tag{3.6}
\]

Substitution in (3.2) cancels the eikonal coefficient `h^(-1)` and the
transport coefficient `h^0`.  The choice (0.2) is exactly what cancels
the latter.  If the coefficient of `h` in `a_j` is temporarily denoted by
`mu`, the apparent next pole is

\[
 f_{j,2}^{(\mu)}(z)
 =-{4\mu+2j^2+2j+3\over4z}+O(1).                      \tag{3.7}
\]

Equation (1.1) cancels this pole.  The resulting analytic coefficients are

\[
 f_{0,2}(z)={r^2P_0(r)\over
 12(1+r)^2(1+r^2)^4},                                  \tag{3.8}
\]

\[
\begin{split}
 P_0(r)={}&7r^8-22r^7-196r^6-346r^5-66r^4\\
          &+190r^3+148r^2+34r+11,
\end{split}                                                     \tag{3.9}
\]

and

\[
 f_{4,2}(z)=-{r^2P_4(r)\over
 12(1+r)^2(1+r^2)^4},                                  \tag{3.10}
\]

\[
\begin{split}
 P_4(r)={}&137r^8+598r^7+916r^6+1018r^5+114r^4\\
          &-574r^3-868r^2-514r-203.
\end{split}                                                     \tag{3.11}
\]

In particular

\[
 f_{0,2}(0)=-5/16,\qquad f_{4,2}(0)=-13/16.            \tag{3.12}
\]

The explicit cancellation at `r=1` proves analyticity; it is not an
appeal to a removable singularity without its compatibility condition.

## 4. Uniform collar defect

Equations (3.3)--(3.6), Taylor's formula, and the large-`z` chart
`r=z^(-1)+O(z^(-3))` give

\[
 \boxed{
 |f_j(s)|+|\partial_sf_j(s)|\leq C_{A,j}c^{-2}}
                                                               \tag{4.1}
\]

on (2.1).  Here is the uniformity point near the overlap.  If
`|z|>=A*sqrt(h)`, then `|h/z|<=sqrt(h)/A`; expanding the exact quotient
(3.6), rather than its separate numerator and denominator, gives

\[
 f_j(s)=h^2f_{j,2}(z)+O_{A,j}(h^{5/2})                 \tag{4.2}
\]

for bounded `z`.  For `|z|` bounded away from zero the remainder improves
to `O(h^3)`, and for large real part the `r` chart supplies an additional
`(1+|z|)^(-2)` factor.  A fixed enlargement of (2.1) and Cauchy's estimate
gives the derivative in (4.1).  The unspecified `O(h^2)` term in (1.1)
enters (3.2) as `O(h^3/z)` and is only `O_A(h^(5/2))` at the inner edge.
Thus no unknown second eigenvalue coefficient is needed for (4.1).

## 5. The absolute forward Green bound

For the Riccati equation define

\[
 \alpha_j(s)={s+2\over s+1}p_j(s)p_j(s+2),             \tag{5.1}
\]

and

\[
 w_j(s)={\Gamma((s+2)/2)\over\Gamma((s+1)/2)}
          \psi_j(s)\psi_j(s+2).                       \tag{5.2}
\]

Then exactly

\[
 \alpha_j(s)={w_j(s+2)\over w_j(s)},\qquad
 \prod_{k=0}^{n-1}\alpha_j(s+2k)={w_j(s+2n)\over w_j(s)}.
                                                               \tag{5.3}
\]

Let `s=x-it`, `A*sqrt(c)<=t<=(1+eta)c`.  The action part
`mathcal A_j=D_c(s+j-1)+D_c(s+j+1)` satisfies

\[
 -\operatorname {Re}\mathcal A_j'(s)\geq\kappa m(x/c),
 \quad
 m(u)=\begin{cases}u,&0\leq u\leq1,\\1+\log u,&u\geq1,
 \end{cases}                                                   \tag{5.4}
\]

with constants uniform on (2.1).  The gamma quotient and the label-four
polynomials contribute only a fixed power of
`(1+x+t+2n)/(1+x+t)`.  The `T_j` quotient is bounded by the same fixed
power and in the large-real-part chart supplies extra decay.  Consequently

\[
 \left|{w_j(s+2n)\over w_j(s)}\right|
 \leq C_{A,j}\left(1+{n\over x+t+1}\right)^6
 \exp\left\{-\kappa c\int_{x/c}^{(x+2n)/c}m(u)\,du\right\}.
                                                               \tag{5.5}
\]

Before `x+2n=c`, the exponent is at most
`-kappa((x+2n)^2-x^2)/(2c)`; after that point it absorbs every fixed
power.  Since `t>=A*sqrt(c)`, comparison with a Gaussian gives the sharp
absolute scale

\[
 \boxed{
 \sup_s\sum_{n\geq0}
 \left|\prod_{k=0}^{n-1}\alpha_j(s+2k)\right|
 \leq C_{A,j}\sqrt c.}                                \tag{5.6}
\]

There is no cancellation in (5.6).  Differentiating the telescoped ratio,

\[
 {\partial_sP_n\over P_n}
 =\partial_s\log w_j(s+2n)-\partial_s\log w_j(s),      \tag{5.7}
\]

costs `O(n/c)+O((x+t+1)^(-1))` on the Gaussian range.  Outside that
range the action tail absorbs the logarithmic factor.  Thus (5.6) holds
also for one derivative.  The forward-minimal Green operator

\[
 ({\cal G}_jg)(s)=\sum_{n\geq0}(-1)^n
 \left\{\prod_{k=0}^{n-1}\alpha_j(s+2k)\right\}g(s+2n)
                                                               \tag{5.8}
\]

is an exact inverse of `I+alpha_j S` and has weighted analytic `C^1` norm
`O_A(sqrt(c))`.  The weight `(1+x/c)^(-2)` may be inserted on both sides;
it is decreasing under the forward shift.

## 6. One Newton solve and the exact outer solution

Writing the exact ratio as `p_j(1+x_j)` gives

\[
 x_j+\alpha_jSx_j=-f_j-f_jx_j-\alpha_jx_jSx_j.          \tag{6.1}
\]

In the weighted analytic `C^1` space, (4.1), (5.6), and the product
estimate give a self-map on a ball of radius

\[
 R_c=C_{A,j}c^{-3/2}.                                   \tag{6.2}
\]

Its Lipschitz constant is

\[
 O(\sqrt c)\{O(c^{-2})+O(c^{-3/2})\}=O(c^{-1}),         \tag{6.3}
\]

so it is a contraction for large `c`.  This constructs the unique
forward-minimal `x_j` with its first derivative satisfying (6.2).

The normally convergent sum

\[
 Q_j(s)=-\sum_{n\geq0}\log(1+x_j(s+2n))                \tag{6.4}
\]

uses the branch near zero and obeys

\[
 Q_j(s+2)-Q_j(s)=\log(1+x_j(s)),\qquad
 |Q_j|+|Q_j'|=O_A(c^{-1/2}).                            \tag{6.5}
\]

Therefore

\[
 W_j(s)=\psi_j(s)e^{Q_j(s)}                            \tag{6.6}
\]

is analytic, nonzero, and solves the exact recurrence.  The condition
`Q_j(s)->0` on every forward real lattice is the promised nonperiodic,
forward-minimal normalization.  It prevents an arbitrary two-periodic
factor from entering the definition of `W_j`.

### 6a. Exact one-step extension to the critical line

The construction above lives on `Re(s)>=1`; the target in (0.5) has real
part `1/2`.  This is repaired by the recurrence itself, not by evaluating
the Newton solution outside its domain.  Let

\[
 \sigma={1\over2}-it,\qquad
 A\sqrt c\leq t\leq(1+\eta)c,
 \qquad d_j(\sigma)={(\sigma+2)(\sigma+1)\over c}-a_j(c).  \tag{6.7}
\]

The points `sigma+2` and `sigma+4` are in the constructed domain.  The
coefficient estimates of Sections 2--4 extend to this one-step strip: the
large ordinate keeps the label-four zeros separated, and the action branch
is unchanged.  Define

\[
 g_{j,-}(\sigma)=f_j(\sigma)+\alpha_j(\sigma)x_j(\sigma+2),
 \qquad
 x_{j,-}(\sigma)=-{g_{j,-}(\sigma)\over1+g_{j,-}(\sigma)}.
                                                               \tag{6.8}
\]

Equations (4.1), (5.1), and (6.2), including one derivative, give

\[
 |g_{j,-}(\sigma)|+|\partial_tg_{j,-}(\sigma)|
 \leq C_{A,j}c^{-3/2}.                                 \tag{6.9}
\]

Thus `1+g_(j,-)` is nonzero for large `c`, and
`1+x_(j,-)=1/(1+g_(j,-))` is also nonzero.  Set

\[
\begin{aligned}
 W_{j,-}(\sigma)
 &={(\sigma+2)W_j(\sigma+4)+d_j(\sigma)W_j(\sigma+2)\over\sigma+1}\\
 &={W_j(\sigma+2)\over
 p_j(\sigma)(1+x_{j,-}(\sigma))}.
\end{aligned}                                                   \tag{6.10}
\]

The equality follows by substituting (3.2), (5.1), and (6.8); the first
line proves the exact physical recurrence at `sigma`.  In particular it
uses only values at `sigma+2` and `sigma+4` from the constructed domain.
Moreover, cancellation of the base ratio gives the exact comparison

\[
 {W_{j,-}(\sigma)\over\psi_j(\sigma)}
 =e^{Q_j(\sigma+2)}
 \{1+f_j(\sigma)+\alpha_j(\sigma)x_j(\sigma+2)\}
 =1+O_A(c^{-1/2}),                                      \tag{6.11}
\]

with the same bound after one `t` derivative.  From now on `W_j(s)` on
the one-step lower strip means this exact `W_(j,-)(s)`.

## 7. Watson minimality and the periodic quotient

Let `B_j=P_j/G` be the physical Watson solution.  Its Casoratian with
`W_j`,

\[
 \Omega_j(s)=B_j(s+2)W_j(s)-B_j(s)W_j(s+2),             \tag{7.1}
\]

satisfies

\[
 \Omega_j(s+2)=-{s+1\over s+2}\Omega_j(s).             \tag{7.2}
\]

Both solutions are forward recessive.  A nonzero right side of (7.2)
would have only `(-1)^n n^(-1/2)` decay, contradicting the Watson and
action decay.  Hence

\[
 B_j(s)=C_j(s;c)W_j(s),\qquad C_j(s+2;c)=C_j(s;c).      \tag{7.3}
\]

On the one-step lower strip define

\[
 C_j(\sigma;c)=C_j(\sigma+2;c).                        \tag{7.4}
\]

This is not a formal periodic declaration.  Proportionality at
`sigma+2,sigma+4` and the exact first line of (6.10), applied to both
`B_j` and `W_j`, give
`B_j(sigma)=C_j(sigma+2;c)W_j(sigma)`.  Thus (7.4) is the actual physical
quotient and extends (7.3) to the critical line.

This is where the physical solution may carry a two-periodic connection
factor.  It was not built into `W_j`, and the next section controls it by
an annulus argument.

## 8. Inner overlap and Laurent propagation

Choose `t_0=A*sqrt(c)` with fixed sufficiently large `A`.  The frozen
subturning theorem, uniformly on one bounded real period, gives

\[
 {B_j(s)\over\phi_j(s)}=1+O_A(c^{-1/2}),\qquad
 s=b-it_0,\quad1\leq b\leq3.                          \tag{8.1}
\]

Since `T_j(s/c)=1+O_A(c^(-1/2))`, equations (6.5)--(6.6) imply

\[
 C_j(b-it_0;c)=1+O_A(c^{-1/2})                         \tag{8.2}
\]

on the full period, not merely at one point.

Put `zeta=e^(i*pi*s)`.  The quotient is analytic on the annulus

\[
 e^{\pi t_0}<|\zeta|<e^{\pi c}.                        \tag{8.3}
\]

At the outer circle, the physical Mellin bound and Stirling give
`|B_j|<=poly(c)e^(pi*c/4)`.  On the other hand, (0.2), (2.3), and (6.5)
give

\[
 |W_j(b-ic)|\geq c^{-M_j}e^{c\Phi(1)},\qquad
 \Phi(1)={\sqrt3\over2}-1+{\pi\over12}.               \tag{8.4}
\]

Thus

\[
 |C_j(b-ic;c)|\leq c^{M_j}e^{\kappa_1c},\qquad
 \kappa_1={\pi\over4}-\Phi(1)
 =1-{\sqrt3\over2}+{\pi\over6}.                      \tag{8.5}
\]

Expand `C_j=sum_(n in Z)c_n*zeta^n`.  The inner circle controls the
constant and negative Laurent modes.  The outer circle controls the
positive modes.  At `t=Dc+O(1)`, `D in K`,

\[
\begin{aligned}
 C_j(s;c)&=1+O_K(c^{-1/2})
 +O_K\left(c^{M_j}e^{-\delta_Kc}\right),\\
 \partial_tC_j(s;c)&=
 O_K\left(c^{M_j}e^{-\delta_Kc}\right),
\end{aligned}                                                   \tag{8.6}
\]

where

\[
 \delta_K=\min_{D\in K}\{\pi(1-D)-\kappa_1\}>0.       \tag{8.7}
\]

The derivative follows by summing `|n|` times the same two geometric
series.  Combining (6.5), (7.3), and (8.6) proves (0.5), including the
relative derivative.

## 9. Positive source multiplier

Let `theta=arcsin(D/2)`.  At the imaginary-axis limit,

\[
 r(-iD)=e^{i\theta},                                   \tag{9.1}
\]

and direct substitution in (0.2) gives

\[
 T_j(-iD)=
 \cos(\theta/2)^{-(j+1/2)}\cos(\theta)^{-1/2}
 e^{i(1/4-j/2)\theta}.                                 \tag{9.2}
\]

Also

\[
 D_c(j-1/2-iDc)
 =c\Phi(D)+i(j/2-1/4)\theta+O(c^{-1}),                 \tag{9.3}
\]

where

\[
 \Phi(D)=\sqrt{1-D^2/4}-1+{D\over2}\arcsin(D/2).      \tag{9.4}
\]

The phases in (9.2)--(9.3) cancel.  The exact Hermite label algebra says
that the label-zero contribution to the source divided by `H` is
`O(c^(-2))`.  Hence the physical label-0/4 source has the positive leading
multiplier

\[
 {\mathcal M_{\rm src}(1/2-iDc)\over H(1/2-iDc)}
 =e^{c\Phi(D)}A_4(D)\{1+O_K(c^{-1/2})\},               \tag{9.5}
\]

\[
 A_4(D)=\cos(\theta/2)^{-9/2}\cos(\theta)^{-1/2}>0.    \tag{9.6}
\]

In particular there is no leading label cancellation.

## 10. Carrier and exterior exponential scales

After restoring the gamma factor, the carrier exponential is

\[
 \operatorname {poly}(c)e^{-\kappa_{\rm car}(D)c},
 \qquad
 \kappa_{\rm car}(D)={\pi D\over4}-\Phi(D).            \tag{10.1}
\]

It is positive on (0,1/2] and

\[
 \kappa_{\rm car}(D)\leq\kappa_{\rm car}(1/2)
 =0.361283181361350\ldots<1.                           \tag{10.2}
\]

Therefore an independently available fixed-label concentration defect of
size `poly(c)e^(-2c)` has square-root amplitude scale `poly(c)e^(-c)`,
which is exponentially below one carrier throughout (0.4).  This is only
an absolute scale comparison.  It is not an operator-relative exterior or
endpoint theorem and cannot be divided by a possibly cancelling source
sum without the separate hypotheses stated in the frozen interface note.

## 11. The false `O(c^(-3))` refinement

For completeness, the analytic solution of

\[
 U_{j,1}'(z)=-{f_{j,2}(z)\over2(1+r(z)^2)},\qquad
 U_{j,1}(0)=0,                                           \tag{11.1}
\]

is

\[
 U_{0,1}={-7r^6+11r^5+50r^4+62r^3+17r^2+11r
 \over24(1+r)(1+r^2)^3}-{3\over8},                     \tag{11.2}
\]

\[
 U_{4,1}={137r^6+299r^5+434r^4+542r^3+257r^2+203r
 \over24(1+r)(1+r^2)^3}-{39\over8}.                    \tag{11.3}
\]

At fixed nonzero `z`, multiplication by `exp(U_(j,1)/c)` removes the
coefficient (3.8) or (3.10).  Uniformity at the overlap is different.
Even cancellation of the next `h^3/z` pole would require

\[
 a_{0,2}=-3/16,\qquad a_{4,2}=-207/16.                 \tag{11.4}
\]

For clarity, those values are not a numerical fit.  In the scaled
oscillator notation of the frozen first-correction note, solvability at
second order gives `nu_(j,2)=<h_j,V u_j>`.  Its displayed couplings yield

\[
 \nu_{0,2}=-{3\over32\pi},\qquad
 \nu_{4,2}=-{207\over32\pi},\qquad a_{j,2}=2\pi\nu_{j,2},
                                                               \tag{11.5}
\]

which is (11.4).  A second finite Hermite correction leaves an
`O(lambda^(-6))` Gaussian quasimode residual, and the same fixed spectral
gap argument used in the frozen note makes this an eigenvalue expansion.
Nevertheless these coefficients do not repair the requested label-four
estimate.  With (11.4), direct expansion of the exact rational quotient
(3.6) gives

\[
 f_{4,\rm corrected}(z,h)={3h^4\over z^3}
 +O(h^3)+O(h^5/z^4).                                   \tag{11.6}
\]

Consequently, at `z=-iA*sqrt(h)`,

\[
 f_{4,\rm corrected}
 =-{3i\over A^3}h^{5/2}+O_A(h^3),                      \tag{11.7}
\]

which is not `O(h^3)` for fixed `A`.  An analytic `U_(4,1)` cannot cancel
the singular transition term in (11.6).  This refutes the proposed
stronger outer-collar lemma while leaving the simpler and sufficient
`O(c^(-2))` theorem intact.

## 12. Stopping point

The exact transport is `T_j`, not one.  Its normalized recurrence defect
is uniformly `O(c^(-2))`; the absolute minimal Green cost is only
`O(sqrt(c))`; one contraction gives an exact nonzero forward-minimal outer
solution; and inner overlap plus Laurent propagation controls the physical
two-periodic quotient at every fixed density in (0.4).  These facts prove
the corrected Mellin factorization and its positive source multiplier.

The optional analytic `U_(j,1)` is recorded only to expose why the proposed
`O(c^(-3))` refinement fails for label four at the overlap scale.  No
claim downstream of the explicit boundary in Section 0 is silently added.
