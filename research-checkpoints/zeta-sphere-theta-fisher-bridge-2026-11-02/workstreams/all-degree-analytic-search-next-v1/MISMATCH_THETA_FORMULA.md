# Complete-theta formula for the paid-Schur regression mismatch

## Scope

This note resolves the mismatch vector `r` in `PAID_SCHUR_NEXT.md` into
complete-theta, modular-reflection, and undivided real-frequency formulas.
It also identifies the exact Galerkin equation satisfied by the positive
`X`-channel regression residual.  The formulas preserve the corrected
feature, residue, and residue-drift cancellation; they do not prove the
remaining paid-Schur inequality, an all-degree target sign, or RH.  In
particular, the final Schur collapse below is a tautological re-expression of
the signed target pivot, not progress toward its sign.

Work on one finite fixed-parity polynomial prefix `P`.  Suppose its actual
target form

\[
 \mathfrak q(a,b)=\frac12\{
 \langle Xa,Xb\rangle-\langle Ya,Yb\rangle\}
 \tag{1}
\]

is positive definite, where

\[
 Xa=2h\,a(D)\psi+a'(D)\psi,
 \qquad Ya=a'(D)\psi.                                \tag{2}
\]

For the new polynomial `p`, let `q_X in P` and `q_Y in P` be the old
regressions determined by

\[
 Xq_X=P_{XP}Xp,
 \qquad Yq_Y=P_{YP}Yp,                               \tag{3}
\]

where only `Yq_Y` is unique if `Y` has a kernel.  Put

\[
 R_X=p-q_X.                                          \tag{4}
\]

## The mismatch is one assembled theta moment

For every `q in P`, the mismatch covector is exactly

\[
 \boxed{
 r(q)=\langle Yq,YR_X\rangle_{L^2(0,\infty)}.}
 \tag{5}
\]

In a basis `q_i` this is the column

\[
 r=b_Y-G_YG_X^{-1}b_X                               \tag{6}
\]

from `PAID_SCHUR_NEXT.md`.  Formula (5) is already a complete-theta formula:
with

