# Certified full-side bound for the cumulative-tail counterexample

2026-11-02. Independent analytic audit and interval replay PASS; see ../lehmer_tail_audit/FULL_SIDE_AUDIT.md.

At the exact rational t=7005081715/1000000, define Ξ(t)=ξ(1/2+it), ξ(z)=Q(z)ζ(z), Q(z)=z(z−1)π^(−z/2)Γ(z/2)/2. The campaign theta profile satisfies ∫ψ(u)e^(itu)du=2Ξ(t). Therefore the full a=0 normalized bridge F_0(v)=∫_0∞2h²ψ(h−v)ψ(h+v)dh has Fourier density

F_0_hat(2t)=Ξ′(t)²−Ξ(t)Ξ″(t).

The certificate uses the reviewed Euler–Maclaurin head N=8192,m=40 and explicit remainder bounds e,e1,e2 from ../modular_transfer_v1/ACTUAL_COMPLETED_HEAD_TRANSFER.md. All 80 rising-factorial factors and reciprocal derivative terms are retained. Bernoulli coefficients are generated as exact rationals and then outward-enclosed.

Put G=|Q(1/2+it)|², b=∂σlogG, b′=∂σ²logG. The normalized full density is
F_0_hat/G=(b²+b′)|ζ|²/2+2b Re(ζ′conjugateζ)+|ζ′|²+Re(ζ″conjugateζ).
The head substitutes H,H′,H″ and adds the reviewed E2/2 error allowance.

Integral comparison gives |ReΨ(z/2)−log|z/2||≤π/|t|. Similarly Ψ′(w)=Σ_(n≥0)(n+w)^−2 differs from its integral 1/w in modulus by at most ∫_0∞2/|w+x|³dx≤2/(Im w)². Thus the checker encloses b with radius π/t and b′ with radius4/t² around its explicit rational/logarithmic center. These bounds hold for Re(z/2)>0. Arb is not needed for this side: mpmath.iv with45-digit precision encloses every operation, including loggamma in the scaled Q factor.

The replayed interval gives the conservative integer bounds

3195878911633 < exp(πt/2)F_0_hat(2t) <3195886054651.

This positive full-side value combines with the separately certified compact-h core in ../lehmer_tail_certificate_v1/ to prove negativity of the H=1 cumulative tail. It is not an RH counterexample: the full density at the target is positive.
