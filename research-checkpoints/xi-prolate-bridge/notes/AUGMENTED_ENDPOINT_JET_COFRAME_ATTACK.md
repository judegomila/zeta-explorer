# Augmented endpoint-jet coframe attack

## 0. Status and exact claim boundary

Claim class: `AUGMENTED_ENDPOINT_JET_COFRAME_ATTACK`.

This note attacks the augmented source map proposed in Section 7 of
`notes/PRESCRIBED_RESIDUE_COFRAME_AUDIT.md`.  It proves three new, but
limited, statements.

1. At every **fixed** `lambda` and fixed jet order `K`, suitably separated
   high labels in either prescribed residue family have an endpoint-jet
   matrix whose least singular value is bounded below by a constant times
   `sqrt(R/lambda)`, where `R` is the common label scale.  The same statement
   survives the exact zero-integral corrections and the actual plus-anchor
   deflation.
2. Endpoint-jet-zero finite combinations are dense, in source `L2`, in the
   algebraic prescribed residue source.  Consequently a prescribed residue
   map onto any fixed finite physical target is onto after imposing any
   fixed number of exact endpoint-jet conditions if and only if it was onto
   before imposing them.
3. A finite prescribed coframe, if one is already known, can be corrected to
   have zero endpoint jets while retaining an arbitrarily close
   source-whitened floor.  An explicit perturbation inequality is given.

The second statement is also the decisive limitation of this route:
endpoint-jet augmentation cannot bypass the missing prescribed-residue
coframe.  It can make an already available coframe compatible with a smooth
arithmetic image, but it cannot create physical rank that was absent.

The proof is fixed-parameter.  The elementary high-label localization used
below starts only beyond a scale of order at least `c^2`, with

\[
 c=2\pi\lambda^2,
\]

and hence beyond order `lambda^4`, whereas the declared transition
inventories have labels of order `lambda^2`.  No effective common unbounded
schedule follows.  The actual high-label threshold after zero-integral and
anchor corrections is also non-effective because only Bessel and weak
convergence are used for those corrections.

This note proves neither the plus nor the minus prescribed coframe on an
unbounded schedule.  It supplies no derivative-tail estimate, signed Weil
floor, residual estimate, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally
uniform determinant convergence, or Riemann-hypothesis conclusion.  The
repository state remains `P0_INVALIDATED`.  No zero ordinate, zero-reality
assumption, or global Weil positivity is used.

The source interval is `[-lambda,lambda]` with Lebesgue measure and zero
extension.  The arithmetic map, inversion projection, Fourier sign, source
normalization, minus sign of the prime block, and inclusive prime-power
endpoint remain exactly those in `P0_SOURCE_LOCK.json` and
`RESIDUE_COFRAME_MIXED_KRYLOV_SOURCE_LOCK.json`.  The prime block does not
enter the source-only endpoint calculation below.

## 1. Prescribed source cores and the augmented problem

Fix the locked parameter

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad c=2\pi\lambda^2.                              \tag{1.1}
\]

Let `h_(n,lambda)` be the real, unit-orthonormal prolate modes on
`[-lambda,lambda]`, and put

\[
 I_n=\int_{-\lambda}^{\lambda}h_{n,\lambda}(x)\,dx.   \tag{1.2}
\]

The actual zero-integral columns are

\[
 c_n^+=h_n-{I_n\over I_0}h_0,
 \qquad n=4,8,12,\ldots,                              \tag{1.3}
\]

and

\[
 c_n^-=-h_n+{I_n\over I_2}h_2,
 \qquad n=6,10,14,\ldots .                            \tag{1.4}
\]

As in the existing source lock, `I_2!=0` is a precondition for (1.4).
The declared minus sign in (1.4) is retained throughout.

For a fixed finite physical target `X`, let

\[
 T=P_XS_\sigma A_\lambda.                             \tag{1.5}
\]

The locked arithmetic estimate gives

\[
 \|T\|\leq{\lambda\over\sqrt2}.                     \tag{1.6}
\]

When the plus anchor is deflated, write

