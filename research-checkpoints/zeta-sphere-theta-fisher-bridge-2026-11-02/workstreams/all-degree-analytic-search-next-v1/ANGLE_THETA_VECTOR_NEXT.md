# Parallel-sum form of the theta angle target

## Scope

This note rewrites the defect-angle inequality in
`OPERATOR_ANGLE_NEXT.md` as one correlated trace inequality involving the
actual complete-theta weights.  The reformulation uses only positivity of the
old signed block and is exact when the derivative Gram is singular.  It also
gives an analytic obstruction to an orbitwise positive proof: an isolated
theta orbit has a negative paid innovation gap at the first even extension
for all sufficiently large orbit parameters.  Thus any successful argument
for the complete theta sum must retain cross-orbit modular compensation.

No estimate below proves the correlated trace inequality, an all-degree
target sign, or RH.

Work on one old fixed-parity polynomial space `P`.  Use

\[
 Xp=2h\,p(D)\psi+p'(D)\psi,
 \qquad Yp=p'(D)\psi,
\]

and suppose the old actual target is positive.  In a coefficient basis put

\[
 G_X=X^*X,\qquad G_Y=Y^*Y,\qquad
 Q=G_X-G_Y>0.                                      \tag{1}
\]

For the new polynomial `p`, retain the notation

\[
 g=A_X-B_Y,
 \qquad r=b_Y-G_YG_X^{-1}b_X                       \tag{2}
\]

from `PAID_SCHUR_NEXT.md`.  In particular, `r in Ran G_Y` and the exact
mismatch payment is

\[
 C_{XY}=r^*(G_Y^\dagger+Q^{-1})r.                  \tag{3}
\]

## Eliminate the angles by a parallel sum

Define the old parallel-sum form

\[
 \boxed{
 H=G_Y:Q
   =G_Y-G_YG_X^{-1}G_Y
   =Q-QG_X^{-1}Q.}                                 \tag{4}
\]

The two expressions in (4) are equal because `G_X=G_Y+Q`.  The form `H` is
positive semidefinite and

\[
 \ker H=\ker G_Y,
 \qquad \operatorname{Ran}H=\operatorname{Ran}G_Y. \tag{5}
\]

The standard parallel-sum inverse identity, read on this range, gives

\[
 \boxed{C_{XY}=r^*H^\dagger r.}                    \tag{6}
\]

This remains valid when the even old space contains the constant polynomial
and `G_Y` is singular.  One direct verification is to choose a
`Q`-orthonormal generalized eigenbasis `e_j` on the quotient by `ker G_Y`:

\[
 G_Y(e_j,e_k)=\kappa_j\delta_{jk},
 \qquad Q(e_j,e_k)=\delta_{jk},
 \qquad \kappa_j>0.                                \tag{7}
\]

Then

\[
 H(e_j,e_k)={\kappa_j\over1+\kappa_j}\delta_{jk},
 \qquad
 C_{XY}=\sum_j {1+\kappa_j\over\kappa_j}
                 |r(e_j)|^2.                       \tag{8}
\]

The relation with the singular angles is

\[
 \kappa_j=\cot^2\theta_j.                          \tag{9}
\]

Thus a near-isometric mode (`theta_j` small, `kappa_j` large) has a large
weight in the `w` coordinates of `OPERATOR_ANGLE_NEXT.md`, but only a weight
approaching one in the signed-moment coordinates `r(e_j)`.  Conversely,
small-`kappa_j` derivative modes are expensive in the latter coordinates.
This is only a coordinate clarification; it supplies no sign.

Equations (2) and (6) show that the exact angle target is equivalent to the
bordered condition

\[
 \boxed{
 \begin{pmatrix}
 H&r\\ r^*&g
 \end{pmatrix}\succeq0.}                           \tag{10}
\]

Since `r in Ran H`, (10) is in turn equivalent to `g>=0` together with the
scalar family

\[
 \boxed{|r(q)|^2\leq g\,H(q,q)\quad(q\in P).}       \tag{11}
\]

This is the correlated trace form of the directional angle inequality.  It
contains the combined vector before any componentwise Cauchy estimate.

