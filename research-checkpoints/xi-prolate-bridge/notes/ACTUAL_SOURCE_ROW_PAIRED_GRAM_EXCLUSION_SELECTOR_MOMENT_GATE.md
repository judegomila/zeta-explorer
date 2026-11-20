# Actual source-row paired-Gram exclusion and selector-moment gate

## 0. Exact outcome and claim boundary

The growing paired-root Gram family of
`GLOBAL_TWISTED_MASS_STRICT_RITZ_SOURCE_CAUCHY_BARRIER.md` cannot be an
actual pinned prime-power/archimedean matrix on the locked schedule

\[
 L=2\log\lambda,
 \qquad N=2^{9600\lambda^2}.                         \tag{0.1}
\]

Its edge source coefficient obeys

\[
 -b_N^{\mathrm G}\geq {1\over\epsilon}
 +\log {N+\epsilon\over1+\epsilon},                \tag{0.2}
\]

whereas the actual source lock gives
`|b_N^{act}|<=B_b(lambda)=O(lambda log lambda)`.  Since
`log N=9600(log 2)lambda^2`, these statements are incompatible for all
sufficiently large locked parameters.  This is the first scalar-shift invariant
arithmetic obstruction to that structural counterfamily.

There is also an exact positive selector-moment representation for any
actual shifted source matrix satisfying the global twisted cone and both
strict lower-Ritz signs.  It reduces the remaining positive route to a
specific missing inequality on the positive selector weights.  The frozen
diagonal, Toeplitz, and PNT estimates do not provide that inequality.  In
particular, the available central quadratic gives only a root-distance
bound of order

\[
 N\sqrt{{\log\lambda\over\lambda}},                \tag{0.3}
\]

which is much larger than one and therefore gives no two-step quotient-root
separation.

This note excludes one auxiliary Gram family from the actual source.  It
does not disprove the actual global twisted cone, either actual strict sign,
an actual mass-to-anchor bound, actual root separation, ground convergence,
response decay, determinant convergence, any zero statement, the Riemann
hypothesis, its converse, or a de Bruijn--Newman `Lambda` bound.  The formal
state remains `P0_INVALIDATED`; the standard eight are unchanged.

## 1. Frozen inputs