\[
 p_4=Tc_4^+\ne0,
 \qquad
 \widetilde c_n^+=c_n^+-\alpha_nc_4^+,
 \qquad
 \alpha_n={\langle p_4,Tc_n^+\rangle\over\|p_4\|^2},
 \quad n\geq8.                                       \tag{1.7}
\]

For an integer `K>=1`, the source endpoint map is

\[
 \mathcal J_Kf=
 \bigl(f(\lambda),f'(\lambda),\ldots,
                    f^{(K-1)}(\lambda)\bigr).         \tag{1.8}
\]

The target isolated in the prior audit is the range of

\[
 \begin{bmatrix}T C\\ \mathcal J_K C\end{bmatrix}
 \quad\hbox{on}\quad
 \begin{bmatrix}X\\0\end{bmatrix}.                 \tag{1.9}
\]

The issue is not whether the endpoint rows alone have rank.  The issue is
whether physical targets can still be reached after the endpoint rows have
been set equal to zero.

## 2. An elementary high-label prolate localization lemma

This section proves the only high-index input used later.  It is included
to avoid importing an unpinned asymptotic formula.

Rescale a source mode to `[-1,1]` by

\[
 y_n(s)=\sqrt\lambda\,h_{n,\lambda}(\lambda s).
                                                                  \tag{2.1}
\]

Then `||y_n||_2=1`, and `y_n` is the `n`th eigenfunction of

\[
 L_c=-{d\over ds}\left((1-s^2){d\over ds}\right)+c^2s^2,
 \qquad
 L_cy_n=\mu_n(c)y_n.                                  \tag{2.2}
\]

Let `p_m` be the unit-normalized Legendre polynomial,

\[
 L_0p_m=m(m+1)p_m,
 \qquad
 p_m^{(k)}(1)=\sqrt{{2m+1\over2}}
 { (m+k)!\over 2^kk!(m-k)!}                           \tag{2.3}
\]

for `m>=k`, with the derivative equal to zero for `m<k`.

### Lemma 2.1 (weighted Legendre localization)

Fix `c` and a derivative order `k`.  Orient `y_n` so that its coefficient
of `p_n` is positive.  Then, along either parity subsequence,

\[
 \boxed{
 y_n^{(k)}(1)
 =\left({1\over2^kk!}+o_{c,k}(1)\right)
    n^{2k+1/2}.}                                      \tag{2.4}
\]

This orientation is only a diagonal `+/-1` change of auxiliary source
coordinates.  Under it `I_n` and the whole corrected column (1.3) or (1.4)
change by the same sign.  It therefore changes neither the prescribed
source normalization, its Gram, nor any coframe singular value.

More explicitly, put

\[
 s_k=2k+{1\over2},\qquad
 B_s=4^{s+1},
 \qquad
 g_n=4n-2-c^2.                                        \tag{2.5}
\]

Whenever `g_n>0` and

\[
 \rho_s={B_sc^2\over g_n}<1,                         \tag{2.6}
\]

the Legendre coefficients `y_n=sum_m v_m p_m` satisfy

\[
 \sum_{m\ne n}|v_m|(m+1)^s
 \leq{\rho_s\over1-\rho_s}|v_n|(n+1)^s.             \tag{2.7}
\]

Thus (2.4) has an effective raw-mode threshold; no numerical prolate
eigenvalue is required.

**Proof.**  Write `A=L_0` and `V=c^2s^2`.  Since `0<=V<=c^2`, the min--max
principle gives

\[
 n(n+1)\leq\mu_n(c)\leq n(n+1)+c^2.                  \tag{2.8}
\]

Multiplication by `s` has two nonzero diagonals in the normalized Legendre
basis, and each recurrence coefficient has absolute value at most one.
For the weighted sequence norm

\[
 \|a\|_{1,s}=\sum_m|a_m|(m+1)^s,                     \tag{2.9}
\]

two applications of that recurrence give the safe bound

\[
 \|s^2a\|_{1,s}\leq B_s\|a\|_{1,s}.                 \tag{2.10}
\]

