# Certified third and fourth odd Taylor blocks for actual theta

Research continuation, 14 November 2026. Normalization: `alpha=1`, cutoff translated to zero, and the same actual theta kernel as the preceding two-feature certificate. Every `alpha>0` multiplies the entire coefficient matrix by `alpha` and preserves positivity.

## Result

The leading **4 by 4 odd Taylor coefficient block**, corresponding to the monomials `(x,x^3,x^5,x^7)`, is strictly positive definite. Its leading 3 by 3 block is therefore also strictly positive definite.

An outward-rounded interval LDL decomposition gives these enclosures, with displayed endpoints widened outward:

| Pivot | Lower bound | Upper bound |
|---|---:|---:|
| 1 | 0.021764604364171467 | 0.02176460436417155 |
| 2 | 0.004027525361856146 | 0.004027525361892872 |
| 3 | 0.00032569643032535157 | 0.0003256964374525309 |
| 4 | 0.00004937724842173496 | 0.00004937807603798925 |

In particular, the leading determinants are enclosed by

\[
\det J_2\in[8.765749606746557\times10^{-5},
             8.765749606826519\times10^{-5}],
\]

\[
\det J_3\in[2.854973356043209\times10^{-8},
             2.8549734185443205\times10^{-8}],
\]

\[
\boxed{\det J_4\in[1.4097072863877992\times10^{-12},
                   1.4097309454731956\times10^{-12}]>0.}
\]

The certificate is an interval calculation with explicit analytical errors, not an eigenvalue sign inferred from a floating-point computation. It uses six theta terms, 128 panels on `[0,3]`, midpoint Taylor integration with a tenth-derivative remainder, and explicit bounds for every omitted series term and the entire infinite moment tail. The replay takes about two seconds in the reference environment.

By the fixed-order divided-difference argument for symmetric analytic kernels, `J_4>0` implies that **there is a neighborhood of the cutoff in which every configuration of at most four distinct positive nodes has a positive-definite odd Gram**, with arbitrary complex coefficients and without a minimum node separation. In the full cutoff kernel, the four-node case corresponds to eight symmetric centers with antisymmetric coefficients. This statement supplies no explicit radius, no unrestricted eight-center theorem, and no all-orders positivity. The separate [four-node radius certificate](../local-global/FOUR-NODE-RADIUS.md) supplies the explicit radius `1/100000`; the Taylor-block certificate itself is independent of that additional estimate.

## 1. Exact Taylor coefficients and integration by parts

Use

\[
H_0(x,y)=\int_0^\infty(2r-x-y)\kappa(r-x)\kappa(r-y)\,dr,
\qquad H_-(x,y)=H_0(x,y)-H_0(x,-y).
\]

For odd positive integers `m,n`, its coefficient of `x^m y^n` is

\[
J_{mn}=\frac{2}{m!n!}
\int_0^\infty\left[
2r\kappa^{(m)}\kappa^{(n)}
+m\kappa^{(m-1)}\kappa^{(n)}
+n\kappa^{(m)}\kappa^{(n-1)}
\right]dr.
\tag{1}
\]

The plus signs in the last two terms arise because differentiating the two negative linear factors changes the parity of the remaining Taylor coefficients. Subtracting `H0(x,-y)` doubles every odd `y` coefficient.

Let

\[
I_j=\int_0^\infty r[\kappa^{(j)}(r)]^2dr,
\qquad k_j=\kappa^{(j)}(0),
\]

\[
U_{ab}=\int_0^\infty\kappa^{(a)}\kappa^{(b)}dr,
\qquad T_{ab}=\int_0^\infty r\kappa^{(a)}\kappa^{(b)}dr.
\]

For the parities that occur here, symmetry and integration by parts give

\[
U_{ab}=-k_a k_{b-1}-U_{a+1,b-1},
\qquad U_{j,j+1}=-k_j^2/2,
\tag{2}
\]

\[
T_{ab}=-U_{a,b-1}-T_{a+1,b-1},
\qquad T_{jj}=I_j.
\tag{3}
\]

