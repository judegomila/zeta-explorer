# The odd half-source loses its positive reselection domain at every interior shift

Date: 2026-11-03. Status: independent analytic audit PASS. This is an unconditional theorem about the HALF-SOURCE form, not the original signed bridge. It supplies no negative original Schur pivot and no RH conclusion. No numerical search or finite pivot computation is used.

## 1. Classification

For every fixed 0≤a<1/2, there is a finite-degree real odd polynomial q with

S_half[q;a]<0.

In fact the half-source has INFINITE NEGATIVE INDEX: for every positive integer m, some finite odd polynomial subspace of dimension m is negative definite. Consequently finite odd half-source moment blocks have unbounded negative inertia. Its positive-definite reselection domain cannot persist through all degrees at any interior shift. A second independent proof of this stronger statement appears in Section 7.

At the paired Abel endpoint a=1/2, by contrast,

S_half[q;1/2]>0

for EVERY nonzero real odd polynomial q. Thus every fixed finite odd half-source block stays positive sufficiently near that endpoint, while the degree needed for the interior obstruction must escape to infinity as a approaches 1/2.

The negative interior witnesses are not real-rooted. They do not contradict the all-degree reserve established for odd real-rooted q.

## 2. A joint imaginary-interpolation lemma

Let W(t)=exp(−κ|t|), with κ=π/4, and let V_N consist of real odd polynomials of degree at most 2N+1. All norms below use ∫q²W on the full real line.

For b>0 define real functionals

E_b(q)=q(ib)/i,     B_b(q)=q′(ib).

Two collections of functionals will be used:

(a) E_b and B_b for a single b>0;
(b) E_b1 and E_b2 for distinct positive b1,b2.

No nonzero real linear combination of either collection is bounded on the odd polynomials in L²(W). To see this, a bounded combination would have a Riesz representative g. Taylor approximation of sin(st) for small s and then holomorphic continuation in a horizontal strip would identify its real-axis sine transform with, respectively,

α sinh(bs)+β s cosh(bs),
α sinh(b1 s)+β sinh(b2 s).

The transform ∫sin(st)g(t)W(t)dt is bounded for all real s by Cauchy–Schwarz. Each displayed expression is unbounded unless α=β=0. This is a contradiction. Taylor convergence and holomorphy follow from the positive exponential moment of W; no moment determinacy theorem is assumed.

For completeness, choose an orthonormal basis of each V_N nested with N, write the two evaluation vectors as a 2-by-(N+1) matrix L_N, and put K_N=L_N L_Nᵀ. Once the two functionals are independent on V_N, K_N is positive definite. The matrices increase in Loewner order, and

lambda_min(K_N)→infinity.

Otherwise a subsequence of unit vectors c_N with c_NᵀK_Nc_N bounded would have a unit limit c. For every fixed M, cᵀK_Mc would be bounded by the same constant. That makes the nonzero combination c of the functionals bounded on the whole polynomial space, contradicting the preceding argument.

Therefore, for every prescribed pair y of values, the minimum norm squared subject to L_N q=y is

yᵀK_N^(−1)y→0.

In particular, one can impose either pair of imaginary-point constraints exactly while making the full real-axis weighted norm tend to zero. Every member of the approximating sequence is a finite polynomial. This is a joint interpolation statement, stronger than unboundedness of each individual evaluation separately.

## 3. Exponential domination of the archimedean integral

For each fixed 0≤a<1/2, the exact source identity writes its real-axis term as

G_(q,a)=∫q(t)² |F(t+ia)|² g_a(t)dt.

The gamma factor in F(t+ia)=2ξ(1/2−a+it), together with fixed-strip zeta bounds, gives

|F(t+ia)|²|g_a(t)|≤C_a exp(−κ|t|)=C_a W(t)

for a finite constant C_a. The rational poles in g_a are off the real axis for each interior a; the density is bounded near zero. At infinity the exponential factor is exp(−π|t|/2), faster than W. Consequently ||q_N||_W→0 implies G_(q_N,a)→0.

There is also a direct complete-theta justification. The theta profile extends analytically to |Im u|<π/4. Its orbit sum decays doubly exponentially on each horizontal line as Re u→+infinity, and evenness gives the corresponding negative-end decay. Shifting the Fourier contour to height +v or −v according to the sign of t, with π/8<v<π/4 gives |F(t+ia)|≤C_(a,v)exp(−v|t|). This again dominates W after squaring. Polynomially weighted transforms and their needed derivatives obey the same argument.

