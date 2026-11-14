# An explicit two-node radius for the actual odd theta kernel

Research continuation, 14 November 2026. This note turns the earlier existential local theorem into a quantitative statement. The radius is measured in the Mellin coordinate relative to the cutoff, using the normalization

\[
\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du.
\]

It is not a radius around a zeta zero in the complex `s` plane. The kernel here is the actual, unheated theta kernel; the calculation does not assert the same numerical constants for heat-deformed kernels.

## 1. Certified theorem

Let `alpha>0`, let the cutoff be translated to zero, and use

\[
H_0(u,v)=\alpha\int_0^\infty
(2r-u-v)\kappa(r-u)\kappa(r-v)\,dr,
\qquad
H_-(x,y)=H_0(x,y)-H_0(x,-y).
\]

For every pair of distinct distances

\[
\boxed{0<x,y\le\frac1{200}=0.005,}
\]

the odd Gram matrix `[H_-(x_i,x_j)]`, `x_1=x, x_2=y`, is strictly positive definite. There is no minimum separation condition between `x` and `y`.

More precisely, for all complex coefficients `c_1,c_2`,

\[
\boxed{
\sum_{i,j=1}^2\overline{c_i}H_-(x_i,x_j)c_j
\ge\frac{\alpha}{10000}
\left(
|xc_1+yc_2|^2+
|(y^2-x^2)yc_2|^2
\right).
}
\tag{1}
\]

The right-hand side is strictly positive for every nonzero coefficient vector when `x,y` are distinct and positive. Its dependence on the node separation is explicit. The radius is a sufficient certified value, with no claim that it is maximal.

The rest of the proof sets `alpha=1`. Multiplication by any positive `alpha` gives (1).

## 2. Newton congruence removes the coalescing-node singularity

The real analytic kernel is odd in each variable, so write

\[
H_-(x,y)=xy\,G(x^2,y^2).
\]

Here `G` is a real symmetric analytic two-variable function. Put `X=x^2`, `Y=y^2`, `Delta=Y-X`, and

\[
A=\begin{pmatrix}G(X,X)&G(X,Y)\\G(Y,X)&G(Y,Y)\end{pmatrix},
\qquad
T=\begin{pmatrix}1&0\\-1/\Delta&1/\Delta\end{pmatrix},
\qquad B=TAT^T.
\]

The entries are exactly

\[
B_{00}=G(X,X),
\]

\[
B_{01}=\int_0^1G_Y(X,X+t\Delta)\,dt,
\]

\[
B_{11}=\int_0^1\int_0^1
G_{XY}(X+s\Delta,X+t\Delta)\,ds\,dt.
\tag{2}
\]

These identities remain well conditioned as the two nodes coalesce. Every argument of `G` in (2) belongs to `[0,d]^2`, where `d=(1/200)^2=1/40000`.

Let

\[
a=G(0,0),\qquad b=G_Y(0,0),\qquad c=G_{XY}(0,0).
\]

The previously derived first odd coefficient matrix is `J=[[a,b],[b,c]]`. Suppose throughout the square that

\[
|G_X|\le M_{10},\quad |G_{XY}|\le M_{11},\quad
|G_{YY}|\le M_{02},\quad |G_{XXY}|\le M_{21}.
\]

Symmetry gives the corresponding bounds with the variables exchanged. The fundamental theorem of calculus and (2) give

\[
|B_{00}-a|\le2dM_{10},
\]

\[
|B_{01}-b|\le d(M_{11}+M_{02}),
\]

\[
|B_{11}-c|\le2dM_{21}.
\tag{3}
\]

It remains to certify the four real derivative bounds. No finite sampling of node pairs is used.

## 3. Positive-weight derivative identity

For an odd analytic function `h`, set `q(X)=h(sqrt(X))/sqrt(X)` with its removable value at zero. Then

\[
q^{(k)}(X)=\frac1{4^k k!}
\int_0^1(1-s^2)^k h^{(2k+1)}(s\sqrt X)\,ds.
\tag{4}
\]

For `h(x)=x^(2n+1)` and `n>=k`, both sides equal `n!/(n-k)! X^(n-k)`. The necessary integral is obtained by repeated integration by parts, or the elementary beta integral. Both sides vanish for `n<k`. Local uniform convergence of the analytic series proves (4); analyticity continues the identity over the real neighborhood used here.

