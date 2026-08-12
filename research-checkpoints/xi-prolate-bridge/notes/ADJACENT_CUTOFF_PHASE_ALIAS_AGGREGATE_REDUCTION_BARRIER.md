# Adjacent-cutoff phase-alias aggregate reduction and barrier

## 0. Exact outcome and claim boundary

Fix one carrier lattice

\[
 h={2\pi\over L},\qquad t_j=jh.                       \tag{0.1}
\]

For an ideal arithmetic source, let `E_j` be its alternating endpoint
tail and let `C_(j,gamma)` be the corresponding alternating Cauchy row.
This note proves the two exact adjacent-cutoff recurrences

\[
 Z_j=e_j+r_je_{j+1},\qquad
 K_{j,\gamma}Z_j=c_{j,\gamma}+r_jc_{j+1,\gamma},
 \qquad K_{j,\gamma}={\gamma^2\over\gamma^2-t_j^2}.   \tag{0.2}
\]

Their squared form repairs the same-index defect in the separate
identities: the cutoff with large endpoint need not be the cutoff with a
large row, but the sum over both adjacent cutoffs controls both quantities
on the same block.  With an explicit microscopic zero profile, the exact
consequence is

\[
 \sum_{n\in J^+}D_n^{\rm id}
 \geq {h^{-2}\over18B_u\max(1,r_+^2)}
 \sum_{j\in J}|Z_j|^2S_j^{\rm ph}.                  \tag{0.3}
\]

Here `B_u<=2` is the profile-overlap constant, `S_j^ph` is a
dimensionless phase-weighted local zero sum, and `D_n^id` is the complete
normalized ideal row energy.  If, on the same block, one has

\[
 \sum_{j\in J}|Z_j|^2S_j^{\rm ph}
 \geq\kappa_{\rm ph}\sum_{j\in J}|Z_j|^2,
 \qquad
 0<\sum_{n\in J^+}|e_n|^2
 \leq C_E\sum_{j\in J}|Z_j|^2,                       \tag{0.4}
\]

then some one cutoff in `J^+` obeys

\[
 {D_n^{\rm id}\over|e_n|^2}
 \geq {\kappa_{\rm ph}\over
 18B_u\max(1,r_+^2)C_E}h^{-2}.                       \tag{0.5}
\]

The zero-endpoint branch is interpreted separately.  When `L/log T` stays
between two positive constants, (0.5) is a `c*(log T)^2` ideal quotient.
The factors `q_L`, the positive arithmetic envelope, the phase, and the
row factor `gamma^(-2)` are all retained below.  Under the frozen
operator-relative Stokes interface, the same aggregate inequality transfers
to the actual finite-prolate quotient, with the exact Hilbert-space loss.
It would imply

\[
 (\eta_N^{\rm pr})^2=O((\log T)^{-2})                 \tag{0.6}
\]

at a cutoff which also satisfies the finite strict gates.

The note does **not** prove the two hypotheses in (0.4) for the actual
Hardy source.  More sharply, the phase-weighted first hypothesis is not a
routine discretization of continuous weighted one-level density.  In the
usual zero-spacing coordinate, multiplication by
`sin^2(gamma*L/2)` shifts Fourier support exactly onto the first positive
and negative Poisson aliases of the carrier lattice.  Bettin--Fazzari's
continuous `k=1` theorem and Gonek's shifted-zero second moment do not
compute those discrete aliases.

Three gates are therefore kept separate and unproved:

1. a discrete shrinking-progression, phase-weighted `k=1` theorem which
   controls the first carrier aliases, together with the required
   below-Nyquist endpoint-frame estimate;
2. operator-relative ideal-to-main and exterior Stokes transfer in the
   normalized endpoint/row block norms;
3. intersection of the cutoff selected by the block inequality with the
   finite simple-ground, boundary, shifted-sign, and reserve gates.

