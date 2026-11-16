# Odd Taylor blocks: fixed-order local positivity and the all-order target

Analytic continuation of the theta odd-sector work, 14 November 2026. This note proves the local theorem used to interpret higher Taylor-block certificates, and identifies exactly what an all-order extension would imply. It assumes no unknown theta positivity statement.

## 1. Setup and indexing

Write the real symmetric odd half-line kernel near zero as

\[
H_-(x,y)=xy\,G(x^2,y^2),\qquad
G(X,Y)=\sum_{i,j\ge0}g_{ij}X^iY^j,
\qquad g_{ij}=g_{ji}\in\mathbb R.
\]

The series converges absolutely in a nonzero bidisc. Define the leading coefficient block

\[
J_N=(g_{ij})_{0\le i,j<N}.
\tag{1}
\]

Thus `J_2` is the previously certified coefficient matrix in the odd features `(x,x^3)`, and `J_4` uses `(x,x^3,x^5,x^7)`. These are coefficients, including their Taylor factorials, rather than raw mixed derivatives.

## 2. A fixed-order local theorem with no separation assumption

**Theorem 1.** If `J_N` is strictly positive definite, there is a `delta_N>0` such that every matrix

\[
\bigl[H_-(x_a,x_b)\bigr]_{a,b=1}^N
\]

is strictly positive definite whenever the positive nodes are distinct and `0<x_a<delta_N`. The conclusion allows arbitrary complex coefficients. The nodes may be arbitrarily close to one another, and no lower bound on their separation is required.

### Proof by Newton divided differences

Set `X_a=x_a^2`. For distinct real nodes define the triangular invertible change from evaluations to successive divided differences,

\[
f(X_1),\ldots,f(X_N)
\quad\longmapsto\quad
f[X_1],f[X_1,X_2],\ldots,f[X_1,\ldots,X_N].
\]

Let its matrix be `L`. Applying it in both kernel arguments gives the congruence

\[
D=L\,[G(X_a,X_b)]\,L^{\mathsf T},
\qquad
D_{ij}=G[X_1,\ldots,X_{i+1};X_1,\ldots,X_{j+1}],
\tag{2}
\]

where `i,j=0,...,N-1` and the semicolon separates the two variables.

Divided differences extend continuously to coincident nodes. For example, the integral form of an order-`i` divided difference is the integral of the `i`-th derivative at convex combinations of its nodes over the standard `i`-simplex, whose volume is `1/i!`. Applying that formula in both variables proves

\[
D_{ij}\longrightarrow
\frac{\partial_X^i\partial_Y^jG(0,0)}{i!j!}=g_{ij}
\quad\text{as every }X_a\to0.
\tag{3}
\]

The convergence is uniform over all node configurations in a shrinking interval. It does not involve division by a minimum separation after the continuous extension has been taken. Since strict positive definiteness is open and `J_N` is strictly positive, `D` is positive throughout a sufficiently small node box. Congruence in (2), followed by congruence with `diag(x_1,...,x_N)`, proves the theorem.

There is also an exact determinant factorization:

\[
\boxed{
\det[H_-(x_a,x_b)]
=\left(\prod_{a=1}^Nx_a^2\right)
\left(\prod_{a<b}(x_b^2-x_a^2)^2\right)\det D.
}
\tag{4}
\]

All degeneracy caused by coalescence is explicit in the squared Vandermonde factor. The remaining determinant extends continuously to the complete collision and tends to `det J_N>0`.

Repeated nodes or a zero node give a singular ordinary Gram matrix. Nonnegative definiteness follows there by continuity; strictness does not. The theorem also does not assert positivity for arbitrarily many nodes, for every function supported in that neighborhood, or for unrestricted `2N`-center configurations of the full kernel. The corresponding full-kernel configurations have antisymmetric coefficients at the `N` pairs `±x_a`.

### Consequence of a certified fourth block

