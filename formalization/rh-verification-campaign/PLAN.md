# RH verification campaign: (3.0001753e12, 6.0e12] and (3.0001753e12, 7.8e12]

Status: PLAN plus local pilot measurements. Nothing has been launched. No cloud resources have been created. No new
verified height is claimed. This document prices and specifies the input that the s145 contracts need,
"RH verified to T*" (`src/data/s145-raymond-height-contract-2026-09-30.js`), and describes how to produce it.

Grades used below: **certified** = interval arithmetic, assuming FLINT 3.6.0 is correct; **measured** = timings
on this machine; **heuristic** = extrapolation or an estimate that has not been measured.

## 0. What the campaign would establish

Platt–Trudgian (PT 2021, arXiv:2004.09765) verified that all zeros with ordinate 0 < γ ≤ 3,000,175,332,800 are simple
and on the critical line. There are N(3,000,175,332,800) = 12,363,153,437,138 such zeros. The campaign would extend this
to

| stage | upper ordinate T* | consumer | ΔT | zeros in (T_PT, T*] |
|---|---|---|---|---|
| S1 | 6.0000000063e12 | s145 contract (b), MTY band, 0.1449877 (heuristic until H1/H2 exist) | 3.000e12 | 1.302e13 |
| S2 | 7.80000000474e12 | s145 contract (a), 0.144960216 (conditional; G0 open) | 4.800e12 | 2.097e13 |

T* = (x_w + 1)/2 with x_w = Raymond's wall abscissa in z-units (x = 2γ). Verifying RH to T* is a **necessary** input to
these contracts. It is not sufficient: contract (a) also needs the independent referee of Raymond's analytic chain
(G0, open), and contract (b) also needs the H1 strip and H2 far-field certificates plus the band lemma.

## 1. Method used by the pilot

FLINT 3.6.0 (`/opt/homebrew`) contains the D.H.J. Polymath (2019) interval implementation of Platt's method:

* `acb_dirichlet_platt_multieval`: evaluates Platt's Gaussian-scaled Λ on a grid of A·B = 8·4096 = 32768 points
  (spacing 1/8, width 4096) centred at an integer T, using K Taylor terms of a J-term Dirichlet sum and K
  length-32768 DFTs. Every truncation and discretisation error is added as an explicit ball radius (Platt 2017
  Lemmas 3.2, A.5, A.7, A.9, A.11, B.1, B.2).
* Gaussian-windowed Whittaker–Shannon interpolation (`acb_dirichlet_platt_ws_interpolation`) with a rigorous
  interpolation error bound gives Z(t) at any t inside the usable part of the grid.
* `_isolate_zeros` (in `platt_local_hardy_z_zeros.c`) runs Turing's method in the variant of Arias de Reyna (2012).
  A good Gram point is an anchor once it is the centre of 2·b consecutive good Gram blocks, where
  b = ⌈min(0.0061 L² + 0.08 L, 0.0031 L² + 0.11 L)⌉ with L = log g (`acb_dirichlet_turing_method_bound`;
  b = 6 near 3e12). At an anchor g_m, N(g_m) = m + 1 exactly. Between consecutive anchors x < y, it exhibits
  y − x interval-certified sign changes of Z. Every zero with ordinate in [g_x, g_y] is therefore simple and on the
  line, and every returned zero carries its exact index.
* Parameters (J, K, h, H, σ_grid, σ_interp, N_s) are FLINT's built-in fits for n ∈ [1e7, 2e17). These parameters
  affect only success and speed. Rigor does not depend on them, because every error term is enclosed.

### Gluing lemma (chunks and jobs)

Suppose chunk c certifies the zeros with indices n_c..m_c, chunk c+1 certifies n_{c+1}..m_{c+1}, and
n_{c+1} ≤ m_c + 1. Then every zero with index in [n_c, m_{c+1}] is simple and on the line. Also, every zero ρ with
γ_{n_c} ≤ Im ρ ≤ γ_{m_{c+1}} has index in that range.

