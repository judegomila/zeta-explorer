# A positive fixed U source for the next theta comparison

Research continuation, 11 November 2026. With the original theta pair
`(C,kappa)`, define

$$
B=4C''/\kappa,\quad J=4\kappa''/\kappa,\quad
P=16C^{(4)}/\kappa,\quad U=64C^{(6)}/\kappa.
$$

The global result of this note is

$$
\boxed{S_U(t):=W_4(B',J',P',U')(t)>0\qquad(t>0).}
\tag{1}
$$

Every Wronskian uses derivative rows in increasing order, beginning
at zero. This is the fixed positive-density hypothesis used by the
companion P-source orientation theorem. That theorem also requires
the separately certified sign transition of
`K_U=W_5(B',J',P',Q',U')`; (1) alone does not prove the global mixed
P-source inequality.

## 1. Exact column and even-variable formulas

Since `C'=-t kappa/4`,

$$
64C^{(6)}=-16t\kappa^{(5)}-80\kappa^{(4)}.
$$

Append the constant column before differentiating the four ratios,
multiply every column by `kappa`, and eliminate the lower columns.
The resulting exact factor is

$$
\boxed{S_U=-\frac{256}{\kappa^5}
W_5(\kappa,t\kappa',\kappa'',t\kappa''',
t\kappa^{(5)}+5\kappa^{(4)}).}
\tag{2}
$$

In the even variable `u=t^2`, let `k(u)=kappa(t)`. The five columns
before division by `k` are

$$
\begin{aligned}
k,&\\
Bk&=-k-2u k_u,\\
Jk&=8k_u+16u k_{uu},\\
Pk&=-24k_u-96u k_{uu}-32u^2 k_{uuu},\\
Uk&=-960k_{uu}-5760u k_{uuu}-3840u^2k_{uuuu}
      -512u^3k_{uuuuu}.
\end{aligned}
\tag{3}
$$

Their `u`-Wronskian, denoted by `D_U(u)`, satisfies

$$
\boxed{\frac{S_U(t)}{t^{10}}=
\frac{2^{10}D_U(u)}{k(u)^5}.}
\tag{4}
$$

The power ten is the sum `1+2+3+4` of the derivative orders. It is
removed exactly before evaluating the origin. The verifier checks
(2), all differentiated columns of (3) through row four, and the
sixth-derivative identity for `C`. No small floating-point value of
`t` is substituted for the origin limit.

## 2. Origin certificate

The fixed theta even-series helper supplies degree-56 polynomials
for `k` and its first nine `u` derivatives, with rigorous differentiated
Cauchy remainders on `0<=u<=9/256`. It retains sixteen theta modes;
the omitted modes are bounded independently.

At 512-bit precision, 256 closed interval cells prove

$$
\boxed{S_U(t)/t^{10}>7.48\times10^{14}
\qquad(0<t\le3/16).}
\tag{5}
$$

The separately enclosed origin value is approximately
`8.57194061747997857e14`; its rigorous enclosure and all remainder
constants are in the replay. Interval determinant arithmetic evaluates
the pointwise derivative enclosures from (3). It does not differentiate
an unspecified remainder interval as if that interval were a constant
function.

## 3. Compact spatial certificate

The interval `[3/16,4]` is covered by 1,980 closed dyadic cells. Cell
widths are selected so that `width*pi*exp(right)<=1/8`. On each cell,
the verifier constructs degree-16 spatial Taylor enclosures for
`kappa^(j)`, `0<=j<=9`, from midpoint jets and an interval enclosure
of the sixteenth-order remainder derivative on that same cell.

The determinant in (2) is evaluated as a polynomial in the common
cell displacement, preserving cancellations between its columns.
The infinite theta sum is enclosed by the fixed `ThetaJets` helper
using sixteen retained modes plus its explicit differentiated tail.

Every cell has a strictly positive numerator and denominator. The
recorded conservative lower bound gives

$$
\boxed{S_U(t)>34{,}000{,}000\qquad(3/16\le t\le4).}
\tag{6}
$$

The denominator bound uses the interval upper bound for `kappa` on
each cell, so no separate assumption about its monotonicity is needed.

## 4. Analytic proof on the full spatial tail

Put `z=pi exp(t)` and let `kappa_0` be the first theta mode,

$$
\kappa_0=e^{t/4}(2z^2-3z)e^{-z}.
$$

If `p_0(z)=2z^2-3z`, the normalized polynomial jets obey

$$
p_{j+1}=(1/4-z)p_j+z\partial_zp_j,
\qquad \kappa_0^{(j)}=e^{t/4-z}p_j(z).
\tag{7}
$$

Substituting these exact polynomials into (2) produces a rational
function `S_U,0(t,z)` with denominator `(2z-3)^5`. The numerator and
denominator of `S_U,0-1`, after the substitutions
`z=Z+160,t=T+4`, have respectively 68 and 6 nonzero coefficients,
all strictly positive. The verifier recomputes the determinant and
these coefficient signs with exact rational arithmetic. Therefore

