# Rational residuals, reflection energy, and the limit of a finite zero head

Research note, 9 November 2026. This derives an exact rational-feature
description of the xi Pick energy. It proves the precise rank and
nullspace of every finite verified real-zero head, identifies the remaining
tail-coupling condition, and gives a conditional construction of a finite
negative test if an off-axis zero exists. It does not identify such a
zero, prove RH, or claim a new RH-equivalence criterion.

## 1. Setup and exact zero features

Use

$$
F(z)=\xi(1/2+z),\qquad L=F'/F,
\qquad
P_L(x,y)=\frac{L(x)+L(y)}{x+y}.
\tag{1.1}
$$

Let $\mathcal Z$ be the multiset of centered xi zeros
$\rho=\beta+i\gamma$, including both signs and multiplicities.
The classical strip gives $|\beta|<1/2$, and the multiset is invariant
under negation and conjugation. There are no real zeros. Its paired
Hadamard product gives the locally absolutely convergent expansion

$$
L(z)=\sum_{\substack{\rho\in\mathcal Z\\\Im\rho>0}}
\frac{2z}{z^2-\rho^2}.
\tag{1.2}
$$

All subsequent node evaluations are away from poles. For distinct real
rates $x_i>1/2$, and arbitrary complex coefficients $b_i$, set

$$
v(t)=\sum_{i=1}^N b_i e^{-x_i t},\qquad
V(z)=\int_0^\infty v(t)e^{-zt}\,dt
=\sum_{i=1}^N\frac{b_i}{z+x_i},
\tag{1.3}
$$

$$
Q_L(v)=\sum_{i,j}b_i\overline{b_j}P_L(x_i,x_j).
\tag{1.4}
$$

The integral in (1.3) converges at every centered zero because
$x_i+\Re\rho>0$. The rational formula also makes its continuation
explicit. For a representative zero in (1.2), put $\lambda=-\rho^2$.
Its contribution is

$$
P_\lambda(x,y)
=\frac{2(xy+\lambda)}{(x^2+\lambda)(y^2+\lambda)}.
\tag{1.5}
$$

The elementary identity

$$
\frac1{(x+\rho)(y-\rho)}+
\frac1{(x-\rho)(y+\rho)}
=\frac{2(xy-\rho^2)}{(x^2-\rho^2)(y^2-\rho^2)}
\tag{1.6}
$$

therefore proves the exact feature formula

$$
\boxed{
Q_L(v)=\sum_{\rho\in\mathcal Z}
V(\rho)\overline{V(-\overline\rho)}.
}
\tag{1.7}
$$

There is no positivity assumption in (1.7). Absolute convergence follows
from $|V(\rho)|\le B/|\gamma|$, $B=\sum_i|b_i|$, and
$\sum_{\Im\rho>0}\gamma^{-2}<\infty$. The latter follows from the
paired xi product and the strip; the preceding checkpoint also gives the
explicit bound $\sum_{\Im\rho>0}\gamma^{-2}<1$.

The finite coefficient sums can consequently be interchanged with the
zero sum. No completeness theorem for an unknown eigenbasis is being
assumed. Equation (1.7) is a finite-algebra derivation of the usual
reflection form associated with Weil positivity; see the source note.

## 2. The bridge reflection and the signed quartet energy

The involution

$$
\tau\rho=-\overline\rho
\tag{2.1}
$$

reflects a centered zero across the imaginary axis. A critical-line zero
is fixed by this reflection. Its term in (1.7) is $|V(\rho)|^2$.
For a nonfixed two-element orbit $\{\rho,\tau\rho\}$, write
$u=V(\rho)$, $w=V(\tau\rho)$. The two terms are

$$
u\overline w+w\overline u
=\frac12\left(|u+w|^2-|u-w|^2\right).
\tag{2.2}
$$

Thus the exact reflection energy is a symmetric-mode square minus an
antisymmetric-mode square. The latter cannot be discarded.

For real coefficients $b_i$, an off-axis quartet
$\{\rho,\overline\rho,-\rho,-\overline\rho\}$ contributes

$$
\boxed{
Q_{\rm quartet}(v)
=4\Re\big[V(\rho)\overline{V(-\overline\rho)}\big]
=|u+w|^2-|u-w|^2.
}
\tag{2.3}
$$