Proof: indices are exact values of N at Turing anchors, and zeros are ordered by ordinate with multiplicity. A zero
strictly between the certified zeros m_c and m_c + 1 would need an index strictly between two consecutive integers.
A second zero with the same ordinate as a certified zero would have been counted inside that certified zero's
anchored segment, where all zeros are accounted for. ∎

`chain` requests n_{c+1} = m_c + 1 exactly. Jobs overlap by 50 height units, and the assembly check requires
n_first(job k+1) ≤ n_last(job k) + 1.

## 2. Pilot results (measured on Apple M5 Max under a background load average of 8–13; single-threaded workers)

Code: `pilot/` (copied from `tmp/b145-D-pilot/`). Raw logs: `tmp/b145-D-pilot/runs/`.

Build: `cc -O2 -o chain chain.c -I/opt/homebrew/include -L/opt/homebrew/lib -lflint -lgmp -lmpfr -lm`

### 2.1 Correctness checks

* **Hand-off check against PT.** A chain run from 3,000,175,329,999.72 certifies these zeros:
  * zero 12,363,153,437,138 in [3,000,175,332,799.860, 3,000,175,332,799.977];
  * zero 12,363,153,437,139 in [3,000,175,332,800.210, 3,000,175,332,800.384].

  No isolating interval straddles 3,000,175,332,800. FLINT's independent Turing count therefore gives
  N(3,000,175,332,800) = 12,363,153,437,138. This matches PT's published count exactly
  (`handoff_check.py … 3000175332800 12363153437138` → PASS). S1 and S2 start at index 12,363,153,437,139.
* **Independent sign check.** At 1e10, 1e11 and 3e12 the endpoints of the first, middle and last isolating intervals
  were re-evaluated with `acb_dirichlet_hardy_z`, a separate Arb code path (Riemann–Siegel / Euler–Maclaurin). Result:
  9/9 sign changes confirmed (`pilot.c … check`).
* **Index continuity.** Index continuity holds in every chain log. Ordinates are monotone and isolating intervals are
  disjoint.
* **Gap detection.** `assemble_check.py` correctly reports the deliberate gaps between the four disjoint 3e12 pilot
  workers.

### 2.2 Throughput

The cost of one grid is almost independent of height. It is dominated by the K ≈ 42 arb DFTs of length 32768 at
128-bit precision: at 3e12, multieval takes 14.6 s and isolation of 7116 zeros takes 2.0 s. The Dirichlet sum
(J ≈ 9.5e5) is a small part.

| height | chunk cpu (s) | usable height per chunk | height units / core-s | zeros / core-s | RSS |
|---|---|---|---|---|---|
| 1e10 | 18.0 | 1630 | 90.6 | 305 | 345 MB |
| 1e11 | 17.5 | 1628 | 93.1 | 348 | 326 MB |
| 3.0e12 (4 workers in parallel, 20 chunks) | 18.3 | 1627 | 88.9 | 380 | 303 MB |
| 6.0e12 (one stall, recovered) | 16.2 | 1221 (incl. short chunk) | 75.5 | 332 | 295 MB |
| 7.8e12 | 18.8 | 1631 | 86.9 | 385 | 296 MB |
| sample run at 3.5e12, 4.5e12, 5.5e12, 7.0e12 (4 workers × ~1.11e5 units, 277 OK chunks + 9 retries, 21 min) | 18.27 (incl. retries) | 1608 | **88.0** | **384** | ≤ 303 MB |

* **Usable width.** One grid nominally spans 4096 units, but only about [T − 840, T + 862] is usable at 128-bit
  precision. Dividing out the Gaussian window (h ≈ 116) at the grid edges amplifies the error balls beyond what
  sign determination tolerates. Doubling h with B = 8192 doubled the usable half-width. Raising the precision to 192
  bits widened it to 2730 one-sided, but cost about 1.7× more per grid. In every configuration tried, throughput
  stays at about 90–105 height units per core-second.
