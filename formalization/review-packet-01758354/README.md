# External-referee packet: de Bruijn–Newman candidate Λ ≤ 0.1758354

Prepared 2026-09-29 on the preparing machine. **Not sent anywhere.** This directory
collects what an external referee needs to check the candidate: the statement, the
proof chain, the certificate sources and logs with checksums, reproduction commands,
the list of inputs that are cited and not re-proved, and the known limitations.

**Status.** Computer-assisted candidate. Unreviewed, unpublished. An internal
composition audit (2026-09-28, two AI referee passes, `src/data/dag3-audit01758-2026-09-28.js`)
found no parameter mismatch or math gap. A fail-closed assembly gate
(`scripts/lambda-01758354-gate.mjs`) recomputes the composition from 16 SHA-256-pinned
inputs and passes 23/23 checks with `--rerun-tail`. No human mathematician and no external
referee has reviewed the candidate. Platt–Trudgian Λ ≤ 0.2 (Bull. LMS 53 (2021)) is the
accepted peer-reviewed upper bound; Rodgers–Tao give Λ ≥ 0. Nothing here bears on RH
beyond the stated bound. No QED is claimed.

Paths: `REPO` = the mathexplorer working tree, `PKG` = `~/dbn-lambda-01758354-candidate`
(candidate package, git HEAD `b821b81`, SHA256SUMS 30/30 OK), `BASE` =
`~/Documents/GitHub/dbn-lambda-01787854-candidate-audit` (base 0.1787854 package, git HEAD
`a74738d`, SHA256SUMS all OK), `SWEEP` = `~/dbn-lambda-sweep-clean` (sealed sweep producer,
HEAD `2e9976c`). Every file referenced below is hashed in `MANIFEST.sha256`.

---

## 1. Statement

Let t0 = 1583/10000 and y0² = 87677/2500000. Then

  t0 + y0²/2 = 1583/10000 + 87677/5000000 = 879177/5000000 = 0.1758354,

and the candidate claims **Λ ≤ 879177/5000000**, obtained by instantiating Polymath15
Theorem 1.2 (arXiv:1904.12438v2) at

  X = 6000000185827, t0 = 1583/10000, y0² = 87677/2500000,

with verified height from Platt–Trudgian (RH verified to T_PT = 3000175332800).

## 2. What is claimed and what is not

Claimed (at the grades in §3):

- The three hypotheses of Polymath15 Theorem 1.2 hold at the row above, so Λ ≤ 0.1758354,
  provided the cited theorems (§6) hold as stated and the certificate programs compute what
  their notes say they compute.
- Every numerical inequality in the chain is decided in ball / interval arithmetic
  (Arb / FLINT 3.x, or python-flint), fail-closed, or in exact rational arithmetic.

Not claimed:

- Not peer-reviewed, not published, not accepted. It does not displace Platt–Trudgian
  Λ ≤ 0.2 as the accepted bound.
- Not a Lean proof. Lean covers only the y-transfer reduction logic
  (`YTransferReduction.lean`: Theorem C excision budget, certificate extension, floor bound)
  and Lemma B3 (`DiniGate.lean`: per-box Dini gate, including global gluing), with the numerical
  gate values as hypotheses. There is **no Lean statement of the Theorem 1.2 instantiation**
  and no Lean model of H_t, of Theorem 1.3, or of the verifiers.
- The height and barrier hypotheses are not re-derived: height is cited (Platt–Trudgian),
  the barrier certificate is reused from the base 0.1787854 package by containment.
- No statement about RH.

## 3. Proof architecture (numbered chain)

Grades: **P** = proved (exact arithmetic / short argument written out), **C** = certified by
a ball-arithmetic program (computer-assisted), **K** = cited, not re-proved here,
**S** = prose argument awaiting human sign-off.

Polymath15 Theorem 1.2 (as transcribed in `BASE/PROOF_NOTE.md` §2; the paper is authoritative):
if (i) ζ(σ+iT) ≠ 0 for (1+y0)/2 ≤ σ ≤ 1, 0 ≤ T ≤ X/2; (ii) H_{t0}(x+iy) ≠ 0 for
x ≥ X + √(1−y0²), y0 ≤ y ≤ √(1−2t0); (iii) H_t(x+iy) ≠ 0 for X ≤ x ≤ X + √(1−y0²),
√(y0²+2(t0−t)) ≤ y ≤ √(1−2t), 0 ≤ t ≤ t0; then Λ ≤ t0 + y0²/2.

