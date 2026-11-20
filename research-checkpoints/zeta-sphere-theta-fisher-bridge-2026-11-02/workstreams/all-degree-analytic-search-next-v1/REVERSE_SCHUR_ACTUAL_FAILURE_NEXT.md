# The actual degree-ten theta residual defeats the reverse-Schur auxiliary

## Scope and outcome

`DEGREE_UNIFORM_THETA_SOS_NEXT.md` reduced the two-generator sufficient
condition to the reverse-Schur cap

\[
 D-{E^2\over A}
 \le {A\{C+E-EB/A\}^2\over A^2-B^2}                 \tag{1}
\]

in the nonautomatic branch `A^2>B^2`. This note tests (1) on the actual
complete-theta residual rather than on a trial polynomial.

The result is decisive: the actual even residual at

\[
 (N,\epsilon)=(5,0),\qquad \kappa=2N+\epsilon=10,
\]

has a strictly positive old signed block and a strictly positive next signed
theta pivot, but it violates (1) by a wide rigorous interval. Equivalently,
its two-generator auxiliary `mathcal H` is strictly negative.

Thus the reverse-Schur cap is not an all-degree theorem for the complete
theta source. It is a useful sufficient condition at the low rungs where it
holds, but it cannot be the uniform induction lemma. This is not a negative
theta pivot, a counterexample to the first Xi--Laguerre inequality, or a
counterexample to RH. In fact the same replay proves that the actual signed
pivot at this rung is positive.

## 1. The actual residual and its target pivot

Let `mathsf M_j` be the signed complete-theta target moments in the
normalization used by the archived old block. The archive stores

\[
 \mu_j=4^j\mathsf M_j.                              \tag{2}
\]

The verifier first applies the documented outward serialization padding to
each stored decimal interval and only then divides by `4^j`.

Put

\[
 H_4=(\mathsf M_{i+j})_{0\le i,j\le4},\qquad
 b=(\mathsf M_5,\ldots,\mathsf M_9)^T.             \tag{3}
\]

An interval `LDL^T` factorization gives five strictly positive pivots:

\[
\begin{aligned}
d_0&>0.0314381170533721163636,\\
d_1&>8.48289981020936296830,\\
d_2&>13403.5829701605962647,\\
d_3&>63423096.5699058742,\\
d_4&>683066188057.8696458.
\end{aligned}                                      \tag{4}
\]

Hence the old even prefix is positive definite. Solving
`H_4 c=-b` with outward interval arithmetic gives the actual monic residual

\[
 q(t)=t^{10}+c_4t^8+c_3t^6+c_2t^4+c_1t^2+c_0,     \tag{5}
\]

with

\[
\begin{aligned}
c_0&=-303773536.05378\ldots, &c_1&=123330905.908198\ldots,\\
c_2&=-6640556.8049379\ldots, &c_3&=105973.460295927\ldots,\\
c_4&=-591.933233661324\ldots .
\end{aligned}                                      \tag{6}
\]

These displayed values are summaries; the receipt contains full outward
intervals. The next signed Schur complement is

\[
 \boxed{
 \mathcal S_{5,0}^{\rm archive}
 =\mathsf M_{10}+b^Tc
 >1.3981115905406887\times10^{16}>0.}             \tag{7}
\]

Equation (7) fixes the scope: the actual target remains positive even though
the stronger auxiliary below fails.

## 2. Complete positive moments, with every orbit retained

Write the complete physical theta profile on the positive half-line as

\[
 \psi(h)=\sum_{n\ge1}4e^{h/2}P_0(\pi n^2e^{2h})
 e^{-\pi n^2e^{2h}},\qquad P_0(z)=2z^2-3z.        \tag{8}
\]

As in the earlier low-rung verifiers,

\[
 \phi_n^{(j)}(h)=4e^{h/2}P_j(\pi n^2e^{2h})
 e^{-\pi n^2e^{2h}},                              \tag{9}
\]

