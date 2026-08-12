# Favorable locked subsequence for the complete odd-pole form

## 0. Claim boundary

This note replaces one false prospective use of the first Riesz mean by a
weaker statement that is both true and useful.  It proves, unconditionally,
that the **complete** unprojected odd-pole quadratic form has a positive
linear-size reserve on an unbounded subsequence of the locked half-integer
parameters.  It then transfers that scalar reserve, qualitatively, to exact
finite Fourier compressions.

The proof keeps the negative odd pole, the archimedean term, and the complete
minus-prime block together.  Every prime power at the source endpoint is
included, and no absolute value is taken before their leading cancellation.
The subsequence can be selected from source quantities alone.  Its definition
does not read a zero table.

This result is only a pole-axis theorem.  It does **not** bound the transverse
inverse term in the exact harmonic short.  It therefore proves neither an
odd-sector floor nor either complete signed sector floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, or the
Riemann hypothesis.  It assumes neither global Weil positivity nor reality
of the nontrivial zeros.  The project state remains `P0_INVALIDATED`.

The exact source conventions are those of `P0_SOURCE_LOCK.json`,
`P0_MATRIX_FORMULAS.md`, and
`notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md`.

## 1. Exact complete pole form and its first-Riesz asymptotic

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 X=\lambda^2,\qquad I_\lambda=[-\ell,\ell],
 \qquad \lambda>1.                                    \tag{1.1}
\]

The Fourier convention and Plancherel measure are

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi}.                        \tag{1.2}
\]

All physical functions are extended by zero and inversion is reflection.
On the odd sector the pole representer and its norm are

\[
 p_\lambda(x)=\sinh(x/2),\qquad
 \mu_\lambda=\|p_\lambda\|^2
 ={\lambda-\lambda^{-1}-L\over2}.                     \tag{1.3}
\]

The source multiplier is

\[
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq X}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                \tag{1.4}
\]

The endpoint in (1.4) is inclusive and its displayed minus sign is the
minus-prime sign in source equation (3.19).

Let

\[
 C_\lambda(a)=
 \sinh\!\left({L-a\over2}\right)
 -{L-a\over2}\cosh(a/2),\qquad 0\leq a\leq L.         \tag{1.5}
\]

The negative pole plus the complete minus-prime quadratic form on the full
pole vector is

\[
 \mathcal P_\lambda
 =-2\mu_\lambda^2
 -2\sum_{1<n\leq X}{\Lambda(n)\over\sqrt n}
                  C_\lambda(\log n).                  \tag{1.6}
\]

The archimedean part is

\[
 \mathcal A_\lambda=
 \int_{\mathbb R}|\widehat p_\lambda(t)|^2
 \left\{\operatorname {Re}\psi_\Gamma
       \!\left({1\over4}+{it\over2}\right)-\log\pi\right\}
 {dt\over2\pi}.                                      \tag{1.7}
\]

Thus the complete signed pole-axis quantity considered here is

\[
 \boxed{\mathcal G_\lambda=
        \mathcal P_\lambda+\mathcal A_\lambda.}       \tag{1.8}
\]

Define the right-continuous arithmetic functions

\[
 E(X)=\psi_C(X)-X,\qquad
 \mathcal D(X)=\sum_{1<n\leq X}{\Lambda(n)\over n}
                   -\log X,                            \tag{1.9}
\]

and the continuous first Riesz mean

\[
 \boxed{
 F(X)=\int_1^X{E(t)\over t}\,dt
 =\sum_{1<n\leq X}\Lambda(n)\log(X/n)-X+1.}          \tag{1.10}
\]

The equality in (1.10) retains an endpoint prime power: its newly introduced
weight is zero, so `F` is continuous there.

Finally set

\[
 \boxed{
 c_0=1+{\gamma_E\over2}-\log(2\sqrt\pi)>0.}           \tag{1.11}
\]

For orientation, directed elementary enclosures give
`0.02309<c_0<0.02310`.  Positivity needs no decimal assumption; for example,
the standard elementary bounds `gamma_E>0.57` and
`log(2*sqrt(pi))<1.27` already give a strict rational margin.

### Theorem 1.1 (unconditional retained-Riesz asymptotic)

As `lambda` tends to infinity through arbitrary real values,

\[
 \boxed{
 {\mathcal G_\lambda\over\lambda}
 =c_0+{F(\lambda^2)\over2\lambda}+o(1).}              \tag{1.12}
\]

