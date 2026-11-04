# Escaping-cell capacity research checkpoint

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves the six frozen source files byte-for-byte, including their original checksum manifest. Earlier evidence, the integrated paper, application code, CI workflows, and live 4CT work are unchanged.

**The actual-theta capacity-tail estimate, selected source escape, negative-excess coherence, the relative Schur-excess estimate, and RH remain unproved. The entire countermodel is explicitly not the actual theta transform.**

## Results and limits

Read the [source summary](src/README.md) and [independent AI-assisted audit](src/AUDIT.md).

- The [capacity criterion](src/CELL_POSITIVE_EXCESS_CAPACITY_CRITERION.md) proves B_I <= Lambda_I <= 4 B_I, where Lambda_I is the squared local positive-excess operator norm. Because each fixed-cell block is compact, global boundedness is equivalent to bounded cell capacities, and compactness is equivalent to capacities tending to zero along escaping cells. No such tail estimate is proved for actual theta F. Universal optimality of factors 1 and 4 is stated for arbitrary target measures, not the narrower log-weight subclass.
- The [fixed-cell coercivity theorem](src/FIXED_CELL_COERCIVITY_AND_NEGATIVE_EXCESS.md) gives H_I >= (d_I-epsilon)X_I-C W_I, with d_I >= 1/9. The selected local value trace is summable. Consequently H[p_n] tending to zero would force the selected source mass to leave every fixed finite collection of cells. This proves a necessary condition, not that source escape occurs.
- Conditional on a finite capacity bound b_E for a collection of cells, every polynomial obeys e_E^+ <= 4b_E X_E and e_E^- <= (1+4b_E)X_E. Positive compactness would give only H/X <= 1+o(1). The negative cancellation needed for H/X tending to zero remains open.
- The [sparse entire countermodel](src/SPARSE_ENTIRE_VALLEY_COUNTERMODEL.md) preserves the baseline's complete real-zero geometry and multiplicities, order-one growth, and exponential derivative decay while making escaping positive capacities unbounded. It does not preserve exact theta arithmetic or the fixed-reference lower comparison. The sharper upper gamma envelope is retained only in a separately stated scaled-baseline variant. This limits the specified generic route; it gives no counterexample to RH or actual selected coherence.

The selected Green-kernel and trace identities used here are restated and checked in the fixed-cell note, with the supplied source-closure description as an input. The [capacity note](src/CELL_POSITIVE_EXCESS_CAPACITY_CRITERION.md) is included beside the fixed-cell note, resolving that dependency locally. Other unfrozen nonlocal-selected research is deliberately excluded from this checkpoint.

## Verification boundary

The source audit is AI-assisted analytical review, not external peer review or machine-formal verification. This preservation check verifies bytes, checksum coverage, and scope labels; it does not machine-verify mathematical proofs or reprove inherited theta/source-closure inputs. No numerical scan or literature-novelty claim is involved. No acquired third-party material is copied.

MANIFEST.json records the exact six-file source allowlist, byte lengths, and SHA-256 hashes. The original src/SHA256SUMS verifies its five Markdown payloads. The outer SHA256SUMS covers every package file except itself.

Run `python3 verify_checkpoint.py` from this directory to verify exact coverage, byte lengths, both checksum layers, and the scope labels. Preparation also compares all copied sources with their frozen originals. Only this new checkpoint directory is proposed for publication; no existing repository file is changed or removed.
