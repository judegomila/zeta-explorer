# Secant bulk as a positive source-determinant response

## 0. Scope and exact outcome

This note gives a cancellation-preserving reformulation of the deflated
bulk in `SECANT_SHORTED_RECIPROCAL_FESHBACH.md`.  It proves finite identities
and sharp finite inequalities.  It does not prove an actual-source
asymptotic estimate.  The later companion theorem
`RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md` supplies the precise Ritz-shift
ground transfer after an explicit ratio-dependent multiplier is retained.

Let `kappa` be the projected anchor, let
`q=<kappa,Q kappa>`, and choose a real certified shift `U<=q`.  On the
inversion-even projected-anchor complement let

\[
 B_U:=P_{\kappa^\perp}(Q_+-UI)P_{\kappa^\perp}
       \big|_{\mathcal K}\succ0,
 \qquad r>0,\qquad 0\preceq K_T\preceq I,
 \qquad \|\omega\|=1,                                \tag{0.1}
\]

and write `B=B_U` inside the shift-independent finite algebra below.  The
mandatory two-vector Ritz value from `DIRECT_RH_ATTACK.md` is an admissible
choice of `U`.  The specialization `U=q` is algebraically valid but is
asymptotically overstrong: `Q_SHIFT_SECTOR_WEIL_CORE_GATE.md` proves that,
on the admitted widening Weil core, the two complete `q`-shifted sector
signs together with the admitted decay of `|q|+r` already imply the global
Weil criterion.  Nothing below treats those `q`-shift signs as a preliminary
sub-RH input.

There is a second, independent scope distinction.  The determinant
identities below are exact for every `U<=q`.  The coefficient-one
residual-self-regularized theorem applies only at the Rayleigh shift `U=q`.
For the mandatory lower Ritz value `u`, or a certified shift
`u<=U<=q`, the Ritz secant moment gives instead

\[
 zz^*\preceq A_{\rm R}((q-U)/r)\,r(B_U+rI)^{-1}.    \tag{0.1a}
\]

Thus the full positive increment is a valid localized ground observable
after the factor `A_R` is retained.  An arbitrary lower shift not known to
satisfy `U>=u` remains diagnostic only.  The fixed-window observable does
not by itself prove the full `L2` equation (5.2) of
`DIRECT_RH_ATTACK.md`; Section 1.1 records the missing `q-U` term, the
coefficient-one regression, and the repaired statement.

Let `F=omega^perp`.  With `W` an isometry from `F` onto that
orthogonal complement, put

\[
 C=W^*BW,\qquad K_F=W^*K_TW.                         \tag{0.2}
\]

The deflated-bulk soft trace is

\[
 \mathcal H_{\rm bulk}
 =r\operatorname {tr}\{(C+rI)^{-1}K_F\}.            \tag{0.3}
\]

For any fixed `theta>0`, define the positive determinant increment

\[
 \boxed{
 \mathcal G_\theta
 =\log {\det(C+rI+\theta rK_F)\over\det(C+rI)}.}     \tag{0.4}
\]

The first main result is the sharp two-sided comparison

\[
 \boxed{
 {\mathcal G_\theta\over\theta}
 \leq \mathcal H_{\rm bulk}
 \leq {\mathcal G_\theta\over\log(1+\theta)}.}      \tag{0.5}
\]

Thus, for one fixed positive `theta`, the desired decay of the bulk is
equivalent to the same decay of one finite determinant increment.  No
derivative and no subtraction of separately bounded block norms is needed.

The harmonic graph term has a matching scalar increment.  If `delta_s` is
the Schur scalar of

\[
 B+rI+sK_T                                             \tag{0.6}
\]

along `omega`, set

\[
 \mathcal J_\theta=\log {\delta_{\theta r}\over\delta_0}. \tag{0.7}
\]

Then `J_theta>=0`, and if `H_graph` is the graph contribution from the
one-step Feshbach formula,

\[
 \boxed{
 {e^{\mathcal J_\theta}-1\over\theta}
 \leq\mathcal H_{\rm graph}
 \leq{(1+\theta)(1-e^{-\mathcal J_\theta})\over\theta}.}
                                                               \tag{0.8}
\]

