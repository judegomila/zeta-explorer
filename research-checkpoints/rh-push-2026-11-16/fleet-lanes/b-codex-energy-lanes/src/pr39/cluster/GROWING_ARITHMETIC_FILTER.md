# Growing arithmetic filters and a sharper direct zero test

The arithmetic residual can be tested directly against a hypothetical zero. This removes the loss from first converting the residual to the earlier ratio certificate. On the existing covering grid, the sufficient residual-energy threshold improves from $9/100$ to $15/16$. A growing arithmetic search passes at every scale on the established band near height $1967.40625$, with interval arithmetic and a complete boundary tail.

The all-height stopping theorem is still open. The following improves the test and its implementation; it does not supply a global convergence rate or a new zero-verification height.

## Direct evaluation at a zero

Use the pole-neutral polynomial and residual from [the arithmetic bridge note](ARITHMETIC_GAIN_BRIDGE.md):
$$
D(s)=\sum_{n\le N}a_n n^{-s},\quad D(1)=0,\qquad
H_D(w)=(1-w)^2\{\zeta(s(w))D(s(w))-1\},
$$
$$
s(w)=\frac12+ic+d\frac{1+w}{1-w},\qquad
\epsilon_D(d,c)^2=\|H_D\|_{H^2}^2.
$$
The pole condition makes $\zeta D$ holomorphic at $s=1$. The preceding bounded-filter representation gives $H_D\in H^2$ without a zero-free assumption.

Suppose $\zeta(1/2+b+i\gamma)=0$ with $b>0$. Its disk coordinate is
$$
w_\rho=\frac{b-d+i(\gamma-c)}{b+d+i(\gamma-c)}.
$$
Since a finite Dirichlet polynomial is entire,
$H_D(w_\rho)=-(1-w_\rho)^2$.
Hardy evaluation therefore proves the unconditional obstruction
$$
\boxed{\quad
\epsilon_D(d,c)^2\ge
 (1-|w_\rho|^2)|1-w_\rho|^4
 =\frac{64d^5b}{\{(b+d)^2+(\gamma-c)^2\}^3}.
\quad}                                                        \tag{1}
$$
Multiplicity does not weaken this inequality. No value of $D$ at the anchor, reciprocal zeta, or normalization of the filter is needed.

For a certified upper bound $E$, formula (1) excludes every right-hand zero for which the displayed expression is strictly larger than $E$. This is a direct residual certificate. It does not assert the earlier ratio $R[p]>1/16$.

## Covering the strip with a larger energy budget

Retain the predetermined grid
$$
d_j=2^{-j},\qquad c_{j,k}=c_*+k d_j/2,\qquad
j\ge1,\quad k\in\mathbb Z.
$$
Given any hypothetical zero with $0<b\le1/2$, choose a dyadic $d$ with
$$
\frac12\le r=\frac bd\le1.
$$
Such a scale exists because one can choose the smallest member of
$\{1/2,1/4,\ldots\}$ which is at least $b$. Choose the nearest height grid point, so $|u|=|\gamma-c|/d\le1/4$.

On this rectangle,
$$
\frac{64r}{\{(1+r)^2+u^2\}^3}
 \ge \frac{64}{(4+1/16)^3}
 =\frac{262144}{274625}
 >\frac{15}{16}.                                    \tag{2}
$$
For proof, the expression decreases with $u^2$. Its derivative in $r$ has the sign of
$1-4r-5r^2+u^2$, which is negative throughout $1/2\le r\le1$, $u^2\le1/16$. The minimum is at $r=1,u^2=1/16$.

Thus the following arithmetic statement is sufficient for RH:
$$
\boxed{\quad
\text{At every grid point there is a finite }D,\ D(1)=0,
\quad \epsilon_D(d_j,c_{j,k})^2<15/16.
\quad}                                                        \tag{3}
$$
At one anchor, this certificate excludes the closed cell
$$
d/2\le b\le d,\qquad |\gamma-c|\le d/4.
$$
These cells cover the right half of the critical strip; functional symmetry handles the left half.

