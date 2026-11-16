# Freezing stress test: finite packets versus unrestricted mode count

## Scope and conclusions

The boundary-flux kernel in this note is

$$
K_\tau(u,v)=2\int_{|(u+v)/2|}^{\infty}
t\,\kappa_\tau(t+(u-v)/2)\kappa_\tau(t-(u-v)/2)\,dt,
$$

with the prescribed normalization
$$
\kappa_\tau(u)=e^{\tau u^2/16}\kappa(u),\qquad
\kappa(u)=\sum_{n\ge1}
(2\pi^2n^4 e^{9u/4}-3\pi n^2 e^{5u/4})e^{-\pi n^2e^u}.
$$
The kernel is extended evenly as in the theta construction. All numerical
evaluations here have positive endpoints, so the displayed positive-coordinate
series suffices.

**Rigorous result:** the finite-radius leading kernel
$$
M(u,v)=\frac{u+v}{e^u+e^v}
$$
is indefinite on every positive half-line once arbitrary packet size or
confluent order is allowed. A particularly short three-point counterexample
lies entirely in $u>1$. Exact rational verification is provided in
`verify_freezing_obstruction.py` and `freezing_obstruction_validation.json`.

**Numerical result:** the actual theta flux, after positive diagonal scaling,
repairs every particular leading-model negative direction tested here. These
are checks of selected quadratic forms, not proofs that a whole Gram matrix
or the infinite kernel is positive semidefinite.

The actual-kernel computations use a finite theta sum and arbitrary-precision
quadrature. They are **nonrigorous numerical diagnostics**, not interval
certificates, and do not establish any new bound on the Newman constant.

## 1. An explicit three-point counterexample

Set
$$
L=\frac54,\quad d=\log\frac{11}{9},\quad
(p_1,p_2,p_3)=(L-d,L,L+d),\quad c=(50,-99,50)^T.
$$
The identity
$$
e^L c^TMc=\frac{29999}{9999}L-\frac{1990}{99}d
$$
is checked using rational arithmetic, treating $d$ symbolically.
The positive power series for $2\operatorname{atanh}(1/10)$ gives
$$
\frac15<d<\frac{20}{99}<\frac14.
$$
Consequently all points satisfy
$$
p_i\ge p_1>\frac54-\frac{20}{99}=\frac{415}{396}>1,
$$
whereas
$$
e^L c^TMc<\frac{29999}{9999}\frac54-
\frac{1990}{99}\frac15=-\frac{3599}{13332}<0.
$$
For orientation only, the quadratic form is approximately
$-0.0812051007345807$. Its negativity does not depend on floating-point
arithmetic.

## 2. Arbitrarily far out: an exact confluent witness

This auxiliary Cayley coordinate is used only to calculate Taylor jets of the
boundary kernel; it is distinct from the global torus coordinate.
Put
$$
x=e^u=e^L\frac{1+\zeta}{1-\zeta},\qquad
g(\zeta)=u=L+2\operatorname{atanh}\zeta.
$$
After a nonzero diagonal analytic congruence, the leading kernel becomes
$$
G_M(\zeta,\eta)=
\frac{g(\zeta)+g(\eta)}{1-\zeta\eta}.
$$
Its Taylor coefficient matrix, with indices $0\le j,k<N$, is
$$
(A_N)_{jk}=\begin{cases}
2L,&j=k,\\
2/|j-k|,&|j-k|\text{ odd},\\
0,&|j-k|>0\text{ even}.
\end{cases}
$$
For $v_j=(-1)^j$,
$$
v^TA_Nv=2LN-4\sum_{\substack{1\le d<N\\d\text{ odd}}}\frac{N-d}{d}.
$$
The alternating harmonic sum diverges, so this is negative for sufficiently
large $N$, for every fixed finite $L$. A negative Taylor Gram matrix is a
limit of congruences of finite real-point Gram matrices. Therefore there are
finite-point counterexamples in every sufficiently small neighborhood of the
chosen center $L$. Choosing $L>R$ proves the obstruction on $(R,\infty)$.

Exact examples:

| Center $L$ | Number of Taylor coefficients $N$ | Exact quadratic form |
|---:|---:|---:|
| 1 | 3 | $-2$ |
| 2 | 6 | $-4/5$ |
| 3 | 16 | $-62848/45045$ |
| 4 | 42 | $-222535265680372/325982425207725$ |

As $N\to\infty$, the quadratic form divided by $N$ is
$$
2L-2\log N-2\gamma-2\log2+2+o(1).
$$
Thus these witnesses occur at mode count of order $e^L$. This is precisely
the dependence that a fixed finite-packet large-radius theorem does not
control.

## 3. Stable evaluation of the actual theta flux