Moreover, if

\[
 \mathcal F_\theta
 =\log{\det(B+rI+\theta rK_T)\over\det(B+rI)},        \tag{0.9}
\]

then exactly

\[
 \boxed{\mathcal F_\theta=\mathcal G_\theta+\mathcal J_\theta} \tag{0.10}
\]

and

\[
 {\mathcal F_\theta\over\theta}
 \leq\mathcal H_{\rm graph}+\mathcal H_{\rm bulk}
 \leq{\mathcal F_\theta\over\log(1+\theta)}.        \tag{0.11}
\]

For the exact time-band matrix, the homotopy `Q+sK_T` stays in the pinned
source-Cauchy displacement class.  At the ridge `z=U-r`, the determinant
factorization gives

\[
 \boxed{
 \mathcal G_\theta
 =\log{\det O_{\theta r}\over\det O_0}
 -\log{m_{\theta r}\sigma_{\theta r}\delta_{\theta r}
        \over m_0\sigma_0\delta_0}.}                 \tag{0.12}
\]

Here `O_s` is the odd shifted block, `m_s` is the source boundary Weyl
factor, `sigma_s` is the anchor Schur scalar, and `delta_s` is the secant
Schur scalar.  Under the sign hypotheses specified below, every argument of
every logarithm in (0.12) is positive.  The two terms on the right may be
large and of opposite sign; (0.12) is to be estimated as one combined
response.

For the finite deflated bulk itself, the equivalent decay condition is

\[
 \boxed{\mathcal G_{\theta,L,T}=o(L^{-3/2})}          \tag{0.13}
\]

for one fixed `theta>0` and every fixed transform window `[-T,T]`.  At
`U=q`, (0.13) participates in the coefficient-one self-regularized route,
conditional on the two complete `q`-shifted signs; those signs are already
RH-level on the widening core.  At a certified Ritz shift `u<=U<q`, the
full graph-plus-bulk response participates after multiplication by the
explicit `A_R((q-U)/r)` factor from (0.1a).  Current source estimates prove
neither the required weighted response decay nor the two signs.  A moment
cutoff below gives a sufficient condition for the finite bulk decay on an
`O(L)` physical range, but it does not prove the full response or equation
(5.2).

Every actual-source specialization uses the centered interval
`[-L/2,L/2]`, Lebesgue measure, zero extension, reflection as inversion,
and

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(x)e^{-itx}\,dx.     \tag{0.14}
\]

The complete pole, archimedean, and prime blocks are combined before an
inverse or determinant is formed.  Every prime power `1<n<=lambda^2` is
included and the prime block retains the minus sign from source equation
(3.19).  The anchor is source-normalized before its finite projection; it
is not produced by unit-normalizing `h_lambda`.  No list of zeta zeros and
no global Weil positivity are used.  This note proves neither shifted-sector
sign on an unbounded schedule, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform characteristic-function convergence,
nor the Riemann hypothesis.  The formal project state remains
`P0_INVALIDATED`.

## 1. Locked finite setting

Let `kappa` be the unit inversion-even projected source anchor and write

\[
 q=\langle\kappa,Q\kappa\rangle,\qquad
 b=P_{\mathcal K}(Q-qI)\kappa,\qquad
 r=\|b\|>0,                                          \tag{1.1}
\]

where

\[
 \mathcal K=H_+\cap\kappa^\perp.                    \tag{1.2}
\]

Fix a real `U<=q` and let

\[
 B=B_U=(Q_+-UI)|_{\mathcal K}.                       \tag{1.3}
\]

The off-diagonal vector in the anchor decomposition is still `b`, because a
scalar shift has no anchor-complement cross term.  Throughout Sections 1--5
assume `B_U>0`.  Compress the exact finite
time-band operator to `K` and continue to denote it by `K_T`.  Zero-extension
Plancherel gives

\[
 0\preceq K_T\preceq I.                              \tag{1.4}
\]

Choose the source-reconstructible unit secant `omega` from
`PROLATE_SECANT_RADICAL_BLOCK_REDUCTION.md`.  Let

