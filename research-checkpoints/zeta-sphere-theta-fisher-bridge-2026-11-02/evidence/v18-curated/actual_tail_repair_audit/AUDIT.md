# Actual projected tail reserve: independent audit

2 November 2026. Analytic review complete; independent numerical replay outcome appended below. Scope: complete theta, normalized a=0, core [0,1/16], first two odd channels eliminated, and the fixed three-dimensional rational residual witness space Z. No positivity of the whole degree-19 matrix is inferred.

## Reflected full-moment identity

The earlier exact diagonal derivative expansion gives mu_n=4^n[2 integral h²(psi^(n))² - n integral(psi^(n-1))²]. At h=0 the odd boundary derivatives of even squares vanish; at infinity full theta decay removes every fixed derivative boundary term. The formula's 4^n factor and negative n coefficient agree with direct low-order expansion. It is used only with interval integration, not unreliable floating bulk subtraction.

## Derivatives and quadrature

The complete derivative routine includes n<=16 and a geometric absolute tail for n>=17 through derivative order 39. The recurrence and tail argument are the same as the independently replayed core inertia certificate. Product-square derivatives use the exact binomial convolution; derivatives of the weight 2h² are explicit. The 768 cells on [0,3], width 1/256, use exact dyadic centers and Taylor degree 20.

For complex h-disks of radius 1/20 and auxiliary v-radius 3/10, |Im(h+v)|<=.35 and real part lies within [-.35,3.35]. Re z>1 and |z|/Re z<4/3 follow from the stated elementary exponential/cosine inequalities. With y=n² Re z, the profile polynomial is bounded by (32y²/9+4y)e^-y. Splitting the exponential and using y²e^-y/2<3, y e^-y/2<1, sum e^-n²/2<2 and 4e^(Re u/2)<24 gives 704<1000. I independently checked the nontrivial exponential constants with rational Taylor sums and explicit geometric remainders.

Cauchy's derivative estimate gives 1000 n! (.3)^-n. Since 2|h|²<20 throughout the h-disks, the stated M_n controls the complex reflected density. The total Taylor remainder 3 M_n (5/128)^21/(1-5/128) is valid across all cells. No unaccounted spatial endpoint remains.

For h>=3, z>1200. The first-term polynomial majorant plus a geometric theta tail gives |psi^(k)|<=8e^(h/2)B_k z^(k+2)e^-z. Squaring and using e^h<=z, h²<=z² and dh=dz/(2z) gives precisely the two spatial-tail prefactors 64*4^n and 32n*4^n and powers 2n+6,2n+2. Their largest power is 44. The logarithmic derivative of z^p e^-2z is below -1 for z>=1200, so integral<=1200^p e^-2400. Both omitted tails are safely added symmetrically.

## Chaining and matrix evaluation

The evaluator now pads every serialized core/full moment interval by +/-1e-90*(1+|lo|+|hi|) before 100-digit interval loading, covering rounding in printed endpoints. All 2x2 inverses require first diagonal and determinant positive. The exact actual tail is enclosed by full minus core moments. Parallel-sum covariance and the Schur decomposition are the previously reviewed noncommuting identities. Projection uses only the fixed rational Z, not fitted numerical vectors.

Positive LDL pivots here certify positive definiteness, not numerical eigenvalue lower bounds. If Z*(St+600Sc)Z is positive, then in this fixed space the actual tail strictly dominates 600 times the positive core deficit -Sc. Adding the PSD binary covariance then certifies repair there, with no inference about the orthogonal complement, other shifts, or other degrees.

## Independent replay outcome

PASS. Recomputed all full moments in 768 cells, then used the independently replayed core moments and identical fixed rational witnesses. The padded interval evaluator verifies positive lower blocks and positive projected LDL pivots for the tail, repaired Schur block, and the stronger inequality Z*(St+600Sc)Z>0. Conservative displayed lower pivots for the latter are 5285.2602327492, 2.2374829820, and 0.0050766487862. They are not eigenvalue lower bounds. Since the core projection is negative definite, this proves that the actual outer tail pays more than 600 times its negative Schur cost on this three-dimensional space before adding covariance. No extrapolation is made to the full degree-19 matrix or to other shifts.

## Structural synthesis and complement coupling

Reviewed STRUCTURAL_SYNTHESIS.md including its appended complement condition. For an actual positive tail Schur T, normalized residual I+T^-1/2(C+V)T^-1/2 positivity is exactly equivalent to residual closure. The stronger covariance-free comparison is sufficient. These require positivity of the actual full tail block, not merely the certified three-dimensional restriction.

If a separate verified congruence splits the entire core residual as diag(-N,P), N,P positive, then the exact complement Schur condition is Tnn-Tnp(P+Tpp)^-1Tpn>N. The proposed eta norm square bounds the coupling by eta Tnn, so Tnn>=kappa N and eta<1-1/kappa suffice. Removing P gives a more conservative shorted-tail condition. None of the complete inertia split, full-space tail domination, or complement-coupling bound follows from the three-witness certificate. The source preserves these conditions explicitly and makes no all-degree claim.
