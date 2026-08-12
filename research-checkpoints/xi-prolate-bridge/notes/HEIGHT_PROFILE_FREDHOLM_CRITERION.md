# Imaginary-height profile criterion for the finite Fredholm determinants

## 0. Claim boundary and outcome

This note gives an exact alternative to the all-moment formulation in
`notes/LOCALLY_UNIFORM_DETERMINANT_ATTACK.md`.

For an off-axis-normalized even entire function whose zeros are all real, let

\[
 S_j(s)=\sum_{\rho\in R_j}{1\over \rho^2+s^2}
\]

be its complete half-paired resolvent trace at imaginary height `s`.  On any
one fixed interval

\[
 0<a<b<\frac12,
\]

local uniform convergence of the normalized functions to `Xi` is equivalent
to weighted `L1` convergence on that interval,

\[
 \int_a^b 2s\,|S_j(s)-S_\Xi(s)|\,ds\longrightarrow0,
 \qquad
 S_\Xi(s)={1\over2s}{d\over ds}\log\Xi(is).       \tag{0.1}
\]

The normalization is taken at the right endpoint `ib`.  The interval norm in
(0.1) itself bounds the first trace at that anchor, so no separate normal-
family hypothesis is hidden in the converse.  Because `a>0`, weighted and
unweighted `L1` convergence are equivalent.

Monotonicity of `S_j` yields a finite-mesh corollary: a growing mesh of only
first resolvent traces is sufficient.  No higher Schatten moment need be
tested directly.  Conversely, an exact rational Cauchy-residue construction
shows that any fixed finite set of height traces, even with equal finite rank,
does not determine the normalized determinant.

For the actual finite CCM ground transform, (0.1) becomes one explicit
interval cancellation between the central hyperbolic term, the shifted odd
response `A'_j/A_j`, and the derivative of `Xi(is)`.  This is a reduction, not
an estimate: the arithmetic cancellation, the finite simple-even hypotheses,
and an unbounded source schedule remain unproved.  No conclusion about the
Riemann hypothesis follows, and the formal project state remains
`P0_INVALIDATED`.

The source conventions and finite determinant theorem are those pinned in
`notes/DETERMINANT_LIMIT_AUDIT.md`.  This note uses no zeta-zero table and no
global Weil positivity.

## 1. Complete paired zeros and off-axis normalization

Let `f_j` be an even entire function of order at most one, not identically
zero, all of whose zeros are real.  Its zero at the origin, if present, has
even order.  Form the half-paired multiset `R_j` as follows:

- for every pair of nonzero zeros `+/-rho`, include one copy of `rho>0` for
  each paired multiplicity;
- if the origin has multiplicity `2r`, include exactly `r` copies of
  `rho=0`.

The order bound implies

\[
 \sum_{\rho\in R_j}{1\over \rho^2+b^2}<\infty.    \tag{1.1}
\]

Paired Hadamard factorization, with the constant removed at `ib`, gives

\[
 \boxed{
 {f_j(z)\over f_j(ib)}
 =\prod_{\rho\in R_j}{\rho^2-z^2\over\rho^2+b^2}
 =\det\!\left(I-(z^2+b^2)K_{j,b}\right),}         \tag{1.2}
\]

where

\[
 K_{j,b}=\operatorname {diag}_{\rho\in R_j}
                 {1\over\rho^2+b^2}\geq0         \tag{1.3}
\]

is trace class.  A copy `rho=0` contributes the ordinary factor
`-z^2/b^2`; no limiting convention is being suppressed.

The normalization (1.2) is invariant under every nonzero rescaling of
`f_j`.  In particular, it does not require a quantitative source boundary
reserve.

For `s>0`, define the complete height profile

\[
 \boxed{
 S_j(s)=\sum_{\rho\in R_j}{1\over\rho^2+s^2}.}     \tag{1.4}
\]

It is positive, continuous, and nonincreasing.  Substituting `z=is` into
(1.2) gives a positive ratio and the exact identities

\[
 {f_j(is)\over f_j(ib)}
 =\prod_{\rho\in R_j}{\rho^2+s^2\over\rho^2+b^2}, \tag{1.5}
\]

\[
 \boxed{
 {d\over ds}\log {f_j(is)\over f_j(ib)}
 =2sS_j(s),}                                      \tag{1.6}
\]

\[
 \boxed{
 \log {f_j(is)\over f_j(ib)}
 =\int_b^s2uS_j(u)\,du.}                          \tag{1.7}
\]

The sign in (1.7) is important: for `s<b` the oriented integral is
nonpositive, as is the logarithm of the product in (1.5).

