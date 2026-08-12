# Prime-side signed Riesz history barrier

## 0. Exact outcome and claim boundary

This note tests whether the remaining nonattained-right-edge history gate can
be closed directly from primes.  The answer supplied by the currently
admitted prime information is negative, but two exact improvements survive.

First, the complete pole--archimedean--minus-prime source has a sharp
prime-side formulation.  If `S_(k,L)` is the fixed-vertex resonant kernel,
then its history term is a centered weighted Riesz mean of the positive von
Mangoldt measure.  On a point where `Psi(L)>0`, the desired estimate is
equivalent to a normalized **signed** mean of `S_(k,L)/p_k` tending to zero.
The Fiori--Kadiri--Swidinsky bound controls the size of the discrepancy, not
this signed mean.

Second, localization of the actual natural-cutoff anchor improves the
previous history estimate by `sqrt(L)`:

\[
 \boxed{\|S_{k,L}''\|_1=O_k(L^{-3/2}).}                 \tag{0.1}
\]

Consequently, in the nonattained-edge notation of
`ATTAINED_RIGHT_EDGE_VECTOR_SELECTION_THEOREM.md`, the cancellation-free
sufficient condition is now

\[
 \boxed{A_3(L)+1=o\{L\Psi(L)\},\qquad \Psi(L)>0,}      \tag{0.2}
\]

on an unbounded strict-half-integer grid sequence.  This is weaker than the
old `A_3=o(sqrt(L)*Psi)` gate, but it is still a signed-peak problem and is
not supplied by scalar Landau unboundedness.

An exact synthetic positive Chebyshev measure below satisfies
`Theta(X)=X+O(log X)`, has only positive jumps of prime-like size and
spacing, and has asymptotically perfect mass in every interval much longer
than `log X`.  Nevertheless it has `Psi(L)>0` for every large `L` and fails
the relative history estimate for every fixed vertex.  This proves that
PNT magnitude, positive jumps, short-interval mass, and summation by parts
alone do not imply the missing signed mean.

The synthetic measure is **not** the von Mangoldt measure.  In particular,
it does not have the exact prime-power support, need not satisfy the
completed-zeta logarithmic-derivative identity, and does not model a
nonattained zeta-zero edge.  Thus it is a logical no-go for the named prime
inputs, not a counterexample to the actual arithmetic statement.  Any
argument exploiting the exact prime-power phases would be new input.

No `Xi'/Xi` continuation is inserted into a prime-side estimate here.  No
actual-source history theorem, nonattained-edge selection theorem, RH
conclusion, graph positivity, routing statement, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or Lambda bound is proved.  The formal state remains
`P0_INVALIDATED`.

## 1. Exact complete-source Riesz form

Retain the scalar-deleted complete discrepancy of
`ANCHORED_CENTRAL_DEGREE_SCREW_BARRIER.md`.  Put

\[
 \alpha_r=2r+{5\over2},\qquad
 H_{\rm tail}(t)=\sum_{r\geq0}{e^{-\alpha_rt}\over\alpha_r},
                                                               \tag{1.1}
\]

\[
 m(t)=2(e^{t/2}-1)+H_{\rm tail}(t)+c_\infty,          \tag{1.2}
\]

and let the positive weighted prime-power measure on the logarithmic line
be

\[
 d\mu_\Lambda(h)=
 \sum_{n>1}{\Lambda(n)\over\sqrt n}\,\delta_{\log n}(dh).
                                                               \tag{1.3}
\]

Its inclusive cumulative function is

\[
 P(t)=\mu_\Lambda((0,t])
 =\sum_{1<n\leq e^t}{\Lambda(n)\over\sqrt n}.         \tag{1.4}
\]

The pole, archimedean, and prime terms are combined before any estimate:

\[
 \boxed{R(t)=P(t)-m(t),\qquad
 g(L)=\int_0^LR(t)\,dt,\qquad \Psi(L)=-g(L).}         \tag{1.5}
\]

Define the continuous reference Riesz mean

\[
 \begin{aligned}
 C(L):=\int_0^Lm(t)\,dt
 ={}&4(e^{L/2}-1)-2L+c_\infty L\\
 &+\sum_{r\geq0}{1-e^{-\alpha_rL}\over\alpha_r^2},
 \end{aligned}                                        \tag{1.6}
\]