1. **Exact row (P).** t0 + y0²/2 = 879177/5000000; 0 < t0 ≤ 1/2; 0 < y0² < 1 − 2t0 = 3417/5000.
   Checked with BigInt rationals in the audit module and the gate.
2. **Hypothesis (i), height (K + P).** Platt–Trudgian Theorem 1: RH verified to
   T_PT = 3000175332800. X/2 = 3000000092913.5, so T_PT − X/2 = 350479773/2 > 0 (P).
   The x = 2T normalization H_0(z) = ξ(1/2 + iz/2)/8 is checked in the base package
   (`BASE/verifiers/verify_criterion_sign_map.py`); the T = 0 endpoint is classical.
3. **Hypothesis (iii), barrier (K-reuse + C + P).** The base package certifies
   H_t(z) ≠ 0 on R = [X, X+1] × [0.1809, 1] for 0 ≤ t ≤ 129/800 (883 closed time prisms,
   `BASE/BARRIER_CERTIFICATE.md`, `BASE/barrier/src/TloopSinglemat_closed_cert.c`,
   log `BASE/barrier/certificates/barrier_target_closed.log`: `RESULT: CLOSED SLAB CERTIFIED`,
   closed coverage endpoint 0.16125, 333 s CPU). The region (iii) at t0 lies inside this box by
   **containment** (P): t0 = 0.1583 ≤ 129/800, 0.1809² < y0² ≤ y0² + 2(t0−t), y0² + 2t0 < 1,
   √(1−y0²) < 1. No monotonicity in t is used. The base barrier carries its own
   residuals (§7: B_t ≠ 0 on R; the t → 0 limit of Theorem 1.3 / Lemma 8.4) (S).
4. **Effective approximation ε_cap (K + C).** Polymath15 Theorem 1.3 with error terms
   (71)–(72) and Proposition 6.6 (conservative 10.50 = 3.58 + 6.92 corollary of Prop 6.6(vi),
   `BASE/ERROR_CONSTANT_WELD.md`) gives |H_t/B_t − f_t| ≤ e_A + e_B + e_C0. At this row, uniformly
   over the finite lane N ≥ 690988: e_C0 ≤ 2.66796645e-7 (C Arb hull ball,
   `REPO/tmp/dag3-audit01758-tail-runs.log`, ERROR-ONLY block N1 = 690988), e_A + e_B ≤ 2.652e-11,
   so **ε_cap ≤ 2.668232e-7** (lane), ≤ 9.21291e-8 (leg D, N ≥ 1300001); python-flint cross-check
   `REPO/tmp/dag3-audit01758-epscap.py` → `.log` (320-bit, `RESULT: ALL CHECKS PASS`).
   This replaces the ~1e-6 figure in `PKG/PROOF_NOTE.md`.
5. **Window freeze (P + C).** With x_N = 4π(N² − t0/16), the lane starts at N = 690988 and
   x_690988 < X − 5.377e6 (Arb 320-bit, epscap log), so windows N ≥ 690988 cover the whole
   region (ii). The frozen window constants g_N (|γ|), σ_N (Re s*), k_N (|κ|) are those of
   `BASE/WINDOW_FREEZE_THEOREM.md` (written at t0 = 129/800; the audit records the argument as
   parameter-free and re-checks the margins at t0 = 1583/10000).
6. **Gate 1, finite lane at y = y0 (C + S).** For every N in [690988, 6000000] (5,309,013 windows,
   contiguous), the producer `PKG/src/lemma_sweep_genmoll.c` (`-DTRIANGLE_WEIGHT`, 256-bit Arb,
   sawtooth Triangle weight, K = 14, hw = 0.005, t = t0 singleton, y² = 350708/10⁷ = y0²) logs
   L12_N > 0, 0 UNCERT. Minima: A1 1.872347259e-3 (N = 690988), A2 0.101297954835, D 0.010066384413.
   The native-binding lemma (`REPO/formalization/paper/native-binding-general-weights.md` for the
   287-weight legs A1/A2; `SWEEP/NATIVE_BINDING.md` for the Euler {2,3} leg D) gives
   |f_{t0}(x+iy0)| ≥ L_N ≥ L12_N on window N, where L_N = Q_N/M_N − g_N C_N is a lower bound
   for |f_t| itself (the mollifier is divided out through M_N), i.e. in the same units as ε_cap.
