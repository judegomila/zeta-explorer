# Quantitative high-tail breakpoint coframe attack

## 0. Claim boundary and outcome

This note combines the fixed-parameter high-tail capture theorem in
`notes/EFFECTIVE_MIXED_SIGNED_QUOTIENT_ATTACK.md` with the Sturm and jet
machinery in `notes/AUGMENTED_ENDPOINT_JET_COFRAME_ATTACK.md`.

There are two rigorous conclusions.

1. The high cutoff needed for the positive concentration-defect comparison

   \[
   H_{R,M}\succeq {1\over4}D_{R,M}
   \]

   can be chosen by a completely explicit formula.  On the locked
   half-integer schedule this cutoff is at most polynomial in `lambda`; the
   elementary integral-tail term has scale `lambda^4`.
2. The naive interior-breakpoint analogue of the cheap endpoint-jet right
   inverse goes in the wrong quantitative direction.  There is an explicit
   unit Fourier vector which cancels all breakpoint jumps through order
   `2N-1` at **every** arithmetic breakpoint.  For this direction, every
   high-only source-whitened coframe floor is bounded above, at each fixed
   `lambda,N`, by a quantity of order

   \[
   R^{-2d+1},\qquad d=2N+1,
   \]

   and every high-tail right inverse, if it exists, has norm at least of
   order `R^(d-1/2)`.  The bound below has explicit source constants and no
   hidden finite-formula `O(1)`.

Thus the endpoint Vandermonde argument does not yield an advance terminal
label `M` for the segment `[R,M]`.  The qualitative theorem still proves
that some finite `M` spans the full `X_N` at each fixed parameter, and a
fail-closed interval search still halts.  What fails is the proposed route
to a quantitative lower singular-value estimate: repeated Sturm
integration by parts supplies a sharply decaying **upper** bound in an
explicit worst direction.  A new matrix-valued local-Weyl lower theorem,
with phase and remainder control through derivative order `2N`, would be
needed to extract an advance `M`.

No signed Weil floor, residual--gap limit, determinant-convergence theorem,
or Riemann-hypothesis conclusion follows.  The repository state remains
`P0_INVALIDATED`.  The source interval, Fourier sign, inversion reflection,
zero-integral correction, and prolate normalization remain source-locked.

## 1. Locked half-integer geometry

Put

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad L=2\log\lambda,
 \qquad c=2\pi\lambda^2.                              \tag{1.1}
\]

Use the standard full log-Fourier target

\[
 N=\lceil\lambda^2\rceil={p^2+3\over4},
 \qquad d=2N+1={p^2+5\over2}.                        \tag{1.2}
\]

Since `p^2=1 mod 8`,

\[
 \lfloor\lambda^2\rfloor=N-1.                       \tag{1.3}
\]

On the positive source half-interval, before even projection and
zero-integral projection, the exact adjoint Fourier row is

\[
 K_k(y)={(-1)^k\over\sqrt L}
 y^{-1/2-i\omega_k}
 \sum_{a\leq\lambda y}a^{-1/2+i\omega_k},
 \qquad
 \omega_k={2\pi k\over L},\qquad -N\leq k\leq N.   \tag{1.4}
\]

Its arithmetic breakpoints are

\[
 y_m={m\over\lambda},qquad 1\leq m\leq N-1.        \tag{1.5}
\]

In particular, `y_2=2/lambda` is strictly interior and has the two
neighboring cells

\[
 {1\over\lambda}<y_2<{3\over\lambda}<\lambda.       \tag{1.6}
\]

The last inequality holds already at `lambda=5/2`.  Thus no endpoint or
threshold convention is being used in place of an interior breakpoint.

Let

\[
 ({\cal U}f)(s)=\sqrt\lambda f(\lambda s),
 \qquad -1\leq s\leq1,                               \tag{1.7}
\]

and let `g_k` be the dimensionless even adjoint row before the
zero-integral constant is removed:

