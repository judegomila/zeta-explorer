# Preconditioned resolvent program

This note isolates a possible analytic route to the missing uniform estimate
in Sections 4--6 of `DIRECT_RH_ATTACK.md`.  It proves two finite-dimensional
linear-algebra lemmas and then states a conditional prolate--Weil research
program.  It does **not** prove the required estimates on an unbounded
schedule, does not prove Weil positivity, and does not prove RH.

## 1. Sector setup

Retain the notation of the weighted sector bridge.  On the inversion-even
sector, relative to

\[
 H_+=\mathbb C\kappa\oplus K,
 \qquad
 Q_+=\begin{bmatrix}q&b^*\\ b&A\end{bmatrix},
\]

let `u` be the lower two-dimensional Ritz value.  Let `U` be a rigorous real
upper bound for `u`.  Define

\[
 B_+=A-U I\quad\hbox{on }K,
 \qquad
 B_-=Q|_{H_-}-U I\quad\hbox{on }H_- .             \tag{1.1}
\]

If both operators in (1.1) are positive definite, then

\[
 U<\alpha,\qquad U<\omega,
\]

and hence the two strict sector comparisons required by the weighted bridge
hold because `u<=U`.  Moreover, by the spectral theorem for `A`,

\[
 \tau=\|(A-uI)^{-1}b\|
 \le \|(A-U I)^{-1}b\|=\|B_+^{-1}b\|.             \tag{1.2}
\]

The inequality in (1.2) uses that the two resolvents are scalar functions of
the same Hermitian operator `A`.  It is not a generic implication from
Loewner order to vector-norm order.

## 2. A left-preconditioned criterion

The following criterion is designed to retain energy weighting in the
residual direction.

**Lemma 1 (Euclidean left-preconditioned resolvent bound).**  Let `B` and `D`
be Hermitian operators on a finite-dimensional complex Hilbert space, with
`D` positive definite.  All operator norms in this lemma are the norms
induced by the original Hilbert-space norm.  Put

\[
 R=B-D,
 \qquad
 \rho=\|D^{-1}R\|.                                \tag{2.1}
\]

Although `R` and `D` are Hermitian, `D^{-1}R` need not be Hermitian in the
original inner product.  If

\[
 \rho<1,                                           \tag{2.2}
\]

then `B` is positive definite and, for every vector `y`,

\[
 \|B^{-1}y\|
 \le \frac{\|D^{-1}y\|}{1-\rho}.                  \tag{2.3}
\]

**Proof.**  For `0<=t<=1`, set `B_t=D+tR`.  The factorization

\[
 B_t=D(I+tD^{-1}R)                                \tag{2.4}
\]

and (2.2) show by the Neumann series that `I+tD^{-1}R` is invertible.
Consequently no `B_t` has a zero eigenvalue.  Each `B_t` is Hermitian, so its
inertia is constant along this path.  Since `B_0=D` is positive definite,
`B=B_1` is positive definite as well.

At `t=1`, (2.4) gives

\[
 B^{-1}=(I+D^{-1}R)^{-1}D^{-1}.
\]

The Euclidean Neumann-series estimate

\[
 \|(I+D^{-1}R)^{-1}\|\le(1-\rho)^{-1}
\]

then proves (2.3).  \(\square\)

Apply Lemma 1 separately to `B_+` and `B_-`, using explicit positive
preconditioners `D_+` and `D_-`.  If

\[
 \rho_\pm
 :=\|D_\pm^{-1}(B_\pm-D_\pm)\|
 \le\rho_0<1,                                     \tag{2.5}
\]

then both sector comparisons hold and

\[
 \tau
 \le \|B_+^{-1}b\|
 \le T_D
 :=\frac{\|D_+^{-1}b\|}{1-\rho_0}.               \tag{2.6}
\]

Thus a sufficient asymptotic target is

\[
 \rho_\pm\le\rho_0<1,
 \qquad
 \|D_+^{-1}b\|=O(\lambda^{-1/2})                  \tag{2.7}
\]

on one explicit unbounded diagonal schedule.  The constants and the index
from which (2.7) holds must be explicit in a proof.

### 2.1 The norm condition must not be changed silently

The symmetric relative-form operator is

\[
 S=D^{-1/2}(B-D)D^{-1/2}.                          \tag{2.8}
\]

The condition `||S||<1` is useful: it gives

\[
 B=D^{1/2}(I+S)D^{1/2}>0.                         \tag{2.9}
\]

It also gives the weighted estimate

\[
 \|D^{1/2}B^{-1}y\|
 \le\frac{\|D^{-1/2}y\|}{1-\|S\|}.               \tag{2.10}
\]

However, (2.10) is not the Euclidean estimate (2.3).  Converting it to the
original norm yields only

\[
 \|B^{-1}y\|
 \le
 \frac{\|D^{-1/2}\|\,\|D^{-1/2}y\|}{1-\|S\|},    \tag{2.11}
\]

