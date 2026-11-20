# Annular gray mass and the hard-cut exterior obstruction

## 0. Status and claim boundary

This note isolates an obstruction in the exterior soft-symbol route of the
direct Xi--prolate--Weil program.  It proves the following statements on any
unbounded schedule on which the already locked source shift satisfies
`U_lambda=o(log lambda)`.

1. On every fixed rescaled annulus strictly between the central cutoff and
   `pi/2`, the complete combined defect has height of order `lambda`.
2. In both inversion parities, the mandatory gray term in the exact soft-
   symbol transition identity has unnormalized size at least a positive
   constant times `lambda`.  This remains true for every admissible cap used
   to normalize the soft symbol.
3. Consequently, the trace version of the component-free one-projector
   theorem cannot reach an `O(log lambda)` exterior budget.  Its operator-
   norm version requires at least `Omega(lambda/log lambda)` top soft
   directions.  On the Mellin cutoff `N_star=O((log lambda)^2)`, this fills
   the target space and reduces the theorem to an exact coframe assertion.
4. A fixed annular concentration projector gives the necessary physical
   angle scale `O(sqrt(log lambda/lambda))`.
5. If, and only if, the exterior symbol includes the sharp cutoff
   `1_{|t|>delta/L}`, its two inversion-reflected boundary jumps force both
   the full-interval hard-layer average and the checkpoint BV majorant to be
   `Omega(lambda)`.
6. The distinguished source-normalized Xi comparison anchor does not capture
   the annular outlier by itself.

These are obstruction and necessity statements.  They do not prove that the
actual multi-column arithmetic--prolate range misses the annular spectral
space.  A new physical-alignment theorem or a full coframe theorem could
still capture it.  This note proves no signed sector floor, no residual
estimate in equation (5.2) of `DIRECT_RH_ATTACK.md`, no locally uniform
determinant convergence, and no Riemann-hypothesis conclusion.  The formal
repository state remains `P0_INVALIDATED`.

No new external source is used.  The prime number theorem input is the one
already pinned through `P3_SOURCE_LOCK.json` and the vendored Fiori--Kadiri--
Swidinsky source.  Every prime power at the inclusive endpoint
`n<=lambda^2` is retained.

## 1. Locked conventions and the two different symbols

Put

\[
 L=2\log\lambda,\qquad
 I_\lambda=[-L/2,L/2],\qquad \lambda>1.                 \tag{1.1}
\]

The physical interval carries Lebesgue measure.  Every physical function is
extended by zero, and

\[
 \widehat f(t)=\int_{\mathbb R}f(s)e^{-its}\,ds,
 \qquad d\nu(t)={dt\over2\pi}.                          \tag{1.2}
\]

Inversion is physical reflection,

\[
 (Jf)(s)=f(-s).                                         \tag{1.3}
\]

The complete multiplier is

\[
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),               \tag{1.4}
\]

\[
 S_\lambda(t)=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                 \tag{1.5}
\]

Thus the source minus sign on the prime block is preserved in (1.4), and
the endpoint `n=lambda^2` is included whenever it is a prime power.

Fix constants

\[
 0\leq\mu<\nu,
 \qquad 0<\delta<{\pi\over2},                           \tag{1.6}
\]

and retain the source-reconstructed shift

\[
 U_\lambda=o(L).                                        \tag{1.7}
\]

The source-normalized fixed-`a_4` state is not replaced by a unit-normalized
state.  In particular, (1.7) is the shift statement proved with the locked
source normalization; it is not recomputed after changing that
normalization.

More explicitly, the source interval is `[-lambda,lambda]` with Lebesgue
measure and zero extension, and

\[
 h_\lambda=a_4h_{4,\lambda}-a_{0,\lambda}h_{0,\lambda},
 \qquad
 a_{0,\lambda}
 =a_4{\int h_{4,\lambda}\over\int h_{0,\lambda}}.       \tag{1.7a}
\]

This has zero Lebesgue integral.  The coefficient `a_4` is fixed by the
source limit.  No `L^2` unit normalization is inserted.

There are two distinct nonnegative symbols which must not be denoted by the
same unqualified letter:

\[
 d_\lambda^{\rm all}(t)
   =[U_\lambda+\nu L-m_\lambda(t)]_+,                  \tag{1.8}
\]

and

\[
 d_\lambda^{\rm ext}(t)
   ={\bf1}_{\{|t|>\delta/L\}}
       d_\lambda^{\rm all}(t).                         \tag{1.9}
\]