\[
 F_a=a(D)\psi=\Psi_a-e(a)\chi,
 \qquad d(a)=e(a'),
\]

it is

\[
 \boxed{
 r(q)=\int_0^\infty
 [\Psi_{q'}-d(q)\chi]
 \overline{[\Psi_{R_X'}-d(R_X)\chi]}\,dh.}
 \tag{7}
\]

The brackets in (7) must remain assembled.  Expanding them and estimating
the raw feature, residue, and drift pieces separately changes the regression
mismatch and loses the cancellation that the paid-Schur identity retains.

### Modular-reflection form

Let the parity of `p`, `q`, and `R_X` be `epsilon in {+1,-1}`, put
`eta=-epsilon`, and define

\[
 G_a=\Psi_{a'},
 \qquad D_\eta(h)=\chi(-h)-\eta\chi(h),
\]

\[
 \Delta_a(h)=
 \chi(-h)G_a(h)-\chi(h)G_a(-h).                     \tag{8}
\]

The exact reflection identity in `M0_THETA_ORBIT_REFLECTION.md` gives

\[
 F_{a'}(h)=\frac{\Delta_a(h)}{D_\eta(h)}.            \tag{9}
\]

Here `D_(-1)=q` for the even polynomial ladder and `D_(+1)=2q'` for the odd
ladder.  Therefore

\[
 \boxed{
 r(q)=\int_0^\infty
 \frac{\Delta_q(h)\overline{\Delta_{R_X}(h)}}
      {D_\eta(h)^2}\,dh.}
 \tag{10}
\]

The quotient in the odd ladder is read by its removable center limit.  For
domain arguments, (7) is the division-free version of (10).  Both formulas
use all positive theta orbits and the exact modular reflection; neither is a
first-orbit approximation.

## Two regression identities for `r`

The defining `X`-orthogonality of `R_X` gives, for every `q in P`,

\[
 0=\langle Xq,XR_X\rangle
  =\langle Yq,YR_X\rangle+2\mathfrak q(q,R_X).
\]

Consequently

\[
 \boxed{r(q)=-2\mathfrak q(q,R_X).}                 \tag{11}
\]

This sign is important.  It shows that the same vector is positive-channel
derivative data in (5) and a signed old-target moment in (11).

Let `q_A in P` be the actual-target regression,

\[
 \mathfrak q(q,q_A)=\mathfrak q(q,p)
 \qquad(q\in P).                                    \tag{12}
\]

Choose a coefficient basis and write `alpha_X`, `alpha_Y`, and `alpha_A` for
the three regressions.  With

\[
 G_X=(\langle Xq_i,Xq_j\rangle),\quad
 G_Y=(\langle Yq_i,Yq_j\rangle),\quad
 Q=G_X-G_Y=2A_{\rm old},                            \tag{13}
\]

equations (5) and (11) give the exact coefficient identities

\[
 \boxed{
 r=G_Y(\alpha_Y-\alpha_X)
  =Q(\alpha_X-\alpha_A).}                           \tag{14}
\]

The first equality is independent of the representative of `alpha_Y` modulo
`ker G_Y`.  The second uses only the stipulated positive old actual target.
It follows that the mismatch payment is the sum of two regression distances:

\[
 \boxed{
 r^*(G_Y^\dagger+Q^{-1})r
 =\|Y(q_Y-q_X)\|^2
  +2\mathfrak q(q_X-q_A,q_X-q_A).}                  \tag{15}
\]

Thus `G_Y^dagger` measures disagreement between the positive `Y` and `X`
fits, while `Q^-1` measures disagreement between the positive `X` fit and the
signed actual-target fit.  Formula (15) is nonnegative and domain-safe because
`r in Ran G_Y` and `Q>0`.

## Undivided real-frequency formula

Use

\[
 \widehat\psi(\nu)=2\Xi(\nu),
 \qquad f(\nu)=\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu),
\]

and write `P_a(nu)=a(i nu)`.  Since `Ya` has the parity opposite to `a`, its
half-line inner product is one half of the full-line inner product.  Plancherel
therefore turns (5) into

\[
 \boxed{
 r(q)=\frac1\pi\int_{\mathbb R}
 \Xi(\nu)^2 P_q'(\nu)
 \overline{P_{R_X}'(\nu)}\,d\nu,}                  \tag{16}
\]

where primes in (16) denote `nu` derivatives.  The spectral formula for the
actual target and (11) give the simultaneous identity

\[
 \boxed{
 r(q)=-\frac2\pi\int_{\mathbb R}
 f(\nu)P_q(\nu)\overline{P_{R_X}(\nu)}\,d\nu.}     \tag{17}
\]

Equating (16) and (17) keeps both densities undivided and is valid without
forming `Xi'/Xi`.

## A theta Galerkin equation

The complete-theta decay kills the boundary term in frequency integration by
parts: `Xi(nu)^2 P_q(nu) overline(P_(R_X)'(nu))` tends to zero at both ends,
because the Xi factor and its derivatives decay exponentially while the two
polynomial factors grow only algebraically.  Equations (16)--(17) imply that
for every old polynomial `q`,

\[
 \int_{\mathbb R}P_q(\nu)
 \overline{\mathcal L P_{R_X}(\nu)}\,d\nu=0,        \tag{18}
\]

where the entire, undivided Sturm--Liouville expression is

\[
 \boxed{
 \mathcal L U
 =-\{\Xi^2U'\}'+2(\Xi'^2-\Xi\Xi'')U.}             \tag{19}
\]

Away from zeros of `Xi`, if `ell=Xi'/Xi`, then `f=-Xi^2 ell'` and

\[
 \mathcal L U
 =-\Xi^2\partial_\nu
   \left[\Xi^{-2}\partial_\nu(\Xi^2U)\right].       \tag{20}
\]

Equation (20) is only a local factorization: its divided coefficients have
poles at Xi zeros.  The global Galerkin target is (18)--(19).  This is a
source-specific characterization of the `X`-regression residual, not a
positivity statement for `mathcal L`.

## What the paid-Schur inequality becomes

The `Y`-residual has the orthogonal decomposition

\[
 YR_X=Y(p-q_Y)+Y(q_Y-q_X),
\]

and hence

\[
 \|YR_X\|^2=B_Y+r^*G_Y^\dagger r.                  \tag{21}
\]

Since `A_X=||XR_X||^2`, equations (1), (15), and (21) reduce the exact
two-regression identity to

\[
\begin{aligned}
 2S
 &=A_X-B_Y-r^*(G_Y^\dagger+Q^{-1})r\\
 &=2\mathfrak q[R_X]-r^*Q^{-1}r\\
 &=2\mathfrak q[p-q_A].                             \tag{22}
\end{aligned}
\]

The last line is the actual-target Schur pivot.  This equality is tautological
as a sign target: the new theta formulas identify the mismatch completely,
but they do not make the pivot positive.  They instead expose the remaining
obstruction.  Bounding the `Q^-1` term by generic Cauchy is exactly the signed
target projection already present in the unknown pivot; it is not an
independent positive-parent cost.

A noncircular continuation must use (7), (10), or the undivided Galerkin
equation (18)--(19) to prove the directional sign of the actual residual in
(22).  Replacing `Q` by `G_X` or `G_Y`, or estimating the residue and drift
pieces of (7) separately, changes the theorem.

## Nonclaims

- The identities do not prove `S>=0`, `f>=0`, an all-degree endpoint sign, or
  RH.
- Equation (22) is an exact collapse of the mismatch geometry, not a shortcut
  around the signed target Schur pivot.
- The local divided factorization (20) supplies no global positive operator;
  only the undivided equation (19) is valid through Xi zeros.
- No finite-degree replay or new numerical evidence is used.
