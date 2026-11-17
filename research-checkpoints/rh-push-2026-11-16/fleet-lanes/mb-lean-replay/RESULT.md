# mb-lean-replay: independent replay of the openai/math 7/8 Lean proof — INCOMPLETE (stopped)

Status: internal working note, 2026-11-16/17. INCOMPLETE. The run was stopped by the coordinator before the
build finished; the compute server is off-limits and nothing was relaunched. No new mathematical claim.
RH open, no QED. Labels: PROVED (checked here), READ (source read, not machine-checked here), NOT DONE.

## 0. Incident report (read first)

The coordinator reports a kernel OOM kill on the server and the loss of the user's own jobs, coinciding with
about 100 GB across 40 lean processes from this lane. What this lane ran, with times in server UTC:

* 01:49 Dedekind `lake exe cache get` + `lake build`, `nice 10`, `taskset -c 36-47`.
* 01:53 OAI `lake update` + cache + `lake build <2 targets>`, `nice 10`, `taskset -c 12-35`.
* about 02:16-02:19 **my error**: I ran `leanchecker --help` to read its usage. That binary has no help flag
  and treated the call as "replay everything on LEAN_PATH" in one process. It reached 110 GB RSS (825% CPU)
  before I saw it and killed it (about 3 min). `free` afterwards showed page cache down from 60 GB to 14 GB.
  A `journalctl -k` grep at that time returned 0 OOM lines, and 16 of the other python jobs were still running.
* 02:25 per-module `leanchecker` replay of the dependency closure, 12 processes, `taskset -c 0-11`.
* 02:37-02:40 the OAI build went from 1-3 to 24 concurrent `lean` processes (the import graph widened).
  Each `lean` process maps about 4 GB of oleans (RssFile 4.08 GB, RssAnon 0.42 GB in one sample). With
  Dedekind (12) and the replay (12) this is the "about 40 processes" state. My last reading (02:40) was
  `available = 204 GB`; I did not see the OOM.

Faults on my side: (1) the `leanchecker --help` run; (2) the task allowance (40 cores / 100 GB) was sized
against "125 GB free" while the box showed 81 GB available and load 24 at start, and I still ran three
concurrent job groups (48 processes at peak) instead of one; (3) no memory cap (`systemd-run --scope -p
MemoryMax`, `ulimit -v`) on any of them; (4) `taskset` limits CPU, not memory.

Left on the server, not cleaned because access is closed: `~/rh-push/mb-lean-replay/` (elan toolchains
4.34.1 and 4.35.0-rc3, openai/math checkout, Dedekind clone, partial `.lake` builds, logs; tens of GB) and
`~/.cache/mathlib/` (Mathlib cache archives, created by this lane, outside the slug directory). Both are
safe to delete.

## 1. What was established

| item | result | label |
|---|---|---|
| openai/math commit `adc7f1241b42e322a6451854ab7e4b4c146bf78a` fetched from GitHub on the server | reachable; `lean-toolchain` = `leanprover/lean4:v4.34.1` | PROVED |
| the 2926 files of `OAI/NumberTheory/DirichletL` in the upstream checkout vs the local workspace `~/lean-deps/qrh-verify/lean` | per-file sha256 lists identical (`src-hashes-local.txt`, `src-hashes-remote.txt`, `diff` empty); `lakefile.lean`, `lake-manifest.json`, `lean-toolchain` hashes equal | PROVED |
| `lake update` on Linux | exit 0; manifest unchanged (`git status` clean); Mathlib at `d13f23b7`, 0 local changes; all 23 compatibility patches applied and reverse-check verified (incl. PrimeNumberTheoremAnd, rellich-kondrachov) | PROVED |
| Mathlib cache | 8908 archives decompressed (2 downloads failed on first pass, second pass reported none missing) | PROVED |
| OAI `lake build` of `...DirichletL.Nonvanishing` + `...Hecke.Nonvanishing` | reached job 4710 of 7063 at 02:40 with 0 error lines; **not finished** | INCOMPLETE |
| import DAG of the 2926 modules | depth 404, median level width 2, max 38; the first ~320 modules build serially | PROVED (script) |
| non-OAI dependency closure of the directory | 5672 modules (Mathlib 3844, Lean 695, Init 649, Std 208, Aesop 132, Batteries 74, RellichKondrachov 15, Qq 14, Plausible 13, ProofWidgets 10, ImportGraph 10, PrimeNumberTheoremAnd 4, LeanSearchClient 4) | PROVED |
| `leanchecker` replay, dependency closure (one process per module) | 1659 of 5672 replayed at last reading, 0 failures; per-module result file is on the server and was not copied back | PROVED for the count only; module names not retrievable |
| `leanchecker` replay, OAI modules | 2 of 2924 on the server (`DirichletL.Endpoint`, `DirichletL.CubicSieve.Operator`), exit 0, plus `Mathlib.NumberTheory.LSeries.RiemannZeta`. With the 8 from the local audit/referee: **10 of 2924 distinct** | PROVED |
| `#print axioms` on the server | **not run** (needs the finished build) | NOT DONE |

