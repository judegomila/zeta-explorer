# A degree-uniform aggregate odd half-source reserve throughout the critical shift interval

Date: 2026-11-03. Status: independent analytic audit PASS; directed MPFI origin certificate PASS; independent MPFI and mpmath.iv certificate replays PASS. This bounds the complete integrated half-source, not the original signed Schur complement. The remaining arithmetic-debit comparison is unproved.

## 1. The estimate

Let q be any nonzero real ODD polynomial with only real roots. It need not have a bounded degree or bounded coefficients. For each fixed 0≤a≤1/2, keep q frozen in shift derivatives and put

Q=|q(i/2)|²>0.

Let S_half[q;a] denote the limit of the integrated normalized half-sieved source, equivalently h_a[q]−D_q(a)/2. The full prime correction D_q is defined by its convergent integrated correlations; at a=1/2 use the paired Abel value.

There is an explicit positive weighted integral P_(q,a), defined below, such that

S_half[q;a] ≥ P_(q,a)+π[8F(0)−1]Q
             >P_(q,a)+(173π/25)Q>0,
                           every 0≤a≤1/2.                     (1)

The second inequality uses the independently certified source fact F(0)>99/100. The coefficient 173π/25 is independent of BOTH polynomial degree and shift. Its normalization is fixed by F(t)=2ξ(1/2+it).

This is an aggregate cross-index result. It does not assign a favorable sign to individual odd prime/divisor terms, which can be negative and asymptotically dominate their matching source terms.

## 2. Entire test function and exact residue identity

For 0<a<1/2 define

H_(q,a)(s)=4ξ(s−a)ξ(s+a)q(−i(s−1/2))²,
L_ζ(s)=−ζ′(s)/ζ(s),
γ_A(s)=A′(s)/A(s),
A(s)=(1/2)s(s−1)π^(−s/2)Γ(s/2).

On Re s=1/2, H=q(t)²|F(t+ia)|². Shifting each prime-power correlation to a fixed vertical line c>1+a permits the absolutely convergent Dirichlet series to be summed there. The complete correction is

D_q(a)=(1/a)∫_(Re s=c)H_(q,a)(s)
                    [L_ζ(s−a)−L_ζ(s+a)]dt.                    (2)

Every apparent pole at a zeta zero cancels against the corresponding xi factor BEFORE the contour is returned. No information about zero locations is used. The only poles crossed are at s=1+a and s=1−a, with residues respectively H(1+a)/a and −H(1−a)/a. Gamma decay, after canceling the denominators algebraically, handles the horizontal ends for every fixed polynomial.

Hence

D_q(a)=2h_a[q]−2G_(q,a)
       +(2π/a)[H_(q,a)(1+a)−H_(q,a)(1−a)],
S_half[q;a]=G_(q,a)
       −(π/a)[H_(q,a)(1+a)−H_(q,a)(1−a)].                     (3)

Here

G_(q,a)=∫_R q(t)²|F(t+ia)|²g_a(t)dt,
g_a(t)=Re{[γ_A(1/2+a+it)−γ_A(1/2−a+it)]/(2a)}.              (4)

Both known pole terms are compulsory. This is a limit of integrated forms, not a statement that an infinite Euler multiplier exists.

## 3. Positive archimedean part and explicitly bounded compact debit

The digamma recurrence gives

γ_A(s)=1/(s−1)−(1/2)log π+(1/2)ψ_digamma(s/2+1).

Set b_±=1/2±a. Then

g_a(t)=r_a(t)+k_a(t),
r_a(t)=[t²−(1/4−a²)]/[(t²+b_+²)(t²+b_-²)],
k_a(t)=Re{[ψ_digamma(5/4+a/2+it/2)
          −ψ_digamma(5/4−a/2+it/2)]/(4a)}>0.                  (5)

The final inequality follows because k_a is one quarter of an average of real parts of trigamma at real part at least 1. Positivity of Re ψ_1(z) on Re z≥1/2 follows from its reflection formula on the boundary, its uniform decay at infinity in the half-plane, and the harmonic minimum principle. The endpoint note AGGREGATE_ODD_HALFSOURCE_RESERVE.md gives the details.

Only the rational part can be negative, and only on

|t|<sqrt(1/4−a²)≤1/2.

Its entire negative mass is exactly

∫_R(−r_a(t))_+dt=arcsin(2a)/a≤π.                              (6)

One way to verify (6) is to write
r_a=[b_+/(b_+²+t²)−b_-/(b_-²+t²)]/(2a)
and evaluate between the two zeros ±sqrt(b_+b_-). The continuous value at a=0 is 2.

Define positive source quantities

P_(q,a)=∫q²|F_a|²[k_a+(r_a)_+]dt>0,
C_(q,a)=∫q²|F_a|²(−r_a)_+dt≥0.                               (7)

Then G=P−C exactly. Since q is odd and real-rooted,

q(t)²≤Q on |t|≤1/2.

The positive complete-theta profile gives
|F(t+ia)|≤F(ia)≤F(i/2)=1. Consequently

