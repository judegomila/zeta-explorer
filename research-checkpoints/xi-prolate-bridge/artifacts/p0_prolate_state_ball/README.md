# `lambda=2` prolate-state ball artifacts

Finite diagnostic balls only.  The terminal state is `P0_INVALIDATED`.

- `lambda2_N3/` and `lambda2_N4/` contain producer and independent replay
  outputs at 256 and 512 bits.
- `lambda2_N4/raw_odd_gap_512bits.txt` intersects the four state outputs and
  the four existing Weil-matrix outputs, then certifies only the finite raw
  inversion-odd floor minus `q`.
- `INPUTS.sha256` pins code, source PDFs, and reused matrix inputs.
- `OUTPUTS.sha256` pins the raw interval outputs.

The two state paths share FLINT/Arb transcendental arithmetic.  No artifact
is an asymptotic theorem, determinant-convergence certificate, or RH proof.
