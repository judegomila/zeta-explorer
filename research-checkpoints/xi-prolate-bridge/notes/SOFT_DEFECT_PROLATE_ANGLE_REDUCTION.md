# Soft-defect, leverage-excess, and prolate-angle reduction

## 0. Status and claim boundary

This note sharpens the unresolved physical-high and matched-coframe parts of
the direct Xi--prolate--Weil program.  It proves five finite or conditional
reductions.

1. A one-sided moment argument needs no upper spectral bound on the complete
   signed operator: its lower defect can be clipped by functional calculus.
2. The source multiplier gives a cancellation-preserving soft-defect
   majorant and an exact leverage-excess target on the physical complement.
3. The ambient soft defect has an explicit `lambda`-scale central outlier, so
   physical source capture is essential; a full ambient moment cannot replace
   it.
4. The odd pole can be handled either by one exact Schur direction or by a
   capped lower comparison, but the capped route still forces an
   `O(log(lambda)/lambda)` squared pole-leakage angle.
5. The actual parity-separated prolate determinants reduce to one normalized
   adjoint-source tail.  Ordinary Andreief/total-positivity does not prove
   them because the sparse prolate Slater systems are not sign regular.

The projection inequality also admits the smaller qualitative schedule
`N=ceil(sqrt(lambda))`.  Only the projection and projected-state
normalization conclusions transfer to that schedule.  None of the existing
exponential-schedule residual/sampling estimates or matched
`N=ceil(lambda^2)` signed estimates transfers automatically.

No physical leverage-excess bound, odd reserve, prolate adjoint-tail bound,
signed sector floor, instance of equation (5.2) of `DIRECT_RH_ATTACK.md`,
locally uniform determinant limit, or Riemann-hypothesis conclusion is proved.
The repository state remains `P0_INVALIDATED`.

## 1. Locked source conventions

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,
 \qquad I_\lambda=[-\ell,\ell].                         \tag{1.1}
\]

Lebesgue measure is used in logarithmic coordinates and every physical
function is extended by zero.  The Fourier convention and Plancherel measure
are

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi}.                          \tag{1.2}
\]

Inversion is reflection, `Jf(x)=f(-x)`.  The exact complete multiplier is

\[
 \boxed{
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),\qquad
 S_\lambda(t)=\sum_{1<n\leq\lambda^2}
 {\Lambda(n)\over\sqrt n}\cos(t\log n).}               \tag{1.3}
\]

Every prime power at the inclusive endpoint `n<=lambda^2` is present.  The
minus sign in (1.3) is the source sign and is never reversed below.  For a
source-reconstructed real shift `U`, write

\[
 w(t)=m_\lambda(t)-U.                                   \tag{1.4}
\]

On inversion parity `epsilon=+1,-1`, the pole is

\[
 2\epsilon|p_\epsilon\rangle\langle p_\epsilon|,
 \qquad p_+(x)=\cosh(x/2),\quad p_-(x)=\sinh(x/2).       \tag{1.5}
\]

Thus the even pole is positive and the odd pole is negative.  A Fourier
residue class is never substituted for inversion parity.

All prolate sources live on `[-lambda,lambda]` with Lebesgue measure and zero
extension.  Their zero-Lebesgue-integral normalization and their actual
source Gram `B=C^*C` are retained.  Unit normalization of the combined
source state is still rejected because it changes the limiting scalar.

## 2. The square-root projection schedule

The exact projection theorem gives, for every `lambda>1` and every `N>=0`,

\[
 e_{\lambda,N}\leq
 \delta_\lambda\sqrt{\lambda^3-\lambda}+R_h(\lambda)
 +{C_K\log\lambda\over\pi(N+1)},\qquad C_K<6.006.       \tag{2.1}
\]

The locked fixed-index source theorem states qualitatively that
`delta_lambda=O(lambda^(-2))`; `R_h` is exponentially small.  Hence, for

\[
 N_\alpha(\lambda)=\lceil\lambda^\alpha\rceil,
\]

equation (2.1) gives

\[
 e_{\lambda,N_\alpha}
 =O(\lambda^{-1/2})+O(\lambda^{-\alpha}\log\lambda).
                                                               \tag{2.2}
\]

For every fixed `eta<1/2`, the weighted projection term is therefore

