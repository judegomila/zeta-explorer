# Independent audit: adaptive auxiliary resolvent

PASS, 2026-11-03. Separate post-v28 companion; analytical identities only.

Multiplying the previously established rational residual identity by s P_N(-s)^2 and subtracting from h_N leaves exactly the integral with factor t²/(t²+s). Since this nonnegative factor is at most t²/s, the absolute error is bounded by B_N/s. All moments are finite by complete-theta strip decay. For T=D P_N(-D²), its Fourier multiplier is it P_N(t²). The |F'|² term in B_N is 2pi||T(u psi)||². Weighted |F F''| is bounded by 2pi||T psi||||T(u² psi)|| by Cauchy–Schwarz. No unknown signed pivot enters these positive norm bounds.

The current even and odd positive blocks ensure C_N(s)>0 and P_N(-s) nonzero for each s>0. The exact next-pivot sufficient bound therefore uses a legitimate actual inverse. Positivity of Delta at a fixed s alone is insufficient. The signed three-atom example checks exactly: mu0=199/100, mu1=9/10, mu2=0, h1=-81/199; at s=1/4, J=4919/1025 and rho=39601/13975, so Delta>1 despite h1<0. It is explicitly not theta.

For each fixed N, the error is O(1/s) and P_N(-s)^2=s^(2N)(1+O(1/s)), proving the stated residual asymptotic, even when h_N happens to vanish. Constants may depend on N. Scalar J error is amplified by exactly s P_N(-s)^2; the stated precision scale is an error-budget requirement for this sufficient certificate, not a universal lower bound on computational complexity.

For u=r+v, v_original=r-v, the Jacobian is 2 and (u-v_original)^2=4v². The audited J double integral becomes (4pi/d) integral_R C(r)e^(-2d|r|)dr, hence 8pi/d times the positive-halfline integral. Evenness of psi makes C even. At zero C(0)=integral v²psi(v)² and Parseval/integration by parts gives mu0=4pi C(0). The leading large-s term is thus mu0/s with the exact normalization stated.

Accepted scope: a noncircular sufficient next-pivot inequality with explicit positive-norm error bound and scalar precision cost. It does not prove the required inequality uniformly in degree, does not vary the physical arithmetic base, and does not infer signs of the higher spatial Taylor coefficients.

Final explicit-envelope addition also PASS: Leibniz for D^(2j+1)(u^r psi) has coefficient binom(2j+1,ell) r!/(r-ell)!, remaining derivative order k=2j+1-ell and spatial exponent r-ell. Apply the audited positive-parent spatial multiplier E(k,r-ell) at a=lambda=0, then ||psi^(k)||<=64 k!(8/3)^k. Summing absolute known coefficients gives exactly Q_r and B<=2pi(Q1²+Q0Q2). This is explicit but may be factorially costly; no uniform useful margin follows.
