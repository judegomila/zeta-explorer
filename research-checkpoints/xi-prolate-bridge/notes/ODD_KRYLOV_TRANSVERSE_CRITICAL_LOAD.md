# Odd Krylov transverse short and critical-load obstruction

## 0. Claim boundary

This note isolates what remains after the favorable locked-subsequence
theorem for the complete odd-pole form.  It proves five exact facts.

1. On the pole complement, both the cross vector and the transverse block
   are independent of the explicit negative rank-one pole.
2. The first three combined Weil moments give an exact two-dimensional
   necessary sign test, and a source-frozen Krylov solve gives rigorous
   lower and upper bounds for the inverse-weighted cross load once a
   transverse floor has been proved independently.
3. On every successful unbounded odd schedule, the retained-excess load is
   necessarily critical: it tends to one from below rather than staying a
   fixed distance below one.
4. For the unprojected pole, every locked parameter has uncancelled
   prime-power jumps in the transverse residual.  Thus the favorable pole
   direction is never an exact eigenvector.
5. Parameter derivatives see only tangent projections of the residual, and
   scalar pole data, residual norms, and transverse eigenvalues do not
   determine the signed Schur orientation.

These results sharpen the remaining obligation; they do not prove the
transverse floor, the odd signed floor, either complete signed sector floor,
equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform determinant
convergence, or the Riemann hypothesis.  No list of zeta zeros, global Weil
positivity, or reality of the nontrivial zeros is assumed.  The formal
project state remains `P0_INVALIDATED`.

The exact source conventions are those of `P0_SOURCE_LOCK.json`,
`P0_MATRIX_FORMULAS.md`,
`notes/ODD_POLE_HARMONIC_CHEBYSHEV_OBSTRUCTION.md`, and
`notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md`.  In particular, the Fourier
sign, inclusive prime-power endpoint, and minus-prime sign are unchanged.

## 1. Exact finite pole-complement reduction

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I_\lambda=[-\ell,\ell],                               \tag{1.1}
\]

and use

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi}.                         \tag{1.2}
\]

Let `mathcal H` be a finite inversion-odd comparison space, in particular
the odd part of a centered Fourier compression.  Let

\[
 p=P_{\mathcal H}p_-,\qquad p_-(x)=\sinh(x/2),
 \qquad \mu=\|p\|^2.                                  \tag{1.3}
\]

Assume `mu>0`, put

\[
 e={p\over\sqrt\mu},\qquad
 P=I-|e\rangle\langle e|,\qquad G=e^\perp,             \tag{1.4}
\]

and let `Q` denote the exact finite odd Weil matrix.  The parity form of the
pole identity in the preceding notes gives

\[
 \boxed{Q=T-2|p\rangle\langle p|,}                    \tag{1.5}
\]

where `T` is the finite compression of the complete non-pole multiplier

\[
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                 \tag{1.6}
\]

The endpoint in (1.6) is inclusive.  The displayed minus sign is the
minus-prime sign in source equation (3.19).

Define the pole-axis value, cross vector, and shifted transverse block by

\[
 \alpha=\langle e,Qe\rangle,\qquad
 b=PQe,\qquad
 C_\beta=P(Q-\beta I)P\big|_G.                          \tag{1.7}
\]

### Theorem 1.1 (the pole disappears from the transverse data)

One has the exact identities

\[
 \boxed{
 \alpha=\langle e,Te\rangle-2\mu,\qquad
 b=PTe,\qquad
 C_\beta=P(T-\beta I)P\big|_G.}                        \tag{1.8}
\]

Moreover, the complete centered residual is

\[
 \boxed{
 (Q-\alpha I)e
 =(T-\langle e,Te\rangle I)e=b,}                       \tag{1.9}
\]

and hence

\[
 \boxed{
 \|b\|^2=\langle e,Q^2e\rangle-\alpha^2.}             \tag{1.10}
\]

**Proof.**  Since `Pe=0` and `p=sqrt(mu)*e`, the rank-one term in
(1.5) is parallel to `e` and is killed by `P` on either side.  This proves
(1.8).  Subtracting the scalar expectation proves (1.9), and taking its
squared norm proves (1.10).  \(\square\)

Equation (1.10) is a combined-source identity.  An implementation must
first assemble

\[
 Q=Q_{\rm pole}+Q_{\rm arch}+Q_{\rm prime}
\]

