# A Gaussian-tested sufficient operator bound for the endpoint remainder

Status: algebra and Gaussian test independently audited; the two theta-specific uniform hypotheses below are unproved. This is not a next-pivot or RH result.

Under positive normalized current-prefix pivots through n, let H=H₀ be the positive semidefinite half-line Gram of the actual normalized theta physical features, and let d=lim_(a↓0)R^T r/a be the actual reflection-defect vector. These quantities contain all true prefix normalization and conditioning. Split e=e_n, d=d_perp+2(n+1)e. The audited identity is

 C_n^(0)=4 tr H−2 d^T H e
        =4 tr H_perp−4nH_nn−2d_perp^T H_perp,n.                      (1)

A concrete independent pair of growth hypotheses is that there are K,L≥0, independent of n, such that

 H_jj ≤ K√(j+1) for 0≤j≤n,                                           (A)
 d_perp^T H_perp,perp d_perp ≤ L(n+1)^(5/2).                        (B)

These are statements about the actual current-prefix polynomials, old pivots and their theta half-line Gram; no next-pivot sign or independent inverse-norm bound is assumed. By positive-semidefinite Cauchy,

 |d_perp^T H_perp,n| ≤ √(LK)(n+1)^(3/2).

Also 0≤tr H_perp≤K(n+1)^(3/2) and 0≤nH_nn≤K(n+1)^(3/2), so the difference of those positive quantities has absolute value at most K(n+1)^(3/2). Hence the noncircular sufficient conclusion is

 |C_n^(0)| ≤ (4K+2√(KL))(n+1)^(3/2).                                (2)

The Gaussian baseline ψ=e^(−ch²/2) satisfies (A) with K=√c/2, because H_jj=(c/2)E_j|h|≤(√c/2)√(j+1), and (B) with L=0 by its exact Appell structure. Its actual |C_n^(0)| has an independently proved lower bound of order n^(3/2), so this scale is compatible with, and sharp in order for, that model.

No proof of (A) or (B) for complete theta is claimed. Both use actual normalized prefix data and may conceal difficult conditioning. The estimate is an absolute remainder-growth bound, not a signed Schur-form payment; in the Gaussian model the next pivot grows only linearly, so (2) alone cannot pay it. A theta proof would require independent arithmetic control of both hypotheses and additional correlated boundary/innovation terms.
