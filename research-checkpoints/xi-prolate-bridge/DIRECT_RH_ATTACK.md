# A direct residual--gap route to the Riemann hypothesis

## 1. Objective

Put

\[
\Xi(z)=\xi\!\left(\frac12+iz\right),\qquad
S=\{z\in\mathbb C:|\Im z|<\tfrac12\}.
\]

The purpose of this note is to reduce a direct spectral attack on RH to one
quantitative estimate for explicit finite Hermitian matrices.  It does not use
the de Bruijn--Newman deformation parameter.

The basic limit principle is elementary.

**Lemma 1 (real-rooted limit).**  Let `F_j` be holomorphic on `S`, with all
zeros of every `F_j` real.  If `F_j -> Xi` locally uniformly on `S`, then RH
holds.

**Proof.**  If a nontrivial zeta zero is
`rho=beta+i gamma`, then

\[
z_\rho=\gamma+i(\tfrac12-\beta)\in S
\]

is a zero of `Xi`.  If `beta != 1/2`, choose a closed disk around `z_rho`
which is contained in `S` and misses the real axis.  Rouché's theorem, or
Hurwitz's theorem with multiplicity, forces `F_j` to have a zero in that disk
for all sufficiently large `j`, a contradiction.  \(\square\)

Strong-resolvent convergence of operators is not enough for Lemma 1.  The
required object is locally uniform convergence of their normalized
characteristic functions.

## 2. The finite twin ladder already available

For `lambda>1`, Connes--Consani--Moscovici restrict the Weil quadratic form to
`[lambda^{-1},lambda]`.  In logarithmic coordinates this interval has length
`2 log lambda`.  Let `E_N` be the span of the `2N+1` lowest Fourier modes of
the scaling generator.  The restriction is an explicit Hermitian matrix

\[
Q_{\lambda,N}
 =Q^{\rm pole}_{\lambda,N}
  +Q^{\rm arch}_{\lambda,N}
  +Q^{\rm prime}_{\lambda,N}.
\]

The sign convention is part of the theorem input.  In the source
normalization,

