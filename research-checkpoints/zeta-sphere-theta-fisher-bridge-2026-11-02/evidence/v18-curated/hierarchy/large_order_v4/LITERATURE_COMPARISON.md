# Primary-literature comparison; no novelty claim

Checked 2026-11-02. This is a targeted comparison, not an exhaustive priority review.

- Griffin, Ono, Rolen and Zagier, *Jensen polynomials for the Riemann zeta function and other sequences* ([arXiv:1902.07321](https://arxiv.org/abs/1902.07321)), develops Hermite-model asymptotics in the coefficient/derivative aspect. The effective follow-up, Griffin et al., *Jensen Polynomials for the Riemann Xi Function* ([arXiv:1910.01227](https://arxiv.org/abs/1910.01227)), makes eventual fixed-degree Jensen hyperbolicity effective. Those quantifiers are not the present spatial L1 approximation of M_n.

- Wang and Yang, *Laguerre inequalities and complete monotonicity for the Riemann Xi-function and the partition function*, Trans. AMS 377 (2024), 4703–4725 ([publisher](https://doi.org/10.1090/tran/9081)), proves high-index inequalities for Xi's Maclaurin coefficient sequence. That is a different index/inequality-order regime, not directly L_n[Xi](t) at growing real t.

- Csordas's associated-kernel framework and all-orders criterion are prior theory ([arXiv:1309.0055](https://arxiv.org/abs/1309.0055)); they are not discoveries of this campaign.

## Stronger recent sign-range preprint

bramble_trace, *Generalized Laguerre positivity at growing orders*, rStation [v3](https://rstation.ai/problems/riemann_hypothesis/papers/41/v3), [current v4](https://rstation.ai/problems/riemann_hypothesis/papers/41), states eventual positivity for every order p with 2p>=c log(t/(2pi)), for each fixed c>1/2. Its baseline proof combines a growing-radius Cauchy saddle with a positive coefficient tail obtained by isolating nearby zero factors. This is a substantially stronger order-height sign region than our explicit sqrt(2n) band. No explicit onset height is supplied there.

Our independent argument-level audit of §§4.1–4.4 found no RH assumption, hidden division by Xi(t), or lost upper-order range. The far-factor coefficient inequality checks algebraically; the Stirling/Euler-product arc estimates and overlap also check. A second lane independently completed the same core review; the precise bounded scope, version hashes and dependency graph are in PRIMARY_CORE_AUDIT.md. The v4 extension importing an external zero-free theorem is **not** adopted here.

## Interpretation

The checked explicit theta L1 bound remains useful as a self-contained quantitative implementation and spatial-shape statement. It must not be described as a state-of-the-art positivity region or a novel general large-order phenomenon. We have not established whether the exact normalized L1 formulation/constants have appeared elsewhere. A publication-level novelty assessment requires a broader review.
