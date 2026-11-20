# Complete-theta `N=2` strong modular payment on the full shift interval

## Theorem and exact scope

For the actual complete theta profile and every

\[
 0<a\leq {1\over4},
\]

the current prefix through degree two is positive and the next raw signed
pivot pays the unique negative direction in the exact `N=2` modular square
completion:

\[
 \boxed{s_3(a)>\kappa _2(a)Q_2^-(a).}                  \tag{1}
\]

More precisely,

\[
 \boxed{
 {s_3(a)\over a}>{14487\over25}=579.48,
 \qquad {\kappa _2(a)\over a}Q_2^-(a)<558,
 \qquad {s_3(a)-\kappa _2(a)Q_2^-(a)\over a}
       >{537\over25}=21.48.}                           \tag{2}
\]

This is a computer-assisted actual-theta theorem at the single low rung
`N=2`.  It proves the strong scalar payment (1), equivalently

\[
 {s_3\over s_2}>\kappa _2\mu _2^-,\qquad
 \mu _2^-={Q_2^-\over s_2},                            \tag{3}
\]

because the old pivot `s_2` is already strictly positive.  It does not say
that this strong sufficient payment is equivalent to every signed term in
the complete integrated modular conservation law.  It proves no higher
rung, degree-uniform induction, all-degree first Xi--Laguerre inequality, or
RH.

## 1. Exact obligation

Put

