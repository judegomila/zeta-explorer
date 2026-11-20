# An aggregate half-source reserve for every odd real-rooted residual

Date: 2026-11-03. Status: independent analytic audit PASS for the contour identity, signs, constants, trigamma positivity, and real-rooted polynomial scope. This is a normalized-endpoint (a=0) source theorem. It does not pay the original full prime debit or prove an original Schur pivot positive. No literature-novelty claim is made.

## 1. New quantitative source estimate

Let q be any nonzero real odd polynomial whose roots are all real, with roots r_1,...,r_n counted with multiplicity. Let

Q=|q(i/2)|²>0,
R_q=Σ_(k=1)^n 1/(r_k²+1/4),
c_ξ=ξ′(1)/ξ(1)>0.

Use the exact complete-theta transform F(t)=2ξ(1/2+it), original endpoint bridge h[q]=∫q²(F′²−FF″), and integrated full-prime correction D_q. Its half-source is

S_half[q]=h[q]−D_q/2.

There is an explicit positive quantity P_q, defined in Section 4, for which

S_half[q]
 ≥P_q+[2π(2c_ξ+R_q)−2F(0)²]Q
 >P_q+(8π−2)Q>0.                                             (1)

The constant 8π−2 is independent of degree. The actual polynomial is retained in P_q, Q, and R_q. Its coefficients may come from an old signed inverse; none are replaced by a parent norm or bounded away.

This is a source lower bound after summing the complete arithmetic expression, not a termwise claim. It is consistent with the audited negative odd-prime source tail: the needed compensation occurs across indices and the pole contribution below.

## 2. Exact global arithmetic cancellation, including the pole term

Write

A(s)=(1/2)s(s−1)π^(−s/2)Γ(s/2),
ξ(s)=A(s)ζ(s),
H_q(s)=4ξ(s)² q(−i(s−1/2))².

For any fixed real definite-parity polynomial q, the full-prime correction equals

D_q=2Σ_(m≥2) Λ(m)log(m)m^(−1/2)
                ∫_R q(t)²F(t)²cos(t log m)dt.                  (2)

Here Λ(m) is the von Mangoldt function, so (2) includes every prime power with its exact coefficient. It is a convergent series of integrated correlations, not a pointwise Euler expansion on the critical line.

For each m the entire integrand H_q(s)m^(−s) can be moved from Re s=1/2 to a fixed c>1. Gamma decay handles both horizontal ends. On Re s=c the Dirichlet series converges absolutely, so

D_q=2∫_R H_q(c+it)(log ζ)″(c+it)dt.                            (3)

Before returning the contour, remove every apparent zeta-zero pole algebraically:

H_q(s)(log ζ)″(s)
 =4A(s)²q(−i(s−1/2))²[ζ(s)ζ″(s)−ζ′(s)²].                     (4)

No zero location is needed. In 1/2≤Re s≤c the only remaining pole is at s=1. Since (log ζ)″=(s−1)^(−2)+O(1), its residue is H_q′(1). The contour orientation therefore gives

D_q=2h[q]−2G_q+4πH_q′(1),
S_half[q]=G_q−2πH_q′(1),                                     (5)

where

G_q=∫_R q(t)²F(t)²g(t)dt,
g(t)=Re[(log A)″(1/2+it)].                                   (6)

The residue term is compulsory. Omitting it changes the aggregate source. All integrals converge on unbounded support for each finite polynomial degree.

## 3. Positive trigamma part and a compact adverse part

Let ψ_1 denote the trigamma function (not the theta profile). Its convergent series cancels the s=0 rational term and gives exactly

g(t)=r(t)+a_Γ(t),
r(t)=(t²−1/4)/(t²+1/4)²,
a_Γ(t)=(1/4)Re ψ_1(5/4+it/2)>0.                              (7)

A short proof of the last positivity is available without a numerical certificate. The reflection identity gives

Re ψ_1(1/2+iy)=π²/[2cosh²(πy)]>0.

The real part of ψ_1 is harmonic on Re z>1/2. The series Σ_(k≥0)(z+k)^(-2) implies ψ_1(z) tends uniformly to zero as |z|→∞ in that half-plane: large real part is controlled by Σ(Re z+k)^(-2), and large imaginary part by an integral majorant of Σ[(Re z+k)²+(Im z)²]^(-1). The minimum principle on expanding half-discs, followed by the strong minimum principle, proves Re ψ_1(z)>0 for Re z>1/2.

Thus the only possibly negative part of g lies inside |t|<1/2. No unbounded absolute spectral tail needs payment.

## 4. Positive aggregate source and compact debit

Define

