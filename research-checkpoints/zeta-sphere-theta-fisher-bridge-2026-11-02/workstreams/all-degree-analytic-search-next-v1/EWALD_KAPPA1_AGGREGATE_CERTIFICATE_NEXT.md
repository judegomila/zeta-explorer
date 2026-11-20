# A sign-free-tail aggregate certificate at the first odd rung

## Scope and certified result

This note closes the finite-head plus analytic-tail obligations for the
actual first odd residual

\[
q(t)=t
\]

at the single rung `kappa=1`.  It uses complete Arb spectral integrals for
the first six Ewald cells and a global evaluation of the rapid scalar-cell
tail constant.  No sign is assumed for any cell after the sixth.

With

\[
 S(z)=\sum_{n\geq1}e_nz^n=P(z)-N(z),\qquad
 D(z)=P'(z)N(z)-P(z)N'(z),
\]

the frozen certificate proves

\[
 \boxed{S(1/2)>0,\qquad S'(z)>0,\qquad D(z)<0
        \quad(1/2\leq z\leq1).}                 \tag{1}
\]

The outward lower margins are

\[
\begin{array}{c|c}
\text{quantity}&\text{certified lower bound}\\ \hline
S(1/2)&0.222484135432390577206627795065017\\
S'(z)&0.253525135400116519690789157367392\\
\text{head placement gap}&0.422670957828089021476128283843598\\
-D(z)&0.034079797840320775332185111454840
\end{array}                                      \tag{2}
\]

This is one actual rung only.  It is not an all-degree theorem and makes no
claim about the Riemann hypothesis.

## 1. Complete finite head

Put

\[
 s={1\over2}-it,\quad
 A(s)=\pi^{-s/2}\Gamma(s/2),\quad K(s)=s(s-1)A(s).
\]

For `n>=2`, the checker evaluates the analytic product

\[
 K(s)d_n(s)=A(s)\left\{s(s-1)n^{-s}
 +s\bigl(n^{1-s}-(n-1)^{1-s}\bigr)\right\}.     \tag{3}
\]

For the special first cell the removable expression is

\[
 K(s)d_1(s)=s^2A(s).                             \tag{4}
\]

Equations (3)--(4) avoid evaluating either removable pole.  Third-order
`acb_series` expansions form the complete bilinear integrand before any
derivative or sign split.  At 160 bits, the interval `[0,50]` is divided
into 400 closed pieces of width `1/8`.  The omitted two real spectral tails
are then bounded by the same explicit shifted log-Gamma argument and the
same extra factor-two normalization reserve as the independently audited
`e_2` certificate.

The resulting signs and the relevant one-sided endpoints are

\[
\begin{aligned}
 e_1&> 0.613680966846047655933168655137332,\\
 e_2&<-0.425468005360357383139179149411081,\\
 e_3&> 0.171271256840556863278893154153048,\\
 e_4&> 0.009629236329038848209799835067412,\\
 e_5&> 0.000158129981974576080974947773609,\\
 e_6&> 0.000001463784515586760166288725143.
                                                        \tag{5}
\end{aligned}
\]

The individual spectral-tail radii lie between `1.29e-9` and `1.78e-9`.
Every value in (5), including its spectral tail, is one Arb enclosure.

## 2. Explicit all-index tail constant

The rapid-tail theorem in `EWALD_SCALAR_CELL_TAIL_NEXT.md` states that for
`n>=2`

\[
 |e_n|\leq C_{q,Y}(1+\log n)^2(n-1)^{-Y-3/2}.    \tag{6}
\]

The checker evaluates a rigorous majorant for (6), rather than sampling the
integral defining `C_(q,Y)`.  It takes

\[
 Y=20,\qquad \sigma=Y+\tfrac12=20.5,
 \qquad \theta={\pi\over5}.                     \tag{7}
\]

On `s=sigma-ix`, shift the logarithmic Gamma contour by `-i theta` for
`x>=0` and by the conjugate contour for `x<=0`.  With

\[
 a={\sigma\over2},\qquad c=\pi\cos\theta,
\]

the exact Gamma log moments give constants `G_0,G_1,G_2` satisfying

\[
 |A^{(j)}(\sigma-ix)|\leq G_j e^{-\theta |x|/2},
 \qquad j=0,1,2.                                \tag{8}
\]

Explicitly, if

\[
 L_2=(\psi_0(a)-\log c)^2+\psi_1(a),
\]

then