The first is the uncut complete defect.  The second is the sharply cut
exterior defect inherited from the earlier central/exterior decomposition.
They agree on every annulus used below but have different BV behavior at
`|t|=delta/L`.

Both symbols are even.  Hence their time-limited multiplier compressions
commute with `J` and split into the two inversion sectors.  Replacing an
inversion sector by positive frequencies would discard one of the two
annular components and is not allowed.

For `bullet` equal to `all` or `ext`, let

\[
 A_\lambda\geq
 \|d_\lambda^{\rm bullet}\|_{L^\infty(\mathbb R)}
                                                                  \tag{1.10}
\]

be any finite positive cap and put

\[
 a_\lambda(t)={d_\lambda^{\rm bullet}(t)\over A_\lambda}.
                                                                  \tag{1.11}
\]

The arguments below do not improve by choosing a larger cap.

For any finite physical target `X` and nonnegative scalar symbol `g`, write

\[
 T_g^{(X)}
 =P_X\mathcal F^{-1}M_g\mathcal F P_X|_X.              \tag{1.11a}
\]

When the target is clear, the superscript is suppressed.

### 1.1 Exact hard-cut convention

For the hard exterior symbol (1.9), the frequency cutoff is open.  Replacing
`>` by `>=` changes neither the multiplier nor any concentration compression,
because the two endpoints have measure zero.  It also does not remove the
distributional BV jumps: those use the one-sided traces of the equivalence
class.

For a height `s>0`, the hard layer is always

\[
 \Omega_s=\{t:d_\lambda^{\rm bullet}(t)>s\}.            \tag{1.12}
\]

Thus the height threshold is open.  Later, the upper effective spectral
projector uses `(sigma,1]`, while a converse or necessary-angle projector
uses `[sigma,1]`.  These endpoints play different roles and are not
interchanged.

## 2. Uniform PNT asymptotic on a rescaled annulus

The elementary asymptotic needed below is stronger than merely evaluating
the prime polynomial at zero, so its derivation is included.

Put

\[
 x=\lambda^2,\qquad L=\log x,\qquad
 \psi_C(y)=\sum_{n\leq y}\Lambda(n).                   \tag{2.1}
\]

The pinned prime number theorem gives

\[
 \psi_C(y)=y+E(y),\qquad E(y)=o(y).                    \tag{2.2}
\]

For real `z`, define the complete complex prime-power sum

\[
 \mathcal S_\lambda(z)
 =\sum_{1<n\leq x}\Lambda(n)n^{-1/2+iz/L}.             \tag{2.3}
\]

### Lemma 2.1 (uniform compact rescaling)

For every fixed `Z>0`, uniformly on `|z|<=Z`,

\[
 \boxed{
 \mathcal S_\lambda(z)=2\lambda e^{iz}+o(\lambda).}    \tag{2.4}
\]

Consequently,

\[
 \boxed{
 S_\lambda(z/L)=2\lambda\cos z+o(\lambda)}            \tag{2.5}
\]

uniformly on compact `z`-intervals, and

\[
 \boxed{
 \Sigma_\lambda:=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
 =2\lambda+o(\lambda).}                                \tag{2.6}
\]

**Proof.**  Write `tau=z/L`.  Stieltjes summation and (2.2) give

\[
 \mathcal S_\lambda(z)
 =\int_{1^-}^{x}y^{-1/2+i\tau}\,dy
  +\int_{1^-}^{x}y^{-1/2+i\tau}\,dE(y).                \tag{2.7}
\]

The first integral is

\[
 {x^{1/2+i\tau}-1\over1/2+i\tau}
 =2\lambda e^{iz}+o(\lambda)                           \tag{2.8}
\]

uniformly for `|z|<=Z`, because `tau=O_Z(L^{-1})` and
`x^{i tau}=e^{iz}`.

For the error term, Stieltjes integration by parts gives, up to a fixed
lower-endpoint constant,

\[
 x^{-1/2+i\tau}E(x)
 -(-1/2+i\tau)
   \int_1^x E(y)y^{-3/2+i\tau}\,dy.                    \tag{2.9}
\]

Given `epsilon>0`, choose `Y` so that `|E(y)|<=epsilon y` for `y>=Y`.
The part below `Y` is fixed, the endpoint in (2.9) is
`O(epsilon sqrt(x))`, and the part of the integral above `Y` is bounded by

\[
 C_Z\epsilon\int_Y^x y^{-1/2}\,dy
 =O_Z(\epsilon\sqrt x).                                \tag{2.10}
\]

