# Zero-safe factorization of the theta Galerkin operator

## Scope

`MISMATCH_THETA_FORMULA.md` derives the undivided real-frequency Galerkin
expression

\[
 \mathcal L U=-(\Xi^2U')'
 +2(\Xi'^2-\Xi\Xi'')U.                              \tag{1}
\]

This note gives a global first-order factorization of (1) which never
divides by `Xi`.  It shows that the Galerkin equation is the positive normal
equation for the `X`-channel regression.  It does **not** factor the signed
target: that target remains the difference of two positive first-order
forms.  Consequently the factorization makes the exact contractive-extension
gate transparent but does not prove its missing theta-specific inequality.

All formulas below are valid on polynomial frequency factors.  They also
hold for entire trial factors of sufficiently small exponential type whenever
the displayed integrals and boundary limits converge.  No finite-degree
evidence or RH conclusion is used.

## The two zero-safe first-order channels

Write

\[
 x(\nu)=\Xi(\nu),\qquad f=x'^2-xx'',
\]

and define, without any quotient by `x`,

\[
 \boxed{
 \mathcal A U=xU',\qquad
 \mathcal B U=xU'+2x'U.}                            \tag{2}
\]

For a polynomial `p`, put `P(\nu)=p(i\nu)`.  In the nonunitary Fourier
convention of the workstream, `widehat(psi)=2Xi`, and direct transformation
of

\[
 Xp=2h\,p(D)\psi+p'(D)\psi,
 \qquad Yp=p'(D)\psi
\]

gives

\[
 \boxed{
 \widehat{Xp}=2i\,\mathcal BP,
 \qquad
 \widehat{Yp}=-2i\,\mathcal AP.}                   \tag{3}
\]

Both physical-space functions have fixed parity, so half-line Plancherel
therefore gives the exact channel metrics

\[
 \boxed{
 \|Xp\|_{L^2(0,\infty)}^2={1\over\pi}\|\mathcal BP\|_{L^2(\mathbb R)}^2,
 \qquad
 \|Yp\|_{L^2(0,\infty)}^2={1\over\pi}\|\mathcal AP\|_{L^2(\mathbb R)}^2.}
                                                                    \tag{4}
\]

In particular, the actual signed form is

\[
 \boxed{
 \mathfrak q(p)
 ={1\over2\pi}
 \{\|\mathcal BP\|^2-\|\mathcal AP\|^2\}
 ={1\over\pi}\int_{\mathbb R}f(\nu)|P(\nu)|^2d\nu.}               \tag{5}
\]

Thus a positive factorization of the `B` metric alone cannot establish the
sign in (5).

## Global factorization of the undivided operator

On compactly supported smooth functions the formal adjoints are

\[
 \mathcal A^*=-x\partial_\nu-x',
 \qquad
 \mathcal B^*=-x\partial_\nu+x'.                  \tag{6}
\]

Expansion, with no division by `x`, gives

\[
 \mathcal A^*\mathcal A U=-(x^2U')',               \tag{7}
\]

and

\[
\begin{aligned}
 \mathcal B^*\mathcal B U
 &=(-x\partial_\nu+x')(xU'+2x'U)\\
 &=-(x^2U')'+2(x'^2-xx'')U.
\end{aligned}                                      \tag{8}
\]

Consequently

\[
 \boxed{
 \mathcal L=\mathcal B^*\mathcal B,
 \qquad
 2f=\mathcal B^*\mathcal B-\mathcal A^*\mathcal A}                \tag{9}
\]

as differential expressions.  The corresponding division-free polarized
form identity is

\[
 \boxed{
 \int_{\mathbb R}\overline V\,\mathcal LU\,d\nu
 =\int_{\mathbb R}\overline{\mathcal BV}\,\mathcal BU\,d\nu}       \tag{10}
\]

for polynomial `U,V`.  Indeed, integration of the two cross terms in
`overline(BV) BU` gives

\[
 2\int xx'(\overline VU)'d\nu
 =-2\int(x'^2+xx'')\overline VU\,d\nu,
\]

leaving the potential `2(x'^2-xx'')`.  The boundary term vanishes because
`Xi` and its derivatives decay exponentially against polynomial factors.
There are no internal boundary terms: `x`, `x'`, `U`, and `V` are entire on
the real line, including at every real zero of `Xi`.

Equation (10) makes `L` a positive quadratic form on the polynomial trial
space.  If one instead starts from `C_c^infinity(R)`, the closable operator
`B` supplies the usual positive self-adjoint realization
`overline(B)^* overline(B)`.  These are
two compatible statements; polynomials themselves need not lie in unweighted
`L2(R)`, while their `B` images do.

The factor in (8) is unique among scalar first-order factors with leading
coefficient `x` and a real constant lower coefficient.  For real `a`, put

\[
 \mathcal C_a=x\partial_\nu+a x'
\]

one has, for every test function `U`,

\[
 \mathcal C_a^*\mathcal C_a U
 =-(x^2U')'
 +\{a(a-1)x'^2-a xx''\}U.                         \tag{11}
\]

Matching the potential in (1) forces `a=2`.  Hence (8) is not an arbitrary
completion of squares.

## What happens at zeros of `Xi`

Away from zeros one may write

\[
 \mathcal BU=x^{-1}(x^2U)',                         \tag{12}
\]

and (8) becomes the previously recorded local expression

\[
 \mathcal LU=-x^2\partial_\nu
 \{x^{-2}\partial_\nu(x^2U)\}.                    \tag{13}
\]

Formula (12) is not the definition of `B`: its right side presents a
removable cancellation only after it is reassembled as (2).  Formula (13)
has genuinely singular divided coefficients at zeros of `Xi` and is not a
safe global operator formula on an arbitrary domain.

There is nevertheless a global **quadratic-form** reading of (13) on the
constrained polynomial/entire trial space.  Split the real line into the
components between real zeros of `x` and integrate (13) by parts on each
component.  If a zero `rho` has multiplicity `m>=1` and `U` vanishes there
to order `k>=0`, then

\[
 {|(x^2U)'|^2\over x^2}
 =O(|\nu-\rho|^{2m+2k-2}),                         \tag{13a}
\]

which is locally integrable and has a finite limit at a simple zero when
`k=0`.  The interval boundary flux `overline(U)(x^2U)'` is
`O(|nu-rho|^(2m+2k-1))` and therefore vanishes.  Consequently

\[
 \boxed{
 \int_{\mathbb R}\overline U\,\mathcal LU\,d\nu
 =\int_{\mathbb R}{|(x^2U)'|^2\over x^2}d\nu
 =\int_{\mathbb R}|\mathcal BU|^2d\nu.}           \tag{13b}
\]

This is a legitimate zero-crossing identity for the actual analytic trial
vectors, despite the fact that the divided differential expression is not a
safe operator on a general domain.  It is exactly the nonnegative `B`
metric, so it supplies no additional estimate for the signed pivot.

The local zero mode of `B` is `U=c x^{-2}`.  It is singular at every real
zero of `Xi`; it is neither a polynomial nor a global positive ground state.
Thus a conventional ground-state transform through `x^{-2}` does not cross
the zeros.  The undivided factorization (8), by contrast, remains regular
there.  It also shows directly that the `B` Gram on polynomials is positive
definite: if `BU=0`, then `x^2U` is constant between zeros, and polynomial
regularity across a zero forces that constant, and hence `U`, to vanish.

## The Galerkin equation is exactly the `X` normal equation

Let `P_old` be one fixed-parity old polynomial prefix, let `p` be the new
polynomial, and let

\[
 R_X=p-q_X,
 \qquad Xq_X=P_{XP_{old}}Xp.
\]

Writing `U=P_(R_X)` and `V=P_q` for `q in P_old`, (3)--(4) turn the defining
regression orthogonality into

\[
 0=\langle Xq,XR_X\rangle
 ={1\over\pi}\langle\mathcal BV,\mathcal BU\rangle.                \tag{14}
\]

Using (10), this is precisely

\[
 \boxed{
 \int_{\mathbb R}\overline{P_q(\nu)}
 \mathcal L P_{R_X}(\nu)d\nu=0
 \qquad(q\in P_{old}).}                            \tag{15}
\]

Thus the undivided Galerkin equation is a positive normal equation, but for
the positive `X` metric.  Its solution is the monic `B`-orthogonal residual.
This explains the positivity of `L` without supplying the missing sign of
the actual target.

## The exact contractive-extension gate survives

On an old prefix whose actual target is positive, the map

\[
 T:\mathcal B P_q\longmapsto\mathcal A P_q
 \qquad(q\in P_{old})                               \tag{16}
\]

is a strict contraction by (5).  Extending the target by `p` asks whether
this contraction extends to the additional `B` direction while sending it
to the prescribed `A` direction.  That is exactly the paid-Schur problem,
not a consequence of `L=B^*B`.

Equation (16) uses separate unitary Fourier-coordinate identifications of
the two physical channels: the harmless scalar signs in
`widehat(Xp)=2i BP` and `widehat(Yp)=-2i AP` are absorbed into those
identifications.

For the `B`-orthogonal residual `U=P_(R_X)`, the mismatch covector is

\[
 \boxed{
 r(q)={1\over\pi}
 \langle\mathcal A P_q,\mathcal AU\rangle.}         \tag{17}
\]

Together with (5), the exact extension condition remains

\[
 \boxed{
 2S={1\over\pi}
 \{\|\mathcal BU\|^2-\|\mathcal AU\|^2\}
 -r^*Q^{-1}r\ \geq 0,}                             \tag{18}
\]

where `Q=G_X-G_Y` is twice the old signed-target Gram.  The first term in
(18) is signed, and the second is the nonnegative old-target feedback cost.
Positivity of `B^*B` controls only `||BU||^2`; it does not control either
`||AU||^2` or the correlated inverse payment.

There is also an exact weighted-Hardy reading.  Away from the zero set, (12)
turns the first difference in (18) into

\[
 \int_{\mathbb R}{|(x^2U)'|^2\over x^2}d\nu
 -\int_{\mathbb R}x^2|U'|^2d\nu,                  \tag{19}
\]

with (2), rather than the quotient, defining the integrand through zeros.
Demanding the nonnegativity of (19) for every polynomial is exactly the
all-polynomial target sign in (5).  It is not an independent Hardy theorem
available from the `B` square.

The obstruction is concrete.  The even, positive, entire Schwartz profile
in `INNOVATION_GAP_NEXT.md` satisfies the same differential definitions and
the same factorization (8), has a strictly positive old block
`P_old=span{1}`, yet at the first even extension obeys

\[
 {A_X-B_Y\over B_0}
 =-{1322601686382230942\over2430081362321678993}<0.                \tag{20}
\]

In that example the mismatch channel vanishes, so even the necessary part of
(18) fails although `L=B^*B` is positive.  Therefore the factorization,
regularity, parity, entire analyticity, Schwartz decay, and old strict
contractivity do not yield a source-free contractive-extension theorem.
The missing input must distinguish the complete-theta profile from this
countermodel and must control the combined expression in (18).

## Consequence for the next analytic step

The useful output of the Galerkin route is the exact zero-safe pair

\[
 \mathcal A=x\partial_\nu,
 \qquad \mathcal B=x\partial_\nu+2x',              \tag{21}
\]

not a positive factorization of the target.  A noncircular continuation must
use complete-theta modular or orbit arithmetic to prove the directional
contractive-extension inequality for the actual `B`-orthogonal residual and
its correlated mismatch.  Equivalently, it must prove (18) on the graded
theta vector without replacing `Q^{-1}` by a separate generic Cauchy bound.

## Nonclaims

- The factorization `L=B^*B` does not prove `f>=0`, the paid-Schur border,
  an all-degree target sign, or RH.
- The Gaussian-mixture example is not the complete-theta profile and is not
  a counterexample to an actual certified theta rung.
- The local ground state `Xi^-2` is not used as a global domain element.
- No division by `Xi`, `zeta`, or the signed endpoint density occurs in the
  zero-safe formulas (2), (8), (10), and (18).