\[
 G_0=c^{-a}\Gamma(a),\quad
 G_1={G_0\over2}\sqrt{L_2+\theta^2},\quad
 G_2={G_0\over4}(L_2+\theta^2).                 \tag{9}
\]

The corresponding Arb enclosures are recorded in the receipt.  For the
zeta factor, absolute convergence at `sigma=20.5` gives

\[
 |\zeta^{(j)}(\sigma-ix)|
 \leq\sum_{m\geq1}(\log m)^jm^{-\sigma},
 \qquad j=0,1,2,                                \tag{10}
\]

and the three positive sums in (10) are evaluated by Arb as `zeta(sigma)`,
`-zeta'(sigma)`, and `zeta''(sigma)`.

For `x>=0`, the elementary majorants

\[
 |s|\leq x+\sigma,\quad
 |s(s-1)|\leq(x+\sigma)^2,\quad
 |2s-1|\leq2x+2\sigma-1                         \tag{11}
\]

turn the bounds for `K`, `Xi=K zeta/2`, and their first two derivatives
into positive-coefficient polynomials times `e^(-theta x/2)`.  The three
cell factors used in scalar-tail equation (24) are bounded by

\[
\begin{aligned}
 U_0&=|K||s|,\\
 U_1&=|K'||s|+|K|(1+|s|),\\
 U_2&=|K''||s|+2|K'|(1+|s|)+|K|(2+|s|).
                                                        \tag{12}
\end{aligned}
\]

Since `|q(x+iY)|^2=x^2+Y^2`, the complete integrand majorant is a positive
degree-seven polynomial `R(x)` times `e^(-theta x)`.  The exact normalization
used by the checker is

\[
 C_{q,Y}\leq {1\over2\pi}
 \int_0^\infty R(x)e^{-\theta x}\,dx
 ={1\over2\pi}\sum_{j=0}^7R_j{j!\over\theta^{j+1}}.
                                                        \tag{13}
\]

The `1/(2 pi)` in (13) is the `1/(4 pi)` in scalar-tail equation (24)
times the two symmetric `x` half-lines.  Both completed factors contribute
`e^(-theta x/2)`, hence the decay `e^(-theta x)`.  This fixes both the
normalization and the exponential rate without numerical truncation.

The certified result is

\[
 C_{q,20}<2196043753643.818609933579766867603.   \tag{14}
\]

## 3. From the scalar tail to two uniform moments

For head cutoff `N=6`, put `m=n-1>=6` and

\[
 p=Y+\tfrac32-r.
\]

Using `n<=2m` and `1+log n<=1+log(2m)`, equations (28)--(29) of the scalar
tail note give

\[
 \sum_{n>6}n^r|e_n|
 \leq2^rC_{q,Y}\left[f_r(6)+\int_6^\infty f_r(x)\,dx\right],
 \quad f_r(x)={\{1+\log(2x)\}^2\over x^p}.      \tag{15}
\]

Writing `A=1+log(12)`, the integral in (15) is evaluated exactly as

\[
 6^{1-p}\left{{A^2\over p-1}+{2A\over(p-1)^2}
                  +{2\over(p-1)^3}\right\}.    \tag{16}
\]

The monotonicity condition `p A>=2` holds for `r=0,1`.  Outward interval
arithmetic yields

\[
 T_0:=\sum_{n>6}|e_n|<0.000645722348029564967144136376292,
                                                        \tag{17}
\]

\[
 T_1:=\sum_{n>6}n|e_n|<0.007843307848767752560594377353988.
                                                        \tag{18}
\]

These are total-variation bounds.  They do not assume an eventual sign.

## 4. Uniform half-seed and derivative

For the seed, `2^-n<=2^-7` for every `n>6`, so

\[
 S(1/2)\geq\sum_{n=1}^6e_n2^{-n}-2^{-7}T_0,
                                                        \tag{19}
\]

which gives the first margin in (2).

Write `b=-e_2>0`.  Dropping the certified positive contributions from
`e_4,e_5,e_6` and paying the whole remote derivative tail gives, uniformly
for `0<=z<=1`,

\[
 S'(z)\geq e_1-2bz+3e_3z^2-T_1
 \geq e_1-{b^2\over3e_3}-T_1.                  \tag{20}
\]

The last expression is the global minimum of the quadratic and gives the
second margin in (2).

## 5. Regional compensation for the aggregate

Let

\[
 P_0=e_1z+e_3z^3+e_4z^4+e_5z^5+e_6z^6,
 \qquad N_0=bz^2.                               \tag{21}
\]