The parallel sum also has the exact infimal-convolution formula

\[
 \boxed{
 H(q,q)=\inf_{a+b=q}
 \{Q(a,a)+G_Y(b,b)\}.}                             \tag{12}
\]

The minimizing split is prefix-dependent.  In coordinates it is

\[
 a=G_X^{-1}G_Yq,
 \qquad b=G_X^{-1}Qq,                              \tag{13}
\]

with the order of the two labels interchanged if the two summands in (12)
are interchanged.  Formula (12), rather than a bound using either parent
metric separately, is what preserves the old-angle correlation.

## Undivided complete-theta trace inequality

Use the real-frequency conventions

\[
 P_q(\nu)=q(i\nu),\qquad
 f=\Xi'^2-\Xi\Xi''.
\]

On the old space the two forms in (12) are exactly

\[
 Q(a,a)={2\over\pi}\int_{\mathbb R}
 f(\nu)|P_a(\nu)|^2\,d\nu,                         \tag{14}
\]

\[
 G_Y(b,b)={1\over\pi}\int_{\mathbb R}
 \Xi(\nu)^2|P_b'(\nu)|^2\,d\nu.                   \tag{15}
\]

The first integral need not have pointwise positive density; it is positive
on `P` by the stipulated old-block hypothesis.  If
`R_X=p-q_X` is the positive-`X` regression residual, then

\[
 r(q)={1\over\pi}\int_{\mathbb R}
 \Xi^2P_q'\overline{P_{R_X}'}\,d\nu
 =-{2\over\pi}\int_{\mathbb R}
 fP_q\overline{P_{R_X}}\,d\nu.                    \tag{16}
\]

Combining (11)--(16) produces the source-specific target, with the separate
necessary condition `A_X-B_Y>=0`,

\[
 \boxed{
 \left|{1\over\pi}\int_{\mathbb R}
 \Xi^2P_q'\overline{P_{R_X}'}\,d\nu\right|^2
 \leq (A_X-B_Y)
 \inf_{a+b=q}\left\{
 {2\over\pi}\int_{\mathbb R}f|P_a|^2\,d\nu
 +{1\over\pi}\int_{\mathbb R}\Xi^2|P_b'|^2\,d\nu
 \right\}.}                                       \tag{17}
\]

There is no division by `Xi` in (17), so its domain is unaffected by real or
complex zeros of `Xi`.  Complete-theta decay makes every integral finite.
The equality of the two expressions in (16) is the undivided Galerkin
identity, so the residue, drift, and corrected feature remain assembled.

The generalized angle polynomials in (7) satisfy the finite Galerkin
Sturm--Liouville problem

\[
 \int_{\mathbb R}\Xi^2P_{e_j}'\overline{P_q'}\,d\nu
 =2\kappa_j\int_{\mathbb R}
 fP_{e_j}\overline{P_q}\,d\nu
 \qquad(q\in P).                                   \tag{18}
\]

Thus (17) is a precise arithmetic alignment problem: it asks for the actual
mismatch moments against these complete-theta Galerkin modes to be bounded
in the parallel-sum metric.  Separate Cauchy inequalities in `Q` and `G_Y`
cannot prove (17), because `H<=Q` and `H<=G_Y`; they replace its right-hand
side by a larger parent norm and lose exactly the required correlation.

## An orbitwise positivity obstruction

A tempting continuation is to expand the complete theta source into its
positive orbits and prove the paid inequality for each orbit separately.
This fails analytically before the mismatch term appears.

For an orbit parameter `a>0`, put

\[
 z=ae^{2h},\qquad
 \psi_a(h)=4z(2z-3)e^{h/2-z}
           =e^{h/2-z}(8z^2-12z).                  \tag{19}
\]

The actual positive theta orbits have `a=pi n^2`.  Consider the first even
extension, with old space `P=span{1}` and new polynomial `p(s)=s^2`.  Then

\[
 X1=2h\psi_a,\qquad Y1=0,                          \tag{20}
\]

\[
 Xp=2hD^2\psi_a+2D\psi_a,
 \qquad Yp=2D\psi_a.                               \tag{21}
\]

