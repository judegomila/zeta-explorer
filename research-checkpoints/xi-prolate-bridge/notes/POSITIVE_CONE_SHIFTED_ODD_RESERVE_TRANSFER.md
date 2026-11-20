# Quantitative positive-cone transfer to the shifted odd reserve

## 0. Claim boundary and outcome

This note combines two exact finite source reductions which were previously
separate:

1. the positive-response cone and the even-only resolvent angle from
   `notes/POSITIVE_TRIAL_GROUND_CONE_ANGLE_TRANSFER.md`; and
2. the squared-mode source factorization and coefficient reserve from
   `notes/EVEN_GROUND_IMAGINARY_AXIS_ODD_INERTIA.md` and
   `notes/WEYL_COLLAPSE_SHIFTED_COEFFICIENT_RESERVE.md`.

The combination gives a quantitative, noncircular sufficient condition for
the odd block at the **Ritz upper shift**.  In its source-checkable form the
new gate is

\[
 \boxed{
  {\chi_U\over g_+}\,{R_N(\gamma)\over\gamma^2}<1.}       \tag{0.1}
\]

Here `g_+` and `chi_U` use only the shifted even complement, `gamma` is a
certified amount of response-cone depth left after the even ground is moved
from an explicit positive trial state, and `R_N(gamma)` is an explicit
upper bound for the squared-mode pencil radius.  No odd floor is assumed in
forming any quantity in (0.1).

The gate is a finite implication, not an asymptotic estimate.  No theorem in
the current source lock proves (0.1), or even a positive lower rate for
`gamma`, on an unbounded source-derived schedule.  The weighted even solve
required by equation (5.2) of `DIRECT_RH_ATTACK.md` also remains separate.
Thus this note does not prove equation (5.2), a locally uniform determinant
limit, or a Riemann-hypothesis conclusion.  The formal project state remains
`P0_INVALIDATED`.

Every actual-source use below retains the interval
`[-log(lambda),log(lambda)]`, Lebesgue measure, zero extension, the locked
Fourier sign, inversion as reflection, every prime power through the
inclusive endpoint `n<=lambda^2`, and the minus sign on the prime block in
source equation (3.19).  The source dependence enters through the complete
matrix before any absolute value is taken.

## 1. Even-only data and the response cone

Fix an integer `N>=1`.  The `N=0` scalar space has no odd block and is not
in the domain of the squared-mode radius or Theorem 4.1 below.

Use the normalized real even basis

\[
 e_0^+=V_0,\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2}\quad(1\leq n\leq N).
                                                               \tag{1.1}
\]

For `alpha` in the compactified half-line `[0,infinity]`, put

\[
 b_\alpha=\left(1,{\sqrt2\alpha^2\over1+\alpha^2},
 \ldots,{\sqrt2\alpha^2\over N^2+\alpha^2}\right),
 \qquad b_\infty=(1,\sqrt2,\ldots,\sqrt2).             \tag{1.2}
\]

For a unit real even vector `z` in the open response cone, define

\[
 m=m_{\mathcal C}(z)
 =\min_{\alpha\in[0,\infty]}
 {\langle b_\alpha,z\rangle\over\|b_\alpha\|}>0.       \tag{1.3}
\]

Let `kappa` be an independently specified unit even anchor and write the
complete even block as

\[
 Q_+=\begin{bmatrix}q&b^*\\ b&A\end{bmatrix}
 \quad\hbox{on}\quad
 \mathbb R\kappa\oplus(\kappa^\perp\cap H_+).           \tag{1.4}
\]

Let `U` be a certified upper bound for the lowest even eigenvalue and assume

\[
 B=A-UI\succ0,\qquad
 g_+=\lambda_{\min}(B)>0.                               \tag{1.5}
\]

Define the even-only quantities

\[
 \tau_+=\|B^{-1}b\|,\qquad
 \chi_U=\langle b,B^{-1}b\rangle-(q-U),                 \tag{1.6}
\]

and let `T>=tau_+` be any certified upper enclosure.  Choose the sign of
`kappa` so that its angle from `z` is

\[
 \theta_0=\angle(\kappa,z)\in[0,\pi/2].                 \tag{1.7}
\]

The starting hypothesis is the strict finite cone gate

\[
 \overline\theta:=\theta_0+\arctan T<\arcsin m.          \tag{1.8}
\]

Its unused depth is the explicit positive number