7. **Gate 4, y-transfer (C + S + partial Lean).** `PKG/provenance/Y_TRANSFER_GENMOLL_THEOREM.md`
   Theorems B/C with Lemmas B1–B4 reduce "L_N(y) ≥ L_N(y0) − B for all y ∈ [y0, √(1−2t0)]" to a
   finite profile–sector box check (20,546 profiles + leg D) and an excision budget B.
   `PKG/verifiers/verify_ydini_genmoll.c` (256-bit Arb, fail-closed `arb_lt`) certifies
   B ≤ 2.495709389e-4 (2026-08-02 run) and B ≤ 2.495763535e-4 (2026-09-22 re-run); the larger
   plus a 1e-12 print cushion, **B_max = 2.495763545e-4**, is used. Lean: reduction logic and
   Lemma B3 only (see §2).
8. **Finite-lane closure (P on certified numbers).**
   L12_min − B_max − ε_cap ≥ 1.872347259e-3 − 2.495763545e-4 − 2.668232e-7 = **1.622504081e-3 > 0**
   (leg A2 1.010481e-1, leg D 9.816716e-3), so H_{t0}(x+iy) ≠ 0 for x_690988 ≤ x ≤ x_6000001 and
   y0 ≤ y ≤ √(1−2t0).
9. **Gate 2, tail N ≥ N* = 6000000 (C + S).** Parameter-locked verifier
   `REPO/tmp/lambda01758/verify_tail_genmoll_01758354.c` (P17-287 mollifier compiled in via
   `moll_p17_287.h`; t0, y-box [1872719/10⁷, 23409/125000], y-top 8266802/10⁷ ≥ √(1−2t0),
   N1 = 6000000; no environment overrides) passes 38/38 at 256 and 512 bits with Arb-verified
   rational bounds **D ≤ 880148631881/10¹² < 1** and **flow ≥ 72339895395/10¹² > err ≤ 6161460033/10¹⁸**.
   The tail theorem is `BASE/TAIL_LEMMA.md` (endpoint-cap / integral comparison, Lemma 3.1),
   written at the base row; its use at N* = 6e6, t0 = 1583/10000 is the S item in §7.
   Lane and tail overlap at N = 6000000.
10. **Assembly (P on certified numbers).** Steps 2, 3 give (i), (iii); steps 4–9 give (ii).
    Theorem 1.2 then gives Λ ≤ 879177/5000000. The fail-closed gate recomputes steps 1, 3
    (containment), 2 (height margin), 4, 5, 6 (lane minima from the full logs), 7, 8, 9 from
    the pinned logs in exact BigInt rationals.

## 4. Gates: inequality, certificate, checksum, precision, runtime

