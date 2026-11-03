# Exact common-scale position payment and the coprime-kernel obstruction

Status: independent analytic review PASS. This packet concerns the original normalized shift a=0 and does not assert the missing signed inequality.

## 1. Rank-one decomposition with all orbits retained

Let f(u)=4e^{u/2}(2π²e^{4u}−3πe^{2u})e^{−πe^{2u}}. The complete profile obeys

ψ(u)=Σ_{n≥1} n^{−1/2} f(u+log n).

For a real polynomial r, put f_r=r(iD)f and ψ_r=r(iD)ψ. On u≥0 every fixed derivative series converges absolutely with all polynomial spatial weights. Group the ordered pair n,m by n=ga,m=gb with gcd(a,b)=1. Define

K_r(v)=Σ_{a,b≥1, gcd(a,b)=1} (ab)^{−1/2} f_r(v+log a) conjugate(f_r(v+log b)),
W_j(v)=Σ_{1≤g≤e^v} (v−log g)^j/g,  j=0,1,2.

K_r is real, since ordered pairs occur with their conjugates. Exact change of variable v=u+log g yields

∫_0^∞ u^j |ψ_r(u)|²du = ∫_0^∞ W_j(v)K_r(v)dv, j=0,1,2.                    (1)

Absolute interchange is legitimate: before grouping, its absolute value is bounded by the integral of (Σ_n n^{−1/2}|f_r(u+log n)|)² times u^j, which is finite on u≥0. No divergent negative-half-line orbit norm or unregularized Euler product is used.

The scale weights satisfy, in the distributional sense and pointwise away from log integers,

W₂′=2W₁, W₂″=2W₀, W₂(0)=W₂′(0)=0.                                      (2)

W₂ is C¹; its second derivative is locally integrable with jumps, not delta masses. W₀(0)=1 in the right-hand convention. For comparison, W₀(v)=v+γ+O(e^{−v}), so W₂(v)=v³/3+γv²+O(v), but no sign inference below uses that asymptotic.

## 2. The actual root-deletion budget in this arithmetic kernel

For a fixed real-rooted parity polynomial p (even or odd), let q_j be its root-deletion polynomials, counting multiplicity. The sum of their physical norm densities is even. The exact original normalized bridge identity becomes

h[p]=4π∫_0^∞ [2W₂(v)K_p(v)−W₀(v)Σ_j K_{q_j}(v)]dv.                      (3)

Here h[p]=∫p(t)²(F′(t)²−F(t)F″(t))dt, F=Fourier ψ. The actual inverse-selected p and its q_j are retained; there is no replacement by an auxiliary polynomial. Known positive prefixes can supply the real-root premise but do not establish (3)'s sign.

The arithmetic novelty is that the deletion and position weights are the same common-scale kernel with W₂″=2W₀. However K is not a positive kernel, so weighted Poincare or a positive-measure interpretation cannot be applied without an additional argument. Integrating (2) by parts merely moves derivatives onto K, with its full signed derivative terms; it does not delete the lower costs.

## 3. The actual first odd residual already has a negative coprime kernel

Take p(t)=t, the actual first odd monic residual (also the full first monic residual by parity). Set d_n=n^{−1/2}f′(log n). Complete modular evenness gives Σ_n d_n=ψ′(0)=0. For every n≥2, d_n<0: its exact numerator is

P₁(x)=−16x³+60x²−30x=x(−16x²+60x−30),  x=πn²≥4π>4,

which is strictly negative. Hence

K_t(0)=(Σ_n d_n)²−Σ_{gcd(n,m)>1}d_n d_m
      =−Σ_{gcd(n,m)>1}d_n d_m
      ≤−P₁(4π)²e^{−8π}<0.                                             (4)

Every excluded pair has n,m≥2, so all its products are positive; the displayed upper bound retains just the n=m=2 term. All sums converge absolutely. Continuity gives a genuine negative interval immediately right of v=0. This is not an arbitrary polynomial: it uses the actual first odd residual, exact modular reflection and the exact rank-one orbit signs. The original h[t] is nevertheless positive; no contradiction occurs because K is only the regrouped density, not the complete integrated target.

