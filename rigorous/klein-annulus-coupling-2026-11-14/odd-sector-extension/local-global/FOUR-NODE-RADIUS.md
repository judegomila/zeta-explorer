# Explicit positivity for up to four odd theta nodes

Validated continuation, 14 November 2026. The calculation combines the independently derived fourth odd Taylor block with uniform Newton divided-difference remainder bounds. All arithmetic used to assert positivity is outward-rounded interval arithmetic. The node coordinates are Mellin input distances from the cutoff for actual unheated theta; the radius is not a spectral distance between xi zeros or a dynamical trapping radius.

## Certified statement

For the actual theta cutoff kernel at `alpha=1`, let

\[
\boxed{\delta_4=\frac1{100000}=10^{-5}.}
\]

For every `N=1,2,3,4` and every distinct collection `0<x_a<=delta_4`,

\[
\boxed{[H_-(x_a,x_b)]_{a,b=1}^N\succ0.}
\]

The coefficients tested against this matrix may be arbitrary complex numbers. The nodes require no minimum separation. The result rescales to every `alpha>0` and translates with the cutoff. It concerns antisymmetric pairs in the full kernel, with up to eight centers `±x_a`; it is not unrestricted eight-center positivity or arbitrary-node-count positivity.

The variables `x_a` are distances from the cutoff in the Mellin input coordinate, with the frozen normalization `xi(1/2+z)=integral kappa(u)exp(zu/2)du`. The radius is a range for the energy-test inputs. It is not a distance between xi zeros or a dynamical capture radius for those zeros.

For four nodes at `alpha=1`, an additional explicit determinant estimate is

\[
\det[H_-(x_a,x_b)]_{a,b=1}^4
\ge 8.1217\times10^{-13}
\left(\prod_{a=1}^4x_a^2\right)
\left(\prod_{a<b}(x_b^2-x_a^2)^2\right)>0.
\tag{1}
\]

The small radius is a conservative validated range. A failed interval test at the larger trial `1/10000` was inconclusive, not evidence of negative energy. No optimization or maximal-radius claim is made.

## 1. Newton coordinates remove the coalescence difficulty

Write `H_-(x,y)=xy G(x^2,y^2)` and `X_a=x_a^2`. Let

\[
D_{ij}=G[X_1,\ldots,X_{i+1};X_1,\ldots,X_{j+1}],
\qquad0\le i,j<4.
\]

This is an invertible congruence of the evaluation Gram for distinct nodes. Its limiting matrix at complete coalescence is the leading Taylor coefficient block `J_4=(g_ij)`. The integral formula for divided differences shows that each `D_ij` averages `partial_X^i partial_Y^j G/(i!j!)` at convex combinations of nodes.

Let `d=delta_4^2`. If `M_ab` bounds `|partial_X^a partial_Y^b G|` on `[0,d]^2`, the exact entry error satisfies

\[
\boxed{
|D_{ij}-g_{ij}|
\le\frac{d}{i!j!}(M_{i+1,j}+M_{i,j+1}).
}
\tag{2}
\]

No factor involving a node gap occurs. The script encloses each true entry in the corresponding interval `J_ij + [-E_ij,E_ij]`, then performs interval LDL elimination on this whole interval matrix. The analytical congruence and determinant factorization are proved in [local-to-global.md](local-to-global.md).

## 2. A positive-weight identity supplies the derivative bounds

For an odd analytic function `h`, set `q(X)=h(sqrt(X))/sqrt(X)` with its continuous value at zero. Then

\[
q^{(k)}(X)=\frac1{4^k k!}
\int_0^1(1-s^2)^k h^{(2k+1)}(s\sqrt X)\,ds.
\tag{3}
\]

For `h(x)=x^(2m+1)`, the beta integral on the right is zero for `m<k`, and is exactly `m!/(m-k)! X^(m-k)` for `m>=k`, matching the left side. Locally uniform power-series convergence establishes the identity for analytic `h`. The weight is positive and its total mass is `k!/(2k+1)!`.

Applying (3) twice gives

\[
M_{ab}\le
\frac{a!b!}{(2a+1)!(2b+1)!}
\sup_{|x|,|y|\le\delta_4}
|\partial_x^{2a+1}\partial_y^{2b+1}H_-(x,y)|.
\tag{4}
\]

For (2), the largest required orders are `(a,b)=(4,3)` and its transpose, so the physical theta derivatives needed for these bounds run only through order nine.

For odd `m,n`, differentiate the fixed-limit cutoff integral. The absolute derivative is bounded by twice the integral of

\[
(2r+2\delta_4)K_m(r)K_n(r)
+mK_{m-1}(r)K_n(r)
+nK_m(r)K_{n-1}(r),
\tag{5}
\]

