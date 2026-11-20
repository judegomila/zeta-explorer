# Five-scalar Sobolev geometry and its source-specific obstruction

## Scope and outcome

This note attacks equation (24) of `THETA_SOBOLEV_AUXILIARY_NEXT.md` for the
actual complete-theta residual.  It keeps

\[
 W(t)=\widehat\psi(t)=2\Xi(t)
\]

and the exact `2 pi` normalization of that note.  There are three conclusions.

1. The five-scalar expression is exactly a **lower** bound on a
   two-dimensional orthogonal projection. Positive Gram geometry supplies
   the opposite, upper, bound. Orthogonalizing the two directions reduces
   (24) to one compact correlated inequality.
2. Integration by parts, positivity of `W^2`, convexity of a source
   potential, invertibility of the old block, and even positivity of the
   entire signed-target moment functional do not imply (24). An analytic
   super-Gaussian family gives actual nontrivial old-data residuals for which
   every target pivot is positive but the five-scalar sufficient condition
   is negative for all sufficiently large family parameters. This is an
   asymptotic proof, not a finite degree sweep.
3. Consequently a proof for `W=2 Xi`, if true, must use a genuinely
   complete-theta correlation. Already the first odd rung asks for a reverse
   spectral-kurtosis inequality for the complete theta profile. The present
   note identifies that obligation but does not prove it.

Thus the proposed two-generator lemma remains a legitimate noncircular
sufficient route for the actual theta residual, but generic Sobolev, moment,
or Gram arguments cannot establish it. No Xi--Laguerre sign or RH conclusion
is claimed.

## 1. Exact domain and normalization

Fix `epsilon in {0,1}`, `N>=0`, and

\[
 q(t)=t^\epsilon P_N(t^2),\qquad \kappa=2N+\epsilon\geq1.       \tag{1}
\]

The stipulated old signed block is assumed invertible. Therefore `P_N` is
the actual monic signed Galerkin residual determined by the old moments,
exactly as in equation (2) of the preceding note. No sign of that old block
is assumed.

Use the five positive-weight scalars

\[
 \begin{aligned}
 A&=\int q'^2W^2dt,& B&=\int qq''W^2dt,\\
 C&=\int q^2W^2dt,& D&=\int t^2q^2W^2dt,\\
 E&=\int tqq'W^2dt
 \end{aligned}                                                   \tag{2}
\]

and

\[
 u=-{A+B\over2},\qquad v=-{C+2E\over2},\qquad
 \Delta=AD-E^2>0.                                                \tag{3}
\]

The strict determinant inequality follows from the polynomial independence
of `q'` and `tq` and does not require a sign assumption on the target form.
The exact pivot identity is

\[
 \boxed{
 2\pi\mathcal S_{N,\epsilon}
 =\int\left\{q^2W'^2-{q'^2+qq''\over2}W^2\right\}dt.}           \tag{4}
\]

With

\[
 K=\begin{pmatrix}A&E\\E&D\end{pmatrix},\qquad r=\binom uv,
\]

the sufficient remainder from the two-generator auxiliary is

\[
 \mathcal H=r^TK^{-1}r-{A+B\over2}=r^TK^{-1}r+u.                \tag{5}
\]

Equation (24) is precisely `mathcal H>=0`, and

\[
 \mathcal H\geq0\quad\Longrightarrow\quad
 \mathcal S_{N,\epsilon}\geq0.                                \tag{6}
\]

The converse in (6) is not asserted.

## 2. Projection geometry: why a bare Gram proof has the wrong direction

In the real Hilbert space `L^2(R,dt)`, set

\[
 Y=qW',\qquad a=q'W,\qquad b=tqW,
 \qquad V=\operatorname {span}\{a,b\}.                           \tag{7}
\]

Then `K` is the Gram matrix of `(a,b)` and

\[
 r=\binom{\langle Y,a\rangle}{\langle Y,b\rangle}.
\]

Consequently

\[
 \boxed{r^TK^{-1}r=\|P_VY\|_2^2}                               \tag{8}
\]

and the proposed lemma becomes

\[
 \boxed{
 \mathcal H=\|P_VY\|_2^2+u
 =\left\|P_V\left(Y+{a\over2}\right)\right\|_2^2-{A\over4}
 \geq0.}                                                        \tag{9}
\]

Thus (24) requires a projection to lie **outside** a prescribed ball. The
positive semidefiniteness of the extended Gram matrix of `(Y,a,b)` gives only

\[
 \|P_VY\|_2^2\leq\|Y\|_2^2.                                   \tag{10}
\]

Together with (4), (10) recovers the already known upper bound
`mathcal H<=2 pi mathcal S`; it cannot give the lower bound (9).

There is also an exact scalar reduction. Orthogonalize `b` against `a`.
Then

\[
 r^TK^{-1}r={u^2\over A}+{(Av-Eu)^2\over A\Delta}.              \tag{11}
\]

Using (3),

\[
 {u^2\over A}+u={B^2-A^2\over4A},\qquad
 Av-Eu=-{AC+E(A-B)\over2}.
\]

Hence

