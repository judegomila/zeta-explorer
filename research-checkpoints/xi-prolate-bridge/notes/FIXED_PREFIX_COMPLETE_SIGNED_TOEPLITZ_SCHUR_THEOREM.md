# Fixed-prefix complete signed Toeplitz--Schur theorem

## 0. Exact result and boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda .             \tag{0.1}
\]

Fix an integer \(M\geq1\).  The label inventory is

\[
 \mathcal T_M=\{4,8,\ldots,4M\}.                     \tag{0.2}
\]

The label-4 column is the actual zero-integral anchor.  Every later
column is the actual anchor-deflated, zero-integral column from the frozen
fixed-prefix construction.  The state-invisible origin corrections and
the locked compact projections are retained.  Write

\[
 K_j=W_j+R_j,\qquad j\in\mathcal T_M,                 \tag{0.3}
\]

for the corrected global radical, compact column, and complete remainder.
Let

\[
 H_M=\bigl(\mathcal W_Z(R_{4j},R_{4k})\bigr)_{j,k=1}^M,
 \qquad
 \Delta_M=\operatorname {diag}(D_4,D_8,\ldots,D_{4M}), \tag{0.4}
\]

where \(D_{4j}\) is the exact scalar exterior metric of the corresponding
actual uncorrected source column used by the quotient.  The invisible bump
belongs only to the global radical in (0.3), not to \(D_{4j}\).  Thus
\(\Delta_M\) is a diagonal scalar-defect normalization.
It is not being silently identified with the full exterior
Gram.

For \(r\in\mathbb Z\), define

\[
 \Gamma_r=\int_0^{\pi/2}w(\beta)\cos(4r\beta)\,d\beta,
 \qquad
 w(\beta)=\sum_{n\leq\csc\beta}{1\over2\pi n},       \tag{0.5}
\]

with the endpoint values understood by monotone limits, and put

\[
 T_M=(\Gamma_{j-k})_{j,k=1}^M.                        \tag{0.6}
\]

This note proves, for every fixed \(M\),

\[
 \boxed{
 \Delta_M^{-1/2}H_M\Delta_M^{-1/2}
   =(\log c)T_M+o_M(\log c)}                           \tag{0.7}
\]

in operator norm.  The remainder in (0.7) is exactly
`o_M(log(c))`; no `O(1)` remainder is asserted.  Moreover

\[
 \boxed{T_M\succeq {1\over4}I_M}                     \tag{0.8}
\]

with a constant independent of \(M\).  Consequently, for each fixed
\(M\),

\[
 \boxed{
 \Delta_M^{-1/2}H_M\Delta_M^{-1/2}
 \succeq {1\over8}\log c\,I_M}                       \tag{0.9}
\]

for all sufficiently large locked \(\lambda\); the threshold may depend
on \(M\).

Equations (0.7)--(0.9) are complete fixed-prefix signed arithmetic
statements: the same-side Archimedean term, inclusive-minus-prime term,
reflected Stieltjes quadrature, even pole, and both compact-projection
orientations are included.  They are not uniform when
\(M=M(\lambda)\) grows.

This theorem does not make the nonzero anchor/label-12 row small.  It
shows instead that its inverse-weighted Schur cost has the natural anchor
scale and leaves a fixed positive fraction of the anchor diagonal.  It
does not prove the old sufficient residual-smallness condition, a growing
rest floor, a physical high-complement comparison, equation (5.2) of
`DIRECT_RH_ATTACK.md`, a determinant limit, a zero statement, or the
Riemann hypothesis.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs and what is rederived

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md` | `b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e` |
| `tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py` | `9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe` |
| `notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md` | `efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca` |
| `tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py` | `12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1` |
| `notes/GENERIC_FIXED_INVERSION_EVEN_COMPLETE_WEIGHTED_PAIR_THEOREM.md` | `c53a709dd1d7603ef1d2361c324a3f91f471705989ee06cd0f715fe4da4ec213` |
| `tests/test_generic_fixed_inversion_even_complete_weighted_pair_theorem.py` | `3dea227c95a0a514578229b2e07b13e4d42ab57f7c5459245c9796ce3344cbe1` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `notes/FIXED_TO_GROWING_TOEPLITZ_OPERATOR_NORM_GATE.md` | `57f4a8014e280e4594221b4466212b0104d2d7c25e9e6ff81808a4eb7f14ce25` |
| `tests/test_fixed_to_growing_toeplitz_operator_norm_gate.py` | `4b2d982c5de1b28fe3bac56e412f43a6a333bf47e643cf6bd435e589271bbf31` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` | `3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f` |
| `notes/COMPACT_PROJECTION_WEIL_BOUND.md` | `61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93` |
| `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` | `3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd` |