For positive $u,v$, put $r=(u+v)/2$ and $t=r+\ell$. Define the positive
diagonal rescaling
$$
F_\tau(u,v)=\frac{\pi K_\tau(u,v)}{\kappa_\tau(u)\kappa_\tau(v)}.
$$
Then exactly
$$
F_\tau(u,v)=2\pi\int_0^\infty
(r+\ell)\frac{\kappa_\tau(u+\ell)}{\kappa_\tau(u)}
\frac{\kappa_\tau(v+\ell)}{\kappa_\tau(v)}\,d\ell.
$$
Its leading endpoint approximation is $M(u,v)$. Keeping the ratio inside
the integral avoids the extremely small raw values of $\kappa$.

Factor
$$
\kappa(u)=2\pi^2e^{9u/4-\pi e^u}B(u),\qquad
B(u)=\sum_{n\ge1}
\left(n^4-\frac{3n^2e^{-u}}{2\pi}\right)
e^{-\pi(n^2-1)e^u}.
$$
For point evaluations the substitution
$y=\pi(e^u+e^v)(e^\ell-1)$ extracts the dominant $e^{-y}$ decay.

For confluent evaluations set
$$
A=2\pi e^L,\qquad \ell=\log(1+y/A),\qquad
u(\zeta)=L+2\operatorname{atanh}\zeta,
$$
and define
$$
f_y(\zeta)=\frac{e^{9\ell/4}}{1-\zeta}
\exp\!\left[-\frac{y\zeta}{1-\zeta}
+\frac{\tau(2u(\zeta)\ell+\ell^2)}{16}\right]
\frac{B(u(\zeta)+\ell)}{B(u(\zeta))}.
$$
If $T_Nh=\sum_{j=0}^{N-1}(-1)^j[\zeta^j]h$, the transformed actual
quadratic form is exactly
$$
Q_\tau=2\int_0^\infty
\frac{e^{-y}}{1+y/A}
\left(T_N[u f_y]+\ell T_N[f_y]\right)T_N[f_y]\,dy.
$$
The code calculates Taylor coefficients by truncated power-series recurrences
and integrates this scalar expression. It does not infer signs from tiny
double-precision eigenvalues or subtraction of nearly identical matrix rows.

## 4. Selected actual-kernel diagnostics

| $L$ | $N$ | Heat parameter $\tau$ | Leading quadratic form | Actual transformed form, numerical |
|---:|---:|---:|---:|---:|
| 1 | 3 | 0 | -2 | 4.961536034754730 |
| 2 | 6 | 0 | -0.8 | 13.43796266243868 |
| 3 | 16 | 0 | -1.395226995226995 | 42.51598270344840 |
| 4 | 42 | 0 | -0.682660316851641 | 120.4980182637363 |
| 2 | 6 | -1 | -0.8 | 12.48533572486753 |
| 2 | 6 | +1 | -0.8 | 14.49317453345805 |

The $L=2,N=6,\tau=0$ calculation agrees at 50 and 80 digits with four and
six theta terms through all 40 displayed digits in the stored results.
Agreement under these changes is numerical validation, not an interval error
bound.

For the fixed order $N=6$, the difference between actual and leading forms
decreases in the examined range:

| $L$ | Leading form | Actual form | Difference |
|---:|---:|---:|---:|
| 2 | -0.8 | 13.43796266244 | 14.23796266244 |
| 4 | 23.2 | 26.98010706440 | 3.78010706440 |
| 6 | 47.2 | 48.04324474890 | 0.84324474890 |

The high-order rows show why this fixed-order behavior cannot justify dropping
the correction in the difficult modes. These finite calculations do not by
themselves prove an asymptotic theorem about relative quadratic-form
convergence of the exact theta kernel.

The separate `numerics_finite_point_results.json` records the actual flux on
the same explicit three-point packet from Section 1, using the displayed
diagonal scaling. This independently checks the source correction without
using Taylor jets. At $\tau=0$, it gives
$$
c^TMc\approx-0.08120510073458039474002268813608392331,
$$
whereas
$$
c^TF_0c\approx+0.78398229158697563446515663922415335907.
$$
Runs at 60 and 80 decimal digits, with five and seven theta terms respectively,
agree through the 45 significant digits stored in the diagnostic output.

## Reproduction and evidence

```sh
python verify_freezing_obstruction.py --output freezing_obstruction_validation.json
python numerics.py --L 2 --N 6 --dps 80 --theta-terms 6
python numerics.py --finite-packet --tau 0 --dps 60 --theta-terms 5 --output finite_packet_reproduction.json
```

The `--finite-packet` command reproduces the $L=5/4$,
$d=\log(11/9)$, $c=(50,-99,50)$ calculation directly. It accepts the
same heat parameter, precision, theta-sum cutoff, and output options as the
confluent calculation. Its output remains a non-interval numerical diagnostic.

`numerics_stress_results.json`, `numerics_mode_growth_results.json`, and
`numerics_finite_point_results.json` record all substantial diagnostic runs.
The standard-library exact verifier is the rigorous part of this package.
The theta integrals and their signs remain non-certified numerical evidence.
