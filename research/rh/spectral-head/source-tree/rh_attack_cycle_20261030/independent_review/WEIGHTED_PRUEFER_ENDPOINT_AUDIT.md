# Independent audit: direct weighted-Pruefer endpoint leakage

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **PASS for the displayed explicit hypotheses and constants.** Producer: `prolate_exterior_phase_attack/WEIGHTED_PRUEFER_LOG_LEAKAGE.md`. The copied exact scalar script passes and produces an identical receipt. No spectral numerical approximation is used.

## Normalization and ODE

The input e is a real even regular prolate mode with full additive L2 norm one. Its Fourier transform f uses exp(2pi ixs); on the interior f=chi e, while Plancherel and parity give exterior half-line norm `(1-|chi|^2)/2`. The far endpoint integration-by-parts amplitude of `sqrt(x^2-lambda^2) f(x)` is exactly `A=e(lambda)/pi`; there is no chi denominator. Fixed-mode endpoint regularity suffices because only the limiting energy, not a uniform asymptotic remainder, is used.

Substituting `f=z/sqrt(P)` in the physical differential equation yields `z''+[k^2-(nu-c^2)/P+lambda^2/P^2]z=0`, with `P=x^2-lambda^2`, `k=2pi lambda`. For `d=|nu-c^2|/(2pi lambda^2)` and `h0=8(1+d)/lambda`, the ray x>=lambda+h0 has `P>=16(1+d)`. The absolute two correction terms imply the stated tighter potential interval `[31/32,33/32]k^2`.

## Deterministic amplitude and oscillation checks

The identities `H'=-Q' z'^2/Q^2` and `(QH)'=Q' z^2` are correct. When Delta<=0 the potential decreases to k^2. When Delta>0 it has at most one minimum; if that minimum is in the retained ray, it also obeys the same positive interval. Integrating toward the far limiting amplitude gives `H>=31A^2/33` in the worst case, hence the deliberately weaker `H>=A^2/2`. No assumption is made on the omitted singular collar.

On `[lambda+h0,2lambda]`, the derivative bound follows directly from
`Q'=2x(Delta P-2lambda^2)/P^3` and `d/(1+d)^2<=1/4`. It is smaller than k/8. The exact phase identity then gives `3k/4<=theta'<=5k/4`.

For decreasing w, after changing variable to theta, the cosine integration-by-parts error is at most w(a). This proves the weighted inequality without theta-double-prime control. With w=1/P, its exact integral is `L/(2lambda)`, where

`L=log[(lambda^2+4(1+d))/(12(1+d))]`.

The phase endpoint error is at most `1/(80pi lambda(1+d))`. Under lambda^2>=16(1+d), L>=log(5/3)>1/2, so
`3L/(20lambda)-1/(80pi lambda(1+d)) >= L/(8lambda)`.
Multiplication by `H>=A^2/2` and comparison with exact leakage gives

`|e(lambda)|^2 <= 8pi^2 lambda (1-|chi|^2)/L`.

For R=lambda^2/(1+d)>=144, `R+4>=12sqrt(R)`, so L>=log(R)/2. This gives the claimed 16pi^2 simplified-log constant. All domain gates and constants are verified for every mode satisfying the hypotheses, not merely asymptotically. No concentration threshold is necessary for this lemma itself.

## Limits

The condition is a bound on actual differential distance d. It is not inferred from a band's cardinality, and it can fail for deep modes. Applying it to a moving selected band requires the separate action-strip argument. The result supplies an endpoint/leakage estimate, not an arithmetic sampling bound, signed edge control, evenized Gram floor, whole-support positivity extension, or RH proof.