\[
 \sqrt{\log\lambda}\,\lambda^\eta e_{\lambda,N_\alpha}
 =O(\lambda^{\eta-1/2}\sqrt{\log\lambda})
 +O(\lambda^{\eta-\alpha}(\log\lambda)^{3/2}).           \tag{2.3}
\]

Consequently the present bound proves the projection part of equation (5.2)
for every fixed `eta<1/2` whenever `alpha>=1/2`.  In particular,

\[
 \boxed{N_\sqrt{}(\lambda)=\lceil\sqrt\lambda\rceil}    \tag{2.4}
\]

works, with

\[
 e_{\lambda,N_\sqrt{}}=O((\log\lambda)/\sqrt\lambda).
                                                               \tag{2.5}
\]

For `alpha<1/2`, choosing `eta` strictly between `alpha` and `1/2` shows
only that (2.1) does not certify the required limit.  This is not a lower
bound on the true projection error.

The projected-state norm theorem needs only
`log(lambda)/(N+1)->0`, and so (2.4) also gives

\[
 \|P_Nk_\lambda^+\|=a_\infty
 +O((\log\lambda)/\sqrt\lambda),\qquad a_\infty>0,       \tag{2.6}
\]

qualitatively.  The characteristic normalization remains

\[
 F_\lambda(z)=4\|P_Nk_\lambda^+\|\,
                    \widehat\xi_{\lambda,N}(z).          \tag{2.7}
\]

Dropping the norm factor or unit-normalizing `h_lambda` changes the limiting
scalar and is rejected.  Equations (2.2)--(2.6) have no effective source
constant or starting threshold.

The smaller cutoff does **not** import the exponential defect-relative
projection/sampling chain, the hybrid `o(d_6)` shift, the matched coframe and
moment results, the quadratic pilots, or a useful high-Fourier positive
tail.  The previous buffered-inventory count obstruction disappears because
the source inventory is much larger than the target, but count is not rank or
a frame floor.

## 3. Ideal complete-sign clipping

### Theorem 3.1 (lower-defect clipping)

Let `A=A^*` act on a `d`-dimensional Hilbert space, let `L>0`, and fix

\[
 0\leq\mu<\nu,\qquad M>\nu L.                            \tag{3.1}
\]

Define the lower-defect operator by spectral calculus,

\[
 D_M=(MI-A)_+.                                           \tag{3.2}
\]

For every real `r>0`,

\[
 \boxed{
 \lambda_{\min}(A)\geq
 M-\{\operatorname {tr}D_M^r\}^{1/r}.}                  \tag{3.3}
\]

Hence

\[
 \operatorname {tr}D_M^r\leq d(M-\nu L)^r              \tag{3.4}
\]

implies

\[
 \lambda_{\min}(A)\geq M-d^{1/r}(M-\nu L).             \tag{3.5}
\]

The strict floor `lambda_min(A)>mu L` follows when

\[
 \boxed{
 r>{\log d\over
 \log\{(M-\mu L)/(M-\nu L)\}}.}                        \tag{3.6}
\]

**Proof.**  The eigenvalues of `D_M` are `(M-a_j)_+`.  Thus
`||D_M||=(M-lambda_min(A))_+`, and (3.3) follows from
`||D_M||<=tr(D_M^r)^(1/r)`.  Equations (3.5)--(3.6) are immediate. `square`

No hypothesis `A<=MI` occurs.  Eigenvalues above `M`, including a harmless
positive-pole outlier, contribute exactly zero.  For `d>1` the threshold is
sharp in the continuous exponent: at equality take

\[
 A_{\rm bd}=\operatorname {diag}(\mu L,M,\ldots,M).      \tag{3.7}
\]

Then (3.4) is equality and `lambda_min(A_bd)=mu L`, the rejected boundary.
For `d=1`, (3.4) gives `lambda_min(A)>=nu L`, which is already strict
relative to the target `mu L` for every `r>0`.

The analytic limitation is explicit.  The clipped power in (3.4) is
non-polynomial functional calculus, not an ordinary cyclic raw moment.  A
nonconstant polynomial nonnegative on the whole real axis cannot ignore
arbitrarily large positive outliers.

## 4. Source-soft defect and leverage excess

Choose `g>0` and form the scalar positive parts **after** the complete
archimedean-minus-prime cancellation:

