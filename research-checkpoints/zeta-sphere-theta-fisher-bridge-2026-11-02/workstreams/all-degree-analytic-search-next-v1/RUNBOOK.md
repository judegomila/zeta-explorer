# Runbook

All paths below are relative to the checkpoint root
`research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02` unless an
absolute path is displayed.

The protected 4CT PID must be rechecked against both its command and exact
working directory before either launch. The expected working directory is
`/Users/USER/Documents/GitHub/4ct/4ct-map/experiments/rsst-layer3`.
Do not substitute a reused PID without verifying both properties.

## Tests

```sh
python3 workstreams/all-degree-analytic-search-next-v1/tests/test_generate_tasks.py
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search-next-v1/tests/test_egf_identity.py
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search-next-v1/tests/test_signed_h_pair.py
python3 workstreams/all-degree-analytic-search-next-v1/tests/test_analyze_results.py
```

For the complete stage-2 test set, change to the workstream directory and run:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python -m unittest \
  tests.test_paid_twin_border_falsifier \
  tests.test_generate_stage2_tasks \
  tests.test_analyze_stage2
```

For the frozen-residue diagnostic and governed-receipt tests, use the bound
Arb environment; the ambient `python3` does not provide this workstream's
`mpmath` dependency:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python -m unittest \
  tests.test_m0_inertia_probe \
  tests.test_generate_m0_task \
  tests.test_certify_m0_boundary_jet
```

The only skipped test by default is the explicit integration test. The
governed run below supplies that coverage without duplicating the expensive
calculation outside the governor.

## Stage 0: exact identity gate

Generate only the exact task:

```sh
python3 workstreams/all-degree-analytic-search-next-v1/src/generate_tasks.py \
  --stage stage0
```

Launch it under the generic governor in the foreground:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/regional-degree-sweep/src/supervisor.py \
  --root . \
  --tasks workstreams/all-degree-analytic-search-next-v1/tasks-stage0.json \
  --worker workstreams/all-degree-analytic-search-next-v1/src/egf_identity.py \
  --python /Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-stage0 \
  --protected-pid 76469 \
  --protected-cwd /Users/USER/Documents/GitHub/4ct/4ct-map/experiments/rsst-layer3
```

Do not generate or launch stage 1 if stage 0 fails. A successful supervisor
exit alone is insufficient: the queue generator below independently checks
the exact-pass field and manifest parameters.

## Stage 1: signed pair diagnostics

After stage 0 passes, generate the 14-task queue:

```sh
python3 workstreams/all-degree-analytic-search-next-v1/src/generate_tasks.py \
  --stage stage1
```

The command refuses to write the queue when the EGF manifest is missing,
mismatched, or has a failed exact check. On success it prints the manifest
SHA-256 that is also stored in `tasks-stage1.json`.

Launch stage 1 under a separate run directory:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/regional-degree-sweep/src/supervisor.py \
  --root . \
  --tasks workstreams/all-degree-analytic-search-next-v1/tasks-stage1.json \
  --worker workstreams/all-degree-analytic-search-next-v1/src/signed_h_pair.py \
  --python /Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-stage1 \
  --protected-pid 76469 \
  --protected-cwd /Users/USER/Documents/GitHub/4ct/4ct-map/experiments/rsst-layer3
```

## Stage 2: endpoint forcing reconstruction

Generate the two-task SHA-bound primary/replay queue:

```sh
python3 workstreams/all-degree-analytic-search-next-v1/src/generate_stage2_tasks.py
```

Launch from the checkpoint root under the same governor:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/regional-degree-sweep/src/supervisor.py \
  --root . \
  --tasks workstreams/all-degree-analytic-search-next-v1/tasks-stage2.json \
  --worker workstreams/all-degree-analytic-search-next-v1/src/paid_twin_border_falsifier.py \
  --python /Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-stage2 \
  --protected-pid 76469 \
  --protected-cwd /Users/USER/Documents/GitHub/4ct/4ct-map/experiments/rsst-layer3
```

If using `launch_supervisor.py` to detach, pass absolute paths for the
supervisor, root, tasks, worker and run directory. Relative paths are resolved
after the launcher changes the child working directory and can otherwise be
duplicated. The preserved `supervisor.log` records one such pre-start ENOENT;
no supervisor or worker was created by that failed attempt.

After completion, validate the queue, inputs, worker, receipts, result hashes,
event audit and primary/replay stability:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search-next-v1/src/analyze_stage2.py
```

## Frozen-residue `M0` diagnostic

Regenerate the one-task manifest after tests pass. This binds the final worker
SHA, the five input hashes, the required Arb Python and both parameter sets:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search-next-v1/src/generate_m0_task.py \
  --output workstreams/all-degree-analytic-search-next-v1/tasks-m0-inertia.json
```

Recheck the protected PID, command and exact working directory immediately
before launch. Use `ps -p <CURRENT_PROTECTED_PID> -o pid=,ppid=,command=` and
`lsof -a -p <CURRENT_PROTECTED_PID> -d cwd -Fn`; do not reuse a PID from a
previous run. Then run the single-threaded task under the generic governor:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/regional-degree-sweep/src/supervisor.py \
  --root . \
  --tasks workstreams/all-degree-analytic-search-next-v1/tasks-m0-inertia.json \
  --worker workstreams/all-degree-analytic-search-next-v1/src/m0_inertia_probe.py \
  --python /Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-m0-inertia \
  --protected-pid <CURRENT_PROTECTED_PID> \
  --protected-cwd /Users/USER/Documents/GitHub/4ct/4ct-map/experiments/rsst-layer3 \
  --sample-seconds 5
```

The worker runs a primary and a parameter replay inside one governed task.
They vary precision, quadrature step, orbit cutoff, spatial cutoff and
double-exponential extent, but use the same algorithm. After `queue_complete`,
bind the task manifest, worker/input hashes, completion receipt, event order,
result hash and replay gates:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search-next-v1/src/analyze_m0_inertia.py \
  --result workstreams/all-degree-analytic-search-next-v1/results/m0_inertia_primary_parameter_replay.json \
  --tasks workstreams/all-degree-analytic-search-next-v1/tasks-m0-inertia.json \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-m0-inertia \
  --output workstreams/all-degree-analytic-search-next-v1/analysis-m0-inertia.json