These recurrences are used when `a<b`, after transposing indices if necessary. Evenness gives `k_j=0` for odd `j`, and rapid decay removes the boundary terms at infinity. Equation (3) has no origin boundary contribution because of its factor `r`.

The ten distinct entries of the leading four-feature block are therefore

\[
\begin{aligned}
J_{11}&=4I_1-2k_0^2,\\
J_{13}&=-2I_2/3-k_0k_2/3,\\
J_{15}&=I_3/30-k_0k_4/60,\\
J_{17}&=-I_4/1260-k_0k_6/2520+k_2k_4/1260,\\
J_{33}&=I_3/9-k_2^2/6,\\
J_{35}&=-I_4/180-k_2k_4/120,\\
J_{37}&=I_5/7560-k_2k_6/5040,\\
J_{55}&=I_5/3600-k_4^2/1440,\\
J_{57}&=-I_6/151200-k_4k_6/60480,\\
J_{77}&=I_7/6350400-k_6^2/1814400.
\end{aligned}
\tag{4}
\]

The additional boundary term in `J17` is retained. The first three entries reproduce the earlier two-feature formulas.

As an independent algebraic check, [coefficient-reduction-audit.py](coefficient-reduction-audit.py) computes equation (1) by exact polynomial-Gaussian integration and compares it with equations (2)–(3), entry by entry, on two controls. The pure Gaussian gives the zero odd block. The earlier negative control `(1+u²/10+u⁴/300)e^-u²` gives the known negative 2 by 2 determinant `-29/1350000000` and exact rank two of its 4 by 4 Taylor block. All assertions pass; the [JSON record](coefficient-reduction-audit.json) retains the exact matrices.

## 2. Theta derivatives and all omitted terms

For `u>=0`, write

\[
\kappa(u)=e^{u/4}\sum_{n\ge1}P_0(v_n)e^{-v_n},
\quad v_n=\pi n^2e^u,
\quad P_0(v)=2v^2-3v.
\]

The exact derivative recurrence is

\[
P_{j+1}(v)=(1/4-v)P_j(v)+vP_j'(v).
\tag{5}
\]

All polynomial coefficients are formed as exact rational numbers before conversion to intervals. If `C_j` is the sum of their absolute values, then for `v>=1`,

\[
|P_j(v)|\le C_jv^{j+2}.
\]

The omitted derivative series after `N=6` terms is bounded, uniformly for every `u>=0`, by

\[
E_j=\frac{C_j\pi^{j+2}(N+1)^{2j+4}
              e^{-\pi(N+1)^2}}{1-q_j},
\quad
q_j=\left(\frac{N+2}{N+1}\right)^{2j+4}e^{-\pi(2N+3)}.
\tag{6}
\]

For every derivative used (`0<=j<=17`), the script verifies `pi*(N+1)^2>j+9/4` and `q_j<1`. The first inequality makes each omitted envelope decrease with `u`; the ratio of successive envelopes decreases with `n`. These facts justify the geometric estimate for the entire series. Each computed derivative interval includes the symmetric error interval `[-E_j,E_j]`.

The largest derivative-series envelope in this calculation is below `1.028e-12` for derivative 17. This enters only through the high-order error formulas; all relevant lower derivatives have much smaller bounds. For example, the zeroth-derivative error is below `1.657e-62`.

## 3. Validated midpoint Taylor integration

For `f_j(u)=u[kappa^(j)(u)]²`, Leibniz's rule gives

\[
f_j^{(q)}(u)
=u\sum_{a=0}^{q}\binom qa
 \kappa^{(j+a)}(u)\kappa^{(j+q-a)}(u)
+q\sum_{a=0}^{q-1}\binom{q-1}{a}
 \kappa^{(j+a)}(u)\kappa^{(j+q-1-a)}(u),
\tag{7}
\]

where the second sum is absent for `q=0`. The script evaluates this expression in interval arithmetic.

For a panel of width `h=3/128` with midpoint `c`, integrate the degree-nine Taylor polynomial. All odd powers integrate to zero. Thus

