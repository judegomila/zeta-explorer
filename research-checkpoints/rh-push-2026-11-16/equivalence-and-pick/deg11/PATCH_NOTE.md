# PR #40 degree-11 positive-cutoff blocker: cell-count patch note

Status: UNAUDITED. Internal replay note, 2026-11-16. Not posted to GitHub. No proof claim beyond what is stated in §7, and §7 is itself conditional on an independent replay and freeze.

## 1. Summary

`FULL_SHIFT_DEGREE10.md` records the odd degree-11 block (odd1,3,5,7,9,11) as "inconclusive in every shift slab" at the frozen parameters `16 4000 4000`. The unmodified checker, run with more spatial cells, passes both the even-10 and the odd-11 block in all 16 shift slabs. The only change is the two cell-count command-line arguments. No source file and no input file is edited.

| Parameters (slabs, tail cells, cutoff cells) | even10 | odd11 | Runtime (this machine) |
|---|---|---|---|
| `16 4000 4000` (frozen, PR #40) | pass, 16/16 | inconclusive, 0/16 | not re-run here; frozen output used |
| `16 16000 4000` | pass, 16/16 | pass, 16/16 | 52.2 s |
| `16 32000 8000` | pass, 16/16 | pass, 16/16 | 102.6 s |

Runtimes: single process, `/usr/bin/time -p` real time, Apple arm64, load average about 6.8 from unrelated jobs.

## 2. Source and input identity against the PR #40 head

PR #40 head on 2026-11-16: `e6ed49358d9b430cdf4a8406214523916f63e776` ("research: preserve exact-theta Mobius packet transfer and selector gap"), branch `research/twin-ladder-fisher-bridge-2026-11-02`, state OPEN, last updated 2026-11-04T06:11:55Z. Fetched with `git fetch origin pull/40/head:refs/pr/40`.

Directory used (path in PR #40):
`research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/evidence/v33-continuation/theta_correlated_local_audit/degree11_shift_replay/`

Files were extracted with `git archive refs/pr/40 <dir>` and copied to a scratch directory. All 20 entries pass `shasum -a 256 -c SHA256SUMS.txt`. Each file is byte-identical to the local Codex backup `pr40-wave38-39-backup-e6ed493` and to the copies used in the 2026-11-04 diagnosis (`tmp/vortex-bottleneck/replay/`). The `theta_correlated_local_v1/` copies of the checker, basis and `theta24_density.py` have the same hashes. **Drift: none.**

Files the checker executes or reads (sha256):

| File | sha256 |
|---|---|
| `check_degree11_shift_slabs.py` (the checker) | `7772cf748fe4708c7d9d799ebd0f52f0be89cb36b5f11289582d00f38ca25084` |
| `check_midpoint_recovery_flow.py` (exec'd prefix) | `48a221207e3dfb04c2d9adb9014e458803725be558463b91f71ebc5b69b4c245` |
| `check_moving_flux_energy.py` (exec'd via above) | `0407a347aacdfaf8add92df6440a65b8f0300799990eacc1cff49bed30a85dfa` |
| `check_signed_source_flux.py` (exec'd via above) | `b5c9d0d23d21ad5782d605fa8a75455aa16ac2a1de62898e19cf2f79c077b8fa` |
| `check_degree7_regional_payment.py` (exec'd via above) | `939a352d37e57b2bd44a78d48fc87b3cb4033a761007cc026c58dabf5f5656bc` |
| `check_signed_tail_prefix.py` (`general_ldl` slice) | `3cfe8c8fa24890a1e237637bd9d474408c27f7b9c979fcb09f5d1359dfc1be8c` |
| `theta24_density.py` | `7cfb094a92bfbdb6a96f1abc658e88e85e0dc02f4592ac4d4e38cfed627d910e` |
| `degree11_shift_rational_basis.json` | `6c95387f396ee791364045e70e7183b45f1e198e91f209811e99b17ffe627fd7` |
| `source_flux_coefficients.json` | `0c4b2c570d194070bd72deaf37627058047b8662021f697a8d0dd446657f86de` |
| `degree11_shift_slabs_16_4000_4000.json` (frozen output) | `a3a3b29860d5a92397c0e75d51105099ebb5b9aaf135f34a9b6afaeb04055a72` |
| `SHA256SUMS.txt` | `657e12b327058dc2633ad47dd7e31a7ecf2fb287b71cc78de4d859dd761e9008` |

The full set of 20 hashes is in PR #40's own `SHA256SUMS.txt`, which verified clean.

## 3. Replay commands

Environment: Python 3.14.10, python-flint 0.9.0, arm64 macOS. Working precision is set inside the exec'd prefix (output records `bits: 224`).

```sh
# in a PR #40 checkout, from the degree11_shift_replay directory (or a copy of it)
cd research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/evidence/v33-continuation/theta_correlated_local_audit/degree11_shift_replay
shasum -a 256 -c SHA256SUMS.txt
python check_degree11_shift_slabs.py 16 16000 4000 > degree11_shift_slabs_16_16000_4000.json
python check_degree11_shift_slabs.py 16 32000 8000 > degree11_shift_slabs_16_32000_8000.json   # optional, larger margin
```

The script must be run with its own directory importable (it does `from theta24_density import theta24` and reads siblings via `Path(__file__).parent`), so do not use `python -I`.

Output hashes from this replay (python-flint 0.9.0; string formatting of balls may differ under other versions, the pass/fail lists and pivot values should not):

| Output | sha256 |
|---|---|
| `16 16000 4000` | `4f51638c160512adb0f99600b88a7fcc196ddabb708cfa753b8ca86653a3bcbb` |
| `16 32000 8000` | `a944e0d09ee330d5dd7692cfe6aa0e1cc408f1e6435e3544a50e86d10c324ebd` |

The `16 16000 4000` output is byte-identical to the 2026-11-04 run (`tmp/vortex-bottleneck/orig_unmodified_16_16000_4000.json`), so the result reproduced across two independent invocations.

Consequence check. PR #40's `check_degree10_consequence.py` reads the frozen 4000/4000 file by fixed name and handles even10 only. The script below (`consequence_both.py`, sha256 in §9) applies the same asserts and the same formula (`last pivot lower / P55^2`) to both blocks of any output file:

```sh
python consequence_both.py degree11_shift_slabs_16_16000_4000.json degree11_shift_rational_basis.json
```

It asserts `all_passed`, empty `failed_slabs`, 16 slabs with endpoints exactly i/32 and (i+1)/32, and six positive pivot lower bounds per slab. Applied to the frozen 4000/4000 output it raises `AssertionError` on odd11, as expected.

## 4. Parameters changed

Only the second and third command-line arguments.

| Argument | Meaning | Frozen | Patch |
|---|---|---|---|
| `NS` (argv 1) | shift slabs covering a in [0, 1/2] | 16 | 16 (unchanged) |
| `N` (argv 2) | midpoint cells on the starting tail u in [1/8, 2] | 4000 | **16000** (or 32000) |
| `NC` (argv 3) | inward cutoff cells on u in [0, 1/8] | 4000 | 4000 (or 8000) |

No change to: bits, rational basis, theta enclosure, tail bound, slab width, LDL routine, error formulas.

## 5. Results

### 5.1 Uniform bounds (min over all 16 slabs and all cutoff cells)

From `consequence_both.py`. Pivot values are ball midpoints to 12 digits (radii ≤ 5e-13). Monic Schur bound = last uniform pivot lower bound / P55², with P55 the basis leading coefficient (even10: 8.457248e-9, odd11: 6.069705e-10).

| Run | Block | Uniform LDL pivot lower bounds d1..d6 | Monic Schur lower bound |
|---|---|---|---|
| frozen `16 4000 4000` | even10 | 0.888863, 0.927799, 0.959456, 0.966127, 0.963885, 0.638638 | > 8.928867843900347e15 (PR #40 value) |
| frozen `16 4000 4000` | odd11 | inconclusive, all 16 slabs | none |
| `16 16000 4000` | even10 | 0.888864, 0.927799, 0.959458, 0.966191, 0.967439, 0.882417 | > 1.23371714552e16 |
| `16 16000 4000` | odd11 | 0.908372, 0.945715, 0.966104, 0.965556, 0.959577, **0.412312** | > 1.11915587560e18 |
| `16 32000 8000` | even10 | 0.888864, 0.927799, 0.959458, 0.966220, 0.969042, 0.952645 | > 1.33190456330e16 |
| `16 32000 8000` | odd11 | 0.908372, 0.945715, 0.966104, 0.965791, 0.970451, **0.841075** | > 2.28296578255e18 |

In every run the minimum sits in slab 0 (a in [0, 1/32]) and the last pivot increases monotonically with a.

### 5.2 Per-slab results, `16 16000 4000`

even10, run `16 16000 4000` — lower endpoints of the six LDL pivot lower bounds, min over shift and cutoff cells, rounded down to 6 decimals

| slab | a range | passed | d1 | d2 | d3 | d4 | d5 | d6 |
|---|---|---|---|---|---|---|---|---|
| 0 | [0/32, 1/32] | yes | 0.888863 | 0.927799 | 0.959458 | 0.966191 | 0.967439 | 0.882416 |
| 1 | [1/32, 2/32] | yes | 0.888908 | 0.927856 | 0.959536 | 0.966296 | 0.967577 | 0.882592 |
| 2 | [2/32, 3/32] | yes | 0.889044 | 0.928031 | 0.959778 | 0.966625 | 0.968005 | 0.883160 |
| 3 | [3/32, 4/32] | yes | 0.889270 | 0.928322 | 0.960182 | 0.967178 | 0.968724 | 0.884120 |
| 4 | [4/32, 5/32] | yes | 0.889587 | 0.928729 | 0.960749 | 0.967954 | 0.969733 | 0.885473 |
| 5 | [5/32, 6/32] | yes | 0.889994 | 0.929253 | 0.961478 | 0.968954 | 0.971033 | 0.887218 |
| 6 | [6/32, 7/32] | yes | 0.890492 | 0.929894 | 0.962372 | 0.970179 | 0.972625 | 0.889358 |
| 7 | [7/32, 8/32] | yes | 0.891081 | 0.930653 | 0.963429 | 0.971628 | 0.974510 | 0.891893 |
| 8 | [8/32, 9/32] | yes | 0.891761 | 0.931528 | 0.964650 | 0.973304 | 0.976689 | 0.894825 |
| 9 | [9/32, 10/32] | yes | 0.892532 | 0.932522 | 0.966035 | 0.975205 | 0.979163 | 0.898156 |
| 10 | [10/32, 11/32] | yes | 0.893395 | 0.933633 | 0.967586 | 0.977335 | 0.981933 | 0.901887 |
| 11 | [11/32, 12/32] | yes | 0.894349 | 0.934862 | 0.969303 | 0.979692 | 0.985001 | 0.906022 |
| 12 | [12/32, 13/32] | yes | 0.895395 | 0.936211 | 0.971186 | 0.982279 | 0.988368 | 0.910562 |
| 13 | [13/32, 14/32] | yes | 0.896534 | 0.937678 | 0.973237 | 0.985097 | 0.992037 | 0.915511 |
| 14 | [14/32, 15/32] | yes | 0.897764 | 0.939265 | 0.975455 | 0.988147 | 0.996010 | 0.920872 |
| 15 | [15/32, 16/32] | yes | 0.899088 | 0.940973 | 0.977843 | 0.991430 | 1.000289 | 0.926648 |

odd11, run `16 16000 4000` — lower endpoints of the six LDL pivot lower bounds, min over shift and cutoff cells, rounded down to 6 decimals

| slab | a range | passed | d1 | d2 | d3 | d4 | d5 | d6 |
|---|---|---|---|---|---|---|---|---|
| 0 | [0/32, 1/32] | yes | 0.908372 | 0.945715 | 0.966103 | 0.965556 | 0.959576 | 0.412311 |
| 1 | [1/32, 2/32] | yes | 0.908423 | 0.945782 | 0.966195 | 0.965676 | 0.959737 | 0.412425 |
| 2 | [2/32, 3/32] | yes | 0.908575 | 0.945985 | 0.966480 | 0.966049 | 0.960240 | 0.412920 |
| 3 | [3/32, 4/32] | yes | 0.908829 | 0.946326 | 0.966958 | 0.966675 | 0.961085 | 0.413799 |
| 4 | [4/32, 5/32] | yes | 0.909184 | 0.946803 | 0.967629 | 0.967555 | 0.962273 | 0.415059 |
| 5 | [5/32, 6/32] | yes | 0.909642 | 0.947417 | 0.968494 | 0.968688 | 0.963804 | 0.416704 |
| 6 | [6/32, 7/32] | yes | 0.910201 | 0.948168 | 0.969553 | 0.970076 | 0.965679 | 0.418732 |
| 7 | [7/32, 8/32] | yes | 0.910862 | 0.949056 | 0.970806 | 0.971719 | 0.967899 | 0.421147 |
| 8 | [8/32, 9/32] | yes | 0.911626 | 0.950082 | 0.972253 | 0.973617 | 0.970466 | 0.423949 |
| 9 | [9/32, 10/32] | yes | 0.912492 | 0.951247 | 0.973897 | 0.975773 | 0.973381 | 0.427140 |
| 10 | [10/32, 11/32] | yes | 0.913461 | 0.952549 | 0.975737 | 0.978186 | 0.976646 | 0.430722 |
| 11 | [11/32, 12/32] | yes | 0.914533 | 0.953991 | 0.977773 | 0.980859 | 0.980263 | 0.434698 |
| 12 | [12/32, 13/32] | yes | 0.915708 | 0.955573 | 0.980008 | 0.983791 | 0.984234 | 0.439071 |
| 13 | [13/32, 14/32] | yes | 0.916987 | 0.957294 | 0.982442 | 0.986986 | 0.988561 | 0.443843 |
| 14 | [14/32, 15/32] | yes | 0.918371 | 0.959156 | 0.985075 | 0.990445 | 0.993247 | 0.449018 |
| 15 | [15/32, 16/32] | yes | 0.919858 | 0.961159 | 0.987910 | 0.994169 | 0.998295 | 0.454599 |


### 5.3 Last pivot d6 per slab, `16 32000 8000`

| slab | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| even10 | 0.9526 | 0.9528 | 0.9534 | 0.9544 | 0.9558 | 0.9575 | 0.9597 | 0.9623 | 0.9653 | 0.9687 | 0.9724 | 0.9766 | 0.9812 | 0.9863 | 0.9917 | 0.9976 |
| odd11 | 0.8411 | 0.8413 | 0.8419 | 0.8429 | 0.8443 | 0.8462 | 0.8485 | 0.8512 | 0.8543 | 0.8578 | 0.8618 | 0.8662 | 0.8711 | 0.8763 | 0.8821 | 0.8882 |

All 16 slabs pass for both blocks; full per-slab six-pivot data are in `unmodified_16_32000_8000.json`.

## 6. Cause: midpoint-quadrature error in the spatial tail integral

Each tail cell adds a symmetric radius `w^3 * second / 24` (second = interval bound on the second spatial derivative of the weighted transformed density over the cell). Summed over N cells this is O(N·w³) = O(1/N²) for a fixed derivative bound. It is the dominant radius in the high channels and decides pass/fail.

Diagnostic: the H = 1/8 tail-stage matrix for slab 0 only (before the inward cutoff sweep), computed by `diag_odd11.py` (a read-only copy of the checker's tail loop that separates the quadrature radius from the weight-hull radius and runs LDL without asserting). Runtime 5 / 10 / 20 s.

Diagonal quadrature radius, odd11 block, slab 0:

| tail cells N | ch1 | ch2 | ch3 | ch4 | ch5 | ch6 | last pivot | LDL |
|---|---|---|---|---|---|---|---|---|
| 4000 | 5.9e-7 | 8.4e-7 | 1.1e-5 | 4.5e-4 | 3.0e-2 | 1.88 | 0.977 ± 1.95 | fails |
| 8000 | 1.4e-7 | 1.6e-7 | 1.4e-6 | 5.6e-5 | 3.7e-3 | 0.226 | 0.977 ± 0.228 | passes |
| 16000 | 3.6e-8 | 3.5e-8 | 1.8e-7 | 6.9e-6 | 4.5e-4 | 0.0277 | 0.977 ± 0.028 | passes |

Same for even10, slab 0: channel-6 radius 0.244 / 0.0296 / 0.00364; last pivot 0.975 ± 0.247 / ± 0.030 / ± 0.0038 (passes at all three, but marginal at 4000, which accounts for the frozen even10 minimum 0.6386).

Measured scaling:
- Per doubling of N, the channel-6 radius falls by 8.3× (odd) and 8.2× (even). That is faster than the nominal 4× of 1/N². The extra factor comes from the derivative bound itself: it is evaluated over the whole cell ball, so it also tightens as cells shrink. The asymptotic rate is still 1/N²; this range is pre-asymptotic.
- Per added channel (ch3→ch4→ch5→ch6), the radius grows by about 60–70× (odd at N=16000: 38×, 65×, 61×; even at N=4000: 28×, 55×, 68×). The 2026-11-04 report gave "about 75×"; the measurement here is 60–70×.
- The weight-hull radius (shift-slab width) is about 1e-4 on the diagonal and does not change with N. It is not the limiting term.

The last odd pivot at H = 1/8 is 0.977 at every N; at `16 16000 4000` the overall slab minimum is 0.412, so the inward cutoff sweep (NC = 4000) costs about 0.56. Doubling NC to 8000 (with N = 32000) raises the minimum to 0.841. The cutoff-stage loss was not decomposed further in this note.

## 7. Consequence and scope (conditional on independent replay and freeze)

If the `16 16000 4000` run is independently replayed and frozen under the PR #40 audit procedure, then together with the accepted even10 block (now with a larger margin) it gives:

- full degree ≤ 11 positivity of the shifted signed Gram matrices for all 0 ≤ a ≤ 1/2 and all 0 ≤ H_cut ≤ 1/8;
- monic odd11 Schur lower bound > 1.119e18 uniformly on that rectangle (> 2.283e18 from `16 32000 8000`).

What this does not give:
- Nothing new at H_cut = 0. There, all-degree positivity is equivalent to RH (paper §13.2: all-degree positivity ⇔ Λ_a ≥ 0 pointwise ⇔ horizontal monotonicity of |ξ|). A finite degree such as 11 is a statement at finite verified height and carries no zero-location information beyond what is already verified.
- No statement for a > 1/2 at H_cut > 0 (the H = 0 outer-strip argument is not applied to H > 0 truncations, as stated in `FULL_SHIFT_DEGREE10.md` §4).
- No induction in degree, no all-degree or RH claim, no change to the normalized odd-through-19 range.

## 8. Recommendation for degree ≥ 12

The radius grows about 60–70× per added channel and falls about 8× per doubling of cells in the tested range (asymptotically 4×). One more channel therefore needs roughly 3 more doublings, i.e. about 8× the cells, plus the derivative jets the checker does not yet have (even-12 / odd-13 need theta derivatives through 26 / 28; `theta24_density.py` stops at 24). Cell-count increases are not a sustainable route past degree 11. Replace the midpoint rule plus second-derivative remainder with:

1. Rigorous Gauss–Legendre quadrature per cell, with the standard remainder `(b−a)^(2m+1) (m!)^4 / ((2m+1) ((2m)!)^3) · f^(2m)(ξ)` enclosed by an interval bound on the 2m-th derivative over the cell; or
2. Taylor models in u (integrate a degree-k Taylor polynomial exactly per cell, remainder enclosed by the (k+1)-th derivative), which reuses the jet machinery in `theta24_density.py`.

Either gives O(h^(2m)) or O(h^(k+1)) per-cell error instead of O(h³), so the per-channel growth can be absorbed by the order rather than by the cell count. An adaptive spatial mesh (finer near u = 1/8 and in the cutoff region, where the high channels concentrate) is a cheaper complement. More slabs, more bits, or a different LDL basis have little effect: the slab-width term is about 1e-4 and is not binding.

## 9. Files in this directory

| File | Content | sha256 |
|---|---|---|
| `run/` | scratch copy of PR #40 `degree11_shift_replay/` (unchanged) plus `diag_odd11.py` | see §2 |
| `pr40/` | `git archive` extraction of the two PR #40 directories | — |
| `unmodified_16_16000_4000.json` | checker output | `4f51638c160512adb0f99600b88a7fcc196ddabb708cfa753b8ca86653a3bcbb` |
| `unmodified_16_32000_8000.json` | checker output | `a944e0d09ee330d5dd7692cfe6aa0e1cc408f1e6435e3544a50e86d10c324ebd` |
| `consequence_16_16000_4000.json`, `consequence_16_32000_8000.json` | uniform bounds | — |
| `consequence_both.py` | consequence checker for both blocks | `e41c89fdb4fe64157044beefbd1b32f223adeeae59fde93d59c57b3c34ee94ab` |
| `diag_slab0_N{4000,8000,16000}.json` | quadrature-radius diagnostic | — |
| `run/diag_odd11.py` | diagnostic script (does not assert; not a certificate) | `1d7058bca055c49da16ae57ac56f6cf6e280611c611ff081c9bd3b3a0d82d87d` |
| `*.time` | `/usr/bin/time -p` output | — |

UNAUDITED. Produced by a single replay on one machine. Needs an independent replay and the PR #40 freeze procedure before any statement in §7 is recorded as accepted.