This proves that the error in (2.7) is `o(sqrt(x))`, uniformly on the
declared compact set.  Taking real parts proves (2.5), and `z=0` proves
(2.6).  `square`

The archimedean term has no `lambda`-scale contribution on these compact
rescalings.  Indeed,

\[
 2\theta'(z/L)
 =\operatorname {Re}\psi\!\left({1\over4}+{iz\over2L}\right)
  -\log\pi
 =O_Z(1).                                               \tag{2.11}
\]

### Corollary 2.2 (annular defect profile)

For every compact subinterval of `(-pi/2,pi/2)`,

\[
 \boxed{
 d_\lambda^{\rm all}(z/L)
 =4\lambda\cos z+o(\lambda)}                          \tag{2.12}
\]

uniformly there.  For the hard exterior symbol, the same formula holds
uniformly on compact sets satisfying `|z|>delta`, while
`d_lambda^ext(z/L)=0` for `|z|<delta`.

**Proof.**  Equations (1.4), (1.8), (1.7), (2.5), and (2.11) give

\[
 U_\lambda+\nu L-m_\lambda(z/L)
 =4\lambda\cos z+o(\lambda).                           \tag{2.13}
\]

The right side is uniformly positive on a compact subinterval of
`(-pi/2,pi/2)`, so the positive part does not change it for all sufficiently
large `lambda`.  Equation (1.9) gives the last assertion.  `square`

This proof uses the complete combined prime sum before any absolute-value
majorant.  It neither separates individual prime powers nor changes the
prime-block sign.

## 3. Explicit parity tests and annular concentration

Define the normalized parity tests

\[
 q_{+,L}(s)=L^{-1/2},\qquad
 q_{-,L}(s)=\sqrt{2/L}\sin(2\pi s/L),
 \qquad s\in I_\lambda.                                \tag{3.1}
\]

They have inversion parities `+1` and `-1`, respectively.  For `N>=1`,
they belong to the corresponding centered Fourier sectors.

With `z=Lt`, direct scaling gives

\[
 \widehat q_{\epsilon,L}(z/L)=\sqrt L\,F_\epsilon(z), \tag{3.2}
\]

where

\[
 F_+(z)={2\sin(z/2)\over z},                            \tag{3.3}
\]

and

\[
 F_-(z)={4\sqrt2\,\pi i\sin(z/2)\over z^2-4\pi^2}.   \tag{3.4}
\]

All removable values are taken by continuity.  Neither factor vanishes on
an interval `0<a<b<pi/2`.

Fix henceforth

\[
 \delta<a<b<{\pi\over2}                                \tag{3.5}
\]

and put

\[
 \mathcal A_{a,b}(\lambda)
 =\{t:a<|Lt|<b\}.                                      \tag{3.6}
\]

The exact annular masses

\[
 \boxed{
 \beta_\epsilon(a,b)
 ={1\over2\pi}\int_{a<|z|<b}|F_\epsilon(z)|^2\,dz>0} \tag{3.7}
\]

satisfy

\[
 \int_{\mathcal A_{a,b}(\lambda)}
 |\widehat q_{\epsilon,L}(t)|^2\,d\nu(t)
 =\beta_\epsilon(a,b).                                 \tag{3.8}
\]

Thus the annular concentration does not vanish as the physical interval
grows: the frequency width `O(L^{-1})` is exactly offset by the `L` in the
squared Fourier transform.

Let `X_lambda` be either relevant parity target, and suppose it contains
the corresponding unit test `q_{epsilon,L}`.  Its frequency reproducing
kernel obeys

\[
 R_{X_\lambda}(t,t)
 \geq|\widehat q_{\epsilon,L}(t)|^2.                   \tag{3.9}
\]

The even anchor-deflated target is handled in Section 8; the same lower
mass survives there.

## 4. The mandatory gray mass is of order `lambda`

For concision, define

\[
 c_{\rm cap}^{\rm all}=1,
 \qquad c_{\rm cap}^{\rm ext}=\cos\delta.              \tag{4.1}
\]

Corollary 2.2 and the definition of essential supremum imply

\[
 A_\lambda\geq
 4\lambda c_{\rm cap}^{\rm bullet}+o(\lambda).         \tag{4.2}
\]

For the uncut symbol, use `z=0`.  For the hard exterior symbol, first use
any fixed `z=delta+eta` and then let `eta` decrease to zero.  The endpoint
itself is irrelevant to the essential supremum.

Set

\[
 \rho_{\rm all}=\cos a,
 \qquad
 \rho_{\rm ext}={\cos a\over\cos\delta},               \tag{4.3}
\]

