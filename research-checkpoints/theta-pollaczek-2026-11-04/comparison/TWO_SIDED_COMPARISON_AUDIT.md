# Independent audit of the proposed subexponential two-sided comparison

2026-11-04. This audits the mathematical outline supplied by the parent research thread. Verdict: its mechanism is sound, with the necessary clarification that the tail primitive must use the left tail for negative t. Constants below are uniform over all polynomials of degree at most n. Small degrees may be absorbed into the constants, or n+1 used in the auxiliary scales.

## 1. Minimum modulus outside a very small exceptional set

Set f(s)=(s-1)zeta(s), an entire function, and anchor at s_T=2+iT. Absolute convergence of the inverse Euler product gives |zeta(2+iT)|>=1/zeta(2); hence |f(s_T)|>=1/zeta(2). The disk of radius R=15/8 stays in Re(s)>=1/8. Euler summation yields a polynomial-in-(|T|+3) maximum for f there. For bounded T, compactness supplies a uniform constant, including the removable point s=1.

Jensen gives at most Clog(|T|+3) zeros, counted with multiplicity, in radius r2=7/4, since log(R/r2)>0. Let P_T(s) be the product of (s-rho) over these zeros and h_T=f/P_T, with removable factors filled in. On radius R each |s-rho|>=R-r2=1/8, so |h_T|<=exp(Clog(|T|+3)) there and throughout the disk by the maximum principle. Also |P_T(s_T)|<=r2^N, so |h_T(s_T)|>=exp(-Clog(|T|+3)).

The function h_T is zero-free in radius r2. A positive harmonic function U-log|h_T|, with U chosen larger than the established upper bound, satisfies Harnack on radius r1=5/3. It follows that log|h_T|>=-Clog(|T|+3) there. No lower bound on the distances of the zeros from the anchor is needed.

For t in a unit interval centered at T, the point 1/2+it is at distance at most sqrt((3/2)^2+(1/2)^2)=sqrt(5/2)<5/3 from s_T. Outside radius delta=(n+2)^(-6) around the disk's zeros, the product bound is |P_T|>=delta^N. For |t|<=An+1, this yields

    |zeta(1/2+it)| >= exp(-C log^2(n+2)).

Division by |s-1| costs only another polynomial factor, absorbed in the exponent. Covering the specified t range by O(n+1) such intervals and deleting the imaginary projections of delta-neighborhoods of all their zeros removes total length at most

    C(n+1)log(n+2)delta = O(n^(-5)log n).

Projection intervals may overexclude zeros whose real parts lie far from 1/2; that only makes this safe upper bound more conservative. Boundary zeros can be included with multiplicity in the product. All disk-radius gaps are fixed, so no hidden n-dependent Harnack constant occurs.

## 2. Correct tail primitive and pointwise source bound

The exact differential identity is

    (F^2p)' = F(Fp'+2F'p)=F Tp.

The polynomial times F^2 tends to zero at both ends. For t>=0 integrate to +infinity; for t<0 integrate from -infinity. Cauchy–Schwarz gives

    |F(t)|^4 |p(t)|^2 <= X[p] I(t),

where I(t) is the appropriate tail integral of F^2. The coarse true-theta envelope proves

    I(t)<=C(1+|t|)^M exp(-c|t|).

Using the right tail at negative t would be incorrect: it is not small there. The left/right formulation removes this issue for all polynomials, without a parity assumption.

On the good set, the amplitude lower bound and the zeta minimum-modulus bound give

    |F(t)|>=exp(-c|t|/2-C log^2(n+2))

up to a constant absorbed in C. For |t|<=An+1, the tail polynomial factor can also be absorbed. Hence

    X[p]>=exp(-C log^2(n+2)) exp(-c|t|)|p(t)|^2

at every such good point. No division by F at its zeros is used.

## 3. Localization and stability of a weighted maximum

For nonzero p define M=sup_t |p(t)|exp(-c|t|/2), attained because the weighted polynomial decays. For n>=1 put B=8n/c, so A=16/c and 2B=An. On [-B,B], |p|<=M exp(cB/2). The Chebyshev exterior inequality implies, for |t|>=2B,

    |p(t)|exp(-c|t|/2)/M
       <= exp(cB/2+n log(2|t|/B)-c|t|/2).

At |t|=2B its exponent is n(log4-4)<0, and its derivative in |t| is n/|t|-c/2<0. Thus a maximizing point t_* lies strictly inside [-An,An]. This is a valid use of the globally defined M: the strict exterior factor excludes all global maximizers there.

On [t_*-1,t_*+1], Markov gives

    |p'|<=n^2 exp(c(|t_*|+1)/2)M.