The two label-4/12 packages are imported for their exact conventions and
are also used as regression anchors.  They alone do not imply (0.7).  The
generic fixed-pair theorem redoes their Jost, weighted-multiplier, prime,
reflected, pole, and projection arguments for every prescribed pair in
\(4\mathbb Z_{\geq0}\), including the diagonal.  Sections 3--5 record the
finite-inventory specialization needed here.  Every constant in those
sections may depend on \(M\).  No pairwise statement is promoted to a
moving-label statement by analogy.

## 2. Actual columns reduce to a finite pure inventory

Let \(h_{t,\lambda}\) be the pure prolate label and

\[
 d_t=1-\chi_{t,\lambda}^2.                             \tag{2.1}
\]

The actual columns have the form

\[
 f_4=h_{4,\lambda}+\rho_4h_{0,\lambda},               \tag{2.2}
\]

\[
 f_t=h_{t,\lambda}-\alpha_th_{4,\lambda}+b_th_{0,\lambda},
 \qquad t=8,12,\ldots,4M,                             \tag{2.3}
\]

where all coefficients are bounded for fixed \(M\).  Orthogonality of
the pure exterior defects gives

\[
 D_4=d_4+|\rho_4|^2d_0,\qquad
 D_t=d_t+|\alpha_t|^2d_4+|b_t|^2d_0.                 \tag{2.4}
\]

The fixed-label defect hierarchy is

\[
 {d_s\over d_t}\sim {t!\over s!}(16\pi)^{s-t}
               \lambda^{-2(t-s)},\qquad s<t.         \tag{2.5}
\]

Hence, simultaneously on the fixed inventory,

\[
 {D_t\over d_t}\longrightarrow1,\qquad
 \sqrt{d_s/D_t}=O_M(\lambda^{s-t})\quad(s<t).         \tag{2.6}
\]

After scalar-defect whitening, each actual column is therefore its pure
top label plus a finite sum of lower pure white labels with coefficients
tending algebraically to zero.  The invisible origin correction has
coefficient \(O(D_t)\) before whitening and hence
\(O(\sqrt {D_t})\) after whitening.  It is supported in
\(|x|<1/(2\lambda)\), preserves every endpoint jet, and is exactly zero
in the central arithmetic state.  The fixed bump and each of its sampled
transforms have Schwartz bounds; the complete kernel, pole, and projection
estimates applied to one bump row cost at most a fixed-inventory polynomial
in \(\lambda,L\), and \(\log N\).  Since \(D_t\) is exponentially small,
\(\sqrt {D_t}\operatorname {poly}_M(\lambda,L,\log N)=o_M(1)\) after the
locked projection exponent is included.  Thus every bump/pure cross and
bump/bump normalized entry is \(o_M(1)\), rather than merely bounded.

For completeness, if \(\mathfrak D_M\) denotes the exact full exterior
Gram of all columns, then the same calculation gives

\[
 \Delta_M^{-1/2}\mathfrak D_M\Delta_M^{-1/2}
 =I_M+o_M(1).                                         \tag{2.7}
\]

