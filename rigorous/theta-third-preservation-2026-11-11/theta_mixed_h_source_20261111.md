# A global negative fifth source Wronskian for the actual theta kernel

Research continuation, 11 November 2026. Define the original theta ratios

$$
H=C/\kappa,\quad B=4C''/\kappa,\quad J=4\kappa''/\kappa,
\quad P=16C^{(4)}/\kappa,\quad Q=16\kappa^{(4)}/\kappa,
\qquad C(t)=\frac14\int_t^\infty s\kappa(s)\,ds.
$$

This component proves

$$
\boxed{K_H(t):=W_5(B',J',P',Q',H')(t)<0\quad(t>0).}
\tag{1}
$$

The Wronskian convention is derivative rows zero through four. The
kernel is the actual infinite theta sum in the fixed PR #54 normalization.
Together with the separate oriented-compensation theorem, (1) closes
the global H half of the next mixed-source gate. The scalar inequality
by itself does not assert the P half or all-order canonical preservation.

## 1. Exact identities and endpoint normalization

Constant column elimination and the common-factor Wronskian identity give

$$
K_H=\frac{256}{\kappa^6}
W_6(\kappa,t\kappa',\kappa'',t\kappa''',\kappa^{(4)},C).
\tag{2}
$$

The coefficient is positive: the change from the displayed kernel columns
to `(kappa,kappa B,kappa J,kappa P,kappa Q,kappa H)` has determinant
`1*(-1)*4*(-4)*16*1=256`.

Set `u=t^2`, `K(u)=kappa(sqrt(u))`. The six even-coordinate columns
are the `u`-jets of

$$
K,\quad -K-2uK_u,\quad 8K_u+16uK_{uu},
$$
$$
-24K_u-96uK_{uu}-32u^2K_{uuu},
\quad 192K_{uu}+768uK_{uuu}+256u^2K_{uuuu},\quad 8C.
$$

Since `C_u=-K/8`, all their required jets are polynomial expressions
in the first ten `K` jets and `C`. If `D_6(u)` is their six-column
Wronskian in `u`, then

$$
\frac{K_H(t)}{t^{15}}=\frac{2^{15}D_6(t^2)}{8K(t^2)^6}.
\tag{3}
$$

The power fifteen is `1+2+3+4+5`; the factor eight comes from the
chosen last column. This is an analytic origin deflation, with no
division by a small sampled spatial point.

The exact verifier checks all 36 even-column jets, the kernel-column
factor, the coordinate factor, five `C` jets, and the division-free
six-column determinant recursion against the full permutation formula.

## 2. Rigorous origin interval

On `0<=u<=9/256`, corresponding to `0<=t<=3/16`, use a degree-56 even
Taylor polynomial for `K` from sixteen theta modes. The immutable
origin helper supplies a bound for the omitted theta modes on a complex
disk and Cauchy bounds for every derivative remainder through order nine.
The `C` model integrates the same polynomial and includes its own
explicit remainder and an independently enclosed `C(0)`.

All determinant products are polynomial products with outward-rounded
ball coefficients; no terms are discarded. On 256 closed interval cells,
at 512-bit precision, the certificate gives

$$
\frac{K_H(t)}{t^{15}}<-5.59\cdot10^{12}
\quad(0<t\le3/16).
\tag{4}
$$

Its origin enclosure is approximately
`-6655818333882.956 +/- 0.000360`, strictly negative. The quoted decimal
is only a readable rendering; the interval comparison in the verifier
establishes the sign. Different derivative remainders are enclosed
separately; none is obtained by differentiating an artificial constant
error ball.

## 3. Rigorous compact interval away from zero

The interval `3/16<=t<=4` is covered by 1,980 closed Taylor cells. Cell
widths are dyadic, chosen so that `width*pi*exp(right)<=1/8`, with maximum
width `1/64`. Each kernel jet through order nine uses a degree-fifteen
Taylor polynomial plus the full order-sixteen Lagrange remainder.
The theta helper encloses jets through order twenty-five, including all
omitted modes. The arithmetic precision is 512 bits.

`C` is propagated backwards from its rigorously enclosed value at `4`.
If `r` is a cell radius and `M` bounds the order-sixteen integral
remainder coefficient, the center error is `Mr^17` and the full-cell
error is `2Mr^17`. The polynomial for `C` includes this error with its
actual degree-seventeen factor. This avoids subtracting a long integral
from a nearly equal initial value.

The determinant in (2), with last column `4C` and outside factor `64`,
is evaluated as a polynomial on each cell. Every numerator enclosure is
strictly negative. Dividing a negative numerator by an upper bound on
`kappa^6` gives a valid upper bound on `K_H`. The recorded common bound is

$$
K_H(t)<-63.15\quad(3/16\le t\le4).
\tag{5}
$$

The backwards enclosure of `C(3/16)` overlaps its independently
calculated direct enclosure. This is a consistency check in addition
to the explicit integration-error proof.

## 4. The complete infinite spatial tail

Put `z=pi exp(t)`. For `t>=4`, one has `z>160`; the rational check uses
`pi>3`, `exp(1)>19/7`, and `3(19/7)^4>160`. Also `t<z`.

### First theta mode and its integrated ratio

Write

$$
\kappa_1(t)=e^{t/4-z}(2z^2-3z),\qquad
r_0=-\kappa_1'/\kappa_1=z-\frac94-\frac3{2z-3},
\quad h_0=\frac{1}{4\kappa_1(t)}\int_t^\infty s\kappa_1(s)\,ds.
$$

Let `D=partial_t+z partial_z`, and use the explicit approximation

$$
H_4=\frac{64z^3t+80z^2t+64z^2+116zt+96z+177t+140}{256z^4}.
$$

Its residual is exactly

$$
R_4=DH_4-r_0H_4+t/4
=\frac{2082zt+1760z+5841t+2496}{1024z^4(2z-3)}.
\tag{6}
$$

Shifted rational-polynomial coefficient checks at `z=160+X,t=4+Y`
prove `R_4>0`, `DR_4<0`, `r_0>z/2`, and `Dr_0>z`. The decaying
integrating-factor solution therefore gives

$$
0<h_0-H_4
=\int_t^\infty\frac{\kappa_1(s)}{\kappa_1(t)}R_4(s)\,ds
<\frac{R_4(t)}{r_0(t)}.
\tag{7}
$$

The first-mode determinant in (2) is affine in `h_0`, say
`K_H,1=A(t,z)h_0+C(t,z)`. Its exact derivative-polynomial construction
is replayed by the script. The same shifted coefficient method proves

$$
A>0,\qquad
A\left(H_4+R_4/r_0\right)+C<-1
\quad(z\ge160,t\ge4).
\tag{8}
$$

Thus `K_H,1<-1` on the entire first-mode tail. The integral error in
`h_0` has been included before assigning the determinant sign.

### Every omitted theta mode and derivative

Write `kappa=kappa_1(1+E)` on the positive tail. Directly from the theta
series,

$$
E=\sum_{n\ge2}
\left[n^4+\frac{3(n^4-n^2)}{2z-3}\right]e^{-(n^2-1)z}.
$$

For every spatial derivative order `0<=j<=10`,

$$
|E^{(j)}|\le 2^{70}z^{10}e^{-3z}=:\delta(z).
\tag{9}
$$

Here are the constants used in (9). The geometric expansion of
`3/(2z-3)` has parameter at most `3/320`. Its derivatives through order
ten are bounded by `2^17`. Thus derivatives of the bracketed prefactor
are bounded by `2^18 n^4`. The derivative polynomials of the exponential
have coefficient norm at most `Bell(10)<2^17`, giving a bound
`2^17 n^20 z^10 exp(-(n^2-1)z)`. Leibniz contributes at most `2^10`.
The `n^24` series has successive ratio below one half and sum below
`2*2^24 exp(-3z)`. Multiplying these bounds gives exactly `2^70`.

For `r=-kappa'/kappa`, the finite derivative formula for `log(1+E)`
and `delta<1` give

$$
|r^{(j)}-r_0^{(j)}|
\le2^{122}z^{10}e^{-3z}=:\varepsilon(z)
\quad(0\le j\le8).
\tag{10}
$$

For a derivative through order ten, at most `2^10` integer partitions
contribute and each coefficient is at most `10!9!`. Their product is
below `2^52`; each derivative product is bounded by `delta` and each
denominator `(1+E)^m` is at least one. This proves the conservative
constant in (10).

The integrated ratio is controlled as well. Every summand of `E`
decreases. The positive first-mode integral gives
`h_0/(1+E(t))<=H<=h_0`. Since `r_0` increases,

$$
h_0\le\frac14\left(\frac{t}{r_0(t)}+\frac1{r_0(t)^2}\right)<1.
$$

Therefore `|H-h_0|<=E(t)h_0<=delta<=epsilon`. No omitted integral
tail is left outside the error estimate.

### Error in the full determinant

Using `H'=rH-t/4`, write `K_H` as a polynomial in
`t,H,r,r',...,r^(8)`. It has degree at most eighteen. A determinant
expansion bounds its coefficient norm by five factorial times the
product of the maximum column norms. The exact computed column bounds
are

$$
6,\quad132,\quad4356,\quad43312,\quad253/4,
$$

whose product times `5!` is `1134130596572160<2^80`.

The geometric derivative formulas also give `|r_0^(j)|<2z` through
order eight; the verifier checks the sharper intermediate sums through
order ten at `3/320`. Equation (10) and `epsilon<1` consequently put
every coordinate along the segment from the first-mode evaluation to
the actual theta evaluation inside `[-3z,3z]`. The polynomial difference
bound is

$$
|K_H-K_{H,1}|
\le18\,2^{80}(3z)^{17}\varepsilon(z)
=18\,2^{80}3^{17}2^{122}z^{27}e^{-3z}<\frac12.
\tag{11}
$$

The last majorant decreases for `z>=160`; its endpoint is bounded by
replacing `exp(-480)` with `2^-480`. The displayed strict inequality
is an exact rational check. Combining (8) and (11) proves

$$
\boxed{K_H(t)<-\frac12\quad(t\ge4).}
\tag{12}
$$

Equations (4), (5), and (12) prove (1) over the complete positive axis.

## 5. Reproduction and dependencies

Run `python theta_mixed_h_source_20261111.py` with the pinned requirements.
It recomputes the interval models and tail expressions and writes
`theta_mixed_h_source_replay_20261111.json`. The component uses 44 exact
identity checks, 42 tail algebra and rational-bound checks, 256 origin
cells, and 1,980 compact spatial cells. Stored replays are outputs only.

The three proof helpers are byte-identical copies of
`theta_ratio_core_certificate_20261110.py`,
`theta_ratio_origin_certificate_20261110.py`, and
`theta_ratio_c_integral_20261110.py` from PR #53, immutable commit
`5d64d45acf37f4957a8f65c036b502e1b49292d0`. They supply fully bounded
theta jets, the complex-disk Taylor remainder, and finite-interval
integrals with explicit improper tails. Their declared earlier
comparison assumptions remain fixed proof dependencies.

The new fifth-source sign, determinant identities, cell certificates,
and analytic tail proof are given here. The separate compensation note
explains why this negative source orientation yields the positive
global H mixed-source inequality. No external peer review, formal
proof-assistant validation, or literature-novelty claim is made.
