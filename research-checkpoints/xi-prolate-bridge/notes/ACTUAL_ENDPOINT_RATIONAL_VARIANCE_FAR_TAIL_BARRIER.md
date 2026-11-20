# Actual endpoint-rational variance and far-tail barrier

## 0. Exact outcome and claim boundary

Work on the RH-conditional branch and with the actual projected prolate
state at the locked checkpoint-1.40 schedule

\[
 L=2\log\lambda,
 \qquad N=\lceil\lambda L^3\rceil .                  \tag{0.1}
\]

In the cosine convention fixed below, put

\[
 d_N=H_N(\infty)=\sum_{n=0}^Np_n,
 \qquad
 w_\gamma={m_\gamma\sin^2(\gamma L/2)\over\gamma^2},
 \qquad
 S_0=\sum_{\gamma>0}w_\gamma .                       \tag{0.2}
\]

The exact checkpoint-1.40 endpoint quotient is

\[
 (\eta_N^{\rm pr})^2
 ={d_N^2S_0\over D_N},
 \qquad
 D_N=\sum_{\gamma>0}w_\gamma
 \left|H_N\!\left({\gamma L\over2\pi}\right)\right|^2.
                                                               \tag{0.3}
\]

The new exact observation is that the actual source scalar `J_L` determines
the weighted mean of the rational zero rows:

\[
 \boxed{
 \sum_{\gamma>0}w_\gamma
 H_N\!\left({\gamma L\over2\pi}\right)
 =-{\sqrt L\,J_L\over4}.}                            \tag{0.4}
\]

Consequently, on the branch `S_0>0`, define the carrier-continuous weighted
variance by

\[
 \operatorname {Var}_w(H_N)
 ={1\over S_0}\sum_{\gamma>0}w_\gamma
 \left(
 H_N\!\left({\gamma L\over2\pi}\right)
 +{\sqrt L\,J_L\over4S_0}
 \right)^2.                                          \tag{0.5}
\]

Then

\[
 \boxed{
 D_N=S_0\operatorname {Var}_w(H_N)
       +{LJ_L^2\over16S_0},
 \qquad
 (\eta_N^{\rm pr})^2
 ={d_N^2\over
   \operatorname {Var}_w(H_N)+LJ_L^2/(16S_0^2)}.}    \tag{0.6}
\]

Thus the current actual source-Cauchy identities control the mean, not the
variance.  The all-order estimate for `J_L` is itself flat and supplies no
variance floor.  Equations (0.4)--(0.6) therefore do not prove
`eta_N^pr=o(1)`.

There is a second actual-coefficient obstruction.  With

\[
 B_N=\sum_{n=1}^Nn^2|p_n|,
 \qquad
 s_{*,N}^2=N^2+{2B_N\over|d_N|}\quad(d_N\ne0),       \tag{0.7}
\]

coefficientwise absolute control certifies `|H_N(s)|>=|d_N|/2` only for
real `|s|>=s_(\*,N)`.  The actual fixed-mode coefficient asymptotic gives
`B_N` at least a constant times `L^(-1/2)`, while checkpoint 1.40 gives
`d_N=O_A(lambda^(-A))` for every fixed `A`.  Hence `B_N/|d_N|`, and then
`s_(\*,N)`, exceed every fixed power of `lambda` on the nonzero endpoint
branch.  The projective-infinity estimate starts beyond every polynomial
zero-height scale.  A zero count gives no lower bound for the phase-weighted
mass there.

The prolate Sturm--Liouville/Mellin recurrence, ordinary total positivity,
and the first formal correction do not fill this variance gap.  The locked
source is a mixture of two distinct prolate eigenmodes, the relevant Mellin
recurrence shifts complex frequency rather than adjacent real carriers, the
actual rational residues alternate sign, and the first relative correction
is nonuniform at the full cutoff.

