# Tilted prime-power recurrence and exact divisor-variance cancellation

Date: 2026-11-03. Status: independent analytic audit PASS for identities, constants, convergence, frozen-polynomial scope, and boundary-kernel pairing. These are fixed-polynomial identities and domain statements, not an all-degree positivity theorem, a uniform selected-residual estimate, or a proof of RH. No literature-novelty claim is made.

## 1. Normalization and fixed-polynomial scope

Use the complete even theta profile and its Fourier transform

ψ(u)=Σ_{n≥1} n^(-1/2) f(u+log n),
f(u)=4 exp(u/2)(2z²−3z)exp(−z), z=πexp(2u),
F(z)=∫_R ψ(u)exp(izu)du=2ξ(1/2+iz).

The unreflected single orbit f is signed on part of the negative half-line. Do not replace it by a positive or reflected orbit.

Fix a real polynomial q of either parity. Set T_q=q(−iD_R/2)², a real even differential operator. For real a define

A_{f,a}(R)=∫_R exp(−2av) f(R+v)f(R−v)dv,
a_j(a)=T_q A_{f,a}((log j)/2),
d_a(j)=Σ_{nm=j}(n/m)^a.

The q coefficients are frozen when taking an a derivative. If q=q_n(a) is an actual inverse-selected residual, apply the following identities at each shift with those coefficients frozen. Differentiating the moving coefficients would add terms and is not authorized by these formulas.

Write
N_q(a)=∫_R q(t)²|F(t+ia)|²dt,
h_a[q]=∫_R q(t)²[−Im(F′(t+ia)conj(F(t+ia)))/a]dt,
with h_0[q]=∫q²(F′²−FF″).

The exact formulas are

N_q(a)=2π Σ_{j≥1} j^(−1/2)d_a(j)a_j(a),                     (1)
h_a[q]=(π/a) Σ_{j≥1}j^(−1/2)[d_a′(j)a_j(a)+d_a(j)a_j′(a)].  (2)

At a=0 use the even analytic continuation. The identity h=N′/(2a) fixes all constants.

Proof of (1): the shifted autocorrelation is

C_{q,a}(ω)=(1/2π)∫q(t)²|F(t+ia)|²cos(ωt)dt
          =T_q A_{θ,a}(ω/2),
A_{θ,a}(R)=∫exp(−2av)ψ(R+v)ψ(R−v)dv.

For an orbit pair nm=j, put w=v+(log n−log m)/2. This gives precisely the factor (n/m)^a, the common center R+(log j)/2, and hence

A_{θ,a}(R)=Σ_j j^(−1/2)d_a(j)A_{f,a}(R+(log j)/2), R≥0.

There is no zero-side or next-pivot input.

## 2. Arbitrary-prime recurrence, including the shift

Fix a prime p, L=log p, x=aL, and define

S_v(x)=Σ_{r=0}^v exp((2r−v)x)=sinh((v+1)x)/sinh x,
S_v(0)=v+1,
b_m=p^(−m/2)C_{q,a}(mL),
X_v=Σ_{p∤u}(p^v u)^(−1/2)d_a(u)a_{p^v u}(a).

Then the signed actual correlations obey

b_m=Σ_{v≥m}S_{v−m}(x)X_v,
b_m−2cosh(x)b_{m+1}+b_{m+2}=X_m.                         (3)

This is a genuine source-defined recurrence. It generalizes the recorded dyadic second difference, recovered at p=2,a=0. It does not close on positive quantities: the low-index X_m remain signed and contain the actual selected coefficients.

The polynomial generating series
Σ_{v≥0}S_v(x)t^v=(1−2cosh(x)t+t²)^(-1)
gives the elementary exact identity

S_v′(x)=2Σ_{m=1}^v sinh(mx)S_{v−m}(x).                    (4)

This identity is the cancellation mechanism in the next section. Finite exact-symbolic checks through v=12 are only sanity checks; the generating-series proof establishes arbitrary v.

## 3. Full signed prime correction equals a divisor derivative

For 0≤a<1/2 define the usual finite-Euler correction coefficients

c_{p,m}(a)=[2log p/a]p^(−m/2)sinh(ma log p),
c_{p,m}(0)=2m(log p)²p^(−m/2).

The full sum of already-integrated prime corrections is

D_q(a)=Σ_{p,m≥1}c_{p,m}(a)∫q(t)²|F(t+ia)|²cos(mt log p)dt.

It converges absolutely for each fixed q and a. Reindexing j=p^m k and applying (4) yields

D_q(a)=(2π/a)Σ_{j≥1}j^(−1/2)d_a′(j)a_j(a).               (5)

Indeed d_a is multiplicative, d_a(p^v)=S_v(a log p), and

Σ_{p^m|j}[2log p/a]sinh(ma log p)d_a(j/p^m)=d_a′(j)/a.

No trigonometric prime series has been passed pointwise to an infinite Euler product. The statement concerns its polynomial-weighted integrated coefficients.

## 4. Full sieve reverses the arithmetic term; half sieve cancels it

For a finite prime set P let
R_P(z)=∏_{p∈P}(1−2p^(−1/2)cos(z log p)+p^(−1)).
It has a nonvanishing analytic logarithm in |Im z|<1/2, chosen real on the real axis. For real θ put H_{P,θ}=R_P^θF on this strip. The exact product identity gives

S_{P,θ}[q;a]:=∫q² λ_a(H_{P,θ})/|R_P(t+ia)|^(2θ)
            =h_a[q]−θD_{P,q}(a).                         (6)

Thus, as P exhausts the primes, for each fixed q and compact shift interval strictly inside the strip,

