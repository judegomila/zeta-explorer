# Parity-dangerous projectors and the all-shift metric-rotation obstruction

## 0. Claim boundary and outcome

This note makes two finite-dimensional points about the exact complete-symbol
reduction.

1. The same source multiplier gives even and odd dangerous spaces with a
   common strict far floor.  In the sharp odd construction the negative pole
   costs at most one additional retained direction.  If instead one uses the
   single spectral projector of the multiplier-plus-pole operator, its extra
   trace cost is explicitly at most

   \[
    2\|p_-\|_2^2
    =\lambda-\lambda^{-1}-2\log\lambda.              \tag{0.1}
   \]

   Thus both retained dimensions are `exp(O(lambda))` on the locked
   schedule.  This improves the honest finite cost of a common-parity
   reduction; it does not orient either retained Schur complement.

2. A positive complete block, a strict far floor, a rank-one dangerous
   space, and an arbitrarily good endpoint estimate at `sigma=0` do not
   imply a quantitative all-shift coframe floor.  An exact three-dimensional
   family below has all those properties, while its all-shift constant tends
   to zero.  The obstruction is rotation of the harmonic lift through the
   noncommuting quotient metric.

The second statement is source-agnostic.  It is not a model for the actual
prime operator and does not invalidate the source-specific target.  It
rules out only an endpoint shortcut.  In particular, it is different from
the zero-discrepancy countermodel in
`notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md`, which rules out
magnitude-only arithmetic control, and from the quotient/Loewner
countermodels in `notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md` and
`notes/QUOTIENT_EXTERIOR_PRECONDITIONER.md`, which rule out different
noncommutative inverse estimates.  The cap-free compression in
`notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md` also does not address this
shift-induced metric rotation.

No zero table, zero reality, global Weil positivity, or stored matrix is
used.  The source prime block retains its minus sign and the inventory
`n<=lambda^2` remains inclusive.  No signed sector floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or determinant limit is proved.  The formal project
state remains `P0_INVALIDATED`.

## 1. A common complete-symbol projector in both parities

Put

\[
 L=2\log\lambda
\]

and retain the source-exact multiplier

\[
 m_\lambda(t)=
 \operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)-\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                       \cos(t\log n).                  \tag{1.1}
\]

For `g>delta>0` and a live shift `U>=0`, define

\[
 v(t)=[g+U-m_\lambda(t)]_+,
 \qquad
 T_v=C_\lambda^*\mathcal F^*M_v\mathcal F C_\lambda. \tag{1.2}
\]

Let

\[
 \Phi_\lambda(U,g)=\int_{\mathbb R}v(t)\,dt,
 \qquad
 \operatorname {tr}T_v={L\over2\pi}\Phi_\lambda(U,g). \tag{1.3}
\]

On the finite even projected complement `K_+`, let

\[
 B_+=P_{K_+}(Q_\lambda-U I)P_{K_+}|_{K_+},
 \qquad
 R_+=P_{K_+}T_vP_{K_+}|_{K_+}.                       \tag{1.4}
\]

On the finite odd sector `K_-=E_N^-`, let `p_{-,N}=P_Np_-`, where
`p_-(x)=sinh(x/2)`, and put

\[
 B_-=(Q_\lambda-U I)|_{K_-},
 \qquad
 R_-=P_{K_-}T_vP_{K_-}+2|p_{-,N}\rangle\langle p_{-,N}|. \tag{1.5}
\]

The exact parity multiplier identity gives

\[
 B_+\succeq gI-R_+,
 \qquad
 B_-\succeq gI-R_-.                                  \tag{1.6}
\]

The positive even pole was retained in the discarded positive part of the
first inequality.  The negative odd pole was retained inside `R_-`; it was
not assigned the even sign.

For the even sector define

\[
 \Pi_+=1_{[g-\delta,\infty)}(R_+),
 \qquad
 \mathcal Y_+=\operatorname {Ran}\Pi_+,
 \qquad
 \mathcal F_+=K_+\ominus\mathcal Y_+.                \tag{1.7}
\]