so in both cases

\[
 0<\rho_{\rm bullet}<1.                                 \tag{4.4}
\]

On the annulus (3.6), Corollary 2.2 gives, uniformly,

\[
 d_\lambda^{\rm bullet}(t)
 \geq2\lambda\cos b                                   \tag{4.5}
\]

and

\[
 {d_\lambda^{\rm bullet}(t)\over A_\lambda}
 \leq{1+\rho_{\rm bullet}\over2}                      \tag{4.6}
\]

for all sufficiently large `lambda`.  The deliberately weakened factors in
(4.5)--(4.6) give the following displayed positive asymptotic constant:

\[
 c_{\epsilon}^{\rm bullet}(\delta,a,b)
 =\cos b\,(1-\rho_{\rm bullet})
       \beta_\epsilon(a,b)>0.                           \tag{4.7}
\]

### Theorem 4.1 (annular gray-mass lower bound)

Let

\[
 C_{X_\lambda}
 =P_{X_\lambda}\mathcal F^{-1}M_{a_\lambda}
       \mathcal F P_{X_\lambda}|_{X_\lambda},         \tag{4.8}
\]

and

\[
 \chi_{X_\lambda}
 =\operatorname {tr}(C_{X_\lambda}-C_{X_\lambda}^2).
                                                                  \tag{4.9}
\]

For either inversion parity and either symbol in (1.8)--(1.9),

\[
 \boxed{
 A_\lambda\chi_{X_\lambda}
 \geq c_{\epsilon}^{\rm bullet}(\delta,a,b)\lambda}   \tag{4.10}
\]

for all sufficiently large `lambda`.

The qualitative PNT derivation does not supply an effective starting value
of `lambda`.  The finite lower enclosure used later is (6.11).

**Proof.**  The exact soft-symbol identity gives

\[
\begin{aligned}
 A_\lambda\chi_{X_\lambda}
 &=\int d_\lambda^{\rm bullet}(t)
       \left(1-{d_\lambda^{\rm bullet}(t)\over A_\lambda}\right)
       R_{X_\lambda}(t,t)\,d\nu(t)\\
 &\quad+{1\over2A_\lambda}\iint
       |d_\lambda^{\rm bullet}(t)
         -d_\lambda^{\rm bullet}(u)|^2
       |R_{X_\lambda}(t,u)|^2\,d\nu(t)d\nu(u).
                                                               \tag{4.11}
\end{aligned}
\]

The double integral is nonnegative.  Restrict the first integral to
`mathcal A_{a,b}(lambda)`, use (3.9), (4.5), and (4.6), and then apply
(3.8).  This gives

\[
 A_\lambda\chi_{X_\lambda}
 \geq
 2\lambda\cos b\,{1-\rho_{\rm bullet}\over2}
 \beta_\epsilon(a,b),                                  \tag{4.12}
\]

which is (4.10).  `square`

The first term in (4.11) is the gray term.  It alone proves (4.10).
Discarding it and retaining only hard-layer variation loses the obstruction.
The conclusion is also cap-stable: increasing `A_lambda` decreases
`a_lambda` but cannot remove the unnormalized product
`d_lambda(1-d_lambda/A_lambda)` on the annulus.

## 5. Consequences for the one-projector theorem

Let the eigenvalues of `C_(X_lambda)` be

\[
 1\geq\gamma_1\geq\cdots\geq\gamma_d\geq0,
 \qquad d=\dim X_\lambda,                              \tag{5.1}
\]

and put

\[
 p_X=\operatorname {tr}C_{X_\lambda}.                  \tag{5.2}
\]

For `0<sigma<1`, the component-free theorem declares

\[
 k=\min\left\{d,
 \left\lfloor p_X+{\chi_{X_\lambda}\over\sigma}
                                      \right\rfloor\right\}.
                                                                  \tag{5.3}
\]

Let `B_lambda>0` be the exterior operator budget.  In the direct comparison
it is at most a fixed multiple of `L`; for example the whole undepleted
budget is `(nu-mu)L`.

### Corollary 5.1 (trace route obstruction)

The trace conclusion of the one-projector theorem has right side

\[
 A_\lambda\left{{\chi_{X_\lambda}\over1-\sigma}
                  +\mathfrak a^2\right\}.             \tag{5.4}
\]

For every `0<sigma<1` and every physical angle `mathfrak a`, this displayed
right side is at least

\[
 c_{\epsilon}^{\rm bullet}(\delta,a,b)\lambda.         \tag{5.5}
\]

