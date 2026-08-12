# Fixed label-4/12 complete non-Archimedean cross theorem

## 0. Exact result and claim boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad A=\lambda^2,\qquad
 L=\log A=2\log\lambda .                              \tag{0.1}
\]

Let `f_4` be the actual zero-integral prolate anchor and let `f_12` be
the actual anchor-deflated label-12 source.  Their scalar exterior defects
are denoted by `D_4,D_12`.  Add the fixed state-invisible origin corrections,
form the two global radicals `K_j`, and use the locked compact projection
to write

\[
 K_j=W_j+R_j,\qquad R_j=O_j+P_j,\qquad X_j=W_j+P_j,
 \qquad j=4,12.                                        \tag{0.2}
\]

All quantities in the proof are first divided by `sqrt(D_j)`.  A tilde
denotes this scalar defect whitening.  This note proves

\[
\boxed{
 \begin{aligned}
 |Q_{\rm pr}^{\rm same}(\widetilde O_{12},\widetilde O_4)|&\leq C,\\
 |Q_{\rm refl}(\widetilde O_{12},\widetilde O_4)|&\leq C,\\
 |P_+(\widetilde O_{12},\widetilde O_4)|&\leq C,\\
 \mathcal W_Z(\widetilde R_{12},\widetilde R_4)
  -\mathcal W_Z(\widetilde O_{12},\widetilde O_4)&=o(1).
 \end{aligned}}                                        \tag{0.3}
\]

Here `Q_pr^same` is the complete same-side inclusive-minus-prime fold,
not a truncated endpoint expansion.  The reflected entry retains the
continuous, prime, and logarithmic pieces in one Stieltjes quadrature.
The even pole has its locked positive rank-one sign.  Both mixed
outer/projection orientations occur in the last line.

The exact physical-outer decomposition is

\[
 \mathcal W_Z(\widetilde O_{12},\widetilde O_4)
 =P_+(\widetilde O_{12},\widetilde O_4)
  +Q_{\rm ar}^{\rm same}(\widetilde O_{12},\widetilde O_4)
  +Q_{\rm pr}^{\rm same}(\widetilde O_{12},\widetilde O_4)
  -2\lambda\mathcal M_{12,4;A}.                         \tag{0.4}
\]

Consequently (0.3) is exactly the non-Archimedean estimate

\[
\boxed{
 C_{4,12}(\lambda)-Q_{\rm ar}^{\rm same}(O_{12},O_4)
 =O\!\left(\sqrt{D_4D_{12}}\right),\qquad
 C_{4,12}=\mathcal W_Z(R_{12},R_4).}                    \tag{0.5}
\]

No sign is assigned to any separately split reflected prime or continuous
piece.  In particular, (0.5) does not prove the weighted Archimedean
asymptotic

\[
 Q_{\rm ar}^{\rm same}(O_{12},O_4)
 \sim \mathcal G_8\sqrt{D_4D_{12}}\log c.              \tag{0.6}
\]

Thus this note does not by itself decide the anchor/label-12 cross.  It
proves no positivity, no growing-rest floor, no residual action estimate,
no equation (5.2) of `DIRECT_RH_ATTACK.md`, and no RH conclusion.  The
formal project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md` | `fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c` |
| `notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md` | `e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17` |
| `notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md` | `287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` | `3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `notes/COMPACT_PROJECTION_WEIL_BOUND.md` | `61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93` |
| `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` | `3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd` |
| `notes/PROLATE_TAIL_ENVELOPE.md` | `309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d` |
| `notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` | `b16d33c89dd1517875180a0a5b03f0c0e2b601b0e0e608090016174a464e1e11` |

Only fixed labels occur below.  No estimate is asserted uniformly after
the label inventory is allowed to grow.

## 2. Actual columns and reduction to pure fixed labels

For a pure prolate label put

\[
 d_j=1-\chi_j^2,\qquad z_j={h_{j,\lambda}\over\sqrt{d_j}}.
                                                               \tag{2.1}
\]

The actual zero-integral anchor and anchor-deflated label-12 source are

\[
 f_4=h_{4,\lambda}-{I_4\over I_0}h_{0,\lambda},
 \qquad
 f_{12}=h_{12,\lambda}-\alpha_{12}h_{4,\lambda}
                         +b_{12}h_{0,\lambda}.          \tag{2.2}
\]

Their exact scalar exterior metrics are