Thus (0.9) is also a generalized lower bound relative to the full metric.
A relative full-metric whitening is obtained by inserting the inverse
square root of the left side of (2.7).  The ordinary Euclidean principal
square root \(\mathfrak D_M^{-1/2}\) need not preserve the displayed
Toeplitz coordinates, so (0.7) deliberately uses the diagonal
normalization fixed in (0.4).

## 3. Pure fixed-label physical Gram

For a pure scalar-defect-white label \(t\in\{0,4,\ldots,4M\}\), let
\(B_t\) be its complete one-tail physical profile.  All sample sums are
first finite Fejer sums.  On the Jost range,

\[
 B_t^0(s)=\sum_{n\geq1}b_n(s)\sin\Phi_{t,n}(s),       \tag{3.1}
\]

\[
 x_n(s)=\sqrt{n^2e^{2s}-1},\qquad
 b_n(s)={1\over\sqrt{2\pi n x_n(s)}},                 \tag{3.2}
\]

\[
 \Phi_{t,n}(s)=cx_n(s)+\nu_t\beta(x_n(s)),\qquad
 \nu_t={2t+1\over2}+O_M(c^{-1}),\qquad
 \beta(x)=\arctan(1/x).                              \tag{3.3}
\]

The complete Volterra symbols have the same phases and an additional
factor \(c^{-1}\).  The reciprocal sample uses the exact regular Bessel
model below the Jost interface.  The sole conditional endpoint row is
kept in its exact Poisson form

\[
 B_t(s)=\kappa_t e^{-s/2}P(\lambda^2e^s)+\mathcal R_t(s),
 \qquad P(x)={1\over2}-\{x\},                         \tag{3.4}
\]

with midpoint values and Fejer convergence.  This is the same
cutoff convention as the two pinned 4/12 packages.

### 3.1 Cutoff-uniform diagonal extraction

On each unit radial interval, the fixed-inventory symbols satisfy

\[
 \|\chi_rb_n\|_\infty+\operatorname {Var}(\chi_rb_n)
 \leq {C_Me^{-r/2}\over n}.                           \tag{3.5}
\]

For \(n,l\geq2\), \(n\ne l\), difference-phase integration and
sum-phase integration give summable majorants of the form

\[
 {C_M\over cnl(1+|n-l|)},\qquad
 {C_M\over cnl(n+l)}.                                 \tag{3.6}
\]

The reciprocal branch has one sample equal to one and total size
\(O_M(c^{-1/2}l^{-2})\).  The hard-edge and Volterra pieces obey the same
summable bounds, with the appropriate additional gain.  Therefore all
unequal-sample products and all fast equal-sample products tend to zero,
uniformly in the Fejer cutoff.  Because the label set is finite, the
constant in (3.5)--(3.6) is common to all its ordered pairs.

For the equal sample, use
\(2\sin u\sin v=\cos(u-v)-\cos(u+v)\) and

\[
 ds={x\,dx\over1+x^2}.                                \tag{3.7}
\]

The fast sum phase vanishes in the limit, while
\(\nu_t-\nu_u\to t-u\).  Thus

\[
 \boxed{
 2\langle B_t,B_u\rangle\longrightarrow
 {1\over2\pi}\sum_{n\geq1}{1\over n}
 \int_{\sqrt{n^2-1}}^\infty
 {\cos((t-u)\beta(x))\over1+x^2}\,dx.}              \tag{3.8}
\]

The right side is absolutely convergent: after the change of variables
\(\beta=\arctan(1/x)\), its \(n\)-th absolute value is at most
\(\arcsin(1/n)/(2\pi n)=O(n^{-2})\).  This also justifies interchanging
the sample sum and the \(\beta\) integral.

For \(t=4j\), \(u=4k\), (3.8) is exactly

\[
 \begin{aligned}
 {1\over2\pi}\sum_{n\geq1}{1\over n}
 \int_0^{\arcsin(1/n)}\cos(4(j-k)\beta)\,d\beta
 &=\int_0^{\pi/2}\sum_{n\leq\csc\beta}{1\over2\pi n}
       \cos(4(j-k)\beta)\,d\beta\\
 &=\Gamma_{j-k}.
 \end{aligned}                                        \tag{3.9}
\]