The weight in (4) is nonnegative, and its total mass is

\[
\frac1{4^k k!}\int_0^1(1-s^2)^k\,ds
=\frac{k!}{(2k+1)!}.
\]

Apply (4) successively in both variables. For nonnegative integers `a,b`,

\[
\sup_{0\le X,Y\le d}|\partial_X^a\partial_Y^bG(X,Y)|
\le\frac{a!b!}{(2a+1)!(2b+1)!}
\sup_{0\le x,y\le\delta}
|\partial_x^{2a+1}\partial_y^{2b+1}H_-(x,y)|,
\tag{5}
\]

where `delta=1/200`. Thus only derivatives of `kappa` through order five are needed for the four bounds in (3).

## 4. Bounds on the differentiated cutoff integral

For odd positive integers `m,n`, differentiation under the rapidly decaying integral gives

\[
\partial_u^m\partial_v^n H_0(u,v)
=\int_0^\infty\Big[
(2r-u-v)\kappa^{(m)}(r-u)\kappa^{(n)}(r-v)
\]

\[
\hspace{25mm}
+m\kappa^{(m-1)}(r-u)\kappa^{(n)}(r-v)
+n\kappa^{(m)}(r-u)\kappa^{(n-1)}(r-v)
\Big]dr.
\tag{6}
\]

The signs in (6) follow because `m+n` is even; differentiating the linear prefactor contributes a second minus sign to each cross term. Since `n` is odd,

\[
\partial_x^m\partial_y^nH_-(x,y)
=\partial_u^m\partial_v^nH_0(x,y)
+\partial_u^m\partial_v^nH_0(x,-y).
\]

Let `K_j(r)` bound `|kappa^(j)(r-z)|` for every `|z|<=delta`. A sufficient bound for the absolute value above is

\[
2\int_0^\infty
\left[(2r+2\delta)K_m(r)K_n(r)
+mK_{m-1}(r)K_n(r)
+nK_m(r)K_{n-1}(r)\right]dr.
\tag{7}
\]

The script evaluates (7) on every whole interval of a 512-part partition of `[0,3]`, using interval enclosures for the shifted argument `r+[-delta,delta]`. Multiplying the interval upper bound by the interval length gives a rigorous integral upper bound. This is a full interval enclosure of the continuum, not pointwise quadrature or a test grid.

### Theta derivative and omitted-series bounds

The exact series is

\[
\kappa^{(j)}(u)=e^{u/4}\sum_{n\ge1}e^{-v_n}P_j(v_n),
\quad v_n=\pi n^2e^u,
\quad P_0(v)=2v^2-3v,
\]

\[
P_{j+1}(v)=(1/4-v)P_j(v)+vP_j'(v).
\]

The script builds the coefficients as exact rational numbers. If `C_j` is their absolute sum, then `|P_j(v)|<=C_j v^(j+2)` for `v>=1`. Four terms are retained. For omitted `n>=5` and `0<=j<=5`, the envelope decreases with `u>=-delta` because

\[
\pi\,25e^{-\delta}>j+9/4.
\]

Its maximum is therefore at `u=-delta`. Consecutive omitted envelopes have ratio bounded by

\[
r_j=\left(\frac65\right)^{2j+4}
\exp(-11\pi e^{-\delta})<1.
\]

Thus a uniform omitted-series error is

\[
T_j=
\frac{C_j\pi^{j+2}5^{2j+4}
\exp(-(j+9/4)\delta-25\pi e^{-\delta})}{1-r_j}.
\tag{8}
\]

The interval `[-T_j,T_j]` is added to every derivative evaluation, including those used to certify the jet.

### Entire infinite tails

For `u>=3-delta`, the consecutive-envelope ratio starting at `n=1` is at most

\[
2^{2j+4}\exp(-3\pi e^{3-\delta})<1/2.
\]

Therefore, with `A_j=2C_j pi^(j+2)` and `p_j=j+9/4`,

\[
|\kappa^{(j)}(u)|\le E_j(u):=
A_j\exp(p_ju-\pi e^u).
\]