Split the unknown remote cells by their actual signs as `A>=0` and `B>=0`,
so `P=P_0+A`, `N=N_0+B`.  Equations (17)--(18) imply on `[0,1]`

\[
 A+B\leq T_0,\qquad A'+B'\leq T_1.             \tag{22}
\]

The six-cell head has the exact placement identity

\[
 D_0=P_0'N_0-P_0N_0'
 =b\sum_{i\in\{1,3,4,5,6\}}(i-2)e_i z^{i+1}.  \tag{23}
\]

Set

\[
 G=e_1-\sum_{i=3}^6(i-2)e_i.                   \tag{24}
\]

The checker certifies `G>0.422670957828...`.  Because `z>=1/2` and all
head cells other than `e_2` are positive,

\[
 D_0\leq-bz^2G\leq-{bG\over4}.                 \tag{25}
\]

The exact remote perturbation is

\[
 D-D_0=P_0'B-P_0B'+A'N_0-AN_0'+A'B-AB'.       \tag{26}
\]

All coefficients in `P_0,A,B,N_0` are nonnegative.  Therefore (22) gives

\[
 |D-D_0|\leq
 (P_0'(1)+2b)T_0+(P_0(1)+b)T_1+T_0T_1.        \tag{27}
\]

For the last term, note specifically that
`A'B+AB' <= (A'+B')(A+B) <= T_1 T_0`; no missing factor two is required.
Subtracting (27) from `bG/4` proves the last margin in (2).  This is the
regional compensation inequality: the dominant positive first cell lies
below the negative second cell, and its strict placement margin pays for
every possible sign arrangement after index six.

## 6. Audit of the conditional one-negative-cell identity

There is a useful exact reduction if one separately assumes that `e_2` is
the only negative cell.  Then `N=bz^2`, `P=S+N`, and direct expansion gives

\[
 D=S'N-SN'=bz\{zS'-2S\}.                       \tag{28}
\]

Thus the multiplier and sign in the conditional identity are correct.  If
also `e_1>0` and `e_n>=0` for every `n>=3`, then

\[
 {zS'-2S\over z}=-e_1+
 \sum_{n\geq3}(n-2)e_nz^{n-1}                  \tag{29}
\]

is increasing.  Consequently `D<=0` on `[1/2,1]` is then equivalent to the
single endpoint inequality `S'(1)-2S(1)<=0`.

Equations (28)--(29) independently confirm the conditional algebra, but
the certificate in sections 1--5 does not use its unproved remote sign
assumption or its endpoint test.

## 7. Replay, hashes, and limitations

From `workstreams/all-degree-analytic-search-next-v1`, run

```text
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  src/certify_ewald_kappa1_aggregate.py \
  --output results/ewald_kappa1_aggregate_certificate.json
```

The frozen source and receipt SHA-256 hashes are

```text
1e813e55f13f6cd74d4cb8f16706228bf3e7ac46df089b37fbc3ef22bd1e1a3f  src/certify_ewald_kappa1_aggregate.py
57b9f9c63e4c3ac5f2292c25b90c99881d7bf1e3c3f3d5163b5b4ceb4fec4345  results/ewald_kappa1_aggregate_certificate.json
```

The receipt records Python `3.14.10`, python-flint `0.9.0`, all numerical
enclosures, and these input hashes:

```text
ae5e91dc5f8d4eecfe30f527257461dcc61302a44dcdc96e2c4ce0857cd40e24  src/certify_ewald_kappa1_e2.py
b1b9d047013ab3847f13c913e918bcc1cf108400386b635008a7a8657bc7c876  ACTUAL_EWALD_REVERSE_ORDER_NEXT.md
d193af49c6e08b35882e4341635402a7bae77f5a4a4e1f978b3c0044ab28429e  EWALD_SCALAR_CELL_TAIL_NEXT.md
58f1c3428f53fffd595a2184ba05a45540c0d751f2df29987b0bda2c573af35c  EWALD_BESSEL_CELL_TAIL_NEXT.md
b8677e949ff33bc11728408669b862ec8149ea580f7d73bd13ec22bc47c34df4  EWALD_KAPPA1_E2_CERTIFICATE_NEXT.md
```

The result proves the three inequalities in (1) only for the actual
residual `q=t` at `kappa=1`.  It does not prove the analogous inequalities
for higher residual degrees, does not replace the other steps in the
cross-Hardy argument, and does not prove RH.
