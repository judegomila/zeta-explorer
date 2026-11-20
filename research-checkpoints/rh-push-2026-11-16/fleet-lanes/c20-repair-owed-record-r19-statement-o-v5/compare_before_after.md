# Before / after, entry by entry (c20-repair-owed-record-r19-statement-o-v5)

Engine counts only. A rank is a heuristic, not evidence about zeros of zeta. "Before" is the rerun of `build_graph.py`, `generate.py --top 60` and `scoreboard.py` before any edit of this lane; "after" is the rerun after the map, control, device and campaign edits; "final" is the rerun after this lane's line in `campaign/lanes.jsonl`. `merge_outcomes.py` was not run.

## 1. Summary

| quantity | before | after |
|---|---|---|
| nodes | 1750 | 1756 |
| live | 976 | 977 |
| rows | 251 | 253 |
| edges | 9213 | 9236 |
| devices | {"closed": 71, "floored": 6} | {"closed": 71, "floored": 6} |
| devicesLive | {"closed": 63, "floored": 6} | {"closed": 63, "floored": 6} |
| cells | {"closed": 4, "cell": 6, "tried-not-closed": 1} | {"closed": 4, "cell": 6, "tried-not-closed": 1} |
| generated | 38340 | 38485 |
| scored | 8426 | 8426 |
| topWithOpenDevice | 0 | 0 |
| topWithFlooredDeviceOnly | 60 | 60 |
| topWithClosedDevice | 0 | 0 |
| topWithCell | 1 | 1 |
| topNamingNewControl | 0 | 0 |
| minScore | 0.29 | 0.29 |
| perDeviceNode | {"tro6-natural": 12, "qrh-seven-eighths": 12, "map-open-2": 12, "seven-eighths-abscissa-formula": 12, "map-open-4": 12} | {"tro6-natural": 12, "qrh-seven-eighths": 12, "map-open-2": 12, "seven-eighths-abscissa-formula": 12, "map-open-4": 12} |
| rank 1 | capture-ratio-psd-slope x sympow-conductor-normalised-shift x tro6-natural (10.25) | capture-ratio-psd-slope x sympow-conductor-normalised-shift x tro6-natural (10.25) |

Keys in common: 60 of 60 (60 with the same score, 60 at the same rank). Left: 0. Entered: 0.

## 2. Rejection reasons whose count changed

| reason | before | after |
|---|---|---|
| closed family: fam-one-zero-forces-many | 211 | 226 |
| contains a closed device: euler-fe-phase-at-height | 354 | 368 |
| contains a closed device: mean-value-convexity | 396 | 416 |
| contains a closed device: monotone-flow-functional | 766 | 776 |
| contains a closed device: positive-kernel-transport | 507 | 531 |
| contains a combination closed in outcomes.json | 3806 | 3822 |
| no open or floored crossing device (curated/devices.json) | 14352 | 14397 |
| shares two nodes with a closed lane (nodes or launchedNodes) | 563 | 564 |

## 3. Top 60 before: each entry and what happened to it

