# Unbounded relative-orientation instability

## 0. Scope and exact outcome

This note sharpens the odd-orientation obstruction in
`notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md` in three
directions.

1. The slack in the strict anti-aligned-leakage contraction is exactly a
   generalized signed floor.  It is not controlled by an absolute error.
2. The finite source-Cauchy twin from that note extends to every dimension
   with the same two-vector Ritz shift, a positive complete even complement,
   a positive complete odd transverse block, and opposite live odd Schur
   signs.  The family can be scaled so that both matrices and their common
   positive absolute Gram tend to zero faster than exponentially in the
   dimension without changing either sign.
3. On every unbounded logarithmic interval schedule, an arbitrarily small
   change of one right-continuous discrepancy step at `h=log 2` flips a
   complete odd sign.  The step has the genuine zero-extension translation
   geometry and the source minus-prime orientation.  Its coefficient is not
   the source coefficient `Lambda(2)/sqrt(2)`, and the rest of the arithmetic
   discrepancy is not reproduced.  This third construction is therefore a
   relative-sensitivity model, not an alternative arithmetic Weil matrix.

The all-dimensional Cauchy family preserves the source displacement algebra,
but its diagonal and off-diagonal parameters are synthetic and are not the
entries assembled from the pinned pole, archimedean, and prime-power
formulas.  These constructions prove non-implications for structural,
absolute-size, and magnitude-only discrepancy arguments.  They do not
invalidate the possibility of a source-specific estimate using the exact
prime locations and coefficients.

No nontrivial zero is assumed real, no zero table is used, and no global Weil
positivity is invoked.  No actual unbounded arithmetic sector bound, weighted
estimate in equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant limit, or RH
conclusion is proved.  The formal project state remains `P0_INVALIDATED`.

Whenever the actual source matrix is discussed, the prime block retains the
minus sign in source equation (3.19), the interval is
`[-log(lambda),log(lambda)]` with Lebesgue measure and zero extension, and a
prime power at `lambda^2` is included.  The synthetic models below do not
replace that locked inventory.

## 1. The contraction slack is the relative signed floor

Let `A=A*` be a positive absolute leakage Gram, let `S=S*` be the signed
leakage Gram, and put

\[
 E=A-S\succeq0.                                           \tag{1.1}
\]

Fix a real shift `U` and assume

\[
 C=A-UI\succ0.                                            \tag{1.2}
\]

The shifted signed form is

\[
 B=S-UI=C-E.                                              \tag{1.3}
\]

### Lemma 1.1 (exact relative slack)

With

\[
 R=C^{-1/2}EC^{-1/2}\succeq0,
 \qquad \rho=\|R\|,
\]

one has the exact identity

\[
 \boxed{
  1-\rho
  =\lambda_{\min}\!\left(
      C^{-1/2}(S-UI)C^{-1/2}
    \right).}                                           \tag{1.4}
\]

Consequently

\[
 S-UI\succ0\quad\Longleftrightarrow\quad\rho<1.        \tag{1.5}
\]

**Proof.**  Congruencing (1.3) by `C^(-1/2)` gives

\[
 C^{-1/2}BC^{-1/2}=I-R.
\]

The least eigenvalue of `I-R` is one minus the largest eigenvalue of the
positive matrix `R`, which is `1-rho`.  This proves both statements.  \(\square\)

Identity (1.4) supplies the scale missing from an absolute estimate.  If the
generalized signed floor tends to zero, an estimate such as
`||E-E_0||=o(1)` is irrelevant unless its error is small relative to that
floor in the `C` metric.  The equality also shows why the strict inequality
is saturated on the even Ritz null direction in the checkpoint-0.55 note.

## 2. An all-dimensional source-Cauchy orientation twin

Fix `N>=2` and use the complex modes indexed by `-N,...,N`.  Put

\[
 b_0=0,
 \qquad
 b_n=-{9n\over5n^2-2}\quad(n\ne0).                    \tag{2.1}
\]

Thus `b_(-n)=-b_n`, `b_1=-3`, and `b_2=-1`.  Define

\[
 M_N=50000N                                             \tag{2.2}
\]

and the two diagonal sequences

\[
 a_0=14,\qquad a_1=a_{-1}=13,
\]

\[
 a_2=a_{-2}=
 \begin{cases}
  33/4,&\text{pass member},\\
  8,&\text{fail member},
 \end{cases}
 \qquad
 a_n=M_N\quad(3\leq|n|\leq N).                       \tag{2.3}
\]

Reconstruct the complete matrices by

\[
 Q_{nn}=a_n,
 \qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m).             \tag{2.4}
\]

Every entry is rational.  Both matrices are real symmetric, commute with
inversion, and have the same exact source-Cauchy displacement

