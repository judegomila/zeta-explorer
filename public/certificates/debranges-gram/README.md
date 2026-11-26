# Certified finite de Branges Gram artifacts

This directory is reserved for JSON certificates produced offline by the
`rigorous/shear_gram` Arb/FLINT backend. Vercel serves these files; it does not
run the numerical certifier.

Every JSON file is checked by
`scripts/verify-debranges-gram-certificates.mjs`. The audit fails closed unless
the artifact:

- uses `debranges-gram-certificate/v1` and one of the three exact verdicts;
- keeps the input parameter and node coordinates as exact rational strings;
- states `finiteGramOnly: true`, `claimComplete: false`, `rhClaim: false`, and
  `rhSolved: false`;
- contains a matching attempt for the selected precision and verdict; and
- passes the input/case, formula, source, proof-payload, Gram-enclosure, and
  self-excluding certificate SHA-256 integrity checks. The source manifest must
  also match the checked-in `rigorous/shear_gram` Python package byte for byte.

The canonical JSON encoding sorts object keys recursively, uses UTF-8, emits no
spaces, and permits only safe-integer JSON numbers. `inputSha256` and
`caseSha256` hash the embedded `input`; `formulaSha256` hashes `method`;
`sourceSha256` commits to the Python source manifest; `proofPayloadSha256`
hashes the certificate with `hashes` removed; and
`canonicalCertificateSha256` hashes the certificate with only that self-hash
removed. Each `gramEnclosure.sha256` commits to the full row-major matrix of
Arb/ACB entry strings.

Run the audit with `npm run audit:debranges-grams`; it exits non-zero on a
malformed, stale, or dishonest artifact. In this repository the audit is not
part of the `build` script. The separate `npm run test:debranges-gram-audit`
command also checks that payload tampering, a rehashed RH claim, and duplicate
JSON keys are rejected.

A `CERTIFIED-POSITIVE-FINITE-GRAM` result proves positivity only for the one
finite matrix, bridge parameter, and node set recorded in the artifact. It is
not a proof of positivity for all nodes or all positive bridge parameters, and
it is not a proof of the Riemann hypothesis. An `INCONCLUSIVE` result is never
silently promoted to a positive or negative result.