which can reintroduce the smallest scale in `D`.  The operators
`D^{-1}(B-D)` and `S` are similar and have the same eigenvalues, but their
Euclidean operator norms need not agree.  Therefore a proof that needs the
Euclidean weighted bound (2.6) must certify the nonsymmetric left-preconditioned
norm in (2.5), or else supply another argument that converts its chosen
symmetric estimate without losing the small-gap advantage.

All finite certificates must use outward-rounded upper bounds for the
relevant operator norm.  A displayed spectral radius, point singular value,
or approximate inverse is not a certificate for (2.5).

## 3. A low/high Schur-complement criterion

The left-preconditioned condition (2.5) may be stronger than necessary.  A
low-energy window can instead be isolated explicitly.

**Lemma 2 (Schur-complement energy-window bound).**  Let
\(K=L\oplus H\) be an orthogonal decomposition and write a Hermitian operator
`B` as

\[
 B=\begin{bmatrix}B_{LL}&C^*\\ C&B_{HH}\end{bmatrix}.   \tag{3.1}
\]

Assume that, for explicit positive numbers `a`, `G`, and `c`,

\[
 B_{LL}\ge aI,
 \qquad
 B_{HH}\ge GI,
 \qquad
 \|C\|\le c,                                      \tag{3.2}
\]

and put

\[
 s=a-\frac{c^2}{G}.                               \tag{3.3}
\]

If `s>0`, then `B` is positive definite.  For
\(y=y_L\oplus y_H\), set

\[
 \beta_L=\|y_L\|,
 \qquad
 \beta_H=\|y_H\|,
\]

and define

\[
 X=\frac{\beta_L+(c/G)\beta_H}{s},
 \qquad
 Y=\frac{\beta_H}{G}+\frac cG X.                 \tag{3.4}
\]

Then

\[
 \|B^{-1}y\|\le\sqrt{X^2+Y^2}.                  \tag{3.5}
\]

**Proof.**  Since `B_HH>=GI`, its inverse exists and
`||B_HH^{-1}||<=G^{-1}`.  Its Schur complement is

\[
 \mathcal S=B_{LL}-C^*B_{HH}^{-1}C.              \tag{3.6}
\]

For \(x\in L\),

\[
 \langle x,\mathcal Sx\rangle
 \ge a\|x\|^2-G^{-1}\|Cx\|^2
 \ge s\|x\|^2.                                   \tag{3.7}
\]

Thus \(\mathcal S>0\), and the standard Schur factorization, or completion of
the square in the quadratic form, proves `B>0`.

Write \(B(x\oplus z)=y_L\oplus y_H\).  Eliminating `z` gives

\[
 \mathcal Sx=y_L-C^*B_{HH}^{-1}y_H,
\]

and hence

\[
 \|x\|
 \le s^{-1}(\beta_L+cG^{-1}\beta_H)=X.           \tag{3.8}
\]

The high component satisfies

\[
 z=B_{HH}^{-1}(y_H-Cx),
\]

so `||z||<=Y`.  Orthogonality of `L` and `H` now gives (3.5).  \(\square\)

For `B=B_+` and `y=b`, Lemma 2 and (1.2) give the corresponding upper bound
for `tau`.  The same Schur test with no residual vector can prove positivity
of `B_-`.  Several energy windows can be handled by applying the lemma
recursively.  This can allow a very small low-window gap `s`, provided the
forcing into that window is smaller in the precise relative combination in
(3.4).

### 3.1 Retaining the coupling Gram instead of its norm

The scalar estimate (3.3) is still unnecessarily destructive.  The following
matrix version is the criterion now used by the prolate-window pilot.

**Lemma 3 (anisotropic Schur lower model and forced bound).**  Let

\[
 B=\begin{bmatrix}A&C^*\\ C&H\end{bmatrix}=B^*
\]

on an orthogonal decomposition `L direct-sum H`, and suppose
`H>=gI` for an explicit `g>0`.  For any explicit map `X:L->H`, put

\[
 E=C-HX,
 \qquad
 A_X=A-C^*X-X^*C+X^*HX,                           \tag{3.9}
\]

and

\[
 S_0=A_X-g^{-1}E^*E.                              \tag{3.10}
\]

Then the exact low Schur complement satisfies

\[
 S=A-C^*H^{-1}C=A_X-E^*H^{-1}E\ge S_0.           \tag{3.11}
\]

Consequently `S_0>0` implies `B>0`.  In particular, the choice `X=0`
gives

\[
 S_0=A-g^{-1}C^*C.                                \tag{3.12}
\]

It is invalid to replace (3.12) by a scalar multiple of the identity when
the proof needs its anisotropy.  The weaker scalar floor

\[
 \lambda_{\min}(A)-\|C\|^2/g                     \tag{3.13}
\]

can be negative even when the complete matrix (3.12) is positive.

There is also a forcing bound that retains this matrix information.  Let
`D>0` be any explicit matrix with `D<=S`, let
`d=lambda_min(D)`, and write `y=y_L direct-sum y_H`.  For an approximate
high solve `z_0`, define

\[
 e=y_H-Hz_0.                                      \tag{3.14}
\]

