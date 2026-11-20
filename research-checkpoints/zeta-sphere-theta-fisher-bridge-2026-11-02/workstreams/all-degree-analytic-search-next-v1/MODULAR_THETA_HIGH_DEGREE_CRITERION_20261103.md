# A theta-specific high-degree criterion for modular strong payment

## Result and scope

The Gaussian strong-payment countermodel does not create the same order
obstruction for the complete theta profile.  The reason can be stated without
guessing any high-degree pivot: the audited complete-theta parent-growth
theorem confines every degree-`n` derivative polynomial, uniformly in all of
its coefficients, to a spatial window of radius

\[
 H_n=\log(10(n+1)).                                      \tag{1}
\]

Combining that theorem with the exact modular endpoint formulas gives a
noncircular sufficient condition involving the direct next source reserve
and the current reflection derivative.  Let

\[
 b_j={\sigma_j\over\sigma_{j-1}},\qquad
 P_n=\|F_n\|_2^2,\qquad
 c_n={\sigma_n\over P_n},                                 \tag{2}
\]

where `F_n=T_n(D)psi` is the actual monic endpoint residual and `sigma_n` is
its divided signed pivot.  Expand the reflected derivative in the known
endpoint basis as

\[
 {T_{n+1}'\over\sqrt{\sigma_n}}
 =\sum_{j\le n}d_{n,j}{T_j\over\sqrt{\sigma_j}},
 \qquad d_{n,n}=n+1,
 \qquad D_n=\sum_{j<n}d_{n,j}^2.                           \tag{3}
\]

The sharp reserve for this comparison is not the two factors separately but

\[
 \mathcal R_n:={\sigma_{n+1}\over P_n}
              =b_{n+1}c_n.                                \tag{4}
\]

Here `T_(n+1)` and hence the source defining `sigma_(n+1)` are constructed
from the positive prefix through rung `n`; no normalization by
`sigma_(n+1)` and no assumption of its sign is used.  Thus a lower bound for
`mathcal R_n` derived from the complete-theta source is noncircular, even
though proving such a bound is precisely the new arithmetic work.

Then the endpoint strong payment follows from

\[
 \boxed{
 \mathcal R_n\ge {1\over2}(4n+D_n)(H_n+1).}               \tag{5}
\]

There is also an exact recurrence obstruction hidden in `D_n`.  For every
`n>=2`,

\[
 \boxed{
 D_n\ge
 {\left\{(n-1)b_n-2\sum_{k=1}^{n-1}b_k\right\}^2
  \over b_{n-1}b_n}.}                                     \tag{6}
\]

Thus the Gaussian ladder `b_n` proportional to `n` is exceptional: the
right side of (6) vanishes identically.  A quadratically regular ladder has
a compulsory quadratic reflection cost.  In the exact model `b_n=Cn^2`,

\[
 D_n\ge{(n+1)^2\over9}.                                   \tag{7}
\]

Equations (5)--(7) neither prove nor refute the actual theta payment.  They
show precisely why the Gaussian order mismatch cannot simply be transferred
to theta, and isolate the residual-level asymptotics that would decide the
theta route.  No finite-rung extrapolation, all-degree pivot sign, or RH
claim is made.

## 1. Exact endpoint payment

Under a positive divided prefix, the normalized modular limit gives

\[
 \kappa_{n,0}=4n+D_n.                                     \tag{8}
\]

Evenness of `psi` and the fixed parity of `F_n` give

\[
 Q_{n,0}^-
 =\int_0^\infty hF_n(h)^2\,dh
 ={1\over2}\int_{\mathbb R}|h|F_n(h)^2\,dh.               \tag{9}
\]

The strong endpoint payment is

\[
 \sigma_{n+1}\ge\kappa_{n,0}Q_{n,0}^-,
 \quad\hbox{equivalently}\quad
 b_{n+1}\ge\kappa_{n,0}{Q_{n,0}^-\over\sigma_n}.         \tag{10}
\]

Every quantity in (10) is determined by the current positive prefix and the
complete theta profile.  No next-pivot sign is used in defining the right
side.

## 2. Complete-theta parent localization

The frozen parent-growth theorem applies to every complex polynomial of
degree at most `n`, uniformly in all coefficients, at `a=lambda=0`.  Applied
to `F_n`, it gives

\[
 \|hF_n\|_2<(H_n+1)\|F_n\|_2.                            \tag{11}
\]

It also gives

\[
 \|h^2F_n\|_2<(H_n^2+1)\|F_n\|_2.
\]

Cauchy--Schwarz and (9) therefore imply the rigorous coefficient-uniform
bound

\[
 \boxed{
 Q_{n,0}^-<{H_n+1\over2}P_n.}                             \tag{12}
\]

Dividing the desired payment by `P_n` and using (12) proves the sufficient
condition (5).  Equivalently, substituting `P_n=sigma_n/c_n` into (10)
recovers the factorization `mathcal R_n=b_(n+1)c_n`.  This is the point at
which the theta profile differs qualitatively from the auxiliary Gaussian:
the spatial cost grows only logarithmically in degree before comparison with
the signed pivot.

The general root-deletion identity supplies a useful one-sided check.  With
real simple residual roots and quotient polynomials `q_j`,

\[
 \sigma_n
 =2\|hF_n\|_2^2-\sum_{j=1}^n\|q_j(-iD)\psi\|_2^2
 \le2\|hF_n\|_2^2.                                      \tag{13}
\]

Applied one rung later, the same identity gives the direct-source formula

\[
 \mathcal R_n=
 {2\|hF_{n+1}\|_2^2-
   \sum_{j=1}^{n+1}\|q_{n+1,j}(-iD)\psi\|_2^2
  \over P_n}.
\]

All polynomials here are fixed by the positive prefix through rung `n`; the
numerator is not divided by the unknown next pivot.  Since
`||hF_n||_2^2=<F_n,h^2F_n> <= ||F_n||_2||h^2F_n||_2`,
consequently

\[
 \boxed{0<c_n<2(H_n^2+1).}                                \tag{14}
\]

The upper order `log^2 n` is therefore available.  The missing estimate is a
matching lower source reserve for the one actual inverse-selected extension.
A lower bound on `c_n` is one possible factor of that reserve, but (4) shows
that the direct target is `mathcal R_n`.  Positive parent localization alone
cannot give either lower bound because the subtracted root-deletion sum in
(13) is signed against the leading term.

## 3. Exact leading component of the reflection derivative

The endpoint physical recurrence is

\[
 T_{j+1}(x)=xT_j(x)+b_jT_{j-1}(x).                         \tag{15}
\]

Since every `T_j` is monic,

\[
 T_j(x)=x^j+\left(\sum_{k=1}^{j-1}b_k\right)x^{j-2}
       +O(x^{j-4}).                                       \tag{16}
\]

Subtract the top derivative component:

\[
 R_n(x)=T_{n+1}'(x)-(n+1)T_n(x).                           \tag{17}
\]

It has degree at most `n-2`, the same parity as `n`, and its leading
coefficient is

\[
 \gamma_n=(n-1)b_n-2\sum_{k=1}^{n-1}b_k.                  \tag{18}
\]

Thus the coefficient of `T_(n-2)` in `R_n` is exactly `gamma_n`.  In the
pivot-normalized expansion (3),

\[
 d_{n,n-2}^2
 =\gamma_n^2{\sigma_{n-2}\over\sigma_n}
 ={\gamma_n^2\over b_{n-1}b_n}.                           \tag{19}
\]

Dropping the other nonnegative squared coefficients proves (6).

For `b_n=Cn`, equation (18) is zero.  For `b_n=Cn^2`,

\[
 \gamma_n={C\over3}n(n-1)(n+1),
 \qquad d_{n,n-2}^2={(n+1)^2\over9},                      \tag{20}
\]

which proves (7).  More generally, if `b_n=Cn^alpha(1+o(1))` is regularly
varying with `alpha>-1`, then the standard power-sum asymptotic gives

\[
 {\gamma_n^2\over b_{n-1}b_n}
 =\left({\alpha-1\over\alpha+1}\right)^2n^2(1+o(1))
 \quad(\alpha\ne1).                                      \tag{21}
\]

This is a lower bound on `D_n`, not an upper bound and not a theta
asymptotic.

## 4. A sharp theorem-shaped asymptotic target

Define

\[
 \rho_-:=\liminf_{n\to\infty}
 {\mathcal R_n\over n^2(H_n+1)},
 \qquad
 \delta_+:=\limsup_{n\to\infty}{D_n\over n^2}.             \tag{22}
\]

If complete-theta arithmetic proves

\[
 \boxed{\delta_+<\infty\quad\hbox{and}\quad
        2\rho_->\delta_+,}                                \tag{23}
\]

then (5) holds for every sufficiently large `n`, since `4n/n^2` tends to
zero.  This is the sharp strict asymptotic comparison furnished by the
parent bound.  A quantified version is `D_n<=D_+n^2` and
`mathcal R_n>=R_-n^2(H_n+1)` eventually, with `2R_->D_+`.

A factorization `b_(n+1)>=B_-n^2`,
`c_n>=C_-(H_n+1)` with `2B_-C_->D_+` would imply the quantified condition,
but is stronger than necessary: the direct reserve `mathcal R_n` is the
sharp noncircular source quantity.  Neither this theta-specific lower
conditioning asymptotic for `c_n` nor the upper `D_n=O(n^2)` bound is proved.

The still stronger scale `mathcal R_n` of order `n^2H_n^2` would
automatically satisfy (23) for finite `delta_+`.  The complete-theta
first-orbit saddle makes that scale plausible: a degree-`n` leading
derivative is concentrated where the spatial variable is of order `log n`,
and its raw signed source has an `h^2` factor.  This is only motivation.
Transferring that monomial saddle to the inverse-selected residual requires
uniform control of all actual coefficients and of the root-deletion
cancellation in (13); neither is currently proved.

## 5. What the existing large-order theorem does not supply

The audited `L1_GAUSSIAN_THEOREM.md` controls a normalized raw moment slice
and its Fourier transform with `L1` error `O(s_n)`.  It does not control the
smallest eigenvalue, inverse, or Schur complement of the growing endpoint
Hankel block.  Those operations can amplify entrywise or `L1` errors by the
condition number of the old block.  Therefore that theorem proves neither
finite rate in (22), and its Gaussian limit cannot be used to import
the auxiliary Gaussian payment failure.

Available exact identities likewise stop in the correct directions:

- parent growth proves (12) and the upper bound (14), but no lower
  `mathcal R_n` (and no lower `c_n`);
- the recurrence proves the lower bound (6), but no upper `D_n`;
- positivity of a finite prefix gives `b_j>0`, but no asymptotic lower bound
  on `b_(n+1)` or quadratic two-sided recurrence law.

This is the precise high-degree blocker.  A useful continuation is an
actual-theta proof of (23), or a counterexample to either finite-rate premise.
Increasing a finite rung cutoff cannot establish those asymptotics.

## Reproduction and provenance

The companion standard-library verifier binds the frozen parent-growth,
normalized-limit, general-pivot, large-order, and Gaussian-barrier sources.
It checks (16)--(20) for arbitrary positive rational recurrence data and the
exact linear/quadratic model simplifications.  It performs no quadrature and
no degree sweep intended as evidence for theta asymptotics.

Run it from the repository root:

```text
python3 research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/src/verify_modular_theta_high_degree_criterion_20261103.py \
  --root . \
  --output research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/results/modular_theta_high_degree_criterion_20261103.json
```

No result here proves an all-degree theta payment, a first Xi--Laguerre sign,
or RH.
