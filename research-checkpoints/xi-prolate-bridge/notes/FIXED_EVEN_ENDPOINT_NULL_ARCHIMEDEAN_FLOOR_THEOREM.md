# Fixed-even endpoint-null Archimedean directional theorem

## 0. Exact outcome and claim boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad A=\lambda^2,
 \qquad L=\log A=2\log\lambda .                 \tag{0.1}
\]

Let `v_lambda` be the exact label-`8/12` endpoint-null direction of the
fixed-prefix construction, rescaled by the full exterior metric so that its
defect norm is one.  Let `B_lambda` be its complete one-tail physical
profile and put

\[
 g_\lambda(s)=e^{s/2}B_\lambda(s),\qquad
 C_\lambda=g_\lambda*g_\lambda .                \tag{0.2}
\]

These are exactly the objects in the superseding complete Volterra theorem,
not a finite endpoint truncation.  The corresponding even two-tail state is

\[
 O_\lambda(t)=
 \begin{cases}
  B_\lambda(t-\log\lambda),&t>\log\lambda,\\
  B_\lambda(-t-\log\lambda),&t<-\log\lambda,\\
  0,&|t|\leq\log\lambda.
 \end{cases}                                      \tag{0.3}
\]

Let `K_(v,lambda)` be the origin-corrected global radical lift and let
`W_(v,lambda)` be its actual compact projected physical column.  The
invisible origin bump is part of `K_(v,lambda)` and leaves
`W_(v,lambda)` unchanged.  With `P_lambda` denoting the central
log-Fourier projection remainder, the exact leakage split is

\[
 R_{v,\lambda}=K_{v,\lambda}-W_{v,\lambda}
 =O_\lambda+P_\lambda .                            \tag{0.3a}
\]

Let `U_lambda` be the common Rayleigh shift.  The exterior identity is
`Sigma=W_Z(R,R)=W^*QW`, whereas its metric block is `G=W^*W`.  Therefore,
for this full-metric unit direction, the exact shifted scalar is

\[
 \boxed{
  \mathcal S_\lambda=
  \mathcal W_Z(R_{v,\lambda},R_{v,\lambda})
  -U_\lambda\|W_{v,\lambda}\|_2^2 .}             \tag{0.4}
\]

Equivalently, if `w_lambda` is any nonzero raw representative of the same
line and `D_(w,lambda)` is its full exterior defect, then

\[
 \mathcal S_\lambda=
 {\mathcal W_Z(R_{w,\lambda},R_{w,\lambda})
  -U_\lambda\|W_{w,\lambda}\|_2^2
  \over D_{w,\lambda}}.                           \tag{0.5}
\]

Thus no unrecorded normalization is hidden in the scalar below.

Define the positive constant

\[
\boxed{
 \begin{aligned}
 E
 &=\sum_{m\geq1}{4\over\pi m}
   \int_{\sqrt{m^2-1}}^\infty {x^2\over(1+x^2)^3}\,dx\\
 &= {1\over4}+{1\over2\pi}\sum_{m\geq2}{1\over m}
 \left\{\arcsin{1\over m}
 -{\sqrt{m^2-1}(m^2-2)\over m^4}\right\}\\
 &=0.282628070905254\ldots .
 \end{aligned}}                                      \tag{0.6}
\]

This note proves

\[
 \boxed{2\|B_\lambda\|_2^2\longrightarrow E,}       \tag{0.7}
\]

and, for the angular Fourier convention

\[
 \widehat B_\lambda(\xi)=
 \int_0^\infty B_\lambda(s)e^{-i\xi s}\,ds,
 \qquad
 \|B_\lambda\|_2^2=
 \int_{\mathbb R}|\widehat B_\lambda(\xi)|^2
                    {d\xi\over2\pi},                 \tag{0.8}
\]

the high-frequency concentration

\[
 \boxed{
  2\int_{|\xi|\geq c/2}|\widehat B_\lambda(\xi)|^2
             {d\xi\over2\pi}\longrightarrow E.}     \tag{0.9}
\]

The exact even Archimedean multiplier is

\[
 a(\xi)=2\theta'(\xi)
 =\operatorname {Re}\psi\!\left({1\over4}+{i\xi\over2}\right)
  -\log\pi .                                           \tag{0.10}
\]

Consequently the same-side Archimedean term satisfies, for all sufficiently
large locked `lambda`,