| gate | inequality decided | certificate source (sha256 prefix) | logs (sha256 prefix) | precision | runtime (as logged) |
|---|---|---|---|---|---|
| 1 finite lane | L12_N > 0 for N = 690988..6000000, 0 UNCERT; min 1.872347259e-3 | `PKG/src/lemma_sweep_genmoll.c` `561d59bf…`; mollifier `PKG/src/mollifier_p17_t0_15830.txt` = `REPO/tmp/moll_0.15830.txt` `a05f16ef…` | `REPO/tmp/sweep_15830/A1_p17_690988_1000000.log` `f7640c6d…`, `A2_p17_1000001_1300000.log` `22f7123e…`, `D_p3_1300001_6000000.log` `6bdd7546…`; binding-row replays `REPO/tmp/lambda01758/replay_{A1,A2,D}.log` `828d87fe…`/`6fccca7d…`/`58137708…` | Arb 256 bit | TIMING 2328.98 s (A1), 2942.04 s (A2), 594.36 s (D); replays 428.9 / 616.5 / 16.2 s |
| 2 tail | D < 1 and flow > err > 0 at N ≥ 6e6 | `REPO/tmp/lambda01758/verify_tail_genmoll_01758354.c` `f3d142e6…` + `moll_p17_287.h` `1b811e80…` | `REPO/tmp/lambda01758/tail01758354_prec256.log` `09b994b2…`, `_prec512.log` `5e354c69…` | Arb 256 and 512 bit | ~0.4 s each |
| 3 barrier | H_t ≠ 0 on [X,X+1]×[0.1809,1]×[0,129/800] (883 prisms); containment of region (iii) | `BASE/barrier/src/TloopSinglemat_closed_cert.c` `76e4d4f8…`, `verify_uniform_error_01787854.c` `dd61648f…`, `BASE/BARRIER_CERTIFICATE.md` `81bea050…` | `BASE/barrier/certificates/barrier_target_closed.log` `2d010f70…`, `uniform_error_256.log` `7f43bc24…` | Arb (256-bit primary error budget) | 333 s CPU |
| 4 y-transfer | B < 1.7e-3 (Theorem C budget); used B_max = 2.495763545e-4 | `PKG/verifiers/verify_ydini_genmoll.c` = `REPO/tmp/verify_ydini_genmoll.c` `748aff57…`; theorem `PKG/provenance/Y_TRANSFER_GENMOLL_THEOREM.md` `e322e7c2…` | `REPO/tmp/ydini_full_256b.log` `9991211…` (= `PKG/logs/ydini_full_256.log`), `REPO/tmp/ydini_full_256_rerun_2026-09-22.log` `be0bb9a9…` | Arb 256 bit | 1872 s wall, 16 threads (08-02); 3782 s wall, 8 threads (09-22) |
| ε_cap | e_C0 + e_A + e_B ≤ 2.668232e-7 on N ≥ 690988 | `REPO/tmp/dag3-audit01758-epscap.py` `579f010f…`; C Arb run via `tmp/dag3-audit01758-tail-runs.sh` `b04d7e9a…` | `REPO/tmp/dag3-audit01758-epscap.log` `ea69c30f…`, `REPO/tmp/dag3-audit01758-tail-runs.log` `4d8ac5d8…` | python-flint 320 bit; Arb 256 bit | seconds |
| assembly | all of the above compose; gate ≥ 1.622504081e-3 | `REPO/scripts/lambda-01758354-gate.mjs` `a1fe7b0a…`; `REPO/src/data/dag3-audit01758-2026-09-28.js` `ae3ef09e…` | 16 pinned inputs (MANIFEST section A) | exact BigInt rationals | ~4 s with `--rerun-tail` |

Full 64-hex checksums: `MANIFEST.sha256` (103 files). Note on `tail-runs.log`: every block in it
ends `RESULT: ARB TAIL CHECK FAILURE`, because that run used the older package tail verifier whose
built-in literals and corridors belong to the base row and the default P1113 mollifier. The gate
reads only the ERROR-ONLY blocks' `eC0 upper point` balls and three `[PASS]` domain /
monotonicity lines from it; the tail itself is certified by the parameter-locked verifier logs.

## 5. Reproduction

On the preparing machine (FLINT 3.x under `/opt/homebrew`; override with `FLINT_INC` / `FLINT_LIB`):

```sh
cd "$REPO"
node scripts/lambda-01758354-gate.mjs --verbose --rerun-tail   # 23/23 PASS, ~4 s; exit 0 pass, 1 check failed, 2 input missing/changed
formalization/review-packet-01758354/tools/verify_manifest.sh   # 103 files: sha256 + byte count
(cd "$PKG" && shasum -a 256 -c SHA256SUMS)                     # 30/30 OK
(cd "$BASE" && shasum -a 256 -c SHA256SUMS)                    # base package seal, all OK (its ./verify.sh is the full attestation; not run for this packet)
```

Outside the repo tree (gate only). Tested on the preparing machine only, not on a second machine;
`--rerun-tail` compiles the tail verifier with `cc` against FLINT 3.x (set `FLINT_INC` / `FLINT_LIB`):

```sh
tools/stage_gate_inputs.sh /path/to/new/dir --run   # copies the gate, audit module and 16 inputs (187 MB), runs the gate
```

A staged tree was archived as `~/dbn-lambda-01758354-review-inputs/gate-inputs-01758354.tar.xz`
(20,321,996 bytes, sha256 `85a145749702f7566870e210c9b8fb178e0001fb5bbe170e667ce539d6efc95f`);
extracted into an empty directory on the preparing machine, `node scripts/lambda-01758354-gate.mjs --rerun-tail`
passed 23/23 there (2026-09-29). It is not in the git tree and has not been sent anywhere.

Re-running the certificates themselves (hours; not needed to run the gate):

`run_tail.sh` and `replay_binding_rows.sh` write their logs next to themselves and would
overwrite the pinned gate inputs (the tail logs carry a build timestamp, the replay logs a
TIMING line). Run them in a copy:

```sh
# Gate 2 tail (parameter-locked, seconds). The gate's --rerun-tail does the same in a temp dir
# and compares output byte-for-byte (banner through RESULT line) with the pinned logs.
W=$(mktemp -d); cp -R "$REPO/tmp/lambda01758" "$REPO/tmp/moll_0.15830.txt" "$W/"
bash "$W/lambda01758/run_tail.sh"
# Gate 1 binding-row replays (~18 min CPU total, three processes); compare the N rows with the lane logs
bash "$W/lambda01758/replay_binding_rows.sh"
# Gate 1 full lane + Gate 4 y-transfer from the package (A2 leg ~49 min, ydini ~0.5-1 h on 8-16 threads).
# Apply patches/run_all.sh-gate4-mollifier-path.patch to a COPY of the package first (see below).
(cd /path/to/package-copy && ./run_all.sh)
# Gate 3 barrier replay (base package)
(cd "$BASE" && ./scripts/run_barrier_replay.sh replay/barrier)
# epsilon_cap cross-check (prints to stdout; compare with tmp/dag3-audit01758-epscap.log)
/tmp/rhvenv/bin/python "$REPO/tmp/dag3-audit01758-epscap.py"
```

**run_all.sh GATE 4 patch (prepared, not applied to the sealed package).**
`patches/run_all.sh-gate4-mollifier-path.patch` (sha256 `73a32505…`) changes GATE 4 to
`"$BIN/ydini" 256 "$MOLL"` and updates the `run_all.sh` line of `SHA256SUMS`
(`da50a93c…` → `764903ed…`). Reason: without a path argument `verify_ydini_genmoll` opens
`tmp/moll_0.15830.txt`, then `moll_0.15830.txt`, relative to the current directory, while
`run_all.sh` creates its symlinks in `$ROOT/src` and `$BIN`. Tested on a clone of the package
(2026-09-29): `git apply --check` clean, `bash -n` clean, `SHA256SUMS` 30/30 after applying;
the old invocation started from the package root prints `FATAL: cannot open mollifier file
moll_0.15830.txt` and `RESULT: YDINI FAIL` (fails closed); the patched invocation loads the
mollifier (`ndiv=287 lambda_2=-1019196/1000000`), passes leg D and a 4-profile partial run
(`YDINI_PMAX=4`, not a certificate). The 2026-09-22 run, which sets B_max, read
`REPO/tmp/moll_0.15830.txt` (sha256 `a05f16ef…`); its log records that path. The 2026-08-02 run
logged `mollifier: moll_0.15830.txt`, i.e. a file of that name relative to its working directory;
its identity is attested only by the printed ndiv=287, lambda_2 and lambda_1000, not by a hash.
Applying the patch requires re-sealing the package (new commit + SHA256SUMS).

## 6. Cited, not re-proved

1. Polymath15 (D.H.J. Polymath, Res. Math. Sci. 6 (2019) 31; arXiv:1904.12438v2):
   Theorem 1.2 (barrier criterion), Theorem 1.3 (effective approximation) with error terms
   (71)–(72), Proposition 6.6 (component estimates; the 10.50 corollary of 6.6(vi) is proved in
   `BASE/ERROR_CONSTANT_WELD.md`), Lemma 8.4 (derivative bounds used by the barrier).
2. Platt–Trudgian (Bull. LMS 53 (2021) 792–797; arXiv:2004.09765): RH verified to height
   3000175332800.
3. Classical: ζ(σ) ≠ 0 for real σ ∈ (0,1) (T = 0 endpoint); H_0(z) = ξ(1/2 + iz/2)/8.
4. The base 0.1787854 package's barrier certificate, window-freeze theorem, tail lemma,
   derivative-box lemma, native binding (`BASE/…`, `SWEEP/NATIVE_BINDING.md`), reused here;
   the base package received an AI adversarial referee report (`BASE/EXTERNAL_REFEREE_REPORT_2026-07-28.md`),
   not a human referee.
5. FLINT / Arb ball arithmetic (correct outward rounding of the library), the C compiler,
   and python-flint 0.9.0.

## 7. Known limitations

1. **Human sign-off open** on the y-transfer Theorems B and C and Lemmas B1–B4
   (`PKG/provenance/Y_TRANSFER_GENMOLL_THEOREM.md` §4–5). Lean covers the reduction logic and
   Lemma B3 only; the per-summand sup-mass bounds and the profile enumeration (B1, B2, B4) are
   checked only by the verifier and by prose.
