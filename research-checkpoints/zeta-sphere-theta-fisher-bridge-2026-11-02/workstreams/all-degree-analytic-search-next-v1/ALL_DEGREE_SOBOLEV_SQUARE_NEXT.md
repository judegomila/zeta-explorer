# All-degree Sobolev squares and the unavoidable Hardy deficit

## Scope and outcome

This note generalizes `H5_ASSEMBLED_SCHUR_NEXT.md` to every residual degree
and both parity ladders.  It keeps the newest pivot assembled and never
estimates its channels by separate Cauchy inequalities.

For parity `epsilon in {0,1}` and a monic residual polynomial `P_N(t^2)`, the
exact pivot is a positive square plus one scalar integral against `W^2dt`,
where `W=2Xi`.  The auxiliary function has the forced parity

\[
 g_\epsilon(t)=t^{1-\epsilon}G(t^2).
\]

The construction has two sharp limitations.

1. If `kappa=2N+epsilon>=1`, the best possible polynomial square misses the
   leading weighted Hardy coefficient by

   \[
    {2\kappa-1\over4}.
   \]

   No polynomial auxiliary can make the remainder pointwise nonnegative.
2. A Gaussian model has a positive spectral density and hence positive pivots
   at every degree, but every auxiliary space of fixed degree eventually gives
   a negative scalar criterion.  Thus uniformly bounded auxiliary complexity
   is not a generic all-degree proof mechanism.  Linear growth with the
   residual degree is the natural scale.

The integrated theta-specific criterion remains legitimate.  However, as the
auxiliary degree tends to infinity it converges to the original pivot, so an
all-degree proof must supply a uniform finite-complexity theorem and margin
from complete-theta arithmetic.  Merely enlarging the auxiliary space is an
algebraic restatement of the target.

No finite degree sweep, first Xi--Laguerre sign, or RH claim is made.

## 1. The two parity ladders

Use

\[
 W(t)=\widehat\psi(t)=2\Xi(t),
\]

and the full-line Bell moments

\[
 M_k=2\int_0^\infty h^2c_k(h)\,dh.
\]

The exact all-`k` identity from the fixed-H5 calculation is

\[
 \boxed{
 M_k={1\over2\pi}\int_{\mathbb R}
 \left\{t^{2k}W'(t)^2
 -{k(2k-1)\over2}t^{2k-2}W(t)^2\right\}dt,}       \tag{1}
\]

with the second term absent when `k=0`.  Equivalently,

\[
 M_k=\int h^2(\psi^{(k)})^2dh
 -{k\over2}\int(\psi^{(k-1)})^2dh               \tag{2}
\]

for `k>=1`.  Complete-theta Schwartz decay justifies all operations.

Fix `epsilon in {0,1}`.  The value `epsilon=0` is the even ladder and
`epsilon=1` is the odd ladder.  Let

\[
 P_N(z)=\sum_{j=0}^Np_jz^j,
 \qquad p_N=1,                                    \tag{3}
\]

be the monic signed residual after projection onto the old same-parity
prefix.  Thus

\[
 \sum_{j=0}^Np_jM_{\epsilon+j+\ell}=0
 \quad(0\leq\ell<N).                              \tag{4}
\]

The exact new Schur pivot is

\[
 \boxed{
 \mathcal S_{N,\epsilon}
 =\sum_{i,j=0}^Np_ip_jM_{\epsilon+i+j}.}          \tag{5}
\]

No sign is assumed in (3)--(5); only invertibility of the stipulated old
target block is needed to define its residual.

Put

\[
 q_{N,\epsilon}(t)=t^\epsilon P_N(t^2),
 \qquad
 w_{N,\epsilon}(t)=q_{N,\epsilon}(t)^2.           \tag{6}
\]

Summing (1) gives the undivided all-degree identity

