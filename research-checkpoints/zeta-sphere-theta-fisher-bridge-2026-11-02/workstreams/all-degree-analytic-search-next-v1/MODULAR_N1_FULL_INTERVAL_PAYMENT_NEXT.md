# Uniform `N=1` modular payment on `0<a<=1/4`

## Result and scope

This note closes the finite-`a` scalar left open by
`MODULAR_N1_S2_PAYMENT_REDUCTION_NEXT.md`. It transports the audited
complete-theta curvature square along the actual exponential-tilt path. All
raw signed pivots and the complete one-negative-direction cost keep their
archive normalization.

Let

\[
 g_a=e^{au}\psi,\qquad
 s_j(a)=\int_{\mathbb R}u\{T_j(D,a)g_a\}^2\,du,
\]

where

\[
 T_0=1,\qquad T_1=D,\qquad
 T_2=D^2+\beta(a),\qquad \beta(a)={s_1(a)\over s_0(a)}.
\]

For `a>0`, `s_0>0` is immediate from its divided hyperbolic integral below;
the exact derivative identity in Section 4 proves `s_1>0` without using a
parameter-cell certificate. On `0<a<=1/4` the exact archived
negative-direction cost is

\[
 \kappa _1\mu_1^-
 =4a\left(1+a^2{s_0\over s_1}\right){Q_-(a)\over s_1},
 \quad
 Q_-(a)=\int_0^\infty h e^{-2ah}\psi^2(a+v)^2\,dh,       \tag{1}
\]

with `v=-psi'/psi`. We prove

\[
 \boxed{
 s_2(a)> {1881\over200}a,
 \qquad
 \kappa _1(a)Q_-(a)<{12467\over1445}a,
 \qquad 0<a\leq {1\over4}.}                             \tag{2}
\]

Since

\[
 {1881\over200}-{12467\over1445}={44929\over57800}>0,  \tag{3}
\]

equations (1)--(3), together with `s_1>0`, give

\[
 \boxed{
 {s_2(a)\over s_1(a)}>\kappa _1(a)\mu_1^-(a),
 \qquad s_2(a)>0,
 \qquad 0<a\leq {1\over4}.}                             \tag{4}
\]

This is only the actual raw `N=1` modular scalar. It is not a higher-degree,
all-degree, first Xi--Laguerre, or RH result.

## 1. Cancellation-safe finite-`a` coordinates

For `h>0`, put

\[
 \chi_a={\sinh(2ah)\over a},\qquad
 C_a=\cosh(2ah),\qquad B_a=v^2-v'+a^2,
\]

and define

\[
\begin{aligned}
 S_0&=\int_0^\infty h\psi^2\chi_a\,dh,\\
 S_1&=\int_0^\infty h\psi^2
       \{\chi_a(v^2+a^2)-2vC_a\}\,dh,\\
 H_2&=\int_0^\infty h\psi^2
       \{\chi_a(B_a^2+4a^2v^2)-4vB_aC_a\}\,dh.
                                                               \tag{5}
\end{aligned}
\]

Direct physical-halfline splitting gives

\[
 {s_0\over a}=2S_0,qquad {s_1\over a}=2S_1,qquad
 \beta={S_1\over S_0}.                                  \tag{6}
\]

The raw second-derivative feature has values
`e^(ah)psi(B_a-2av)` and `e^(-ah)psi(B_a+2av)` on the two
physical halflines. Since

\[
 \int_{\mathbb R}u g_ag_a''\,du=-s_1,
\]

expansion of `T_2(D)g_a=g_a''+beta g_a` gives

\[
 \boxed{{s_2\over a}=2\left(H_2-{S_1^2\over S_0}\right).}       \tag{7}
\]

Thus the strong payment is equivalently

\[
 H_2-{S_1^2\over S_0}
 \geq2Q_-\left(1+a^2{S_0\over S_1}\right),             \tag{8}
\]

