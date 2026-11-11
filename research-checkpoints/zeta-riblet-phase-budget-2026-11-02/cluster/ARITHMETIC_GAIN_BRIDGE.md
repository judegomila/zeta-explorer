# Arithmetic jump cancellation, adaptive filters, and the signed bridge

This continuation turns the integer jumps into an explicit inverse-filter residual and certifies a two-delay example without evaluating zeta. It also identifies the main shifted bridge as a signed quadratic form of the same causal source. The global gain inequality is not established. A separate corollary of discrete universality closes the previous fixed-degree loophole on the exact covering grid.

## A filter built from the integer jumps

Keep the notation of [the theta–Laguerre ladder](THETA_LAGUERRE_LADDER.md):
$$
s=\tfrac12+z,\quad z_0=d+ic,\quad a=d-ic,\quad
w=\frac{z-z_0}{z+a},\quad A_d=(2d)^{5/2},\quad
k_a(x)=\tfrac12x^2e^{-ax}.
$$
All time functions below vanish for $x<0$. Let
$$
D(s)=\sum_{n\le N}a_n n^{-s},\qquad
D(1)=\sum_{n\le N}\frac{a_n}{n}=0.                 \tag{1}
$$
The pole condition is essential. It makes both
$$
Q(z)=\frac{s}{s-1}D(s),\qquad
v(z)=U(z)Q(z)=\zeta(s)D(s)                         \tag{2}
$$
holomorphic at $s=1$, with $Q(1/2)=v(1/2)=D'(1)$.
In fact $Q$ is bounded and analytic in $\Re z>0$: away from $s=1$ this follows from a finite Dirichlet sum, and the remaining singularity is removable. This is the filter's stability statement; it does not assert that $v$ is zero-free.


The filter also has a finite causal realization. Write
$A_m^{\mathrm{cum}}=\sum_{n\le m}a_n/n$, and let $\delta_\ell$ denote a unit point mass at delay $\ell$. Then
$$
q_D=\sum_{n\le N}\frac{a_n}{\sqrt n}\delta_{\log n}
 +1_{[0,\log N)}(x)e^{x/2}A_{\lfloor e^x\rfloor}^{\mathrm{cum}}\,dx. \tag{2a}
$$
with the continuous term zero outside this interval. Its Laplace transform is $Q$. Indeed, the atoms give $D(s)$, and integrating the continuous part over the integer-log intervals telescopes to $D(s)/(s-1)$. The pole condition is exactly what eliminates the continuous response after $\log N$.

This gives an explicit finite set of delayed impulses plus a finite-duration distributed response. Its total variation is
$$
L_D=\sum_{n\le N}\frac{|a_n|}{\sqrt n}
 +2\sum_{m=1}^{N-1}(\sqrt{m+1}-\sqrt m)
                       |A_m^{\mathrm{cum}}|.
$$
For the full source $f$, its filtered response is $q_D*f$. For the previous finite-source approximation,
$\|q_D*(f-f_M)\|_2\le L_D\Delta_M$.
This gives a separate direct transfer bound for this arithmetic filter family.

Define the arithmetic step function and its causal residual by
$$
S_D(y)=\sum_{n\le N}a_n\lfloor y/n\rfloor,\qquad
r_D(x)=e^{-x/2}\bigl(S_D(e^x)-1\bigr).              \tag{3}
$$
The condition (1) gives $S_D(y)=-\sum a_n\{y/n\}$, so
$$
|r_D(x)|\le B_D e^{-x/2},\qquad B_D=1+\sum|a_n|.
$$
A smaller bound can be used when the exact residues are known. Integrating each counting step first in $\Re s>1$, then continuing analytically, gives
$$
\mathcal Lr_D(z)=\frac{\zeta(s)D(s)-1}{s}.
$$
Set $g_a=k_a'+\tfrac12k_a$. The actual error in our energy norm is exactly
$$
\boxed{\quad
\epsilon_D(d,c)=A_d\|g_a*r_D\|_2
 =\left[\int_{\mathbb R}K_d(t-c)
    |\zeta(\tfrac12+it)D(\tfrac12+it)-1|^2\,dt\right]^{1/2}.
\quad}                                                        \tag{4}
$$
Indeed $\mathcal Lg_a(z)=s/(z+a)^3$, and Plancherel with the previous normalization gives (4). The finite integer coefficients enter before taking the squared norm, so their cancellation is retained.

