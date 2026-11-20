# Actual-theta signed-synthesis transfer obstruction checkpoint

Author: Jude Gomila, with AI-assisted derivation, review and organization.

This append-only checkpoint preserves four frozen source files byte-for-byte, including the original checksum manifest. It does not change earlier evidence, the integrated paper, application code, CI workflows, or live 4CT scripts.

**This is an obstruction to a generic signed-synthesis transfer argument. It is not a result about the particular selected inverse-Gram column and is not a disproof of selected coherence or RH.**

## Established construction

Read the [source summary](src/README.md), [complete proof](src/ACTUAL_SIGNED_SYNTHESIS_OBSTRUCTION.md), and [independent AI-assisted audit](src/INDEPENDENT_TRIAL_RATIO_AUDIT.md).

An explicit degree-n, parity-preserving signed synthesis R_n uses only natural Pollaczek components with indices at least floor(sqrt(n)). Every retained component has favorable actual H/X of order at most 1/log n, yet H[R_n]/X[R_n] tends to one.

For the exact normalized synthesis vector c and actual source and derivative Grams G and J, the construction has c^T G c = 1, a diagonal derivative-energy sum tending to zero, c^T J c tending to one, and squared Euclidean coefficient norm at most C log n. The net off-diagonal derivative contribution therefore tends to one. These are actual-theta quadratic identities and estimates, not substitute matrices or an absolute selected-column estimate.

The monic trial S_n = n!R_n has relative source norm bounded below by c n^(5/2)/log n and above by exp[C log^2(n+2)]. Its trial mismatch/excess ratio tends to one. Subexponential near-minimality therefore coexists with this unfavorable trial behavior; relative near-optimality does not.

The subexponential Gram condition bound belongs to the natural hierarchy in which R_n is synthesized. No conditioning theorem is asserted for the different hierarchy consisting of R_n themselves.

## Remaining selected question

Nothing identifies the constructed vector with the selected inverse-Gram column defining P_n. No conclusion about selected Delta_n positivity or selected U_n/Delta_n follows. A stronger property of that specific selected vector, or a relative monic estimate, remains necessary. The construction does not refute such an additional property.

The [preceding Pollaczek checkpoint](../theta-pollaczek-2026-11-04/README.md) contains the frozen [source/reference comparison](../theta-pollaczek-2026-11-04/comparison/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md), [natural gamma-reference estimate](../theta-pollaczek-2026-11-04/comparison/NATURAL_GAMMA_REFERENCE.md), [uniform inner envelope](../theta-pollaczek-2026-11-04/natural/UNIFORM_INNER_ENVELOPE.md), [favorable natural-family result](../theta-pollaczek-2026-11-04/natural/NATURAL_FAMILY_RATIO.md), and [arithmetic-scale corollary](../theta-pollaczek-2026-11-04/natural/ARITHMETIC_SCALE_COROLLARY.md) used as inputs. Generic workspace paths retained inside frozen sources are provenance, not portable links.

The audit preserves its chronological addenda. Its later stronger trial-separation result explicitly supersedes the earlier limited-input sentence about divergence not yet being established. The final proof applies its wording corrections. No mathematical source text has been edited by this backup.

This is analytical research with independent AI-assisted auditing, not external peer review or machine formalization. No literature-novelty claim is made. This backup does not independently re-prove the inherited mathematical inputs.

## Integrity verification

MANIFEST.json is the exact four-file source allowlist with byte lengths and SHA-256 hashes. The preserved source SHA256SUMS checks its three final Markdown payloads. The outer SHA256SUMS covers all package files except itself.

Run `python3 verify_checkpoint.py` from this directory to verify exact coverage, original and outer checksums, byte lengths, and scope labels. This checks preservation integrity, not mathematical proofs. The preparation process also compares every copied source with its frozen original.

Only this new checkpoint directory is proposed for publication. No existing repository file is changed or removed. Service credentials, private conversation URLs, runtime files, and acquired external material are excluded.
