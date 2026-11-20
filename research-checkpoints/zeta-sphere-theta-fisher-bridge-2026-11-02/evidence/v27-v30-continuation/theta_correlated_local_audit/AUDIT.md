# Independent complete-theta saddle and mixture audit

Reviewed 2026-11-03. Main claims PASS after the explicit remainder correction below; no numerical certificate or growing-degree threshold is supplied.

## Saddle and complete-orbit control

The first-pair product is exactly 64 z^4 e^r e^(-2z cosh 2v)[1-3 cosh(2v)/z+9/(4z²)]. With v=w/(2sqrt z), v²dv=w²dw/(8z^(3/2)), whose Gaussian integral is sqrt(pi)/(16z^(3/2)). Hence the leading constant is 4sqrt(pi) z^(5/2)e^r=4pi³e^(6r). Quartic exponent correction is -w^4/(12z); weighted Gaussian ratio integral w^6/integral w²=15/4 gives -5/(16z). The polynomial bracket adds -3/z. Their sum is -53/(16z), as stated.

For |v|<=r/2 all orbit polynomial factors and any fixed r derivatives are bounded by fixed powers of z,n,m, since e^(2|v|)<=e^r. The exponent obeys n²e^(2v)+m²e^(-2v)>=2nm. All omitted pairs have nm>=2. Sums of polynomially weighted exp(-2z nm) are bounded by a fixed polynomial in z times exp(-4z), using divisor grouping; the central interval length r is harmless. Thus complete omitted orbits are exponentially negligible relative to exp(-2z). This estimate is for each fixed derivative order, not for a growing order.

Outside the central interval, one argument has magnitude at least 3r/2. Each fixed profile derivative is globally bounded and, by reflection, has a polynomial times exp(-pi e^(2|u|)) tail. Using that tail on the larger argument and the global bound on the other gives an integrable superexponential bound of order exp(-c e^(3r)) times fixed polynomial factors. It also justifies fixed differentiations under the integral. Local saddle expansion to sufficiently high order, Gaussian remainder control, and then differentiation prove the stated fixed-order differentiated expansion; a bare differentiated big-O would not suffice.

## Required remainder correction

For L=log C, the expansion implies L'=6-4z+53/(8z)+O(z^-2), L''=-8z-53/(4z)+O(z^-2). Therefore

(log G)''(x)=[-8rz+4z-6-53r/(4z)-53/(8z)+O((r+1)/z²)]/(4r³), r=sqrt x.

Equivalently, keeping only the leading three terms requires O((r+1)/z), NOT O(1/z), in the numerator. The author was notified. This does not change eventual strict negativity.

## Accepted consequences

A nonzero positive Laplace mixture in x is log-convex wherever finite, by Cauchy–Schwarz/variance (with derivatives justified at any interior positive x). Thus actual G(x)=C(sqrt x) cannot be such a mixture. This excludes the stated positive Gaussian-mixture/complete-monotonicity shortcut, not positive definiteness or RH.

For fixed monic P_N, the leading operator in P_N(-D²/4)^2 is D^(4N)/4^(2N). Combining with the fixed-order saddle gives 16^N z^(4N)C times 1+O(1/z). All other operator terms have at least two fewer derivatives. Hence C_N is eventually positive for every fixed N without next-pivot assumptions. This is only an existential finite-degree threshold, not a quantitative uniform threshold.

Once an explicit R_N is independently certified, positivity of the omitted tail legitimately lower-bounds 4pi E C_N by its signed compact integral with factor 8pi sqrt(s). That compact integral must still exceed B_N/s to prove a new pivot. Neither evenness nor positive averaging supplies its sign. Arithmetic filtering reconstructs the same C_N and cannot alter this requirement.

## Final corrected bytes and Section 5 extension

Equation (3) was corrected to O((r+1)/z), resolving the identified issue. The appended explicit central-region theorem also PASSes. In the Q recurrence, a path has raising factor -2S and diagonal factor beta+2j, bounded by beta+2k. Summing absolute paths except the all-raising path gives (2S+beta+2k)^k-(2S)^k. For S>=2K(9+2K), k<=K, the relative error is at most exp(1/4)-1<1/3. The leading coefficient plus the lower coefficient sum<=1/8 then gives the claimed [1/2,3/2] bounds for L_N acting on each beta profile.

The exact pair product has coefficients 64,-96,144 and r exponents 9,7,5. Applying lower bounds to positive terms and the upper bound to the negative term yields 32T²-144TS+72T. If both z_i>=9, then T/S=1/(1/z1+1/z2)>=9/2 and this expression is strictly positive. For |v|<=r/2, min z_i>=pi e^r and S>=2pi e^(2r), so both explicit thresholds suffice simultaneously for all n,m. Differentiation is at fixed v before integration; no derivative of the moving central boundary is being asserted.

This is an explicit central-orbit sign estimate with actual coefficient dependence. It neither signs the noncentral region nor supplies its quantitative integrated comparison, and does not sign the compact r mean. The fixed-N asymptotic still supplies only an eventual full-tail existence statement unless those constants are made explicit.