| rank | score | move | members | control | device (kind) | after |
|---|---|---|---|---|---|---|
| 1 | 10.25 | M1 | capture-ratio-psd-slope x sympow-conductor-normalised-shift x tro6-natural |  | tro6-natural (floored) | kept: rank 1, score 10.25 |
| 2 | 9.53 | M1 | autocorrelation-moment-ladder x sympow-conductor-normalised-shift x qrh-seven-eighths |  | qrh-seven-eighths (floored) | kept: rank 2, score 9.53 |
| 3 | 9.25 | M1 | sun-prop63-plus4-offset x katz-sarnak-family-checks x tro6-natural |  | tro6-natural (floored) | kept: rank 3, score 9.25 |
| 4 | 9.00 | M1 | theta-density-positivity-p-pos x alias-width-law-octave-weight x tro6-natural |  | tro6-natural (floored) | kept: rank 4, score 9.00 |
| 5 | 8.75 | M1 | gl2-weil-symbol x finite-support-euler-detector x tro6-natural |  | tro6-natural (floored) | kept: rank 5, score 8.75 |
| 6 | 8.75 | M1 | sun-prop63-plus4-offset x mem-sextic-theta-squarefree x qrh-seven-eighths |  | qrh-seven-eighths (floored) | kept: rank 6, score 8.75 |
| 7 | 8.75 | M1 | autocorrelation-moment-ladder x route-m-first-moment-kappa x tro6-natural |  | tro6-natural (floored) | kept: rank 7, score 8.75 |
| 8 | 8.75 | M3 | tro6-natural x gauss-plancherel-alias-lemma x mem-qrh-7-8 |  | tro6-natural (floored) | kept: rank 8, score 8.75 |
| 9 | 8.50 | M4 | theta-density-positivity x staged-strip-triangular-inequality x tro6-natural |  | tro6-natural (floored) | kept: rank 9, score 8.50 |
| 10 | 8.48 | M1 | curvature-charge-d x route-m-vasyunin-gram x tro6-natural |  | tro6-natural (floored) | kept: rank 10, score 8.48 |
| 11 | 8.25 | M1 | capture-ratio-psd-slope x prime-delay-domination-15-4 x qrh-seven-eighths |  | qrh-seven-eighths (floored) | kept: rank 11, score 8.25 |
| 12 | 8.25 | M1 | lean-weil-small-support x star-min-pointwise-prime-bound x qrh-seven-eighths |  | qrh-seven-eighths (floored) | kept: rank 12, score 8.25 |
| 13 | 8.25 | M3 | silent-u6a-rank2-nonborel-metaplectic-eigenobject x qrh-seven-eighths x ramanujan-cube-satake-point |  | qrh-seven-eighths (floored) | kept: rank 13, score 8.25 |
| 14 | 8.00 | M1 | zv-infinity-end-coordinate x ramanujan-cube-satake-point x tro6-natural |  | tro6-natural (floored) | kept: rank 14, score 8.00 |
| 15 | 7.99 | M1 | zv-boundary-kernel-pa x pole-term-schur-complement x tro6-natural |  | tro6-natural (floored) | kept: rank 15, score 7.99 |
| 16 | 7.75 | M1 | subleading-k-closed-form x mem-chi4-signed-ladder x tro6-natural |  | tro6-natural (floored) | kept: rank 16, score 7.75 |
| 17 | 7.75 | M3 | sun-catalan-preprint-verdict x mem-qrh-7-8 x qrh-seven-eighths |  | qrh-seven-eighths (floored) | kept: rank 17, score 7.75 |
| 18 | 7.75 | M4 | start-substitution-lemma x tro6-natural x euler-detection-depth-law |  | tro6-natural (floored) | kept: rank 18, score 7.75 |
| 19 | 7.75 | M4 | zv-signed-shear-w x staged-strip-triangular-inequality x qrh-seven-eighths |  | qrh-seven-eighths (floored) | kept: rank 19, score 7.75 |
| 20 | 7.66 | M2 | phi-truncation-leftmost-zero x qrh-seven-eighths | ctl-DH | qrh-seven-eighths (floored) | kept: rank 20, score 7.66 |
| 21 | 7.25 | M1 | zv-boundary-kernel-pa x restricted-mobius-delay-lift x qrh-seven-eighths |  | qrh-seven-eighths (floored) | kept: rank 21, score 7.25 |
| 22 | 7.25 | M2 | sextic-theta-numerics x qrh-seven-eighths | ctl-DH | qrh-seven-eighths (floored) | kept: rank 22, score 7.25 |
| 23 | 6.75 | M1 | multi-rung-weil-symbol x finite-support-euler-detector x qrh-seven-eighths |  | qrh-seven-eighths (floored) | kept: rank 23, score 6.75 |
| 24 | 6.55 | M1 | virtual-rungs-positive-extension x selberg-geodesic-ground-truth x qrh-seven-eighths |  | qrh-seven-eighths (floored) | kept: rank 24, score 6.55 |
| 25 | 5.75 | M1 | lean-weil-small-support x v7-floor-theorem-c x map-open-2 |  | map-open-2 (floored) | kept: rank 25, score 5.75 |
| 26 | 5.25 | M1 | subleading-k-closed-form x route-m-vasyunin-gram x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | kept: rank 26, score 5.25 |
| 27 | 5.09 | M1 | gl2-weil-symbol x sextic-theta-numerics x map-open-2 |  | map-open-2 (floored) | kept: rank 27, score 5.09 |
| 28 | 5.00 | M1 | multi-rung-weil-symbol x prime-delay-domination x map-open-2 |  | map-open-2 (floored) | kept: rank 28, score 5.00 |
| 29 | 4.81 | M1 | zv-infinity-end-coordinate x star-min-pointwise-prime-bound x map-open-4 |  | map-open-4 (floored) | kept: rank 29, score 4.81 |
| 30 | 4.75 | M4 | dbn-native-triangle-binding x route-m-first-moment-kappa x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | kept: rank 30, score 4.75 |
| 31 | 4.50 | M3 | map-open-2 x frobenius-gcd-factorisation x lane-audit-h-desc |  | map-open-2 (floored) | kept: rank 31, score 4.50 |
| 32 | 4.50 | M3 | near-muntz-threshold-cones x arch-native-prime-jordan-product x map-open-4 |  | map-open-4 (floored) | kept: rank 32, score 4.50 |
| 33 | 4.14 | M4 | theta-density-positivity x katz-sarnak-family-checks x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | kept: rank 33, score 4.14 |
| 34 | 3.85 | M1 | bbm-growth-class-implication x selberg-zeta-freeze-sandbox x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | kept: rank 34, score 3.85 |
| 35 | 3.75 | M4 | zv-signed-shear-w x ns-rigid-loophole-dirichlet-coefficients x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | kept: rank 35, score 3.75 |
| 36 | 3.60 | M1 | ingham-offlattice-riesz-floor x mv-cap-function-side-gap x map-open-2 |  | map-open-2 (floored) | kept: rank 36, score 3.60 |
| 37 | 3.25 | M2 | pr14-boundary-certificate x seven-eighths-abscissa-formula | ctl-DH | seven-eighths-abscissa-formula (floored) | kept: rank 37, score 3.25 |
| 38 | 3.25 | M3 | map-open-2 x rm-kappa-arith-exact x rm-kappa-total-measured |  | map-open-2 (floored) | kept: rank 38, score 3.25 |
| 39 | 3.22 | M4 | tilt-det-majorant x route-i-krein-certificate x map-open-4 |  | map-open-4 (floored) | kept: rank 39, score 3.22 |
| 40 | 3.00 | M1 | ff-lambda-of-elliptic-curve x spec-z-graph-class-pairing x map-open-4 |  | map-open-4 (floored) | kept: rank 40, score 3.00 |
| 41 | 3.00 | M3 | map-open-2 x rm-parity-sign-law x rm-sign-law-t-negative |  | map-open-2 (floored) | kept: rank 41, score 3.00 |
| 42 | 3.00 | M3 | map-open-22 x cm-eta-heights-lambda1 x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | kept: rank 42, score 3.00 |
| 43 | 3.00 | M4 | exact-witness-quadratic-cosine x qtl-weil-delay-form x map-open-4 |  | map-open-4 (floored) | kept: rank 43, score 3.00 |
| 44 | 2.97 | M1 | mem-freeze-flow-interlacing x route-m-kappa-first-moment x map-open-2 |  | map-open-2 (floored) | kept: rank 44, score 2.97 |
| 45 | 2.75 | M1 | debruijn-landing-rate-thm13 x mem-landau-siegel-uniform x map-open-2 |  | map-open-2 (floored) | kept: rank 45, score 2.75 |
| 46 | 2.75 | M1 | ff-lambda-of-elliptic-curve x hasse-weil-checks x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | kept: rank 46, score 2.75 |
| 47 | 2.75 | M4 | collision-ladder-data x route-m-conductor-tones x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | kept: rank 47, score 2.75 |
| 48 | 2.75 | M4 | tilt-det-majorant x rung-toeplitz-euler-detector x map-open-2 |  | map-open-2 (floored) | kept: rank 48, score 2.75 |
| 49 | 2.67 | M4 | confluent-laguerre-floor x pole-term-schur-complement x map-open-4 |  | map-open-4 (floored) | kept: rank 49, score 2.67 |
| 50 | 2.56 | M4 | zv-taylor-rouche-channel-criterion x h6-symbol-offline-poisson x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | kept: rank 50, score 2.56 |
| 51 | 2.50 | M3 | map-open-2 x mem-mollifier-proportion-loophole x ns-rigid-loophole-dirichlet-coefficients |  | map-open-2 (floored) | kept: rank 51, score 2.50 |
| 52 | 2.26 | M1 | route-b-limsup-stieltjes x corr23-continuity-spectral-criterion x map-open-4 |  | map-open-4 (floored) | kept: rank 52, score 2.26 |
| 53 | 2.25 | M3 | map-open-2 x rm-e0-uniform-remainder x binet-positive-kernel |  | map-open-2 (floored) | kept: rank 53, score 2.25 |
| 54 | 2.08 | M4 | lean-cg-covering-identity x weil-small-support-lean x map-open-4 |  | map-open-4 (floored) | kept: rank 54, score 2.08 |
| 55 | 2.00 | M3 | mem-concentration-dip-open x seven-eighths-abscissa-formula x af-hl-star-hierarchy |  | seven-eighths-abscissa-formula (floored) | kept: rank 55, score 2.00 |
| 56 | 2.00 | M4 | frozen-rung-winding-identity x prime-delay-domination x map-open-4 |  | map-open-4 (floored) | kept: rank 56, score 2.00 |
| 57 | 1.29 | M4 | ch-holder-half-sharp x corr23-mixed-prolate-ladder x map-open-4 |  | map-open-4 (floored) | kept: rank 57, score 1.29 |
| 58 | 1.25 | M2 | meansquare-pointwise-wall x seven-eighths-abscissa-formula | ctl-DH | seven-eighths-abscissa-formula (floored) | kept: rank 58, score 1.25 |
| 59 | 0.30 | M4 | zv-polynomial-heat-coefficients x connes-adelic-truncated-trace x map-open-4 |  | map-open-4 (floored) | kept: rank 59, score 0.30 |
| 60 | 0.29 | M4 | zero-ode-ht x mixed-group-rigid-profile x map-open-4 |  | map-open-4 (floored) | kept: rank 60, score 0.29 |