This is an unbound post-checkpoint-1.44 theorem/barrier note/test pair.  It
changes no standard eight file and adds no serialized numerical artifact.
It proves no actual phase-weighted one-level theorem, no actual
Hardy--Cauchy inequality, no actual finite strict gate, no decay of
`eta_N^pr`, no arithmetic sign, no new zeta-zero theorem, no RH implication
or converse, and no de Bruijn--Newman `Lambda` bound.  The formal state
remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/JOINT_HARDY_CAUCHY_PHASE_ENERGY_NONCONCENTRATION_BARRIER.md | 69b985d600f1a9cc5f3522ddaa6a4d4a242e9e3f9907a7deed0abe93e06039d7 |
| tests/test_joint_hardy_cauchy_phase_energy_nonconcentration_barrier.py | 5b38f27de63a5b972a2daec330cfeb895f66a2d7eb691ed6c8691c6e312c51ab |
| notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md | aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6 |
| tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py | 6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6 |
| notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md | ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f |
| tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py | e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d |

The first pair isolates the original endpoint-energy nonconcentration
gate and its correct-density local countermodel.  The second supplies the
carrier-safe actual interface, the factor `q_L`, and the exact Hilbert
transfer constants.  The third proves the `O(L)` adaptive schedule and
shows that adjacent finite strict gates are not inherited.  No continuous
one-level density theorem is imported as a discrete theorem.

## 2. Source normalization and exact adjacent recurrences

Fix a finite consecutive block

\[
 J=\{M,M+1,\ldots,M+R-1\},\qquad
 J^+=J\cup\{M+R\}.                                   \tag{2.1}
\]

Write `f_j=f(t_j)`.  Assume that the following tails converge absolutely,
or are Abel limits for which an index shift is valid:

\[
 \begin{aligned}
 E_j&=\sum_{k\geq0}(-1)^kf_{j+k},\\
 C_{j,\gamma}&=\sum_{k\geq0}(-1)^kf_{j+k}
 {\gamma^2\over\gamma^2-t_{j+k}^2}.
 \end{aligned}                                       \tag{2.2}
\]

Only noncarrier rows `gamma!=t_(j+k)` are used in (2.2).  Carrier rows in
the actual finite transform have the separate continuous convention of the
frozen interface.

Let `A_j>0` be an envelope and define

\[
 f_j=A_jZ_j,\qquad E_j=A_je_j,\qquad
 C_{j,\gamma}=A_jc_{j,\gamma},\qquad
 r_j={A_{j+1}\over A_j}.                              \tag{2.3}
\]

The only envelope assumptions in the normalized block theorem are

\[
 0<r_-\leq r_j\leq r_+<\infty\qquad(j\in J).          \tag{2.4}
\]

For the Hardy--Xi envelope on a fixed microscopic carrier block one expects
`r_j=1+O(1/L)` after the declared leading exponential is removed, but no
such asymptotic is used in the algebra.

Splitting off the `k=0` term and shifting the remaining sum proves

\[
 \boxed{E_j+E_{j+1}=f_j,\qquad
 C_{j,\gamma}+C_{j+1,\gamma}
 =f_j{\gamma^2\over\gamma^2-t_j^2}.}                 \tag{2.5}
\]

Dividing by `A_j` gives exactly (0.2).  The elementary inequality
`|a+b|^2<=2(|a|^2+|b|^2)` then gives the same-index pair estimate

\[
 \boxed{
 |c_{j,\gamma}|^2+r_j^2|c_{j+1,\gamma}|^2
 \geq {1\over2}|K_{j,\gamma}|^2|Z_j|^2.}             \tag{2.6}
\]

The corresponding endpoint identity alone gives

\[
 |e_j|^2+r_j^2|e_{j+1}|^2\geq{1\over2}|Z_j|^2,       \tag{2.7}
\]

but (2.7) is a lower bound on endpoint energy.  The upper frame bound in
(0.4) is independent information; it cannot be reversed from (2.7).

## 3. Microscopic profiles and the aggregate row theorem

Let `Gamma_all` be the multiset of positive zero ordinates, with
algebraic multiplicity `m_gamma`, and put

\[
 \Gamma=\{\gamma\in\Gamma_{\rm all}:\gamma/h\notin\mathbb Z\}. \tag{3.1}
\]