If all quartet members have multiplicity $\mu$, multiply this by
$\mu$. The multiplicities agree by the functional equations.

### Exact signature on four rate nodes

For four distinct rates, write $V=P/D$, where

$$
D(z)=\prod_{i=1}^4(z+x_i),\qquad \deg P\le3.
\tag{2.4}
$$

As the real coefficients $b_i$ vary, P ranges over all real
polynomials of degree at most three. Evaluation at the four distinct
quartet members is an invertible real interpolation map: prescribing
the two complex values $u,w$, with the conjugate values prescribed
at the conjugate points, gives a unique real polynomial P. D is nonzero
there.

The form $4\Re(u\overline w)$ has exactly two positive and two
negative directions on the four real coordinates of $(u,w)$.
Consequently:

> The Pick contribution of a single off-axis quartet has inertia
> $(2,2)$ on any four distinct positive-rate nodes. For more than four
> nodes it has the same two positive and two negative directions, with
> the remaining directions null.

This concerns the individual hypothetical quartet contribution. The
complete xi Pick matrix also contains all the other zero contributions
and can still be positive at a fixed finite order. In particular, this
statement does not disprove fourth-order positivity of actual xi.

## 3. Exact rank and nullspace of a verified real head

Fix m distinct positive real frequencies $\gamma_1,\ldots,\gamma_m$
with positive multiplicity weights $\mu_j$. Their response and energy
are

$$
L_{\rm head}(z)=\sum_{j=1}^m
\frac{2\mu_j z}{z^2+\gamma_j^2},
\tag{3.1}
$$

$$
\boxed{
Q_{\rm head}(v)=\sum_{j=1}^m\mu_j
\left(|V(i\gamma_j)|^2+|V(-i\gamma_j)|^2\right).
}
\tag{3.2}
$$

Each frequency supplies two features, hence a matrix of rank at most
two. In fact, for every N distinct positive rate nodes,

$$
\boxed{\operatorname{rank}P_{\rm head}=\min(N,2m).}
\tag{3.3}
$$

To prove the exact statement, put

$$
D_N(z)=\prod_{i=1}^N(z+x_i),\qquad
V(z)=P(z)/D_N(z),\qquad \deg P\le N-1.
\tag{3.4}
$$

This is a bijection between coefficient vectors b and numerator
polynomials P, with inverse

