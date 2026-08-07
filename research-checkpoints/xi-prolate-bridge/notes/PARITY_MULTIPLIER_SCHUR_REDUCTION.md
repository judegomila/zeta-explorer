# Exact parity-multiplier and weighted-concentration Schur reduction

## 1. Scope and source convention

This note gives a phase-sensitive reduction of the unresolved signed-sector
problem.  It does not assume Weil positivity, a list of zeta zeros, or any
spectral data from a diagnostic preprint.  It proves neither an asymptotic
sector floor nor the target residual--gap estimate.

Fix `lambda>1`, put

\[
 \ell=\log\lambda,\qquad L=2\ell,
 \qquad I_\lambda=[-\ell,\ell],                 \tag{1.1}
\]

and use Lebesgue measure on `I_lambda`.  The logarithmic coordinate is
`x=log u`, so inversion is

\[
 (Jf)(x)=f(-x).                                  \tag{1.2}
\]

The multiplicative Fourier convention locked by CCM (3.5) becomes

\[
 \widehat f(z)=\int_{I_\lambda}f(x)e^{-izx}\,dx,
 \qquad
 \|f\|_2^2=\int_{\mathbb R}|\widehat f(t)|^2\frac{dt}{2\pi}.
                                                        \tag{1.3}
\]

All functions are extended by zero outside `I_lambda`.  CCM (3.8)--(3.11)
and (3.19) use

\[
 \theta(t)=-\frac t2\log\pi+
 \operatorname{Im}\log\Gamma\!\left(\frac14+\frac{it}{2}\right),
                                                        \tag{1.4}
\]

with the branch stated there.  The prime contribution has the minus sign in
CCM (3.19).  No new source normalization is introduced below.

## 2. The complete real-axis multiplier

Define the finite, source-exact even function

\[
 \boxed{
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}
       \frac{\Lambda(n)}{\sqrt n}\cos(t\log n).}          \tag{2.1}
\]

Equivalently, with the same branch convention,

\[
 2\theta'(t)=
 \operatorname{Re}\psi\!\left(\frac14+\frac{it}{2}\right)-\log\pi.
                                                        \tag{2.2}
\]

The endpoint in (2.1) is exact: every prime power not exceeding
`lambda^2` occurs, and no larger integer occurs.  In particular, (2.1) does
not mix `lambda` with `lambda^2`.

Let `f^*(x)=overline{f(-x)}` and use convolution on the additive logarithmic
group.  On the real axis,

\[
 \widehat{f^**g}(t)=\overline{\widehat f(t)}\widehat g(t).
                                                        \tag{2.3}
\]

Fourier inversion at `+-log n`, followed by CCM (3.7), gives

\[
 \sum_{1<n\leq\lambda^2}\Lambda(n)n^{-1/2}
 \{(f^**g)(\log n)+(f^**g)(-\log n)\}
 =\int_{\mathbb R}\overline{\widehat f(t)}\widehat g(t)
  \left(2\sum_{1<n\leq\lambda^2}
  \frac{\Lambda(n)}{\sqrt n}\cos(t\log n)\right)\frac{dt}{2\pi}.
                                                        \tag{2.4}
\]

The archimedean formula CCM (3.8) contributes `+2 theta'(t)` because
`W_R=-W_infinity` and `Q_W=W_(0,2)-W_R-sum_p W_p`.  Thus the complete
sesquilinear form is

\[
 \boxed{
 Q_\lambda(f,g)=
 \int_{\mathbb R}\overline{\widehat f(t)}\widehat g(t)
                  m_\lambda(t)\frac{dt}{2\pi}
 +P(f,g),}                                           \tag{2.5}
\]

where the pole form, reconstructed rather than inferred from a matrix, is

\[
 P(f,g)=
 \overline{\widehat f(-i/2)}\widehat g(i/2)
 +\overline{\widehat f(i/2)}\widehat g(-i/2).       \tag{2.6}
\]

