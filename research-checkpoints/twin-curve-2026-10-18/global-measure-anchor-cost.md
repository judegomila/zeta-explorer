# Cost of combining global measure control with anchor propagation

18 October 2026. Algebraic addendum to the separately reviewed good-height and anchor lemmas. It concerns the strength of those sufficient bounds, not a lower bound for the actual prime moment.

Fix x and a slab of length U. The good-height proof gives a bad-set measure bound M(j0)<=4UZ/j0 for the threshold j0. For an interior target, a centered interval of radius r>M(j0)/2 cannot consist entirely of bad points; hence it contains a good anchor. This requires that the interval remain inside the slab, or that a larger slab have been treated separately.

To propagate that anchor to the target at threshold jstar>j0, the exact Poisson-kernel lemma permits radius
r=x[sqrt(jstar/j0)-sqrt(j0/jstar)].
Thus a sufficient worst-case condition obtained solely from these two bounds is

2UZ < x jstar(1-q)sqrt(q), q=j0/jstar in(0,1).

The maximum of (1-q)sqrt(q) is2/(3sqrt3), attained at q=1/3. Therefore this sufficient route can succeed only when

jstar > 3sqrt3 UZ/x.

In particular it gives no all-carrier certificate at a desired threshold of order(log U)^2 for fixed positive x. It loses a full power of U. This does NOT imply that the actual bad set clusters, that the actual moment is large, or that another bridge is impossible. It shows precisely why a global measure upper bound plus this overlap lemma is insufficient. One needs local anti-clustering, a stronger carrier-specific estimate, or separately verified certificates in all uncovered corridors.