The older sufficient condition $\epsilon_D<3/10$ pays for separate bounds on an anchor numerator and a norm. Direct evaluation avoids that intermediate step. The new energy allowance is $125/12$, approximately $10.42$, times as large. This factor concerns the sufficient numerical energy budget, not a rate of progress toward proving RH.


The evaluation constant in (1) is sharp for the ambient Hardy-space problem. For any $a$ in the unit disk, set
$$
H_a(w)=-\frac{(1-a)^2(1-|a|^2)}{1-\bar a w},\qquad
v_a(w)=1+\frac{H_a(w)}{(1-w)^2}.
$$
Then $v_a(a)=0$ and $\|H_a\|^2=(1-|a|^2)|1-a|^4$ exactly. At the corner $b=d$, $\gamma-c=d/4$, one has $a=(1+8i)/65$ and this energy is $(64/65)^3=262144/274625$. This is an analytic model showing sharpness of the evaluation step, not an arithmetic zeta counterexample.

## A nested arithmetic search and the precise gain target

Use the nested pole-neutral basis
$$
D_n(s)=n^{-s}-1/n,\qquad n=2,3,\ldots,
\qquad \phi_n(w)=(1-w)^2\zeta(s(w))D_n(s(w)).
$$
Every polynomial supported on integers at most $N$ with $D(1)=0$ lies in this span. With $\kappa(w)=(1-w)^2$, define
$$
G_{mn}=\langle\phi_m,\phi_n\rangle,\qquad
h_m=\langle\phi_m,\kappa\rangle.
$$
The Gram matrix is positive definite: a zero linear combination would give an identically zero finite Dirichlet polynomial, whose coefficients are independent. The minimum residual energy is
$$
e_N(d,c)=6-h^*G^{-1}h.                              \tag{4}
$$
All entries are integrals of explicit arithmetic functions on the critical line. The initial value is $e_1=6$, corresponding to the zero polynomial.