In particular,

\[
 \Gamma_0={1\over2\pi}\sum_{n\geq1}{\arcsin(1/n)\over n},
                                                               \tag{3.10}
\]

and, for \(r\ne0\),

\[
 \Gamma_r=\sum_{n\geq1}
 {\sin(4r\arcsin(1/n))\over8\pi rn}.                 \tag{3.11}
\]

The pinned anchor/label-12 constant is \(\Gamma_2=\mathcal G_8\).

## 4. The weighted Archimedean matrix

Put

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}
                  +{i\xi\over2}\right)-\log\pi.     \tag{4.1}
\]

Choose \(\delta=1/8\).  The weighted 4/12 proof depends on a label only
through the bounded phase index \(\nu_t\), its fixed Volterra symbols,
and a fixed number of hard-edge matching constants.  Repeating its
finite-Fejer fractional-BV argument with the common maximum over
\(0\leq t\leq4M\) gives

\[
 \sup_c\int_{\mathbb R}
 \left(1+{ |\xi|\over c}\right)^{2\delta}
 |\widehat B_t(\xi)|^2{d\xi\over2\pi}\leq C_M.       \tag{4.2}
\]

The required sample sums are unchanged:

\[
 \sum_{n\geq2}n^{-2+2\delta}(1+\log n)<\infty.       \tag{4.3}
\]

At the endpoint, the exact sawtooth translation estimate remains

\[
 \|F_A(\cdot+h)-F_A\|_2^2
 \leq C\min\left\{1,Ah\left(1+\log_+{1\over Ah}\right)\right\},
                                                               \tag{4.4}
\]

so its \(H^\delta\) seminorm is \(O(A^{2\delta})\).  The logarithm in
(4.4) is retained.  Local `L1` identification plus weak compactness
passes (4.2) from finite Fejer rows to the complete profiles.

The same first-derivative and exact Bessel calculations give

\[
 \sup_{|\xi|\leq c/2}|\widehat B_t(\xi)|\leq {C_M\over c},
 \qquad
 \int_{|\xi|\leq c/2}|\widehat B_t(\xi)|^2
 {d\xi\over2\pi}=O_M(c^{-1}).                         \tag{4.5}
\]

Finally,

\[
 \begin{aligned}
 |a(\xi)-\log c|&\leq C\log c,
       &&|\xi|\leq c/2,\\
 |a(\xi)-\log c|&\leq C+\log^+(|\xi|/c),
       &&|\xi|\geq c/2.
 \end{aligned}                                        \tag{4.6}
\]

Equations (4.2), (4.5), and weighted Cauchy--Schwarz therefore prove,
simultaneously for all pure ordered pairs in the fixed inventory,

\[
 \boxed{
 2\int_{\mathbb R}(a(\xi)-\log c)
 \widehat B_t(\xi)\overline{\widehat B_u(\xi)}
 {d\xi\over2\pi}=O_M(1).}                            \tag{4.7}
\]

Combining (3.8)--(3.9) with (4.7) gives

\[
 {Q_{\rm ar}^{\rm same}(B_{4j},B_{4k})\over\log c}
 \longrightarrow\Gamma_{j-k}.                        \tag{4.8}
\]

Equations (2.6) and (4.2) make the lower-label corrections harmless even
for the unbounded multiplier: each pure row is controlled before the
algebraically small coefficient is inserted.  Thus (4.8) also holds for
the actual scalar-defect-white columns.

## 5. Complete non-Archimedean finite-inventory ledger

It remains to prove that every other complete-form entry is
\(O_M(1)\) in scalar-white coordinates.  The pure rows in Sections
5.1--5.3 are only linear physical-outer building blocks.  A pure prolate
row is not zero-integral, so no global radical or compact projection is
attached to it.  Those objects are formed only after the actual
zero-integral combinations are assembled.  We record why the physical
building-block proof is uniform over a fixed inventory and then perform
that assembly explicitly.

