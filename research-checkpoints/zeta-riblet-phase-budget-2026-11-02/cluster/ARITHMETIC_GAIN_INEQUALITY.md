# A correlation inequality for arithmetic gain

Continuation, 11 November 2026. There is an unconditional lower bound for the improvement produced by any proposed arithmetic correction. It requires no inverse Gram matrix and retains signed cancellation before taking norms. At the difficult anchor $(d,c)=(1/2,1967+13/32)$, a complete interval calculation proves that this gain exceeds the actual repair deficit. The analogous arithmetic lower bound at every covering-grid anchor remains open.

The underlying line-minimization and Gram estimates are standard Hilbert-space algebra, not a new RH criterion. The contribution here is their explicit pole-neutral arithmetic form, full-boundary error bounds, and a checked instance of the required gain inequality. The local calculation is within known verification ranges.

## The inequality, with no zero-location premise

Fix an anchor $(d,c)$ and write
$$
 K_d(t-c)=\frac{16d^5}{\pi\{d^2+(t-c)^2\}^3},\qquad
 R_D(t)=1-\zeta(1/2+it)D(1/2+it).
$$
Both the current filter $D$ and a proposed nonzero correction $A$ are finite Dirichlet polynomials satisfying $D(1)=A(1)=0$. Define
$$
 E=\int_{\mathbb R}K_d|R_D|^2,\qquad
 V=\int_{\mathbb R}K_d|\zeta A|^2>0,\qquad
 C=\int_{\mathbb R}K_d\,\overline{\zeta A}\,R_D.
                                                               \tag{1}
$$
All functions in the integrals are evaluated on $s=1/2+it$. The full-boundary bounds below ensure integrability. The pole constraints also make the corresponding disk functions analytic at the zeta pole.

For any complex scalar $\alpha$, direct expansion gives
$$
 e_{D+\alpha A}=E-2\Re(\overline\alpha C)+|\alpha|^2V
 =E-\frac{|C|^2}{V}+V\left|\alpha-\frac CV\right|^2.
                                                               \tag{2}
$$
Consequently the exact best step is $\alpha=C/V$, and
$$
 \boxed{\quad E-e_{D+(C/V)A}=\frac{|C|^2}{V}.\quad}             \tag{3}
$$
If $e_M$ denotes the optimum over all pole-neutral filters with cutoff at most $M$, where $M$ contains the supports of $D$ and $A$, then
$$
 \boxed{\quad e_M\le E-\frac{|C|^2}{V}.\quad}                  \tag{4}
$$
This holds for an arbitrary current witness $D$, not just an exact optimum. It also holds at anchors where a hypothetical off-line zero would obstruct passing: in that case no correction can produce an impermissibly small residual.

For the covering threshold $q=15/16$, the usable arithmetic inequality is
$$
 \boxed{\quad |C|^2>(E-q)V.\quad}                              \tag{5}
$$
When $E\ge q$, (5) guarantees a passing next filter. If $E<q$, it already passes. Establishing (3)–(4) does **not** establish (5) for a suitable finite correction at every anchor. That existence and quantitative correlation estimate is the outstanding analytic task.

In words: the squared correlation of the remaining error with an available arithmetic correction must exceed the remaining error budget times the energy cost of that correction. A large correction norm by itself provides no progress.

## A block version and a practical preconditioner

Choose finitely many pole-neutral corrections $A_j$, set $\psi_j=\kappa\zeta A_j$ in the disk, and let $R=\kappa(1-\zeta D)$, where $\kappa(w)=(1-w)^2$. The disk inner products equal the integrals in (1). Put
$$
 V_j=\|\psi_j\|^2>0,\qquad C_j=\langle\psi_j,R\rangle,\qquad
 \Gamma_{jk}=\frac{\langle\psi_j,\psi_k\rangle}{\sqrt{V_jV_k}}.
$$
If $L\ge\lambda_{\max}(\Gamma)$, a finite correction in their span gives
$$
 \boxed{\quad e_M\le E-\frac1L\sum_j\frac{|C_j|^2}{V_j}.\quad} \tag{6}
$$
To prove this without inverting a matrix, use normalized modes $\psi_j/\sqrt{V_j}$ and coefficient vector $y/L$, where $y_j=C_j/\sqrt{V_j}$. The reduction is
$2\|y\|^2/L-y^*\Gamma y/L^2\ge\|y\|^2/L$.
Linear dependence among the corrections does not invalidate this proof.
Since $\Gamma$ is positive semidefinite with diagonal one, one may use
$$
 L=\min\left\{m,\ 1+\max_j\sum_{k\ne j}|\Gamma_{jk}|\right\},
                                                               \tag{7}