The familiar Möbius cancellation now has a precise role. For $N\ge2$, put
$$
M_N(s)=\sum_{n\le N}\mu(n)n^{-s},\quad
D_N(s)=M_N(s)-N M_N(1)N^{-s}.                     \tag{5}
$$
This has $D_N(1)=0$. The identity
$\sum_{n\le y}\mu(n)\lfloor y/n\rfloor=1$, for $y\ge1$, implies
$r_{D_N}(x)=0$ for $0\le x<\log N$.
The proof counts divisors of every integer at most $y$, using
$\sum_{n\mid k}\mu(n)=1_{k=1}$.
Thus the initial jump cancellation is exact. It supplies no small bound on the remaining infinite tail. In particular the factor $B_{D_N}$ can grow with $N$, and support moving to the right is not enough to conclude norm convergence.

## A sufficient signed residual bound

The target in (4) is the constant function $1$ before the outer smoothing. In disk coordinates set
$$
H_D(w)=(1-w)^2\bigl(v(z(w))-1\bigr).
$$
It has $H^2$ norm $\epsilon_D$. Since $\|(1-w)^2\|_{H^2}=\sqrt6$, evaluation at zero and the triangle inequality give
$$
|v(z_0)|\ge1-\epsilon_D,\qquad
\|(1-w)^2v(z(w))\|_{H^2}\le\sqrt6+\epsilon_D.
$$
Consequently, if
$$
\boxed{\quad\epsilon_D(d,c)<\frac3{10},\quad}       \tag{6}
$$
then $U(z_0)Q(z_0)\ne0$, and the normalized analytic filter
$p(w)=Q(z(w))/Q(z_0)$ satisfies
$$
R[p]\ge\frac{(1-\epsilon_D)^2}{(\sqrt6+\epsilon_D)^2}
  >\frac1{16}.
$$
For the last strict inequality use $\sqrt6<5/2$:
$(1-3/10)/(5/2+3/10)=1/4$.
The less rounded sufficient threshold is $(4-\sqrt6)/5$.

This also produces a finite Cayley-polynomial witness, although it gives no degree bound. First approximate the bounded analytic $p$ by $p(rw)$, $r\uparrow1$, in the norm $\|F(p(r\cdot)-p)\|_{H^2}$, using bounded convergence on the boundary. Then truncate its Taylor series, which converges uniformly on the closed unit disk for fixed $r<1$. Constant coefficients stay equal to one, and the strict margin survives.

Thus proving (6), with a finite $D$ allowed to depend on each covering-grid point, is a concrete sufficient route to the accumulated-gain target. Neither a universal cutoff nor a prescribed Möbius formula is asserted.

## A rigorous finite computation retaining the signed cancellation

For any integer cutoff $M\ge1$,
$$
\epsilon_D\le
 A_d\|g_a*(r_D1_{[0,\log M]})\|_2
 +\frac{A_d B_D}{\sqrt M}
 \left(\frac1{d^2}+\frac{|1/2-a|}{d^3}\right).       \tag{7}
$$
The omitted $r_D$ has norm at most $B_D/\sqrt M$.
Since
$g_a(x)=e^{-ax}[x+(1/2-a)x^2/2]$,
its $L^1$ norm is bounded by the factor in parentheses. Young's inequality proves (7). The first term keeps all arithmetic interference; only the omitted tail receives the absolute bound.

