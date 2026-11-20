# Exact theta Sobolev reduction of the amplitude conjecture

Date: 2026-11-03. Status: independent analytical audit PASS (AI-assisted, not peer review or a machine-formalized proof). No proof or actual-theta counterexample to the proposed amplitude inequality is supplied.

## 1. Fourier normalization and the actual weight

Extend the complete theta profile ψ evenly to the real line. Use the Fourier convention hatψ(t)=∫ψ(h)exp(−ith)dh and put F(t)=hatψ(t)/sqrt(4π). The normalization makes full-line Fourier integrals equal the original half-line energies. F is real and even; it is a constant multiple of the usual completed Riemann Xi function. Only its definition as this exact Fourier transform is used below.

For one fixed parity ε, map p to the real polynomial P(t)=i^(−ε)p(it). Then

hat(Xp)/sqrt(4π)=i^(ε+1)[2F′P+FP′],
hat(Yp)/sqrt(4π)=i^(ε−1)FP′.

Consequently, writing

w=F²,  V=2(F′²−FF″),

one has exactly

G_Y(P,R)=∫_R w P′R′ dt,
Q(P,R)=∫_R V PR dt,
G_X(P,R)=∫_R [wP′R′+VPR] dt.

The identity for Q follows by one integration by parts. Polynomial boundary terms vanish. No pointwise sign of V is assumed. The actual theta transform is a constant multiple of ξ(1/2+it). Stirling and polynomial vertical-strip bounds for ζ give exponential decay uniformly in a fixed complex neighborhood of the real t-axis. Cauchy estimates then give exponential decay, up to polynomial factors, for F′ and F″. Therefore w and |V| have positive exponential moments. This argument uses no RH or pointwise positivity of V.

## 2. Exact derivative-coherence formulation

Fix a new degree n≥1 and the full lower same-parity prefix. Let P_n be the monic degree-n polynomial orthogonal to that prefix in G_X. This exists because X is injective, independently of Q positivity. Let π_(n−1) be the monic degree-(n−1) polynomial orthogonal in the positive weight w to lower polynomials. Since w is even, π_(n−1) has the required parity. Put h_(n−1)=∫wπ_(n−1)².

The derivative image of the old prefix is precisely the lower same-parity polynomial space below degree n−1. Therefore the Y residual of any monic new representative is nπ_(n−1), and

A=G_X(P_n,P_n),
B=n²h_(n−1),
U=∫w[P_n′−nπ_(n−1)]²,
Δ=A−n²h_(n−1),
Q(P_n,P_n)=Δ−U.

These formulas preserve the stipulated X regression. They do not replace it with Y regression. They also handle the even-prefix constant kernel correctly. For n=0, U=B=0 separately.

Thus the requested theta assertion is exactly

||P_n′−nπ_(n−1)||²_w ≤ (11/20)sqrt(ρ_n)[G_X(P_n,P_n)−n²h_(n−1)],

with the original old-space generalized gap ρ_n. This is quantitative derivative coherence between the actual theta Sobolev-orthogonal polynomial P_n and the ordinary w-orthogonal polynomial π_(n−1). Mere orthogonality does not give the claimed size or sign.

For each old derivative degree k=n−3,n−5,..., let Jπ_k be any polynomial antiderivative of π_k having the parity of n. G_X orthogonality gives the exact connection coefficient

∫wP_n′π_k = −∫VP_n Jπ_k.

Hence

U=Σ_k [∫VP_n Jπ_k]²/h_k.

For even n the antiderivative's constant ambiguity is harmless because ∫VP_n=Q(P_n,1)=G_X(P_n,1)=0. This identity isolates the actual theta-specific quantities that need control; no generic operator model is substituted.

## 3. Conditional asymptotic requirement: the old gaps vanish

If every same-parity prefix remains Q-positive, then its generalized minima satisfy ρ_n↓0 along that parity. This statement is conditional on the entire sequence staying positive, not a grant of enlarged-block positivity for any fixed extension.

Here is a graph-density proof retaining the derivative norm. Put v=w+|V|. Both v and w have an exponential moment. Polynomials are dense enough in L²(v)⊕L²(w), through their graphs (p,p′), to approximate the graph of every smooth compactly supported f. Indeed, if (a,b) annihilates all polynomial graphs, the distribution T=av−(bw)′ has zero polynomial moments. Cauchy–Schwarz gives positive exponential L¹ moments for av and bw. Thus Fourier(T)(ξ)=Fourier(av)(ξ)−iξ Fourier(bw)(ξ) is analytic on a strip, although T itself is a distribution rather than generally a measure. Vanishing of all derivatives at zero implies T=0. Thus (a,b) also annihilates (f,f′). The Hilbert-space double-orthogonal-complement theorem proves the graph-closure assertion. Evenness gives the same result within either parity.

Choose a compact interval away from the discrete zero set of F, and smooth oscillatory functions there, reflected with the required parity. Their absolute potential energy ∫|V|f² stays bounded, whereas ∫w(f′)² tends to infinity. Graph approximation transfers these Rayleigh tests to finite-degree polynomials. More explicitly, f_k=χ(t)cos(kt) in even parity or χ(t)sin(kt) in odd parity, with a nonzero even smooth compactly supported χ where w is bounded below, has derivative energy of order k² by the Riemann–Lebesgue lemma. Its potential energy is uniformly bounded. For each fixed k the graph approximation makes both energies converge, including the signed potential energy since |V|≤v. Under the stated positive-prefix hypothesis every polynomial quotient is positive; arbitrarily small positive quotients and nestedness give ρ_n↓0. No uniform-in-k approximation degree or convergence rate is asserted.

Accordingly, if the proposed amplitude inequality holds for all degrees and the prefixes remain positive, it requires U_n/Δ_n→0 whenever Δ_n>0. A bounded nonzero limiting mismatch ratio would refute the estimate, but no such limiting ratio for the complete theta weight is established here. Finite-degree scans do not establish this asymptotic coherence.

## Scope

This reduction uses the complete theta transform, not a finite-orbit model. It gives exact orthogonal-polynomial coordinates and a necessary asymptotic restriction. It proves neither Δ≥0 nor the 11/20 amplitude constant, and supplies no selected-polynomial counterexample. A sufficient next ingredient would be a quantitative estimate on the displayed antiderivative connection coefficients uniform in n and explicitly correlated with ρ_n.
