# All-order reflected Sobolev contraction and its unavoidable integrated cost

2026-11-02. Exact derivation for the full theta profile. This is a reduction and an obstruction to a local proof strategy, not a proof of RH. No downloaded code was executed.

Let ψ be the full real even smooth theta profile used throughout this campaign. It and all derivatives decay faster than every exponential. Fix a>0 and set

K_a(v)=∫_0^∞ cosh(2ah) ψ(h−v)ψ(h+v) dh,
C_a(v)=∫_0^∞ h sinh(2ah) ψ(h−v)ψ(h+v) dh=(1/2)∂_a K_a(v),
g_a(u)=e^{au}ψ(u).

## 1. An automatic parent Gram, with the derivative cost exposed

Evenness and a change of variables give

K_a(v)=(1/2)∫_R g_a(u−v)g_a(u+v)du.

Consequently its confluent Gram Γ_ij=(-1)^j K_a^(i+j)(0) satisfies

Σ conjugate(c_i) Γ_ij c_j=(1/2)∫_R |p(D)g_a(u)|²du,
where p(z)=Σ c_j(-2z)^j (conjugating all coefficients changes neither conclusion).

This is a positive parent for every a without assuming RH. Differentiation, retaining [p(D),u]=p′(D), gives the target jet form

Q_a[p]=(1/4)∂_a ||p(D)g_a||²
       =(1/2)∫_R {u|p(D)g_a|² + Re[p′(D)g_a conjugate(p(D)g_a)]}du.

Because C_a is even, its jet matrix splits into even and odd index blocks. For a polynomial p of either parity the last integral is zero: every product has total derivative order odd, and integration by parts makes its real integral vanish (indeed each real derivative-pair integral vanishes). Complex coefficients are allowed. Therefore

Q_a[p]=(1/2)∫_0^∞ u{e^{2au}|p(D+a)ψ(u)|²−e^{−2au}|p(D−a)ψ(u)|²}du.       (1)

This is the precise reflected weighted derivative contraction, separately on each parity-polynomial space. Define
T_±p=√u e^{±au}p(D±a)ψ(u) in L²(0,∞).
Then Q_a[p]=(||T_+p||²−||T_-p||²)/2.

T_+ is injective on polynomials: a nonzero polynomial annihilating ψ on an interval would make ψ a constant-coefficient ODE solution, hence an exponential polynomial. Its superexponential decay and nonzero value exclude this. Thus R_a=T_- T_+^{-1} is a well-defined operator from the T_+ polynomial range into ambient L²(0,∞), densely defined in the closure of that domain, for each parity. The all-order target is exactly that R_a extend as a contraction from this domain closure into ambient L²(0,∞). No invariance of the domain closure under R_a is asserted. If the inequality holds on polynomials the extension follows by continuity; no unproved closedness or inverse bound is needed. Conversely a contraction extension proves every finite jet form nonnegative. Existing analytic spectral-moment results then imply the original global PD condition. This last universal inequality remains open.

## 2. Exact square minus explicit coupling cost

For fixed p define finite differential expressions
E=Σ_{j even} a^j p^(j)(D)ψ/j!,
O=Σ_{j odd} a^j p^(j)(D)ψ/j!.
Thus p(D±a)ψ=E±O. Elementary completion of the square transforms (1) into

Q_a[p]=∫_0^∞ u sinh(2au)|E+coth(2au)O|²du
       −∫_0^∞ u csch(2au)|O|²du.                         (2)

The negative term cannot be omitted. Its coefficient and its feature O are explicit, not a numerical tail or a finite-matrix conditioning artifact. A possible constructive next theorem is the integrated Hardy-type inequality that the second integral is bounded by the first, uniformly in polynomial degree, separately for each parity. Equation (2) alone does not prove that theorem.