* **Stall at 6e12.** One near-edge hard spot was found at 6,000,000,001,632.8: the chunk stopped after 48 zeros and
  the next chunk returned none. Re-centring the grid 400 units above the stall recovered it. `chain` now applies the
  retry ladder (margin 780 → 400 → 100 → 400 at prec + 64) automatically. The stall/retry rate in the longer sample is
  9 FAIL chunks per 277 OK chunks (3.2%), all recovered at the first retry rung (margin 400), plus 1 short chunk. No escalation. Overhead is already included in the 88.0 rate.

## 3. Extrapolated cost (heuristic: measured rate × ΔT)

Rate used: r = 88.0 height units per core-second. This is the 4-worker sample across 3.5e12–7.0e12 on FLINT 3.6.0, one M5 Max core, 128-bit precision, with retries and short chunks included. The spot measurements at 3e12 and 7.8e12 give 86.9–88.9.

| range | ΔT | core-hours at 88.9 (no retries) | measured incl. retries (r = 88.0) | $ at $0.02–0.05 / core-h | PT reference |
|---|---|---|---|---|---|
| (T_PT, 6.0e12] | 3.0e12 | 9.4e6 | **9.47e6** | $0.19M–0.47M (κ_hw = 1); up to $1.18M at κ_hw = 2.5 | PT-scaled 7.9e6–1.03e7 |
| (T_PT, 7.8e12] | 4.8e12 | 1.50e7 | **1.52e7** | $0.30M–0.76M (κ_hw = 1); up to $1.89M at κ_hw = 2.5 | PT-scaled 1.27e7–1.65e7 |

* PT recorded about 7.5e6 core-hours on 3.6 GHz Xeon for (0, 3e12]. That is 111 height units or 458 zeros per
  core-second on average, at lower average height. FLINT on one M5 core runs at 88.9 height units / 380 zeros per
  core-second at 3e12, so the pilot is the same order as PT's rate.
* The pilot cost and the PT-scaled pricing in the s145 modules agree to within about 20%.
* **Hardware factor (not measured).** A cloud x86 vCPU (often one hyperthread) runs arb/GMP code slower than an
  M5 P-core. κ_hw ∈ [1, 2.5] is an assumption. At κ_hw = 2.5 the dollar figures scale by 2.5: about $1.9M upper
  for S2.
* **RAM.** About 0.3 GB per single-threaded worker, so 64 workers fit in 32 GB. No other RAM requirement.
* **Wall clock.** 1.52e7 core-hours / 10^4 cores ≈ 63 days for S2. S1 takes ≈ 40 days at 10^4 cores.
* **Storage.** Checkpoint logs are about 330 B per chunk. S2 has ≈ 2.9e9 chunks, so ≈ 1 TB raw, or about 0.15 TB
  with zstd. A compact binary record of 48 B per chunk would bring this to 0.14 TB. Per-zero isolating intervals
  (16 B per zero) would total 335 TB for S2. They are **not** needed for the claim and are not stored, except for a
  1e-4 random audit sample of about 34 GB.

### Cheaper levers before spending (heuristic; must be measured before any purchase)

1. **Double-precision interval FFT port.** This is how PT's original Platt code works. The pilot spends about 88% of
   its time in 128-bit arb DFTs and convolutions. Hardware-double ball arithmetic (as in Platt 2017) usually runs
   10–50× faster than 2-limb arb. Doing this means writing a new implementation and auditing its rigor; it cannot be
   done by setting a FLINT flag.
2. **Larger grids.** Larger B with retuned h, σ and precision would cut the edge waste, which is 59% of each grid
   now. The pilot did not find a configuration better than about 1.15× (B = 8192, h = 231, prec 192, one-sided
   2730).