If

\[
 \Theta\ge\|H^{-1}CD^{-1/2}\|,                  \tag{3.15}
\]

then the explicit choice

\[
 \Theta=|XD^{-1/2}\|+g^{-1}\|ED^{-1/2}\|     \tag{3.16}
\]

is valid.  Put

\[
 F=\|D^{-1/2}(y_L-C^*z_0)\|+\Theta\|e\|,
 \qquad
 Z=\|z_0\|+g^{-1}\|e\|.                         \tag{3.17}
\]

Then

\[
 \boxed{
 \|B^{-1}y\|
 \le T_{\rm AS}
 :=\left(\frac{F^2}{d}+(Z+\Theta F)^2\right)^{1/2}.} \tag{3.18}
\]

**Proof.**  With

\[
 T=\begin{bmatrix}I&0\\-X&I\end{bmatrix},
\]

direct multiplication gives

\[
 T^*BT=\begin{bmatrix}A_X&E^*\\E&H\end{bmatrix}.
\]

Since `H^{-1}<=g^{-1}I`, (3.11) follows.  Positivity of a Hermitian block
matrix with positive high block is equivalent to positivity of its Schur
complement, proving the first assertion.

For the forced statement, set

\[
 f=y_L-C^*H^{-1}y_H,
 \qquad x_L=S^{-1}f.
\]

The condition `D<=S` gives

\[
 \begin{aligned}
 \|D^{1/2}x_L\|^2
 &\le \langle x_L,Sx_L\rangle\\
 &=\operatorname{Re}\langle x_L,f\rangle
 \le\|D^{1/2}x_L\|\,\|D^{-1/2}f\|.
 \end{aligned}                                    \tag{3.19}
\]

Equations (3.14)--(3.17) give
`||D^(-1/2)f||<=F`, so
`||x_L||<=F/sqrt(d)`.  Finally,

\[
 x_H=H^{-1}y_H-H^{-1}Cx_L
\]

and (3.15) give `||x_H||<=Z+Theta F`.  Orthogonality of the two blocks
proves (3.18).  This proof does not use the false implication
`S>=D => ||S^(-1)f||<=||D^(-1)f||`.  \(\square\)

For an exact zero forcing, take `z_0=0`; then `F=Z=T_AS=0`.  If the high
block is empty, (3.19) alone gives the corresponding low-only bound.  If the
low block is empty, `||z_0||+||e||/g` is the high-only bound.  A finite
certificate must enclose `g`, the complete matrix (3.10), `d`, every norm in
(3.16)--(3.17), and the high-solve residual outward.  Point eigenvalues or
point Cholesky factors are diagnostics only.

For the present two-window pilot, a uniform source comparison can be reduced
to three scalar estimates without scalarizing the coupling.  Let `G_add>0`
be the pushed-forward additive concentration Gram and choose an explicit
`m>0`.  Write

\[
 S_0-mG_{\rm add}
 =\begin{bmatrix}p&\overline z\\z&r\end{bmatrix}. \tag{3.20}
\]

Sylvester's criterion gives the exact equivalence

\[
 S_0\ge mG_{\rm add}>0
 \quad\Longleftrightarrow\quad
 p>0,\qquad pr-|z|^2>0.                           \tag{3.21}
\]

Thus a fixed two-window asymptotic proof needs entrywise combined-form
estimates strong enough to establish the diagonal reserve and the determinant
reserve in (3.21), plus `G_add>0` and the high floor `g>0`.  It does not need
a bound by `||C||`.

### 3.2 What a Krylov parametrix can and cannot prove

The freedom to choose `X` in Lemma 3 permits a deterministic approximate
solve of `H X=C`, but convergence of that solve cannot manufacture the
missing sign.  For a source-frozen columnwise Krylov map `X_k`, put

\[
 E_k=C-HX_k,
 \qquad A_k=A-C^*X_k-X_k^*C+X_k^*HX_k.           \tag{3.22}
\]

If explicit Hermitian matrices `D_k>0` and `R_k` satisfy

\[
 D_k\le A_k,
 \qquad E_k^*E_k\le R_k,
 \qquad
 \lambda_{\max}(D_k^{-1/2}R_kD_k^{-1/2})<g,     \tag{3.23}
\]

then

\[
 S_{0,k}\ge D_k-g^{-1}R_k>0.                    \tag{3.24}
\]

This is a useful finite certificate because every entry of `E_k^*E_k` can be
reduced to finitely many cross Krylov moments.  It still requires the signed
lower model `D_k<=A_k`.  Indeed, with `S=A-C^*H^{-1}C`, exact algebra gives

\[
 A_k=S+E_k^*H^{-1}E_k,
 \qquad
 S_{0,k}=S-E_k^*(g^{-1}I-H^{-1})E_k\le S.       \tag{3.25}
\]

Thus every successful lower certificate resolves a positive scale no larger
than the exact Schur floor.  A condition-number estimate can shrink the
negative correction in (3.25), but it cannot decide the sign of `S`.
For example, `H=C=1` and an exact one-step solve give `E_k=0`, while choosing
`A=1+delta` or `A=1-delta` gives opposite Schur signs.