This is an unbound theorem-only post-checkpoint-1.40 note/test pair.  It
adds no numerical reconnaissance, zero table, source lock, or serialized
artifact.  The standard eight are unchanged.  It proves neither failure
nor decay of `eta_N^pr`, no actual-arithmetic sign conclusion, no new zeta
zero theorem, no RH implication or converse, and no de Bruijn--Newman
`Lambda` bound.  The formal project state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly four frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/RH_EVEN_DERIVATIVE_RELATIVE_LEAKAGE_COMPARISON_BARRIER.md | 0cf345e6eccd543fa2552848bc79be9b51e0e74217b2947ca9c1ad8cde26479c |
| tests/test_rh_even_derivative_relative_leakage_comparison_barrier.py | 5f70ccb12dfc9892f020551a17bdf516706b353fcd60f18108aa93ca923214d7 |
| notes/CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md | 18828a4599299767b79c8e943131bca4e362219aff8894d099d621c66600b89b |
| tests/test_centered_zero_gram_simultaneous_vertex_subsequence.py | 39ee34b725a27873143e140a3e4ba71489e8deb406eb73bbefde63ecb68fdc0d |
| notes/NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md | baa9a4d07f1bfa2e298efeca5ed8d226c2e991330a2f029f5586380ccb8d5c1c |
| tests/test_natural_cutoff_negative_real_root_exclusion.py | 6b37c98bdb946d6c9236e768d4cf2c00652ecdbf10e221a516ac4454d6680fad |
| notes/FIXED_LAMBDA_GALERKIN_ALIGNMENT_NO_GO.md | a809f361f3939c2f309ad7030b8ef5abd5cf321b443d513d7d0c7087a7f38d34 |
| tests/test_fixed_lambda_galerkin_alignment_no_go.py | 118afd5b57e9d1b0267d00d230526426cc26833bb74d62f98ccf01f7966198c5 |

The checkpoint-1.40 pair supplies the exact rational endpoint quotient,
all-order endpoint flatness, the locked schedule, and the first-correction
nonuniformity.  The centered-zero pair supplies the actual RH cosine
moments, the source scalar identity, and the fixed-mode coefficient
asymptotic.  The natural-cutoff pair pins the secular residue convention
and its alternating-sign obstruction.  The fixed-lambda pair pins the fact
that the locked comparison state combines two distinct prolate eigenmodes
and does not satisfy the source-Cauchy ground recurrence.  No external
source or numerical input is added.

## 2. Carrier convention and exact endpoint quotient

Let `ell=L/2` and use the centered source modes

\[
 \phi_n(x)={(-1)^n\over\sqrt L}e^{2\pi inx/L},
 \qquad
 \phi_n(-\ell)=\phi_n(\ell)=L^{-1/2}.                \tag{2.1}
\]

The real even actual projected prolate state is written

\[
 p_N(x)={1\over\sqrt L}
 \left[p_0+\sum_{n=1}^Np_n(-1)^n
 \cos\!\left({2\pi nx\over L}\right)\right].       \tag{2.2}
\]

Thus its endpoint trace and rational factor are

\[
 d_N=\sqrt L\,p_N(\ell)=\sum_{n=0}^Np_n,
 \qquad
 H_N(s)=p_0+s^2\sum_{n=1}^N{p_n\over s^2-n^2}.      \tag{2.3}
\]

Here `d_N` is the scalar endpoint trace.  Direct integration gives

\[
 \widehat p_N(t)
 ={2\sin(tL/2)\over\sqrt L\,t}
 H_N\!\left({tL\over2\pi}\right),
 \qquad
 \lim_{|s|\to\infty}H_N(s)=d_N.                     \tag{2.4}
\]

At a carrier `s=k` with `1<=k<=N`, `H_N` has its displayed rational pole,
but the product in (2.4) has a finite limit.  In all sums in this note,
the conventions are

\[
 \lim_{s\to k}\sin^2(\pi s)H_N(s)=0,
 \qquad
 \lim_{s\to k}\sin^2(\pi s)H_N(s)^2
 ={\pi^2k^2p_k^2\over4}.                             \tag{2.5}
\]