and the prime Riesz mean

\[
 V(L):=\int_{(0,L]}(L-h)\,d\mu_\Lambda(h)
 =\sum_{1<n\leq e^L}{\Lambda(n)\over\sqrt n}(L-\log n).
                                                               \tag{1.7}
\]

Then the finite source formula is exactly

\[
 \boxed{g(L)=V(L)-C(L),\qquad \Psi(L)=C(L)-V(L).}     \tag{1.8}
\]

At `n=e^L` the factor in (1.7) is zero.  Thus (1.7) retains the inclusive
source convention without creating an endpoint ambiguity.

For fixed `k>=1`, use the exact kernel from
`CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md`:

\[
 \begin{aligned}
 Q_{k,L}(t)&=k^2\sum_{\substack{0\leq j\leq N\\j\ne k}}
 p_j{\cos(k\omega t)-\cos(j\omega t)\over k^2-j^2},\\
 S_{k,L}(t)&=-p_k\{\cos(k\omega t)-1\}+Q_{k,L}(t),
 \qquad \omega={2\pi\over L}.
 \end{aligned}                                        \tag{1.9}
\]

Set

\[
 K_{k,L}(h)=\int_h^LS_{k,L}(t)\,dt.                  \tag{1.10}
\]

### Theorem 1.1 (prime-side signed Riesz identity)

For every finite natural-cutoff anchor and every fixed `k>=1`,

\[
 \boxed{
 \begin{aligned}
 {\cal M}_k(L)
 &=\int_0^L\Psi(t)S_{k,L}'(t)\,dt
  =\int_0^LR(t)S_{k,L}(t)\,dt\\
 &=\int_{(0,L]}K_{k,L}(h)\,d\mu_\Lambda(h)
   -\int_0^Lm(t)S_{k,L}(t)\,dt.
 \end{aligned}}                                      \tag{1.11}
\]

**Proof.**  Both endpoint values of `S_(k,L)` vanish and
`Psi'=-R` almost everywhere, so integration by parts gives the first line.
Tonelli on the finite positive prime inventory gives

\[
 \int_0^LP(t)S_{k,L}(t)\,dt
 =\int_{(0,L]}\left\{\int_h^LS_{k,L}(t)\,dt\right\}
 d\mu_\Lambda(h).
\]

Subtracting the already-combined reference term proves (1.11).  Notice
that `K_(k,L)(L)=0`, again preserving the inclusive endpoint.  \(\square\)

Suppose `Psi(L)>0` and `p_k!=0`, and define the normalized signed history
measure

\[
 d\sigma_L(t)={-R(t)\,dt\over\Psi(L)}.               \tag{1.12}
\]

It has total mass one, but it need not be positive.  Equation (1.11) gives
the exact equivalence

\[
 \boxed{
 {{\cal M}_k(L)\over p_k\Psi(L)}
 =-\int_0^L{S_{k,L}(t)\over p_k}\,d\sigma_L(t).}     \tag{1.13}
\]

Thus `M_k=o(|p_k|*Psi)` is precisely the assertion that the absolute value
of the signed mean in (1.13) tends to zero.  This is the sharp prime-side
covariance/Riesz condition; replacing `R` by separate absolute prime and
archimedean envelopes destroys it.

## 2. Natural-cutoff localization improves the history scale

Let

\[
 M(\lambda)=\lceil\lambda\rceil,\qquad
 L=2\log\lambda,\qquad f_L=P_{M(\lambda)}X_\lambda, \tag{2.1}
\]

and put `F_L=sqrt(L)*f_L`, consistently with (1.9).

### Lemma 2.1 (the projected anchor has bounded `L1` mass)

On the natural cutoff,

\[
 \boxed{\|f_L\|_{L^1(0,L)}=O(1),\qquad
        \|F_L\|_{L^1(0,L)}=O(\sqrt L).}              \tag{2.2}
\]

**Proof.**  Equation (5.5) of
`ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md`, already at depth zero, gives

\[
 \|X_\lambda-G_0\|_2=O(\lambda^{-1}),               \tag{2.3}
\]

where the fixed function `G_0` is rapidly localized and belongs to
`L1(R)`.  Hence

\[
 \|X_\lambda\|_1
 \leq\|G_0\|_{L^1(\mathbb R)}
       +\sqrt L\,O(\lambda^{-1})=O(1).               \tag{2.4}
\]