with the source signs and only then form `Q^2`.  Replacing (1.10) by the sum
of the three separate residual norms discards the archimedean--prime cross
term and is not the same quantity.

Relative to `C*e direct-sum G`, one has

\[
 Q-\beta I=
 \begin{bmatrix}
  \alpha-\beta&b^*\\
  b&C_\beta
 \end{bmatrix}.                                       \tag{1.11}
\]

Consequently, if `C_beta` is strictly positive and

\[
 \chi_\beta=\langle b,C_\beta^{-1}b\rangle,             \tag{1.12}
\]

then

\[
 \boxed{
 Q-\beta I\succ0
 \quad\Longleftrightarrow\quad
 C_\beta\succ0\ \hbox{ and }\
 \alpha-\beta-\chi_\beta>0.}                          \tag{1.13}
\]

The favorable-subsequence theorem controls the first scalar in (1.13).
It controls neither of the two remaining assertions.

## 2. Three-moment obstruction

For `j>=0`, put

\[
 m_j=\langle e,Q^je\rangle,
 \qquad m_0=1,qquad m_1=\alpha.                        \tag{2.1}
\]

Define

\[
 \sigma^2=m_2-\alpha^2=\|b\|^2.                        \tag{2.2}
\]

When `sigma>0`, let `v=b/sigma`.  Finally put

\[
 \nu_\beta=\langle b,C_\beta b\rangle.                 \tag{2.3}
\]

### Theorem 2.1 (exact two-step moment test)

Assume `sigma>0`.  The transverse first moment is

\[
 \boxed{
 \nu_\beta
 =m_3-(2\alpha+\beta)m_2+\alpha^3+\beta\alpha^2.}     \tag{2.4}
\]

If `C_beta` is strictly positive, then

\[
 \boxed{
 \chi_\beta\geq{\sigma^4\over\nu_\beta}.}             \tag{2.5}
\]

Therefore positivity of `Q-beta*I` necessarily requires

\[
 \boxed{
 \nu_\beta>0,
 \qquad
 (\alpha-\beta)\nu_\beta>\sigma^4.}                   \tag{2.6}
\]

Equality in either strict comparison is rejected.

**Proof.**  Since `b=(Q-alpha*I)e` and `b` belongs to `G`,

\[
 \nu_\beta
 =\langle e,(Q-\alpha I)^2(Q-\beta I)e\rangle.
\]

Expanding the cubic polynomial gives (2.4).  If `C_beta>0`, then

\[
 \sigma^2
 =\langle C_\beta^{-1/2}b,C_\beta^{1/2}b\rangle
 \leq\chi_\beta^{1/2}\nu_\beta^{1/2},
\]

which proves (2.5).  In the orthonormal basis `(e,v)`, the corresponding
principal block is

\[
 \begin{bmatrix}
  \alpha-\beta&\sigma\\
  \sigma&\nu_\beta/\sigma^2
 \end{bmatrix}.                                       \tag{2.7}
\]

Its positive determinant is exactly the second inequality in (2.6).
\(\square\)

The test uses only the first three moments of the fully assembled source
matrix.  It is an invalidation test, not a sufficient sign theorem for the
orthogonal complement of `(e,v)`.

If `sigma=0`, then `b=0`, the inverse load is zero, and (1.13) reduces
exactly to `C_beta>0` and `alpha>beta`; no Krylov solve is needed.

## 3. Exact Krylov enclosure of the inverse load

Assume now that an independent argument has established

\[
 \boxed{C_\beta\succeq\kappa I_G,\qquad\kappa>0.}       \tag{3.1}
\]

Also assume `sigma>0`; the zero-cross case was disposed of after
Theorem 2.1.

Let

\[
 \mathcal K_k
 =\operatorname {span}\{b,C_\beta b,\ldots,
                         C_\beta^{k-1}b\}.              \tag{3.2}
\]

Choose an orthonormal Krylov synthesis `V_k` with first column
`b/sigma`, and put

\[
 J_k=V_k^*C_\beta V_k.                                  \tag{3.3}
\]

Before exact Krylov breakdown, `J_k` is strictly positive.  Define the
Galerkin solve, its residual, and its energy by

