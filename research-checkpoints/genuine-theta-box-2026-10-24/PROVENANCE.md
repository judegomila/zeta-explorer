# Provenance and verification scope

The source package was frozen on 24 October 2026. Its original inventory is retained as [SOURCE_SHA256SUMS](SOURCE_SHA256SUMS). All 18 original entries matched before curation. That historical inventory is not the verifier for edited documentation: [SHA256SUMS](SHA256SUMS) binds the current published files instead.

Computational scripts, exact certificate JSONs, dependency/environment records and numerical outputs are preserved from that package, except that one absolute workspace prefix in `audit_independent_output.txt` was replaced by the corresponding relative filename. The three numerical JSON archives are unchanged. README reproduction instructions were made portable; a private discussion link was omitted from `PROOF.md`; the audit note received minor editorial changes with no mathematical claim change. No private conversation transcript or endpoint extension is included.

Before publication, the source manifest and the exact rational offline verifier passed for both saved precision runs and the audit replay. The publisher also freshly regenerated the 384-bit and 512-bit certificates and reran `audit_independent.py` on a disposable copy. All mathematical JSON fields matched their respective saved artifacts after excluding the measured `elapsed_seconds` field. The regenerated geometry checks and the five extended-integral consistency checks passed.

These fresh runs are replays of the included implementation. They do not turn the computation into an independent implementation, an externally verified result, or a formal proof-assistant theorem. The separate audit checks stated analytic lemmas, the exact coverage/winding bookkeeping and selected direct-integral comparisons; see [INDEPENDENT_AUDIT.md](INDEPENDENT_AUDIT.md) for their precise scope.

The checkpoint is self-contained for this finite-box computation, subject to the stated Python/python-flint/Arb software trust and analytic proof. It neither uses nor reconstructs the earlier omitted approximately 1.1 GB arithmetic certificate bundle. No claim about recovery or current availability of that separate bundle is made here.