\[
 \mathcal F=\mathcal K\cap\omega^\perp,
 \qquad W^*W=I_{\mathcal F},\qquad
 WW^*=I_{\mathcal K}-|\omega\rangle\langle\omega|.  \tag{1.5}
\]

Write

\[
 D=B+rI,\qquad D_F=C+rI,
 \qquad C=W^*BW,\qquad K_F=W^*K_TW.                  \tag{1.6}
\]

Both `D` and `D_F` are positive.  Relative to
`C omega direct-sum W F`, set

\[
 e_s=\langle\omega,(D+sK_T)\omega\rangle,
 \qquad g_s=W^*(D+sK_T)\omega,                      \tag{1.7}
\]

\[
 D_{F,s}=D_F+sK_F,
 \qquad
 \delta_s=e_s-g_s^*D_{F,s}^{-1}g_s.                 \tag{1.8}
\]

For every `s>=0`, positivity of `D+sK_T` gives

\[
 D_{F,s}\succ0,\qquad\delta_s>0,                    \tag{1.9}
\]

and block determinants give

\[
 \det(D+sK_T)=\det(D_{F,s})\delta_s.                \tag{1.10}
\]

At `s=0`, put

\[
 v_0=\omega-WD_F^{-1}g_0.                            \tag{1.11}
\]

The one-step Feshbach identity in the preceding note gives

\[
\begin{aligned}
 \mathcal H_{\rm full}
 &=r\operatorname {tr}(D^{-1}K_T)\\
 &=\underbrace{r{\langle v_0,K_Tv_0\rangle\over\delta_0}}
          _{\mathcal H_{\rm graph}}
  +\underbrace{r\operatorname {tr}(D_F^{-1}K_F)}
          _{\mathcal H_{\rm bulk}}.
                                                               \tag{1.12}
\end{aligned}
\]

All three quantities in (1.12) are nonnegative.  No absolute value has
been inserted into the source matrix.

If `r=0`, every soft trace in (1.12) is zero and the present reduction is
unnecessary.  A numerical residual merely consistent with zero is not the
exact `r=0` branch.

### 1.1 Ground-transfer scope: the missing Ritz displacement

Let

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus\mathcal K,                   \tag{1.13}
\]

so `B_U=A-UI`.  Suppose `U` is a certified variational upper bound for the
even ground value `mu`, as the mandatory Ritz value is, and put

\[
 d=q-U\geq0,\qquad h_U=U-\mu\geq0.                  \tag{1.14}
\]

The coefficient-normalized ground correction is

\[
 z_U=(A-\mu I)^{-1}b=(B_U+h_UI)^{-1}b.              \tag{1.15}
\]

Its first Feshbach equation is

\[
 \boxed{
 d+h_U
 =\langle b,(B_U+h_UI)^{-1}b\rangle.}              \tag{1.16}
\]

At the Rayleigh shift `U=q`, one has `d=0`, so (1.16) becomes the proved
self-consistent ridge identity

\[
 h_q=\langle b,(B_q+h_qI)^{-1}b\rangle.             \tag{1.17}
\]

That equality is the step which makes the automatic residual ridge
`sigma=r` control the ground correction in
`RAYLEIGH_SELF_REGULARIZED_OBSERVABLE.md`.  At `U<q`, the right side of
(1.16) is `d+h_U`, not `h_U`.  Cauchy--Schwarz in the ground metric gives
only

\[
 |\langle g,z_U\rangle|^2
 \leq(d+h_U)
       \langle g,(B_U+h_UI)^{-1}g\rangle,           \tag{1.18}
\]

and no coefficient-one theorem replaces the right side of (1.18) by

\[
 r\langle g,(B_U+rI)^{-1}g\rangle.                 \tag{1.19}
\]

Equation (1.19) is indeed false with coefficient one.  It is not the final
Ritz statement.  If `u` is the mandatory two-vector Ritz value and

\[
 u\leq U\leq q,
 \qquad d=q-U,
 \qquad w=b/r,                                      \tag{1.19a}
\]

then the Ritz characteristic polynomial gives

\[
 d\langle w,B_Uw\rangle\leq r^2.                  \tag{1.19b}
\]

`RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md` combines (1.16) and (1.19b) to
prove