### 5.1 Same-side inclusive-minus-prime fold

For an ordered pure pair define

\[
 T_{tu}(y)=\int_0^\infty B_t(s)\overline{B_u(s+y)}\,ds. \tag{5.1}
\]

At \(y=\log q\), the exact radial identity

\[
 x_l(s+\log q)=x_{ql}(s)                               \tag{5.2}
\]

isolates the equality branch.  Its slow phase is
\((\nu_t-\nu_u)\beta\), bounded on the fixed inventory.  The separated
phase equation is

\[
 c(x_n-x_{ql})(x_nx_{ql}-1)+\nu_ux_n-\nu_tx_{ql}=0.   \tag{5.3}
\]

The final two terms are a uniformly bounded fixed-inventory perturbation
of the equality and reciprocal branches.  The dyadic split about
\(n=ql\), including the mandatory `s=0` boundary term, gives

\[
 |T_{tu}(\log q)|
 \leq {C_M(1+\log q)^2\over q^{3/2}},\qquad q\geq2.   \tag{5.4}
\]

The hard edge uses the exact \(J_0\) identity, and the endpoint row uses
the exact integer-dilation covariance

\[
 \int_0^1P(x)P(qx)\,dx={1\over12q}.                  \tag{5.5}
\]

Thus the complete same-side inclusive-minus-prime entry satisfies

\[
 \boxed{|Q_{\rm pr}^{\rm same}(B_t,B_u)|\leq C_M}    \tag{5.6}
\]

Indeed its exact Hermitian prefactor is
\(-2\Lambda(q)/\sqrt q\) on each of the two ordered orientations.
Multiplying (5.4) by that prefactor leaves the convergent majorant
\(C_M\Lambda(q)(1+\log q)^2/q^2\).

### 5.2 Reflected Stieltjes quadrature

Put \(g_t(s)=e^{s/2}B_t(s)\) and

\[
 C_{tu}(y)=(g_t*g_u)(y),\qquad y\geq0.                \tag{5.7}
\]

The exact Fejer profiles are locally BV.  After causal extension,
convolution turns their endpoint atoms into locally integrable terms, so

\[
 C_{tu}\in W^{1,1}_{\rm loc},\qquad C_{tu}(0)=0.      \tag{5.8}
\]

The geometry of the only quartically degenerate sum phase is independent
of the fixed labels:

\[
 (n,l)=(1,1),\quad y=\log2,\quad
 s={1\over2}\log2,\quad x_1(s)=1.                    \tag{5.9}
\]

The label terms in the phase are bounded smooth perturbations.  On the
quartic scale every derivative of those perturbations is lower order.
The cutoff-uniform envelope is consequently

\[
 \begin{aligned}
 |C_{tu}(y)|\leq C_M\bigg\{&
 {c^{-1/4}{\bf1}_{|y-\log2|\leq\eta}
       \over(1+c^{1/2}|y-\log2|)^{1/2}}
 +c^{-1/2}(1+y)e^{-y/4}\\
 &+c^{-1/4}{\bf1}_{0\leq y\leq C_Mc^{-1/2}}\bigg\}.
 \end{aligned}                                        \tag{5.10}
\]

Retain the continuous, prime, and logarithmic pieces in the one exact
quadrature

