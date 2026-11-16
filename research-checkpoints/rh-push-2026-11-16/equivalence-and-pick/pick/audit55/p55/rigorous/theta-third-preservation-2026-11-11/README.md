# Third full theta preservation and six-node real Pick positivity

Research checkpoint, 11 November 2026. This continuation closes both
global mixed-source inequalities left open in PR #54. The proof combines
three scalar statements about the actual infinite theta kernel with an
oriented compensation argument. With the fixed earlier origin and
comparison theorems, it establishes third full canonical preservation
and strict six-node real Pick positivity.

The result is at a finite order. Arbitrary-depth canonical preservation,
positivity at every matrix size, and the all-order premise used in the
project's conditional RH implication remain open. These are internally
reviewed research proofs with executable certificates, not a formal
proof-assistant development or an external peer-review claim.

## Main result

Let $F(z)=\xi(1/2+z)$ and $L=F'/F$. Then

$$
\left[\frac{L(x_i)+L(x_j)}{x_i+x_j}\right]_{i,j=1}^{6}\succ0
\qquad\text{for all distinct positive real }x_1,\ldots,x_6.
$$

This follows from the two newly completed global source inequalities

$$
\partial_a\partial_t\log f_H(a,t)>0,\qquad
\partial_a\partial_t\log f_P(a,t)>0
\qquad(a,t>0),
$$

where the positive functions $f_H,f_P$ are defined in the main note.
All positive anchor pairs, including coincident anchors, are covered.
Through the fixed arithmetic/theta energy identity, the result also
gives strict positive energy for every nonzero combination of at most
six distinct exponential rates greater than one half.

Start with [the synthesis and complete implication chain](theta_third_preservation_global_20261111.md).

## Proof components

| Component | Role | Files |
| --- | --- | --- |
| Oriented level-set compensation | Converts fixed density signs into both global mixed signs | [Proof](theta_mixed_identity_20261111.md), [exact algebra](theta_mixed_identity_20261111.py) |
| Negative H fifth source | Proves $K_H=W_5(B',J',P',Q',H')<0$ for every $t>0$ | [Proof](theta_mixed_h_source_20261111.md), [certificate](theta_mixed_h_source_20261111.py) |
| U source and ordered crossing | Proves $S_U>0$ and one simple negative-to-positive zero of $K_U$ in $(1/2,9/16)$ | [Proof](theta_mixed_u_crossing_20261111.md), [certificate](theta_mixed_u_crossing_20261111.py) |
| Large anchors and uniform origin strip | Gives differentiated asymptotics and an independent boundary propagation result | [Proof](theta_mixed_anchor_tail_20261111.md), [algebra](theta_mixed_anchor_tail_20261111.py) |
| Spatial tails | Resolves comparable anchor/spatial scales, including the turning region, and fixed positive anchor intervals | [Proof](theta_mixed_spatial_tail_20261111.md), [algebra](theta_mixed_spatial_tail_20261111.py) |
| Independent U verification | Corroborates $S_U>0$ with a separate implementation | [Proof](theta_mixed_u_source_20261111.md), [certificate](theta_mixed_u_source_20261111.py) |

The boundary theorems are supporting results. The global proof uses the
scalar signs and oriented compensation; it does not attempt to cover the
two-dimensional anchor/spatial domain by patching sampled boundary regions.

## Reproduce the new certificates

From this directory, with Python 3.12 and ordinary non-optimized execution:

```sh
python -m pip install -r requirements.txt
python run_checks.py
```

The runner recalculates all new proof enclosures. It performs eleven
primary gates, comprising 137 exact symbolic checks, 70 exact tail
checks, and 4,472 interval-cell evaluations: 2,236 for the H certificate
and 2,236 for the joint U/crossing certificate. Each covers the same
256-cell origin partition and 1,980-cell compact partition, with an
analytic certificate for the infinite tail. The intervals are closed
and exhaustive; these are not point samples.

The separate U implementation can be replayed with:

```sh
python theta_mixed_u_source_20261111.py --all
```

Its seven exact identities, 26 tail checks, and 2,236 overlapping cells
are corroboration and are excluded from the primary counts. Its saved
replay was produced independently. No stored JSON replay is accepted as
an input by the primary runner.

All certificate comparisons use exact expressions or outward-rounded
Arb balls. The theta series beyond sixteen explicit modes, every
required derivative remainder, the C-integral error, both normalized
origins, and the full infinite spatial tail are included.

The earlier proofs are fixed dependencies and are not all rerun here.
See [SOURCES.md](SOURCES.md) for immutable commits and helper provenance,
[AUDIT.md](AUDIT.md) for proof scope and review, and
[checks_replay.json](checks_replay.json) for the observed primary run.

## Next research question

The next useful target is a theorem that preserves the needed signed
source ordering and origin strictness at every canonical depth. The
all-order total nonnegativity of the auxiliary Peano kernel is already
available; the missing assertion concerns the actual source densities
produced by successive theta reductions. Advancing one more finite
order would be evidence about that structure, but would not replace
an induction theorem.