\[
 \boxed{
 \mathcal H={B^2-A^2\over4A}
 +{\{AC+E(A-B)\}^2\over4A(AD-E^2)}.}                           \tag{12}
\]

Equivalently, the whole five-scalar obligation is

\[
 \boxed{
 \{AC+E(A-B)\}^2
 \geq(AD-E^2)(A^2-B^2).}                                      \tag{13}
\]

When `abs(B)>=A`, the derivative term alone makes (13) automatic. In the
unresolved regime `abs(B)<A`, (13) is a genuine lower bound on the correlated
heat-drift gain. Estimating `A,B,C,D,E` separately discards exactly the
correlation on the left of (13).

Equations (8)--(13) are equivalent only to the **sufficient auxiliary
condition** `mathcal H>=0`. They are not equivalent to the target pivot sign.

## 3. What actual old-data orthogonality supplies

One integration by parts in (4) gives

\[
 2\pi\mathcal S_{N,\epsilon}
 ={1\over2}\int q^2J_Wdt,
 \qquad J_W=W'^2-WW''.                                         \tag{14}
\]

Thus the signed target bilinear form has density `J_W/(4 pi)`. For every old
same-parity polynomial `p`, the actual residual satisfies the noncircular
identity

\[
 \int qpJ_Wdt=0.                                                \tag{15}
\]

Without dividing by `W`, another integration by parts rewrites it as

\[
 2\int qpW'^2dt+\int(q'p+qp')WW'dt=0.                           \tag{16}
\]

For example, whenever they are nonzero, both `p=q''` and
`p=tq'-\kappa q` have the correct parity and degree at most `kappa-2`, so
(16) applies to them. These identities are real extra information from the
old-data residual. They involve the joint `W'^2` and `WW'` channels,
however, and do not collapse to positivity of the five-scalar `W^2` Gram.
The next section shows that even imposing the full residual condition (15)
under a positive target density is insufficient in general.

## 4. A nontrivial old-block obstruction with positive target

For an integer `m>=1`, put

\[
 V_m(t)=t^{2m},\qquad W_m(t)=e^{-V_m(t)/2},\qquad
 d\mu_m(t)=W_m(t)^2dt=e^{-t^{2m}}dt.                             \tag{17}
\]

Each `W_m` is positive, even, and Schwartz. Direct differentiation gives

\[
 W_m'^2-W_mW_m''={V_m''\over2}W_m^2.                            \tag{18}
\]

Therefore the exact normalization (14) becomes

\[
 \boxed{
 2\pi\mathcal S^{(m)}(q)
 ={1\over4}\int q(t)^2V_m''(t)d\mu_m(t).}                       \tag{19}
\]

The target density in (19) is nonnegative and positive away from the origin.
All of its polynomial moment blocks are consequently positive definite, so
all old blocks are invertible and all target pivots are strictly positive.

Consider the first nonconstant even residual, `(N,epsilon)=(1,0)`. Define

\[
 I_j^{(m)}=\int_{\mathbb R}t^j d\mu_m(t)
 \quad(j\ \hbox{even}),\qquad
 c_m={I_{2m}^{(m)}\over I_{2m-2}^{(m)}},\qquad
 q_m(t)=t^2-c_m.                                                  \tag{20}
\]

Since `V_m''` is a positive constant times `t^(2m-2)`, one has

\[
 \int q_mV_m''d\mu_m=0.                                        \tag{21}
\]

Thus `q_m` is not an arbitrary test polynomial: it is the actual monic
old-data residual against the nontrivial old space `span{1}`. In particular,
the old block is a strictly positive scalar. Equation (19) also gives

\[
 2\pi\mathcal S^{(m)}(q_m)>0.                                  \tag{22}
\]

Nevertheless the sufficient condition (24) eventually fails. This follows
analytically, without checking a list of degrees. Put

\[
 \delta={1\over2m}.
\]

For fixed even `j`, the moments have the exact gamma representation and
expansion

\[
 \begin{aligned}
 I_j^{(m)}
 &=2\delta\,\Gamma((j+1)\delta)
 ={2\over j+1}\Gamma(1+(j+1)\delta)\\
 &={2\over j+1}-2\gamma\delta
 +(j+1)\{\gamma^2+\zeta(2)\}\delta^2+O(\delta^3),              \tag{23}
 \end{aligned}
\]

where `gamma` is Euler's constant. Also

\[
 c_m={\Gamma(1+\delta)\over\Gamma(1-\delta)}
 =1-2\gamma\delta+2\gamma^2\delta^2+O(\delta^3).               \tag{24}
\]

Substitution of (23)--(24) into the definitions (2) gives

\[
 \begin{array}{c|l}
 A&\displaystyle {8\over3}-8\gamma\delta
      +12\{\gamma^2+\zeta(2)\}\delta^2+O(\delta^3)\\[2mm]
 B&\displaystyle -{8\over3}+8\gamma\delta
      +\{-12\gamma^2+4\zeta(2)\}\delta^2+O(\delta^3)\\[2mm]
 C&\displaystyle {16\over15}-{16\gamma\over3}\delta
      +{40\gamma^2\over3}\delta^2+O(\delta^3)\\[2mm]
 D&\displaystyle {16\over105}-{16\gamma\over15}\delta
      +{56\gamma^2\over15}\delta^2+O(\delta^3)\\[2mm]
 E&\displaystyle -{8\over15}+{8\gamma\over3}\delta
      +\{-{20\gamma^2\over3}+4\zeta(2)\}\delta^2
      +O(\delta^3).
 \end{array}                                                     \tag{25}
\]

