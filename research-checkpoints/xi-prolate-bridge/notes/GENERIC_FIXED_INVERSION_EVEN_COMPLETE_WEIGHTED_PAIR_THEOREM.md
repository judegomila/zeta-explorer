# Generic fixed inversion-even complete weighted pair theorem

## 0. Exact result and quantifiers

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A.          \tag{0.1}
\]

Fix two prolate labels

\[
 s,t\in4\mathbb Z_{\geq0}.                              \tag{0.2}
\]

Let \(B_j\) be the complete one-tail physical profile of the pure
scalar-defect-white label \(j\), with the Fejer, hard-edge, and Volterra
conventions of the frozen 4/12 packages.  Let \(O_j\) be the two-sided
physical outer building block formed from \(B_j\), again after division by
\(\sqrt{d_j}\).  A pure \(h_{j,\lambda}/\sqrt{d_j}\) row is not generally
zero-integral and is not, by itself, an eligible corrected global radical.
Accordingly no pure \(R_j\), compact projection, or complete
\(\mathcal W_Z\) assertion is made below.  Define

\[
 \boxed{
 G_k={1\over2\pi}\sum_{m\geq1}{1\over m}
       \int_0^{\arcsin(1/m)}\cos(k\beta)\,d\beta,
 \qquad k\in4\mathbb Z.}                               \tag{0.3}
\]

The series is absolutely convergent and \(G_{-k}=G_k\).  This note proves

\[
 \boxed{2\langle B_t,B_s\rangle\longrightarrow G_{t-s},} \tag{0.4}
\]

\[
 \boxed{
 2\int_{\mathbb R}\{a(\xi)-\log c\}
       \widehat B_t(\xi)\overline{\widehat B_s(\xi)}
       {d\xi\over2\pi}=O_{s,t}(1),}                    \tag{0.5}
\]

where

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}
                    +{i\xi\over2}\right)-\log\pi,      \tag{0.6}
\]

and hence

\[
 \boxed{
 2\int_{\mathbb R}a(\xi)
       \widehat B_t(\xi)\overline{\widehat B_s(\xi)}
       {d\xi\over2\pi}
 =G_{t-s}\log c+o_{s,t}(\log c).}                      \tag{0.7}
\]

For the same pair, the three non-Archimedean physical building-block
estimates are

\[
 \boxed{
 \begin{aligned}
 |Q_{\rm pr}^{\rm same}(O_t,O_s)|&=O_{s,t}(1),\\
 |Q_{\rm refl}(O_t,O_s)|&=O_{s,t}(1),\\
 |P_+(O_t,O_s)|&=O_{s,t}(\lambda^{-1}).
 \end{aligned}}                                        \tag{0.8}
\]

For the complete statement restrict now to the eligible actual labels

\[
 \mathcal E_{\rm act}=\{4,8,12,\ldots\}.                \tag{0.9}
\]

For \(j=4\), use the actual zero-integral anchor; for \(j\geq8\), use the
actual anchor-deflated zero-integral column.  Add the state-invisible
origin correction before invoking global radicality.  Let
\(R_j^{\rm act}\) be the resulting raw radical remainder and let \(D_j\)
be its exact scalar exterior defect.  For fixed
\(s,t\in\mathcal E_{\rm act}\), the complete conclusion is

\[
 \boxed{
 {\mathcal W_Z(R_t^{\rm act},R_s^{\rm act})
       \over\sqrt{D_tD_s}}
 =G_{t-s}\log c+o_{s,t}(\log c).}                     \tag{0.10}
\]

The corresponding normalized actual-column versions of (0.4), (0.5),
and (0.8) also hold.  The ground and anchor components do not change
\(G_{t-s}\).  There is no actual-column assertion for label zero.

All constants and all eventual thresholds may depend on the fixed pair.
The proof is simultaneous on any prescribed finite label set after taking
the maximum of finitely many constants.  It proves no estimate uniform in
a growing label or a growing prefix.  It does not promote (0.7) to an
\(O(1)\) remainder, prove a growing Schur floor, determinant limit,
positivity of the complete Weil form, equation (5.2) of
DIRECT_RH_ATTACK.md, or the Riemann hypothesis.  The formal state remains
P0_INVALIDATED.

