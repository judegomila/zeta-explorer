# Explicit tail proof for the theta comparison criterion

Research continuation, 10 November 2026. This note proves the three
scalar signs needed by the proposed comparison argument on the entire
tail t at least 4. It gives explicit error constants and an exact
polynomial audit. The bounded interval is proved in the companion
[global proof and interval construction](theta_ratio_global_20261110.md).

## 1. Target and result

Put

$$
r=-\kappa'/\kappa,\qquad f=tr,\qquad
W=4\kappa''/\kappa=4(r^2-r'),\qquad h=C/\kappa,
\quad C=\frac14\int_t^\infty s\kappa(s)ds.
$$

The target determinants are

$$
D_W=W''f'-W'f'',\qquad D_h=h''f'-h'f''.
$$

**Theorem.** For the actual theta kernel,

$$
\boxed{W'(t)>\frac12,\qquad D_W(t)>\frac12,
\qquad D_h(t)>\frac12\quad(t\ge4).}
\tag{1}
$$

No finite-height zero verification enters this proof.

## 2. The first theta term and a lower bound for its integrated ratio

Set $P=\pi e^t$ and write the theta series as

$$
\kappa(t)=\kappa_1(t)[1+E(t)],\qquad
\kappa_1(t)=2\pi^2e^{9t/4-P}\left(1-\frac3{2P}\right).
\tag{2}
$$

For $t\ge4$, elementary bounds $\pi>3$ and $e>8/3$ give
$P>128$. Also $t<P$. Define

$$
r_0=-\kappa_1'/\kappa_1
=P-\frac94-\frac3{2P-3},\qquad
f_0=tr_0,\qquad W_0=4(r_0^2-r_0').
\tag{3}
$$

On expressions in independent variables P and t, a t-derivative means
$\mathcal D=\partial_t+P\partial_P$.

Let $C_1=\tfrac14\int_t^\infty s\kappa_1(s)ds$ and
$h_0=C_1/\kappa_1$. It satisfies

$$
h_0'=r_0h_0-t/4.
$$

Use the explicit function

$$
H_3(P,t)=\frac14\left[
\frac tP+\frac{5t/4+1}{P^2}
+\frac{29t/16+3/2}{P^3}\right].
\tag{4}
$$

Direct differentiation gives the strictly positive residual

$$
\boxed{\mathcal D H_3-r_0H_3+t/4
=\frac{354Pt+280P+609t+156}{256P^3(2P-3)}>0.}
\tag{5}
$$

Multiplying the difference equation for $h_0-H_3$ by $\kappa_1$
and integrating from t to infinity gives

$$
\boxed{h_0(t)>H_3(P,t).}
\tag{6}
$$

The boundary term vanishes by the explicit superexponential tail of
$\kappa_1$ and the displayed polynomial/exponential form of $H_3$.

## 3. Exact positive margins for the first theta term

Eliminate $h_0'$ and $h_0''$ with their first-order equation. Define

$$
A_0=(r_0'+r_0^2)f_0'-r_0 f_0'',\qquad
B_0=(r_0t+1)f_0'-t f_0''.
$$

Then

$$
D_{h,0}=A_0h_0-B_0/4.
\tag{7}
$$

The following rational inequalities hold throughout the larger
independent-variable quadrant $P\ge128$, $t\ge4$:

$$
\boxed{A_0>0,\quad W_0'>1,\quad
W_0''f_0'-W_0'f_0''>1,\quad A_0H_3-B_0/4>1.}
\tag{8}
$$

They have finite exact polynomial certificates. For each rational
expression in (8), subtract its claimed lower bound, substitute
$P=128+X$, $t=4+Y$, and put it over a common denominator. Both numerator
and denominator have nonnegative rational coefficients and strictly
positive constant terms. Hence they are strictly positive for all
$X,Y\ge0$.

The accompanying executable checks every coefficient, directly from
(3)--(4); it does not sample points. For example,

$$
W_0'=\frac{2P(16P^3-92P^2+168P-105)}{(2P-3)^2}.
$$

The same certificate verifies the bounds used below:

$$
r_0>P/2,\quad r_0'>P,\quad |r_0^{(j)}|<2P
\quad(0\le j\le3).
\tag{9}
$$

Equations (6)--(8) prove $D_{h,0}>1$ as well.

## 4. Explicit derivative bounds for the omitted theta terms

The relative nth term is

$$
E_n(t)=\frac{\kappa_n(t)}{\kappa_1(t)}
=q_n(P)e^{-(n^2-1)P},\qquad
q_n(P)=n^4+\frac{3(n^4-n^2)}{2P-3},\quad n\ge2.
\tag{10}
$$

For $P\ge128$, the geometric expansion of $(P-3/2)^{-1}$ gives

$$
|\mathcal D^j q_n|\le2n^4\quad(0\le j\le4).
$$

For the derivative orders at least one, this follows from
$\sum_{k\ge0}(k+1)^4/4^k=1520/81<20$ and
$30/P<1$. The zeroth-order inequality follows directly from (10).

The derivative polynomial of $e^{-x}$ under $x\partial_x$ has absolute
coefficient sum at most 15 through order four. For $x\ge1$,
its jth derivative is therefore bounded by $15x^j e^{-x}$.
Leibniz's rule now gives

$$
|E_n^{(j)}(t)|
\le480 n^{4+2j}P^j e^{-(n^2-1)P}
\quad(0\le j\le4).
$$

The ratio between consecutive terms $n^{12}e^{-(n^2-1)P}$ is at most
$130e^{-5P}<1/2$. Therefore, with $E=\sum_{n\ge2}E_n$,

$$
\boxed{|E^{(j)}(t)|<2^{22}P^j e^{-3P}
\le\delta(P):=2^{22}P^4e^{-3P}\quad(0\le j\le4).}
\tag{11}
$$

The function $P^4e^{-3P}$ decreases for $P\ge128$, and $e>2$ gives
$\delta(P)<2^{-334}$. Differentiating $\log(1+E)$ through order four
and using $E\ge0$ shows that each derivative has modulus at most
$32\delta$. (The fourth-order absolute coefficient sum is 26.) Thus

$$
\boxed{|r^{(j)}-r_0^{(j)}|<\epsilon(P):=
2^{27}P^4e^{-3P}\quad(0\le j\le3).}
\tag{12}
$$

In particular, $|r^{(j)}|<3P$ for these orders.

## 5. The integrated ratio is controlled without subtracting large terms

For each individual theta term, write $h_n=C_n/\kappa_n$.
The logarithmic slope $r_n=r_0(n^2P)$ increases with n. Hence
$\kappa_n(t+s)/\kappa_n(t)\le\kappa_1(t+s)/\kappa_1(t)$ for
$s\ge0$, proving $0<h_n\le h_0$.

Also $s/r_0(s)$ decreases for $s\ge4$, with $r_0(s)$ evaluated along
$P(s)=\pi e^s$, since $r_0<P$ and $r_0'>P$.
Integration against $-\kappa_1'$ gives

$$
0<h_0(t)\le\frac{t}{4r_0(t)}<\frac t{2P}<\frac12.
$$

Because the complete ratio is the weighted average

$$
h=\frac{h_0+\sum_{n\ge2}E_nh_n}{1+E},
$$

we have

$$
\boxed{0\le h_0-h\le E h_0<\delta(P)/2=\epsilon(P)/64.}
\tag{13}
$$

This avoids using a truncated asymptotic expansion to estimate a
delicate difference of large terms.

## 6. Propagating the explicit error to the three determinants

All bounds in this section use only $1\le t\le P$,
$|r_0^{(j)}|<2P$, $|r^{(j)}|<3P$, and (12)--(13).
They are deliberately loose.

The identities

$$
f'=r+tr',\quad f''=2r'+tr'',\quad
W'=4(2rr'-r''),\quad W''=4(2(r')^2+2rr''-r''')
$$

give

$$
|W'-W_0'|<2^6P\epsilon,
\qquad
|D_W-D_{W,0}|<2^{11}P^3\epsilon.
\tag{14}
$$

For clarity, the intermediate bounds are
$|f'|<6P^2$, $|f''|<9P^2$,
$|f'-f_0'|<2P\epsilon$,
$|f''-f_0''|<3P\epsilon$,
$|W_0'|<40P^2$, $|W_0''|<72P^2$,
$|W'-W_0'|<44P\epsilon$, and
$|W''-W_0''|<84P\epsilon$.
The resulting constant for the second bound is
$84\cdot6+72\cdot2+44\cdot9+40\cdot3=1164<2^{11}$.

Use the exact equations

$$
h'=rh-t/4,\qquad
h''=(r'+r^2)h-(rt+1)/4.
$$

They imply
$|h'-h_0'|<P\epsilon$,
$|h''-h_0''|<8P^2\epsilon$,
$|h_0'|<2P$, and $|h_0''|<4P^2$.
Consequently

$$
|D_h-D_{h,0}|<2^7P^4\epsilon.
\tag{15}
$$

Each error in (14)--(15) is less than the common bound

$$
2^{40}P^8e^{-3P}
\le2^{40}128^8 2^{-384}=2^{-288}<\frac12.
\tag{16}
$$

The monotonicity of $P^8e^{-3P}$ justifies the endpoint comparison.
Combining (8), (14)--(16), and $D_{h,0}>1$ proves (1).

## Validation and remaining domain

Run `python theta_ratio_tail_certificate_20261110.py` for the exact
coefficient and rational-constant checks. The analytic theta-series
bound is the explicit derivation in Sections 4--6; the executable
checks its finite constants and the first-term algebra.

The present theorem settles the full unbounded tail with an explicit
cutoff. The companion origin and bounded-interval certificates cover
$0<t\le4$, completing the actual-theta signs globally. Preservation
under later kernel reductions is a separate mathematical question.