Only the following repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/SOURCE_CAUCHY_SELECTOR_CONE_PROJECTIVE_TRADEOFF.md` | `e624c94412a3266de20161e30d7c130d9bcd623affa4b24d9558a0fa88e8fc26` |
| `tests/test_source_cauchy_selector_cone_projective_tradeoff.py` | `f0314d289ec750c0668d4dab30a5fe34c63cc7b2577830c35aecf2b1650605ee` |
| `notes/FULL_SOURCE_CAUCHY_ANCHOR_FORCING_FEASIBILITY.md` | `e54cb3b5d79f8dc8bf6188ae1168d7c18fb6cec07e4d92de83510d8f6e523928` |
| `tests/test_full_source_cauchy_anchor_forcing_feasibility.py` | `63619da4265edbbfebcd96a27f549a43872dcd2eb24b5a9f455cf8dedb58b37b` |
| `notes/EVEN_GROUND_COEFFICIENT_CONE_AUDIT.md` | `8599690f41785c7317c2f3627ef992dba4f3b1576e2fa3ce0ab6e204514ecc94` |
| `tests/test_ground_jet_weyl_coefficient_cone_source_lock.py` | `d30f8e340fa20b8f4ac12afcd056d544e35b7a6708166053f85128de92140e55` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |
| `notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md` | `ac50057befa429894ba1498869a602324489f34aa5795e2d39cfc62bd549df73` |
| `notes/LOWER_RITZ_DANGEROUS_RESPONSE_ARITHMETIC_KREIN_RH_GATE_THEOREM.md` | `f0fd4065d6f1bafe8c119f5fcd3efe963e0da70cfe4871d3a26338f2016e2d1e` |
| `tests/test_lower_ritz_dangerous_response_arithmetic_krein_rh_gate_theorem.py` | `c9ee7fee05841b7831f9dfd3a6d5bb0bdd3431696e9122203c34e9ee9d041773` |
| `notes/FIXED_PREFIX_EDGE_SIGN_SYNCHRONIZATION.md` | `38079afb3f5f319d0ca29eeb6cfd827ff77af7589582f8f083296d92ce6fe773` |
| `tests/test_fixed_prefix_edge_sign_synchronization.py` | `0da34a29118fb63f38f601a63c90986fa452d4dc7d6b50f65218f8b7a75f885f` |
| `notes/GLOBAL_TWISTED_MASS_STRICT_RITZ_SOURCE_CAUCHY_BARRIER.md` | `1611454641341aa48f94caa1b1e1e14eb9abbe6eca4945b3bceffd359e66c034` |
| `tests/test_global_twisted_mass_strict_ritz_source_cauchy_barrier.py` | `e258c239a4d5291d8a92fd1699893e42b3d9af2ade515a7b12dc264c4b260a14` |

The selector-cone and anchor-feasibility theorems give the positive atomic
classification.  The coefficient-cone theorem or, equivalently, the
positive parity pencil puts the selector roots on the positive squared-root
axis.  The high-Fourier theorem supplies the actual source and diagonal
bounds.  The locked graph note supplies the explicit zero-mode bound.  The
arithmetic Krein note fixes (0.1) and the cancellation-preserving PNT
resolvent.  The fixed-prefix theorem is used only to distinguish a fixed
prefix from the global cone.  The last pair is the family excluded below.

## 2. Exact actual source envelopes

The pinned source matrix has

\[
 Q_{nn}=a_n,
 \qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad b_{-n}=-b_n.                               \tag{2.1}
\]

Put

\[
 \sigma_L=\log {L\over2\tanh(L/2)},                \tag{2.2}
\]

\[
 \begin{split}
 C_a(\lambda)={}&{8(\lambda+\lambda^{-1}-2)\over L}
 +\lambda+2\sigma_L+4L(\lambda-1),\\
 B_b(\lambda)={}&{2(\lambda-\lambda^{-1})\over\pi}
 +{1\over4}+{1\over2\pi^2}
 +{\lambda-1+\sigma_L\over2\pi}
 +{2L(\lambda-1)\over\pi}.
 \end{split}                                                   \tag{2.3}
\]

The frozen elementary estimates are

\[
 \boxed{|b_n^{\mathrm{act}}|\leq B_b(\lambda)}      \tag{2.4}
\]

for every retained mode, and, for `n!=0`,

\[
 \boxed{
 a_n^{\mathrm{act}}\geq\log {|n|\over2}
 -{1\over2\pi|n|}-C_a(\lambda).}                  \tag{2.5}
\]

Both constants are explicit.  On the locked schedule,

\[
 {B_b(\lambda)\over\lambda^2}\longrightarrow0,
 \qquad
 {C_a(\lambda)\over\lambda^2}\longrightarrow0.   \tag{2.6}
\]

No PNT is needed for (2.4)--(2.6); they retain every prime power through the
inclusive endpoint `lambda^2`.

## 3. The paired Gram fails the source row first

Fix `0<epsilon<1`, take even `N`, and put

\[
 \rho_k=k+(-1)^{k+1}\epsilon\quad(1\leq k\leq N).
                                                               \tag{3.1}
\]

The paired Gram family has

\[
 b_n^{\mathrm G}=-\sum_{k=1}^N
 \left({1\over n-\rho_k}+{1\over n+\rho_k}\right)
 =-2n\sum_{k=1}^N{1\over n^2-\rho_k^2}.           \tag{3.2}
\]

Every denominator in the first expression at `n=N` is positive.  The
`k=N` direct term is `epsilon^(-1)`.  With `j=N-k`, the remaining direct
terms satisfy

\[
 {1\over N-\rho_k}\geq {1\over j+\epsilon}.
                                                               \tag{3.3}
\]

The reflected terms are also positive, and the integral comparison gives

\[
 \boxed{
 -b_N^{\mathrm G}
 \geq {1\over\epsilon}+\sum_{j=1}^{N-1}{1\over j+\epsilon}
 \geq {1\over\epsilon}
 +\log {N+\epsilon\over1+\epsilon}.}              \tag{3.4}
\]

At `N=2^(9600 lambda^2)`, equations (2.4), (2.6), and (3.4) imply

\[
 \liminf { -b_N^{\mathrm G}\over\lambda^2}
 \geq9600\log2,
 \qquad
 {B_b(\lambda)\over\lambda^2}\longrightarrow0.   \tag{3.5}
\]

Thus `b_N^G` cannot equal the pinned `b_N^act` eventually.

There is a second, non-invariant mismatch.  The Gram diagonal obeys

\[
 \begin{split}
 a_N^{\mathrm G}
 &=\sum_{k=1}^N\left\{{1\over(N-\rho_k)^2}
                    +{1\over(N+\rho_k)^2}\right\}\\
 &\leq {1\over\epsilon^2}
 +2\left\{{1\over(1-\epsilon)^2}+{1\over1-\epsilon}\right\}.
 \end{split}                                                   \tag{3.6}
\]

while (2.5) grows like `9600(log 2)lambda^2`.  A scalar multiple of the
identity can repair a diagonal comparison while translating the ground and
Ritz values together.  It cannot alter (3.2).  The source row is therefore
the earlier invariant exclusion.

## 4. Positive quotient-root selector representation

Now assume the actual two strict lower-Ritz sector signs, a simple
boundary-normalized even ground

\[
 \Phi=\sum_{n=-N}^N\xi_nV_n,
 \qquad \sum_n\xi_n=1,                              \tag{4.1}
\]

and the global strict twisted cone

\[
 (-1)^n\xi_n>0\quad(-N\leq n\leq N).              \tag{4.2}
\]

Let `mu` be the ground value and `T=Q-mu I`.  Then `T` is positive
semidefinite with simple even kernel `R Phi` and positive odd block.  The
positive selector-face theorem and the positive coefficient cone give `N`
distinct positive quotient roots `r_1,...,r_N`.  Conditions (4.1)--(4.2)
exclude the zero, lattice-coordinate, and projective-infinity atoms.  With

\[
 v(r)_n={1\over n-r},                              \tag{4.3}
\]

there are unique weights `theta_j>0`, up to permutation of the roots, such
that

\[
 \boxed{
 T=\sum_{j=1}^N\theta_j
 \{|v(r_j)\rangle\langle v(r_j)|
   +|v(-r_j)\rangle\langle v(-r_j)|\}.}            \tag{4.4}
\]

The normalization in (4.3) fixes the weights.  Positivity is essential:
the even selector cone is a moment cone, annihilation forces every atom
onto a root of the ground polynomial, and simple rank `N` forces every
distinct root to occur with positive weight.  The even block determines
the full source-Cauchy extension uniquely.

Define the positive atomic rational function

\[
 S(x)=\sum_{j=1}^N{\theta_j\over x-r_j^2}.          \tag{4.5}
\]

Reading the source row and diagonal of (4.4) gives the exact moment system

\[
 \boxed{
 b_n^{\mathrm{act}}=-2nS(n^2)
 =-2n\sum_j{\theta_j\over n^2-r_j^2},}             \tag{4.6}
\]

\[
 \boxed{
 a_n^{\mathrm{act}}-\mu
 =2\sum_j{\theta_j(n^2+r_j^2)\over(n^2-r_j^2)^2}.} \tag{4.7}
\]

Equivalently, for `n!=0`,

\[
 \boxed{
 -S'(n^2)={a_n^{\mathrm{act}}-\mu-b_n^{\mathrm{act}}/n
                    \over4n^2}.}                  \tag{4.8}
\]

At the central coordinate,

\[
 \boxed{
 q_0:=a_0^{\mathrm{act}}-\mu
 =2\sum_j{\theta_j\over r_j^2}.}                  \tag{4.9}
\]

Here `q_0` is the shifted quadratic of the central Fourier coordinate
`V_0`.  It is not the Rayleigh quadratic of the projected prolate anchor
used by the lower-Ritz construction; transferring a bound between those
two anchors would require a separate theorem.

The `theta_j` are metric atom weights, not the ground residues `xi_n`.
Neither positivity nor the global cone supplies a lower bound for an
individual `theta_j` in terms of `p=xi_0`.

## 5. Exact localization inequality and its scale failure

Put

\[
 D_n=a_n^{\mathrm{act}}-\mu-{b_n^{\mathrm{act}}\over n}
 =4n^2\{-S'(n^2)\}>0.                              \tag{5.1}
\]

Equations (4.8)--(4.9) express `-S'(n^2)` as a weighted average:

\[
 -S'(n^2)=\sum_j{\theta_j\over r_j^2}
 {r_j^2\over(n^2-r_j^2)^2}.                       \tag{5.2}
\]

Therefore some quotient root satisfies

\[
 \boxed{
 \min_j{|n^2-r_j^2|\over r_j}
 \leq n\sqrt{{2q_0\over D_n}}.}                   \tag{5.3}
\]

This is the quantitative information actually supplied by the central
selector moment.  It is not enough on the locked schedule.  Let

\[
 \begin{split}
 A_0(\lambda)={}&4(\lambda-\lambda^{-1})
 +|\gamma+\log(4\pi)|+\lambda+\log\coth(L/2)\\
 &+4L(\lambda-1).
 \end{split}                                                   \tag{5.4}
\]

The frozen zero-mode calculation gives `|a_0|<=A_0(lambda)`.  Combining
this with the diagonal lower bound and the off-diagonal norm
`c_lambda=2*pi*B_b(lambda)` gives

\[
 \mu\geq-\max\left\{A_0(\lambda),
 C_a(\lambda)+\log2+{1\over2\pi}\right\}-c_\lambda,
                                                               \tag{5.5}
\]

and hence

\[
 0<q_0\leq A_0(\lambda)
 +\max\left\{A_0(\lambda),
 C_a(\lambda)+\log2+{1\over2\pi}\right\}+c_\lambda
 =O(\lambda\log\lambda).                          \tag{5.6}
\]