## 2. The target profile

Recall

\[
 \Xi(z)=\xi\!\left({1\over2}+iz\right).
\]

For `0<s<1/2`, the argument `1/2-s` lies in `(0,1)`.  The elementary eta-
series sign and the completed-zeta prefactor give

\[
 \Xi(is)>0.                                       \tag{2.1}
\]

Thus the real logarithm is unambiguous on `[a,b]`, and we may put

\[
 \boxed{
 S_\Xi(s)={1\over2s}{d\over ds}\log\Xi(is).}      \tag{2.2}
\]

No representation of (2.2) by zeta zeros is used or assumed.  Since `Xi` is
even, there is a unique entire function `Phi_b` with

\[
 \Phi_b(z^2+b^2)={\Xi(z)\over\Xi(ib)},
 \qquad \Phi_b(0)=1.                              \tag{2.3}
\]

## 3. A necessary and sufficient height-profile theorem

Normalize the finite functions by

\[
 G_j(z)=\Xi(ib){f_j(z)\over f_j(ib)}.              \tag{3.1}
\]

### Theorem 3.1 (one-interval first-profile criterion)

The following are equivalent.

1. `G_j -> Xi` locally uniformly on the open strip `|Im z|<1/2`.
2. The complete first profiles obey

\[
 \boxed{
 \delta_j:=\int_a^b2s\,|S_j(s)-S_\Xi(s)|\,ds
 \longrightarrow0.}                              \tag{3.2}
\]

If either condition holds, `G_j -> Xi` locally uniformly on the whole
complex plane.

**Proof: item 1 implies item 2.**  The compact imaginary segment
`{is:a<=s<=b}` lies inside the strip and `Xi` has no zero there by (2.1).
Local uniform convergence of holomorphic functions gives local uniform
convergence of their derivatives.  The functions `G_j` are also nonzero on
this segment because all zeros of `f_j` are real.  Hence their logarithmic
derivatives converge uniformly there.  Equations (1.6) and (2.2) give

\[
 2sS_j(s)\longrightarrow2sS_\Xi(s)
\]

uniformly on `[a,b]`, which implies (3.2).

**Proof: item 2 implies item 1.**  Monotonicity of `S_j` and the right-
endpoint normalization give

\[
 (b^2-a^2)S_j(b)
 \leq\int_a^b2sS_j(s)\,ds
 \leq\delta_j+\int_a^b2s|S_\Xi(s)|\,ds.           \tag{3.3}
\]

Thus

\[
 \sup_j\operatorname {tr}K_{j,b}
 =\sup_j S_j(b)<\infty                            \tag{3.4}
\]

after discarding at most finitely many indices.  Put

\[
 D_j(t)=\det(I-tK_{j,b}).                          \tag{3.5}
\]

The elementary trace-class product bound gives, for every `t in C`,

\[
 \boxed{
 |D_j(t)|\leq\exp\!\left(|t|S_j(b)\right).}       \tag{3.6}
\]

Consequently the `D_j` form a normal family on the whole `t`-plane.

Equations (1.7) and (2.2) give, uniformly for `s in [a,b]`,

\[
 \left|
 \log {G_j(is)\over\Xi(is)}
 \right|
 =\left|\int_b^s2u\{S_j(u)-S_\Xi(u)\}\,du\right|
 \leq\delta_j.                                   \tag{3.7}
\]

Both numerator and denominator in (3.7) are positive.  Therefore

\[
 e^{-\delta_j}\leq {G_j(is)\over\Xi(is)}
 \leq e^{\delta_j},                               \tag{3.8}
\]

so `G_j(is) -> Xi(is)` uniformly on the nondegenerate segment.

Every subsequence of the normal family in (3.6) has a further subsequence
converging locally uniformly to an entire function of `t`.  By (1.2), (2.3),
and (3.8), that limit agrees with `Phi_b` on the real interval
`[b^2-b^2,b^2-a^2]`.  The identity theorem makes it equal to `Phi_b`
everywhere.  Every convergent subsequence has the same limit, hence the full
sequence converges locally uniformly in `t`, and therefore in `z`, to `Xi`.
This proves both the strip claim and the asserted whole-plane extension.
\(\square\)

Because `a<=s<=b`, one also has the exact norm comparison

\[
 2a\int_a^b|S_j-S_\Xi|\,ds
 \leq\delta_j
 \leq2b\int_a^b|S_j-S_\Xi|\,ds.                  \tag{3.9}
\]

