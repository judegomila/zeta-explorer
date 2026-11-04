# Why the standard exponential-weight Sobolev theorem does not close this estimate

Date: 2026-11-03. Status: source inspection and independent analytical/source audit PASS (AI-assisted, not peer review); not an amplitude counterexample.

Geronimo, Lubinsky, and Marcellán, *Asymptotics for Sobolev Orthogonal Polynomials for Exponential Weights*, Constructive Approximation 22 (2005), 309–346, studies a positive Sobolev form with derivative weight W² and function weight (ψW)². Its Theorems 1.3 and 1.5 require a convex logarithmic external field and bounded ψ; Theorem 1.3 additionally requires the field derivative to diverge at the support endpoints. Theorem 1.4 allows more general measurable weights but controls its error using approximation of the integral operator below. These hypotheses and estimates cannot simply be applied to the actual theta pair w=F², V=2(F′²−FF″).

Primary author PDF: https://lubinsky.math.gatech.edu/Research%20papers/GeronLubMarcJune04.pdf

Author-uploaded searchable text: https://www.researchgate.net/publication/226889825_Asymptotics_for_Sobolev_Orthogonal_Polynomials_for_Exponential_Weights

## Actual-theta obstruction to the integral-operator route

This section is an independent calculation, not a claim made by that paper.

The operator required by the direct identification is

I[R](t)=w(t)^(−1) ∫_(−∞)^t R(s)V(s) ds.

Let γ be any real zero of F, of multiplicity m≥1. Real Xi zeros exist independently of RH. Write F(t)=a(t−γ)^m+O((t−γ)^(m+1)), a≠0. Then

w(t)=a²(t−γ)^(2m)[1+O(t−γ)],
V(t)=2ma²(t−γ)^(2m−2)+O((t−γ)^(2m−1)).

If N_R(γ):=∫_(−∞)^γ RV is nonzero, then I[R]²w is asymptotic to a positive constant times |t−γ|^(−2m). It is not locally integrable. In particular I[R] is not in L²(w), and its distance from every polynomial in L²(w) is infinite.

There exists a polynomial R satisfying both ∫RV=0 and N_R(γ)≠0. Indeed, otherwise the linear functional N_R(γ) would be a scalar multiple of ∫RV on the polynomial vector space. Polynomial density in L²(|V|dt), justified by the exponential moment, would force 1_(−∞,γ)V=cV almost everywhere. This is impossible: the real-analytic, nonzero V is not identically zero on either side of γ. In the even-polynomial subspace the same argument uses a positive real zero γ and the even-part indicator, which is 1 on |t|<γ and 1/2 outside; it is again nonconstant on sets of positive |V| measure.

Thus, even if one additionally granted the unresolved sign V≥0, the polynomial R can be normalized to ∫R²V=1 and satisfies the zero-mean constraint in the cited operator estimate while yielding an infinite approximation error. The estimate is then vacuous at all sufficiently large finite degrees containing that R. This does not show that every alternative Sobolev argument fails; it identifies why this particular positive exponential-weight transfer provides no finite uniform bound for actual theta.

Separately, V/w=2m/(t−γ)²+O(1/|t−γ|) near γ. Hence the bounded multiplier required in the stronger theorems is impossible even locally at a real zero. Replacing w or V to remove that singularity changes the original selected regression problem.
