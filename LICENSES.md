# Licences

Attribution is required for everything in this repository. Two licences
apply, depending on what a file is. Third-party files keep their own licences
and are listed at the end.

## Code: MIT (`LICENSE`)

Source code and build configuration: `src/` (program code), `scripts/`,
`native/`, `rust/`, `rigorous/` (code), `lean/` and Lean sources under
`formalization/` (`*.lean`, lakefiles), `observatory/` (the renderer; everything
except `observatory/docs/`), verification and
analysis scripts wherever they sit (`*.py`, `*.mjs`, `*.js`, `*.jsx`, `*.c`,
`*.rs`, `*.sh`), and the configuration files at the repository root.

The MIT copyright notice and permission notice must be retained in all copies
or substantial portions of the code.

## Written and visual research content: CC BY 4.0 (`LICENSE-CC-BY-4.0`)

- `papers/`, `paper/`
- prose, notes, reports and manuscripts under `formalization/` (`*.md`, `*.tex`, `*.pdf`)
- `research-checkpoints/`, `research/`, `research-inputs/` (text, tables, result records, figures)
- documentation (`README.md`, `IMPROVEMENTS.md`, `SESSIONS.md`, other `*.md` files, `observatory/docs/`)
- figures, diagrams, animations and screenshots (`public/animations/`, `screenshots/`, PDFs under `public/`)
- site copy: the explanatory text, mathematical exposition and research records
  embedded in the data modules and pages under `src/data/` and `src/pages/`

Reuse requires attribution as described in `NOTICE`.

## Mixed files

Where a file contains both program code and research text (for example a
data module under `src/data/` that exports text together with helper
functions), the code is under MIT and the text is under CC BY 4.0.

## Numerical data

Tables of numbers computed by this project (certificates, caches, precomputed
field packs) are made available under
CC BY 4.0 to the extent that they are protected at all.

## Third-party material (not relicensed)

| Path | What | Licence |
|---|---|---|
| `observatory/dist/vendor/` (`three.core.js`, `three.module.js`, `OrbitControls.js`) | three.js 0.180.0 | MIT, see `observatory/dist/vendor/THREE-LICENSE.txt` |
| `public/portraits/*.jpg` | portraits of mathematicians | per image, see `public/portraits/CREDITS.json` (source and licence recorded for each file) |
| `formalization/review-packet/` | review packet prepared for Lean/Mathlib reviewers | Apache-2.0, see `formalization/review-packet/LICENSE` |
| `src/data/zeros-to-1e6.js` and other tables of zeta zeros | derived from A. Odlyzko's public tables of zeros of the Riemann zeta function | factual data; cite the source |
| npm, Cargo, pip and Lake dependencies | not vendored; installed from their registries | their own licences (`package-lock.json`, `Cargo.toml`, `lake-manifest.json`) |

Works by other authors that this research cites or verifies are not
included in the repository; see the `REFERENCE.md` files and the
bibliographies for where to obtain them.