The constants here are fixed for each shift. They are not asserted uniform as a approaches 1/2, and no varying-degree estimate is silently inserted: the interpolation norms themselves tend to zero.

## 4. Negative witnesses at zero shift

Put b=1/2, E=E_b(q), B=B_b(q), and c_ξ=ξ′(1)/ξ(1). The exact contour identity of AGGREGATE_ODD_HALFSOURCE_RESERVE.md gives

S_half[q;0]=G_(q,0)−2π H_q′(1),
H_q(s)=4ξ(s)²q(−i(s−1/2))².

Because q is odd and real,

H_q′(1)=−2c_ξ E²−2EB,
S_half[q;0]=G_(q,0)+4π(c_ξ E²+EB).

Use Section 2 to impose E=1 and B=−1 while ||q_N||_W→0. Then

S_half[q_N;0]→4π(c_ξ−1)
             =2π[gamma_Euler−log(4π)]<0.

The final strict inequality follows, for example, from gamma_Euler<1 and log(4π)>1. An alternative avoiding any bound on c_ξ is to prescribe B=−c_ξ−1, giving limit −4π exactly.

Thus a strictly negative finite-degree witness exists at a=0. The formula retains the compulsory pole derivative; omitting it would erase this obstruction.

## 5. Negative witnesses at every strictly interior positive shift

Fix 0<a<1/2 and put b_±=1/2±a, both strictly positive and distinct. The audited all-shift contour identity gives exactly

S_half[q;a]=G_(q,a)
 +(2π/a)[ξ(1+2a)E_(b_+)(q)²−ξ(1−2a)E_(b_-)(q)²].

Use Section 2 to impose

E_(b_+)(q_N)=0,     E_(b_-)(q_N)=1,
||q_N||_W→0.

It follows that

S_half[q_N;a]→−(2π/a)ξ(1−2a)<0.

The positivity of ξ at real arguments follows directly from the positive complete-theta Laplace representation. No assumption on the positions of its complex zeros is used.

The negative pole contribution is retained intact, and its correlation with the positive pole is controlled by exact interpolation, not by an absolute tail estimate. These polynomials have a zero at ib_+ and cannot be real-rooted, as expected.

## 6. The exceptional Abel endpoint

At a=1/2, the negative imaginary evaluation moves to zero. Oddness gives q(0)=0. The archimedean rational part converges distributionally as

r_a(t)→1/(1+t²)−π delta_0.

The odd polynomial also kills this delta term. Using the paired integrated Abel value throughout,

S_half[q;1/2]
 =∫q(t)² |F(t+i/2)|²[1/(1+t²)+k_(1/2)(t)]dt
  +4πξ(2)|q(i)|²,

where

k_(1/2)(t)=(1/2)Re[digamma(3/2+it/2)−digamma(1+it/2)]>0.

The integral is strictly positive for every nonzero q: its weight is positive except possibly at the isolated zeros of the nonzero entire transform. All integrals are finite for every finite polynomial degree. The pole term is nonnegative. This proves endpoint positive definiteness on all odd polynomials.

For any fixed finite odd degree block, the integrated arithmetic moments depend continuously on a up to the Abel endpoint. Its smallest eigenvalue is positive there, and therefore remains positive in some one-sided neighborhood. This proves the escape-to-infinity statement about obstruction degrees without claiming a rate.

Do not confuse the vanishing odd-weight archimedean delta with the prime-lattice Abel combs. Those still belong to the original paired arithmetic correction and cannot individually be discarded.

## 7. Stronger second proof: infinite negative index

For every fixed 0≤a<1/2, the archimedean density is strictly negative near the real origin. Indeed

g_a(0)=−1/(1/4−a²)+k_a(0),
k_a(0)≤(1/4)trigamma(1)=π²/24,

because k_a is one quarter of an average of the decreasing positive trigamma function at real arguments at least one. Thus

g_a(0)≤−4+π²/24<0.

Continuity gives a nonempty interval around zero on which g_a<0. Also F(ia)>0, so the transform has no zeros on a sufficiently small such interval.

Set