$$
for a block of $m$ modes, or any certified larger upper bound. For one mode, $L=1$ and (6) is the exact scalar reduction.

At an exact old optimum $D_N$, the residual is orthogonal to every old mode. Thus replacing a new mode by itself minus any combination of old modes leaves its correlation with that residual unchanged. An approximate orthogonalization can greatly reduce its norm before evaluating (6). It need not be exact: form the resulting finite polynomial first, then enclose its actual squared norm. This avoids subtracting two large interval Gram entries to estimate a small Schur complement.

For a current filter that is merely a numerical proposal, orthogonality must not be assumed. Formula (1) still computes the correct correlation for the chosen correction, so (2)–(6) remain valid. The numerical certificate below uses this safer version.

## What would make the inequality global

The [propagation theorem](FILTER_PROPAGATION.md) bounds the energy after moving an old witness to a new anchor. At that destination, compute (1) with the transported coefficients. If its energy has upper bound $E^+$, its correlation has a certified lower modulus $C^-$, and its correction energy has upper bound $V^+$, it suffices that
$$
 \frac{(C^-)^2}{V^+}>E^+-q.                                    \tag{8}
$$
This is a one-sided certificate for the missing repair step. All three integrals must be evaluated at the destination, including their tails.

Several smaller improvements can also suffice. With exact scalar steps, let $E_k$ be the successive energies and
$$
 \theta_k=\frac{|C_k|^2}{E_kV_k}\in[0,1]
$$
when $E_k>0$. Cauchy–Schwarz gives the interval $[0,1]$, and (2) gives
$$
 E_{k+1}=E_k(1-\theta_k).
$$
Starting with $D=0$, hence $E_0=6$, the finite accumulated condition is
$$
 \prod_{k<K}(1-\theta_k)<\frac5{32}.
                                                               \tag{9}
$$
Equivalently, when all $\theta_k<1$, the sum of $-\log(1-\theta_k)$ must exceed $\log(32/5)$. A step with $\theta_k=1$ already gives zero energy. Rounded steps must pay the explicit final term of (2), or be checked directly as below.

Positive gain at every stage alone does not ensure (9): the gains can be summable before the threshold is reached. A possible sufficient theorem would bound the gain below by $\eta_{d,c}(E-E_*)$ whenever $E\ge q$, with $E_*<q$ and $\eta_{d,c}>0$. The cutoff needed for each correction may depend on the anchor and the current residual. That theorem would force finite stopping at that anchor. It has not been proved here. A height-independent finite cutoff is already ruled out by the preceding universality argument.

No estimate for (5), (8), or (9) at all anchors follows just from positivity of the Gram matrices. As a precise control, take the Hardy-space dictionary $w,w^2,w^3,\ldots$ and target $\kappa=1-2w+w^2$. After fitting the first two modes, the residual is $1$, of energy one. It is orthogonal to every remaining mode, all future gains vanish, and the Gram matrix is the identity. Thus perfect conditioning is compatible with failure of the threshold $15/16$.

For the actual zeta dictionary, a hypothetical interior zero at disk coordinate $a$ supplies the same kind of obstruction: every $\kappa\zeta A$ vanishes at $a$. The reproducing kernel $k_a(w)=1/(1-\overline a w)$ is orthogonal to every correction, while
$\langle k_a,R\rangle=\kappa(a)$.
This forces
$$
 \|R\|^2\ge(1-|a|^2)|\kappa(a)|^2,
$$
exactly the earlier direct zero obstruction. An unconditional positive lower frame bound on **all** residual directions would assume away this possible component. Only a bound proved for the actual arithmetic residuals can close the argument.