\[
 x_k=V_kJ_k^{-1}V_k^*b,
 \qquad
 \rho_k=b-C_\beta x_k,
 \qquad
 \chi_k=\langle b,x_k\rangle.                          \tag{3.4}
\]

Thus

\[
 \chi_k=\sigma^2 e_1^*J_k^{-1}e_1.                     \tag{3.5}
\]

### Theorem 3.1 (Krylov lower and upper load bounds)

For every `k` for which (3.3)--(3.4) are defined,

\[
 \boxed{
 \chi_\beta
 =\chi_k+\langle\rho_k,C_\beta^{-1}\rho_k\rangle.}    \tag{3.6}
\]

Consequently,

\[
 \boxed{
 \chi_k\leq\chi_\beta
 \leq U_k:=\chi_k+{\|\rho_k\|^2\over\kappa}.}          \tag{3.7}
\]

At exact breakdown, `rho_k=0` and the finite Krylov value is the exact
inverse load.  At `k=1`, the lower bound in (3.7) is exactly

\[
 \chi_1={\sigma^4\over\nu_\beta}.                       \tag{3.8}
\]

**Proof.**  Let `x=C_beta^(-1)b`.  Galerkin orthogonality gives
`V_k^*rho_k=0`, and hence `x_k` is orthogonal to `x-x_k` in the
`C_beta` energy inner product.  Therefore

\[
 \begin{aligned}
 \chi_\beta
 &=\langle x,C_\beta x\rangle\\
 &=\langle x_k,C_\beta x_k\rangle
  +\langle x-x_k,C_\beta(x-x_k)\rangle\\
 &=\chi_k+\langle\rho_k,C_\beta^{-1}\rho_k\rangle.
 \end{aligned}
\]

Using (3.1) proves (3.7).  Formula (3.8) follows from
`J_1=nu_beta/sigma^2`.  \(\square\)

### Corollary 3.2 (finite pass, fail, and floor tests)

Put

\[
 a=\alpha-\beta.                                      \tag{3.9}
\]

Then:

1. if `chi_k>=a`, the shifted odd block is not strictly positive;
2. if `U_k<a`, the shifted odd block is strictly positive;
3. in the second case it has the explicit floor

\[
 \boxed{
 Q-\beta I\succeq
 {\min\{a-U_k,\kappa\}
  \over(1+\sqrt{U_k/\kappa})^2}I.}                     \tag{3.10}
\]

**Proof.**  The first two assertions follow from (1.13) and (3.7).  For the
floor, put `R=C_beta^(-1)b`.  Completing the square gives

\[
 \langle(x,y),(Q-\beta I)(x,y)\rangle
 =(a-\chi_\beta)|x|^2
 +\langle y+Rx,C_\beta(y+Rx)\rangle.                   \tag{3.11}
\]

Moreover,

\[
 \|R\|^2
 =\langle b,C_\beta^{-2}b\rangle
 \leq{\chi_\beta\over\kappa}
 \leq{U_k\over\kappa}.                               \tag{3.12}
\]

The inverse of `(x,y) mapsto (x,y+Rx)` has norm at most
`1+||R||`.  Equations (3.11)--(3.12) prove (3.10).  \(\square\)

Every object in this section can be reconstructed from source entries and
matrix products.  No stored eigensystem is needed.  Nevertheless, (3.1) is
an independent signed transverse theorem.  Krylov convergence cannot
manufacture it.

## 4. The successful load is necessarily critical

Retain (1.5)--(1.13), and suppose that `Q-beta*I` is strictly positive.  Put

\[
 s_\beta=\alpha-\beta-\chi_\beta>0.                    \tag{4.1}
\]

Then

\[
 T_\beta:=T-\beta I
 =(Q-\beta I)+2|p\rangle\langle p|\succ0.              \tag{4.2}
\]

Define the retained-excess load

\[
 \mathcal L_\beta
 =2\langle p,T_\beta^{-1}p\rangle
 =2\mu\langle e,T_\beta^{-1}e\rangle.                 \tag{4.3}
\]

### Theorem 4.1 (exact critical-load identity)

One has

\[
 \boxed{
 \mathcal L_\beta={2\mu\over2\mu+s_\beta},
 \qquad
 1-\mathcal L_\beta={s_\beta\over2\mu+s_\beta}.}      \tag{4.4}
\]

In particular,

