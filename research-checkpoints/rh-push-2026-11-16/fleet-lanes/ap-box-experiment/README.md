# ap-box-experiment: finite-stage Lee-Yang sweep

Question tested: is there a truncation or regularisation scheme under which the zeta input has all zeros real
(Lee-Yang property) at every finite stage, while each control fails at some finite stage?

## Files

| file | content |
|---|---|
| `lylib.py` | inputs, finite-stage objects, certified tests (Arb via python-flint) |
| `bohr.py` | Bohr lifts (multivariate) and stability test on random and adversarial torus points (float64) |
| `sweep.py` | scheme x size x input sweep; one OS process per task; JSON-lines checkpoint; resumable |
| `summary.py` | table: per scheme and input, largest passing size and first failing size |
| `selftest.py` | 16 checks of the library against independent values (about 20 s) |
| `results/local.jsonl`, `results/local-summary.md` | local small-scale run (435 tasks) |
| `logs/` | local run logs, `box-tasklist.txt` (975 box tasks with planned memory) |

Requirements: Python 3.12, numpy, scipy, mpmath (not imported by the sweep), python-flint 0.9. CPU only.
Tested locally with Python 3.14.10, python-flint 0.9.0, numpy 2.5.3, scipy 1.18.1.

## Command for the box

Copy this directory, `cd` into it, then (the part after `taskset -c 32-39` is the command):

```
systemd-run --user --slice=rh.slice --unit=ap-box --collect --working-directory="$PWD" \
  taskset -c 32-39 \
  env RH_WORKERS=8 RH_TASK_GB=24 RH_TOTAL_GB=48 RH_TASK_SECONDS=21600 \
  python3 -u sweep.py --tier box --out results/box.jsonl
```

Before it: `python3 -u selftest.py` (must print `SELFTEST PASSED`) and
`python3 sweep.py --tier box --list | tail -5` (task list with planned memory, no computation).
After it, or at any time while it runs: `python3 summary.py results/box.jsonl --md results/box-summary.md`.

Re-running the same command resumes: keys already in `results/box.jsonl` are skipped. Add `--retry-failed` to
re-run tasks that ended `KILLED_MEM`, `KILLED_TIME` or `ERROR`, and `--retry-unresolved` for verdict `UNRESOLVED`.
`--only jensen,afe` restricts to schemes. Tasks run in increasing order of estimated cost.
Optional second run: `--tier boxbig` (Jensen degree 4096, 6 tasks, planned 73 GB each: needs
`RH_WORKERS=1 RH_TASK_GB=76 RH_TOTAL_GB=60 RH_TASK_SECONDS=200000`; not recommended inside an 80 GB slice with
anything else running).

### Memory control

* Before a task starts the parent prints `[plan] <MB> planned <task>`; the estimate comes from the sizes the task
  allocates (`plan()` in `sweep.py`).
* A task whose plan exceeds `RH_TASK_GB` is not started (`SKIPPED_PLAN`; 3 box tasks, `heat:-1` Jensen at
  degree 128, 29-30 GB).
* A task is started only if the sum of the plans of running tasks stays below `RH_TOTAL_GB`.
* The parent polls each child's resident memory (`/proc/<pid>/statm`) every 0.5 s and kills a child above
  `min(RH_TASK_GB, max(1.5 GB, 1.25 x plan))` (`KILLED_MEM`) or older than `RH_TASK_SECONDS` (`KILLED_TIME`).
* Bound on total resident memory with the command above: 1.25 x 48 + 8 x 1.5 = 72 GB, below the 80 GB slice.
  On Linux each child also sets `RLIMIT_AS` to `RH_TASK_GB + 2` GB.
* No dense matrices are built anywhere. The largest objects are Taylor series of length 2(d+n)+2 at 40 d + 256
  bits (Jensen) and a cache of at most 2e6 Taylor-model coefficients per task (about 0.5 GB at 1000 bits).

## Expected run time and memory per stage (box tier)