```

An absent `failed.jsonl` is the generic supervisor's normal zero-failure
state; the analyzer accepts absence but rejects a present nonempty file.

## Status

```sh
python3 workstreams/regional-degree-sweep/src/control.py status \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-stage0
python3 workstreams/regional-degree-sweep/src/control.py status \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-stage1
python3 workstreams/regional-degree-sweep/src/control.py status \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-stage2
python3 workstreams/regional-degree-sweep/src/control.py status \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-m0-inertia
```

## Deterministic analysis

After both queues finish, validate every task/receipt/result binding and emit
the derived finite diagnostics with:

```sh
python3 workstreams/all-degree-analytic-search-next-v1/src/analyze_results.py \
  --root . \
  --tasks workstreams/all-degree-analytic-search-next-v1/tasks-stage1.json \
  --completed workstreams/all-degree-analytic-search-next-v1/run-stage1/completed.jsonl \
  --failed workstreams/all-degree-analytic-search-next-v1/run-stage1/failed.jsonl \
  --output workstreams/all-degree-analytic-search-next-v1/analysis-stage1.json
```

Most accepted raw pair JSON files are intentionally ignored generated state.
The command therefore requires the complete local `results/` directory from
the finished run. In a fresh checkout, rerun both gated stages first; the
committed `analysis-stage1.json` and N24 replay exemplars are evidence, not a
substitute for the missing raw inputs.

The analyzer is read-only except for its requested output. It selects the
highest-precision accepted source per `(N, parity)`, preserves failed receipts,
and marks all cutoff, shape, and quadrature conclusions as finite diagnostics.

## Graceful stop

Use only the run directory for the active stage:

```sh
python3 workstreams/regional-degree-sweep/src/control.py stop \
  --run-dir workstreams/all-degree-analytic-search-next-v1/run-stage1
```

The controller resumes paused owned children, sends `TERM` only to process
groups recorded by that supervisor, waits 30 seconds, and records rather than
force-killing any straggler. It never signals the protected 4CT process.

## Recovery

Rerun the tests, regenerate the task file for the affected stage, and relaunch
that stage with the same run directory only when it contains no failed receipt.
Valid atomic outputs whose status and parameters match are skipped. Inspect any
`failed.jsonl` or nonempty `stopped.json` before retrying. Never recover stage 1
by bypassing the stage-0 manifest gate.

For stage 2, preserve any run directory containing a failed receipt under a
distinct archival name, then launch into a clean canonical `run-stage2`
directory after reviewing the failure and revalidating source/input hashes.
Do not delete or rewrite the failed-run evidence; `analyze_stage2.py`
intentionally rejects a canonical run directory that still contains it.

For stage 2, the task manifest records the expected worker SHA and the
post-run analyzer enforces it. The generic supervisor does not enforce the
worker SHA before launch, so recovery is not complete until
`analyze_stage2.py` passes. Do not treat a status/parameter-only skip as a
source-integrity check.

For the `M0` diagnostic, do not edit the worker after regenerating the task
manifest or while it is running. If the run directory contains a failed
receipt, signal event or stopped record, preserve it and investigate before
creating a distinct recovery directory. A worker exit code or a valid-looking
JSON file is insufficient: `analyze_m0_inertia.py` must pass every governed
binding. Do not rerun this finite-prefix diagnostic or relaunch degree sweeps
merely to occupy spare CPU. The universal all-prefix correlated trace target
is analytically refuted by `M0_FIXED_TAU_NO_GO.md`; the lightweight
real-space obstruction can be reproduced independently with:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search-next-v1/src/certify_m0_boundary_jet.py \
  --precision 200 \
  --output workstreams/all-degree-analytic-search-next-v1/results/m0_boundary_jet_arb.json
```

Further analytic work must retain one controlled negative direction or return
to the actual signed contractive-extension/regional-payment target. The exact
surviving criteria are recorded in `ONE_NEGATIVE_DIRECTION_NEXT.md` and
`PAID_SCHUR_NEXT.md`; `DRIFT_RENORMALIZATION_NEXT.md` rules out substituting a
finite collection of boundary jets. The next target is the directional,
mismatch-corrected Turan/Galerkin inequality in `MISMATCH_THETA_FORMULA.md`,
`OPERATOR_ANGLE_NEXT.md`, and `TURAN_PAID_BRIDGE.md`; the countermodels in
`INNOVATION_GAP_NEXT.md` prohibit replacing it by a generic positive-channel
comparison.

The next audited wave narrows that target further. Use
`ANGLE_THETA_VECTOR_NEXT.md` for the exact parallel-sum trace metric and
`TURAN_PD_ROUTE_NEXT.md` for the signed three-channel/tilted-curvature forms.
`GALERKIN_FACTORIZATION_NEXT.md` shows why the global square `L=B^*B` does
not pay the signed `A` channel. `THETA_MOMENT_STRUCTURE_NEXT.md` rules out
pointwise Bell-fiber total positivity, while `THETA_ORBIT_CORRELATED_NEXT.md`
rules out orbitwise positivity, raw finite orbit packets, and blockwise
regression. Any new lemma must cancel all center jets, via the modularly
complete infinite theta sum or an explicitly seam-free Euler/Ewald grouping,
and keep the requisite integrated cross-region covariance assembled.

`LITERATURE_ALIGNMENT_NEXT.md` identifies the all-prefix endpoint density
with the first Xi Laguerre inequality in Csordas' Open Problem 4.7. Do not
treat the 2026 theta-kernel concavity theorem, finite verified-zero bands, or
finite-degree checks as a solution of that Fourier-sign problem. Useful
compute should falsify a precisely stated modular grouping or correlated
trace inequality; do not launch higher-degree or raw-orbit sweeps merely to
use available CPU.

The fourth analytic wave retires independent finite-Ewald-cell positivity
tests as a route to the live theorem. Use
`PARALLEL_TRACE_MODULAR_NEXT.md` for the exact singular-safe quotient metric,
`INTEGRATED_COVARIANCE_REPAIR_NEXT.md` for the regional angular budget, and
`MODULAR_EWALD_GROUPING_NEXT.md` for the seam-free all-degree decomposition.
Every nonzero finite real Ewald packet changes Fourier sign, so a worker that only
tests cells independently cannot address the live theorem. Likewise,
`SINE_TAIL_CRITERION_NEXT.md` shows that finite center jets cannot decide the
alternating-lattice sign.

