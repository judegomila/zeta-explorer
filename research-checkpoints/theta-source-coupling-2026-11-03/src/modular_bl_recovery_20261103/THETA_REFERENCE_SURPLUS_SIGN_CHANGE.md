# Gaussian-reference surplus is indefinite for actual theta

Status: independent analytic audit PASS. The witnesses below are arbitrary polynomial tests of each parity; no assertion is made about the actual inverse-selected sequence.

Let F(t)=∫_R ψ(h)e^(−ith)dh be the real even Fourier transform of the complete theta profile, and c>0. Set
 X₀p=−(2/c)D p(D)ψ−p'(D)ψ,  Yp=p'(D)ψ,
 Xp=2h p(D)ψ+p'(D)ψ.
For p of parity n, write p(it)=i^n q(t), with q real of the same parity. Plancherel and integration by parts yield, up to the same harmless positive Fourier/half-line normalization,

 G₀[p]=||X₀p||²−||Yp||² = ∫_R q² ρ₀(t)dt,
 ρ₀=(4t²/c²+2/c)F²+(4t/c)FF',                                     (1)

 Q[p]=||Xp||²−||Yp||² = ∫_R q² λ(t)dt,
 λ=2(F'²−FF'').                                                       (2)

The omitted common factor is positive and depends on Fourier convention only. Both densities are even. These formulas retain the assembled cross terms; no division by F is involved.

The actual Xi transform has a nonzero real zero t₀>0. Suppose its finite order is m≥1, so F(t)=A(t−t₀)^m+O((t−t₀)^(m+1)) with A≠0. Then

 ρ₀(t)=(4t₀mA²/c)(t−t₀)^(2m−1)+O((t−t₀)^(2m)),
 λ(t)=2mA²(t−t₀)^(2m−2)+O((t−t₀)^(2m−1)).                         (3)

Consequently there is an open interval immediately to the left of t₀ where ρ₀<0 and λ>0. Its negative reflection has the same signs. No simplicity of the zero is assumed.

The completed-Xi gamma envelope supplies a positive exponential moment for an even weight dominating |ρ₀|+|λ|. Polynomials are dense in the corresponding weighted L² space; even and odd polynomials are separately dense in their parity subspaces. Approximate an even indicator, or its odd signed version, of a compact symmetric pair of intervals inside the indicated sign region. For each parity this produces a real polynomial p with

 G₀[p]<0 while Q[p]>0.                                                (4)

Rescaling its nonzero leading coefficient makes it monic without changing signs. Thus a proof cannot infer positivity of the Gaussian-reference surplus for all theta tests merely from positivity of the full paired form, or rely on a test-independent positive reference norm. The identity also shows the defect correction can repair an adverse reference contribution.

This does not determine whether G₀ is positive on the specific sequence selected by the actual old signed inverse. The polynomial localization witnesses are not identified with those selected residuals. Nor does it disprove a degree-dependent correlated bound that uses that inverse and the exact zero-dependent cancellation.