Equation (2.5) is the requested combined pole--archimedean--prime
representation.  The sign-changing prime trigonometric polynomial is not
bounded term by term.

## 3. Exact parity signs of the pole

Let `H_epsilon={f:Jf=epsilon f}` for `epsilon` equal to `+1` or `-1`.
The Fourier sign in (1.3) gives, for every complex `z`,

\[
 \widehat f(-z)=\epsilon\widehat f(z),
 \qquad f\in H_\epsilon.                           \tag{3.1}
\]

Consequently (2.6) restricts to the rank-one form

\[
 \boxed{P_\epsilon(f,g)=
 2\epsilon\,\overline{\ell_\epsilon(f)}\ell_\epsilon(g),
 \qquad \ell_\epsilon(f)=\widehat f(i/2).}         \tag{3.2}
\]

The Riesz representer of `ell_epsilon` in `H_epsilon` is

\[
 p_+(x)=\cosh(x/2),\qquad p_-(x)=\sinh(x/2),       \tag{3.3}
\]

and its norm is exactly

\[
 \|p_+\|_2^2=\sinh\ell+\ell,
 \qquad
 \|p_-\|_2^2=\sinh\ell-\ell.                    \tag{3.4}
\]

Thus the pole is positive in the even sector and negative in the odd
sector.  Dropping the inversion reflection would lose this sign distinction.

## 4. Weighted concentration operator

Let `U` be any real shift reconstructed from source parameters.  For `g>0`
define

\[
 w_{\lambda,U}(t)=m_\lambda(t)-U,
 \quad
 v_{\lambda,U,g}(t)=[g-w_{\lambda,U}(t)]_+,
 \quad
 a_{\lambda,U,g}(t)=[w_{\lambda,U}(t)-g]_+.       \tag{4.1}
\]

Both weights are source-defined.  Since the exact digamma term tends to
`+infinity` while the prime sum in (2.1) is finite and bounded,
`v_(lambda,U,g)` is integrable.  No finite estimate below replaces a
constant by an unspecified `O(1)`.

Let `mathcal F` be the unitary version of (1.3), let `C_lambda` denote
zero-extension from `I_lambda`, and put

\[
 T_v=C_\lambda^*\mathcal F^*M_v\mathcal F C_\lambda,
 \qquad
 T_a=C_\lambda^*\mathcal F^*M_a\mathcal F C_\lambda.       \tag{4.2}
\]

This operator has an independent entrywise assembly path.  In centered
coordinates the actual source mode is

\[
 \phi_n(x)=(-1)^nL^{-1/2}e^{2\pi inx/L},
 \qquad
 \widehat\phi_n(t)=
 \frac{2\sin(tL/2)}{\sqrt L\,(t-2\pi n/L)},       \tag{4.2a}
\]

where the values at removable singularities are taken by continuity.  Hence

\[
 (T_v)_{nm}=\int_{\mathbb R}v(t)
 \overline{\widehat\phi_n(t)}\widehat\phi_m(t)
 \frac{dt}{2\pi}.                                \tag{4.2b}
\]

Thus a verifier can reconstruct every transcendental value from
\(\lambda,U,g,n,m\), exact prime-power enumeration, and interval quadrature;
it need not trust a cached matrix or a producer spectral projector.

These are positive operators and the shifted form has the exact
Gram-difference decomposition

\[
 \boxed{
 Q_\lambda-U I=gI+T_a-T_v+2\epsilon|p_\epsilon\rangle
                                      \langle p_\epsilon|
 \quad\hbox{on }H_\epsilon.}                    \tag{4.3}
\]

Both weights are even, so \(T_a\) and \(T_v\) commute with inversion and the
parity restrictions in (4.3) are exact.

