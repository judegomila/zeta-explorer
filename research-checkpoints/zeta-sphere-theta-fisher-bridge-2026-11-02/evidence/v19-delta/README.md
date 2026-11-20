# v19 publication-safe delta

This directory appends the reviewed v19 mathematical delta to the frozen v18
checkpoint. It does not replace or rewrite `../v18-curated/`.

`PUBLICATION_DELTA.json` is the unchanged source allowlist and binds 58 newly
authored mathematical, audit, certificate, and clearly labelled diagnostic
files. Fifty-six retained files are byte-identical to that allowlist. Two text
files have repository-only privacy redactions recorded in
`../../provenance/v19-redactions.json`; their original source hashes remain in
the allowlist and the immutable private archive.

The source archive has SHA-256
`8fe5bb4162a0650d297c3ec841b81111ef25c06ce19a1133725e87d4b7e90aa0`,
contains 672 verified payloads, and preserves all 585 v18 payloads
byte-for-byte. The archive itself, its conversation capture, and 24 extracted
third-party-source files are deliberately not committed. Exact public/private
accounting is in `../../provenance/v19-publication.json`.

The new claims remain finite in scope: complete theta H6 positivity, an
endpoint payment certificate for the existing odd rungs through 19, one paid
degree-2 Newman-flow certificate, and an exact orthogonality-forcing identity.
They do not prove an all-order hierarchy or the Riemann hypothesis.
