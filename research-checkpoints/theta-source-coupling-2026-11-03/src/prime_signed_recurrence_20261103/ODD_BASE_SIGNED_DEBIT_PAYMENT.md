# Paying the signed prime debit at the first actual odd residual

Date: 2026-11-03. Status: analytic derivation independently audited; directed MPFI certificate PASS; independent byte-identical MPFI replay and separate mpmath.iv replay PASS. Explicit inherited dependency: the complete-theta source curvature bound −(log ψ)″>17. This is a finite-degree, uniform-shift theorem at an already-known positive rung, not a new ladder extension or RH result.

## 1. Result and exact scope

Let q(t)=t, the actual monic residual of the empty odd prefix. On 0≤a≤1/2 let D_t(a) be the full signed prime correction and let S_half[t;a] be the limit of the integrated normalized half-sieved source. At a=1/2 all arithmetic expressions use the paired Abel value, including the boundary lattice masses.

The prior exact identity and sign theorem give

h_a[t]=S_half[t;a]+D_t(a)/2,
J(a):=−D_t(a)/2>0,
S_half[t;a]=h_a[t]+J(a).                                         (1)

The independently bounded theta quantities below prove

0<J(a)<(6/7)S_half[t;a],
h_a[t]>(1/7)S_half[t;a]>0,
                             every 0≤a≤1/2.                     (2)

This pays a genuinely negative arithmetic contribution with a fixed fractional margin. It does not assume the desired sign of h_a[t]. It is restricted to the actual first odd residual: no bound for nonempty old prefixes, moving inverses, or arbitrary degree is asserted.

## 2. Independent complete-theta source reserve

Write v=−ψ′/ψ. The positive even complete theta profile obeys the separately established source inequality

v′(u)>17, all real u.                                           (3)

This is an inherited source-curvature theorem, not an inherited signed-pivot assumption. This note does not rerun its original proof; the research baseline THETA_CURVATURE_PAYMENT.md explicitly records k=(log ψ)″<−17 and its degree-one use. The related local recovery notes also record this full-theta bound.

For q=t, Parseval followed by integration by parts on the full real physical line gives

N_t(a)=2π∫exp(−2au)(ψ′−aψ)²du
      =π∫exp(−2au)v′ψ²du.                                      (4)

All boundary terms vanish by complete-theta superexponential decay. Since v′ψ² is even, differentiating with q fixed yields

h_a[t]=(π/a)∫_R u sinh(2au)v′(u)ψ(u)²du
       ≥(17/2)h_a[1],                                         (5)
h_a[1]≥4πI,  I=∫_R u²ψ(u)²du.                                 (6)

At a=0 use the continuous limits. These formulas hold at all finite real shifts; the Euler-domain restriction belongs only to the sieve interpretation.

An independent elementary source lower bound is certified by retaining the positive first orbit on the positive half-line:

I≥2∫_0^2 u²f(u)²du>0.03.                                      (7)

The factor of two uses complete-theta evenness; it does not reflect the signed single orbit outside this lower-bound construction. The omitted higher positive orbits and spatial tail only increase I.

Combining (5)-(7),

h_a[t]>(51/50)π>3, throughout 0≤a≤1/2.                          (8)

No next signed norm is used as an input to (4)-(8).

## 3. Independent uniform arithmetic debit bound

For q=t the preceding sign theorem proves a_j(a)<0 for all j≥2. Its exact Bessel polynomials are P_2,Q_2, with Q_2<0. For Z=πj≥2π and 0≤a≤1/2,

K_(a+1)(2Z)≥K_a(2Z),       K_a(2Z)≤K_(1/2)(2Z).

Moreover

∂_a(P_2+Q_2)
 =Z²[32aZ(Z−3)+240Z²+72a²+312a+330]>0.                          (9)

Consequently

0<−a_j(a)≤B_j,
B_j=2Z²[64Z⁴−480Z³+1264Z²−672Z+432]exp(−2Z).                    (10)

The right side retains the subtraction of the Bessel channels before bounding. Its positivity follows from the already-proved lower bracket, not a sign assumption on the target bridge.

