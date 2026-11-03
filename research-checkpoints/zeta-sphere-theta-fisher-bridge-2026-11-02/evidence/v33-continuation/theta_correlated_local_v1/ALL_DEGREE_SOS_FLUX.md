# Exact all-degree flux construction and the factorial signed remainder

Status: independent analytic review PASS. The polynomial flux degree bound is established for the canonical signed normal form. A nonnegative all-degree remainder is NOT established.

Use the audited localized theta module: P_j=y T_j, mu=A^(1/2)y², 2/5<T0<2, Ghat=∂_L+V+b, b=9x/2+4z, and
Ghat(T_j T_k)=(T_(j+1)T_k+T_j T_(k+1))/2.
The actual shift here is the normalized a=0 bridge. No positive-shift extension is claimed.

## 1. An explicit flux for every degree, retaining all deletions

Let p be a real monic parity polynomial of degree n with real roots r_j counted with multiplicity, and q_j=p/(t−r_j). Actual inverse-selected polynomials satisfy the needed hypotheses from the known positive prefix. Introduce formal X,Y and W=X+Y, a=(X−Y)/(2i). Let J map X^jY^k to T_j T_k, preserving coefficients and powers of L. Then

Ghat J(R)=J[(∂_L+W/2)R].                                  (1)

Define the polynomial quantities

D2=(p(iX)p(−iY)−p(a)²)/2,
D0=−Σ_j q_j(iX)q_j(−iY).

The exact deletion sum can instead be formed without locating roots by the Bezout polynomial
Σ q_j(s)q_j(t)=[p'(s)p(t)−p(s)p'(t)]/(t−s).

The following expressions are polynomials with real coefficients for real parity p, despite their displayed quotients:

U2=2D2/W,
U1=−8D2/W²,
U0=(2/W)(D0+8D2/W²),
R_p=J[L²U2+L U1+U0].                                     (2)