The envelope decreases on that tail. Consequently `K_j(r)<=E_j(r-delta)` for `r>=3`. To bound products, put `a=3-delta`, `p=m+n+9/2`, and `lambda=2pi exp(a)-p>0`. Writing `r=3+v` and using `exp(v)>=1+v` gives

\[
\int_3^\infty E_m(r-\delta)E_n(r-\delta)dr
\le\frac{A_mA_n e^{pa-2\pi e^a}}{\lambda},
\]

\[
\int_3^\infty(2r+2\delta) E_m(r-\delta)E_n(r-\delta)dr
\le A_mA_n e^{pa-2\pi e^a}
\left(\frac{6+2\delta}{\lambda}+\frac2{\lambda^2}\right).
\tag{9}
\]

Equations (7) and (9) cover the entire tail of each mixed derivative bound.

## 5. Jet certificate and numerical enclosures

For self-contained reproduction, the script also recomputes the first jet using

\[
I_j=\int_0^\infty r[\kappa^{(j)}(r)]^2dr,
\quad k_0=\kappa(0),\quad k_2=\kappa''(0),
\]

\[
J=\begin{pmatrix}
4I_1-2k_0^2&-(2I_2+k_0k_2)/3\\
-(2I_2+k_0k_2)/3&I_3/9-k_2^2/6
\end{pmatrix}.
\]

Each moment on `[0,3]` is integrated by the earlier interval midpoint method, whose subinterval error is at most `h^3 sup|f_j''|/24`, with

\[
f_j''=4\kappa^{(j)}\kappa^{(j+1)}
+2r\left((\kappa^{(j+1)})^2+\kappa^{(j)}\kappa^{(j+2)}\right).
\]

The positive infinite moment tail is bounded by the corresponding unshifted version of (9). This reproduces the earlier strict positivity of the first jet without reading or trusting its saved JSON file.

The resulting derivative upper bounds, rounded upward here, are

| Derivative | Uniform absolute upper bound |
|---|---:|
| `G_X` | 1.692812 |
| `G_XY` | 3.174253 |
| `G_YY` | 5.406298 |
| `G_XXY` | 9.750007 |

Combining these with the internally computed jet intervals and (3) gives the following outward-widened enclosures:

\[
B_{00}\in[0.0216639856284360,\;0.0218652227991667],
\]

\[
B_{01}\in[-0.0633077296575218,\;-0.0628147336085049],
\]

\[
B_{11}\in[0.1861212752050189,\;0.1873153629859614],
\]

\[
\det B\in[0.0000242599967978624,\;
0.000150001387087375].
\]

In fact the script checks the stronger shifted condition. With `mu=1/10000`, it verifies `B00-mu>0` and

\[
\boxed{\det(B-\mu I)
\in[0.00000349147071451692,\;
0.000129093328508862]>0.}
\]

Therefore `B` is strictly greater than `mu I` for every pair of nodes in the box. Finally, the original odd Gram is `D A D`, where `D=diag(x,y)`, and

\[
T^{-T}Dc=
\begin{pmatrix}xc_1+yc_2\\(y^2-x^2)yc_2\end{pmatrix}.
\]

Applying the lower bound for `B` proves (1).

## Reproduction and scope

Run

```sh
python3 theta-odd-explicit-radius.py
```

The default is `--delta 1/200 --steps 512`. The only third-party dependency is `mpmath==1.3.0`. The run uses 40-digit outward-rounded interval arithmetic, exact rational coefficients and parameters, and explicit checks of the envelope hypotheses. It writes [theta-odd-explicit-radius-1-200.json](theta-odd-explicit-radius-1-200.json) beside the script. Binary floating-point numbers occur only in the display conversion, where the endpoints are widened outward by one ulp; all positivity assertions use the interval objects.

The trust basis is mpmath's elementary interval implementation and the analytic estimates above. This is not a proof-assistant verification. The theorem covers all distinct two-node configurations in the specified continuum, including arbitrarily close nodes and arbitrary complex coefficients. It makes no claim for unrestricted numbers of nodes, heat-deformed constants, a uniform lower bound in unscaled physical node coordinates, the full bridge residual, or RH.