\[
 a(t)=(w(t)-g)_+,
 \qquad v(t)=(g-w(t))_+=(g+U-m_\lambda(t))_+.            \tag{4.1}
\]

Let `T_a,T_v` be their exact time-limited Toeplitz forms.  Then

\[
 \boxed{
 B_+:=Q_{\lambda,+}-UI
 =gI+T_a-T_v+2|p_+\rangle\langle p_+|,}                 \tag{4.2}
\]

\[
 \boxed{
 B_-:=Q_{\lambda,-}-UI
 =gI+T_a-T_v-2|p_-\rangle\langle p_-|.}                 \tag{4.3}
\]

This is not a triangle inequality between Weil blocks.  The source minus
sign and every prime power are already inside the single weight `v`.

Let `H` be a declared physical high space and put

\[
 R_H=P_HT_vP_H,\qquad d=\dim H.                          \tag{4.4}
\]

In the even sector, both omitted terms are positive, so

\[
 B_{+,H}\succeq gI_H-R_H.                               \tag{4.5}
\]

If `B>=gI-R` with `R>=0`, ordered eigenvalue monotonicity gives, for every
`r>0`,

\[
 \boxed{
 \operatorname {tr}(gI-B)_+^r\leq\operatorname {tr}R^r.} \tag{4.6}
\]

Equation (4.6) is a trace/eigenvalue statement.  It is **not** the generally
false noncommutative Loewner claim `(gI-B)_+^r<=R^r`.

Taking `g=cL` and assuming

\[
 \operatorname {tr}R_H^r\leq d((c-\nu)L)^r,
 \qquad0\leq\mu<\nu<c,                                  \tag{4.7}
\]

Theorem 3.1 yields a strict `mu L` floor when

\[
 \boxed{
 r>{\log d\over\log\{(c-\mu)/(c-\nu)\}}.}              \tag{4.8}
\]

At `d` of polynomial size, this order is `O(log lambda)`.  The scalar
`g=cL` is a cap in a lower comparison; it is not an `O(L)` upper-width claim
for the actual multiplier.

### 4.1 Exact physical leverage moment

Let `X` be the finite target parity space, let the physical columns form
`W`, and set

\[
 K=\operatorname {ran}W,\quad H=K^\perp,\quad G=W^*W,
 \quad P_H=I-WG^\dagger W^*.                             \tag{4.9}
\]

If `e_t` is the Fourier evaluation vector and
`mathcal W(t)=W^*e_t`, the physical leverage deficit is

\[
 \boxed{
 \kappa_H(t)=\langle e_t,P_He_t\rangle
 =\kappa_X(t)-\mathcal W(t)^*G^\dagger\mathcal W(t).}   \tag{4.10}
\]

For every real `r>=1`, diagonalizing `R_H` and applying scalar Jensen in
the Fourier spectral measure of each eigenvector gives

\[
 \boxed{
 \operatorname {tr}(R_H^r)
 \leq V_{H,r}:=\int_{\mathbb R}v(t)^r\kappa_H(t)\,d\nu(t).} \tag{4.11}
\]

Equivalently,

\[
 V_{H,r}=\operatorname {tr}(P_HT_{v^r}P_H)
 =\operatorname {tr}(P_XT_{v^r}P_X)
 -\operatorname {tr}(G^\dagger W^*T_{v^r}W).            \tag{4.12}
\]

The operator `T_(v^r)` is not `(T_v)^r`.  Also distinct is the exact cyclic
moment `tr(P_H T_v P_H)^r`, whose high kernel occurs at every link.  Removing
`P_H` loses the physical capture geometry.

### 4.2 Exact leverage-excess target

For every `tau>=0`, the scalar inequality

\[
 v(t)\leq\tau+(v(t)-\tau)_+                             \tag{4.13}
\]

and Plancherel give

\[
 T_v\preceq\tau I+T_{(v-\tau)_+}.                       \tag{4.14}
\]

Here the positive part in (4.14) is taken pointwise on the scalar symbol,
not on a noncommuting operator.  Since the norm of a positive finite
compression is at most its trace, (4.5) gives

\[
 \boxed{
 B_{+,H}\succeq
 \{g-\tau-E_H(\tau)\}I_H,}                              \tag{4.15}
\]

where

