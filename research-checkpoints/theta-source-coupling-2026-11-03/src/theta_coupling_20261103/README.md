# Auxiliary source-coupling checkpoint

This checkpoint independently certifies the auxiliary upper bound on the old generalized spectral gap used in the proposed theta Schur strategy. It does not prove either of its two substantive mismatch estimates, any new signed pivot, or RH.

- RHO_QUARTER.md: fixed complete-theta degree-6/7 witnesses imply ρ<1/4 on all containing prefixes. Independent analytical audit and full MPFI replay passed.
- RHO_FIFTH.md: fixed degree-8/9 witnesses imply the original auxiliary ρ<1/5 hypothesis on all containing prefixes. Primary MPFI certificate, independent analytical/code audit, and independent full MPFI replay passed.
- SOURCE_COUPLING_REDUCTION.md: exact invariant U,C,V coordinates and the simpler direct Schur payment. Neither proposed theta-specific mismatch bound is proved.
- rho_quarter_certificate.json and rho_fifth_certificate.json: primary directed-interval outputs, not floating diagnostics.
- select_rayleigh_witness.py: explicitly unvalidated floating witness search, not a proof source.

Replay with the system libmpfi.so.0 and libmpfr.so.6:

python certify_rho_quarter_mpfi.py --cells 4000
python certify_rho_fifth_mpfi.py --cells 8000

No third-party source code, live 4CT scripts, or repository files were modified. Mathematical independence here means AI-assisted review/replay, not peer review or kernel formalization.