\[
 \boxed{
 \gamma=\sin(\arcsin m-\overline\theta)>0.}             \tag{1.9}
\]

## 2. Quantitative transfer of the unused cone depth

Let `epsilon` be the lowest even eigenvalue and let `x` be its unit real
eigenvector, phased so that `<kappa,x>` is positive.  Assumption (1.5) and
interlacing make this eigenvalue simple.  The even complementary equation
gives

\[
 \tan\angle(x,\kappa)\leq\tau_+\leq T,                  \tag{2.1}
\]

and hence `angle(x,z)<=overline(theta)`.

### Lemma 2.1 (depth left after the angle transfer)

Under (1.8),

\[
 \boxed{m_{\mathcal C}(x)\geq\gamma.}                   \tag{2.2}
\]

In particular, with

\[
 x_0=\langle e_0^+,x\rangle,
 \qquad c=\langle b_\infty,x\rangle,
\]

one has the quantitative endpoint bounds

\[
 \boxed{x_0\geq\gamma,
 \qquad c\geq\gamma\sqrt{2N+1}.}                      \tag{2.3}
\]

**Proof.**  Fix `alpha` and normalize
`widehat b_alpha=b_alpha/||b_alpha||`.  Put
`m_alpha=<widehat b_alpha,z> >= m`.  If the
actual angle from `x` to `z` is `theta`, spherical Cauchy--Schwarz gives

\[
 \langle\widehat b_\alpha,x\rangle
 \geq m_\alpha\cos\theta
      -\sqrt{1-m_\alpha^2}\sin\theta.                   \tag{2.4}
\]

The right side is increasing in `m_alpha` and decreasing in `theta` on the
range selected by (1.8).  It is therefore at least

\[
 m\cos\overline\theta-\sqrt{1-m^2}\sin\overline\theta
 =\sin(\arcsin m-\overline\theta)=\gamma.              \tag{2.5}
\]

Taking the minimum over `alpha` proves (2.2).  At `alpha=0`, the response
vector is `e_0^+`; at `alpha=infinity`, its norm is `sqrt(2N+1)`.
Equation (2.3) follows.  \(\square\)

The lower bound (2.2) is sharp for angle-only information.  For a fixed
supporting response hyperplane, moving from `z` along its worst tangent
direction makes (2.4) an equality.

There is also a sharp necessary condition which is especially restrictive
when the anchor is the projected prolate state.  Normalize the endpoint
response vector by

\[
 \widehat d={b_\infty\over\sqrt{2N+1}},
 \qquad
 t_\kappa=|\langle\widehat d,\kappa\rangle|.          \tag{2.6}
\]

### Lemma 2.2 (same-anchor endpoint bottleneck)

For every unit `z` in the response cone and every unit `kappa`,

\[
 \boxed{
 \arcsin m_{\mathcal C}(z)-\angle(\kappa,z)
 \leq\arcsin t_\kappa.}                              \tag{2.7}
\]

Consequently, the strict cone gate (1.8) can hold only if

\[
 \boxed{
 \arctan T<\arcsin t_\kappa,
 \qquad
 T<{t_\kappa\over\sqrt{1-t_\kappa^2}}}              \tag{2.8}
\]

when `t_kappa<1`; for `t_kappa=1` the second right side is interpreted as
infinity.  In particular, `t_kappa=0` makes the same-anchor gate impossible,
even for `T=0`.

**Proof.**  Let

\[
 H_\infty=\{y:\langle\widehat d,y\rangle=0\}
\]

be the endpoint great hyperplane.  It lies in the complement of the open
response cone.  The exact spherical-cap theorem and the elementary distance
to a great hyperplane give

\[
 \arcsin m_{\mathcal C}(z)
 =\operatorname {dist}_S(z,\mathcal C_N^c)
 \leq\operatorname {dist}_S(z,H_\infty).             \tag{2.9}
\]

The spherical triangle inequality, using any closest point of `kappa` on
`H_infinity`, yields

\[
 \operatorname {dist}_S(z,H_\infty)
 \leq\angle(z,\kappa)+\operatorname {dist}_S(\kappa,H_\infty)
 =\angle(z,\kappa)+\arcsin t_\kappa.                 \tag{2.10}
\]

This proves (2.7).  Combining (2.7) with (1.8) gives the first strict
inequality in (2.8), and tangent is increasing on `[0,pi/2)`, giving the
second.  \(\square\)