There is also an orientation caveat.  Adaptive columnwise CG or GMRES uses a
different residual polynomial for each column.  Per-column residual bounds
therefore do not imply a Loewner bound for the complete Gram `E_k^*E_k`.
The full cross Gram must be enclosed.  A single prescribed Chebyshev
polynomial avoids this problem, but its convergence estimate still only
controls the correction term in (3.25).  Consequently a Krylov parametrix is
an auxiliary certification device, not a replacement for the combined
prolate--Weil comparison.

## 4. Energy-window form of the target

Let `{P_m}` be an explicit orthogonal resolution of the even complement,
chosen from source-normalized prolate data rather than from eigenvectors of
the Weil matrix.  For positive explicit scales `d_m`, set

\[
 D_+=\sum_m d_mP_m.                               \tag{4.1}
\]

Then the weighted numerator in Lemma 1 is exactly

\[
 \|D_+^{-1}b\|^2
 =\sum_m\frac{\|P_mb\|^2}{d_m^2}.                \tag{4.2}
\]

Consequently the following three estimates are a sufficient analytic
package:

\[
 \begin{aligned}
 &\|D_+^{-1}(B_+-D_+)\|\le\rho_0<1,\\
 &\|D_-^{-1}(B_--D_-)\|\le\rho_0<1,\\
 &\sum_m\frac{\|P_mb\|^2}{d_m^2}
       \le C^2\lambda^{-1}.
 \end{aligned}                                    \tag{4.3}
\]

Unlike the scalar estimate `r/(alpha-U)`, (4.2) does not divide the entire
residual by the smallest complementary gap.  It does not, however, remove
the sign obligation: either (4.3), a Schur argument, or another complete
argument must still prove positivity of every even-complement and odd-sector
direction.

### 4.1 Exact weak-residual dual and sampling-window criterion

The residual numerator in (4.3) now has an exact cancellation-preserving
dual form.  With `p=a*kappa`, global radical remainder `R=K-p`, and `D_+`
from (4.1),

\[
 \|D_+^{-1}b\|
 =\frac1a\sup_{v\ne0}
       \frac{|\mathcal W_Z(v,R)|}{\|D_+v\|}.                 \tag{4.3a}
\]

If `K=direct-sum K_m` and ordinary absolute zero-sampling estimates give

\[
 \|R\|_{\mathfrak Z}^2\le\epsilon_\lambda,
 \qquad
 \sup_{v\in K_m,\|v\|=1}\|v\|_{\mathfrak Z}^2
 \le\beta_m d_m,
\]

then sequence Cauchy--Schwarz, not Weil positivity, gives

\[
 \|D_+^{-1}b\|^2
 \le\frac{\epsilon_\lambda}{a^2}
       \sum_m\frac{\beta_m}{d_m}.                            \tag{4.3b}
\]

The factor `a` cancels after multiplication by the projected norm in the
determinant bridge.  The complete theorem and exact scalar/action obstruction
are in `notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md`.  The separate
`notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` now supplies
`epsilon_lambda=o(d_6)` for the actual complete remainder on the locked
exponential schedule.  This closes the common normalization-free scalar-shift
scale obstruction.  The separate projected-state norm theorem supplies the
required lower control of `a`, so `U_Z=epsilon_lambda/a^2=o(d_6)` on that
schedule.  The growing-window Bessel constants and reciprocal sum remain open.  In
particular, the admitted
scalar result `q_lambda(p,p)=o(d_8)` cannot imply (4.3a): an exact
two-sided-radical model has every scalar P/O pairing zero and nonzero action.

For reference, if one had independently proved positive leakage scales
`epsilon_g` for the comparison state and `d_m` for the other windows, together
with

\[
 \|P_mb\|^2\le C_0\epsilon_g d_m,                 \tag{4.4}
\]

then

\[
 \|D_+^{-1}b\|^2
 \le C_0\epsilon_g\sum_m d_m^{-1}.                \tag{4.5}
\]

Thus an explicit estimate

\[
 \epsilon_g\sum_m d_m^{-1}=O(\lambda^{-1})       \tag{4.6}
\]

would suffice.  Equation (4.4) may not be obtained by applying
Cauchy--Schwarz to the Weil form unless positivity of that form has already
been proved.  It must instead come from an independently positive leakage
representation or from direct estimates of the combined explicit formula.

## 5. Conditional prolate--Weil comparison program

The intended windows are generated from exact finite prolate functions,
their source-normalized zero-integral combinations, the arithmetic map
`mathcal E`, mandatory inversion evenization or oddization, and the exact
projection into `E_N`.  No finite-lambda inversion parity is to be assumed.
The vectors must be orthonormalized with a quantitatively controlled Gram
matrix, not with stored Weil eigenvectors.

The following estimates would turn Lemma 1 or Lemma 2 into an asymptotic
proof component.