\[
 \boxed{
 |\langle g,z_U\rangle|^2
 \leq A_{\rm R}(d/r)\,
       r\langle g,(B_U+rI)^{-1}g\rangle,}           \tag{1.19c}
\]

where

\[
 A_{\rm R}(x)=
 \begin{cases}
  1+x+\tfrac12x(1+x)^2,&0\leq x\leq1,\\
  1+x+2x^2,&x\geq1.
 \end{cases}                                       \tag{1.19d}
\]

Thus the traces and determinant increments in this note are valid
localized Ritz-ground observables after `A_R(d/r)` is retained.  For an
arbitrary `U` not known to lie above `u`, no finite ratio-only multiplier
exists.  Even at the mandatory Ritz shift, a fixed-window observable is not
the complete `L2` shifted solve in equation (5.2).

The failure of the universal substitution (1.19) occurs already in exact
dimension two.  Take

\[
 Q_+=\begin{pmatrix}1&2\\2&1\end{pmatrix},
 \qquad\kappa=e_1,
 \qquad Q_-=0.                                      \tag{1.20}
\]

Then `q=1`, `b=2`, `r=2`, and the complete two-vector Ritz value is the
actual even ground `U=mu=-1`.  Hence

\[
 d=2,\qquad B_U=2>0,\qquad Q_--U=1>0,
 \qquad h_U=0.                                      \tag{1.21}
\]

Equation (1.16) reads exactly

\[
 2={4\over2}=d+h_U,                                 \tag{1.22}
\]

whereas the false self-consistency equation would read `0=2`.  For the
unit observation on the one-dimensional complement,

\[
 |z_U|^2=1,
 \qquad
 r(B_U+r)^{-1}={1\over2}.                           \tag{1.23}
\]

Thus the proposed coefficient-one `U`-shift residual-ridge transfer would
assert the false inequality `1<=1/2`.  This is a finite algebraic
regression, not an arithmetic Weil counterexample.  It proves that the
extra `d=q-U` term cannot be discarded; it does not contradict (1.19c),
whose multiplier at `d/r=1` is `A_R(1)=4`.

## 2. Sharp positive determinant increment for the bulk

Define

\[
 X_F=rD_F^{-1/2}K_FD_F^{-1/2}.                       \tag{2.1}
\]

Since `0<=K_F<=I` and `D_F>=rI`, congruence gives

\[
 0\preceq X_F
 \preceq rD_F^{-1}
 \preceq I.                                          \tag{2.2}
\]

Consequently

\[
 \mathcal H_{\rm bulk}=\operatorname {tr}X_F,        \tag{2.3}
\]

and for every `theta>0`,

\[
 \mathcal G_\theta
 =\operatorname {tr}\log(I+\theta X_F).             \tag{2.4}
\]

### Theorem 2.1 (sharp bulk determinant comparison)

For every `theta>0`, equations (0.4)--(0.5) hold.  Equivalently,

\[
 \log(1+\theta)\mathcal H_{\rm bulk}
 \leq\mathcal G_\theta
 \leq\theta\mathcal H_{\rm bulk}.                  \tag{2.5}
\]

The constants are optimal for information consisting only of
`0<=X_F<=I`.

**Proof.**  For `0<=x<=1`, concavity of
`x -> log(1+theta*x)` and its chord between zero and one give

\[
 x\log(1+\theta)
 \leq\log(1+\theta x).                               \tag{2.6}
\]

The elementary bound `log(1+y)<=y` gives

\[
 \log(1+\theta x)\leq\theta x.                      \tag{2.7}
\]

Apply (2.6)--(2.7) to `X_F` by finite spectral calculus and take the
trace.  Equality at `x=1` shows optimality of the left constant, while the
ratio tends to `theta` as `x` decreases to zero, showing optimality of the
right constant. \(\square\)

For a fixed `theta`, (2.5) proves the equivalence

\[
 \boxed{
 \mathcal H_{\rm bulk}=o(a_L)
 \quad\Longleftrightarrow\quad
 \mathcal G_\theta=o(a_L)}                           \tag{2.8}
\]

