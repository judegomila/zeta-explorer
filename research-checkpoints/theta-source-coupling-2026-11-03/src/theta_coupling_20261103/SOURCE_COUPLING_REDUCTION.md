# Source coupling: exact coordinates and a simpler conditional payment

Date: 2026-11-03. Status: exact finite-dimensional algebra; independent coordinate/algebra audit PASS. The two proposed theta-specific estimates remain unproved. This is not an all-degree Schur proof.

## Definitions independent of coordinate choices

Let G=G_X>0, H=G_Y≥0, Q=G−H>0 on the old polynomial prefix. For the new representative, let b_X,b_Y be its old cross columns and

r=b_Y−HG⁻¹b_X ∈ Ran H.

Put

A=||Xp||²−b_X*G⁻¹b_X,
B=||Yp||²−b_Y*H†b_Y,
Δ=A−B,
ρ=min_{v≠0} (v*Qv)/(v*Gv).

Here H† is the Moore–Penrose inverse, used only on Ran H. If v=P_(old Y)Y(p−q_X), T=Y(X|_old)⁻¹, and R=(I−TT*)⁻¹ on the old Y image, then

U=||v||² = r*H†r,
C=⟨v,Rv⟩ = U+r*Q⁻¹r,
V=||Rv||² = U+2r*Q⁻¹r+(Q⁻¹r)*H(Q⁻¹r).

These are invariant under old basis changes and replacing p by p+q_old. The exact paid-Schur formula is 2S=Δ−C. The conventions q_X as old regression and p−q_X as the source residual must not be mixed.

The formula for V follows from R=I+YQ⁻¹Y* and Y*v=r. It provides a durable coordinate implementation without choosing square roots or an old-Y orthonormal basis.

## What the Cauchy test adds

C²≤UV, so UV≤Δ² is sufficient only together with Δ≥0. If Δ<0, squaring loses the sign and cannot prove the Schur inequality.

More exactly, when U>0 and ν is the probability spectral measure of R in direction v,

C/U=E_ν R,
V/U=E_ν R²,
UV=C²+U² Var_ν(R).

Thus the UV criterion charges the directional resolvent variance as well as the exact required payment C. It is stronger than the Schur criterion and is not required once C is bounded directly.

## The proposed constants imply a direct, stronger conclusion

Assume the proposed theta-specific estimates

C≤(10/3)U,   U≤(11/20)√ρ Δ,   Δ≥0.

Then

C≤(11/6)√ρ Δ.

Consequently ρ≤1/5 yields

2S≥[1−11/(6√5)]Δ ≈0.1801084083Δ.

Already ρ≤1/4 yields 2S≥Δ/12. More generally any ρ<36/121 gives a strict positive relative margin for Δ>0. The certificate RHO_QUARTER.md supplies the 1/4 auxiliary hypothesis for all even new degrees ≥8 and odd new degrees ≥9; RHO_FIFTH.md addresses the exact 1/5 version for later prefixes.

This direct calculation does not prove either proposed theta-specific estimate.

## The 363/400 UV calculation

Because spectrum(R)⊂[1,ρ⁻¹], convexity gives the secant bound

R²≤(1+ρ⁻¹)R−ρ⁻¹I.

Hence the first proposed estimate implies

V≤[(10/3)+(7/(3ρ))]U.

The second then gives

UV≤(121/1200)(10ρ+7)Δ².

For ρ≤1/5 this is UV≤(363/400)Δ². For ρ≤1/4 it is UV≤(2299/2400)Δ². Both constants are correct, but the direct payment above is simpler and gives a larger Schur margin than using C≤√(UV).

## The exact remaining source-specific question

The hard directional inequality is

r*Q⁻¹r ≤ (7/3) r*H†r.

It is not a lower bound for the smallest old eigenvalue. In spectral defect coordinates μ_j=1−σ_j(T)², it requires the v-weighted average of μ_j⁻¹ to be ≤10/3. In particular it forces

Σ_(μ_j≤ε)|v_j|² ≤ (10/3) ε U.

The actual mismatch must therefore avoid the near-zero old defect modes. A small global ρ alone does not produce this avoidance. The amplitude inequality U≤(11/20)√ρ Δ is a separate, correlated theta assertion. No proof or actual-theta counterexample to either is supplied here.

The original degree-200 figures are unavailable as a durable, independently validated computation. They are not used anywhere in these deductions or finite certificates.
