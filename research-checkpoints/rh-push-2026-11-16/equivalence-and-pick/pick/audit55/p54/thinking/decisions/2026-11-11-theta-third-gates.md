# Decision: close the third theta origin conditions and isolate the spatial source gate

Date: 2026-11-11.

## Context

The user authorized continuing the actual-theta propagation research and
logging substantive results in a new GitHub PR. PR #53, fixed at
`5d64d45acf37f4957a8f65c036b502e1b49292d0`, establishes full comparison
through the second canonical pair and strict five-node real Pick
positivity. Its signed-source compensation mechanism suggested a
repeatable operator, but did not establish source inheritance at every
canonical depth.

The next concrete step was to test that mechanism and close the origin
conditions for third full preservation, while keeping the all-order RH
premise explicit.

## Decision and results

Add the standalone research lane
`rigorous/theta-third-gate-2026-11-11/`, with the synthesis, component
proofs, pinned verifier, replay records, immutable sources, audit, and
hash manifest. Keep the new PR in draft for mathematical review.

The completed continuation proves:

- Third-origin curvature for every positive anchor triple, including
  repeated anchors. A canonical divided-difference identity reduces the
  problem to positive curvature of a two-by-two matrix in one anchor
  coordinate. Compact interval certificates and an analytic tail cover
  the full domain.
- Positive origin limits for both next sources at every positive anchor
  pair. The proof includes exact even-variable deflation, a new global
  fourteenth-derivative bound, and a Bernstein certificate for the entire
  unbounded anchor tail.
- Total nonnegativity of every finite order for the Peano compensation
  kernel, with variation diminution and finite composition under the
  stated integrability conditions. Gaussian smoothing resolves the knot
  regularity needed for the analytic all-order proof.
- An exact equivalence between the remaining next-source conditions and
  two mixed logarithmic-derivative signs in one anchor and one spatial
  variable, including the coalescent limits.
- Two obstructions to stronger shortcuts: pointwise positivity of the
  higher-source hierarchy still fails after reduction at sufficiently
  large anchors, and no nonzero constant linear combination of the
  original two signed densities is globally nonnegative.

Finite-step regularity and theta decay also carry through the established
positive pairs, so the remaining third-step requirement is the two
global spatial source signs. The separate all-order operator result
does not provide joint anchor positivity or source inheritance by itself.

## Validation

The final integrated runner passed all twelve gates. It recomputed 602
shared moment coefficients and two additional origin moments. It checked
85 new exact symbolic checks, 32 exact rational tail assertions, 8,192 new
compact-anchor cells, 2,048 new spatial derivative cells, and 768 tail
Bernstein-coefficient interval checks. The source-origin tail reports
1,436 assertions including its interval checks and bookkeeping. A further
6,144 cells replay fixed prior bounds; three rigorously enclosed point
witnesses prove the signed-span obstruction. These categories overlap
and are not added into one total.

The run used Python 3.12.14, SymPy 1.14.0, python-flint 0.9.0, and mpmath
1.3.0, taking 136.779 seconds. Diagnostic quadrature samples are excluded
from proof inputs. Independent internal reviews checked the principal
algebra, endpoint normalizations, analytic tails, and claim boundaries.

## Consequences and next task

The established Pick order remains five. Six-node positivity is a
conditional consequence of proving both remaining mixed signs over the
whole positive quadrant. The next target is that actual-theta source
comparison, using the source criterion in the new lane. An alternative
is a propagation theorem controlling the ordered signed-density
determinants for each new canonical prefix.

All-order canonical preservation and RH remain open. The research
does not claim external peer review, formal proof-assistant validation,
or novelty relative to the literature. Publication is an additive
research change based on main
`942ba1760c4ef54a519750ab91c37a661c31e0ce`.
