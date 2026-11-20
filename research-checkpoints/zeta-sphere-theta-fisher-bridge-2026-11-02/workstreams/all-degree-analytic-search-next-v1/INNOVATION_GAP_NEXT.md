# The positive-channel innovation gap is still a signed theta inequality

## Scope

`PAID_SCHUR_NEXT.md` gives the exact paid-border decomposition

\[
 2S=A_X-B_Y-C_{XY}.
\]

This note identifies the structure of the necessary gap `A_X-B_Y`. The gap
has an exact regression identity and an undivided Fourier
covariant-derivative form, but it is not generically nonnegative. Explicit
counterexamples satisfy the same half-line differential operator formulas;
one is even, strictly positive, entire and Schwartz and has a nonempty
strictly positive old target block. Therefore a proof of `A_X>=B_Y` must use
complete-theta modular/arithmetic information. Positivity, regularity, decay,
and old strict contractivity are not enough.

No finite degree sweep is used, and no endpoint sign or RH conclusion is
claimed.

## Anti-commutator and commutator channels

Let

\[
 Vp=p(D)\psi,
 \qquad
 Xp=2h\,Vp+V(p'),
 \qquad
 Yp=V(p')
 \tag{1}
\]

in `L2(0,infinity;dh)`. Since

\[
 [p(D),h]=p'(D),
\]

the two channels are exactly

\[
 \boxed{
 Xp=\{h,p(D)\}\psi,
 \qquad
 Yp=[p(D),h]\psi.}
 \tag{2}
\]

Equivalently,

\[
 Xp+Yp=2p(D)(h\psi),
 \qquad
 Xp-Yp=2h\,p(D)\psi.                                \tag{3}
\]

Thus the proposed positive-channel comparison is a quotient-norm comparison
between an anti-commutator and a commutator. It is not a comparison of the
same residual in two positive norms.

There is also an exact real-frequency form for the complete-theta profile.
Use

\[
 W(\nu)=\widehat\psi(\nu)=2\Xi(\nu),
 \qquad P(\nu)=p(i\nu),
\]

and let a dot denote `d/dnu`. Fourier transformation of (1) gives

\[
 \boxed{
 \widehat{Yp}=-i\dot P\,W,
 \qquad
 \widehat{Xp}=i(\dot P\,W+2PW')
 =iW^{-1}\partial_\nu(PW^2).}
 \tag{4}
\]

The last quotient is only notation for the undivided middle expression,
which is regular at zeros of `W`. Because `Xp` and `Yp` have fixed opposite
parity, half-line Plancherel gives

\[
 \|Xp\|^2
 ={1\over4\pi}\int_{\mathbb R}|\dot P\,W+2PW'|^2d\nu,
 \qquad
 \|Yp\|^2
 ={1\over4\pi}\int_{\mathbb R}|\dot P\,W|^2d\nu.    \tag{5}
\]

Integration by parts recovers the signed target exactly:

\[
 {1\over2}(\|Xp\|^2-\|Yp\|^2)
 ={1\over\pi}\int_{\mathbb R}
 (\Xi'^2-\Xi\Xi'')|P|^2d\nu.                        \tag{6}
\]

Therefore `A_X` is a Sobolev Christoffel pivot for the first expression in
(5), whereas `B_Y` is the ordinary derivative-feature pivot for the second.
Equation (6) shows why no pointwise positive-weight comparison is available.

## Exact gap identity for the two regressions

Let `P_old` be the old same-parity polynomial space, and use the regressions
from `PAID_SCHUR_NEXT.md`:

\[
 Xq_X=P_{XP_{\rm old}}Xp,
 \qquad
 Yq_Y=P_{YP_{\rm old}}Yp.
\]

The vector `Yq_Y` is unique, while `q_Y` is chosen modulo
`ker(Y|P_old)`. All formulas involving `Y Delta` or `mathbf r` are invariant
under that choice. In (8), its two displayed terms may change separately,
but their difference is invariant.

Put

\[
 R_X=p-q_X,
 \qquad R_Y=p-q_Y,
 \qquad \Delta=q_Y-q_X,
\]

so `R_X=R_Y+Delta`. The two projection orthogonalities imply

\[
 YR_Y\perp YP_{\rm old},
 \qquad XR_X\perp XP_{\rm old}.
\]

Since `Y Delta` lies in the old `Y` image,

\[
 \|YR_X\|^2=\|YR_Y\|^2+\|Y\Delta\|^2.
\]

Consequently the necessary innovation gap is exactly

\[
 \boxed{
 A_X-B_Y
 =2\mathfrak q(R_X)+\|Y\Delta\|^2,}
 \qquad
 \mathfrak q(r)={1\over2}(\|Xr\|^2-\|Yr\|^2).       \tag{7}
\]

The dual identity from the `X` projection is

\[
 \boxed{
 A_X-B_Y
 =2\mathfrak q(R_Y)-\|X\Delta\|^2.}                 \tag{8}
\]

These formulas expose the remaining sign. The positive disagreement term in
(7) may compensate a negative signed theta value of the `X`-orthogonal
residual, but it does not make the gap automatically nonnegative.

The coordinate formula sharpens this further. Let

\[
 G_X=(\langle Xq_i,Xq_j\rangle),
 \quad G_Y=(\langle Yq_i,Yq_j\rangle),
 \quad Q=G_X-G_Y,
\]

and let the mismatch vector from `PAID_SCHUR_NEXT.md` be

\[
 \mathbf r=G_Y\Delta.
\]

Then `mathbf r` lies in `Ran G_Y` and

\[
 \|Y\Delta\|^2=\mathbf r^*G_Y^\dagger\mathbf r.
 \tag{9}
\]

Since

\[
 C_{XY}=\mathbf r^*(G_Y^\dagger+Q^{-1})\mathbf r,
\]

the Moore--Penrose term cancels between the gap and the mismatch payment:

\[
 \boxed{
 2S=2\mathfrak q(R_X)-\mathbf r^*Q^{-1}\mathbf r.}  \tag{10}
\]

Thus the exact sufficient inequality is equivalently

\[
 \boxed{
 2\mathfrak q(R_X)\geq\mathbf r^*Q^{-1}\mathbf r.}  \tag{11}
\]

Here `Q=2A_old` is positive by the stipulated old signed target. Formula
(11) is noncircular as a finite extension test, but it is still a signed
theta inequality. It does not follow from the two positive channel metrics
alone.

## First even extension and its curvature gap

Take the nonempty old even space `P_old=span{1}` and adjoin the monic
polynomial `p(z)=z^2`. For any nonzero real `C^2` profile with the displayed
integrals finite and the integration-by-parts boundary terms zero,

\[
 X1=2h\psi,
 \quad Y1=0,
 \quad Xp=2(h\psi''+\psi'),
 \quad Yp=2\psi'.                                   \tag{12}
\]

Projecting `Xp` against `X1` gives the exact formula

\[
 \boxed{
 A_X-B_Y=
 4\left(\int_0^\infty h^2\psi''(h)^2dh
        -\int_0^\infty\psi'(h)^2dh\right)
 -{\left(\int_0^\infty\psi(h)^2dh
          -2\int_0^\infty h^2\psi'(h)^2dh\right)^2
   \over \int_0^\infty h^2\psi(h)^2dh}.}            \tag{13}
\]

Thus even the necessary positive-channel comparison is a nontrivial weighted
curvature inequality. Ordinary Hardy control does not imply it.

The elementary half-line profile `psi_a(h)=e^(-a h)` already makes the point.
For `a>0`, exact moments give

\[
 \langle Xp,X1\rangle=0,
 \qquad A_X=a,
 \qquad B_Y=2a,
 \qquad A_X-B_Y=-a.                                 \tag{14}
\]

The old signed target is nevertheless strictly positive:

\[
 \mathfrak q(1)={1\over2}\|X1\|^2={1\over2a^3}>0.  \tag{15}
\]

Here the old `Y` image is zero, so `C_XY=0` and `2S=-a`. This is an exact
counterexample with the actual `h,D` commutator structure and a nonempty
strictly positive old block.

## Exact entire Schwartz counterexample

The corner behavior of the exponential is not responsible. Consider the
even, strictly positive, entire Schwartz profile

\[
 \boxed{
 \psi_G(h)=e^{-h^2}+2e^{-(49/529)h^2}.}              \tag{16}
\]

Put

\[
 B_0={\sqrt\pi\over2\sqrt2}.
\]

Because

\[
 {49\over529}=\left({7\over23}\right)^2,
 \qquad
 {1+(49/529)\over2}=\left({17\over23}\right)^2,
\]

every Gaussian moment in (13) is a rational multiple of `B_0`. Direct exact
moment evaluation gives

\[
 {1\over B_0}\int\psi_G^2={2327\over119},
 \qquad
 {1\over B_0}\int h^2\psi_G^2={257484167\over6740636},
\]

\[
 {1\over B_0}\int\psi_G'^2={354247\over112999},
 \qquad
 {1\over B_0}\int h^2\psi_G'^2={471776901\over39755996},
\]

\[
 {1\over B_0}\int h^2\psi_G''^2
 ={117526469809\over37751157916}.                   \tag{17}
\]

Substitution in (13) yields the exact negative rational value

\[
 \boxed{
 {A_X-B_Y\over B_0}
 =-{1322601686382230942\over2430081362321678993}<0.} \tag{18}
\]

Again `Y1=0` and `X1` is nonzero, so the old target block is strictly
positive. Hence evenness, strict positivity, entire analyticity, Schwartz
decay, and the exact anti-commutator/commutator relation do not prove the gap.

## Consequence for the analytic campaign

The necessary comparison `A_X>=B_Y` is not a generic consequence of:

- the exact differential definitions of `X` and `Y`;
- a nonempty strictly positive old target block;
- evenness, positivity, entire analyticity, or Schwartz decay of the profile;
  or
- separate Christoffel positivity in the two channel metrics.

For the actual complete-theta profile, the honest reduced targets are (7) and
(11). A successful proof must show that the signed theta energy of the
`X`-orthogonal residual is positive enough to pay the old-target mismatch.
The Fourier formula (4) and curvature identity (13) indicate where modular
or arithmetic information must enter. Replacing either channel by a generic
Hardy, Cauchy, or positive-parent estimate cannot prove the required gap.

## Nonclaims

- The counterexamples are not the complete-theta profile and do not refute an
  actual certified rung.
- They do not imply failure of the actual paid-Schur inequality.
- Formula (11) is an exact reduction, not an all-degree bound.
- Nothing here proves or disproves endpoint positivity or RH.