Any new governed computation should therefore bind one of these concrete
global targets: a source-derived admissible-graph inequality, the fixed-
partition signed budget in equation (34) of the covariance note, or an exact
correlated Euler/Ewald pairing. It must retain the complete sum, the global
regression, and signed cross-region terms; a finite calculation remains a
falsifier or implementation audit, never a proof of the all-scale sign.
`RECENT_PRIMARY_TRANSFER_NEXT.md` and
`CANONICAL_ZERO_COMPENSATION_NEXT.md` record the exact finite-band and
zero-crowding guardrails for interpreting any such run.

## Fifth-wave continuation gates

Do not launch a pointwise theta-graph search: `THETA_ADMISSIBLE_GRAPH_NEXT.md`
proves that the actual graph reaches the negative local cone, and its exact
global Appell constraint reduces to the original Xi--Laguerre form. Do not
launch a uniform angular-gap search either: the scalar first odd rung has zero
regional angle for every partition. At H5, use the strict `c4/c3` ordering in
`H5_RATIO_AVERAGE_NEXT.md` only inside the exact signed expression. Equation
(44) retains both signed `c5` regional diagonals but loses a positive square;
`H5_SIGNED_C5_PAYMENT_NEXT.md` gives the sharp scalarization.

The H5 compact replay is persisted in `src/certify_h5_ratio_compact.py` and
`results/h5_ratio_compact_arb.json`. It binds the interval-library version,
source hash, precision, one-thread setting, complete-theta tail, 3,300 closed
cells, strict minima, and the all-cell trace hash. Reproduce it with

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search-next-v1/src/certify_h5_ratio_compact.py \
  --precision 256 \
  --output workstreams/all-degree-analytic-search-next-v1/results/h5_ratio_compact_arb.json
