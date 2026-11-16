# Infinite-anchor source-origin bounds for the third theta reduction

This is the infinite-anchor companion to
`theta_third_source_origin_20261111.md`. It proves the two positive source
values and two positive mixed-derivative numerators at the spatial origin
for every anchor \(a\ge100\). Together with the companion's fresh
compact-anchor certificate, this closes the source-origin gate for every
pair of positive anchors, including coalescent anchors and pairs straddling
100. It does not establish the source signs at every positive spatial point.

## 1. Quantities and normalization

Retain the companion's definitions of \(\Phi_H(a,u),\Phi_P(a,u)\),
where \(u=t^2\) is the even spatial coordinate. Put

\[
H_1=\left.\frac{d}{du}(C/\kappa)\right|_{u=0}<0,
\qquad
B_1=\left.\frac{d}{du}(4C''/\kappa)\right|_{u=0}>0.
\]

The helper `source_expressions()` returns the four cleared polynomials

\[
F_{H,0}=H_1^2\Phi_H(a,0),\qquad
F_{H,1}=H_1^2\partial_u\Phi_H(a,0),
\]

\[
F_{P,0}=B_1^2\Phi_P(a,0),\qquad
F_{P,1}=B_1^2\partial_u\Phi_P(a,0).
\tag{1}
\]

These are affine functions of \(N(a)=n_a(0)/\kappa(0)\) and
\(d(a)=1+ap(a)\), with polynomial coefficients in \(a^2\). Their exact
origin-jet derivation is checked in the compact companion.

The tail script uses the anchor derivative with respect to \(a\):

\[
\widehat\Omega_H=F_{H,0}\frac{dF_{H,1}}{da}
-\frac{dF_{H,0}}{da}F_{H,1},
\]

and similarly for \(P\). If \(\Omega_H,\Omega_P\) in the compact note
use differentiation in \(v=a^2\), then

\[
\boxed{\widehat\Omega_H=2aH_1^4\Omega_H,\qquad
\widehat\Omega_P=2aB_1^4\Omega_P.}
\tag{2}
\]

All factors in (2) are strictly positive. The tail margins in the replay
refer to the cleared quantities \(\widehat\Omega\), not to unscaled
\(\Omega\).

## 2. A new global fourteenth-derivative bound

The full theta derivative helper, with sixteen theta modes and explicit
omitted-mode tails, proves

\[
\boxed{\sup_{t\in\mathbb R}|\kappa^{(14)}(t)|/\kappa(0)
< M_{14}:=14000000000.}
\tag{3}
\]

On \([0,4]\), 2,048 closed intervals have midpoints
\(t_i=(2i+1)/1024\) and radius \(r=1/1024\). Each is bounded using

\[
\frac{|\kappa^{(14)}(t_i)|}{\kappa(0)}
+r\frac{|\kappa^{(15)}(t_i)|}{\kappa(0)}
+\frac{r^2}{2}\sup_{|s-t_i|\le r}
\frac{|\kappa^{(16)}(s)|}{\kappa(0)}.
\tag{4}
\]

Every term is an interval enclosure of the full theta derivative. The
certificate checks (3) on each interval. The largest returned upper bound
is recorded in the replay.

For \(t\ge4\), write the mode derivative as
\(e^{t/4}P_{14}(\pi n^2e^t)e^{-\pi n^2e^t}\), with degree
\(\deg P_{14}=16\). The coefficient norm and \(3<\pi<4\) give

\[
\frac{|\kappa^{(14)}(t)|}{\kappa(0)}
\le\frac{2\|P_{14}\|_1(4e^t)^{16}e^{t/4-3e^t}}{\kappa(0)}.
\tag{5}
\]

The factor 2 bounds the positive mode majorant by its first term, because
the successive ratio is at most \(2^{32}e^{-9e^t}<1/2\). The logarithmic
derivative of the right side is \(65/4-3e^t<0\), so checking it at 4
covers the entire spatial tail. Evenness covers negative \(t\). This
bound is newly replayed here; it is not inferred from the value of the
fourteenth derivative at the origin.

## 3. A canceled Laplace approximation with explicit errors

Let

\[
p=p(a),\qquad r=ap'(a).
\]

For \(a\ge100\), the prior analytic tail theorem and fresh compact
integrals imply