\[
 [M,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.                    \tag{2.5}
\]

Changing `a_2` changes only a diagonal parameter and hence does not change
(2.5).

### 2.1 Exact persistence of the live Ritz pencil

In the normalized even basis put

\[
 \kappa={2\sqrt2\,e_0+3e_1^+\over\sqrt{17}}.          \tag{2.6}
\]

For every `m>=2`, its coupling to `e_m^+` is proportional to

\[
 {4b_m\over m}
 +{6(mb_m-b_1)\over m^2-1}.                            \tag{2.7}
\]

Substitution of (2.1) and `b_1=-3` gives

\[
 b_m(10m^2-4)-6mb_1=0,                                \tag{2.8}
\]

so (2.7) vanishes identically.  Therefore `Q kappa` is supported on
`span(e_0,e_1^+)` for every `N`, in both members.  The first two Krylov
vectors and all moments entering their generalized Ritz pencil are exactly
the checkpoint-0.55 ones.  Its determinant remains

\[
 \det(H_2-zG_2)={882\over289}(z^2-24z+122),            \tag{2.9}
\]

and its lower value is

\[
 \boxed{U=12-\sqrt{22}.}                               \tag{2.10}
\]

This is a source-reconstructed two-vector Ritz value, not a stored
eigenvalue.

### 2.2 Uniform low-block margins

The even direction in `span(e_0,e_1^+)` orthogonal to `kappa` is

\[
 w={-3e_0+2\sqrt2\,e_1^+\over\sqrt{17}}.              \tag{2.11}
\]

On `span(w,e_2^+)`, the shifted even low blocks are

\[
 A^{(a_2)}-UI=
 \begin{pmatrix}
  74/17+\sqrt{22}&\sqrt{34}/6\\
  \sqrt{34}/6&a_2-25/2+\sqrt{22}
 \end{pmatrix}.                                       \tag{2.12}
\]

For `a_2=33/4` and `a_2=8`, respectively, their determinants are

\[
 {23\over9}+{7\sqrt{22}\over68},
 \qquad
 {449\over306}-{5\sqrt{22}\over34}.                 \tag{2.13}
\]

Both matrices satisfy the convenient common bound

\[
 A^{(a_2)}-UI\succeq {1\over100}I.                    \tag{2.14}
\]

For completeness, subtract `I/100` and apply the two-by-two Sylvester
criterion.  The fail determinant before subtraction is larger than
`112/153`, because `sqrt(22)<5`, and its trace is smaller than `10`.
The pass determinant is larger than `23/9` and its trace is smaller than
`11`.  In both cases the determinant after subtraction remains positive;
the leading entry is plainly positive.

The pass odd low block on `span(e_1^-,e_2^-)` has determinant

\[
 -{19\over9}+{3\sqrt{22}\over4}>0                    \tag{2.15}
\]

and likewise satisfies

\[
 Q_{-,\mathrm{low}}^{\rm pass}-UI\succeq {1\over100}I. \tag{2.16}
\]

Indeed `sqrt(22)>9/2`, so the determinant in (2.15) is larger than
`91/72`, while the trace is smaller than `11`; subtracting `I/100` keeps
both Sylvester minors positive.

In the fail member, the transverse low scalar on `e_2^-` is

\[
 \sqrt{22}-{7\over2}>1,                               \tag{2.17}
\]

but the full two-by-two low determinant is

\[
 -{28\over9}+{\sqrt{22}\over2}<0.                    \tag{2.18}
\]

Thus the failure is already an inverse-weighted endpoint orientation
failure, not a negative transverse scalar.

### 2.3 High-block completion

Since `|b_n|<=3`, every off-diagonal complex-mode entry in (2.4) has
absolute value at most `6`.  On the high space `|n|>=3`, Gershgorin gives

\[
 Q_H-UI\succeq h_NI,
 \qquad
 h_N>M_N-12N-12>36000N.                               \tag{2.19}
\]

The complete low space has dimension five.  Therefore the squared
Frobenius norm of every low/high coupling, and hence its squared operator
norm after either parity restriction, obeys

\[
 \|C_{LH}\|^2\leq360N.                                \tag{2.20}
\]

The Schur loss from eliminating the high block is consequently at most

\[
 {360N\over h_N}<{1\over100}.                         \tag{2.21}
\]

Combining (2.14), (2.16), and the strict version of (2.21) proves, for
every `N>=2`,

\[
 \boxed{P_{\kappa^\perp}(Q_+-UI)P_{\kappa^\perp}\succ0} \tag{2.22}
\]

in both members, and

\[
 \boxed{Q_-^{\rm pass}-UI\succ0.}                    \tag{2.23}
\]

The same argument using the stronger scalar (2.17) proves that the complete
fail transverse block on `(e_1^-)^perp` is positive.  But its restriction to
`span(e_1^-,e_2^-)` has the negative determinant (2.18), so

\[
 \boxed{Q_-^{\rm fail}-UI\not\succ0}                  \tag{2.24}
\]

and, because its complete transverse block is positive, its live endpoint
Schur short is strictly negative.

### 2.4 Common absolute Gram and an arbitrarily flat family

Put

\[
 c_N=M_N+12N+20.                                      \tag{2.25}
\]

The same entry bound gives `c_N I+Q>0` and `c_N I-Q>0` for both members.
Hence

\[
 P={c_NI+Q\over2},\qquad N_0={c_NI-Q\over2}           \tag{2.26}
\]

are positive definite, and the paired analysis

\[
 Zv=(P^{1/2}v,N_0^{1/2}v),
 \qquad \Sigma=\operatorname {diag}(I,-I)             \tag{2.27}
\]

has

\[
 Z^*Z=c_NI,
 \qquad Z^*\Sigma Z=Q.                                \tag{2.28}
\]

Thus the pass and fail members have exactly the same positive absolute Gram
on every vector.  The exterior-copy construction from the checkpoint-0.55
note gives the same exact two-sided radical extension.

There is also an exact unbounded flat version.  Let

\[
 \sigma_N={2^{-N^2}\over c_N},
 \qquad
 \widetilde Q_N=\sigma_NQ_N,
 \qquad
 \widetilde U_N=\sigma_NU,
 \qquad
 \widetilde A_N=2^{-N^2}I.                            \tag{2.29}
\]

Then

\[
 \|\widetilde Q_N\|<2^{-N^2},
 \qquad
 \|\widetilde A_N\|=2^{-N^2},                        \tag{2.30}
\]

the two members differ in operator norm by exactly `sigma_N/4`, and their
Ritz values and residuals tend to zero at the same absolute scale.  Positive
scaling preserves (2.22)--(2.24).  It also preserves the contraction
decision in Lemma 1.1, because both `C` and `E` scale by `sigma_N`.

This proves an all-dimensional non-implication: exact source-Cauchy
displacement, inversion, a common absolute Gram, arbitrarily small absolute
matrices and residuals, the same live Ritz value, a positive complete even
complement, and a positive complete odd transverse block do not determine
the live odd Schur sign.  The missing datum remains the relative
aligned/anti-aligned orientation.

## 3. A genuine zero-extension step instability

This section isolates the same scale obstruction directly in the
cumulative-discrepancy normal form.  It deliberately does not claim the
exact arithmetic coefficient.

Let

\[
 I=[-L/2,L/2],\qquad h=\log2,\qquad L\geq8h,           \tag{3.1}
\]

and let `E_N^-` be any nonzero odd Fourier compression.  All functions are
extended by zero outside `I`.  Put

\[
 (K_hf)(x)=\widetilde f(x+h)+\widetilde f(x-h),
 \qquad T=P_{N,-}K_hP_{N,-}.                           \tag{3.2}
\]

The two killed translations are contractions, so

\[
 \|T\|\leq2.                                           \tag{3.3}
\]

For the normalized first odd Fourier mode, direct integration gives

\[
 \langle e_1^-,Te_1^-\rangle
 =2\left(1-{h\over L}\right)
       \cos{2\pi h\over L}
  +{1\over\pi}\sin{2\pi h\over L}>1.                \tag{3.4}
\]

The last inequality follows already by dropping the positive sine term and
using `h/L<=1/8`.  Hence

\[
 1<\theta:=\lambda_{\max}(T)\leq2.                    \tag{3.5}
\]

Fix `0<eta<1` and an arbitrary positive scale `gamma_L`.  Define

\[
 \tau_{\rm pass}={(1-\eta)\gamma_L\over\theta},
 \qquad
 \tau_{\rm fail}={(1+\eta)\gamma_L\over\theta},      \tag{3.6}
\]

and

\[
 B_*=\gamma_LI-\tau_*T.                               \tag{3.7}
\]

### Lemma 3.1 (step-flip theorem)

The two complete odd forms satisfy

\[
 \boxed{B_{\rm pass}\succeq\eta\gamma_L I,}          \tag{3.8}
\]

whereas `B_fail` has the exact eigenvalue

\[
 \boxed{-\eta\gamma_L.}                               \tag{3.9}
\]

Moreover, with the right-continuous steps

\[
 \mathcal F_*(t)=\tau_*\,1_{[h,L]}(t),
 \qquad U_L=c_*-\gamma_L,                              \tag{3.10}
\]

the tail-discrepancy form is exactly

\[
 \boxed{
 (c_*-U_L)\langle v,w\rangle
 +\int_0^L\mathcal F_*(t)C'_{v,w}(t)\,dt
 =\langle v,B_*w\rangle.}                             \tag{3.11}
\]

**Proof.**  If `t_k` is an eigenvalue of `T`, then `t_k<=theta`.  Since
`tau_pass>0`,

\[
 \gamma_L-\tau_{\rm pass}t_k
 \geq\gamma_L-\tau_{\rm pass}\theta
 =\eta\gamma_L.
\]

On a top eigenvector of `T`, the fail value is
`gamma_L-tau_fail*theta=-eta gamma_L`.  This proves (3.8)--(3.9).

For finite Fourier vectors, zero extension gives `C_(v,w)(L)=0`.  Therefore

\[
 \int_0^L\tau_*1_{[h,L]}(t)C'_{v,w}(t)\,dt
 =-\tau_*C_{v,w}(h)
 =-\tau_*\langle v,Tw\rangle.
\]

Since `c_*-U_L=gamma_L`, this is (3.11).  The positive jump in
`mathcal F` enters the quadratic form with a minus translation, exactly the
source prime-block orientation.  \(\square\)

The two steps and the induced matrices are absolutely indistinguishable at
an arbitrarily strong prescribed rate:

\[
 \|\mathcal F_{\rm fail}-\mathcal F_{\rm pass}\|_\infty
 ={2\eta\gamma_L\over\theta}\leq2\eta\gamma_L,        \tag{3.12}
\]

\[
 \|B_{\rm fail}-B_{\rm pass}\|
 \leq4\eta\gamma_L.                                  \tag{3.13}
\]

For every fixed nonnegative integer `r`, their polynomial-moment difference
is bounded by

\[
 \left|\int_0^Lt^r
  (\mathcal F_{\rm fail}-\mathcal F_{\rm pass})(t)dt\right|
 \leq {2\eta\gamma_L L^{r+1}\over r+1}.              \tag{3.14}
\]

Because `gamma_L` is arbitrary, it may decay faster than any finite or
declared countable list of absolute tolerances.  Nevertheless the relative
contraction decision flips.

To place (3.8)--(3.9) literally into the paired-slot calculus, choose one
common `M_L` so large that the following four matrices are positive:

\[
 A_L=(U_L+M_L)I,
 \qquad
 {A_L\pm(U_LI+B_*)\over2}.                             \tag{3.15}
\]

Then `A_L` is a common positive absolute Gram for the two members,

\[
 C_L=A_L-U_LI=M_LI,
 \qquad
 E_*=A_L-(U_LI+B_*)=M_LI-B_*,                         \tag{3.16}
\]

and Lemma 1.1 gives the exact contraction norms

\[
 \left\|C_L^{-1/2}E_{\rm pass}C_L^{-1/2}\right\|
 =1-{\eta\gamma_L\over M_L},                         \tag{3.17}
\]

\[
 \left\|C_L^{-1/2}E_{\rm fail}C_L^{-1/2}\right\|
 =1+{\eta\gamma_L\over M_L}.                         \tag{3.18}
\]

This is an exact unbounded near-saturation family.

The location `h=log 2`, right-continuous jump, zero extension, and minus
translation in (3.11) are source conventions.  The tunable coefficient in
(3.6), the missing other prime powers, and the missing actual archimedean
tail are not source conventions.  Therefore Lemma 3.1 rules out only a proof
from absolute discrepancy size, finitely many discrepancy moments, or an
absolute operator approximation.  It does not rule out a proof using the
complete exact arithmetic discrepancy.

## 4. Consequence for the actual proof obligation

The exact source target remains

\[
 \left\|(A_--UI)^{-1/2}E_-(A_--UI)^{-1/2}\right\|<1  \tag{4.1}
\]

at the same source-derived `U` used for the even complement and weighted
solve.  Lemma 1.1 says that a successful proof must control a relative
signed floor.  Sections 2--3 show that none of the following can substitute
for it:

* source-Cauchy displacement and inversion alone;
* a common positive absolute leakage Gram;
* absolute smallness of the complete matrices, residual, or orientation
  perturbation;
* a positive complete transverse block without its inverse-weighted Schur
  short; or
* magnitude-only, finite-moment, or absolute-operator control of the
  cumulative discrepancy.

A viable arithmetic theorem must retain the exact prime coefficients and
locations and establish a relative carrier-sensitive inequality for the
complete pole--archimedean--minus-prime form.  After that, the even
complement, vector-specific shifted solve in equation (5.2), and locally
uniform determinant limit remain independent obligations.