```

This promotes only the compact component of the fixed-H5 ratio theorem. The
outer argument remains analytic, and the signed `c5` payment remains open.

For an Ewald continuation, use the exact fractional-cell Peano placement
criterion in `EWALD_CURVATURE_PAYMENT_NEXT.md`. The earlier regional condition
in `EWALD_CORRELATED_PAIRING_NEXT.md` has been shown to require perfect sign
segregation and is not a viable target. Any worker must assemble the complete
corrected residual before forming curvature measures; do not test independent
cells or omit the mismatch term.

For an alternating-lattice continuation, the large-spacing half-cell is
already proved in `ALTERNATING_LATTICE_THETA_NEXT.md`. A useful governed run
would implement the compact lobe criterion of
`ALTERNATING_LATTICE_SCALE_NEXT.md` on one predeclared spacing interval bounded
away from zero, with direct complete-theta interval enclosures and the explicit
convex-tail remainder. Failure is informative only for this stronger
sufficient condition. Do not infer the first Laguerre sign from a finite mesh,
and do not use modular inversion to claim small-spacing closure.

`ZERO_INTEGRATED_COMPENSATION_NEXT.md` permits a fixed-residual computation
only after specifying a successfully verified height that satisfies its
explicit inside--outside comparison. Such a result remains polynomial-specific;
do not extrapolate it to a degree-uniform verified band. The heat-flow and
coefficient notes rule out generic maximum-principle and coefficient-only
transfers, so neither is a reason to launch another unconstrained sweep.

While the protected 4CT chain is active, revalidate its controller command and
exact working directory before any new governed calculation. Count all host
work against the sampled ceiling. Locked operation may target at most 90%
total CPU; unlocked or uncertain lock state may target at most 50%. Never
signal or modify an unowned process, and do not edit the protected live
scripts. Analytic work that does not benefit from parallel arithmetic should
leave spare CPU idle.

## Sixth-wave continuation gates

Do not launch another generic combined-channel covariance search.
`CORRELATED_TRACE_ARITHMETIC_NEXT.md` gives the exact three-block completion,
and its actual old-polynomial witness cancels both positive pieces, leaving
`Q[pi]=2S`. Any continuation must estimate that source-specific scalar
directly; changing quotient coordinates or applying one more joint Cauchy
inequality cannot lower it.

For H5, equation (44) of `H5_RATIO_AVERAGE_NEXT.md` is now known to lose
`delta_*^2 a^2`. Use the exact scalar target in equation (19) of
`H5_SIGNED_C5_PAYMENT_NEXT.md`, retaining the signed bottom-Turan integral,
the full ratio variance, and the old-prefix cost `E_5` as one expression.
Neither ratio ordering, generic bottom-Turan positivity, nor the
Planat--Sole four-jet cone is an admissible substitute for the missing `c5`
information.

For Ewald work, `EWALD_FRACTIONAL_PLACEMENT_NEXT.md` supplies the exact sine
family and triangular-kernel expansion. Pointwise fractional placement and
sample convexity are sufficient but strictly stronger than the scalar pivot.
A useful falsifier may test the assembled `m J_pi(m)` sequence, but failure
retires only that stronger route. Never sample raw theta or positive/negative
channels separately.

For the alternating lattice, the small-spacing series in
`ALTERNATING_LATTICE_SMALL_SCALE_NEXT.md` is additive, not a relative sign
asymptotic. Any claimed small-spacing closure must provide a rigorous lower
bound for the actual first harmonic that exceeds the certified odd-harmonic
tail. A finite Fourier truncation, completed-zeta upper bound, or a positive
value of `F(a)` at finitely many frequencies is insufficient.

For zero-based work, `ZERO_QUOTIENT_SAMPLING_NEXT.md` rules out a uniform
core-only contraction over all polynomials as a weaker lemma: conditional on
one off-line quartet its norm grows exponentially. The once-proposed escape
through the actual Galerkin residual is addressed below: retaining the
complete background-plus-exterior identity is necessary but not sufficient.
Do not infer a degree-uniform result from a fixed verified height.

Do not invoke source translation-kernel total positivity above order four:
`RECENT_PF5_BARRIER_NEXT.md` records the certified `PF_5` failure and exact
normalization transfer. Likewise, `VOLTERRA_QUOTIENT_CROSSWALK_NEXT.md` finds
no proved trace/isometry map from the cited normalized Volterra quotient to
this polynomial pivot. An external quotient certificate cannot be imported
without supplying that map and the endpoint limit.

## Seventh-wave continuation gates

Use `ALL_DEGREE_ASSEMBLED_SCALAR_NEXT.md` as the canonical moment-space
target. Under the old-prefix/range hypotheses with `m_k>0`, its reverse-anchor
formula is singular-safe. If `c_k>0` a.e. and the quotient integrals converge,
the normalized pivot keeps the signed local defect and covariance repair
assembled. Do not propose an induction using only the old prefix and border:
the newest moment enters the pivot with coefficient one. A useful worker must
bring a new complete-theta identity involving that newest Bell coefficient or
an equivalent signed regional comparison.

Do not assume that Galerkin orthogonality makes the actual residual avoid the
bad exterior direction. `ACTUAL_RESIDUAL_ALIGNMENT_NEXT.md` gives the exact
resolvent and a Christoffel countermodel with a positive old prefix and
negative next pivot. A zero-based continuation must control the mismatch
vector jointly with the near-unit sampling spectrum or prove the full
positive-background/exterior compensation directly. Separate bounds for the
vector and inverse old metric repeat the same loss.

The Sobolev-square coordinate is valid only as an integrated, source-specific
route. `ALL_DEGREE_SOBOLEV_SQUARE_NEXT.md` proves that at each nontrivial rung
`2N+epsilon>=1` every pointwise polynomial auxiliary has a negative leading
tail with deficit `(4N+2epsilon-1)/4`; the even base is separately positive.
It also shows that fixed auxiliary degree fails generically even on a positive
Gaussian ladder. Do not promote the noncertifying H5 cubic diagnostic to an
all-degree mechanism. A viable theorem needs a theta-specific auxiliary and a
margin that pays the growing deficit. Linear growth is the natural generic
scale, but a theta-specific fixed-degree miracle is not excluded; letting the
degree tend to infinity merely returns the target pivot.

For Ewald work, prefer the exact scalar coordinates of
`EWALD_WEIGHTED_PIVOT_NEXT.md`: the harmonic-weighted half-space or the full
Euler-renormalized Abel integral. Both are weaker than pointwise fractional
placement and retain the mismatch. Do not infer the scalar sign from finitely
many samples, differences, cells, or Abel parameters; the interpolation
theorem permits identical finite data with either scalar sign unless an
independent theta-specific tail or rigidity theorem is supplied.

For small spacing, treat the absolute first-harmonic lower bound as a
minimum-modulus theorem, not a consequence of the gamma envelope. The
relative log-decay lemma is closer to the harmonic problem but still assumes
`F>0`, the missing first-Laguerre sign. A useful continuation must prove a
discrete reverse-doubling estimate directly from complete-theta arithmetic or
provide the missing sign plus relative decay without using finite zero data.

Finally, do not launch a universal theta-channel contraction or generic
Hardy-convexity search. `TURAN_ARITHMETIC_FACTOR_NEXT.md` proves that a
degree-independent translation-intertwining contraction on either complete
parity cyclic range is equivalent to the global first-Laguerre sign, while
complex shift subharmonicity leaves the polynomial-transport curvature unpaid.
Any surviving contraction must depend on the actual residual/degree or break
translation invariance, for example through explicit modular/Ewald
compensation.

## Eighth-wave continuation gates

Do not treat positivity, evenness, analyticity, the formal Bell recurrence,
the differentiated first-orbit tail, or old integrated
moments as determining the newest Bell coefficient. The perturbation theorem
in `NEWEST_BELL_ARITHMETIC_NEXT.md` preserves all of those listed data while
moving the newest moment and pivot. It leaves the exact Jacobi family. A Bell
worker must therefore use additional complete-theta structure absent from the
perturbation, such as the exact orbit law, and must control the whole joint
orbit-score payment before splitting any high score or old-regression cost.
The score identity alone is target-equivalent and is not completion.

For zero/sampling work, use the assembled defect identity in
`THETA_MISMATCH_SPECTRUM_NEXT.md`. With the positive parent and old signed
block both positive definite, form the actual old restriction `C`, new column
`z=B phi_N`, and `alpha=mathcal A[phi_N]`. The live target is the directional defect
inequality
`abs(<z,g>)^2<=alpha(||g||^2-||C^*g||^2)` for every sampling-space `g`.
Source-free separate estimates on `z`, the spectral gap, and exterior reserve
discard the correlation and are ruled out by the coupled entire countermodel;
an estimate using new complete-theta structure is not excluded.

For a channel factorization, use the one-rung Julia-defect formulas in
`RESIDUAL_THETA_CONTRACTION_NEXT.md`. A useful contraction may depend on the
actual residual and rung or break translation invariance. It must prove
`||D_(C*)^(-1)z||^2<=||x_perp||^2`; merely defining the lift restates the
pivot. The damped Abel lemma is an admissible sufficient route only if its
seed `S_pi(z_0)>=0` and integrable damping `lambda_pi` are derived from the
complete theta/Euler source without using endpoint positivity.

Do not search for a positive interior Abel packet or a positive radial packet.
`EWALD_ALL_INDEX_COMPENSATION_NEXT.md` proves that every infinite interior
packet and its derivative change sign in both physical and Fourier space.
Pointwise monotonicity is not necessary and does not follow from generic
self-dual data; a theta-specific monotonicity theorem remains possible but is
stronger than needed. Prefer the Poisson--ceiling boundary trace and an
integrated sign-changing correlation, for example the source-derived damped
inequality above.

For the Sobolev route, equation (24) of
`THETA_SOBOLEV_AUXILIARY_NEXT.md` is an exact sufficient condition, but it is
not a uniform target: `REVERSE_SCHUR_ACTUAL_FAILURE_NEXT.md` rigorously
falsifies it at the actual `2N+epsilon=10` residual while the target pivot is
positive. Do not spend a worker tightening the same two-generator cap.
Enlarging the correlated space is admissible only with a uniform,
noncircular rule; unrestricted enlargement tends back to the target.

Finally, do not infer Hankel positivity from the positive imaginary-shift
norm. `CORRELATED_THETA_INEQUALITY_AUDIT_NEXT.md` gives the exact indefinite
transport correction between its Gram and the target exponential-Hankel
kernel. Full target-kernel positivity is the missing first-Laguerre sign, and
a strongly log-concave Gaussian heat family refutes a source-free repair.
Within this imaginary-shift route, degree-dependent control of the correction
using actual source-specific information, such as orbit arithmetic or its
complete modular/Ewald compensation, remains live.

## Ninth-wave continuation gates

Do not spend a new worker on stronger source-free tail or strip hypotheses.
`SUPERGAUSSIAN_TRANSPORT_NEXT.md` matches the leading theta
double-exponential tail, natural open shift strip, positivity, evenness, and
strong log concavity while retaining a negative transport direction. A useful
continuation must use exact Jacobi-orbit or modular/Ewald arithmetic.

Do not insert a raw finite positive-orbit truncation inside a quartet quotient.
`DIRECTIONAL_DEFECT_THETA_NEXT.md` proves that every such nonempty packet
leaves an odd center jet, giving an algebraic quotient tail and losing the
exterior reserve at high degree. Cancel all odd seam jets, by summing every
orbit or using an explicitly seam-free Euler/Ewald grouping, before reflection,
quotient formation, Cauchy, or polynomial weighting. The complete all-orbit
directional family is target-equivalent for a nonzero old prefix unless an
additional arithmetic reserve is supplied. For the empty prefix that family
is vacuous; verify the separate scalar base condition instead.

For the Abel route, use the explicit variation gauge in
`DAMPED_ABEL_THETA_NEXT.md`, not `-S'/S` and not a positive-packet premise.
With `z_0=alpha=1/2`, the only admissible continuation presently isolated is
to prove both the exact complete Poisson--ceiling seed `S_pi(1/2)>=0` and the
signed all-index Wronskian on `[1/2,1]`. The damping budget is at most `log 3`.
A numerical Abel grid, finite cells, or endpoint positivity cannot replace
either analytic obligation.

