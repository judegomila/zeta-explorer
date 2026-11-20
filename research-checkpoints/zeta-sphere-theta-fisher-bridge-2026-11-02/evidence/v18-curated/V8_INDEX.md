# Sphere campaign v8, 2 November 2026

All 233 v7 payload files remain byte-for-byte unchanged at their original paths. Prior root index files intentionally remain unchanged. The v7 manifests are retained under provenance/v7. Durable baseline v7: libfile_b88669905efc81918e227ef5877bbeb2.

## New independently reviewed advances
- h4_attack_v1/H4_PROOF.md: H4 is positive definite for every a>0 via complete-theta pointwise Bell-fiber positivity. Compact interval replay and analytic half-line verified.
- h4_attack_v1/pointwise_h5_obstruction.json: the original odd H5 fiber is indefinite near h=0. This is a real limitation of the pointwise strategy, not an integrated negative witness or an RH counterexample.
- integrated_h5_v1/INTEGRATED_H5_PROOF.md: direct integrated odd H5 positivity uniformly for 0<=a<=.5, validated over 12 closed shift bins. Reported LDL pivots are not eigenvalue bounds.
- integrated_h5_v1/SPATIAL_TAIL_PROPAGATION.md and h5_tail_v1/POINTWISE_TAIL_PROOF.md: cumulative spatial-tail matrices are positive for every cutoff. Low-core interval integration and outer-fiber positivity were independently replayed. Matrix integration by parts extends odd H5 positivity to every a>0 and establishes normalized-shift Loewner monotonicity. Combined with H4, this gives full H5 for every positive shift. This uses actual integration to overcome the locally negative core.
- cluster_extension_v2/reviewed/FOUR_NODE_CLUSTER_THEOREM.md: arbitrarily many clusters containing at most 4 nodes, diameter<=.001, centers separated by at least 3, and 0<=a<=.5. Relative coupling is below 1e-7; normalized-channel coercivity exceeds .002599. This raises occupancy but uses narrower clusters and wider separation than the v7 triple case.
- Independent audits and separate replay outputs are in post_v7_audit/.

No H6, arbitrary-order positivity, unrestricted geometry, global Schur closure or RH proof is claimed. Ongoing unreviewed H6 and all-order threshold work is excluded. Neither pointwise H5 failure nor alternative Sobolev local negativity contradicts the integrated H5 theorem.