C_(q,a)≤πQ,
G_(q,a)≥P_(q,a)−πQ.                                         (8)

No unbounded absolute spectral tail is used: the sole adverse archimedean part has compact support, and all remaining spectral weights in P are positive.

## 4. The two pole evaluations provide the reserve

For b≥0 write Q(b)=|q(ib)|². Since q is an odd real-rooted polynomial, Q(b) is a polynomial in b² with nonnegative coefficients and no constant term. In particular,

[Q(1/2+a)−Q(1/2−a)]/a≥8Q(1/2).                              (9)

For each monomial b^(2k), the binomial difference has positive terms and its linear term alone is 8k(1/2)^(2k), at least 8(1/2)^(2k). Thus (9) is exact at every degree; it imposes no coefficient bound.

The residue evaluations are

H_(q,a)(1±a)=−2ξ(1±2a)Q(b_±).                               (10)

The positive theta Laplace representation proves, without RH,

ξ(σ)≥ξ(1/2)=F(0)/2 for all real σ,
ξ(1+2a)≥ξ(1−2a).

It follows that

−[H(1+a)−H(1−a)]/a
 ≥ F(0)[Q(b_+)−Q(b_-)]/a
 ≥ 8F(0)Q.                                                   (11)

Combining (3),(8),(11) proves the first inequality in (1).

## 5. Independent elementary source certificate

For u≥0 every complete-theta orbit is positive. Therefore

F(0)=∫_Rψ(u)du≥2∫_0^2 f(u)du,

where f is the exact positive first orbit on u≥0. The owned 160-bit MPFI script certify_transform_origin_mpfi.py uses 8000 rational-endpoint interval hulls on [0,2]. Its directed result is

2∫_0^2f(u)du ∈ [0.991782978867897, 0.9960169392008925].

The exact live assertion is lower_endpoint>0.99. All omitted higher orbits and the spatial tail are positive, so no negative omission needs a tail allowance. This proves F(0)>99/100 independently of any signed pivot or zero theorem.

TRANSFORM_ORIGIN_CERTIFICATE.json records the complete scope and result. Independent inspection and replay reproduced it byte-for-byte (TRANSFORM_ORIGIN_AUDIT_REPLAY.json). A separately factored 50-digit mpmath.iv replay also proves the lower bound; its result is saved in TRANSFORM_ORIGIN_INDEPENDENT_IV_REPLAY.txt. This small source certificate is the only numerical input to the uniform coefficient in (1); the analytic bound with π(8F(0)−1) is exact without substituting a decimal.

## 6. Endpoint conventions

At a=0, use the continuous frozen-polynomial limits. The sharper endpoint reserve in AGGREGATE_ODD_HALFSOURCE_RESERVE.md is compatible with, and stronger than, this uniform bound.

As a increases to 1/2,

r_a → (1+t²)^(−1)−πδ_0

as a distribution. The odd polynomial has q(0)=0, so its weighted delta contribution vanishes. Equivalently, take the continuous limit of the already-convergent arithmetic form. The full prime Abel correction still retains its separate prime-lattice contributions; this vanishing archimedean delta does NOT authorize deleting those other lattice terms.

P_(q,1/2) is the finite limiting positive integral. Inequality (1) follows by continuity; a direct pointwise boundary Euler quotient is never substituted. No bounded-coefficient family assumption is required because the argument applies pointwise to each chosen polynomial at each shift.

## 7. Actual selected coefficients and the unresolved debit

For a selected odd degree-n residual q=p−vᵀA⁻¹b, positivity of the FULL original old Hankel block on degrees 0,...,n−1 guarantees real simple roots without assuming the new pivot. Under that induction hypothesis, (1) applies with

Q=|p(i/2)−v(i/2)ᵀA⁻¹b|².

This retains the actual old-inverse conditioning. Odd-block positivity alone is not enough to guarantee real roots in t.

When the half-source old block is positive, the audited transport identity gives S_half[q]=s_half+M_half. Thus (1) controls the combined reselected source AND actual regression mismatch. Do not add M_half again. For a source-reselected polynomial itself, real-rootedness must come from its own adequate full old source prefix or another independent proof.

The original target remains

h_a[q]=S_half[q;a]+D_q(a)/2.

A sufficient further estimate would bound the negative part of D_q(a)/2 by the right side of (1). NO SUCH ALL-DEGREE DEBIT BOUND IS PROVED HERE. Evenness/oddness, real roots, and the positive source estimate do not by themselves supply it.

This result establishes an independent degree-uniform aggregate reserve, survives the matching-prime tail obstruction through global contour cancellation, and identifies a concrete positive budget containing all selected coefficients. It is not RH, a new original ladder rung, or a claim that the original Schur complement is nonnegative.

Primary sources: https://dlmf.nist.gov/25.4, https://dlmf.nist.gov/25.2, https://dlmf.nist.gov/5.15. Research baseline: https://github.com/judegomila/mathexplorer/pull/40, frozen head 6c6c81697fdc527d017dc592b55bea3efa5bb31b. Companion arithmetic normalization: TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md.