\[
 b_1={s_1\over s_0},\qquad b_2={s_2\over s_1},
 \qquad v=-{\psi'\over\psi}.
\]

The audited reflection algebra, with every mixed term retained, gives

\[
 {\kappa _2(a)\over a}
 =8+{36a^2\over b_2}
 +{(4a^2-2b_1+b_2)^2\over b_1b_2},                    \tag{4}
\]

\[
 Q_2^-(a)=\int_0^\infty h e^{-2ah}\psi(h)^2
 \bigl((a+v(h))^2-v'(h)+b_1\bigr)^2\,dh.              \tag{5}
\]

Thus (1) is exactly the strong payment of the negative square isolated by
the `N=2` Schur completion.  Equations (4)--(5) use only the already positive
current prefix.

## 2. Uniform prefix rectangle

The all-shift integrated-`H5` author and independent-audit receipts agree on
all twelve closed bins covering `0<=a<=1/2`.  In the archive normalization
`mu_j=4^j M_j`, they give

\[
 {147\over100}<\mu _1<{3\over2},\qquad \mu _2<209.
\]

The ground divided moment is increasing in `a` and its endpoint receipt
gives `mu_0>1/32`.  Hence

\[
 b_1={\mu _1\over4\mu _0}<12,
\]

and, using the independent curvature-transport lower bound `b_1>17/2`,

\[
 b_2={\mu _2\over4\mu _1}-{\mu _1\over4\mu _0}
 <{209\over4(147/100)}-{17\over2}
 ={7951\over294}<30.                                  \tag{6}
\]

The same transport theorem gives `b_1b_2>627/4`.  With

\[
 x={b_2\over b_1},\qquad y={4a^2\over b_1},
\]

these bounds imply

\[
 {209\over192}<x<{60\over17},\qquad0<y<{1\over34}.
\]

The exact expression (4) becomes

\[
 {\kappa _2\over a}
 =4+x+{4\over x}+2y+{y^2+5y\over x}.                  \tag{7}
\]

It is increasing in `y` and convex in `x`.  Its two closed-rectangle corner
values at `y=1/34` are

\[
 {103884673\over11596992}<9,
 \qquad {7151\over816}<9,
\]

so

\[
 \boxed{{\kappa _2(a)\over a}<9.}                     \tag{8}
\]

## 3. Uniform physical-mass envelope

Let

\[
 F=\psi''-2a\psi'+(a^2+b_1)\psi,
\]

and put

\[
 A_a=\int_0^\infty F^2dh,
 \qquad B_a=\int_0^\infty h^2F^2dh.
\]

Dropping only the factor `e^{-2ah}<=1` and applying Cauchy--Schwarz gives

\[
 (Q_2^-)^2\leq A_aB_a.                                \tag{9}
\]

The exact half-line integrations by parts, including the origin boundary
term, are

\[
\begin{aligned}
 A_a={}&n_2+(2a^2-2b_1)n_1+C^2n_0+2aC\psi(0)^2,\\
 B_a={}&H_2+4a^2H_1+C^2H_0+4aJ_1
       +2C(n_0-H_1)+4aCJ_0,
 \qquad C=a^2+b_1.
\end{aligned}                                          \tag{10}
\]

Here `n_j`, `H_j`, and `J_j` are the unweighted, `h^2`-weighted, and
`h`-weighted endpoint derivative norms.  Frozen directed endpoint moments,
`J_j<=sqrt(n_jH_j)`, convexity of `A_a`, and monotonicity of the resulting
upper envelope for `B_a` give, without a parameter mesh,

\[
 A_a<159,\qquad B_a<24,\qquad
 \boxed{Q_2^-<\sqrt{3816}<62.}                         \tag{11}
\]

Combining (8) and (11) proves the middle bound in (2).

## 4. Sharp cubic reserve and payment

The sharp cubic transport theorem uses the exact local completion

\[
 L_\alpha={P\over32X}+{X\over2}
     \left({B\over4X}-\alpha\right)^2>0
\]

and endpoint Schur stationarity to prove

\[
 s_3'(a)\geq\sigma _3,
 \qquad {s_3(a)\over a}\geq\sigma _3>{14487\over25}. \tag{12}
\]

Equations (8), (11), and (12) now give

\[
 {\kappa _2Q_2^-\over a}<9\cdot62=558
 <{14487\over25}<{s_3\over a}.
\]

Subtracting the two directed rational bounds yields the final margin in
(2), since `14487/25-558=537/25`.  No target sign is assumed in this last
step: the target reserve was independently certified and then transported.

## 5. Frozen dependency chain

The theorem combines four separately checked commits.  The companion replay
verifies each commit object and tree, checks each listed note/source/result
blob both in that commit and in the working tree, reruns every dependency
checker, requires byte-identical receipts, and then performs the final exact
rational comparison.

| role | commit | tree | note SHA-256 | verifier SHA-256 | receipt SHA-256 |
|---|---|---|---|---|---|
| exact obligation | `02d481a12da723b20b79f24891e89098ef26e24d` | `c0124d757017f3c1c0f678e3553c3433c1204dd3` | `afb6431055e8167fdb9ef30e61e01195cfd557cfec91d2114d062f27daee9c93` | `94081de4fb6926c4236d1f0fbf026a625e3fd26efe9d5a913cc8b97bcd68e8a6` | `b79c5ce2cbebc04275cdfce717888669ff6109b9b93a38189614838f3fc4bfe3` |
| sharp cubic reserve | `00782310d3bc1c9b5f23119be5ecb5ded97f3099` | `7fd8338a5d8cbc86bc3cb5d79bc6cd52a8be7980` | `cde23c97b17f3029621299b4ff0d99ff462b0c89ad6632ceade073922e172318` | `9dc26bb32466bd62a30ed35984906762f105b0c69a9e94286dd1e7b6a506d9ae` | `5b5118668f17f3067c63fbb357e7e0dcb088b8af6f9b37447e73a3b8237a8333` |
| analytic cost envelope | `d9ba9e6d57d3fa4c432cf44038e501a573c28d8e` | `f297683b6c478742bed21d1ffd1dced87b13131c` | `976a9893becbe86e40322214ae9fac63293d860bdb3b1924881f0a603e9be326` | `387b5e3953f1aa27315ad9ca814b42ea5c60536d3a3105c349e039ea47270073` | `834b0d98a034fd48877fb0452492f7c465e38512c9b397ae473d4d53994d4722` |
| uniform prefix caps | `5df7934882cdd6850aeaedeeee4518c179ec2c16` | `972dac116e69248bcc421b7bbf1e3572102b9736` | `de6fb12c532e82234e0140f0190672203d47a5b9ce45db5e603ac43866b86f68` | `f184e02ad922a72f488fccac8cb344b1d1c9a16e45b200ea515654139d38caae` | `18311a3b8dc47035566812504386c10b0844160935aa3cf82b5686d5112fc698` |

From the repository root, reproduce the combined certificate with

```text
python3 research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/src/verify_modular_n2_full_interval_payment_20261103.py \
  --root . \
  --output research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/results/modular_n2_full_interval_payment_20261103.json
```

The replay uses only the Python standard library and Git already present in
the repository.  It performs no new quadrature, parameter sweep, or
higher-degree extrapolation.