\[
QW_\lambda(f,f)
=\int_{\mathbb R}|\widehat f(t)|^2\frac{2\theta'(t)}{2\pi}\,dt
 +2\Re\!\left(\widehat f(i/2)\overline{\widehat f(-i/2)}\right)
 -\sum_{1<n\le\lambda^2}\Lambda(n)\langle f,T(n)f\rangle, \tag{2.1}
\]

where

\[
\langle f,T(n)g\rangle=n^{-1/2}
\bigl((f^**g)(n)+(f^**g)(n^{-1})\bigr).
\]

Thus `Q^prime` includes the displayed minus sign; it is not an unsigned
positive contribution.

Only prime powers `n<=lambda^2` occur in the arithmetic block.  The matrix
commutes with inversion `u -> u^{-1}`.

If the lowest eigenvalue is simple and its eigenvector `xi_{lambda,N}` is
inversion even, their theorem constructs a rank-one perturbation
`D_log^(lambda,N)` satisfying

\[
\det_{\rm reg}(D_{\log}^{(\lambda,N)}-z)
 =-i\lambda^{-iz}\widehat{\xi_{\lambda,N}}(z).
\]

Consequently `widehat{xi_{lambda,N}}` is entire and all of its zeros are real.
The operator is self-adjoint in the source paper's induced space
`E'_N direct-sum E_N^perp`: on `E'_N=E_N/C xi` the metric is the quotient
metric from `QW^N_lambda-epsilon_N I`, and on `E_N^perp` it is the standard
metric.  It is not a self-adjointness assertion in the original `L^2` metric.
The literal displayed determinant phase also uses the paper's spectral cut and
the normalization `delta_N(xi)=1`; another nonzero scaling has the same zero
set.  For a unit ground vector `x` and
`d=delta_N(x)!=0`, the exact scale-free relation is

\[
 \widehat x(z)=i d\lambda^{iz}
 \det_{\rm reg}(D_{\log}^{(\lambda,N)}-z).         \tag{2.2}
\]

Thus a unit-vector transform is a nowhere-zero entire multiple of the literal
boundary-normalized determinant.  Quantitative conditioning of `d` is not
needed for the zero-set route, although it would be needed if one insisted on
convergence of the literal boundary-normalized determinants themselves.  The
full source and scaling audit is in
`notes/DETERMINANT_LIMIT_AUDIT.md`.

In twin-ladder language, the modes `n` and `-n` are the two rails, inversion
is the bridge, the prime-power shifts are the arithmetic couplings, and the
archimedean gamma block is the continuous medium.  Finite `lambda` freezes
scale and finite `N` freezes bandwidth.

## 3. The explicit state with the correct limit

Let `h_{0,lambda}` and `h_{4,lambda}` be the zeroth and fourth prolate-wave
eigenfunctions, individually normalized as in the source so that they converge
to `h_0` and `h_4`.  They are used on `[-lambda,lambda]` with Lebesgue
measure and are extended by zero outside that interval before the arithmetic
transform is formed.  Fix the remaining scalar without a unit-norm convention:

\[
a_4=\frac{\sqrt3}{2^{11/4}},\qquad
a_{0,\lambda}=a_4
 \frac{\int_{-\lambda}^{\lambda}h_{4,\lambda}(x)\,dx}
      {\int_{-\lambda}^{\lambda}h_{0,\lambda}(x)\,dx},
\qquad
h_\lambda=a_4h_{4,\lambda}-a_{0,\lambda}h_{0,\lambda}.
\]

This has zero integral and converges to the paper's source-normalized

\[
h(x)=\frac\pi2x^2(2\pi x^2-3)e^{-\pi x^2},
\]

and put

\[
k_\lambda=\mathcal E(h_\lambda),
\qquad
\mathcal E(h)(u)=u^{1/2}\sum_{m\ge1}h(mu),
\quad u\in[\lambda^{-1},\lambda].
\]

The printed Connes--Consani--Moscovici lemma claims

\[
\widehat{k_\lambda}(z)\longrightarrow\Xi(z)
\]

locally uniformly on every closed substrip `|Im z|<=eta<1/2`.  The P0 source
audit found an exact scalar inconsistency: the locked formulas (3.5), (7.1),
and (7.2) instead give `widehat{k_lambda}->Xi/4`.  See
`P0_SOURCE_ERRATA.md`.  This is repaired at the final
characteristic-function normalization and changes no zeros. What is not
proved is that `k_lambda` approximates the lowest eigenvector of the Weil
form. Their paper identifies this as a principal missing step.

The source does not prove that `k_lambda` is exactly inversion even at finite
`lambda`.  We therefore use the unconditional symmetrization

\[
k_\lambda^+=\frac12(k_\lambda+Jk_\lambda),
\qquad (Jf)(u)=f(u^{-1}).                             \tag{3.1}
\]

Inversion preserves the support interval and
`widehat{Jk}(z)=widehat{k}(-z)`.  Since `Xi` is even, the corrected locked
source limit
implies

\[
\widehat{k_\lambda^+}(z)\longrightarrow\Xi(z)/4
\]

on closed substrips.  This removes a finite-`lambda` parity assumption rather
than hiding it.

The global radical construction for `E(f)` requires both
`integral(f)=0` and `f(0)=0`, while the locked two-prolate state imposes only
the first condition exactly.  This does not require changing the semilocal
state.  Fix an even smooth bump `phi` supported in `(-1,1)`, with
`phi(0)=1`, put `psi(x)=2 phi(2x)-phi(x)`, and set
`psi_lambda(x)=psi(2 lambda x)`.  Then `psi_lambda(0)=1`, its integral is
zero, and its support lies strictly below the smallest arithmetic sample
`lambda^(-1)`.  Therefore

\[
 \widetilde h_\lambda=h_\lambda-h_\lambda(0)\psi_\lambda
\]

satisfies both global codimension-two conditions while

\[
 1_{[\lambda^{-1},\lambda]}\mathcal E(\widetilde h_\lambda)
 =1_{[\lambda^{-1},\lambda]}\mathcal E(h_\lambda)               \tag{3.2}
\]

exactly.  Thus the producer state, inversion evenization, projection, and
source normalization are unchanged.  The bounded-variation Mellin proof and
domain audit are in `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`.

## 4. Finite inversion-sector residual--Ritz and resolvent theorems

Let `P_N` denote orthogonal projection in
`L^2([lambda^{-1},lambda],du/u)` onto `E_N`.  It commutes with `J`.  Assume
`u_{lambda,N}=P_N k_lambda^+` is nonzero.  Define

\[
\kappa_{\lambda,N}=\frac{u_{\lambda,N}}
                         {\|u_{\lambda,N}\|},
\qquad
q_{\lambda,N}=\langle\kappa_{\lambda,N},
 Q_{\lambda,N}\kappa_{\lambda,N}\rangle,
\]

and

\[
r_{\lambda,N}=\|(Q_{\lambda,N}-q_{\lambda,N})
                    \kappa_{\lambda,N}\|.
\]

The residual is inversion even, so an odd eigenvalue below the Rayleigh
quotient `q` need not obstruct the comparison.  Put

\[
H_\pm=\ker(J\mp I),\qquad K=H_+\cap\kappa^\perp,
\]

and define the compression floors

\[
\alpha=\min_{0\ne v\in K}\frac{\langle v,Qv\rangle}{\|v\|^2},
\qquad
\omega=\min_{0\ne y\in H_-}\frac{\langle y,Qy\rangle}{\|y\|^2}. \tag{4.1}
\]

When `r>0`, let

\[
w=\frac{(Q-q)\kappa}{r},\qquad c=\langle w,Qw\rangle,
\qquad
u=\frac{q+c-\sqrt{(c-q)^2+4r^2}}2.                 \tag{4.2}
\]

Thus `u` is the lower Ritz value on
`span{kappa,(Q-q)kappa}`.  When `r=0`, set `u=q`.  Finally put

\[
\Gamma=\alpha-u,\qquad M_-=\omega-u.               \tag{4.3}
\]

**Theorem 2 (inversion-sector residual--Ritz bridge).**  Suppose `Q=Q*`,
`J=J*=J^{-1}`, `QJ=JQ`, and `J kappa=kappa`.  If

\[
\Gamma>0,\qquad M_->0,                              \tag{4.4}
\]

then `Q` has a unique lowest unit eigenvector `xi`.  Its phase may be chosen
so that

\[
J\xi=\xi,
\qquad
\|\xi-\kappa\|\le\frac r\Gamma.                    \tag{4.5}
\]

For a generic finite matrix, if `delta` is the boundary functional used in a
rank-one construction and

\[
|\delta(\kappa)|>\|\delta\|\frac r\Gamma,           \tag{4.6}
\]

then `delta(xi)` is nonzero, so `xi` can be normalized as required by the
determinant theorem.

For the exact Weil matrices this extra reserve is optional: the commutator
structure in the source determinant theorem already proves
`<delta_N,xi> != 0` from the simple-even ground-state hypotheses.  Here
`delta_N=L^{-1/2} sum_{|n|<=N}V_n` as a vector,
`||delta_N||=sqrt((2N+1)/L)`, with `L=2 log lambda`.  Condition (4.6) is kept
only as an independent sufficient check.  The exact source-page audit and
derivation are in `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`: the proof uses
the Cauchy matrix identity (5.2), commutator (5.3), the mandatory shift
`QW_lambda^N-epsilon_N I`, and boundary convention (5.15).  It proves finite
nonvanishing but no uniform lower bound along a schedule.

**Proof.**  Since `Q` commutes with `J`, the even and odd sectors reduce it.
The residual `b=(Q-q)kappa` lies in `K`.  Relative to
`H_+=C kappa direct-sum K`, write

\[
Q_+=\begin{bmatrix}q&b^*\\ b&A\end{bmatrix},
\qquad \|b\|=r,\quad A\ge\alpha I.                \tag{4.7}
\]

If `r>0`, the compression to `span{kappa,b/r}` is
`[[q,r],[r,c]]`, whose lower eigenvalue is `u`; if `r=0`, `kappa` is already
an eigenvector with eigenvalue `u=q`.  Rayleigh--Ritz therefore gives the
lowest even eigenvalue `mu_+<=u`.  Interlacing with `A` gives
`lambda_2(Q_+)>=alpha>u`, so the even ground state is simple.  Writing its
unit eigenvector as `xi_+=a kappa+v`, with a phase for which `a>0`, the
complementary block equation is

\[
(A-\mu_+)v=-ab,
\quad\text{so}\quad
\|v\|\le |a|r/(\alpha-\mu_+)\le |a|r/\Gamma.       \tag{4.8}
\]

Writing `a=cos(theta)` and `||v||=sin(theta)` gives
`tan(theta)<=r/Gamma` and
`||xi-kappa||=2 sin(theta/2)<=tan(theta)`.  The vector `xi_+` is even by
construction.  Since `omega>u>=mu_+`, every odd
eigenvalue lies strictly above this unique even ground state.  Finally (4.6)
and Cauchy--Schwarz imply `delta(xi)!=0`.  \(\square\)

The old signed gaps remain useful diagnostics but are not the theorem
denominators:

\[
\Delta_{\rm even}=\alpha-q,\qquad
\Delta_{\rm all}=\min\{\alpha,\omega\}-q,
\qquad
\Gamma=\Delta_{\rm even}+(q-u).                    \tag{4.9}
\]

For `r>0`, `u<q`, so `Gamma` is strictly sharper than `Delta_even` and can be
positive even when either old signed gap is nonpositive.  Such a run must
still report the old nonpositive gap as an old-test failure; (4.4) is a
distinct sufficient condition.  For certified computation, lower enclosures
for `alpha` and `omega` must both exceed an upper enclosure for `u`.
High-precision point values alone remain diagnostics.

More generally, any rigorously certified even-sector variational upper bound
`U>=mu_+` may replace `u` throughout the proof, with denominators
`alpha-U` and `omega-U`.  The two-dimensional value (4.2) is mandatory in P0
because it is explicit and independently reconstructible.  A later proof may
use a fixed-dimensional even Krylov--Ritz space, provided its trial vector and
all additional approximation errors are controlled analytically rather than
selected from stored eigenvectors.

The scalar estimate `r/Gamma` in Theorem 2 is a valid certified fallback, but
it replaces the entire complementary resolvent by its operator norm and can
lose substantial spectral information.  The same block decomposition gives
a sharper bound.  Define

\[
\tau=\|(A-uI)^{-1}b\|,
\qquad
D(t)=\sqrt{2-\frac{2}{\sqrt{1+t^2}}}.              \tag{4.10}
\]

**Theorem 3 (resolvent-weighted sector bridge).**  Under the hypotheses
(4.4), the unique ground vector from Theorem 2, with phase chosen so that
`a=<kappa,xi>` is positive, satisfies

\[
 \|\xi-\kappa\|
 \le D(\tau)\le\tau\le\frac r{\alpha-u}.           \tag{4.11}
\]

This statement holds for complex Hermitian matrices.  If `r=0`, then
`b=0`, `u=q`, and all three error bounds are zero.  That branch requires an
exact zero or a zero-radius certificate, not a numerical residual merely
consistent with zero.

**Proof.**  Let `mu_+` be the lowest even eigenvalue and write
`xi=a kappa+v`, with `v in K` and `a>0`.  Equation (4.8) gives

\[
 \frac{\|v\|}{a}=\|(A-\mu_+I)^{-1}b\|.
\]

Since `mu_+<=u<alpha`, the spectral theorem for `A` gives

\[
 \|(A-\mu_+I)^{-1}b\|^2
 \le\|(A-uI)^{-1}b\|^2
 \le\frac{r^2}{(\alpha-u)^2}.                     \tag{4.12}
\]

The first inequality uses that both resolvents are commuting scalar
functions of the same Hermitian `A`; it must not be inferred from a generic
Loewner-order-to-vector-norm implication.  If
`t=||v||/a`, normalization gives
`a=(1+t^2)^(-1/2)` and
`||xi-kappa||=D(t)`.  The function `D` is increasing and `D(t)<=t`, proving
(4.11).  The sector and simplicity conclusions are those of Theorem 2.
\(\square\)

The weighted estimate gives two optional generic boundary corollaries.  If
`delta_K` is the restriction of `delta` to `K`, then either

\[
 |\delta(\kappa)|>\|\delta\|D(\tau),
 \qquad\hbox{or}\qquad
 |\delta(\kappa)|>\|\delta_K\|\tau                 \tag{4.13}
\]

implies `delta(xi)!=0`.  The second condition follows from
`||v||<=a tau`; under the Riesz identification,
`||delta_K||=||P_K delta||`.  It is sharper than the older tau-based test
using the full functional norm, while the first condition exploits the
smaller chordal distance.  Neither condition in (4.13) uniformly dominates
the other.  For the exact Weil matrices both are optional: the source
commutator proof from the simple-even ground-state hypotheses remains the
primary boundary-normalization route.

For a fail-closed finite certificate, let `U` be a rigorously rounded upper
bound for the actual Ritz value `u`, and let `alpha_L` and `omega_L` be
rigorous lower bounds for the two complete compression floors.  One must
establish

\[
 g_+=\alpha_L-U>0,
 \qquad
 g_-=\omega_L-U>0.                                \tag{4.14}
\]

For any approximate shifted-solve vector `z_0`, outward-rounded bounds

\[
 Z_0\ge\|z_0\|,\qquad
 \rho_U\ge\|b-(A-U I)z_0\|
\]

give the independently checkable enclosure

\[
 \tau
 \le\|(A-U I)^{-1}b\|
 \le T:=Z_0+\frac{\rho_U}{g_+}.                    \tag{4.15}
\]

Taking `z_0=0` recovers the scalar fallback
`T=r_U/g_+`, where `r_U` is a certified upper bound for `r`.  A floating-point
inverse or a high-precision point value of `tau` is not a certificate.  The
full proof and interval audit are recorded in
`notes/WEIGHTED_SECTOR_BRIDGE_PROOF.md`.

## 5. The exact RH bridge condition

Choose a sequence with `lambda_j->infinity` and corresponding `N_j`.  Write

\[
e_j=\|P_{N_j}k^+_{\lambda_j}-k^+_{\lambda_j}\|.
\]

At every index require both strict sector comparisons
`Gamma_j>0` and `M_{-,j}>0` from (4.4).  In a certified implementation use
the stronger fail-closed form (4.14).  Let `T_j` be any rigorously proved
upper bound from (4.15) and put

\[
d_j=D(T_j).
\]

The old scalar quantity

\[
R_j^{\rm sec}=\frac{r_{\lambda_j,N_j}}{\Gamma_j}
\]

remains a fallback upper bound in exact arithmetic; it is not the operative
weighted quantity when a verified shifted solve is available.

For a function supported in `[lambda^{-1},lambda]`, Cauchy--Schwarz gives,
uniformly for `|Im z|<=eta`,

\[
|\widehat f(z)|
 \le \sqrt{2\log\lambda}\,\lambda^\eta\|f\|_2.    \tag{5.1}
\]

Therefore it is enough to prove, for every fixed `eta<1/2`,

\[
\sqrt{\log\lambda_j}\,\lambda_j^\eta
\left(e_j+\|P_{N_j}k^+_{\lambda_j}\|d_j\right)
\longrightarrow0.                                  \tag{5.2}
\]

Indeed, after the following zero-preserving normalization

\[
F_j(z)=4\|P_{N_j}k^+_{\lambda_j}\|
       \widehat{\xi_{\lambda_j,N_j}}(z),
\]

Theorems 2--3 and (5.1)--(5.2) would give
`F_j-4 widehat{k^+_{lambda_j}} -> 0` locally uniformly on `S`; the fixed
factor four does not affect convergence to zero.  Together with the corrected
evenized prolate limit, this is the conditional route to `F_j -> Xi` and then
to the conclusion of Lemma 1.  The projection part of (5.2) is proved below;
the required unbounded-sequence shifted-resolvent bounds have not been proved.

Here `xi_(lambda_j,N_j)` is the unit vector with phase aligned to the projected
prolate state, not the source's boundary-normalized representative.  If
`d_j=delta_(N_j)(xi_(lambda_j,N_j))`, then exactly

\[
 F_j(z)=4i\|P_{N_j}k^+_{\lambda_j}\|d_j\lambda_j^{iz}
 \det_{\rm reg}(D_{\log}^{(\lambda_j,N_j)}-z).     \tag{5.2a}
\]

Thus `F_j` is an explicitly rescaled and dephased regularized determinant and
has the same real zeros.  Replacing the eigenvector by any nonzero scalar
multiple leaves `F_j` unchanged only when that scalar is reciprocally
compensated; uncontrolled rescaling is not harmless.  This removes any need
for a uniform lower bound on `|d_j|` in this zero-set formulation.

A convenient stronger target is

\[
e_j=O(\lambda_j^{-1/2}),
\qquad
T_j=O(\lambda_j^{-1/2}),                            \tag{5.3}
\]

provided the projected norms stay bounded.  Since `D(T_j)<=T_j`, this implies
the weighted part of (5.2).  The scalar fallback
`R_j^sec=O(lambda_j^(-1/2))` would also suffice when it is itself proved with
certified gaps.  No optimization is needed.  A single explicit unbounded
diagonal sequence is sufficient; estimates for every `lambda` and every `N`
are unnecessary.

The projection target in (5.3) is now a theorem.  With

\[
 \delta_\lambda=\max_{|x|\leq\lambda}|h_\lambda(x)-h(x)|,
\]

`notes/PROJECTION_RATE_THEOREM.md` proves the exact finite inequality

\[
 e_{\lambda,N}\leq
 \delta_\lambda\sqrt{\lambda^3-\lambda}
 +R_h(\lambda)
 +\frac{\log\lambda}{\pi(N+1)}C_K,                 \tag{5.4}
\]

where `R_h(lambda)` is an explicit exponentially small Gaussian lattice-tail
term and `C_K<6.006` has a closed incomplete-gamma upper bound.  Locked source
Lemma 7.2 gives `delta_lambda=O(lambda^(-2))`.  Hence every fixed
`N=C*ceil(lambda^2)`, including `C=3`, satisfies
`e_(lambda,N)=O(lambda^(-1/2))` and the projection contribution to (5.2)
tends to zero for every fixed `eta<1/2`.  The proof retains the limiting
Hermite tail missing from the abbreviated source comparison and uses exact
evenization.  It supplies no Weil-sector or `T_lambda` estimate.

The cancellation-preserving form of the remaining estimate is now exact.
Let `psi_C(X)=sum_(2<=n<=X) Lambda(n)` be right-continuous and put

\[
 G(x)=e^x-\psi_C(e^x)-\frac12\log(1-e^{-2x}).
\]

For normalized `kappa`, `q=<kappa,Qkappa>`, and source correlation
`q_corr`, define

\[
 \omega^q_{v,w}(x)=q_{\rm corr}(v,w;x)
  -\langle v,w\rangle q_{\rm corr}(\kappa,\kappa;x).
\]

Then `omega^q_(v,w)(0)=omega^q_(v,w)(L)=0`, and direct Stieltjes integration
by parts in the locked finite source formula gives

\[
 \langle v,(Q-uI)w\rangle
 =(q-u)\langle v,w\rangle
 -\int_0^L G(x)\frac d{dx}
   \left(e^{-x/2}\omega^q_{v,w}(x)\right)dx.       \tag{5.5}
\]

Thus (5.5) combines the pole, archimedean, and minus-prime blocks before an
absolute value.  The convention `(0,L]` includes a prime power at
`lambda^2`.  For the global radical remainder `R=K-P_NC_lambda K`, the same
identity represents the residual as the opposite signed leakage correlation;
the sign reversal is forced by `W(v,P_NC_lambda K)=-W(v,R)`.  A bounded-
variation argument also controls the far-prime passage without a zeta-zero
table.  See `notes/CHEBYSHEV_ERROR_REWRITE.md` and its independent finite
replay.  The normalized kernel `e^(-x)G(x)` changes sign, so (5.5) is not a
positive Gram identity.

The far and near leakage geometries can now be separated without splitting
the source distribution.  `notes/PROLATE_TAIL_ENVELOPE.md` proves, for the
fixed invisible-bump representative and every `lambda>=2`, an explicit
super-polynomial upper bound for

\[
 \sup_{\xi\ge\lambda}\xi
   |\widehat{\widetilde h_\lambda/x}(\xi)|.
\]

It follows that the far-prime remainder is super-polynomially small for
every polynomial `N(lambda)`.  On the near interval, centered-log geometry
gives an exact parity-filtered Hankel convolution for the physical outer
remainder and an exact Toeplitz correlation for the Fourier projection
remainder.  The pinned unconditional PNT estimate makes the corresponding
complete-kernel `L1`, `L2`, and first weighted `L2` constants finite and
explicit.  See `notes/NEAR_SIGNED_HANKEL_REDUCTION.md` and
`P3_SOURCE_LOCK.json`.  These are absolute upper estimates.  The inward
Hankel profile contains the full prolate bulk, so the raw Hankel estimate by
itself is not defect-relative and gives no signed sector floor.

The projection-containing pieces are now controlled on the exact diagonal

\[
 \lambda_j=j+\tfrac12,qquad N_j=2^{2400(2j+1)^2},qquad j\ge2.
\]

`notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` proves ordinary and
logarithmically weighted relative Fourier tails,
`notes/COMPACT_PROJECTION_WEIL_BOUND.md` closes the compact P--P term, and
`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` proves both O--P and P--O
orientations are `o(d_4)`.  The last theorem is specifically for the actual
corrected, source-normalized combined `0/4` state: the two-sided radical
identity is applied before labelwise coefficient estimates.  It does not
assert that either individual prolate label is a global radical and is not a
generic multiplier theorem for arbitrary outer states.  Thus all three
projection-containing correlations in the complete remainder are closed on
this schedule.

The remaining O--O pairing is now closed by a different argument.
`notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md` proves, for the actual
corrected, source-normalized and inversion-reflected outer state, an explicit
weighted translation modulus with coefficient `D_S(lambda)=O(lambda^7)` and
fixed exponent parameter `q=1`.  The source-pinned MTY zero-free region, HSW
zero count, and PT finite-height verification in
`ZERO_SAMPLING_SOURCE_LOCK.json`, together with the full closed-strip
Fejer/BV domain passage, then give

\[
 |\mathcal W_Z(O_\lambda,O_\lambda)|
 \leq C_{\rm spec}D_S(\lambda)d_4,
 \qquad
 {|\mathcal W_Z(O_\lambda,O_\lambda)|\over d_8}\longrightarrow0. \tag{5.6}
\]

No nontrivial zero is assumed real, no zero list is read, and no Weil
positivity is used.  Slepian's fixed-index ratio has no effective threshold,
so the last limit is qualitative.  Expanding the exact radical identity with
the three projection-containing estimates yields, on the locked schedule,

\[
 q_\lambda(p,p)=o(d_8).                                    \tag{5.7}
\]

Equation (5.7) is an unnormalized scalar quadratic-energy statement.  It
does not estimate the residual action `(Q-q)kappa`, determine the sign or
floor of either parity compression, or supply the shifted-resolvent term in
(5.2).

## 6. The analytic theorem to prove

The project is thus centered on the following noncircular statement.

**Prolate--Weil bridge conjecture.**  There is an explicit sequence
`lambda_j->infinity` and a corresponding sequence `N_j` for which:

1. the exact involution is self-adjoint and unitary, commutes with the Weil
   matrix, and fixes `P_N k_lambda^+`;
2. certified even-complement and odd-sector floors, together with a certified
   Ritz upper bound, satisfy both strict comparisons (4.14) for the exact
   Weil matrix;
3. the exact source commutator hypotheses giving nonzero boundary
   normalization are verified (with (4.6) and the two weighted tests (4.13)
   available as optional independent checks);
4. verified shifted-solve upper bounds `T_j` satisfy the remaining weighted
   part of (5.2), or the `T_j` part of the stronger (5.3); the projection part
   is supplied by (5.4).

The first attack should preserve the cancellation between the pole,
archimedean, and prime blocks when evaluating
`(Q-q)kappa`.  Estimating those three blocks independently is likely to erase
the observed small residual.  The even compression floor and odd floor should
be bounded separately.  The Ritz shift `q-u` must be retained rather than
discarded.  The resolvent action on the actual residual direction should be
estimated before falling back to its uniform norm `1/(alpha-u)`.  Schur
complements and comparison with the low-energy sector of the prolate
concentration operator remain natural tools.

The remaining analytic obligation is therefore explicit: on one deterministic
unbounded schedule, prove the complete sector-floor bounds and strict
comparisons, construct verified upper bounds `T_j` for the shifted resolvent
action, and prove their decay at the rate required by (5.2).  The projection
rate is already supplied by (5.4), while the stronger locked exponential
schedule above controls all four P/O quadratic remainder correlations and
gives (5.7).  That scalar energy cancellation does not control the action of
the signed form on the trial vector.
Finite pilot values of `tau`, even when independently replayed at doubled
precision, establish none of these uniform assertions.
The finite left-preconditioned and Schur-complement criteria in
`notes/PRECONDITIONED_RESOLVENT_PROGRAM.md` give one noncircular sufficient
route: compare both shifted parity blocks with explicit positive prolate
models, while controlling the actual residual in the corresponding weighted
energy windows.  The narrow projection-component theorems do not provide the
missing signed low-sector comparison or the shifted-resolvent bound.

There is now an exact phase-sensitive reduction of those signed floors.
With the locked Fourier sign and inclusive prime-power endpoint, put

\[
 m_\lambda(t)=2\theta'(t)
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                    \tag{6.0a}
\]

`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` proves that the complete form is
the multiplier (6.0a) plus the pole, whose parity restrictions are the
opposite rank-one forms `2 epsilon |p_epsilon><p_epsilon|`.  For a shift `U`
and `g>0`, the negative part

\[
 v(t)=[g+U-m_\lambda(t)]_+
\]

defines a positive trace-class concentration operator with

\[
 \operatorname{tr}T_v={2\log\lambda\over2\pi}
 \Phi_\lambda(U,g),\qquad
 \Phi_\lambda(U,g)=\int_{\mathbb R}[g+U-m_\lambda(t)]_+dt. \tag{6.0b}
\]

Outside an explicitly bounded dangerous space, both shifted parity forms
have an exact positive floor; the remaining sign is equivalent to a finite
Schur complement.  This is a reduction, not a sector theorem.  The finite
absolute envelope bounds `Phi_lambda` only by `exp(O(lambda))` when `U+g` is
linear.  `notes/PHASE_VOLUME_SCALE_AUDIT.md` proves that the fixed-lambda Haar
law cannot be substituted for the relevant finite orbit and that the usual
moment method is blocked by the support/time-length condition
`T >> (lambda^2)^k`.  Hence the desired polynomial phase-volume bound is
neither proved nor disproved, and the finite Schur floors remain open.

The positive additive model now has an exact growing-window theorem.
`notes/GROWING_WINDOW_THEOREM.md` proves that its source Gram remains full
rank for any number of the prescribed plus and minus target modes, including
after the actual plus-anchor deflation.  With `S=4*lambda^2`, the pinned
Karnik--Romberg--Davenport estimate gives

\[
 n_*=\lceil S\rceil+6+
 \left\lceil\frac{2}{\pi^2}\log(200\lambda^2+25)\log20\right\rceil,
\]

and `1-chi_n^2>=1/2` for every `n>=n_*`.  Hence only an explicit
`O(log(lambda))` transition buffer must remain in the additive low window.
This proves a positive source-coordinate high floor, not the signed
comparison in (5.5): the fixed leading defects have only a non-effective
qualitative lower scale and still lack a bound with an explicit threshold.
The pinned Slepian fixed-index asymptotic supplies that eventual scale, and the
physical arithmetic map still lacks a uniform restricted-conditioning
theorem.

The finite Schur criterion has now been sharpened in a way that matters for
the pilot.  If a deterministic low/high split of either shifted sector is

\[
 B=\begin{bmatrix}A&C^*\\C&H\end{bmatrix},
 \qquad H\ge gI,
\]

then

\[
 A-g^{-1}C^*C>0                                  \tag{6.2}
\]

already proves `B>0`.  The complete matrix in (6.2) must not be replaced by
the weaker scalar
`lambda_min(A)-||C||^2/g`.  At `(lambda,N)=(2,8)`, (6.2) has positive point
floors in both sectors even though both scalar bounds are negative.  The
anisotropic forced-resolvent theorem in the same note gives a point upper
bound `6.9200899708e-4` for the direct value
`6.7997744037e-4`.  This is finite arbitrary-precision evidence, not an
interval certificate or an unbounded-schedule estimate.  The remaining
analytic task is to prove (6.2), or its recursively preconditioned analogue,
uniformly from source prolate concentration estimates and the combined Weil
formula through every transition window.

The next schedule point shows that the low window cannot remain fixed.  At
`(2.25,12)`, using only the two original windows makes both matrices in (6.2)
nonpositive even though both exact point Schur complements remain positive.
Taking all source prolate families below the classical Shannon index
`4 lambda^2`, namely labels `8,12,16,20` and `6,10,14,18`, restores positive
point floors of approximately `6.86e-12` and `1.41e-14`.  This is the
deterministic growing-window object that a uniform proof would have to
control.  It is not sufficient by itself: the forced point bound is still
several times the direct residual solve, and the later `(2.75,16)` schedule
point has a negative complete odd shifted margin.  Deterministic CG/GMRES
parametrices do not remove this sign obligation, because every anisotropic
lower model satisfies `S_0<=S`, where `S` is the exact Schur complement.
The same `lambda=2.75` point has positive shifted margins again at `N=24`
and `N=32`, with the `N=24` result stable under a `60` to `80` prolate-basis
increase and a `50` to `80` decimal-digit repeat.  Hence
`N=2*ceil(lambda^2)` is not an adequate finite Galerkin rule
at that point; a proof must derive `N(lambda)` from a relative preconditioned
projection estimate rather than assume a fixed multiplier from these pilots.
The four tested points of `N=3*ceil(lambda^2)`, for
`lambda=1.75,2,2.25,2.75`, all have positive shifted sectors and decreasing
weighted `tau`.  Their exploratory fit has exponent about `4.98`, with a
local-slope range about `3.82` to `6.27`.  Four point values do not prove that
this multiplier remains adequate.  The delicate `(2.25,18)` point is stable
under an independent base replay and a higher-precision/larger-basis repeat,
but these checks do not provide rigorous upper bounds `T_j` and cannot be
extrapolated to (5.2).

The source audit gives one further exact reduction.  For the corrected
global zero-evaluation vector `K=S E(tilde h_lambda)` and the finite projected
state `p_N=P_N 1_[lambda^(-1),lambda] K`, put `R_N=K-p_N`.  Without RH and
without a zero table,

\[
 QW_\lambda(p_N,p_N)=\mathcal W_Z(R_N,R_N),                       \tag{6.1}
\]

where the right side is the absolutely convergent bilinear spectral-tail
bookkeeping pairing.  The remainder is exactly the sum of physical outer
leakage and log-Fourier projection leakage, and all four cross terms are
mandatory.  Poisson summation rewrites the physical tail almost everywhere
as additive frequency leakage and supplies a positive `L^2` comparison Gram.
However, (6.1) is not a positive-norm identity: positivity of `W_Z` would
itself require the zero parameters to be real.  Previously the open analytic
obligation here was to bound every pairing in this expansion.  Equations
(5.6)--(5.7) now close the scalar quadratic energy without importing
positivity.  They do not turn (6.1) into a norm identity and do not control
the vector action of the finite signed pole--archimedean--prime form.  The
remaining bridge therefore still requires the parity floors and the
resolvent-weighted residual estimate described above.  See
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` and
`notes/OUTER_OUTER_SPECTRAL_THEOREM.md`.

## 7. What would and would not count as completion

Completion requires analytic inequalities uniform along an unbounded
sequence and local-uniform convergence on closed substrips.  It is not enough
to show:

- agreement of finitely many zeros;
- positivity or simplicity at finitely many cutoffs;
- small point values of `tau` from uncertified finite inverses;
- strong-resolvent convergence without characteristic-function convergence;
- convergence only on the real axis;
- a spectral measure constructed from zeros already assumed real;
- global Weil positivity, which is itself an RH-equivalent condition.

The project may use high-precision and interval computation to discover the
correct exponents and decompositions, but its final bridge must be analytic.
