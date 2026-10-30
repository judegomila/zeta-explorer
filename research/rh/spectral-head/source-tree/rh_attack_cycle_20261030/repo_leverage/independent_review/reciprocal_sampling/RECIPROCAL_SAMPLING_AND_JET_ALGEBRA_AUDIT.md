# Independent audit: reciprocal sampling and exact jet algebra

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. Internal mathematical/source review. **Analytic PASS** on the two sources below. No numerical calculation or sign conclusion for the exceptional port matrix.

## Pinned sources

- `gamma_complement_attack/COLLAR_RECIPROCAL_SAMPLING_AND_SMALL_LABEL_REDUCTION.md`, SHA256 `2f3642c389ca9e56064945d3350357e83ab9cf73ae42beff1614d05b660a87ad`.
- `gamma_complement_attack/FOURIER_ENDPOINT_JET_RECURRENCE_AND_ARITHMETIC_PORT_MATRIX.md`, SHA256 `6974e50e558c51aca7d2748b032ff51034568442e29362cd83cc32bd75dcf5df`.

The reviewer read both complete sources and independently checked the following.

## 1. Sampling proof and exact cutoffs

For delta-separated nodes, the disjoint interval comparison gives sum|f(x_j)|²<=delta^-1||f||²+2||f||||f'||. The H1 function has its continuous representative, so point evaluations are legitimate. Here ||f||<=2||u|| and ||f'||<=2pi lambda||f||. Reciprocal nodes with J<=j<2J have spacing at least lambda/(4J²), giving exactly16[J²/lambda+pi lambda]||u||². Cauchy-Schwarz and sum j^-2<=1/J yield the source's coefficient4.

The actual moving subset j<=lambda t is retained. Pairing with H costs2sqrt(h)||g|| and therefore coefficient8 per block. The two powers sqrt(J/lambda) and sqrt(lambda/J) sum geometrically, not by the number of dyads. With J0 between w8 and2w8 and X=lambda²/J0, the middle form is O(sqrt(lambda h/J0))=O(1/w).

For high labels, all samples t/x, X<=x<=lambda t, lie in the visible interval eventually. Differentiating F_t(x)=conjugate(u(t/x))/x gives exactly the x^-2 value term and t x^-3 derivative term. Both Abel boundary terms remain. The bound is eta_X{||u||infty[2+log(b/a)]+t||u'||infty/a}, at most C eta_X sqrt(lambda)J0||u||. Cauchy-Schwarz against H yields eta_X J0 sqrt(lambda h)=O(eta_X w11), which tends to zero.

The weak Mertens input was independently read in current Lee--Leong arXiv:2208.06141v5, Theorem1.1, displayed classical Mertens bound (HTML Eq10). It is unconditional and its log factor is absorbed by reducing the positive exponent. No RH-scale Mertens bound is used.

For low labels, visibility boundaries are eventually inactive and the intervals are (lambda/j,(lambda+h)/j). Adjacent intervals are disjoint when h j<lambda; hJ0<lambda holds eventually. This disjointness alone supplies no sign or vanishing norm. The finite common jet map is shared across all labels, so rank is not multiplied by the label count.

## 2. Jet recurrence and signed matrix algebra

Differentiate P H''+2t H'+(k²t²-nu)H=0 exactly r times. At t=lambda the first term contributes2r lambda H^(r+1)+r(r-1)H^r; the second contributes2lambda H^(r+1)+2rH^r. The potential contributes(c²-nu)H^r+2r k²lambda H^(r-1)+r(r-1)k²H^(r-2). Rearranging gives precisely source (2). Its leading coefficient is1/[(2lambda)^r r!]. Entire Fourier regularity justifies all endpoint derivatives. H_n(lambda)=chi_n b_n is used only where the finite Fourier identity holds.

The output profiles W_r are literal finite moving-cutoff sums. Expanding (jy-lambda)^r verifies their short-interval Mobius moment formula. With inner product antilinear in the first argument, L(u)_r=<W_r,u> gives <u,Kg>=<L(u),J(g)> exactly, hence D_jet=Herm(L*J), not J*J. Operator rank<=m and Hermitian rank<=2m are correct.

For A_-=A-epsilon I>0, U=A_-^-1/2 L*, V=A_-^-1/2 J*, X=[U,V], and F=(1/2)[[0,I],[I,0]], direct multiplication gives I+XFX*. The block matrix [[I,X],[X*,-F^-1]] has, by its two Schur complements, inertia equal both to (dimF,0,0)+inertia(-F^-1-X*X) and to (m,m,0)+inertia(I+XFX*). Thus strict positivity of the latter is equivalent to exactly m negative and no zero eigenvalues of the 2m-by-2m test. Rank deficiency of X does not change this argument.

The alternative Schur reduction on the at-most-m-dimensional jet complement is valid because the absorbed-error form is positive on ker J. Coupling cannot be deleted; the two original trace repairs must be restored when enlarging the source space.

## Scope

The combined result is an actual additive bilinear localization to polylogarithmically many low arithmetic labels, with an explicit finite signed port matrix. Eventual onset is unspecified. Neither the low-label matrix nor the original trace/repair Schur block has been proved positive. No deficit-whitened metric, external gamma complement, all-support Weil floor, or RH conclusion is supplied.