## 4. Top 60 after: each entry and where it came from

| rank | score | move | members | control | device (kind) | before |
|---|---|---|---|---|---|---|
| 1 | 10.25 | M1 | capture-ratio-psd-slope x sympow-conductor-normalised-shift x tro6-natural |  | tro6-natural (floored) | was rank 1, score 10.25 |
| 2 | 9.53 | M1 | autocorrelation-moment-ladder x sympow-conductor-normalised-shift x qrh-seven-eighths |  | qrh-seven-eighths (floored) | was rank 2, score 9.53 |
| 3 | 9.25 | M1 | sun-prop63-plus4-offset x katz-sarnak-family-checks x tro6-natural |  | tro6-natural (floored) | was rank 3, score 9.25 |
| 4 | 9.00 | M1 | theta-density-positivity-p-pos x alias-width-law-octave-weight x tro6-natural |  | tro6-natural (floored) | was rank 4, score 9.00 |
| 5 | 8.75 | M1 | gl2-weil-symbol x finite-support-euler-detector x tro6-natural |  | tro6-natural (floored) | was rank 5, score 8.75 |
| 6 | 8.75 | M1 | sun-prop63-plus4-offset x mem-sextic-theta-squarefree x qrh-seven-eighths |  | qrh-seven-eighths (floored) | was rank 6, score 8.75 |
| 7 | 8.75 | M1 | autocorrelation-moment-ladder x route-m-first-moment-kappa x tro6-natural |  | tro6-natural (floored) | was rank 7, score 8.75 |
| 8 | 8.75 | M3 | tro6-natural x gauss-plancherel-alias-lemma x mem-qrh-7-8 |  | tro6-natural (floored) | was rank 8, score 8.75 |
| 9 | 8.50 | M4 | theta-density-positivity x staged-strip-triangular-inequality x tro6-natural |  | tro6-natural (floored) | was rank 9, score 8.50 |
| 10 | 8.48 | M1 | curvature-charge-d x route-m-vasyunin-gram x tro6-natural |  | tro6-natural (floored) | was rank 10, score 8.48 |
| 11 | 8.25 | M1 | capture-ratio-psd-slope x prime-delay-domination-15-4 x qrh-seven-eighths |  | qrh-seven-eighths (floored) | was rank 11, score 8.25 |
| 12 | 8.25 | M1 | lean-weil-small-support x star-min-pointwise-prime-bound x qrh-seven-eighths |  | qrh-seven-eighths (floored) | was rank 12, score 8.25 |
| 13 | 8.25 | M3 | silent-u6a-rank2-nonborel-metaplectic-eigenobject x qrh-seven-eighths x ramanujan-cube-satake-point |  | qrh-seven-eighths (floored) | was rank 13, score 8.25 |
| 14 | 8.00 | M1 | zv-infinity-end-coordinate x ramanujan-cube-satake-point x tro6-natural |  | tro6-natural (floored) | was rank 14, score 8.00 |
| 15 | 7.99 | M1 | zv-boundary-kernel-pa x pole-term-schur-complement x tro6-natural |  | tro6-natural (floored) | was rank 15, score 7.99 |
| 16 | 7.75 | M1 | subleading-k-closed-form x mem-chi4-signed-ladder x tro6-natural |  | tro6-natural (floored) | was rank 16, score 7.75 |
| 17 | 7.75 | M3 | sun-catalan-preprint-verdict x mem-qrh-7-8 x qrh-seven-eighths |  | qrh-seven-eighths (floored) | was rank 17, score 7.75 |
| 18 | 7.75 | M4 | start-substitution-lemma x tro6-natural x euler-detection-depth-law |  | tro6-natural (floored) | was rank 18, score 7.75 |
| 19 | 7.75 | M4 | zv-signed-shear-w x staged-strip-triangular-inequality x qrh-seven-eighths |  | qrh-seven-eighths (floored) | was rank 19, score 7.75 |
| 20 | 7.66 | M2 | phi-truncation-leftmost-zero x qrh-seven-eighths | ctl-DH | qrh-seven-eighths (floored) | was rank 20, score 7.66 |
| 21 | 7.25 | M1 | zv-boundary-kernel-pa x restricted-mobius-delay-lift x qrh-seven-eighths |  | qrh-seven-eighths (floored) | was rank 21, score 7.25 |
| 22 | 7.25 | M2 | sextic-theta-numerics x qrh-seven-eighths | ctl-DH | qrh-seven-eighths (floored) | was rank 22, score 7.25 |
| 23 | 6.75 | M1 | multi-rung-weil-symbol x finite-support-euler-detector x qrh-seven-eighths |  | qrh-seven-eighths (floored) | was rank 23, score 6.75 |
| 24 | 6.55 | M1 | virtual-rungs-positive-extension x selberg-geodesic-ground-truth x qrh-seven-eighths |  | qrh-seven-eighths (floored) | was rank 24, score 6.55 |
| 25 | 5.75 | M1 | lean-weil-small-support x v7-floor-theorem-c x map-open-2 |  | map-open-2 (floored) | was rank 25, score 5.75 |
| 26 | 5.25 | M1 | subleading-k-closed-form x route-m-vasyunin-gram x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | was rank 26, score 5.25 |
| 27 | 5.09 | M1 | gl2-weil-symbol x sextic-theta-numerics x map-open-2 |  | map-open-2 (floored) | was rank 27, score 5.09 |
| 28 | 5.00 | M1 | multi-rung-weil-symbol x prime-delay-domination x map-open-2 |  | map-open-2 (floored) | was rank 28, score 5.00 |
| 29 | 4.81 | M1 | zv-infinity-end-coordinate x star-min-pointwise-prime-bound x map-open-4 |  | map-open-4 (floored) | was rank 29, score 4.81 |
| 30 | 4.75 | M4 | dbn-native-triangle-binding x route-m-first-moment-kappa x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | was rank 30, score 4.75 |
| 31 | 4.50 | M3 | map-open-2 x frobenius-gcd-factorisation x lane-audit-h-desc |  | map-open-2 (floored) | was rank 31, score 4.50 |
| 32 | 4.50 | M3 | near-muntz-threshold-cones x arch-native-prime-jordan-product x map-open-4 |  | map-open-4 (floored) | was rank 32, score 4.50 |
| 33 | 4.14 | M4 | theta-density-positivity x katz-sarnak-family-checks x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | was rank 33, score 4.14 |
| 34 | 3.85 | M1 | bbm-growth-class-implication x selberg-zeta-freeze-sandbox x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | was rank 34, score 3.85 |
| 35 | 3.75 | M4 | zv-signed-shear-w x ns-rigid-loophole-dirichlet-coefficients x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | was rank 35, score 3.75 |
| 36 | 3.60 | M1 | ingham-offlattice-riesz-floor x mv-cap-function-side-gap x map-open-2 |  | map-open-2 (floored) | was rank 36, score 3.60 |
| 37 | 3.25 | M2 | pr14-boundary-certificate x seven-eighths-abscissa-formula | ctl-DH | seven-eighths-abscissa-formula (floored) | was rank 37, score 3.25 |
| 38 | 3.25 | M3 | map-open-2 x rm-kappa-arith-exact x rm-kappa-total-measured |  | map-open-2 (floored) | was rank 38, score 3.25 |
| 39 | 3.22 | M4 | tilt-det-majorant x route-i-krein-certificate x map-open-4 |  | map-open-4 (floored) | was rank 39, score 3.22 |
| 40 | 3.00 | M1 | ff-lambda-of-elliptic-curve x spec-z-graph-class-pairing x map-open-4 |  | map-open-4 (floored) | was rank 40, score 3.00 |
| 41 | 3.00 | M3 | map-open-2 x rm-parity-sign-law x rm-sign-law-t-negative |  | map-open-2 (floored) | was rank 41, score 3.00 |
| 42 | 3.00 | M3 | map-open-22 x cm-eta-heights-lambda1 x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | was rank 42, score 3.00 |
| 43 | 3.00 | M4 | exact-witness-quadratic-cosine x qtl-weil-delay-form x map-open-4 |  | map-open-4 (floored) | was rank 43, score 3.00 |
| 44 | 2.97 | M1 | mem-freeze-flow-interlacing x route-m-kappa-first-moment x map-open-2 |  | map-open-2 (floored) | was rank 44, score 2.97 |
| 45 | 2.75 | M1 | debruijn-landing-rate-thm13 x mem-landau-siegel-uniform x map-open-2 |  | map-open-2 (floored) | was rank 45, score 2.75 |
| 46 | 2.75 | M1 | ff-lambda-of-elliptic-curve x hasse-weil-checks x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | was rank 46, score 2.75 |
| 47 | 2.75 | M4 | collision-ladder-data x route-m-conductor-tones x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | was rank 47, score 2.75 |
| 48 | 2.75 | M4 | tilt-det-majorant x rung-toeplitz-euler-detector x map-open-2 |  | map-open-2 (floored) | was rank 48, score 2.75 |
| 49 | 2.67 | M4 | confluent-laguerre-floor x pole-term-schur-complement x map-open-4 |  | map-open-4 (floored) | was rank 49, score 2.67 |
| 50 | 2.56 | M4 | zv-taylor-rouche-channel-criterion x h6-symbol-offline-poisson x seven-eighths-abscissa-formula |  | seven-eighths-abscissa-formula (floored) | was rank 50, score 2.56 |
| 51 | 2.50 | M3 | map-open-2 x mem-mollifier-proportion-loophole x ns-rigid-loophole-dirichlet-coefficients |  | map-open-2 (floored) | was rank 51, score 2.50 |
| 52 | 2.26 | M1 | route-b-limsup-stieltjes x corr23-continuity-spectral-criterion x map-open-4 |  | map-open-4 (floored) | was rank 52, score 2.26 |
| 53 | 2.25 | M3 | map-open-2 x rm-e0-uniform-remainder x binet-positive-kernel |  | map-open-2 (floored) | was rank 53, score 2.25 |
| 54 | 2.08 | M4 | lean-cg-covering-identity x weil-small-support-lean x map-open-4 |  | map-open-4 (floored) | was rank 54, score 2.08 |
| 55 | 2.00 | M3 | mem-concentration-dip-open x seven-eighths-abscissa-formula x af-hl-star-hierarchy |  | seven-eighths-abscissa-formula (floored) | was rank 55, score 2.00 |
| 56 | 2.00 | M4 | frozen-rung-winding-identity x prime-delay-domination x map-open-4 |  | map-open-4 (floored) | was rank 56, score 2.00 |
| 57 | 1.29 | M4 | ch-holder-half-sharp x corr23-mixed-prolate-ladder x map-open-4 |  | map-open-4 (floored) | was rank 57, score 1.29 |
| 58 | 1.25 | M2 | meansquare-pointwise-wall x seven-eighths-abscissa-formula | ctl-DH | seven-eighths-abscissa-formula (floored) | was rank 58, score 1.25 |
| 59 | 0.30 | M4 | zv-polynomial-heat-coefficients x connes-adelic-truncated-trace x map-open-4 |  | map-open-4 (floored) | was rank 59, score 0.30 |
| 60 | 0.29 | M4 | zero-ode-ht x mixed-group-rigid-profile x map-open-4 |  | map-open-4 (floored) | was rank 60, score 0.29 |