\[
 g_k(s)={\sqrt\lambda\over2}K_k(\lambda|s|).         \tag{1.8}
\]

The factor `1/2` is the exact orthogonal projection from a positive-side
row to the even source space.  Identifying the two inversion sectors with
the full `X_N` is unitary and introduces no further factor.  The
zero-integral projection subtracts a constant and therefore changes no
jump.

The dimensionless breakpoints are

\[
 s_m={m\over\lambda^2}.                              \tag{1.9}
\]

Rescaling the exact jump formula from Theorem 4.1 of the signed-quotient
note gives, for every `r>=0`,

\[
 \boxed{
 [g_k^{(r)}]_{s_m}
 ={\lambda\over2\sqrt L}
 {(-\lambda^2)^r\over m^{r+1}}
 \left({1\over2}+i\omega_k\right)_r.}               \tag{1.10}
\]

The reflected negative breakpoint has the corresponding parity sign; its
rank is the same.  There is no reflected term at the positive breakpoint
which can cancel (1.10).

## 2. The full jump Vandermonde and its worst direction

Write

\[
 z_k={1\over2}+i\omega_k,qquad -N\leq k\leq N.      \tag{2.1}
\]

For one fixed `m`, let `J_m` be the square matrix whose rows are the jumps
of orders `r=0,...,d-1` and whose columns are the `d` Fourier rows.  Since
the rising factorial `(z)_r` is monic of degree `r`, (1.10) gives

\[
\begin{aligned}
 |\det J_m|
 ={}&{\lambda^{d^2}\over2^dL^{d/2}
          m^{d(d+1)/2}}
 \left({2\pi\over L}\right)^{d(d-1)/2}
 \prod_{j=1}^{d-1}j!>0.                              \tag{2.2}
\end{aligned}
\]

This proves the qualitative jump rank.  It does not describe the
conditioning of the high prolate coefficients.

The obstruction is visible in an exact unit vector.  Put

\[
 q=d-1=2N,
\]

and, for `k=-N,...,N`, define

\[
 \boxed{
 x_k^*= {(-1)^{k+N}\binom q{k+N}
          \over\sqrt{\binom{2q}{q}}}.}               \tag{2.3}
\]

The identity

\[
 \sum_{j=0}^{q}\binom qj^2=\binom{2q}q
\]

shows that `||x^*||_2=1`.  The `q`th finite-difference identity gives

\[
 \sum_{k=-N}^{N}x_k^*(z_k)_r=0,qquad0\leq r<q,      \tag{2.4}
\]

whereas

\[
 \left|\sum_{k=-N}^{N}x_k^*(z_k)_q\right|
 ={q!\over\sqrt{\binom{2q}q}}
  \left({2\pi\over L}\right)^q>0.                  \tag{2.5}
\]

Crucially, the only `m` dependence in (1.10) is the nonzero row scalar
`m^(-r-1)`.  Hence (2.4) cancels the derivative jumps of orders
`0,...,2N-1` at **every** positive and negative arithmetic breakpoint,
not merely at `m=2`.  The first surviving jump at `s_m` has magnitude

\[
 \boxed{
 {\lambda^{4N+1}\over2\sqrt L\,m^{2N+1}}
 { (2N)!\over\sqrt{\binom{4N}{2N}}}
 \left({2\pi\over L}\right)^{2N}.}                 \tag{2.6}
\]

Thus the common zeroth jump really is rank one.  Successive row directions
are revealed only by successively higher derivative jumps, and the vector
(2.3) reaches the last layer required by the full target.

## 3. Sturm regularity after the cancellations

Let `y_0` be the positive unit ground prolate on `[-1,1]` and put

\[
 j_0=\int_{-1}^{1}y_0(s)\,ds={I_0\over\sqrt\lambda}>0. \tag{3.1}
\]

Form the raw even row combination

\[
 g_* =\sum_{k=-N}^{N}x_k^*g_k.                       \tag{3.2}
\]