If `J_4` is strictly positive definite, every leading block `J_N` with `1<=N<=4` is strictly positive definite. Theorem 1 gives local positivity at each of these four orders. Taking the minimum of the four existence radii gives a common positive neighborhood for up to four distinct odd nodes. This is an existence statement unless an explicit remainder calculation supplies a numerical radius.

## 3. Quantitative versions

Suppose a certified number `eta>0` satisfies `J_N >= eta I`. Let `0<=X_a<=d`. If the entrywise remainder bounds

\[
|D_{ij}-g_{ij}|\le E_{ij}(d)
\]

form a symmetric nonnegative matrix, a sufficient condition for (2) to be strictly positive is

\[
\max_{0\le i<N}\sum_{j=0}^{N-1}E_{ij}(d)<\eta.
\tag{5}
\]

It then suffices to take physical radius `delta=sqrt(d)`. A fixed congruence or diagonal rescaling before applying (5) can improve the estimate. An interval LDL proof can replace an eigenvalue bound.

### Bounds from real derivatives

For `0<=X,Y<=d`, suppose the indicated suprema are bounded. The simplex formula and a two-variable mean-value estimate give

\[
E_{ij}(d)\le
\frac{d}{i!j!}
\left(
\sup|\partial_X^{i+1}\partial_Y^jG|
+\sup|\partial_X^i\partial_Y^{j+1}G|
\right).
\tag{6}
\]

This is convenient when real derivative envelopes can be integrated with explicit theta-series and infinite-tail bounds.

### Bounds from a complex bidisc

Alternatively, suppose `G` is holomorphic on a neighborhood of the closed bidisc `|X|,|Y|<=R` and `|G|<=M` there. Cauchy's estimate gives `|g_mn|<=M R^(-m-n)`. The divided difference of the monomial `X^m` at `i+1` nodes is the complete homogeneous polynomial of degree `m-i`; it vanishes for `m<i`. For nodes of modulus at most `d`, its absolute value is at most `binom(m,i)d^(m-i)`.

Summing the resulting absolutely convergent coefficient bounds gives, for `d<R`,

\[
\boxed{
E_{ij}(d)\le
M R^{-i-j}
\left[(1-d/R)^{-i-j-2}-1\right].
}
\tag{7}
\]

The subtraction removes the single leading term `g_ij`. Formula (7) is conservative, but it is uniform even for arbitrarily severe node coalescence. Exact low coefficients may be separated before applying a Cauchy bound to the remaining sum.

## 4. All origin blocks are a complete criterion for actual theta

For the actual theta cutoff kernel, the following conditions are equivalent:

1. `J_N` is positive semidefinite for every finite `N`.
2. The odd kernel is positive definite as a kernel on some nonempty neighborhood of zero, at every finite matrix order.
3. The odd kernel is positive definite on the entire positive real half-line.
4. The complete odd cutoff operator is positive semidefinite on its `L^2` parity space.
5. RH, by the Fourier/Löwner equivalence already established in the companion operator note.

Here “positive definite kernel” has its standard semidefinite meaning for all finite Gram matrices; no strict lower bound is required. The finite strict-positive result of Theorem 1 is a separate statement.

### 4.1 The actual kernel extends across a connected complex strip

Let

\[
S=\{z\in\mathbb C:|\operatorname{Im}z|<\pi/2\}.
\]

The positive-coordinate theta expression extends holomorphically throughout this strip:

\[
\kappa(z)=e^{z/4}\sum_{n\ge1}
\left(2v_n^2-3v_n\right)e^{-v_n},
\qquad v_n=\pi n^2e^z.
\tag{8}
\]

On each compact subset of `S`, `Re(e^z)>0` is bounded away from zero, so the series and each fixed derivative converge locally uniformly. Its real evenness and conjugation symmetry extend by uniqueness. The actual fixed-limit cutoff representation

