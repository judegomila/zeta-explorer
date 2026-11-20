# Adaptive score spaces: exact block gain and a finite-degree barrier

## Scope and outcome

The failure of the fixed dictionary

\[
 \operatorname {span}\{q',tq,t^2q'\}
\]

at the actual odd degree fifteen does not rule out an old-data adaptive or
growing score space.  This note isolates the exact noncircular continuation
and proves a sharp source-free limitation.

1. Any finite candidate block has an exact Schur gain.  One old-data adaptive
   linear combination realizes the entire block gain.
2. Choosing only the best listed coordinate loses a residual-correlation
   conditioning factor.  That factor needs its own uniform proof.
3. More strongly, for every fixed polynomial degree ceiling there are positive
   even Schwartz profiles with a positive target for `q=t` but a negative
   auxiliary even after projecting onto **all** polynomials below that ceiling.

The third statement rules out a source-free theorem for any fixed finite
polynomial menu, including menus whose coefficients are selected adaptively
from positive moments.  It does not apply to a dictionary whose degree grows
with the rung, and its profiles are not the complete theta profile.  No
all-degree theta theorem or RH conclusion is claimed.

## 1. Exact gain of a candidate block

Let

\[
 s=-q'W-2qW',\qquad A=\|q'W\|_2^2,
\]

and let `U=span{p_iW}` be a linearly independent old-data score space.  Write

\[
 K_U=(\langle p_iW,p_jW\rangle),\qquad
 y_U=(\langle s,p_iW\rangle).
\]

Schwartz decay gives the division-free identity

\[
 \langle s,pW\rangle=\int q p'W^2.
\]

Hence

\[
 \mathcal H_U={1\over4}(y_U^TK_U^{-1}y_U-A).              \tag{1}
\]

Now append a candidate block `R=span{r_1W,...,r_mW}` and set

\[
 \Sigma=K_{RR}-K_{RU}K_U^{-1}K_{UR},\qquad
 z=y_R-K_{RU}K_U^{-1}y_U.                                \tag{2}
\]

After deleting exact dependencies, `Sigma` is positive definite.  Block
inversion gives

\[
 \boxed{
 \mathcal H_{U+R}=\mathcal H_U+{1\over4}z^T\Sigma^{-1}z.} \tag{3}
\]

This is an old-data condition whenever `q`, the candidate polynomials, and
the positive `W^2` moments are old data.  No new signed pivot enters.

If `z` is nonzero, there is no need to keep all `m` directions after
evaluating (2).  Put

\[
 c=\Sigma^{-1}z,\qquad
 r_*=\sum_{j=1}^m c_jr_j.
\]

The residualized feature `(I-P_U)r_*W` has squared norm
`c^T Sigma c=z^T Sigma^(-1)z` and score correlation equal to the same
quantity.  Therefore

\[
 \boxed{
 \mathcal H_{U+\operatorname {span}\{r_*W\}}
 =\mathcal H_{U+R}.}                                     \tag{4}
\]

Thus a successful finite block always yields one successful adaptive
direction.  Formula (4) is constructive and noncircular; the unpaid analytic
step is a uniform lower bound for the block gain in (3).

## 2. Why best-coordinate selection needs conditioning

Let `D=diag(Sigma)` and define the residual correlation matrix and normalized
innovation

\[
 \mathcal R=D^{-1/2}\Sigma D^{-1/2},\qquad
 x=D^{-1/2}z.
\]

Adding candidate `j` alone gives gain `x_j^2/4`, whereas the block gain is

\[
 {1\over4}x^T\mathcal R^{-1}x.
\]

If `B=max_j x_j^2` and `G=x^T R^(-1)x` in these normalized coordinates, then subspace monotonicity
and the spectral bound give

\[
 \boxed{
 {\lambda_{\min}(\mathcal R)\over m}G\le B\le G.}        \tag{5}
\]

Consequently “choose the largest `delta_j^2/sigma_j`” captures a uniform
fraction of the joint gain only after proving a degree-independent lower
bound for the residual correlation matrix.  Near-dependent candidates can
make that factor arbitrarily small.  The adaptive combination (4) avoids the
conditioning loss, though it still needs the joint gain inequality.

An especially natural recurrence-aware block is

