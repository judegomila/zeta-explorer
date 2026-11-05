# Import provenance

Imported on 2026-11-05 from `Vortex_Bridge_Reserve_v1.zip`, archive version 5, last modified 2026-10-30. The filename's `v1` is not the archive version number. The source contains 30 files under `vortex_bridge_lab/`.

Archive SHA-256:

```text
efd24addd94342a0a8ade1477f54937cbb17cc055ebaf1b9513b88908cd45a1e
```

All 29 entries in the archive's `MANIFEST.sha256` matched before import. That manifest is preserved as [provenance/source-manifest.sha256](provenance/source-manifest.sha256); its paths refer to the original archive root. The original README is preserved as [provenance/source-README.md](provenance/source-README.md).

The six substantive research notes, nine Python scripts, JSON snapshots, and small Fisher diagnostic CSV are imported byte for byte. The current README, this provenance note, `replay.py`, `.gitignore`, `VALIDATION.md`, and the current package manifest are integration additions. The root repository README gains a link to this package. No application behavior or existing mathematical implementation is changed.

## Reproducible files omitted from Git

| Original file | Size in bytes | Regeneration |
| --- | ---: | --- |
| `certificate/reserve_leaves.csv` | 29,048,858 | `python3 verify_reserve.py --limit 1000000` |
| `window_values.csv` | 266,873 | `python3 window_audit.py`, after the reserve computation |
| `reserve_check.png` | 207,286 | `python3 diagnostics.py`, after the reserve computation |
| `window_comparison.png` | 291,902 | `python3 plot_window_audit.py`, after the window computation |

The certificate summary retains the event-table hash. The replay also checks both regenerated table hashes against the original manifest. Plot bytes may depend on plotting-library versions and are outside the core replay.

`MANIFEST.sha256` in this directory covers the committed package files, excluding itself. Check it from this directory with `sha256sum -c MANIFEST.sha256`. It is a file-integrity check, not a proof certificate.

## Relationship to the existing repository

Comparison baseline: `judegomila/mathexplorer` main commit `942ba1760c4ef54a519750ab91c37a661c31e0ce` (tree `d94ea0ebf222f4af4c2599d5f094288fe5c49094`). The root README, research-inputs index, formalization guidance, and the existing `src/math/mobius-rh-connection.js` were inspected. Filename-tree searches covered `formalization/`, `research-inputs/`, `thinking/`, `scripts/`, and `src/`; repository text searches sought Suzuki, centered Vaughan, and the bundle title. This was a targeted comparison, not an audit of every repository file.

The existing Möbius module discusses the Liouville ratio `zeta(2s)/zeta(s)` and is not this centered Vaughan calculation. The existing research-inputs folder is for source PDFs. This new `research/vortex-bridge-reserve/` directory keeps the executable research package separate from those PDFs, the app, and Lean scaffolding. No exact copy of this package was identified in the inspected material.

## What the import verifies

The import checks archive integrity and replays the local arithmetic calculations. It does not independently verify all analytic arguments in the notes, execute an external Lean proof, or reassess the current state of RH research.

`PRIORITY_AUDIT.md` and `benchmark_sources.json` preserve an October 22 source-inspection record, including the original limits of that inspection. Their links are historical references, not independently rechecked benchmarks from this import. `MOBIUS_CENTERING.md` refers to the user's version-7 manuscript; that manuscript is not bundled here. The final statement in the original `REPORT.md` that no repository was changed refers to its October 21 session, before this import.

No source PDFs, external proof dependencies, or private account identifiers are added. The full infinite signed estimate remains open.