lim S_{P,θ}[q;a]
 =(π/a)Σ_j j^(−1/2)[d_a(j)a_j′(a)+(1−2θ)d_a′(j)a_j(a)].   (7)

Consequences:
- θ=1, the full symmetric sieve, reverses the arithmetic divisor-derivative term.
- θ=1/2 removes that term exactly, leaving (π/a)Σj^(−1/2)d_a(j)a_j′(a).
- Neither formula gives a sign. In particular positivity of d_a does not give positivity of a_j′ or a_j.
- Equation (7) is a limit of integrated normalized source forms. It does not assert that an infinite Euler multiplier, its square root, or a nonzero limiting filtered transform exists.

At a=0 let
C_f(R)=∫v²f(R+v)f(R−v)dv,
c_j=T_q C_f((log j)/2),
d(j)=d_0(j), ell₂(j)=Σ_{nm=j}(log(n/m))².
Since a_j′(a)/a→4c_j and d_a′(j)/a→ell₂(j),

h_0[q]=4πΣ_jj^(−1/2)[d(j)c_j+ell₂(j)a_j(0)/4],
D_q(0)=2πΣ_jj^(−1/2)ell₂(j)a_j(0),
lim S_{P,1}=4πΣ_jj^(−1/2)[d(j)c_j−ell₂(j)a_j(0)/4],
lim S_{P,1/2}=4πΣ_jj^(−1/2)d(j)c_j.                       (8)

The factor of TWO in the full correction relative to the original arithmetic variance contribution is essential.

## 5. Unbounded support and interchange proof

For any fixed derivative order k, f^(k)(u) is a finite linear combination of exp(βu)exp(−πexp(2u)), with 5/2≤β≤9/2+2k. A differentiated pair at R=(log j)/2 therefore has exponential factor
exp[−2πj cosh(2v)]
and at most a fixed power of j times exp(B|v|). Differentiation in a only adds powers of v. For |a|≤A and fixed k,r,

|∂_a^r∂_R^k A_{f,a}((log j)/2)|
 ≤C_{k,r,A}j^(k+9/2)exp(−πj).                            (9)

One proof splits exp[−2πj cosh(2v)] into two factors, bounds one by exp(−πj), and dominates the other by exp[−πcosh(2v)]. The latter absorbs every fixed exp(B|v|)(1+|v|)^r on the entire real line. This treats both spatial ends and requires no compact-support truncation.

Also |∂_a^r d_a(j)|≤d(j)j^A(log j)^r. The relevant arithmetic sums are consequently dominated by polynomial/logarithmic factors times exp(−πj). This justifies all fixed-order derivatives, pair regroupings, and prime-power rearrangements above, uniformly for q in a compact coefficient set and a in a compact real interval. It proves fixed-degree absolute convergence without supplying an absolute estimate of the desired signed pivot.

The series-defined right side of (5), with its removable a=0 value, is meaningful for every finite real a and extends to a=1/2. Outside |a|<1/2 it is not automatically the normalized Euler-source quotient; see the boundary note.

Nothing in (9) is degree-uniform. Its constants depend on q and derivative order. Actual old inverse conditioning is retained in q, not bounded away by a positive-parent substitution.

### Exact Bessel representation (optional evaluation aid)

With Z=πexp(2R), direct integration also gives

A_{f,a}(R)=16exp(R)[(4Z⁴+9Z²)K_a(2Z)
 −6Z³{K_{a−1}(2Z)+K_{a+1}(2Z)}],                         (10)

where K is the modified Bessel function of the second kind (integral representation: https://dlmf.nist.gov/10.32#E9). To verify this, expand the product into 4Z⁴+9Z²−12Z³cosh(2v), then use the full-line integral representation of K. This is a signed exact expression, not a positivity claim. It permits direct evaluation of the arithmetic core without separate orbit-tail estimates.

## 6. What remains for the all-degree problem

For an actual inverse-selected residual, these identities preserve all old inverse coefficients and the complete signed prime/source correlations. They supply an exact recurrence and expose which arithmetic term the sieve removes or reverses. They do not prove h_a[q]≥0, the two-regression payment A_X≥B_Y+C_XY, or a degree-uniform hard-edge/inverse bound.

A genuinely new closing estimate would have to control the signed low-index X_m jointly with the source derivative terms in (2), uniformly for the actual selected family. Proving only the half-sieved source nonnegative would still require controlling the added-back D_q/2 with its actual sign. Eventual even/odd arithmetic tail signs do not control that low core.

## Sources and relation to existing work

All repository sources below are frozen to PR #40 head 6c6c81697fdc527d017dc592b55bea3efa5bb31b:
- checkpoint evidence/v27-v30-continuation/theta_correlated_local_v1/ARITHMETIC_CORE.md: exact midpoint divisor grouping.
- checkpoint evidence/v31-continuation/theta_correlated_local_v1/DYADIC_CORRELATION_RECURRENCE.md and DYADIC_RESIDUAL_PAYMENT.md: existing unshifted p=2 recurrence and variance identities.
- checkpoint evidence/prime-cancellation-checkpoint-2026-11-03/THETA_PRIME_CORRELATION_TAIL.md: existing fixed-degree complete-theta convergence.
- checkpoint evidence/v33-continuation/theta_correlated_local_v1/PRIME_SIEVE_BRIDGE_DEFECT.md: finite symmetric sieve identity and sign obstruction.
- checkpoint workstreams/all-degree-analytic-search-next-v1/PAID_SCHUR_NEXT.md: exact signed Schur complement and still-open mismatch payment.

Checkpoint root: https://github.com/judegomila/mathexplorer/tree/6c6c81697fdc527d017dc592b55bea3efa5bb31b/research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02