At the anchor $d=1/2,c=0$, choose the explicit two-term polynomial
$$
D(s)=\frac{13}{8}\bigl(1-2^{1-s}\bigr).             \tag{8}
$$
Here $g_a(x)=xe^{-x/2}$ and
$$
r_D(x)=e^{-x/2}
 \left[\frac{13}{8}\bigl(\lfloor e^x\rfloor\bmod2\bigr)-1\right].
$$
Its bracket is $5/8$ on odd integer intervals and $-1$ on even intervals, so $B_D=1$ is valid for every $x\ge0$.
With $M=4096$, outward 70-digit Decimal intervals give
$$
\|g_a*(r_D1_{[0,\log4096]})\|_2^2
  \in [0.05045375714146351802752,\,
       0.05045375714146351802753].
$$
The full recorded enclosure has 70-digit endpoints. In particular,
$$
\|g_a*(r_D1_{[0,\log4096]})\|_2<\frac{19}{80},
\qquad
\|g_a*(r_D1_{(\log4096,\infty)})\|_2\le\frac1{16}.
$$
Their sum is strictly below $3/10$, proving (6) and hence $R[p]>1/16$.

For reproducibility, write the finite convolution as $e^{-x/2}P(x)$.
On every interval $[\log k,\log(k+1))$,
$P''=13(k\bmod2)/8-1$, with $P(0)=P'(0)=0$.
Beyond $\log4096$, $P''=0$.
The integral of $e^{-x}P(x)^2$ is a finite sum of exponential-polynomial moments. No zeta evaluator, zero list, numerical quadrature, or floating matrix solve enters this certificate.

The signed smoothing is material. The unsmoothed residual has the exact norm
$$
\|r_D\|_2^2=1-\frac{39}{64}\log2> \frac12.
$$
Using only $\epsilon_D\le\|g_a\|_1\|r_D\|_2=4\|r_D\|_2$
would not prove (6). The certificate succeeds by integrating the signed residual before squaring.

In (2a), this example has the explicit signed measure $q_D=(13/8)[\delta_0-\sqrt2\,\delta_{\log2}+e^{x/2}1_{[0,\log2]}(x)\,dx]$.

The filter in (8) is a low-height example, not a new zero-verification range. It also has additional zeros at $s=1+2\pi i k/\log2$, $k\ne0$. It cannot serve at every anchor. Multiplying by a holomorphic filter preserves every original zeta zero; the exclusion argument constrains where those zeros could be.

Run **python3 cluster/check_arithmetic_gain.py** from this checkpoint. The [recorded output](arithmetic-gain.json) contains the interval certificate, 780 exact initial Möbius-cancellation checks, and the signed-operator control below.

## Where this meets existing Nyman–Beurling work

Changing variables $t=e^{-x}$ gives
$$
\|r_D\|_2^2=
 \int_0^1\left|1+\sum_{n\le N}a_n
                 \left\{\frac1{nt}\right\}\right|^2dt.
                                                               \tag{9}
$$
This is a pole-neutral Nyman–Beurling residual. Formula (4) applies an explicit smoothing operator to it, with parameters matching our local exclusion geometry. Small smoothed norm does not imply small unsmoothed norm.