Thus weighted and unweighted `L1` convergence are equivalent on the declared
interval.  The weight `2s` is nevertheless the canonical one: it is exactly
the Jacobian in the logarithmic determinant identity (1.6).

## 4. A growing finite mesh is sufficient

The profile `S_j` is nonincreasing without any spectral ordering or matching
between different `j`.  This turns Theorem 3.1 into a finite-data criterion.

Let

\[
 a=s_{j,0}<s_{j,1}<\cdots<s_{j,m_j}=b             \tag{4.1}
\]

be a partition and put

\[
 h_j=\max_i(s_{j,i+1}-s_{j,i}),
 \qquad
 \epsilon_j=\max_i|S_j(s_{j,i})-S_\Xi(s_{j,i})|. \tag{4.2}
\]

Let `omega_Xi(h)` be the modulus of continuity of `S_Xi` on `[a,b]`.

### Corollary 4.1 (finite height-mesh criterion)

For every such partition,

\[
 \boxed{
 \sup_{a\leq s\leq b}|S_j(s)-S_\Xi(s)|
 \leq\epsilon_j+\omega_\Xi(h_j).}                 \tag{4.3}
\]

Consequently, if `h_j -> 0` and `epsilon_j -> 0`, then the normalized
determinants converge locally uniformly to `Xi` on the whole plane.

**Proof.**  If `s` lies between two adjacent nodes, monotonicity gives

\[
 S_j(s_{j,i})\geq S_j(s)\geq S_j(s_{j,i+1}).      \tag{4.4}
\]

Comparison of the two endpoints with `S_Xi`, followed by its modulus of
continuity, gives both one-sided bounds in (4.3).  Equation (3.2) follows
from (4.3), and Theorem 3.1 applies. \(\square\)

This is a diagonal finite-rank program: at stage `j` only finitely many first
resolvent traces are required, although their number must grow.  Finite
point values without analytic or certified bounds on `epsilon_j` do not
establish the hypothesis.

## 5. Exact specialization to the finite CCM quotient

Assume the actual finite Weil matrix has a simple inversion-even lowest
eigenvector, so the pinned determinant theorem applies.  Let
`B_(lambda,N)` be the physical self-adjoint quotient operator and let
`L=2 log(lambda)`.  The complete profile of the ground transform is