The bound is sharp.  Take `z=e_0^+`, for which the endpoint hyperplane is a
nearest cone boundary and
`m_C(z)=1/sqrt(2N+1)`, then move `kappa` from `z` along the shortest
geodesic toward that hyperplane.  Every inequality in (2.7) is an equality
until the hyperplane is reached.

For the unit projected prolate anchor, every locked source mode has value
`L^(-1/2)` at the identified endpoint.  Therefore

\[
 \boxed{
 t_\kappa={|\langle b_\infty,\kappa\rangle|
                 \over\sqrt{2N+1}}
 ={\sqrt L\,|(P_Nk_\lambda^+)(L/2)|
   \over\sqrt{2N+1}\,\|P_Nk_\lambda^+\|}.}           \tag{2.11}
\]

Thus a same-anchor cone proof must control the even shifted solve relative
to the normalized endpoint value, not merely make it tend to zero.  Current
locked prolate estimates do not prove that relative inequality on an
unbounded schedule.  Lemma 2.2 constrains this particular anchor transfer;
it does not prevent using a different positive anchor for the odd sign if a
separate source-specific comparison to the determinant state is proved.

## 3. A ground-free bound for the squared-mode pencil radius

Write the boundary-normalized ground in complex source modes as

\[
 {x\over c}=\sum_{n=-N}^N\xi_nV_n,
 \qquad \xi_{-n}=\xi_n,                               \tag{3.1}
\]

and define

\[
 M_2=2\sum_{n=1}^N n^2|\xi_n|,
 \qquad S_4(N)=\sum_{n=1}^Nn^4.                       \tag{3.2}
\]

If `x_n=<e_n^+,x>`, then
`x_n=sqrt(2)c xi_n`, and hence

\[
 M_2={\sqrt2\over c}\sum_{n=1}^Nn^2|x_n|.             \tag{3.3}
\]

The endpoint bounds (2.3), normalization of `x`, and Cauchy--Schwarz give
the completely ground-free estimate

\[
 \boxed{
 M_2\leq
 {\sqrt{2(1-\gamma^2)S_4(N)}
  \over\gamma\sqrt{2N+1}}.}                         \tag{3.4}
\]

There is a sharper anchor-aware version.  For a unit even vector `w`, put

\[
 H_2(w)=\sum_{n=1}^Nn^2|w_n|.                         \tag{3.5}
\]

If `||x-w||<=delta_w`, then

\[
 \boxed{
 M_2\leq {\sqrt2\{H_2(w)+\sqrt{S_4(N)}\,\delta_w\}
                \over\gamma\sqrt{2N+1}}.}            \tag{3.6}
\]

Two bounds available from the same finite data are

\[
 \delta_\kappa=D(T)
 =\sqrt{2-{2\over\sqrt{1+T^2}}},
 \qquad
 \delta_z=2\sin(\overline\theta/2).                   \tag{3.7}
\]

Consequently define

\[
\begin{aligned}
 \overline M_2={\sqrt2\over\gamma\sqrt{2N+1}}
 \min\bigl\{&\sqrt{(1-\gamma^2)S_4(N)},\\
              &H_2(\kappa)+\sqrt{S_4(N)}D(T),\\
              &H_2(z)+2\sqrt{S_4(N)}
                         \sin(\overline\theta/2)\bigr\},\\
 R_N(\gamma)&=N^2+\overline M_2.                     \tag{3.8}
\end{aligned}
\]

Every term in (3.8) is known before an odd floor or the actual even ground
is computed.

**Proof of (3.4)--(3.6).**  Equation (2.3) gives
`c>=gamma*sqrt(2N+1)`.  Also

\[
 \sum_{n=1}^N|x_n|^2=1-x_0^2\leq1-\gamma^2.
\]

Insert weighted Cauchy--Schwarz into (3.3) to get (3.4).  For (3.6), use

\[
 \sum n^2|x_n|
 \leq H_2(w)+\sum n^2|x_n-w_n|
 \leq H_2(w)+\sqrt{S_4(N)}\|x-w\|.                 \tag{3.9}
\]

The even resolvent angle gives the first chord in (3.7), while the triangle
bound from Section 2 gives the second.  \(\square\)

The locked source commutator constructs the squared-mode pencil

\[
 X=D_-^2-|u\rangle\langle d|,                      \tag{3.10}
\]

and, once (2.2) proves the all-axis response sign, all eigenvalues of `X`
are positive.  The exact coefficient theorem then gives