In particular,

\[
 \begin{aligned}
 A+B&=16\zeta(2)\delta^2+O(\delta^3),\\
 C+2E&=8\zeta(2)\delta^2+O(\delta^3),\\
 K&\longrightarrow
 \begin{pmatrix}8/3&-8/15\\-8/15&16/105\end{pmatrix},
 \qquad \det K\longrightarrow {64\over525}>0.                 \tag{26}
 \end{aligned}
\]

It follows from (3) that

\[
 u=-8\zeta(2)\delta^2+O(\delta^3),\qquad
 v=-4\zeta(2)\delta^2+O(\delta^3).                             \tag{27}
\]

The inverse Gram matrix stays bounded, so
`r^T K^(-1) r=O(delta^4)`. Hence

\[
 \boxed{
 \mathcal H_m=-8\zeta(2)\delta^2+O(\delta^3)
 =-{\pi^2\over3m^2}+O(m^{-3})<0}                               \tag{28}
\]

for every sufficiently large integer `m`.

This is a source-relevant obstruction: (17)--(22) use the same differential
target density, exact old-data projection, and exact `2 pi` Sobolev
normalization as the theta calculation. The target is in fact positive at
every degree, yet (24) fails at the single fixed residual degree `kappa=2`
throughout an analytic tail of the source family. It therefore rules out a
proof of (24) based only on integration by parts, positive `W^2` moment
geometry, convexity of `-2 log W`, target positivity, or old-block
invertibility. It does not rule out a complete-theta-specific proof.

## 5. The first exact theta obligation

The obstruction above directs attention back to arithmetic of the complete
theta source. At the first odd rung, `(N,epsilon)=(0,1)` and `q=t`. For the
actual `W=2 Xi`, set

\[
 A_0=\int W^2dt,\qquad C_0=\int t^2W^2dt,
 \qquad D_0=\int t^4W^2dt.                                     \tag{29}
\]

Here `A=A_0`, `B=0`, `C=E=C_0`, and `D=D_0`. Exact inversion of the
two-by-two Gram gives

\[
 \boxed{
 \mathcal H_{0,1}
 ={A_0\{5C_0^2-A_0D_0\}\over
   4(A_0D_0-C_0^2)}.}                                          \tag{30}
\]

Thus equation (24) already requires the theta-specific reverse-kurtosis
bound

\[
 \boxed{A_0D_0\leq5C_0^2.}                                    \tag{31}
\]

Under the campaign's nonunitary Fourier convention
`W(t)=integral psi(h)e^(-ith)dh`, Plancherel gives exactly

\[
 A_0=2\pi\|\psi\|_2^2,\qquad
 C_0=2\pi\|\psi'\|_2^2,\qquad
 D_0=2\pi\|\psi''\|_2^2.
\]

All `2 pi` factors cancel in (31), leaving

\[
 \boxed{
 \|\psi\|_2^2\|\psi''\|_2^2
 \leq5\|\psi'\|_2^4.}                                        \tag{32}
\]

Ordinary Cauchy--Schwarz gives the other direction
`||psi'||_2^4<=||psi||_2^2||psi''||_2^2`, so (32) is genuinely additional
source information. It is not a formal consequence of Fourier positivity
or Gram positivity.

For a general rung, the exact complete-theta obligation is (13) with the
actual signed residual fixed by the old block. A viable next proof must
therefore control the combined quantity

\[
 AC+E(A-B)                                                       \tag{33}
\]

against the determinant and commutator deficit in (13), preferably before
separating the complete-theta orbit or Ewald contributions. Equations
(15)--(16) are safe old-data identities that may be used in such a proof;
using the new diagonal target moment would instead collapse back toward the
target itself.

## Self-audit and nonclaims

- Integrating (4) gives (14) with the factor `1/2`; for
  `W=e^(-V/2)`, this gives (19) with the factor `1/4`. Thus no `2 pi` factor
  was dropped in the countermodel or in the Plancherel form (32).
- The projection formula (8), the shifted form (9), and the orthogonalized
  expression (12) expand back to equation (24) exactly.
- The super-Gaussian residual is determined by a strictly positive old
  scalar block, not chosen after seeing the five-scalar inequality. Its
  target pivot is strictly positive while `mathcal H_m<0`, explicitly
  separating a sufficient certificate from the target sign.
- The sign in (28) follows from an analytic `m -> infinity` expansion at the
  single fixed rung `kappa=2`; no finite degree or rung sweep is used.
- No proof of (31), (32), or (13) for the actual complete-theta source is
  claimed. Failure of the generic auxiliary criterion does not imply a
  negative theta pivot, any Xi--Laguerre sign, or RH.