Thus every ideal Cauchy tail below is defined.  Exact carrier ordinates are
omitted only from the ideal lower bound; the frozen actual
carrier-continuous rows are nonnegative and remain in the complete actual
denominator.  For `j in J` put

\[
 \Delta_{j,\gamma}=t_j-\gamma,\qquad
 y_{j,\gamma}={\Delta_{j,\gamma}\over h}.             \tag{3.2}
\]

Choose numbers `0<a<b<infinity` and profile weights

\[
 0\leq u_{j,\gamma}\leq1,\qquad
 u_{j,\gamma}=0\quad\hbox{unless}\quad
 a\leq|y_{j,\gamma}|\leq b.                          \tag{3.3}
\]

Extend `u_(j,gamma)` by zero for `j` outside `J`, and assume the explicit
pair-overlap bound

\[
 B_u:=\sup_{n,\gamma}
 \{u_{n,\gamma}+u_{n-1,\gamma}\}<\infty.
 \qquad\hbox{In particular, }B_u\leq2.                \tag{3.4}
\]

Define the dimensionless phase profile sum and its raw source energy by

\[
 \begin{aligned}
 S_j^{\rm ph}
 &=\sum_{\gamma\in\Gamma}m_\gamma u_{j,\gamma}
 {\sin^2(\pi y_{j,\gamma})\over y_{j,\gamma}^2},\\
 \mathcal R_J^{\rm ph}
 &=\sum_{j\in J}|Z_j|^2S_j^{\rm ph}.
 \end{aligned}                                       \tag{3.5}
\]

The exact carrier relation gives

\[
 \sin^2\left({\gamma L\over2}\right)
 =\sin^2\left({\Delta_{j,\gamma}L\over2}\right)
 =\sin^2(\pi y_{j,\gamma}).                          \tag{3.6}
\]

For a carrier-labelled cutoff `n`, define its complete normalized ideal
row energy

\[
 D_n^{\rm id}=\sum_{\gamma\in\Gamma}m_\gamma
 {\sin^2(\gamma L/2)\over\gamma^2}
 |c_{n,\gamma}|^2,                                   \tag{3.7}
\]

and define the block-induced microscopic energy

\[
 D_n^{\rm micro}=\sum_{\gamma\in\Gamma}m_\gamma
 \{u_{n,\gamma}+r_{n-1}^2u_{n-1,\gamma}\}
 {\sin^2(\gamma L/2)\over\gamma^2}
 |c_{n,\gamma}|^2.                                   \tag{3.8}
\]

At the left boundary the term containing `r_(n-1)` is zero.  From
(2.6), summation first in `gamma` and then in `j` gives the exact identity
and lower bound

\[
 \begin{aligned}
 \sum_{n\in J^+}D_n^{\rm micro}
 &=\sum_{j\in J}\sum_{\gamma\in\Gamma}m_\gamma
 u_{j,\gamma}{\sin^2(\gamma L/2)\over\gamma^2}
 \{|c_{j,\gamma}|^2+r_j^2|c_{j+1,\gamma}|^2\}\\
 &\geq{1\over2}\sum_{j\in J}|Z_j|^2
 \sum_{\gamma\in\Gamma}m_\gamma u_{j,\gamma}
 {\sin^2(\gamma L/2)\over\gamma^2}|K_{j,\gamma}|^2.
 \end{aligned}                                       \tag{3.9}
\]

For `|Delta_(j,gamma)|<=t_j/4`, direct cancellation of the `gamma` factor
gives

\[
 {\sin^2(\gamma L/2)\over\gamma^2}|K_{j,\gamma}|^2
 ={\sin^2(\gamma L/2)\over\Delta_{j,\gamma}^2}
 \left({\gamma\over\gamma+t_j}\right)^2
 \geq{1\over9h^2}
 {\sin^2(\pi y_{j,\gamma})\over y_{j,\gamma}^2}.     \tag{3.10}
\]

Indeed, `gamma/(gamma+t_j)>=3/8>1/3` when the row is below the
carrier, and it is larger than `1/2` when the row is above it.  Thus for
`M` large enough that `bh<=t_M/4`, (3.9)--(3.10) prove