$$
S_{U,0}>1\qquad(t\ge4,z\ge160).
\tag{8}
$$

The actual curve `z=pi exp(t)` lies strictly inside that region when
`t>=4`. The elementary bounds `pi>3` and `exp(1)>19/7`, whose latter
inequality follows already from the first six exponential-series terms,
give `pi exp(4)>160`.

### Differentiated omitted-mode bound

Write `kappa=kappa_0(1+R)`. The mode remainder is

$$
R=\sum_{n\ge2}A_n(z)e^{-(n^2-1)z},\qquad
A_n=n^4+(n^4-n^2)\frac{3}{2z-3}.
\tag{9}
$$

For `z>=160`, set `x=3/(2z)<=3/320`. The derivatives of
`x/(1-x)` are bounded using the positive series
`(x partial_x)^j[x/(1-x)]`. Exact rational evaluation at `x=3/320`
shows that each is below one for `0<=j<=10`. Thus the same derivatives
of `A_n` are bounded even by `2n^4`; the following estimate uses the
looser bound `2^18 n^4` to share the constants of the companion H
certificate.

The first ten spatial derivatives of the exponential factor are
bounded by the Touchard-polynomial majorant
`2^17 n^20 z^10 exp(-(n^2-1)z)`. Leibniz contributes at most `2^10`.
The ratio of consecutive terms in
`n^24 exp(-(n^2-1)z)` is at most
`(3/2)^24 exp(-5z)<1/2`, so summing them contributes at most
`2*2^24 exp(-3z)`. Consequently,

$$
\max_{0\le j\le10}|R^{(j)}|
\le\delta(z):=2^{70}z^{10}e^{-3z}.
\tag{10}
$$

This majorant is below one and decreases for all `z>=160`. Since
`R>=0`, the denominators in derivatives of `log(1+R)` are at least
one. The finite set-partition formula for those derivatives, or its
Bell-polynomial form, bounds each by at most `2^52 delta` through
order ten. An exact conservative factorial bound is checked in the
script. Therefore, for

$$
r=-\kappa'/\kappa,\qquad
r_0=z-9/4-3/(2z-3),
$$

$$
\max_{0\le j\le9}|r^{(j)}-r_0^{(j)}|
\le\varepsilon(z):=2^{122}z^{10}e^{-3z}.
\tag{11}
$$

The same rational-series bounds show `|r_0^(j)|<2z`, while
`epsilon<1`; thus all actual and first-mode ratio jets needed below
are bounded by `3z`.

### Determinant perturbation

The normalized theta derivatives are differential polynomials in `r`,
generated by `K_0=1,K_(j+1)=K_j'-r K_j`. In this notation,

$$
B=tr-1,\quad J=4K_2,\quad P=-4tK_3-12K_2,
\quad U=-16tK_5-80K_4.
$$

The source `S_U` is a polynomial in `t,r,r',...,r^(8)` of total degree
at most 14. The maximum coefficient sums of the four derivative
columns are `5,68,1556,255520`. Hence its coefficient sum is at most

$$
4!\,(5)(68)(1556)(255520)=3{,}244{,}327{,}219{,}200<2^{42}.
$$

For a polynomial of degree at most `d` and coefficient sum `L`,
changing each variable by at most `epsilon`, while both sets of
variables are bounded by `M`, changes its value by at most
`d L M^(d-1) epsilon`. Apply this with `d=14,L<2^42,M=3z`,
noting `t<=z`. Equation (11) gives

$$
|S_U-S_{U,0}|
<14\,2^{42}\,3^{13}\,2^{122}\,z^{23}e^{-3z}.
\tag{12}
$$

This bound decreases on `z>=160`. At 160 it is less than one half,
as checked with exact rationals after replacing `exp(-480)` by
`2^(-480)`. Combining with (8) proves

$$
\boxed{S_U(t)>1/2\qquad(t\ge4).}
\tag{13}
$$

Equations (5), (6), and (13) cover the complete positive spatial
axis and prove (1).

## 5. Verification and dependencies

Run the component with the pinned project arithmetic dependencies:

```sh
python theta_mixed_u_source_20261111.py --all
```

The combined replay contains seven exact algebra checks, 256 origin
cells, 1,980 compact cells, and 26 exact rational tail checks. The
tail checks include the 68+6 shifted coefficient sign checks as two
aggregate assertions; they are not counted again as independent tests.

The interval work uses the immutable project `ThetaJets` and even
origin-series helpers from PR #53. Their theta truncation, derivative
tail, and Cauchy-remainder lemmas are declared fixed inputs. No moment
integral or `C`-quadrature is needed for this source. Exploratory point
values from the `--probe` command are not inputs to the certificate.

The logical use of (1) is specified in
`theta_mixed_identity_20261111.md`. External peer review, formal
proof-assistant verification, and literature novelty are not asserted.