for every positive comparison scale `a_L`.  In particular, (0.13) is
neither stronger nor weaker than the stated finite deflated-bulk trace
condition.  At a certified Ritz shift its ground-observable use requires
the factor `A_R((q-U)/r)` and the matching graph response; the unweighted
bulk equivalence alone is insufficient.

The positive homotopy is important.  A negative homotopy also yields a
determinant formula for sufficiently small size, but it needlessly risks
crossing an even Schur zero.  The addition `+theta*r*K_T` preserves all
positive blocks used below.

## 3. The matching harmonic graph increment

Put

\[
 X=rD^{-1/2}K_TD^{-1/2}.                              \tag{3.1}
\]

As in (2.2), `0<=X<=I`.  Define the unit vector

\[
 \phi={D^{-1/2}\omega\over
       \langle\omega,D^{-1}\omega\rangle^{1/2}}.    \tag{3.2}
\]

The inverse Schur formula gives

\[
 \delta_0^{-1}=\langle\omega,D^{-1}\omega\rangle.  \tag{3.3}
\]

Direct substitution in (1.12) then gives

\[
 \boxed{\mathcal H_{\rm graph}=\langle\phi,X\phi\rangle.} \tag{3.4}
\]

At `s=theta*r`, the same inverse Schur formula gives

\[
 {\delta_{\theta r}\over\delta_0}
 ={1\over
   \langle\phi,(I+\theta X)^{-1}\phi\rangle}.       \tag{3.5}
\]

Thus

\[
 \boxed{
 \mathcal J_\theta
 =-\log\langle\phi,(I+\theta X)^{-1}\phi\rangle
 \geq0.}                                             \tag{3.6}
\]

### Theorem 3.1 (graph determinant comparison)

For every `theta>0`, equation (0.8) holds.  In particular,

\[
 {\mathcal J_\theta\over\theta}
 \leq\mathcal H_{\rm graph}
 \leq{1+\theta\over\theta}\mathcal J_\theta.       \tag{3.7}
\]

**Proof.**  Let `mu` be the spectral probability measure of `X` at
`phi`, put `h=int x dmu(x)=H_graph`, and set

\[
 y=e^{-\mathcal J_\theta}
   =\int{d\mu(x)\over1+\theta x}.                    \tag{3.8}
\]

The function `x -> (1+theta*x)^(-1)` is convex, so Jensen's inequality
gives

\[
 y\geq{1\over1+\theta h}.                            \tag{3.9}
\]

This rearranges to the lower bound in (0.8).  The chord upper bound on
`[0,1]` is

\[
 {1\over1+\theta x}
 \leq1-{\theta\over1+\theta}x.                      \tag{3.10}
\]

After integration, (3.10) rearranges to the upper bound in (0.8).
Finally `e^J-1>=J` and `1-e^(-J)<=J` prove (3.7). \(\square\)

Taking determinants in (1.10) at `s=theta*r` and at zero proves (0.10).
Applying Theorem 2.1 directly to `X` proves (0.11).  Hence the Feshbach
sum has become a sum of two nonnegative determinant responses:

\[
 \mathcal H_{\rm bulk}\longleftrightarrow\mathcal G_\theta,
 \qquad
 \mathcal H_{\rm graph}\longleftrightarrow\mathcal J_\theta. \tag{3.11}
\]

This does not assert that either response is small on the arithmetic
schedule.

## 4. Exact source-Cauchy factorization

Return to the full finite source matrix.  Put

\[
 z=U-r,
 \qquad
 A_s=Q_+-zI+sK_+,
 \qquad
 O_s=Q_--zI+sK_-.                                   \tag{4.1}
\]

Here `K_+` and `K_-` are the parity restrictions of the exact time-band
matrix.  The time-band source-Cauchy identity proves that `Q+sK_T` has the
same rank-two displacement form for every real `s`.

Decompose the even space first as

\[
 H_+=\mathbb C\kappa\oplus\mathcal K.               \tag{4.2}
\]

The lower block of `A_s` is exactly

\[
 D_s=D+sK_T.                                         \tag{4.3}
\]

Write

\[
 a_s=\langle\kappa,A_s\kappa\rangle,
 \qquad b_s=P_{\mathcal K}A_s\kappa,                \tag{4.4}
\]

and define the anchor Schur scalar