where `P_(j+1)=P_j/2+2z(P_j'-P_j)`. The replay needs derivative orders
`0<=j<=11`. For each of them it proves by exact translated coefficients

\[
 0<(-1)^jP_j(z)<2^{j+1}z^{j+2}\qquad(z\ge150).   \tag{10}
\]

It evaluates every pair among the first six theta orbits by exact
upper-incomplete-gamma formulas. Since `49pi>150`, (10) applies to the first
omitted orbit. For all `j<=11` and `n>=7`, the successive norm-envelope ratio
is at most

\[
 (8/7)^{25}e^{-15\pi}<1/2.                       \tag{11}
\]

Consequently twice the first omitted bound contains the entire analytic
`L^2` tail over every orbit `n>=7`. The complete boxes

\[
 n_j=\|\psi^{(j)}\|_{L^2(0,\infty)}^2
\qquad(0\le j\le11)                               \tag{12}
\]

retain the infinite theta sum; no finite orbit block is substituted for the
source. Plancherel and evenness give

\[
 m_j=\int_{\mathbb R}t^{2j}W(t)^2dt=4\pi n_j.    \tag{13}
\]

All five scalars below have the same common `4pi` factor. The verifier may
therefore use the `n_j` boxes: the signs of the cleared numerator, the
auxiliary, and the difference between the two sides of (1) are unchanged.

## 3. Strict failure of the cap

For (5), define

\[
\begin{aligned}
A&=\int q'^2W^2,&B&=\int qq''W^2,\\
C&=\int q^2W^2,&D&=\int t^2q^2W^2,\\
E&=\int tqq'W^2.
\end{aligned}                                      \tag{14}
\]

Put

\[
 G=A^2-B^2,\qquad R_0=C+E-{EB\over A},\qquad
 V=D-{E^2\over A}.                                \tag{15}
\]

The complete-orbit interval evaluation proves `G>0` and

\[
\begin{aligned}
A&\in[6.2869384831855415,6.2869384834511086]\times10^{16},\\
B&\in[-4.3793689039187030,-4.3793689036088093]\times10^{16},\\
C&\in[7.7639153750808550,7.7639153763349541]\times10^{16},\\
D&\in[7.6400627399305577,7.6400627409679362]\times10^{18},\\
E&\in[2.2910341188113657,2.2910341193265377]\times10^{17}.
\end{aligned}                                      \tag{16}
\]

In particular, `Delta=AD-E^2>4.2783767117703*10^35`,
`G>2.0346723494749*10^33`, and `R_0>4.6633190475844*10^17`.
The cap comparison is

\[
\begin{aligned}
V&>6.8051830365651767\times10^{18},\\
{AR_0^2\over G}&<6.7194694935688420\times10^{18},\\
{AR_0^2\over G}-V
&<-8.5713542996334780\times10^{16}.               \tag{17}
\end{aligned}
\]

Thus (1) is false. The equivalent denominator-free numerator and auxiliary
are also strictly negative:

\[
\begin{aligned}
\mathcal F[q]
&=\{AC+E(A-B)\}^2-(AD-E^2)(A^2-B^2)\\
&<-1.0964356319328368\times10^{67},\\
\mathcal H[n]&<-1.0190721120717460\times10^{14}.  \tag{18}
\end{aligned}
\]

The original spectral normalization is
`mathcal H[m]=4pi mathcal H[n]`, so its sign is the same. Equivalently, with

\[
 K=\begin{pmatrix}A&E\\E&D\end{pmatrix},\qquad
 y=\binom{B}{C+E},                                  \tag{19}
\]

the full correlated vector fails in its own metric:

\[
 y^TK^{-1}y-A=4\mathcal H[q]<0.                    \tag{20}
\]

No quotient by `W` is used in this evaluation: every vector is a polynomial
multiple of `W` or `W'`, so real Xi zeros create no domain or pole issue.
Combining (7) and (18) gives the exact separation

\[
 \boxed{
 \mathcal S_{5,0}>0
 \quad\text{but}\quad
 \mathcal H[q]<0.}                                \tag{21}
\]

