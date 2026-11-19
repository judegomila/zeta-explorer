# Corrected records in this directory (entered 2026-11-19 by lane `c14-repair-map-engine-checkpoint-record`)

Two files of this lane were replaced by the corrected versions written by `c13-repair-map-engine-battery-records`
(its `records_corrected/`). The originals are kept beside them. Nothing else in this directory tree was changed.

| file | now | original kept as | what changed |
|---|---|---|---|
| `records/screen.json` | sha256 88960cfa...c4fc5b (copy of `screen.corrected.json`) | `records/screen.original.json` (sha256 f67648c4...38692b) | record of the c11-rs3 numeric screen recomputed in 320-bit balls at ordinates with certified sign changes: 31 of 54 minima change (at most 1.3e-2), 2 of 54 fail counts change (gamma-only fake at h = 2: 12 -> 0, 31 -> 0); zeta windows and DH fail counts unchanged; extra fields (ordinates, enclosing balls) |
| `tables/zeros_HEAT--0.5.json` | sha256 f31a13d9...ecbc2f (copy of `zeros_HEAT--0.5.corrected.json`) | `tables/zeros_HEAT--0.5.original.json` (sha256 bd3cb471...dc97dc) | 17 off-line pairs added between ordinates 947 and 1947 (277 -> 294 pairs; `count_diagnostic` 34 -> 0; field `third_pass`); MEASURED, not an interval certificate |

Replay D1 against the record now in `records/screen.json`: 20 of 20 registered numbers (24 of 24 minima of the
four replayed windows within 1e-9); against `records/screen.original.json`: 19 of 20. Script and outputs:
`push/c14-repair-map-engine-checkpoint-record/d1_corrected.py`, `device_D1.c12_corrected_record.json`,
`device_D1.c12_original_record.json`, `logs/`. The agreement is with a record written after the battery
(not a blind test).

Not changed, and therefore describing the state before the correction: `devices/d1_debranges.py` (recorded numbers
typed into the script: it still reports 19 of 20), `tables/device_D1.json`, `tables/device_D4.json` (D4 read the
277-pair HEAT table; not rerun), `tables/MANIFEST.json`, `FILES.md`, `RESULT.md`, `REFEREE.md`.
