# Independent audit of the normalized `N=1` endpoint payment

## Verdict and scope

The endpoint payment in `MODULAR_N1_S2_PAYMENT_REDUCTION_NEXT.md` is correct.
With the archive's raw bridge normalization,

\[
 \sigma _2>{1254\over8}\sigma _0>4Q_0,
 \qquad
 \lim_{a\downarrow0}
 \left\{{s_2(a)\over s_1(a)}-\kappa _1(a)\mu _1^-(a)\right\}>0.
\]

The normalized bridge quantities extend continuously to zero.  The strict
margin therefore proves the existence of an unspecified `a_0>0` such that
the strong one-direction payment and `s_2(a)>0` hold for `0<a<a_0`.

This is only the actual `N=1` endpoint and a nonquantified neighborhood.  It
does not cover the full `0<a<=1/4` campaign interval, higher degrees, an
all-degree first Xi--Laguerre inequality, or RH.

## 1. Raw-pivot derivative and the `2 pi` factor

At `a=0`, put

\[
 \beta={\sigma _1\over\sigma _0},\qquad
 F_2=(D^2+\beta)\psi .
\]

The coefficient `s_1/s_0` of `T_2` is even analytic in `a`, so its first
derivative at zero vanishes.  Differentiating
`F_2(a)=T_2(D,a)e^{au}\psi` gives

\[
 \partial_aF_2\big|_{a=0}=uF_2+2\psi'.
\]

Consequently, direct differentiation of the raw pivot gives

