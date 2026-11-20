# Proof and execution audit

## Claim boundary

This checkpoint proves the two global mixed-source inequalities for
the actual theta system, relative to the immutable prior proofs in
`SOURCES.md`. Together with the prior third-origin theorem they give
third full canonical preservation and strict six-node real Pick
positivity at distinct positive evaluation nodes.

Arbitrary-depth preservation, positivity at every finite Pick size,
and RH remain open. The auxiliary Peano kernel's all-order total
nonnegativity is not substituted for the unproved all-order theta
source conditions. The supporting asymptotic theorems have their own
explicitly stated compactness scopes and existential thresholds.

## Dependency and strictness audit

| Issue | Resolution |
| --- | --- |
| Actual theta versus a finite theta sum | Every omitted mode and all required derivative errors are bounded on each certified region |
| Source orientation | Exact Wronskian factors retain the canonical minus sign in H and plus sign in Q |
| Output coordinate | The call outputs are composed with the increasing physical-coordinate map; the common positive Jacobian factors in the Wronskians and Peano kernel are explicitly accounted for |
| Weak variation diminution | A three-node cofactor argument proves the required orientation; compact source truncation precedes strict kernel approximation |
| Positivity of the transformed denominator | $I_Q>0$ is a fixed earlier first-source theorem; $I_U>0$ follows from the newly positive density |
| Circularity at the origin | The earlier $f_P/t^2$ limit is an independent origin input, used only to make the new source coordinate regular |
| Origin degeneracy | The scalar certificates remove their forced $t^{10}$ or $t^{15}$ factor analytically in $u=t^2$ |
| New prefix endpoints | The proof establishes positive origin coordinate derivatives and finite generalized jets, and finite-power bounds at infinity |
| Strict final signs | Strict positive second-source origin limits plus a positive comparison kernel propagate strictness; weak total nonnegativity alone is not asked to provide it |
| Coincident anchors | The fixed canceled identities and origin theorems include coalescence; the global compensation applies separately to every positive anchor pair |
| Full-to-Pick count | Third full pair gives fourth basic pair and fifth positive pair; five positive Schur reductions and the last positive pivot give size six |
| Earlier unmerged PRs | Inputs are fixed by commit, not by assuming any earlier branch was merged |

The main synthesis, oriented H/P propagation, endpoint conditions, scalar
source formulas, core crossing derivative, and full-theta tail estimates
received separate internal mathematical review. The H and U/crossing
implementations share the same three declared theta enclosure helpers.
The additional U implementation is independent corroboration at the
source-polynomial level, not an independent implementation of every
underlying Arb operation or helper estimate.

This review is internal. No external referee, formal proof assistant,
or independent reproduction by a third party is claimed.

## Primary executable checks

`run_checks.py` rejects optimized Python, checks the pinned package
versions, uses 512-bit interval arithmetic, and recomputes every new
certificate. It never loads saved JSON values as inputs.

| Component | Exact symbolic checks | Exact tail checks | Origin cells | Compact cells |
| --- | ---: | ---: | ---: | ---: |
| Oriented-source identities | 14 | — | — | — |
| Anchor-tail identities | 19 | — | — | — |
| Spatial-tail identities | 16 | — | — | — |
| H fifth source | 44 | 42 | 256 | 1,980 |
| Joint U source and fifth-source crossing | 44 | 28 | 256 | 1,980 |
| **Primary total** | **137** | **70** | **512** | **3,960** |

There are eleven primary execution gates. The 4,472 interval-cell
evaluations are two certificates on the same 2,236-cell spatial
partition; they are not 4,472 distinct spatial subintervals. The
joint U/crossing gate proves both source statements on its partition.
Its 1,980 compact cells comprise 20 negative-crossing-source cells,
four normalized-derivative cells, and 1,956 positive-crossing-source
cells. The positive U source is checked on every one of them.

The independent U replay adds seven exact identities and 26 tail
checks on the same 2,236 cells. Those figures are excluded from the
primary totals. It was run separately and its saved result is retained
as corroboration; the primary runner does not replay it redundantly.

Exact checks establish the recorded algebraic identities and rational
coefficient inequalities. The continuum level-set, compensation,
endpoint, and asymptotic arguments are written analytic proofs and
are not represented as mechanically verified merely because the
associated algebra script passes.

The fresh primary run passed all eleven gates in 55.061 seconds on
Python 3.12.14 with the pinned packages and 512-bit balls. The actual
observed execution record is `checks_replay.json`.
It records package versions, elapsed time, each complete gate result,
interval bounds, and the precise scope. Component JSON files are
reports of those runs. The prior PR53/PR54 full proof chain was not
rerun; its fixed theorems remain explicit dependencies.

## Domain and remainder checks

The origin calculations use degree-56 even Taylor models with distinct
remainder enclosures for every derivative. An artificial constant
error interval is never differentiated. The compact calculations use
full order-16 Taylor remainders and retain every polynomial determinant
coefficient. H also propagates the C integral backwards with an
explicit integral remainder and checks overlap with a direct endpoint
enclosure.

The U crossing is established by opposite certified endpoint signs
and a strictly positive derivative of $K_U/t^{15}$ on the entire
crossing bracket. The derivative is evaluated by the exact Wronskian
row identity, not by differentiating an interval remainder.

On the infinite tail, exact shifted-polynomial signs establish a
first-mode margin. An explicit full-theta logarithmic-jet error and
a determinant coefficient-norm bound keep the perturbation below
one half for all $\pi e^t\ge160$. H additionally encloses the
integrated first-mode ratio and its omitted-mode error. The tail
calculation is an unbounded-domain proof, not an endpoint test.

## Repository scope

Only the new research lane and its new decision entry are added.
Existing application, workflow and research files are not edited.
The three fixed helpers are copied byte-for-byte and their hashes are
recorded. No scratch probes, execution logs or Python caches are part
of the deliverable. `MANIFEST.json` covers every other delivered file
and the decision entry; it excludes itself to avoid a circular hash.

Repository CI is separate from the mathematical replay. Its result is
recorded in the PR after the new commit exists; passing repository CI
is not presented as independent verification of the mathematical proofs.
