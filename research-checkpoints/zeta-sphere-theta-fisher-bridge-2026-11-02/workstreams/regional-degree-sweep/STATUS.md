# Regional degree sweep — status

## Hypothesis under test

The frozen v31 degree-7 certificate shows a negative optimized central
remainder paid by the variation forced by the globally selected regression
coefficients. This workstream tests whether the same exact regional identity
survives across spatial splits and higher finite odd degrees.

## Baseline

- Frozen checkpoint commit: `337c2e36698a08bd0b7fd1ea5402f10e85207ef3`.
- Frozen source result: `ZSV-DEGREE7-REGIONAL-PAYMENT`.
- Reference implementation:
  `evidence/v31-continuation/theta_correlated_local_v1/check_degree7_eighth_partition.py`.
- Reference source SHA-256:
  `461709e057b681e5a6afdcf504c6286c0b5c8a8cb9522b84dc8df2183774a55a`.

The frozen evidence is read-only. Generated work lives only in this workstream.

## Experiment

`src/regional_atlas.py` retains the complete-theta orbit enclosure, midpoint
second-derivative error, full spatial-tail bound, actual regional old metrics,
actual global coefficients, and signed regional remainders. It generalizes the
odd ladder to degrees 7, 9, ..., 19 and evaluates 128 cell-aligned splits on
`0 < H <= 1`.

The progressive queue contains 49 jobs: seven degrees at cell counts from
4,096 through 16,777,216. Every result is written atomically and a restart
skips validated completed outputs.

The inherited spatial-tail composition estimate needed a stronger auxiliary
floor at higher derivative order. The floor `z=170` is valid because the
spatial tail begins at `pi*exp(4) > 171`. It certifies the preflight through
degree 17. Degree 19 still fails the current sufficient composition bound and
is retained as an explicit analytic blocker; the preflight now occurs before
quadrature so those jobs fail immediately instead of consuming a full sweep.

## CPU and coexistence contract

- Protected 4CT controller: PID `76469`, whose command and working directory
  must both match before it is considered active.
- While the screen is locked and 4CT is active: at most five new workers.
- After 4CT exits, while locked: at most fifteen new workers.
- When unlocked, or whenever lock detection is uncertain: at most five new
  workers and a 42% whole-host busy target, leaving more than one logical
  core of sampling headroom below the user's 50% ceiling.
- Locked target: 84% whole-host busy, leaving more than one logical core of
  sampling headroom below the user's 90% ceiling.
- The governor samples total host CPU with `iostat`, uses both
  `IOConsoleLocked` and `CGSSessionScreenIsLocked`, and pauses/resumes only
  process groups it created and recorded.
- Failure to sample total CPU pauses all owned workers.

macOS has no installed hard percentage limiter. This is a conservative sampled
governor using `SIGSTOP`/`SIGCONT`, background QoS and nice level 15; it cannot
promise a zero-duration transient never crosses a ceiling between samples.

## Current evidence grade

Finite interval experiment only. A successful finite ladder, even through
degree 19 and many partitions, is not an all-degree theorem, an all-shift
result, a hierarchy extension or an RH proof.

## Stop and recovery

Status:

```sh
python3 workstreams/regional-degree-sweep/src/control.py status \
  --run-dir workstreams/regional-degree-sweep/run
```

Graceful stop:

```sh
python3 workstreams/regional-degree-sweep/src/control.py stop \
  --run-dir workstreams/regional-degree-sweep/run
```

The supervisor resumes any stopped child, sends `TERM` only to its recorded
process groups, waits 30 seconds, and reports rather than force-killing a
straggler. Restarting the same launch command resumes from atomic result files.

## Known baseline issue

The sparse isolated checkout's checkpoint-level `verify_archive.py` currently
reports a missing historical v19 file,
`paid_relaxation_v2/certify_n2_final.log`. This predates and is independent of
the new workstream. The v31 degree-7 scientific replay itself passes.