Hence (5.4) cannot certify an `O(L)` trace budget, even if the declared top
projector is captured exactly.

This is a failure of this sufficient trace majorant, not a lower bound for
the actual trace on an arbitrarily well-aligned physical complement.

### Corollary 5.2 (operator route dimension cost)

The operator conclusion requires

\[
 \sigma<{B_\lambda\over A_\lambda}.                    \tag{5.6}
\]

Whenever (5.6) holds, Theorem 4.1 gives

\[
 {\chi_{X_\lambda}\over\sigma}
 ={A_\lambda\chi_{X_\lambda}\over A_\lambda\sigma}
 >{c_{\epsilon}^{\rm bullet}(\delta,a,b)\lambda
       \over B_\lambda}.                               \tag{5.7}
\]

Therefore

\[
 \boxed{
 k\geq\min\left\{d,
 \left\lfloor{c_{\epsilon}^{\rm bullet}(\delta,a,b)
                         \lambda\over B_\lambda}
 \right\rfloor\right\}.}                              \tag{5.8}
\]

For `B_lambda=O(L)`, the required top-projector dimension is at least
`min(d,Omega(lambda/L))`.

On the Mellin projection schedule

\[
 N_\star(\lambda)
 =\left\lceil{L^2+26L\over2\pi^2}\right\rceil,        \tag{5.9}
\]

each parity target has dimension `d=O(L^2)`.  Since

\[
 L^2=o(\lambda/L),                                     \tag{5.10}
\]

equation (5.8) gives `k=d` eventually.  The hypothesis
`dim(K)>=k` in the one-projector theorem then forces `K=X_lambda` and the
high complement is zero.  Thus, on (5.9), the theorem has reduced the
exterior problem to an exact full-row coframe assertion; it does not supply
a nontrivial exterior-angle estimate.

On a matched schedule `N` of order `lambda^2`, the dimension cap does not
activate, but at least `Omega(lambda/L)` top soft directions still require a
physical alignment theorem.

## 6. A closed-projector angle is necessary

The preceding cost came from the soft transition trace.  A direct annular
necessity statement avoids the normalization cap entirely.

Fix

\[
 \delta<b_0<{\pi\over2}                                \tag{6.1}
\]

and let

\[
 \mathcal A_{\delta,b_0}(\lambda)
 =\{t:\delta<|Lt|<b_0\}.                               \tag{6.2}
\]

Let

\[
 C_{\rm ann}
 =P_{X_\lambda}\mathcal F^{-1}
       M_{{\bf1}_{\mathcal A_{\delta,b_0}(\lambda)}}
       \mathcal F P_{X_\lambda}|_{X_\lambda}.         \tag{6.3}
\]

For the parity test in (3.1), set

\[
 \beta_{\epsilon,0}
 ={1\over2\pi}\int_{\delta<|z|<b_0}
        |F_\epsilon(z)|^2\,dz>0.                       \tag{6.4}
\]

Then

\[
 \lambda_{\max}(C_{\rm ann})\geq\beta_{\epsilon,0}.  \tag{6.5}
\]

Choose the strict lower threshold

\[
 \sigma_0={\beta_{\epsilon,0}\over2},                 \tag{6.6}
\]

and define the **closed** spectral projector

\[
 F_{\sigma_0}={\bf1}_{[\sigma_0,1]}(C_{\rm ann}).     \tag{6.7}
\]

It is nonzero by (6.5).  The closed endpoint is the correct one for a lower
converse.  The upper effective-tail projector remains
`1_((sigma_0,1])(C_ann)`; an eigenvalue at the threshold belongs to the low
part of that upper split.

For an explicit finite annular defect height, retain the pinned constants

\[
 \varepsilon_L
 =9.22022L^{3/2}e^{-0.8476836\sqrt L},                  \tag{6.8}
\]

\[
 C_\theta(L,b_0)
 =\psi(1/4)-\log\pi
  +{b_0^2\zeta(3,1/4)\over4L^2}.                       \tag{6.9}
\]

If

\[
 U_\lambda+\nu L\geq-C_B L                            \tag{6.10}
\]

for a fixed `C_B`, define

\[
 \boxed{
 V_\lambda(b_0)
 =\left[2\cos b_0(1-\varepsilon_L)\lambda
        -C_B L-C_\theta(L,b_0)\right]_+.}              \tag{6.11}
\]

The pinned finite Chebyshev lower bound and the positive digamma series give