\[
 \boxed{
 \mathcal S_{N,\epsilon}
 ={1\over2\pi}\int_{\mathbb R}
 \left\{w_{N,\epsilon}W'^2
       -{w_{N,\epsilon}''\over4}W^2\right\}dt.}  \tag{7}
\]

The exceptional base `N=epsilon=0` is already positive:

\[
 \mathcal S_{0,0}=M_0={1\over2\pi}\int W'^2dt.
 \tag{8}
\]

## 2. Exact parity-compatible square

Write `z=t^2` and define

\[
 \boxed{
 B_{P,\epsilon}(z)
 ={1\over2}(z^\epsilon P(z)^2)'
 +z(z^\epsilon P(z)^2)''.}                       \tag{9}
\]

This is exactly `w''/4` in (7).  Let `G` be any real polynomial and choose
the auxiliary with the parity forced by the first term in the square:

\[
 g_\epsilon(t)=t^{1-\epsilon}G(t^2).              \tag{10}
\]

The product `q_(N,epsilon)g_epsilon=tP_N(t^2)G(t^2)` is odd in both ladders.
Consequently the same cross-term calculation works for both parities.  Put

\[
 \boxed{
 \mathcal R_{P,G}^{(\epsilon)}(z)
 =P(z)G(z)+2z(PG)'(z)
  -z^{1-\epsilon}G(z)^2-B_{P,\epsilon}(z).}       \tag{11}
\]

Then

\[
 \boxed{
 \begin{aligned}
 2\pi\mathcal S_{N,\epsilon}
 &=\int_{\mathbb R}
 \{t^\epsilon P(t^2)W'
   +t^{1-\epsilon}G(t^2)W\}^2dt\\
 &\quad+
 \int_{\mathbb R}\mathcal R_{P,G}^{(\epsilon)}(t^2)W^2dt.
 \end{aligned}}                                   \tag{12}
\]

This is an equality.  Therefore the single correlated inequality

\[
 \boxed{
 \int_{\mathbb R}\mathcal R_{P,G}^{(\epsilon)}(t^2)W(t)^2dt
 \geq0}                                           \tag{13}
\]

is sufficient for the actual new pivot.  It retains the residual, regression,
and signed compensation as one object.

## 3. Finite moment criterion and saturation

Define the positive `W^2` moments

\[
 J_m=\int_{\mathbb R}t^{2m}W(t)^2dt.              \tag{14}
\]

For `G(z)=sum_(j=0)^d g_jz^j`, the quadratic term in (13) has Gram matrix

\[
 \boxed{
 K_{d,\epsilon}
 =(J_{i+j+1-\epsilon})_{i,j=0}^d.}                \tag{15}
\]

The linear vector is independent of the parity except through the residual:

\[
 \boxed{
 \lambda_j=\sum_{a=0}^N[1+2(a+j)]p_aJ_{a+j}
 \quad(0\leq j\leq d).}                          \tag{16}
\]

Finally set

\[
 \beta_{P,\epsilon}
 =\int_{\mathbb R}B_{P,\epsilon}(t^2)W(t)^2dt.
 \tag{17}
\]

Maximizing the remainder integral over the auxiliary space gives

\[
 \boxed{
 \mathcal C_{N,\epsilon,d}
 ={1\over4}\lambda^*K_{d,\epsilon}^{-1}\lambda
 -\beta_{P,\epsilon}.}                            \tag{18}
\]

Thus `C_(N,epsilon,d)>=0` is a finite source-specific sufficient criterion.
It is one correlated moment inequality, not a collection of absolute bounds.

The exact projection identity is

\[
 \boxed{
 \begin{aligned}
 \mathcal C_{N,\epsilon,d}
 &=2\pi\mathcal S_{N,\epsilon}\\
 &\quad-\inf_{\deg G\leq d}\int
 \{t^\epsilon P(t^2)W'
 +t^{1-\epsilon}G(t^2)W\}^2dt.
 \end{aligned}}                                   \tag{19}
\]

