# Actual correlated cancellation on the right half: a density-one convexity theorem

2026-11-02. Independently reviewed analytic theorem, including the approaching-line corollary. This does not prove the required all-height, two-sided shift theorem or pay the full modular remainder.

Fix 1/2<σ0<1 and c>0. On a height block t∈[T,2T], take the primes p≤Y with Y≤cT and arbitrary fixed integers M_p≥1. Set
P(z)=∏_(p≤Y)(1−p^(−(M_p+1)z))/(1−p^(−z)),
Z(s,t)=(s−1/2+it)P(1/2+s+it),
F(s,t)=g(s,t)|Z(s,t)|²,
where g is the positive gamma factor of CORRELATED_EULER_BLOCK_THEOREM.md. We prove that, outside an explicitly bounded set of heights of relative measure O_(σ0,c)(1/log T), F is strictly convex simultaneously for σ=1/2+s∈[σ0,1]. Constants are uniform in all exponents M_p. This is a genuine cancellation estimate for a linearly growing prime set, not an absolute prime-cost estimate.

## 1. Elementary mean-square bound

For fixed prime support p≤Y and j≥1, put S_j(σ,t)=Σ(log p)^j p^(−σ−it). For N=ceil(Y), H_N=Σ_(n=1)^N1/n,

(1/T)∫_T^(2T)|S_j(σ,t)|²dt
 ≤ (1+4Y H_N/T) V_j,
V_j=Σ_(n≥2)(log n)^(2j)n^(−2σ0).                 (1)

Indeed each normalized off-diagonal exponential integral has modulus ≤2/(T|log(p/q)|)≤2Y/(T|p−q|). Applying 2|a_p a_q|≤|a_p|²+|a_q|² and summing reciprocal integer spacings gives at most 4YH_N/T times the diagonal sum. No prime distribution theorem or independence assumption is used.

All constants are effectively finite. For k≥0 and q>1 define
I_k(q)=Σ_(r=0)^k binom(k,r)(log 2)^(k−r) r!/(q−1)^(r+1).
Then Σ_(n≥2)(log n)^k n^(−q)≤I_k(q), by integration on [n−1,n], using n≤2x and n^(−q)≤x^(−q).

## 2. All higher prime powers and finite-power corrections cost a bounded amount

Let L_j=∂_s^j log Z, j=1,2,3, and r0=2^(−σ0). Define
C_d(r0)=Σ_(m≥2)m^d r0^(m−2),
B_j=[C_(j−1)(r0)+C_j(r0)] I_j(2σ0).
These C_d are elementary rational functions, or absolutely convergent positive series with geometric tails.

Uniformly in σ∈[σ0,1], t and every M_p≥1,

|L_j−(−1)^j S_j|≤B_j+(j−1)!/T^j.              (2)

For the denominator Euler factor the terms m≥2 have coefficient m^(j−1)(log p)^j. For the numerator with N_p=M_p+1≥2, terms m=N_pk have coefficient N_p^j k^(j−1)≤m^j. Summing both in absolute value is bounded by p^(−2σ0)[C_(j−1)+C_j]. The separate linear factor in Z contributes modulus (j−1)!/|s−1/2+it|^j. Thus the omitted higher powers are actually paid, without discarding the oscillatory first-prime sum.

It follows from (1), (2) and |x+y|²≤2|x|²+2|y|² that

(1/T)∫|L_j(σ,t)|²dt ≤ M_j,
M_j=2(1+4YH_N/T)I_(2j)(2σ0)
       +2[B_j+(j−1)!/T^j]².                  (3)

## 3. Simultaneous control throughout the right-half shift interval

Write d=1−σ0. The fundamental theorem of calculus, Cauchy–Schwarz and L_j′=L_(j+1) yield

(1/T)∫ sup_(σ0≤σ≤1)|L_1|²dt ≤ U_1=2M_1+2d²M_2,
(1/T)∫ sup_(σ0≤σ≤1)|L_2|²dt ≤ U_2=2M_2+2d²M_3. (4)

The gamma factor has T_g=∂_s²log g>0 and
b=∂_slog g≥b0=log(T/(2π))−π/T.
Assume b0>0. The set on which either sup|L_1|>b0/4 or sup|L_2|>b0²/16 has relative measure at most

ε_T =16U_1/b0²+256U_2/b0^4.                   (5)

On its complement the exact identity
F″/F=(b+2Re L_1)²+T_g+2Re L_2
implies F″/F≥b²/8+T_g>0 simultaneously throughout σ∈[σ0,1]. For Y≤cT, H_N=O(log T), hence U_j=O_(σ0,c)(log T) and ε_T=O_(σ0,c)(1/log T)→0. The bound can be replaced by min(1,ε_T) when stating relative measure.

## What this repairs, and what remains

This proves real correlated cancellation sufficient for convexity on a density-one set of heights even when the prime support grows linearly with height. It improves substantially over the absolute-cost theorem's polylogarithmic prime range. It does not imply convexity on the exceptional heights, and it is only on the right half σ≥σ0>1/2. The constants diverge as σ0↓1/2; the square-summability argument genuinely stops there. Positivity of the original bridge derivative compares shifts across the critical line, so this right-half result cannot be substituted for that comparison. Nor is an Euler box the corrected product-cutoff head: its omitted-prime/full-modular correction remains unpaid. No RH implication is claimed from this density-one theorem.

## Quantified approach toward the critical line (same proof)

The right-half interval may approach the critical line slowly. Let
σ0(T)=1/2+(log T)^(−κ), with any fixed 0<κ<1/5,
and retain Y≤cT. The same explicit bounds give an exceptional relative measure
O_c,κ((log T)^(5κ−1))→0, uniformly over σ∈[σ0(T),1].

Indeed r0≤2^(−1/2) keeps every C_d bounded, while I_k(2σ0)=O_k((σ0−1/2)^(−k−1)). Writing ε=σ0−1/2,
M_j=O(log T ε^(−2j−1)+ε^(−2j−2)).
Thus the two terms in (5) are bounded by constants times
ε^(−5)/log T+ε^(−6)/(log T)²
+ε^(−7)/(log T)³+ε^(−8)/(log T)^4.
Substitution yields the claimed dominant power for κ<1/5. This gives no value or sign on the critical line itself: the excluded shrinking interval and exceptional height set remain genuine gaps, and passing to the line is not justified by a density statement.