Equation (4.3) is an identity of closed quadratic forms on the logarithmic
form domain, and therefore on every finite Fourier compression used here.
It is not a bounded-operator identity on all of \(L^2(I_\lambda)\): the
positive multiplier \(a(t)\) grows logarithmically, so \(T_a\) is generally
unbounded.  In contrast, \(T_v\) is the bounded trace-class operator used in
the dangerous-space reduction.

In particular,

\[
 (Q_\lambda-U I)|_{H_+}\succeq gI-T_v,          \tag{4.4}
\]

\[
 (Q_\lambda-U I)|_{H_-}\succeq
 gI-R_-,\qquad R_-=T_v+2|p_-\rangle\langle p_-|. \tag{4.5}
\]

This is not a triangle inequality across the three Weil blocks.  Their
cancellation is retained pointwise in the single weight (4.1).

The integral kernel of `T_v` is

\[
 K_v(x,y)=\frac1{2\pi}\int_{\mathbb R}
             v(t)e^{it(x-y)}\,dt.                \tag{4.6}
\]

It is positive trace class and

\[
 \boxed{
 \operatorname{tr}T_v=
 \frac{L}{2\pi}\Phi_\lambda(U,g),\qquad
 \Phi_\lambda(U,g)=
 \int_{\mathbb R}[g+U-m_\lambda(t)]_+\,dt.}     \tag{4.7}
\]

The scalar `Phi_lambda` is a phase-volume of the complete exact arithmetic
symbol.  It is not determined by separate absolute norms of the pole,
archimedean, and prime blocks.

There is nevertheless a fully explicit absolute-amplitude bound.  Put

\[
 \Sigma_\lambda=
 \sum_{1<n\leq\lambda^2}\frac{\Lambda(n)}{\sqrt n},
 \qquad
 A_\lambda(U,g)=g+U+2\Sigma_\lambda
                 -\psi(1/4)+\log\pi.             \tag{4.8}
\]

Here the constant is reconstructed exactly through

\[
 \psi(1/4)=-\gamma-\frac\pi2-3\log2.             \tag{4.8a}
\]

The digamma series gives, for positive \(a\) and real \(y\),

\[
 \operatorname{Re}\psi(a+iy)-\psi(a)
 =\sum_{k=0}^\infty
   \frac{y^2}{(k+a)((k+a)^2+y^2)}.               \tag{4.9}
\]

The summand, as a function of \(k+a\), is positive and decreasing.  Comparing
the sum with its integral therefore proves

\[
 \operatorname{Re}\psi(a+iy)-\psi(a)
 \geq\frac12\log\left(1+\frac{y^2}{a^2}\right). \tag{4.10}
\]

With \(a=1/4\), \(y=t/2\), and \(\cos(t\log n)\leq1\), equations
(2.1)--(2.2) give the exact pointwise lower bound

\[
 m_\lambda(t)\geq
 \psi(1/4)-\log\pi+\frac12\log(1+4t^2)
 -2\Sigma_\lambda.                               \tag{4.11}
\]

Consequently, if \(A=A_\lambda(U,g)\), then

\[
 \boxed{
 \Phi_\lambda(U,g)\leq
 \begin{cases}
  0,&A\leq0,\\[2mm]
  \sqrt{e^{2A}-1}-\arctan\sqrt{e^{2A}-1},&A>0.
 \end{cases}}                                    \tag{4.12}
\]

For \(A>0\), this follows by integrating
\([A-\frac12\log(1+4t^2)]_+\).  Its support ends at
\(T=\frac12\sqrt{e^{2A}-1}\), and the integral is
\(2T-\arctan(2T)\).  Formula (4.12) contains no unspecified constant.

For comparison with the previous scalar cutoff, the pinned FKS bound in
P3_SOURCE_LOCK.json implies the following explicit estimate.  Set

\[
 C_\psi=1+9.22022
 \left(\frac{3}{0.8476836}\right)^3e^{-3}.        \tag{4.13}
\]