\[
 \boxed{
 E_H(\tau)=\int_{\mathbb R}(v(t)-\tau)_+
                         \kappa_H(t)\,d\nu(t).}          \tag{4.16}
\]

With `g=cL` and `tau=(c-nu)L`, the single strict condition

\[
 \boxed{
 E_H((c-\nu)L)<(\nu-\mu)L}                              \tag{4.17}
\]

proves `B_(+,H)>mu L I`.  Equality in (4.17) gives no strict reserve and is
rejected.

For `r>1`, `tau>0`, and `x>=0`, the sharp scalar inequality

\[
 (x-\tau)_+\leq
 {(r-1)^{r-1}\over r^r\tau^{r-1}}x^r                   \tag{4.18}
\]

has equality at `x=r tau/(r-1)`.  It turns (4.11) into a sufficient higher-
moment estimate for (4.17).  Equations (4.16)--(4.18), rather than a global
spectral width, are the concrete source-capture targets.

## 5. The ambient central outlier

The leverage in (4.10) cannot simply be removed.  Put

\[
 \Sigma_\lambda=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n},
 \qquad
 \varepsilon_L=9.22022L^{3/2}e^{-0.8476836\sqrt L}.      \tag{5.1}
\]

For `lambda^2>2` (equivalently `lambda>sqrt(2)`), the pinned FKS Chebyshev
estimate gives

\[
 \Sigma_\lambda\geq{\psi_C(\lambda^2)\over\lambda}
 \geq(1-\varepsilon_L)\lambda.                          \tag{5.2}
\]

Fix `0<delta<pi/2`.  For `|t|<=delta/L`, every
`|t log n|<=delta`, so

\[
 S_\lambda(t)\geq\cos\delta\,\Sigma_\lambda.           \tag{5.3}
\]

The exact digamma series gives

\[
 2\theta'(t)\leq C_\theta(L,\delta):=
 \psi(1/4)-\log\pi
 +{\delta^2\zeta(3,1/4)\over4L^2},                     \tag{5.4}
\]

where

\[
 \zeta(3,1/4)=\pi^3+28\zeta(3).                         \tag{5.5}
\]

If `U+g>=-C_B L`, equations (1.3), (4.1), and (5.2)--(5.4) prove the finite
band bound

\[
 \boxed{
 v(t)\geq V_L:=
 \left[2\cos\delta(1-\varepsilon_L)\lambda
       -C_BL-C_\theta(L,\delta)\right]_+,
 \quad |t|\leq\delta/L.}                               \tag{5.6}
\]

Take the normalized parity tests

\[
 f_{+,L}(x)=L^{-1/2},\qquad
 f_{-,L}(x)=\sqrt{2/L}\sin(2\pi x/L).                  \tag{5.7}
\]

For `N>=1` they lie in the centered even and odd Fourier spaces.  Define

\[
 F_+(y)=1,\qquad F_-(y)=\sqrt2\sin(2\pi y),             \tag{5.8}
\]

\[
 b_\epsilon(\delta)={1\over2\pi}
 \int_{-\delta}^{\delta}
 \left|\int_{-1/2}^{1/2}F_\epsilon(y)e^{-isy}\,dy\right|^2ds>0.
                                                               \tag{5.9}
\]

The two inner transforms are

\[
 {2\sin(s/2)\over s},\qquad
 {4\sqrt2\pi i\sin(s/2)\over s^2-4\pi^2},             \tag{5.10}
\]

with removable values taken by continuity.  Fourier scaling now yields

\[
 \boxed{
 \langle f_{\epsilon,L},T_vf_{\epsilon,L}\rangle
 \geq b_\epsilon(\delta)V_L.}                          \tag{5.11}
\]

For fixed `delta,C_B`, the right side has scale `lambda` eventually.  Thus
both ambient parity compressions contain a `lambda`-scale soft-defect
outlier.  This does not obstruct the actual physical high space: the
physical prolate range may capture the central modes.  It proves that such
capture, encoded by `kappa_H`, is indispensable.

## 6. The odd pole

### 6.1 One exact Schur direction

Let `p=P_Hp_-`.  If `p=0`, the even soft-defect argument applies to the whole
odd high space.  Otherwise put `e=p/||p||`, `G=H cap e^perp`, and

\[
 M=gI+P_HT_aP_H-P_HT_vP_H.                              \tag{6.1}
\]

