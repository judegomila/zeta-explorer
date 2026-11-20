# Sub-0.145 de Bruijn–Newman search: exact gate and tested scalar freeze

Date: 3 October 2026. Research result, not a new global bound.

## Result first

The new target row is

\[
t_*=\frac{24727519}{200000000},\qquad y_*=\frac15,
\qquad t_*+\frac{y_*^2}{2}=\frac{28727519}{200000000}
=0.143637595<0.145.
\]

The exact reserve below 0.145 is 272481/200000000. This calculation is verified by `verify_exact_gates.py`; it is not a bound on Lambda until a global strip certificate closes.

The useful computational freeze is the jointly evaluated **scalar physical orbit** of both Riemann–Siegel ladders, with gamma, kappa, the Euler multiplier and each common x/y uncertainty retained together. In the 45 newly run diagnostic points, the P97 gauge outperformed P11 at each tested height and window. An outward-rounded local cell computation is recorded separately in `local_cell_certificate.json` when complete. Neither finite sampling nor one cell supplies the missing global coverage.

## What is rigorously known independently

The published primary-source baseline is Lambda <= 0.2, explicitly stated as Corollary 2 of [Platt–Trudgian](https://arxiv.org/html/2004.09765). Their Theorem 1 verifies RH through 3000175332800. The [Polymath paper](https://arxiv.org/html/1904.12438) fixes H_0(z)=xi(1/2+iz/2)/8 and proves the strip-shrinking implication Lambda <= t+y^2/2 in Theorem 3.2.

The [Gomila repository](https://github.com/judegomila/dbn-lambda-01787854-candidate-audit/tree/a74738deb6d5e0f76887cb36901da08b68dca705) presents a replayable claimed computer-assisted bound <=0.1787854 and explicitly says it is not peer reviewed. Its current source was inspected, but the complete certificate was not freshly replayed in this task. The newer [Gordon repository](https://github.com/stefangordon/dbn-upper-bound) claims <=0.157656619095490606768...<0.158, states that its Lean result has analytic assumptions, and is also explicitly unreviewed. Neither claim establishes the present target.

## Exact target region and conditional inheritance

Set X=6000000185827. For the new row the required final-time region is

\[
x\ge X+\sqrt{24/25},\qquad
1/5\le y\le\sqrt{75272481/100000000}.
\]

The initial input needs height X/2=3000000092913.5, below the published verified height by exactly 350479773/2. It does not require RH to height 3e16.

The candidate repository's closed intermediate barrier is stated on [X,X+1]+i[.1809,1], for 0<=t<=129/800. Exact interval-containment arithmetic shows that this contains the new row's curved barrier. This is an **inheritance conditional on the correctness of that particular barrier certificate and all its hypotheses**; only its statement, proof account and stored transcript were read here. It is not a new barrier replay.

Thus the proposed route has one new global analytic obligation if the existing barrier input is accepted: final-time nonvanishing on the displayed half-strip. Independent review or replay of inherited computational inputs remains a separate verification obligation.

## Exact scalar gate, keeping the cross terms

Use Polymath's finite approximant

\[
f=F_B+\gamma F_A,
\quad F_B=\sum_{n\le N}b_t(n)n^{-s_*},
\quad F_A=\sum_{n\le N}n^y b_t(n)n^{-\overline{s_*}-\kappa},
\quad N=\lfloor\sqrt{x/(4\pi)+t/16}\rfloor.
\]

Let A_97(s_*)=product_{p<=97}(1-b_t(p)p^{-s_*}), and W=A_97 f. If E bounds |H_t/B_t-f|, the sufficient cell gate is

\[
\boxed{\sup_{q\in Q}|W(q)-1|+
       \sup_{q\in Q}|A_{97}(q)|\sup_{q\in Q}E(q)<1.}
\]

B_t is the nonvanishing Polymath normalization. The gate makes A_97 H_t/B_t nonzero, so it also excludes zeros of either factor. It does not first assume A_97 is zero-free.

The old .14 quantity C_97-A_97 f^(0) omits kappa from f^(0). Our reconnaissance keeps kappa in both the rough sum and f. Its displayed cocycle is therefore a nearby, different diagnostic. The historical .279688... reserve must not be applied to it, or to y=.2, without rebuilding the whole enclosure.

### Dependency-preserving affine freeze lemma

Suppose, on one physical parameter box,

\[
W(q)-1=v_0+\sum_{j=1}^m v_j\xi_j+r(q),
\qquad -1\le\xi_j\le1,\qquad |r(q)|\le r_*.
\]

Then a sharp bound for the affine part is

\[
\sup_{\xi\in[-1,1]^m}\left|v_0+\sum_jv_j\xi_j\right|
=\max_{\epsilon\in\{-1,1\}^m}\left|v_0+\sum_jv_j\epsilon_j\right|.
\]

Proof: the norm of an affine function is convex in each coordinate, so its maximum on an interval lies at an endpoint. Apply this successively. This is a finite theorem, requiring no positivity assumption on covariance. At fixed heat time, a joint first-order x/y model has only four vertex evaluations, irrespective of how many prime or ladder components contributed to each coefficient. The Taylor remainder and coefficient interval errors must still be bounded outwardly.

One must sum the derivatives of every shared component before this vertex maximum. The exact regression example in `verify_exact_gates.py` has center (1/5,1/10) and two common-coordinate derivatives (9/10,3/10),(-4/5,-1/4). The coherent squared bound is 9/80; treating those as independent fibers gives 1613/400. The cross term is -159/100, so assuming it positive would be wrong. This example tests the gate's dependence handling; it is not zeta data.

### Why this is safer than an arbitrary twistor projection

Projecting a two-sector pencil to a favorable graph can remove its characteristic vectors. The exact pencil with eigenvalues +i and -i compresses to zero on the symmetric graph; after rotating to symmetric/antisymmetric coordinates its entire imaginary residual is the omitted off-diagonal block. Our test verifies this counterexample algebraically. A smaller compressed residual is usable only with an exhaustive scalar-to-graph bridge and a leakage/tail Schur bound.

The scalar gate above avoids inventing such a bridge: it directly encloses the scalar H_t quotient. It does not construct a full twistor model.

## Fresh computations

`probe_correlated_freeze.py` used 90-digit scalar setup and NumPy long-double sums. There are five deterministic interior x samples per window, at N=690988, 1000000 and 4050000, and three heights. These 45 points are diagnostics, not interval or continuum certificates.

| height | minimum sampled |f| | max sampled |A11 f-1| | max sampled |A97 f-1| |
|---:|---:|---:|---:|
| .1809 | .61103347 | .19916228 | .11141377 |
| .2 | .62298049 | .17398125 | .08956084 |
| .2065 | .62593419 | .16666780 | .08325918 |

The .2065 row has exact endpoint .14495872<.145 and less arithmetic slack. It is a candidate for an easier global nonvanishing task; the samples do not establish its advantage globally. A 15-point higher-heat comparison at t=.1285,y=.1809 has endpoint .144862405 and sampled P97 maximum .10787826. This screen gives no reason to replace the chosen .143637595 row. No finite screen selects an optimal global row.

The interval-cell checker `certify_local_cell.py` evaluated all 690988 terms on x=6000000186827 +/-1/10000, y in [1/5,200001/1000000], t=t_*. It uses outward-rounded mpmath.iv operations, retains exact gamma and kappa, confirms the Riemann–Siegel index is constant, and adds both effective error terms. It uses 10.50, not 10.44, in the conservative Proposition 6.6(vi) corollary. The run passed in 112 seconds:

- |f| > 1.16217796247927;
- the total effective error is < 0.000001173308911;
- consequently |H_t/B_t| > 1.16217678917036 throughout that cell;
- the coupled P97 disk radius, including the effective error, is < .079937848.

The full outward-rounded intervals and exact domain are in `local_cell_certificate.json`. This certificate proves nonvanishing throughout that one positive-area cell only.

### Local proof-to-code contract

The entire cell satisfies the theorem's domain x>=200, 0<t<=1/2, 0<=y<=1; the executable checks these conditions before summation. Its computed index interval is

\[
690988.3097006157044\ldots\ \le\sqrt{x/(4\pi)+t/16}
\le690988.3097006157160\ldots,
\]

strictly between 690988 and 690989. Thus the exact same finite approximant applies throughout the cell, with no unhandled seam inside it.

For B_t(z)=M_t((1+y-ix)/2), the argument is far from 0, 1 and the branch cut of the stated M_t representation. Its exponential factors and polynomial prefactor are nonzero. Hence H_t/B_t is the normalized scalar in Polymath Theorem 1.3, and proving that quotient nonzero proves H_t nonzero.

For the equation-(23) error, put z=x/(4pi). The code checks z>N^2/2 and z>2. For every n<=N this implies -log2<log(z/n^2)<=logz, hence |log(z/n^2)|<=logz. The code bounds the exponential error factor uniformly using (logz)^2, while it still sums every positive coefficient factor in (23). The C-error uses the Proposition 6.6(vi) corollary with 3.58+6.92=10.50 and the smaller positive denominator x-12. Every operation is an interval operation; numerical sample values are not used to establish the cell certificate.

The source-to-theorem mapping received a separate review against the primary paper within this task. A fresh60-digit replay passed in126seconds; every returned interval is contained in the corresponding40-digit interval, as checked in `local_replay_comparison.json`. Its certificate is `local_cell_certificate_60dps.json`, SHA-2562e55a773c326ac68ded67d76e057b3811c335f9c0903ccda096b9b21cf167b7b. This is corroboration by the same implementation, not an independent implementation or external mathematical review.

## Recovered historical frontier and what remains

A new self-contained analytic tail has now been proved and separately checked within this task. At the selected t_*, for every y in [1/5,1] and every N>=10^17,

\[
|H_{t_*}(x+iy)/B_{t_*}(x+iy)|>43/500=.086.
\]

The proof and50-digit outward-rounded constant checks are in `ANALYTIC_TAIL.md`, `verify_coarse_tail_constants.py` and `coarse_tail_constant_results.json`. It bounds the primary finite-sum tail by .9, the full reflected ladder by .013, and all effective errors by5*10^-10. Every sufficiently large index, both seam sides, and the whole stated y interval are covered analytically. This argument uses no unavailable archive. The unfilled final-time region is therefore finite but enormous: N690988 through10^17-1. This coarse tail is not a replacement for verifying the much sharper historical tail if that tail is to be used.

The August 21 V4 report asserts a rigorous coupled five-shell cell and an exact 18-moment carrier reduction, but explicitly leaves global coverage unproved. Its continuous-cell halfwidth was only 1/(40000000000); raw tiling was estimated at more than 7.2061e26 cells for its finite range. It is not a scalable global certificate.

The multilevel architecture reports an unproved global correlated-divisor cocycle over 15849 retained squarefree P97 branches and N=690988,...,54799999. Its exact .14 sufficient reserve is

107155228129305910757962457981994835614431546087114923 /
383123885216472214589586756787577295904684780545900544.

That reserve belongs to the old row and its exact decomposition. It is not imported into the new row.

The August 26 moving-barrier verdict offers a different route from t_*=.123637595 to .132, moving X toward 60000000000156984+1. It replaces an unverified RH input near height 3e16 with a positive-time swept-tube nonvanishing theorem. That theorem remains unproved. It is an alternative obligation, not already available evidence.

The shortest honest next task is a **correlated scalar enclosure of the remaining finite region** that covers every required x/y point and both sides of every index seam, with a verified overlap into an analytic tail. The new affine gate preserves the needed common dependencies, but the missing quantitative remainder and coverage theorem are not supplied by the lemma itself. A local Hankel norm at bridge width a=1/4, an angular unitary change, or heat-conjugation inertia does not supply these scalar bounds.

## Provenance and replay limits

Repository source is pinned to commit a74738deb6d5e0f76887cb36901da08b68dca705. `source_file_hashes.json` gives SHA-256 hashes and verifies each exact local text against its provider Git blob SHA. The source files are read-only audit inputs; no external changes, pushes or PRs were made.

The exact Library titles V4_EXECUTION_REPORT.md, LAMBDA_014_REPULSION_MOVING_BARRIER_VERDICT.md and multilevel_freeze_architecture.md were read. Their archived source bundle hb_global_014_phase_continuation_v3_bundle.tar.gz was resolved but its supported download repeatedly failed with HTTP 502. Therefore no fresh historical-bundle replay or original bundle hash is claimed here. The historical completion labels above report what those documents say, not a newly independently checked proof of every dependency.

## Fail-closed terminal claim

Exact target arithmetic, the finite affine/leakage lemmas, a positive-area interval cell and the uniform N>=10^17 analytic tail are checked. Numerical phase screens are complete. Global final-time coverage, the swept-tube alternative, and Lambda<.145 remain **not certified**.
