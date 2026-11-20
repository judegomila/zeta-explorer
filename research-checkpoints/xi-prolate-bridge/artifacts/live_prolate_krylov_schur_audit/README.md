# Live prolate/Krylov Schur pilot artifact

`lambda2_N3_N4_point_diagnostic.json` is a compact serialization of the
standalone replay in
`verifier/live_prolate_krylov_schur_audit.py`.

The `N=4` matrix input is the exact midpoint of the common intersection of
the two Arb assembly paths at 256 and 512 bits.  The projected prolate
coefficients for both pilots are only hashed 35-digit point outputs.  Hence
the serialized gates are point diagnostics, not interval results.

Regenerate the full report with:

```text
python3 verifier/live_prolate_krylov_schur_audit.py
```