\[
 D_4=d_4+\left|{I_4\over I_0}\right|^2d_0,
 \qquad
 D_{12}=d_{12}+|\alpha_{12}|^2d_4+|b_{12}|^2d_0.       \tag{2.3}
\]

The fixed-prefix theorem gives bounded coefficients and

\[
 {D_4\over d_4}\longrightarrow1,qquad
 {D_{12}\over d_{12}}\longrightarrow1,qquad
 \sqrt{d_0/d_4}=O(\lambda^{-4}),qquad
 \sqrt{d_4/d_{12}}=O(\lambda^{-8}).                    \tag{2.4}
\]

Therefore

\[
 \begin{aligned}
 {f_4\over\sqrt{D_4}}
 &=\sqrt{d_4/D_4}\,z_4
  -{I_4\over I_0}\sqrt{d_0/D_4}\,z_0,\\
 {f_{12}\over\sqrt{D_{12}}}
 &=\sqrt{d_{12}/D_{12}}\,z_{12}
  -\alpha_{12}\sqrt{d_4/D_{12}}\,z_4
  +b_{12}\sqrt{d_0/D_{12}}\,z_0 .
 \end{aligned}                                         \tag{2.5}
\]

It is enough to prove uniform normalized non-Archimedean bounds for every
ordered pure pair in the fixed set `{0,4,12}`.  The first coefficient in
each relevant row of (2.5) tends to one, and every lower-label coefficient
tends to zero.

The invisible correction has coefficient `O(D_j)` before whitening, is
supported in `|x|<1/(2*lambda)`, and preserves every endpoint jet.  Its
coefficient after whitening is `O(sqrt(D_j))`.  Its additive transform is
Schwartz at the physical samples.  It contributes `o(1)` to each normalized
same-side, reflected, and pole entry and exactly zero to the central
arithmetic state.  It will be restored in Section 7.

## 3. Pure fixed-label Jost rows and the Fejer convention

For `j` in `{0,4,12}`, set

\[
 \nu_j={\Theta_j\over2c}={2j+1\over2}+O_j(c^{-1}),
 \quad x_m(s)=\sqrt{m^2e^{2s}-1},
 \quad \beta(x)=\arctan(1/x),                            \tag{3.1}
\]

\[
 \Phi_{j,m}(s)=cx_m(s)+\nu_j\beta(x_m(s)).              \tag{3.2}
\]

Let `B_j` be the one-tail physical profile of the pure defect-white source
`z_j`, and let `g_j(s)=e^(s/2)B_j(s)`.  The exact radial
divided-difference/Volterra construction gives, on the Jost range,

\[
 B_j^0(s)=\sum_{m\geq1}b_m(s)\sin\Phi_{j,m}(s),
 \qquad
 b_m(s)={1\over\sqrt{2\pi m x_m(s)}}.                  \tag{3.3}
\]

Equivalently, the leading `g` amplitude is

\[
 a_m(s)={\{1+x_m(s)^2\}^{1/4}
              \over\sqrt{2\pi}\,m\sqrt{x_m(s)}}.      \tag{3.4}
\]

Formula (3.3) follows by inserting the exact common outgoing amplitude
and the endpoint normalization `e_j^2~2*pi*lambda*d_j`.  It also follows
by solving the endpoint/null identities in the fixed-plane theorem for
either pure row.  All labels are divisible by four, so their outgoing
endpoint signs agree.

Every sample sum is first taken with a finite Fejer cutoff.  The exact
Poisson row identifies its limit:

\[
 B_j(s)=\kappa_j e^{-s/2}P(Ae^s)+\mathcal R_j(s),
 \qquad
 \kappa_j={h_{j,\lambda}(\lambda)
                \over2\sqrt{\lambda d_j}}
 \longrightarrow\sqrt{\pi/2},                          \tag{3.5}
\]

where `P(x)=1/2-{x}` with midpoint values at integers.  The remainder is
kept as one complete radial profile; its growing endpoint jets are never
bounded term by term.  The Volterra symbols have an extra factor `c^(-1)`,
the hard edge uses the exact Bessel model, and all bounds below are uniform
in the Fejer cutoff.

## 4. Complete same-side inclusive-minus-prime bound

For an ordered pure pair define

\[
 T_{jk}(y)=\int_0^\infty B_j(s)\overline{B_k(s+y)}\,ds.
                                                               \tag{4.1}
\]

The locked same-side prime fold is

\[
 Q_{\rm pr}^{\rm same}(O_j,O_k)
 =-2\sum_{n\geq2}{\Lambda(n)\over\sqrt n}
 \left\{T_{jk}(\log n)+\overline{T_{kj}(\log n)}\right\}.
                                                               \tag{4.2}
\]