Relative to `H=span{e} direct-sum G`, write

\[
 D=P_GMP_G,\qquad b=P_GMe,
 \qquad \alpha=\langle e,Me\rangle-2\|p\|^2.           \tag{6.2}
\]

Then the complete odd high operator is positive exactly when

\[
 \boxed{
 D\succ0,qquad
 s_-=\alpha-\langle b,D^{-1}b\rangle>0.}               \tag{6.3}
\]

If `D>=eta I` and `s_->=sigma>0`, block elimination gives

\[
 B_{-,H}\succeq
 {\min(\eta,\sigma)\over(1+\|D^{-1}b\|)^2}I.            \tag{6.4}
\]

Equivalently, augment the declared physical low range by the one vector
`p`; the pole then has no high row and remains, with its negative sign, in
the enlarged low Schur problem.

### 6.2 Capped lower comparison

Let `g=cL`, define

\[
 R=P_HT_vP_H,qquad M_0=cLI-R,                           \tag{6.5}
\]

and assume fixed `0<a<c` satisfy

\[
 0\preceq R\preceq(c-a)LI.                              \tag{6.6}
\]

Then `aLI<=M0<=cLI`.  Since

\[
 M_{\rm actual}=cLI+P_HT_aP_H-R\succeq M_0,            \tag{6.7}
\]

arbitrarily large positive multiplier excess is harmless.  Put

\[
 \mu_0=\|p\|^2,\qquad \rho_1=\langle p,Rp\rangle,       \tag{6.8}
\]

\[
 \chi_0=\left\langle p,
 \{(c-a)LI-R\}R(cLI-R)^{-1}p\right\rangle\geq0.         \tag{6.9}
\]

All factors in (6.9) commute because they are functions of `R`.  The chord
identity for `1/x` gives

\[
 \boxed{
 2\langle p,M_0^{-1}p\rangle
 ={2(aL\mu_0+\rho_1-\chi_0)\over acL^2}.}              \tag{6.10}
\]

For `0<delta<=1`, the finite sufficient condition

\[
 \boxed{
 \rho_1+aL\mu_0\leq{1-\delta\over2}acL^2}              \tag{6.11}
\]

implies

\[
 M_{\rm actual}-2|p\rangle\langle p|
 \succeq M_0-2|p\rangle\langle p|
 \succeq\delta M_0\succeq\delta aLI.                   \tag{6.12}
\]

Equality in (6.11) is safe because `delta>0` already gives the strict floor;
the rejected boundary is rank-one load one, corresponding to `delta=0`.
The bound is sharp from the interval, `mu0`, and `rho1`: endpoint spectral
mass makes `chi0=0`.

Condition (6.11) forces

\[
 \mu_0\leq{(1-\delta)cL\over2}-{\rho_1\over aL}
 \leq{(1-\delta)cL\over2}.                              \tag{6.13}
\]

The matched ambient squared pole norm is of scale `lambda`, so (6.13)
requires squared physical leakage angle `O(L/lambda)` (equivalently, sine
angle `O(sqrt(L/lambda))`).  Capping removes the actual upper-width
hypothesis; it does not evade odd-pole capture or aligned compensation.

## 7. The actual prolate determinants

For the arithmetic adjoint row, put

\[
 K_n(y)={(-1)^n\over\sqrt L}\,
 y^{-1/2-i\omega_n}
 \sum_{a\leq\lambda y}a^{-1/2+i\omega_n},
 \qquad \omega_n={2\pi n\over L}.                       \tag{7.1}
\]

The sum is empty for `0<y<lambda^(-1)`.  Up to the fixed harmless sign of
the real odd basis, define

\[
 Q_0^+=K_0,\qquad Q_n^+=\sqrt2\operatorname {Re}K_n,
 \qquad Q_n^-=\sqrt2\operatorname {Im}K_n.              \tag{7.2}
\]

Target rows already have inversion parity, so inserting `S_+` or `S_-` on
the output changes no pairing:

\[
 \langle\psi_n^\sigma,S_\sigma A_\lambda f\rangle
 =\int_0^\lambda Q_n^\sigma(y)f(y)\,dy.                 \tag{7.3}
\]

Let `q_I(y)=2`, since every source is even and
`I_j=2 integral_0^lambda h_j`.  Exact column operations give the augmented
identities