\[
 d_\lambda^{\rm bullet}(t)\geq V_\lambda(b_0),
 \qquad t\in\mathcal A_{\delta,b_0}(\lambda).         \tag{6.12}
\]

For the locked shift (1.7), condition (6.10) holds for some fixed `C_B`, and

\[
 V_\lambda(b_0)=\Omega(\lambda).                       \tag{6.13}
\]

### Theorem 6.1 (necessary annular angle)

Let `K subset X_lambda` be the actual captured physical range, let
`H` be its orthogonal complement in `X_lambda`, and let `P_H` be the
orthogonal projector onto `H`.  Then

\[
 \boxed{
 \|P_HT_{d_\lambda^{\rm bullet}}P_H\|
 \geq V_\lambda(b_0)\sigma_0
       \|P_HF_{\sigma_0}\|^2.}                        \tag{6.14}
\]

Consequently, any bound

\[
 \|P_HT_{d_\lambda^{\rm bullet}}P_H\|<B_\lambda      \tag{6.15}
\]

necessarily implies

\[
 \boxed{
 \|P_HF_{\sigma_0}\|^2
 <{B_\lambda\over V_\lambda(b_0)\sigma_0}.}           \tag{6.16}
\]

For `B_lambda=O(L)`, the right side is `O(L/lambda)`.

**Proof.**  Equations (6.3) and (6.12) give the Loewner inequality

\[
 T_{d_\lambda^{\rm bullet}}
 \succeq V_\lambda(b_0)C_{\rm ann}.                   \tag{6.17}
\]

Spectral calculus and the closed definition (6.7) give

\[
 C_{\rm ann}\succeq\sigma_0F_{\sigma_0}.             \tag{6.18}
\]

Compress by `P_H` and take operator norms.  Since

\[
 \|P_HF_{\sigma_0}P_H\|
 =\|P_HF_{\sigma_0}\|^2,                              \tag{6.19}
\]

equations (6.17)--(6.19) prove (6.14).  Rearrangement proves
(6.16).  `square`

Thus the surviving operator route needs a sine angle of order at most
`sqrt(L/lambda)` to this fixed, source-independent annular concentration
space.  Component lengths, BV norms, or concentration eigenvalues alone do
not prove that angle.

## 7. The hard-cut layer average is itself of order `lambda`

This section applies only to `d_lambda^ext` in (1.9).  It does not apply to
the uncut symbol (1.8).

For each fixed `lambda`, `d_lambda^all` is continuous and has compact
support: the prime polynomial is bounded, while the archimedean term tends
to `+infinity` logarithmically.  It is locally Lipschitz after taking the
positive part.  The hard symbol is therefore in `L^1(R) cap BV(R)`, with two
additional jumps at `t=+delta/L` and `t=-delta/L`.

Choose

\[
 0<h<\min\left\{\delta,{\pi\over2}-\delta\right\}.     \tag{7.1}
\]

Define the outside and inside boundary strips

\[
 O_+=\left({\delta\over L},{\delta+h\over L}\right),
 \quad
 I_+=\left({\delta-h\over L},{\delta\over L}\right), \tag{7.2}
\]

\[
 O_-=-O_+,
 \qquad I_-=-I_+.                                      \tag{7.3}
\]

On `O_+ union O_-`, equation (6.12), with `b_0=delta+h`, gives

\[
 d_\lambda^{\rm ext}(t)\geq V_\lambda(\delta+h).      \tag{7.4}
\]

On `I_+ union I_-`, the same hard symbol is exactly zero.

For the whole physical interval, the frequency concentration kernel is

\[
 R_I(t,u)=\widehat{{\bf1}_{I_\lambda}}(t-u)
 ={2\sin((t-u)L/2)\over t-u}.                          \tag{7.5}
\]

If `(t,u)` lies in `O_+ cross I_+` or `O_- cross I_-`, then

\[
 |t-u|L/2\leq h
\]

and hence

\[
 |R_I(t,u)|\geq L{\sin h\over h}.                     \tag{7.6}
\]

Let

\[
 C_{I,s}=P_I\mathcal F^{-1}M_{{\bf1}_{\{d_\lambda^{\rm ext}>s\}}}
             \mathcal F P_I
\]

and let

\[
 \mathcal J_\lambda^{\rm ext}
 =\int_0^{A_\lambda}
       \operatorname {tr}(C_{I,s}-C_{I,s}^2)\,ds.     \tag{7.7}
\]

The height layers in (7.7) are strict/open.  The exact layer identity is

