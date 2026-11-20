# Receipt audit

The companion audit verifies both receipt hashes and integrity payloads,
their bindings to the same verifier and three archived inputs, the Arb sign
of every displayed `X_n` ball, and exact agreement of the 384- and 640-bit
sign classifications and strict-conclusion records.

The audit is independent receipt parsing and classification.  It does not
recompute theta quadrature, and the two numerical receipts use the same
interval implementation.  Accordingly this is not external peer review or
an independent mathematical implementation.

Result: **PASS**.  The common classification is zero at 1, negative at 3,
positive at 5, 7, 9, 11, 13, and 15, and indeterminate at 17 and 19.