For `j=k`, (4.2) is the factor `-4` in the admitted scalar theorem.  Thus
the minus-prime sign, both same-side orientations, and the reflected-tail
normalization are locked.

### 4.1 The conditional endpoint row

For every integer `n>=1`,

\[
 \int_0^1P(x)P(nx)\,dx={1\over12n},                    \tag{4.3}
\]

and centered periodic integration gives

\[
 \left|A\int_A^\infty{P(x)P(nx)\over x^2}\,dx
       -{1\over12n}\right|\leq{2\over3nA}.             \tag{4.4}
\]

Consequently the exact endpoint-row cross is

\[
 \int_0^\infty B_{j,P}(s)B_{k,P}(s+\log n)\,ds
 ={\kappa_j\kappa_k\over\sqrt n}
 A\int_A^\infty{P(x)P(nx)\over x^2}\,dx
 =O(n^{-3/2}).                                         \tag{4.5}
\]

This row is removed before the complete Jost remainder is estimated and
is restored only after the Fejer limit.  No separate bound on the large
second-jet Bernoulli row is used.

### 4.2 Equality, separated, reciprocal, and hard-edge branches

At `y=log(n)`,

\[
 x_l(s+\log n)=x_{nl}(s).                               \tag{4.6}
\]

Put `N=nl`.  The equality branch is exactly `m=N`.  The slowly oscillating
difference phase is `(nu_j-nu_k)*beta(x)`.  Since
`ds=x*dx/(1+x^2)`, its absolute contribution is bounded by

\[
 {1\over2\pi l\sqrt n}
 \int_{\sqrt{N^2-1}}^\infty{dx\over1+x^2}
 \leq {1\over\pi\sqrt3\,n^{3/2}l^2}.                  \tag{4.7}
\]

The fast sum phase is smaller by one nonstationary integration.

For `m!=N`, equality of the two difference-phase derivatives is the exact
fixed-label equation

\[
 c(x_m-x_N)(x_mx_N-1)+\nu_kx_m-\nu_jx_N=0.             \tag{4.8}
\]

The last two terms are a bounded fixed-label perturbation of the two
geometric branches `x_m=x_N` and `x_m*x_N=1`.  The first branch has already
been isolated in (4.7).  On the reciprocal branch the sample domain forces
`m=1` for all sufficiently large `c`; its curvature remains comparable to
`c*N^3`.  Splitting the remaining samples into

\[
 m<N/2,\qquad |m-N|\leq N/2,
 \qquad m>3N/2                                          \tag{4.9}
\]

and then dyadically in `|m-N|` gives

\[
 |I_{m,l}^{\rm sep}(n)|
 \leq {K\over n^{3/2}l^2}
 \left\{{1\over(1+|m-N|)(1+m/N)}
       +{c^{-1}\over m(1+m/N)}\right\}
 +V_{m,l}(n).                                          \tag{4.10}
\]

\[
 \sum_{l\geq1}\sum_{m\geq1}|V_{m,l}(n)|
 \leq {K(1+\log n)\over n^{3/2}}.                    \tag{4.11}
\]

The second summand in (4.10) retains the `s=0` boundary for intermediate
samples.  The bounded `nu_j-nu_k` perturbation changes only `K`; it cannot
remove this term.  The elementary sums

\[
 \sum_{m\ne N}{1\over(1+|m-N|)(1+m/N)}\leq K(1+\log N),
 \qquad
 \sum_{m\geq1}{1\over m(1+m/N)}=H_N                 \tag{4.12}
\]

are uniform in the Fejer cutoff.

For `m=1` below the Jost interface, the regular `J_0(cx)` model replaces
the singular amplitude.  Splitting at the reciprocal point and using
`(xJ_1(cx))'=c*x*J_0(cx)` gives

\[
 |I_{1,l}^{\rm hard}(n)|
 \leq {K\lambda\over c\,l^2n^{3/2}}.                   \tag{4.13}
\]

The integrated Bessel-Volterra perturbation gains another `c^(-1)`.
Equations (4.5)--(4.13) prove, for every ordered pair in `{0,4,12}`,

\[
\boxed{
 |T_{jk}(\log n)|
 \leq {K(1+\log n)^2\over n^{3/2}},\qquad n\geq2.}     \tag{4.14}
\]

Therefore

