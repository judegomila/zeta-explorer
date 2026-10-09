# RH cross-project synthesis — 8–9 October 2026

Read [the synthesis](../../formalization/paper/rh-cross-project-synthesis-2026-10-09.md) and [coverage](COVERAGE.md) first. This package contains a new finite directional residual certificate and exact controls, plus analytic consequences of the imported 7/8 result. It does not prove RH, improve the zero-free boundary, or certify a new continuum support.

## Reproduce

Python 3.12 and python-flint 0.8.0 were used. The coefficient regeneration and exact checker use only the standard library.

```bash
python -m pip install -r requirements.txt
python regenerate_row.py
python audit_exact.py
python audit_directional.py --bits 384
python verify_manifest.py
```

Run from this directory. Do not use Python's `-O` option: assertions are certificate gates. These commands write their receipts locally; the hash manifest binds the archived files, so a run producing environment-dependent descriptive formatting may require comparing the mathematical fields rather than expecting a whole-file hash match.

`audit_directional.py` verifies the sign using outward-rounded Arb intervals. Its rational capture columns are proposed from interval midpoints and then checked; floats are used only to display minimum LDL pivots. It freshly verifies finite detail positivity and the improved 16-dimensional matrix minus the claimed margin. The original 64-cell trial is unchanged, while sixteen additional inverse-capture directions live in the 128-cell observation space.

The full-space claim is deliberately rejected: applying the inherited analytic tail on the same grid gives a negative sufficient bound. This is recorded in `directional-results-384.json`; it is not a negative Weil energy. Do not combine this finite result with tail estimates from an unassembled finer grid.

`input/arithmetic-row.json` extracts only `arithmetic.k6_m128.q` from the saved discrete-curvature v3 inputs. Its parent-file hash is retained. `regenerate_row.py` invokes the unchanged inherited 440-digit directed-Decimal generator only for this row and compares every endpoint. The successful receipt is `coefficient-regeneration.json`. This verifies reproducibility of the input computation, not independent formal correctness of its analytic formula.

`audit_exact.py` verifies twelve rational inverse-bound/variational models, the shifted SELF identity and its off-axis control, normalization constants, and rejection of a compressed-inverse shortcut. These tests support the explicit proofs in the synthesis; they do not numerically prove any infinite-scale theorem.

The source ledger reports which material was inspected, merely inventoried, or not retrieved. Conversation search failed twice, so comprehensive chat coverage is not claimed. No originality, peer-review, or proof-assistant verification claim is made.
