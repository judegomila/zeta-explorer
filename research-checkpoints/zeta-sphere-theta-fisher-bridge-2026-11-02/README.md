# Zeta sphere / theta-Fisher bridge checkpoint

This checkpoint preserves the current **Zeta Sphere Vortices**, twin-ladder bridge,
theta-kernel, signed-anchor, and Fisher-information research as one auditable,
parallel-friendly package.

> **Status:** this work does **not** prove the Riemann hypothesis. It contains
> finite-order theorems, interval certificates, exact algebraic identities,
> counterexamples to stronger auxiliary premises, numerical evidence, and open
> bridge obligations. “Reviewed” in this package means internal or independent
> AI-assisted review/replay; it does not mean peer review.

## Reading order

1. [`STATUS.md`](STATUS.md) - the shortest honest account of what is and is not established.
2. [`CLAIMS.md`](CLAIMS.md) - stable claim IDs, scopes, dependencies, and non-implications.
3. [`paper/main.pdf`](paper/main.pdf) - the integrated research-program paper.
4. [`DEPENDENCIES.md`](DEPENDENCIES.md) - how the proved pieces and the open bridge fit together.
5. [`verification/README.md`](verification/README.md) - exact integrity and smoke-test commands.
6. [`PARALLEL_WORK.md`](PARALLEL_WORK.md) - branch, worktree, and ownership rules for parallel work.

## Frozen baseline and append-only deltas

The integrated checkpoint is a composition of the frozen v18 baseline and two
verified deltas:

- campaign v18, Library `libfile_93281585a66c81918ba351446f9d7615`,
  4,369,533 bytes, SHA-256
  `3a47ccddd9a529c719e4a2ca0a6b262290610cbc1d651f3dec20e8ffd8f5c9ef`;
- campaign v19, 4,843,375 bytes, SHA-256
  `8fe5bb4162a0650d297c3ec841b81111ef25c06ce19a1133725e87d4b7e90aa0`;
- CP62, Library `libfile_19a836c8b8a8819198a91a5abe44c640`,
  79,980 bytes, SHA-256
  `75db9056b1863e904afecbbf2a99de1ff108a48fd3b0ea2242c988e899aa7ccb`.

The campaign payload is stored under `evidence/v18-curated/`. The original v18
archive preserves all 537 v17 payloads byte-for-byte. In the public repository
derivative, eleven files were deliberately omitted because they were
third-party PDFs/HTML, nested archives, or conversation/provenance records;
nine otherwise publishable authored text files have only private conversation
references or stale pointers to omitted files replaced. The exact exclusions and deterministic public
redactions are recorded in
[`provenance/exclusions.json`](provenance/exclusions.json) and
[`provenance/redactions.json`](provenance/redactions.json). The original
archive identity is preserved above and in
[`provenance/artifacts.json`](provenance/artifacts.json); the archive itself is
not committed.

The v19 source manifest verifies 672 payloads and preserves all 585 v18
payloads byte-for-byte. Its publication-safe, append-only derivative is stored
under `evidence/v19-delta/`: 58 allowlisted authored files, with two text-only
privacy redactions recorded in
[`provenance/v19-redactions.json`](provenance/v19-redactions.json). The source
archive, private conversation capture, and acquired source extraction are not
committed; exact accounting is in
[`provenance/v19-publication.json`](provenance/v19-publication.json).

CP62 is stored byte-for-byte under `evidence/cp62/`. It postdates v17 and is not
part of the v18 campaign payload, so it is recorded as an explicit delta rather
than silently folded into the campaign freeze.

The checkpoint-level [`SHA256SUMS`](SHA256SUMS) binds every public file other
than the checksum list itself.

## Repository boundary

This checkpoint is independent of draft PRs 31-39. It does not cherry-pick or
modify those repair/checkpoint branches. Existing repository material is
cross-referenced in [`EXISTING_REPO_CROSSWALK.md`](EXISTING_REPO_CROSSWALK.md)
instead of being copied when an equivalent durable module already exists.

## One-command checks

From this directory:

```bash
python3 verification/verify_archive.py
python3 verification/run_smoke.py
make -C paper
```

The archive verifier uses only the Python standard library. Smoke tests run in
a temporary copy so evidence files are never rewritten.

