# Independent audit: uniform collar tail and actual single-channel transfer

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **PASS (analytic audit, no numerical experiment).**

Producer: `../repo_leverage/UNIFORM_COLLAR_TAIL_AND_SINGLE_CHANNEL_TRANSFER.md`, SHA256 `ec540fc47064e87fbcc7beed595321d08c8b65758b14bc70e5249cd2a2139f14`.

The reviewer independently checked the complete argument and its exact physical normalization. This receipt does not modify the historical ideal-model note or infer a global Weil floor.

## Checks

1. Substitution x_physical=lambda*x and t=lambda+tau/lambda cancels the source-channel factors lambda^(-1/2) and sqrt(lambda). The modal coefficient is exactly the inner product with M_c F_(W,omega); no further chi, lambda or parity factor is permitted.
2. The selected positive head satisfies P_head<=4K_c, and after demodulation M_c* K_c M_c is the compression of the negative band [-c/pi,0] in cycle-frequency convention. It is bounded above by the negative Hardy compression A.
3. The zero-extension negative-frequency tail is the exact sinc integral in (4). Both endpoints in (5) contribute. Splitting the sine gives 1/[pi^2(1-omega^2)(W+v)], hence 4/[3pi^2(W+v)] for |omega|<=1/2. Integration in v, the factor4 from P_head<=4K_c, and the xi interval of length2 give exactly C_tail^2=128/(9pi^4).
4. The subcritical Sonin identity has derivative -[P'/P+D'/D](P/D)H'^2, D=k^2t^2-nu. It is nonpositive for nu<c^2. Its regular endpoint limit is H(lambda)^2; at equality the coefficient is1/k^2 and the endpoint derivative is zero. Thus the deep-negative normalized profile is bounded by1, not merely on a fixed compact tau interval.
5. The regular scaled divergence equation gives compact-delta, compact-tau convergence by a bounded Volterra averaging kernel and Gronwall. The admitted endpoint-flow measure, its tightness, the exact eventual upper differential bound, and the preceding Sonin bound justify the fixed-W limit, with uniformity in omega supplied by a common Lipschitz bound. No derivative of a counting asymptotic occurs.
6. Passing the same W,V tail bound to the fixed-collar ideal limits is legitimate. The resulting Hilbert--Schmidt Cauchy limit agrees with the explicit Abel kernel: the Abel average converges in HS norm, and a subsequence converges almost everywhere. Each fixed-delta damped kernel is the exact Laplace transform. This avoids exchanging an uncontrolled undamped improper integral with the spectral sum.
7. The sequential quantifiers in section5 are correct: fix W0, use the support-uniform tail bound, take lambda to infinity, then W0 to infinity. No rate in the weak endpoint limit is required, and all j>=2 are controlled simultaneously through omega in[-1/2,1/2]. Thus the diagonal HS limsup applies to any W_lambda tending to infinity.
8. The actual collective-channel estimate was independently recomputed from Parseval: row norm<=sqrt2 W, row derivative<=sqrt2*pi*W^2/j, two endpoint outer products total4W^2, integrated derivative4pi*W^3(1/j+1/l). Dividing by2pi*lambda^2|1/j-1/l| yields the frozen Bessel producer's exact cross bound. Block Schur gives the stated o(1) for W=log^6 and J=O(log^8).
9. The actual arithmetic pairing has full-even factor2 and test inverse-chi norm factor2. These give factor4, not2 or8, in the final low-label bound. The moving cutoff is inactive only on the explicitly retained low labels and original collar.

## Accepted conclusion and boundaries

The actual finite-collar selected-head channels satisfy the producer's uniform diagonal limsup, and its actual low-label bilinear budget is at most

    4 sqrt(H^2 [zeta(2)-1])+o(1),
    H^2=(log4-3/4)log3/(4pi^2).

This is an actual operator bound, not a floating diagnostic or a formal Coulomb-model prediction. It applies to the literal previously identified trace-null arithmetic collar when combined with the exact dictionary; it does not delete the source-origin or source-endpoint repair directions. It is a coordinate inverse-evenization estimate, not a Weil-energy/complement bound.

A separate simplification is available: fixed-W convergence can instead be derived from the broad weak-head-projector limit and the explicit Hardy compression. That alternative is not required for the present audit and has its own review chain.

The review uses the already separately accepted strong endpoint measure and earlier analytic inputs. It does not assert independent discovery of those inputs or independence from this reviewer's earlier collar-localization work.
