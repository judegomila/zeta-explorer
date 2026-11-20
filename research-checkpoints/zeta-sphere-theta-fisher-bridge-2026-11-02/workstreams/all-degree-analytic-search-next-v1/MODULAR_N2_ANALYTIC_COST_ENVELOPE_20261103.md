# Analytic envelope for the finite-tilt `N=2` modular cost

## Conditional theorem and remaining inputs

Assume, in addition to the already proved positive-prefix bounds, the two
coarse current-prefix estimates

\[
 \boxed{b_1(a)\leq12,\qquad b_2(a)\leq30,
        \qquad0<a\leq1/4.}                              \tag{1}
\]

Then the exact `N=2` modular cost satisfies

\[
 \boxed{{\kappa _2(a)\over a}Q_2^-(a)<558
        <{14487\over25}< {s_3(a)\over a}.}              \tag{2}
\]

Consequently (1) is sufficient for the strong payment
`s_3(a)>kappa_2(a)Q_2^-(a)` on the whole campaign interval.  The rightmost
inequality in (2) is the separately audited sharp cubic transport theorem.
This note does **not** prove (1); those two deliberately loose prefix bounds
are the only remaining inputs to this route.

No higher-degree, all-degree, or RH statement is made.

## 1. Remove the finite tilt from the half-line energy

Put

\[
 f_a(h)=e^{-ah}\psi(h),\qquad q_a=f_a''+b_1f_a,
 \qquad C=a^2+b_1.                                      \tag{3}
\]

Then

\[
 q_a=e^{-ah}\{\psi''-2a\psi'+C\psi\},
 \qquad Q_2^- =\int_0^\infty hq_a^2dh.                 \tag{4}
\]

Define the endpoint half-line moments

\[
 n_j=\int_0^\infty(\psi^{(j)})^2dh,qquad
 H_j=\int_0^\infty h^2(\psi^{(j)})^2dh,qquad
 J_j=\int_0^\infty h(\psi^{(j)})^2dh.                  \tag{5}
\]

Because `exp(-2ah)<=1`, Cauchy--Schwarz gives

\[
 (Q_2^-)^2\leq A_aB_a,                                 \tag{6}
\]

where direct expansion and integration by parts give the exact envelopes

\[
\begin{aligned}
 A_a={}&n_2+(2a^2-2b_1)n_1+C^2n_0+2aC\psi(0)^2,\\
 B_a={}&H_2+4a^2H_1+C^2H_0+4aJ_1
       +2C(n_0-H_1)+4aCJ_0.                            \tag{7}
\end{aligned}
\]

For example, the boundary contribution in `A_a` is positive because
`integral psi' psi=-psi(0)^2/2`; all signs in (7) retain that endpoint.
Ordinary Cauchy gives

\[
 J_j\leq\sqrt{n_jH_j}.                                  \tag{8}
\]

The frozen endpoint moments determine

\[
 H_0={M_0\over2},\qquad H_1={M_1+n_0\over2},            \tag{9}
\]

and, with `bar b_1=M_1/M_0`,

\[
\begin{aligned}
 \sigma_2&=2\left(M_2-{M_1^2\over M_0}\right),\\
 B_0&={\sigma_2\over4}+n_1+\bar b_1n_0,\\
 H_2&=B_0-2\bar b_1(n_0-H_1)-\bar b_1^2H_0.            \tag{10}
\end{aligned}
\]

All quantities in (7)--(10) are current or endpoint prefix data.

## 2. Directed global bounds without a parameter mesh

The already proved lower bound is `b_1>=17/2`.  On
`0<=a<=1/4`, `17/2<=b_1<=14`, the expression `A_a` is increasing in `a`
and convex in `b_1`; its maximum is therefore at one of the two `b_1`
endpoints with `a=1/4`.  The frozen directed moments give

\[
 \boxed{A_a<159.}                                       \tag{11}
\]

They also give `n_0-H_1>0`.  Hence every `a`- and `b_1`-dependent term in
the upper envelope for `B_a` is increasing, after (8) is used.  Its maximum
is at `a=1/4,b_1=14`, and directed arithmetic gives

\[
 \boxed{B_a<24.}                                        \tag{12}
\]

Equations (6), (11), and (12) prove

\[
 \boxed{Q_2^-<\sqrt{3816}<62.}                           \tag{13}
\]

This is a single analytic rectangle envelope using frozen endpoint moments;
there is no subdivision of the tilt parameter.

## 3. Exact reflection rectangle

Write

\[
 x={b_2\over b_1},\qquad y={4a^2\over b_1}.
\]

The exact reflection coefficient becomes

\[
 {\kappa_2\over a}
 =4+x+{4\over x}+2y+{y^2+5y\over x}.                   \tag{14}
\]

The proved lower estimates `b_1>=17/2` and
`b_1b_2>627/4`, together with (1), give

\[
 {209\over192}<x\leq{60\over17},
 \qquad0\leq y\leq{1\over34}.                          \tag{15}
\]

The right side of (14) is increasing in `y` and convex in `x`.  Exact
rational evaluation of the two `x` endpoints at `y=1/34` gives

\[
 {103884673\over11596992}<9,
 \qquad {7151\over816}<9.                               \tag{16}
\]

Thus

\[
 \boxed{{\kappa_2(a)\over a}<9.}                        \tag{17}
\]

Combining (13), (17), and the sharp reserve
`s_3/a>14487/25` proves (2), since

\[
 9\cdot62=558<{14487\over25},
 \qquad {14487\over25}-558={537\over25}>0.             \tag{18}
\]

## Reproduction and exact scope

The standard-library companion replay consumes the frozen directed moment
receipts, reconstructs (9)--(10), checks (7) by exact integration-by-parts
coefficients, proves (11)--(13) with outward rational arithmetic, and checks
the reflection rectangle (14)--(18):

```text
python3 workstreams/all-degree-analytic-search-next-v1/src/verify_modular_n2_analytic_cost_envelope_20261103.py \
  --root . \
  --output workstreams/all-degree-analytic-search-next-v1/results/modular_n2_analytic_cost_envelope_20261103.json
```

The theorem is conditional only on (1).  It does not turn a finite check into
an all-degree conclusion and does not prove RH.
