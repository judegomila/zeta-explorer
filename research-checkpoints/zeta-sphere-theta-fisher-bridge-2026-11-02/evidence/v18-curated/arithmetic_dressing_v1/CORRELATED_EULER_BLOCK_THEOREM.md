# Correlated arithmetic dressing: an exact growing class that preserves convexity

2026-11-02. Analytic reference theorem, independent review pending. The arithmetic remainder to the actual theta kernel is not bounded here.

## 1. Exact dressing, including cross phases and log derivatives

Let f be the full-line first-theta reference profile. For a finite set of positive integers A, define
f_A(u)=Σ_(n∈A)n^(−1/2)f(u+log n),
P_A(z)=Σ_(n∈A)n^(−z).
This is exactly the corresponding finite theta sum smoothly extended to the full line; there is no even reflection. The tilted Fourier transform picks up P_A(1/2+s+it). Therefore the full-line bridge has spectral density

hat D_(a,A)(2t)=(1/4)[∂_s(G_s(t)|P_A(1/2+s+it)|²)|_(s=a)
                         −∂_s(G_s(t)|P_A(1/2+s+it)|²)|_(s=−a)].       (1)

Both the modulus and its derivative remain. Expanding the square includes every n,m cross phase, not only diagonal terms.

Using the reference notation q=9/2+s, x=(q−2)/2 and y=t/2, write the parent spectral density up to its fixed positive constant as
F(s)=g(s)|Z(s)|²,
g(s)=(2π)^(−s)2^(q−4)|Γ(x+iy)|²,
Z(s)=(s−1/2+it)P_A(1/2+s+it).
Put b=(log g)′=−logπ+Re Ψ(x+iy), T=(log g)″=(1/2)Re Ψ′(x+iy)>0.
Then the exact curvature is

F″/g=(b²+T)|Z|²+4b Re(Z′ conjugate Z)+2|Z′|²+2Re(Z″ conjugate Z).     (2)

The last two mixed terms cannot be declared positive. For arbitrary additive integer sets, cancellation of P_A can make log-derivative ratios large; a general convexity assertion is not supplied by the one-summand theorem. Equation(2) identifies the actual negative-coupling cost.

## 2. A nontrivial correlated multiplicative class

Fix0<δ<1/2 and restrict0<a≤1/2−δ. Choose a finite set S of primes and arbitrary nonnegative integers M_p. Take

A={∏_(p∈S)p^(j_p):0≤j_p≤M_p},
P_A(z)=∏_(p∈S)Q_(p,M_p)(z),
Q_(p,M)(z)=Σ_(j=0)^M p^(−jz).

All cross phases remain exactly correlated by this product. For Re z≥δ, put r_p=p^(−δ), l_p=log p, and define

α_p=l_p r_p(1+r_p)/(1−r_p)^3,
β_p=l_p² r_p(1+r_p)^2/(1−r_p)^4,
A_S=Σα_p, B_S=Σβ_p+A_S²,
K_S=1+A_S, L_S=2A_S+B_S.

These bounds are uniform in every M_p, including arbitrarily large exponents. Indeed
|Q|=|1−p^(−(M+1)z)|/|1−p^(−z)|≥(1−r_p)/(1+r_p)>0,
|Q′|≤l_p r_p/(1−r_p)²,
|Q″|≤l_p² r_p(1+r_p)/(1−r_p)³.
Thus |P′/P|≤A_S and |P″/P|≤B_S. For |t|≥1 the linear factor in Z gives
|Z′/Z|≤K_S, |Z″/Z|≤L_S.

## 3. Explicit convexity criterion and a growing-prime regime

The digamma series compared with its integral yields, for x≥1 and y=t/2≠0,
|Re Ψ(x+iy)−log|x+iy||≤π/(2|y|)=π/|t|.
For completeness, the difference between Σ_(n=0)^(N−1)Re[1/(x+n+iy)] and its integral is at most the integral of the absolute derivative, bounded by ∫_0∞dt/((x+t)²+y²)≤π/(2|y|). Pass to the defining digamma limit. Hence

b≥log(|t|/(2π))−π/|t|.

From(2), keeping a safe bound on the signed couplings,
F″/(g|Z|²)≥b²−4|b|K_S−2L_S.
Therefore a sufficient computable condition is

log(|t|/(2π))−π/|t| > 4K_S+sqrt(2L_S).                (3)

When(3) holds, the right side is strictly positive, so F is strictly convex throughout s∈[−a,a]. Equation(1) gives hat D_(a,A)(2t)>0. An explicit sufficient onset for a fixed prime set is

|t|≥2π exp(4K_S+sqrt(2L_S)+2).

This result is uniform in all prime-power cutoffs M_p. It also permits growing prime sets. For S={p≤Y}, elementary comparison with sums over all integers gives
A_S=O_δ(Y^(1−δ)logY),  Σβ_p=O_δ(Y^(1−δ)(logY)²).
Thus if Y(t)=(log|t|)^η with0<η<1/(1−δ), condition(3) holds eventually, uniformly in the chosen M_p. No prime number theorem is needed for this loose asymptotic. The concrete condition(3), rather than the big-O alone, is the test at any specified height.

## 4. What this does not prove

This is a genuinely growing arithmetic reference class retaining modulus, log derivatives and all cross phases. It is not the same as the adaptive product cutoff nm≤M used in the existing certified contour-tail result. The finite Euler-box approximation is not known here to approximate ζ uniformly inside its critical strip. Its remaining omitted arithmetic/closure error has not been paid.

In particular, the prior exponential tail bound for the nm≤M grouped head must not be transplanted to this different multiplicative set. Conversely, the present convexity proof does not prove positivity of that nm≤M head. A successful transfer needs a single compatible arithmetic grouping with both the correlated sign bound and its own certified remainder. Equation(2) and criterion(3) supply a concrete sign mechanism, not that missing compatibility theorem.