\[
 \boxed{
 0<1-\mathcal L_\beta
 \leq{\alpha-\beta\over2\mu+\alpha-\beta}.}          \tag{4.5}
\]

**Proof.**  Relative to `C*e direct-sum G`, the matrix of `T_beta` is

\[
 \begin{bmatrix}
  2\mu+\alpha-\beta&b^*\\
  b&C_\beta
 \end{bmatrix}.                                       \tag{4.6}
\]

Its scalar Schur complement is `2*mu+s_beta`.  Block inversion gives
(4.4).  Since `chi_beta>=0`, one has
`s_beta<=alpha-beta`, proving (4.5).  \(\square\)

Now return to the complete unprojected pole form of
`notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md`.  There

\[
 \mu_\lambda
 ={\lambda-\lambda^{-1}-2\log\lambda\over2}
 \sim{\lambda\over2},                                  \tag{4.7}
\]

and

\[
 {\mathcal G_\lambda\over\lambda}
 =c_0+{F(\lambda^2)\over2\lambda}+o(1),
 \qquad
 \alpha_\lambda={\mathcal G_\lambda\over\mu_\lambda}.
                                                               \tag{4.8}
\]

The pinned prime number theorem gives `E(X)=psi_C(X)-X=o(X)`.  Therefore

\[
 F(X)=\int_1^X{E(t)\over t}\,dt=o(X).                   \tag{4.9}
\]

Indeed, after a fixed threshold the absolute value of the integrand is at
most an arbitrary positive constant, and the initial compact integral is
negligible after division by `X`.  Equations (4.7)--(4.9) imply

\[
 \boxed{\mathcal G_\lambda=o(\lambda^2),
 \qquad \alpha_\lambda=o(\lambda).}                   \tag{4.10}
\]

### Corollary 4.2 (no fixed load gap on a successful schedule)

Let `lambda_j` tend to infinity through favorable locked parameters.  If
the corresponding unprojected shifted odd operators pass and

\[
 \beta_j=o(\lambda_j),                                  \tag{4.11}
\]

then

\[
 \boxed{\mathcal L_{\beta_j}\longrightarrow1^- .}      \tag{4.12}
\]

In particular, the already-proved live shift
`beta_j=U_Z=o(d_6)` satisfies (4.11).  A fixed `eta>0` in a bound
`mathcal L_beta<=1-eta` cannot be the asymptotic route.

This statement does not rule out positivity.  It says that a successful
proof must resolve a vanishing load gap.  If a Schur reserve `s_beta` of
size `delta_lambda` is established, the exact gap is

\[
 {\delta_\lambda\over2\mu_\lambda+\delta_\lambda},      \tag{4.13}
\]

which is naturally one factor of `lambda` smaller than the Schur reserve.

The finite projected favorable theorem controls only a scalar form and a
norm.  A finite version of (4.12) additionally requires the selected
projection to satisfy

\[
 \mu_{\lambda,N}\sim\lambda/2
\]

and a scalar form error `o(lambda^2)`.  Both can be imposed qualitatively by
increasing `N` at each fixed favorable parameter, but this supplies no
uniform Galerkin rate for the cross vector or for `C_beta^(-1)`.

## 5. Exact physical prime action on the unprojected pole

This section concerns the full zero-extended function

\[
 p(x)=\sinh(x/2)1_{[-\ell,\ell]}(x),                    \tag{5.1}
\]

not a finite Fourier projection.  Define the right-continuous source sums

\[
 \psi_C(Y)=\sum_{1<n\leq Y}\Lambda(n),
 \qquad
 A_C(Y)=\sum_{1<n\leq Y}{\Lambda(n)\over n},             \tag{5.2}
\]

and put

\[
 y=\lambda e^x,\qquad z=\lambda e^{-x}.                 \tag{5.3}
\]

Multiplication by the prime part of (1.6) acts in physical space as

\[
 (T_{\rm prime}f)(x)
 =-\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
 \{f(x-\log n)+f(x+\log n)\}.                          \tag{5.4}
\]

The zero-extension convention is retained in (5.4).

### Theorem 5.1 (exact split-Chebyshev profile)

For every `x` in `[-ell,ell]`, apart from the null set of arithmetic cutoff
points,

\[
 \boxed{
 (T_{\rm prime}p)(x)
 ={e^{-x/2}\over2}\{\psi_C(y)+A_C(z)\}
 -{e^{x/2}\over2}\{A_C(y)+\psi_C(z)\}.}                \tag{5.5}
\]