Let $r_n$ be $\phi_n$ after orthogonal projection away from the preceding span, and set
$\delta_n=\|r_n\|^2>0$, $g_n=\langle r_n,\kappa\rangle$.
Then
$$
e_N=6-\sum_{n=2}^N\frac{|g_n|^2}{\delta_n}.
$$
The precise sufficient gain inequality is consequently
$$
\boxed{\qquad
\sum_{n=2}^N\frac{|g_n(d,c)|^2}{\delta_n(d,c)}
 >\frac{81}{16}.
\qquad}                                                       \tag{5}
$$
Adding a basis element cannot increase the exact optimum. This monotonicity does not imply that (5) will be reached. The [discrete-universality obstruction](ARITHMETIC_GAIN_BRIDGE.md#the-fixed-degree-obstruction-holds-on-the-exact-grid) rules out one fixed arithmetic cutoff for all grid points.

A useful proposal rule is least squares with a coefficient penalty suggested by the tail estimate below. The actual checker rounds $a_n/n$ to exact complex dyadics for $n\ge2$ and sets $a_1=-\sum_{n\ge2}a_n/n$. It then verifies the exact polynomial with interval arithmetic. Floating-point least squares supplies no part of the certificate.

## An explicit boundary window for each candidate

There is an elementary unconditional estimate
$$
|\zeta(1/2+it)|\le6\sqrt{1+|t|}\qquad(t\in\mathbb R). \tag{6}
$$
For completeness, Euler summation at an integer $M\ge1$ gives
$$
\zeta(s)=\sum_{n\le M}n^{-s}
 +\frac{M^{1-s}}{s-1}
 -s\int_M^\infty\{x\}x^{-s-1}\,dx.
$$
At $\Re s=1/2$, the three terms have bounds
$2\sqrt M$, $\sqrt M/|s-1|$, and $2|s|/\sqrt M$.
For $|t|\ge1$ take $M=\lceil|t|\rceil$. They are bounded by
$2\sqrt{|t|+1}$, $\sqrt{|t|+1}$, and $\sqrt5\sqrt{|t|}$ respectively, whose sum is less than the right side of (6).
For $|t|\le1$ take $M=1$: the sharper sum bound $1$, together with $2+\sqrt5$, is less than $6$.

Let
$$
B=\sum_{n\le N}\frac{|a_n|}{\sqrt n},\qquad
J_0=\frac{32d^5}{5\pi V^5},\qquad
J_1=\frac{8d^5}{\pi V^4}.
$$
For the complete omitted height region $|t-c|>V$,
$$
\int_{|t-c|>V}K_d(t-c)|\zeta(s)D(s)-1|^2\,dt
 \le [72B^2(1+|c|)+2]J_0+72B^2J_1.                \tag{7}
$$
This follows from $|D(1/2+it)|\le B$,
$|\zeta D-1|^2\le2|\zeta D|^2+2$, and
$K_d(v)\le16d^5/(\pi v^6)$.
For a height band replace $|c|$ by an upper bound throughout that band.

This yields a concrete window schedule for any desired tail budget $\tau>0$.
Put
$$
C_0=\frac{32d^5}{5\pi}[72B^2(1+|c|)+2],
\qquad C_1=\frac{576d^5B^2}{\pi}.
$$
Choosing
$$
V\ge\max\left\{(2C_0/\tau)^{1/5},
                    (2C_1/\tau)^{1/4}\right\}                 \tag{8}
$$
makes the omitted energy at most $\tau$. Thus coefficient growth is paid explicitly. Enlarging $N$ while retaining an inadequate fixed tail cutoff is not a valid search.

For proposals, $B^2\le N\sum |a_n|^2/n$ gives a quadratic penalty. The implementation uses this to discourage large coefficients before it applies the sharper actual $B$ bound in the interval check. The penalty is a numerical proposal choice and does not prove (5).

## Certified results on the difficult band

The checker certifies every
$$
|c-(1967+13/32)|\le1/4096
$$
and the following scales. Entries are conservative rounded displays of outward bounds.

| Scale $d$ | Selected arithmetic cutoff $N$ | Residual energy upper bound |
|---|---:|---:|
| $1/2$ | 3 | 0.8593 |
| $1/4$ | 3 | 0.1842 |
| $1/8$ | 2 | 0.6234 |
| $1/16$ | 2 | 0.1787 |
| $1/32$ | 2 | 0.0513 |
| $1/64$ | 2 | 0.0164 |
| $1/128$ | 2 | 0.0065 |
| $1/256$ | 2 | 0.0036 |
| Every $0<d\le1/256$, one fixed filter | 2 | 0.1305 |

Every upper bound is below $15/16=0.9375$.
At $d=1/2$, the exact selected coefficients are
$$
\begin{aligned}
a_1&=\frac{1298995}{4194304}
       -i\frac{4107673}{16777216},\\
a_2&=-\frac{3530321}{8388608}
       +i\frac{160477}{131072},\\
a_3&=-\frac{4996977}{16777216}
       -i\frac{18488565}{16777216}.
\end{aligned}
$$
They obey $a_1+a_2/2+a_3/3=0$ exactly.

There is also a rigorous lower-cutoff obstruction on this band. Every pole-neutral polynomial with cutoff at most two is a scalar multiple of $1-2^{1-s}$. On the finite boundary window alone its best residual energy is
$$
m-\frac{|b|^2}{g},
\quad
m=\int K_d,\quad b=\int K_d\,\overline{\zeta(s)(1-2^{1-s})},
\quad g=\int K_d|\zeta(s)(1-2^{1-s})|^2.
$$
Here all three integrals are restricted to the finite window. The full energy is at least this finite-window optimum. Outward intervals put it above $3.9399$ at $d=1/2$, uniformly on the band. Thus cutoff three is necessary and sufficient there for threshold (3), even with arbitrary complex two-term coefficients.

The conclusion is full-strip zero exclusion on this finite height band, obtained from the new arithmetic residual tests. This region was already inside known verification ranges and was previously certified in this checkpoint by different filters.

## What the implementation encloses

Run **OPENBLAS_NUM_THREADS=1 python3 cluster/certify_growing_arithmetic.py** from the checkpoint. It requires NumPy and IEEE binary64 with gradual underflow.

The source window is $|t-c|\le64$ and the integration-bin width is $1/512$. The zeta enclosure includes the pole term, half endpoint, eight Bernoulli corrections, and the periodic Bernoulli remainder, with $1024$ Dirichlet terms. In this domain $|s+j|<2048$ for $0\le j\le15$, so the complete remainder is at most
$$
\frac{4\sqrt{1024}}{15}
 \left(\frac{2048}{6\cdot1024}\right)^{16}
 <1.983\times10^{-7}.
$$
Powers are enclosed by the preceding scale-and-square interval exponential. Degree-16 height jets cover each half-unit block, including the full height jitter. Their Dirichlet-sum remainder is at most
$64\cdot2^{17}/17!<2.359\times10^{-8}$.
The endpoint power has its separate smaller remainder.
The arithmetic polynomial is enclosed at each bin center and widened by
$(\text{half bin width}+\text{height jitter})\sum |a_n|n^{-1/2}\log n$.
All omitted boundary values receive (7).

For the continuum of small scales, use the final fixed two-term $D$ and let $M(v)$ be the enclosed squared residual. On $|v|\le1/32$ the kernel's total mass gives the bound $6\sup M(v)$. Outside this interval,
$$
\partial_d K_d(v)\ \text{has the sign of }5v^2-d^2,
$$
so $K_d(v)\le K_{1/256}(v)$ for every $0<d\le1/256$.
Integrating the actual enclosed residual with this largest-scale kernel on the outer finite bins, then adding (7), gives the final row of the table. This retains the measured arithmetic cancellations in the outer bins; a single absolute zeta bound near the center is too coarse.

The [recorded output](growing-arithmetic.json) includes exact coefficients, every attempted cutoff, the lower-cutoff obstruction, the continuous small-scale estimate, and 27 exact rational checks of the zero-evaluation geometry. Numerical proposals are separated from interval verification. These are internal arithmetic checks, not independent external review or formalization.

## What remains at unbounded height

One can make the search exhaustive by refining the coefficient denominators and bounds, integration mesh, Euler–Maclaurin enclosure, and the window chosen by (8), while revisiting every fixed finite cutoff. The pole-neutral dyadic coefficient vectors are dense in each finite coefficient space. Strict inequalities persist under small coefficient perturbations, so an existing strict witness will eventually be certified by such a schedule. The implemented cutoff cap of sixteen and fixed source domain are only the bounds for the experiment above.

The classical Nyman–Beurling–Báez-Duarte theorem explains why an unconditional convergence argument remains difficult. Under RH, natural fractional-part combinations approximate $-\chi_{(0,1)}$ in $L^2(0,\infty)$. Their coefficient sum $D(1)$ tends to zero, since on $t>1$ their value is $D(1)/t$. Subtracting $D(1)\{1/t\}$ enforces the pole constraint at an additional norm cost tending to zero. The resulting pole-neutral residuals $r_D$ therefore have $\|r_D\|_2\to0$. The bounded convolution operator in the preceding note then gives $\epsilon_D(d,c)\to0$ at every fixed anchor.

Conversely, if $\epsilon_D(d,c)\to0$ at any fixed anchor, (1) rules out each right-hand zero. Thus convergence to zero at even one anchor is already RH-equivalent; it cannot be used as an unconditional premise. See [Báez-Duarte, Theorem 1.1](https://arxiv.org/pdf/math/0202141). The sharper known rate for a specific smoothed Möbius polynomial in [Bettin–Conrey–Farmer, Theorem 1](https://arxiv.org/pdf/1211.5191) assumes RH and an additional derivative-moment hypothesis.

At the weaker fixed threshold (3), termination on the entire grid is also equivalent to RH: sufficiency is (1)–(2), and RH supplies convergence at each grid point as just explained. The outstanding analytic task is a non-circular lower bound on the accumulated arithmetic gain (5), with a finite cutoff allowed to depend on height and scale. Equations (7)–(8) settle how to pay for the boundary tail once a candidate is chosen; they do not supply that gain.

## Moving the certificates

[The propagation continuation](FILTER_PROPAGATION.md) gives an exact kernel comparison between arbitrary anchors, translates its movement cost into a sufficient arithmetic-gain budget, and proves two necessary restrictions on a global bound. It widens the certified height half-width from $1/4096$ to $1/128$, including the continuum of small scales. The gain needed to repeat this at every height remains unproved.