1. **Exact prolate concentration bounds.**  Obtain upper and lower bounds,
   with explicit constants and remainders, for the concentration defects of
   the `h_4-h_0` comparison family, the next even family based on `h_8`, the
   first odd family based on `h_6` and `h_2`, and all modes through the
   growing transition window.  Monotonicity alone is not enough; the bounds
   must control the sums in (4.2) or (4.5).

2. **Exact codimension-two correction.**  The implemented `h_lambda` has
   exactly zero integral but need not have exactly zero value at the origin.
   Quantify an explicit correction into the space satisfying both conditions
   required by the radical statement, and quantify the difference from the
   implemented state.  This correction must not silently replace the P0
   normalization.

3. **Radical subtraction with domains checked.**  Re-derive, from a pinned
   source and the explicit formula, the bilinear radical identity for
   `mathcal E(f)` when both codimension-two conditions hold.  For a truncated
   arithmetic image, express its Weil pairing through the time and frequency
   leakage tails.  Every domain, cutoff, and boundary term must be explicit.

4. **Positive leading leakage form.**  Derive an explicit positive model
   \(D_+\oplus D_-\) for those tail pairings and bound the full remainder
   in the left-preconditioned Euclidean norm in (2.5), or prove the Schur
   hypotheses (3.2)--(3.3).  An absolute `O(lambda^{-c})` remainder is
   insufficient if the relevant model level is exponentially smaller.

5. **Combined residual estimates.**  Bound each `||P_m b||` after the pole,
   archimedean, and prime contributions have been combined with their source
   signs.  The target is (4.2), not the sum of the three block norms.

6. **High and transition coercivity.**  Prove a complete lower bound outside
   the near-radical prolate windows, including all coupling terms to those
   windows.  A principal-symbol or high-Fourier estimate alone leaves the
   medium and transition ranges untreated.

7. **Odd-sector comparison.**  Prove the full odd analogue of (2.5) or the
   Schur positivity conditions.  A small residual in the even sector says
   nothing about an unexamined odd eigenvalue.

8. **Preconditioned Galerkin control.**  Choose an explicit `N(lambda)` and
   bound the finite Fourier projection and form errors after multiplication
   by `D_+^{-1}` and `D_-^{-1}`.  The ordinary `L2` projection error required
   by equation (5.2) is a separate, weaker quantity.

9. **Certified shift.**  Produce a rigorous upper bound `U>=u` with strict
   room in both sector comparisons.  Choosing a shift below `u` makes the
   resolvent artificially smaller and is invalid.

10. **Limit-rate package.**  Prove, on one exact unbounded schedule,

   \[
   e_{\lambda,N}=O(\lambda^{-1/2}),\qquad
   \|P_Nk_\lambda^+\|=O(1),\qquad
   T_D=O(\lambda^{-1/2}),                          \tag{5.1}
   \]

   or stronger explicit estimates.  Then the already-proved finite weighted
   bridge supplies the conditional input to equation (5.2).

No cost optimization is needed.  A possible endpoint-avoiding research
schedule is `lambda_j=j+1/2`, with `N_j` chosen only after the
preconditioned Galerkin estimate is known.  The presently tested
`N` proportional to `lambda^2` schedules are diagnostics, not an analytic
choice established by this note.

### 5.1 Heuristic leakage scales, not theorem input

Classical prolate asymptotics suggest scales of the form

\[
 \epsilon_4\ \hbox{like}\
       \lambda^9e^{-4\pi\lambda^2},\qquad
 \epsilon_6\ \hbox{like}\
       \lambda^{13}e^{-4\pi\lambda^2},\qquad
 \epsilon_8\ \hbox{like}\
       \lambda^{17}e^{-4\pi\lambda^2}.            \tag{5.2}
\]

If exact source-normalized Weil-model levels were comparable to these
defects, the first even ratio would behave heuristically like
`epsilon_4/epsilon_8`, namely `lambda^{-8}`, and the first odd scale would
exceed the comparison-state scale by a factor like `lambda^4`.  Together
with a rigorously derived geometric-mean cross estimate, this would be more
than sufficient for (4.6).

These statements are only motivation.  No estimate in (5.2), no comparison
between a prolate defect and a Weil level, and no uniform remainder through
a growing mode window is asserted here.  The now-pinned Slepian fixed-index
asymptotic has no explicit two-sided remainder and no uniformity in the
growing indices actually used, so it cannot be substituted for items 1--4
above.

## 6. Separately reproduced finite diagnostics

The current JSON artifacts serialize the raw block matrices, `kappa`, `u`,
the full `tau`, and the sector floors.  They do **not** serialize individual
eigenmode contributions to `tau`.  The percentages below were separately
reproduced, at the artifacts' working precision and without interval
enclosures, from

- `artifacts/p0_schedule/raw/lambda2_N8_dps30.json`, and
- `artifacts/p0_schedule/raw/lambda2p5_N14_dps40.json`.

For reproducibility, assemble `Q=pole-archimedean_unsigned-prime_unsigned`.
In modes `-N,...,N`, use the explicit inversion-even basis

