# Complete-theta H3 certificate: one more derivative channel

Date: 2026-11-02. **Finite-order theorem, not RH.** Independent mathematical review and full interval replay passed; see ../latest_bounds_audit/H3_AUDIT.md.

## Result

For the complete theta profile ψ and bridge C_a in the original sphere note,
for every real a>0,

C_a''(0) C_a^(6)(0) − C_a^(4)(0)^2 > 2,672,672 C_a(0)^2.

Together with the independently audited H2 theorem this proves H3(a) positive definite for every positive shift. It does not prove H4 or an order-uniform statement.

## Exact reduction

Write ell=logψ, X=−ell'', Y=ell^(4), Z=−ell^(6), and normalize the positive weight h sinh(2ah) ψ(h)^2 dh to probability ρ_a. Put B=Y+6X² and D=Z+30XY+60X³. Direct Taylor expansion of
ψ(h−v)ψ(h+v)=ψ(h)^2 exp(ell''v²+ell^(4)v⁴/12+ell^(6)v⁶/360+...)
gives

C2/C0=−2 E X; C4/C0=2 E B; C6/C0=−2 E D.

Define the pointwise polynomial

P = XZ +18X²Y +24X⁴ −Y² = XD−B².

Below we prove X>17 and P>8X⁴ on h≥0. Thus D=B²/X+P/X>0. Weighted Cauchy–Schwarz gives

(E X)(E D)−(E B)² ≥ (E X) E(P/X) > 8(E X)(E X³) > 8·17⁴.

Multiplication by 4C0² gives the displayed determinant reserve. In particular −C6>0 as well as −C2>0. The even block is H2's even block, and the odd 2×2 block is now positive definite.

## Compact-domain interval proof: 3≤z≤16

Here z=π exp(2h), so the actual compact domain is included in this larger interval. Write

ψ = constant · z^(5/4) e^(−z) S(z),
S(z) = Σ_{n≥1} n²(2n²z−3)e^{−(n²−1)z}.

For k=0,...,6 and d=n²−1, the n-th summand's k-th ordinary z derivative is

n² e^(−dz) [ (−d)^k(2n²z−3) + 2k n²(−d)^(k−1) ],

with the second term omitted at k=0. Its absolute value is at most
n^(2k+4)(2z+2k)e^{−(n²−1)z}.

Keep n≤6 exactly. The successive-term ratio in the positive bound for n≥7 is at most (8/7)^16 e^(−15z)<1/2. Therefore the complete omitted tail of each derivative is bounded by

T_k(z)=2·7^(2k+4)(2z+2k)e^(−48z).

The implementation includes [−sup T_k,+sup T_k] in every S derivative. It computes ordinary log derivatives recursively from S'=S L', then uses

(2z∂z)^k logψ = 2^k [−z + Σ_{j=1}^k Stirling2(k,j) z^j L^(j)]  (k=2,4,6).

The 5/4 logz term contributes zero at these orders. Each of 13,000 rational cells [3+i/1000,3+(i+1)/1000] is enclosed using outward interval arithmetic at 45 decimal digits. All pass X>17 and P−8X⁴>0. The script and exact parameter choices are `certify.py`; completed output is `certificate.json`. The recorded decimal minima are diagnostics, not the rational theorem constants. The theorem constants 17 and 8 are the explicit interval comparisons.

This is an infinite-tail-enclosed computational certificate, not a finite sample plot or a formal proof-assistant certificate. mpmath's arbitrary-precision interval arithmetic is the numeric trusted base.

## Analytic half-line proof: z≥16

Factor ψ=f1(1+r), where r is the exact full theta-tail ratio. For complex |w|≤1/64 around real h, put z'=z exp(2w). Elementary exponential/cosine estimates imply

Re z' > (15/16)z,   |z'| < (17/16)z.

For example exp(−1/32)>31/32, cos(1/32)>2047/2048 and their product exceeds15/16; exp(1/32)<32/31<17/16. Thus

|n²(2n²z'−3)/(2z'−3)| ≤ (37/27)n⁴ <2n⁴.

Consequently

|r(h+w)| ≤2Σ_{n≥2} n⁴ exp[−15(n²−1)] <64 exp(−45) <2^(−54).

The geometric tail ratio is at most (3/2)^4 exp(−75)<1/2. Also exp(3/4)>2 by its first four Taylor terms, hence exp45>2^60. The analytic logarithm q=log(1+r) is therefore bounded by 2^(−53) on this disk. Cauchy's estimate gives, for k≤6,

|q^(k)(h)| < k!64^k 2^(−53) ≤720/2^17 <1.

The first summand has log, up to affine terms,

log f1 = −z + log(1−3/(2z)) + affine(h).

Set t=3/(2z)≤3/32. Its even derivatives give

−(log f1)'' =4z+4Σ_{j≥1} jt^j ≥4z,
(log f1)^(4)=−16z−16Σ_{j≥1} j³t^j,
−(log f1)^(6)=64z+64Σ_{j≥1} j⁵t^j ≥64z.

Since 16Σj³(3/32)^j=2,176,512/707,281<4, adding q gives

X>4z−1≥63; |Y|<16z+5≤5X; Z>64z−1>0.

Hence

P ≥24X⁴−90X³−25X² >22X⁴,

because 24−90/63−25/63²>22. This completes the unbounded half-line without a cutoff assumption.

## Limits and provenance

This argument does not infer global positive definiteness from H3. The all-order hierarchy remains open. The new method uses a pointwise sufficient condition, potentially stronger than integrated H3 positivity; success at this order does not justify assuming it persists. The source definition and target are from the originating private research thread (conversation and message identifiers redacted for repository publication). All code in this folder was independently authored; no downloaded research checker was executed.