Let `P=|p_n><p_n|` and `Q=I-P`.  For every same-parity `m!=n`, (2.8) gives

\[
 |m(m+1)-\mu_n(c)|\geq g_n.                           \tag{2.11}
\]

Indeed the closest lower level is separated by `4n-2`, and the closest
upper level by at least `4n+6-c^2`; (2.11) is the smaller safe expression.
On the same-parity coefficient space the `Q` part of the eigenvalue
equation is

\[
 Q(A-\mu_n)Qv_Q+QVQv_Q=-QVPv_n.                      \tag{2.12}
\]

The diagonal inverse of the first term has weighted norm at most `g_n^-1`.
Neumann inversion of (2.12), using (2.10), gives exactly (2.7).
This may be carried out first in finite Legendre--Galerkin truncations.  The
bounds are uniform, and `rho_0<1` gives uniqueness of the `L2` solution on
the `Q` space, so passage to the limit identifies it with the prolate
eigenfunction coefficients.

Taking `s=0` also shows that the normalized coefficient `v_n` tends to one.
From (2.3), for fixed `k`,

\[
 |p_m^{(k)}(1)|\leq C_k(m+1)^{s_k}                   \tag{2.13}
\]

with an explicit constant depending only on `k`.  Apply (2.7) with
`s=s_k`, divide by `n^(s_k)`, and use `rho_(s_k)=O_(c,k)(n^-1)`.
Equation (2.3) then proves (2.4).  `square`

The endpoint differential equation also gives, without an asymptotic
argument, the exact recurrence

\[
 y_n^{(k)}(1)=P_k(\mu_n(c);c)y_n(1),                  \tag{2.14}
\]

where

\[
 P_0=1,qquad P_1={\mu-c^2\over2},                   \tag{2.15}
\]

and

\[
 P_{k+1}=
 {\bigl(\mu-c^2-k(k+1)\bigr)P_k
       -2kc^2P_{k-1}-k(k-1)c^2P_{k-2}
  \over2(k+1)}.                                      \tag{2.16}
\]

Here `k>=1`; for `k=1`, the term containing `P_(k-2)` is absent
(equivalently, set `P_(-1)=0`).

In particular `P_k` has leading coefficient `1/(2^k k!)`.  This recovers
the exact endpoint Wronskian formula in the prior audit.  Lemma 2.1 adds the
large-label size information needed for a controlled right inverse.

## 3. The exact source corrections do not destroy the asymptotic

The constant function has square-summable coefficients in the complete
orthonormal prolate basis.  Therefore Bessel's inequality gives

\[
 I_n\longrightarrow0.                                \tag{3.1}
\]

Equations (1.3)--(1.4) and Lemma 2.1 consequently imply, for each fixed
`k`,

\[
 \begin{aligned}
 (c_n^+)^{(k)}(\lambda)
 &=\lambda^{-k-1/2}
   \left({1\over2^kk!}+o(1)\right)n^{2k+1/2},\\
 (c_n^-)^{(k)}(\lambda)
 &=-\lambda^{-k-1/2}
   \left({1\over2^kk!}+o(1)\right)n^{2k+1/2}.
 \end{aligned}                                       \tag{3.2}
\]

The second line retains the declared minus sign of the source column.

For the plus anchor-deflated columns, `c_n^+` converges weakly to zero in
source `L2`.  The range of `T` is finite-dimensional, so

\[
 Tc_n^+\longrightarrow0,
 \qquad \alpha_n\longrightarrow0.                    \tag{3.3}
\]

The fixed-mode correction in (1.7) is therefore lower order than every
quantity in (3.2).  Hence (3.2) remains valid with `c_n^+` replaced by
`widetilde c_n^+`.  For any finite collection of mutually diverging labels,
the source Gram of these corrected columns tends to the identity:

\[
 \bigl[\langle d_{n_i},d_{n_j}\rangle\bigr]_{i,j}
 \longrightarrow I,                                  \tag{3.4}
\]

where `d_n` may denote `c_n^+`, `widetilde c_n^+`, or `c_n^-`.