P_q=∫_R q(t)²F(t)²a_Γ(t)dt
    +∫_(|t|≥1/2)q(t)²F(t)²r(t)dt>0,
C_q=∫_(|t|<1/2)q(t)²F(t)²[−r(t)]dt≥0.                        (8)

Then G_q=P_q−C_q exactly. Both quantities are source-defined and independent of the unknown original signed pivot.

Because q is odd and real-rooted, its roots occur as zero and real ± pairs. For |t|≤1/2,

q(t)²≤|q(i/2)|²=Q.                                            (9)

This follows factor by factor from t²≤1/4 and |t²−r²|≤r²+1/4, including repeated roots.

The positive complete-theta profile gives |F(t)|≤F(0)<F(i/2)=1. Also

∫_(−1/2)^(1/2)[−r(t)]dt
 =[t/(t²+1/4)]_(−1/2)^(1/2)=2.

Consequently

0≤C_q≤2F(0)²Q<2Q.                                            (10)

The original selected coefficients remain inside Q; no old-inverse estimate is needed for this bound.

## 5. The pole contribution supplies a degree-independent reserve

Since ξ(1)=1/2 and q is odd with symmetric real roots,

H_q(1)=q(−i/2)²=−Q,
H_q′(1)=−Q[2c_ξ+R_q].                                        (11)

Indeed q′/q at −i/2 is (i/2)Σ1/(r_k²+1/4). The mandatory zero root gives R_q≥4. The complete-theta positive bilateral Laplace representation gives ξ′(1)>0 directly, so c_ξ>0 without a zero-location assumption. Equivalently c_ξ=1+γ/2−log 2−(1/2)log π.

Substitute (8),(10),(11) into (5) to obtain (1). This bound is genuinely independent of h[q]≥0: its proof uses only positive theta profile, the known pole, elementary root geometry, and the archimedean factor.

## 6. Exact selected-residual assumptions and the old inverse

For an original monic selected degree-n polynomial, positivity of the FULL old Hankel moment block through degrees 0,...,n−1 implies that its roots are real and simple via the compressed multiplication/Jacobi matrix. No positivity of the new degree-n pivot is required. Symmetry then makes it an odd polynomial when n is odd, so (1) applies.

Positivity of only the old odd-parity block is insufficient to infer real roots in t: the roots in t² may not be positive. For n=2m+1, the required full old positivity includes odd degrees 1,...,2m−1 and even degrees 0,...,2m.

If q=p−vᵀA⁻¹b is that original residual, its exact inverse dependence remains visible as

Q=|p(i/2)−v(i/2)ᵀA⁻¹b|².

When the half-source old block is also positive, the audited Schur transport identity gives S_half[q]=s_half+M_half. Hence (1) bounds that COMBINED reselected source and actual mismatch; do not add M_half a second time. If the half-source old block is not positive, S_half[q] still exists and obeys (1), but that positive-regression interpretation is unavailable.

For a polynomial reselected in the half-source metric, (1) applies directly only if its own real-root property is independently supplied, for example by positivity of its full old Hankel block. Original-prefix positivity does not automatically supply that separate source-prefix hypothesis.

## 7. What is still required to prove the original signed pivot

The exact identity remains

h[q]=S_half[q]+D_q/2.

Equation (1) supplies a new independently positive aggregate reserve. A sufficient further estimate would be

max(−D_q/2,0)
 ≤ P_q+[2π(2c_ξ+R_q)−2F(0)²]Q,                              (12)

with a strict margin when needed. This is stated only as a sufficient research target, NOT as a proved inequality or even a justified all-degree conjecture. It is stronger than merely rewriting the original sign because its right side is a separately proved lower bound for the source.

No all-degree bound (12) is established. The result does not assert positivity of the original theta bridge, RH, an all-shift extension, or positivity for arbitrary non-real-rooted polynomials. It supplies the aggregate source side of the still-open paid comparison at a=0.

## 8. Checks and primary sources

The contour formula was independently audited. A separate ordinary quadrature diagnostic for q=1 and q=t agrees with the prior divisor-kernel source evaluations; it is not used in the proof and is not an interval certificate.

Primary formulas used:
- Xi definition and functional equation: https://dlmf.nist.gov/25.4.
- Zeta's pole and Laurent expansion: https://dlmf.nist.gov/25.2.
- Trigamma series, recurrence, and reflection: https://dlmf.nist.gov/5.15.

Baseline: draft PR #40, https://github.com/judegomila/mathexplorer/pull/40, head 6c6c81697fdc527d017dc592b55bea3efa5bb31b. Companion exact arithmetic definitions: TILTED_ALL_PRIME_DIVISOR_RECURRENCE.md.
