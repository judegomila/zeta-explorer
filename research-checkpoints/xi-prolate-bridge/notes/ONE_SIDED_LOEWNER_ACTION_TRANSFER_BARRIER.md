# One-sided Loewner action-transfer barrier and exact orientation alternatives

## 0. Outcome and claim boundary

The positive-sampling low-block theorem proves the unconditional forcing
factor

\[
 \|\Delta_L^{-1}c_L\|
 =o\!\left(\lambda^{-1/2}P(\lambda)^{1/2}\right).       \tag{0.1}
\]

This note asks whether a substantially weaker signed hypothesis than the
uniform left-close condition can transfer (0.1) to `||B_L^(-1)c_L||` without
a physical conditioning loss.  The answer is negative for a one-sided, or
even uniformly two-sided, Loewner comparison by itself.

An exact quotient-compatible two-dimensional family has

\[
 \Delta\preceq B\preceq3\Delta,                           \tag{0.2}
\]

fixed positive-sampling constants equal to one, and a forcing factor tending
to zero, while the signed inverse action stays bounded away from zero or
diverges.  No positive scalar rescaling of `Delta` makes this family
left-close once its physical condition parameter is large.  The loss in the
existing dominating-action theorem is therefore genuine and sharp in order.

There are weaker sufficient hypotheses than global left-close: commutation,
a uniformly bounded `B^(-1)Delta` on the sampling-generated forcing range,
or a bounded source-aligned envelope ratio.  These are orientation or signed
action inputs, not consequences of the present positive sampling estimates.
The envelope ratio below is only a sufficient comparison of two worst-case
operator-norm envelopes; it is not a pointwise equivalence for each forcing
vector.

The family is an abstract finite-dimensional implication countermodel, not
an actual prolate--Weil realization.  Nothing here proves that the actual
one-sided floor or action bound fails.  Conversely, nothing here proves an
actual residual-action estimate, a reducing property for the physical low
range, equation (5.2) of `DIRECT_RH_ATTACK.md`, a signed sector floor,
determinant convergence, RH, or a Lambda bound.  No status, replay,
source-lock, artifact, or integration file is changed.

## 1. Frozen dependencies and notation

The deduction uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md` | `33f064c07a134986afa23efb91f7514e27828543b09cc358ebfff01e79c6f16e` |
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md` | `93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329` |
| `notes/TRANSPORTED_SIGNED_KERNEL_LEFT_RESERVE_BARRIER.md` | `6e45d1ba6667f480223f0e742fd57c14c8708bc8cd8f77c0001edb9c234b23d2` |

Work on a finite-dimensional real or complex Hilbert space.  Let
`Delta>0`, let `B=B^*`, and put

\[
 u=\Delta^{-1}c,\qquad
 H=\Delta^{-1/2}B\Delta^{-1/2}.                         \tag{1.1}
\]

For a positive sampling Gram `G`, define the two exact constants

\[
 \begin{aligned}
 \Gamma_\Delta(G)
   &:=\|\Delta^{-1}G\Delta^{-1}\|
     =\|\Delta^{-1}G^{1/2}\|^2,\\
 C_\Delta(G)
   &:=\|\Delta^{-1/2}G\Delta^{-1/2}\|
     =\|\Delta^{-1/2}G^{1/2}\|^2.
 \end{aligned}                                           \tag{1.2}
\]

The first constant controls the new positive forcing factor.  The second is
the symmetrically scaled sampling constant used by the one-sided dominating-
action theorem.

## 2. A one-sided floor is lossless only in the energy norm

Assume

\[
 \boxed{B\succeq\mu\Delta>0},\qquad \mu>0.              \tag{2.1}
\]

Then `H>=mu I` and

\[
 B^{-1}c
 =\Delta^{-1/2}H^{-1}\Delta^{1/2}u.                    \tag{2.2}
\]

Consequently the `Delta`-energy norm satisfies the exact lossless estimate

\[
 \boxed{
 \|B^{-1}c\|_\Delta
 :=\|\Delta^{1/2}B^{-1}c\|
 \leq\mu^{-1}\|\Delta^{1/2}u\|
 =\mu^{-1}\|u\|_\Delta.}                               \tag{2.3}
\]

The determinant bridge, however, needs the ordinary physical norm.  From
(2.2) one obtains only

\[
 \boxed{
 \|B^{-1}c\|
 \leq\mu^{-1}\|\Delta^{-1/2}\|\,\|\Delta^{1/2}u\|
 \leq{\sqrt{\kappa(\Delta)}\over\mu}\|u\|,}            \tag{2.4}
\]