\[
 \boxed{
 Q_{\rm ar}^{\rm same}(O_\lambda,O_\lambda)
 =2\int_{\mathbb R}a(\xi)|\widehat B_\lambda(\xi)|^2
       {d\xi\over2\pi}
 \geq {E\over2}\log c-C.}                            \tag{0.11}
\]

The same-side prime term is bounded below by a constant, the complete
reflected cross-tail bracket is bounded in absolute value, the even pole is
nonnegative, and every projection- or shift-containing correction is
`o(1)`.  Hence

\[
 \boxed{\mathcal S_\lambda\geq {E\over2}\log c-C,}    \tag{0.12}
\]

so this one fully normalized fixed direction is eventually positive and
in fact tends to `+infinity`.

Equation (0.12) is a directional value, not a minimum over the label-`8/12`
plane, a singleton-shorted floor, a fixed-prefix floor, or a growing-rest
floor.  It is not uniform in a moving label or growing prefix.  The proof
does not determine a constant term or an exact finite renormalized limit.
It proves no residual action bound, no physical high-complement comparison,
no low/high reduction, no equation (5.2) of `DIRECT_RH_ATTACK.md`, and no RH
conclusion.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies

The proof uses the following exact bytes.  The first two rows are the
superseding complete-profile package required here.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md` | `fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c` |
| `tests/test_fixed_even_endpoint_null_complete_volterra_caustic_quadrature_theorem.py` | `b734c0e93d264cca9bfe31a141f06907724e526de08781295b6a7cd3bcc0b47c` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md` | `c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` | `b16d33c89dd1517875180a0a5b03f0c0e2b601b0e0e608090016174a464e1e11` |
| `notes/CHEBYSHEV_ERROR_REWRITE.md` | `164482f280284c49eda27c6d22607f32d5e16db4ab053b965c97f8bbd81db20a` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` | `3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `notes/COMPACT_PROJECTION_WEIL_BOUND.md` | `61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93` |
| `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` | `3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |

All limits are through (0.1), with the labels `8` and `12` fixed.  In
particular, constants in the Jost estimates below are fixed-label constants.

## 2. Complete WKB profile and its `L2` remainder

For a radial sample put

\[
 x_m(s)=\sqrt{m^2e^{2s}-1},\qquad
 \beta(x)=\arctan(1/x),\qquad
 \bar\nu={21\over2}+O(c^{-1}).                   \tag{2.1}
\]

On `x_m(s)>=c^(-1/4)`, the superseding Jost theorem gives

\[
 g_{\lambda,m}^{0}(s)=-a_{m,c}(s)\cos\Phi_{m,c}(s),
 \qquad
 \Phi_{m,c}(s)=cx_m(s)+\bar\nu\beta(x_m(s)),     \tag{2.2}
\]

where

\[
 a_{m,c}(s)=
 {2\sqrt{x_m(s)}\over
  \sqrt\pi\,m(1+x_m(s)^2)^{3/4}}\{1+o(1)\}       \tag{2.3}
\]

on every fixed compact radial interval, and the exact amplitudes obey

\[
 |a_{m,c}(s)|\leq Km^{-2}e^{-s},\qquad
 \|a_{m,c}\|_\infty+\operatorname {Var}(a_{m,c})
 \leq Km^{-2}.                                    \tag{2.4}
\]

Set the leading one-tail profile to zero below its Jost threshold:

\[
 B_\lambda^0(s)=-e^{-s/2}\sum_{m\geq1}
 a_{m,c}(s)\cos\Phi_{m,c}(s)
 {\bf1}_{\{x_m(s)\geq c^{-1/4}\}}.              \tag{2.5}
\]

The pointwise Jost error in the complete package is
`O(c^(-1/2)e^(-s))` for `g`.  After multiplication by `e^(-s/2)` it has
`L2` norm `O(c^(-1/2))`.  At the omitted hard edge, the exact bound
`|g_(lambda,1)|<=K sqrt(x_1)` and

\[
 ds={x\,dx\over1+x^2}                             \tag{2.6}
\]

give

\[
 \int_{x_1\leq c^{-1/4}}|B_\lambda(s)|^2\,ds
 \leq K\int_0^{c^{-1/4}}x\,{x\,dx\over1+x^2}
 =O(c^{-3/4}).                                    \tag{2.7}
\]

The lower divided differences are `O(c^(-2))` relative to the fixed
`8/12` profile, and the invisible bump is exponentially small after
whitening.  Therefore

\[
 \boxed{\|B_\lambda-B_\lambda^0\|_2=o(1).}       \tag{2.8}
\]

This is the only replacement of the complete profile made below.  It is an
`L2` replacement of the complete divided difference, not a finite Bernoulli
endpoint expansion.

## 3. Exact complete two-tail energy

Put `b_(m,c)(s)=e^(-s/2)a_(m,c)(s)`.  Equations (2.3)--(2.6) and dominated
convergence give

\[
\begin{aligned}
 \lim_{c\to\infty}\sum_{m\geq1}\int_0^\infty
       b_{m,c}(s)^2\,ds
 &=\sum_{m\geq1}{4\over\pi m}
   \int_{\sqrt{m^2-1}}^\infty{x^2\over(1+x^2)^3}\,dx\\
 &=E.
\end{aligned}                                            \tag{3.1}
\]

Indeed, the limiting amplitude is

\[
 e^{-s/2}a_m(s)longrightarrow
 {2\sqrt{x}\over\sqrt{\pi m}(1+x^2)},          \tag{3.2}
\]

because `me^s=sqrt(1+x^2)`.  The `m^(-2)e^(-s)` majorant in (2.4) is
square-summable over the samples and integrable in `s`.

For the diagonal oscillatory part, `Phi_(m,c)'` has at most one turning
point and is bounded below by a positive constant times `c`.  The
first-derivative estimate with (2.4) gives