The use of finite-dimensionality in (3.3) is important.  This is a theorem
for one fixed physical target, not a uniform assertion as its dimension
grows with `lambda`.

## 4. A quantitative high-label endpoint block

Fix `K` distinct positive numbers

\[
 0<a_1<a_2<\cdots<a_K.                                \tag{4.1}
\]

For large `R`, choose distinct labels `n_j(R)` in the actual residue class
so that

\[
 n_j(R)=a_jR+O(1).                                    \tag{4.2}
\]

Thus `n_j=0 mod 4` in the plus family and `n_j=2 mod 4` in the minus
family.  Let `H_R:C^K -> L2[-lambda,lambda]` synthesize the corresponding
actual corrected columns `d_(n_j)`, and put

\[
 J_R=\mathcal J_KH_R.                                 \tag{4.3}
\]

Define the row scaling

\[
 D_R=\operatorname {diag}_{0\leq k<K}
 \left(\lambda^{k+1/2}R^{-(2k+1/2)}\right).           \tag{4.4}
\]

### Theorem 4.1 (endpoint-jet block and cheap right inverse)

For every fixed `lambda`, `K`, and choice (4.1),

\[
 \boxed{D_RJ_R\longrightarrow V_{K,a},}              \tag{4.5}
\]

where

\[
 (V_{K,a})_{k,j}
 =\varepsilon_\sigma{a_j^{2k+1/2}\over2^kk!},
 \qquad
 \varepsilon_+=1,
 \quad \varepsilon_-=-1.                             \tag{4.6}
\]

Its determinant is

\[
 \boxed{
 \det V_{K,a}
 =\varepsilon_\sigma^K
   \left(\prod_{j=1}^Ka_j^{1/2}\right)
   \left(\prod_{k=0}^{K-1}{1\over2^kk!}\right)
 \prod_{1\leq i<j\leq K}(a_j^2-a_i^2)\ne0.}       \tag{4.7}
\]

Equivalently, the unscaled endpoint determinant has the exact leading
power

\[
 \boxed{
 \det J_R
 =\lambda^{-K^2/2}R^{K^2-K/2}
   \bigl(\det V_{K,a}+o(1)\bigr).}                   \tag{4.7a}
\]

Consequently `J_R` is invertible for all sufficiently large `R`.  If

\[
 \|D_RJ_R-V_{K,a}\|\leq{1\over2}s_{\min}(V_{K,a})
 \quad\hbox{and}\quad R^2\geq\lambda,                \tag{4.8}
\]

then

\[
 \boxed{
 s_{\min}(J_R)
 \geq {s_{\min}(V_{K,a})\over2}
       \sqrt{R\over\lambda}.}                        \tag{4.9}
\]

Moreover,

\[
 \boxed{
 \|H_RJ_R^{-1}\|=O_{\lambda,K,a}(R^{-1/2}).}         \tag{4.10}
\]

**Proof.**  Equations (3.2) and (4.2) give entrywise convergence in (4.5).
Factoring `a_j^(1/2)` from each column and `1/(2^k k!)` from each row leaves
the Vandermonde matrix in `a_j^2`, proving (4.7).

From (4.8), `s_min(D_RJ_R)>=s_min(V_(K,a))/2`.  Since
`J_R=D_R^(-1)(D_RJ_R)` and the smallest diagonal entry of `D_R^(-1)` is
`sqrt(R/lambda)` when `R^2>=lambda`, (4.9) follows.  Finally (3.4) gives
`||H_R||->1`, so (4.9) proves (4.10).  `square`

For a prescribed jet vector `z`, the source

\[
 g_R=H_RJ_R^{-1}z                                    \tag{4.11}
\]

therefore satisfies

\[
 \mathcal J_Kg_R=z,
 \qquad
 \|g_R\|_2=O_{\lambda,K,a}(R^{-1/2})\|z\|.          \tag{4.12}
\]

The endpoint functionals are unbounded in source `L2`; equation (4.12) is
the precise useful manifestation of that fact on each actual residue core.

