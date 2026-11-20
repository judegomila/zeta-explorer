# Positive origin limits for the next theta sources

Research continuation, 11 November 2026. This component proves the
spatial-origin source gate for every pair of anchors in \((0,100]\),
including equal anchors. The proof uses a one-variable comparison and
rigorous interval arithmetic. The completed [infinite-anchor companion](theta_third_source_origin_tail_20261111.md)
extends the same one-variable signs to all positive anchors; Section 5
below states the resulting all-anchor theorem.

The origin gate alone does not prove that either source is positive
for every positive spatial point. Third full preservation and six-node
Pick positivity still require that global spatial step.

## 1. The exact origin comparison

Let \(u=t^2\), \(v=a^2\), and use

\[
N(a,t)=n_a(t)/\kappa(t),\quad
H=C/\kappa,\quad B=4C''/\kappa.
\]

The positive functions from the companion mixed-derivative criterion
have the form

\[
f_H=u\Phi_H(a,u),\qquad
\Phi_H=4\left(\frac{H_{uu}}{H_u}N_u-N_{uu}\right),
\]

\[
f_P=u\Phi_P(a,u),\qquad
\Phi_P=4\left(N_{uu}-\frac{B_{uu}}{B_u}N_u\right).
\tag{1}
\]

Put

\[
F_j(v)=\Phi_j(a,0),\qquad G_j(v)=\Phi_{j,u}(a,0),
\qquad \Omega_j=F_jG_j'-F_j'G_j,
\tag{2}
\]

where the prime in (2) is an anchor derivative with respect to \(v\).
If \(F_j>0\), then

\[
\left(\frac{G_j}{F_j}\right)'=\frac{\Omega_j}{F_j^2}.
\tag{3}
\]

Thus \(F_H,F_P,\Omega_H,\Omega_P>0\) on an anchor interval imply the
two ordered origin determinants are positive at every pair of anchors
in that interval. This is an exact one-variable condition, not a grid
of two-anchor tests.

For clarity, if \(c>a\), \(p=L(a)\), \(q=L(c)\),
\(D=cq-ap\), \(r=(cp-aq)/D\), and
\(n_2=p(n_a-n_c)/D\), the exact source limits are

\[
\lim_{t\downarrow0}\frac{W_{H,2}(a,c,t)}{t^6}
=\frac{-4rp^2\kappa(0)^4H_u(0)}{acD\,n_2(0)^4}
\left[F_H(a^2)G_H(c^2)-G_H(a^2)F_H(c^2)\right],
\tag{4}
\]

\[
\lim_{t\downarrow0}\frac{W_{P,2}(a,c,t)}{t^6}
=\frac{4r^2p^2\kappa(0)^4B_u(0)}{D\,n_2(0)^4}
\left[F_P(a^2)G_P(c^2)-G_P(a^2)F_P(c^2)\right].
\tag{5}
\]

All prefactors are positive because \(H_u(0)<0\), \(B_u(0)>0\).
For equal anchors the corresponding derivative is
\(2a\Omega_j(a^2)\); the same formulas have their positive canceled
limits. The strict determinant signs therefore include coalescence.

## 2. Origin jets use only one unknown scalar function

Write

\[
N=N(a,0),\quad d=1+aL(a),\quad
c_\theta=-\kappa''(0)/\kappa(0),\quad
\beta=\kappa^{(4)}(0)/\kappa(0),\quad
\gamma=\kappa^{(6)}(0)/\kappa(0),\quad h=C(0)/\kappa(0).
\]

Set \(K_1=-c_\theta/2\), \(K_2=\beta/12\),
\(K_3=\gamma/120\). The normalized first-numerator even jets are

\[
n_1=\frac{vN-d}{8},\qquad
n_2=\frac{v(vN-d)+4c_\theta(d+2)}{192},
\]

\[
n_3=\frac{v\{v(vN-d)+4c_\theta(d+2)\}-16\beta(d+4)}{7680}.
\tag{6}
\]

Here \(n_j=\partial_u^j n_a(0)/\kappa(0)\), not the second
canonical numerator. The ratio jets are

\[
U_1=n_1-K_1N,\quad
U_2=n_2-2K_1U_1-K_2N,\quad
U_3=n_3-3K_1U_2-3K_2U_1-K_3N.
\tag{7}
\]

They equal \(N_u,N_{uu},N_{uuu}\) at the spatial origin.
With \(H_j=\partial_u^jH(0)\) and \(B_j=\partial_u^jB(0)\),

\[
H_1=-1/8-K_1h,\quad H_2=-K_1/8-2K_1H_1-K_2h,
\]

\[
H_3=-K_2/8-3K_1H_2-3K_2H_1-K_3h,
\]

\[
B_1=-2K_1,\quad B_2=-4(K_2-K_1^2),\quad
B_3=-6(K_3-3K_1K_2+2K_1^3).
\tag{8}
\]

The four quantities in (2), before the anchor differentiation, are
therefore affine in \(N,d\). For numerical evaluation we clear the
constant positive factors \(H_1^2,B_1^2\):

\[
\widehat F_H=H_1^2F_H=4(H_2H_1U_1-H_1^2U_2),
\]

\[
\widehat G_H=H_1^2G_H
=4[(H_3H_1-H_2^2)U_1+H_2H_1U_2-H_1^2U_3],
\]

\[
\widehat F_P=B_1^2F_P=4(B_1^2U_2-B_2B_1U_1),
\]

\[
\widehat G_P=B_1^2G_P
=4[B_1^2U_3-B_2B_1U_2-(B_3B_1-B_2^2)U_1].
\tag{9}
\]

Their anchor Wronskians are multiplied by \(H_1^4\) or \(B_1^4\).
No sign is altered.