Here \(\psi_C(X)=\sum_{2\leq n\leq X}\Lambda(n)\) is the Chebyshev
function, distinct from the digamma function above.  Maximizing
\(y^3e^{-0.8476836y}\) shows
\(\psi_C(X)\leq C_\psi X\) for every \(X\geq1\).  Stieltjes partial
summation then gives

\[
 \Sigma_\lambda
 =\frac{\psi_C(\lambda^2)}{\lambda}
 +\frac12\int_1^{\lambda^2}\frac{\psi_C(x)}{x^{3/2}}\,dx
 \leq C_\psi(2\lambda-1)<2C_\psi\lambda.         \tag{4.14}
\]

For `1<=X<2` the Chebyshev sum is zero, and at `X=2` the same inequality is
immediate; the FKS estimate is used only above that trivial range.

Thus, whenever \(U+g\) has an explicit linear upper bound in \(\lambda\),
separate prime absolute values yield a phase-volume bound growing at most exponentially
in \(\lambda\), rather than the earlier
\(\lambda^{\text{constant}\cdot\lambda}\) sufficient cutoff.  It is still
exponentially larger than the prolate transition.  Reaching a polynomial
phase-volume requires cancellation in (2.1), not another absolute-amplitude
estimate.

## 5. Finite dangerous space and exact high floor

Let `E_N^epsilon` be either parity sector of the locked Fourier space.  In
the plus sector let `X_(N,+)` be the orthogonal complement of the normalized
projected prolate state `kappa`; in the minus sector put
`X_(N,-)=E_N^-`.  Compress (4.4)--(4.5) to these spaces and define

\[
 R_{N,+}=P_{X_{N,+}}T_vP_{X_{N,+}},              \tag{5.1}
\]

\[
 R_{N,-}=P_{X_{N,-}}R_-P_{X_{N,-}}.              \tag{5.2}
\]

For `0<delta<g`, let

\[
 \Pi_{N,\epsilon}=
 1_{[g-\delta,\infty)}(R_{N,\epsilon}),
 \quad
 \mathcal L_{N,\epsilon}=\operatorname{Ran}\Pi_{N,\epsilon},
 \quad
 \mathcal H_{N,\epsilon}=\mathcal L_{N,\epsilon}^{\perp}.
                                                        \tag{5.3}
\]

This projector is assembled from the exact multiplier (2.1), not from a
stored Weil matrix, its eigenvectors, or a zero table.  The min--max
principle and (4.7) give

\[
 \boxed{
 \dim\mathcal L_{N,+}\leq
 \frac{L\Phi_\lambda(U,g)}{2\pi(g-\delta)},}     \tag{5.4}
\]

\[
 \boxed{
 \dim\mathcal L_{N,-}\leq
 \frac{L\Phi_\lambda(U,g)/(2\pi)
       +2(\sinh\ell-\ell)}{g-\delta}.}          \tag{5.5}
\]

More importantly, with `B_(N,epsilon)` denoting the corresponding
compression of `Q_lambda-U I`,

\[
 \boxed{
 P_{\mathcal H_{N,\epsilon}}B_{N,\epsilon}
 P_{\mathcal H_{N,\epsilon}}\succeq\delta I.}   \tag{5.6}
\]

The proof is one line: on the complement of (5.3), the compressed positive
operator `R_(N,epsilon)` is at most `(g-delta)I`, while (4.4) or (4.5)
gives `B_(N,epsilon)>=gI-R_(N,epsilon)` as a quadratic form.

This replaces the exponential scalar cutoff in
`notes/HIGH_FOURIER_COERCIVITY.md` by a phase-sensitive dangerous subspace.
The conclusion is uniform in the outer Fourier cutoff `N`; only the
phase-volume controls its dimension.

### 5.1 The odd pole costs at most one additional dimension

The trace estimate (5.5) is valid but pays for the magnitude of the odd pole
representer.  Its operator is rank one, independently of its norm, so there
is a complementary rank-based bound.  Put