If the exact adjoint is first projected to the zero-integral source space
and then the high corrected coefficients are written as
`<c_n,T_N^*x^*>`, the two constant subtractions combine to the single
analytic comparator

\[
 \boxed{
 F_* =g_*-{\langle y_0,g_*\rangle\over j_0}\,1.}     \tag{3.3}
\]

Indeed, in the original source coordinate this is precisely

\[
 T_N^*x^*-{\langle h_0,T_N^*x^*\rangle\over I_0},1,
\]

and therefore

\[
 \langle c_n,T_N^*x^*\rangle
 =\langle y_n,F_*\rangle,qquad n\geq2\text{ even}. \tag{3.4}
\]

The constant in (3.3) changes no interior jump.  Equations (2.4)--(2.6)
show that `F_*` is piecewise analytic, its derivatives through order
`2N-1` match at every arithmetic breakpoint, and its derivative of order
`2N` has a nonzero jump.

Let

\[
 L_c=-{d\over ds}\left((1-s^2){d\over ds}\right)+c^2s^2. \tag{3.5}
\]

An induction on the differential expression proves

\[
 F_*\in\operatorname {Dom}(L_c^N),
 \qquad G_*:=L_c^NF_*\in L^2[-1,1].                 \tag{3.6}
\]

Here is the domain check explicitly.  At an interior point the principal
part of `L_c^j` is

\[
 (-1)^j(1-s^2)^j{d^{2j}\over ds^{2j}}.              \tag{3.7}
\]

All lower terms use derivatives of order at most `2j-1`.  For `j<N`, the
matching in (2.4) therefore makes both `L_c^jF_*` and its Sturm flux
continuous across every breakpoint.  At `s=+/-1`, every piece has finite
one-sided derivatives and the factor `1-s^2` makes the regular prolate
flux vanish.  This proves (3.6) recursively.  At the first uncancelled
layer,

\[
 [G_*]_{s_m}
 =(-1)^N(1-s_m^2)^N[F_*^{(2N)}]_{s_m}\ne0.           \tag{3.8}
\]

Consequently the zero extension of `G_*` is a `BV` function.  Define the
two exact source quantities

\[
 A_{\lambda,N}=\|G_*\|_{L^2[-1,1]},
 \qquad
 V_{\lambda,N}=\operatorname {TV}(G_*^{\rm ext}). \tag{3.9}
\]

They are finite and `V_(lambda,N)>0` by (2.6)--(3.8).  These are
source-explicit constants, not unnamed asymptotic constants.  To reconstruct
them, split at the finite inventory

\[
 s_m={m\over\lambda^2},\qquad1\leq m\leq N-1.       \tag{3.10}
\]

On each cell, `g_k` is a finite constant times
`s^(-1/2-i*omega_k)`.  The exact monomial recursion is

\[
 L_cs^a=-a(a-1)s^{a-2}+a(a+1)s^a+c^2s^{a+2}.        \tag{3.11}
\]

Thus `L_c^Ng_*` and all of its cell derivatives are explicit finite sums
of powers.  The squared `L2` integral in (3.9) is elementary after
expansion.  The total variation is reconstructed either by outward
quadrature on every cell or by the larger fully elementary triangle bound
obtained by integrating the absolute value of each monomial derivative
separately.  The only prolate scalar in (3.3) is
`<y_0,g_*>/j_0`; the pinned positive ground Sturm problem and the explicit
lower bound

\[
 j_0\geq
 {1\over \sqrt3/2+4\pi\lambda^2/\sqrt5}             \tag{3.12}
\]

give a fail-closed interval reconstruction.  Hence (3.9) contains no
unspecified finite constant and uses no stored prolate table.

There is also a completely elementary upper version which avoids solving
for `y_0`.  Put

\[
 G_*^{(0)}=L_c^Ng_*,\qquad P_{N,c}=L_c^N1.           \tag{3.13}
\]

By Cauchy--Schwarz and (3.12),