\[
\begin{aligned}
 \sigma _2
 &=2\int_{\mathbb R}uF_2(uF_2+2\psi')\,du\\
 &=2\int_{\mathbb R}u^2F_2^2\,du
   -2\int_{\mathbb R}(\psi')^2\,du
   -2\beta\int_{\mathbb R}\psi^2\,du .
\end{aligned}
\]

The second line follows from two elementary integrations by parts:

\[
 4\int u\psi''\psi'=-2\int(\psi')^2,
 \qquad
 4\beta\int u\psi\psi'=-2\beta\int\psi^2.
\]

For `p(t)=t^2-beta`, the audited root-deletion identity and Parseval give
exactly the same bracket multiplied by `2 pi`.  Thus

\[
 h[p]=2\pi\sigma _2.
\]

Likewise

\[
 \sigma _0=2\int_{\mathbb R}u^2\psi^2\,du,
 \qquad
 h[1]=4\pi\int_{\mathbb R}u^2\psi^2\,du=2\pi\sigma _0.
\]

Therefore the independently audited curvature-square theorem

\[
 h[p]>{1254\over8}h[1]
\]

has precisely the claimed normalization

\[
 \sigma _2>{1254\over8}\sigma _0.                       \tag{A1}
\]

No next-pivot sign is used in this conversion.

## 2. Independent derivation of the `Q_0` bound

Let

\[
 v=-{\psi'\over\psi},\quad c_*=\psi(0)^2,\quad
 P_0=\int_0^\infty\psi^2,\quad
 I_0=\int_0^\infty h\psi^2,\quad
 Q_0=\int_0^\infty h(\psi')^2.
\]

Integrating `(h psi^2 v)'` gives

\[
 Q_0={c_*\over4}+{1\over2}\int_0^\infty h\psi^2v'\,dh. \tag{A2}
\]

The audited complete-theta inequalities

\[
 17<v'<2v+20,
 \qquad v(0)=0,
\]

imply `v(h)>17h` and
`psi(h)^2<c_* exp(-17h^2)` for `h>0`.  Substituting the upper bound for
`v'` in (A2), and using

\[
 \int_0^\infty h\psi^2v={P_0\over2},
\]

gives

\[
 Q_0<{c_*\over4}+{P_0\over2}+10I_0.
\]

The Gaussian envelope yields

\[
 P_0<c_*{\sqrt\pi\over2\sqrt{17}}<{c_*\over4},
 \qquad I_0<{c_*\over34},
\]

and hence

\[
 Q_0<{91\over136}c_*.                                  \tag{A3}
\]

The strict signs are preserved throughout; equality at the single point
`h=0` is immaterial to the integrals.

## 3. Frozen inputs and exact margin

The modular-tilt receipt has SHA-256

`1db1987de3a7542c5cf02e45178b5d5dd65a76c1f2bfaeaa176184d5810290e5`

and encloses `c_*<16/5`.  The integrated-square receipt has SHA-256

`bd25296a2bd9d739fdc6463167198738dd60785ca6fa3ebbec941ba6c423d17e`

and its zeroth weighted moment is exactly the full-line quantity

\[
 \mathfrak M_0=\int_{\mathbb R}u^2\psi^2\,du>{3\over100}.
\]

The factor two in the receipt's checker is the even half-line assembly, so

\[
 \sigma _0=2\mathfrak M_0>{3\over50}.                   \tag{A4}
\]

Equations (A3)--(A4) give the exact rational comparison

\[
 Q_0<{91\over136}{16\over5}={182\over85},
\]

\[
 {1254\over32}\sigma _0
 >{1254\over32}{3\over50}={1881\over800},
\]

with strict margin

\[
 {1881\over800}-{182\over85}={2857\over13600}>0.       \tag{A5}
\]

Combining (A1) and (A5) proves

\[
 \boxed{\sigma _2>{1254\over8}\sigma _0>4Q_0.}        \tag{A6}
\]

## 4. Continuity and the local positive-`a` consequence

The raw bridge moments are odd analytic in `a`.  Removing their common
factor gives even-analytic current-prefix pivots and coefficients.  Since
`sigma_0,sigma_1>0`, for sufficiently small positive `a`

\[
 s_j(a)=a\{\sigma_j+O(a^2)\},\qquad j=0,1,
\]

and both denominators stay positive.  The next residual uses only this
positive prefix, so its raw signed norm also has the even-divided expansion

\[
 s_2(a)=a\{\sigma_2+O(a^2)\};
\]

positivity of `s_2` is not assumed in deriving that expansion.

Super-exponential theta decay makes `I_-(a),P_-(a),Q_-(a)` analytic near
zero by dominated differentiation.  In particular,

\[
 Q_-(a)\longrightarrow Q_0,
\]

and the exact expressions

\[
 \kappa_1=4a\left(1+a^2{s_0\over s_1}\right),
 \qquad \mu_1^-={Q_-\over s_1}
\]

give

\[
 \kappa_1(a)\mu_1^-(a)\longrightarrow{4Q_0\over\sigma_1}.
\]

Therefore the payment gap extends continuously and (A6) gives

\[
 \lim_{a\downarrow0}
 \left\{{s_2\over s_1}-\kappa_1\mu_1^-\right\}
 ={\sigma_2-4Q_0\over\sigma_1}>0.                       \tag{A7}
\]

Continuity supplies some `a_0>0` on which the gap is positive.  Since
`s_1>0` and `kappa_1 mu_1^->0` there, (A7) also implies `s_2(a)>0` for
`0<a<a_0`.  This is an existence statement only; it supplies no numerical
`a_0` and does not reach the full campaign interval.

## 5. Replay

The standard-library checker was replayed without importing its algebra.
The replay is byte-identical to the frozen receipt:

```text
checker SHA-256
  5fc27c79fa127a01bd726691ebee2b961ae6c3256542027fe8cc97755b4382c8
receipt SHA-256
  9f615e92eb76d23a726ef0b4e85865885b1eaf4d7c5bb341239a0d3846999fa0
```

After this audit, the replay wrapper was provenance-hardened without changing
any algebra or bound. It now also binds the audited
`theta_curvature_square.json` receipt at SHA-256
`47353b64c47ce2d5e14112d2bbfcdfc0f2985a170e15c13cb8e64222823990f7`
and checks its directed lower endpoint exceeds `1254`. The current wrapper and
receipt SHA-256 values are respectively
`5fb1b8c78634662c739b04853c1044dbd5b7d339e02b5fcbecc8508d1e1df663`
and
`93c708a1f8b1567b32ca62d1a02e8a9927ef165b1c99e924af6730eef7e72624`.
The package manifest binds the current hardened files; version control
preserves the independently audited predecessor and this append-only change.

The checker binds both frozen input hashes and verifies the exact rational
margin in (A5).  This audit additionally rederived the analytic factors,
integrations by parts, and continuity argument rather than treating the
checker as proof of them.