\[
\boxed{
 |Q_{\rm pr}^{\rm same}(O_j,O_k)|
 \leq K\sum_{n\geq2}{\Lambda(n)(1+\log n)^2\over n^2}
 <\infty.}                                             \tag{4.15}
\]

## 5. Complete reflected caustic quadrature

Define the causal convolution

\[
 C_{jk}(y)=(g_j*g_k)(y),\qquad y\geq0.                 \tag{5.1}
\]

The profiles are locally BV after the Fejer limit.  After extension by
zero to the negative half-line, their distributional endpoint atoms are
convolved with locally integrable functions.  Hence

\[
 C_{jk}\in W^{1,1}_{\rm loc},\qquad C_{jk}(0)=0.       \tag{5.2}
\]

Thus a prime endpoint creates no unrecorded Stieltjes boundary term.

### 5.1 Unique generic quartic point and the locked 4/12 phase

The radial derivatives are

\[
 {dx_m\over ds}=x_m+x_m^{-1},\qquad
 \Phi_{j,m}'=cx_m+{c-\nu_j\over x_m}.                  \tag{5.3}
\]

After the bounded fixed-label terms are suppressed, equality of the two
sum-phase radial speeds has the two branches `x_1=x_2` and `x_1*x_2=1`.
Their second derivative can vanish only when both radial coordinates equal
one.  The sample domain therefore has one degenerate point:

\[
 (m,l)=(1,1),\qquad y=\log2,\qquad
 s={1\over2}\log2,qquad x_1(s)=1.                     \tag{5.4}
\]

Writing `y=log(2)+delta` and `s=y/2+z` gives the exact geometric unfolding

\[
 x_1(y/2+z)+x_1(y/2-z)
 =X_0(\delta)+4\delta z^2-4z^4
  +O(\delta^2z^2+|\delta|z^4+z^6).                    \tag{5.5}
\]

Unlike the endpoint-null self-correlation, the pure `4/12` cross has
different fixed phase indices.  Their contribution is a bounded smooth
phase perturbation, including an odd linear term in `z`; it is not silently
set to zero.  On the quartic scale `z=c^(-1/4)u`, every derivative of this
perturbation is lower order.  Weighted quartic van der Corput applied to
(5.5) therefore gives the same uniform envelope.

The locked center phase is also explicit.  Since

\[
 \nu_4={9\over2}+O(c^{-1}),\qquad
 \nu_{12}={25\over2}+O(c^{-1}),\qquad
 2c=\pi p^2\equiv\pi\pmod {2\pi},                      \tag{5.6}
\]

the sum phase at (5.4) is

\[
 2c+(\nu_4+\nu_{12}){\pi\over4}
 ={5\pi\over4}+O(c^{-1})\pmod {2\pi}.                 \tag{5.7}
\]

At the center the pure `g` amplitude from (3.4) is

\[
 a_1\!\left({1\over2}\log2\right)
 ={2^{-1/4}\over\sqrt\pi}+o(1).                       \tag{5.8}
\]

Using `sin(alpha)sin(beta)=(cos(alpha-beta)-cos(alpha+beta))/2` and

\[
 \int_{\mathbb R}e^{-i4cz^4}\,dz
 ={\Gamma(1/4)\over2\sqrt2}c^{-1/4}e^{-i\pi/8},       \tag{5.9}
\]

one obtains the useful phase audit

\[
\boxed{
 C_{12,4}(\log2)
 ={\Gamma(1/4)\cos(\pi/8)\over8\pi}c^{-1/4}
  +o(c^{-1/4})>0.}                                    \tag{5.10}
\]

This local positive coefficient does not determine the sign of the signed
quadrature below.

### 5.2 Complete envelope

Away from (5.4), first- and second-derivative estimates applied to finite
Fejer rows give

\[
 \begin{aligned}
 |I^+_{ml}(y)|
 &\leq Kc^{-1/2}m^{-5/4}l^{-5/4}(1+y)e^{-y/4},\\
 |I^-_{ml}(y)|
 &\leq Kc^{-1}m^{-3/2}l^{-3/2}(1+y)e^{-y/2}.
 \end{aligned}                                         \tag{5.11}
\]

The double majorants converge independently of the Fejer cutoff.  The
hard-edge/hard-edge piece satisfies

\[
 |C_{jk}^{\rm hh}(y)|
 \leq Kc^{-1/4}{\bf1}_{0\leq y\leq Kc^{-1/2}}.         \tag{5.12}
\]

The Volterra errors have an extra `c^(-1)`.  Combining (5.5),
(5.11), and (5.12) proves, for a fixed `eta` in `(0,log(2)/4)`,