\[
 \left|{\langle y_0,g_*\rangle\over j_0}\right|
 \leq m_\lambda\|g_*\|_2.                          \tag{3.14}
\]

Therefore the explicit finite-power quantities

\[
 \begin{aligned}
 \overline A_{\lambda,N}
 &=\|G_*^{(0)}\|_2
   +m_\lambda\|g_*\|_2\|P_{N,c}\|_2,\\
 \overline V_{\lambda,N}
 &=\operatorname {TV}((G_*^{(0)})^{\rm ext})
   +m_\lambda\|g_*\|_2
      \operatorname {TV}(P_{N,c}^{\rm ext})
 \end{aligned}                                      \tag{3.15}
\]

satisfy `A_(lambda,N)<=overline A_(lambda,N)` and
`V_(lambda,N)<=overline V_(lambda,N)`.  Every later upper bound remains
valid after this replacement.  Equations (3.11) and the finite cell
inventory make both barred quantities directly reconstructible by
elementary integration and triangle inequalities.

## 4. A quantitative high-tail upper bound

Let `nu_R` be the least even integer strictly greater than the integer
cutoff `R`, and put

\[
 \Lambda_R=\nu_R(\nu_R+1).                           \tag{4.1}
\]

The prolate min--max bound gives

\[
 \mu_n(c)\geq n(n+1),
 \qquad n\geq0.                                      \tag{4.2}
\]

For completeness, the source-side `BV` smoothing estimate can be applied
directly to `G_*`; no zero-integral correction is needed at this stage.
Convolve its zero extension with the uniform probability kernel on
`[-rho,rho]`.  If `E_R` is the span of the even prolate modes with labels
at most `R`, then

\[
 \operatorname {dist}(G_*,E_R)
 \leq V_{\lambda,N}\sqrt\rho+
 \sqrt{{V_{\lambda,N}^2/(2\rho)+c^2A_{\lambda,N}^2
             \over\Lambda_R}}.                      \tag{4.3}
\]

This follows from the exact translation bounds

\[
 \|G_*-G_{*,\rho}\|_2\leq V_{\lambda,N}\sqrt\rho,
 \qquad
 \|G_{*,\rho}'\|_2^2\leq{V_{\lambda,N}^2\over2\rho},
\]

and the prolate form estimate on the orthogonal complement of `E_R`.

Choose

\[
 \rho=\Lambda_R^{-1/2}\leq1.                         \tag{4.4}
\]

Then (4.3) gives the fully explicit bound

\[
 \boxed{
 \|P_{>R}G_*\|_2
 \leq
 \left(1+{1\over\sqrt2}\right)V_{\lambda,N}
       \Lambda_R^{-1/4}
 +cA_{\lambda,N}\Lambda_R^{-1/2}.}                  \tag{4.5}
\]

Write

\[
 F_* =\sum_{n\ \mathrm{even}}f_ny_n,
 \qquad
 G_* =\sum_{n\ \mathrm{even}}\mu_n(c)^Nf_ny_n.     \tag{4.6}
\]

Equations (4.2) and (4.5) imply

\[
\boxed{
 \|P_{>R}F_*\|_2
 \leq\Lambda_R^{-N}
 \left[
 \left(1+{1\over\sqrt2}\right)V_{\lambda,N}
       \Lambda_R^{-1/4}
 +cA_{\lambda,N}\Lambda_R^{-1/2}
 \right].}                                          \tag{4.7}
\]

Since `Lambda_R` has quadratic scale in `R`, the leading power in (4.7) is

\[
 R^{-2N-1/2}=R^{-d+1/2}.                             \tag{4.8}
\]

This is the local-Weyl power suggested by the first surviving derivative
jump, obtained here as a rigorous upper bound without assuming a pointwise
lower bound for any prolate eigenfunction jet.

## 5. Consequence for every finite high-only segment

For `M>R`, synthesize all corrected even columns in the segment:

\[
 C_{R,M}=(c_n:R<n\leq M,\ n\ \mathrm{even}),
 \qquad W_{R,M}=T_NC_{R,M}.                           \tag{5.1}
\]

Their exact source Gram is

\[
 D_{R,M}=I+v_{R,M}v_{R,M}^*,
 \qquad
 v_{R,M}=(I_n/I_0)_{R<n\leq M}.                     \tag{5.2}
\]

Let the source-whitened unsigned coframe floor be

\[
 \gamma_{R,M}
 =\lambda_{\min}\left(W_{R,M}D_{R,M}^{-1}W_{R,M}^*\right). \tag{5.3}
\]

Because `D_(R,M)^(-1)<=I`, the explicit unit vector (2.3), equation (3.4),
and (4.7) give

\[
\boxed{
 \begin{aligned}
 \gamma_{R,M}\leq{}&\Lambda_R^{-2N}
 \left[
 \left(1+{1\over\sqrt2}\right)V_{\lambda,N}
       \Lambda_R^{-1/4}
 +cA_{\lambda,N}\Lambda_R^{-1/2}
 \right]^2.
                                                               \tag{5.4}
 \end{aligned}}
\]

This holds for every terminal label `M`, including one for which Theorem
4.1 of the signed-quotient note proves that `W_(R,M)` is onto.

If `W_(R,M)` is onto and `mathcal R_(R,M)` is any right inverse measured in
the actual source metric, then

\[
\boxed{
 \|\mathcal R_{R,M}\|
 \geq
 {\Lambda_R^N\over
  (1+1/\sqrt2)V_{\lambda,N}\Lambda_R^{-1/4}
       +cA_{\lambda,N}\Lambda_R^{-1/2}}.}            \tag{5.5}
\]

Because `V_(lambda,N)>0`, the forced scale in (5.5), for fixed
`lambda,N` and `R` tending to infinity, is `Lambda_R^(N+1/4)`,
equivalently `R^(d-1/2)`.  This is not a loose
condition-number estimate imported from the low prefix.  It is a Rayleigh
upper bound in an exact unit physical direction, with the complete source
Gram retained.

There is also a basis-free qualitative version.  The corrected high-tail
subspaces decrease strongly to zero, while `T_N` has finite rank.  Hence

\[
 \|T_NP_{{\cal F}_{>R}}\|\longrightarrow0.           \tag{5.6}
\]

Every high tail is onto by the fixed-parameter theorem, but the norm of
every right inverse must diverge.  Equations (5.4)--(5.5) identify an
explicit direction and the much stronger dimension-dependent rate missed
by the abstract compactness statement.

## 6. An explicit cutoff for `H_(R,M) >= D_(R,M)/4`

The conditioning obstruction above is separate from the positive defect
metric.  The latter can be repaired with an advance cutoff.

Retain the locked KRD quantities

\[
 \beta_\lambda={2\over\pi^2}\log(200\lambda^2+25),
 \qquad
 b_\lambda=6+\left\lceil\beta_\lambda\log20\right\rceil,
 \qquad
 n_*=4\lambda^2+b_\lambda.                           \tag{6.1}
\]

The pinned transition theorem gives

\[
 n\geq n_*\Longrightarrow d_n=1-\chi_n^2\geq{1\over2}. \tag{6.2}
\]

To control the integral correction, put

\[
 m_\lambda={\sqrt3\over2}+{4\pi\lambda^2\over\sqrt5},
 \qquad
 A_\lambda={2c^2m_\lambda^2\over3},                 \tag{6.3}
\]

and define the integer

\[
 R_\eta=\max\left\{0,
 \left\lceil{-3+\sqrt{1+4A_\lambda}\over2}\right\rceil
 \right\},                                          \tag{6.4}
\]

\[
 \boxed{R_0(\lambda)=\max\{n_*-1,R_\eta\}.}        \tag{6.5}
\]