\[
 e_0=V_0,
 \qquad
 e_n^+=\frac{V_n+V_{-n}}{\sqrt2}\quad(1\le n\le N),
\]

form any orthonormal basis of the complement of the stored `kappa`, and let
`A phi_l=a_l phi_l` be the eigendecomposition of the resulting even
compression.  If `b=(Q-q)kappa`, then the separately reconstructed
contributions are

\[
 t_l^2=
 \frac{|\langle\phi_l,b\rangle|^2}{(a_l-u)^2},
 \qquad
 \tau^2=\sum_l t_l^2.                             \tag{6.1}
\]

This reconstruction gave:

- At `(lambda,N)=(2,8)`, the lowest complementary mode had
  `a_0-u approximately 3.606240121e-7`,
  `|<phi_0,b>| approximately 2.452160209e-10`, and
  `t_0 approximately 6.799769639e-4`.  Its separately computed share was
  about `0.9999985986` of `tau^2`; the artifact's serialized total is
  `tau approximately 6.799774404e-4`.
- At `(lambda,N)=(2.5,14)`, the corresponding values were
  `a_0-u approximately 2.621670270e-16`,
  `|<phi_0,b>| approximately 1.047989452e-18`, and
  `t_0 approximately 3.997411360e-3`.  Its separately computed share was
  about `0.9999694673` of `tau^2`; the artifact's serialized total is
  `tau approximately 3.997472387e-3`.

These are non-certified diagnostics reconstructed from rounded artifact
data.  They are included only to identify the analytic target: the observed
weighted improvement comes primarily from very weak coupling to the first
tiny complementary mode.  A high-energy estimate that ignores this
near-radical window would miss the dominant contribution.

The deterministic prolate-window split supplies a sharper point result.  At
`(lambda,N)=(2,8)`, retain the complete coupling Gram in (3.12).  The even
and odd lower-model floors are respectively

\[
 3.57955575357621668\times10^{-7},
 \qquad
 1.30078383718587625\times10^{-9}.               \tag{6.2}
\]

Both are positive, whereas both scalar floors (3.13) are negative.  The
corresponding exact point Schur floors are
`3.6062401246 10^(-7)` and `1.3216376053 10^(-9)`.  Thus the earlier finite
failure was caused by scalarizing `C^*C`, not by the deterministic prolate
window itself.

For the even residual, use `X=0`, `D=S_0`, and the exact point high solve as
`z_0`.  The point values are

\[
 F=4.14024700283228644\times10^{-7},
 \quad \Theta=0.5962248189879815,
 \quad Z=1.0162273918041177\times10^{-7},         \tag{6.3}
\]

and Lemma 3 gives

\[
 T_{\rm AS}=6.920089970753575\times10^{-4},       \tag{6.4}
\]

only about `1.8 percent` above the direct point value
`tau=6.79977440374583 10^(-4)`.

There is also a source-defined positive comparison model.  Before the
state-invisible origin correction, if a low source window has prolate
coordinates `a_n`, Fourier unitarity and the compressed prolate relation give

\[
 G_{ij}=\sum_n\overline{a_{ni}}a_{nj}(1-\chi_n^2). \tag{6.5}
\]

After the same finite-state deflation and Loewdin Gram congruence used to
define the physical low basis, the generalized point spectra of the exact
Schur complements relative to (6.5) are

\[
 \{1.4576694649,3.5056599176\}\quad\hbox{(even)},
 \qquad
 \{1.6427403484,3.1991400912\}\quad\hbox{(odd)}. \tag{6.6}
\]

More directly, the lower matrices themselves satisfy the point comparison
`S_0>G_add`.  In the coordinates of (3.20), the even diagonal and determinant
reserves are approximately

\[
 p_+=4.9936351538\times10^{-5},
 \qquad
 \det(S_{0,+}-G_+)=4.2537633508\times10^{-10},    \tag{6.7}
\]

and the odd reserves are

\[
 p_-=4.9510119306\times10^{-7},
 \qquad
 \det(S_{0,-}-G_-)=1.7918237354\times10^{-14}.   \tag{6.8}
\]

These four signed quantities are a concrete target for direct combined-form
asymptotics.  They are point values, not enclosures.

This is a strong structural match, but (6.5) is only a chosen positive
preconditioner.  It is not the signed Weil form or the exact multiplicative
tail norm.  If the invisible bump-corrected representatives are used instead,
all bump cross terms must be included.  None of (6.2)--(6.6) is interval
enclosed or uniform in `lambda`.

### 6.1 Refined schedule and growing transition-window stress test

A non-optimized refinement of the deterministic schedule
`N=2 ceil(lambda^2)` gives the following point diagnostics.  The displayed
projection errors and margins were stable under the recorded precision and
Galerkin repetitions, but they are not interval enclosures.

| `(lambda,N)` | projection error | `tau` | odd floor minus `u` | result |
|---|---:|---:|---:|---|
| `(1.75,8)` | `1.418e-5` | `3.235e-3` | `1.006e-5` | both sectors positive |
| `(2,8)` | `1.398e-7` | `6.800e-4` | `1.322e-9` | both sectors positive |
| `(2.25,12)` | `3.834e-10` | `1.464e-4` | `1.439e-14` | both sectors positive |
| `(2.75,16)` | `3.867e-13` | unavailable | `-9.334e-24` | fail closed |