Let

\[
 E(Y)=\psi_C(Y)-Y,
 \qquad
 \mathcal D(Y)=A_C(Y)-\log Y.                           \tag{5.6}
\]

Then (5.5) is equivalently

\[
\boxed{
\begin{aligned}
 T_{\rm prime}p={}&(\lambda-\ell)p-x\cosh(x/2)\\
 &+{1\over2}\{e^{-x/2}E(y)-e^{x/2}E(z)\\
 &\hspace{25mm}+e^{-x/2}\mathcal D(z)
                  -e^{x/2}\mathcal D(y)\}.
\end{aligned}}}                                        \tag{5.7}
\]

**Proof.**  In (5.4), the term `p(x-log n)` is present exactly when
`n<=y`, and `p(x+log n)` is present exactly when `n<=z`, with `y,z` as in
(5.3).  Expanding the two hyperbolic sines gives

\[
\begin{aligned}
 -\sum_{1<n\leq y}{\Lambda(n)\over\sqrt n}p(x-\log n)
 &=-{e^{x/2}\over2}A_C(y)
   +{e^{-x/2}\over2}\psi_C(y),\\
 -\sum_{1<n\leq z}{\Lambda(n)\over\sqrt n}p(x+\log n)
 &=-{e^{x/2}\over2}\psi_C(z)
   +{e^{-x/2}\over2}A_C(z).
\end{aligned}
\]

This proves (5.5).  Substitute
`psi_C(Y)=Y+E(Y)`, `A_C(Y)=log(Y)+mathcal D(Y)`,
`log(y)=ell+x`, and `log(z)=ell-x` to obtain (5.7).
\(\square\)

The favorable scalar

\[
 F(\lambda^2)=\int_1^{\lambda^2}{E(t)\over t}\,dt
\]

is one signed integral of the endpoint arithmetic error.  Formula (5.7)
shows that the transverse action depends on the complete interior profiles

\[
 E(\lambda e^x),\quad E(\lambda e^{-x}),\quad
 \mathcal D(\lambda e^x),\quad
 \mathcal D(\lambda e^{-x}).                            \tag{5.8}
\]

No implication from the sign of that one Riesz integral to a norm or
inverse-weighted bound for (5.8) has been proved.

## 6. Locked-grid prime jumps and the non-eigenvector theorem

The archimedean multiplier is

\[
 a(t)=2\theta'(t)
 =\operatorname {Re}\psi_\Gamma
       \!\left({1\over4}+{it\over2}\right)-\log\pi.     \tag{6.1}
\]

Let

\[
 T_{\rm arch}
 =C_\lambda^*\mathcal F^*M_a\mathcal F C_\lambda.       \tag{6.2}
\]

### Lemma 6.1 (interior regularity of the archimedean action)

If a compactly supported function `f` is smooth on an open subinterval
`U` of `(-ell,ell)`, then `T_arch f` has a smooth representative on every
compact subinterval of `U`.  In particular,

\[
 T_{\rm arch}p\quad\hbox{is continuous on }(-\ell,\ell).
                                                               \tag{6.3}
\]

**Proof sketch.**  The exact digamma series and its differentiated series
give

\[
 a(t)=O(1+\log(2+|t|)),
 \qquad
 a^{(r)}(t)=O_r((1+|t|)^{-r}),\quad r\geq1.             \tag{6.4}
\]

Only the qualitative decay in (6.4) is used here; no unspecified constant
is inserted into a finite inequality.  Choose a smooth cutoff `chi`
supported in `U` and equal to one near the compact interval under
consideration.  The Fourier transform of `chi*f` is rapidly decreasing,
so multiplication by the logarithmically growing symbol (6.1) still has a
smooth inverse transform.  For `(1-chi)f`, the observation interval and
the support are separated.  Repeated integration by parts using (6.4)
shows that the inverse-Fourier kernel of `a` is smooth away from the origin;
its convolution with `(1-chi)f` is therefore smooth on the observation
interval.  This proves the claim.  Equivalently, the constant-coefficient
digamma multiplier is pseudolocal and the only singularities of the
zero-extended `p` are at the two endpoints.  \(\square\)

