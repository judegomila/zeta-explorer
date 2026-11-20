# Integrated signed compensation: analytic review

Analytic checks completed 2026-11-03; independent 16000-cell replay pending below. Inputs are the auditor's independently generated compact core1000 moments and finite-width endpoint-gain crosscheck. The owned implementation and dependencies are copied into this folder. No acquired code is executed.

For a cell of width w, a scalar density enclosure [qlo,qhi] implies every partial increment lies in [w min(0,qlo),w max(0,qhi)]. This assertion requires no positivity of local moment matrices. The interval implementation retains roundoff in both endpoints and radius. Adding that hull to the previously enclosed left-endpoint moments covers every actual core moment on the cell. Interval LDL positivity therefore verifies the full path and permits the actual inverse-selected polynomial coefficients throughout, not merely at sampled midpoints.

Endpoint propagation uses the audited complete-theta midpoint rule with w^3 sup|density''|/24. Bulk integration instead evaluates the complete density and coefficient enclosure on the entire cell and multiplies by width, a rectangle inclusion with no missing sampling error. It includes the full-line factor 2 and all arithmetic orbits via the reviewed derivative16 bounds; the spatial interval is finite and needs no infinity truncation. Only old/cross moments feed each optimizer. The shared M6 array entry serves odd7's cross column and is not used as even6's target norm.

The chain rule gives actual gain=B+M+DeltaPhi for the moving optimizer. Endpoint Phi is evaluated from actual old/cross inverses and full-theta jets. B is freshly quadrature-enclosed. M and B+M are then INFERRED using the prior certified gain. This is rigorous for mechanism/sign testing but cannot independently establish the same gain or target positivity. Replacing that dependency by a fresh lower bound remains an open task.

The global path positivity asserted by this packet concerns the actual old core matrices only. No positivity of local target or shell matrices is assumed, and no pointwise bulk or mixed-term sign is discarded.

Independent 16000-cell, 192-bit replay completed PASS. Every path-old LDL pivot stayed positive (minimum third pivots >314.81 even6 and >2133.29 odd7). Result.json matches the stated conservative enclosures:
- Odd7 fresh bulk between -200,964,962,250 and -51,057,351,625; inferred mixed between 87,271,253,451 and 237,617,777,868. Moving endpoint flux is negative, between about -32.547 and -32.141 billion.
- Even6 fresh bulk between 620,648,881 and 900,580,612; inferred mixed between -378,140,802 and -98,087,665. Moving endpoint flux is negative, between about -475.202 and -475.149 million.

These establish opposite whole-recovery-interval sign patterns at the two known finite rungs. Whole-interval integration does not restore positivity of each component separately. The correlated total remains positive by the explicitly reused earlier gain certificate, not by a new independent lower estimate. No all-degree/global/all-shift result or new rung is established. Earlier wide direct-mixed enclosures remain inconclusive diagnostics, not successful proofs or negative mathematical counterexamples.