The first three passing values give a purely exploratory power fit
`tau approximately C lambda^(-12.30)`, with ordinary least-squares standard
error about `0.39` and local fitted exponents from about `11.68` to `13.04`.
The fourth point invalidates any monotone extrapolation from that fit.  It is
not evidence for an asymptotic exponent.

The fail-closed row is sensitive to Fourier bandwidth.  At the same
`lambda=2.75`, increasing to `N=24=3*ceil(lambda^2)` gives positive shifted
even and odd margins approximately `1.0723e-23` and `9.6317e-27`, with
`tau=2.2142e-4`.  At `N=32` the margins remain positive, while the odd margin
shrinks to `3.6034e-27` and `tau` increases to `2.6218e-4`.  Enlarging the
`N=24` prolate Galerkin basis from 60 to 80 changes `tau` by less than
`4.7e-32` and preserves the signs.  A separate 50-to-80 decimal-digit repeat
changes the tiny odd shifted margin by about `5.1e-50` and `tau` by about
`3.3e-27`.  This repairs the finite `N=16` failure
but is neither monotone bandwidth convergence nor an analytic schedule.  It
shows that `N(lambda)` must be derived from the preconditioned Galerkin error
in item 8, rather than fixed from the first successful multiplier.

On the deterministic schedule `N=3*ceil(lambda^2)`, the four tested points
`lambda=1.75,2,2.25,2.75` all pass the finite shifted-sector tests and have
weighted `tau` approximately
`2.1225e-3, 1.2218e-3, 7.7938e-4, 2.2142e-4`.  A four-point log--log fit gives
power `4.9828`, OLS-only standard error `0.4467`, and local slopes from
`3.8171` to `6.2712`.  This is schedule reconnaissance only: a fixed
multiplier has no proved relative truncation error, and the fit supplies no
unbounded-sequence estimate.

At `(2.25,12)`, the original two even windows `(8,12)` and two odd windows
`(6,10)` no longer make the `X=0` lower model positive.  The even and odd
floors are respectively

\[
 -9.5874516458\times10^{-7},
 \qquad -1.0577091217\times10^{-6},              \tag{6.9}
\]

although the exact point Schur floors remain positive at approximately
`7.07205e-12` and `1.43920e-14`.  Deterministic Krylov
parametrices eventually recover positive point lower models, but only after
resolving essentially the same tiny scale: zero-start CG first succeeds at
steps eight and six in the even and odd sectors, while unrestarted GMRES
first succeeds at steps three and six.  Precision doubling preserves these
outcomes.  By (3.25), this does not supply the missing sign theorem.

The source-defined low window has to grow through the prolate transition
range.  With `c=2 pi lambda^2`, the classical Shannon index is
`2c/pi=4 lambda^2`.  At `(2.25,12)`, taking all available source families
below that threshold,

\[
 \{8,12,16,20\}\quad\hbox{and}\quad
 \{6,10,14,18\},                                 \tag{6.10}
\]

restores the simple `X=0` matrix certificate.  The point lower-model floors
become

\[
 6.8603838645\times10^{-12}\quad\hbox{(even)},
 \qquad
 1.4145337819\times10^{-14}\quad\hbox{(odd)},    \tag{6.11}
\]

versus exact Schur floors `7.0720530278e-12` and
`1.4391957517e-14`.  An independent formula replay from the serialized
raw blocks disagrees with the two lower matrices by less than `9e-36`.
Repeating the complete producer at 60 rather than 35 decimal digits changes
the displayed lower floors by less than `1.1e-33`.
The corresponding generalized spectra of the lower models relative to the
positive additive concentration Gram lie in

\[
 [0.5434,3.9123]\quad\hbox{and}\quad[0.8980,3.8487]. \tag{6.12}
\]

This is a stronger structural pilot, not a proof.  It also shows why a fixed
two-window argument is not the intended asymptotic object: the number of
near-radical prolate directions grows like the Shannon index.  Moreover the
forced `X=0` bound in the enlarged even window is about `8.3890e-4`,
well above the direct point solve `1.4637e-4`, so positivity alone does
not establish the weighted estimate (4.3).  Uniform combined-form control of
the growing window, its forcing orientation, the high tail, and the odd
sector remains open.

### 6.4 Exact signed comparison object and additive transition buffer

The phrase "combined-form control" now has a literal formula.  After the
Rayleigh zero-origin subtraction, every shifted matrix element is

\[
 (q-u)\langle v,w\rangle-
 \int_0^L\left(e^x-\psi_C(e^x)-\frac12\log(1-e^{-2x})\right)
 \frac d{dx}\left(e^{-x/2}\omega^q_{v,w}(x)\right)dx. \tag{6.13}
\]