\[
 \sum_m\int_0^\infty b_{m,c}(s)^2
             \cos(2\Phi_{m,c}(s))\,ds=o(1).      \tag{3.3}
\]

The off-diagonal products also tend to zero.  Here is a fail-closed proof
which does not require a uniform infinite stationary-phase assertion.  First
truncate to `m,l<=M` and `s<=T`.  Sum phases have nonzero first derivative.
For `m!=l`, a difference phase can have only finitely many stationary
points; its leading stationary equation is

\[
 x_m+x_m^{-1}=x_l+x_l^{-1},                     \tag{3.4}
\]

so either `x_m=x_l`, which is impossible for `m!=l`, or `x_m x_l=1`.
The latter point is nondegenerate unless `x_m=x_l=1`, again impossible for
distinct samples.  The bounded `bar(nu)` perturbation preserves this finite
ordinary classification.  The first- and second-derivative tests therefore
make every fixed truncated off-diagonal integral `o(1)`.  Finally (2.4)
makes the sample tail `m>M` uniformly small, and its exponential factor
makes `s>T` uniformly small.  Letting first `c`, then `M,T`, tend to infinity
proves

\[
 2\|B_\lambda^0\|_2^2=E+o(1).                  \tag{3.5}
\]

Equations (2.8) and (3.5) prove (0.7).

For the closed form in (0.6), substitute `x=tan(theta)`.  If
`theta_m=arccos(1/m)`, then

\[
 \int_{\sqrt{m^2-1}}^\infty{x^2\over(1+x^2)^3}\,dx
 ={1\over8}\left\{\arcsin{1\over m}
 -{\sqrt{m^2-1}(m^2-2)\over m^4}\right\}.       \tag{3.6}
\]

For `m=1` this is `pi/16`, giving the first term `1/4`.  The positive
integral representation proves convergence and `E>0` without relying on
the displayed decimal.

## 4. Exclusion of low angular frequencies

Differentiate the exact leading phase:

\[
 \Phi_{m,c}'(s)=cx_m(s)+{c-\bar\nu\over x_m(s)}. \tag{4.1}
\]

For `c>bar(nu)`, its unconstrained minimum is exact:

\[
 \boxed{
  \min_{x>0}\left(cx+{c-\bar\nu\over x}\right)
  =2\sqrt{c(c-\bar\nu)},\qquad
  x=\sqrt{1-\bar\nu/c}.}                         \tag{4.2}
\]

For all sufficiently large `c`, (4.2) is at least `3c/2`.  Hence, whenever
`|xi|<=c/2`, both phases `+Phi_(m,c)(s)-xi*s` and
`-Phi_(m,c)(s)-xi*s` have derivative of modulus at least `c`.  Each derivative
is monotone on at most two intervals.  Multiplication by `e^(-s/2)` and the
Jost cutoff preserve a summable BV bound in (2.4).  The BV
first-derivative estimate therefore gives the uniform pointwise estimate

\[
 \sup_{|\xi|\leq c/2}|\widehat B_\lambda^0(\xi)|
 \leq {K\over c}.                                    \tag{4.3}
\]

The frequency interval has length `c`, so