After restoring `gamma=2*pi*s/L`, the carrier contribution to `D_N` is
`m_gamma*L^2*p_k^2/16`.  These conventions are exactly the continuous
limits of the finite transform; deleting a carrier row would be wrong.
They also explain why a carrier contributes to the second moment but not
to the first moment.

Under the paired RH sampling convention,

\[
 \|h\|_{\mathfrak Z}^2
 =4\sum_{\gamma>0}m_\gamma|\widehat h(\gamma)|^2,
 \qquad
 C_0^2={16\over L}S_0.                               \tag{2.6}
\]

Equations (2.3)--(2.6) give (0.3) with every factor retained.  The branch
`D_N>0` is the same strict branch on which the checkpoint-1.40 quotient is
defined.

## 3. Exact source mean and variance decomposition

Put

\[
 a_n={2\pi n\over L},
 \qquad
 A_n=2\sum_{\gamma>0}m_\gamma
 {1-\cos(\gamma L)\over a_n^2-\gamma^2},
 \qquad
 \sqrt L\,J_L=\sum_{n=0}^Np_nA_n.                   \tag{3.1}
\]

Every resonant summand in `A_n` is interpreted continuously and is zero.
Since `1-cos(gamma*L)=2*sin^2(gamma*L/2)`, one has

\[
 A_0=-4S_0.                                          \tag{3.2}
\]

The rational factor separates its projective-infinity value exactly:

\[
 H_N(s)-d_N
 =\sum_{n=1}^N{n^2p_n\over s^2-n^2}.                \tag{3.3}
\]

For each `n>=1`, absolute convergence and the carrier-continuous
interpretation give

\[
 \begin{aligned}
 \sum_{\gamma>0}w_\gamma
 {a_n^2\over\gamma^2-a_n^2}
 &={A_0-A_n\over4}.
 \end{aligned}                                      \tag{3.4}
\]

Substitute (3.3) into the first moment, use (3.4), and then use
`d_N=p_0+sum_(n>=1)p_n`:

\[
 \begin{aligned}
 \sum_{\gamma>0}w_\gamma H_N(s_\gamma)
 &=d_NS_0+{1\over4}\sum_{n=1}^Np_n(A_0-A_n)\\
 &=d_NS_0+{A_0(d_N-p_0)\over4}
   -{\sqrt L\,J_L-p_0A_0\over4}\\
 &=-{\sqrt L\,J_L\over4},
 \qquad s_\gamma={\gamma L\over2\pi}.
 \end{aligned}                                      \tag{3.5}
\]

This proves (0.4), including its minus sign and factor `1/4`.  Completing
the square around the weighted mean

\[
 \overline H_w=-{\sqrt L\,J_L\over4S_0}             \tag{3.6}
\]

proves (0.6).  At a carrier, the cross term in the square vanishes by the
first limit in (2.5), while the square retains the second limit.  Hence the
variance identity also includes exact carriers.

Cauchy--Schwarz recovers only

\[
 D_N\geq{LJ_L^2\over16S_0}.                          \tag{3.7}
\]

This is sharp when all active row values are constant.  The admitted
estimate `J_L=O_A(lambda^(-A))` is an upper bound for the mean, not a lower
bound for `D_N`.  It cannot be divided into the endpoint without a new
relative theorem, and it gives no lower bound for
`Var_w(H_N)`.

## 4. Projective infinity is superpolynomially far in absolute coefficient control

For real `|s|>N`, (3.3) gives the source-specific coefficient bound

\[
 \boxed{
 |H_N(s)-d_N|
 \leq\sum_{n=1}^N{n^2|p_n|\over s^2-n^2}
 \leq{B_N\over s^2-N^2}.}                            \tag{4.1}
\]

Therefore, if `d_N` is nonzero and

\[
 s^2\geq N^2+{2B_N\over|d_N|},                      \tag{4.2}
\]

then

\[
 |H_N(s)|\geq{|d_N|\over2}.                         \tag{4.3}
\]

This is an actual-prolate-compatible obstruction, not a generic rational
counterexample.  For every fixed positive mode, the admitted actual
coefficient asymptotic is

