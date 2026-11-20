# Benchmark audit and worst-block analysis

22 October 2026. This continuation establishes a generic-mechanism obstruction and sharpens the arithmetic target. It does not prove RH or improve a zero-free region.

## 1. What the 7/8 benchmark actually says

The OpenAI math repository's scope note identifies a **global** zero-free half-plane Re(s)>7/8, not a zero-density estimate or a finite-height computation. The zeta implementation quantifies over every complex s with that strict real-part inequality. It does not exclude zeros on the boundary Re(s)=7/8. In conventional analytic language the pole at s=1 is not a zero. Dirichlet statements explicitly exclude principal-character poles.

I inspected the comparator target and configuration, the implementation in `Nonvanishing.lean`, its unconditional final assembly, the certified-band assembly, and the terminal energy-certificate construction. The target's `sorry` is a comparator placeholder, not the supplied implementation. The configuration compares the implementation with that target and permits only `propext`, `Quot.sound`, and `Classical.choice`. The implementation invokes `zeta_nonzero`; the unconditional assembly supplies `detector_certified_bands`. The inspected outer theorem does not assume RH or a moment conjecture.

**Audit limit:** this is source-level scope and selected dependency inspection. Lake was unavailable locally; I did not execute Comparator, audit the full dependency graph, or review the entire manuscript. The repository's claim is precisely identified, but this run is not an independent verification of its proof. Do not call the comparator placeholder evidence that the implementation is incomplete.

Sources, with retrieved blob identifiers in `benchmark_sources.json`:

- https://github.com/openai/math/blob/main/lean/docs/003.md
- https://github.com/openai/math/blob/main/lean/ComparatorChallenges/QuasiRiemannHypothesis.json
- https://github.com/openai/math/blob/main/lean/OAI/NumberTheory/DirichletL/Nonvanishing.lean
- https://github.com/openai/math/blob/main/lean/OAI/NumberTheory/DirichletL/Detector/FinalAssemblyUnconditional.lean
- https://github.com/openai/math/blob/main/lean/OAI/NumberTheory/DirichletL/Detector/FinalAssemblyCertifiedBands.lean
- https://github.com/openai/math/blob/main/lean/OAI/NumberTheory/DirichletL/Energy/CertifiedExistence.lean

For our variable w=s-1/2, the benchmark corresponds to Re(w)>3/8. Thus the previously derived lower-response criterion would improve that edge only with an unconditional exponent beta<3/8. Reproducing beta=3/8 would not improve it; taking the benchmark as an input would not independently reprove it.

## 2. The state that a block must retain

Put t_j=t_0+jh, x_j=Psi(t_j), v_j=Psi'(t_j+). Set a=Psi'' between events and q_n=log(p)/sqrt(n) at n=p^k. For 0<=u<=h define

\[
D_j(u)=\sum_{t_j<\log n\le t_j+u}q_n-\int_0^u a(t_j+r)\,dr,
\qquad E_j(u)=\int_0^u D_j(r)\,dr.
\]

The initial slope includes any event at the left endpoint. At the right endpoint the slope is the post-event slope. Direct integration gives

\[
v(t_j+u)=v_j-D_j(u),\qquad
\Psi(t_j+u)=x_j+uv_j-E_j(u).
\]

In particular,

\[
v_{j+1}=v_j-D_j(h),\qquad x_{j+1}=x_j+hv_j-E_j(h).
\]

Here D measures total-charge discrepancy, whereas E also records event timing. A bound on D_j(h) alone discards that timing. Resetting v_j at each block discards accumulated memory.

For A_j=sum_{k<j}D_k(h), exact iteration yields

\[
\Psi(t_m+u)=x_0+(mh+u)v_0-B_m(u),
\]
\[
B_m(u)=h\sum_{j<m}A_j+\sum_{j<m}E_j(h)+uA_m+E_m(u).
\]

**Concrete sufficient arithmetic target:** prove, for some fixed h>0 and beta in (0,3/8),

\[
\sup_{0\le u\le h}B_m(u)\le C e^{\beta t_m}
\quad\text{for every sufficiently large }m.
\]

The identity then gives Psi(t)>=-C' exp(beta t); the negative-part Laplace criterion from GLOBAL_TAIL.md gives |Re(rho)-1/2|<=beta. The linear initial-state term is absorbed because beta>0. A polynomial upper bound on B instead suffices for RH by using every positive beta. These are sufficient targets, not estimates established here. The supremum over u is necessary to cover excursions inside a block.