\[
H_0(z,w)=\alpha\int_0^\infty
(2r-z-w)\kappa(r-z)\kappa(r-w)\,dr
\tag{9}
\]

is jointly holomorphic on `S×S`. To check the infinite endpoint, fix compact sets of `z,w` in the strip. Their imaginary parts stay below some `eta<pi/2`; hence the real part of each exponential argument is at least `c exp(r)` for a common `c>0`. The theta sum has a uniform bound of the form

\[
|\kappa(r-z)|\le C e^{9r/4-c e^r}
\]

for sufficiently large `r`. Multiplication by the at-most-linear cutoff factor leaves an integrable envelope for (9). On the finite part of the integral, local uniform convergence suffices. This verifies holomorphic parameter integration without any RH assumption.

The same holds for

\[
H_-(z,w)=H_0(z,w)-H_0(z,-w).
\]

Its oddness in each variable and real symmetry follow by continuation of the real identities. Define the sesquiholomorphic kernel

\[
\mathcal K(z,w)=H_-(z,\overline w)
\quad(z,w\in S).
\tag{10}
\]

It is holomorphic in `z`, antiholomorphic in `w`, and Hermitian. Thus it is a holomorphic kernel on `S×conjugate(S)` in the precise terminology of the propagation theorem used below.

### 4.2 All coefficient blocks give positivity on one common disk

Near zero,

\[
\mathcal K(z,w)
=\sum_{i,j\ge0}g_{ij}z^{2i+1}\overline w^{2j+1}.
\tag{11}
\]

Assume condition 1. Each rectangular truncation

\[
\mathcal K_N(z,w)
=\sum_{0\le i,j<N}g_{ij}z^{2i+1}\overline w^{2j+1}
\]

is a positive kernel because its coefficient matrix is `J_N>=0`. The analytic series converges absolutely on a fixed sufficiently small bidisc, independent of `N`. Limits of finite positive semidefinite matrices remain positive semidefinite. Consequently `mathcal K` is positive on a single nonempty complex disk at every finite matrix order.

No uniform lower bound for the eigenvalues of `J_N` is needed. The common convergence disk comes from analyticity, rather than from the possibly shrinking strict-positivity neighborhoods produced separately by Theorem 1.

### 4.3 Propagation to the whole strip

Neeb and Ólafsson's **Theorem A.1(i)** says that a holomorphic kernel on a connected complex manifold is positive throughout the manifold if it is positive on a nonempty open subset. The definition preceding the theorem uses the conjugate complex structure in the second variable. The theorem also has a totally-real-submanifold variant, but the open-disk version already applies to (10)–(11).

Apply it with the connected strip `S`. This proves positivity of `mathcal K` on all of `S`, hence positivity of `H_-` on the positive real half-line. The external theorem and its proof were checked in the authors' preprint, Appendix A, pp. 41–42: Karl-Hermann Neeb and Gestur Ólafsson, [*Reflection Positivity and Conformal Symmetry*, arXiv:1206.2039v2](https://arxiv.org/pdf/1206.2039). The published article is in *Journal of Functional Analysis* 266 (2014), 2174–2224, DOI [10.1016/j.jfa.2013.10.030](https://doi.org/10.1016/j.jfa.2013.10.030).

### 4.4 Operator positivity and the converse

Positive finite kernel matrices imply a nonnegative integral quadratic form on continuous compactly supported tests, by Riemann sums. The actual cutoff operator is bounded, so density extends that conclusion to all `L^2` tests on the half-line and, under the unitary odd extension, to the full odd parity space.

Conversely, operator positivity gives every finite kernel matrix by smooth approximate delta tests. Dividing by the nonzero physical-node weights gives positive matrices for `G` at positive nodes near zero. Apply the divided-difference congruence (2), and then let all `N` nodes tend to zero. Closure of the positive semidefinite cone gives `J_N>=0`. This completes the equivalence of conditions 1–4. Condition 5 is the separately checked [Fourier/Löwner equivalence](../../odd-sector-followup/operator-duality.md), which should be read with its normalization and full-sector scope.

