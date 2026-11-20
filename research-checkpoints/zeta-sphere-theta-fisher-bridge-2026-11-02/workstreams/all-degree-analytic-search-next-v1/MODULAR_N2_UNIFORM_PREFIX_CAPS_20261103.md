# Uniform prefix caps for the finite-tilt `N=2` modular coefficient

## Result and scope

For the complete theta profile and every

\[
 0<a\leq {1\over4},
\]

the already positive prefix through degree two satisfies

\[
 \boxed{{17\over2}<b_1(a)<12,\qquad 0<b_2(a)<30}             \tag{1}
\]

and the exact `N=2` reflection coefficient obeys

\[
 \boxed{{\kappa _2(a)\over a}<9.}                           \tag{2}
\]

The proof reuses the independently replayed all-shift complete-theta bridge
moments; it performs no new parameter sweep.  Equation (2) is only a uniform
bound for the current-prefix modular coefficient.  By itself it does not
bound the negative-half-line mass `Q_2^-`, prove the strong payment, extend
the result to higher degrees, or prove RH.

## 1. Frozen all-shift moments

Let `M_j(a)` be the divided bridge moments in the physical normalization and
let `mu_j(a)=4^j M_j(a)` be the archive normalization.  The audited
integrated-`H5` certificate covers all closed shift bins in
`0<=a<=1/2`.  Its author and independent-replay rows are byte-for-byte equal
and give the simple directed bounds

\[
 {147\over100}<\mu _1(a)<{3\over2},
 \qquad \mu _2(a)<209.                                   \tag{3}
\]

The ground divided moment has the exact half-line representation

\[
 \mu _0(a)=\int_0^\infty h\psi(h)^2
              {\sinh(2ah)\over a}\,dh.                  \tag{4}
\]

Because `sinh(x)/x` is increasing for positive `x`, (4) is increasing in
`a` after its continuous extension to zero.  The independently frozen
integrated-square receipt gives

\[
 \mu _0(a)\geq\mu _0(0)
 =2\int_0^\infty h^2\psi(h)^2dh>{1\over32}.              \tag{5}
\]

The rational `1/32` in (5) is weaker than the directed receipt endpoint and
is used only to make the following comparison transparent.

## 2. The two recurrence caps

The first two physical recurrence coefficients are

\[
 b_1={M_1\over M_0}={\mu _1\over4\mu _0},
 \qquad
 b_2={M_2-M_1^2/M_0\over M_1}
 ={\mu _2\over4\mu _1}-{\mu _1\over4\mu _0}.            \tag{6}
\]

Equations (3)--(6) immediately imply

\[
 b_1<{(3/2)\over4(1/32)}=12.                             \tag{7}
\]

The analytic curvature transport already proves `b_1>17/2` on the full
positive-shift interval.  Using this lower bound in the second identity in
(6), together with (3), gives

\[
 b_2<{209\over4(147/100)}-{17\over2}
 ={7951\over294}<30.                                    \tag{8}
\]

This use of the integrated-`H5` receipt is only a source of coarse uniform
current-prefix moment caps.  It does not infer an unobserved degree from a
finite positive ladder.

## 3. Exact reflection-coefficient bound

The quadratic curvature transport also gives

\[
 b_1b_2={s_2\over s_0}>{1254\over8}={627\over4}.         \tag{9}
\]

Put

\[
 x={b_2\over b_1},\qquad y={4a^2\over b_1}.
\]

From (1), (8), (9), and `a<=1/4`,

\[
 {209\over192}<x<{60\over17},
 \qquad 0<y<{1\over34}.                                 \tag{10}
\]

The exact reflection formula becomes

\[
 {\kappa _2\over a}
 =4+x+{4\over x}+2y+{y^2+5y\over x}.                    \tag{11}

For fixed positive `x`, (11) is increasing in `y`.  At `y=1/34` it is a
convex function of `x`, so its maximum on the closed rectangle containing
(10) occurs at an `x` endpoint.  Exact rational evaluation gives

\[
\begin{aligned}
 K\left({209\over192},{1\over34}\right)
   &={103884673\over11596992}<9,\\
 K\left({60\over17},{1\over34}\right)
   &={7151\over816}<9.                                  \tag{12}
\end{aligned}

Equations (10)--(12) prove (2).  The remaining uniform strong-payment task
is now cleanly separated: it is enough to compare the independently bounded
`s_3(a)/a` with less than nine times the physical mass `Q_2^-(a)`.

## Reproduction

From the checkpoint root run

```text
python3 workstreams/all-degree-analytic-search-next-v1/src/verify_modular_n2_uniform_prefix_caps_20261103.py \
  --root . \
  --output workstreams/all-degree-analytic-search-next-v1/results/modular_n2_uniform_prefix_caps_20261103.json
```

The standard-library verifier binds the frozen author and audit receipts,
checks that their moment rows agree, extracts all directed bounds in (3),
checks (5), and replays every rational comparison in (7)--(12).