The general fractional-part approximation route is classical and is already explored in the repository. The correspondence and the specific local certificate above do not establish a new RH criterion or an unconditional convergence rate for the classical distances. See [Báez-Duarte's strengthening](https://arxiv.org/pdf/math/0202141), particularly Theorem 1.1 and the discussion of the natural Möbius approximants. Its cited divergence statement concerns the natural uncorrected sequence in its specified Hilbert space; we do not infer divergence of (5) in our different smoothed norm.

Likewise [Bettin–Conrey–Farmer, Theorem 1](https://arxiv.org/pdf/1211.5191), obtains the optimal asymptotic for a smoothed Möbius choice under RH and an additional inverse-zeta-derivative moment hypothesis. That theorem cannot be used as an unconditional input here.

The existing [Nyman–Beurling module](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/math/nyman-beurling-completeness.js) contains numerical approximation experiments. For the present proof use the precise basis, pole constraint, norm, and tail in (1)–(9); those experiments are not a certificate for (6).

## Exact connection to the main signed bridge

Fix one causal anchor $(d,c)$, and let $f=f_{d,c}$ be the *full* source from the preceding note. Set
$$
G(z)=\frac12s^2\pi^{-s/2}\Gamma(s/2),\qquad
b(z)=G(z)\frac{(z+a)^3}{A_d},\qquad
v_z(x)=\overline{b(z)}e^{-\bar z x}.
$$
For $\Re z>0$, with inner products conjugate-linear in the first slot,
$$
X(z)=G(z)U(z)=\langle v_z,f\rangle,\qquad
\|v_z\|_2^2=\frac{|b(z)|^2}{2\Re z}.               \tag{10}
$$
This is a bounded evaluation identity at each interior point; it does not treat gamma decompletion as a bounded operator on the full boundary.

In half-plane coordinates the repository's shifted de Branges kernel is
$$
K_\eta(p,q)=
 \frac{X(q+\eta)\overline{X(p+\eta)}
       -X(q-\eta)\overline{X(p-\eta)}}
      {2\pi(q+\bar p)}.
$$
For $x=\Re q>\eta>0$, (10) gives the exact signed-source form
$$
K_\eta(q,q)=\langle f,\mathcal A_\eta(q)f\rangle,\qquad
\mathcal A_\eta(q)=
 \frac{v_{q+\eta}\otimes v_{q+\eta}
       -v_{q-\eta}\otimes v_{q-\eta}}{4\pi x}.      \tag{11}
$$
Here $(v\otimes v)h=v\langle v,h\rangle$.
The two exponential vectors are linearly independent, and $b$ has no zeros in this half-plane. On their two-dimensional span the product of the eigenvalues is
$$
-\frac{\|v_{q+\eta}\|^2\|v_{q-\eta}\|^2
            -|\langle v_{q+\eta},v_{q-\eta}\rangle|^2}
       {(4\pi x)^2}<0.                            \tag{12}
$$
Thus this source operator has one positive and one negative direction. Positivity for the particular arithmetic $f$ is the needed additional statement. It does not follow from causality, the Laguerre isometry, or positivity of the local filter Gram matrix. As an exact algebra control, the vectors $e^{-3x}$ and $e^{-x}$ have Gram determinant $1/48$; their rank-one difference has eigenvalue product $-1/48$. Nonzero completion factors and a positive denominator preserve the two signs.

For finitely many points with $\Re q_j>\eta$, the full kernel quadratic form likewise is
$$
\sum_{j,k}\bar c_j c_k K_\eta(q_j,q_k)
 =\frac1{2\pi}\int_0^\infty
 \left[
  \left|\sum_k c_k e^{-q_k t}\langle v_{q_k+\eta},f\rangle\right|^2
 -\left|\sum_k c_k e^{-q_k t}\langle v_{q_k-\eta},f\rangle\right|^2
 \right]dt.                                      \tag{13}
$$
This follows by integrating $e^{-(q_k+\bar q_j)t}$. It gives the signed operator identity, but no positive factorization. The displayed $L^2$ evaluation vectors require the stated interior domain. Arguments on or across its boundary require the complete theta representation or reflection and a separate limiting justification.

The previous finite-source approximation also transfers to (11) with an explicit error. If $\|f-f_N\|_2\le\Delta_N$, then
$$
\left|K_\eta(q,q)-\langle f_N,\mathcal A_\eta(q)f_N\rangle\right|
 \le \|\mathcal A_\eta(q)\|\Delta_N(2\|f_N\|_2+\Delta_N),
$$
where
$$
\|\mathcal A_\eta(q)\|\le
 \frac{\|v_{q+\eta}\|_2^2+\|v_{q-\eta}\|_2^2}{4\pi x}.
                                                               \tag{14}
$$
This makes a strict finite diagonal calculation transferable to the actual source. A small unsigned source error, by itself, supplies no positive margin.

The kernel convention agrees with the pinned [shift-bridge formulation](https://github.com/judegomila/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/data/shift-bridge-positivity-section.js). It is distinct from identifying the local positive Gram matrix with the main signed kernel.

## The fixed-degree obstruction holds on the exact grid

The earlier [arithmetic search note](ARITHMETIC_FILTER_SEARCH.md) left open whether the continuous-height finite-degree obstruction also occurs on its exact grid. Discrete universality settles this point.

**Corollary.** Fix $d=1/4$, any height offset $c_*$, any degree $m$, and any $\varepsilon>0$. A positive lower density of integers $k\ge1$ satisfies
$$
\mathcal R_m(1/4,c_*+k/8)<\varepsilon,
$$
while zeta is zero-free on the corresponding translated closed disk $|w|\le1/4$.

**Proof.** Reich's discrete universality theorem gives positive lower density along shifts $kh$, for every fixed $h>0$, for a nonvanishing analytic target on a compact set in $1/2<\Re s<1$ with connected complement. Use $h=1/8$ and translate the compact set by $ic_*$.
See [Sourmelidis, equation (1.3)](https://arxiv.org/pdf/2308.07031), which states this existing unconditional theorem. The conditional continuous-to-discrete implication later in that paper is not used.

Now apply the explicit target from the continuous-height proof: $r=1/4$, $L=m+1$, nodes $w_j=r e^{2\pi ij/L}$, and
$g(s)=\exp[-A(1-(w(s)/r)^L)]$, where this fixed target uses the Cayley coordinate centered at height $c_*$.
For every normalized polynomial of degree at most $m$, discrete averaging gives
$\max_j|p(w_j)|\ge1$. The target is $e^{-A}$ at the center, one at the nodes, and nonzero throughout the compact disk. Approximate it within $e^{-2A}/2$. At all sufficiently large selected grid heights,
$$
|F(0)|\le3e^{-A},\qquad
\min_j|F(w_j)|\ge(1-r)^2/4.
$$
Hardy evaluation therefore gives, uniformly over the coefficients,
$$
R[p]\le
 \frac{9e^{-2A}}{(1-r^2)(1-r)^4/16}
 =\frac{65536}{135}e^{-2A}.
$$
Choose $A$ large. The approximation also keeps zeta nonzero throughout the disk. This proves the corollary.

Accordingly no fixed maximum Cayley degree can pass every grid point, even with exact optimization. This does not preclude a finite degree at each individual point, nor give a lower growth rate for the degree as a function of height.


The same conclusion holds for every fixed arithmetic cutoff $N$ in (1), allowing arbitrary height-dependent coefficients satisfying the pole condition. On the fixed compact disk, translated Dirichlet sums remain in the finite-dimensional span of $n^{-s}$, $n\le N$. Choose nodes for which evaluation on this span is injective; norm equivalence bounds the central value by a constant times the largest node value. At large heights the common factor $s/(s-1)$ in $Q$ is uniformly bounded above and below. The target construction in the previous continuous-height proof, followed by discrete universality, makes the optimized normalized-filter ratio arbitrarily small on a positive-density set of grid indices. Restricting the coefficients by (1) cannot improve that optimum. A zero at the normalization point simply makes the unnormalized ratio zero.

Accordingly both Cayley degree and arithmetic cutoff must be allowed to grow in any complete search using these respective families. The result does not rule out a different infinite-dimensional construction.

## Remaining proof target

The arithmetic version is now: construct, at every covering-grid anchor, a finite coefficient vector satisfying (1) and (6), or prove the original local Schur-gain inequality by another use of the exact jumps. The finite certificate demonstrates that signed cancellation can establish the required margin. It supplies no theorem forcing that margin at all anchors.

For the main bridge route, (11)–(13) identify the signed quadratic form of the actual source that needs to be nonnegative. This identity closes a representation gap on the stated interior domain; its sign remains open. A complete global filter theorem would imply RH through the covering argument, after which bridge positivity follows from the established criterion. We do not use that implication as an assumption in either calculation.