\[
 \boxed{
 D_+={1\over I_0}
 \det\left[\int_0^\lambda q_i(y)h_j(y)\,dy\right],}     \tag{7.4}
\]

with

\[
 (q_i)=(q_I,Q_0^+,\ldots,Q_N^+),\quad
 (h_j)=(h_0,h_4,\ldots,h_{4N+4}),                       \tag{7.5}
\]

and

\[
 \boxed{
 D_-={(-1)^N\over I_2}
 \det\left[\int_0^\lambda q_i(y)h_j(y)\,dy\right],}    \tag{7.6}
\]

with

\[
 (q_i)=(q_I,Q_1^-,\ldots,Q_N^-),\quad
 (h_j)=(h_2,h_6,\ldots,h_{4N+2}).                       \tag{7.7}
\]

The plus augmentation is `(N+2) by (N+2)` and the odd augmentation is
`(N+1) by (N+1)`.  The factor `(-1)^N` comes solely from the declared odd
source columns

\[
 c_t^-=-h_t+{I_t\over I_2}h_2;                          \tag{7.8}
\]

it is unrelated to the negative Weil pole and disappears after squaring a
volume.

Andreief gives, exactly,

\[
 \det\left[\int q_i h_j\right]
 =\int_{0<y_1<\cdots<y_r<\lambda}
   \det[q_i(y_k)]\det[h_j(y_k)]\,dy_1\cdots dy_r.        \tag{7.9}
\]

This representation is not a positivity proof.  In the plus raw family,
`h_(4N+4)` has `2N+2` simple sign changes on `(0,lambda)`, whereas a
Chebyshev system of dimension `N+2` permits at most `N+1`.  In the odd raw
family, `h_(4N+2)` has `2N+1` positive sign changes, whereas its raw
dimension is `N+1`.  Thus the sparse prolate Slater systems in (7.5) and
(7.7) are not sign regular.  The arithmetic rows are piecewise-smooth
power-times-partial-sum kernels with arithmetic jumps, and vanish on
`(0,lambda^(-1))`, so they are not strict Chebyshev systems on the full
positive interval either.

Therefore ordinary separate-sign Andreief/total positivity cannot prevent
cancellation in (7.9).  This does not rule out a new joint-sign theorem for
the exact product; such a theorem would have to control the complete smooth
cell contributions as well as every arithmetic jump.  Breakpoint jets alone
do not do so.

## 8. Exact normalized adjoint-tail criterion

Let

\[
 \mathcal H_0^{\rm ev}
 =\{f\in L^2[-\lambda,\lambda]:f(-y)=f(y),
                         \ \langle1,f\rangle=0\},\qquad
 T_\sigma=
 P_{X_\sigma}S_\sigma A_\lambda\big|_{\mathcal H_0^{\rm ev}}:
 \mathcal H_0^{\rm ev}\longrightarrow X_\sigma.        \tag{8.1}
\]

In the real centered Fourier basis used in Section 7,

\[
 X_+=\operatorname {span}(\psi_0^+,\ldots,\psi_N^+),
 \quad \dim X_+=N+1,
 \qquad
 X_-=\operatorname {span}(\psi_1^-,\ldots,\psi_N^-),
 \quad \dim X_-=N.
\]

The full source arithmetic/parity map is onto each finite target and has

\[
 R_\sigma=T_\sigma T_\sigma^*\succ0,\qquad
 Z_\sigma=R_\sigma^{-1/2}T_\sigma,qquad
 Z_\sigma Z_\sigma^*=I.                                 \tag{8.2}
\]

Define the raw residue spaces

\[
 E_+=\operatorname {span}(h_0,h_4,\ldots,h_{4N+4}),
 \quad
 E_-=\operatorname {span}(h_2,h_6,\ldots,h_{4N+2}),      \tag{8.3}
\]

and

\[
 F_\sigma=E_\sigma\cap\mathcal H_0^{\rm ev}.          \tag{8.4}
\]

The declared corrected columns are bases of `F_sigma`.  Put

\[
 s_\sigma=\|P_{E_\sigma}1\|^2.                          \tag{8.5}
\]

For the exact source Grams,

