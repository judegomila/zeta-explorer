# Centered-zero boundary convolution and anchor obstruction

## 0. Claim boundary

This note rewrites the checkpoint-0.52 boundary convolution as an exact
centered-zero sum.  It proves four facts.

1. The centered-zero sum for the actual finite even ground reconstructs its
   eigenvalue exactly; it does not independently bound the critical boundary
   moment.
2. The full source anchor has a transform zero at every centered nontrivial
   zero, with at least the corresponding algebraic multiplicity.  Restriction
   and Fourier projection expose the two exact defects which spoil that
   annihilation.
3. The existing weighted exterior and periodic-BV projection estimates make
   those two defects uniformly small over the complete centered zero multiset
   on the locked exponential diagonal.
4. Exponential decay of a fixed-profile boundary convolution requires the
   profile transform to vanish at the complete centered zero set.  Mere
   boundedness already annihilates every off-line zero at which the profile
   transform is nonzero.

The fourth statement is a fixed-profile obstruction.  The finite arithmetic
ground and the source anchor both depend on `lambda`, so it cannot be applied
to them without a separate compactness or profile-transfer theorem.

No zero table, zero reality, zero simplicity, global Weil positivity, or
pointwise interpretation of a conditionally convergent zero series is used.
This note proves neither a complementary sector sign, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, nor the
Riemann hypothesis.  The formal project state remains `P0_INVALIDATED`.

## 1. Paired centered Hadamard product

Use the completed function

\[
 \xi(s)=\frac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)
\]

and the centered zero multiset

\[
 \mathcal Z_c=\{\rho-\tfrac12:\xi(\rho)=0\},          \tag{1.1}
\]

with algebraic multiplicity.  It is invariant under `z mapsto -z` and
`z mapsto bar(z)`, every member satisfies

\[
 -\frac12<\Re z<\frac12,
\]

and `0` is not a member because `xi(1/2)>0`.  The classical zero-count bound
gives

\[
 \sum_{z\in\mathcal Z_c}(1+|z|)^{-2}<\infty.          \tag{1.2}
\]

Let `mathfrak P` be the multiset quotient by `z mapsto -z`, and choose either
representative `z_p` from each orbit.  Pairing the genus-one Hadamard factors
and using the evenness of `xi(1/2+s)` gives the locally absolutely convergent
product

\[
 \xi\!\left(\frac12+s\right)
 =\xi\!\left(\frac12\right)
   \prod_{\mathfrak p\in\mathfrak P}
       \left(1-\frac{s^2}{z_{\mathfrak p}^2}\right).  \tag{1.3}
\]

Consequently, away from the zeros,