`EWALD_HARDY_BRIDGE_NEXT.md` identifies that Wronskian as a directional
cross-Hardy form and gives the root Mellin moments as exact Euler-cell sums.
If differentiating in the Mellin parameter, form each Euler-renormalized cell
first. The inserted logarithmic root factors have non-`L1` raw scale tails,
so differentiating the unrenormalized continuous-scale/root-Mellin source
under the integral is an invalid interchange. The live analytic alternatives
are a complete-theta cross-Hardy angle estimate or reverse curvature for the
root-resolved Euler cells.

For the two-generator score route, use the joint vector `(B,C+E)` in the
`K^(-1)` metric. `SOBOLEV_SCORE_PROJECTION_NEXT.md` gives the exact
projection identity, while `SOBOLEV_FIVE_SCALAR_NEXT.md` and
`RESIDUAL_SCORE_CONSTRAINTS_NEXT.md` show that generic Gram bounds,
convexity, target positivity, and the `q''`/dilation old-space identities are
insufficient. Do not estimate the two coordinates separately. This metric is
now a diagnostic of the failed compression, not a proposed uniform lemma.

The first odd base no longer needs a diagnostic:
`FIRST_ODD_THETA_NORM_NEXT.md` proves it analytically from the full Jacobi
orbit family. Any replay should check the incomplete-gamma recurrences,
rational outward bounds, and uniform `n>=2` ratio estimate; it must not
replace them by quadrature. The result is a single sufficient base case and
must not be labeled a first-Laguerre or higher-rung theorem.

`NEXT_LOW_THETA_SOBOLEV_NEXT.md` supplies the matching first nonconstant even
proof. Replays must verify the quadratic/discriminant reduction for arbitrary
real `c`, the incomplete-gamma recurrence and rational enclosures for the
first two orbits, and the geometric `n>=3` tail. The final source-only gate is
`4s<9r^2+6r-27`, discharged by `r>14/5` and `s<14`. Do not substitute the
rounded moment ratios or infer an induction to higher residuals.

For the all-degree Bell/orbit route, start from
`JOINT_ORBIT_SCORE_NEXT.md`. Keep the single global residual polynomial and
the complete orbit expectation inside the square. Under the two old coupled
prefixes, the live target is the complete mean-square Hardy inequality, not
positivity of raw orbit energy; the all-orbit variance is a cost. A stronger
noncircular continuation is the rootwise Mellin budget in
`COMPLETE_ORBIT_HARDY_NEXT.md`:

`sum_j 4 V_j/(1+V_j) <= 2`,

where `V_j=(log Z_j)''(0)` for the positive fractional-moment integrals.
Generic Hardy at a root supplies only the sharp constant `1/4` and is too
weak. A new proof must control the joint root budget through complete-theta
Mellin/Ewald arithmetic without collapsing by integration by parts to the
weighted first Xi--Laguerre target.

Treat that Mellin budget as a sufficient route, not a necessary diagnostic.
`MELLIN_ROOT_VARIANCE_NEXT.md` and `ROOT_VARIANCE_GEOMETRY_NEXT.md` give exact
Gaussian residuals with positive Hardy target but failed rootwise and
assembled log-variance bounds. Strong log concavity, dilation, and ordinary
Christoffel localization are therefore invalid proof substitutes. Also apply
the domain gate in `GREEN_HARDY_MELLIN_NEXT.md`: a raw finite positive-orbit
packet's Mellin strip excludes `s=0` at the campaign degrees. Perform the
complete modular orbit sum or an explicitly seam-free Euler/Ewald grouping
before taking a quotient or Mellin derivative. All-jet seam cancellation is
necessary for the domain but is not a quantitative bound.

## Tenth-wave continuation gates

The fixed-rung Sobolev certificates are reproducible but must not be promoted
to an induction. Replay them with the installed Arb Python recorded in each
receipt:

- `src/verify_next_odd_theta.py` for the `(1,1)` all-coefficient theorem;
- `src/verify_actual_even_theta.py` for the actual `(2,0)` residual;
- `src/verify_following_odd_theta.py` at both 300 and 420 bits for `(2,1)`.

Run `src/verify_cross_hardy_cell_order.py` with the standard-library Python to
replay the exact cell factorization and abstract no-go example.