\[
p>1.4,\quad0<r<1/2,\quad p(100)<1.402.
\]

Since \((p/a)'=(r-p)/a^2<0\), we also have

\[
\boxed{p/a<\rho:=701/50000=.01402.}
\tag{6}
\]

Use the degree-twelve spatial Taylor polynomial in

\[
N(a)=\frac14\int_0^\infty(s+2p(a))
\frac{\kappa(s)}{\kappa(0)}e^{-as/2}\,ds.
\]

Writing \(k_{2j}=\kappa^{(2j)}(0)/\kappa(0)\), the resulting finite
expression is

\[
N_0(a)=\sum_{j=0}^6 4^j k_{2j}
\left(\frac p{a^{2j+1}}+\frac{2j+1}{a^{2j+2}}\right).
\tag{7}
\]

The new global derivative bound (3) gives the remainder
\(M_{14}s^{14}/14!\) before integration. Direct Laplace integration,
and direct differentiation of the actual integral for \(N\), give

\[
|N-N_0|\le\frac{16384M_{14}}{a^{15}}
\left(p+\frac{15}a\right)
<\frac{18200M_{14}p}{a^{15}},
\]

\[
|N'-N_0'|\le\frac{16384M_{14}}{a^{16}}
\left(r+15p+\frac{240}a\right)
<\frac{280000M_{14}p}{a^{16}}.
\tag{8}
\]

The last rounding inequalities use \(p>1.4\), \(r<1/2\),
\(a\ge100\) and are exact rational checks. In particular, the bound on
\(N'\) is not obtained by differentiating an error bound for \(N\).

All local theta constants through \(k_{12}\) are newly enclosed. The
constant \(h=C(0)/\kappa(0)\) used in the cleared source polynomials is
computed independently as

\[
h=\frac1{4\kappa(0)}\int_0^\infty s\kappa(s)\,ds.
\]

The moment helper uses a rigorous integral on \([0,8]\), an explicit
omitted-theta bound, and an explicit entire spatial tail. No stored
moment approximation is an input to this tail certificate.

## 4. Exact source errors without unnecessary derivative losses

For each source the exact algebra has the form

\[
\boxed{\widehat\Omega=A(a)N^2+B(a,p,r)N+C(a,p,r)+D(a,p)N'.}
\tag{9}
\]

There is no \(NN'\) term and no square of \(N'\). These statements are
checked as polynomial identities, using the affine source expressions
in (1). Let \(\Omega_0\) be the result of substituting \(N_0,N_0'\).
Then the error is exactly

\[
\widehat\Omega-\Omega_0
=(2AN_0+B)\epsilon+D\epsilon'+A\epsilon^2,
\qquad \epsilon=N-N_0.
\tag{10}
\]

Keeping the cancellation inside \(2AN_0+B\) is useful: its largest
positive power of \(a\) is only three for the \(H\) source and two for
\(P\). The script derives it before taking absolute values.

The leading terms of the model are

\[
\Omega_{H,0}=c_H(p-r)/a^6+\text{higher powers of }a^{-1},
\]

\[
\Omega_{P,0}=c_P(p+r)/a^8+\text{higher powers of }a^{-1},
\tag{11}
\]

with rigorously positive enclosed constants \(c_H,c_P\). Exact
coefficient checks confirm these are the only monomials at the respective
leading powers. The full model remains affine in \(r\) and at most
quadratic in \(p\).

For an error monomial \(C p^j r^k a^{-n}\), divide by the intended
normalization \(p/a^m\), where \(m=6\) or 8. The bounds

\[
r/p<5/14,\quad p/a<\rho,\quad 1/p<5/7
\]

turn its absolute value into a fixed coefficient times a nonnegative
power of \(1/a\). Every exponent is checked. Evaluating that power at
\(a=100\) gives a uniform bound on the entire tail. Applying this rule
to all three terms in (10) produces the explicit positive constants
\(E_H,E_P\) in the replay such that

\[
|\widehat\Omega_H-\Omega_{H,0}|\le E_H p/a^6,
\qquad
|\widehat\Omega_P-\Omega_{P,0}|\le E_P p/a^8.
\tag{12}
\]

A coefficient-by-coefficient lower bound on the model itself discards
helpful positive terms and is too weak at the tail starting point.
The next step retains those terms in a compact polynomial certificate.

## 5. The whole infinite anchor range as a compact parameter rectangle

Put

\[
T=100/a\in(0,1],\qquad
p=p_*+(\rho a-p_*)q,\qquad p_*=7/5,\quad0\le q\le1.
\tag{13}
\]

Every permitted \(a,p\) in (6) is represented in (13). The denominator
\(\rho a-p_*\) is strictly positive even at \(a=100\). Because
\(\Omega_0\) is affine in \(r\), checking its lower bound at
\(r=0\) and \(r=1/2\) is sufficient for all \(0\le r\le1/2\).

For either endpoint, form

\[
\mathcal R(T,q)=a^{m-1}\Omega_0(a,p,r)-E\,p/a.
\tag{14}
\]

Substituting (13) makes (14) a polynomial in \(T,q\). The extra
factor \(1/a\) relative to the normalization in (12) removes the only
possible negative power introduced by \(p\sim a\). The script expands
each monomial by the binomial theorem and checks that every resulting
power of \(T\) is nonnegative. The degree in \(q\) is at most two.

If its power form is \(U_0(T)+U_1(T)q+U_2(T)q^2\), its degree-two
Bernstein form is

\[
\mathcal R=b_0(T)(1-q)^2+2b_1(T)q(1-q)+b_2(T)q^2,
\]

\[
b_0=U_0,\qquad b_1=U_0+U_1/2,\qquad b_2=U_0+U_1+U_2.
\tag{15}
\]

The first coefficient has an exact factor \(T\). Deflate that factor,
then certify

\[
b_0(T)/T>0,\quad b_1(T)>0,\quad b_2(T)>0
\qquad(0\le T\le1).
\tag{16}
\]

For each source and each of the two \(r\)-endpoints, all three
coefficient polynomials are enclosed on 64 closed intervals. Thus 384
interval checks per source cover the entire parameter rectangle.
Equations (15)--(16) imply \(\mathcal R>0\) for every \(T>0\) and
every \(q\in[0,1]\). This is an interval proof over the infinite
anchor tail, not a scan of selected anchors.

The replay records a positive lower margin relative to \(p/a^m\).
Indeed the denominator \(p/a\) has Bernstein coefficients

\[
p_*T/100,\qquad p_*T/200+\rho/2,\qquad\rho.
\]

If the minima in (16) are \(m_0,m_1,m_2\), a valid normalized margin is

\[
\min\left\{100m_0/p_*,\frac{m_1}{p_*/200+\rho/2},\frac{m_2}{\rho}\right\}>0.
\tag{17}
\]

Thus \(\widehat\Omega_H,\widehat\Omega_P>0\) for every \(a\ge100\),
after the full Taylor remainder is included.

The source values \(F_{H,0},F_{P,0}\) themselves are certified by their
positive leading model terms, an explicit sum of any negative remaining
coefficients, and the linear error in \(N\). Their strictly positive
margins are recorded separately.

## 6. Consequence and replay boundary

The replay certifies the following conservative tail margins. All
quantities in this table use the cleared normalization (1)--(2).

| Quantity | Strict lower bound for every \(a\ge100\) |
| --- | --- |
| \(F_{H,0}\) | \(.002074/a^2\) |
| \(F_{P,0}\) | \(6446p(a)/a^3\) |
| \(\widehat\Omega_H\) | \(4.38\cdot10^{-5}p(a)/a^6\) |
| \(\widehat\Omega_P\) | \(459000000p(a)/a^8\) |

The compact companion proves the corresponding strict signs for
\(0<a\le100\). Equations (2) and (16) extend them to every positive
anchor. The companion's monotone-ratio argument then gives strictly
positive spatial-origin limits for both second-reduced source
Wronskians at every pair of anchors, including repeated anchors.

Run:

```sh
python theta_third_source_origin_tail_20261111.py
```

The replay includes 2,048 new spatial intervals for the global
fourteenth-derivative bound, 768 new intervals for the two parameter
rectangles, freshly enclosed local theta data and \(C(0)\), exact
source identities, explicit Laplace remainders, and all positive gate
margins. The fixed anchor facts used are the prior all-tail bound
\(0<ap'<1/2\) and the companion's fresh \(1.4<p(100)<1.402\).

This proves the all-anchor source-origin gate. The mixed source
inequalities at every positive spatial point remain a separate
requirement for third full preservation.