\[
 T_{N,-}=P_{X_{N,-}}T_vP_{X_{N,-}},
 \qquad
 \mathcal L^{\sharp}_{N,-}
 =\operatorname {Ran}1_{[g-\delta,\infty)}(T_{N,-})
  +\operatorname {span}\{P_{X_{N,-}}p_-\}.       \tag{5.7}
\]

Positivity of `T_v`, the trace bound (4.7), and rank-one dimension counting
give

\[
\boxed{
 \dim\mathcal L^{\sharp}_{N,-}
 \leq\frac{L\Phi_\lambda(U,g)}{2\pi(g-\delta)}+1.}          \tag{5.8}
\]

On the orthogonal complement of (5.7), the pole term vanishes exactly and
`T_(N,-)<=(g-delta)I`.  Equation (4.5) therefore gives the same high floor

\[
 P_{(\mathcal L^{\sharp}_{N,-})^\perp}B_{N,-}
 P_{(\mathcal L^{\sharp}_{N,-})^\perp}\succeq\delta I.     \tag{5.9}
\]

Equivalently, rank-one eigenvalue interlacing gives (5.8) directly.  The odd
pole thus costs at most one unresolved direction in this construction.  One
may take the better of (5.5) and (5.8); the rank bound improves the old
`2(sinh(ell)-ell)/(g-delta)` contribution whenever that quantity exceeds
one.  The one-direction pole surcharge is independent of the pole norm; the
multiplier trace term in (5.8) still depends on the phase-volume estimate.

## 6. Exact Schur complement and a quantitative floor

Decompose `X_(N,epsilon)=L_(N,epsilon) direct-sum H_(N,epsilon)` and write

\[
 B_{N,\epsilon}=
 \begin{bmatrix}A&C^*\\ C&D\end{bmatrix},
 \qquad D\succeq\delta I.                        \tag{6.1}
\]

Then the full shifted sector is positive if and only if the finite Schur
complement

\[
 \boxed{S=A-C^*D^{-1}C}                          \tag{6.2}
\]

is positive.  If `S>=sigma I` for `sigma>0`, then

\[
 \boxed{
 B_{N,\epsilon}\succeq
 \frac{\min(\sigma,\delta)}
      {(1+\|D^{-1}C\|)^2}\,I.}                  \tag{6.3}
\]

Indeed, completing the square gives

\[
 \langle(x,y),B(x,y)\rangle
 =\langle x,Sx\rangle+
 \langle y+D^{-1}Cx,D(y+D^{-1}Cx)\rangle,       \tag{6.4}
\]

and the inverse triangular change of variables has norm at most
`1+||D^(-1)C||`.

If `U` is an upper enclosure for the prolate-state Rayleigh quotient `q`,
then `Q-qI=(Q-UI)+(U-q)I`; hence the same verified floors apply, with the
nonnegative scalar `U-q` added.  Combining the minimum of the even-complement
and odd floors with the already-computed residual is exactly the
residual--gap/Ritz input.  No real-axis eigenvalue agreement is substituted
for determinant convergence.

## 7. The exact remaining lemma

The reduction isolates two tasks, neither of which is presently proved.

First, to make the unresolved dimension track the prolate transition rather
than the exponential cutoff, one needs an explicit phase-volume theorem for
the source symbol.  A sufficient form is

\[
 \boxed{
 \Phi_\lambda(U_\lambda,g_\lambda)
 \leq C_\Phi\frac{\lambda^2}{\log\lambda}}       \tag{7.1}
\]

for an explicit schedule and explicit constants, together with
`0<delta_lambda<g_lambda`.  Equation (5.4) would then give an
`O(lambda^2)` dangerous even space; by (5.8) the odd pole adds at most one
additional direction.  A bound `Phi=O(lambda^2)` would already give the substantially
smaller `O(lambda^2 log lambda)` window.  These asymptotic descriptions are
targets only; a valid finite theorem must replace them by displayed
constants and thresholds.