\[
 \boxed{
 \sum_{n\in J^+}D_n^{\rm micro}
 \geq {h^{-2}\over18}\mathcal R_J^{\rm ph}.}         \tag{3.11}
\]

Equations (2.4), (3.4), and positivity also give

\[
 D_n^{\rm micro}
 \leq B_u\max(1,r_+^2)D_n^{\rm id}.                  \tag{3.12}
\]

Consequently the completely normalized aggregate theorem is

\[
 \boxed{
 \sum_{n\in J^+}D_n^{\rm id}
 \geq {h^{-2}\over18B_u\max(1,r_+^2)}
 \mathcal R_J^{\rm ph}.}                            \tag{3.13}
\]

Formula (0.3) is exactly (3.13).  When `r_+<=1`, its maximum factor is
one.

There is also an exact envelope-compatible weighted form.  Multiply the
`j`th pair inequality by `A_j^2`.  Since
`A_j^2r_j^2=A_(j+1)^2`, its left side reindexes with no envelope loss.
If

\[
 \mathcal R_{J,A}^{\rm ph}
 =\sum_{j\in J}A_j^2|Z_j|^2S_j^{\rm ph},             \tag{3.14}
\]

then

\[
 \boxed{
 \sum_{n\in J^+}A_n^2D_n^{\rm id}
 \geq {h^{-2}\over18B_u}\mathcal R_{J,A}^{\rm ph}.} \tag{3.15}
\]

This weighted identity is useful when the physical block norm retains the
positive source envelope.

## 4. The two ideal hypotheses and cutoff selection

Name the required discrete phase-weighted arithmetic hypothesis

\[
 {\sf PW1}(J):\qquad
 \mathcal R_J^{\rm ph}
 \geq\kappa_{\rm ph}\sum_{j\in J}|Z_j|^2,
 \qquad\kappa_{\rm ph}>0.                            \tag{4.1}
\]

Name the required endpoint-frame hypothesis

\[
 {\sf NY}(J):\qquad
 0<\sum_{n\in J^+}|e_n|^2
 \leq C_E\sum_{j\in J}|Z_j|^2,
 \qquad C_E<\infty.                                  \tag{4.2}
\]

`NY` includes explicit aggregate endpoint positivity and the
below-Nyquist total-energy control for the alternating tail.
For a genuinely bandlimited sequence it is the `l^2` multiplier estimate
for `(1+shift)^(-1)`.  Applying it to the complete smoothed Hardy
approximate functional equation, including its two branches, endpoint
errors, and the slowly varying envelope, is an analytic theorem which is
not silently assumed here.

Combining (3.13), (4.1), and (4.2) proves

\[
 \boxed{
 \sum_{n\in J^+}D_n^{\rm id}
 \geq {\kappa_{\rm ph}\over
 18B_u\max(1,r_+^2)C_E}h^{-2}
 \sum_{n\in J^+}|e_n|^2.}                            \tag{4.3}
\]

The strict left side of (4.2) excludes the all-zero block.  Therefore
either some `e_n=0<D_n^id`, or at least one cutoff with
`e_n!=0` satisfies

\[
 \boxed{
 {D_n^{\rm id}\over|e_n|^2}
 \geq c_{\rm id}h^{-2},\qquad
 c_{\rm id}={\kappa_{\rm ph}\over
 18B_u\max(1,r_+^2)C_E}.}                            \tag{4.4}
\]

If `T<=t_n<=2T` throughout the block and
`alpha_L=L/log T`, then

\[
 h^{-2}={L^2\over4\pi^2}
 ={\alpha_L^2\over4\pi^2}(\log T)^2.                \tag{4.5}
\]

Thus fixed positive lower and upper bounds for `alpha_L` convert (4.4)
into the asserted squared-logarithmic ideal gain.  This conclusion is a
conditional aggregate theorem, not a proof of `PW1` or `NY`.

## 5. Exact `q_L`, envelope, phase, and gamma normalization

The carrier index `n` labels the finite cutoff `N=n-1`.  Write its actual
endpoint and rows as

