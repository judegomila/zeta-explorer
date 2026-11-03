# Direct finite arithmetic certificate for the next even pivot

Independently reviewed analytic PASS. No additional finite ladder run is claimed.

Use the actual known positive prefix and the independently reviewed degree-only cutoff k_K, K=4N. At r=0 define the signed arithmetic summands
 U_k=k^(-1/2)[d(k)L_N C_f((log k)/2)
                    +(ell_2(k)/4)L_N A_f((log k)/2)].
The exact divisor formula gives h_N=4pi sum_(k>=1)U_k. Every U_k with k>=k_K is strictly positive (d(k)>0), without assuming h_N>0.

Therefore the concrete finite certificate
 sum_(k=1)^J U_k>0 for ANY J>=k_K-1                (1)
implies h_N>0. In particular, the basic core needs only O(N²) arithmetic indices, with the exact degree-only threshold already displayed. The summands retain the actual prefix polynomial, so no inverse feedback has been replaced by an auxiliary norm.

This criterion can be verified using outward interval integration of the finite single-orbit kernels and certified enclosures of the actual prefix coefficients. Those coefficients are available from the old positive matrix and its inverse; a positive lower interval endpoint for the finite sum is the certificate. Fixed-degree integral tails are explicitly controlled by the already reviewed single-orbit estimates. No unknown next moment need be provided as input, and no high-jet finite-theta truncation is used: the omitted arithmetic terms have a proved sign.

There is also a limited completeness statement. Starting at J=k_K-1, these partial sums increase strictly and converge to h_N/(4pi). If h_N>0, some finite partial sum is strictly positive, so interval refinement can certify it eventually. If h_N<=0, no such partial sum is positive. This is a characterization/semidecision procedure, not a proof that it terminates at every degree or within a degree-uniform effort bound.

The precise possible uniform route is to establish the signed finite-core inequality (1) at J=k_K-1 for all N, or give a controlled larger J_N and prove it there. That arithmetic-core inequality remains unproved. Numerical verification at finitely many N would not settle it. The adjacent odd target has negative high-arithmetic remainder and requires a separate paid lower bound as recorded in ODD_PARITY_TAIL_SIGN.md.
