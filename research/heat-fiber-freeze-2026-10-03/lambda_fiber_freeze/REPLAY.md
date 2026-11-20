# Replay and scope

All scripts run locally and make no network requests. Only mpmath is needed for the rigorous local cell and exact Python rational arithmetic for the algebraic gates. NumPy is needed only for the nonrigorous phase screens. Exact observed software versions and file hashes are in run_manifest.json.

1. Run `python3 verify_exact_gates.py` for the exact rational row, affine-dependency example and graph-leakage counterexample.
2. Run `python3 certify_local_cell.py` for a full40-digit interval-cell replay. It evaluates690988 terms and took about112 seconds in this environment.
3. Run `python3 certify_local_cell.py --dps 60 --output local_cell_certificate_60dps.json` for the same implementation at higher precision.
4. Run `python3 probe_correlated_freeze.py --samples 5 --N 690988 1000000 4050000` only to reproduce the nonrigorous45-point reconnaissance.
5. Run `python3 verify_coarse_tail_constants.py` for the directed constants in the self-contained N>=10^17 analytic tail. Read ANALYTIC_TAIL.md for the universal inequalities and monotonicity proof; the script by itself checks only the constants.

The rigorous run must report local_H_nonvanishing_certified and local_P97_disk_certified as true, with global_coverage_certified and lambda_lt_0145_proved remaining false. The latter two fields mean that no global proof is supplied, not that the mathematical statements are disproved.

The inherited repository source files are external audit inputs, not dependencies of the new local-cell or analytic-tail checks. Their inspected byte identities match provider Git blob IDs and their SHA-256 digests are in source_file_hashes.json; retrieve them from the pinned repository URLs in the report if needed. This bundle does not contain or claim a replay of the unavailable historical V3 archive.