## 1. Frozen inputs

The generic argument below pins the two strict-PASS 4/12 component
packages, including their regression bytes.

| Dependency | SHA-256 |
|---|---|
| notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md | efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca |
| tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py | 12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1 |
| notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md | b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e |
| tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py | 9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe |
| notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md | fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c |
| notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md | 1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4 |
| notes/PROLATE_DEFECT_SOURCE_AUDIT.md | b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d |
| notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md | 76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc |
| notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md | 3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f |
| notes/COMPACT_PROJECTION_WEIL_BOUND.md | 61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93 |
| notes/OUTER_PROJECTION_RADICAL_REDUCTION.md | 3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd |

The 4/12 proofs are not invoked by replacing their displayed labels.
The sections below identify every point at which a label enters and show
that it changes only a constant when (0.2) is fixed.

## 2. Pure fixed-label physical cross

Put

\[
 d_j=1-\chi_j^2,\qquad z_j={h_{j,\lambda}\over\sqrt{d_j}},
 \qquad
 \nu_j={\Theta_j\over2c}={2j+1\over2}+O_j(c^{-1}).     \tag{2.1}
\]

On the Jost range define

\[
 x_m(u)=\sqrt{m^2e^{2u}-1},\qquad
 \beta(x)=\arctan(1/x),                                \tag{2.2}
\]

\[
 \Phi_{j,m}(u)=cx_m(u)+\nu_j\beta(x_m(u)).             \tag{2.3}
\]

The complete finite Fejer row has leading part

\[
 B_j^0(u)=\sum_{m\geq1}b_m(u)\sin\Phi_{j,m}(u),
 \qquad
 b_m(u)={1+O_j((cx_m)^{-1})\over
                 \sqrt{2\pi m x_m(u)}}.               \tag{2.4}
\]

The endpoint normalization multiplying (2.4) tends to one.  All labels in
(0.2) have the same outgoing endpoint sign.  The differentiated Volterra
symbol in (2.4) has an extra factor \(c^{-1}\), and the exact regular
Bessel row is used where the \(m=1\) Jost amplitude is singular.

For a common sample \(m\), the slow part of
\(2B_t^0\overline{B_s^0}\) is

\[
 \cos\{(\nu_t-\nu_s)\beta(x_m)\}
 \longrightarrow\cos\{(t-s)\beta(x_m)\}.              \tag{2.5}
\]

Since

\[
 du={x\,dx\over1+x^2},\qquad
 b_m(u)^2du\longrightarrow{dx\over2\pi m(1+x^2)},     \tag{2.6}
\]

the common-sample contribution tends to

\[
 {1\over2\pi m}
 \int_{\sqrt{m^2-1}}^\infty
 {\cos\{(t-s)\arctan(1/x)\}\over1+x^2}\,dx
 ={1\over2\pi m}
 \int_0^{\arcsin(1/m)}\cos\{(t-s)\beta\}\,d\beta.
                                                               \tag{2.7}
\]

Its absolute value is at most
\(\arcsin(1/m)/(2\pi m)=O(m^{-2})\).  Thus the diagonal
sample series is absolutely convergent.

For unequal samples \(m,l\geq2\), on a unit interval \(u\asymp r\), the
difference phase derivative is bounded below by

\[
 \kappa_{s,t}ce^r|m-l|                                \tag{2.8}
\]

after splitting into a fixed number of monotonicity intervals; the sum
phase has \(m+l\) in place of \(|m-l|\).  One BV integration and the bounds

\[
 \|\chi_rb_m\|_\infty+\operatorname {Var}(\chi_rb_m)
 \leq {K_{s,t}e^{-r/2}\over m}                         \tag{2.9}
\]