## 5. Endpoint-zero density and exact range equivalence

Let `mathcal D_sigma` be the algebraic span of all finite combinations of
one actual prescribed source family.  In the plus case this may mean the
zero-integral columns (1.3), or the anchor together with the deflated
columns (1.7).  In the minus case it means (1.4).  Put

\[
 \mathcal D_{\sigma,K}^0
 =\{f\in\mathcal D_\sigma:\mathcal J_Kf=0\}.          \tag{5.1}
\]

### Theorem 5.1 (fixed-parameter jet constraints cost no physical range)

At every fixed `lambda`, fixed `K`, and fixed finite-dimensional physical
target `X`,

\[
 \boxed{
 \overline{\mathcal D_{\sigma,K}^0}^{\,L^2}
 =\overline{\mathcal D_\sigma}^{\,L^2},}              \tag{5.2}
\]

and

\[
 \boxed{
 T(\mathcal D_{\sigma,K}^0)=T(\mathcal D_\sigma).}   \tag{5.3}
\]

**Proof.**  Fix `f in mathcal D_sigma` and take a high block `H_R` disjoint
from the finite support of `f`.  Define

\[
 f_R=f-H_RJ_R^{-1}\mathcal J_Kf.                     \tag{5.4}
\]

Then `f_R in mathcal D_(sigma,K)^0`, while (4.10) gives

\[
 \|f_R-f\|_2\longrightarrow0.                        \tag{5.5}
\]

This proves (5.2).  Since `T` is bounded, `Tf_R->Tf`.  Thus
`T(mathcal D_sigma)` is contained in the closure of
`T(mathcal D_(sigma,K)^0)`.  The latter is a linear subspace of the
finite-dimensional space `X`, and every such subspace is closed.  This
proves (5.3).  `square`

### Corollary 5.2 (the augmented rank problem is equivalent to the old one)

For fixed `lambda`, `K`, and `X`, the following are equivalent.

1. `T(mathcal D_sigma)=X`.
2. `T(mathcal D_(sigma,K)^0)=X`.
3. Some finite prescribed prefix contains a synthesis `C` for which

\[
 \begin{bmatrix}TC\\\mathcal J_KC\end{bmatrix}
 \quad\hbox{contains}\quad
 \begin{bmatrix}X\\0\end{bmatrix}                  \tag{5.6}
\]

in its range.

The implication from 3 to 1 is immediate.  Theorem 5.1 gives 1 if and only
if 2.  A basis of the finite target `X` has finitely many preimages under 2;
the union of their finite source supports is contained in one finite prefix,
which proves 3.

Thus endpoint augmentation is **not** an independent proof of the
prescribed coframe.  At fixed `lambda` it is exactly equivalent to the
unaugmented qualitative range question.  In particular, the endpoint
Wronskian cannot turn a zero physical determinant into a nonzero one.

## 6. Quantitative transfer of a finite coframe

The range theorem has a stable finite-dimensional form.  It is useful
because it keeps the exact source Gram rather than replacing it by the
identity.

Suppose `dim X=d`, and let

\[
 C:\mathbb C^d\longrightarrow\mathcal D_\sigma,
 \qquad D=C^*C>0,
 \qquad W=TC                                      \tag{6.1}
\]

be a square prescribed coframe.  Its source-whitened floor is

\[
 \gamma=\lambda_{\min}(WD^{-1}W^*)>0.                \tag{6.2}
\]

Take a high endpoint block `H_R` outside the support of `C`, and set

\[
 E_R=H_RJ_R^{-1}\mathcal J_KC,
 \qquad C_R=C-E_R.                                    \tag{6.3}
\]

Then

\[
 \mathcal J_KC_R=0.                                   \tag{6.4}
\]

Put

\[
 \delta_R=\|E_RD^{-1/2}\|.                           \tag{6.5}
\]

Theorem 4.1 gives

\[
 \delta_R=O_{\lambda,K,a,C}(R^{-1/2}).               \tag{6.6}
\]

### Theorem 6.1 (source-whitened floor after exact jet cancellation)

If