\[
 U_N=\operatorname {span}\{q_N',tq_N\},\qquad
 R_N=\operatorname {span}\{q_{N-1}',tq_{N-1}\}.          \tag{6}
\]

It uses only the current and prior old-data residuals.  For one prior
derivative `r=q_(N-1)'`, the exact repair condition is

\[
 \boxed{
 \delta_{N,-}^2\ge-4\mathcal H_{U_N}\sigma_{N,-},}       \tag{7}
\]

where

\[
 \begin{aligned}
 \sigma_{N,-}&=\|(I-P_{U_N})q_{N-1}'W\|_2^2,\\
 \delta_{N,-}&=\int q_Nq_{N-1}''W^2
 -\langle q_{N-1}'W,U_N\rangle K_{U_N}^{-1}y_{U_N}.
 \end{aligned}
\]

For degree `kappa>=3`, the leading degrees of
`tq_N,q_N',q_(N-1)'` are `kappa+1,kappa-1,kappa-3`, so this three-feature
space has exact rank three.  The residual recurrence

\[
 q_N=(t^2-\alpha_N)q_{N-1}-\beta_Nq_{N-2}
\]

also gives

\[
 t^2q_{N-1}'=q_N'+\alpha_Nq_{N-1}'-2tq_{N-1}
                  +\beta_Nq_{N-2}'.                       \tag{8}
\]

Equations (6)--(8) explain why prior-residual directions are a genuinely
recurrence-aware next test.  They do not prove (7) uniformly.

## 3. A barrier for every fixed polynomial degree ceiling

Fix `d>=0`, put `q(t)=t`, and let

\[
 \mathcal P_d^{\rm even}=\operatorname {span}\{1,t^2,\ldots,t^{2d}\}.
\]

The score `s_L` is even.  Odd polynomial features have zero correlation with
it, so this full even space dominates every polynomial candidate menu with the
same degree ceiling, regardless of how its coefficients are chosen.

For `L>1`, define the positive even Schwartz profile

\[
 W_L(t)=e^{-t^2/2}+L^{-1}e^{-t^2/(2L^2)}.                 \tag{9}
\]

Let `s_L=-W_L-2tW_L'`.  The exact projection formula is

\[
 \Pi_d(L):=\|P_{\mathcal P_d^{\rm even}W_L}s_L\|_2^2
 =\sup_{0\ne p\in\mathcal P_d^{\rm even}}
 {\left(\int tp'W_L^2\right)^2\over\int p^2W_L^2}.       \tag{10}
\]

The equality uses `int q p'W^2` with `q=t`.  We prove

\[
 \boxed{\Pi_d(L)=O_d(L^{-1}).}                            \tag{11}
\]

Normalize a trial polynomial so that the denominator in (10) is one and
write

\[
 P_L(u)=p(Lu)=\sum_{j=0}^d b_ju^{2j}.
\]

The square of the broad Gaussian in (9) gives the lower bound

\[
 1\ge L^{-1}\int_{\mathbb R}P_L(u)^2e^{-u^2}du.           \tag{12}
\]

Because `P_d` is finite dimensional, coefficient evaluation and
`P -> integral uP'(u)e^(-u^2)du` are bounded functionals in this Gaussian
norm.  Thus every `b_j=O_d(sqrt L)`.  Split the numerator of (10) into the
narrow square, cross term, and broad square.  After `t=Lu`, the broad term is

\[
 L^{-1}\int uP_L'(u)e^{-u^2}du=O_d(L^{-1/2}).             \tag{13}
\]

For the narrow term, `p(t)=sum b_jL^(-2j)t^(2j)` and the constant derivative
vanishes, so it is `O_d(L^(-3/2))`.  The cross term has one further factor
`L^(-1)` and is `O_d(L^(-5/2))`.  The complete numerator is therefore
`O_d(L^(-1/2))`; squaring proves (11).

Meanwhile

\[
 \|W_L\|_2^2\longrightarrow\sqrt\pi.                    \tag{14}
\]

The broad perturbation tends to zero both in `L^2` and under `tD`, so
`s_L` tends in `L^2` to

\[
 s_0=(-1+2t^2)e^{-t^2/2}.
\]

Gaussian moments give

\[
 \|s_0\|_2^2=2\sqrt\pi,
 \qquad \|e^{-t^2/2}\|_2^2=\sqrt\pi.                    \tag{15}
\]

Combining (11)--(15),

\[
 \boxed{
 8\pi\mathcal S_L[t]=\|s_L\|_2^2-\|W_L\|_2^2
     \longrightarrow\sqrt\pi>0,\qquad
 \mathcal H_{\mathcal P_d^{\rm even}W_L}
     \longrightarrow-{\sqrt\pi\over4}<0.}               \tag{16}
\]

For every fixed `d`, both strict signs in (16) hold for all sufficiently large
`L`.  Since projection onto the full space `P_d` dominates projection onto
any of its subspaces, (16) proves:

> **Finite-degree adaptive barrier.**  No source-free rule whose candidate
> polynomials have a fixed maximum degree can guarantee a nonnegative score
> auxiliary, even if it chooses coefficients adaptively from all positive
> moments and even if the true target is positive.

The theorem is stronger than a counterexample to one named dictionary.  It
also states its exact boundary: growing-degree rules and complete-theta
arithmetic are not covered.

## 4. Closed moment formulas and replay

For audit purposes, put

\[
 m_k(L)=\int_{\mathbb R}t^{2k}W_L(t)^2dt.
\]

Termwise Gaussian integration gives

\[
 {m_k(L)\over\sqrt\pi}
 ={(2k-1)!!\over2^k}(1+L^{2k-1})
 +{2\sqrt2(2k-1)!!L^{2k}\over(L^2+1)^{k+1/2}}.           \tag{17}
\]

In the monomial basis, `K_ij=m_(i+j)` and `y_j=2j m_j`.  Also, with
`J_L=int t^2(W_L')^2`, direct differentiation gives

\[
 {J_L\over\sqrt\pi}
 ={3\over4}+{3\,2^{3/2}L^2\over(L^2+1)^{5/2}}
              +{3\over4L},                               \tag{18}
\]

and `8pi S_L[t]=4J_L-2m_0(L)`.

`src/verify_adaptive_score_finite_degree_barrier.py` replays (17)--(18) at
110 decimal digits and records finite samples for degree ceilings two through
twelve.  The samples support the asymptotic but are not substituted for the
proof of (11).  The counterprofiles in (9) are not the theta profile, and
nothing here signs an actual theta pivot or RH.

Two clean executions produced byte-identical receipts.  Frozen SHA-256 values
are

```text
checker  eab3a1943a9caed5073b00217a0852b11fbd1e18db1ef1ad24588278bc314f11
receipt  c418f268177a8b857c002297e0b7b37040ead056b8fc77e4d970cf7249e09018
```
