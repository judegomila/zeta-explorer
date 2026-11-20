# Actual-theta counterexample to automatic sharpness of the signed matrix BL criterion

Status: independent analytic audit PASS. This concerns the actual theta reference measure but an auxiliary feature vector and symmetric matrix, not the actual modular matrix or the inverse-selected Schur direction.

For any real b, let p(h)dh=dν_b=I_b⁻¹h exp(2bh)ψ(h)²dh on h>0, U=−log p, W=U''=h⁻²+2v'>0. Put μ=E h, M₂=E h², M₄=E h⁴, C=Var(h), B=E[1/W]. All moments are finite. The one-dimensional Brascamp–Lieb bound is strict here: B>C.

One endpoint-aware proof sets
 g(h)=−p(h)⁻¹∫₀^h (t−μ)p(t)dt,
so −g'+U'g=h−μ and g(h)~μh/2 as h↓0. Integration by parts yields C=E[(g')²+Wg²]=E g. Boundary terms vanish at 0 and infinity by the theta endpoint behavior. Weighted Cauchy gives C²≤B E[Wg²]=B(C−E(g')²). As g' tends to μ/2>0, the derivative term is strictly positive, hence B>C. This proof does not require the singular U' to belong to L²(ν_b).

Now take the smooth two-component vector F=(h,h²) and symmetric indefinite H=diag(1,−k), with
 k=(M₂+μ²+B)/(2M₄)>0.

The actual integrated form is
 S=E[F^T H F]=M₂−kM₄=(C−B)/2<0.

The sufficient bound T from MATRIX_BL_SIGNED_TEST, retaining the full negative covariance exactly, is
 T=μ²+B−kM₄=(B−C)/2>0.

Thus even with the complete actual theta weight and negative covariance retained exactly, the BL majorant need not certify an actually negative integrated form. The 2×2 example embeds in arbitrarily large dimensions by adjoining zero features and zero rows and columns, disproving a general dimension-uniform implication from truth of the desired sign to the BL certificate.

The arbitrary H and polynomial F are not the structured modular commutator and theta derivative feature vector. Thus the example is not an actual modular counterexample, not a result about the selected Schur complement, and does not preclude a theta-specific covariance estimate that exploits their correlated structure.
