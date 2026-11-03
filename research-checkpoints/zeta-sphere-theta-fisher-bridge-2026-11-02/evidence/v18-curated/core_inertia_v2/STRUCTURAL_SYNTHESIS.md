# Signed-core repair: what this experiment establishes and leaves open

The certified negative core subspace is not a reason to abandon the cumulative-tail route. It distinguishes two mechanisms:

1. A fixed two-channel **binary covariance** correction has rank at most two and necessarily misses some direction in the certified three-dimensional negative core subspace.
2. The **actual outer-tail Schur reserve** is not constrained by that rank. The new interval run shows it dominates all the core Schur costs on this particular subspace by a factor greater than600, before covariance is added.

Thus the appropriate all-degree target is a tail-normalized signed-core inequality, not pointwise positivity or a fixed-rank covariance slogan.

For a positive lower block and actual tail Schur T_J>0, define the exact relative residual operator

K_J = T_J^(-1/2) [C_J + V_J] T_J^(-1/2),

where C_J is the core Schur residual and V_J the nonnegative binary covariance. Full closure on the residual space is equivalent to lambda_min(K_J)>−1. A sufficient condition ignoring covariance is

lambda_max(T_J^(-1/2)(−C_J)T_J^(-1/2))<1.

Neither condition follows from a bound on the number of negative core directions. The present factor600 result is only on the explicitly fixed rational subspace Z, using restricted forms Z*T_J Z and Z*C_J Z. It does not bound the operator on the complementary directions or their cross-couplings. Nor does a single fixed positive shift imply uniformity in a.

A useful all-degree advance must control this **actual-tail relative cost**, potentially through an increasing family of lower channels or an adaptive spatial partition. The independently proved Gaussian outer theorem supplies pointwise positivity beyond a degree-dependent boundary, but its far-tail mass alone may be exponentially too small; absolute core bounds discard precisely the correlated structure retained in these Schur forms.

No all-degree estimate or RH conclusion is claimed here.

## A precise complement-coupling condition

Suppose an invertible congruence separates the core residual into C=diag(−N,P), where N>0 and P>0 (zero directions require separate handling). Write the actual tail in matching blocks T=[Tnn Tnp;Tpn Tpp], T>0. Then C+T>0 is exactly equivalent to

Tnn−Tnp(P+Tpp)^(-1)Tpn > N.

Consequently the following **actual-tail-relative**, degree-independent sufficient conditions are valid:

Tnn >= kappa N,

eta = ||Tnn^(-1/2) Tnp (P+Tpp)^(-1/2)||² < 1−1/kappa.

Indeed the Schur reserve is at least (1−eta)Tnn. With kappa=600, the needed complement-coupling bound is eta<599/600. This is a concrete verifiable theta-dependent condition, not a proved uniform bound: neither complete inertia splitting nor this coupling bound is established by the three-dimensional certificate.

A more conservative criterion removes P: the shorted tail Tnn−Tnp Tpp^(-1)Tpn>N suffices, because P+Tpp>=Tpp. This shows why bounding only Tnn is inadequate and identifies exactly the cross-region/cross-degree term that a uniform proof must estimate. Nonnegative covariance may be included in T to improve either condition, provided the resulting block matrix remains positive.