where `kappa(Delta)=||Delta||*||Delta^(-1)||`.  The last factor disappears
if `B` and `Delta` commute: simultaneous diagonalization then gives

\[
 0<B^{-1}\Delta\preceq\mu^{-1}I,\qquad
 \|B^{-1}c\|\leq\mu^{-1}\|\Delta^{-1}c\|.              \tag{2.5}
\]

Without such an orientation condition, squaring or multiplying the Loewner
inequality (2.1) is not legitimate.

If

\[
 cc^*\preceq\epsilon G,                                  \tag{2.6}
\]

Douglas factorization and (2.2) give the existing dominating-action bound

\[
 \boxed{
 \|B^{-1}c\|
 \leq{\sqrt{\epsilon}\over\mu}
       \|\Delta^{-1/2}\|\,C_\Delta(G)^{1/2}.}           \tag{2.7}
\]

By contrast, the positive forcing theorem gives

\[
 \boxed{
 \|\Delta^{-1}c\|
 \leq\sqrt{\epsilon\Gamma_\Delta(G)}.}                 \tag{2.8}
\]

There is always

\[
 \Gamma_\Delta(G)
 \leq\|\Delta^{-1}\|C_\Delta(G),                       \tag{2.9}
\]

but no reverse inequality with a universal constant.  Section 3 makes the
gap in (2.9) sharp.

## 3. Quotient-compatible two-sided counterfamily

Fix rational numbers `M>1` and `a>0`.  Take two-dimensional source and
physical spaces and set

\[
 D=I_2,\qquad
 W=\begin{bmatrix}M&0\\0&1\end{bmatrix},\qquad
 S=\begin{bmatrix}0&1\end{bmatrix}.                     \tag{3.1}
\]

The quotient construction gives

\[
 \Delta=(WD^{-1}W^*)^{-1}
 =\begin{bmatrix}M^{-2}&0\\0&1\end{bmatrix},
 \qquad G=S^*S=e_2e_2^*.                                \tag{3.2}
\]

All positive sampling constants relevant to this direction are fixed:

\[
 C_{\min}=\|SWD^{-1/2}\|^2=1,qquad
 C_\Delta(G)=1,qquad
 \Gamma_\Delta(G)=1.                                    \tag{3.3}
\]

Let

\[
 \epsilon=a^2,qquad c=ae_2.                            \tag{3.4}
\]

Then `cc^*=epsilon G` and the forcing estimate is saturated:

\[
 \|\Delta^{-1}c\|=a=\sqrt{\epsilon\Gamma_\Delta(G)}.   \tag{3.5}
\]

Now define

\[
 B=
 \begin{bmatrix}
  2M^{-2}&M^{-1}\\
  M^{-1}&2
 \end{bmatrix}
 =\Delta^{1/2}
 \begin{bmatrix}2&1\\1&2\end{bmatrix}
 \Delta^{1/2}.                                           \tag{3.6}
\]

The middle matrix has eigenvalues one and three.  More explicitly,

\[
 \begin{aligned}
 B-\Delta
  &=\begin{bmatrix}M^{-1}\\1\end{bmatrix}
    \begin{bmatrix}M^{-1}&1\end{bmatrix}\succeq0,\\
 3\Delta-B
  &=\begin{bmatrix}M^{-1}\\-1\end{bmatrix}
    \begin{bmatrix}M^{-1}&-1\end{bmatrix}\succeq0.
 \end{aligned}                                           \tag{3.7}
\]

Thus the family satisfies the strong, uniformly conditioned relative
comparison

\[
 \boxed{\Delta\preceq B\preceq3\Delta.}                \tag{3.8}
\]

Nevertheless

\[
 B^{-1}
 ={1\over3}
 \begin{bmatrix}2M^2&-M\\-M&2\end{bmatrix},
 \qquad
 \boxed{B^{-1}c={a\over3}\begin{bmatrix}-M\\2\end{bmatrix}.}
                                                               \tag{3.9}
\]

Therefore

\[
 {\|B^{-1}c\|\over\|\Delta^{-1}c\|}
 ={\sqrt{M^2+4}\over3}.                                 \tag{3.10}
\]

Taking `a=M^(-1)` makes the forcing tend to zero while the action tends to
`1/3`.  On an integer parameter sequence `lambda->infinity`, taking
`a=lambda^(-1)` and `M=lambda^2` gives

