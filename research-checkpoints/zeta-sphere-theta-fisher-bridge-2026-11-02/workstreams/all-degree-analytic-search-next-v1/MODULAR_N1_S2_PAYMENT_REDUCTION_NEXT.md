# Exact `N=1` reduction of the modular `s_2` payment

## Result and scope

This note specializes the audited modular square completion and innovation
payment to `N=1`.  It keeps the physical negative-side derivative signs, the
complete derivative-of-weight commutator, and the true signed old inverse.
The finite-`a` result is an exact reduction.  At the cancellation-safe
normalized endpoint `a=0`, existing independently audited complete-theta
bounds close the resulting strong payment inequality.

Let

\[
 g_a(u)=e^{au}\psi(u),\qquad
 s_0=\int_{\mathbb R}u g_a^2\,du,\qquad
 s_1=\int_{\mathbb R}u(g_a')^2\,du,
\]

and assume `a>0` and the actual current prefix `s_0,s_1>0`.  On the positive
half-line use

\[
 I_-=\int_0^\infty h e^{-2ah}\psi^2\,dh,
 \quad P_-=\int_0^\infty e^{-2ah}\psi^2\,dh,
 \quad Q_-=\int_0^\infty h e^{-2ah}\psi^2(a+v)^2\,dh,
 \quad v=-{\psi'\over\psi}.
\]

The complete audited integrated commutator is

\[
 \mathcal C_1={4aI_-\over s_0}-{4aQ_-\over s_1}
                    +{4a^2P_-\over s_1}.                 \tag{1}
\]

The one-negative-direction square completion has

\[
 \rho^2={s_0\over s_1},\qquad
 r_\perp=(4a^2\rho,0),\qquad
 \kappa_1=4a+{\|r_\perp\|^2\over4a}
          =4a\left(1+a^2{s_0\over s_1}\right),           \tag{2}
\]

while the physical negative-halfline top energy is

\[
 \mu_1^-={Q_-\over s_1}.                                 \tag{3}
\]

Consequently the exact cost decomposition is

\[
 \boxed{
 \kappa_1\mu_1^-
 =-\mathcal C_1+\mathscr R_a,\qquad
 \mathscr R_a=4a\left{
 {I_-\over s_0}+{aP_-\over s_1}
 +{a^2s_0Q_-\over s_1^2}\right}>0.}                    \tag{4}
\]

Thus negativity of `mathcal C_1` signs only part of the modular cost.  A
putative payment of `-mathcal C_1` alone always underpays the audited
one-direction square completion by the strictly positive current-prefix
quantity `mathscr R_a`.

Equation (4) is the precise link between the newly certified commutator sign
and the still-open `s_2` reserve.  In particular,

\[
 {s_2\over s_1}+\mathcal C_1\geq\mathscr R_a             \tag{5}
\]

is exactly the strong scalar comparison
`s_2/s_1>=kappa_1 mu_1^-`.  It is sufficient to pay the explicit negative
square-completion direction.  As in the archived payment packet, that strong
comparison is not asserted to be equivalent to every remaining term in the
full modular conservation law.

## 1. A finite-`a` noncircular witness criterion

The next reserve in (5) must not be assumed positive.  It has a direct
innovation representation that gives a noncircular sufficient test.

Put

\[
 Y_0={g_a\over\sqrt{s_0}},\qquad
 F=Y_1={g_a'\over\sqrt{s_1}},\qquad q=F'.                \tag{6}
\]

For a function `f` write `f^+(h)=f(h)` and `f^-(h)=f(-h)`, but retain
`q^-(h)=q(-h)`: it is evaluation of the physical derivative, not
`d(F(-h))/dh`.  With

\[
 \langle f,g\rangle_+=\int_0^\infty h f(h)g(h)\,dh,
\]

define the scalar old blocks, regressions, and innovations

\[
\begin{aligned}
 A_\pm&=\langle Y_0^\pm,Y_0^\pm\rangle_+,
 &\alpha_\pm&=\langle Y_0^\pm,q^\pm\rangle_+,\\
 \delta_\pm&=\langle q^\pm,q^\pm\rangle_+
                    -{\alpha_\pm^2\over A_\pm},
 &\Delta&=\alpha_--\alpha_+.
\end{aligned}                                            \tag{7}
\]

The actual signed old block is

\[
 A_+-A_-=1,
 \qquad K=A_-+A_-^2,                                     \tag{8}
\]

and the exact signed Schur identity is

\[
 \boxed{{s_2\over s_1}=\delta_+-\delta_--\Delta^2K.}    \tag{9}
\]

No normalization by `s_2` occurs in (6)--(9).  Replacing `q=F'` by the
actual monic next source changes it only by the old even feature and leaves
all innovations in (9) unchanged.

One completely current-prefix positive-side witness is obtained by
projecting `hF` off `Y_0^+`.  Set

\[
\begin{aligned}
 \mu_+&=\langle F^+,F^+\rangle_+,&
 b&=\langle Y_0^+,hF^+\rangle_+,\\
 \nu&=\langle hF^+,hF^+\rangle_+-{b^2\over A_+},&
 L_+&={\left(\mu_++\alpha_+b/A_+\right)^2\over\nu}.
\end{aligned}                                            \tag{10}
\]

Here `nu>0` for the independent actual design; the range-restricted
interpretation applies in a degenerate abstract design.  Integration by
parts, with the factor `h^2` killing the origin endpoint, gives

\[
 \langle q^+,hF^+\rangle_+=-\mu_+,
 \qquad \delta_+\geq L_+.                                \tag{11}
\]

Combining (4), (9), and (11) gives the explicit noncircular criterion

\[
 \boxed{
 L_++\mathcal C_1
 \geq \delta_-+\Delta^2A_-(1+A_-)+\mathscr R_a.}        \tag{12}
\]

Every term in (12) is formed from the complete theta profile and the known
current prefix; the negative innovation and true signed-inverse feedback are
retained.  Equation (12) implies (5), hence `s_2>0`, without using `s_2` as an
input.  Extra spatial witnesses may replace `L_+` by their larger dual lower
bound, with no change to the right side.

## 2. The cancellation-safe divided limit at `a=0`

The unilateral quantities in (7)--(12) are individually of order `1/a`.
They must not be limited term by term.  Write

\[
 s_j(a)=a\sigma_j+O(a^3),\qquad
 I_0=\int_0^\infty h\psi^2\,dh,qquad
 Q_0=\int_0^\infty h(\psi')^2\,dh.                     \tag{13}
\]

Directly from (1)--(4), with the divided current-prefix limit taken before
forming any unilateral approximation deficit,

\[
\begin{aligned}
 \mathcal C_1^{(0)}
   &:=\lim_{a\downarrow0}\mathcal C_1(a)
     ={4I_0\over\sigma_0}-{4Q_0\over\sigma_1},\\
 \lim_{a\downarrow0}\kappa_1\mu_1^-
   &={4Q_0\over\sigma_1},
 &\lim_{a\downarrow0}\mathscr R_a&={4I_0\over\sigma_0}.
\end{aligned}                                            \tag{14}
\]

Thus the endpoint form of (5) is

\[
 \boxed{
 {\sigma_2\over\sigma_1}+\mathcal C_1^{(0)}
 \geq {4I_0\over\sigma_0}
 \quad\Longleftrightarrow\quad
 {\sigma_2\over\sigma_1}\geq {4Q_0\over\sigma_1}.}   \tag{15}
\]

For `N=1`, the normalized reflection derivative vector is `d=(0,2)`, so
the archived endpoint coefficient is indeed
`4N+||d_perp||^2=4`; (14) agrees exactly with the general normalized defect
formula.

## 3. A prefix-only endpoint inequality with all terms explicit

The derivative-closed paired design gives a cancellation-safe lower bound on
`sigma_2`.  This section specializes its canonical-source form to a `2x2`
current-prefix scalar.

Set

\[
 Y_0={\psi\over\sqrt{\sigma_0}},\qquad
 Y_1={\psi'\over\sqrt{\sigma_1}},\qquad
 \beta={\sigma_1\over\sigma_0},\qquad
 q=(D^2+\beta)\psi.                                      \tag{16}
\]

Let `U=(Y_0,Y_1)^T`, and define

\[
 B=\int_0^\infty hUU^T\,dh,qquad
 p=\int_0^\infty hUq\,dh,qquad
 \gamma=B^{-1}p=\binom{x}{y}.                           \tag{17}
\]

All entries are current-prefix quantities.  If

\[
 P_0=\int_0^\infty\psi^2\,dh,qquad
 P_1=\int_0^\infty(\psi')^2\,dh,qquad c_*=\psi(0)^2,
\]

then integration by parts gives the fully explicit formulas

\[
 B=\begin{pmatrix}
 I_0/\sigma_0&-P_0/(2\sqrt{\sigma_0\sigma_1})\\
 -P_0/(2\sqrt{\sigma_0\sigma_1})&Q_0/\sigma_1
 \end{pmatrix},                                         \tag{18}
\]

\[
 p=\binom{
 (c_*/2-Q_0+\beta I_0)/\sqrt{\sigma_0}}
 {-(P_1+\beta P_0)/(2\sqrt{\sigma_1})}.                 \tag{19}
\]

The exact mixed derivative metric and canonical top-source derivative are

\[
 H=\begin{pmatrix}1/2&J\\J&1/2\end{pmatrix},qquad
 J=-{I_0\over\sqrt{\sigma_0\sigma_1}},                 \tag{20}
\]

\[
 \dot p_1=-{\sqrt{\sigma_1}\over2}\operatorname {tr}R,
 \qquad
 \operatorname {tr}R={2I_0\over\sigma_0}
              +{2Q_0-c_*\over\sigma_1}.                \tag{21}
\]

The same-parity diagonal entries in (20) are the actual normalized prefix,
and the mixed entry follows from the audited Green recurrence.  The boundary
term `-c_*/sigma_1` in (21) is essential.

For the minimal derivative-closed design, paired-remainder monotonicity and
canonical feedback cancellation give the noncircular lower bound

\[
 \boxed{
 \sigma_2\geq
 \underline\sigma_2:=4y\dot p_1-2\gamma^TH\gamma.}       \tag{22}
\]

The actual old inverse is used in deriving (22); no next-pivot denominator
or positive-parent substitute appears.  Combining (15) and (22), the single
prefix-computable inequality

\[
 \boxed{4y\dot p_1-2\gamma^TH\gamma\geq4Q_0}            \tag{23}
\]

is sufficient for the normalized `N=1` modular payment.  Equivalently, in
the commutator-linked form,

\[
 {4y\dot p_1-2\gamma^TH\gamma\over\sigma_1}
 +\mathcal C_1^{(0)}\geq {4I_0\over\sigma_0}.           \tag{24}
\]

Equations (18)--(24) reduce the endpoint attack to one explicit complete-theta
integral inequality.  They do not establish its sign.  At finite positive
`a`, (12) is the corresponding safe criterion; replacing it by the
termwise limit of its unilateral pieces would lose the required paired
cancellation.

## 4. Interface with the audited quadratic curvature payment

There is a second exact endpoint route using the already audited
complete-theta quadratic-family theorem.  Put

\[
 p(t)=t^2-\beta,\qquad \beta={\sigma_1\over\sigma_0},
 \qquad F_2=(D^2+\beta)\psi.
\]

Differentiating the raw bridge pivot at `a=0`, including the symbol derivative
`T_2'=2D`, gives

\[
 \sigma_2
 =2\int_{\mathbb R}u^2F_2^2\,du
  -2\int_{\mathbb R}(\psi')^2\,du
  -2\beta\int_{\mathbb R}\psi^2\,du.                   \tag{25}
\]

The root-deletion identity in `THETA_CURVATURE_PAYMENT.md` has exactly the
same right side after Parseval, so

\[
 h[p]=2\pi\sigma_2,\qquad h[1]=2\pi\sigma_0.             \tag{26}
\]

Its proved complete-theta inequality therefore supplies

\[
 \sigma_2>{1254\over8}\sigma_0.                         \tag{27}
\]

Combining (27) with the endpoint cost in (14) shows that the strong modular
payment would follow from the single lower-order ratio bound

\[
 \boxed{Q_0\leq {1254\over32}\sigma_0.}                 \tag{28}
\]

Equation (28) follows from already audited complete-theta estimates.  The
exact identity in the modular-commutator audit gives

\[
 Q_0={c_*\over4}+{1\over2}\int_0^\infty h\psi^2v'\,dh.  \tag{29}
\]

The same audit proves `17<v'<2v+20` and `v(0)=0`.  Hence
`v(h)>17h`, `psi(h)^2<=c_* exp(-17h^2)`, and

\[
\begin{aligned}
 Q_0
 &<{c_*\over4}+\int_0^\infty h\psi^2v\,dh
                    +10\int_0^\infty h\psi^2\,dh\\
 &={c_*\over4}+{P_0\over2}+10I_0\\
 &<c_*\left({1\over4}+{1\over8}+{5\over17}\right)
   ={91\over136}c_* .                                   \tag{30}
\end{aligned}
\]

Here the first integration by parts gives
`integral h psi^2 v=P_0/2`; the Gaussian majorant gives

\[
 P_0<c_*{\sqrt\pi\over2\sqrt {17}}<{c_*\over4},
 \qquad I_0<{c_*\over34}.                               \tag{31}
\]

The frozen modular-tilt receipt encloses `c_*<16/5`.  Independently, the
audited integrated-square receipt gives

\[
 \mathfrak M_0:=\int_{\mathbb R}u^2\psi(u)^2\,du>{3\over100},
 \qquad \sigma_0=2\mathfrak M_0>{3\over50}.             \tag{32}
\]

Therefore

\[
 Q_0<{182\over85}
 <{1881\over800}
 <{1254\over32}\sigma_0.                               \tag{33}
\]

Equations (27) and (33) prove the strict normalized endpoint payment

\[
 \boxed{
 \sigma_2>{1254\over8}\sigma_0>4Q_0,
 \qquad {\sigma_2\over\sigma_1}
       >\lim_{a\downarrow0}\kappa_1\mu_1^-.}           \tag{34}
\]

This uses finite certified complete-theta constants only to close the
`N=1`, `a=0` scalar.  It is not a uniform positive-`a` argument and does not
extend to higher degrees.

There is nevertheless a rigorous local consequence.  The normalized-prefix
construction makes `s_j(a)/a`, the current polynomial coefficients, and all
half-line integrals in (2)--(4) continuous at zero.  Since `sigma_1>0` and
the margin in (34) is strict,

\[
 \lim_{a\downarrow0}
 \left\{{s_2(a)\over s_1(a)}-\kappa_1(a)\mu_1^-(a)\right\}
 ={\sigma_2-4Q_0\over\sigma_1}>0.                       \tag{35}
\]

Hence there exists an `a_0>0` for which the raw finite-`a` strong payment and
`s_2(a)>0` hold throughout `0<a<a_0`.  No explicit `a_0` is claimed, and
extending this neighborhood to the full campaign interval remains open.

## Reproduction

From the workstream directory run

```text
python3 src/verify_modular_n1_s2_payment_reduction.py \
  > /tmp/modular_n1_s2_payment_reduction.replay.json
```

The provenance-hardened checker binds the modular-tilt,
integrated-square-payment, and curvature-square receipts. Its current source
SHA-256 is
`5fb1b8c78634662c739b04853c1044dbd5b7d339e02b5fcbecc8508d1e1df663`;
the deterministic receipt SHA-256 is
`93c708a1f8b1567b32ca62d1a02e8a9927ef165b1c99e924af6730eef7e72624`.
The checker verifies exact cleared algebra and frozen rational margins; the
continuity argument is analytic and is independently audited in
`MODULAR_N1_ENDPOINT_PAYMENT_INDEPENDENT_AUDIT.md`.

## Consequence

The verified sign `mathcal C_1<0` is useful but not itself an `s_2` payment.
The exact missing amount is isolated as the positive current-prefix remainder
in (4).  At the normalized endpoint, the audited quadratic curvature payment
and elementary current-prefix estimates prove the stronger comparison (34),
so the `N=1` endpoint defect is paid and `sigma_2>0`; continuity also gives an
unspecified positive neighborhood (35).  Extending criterion (12) through
the full `0<a<=1/4` campaign interval remains open.  No explicit finite-`a`
range, higher-degree theorem, all-degree theorem, first Xi--Laguerre
inequality, or RH statement is proved here.