There are two useful exact odd choices.  The single-projector choice is

\[
 \Pi_-^{\rm tr}=1_{[g-\delta,\infty)}(R_-),
 \qquad
 \mathcal Y_-^{\rm tr}=\operatorname {Ran}\Pi_-^{\rm tr}. \tag{1.8}
\]

The sharper rank choice, already isolated in equations (5.7)--(5.9) of
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md`, is

\[
 \boxed{
 \mathcal Y_-^\sharp
 =\operatorname {Ran}1_{[g-\delta,\infty)}
       (P_{K_-}T_vP_{K_-})
  +\operatorname {span}\{p_{-,N}\},
 \qquad
 \mathcal F_-^\sharp=K_-\ominus\mathcal Y_-^\sharp.} \tag{1.9}
\]

### Theorem 1.1 (common far floor and exact rank cost)

The even space and the sharp odd space have the common far floor

\[
\boxed{
 P_{\mathcal F_+}B_+P_{\mathcal F_+}|_{\mathcal F_+}
 \succeq\delta I,
 \qquad
 P_{\mathcal F_-^\sharp}B_-P_{\mathcal F_-^\sharp}
       |_{\mathcal F_-^\sharp}\succeq\delta I.}       \tag{1.10}
\]

Moreover,

\[
\boxed{
\dim\mathcal Y_+
 \leq {L\Phi_\lambda(U,g)\over2\pi(g-\delta)},}       \tag{1.11}
\]

and

\[
\boxed{
 \dim\mathcal Y_-^\sharp
 \leq {L\Phi_\lambda(U,g)\over2\pi(g-\delta)}+1.}     \tag{1.12}
\]

The single-projector alternative also has the valid trace bound

\[
 \boxed{
 \dim\mathcal Y_-^{\rm tr}
 \leq {L\Phi_\lambda(U,g)/(2\pi)
        +\lambda-\lambda^{-1}-2\log\lambda
       \over g-\delta}.}                               \tag{1.13}
\]

**Proof.**  The spectrum of `R_+` on `mathcal F_+` lies in
`[0,g-delta)`, so (1.6) gives the even part of (1.10).  On
`mathcal F_-^sharp`, the pole term vanishes exactly, while the compression
of `T_v` is at most `(g-delta)I`.  The odd inequality in (1.6) then gives
the odd part of (1.10).  Positivity and the spectral threshold give

\[
 (g-\delta)\dim\mathcal Y_+
 \leq\operatorname {tr}R_+.                            \tag{1.14}
\]

Compression cannot increase the trace of `T_v`, which gives (1.11).
Applying the same trace argument to the multiplier-only odd projector and
then adjoining one pole direction gives (1.12).  For the single-projector
alternative,

\[
 \operatorname {tr}R_-
 \leq {L\over2\pi}\Phi_\lambda(U,g)+2\|p_-\|_2^2.     \tag{1.15}
\]

If `ell=log(lambda)`, direct integration gives

\[
 2\|p_-\|_2^2
 =2(\sinh\ell-\ell)
 =\lambda-\lambda^{-1}-2\log\lambda,                  \tag{1.16}
\]

which proves (1.13).  The finite projection in (1.5) can only decrease this
trace.  \(\square\)

For `g=1`, `delta=1/2`, and the locked absolute phase-volume estimate,
(1.11)--(1.12) give
`dim(Y_+)+dim(Y_-^sharp)=exp(O(lambda))`.  The sharp added odd-pole cost is
one direction.  The trace alternative (1.13) remains useful when one wants
the odd retained space to be a single spectral subspace of `R_-`.

## 2. What a paired coframe statement does and does not add

In this section take `mathcal Y_- = mathcal Y_-^sharp` and
`mathcal F_- = mathcal F_-^sharp`; the trace-projector alternative works by
the same block algebra.

Relative to

\[
 K_\epsilon=\mathcal Y_\epsilon\oplus\mathcal F_\epsilon,
 \qquad
 B_\epsilon=
 \begin{bmatrix}D_\epsilon&\Gamma_\epsilon^*\\
                 \Gamma_\epsilon&H_\epsilon\end{bmatrix},
 \qquad H_\epsilon\succeq\delta I,                    \tag{2.1}
\]

define, for `sigma>=0`,

\[
 \mathsf E_{\epsilon,\sigma}y
 =\left(y,-(H_\epsilon+\sigma I)^{-1}
                   \Gamma_\epsilon y\right),          \tag{2.2}
\]

\[
 \Sigma_{\epsilon,\sigma}
 =D_\epsilon+\sigma I
 -\Gamma_\epsilon^*(H_\epsilon+\sigma I)^{-1}
                         \Gamma_\epsilon.              \tag{2.3}
\]

For any fixed positive source-defined metrics `Delta_epsilon`, put

\[
 \beta_\epsilon^{\rm mv}
 =\inf_{\substack{\sigma\geq0\\y\ne0}}
 {\|\Sigma_{\epsilon,\sigma}y\|
  \over
 \|\Delta_\epsilon\mathsf E_{\epsilon,\sigma}y\|}. \tag{2.4}
\]

If `mathcal Y_epsilon={0}`, assign the value `+infinity` to (2.4).

The same block multiplication as in the separate even and odd exterior
coframe notes gives

\[
 (\beta_\epsilon^{\rm mv})^{-1}
 =\sup_{\sigma\geq0}
 \|\Delta_\epsilon(B_\epsilon+\sigma I)^{-1}
                                      i_\epsilon\|,     \tag{2.5}
\]

At a singular shift the norm in (2.5) has the extended value `+infinity`,
equivalently its limiting value from nonsingular shifts.  Moreover,

\[
 \beta_\epsilon^{\rm mv}>0
 \quad\Longleftrightarrow\quad B_\epsilon\succ0.      \tag{2.6}
\]

Thus the direct-sum constant

\[
 \beta_{\rm pair}^{\rm mv}
 =\min\{\beta_+^{\rm mv},\beta_-^{\rm mv}\}          \tag{2.7}
\]

is positive exactly when both complete shifted sectors are positive.  This
is useful sign bookkeeping, but it is not the quantitative bridge target:
the even graph theorem needs the displayed polynomial lower floor, whereas
the present odd obligation is only strict positivity.  Imposing the same
quantitative floor on the odd member of (2.7) would be a deliberately
stronger hypothesis.  Nor is (2.7) a parity-transfer theorem.  The source
commutator couples `B_+` and `B_-` by a rectangular rank-one displacement;
it does not intertwine the spectral projectors in (1.7), and the exact
three-dimensional source-Cauchy countermodel in
`notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md` already has a positive even
block and a negative odd block while satisfying that displacement.  Hence
the common projector supplies a far-floor and cost reduction only.  A new
signed orientation estimate is still required on both retained Schur
spaces.

## 3. Exact ways to remove the shift supremum

This section applies to either parity.  Let

\[
 B=\begin{bmatrix}D&\Gamma^*\\\Gamma&H\end{bmatrix}\succ0,
 \qquad H\succ0,                                      \tag{3.1}
\]

relative to `K=Y direct-sum F`, and let `Delta>0`.  Define

\[
 \mathsf E_\sigma y=(y,-(H+\sigma I)^{-1}\Gamma y),
 \qquad
 \Sigma_\sigma=D+\sigma I
 -\Gamma^*(H+\sigma I)^{-1}\Gamma.                    \tag{3.2}
\]

The all-shift constant is

\[
 \beta^{-1}
 =\sup_{\sigma\geq0}\|\Delta(B+\sigma I)^{-1}i_Y\|. \tag{3.3}
\]

First, the Schur family itself is monotone:

\[
 \boxed{
 \Sigma_\sigma
 =\Sigma_0+\sigma I
 +\Gamma^*\{H^{-1}-(H+\sigma I)^{-1}\}\Gamma
 \succeq\Sigma_0+\sigma I.}                           \tag{3.4}
\]

Also, for every fixed `y`, spectral calculus for `H` gives

\[
 \|(H+\sigma I)^{-1}\Gamma y\|
 \leq\|H^{-1}\Gamma y\|.                             \tag{3.5}
\]

Consequently the following valid, though generally coarse, endpoint
sufficient bound holds:

\[
 \boxed{
 \beta\geq
 {\lambda_{\min}(\Sigma_0)
  \over
  \|\Delta\|\sqrt{1+\|H^{-1}\Gamma\|^2}}.}           \tag{3.6}
\]

There is a valid two-sided cyclic bound which exposes part of the missing
geometry.  Let
`M_B(Y)` be the smallest reducing subspace for the self-adjoint `B` which
contains `Y`, and let `i_M` denote its inclusion in `K`.

### Theorem 3.1 (cyclic enlargement bound)

If `B>0`, then

\[
 \boxed{
 \|\Delta B^{-1}i_Y\|
 \leq\beta^{-1}
 \leq\|\Delta B^{-1}i_M\|.}                          \tag{3.7}
\]

If `Delta` commutes with `B`, then the left inequality is equality:

\[
 \boxed{
 \beta^{-1}=\|\Delta B^{-1}i_Y\|.}                   \tag{3.8}
\]

**Proof.**  The left inequality in (3.7) is the `sigma=0` member of
(3.3).  Put

\[
 C_\sigma=(I+\sigma B^{-1})^{-1}.                     \tag{3.9}
\]

This is a positive contraction, it preserves `M_B(Y)`, and

\[
 (B+\sigma I)^{-1}=B^{-1}C_\sigma.                    \tag{3.10}
\]

Therefore

\[
 \|\Delta(B+\sigma I)^{-1}i_Y\|
 \leq\|\Delta B^{-1}i_M\|,                           \tag{3.11}
\]

which proves the right inequality.  If `[Delta,B]=0`, then

\[
 (B+\sigma I)^{-1}\Delta^2(B+\sigma I)^{-1}
 =\Delta^2(B+\sigma I)^{-2}                           \tag{3.12}
\]

is nonincreasing in Loewner order.  Compression to `Y` and the operator
norm preserve that order, proving (3.8).  \(\square\)

Thus one may replace the continuum of shifts by one zero-shift inverse on
the complete `B`-cyclic enlargement of the dangerous space.  Replacing that
enlargement by `Y` itself requires a commutation or invariant-subspace
theorem.  The next section shows that positivity and a far floor do not
supply one.

## 4. Exact endpoint-versus-all-shift countermodel

Fix an integer `M>=2`.  On `K=mathbb R^3`, with the orthonormal basis
`e_0,e_1,e_2`, set

\[
 Y=\operatorname {span}\{e_0\},
 \qquad
 F=\operatorname {span}\{e_1,e_2\},                   \tag{4.1}
\]

and define

\[
 B_M=
 \begin{bmatrix}
  M+3&1&2\\
  1&1&0\\
  2&0&2
 \end{bmatrix}
 =\begin{bmatrix}D&\Gamma^*\\\Gamma&H\end{bmatrix},
 \quad
 H=\begin{bmatrix}1&0\\0&2\end{bmatrix},
 \quad
 \Gamma=\begin{bmatrix}1\\2\end{bmatrix}.            \tag{4.2}
\]

The zero-shift Schur complement is exactly

\[
 \Sigma_0=D-\Gamma^*H^{-1}\Gamma=M,                  \tag{4.3}
\]

so `B_M>0`, while the far block has the uniform floor `H>=I`.

This family also obeys the abstract complete-symbol dangerous-projector
inequality.  Take

\[
 g={1\over2},\qquad\delta={1\over4},\qquad
 R={1\over4}|e_0\rangle\langle e_0|,                  \tag{4.4}
\]

and put `T_a=B_M-gI+R`.  The lower `2 by 2` block of `T_a` is
`diag(1/2,3/2)`, and its Schur complement is

\[
 M+{11\over4}-2-{8\over3}=M-{23\over12}>0.           \tag{4.5}
\]

Hence

\[
 T_a\succ0,
 \qquad
 B_M=gI+T_a-R,
 \qquad
 Y=\operatorname {Ran}1_{[g-\delta,\infty)}(R).       \tag{4.6}
\]

The dangerous rank is one and the abstract far-floor proof applies exactly.
No claim is made that this `R` is the compression of the arithmetic Toeplitz
operator in (1.2).

Now put

\[
 \ell={e_1+e_2\over\sqrt2},
 \qquad
 w={e_1-e_2\over\sqrt2},                              \tag{4.7}
\]

and define the positive metric

\[
 \Delta_M=|e_0\rangle\langle e_0|
          +|\ell\rangle\langle\ell|
          +M^2|w\rangle\langle w|.                    \tag{4.8}
\]

This has exactly the declared quotient-plus-identity shape: take the
physical low space `K_L=F`, its metric
`Delta_L=|ell><ell|+M^2|w><w|`, and the identity metric on
`K_L^perp=Y`.  It is also an exact minimum-energy quotient metric: with
`W=I_F` and source form `D_L=Delta_L`, one has

\[
 (W D_L^{-1}W^*)^\dagger=\Delta_L.                    \tag{4.9}
\]

Block inversion at zero gives

\[
 B_M^{-1}e_0={1\over M}(e_0-e_1-e_2),                 \tag{4.10}
\]

and therefore the endpoint weighted inverse is

\[
 \boxed{
 \|\Delta_MB_M^{-1}i_Y\|={\sqrt3\over M}
 \longrightarrow0.}                                  \tag{4.11}
\]

At the single positive shift `sigma=1`, however,

\[
 (B_M+I)^{-1}e_0
 ={1\over M+13/6}
 \left(e_0-{1\over2}e_1-{2\over3}e_2\right).         \tag{4.12}
\]

The high vector in (4.12) has `ell` coefficient
`-7/(6*sqrt(2))` and `w` coefficient `1/(6*sqrt(2))`.
Consequently

\[
 \boxed{
 \|\Delta_M(B_M+I)^{-1}i_Y\|^2
 ={M^4+121\over2(6M+13)^2}.}                          \tag{4.13}
\]

Equations (3.3) and (4.13) imply

\[
 \boxed{
 \beta_M
 \leq {\sqrt2(6M+13)\over\sqrt{M^4+121}}
 \sim {6\sqrt2\over M}
 \longrightarrow0.}                                  \tag{4.14}
\]

In contrast, using only `sigma=0` would assign the reciprocal endpoint
constant

\[
 {1\over\|\Delta_MB_M^{-1}i_Y\|}={M\over\sqrt3}
 \longrightarrow\infty.                              \tag{4.15}
\]

Thus even an improving endpoint inverse, strict positivity of `B_M`, a
uniform far floor, an exact rank-one dangerous projector, and a genuine
quotient metric do not control the all-shift coframe.  The missing datum is
the orientation of the entire shifted harmonic family in the quotient
metric.  The `B_M`-cyclic enlargement in (3.7) is one sufficient way to
control that family, not an equivalent formula for its supremum; Section 6
of `notes/EVEN_QUOTIENT_METRIC_COVARIANCE_AUDIT.md` shows that this upper
bound can itself lose an unbounded factor.  In the present family the shift
rotates a component of size `1/(6*sqrt(2))` into the metric direction with
weight `M^2`.

## 5. Remaining source-specific theorem

The common parity projector proves an honest `exp(O(lambda))` retained cost
and a strict far floor in both sectors.  It does not alter the mathematical
endpoint.  On one common unbounded source schedule one must still prove

\[
 \beta_+^{\rm mv}
 \gg {1\over\sqrt\lambda\operatorname {polylog}(\lambda)},
 \qquad
 \beta_-^{\rm mv}>0,                                  \tag{5.1}
\]

with the actual source-defined projectors, quotient metrics, and signed
weighted-PNT discrepancy.  The even quantitative theorem may be attacked
through the exact cyclic bound (3.7), but this requires control of the full
`B_+`-cyclic expansion of the dangerous space.  A `sigma=0` calculation on
the dangerous space alone is insufficient unless a new commutation or
invariance theorem is proved.