## 3. Finite scan: local burden and actual danger differ

Using the existing 78,734 prime-power events through n=1,000,000, `block_audit.py` scans five fixed widths at spacing 0.02. It retains x_j and v_j, compares two formulas for E_j(h), and encloses every block identity with outward-rounded Decimal arithmetic. Candidate locations are grid extrema, not certified exact minimizers.

The previous global finite bound 0<=Psi<=0.321739605 implies |W_h'|<=0.321739605/h. This supplies continuous lower bounds between grid points. Each row applies on 0.70<=t<=log(1,000,000)-h. Values below are rounded down.

| h | Grid points | Lowest sampled W_h location | Certified continuous W_h lower bound |
|---:|---:|---:|---:|
| 0.25 | 645 | 1.66 | 0.0260978 |
| 0.5 | 632 | 5.30 | 0.0375853 |
| 1 | 607 | 5.30 | 0.0415334 |
| 2 | 557 | 2.58 | 0.0436857 |
| 4 | 457 | 7.40 | 0.0452487 |

For h=1, the largest sampled local charge-minus-recovery occurs at t=7.26: approximately 0.37075158. Yet W_1 there is approximately 0.04767631 because the inherited contribution x+v/2 is approximately 0.41842789. The lowest sampled W_1 instead occurs at t=5.30. The largest sampled slope drop also occurs at 7.26 for h=1, but at 5.40 for h=0.25. There is no single worst block independent of the diagnostic and width.

The earlier finer h=1 certificate remains stronger than this new h=1 bound. The purpose here is comparison of mechanisms and widths, not expansion of the certified range. These finite results say nothing by themselves about arbitrarily late blocks, and logarithmic delay is not zero height.

## 4. An explicit obstruction to generic recovery proofs

First, with constant curvature a=1 and one unit downward slope jump at relative time r in every unit block, D_j(1)=0 but E_j(1)=1/2-r. Starting each block at slope zero, r=1/4 produces displacement -1/4 per block; r=3/4 produces +1/4. Equal total charge does not determine displacement. This only refutes automatic nonnegativity; linear drift alone does not defeat a subexponential criterion.

A stronger construction also preserves **finite total diagonal loss**. This is an artificial impulse system, not a candidate prime-power sequence or a zeta counterexample.

Take a(t)=exp(t/2). In unit block [j,j+1], put

\[
Q_j=\int_j^{j+1}a(t)dt=2(e^{1/2}-1)e^{j/2},\qquad K_j=\lceil e^{2j}\rceil.
\]

Place K_j equally weighted downward jumps, each Q_j/K_j, at distinct relative times

\[
r_{j,l}=\tfrac14+\frac{l}{12(K_j+1)},\quad 1\le l\le K_j.
\]

All lie between 1/4 and 1/3. The total charge equals recovery exactly: D_j(1)=0. Since increasing curvature has weighted mean time at least 1/2, while every jump occurs before 1/3,

\[
E_j(1)=Q_j(\text{mean recovery time}-\text{mean jump time})\ge Q_j/6.
\]

With initial slope zero, every integer-endpoint slope remains zero, but

\[
\Psi(m)\le\Psi(0)-\frac{e^{m/2}-1}{3}.
\]

Meanwhile the sum of the diagonal losses d=q^2/(2a) is finite:

\[
\sum_{j,l}\frac{(Q_j/K_j)^2}{2a(j+r_{j,l})}
\le 2(e^{1/2}-1)^2\sum_{j\ge0}e^{-3j/2}<\infty.
\]

Thus positive increasing curvature, positive jumps, exact block mass balance, and summable diagonal losses are compatible with negative exponential growth of order 1/2. The construction does not respect prime-power locations or their prescribed weights. That missing arithmetic is precisely what a successful proof must exploit. Long gaps alone are not the adverse ingredient: the timing of concentrated charges relative to recovery creates the deficit.

## 5. What this changes

Generic relaxation and diagonal-loss control cannot close the proof. The next mathematical task is a **one-sided, time-weighted prime-power discrepancy estimate** controlling B_m(u), with all inherited slope and intra-block terms included. A proposed arithmetic inequality should first be tested against the actual finite data and the artificial construction above, then proved uniformly in m. Any argument that applies unchanged to the artificial construction is too weak to establish the desired exponent.

The audit resolves the benchmark's meaning and rules out a broad shortcut. The central infinite arithmetic estimate remains open in this project.
