# y-thaw-01775943 stage-2 sharp-weight sweep — results summary

Run date: 2026-09-10. Stage-1 gate (`../SHARP_WEIGHT_NATIVE_BINDING.md`)
verdict CLOSES; sweep authorized and executed.

## Configuration

- Producer: `lemma_sweep_p235711.c`, SHA256
  `580d0b51165da58d4ca22e16d80a8c3db603dd0d9246f26dd027b5f820bf0808`
  (byte-identical to the sealed audit-repo copy and the
  `research-inputs/gate2-evaluator-inputs/` copy).
- Compile: `clang -O2 -o lemma_sweep_sharp lemma_sweep_p235711.c
  -I/opt/homebrew/include -L/opt/homebrew/lib -lflint -lm`
  (NO `-DTRIANGLE_WEIGHT` — header line `WEIGHT SHARP`), FLINT 3.x
  Arb-merged (`libflint.24`), macOS arm64, binary SHA256
  `476dda60adb5548e4f70fea12a67d5c457b6edc2de864172118dc8b05c7bf47c`.
- Row parameters: TBOX `161250000/10^9 .. 161250001/10^9` (t-box containing
  129/800 at its closed left endpoint), y^2 = 12769/390625 (y = 113/625 =
  0.1808 exactly), prec = 256 bits, K = 8, hw = 1e-3, mode `t` (amortized
  frozen three-branch sawtooth), stride 1.
  hw is a patch-rebuild cadence parameter only; the Lagrange remainder
  (|d|*L)^(K+1) e^(|d|L)/(K+1)! * MW_0 is added in interval arithmetic per
  row (at hw = 1e-3, L <= ln(2310*N): remainder ratio ~1e-21, vs floors
  >= 0.0627).
- Lane: N = 690988 .. 3840000, 3,149,013 rows, 27 shards at the sealed
  family boundaries (p235711/mtype 6 to 728999, p2357/mtype 5 to 818999,
  p235/mtype 4 to 1027999, p23/mtype 3 to 3840000), 12-slot pool,
  `nice -n 15`.
- Fail-closed discipline: any UNCERT row, any `L12 0.000000000000`, any
  nonzero producer exit, or any shard row-count mismatch aborts the sweep
  with the offending row recorded. NONE occurred.

## Results

- Rows swept: **3,149,013 / 3,149,013** (every integer N in the lane).
- UNCERT rows: **0**. Zero/negative floors: **0**. Aborts: **0**.
- **Global minimum: L12 = 0.062718178029 at N = 690996** (shard
  p235711_690996_691500).
- Per-family minima (all at family left edges):
  - p235711 (mtype 6): 0.062718178029 at N = 690996
    (left edge N = 690988: 0.062725663650)
  - p2357 (mtype 5): 0.063431045389 at N = 729000
  - p235 (mtype 4): 0.065454106079 at N = 819000
  - p23 (mtype 3): 0.067916024127 at N = 1028000
- Sealed-triangle comparison: the sealed triangle floor at the same t-box
  and its own anchor y = 0.187272 was 7.91366e-7 at N = 690988; the sharp
  floor at the DISPLACED y = 0.1808 is 0.0627257 at the same N —
  ~79,266x larger despite the 0.006472 downward y-displacement.
  Confirms the imp-95207 finding: the sealed 7.9e-7 is a triangle-weight
  artifact, and the whole formerly-collapsed stretch is sharp-positive at
  the thawed height.
- Cross-checks: 690988 value agrees with the imp-95207 prec-128 shadow
  (0.0627256) to 6 digits and with a 3-row prec-256 hw=1e-5 control
  (0.062725767493 vs 0.062725663650 here; difference = frozen-weight
  re-freeze + remainder-width at hw, both conservative directions);
  seam left edges sit 1e-3-class below the naive mode-`n` shadow probes
  (0.06343 vs 0.06430 at 729000, etc.) — the domination-theorem
  conservativity direction.

## Cost

- Wall time: **666 s** (11.1 min) for the whole lane.
- CPU: **7,265 s ~= 2.02 CPU-hr** across 27 shards (the ~12 CPU-hr estimate
  assumed hw = 1e-5 rebuild cadence; hw = 1e-3 cuts patch rebuilds ~100x
  at ~1e-21 remainder cost).

## Files

- `p*.log.gz` — 27 shard logs (the full row-by-row log, gzipped;
  `SHA256SUMS.logs` covers them).
- `PER_SHARD_MINIMA.txt` — per-shard minima + row counts + walls.
- `SHARD_STATUS.txt` — driver status lines (all `OK`).
- `run_sweep.sh` — the exact driver.

## Grade (honest)

Arb-certified rows under OUR compile (local clang/FLINT, not the sealed
toolchain), at sealed-grade precision 256. Together with the stage-1 note,
each row certifies |f_t(x + 0.1808 i)| >= L12(N) > 0.0627 on its window for
every t in the t-box, in Theorem-1.3 normalized units. The package is NOT a
candidate until obligations O1-O6 of the stage-1 note close (all-y transfer
below 0.187272, barrier/winding at the 0.1808 edge, E_max budget region,
tail at 0.1808, site coverage, criterion assembly). Changes no bound.
NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
