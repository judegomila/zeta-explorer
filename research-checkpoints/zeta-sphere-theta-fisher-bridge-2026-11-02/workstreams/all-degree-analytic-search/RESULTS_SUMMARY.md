# Completed analytic-swarm results

Snapshot: 2026-11-03. These results select and reject analytic routes. They
are not interval certificates, an all-degree reflected-contraction theorem,
or evidence that proves RH.

## Execution and resource integrity

- The deterministic queue declared 165 tasks: 5 exact structural generators,
  60 reflected-operator jobs, and 100 parity-residue jobs.
- All 165 expected JSON outputs exist, parse, and match their queued status and
  parameters. The supervisor started and completed 164 unique tasks with
  return code zero; the remaining degree-6 operator smoke result already
  existed and was correctly skipped. Recorded result hashes match the files.
- There were no worker failures and no `failed.jsonl`. One early `iostat`
  timeout invoked the fail-safe before any workers had started; load sampling
  recovered and the queue then ran normally.
- The final heartbeat recorded two-key agreement that the Mac was locked, the
  protected 4CT command and working directory still matched, a five-worker
  cap, an 84% busy target below the user's 90% ceiling, and 16% total-host
  busy. The supervisor emitted `queue_complete` and exited normally. It was
  not restarted after the queue was exhausted.

## Exact recurrence substrate

The exact generator checked degrees 16, 32, 64, 96, and 128, covering 341
grades. Every emitted grade satisfies

```text
P_j/P_0 = A_j + c_j/(2z-3),     c_j + ell(A_j) = 0
```

together with the recorded degree, leading-coefficient, and divisibility
checks. The resource growth was:

| Degree | Grades | Terms | Largest coefficient | Approximate exact bytes | Content SHA-256 prefix |
|---:|---:|---:|---:|---:|:---|
| 16 | 17 | 374 | 63 bits | 13,645 | `3fbf8001` |
| 32 | 33 | 1,254 | 146 bits | 51,849 | `51f52c8f` |
| 64 | 65 | 4,550 | 335 bits | 238,728 | `f6fcee25` |
| 96 | 97 | 9,894 | 542 bits | 638,735 | `578f906a` |
| 128 | 129 | 17,286 | 762 bits | 1,337,019 | `344266fe` |

This is exact finite algebraic substrate for formula mining. It does not
supply the missing all-degree sign inequality.

The recurrence has also been resummed exactly. With exponential-generating
variable `t`,

```text
sum_j P_j(z)t^j/j!
 = exp(t/2-z(exp(2t)-1)) P_0(z exp(2t)),

sum_j c_j t^j/j!
 = 3 exp(5t/2-(3/2)(exp(2t)-1))(exp(2t)-1).
```

`GENERATING_FUNCTION.md` gives the corresponding removable-pole formula for
all `A_j` and its exact even/odd symmetrization. This replaces further
finite-degree recurrence mining with a direct saddle/canonical-product target;
it still does not settle the bridge sign.

## Reflected-operator sweep

The 60 jobs covered degrees 6 through 16, shifts
`0,1/16,1/8,1/4,1/2`, and 512/1,024 Gauss--Legendre nodes. Their 120 parity
blocks had the following stable finite pattern:

- Every parent-relative signed section was numerically positive and admitted
  a strict numerical Cholesky factor. The smallest observed eigenvalue was
  `0.0037279177534788976` at degree 16, shift `1/16`, even parity, and 1,024
  nodes. The largest observed negative-over-positive generalized eigenvalue
  was `0.9925718560024926`, still below one numerically.
- Quadrature doubling changed a minimum eigenvalue by at most `2.6311e-11`, a
  maximum by at most `5.9478e-11`, and the width-4 residual by at most
  `4.9121e-10`. Every displacement rank was unchanged by the doubling.
- The simple fixed-rank template fails. Commutator/anticommutator rank ranges
  grow from `2--4 / 3--4` at degree 6 to `8 / 8--9` at degree 16. Every block
  at degree 12 or above has both ranks greater than four at relative threshold
  `1e-8`.
- The simple fixed-width template also fails in this whitened monomial basis.
  Width-4 signed off-band Frobenius ratios are `0.0235--0.1149` at degree 12,
  `0.1008--0.1451` at degree 14, and `0.1271--0.1446` at degree 16. The
  corresponding Cholesky residual reaches `0.1432`.
- All parent multiplication compressions are far from self-adjoint in this
  representation: their relative adjoint defects lie between `1.41423` and
  `1.41772`. Low-degree rank/width candidate flags are largely consequences
  of the block dimension and should not be promoted to a structural ansatz.