\[
 \mathcal J_\lambda^{\rm ext}
 ={1\over2}\iint
 |d_\lambda^{\rm ext}(t)-d_\lambda^{\rm ext}(u)|
 |R_I(t,u)|^2\,d\nu(t)d\nu(u).                         \tag{7.8}
\]

### Theorem 7.1 (two-jump layer lower bound)

\[
 \boxed{
 \mathcal J_\lambda^{\rm ext}
 \geq{V_\lambda(\delta+h)\sin^2h\over2\pi^2}.}       \tag{7.9}
\]

In particular,

\[
 \mathcal J_\lambda^{\rm ext}=\Omega(\lambda).       \tag{7.10}
\]

**Proof.**  Restrict (7.8) first to `O_+ cross I_+` and its transpose.
Each rectangle has area `h^2/L^2`.  Equations (7.4)--(7.6) show that the
integral over one ordered rectangle is at least

\[
 {V_\lambda(\delta+h)\over(2\pi)^2}
 L^2\left({\sin h\over h}\right)^2{h^2\over L^2}
 ={V_\lambda(\delta+h)\sin^2h\over4\pi^2}.            \tag{7.11}
\]

The transpose contributes the same amount, and the factor `1/2` in (7.8)
returns (7.11).  The negative reflected pair contributes a second copy.
This proves (7.9).  `square`

The factor two in (7.9) is the contribution of inversion reflection.
Keeping only positive frequencies loses one entire boundary jump.
The proof uses open rectangles, so changing the values at the four interval
endpoints cannot affect it.

### 7.1 Consequence for the checkpoint BV majorant

Put

\[
 M_\lambda=\|d_\lambda^{\rm ext}\|_{L^1(dt)},
 \qquad
 V_\lambda^{\rm BV}=\operatorname {TV}(d_\lambda^{\rm ext}),
 \qquad
 z_\lambda={LM_\lambda\over V_\lambda^{\rm BV}}.      \tag{7.12}
\]

The boundary strips and the two one-sided jumps give the finite lower
bounds

\[
 M_\lambda\geq{2h\over L}V_\lambda(\delta+h),          \tag{7.13}
\]

\[
 V_\lambda^{\rm BV}\geq2V_\lambda(\delta).            \tag{7.14}
\]

The checkpoint BV right side is

\[
 \mathcal B_\lambda^{\rm BV}
 ={V_\lambda^{\rm BV}\over\pi^2}
 \begin{cases}
 2z_\lambda-z_\lambda^2/2,&0\leq z_\lambda\leq1,\\[1mm]
 3/2+\log z_\lambda,&z_\lambda\geq1.
 \end{cases}                                           \tag{7.15}
\]

If `z_lambda<=1`, then

\[
 \mathcal B_\lambda^{\rm BV}
 \geq{3LM_\lambda\over2\pi^2}
 \geq{3hV_\lambda(\delta+h)\over\pi^2}.              \tag{7.16}
\]

If `z_lambda>=1`, then

\[
 \mathcal B_\lambda^{\rm BV}
 \geq{3V_\lambda^{\rm BV}\over2\pi^2}
 \geq{3V_\lambda(\delta)\over\pi^2}.                 \tag{7.17}
\]

Thus the displayed BV majorant is `Omega(lambda)` in either branch.  More
strongly, Theorem 7.1 shows that the full-interval layer average which it
majorizes is already `Omega(lambda)`.  This is not merely a poor estimate of
a small layer average; it is the exact cost of the sharp central/exterior
cut at its two reflected boundaries.

For `d_lambda^all`, equations (7.2)--(7.17) are unavailable because there is
no central zero region and no cutoff jump.  The annular gray theorem in
Section 4 still applies unchanged.

## 8. The distinguished anchor is insufficient

Retain the source-normalized distinguished state on a schedule satisfying
the checkpoint Mellin projection estimate,

\[
 \kappa_\lambda
 ={P_{N(\lambda)}f_\lambda\over
         \|P_{N(\lambda)}f_\lambda\|_2}.               \tag{8.1}
\]

In this section, `T_(d_lambda^bullet)` denotes compression to the raw
centered even Fourier target containing both `q_(+,L)` and
`kappa_lambda`; the projections in (8.5) and (8.8) are taken inside that
target.

The locked Mellin calculation is

\[
 \widehat K(t)={\Xi(t)\over4},                          \tag{8.2}
\]

not `Xi(t)`.  With

\[
 a_\infty=\|K\|_{L^2(\mathbb R)}>0,                   \tag{8.3}
\]

the exact constant-direction overlap is