$$
b_i=\frac{P(-x_i)}{D_N'(-x_i)}.
\tag{3.5}
$$

Equation (3.2) vanishes exactly when P vanishes at all the 2m distinct
points $\pm i\gamma_j$. Therefore it vanishes exactly when

$$
\boxed{
P(z)=G_m(z)W(z),\qquad
G_m(z)=\prod_{j=1}^m(z^2+\gamma_j^2),\qquad
\deg W\le N-1-2m.
}
\tag{3.6}
$$

For $N\le2m$ this forces P=0, proving positive definiteness. For
$N>2m$, the nullspace has dimension $N-2m$, proving (3.3).

At the first null dimension, $N=2m+1$, an explicit nonzero test is

$$
\boxed{
V(z)=\frac{\prod_{j=1}^m(z^2+\gamma_j^2)}
{\prod_{i=1}^{2m+1}(z+x_i)},\qquad
b_i=\frac{\prod_{j=1}^m(x_i^2+\gamma_j^2)}
{\prod_{k\ne i}(x_k-x_i)}.
}
\tag{3.7}
$$

Every coefficient is nonzero. If the rates increase, their signs
alternate. The rates may all lie in any prescribed nonempty open
interval in $(1/2,\infty)$.

This gives a rigorous limitation of every fixed finite verified head:
there can be no strictly positive lower energy bound on all finite
exponential tests. The test in (3.7) can be normalized to have any chosen
positive $L^2$ norm while its head energy remains zero.

The head-only Schur construction has positive defects while the total
number of distinct nodes is at most 2m. At node number $2m+1$, the
new defect is exactly zero: the old $2m$-node matrix is invertible,
but the augmented matrix has rank $2m$.

## 4. What the actual residual must control

Write, at a fixed finite node set,

$$
P_L=H+E,
\tag{4.1}
$$

where H is the verified-head matrix and E is the exact remaining tail.
The tail is real symmetric after conjugate zero contributions are
combined. In the orthogonal decomposition
$\mathbb C^N=\operatorname{ran}H\oplus\ker H$, it has the block form

$$
P_L=
\begin{pmatrix}
H_R+E_{RR}&E_{RK}\\
E_{KR}&E_{KK}
\end{pmatrix}.
\tag{4.2}
$$

Whenever $A=H_R+E_{RR}$ is positive definite, the full positivity
condition is exactly

$$
\boxed{E_{KK}-E_{KR}A^{-1}E_{RK}\succeq0.}
\tag{4.3}
$$

This is the tail energy after its coupling to the head range is removed.
In particular, positivity requires $E_{KK}\succeq0$. A small bound on
$\|E\|$ cannot replace this sign: for any nonzero $w\in\ker H$, an
arbitrarily small perturbation $-\varepsilon ww^*$ makes H+E negative
on w. Such a perturbation is an abstract obstruction to a norm-only
argument, not a claim that the actual xi tail equals it.

If A is merely semidefinite, the usual range condition and generalized
Schur complement are required; no inverse is silently inserted.

The exact full-xi Schur residual at a new node has coefficients
$(-P_N^{-1}p,1)$, where the old full matrix $P_N$ is assumed PD.
It is the minimizer of the full quadratic form subject to new coefficient
one. A head-null vector from (3.7), scaled to have that coefficient one,
is an admissible comparison. Thus, when the old node count is 2m,

$$
\boxed{\Delta_{2m}^{\rm full}(x)
\le Q_{\rm tail}(v_{\rm head\text{-}null}).}
\tag{4.4}
$$

We do not identify this comparison vector with the actual full residual.
Its head orthogonality is exact, whereas the full projection includes E.
Equation (4.3) displays precisely the extra coupling control that is
needed.

## 5. A conditional negative witness inside any small real-node interval

The finite-rank argument explains loss of a finite margin. A stronger
conditional construction explains why arbitrary-order positivity is
RH-strength even on a tiny real-node interval.

### Proposition

If F has an off-axis zero, then for every $a>1/2$ and every
$\delta>0$, there is a finite collection of distinct rate nodes in
$[a,a+\delta]$ whose full xi Pick matrix has a negative direction.

This is a conditional statement. The construction below uses the
hypothetical zero locations as interpolation data. It is not an
algorithm that has found a negative actual-xi test.

### Proof

Suppose $\rho_0=\beta_0+i\gamma_0$, with $\beta_0\ne0$,
$\gamma_0>0$, is a zero of multiplicity $\mu$. Denote its quartet
by $\mathcal Q$. Choose a height H such that

$$
H>\max_{\rho\in\mathcal Q}|a+\rho|=:r_*,\qquad H>1.
\tag{5.1}
$$

Let $\mathcal Z_H$ be the finite set of distinct centered zeros with
$|\Im\rho|\le H$, and write $d=|\mathcal Z_H|$. It is invariant
under negation and conjugation. Prescribe

$$
c_{\rho_0}=c_{\overline\rho_0}=1,\qquad
c_{-\rho_0}=c_{-\overline\rho_0}=-1,
$$

and $c_\rho=0$ at all other points of $\mathcal Z_H$.
For each integer $M>d$, polynomial interpolation gives a unique
polynomial $P_M$ of degree at most $d-1$ such that

$$
P_M(\rho)=c_\rho(a+\rho)^M
\qquad(\rho\in\mathcal Z_H).
\tag{5.2}
$$

Conjugation of the interpolation data shows that $P_M$ has real
coefficients. Define the proper rational function

$$
V_M(z)=\frac{P_M(z)}{(z+a)^M}.
\tag{5.3}
$$

Its low-zero contribution in (1.7) is exactly $-4\mu$: the target
quartet has values $+1,+1,-1,-1$, and every other low zero has value
zero. Multiplicities of nontarget zeros do not change that conclusion.

The Lagrange interpolation formula has only four nonzero data terms.
Its fixed basis polynomials therefore give a constant C, independent of
M, such that on the strip and for $|\gamma|>H$,

$$
|P_M(\beta+i\gamma)|\le C r_*^M |\gamma|^{d-1}.
\tag{5.4}
$$

Because $|a+\beta+i\gamma|\ge|\gamma|$,

$$
|V_M(\beta+i\gamma)|
\le C r_*^M |\gamma|^{d-1-M}.
\tag{5.5}
$$

The same bound holds at the reflected partner. The absolute tail of
the reflection sum is consequently at most

$$
C^2 H^{2d}
\left(\frac{r_*}{H}\right)^{2M}
\sum_{\substack{\rho\in\mathcal Z\\|\Im\rho|>H}}
|\Im\rho|^{-2},
\tag{5.6}
$$

which tends to zero as $M\to\infty$. Thus the reflection energy of
$V_M$ is negative for all sufficiently large M.

It remains to realize the negative rational test by distinct exponential
rates. For the chosen M, replace its repeated denominator by

$$
D_\varepsilon(z)=\prod_{j=0}^{M-1}(z+a+j\varepsilon),\qquad
V_{M,\varepsilon}(z)=P_M(z)/D_\varepsilon(z).
\tag{5.7}
$$

For $\varepsilon>0$, this proper rational function has a partial
fraction expansion with real coefficients and distinct rates
$a,a+\varepsilon,\ldots,a+(M-1)\varepsilon$. It converges at each
zero to $V_M$ as $\varepsilon\downarrow0$.

The high-zero bound (5.5) remains valid uniformly in $\varepsilon$,
because every denominator factor has modulus at least $|\gamma|$.
The absolutely summable tail majorant therefore justifies dominated
convergence in (1.7). For sufficiently small positive $\varepsilon$,
the full xi energy remains negative. Choose also
$(M-1)\varepsilon<\delta$. All rates then lie in the prescribed
interval, completing the proof.

The proposition gives a constructive form of the known all-orders
positivity equivalence. Its denominator degree need not be small, and no
effective practical bound for finding the test is claimed. It explains
why low-order success and a fixed finite verified head cannot settle the
arbitrary-order problem.

## 6. The same target in the arithmetic energy variables

The preceding residual-energy note proves, on exactly the same finite
exponential class,

$$
Q_L(v)=E_\gamma(v)-2c_0\|v\|_2^2
-2\Re\int_0^\infty M(\ell)C_v'(\ell)\,d\ell.
\tag{6.1}
$$

Here $E_\gamma$ is its convergent gamma sum of squares, M is the
compensated prime count, and $C_v$ is the autocorrelation. The exact
normalization in (1.7) agrees with that note: the screw-kernel test is
$r=-v'$, while V is the Laplace transform of its primitive v.

For a test annihilating a fixed verified head, (6.1) equals only the
unknown zero-tail reflection energy. Thus the arithmetic domination
needed for RH must remain valid on the explicit rational nullspace
(3.6), including tests invisible to every fixed finite head. The stronger
block condition (4.3) additionally controls coupling to the head range.

This gives a precise continuation target rather than a sign shortcut:
derive a positive representation or a uniform arithmetic inequality on
these residual spaces that does not rely on coercivity of a fixed finite
head. The present note supplies the exact spaces and identities, not that
missing estimate.

## Sources and validation

- The xi product normalization, strip, and reciprocal-moment bound are
  recorded in the preceding [PR #48 curvature note](https://github.com/judegomila/mathexplorer/blob/499528b487e3249c5a35602f83343aaa53cec848/rigorous/theta-schur-kernels-2026-11-09/theta_three_node_curvature_20261109.md).
- The arithmetic normalization is the preceding [PR #48 energy note](https://github.com/judegomila/mathexplorer/blob/499528b487e3249c5a35602f83343aaa53cec848/rigorous/theta-schur-kernels-2026-11-09/theta_schur_residual_energy_20261109.md).
- Masatoshi Suzuki, *Aspects of the screw function corresponding to the
  Riemann zeta-function*, JLMS 108 (2023), 1448--1487, Theorems 1.1--1.3,
  supplies published context for the exact screw representation and Weil
  positivity equivalence. [Primary text](https://doi.org/10.1112/jlms.12785).
  The rational finite-test calculations above are proved explicitly; the
  general equivalence is not presented as new.
- Platt--Trudgian's [finite-height theorem](https://arxiv.org/abs/2004.09765)
  explains the verified head used in the preceding finite-order proof.
  No finite-height certificate is enlarged or rerun here.

The companion symbolic audit checks the single-pair identity, an exact
two-frequency head null vector and zero Schur defect, and an auxiliary
quartet reflection form. Those examples audit the formulas; they are not
tests of actual off-axis xi zeros. No all-orders positivity claim follows.
