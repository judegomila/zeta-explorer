# The small-anchor scalar inequality for the complete theta kernel

Research continuation, 11 November 2026. This note closes the scalar target left open in [the large-anchor note](THETA_RATIO_LARGE_ANCHOR.md):

$$
\boxed{Y(t):=-\left(\frac{B_0(t)}{J(t)}\right)'>0\qquad(t>0).}
\tag{1}
$$

The result is computer-assisted: rigorous ball enclosures handle a bounded interval, and an analytic derivative-ratio argument handles the entire remaining tail. All theta summands and all omitted integration tails are included through explicit error bounds. This is stronger than the earlier sampled floating diagnostics. It proves a property of the small-anchor coefficient, not an all-anchor or all-order theorem. No RH or novelty claim is made.

## Definitions and consequence for the first pair

Keep the preceding normalization

$$
\kappa(t)=\sum_{m\ge1} x_m(2x_m-3)e^{t/4-x_m},
\quad x_m=\pi m^2e^t\quad(t\ge0),
\qquad F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(t)e^{zt/2}dt.
$$

The kernel extends evenly. Put

$$
M_j(t)=\int_t^\infty v^j\kappa(v)dv,\quad
\ell=\frac{F''(0)}{F(0)}=\frac{M_2(0)}{4M_0(0)},\quad J=M_1/4,
$$

$$
B_0=\frac\ell4(M_1-tM_0)
-\frac1{32}(M_3-2tM_2+t^2M_1).
\tag{2}
$$

The exact small-anchor expansion already established is

$$
n_a=J-a^2B_0+O_K(a^4),\qquad
\alpha_a:=\left(\log\frac{n_a}{J}\right)'
=a^2Y+O_K(a^4)
\tag{3}
$$

uniformly on each compact $K\subset(0,\infty)$, including the derivative required here. Also $\beta_a=H-\alpha_a\to H>0$, with $H=-(\log(J/\kappa))'$. The known squared-variable concavity input giving $H>0$ is [Csordas, Theorem 4.2(b)](https://arxiv.org/html/1309.0055v2).

**Corollary.** For every compact $K=[\varepsilon,T]\subset(0,\infty)$, there exists $\delta_K>0$ such that both

$$
(n_a/b_a)'>0,\qquad(n_a/\kappa)'<0
$$

hold on $K$ for $0<a<\delta_K$. Together with the preceding large-anchor theorem, this settles both parameter endpoints on each fixed compact coordinate interval. The subsequent [finite-anchor tail theorem](THETA_FINITE_ANCHOR_TAIL.md) combines this coefficient result with a uniform tail band and a parity argument at zero to prove that one common small-anchor range works for every $t>0$. Its endpoint is not numerically evaluated.

## Exact identities used to test the sign

From $M_j'=-t^j\kappa$,

$$
B_0'=-\frac\ell4M_0+\frac1{16}(M_2-tM_1),\qquad
4B_0''=\ell\kappa-J.
\tag{4}
$$

Define the Wronskian numerator

$$
W=B_0J'-B_0'J,\qquad Y=W/J^2.
$$

The exact moment identity defining $\ell$ gives $B_0'(0)=J'(0)=0$, hence $W(0)=0$. The derivative formulas are

$$
W'=B_0J''-B_0''J
=-\frac{B_0(\kappa+t\kappa')+\ell\kappa J-J^2}{4},
\tag{5}
$$

$$
W''=B_0'J''+B_0J'''-B_0'''J-B_0''J',
\tag{6}
$$

where

$$
J'=-t\kappa/4,\quad J''=-(\kappa+t\kappa')/4,\quad
J'''=-(2\kappa'+t\kappa'')/4,\quad
B_0'''=(\ell\kappa'-J')/4.
$$

These forms avoid dividing small, heavily cancelling tail expressions prematurely. The checker calls this numerator `N` internally.

## Rigorous bounded-interval certificate

[certify_small_anchor.py](certify_small_anchor.py) uses python-flint 0.9.0 with 192-bit Arb ball arithmetic. [The recorded run](small-anchor-certificate.json) verifies the following weaker rational bounds:

| Interval | Certified inequality | Number of full cells |
|---|---|---:|
| $[0,1/8]$ | $W'/J^2>3/5000$ | 512 |
| $[1/8,3]$ | $W/J^2>1/10000$ | 11,776 |

Each cell has width $1/4096$. These are enclosures over whole intervals, not point samples. The first row and $W(0)=0$ prove $W>0$ immediately to the right of zero. Since $J$ decreases, they also give

$$
Y(t)>\frac{3t}{5000}\quad(0<t\le1/8).
\tag{7}
$$

The second row proves (1) through $t=3$. The moment calculation additionally encloses

$$
\ell=0.0462099862308379415778676208607\ldots>1/25.
\tag{8}
$$

The recorded ball radii, rather than the displayed decimal digits alone, specify its accuracy.

### What the interval computation encloses

Write $\kappa_8$ for the first eight summands. On each integration cell in $[0,5]$, let $m$ be its midpoint and $r=1/8192$ its radius. For $g_j(v)=v^j\kappa_8(v)$, $j=0,1,2,3$, the checker forms the Taylor coefficients $c_k=g_j^{(k)}(m)/k!$, $k\le7$, and an interval $C_8$ enclosing $g_j^{(8)}(v)/8!$ over the entire cell. Consequently

$$
\int_{m-r}^{m+r}g_j(v)dv
\in 2\sum_{k=0,2,4,6}\frac{c_kr^{k+1}}{k+1}
+\left[-\frac{2|C_8|r^9}{9},\frac{2|C_8|r^9}{9}\right].
\tag{9}
$$

The right half-cell integral uses all coefficients through degree seven and half the same remainder bound. Summing backward from 5 supplies enclosures for every endpoint and midpoint tail moment. Positivity of $v^j\kappa_8(v)$ bounds a moment over a cell by its endpoint values.

Arb power series with interval constant coefficient provide the derivative bounds in (9). Only finite-sum exponentials and polynomial arithmetic occur in this quadrature. See the primary [Arb ball documentation](https://python-flint.readthedocs.io/en/stable/arb.html) and [power-series documentation](https://python-flint.readthedocs.io/en/latest/arb_series.html). An interval derivative bound and the explicit Taylor remainder are essential; a truncated power series alone is not an error certificate.

The checker adds the complete-kernel errors below to all moment and kernel enclosures. On the origin cells it evaluates (5) directly. On each remaining cell it evaluates $W(m)$ and $W'(m)$ and uses

$$
W(t)\in W(m)+[-r,r]W'(m)
+\left[-\frac{r^2}{2}\sup_{\rm cell}|W''|,
\frac{r^2}{2}\sup_{\rm cell}|W''|\right],
\tag{10}
$$

with (6) evaluated over the full cell. Direct interval substitution into $W$ was too wide in the tail; (10) retains the cancellation at the midpoint while rigorously bounding its variation.

### Complete-theta and integration-tail bounds

For $m\ge9$ and $v\ge0$, set $x=\pi m^2e^v\ge3m^2\ge243$. If $f_m$ denotes the corresponding summand, direct differentiation gives

$$
|f_m|,|f_m'|\le2x^4e^{-x},\qquad |f_m''|\le4x^5e^{-x}.
$$

For example, $f_m\le2x^3e^{-x}$, $|f_m'/f_m|\le x$, and the derivative of this logarithmic derivative has magnitude at most $2x$. Since $x^je^{-x}$ decreases for $x>j$, comparison with $3m^2$ and a geometric sum yield

$$
\sup_{v\ge0}|\kappa-\kappa_8|,
\sup_{v\ge0}|\kappa'-\kappa_8'|
\le324\,9^8e^{-243}<10^{-60},
$$

$$
\sup_{v\ge0}|\kappa''-\kappa_8''|
\le1944\,9^{10}e^{-243}<10^{-56}.
\tag{11}
$$

The geometric ratio is bounded by $(10/9)^{10}e^{-57}<1/2$. The checker verifies the looser purely rational bounds obtained by replacing $e^{-243}$ with $2^{-243}$.

For $v\ge5$, put $x=\pi e^v>400$. The dominant-term estimates in the next section imply $\kappa(v)\le4x^2e^{v/4-x}$. As $v^j\le e^{jv}$, for $0\le j\le3$,

$$
\int_5^\infty v^j\kappa(v)dv
\le4\int_{400}^\infty x^5e^{-x}dx
\le8\,400^5e^{-400}<10^{-100}.
\tag{12}
$$

Combining (11) on $[0,5]$ with (12) bounds the error in every finite-sum tail moment, uniformly for $0\le t\le5$, by

$$
625\cdot10^{-60}+10^{-100}<10^{-56}.
\tag{13}
$$

Thus neither the omitted theta terms nor the infinite integration interval is silently discarded. These errors are added separately from all Taylor and ball-rounding errors.

## Analytic proof for every t at least 3

This part uses no grid or extrapolation of the bounded-interval calculation.

### Bounds for the logarithmic decay rate

Put $x=\pi e^t$ and $u=-\kappa'/\kappa$. For $t\ge3$, $x>60$. We claim

$$
x-3<u<x,\qquad x-1<u'<x+1,\qquad x-1<u''<x+1.
\tag{14}
$$

To verify them with the complete theta sum, factor $\kappa=f_1(1+\rho)$, where

$$
\rho=\sum_{m\ge2} A_m(x)e^{-(m^2-1)x},\qquad
A_m(x)=\frac{m^2(2m^2x-3)}{2x-3}
=m^4+\frac{3m^2(m^2-1)}{2x-3}.
$$

Write $D=x\partial_x=\partial_t$. For $0\le j\le3$ and $x\ge60$, $|D^j A_m|\le4m^4$. This follows by differentiating $(2x-3)^{-1}$; its first three logarithmic derivatives have magnitudes at most $1$ on this range. Also $|D^j e^{-y}|\le5y^3e^{-y}$ for $y=(m^2-1)x\ge180$. Leibniz's rule therefore gives the deliberately generous bound

$$
|D^j\rho|\le1000x^3\sum_{m\ge2}m^{10}e^{-(m^2-1)x}
\le2048000x^3e^{-3x}<10^{-40}.
\tag{15}
$$

The last sum is at most twice its $m=2$ term: its consecutive ratio is at most $(3/2)^{10}e^{-5x}<1/2$. The function $x^3e^{-3x}$ decreases here; the checker verifies the bound at $60$ using $e^{-180}<2^{-180}$. The first three derivatives of $\log(1+\rho)$ have magnitudes below $2\cdot10^{-40}$ by their explicit quotient formulas.

For the first summand alone,

$$
u_1=x-\frac94-\frac3{2x-3},\quad
u_1'=x+\frac{6x}{(2x-3)^2},\quad
u_1''=x-\frac{6x(2x+3)}{(2x-3)^3}.
$$

These expressions and (15) prove (14), since $u=u_1-D\log(1+\rho)$. The same estimate $\rho<1$ justifies the complete-kernel envelope used in (12).

### A decreasing reciprocal-curvature derivative

Let $Q=u/t$. Bounds (14) give $Q>19$ and $Q'>0$ for $t\ge3$. The exact identity

$$
t^3(QQ''-2Q'^2)=t(uu''-2u'^2)+2uu'
$$

and (14) imply

$$
t^3(QQ''-2Q'^2)
\le t(-x^2+5x-2)+2x^2+2x
\le -x^2+17x-6<0.
\tag{16}
$$

Here the middle coefficient is negative and $t\ge3$, while $x\ge60$. Consequently $R:=Q'/Q^2$ is positive and strictly decreasing on this entire tail.

### Two integrations preserve the decreasing ratio

Set $h=J/\kappa$. Integration by parts gives

$$
h=\frac1{4Q}-\frac1{4\kappa(t)}\int_t^\infty\kappa(v)R(v)dv,
\qquad
-h'=\frac{tQ}{4\kappa(t)}\int_t^\infty\kappa(v)R(v)dv.
\tag{17}
$$

Since $R$ decreases and $vQ(v)\ge tQ(t)$ for $v\ge t\ge3$,

$$
0<h<\frac1{4Q},\qquad
0<-h'\le\frac{Q'}{4Q^2}.
\tag{18}
$$

For the second inequality use $\int_t^\infty\kappa(v)dv\le\kappa(t)/(tQ(t))$. The certified scalar bound $\ell>1/25$ and $Q>19$ imply $\ell>1/(2Q)$.

Now $J''>0$, $B_0''>0$, and

$$
g(t):=\frac{B_0''}{J''}=\frac{\ell-h}{t^2Q-1}>0.
$$

Writing $d=t^2Q-1>0$, (18) yields

$$
g'=
\frac{(-h')d-(\ell-h)d'}{d^2}
<\frac{t^2Q'}{d^2}\left[\frac1{4Q}-(\ell-h)\right]<0.
\tag{19}
$$

All relevant functions and derivatives vanish at infinity. Thus

$$
\frac{B_0'}{J'}=
\frac{\int_t^\infty g(v)J''(v)dv}{\int_t^\infty J''(v)dv}
$$

is the upper-tail average of a strictly decreasing function under a positive weight. It is strictly decreasing. Applying the same argument again with weight $-J'>0$ shows

$$
\frac{B_0}{J}=
\frac{\int_t^\infty (B_0'/J')(v)(-J'(v))dv}
{\int_t^\infty(-J'(v))dv}
$$

is strictly decreasing. This proves (1) for all $t\ge3$. Combined with the bounded-interval certificate, the scalar inequality is proved for every $t>0$.

## Why the known concavity input alone cannot prove this sign

There is an explicit obstruction to treating (1) as an automatic consequence of $Q'>0$. Consider the different even kernel

$$
k_\eta(t)=e^{-t^2-\eta t^6},\qquad \eta>0.
$$

It is positive, smooth, superexponentially decaying, and satisfies

$$
Q_\eta=2+6\eta t^4,\qquad Q_\eta'=24\eta t^3>0\quad(t>0).
$$

Define its $M_j,\ell,J,B_0,Y$ exactly as above. Since $k_\eta(0)=1$, the sign of the central coefficient is

$$
\lim_{t\downarrow0}\frac{Y(t)}t
=\frac{D(\eta)}{8M_1(0)^2},\qquad
D=2M_1(0)^2-\frac{4M_1(0)M_2(0)}{M_0(0)}+M_3(0).
\tag{20}
$$

Gaussian moments give $D(0)=0$ and $D'(0)=-3/4$. Differentiation from the right is justified by Gaussian moment domination. Hence (1) fails near zero for sufficiently small positive $\eta$.

There is also an explicit checked value: $\eta=10^{-6}$. If $G_j=\Gamma((j+1)/2)/2$, then $1-y\le e^{-y}\le1-y+y^2/2$ for $y\ge0$ gives

$$
G_j-\eta G_{j+6}\le M_j(0)
\le G_j-\eta G_{j+6}+\frac{\eta^2}{2}G_{j+12}.
$$

The checker inserts these bounds into (20) and obtains the strictly negative ball $D\in[-7.5\cdot10^{-7}\pm1.68\cdot10^{-9}]$. This is a counterexample to the general kernel implication, not to the actual theta inequality just proved. It explains why properties specific to theta were needed.

## Reproduction and scope

Run in the checkpoint's cluster directory:

```sh
python3 certify_small_anchor.py
```

Dependencies: python-flint 0.9.0 and SymPy. The output includes the whole-cell counts, positive lower bounds, omitted-tail constants, moment enclosure, symbolic identity checks, and the non-theta control. The tested run has zero unresolved cells. The analytic tail proof is displayed above; the executable checks its numerical constants and algebraic identities, rather than claiming to be a formal proof assistant.

The completed result is the global one-variable inequality (1) and its compact-coordinate small-anchor corollary. Still open:

- An explicit numerical endpoint for the global small-anchor range now proved in [the continuation](THETA_FINITE_ANCHOR_TAIL.md), and control of the remaining joint limits.
- The intermediate-anchor ratio inequalities for the first pair.
- Preservation of a sufficient property under every alternating reduction.
- The separate all-height arithmetic correlation-gain inequality in PR #39.

The [finite-anchor continuation](THETA_FINITE_ANCHOR_TAIL.md) now proves uniform tail bands by exact Green comparisons, and uses them to derive a common global small-anchor range. The next target is to compute an explicit endpoint for that range and control the remaining intermediate and coupled large-parameter domains.