\[
 \boxed{\lambda_{\max}(X)\leq N^2+M_2\leq R_N(\gamma).}
                                                               \tag{3.11}
\]

Thus the previously unknown boundary-normalized coefficient condition has
been reduced to explicit cone slack and reference-vector moments.  This is
an implication, not a claim that the resulting `R_N` is small enough on the
source schedule.

## 4. Shifted odd-reserve theorem

Let `g_e` be the gap from `epsilon` to the second even eigenvalue.  The
source factorization gives

\[
 \lambda_{\min}(Q_- -\epsilon I)
 \geq {g_e|x_0|^2\over\lambda_{\max}(X)}.           \tag{4.1}
\]

Interlacing and (1.5) imply `g_e>=g_+`.  Equations (2.3) and (3.11) therefore
give the fully explicit lower reserve

\[
 \boxed{
 \lambda_{\min}(Q_- -\epsilon I)
 \geq {g_+\gamma^2\over R_N(\gamma)}.}             \tag{4.2}
\]

The actual lowering from `U` to the unknown ground is controlled using only
the even block.  The scalar Schur function is

\[
 d_s=q-s-\langle b,(A-sI)^{-1}b\rangle.             \tag{4.3}
\]

It vanishes at `s=epsilon`, and

\[
 d_s'=-1-\|(A-sI)^{-1}b\|^2.
\]

Hence

\[
 \boxed{0\leq U-\epsilon\leq\chi_U=-d_U.}          \tag{4.4}
\]

### Theorem 4.1 (positive-cone shifted odd reserve)

Let `N>=1`.  Assume (1.3)--(1.8) for the complete source even block and
define `gamma` and `R_N(gamma)` by (1.9) and (3.8).  If

\[
 \boxed{
 \chi_U<{g_+\gamma^2\over R_N(\gamma)},}            \tag{4.5}
\]

then

\[
 \boxed{Q_- -UI\succ0.}                              \tag{4.6}
\]

**Proof.**  Lemma 2.1 proves strict all-axis response positivity for the
simple even ground, including both source nonvanishing conditions.  The
source squared-mode factorization therefore applies and yields (4.2).
Equations (4.4)--(4.5) give

\[
 U-\epsilon<\lambda_{\min}(Q_- -\epsilon I).
\]

Subtracting `(U-epsilon)I` proves (4.6).  \(\square\)

The theorem is noncircular: `T`, `g_+`, and `chi_U` are reconstructed from
the even complement, while `m`, `theta_0`, `H_2(kappa)`, and `H_2(z)` come
from explicit trial vectors.  The odd block appears only in the conclusion,
through the locked source commutator theorem.

There is a simpler universal, although weaker, version.  The closed power
sum gives

\[
 {\sqrt{2(1-\gamma^2)S_4(N)}
  \over\gamma\sqrt{2N+1}}
 ={1\over\gamma}
 \sqrt{{(1-\gamma^2)N(N+1)(3N^2+3N-1)\over15}}
 \leq {N^2\over\gamma}.                              \tag{4.7}
\]

Since `0<gamma<=1`, the universal choice in (3.8) obeys

\[
 R_N(\gamma)\leq N^2+{N^2\over\gamma}
 \leq {2N^2\over\gamma}.                             \tag{4.8}
\]

### Corollary 4.2 (cubic cone-slack gate)

Under the hypotheses of Theorem 4.1, the elementary condition

\[
 \boxed{2N^2\chi_U<g_+\gamma^3}                     \tag{4.9}
\]

implies `Q_- - U I` is positive definite.  The sharper reference-aware
radius in (3.8) should be used whenever available; (4.9) exposes the worst
universal rate in a single line.

## 5. Exact scope on an unbounded schedule

For the direct prolate--Weil bridge, Theorem 4.1 turns the shifted odd sign
into the following concrete source-specific asymptotic target.  On one
explicit schedule, prove from the complete pole--archimedean--minus-prime
matrix that

\[
 \overline\theta_\lambda<\arcsin m_\lambda,
 \qquad
 {\chi_{U,\lambda}\over g_{+,\lambda}}
 {R_{N(\lambda)}(\gamma_\lambda)\over\gamma_\lambda^2}<1.
                                                               \tag{5.1}
\]