\[
 d_n^{\rm act}:=d_{n-1},\qquad
 H_{n,\gamma}^{\rm act}
 :=H_{n-1}\left({\gamma L\over2\pi}\right),
 \qquad q_L=-{2(-1)^n\over\sqrt L}.                  \tag{5.1}
\]

For the physical ideal main block, define

\[
 b_n^{\rm phys}=q_LA_ne_n,\qquad
 a_{n,\gamma}^{\rm phys}=q_LA_n
 {\sin(\gamma L/2)\over\gamma}c_{n,\gamma}.          \tag{5.2}
\]

Then no scale is suppressed:

\[
 |b_n^{\rm phys}|^2=|q_L|^2A_n^2|e_n|^2,\qquad
 \sum_\gamma m_\gamma|a_{n,\gamma}^{\rm phys}|^2
 =|q_L|^2A_n^2D_n^{\rm id}.                          \tag{5.3}
\]

In particular the quotient at one cutoff is exactly

\[
 {\sum_\gamma m_\gamma|a_{n,\gamma}^{\rm phys}|^2
  \over|b_n^{\rm phys}|^2}
 ={D_n^{\rm id}\over|e_n|^2}.                        \tag{5.4}
\]

Thus `q_L`, `A_n`, the phase, and `gamma^(-2)` have not been discarded;
the first two cancel and the last two remain inside `D_n^id`.

For an aggregate operator comparison it is convenient to use the
normalized actual variables

\[
 \widehat d_n={d_n^{\rm act}\over q_LA_n},\qquad
 \widehat a_{n,\gamma}^{\rm act}
 ={1\over q_LA_n}{\sin(\gamma L/2)\over\gamma}
 H_{n,\gamma}^{\rm act}.                             \tag{5.5}
\]

Put the normalized ideal arrays

\[
 \bar b_n=e_n,\qquad
 \bar a_{n,\gamma}={\sin(\gamma L/2)\over\gamma}
 c_{n,\gamma}.                                       \tag{5.6}
\]

Let `||.||_end` be the `l^2(J^+)` norm and let `||.||_row` be the
`l^2(J^+ times Gamma,m_gamma)` norm.  Suppose an ideal-to-main comparison
and the exterior interface obey, with
`0<=eta<1`, `0<=epsilon_row<1`, and `0<=epsilon_end<1`,

\[
 \begin{aligned}
 \|\bar a^{\rm main}-\bar a\|_{\rm row}
 &\leq\eta\|\bar a\|_{\rm row},
 &\|\bar b^{\rm main}-\bar b\|_{\rm end}
 &\leq\eta\|\bar b\|_{\rm end},\\
 \|\widehat a^{\rm act}-\bar a^{\rm main}\|_{\rm row}
 &\leq\varepsilon_{\rm row}\|\bar a^{\rm main}\|_{\rm row},
 &\|\widehat d-\bar b^{\rm main}\|_{\rm end}
 &\leq\varepsilon_{\rm end}\|\bar b^{\rm main}\|_{\rm end}.
 \end{aligned}                                       \tag{5.7}
\]

Here every symbol in (5.7) uses the common normalization
in (5.5); equivalently one may use the envelope-weighted form (3.15).
The triangle inequality from the frozen complex-interface theorem gives

\[
 \boxed{
 \sum_{n\in J^+}\sum_\gamma m_\gamma
 |\widehat a_{n,\gamma}^{\rm act}|^2
 \geq\tau c_{\rm id}h^{-2}
 \sum_{n\in J^+}|\widehat d_n|^2.}                   \tag{5.8}
\]

where

\[
 \tau=\left({1-\eta\over1+\eta}\right)^2
 \left({1-\varepsilon_{\rm row}
              \over1+\varepsilon_{\rm end}}\right)^2. \tag{5.9}
\]

If only the exterior comparison is needed and both exterior errors are
at most `1/4`, its loss is `9/25`.  If both stages in (5.7) have all
relative errors at most `1/4`, then `tau=81/625`.  These are aggregate
operator-relative hypotheses.  No pointwise division by a possibly small
alternating endpoint is used.

Since normalization by `q_L*A_n` cancels in the one-cutoff ratio, (5.8)
selects an actual cutoff with