The axiom list for the main theorems is therefore unchanged from `zf-audit-inputs` (local build of
2026-10-07, re-read 2026-11-16): `[propext, Classical.choice, Quot.sound]` for
`OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re`,
`OAI.DirichletCharacter.LFunction_ne_zero_of_seven_eighths_lt_re` and the three Hecke-family forms.
This lane adds no independent confirmation of it.

## 2. Faithfulness of the statements (READ; the Lean check file was written but not run)

`audit/AxOAI.lean` restates everything below as `example`s and lists, for each main theorem, every constant
of the statement with its defining module. It was not elaborated. By reading the source (hash-equal to
upstream):

* zeta / Dirichlet: `Nonvanishing.lean` states `(7/8 : ℝ) < s.re → riemannZeta s ≠ 0` and, for
  `χ : DirichletCharacter ℂ q`, `[NeZero q]`, `¬(χ = 1 ∧ s = 1)`,
  `_root_.DirichletCharacter.LFunction χ s ≠ 0`. Both are Mathlib's objects (the referee already checked the
  defining modules with `getModuleIdxFor?`). No OAI definition occurs in either statement. These two are what
  the 0.116091 chain uses.
* Hecke family (`Hecke/Family.lean`, `Hecke/IdealBridge.lean`, `IdealCharacter.lean`, `Hecke/Euler.lean`,
  `Hecke/Dirichlet.lean`): `K = CyclotomicField 3 ℚ`, `O = 𝓞 K` (Mathlib). A `Character` is a nonzero ideal
  `M`, a `MulChar (O ⧸ M) ℂ` trivial on the image of `Oˣ`, and a positive integer in `M` (bookkeeping);
  `Character.ofResidue` builds one from any such pair. `LFunction χ s := HeckeTheta.latticeL (coefficients χ) s / 6`
  is an OAI definition (theta/Mellin continuation). Mathlib has no Hecke L-function to compare with. The
  library proves:
  - `LFunction_eq_ideal_tsum`: for `1 < s.re`, `LFunction χ s = ∑' I : Ideal O, idealCoeff χ I / (absNorm I)^s`;
  - `idealCoeff χ = IdealCharacter.ofResidue`, a `Ideal O →*₀ ℂ` with `idealCoeff χ (span {z}) = χ.residue (mk z)`
    for `z ≠ 0` and value 0 at `⊥` (a `MulChar` is 0 on non-units, i.e. on ideals not coprime to `M`);
  - `LFunction_differentiableAt` (`s ≠ 0`, and `s ≠ 1` or `χ.residue ≠ 1`), `LFunction_entire_nonprincipal`;
  - `HeckeDirichlet.LFunction_eq_dirichlet_product`: for the norm-lifted character,
    `LFunction (character χ) s = L(s, χ) · L(s, χ·χ₋₃)` with Mathlib's `DirichletCharacter.LFunction`.
  So on `Re s > 7/8`, `s ≠ 1`, `LFunction χ` is the analytic continuation of the Dirichlet series of the
  finite-order Hecke character of `Q(√-3)` with modulus `M` (trivial infinity type; `O` is a PID so every
  ideal is principal). The series is the imprimitive one when `χ` is not primitive mod `M`; it differs from
  the primitive L-function by finitely many Euler factors with zeros on `Re s = 0` only.
  Verdict: the definition is faithful **by reading**, conditional on those four lemmas being kernel-checked
  with the standard axioms (they are in the 2924-module closure; `#print axioms` for them is in
  `audit/AxOAI.lean`, not run). Hecke characters with nontrivial infinity type are not covered by the
  statement.

## 3. Cureton-Thorner Dedekind project