\[
 \sigma_s=a_s-b_s^*D_s^{-1}b_s.                    \tag{4.5}
\]

Let `e_0=V_0`, let the source boundary row be
`delta(f)=<eta,f>`, and define

\[
 m_s=\delta A_s^{-1}e_0.                             \tag{4.6}
\]

The source parity determinant theorem and two ordinary Schur
factorizations give

\[
\boxed{
 \det O_s
 =\det A_s\,m_s
 =\det D_s\,\sigma_s m_s
 =\det D_{F,s}\,\delta_s\sigma_s m_s.}              \tag{4.7}
\]

Equivalently, if `Sigma_s` is the `2 by 2` Schur complement obtained by
eliminating `F` from `A_s`, with the remaining ordered span
`kappa,omega`, then

\[
 \det\Sigma_s=\sigma_s\delta_s.                     \tag{4.8}
\]

The product in (4.8) is independent of whether the anchor or the secant is
eliminated first, even though the two individual scalar Schur factors
depend on that order.

### 4.1 Exact positivity domain

The positivity of the logarithms in (0.12) uses two logically distinct
inputs.

First, `U<=q`, `B_U>0`, `r=||b||>0`, and `s>=0` imply positivity of every
even and secant factor.  Indeed,

\[
 \sigma_0
 =(q-U)+r-b^*(B_U+rI)^{-1}b>0,                    \tag{4.9}
\]

because `B_U+rI>rI` and therefore

\[
 b^*(B+rI)^{-1}b<{\|b\|^2\over r}=r.               \tag{4.10}
\]

The last term in (4.9) is strictly smaller than `r`, while `q-U>=0`.
Thus `A_0>0`.  Since `K_+>=0`, one has `A_s>0` for all `s>=0`.  It follows
that

\[
 D_s>0,\quad D_{F,s}>0,\quad\sigma_s>0,
 \quad\delta_s>0.                                   \tag{4.11}
\]

No odd-sector sign is used in (4.9)--(4.11).

Second, positivity of `O_s`, and hence the positive determinant
interpretation of the source boundary factor `m_s`, requires a separate
odd shifted sign.  The minimal premise for this note is

\[
 O_0=Q_--UI+rI>0.                                    \tag{4.12}
\]

The `U`-shifted odd-sector sign `Q_--UI>0` required by the direct bridge
implies (4.12).  Under (4.12), `O_s>0` for all
`s>=0`, and (4.7) gives

\[
 m_s={\det O_s\over\det A_s}>0.                     \tag{4.13}
\]

The even assumption `B_U>0` by itself does not determine the sign of the
odd determinant or of `m_s`; (4.12) must not be silently omitted.

### 4.2 The combined positive response

Take `s=theta*r` in (4.7), divide by the identity at zero, and take real
logarithms.  This proves

\[
\boxed{
 \mathcal F_\theta
 =\log{\det O_{\theta r}\over\det O_0}
 -\log{m_{\theta r}\sigma_{\theta r}
        \over m_0\sigma_0},}                        \tag{4.14}
\]

and

\[
\boxed{
 \mathcal G_\theta
 =\log{\det O_{\theta r}\over\det O_0}
 -\log{m_{\theta r}\sigma_{\theta r}\delta_{\theta r}
        \over m_0\sigma_0\delta_0}.}               \tag{4.15}
\]

Equation (4.15) is (0.12).  It is the finite-increment counterpart of the
differentiated identity in `TIME_BAND_CAUCHY_DETERMINANT_RESPONSE.md`.
Indeed, differentiation at `s=0` gives

\[
\begin{aligned}
 \mathcal H_{\rm bulk}
 =r\biggl[
 &\operatorname {tr}(O_0^{-1}K_-)
 -\left.\partial_s\log
       (m_s\sigma_s\delta_s)\right|_{s=0}
 \biggr].                                           \tag{4.16}
\end{aligned}
\]

Likewise

\[
 \mathcal H_{\rm graph}
 =r\left.\partial_s\log\delta_s\right|_{s=0}.      \tag{4.17}
\]

At the existing pilot, the separate odd, anchor, and boundary responses
are much larger than their combined soft trace.  Equations (4.14)--(4.16)
do not license bounding their magnitudes separately.  The positive scalar
`G_theta` is the cancellation-preserving object.