\[
 \int_{|\xi|\leq c/2}|\widehat B_\lambda^0(\xi)|^2
        {d\xi\over2\pi}=O(c^{-1}).                \tag{4.4}
\]

Plancherel and (2.8) show that replacing `B_lambda^0` by `B_lambda` changes
the left side of (4.4) by `o(1)`.  Combining this with (0.7) proves (0.9).
No prime-number theorem, short-interval or otherwise, enters this frequency
exclusion.

## 5. The exact Archimedean lower multiplier

The digamma series used in the frozen parity-multiplier theorem is

\[
 \operatorname {Re}\psi(a+iy)-\psi(a)
 =\sum_{k=0}^\infty
 {y^2\over(k+a)((k+a)^2+y^2)}.                  \tag{5.1}
\]

It is nonnegative, and comparison with its decreasing integral gives

\[
 \operatorname {Re}\psi(a+iy)-\psi(a)
 \geq {1\over2}\log\left(1+{y^2\over a^2}\right).
                                                               \tag{5.2}
\]

Thus, with

\[
 a_0=\psi(1/4)-\log\pi
 =-\gamma-\frac\pi2-3\log2-\log\pi,             \tag{5.3}
\]

one has for every real `xi`

\[
 a(\xi)\geq a_0+{1\over2}\log(1+4\xi^2)
 \geq a_0,                                          \tag{5.4}
\]

and, on `|xi|>=c/2`,

\[
 a(\xi)\geq a_0+{1\over2}\log(1+c^2)
 \geq a_0+\log c.                                  \tag{5.5}
\]

The same-side part of the two-tail Fourier square is exactly twice the
one-tail square, which gives the equality in (0.11).  Splitting it at
`|xi|=c/2` and using (5.4)--(5.5) yields

\[
 Q_{\rm ar}^{\rm same}
 \geq 2\log c
  \int_{|\xi|\geq c/2}|\widehat B_\lambda(\xi)|^2
       {d\xi\over2\pi}
 +2a_0\|B_\lambda\|_2^2.                         \tag{5.6}
\]

By (0.7)--(0.9), the high-frequency integral is at least `E/4` for all
sufficiently large `c`, while the total norm remains bounded.  Since `a_0`
is fixed, (5.6) proves (0.11).  This lower bound needs neither a full
log-Sobolev asymptotic nor an `O(1)` remainder for the Archimedean integral.

## 6. Exact full outer decomposition

For the even state (0.3), retain the total pole without splitting it:

\[
 P_+(O_\lambda,O_\lambda)
 =2|\widehat O_\lambda(i/2)|^2\geq0.             \tag{6.1}
\]

The same-side prime block is

\[
 Q_{\rm pr}^{\rm same}
 =-4\sum_{n\geq2}{\Lambda(n)\over\sqrt n}
 \int_0^\infty B_\lambda(s)
                    B_\lambda(s+\log n)\,ds.    \tag{6.2}
\]

The complete-profile bound `|g_lambda(s)|<=K e^(-s)` gives
`|B_lambda(s)|<=K e^(-3s/2)`.  Therefore

\[
 \left|\int_0^\infty B_\lambda(s)
 B_\lambda(s+\log n)\,ds\right|
 \leq K n^{-3/2},                                \tag{6.3}
\]

and, uniformly in `lambda`,

\[
 \boxed{|Q_{\rm pr}^{\rm same}|
 \leq K\sum_{n\geq2}{\Lambda(n)\over n^2}
 \leq K\sum_{n\geq2}{\log n\over n^2}<\infty.} \tag{6.4}
\]

It remains essential not to split the reflected cross-tail bracket.  The
exact reflected correlation is

\[
 \Omega_{\rm cross}(L+y)=2\lambda C_\lambda(y).  \tag{6.5}
\]

The cancellation-preserving Chebyshev identity has the leading minus sign

