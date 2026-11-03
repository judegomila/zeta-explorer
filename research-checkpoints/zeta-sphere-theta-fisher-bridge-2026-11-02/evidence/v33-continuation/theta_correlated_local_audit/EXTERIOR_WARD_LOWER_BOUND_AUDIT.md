# Independent audit: exterior Ward lower bound

Analytic PASS, 2026-11-03. No numerical computation or acquired code execution. The independent exterior zero-strip/Hadamard positivity remains an explicit prerequisite, not an inferred critical-strip result.

For sigma=1/2+a>=1+delta, each zero term d/(d^2+(t-gamma)^2) has d=sigma-beta>=delta. Its derivative relative to itself is bounded by 1/d<=1/delta. Absolute local summability of the positive real series and the paired Hadamard normalization justify both the formula for rho and its derivative bound. The existing even-Xi product removes the otherwise possible real constant.

F(z)=2xi(1/2+iz) and functional symmetry give -Im(F'(t+ia) conjugate F(t+ia))=4|xi(sigma+it)|^2 Re(xi'/xi)(sigma+it). Thus the normalization 4/a and logarithmic derivative -2Im(xi'/xi)+rho_t/rho are correct.

The rational imaginary parts are bounded by 1/(2sigma) and 1/[2(sigma-1)]. The digamma series has imaginary part of one sign; its first term is <=1/(2x), and the decreasing integral is <=pi/2. With x=sigma/2 and the half-digamma coefficient in xi'/xi, doubling yields the combined bound 2/sigma+1/(sigma-1)+pi/2+2L(sigma). Adding 1/delta gives exactly C_delta in (1). Euler absolute convergence gives L(sigma)<=L(1+delta). Dyadic grouping of integers gives log(2) sum_{k>=1}(k+1)2^(-k delta)=log(2)r(2-r)/(1-r)^2. The zeta pole yields the sharper exact C_delta=4/delta+O(1).

Independently opened the cited standard inputs: https://dlmf.nist.gov/25.2#E11 , https://dlmf.nist.gov/25.10 , https://dlmf.nist.gov/5.7#E6 . The score bound is the packet's derivation, not attributed to those references.

Exterior positivity is already established independently, so Cauchy-Schwarz in Lambda_a dt is legitimate at every degree. The Ward identity gives beta_n>=n^2/C_delta^2, and multiplication gives h_n>=(n!)^2 C_delta^(-2n)h_0. Substitution into the exact defect identity gives the displayed lower bound and epsilon_n=2cn/C_delta^2. No target norm is assumed in this deduction; h_0 remains an actual positive scale factor.

Accepted scope: all n>=1, all a>=1/2+delta, full spatial kernel, fixed delta>0. These are monic pivot ratios, not arbitrary Gram eigenvalue or inverse-conditioning bounds. The degeneration as delta tends to zero neither extends into the critical shift region nor proves divergence of the actual boundary score. No arbitrary spatial-cutoff theorem or new RH scope is claimed.