`AxiomMath/DedekindZetaZeroFree` is public; cloned at `09afbb4ce6570c1615d58509dc197fc9f0956b7d`.
Lean `v4.35.0-rc3`, Mathlib `0493595e`, TauCeti `c197d7bd`, vendored class field theory (1658 files) plus
3867 project files, 1,289,438 lines.

* Statement (READ, `Challenge/DedekindZetaChallenge.lean`): for every number field `K` there is `f`,
  differentiable on `{1}ᶜ`, equal to Mathlib's `NumberField.dedekindZeta K` for `1 < s.re`, with
  `f s ≠ 0` for `31/32 < s.re`, `s ≠ 1`. Corollary: for `RayClassCharacter K m` (a project structure:
  multiplicative on ideals, zero exactly off the ideals coprime to `m`, 1 on `span{α}` with `α ≡ 1 mod m`
  totally positive at real places), an `f` with `HasSum (χ I · N(I)^(-s)) (f s)` for `1 < s.re`, entire if
  `χ` is not principal, nonvanishing for `31/32 < s.re`. The half-plane is 31/32, not 7/8. Stating it as
  "exists a continuation" avoids any project-defined L-function in the statement.
* Source scan (PROVED): 0 files with `sorry`, `axiom`, `native_decide`, `implemented_by`, `@[extern`,
  `ofReduceBool`, `skipKernelTC`, `debug.`, `unsafe`, `trustCompiler`, `bv_decide`, `#eval`, `csimp` in
  project, vendor and Solution (the Challenge file has the two intended `sorry`s). `run_cmd` in 5 project
  files (6 uses; not inspected). `opaque` only inside doc comments.
* Build: cache fetched (8939 archives); `lake build` was at about 3580 olean files (several per module under
  the module system; module count not determined) when stopped. **Not finished.** No axiom audit, no
  replay, no comparator run.

## 4. What remains (nothing below was done)

1. Finish the OAI build on Linux (2353 of 7063 jobs were outstanding) and record exit status.
2. `#print axioms` on the fresh build for the five main theorems and the four Hecke bridge lemmas; elaborate
   `audit/AxOAI.lean` (statement-constant listing and the faithfulness `example`s).
3. `leanchecker` over the remaining 2914 of 2924 OAI modules (+2 Hecke modules) and the remaining 4013 of 5672
   dependency modules (the 1659 done cannot be named from here; treat as 5672 outstanding unless the server
   file `replay-oai-deps/results.txt` is recovered).
4. Dedekind: finish build, `#print axioms` for `main` and `heckeCorollary`, `lake comparator`, replay.
5. qrh-lambda `Main78.lean` was not rebuilt on the server.

Measured costs for whoever redoes this: one `leanchecker <module>` call takes 5-6 s wall (1.4 s user,
3.7-4.2 s sys from page faults over about 4 GB of mapped oleans); a full pass over 2926 + 5672 modules is
about 47,000 CPU-seconds (13 CPU-hours). The OAI build is serial for its first ~320 modules (about 9-12 modules/min) and
then runs as wide as the core count; local total was 6.1 h of summed module time, critical path under 1 h.
Rules for a rerun: never call `leanchecker` without module arguments (no `--help`, no flags); put every job
group in a memory-capped scope; run build and replay sequentially, not together; cap concurrency at
available_RAM / 5 GB.

## 5. DH control

Not applicable to this lane (no argument made). H1 is a per-character statement and says nothing about the
Davenport-Heilbronn combination; see `zf-audit-inputs/RESULT.md` section 5.

## 6. Verdict and three weakest points

Verdict: **incomplete; no independent confirmation obtained.** The only new PROVED facts are source identity
with upstream at the pinned commit, a clean dependency resolution on Linux, 2 more OAI modules and 1659
dependency modules kernel-replayed with 0 failures, and a partial OAI build of roughly 575 modules with 0 errors
(jobs about 4135..4710 of 7063). The trust basis for the 7/8 theorem is unchanged: the single 2026-10-07 build.

1. The faithfulness verdict for the Hecke L-function is by reading four lemma statements; none was
   re-elaborated or axiom-checked here.
2. The 1659-module replay count is a last-seen counter, with no retained per-module record.
3. The partial build proves nothing about the final theorem: the modules that carry the proof's end
   (`Detector.FinalAssemblyUnconditional`, `Nonvanishing`) were not reached.

## 7. Files (local)

`src-hashes-local.txt`, `src-hashes-remote.txt`, `audit/AxOAI.lean`, `audit/AxDed.lean`,
`audit/DepClosure.lean`, `audit/replay.sh`.