\[
 \boxed{
 S_{\lambda,N}(s)
 ={1\over2}\operatorname {Tr}_{E'_N}
       (B_{\lambda,N}^2+s^2)^{-1}
 +\sum_{n>N}{1\over(2\pi n/L)^2+s^2}.}            \tag{5.1}
\]

The second term is the mandatory exterior Fourier lattice.  Uniformly for
`s>0`,

\[
 0\leq\sum_{n>N}{1\over(2\pi n/L)^2+s^2}
 \leq {L^2\over4\pi^2N}.                          \tag{5.2}
\]

Hence on a schedule with `N/L^2 -> infinity`, the complete and finite-
quotient profiles differ uniformly by `o(1)`.  Omitting (5.2) at finite
`N` changes the exact determinant and is not allowed.

There is also a root-free source formula.  Normalize the real even ground
vector by the source condition `<eta,xi>=1`, put

\[
 \alpha={sL\over2\pi},
 \qquad
 A_{\lambda,N}(\alpha)
 =1+\langle g_\alpha,
        (Q-\epsilon I)|_{H_-}^{-1}\beta\rangle,   \tag{5.3}
\]

and write its positive imaginary-axis transform as

\[
 M_{\lambda,N}(s)=\widehat\xi(is)
 ={2\sinh(sL/2)\over s\sqrt L}
        A_{\lambda,N}(\alpha).                    \tag{5.4}
\]

The source commutator theorem gives `A_(lambda,N)(alpha)>0` under the finite
hypotheses.  Differentiating (5.4), without reading any quotient roots, gives

\[
 \boxed{
 2sS_{\lambda,N}(s)
 ={d\over ds}\log M_{\lambda,N}(s)
 ={L\over2}\coth(sL/2)-{1\over s}
 +{L\over2\pi}{A'_{\lambda,N}(\alpha)
                    \over A_{\lambda,N}(\alpha)}.}       \tag{5.5}
\]

Therefore Theorem 3.1 specializes exactly to the cancellation target

\[
\boxed{
 \int_a^b\left|
 {L_j\over2}\coth(sL_j/2)-{1\over s}
 +{L_j\over2\pi}{A'_j(sL_j/(2\pi))
                     \over A_j(sL_j/(2\pi))}
 -{d\over ds}\log\Xi(is)
 \right|ds\longrightarrow0.}                     \tag{5.6}
\]

This exposes the required cancellation before absolute values are taken.
The central hyperbolic term is of order `L_j`; bounding it and the odd
response term separately cannot prove (5.6).  Formula (5.6) uses the actual
combined pole--archimedean--minus-prime matrix through `A_j`, retains the
source shift by the true finite ground value, and uses derivatives of `Xi`
directly rather than a zero list.

Current project estimates do not prove (5.6), even in a weaker uniform form,
on an unbounded source schedule.

## 6. A fixed finite set of heights is not enough

The growing mesh in Corollary 4.1 cannot be replaced abstractly by a fixed
finite set.  The obstruction can be made exact, rational, equal-rank, and
finite-dimensional.

Fix distinct positive heights `s_1,...,s_q`, with

\[
 y_i=s_i^2\in\mathbb Q,
 \qquad q\geq1,                                    \tag{6.1}
\]

and choose distinct positive rational numbers
`x_0,...,x_(q+1)`.  Define

\[
 H(y)={\prod_{i=1}^q(y-y_i)
       \over\prod_{k=0}^{q+1}(y+x_k)}
 =\sum_{k=0}^{q+1}{c_k\over y+x_k},               \tag{6.2}
\]

where the exact residues are

\[
 c_k={\prod_{i=1}^q(-x_k-y_i)
       \over\prod_{\ell\ne k}(x_\ell-x_k)}
 \in\mathbb Q\setminus\{0\}.                    \tag{6.3}
\]

Because `H(y)=O(y^(-2))`,

\[
 \sum_kc_k=0.                                     \tag{6.4}
\]

Choose a positive integer `D` clearing all denominators and put
`m_k=D*c_k in Z`.  Split

\[
 m_k=m_k^+-m_k^-,
 \qquad m_k^+,m_k^-\geq0.                         \tag{6.5}
\]

Both signs occur, and (6.4) gives equal total multiplicity:

\[
 \sum_km_k^+=\sum_km_k^-.                        \tag{6.6}
\]

Define two even real-rooted polynomials

\[
 f_+(z)=\prod_k(x_k-z^2)^{m_k^+},
 \qquad
 f_-(z)=\prod_k(x_k-z^2)^{m_k^-}.                 \tag{6.7}
\]

Their paired trace profiles satisfy, at every declared height,

\[
 \boxed{
 S_+(s_i)-S_-(s_i)
 =\sum_k{m_k\over x_k+y_i}
 =D H(y_i)=0.}                                    \tag{6.8}
\]

Nevertheless their off-axis-normalized determinants are different for every
anchor `b>0`:

\[
 \prod_k\left(1-{t\over x_k+b^2}\right)^{m_k^+}
 \not\equiv
 \prod_k\left(1-{t\over x_k+b^2}\right)^{m_k^-}. \tag{6.9}
\]

Indeed, equality in (6.9) would make the two distinct multisets of positive
numbers `(x_k+b^2)^(-1)` equal, forcing every `m_k` to vanish, contrary to
(6.3).  Equivalently, logarithmic differentiation would make the nonzero
rational function `D*H` vanish identically.

Multiplying both polynomials by any common even real-zero canonical product
adds the same Fourier-lattice or other tail to both profiles and does not
remove the obstruction.  Thus the example can be embedded below an identical
common tail.

This construction is not asserted to arise from the arithmetic Weil matrix.
It proves the precise determinant-level limitation: boundedness or exact
agreement of the first trace at any fixed finite collection of heights does
not identify a locally uniform limit.  One needs a uniqueness-set amount of
information, such as the interval profile in Theorem 3.1, a growing mesh as
in Corollary 4.1, all moments at one height, or an independently proved
projective ground-line comparison.

## 7. Exact remaining determinant-only obligation

On one explicit unbounded schedule, a determinant-only route may now replace
the all-moment target by the following finite-at-each-stage program.

1. Prove the exact finite ground line is simple and inversion even.
2. Fix rational `0<a<b<1/2` and use the scale-free normalization at `ib`.
3. Choose a deterministic mesh of `[a,b]` whose spacing tends to zero.
4. Prove, from the source matrix and without cached quotient roots, that the
   complete traces (5.1), or equivalently the cancellation formula (5.5),
   converge to (2.2) uniformly at the mesh nodes.

Corollary 4.1 and Theorem 3.1 would then give the locally uniform
characteristic-function limit.  No current estimate proves step 4.  The
fixed-height first-trace gates already in the repository supply only
normal-family control and cannot replace the growing profile by Section 6.