All entries in (6.1)--(6.5) are source-fixed transcendental expressions;
an implementation evaluates the two ceilings by outward intervals and
stays unresolved if either ceiling is undecidable at its current precision.

Here is the proof of the second cutoff.  With
`j_n=integral_(-1)^1 y_n(s) ds`, the spectral expansion of the constant and
the prolate form identity give

\[
 \sum_{n\ \mathrm{even}}\mu_n(c)|j_n|^2
 =\langle1,L_c1\rangle={2c^2\over3}.                 \tag{6.6}
\]

Since `I_n=sqrt(lambda) j_n`, (4.2), (3.12), and (6.6) imply, for every
integer `R>=0`,

\[
\begin{aligned}
 \eta_R
 &=\sum_{\substack{n>R\\n\ \mathrm{even}}}
       \left|{I_n\over I_0}\right|^2\\
 &\leq {2c^2m_\lambda^2
          \over3(R+1)(R+2)}
 ={A_\lambda\over(R+1)(R+2)}.                       \tag{6.7}
\end{aligned}
\]

Thus `R>=R_eta` gives `eta_R<=1`, while `R>=n_*-1` makes every retained
even defect at least `1/2`.  For every `M>R>=R_0(lambda)`, the exact high
segment Grams therefore obey

\[
 D_{R,M}\preceq(1+\eta_R)I\preceq2I,
 \qquad
 H_{R,M}\succeq {1\over2}I,
\]

and hence

\[
 \boxed{H_{R,M}\succeq {1\over4}D_{R,M}.}           \tag{6.8}
\]

The lambda dependence is explicit.  For example, using

\[
 c<{44\over7}\lambda^2,
 \qquad m_\lambda<1+{44\over7}\lambda^2,
\]

one has the elementary advance estimate

\[
 R_\eta
 \leq1+\sqrt{2\over3}{44\over7}\lambda^2
                  \left(1+{44\over7}\lambda^2\right). \tag{6.9}
\]

Thus this part of the construction starts no later than an explicit
`lambda^4` scale.  On the same schedule

\[
 d-{1\over2}=2\lambda^2+2.                            \tag{6.10}
\]

Consequently the right-inverse obstruction (5.5), already at an
`R` of `lambda^4` scale, has a power growing like `2*lambda^2+2`; it is not
a fixed polynomial loss.

## 7. Why the route does not produce an advance terminal `M`

The endpoint-jet theorem uses derivatives which grow with the prolate
label and therefore constructs a source correction of norm tending to
zero.  At an interior breakpoint, Sturm integration by parts reverses that
mechanism:

* the value-jump layer contributes first and is common to all Fourier rows;
* the `r`th new Fourier direction appears only after the lower `r` jump
  moments have been cancelled;
* the explicit last direction (2.3) is smooth through order `2N-1`; and
* its high spectral tail is forced down to (4.7).

A scalar local-Weyl estimate for the sum of squared eigenfunction values or
derivatives does not fix this.  To prove that one finite segment spans with
an advance `M`, one needs a lower bound for the smallest eigenvalue of the
**matrix** spectral-jet Gram after all `2N` lower-layer cancellations, with
an explicit remainder uniform in

\[
 N=\lceil\lambda^2\rceil.
\]

Pointwise lower bounds for individual prolate jets are not supplied by the
locked machinery, and scalar local-Weyl sums do not imply them in the
presence of oscillatory nodal phases.  The jump determinant (2.2) contains
no information preventing those phases from making a given finite minor
tiny.  Repeated integration by parts is one-sided: it proves (4.7), not the
missing reverse inequality.

Therefore the current ingredients establish the explicit defect cutoff
(6.5), the qualitative existence of a spanning terminal label, and the
quantitative conditioning obstruction (5.4)--(5.5).  They do not establish
a source-explicit terminal `M`.  Obtaining one would require a new
matrix-valued interior local-Weyl theorem or a different finite-minor
construction.  Even such a theorem would still address only unsigned
capture; by the exact quotient identity, it would not create a signed
physical floor.
