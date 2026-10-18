# Independent review: prime-square separation

18 October 2026. Review of the frozen artifact `PRIME_SQUARE_JOINT_POISSON_REVIEW_v1.md`, SHA256 `23286afbd537ddc27d4a60dd9a140ee7fac6423056aa35bd3f44b6c6936dfc16`.

## Verdict

Pass for the stated bounded algebraic refinement. No mathematical corrections required. This review verifies the identities and sufficient conditional criterion; it does not verify the missing arithmetic inequalities or any new all-height zero-free region.

## Checks

1. **Euler logarithm and signs.** With positive coefficients a_p and d_p, the exact decomposition is L_Q = -S1-S2+R3. The stated negative sign in the defining j>=3 series is correct. All primes p<=Q supply their squares, including squares greater than Q.

2. **Uniform remainder.** The geometric-series majorant is
   sum_(p<=Q) p^(-3s)/[3(1-p^(-s))].
   Enlarging to all integers and using the integral estimate gives exactly the stated C3(s). It decreases for s>=1/2 and its endpoint is 5(1+sqrt(2))/6. The displayed numerical approximations at s=.5 and s=.834 agree with direct evaluation. No cancellation or unproved prime estimate enters this bound.

3. **Poisson mean.** The transform exp(-x|lambda|) sends each prime mode to Re[a_p p^(-x-iT)] and each square mode to Re[d_p p^(-2x-2iT)]. Thus m12=Re[A1(1)+A2(1)] has the correct sign and damping.

4. **Poisson covariance and energy.** Multiplication of cosines and subtraction of their means cancels the sum-frequency channel exactly. The remaining kernel is the stated one-half cosine of the frequency difference, multiplied by [(min/max)^x-(mn)^(-x)]. The identity
   x integral_1^min(m,n) v^(2x-1)dv = (min(m,n)^(2x)-1)/2
   verifies the factor x and the full energy through Q^2. The use of finite sums makes all exchanges immediate.

5. **Mixed terms retained.** Expansion of |A1+A2|^2 produces twice the real mixed integral. Its upper limit may equivalently be Q, because A1 vanishes above Q. Equation (3) is Cov(S1,S2), with the correct factor 1/2, and variance adds twice this covariance. Terms p=q are included and do not vanish in general. No favorable sign is assumed.

6. **Single remainder payment.** The pointwise majorant (c+L_Q)_+ <= (c+C3-S1-S2)_+ is valid. Its mean parameter is a=c+C3-m12 and its variance is v12. For Bstar>0, the sharp two-moment upper bound is strictly below Bstar exactly when a<Bstar and v12<4 Bstar(Bstar-a). Positivity of a is unnecessary. The full remainder is paid once; no second variance charge is required.

7. **Analytic scope.** Separating square modes leaves G and its zeta(s+h) denominator unchanged. The existing finite-rectangle geometry, including positive lower carrier height, denominator clearance on a neighborhood of its closure, left ratio estimate, right and horizontal boundary bounds, and every-target coverage must all still hold. The Poisson parameter is the target's horizontal distance x=Re(z)-s0, and its carrier is Im(z). The note correctly does not infer denominator clearance at s0=1/2,h=1/8 from a conditional zero-free baseline near 7/8. Increasing h would require fresh verification of the relevant analytic inputs.

## Limit of this review

The refinement moves prime squares from a deterministic remainder into the actual joint arithmetic target. Whether that improves the final bound depends on the signed mean and full covariance. Neither their required uniform estimates nor effective onset, full carrier coverage, a global 7/8 improvement, or RH is established. The frozen source was not edited. No external service was modified and no large computation was performed.

## Separately reviewed absolute-constant corollary

The companion `ABSOLUTE_SPLIT_CONSTANT_COROLLARY_v1.md`, SHA256 `9fe018a3643a00b30333c1f0629dd4a5da882d9e5c0519c9aa64daa90c8e44b3`, also passes independent review.

For s>1/2, paying the retained squares absolutely gives the valid allowance C_split=Z2/2+Z3/[3(1-q)], where q=2^(-s) and Zj=2^(-js)+2^(1-js)/(js-1). Its comparison with C_old=Z2/[2(1-q)] is exact:

C_old-C_split = [q Z2/2-Z3/3]/(1-q)>0.

In fact q Z2-Z3=2q^3[(2s-1)^(-1)-(3s-1)^(-1)]>0, so the numerator is strictly greater than Z3/6. The three rounded values at s=417/500 check: old 1.431425858, split 0.940940294, saving 0.490485564. This is a genuine reduction of the earlier deterministic additive allowance. It supplies no improved height exponent or all-height certificate. C_split still diverges as s approaches 1/2 from above. The companion source was not edited.
