# The original ρ≤1/5 auxiliary hypothesis has fixed theta witnesses

Date: 2026-11-03. Status: directed MPFI certificate PASS; independent analytical/code audit PASS; independent full 8000-cell replay PASS. AI-assisted review/replay is not peer review or a machine-formalized proof. This is an auxiliary old-prefix Rayleigh bound, not a Schur-positivity theorem.

## Certified result

Use the complete theta profile, X,Y, and generalized old Rayleigh minimum ρ(P) defined in RHO_QUARTER.md. Consider the two fixed integer polynomials

p_even(z)=7,500,000+1,850,000z²+57,000z⁴+460z⁶+z⁸,
p_odd(z)=73,000,000z+5,900,000z³+105,000z⁵+600z⁷+z⁹.

The companion program certify_rho_fifth_mpfi.py, with 8000 cells and 160-bit directed MPFI arithmetic, encloses the complete integrals

J_5(p)=∫₀∞ [(Yp)²−(4/5)(Xp)²] dh

as follows, with outward-rounded display endpoints:

- Even: [203794744645.24564,207437069654.45367].
- Odd: [79634307051048.36,84111746962191.5].

Both lower endpoints are strictly positive. Therefore

(||Xp||²−||Yp||²)/||Xp||² <1/5

for each witness. By inclusion of this one fixed vector, ρ(P)<1/5 for every even old prefix containing all degrees 0,2,4,6,8, and every odd old prefix containing 1,3,5,7,9. This applies to every even new degree n≥10 and odd new degree n≥11. If the stipulated old target block is positive, then 0<ρ(P)<1/5.

The proof is a fixed-vector Rayleigh argument, not extrapolation of a finite scan. The result does not use positivity of any larger old target block to prove its upper bound; positivity is only used subsequently to define the inverse-dependent mismatch quantities.

## Complete-series and spatial-tail details

The argument in RHO_QUARTER.md applies with the following explicitly verified changes.

1. Derivatives through order 11 are used. The exact recurrence gives degrees at most13 and maximum absolute coefficient sum

378845846799141/2048 <2×10¹¹.

Thus for z≥1, each derivative orbit is bounded by 8×10¹¹ z¹⁴exp(−z).

2. For every omitted orbit m≥7, z≥3m²≥147. Since log147<5, one has 14log147<70<147/2; z/2−14logz is increasing for z>28. Therefore z¹⁴exp(−z)≤exp(−z/2), and the omitted sum is at most

16×10¹¹ exp(−73.5) <1.921×10⁻²⁰ <10⁻¹⁸.

The program sums m=1,...,6 and attaches the conservative uniform derivative error [−10⁻¹⁸,10⁻¹⁸].

3. The (p,p′) absolute coefficient sums are respectively

- Even: (9,407,461;3,930,768).
- Odd: (79,005,601;91,229,209).

All are <10⁸. For h≥3, each derivative has absolute bound 16×10¹¹exp(−(3/2)exp(2h)). Consequently the spatial energy density satisfies

|G²−(4/5)(2hF+G)²| ≤10⁴²(h+1)²exp(−3exp(2h)).

The same exp6>400 and (u+4)²≤16exp(u/2) argument gives absolute tail less than 10⁻⁴⁵⁰. The scalar comparison 10⁴²exp(−1200)/10⁻⁴⁵⁰ is bounded above by 7.025×10⁻³⁰.

4. The midpoint enclosure uses

f=G²−(4/5)X²,
f''=2[(G')²+GG'']−(8/5)[(X')²+XX''].

The .8 and 1.6 constants in the code are exact decimal inputs to MPFI. Cells and midpoint positions are rational intervals. Complete derivative tails are carried through every linear combination and every quadrature enclosure.

## Consequence for the proposed coupled estimates

If, independently, the actual theta mismatch obeys

C_XY≤(10/3)U,
U≤(11/20)√ρ Δ,
Δ=A_X−B_Y≥0,

then the exact formula 2S=Δ−C_XY yields

2S≥[1−11/(6√5)]Δ > (9/50)Δ for Δ>0.

The final rational comparison follows from (41/50)²>121/180. Alternatively the Cauchy/secant route gives UV≤(363/400)Δ². The direct comparison is stronger and avoids estimating V at all.

The two mismatch bounds are unproved. This certificate settles only their auxiliary ρ condition after the stated finite base degrees. It gives neither a lower conditioning bound nor a new original signed Schur pivot and does not establish or refute RH.