give an absolutely summable majorant after dyadic summation in
\(|m-l|\).  This argument is first made at finite Fejer cutoff; all Fejer
weights lie in \([0,1]\), so the majorant is cutoff independent.  If
exactly one sample equals one, the difference phase can have the isolated
reciprocal stationary point \(x_mx_l=1+O_{s,t}(c^{-1})\).  Its curvature
is nonzero and ordinary stationary phase gives a cutoff-uniform
\(O_{s,t}(c^{-1/2})\) row; away from it the first-derivative estimate
applies.  The \(m=1\) row is also split at the hard/Jost interface.  On
the regular part, \((xJ_1(cx))'=cxJ_0(cx)\) supplies the same vanishing
limit.  The Volterra rows are smaller by \(c^{-1}\).

It follows that only (2.7) survives, proving (0.4).  This also handles the
diagonal without a limiting argument in the label difference:

\[
 G_0={1\over2\pi}\sum_{m\geq1}{\arcsin(1/m)\over m}>0. \tag{2.10}
\]

There is no exceptional common-sample resonance when \(s=t\); it is
exactly the positive diagonal in (2.10).

## 3. Cutoff-uniform logarithmic moment

Zero extend each one-tail profile to the negative half-line and set
\(\delta=1/8\).  For every fixed label \(j\), the proof of the weighted
4/12 package depends on \(j\) only through the bounded number \(\nu_j\)
and fixed Volterra-symbol constants.  It therefore gives

\[
 \boxed{
 \sup_c\int_{\mathbb R}
 \left(1+{|\xi|\over c}\right)^{1/4}
 |\widehat B_j(\xi)|^2{d\xi\over2\pi}<\infty.}         \tag{3.1}
\]

More explicitly, the \(m\geq2\) rows use (2.8)--(2.9) and the convergent
majorants

\[
 \sum_{m\geq2}m^{-2+2\delta}<\infty,
 \qquad
 \sum_{m\geq2}m^{-2+2\delta}(1+\log m)<\infty.         \tag{3.2}
\]

For \(m=1\), radial dyadic intervals give

\[
 c^{-2\delta}\|B_{j,1}^{\rm Jost}\|_{H^\delta}^2
 \leq K_j\int_0^\infty
 {(x+x^{-1})^{2\delta}\over1+x^2}\,dx<\infty.         \tag{3.3}
\]

The exact hard core \(cx<1\) has size \(O_j(c^{1/2})\) on an interval of
length \(O(c^{-2})\), hence contributes
\(O_j(c^{-1+4\delta})\).  Finally, the conditional endpoint row

\[
 F_A(u)={\bf1}_{u\geq0}e^{-u/2}P(Ae^u),
 \qquad P(x)={1\over2}-\{x\},                           \tag{3.4}
\]

satisfies the exact cutoff-uniform translation estimate

\[
 \|F_A(\cdot+h)-F_A\|_2^2
 \leq K\min\left\{1,
 Ah\left(1+\log_+{1\over Ah}\right)\right\}.          \tag{3.5}
\]

The logarithm is the harmonic sum over crossed sawtooth jumps.  Its
Gagliardo integral is finite for every \(\delta<1/2\), with scale
\(A^{2\delta}\asymp c^{2\delta}\).  Weak compactness, local \(L^1\)
identification by the complete Poisson row, and lower semicontinuity pass
the finite-Fejer estimate to the exact profile.  This proves (3.1) without
differentiating a Bernoulli remainder term by term.

The same phase separation gives

\[
 \sup_{|\xi|\leq c/2}|\widehat B_j(\xi)|\leq {K_j\over c},
 \qquad
 \int_{|\xi|\leq c/2}|\widehat B_j(\xi)|^2
       {d\xi\over2\pi}=O_j(c^{-1}).                    \tag{3.6}
\]

The digamma bounds are

\[
 \begin{aligned}
 |a(\xi)-\log c|&\leq K\log c,
       &&|\xi|\leq c/2,\\
 |a(\xi)-\log c|&\leq K+\log^+(|\xi|/c),
       &&|\xi|\geq c/2.
 \end{aligned}                                         \tag{3.7}
\]

Use (3.6) on the first region and
\(\log^+x\leq x^\delta/\delta\), (3.1), and weighted
Cauchy--Schwarz on the second.  This proves (0.5).  Plancherel gives

\[
 2\int a\,\widehat B_t\overline{\widehat B_s}
        {d\xi\over2\pi}
 =2\log c\,\langle B_t,B_s\rangle+O_{s,t}(1).          \tag{3.8}
\]

Equations (0.4) and (3.8) prove (0.7).  Only qualitative endpoint
normalization is frozen, so (0.4) has no admitted \(O(1/\log c)\) rate;
this is why the remainder in (0.7) is exactly \(o(\log c)\).

## 4. Same-side inclusive-minus-prime fold

For an ordered pure pair put

\[
 T_{ts}(y)=\int_0^\infty B_t(u)\overline{B_s(u+y)}\,du. \tag{4.1}
\]

At \(y=\log n\),

\[
 x_l(u+\log n)=x_{nl}(u).                               \tag{4.2}
\]

The common-sample branch \(m=nl\) has slow phase
\((\nu_t-\nu_s)\beta\).  Its absolute contribution is bounded by

\[
 {1\over2\pi l\sqrt n}
 \int_{\sqrt{n^2l^2-1}}^\infty{dx\over1+x^2}
 \leq {1\over\pi\sqrt3\,n^{3/2}l^2}.                 \tag{4.3}
\]

For \(m\ne nl\), equality of difference-phase speeds is

\[
 c(x_m-x_{nl})(x_mx_{nl}-1)+\nu_sx_m-\nu_tx_{nl}=0.   \tag{4.4}
\]

The last two terms are a fixed bounded perturbation.  The equality branch
has already been removed.  The reciprocal branch forces \(m=1\) for all
sufficiently large \(c\), and its curvature is comparable to
\(c(nl)^3\).  Splitting below, near, and above \(nl\), followed by dyadic
summation in \(|m-nl|\), gives

\[
 |T_{ts}(\log n)|
 \leq {K_{s,t}(1+\log n)^2\over n^{3/2}},\qquad n\geq2. \tag{4.5}
\]

The \(m=1\) hard edge uses the regular Bessel identity from Section 2.
The sole conditional endpoint row is removed before this estimate and
restored using

\[
 \int_0^1P(x)P(nx)\,dx={1\over12n}.                    \tag{4.6}
\]

Thus both same-side orientations in the exact inclusive prime fold obey

\[
 |Q_{\rm pr}^{\rm same}(O_t,O_s)|
 \leq K_{s,t}\sum_{n\geq2}
 {\Lambda(n)(1+\log n)^2\over n^2}<\infty.             \tag{4.7}
\]

Nothing changes when \(s=t\): the equality row (4.3) is then
nonoscillatory but absolutely summable.  No sign is assigned to the prime
fold.

## 5. Reflected caustic and its only degeneracy

Let \(g_j(u)=e^{u/2}B_j(u)\) and

\[
 C_{ts}(y)=(g_t*g_s)(y),\qquad y\geq0.                 \tag{5.1}
\]

The zero extensions are locally BV and their endpoint atoms convolve with
locally integrable functions.  Hence

\[
 C_{ts}\in W^{1,1}_{\rm loc},\qquad C_{ts}(0)=0.       \tag{5.2}
\]

The leading radial speed is \(c(x+x^{-1})\).  Equality of the two
sum-phase speeds has the geometric branches \(x_1=x_2\) and \(x_1x_2=1\).
Their curvatures can vanish together only at

\[
 (m,l,y,u)=(1,1,\log2,{1\over2}\log2).                 \tag{5.3}
\]

Writing \(y=\log2+\eta\) and \(u=y/2+z\),

\[
 x_1(y/2+z)+x_1(y/2-z)
 =X_0(\eta)+4\eta z^2-4z^4
 +O(\eta^2z^2+|\eta|z^4+z^6).                         \tag{5.4}
\]

This is the only quartic degeneracy for every fixed pair.  If \(s\ne t\),
the fixed phase-index perturbation contains an odd linear term in \(z\),
but on \(z=c^{-1/4}v\) it is lower order.  If \(s=t\), that odd term
vanishes; the quartic term in (5.4) remains and no higher degeneracy is
created.

The center phase is

\[
 \vartheta_{s,t}=2c+(\nu_s+\nu_t){\pi\over4}
 ={s+t+5\over4}\pi+O_{s,t}(c^{-1})\pmod {2\pi}.       \tag{5.5}
\]

Since \(s+t\) is divisible by four, direct quartic stationary phase gives

\[
 \boxed{
 C_{ts}(\log2)=(-1)^{(s+t)/4}
 {\Gamma(1/4)\cos(\pi/8)\over8\pi}c^{-1/4}
 +o_{s,t}(c^{-1/4}).}                                  \tag{5.6}
\]

Thus the leading local caustic coefficient never vanishes on the family
(0.2).  Its sign depends on \(s+t\), not on the Toeplitz difference
\(t-s\).  This sign is not used in the complete reflected estimate.

Quartic van der Corput near (5.3), second-derivative bounds elsewhere, and
the exact hard row give, for fixed small \(\eta_0>0\),

\[
 \begin{aligned}
 |C_{ts}(y)|\leq K_{s,t}\bigg\{&
 {c^{-1/4}{\bf1}_{|y-\log2|\leq\eta_0}
       \over(1+c^{1/2}|y-\log2|)^{1/2}}\\
 &+c^{-1/2}(1+y)e^{-y/4}
 +c^{-1/4}{\bf1}_{0\leq y\leq K_{s,t}c^{-1/2}}
 \bigg\}.
 \end{aligned}                                         \tag{5.7}
\]

The exact already-combined Stieltjes scalar is

\[
 \begin{aligned}
 \mathcal M_{ts;A}={}&-\int_0^\infty C_{ts}(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
 C_{ts}\!\left(\log{n\over A}\right)\\
 &+A^{-3}\int_0^\infty
 {e^{-3y}C_{ts}(y)\over1-A^{-2}e^{-2y}}\,dy .
 \end{aligned}                                         \tag{5.8}
\]

The possible inclusive endpoint atom is multiplied by (5.2).  The
quartic core in (5.7) has continuous mass \(O(c^{-1/2})\); the hard core
has mass \(O(c^{-3/4})\).  Lattice counting in the cores, elementary
\(\Lambda(n)\leq\log n\) shells below the frozen FKS scale, FKS
differencing above it, and Chebyshev partial summation for the regular
term yield

\[
 \mathcal M_{ts;A}=O_{s,t}(c^{-1/2}).                   \tag{5.9}
\]

The locked sign and scale are

\[
 Q_{\rm refl}(O_t,O_s)=-2\lambda\mathcal M_{ts;A}
 =O_{s,t}(1).                                          \tag{5.10}
\]

The cancellation in (5.8) is taken before absolute values; no separate
sign is assigned to its continuous and prime pieces.

## 6. Pole, actual deflations, and compact projection

For a pure normalized row,

\[
 \widehat O_j(i/2)=\sqrt\lambda\int_0^\infty g_j(u)\,du
 +\lambda^{-1/2}\int_0^\infty e^{-u/2}B_j(u)\,du.     \tag{6.1}
\]

The centered periodic primitive gives \(O(A^{-1})\) for the conditional
endpoint row.  For each complete Jost sample, substitution to \(x\) gives

\[
 {d\Phi_{j,m}\over dx}=c-{\nu_j\over1+x^2}\geq c/2   \tag{6.2}
\]

eventually.  One integration by parts gives \(K_j/(cm^2)\); the regular
\(m=1\) row and Volterra remainder obey the same total \(O_j(c^{-1})\)
bound.  Therefore

\[
 \int_0^\infty g_j(u)\,du=O_j(c^{-1}),\qquad
 \widehat O_j(i/2)=O_j(\lambda^{-1/2}),                \tag{6.3}
\]

and the positive rank-one even pole satisfies

\[
 P_+(O_t,O_s)=2\widehat O_t(i/2)
                 \overline{\widehat O_s(i/2)}
 =O_{s,t}(\lambda^{-1}).                               \tag{6.4}
\]

Now restore the actual columns.  The zero-integral anchor is

\[
 u_4=q_4=h_{4,\lambda}+\rho_4h_{0,\lambda},            \tag{6.5}
\]

and for a fixed \(j\geq8\) the actual anchor-deflated source is

\[
 u_j=q_j-\alpha_jq_4
 =h_{j,\lambda}-\alpha_jh_{4,\lambda}+b_jh_{0,\lambda},
 \qquad \alpha_j,b_j=O_j(1).                           \tag{6.6}
\]

Its exact scalar exterior defect is

\[
 D_4=d_4+|\rho_4|^2d_0,\qquad
 D_j=d_j+|\alpha_j|^2d_4+|b_j|^2d_0.                  \tag{6.7}
\]

For fixed \(r<j\),

\[
 {d_r\over d_j}\sim {j!\over r!}(16\pi)^{r-j}
 \lambda^{-2(j-r)}.                                   \tag{6.8}
\]

Thus \(D_j/d_j\to1\), and after scalar-defect whitening every lower-label
coefficient in (6.5)--(6.6) is
\(O_j(\lambda^{-(j-r)})\).  The leading pure-label coefficient tends to
one.  Both (6.5) and (6.6) have exact zero integral; in (6.6) this follows
from \(u_j=q_j-\alpha_jq_4\), with
\(b_j=\rho_j-\alpha_j\rho_4\).

Equations (0.4), (0.5), and (0.8) are bilinear physical-profile
statements, and their constants are bounded on the finite lower-label
inventory.  Lower coefficients times \(\log c\) still tend to zero.
Thus these pure building-block estimates assemble to their normalized
actual-column counterparts before any radical or projection assertion is
used.

Next add the state-invisible origin bump required by the global radical
identity.  It has raw coefficient \(O(D_j)\).  After division of the
column by \(\sqrt{D_j}\), its coefficient is
\(O(\sqrt{D_j})=o_j(c^{-M})\) for every fixed \(M\).  Its sampled profile
is Schwartz, it preserves all endpoint jets, and its central arithmetic
state is exactly zero.  Every bump-involving physical or kernel estimate
costs at most a fixed polynomial in \(c\).  Therefore its normalized
physical, logarithmically weighted, prime, reflected, pole, and projection
crosses are \(o_j(1)\), not merely \(O_j(1)\).

Only at this point is the corrected actual source eligible for polarized
global radicality.  Write

\[
 K_j^{\rm act}=W_j^{\rm act}+R_j^{\rm act},\qquad
 R_j^{\rm act}=O_j^{\rm act}+P_j^{\rm act},\qquad
 X_j^{\rm act}=W_j^{\rm act}+P_j^{\rm act},            \tag{6.9}
\]

and put a tilde over any actual object after division by \(\sqrt{D_j}\).
No decomposition (6.9) is asserted for a pure \(h_j/\sqrt{d_j}\) row.

Finally use the locked compact cutoff

\[
 N=2^{2400p^2}.                                       \tag{6.10}
\]

For a fixed corrected actual white column, the central \(L^1\) and
circular variation bounds are a polynomial in \(\lambda,L\) times
\(D_j^{-1/2}\) and fixed coefficient constants.  The compact Cauchy
projection theorem therefore bounds every \(P\)--\(P\), \(P\)--\(W\),
and \(W\)--\(P\) entry by

\[
 {\operatorname {poly}_{s,t}(\lambda,L,\log N)
       \over N\sqrt{D_sD_t}}=o_{s,t}(1),               \tag{6.11}
\]

because \(D_j\sim d_j\) and \(d_j^{-1/2}\) has exponential scale \(e^c\),
whereas the exponent in \(N\) is much larger than \(2c\).  Polarized
radicality for the corrected actual columns retains both mixed
orientations and the exact signs

\[
 \begin{aligned}
 \mathcal W_Z(\widetilde O_t^{\rm act},
              \widetilde P_s^{\rm act})
   &=-q_\lambda(\widetilde X_t^{\rm act},
                \widetilde P_s^{\rm act}),\\
 \mathcal W_Z(\widetilde P_t^{\rm act},
              \widetilde O_s^{\rm act})
   &=-q_\lambda(\widetilde P_t^{\rm act},
                \widetilde X_s^{\rm act}),\\
 \mathcal W_Z(\widetilde P_t^{\rm act},
              \widetilde P_s^{\rm act})
   &= q_\lambda(\widetilde P_t^{\rm act},
                \widetilde P_s^{\rm act}).
 \end{aligned}                                         \tag{6.12}
\]

Equations (6.11)--(6.12) give

\[
 \mathcal W_Z(\widetilde R_t^{\rm act},
              \widetilde R_s^{\rm act})
 =\mathcal W_Z(\widetilde O_t^{\rm act},
               \widetilde O_s^{\rm act})+o_{s,t}(1).  \tag{6.13}
\]

Combining (0.7)--(0.8) for the assembled actual outer profiles with
(6.13) proves (0.10).

## 7. Finite-set Toeplitz corollary and the uniformity boundary

Put

\[
 w(\beta)={1\over2\pi}
 \sum_{m\leq\csc\beta}{1\over m},\qquad
 0<\beta\leq{\pi\over2}.                               \tag{7.1}
\]

Tonelli applied to (0.3) gives

\[
 G_k=\int_0^{\pi/2}w(\beta)\cos(k\beta)\,d\beta.       \tag{7.2}
\]

For the fixed labels \(4,8,\ldots,4m\), let
\(T_m=(G_{4(q-r)})_{r,q=1}^m\).  For complex coefficients the exact
quadratic representation is the symmetrized one

\[
 \begin{aligned}
 a^*T_ma={1\over2}\int_0^{\pi/2}w(\beta)
 \bigg(&\left|\sum_{r=1}^ma_re^{i4r\beta}\right|^2\\
       &+\left|\sum_{r=1}^ma_re^{-i4r\beta}\right|^2\bigg)d\beta.
 \end{aligned}                                         \tag{7.3}
\]

The unsymmetrized formula is valid for real coefficients but is not the
correct complex Hermitian identity.  Since the \(m=1\) term gives
\(w\geq1/(2\pi)\), orthogonality on \([0,\pi/2]\) yields

\[
 \boxed{T_m\succeq{1\over4}I_m}                        \tag{7.4}
\]

for every finite \(m\), with a dimension-free algebraic constant.  For
each fixed \(m\), equation (0.10) holds simultaneously for the eligible
actual columns, so their complete scalar-white signed matrix is

\[
 \log c\,T_m+o_m(\log c)                               \tag{7.5}
\]

in operator norm.

What is not uniform is the analytic error in (7.5).  The proof requires:

- fixed-index endpoint and Jost normalization;
- label-dependent Volterra and BV symbol constants in (2.9) and (3.1);
- an eventual monotonicity threshold for
  \(x+(1-\nu_j/c)/x\);
- fixed-label constants in the stationary and caustic partitions;
- bounded anchor-deflation coefficients on a prescribed finite prefix;
  and
- a fixed-label compact-projection polynomial.

No frozen input controls these quantities simultaneously when
\(m=m(c)\) grows, even for \(m\asymp\log c\).  Thus (7.4) is uniform as an
exact limiting Toeplitz fact, while convergence to that limit is only
fixed-prefix.  The earliest remaining obstruction is a quantitative
label-uniform version of Sections 2--6; it is not a new fixed-pair
stationary or caustic counterexample.