The relevant approximation measure is

\[
 d\mu_\epsilon(t)=t^{2(1-\epsilon)}W(t)^2dt,
\]

and the even function being approximated is represented almost everywhere by

\[
 H_{N,\epsilon}(t)
 =-t^{2\epsilon-1}P_N(t^2){W'(t)\over W(t)}.      \tag{20}
\]

At `t=0`, the `epsilon=0` quotient is regular because `W` is even and
`W'(t)/t` has a finite limit.  At real zeros of `W`, the apparent poles in
(20) are harmless in `L2(mu_epsilon)` because the weighted square is exactly
`t^(2epsilon)P^2W'^2`.

The exponential decay of `W^2` gives polynomial density in the even subspace
of `L2(mu_epsilon)`.  Hence

\[
 \boxed{
 \mathcal C_{N,\epsilon,d}
 \uparrow2\pi\mathcal S_{N,\epsilon}
 \quad(d\to\infty).}                              \tag{21}
\]

This is the saturation statement.  An unbounded auxiliary hierarchy always
converges back to the target.  To prove the all-degree ladder, one must give an
independent theta-specific rule for a finite `d=d(N,epsilon)` and prove a
positive margin there; convergence alone supplies no sign.

## 4. The universal leading Hardy deficit

Assume

\[
 \kappa=2N+\epsilon\geq1.                         \tag{22}
\]

The leading term of `w` is `t^(2kappa)`, so (9) has leading term

\[
 B_{P,\epsilon}(z)
 ={\kappa(2\kappa-1)\over2}z^{\kappa-1}
 +\text{lower powers}.                            \tag{23}
\]

To compete at this degree, the auxiliary polynomial must have

\[
 d_{\rm crit}=N+\epsilon-1.                       \tag{24}
\]

Indeed, if `G(z)=az^(d_crit)+...`, then
`g_epsilon(t)` has leading term `a t^(kappa-1)`.  The coefficient of
`z^(kappa-1)` in the remainder (11) is

\[
 \begin{aligned}
 &(2\kappa-1)a-a^2
 -{\kappa(2\kappa-1)\over2}\\
 &\qquad=
 -\left(a-{2\kappa-1\over2}\right)^2
 -{2\kappa-1\over4}.                             \tag{25}
 \end{aligned}
\]

The exact deficit is therefore

\[
 \boxed{\Delta_{\rm Hardy}(N,\epsilon)
 ={2\kappa-1\over4}
 ={4N+2\epsilon-1\over4}.}                       \tag{26}
\]

For H5, `(N,epsilon)=(2,1)`, so `kappa=5` and (26) is `9/4`.

If `deg(G)<d_crit`, the negative leading term from (23) is not matched.  If
`deg(G)>d_crit`, the negative square `-z^(1-epsilon)G^2` has strictly higher
degree than both the derivative term and (23).  Thus, for every nontrivial
ladder step,

\[
 \boxed{
 \text{no polynomial }G\text{ makes }
 \mathcal R_{P,G}^{(\epsilon)}(z)\geq0
 \text{ for every }z\geq0.}                      \tag{27}
\]

The pointwise square route not only fails; the missing leading coefficient
grows linearly with the residual degree.

## 5. A positive Gaussian ladder defeats bounded complexity

The preceding tail calculation concerns pointwise remainders.  The integrated
criterion (18) might still appear to admit one fixed auxiliary degree for all
`N`.  That is not true as a generic mechanism, even when every target pivot is
positive.

Take

\[
 W_G(t)=e^{-t^2/2}.
\]

Then

\[
 W_G'^2-W_GW_G''=W_G^2>0,                         \tag{28}
\]

so both full Hankel ladders are strictly positive.  The residual
`P_(N,epsilon)` is the monic orthogonal polynomial for the positive measure

\[
 t^{2\epsilon}e^{-t^2}dt.
\]

After `z=t^2`, it is the monic generalized Laguerre polynomial with parameter

\[
 \alpha=\epsilon-{1\over2}.                       \tag{29}
\]

The square in (19) becomes

\[
 \int t^{2(1-\epsilon)}
 \{G(t^2)-t^{2\epsilon}P_{N,\epsilon}(t^2)\}^2
 e^{-t^2}dt.                                      \tag{30}
\]

For the odd ladder, orthogonality makes the projection in (30) zero whenever

\[
 d\leq N-1.
\]

For the even ladder it is zero whenever

\[
 d\leq N-2.                                      \tag{31}
\]

Let

\[
 \mathcal N_{N,\epsilon}
 =\int t^{2\epsilon}P_{N,\epsilon}(t^2)^2e^{-t^2}dt>0.
\]

The Laguerre three-term recurrence gives the exact squared-polynomial mean

\[
 {\int t^{2\epsilon+2}P_{N,\epsilon}(t^2)^2e^{-t^2}dt
  \over \mathcal N_{N,\epsilon}}
 =2N+\epsilon+{1\over2}.                          \tag{32}
\]

Since (28) gives

\[
 2\pi\mathcal S_{N,\epsilon}={1\over2}\mathcal N_{N,\epsilon},
\]

equations (19), (30), and (32) yield, throughout the zero-projection ranges
above,

\[
 \boxed{
 \mathcal C_{N,\epsilon,d}
 =-(2N+\epsilon)\mathcal N_{N,\epsilon}<0.}       \tag{33}
\]

Consequently every fixed auxiliary degree `d` fails for all sufficiently
large `N`, despite a strictly positive spectral density and strictly positive
target pivots at every degree.  Exact cancellation of the Gaussian square is
available with

\[
 G(z)=z^\epsilon P_{N,\epsilon}(z),
 \qquad \deg G=N+\epsilon,                        \tag{34}
\]

which again has complexity growing linearly with `N`.

This Gaussian model is not the complete-theta source.  It proves a method
limitation: bounded auxiliary complexity cannot be justified by positivity,
Schwartz decay, evenness, or a positive full moment ladder.  A fixed-degree
miracle for `Xi` is not logically impossible, but it would have to be a new
source-specific theorem rather than a consequence of the square algebra.

## 6. The remaining all-degree target

The exact continuation supplied by this coordinate system is

\[
 \boxed{
 \text{find }d(N,\epsilon)\text{ and prove }
 \mathcal C_{N,\epsilon,d(N,\epsilon)}\geq0
 \text{ for the actual theta residuals}.}         \tag{35}
\]

The structural evidence above imposes three guardrails.

1. Pointwise positivity of the Riccati remainder is impossible at every
   nontrivial degree.
2. The leading matching degree is `N+epsilon-1`, and the Gaussian model needs
   degree `N+epsilon` for exact cancellation.  Linear auxiliary growth is the
   natural scale; bounded complexity has no generic support.
3. Allowing unrestricted auxiliary growth without a separately proved margin
   is target-equivalent by (21).  It is not an all-degree proof.

A viable theta-specific theorem would therefore need an explicit
`d(N,epsilon)=O(N)` construction, uniform control of the positive moment Gram
in (18), and a lower bound that pays the growing Hardy deficit (26).  The
fixed-H5 observation `C_(2,1,3)>0` sits exactly at the Gaussian cancellation
scale `N+epsilon=3`; it is evidence for the coordinate system, not evidence of
a degree-uniform margin.

## Nonclaims

- The square identities (12) and (19) do not prove any new pivot sign.
- The Gaussian calculation is a method countermodel, not a Xi or theta
  counterexample.
- Equation (27) rules out pointwise polynomial Riccati closure only; the
  integrated theta-specific criterion remains possible.
- Equation (21) makes the unrestricted hierarchy target-equivalent, not a
  source of positivity.
- No finite-degree diagnostic is promoted to an all-degree theorem or RH.
