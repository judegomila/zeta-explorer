# Independent verification protocol — compression v0.2

Date: **2026-11-20** (user locale).

## Purpose and current result

This is a concrete protocol for checking the announced formalization that the compression studies. **It has not been executed for this release.** The work completed here consists of source-byte/import checks, bounded reading of theorem bodies, and independent mathematical sublemmas. There is no local Lean build, export, axiom-closure verdict, or kernel-replay result to report.

The baseline is the upstream [README](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/README.md), [verification notes](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/verification/NOTES.md), [Comparator configuration](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/comparator.json), and [export targets](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/export-targets.txt), all pinned to the inspected commit. Use the exact documented commands from those files; this protocol adds acceptance conditions, not an untested replacement command sequence.

## 1. Freeze the challenge, solution and trusted tools

| Item | Required baseline |
|---|---|
| Submission repository | `https://github.com/leanprover-community/riemann-hypothesis` |
| Source commit | `c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2` |
| `src` Git tree | `24df20b62d9976ccd20da819bc20b16f808f0fdd` |
| Build/export Lean | `leanprover/lean4:v4.33.1` |
| Mathlib | `0df444a360eaa60ab8c11dca51a86af692955474` |
| Exporter | Upstream documents `lean4export` tag `v4.33.0`, revision prefix `15f6055e`, built with Lean `v4.33.1` |
| Baseline judge | Upstream documents Lean `v4.36.0`, its Comparator, Lean paranoid checker, and nanoda |
| Other dependencies | Exact resolved revisions in the pinned `lake-manifest.json`; branch names alone are insufficient |
| Allowed axioms | `propext`, `Quot.sound`, `Classical.choice` |

