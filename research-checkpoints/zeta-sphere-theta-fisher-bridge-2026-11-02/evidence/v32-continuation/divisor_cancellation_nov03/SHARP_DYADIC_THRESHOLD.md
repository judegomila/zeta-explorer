# Sharp arithmetic threshold for the dyadic payment

This is a finite integer certificate and an application of the previously audited tail theorem, not an all-degree core proof. For j≥1 put v=v₂(j), and define ℓ₂(j)=∑_{nm=j}log²(n/m). The exact prime-exponent identity gives

ℓ₂(j)/(d(j)log²2) = (1/3) ∑_{p^a∥j} a(a+2)(log₂p)².

**Claim.** The least integer T for which ℓ₂(j)/d(j)≥log²2(6+5v₂(j)) for all j≥T is T=107521.

**Certificate of sufficiency.** The existing analytic argument in DYADIC_RESIDUAL_PAYMENT proves the inequality for j≥2²¹. For 107521≤j≤2²¹, let q_p=floor(log₂(p⁴)) = bit_length(p⁴)−1. Then log₂p≥q_p/4, and the desired inequality follows from the integer inequality

∑_{p^a∥j} a(a+2)q_p² ≥ 48(6+5v₂(j)).

The companion Python script constructs the least-prime-factor sieve and applies the exact recurrence S(j)=S(j/p)+(2a+1)q_p², where a is the exponent of p in j, and checks this inequality for every j in the finite range. The smallest integer margin is 11. All tests are integer arithmetic; no numerical logarithms or borrowed code are used.

**Sharpness.** For j=107520=2¹⁰·3·5·7, the left-hand side of the normalized inequality is 40+(log₂3)²+(log₂5)²+(log₂7)², while the right-hand side is 56. The exact comparisons 3¹⁰⁰<2¹⁵⁹, 5¹⁰⁰<2²³³ and 7¹⁰⁰<2²⁸¹ imply that the extra sum is less than (159²+233²+281²)/10000<16. Therefore 107520 fails, proving that no smaller T can work.

**Application and parity.** At indices also beyond the reviewed derivative-sign cutoff, the even-target term H_j dominates the same-residual dyadic eta payment E_j; replacing the previously sufficient 2²¹ by 107521 is optimal for this coefficientwise arithmetic test. On the odd ladder H_j≤E_j<0, so the target is negative and must still be paid with a magnitude tail. This does not prove positivity of either target's signed finite core, and it does not assert a result for the a>0 kernel.
