# Endpoint cancellation in the complete modular conservation law

Status: independent analytic audit PASS. Fixed-degree identity under positive normalized current-prefix pivots; it is not a degree-uniform estimate or next-pivot sign.

Let w(h)=h exp(−4ah), C=GX−XG, and define the complete boundary and weight terms

 B_n=−2∫₀∞w Z e_n^T GY dh,    W_n=∫₀∞w' Y^T GY dh.

The exact conservation law is B_n−W_n=C_n=∫₀∞w Y^T C Y dh. Neither B_n nor W_n can be discarded. Assume each normalized current pivot σ_j=lim_(a↓0)s_j(a)/a is positive through fixed degree n, with the parity-polynomial coefficients analytic at zero. Put F_j^0=T_j(0,D)ψ. In the natural weighted spaces,

 Y_j(h)=F_j^0(h)/√(aσ_j)+O(√a),   R=diag((−1)^j)+O(a),   G=2I+O(a).

Fixed-degree theta decay justifies termwise integration. Consequently

 lim_(a↓0) a W_n = Σ_(j=0)^n [∫_R(F_j^0)²dh]/σ_j.                    (1)

Since C=O(a) and the normalized features are O(a^-1/2), C_n=O(1), so the same limit holds for a B_n. This paired 1/a cancellation is a genuine consequence of the complete law, not positivity of either separate term. No convergence uniform in n is asserted.

There is a finite signed remainder formula. Define H₀=lim_(a↓0)a∫₀∞hY(−h)Y(−h)^Tdh and d=lim_(a↓0)η/a. Then the exact boundary-elimination identity yields

 C_n^(0)=4 tr H₀−2 d^T H₀ e_n,       d_n=2(n+1).                   (2)

The lower components of d and every cross entry of H₀ must be retained for theta. Their signs and the remaining connection to the next Schur surplus are not controlled by (2).

For the auxiliary Gaussian ψ=exp(−ch²/2), σ_j=(1/c)∫_R(F_j^0)²dh, and hence both quantities in (1) have leading coefficient c(n+1). Hermite Appell structure gives d_perp=0, H₀,jj=(c/2)m_j with m_j=E_j|h|, and therefore the exact finite remainder

 C_n^(0)=2c[Σ_(j=0)^n m_j−(n+1)m_n].                                (3)

The independently audited GAUSSIAN_SIGNED_COMMUTATOR_NO_GO shows −C_n^(0) grows at least as a constant times n^(3/2), although the positive next-pivot ratio grows only linearly. Thus this leading boundary/weight cancellation survives the Gaussian test but it is insufficient on its own: any next-rung estimate must retain further signed boundary/innovation correlations. The Gaussian Appell simplification d_perp=0 is not valid for theta without a separate proof.