Obtain the tools from their official distributions and record their hashes and full revisions. Verify the dependency manifest and clean dependency contents independently. Keep the judge, clean challenge, and their trusted configuration out of reach of the solution build. A later toolchain or checker update can be valuable, but record it as a new verification configuration rather than silently changing the pinned baseline. The upstream notes identify version-specific kernel and checker issues, so “Lean accepted it” without a version is not an adequate record. [Pinned tool and version notes](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/verification/NOTES.md#lean-version).

## 2. Export a clean challenge independently of the solution

Use a clean environment that has not compiled the submitted project modules. The challenge imports only Mathlib and states five targets:

1. `riemannHypothesis` — Mathlib's `RiemannHypothesis`.
2. `riemannZeta_eq_zero_re` — the written-out zeta statement.
3. `LFunction_ne_zero_of_half_lt_re` — nonvanishing for all Dirichlet characters to the right of one half, with the principal pole exception.
4. `LFunction_eq_zero_re` — critical-line zeros in the open strip for every Dirichlet character.
5. `LFunction_eq_zero_re_of_isPrimitive` — the corresponding primitive-character statement.

The `sorry` placeholders in `Challenge.lean` designate goals to be solved. They are intentionally outside Main's import closure; they are not proofs supplied by the solution. The submitted targets must pass the separate permitted-axiom check without using an admission.

Follow the README's challenge build and `lean4export` stage with the pinned export-target list. The challenge export and its configuration must remain read-only and inaccessible to the solution build. If any earlier environment could have exposed them to that build, regenerate them in a fresh clean environment before judging.

**Acceptance artifacts:** the challenge source hash, dependency manifest, exact tool versions, build/export logs and exit codes, export size and SHA-256, and a statement review. Upstream reports the CI challenge-export SHA-256 as `bd484ac9886a96f26b1d9a7a59ebd45b7a70d102c015d4f31f9302bbdd6ab2b9`. Compare with it as a reproducibility check; a matching digest does not by itself prove the solution. [Pinned challenge instructions](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/README.md#checking-it).

## 3. Build the solution in a separate protected environment

Compiling Lean source runs its elaborator/metaprogramming code. Use a separate unprivileged build environment with no network, no credentials or personal files, a read-only root and toolchain, and only the necessary build-output storage writable. Prepare exact dependencies before entering that environment. Protect trusted dependency copies and the exporter; if a writable copy is needed for the build, compare it afterward against the protected clean copy and rebuild trusted tools independently before using them.

The README documents disabling the project artifact cache and aborting on internal panic. Follow those settings. The community cache includes outputs from untrusted pull requests and volunteer machines; restoration and `--no-build` are not independent verification. Use a fresh solution build for the claim being evaluated. [Pinned cache warning and build procedure](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/README.md).

Do not run the solution environment's tools or configuration on the trusted host after the build. Preserve logs inside the protected workflow. The upstream notes describe the rootless container boundary, subsequent dependency comparisons, and the need to protect/rebuild tools that were writable to the build. [Pinned sandbox details](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/verification/NOTES.md#sandbox).

**Acceptance artifacts:** source and manifest hashes, clean-build provenance, exact command record, sandbox/toolchain/dependency manifest, complete build log, exit code, and before/after checks of trusted dependencies and tools. A successful build is an intermediate result, not the final independent verdict.

## 4. Export the solution inside the protected boundary

Export `Main` using the trusted rebuilt exporter and the export targets from the clean challenge. Keep the solution build tree read-only during export; allow only the export output and controlled temporary storage to be written. Both the exporter and `lake env` consume files produced or configured by the solution build, so the export stage remains sandboxed.

Only the resulting export should cross into the judging workflow, and it remains untrusted input. Record its size, checksum, exporter revision, command, runtime and exit code. Do not equate successful export or a matching community-export checksum with successful checking.

Upstream reports another run's solution export as 61,570,595,788 bytes, with SHA-256 `5ea74b912147c5c93cc2b6d70cc727cf908df2f62ac6a20480a3fa02f6be244e`. The notes condition checksum reproducibility on exporter determinism. Treat this as a reported comparison value, not a result measured by this release. [Pinned export report](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/verification/NOTES.md#building).

## 5. Judge the clean challenge against the solution export

Run the exact Comparator export-to-export invocation in the pinned README from an empty judging environment, using the clean challenge export, clean configuration and protected judge toolchain. Its configuration checks the five target names and permits only `propext`, `Quot.sound`, and `Classical.choice`. Do not expand the axiom allowlist to make a rejection disappear.

The baseline configuration runs Lean's normal kernel plus **Lean paranoid** and **nanoda**. Preserve a separate result for each checker, including its executable hash, version, exit code, output and resource failure, if any. A timeout, out-of-memory exit, unsupported declaration or missing output is not a pass. [Pinned Comparator configuration](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/comparator.json).

The notes document compatibility problems for con-leche/con-ron on mutual reflexive inductives and for the Lean 4.36 bundled lean4lean on Lean 4.33.1 exports. They separately document a Lean-4.33.1-compatible lean4lean replay of compiled modules. Such a replay can provide a further checker design if completed, but the upstream smoke-test result is not a result for this submission. Record unsupported configurations honestly; neither reinterpret their failure as acceptance nor infer mathematical falsity solely from a checker incompatibility. [Pinned checker notes](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/verification/NOTES.md#checkers).

**Acceptance condition:** Comparator confirms the target statements and permitted-axiom closure, and every checker required by the recorded configuration completes successfully. Preserve full successful verdicts and exit codes tied to the exact challenge and solution hashes. A headline success string without this provenance is insufficient.

## 6. Finish the mathematical correspondence review

A completed kernel check establishes formal derivability of the exported targets under the stated trust base. The human compression additionally needs a reviewed correspondence from its mathematical objects and hypotheses to the formal definitions and actual proof dependencies.

The review must retain the selected arithmetic family, local/integral compatibility, mass and rank normalizations, uniform thresholds, implicit instances, and the fixed analytic-level/window comparison. It must distinguish the generic S76 interface from the actual selected route where necessary. A direct twin-ladder proof needs the separate exact map or whole-form comparison identified in `PROOF_OBLIGATIONS.md`; checking the external theorem does not construct that map.

**Acceptance artifact:** a signed or otherwise attributable review record identifying the reviewed commit, declarations, mathematical statements, remaining assumptions and any discrepancies. Record unresolved interpretation issues even if the kernels accept.

## 7. Resource planning from upstream reports

These figures are **upstream reports or estimates**, not measurements made for this release:

| Stage | Reported requirement or estimate |
|---|---|
| Overall disk | README gives about 100 GB, with careful management. |
| Solution build | Notes estimate 7–10 hours on 48 cores and 503 GB RAM. |
| Intermediate setup files | Notes warn that retaining every per-module setup file could approach a terabyte; their documented cleanup requires preserving the build's completion conditions. |
| Export | Another run reportedly took about 1 hour 20 minutes and peaked near 163 GB memory. |
| Kernel replay | Notes estimate roughly 4 hours each and about 150 GB memory for Lean and its hardened build, under an hour for nanoda, with substantial uncertainty. |

Provision for the actual measured peak of the intended configuration. Do not begin a run whose resource limits force a cache-only shortcut to be mislabelled as an independent build. [Pinned resource reports](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/verification/NOTES.md#building).

## 8. Required final verdict packet

The following artifacts must refer to the same run or to explicitly identified independent reproductions:

- Source commit/tree, source inventory hash and exact dependency manifest.
- Challenge statement review, challenge-export hash and provenance.
- Toolchain, exporter and checker full revisions and binary hashes.
- Protected-environment configuration and dependency-integrity checks.
- Fresh solution-build log and exit code.
- Solution-export hash, size, log and exit code.
- Comparator statement/axiom report and the result of every configured checker.
- Any additional compatible lean4lean replay, clearly distinguished from export checking.
- Exact command records, resource measurements, discrepancies and limitations.
- Human mathematical correspondence review and revised proof-obligation statuses.

Publish independently authored reports, hashes and appropriately reviewed verdict records. Keep credentials, personal or machine-specific paths, and external source copies out of the compression release. The upstream README states that the submission was published without a license and is mirrored for verification; this release cites it rather than redistributing it. [Pinned source/licensing statement](https://github.com/leanprover-community/riemann-hypothesis/blob/c6fe94ff45b0f01acc60c13ebcbd54880f41b3c2/README.md#license).

Until this packet exists, the status is **source audit and conditional mathematical compression; no independent Lean replay**. If it exists and passes, update the formal-verification status precisely while retaining any still-open twin-ladder transport or human-compression obligations.