The admitted growing-order Gevrey estimate, recorded as equation (3.7) of
`NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md`, is

\[
 \|(I-P_{M(\lambda)})X_\lambda\|_2\leq Ce^{-cL^2}.  \tag{2.5}
\]

Therefore

\[
 \|f_L\|_1\leq\|X_\lambda\|_1
 +\sqrt L\,\|(I-P_M)X_\lambda\|_2=O(1).
\]

Multiplication by `sqrt(L)` proves the second assertion.  \(\square\)

### Theorem 2.2 (improved fixed-vertex history derivative)

For every fixed `k>=1`,

\[
 \boxed{
 \|Q_{k,L}\|_\infty=O_k(L^{-1/2}),\qquad
 \|S_{k,L}''\|_1=O_k(L^{-3/2}).}                     \tag{2.6}
\]

**Proof.**  The exact resonant equation is

\[
 Q_{k,L}''+(k\omega)^2Q_{k,L}
 =-k^2\omega^2\{F_L-p_k\cos(k\omega t)\},           \tag{2.7}
\]

with zero initial value and derivative.  Duhamel gives

\[
 \begin{aligned}
 Q_{k,L}(t)={}&-k\omega\int_0^t
 \sin\{k\omega(t-u)\}F_L(u)\,du\\
 &+{p_kk\omega t\over2}\sin(k\omega t).
 \end{aligned}                                      \tag{2.8}
\]

Lemma 2.1, `omega=2*pi/L`, and the admitted fixed-mode estimate
`p_k=O_k(L^(-1/2))` prove the first part of (2.6).  Differentiating (1.9)
and using (2.7) gives

\[
 S_{k,L}''=-k^2\omega^2F_L
 +2p_kk^2\omega^2\cos(k\omega t)
 -k^2\omega^2Q_{k,L}.                               \tag{2.9}
\]

The `L1` sizes of its three terms are respectively

\[
 O_k(L^{-2}\sqrt L),\qquad
 O_k(L^{-2}L\,L^{-1/2}),\qquad
 O_k(L^{-2}L\,L^{-1/2}),
\]

which proves the second part.  \(\square\)

The endpoint identities `S(0)=S'(0)=0` also imply

\[
 \boxed{\|S_{k,L}\|_\infty=O_k(L^{-1/2}).}           \tag{2.10}
\]

## 3. Sharpened nonattained-edge reduction

Choose centered-zero representatives with nonnegative real part and define

\[
 A_3(L)=\sum_{\alpha\in Z_+}
 {e^{(\Re\alpha)L}\over|\alpha|^3}.                 \tag{3.1}
\]

The already-established unconditional history formula is

\[
 {\cal M}_k(L)=\sum_{\alpha\in Z_+}{1\over\alpha^3}
 \left\{\int_0^Le^{-\alpha t}S_{k,L}''(t)\,dt
       -\int_0^Le^{ \alpha t}S_{k,L}''(t)\,dt\right\}.
                                                               \tag{3.2}
\]

No continuation of `Xi'/Xi` is used in (3.2).  The paired Hadamard formula
and absolute inverse-square summability were already justified in the
source theorem.

### Corollary 3.1 (improved absolute history bound)

For fixed `k`,

\[
 \boxed{|{\cal M}_k(L)|\leq C_kL^{-3/2}\{A_3(L)+O(1)\}.} \tag{3.3}
\]

Since

\[
 \sqrt L\,p_0\to C>0,\qquad
 \sqrt L\,p_k\to2(-1)^kC,                           \tag{3.4}
\]

condition (0.2) implies

\[
 {\cal M}_k(L)=o\{|p_k|\Psi(L)\}                    \tag{3.5}
\]

simultaneously over any fixed finite set of vertices.  With

\[
 Q_2(L)=\left(\sum_{\alpha\in Z_+}
 {e^{2(\Re\alpha)L}\over|\alpha|^4}\right)^{1/2}, \tag{3.6}
\]

Cauchy--Schwarz gives the sufficient RMS form

\[
 \boxed{Q_2(L)+1=o\{L\Psi(L)\},\qquad\Psi(L)>0.}     \tag{3.7}
\]

In the attained-edge and RH branches, the relative history error improves
from `O_k(L^(-1/2))` to `O_k(L^(-1))`.