\[
 \boxed{
 \langle q_{+,L},\kappa_\lambda\rangle
 ={\Xi(0)\over4a_\infty\sqrt L}+o(L^{-1/2}).}          \tag{8.4}
\]

Equation (8.4) records the source scalar before forming the normalized
direction.  The eventual angular statement is invariant under a fixed
nonzero scalar, but replacing the finite source state by its unit-
normalization changes the unnormalized limiting transform and is rejected.

Define the normalized even direction left after capturing only the anchor,

\[
 \widetilde q_{+,L}
 ={(I-|\kappa_\lambda\rangle\langle\kappa_\lambda|)
       q_{+,L}
   \over
   \|(I-|\kappa_\lambda\rangle\langle\kappa_\lambda|)
       q_{+,L}\|_2}.
                                                                  \tag{8.5}
\]

It belongs to the anchor complement.  Equations (3.2) and (8.4), together
with `|widehat{kappa_lambda}(t)|<=sqrt(L)`, imply, uniformly for `z` in a
fixed compact set,

\[
 {1\over\sqrt L}
 \widehat{\widetilde q}_{+,L}(z/L)
 =F_+(z)+o(1).                                         \tag{8.6}
\]

Therefore

\[
 \int_{\mathcal A_{\delta,b_0}(\lambda)}
 |\widehat{\widetilde q}_{+,L}(t)|^2\,d\nu(t)
 =\beta_{+,0}+o(1).                                    \tag{8.7}
\]

Using (6.12) in this single quadratic form gives

\[
 \boxed{
 \left\|P_{\kappa_\lambda^\perp}
 T_{d_\lambda^{\rm bullet}}
 P_{\kappa_\lambda^\perp}\right\|
 \geq V_\lambda(b_0)(\beta_{+,0}+o(1))
 =\Omega(\lambda).}                                   \tag{8.8}
\]

Thus the distinguished anchor alone cannot meet an `O(L)` exterior budget.
This conclusion does not apply to the full arithmetic--prolate captured
range, which contains additional source directions.

For completeness, the weighted projection estimate with exponent zero and
the source comparison imply

\[
 \sqrt L\,\|P_{N(\lambda)}f_\lambda-K\|_{L^2(I_\lambda)}
 \longrightarrow0.                                     \tag{8.8a}
\]

The explicit Poisson representation of `K` gives an integrable tail outside
`I_lambda`.  Cauchy--Schwarz on `I_lambda` therefore turns (8.8a) into
`L^1(R)` convergence after zero extension.  Fourier transformation then
gives the local uniform convergence

\[
 \widehat\kappa_\lambda(t)
 \longrightarrow {\Xi(t)\over4a_\infty}               \tag{8.9}
\]

on a fixed neighborhood of zero.  Hence its annular concentration energy is

\[
 \langle\kappa_\lambda,C_{\rm ann}\kappa_\lambda\rangle
 =O(L^{-1}).                                           \tag{8.10}
\]

From `C_ann>=sigma_0 F_(sigma_0)`, equation (8.10) gives

\[
 \|F_{\sigma_0}\kappa_\lambda\|=O(L^{-1/2}).          \tag{8.11}
\]

Thus the source-normalized anchor is asymptotically transverse to the
closed annular projector whose angle is required in Theorem 6.1.

## 9. Exact interpretation and remaining target

The phrase “complete exterior defect” is insufficient to distinguish
(1.8) from (1.9).  An exact source lock must say whether the central cutoff
is part of the scalar symbol.

- If the symbol is `d_lambda^all`, Sections 2--6 and 8 apply.  It is a
  complete uncut soft defect, not the exterior summand of the sharp
  central/exterior decomposition.  No boundary-jump conclusion is made.
- If the symbol is `d_lambda^ext`, every section applies.  The hard-layer
  and BV routes then have the order-`lambda` obstruction in Section 7.

In both cases the component-free trace route loses at the gray term, and the
operator route needs genuine physical information.  On the logarithmic-
squared projection schedule it needs a full coframe.  On a larger matched
schedule it needs at least `Omega(lambda/L)` soft directions aligned at the
scale in (6.16).

The next honest exterior theorem would therefore have to do one of the
following on the same unbounded schedule as the other proof obligations:

1. prove the full normalized adjoint-tail/coframe estimate, making the
   physical complement vanish; or
2. construct the actual captured approximation to the closed annular and
   remaining top soft projectors and prove squared angle `O(L/lambda)` with
   a strict reserve.

Neither assertion follows from the present BV data, component geometry,
the distinguished Xi state, or numerical eigenvalue agreement.