\[
\boxed{
 |C_{jk}(y)|\leq K\left\{
 {c^{-1/4}{\bf1}_{|y-\log2|\leq\eta}
       \over(1+c^{1/2}|y-\log2|)^{1/2}}
 +c^{-1/2}(1+y)e^{-y/4}
 +c^{-1/4}{\bf1}_{0\leq y\leq Kc^{-1/2}}\right\}.}   \tag{5.13}
\]

### 5.3 Stieltjes prime-minus-Lebesgue cancellation

The already-combined reflected scalar is

\[
 \begin{aligned}
 \mathcal M_{jk;A}
 ={}&-\int_0^\infty C_{jk}(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
 C_{jk}\!\left(\log{n\over A}\right)\\
 &+A^{-3}\int_0^\infty
 {e^{-3y}C_{jk}(y)\over1-A^{-2}e^{-2y}}\,dy .
 \end{aligned}                                         \tag{5.14}
\]

Equation (5.2), the right-continuous Chebyshev convention, and the fact
that `A=p^2/4` is not an integer make (5.14) exact.  The reflected physical
entry has the locked sign

\[
 \boxed{Q_{\rm refl}(O_j,O_k)=-2\lambda\mathcal M_{jk;A}.}
                                                               \tag{5.15}
\]

The continuous mass of the quartic term in (5.13) is `O(c^(-1/2))`, and
the hard-edge term has the smaller mass `O(c^(-3/4))`.  In the prime sum,
use lattice counting both in the hard-edge interval near `n=A` and in the
quartic core
`|log(n/A)-log(2)|<=c^(-1/2)`.  On dyadic shells below the pinned FKS
relative-error scale use the bound `Lambda(n)<=log(n)`; above that scale
use FKS differencing.  Exactly as in the admitted complete caustic theorem,
each lattice core costs `O(c^(-3/4)*log(c))` and the shells cost
`O(c^(-1/2))`.
The regular term in (5.13) is handled by Chebyshev partial summation.
Therefore

\[
 \boxed{\mathcal M_{jk;A}=O(c^{-1/2}),\qquad
        Q_{\rm refl}(O_j,O_k)=O(1),}                   \tag{5.16}
\]

because `2*lambda*c^(-1/2)=sqrt(2/pi)`.  No short-interval PNT and no
termwise sign assignment is used.

## 6. The even pole is bounded, not merely positive

For a pure normalized row, the outer state is

\[
 O_j(t)=
 \begin{cases}
 B_j(t-\ell),&t>\ell,\\
 B_j(-t-\ell),&t<-\ell,\\
 0,&|t|\leq\ell,
 \end{cases}
 \qquad \ell=\log\lambda.                              \tag{6.1}
\]

At the even pole,

\[
 \widehat O_j(i/2)
 =\sqrt\lambda\int_0^\infty g_j(s)\,ds
 +\lambda^{-1/2}\int_0^\infty e^{-s/2}B_j(s)\,ds.     \tag{6.2}
\]

The second integral is `O(1)` by the fixed-profile `L2` Gram bound and
Cauchy--Schwarz.  In the first integral remove the exact conditional row
from (3.5).  If `F'=P` is its centered periodic primitive, one integration
by parts gives

\[
 \left|\int_A^\infty {P(x)\over x}\,dx\right|
 \leq {K\over A}.                                      \tag{6.3}
\]

For the recombined complete radial remainder, work first at finite Fejer
cutoff.
For `m>=2`, substitute `x=x_m(s)` in (3.4).  Since

\[
 {d\Phi_{j,m}\over dx}=c-{\nu_j\over1+x^2}\geq c/2,
\]

one integration by parts gives `K/(c*m^2)`.  The sample sum is therefore
uniformly summable.  For `m=1`, the Jost part obeys the same bound after its
lower endpoint is moved to `x=c^(-1/4)`.  On the omitted interval the exact
regular model is `J_0(cx)`; the identity

\[
 {d\over dx}\{xJ_1(cx)\}=cxJ_0(cx)                    \tag{6.4}
\]

and the matching estimate give `O(c^(-1))`.  The integrated Volterra
remainder is also `O(c^(-1))`.  Passing to the Fejer limit and restoring
(6.3) yields

\[
 \int_0^\infty g_j(s)\,ds=O(c^{-1}).                  \tag{6.5}
\]

Equations (6.2)--(6.5) imply

\[
 \widehat O_j(i/2)=O(\lambda^{-1/2}).                 \tag{6.6}
\]

The locked even pole is the positive rank-one Hermitian form

\[
 P_+(O_j,O_k)=2\widehat O_j(i/2)
                   \overline{\widehat O_k(i/2)}.       \tag{6.7}
\]

Thus every pure fixed-pair pole entry is `O(lambda^(-1))`, in particular
`O(1)`.  This magnitude estimate is what is needed for the cross; positivity
alone would not prove (0.5).

## 7. Restore the anchor, deflation, and origin corrections

Equations (2.5), (4.15), (5.16), and (6.7) are bilinear.  Their pure-pair
constants are uniform on the finite set `{0,4,12}`.  The coefficient
vectors in (2.5) have bounded Euclidean norm, so the actual scalar-white
anchor/12 same-side, reflected, and pole entries are `O(1)`.

The lower-label terms are more than harmless: the label-zero part of the
anchor is `O(lambda^(-4))` in white coordinates, while the label-four part
of the deflated label-12 row is `O(lambda^(-8))`.  The invisible bump has a
Schwartz sampled transform and an `O(sqrt(D_j))` white coefficient.  Its
self- and cross-terms are `o(1)`.  Hence no ground, anchor-deflation, or
origin correction changes either (5.10) or the bounds in (0.3).

## 8. Compact projection and exact signed ledger

Use the locked cutoff

\[
 N=2^{2400p^2}=\exp(9600\log2\,\lambda^2).             \tag{8.1}
\]

For either scalar-white actual source, the sum of its pure-label
coefficients obeys

\[
 C_\gamma\leq {C\over\sqrt{d_4}}.                     \tag{8.2}
\]

The circular variation includes the hard endpoint jump.  With

\[
 \overline V_\lambda
 =4\lambda\left(2\pi\lambda^2+{1\over2}\right)
   +32\pi\lambda^2,                                    \tag{8.3}
\]

the exact central restrictions satisfy

\[
 \operatorname {TV}_{\rm circ}(X)
 \leq\overline V_\lambda C_\gamma,qquad
 \|X\|_1\leq2\sqrt2\lambda C_\gamma.                 \tag{8.4}
\]

The origin bump contributes exactly zero on the central multiplicative
window.  The admitted Cauchy-form projection estimates then give, uniformly
for both columns,

\[
 |q_\lambda(P,P)|+|q_\lambda(P,W)|+|q_\lambda(W,P)|
 \leq {\operatorname {poly}(\lambda,L,\log N)\over d_4N}.  \tag{8.5}
\]

The pinned defect lower bound yields

\[
 {1\over d_4N}\leq Ce^{-M_{\rm proj}\lambda^2},
 \qquad
 M_{\rm proj}=9600\log2-{320\pi\log96\over\log2}>0.   \tag{8.6}
\]

Thus every quantity in (8.5) is `o(1)`.

It remains to retain the exact signs.  Polarized two-sided radicality gives

\[
 \begin{aligned}
 \mathcal W_Z(O_{12},P_4)&=-q_\lambda(X_{12},P_4),\\
 \mathcal W_Z(P_{12},O_4)&=-q_\lambda(P_{12},X_4),\\
 \mathcal W_Z(P_{12},P_4)&= q_\lambda(P_{12},P_4).
 \end{aligned}                                         \tag{8.7}
\]

Since `X_j=W_j+P_j`, equations (8.5)--(8.7) prove

\[
 \boxed{
 \mathcal W_Z(\widetilde R_{12},\widetilde R_4)
 =\mathcal W_Z(\widetilde O_{12},\widetilde O_4)+o(1).} \tag{8.8}
\]

Both mixed orientations are present.  The signs in (8.7) are not obtained
by applying a nonexistent positive Weil-form Cauchy--Schwarz inequality.

## 9. Assembly

Insert the actual-column conclusions of Section 7 into the exact
physical-outer identity (0.4), and then use (8.8).  The pole (6.7), complete
same-side inclusive-minus-prime fold (4.15), reflected Stieltjes quadrature
(5.16), and all projection-containing terms are bounded in scalar-white
coordinates.  Multiplication by `sqrt(D_4*D_12)` proves (0.5).

The only unestimated term in (0.5) is the weighted same-side Archimedean
cross itself.  Therefore a separate proof of (0.6), with its exact factor
and cutoff-uniform logarithmic moment, would immediately determine the
anchor/label-12 row at its natural `d_8*L` scale.  Nothing in the present
non-Archimedean theorem supplies that missing weighted asymptotic.
