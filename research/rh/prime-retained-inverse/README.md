# Proposed local app slice — actual whole-even sqrt(33/2)

This directory is a local integration proposal, not a published app change.
`prime-retained-tail-certificate.md` is the proposed module; the manifest lists
repository destinations, exact claims, reproduction commands, hashes and
provenance. No runtime binaries are proposed for the app repository.

Validate the frozen package without running a numerical producer:

    python verify_source_slice.py

This checks every copied source/evidence hash, all19 driver dependencies, the
module hash, and every nontiming field of the complete producer/independent
receipts. It performs zero full positivity runs.

## Disposable mathematical replay

Install the pinned `python-flint==0.9.0` dependency in an environment approved
for numerical replay. Preserve this directory and its original receipts.
Copy `source-tree/` into a fresh disposable working directory and run the
following **from that copy**, not from the frozen source package:

    PYTHONPATH=/absolute/path/to/python-flint-0.9.0 python \
      rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt/certify_prime_retained_rankone.py --full

Use `--small` for the direct dense/generator preflight. The output is a fresh
receipt in the disposable tree. Compare its nontiming fields with the frozen
producer and independent receipts. The full command recomputes the actual
head, near couplings, coefficient matrix and complete sign test; it uses the
already pinned/inherited eighth-power prime-norm certificate and does not
re-enumerate that prime norm.

The original independent full replay already passed in an isolated source and
runtime tree. Its detailed audit records19 source copies and115 runtime files
unchanged. The copied preparation manifest is provenance for that completed
execution; it is not a promise that those runtime binaries are bundled here.

`THEOREM_ACTUAL_WHOLE_EVEN_X165.md` states the exact form/domain, quantifiers,
all-tail implication and support inheritance. The failed earlier comparison
is retained. LDL pivots are not reported as numerical coercivity constants.

## Execution safety and repository integration

Do not run with `python -O`, `python -OO`, or `PYTHONOPTIMIZE` set. The proof
checkers use assertions, which must remain enabled.

The canonical module destination is
`research/rh/modules/prime-retained-tail-certificate.md`. The included duplicate
module body is byte-identical and retained so the source-slice verifier can
check its reviewed hash. The coordinator should use a separate focused draft
PR on the appropriate existing renderer base, leaving prior frozen PR heads
unchanged. Publication, merge and production deployment are separate actions.

The original independent comparison script and replay log are included for
provenance. That script expects its historical isolated runtime/source layout;
use `verify_source_slice.py` for the portable receipt/hash comparison. Runtime
binaries are not vendored in this package.