Although (4.15) is a determinant identity, its decay is not locally
uniform convergence of the normalized characteristic functions in
`DIRECT_RH_ATTACK.md`.  Substituting finite real-axis determinant agreement
for that final complex-analytic requirement would be invalid.

## 5. Deflated physical-moment localization

The determinant response has a second exact localization.  Regard
`F` as an even finite-dimensional subspace of
`L^2([-L/2,L/2])`.  For an integer `m>=1`, set

\[
 u_j=P_{\mathcal F}(x^{2j}),\quad0\leq j<m,
 \qquad
 V_m=\operatorname {span}\{u_0,\ldots,u_{m-1}\},    \tag{5.1}
\]

and let `P_m` be the orthogonal projection onto `V_m`, with
`H_m=I-P_m`.  The Taylor/Bessel proof is unchanged by both anchor and
secant deflation, because every `h in H_m F` has its first `m` even
physical moments equal to zero.  Hence

\[
 \boxed{
 \operatorname {tr}(H_mK_FH_m)
 \leq\tau_m(L,T)
 :={LT\over\pi}
 { (LT/2)^{4m}
  \over (4m+1)^2\{(2m)!\}^2}.}                      \tag{5.2}
\]

Let `W_m` be any isometry onto the nonzero range `V_m` and define

\[
 K_m=W_m^*K_FW_m,
 \qquad
 R_m=W_m^*D_F^{-1}W_m.                               \tag{5.3}
\]

The covariance-preserving Hilbert--Schmidt splice gives

\[
 \boxed{
 \sqrt{\mathcal H_{\rm bulk}}
 \leq
 \sqrt{r\operatorname {tr}(K_mR_m)}
 +\sqrt{\tau_m(L,T)}.}                              \tag{5.4}
\]

For `m=ceil(LT)`, the second term is smaller than every fixed inverse
power of `L`.  Therefore the source-specific estimate

\[
 \boxed{
 r\operatorname {tr}(K_mR_m)=o(L^{-3/2})}           \tag{5.5}
\]

is sufficient for (0.13).  This is an `O(L)`-dimensional response, but it
still uses the compression of the complete inverse; replacing it by the
inverse of `P_mD_FP_m` would drop the low--high Schur feedback.

One may also serialize the positive matrix

\[
 Y_m=rR_m^{1/2}K_mR_m^{1/2}.                         \tag{5.6}
\]

Since `R_m<=r^(-1)I` and `K_m<=I`, one has `0<=Y_m<=I`.  Thus its positive
determinant increment obeys the same sharp inequalities:

\[
 {1\over\theta}\log\det(I+\theta Y_m)
 \leq r\operatorname {tr}(K_mR_m)
 \leq{1\over\log(1+\theta)}\log\det(I+\theta Y_m). \tag{5.7}
\]

Equation (5.7) is a useful independent finite replay.  Unlike (4.15), the
small moment determinant does not itself retain the global source-Cauchy
factorization; both paths should be checked rather than conflated.

## 6. What current source input does and does not prove

The present reduction removes two avoidable losses.

1. It replaces a derivative of several huge signed responses by a positive
   finite increment equivalent to the desired bulk.
2. It replaces a worst complementary floor by a covariance-weighted
   determinant response and, if desired, localizes it to `O(L)` physical
   moments.

It does not supply the arithmetic estimate in (0.13) or (5.5).  Let `M`
denote the source integer mode operator, put `T=M|_(mathcal K)` and
`d_M=M kappa`.
The exact rank-three deflated displacement

\[
 (TW)(C+rI)-(Q_--UI+rI)(TW)
 =|\boldsymbol\beta\rangle\langle W^*\eta_{\mathcal K}|
 -|d_M\rangle\langle W^*b|
 -|T\omega\rangle\langle g|                        \tag{6.1}
\]

does not bound the `N-1` dimensional inverse in (0.3).  In spectral
coordinates its solution still divides by all cross-parity differences.