R_a(x)=(x+b_+²)(x+b_-²),
q(t)=t R_a(t²) P(t²),

with P any real polynomial. At a=0 both factors coincide; this is harmless. Every imaginary-pole contribution to the source vanishes exactly, including the pole derivative at zero shift. Hence S_half[q;a]=G_(q,a).

Define the positive even measure

dμ_a(t)=t² R_a(t²)² |F(t+ia)|² |g_a(t)|dt.

It has an exponential moment by Section 3, and its density is positive on small punctured intervals around zero. Even polynomials P(t²) are dense in the even subspace of L²(μ_a). A direct proof is as follows: an even orthogonal-complement function would yield a finite signed measure with an analytic cosine transform in a horizontal strip and all derivatives zero at zero. The identity theorem and uniqueness of the Fourier transform force that function to vanish. Exponential moments justify the derivatives and holomorphy via Cauchy–Schwarz.

On this pole-killing polynomial subspace,

S_half[q;a]=∫P(t²)² sgn(g_a(t))dμ_a(t).

For any m, choose m even orthonormal functions supported on disjoint symmetric subintervals where g_a<0. Their signed Gram matrix is exactly −I_m. Approximate them in L²(μ_a) by even polynomials. Multiplication by sgn(g_a) has operator norm at most one, so the signed Gram matrices converge to −I_m. Sufficiently accurate finite polynomial approximants therefore span an m-dimensional negative-definite subspace. All have a common finite maximum degree.

This proves infinite negative index without the jet interpolation argument. It neither locates the first negative degree nor supplies a quantitative rate as a approaches 1/2. The imaginary-pole factors explicitly prevent these witnesses from being real-rooted, so there is no conflict with the aggregate real-rooted reserve.

## 8. Consequence for the inverse-preserving transport strategy

At a given degree let A be the positive original old block, E its arithmetic correction block, and A_(1/2)=A−E/2 the half-source old block. The earlier transport identity using A_(1/2)^(−1) and a nonnegative mismatch requires A_(1/2)>0.

This theorem shows that, at every fixed a<1/2, that positivity domain fails at some finite degree irrespective of whether the original bridge stays positive. Hence no proof may assume that the HALF-SOURCE reselection remains positive through all degrees at such a shift. The whitened condition lambda_max(A^(−1/2)EA^(−1/2))<2 must eventually fail if A itself remains positive at all those degrees. At a block with a strictly negative source direction, the largest whitened eigenvalue is strictly greater than 2. More strongly, if original blocks remain positive, Sylvester inertia under the congruence A_(1/2)=A^(1/2)(I−K/2)A^(1/2) shows that the number of eigenvalues of K=A^(−1/2)EA^(−1/2) strictly above 2 is unbounded along the prefixes.

This is a genuine obstruction, not an equivalent restatement of the original Schur sign. It concerns a different explicitly computed form and is proved by unconditional interpolation and contour identities. If A itself fails before then, the source-domain conclusion remains valid, but that failure is not proved or inferred here.

The fixed-original-residual source bound remains valid when that residual is odd and real-rooted. Thus an alternative proof could still work with the fixed original q and its exact inverse coefficients, or another source, without assuming an all-degree positive half-source reselection. No paid original-residual inequality is established in this note.

## 9. Evidence and provenance

Independent audit checked the pole-jet constants, the joint functional argument, the least-eigenvalue argument, exponential domination, and the interior/endpoint classification. A separate independent audit of the stronger second proof checked the negative density bound, exact pole killing, exponential-moment density, finite Gram approximation, and infinite negative inertia conclusion. This result is analytic; there is no claimed explicit obstruction degree or numerical certificate of one. It does not rely on the origin certificate F(0)>0.99 or any finite RH verification.

Companion identities: ALL_SHIFT_AGGREGATE_ODD_RESERVE.md; AGGREGATE_ODD_HALFSOURCE_RESERVE.md; NONEMPTY_PREFIX_PAID_DEBIT_BARRIER.md. Primary standard formulas: https://dlmf.nist.gov/5.11, https://dlmf.nist.gov/25.4, https://dlmf.nist.gov/5.15. Research baseline: https://github.com/judegomila/mathexplorer/pull/40, frozen head 6c6c81697fdc527d017dc592b55bea3efa5bb31b. No GitHub state or live 4CT code was changed.