\[
 \|\Delta^{-1}c\|=\lambda^{-1}
 =o\!\left(\lambda^{-1/2}P(\lambda)^{1/2}\right),
 \qquad \|B^{-1}c\|\sim{\lambda\over3}.                \tag{3.11}
\]

Here `P` is the fixed positive polylogarithmic factor of the low-block
theorem, enlarged if necessary and hence bounded below eventually.  Thus a
uniform one-sided floor, even together with the upper comparison in (3.8),
does not transfer the target Euclidean rate.

The dominating-action estimate (2.7) gives `aM` on this family, while the
exact action is asymptotic to `aM/3`.  Its physical factor is therefore sharp
in order.  This counterfamily preserves the exact quotient and positive
sampling identities, but it is not asserted to be the actual signed
prolate--Weil compression.

## 4. Scalar rescaling cannot repair the obstruction

First consider the dominating-action theorem.  Replace `Delta` by
`widetilde Delta=s Delta`, where `s>0`.  The same floor and sampling
comparison have constants

\[
 \widetilde\mu={\mu\over s},\qquad
 C_{\widetilde\Delta}(G)={C_\Delta(G)\over s},\qquad
 \|\widetilde\Delta^{-1/2}\|
   =s^{-1/2}\|\Delta^{-1/2}\|.                          \tag{4.1}
\]

Substitution into (2.7) cancels every power of `s`.  Hence optimized scalar
rescaling cannot reduce the one-sided action bound.

The counterfamily satisfies a stronger statement.  Put

\[
 Q=\Delta^{-1}B
 =\begin{bmatrix}2&M\\M^{-1}&2\end{bmatrix}.            \tag{4.2}
\]

If some scalar `s>0` made the Euclidean left defect smaller than one, then

\[
 \rho_s=\|(s\Delta)^{-1}(B-s\Delta)\|
       =\|s^{-1}Q-I\|<1.                                 \tag{4.3}
\]

For every unit vector `x`, (4.3) would imply

\[
 \Re\langle x,Qx\rangle/s
 =1+\Re\langle x,(s^{-1}Q-I)x\rangle>0.                 \tag{4.4}
\]

Thus the Hermitian part of `Q` would have to be positive definite.  Its
least eigenvalue is exactly

\[
 2-{M+M^{-1}\over2}.                                     \tag{4.5}
\]

For

\[
 \boxed{M>2+\sqrt3,}                                     \tag{4.6}
\]

this number is negative.  Hence no positive scalar multiple of `Delta` is
left-close for the family, despite the uniform two-sided Loewner comparison
(3.8).

## 5. Exact loss from the currently proved low-block constants

Return to the declared label-8/rest low range.  With

\[
 A=[\,A_8\;A_R\,],\qquad \Delta_L^{-1}=AA^*,            \tag{5.1}
\]

the frozen block estimates give

\[
 \begin{aligned}
 C_{\Delta_L}(G_L)=\|SA\|^2
   &\leq C_8+C_R=O(\lambda^3P(\lambda)),\\
 \|\Delta_L^{-1}\|=\|AA^*\|
   &\leq M_8+M_R=O\!\left({\lambda^2\over d_8}\right).
 \end{aligned}                                           \tag{5.2}
\]

If the still-unproved one-sided floor

\[
 B_L\succeq\mu_\lambda\Delta_L                         \tag{5.3}
\]

were available, (2.7), `epsilon_lambda=o(d_6)`, and

\[
 {d_6\over d_8}\sim {7\over32\pi^2}\lambda^{-4}        \tag{5.4}
\]

would give only

\[
 \boxed{
 \|B_L^{-1}c_L\|^2
 =o\!\left(\mu_\lambda^{-2}\lambda P(\lambda)\right),
 \qquad
 \|B_L^{-1}c_L\|
 =o\!\left(\mu_\lambda^{-1}\lambda^{1/2}
                   P(\lambda)^{1/2}\right).}            \tag{5.5}
\]

A uniform positive `mu_lambda` therefore loses a full factor `lambda`
relative to (0.1) and does not even force decay.  A floor
`mu_lambda>=c*lambda` would recover the target rate from the current coarse
one-sided theorem, but no such growing relative floor is proved.  Equation
(4.1) shows that changing the scalar normalization of `Delta_L` cannot
manufacture this gain.

The cross-aware forcing estimate avoids the loss because it retains

\[
 \left(\sqrt{C_8M_8}+\sqrt{C_RM_R}\right)^2
 =O\!\left({\lambda^3P(\lambda)\over d_8}\right),        \tag{5.6}
\]