\[
 \begin{aligned}
 \mathcal M_{tu;A}={}&-\int_0^\infty C_{tu}(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
 C_{tu}\!\left(\log{n\over A}\right)\\
 &+A^{-3}\int_0^\infty
 {e^{-3y}C_{tu}(y)\over1-A^{-2}e^{-2y}}\,dy,
 \qquad A=\lambda^2.
 \end{aligned}                                        \tag{5.11}
\]

Lattice counting in the hard and quartic cores, dyadic differencing
outside them, and Chebyshev partial summation give

\[
 \mathcal M_{tu;A}=O_M(c^{-1/2}),\qquad
 \boxed{Q_{\rm refl}(B_t,B_u)=-2\lambda\mathcal M_{tu;A}=O_M(1).}
                                                               \tag{5.12}
\]

No sign is assigned to the separately split prime and continuous pieces.

### 5.3 Even pole and compact projection

The same exact Poisson-row subtraction, radial integration by parts, and
hard-edge Bessel identity give, for every pure physical-outer building row
in the fixed inventory,

\[
 \widehat O_t^{\rm pure}(i/2)=O_M(\lambda^{-1/2}).    \tag{5.13}
\]

Hence the locked positive rank-one even pole entry

\[
 P_+(O_t^{\rm pure},O_u^{\rm pure})
 =2\widehat O_t^{\rm pure}(i/2)
                 \overline{\widehat O_u^{\rm pure}(i/2)} \tag{5.14}
\]

is \(O_M(\lambda^{-1})\).

Now assemble the actual sources (2.2)--(2.3).  They have exact zero
integral.  Add the state-invisible bump from Section 2 to obtain zero
value at the origin, and only then form

\[
 K_t^{\rm act}=W_t^{\rm act}+R_t^{\rm act},\qquad
 R_t^{\rm act}=O_t^{\rm act}+P_t^{\rm act},\qquad
 X_t^{\rm act}=W_t^{\rm act}+P_t^{\rm act}.           \tag{5.15}
\]

After scalar whitening, each \(O_t^{\rm act}\) is the finite combination
of pure physical rows described in (2.6).  Thus (5.6), (5.12), and
(5.14) apply by bilinearity, with constants bounded on the fixed
inventory.  The actual source coefficient vectors also have one common
fixed-inventory bound.  The locked cutoff \(N=2^{2400p^2}\), the
defect-relative projection theorem, and the circular-variation estimate
therefore make every normalized actual central-projection term
\(o_M(1)\).  Both mixed orientations and their exact signs are retained:

\[
 \begin{aligned}
 \mathcal W_Z(O_t^{\rm act},P_u^{\rm act})
   &=-q_\lambda(X_t^{\rm act},P_u^{\rm act}),\\
 \mathcal W_Z(P_t^{\rm act},O_u^{\rm act})
   &=-q_\lambda(P_t^{\rm act},X_u^{\rm act}),\\
 \mathcal W_Z(P_t^{\rm act},P_u^{\rm act})
   &= q_\lambda(P_t^{\rm act},P_u^{\rm act}).
 \end{aligned}                                        \tag{5.16}
\]

Combining the actual assembled forms proves

\[
 \boxed{
 {\mathcal W_Z(R_t^{\rm act},R_u^{\rm act})\over\sqrt{D_tD_u}}
 -{Q_{\rm ar}^{\rm same}(O_t^{\rm act},O_u^{\rm act})
       \over\sqrt{D_tD_u}}
 =O_M(1)}                                              \tag{5.17}
\]

for all \(t,u\in\mathcal T_M\).  This is the complete finite-inventory
extension of the pinned non-Archimedean 4/12 ledger.

## 6. Assembly and the Toeplitz floor

Equations (4.8) and (5.17) give entrywise

\[
 {\mathcal W_Z(R_{4j},R_{4k})
  \over\sqrt{D_{4j}D_{4k}}\log c}
 \longrightarrow\Gamma_{j-k}.                        \tag{6.1}
\]

There are only \(M^2\) entries, so entrywise convergence is operator-norm
convergence.  This proves (0.7).

The function \(w\) is integrable and obeys

\[
 w(\beta)\geq{1\over2\pi},\qquad0\leq\beta\leq\pi/2, \tag{6.2}
\]

because the sample \(n=1\) is always present.  For
\(z=(z_1,\ldots,z_M)\in\mathbb C^M\), cosine polarization gives

\[
 \begin{aligned}
 z^*T_Mz={1\over2}\int_0^{\pi/2}w(\beta)
 \bigg(&\left|\sum_{j=1}^Mz_je^{i4j\beta}\right|^2\\
       &+\left|\sum_{j=1}^Mz_je^{-i4j\beta}\right|^2\bigg)d\beta.
 \end{aligned}                                        \tag{6.3}
\]

Both exponential families are orthogonal on \([0,\pi/2]\), and each
member has squared norm \(\pi/2\).  Therefore

\[
 z^*T_Mz\geq {1\over2}{1\over2\pi}
       \left(\pi\sum_{j=1}^M|z_j|^2\right)
 ={1\over4}\|z\|_2^2.                                \tag{6.4}
\]

This proves (0.8).  Combining it with the fixed-dimensional error in
(0.7) proves (0.9).

The average of the two squared moduli in (6.3) is essential for complex
coefficients.  Replacing it by only one of them would introduce sine
cross terms and would not equal the cosine Toeplitz quadratic form.

## 7. Anchor Schur complement and inverse-weighted row

Assume \(M\geq2\).  Partition the limiting matrix after its first
coordinate:

\[
 T_M=
 \begin{pmatrix}
 \Gamma_0&g_M^*\\
 g_M&T_{R,M}
 \end{pmatrix},\qquad
 g_M=(\Gamma_1,\ldots,\Gamma_{M-1})^T.                \tag{7.1}
\]

Since \(T_{R,M}\succeq I/4\), define

\[
 \tau_M=\Gamma_0-g_M^*T_{R,M}^{-1}g_M.                \tag{7.2}
\]

The variational formula for a scalar Schur complement and (0.8) give

\[
 \boxed{\tau_M\geq{1\over4}.}                        \tag{7.3}
\]

Indeed, the quadratic form at \((1,y)\), minimized in \(y\), is at
least \((1+\|y\|^2)/4\), hence at least \(1/4\).

Write the normalized complete matrix as

\[
 A_M=\Delta_M^{-1/2}H_M\Delta_M^{-1/2}
 =\begin{pmatrix}a_M&r_M^*\\r_M&C_M\end{pmatrix}.   \tag{7.4}
\]

Fixed-dimensional inversion of (0.7) yields

\[
 C_M^{-1}={1\over\log c}T_{R,M}^{-1}
          +o_M((\log c)^{-1}),                        \tag{7.5}
\]

\[
 \boxed{
 r_M^*C_M^{-1}r_M
 =\log c\,g_M^*T_{R,M}^{-1}g_M+o_M(\log c),}          \tag{7.6}
\]

and

\[
 \boxed{
 a_M-r_M^*C_M^{-1}r_M
 =\tau_M\log c+o_M(\log c)
 \geq {1\over8}\log c}                               \tag{7.7}
\]

eventually.  Thus the cross row is generally not small in the
inverse-weighted norm; its cost is of order \(\log c\).  The exact
Toeplitz correlation leaves a Schur reserve of at least the same universal
quarter appearing in (0.8).

In raw coordinates, let \(h_{R4}\) be the anchor-to-rest column of
\(H_M\), let \(H_{RR}\) be the rest block, and retain the scalar anchor
metric \(D_4\).  Equations (7.6)--(7.7) are equivalently

\[
 h_{R4}^*H_{RR}^{-1}h_{R4}
 =D_4\log c\,g_M^*T_{R,M}^{-1}g_M
       +o_M(D_4\log c),                               \tag{7.8}
\]

\[
 \boxed{
 H_{44}-h_{R4}^*H_{RR}^{-1}h_{R4}
 =D_4\tau_M\log c+o_M(D_4\log c).}                  \tag{7.9}
\]

### 7.1 Why the 4/12 cross is harmless here

The pinned generic theorem, with the 4/12 packages as its regression
anchor, gives

\[
 H_{12,4}=\sqrt{D_4D_{12}}\,\Gamma_2\log c
             +o(\sqrt{D_4D_{12}}\log c),             \tag{7.10}
\]

where \(\Gamma_2=\mathcal G_8>0\).  Its raw scale is
\(d_8\log c\), because
\(\sqrt{D_4D_{12}}/d_8\to\sqrt{14/99}\).  But the label-12 diagonal is

\[
 H_{12,12}=D_{12}\Gamma_0\log c+o(D_{12}\log c).     \tag{7.11}
\]

If label 12 were the only rest coordinate, its inverse-weighted cost
would be

\[
 { |H_{12,4}|^2\over H_{12,12}}
 =D_4\log c\,{\Gamma_2^2\over\Gamma_0}
    +o(D_4\log c),                                    \tag{7.12}
\]

not \(d_8\log c\) and not a loss of the full anchor diagonal.  For the
complete fixed rest, (7.3) supplies the exact joint conclusion.  Thus the
nonzero cross disproves the old sufficient row-smallness route while
remaining fully compatible with a positive fixed-prefix arithmetic
matrix.

This Schur statement concerns \(H_M\), the complete arithmetic remainder
matrix.  It does not replace the Rayleigh-shifted block whose anchor
diagonal is arranged to be zero, and it does not prove that the physical
residual vector in that separate reduction is small.

## 8. The first growing-prefix gate

Nothing in Sections 3--5 is uniform in \(M\).  The error constants contain
fixed-label Jost and Volterra constants, endpoint matching constants,
finite-inventory phase subdivisions, and finite-inventory projection
coefficient bounds.  Entrywise convergence for each fixed pair does not
imply operator convergence when \(M\asymp\log c\).

A direct moving-label extension of this proof would first require the
matrix physical-profile estimate

\[
 \sup_{M\leq C\log c}
 \left\|2(\langle\widetilde B_{4j},
       \widetilde B_{4k}\rangle)_{j,k=1}^M-T_M\right\|=o(1),             \tag{8.1}
\]

together with a matrix centered-multiplier estimate and the complete
remainder estimate

\[
 \sup_{M\leq C\log c}{1\over\log c}
 \left\|\bigl(2\langle(a(D)-\log c)\widetilde B_{4j},
             \widetilde B_{4k}\rangle\bigr)_{j,k=1}^M\right\|=o(1),    \tag{8.2}
\]

\[
 \boxed{
 \sup_{M\leq C\log c}{1\over\log c}
 \left\|\Delta_M^{-1/2}
  (H_M-Q_{{\rm ar},M}^{\rm same})
 \Delta_M^{-1/2}\right\|=o(1).}                     \tag{8.3}
\]

Uniform relative metric equivalence must also accompany these estimates.
No frozen fixed-label theorem proves (8.1)--(8.3).

The strict-PASS fixed-to-growing operator-norm gate makes the remaining
logic exact.  There is a stronger existing starting point for the growing problem: the
frozen equality-conductor Garding theorem already gives an
\(L/4-(\log L)/4-O(1)\) lower bound for its growing equality subsystem.
Relative to that theorem, the earliest genuinely new estimate is the
cancellation-preserving negative-part control

\[
 \left\|(E_M)_-\right\|
 <{L\over4}-{1\over4}\log L-C_{\rm eq},              \tag{8.4}
\]

where \(E_M\) is the defect-white complete complement to that equality
subsystem and \(C_{\rm eq}\) is the absolute constant in the frozen
equality-conductor lower bound.  A strict positive margin in (8.4) gives
the desired growing floor.  The stronger condition
\(\|E_M\|=o(\log c)\), as in (8.3), is sufficient.  Here (8.3) is read
with `Q_ar^same` replaced by that exact equality subsystem.  It must cover in
one compatible ledger the unequal-sample and non-equality prime terms,
reflected tail, beta row where present, pole, and projection terms.  A
collection of fixed-pair `O(1)` bounds is insufficient: even a uniform
entrywise bound \(r(c)\) may have operator norm \(M r(c)\).  At
\(M\asymp\log c\), the elementary row-sum route therefore needs
\(r(c)=o(1)\); an entrywise `O(1)` bound can cost the full size of the
Toeplitz floor.

Therefore (0.8) supplies a dimension-free limiting symbol floor, but it
does not supply the uniform approximation needed to use that floor on a
growing prefix.  No growing uniformity or RH conclusion is claimed.
