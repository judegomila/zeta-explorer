# v19 — H6 finite advance and independently paid information mechanisms

All585 v18 payloads remain byte-identical. The v18 baseline SHA-256 is `3a47ccddd9a529c719e4a2ca0a6b262290610cbc1d651f3dec20e8ffd8f5c9ef`; prior manifests remain in the private source artifact. RH remains unresolved.

## Newly independently checked in this version

1. **H6**: a newly authored Arb checker (not execution of acquired source) verifies the complete even4x4 polynomial-basis Gram >=I/60 on0<=a<=1/2. Its minimum Gershgorin enclosure is>.017009333438 and normalization upper<.031832362701. Exact normalized Schur reserve12915039062500/3>4e12 and determinant>2e23 follow. Combining the already-reviewed odd H5 block and the classical zero-strip/paired-Hadamard argument outside a>=1/2 yields full H6 for every a>0 and normalized endpoint a0. The earlier odd block was not rerun in this version. Source update's separate H5 Schur-window computation was not independently replayed here.
2. **Existing odd19 endpoint innovation split**: a new independent1000-cell Taylor parent-Gram replay, with complete orbit/spatial tails and padded inherited moment loading, certifies gain>.000252203292259, motion cost<.000091900511724, surplus>.000160302780535, ratio<.364390610847. All existing odd rungs3..19 pass. This is not a higher-degree target. The exact action-excess identity gives O(a³) loss and therefore an unspecified common small-shift interval for these finitely many rungs. Nonzero-shift numeric action comparisons are exploratory, not certified intervals or uniform-in-degree constants.
3. **Paid Newman cancellation**: the complete independent60000x1000 Arb rectangle replay at n2,a1/4,lambda[0,1] passes. Terminal lower>3.6442681947430, integrated paired cost<3.1520578244214, remaining lower>.4922103693903, all before the common pi/2 energy normalization. Derivative-square cancellation and reflection are retained before taking a positive-part bound. This demonstrates a rigorous finite paid mechanism, not new positivity order. Generic Cauchy/degree diagnostics are floating-only; their failures are costs of sufficient estimates, not target negativity.
4. **Orthogonality forcing identity**: exact D=(pi/2)[integral u³F²-2integral uK²] after actual signed lower same-parity orthogonality. The opposite-parity energy sign requires independent proof. This identity does not establish a uniform comparison and may give a worse local positive-part bound.

## Dependency and reproduction map

- source_2354_audit/replay_h6.py is independent campaign code. It uses python-flint/Arb and no acquired checker. H6_AUDIT.md records complete bounds, provenance and standard outer-shift argument.
- fisher_bridge_v3/certify_parent20.py uses mpmath interval arithmetic and inherited full_split_audit/actual_total_certificate.json; certify_endpoint.py consumes its parent output plus the same existing target moments. Independent replay copies/outputs are in fisher_bridge_v3_audit.
- paid_relaxation_v2/certify_n2.py uses python-flint/Arb. Independent full run and directed endpoint extraction are in paid_relaxation_audit. Default Arb display strings may be very coarse; use live assertions and directed endpoint JSON, not preview floats.
- orthogonality_forcing_v1 contains an exact identity and symbolic smoke test, with separate independent audit.
- Finite-shift probe/action/metric files and theta_budget*/gaussian_budget* are explicitly exploratory numerical diagnostics; they are not accepted interval theorems.

## Publication boundary

PUBLICATION_DELTA.json is an allowlist of newly added campaign-authored mathematical files, audits, and clearly labeled diagnostics. The new source ZIP, extracted original LaTeX/checkers and conversation capture are PRIVATE PROVENANCE ONLY and excluded from this allowlist. Existing immutable source captures are also not automatically publication-cleared. This delta does not claim all historic certificates were replayed again. Append only the accepted mathematical claims above to the repository paper; retain their exact scope and dependencies.
