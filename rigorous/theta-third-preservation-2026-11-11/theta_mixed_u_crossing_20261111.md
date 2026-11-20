# The U source is positive and its next source changes sign once

Research continuation of PR #54, 11 November 2026. This note certifies
two scalar properties of the actual infinite theta kernel. They are
inputs to the new signed-source propagation argument, not an assumption
that every higher source is positive.

Use

$$
H=C/\kappa,\quad B=4C''/\kappa,\quad J=4\kappa''/\kappa,
\quad P=16C^{(4)}/\kappa,\quad Q=16\kappa^{(4)}/\kappa,
\quad U=64C^{(6)}/\kappa.
$$

With derivative rows in increasing order, set

$$
S_U=W_4(B',J',P',U'),\qquad
K_U=W_5(B',J',P',Q',U').
$$

**Theorem.** `S_U(t)>0` for every `t>0`. The function `K_U` has exactly
one zero on the positive spatial axis. It is simple, lies strictly in
`(1/2,9/16)`, and changes the sign from negative to positive.

The preceding PR #53 theorem puts the unique zero of
`S_Q=W_4(B',J',P',Q')` in `(0,3/16)`. Hence the new `K_U` crossing is
strictly later than that `S_Q` crossing. This ordering, as well as the
crossing orientation, matters in the companion propagation theorem.

## 1. Exact cleared determinants

The identities `C'=-t kappa/4` and repeated differentiation give

$$
U\kappa=-16\{t\kappa^{(5)}+5\kappa^{(4)}\}.
$$

Multiplying quotient Wronskians by the appropriate power of `kappa`
and eliminating repeated columns gives

$$
\boxed{S_U=-\frac{256}{\kappa^5}
W_5\bigl(\kappa,t\kappa',\kappa'',t\kappa''',
t\kappa^{(5)}+5\kappa^{(4)}\bigr),}
\tag{1}
$$

$$
\boxed{K_U=-\frac{4096}{\kappa^6}
W_6\bigl(\kappa,t\kappa',\kappa'',t\kappa''',
\kappa^{(4)},t\kappa^{(5)}\bigr).}
\tag{2}
$$

The signs are checked by free-column determinant identities. The
equivalent relation

$$
S_U=-5S_Q-\frac{256}{\kappa^5}
W_5(\kappa,t\kappa',\kappa'',t\kappa''',t\kappa^{(5)})
$$

is useful for comparing conventions with the earlier source notes.

The verifier uses memoized cofactor expansion. It shares subminors,
uses only addition and multiplication, and retains every outward-rounded
polynomial coefficient. Exact free-variable checks compare it with the
full permutation determinant at orders five and six.

## 2. Origin signs, with their forced powers removed

Set `u=t^2`, `K(u)=kappa(t)`. The six quotient columns become

$$
K,\quad -K-2uK',\quad 8K'+16uK'',
$$

$$
-24K'-96uK''-32u^2K''',
\quad 192K''+768uK'''+256u^2K^{(4)},
$$

$$
-960K''-5760uK'''-3840u^2K^{(4)}-512u^3K^{(5)}.
\tag{3}
$$

Let `D_S` be the five-column Wronskian of columns `1,2,3,4,6`, and
`D_K` the six-column Wronskian of all of (3), with derivatives in `u`.
The triangular chain-rule matrices have determinants `(2t)^10` and
`(2t)^15`. Therefore

$$
\frac{S_U}{t^{10}}=\frac{1024D_S}{K^5},\qquad
\frac{K_U}{t^{15}}=\frac{32768D_K}{K^6}.
\tag{4}
$$

Both extend analytically to zero. The code audits all six columns
through five derivatives and checks both chain-rule factors exactly.

The actual theta coefficients through degree 56 are enclosed using
16 modes, including the explicit omitted-mode coefficient error from
the fixed complex disk `|t|<=1/2`. The bound `|kappa|<40000` on that
disk gives `|[u^m]K|<=40000*4^m`. All required derivative tails through
order ten are bounded by geometric series on `0<=u<=9/256`.
Each derivative model has its own error enclosure; an artificial
constant interval error is never differentiated.

At 512-bit precision, 256 closed interval cells prove

$$
S_U/t^{10}>7.48\cdot10^{14},\qquad
K_U/t^{15}<-5.10\cdot10^{21}
\quad(0<t\le3/16),
\tag{5}
$$

including the strict limiting signs at zero. The displayed numbers are
conservative rational margins; full outward-rounded values are retained
in the replay.

## 3. Compact signs and a certified simple crossing

The compact calculation uses order-16 Taylor models for the actual
theta derivatives. For each cell centered at `m` with half-width `d`,
and for every needed `0<=j<=11`,

$$
\kappa^{(j)}(m+\delta)\in
\sum_{r=0}^{15}\frac{\kappa^{(j+r)}(m)}{r!}\delta^r
+\frac{\kappa^{(j+16)}([m-d,m+d])}{16!}\delta^{16},
\quad |\delta|\le d.
\tag{6}
$$

All derivatives through order 27 include explicit omitted theta modes.
The cell widths are at most `1/64` and satisfy
`width*pi*exp(right)<=1/8`. Full polynomial determinant products are
retained before interval evaluation.

If `V` is the cleared numerator in (2), then the exact derivative is

$$
\frac d{dt}\left(\frac{K_U}{t^{15}}\right)
=\frac{t(V'\kappa-6V\kappa')-15V\kappa}
{t^{16}\kappa^7}.
\tag{7}
$$

The derivative of the six-column Wronskian has row orders
`0,1,2,3,4,6`: differentiating any earlier row repeats the next row,
so that term vanishes. This calculates `V'` from actual derivative
models instead of differentiating an interval remainder.

The compact certificate covers the following closed regions:

| Region | Certified signs |
| --- | --- |
| `3/16<=t<=1/2` | `S_U>0`, `K_U<0` |
| `1/2<=t<=9/16` | `S_U>0`, `(K_U/t^15)'>0` |
| `9/16<=t<=4` | `S_U>0`, `K_U>0` |

The endpoint values of `K_U` are separately enclosed with opposite
signs at `1/2` and `9/16`. Strict increase of the normalized function
therefore gives exactly one zero in that bracket. At the zero,
`K_U'=t^15 (K_U/t^15)'>0`, so the zero is simple.

The recorded 512-bit replay uses 1,980 cells: 20 for the negative
`K_U` region, four for its normalized derivative, and 1,956 for the
positive `K_U` region. The `S_U` test runs on all 1,980 cells. The
following conservative rational bounds summarize the full enclosures:

| Quantity and domain | Strict bound |
| --- | ---: |
| `S_U` on `[3/16,4]` | `>34,000,000` |
| `K_U` on `[3/16,1/2]` | `<-3.33e10` |
| `(K_U/t^15)'` on `[1/2,9/16]` | `>1.03e22` |
| `K_U` on `[9/16,4]` | `>3.67e16` |

The endpoint enclosures give `K_U(1/2)<-2.646e16` and
`K_U(9/16)>3.761e16`.

For positive numerators the established decrease of `kappa` bounds the
denominator above by its left-endpoint value. The same upper denominator
gives a valid upper bound for a negative quotient. In (7), `t^16` is
bounded above by its right-endpoint value. No point sample is used to
infer a sign on a cell.

## 4. Exact first-mode signs in the infinite tail

Put `z=pi exp(t)` and

$$
P_0(z)=2z^2-3z,\qquad
P_{j+1}=(1/4-z)P_j+zP_j'.
$$

For the first theta mode,
`kappa_1^(j)=exp(t/4-z) P_j(z)`. Substitute these polynomials into
(1)--(2). The exponential factors cancel. The resulting rational
functions `S_U,1` and `K_U,1` satisfy

$$
S_{U,1}>1,\qquad K_{U,1}>1
\quad(z\ge160,\ t\ge4).
\tag{8}
$$

This is verified by shifting `z` to `z+160` and `t` to `t+4` in the
numerators and denominators of `S_U,1-1` and `K_U,1-1`. Every
coefficient is nonnegative, and each constant coefficient is strictly
positive. The two numerator coefficient counts are 68 and 88; their
degrees are 19 and 24. The denominators have degrees five and six.

The actual theta frequency obeys `z>160` for `t>=4`: the elementary
series bound gives `e>19/7`, and `3(19/7)^4>160`, while `pi>3`.

## 5. Complete-theta perturbation, including all required derivatives

Write `kappa=kappa_1(1+epsilon)` and `x=3/(2z)`. The normalized
contribution of mode `n>=2` is exactly

$$
n^4e^{-(n^2-1)z}
\left\{1+(1-n^{-2})\frac{x}{1-x}\right\}.
\tag{9}
$$

For `0<=j<=10` and `x<=3/320`, the positive series
`(x d/dx)^j[x/(1-x)]` is less than one; all eleven rational comparisons
are checked. The much coarser bound `2^18` for the amplitude derivatives
is consequently valid. The corresponding exponential derivatives have
Touchard coefficient norm at most `Bell(10)<2^17`, times
`n^20 z^10 exp(-(n^2-1)z)`. Leibniz contributes at most `2^10`.

The ratio of successive terms in
`sum_(n>=2)n^24 exp(-(n^2-1)z)` is below one half at `n=2,z=160`
and decreases thereafter. The sum is therefore bounded by twice its
first term. Altogether,

$$
|\epsilon^{(j)}(t)|\le
\delta(z):=2^{70}z^{10}e^{-3z}<1,
\qquad 0\le j\le10.
\tag{10}
$$

All modes in (9) are positive here, so `1+epsilon>=1`.
The logarithmic differentiation formula, with at most `2^10`
integer-partition terms and each bounded by `10!9! delta`, gives

$$
\left|\frac{d^j}{dt^j}\log(1+\epsilon)\right|
\le 2^{122}z^{10}e^{-3z}=:\eta(z)<1,
\quad1\le j\le10.
\tag{11}
$$

The explicit rational check is `2^10 10!9!<2^52`.

Let `r=-kappa'/kappa`, and `r_0` its first-mode counterpart. Then

$$
r_0=z-9/4-x/(1-x).
$$

The same rational series bounds show
`|r_0^(j)|<=2z` for `0<=j<=9`, and (11) gives
`|r^(j)-r_0^(j)|<=eta`. Both jet vectors therefore lie in the box
of radius `3z`; also `t<=z` on the actual tail.

Each source is an exact polynomial in `t,r,r',...,r^(9)`. To construct
it use `R_0=1`, `R_(m+1)=R_m'-r R_m`, so `R_m=kappa^(m)/kappa`, and

$$
B=tr-1,\quad J=4R_2,\quad P=-4(tR_3+3R_2),
\quad Q=16R_4,\quad U=-16(tR_5+5R_4).
$$

The product of the largest coefficient one-norm in each determinant
column, multiplied by the number of permutations, bounds the entire
polynomial coefficient one-norm. The exact results are

| Polynomial | Total degree bound | Coefficient one-norm bound |
| --- | ---: | ---: |
| `S_U` | 14 | 3,244,327,219,200 |
| `K_U` | 18 | 17,417,663,911,081,082,880 |

A polynomial of degree `d` and coefficient one-norm `A`, on that box,
changes by at most `d A (3z)^(d-1) eta` when each coordinate changes
by at most `eta`. The bound includes the sum over all coordinates;
the total monomial degree supplies that factor. Both resulting errors
are below `1/2` at `z=160` and decrease for larger `z`, since the
logarithmic derivative of `z^(d+9)e^(-3z)` is `(d+9)/z-3<0`.
The verifier checks these comparisons exactly using `e>2`.

Combining with (8) proves

$$
\boxed{S_U>1/2,\qquad K_U>1/2\qquad(t\ge4).}
\tag{12}
$$

This includes the complete theta series and every derivative used by
the source determinants. No single-mode replacement is treated as the
actual kernel.

## 6. Conclusion and reproduction

The origin certificate, the compact sign/crossing certificate, and
(12) cover every positive spatial point. They prove the theorem stated
at the start, including the ordering of its crossing after the fixed
earlier `S_Q` crossing.

Run the companion verifier with `--all`, or separately with `--exact`,
`--origin`, `--core`, and `--tail`. The callable `certify()` recomputes
the four components sequentially at 512-bit precision and returns their
combined record. It rejects optimized Python mode. The recorded checks
comprise 44 exact algebra checks, 28 exact tail checks, 256 origin cells,
and 1,980 compact cells; the four crossing-derivative cells are included
in that compact count. The fixed helpers are the
PR #53 copies of the original theta-jet and complex-disk coefficient
certificates. All required theta coefficients and derivative enclosures
are recomputed; no diagnostic values are read as mathematical inputs.

The scalar signs proved here must still be combined with the correct
signed-source comparison and the corresponding origin data to infer
a reduced-source sign. This component alone makes no six-node or RH
claim.