\[
 \sqrt L\,p_n\longrightarrow2(-1)^nC,
 \qquad C={\Xi(0)\over4}>0.                          \tag{4.4}
\]

In particular, for all sufficiently large `lambda`,

\[
 B_N\geq|p_1|\geq{c\over\sqrt L}                    \tag{4.5}
\]

for some fixed `c>0`.  Checkpoint 1.40 proves

\[
 |d_N|=O_A(\lambda^{-A})
 \qquad\hbox{for every fixed }A>0.                   \tag{4.6}
\]

On the branch `d_N!=0`, (4.5)--(4.6) imply, for every fixed `K>0`,

\[
 {B_N\over|d_N|\lambda^K}\longrightarrow\infty,
 \qquad
 {s_{*,N}\over\lambda^K}\longrightarrow\infty.    \tag{4.7}
\]

The second conclusion uses the first with exponent larger than `2K`.
Since the physical height is `T=2*pi*s/L`, the corresponding threshold

\[
 T_{*,N}={2\pi\over L}
 \left(N^2+{2B_N\over|d_N|}\right)^{1/2}             \tag{4.8}
\]

also exceeds every fixed power of `lambda`.

For completeness, let

\[
 S_{\rm tail}(T)=
 \sum_{\substack{\gamma>0\\\gamma\geq T}}w_\gamma.
                                                               \tag{4.9}
\]

If `S_tail(T_(\*,N))>0`, then (4.3) gives the exact conditional estimate

\[
 D_N\geq{d_N^2\over4}S_{\rm tail}(T_{*,N}),
 \qquad
 (\eta_N^{\rm pr})^2
 \leq{4S_0\over S_{\rm tail}(T_{*,N})}.             \tag{4.10}
\]

This is not a decay bound: a zero count controls unweighted tail size from
above after partial summation, whereas (4.10) needs a lower bound for the
phase weight `sin^2(gamma*L/2)` at a superpolynomial moving height.  No such
lower bound is frozen.  If `d_N=0` and `D_N>0`, then (0.3) gives
`eta_N^pr=0` directly and no threshold is needed.

## 5. Why the prolate Mellin recurrence does not close the gap

Let `Y_j` be a regular prolate Sturm--Liouville mode on `[0,1]`:

\[
 -{d\over dz}\left((1-z^2)Y_j'(z)\right)
 +c^2z^2Y_j(z)=\chi_jY_j(z),
 \qquad
 M_j(s)=\int_0^1Y_j(z)z^{s-1}\,dz.                  \tag{5.1}
\]

For `Re(s)>2`, two integrations by parts have no boundary term and give

\[
 \boxed{
 c^2M_j(s+2)+\{s(s-1)-\chi_j\}M_j(s)
 -(s-1)(s-2)M_j(s-2)=0.}                            \tag{5.2}
\]

The locked source comparison is a nontrivial combination of labels `4`
and `0`.  Writing

\[
 Y=a_4Y_4-a_0Y_0,
 \qquad
 M=a_4M_4-a_0M_0,
 \qquad
 a_0a_4\ne0,
 \qquad
 \chi_4\ne\chi_0,                                  \tag{5.3}
\]

the common left side without an eigenvalue becomes

\[
 \begin{aligned}
 c^2M(s+2)+s(s-1)M(s)
 -(s-1)(s-2)M(s-2)
 =a_4\chi_4M_4(s)-a_0\chi_0M_0(s).
 \end{aligned}                                      \tag{5.4}
\]

There is no scalar `chi` that turns the right side into `chi*M(s)`:
nonzero independence would require both `chi=chi_4` and `chi=chi_0`.
Thus even before the arithmetic transform, the actual mixed source has no
closed scalar three-term Mellin recurrence.

There is also a geometry mismatch.  Under the logarithmic Fourier
parameterization `s=1/2-it`, the shifts `s->s+/-2` in (5.2) are vertical
complex-frequency shifts `t->t+/-2i`; they are not the adjacent real
carrier shifts `n->n+/-1` in `H_N`.  After the arithmetic transform, every
fixed formal correction has the form

\[
 \widehat G_j(t)=Q_j(t^2)\Xi(t),                     \tag{5.5}
\]

so it vanishes at every actual zero of `Xi`.  The finite-window and
projection remainder, not the pure prolate recurrence, supplies the
values of `H_N(s_gamma)` in (0.3).  Fixed zero rows and the endpoint are
flat to every fixed algebraic order, while the moving high rows are not
uniformly controlled.  Equation (5.2) therefore yields neither a sign nor
a lower square sum for the variance in (0.6).

## 6. Alternating residues block the direct Stieltjes and total-positivity routes

The projective form is

\[
 H_N(s)=d_N+\sum_{n=1}^N{n^2p_n\over s^2-n^2}.       \tag{6.1}
\]

A direct Stieltjes/Herglotz secular argument would require the residues
`n^2*p_n` to have one sign, up to one global reversal.  Equation (4.4)
instead gives, eventually,

\[
 p_1p_2<0,
 \qquad
 (1^2p_1)(2^2p_2)<0.                                \tag{6.2}
\]

Hence the actual projected prolate secular function is not the Cauchy
transform of a positive discrete measure.  Positive-measure orthogonal
polynomials, Herglotz interlacing, and the corresponding ordinary
total-positivity argument do not apply directly.

Nor can one ignore the poles.  Total positivity of a Cauchy kernel is a
sign-regular statement on a consistently ordered pole-free rectangle.
The full actual zero-row family moves through the carrier pole set
`1,...,N`; at an exact carrier its transform row is a finite coordinate
limit as in (2.5).  There is no single positive diagonal conjugation that
both removes the alternating residues and keeps the whole moving row
family in one such rectangle.  This rules out only the direct
Stieltjes/ordinary-total-positivity inference.  It is not a theorem that
every possible signed or block total-positivity method must fail.

## 7. First-correction nonuniformity at the locked schedule

The first formal prolate correction satisfies

\[
 \widehat G_1(t)={2t^2-21\over128\pi}\Xi(t),
 \qquad
 {\lambda^{-2}\widehat G_1(t)\over\widehat K_\infty(t)}
 ={2t^2-21\over32\pi\lambda^2}                      \tag{7.1}
\]

away from zeros of `Xi`.  At the actual Fourier edge,

\[
 \Omega_N={2\pi N\over L}\sim2\pi\lambda L^2,      \tag{7.2}
\]

and the leading relative size is

\[
 {2\Omega_N^2\over32\pi\lambda^2}
 \sim{\pi\over4}L^4.                                \tag{7.3}
\]

It is not `o(1)`.  Thus a fixed-order central expansion cannot be used as a
uniform relative approximation over all zero rows visible to the locked
cutoff.  At a zero of `Xi`, both terms displayed in (7.1) vanish, so the
quotient there cannot be read by cancellation; the finite projection
remainder must be estimated separately.  This is consistent with, and does
not strengthen, the mean-only conclusion in Section 3.

## 8. Exact missing theorem

On a sequence with `S_0>0`, `D_N>0`, and `d_N!=0`, equation (0.6) shows
that the desired endpoint estimate is exactly

\[
 \eta_N^{\rm pr}=o(1)
 \quad\Longleftrightarrow\quad
 {\operatorname {Var}_w(H_N)+LJ_L^2/(16S_0^2)
  \over d_N^2}\longrightarrow\infty.                \tag{8.1}
\]

Equivalently, in the checkpoint-1.40 sampling norm, one needs

\[
 {D_N\over d_N^2S_0}\longrightarrow\infty,
 \qquad\hbox{or}\qquad
 {\|p_N\|_{\mathfrak Z}\over|d_N|C_0}\longrightarrow\infty.
                                                               \tag{8.2}
\]

The frozen source identities supply the exact mean in (0.4); they do not
supply (8.1) or (8.2).  A successful continuation must add an oriented
high-frequency projection-tail or Stokes theorem, or an actual
phase-weighted zero-frame lower bound, that controls the variance relative
to the endpoint.  Nothing in this note proves that such a theorem is false.
