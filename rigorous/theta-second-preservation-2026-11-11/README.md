# Second theta preservation: a five-node checkpoint

11 November 2026. This continuation proves the full comparison class
after **two canonical theta reductions, at every pair of positive
anchors**. It yields strict **five-node real Pick positivity** and the
associated five-rate theta/arithmetic energy inequality. It does not
prove sixth-order positivity, arbitrary-depth preservation, or RH.

Start with the [complete proof](theta_second_preservation_global_20261111.md).
The full argument is computer assisted: explicit analytic comparison is
combined with rigorous ball-arithmetic certificates and exact symbolic
identities. No finite-height zero verification is used. No formal
proof-assistant, external peer-review, or literature-novelty claim is made.

## What changed

PR #52 proved the first reduced pair stays in the full comparison class.
Trying to repeat its sufficient source criterion reveals a genuine
obstruction: the next two original-theta source determinants are negative
near zero. This checkpoint proves that each has exactly one sign change,
and develops a comparison that allows that negative region.

The new comparison expresses the transformed determinant as an integral
against a positive kernel whose ordered two-by-two minors are
nonnegative. For a source changing from negative to positive once, an
initial positive transformed sign stays positive. All required origin
signs are then proved uniformly over the anchor parameters. This closes
the second preservation step.

## Results and boundaries

| Statement | Status |
| --- | --- |
| Next source determinants positive at every spatial point | **False:** both are rigorously negative on $0<t\le1/16$ |
| Each next source changes sign exactly once, from negative to positive | **Proved** on the full positive axis |
| Positive-kernel comparison controls that one crossing | **Proved**, including the order-two kernel determinant property |
| First-reduced higher source origin limits positive for every first anchor | **Proved** |
| First-reduced higher source signs positive for every anchor and spatial point | **Proved** by the preceding three inputs |
| Second curvature origin slope positive for every pair of anchors | **Proved**, including coincident anchors |
| Full comparison class after the second canonical reduction | **Proved** |
| Strict real Pick positivity at five distinct positive nodes | **Proved** |
| Sixth-order or arbitrary-order real Pick positivity | **Open in this program** |
| All-order energy positivity and RH | **Not proved** |

## Proof components

| Component | Main file |
| --- | --- |
| Complete theorem, implications, and exact five-node count | [Global proof](theta_second_preservation_global_20261111.md) |
| Higher call-transform identity, with higher differentiation handled correctly | [Higher transfer](theta_higher_transfer_20261111.md) |
| Positive Peano kernel, its two-by-two minors, and sign propagation | [Compensation theorem](theta_transfer_compensation_20261111.md) |
| Source determinants, infinite spatial tails, and an auxiliary large-anchor theorem | [Source analysis](theta_second_source_20261111.md) |
| Exactly one source crossing on the entire spatial axis | [Single-crossing proof](theta_second_single_crossing_20261111.md) |
| Both first-reduced source origin limits, all first anchors | [Source origin proof](theta_second_source_origin_20261111.md) |
| Compact-anchor source origin certificate and exact zero deflation | [Compact source origin proof](theta_second_source_origin_compact_20261111.md) |
| Second curvature origin slope, every pair of anchors | [Second origin proof](theta_second_origin_20261111.md) |
| Proof dependencies, certificate coverage, and review limits | [Audit](AUDIT.md), [Sources](SOURCES.md) |

## Reproduction

Use Python 3.12 with the pinned dependencies:

```bash
python -m pip install -r requirements.txt
python run_checks.py
```

The runner recomputes every new certificate, including 602 fresh moment
integrals. It shares those in-process models between the two compact
anchor calculations. It accepts no moment cache or diagnostic replay as
a proof input and rejects Python optimization that would disable
assertions. The fixed PR #52 sixth-derivative bound is also replayed.

Results are written to `checks_replay.json` and the individual replay
files. The diagnostics directory is separate: its 32 positive sampled
reduced-source cases and high-precision source probes are exploratory
checks, not premises of the proof.

The integrated replay passed on Python 3.12.14: **201 new exact checks,
12,604 new interval cells, 602 fresh moment integrals**, and the
additional 4,096-cell fixed sixth-derivative dependency. See the replay
for every gate, dependency version, and execution time.

All fixed preceding theorems are cited at immutable commits. Their PRs
are not presumed merged. This directory is an independent research
addition based on main and makes no application changes.

## What the next step must establish

The compensation argument is now a usable preservation mechanism at one
further step. Continuing toward an induction requires the appropriate
source sign pattern and origin inequalities for later actual reduced
pairs, or another structure that supplies them uniformly. The present
proof does not show that one-crossing behavior reproduces automatically
after each reduction. Finite-order positivity alone does not establish
the all-order premise in the existing RH closure theorem.