whereas the dominating-action route factors the separate maxima as
`(C_8+C_R)(M_8+M_R)=O(lambda^5*P/d_8)`.  A general signed inverse may rotate
the high-sampling rest direction into the large-synthesis label-8 direction;
the family in Section 3 is the two-dimensional normal form of exactly that
loss.

## 6. Exact weaker orientation hypotheses that would suffice

The negative result does not make global left-close logically necessary.
It identifies the extra information that must replace it.

### 6.1 The actual-vector and restricted-transfer conditions

For one nonzero forcing vector, the exact transfer ratio is simply

\[
 K_c={\|B^{-1}c\|\over\|\Delta^{-1}c\|}.                \tag{6.1}
\]

A uniform bound on `K_c` transfers the proved rate and is strictly weaker
than any operator-norm left-close hypothesis, but it is itself the desired
vector-specific signed action estimate.

For a sampling Gram `G`, put

\[
 \mathcal U_G=\operatorname {ran}(\Delta^{-1}G^{1/2}).   \tag{6.2}
\]

If

\[
 \boxed{\|B^{-1}\Delta|_{\mathcal U_G}\|\leq K_0}       \tag{6.3}
\]

uniformly, then

\[
 \|B^{-1}G^{1/2}\|
 \leq K_0\|\Delta^{-1}G^{1/2}\|.                       \tag{6.4}
\]

Together with (2.6), this gives

\[
 \|B^{-1}c\|\leq K_0\sqrt{\epsilon\Gamma_\Delta(G)}.  \tag{6.5}
\]

This restricted condition can hold even when global left-close fails.  It
is nevertheless a new signed orientation theorem, not a consequence of
positive sampling.

### 6.2 A carefully scoped sampling-envelope ratio

When `G!=0`, define

\[
 \boxed{
 \mathcal K_G^{\rm env}
 :={\|B^{-1}G^{1/2}\|
       \over\|\Delta^{-1}G^{1/2}\|}.}                   \tag{6.6}
\]

Douglas factorization of (2.6) proves the sufficient worst-case envelope
bound

\[
 \boxed{
 \|B^{-1}c\|
 \leq\mathcal K_G^{\rm env}
       \sqrt{\epsilon\Gamma_\Delta(G)}.}                \tag{6.7}
\]

The numerator and denominator in (6.6) are separate operator-norm suprema.
Their ratio is not the ratio for each common forcing direction, is not a
pointwise equivalence, and need not be the least constant in
`||B^(-1)c||<=K||Delta^(-1)c||` for a specified `c`.  Its role is exactly the
sufficient envelope implication (6.7).

Under the one-sided floor (2.1), (2.7) gives

\[
 \mathcal K_G^{\rm env}
 \leq{1\over\mu}
 \left{{\|\Delta^{-1}\|C_\Delta(G)
              \over\Gamma_\Delta(G)}\right}^{1/2}.     \tag{6.8}
\]

Thus the source-aligned balance condition

\[
 \boxed{
 \|\Delta^{-1}\|C_\Delta(G)
 =O(\Gamma_\Delta(G))}                                  \tag{6.9}
\]

together with a uniform positive `mu` would suffice without a physical
loss.  The ratio in (6.8) equals `M` in order on the counterfamily and is not
bounded by the current low-block estimates.

### 6.3 Commutation

The clean structural alternative is

\[
 [B,\Delta]=0,qquad B\succeq\mu_0\Delta,qquad\mu_0>0. \tag{6.10}
\]

Then (2.5) transfers (0.1) directly.  Exact block reduction or an equivalent
uniformly conditioned generalized-eigenvector orientation can replace full
commutation, but neither is presently proved for the signed physical
operator.

## 7. Final scope

The proved statement is a transfer barrier, not an actual-source failure.
One-sided or two-sided relative Loewner control supplies the correct energy-
norm action but does not control the physical Euclidean action without an
orientation factor.  The existing dominating-action theorem remains valid;
its physical factor is sharp and its current low-block insertion yields only
(5.5).  Scalar rescaling does not improve that estimate.

A future proof may use global left-close, a sufficiently large one-sided
floor, a uniform one-sided floor plus source-aligned balance,
commutation/reduction, or the restricted action condition (6.3).  Even a
low-range action theorem would still require
the reducing property or a full low/high Schur comparison before it becomes
a component of the full signed inverse.  Equation (5.2), both parity floors,
the full physical complement, locally uniform determinant convergence, RH,
and every Lambda bound remain open.