## 5. Scoreboard, every entry

`before` = rerun before any edit; `after` = rerun after the edits (before this lane's line in `lanes.jsonl`); `final` = rerun after the line was appended. The file as found when the lane started had been written before the graph was last rebuilt (nodes 1,746, families 126,756); it was overwritten by the first rerun and its values are quoted in RESULT.md from the text of `SCOREBOARD.md` as read.

| entry | before (rerun) | after | final | changed by the edits | changed by the lane line |
|---|---|---|---|---|---|
| A_requirements.calibration | [{"counted": true, "name": "7/8 zero-free half-plane (Lean-checked)", "note": "known ar... | [{"counted": true, "name": "7/8 zero-free half-plane (Lean-checked)", "note": "known ar... | [{"counted": true, "name": "7/8 zero-free half-plane (Lean-checked)", "note": "known ar... |  |  |
| A_requirements.headline.bestScore | 1 | 1 | 1 |  |  |
| A_requirements.headline.file | tmp/research-2026-11-16/push/c1-leeyang... | tmp/research-2026-11-16/push/c1-leeyang... | tmp/research-2026-11-16/push/c1-leeyang... |  |  |
| A_requirements.headline.missing | ["R2", "R3", "R4"] | ["R2", "R3", "R4"] | ["R2", "R3", "R4"] |  |  |
| A_requirements.headline.slug | c1-leeyang-krein-limit | c1-leeyang-krein-limit | c1-leeyang-krein-limit |  |  |
| A_requirements.lanesWithR4Confirmed | [] | [] | [] |  |  |
| A_requirements.scoreHistogram.0 | 170 | 170 | 171 |  | yes |
| A_requirements.scoreHistogram.1 | 2 | 2 | 2 |  |  |
| A_requirements.scoreHistogram.2 | 0 | 0 | 0 |  |  |
| A_requirements.scoreHistogram.3 | 0 | 0 | 0 |  |  |
| A_requirements.scoreHistogram.4 | 0 | 0 | 0 |  |  |
| B_frontier.lambda.accepted | 0.2 (Platt-Trudgian) | 0.2 (Platt-Trudgian) | 0.2 (Platt-Trudgian) |  |  |
| B_frontier.lambda.conditional | 0.116060 | 0.116060 | 0.116060 |  |  |
| B_frontier.lambda.conditionalDependsOn | abscissa 0.87488665 (unrefereed) plus Raymond chain H2-H4 (tables not verified) | abscissa 0.87488665 (unrefereed) plus Raymond chain H2-H4 (tables not verified) | abscissa 0.87488665 (unrefereed) plus Raymond chain H2-H4 (tables not verified) |  |  |
| B_frontier.lambda.raymondClaim | 0.107964910079 | 0.107964910079 | 0.107964910079 |  |  |
| B_frontier.lambda.raymondStatus | from VERIFICATION_REPORT.md: Status: **replayed and partially refereed.** Not "verified". | from VERIFICATION_REPORT.md: Status: **replayed and partially refereed.** Not "verified". | from VERIFICATION_REPORT.md: Status: **replayed and partially refereed.** Not "verified". |  |  |
| B_frontier.zeroFree.claimed | 0.874886647 | 0.874886647 | 0.874886647 |  |  |
| B_frontier.zeroFree.claimedDependsOn | preprints Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835; manuscript Lemmas 14.3, 1... | preprints Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835; manuscript Lemmas 14.3, 1... | preprints Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835; manuscript Lemmas 14.3, 1... |  |  |
| B_frontier.zeroFree.leanChecked | 7/8 = 0.875 | 7/8 = 0.875 | 7/8 = 0.875 |  |  |
| C_coverage.families | 139128 | 139128 | 139128 |  |  |
| C_coverage.familiesClosed | 4110 | 4110 | 4110 |  |  |
| C_coverage.familiesOpenUntried | 133666 | 133666 | 133666 |  |  |
| C_coverage.familiesTriedNotClosed | 1352 | 1352 | 1352 |  |  |
| C_coverage.graphSource | IDEA_GRAPH.json | IDEA_GRAPH.json | IDEA_GRAPH.json |  |  |
| C_coverage.nodes | 1750 | 1756 | 1756 | yes |  |
| C_coverage.nodesMarkedClosed | 609 | 611 | 611 | yes |  |
| C_coverage.openLemmasDecided | 140 | 140 | 140 |  |  |
| C_coverage.outcomeFilesUnparsed | 0 | 0 | 0 |  |  |
| C_coverage.outcomeRecords | 212 | 212 | 212 |  |  |
| C_coverage.tags | 528 | 528 | 528 |  |  |
| D_reliability.aboutZerosClaimsNotYetCounted | [] | [] | [] |  |  |
| D_reliability.laneLinesUnparsed | 0 | 0 | 0 |  |  |
| D_reliability.lanesRefereed | 162 | 162 | 163 |  | yes |
| D_reliability.lanesRun | 172 | 172 | 173 |  | yes |
| D_reliability.provedClaimsBroken | 15 | 15 | 15 |  |  |
| D_reliability.refereeHoldRate | 0.914 | 0.914 | 0.914 |  |  |
| D_reliability.threeRefereeStatements | 2 | 2 | 2 |  |  |
| D_reliability.threeRefereeStatementsAboutZeros | 0 | 0 | 0 |  |  |
| generated | 2026-11-20T08:25Z | 2026-11-20T08:41Z | 2026-11-20T09:03Z | yes | yes |
| history | [{"bestScore": 1, "bestSlug": "c1-leeyang-krein-limit", "holdRate": 0.833, "lanesCumula... | [{"bestScore": 1, "bestSlug": "c1-leeyang-krein-limit", "holdRate": 0.833, "lanesCumula... | [{"bestScore": 1, "bestSlug": "c1-leeyang-krein-limit", "holdRate": 0.833, "lanesCumula... |  | yes |

## 6. `engine/curated/devices.json`, every device type and cell

| list | id | state before | state after | change |
|---|---|---|---|---|
| devices | bilinear-reciprocity-height-jform | closed | closed | unchanged |
| devices | bost-connes-crossed-product-positivity | closed | closed | unchanged |
| devices | catalogued-x2-inequality-torus-parameter-eigenobject | closed | closed | unchanged |
| devices | coherent-set-large-sieve | floored | floored | unchanged |
| devices | de-branges-positivity-family | closed | closed | unchanged |
| devices | depth-aspect-height-transfer | closed | closed | unchanged |
| devices | dictionary-d-kernel-sign-functionals | closed | closed | unchanged |
| devices | dictionary-dj-joint-pair-sign-functionals | closed | closed | unchanged |
| devices | dictionary-dn-nonhomogeneous-pair-triple-sign-functionals | closed | closed | unchanged |
| devices | dual-measure-compactness | closed | closed | unchanged |
| devices | edrei-thoma-local-total-positivity | closed | closed | unchanged |
| devices | effective-order-two | closed | closed | unchanged |
| devices | euler-fe-phase-at-height | closed | closed | unchanged |
| devices | exact-relation-rigidity | closed | closed | closedOn edited |
| devices | exact-uniqueness | closed | closed | unchanged |
| devices | fejer-section-prime-chain-growing-p | closed | closed | unchanged |
| devices | finite-support-positivity | closed | closed | unchanged |
| devices | fourier-interpolation-zero-nodes | closed | closed | unchanged |
| devices | frequency-only | closed | closed | unchanged |
| devices | function-field-order2-vertex | closed | closed | unchanged |
| devices | geometric-positivity | closed | closed | unchanged |
| devices | hecke-compression-lax-phillips | closed | closed | unchanged |
| devices | hecke-correspondence-recurrence | closed | closed | unchanged |
| devices | helson-discrepancy | closed | closed | unchanged |
| devices | joint-pair-ratio-crossgram-twist-transfer | closed | closed | unchanged |
| devices | kacmoody-loop-eisenstein-maass-selberg | closed | closed | unchanged |
| devices | landau-siegel-mechanism | closed | closed | unchanged |
| devices | laurent-shell-gamma-section | closed | closed | unchanged |
| devices | laxphillips-hecke-norm-outside-l2 | closed | closed | unchanged |
| devices | lrs-amplification-eisenstein-at-zero | closed | closed | unchanged |
| devices | lrs-count-rank-one-eigenobject-at-zero-theta-orthogonal | closed | closed | unchanged |
| devices | maximum-principle | closed | closed | unchanged |
| devices | mean-value-convexity | closed | closed | unchanged |
| devices | monotone-flow-functional | closed | closed | unchanged |
| devices | nonprincipal-row-cancellation | closed | closed | unchanged |
| devices | padic-special-values | closed | closed | unchanged |
| devices | positive-kernel-transport | closed | closed | unchanged |
| devices | positive-term-sum-rule | closed | closed | unchanged |
| devices | quadratic-positivity-companions | closed | closed | unchanged |
| devices | recurrence-ergodicity | closed | closed | unchanged |
| devices | regular-rep-matrix-bridge | closed | closed | unchanged |
| devices | residue-explicit-formula | closed | closed | unchanged |
| devices | section-extraction | closed | closed | unchanged |
| devices | selberg-operator | closed | closed | unchanged |
| devices | single-row-bridge | closed | closed | unchanged |
| devices | stage-limit | closed | closed | unchanged |
| devices | strip-dtn-identity | closed | closed | unchanged |
| devices | sum-product-vinogradov | closed | closed | unchanged |
| devices | tensor-squeeze | closed | closed | unchanged |
| devices | test-restriction-commutator | closed | closed | unchanged |
| devices | twist-modulus-reciprocity | closed | closed | unchanged |
| devices | twisted-discrepancy | closed | closed | unchanged |
| devices | tz-one-sided-completion-bound-band | closed | closed | closedOn edited; evidence edited (+1648 chars); name edited (+48 chars); status edited (+67 chars) |
| devices | vector-specific-row-mean-square | closed | closed | unchanged |
| devices | window-fe-rigidity-growing-count-one-span | closed | closed | unchanged |
| devices | x04-oval-hecke-fricke-loading | closed | closed | unchanged |
| cells | silent-cell-u2-pos | closed | closed | unchanged |
| cells | silent-cell-u3 | closed | closed | unchanged |
| cells | silent-cell-u4 | cell | cell | evidence edited (+1060 chars) |
| cells | silent-cell-u6a | cell | cell | unchanged |
| cells | silent-cell-u6b | cell | cell | unchanged |
| cells | silent-cell-u6c | cell | cell | evidence edited (+773 chars) |
| cells | silent-cell-u6d | cell | cell | unchanged |
| cells | silent-cell-u6e | closed | closed | unchanged |
| cells | silent-cell-u6f | closed | closed | unchanged |
| cells | silent-cell-u6g | tried-not-closed | tried-not-closed | evidence edited (+456 chars) |
| cells | silent-cell-u8 | cell | cell | unchanged |

Pending entries (lane, state before, state after, text): c16-amplifier-below-truncation-eisw-compute: tried-not-closed -> tried-not-closed, unchanged; c17-rank2-gram-symmetric-blaschke-closure: tried-not-closed -> tried-not-closed, unchanged; c17-window-information-law-ctheta-u5: open -> open, name edited; c6-quadratic-companion-positivity: open -> open, unchanged; c6-unreflected-marks-kd23: open -> open, unchanged; None: open -> open, unchanged

Device types by state: before {'closed': 55, 'floored': 1}, after {'closed': 55, 'floored': 1}. Cells by state: before {'closed': 4, 'cell': 6, 'tried-not-closed': 1}, after {'closed': 4, 'cell': 6, 'tried-not-closed': 1}.

## 7. `engine/curated/controls.json`, every control code

| code | before | after | change |
|---|---|---|---|
| BLS | present | present | unchanged |
| DEL | present | present | unchanged |
| EISW | present | present | unchanged |
| HQ2 | - | present | added |
| HQ3 | - | present | added |
| HQ4 | - | present | added |
| NR-q | present | present | unchanged |
| NR-vec | present | present | unchanged |
| SG | present | present | unchanged |
| UNIV | present | present | unchanged |
| ZQ | present | present | unchanged |

## 8. `campaign/lanes.jsonl`, every line that differs (172 lines before, 173 final)

| line | slug | fields that differ |
|---|---|---|
| 167 | c19-u4-joint-prime-phase-quadratic-dp-zeros | claim |
| 173 | c20-repair-owed-record-r19-statement-o-v5 | line added |