Put ell₂(j)=Σ_(nm=j)(log(n/m))². Pairing the divisor logarithms and using sinh(x)/x≤cosh(x) gives

0<d_a′(j)/a≤ell₂(j)cosh((log j)/2), j≥2,                       (11)

including the removable value at a=0. The all-prime identity then yields the positive magnitude bound

|D_t(a)|≤U:=πΣ_(j≥2)(1+1/j)ell₂(j)B_j.                         (12)

The same actual q=t occurs in both source and correction. Because all these correction terms are negative, (12) does not discard unknown cancellation or replace the selected polynomial by an auxiliary one.

## 4. Exact finite core and complete arithmetic tail

The j=2,...,7 terms in U involve only π, integer arithmetic, logarithms, and exponentials. A directed 160-bit MPFI evaluation bounds their sum, and the following independent analytic estimate bounds every omitted index.

Since Z≥6,

B_j≤2[64Z⁶+1264Z⁴+432Z²]exp(−2Z)
    <200π⁶j⁶exp(−2πj).                                        (13)

Use ell₂(j)≤d(j)(log j)², d(j)≤j, (log j)²≤j, and 1+1/j≤2. Thus

πΣ_(j≥8)(1+1/j)ell₂(j)B_j
 ≤400π⁷Σ_(j≥8)j⁸exp(−2πj)
 ≤(4000/9)π⁷8⁸exp(−16π).                                      (14)

The consecutive-term ratio is bounded by (3/2)^8exp(−2π)<1/10 for j≥2. This follows already from π>3 and exp(3)>20.

The certificate gives

U<35.90627433796056<36.                                       (15)

The displayed decimal is an outward upper endpoint, not a floating guess. The exact live assertion in the script is U.upper()<36. No prime or arithmetic tail is left unbounded.

## 5. Correlated payment and why it is not an equivalent restatement

Equations (8),(15) give h_a[t]>3 and J(a)<18. Therefore J(a)<6h_a[t]. Keeping the exact relation S_half=h+J produces

7J<6S_half,
7h>S_half,

which is (2).

Merely hypothesizing D_t≥−2S_half would repeat h_a[t]≥0. The proof here instead supplies two independently checkable source facts: a curvature-and-positive-orbit reserve exceeding 3, and a Bessel/divisor debit below 18. They yield the stronger fixed fractional margin 1/7. Neither source fact is formulated using an unknown next pivot, and neither is equivalent to its sign.

This is not an all-degree closure: (4) is special to q=t; higher derivatives introduce additional signed terms, and an actual nonempty-prefix residual contains coefficients determined by the old inverse. No estimate controlling those terms or their conditioning is supplied. The result demonstrates a legitimate paid signed-debit method at the base odd rung only.

## 6. Certificate and provenance

- certify_odd_base_payment_mpfi.py uses 160-bit MPFI with directed MPFR endpoint extraction.
- 4000 interval rectangles cover [0,2]. Each endpoint is formed as an exact rational with interval division, and mpfi_union encloses the entire cell. The cell width is the exact rational 2/4000.
- The doubled first-orbit integral enclosure is [0.03107976388848985,0.03179365250485583]; its lower endpoint proves (7).
- The arithmetic tail upper endpoint is 3.3309247783702173×10^(−9).
- ODD_BASE_PAYMENT_CERTIFICATE.json records the assertions and scope.
- The complete-theta curvature theorem v′>17 is an explicitly inherited dependency and is not re-certified by this script.
- No target signed pivot, critical-line zeros, or finite spectral-height theorem is used in this calculation.

Research baseline source:
https://github.com/judegomila/mathexplorer/blob/6c6c81697fdc527d017dc592b55bea3efa5bb31b/research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/evidence/v31-continuation/theta_correlated_local_v1/THETA_CURVATURE_PAYMENT.md

Companions: TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md, EULER_BOUNDARY_ABEL_COMB.md, and ODD_BASE_ARITHMETIC_RESERVE_NO_GO.md.