## 3. Exact small-anchor deflation

At \(a=0\), the first numerator is \(C\), so \(N(0,t)=H(t)\).
Consequently both \(F_H\) and \(G_H\) vanish at \(v=0\). Write

\[
F_H=v\overline F_H,\qquad G_H=v\overline G_H.
\]

The determinant has exactly the algebraic deflation

\[
\Omega_H=v^2
\left(\overline F_H\overline G_H'
-\overline F_H'\overline G_H\right).
\tag{10}
\]

The certificate encloses the deflated functions directly, including
the zero-anchor endpoint. It never divides an uncertain constant by
an interval containing zero.

To implement (10), use the fresh positive moment models from PR #53:
\(A=200\), \(x=(a/A)^2\), \(K=2\kappa(0)A\),

\[
N=\frac{eo+2x(eo'-e'o)}{Ke},\qquad d=\frac{e+2xe'}e,
\qquad h=\frac{o(0)}K.
\tag{11}
\]

If a cleared affine expression in (9) is
\(A_0(v)N+B_0(v)d+C_0(v)\), the exact vanishing gives the polynomial

\[
Z_0(v)=\frac{A_0(v)h+B_0(v)+C_0(v)}v.
\]

Set \(o_*=(o-o(0))/x\) and
\(V=eo_*+2(eo'-e'o)\). Its deflated numerator is

\[
\frac{\widehat F_H}{v}
=\frac{A_0V+2KB_0e'+A^2KeZ_0}{A^2Ke},
\tag{12}
\]

and the same formula applies to \(\widehat G_H/v\).
All coefficient polynomials in (12) are evaluated at \(v=A^2x\).

The derivative model is formed from actual derivative enclosures
\(e',e'',o',o'',o_*'\). In particular it is not obtained by
differentiating an artificial interval remainder added to a constant
polynomial coefficient. The exact derivative of
\(V\) is

\[
V'=e'o_*+eo_*'+2(eo''-e''o).
\tag{13}
\]

The two common-denominator derivative terms cancel from each
two-by-two determinant. The resulting cleared polynomials have
degrees 1202 and 1204 for the H and P tests.

## 4. Certificate and quantitative margins

The default executable recomputes all 602 positive moment coefficients
through degree 300 and their full theta and spatial tails. It uses
the same rigorous integration and positive-series remainder method
as PR #53. The additional shifted odd-series tails obey

\[
|\operatorname{err}(o_*)|
\le\frac{E(A)(1/4)^{300}}{1-1/4}<1.372\cdot10^{-70},
\]

\[
|\operatorname{err}(o_*')|
\le\frac{300E(A)(1/4)^{299}}{1-(1/4)(301/300)}
<1.648\cdot10^{-67}.
\tag{14}
\]

At 384-bit precision, 4096 entire interval cells covering
\(0\le x\le1/4\) prove

| Quantity | Verified uniform lower bound |
| --- | ---: |
| \(F_H/a^2\) | \(1.38\cdot10^{-7}\) |
| \(F_P\) | \(4.05\cdot10^{-4}\) |
| \(\Omega_H/a^4\) | \(1.49\cdot10^{-19}\) |
| \(\Omega_P\) | \(1.37\cdot10^{-12}\) |

The executable checks each sign with rigorous ball bounds over the
whole cell. Seventeen exact identities separately check the origin
jets, affine forms, deflations, and determinant scaling.

**Compact source-origin theorem.** For every pair \(a,c\in(0,100]\),
including \(a=c\),

\[
\boxed{
\lim_{t\downarrow0}W_{H,2}(a,c,t)/t^6>0,\qquad
\lim_{t\downarrow0}W_{P,2}(a,c,t)/t^6>0.}
\tag{15}
\]

This follows from the four inequalities, (3), and the exact source
limits (4)–(5). Pairs on opposite sides of an eventual compact/tail
split must be handled by proving the one-variable inequalities on
the connected full anchor axis and integrating (3); a compact-pair
theorem and a disjoint tail-pair theorem alone would leave those
mixed pairs uncovered.

The certificate is computationally rigorous under the stated prior
theta bounds and the ball-arithmetic implementation. It is not a
formal proof-assistant artifact or an external peer-review claim.

## 5. The completed all-anchor origin gate

The infinite-anchor companion proves \(F_H,F_P,\Omega_H,\Omega_P>0\)
for every \(a\ge100\). It uses a newly certified global fourteenth
theta derivative bound, a degree-twelve canceled Laplace expansion,
and a polynomial interval certificate over the entire infinite anchor
range after the change of variable \(T=100/a\).

The tail calculations clear the constant factors in (9) and use an
anchor derivative in \(a\). Their determinant signs match (2)
exactly because

\[
\widehat\Omega_H=2aH_1^4\Omega_H,\qquad
\widehat\Omega_P=2aB_1^4\Omega_P.
\tag{16}
\]

Combining that result with the compact certificate proves the strict
four signs on the connected full anchor axis \(a>0\). Equation (3)
can therefore be integrated between any two anchors, including a
pair straddling 100. Equations (4)–(5) and their coalescent limits give:

**All-anchor source-origin theorem.** For every \(a,c>0\),

\[
\boxed{
\lim_{t\downarrow0}W_{H,2}(a,c,t)/t^6>0,\qquad
\lim_{t\downarrow0}W_{P,2}(a,c,t)/t^6>0.}
\tag{17}
\]

For each fixed anchor pair, continuity consequently gives a positive
spatial neighborhood on which both actual next sources are positive.
No common neighborhood independent of the anchor pair is claimed.
Proving the two source signs for every positive spatial point remains
the separate global requirement for third full preservation.