3. **GPU multieval.** The DFT and convolution stage maps onto batched FFTs. This requires the port in item 1.

Before any money is committed: run levers 1 and 2 as local pilots, and re-price with measured κ_hw on the target
instance type using a 1-hour benchmark of `chain` at 4.5e12.

## 4. Campaign specification (ready to run; not run)

### 4.1 Work decomposition

* **Job size.** One job is a height interval of length L_job = 5.0e6. That is about 3070 chunks and ≈ 15.8 core-hours
  at r. S1 needs 600,000 jobs and S2 needs 960,000.
* **Job k range.** Job k covers [S + k·L_job, S + (k+1)·L_job] with S = 3,000,175,332,000, which is 800 units below
  T_PT so that the hand-off zero is included.
* **Job driver.** `run_job.sh <id> <S_k> <E_k> <outdir>` starts at S_k − 50 with n = auto. The library certifies the
  true index of the first returned zero.
* **Scheduling.** Jobs are independent, embarrassingly parallel and single-threaded, so preemptible/spot instances
  are suitable. Run 1 worker per physical core, not per hyperthread, unless κ_hw is measured per hyperthread.

### 4.2 Checkpointing and restart

* `chain` appends one JSON line per chunk with `fflush` + `fsync`. Each line records: chunk, grid centre T,
  n_first, n_last, found, isolating-interval endpoints t_first_lo and t_last_hi (20 digits), ordered_disjoint,
  precision, wall/cpu, RSS, retry attempt and status.
* On restart, `run_job.sh` resumes from the last OK line with t_start = ⌊t_last_hi⌋ and n = n_last + 1. This is the
  same state transition as the in-process loop, so a restarted job is bit-identical to an uninterrupted one. The
  determinism comes from fixed parameters, fixed precision and Arb's deterministic arithmetic.
* Losing a worker costs at most one chunk (about 18 s).

### 4.3 Failure handling

| event | action |
|---|---|
| chunk returns 0 zeros | automatic retry ladder: grid margin 400, then 100, then 400 at prec + 64 |
| ladder exhausted (exit 2) | job marked ESCALATE; rerun the point with `pilot2` at prec 192–256 and grid centred on the stall; if that also fails, isolate locally with `acb_dirichlet_hardy_z` bisection (Arb RS, much slower but independent) and record it as a manual certificate with its own log |
| short chunk (< 800 units) | next grid uses margin 400 (automatic) |
| process crash / preemption | restart from checkpoint (idempotent) |
| `ordered_disjoint` false | hard error, job quarantined, rerun on different hardware |
| assembly gap | rerun the missing range as a new job with 50-unit overlaps on both sides |

Measured: the 6e12 stall plus 9 FAIL chunks in the 4.45e5-unit sample were all recovered by the first retry rung. The escalation path has not yet been exercised.

**Restart test (measured).** A job killed after 2 chunks and resumed via `run_job.sh` produced the same certified content as an uninterrupted run: identical T, n_first, n_last, found and interval endpoints. Only the cosmetic chunk counter restarts at 0. The short-chunk margin state is not persisted, so a restart right after a short chunk may take a different but equally valid grid path.

**Cross-job gluing test (measured).** Two overlapping jobs, [T_PT − 800, +4000] and the next 4000 with a 50-unit overlap, pass `assemble_check.py` over (3000175332800, 3000175339000]: n 12,363,153,433,499 → 12,363,153,471,409, PASS.

### 4.4 Verification logs and acceptance

1. **Per job:** run `assemble_check.py S_k E_k none job_k.jsonl` to check status, intra-job index continuity,
   monotone ordinates, and that retries were recovered.
2. **Global:** run `assemble_check.py 3000175332800 T* none job_*.jsonl`. It checks the cross-job condition
   n_first(k+1) ≤ n_last(k) + 1, coverage of (T_PT, T*], and the total zero count. As a sanity check, the total count
   should be N(T*) − N(T_PT) up to the bounded S(t) correction.