To verify divisibility, use coordinates (a,W). Parity makes p(iX)p(−iY)=p(a−iW/2)p(a+iW/2), an even polynomial in W. Its expansion gives
D2=(W²/8)[p'(a)²−p(a)p''(a)]+O(W⁴).
The symmetric root set also gives D0=−Σq_j(a)²+O(W²), while Σq_j(a)²=p'(a)²−p(a)p''(a). Hence D2 is divisible by W² and the parentheses in U0 are divisible by W². No analytic division, pole, or omitted boundary term is introduced. Terms that vanish at low n are interpreted as zero polynomials.

Direct multiplication now proves

Bhat_p=Ghat R_p+(L²/2)J[p(a)²],                            (3)
Bhat_p=(L²/2)|Qhat_p|²−Σ|Qhat_qj|².

Indeed (∂_L+W/2)(L²U2+LU1+U0)=L²D2+D0. This retains the full original deletion sum, not a positive-parent replacement.

In jet-index degree, deg U2≤2n−1, deg U1≤2n−2, deg U0≤2n−3 when nonzero. Since deg T_j≤j+1, R_p has total degree at most 2n+3 in (L,x,y,z,v). Its weighted boundary vanishes by the established normalization. Thus the earlier trial bound on flux degree is proved for this particular signed normal form. It is not a proof that an SOS-positive remainder can be obtained within that bound.

## 2. Exact higher-remainder recurrence and the actual inverse

Set

G_j=((-1)^j/4^j) Σ_(k=0)^(2j) (−1)^k binom(2j,k) T_k T_(2j−k),
g_j=G_j/T0².                                               (4)

The denominator is always just T0², independently of j. Thus localization does not compound inverse normalization with degree. Define ell=log psi, with derivatives in u, and
kappa_(2m)=2(−1)^m ell^(2m)/4^m.
The exact signed Bell recurrence is

g_(j+1)=Σ_(m=1)^(j+1) binom(2j+1,2m−1) kappa_(2m) g_(j+1−m).
                                                                  (5)
It follows by logarithmic differentiation of

Σ g_j z^(2j)/(2j)!=psi(u+iz/2)psi(u−iz/2)/psi(u)².

All logarithmic derivatives in (5) are evaluated through the exact flow, ell^(2m)=(2V)^(2m−1)(T1/T0). Their signs are NOT assumed. Formula (4) implements the denominator cancellations without dropping terms in (5).

For p(t)=Σ_(i=0)^N c_i t^(epsilon+2i), epsilon∈{0,1}, c_N=1, equation (3) has canonical remainder

S_p=(L²/2)Σ_(i,k=0)^N c_i c_k G_(epsilon+i+k).              (6)

Let M_j=∫u²psi(u)²g_j(u)du. At the actual inverse-selected polynomial, the lower coefficient column is c_low=−A^(-1)b, with
A_ik=M_(epsilon+i+k), b_i=M_(epsilon+N+i), 0≤i,k<N.
The known positive prefix justifies this exact inverse. The unproved target is

h[p]/(4pi)=M_(epsilon+2N)−b^T A^(-1)b.                     (7)

Equations (3)–(6) construct the full integrated source of (7), but do not supply its sign. The inverse coefficients stay in (6); replacing them by arbitrary lower-orthogonal polynomial multiples would invoke the already disproved enlarged-space coercivity claim.

## 3. Explicit coefficient growth, with a sharp factorial-order obstruction

Let ||·||_1 denote the sum of absolute polynomial coefficients in the displayed variables (x,y,z,v), before any optional quotient-ring simplification. The coefficient norms of the four components of 2V are at most 8, and ||b||_1=17/2. For a polynomial of degree d,
||2V f||_1≤8d||f||_1.
Since deg T_j≤j+1 and ||T0||_1=5/2,

||T_j||_1≤(5/2)17^j j!,
||G_j||_1≤(25/4)(289/4)^j(2j+1)!.                         (8)

The latter bound follows by summing the binomial expression (4): each of its 2j+1 terms contributes at most (25/4)17^(2j)(2j)! before the factor 4^(−j). For fixed selected coefficients and n=epsilon+2N,

||S_p||_1≤(25/8)||c||_1²(289/4)^n(2n+1)!.                 (9)

This is an explicit algebraic envelope, not a positive lower bound. In particular ||c||_1 still contains the actual prefix inverse and has not been bounded by normalization.

Factorial order cannot be replaced by a merely geometric coefficient bound. At u=0 the generating function in (5) is
H(z)=psi(iz/2)²/psi(0)².
It is analytic for |z|<pi/2, and its Taylor radius is exactly pi/2. Hence

limsup_(j→∞)(|g_j(0)|/(2j)!)^(1/(2j))=2/pi.                 (10)

For completeness the nonremovable boundary is arithmetic, not an assumed zero statement. Put z→pi/2 from below, u=iz/2=i(pi/4−eta), and q=e^(2u)=i+w, where w=2sin(eta)e^(−i eta). The alternating modular transformation is
Theta(i+w)=w^(−1/2)Σ_(m∈Z) exp[−pi(m+1/2)²/w],
with Re(1/w)=(1/2)cot(eta)→∞. Every fixed derivative of this expression, and thus every fixed derivative of psi(u), tends to zero faster than every power of eta. Differentiation only introduces fixed polynomial factors in 1/w and the summation index, still dominated by the leading exponential. Therefore H and all its fixed derivatives tend to zero at z=pi/2. An analytic continuation through that point would have all derivatives zero and contradict H(0)=1. Strip analyticity gives the lower radius bound, proving the exact radius and (10).

At the actual center let M=max(1,y(0),1/y(0)). Then |G_j(0)|≤M^(2j+2)||G_j||_1, so (10) implies

limsup (||G_j||_1/(2j)!)^(1/(2j))≥2/(pi M)>0.               (11)

Thus the factorial order in absolute-coefficient estimates is real, even though the constants in (8) are crude. This does NOT prove the correlated method loses to the actual target norm; the latter may also grow rapidly, and no asymptotic comparison is claimed.

## 4. Infinitely many signed central remainders

The flat modular endpoint also proves that g_j(0) takes both positive and negative values infinitely often. If its coefficients were eventually nonnegative, take a sufficiently high even derivative of H to remove all earlier terms. Its power series would have nonnegative coefficients and at least one positive term, so the derivative would stay bounded below by a positive constant for z in any interval [z0,pi/2). This contradicts its zero limit at pi/2. An eventually nonpositive sequence gives the same contradiction with signs reversed. A finite polynomial sequence is excluded by flatness and H(0)=1.

For each degree j with g_j(0)<0, the canonical moment factor for p=t^j is negative at the center. Consequently S_p=(L²/2)T0²g_j is negative for sufficiently small nonzero L. The repeated-root test can be perturbed to a monic parity polynomial with simple real symmetric roots, still preserving this negativity by continuity. Such polynomials are NOT claimed to be actual inverse-selected residuals. The argument does not determine how the bad degrees split between the even and odd subsequences.

Therefore no induction that declares the canonical remainder nonnegative for all real-rooted parity polynomials can work, even with this exact rank-one nonlinear flow and uniformly bounded normalization. Any successful construction must use the exact inverse-selected coefficients and perhaps additional signed divergences to redistribute the central loss. The present construction keeps that loss visible rather than hiding it in absolute tails or a false local PSD assertion.

## 5. Precise progress and remaining inequality

The canonical polynomial flux and its degree bound are now explicit at every n, and the signed higher remainder has an exact recurrence with a uniformly controlled denominator. The source remains the full original-theta operator, with both parity ladders and all deletions.

What is still missing is a noncircular lower bound for the integrated expression (6) with c_low=−A^(-1)b, or an additional admissible divergence yielding an independently positive remainder for those exact coefficients. The factorial obstruction concerns absolute coefficient bounds, and the sign obstruction concerns a larger real-rooted class. Neither is an obstruction to every possible integrated selected-residual certificate; neither proves RH or a negative actual theta pivot.