Here `G_Y=0`, hence `r=C_XY=0`; the paid border is simply

\[
 2S_a=A_X(a)-B_Y(a).                               \tag{22}
\]

The sign in (22) is eventually negative.  To see this without a finite
orbit computation, write

\[
 D^k\psi_a=e^{h/2-z}P_k(z),
 \qquad
 P_{k+1}=(2z\partial_z+\tfrac12-2z)P_k,            \tag{23}
\]

with `P_0=8z^2-12z`.  The leading term is

\[
 P_k(z)=8(-2)^kz^{k+2}+O(z^{k+1}).                 \tag{24}
\]

Set `x=2ah`.  Watson expansion at the boundary `h=0` gives the following
additive leading terms on the Laplace scale:

\[
 X1=e^{-a-x}\{8ax+O((1+x)^3)\},                    \tag{25}
\]

\[
 Xp=e^{-a-x}\{32a^3(x-1)+O(a^2(1+x)^5)\},         \tag{26}
\]

\[
 Yp=e^{-a-x}\{-32a^3+O(a^2(1+x)^4)\}.             \tag{27}
\]

The expansions may be integrated termwise: outside a fixed boundary
neighborhood the factor `exp(-2ae^(2h))` supplies a uniform exponential
majorant; equivalently, the normalized braces in (25)--(27) converge in
the needed polynomially weighted `L^2(e^(-2x)dx)` spaces.  Using

\[
 \int_0^\infty e^{-2x}dx={1\over2},\quad
 \int_0^\infty xe^{-2x}dx={1\over4},\quad
 \int_0^\infty x^2e^{-2x}dx={1\over4},             \tag{28}
\]

one obtains

\[
 \|X1\|^2=8ae^{-2a}(1+O(a^{-1})),                 \tag{29}
\]

\[
 \langle X1,Xp\rangle=O(a^2e^{-2a}),              \tag{30}
\]

because the nominal leading coefficient is proportional to
`int x(x-1)e^(-2x)dx=0`, and

\[
 \|Xp\|^2=128a^5e^{-2a}(1+O(a^{-1})),             \tag{31}
\]

\[
 \|Yp\|^2=256a^5e^{-2a}(1+O(a^{-1})).             \tag{32}
\]

After the `X1` regression,

\[
 A_X(a)=\|Xp\|^2-
 { |\langle X1,Xp\rangle|^2\over\|X1\|^2}
 =128a^5e^{-2a}(1+O(a^{-1})),                      \tag{33}
\]

while `B_Y(a)=||Yp||^2`.  Therefore

\[
 \boxed{
 A_X(a)-B_Y(a)
 =-128a^5e^{-2a}(1+O(a^{-1}))<0}                  \tag{34}
\]

for every sufficiently large `a`.  Since `a=pi n^2` is unbounded, infinitely
many isolated complete-theta orbits fail even the necessary innovation-gap
inequality at this base step.

Equation (34) does not concern the full complete-theta sum.  Norms and
regressions of `sum_n psi_(pi n^2)` contain cross-orbit terms, and modular
reflection couples the entire sum.  Rather, (34) rules out a proof that
diagonalizes by theta orbit and assigns each orbit a nonnegative paid border.
Cross-orbit compensation is not optional; it must already repair the
positive innovation gap before it can control the mismatch vector in (17).

## Resulting target and nonclaims

The exact surviving target is (17), or equivalently the bordered
parallel-sum condition (10).  A viable proof must use the complete theta sum
to control the same combined trace vector in the mixed metric `G_Y:Q`.
Orbitwise positivity, a worst-angle bound, and separate Cauchy estimates are
all structurally inadequate.

- Equations (10)--(18) are equivalences, not a proof of their sign.
- Equation (34) is an isolated-orbit asymptotic, not a counterexample for the
  modular complete-theta profile and not an RH counterexample.
- No finite-degree or finite-zero verification is used to infer an
  all-degree conclusion.
- The argument assumes only positivity of the old actual target block; it
  does not assume the new pivot whose sign is at issue.
