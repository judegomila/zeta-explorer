# Independent audit: Müntz theta commutator test

2026-11-03. Analytic PASS, including the final polynomial-cutoff domain paragraph. No acquired code executed.

Primary source independently read: https://arxiv.org/html/math/0505453v1 . Formula (1.1), Theorem 2.1/formula (2.10) give the stated subtracted operator and Mellin identity in 0<Re s<1. The Gaussian satisfies its smoothness and decay hypotheses. The source's general sufficiency criterion requires compact support; the note correctly does not apply that criterion to this noncompact Gaussian.

The Gaussian integral is 1/2. D acts under Mellin transform as -s, so D(D+1) gives s(s-1), producing xi exactly. Poisson reflection gives Pphi=-1/2 plus a rapidly decaying correction at x=0, while its infinity counterterm is -1/(2x). Both elementary terms are annihilated; the resulting k has convergent Mellin integral for every s. Direct differentiation of exp(-Z_n) gives (4Z_n^2-6Z_n)exp(-Z_n), agreeing with the displayed k and psi=2exp(u/2)k(exp u). Therefore F(t)=2xi(1/2+it) has the original normalization.

The weighted Mellin transform is unitary after logarithmic coordinates, and X=log x maps to -i partial_t. Thus [X,T] is zeta'(sigma+it), with a plus sign. For sigma>1, ||K_n||=n^(-sigma), so both the plain dilation sum and its log-weighted commutator converge in operator norm. The physical subtracted counterterm is not admissible as that exterior L2 operator. In the critical strip the natural multiplication operator need not be bounded, but the compact smooth Mellin core supports the stated algebra. The pole line is deliberately excluded for the separate arithmetic factor; the completed multiplier is used directly there.

For the complete multiplier, [X,A]=xi', and A*[X,A]+[X,A]*A=2Re(conj(xi)xi'). Gamma decay and polynomial zeta growth make this bounded at each fixed vertical line. Functional symmetry relates F(t+ia)=2xi(1/2-a+it) to the sigma=1/2+a expression; the normalized bridge is 4Re(conj(xi)xi')/a=(2/a)B. The product expansion preserves both arithmetic and gamma terms and is nonsingular at zeta zeros in the stated non-pole domains.

Actual polynomial p is not an L2 test vector. The appended smooth-cutoff definition of the completed form has a well-defined absolutely convergent limit by Gamma decay. Arithmetic-only sign tests instead use compact smooth L2 vectors, as required.

For sigma>1, q=Re(zeta'/zeta) has an absolutely uniformly convergent prime-power cosine series, strictly negative value at zero, zero long-interval mean, and nonzero Fourier coefficient at log2 equal to -log2/(2*2^sigma). If it were everywhere nonpositive, mean |q| would be zero and the absolute-integral bound would force that coefficient to vanish. Hence q has a positive value as well. Continuity and nonvanishing zeta give open intervals with both signs for the arithmetic Hermitian commutator. Genuine core test functions supported there prove indefiniteness.

Accepted scope: exact full-theta operator representation and an unconditional failure of arithmetic norm-square positivity to imply a positive bridge commutator. It neither contradicts the independently positive completed exterior bridge nor extends the prime-power sign analysis into the critical strip. No Gaussian Nyman-Beurling equivalence, all-degree payment, new target sign, or full atomic-dual witness follows.