Therefore |p(t)|>=3|p(t_*)|/4 whenever

    |t-t_*| <= (4exp(c/2)n^2)^(-1).

The resulting interval lies in [-An-1,An+1]. Its length is of order n^(-2), larger than the total excluded measure. It therefore contains a good point, where the exponential weight differs from its value at t_* by a bounded factor. Section 2 then gives

    X[p]>=exp(-C log^2(n+2)) M^2.

## 4. Scalar norm from the weighted maximum

Use W_4(t)<=C(1+|t|)^7 exp(-c|t|). On [-2B,2B], integration gives at most C(n+1)^8M^2. Outside, the squared exterior exponent is

    cB+2n log(2|t|/B)-c|t|.

It is negative by a fixed multiple of n at 2B, and its derivative is <=-7c/8 thereafter. Integration against (1+|t|)^7 thus bounds both tails by C(n+1)^7M^2 (indeed with an additional exponential gain). Hence

    ||p||_W4^2 <= C(n+1)^8 M^2.

Combining with section 3 and absorbing the polynomial factor proves the proposed lower form bound.

## 5. Upper form bound and consequences

In the W_4-orthonormal Pollaczek basis, each derivative column has squared norm at most pi^2/8, by the independently audited derivative identity. Thus on degree at most n the squared Hilbert–Schmidt norm, and hence the squared operator norm, is at most (n+1)pi^2/8. The pointwise source majorant gives

    X[p]<=C(n+1)||p||_W4^2.

Together these establish

    exp(-C log^2(n+2))||p||_W4^2
        <= X[p] <= C(n+1)||p||_W4^2.

For the monic W_4 minimizer M_n with b_n=||M_n||_W4^2=(4pi/2^8)n!Gamma(n+8), taking infima in the lower inequality and using the stronger individual competitor upper bound gives

    exp(-C log^2(n+2)) b_n <= A_n <= C b_n.

Its actual selected leverage A_n/X[M_n] is at least exp(-C'log^2(n+2)). In the reference W_4-orthonormal basis the actual X Gram spectrum lies in the two displayed form bounds, so its condition number is at most exp(C'log^2(n+2)). A basis that is merely normalized, but not reference-orthogonal, does not receive this spectral conclusion without further control; use the precise phrase “W_4-orthonormal Pollaczek basis.”

These are subexponential rather than bounded or 1+o(1) comparisons. They do not imply selected derivative decay, endpoint leverage bounded away from zero, Delta positivity, or coherence. The all-polynomials argument itself uses no selected polynomial asymptotic and no inverse-gap hypothesis.

## Final-file audit

Read ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md on 2026-11-04 after the outline audit. Its equations (1)–(21) and stated consequences pass. The necessary left/right tail distinction is explicitly implemented, and the reference coordinates are correctly specified as W-orthonormal Pollaczek polynomials.

Additional checks on the final text:

- The Harnack factor is exactly (7/4+5/3)/(7/4-5/3)=41.
- Section 4's polynomial factor cancellation is valid: the amplitude fourth power supplies (1+|t|)^7, matching the coarse tail majorant's seventh power.
- Section 6's derivative bound -7c/16 is correct for the unsquared exponent, since n/|t|-c/2 <= c/16-c/2 when |t|>=16n/c. After squaring the decay rate is at least 7c/8.
- The argument covers all real polynomials of degree at most n, including mixtures of parities. The small-degree adjustment follows from positive definiteness and is legitimate.
- Individual X normalization also preserves the claimed subexponential condition-number bound. More explicitly, put a_n=exp(-C log^2(n+2)), and let D=diag(d_j), with a_n<=d_j<=C_1. From a_n I<=G<=C_2(n+1)I, the congruent matrix D^(-1/2)GD^(-1/2) has smallest eigenvalue at least a_n/C_1 and largest eigenvalue at most C_2(n+1)/a_n. Its condition number is at most C_1C_2(n+1)/a_n^2, of the required form after enlarging C.
- For X[q_n]=1, the lower form inequality gives ||q_n||_W^2<=exp(C log^2(n+2)). Parseval in the W-orthonormal basis therefore proves the stated quadratic coefficient bound exactly. The triangular normalized diagonal bound follows independently from the exact leverage identity.
- The final limitations correctly distinguish subexponential extremal control from bounded relative error, uniform conditioning, H/X decay, and selected coherence. No substantive wording overreach was identified.

No mathematical corrections to the final file are required by this audit. The file still labels itself as pending final independent audit; that status can now be updated to reflect this internal audit, without suggesting external peer review or machine formalization.