The Riesz term is retained with its sign.  In particular, (1.12) does not
assert that it is little-oh of `lambda`.

**Proof.**  The exact identity already derived from (1.5)--(1.6) is

\[
\begin{aligned}
 \mathcal P_\lambda={}&
 \lambda\{1-\mathcal D(X)\}+{E(X)\over\lambda}
 +{1\over2}\int_1^X{E(t)+\mathcal D(t)\over t}\,dt\\
 &-{L^2\over4}-{L\over\lambda}
 +{1\over2}-{1\over2X}.                              \tag{1.13}
\end{aligned}
\]

The pinned prime-number-theorem estimate gives

\[
 {E(X)\over X}\longrightarrow0.                      \tag{1.14}
\]

Partial summation gives

\[
 \mathcal D(X)
 =1+{E(X)\over X}+\int_1^X{E(t)\over t^2}\,dt.       \tag{1.15}
\]

The pinned quantitative estimate makes the last integral absolutely
convergent at infinity.  Its value follows directly from the Laurent
expansion at one.  Indeed, for real `s>1`,

\[
 \int_1^\infty\psi_C(t)t^{-s-1}\,dt
 =-{1\over s}{\zeta'(s)\over\zeta(s)}.                \tag{1.16}
\]

Writing `s=1+epsilon` and using

\[
 {\zeta'(s)\over\zeta(s)}
 =-{1\over\epsilon}+\gamma_E+O(\epsilon)             \tag{1.17}
\]

shows

\[
 \int_1^\infty{E(t)\over t^2}\,dt=-1-\gamma_E.
\]

Consequently

\[
 \mathcal D(X)\longrightarrow-\gamma_E,qquad
 {1\over\lambda}\int_1^X{\mathcal D(t)\over t}\,dt
 \longrightarrow0.                                   \tag{1.18}
\]

Divide (1.13) by `lambda`, use (1.10), and retain
`F(X)/(2*lambda)`.  Every other nonconstant displayed term tends to zero,
and hence

\[
 {\mathcal P_\lambda\over\lambda}
 =1+\gamma_E+{F(X)\over2\lambda}+o(1).                \tag{1.19}
\]

The source-pinned archimedean calculation gives

\[
 {\mathcal A_\lambda\over\lambda}
 \longrightarrow
 -{\gamma_E+2\log2+\log\pi\over2}.                  \tag{1.20}
\]

Adding (1.19) and (1.20) gives (1.12), with the exact constant
(1.11).  \(\square\)

## 2. An eventual-nonnegative Mellin lemma

The following elementary form of Landau's theorem is included so that the
one-sided argument below does not hide an oscillation hypothesis.

### Lemma 2.1 (real abscissa singularity)

Let `g` be locally integrable on `[1,infinity)`, and suppose that `g(x)>=0`
for all sufficiently large `x`.  Remove the initial compact interval, and
let

\[
 G(s)=\int_{x_0}^\infty g(x)x^{-s-1}\,dx              \tag{2.1}
\]

have a finite real abscissa of convergence `sigma_c`.  Then `G` cannot be
holomorphic in a neighborhood of the real point `s=sigma_c`.

Equivalently, if a meromorphic continuation of (2.1) is holomorphic at
every real point of an interval `(sigma_0,infinity)`, then
`sigma_c<=sigma_0`.  The same conclusion is immediate if the transform
converges for every real `s`.

**Proof.**  Assume that `G` is holomorphic in a disk of radius `r>0` about
`sigma_c`.  It is also holomorphic in the convergence half-plane.  Put

\[
 a=\sigma_c+{r\over4}.
\]

The union of that disk and the convergence half-plane contains the disk of
radius `r/2` about `a`: points of this disk to the right of `sigma_c` are in
the half-plane, while points to its left are within `3r/4` of `sigma_c`.

Differentiation under the absolutely convergent integral at `a` gives

\[
 (-1)^nG^{(n)}(a)
 =\int_{x_0}^\infty
 g(x)x^{-a-1}(\log x)^n\,dx\geq0.                     \tag{2.2}
\]

Choose `0<epsilon<r/4` and put `z=r/4+epsilon<r/2`.
Taylor convergence at `a-z` and Tonelli's theorem give

\[
\begin{aligned}
 G(a-z)
 &=\sum_{n\geq0}{z^n\over n!}
   \int_{x_0}^\infty
       g(x)x^{-a-1}(\log x)^n\,dx\\
 &=\int_{x_0}^\infty g(x)x^{-a-1}e^{z\log x}\,dx
 =\int_{x_0}^\infty g(x)x^{-(a-z)-1}\,dx.            \tag{2.3}
\end{aligned}
\]

Thus the defining integral converges at

\[
 a-z=\sigma_c-\epsilon,
\]

contradicting the definition of the abscissa.  Removing or restoring a
compact initial interval changes the transform by an entire function, so
eventual nonnegativity is sufficient.  \(\square\)

## 3. A one-sided theorem for the first Riesz mean

For `Re(s)>1`, direct Tonelli summation in (1.10) gives

\[
 \boxed{
 \int_1^\infty F(X)X^{-s-1}\,dX
 =-{1\over s^2}{\zeta'(s)\over\zeta(s)}
 -{1\over s(s-1)}.}                                   \tag{3.1}
\]

The singularities at `s=1` on the right side cancel.  Also, zeta has no real
zero in `(0,1)`: for real `0<s<1`, grouping consecutive terms makes the
Dirichlet eta function positive, while

\[
 \zeta(s)={\eta(s)\over1-2^{1-s}}<0.                  \tag{3.2}
\]

Thus the right side of (3.1) is holomorphic at every real `s>1/2`.

### Theorem 3.1 (unconditional favorable one-sided limsup)

Unconditionally,

\[
 \boxed{
 \limsup_{X\to\infty}{F(X)\over\sqrt X}\geq0.}       \tag{3.3}
\]

More sharply, if any nontrivial zero has real part greater than `1/2`, then

\[
 \boxed{
 \limsup_{X\to\infty}{F(X)\over\sqrt X}=+\infty.}    \tag{3.4}
\]

**Proof: a zero to the right.**  Suppose that `rho` is a nontrivial zero
with `Re(rho)>1/2`, and suppose for contradiction that the limsup in (3.4)
is finite.  Choose a positive constant `C` and `X_0` such that

\[
 F(X)\leq C\sqrt X,\qquad X\geq X_0.                  \tag{3.5}
\]

Then

\[
 g(X)=C\sqrt X-F(X)\geq0,qquad X\geq X_0.            \tag{3.6}
\]

The elementary bound `F(X)=O(X log^2(2X))` makes the Mellin transform of
`g` converge in some right half-plane.  On `Re(s)>1`, it is

\[
 \int_{X_0}^\infty g(X)X^{-s-1}\,dX
 ={C X_0^{1/2-s}\over s-1/2}-M_F(s)+H_0(s),           \tag{3.7}
\]

where `M_F` denotes the left side of (3.1) and `H_0` is the entire transform
of the removed compact interval.

The meromorphic continuation in (3.7) is holomorphic at every real
`s>1/2`, by (3.1)--(3.2) and the cancellation at one.  Lemma 2.1 therefore
puts the abscissa of convergence of the nonnegative transform at or to the
left of `1/2`.  Hence its integral converges absolutely and defines a
holomorphic function throughout `Re(s)>1/2`.

On the tail, (3.6) also gives

\[
 |F(X)|\leq g(X)+C\sqrt X.                             \tag{3.8}
\]

It follows that the defining Mellin integral for `M_F` itself converges
absolutely and is holomorphic throughout `Re(s)>1/2`.  By (3.1), this would
make its meromorphic continuation holomorphic there.  But
`-(zeta'/zeta)(s)/s^2` has a nonremovable pole at `rho`, while the rational
term is regular there.  This contradiction proves (3.4).

**Proof: no zero to the right.**  Suppose instead that there is no
nontrivial zero with real part greater than `1/2`.  Functional-equation
symmetry then places every nontrivial zero on the critical line: any zero to
the left would have a reflected zero to the right.

Write `rho=1/2+i*gamma` and `u=log X`.  The absolutely convergent first-Riesz
explicit formula gives, uniformly in `u`,

\[
 {F(e^u)\over e^{u/2}}=-H(u)+o(1),
 \qquad
 H(u)=\sum_\rho{e^{i\gamma u}\over\rho^2}.            \tag{3.9}
\]

The zero-count bound gives `sum_rho |rho|^(-2)<infinity`, so the series for
`H` converges absolutely and uniformly.  There is no zero with `gamma=0`
by (3.2).  Termwise integration therefore gives the Bohr mean

\[
 \lim_{T\to\infty}{1\over T}\int_0^T H(u)\,du=0.      \tag{3.10}
\]

If the limsup in (3.3) were negative, equations (3.9) and (3.10) would force
`H(u)` to be bounded below by a fixed positive constant for all sufficiently
large `u`, contradicting its zero mean.  This proves (3.3) in the remaining
case and completes the unconditional case split.  \(\square\)

The proof did not assume which side of the case split is true.  In
particular, the second branch is not imported as a hypothesis.

### Theorem 3.2 (unconditional neutral Riesz sequence)

There is an unbounded sequence `X_j` for which

\[
 \boxed{F(X_j)=0.}                                      \tag{3.11}
\]

If a nontrivial zero has real part greater than `1/2`, the stronger
two-sided oscillation holds:

\[
 \boxed{
 \limsup_{X\to\infty}{F(X)\over\sqrt X}=+\infty,
 \qquad
 \liminf_{X\to\infty}{F(X)\over\sqrt X}=-\infty.}     \tag{3.12}
\]

**Proof.**  In the zero-to-the-right branch, Theorem 3.1 proves the first
part of (3.12).  For the second, suppose instead that
`F(X)>=-C*sqrt(X)` eventually and apply Lemma 2.1 to the nonnegative function

\[
 g(X)=C\sqrt X+F(X).                                    \tag{3.13}
\]

Its transform is
`C*X_0^(1/2-s)/(s-1/2)+M_F(s)` plus an entire compact-interval term.  It is
holomorphic at every real `s>1/2`.  The same abscissa argument as in
(3.7)--(3.8) makes the defining integral for `M_F` absolutely holomorphic
throughout `Re(s)>1/2`, contradicting its pole at the nonreal zero.  Thus the
second part of (3.12) holds.  Continuity of `F`, including at prime powers by
(1.10), gives unbounded zeros between alternating sign points.

In the no-zero-to-the-right branch, all nontrivial zeros lie on the critical
line and (3.9) holds.  The function `H` is real and uniformly almost periodic
with Bohr mean zero.  It is not identically zero: after grouping equal
ordinates, the pinned global zero-count theorem supplies at least one
nontrivial zero and the absolute convergence gives

\[
 M(|H|^2)=\sum_{\gamma\ {\rm distinct}}
 \left|{m_\gamma\over(1/2+i\gamma)^2}\right|^2>0.      \tag{3.14}
\]

A nonzero real uniformly almost-periodic function of mean zero takes both
positive and negative values: if it were nonnegative, relative-dense
recurrence of one positive value would force a positive mean, and similarly
for a nonpositive function.  Uniform recurrence makes both signs occur
arbitrarily far to the right.  Equation (3.9) transfers
those strict signs to `F(e^u)/e^(u/2)` for arbitrarily large `u`.
Continuity again supplies unbounded zeros.  This proves (3.11) in both
branches without assuming which branch holds.  \(\square\)

## 4. Transfer to the locked half-integer grid

Let

\[
 \mathcal L_{\rm lock}
 =\left\{{p\over2}:p\geq5\text{ is odd}\right\}.      \tag{4.1}
\]

### Lemma 4.1 (square-root-scale continuity)

If `X,Y` tend to infinity and

\[
 |Y-X|=O(\sqrt X),                                    \tag{4.2}
\]

then

\[
 F(Y)-F(X)=o(\sqrt X).                                \tag{4.3}
\]

**Proof.**  The exact integral definition gives

\[
 F(Y)-F(X)=\int_X^Y{E(t)\over t}\,dt.                 \tag{4.4}
\]

The prime number theorem says `E(t)/t=o(1)`, uniformly once the lower
endpoint tends to infinity.  Multiplication by the interval length in
(4.2) proves (4.3).  \(\square\)

For every real `lambda`, choose a locked `lambda'` with
`|lambda'-lambda|<=1/2`.  Then

\[
 |(\lambda')^2-\lambda^2|=O(\lambda).                 \tag{4.5}
\]

Lemma 4.1 shows that replacing `lambda` by `lambda'` changes
`F(lambda^2)/lambda` by `o(1)`.

### Theorem 4.2 (favorable locked subsequence)

One has the unconditional locked-grid bound

\[
 \boxed{
 \limsup_{\substack{\lambda\to\infty\\
                     \lambda\in\mathcal L_{\rm lock}}}
 {\mathcal G_\lambda\over\lambda}\geq c_0.}          \tag{4.6}
\]

Consequently, there are infinitely many locked parameters for which

\[
 \boxed{
 \mathcal G_\lambda>{c_0\over2}\lambda.}             \tag{4.7}
\]

**Proof.**  Take a sequence approaching the limsup in Theorem 3.1, put
`lambda=sqrt(X)`, and move to the nearest locked point.  Equations
(4.3)--(4.5) preserve the normalized lower limsup.  Now apply (1.12).
Since the resulting limsup is at least `c_0`, the weaker strict threshold
(4.7) is attained infinitely often.  \(\square\)

This theorem also gives a source-only deterministic selection rule.  Enumerate
the locked parameters and use directed interval evaluation of (1.6)--(1.8)
until (4.7) is certified; after a hit, resume above it.  Dovetailing the
candidate and precision loops avoids trusting a failed finite-precision
comparison.  Theorem 4.2 proves that this procedure emits infinitely many
parameters.  It uses finite von Mangoldt sums and the archimedean integral,
not a list of zeros.

### Theorem 4.3 (neutral locked subsequence)

There are locked parameters `lambda_j->infinity` for which

\[
 \boxed{
 {F(\lambda_j^2)\over\lambda_j}\longrightarrow0,
 \qquad
 {\mathcal G_{\lambda_j}\over\lambda_j}\longrightarrow c_0.}
                                                               \tag{4.8}
\]

**Proof.**  Choose an increasing sequence of roots `X_j` from Theorem 3.2, put
`lambda_j^*=sqrt(X_j)`, and move each to a nearest locked parameter
`lambda_j`.  Equations (4.3)--(4.5) give

\[
 F(\lambda_j^2)=F(X_j)+o(\sqrt{X_j})=o(\lambda_j).
\]

The second limit in (4.8) is now Theorem 1.1.  \(\square\)

This subsequence is source-selectable without a zero table.  For target
accuracy `1/j`, scan locked parameters above the previous hit and use
directed evaluation of the finite formula (1.10) until
`|F(lambda^2)|<lambda/j` is certified.  Dovetail the candidate and precision
loops so that an unresolved non-hit cannot stall the search.  Theorem 4.3
proves termination of each dovetailed search.  This stronger rule may replace
the favorable threshold rule when a pole-axis limit, rather than only a
positive lower bound, is useful.

## 5. Why coefficientwise absolute values still give no margin

This section is conditional only as a description of the critical-line
branch; it is not used in Theorem 4.2.

If all nontrivial zeros lie on the critical line, the existing explicit
formula gives

\[
 {\mathcal G_\lambda\over\lambda}
 =c_0-\operatorname {Re}
 \sum_{\substack{\rho=1/2+i\gamma\\\gamma>0}}
 {X^{i\gamma}\over(1/2+i\gamma)^2}+o(1).              \tag{5.1}
\]

The symmetric Hadamard identity at one is

\[
 {\xi'(1)\over\xi(1)}
 =\sum_\rho{1\over\rho}
 =1+{\gamma_E\over2}-\log(2\sqrt\pi)=c_0.            \tag{5.2}
\]

Pairing conjugate critical-line zeros in (5.2), with multiplicities, gives

\[
 \boxed{
 \sum_{\gamma>0}{1\over1/4+\gamma^2}=c_0.}           \tag{5.3}
\]

But

\[
 \left|{1\over(1/2+i\gamma)^2}\right|
 ={1\over1/4+\gamma^2}.                               \tag{5.4}
\]

Thus the center in (5.1) equals the complete `l^1` amplitude of its
oscillatory series.  Replacing that series by the sum of the absolute values
produces exactly the lower constant

\[
 c_0-c_0=0,                                           \tag{5.5}
\]

not a strict reserve.  The favorable-subsequence argument works because it
uses the signed mean or one-sided Landau alternative; a zero-by-zero triangle
inequality cannot replace it.

## 6. Qualitative transfer to exact finite Fourier compressions

Let `P_N` be the centered Fourier projector onto

\[
 \phi_n(x)=(-1)^nL^{-1/2}e^{2\pi i n x/L},
 \qquad -N\leq n\leq N,                               \tag{6.1}
\]

and put

\[
 p_{\lambda,N}=P_Np_\lambda.                          \tag{6.2}
\]

Because `p_lambda` is odd and `P_N` commutes with reflection,
`p_(lambda,N)` belongs to the exact inversion-odd sector.

For an odd function `f` supported on `I_lambda`, write the complete source
quadratic form as

\[
 \mathfrak q_\lambda[f]
 =\int_{\mathbb R}m_\lambda(t)|\widehat f(t)|^2
                     {dt\over2\pi}
 -2|\langle p_\lambda,f\rangle|^2.                   \tag{6.3}
\]

With the convention (1.4),

\[
 \mathfrak q_\lambda[p_\lambda]=\mathcal G_\lambda. \tag{6.4}
\]

### Lemma 6.1 (form convergence of the pole Fourier sums)

For every fixed `lambda>1`,

\[
 \boxed{
 \mathfrak q_\lambda[p_{\lambda,N}]
 \longrightarrow\mathcal G_\lambda,qquad
 \|p_{\lambda,N}\|^2\longrightarrow\mu_\lambda.}   \tag{6.5}
\]

**Proof.**  Regard `p_lambda` as a periodic function on the interval with
its endpoints identified.  It is smooth away from the single endpoint jump,
and its exact Fourier coefficients are `O_lambda(1/|n|)`.  Hence

\[
 p_\lambda\in H^s(\mathbb T_L),qquad 0\leq s<1/2,
\]

and its symmetric Fourier sums converge in that norm.  Restriction to the
interval followed by zero extension is bounded from `H^s(I_lambda)` to
`H^s(R)` for `0<=s<1/2`.  Therefore, for any fixed such positive `s`,

\[
 \|p_{\lambda,N}-p_\lambda\|_{H^s(\mathbb R)}
 \longrightarrow0.                                   \tag{6.6}
\]

For fixed `lambda`, the finite prime sum in (1.4) is bounded.  The digamma
formula gives

\[
 |2\theta'(t)|\leq C_\lambda\{1+\log(2+|t|)\}.        \tag{6.7}
\]

For every `s>0`, the logarithm is bounded by a constant times
`(1+t^2)^s`; for instance
`log(2+|t|)<=log(2)+|t|^(2s)/(2s)`.  Equations (6.6)--(6.7), Plancherel,
and polarization therefore show convergence of the multiplier quadratic
form in (6.3).  The pole functional is continuous in `L^2`, and ordinary
Fourier projection gives the asserted norm convergence.  This proves
(6.5).  \(\square\)

The convergence in Lemma 6.1 is qualitative.  It does not assert that a
previously chosen polynomial or logarithmic cutoff already has the required
weighted form accuracy.

### Corollary 6.2 (finite projected favorable direction)

There are locked `lambda_j->infinity` and integers `N_j>=j` such that

\[
 \boxed{
 \mathfrak q_{\lambda_j}[p_{\lambda_j,N_j}]
 \geq {3c_0\over8}\lambda_j.}                         \tag{6.8}
\]

If

\[
 e_j={p_{\lambda_j,N_j}\over
             \|p_{\lambda_j,N_j}\|},                 \tag{6.9}
\]

then the exact finite odd Weil matrix satisfies

\[
 \boxed{
 \alpha_j:=\langle e_j,Q_{\lambda_j,N_j}e_j\rangle
 \geq {3c_0\over4}.}                                 \tag{6.10}
\]

**Proof.**  Choose the locked sequence from (4.7).  For each fixed member,
Lemma 6.1 permits an `N_j>=j` for which

\[
 \left|\mathfrak q_{\lambda_j}[p_{\lambda_j,N_j}]
       -\mathcal G_{\lambda_j}\right|
 <{c_0\over8}\lambda_j.                              \tag{6.11}
\]

This proves (6.8).  Orthogonal projection gives

\[
 \|p_{\lambda_j,N_j}\|^2
 \leq\mu_{\lambda_j}<\lambda_j/2.                    \tag{6.12}
\]

Divide (6.8) by (6.12) to obtain (6.10).  \(\square\)

The `N_j` can also be selected by a source-only dovetailed replay: increase
`N` and arithmetic precision until (6.11) is certified by the exact finite
matrix assembly.  Lemma 6.1 proves eventual termination at every selected
`lambda_j`.  This is an existence and replay theorem, not a cost estimate.

## 7. The exact remaining harmonic-short hypothesis

Corollary 6.2 proves a positive diagonal entry.  A diagonal entry is not a
Schur complement.

Fix one selected pair and abbreviate

\[
 Q=Q_{\lambda_j,N_j}|_{E_{N_j}^-},qquad e=e_j,
 \qquad \alpha=\langle e,Qe\rangle.                   \tag{7.1}
\]

For a desired shift `beta`, put `G=e^perp` and define

\[
 C_\beta=P_G(Q-\beta I)P_G,qquad
 b=P_GQe.                                              \tag{7.2}
\]

The shift does not enter the cross because `P_Ge=0`.  Relative to
`span(e) direct-sum G`,

\[
 Q-\beta I=
 \begin{bmatrix}
  \alpha-\beta&b^*\\
  b&C_\beta
 \end{bmatrix}.                                       \tag{7.3}
\]

The ordinary Schur theorem gives the exact equivalence

\[
 \boxed{
 Q\succ\beta I
 \quad\Longleftrightarrow\quad
 C_\beta\succ0
 \ \hbox{and}\
 \alpha-\beta-\langle b,C_\beta^{-1}b\rangle>0.}   \tag{7.4}
\]

For example, choose the fixed shift

\[
 \beta={c_0\over4}.                                   \tag{7.5}
\]

Equation (6.10) gives

\[
 \alpha-\beta\geq{c_0\over2}.                       \tag{7.6}
\]

Thus the remaining sufficient finite theorem is the strict pair

\[
 \boxed{
 C_{c_0/4}\succ0,qquad
 \langle b,C_{c_0/4}^{-1}b\rangle<{c_0\over2}.}      \tag{7.7}
\]

Nothing in Sections 1--6 proves either assertion in (7.7).

The same point in the pole-augmented notation of the preceding obstruction
note is as follows.  Write the positive base relative to
`span(e) direct-sum e^perp` as

\[
 M+A=\begin{bmatrix}a&c^*\\c&D\end{bmatrix},
 \qquad p=\sqrt\mu\,e,                                \tag{7.8}
\]

so the complete odd operator is

\[
 B_A=M+A-2|p\rangle\langle p|.                        \tag{7.9}
\]

Its pole-axis surplus and exact harmonic short are

\[
 \alpha=a-2\mu,qquad
 s_A=\alpha-c^*D^{-1}c.                               \tag{7.10}
\]

For the retained-excess load

\[
 \mathcal L_A=2\langle p,(M+A)^{-1}p\rangle,
\]

block inversion gives the exact identity

\[
 \boxed{
 s_A=2\mu\left({1\over\mathcal L_A}-1\right).}       \tag{7.11}
\]

The favorable-subsequence theorem lower-bounds `alpha`; it does not
upper-bound `c^*D^(-1)c`.  If a future source estimate proves

\[
 c^*D^{-1}c\leq\alpha-\delta,
 \qquad \delta>0,                                     \tag{7.12}
\]

then (7.11) gives the actual strict load margin

\[
 \boxed{
 \mathcal L_A\leq{2\mu\over2\mu+\delta}
 =1-{\delta\over2\mu+\delta}<1.}                    \tag{7.13}
\]

Since `mu<lambda/2`, a fixed `delta` gives at least the explicit load gap
`delta/(lambda+delta)`.  Conversely, without (7.12), even a large positive
pole-axis expectation can be canceled completely by transverse coupling.

A convenient sufficient version of (7.4), when a transverse floor
`C_beta>=kappa*I` is available, is

\[
 \boxed{
 \|P_GQe\|^2<\kappa(\alpha-\beta).}                  \tag{7.14}
\]

This is a combined residual-before-absolute-values target.  It cannot be
replaced by separate pole, archimedean, and prime residual norms without
losing the cancellation established in Section 1.

## 8. Exact conclusion

The first-Riesz little-oh route fails because `F(X)` has an unavoidable
square-root-scale oscillatory component.  The correct replacement proved
here is an existential but source-selectable favorable subsequence:

\[
 \mathcal G_\lambda\gg\lambda
\]

on infinitely many locked half-integers, followed by a qualitative exact
finite-projection transfer.  This removes the pole-axis sign as an
obstruction on that subsequence.

The proof frontier is now narrower and exact: on the same selected finite
schedule, establish the transverse positivity and inverse-weighted cross
bound in (7.4), or equivalently the harmonic-short deficit (7.12), while
also meeting the existing central and exterior alignment obligations.  No
such estimate is proved in this note, so the formal project state remains
`P0_INVALIDATED`.