Likewise, choosing an inverse correction through $1/\zeta$ and presuming it has the required analytic approximation would import the missing zero-free information. The classical natural fractional-part closure criterion is RH-equivalent: [Báez-Duarte, Theorem 1.1](https://arxiv.org/pdf/math/0202141). The sharp known smoothed Möbius asymptotic in [Bettin–Conrey–Farmer, Theorem 1](https://arxiv.org/pdf/1211.5191) assumes RH and an inverse-derivative moment hypothesis. Neither is used as an unconditional gain bound here.

## Complete tails for the correlation certificate

For $D(s)=\sum a_n n^{-s}$ and $A(s)=\sum b_n n^{-s}$, set
$$
 B_D=\sum\frac{|a_n|}{\sqrt n},\qquad
 B_A=\sum\frac{|b_n|}{\sqrt n}.
$$
For a window $|t-c|\le T$, use
$$
 J_0=\frac{32d^5}{5\pi T^5},\qquad
 J_1=\frac{8d^5}{\pi T^4},\qquad
 W=(1+|c|)J_0+J_1.
$$
These bound the omitted kernel mass and first absolute moment. The preceding unconditional estimate $|\zeta(1/2+it)|\le6\sqrt{1+|t|}$ yields
$$
 E_{\rm tail}\le72B_D^2W+2J_0,\qquad
 V_{\rm tail}\le36B_A^2W,                                     \tag{10}
$$
$$
 |C_{\rm tail}|\le
 3B_A\{(2+|c|)J_0+J_1\}+36B_AB_DW.                           \tag{11}
$$
For (11), use
$|\overline{\zeta A}(1-\zeta D)|\le B_A|\zeta|+B_AB_D|\zeta|^2$
and $6\sqrt{1+|t|}\le3(2+|t|)$. Only the omitted tail is estimated absolutely. The finite-window correlation retains its complex sign and cancellation.

## A verified gain that exceeds the deficit

At the exact anchor $(d,c)=(1/2,62957/32)$, a scalar midpoint fit proposes the pole-neutral dyadic current filter
$$
 D(s)=a_1+a_2\,2^{-s},\quad
 a_1=-\frac{478747}{16777216}-\frac{867101}{8388608}i,\quad
 a_2=\frac{478747}{8388608}+\frac{867101}{4194304}i.
$$
Choose a correction that approximately removes the old direction from the new integer-three mode:
$$
 A(s)=b_1+b_2\,2^{-s}+3\,3^{-s},
$$
$$
 b_1=\frac{16645}{131072}+\frac{2003049}{2097152}i,\qquad
 b_2=-\frac{147717}{65536}-\frac{2003049}{1048576}i.
$$
Both pole constraints hold exactly. The interval checker proves, with endpoints rounded outward here,

| Quantity | Certified enclosure or bound |
|---|---:|
| Current energy $E$ | $[4.071953,\ 4.078670]$ |
| $\Re C$ | $[-2.288154,\ -2.246144]$ |
| $\Im C$ | $[-8.410873,\ -8.366057]$ |
| Correction energy $V$ | $[22.751837,\ 22.923047]$ |
| Gain $|C|^2/V$ | At least $3.273390$ |
| Required gain $E-q$ | At most $3.141170$ |
| Energy after the exact best scalar step | At most $0.805280<15/16$ |

The certified margin in (8) is greater than $0.132220$. Thus this is a checked instance of the gain inequality itself, not just a positive correlation or a candidate produced by an unconstrained solve.

For an explicitly represented filter, take the nearby dyadic scalar
$$
 \alpha=-\frac{832765}{8388608}-\frac{770309}{2097152}i.
$$
The checker separately integrates the exact polynomial $D+\alpha A$ and obtains energy below $0.774090$. The stronger direct upper bound is consistent with the weaker bound from separately enclosing $E$, $C$, and $V$. No assertion that the fitted current filter is exactly optimal is required.

## Reproduction and scope

Run from this checkpoint:
```sh
OPENBLAS_NUM_THREADS=1 python3 cluster/certify_gain_inequality.py
```
The [checker](certify_gain_inequality.py) uses NumPy and IEEE binary64 with gradual underflow. It refines the preceding complete Euler–Maclaurin source to $524288$ bins of width $1/8192$ on $|t-c|\le32$, with $1024$ Dirichlet terms, eight Bernoulli corrections, and degree-16 height jets. The anchor is exact, with **zero height jitter**; this new gain certificate is not asserted uniformly on the earlier height band.

The source remainder bounds are the same as in the growing-filter checker and remain valid on this smaller window. The polynomial variation enclosure uses the refined half-bin width. Equations (10)–(11) cover the entire omitted boundary; the largest omitted contribution is the correction-energy bound, below $0.003141$. Approximate fits and orthogonalization only propose exact rational coefficients. The final certificate encloses the actual integrals of those coefficients.

[Recorded output](gain-inequality.json) contains every coefficient, interval endpoint, tail, and the checked complex line-minimization and common-zero controls. The general inequality is proved algebraically above; numerical verification supports only the stated anchor. The remaining global task is a non-circular arithmetic lower bound on the correlations sufficient to force the finite reduction budget at every covering-grid point.
