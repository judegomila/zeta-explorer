# Q0-free selector secant and root-parity theorem

## 0. Exact outcome and claim boundary

Assume the finite checkpoint-1.34 hypotheses: `Q` is a real
inversion-symmetric source-Cauchy matrix on the modes `-N,...,N`, its ground
value `mu` is simple and inversion even, its ground `Phi` is boundary
normalized, and

\[
 T=Q-\mu I=T_+\oplus T_-,\qquad
 T_+\succeq0,\quad\ker T_+=\mathbb R\Phi,\quad T_->0.
                                                               \tag{0.1}
\]

Checkpoint 1.34 gives distinct positive selector squares `y_j=r_j^2`,
positive regular weights `theta_j`, and possible positive shell weights.
For the regular atoms put

\[
 S(x)=\sum_{j\in R}{\theta_j\over x-y_j},\qquad
 -S'(x)=\sum_{j\in R}{\theta_j\over(x-y_j)^2}.
                                                               \tag{0.2}
\]

The present theorem removes `q_0` from one local root-clearance test.  For
integers `1<=h<n<=N-h`, if no regular root or shell lies in the closed
window `[(n-h)^2,(n+h)^2]`, then

\[
 \boxed{
 -S'(n^2)\leq
 {S((n-h)^2)-S((n+h)^2)\over4nh}.}
                                                               \tag{0.3}
\]

The constant `1/(4nh)` is sharp over positive selector measures.  At
`h=1`, the actual source row therefore gives the conditional implication

\[
 \boxed{
 D_n>B_b(\lambda){n^2\over n^2-1}
 \quad\Longrightarrow\quad
 \text{some selector radius }r\in[n-1,n+1].}
                                                               \tag{0.4}
\]

No global twisted coordinate cone and no central moment `q_0` occur in
(0.3)--(0.4).  A shell in the window already satisfies the conclusion.

The frozen diagonal and source envelopes activate (0.4) on a conditional
locked high tail.  On `N=2^(9600 lambda^2)`, all sufficiently large
`lambda` and all `ceil(sqrt(N))<=n<=N-1` satisfy (0.4).  Taking centers
three apart gives `Omega(N)` distinct selector roots in that tail.  This is
not one root per gap and is not subunit clearance.

There is also an exact root-parity law.  If
`p(y)=prod_(j=1)^N(y-y_j)` is the monic ground polynomial and
`w_n=(-1)^n xi_n`, then

\[
 \boxed{
 w_n={(-1)^N p(n^2)\over(N-n)!(N+n)!},\qquad 0\leq n\leq N.}
                                                               \tag{0.5}
\]

Away from shells, the sign of `w_n` is the parity of the number of roots
below `n^2`.  Adjacent twisted signs therefore determine only the parity,
not the number, of roots in the intervening lattice gap.  Under the
still-unproved checkpoint-1.33 target convergence, each certified
constant-sign target interval supplies linearly many even-count gaps and
therefore linearly many failures of ordinary one-root-per-gap interlacing.

Finally, one sampled pair `(b_n,D_n)` alone is nonrigid.  Exact positive
two-pole formulas realize the same first and second Cauchy moments with
arbitrarily large quotient-metric distances on both sides, while a nonzero
first moment can have a one-sided realization when the resulting selector
square stays positive.
The neighboring source samples in (0.3), or a new absolute Cauchy-moment
bound, are indispensable.

The actual simple/even ground and genuine shifted signs remain unproved on
an unbounded schedule.  The low `n=O(L)` criterion is neither proved by the
frozen envelopes nor activated by the finite diagnostics below.  Nothing
here proves target convergence, response decay or nondecay, determinant
convergence, an actual-arithmetic sign failure, a new zero statement, the
Riemann hypothesis, a converse from it, or a de Bruijn--Newman `Lambda`
bound.  The formal state remains `P0_INVALIDATED`; the checkpoint-1.34
standard eight are unchanged.

## 1. Frozen inputs