The positivity pattern is robust enough to motivate a degree-dependent
reflected-border identity. It does not justify a fixed rank-4 displacement, a
fixed width-4 Cholesky factor, or a positivity claim: quadrature and orbit
tail errors are non-rigorous, and the retained parent condition number reaches
about `5.26e5`.

## Parity-residue sweep

All 100 outputs share one worker source hash and retained at least 224 nominal
digits beyond the reported scaled interpolation condition loss. The maximum
`log10` condition was about `71.55`; relative root residuals tracked the
working precision.

At the modular center `h=0`, the two parity ladders separate sharply:

- Even-parity `log10(|ell(A)|/||A||)` grows from `0.819` at `N=2` to
  `168.177, 384.439, 688.102, 1079.128` at `N=16,24,32,40`. The functional
  value approaches approximately `-0.2507419859` while the ideal exact-zero
  tail norm collapses. The `+160`-digit replays agree through `N=40` by far
  more digits than needed to resolve this growth.
- Odd-parity values instead decrease through the resolved numerical range:
  `-3.858` at `N=2`, `-193.352` at `N=16`, `-296.861` at `N=20`, and
  `-422.232` at `N=24` in the 916-digit replay. The `N=32` and `N=40` numeric
  replays hit the cancellation floor; their apparent rebound is roundoff.

The odd-center behavior has an exact explanation, promoted separately in
`ODD_CENTER_LEMMA.md`. Modular parity gives, for every finite odd-grade
combination,

```text
ell(A) = sum_n w_n A(pi n^2) / S,
w_n = pi n^2 (2 pi n^2 - 3) exp(-pi n^2),
S = sum_n pi n^2 exp(-pi n^2).
```

Consequently `|ell(A)| <= (W/S)||A||_L2(p)` with `W=sum_n w_n` and
`W/S approximately 3.28926794949`. If `A` vanishes at the first `N` orbit
nodes, the sharper bound is

```text
|ell(A)|/||A||_L2(p) <= sqrt(W sum_{n>N} w_n)/S,
```

whose leading decimal exponent is
`-pi N^2/(2 log(10)) + O(N+log N)`. This is an exact all-degree odd-sector
residue payment at the single center point, not the reflected contraction.
For the interpolation family, the exact bound has base-10 logs `-738.5262`
at `N=32` and `-1142.1931` at `N=40`, replacing the unresolved numeric values.

At `h=1/4` and `h=1/2`, both parities have an apparent nonzero limiting
functional and rapidly growing ratios. Conservative points before the
approximate-root residual overtakes the ideal exact-zero tail are `N=24` at
`h=1/4` (log ratios `660.862` even and `658.158` odd) and `N=16` at `h=1/2`
(`505.871` even and `503.893` odd). Larger reported values lack independent
precision replays and are only pattern evidence.

The center therefore has an exact parity-selective cancellation, while a raw
pointwise orbit-Gram payment is already obstructed for the even ladder at the
center and for both ladders away from it. A viable proof route must keep the
`h` integration, signed cross-orbit correlations, and the modular residue
coupled rather than paying them pointwise and separately.

## Route decisions

Retain:

1. a degree-dependent reflected border recurrence whose positive budget may
   shrink but cannot cross zero;
2. a two-channel `h` versus `-h` factorization or Hardy estimate that preserves
   parity, `h` integration, and cross-orbit terms;
3. the exact arbitrary-grade recurrence as the algebraic substrate for either
   route, now in the closed generating-function form recorded in
   `GENERATING_FUNCTION.md`.

The exact Hadamard pairing has now been written explicitly in
`MODULAR_PAIR_DECOMPOSITION.md`: for each parity, one channel is a pure scalar
multiple of `q` or `q'`, while the other retains the corrected feature and the
signed residue correlation. The remaining analytic blocker is to place this
split inside the actual paid-twin border recurrence and control it in the
complete bridge metric.

Reject in the current representation:

1. fixed rank-4 displacement or fixed width-4 Cholesky factorization;
2. separate raw orbit-Gram payment in each parity at each `h`;
3. positivity transfer from a fixed Euler-symmetrized approximant, whose
   degree-dependent signed endpoint layer survives at every degree;
4. interpreting any larger finite degree or cell-count sweep as closure.

The completed queue leaves no RH worker running. Further compute should be a
new, non-duplicative analytic queue that discriminates between explicit
degree-dependent border identities or signed `h`-integrated compensation
laws. Re-running this queue would only duplicate completed finite evidence.