\[
 Q_{\rm cross}
 =-\int_0^\infty\delta_*(L+y)
   \{\Omega_{\rm cross}'(L+y)-\Omega_{\rm cross}(L+y)\}\,dy.
                                                               \tag{6.6}
\]

Consequently, with the exact Stieltjes prime-minus-Lebesgue quadrature
`M_(v,A)` of the superseding theorem,

\[
 \boxed{Q_{\rm cross}=-2\lambda\mathcal M_{v,A},
 \qquad |Q_{\rm cross}|=O(1),}                  \tag{6.7}
\]

because `M_(v,A)=O(c^(-1/2))` and
`2 lambda c^(-1/2)=sqrt(2/pi)`.  In particular, neither the positive
quartic caustic nor a termwise prime estimate is used to assign a sign to
(6.7).

Combining (6.1)--(6.7) gives the exact full physical-outer identity

\[
 \boxed{
 \mathcal W_Z(O_\lambda,O_\lambda)
 =P_+(O_\lambda,O_\lambda)
  +Q_{\rm ar}^{\rm same}
  +Q_{\rm pr}^{\rm same}
  -2\lambda\mathcal M_{v,A}.}                  \tag{6.8}
\]

All Archimedean and prime cross pieces in (6.8) remain combined inside the
last term.  There is no local-PNT step and no loss of the Stieltjes endpoint
convention.

## 7. Fixed-`8/12` projection-containing pairings

An `L2` projection estimate alone would not justify passage through the
unbounded signed Weil form.  This section proves the required logarithmic
form estimate and both mixed orientations for this one endpoint-null
direction.

Put `ell=log(lambda)` and use on `[-ell,ell]` the exact source modes

\[
 V_r(t)=L^{-1/2}\exp\left({2\pi ir(t+\ell)\over L}\right),
 \qquad r\in\mathbb Z.                              \tag{7.1}
\]

Let `X_lambda` be the central restriction of the origin-corrected global
radical `K_(v,lambda)`.  On the locked schedule set

\[
 N=2^{2400p^2}=\exp(9600\log2\,\lambda^2),
 \qquad W_{v,\lambda}=P_NX_\lambda,
 \qquad P_\lambda=(I-P_N)X_\lambda.              \tag{7.2}
\]

The endpoint-null condition makes the two periodic endpoint traces of
`X_lambda` agree.  Here is the fixed-label variation step explicitly.
The defect asymptotics give `d_8,d_12<=1/2` eventually, hence
`chi_8,chi_12>=1/sqrt(2)`.  The dilation-generator proof of the frozen
projection theorem, equations (4.1)--(4.8) there, applies verbatim to every
fixed prolate label once this lower bound for `chi_t` is available.  Together
with the fixed-label endpoint estimate it gives

\[
 \operatorname {TV}(K_t)
 \leq4\lambda\left(2\pi\lambda^2+\frac12\right)
      +32\pi\lambda^2\sqrt{d_t}=O(\lambda^3),
 \qquad t=8,12.                                    \tag{7.3a}
\]

The same finite-sum change of variables gives `||K_t||_1=O(lambda)`.
For the label-`0/4` anchor profiles, the required rows are already frozen as
equation (4.11) of `DEFECT_RELATIVE_PROJECTION_THEOREM.md` for TV and
equation (2.3) of `OUTER_PROJECTION_RADICAL_REDUCTION.md` for `L1`.
The coefficients of the full-metric normalized endpoint-null source are
`O(d_8^(-1/2))`: indeed `D_t/d_t->1`, the anchor coefficients are bounded,
and `d_12/d_8` is a fixed positive constant times `lambda^8`.  The invisible
origin bump contributes exactly zero to `X_lambda`: on the central
multiplicative window, every arithmetic argument satisfies
`n*u>=lambda^(-1)>1/(2*lambda)`, outside the bump support.  Thus it is not
being estimated by an `L2` surrogate in the following bounds.  Consequently

\[
 \operatorname {TV}(X_\lambda)
 \leq {C\lambda^3\over\sqrt{d_8}},\qquad
 \|X_\lambda\|_1\leq {C\lambda\over\sqrt{d_8}}. \tag{7.3}
\]

If `x_r=<V_r,X_lambda>`, periodic Stieltjes integration by parts and (7.3)
give

\[
 |x_r|\leq {A_\lambda\over|r|}\quad(r\ne0),
 \qquad |x_0|\leq M_\lambda,                     \tag{7.4}
\]

\[
 A_\lambda={C\sqrt L\,\lambda^3\over\sqrt{d_8}},
 \qquad M_\lambda={C\lambda\over\sqrt{Ld_8}}.   \tag{7.5}
\]

These are estimates for the actual corrected `8/12` combination; no
modewise radical assertion is being made.

The exact infinite Fourier form has the Cauchy representation

\[
 q_\lambda=D_a+D_bH-HD_b,qquad
 H_{rs}=\begin{cases}(r-s)^{-1},&r\ne s,\\0,&r=s,
 \end{cases}                                      \tag{7.6}
\]

with

\[
 |a_r|\leq\log(2+|r|)+C_{|a|}(\lambda),\qquad
 |b_r|\leq B_b(\lambda).                          \tag{7.7}
\]

The frozen high-Fourier theorem gives
`C_(|a|)(lambda)+B_b(lambda)=O(lambda L+lambda)`.  Since `P_lambda` has
only modes `|r|>N`, equations (7.4)--(7.7) give directly

\[
 \|P_\lambda\|_2^2\leq {2A_\lambda^2\over N},
 \qquad
 \sum_{|r|>N}\log(2+|r|)|x_r|^2
 \leq {2A_\lambda^2\{\log(3N)+1\}\over N}.       \tag{7.8}
\]

The logarithmic form-continuity inequality for (7.6) therefore proves

\[
 |q_\lambda(P_\lambda,P_\lambda)|
 \leq {C\,\operatorname {poly}(\lambda,L,\log N)
              \over d_8N}.                       \tag{7.9}
\]

This right side tends to zero with an explicit exponent margin.  Eigenvalue
ordering and the pinned Logvinenko--Sereda bound give

\[
 d_8\geq d_4\geq
 6\,96^{-5-(320\pi/\log2)\lambda^2}.              \tag{7.10}
\]

Hence

\[
 {1\over d_8N}\leq C
 \exp\{-M_{\rm proj}\lambda^2\},
 \qquad
 M_{\rm proj}=9600\log2-{320\pi\log96\over\log2}
 =34.286592117920468\ldots>0.                     \tag{7.11}
\]

Polynomial factors in (7.9) do not spend this positive margin, so

\[
 \boxed{q_\lambda(P_\lambda,P_\lambda)=o(1).}     \tag{7.12}
\]

Because `P_lambda` is compact and belongs to the logarithmic form domain,
the closed-form/core identification gives
`mathcal W_Z(P_lambda,P_lambda)=q_lambda(P_lambda,P_lambda)` here.

For the mixed terms, write `W_(v,lambda)=P_NX_lambda`.  The diagonal part
`D_a` has zero high--low matrix element.  The elementary four-quadrant
Cauchy sum used in the frozen mixed theorem, now with the actual bounds
(7.4), is

\[
 |q_\lambda(P_\lambda,W_{v,\lambda})|,
 |q_\lambda(W_{v,\lambda},P_\lambda)|
 \leq {12B_bA_\lambda^2H_N+4B_bA_\lambda M_\lambda
              \over N},                          \tag{7.13}
\]

where `H_N<=1+log N`.  Equations (7.5) and (7.11) make both right sides
`o(1)`.

Finally use the global radical before taking an absolute value.  Since
`K_(v,lambda)=X_lambda+O_lambda` is radical and
`R_(v,lambda)=O_lambda+P_lambda`, the compact-BV form passage gives exactly

\[
 \mathcal W_Z(O_\lambda,P_\lambda)
 =-q_\lambda(X_\lambda,P_\lambda),\qquad
 \mathcal W_Z(P_\lambda,O_\lambda)
 =-q_\lambda(P_\lambda,X_\lambda).               \tag{7.14}
\]

Because `X_lambda=W_(v,lambda)+P_lambda`, equations
(7.12)--(7.14) prove both mixed pairings are `o(1)`.  Therefore all three
projection-containing terms have now been proved, for this fixed direction,
to satisfy

\[
 \boxed{
 \mathcal W_Z(R_{v,\lambda},R_{v,\lambda})
 =\mathcal W_Z(O_\lambda,O_\lambda)+o(1).}        \tag{7.15}
\]

The proof of (7.15), rather than the normalized `L2` projection estimate by
itself, is what permits passage to the complete shifted scalar.

## 8. Rayleigh shift and conclusion

The fixed-depth whitened shift ledger applies to the compact physical
metric `G=W^*W`, not to the global remainder norm.  It gives, on the same
direction,

\[
 |U_\lambda|\,\|W_{v,\lambda}\|_2^2
 =o(\lambda^{-4})=o(1).                          \tag{8.1}
\]

Insert (0.11), (6.1), (6.4), (6.7), (7.15), and (8.1) into (0.4).  The
nonnegative pole may be dropped and every remaining adverse term is bounded
below by a fixed constant.  This proves (0.12).

The conclusion is deliberately one-dimensional.  A positive value on this
particular endpoint-null line says nothing about the least eigenvalue on
the whole `8/12` plane or after a singleton Schur complement.  Nor are the
fixed-label BV and WKB constants in Sections 2--4 uniform in a growing
label.  Those distinctions are part of the theorem, not deferred notation.
