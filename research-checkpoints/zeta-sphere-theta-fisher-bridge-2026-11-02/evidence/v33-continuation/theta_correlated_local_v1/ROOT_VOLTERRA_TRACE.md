# Nonlocal root-inverse trace and the supercritical Hardy obstruction

Status: independent analytic review PASS. This gives a precise nonlocal operator formulation and an obstruction to ambient operator positivity, not a negative theta pivot.

## 1. The actual complete-theta residual and its range inverses

At normalized shift a=0, let p be a nonconstant actual monic parity residual (n≥1) selected by a known positive prefix, with distinct real roots r_1,…,r_n. Write g=p(iD)ψ and G=Fourier(g)=pF, with F=Fourier(ψ) and transform convention ∫g(u)e^{itu}du. For q_j=p/(t−r_j), let h_j=q_j(iD)ψ. These are the actual functions in the prefix trace, not arbitrary replacements.

The equation (iD−r_j)h_j=g has the exact range solution

h_j(u)=−i e^{−ir_j u}∫_{−∞}^u e^{ir_j v}g(v)dv
      = i e^{−ir_j u}∫_u^∞ e^{ir_j v}g(v)dv.                    (1)

The equality uses ∫e^{ir_jv}g(v)dv=G(r_j)=0. Thus the real-axis resolvent singularities cancel on this actual range. Formula (1) does not assert a bounded inverse of iD−r_j on all L². Complete theta decay justifies the integrals, all fixed derivatives and the integrations by parts below.

Define D_R(x)=Σ_j e^{ir_jx}. Then exact Fubini gives

Σ_j||h_j||² = Σ_{σ=±1}∫_0^∞∫_0^∞ min(v,w)
                g(σv) conjugate(g(σw)) D_R(σ(v−w)) dv dw.    (2)

This positive nonlocal quadratic form includes all root oscillations. It equals the actual prefix trace tr(diag(d_j)B) from the preceding packet, up to the common Parseval factor: that spectral trace is 2π times (2).

The desired normalized bridge comparison is

Σ_j||h_j||² ≤ 2||u g||².                                    (3)

For this particular actual g it is precisely the missing next-pivot comparison. Consequently merely naming (3) an operator contraction supplies no proof.

## 2. A noncircular estimate, and the gap it leaves

For any Schwartz g with G(r_j)=0, the half-line Hardy estimate applied to each primitive in (1) gives

||h_j||²≤4||u g||²,  hence  Σ_j||h_j||²≤4n||u g||².            (4)

For example on u>0, H(u)=∫_u^∞e^{ir_jv}g(v)dv has H′=−e^{ir_ju}g(u), and
∫|H|²=2 Re∫u e^{ir_ju}g(u) conjugate(H(u))du≤2||ug|| ||H||.
The negative half-line is identical. This proof keeps the exact range condition but ignores the special theta residual. It falls short of (3) by a factor 2n.

A successful improvement must use the actual g and the correlated root oscillations in (2), rather than just positivity of its min(v,w) kernel or absolute estimates |D_R|≤n.

## 3. A positive ambient factorization is impossible, even at a single root

Parseval converts the putative ambient inequality (3) to nonnegativity of

E_R[G]=2∫|G′(t)|²dt−∫|G(t)|²Σ_j1/(t−r_j)²dt.                 (5)

This singular Schrödinger form is unbounded below on unit-normalized smooth functions supported away from all roots. Fix one root r and choose L>2π and a nonzero χ∈C_c^∞(0,L) with ∫|χ′|²<(1/4)∫|χ|². For sufficiently small ε>0, set

G_ε(r+x)=sqrt(x) χ(log(x/ε)), x>0,

and zero elsewhere. Its support lies in (r+ε,r+εe^L), disjoint from every root. Direct substitution gives

2∫|G_ε′|²−∫|G_ε|²/(t−r)²
=2∫|χ′|²−(1/2)∫|χ|²<0.                                    (6)

The other root potentials only subtract more. Its squared norm is ε²∫e^{2y}|χ(y)|²dy, so normalization makes (5) tend to −∞. All range conditions G_ε(r_j)=0 are satisfied. Its inverse Fourier transform is Schwartz. For a symmetric root set, reflected disjoint copies give either required parity, including the case r=0.

Thus no positive operator factorization or ambient norm inequality proving (3) can hold on the entire natural root-inverse domain. The obstruction is the supercritical coefficient 1/2 relative to the sharp single-root Hardy constant 1/4, not a missing endpoint convention.

Analyticity alone does not rescue that ambient assertion. Let a fixed negative compactly supported test above be G and set f=G/p; because G vanishes near every root, f is smooth compactly supported. Finite Hermite expansions f_m converge to f in the Schwartz topology. The entire Schwartz functions p f_m are divisible by p and converge to G with both their first derivatives and all quotients q_j f_m in L². Hence (5) remains negative for sufficiently large m. Symmetric Hermite projections preserve the chosen parity. This argument concerns enlarged test classes, not the original fixed theta F.

## 4. The obstruction persists in the original theta cyclic space

It is possible to retain the original F, not merely replace it by an analytic test profile. For the same fixed actual roots and p, there exists a real polynomial r such that G=p r F makes (5) negative. The polynomial pr is NOT claimed to be real-rooted or the actual residual at its higher degree, and the potential still uses only the roots of p.

To prove this, choose the negative compactly supported G from (6) with its support avoiding zeros of F. This is possible since F is a nonzero entire function and its zeros are isolated, including if the selected root is itself a zero of F. Put f=G/(pF) on its support and zero elsewhere; f is smooth compactly supported. If parity is desired, take reflected tests first, making f even.

For any fixed 0<c<π/2, the complete theta transform and its first derivative have the familiar Gamma exponential decay times a polynomial on the real line. Consequently pF, (pF)′ and every q_jF are bounded in modulus by C exp(−c|t|/2). Let w(t)=exp(−c|t|).

Polynomials are dense in L²(w dt): a function orthogonal to all polynomials gives a finite signed density whose bilateral Laplace transform is analytic in a strip, has all derivatives zero at zero, and hence vanishes identically. Approximate f′ by real polynomials s_m in this norm and define r_m(t)=f(0)+∫_0^t s_m(x)dx. The half-line weighted Hardy estimate

||r_m−f||_{L²(w)}≤(2/c)||s_m−f′||_{L²(w)}

follows by integration by parts on each half-line, because r_m−f vanishes at zero. Hence r_m→f in weighted H¹. The displayed exponential bounds imply p r_m F→G in ordinary H¹ and q_j r_m F→G/(t−r_j) in L². Therefore E_R[p r_m F]→E_R[G]<0. Symmetrizing the derivative approximants preserves the desired parity.

This is a concrete obstruction to positivity of the root-frame operator on the full polynomial cyclic space of the original theta. It still does not contradict an inequality at the particular inverse-selected vector pF. Enlarging that one-vector assertion to all its polynomial multiples would be an invalid step.

## 5. Exact scope of the surviving theta question

The original theta g=p(iD)ψ satisfies much more than the range constraints, smoothness, analyticity and parity. Estimate (4) is unconditional but inadequate, and (6) shows that a universal improvement to the required constant is false even when the roots are the actual known-prefix roots.

The surviving task is an arithmetic estimate for the particular complete-theta vector in (2), with its actual root selection, not an ambient positive operator. A finite or infinite nonrational intertwiner might still exploit that smaller class; this packet neither excludes it nor proves the needed estimate. No sign of an unknown next pivot was used, and none of the counterexample polynomial multiples is claimed to be the actual inverse-selected residual at its degree.