Each replay must reproduce its frozen receipt byte for byte. Keep the
normalization `M_j=mu_j/4^j` when reading
`actual_total_certificate.json`, add the recorded outward decimal padding,
and retain `m_j=4pi n_j` when moving from half-line derivative norms to
whole-line frequency moments. A common-scale reading of the stored `mu_j` is
wrong.

For reference, `DEGREE_UNIFORM_THETA_SOS_NEXT.md` rewrites the failed
two-generator auxiliary as the reverse Schur cap

`D-E^2/A <= A(C+E-EB/A)^2/(A^2-B^2)`.

Do not try to prove this cap uniformly: the actual degree-ten theta residual
violates it. Ordinary Hankel positivity supplies only the lower Schur
complement, and adjacent Turan bounds remain too weak. Do not treat the trial
factor `q_c=(t^2-c)q` as the general actual residual recurrence; retain the
`q_(N-1)` cross terms in any larger correlated construction.

For the Hardy/Ewald route, use the division-free logarithmic form in
`CROSS_HARDY_EULER_CURVATURE_NEXT.md`; quotienting an Abel direction by `W`
introduces poles at real Xi zeros. Form every Euler cell before applying
`log|D|` or a root Mellin derivative. The double-cell curvature condition is
signed and requires all off-diagonal cell pairs.

For the bounded half gauge, `CROSS_HARDY_CELL_ORDER_NEXT.md` gives the exact
scalar target: prove the half-seed and

`(3M/2-2N)P'>=(3M/2-2P)N'` on `[1/2,1)`.

The stronger `P'N-PN'>=0` order is sufficient, not equivalent. The exact
standard-library replay checks the factorization and its abstract no-go; it
does not certify the actual theta order. Do not infer the sign from cell
magnitudes, seed, endpoint, cellwise positivity, or diagonal pairs.

## Eleventh-wave continuation gates

Replay the actual reverse-Schur failure from the checkpoint root with the
recorded Arb Python:

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_reverse_schur_actual_failure.py \
  --root . --precision-bits 400 \
  --output workstreams/all-degree-analytic-search-next-v1/results/reverse_schur_actual_failure.json
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/audit_reverse_schur_actual_failure.py \
  --root . --precision-bits 720 \
  --output workstreams/all-degree-analytic-search-next-v1/results/reverse_schur_actual_failure_independent_audit.json
```

The first proof uses exact orbits one through six and an analytic `n>=7`
tail. The independent campaign audit must continue to use its separate
`arb_mat`/determinant-ratio implementation, exact orbits one through eight,
and analytic `n>=9` tail. Both must retain outward padding before dividing
the archived `mu_j` by `4^j`. A failed cap with a positive archived target
pivot retires only the sufficient auxiliary.

`THETA_TURAN_SCHUR_NO_GO_NEXT.md` is replayed by
`src/verify_theta_turan_schur_no_go.py`. Its modified half-line moment `n_6`
is a moment-cone non-implication model, not the actual theta moment. Do not
promote adjacent Turan, Hankel, or J-fraction conditions to an actual
counterexample.

For the Sobolev branch, a new worker must specify a larger correlated space,
such as multiplication layers plus the prior same-parity residual, and prove
that its rule is noncircular and degree-uniform. A finite positive prefix is
only a falsifier check. The fixed two-generator space is closed as a uniform
route.

For the signed-cell branch, use the exact reverse-order identity in
`ACTUAL_EWALD_REVERSE_ORDER_NEXT.md`:

`W_alpha=C S'-2D`.

The separate seed, `S'>=0`, and `P B_k>=N A_k` for every cell tail imply the
hazard inequality. The 640- and 480-node receipts are
`PASS_DIAGNOSTIC_ONLY`; they use the first ten cells and floating quadrature.
They must never be cited as an Abel-interval, endpoint, all-index, or
all-degree certificate. A useful computation must develop an analytic tail
for the fully assembled cells rather than extend `nmax`.

The Brascamp--Lieb inequality in
`MODULAR_COMMUTATOR_N1_CONDITIONAL_AUDIT.md` is valid. The missing
definitions and exact bridge are now supplied and independently audited in
`MODULAR_COMMUTATOR_N1_FULL_AUDIT_NEXT.md`. Apply the commutator test only for
`a>0` and with the separate actual-prefix input `s_1>0`; its conclusion is
`C_1<0`, not a pivot sign.

## Twelfth-wave continuation gates

Replay the enlarged score certificate with the Arb-enabled Python recorded in
the receipt:

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_enlarged_score_projection.py \
  --root . --precision-bits 720 \
  --output workstreams/all-degree-analytic-search-next-v1/results/enlarged_score_projection_actual_rungs.json
