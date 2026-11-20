# Four-node cluster extension independent audit

2 November2026. Mathematical derivation reviewed; final numerical replay status below. This is separate from immutable v7.

Reviewed cluster_extension_v2/FOUR_NODE_CLUSTER_THEOREM.md, certify_four_channels.py, check_four_constants.py, and their shared prior campaign interval-theta dependency. No downloaded external code executed.

## Scope and dependencies

At most4nodes per cluster, diameter<=.001, center separation>=3, arbitrary finite/countable cluster count and internal collisions. Uniform shift0<=a<=.5 only. This is not a monotone improvement in every parameter over triple clusters: occupancy rises3to4 but width shrinks.005to.001 and center separation rises2.5to3.

The quantitative local proof integrates the actual full-theta sixth derivative and combines it with previously certified orders0,2,4. It does not merely assume that the all-positive-shift H3 determinant result supplies a uniform eigenvalue margin. Positivity of the6th moment has to be quantitatively bounded, which the new interval integration does.

## Integration and tails

The fourth-h-derivative Simpson error expression is the exact Leibniz expansion using theta derivatives through10. Uniform bridge-weight derivative bounds arise from w_a=2h² integral_0^1 cosh(2ahs)ds and are valid includinga0. Interval values at Simpson endpoints enclose the same fixed-a integrand for everya in the stated interval; dependence between nodes can be discarded safely for an enclosure. The sum of all interval remainder bounds, rather than observed convergence, controls error.

The derivative upper sums simultaneously enclose all|v|<=.001; these are upper Riemann sums over entire cells, not samples. The imported full-theta derivative tail through10 and spatial tail are identical in scope to the previously reviewed confluent certificate. The shifted arguments acrosszero use true full-profile parity. The specified spatial allowance is larger than the proven tail.

## Algebraic and operator checks

The even confluent2x2block retains prior.0095margin. For the odd block, subtracting.004I leaves positive diagonals and exact positive determinant; this requires the upperK4bound as retained by the author. The resulting4x4margin is.004. The Taylor perturbation matrix in factorial-scaled Newton coordinates correctly uses derivatives through8 for even entries and through6 for odd entries; its maximal row sum.00135605 leaves.00264395>.0026.

The global polynomial derivative majorants through6 are below1e13 exp(-5u²). The bridge product derivatives are then bounded by1e27 exp(-10v²). Cross-block norms incur factor4, and both directions give8e27 sum exp(-87n²). The geometric bound withq=20^-29 gives relative cost<1e-7 and full lower margin>.002599. Uniform upper/lower block bounds and summable symmetric off-block norms justify bounded countable operators, bounded inverses, coordinate Schur complements and confluent limits. No minimum internal separation is used.

## Replay outcome21:15UTC

PASS. Independent four_channel_replay.py reproduced K6 interval[-49461.7414191524880427454240577,-47029.6321472413675331230776273] and derivative envelopes308.0531278862724787,100324.7228347595255,61972109.2585965122. The exact constants script passed with relative coupling5.73121584378756e-8<1e-7. No scope discrepancy or mathematical error found.