2. **Inherited barrier residuals** (sign-off): B_t ≠ 0 on R, and the t → 0 limit of Theorem 1.3
   and Lemma 8.4 on the closed box (`BASE/BARRIER_CERTIFICATE.md`, "Effective approximation,
   including t = 0").
3. **Native-binding note** (`REPO/formalization/paper/native-binding-general-weights.md`,
   41/41 script checks, referee-corrected) awaits human sign-off. Leg D relies on the sealed note
   via a three-change diff argument (MAXD, mtype range, mtype 7 branch).
4. **Directed rounding inside a verifier is not detectable by the gate.** A flipped rounding
   direction (e.g. using an upper instead of a lower ball endpoint) inside any C verifier would
   pass the gate; it is protected only by review of the pinned sources.
5. **Logs are gitignored** (`*.log` in `.gitignore`); the gate inputs live under untracked `REPO/tmp/`.
   The staged tarball (§5) runs the gate outside the repo tree (tested on the preparing machine
   only; `--rerun-tail` needs `cc` + FLINT 3.x); it is local and unpublished.
6. **No Lean statement of the Theorem 1.2 instantiation**, and no Lean model of H_t, B_t,
   f_t, Theorem 1.3, or the verifiers.
7. **Tail lemma and window-freeze theorem are written at the base row** (t0 = 129/800,
   N* = 3840000). Their use at t0 = 1583/10000, N* = 6000000 rests on the statement that the
   arguments are parameter-generic plus the verifier's exact premise checks; no restated note exists.
8. **Provenance links not recorded in logs.** The full-lane logs do not echo y², precision,
   K, hw or the mollifier hash; these are pinned only through the binding-row replays (3 rows per
   leg) that reproduce the lane rows bit-for-bit. The ydini logs record no source or binary
   hash; the link to `verify_ydini_genmoll.c` `748aff57…` rests on build timestamps and the
   2026-09-22 rebuild reproducing every integer counter of the partial runs. No independent
   full-lane replay exists.
9. **Two ydini B values differ** by 5.415e-9 (2.2e-5 relative) with identical structural
   counts (thread summation order under ball rounding); the larger is used. The printed
   "worst certified branch-(ii) ratio = 1.00000000745" is an `arb_div` diagnostic, not the
   decisive test (strict `arb_lt`).
10. **Package documents predate the audit.** `PKG/README.md` / `PKG/PROOF_NOTE.md` quote
    ε_cap ~1e-6, the final floor 1.622776e-3 (without ε_cap), and a tail verifier whose literals
    are the base row; the numbers in §3–4 above (audit module, gate) supersede them.
    `run_all.sh` GATE 2 still runs the older package tail verifier through environment overrides;
    the parameter-locked verifier exists only in `REPO/tmp/lambda01758/`.
11. **run_all.sh GATE 4** cannot find the mollifier when started from the package root
    (fails closed); patch prepared, not applied (§5).
12. The fail-closed gate runs checks on logged numbers; it does not re-run the lane, the
    y-transfer or the barrier (only the tail, with `--rerun-tail`).
13. Site pages and data modules now say "y-transfer reduction and Lemma B3 Lean-checked"
    (pages corrected 2026-09-29; the History page, which covers both candidates, says
    "parts of the reduction Lean-checked").
14. The Status paragraph of `REPO/src/pages/LambdaCandidate01758354Page.jsx` now records the
    2026-09-28 internal composition audit and states that it has not been externally reviewed.
    Still stale: the `four-gate-lambda.mp4` animation has the pre-audit wording, and the audit
    module's open item `page-status-and-sibling-wording` still lists the wording as uncorrected;
    that module is pinned by the gate's SHA-256 and will be updated at the next re-pin.

## 8. Packet contents

- `README.md` — this file.
- `REFEREE_CHECKLIST.md` — questions a referee should answer, keyed to §3.
- `MANIFEST.sha256` — sha256 and byte count of 103 referenced sources, logs, notes and seals
  across REPO / PKG / BASE / SWEEP (generator: `REPO/tmp/ns3-reviewpack-manifest.py`).
- `patches/run_all.sh-gate4-mollifier-path.patch` — GATE 4 fix + SHA256SUMS line, for a
  re-seal of the package. Not applied.
- `tools/verify_manifest.sh` — checks every MANIFEST entry (roots overridable by env).
- `tools/stage_gate_inputs.sh` — stages the gate and its 16 inputs into a standalone tree and
  optionally runs the gate there.
- `PACKET.sha256` — sha256 of the packet's own files (`shasum -a 256 -c PACKET.sha256`).
