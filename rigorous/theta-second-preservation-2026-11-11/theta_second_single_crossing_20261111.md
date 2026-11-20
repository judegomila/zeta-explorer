# Each higher theta source changes sign exactly once

**Role in the completed checkpoint.** This is a proof component. The [global theorem](theta_second_preservation_global_20261111.md) combines the source crossing, compensation, first-source origin, and second-origin results to prove second preservation and five-node positivity. Statements below limiting an individual component retain that local scope.


Research continuation, 11 November 2026. This note proves a global sign
pattern for the two source determinants that obstructed direct use of
the higher comparison theorem. It does not assume positivity of either
source everywhere.

Use the normalization and definitions of the companion source note:

$$
H=C/\kappa,\quad B=4C''/\kappa,\quad J=4\kappa''/\kappa,
\quad P=16C^{(4)}/\kappa,\quad Q=16\kappa^{(4)}/\kappa,
$$

$$
S_H=W_4(B',J',P',H'),\qquad S_Q=W_4(B',J',P',Q').
$$

**Theorem.** Each of $S_H,S_Q$ has exactly one zero on $(0,\infty)$.
That zero lies in $(0,3/16)$, is simple, and changes the sign from
negative to positive. The two zero locations are not asserted equal.

The proof combines an even-coordinate monotonicity certificate near
zero, a compact positive certificate, and the separate analytic tail
theorem. The entire positive spatial axis is covered.

## 1. Even coordinate and the derivative to certify

Put $u=t^2$, $K(u)=\kappa(t)$. The exact derivative-change identity is

$$
W_{4,t}(q_1',q_2',q_3',q_4')
=1024t^{10}W_{4,u}(q_{1,u},q_{2,u},q_{3,u},q_{4,u}).
$$

Thus $S_H/t^{10}$ and $S_Q/t^{10}$ extend analytically to zero.
Let the five columns be the $u$-derivatives of

$$
K,\quad KB=-K-2uK',\quad KJ=8K'+16uK'',
$$

$$
KP=-24K'-96uK''-32u^2K''',
$$

and either $8KH=8C$ or

$$
KQ=192K''+768uK'''+256u^2K^{(4)}.
$$

Write $D_H,D_Q$ for the resulting five-column Wronskians. Then

$$
\frac{S_H}{t^{10}}=\frac{1024D_H}{8K^5},\qquad
\frac{S_Q}{t^{10}}=\frac{1024D_Q}{K^5}.
$$

The derivative of a Wronskian with derivative rows $0,1,2,3,4$ is
the determinant with row orders $0,1,2,3,5$. Differentiating an earlier
row gives a repeated row and contributes zero. Consequently the two
strict monotonicity tests have cleared numerators

$$
K D_H'-5K'D_H>0,\qquad K D_Q'-5K'D_Q>0.
\tag{1}
$$

This uses actual theta derivatives through $K^{(9)}$. The implementation
never differentiates an interval error coefficient used to enclose an
unknown remainder.

## 2. Certified monotonicity from zero to 3/16

The prior complex-disk estimate $|\kappa(t)|<40000$ for $|t|\le1/2$
gives the Cauchy coefficient bound $|[u^j]K|\le40000\,4^j$.
Sixteen theta terms enclose all coefficients through degree 56,
including the omitted-theta error on that disk. For every derivative
order $0\le j\le9$, the discarded power series has a geometric
majorant on $0\le u\le9/256$. The geometric ratio is bounded by

$$
\frac9{64}\frac{58}{58-j}<1.
$$

The integrated identity

$$
C(\sqrt u)=C(0)-\frac18\int_0^u K(v)\,dv
$$

supplies the $C$ model and its explicit integrated remainder. The value
$C(0)$ is itself recomputed with rigorous finite integration and
theta/spatial-tail bounds. Each derivative remainder is enclosed
separately. Full polynomial products are retained before evaluating
the interval cells.

At 512-bit precision, 256 closed dyadic cells covering
$0\le u\le9/256$ give the conservative exact bounds

$$
\boxed{
\frac{d}{du}\left(\frac{S_H}{t^{10}}\right)>59{,}000{,}000,
\qquad
\frac{d}{du}\left(\frac{S_Q}{t^{10}}\right)
>179{,}000{,}000{,}000{,}000.}
\tag{2}
$$

The endpoint balls have the following signs; the printed centers are
only readable summaries of the full enclosures in the replay.

| Normalized source | Limit at $t=0$ | Value at $t=3/16$ |
| --- | ---: | ---: |
| $S_H/t^{10}$ | approximately $-1.0159763\times10^6$ | approximately $1.3091548\times10^6$ |
| $S_Q/t^{10}$ | approximately $-5.4365269\times10^{12}$ | approximately $1.3996616\times10^{12}$ |

Strict increase and opposite endpoint signs give one and only one
zero for each normalized source in this interval. Since $t>0$ at
the zero, multiplying by $t^{10}$ preserves its location, simplicity,
and sign orientation.

## 3. No further zeros on the compact region

For $3/16\le t\le4$, use the exact cleared expressions

$$
S_H=\frac{16}{\kappa^5}
W_5(\kappa,t\kappa',\kappa'',t\kappa''',C),
$$

$$
S_Q=\frac{256}{\kappa^5}
W_5(\kappa,t\kappa',\kappa'',t\kappa''',\kappa^{(4)}).
$$

Order-16 interval Taylor models enclose every theta jet through order
eight, with interval derivative bounds through order 24 for the
Lagrange errors. Starting from rigorous $C(4)$, the calculation
propagates $C$ backwards with absolute half-cell and full-cell
integration errors. The unknown remainder is never canceled by
parity. Every determinant product is retained.

The 1,980 closed dyadic cells cover the entire compact region and give

$$
S_H>0.0653,\qquad S_Q>65156.
\tag{3}
$$

The propagated and independently integrated values of $C(3/16)$
overlap. The positive denominator is bounded using the established
decrease of $\kappa$ on the positive axis.

## 4. The infinite tail and conclusion

The companion source-tail proof establishes

$$
S_H>1/2,\qquad S_Q>1/2\qquad(t\ge4)
$$

by exact first-theta-mode polynomial signs and a complete theta-series
error smaller than $2^{-100}$. Combining that proof with (2)--(3)
proves the stated global single-crossing theorem.

## Reproduction and scope

`theta_second_single_crossing_20261111.py` recomputes the two compact
certificates and audits the exact derivative identities. It imports
the same fixed PR #51 theta/C helpers used by the obstruction proof;
their provenance is recorded in `SOURCES.md`. The infinite tail is
checked separately by `theta_second_source_tail_20261111.py`.

A single source sign change is more information than a negative
witness, but does not by itself prove positivity after reduction.
That implication requires a comparison theorem controlling the signed
integral and a positive boundary value of the actual reduced source.
