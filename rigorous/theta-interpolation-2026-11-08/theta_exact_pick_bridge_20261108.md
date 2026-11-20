# The exact arithmetic-to-Pick bridge

Research continuation, 8 November 2026. This note supplies an explicit
normalization connecting Suzuki's arithmetic screw kernel to the
positive-real interpolation matrix for the same xi logarithmic derivative.
The transform identity is unconditional; positivity of every matrix is
not proved. No new RH criterion or novelty claim is made.

## 1. Fix the exact target

Write

\[
F(w)=\xi(1/2+w),\qquad L(w)=F'(w)/F(w).
\]

The companion arithmetic note gives Suzuki's explicit real even function
`Psi`, built from gamma terms and the prime-power ramps

\[
-\frac{\Lambda(n)}{\sqrt n}(t-\log n)_+.
\]

Its exact Laplace identity is

\[
H(p):=\int_0^\infty\Psi(t)e^{-pt}\,dt
=\frac{L(p)}{p^2},\qquad\Re p>1/2.
\tag{1}
\]

This is Suzuki 2023, Theorem 1.1, after setting his Fourier variable to
`ip`. The prime formula has at most a polynomial times `exp(t/2)` growth,
which already suffices for the absolute convergence needed below.

Define, on nonnegative times,

\[
K(t,u)=\Psi(t)+\Psi(u)-\Psi(|t-u|).
\tag{2}
\]

It is the restriction of Suzuki's screw kernel with `g=-Psi`. Defining
the kernel does not assert that it is positive semidefinite.

## 2. A double Laplace calculation

### Proposition

For `Re p, Re q>1/2`,

\[
\boxed{
\iint_{[0,\infty)^2}K(t,u)e^{-pt-\bar q u}\,dt\,du
=\frac{L(p)+\overline{L(q)}}{p\bar q(p+\bar q)}.
}
\tag{3}
\]

**Proof.** The first two terms of (2) transform to

\[
\frac{H(p)}{\bar q}+\frac{H(\bar q)}p.
\]

For the last term, split the quadrant into `t>=u` and `u>=t`. In the
first region set `t=u+r`; in the second set `u=t+r`. Absolute convergence
justifies Fubini and gives

\[
\iint\Psi(|t-u|)e^{-pt-\bar q u}\,dt\,du
=\frac{H(p)+H(\bar q)}{p+\bar q}.
\]

Subtracting and using (1) yields (3), since `L(bar q)=conjugate L(q)`.
\(\square\)

Thus the global half-plane Pick kernel

\[
\Pi(p,q)=\frac{L(p)+\overline{L(q)}}{p+\bar q}
\]

has the exact feature representation

\[
\boxed{
\Pi(p,q)=\iint K(t,u)[p e^{-pt}]
\overline{[q e^{-qu}]}\,dt\,du.
}
\tag{4}
\]

This is an equality of absolutely convergent integrals on these features.
It does not presume that K defines a bounded operator on ordinary global
L2, or that the form is positive.

For real interpolation nodes `x_i>1/2`, let `ell_i=L(x_i)`. Then the
matrix we must control is exactly

\[
\boxed{
P_{ij}=\frac{\ell_i+\ell_j}{x_i+x_j}.
}
\tag{5}
\]

Equation (4) gives each entry from the arithmetic kernel without guessing
a Hamiltonian or inserting known zero ordinates. It connects the
interpolation program to a fixed arithmetic representation.

## 3. Why positivity on the known outer half-plane is insufficient

L is unconditionally positive-real sufficiently far to the right. That
does not automatically make (5) positive. Positive-real interpolation on
the shifted half-plane `Re z>a` uses denominator `p+bar q-2a`; the
unshifted target uses `p+bar q`.

The companion continuation note derives the exact multiplier between
these kernels and proves it is indefinite already on two real nodes.
Thus changing the denominator silently would replace the global target
by a known local statement.

## 4. Exact Schur residual and the remaining inequality

Suppose the matrix `P_N` for N nodes is positive definite. For a new node
`x`, define

\[
v_i(x)=\frac{L(x_i)+L(x)}{x_i+x},\qquad
d(x)=\frac{L(x)}x.
\]

The exact next condition is

\[
\boxed{\Delta_N(x)=d(x)-v(x)^*P_N^{-1}v(x)\ge0.}
\tag{6}
\]

There is also an exact arithmetic expression for this defect. Define a
sesquilinear form, linear in its first argument, by

\[
\mathfrak b(f,h)=\iint K(t,u)f(t)\overline{h(u)}\,dt\,du,
\qquad f_i(t)=x_i e^{-x_i t},\quad f_x(t)=x e^{-xt}.
\]

All entries are real for the real nodes considered here. With
`c=P_N^{-1}v(x)` and `r_x=f_x-sum_i c_i f_i`, direct expansion of the
finite quadratic expression gives

\[
\boxed{\Delta_N(x)=\mathfrak b(r_x,r_x).}
\tag{7}
\]

No global positivity is used in (7). The chosen coefficients make
`b(r_x,f_i)=0` algebraically. The residual functions are explicit finite
exponential combinations, and the arithmetic kernel is fixed by the
primes and gamma terms.

If `P_N` is only semidefinite, replace (6) by the generalized Schur
conditions `v in range(P_N)` and `d-v*P_N^dagger v>=0`; an inverse cannot
be used without this qualification.

The remaining theorem would show (7) nonnegative for every stage of a
nested interpolation sequence. The two-node theorem in the companion
note establishes the first nontrivial stage for every pair of positive
real nodes. It does not establish the higher residual inequalities.

## 5. What a successful continuation would accomplish

Take a fixed sequence of distinct nodes dense in `[1,2]`, including 1.
Positive semidefiniteness of every matrix (5) gives rational positive-real
interpolants by finite Nevanlinna--Pick interpolation. Their common value
at 1 fixes a normalization. Cayley transforms belong to the unit ball of
analytic functions, so Montel compactness supplies subsequential limits.
The dense exact interpolation data identify any limit with `L` on the
known zero-free region. The limit is analytic and positive-real throughout
the right half-plane, excluding every off-axis xi zero by meromorphic
uniqueness and symmetry.

The full argument, including avoidance of a constant boundary-valued
Cayley limit, is in the continuation note. Once positivity at every finite
stage is established, no additional guessed infinite Hamiltonian or
independent high-frequency matching argument is needed for zero exclusion.
The hard, unproved step is the all-stage positivity itself.

The older theta cutoff jet and the new matrix (5) encode the same global
xi target. This note does not provide a finite-block congruence between
them. In particular, a positive finite block in one representation should
not be reported as certifying the same-sized block in the other.

## Sources and scope

- Masatoshi Suzuki, *Aspects of the screw function corresponding to the
  Riemann zeta-function*, JLMS 108 (2023), 1448–1487, Theorems 1.1–1.3.
  https://doi.org/10.1112/jlms.12785
  https://arxiv.org/abs/2206.03682
- John E. McCarthy, *Pick's Theorem—What's the Big Deal?*, American
  Mathematical Monthly 110 (2003), 36–45, Theorem 1 and the constructive
  Schur/Pick formulation.
  https://www.math.wustl.edu/~mccarthy/public_papers/MonthlyWtbd.pdf

The double transform, residual expansion, and convergence implication are
recorded here with our normalization and reviewed independently. They are
not asserted to be new mathematical criteria, a proof of every residual
sign, or a proof of RH.