where `K_j(r)` bounds `|kappa^(j)(r-x)|` uniformly for `|x|<=delta_4`. The factor two includes the two reflected terms defining `H_-`.

The code evaluates (5) on each whole interval of a 512-panel partition of `[0,3]`, using the shifted argument interval `r+[-delta_4,delta_4]`. Multiplying a whole-panel enclosure by its width directly bounds the integral. No midpoint quadrature approximation or unbounded quadrature remainder is involved in these derivative envelopes.

## 3. Complete series and tail coverage

The exact polynomial recurrence is

\[
P_0(v)=2v^2-3v,
\qquad P_{j+1}(v)=(1/4-v)P_j(v)+vP_j'(v).
\]

Let `C_j` be the sum of the absolute coefficients of `P_j`. For `u>=-delta_4`, the omitted terms after six theta terms satisfy the geometric bound

\[
T_j\le
\frac{C_j\pi^{j+2}7^{2j+4}
\exp[-(j+9/4)\delta_4-49\pi e^{-\delta_4}]}
{1-(8/7)^{2j+4}\exp[-15\pi e^{-\delta_4}]}.
\tag{6}
\]

The envelope decreases in `u` because `49 pi exp(-delta_4)>j+9/4`; successive envelope ratios decrease in the series index. The code checks these inequalities in interval arithmetic, including the derivatives through order 17 needed by the separate Taylor-block integration.

For `r>=R=3`, put

\[
E_j(u)=2C_j\pi^{j+2}
e^{(j+9/4)u-\pi e^u}.
\]

The entire derivative series is bounded by `E_j`, and this envelope decreases on `u>=R-delta_4`. Every shifted derivative is therefore bounded by `E_j(r-delta_4)`. For a product of derivative orders `m,n`, write

\[
A=R-\delta_4,\quad p=m+n+9/2,
\quad\beta=2\pi e^A-p>0,
\]

\[
Q=(2C_m\pi^{m+2})(2C_n\pi^{n+2})e^{pA-2\pi e^A}.
\]

Using `exp(v)>=1+v` gives the complete tail bounds

\[
\int_R^\infty E_m(r-\delta_4)E_n(r-\delta_4)\,dr
\le Q/\beta,
\]

\[
\int_R^\infty(2r+2\delta_4)E_m(r-\delta_4)E_n(r-\delta_4)\,dr
\le Q\left(\frac{2R+2\delta_4}{\beta}+\frac2{\beta^2}\right).
\tag{7}
\]

The script adds (7) to the finite-panel bound (5), then applies (4). Thus the whole infinite series and whole integration domain are covered.

## 4. Taylor block and final positivity check

The script is self-contained. It first reconstructs `J_4` from the exact derivative-moment formulas. It integrates `I_j=integral_0^infinity r[kappa^(j)(r)]^2 dr`, `j=1,...,7`, with 128 midpoint Taylor panels, degree-nine polynomials and explicit tenth-derivative remainders. Derivatives through order 17 and all infinite tails are enclosed. This duplicates the mathematical method of the companion fourth-block certificate; it does not rely on rounded JSON values as certificate inputs.

It then enlarges the entries by (2). Interval LDL yields the following outward-rounded enclosures for the pivots of **every exact Newton matrix** in the stated node box:

| Pivot | Lower bound | Upper bound |
|---|---:|---:|
| 1 | 0.021764604084393145 | 0.02176460464394987 |
| 2 | 0.0040275137653352985 | 0.004027536958413124 |
| 3 | 0.00032522704486402177 | 0.00032616581770109374 |
| 4 | 0.00002848895811277370 | 0.00007015096701080491 |

All lower endpoints are positive. The determinant of the four-by-four Newton matrix is enclosed by

\[
\det D\in[8.121776319949019\times10^{-13},
           2.0056836020764787\times10^{-12}],
\]

which, combined with the exact Vandermonde factorization, gives (1). These are Newton-coordinate margins; they are not a uniform lower eigenvalue bound for raw point-evaluation matrices whose nodes can coalesce.

## Reproduction and trust basis

Run:

```sh
python3 theta-odd-four-node-radius.py
```

The successful default radius is exactly `1/100000`. The script writes [theta-odd-four-node-radius-1-100000.json](theta-odd-four-node-radius-1-100000.json), retaining the interval entries, every derivative-envelope bound, tail bounds, and full interval strings for pivots and determinants. It requires mpmath 1.3.0 and uses 50 decimal digits for interval operations. A replay takes approximately five seconds in the current environment.

Every parameter and polynomial coefficient used in certified arithmetic is an integer, exact rational, or interval. Binary floats are used only for displayed output, with endpoints widened outward by one IEEE ulp. The trust basis is the stated outward-rounded interval implementation and the proved analytic bounds, not formal proof-assistant verification.