\[
\int_{c-h/2}^{c+h/2}f_j(u)du
=\sum_{q\in\{0,2,4,6,8\}}
 \frac{h^{q+1}}{2^q(q+1)!}f_j^{(q)}(c)+R_j,
\]

\[
|R_j|\le
\frac{h^{11}}{2^{10}11!}
\sup_{u\in[c-h/2,c+h/2]}|f_j^{(10)}(u)|.
\tag{8}
\]

The supremum is enclosed by evaluating equation (7) over the entire panel with interval derivatives. Omitted-series errors from equation (6) are included both in the midpoint values and in the remainder bound. This is an analytical Taylor-remainder enclosure; no adaptive quadrature estimate enters the certificate.

The summed integration remainder bounds for `I1,...,I7` are, respectively, below

\[
9.485\times10^{-18},\quad
8.761\times10^{-16},\quad
1.263\times10^{-13},\quad
2.616\times10^{-11},\quad
7.116\times10^{-9},\quad
2.389\times10^{-6},\quad
9.538\times10^{-4}.
\]

The increasing absolute error reflects the increasing derivative moment sizes. The final coefficient divisions and interval LDL decomposition retain enough accuracy to certify the fourth pivot.

## 4. The entire infinite moment tail

For `u>=R=3` the successive derivative-envelope ratio over `n` is at most

\[
2^{2j+4}e^{-3\pi e^R}<1/2,
\qquad 1\le j\le7.
\]

Therefore

\[
|\kappa^{(j)}(u)|
\le2C_j\pi^{j+2}e^{(j+9/4)u-\pi e^u}.
\]

Put `p_j=2j+9/2` and `beta_j=2*pi*e^R-p_j>0`. Writing `u=R+v` and using `e^v>=1+v` yields

\[
\int_R^\infty u[\kappa^{(j)}(u)]^2du
\le(2C_j\pi^{j+2})^2e^{p_jR-2\pi e^R}
\left(\frac R{\beta_j}+\frac1{\beta_j^2}\right).
\tag{9}
\]

Every prerequisite inequality is checked in interval arithmetic. The tail contribution is nonnegative and is added as an interval from zero to the upper bound. The largest of these bounds, for `I7`, is below `8.350e-14`. This covers the whole `u>3` domain.

## 5. Why the interval LDL test is a certificate

For the exact real symmetric matrix `J`, recursively set

\[
d_j=J_{jj}-\sum_{k<j}\ell_{jk}^2d_k,
\qquad
\ell_{ij}=\frac{J_{ij}-\sum_{k<j}\ell_{ik}\ell_{jk}d_k}{d_j}.
\]

The code applies these operations to enclosing intervals. Inductively, each interval contains the corresponding exact pivot and multiplier. Each pivot has a strictly positive lower endpoint, so every division is valid and the exact factorization has positive diagonal. Consequently `J` is positive definite. Multiplying pivot intervals encloses its leading principal determinants.

Dependencies between interval entries may enlarge the enclosures; they cannot invalidate this containment argument. Binary floats are used only when producing displayed JSON endpoints, with one outward IEEE ulp added after conversion. Assertions are evaluated on the original interval objects before that conversion. Exact interval strings are also retained.

## Reproduction and scope

Run:

```sh
python3 theta-odd-higher-jet-interval.py
python3 coefficient-reduction-audit.py
```

The interval computation requires `mpmath==1.3.0`; the exact algebraic controls require `sympy==1.14.0`. The full certificate, moments, origin derivatives, polynomial recurrences, error bounds, and exact interval pivot strings are in [theta-odd-higher-jet-interval.json](theta-odd-higher-jet-interval.json).

The trust basis is the stated Python runtime, mpmath's outward-rounded elementary interval operations, and the elementary analytic bounds above. This is not formal proof-assistant verification. The theorem concerns a finite Taylor block and, through the fixed-order analytic argument, a local finite-node result. It supplies no global bridge-coupling bound and no proof of RH.