This lemma is the precise archimedean hypothesis needed below.  It uses no
zero data and can also be rederived from the regularized continuous
translation density in the pinned archimedean distribution.  The important
point is that the archimedean source has no atom at a positive arithmetic
shift `log n`.

Now impose the locked grid

\[
 \lambda={p_0\over2},
 \qquad p_0\geq5\text{ odd},
 \qquad X=\lambda^2={p_0^2\over4}.                       \tag{6.5}
\]

For a prime power `n<X`, put

\[
 x_n=\log(n/\lambda).                                   \tag{6.6}
\]

Then `x_n` belongs to the open interval `(-ell,ell)`.

### Theorem 6.2 (exact locked prime jump)

At every `x_n` in (6.6), the right-minus-left jump of the prime action is

\[
 \boxed{
 (T_{\rm prime}p)(x_n+)-(T_{\rm prime}p)(x_n-)
 ={\Lambda(n)\over\sqrt n}\sinh(\ell/2)>0.}             \tag{6.7}
\]

No other arithmetic threshold coincides with `x_n` on the locked grid.
Consequently, if

\[
 \tau_\lambda={\langle p,(T_{\rm arch}+T_{\rm prime})p\rangle
                    \over\|p\|^2},                       \tag{6.8}
\]

the complete unprojected transverse numerator

\[
 R_\lambda
 =T_{\rm arch}p+T_{\rm prime}p-\tau_\lambda p          \tag{6.9}
\]

has the same nonzero jump (6.7).  In particular,

\[
 \boxed{R_\lambda\ne0}                                 \tag{6.10}
\]

for every locked `lambda>=5/2`.  The unprojected pole is never an exact
eigenvector of the complete odd operator.

**Proof.**  As `x` increases through `x_n`, the term
`p(x-log n)` in (5.4) enters through the left endpoint.  Since

\[
 p(x_n-\log n)=p(-\ell)=-\sinh(\ell/2),
\]

the entering minus-prime term has jump (6.7).  A coincident reflected
threshold would require `X/n` to be an integer.  But

\[
 {X\over n}={p_0^2\over4n}
\]

cannot be an integer because `p_0^2` is odd.  Distinct prime powers also
have distinct right thresholds.  Lemma 6.1 and continuity of `p` at the
interior point `x_n` show that neither `T_arch*p` nor the parallel term in
(6.9) contributes a jump there.  This proves (6.9)--(6.10).  The prime
power `n=2` is already present for every locked `lambda>=5/2`, so at least
one such jump always exists.  \(\square\)

The inclusion convention at the single point `x_n` does not affect the
`L2` function.  It fixes the right-continuous representative and the jump
orientation; the two one-sided limits and the nonzero distributional jump
are convention-independent.

Theorem 6.2 is strictly unprojected.  A finite Fourier projection smooths
the physical jumps.  Transferring (6.10), or any quantitative norm lower
bound, to

\[
 b_{\lambda,N}
 =P_{e_{\lambda,N}^\perp}Q_{\lambda,N}e_{\lambda,N}
\]

requires a separate graph-norm or preconditioned Galerkin theorem.  The
scalar form convergence in the favorable-subsequence note does not by
itself provide that result.

## 7. Parameter derivatives see only tangent projections

Work first in a fixed finite coefficient space.  Let `Q_theta` and a
normalized vector `e_theta` be differentiable in a real parameter `theta`.
Put

\[
 \alpha_\theta=\langle e_\theta,Q_\theta e_\theta\rangle,
 \qquad
 b_\theta=P_{e_\theta^\perp}Q_\theta e_\theta.          \tag{7.1}
\]

### Theorem 7.1 (corrected Rayleigh derivative)

One has

\[
 \boxed{
 \partial_\theta\alpha_\theta
 -\langle e_\theta,(\partial_\theta Q_\theta)e_\theta\rangle
 =2\operatorname {Re}
   \langle P_{e_\theta^\perp}\partial_\theta e_\theta,
           b_\theta\rangle.}                            \tag{7.2}
\]

Thus, when the tangent is nonzero,

\[
 \boxed{
 \|b_\theta\|
 \geq {\left|
 \partial_\theta\alpha_\theta
 -\langle e_\theta,(\partial_\theta Q_\theta)e_\theta\rangle
 \right|
 \over2\|P_{e_\theta^\perp}\partial_\theta e_\theta\|}.} \tag{7.3}
\]