Since `mu<=a_0`, the edge derivative denominator also has the lower bound

\[
 D_N\geq\log{N\over2}-{1\over2\pi N}-C_a(\lambda)
 -A_0(\lambda)-{B_b(\lambda)\over N}
 \asymp\lambda^2.                                  \tag{5.7}
\]

Substitution in (5.3) yields only

\[
 \min_j{|N^2-r_j^2|\over r_j}
 =O\left(N\sqrt{{\log\lambda\over\lambda}}\right).
                                                               \tag{5.8}
\]

This does not put a root in a unit neighborhood of `N`.  For (5.3) alone
to give a half-unit neighborhood, one would need

\[
 {q_0\over D_N}<{1\over8N^2}.                     \tag{5.9}
\]

For the `O(1/log N)` clearance needed by the paired product mechanism to
control a harmonic mass accumulation, one would need the still stronger
scale

\[
 {q_0\over D_N}=O\left({1\over N^2\log^2N}\right). \tag{5.10}
\]

No frozen actual theorem supplies (5.9), (5.10), an equivalent lower bound
on the individual `theta_j`, or a growing-uniform bijection between roots
and their alternating lattice neighborhoods.

## 6. Why the ground equation, PNT, and fixed prefix stop

Under (4.2), write `w_n=(-1)^n xi_n>0` and `p=xi_0`.  The central row of
`T Phi=0` is exactly

\[
 \boxed{
 q_0p+2\sum_{n=1}^N(-1)^n{b_n^{\mathrm{act}}\over n}w_n=0.}
                                                               \tag{6.1}
\]

This is one signed harmonic moment.  The absolute source envelope gives
only

\[
 q_0p\leq2B_b(\lambda)\sum_{n=1}^N{w_n\over n},   \tag{6.2}
\]

not an upper bound for `1+2 sum(w_n)/p`.  The structural family already
shows the distinction: a profile comparable to `w_n/p=c/n` has divergent
total mass but a convergent harmonic moment.

The exact PNT resolvent keeps the signed discrepancy inside both the
forcing and the inverse.  Its current absolute envelopes and Toeplitz
floors do not control the positive selector weights relative to `p`, do not
improve (5.6) by the factor `N^(-2)`, and do not orient the signed sum in
(6.1).  A fixed-prefix alternation theorem is also insufficient: it has no
growing prefix rate comparable with the locked cutoff and does not sign the
moving tail.

Thus the actual source row rigorously excludes the checkpoint-1.31 Gram
family, but the general actual positive-selector problem remains open.  Its
earliest quantitative gate is a growing-uniform anchor-weighted moment or
atom-weight inequality strong enough to upgrade (5.3) to disjoint
alternating root neighborhoods and then control the ground-residue product.

## 7. Locked conclusion

The paired-root Gram counterfamily is not an actual arithmetic
counterexample: it violates the pinned source coefficient before its mass
mechanism can be transferred.  Conversely, the actual source envelopes do
not yet prove a mass-to-anchor or quotient-separation theorem.  The exact
remaining finite data are the positive moment equations (4.6)--(4.9), and
the missing growing-uniform input is (5.9), (5.10), or a comparably strong
arithmetic control of the selector weights.