An equivalent formulation is useful:

\[
\boxed{
\text{For every }N\text{ there exists }\delta_N>0
\text{ giving all }N\text{-node odd matrices PSD near zero}
\quad\Longleftrightarrow\quad\mathrm{RH}.
}
\tag{12}
\]

The radius may depend on `N` and tend to zero. The forward implication obtains every `J_N>=0` by (2)–(3), then uses the common analytic series and propagation. It does not interchange an uncontrolled sequence of finite numerical approximations with an infinite-order limit.

## 5. What finite certificates can and cannot establish

The global criterion is a complete infinite hierarchy. Certifying its first two, three, or four blocks proves the corresponding fixed-order local theorems. It does not establish the hierarchy at all orders.

For an exact generic illustration, the analytic kernel

\[
G_N(X,Y)=\sum_{j=0}^{N-1}(XY)^j-(XY)^N
\]

has `J_N=I_N>0`, but `J_(N+1)=diag(1,...,1,-1)`. Its `N`-node matrices are strictly positive sufficiently near zero, while every `(N+1)`-node matrix at distinct nodes is indefinite by the invertible Vandermonde congruence. This example only explains the logical limitation of a finite Taylor certificate; it is not a theta model.

There is a concrete induction target. If `J_N>0` and the next block is

\[
J_{N+1}=\begin{pmatrix}J_N&b_N\\b_N^*&c_N\end{pmatrix},
\]

the next strict-positive step is exactly

\[
p_N=c_N-b_N^*J_N^{-1}b_N>0.
\tag{13}
\]

Proving (13) for every `N`, using the actual theta derivative-moment formulas, would establish all blocks and therefore RH. No bound away from zero uniformly in `N` is necessary. If singular blocks occur, the semidefinite version additionally requires `b_N` in the range of `J_N`, and uses its pseudoinverse; a bare nonnegative determinant is not a substitute for those conditions.

The remaining problem is therefore an all-order theta-specific matrix or Schur-pivot inequality. Analyticity supplies propagation once that hierarchy is proved. It does not supply the missing signs.

## 6. An exact derivative-polynomial form of the remaining inequality

There is a compact way to state the all-order target directly in terms of the actual theta kernel. For arbitrary complex coefficients `c_0,...,c_(N-1)`, let

\[
p(t)=\sum_{i=0}^{N-1}\frac{c_i}{(2i+1)!}t^{2i+1},
\qquad P(r)=p(D)\kappa(r),\quad Q(r)=p'(D)\kappa(r),
\quad D=d/dr.
\]

Here `p'` is the formal derivative of the polynomial; `Q` is not the physical derivative of `P`. The exact Taylor-coefficient integral gives

\[
\boxed{
c^*J_Nc=4\alpha\int_0^\infty
\left[r|P(r)|^2+\operatorname{Re}(\overline{P(r)}Q(r))\right]dr.
}
\tag{14}
\]

Indeed, the `2r` term in each coefficient sums to `2r|P|^2`, while its two derivative terms sum to `overline Q P+overline P Q`. The factor two in the odd reduction then gives (14). This also checks the first diagonal identity `4 alpha I_1-2 alpha kappa(0)^2` when `p(t)=t`.

Consequently the single family of inequalities

\[
\boxed{
\int_0^\infty r|p(D)\kappa|^2\,dr
\ge-\operatorname{Re}\int_0^\infty
\overline{p(D)\kappa}\,p'(D)\kappa\,dr
\quad\text{for every odd polynomial }p
}
\tag{15}
\]

is equivalent to all `J_N>=0`, and hence to RH under the continuation and Fourier reductions above. The verified fourth block establishes (15) for odd polynomials of degree at most seven. The extension to arbitrary degree is the unproved part; no sign for that full family is assumed here.