or, after clearing only the certified positive `S_0,S_1`,

\[
 \boxed{S_0S_1H_2-S_1^3
 \geq2Q_-S_0(S_1+a^2S_0).}                              \tag{9}
\]

These are exact divided-odd identities. The negative-side derivative keeps
the physical sign `a+v`, and the inverse subtraction `S_1^2/S_0` is retained.

## 2. Curvature transport along the actual inverse-selected path

Put `g=g_a`, `F=(D^2+beta)g`, and `beta=s_1/s_0`. When `a` varies,

\[
 \partial_aF=uF+2g'+\beta'g.                             \tag{10}
\]

The coefficient-derivative term cancels in the raw pivot:

\[
\begin{aligned}
 \int_{\mathbb R}uFg\,du
 &=\int u(g''+\beta g)g\,du\\
 &=-\int u(g')^2\,du+\beta\int ug^2\,du
 =-s_1+\beta s_0=0.                                     \tag{11}
\end{aligned}
\]

The remaining cross term is

\[
 \int_{\mathbb R}uFg'\,du
 =-{1\over2}\int(g')^2\,du- {\beta\over2}\int g^2\,du.
                                                                     \tag{12}
\]

Therefore differentiation of the actual raw next pivot gives

\[
 s_2'(a)=2\left\{
 \int u^2F^2\,du-\int(g')^2\,du-\beta\int g^2\,du
 \right\}.                                              \tag{13}
\]

Write `ell=log psi` and `k=ell''`. The logarithmic curvature is unchanged by
tilt: `(log g_a)''=k`. The exact quadratic root-deletion calculation in
`THETA_CURVATURE_PAYMENT.md`, applied to `g_a`, says

\[
\begin{aligned}
 &\int u^2F^2-\int(g')^2-\beta\int g^2\\
 &\qquad=\int_{\mathbb R}u^2e^{2au}\psi^2
 \left\{\left(\beta+{k\over2}\right)^2
       +{4k^2+k''\over8}\right\}\,du.                  \tag{14}
\end{aligned}
\]

Parity is not used in (14). One direct integration-by-parts check is as
follows. For `r=g'/g`, the two identities

\[
 \int u^2g^2k=\int g^2-2\int u^2(g')^2,                 \tag{15}
\]

\[
 \int u^2(g'')^2-\int(g')^2
 =\int u^2g^2\left({3k^2\over4}+{k''\over8}\right)     \tag{16}
\]

give (14) after splitting the powers of `beta`. For (16), eight times the
difference of the two sides is the integral of `(g^2 R)'`, where

\[
 R=4u^2r^3+2u^2rk-u^2k'-4ur^2+2uk-2r;
\]

rapid decay kills the boundary term.

The audited complete-theta theorem is pointwise,

\[
 4k(u)^2+k''(u)>1254\qquad(u\in\mathbb R).               \tag{17}
\]

Since

\[
 s_0'(a)=2\int_{\mathbb R}u^2e^{2au}\psi^2\,du,         \tag{18}
\]

equations (13)--(18) give

\[
 \boxed{s_2'(a)>{1254\over8}s_0'(a).}                   \tag{19}
\]

The `beta'` cancellation in (11) is essential: (19) holds along the actual
inverse-selected path, not a frozen-polynomial surrogate.

## 3. Uniform lower bound for the raw next pivot

At `a=0`, evenness gives `s_0(0)=s_2(0)=0`; the divided pivots and `beta`
extend analytically there. Integrating (19) gives

\[
 \boxed{s_2(a)>{1254\over8}s_0(a).}                     \tag{20}
\]

Moreover,

\[
 {s_0(a)\over a}
 =4\int_0^\infty h^2\psi(h)^2
   {\sinh(2ah)\over2ah}\,dh
 \geq4\int_0^\infty h^2\psi(h)^2\,dh
 =\sigma_0.                                              \tag{21}
\]

The independently replayed integrated-square receipt proves

\[
 \mathfrak M_0:=\int_{\mathbb R}u^2\psi(u)^2\,du
 >{3\over100},\qquad
 \sigma_0=2\mathfrak M_0>{3\over50}.                   \tag{22}
\]

Thus

\[
 s_2(a)>{1254\over8}{3\over50}a
 ={1881\over200}a.                                      \tag{23}
\]

## 4. Uniform upper bound for the complete modular cost

Set `f_a(h)=e^(-ah)psi(h)`. Then

\[
 Q_-(a)=\int_0^\infty h(f_a')^2\,dh.                    \tag{24}
\]

Differentiation and one integration by parts give

\[
\begin{aligned}
 Q_-'(a)
 &=\int_0^\infty f_a^2\,dh
     -2\int_0^\infty h^2(f_a')^2\,dh\\
 &=-\int_0^\infty h^2v'(h)f_a(h)^2\,dh<0.              \tag{25}
\end{aligned}
\]

The second equality follows by integrating `(h^2(a+v)f_a^2)'`; the last sign
is the audited `v'>17`. Hence the endpoint audit gives

\[
 \boxed{Q_-(a)<Q_0<{182\over85}.}                       \tag{26}
\]

The `Q_0` bound uses the independently enclosed center value
`psi(0)^2<16/5` and the analytic curvature estimates from that audit. The
center enclosure is independent of the modular receipt's parameter cells;
no uniform-in-`a` claim from those cells is used here.

The inverse-feedback factor has a stronger analytic bound requiring no
parameter subdivision. Applying the degree-one case of the curvature
transport identity to `F_1=g_a'` gives

\[
\begin{aligned}
 s_1'(a)
 &=2\int_{\mathbb R}u^2(g_a')^2\,du-\int_{\mathbb R}g_a^2\,du\\
 &=-\int_{\mathbb R}u^2g_a^2(\log g_a)''\,du
 =\int_{\mathbb R}u^2g_a^2v'\,du.                      \tag{27}
\end{aligned}
\]

Here the middle equality is one integration by parts, and
`(log g_a)''=(log psi)''=-v'`. The audited pointwise inequality `v'>17`
therefore gives

\[
 s_1'(a)>17\int_{\mathbb R}u^2g_a^2\,du
 ={17\over2}s_0'(a).                                    \tag{28}
\]

Since `s_0(0)=s_1(0)=0`, integration from zero yields

\[
 s_1(a)>{17\over2}s_0(a)>0,
 \qquad {s_0\over s_1}<{2\over17}.                     \tag{29}
\]

Thus `a^2<=1/16` implies

\[
 a^2{s_0\over s_1}<{1\over136}.                        \tag{30}
\]

Finally,

\[
 \kappa_1Q_-
 <4a{137\over136}{182\over85}
 ={12467\over1445}a,                                   \tag{31}
\]

which is the second bound in (2). The signed negative-side term has not been
replaced by an absolute two-sided energy: (25) controls its physical
half-line definition directly.

## 5. Reproduction and exact scope

From the workstream directory run

```text
python3 src/verify_modular_n1_full_interval_payment.py \
  > results/modular_n1_full_interval_payment.json
```

The standard-library checker binds the frozen curvature, integrated-square,
and modular-tilt receipts, validates the archived source manifests behind the
first two receipts and the source/provenance fields of the third, reads their
directed endpoints, and verifies every rational comparison in (22)--(31). The
replay receipt records this note's SHA-256 without self-freezing it inside the
checker. Dependency-free tamper regressions cover receipt drift and malformed,
duplicate, or path-escaping frozen-manifest entries. It performs no new
interval sweep.

The conclusion (4) pays the single archived `N=1` negative modular direction
on `0<a<=1/4`. It does not prove that the complete modular conservation law
has no other unpaid term at higher degree, does not extend the quadratic
curvature identity to higher-degree root-deletion families, and supplies no
all-degree or RH conclusion.