3. **Hand-off:** `handoff_check.py job_0.jsonl zeros_0.bin 3000175332800 12363153437138` must PASS. This was
   already shown in the pilot.
4. **Top end:** the last job must certify a zero with ordinate > T*, and report N(T*) exactly. For S2 this is
   expected to be ≈ 33,328,427,955,450.
5. **Independent audit:**
   * Re-run a random 0.1% of jobs on a different architecture (x86 vs arm64) and a different GMP/MPFR build, and
     require identical index ranges.
   * Re-check a 1e-4 sample of isolating intervals with `acb_dirichlet_hardy_z` (independent code path).
   * Have the FLINT Platt error lemmas and `turing_method_bound` refereed against Platt (2017, Math. Comp.) and
     Trudgian (2011). This is a code-and-paper audit; it has not been done here.
6. **Publication artefact:** a Merkle root over all job logs, the assembly report, and the exact FLINT/GMP/MPFR
   versions and build flags.

### 4.5 How the result feeds the height wall

* **After S2.** Hypothesis (i) of contract (a), RH to T* = 7.80000000474e12, becomes a verified input. Contract (a)
  then reads Λ ≤ 144960215684847/10^15 = 0.144960216, conditional only on (ii) Raymond's analytic chain (G0 referee)
  and (iii) the regenerated floors/wall, which are already interval-certified in `tmp/s145-1-g1`.
* **After S1.** The MTY-band contract (b) becomes Λ ≤ 0.1449877, conditional on H1/H2/H3 and the band lemma. The
  margin is 1.2e-5.
* **Order.** Run S1 first, because S1 ⊂ S2 and its jobs are reused. Decide on S2 after G0 and H1/H2 have outcomes.
* **No zero list needed.** Raymond's chain consumes only the statement "RH to T*" and the derived N0 = 1114185 seam
  (for X = 15600000009475). The zero list itself is not an input.

## 5. Reproduce the pilot

```sh
cd formalization/rh-verification-campaign/pilot
cc -O2 -o pilot  pilot.c  -I/opt/homebrew/include -L/opt/homebrew/lib -lflint -lgmp -lmpfr -lm
cc -O2 -o pilot2 pilot2.c -I/opt/homebrew/include -L/opt/homebrew/lib -lflint -lgmp -lmpfr -lm
cc -O2 -o chain  chain.c  -I/opt/homebrew/include -L/opt/homebrew/lib -lflint -lgmp -lmpfr -lm
./pilot 3000000000000 20000 1 128 check                   # library local entry point + Arb spot checks
./pilot2 3000000000000 800 20000 1 128 1                  # full usable grid, multieval timed separately
./chain 3000175329999 3000175338000 auto 1 128 w3.jsonl w3.bin
python3 handoff_check.py w3.jsonl w3.bin 3000175332800 12363153437138    # PT hand-off -> PASS
python3 assemble_check.py 3000175330000 3000175338000 none w3.jsonl
```

## 6. Proved / certified / conditional / measured / heuristic

* **Proved:** the gluing lemma (§1), which is elementary.
* **Certified (interval, FLINT 3.6.0 assumed correct):**
  * every zero in each pilot window is simple and on the line, about 5e5 height units in total, at heights 1e10,
    1e11, 3e12, 3.5e12, 4.5e12, 5.5e12, 6e12, 7e12 and 7.8e12;
  * N(3,000,175,332,800) = 12,363,153,437,138, matching PT.

  These windows are far too short to move the verified height.
* **Conditional:** none produced here. The s145 contracts stay conditional on RH to T*, which has not been verified.
* **Measured:**
  * timings, RSS and usable grid width;
  * 88.9 height units per core-second at 3e12 (FLINT, M5 Max, machine under background load);
  * stall statistics.
* **Heuristic:** core-hour and dollar extrapolations, the hardware factor κ_hw, and the speedups of the levers in §3.
