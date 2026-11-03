# Verification

The default checks are intentionally bounded and do not pretend to rerun every
historical certificate.

```bash
python3 verify_archive.py
python3 run_smoke.py
```

`verify_archive.py` checks every retained snapshot file against the original
manifest and every separately retained delta against its supplied checksum
list. It also checks that every policy exclusion is absent and that each of
the nine public text redactions matches both its original-manifest identity
and its recorded public hash in `provenance/redactions.json`.

`run_smoke.py` copies selected exact-rational verifiers to a temporary
directory and executes them there. This keeps the frozen evidence byte-for-byte
unchanged. The smoke suite covers algebraic normalization, joint
inverse/anchor identities, the matrix-anchor obstruction, and several
dependency-light rational certificate deductions.

The latest bounded replay and paper inspection receipt is recorded in
[`last-run.json`](last-run.json).

The default suite does **not** rerun Arb, the `2^21`-point DFT, interval
quadrature, `python-flint`, or the historical high-precision/third-party
dependency stack. The full historical commands and captured outputs remain
next to their source files in `evidence/`; their presence is provenance, not a
claim that this PR reran them.