\[
 \sqrt\gamma>\|T\|\delta_R,                          \tag{6.7}
\]

then `C_R` remains a coframe and, with its **actual** source Gram
`G_R=C_R^*C_R`,

\[
 \boxed{
 \lambda_{\min}\left(TC_RG_R^{-1}C_R^*T^*\right)
 \geq
 \left({\sqrt\gamma-\|T\|\delta_R\over1+\delta_R}
 \right)^2.}                                         \tag{6.8}
\]

In particular, the locked arithmetic bound (1.6) gives the explicit safe
version

\[
 \boxed{
 \lambda_{\min}\left(TC_RG_R^{-1}C_R^*T^*\right)
 \geq
 \left({\sqrt\gamma-(\lambda/\sqrt2)\delta_R
             \over1+\delta_R}\right)^2.}             \tag{6.9}
\]

**Proof.**  The columns of `U=C D^(-1/2)` are source-orthonormal.  For
every coefficient vector `z`,

\[
 \|(C_R D^{-1/2})z\|
 \leq(1+\delta_R)\|z\|,                              \tag{6.10}
\]

while (6.2) and (6.3) give

\[
 \|TC_RD^{-1/2}z\|
 \geq(\sqrt\gamma-\|T\|\delta_R)\|z\|.             \tag{6.11}
\]

Taking the minimum ratio of (6.11) to the actual source norm in (6.10)
proves (6.8), and (1.6) proves (6.9).  `square`

The same perturbation argument works for the positive defect metric
`M=diag(1-chi_n^2)`, with its exact coordinate Gram `C^*MC`.  One replaces
`delta_R` in the physical numerator by

\[
 \|E_R(C^*MC)^{-1/2}\|_2                              \tag{6.12}
\]

and in the source denominator by

\[
 \|M^{1/2}E_R(C^*MC)^{-1/2}\|_2.                     \tag{6.13}
\]

Both tend to zero for a fixed base coframe because `0<M<I` and (4.10).
No identity Gram is substituted at any point.

## 7. Why this does not give the required diagonal schedule

The distinction between fixed-`lambda` nonvanishing and an effective
unbounded schedule is sharp here.

For the largest derivative row `k=K-1`, the elementary proof of Lemma 2.1
asks, for example, that

\[
 4n-2-c^2>2B_{2K-3/2}c^2,
 \qquad B_s=4^{s+1}.                                  \tag{7.1}
\]

Since `c=2*pi*lambda^2`, this sufficient region begins at

\[
 n\gg 4^{2K}c^2
 \asymp 4^{2K}\lambda^4.                              \tag{7.2}
\]

Even for fixed `K`, this is parametrically beyond the declared transition
inventory, whose terminal labels have order `lambda^2`.  If `K` grows with
`lambda`, the mismatch worsens.  Equations (3.1) and (3.3) give no effective
uniform rate for the exact zero-integral and anchor corrections, so they do
not repair (7.2).

This is a limitation of the present elementary high-label construction,
not an impossibility theorem for a transition-scale endpoint block.  The
actual transition modes may have a much better jet matrix than (7.1)
certifies.  Establishing that would require a new uniform endpoint
Christoffel/Wronskian estimate at labels `n=O(lambda^2)`.

More fundamentally, Corollary 5.2 shows that even a perfect endpoint block
does not settle the old physical rank problem.  A complete endpoint route
still needs, on one common unbounded locked schedule,

1. the actual plus and minus prescribed low-moment coframes, or an
   equivalent covariance-weighted tangent theorem;
2. a transition-scale bound for the jet correction which preserves the
   required source-metric floor; and
3. a `K`th-derivative or variation estimate strong enough to turn the exact
   cancellation of arithmetic breakpoint jets into the required shell and
   projection-tail rate.

No item in this list is proved here.  The fixed-parameter theorem does,
however, close one logical ambiguity: endpoint cancellation is compatible
with any already established finite prescribed coframe, and is
qualitatively neither stronger nor weaker than that coframe.  It is a tail
regularization device, not a replacement for the missing residue
transversality theorem.