**Proof.**  Differentiate the Rayleigh quotient.  Normalization gives
`Re<partial_theta e,e>=0`.  Decompose
`Qe=alpha*e+b`; the parallel contribution drops from the real part and
gives (7.2).  Cauchy--Schwarz gives (7.3).  \(\square\)

The derivative therefore supplies a residual projection, and possibly a
lower bound.  A small derivative says only that one tangent component is
small; it gives no upper bound for the component orthogonal to that tangent.

For several real parameters, put

\[
 t_j=P_{e^\perp}\partial_j e,
 \qquad
 d_j={1\over2}\left(
 \partial_j\alpha-\langle e,(\partial_jQ)e\rangle
 \right),
 \qquad
 G_{ij}=\operatorname {Re}\langle t_i,t_j\rangle.       \tag{7.4}
\]

Then the visible tangent projection obeys

\[
 \boxed{\|b\|^2\geq d^TG^\dagger d}                    \tag{7.5}
\]

whenever the consistency vector `d` belongs to the range of `G`.  Equality
requires `b` to lie in the tangent span, an additional hypothesis not
proved for the source pole.

At a locked point, `lambda^2` is nonintegral.  Hence the finite prime-power
set is locally constant in `lambda`, and (7.2) applies to the exact finite
coefficient formulas after identifying nearby spaces by their centered
mode indices.  It still gives only the one visible tangent component.

### 7.1 A fixed-operator exponent family

For a source-only tangent family, keep `Q_lambda` fixed and set

\[
 p_s(x)=\sinh(sx),
 \qquad
 \mu(s)=\|p_s\|^2
 ={\sinh(2s\ell)\over2s}-\ell,
 \qquad
 e_s={p_s\over\sqrt{\mu(s)}}.                            \tag{7.6}
\]

At `s=1/2`, this is the odd pole direction.  If

\[
 \alpha(s)=\langle e_s,Q_\lambda e_s\rangle,
 \qquad
 b_s=P_{e_s^\perp}Q_\lambda e_s,
\]

then

\[
 \boxed{
 \alpha'(s)=2\operatorname {Re}\langle e_s',b_s\rangle.} \tag{7.7}
\]

Every derivative is source-reconstructible.  Define

\[
 S_r(Y)=\sum_{1<n\leq Y}\Lambda(n)n^r.                  \tag{7.8}
\]

The exact generalization of (5.5) is

\[
\boxed{
\begin{aligned}
 (T_{\rm prime}p_s)(x)
 ={}&{e^{-sx}\over2}
 \{S_{s-1/2}(y)+S_{-s-1/2}(z)\}\\
 &-{e^{sx}\over2}
 \{S_{-s-1/2}(y)+S_{s-1/2}(z)\}.
\end{aligned}}                                         \tag{7.9}
\]

Differentiation in `s` produces finite log-weighted sums

\[
 \sum_{1<n\leq Y}\Lambda(n)n^r(\log n)^j,              \tag{7.10}
\]

not a zero table.  Nevertheless, a fixed number of derivatives controls
only a fixed-dimensional tangent span.

There is also a limitation inside the favorable-subsequence proof itself.
In its critical-line branch, the uniformly convergent oscillatory series
has coefficients `1/rho^2`.  Formal differentiation multiplies them by the
ordinate `gamma`, producing absolute sizes comparable to `1/|gamma|`.
The global zero-count asymptotic makes their absolute sum divergent.  Thus
the existing uniform almost-periodic argument cannot be differentiated
termwise to produce a derivative-controlled favorable subsequence.  This is
a limitation of that argument, not a theorem that every conditionally
interpreted derivative is large.

### 7.2 Finite-jet logical obstruction

Let

\[
 V_r=\operatorname {span}
 \{p_{1/2},\partial_sp_s|_{1/2},\ldots,
                  \partial_s^rp_s|_{1/2}\}.             \tag{7.11}
\]

In any ambient space of dimension greater than `dim(V_r)`, choose a unit
vector `w` orthogonal to `V_r`.  Replacing an operator `Q` by

\[
 \widetilde Q=Q-c|w\rangle\langle w|,
 \qquad c>0,                                            \tag{7.12}
\]

leaves every mixed derivative

