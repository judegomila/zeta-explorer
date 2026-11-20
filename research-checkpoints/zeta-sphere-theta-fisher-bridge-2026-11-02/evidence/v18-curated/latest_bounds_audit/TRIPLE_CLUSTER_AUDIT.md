# Independent triple-cluster audit

2 November2026,21:10UTC. PASS conditional only on the explicitly inherited, previously independently audited confluent_v4 full-kernel interval certificate. No global positive-definiteness or RH assumption.

Read cluster_extension_v1/TRIPLE_CLUSTER_THEOREM.md and its newly authored check_constants.py; replayed that script successfully. Read the complete prior confluent_v4/CLUSTER_CERTIFICATE.md to check parameter range, factorial normalization and local lower-margin transfer.

The exact profile polynomial recurrence is correct; the global envelopes retain every theta term and give derivatives0..4 bounded by3e9 exp(-5u²). The majorant splits exp(-2r/3) into two factors, uses r^m exp(-r/3)<=3^m m!, and sums n^-1/2 exp(-n²)<1. The largest computed polynomial coefficient bound5711288157/2 is below3e9. Product differentiation and the normalized weight yield K_a derivatives0..4 bounded by2e19 exp(-10v²) uniformly0<=a<=1/2.

The factorial-scaled Newton simplex formula introduces no missing factorial: r![nodes]f is an average of f^(r). Each cross-block dimension is at most3, so the entry bound yields operator norm<=3M exp(-10(d-.001)²). With centers separated2.5, block Schur row/column sums give epsilon=6M20^-20/(1-20^-60)=approximately1.1444091796875e-6. Dividing by local margin9/2000 gives relative norm0.0002543131510416667<1/3000. Subtracting epsilon leaves0.004498855590820312>449/100000.

The block diagonal has uniform upper and lower bounds; the infinite direct-sum operator and its coordinate Schur complements therefore require no unbounded inverses or unsupported domain passage. Collision limits are controlled by the simplex formula and summable off-block majorants. A uniform lower margin is correctly claimed only in the Newton/Hermite coordinates, not the original collapsing point basis.

Scope: arbitrarily many clusters, each containing at most three nodes in an interval of diameter<=.001, centers separated>=2.5, bridge shifts0<=a<=.5. This is a stronger restricted test class than a single three-node cluster. It does not exhaust unrestricted dense configurations. No new diameter enlargement or H4 result is included in this audit.

## Fivefold-width continuation, independently replayed21:12UTC

Also PASS: WIDER_TRIPLE_CLUSTER_THEOREM.md. Independent copy wider_replay.py reproduced upper bounds507.1727576776598877098 and222501.89254327102262 for derivative orders4 and6 on |v|<=.005, using2048 full interval upper-sum cells and the existing campaign theta enclosure, not acquired external code. The whole-theta remainder and parity treatment were reread. The spatial tail remains valid because h±v>=3 and the sum of exponential arguments is at least2exp(2h), while linear prefactors sum to49h independently of v.

The exact2x2 determinant permits confluent margin.0095; the local Taylor perturbation row sum.003375 leaves.006125>.006. Intercluster coupling still has the same epsilon because10(2.495)^2>60. Hence relative norm<1/5000 and full/coordinate-Schur lower margin>599/100000. This applies to clusters of at most3nodes of diameter<=.005, centers>=2.5,0<=a<=.5, arbitrary count and internal collisions. It does not remove occupancy or center-separation restrictions.