\[
 s_+=I_0^2+\sum_{j=1}^{N+1}I_{4j}^2=I_0^2\det B_{{\rm src},+},
                                                               \tag{8.6}
\]

\[
 s_-=I_2^2+\sum_{j=1}^{N}I_{4j+2}^2
     =I_2^2\det B_{{\rm src},-}.                         \tag{8.7}
\]

Because `||1||^2=2lambda`, every `z in H_0^ev` obeys the exact split

\[
 \|(I-P_F)z\|^2
 =\|(I-P_E)z\|^2
 +{|\langle(I-P_E)1,(I-P_E)z\rangle|^2\over s}.         \tag{8.8}
\]

Cauchy--Schwarz and `||(I-P_E)1||^2=2lambda-s` give

\[
 \boxed{
 \|(I-P_F)z\|^2\leq{2\lambda\over s}
                         \|(I-P_E)z\|^2.}               \tag{8.9}
\]

Let `C_sigma` synthesize the corrected columns, let
`B_(src,sigma)=C_sigma^*C_sigma`, and put `W_sigma=T_sigma C_sigma`.  The
exact fully whitened volume is

\[
 \boxed{
 \mathcal V_\sigma
 ={ |D_\sigma|^2\over\det B_{{\rm src},\sigma}\det R_\sigma}
 =\det\left(Z_\sigma P_{F_\sigma}Z_\sigma^*\right).}    \tag{8.10}
\]

Equivalently, using the augmented matrices in Section 7,

\[
 \det(TP_FT^*)={|D_\sigma|^2\over\det B_{{\rm src},\sigma}}
 ={|\det A_{\rm aug,\sigma}|^2\over s_\sigma}.          \tag{8.11}
\]

Define the normalized relative adjoint tail

\[
 \boxed{
 \Theta_\sigma={2\lambda\over s_\sigma}
 \left\|(I-P_{E_\sigma})Z_\sigma^*\right\|^2.}         \tag{8.12}
\]

Applying (8.9) to the range of the isometry `Z_sigma^*` gives

\[
 \|Z_\sigma(I-P_{F_\sigma})Z_\sigma^*\|
 \leq\Theta_\sigma.                                    \tag{8.13}
\]

Therefore the strict bound

\[
 \boxed{\Theta_\sigma<1}                               \tag{8.14}
\]

implies

\[
 \boxed{
 T_\sigma P_{F_\sigma}T_\sigma^*
 \succeq(1-\Theta_\sigma)R_\sigma
 \succeq{1-\Theta_\sigma\over8\lambda^4}I,}           \tag{8.15}
\]

and

\[
 \boxed{
 \mathcal V_\sigma\geq
 (1-\Theta_\sigma)^{\dim X_\sigma}>0.}                 \tag{8.16}
\]

Thus (8.14) proves the actual coframe and a quantitative source-whitened row
floor.  No estimate in the current source locks proves (8.14).  The tail is

\[
 \left\|(I-P_E)Z^*\right\|^2
 =\sup_{x\ne0}{\|(I-P_E)T^*x\|^2\over\|T^*x\|^2},       \tag{8.17}
\]

so it necessarily sees the complete arithmetic adjoint kernels, including
their smooth cell pieces.  Counts, continuous injectivity, full-source
surjectivity, or breakpoint jets do not bound it.

## 9. Exact next obligations

This checkpoint redirects the proof search to the following source
estimates, all on one common unbounded schedule.

1. Prove the even leverage-excess estimate (4.17), or the sharper clipped-
   defect bound (3.4), on the actual physical complement.
2. In the odd sector, augment by the pole direction and prove its low Schur
   reserve, or prove (6.6) and the strict directional budget (6.11).
3. Alternatively prove `Theta_+<1` and `Theta_-<1` in (8.14), preferably
   with explicit reserves; then the physical high spaces vanish.
4. Prove the complete source-whitened signed low/cross comparison and the
   residual-action rate on that same schedule.
5. Only after those steps, establish equation (5.2) and locally uniform
   convergence of the normalized regularized characteristic functions.

The square-root projection schedule is now an admissible schedule candidate,
not a completed bridge.  The matched `N=ceil(lambda^2)` route remains
admissible as well, with (8.12) identifying its smallest current coframe
lemma.  No numerical fit, finite determinant, or real-axis eigenvalue
agreement is promoted to an asymptotic theorem.