This is stronger information than qualitative positivity of a Fejer or
Jackson trial state.  The known positive trials can have cone depth tending
rapidly to zero, and the current prolate estimates do not place the actual
even ground inside that shrinking cap.  The exact relative-orientation
countermodels in
`notes/UNBOUNDED_RELATIVE_ORIENTATION_INSTABILITY.md` also show that
absolute matrix, residual, or discrepancy decay cannot replace (5.1).
For the same projected-prolate anchor, Lemma 2.2 further makes the relative
endpoint condition

\[
 T_\lambda<
 {t_{\kappa,\lambda}\over
  \sqrt{1-t_{\kappa,\lambda}^2}}                    \tag{5.1a}
\]

necessary before (5.1) can pass.  An absolute estimate `T_lambda=o(1)` is
therefore insufficient when the normalized endpoint value tends to zero on
a faster scale.

Even if (5.1) is proved, equation (5.2) of `DIRECT_RH_ATTACK.md` still needs
the quantitative even correction.  In the notation above that remaining
term contains

\[
 \sqrt{\log\lambda}\,\lambda^\eta
 \|P_Nk_\lambda^+\|D(T),                            \tag{5.2}
\]

for every fixed `eta<1/2`, or one of the weaker projective graph criteria.
The cone gate only says that `T` is smaller than a geometric cap; it does
not give the polynomial or subpolynomial rate required in (5.2).

Thus the minimal genuinely new analytic input exposed by this transfer is
a **source-specific quantitative ground-cone theorem**: it must jointly
control the unused cone depth and the normalized even Schur surplus in
(5.1), while preserving the exact signed arithmetic cancellation.  A
separate vector-specific resolvent rate is still required for the locally
uniform limit.

## 6. Exact qualitative-reserve counterfamily

The need for quantitative slack already appears in the `N=1` exact Cauchy
displacement class.  This is a structural model, not the arithmetic Weil
matrix.  Fix `g>0` and

\[
 0<\phi<\arctan(1/\sqrt2),
 \qquad t={g\sin\phi\cos\phi\over\sqrt2},           \tag{6.1}
\]

and choose the source-Cauchy parameters

\[
 a_0=g\sin^2\phi,
 \qquad a_1=g\cos^2\phi-t,
 \qquad b_1=t,\quad b_0=0,\quad b_{-1}=-t.          \tag{6.2}
\]

Then

\[
 Q_+=g
 \begin{pmatrix}
  \sin^2\phi&\sin\phi\cos\phi\\
  \sin\phi\cos\phi&\cos^2\phi
 \end{pmatrix},
 \qquad Q_-=[a_1-t].                                \tag{6.3}
\]

The simple even ground and gap are

\[
 x=(\cos\phi,-\sin\phi),
 \qquad\epsilon=0,
 \qquad g_e=g.                                      \tag{6.4}
\]

For `N=1`, the normalized response decreases monotonically with
`w=alpha^2/(1+alpha^2)` from zero to one, so

\[
 m_{\mathcal C}(x)
 ={\cos\phi-\sqrt2\sin\phi\over\sqrt3}>0.           \tag{6.5}
\]

The odd reserve is exactly

\[
 \lambda_{\min}(Q_- -\epsilon I)
 =g\cos\phi(\cos\phi-\sqrt2\sin\phi).              \tag{6.6}
\]

In this family the coefficient/pencil estimate itself is exact.  With
`c=cos(phi)-sqrt(2)sin(phi)`,

\[
 M_2={\sqrt2\sin\phi\over c},\qquad
 \lambda_{\max}(X)=1+M_2={\cos\phi\over c},
 \qquad \lambda_{\min}(K)=g\cos^2\phi.              \tag{6.7}
\]

Thus `lambda_min(K)/lambda_max(X)` is precisely (6.6), rather than merely
a lower estimate.  The loss in the completely ground-free version comes
from replacing the exact coefficient data by cone depth and reference
chords, not from the source factorization.

As `phi` increases to `arctan(1/sqrt(2))`, the even gap stays equal to `g`
and the even ground remains strictly inside the response cone at every
finite member, but both (6.5) and (6.6) tend to zero.  Therefore qualitative
all-axis positivity plus a fixed even gap cannot support a uniform positive
Ritz shift.  The quantitative `gamma` and surplus comparison in (4.5) are
not removable by continuity.

This family preserves the exact source-Cauchy displacement and inversion
algebra, but its diagonal and off-diagonal values are synthetic.  It says
nothing about whether the exact prime locations and coefficients satisfy
(5.1).