\[
 {D_{n-1}^{\rm act}\over|d_{n-1}|^2}
 \geq\tau c_{\rm id}h^{-2},                           \tag{5.10}
\]

unless the zero-endpoint branch already gives `eta_(n-1)^pr=0` with
positive denominator.  The left side of (5.10) uses the complete actual
denominator: the normalized comparison needs only the noncarrier
subcollection `Gamma`, and every omitted carrier-continuous row is
nonnegative.  With the frozen bound
`S_0<=C_(mathfrak Z)`, the checkpoint quotient would satisfy

\[
 (\eta_{n-1}^{\rm pr})^2
 ={d_{n-1}^2S_0\over D_{n-1}^{\rm act}}
 \leq {4\pi^2C_{\mathfrak Z}\over
 \tau c_{\rm id}\alpha_L^2(\log T)^2}.              \tag{5.11}
\]

Equations (5.10)--(5.11) remain conditional on both the operator transfer
and the finite-gate intersection.

A cutoff with `d_(n-1)=D_(n-1)^act=0` has an undefined quotient and
is not a zero-endpoint success.  Aggregate endpoint positivity and relative
errors strictly below one keep the transferred endpoint block nonzero, so
such cutoffs may be skipped in the selection.

## 6. Why continuous `k=1` density does not prove `PW1`

Use the unit-mean-spacing coordinate

\[
 x={\Delta\log T\over2\pi},\qquad
 \alpha={L\over\log T}.                              \tag{6.1}
\]

At a carrier, (3.6) becomes

\[
 \sin^2\left({\gamma L\over2}\right)
 =\sin^2(\pi\alpha x).                               \tag{6.2}
\]

With Fourier convention
`Fhat(xi)=integral F(x)exp(-2*pi*i*x*xi)dx`, the exact identity is

\[
 \widehat{F(\cdot)\sin^2(\pi\alpha\cdot)}(\xi)
 ={1\over2}\widehat F(\xi)
 -{1\over4}\widehat F(\xi-\alpha)
 -{1\over4}\widehat F(\xi+\alpha).                  \tag{6.3}
\]

Sampling in `t` at spacing `h=2*pi/L` produces Poisson aliases at angular
frequencies `kL`; in the normalization (6.1), their centers are
`k*alpha`.  Thus the last two terms in (6.3) are centered exactly on the
first aliases `k=+1` and `k=-1`.

For the locked schedule `N asymp exp(L/2)L^3`, one has
`alpha=2+o(1)`.  A smooth approximate functional equation and the explicit
formula may well show that an **unphased** compactly supported statistic
has no nonzero alias: the first carrier frequency is then beyond the
relevant Riemann--Siegel and prime-ratio bands.  Equation (6.3) shows why
that argument cannot simply be repeated after inserting the phase.  The
phase moves the statistic to the frequency which Poisson summation is
trying to exclude.