Measured on the Mac (one core, Apple silicon); box figures are extrapolations with the stated scaling and can be
off by a factor 2 to 3. Totals are core-hours; wall time is about total / 8.

| stage | box sizes | local measurement | scaling used | largest task | stage total | peak memory per task |
|---|---|---|---|---|---|---|
| `jensen` | d <= 2048, shifts 0, 8, 64, 9 inputs | zeta d=256: 5.0 s, 155 MB; d=512: 49 s, 499 MB; dh d=256: 18.4 s. Series 96% of the time, Sturm 4% | time x 9.7 per doubling of d; memory about 20 bytes x order x bits | dh d=2048: 4.6 h; zeta d=2048: 1.2 h | 60-90 | d=1024: 1.6 GB; d=2048: 5-8 GB (plan 19 GB) |
| `jensen` heat inputs | d <= 128 | heat:-1, d=64, n=8: 169 s, 1.24 GB | precision grows by log2((2(d+J))!) | heat:-0.05 d=128: about 1 h | 5-10 | up to 24 GB (above: skipped) |
| `afe` (sharp, riesz1, riesz2) | N <= 500, T = 400 | N=20, T=60: 2-3 s, 15k-27k evaluations | evaluations ~ T; cost per evaluation ~ N | N=500: 10-25 min | 10-20 | < 0.3 GB |
| `euler` | P <= 997, T = 200 | P=47, T=30: 4-28 s | ~ T x pi(P) x 3 | P=997: 0.5-1 h | 5-15 | < 0.5 GB |
| `thalf` | N <= 8, T = min(700, 8(N+1)^2+20), Y = 4 | N=3, T=80: 22-33 s | ~ T x K x N x precision, K ~ (1.13 T + 24)/3 | N=8, T=668: 4-5 h | 10-20 | < 1 GB |
| `polya` | N <= 20, T = 200 | N=3, T=40: 12 s | same | N=20: about 1 h | 5-10 | < 1 GB |
| `dbn` | N = 6, T = 150, lam in {-1, -0.25, -0.05, 0.05} | N=4, T=62: 120-215 s | ~ T x N x quadrature cost | 1-2 h each | 8-16 | < 0.3 GB |
| `bohr` | P <= 997; N <= 200 | all local tasks: 95 s | minimiser ~ variables^2 | minutes | < 1 | < 0.3 GB |

Sum: 100 to 180 core-hours, i.e. roughly 13 to 23 hours of wall time on 8 cores. `RH_TASK_SECONDS=21600` stops
any single task at 6 hours; such a task is recorded as `KILLED_TIME` and the sweep continues.

## What a verdict means

* `jensen`: `PASS` = the Jensen polynomial J^{d,n} has d real roots; `FAIL` = fewer. Decided by a Sturm chain in
  ball arithmetic in which every sign is separated from 0; the precision is raised by 3/2 until this holds.
  Coefficients are Arb enclosures of the Taylor coefficients of the completed function at s = 1/2.
* object schemes (`afe`, `euler`, `thalf`, `polya`, `dbn`): window |Re z| <= T, |Im z| <= Y, with s = 1/2 + iz.
  `FAIL` = a certified positive number of zeros with eta < Im z < Y (argument principle); `PASS` = no such zero
  and the certified total number of zeros in the window equals twice the number of certified sign changes on
  (0, T), so every zero in the window is real and simple; `UNRESOLVED` otherwise. The field `high` repeats the
  test on 10 <= |Re z| <= T when the full window fails below height 10.
  A `PASS` says nothing about zeros with |Im z| > Y (Y = 1.25, 0.35 for `euler`, 4 for `thalf`).
* `bohr`: float64, not certified. `PASS` = R(sigma,t) m(sigma) > 1 on the sigma grid at t = 14.

Enclosures on contour segments use Taylor models built from point evaluations with a Cauchy bound (class
`Expander` in `lylib.py`); naive ball evaluation fails for the kernel schemes because their terms cancel to
exp(-pi t/4). Float arithmetic enters only in summing certified argument increments (error far below the 0.05
rounding tolerance) and in `bohr.py`.