No actual singularity appears at u=0. For even p, O is an odd smooth function of u, hence O=O(u); for odd p, E is odd while O is even, so the first square behaves like O(1/u²) but the weight u sinh(2au)=O(u²). Both integrals are locally finite. All tails are integrable by theta decay. The a→0 limit is finite after division by a:

lim_{a→0} Q_a[p]/a
 = (1/2)∫_0^∞ {|2u p(D)ψ+p′(D)ψ|²−|p′(D)ψ|²}du.         (3)

This keeps the coupling cost in the normalized small-shift problem; it does not replace it with a sign assertion.

## 3. Theta-specific no-go for pointwise positivity, already at degree two

Fix any u0>0 with ψ′(u0)≠0, and a>0. Set
r=ψ″(u0)/ψ(u0)+2a ψ′(u0)/ψ(u0)+a²,
p(z)=z²−r.

At u0, p(D+a)ψ=0 but p(D−a)ψ=−4aψ′(u0)≠0. Hence the integrand in (1) is

−8 a² u0 e^{−2au0} ψ′(u0)² < 0.                         (4)

It stays negative on an open neighborhood by continuity. This uses the actual full profile. In particular it applies at all positive u0 once strict decrease of ψ has been established; existence of such points already follows from nonconstancy and decay.

Therefore a pointwise positive factorization of the reflected-derivative integrand cannot establish even the {1,D²} integrated block, let alone the all-order hierarchy. Positive integrated H2 does not contradict (4): its proof must exploit integration, derivatives, or cancellation between regions. This closes one tempting use of the positive Laplace tail representation: local pointwise domination of every polynomial feature is impossible. It does not rule out a nonlocal positive transform, an integrated Hardy inequality, or a different factorization.

## 4. Scalar moments with all signed derivative corrections

Write w(h)=h sinh(2ah), A_k=∫_0^∞ w(h)|ψ^(k)(h)|²dh, B_k=∫_0^∞ cosh(2ah)|ψ^(k)(h)|²dh. Integration by parts yields

μ_n:=(-1)^n C_a^(2n)(0)
 =Σ_{j=0}^n binom(n,j)4^{n−j}(-1)^j ∫_0^∞ w^(2j)(h)|ψ^(n−j)(h)|²dh.     (5)

A clean derivation is to use (∂_y−∂_x)²=(∂_x+∂_y)²−4∂_x∂_y on ψ(x)ψ(y), set x=y=h, and integrate the even diagonal derivatives by parts. All half-line boundary terms vanish: w is even, ψ is even, so every resulting odd total derivative at zero vanishes. At infinity theta decay dominates.

Putting b=2a and w^(2j)=b^{2j}w+2j b^{2j−1}cosh(bh) makes (5)

μ_n=Σ_{j=0}^n binom(n,j)4^{n−j}(-b²)^j A_{n−j}
 −2nb Σ_{j=0}^{n−1}binom(n−1,j)4^{n−1−j}(-b²)^j B_{n−1−j}.          (6)

For example μ_1=4A_1−b²A_0−2bB_0 and
μ_2=16A_2−8b²A_1+b⁴A_0−16bB_1+4b³B_0.

Positive individual moments do not establish the Hankel inequalities; (1)–(2) preserve the full polynomial quadratic forms. Formula (6) is useful for exact symbolic generation and identifying the entire cost, not for discarding alternating pieces.

## 5. Scope and next concrete attack

Established: exact all-degree Gram normalization, parity split, injective reflected-feature operator with its correct closure criterion, integrated square-minus-cost formula and small-shift limit, exact signed scalar moment recurrence, and the degree-two local negativity obstruction (4).

Still open: the uniform integrated contraction/Hardy inequality (2). The new H2 inequalities and any H3 proof provide finite-dimensional restrictions of it, not its all-degree closure. A genuinely new proof must control the integrated cost with theta-specific information; neither log-concavity nor positivity of the elementary theta tail representation supplies local feature domination, since (4) forbids that domination.