The literal finite inequalities that place the dangerous ranks below a
chosen transition budget \(d_\lambda\) are

\[
 \Phi_\lambda(U,g)\leq
 \frac{2\pi(g-\delta)d_\lambda}{L}               \tag{7.2}
\]

in the even complement, and

\[
 \Phi_\lambda(U,g)\leq\frac{2\pi}{L}
 \left((g-\delta)d_\lambda-2(\sinh\ell-\ell)\right)       \tag{7.3}
\]

in the odd sector.  One may take \(d_\lambda\) to be the exact buffered count
derived from \(n_*(\lambda)\) in notes/GROWING_WINDOW_THEOREM.md, provided
the right side is positive.  Formula (4.12) is a finite checkable upper bound
for the left side, but it is too large to prove (7.2)--(7.3) on an unbounded
schedule.

Using the sharper odd space (5.7), the odd finite-rank condition can instead
be written

\[
 \Phi_\lambda(U,g)
 \leq\frac{2\pi(g-\delta)(d_\lambda-1)}{L},                 \tag{7.3a}
\]

provided `d_lambda>=1`.  This removes the pole-norm term but does not supply
the missing bound for `Phi_lambda` itself.

Second, on that source-defined dangerous space one must prove, by exact
arithmetic/integral estimates rather than sampled eigenvalue agreement,

\[
 S_{N(\lambda),\epsilon}\succeq
 \sigma_{\lambda,\epsilon}I>0,
 \qquad
 \frac{r_\lambda}{
  \min_\epsilon\left\{
   \min(\sigma_{\lambda,\epsilon},\delta_\lambda)
   /(1+\|D^{-1}C\|)^2
  \right\}}\longrightarrow0.                   \tag{7.4}
\]

The ordinary positive prolate Gram does not prove (7.1) or (7.4), because
`v_(lambda,U,g)` is a signed-arithmetic, frequency-dependent weight.  On the
other hand, (7.1)--(7.4) are strictly sharper targets than positivity of the
entire middle window: all remaining sign information is confined to an
explicit weighted-concentration space whose dimension is independent of the
outer cutoff.

Separate absolute-value bounds recover only the previously proved support
scale obtained from the maximum possible prime amplitude, and therefore do
not establish (7.1).  A successful proof must use cancellation in the exact
trigonometric polynomial in (2.1), for example through explicit high moments
and unique factorization.  The present source locks contain no such
phase-volume theorem.

## 8. Status

Equations (2.5), (3.2), (4.3), (4.7), (4.12), (5.4)--(5.9), and
(6.2)--(6.3) are exact deductions from the pinned formulas.  They provide a
rigorous phase-sensitive Schur reduction and a precise missing lemma.  They
do not verify (7.1) or (7.4), or establish an unbounded-schedule signed-sector
floor, and do not change the repository status.

As a factor/sign regression,
`verifier/parity_multiplier_form_replay.py` independently reconstructs the
continuous multiplier, centered source modes, pole evaluations, and inclusive
prime-power list.  At \(\lambda=2,N=1\), its four symmetry-independent
entries agree with direct source-distribution assembly entrywise within
\(10^{-8}\); the prime Fourier identity is separately checked at higher
precision and includes the endpoint \(n=\lambda^2=4\).  The continuous replay
uses a displayed asymptotic tail through \(t^{-6}\), so this regression is
diagnostic rather than an interval certificate and is not used in the
theorems above.

The helper functions in `src/parity_multiplier_schur.py` are
arbitrary-precision point evaluations of the exact displayed formulas, not
directed interval enclosures.  Their phase-volume value, integer-rank
diagnostic, and Schur-floor value must not be promoted to finite
certificates.  A binding finite Schur check would require outward interval
quadrature and outward spectral linear algebra in an independent replay.