For 0<v<log 2, W₂=v² and W₀=1. K_1(v)>0 since all f(v+log n)>0 there. Thus (3)'s full integrand for p=t is strictly negative sufficiently near v=0, and its compensation must occur farther out. This rules out pointwise common-scale payment even on the actual residual sequence, while leaving a correlated integrated lemma possible.

## 4. A second, fixed-degree interpolation obstruction

The failure is stronger than the abstract coprime matrix having a negative eigenvalue. For every sufficiently large v there exists a real even polynomial p_v of degree four for which K_{p_v}(v)<0. This polynomial is a diagnostic only, not asserted to be real-rooted or inverse-selected.

Proof. Put z=πe^{2v}, and g_n(v)=n^{−1/2}f(v+log n). Exactly

g_n(v)=e^{v/2}P₀(n²z)e^{−n²z},
P₀(x)=8x²−12x.

Writing D^j g_n=e^{v/2}P_j(n²z)e^{−n²z}, the exact recurrence is

P_{j+1}(x)=(1/2−2x)P_j(x)+2xP_j′(x).

In particular,
P₂=32x⁴−224x³+330x²−75x,
P₄=128x⁶−2112x⁵+10352x⁴−17024x³+(15465/2)x²−(1875/4)x.

For n=1,2,3, the matrix with rows (g_n,−D²g_n,D⁴g_n) is invertible for all sufficiently large z: after division by g_n and column scaling by (1,z²,z⁴), it tends to the Vandermonde-type matrix with rows (1,−4n⁴,16n⁸). Its determinant is nonzero.

Choose coefficients of p_v(t)=c₀+c₂t²+c₄t⁴ so that the weighted derivative features y_n=n^{−1/2}f_{p_v}(v+log n) satisfy

y₁=0, y₂=1, y₃=−1.

The inverse matrix estimate gives |c₀|+|c₂|+|c₄|≤C e^{9z}z^M for some fixed C,M once z is large. Exact polynomial derivative envelopes then show

Σ_{n≥4}|y_n|≤C′ z^{M′}Σ_{n≥4}n^{12}e^{−(n²−9)z}→0.

The first three coprime-pair contribution is exactly −2: diagonal entries at n=2,3 vanish because gcd(n,n)>1, while gcd(2,3)=1. All remaining pairs have absolute sum at most 4ε_z+ε_z², where ε_z=Σ_{n≥4}|y_n|→0. Therefore K_{p_v}(v)=−2+o(1)<0. The leading coefficient c₄ is nonzero for large z, because its inverse-matrix contribution from y₃/g₃ dominates y₂/g₂ exponentially and the corresponding Vandermonde inverse entry is nonzero. Rescaling therefore also gives a monic real even degree-four diagnostic with negative K.

This is an exact existence argument using the original rank-one theta orbit, not a Gaussian or Epstein analogue. It does not assert that the complete integral in (1) is negative: that integral is a genuine squared norm and hence nonnegative. Compensation in v is compulsory. This quartic construction does not identify an inverse-selected real-rooted polynomial; the separate Section 3 argument supplies the actual first-odd-residual counterexample.

## 5. Scope and remaining candidate

A concrete surviving theta-specific lemma would control the correlated integral in (3) for the actual inverse-selected parity polynomials, using both the coprime structure and W₂″=2W₀, rather than requiring K≥0 or estimating its pieces separately. This lemma is still unproved and is equivalent to the remaining signed budget when stated without additional arithmetic estimates.

The positive result here is the exact common-scale identity and its derivative linkage. The negative result is a genuine actual-orbit obstruction to a positive-kernel factorization based only on gcd grouping, already for the actual first odd residual. No new actual pivot, all-shift theorem or all-degree sign is obtained. Both parity costs remain in (3); the negative-kernel diagnostics cover the actual first odd residual and a real even quartic not asserted to be inverse-selected.
