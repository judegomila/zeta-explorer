# Phase-aware curvature cost instead of absolute prime sums

2026-11-02. Exact sufficient criterion, not a proved all-height prime-cancellation estimate.

In the correlated reference notation F(s)=g(s)|Z(s)|², assume Z≠0 on the real s interval under consideration, as holds for the prime-power Euler box in Re z>0 after excluding the linear-factor zero (s,t)=(1/2,0). The inherited δ-restricted shift interval already excludes that point. Put
b=(logg)′, T=(logg)″>0,
L_Z=Z′/Z, R_Z=L_Z′.
Then exactly

F″/F=(b+2Re L_Z)²+T+2Re R_Z.                         (1)

This keeps the phase correlations and isolates only the actual negative curvature cost. For example if b>0 and throughout the shift interval

|Re L_Z|≤b/4,     Re R_Z≥−b²/16,

then F″/F≥b²/8+T>0. These bounds concern correlated values, not sums of coefficient magnitudes.

For one prime-power factor Q=(1−p^(−Nz))/(1−p^(−z)), N=M+1, r=p^(−z), l=logp,

Q′/Q=Nl r^N/(1−r^N)−l r/(1−r),
(logQ)″=−N²l²r^N/(1−r^N)²+l²r/(1−r)².

For a product, these exact quantities add. The extra linear factor Z=(s−1/2+it)P contributes1/(s−1/2+it) and−1/(s−1/2+it)². Thus(1) has a completely explicit finite arithmetic evaluation at any specified height, with no lost n,m cross terms.

For the infinite-power finite-prime Euler product, the prime pieces are
L_E=−Σ_(p≤Y)Σ_(m≥1)(logp)p^(−mσ)e^(−imtlogp),
R_E=Σ_(p≤Y)Σ_(m≥1)m(logp)²p^(−mσ)e^(−imtlogp).
Finite-power corrections are precisely the displayed r^N terms, not an unspecified error.

A route to useful correlated bounds is to keep
S_(m,j)(x,t)=Σ_(p≤x)(logp)^j e^(−imtlogp)
inside partial summation:

Σ_(p≤Y)(logp)^j p^(−mσ)e^(−imtlogp)
 =Y^(−mσ)S_(m,j)(Y,t)+mσ∫_2^Y x^(−mσ−1)S_(m,j)(x,t)dx.

The lower boundary is S(2−)=0. Power tails with mδ>1 can be bounded absolutely by convergent integer sums; the finitely many lower powers must retain their oscillatory prime sums. Replacing S by its absolute counting bound returns exactly the incompatible polynomial cost proved in CUTOFF_COMPATIBILITY_OBSTRUCTION.md.

No all-height bounds of the strength in(1) have been established for the actual turning-range prime set. Nor has an omitted-prime/full-modular correction been bounded for this Euler grouping. The precise constructive next obligation is therefore a correlated bound on these low prime-power sums or a different joint Schur estimate, together with a compatible remainder theorem. The equations do not themselves discharge it.