In the nonattained-edge case, the existing theorem gives only
`A_3/A_2 -> 0`.  It gives no comparison of the signed quantity `Psi` with
`A_2/L`, so it does not imply (0.2).  Fejer blocks may make a positive
signed peak arbitrarily small relative to its RMS; the extra factor `L`
weakens but does not remove that phase obstruction.

## 4. What the admitted prime inputs do and do not say

The only locked PNT source in `P3_SOURCE_LOCK.json` is

\[
 { |\psi_C(X)-X|\over X}
 <9.22022(\log X)^{3/2}
 e^{-0.8476836\sqrt{\log X}}\qquad(X>2).             \tag{4.1}
\]

Partial summation bounds `R` and `Psi` by an absolute envelope of order
`e^(t/2)` times the displayed subexponential saving.  Inserting that
envelope into (1.11), or integrating by parts finitely many more times,
produces only absolute moments.  It does not control the signed mean
(1.13).  When a nonattained edge has `B<1/2`, any finite polynomial gain is
also unable to bridge the exponential gap between this PNT envelope and an
`e^(BL)` signed peak.  When `B=1/2`, the missing issue is still relative
phase cancellation rather than absolute size.

The exact prime-power jumps say that `P` has upward jumps and that `R`
decreases between them for all sufficiently large `t`.  Hence `Psi` is
convex between jumps and its derivative has downward jumps.  Those local
facts do not determine a global signed mean over `[0,L]`.

No primes-in-short-interval theorem is admitted by `P3_SOURCE_LOCK.json`.
Even if one is added as an **unadmitted** hypothesis, it controls local
increments of the positive measure, while (1.13) depends on its centered
global Riesz covariance.  Section 5 gives a measure with much stronger
local behavior and with the same upward-jump geometry for which (1.13)
fails.

## 5. An exact positive-measure countermodel

This section keeps the complete reference function `m`; only the positive
prime measure is replaced.

Choose `T_0` large enough that

\[
 m'(t)=e^{t/2}-\tau(t)>0,\qquad
 \tau(t)={e^{-5t/2}\over1-e^{-2t}},                  \tag{5.1}
\]

for `t>=T_0`.  Put `X_0=e^(T_0)` and choose
`0<c<m(T_0)`.  Select any finite positive pure-point measure on `[1,X_0]`
whose
`x^(-1/2)`-weighted mass is `m(T_0)-c`.  On the tail define

\[
 \rho(x)=1-x^{-1/2}\tau(\log x)>0,\qquad
 d\Theta_{\rm c}(x)=\rho(x)\,dx.                     \tag{5.2}
\]

Let

\[
 P_{\rm c}(t)=\int_{[1,e^t]}x^{-1/2}\,d\Theta_{\rm c}(x).
                                                               \tag{5.3}
\]

The tail derivative is

\[
 P_{\rm c}'(t)=e^{t/2}\rho(e^t)
 =e^{t/2}-\tau(t)=m'(t).                              \tag{5.4}
\]

By the chosen initial mass,

\[
 \boxed{P_{\rm c}(t)=m(t)-c\quad(t\geq T_0).}        \tag{5.5}
\]

Moreover `rho(x)=1+O(x^(-3))`, so

\[
 \Theta_{\rm c}(X)=X+O_{T_0,c}(1),                  \tag{5.6}
\]

and its mass in every tail interval is its length plus a bounded, rapidly
decaying correction.  This is already much stronger than (4.1), but it is
continuous.  The following exact atomization restores positive jumps.

Starting at `x_0=X_0`, form cells

\[
 I_j=[x_j,x_{j+1}],\qquad x_{j+1}=x_j+\log x_j.      \tag{5.7}
\]

For each cell put

\[
 W_j=\int_{I_j}\rho(x)\,dx,\qquad
 U_j=\int_{I_j}x^{-1/2}\rho(x)\,dx.                 \tag{5.8}
\]

The weighted mean-value theorem supplies a unique `xi_j in I_j` satisfying

\[
 \xi_j^{-1/2}={U_j\over W_j}.                        \tag{5.9}
\]

Replace the restriction of (5.2) to `I_j` by the positive atom
`W_j*delta_(xi_j)`.  Call the resulting pure-point measure
`Theta_a`.  Both its ordinary cell mass and its `x^(-1/2)`-weighted cell
mass equal those of (5.2) exactly.

