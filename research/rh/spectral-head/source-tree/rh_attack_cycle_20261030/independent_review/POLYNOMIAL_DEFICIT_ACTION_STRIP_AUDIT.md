# Independent audit: polynomial-deficit action strip and deep moment

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **PASS for producer sections 1--4; section 5 is conditional as written.** Producer: `repo_leverage/POLYNOMIAL_DEFICIT_ACTION_STRIP.md`, final SHA 0f866fc257fc82240fe342d643bce369b9f625f06f987b8d3523ca4e83d6d20c.

Use c=2pi lambda^2, full concentration deficits delta_n=1-|chi_n|^2, and physical differential eigenvalues nu_n. These are distinct from the differential distance d used by the endpoint lemma.

1. The exact extended Bonami--Karoui action is differentiated with its moving zero-integrand endpoint. Substitution x=(sqrt(v)/c)sin(theta) yields `J_v=K(sqrt(v)/c)/(pi c)` for 0<v<c^2. Their Eq23 implies `K(s)>=(1/2)log(1/(1-s))`. The primary source was freshly inspected. The existing independently checked strict action/reference bounds are used only in their stated n>=2 range.

2. KRD Corollary3 gives `S-n<=8+beta log(10/delta_n)` on its leading-side range; outside that range S-n<1, so the inequality is automatic. Fixed n=0,1 have exponentially small deficits in c/log(c) by that same bound and are eventually outside every fixed polynomial-deficit window. No fixed-label asymptotic is used for moving labels.

3. For every fixed A, delta_n>=lambda^(-A) puts all subcritical modes in one common strip `c^2-O_A(c log^2 c)<=nu_n<c^2`. In that strip, eventually `1-sqrt(v)/c<=c^(-1/2)`, uniformly in v. Therefore `J_v>=log(c)/(4pi c)`. Integrating the logarithmically singular derivative up to c^2 is legitimate by monotone passage from below.

4. With beta<=log c and 8/log c<=log(10/delta_n) eventually, integration gives `|nu_n-c^2|<8pi c log(10/delta_n)<32 c log(10/delta_n)`. The separately audited uniform eventual supercritical width 3c/2 also satisfies this bound. The same-phase reference has `|nu_r-c^2|<10c`, absorbed by `8c log(10/delta_n)`, giving constant40. Constants32/40 are independent of A; the common onset is not.

5. Layer cake is applied to a finite set of labels delta_n<=a, not to all deficits tending to one. For almost every t in (0,a), the corresponding concentrations lie in the open transition interval (t,1-t). KRD's cumulative count bounds this by `beta log[5/(t(1-t))]+7`. Integration gives exactly
`sum_(delta_n<=a) delta_n <= a{beta[log(5/(a(1-a)))+1]+7}`.
Endpoint coincidences are null in t. This is valid at a=lambda^(-8) and controls arbitrarily deep labels without a fixed-ratio asymptotic.

## Combined endpoint-row consequence

The separately accepted weighted-Pruefer lemma now supplies the conditional endpoint input in producer section5. For delta_n>=lambda^(-8), the action strip gives differential distance O(log c), so `log(lambda^2/(1+d))` is uniformly comparable to log c eventually. Thus `e_n(lambda)^2<=C lambda delta_n/log c` on this portion. Combining constant40 with the accepted all-depth moment `sum delta_n log^2(10/delta_n)=O(log c)` gives a row bound `C lambda c^2`.

For delta_n<=lambda^(-8), the already audited global bound `e_n(lambda)^2<=256pi^2 lambda delta_n`, the eventual full spectral width at most2c^2, and the deep moment give `O(lambda log^2 c)=o(lambda c^2)`. Consequently the combined full threshold endpoint spectral row is **O(lambda c^2)**, with a support-uniform but unevaluated constant and eventual onset.

This is an additive-coefficient row, not a deficit-whitened bound. The later divided-difference/sampler transfer needs its own exact formulas; no signed arithmetic cancellation, derivative/translation-modulus control, whole-head Gram or Weil lower bound is inferred here.

Primary sources freshly inspected: [Bonami--Karoui](https://arxiv.org/html/1405.3676v2), Theorem1 and Eq23, and [Karnik--Romberg--Davenport](https://arxiv.org/html/2006.00427), Theorem3 and Corollary3. The strip sharpening and its combined row consequence are local deductions, not results attributed verbatim to those papers.