\[
 \boxed{
 \frac{\xi'}{\xi}\!\left(\frac12+s\right)
 =\sum_{\mathfrak p\in\mathfrak P}
   \frac{2s}{s^2-z_{\mathfrak p}^2}.}                 \tag{1.4}
\]

Every summand below is even in the representative `z_p`, so no choice of
representatives enters the result.

## 2. Distributional explicit formula

Retain the exact definitions of
`notes/BOUNDARY_DISCREPANCY_CONVOLUTION_REDUCTION.md`:

\[
 F(t)=W(e^t)-2(e^{t/2}-1)-H_0(t),
 \qquad
 c_*=\psi(1/4)-\log\pi+4,                              \tag{2.1}
\]

and put

\[
 g(t)=F(t)-\frac{c_*}{2}.                              \tag{2.2}
\]

The locked ordinary-Laplace identity is, initially for `Re(s)>1/2`,

\[
 \mathcal Lg(s)
 =\frac1s\left[
  -\frac{\xi'}{\xi}\!\left(\frac12+s\right)
  +\frac1{s+1/2}-2\right].                            \tag{2.3}
\]

Since

\[
 {1\over s}\left({1\over s+1/2}-2\right)
 =-{2\over s+1/2},
\]

equation (1.4) gives

\[
 \boxed{
 \mathcal Lg(s)
 =-{2\over s+1/2}
  -\sum_{\mathfrak p\in\mathfrak P}
       {2\over s^2-z_{\mathfrak p}^2}.}               \tag{2.4}
\]

Thus, as a distribution on `t>0`,

\[
 \boxed{
 g(t)=-2e^{-t/2}
 -\sum_{\mathfrak p\in\mathfrak P}
       {2\sinh(z_{\mathfrak p}t)\over z_{\mathfrak p}}.}
                                                               \tag{2.5}
\]

Equation (2.5) is not a pointwise or absolutely convergent linear zero sum.
Only the smoothed finite convolutions below are interpreted term by term.

## 3. Exact finite boundary-convolution theorem

Fix `a>0`, put `lambda=e^a`, and let
`x in W^(1,1)([-a,a])` be real, even, and continuous.  Define

\[
 A_x(z)=\int_{-a}^a x(y)e^{-zy}\,dy,
 \quad X=A_x(0),
 \quad H=A_x(1/2)
       =\int_{-a}^a\cosh(y/2)x(y)\,dy.                \tag{3.1}
\]

### Theorem 3.1 (centered-zero boundary convolution)

One has

\[
 \boxed{
 \int_0^{2a}g(t)x(a-t)\,dt
 =-2e^{-a/2}H
  -2\sum_{\mathfrak p\in\mathfrak P}
       A_x(z_{\mathfrak p})
       {\sinh(az_{\mathfrak p})\over z_{\mathfrak p}}.}
                                                               \tag{3.2}
\]

The series in (3.2) converges absolutely.

**Proof.**  Evenness gives

\[
 \int_0^{2a}e^{-t/2}x(a-t)\,dt=e^{-a/2}H             \tag{3.3}
\]

and

\[
 \int_0^{2a}\sinh(zt)x(a-t)\,dt
 =A_x(z)\sinh(az).                                    \tag{3.4}
\]

Integration by parts, including both endpoint terms, gives for every
centered zero

\[
 |A_x(z)|
 \leq {e^{a/2}\over|z|}
       \left(2|x(a)|+\|x'\|_1\right).                 \tag{3.5}
\]

Also `|sinh(az)|<=e^(a/2)`.  Therefore the absolute value of the summand in
(3.2) is bounded by a fixed multiple of `|z|^(-2)`, and (1.2) applies.

To justify the sharp interval endpoints, mollify
`x(a-t) 1_[0,2a](t)` and cut it off a distance `delta` from `t=0`.  The
distributional identity (2.5) applies to the smooth tests.  The left side
converges because the original `g` is locally integrable, including its
logarithmic endpoint.  The endpoint terms and total variations in (3.5) stay
uniformly bounded, so dominated convergence applies to the zero series.
Letting `delta` and the mollifier width tend to zero proves (3.2).  \(\square\)

If `X!=0`, the boundary quotient of the checkpoint-0.52 note is therefore

\[
 \boxed{
 \mathcal C_\lambda(x)
 =c_*-{4H\over\sqrt\lambda X}
  -{4\over X}\sum_{\mathfrak p\in\mathfrak P}
       A_x(z_{\mathfrak p})
       {\sinh(az_{\mathfrak p})\over z_{\mathfrak p}}.}
                                                               \tag{3.6}
\]

### Corollary 3.2 (the ground zero sum reconstructs the eigenvalue)

Let `x` be the actual finite inversion-even compressed ground, let `epsilon`
be its eigenvalue in the checkpoint-0.52 convention, and assume `X!=0`.
Then

\[
 \boxed{
 \epsilon={4\over X}
 \sum_{\mathfrak p\in\mathfrak P}
       A_x(z_{\mathfrak p})
       {\sinh(az_{\mathfrak p})\over z_{\mathfrak p}}.}
                                                               \tag{3.7}
\]

**Proof.**  Substitute (3.6) into the exact weak constant-mode identity

\[
 \mathcal C_\lambda(x)+\epsilon-c_*
 =-{4H\over\sqrt\lambda X}.
\]

The two boundary-moment terms cancel, leaving (3.7).  \(\square\)

Thus the centered-zero rewrite does not supply a new estimate for `H/X`.
On the actual ground it reproduces the same eigenvalue already present in
the weak equation.

## 4. Exact source-anchor zero divisor

Let

\[
 k=\mathcal E(\widetilde h_\lambda)
\]

be the BV-corrected source state of
`notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md`, and let `K(y)=k(e^y)` be its log
pullback.  In the strip containing all centered zeros,

\[
 \widehat k(w)
 =\zeta(1/2-iw)m_{\widetilde h_\lambda}(w).            \tag{4.1}
\]

Let `S K(y)=(K(y)+K(-y))/2`.  Its bilateral Laplace transform is

\[
 \boxed{
 A_{SK}(z)={1\over2}\left[
  \zeta(1/2-z)m_{\widetilde h_\lambda}(-iz)
 +\zeta(1/2+z)m_{\widetilde h_\lambda}(iz)
 \right].}                                            \tag{4.2}
\]

At `z=rho-1/2`, the two zeta factors are `zeta(1-rho)` and `zeta(rho)`.
The functional equation therefore proves

\[
 \boxed{A_{SK}(\rho-1/2)=0}                            \tag{4.3}
\]

without assuming that `rho` lies on the critical line.  The zero order in
(4.3) is at least the algebraic multiplicity of `rho`; cancellation in the
sum could make it higher.  Only the limiting transform identified with
`Xi/4` has exactly the completed-function multiplicity without an additional
nonvanishing check.

Let `C_a` be restriction to `[-a,a]` and let `P_N` be the exact Fourier
projection there.  Since the full transform in (4.3) is zero,

\[
 \boxed{
 A_{P_NC_aSK}(z)
 =-A_{(1-C_a)SK}(z)
  -A_{(I-P_N)C_aSK}(z)
 \quad(z\in\mathcal Z_c).}                            \tag{4.4}
\]

The first term is the exterior-tail defect and the second is the interior
projection defect.  Equation (4.4) is the exact source-specific cancellation
mechanism.  It does not transfer the zero divisor from the anchor to the
actual finite ground.

### Theorem 4.1 (uniform approximate divisor on the locked diagonal)

The two defects in (4.4) can be bounded uniformly over the complete
centered zero multiset.  This is stronger than compact-substrip convergence,
but it remains a theorem about the source anchor, not the finite Weil ground.

Assume `lambda>=2` and an integer `N>=1`, put
`L=2a=2 log(lambda)`, and retain the exact source coefficient

\[
 a_4={\sqrt3\over2^{11/4}}.
\]

Use the already locked prolate-defect upper bound

\[
 \begin{aligned}
 \beta_\lambda&={2\over\pi^2}\log(200\lambda^2+25),\\
 D_\lambda^{\rm KRD}&=10\exp\left(
  -{\lfloor4\lambda^2\rfloor-11\over\beta_\lambda}
                         \right),
 \end{aligned}                                           \tag{4.5}
\]

The superscript `KRD` distinguishes this prolate concentration-defect bound
from the PNT discrepancy used in the boundary convolution.

Let `D_S(lambda)` be the fully displayed degree-seven constant in
equation (1.9) of
`notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md`.  Define

\[
 \begin{aligned}
 V_\lambda={}&a_4(1+2\sqrt2\lambda)
 \left[4\lambda\left(2\pi\lambda^2+\frac12\right)
             +32\pi\lambda^2\sqrt{D_\lambda^{\rm KRD}}\right],\\
 E_{\lambda,N}={}&{\sqrt L\over\pi\sqrt{2N}}V_\lambda,\\
 P_\lambda={}&{a_4\lambda\over\sqrt2}
                       \sqrt{1+8\lambda^2},\\
 C_\lambda^{\rm BV}={}&3V_\lambda+{2P_\lambda\over\sqrt L}.
 \end{aligned}                                             \tag{4.6}
\]

For `0<=sigma<1/2`, set

\[
 \mathcal J_a(\sigma)^2=
 \begin{cases}
  \sinh(2a\sigma)/\sigma,&\sigma>0,\\
  2a,&\sigma=0.
 \end{cases}                                             \tag{4.7}
\]

Let

\[
 X=C_aSK,\qquad O=(1-C_a)SK,\qquad
 R=(I-P_N)X,\qquad p=P_NX.                                \tag{4.8}
\]

Then

\[
 \boxed{\|R\|_2\le E_{\lambda,N},\qquad
        \|X\|_2\le P_\lambda,\qquad
        \operatorname {TV}_{\rm circle}(X)\le V_\lambda.}
                                                               \tag{4.9}
\]

If `z=sigma+i gamma` is a centered nontrivial zero, put
`epsilon=1/2-|sigma|`.  For every `0<theta<1`, equation (4.4) and
Cauchy--Schwarz give the finite bound

\[
 \boxed{
 |A_p(z)|\le
 {\sqrt{2D_S(\lambda)D_\lambda^{\rm KRD}}\over
        \epsilon\sqrt{\theta(1-\theta)}}
       e^{-\theta\epsilon a}
 +E_{\lambda,N}\mathcal J_a(|\sigma|).}                  \tag{4.10}
\]

The first term in (4.10) may be minimized explicitly.  If
`A=a epsilon>0`, the unique minimizing value is

\[
 \theta_A={A-1+\sqrt{A^2+1}\over2A},                     \tag{4.11}
\]

with the continuous value `theta_0=1/2`.  The simpler choice
`theta=1/2` gives

\[
 \boxed{
 |A_p(z)|\le
 {2\sqrt{2D_S(\lambda)D_\lambda^{\rm KRD}}\over\epsilon}
       e^{-\epsilon a/2}
 +E_{\lambda,N}\mathcal J_a(1/2-\epsilon).}              \tag{4.12}
\]

There is a second bound which decays with zero height.  For `gamma!=0`,

\[
 \boxed{
 |A_p(z)|\le
 {\sqrt\lambda\,C_\lambda^{\rm BV}\over|\gamma|}
 +E_{\lambda,N}\mathcal J_a(|\sigma|).}                  \tag{4.13}
\]

Now impose the locked half-integer diagonal

\[
 \lambda={p_0\over2},\qquad p_0\ge5\ \hbox{odd},
 \qquad N=2^{2400p_0^2}=2^{9600\lambda^2}.               \tag{4.14}
\]

For any real `T>=3`, define the source-locked two-sided zero-free margin

\[
 \delta_T={1\over55.241(\log(2T))^{2/3}
                      (\log\log(2T))^{1/3}}.              \tag{4.15}
\]

The MTY zero-free region, applied also to
`1-conjugate(rho)`, gives `epsilon>=delta_T` whenever
`3<=|gamma|<=T`.  There is no zero with `gamma=0`: for
`0<beta<1`, pairing the eta series gives `eta(beta)>0`, while
`1-2^(1-beta)<0`, and hence `zeta(beta)<0`.  The pinned finite-height
theorem puts the remaining lower block on the critical line, so the same
weaker margin holds there.  Since the right side of (4.12) decreases with
`epsilon`, while (4.13) applies above height `T`, one obtains the following
all-height value estimate, valid at every zero location:

\[
\boxed{
\begin{aligned}
 \sup_{z\in\mathcal Z_c}|A_p(z)|
 \leq E_{\lambda,N}\sqrt{\lambda-\lambda^{-1}}
 +\max\Bigg\{&
 {2\sqrt{2D_S(\lambda)D_\lambda^{\rm KRD}}\over\delta_T}
       e^{-\delta_Ta/2},\\
 &{\sqrt\lambda\,C_\lambda^{\rm BV}\over T}
 \Bigg\}.
\end{aligned}}                                             \tag{4.16}
\]

Zeros are counted here with algebraic multiplicity, although repetition
does not change the supremum.  Taking `T=N` in (4.16) proves

\[
 \boxed{
 \sup_{z\in\mathcal Z_c}|A_{P_NC_aSK}(z)|\longrightarrow0}
                                                               \tag{4.17}
\]

on (4.14).  Indeed
`log N=9600(log 2)lambda^2`, so
`delta_N^(-1)=O(lambda^(4/3)(log lambda)^(1/3))`;
`D_S(lambda)=O(lambda^7)`; the explicit (4.5) makes
`sqrt(D_lambda^KRD)` exponentially small in `lambda^2/log(lambda)`; and
every remaining term in (4.16) contains either `N^(-1/2)` or `N^(-1)`
times a polynomial.  These asymptotic readings are not substituted for the
finite formula (4.16).

The all-height step uses the published external theorems pinned in
`ZERO_SAMPLING_SOURCE_LOCK.json`.  Their disclosed computer-assisted
dependencies are not replayed here, but no zero table is read and no zero is
assumed to lie on the critical line outside the published finite-height
range.

**Proof.**  The circular-variation theorem for each source label gives

\[
 \operatorname {TV}_{\rm circle}(K_n)
 \le4\lambda(2\pi\lambda^2+1/2)
       +32\pi\lambda^2\sqrt{d_n}.
\]

Use

\[
 d_0\le d_4\le D_\lambda^{\rm KRD},
 \qquad |a_{0,\lambda}/a_4|\le2\sqrt2\lambda,
\]

then apply the exact periodic-BV projection inequality.  This proves the
first and third assertions in (4.9).  The arithmetic-map inequality

\[
 \|C_a\mathcal E(f)\|_2^2
 \le {\lambda^2\over2}\|f\|_2^2
\]

for even source functions, orthogonality of the labels `0,4`, and
contraction under `S` prove the middle assertion.  The invisible correction
does not alter `X`.

The weighted outer theorem gives, for real `|y|<1/2`,

\[
 \|e^{y\,\cdot}O\|_2^2
 \le {D_S(\lambda)d_4\over1/2-|y|}.                       \tag{4.18}
\]

On the right tail choose
`y=|sigma|+theta epsilon`.  Each of the two reflected exponentials is then
bounded by

\[
 \left({D_S(\lambda)D_\lambda^{\rm KRD}\over(1-\theta)\epsilon}
       \right)^{1/2}
 \left(\int_a^\infty e^{-2\theta\epsilon t}\,dt
       \right)^{1/2}.
\]

Adding them proves the first term of (4.10).  The projection term is at
most

\[
 \|R\|_2\mathcal J_a(|\sigma|),
\]

which proves (4.10).  Elementary differentiation gives (4.11).

For (4.13), extend `X` by zero.  Its full-line variation is at most

\[
 \operatorname {TV}_{\mathbb R}(X)
 \le V_\lambda+2|X(a)|
 \le3V_\lambda+{2P_\lambda\over\sqrt L}.
\]

The last inequality follows by choosing a point where
`|X|<=||X||_2/sqrt(L)` and then using circular variation.  Stieltjes
integration by parts gives

\[
 |A_X(z)|\le{\lambda^{|\sigma|}C_\lambda^{\rm BV}\over|z|}
 \le{\sqrt\lambda\,C_\lambda^{\rm BV}\over|\gamma|}.
\]

Since `p=X-R`, this proves (4.13).  The pinned zero-free and finite-height
inputs then give (4.16), and the displayed asymptotics give (4.17).
\(\square\)

Multiplicity yields a little more, but no ground-state transfer.  If `z`
has algebraic multiplicity `m`, then for every `0<=j<m`,

\[
 A_p^{(j)}(z)=-A_O^{(j)}(z)-A_R^{(j)}(z).                 \tag{4.19}
\]

For the same `theta`, the two terms are bounded explicitly by

\[
\begin{aligned}
 |A_O^{(j)}(z)|
 &\le2\left({D_S(\lambda)D_\lambda^{\rm KRD}
                 \over(1-\theta)\epsilon}\right)^{1/2}
 \left({\Gamma(2j+1,2\theta\epsilon a)
              \over(2\theta\epsilon)^{2j+1}}\right)^{1/2},\\
 |A_R^{(j)}(z)|
 &\le E_{\lambda,N}
 \left(\int_{-a}^a|t|^{2j}e^{-2\sigma t}\,dt\right)^{1/2}.
\end{aligned}                                             \tag{4.20}
\]

Thus the loss of the source zero order under restriction and projection is
quantified through all derivatives below `m`.  There is no uniform
multiplicity bound, and (4.20) does not turn a repeated zero into extra
decay for the value in (4.16).

### Why this does not close the boundary or resolvent target

The critical moment `H=A_p(1/2)` lies on the boundary of the Mellin strip,
where `epsilon=0` and (4.10) necessarily degenerates.  Its anchor limit is
already obtained by the separate harmonic-sum theorem.  More importantly,
for an actual Weil ground `x` and any scalar `c`, transferring (4.17) would
require control of

\[
 A_x(z)-cA_p(z)=A_{x-cp}(z),                              \tag{4.21}
\]

uniformly as zeros approach the strip boundary.  The elementary bound for
(4.21) contains the same factor

\[
 \mathcal J_a(|\Re z|)\|x-cp\|_2
\]

whose required decay is the still-open ground comparison.  Using that
comparison here and then feeding the result back into its proof would be
circular.

Likewise, pointwise smallness of the anchor evaluations supplies neither a
signed sector floor nor the inverse-weighted graph estimate in equation
(5.2).  The residual pairing needs a sampling bound against every test
vector and then a shifted inverse; a supremum bound for one anchor does not
provide either.  Consequently (4.17) is a genuine uniform approximate
zero-divisor theorem after restriction and projection, but it does not
improve the open boundary moment or equation-(5.2) route.

## 5. Fixed-profile Laplace obstruction

Let `phi in C_c^1(R)` be even, supported in `[-R,R]`, and put

\[
 \Phi(z)=\int_{-R}^R\phi(y)e^{-zy}\,dy.                \tag{5.1}
\]

For `a>R`, define

\[
 \mathscr E_\phi(a)
 =\int_{-R}^R g(a-y)\phi(y)\,dy
  +2e^{-a/2}\Phi(1/2).                                \tag{5.2}
\]

The same smoothing argument as in Theorem 3.1 gives the absolutely
convergent expansion

\[
 \boxed{
 \mathscr E_\phi(a)
 =-2\sum_{\mathfrak p\in\mathfrak P}
       \Phi(z_{\mathfrak p})
       {\sinh(az_{\mathfrak p})\over z_{\mathfrak p}}.}
                                                               \tag{5.3}
\]

Indeed integration by parts gives `Phi(z)=O(|z|^(-1))` uniformly in the
closed critical strip, and (1.2) again applies.

For any `A>R`, initially in `Re(s)>1/2`, termwise integration gives

\[
\begin{aligned}
 \int_A^\infty\mathscr E_\phi(a)e^{-sa}\,da
 =-\sum_{\mathfrak p\in\mathfrak P}
 {\Phi(z_{\mathfrak p})\over z_{\mathfrak p}}
 \left[
 {e^{-(s-z_{\mathfrak p})A}\over s-z_{\mathfrak p}}
 -{e^{-(s+z_{\mathfrak p})A}\over s+z_{\mathfrak p}}
 \right].                                             \tag{5.4}
\end{aligned}
\]

The right side is locally normally convergent away from its displayed poles
and hence is meromorphic.  At a distinct centered zero location `z`, its
residue is

\[
 \boxed{-{m(z)\Phi(z)\over z},}                        \tag{5.5}
\]

where `m(z)` is the algebraic multiplicity.

### Theorem 5.1 (decay forces zero-set annihilation)

Suppose that, for some `eta>=0` and fixed `M`,

\[
 \mathscr E_\phi(a)=O((1+a)^M e^{-\eta a}).            \tag{5.6}
\]

Then `Phi(z)=0` at every centered zero orbit having a member in
`Re(z)>-eta`.

**Proof.**  Condition (5.6) makes the left side of (5.4) holomorphic in
`Re(s)>-eta`.  Equality in the original half-plane and uniqueness of
meromorphic continuation make every pole of the right side in that larger
half-plane removable.  Equation (5.5), and `z!=0`, force the stated
vanishing.  \(\square\)

If `eta>0`, every `+-` orbit meets `Re(z)>-eta`, so `Phi` must vanish at every
distinct centered nontrivial zero.  This conclusion does not demand a zero
of order `m(z)`: the logarithmic derivative has a simple pole with residue
`m(z)`.

If `eta=0`, boundedness of `mathscr E_phi` forces `Phi(z)=0` at every
off-line orbit.  In particular, if

\[
 \Phi(z)\ne0\qquad(0<|\Re z|<1/2),                    \tag{5.7}
\]

then boundedness of the fixed-profile convolution implies that all
nontrivial zeros lie on the critical line.  This is a sufficient criterion,
not an established bound.

### Corollary 5.2 (an explicit bounded-convolution criterion)

Fix `r>0`, let `chi_r=1_[-r,r]`, and let

\[
 \phi_r=\chi_r*\chi_r*\chi_r*\chi_r                   \tag{5.8}
\]

be the four-fold additive Lebesgue convolution.  Then `phi_r` is even,
belongs to `C_c^2(R)`, is supported on `[-4r,4r]`, and has bilateral Laplace
transform

\[
 \boxed{
 \Phi_r(z)=\left({2\sinh(rz)\over z}\right)^4.}       \tag{5.9}
\]

The value at `z=0` is removable and nonzero, and every other zero of
`Phi_r` is `i*pi*k/r` for a nonzero integer `k`.  Therefore

\[
 \boxed{
 \sup_{a>4r}|\mathscr E_{\phi_r}(a)|<\infty}
                                                               \tag{5.10}
\]

holds if and only if every nontrivial zeta zero lies on the critical line.

**Proof.**  If every centered zero is `z=i*gamma`, equation (5.3) and

\[
 |\Phi_r(i\gamma)|\leq {16\over|\gamma|^4}
\]

give the uniform absolutely convergent majorant

\[
 32\sum_{\mathfrak p}|\gamma_{\mathfrak p}|^{-5}<\infty.
\]

Conversely, (5.10) and Theorem 5.1 force `Phi_r(z)=0` at every centered
zero with positive real part.  Formula (5.9) has no such zeros.  The
functional-equation symmetry would place a positive-real-part member in
every off-line `+-` orbit, so no off-line orbit can exist.  Multiplicity only
multiplies the nonzero residue in (5.5).  \(\square\)

Equation (5.10) is an equivalent real-variable criterion, not a proof of its
boundedness.  A derivation based on a truncated product
`Phi_r(s)*mathcal Lg(s)` must retain the compact lower-limit correction; that
correction is entire and cannot remove an off-line pole.

### Corollary 5.3 (exact prime-side fourth-difference formula)

For a function `U`, define

\[
 \delta_r^4U(a)=U(a+4r)-4U(a+2r)+6U(a)
                 -4U(a-2r)+U(a-4r).                 \tag{5.11}
\]

For `m>=1`, put

\[
 R_m(t)=\sum_{2\leq n\leq e^t}
       {\Lambda(n)\over\sqrt n}(t-\log n)^m,          \tag{5.12}
\]

with the locked inclusive endpoint.  For `j>=0` and `t>0`, define

\[
 A_j(t)=\sum_{q\geq0}
       {e^{-(2q+1/2)t}\over(2q+1/2)^{j+1}}.           \tag{5.13}
\]

Then, for `a>4r`,

\[
 \boxed{
 \begin{aligned}
 \mathscr E_{\phi_r}(a)
 ={}&\delta_r^4\left({R_4\over24}-A_4\right)(a)
       -4\Phi_r(1/2)\sinh(a/2)\\
    &+\left(2-{c_*\over2}\right)\Phi_r(0),
 \end{aligned}}                                      \tag{5.14}
\]

where

\[
 \Phi_r(0)=(2r)^4,
 \qquad
 \Phi_r(1/2)=(4\sinh(r/2))^4.                        \tag{5.15}
\]

**Proof.**  The cumulative distribution of the four-fold box spline is

\[
 {1\over24}\left[(u+4r)_+^4-4(u+2r)_+^4+6u_+^4
                   -4(u-2r)_+^4+(u-4r)_+^4\right].  \tag{5.16}
\]

Fubini applied to the right-continuous weighted Chebyshev sum turns (5.16)
into `delta_r^4 R_4/24`.  A prime power exactly at an endpoint remains in
`R_4`; its zero logarithmic power at one edge is part of the exact formula,
not permission to omit it from the source inventory.

Expanding

\[
 H_0(t)=\sum_{q\geq0}{e^{-(2q+1/2)t}\over2q+1/2}
\]

and using

\[
 \delta_r^4e^{-\alpha t}=(2\sinh(r\alpha))^4e^{-\alpha t}
\]

gives the term `-delta_r^4 A_4`.  The remaining exponential and constant
terms in (2.1)--(2.2), including the correction in (5.2), give the last two
terms of (5.14).  \(\square\)

The pinned Fiori--Kadiri--Swidinsky estimate and endpoint-compatible partial
summation give only

\[
 \boxed{
 \mathscr E_{\phi_r}(a)
 =O_r\!\left(e^{a/2}a^{3/2}
             e^{-0.8476836\sqrt a}\right).}           \tag{5.17}
\]

A fixed fourth difference does not turn that exponential-type estimate into
a bounded or subexponential one.

### Corollary 5.4 (one-sided Landau and fifth-Riesz criteria)

Each of the following statements, taken separately, is equivalent to all
nontrivial zeros lying on the critical line:

1. for every `epsilon>0`, eventually

   \[
    \mathscr E_{\phi_r}(a)\leq C_\epsilon e^{\epsilon a};
                                                               \tag{5.18}
   \]

2. the corresponding one-sided lower bound

   \[
    \mathscr E_{\phi_r}(a)\geq-C_\epsilon e^{\epsilon a};
                                                               \tag{5.19}
   \]

3. for one fixed `A>4r`,

   \[
    \int_A^T\mathscr E_{\phi_r}(a)\,da
       =O_\epsilon(e^{\epsilon T})
       \quad\hbox{for every }\epsilon>0.              \tag{5.20}
   \]

**Proof.**  The critical-line direction follows from the uniformly
absolutely convergent series in Corollary 5.2.  Conversely, under (5.18),
the function

\[
 C_\epsilon e^{\epsilon a}-\mathscr E_{\phi_r}(a)
\]

is eventually nonnegative.  The real-abscissa lemma proved in Lemma 2.1
of `notes/ODD_FAVORABLE_LOCKED_SUBSEQUENCE.md` forces its Laplace abscissa to
be at most `epsilon`: the continued transform is holomorphic at every real
point larger than `epsilon`, since `xi(1/2+s)` is nonzero for every real
`s>0` (by the eta sign in the strip, `xi(1)!=0`, and the Euler product to the
right).  Thus the Laplace transform of
`mathscr E_(phi_r)` has no pole in `Re(s)>epsilon`.  Taking `epsilon` smaller
than the positive real part of a hypothetical centered off-line zero
contradicts the nonzero residue (5.5) and (5.9).  The proof of (5.19) is the
same with the opposite sign.

Under (5.20), integration by parts makes the Laplace transform holomorphic
throughout `Re(s)>0`, and the same residue argument applies.  \(\square\)

The primitive in (5.20) is itself an exact fifth-Riesz expression.  Namely,

\[
 \int_A^T\mathscr E_{\phi_r}(a)\,da=M_r(T)-M_r(A),     \tag{5.21}
\]

where

\[
 \boxed{
 \begin{aligned}
 M_r(T)={}&{\delta_r^4R_5(T)\over120}
       +\delta_r^4A_5(T)
       -8\Phi_r(1/2)\cosh(T/2)\\
       &+\left(2-{c_*\over2}\right)\Phi_r(0)T.
 \end{aligned}}                                      \tag{5.22}
\]

These weaker one-sided and Cesaro formulations remain unproved for the
actual von Mangoldt measure.

### Proposition 5.5 (magnitude and monotonicity still do not suffice)

Fix `1/2<beta<1` and put `sigma=beta-1/2`.  For sufficiently small
`theta>0`, the two positive right-continuous step measures with jumps

\[
 w_n^\pm=1\pm\theta\beta n^{\beta-1},
 \qquad n=2,3,\ldots,                                  \tag{5.23}
\]

obey the same Fiori--Kadiri--Swidinsky magnitude envelope relative to their
main term `X`, for every `X>2`, after the harmless bounded floor error is
included.  Their weighted sums satisfy

\[
 \widetilde W_\pm(X)
 =2\sqrt X+C_\pm
   \pm{\theta\beta\over\sigma}X^\sigma+o(1),          \tag{5.24}
\]

and their box-spline residuals therefore obey

\[
 \widetilde{\mathscr E}_{\phi_r}^{\,\pm}(a)
 =\pm{\theta\beta\over\sigma}
       \Phi_r(\sigma)e^{\sigma a}+O(1).               \tag{5.25}
\]

**Proof.**  Positivity follows by decreasing `theta` if necessary.  Put

\[
 B(X)=9.22022X(\log X)^{3/2}
                 e^{-0.8476836\sqrt{\log X}}.
\]

Elementary differentiation shows that `B` is increasing for `X>2`, and
`B(2)>5>2`.  The unperturbed counting function has floor error at most `2`.
Moreover,

\[
 {\beta\sum_{2\leq n\leq X}n^{\beta-1}\over B(X)-2}
\]

is bounded on `X>2` and tends to zero.  Choose `theta` below the reciprocal
of its supremum.  Then the perturbation fits inside the explicit slack
`B(X)-2` at every `X>2`, proving the claimed all-range envelope.  Euler
summation gives (5.24), and convolution with `phi_r` multiplies
`e^(sigma a)` by `Phi_r(sigma)`, proving (5.25).  \(\square\)

This is a structural countermodel, not an alternate prime system admitted by
the source lock.  It preserves positivity, monotonicity, right continuity,
the endpoint convention, and the pinned magnitude envelope, but not the
exact von Mangoldt weights or prime-power support.  Any proof of (5.18),
(5.19), or (5.20) must exploit that exact arithmetic or an equally strong
signed substitute.

## 6. Consequence for the prolate--Weil route

The source anchor possesses the exact zero divisor (4.3), while restriction
and projection leave the explicit defects in (4.4).  Theorem 4.1 proves that
their combined transform is uniformly small at every centered zero on the
locked diagonal.  A generic fixed profile does not possess that divisor,
and Theorem 5.1 shows that asking for strong decay would force it to acquire
the entire zero set.  The actual finite ground is neither a fixed profile
nor known to inherit (4.3) or (4.17).

Accordingly, the remaining boundary route is a source-specific
anchor-to-ground zero-divisor transfer, with the exterior and projection
defects kept quantitative.  A generic magnitude-only PNT estimate cannot
replace that transfer, and the centered-zero formula (3.7) alone is only a
reconstruction identity.
