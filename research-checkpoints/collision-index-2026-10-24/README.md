# Collision index and conditional RH continuation

24 October 2026. Analytical groundwork, kept separate from finite numerical certificates.

## Local theorem and orientation

Let `h(t,x)` be real analytic near a real point `(t0,x0)`, real valued on real arguments, and satisfy the backward heat equation `partial_t h = -partial_x^2 h`. Suppose the spatial zero of `h(t0,·)` at `x0` has exact finite multiplicity `m >= 2`.

Then `(h,h_x)` has an isolated zero there, with ordinary Brouwer local degree

`index = -floor(m/2)`.

The domain orientation is the usual positive orientation in coordinate order **`(t,x)`**; the target order is **`(h,h_x)`**, equivalently the winding of `h+i h_x`. Reversing either orientation reverses the sign. No genericity, transversality, simple-double-collision assumption, or exclusion of odd/higher multiplicity is required.

The [complete proof](LOCAL_COLLISION_INDEX.md) controls the analytic remainder under parabolic rescaling, proves actual isolation, and computes the model degree using a regular target. A finite sample of multiplicities is not substituted for the proof.

## Finite region and the unresolved global estimate

For a bounded Jordan region, analyticity on a neighborhood of its closure, the heat equation, no identically zero spatial slice and boundary nonvanishing give

`boundary winding = -sum floor(m_collision/2)`.

Under those hypotheses, zero winding excludes interior collisions. **Boundary nonvanishing alone does not imply zero winding.** The common negative index does not supply the needed zero winding and cannot be used circularly to assert it.

The conditional RH continuation in the note additionally requires genuine-field boundary approximations with strict relative error and winding zero for an exhaustive sequence of boxes, an appropriate simple all-real anchor, uniform compact confinement of nonreal zeros on each positive-time slab, and the stated analytic convergence/continuation inputs. The independent global boundary estimate for every box is **unproved**. Finite certificates, even those reaching time zero at a bounded height, do not discharge that quantifier. No RH proof, new Newman bound, or novelty claim is made.

## Review and verification limits

This is a full mathematical argument that received a separate internal mathematical review. It is not a proof-assistant formalization or external peer review. The included hash check verifies document bytes only, not the theorem:

```sh
python3 research-checkpoints/collision-index-2026-10-24/verify_manifest.py
```

The source note was curated only to remove private discussion provenance and audit-process framing; the local proof and conditional hypotheses are retained. Its original content identifier is SHA-256 `80808e7bfd2f28d4691269f643af469726ef98a68edb66efa262a476706d46ef`. That identifier is historical provenance, not a link to a missing computational input. This analytical checkpoint has no numerical data dependency.

## Related but separate work

- [PR 16: determinant and adjacent-gap collision groundwork](https://github.com/judegomila/mathexplorer/pull/16).
- [PR 17: finite central real-axis positivity](https://github.com/judegomila/mathexplorer/pull/17).
- [PR 18: genuine-field finite-box and bounded-height endpoint certificates](https://github.com/judegomila/mathexplorer/pull/18). Its direct interior coverage does not rely on this index lemma.

Those PRs remain separate. This checkpoint imports no unrelated multimode, contour or Dyson research and makes no application changes. Public mathematical sources are cited in the [note](LOCAL_COLLISION_INDEX.md#sources-and-status).