Equation (6.13), proved and independently replayed in
`notes/CHEBYSHEV_ERROR_REWRITE.md`, preserves all source cancellation.  Its
normalized Chebyshev-error kernel is sign-indefinite, so it cannot simply be
declared comparable to the positive additive Gram.

The positive side of that prospective comparison is nevertheless explicit
for an arbitrary growing family.  `notes/GROWING_WINDOW_THEOREM.md` proves
the exact source Grams and determinants, including the physical plus-anchor
deflation, and pins a nonasymptotic transition estimate.  If

\[
 n_*=\lceil4\lambda^2\rceil+6+
 \left\lceil\frac{2}{\pi^2}\log(200\lambda^2+25)\log20\right\rceil,
\]

then every additive concentration defect with index `n>=n_*` is at least
`1/2`.  Thus the unresolved comparison has a finite low window extending only
`O(log(lambda))` beyond the Shannon index and a uniformly positive additive
high model.  The missing inputs are a correct-scale lower bound for the fixed
leading defects, restricted conditioning of the physical map, and a signed
relative estimate for (6.13) retaining the residual orientation.

### 6.5 What the far-tail and Hankel reductions remove

The physical far-prime component of (6.13) is no longer an uncontrolled
high tail.  `notes/PROLATE_TAIL_ENVELOPE.md` proves an explicit
super-polynomial bound for every polynomial Fourier schedule.  On the near
range, `notes/NEAR_SIGNED_HANKEL_REDUCTION.md` gives exact parity-filtered
Hankel and projection-Toeplitz formulas.  The pinned PNT bound in
`P3_SOURCE_LOCK.json` makes the complete normalized kernel's `L1`, `L2`, and
first weighted `L2` moments finite with explicit interval-replayed constants.

These results do not yet give (4.4) or (4.6).  For complete global radical
remainders `R_j=O_j+P_j`, the exact correlation contains all four terms

\[
 q(R_n,R_m)=q(O_n,O_m)+q(O_n,P_m)
             +q(P_n,O_m)+q(P_n,P_m).             \tag{6.14}
\]

Only the first term has two physical leakage profiles, and its weighted
defect-relative estimate is still open.  The three projection-containing
terms are now controlled on the locked half-integer exponential schedule:
the relative Fourier theorem supplies the Galerkin scale, the compact theorem
handles P--P, and `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` handles both
mixed orientations.  The mixed result applies to the actual corrected,
source-normalized combined `0/4` state through the two-sided radical identity;
it is not a statement about raw individual-mode radicals or a generic outer
multiplier.  These component bounds do not establish (4.4), (4.6), or the
signed sector comparison.

## 7. Circularity traps

The following do not establish the program above.

1. Assuming global Weil positivity, or applying Cauchy--Schwarz in the Weil
   form before independently proving the needed positivity.
2. Expanding through a list of zeta zeros and assuming that all of them are
   real.
3. Defining the energy windows using eigenvectors or spectral projectors of
   the exact Weil matrix and then treating their observed residual overlaps
   as analytic estimates.  That repackages `tau` rather than bounding it.
4. Assuming that prolate ordering transfers to Weil ordering without a
   quantitative comparison controlling all off-diagonal and tail terms.
5. Replacing the nonsymmetric Euclidean norm in (2.5) by the symmetric form
   norm in (2.8) while still claiming the Euclidean estimate (2.6).
6. Using a fixed-index prolate asymptotic for a window whose dimension grows
   with `lambda`.
7. Proving only absolute Galerkin or matrix errors when the relevant gaps are
   exponentially small; the errors must be relative in the chosen
   preconditioned or Schur norm.
8. Bounding the pole, archimedean, and prime residual blocks separately and
   applying a triangle inequality before their cancellation.
9. Proving high-frequency coercivity while leaving a medium or transition
   window, or the entire odd sector, uncontrolled.
10. Substituting a floating-point solve, a sampled eigenvalue, or finitely
    many interval-certified pilots for an analytic bound on an unbounded
    schedule.
11. Assuming finite-lambda inversion parity of the arithmetic prolate state
    instead of using the exact evenization and oddization conventions.
12. Choosing `U<u`, using a lower enclosure of `u` as if it were an upper
    enclosure, or invoking the exact-zero branch for an interval merely
    containing zero.
13. Inferring locally uniform determinant convergence from real-axis
    eigenvalue agreement.

The decisive missing estimate is therefore not a generic global gap.  It is
an explicit, source-normalized, cancellation-preserving comparison of the
shifted Weil form with a positive prolate leakage model, strong enough in the
left-preconditioned Euclidean norm or in recursively controlled Schur
windows to prove (4.3) on one unbounded schedule.  The separate Fourier
projection term is now `O(lambda^(-1/2))` on every fixed
`N=C*ceil(lambda^2)` by `notes/PROJECTION_RATE_THEOREM.md`; it is no longer
part of the final transform-convergence obstruction.  Relative projection
control inside the signed four-term remainder (6.14), however, is still part
of the preconditioned comparison obstruction.  This note supplies only the
finite linear algebra showing why the remaining signed estimate would
suffice.
