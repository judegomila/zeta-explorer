# Growing low-prefix endpoint-compressed reflected Stieltjes theorem

## 0. Result and exact scope

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad Q\leq C_0L,                                  \tag{0.1}
\]

the same-phase labels

\[
 {\cal I}_Q=\{0,4,8,\ldots,4Q\},                    \tag{0.2}
\]

and the finite Fejer weights

\[
 \omega_H(m)=\left(1-{m\over H+1}\right)_+,
 \qquad H\geq1.                                     \tag{0.3}
\]

Let \({\bf B}^{\rm mod}_{H,Q}(s)\) be the row which synthesizes the
complete physical one-tail profiles of the pure defect-white labels.  It
includes the exact hard sampler and the exact phase-absorbed Volterra
coefficient.  Let \({\bf B}^{\rm bump}_{H,Q}\) be the sampled transform
of the state-invisible origin correction in the actual corrected columns,
and put

\[
 {\bf B}_{H,Q}={\bf B}^{\rm mod}_{H,Q}
                  +{\bf B}^{\rm bump}_{H,Q},\qquad
 {\bf g}_{H,Q}(s)=e^{s/2}{\bf B}_{H,Q}(s).           \tag{0.4}
\]

The locked full-metric dual estimate for its coefficient is
\[
 |f(0)|^2\leq {CL\over\lambda}D^\#(f),\qquad
 \|{\bf B}^{\rm bump}_{H,Q}J_Q\|^2
       \leq {C|f(0)|^2\over\lambda}\leq {CL\over c}. \tag{0.4a}
\]
Its sampled transform is uniformly Schwartz.  Cauchy--Schwarz with the
modal profile frame and summation of the Schwartz samples therefore make
its prime and logarithmic self and cross terms
\(CQ^BL^Bc^{-\eta}\), uniformly in finite Fejer cutoff, for fixed
\(B,\eta>0\).  Its continuous and pole contributions are retained in the
exact positive operators below.  Sections 2--5 analyze the modal row; all
bump prime errors are included in \(E_{{\rm refl},H,Q}^\#\).

Let \(C_Q^\#\) synthesize the endpoint-sheared rest in pure modal
coordinates, and whiten it in the pulled-back full exterior metric:

\[
 D_Q^\#=(C_Q^\#)^*\operatorname {diag}(d_n)C_Q^\#,
 \qquad
 J_Q=\operatorname {diag}(\sqrt {d_n})C_Q^\#
          (D_Q^\#)^{-1/2}.                           \tag{0.5}
\]

On the quotient,

\[
 J_Q^*J_Q=I.                                         \tag{0.6}
\]

For a row \({\bf g}\), use the Hermitian reflected correlation

\[
 {\bf C}_{\bf g}(y)={1\over2}\int_0^y
 \left\{{\bf g}(s)^*{\bf g}(y-s)
       +{\bf g}(y-s)^*{\bf g}(s)\right\}\,ds.       \tag{0.7}
\]

Write \({\bf C}_{H,Q}^\#=J_Q^*{\bf C}_{{\bf g}_{H,Q}}J_Q\), and define
the logarithmic prime measure

\[
 \mu_A=\sum_{n>A}{\Lambda(n)\over n}
                  \delta_{\log(n/A)}.               \tag{0.8}
\]

The exact reflected block, with its even pole, is

\[
\begin{split}
 {\cal R}_{H,Q}^\#={}&P_{+,H,Q}^\#
 +2\lambda\int_0^\infty{\bf C}_{H,Q}^\#(y)\,dy\\
 &-2\lambda\int_0^\infty{\bf C}_{H,Q}^\#(y)\,d\mu_A(y)\\
 &-2\lambda A^{-3}\int_0^\infty
 {e^{-3y}{\bf C}_{H,Q}^\#(y)\over1-A^{-2}e^{-2y}}\,dy .
\end{split}                                          \tag{0.9}
\]

This note proves a cutoff-uniform decomposition

\[
 \boxed{
 {\cal R}_{H,Q}^\#=P_{+,H,Q}^\#+P_{{\rm cont},H,Q}^\#
       +K_{{\rm rec},H,Q}^\#+K_{{\rm sym},H,Q}^\#
       +E_{{\rm refl},H,Q}^\#,}                    \tag{0.10}
\]

where

\[
 P_{+,H,Q}^\#\succeq0,\qquad
 P_{{\rm cont},H,Q}^\#\succeq0,                    \tag{0.11}
\]

\[
 \boxed{
 \|K_{{\rm rec},H,Q}^\#\|\leq C\log^2(Q+2),\qquad
 \|K_{{\rm sym},H,Q}^\#\|
       \leq C\sqrt Q\log^2(Q+2),}                  \tag{0.12}
\]

and, for fixed \(B_0\) and \(\eta_0>0\),

\[
 \boxed{
 \sup_{H\geq1}\|E_{{\rm refl},H,Q}^\#\|
 \leq C Q^{B_0}L^{B_0}c^{-\eta_0}.}                \tag{0.13}
\]

The finite Fejer forms have an ordered limit at fixed \(c,Q\), and the
same estimates hold in that limit.  Consequently

\[
 \boxed{
 \sup_{H\geq1}\|({\cal R}_{H,Q}^\#)_-\|
 \leq C\{\sqrt Q\log^2(Q+2)+\log^2(Q+2)
                  +Q^{B_0}L^{B_0}c^{-\eta_0}\}=o(L).}           \tag{0.14}
\]

The proof keeps the continuous reflected term and the even pole as
positive operators.  It bounds the negative prime operator directly;
it does not obtain (0.14) from cancellation between the continuous and
prime Stieltjes pieces.

The theorem corrects one support overestimate in the earlier principal
FIO reduction.  The physical symmetric support is
`m,l<=csc(beta)`, and the physical reciprocal support is
`m<=csc(beta), l<=sec(beta)` (plus the interchanged orientation).
Therefore `(1,2,0)` and `(2,1,0)` are ghost stationary points outside
the convolution interval, not boundary caustics.  The only physical
coalescence is `(m,l,y)=(1,1,log(2))`.  Ordinary critical-point/endpoint
crossings have nonzero curvature and are retained by bounded endpoint
transition factors.

This is only the reflected Stieltjes theorem.  It does not estimate the
same-side non-equality prime fold or the centered Archimedean multiplier,
does not prove the full outer remainder, a low-prefix floor, a physical
high-complement theorem, a determinant or zero theorem, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or the Riemann hypothesis.  The formal state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md` | `e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe` |
| `tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py` | `a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713` |
| `notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` | `173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc` |
| `tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py` | `5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b` |
| `notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md` | `1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce` |
| `tests/test_growing_low_prefix_complete_profile_fio_reduction.py` | `ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d` |
| `notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md` | `b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44` |
| `tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py` | `16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7` |

The Jost theorem supplies the phase-absorbed finite parameter-derivative
class, the cutoff-uniform shell BV estimates, defect-white normalization,
and the hard Liouville graph.  The endpoint-null theorem supplies its
pointwise hard divided difference, the exact `m^(-4)` tail frame, and the
full-metric congruence.  The FIO reduction supplies the two interior
stationary geometries, principal amplitudes, FKS measure estimate, and
finite-resolution Fourier embedding.  Its support conditions are repaired
in Section 3 below.  The Toeplitz Gram theorem supplies the cutoff-uniform
positive profile frame used only for the logarithmic tail.

No scalar divisor mask, midpoint row, or finite-cutoff radical identity is
used.  All finite-cutoff statements are correlations of the honest outer
profile.

## 2. Exact signs, positivity, and endpoint compression

### 2.1 The two positive pieces

For a compressed vector \(z\), put

\[
 g_{H,z}(s)={\bf g}_{H,Q}(s)J_Qz,
 \qquad
 \ell_Hz=\int_0^\infty g_{H,z}(s)\,ds.              \tag{2.1}
\]

The far divided-difference estimate makes \(g_{H,z}\) integrable,
uniformly up to a fixed polynomial in \(Q\).  Fubini and (0.7) give

\[
 z^*\left\{2\lambda\int_0^\infty
             {\bf C}_{H,Q}^\#(y)\,dy\right\}z
 =2\lambda|\ell_Hz|^2.                              \tag{2.2}
\]

Thus

\[
 P_{{\rm cont},H,Q}^\#=2\lambda\ell_H^*\ell_H\succeq0.          \tag{2.3}
\]

The locked even pole is the exact rank-one Gram

\[
 P_{+,H,Q}^\#=2r_{+,H}^*r_{+,H}\succeq0,            \tag{2.4}
\]

where \(r_{+,H}z=\widehat O_{H,z}(i/2)\).  It is not expanded or
estimated entrywise.

### 2.2 The endpoint ideal is exact

In pure defect-white coordinates set

\[
 \epsilon_Q=\left({e_{4j}\over\sqrt {d_{4j}}}\right)_{j=0}^Q.
                                                               \tag{2.5}
\]

Choose a reference label \(r\in{\cal I}_Q\), and write
\({\bf g}^{\rm mod}=e^{s/2}{\bf B}^{\rm mod}\).  Linearity of the exact
finite-Fejer sampling map gives the modal profile identity

\[
 {\bf g}^{\rm mod}_{H,Q}=g_{r,H}\epsilon_Q^*
                     +\widetilde{\bf g}^{\rm mod}_{H,Q},        \tag{2.6}
\]

where the \(j\)-th entry of \(\widetilde{\bf g}^{\rm mod}_{H,Q}\) samples
\(\epsilon_j(F_{4j}-F_r)\).  Endpoint nullity gives

\[
 \epsilon_Q^*J_Q=0,
 \qquad {\bf g}^{\rm mod}_{H,Q}J_Q
       =\widetilde{\bf g}^{\rm mod}_{H,Q}J_Q.        \tag{2.7}
\]

On inserting (2.6) into (0.7), every term containing the reference row
belongs to

\[
 {\mathfrak I}_{\epsilon,H}
 =\{\epsilon_Qu_H^*+u_H\epsilon_Q^*
                +\alpha_H\epsilon_Q\epsilon_Q^*\}. \tag{2.8}
\]

Therefore

\[
 J_Q^*EJ_Q=0\quad(E\in{\mathfrak I}_{\epsilon,H}),
 \qquad
 J_Q^*{\bf C}_{{\bf g}^{\rm mod}_{H,Q}}J_Q
 =J_Q^*{\bf C}_{\widetilde{\bf g}^{\rm mod}_{H,Q}}J_Q.           \tag{2.9}
\]

This is the only exact endpoint deletion used below.  A boundary term of
the divided-difference row is not put into (2.8) merely because it occurs
at \(s=0\); it is retained and estimated.  In particular, finite Fejer
sampling is not silently replaced by a Poisson endpoint identity.

## 3. Correct physical stationary support

For a sampler pair \((m,l)\), separation \(y\geq0\), and integration
variable \(0\leq s\leq y\), put

\[
 x_1=\sqrt{m^2e^{2s}-1},\qquad
 x_2=\sqrt{l^2e^{2(y-s)}-1},\qquad
 r=ml e^y.                                          \tag{3.1}
\]

The leading sum-phase stationary equation is

\[
 x_1+x_1^{-1}=x_2+x_2^{-1}.                         \tag{3.2}
\]

It has the symmetric branch \(x_1=x_2\) and the reciprocal branch
\(x_1x_2=1\).  The integration interval imposes additional conditions
which must be retained.

On the symmetric branch set \(x_1=x_2=\cot\beta\).  Then

\[
 r=\csc^2\beta,\qquad
 s=\log {\csc\beta\over m},\qquad
 y-s=\log {\csc\beta\over l},                      \tag{3.3}
\]

so its exact support is

\[
 \boxed{m\leq\csc\beta,\qquad l\leq\csc\beta.}  \tag{3.4}
\]

On one reciprocal orientation put
\(x_1=\cot\beta,x_2=\tan\beta\).  Then

\[
 r={2\over\sin2\beta},\qquad
 s=\log {\csc\beta\over m},\qquad
 y-s=\log {\sec\beta\over l},                     \tag{3.5}
\]

and hence

\[
 \boxed{m\leq\csc\beta,\qquad l\leq\sec\beta.} \tag{3.6}
\]

The other orientation interchanges \(m,l\) and
\(\beta,\pi/2-\beta\).  Conditions (3.4) and (3.6) are stronger than
the product-only condition used for an upper bound in the earlier FIO
note.  They show directly that the curvature coalescence at
\(\beta=\pi/4\) admits only \(m=l=1\).  Its separation is
\(y=\log2\).  In particular, the formal points `(1,2,0)` and `(2,1,0)`
do not solve (3.3) or (3.5) with \(0\leq s\leq y\).

When a critical point in (3.3) or (3.5) meets \(s=0\) or \(s=y\), its
normalized second derivative is nonzero unless \(m=l=1,\beta=\pi/4\).
The ordinary endpoint stationary formula is therefore uniform through a
bounded truncated-Gaussian factor.  Taking its absolute value only
decreases the total-variation majorants in Section 4.

At a reciprocal prime atom \(y=\log(n/A)\),

\[
 cr=cml{n\over A}=2\pi mln,                          \tag{3.7}
\]

so the geometric carrier is exactly one.  With
\(\nu_{4j}=4j+1/2+O(Q^2/c)\), the two label carriers are

\[
 e^{i4(j-k)\beta}\quad\hbox{and}\quad
 e^{i4(j+k)\beta},                                  \tag{3.8}
\]

up to a scalar unit carrier and a polynomial-\(Q\), power-small symbol
error.

## 4. Prime stationary frames

### 4.1 Principal amplitudes and measure bounds

Away from the unique coalescence, stationary phase gives, before the
physical factor \(2\lambda\), the absolute amplitudes

\[
 A_{m,l}^{\rm sym}(r)
 =c^{-1/2}{(r-1)^{1/4}\over ml\sqrt{|r-2|}},
 \qquad
 A_{m,l}^{\rm rec}(r)
 =c^{-1/2}{1\over ml\sqrt{r^2-4}}.                  \tag{4.1}
\]

The factor \(2\lambda\) cancels \(c^{-1/2}\) up to an absolute
constant.  The changes of variables in (3.3) and (3.5) give

\[
 \left|{dy\over d\beta}\right|=2\cot\beta
 \quad\hbox{(symmetric)},                            \tag{4.2}
\]

\[
 \left|{dy\over d\beta}\right|=2|\cot2\beta|,
 \qquad \sqrt{r^2-4}=2|\cot2\beta|
 \quad\hbox{(reciprocal)}.                          \tag{4.3}
\]

The principal measures are formed with
\(|y-\log2|>h_c\) and with every radial coordinate in the Jost range.
The exact quartic and hard pieces omitted by these restrictions are
handled in Sections 5.2--5.3.  The actual support restrictions (3.4) and
(3.6) only reduce the sums used in the FIO majorant.  With the Fejer
factors bounded by one, the resulting complex principal measures obey at
Fourier resolution \(h=1/Q\)

\[
 \sup_{|I|=h}|\sigma_{{\rm rec},H}|(I)
 \leq Ch\log^2(e/h),                                \tag{4.4}
\]

\[
 \sup_{|I|=h}|\sigma_{{\rm sym},H}|(I)
 \leq C\sqrt h\log^2(e/h).                         \tag{4.5}
\]

Here the measures include the sign \(-2\lambda\), the stationary
signature, the unit geometric carrier, both realified orientations, and
the bounded endpoint transition factor.  Equations (4.4)--(4.5) follow
from the pinned FKS estimate at scales at least \(1/Q\); its relative
error

\[
 \epsilon_A=10L^{3/2}e^{-0.8476836\sqrt L}          \tag{4.6}
\]

is smaller than every fixed power of \(1/Q\).  At shorter scales used in
the core proof, only the elementary uniform lattice bound

\[
 \mu_A([u-h,u+h])\leq CL(h+A^{-1})                 \tag{4.7}
\]

is used.

### 4.2 Fourier embedding

If \(P(\beta)=\sum_{j=0}^Qz_je^{i4j\beta}\), the finite-resolution
embedding is

\[
 \int|P(\beta)|^2\,d|\sigma|(\beta)
 \leq CQ\sup_{|I|=1/Q}|\sigma|(I)\sum_{j=0}^Q|z_j|^2.            \tag{4.8}
\]

For a square matrix \(M\), put
\(\operatorname {Herm}M=(M+M^*)/2\).  Define

\[
 \widetilde K_{{\rm rec},H,Q}
 =\operatorname {Herm}\left(
   \int e^{i4(j-k)\beta}\,d\sigma_{{\rm rec},H}(\beta)
                       \right)_{0\leq j,k\leq Q},              \tag{4.9}
\]

\[
 \widetilde K_{{\rm sym},H,Q}
 =\operatorname {Herm}\left(
   \int e^{i4(j+k)\beta}\,d\sigma_{{\rm sym},H}(\beta)
                       \right)_{0\leq j,k\leq Q}.              \tag{4.10}
\]

Put \(K_{*,H,Q}^\#=J_Q^*\widetilde K_{*,H,Q}J_Q\).  Since \(J_Q\)
is an isometry, (4.4)--(4.5) and (4.8) prove (0.12).  For the Hankel
matrix, (4.8) is applied once to the positive-frequency analysis map and
once to the negative-frequency map, followed by Cauchy--Schwarz.

## 5. Uniform promotion of the exact prime convolution

Fix a sufficiently small absolute \(\delta_*>0\) and put

\[
 h_c=c^{-1/2+\delta_*}.                              \tag{5.1}
\]

The finite derivative order in the one-dimensional stationary lemma is
fixed first; \(\delta_*\) is then chosen so that every core-excluded
remainder below retains a fixed power \(c^{-\eta_0}\).  This order of
choices is independent of \(H,Q,c\).

### 5.1 Regular Jost cells and ordinary endpoint transitions

On a unit logarithmic shell and for \(m\geq2\), the exact sampled symbol
and its Volterra correction satisfy

\[
 \|\vartheta_rb_{j,m}\|_\infty
    +\operatorname {Var}(\vartheta_rb_{j,m})
 \leq {Ce^{-r/2}\over m},                           \tag{5.2}
\]

\[
 \|\vartheta_re_{j,m}\|_\infty
    +\operatorname {Var}(\vartheta_re_{j,m})
 \leq {CQ^2\over c}{e^{-5r/2}\over m^3}.           \tag{5.3}
\]

Every fixed finite spectral-parameter derivative has the same form with
an additional fixed polynomial in \(Q\).  The normalization replacement
costs \(O(c^{-1/4})\), and replacing \(\nu_{4j}\) by \(4j+1/2\) costs
\(O(Q^2/c)\) in the same summable BV class.

For completeness, use the following standard one-dimensional form of the
stationary lemma.  On a core-excluded cell, an integral with one simple
critical point equals its stationary coefficient times a bounded
truncated-Gaussian endpoint factor, plus

\[
 C_Nc^{-N-1/2}\kappa^{-M_N}
   \sum_{a\leq N}\|\partial^a b\|_{BV},             \tag{5.4}
\]

where \(\kappa\) is the lower bound for the normalized curvature.  If
there is no critical point, \(N\) integrations by parts give the
analogous \(C_Nc^{-N}\) bound with fixed inverse powers of the phase
separation.  Formula (5.4) follows by a Morse coordinate on the critical
patch, Taylor expansion through fixed order \(N\), and integration by
parts off that patch.  The same proof with a half-line Morse coordinate
gives the endpoint transition factor.  Away from (5.1), the quartic
normal form has large parameter \(c|y-\log2|^2\geq c^{2\delta_*}\);
all other normalized curvatures have only fixed powers of this loss.
Thus (5.4), with \(N\) fixed sufficiently large and then \(\delta_*\)
fixed sufficiently small, is \(Q^Bc^{-1/2-\eta}\) before the physical
factor.

After multiplying by \(2\lambda\), the error measures are bounded by
\(Q^Bc^{-\eta}\) times the total-variation measures in (4.4)--(4.5).
The Fourier embedding then gives

\[
 \sup_{H\geq1}\|E_{{\rm reg},H,Q}^\#\|
 \leq CQ^Bc^{-\eta}.                                \tag{5.5}
\]

This estimate includes the phase-index and endpoint-white replacements,
the first omitted stationary coefficient, the nonstationary difference
phase, and every cross containing (5.3).  Ordinary critical-point/endpoint
crossings are included through the bounded factor in (5.4); no ghost
boundary core is introduced.  Every term in the true endpoint ideal was
already removed by (2.9), while the divided-difference endpoint terms are
retained in (5.4).

### 5.2 The unique quartic core

The point \((m,l,y)=(1,1,\log2)\) lies in the Jost region \(x_1=x_2=1\).
The phase-absorbed finite derivative class and the quartic normal form
give, after compression and for a full-metric unit vector,

\[
 \|{\bf C}_{{\rm quart},H,Q}^\#(y)\|
 \leq CQ^B{c^{-1/4}{\bf1}_{|y-\log2|\leq h_c}
        \over(1+c^{1/2}|y-\log2|)^{1/2}}.           \tag{5.6}
\]

The factor polynomial in \(Q\) may be obtained either from the finite
parameter-derivative class or by Hilbert--Schmidt summation over the
\(Q+1\) pure labels before the isometric compression.  It is not a
condition number of the endpoint shear.

Use (4.7) on the natural core
\(|y-\log2|\leq c^{-1/2}\), and then on dyadic shells out to \(h_c\).
Since \(2\lambda\asymp c^{1/2}\), (5.6) gives

\[
 2\lambda\int\|{\bf C}_{{\rm quart},H,Q}^\#(y)\|
                    \,d\mu_A(y)
 \leq CQ^BLc^{-1/4+\delta_*/2}.                     \tag{5.7}
\]

This is a fixed power times a polylogarithm.  No short-interval PNT and
no sign of the quartic coefficient is used.

### 5.3 Hard endpoint and the deep reciprocal ladder

The reference-profile factor in (2.6) must be removed before estimating
the hard row.  Let \(x=x_1(s)\leq c^{-1/4}\).  The pointwise Liouville
derivative bounds give

\[
 |\partial_\mu G_\mu(x)|
 \leq C\min\{x^2,c^{-3/2}x^{1/2}\}.                 \tag{5.8}
\]

The endpoint-null spectral Riesz bound is

\[
 \sum_{j=0}^Q|\epsilon_j|^2
       |\mu_{4j}-\mu_r|^2\leq C\lambda c^2Q^3.      \tag{5.9}
\]

Equations (2.7), (5.8), and (5.9) therefore imply, uniformly for
\(\|z\|=1\),

\[
 |g_{1,H,J_Qz}^{\rm hard}(s)|
 \leq CQ^{3/2}\min\{c^{3/2}x^2,x^{1/2}\}
       +O(c^{-N})                                    \tag{5.10}
\]

for every fixed \(N\), after decreasing the exponential endpoint-defect
bound.  Since \(ds=x\,dx/(1+x^2)\),

\[
 \|g_{1,H,J_Q}^{\rm hard}\|_{L^1}
       \leq CQ^{3/2}c^{-5/8},\qquad
 \|g_{1,H,J_Q}^{\rm hard}\|_{L^\infty}
       \leq CQ^{3/2}c^{-1/8}.                       \tag{5.11}
\]

In particular its hard-hard convolution is

\[
 \|C_{{\rm hard,hard},H,Q}^\#\|_\infty
 \leq CQ^3c^{-3/4}.                                 \tag{5.12}
\]

Both hard factors are supported in an interval of length \(O(c^{-1/2})\).
Thus (4.7) also gives

\[
 2\lambda\int_0^{Cc^{-1/2}}
 \|C_{{\rm hard,hard},H,Q}^\#(y)\|\,d\mu_A(y)
 \leq CQ^3Lc^{-3/4}.                                \tag{5.12a}
\]

Apart from the hard-hard term already bounded in (5.12a), the only
stationary branch which can remain in the hard region is the one-hard
reciprocal ladder.  In the orientation \(m=1\), write its hard coordinate
as \(x\).  Feasibility gives

\[
 0<x\leq(l^2-1)^{-1/2},\qquad
 y=\log{1+x^2\over lx}.                              \tag{5.13}
\]

The part \(x\geq c^{-1/4}\) is covered by Section 5.1.  On the hard part

\[
0<x\leq\min\{c^{-1/4},(l^2-1)^{-1/2}\},            \tag{5.13a}
\]

where the second upper bound is interpreted as \(+\infty\) for \(l=1\).
Combine (5.10) with the regular \(l\)-sampler amplitude and curvature
\(|\Phi''|\asymp cx^{-3}\).  The stationary bound, with the endpoint
length alternative when the critical width meets \(s=0\), is

\[
 2\lambda|I_{1,l}^{\rm hard}(x)|
 \leq {CQ^Bx^2\over l}.                              \tag{5.14}
\]

At a prime atom, (5.13) gives exactly

\[
 {n\over A}={1+x^2\over lx}.                        \tag{5.14a}
\]

For \(0<x\leq c^{-1/4}<1\), this implies \(x\leq2A/(ln)\).  Put

\[
 X_l=\max\left\{A,{A\over lc^{-1/4}}\right\}.        \tag{5.14b}
\]

Chebyshev partial summation gives
\(\sum_{n\geq X}\Lambda(n)n^{-3}\leq CX^{-2}\).  Hence the exact
prime-weighted hard ladder is bounded directly by

\[
\begin{split}
 &CQ^B\sum_{l\geq1}{A^2\over l^3}
       \sum_{n\geq X_l}{\Lambda(n)\over n^3}\\
 &\quad\leq CQ^B\left\{
 c^{-1/2}\sum_{1\leq l\leq c^{1/4}}{1\over l}
 +\sum_{l>c^{1/4}}{1\over l^3}\right\}
 \leq CQ^Bc^{-1/2}\log c .
\end{split}                                          \tag{5.15}
\]

The same calculation can be read as the continuous majorant
\(CQ^Bx\,dx/l\), because \(|dy/dx|\leq C/x\).  It uses no
short-interval prime estimate and includes \(l=1\).  The complete
compressed Jost sampler sum also satisfies

\[
 \|g_{{\rm Jost},H,Q}J_Q(s)\|
 \leq CQ^B(1+s)e^{-s/4}.                             \tag{5.15a}
\]

Together with the hard \(L^1\) bound in (5.11), this gives the complete
nonstationary edge--bulk envelope

\[
 \|C_{{\rm hard,Jost},H,Q}^\#(y)\|
 \leq CQ^Bc^{-5/8}(1+y)e^{-y/4}.                    \tag{5.15b}
\]

Chebyshev partial summation against \(\mu_A\), followed by the physical
factor \(2\lambda\), makes (5.15b) \(CQ^Bc^{-1/8}\).  This includes all
shallow and deep nonstationary hard--Jost crosses; the logarithmic cross
is smaller.  Together with (5.12a), (5.15), and the Volterra bounds,
this proves

\[
 \sup_{H\geq1}\|E_{{\rm hard},H,Q}^\#\|
 \leq CQ^BL^Bc^{-\eta}.                             \tag{5.16}
\]

This is why the hard ladder is not promoted term by term to the Jost
Fourier carrier.  It is first compressed by \(J_Q\), and only its
power-small total is discarded.  The `m^(-4)` endpoint-null tail frame
gives the same bound for the nonstationary deep-sampler crosses.

### 5.4 Prime promotion conclusion

Combining (5.5), (5.7), and (5.16), and restoring the uniformly Schwartz
origin-bump self and cross errors from (0.4), proves

\[
\begin{split}
 -2\lambda\int_0^\infty{\bf C}_{H,Q}^\#(y)\,d\mu_A(y)
 ={}&K_{{\rm rec},H,Q}^\#+K_{{\rm sym},H,Q}^\#
       +E_{{\rm prime},H,Q}^\#,\\
 \sup_{H\geq1}\|E_{{\rm prime},H,Q}^\#\|
 \leq{}&CQ^BL^Bc^{-\eta}.
\end{split}                                          \tag{5.17}
\]

This is an operator estimate after endpoint compression, not an entrywise
fixed-label Stieltjes cancellation.

## 6. The logarithmic tail and the ordered limit

Expanding the last denominator in (0.9) gives the exact negative Laplace
frame

\[
 E_{{\rm log},H,Q}^\#
 =-2\lambda A^{-3}\sum_{k\geq0}A^{-2k}
      \ell_{k,H}^*\ell_{k,H},                        \tag{6.1}
\]

where

\[
 \ell_{k,H}z=\int_0^\infty
      e^{-(3+2k)s}g_{H,z}(s)\,ds
 =\int_0^\infty e^{-(5/2+2k)s}B_{H,z}(s)\,ds.       \tag{6.2}
\]

The cutoff-uniform Toeplitz Gram theorem, together with the
power-small bump row, gives

\[
 \|{\bf B}_{H,Q}J_Q\|^2\leq C\log(Q+2).             \tag{6.3}
\]

Cauchy--Schwarz in (6.2) and the geometric sum in (6.1) yield

\[
 \boxed{
 \sup_{H\geq1}\|E_{{\rm log},H,Q}^\#\|
 \leq C\lambda A^{-3}\log(Q+2)
 \leq Cc^{-5/2}\log(Q+2).}                         \tag{6.4}
\]

All regular sampler majorants above are absolutely summable independently
of \(H\).  The hard ranges use (5.11), (5.15), and the exact compressed
tail frame.  Dominated convergence therefore gives the prescribed ordered
limit \(H\to\infty\) at fixed \(c,Q\).

Equations (2.3), (2.4), (0.12), (5.17), and (6.4) prove
(0.10)--(0.13).  Finally, for Hermitian matrices,

\[
 \|(P+K+E)_-\|\leq\|K\|+\|E\|,
 \qquad P\succeq0.                                  \tag{6.5}
\]

Since \(Q\leq C_0L\), equation (6.5) proves (0.14).

## 7. Reproduction

Run:

    python3 -B -m unittest \
      tests.test_growing_low_prefix_endpoint_compressed_reflected_stieltjes_theorem -v

The regression checks the exact reflected signs, Hermitian polarization,
positive continuous and pole pieces, corrected stationary supports,
absence of ghost endpoint caustics, reciprocal carrier, hard divided
difference powers, quartic and lattice scales, logarithmic Laplace sign,
Fourier-frame rates, frozen hashes, fail-closed scope, ASCII hygiene, and
displayed TeX.
