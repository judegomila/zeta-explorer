# Unconditional derivative mean squares and weighted tails

2026-11-04. Literature verification and elementary deductions. No RH assumption.

## Direct Hardy-Z reference

H. M. Bui and R. R. Hall, On the derivatives of Hardy's function Z(t), https://arxiv.org/html/2304.05178 , Introduction equation (1), defines Z(t)=exp(iθ(t))ζ(1/2+it), with all Z derivatives taken in real t. For k+ℓ=2s and |k−ℓ|=2d it records

    ∫_0^T Z^(k)(t) Z^(ℓ)(t) dt
       = (-1)^d T Q_(2s+1)(log(T/(2π))) / [4^s(2s+1)]
         + O(T^(3/4) (log T)^(2s+1/2)),

where Q_(2s+1) is monic. In particular, for j=0,1,2,

    ∫_0^T |Z^(j)(t)|² dt ≪_j T (log(2T))^(2j+1).

For j=2 the leading coefficient is 1/80. The reference underlying this statement is Hall's Theorem 3, The behaviour of the Riemann zeta-function on the critical line, Mathematika 46 (1999), 281–313, https://doi.org/10.1112/S0025579300007762 . Hall's publisher abstract explicitly states independence of unproved hypotheses. The full displayed formula was verified in Bui–Hall, not in the inaccessible full text of the 1999 article.

## Independent zeta-derivative reference and conventions

Daodao Yang, Extreme values of derivatives of the Riemann zeta function, Mathematika 68 (2022), 486–510, Lemma 5, https://pmc.ncbi.nlm.nih.gov/articles/PMC10234456/ , explicitly gives Ingham's unconditional asymptotic for fixed positive integer j:

    ∫_0^T |ζ^(j)(1/2+it)|²dt
       ~ T (log(T/(2π)))^(2j+1)/(2j+1).

These derivatives are complex derivatives in s. The cited original is Ingham, Mean-value theorems in the theory of the Riemann zeta-function, Proc. London Math. Soc. (2) 27, 273–300, p.294 Theorem A″, DOI https://doi.org/10.1112/plms/s2-27.1.273 . Bibliographic year varies: Yang gives 1926, publisher metadata gives 1928. The original theorem's full page was not directly inspected.

Writing ζ,ζ',ζ'' at s=1/2+it, direct differentiation gives

    Z' = exp(iθ) i(θ'ζ+ζ'),
    Z'' = exp(iθ)[-ζ''-2θ'ζ'+(iθ''-(θ')²)ζ].

Thus θ'=O(log t), θ''=O(1/t) and the j=0,1,2 zeta mean squares also imply the Hardy-Z bounds above on dyadic intervals. This route is optional because the direct Z source suffices.

## Weighted integrability deduction (not a quoted source theorem)

Let α=9/2−2λ and δ=−α−1=2λ−11/2. For fixed λ>11/4, δ>0. On [T,2T], Cauchy–Schwarz and the mean squares give

    ∫ |ZZ''| ≪ T(log(2T))³,
    ∫ |Z'|² ≪ T(log(2T))³,
    ∫ Z² ≪ T log(2T).

Consequently dyadic summation gives, for T≥2,

    ∫_T^∞ t^α (Z²+|Z'|²+|ZZ''|)dt
       ≪_λ T^(−δ)(log(2T))³,
    ∫_T^∞ t^α Z²dt ≪_λ T^(−δ)log(2T).

These are absolute-integrability statements, not signed cancellations. The constants may depend on fixed λ and are not asserted uniform as λ↓11/4. No conclusion at λ=11/4 follows from these bounds.

If F=aZ with a positive smooth gamma envelope and a²/W_λ≪_λ t^α, then F²/W_λ is integrable at infinity. Moreover

    FF''−(F')² = a²[ZZ''−(Z')²+(log a)''Z²].

Hence if (log a)'' is bounded for t≥2 (the gamma envelope gives more), the absolute value of this expression divided by W_λ is integrable, with the log³ tail above. This proves the intended conclusion for V=2[FF''−(F')²], or any fixed scalar multiple; if V has another definition its coefficients must be checked separately. Compact intervals additionally require W_λ positive with reciprocal locally bounded and smooth F, which remove all local integrability issues even at real zeros of F.