Bettin and Fazzari, [*A weighted one-level density of the non-trivial zeros
of the Riemann zeta-function*](https://arxiv.org/abs/2208.08421), prove a
continuous `k=1` weighted one-level density and a twisted continuous second
moment.  Under RH, Gonek's
[*Mean values of the Riemann zeta-function and its derivatives*](https://people.math.rochester.edu/faculty/gonek/papers/5-MVZDrvs.pdf)
gives the shifted-zero normalization

\[
 \sum_{T\leq\gamma\leq2T}
 \left|\zeta\left({1\over2}+i\left(\gamma+{2\pi x\over\log T}\right)
 \right)\right|^2
 \sim {W_U^1(x)\over2\pi}T(\log T)^2,\qquad
 W_U^1(x)=1-\left({\sin\pi x\over\pi x}\right)^2.   \tag{6.4}
\]

The authoritative normalization here is Corollary 2 of Gonek's original
paper.  A sentence in the Bettin--Fazzari introduction prints
`T*log T`; its own continuous-to-zero identity (1.3), combined with
the continuous weighted mean of order `T*log T`, restores the factor
`(log T)/(2*pi)` and hence (6.4).  Both references are primary,
external, unvendored, and nonbinding for this pair.  Neither statement
samples the shifted value on the shrinking carrier progression, and
neither evaluates the two terms at the first aliases in (6.3).

Likewise, inserting the alternating filter as a Dirichlet-polynomial
symbol into a twisted second moment is not automatically positive.  Its
diagonal and off-diagonal terms must be computed after the two alias
shifts.  Ellipticity of the endpoint symbol on a local band is an upper and
lower norm statement, not positivity of this mixed zero covariance.

This identifies the sharp new arithmetic conjecture needed by (4.1): a
uniform discrete phase-weighted `k=1` formula whose main term is positive
after the `k=0,+1,-1` carrier contributions are combined.  Standard RH,
HSW zero counts, separate zeta moments, and pair correlation without that
mixed value weight do not determine its sign.

## 7. Schedule audit

For the generalized family

\[
 N\asymp e^{pL/2}L^r,\qquad
 T={2\pi N\over L},                                   \tag{7.1}
\]

one has

\[
 \log T={pL\over2}+(r-1)\log L+O(1),\qquad
 {L\over\log T}\longrightarrow{2\over p},           \tag{7.2}
\]

while the central complex-saddle parameter has scale

\[
 {T\over4\pi\lambda^2}
 \asymp {1\over2}\lambda^{p-2}L^{r-1}.               \tag{7.3}
\]

Every fixed `p<2` therefore keeps the central saddle small but puts the
carrier/form-factor parameter strictly above one.  Letting `p` approach
two moves the alias toward the form-factor boundary while simultaneously
using up the vanishing-saddle margin.  Merely varying the cutoff by a fixed
factor changes (7.2) only by `O(1/L)` and does not remove the phase-alias
identity (6.3).

There is a boundary-layer schedule worth separating from the proved
reduction:

\[
 N\sim D\lambda^2L,\qquad {1\over2\pi}<D<{1\over2},
 \qquad T\sim2\pi D\lambda^2=Dc.                     \tag{7.4}
\]

It remains inside `T<c/2`, while
`L/log T=1-log(2*pi*D)/L+O(L^(-2))<1`.  A zero profile with Fourier width
`O(1/L)` is broad on the normalized `x` scale and corresponds to a fixed
physical zero window.  Its `Theta(log T)` rows, each with only constant
Cauchy gain, have the correct total order for the weaker target
`eta^2=O(1/log T)`.

The endpoint filter is nevertheless only barely below its own
Riemann--Siegel Nyquist boundary.  More precisely,

\[
 \Omega_{\rm RS}={1\over2}\log{T\over2\pi}
 ={L+\log D\over2},\qquad
 h\Omega_{\rm RS}=\pi+{\pi\log D\over L}<\pi.        \tag{7.5}
\]

The crude endpoint multiplier bound therefore loses `O(L)` in norm and
`O(L^2)` in energy near the low Dirichlet modes, which is too large for
the simple raw-energy reduction (4.3).  This does not rule out a joint
boundary-layer theorem.  In the local model with `z_0=a+i*beta` and
`Re(z_0)>0`, the common near-pole factor cancels formally and leaves

\[
 z_0\int_0^\infty {e^{-z_0x}\over\Delta+x}\,dx
 =z_0\int_0^\infty {e^{-\Delta t}\over z_0+t}\,dt.   \tag{7.6}
\]

The real part of the second integral is positive.  Multiplication by
`z_0` need not preserve positivity of its real part, but it does preserve
nonvanishing; compact parameter sets bounded away from the boundary then
give a positive modulus floor.  A direct joint-symbol estimate of this
kind may avoid the crude separate endpoint loss.  No such two-branch
Hardy/Cauchy symbol theorem is proved here.  The critical schedule is a
possible escape from the aggregate raw-density route, not a conclusion of
it.

Broader physical edge windows make exactly the same trade: they supply
`Theta(log T)` rows with constant rather than microscopic `log T` Cauchy
gain.  They help only if the phase-weighted value average and the joint
endpoint/Cauchy symbol are controlled uniformly at the narrowing Fourier
margin.

## 8. Adaptive endpoint nonvanishing is not the joint theorem

The frozen adaptive schedule proves that an arbitrary large target `t`
can be made the exact carrier `t_m` with

\[
 N=e^{L/2}L^3+O(L).                                   \tag{8.1}
\]

Under RH, (6.4) and the Riemann--von Mangoldt count imply that for any fixed
`x!=0`, some cofinal shifted zeros satisfy

\[
 \left|\zeta\left({1\over2}+i\left(\gamma+{2\pi x\over\log T}\right)
 \right)\right|^2
 \geq\{W_U^1(x)+o(1)\}\log T.                        \tag{8.2}
\]

Choosing `x=1/4` and aligning
`t=gamma+2*pi*x/log T` to the locked adaptive carrier makes
`sin^2(gamma*L/2)->1`, because `L/log T->2`.  Equation (2.5) then implies
that at least one of two adjacent endpoint tails is nonzero at the raw
source scale.

Only a deliberately weakened consequence of (8.2) is needed here: the
shifted value is bounded away from zero.  In particular, for large `T`
the right side exceeds the fixed positive constant `2*pi*W_U^1(x)`.

This is only an external RH-conditional endpoint-nonvanishing observation.
It does not prove a joint cutoff: the endpoint winner and the Cauchy-row
winner in the two separate identities can be opposite indices.  The
squared aggregate recurrence (2.6) is precisely the repair, and it needs a
block theorem such as `PW1` plus `NY`.

On the constant-`N` adaptive plateau `L(u)=L+u/t`, `u=O(1)`, the edge moves
by only `O(1/L)` and the phase changes by `O(1)`.  At the locked `p=1`
scale, however, the arithmetic alias center `e^(L(u))` moves through an
absolute interval of length

\[
 {e^L\over t}O(1)\asymp {\lambda\over L^2}O(1)
 \longrightarrow\infty.                              \tag{8.3}
\]

This suggests a possible adaptive-`L` decorrelation theorem for the first
aliases.  Prime number theory alone does not control the simultaneous
prime and approximate-functional-equation rational frequencies, so (8.3)
is a research direction, not a proof of `PW1`.

## 9. The finite-gate block-intersection barrier

The aggregate theorem selects one cutoff from `J^+`.  A dyadic carrier
block is natural for a global weighted one-level calculation, but the
frozen finite theorem is locked to
`N=ceil(exp(L/2)L^3)`.  The adaptive theorem extends the analytic Gevrey
and projection estimates only to `N=exp(L/2)L^3+O(L)`; it does not make a
whole dyadic block satisfy the frozen finite hypotheses.

Conversely, restricting `J` to an `O(L)` cutoff neighborhood keeps the
proved analytic schedule, but spans only an `O(1)` physical height interval.
No quoted global moment theorem supplies the required shrinking-progression
phase-weighted value average uniformly in every such interval.

Even if `PW1`, `NY`, and the Stokes transfer select an `N` in the analytic
band, the finite simple-even ground, nonzero boundary normalization, strict
shifted-sector signs, response reserve, and strict denominator branch are
not inherited under `N->N+1`.  The structural principal-extension
countermodels in the frozen adaptive note rule out such an inference.

Thus the last quantifier cannot be suppressed: one must prove the finite
gates uniformly on the candidate block, prove them at both members of each
adjacent pair, or prove a synchronization theorem placing the
energy-selected cutoff in the finite-good subset.

## 10. Stopping point

The same-index algebra is closed.  Equations (3.11), (3.13), (3.15),
(4.3), and (5.8) give the exact aggregate route from a phase-weighted raw
Hardy statistic to the checkpoint quotient, with all constants and
normalizations visible.

The arithmetic input is not closed.  Its sharp form is the discrete
phase-weighted first-alias theorem `PW1`, not continuous one-level density
by itself.  The actual analytic input is not closed: it is the
operator-relative normalized Stokes transfer (5.6), not pointwise
smallness.  The finite quantifier is not closed: the selected cutoff must
still satisfy all strict finite gates.  The correct-density local model in
the frozen joint barrier continues to exclude any proof from structural
zero density, type, and positivity alone.
