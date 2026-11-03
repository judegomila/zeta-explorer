# Fixed complete-theta Rayleigh witnesses control every later prefix

Date: 2026-11-03. Status: directed MPFI certificate PASS; independent analytical audit and 4000-cell MPFI replay PASS. “Independent” here means AI-assisted review/replay, not peer review or a machine-formalized proof. This proves only an auxiliary upper bound for the old generalized spectral gap. It does not prove any new signed Schur pivot or either unproved mismatch inequality.

## Result and conditional use

Use the complete even theta profile

ψ(h) = 4 exp(h/2) Σ_{m≥1} (2z_m²−3z_m) exp(−z_m),  z_m=πm²exp(2h),

and Xp=2h p(D)ψ+p'(D)ψ, Yp=p'(D)ψ on L²(0,∞).
For a finite old polynomial space P, put Q=G_X−G_Y and

ρ(P)=min_{0≠p∈P} (||Xp||²−||Yp||²)/||Xp||².

The denominator is positive for each nonzero polynomial used here. For a nonzero degree-d polynomial with leading coefficient a_d, the m=1 theta asymptotic gives p(D)ψ∼8a_d(−2)^d exp(h/2)z^(d+2)exp(−z), z=πexp(2h), while p'(D)ψ is lower by one power of z. Thus Xp∼2h p(D)ψ is nonzero. This proves X injectivity directly.

Two fixed integer-coefficient witnesses are

p_even(z)=60000+12000z²+250z⁴+z⁶,
p_odd(z)=440000z+28000z³+340z⁵+z⁷.

The companion MPFI program rigorously encloses

J(p)=∫₀∞ [ (Yp)²−(3/4)(Xp)² ] dh.

The certificate gives J(p_even) ∈ [22187231.378500093, 22259005.45185021] and J(p_odd) ∈ [5564083577.169811, 5614490937.900694], with endpoints rounded outward. Their Rayleigh ratios are therefore strictly less than 1/4. Hence ρ(P)<1/4 for every even old prefix containing degrees 0,2,4,6 and every odd old prefix containing 1,3,5,7. This assertion does not require old positivity. When old positivity is stipulated, it gives 0<ρ<1/4. Equivalently this applies to every new even degree n≥8 and every new odd degree n≥9.

This is a variational inclusion argument from one fixed witness in each parity, not extrapolation from a degree scan.

For the proposed mismatch constants, suppose also Δ=A_X−B_Y>0 and

C_XY≤(10/3)U,   U≤(11/20)√ρ Δ.

Then directly

C_XY≤(11/6)√ρ Δ < (11/12)Δ,
2S=Δ−C_XY > Δ/12.

Thus the original auxiliary demand ρ≤1/5 can be relaxed to the independently certifiable ρ≤1/4. The two mismatch inequalities remain unproved. This note does not claim them.

## Exact derivative recurrence and complete-orbit error

Write D^kψ=4exp(h/2) Σ P_k(z_m)exp(−z_m), where

P_0=2z²−3z,  P_(k+1)=(1/2−2z)P_k+2zP_k'.

The program constructs all coefficients exactly with Python Fraction. For 0≤k≤9, deg P_k=k+2≤11 and its absolute coefficient sum is <2×10⁹. For z≥1,

|4exp(h/2)P_k(z)exp(−z)| ≤ 8×10⁹ z¹² exp(−z),

because exp(h/2)=(z/(πm²))^(1/4)≤z. For m≥7, h≥0, z≥3m²≥147. The inequality log147<5 implies 12log147<147/2; z/2−12logz is increasing for z>24. Therefore z¹²exp(−z)≤exp(−z/2). Consequently

Σ_(m≥7)|D^kφ_m(h)|
 ≤8×10⁹ Σ_(m≥7) exp(−3m²/2)
 ≤16×10⁹ exp(−73.5) <10⁻²⁰.

The geometric bound uses exp(−22.5)<1/2. All three scalar exponential inequalities are directly checked by MPFI. This is uniform for h≥0 and 0≤k≤9. The program sums m=1,...,6 and adds [−10⁻²⁰,10⁻²⁰] to each derivative; linear combinations receive the corresponding absolute coefficient sum multiplier.

## Spatial-tail bound

For h≥3, the same absorption inequality holds for every m≥1, and

|D^kψ(h)| ≤16×10⁹ exp(−(3/2)exp(2h)), 0≤k≤9.

Both fixed witnesses and their symbol derivatives have absolute coefficient sum <10⁶. With F=p(D)ψ and G=p'(D)ψ,

|G²−(3/4)(2hF+G)²|
 ≤10³⁴(h+1)²exp(−3exp(2h)).

Put u=h−3≥0. The MPFI check exp6>400 gives exp(2h)≥400(1+2u), while (h+1)²=(u+4)²≤16exp(u/2). Thus the tail integral is at most

10³⁴ exp(−1200)·16/(2400−1/2) <10⁻⁴⁵⁰.

The program verifies the stronger scalar inequality 10³⁴exp(−1200)<10⁻⁴⁵⁰ and adds [−10⁻⁴⁵⁰,10⁻⁴⁵⁰] to each final integral.

## Directed quadrature on [0,3]

Each exact rational cell has length d=3/N and midpoint m. The midpoint rule with the integral Taylor remainder gives

∫cell f(h)dh ∈ d f(m) + (d³/24) range_cell(f''),

where f=G²−(3/4)X², X=2hF+G. The program evaluates

X'=2F+2hF'+G',
X''=4F'+2hF''+G'',
f''=2[(G')²+GG'']−(3/2)[(X')²+XX''].

All evaluations use 160-bit MPFI intervals. Cell endpoints, midpoint, and lengths are constructed by integer/rational interval operations. The interval hull encloses the full cell. The final two endpoints are converted outward to binary64 only for display. No floating-point quadrature error estimate is used as a certificate.

## Scope guardrails

- The complete theta series, not a finite-orbit replacement, is enclosed by the tail proof.
- No old inverse is computed, no unproved future positivity is assumed, and no floating eigenvalue is used in the theorem.
- Low degrees below the fixed-witness inclusion thresholds require their separate existing analysis.
- This is only an upper bound on ρ; it is not a useful lower bound on the old inverse conditioning.
- C_XY/U≤10/3 and U/(√ρΔ)≤11/20 remain the substantive open theta-specific assertions.