Only the following eight frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/ACTUAL_SOURCE_ROW_PAIRED_GRAM_EXCLUSION_SELECTOR_MOMENT_GATE.md` | `39777f86bfbf067402ccccdf069ff96276e5f931ee3ed4880edd3b135e181329` |
| `tests/test_actual_source_row_paired_gram_exclusion_selector_moment_gate.py` | `4605cc87111476f3defeaa3e7dbf2f78e4f8b4b92ce9f3e9d2a3b2bf855d5ec3` |
| `notes/ACTUAL_GLOBAL_TWISTED_CONE_MOVING_GRID_TARGET_INCOMPATIBILITY.md` | `0fb7b3d1ab5980b9cdc490933c68d9da3536a8d77a677fe96ec921445639121f` |
| `tests/test_actual_global_twisted_cone_moving_grid_target_incompatibility.py` | `91bda99e6b0db886a7551501ae2343705e4a2cb4632a687fe0f0d72287f031d6` |
| `notes/STRICT_ODD_SELECTOR_SHELL_LOCALIZATION_THEOREM.md` | `f84eb9ea08d7af397c201c645c7de5eb8957bc03ac6a5a7e55b653bc3d6321dc` |
| `tests/test_strict_odd_selector_shell_localization_theorem.py` | `5d0c8aa4a72177031f045bfd2318fdd66f40eb60ed8f541b3f6823e970d0ed81` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |

The checkpoint-1.32 pair supplies the exact selector moments and the
locked schedule.  The checkpoint-1.33 pair supplies exact moving-grid
sampling and the two certified nonzero target-sign intervals.  The
checkpoint-1.34 pair supplies the cone-free regular-plus-shell
decomposition.  The high-Fourier pair supplies the actual source and
diagonal envelopes.  No external source, zero list, or numerical artifact
is added.

## 2. General positive secant inequality

Fix integers `1<=h<n` and set

\[
 x=n^2,\qquad a=(n-h)^2,\qquad c=(n+h)^2,
 \qquad c-a=4nh.                                  \tag{2.1}
\]

Let `y>0` lie outside `[a,c]`.  The elementary atom inequality is

\[
 \boxed{
 {1\over(x-y)^2}\leq {1\over c-a}
 \left\{{1\over a-y}-{1\over c-y}\right\}.}
                                                               \tag{2.2}
\]

For `y<a`, put `d=x-y`,
`H_-=h(2n-h)`, and `H_+=h(2n+h)`.  The ratio of the left side of (2.2) to
the right-side secant is

\[
 {(d-H_-)(d+H_+)\over d^2}.
                                                               \tag{2.3}
\]

Here `0<d<x=n^2`.  Direct expansion gives

\[
 (d-H_-)(d+H_+)-d^2
 =h^2\{2d-(4n^2-h^2)\}<0.                         \tag{2.4}
\]

For `y>c`, put `e=y-x`; then

\[
 (e+H_-)(e-H_+)-e^2
 =-h^2\{2e+4n^2-h^2\}<0.                          \tag{2.5}
\]

This proves (2.2).  Multiplication by `theta_j>0` and summation proves
(0.3) whenever the closed window contains no root.  If a shell or regular
root is in the window, the desired root conclusion already holds.

The constant is optimal.  For a single atom with `y>c`, the quotient

\[
 { (x-y)^{-2}\over
  \{(a-y)^{-1}-(c-y)^{-1}\}/(c-a)}
 ={(y-a)(y-c)\over(y-x)^2}\longrightarrow1
 \quad(y\longrightarrow+\infty).                 \tag{2.6}
\]

Thus no smaller universal multiplier of the endpoint secant can replace
the right side of (2.2).  Sharpness persists inside an `N`-atom simple
selector face: add `N-1` distinct exterior atoms with positive weights
tending to zero while the displayed far atom dominates.

## 3. Actual source-row criterion

For every positive retained index, checkpoint 1.34 gives

\[
S(m^2)=-{b_m^{\rm act}\over2m},\qquad
D_n=4n^2\{-S'(n^2)\}+\vartheta_n,                \tag{3.1}
\]

where `vartheta_n` is zero unless `n` is a shell.  A queried shell proves
the root conclusion immediately.  Otherwise `vartheta_n=0`; if the whole
`h`-window is root free, (0.3) becomes

\[
 \boxed{
 D_n\leq {n\over h}
 \left\{-{b_{n-h}^{\rm act}\over2(n-h)}
          +{b_{n+h}^{\rm act}\over2(n+h)}\right\}.}
                                                               \tag{3.2}
\]

In particular, the expression in braces must be positive.  A failure of
that monotonicity is already a root certificate.  From the frozen uniform
bound `|b_m^act|<=B_b(lambda)`,

\[
 \boxed{
 D_n\leq B_b(\lambda){n^2\over h(n^2-h^2)}}       \tag{3.3}
\]

under the same root-free assumption.  Equation (0.4) is the contrapositive
of (3.3) at `h=1`.  It uses only `b_(n-1)`, `b_(n+1)`, and `D_n`; `b_n`
and `q_0` are absent.

For a root certified by `h=1`, the radius obeys `|r-n|<=1`, while the
checkpoint-1.32 quotient metric has only the constant bound

\[
 {|n^2-r^2|\over r}\leq {2n-1\over n-1}
 =2+{1\over n-1}.                                \tag{3.4}
\]

Thus (0.4) is useful constant-scale clearance, not the subunit or
`O(1/log N)` clearance needed by the paired-product route.

## 4. Frozen diagonal lower bound and the locked tail

Put `L=2 log lambda` and

\[
 \sigma_L=\log {L\over2\tanh(L/2)},              \tag{4.1}
\]

\[
 \begin{split}
 C_a(\lambda)={}&{8(\lambda+\lambda^{-1}-2)\over L}
 +\lambda+2\sigma_L+4L(\lambda-1),\\
 B_b(\lambda)={}&{2(\lambda-\lambda^{-1})\over\pi}
 +{1\over4}+{1\over2\pi^2}
 +{\lambda-1+\sigma_L\over2\pi}
 +{2L(\lambda-1)\over\pi},\\
 A_0(\lambda)={}&4(\lambda-\lambda^{-1})
 +|\gamma+\log(4\pi)|+\lambda+\log\coth(L/2)
 +4L(\lambda-1).
 \end{split}                                      \tag{4.2}
\]

The frozen estimates `mu<=a_0`, `|a_0|<=A_0`,
`|b_n^act|<=B_b`, and the diagonal lower bound give, for every retained
`n>=1`,

\[
 \boxed{
 D_n\geq \log {n\over2}-{1\over2\pi n}
 -C_a(\lambda)-A_0(\lambda)-{B_b(\lambda)\over n}.}
                                                               \tag{4.3}
\]

Now take the locked schedule

\[
 N=2^{9600\lambda^2},\qquad M=\lceil\sqrt N\rceil. \tag{4.4}
\]

Uniformly for `M<=n<=N-1`, the right side of (4.3) is
`4800(log 2)lambda^2-O(lambda log lambda)`, whereas

\[
 B_b(\lambda){n^2\over n^2-1}=O(\lambda\log\lambda).
                                                               \tag{4.5}
\]

Therefore (0.4) holds throughout that tail for all sufficiently large
`lambda`, conditional on (0.1).  Choose

\[
 n_j=M+3j\leq N-1.
                                                               \tag{4.6}
\]

The intervals `[n_j-1,n_j+1]` are pairwise disjoint.  Hence the certified
roots are distinct, and their number is at least

\[
 \boxed{
 1+\left\lfloor{N-1-M\over3}\right\rfloor=\Omega(N).}
                                                               \tag{4.7}
\]

Shells do not break this count because the radius intervals are disjoint.
This is a conditional density statement only; it neither assigns one root
to every gap nor supplies a matching upper count in any window.

## 5. Exact twisted signs and interval root parity

Write the boundary-normalized even ground as

\[
 \Phi=\xi_0V_0+\sum_{n=1}^N\xi_n(V_n+V_{-n}),
 \qquad \xi_0+2\sum_{n=1}^N\xi_n=1.              \tag{5.1}
\]

Its anchor polynomial is monic and, under (0.1), factors as

\[
 p(y)=\prod_{j=1}^N(y-y_j).                       \tag{5.2}
\]

Evaluation at the lattice nodes gives

\[
 p(0)=(-1)^N(N!)^2\xi_0,
 \qquad
 p(n^2)=2n^2\xi_n
 \prod_{\substack{1\leq m\leq N\\m\ne n}}(n^2-m^2).
                                                               \tag{5.3}
\]

The elementary factorial identity

\[
 2n^2\prod_{\substack{1\leq m\leq N\\m\ne n}}
 |n^2-m^2|=(N-n)!(N+n)!                         \tag{5.4}
\]

proves (0.5), including `n=0`.  If `n^2` is not a shell, let

\[
 M_n=\#\{j:y_j<n^2\}.
                                                               \tag{5.5}
\]

Since `sign p(n^2)=(-1)^(N-M_n)`, equation (0.5) gives

\[
 \boxed{\operatorname {sgn}w_n=(-1)^{M_n}.}       \tag{5.6}
\]

For nonshell adjacent nodes put

\[
 c_n=\#\{j:n^2<y_j<(n+1)^2\}.
                                                               \tag{5.7}
\]

Then

\[
 \boxed{
 \operatorname {sgn}(w_{n+1}w_n)=(-1)^{c_n}.}     \tag{5.8}
\]

A shell at `n` is exactly the branch `w_n=0`.  Thus equal adjacent twisted
signs mean an even root count, not an empty gap; opposite signs mean an odd
count, not exactly one root.

Under the checkpoint-1.33 target-convergence hypothesis, each certified
nonzero target-sign interval contains at least
`delta L_k/pi-2` retained consecutive grid indices for all large `k`.
The common projective scale does not change equality of adjacent signs.
Equation (5.8) therefore gives at least

\[
 {\delta L_k\over\pi}-3=\Omega(L_k)               \tag{5.9}
\]

even-count lattice gaps inside each target interval.  Because the target
is bounded away from zero there, none of their endpoints is a shell.
Ordinary one-root-per-gap interlacing fails on every one of these gaps.
The gaps may nevertheless be empty, so (5.9) is not a linear lower bound
for the number of roots.

## 6. Same-point moment nonrigidity

Fix a nonshell query `x=n^2` and prescribed values

\[
 s=S(x)=-{b_n\over2n},\qquad
 t=-S'(x)={D_n\over4n^2}>0.                       \tag{6.1}
\]

Choose `0<a<x` and `b>0` with `at>s` and `bt>-s`.  Put

\[
 y_-=x-a,\qquad y_+=x+b,                           \tag{6.2}
\]

\[
 \boxed{
 \theta_-={a^2(bt+s)\over a+b},\qquad
 \theta_+={b^2(at-s)\over a+b}.}                 \tag{6.3}
\]

Both weights are positive, and direct substitution gives

\[
 {\theta_-\over a}-{\theta_+\over b}=s,
 \qquad
 {\theta_-\over a^2}+{\theta_+\over b^2}=t.      \tag{6.4}
\]

Thus the same `(b_n,D_n)` can be realized by roots on both sides at any
admissible distances.  For example, for `n>=4`, taking `s=1/(2n)`, `t=1`,
`a=n^2/2`, and `b=n^2` gives `b_n=-1`, `D_n=4n^2`, while both
quotient-metric distances `|n^2-r^2|/r` are `n/sqrt(2)` and both roots lie
outside the `h=1` window.

This construction embeds in every required simple `N`-atom face with
`N>=n`: choose `N-2` further distinct exterior squares with sufficiently
small positive rational weights, subtract their two moment contributions
from `(s,t)`, and use (6.3) for the residual pair.  The strict positivity
conditions in (6.3) persist, and the total moments remain exactly `(s,t)`.

For `s>0`, the one-pole choice

\[
 y=x-{s\over t},\qquad \theta={s^2\over t}        \tag{6.5}
\]

has the same two moments whenever `s/t<x`; for `s<0`, reflect it to
`y=x+|s|/t`.  Hence nonzero same-point data do not force two-sided roots.
When `s=0`, positivity forces roots on both sides but (6.3) lets both
quotient-metric distances be arbitrarily large.

The missing datum for finer localization is an absolute local moment such
as

\[
 \sum_j{\theta_j\over|n^2-y_j|},                  \tag{6.6}
\]

or an equivalent no-cancellation/sector inequality.  The endpoint secant
in Section 3 controls enough total variation for a constant lattice-scale
window, but not for a subunit window.

## 7. Low-index diagnostic and fail-closed stopping line

At `n=O(L)`, the frozen lower bound (4.3) has no useful positive asymptotic
because `log n=O(log L)` while `C_a+A_0=O(lambda log lambda)`.  Exploratory
source-derived finite calculations at `lambda=4,8,16,32` and
`n=round(L)` gave the ratios

\[
 {D_n\over n\{S((n-1)^2)-S((n+1)^2)\}}
 =0.914814,\ 0.963909,\ 0.976306,\ 0.986750.       \tag{7.1}
\]

They approach the root-free secant threshold from below.  These values are
diagnostic only: no artifact is admitted, no rounding enclosure is claimed,
and they prove neither absence nor presence of a root in any window.

Any downstream use must reject a claimed pass if it

1. treats the actual simple-even ground or genuine shifted signs as proved
   on an unbounded schedule;
2. claims that (4.3) activates the criterion at `n=O(L)`;
3. turns the conditional locked tail into one root per gap, two-sided roots,
   or subunit quotient clearance;
4. turns the parity law into an exact root count or a linear root lower
   bound inside the checkpoint-1.33 target intervals;
5. assumes the still-unproved target convergence or a global twisted cone;
6. drops shell branches or divides by `q_0`; or
7. infers response decay or nondecay, determinant convergence, an
   actual-arithmetic sign failure, a new zero theorem, RH, a converse, or a
   `Lambda` bound.

The surviving quantitative problem is a sublattice-scale absolute-moment
or no-cancellation inequality.  The secant theorem closes only the
constant-scale high-tail branch.