This is permitted by the projection identity
`2pi mathcal S-mathcal H=(1/4)||(I-P_U)s_q||_2^2`: at degree ten the
orthogonal reserve is essential and the two-generator projection discards
too much of it.

## 4. The actual three-term transfer does not repair the failure

Suppose same-parity actual residuals obey

\[
 q_{r+1}=(t^2-\alpha_r)q_r-\beta_rq_{r-1}.        \tag{22}
\]

With `M` denoting multiplication by `t^2` and

\[
 a_r=q_r'W,\qquad b_r=tq_rW,\qquad
 s_r=-q_r'W-2q_rW',                               \tag{23}
\]

direct differentiation gives the full correlated vector recurrence

\[
\boxed{
\begin{aligned}
a_{r+1}&=(M-\alpha_r)a_r+2b_r-\beta_ra_{r-1},\\
b_{r+1}&=(M-\alpha_r)b_r-\beta_rb_{r-1},\\
s_{r+1}&=(M-\alpha_r)s_r-2b_r-\beta_rs_{r-1}.
\end{aligned}}                                    \tag{24}
\]

No backward term is dropped in (24). It repackages the multiplication tower,
but it cannot prove (1) uniformly because the actual theta residual (5)
already violates (1). A continuation must retain more of the orthogonal
component in (18), or change to a different signed complete-theta mechanism
such as the assembled cell/Hardy route.

## Replay

From the checkpoint root, using the recorded Arb Python environment:

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_reverse_schur_actual_failure.py \
  --root . --precision-bits 400 \
  --output workstreams/all-degree-analytic-search-next-v1/results/reverse_schur_actual_failure.json
```

The frozen 400-bit receipt and same-implementation 600-bit precision replay are
`results/reverse_schur_actual_failure.json` and
`results/reverse_schur_actual_failure_600.json`. The verifier checks the
hashes of the orbit helper, signed-moment archive, normalization proof and
manifest, and the independent full-split audit before computing anything.
Their provenance is:

```text
verifier SHA-256: 9e0e37a25b1e1b04f93a26959fd30d8cd0b885451665b715ddaace3db3ad08e0
400-bit receipt SHA-256: 7b909d7d416afd4c7433e5f81669d7c16b4a9be4c0919c5b5bf2da5ed354e6c5
400-bit payload SHA-256: a64d43bf87bb5623e9e41047bb7f50541af51dfc84ad753fcddd446912fb367c
600-bit receipt SHA-256: 46032d588351d17a1fc44024938785ccbd1fc8ee3f411fa0af6366f7d4c6b444
600-bit payload SHA-256: 401c95d44446d97f746f7a76056fcd492ee9ff9102fd27f4c83898f2fef2fe70
```

A genuinely independent 720-bit audit used an `arb_mat` determinant-ratio
solve, an exact first-eight-orbit block, and an analytic `n>=9` tail. It
reproduced the positive target-pivot and negative cap/auxiliary signs. Its
durable artifacts are
`src/audit_reverse_schur_actual_failure.py` and
`results/reverse_schur_actual_failure_independent_audit.json`, with SHA-256
values `5d86938507fe5bc78994cfd5658a0de745835f614534f98161083c2651a62536`
and `de9853df16d3f68d714e04cedcae3ffd347fab82db288f581ad72ead5accd4f4`.
This is an independent campaign implementation, not external peer review.

## Nonclaims and route update

- The cap failure is for the actual complete-theta residual, not for a
  Gaussian or freely chosen polynomial.
- The signed target pivot at the same rung is rigorously positive.
- The result retires (1) as a degree-uniform sufficient lemma. It does not
  invalidate fixed low-rung certificates where the auxiliary is positive.
- It proves no pointwise Xi--Laguerre sign, no all-degree target theorem, and
  no statement about RH.
- A finite positive run at other degrees would not restore the cap as a
  uniform theorem; the single strict actual counterexample (17) is decisive.
