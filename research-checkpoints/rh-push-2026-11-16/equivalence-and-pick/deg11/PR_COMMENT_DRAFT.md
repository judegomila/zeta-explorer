Degree-11 positive-cutoff blocker: replay note (unaudited)

The odd11 "inconclusive in all 16 slabs" result in `FULL_SHIFT_DEGREE10.md` comes from midpoint-quadrature error in the spatial tail integral, not from the matrices. At 4000 tail cells the slab-0 channel-6 quadrature radius is 1.88 (last pivot 0.977 ± 1.95); at 16000 it is 0.028.

Unmodified `check_degree11_shift_slabs.py` (sha256 `7772cf74…`, inputs match this PR's `SHA256SUMS.txt`), only cell counts changed:

- `16 16000 4000`: even10 and odd11 pass in all 16 slabs; min odd11 LDL pivot ≥ 0.4123, monic Schur > 1.119e18; 52 s.
- `16 32000 8000`: min odd11 pivot ≥ 0.8411, monic Schur > 2.283e18.

If replayed and frozen: degree ≤ 11 positivity on 0 ≤ a ≤ 1/2, 0 ≤ H_cut ≤ 1/8. Nothing new at H_cut = 0. Degree ≥ 12 needs rigorous Gauss–Legendre or Taylor-model quadrature (radius grows 60–70× per channel).