\[
 \partial_s^j\partial_t^k
 \langle p_s,Qp_t\rangle\big|_{s=t=1/2},
 \qquad 0\leq j,k\leq r,                               \tag{7.13}
\]

unchanged, while `c` can make the `w` direction arbitrarily negative.
This is an abstract logical countermodel, not a modification of the source
matrix.  It proves that a fixed tangent jet cannot by itself imply the full
transverse sign.  A successful tangent program needs a growing coframe and
an independent tail theorem.

## 8. Exact orientation countermodels

The next finite models isolate the information missing from a pole-axis
selection.  They are not models of the arithmetic source matrix.

Fix

\[
 a>0,\qquad\sigma>0,
 \qquad 0<d_1<{\sigma^2\over a}<d_2.                   \tag{8.1}
\]

On `C^3`, define two shifted Hermitian matrices

\[
 B_1=
 \begin{bmatrix}
  a&\sigma&0\\
  \sigma&d_1&0\\
  0&0&d_2
 \end{bmatrix},
 \qquad
 B_2=
 \begin{bmatrix}
  a&0&\sigma\\
  0&d_1&0\\
  \sigma&0&d_2
 \end{bmatrix}.                                       \tag{8.2}
\]

### Theorem 8.1 (same scalar data and spectrum, opposite signs)

Relative to the first coordinate, `B_1` and `B_2` have

- the same positive pole-axis value `a`;
- the same residual norm `sigma`;
- the same transverse spectrum `{d_1,d_2}`.

Nevertheless,

\[
 \boxed{B_1\not\succ0,
 \qquad B_2\succ0.}                                   \tag{8.3}
\]

**Proof.**  The first two-coordinate determinant of `B_1` is
`a*d_1-sigma^2<0`.  The transverse block of `B_2` is positive and its
scalar Schur complement is `a-sigma^2/d_2>0`.  \(\square\)

For any `mu>0` and shift `beta`, put

\[
 Q_j=B_j+\beta I,
 \qquad
 T_j=Q_j+2\mu|e_1\rangle\langle e_1|.                  \tag{8.4}
\]

Then both models have the exact odd-pole decomposition
`Q_j=T_j-2*mu*|e_1><e_1|`, with identical pole norm and pole-axis
data.  Making the families constant in an auxiliary parameter also gives
identical scalar derivatives of every order.  The opposite signs arise
solely from the cross orientation relative to the transverse spectrum.

There is a separate complement obstruction for pole Krylov data.  Given any
self-adjoint operator on a cyclic block containing `e`, form its direct sum
with a one-dimensional block `[c]` orthogonal to `e`.  Every moment
`<e,Q^k e>` and every pole Krylov vector is unchanged for all `k`, while the
full transverse sign changes when `c` crosses the target shift.  Therefore
even complete pole spectral data do not see an orthogonal reducing sector.
In the actual finite source matrix this obstruction disappears only after
one proves that the declared Krylov/source coframe spans the whole relevant
space or proves a positive floor on its complement.

## 9. Consequences for the next odd proof attempt

The exact conclusions are as follows.

1. The favorable locked subsequence supplies a positive pole-axis diagonal,
   but the explicit pole contributes nothing to the remaining cross or
   transverse block.
2. The first three combined moments give the exact necessary inequality
   (2.6).  Higher Krylov steps give monotone lower load bounds and, after an
   independently proved transverse floor, the upper bounds (3.7).
3. A successful load must approach one from below.  Thus fixed-margin load
   estimates are asymptotically too strong; the source proof must resolve
   the correct vanishing margin.
4. The prime-jump theorem rules out an exact unprojected pole eigenvector at
   every locked parameter.  It gives no quantitative finite Fourier norm
   bound without a separate graph/Galerkin theorem.
5. Parameter derivatives and finite jets cannot replace the transverse
   theorem.  They can be used as source-only residual probes or as a
   growing coframe only if their unseen complement is controlled.
6. Neither separate block norms, a residual norm without orientation, nor
   real-axis transverse eigenvalues determine the inverse-weighted short.

An honest source-only replay may therefore enumerate favorable locked
parameters, assemble the combined finite moments, apply the necessary test
(2.6), and then apply Theorem 3.1 whenever a separate source proof supplies
`kappa`.  The favorable-subsequence theorem guarantees infinitely many
passes only through the pole-axis gate.  It does not guarantee termination
of the transverse or inverse-load gates.