The source-Cauchy/time-band family in Section 6 of
`SECANT_SHORTED_RECIPROCAL_FESHBACH.md` has a decoupled secant and an
`Omega(L)` reserve.  Choosing its residual ratio at the stated `L^(-2)`
scale makes the `L^(3/2)`-scaled soft bulk diverge.  By Theorem 2.1, its
`G_theta` has the same failure.  That family uses synthetic diagonal and
displacement coefficients; it is not the pinned pole--archimedean--prime
matrix and therefore proves only that Cauchy displacement, strict signs,
and a small one-vector residual do not imply (0.13).

At `U=q`, proving both complete sector signs for the actual source on the
admitted widening core is itself an RH-level task by
`Q_SHIFT_SECTOR_WEIL_CORE_GATE.md`.  At a genuine Ritz shift `U<q`, the
determinant response is a legitimate localized ground-transfer criterion
when `u<=U` and the factor `A_R((q-U)/r)` is retained.  This avoids assuming
the complete `q`-shift signs, but it does not supply either `U`-shifted sign
or the arithmetic response decay.  The present identities therefore evade
neither the signed source estimate nor the weighted determinant-response
obligation.

The fixed-window moment theorem proves the high covariance tail in (5.2).
It does not control the low response (5.5).  The source determinant theorem
proves (4.15), but a determinant factorization does not bound either of its
two cancelling logarithmic increments.  At `u<=U<q`, a bound for their
combination now controls the correction through (1.19c), but only after the
possibly growing `A_R((q-U)/r)` factor.  A new arithmetic estimate for that
weighted combined response is still necessary.

## 7. Finite diagnostic and honest bridge frontier

For any declared finite shift `U<=q`, including the mandatory Ritz value,
the identities in this note allow one to test the bulk diagnostic

\[
 \mathcal G_{\theta,L,T}=o(L^{-3/2})                 \tag{7.1}
\]

through the sufficient moment condition

\[
 r\operatorname {tr}(K_mR_m)=o(L^{-3/2}),
 \qquad m=\lceil LT\rceil.                           \tag{7.2}
\]

Together with the already proved moment tail, (7.2) implies (7.1).  By
Theorem 2.1, (7.1) is exactly the finite deflated-bulk trace decay, while
the graph trace is independently equivalent to decay of `J_theta` by
Theorem 3.1.

The bridge interpretation is shift-dependent.

* At `U=q`, decay of the full residual-ridged trace is sufficient for the
  proved self-regularized observable theorem, but establishing both complete
  `q`-shifted sector signs on the widening source core is already an RH-level
  arithmetic theorem.
* At a mandatory or certified Ritz shift `u<=U<q`, equations
  (7.1)--(7.2) and decay of `J_theta` control the localized ground
  observable after multiplication by `A_R((q-U)/r)`.  The factor is part of
  the rate and may not be discarded.
* At an arbitrary lower shift not certified to satisfy `U>=u`, the same
  quantities remain diagnostics only.

The honest remaining direct-bridge obligation at a Ritz shift is therefore
to prove the two strict `U`-shifted sector comparisons and the
`A_R((q-U)/r)`-weighted combined response decay on the same unbounded
schedule.  That localized route still needs the declared high-mode and
locally uniform passage.  The stronger full-`L2` equation (5.2) can instead
be targeted by taking `K=I` in the companion theorem; no such source trace
estimate is currently proved.

A finite source diagnostic should reconstruct at doubled precision and by
independent assembly paths

* `F_theta`, `G_theta`, and `J_theta`, checking `F_theta=G_theta+J_theta`;
* the direct graph and bulk traces and all sharp inequalities above;
* `det O_s`, `m_s`, `sigma_s`, and `delta_s` at `s=0` and
  `s=theta*r`, keeping (4.15) combined;
* the moment matrices `K_m`, `R_m`, and `Y_m`; and
* every source normalization, prime-power endpoint, precision, and hash.

The verifier must rebuild the matrix, state, time-band homotopy, and
determinants from source parameters.  Cached eigensystems, producer
booleans, or a list of zeta zeros are not valid inputs.  Finite values do
not prove the weighted unbounded rate.  Completion still requires that
rate, both sector signs, and either the full equation (5.2) route or all
parts of the weaker locally uniform determinant route and its locally
uniform determinant limit.