```

The primary and replay receipts must be byte-identical with SHA-256
`f48debd201f0a234900b9217e9a2f7693a8803a5b4ded601df8ec15a82905bf0`.
The verifier source SHA-256 is
`b451f8cf4d78ba18272294bc08543ba552b87fea41d1ede1b26fc63ead3e83c3`.
Keep the archive rule `mu_j=4^j M_j`, applying serialization padding before
division, and the positive-moment rule `m_j=4pi n_j`. For `kappa=10`, the
enlarged auxiliary must use only `M_0,...,M_9` and `n_0,...,n_11`; `M_10`
is comparison-only. A positive finite-rung result is not a uniform theorem.

At this checkpoint the next Sobolev theorem-shaped target was the exact
one-feature inequality

`delta^2 >= -4 H_span(q',tq) sigma`

for the feature `t^2q'`, or a rigorously specified adaptive old-data feature,
at every actual complete-theta rung. The thirteenth-wave actual `kappa=15`
certificate refutes the fixed `t^2q'` option. The two-rung operator recurrence
does not propagate a fixed scalar Gram matrix: new multiplication layers
introduce new moments. Continue only with an adaptive old-data feature or a
growing dictionary; a finite positive prefix is not a uniform theorem.

Replay the two standard-library Ewald algebra checkers:

```text
python3 workstreams/all-degree-analytic-search-next-v1/src/check_ewald_bessel_tail_algebra.py \
  --output workstreams/all-degree-analytic-search-next-v1/results/ewald_bessel_tail_algebra.json
python3 workstreams/all-degree-analytic-search-next-v1/src/verify_ewald_scalar_cell_tail.py \
  --output workstreams/all-degree-analytic-search-next-v1/results/ewald_scalar_cell_tail_algebra.json
```

They check algebra and frozen constants; the analytic remainder proof is in
`EWALD_BESSEL_CELL_TAIL_NEXT.md` and the arbitrary-power contour bound is in
`EWALD_SCALAR_CELL_TAIL_NEXT.md`. Preserve the spectral-to-physical residual
map and keep the complete orbit sum assembled before any sign split.

For a certified Ewald continuation, choose a finite head cutoff and combine
outward enclosures for that head with margins derived from the proved
infinite-tail inequalities. The
three required inequalities are the half-seed, a uniform positive lower bound
for `S'` on `[1/2,1]`, and an upper bound proving aggregate `D<=0`. Do not
replace aggregate compensation by `P B_k>=N A_k` on odd rungs: the Bessel
tail is eventually positive, and the certified actual value `e_2(q=t)<0`
rigorously refutes that stronger condition at the first odd rung. This does
not refute aggregate `D<=0` and is not the missing Abel-interval certificate.

Do not launch a larger finite cell or degree sweep merely to consume CPU. A
new governed job must certify a finite analytic head against the proved tail,
or develop and falsify an adaptive/growing old-data score rule, while retaining
the lock-state CPU policy and leaving the protected 4CT scripts untouched.

## Thirteenth-wave continuation gates

Replay the compact source-free and endpoint-packet checkers from the
workstream directory:

```text
<arb-python> src/verify_u3_source_free_countermodel.py \
  --output /tmp/u3_source_free_countermodel.replay.json
python3 src/verify_ewald_endpoint_packet.py
python3 src/verify_modular_commutator_n1_bridge.py
```

The accepted source-free `U_3` receipt SHA-256 is
`c96352f987a0b28030a13f3ff8596dbfd78fe2135ad65d852b7dc6b8869e35ef`.
The endpoint-packet checker rewrites its frozen accepted result path and must
reproduce the transform polynomial,
Euler--Maclaurin constants, and factor `1/8`; its accepted receipt SHA-256 is
`549d1bf39370a63b188f1973c9a7cc1f4bfab3e161c1a802d5e7b10df14e86f8`.
The modular checker output must match
`results/modular_commutator_n1_bridge_replay.out` byte-for-byte, SHA-256
`75babc9a0b122f564ebe0f1fd5f3a597643bc3c1dc6dd2681c878035816f4c87`.

The full negative-head replay uses the recorded Arb interpreter:

```text
<arb-python> src/certify_ewald_kappa1_e2.py \
  --output /tmp/ewald_kappa1_e2_certificate.replay.json
```

Freeze the verifier before launch. Its SHA-256 is
`ae5e91dc5f8d4eecfe30f527257461dcc61302a44dcdc96e2c4ce0857cd40e24`;
the accepted receipt SHA-256 is
`b22fc12b2710807b9f124922959eef6348e1f9379d7e018c482313bd801cb99f`.
Require the finite Arb enclosure, both spectral-tail bounds, and the final
upper endpoint to be strictly negative. Do not infer aggregate `D`, the
half-seed, or `S'` from this one cell.

The fixed source-free `U_3` lemma and pointwise first-index-packet positivity
are retired. At actual theta rungs, use the inverse-free `N_3` identity and
bind the frozen source, signed-moment archive, complete positive-moment engine,
normalization, outward padding, and receipt hashes. A finite actual failure
would refute only that fixed dictionary; it would not refute the target pivot
or RH.

The actual `kappa=15` fixed-`U_3` obstruction is now accepted and closes that
dictionary as a uniform route. To replay its bounded downstream certificate
from the checkpoint root:

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_u3_kappa15_obstruction_20261103.py \
  --root . --precision-bits 800 \
  --output /tmp/u3_kappa15_actual_obstruction_replay.json
```

The verifier source SHA-256 is
`568a6159b08563a9af938927dae0cf8f8458a1fc7dc562eb66d26f82b0612050`;
the accepted 800-bit result SHA-256 is
`54a67b1978aaa0c9afc00df02e3e9549f064a54464d068a5540e5e157c0e6dad`.
The frozen signed-moment source and receipt SHA-256 values are respectively
`dc5828f6ce61a461d5a881c08d0e4034dab473f85dabd20be488dd4b5f6ff178`
and
`94d3741b7eabecf2f0f0ccc33a2786f8a4eaae752a98e1076fe08389828b1eff`.
The signed generator's clean replay takes about 200 single-core seconds and
differs in PID/elapsed metadata only; compare all moment endpoints,
remainder bounds, provenance, and the canonical scientific payload rather
than requiring the metadata-dependent whole file to match. `M_15` must remain
absent. Do not reinterpret the negative auxiliary as a negative target.

At this checkpoint the live modular task was the correlated opposite-tilt
inequality, and the live Ewald task was finite-head compensation for the seed,
`S'`, and `D`. The fourteenth wave closes both tasks only at `N=1`/`kappa=1`.

## Fourteenth-wave continuation gates

Replay the exact adaptive-score barrier from the workstream directory:

```text
python3 src/verify_adaptive_score_finite_degree_barrier.py \
  --output /tmp/adaptive_score_finite_degree_barrier.replay.json
```

The source SHA-256 is
`eab3a1943a9caed5073b00217a0852b11fbd1e18db1ef1ad24588278bc314f11`;
the accepted receipt SHA-256 is
`c418f268177a8b857c002297e0b7b37040ead056b8fc77e4d970cf7249e09018`.
The finite samples audit closed moment formulas only. The proof that every
fixed degree ceiling fails source-free is the asymptotic argument in
`ADAPTIVE_SCORE_FINITE_DEGREE_BARRIER_NEXT.md`.

Replay the recurrence-aware prior-derivative certificate from the checkpoint
root:

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/verify_prior_derivative_score_20261103.py \
  --root . --precision-bits 800 --output /tmp/prior_derivative_score_800.json
```

The verifier SHA-256 is
`45467394a474ae3e53cda98d91eb6c4ebde62afe84d76264ed1cef1c72683aeb`;
the accepted 800-bit receipt SHA-256 is
`77cb034a3c488d77a3ec52ae9429a3f14b92ba8a796a15745b4c80248c92ddfe`.
A 900-bit replay has SHA-256
`98b2090ee2ea53d6313e3f91209ea05fccfeb7a926f7b1ff5ed3379f9061b6ab`.
Require exact rank, positive `Delta_2`, `det K_3`, and `N_prior`, and absence
of each new `M_kappa`. Thirteen positive rungs are a falsifier check, not the
uniform theorem `N_prior(N,epsilon)>0`.

The standard-library conditional Ewald checker is

```text
python3 src/verify_ewald_single_negative_compensation.py
```

It rewrites its deterministic accepted result. The source and receipt SHA-256
values are respectively
`493e926d2d93f5246359ac57b55defdc1752dbf1fd73d2584a56272f226c9d6e`
and
`0a2ba64c8401934cd26494a9d706dc393e93dfd4e426dd0b749ffe7884051057`.
Do not apply its endpoint equivalence without the sole-negative-cell sign
pattern.

Replay the actual sign-free `kappa=1` aggregate certificate from the
workstream directory:

```text
<arb-python> src/certify_ewald_kappa1_aggregate.py \
  --output /tmp/ewald_kappa1_aggregate.replay.json
```

The frozen source SHA-256 is
`1e813e55f13f6cd74d4cb8f16706228bf3e7ac46df089b37fbc3ef22bd1e1a3f`;
the byte-identical receipt SHA-256 is
`57b9f9c63e4c3ac5f2292c25b90c99881d7bf1e3c3f3d5163b5b4ceb4fec4345`.
Require complete cells one through six, the evaluated `Y=20` global tail
constant, sign-free `T_0,T_1`, and strict seed, derivative, placement, and
`-D` margins. Do not extrapolate the base rung to higher degrees.

Finally replay the modular tilt certificate from the checkpoint root:

```text
<arb-python> workstreams/all-degree-analytic-search-next-v1/src/certify_modular_vprime_tilt.py \
  --spatial-cells 4096 --parameter-cells 64 --precision-bits 192 \
  --output /tmp/modular_vprime_tilt.replay.json
```

The source SHA-256 is
`31cd42b5a31157b9ff885c9fd1a3117522a2f014b7bd829b14c6f6d87063794e`;
the accepted receipt and canonical payload SHA-256 values are
`1db1987de3a7542c5cf02e45178b5d5dd65a76c1f2bfaeaa176184d5810290e5`
and
`f0ab78590eefb0d9c576eccdf33a95a2eaf72227b33e3bdcc28f448db11c103d`.
The deployed Arb balls conservatively enclose the exact rectangle: the primary
superset is `h in [-2^-41,2+2^-41]`,
`a in [-2^-38,1/4+2^-38]`, and the replay uses `2^-42`, `2^-39`. The proof
note audits the `|a|<=1/2` tail safety range and the checked
`|2ah|<1001/1000` `sinhc` remainder domain, so this outward padding does not
weaken the certificate.
Require the divided `a=0` limit, complete `n>=9` orbit and `h>=2` spatial
tails, full rectangle coverage, `R<0`, and `s_1/(2a)>0`. The conclusion is
only `C_1<0`; by itself it underpays the separate boundary/`s_2` cost. The
fifteenth-wave endpoint result below pays that cost locally near zero, not on
the full campaign interval.

## Fifteenth-wave continuation gates

Replay the exact source-free prior-score countermodel from the workstream
directory:

```text
python3 src/verify_prior_derivative_source_free_countermodel_20261103.py \
  --output /tmp/prior_derivative_source_free_countermodel.replay.json
```

The source and byte-identical receipt SHA-256 values are respectively
`ffadda9b2765a50bdb4c9b63eb5b114adfe3d0dfbe09db4ad3e43e3116a5f60f`
and
`38bfc145beb130154d122b50f1a1fface451a11dd0292b5fd92d40b9f3e0480e`.
Require the positive old determinant, positive current target, positive Gram
determinant, and negative bordered auxiliary. This countermodel is not theta.

Replay the stronger log-concave barrier with the recorded Arb interpreter:

```text
<arb-python> src/verify_prior_derivative_supergaussian_barrier.py \
  --output /tmp/prior_derivative_supergaussian_barrier.replay.json \
  --precision-bits 384
```

The source and 384-bit receipt SHA-256 values are respectively
`aa7c35bb5f2a32087c98a9421d8493b0cef2d8f6efd80e5654dfb3fefa6d2f39`
and
`b6465f43eb03fc3abfde15ebb680ffdc6837ed2f5fe12dc0ea40ae49adcbabfa`.
Require target density `12t^2 exp(-2t^4)>=0`, positive Gram determinants, and
strictly negative degree-seven and degree-eight auxiliaries. This retires
generic log-concavity/Favard/CD proofs, not the actual-theta rule.

`EWALD_PARITY_TAIL_COMPENSATION_NEXT.md` is exact algebra and has SHA-256
`2f686d90249e7c277972fa39ab63f208fdd71f982c5ed766f031cfb021844a56`.
There is no numerical replay. Check the eventual-sign premise before applying
the odd centered-moment or even support-separation formulas. The fixed-residual
Bessel asymptotic is not uniform in degree.

Replay the modular payment reduction from the workstream directory:

```text
python3 src/verify_modular_n1_s2_payment_reduction.py \
  > /tmp/modular_n1_s2_payment_reduction.replay.json
```

The provenance-hardened source and byte-identical receipt SHA-256 values are
respectively
`5fb1b8c78634662c739b04853c1044dbd5b7d339e02b5fcbecc8508d1e1df663`
and
`93c708a1f8b1567b32ca62d1a02e8a9927ef165b1c99e924af6730eef7e72624`.
The checker binds the modular-tilt, integrated-square, and curvature-square
receipts. Require the exact finite-`a` underpayment identity and the strict
rational endpoint margin. The conclusion is `N=1` payment at `a=0` plus an
unspecified local `a_0`; it is not full coverage of `0<a<=1/4`.

Do not launch larger degree or cell tables merely to consume CPU. The useful
next targets are the complete-theta nonlinear-drift/predecessor alignment,
a degree-uniform Bessel threshold and finite-head margins, and an explicit
extension of the local modular payment through `0<a<=1/4`, followed by higher
degrees. Continue under the lock/load policy and never touch protected 4CT
files or processes.