Consequently,

\[
 \boxed{\Theta_{\rm a}(X)=X+O(\log X),}              \tag{5.10}
\]

its atom weights are `asymp(log X)`, its gaps are `O(log X)`, and, for
tail intervals,

\[
 \Theta_{\rm a}((X,X+H])
 =H+O\{\log(2X+2H)\}.                               \tag{5.11}
\]

Thus every interval with `H/log(2X+2H) -> infinity` has asymptotically
the expected mass.  In particular this synthetic measure satisfies the
eventual magnitude consequence of (4.1) by an enormous margin and has
positive, prime-sized jumps with logarithmic gaps.

Let `P_a` be its weighted logarithmic cumulative function.  At every cell
boundary `P_a=m-c`.  Inside a cell,

\[
 P_a(t)-m(t)=-c+\epsilon(t),\qquad
 |\epsilon(t)|\leq C(1+t)e^{-t/2}.                  \tag{5.12}
\]

Hence `epsilon` is integrable.  Including the fixed initial interval, there
is one `delta in L1(0,infinity)` such that the complete synthetic
discrepancy is

\[
 \boxed{R_{\rm a}(t)=-c+\delta(t).}                  \tag{5.13}
\]

It is a sawtooth with only upward jumps and decreasing arcs between them,
just like the prime cumulative discrepancy.

### Theorem 5.1 (magnitude and short intervals do not flatten history)

Use the actual natural-cutoff anchor coordinates and kernels, but replace
the von Mangoldt measure by `Theta_a`.  Then on every unbounded
strict-half-integer grid,

\[
 \boxed{\Psi_{\rm a}(L)=cL+O(1)>0,}                  \tag{5.14}
\]

while, for every fixed `k>=1`,

\[
 \boxed{{\cal M}_{k,{\rm a}}(L)
 =-c(p_k-p_0)L+O_k(L^{-1/2}).}                       \tag{5.15}
\]

In particular,

\[
 \boxed{
 {{\cal M}_{k,{\rm a}}(L)\over|p_k|\Psi_{\rm a}(L)}
 \longrightarrow-{2(-1)^k-1\over2}
 =\begin{cases}
  3/2,&k\text{ odd},\\
 -1/2,&k\text{ even}.
 \end{cases}}                                       \tag{5.16}
\]

**Proof.**  Equation (5.13) and integrability of `delta` give (5.14).  The
Fourier means in (1.9) give the exact identity

\[
 \int_0^LS_{k,L}(t)\,dt=(p_k-p_0)L.                  \tag{5.17}
\]

Indeed, the first term in `S` has mean `p_k`, the `j=0` term in `Q` has
mean `-p_0`, and every remaining nonzero cosine has mean zero.  Equations
(2.10), (5.13), and (5.17) now give

\[
 \int_0^LR_{\rm a}(t)S_{k,L}(t)\,dt
 =-c(p_k-p_0)L+O_k(L^{-1/2})\|\delta\|_1,
\]

which is (5.15).  The fixed-mode limits (3.4) prove (5.16).  \(\square\)

The same conclusion holds for the continuous measure `Theta_c`, where the
tail error in (5.13) vanishes identically.  The atomized form shows that
positivity, upward jumps, realistic jump size, and extremely strong local
mass estimates still do not control the signed Riesz mean.

## 6. Surviving actual-source task

The actual nonattained-edge theorem would follow from an unbounded
strict-half-integer sequence satisfying either

\[
 \Psi(L)>0,\qquad A_3(L)+1=o\{L\Psi(L)\},            \tag{6.1}
\]

or, more sharply and without absolute majorants,

\[
 \boxed{
 \int_0^L{S_{k,L}(t)\over p_k}\,d\sigma_L(t)=o(1)
 \quad\text{for every fixed }k.}                    \tag{6.2}
\]

The admitted FKS theorem, scalar Landau unboundedness, jump positivity,
and summation by parts do not supply (6.1) or (6.2).  Any external
short-interval prime theorem is **unadmitted** and, at the level of local
mass alone, is ruled out as a sufficient mechanism by Theorem 5.1.

The remaining possible prime-side route must exploit arithmetic
correlations of the exact prime-power locations and von Mangoldt weights
with the moving kernels `K_(k,L)`; a magnitude or gap theorem is not enough.
