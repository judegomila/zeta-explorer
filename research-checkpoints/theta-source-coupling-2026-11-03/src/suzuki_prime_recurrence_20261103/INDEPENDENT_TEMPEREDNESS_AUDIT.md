# Independent audit of global temperedness

Verified 2026-11-03 against the current primary-source HTML at https://arxiv.org/html/2606.09096v1#S2.SS5 and the v4 PDF https://arxiv.org/pdf/2206.03682.

## Verdict

For the actual continuous even function g = -Psi, interpreted initially as an element of D'(R), the equivalence

    RH iff g extends to S'(R) iff g'' extends to S'(R)

is rigorous. Here “extends” means agreement on all compactly supported smooth tests. This formulation does not assume absolute integrability against every Schwartz function, nor pointwise polynomial growth. The scratch note has one residue-coordinate imprecision, not a fatal gap.

## Source check

The current 2026 HTML §2.5 really states: “Since g is continuous, the distributional second derivative −g″ is a tempered distribution.” The displayed local convolution formulas immediately following it do not need global temperedness.

Suzuki 2023, Theorem 1.1, gives integral_0^infinity Psi(t)e^(izt)dt = -z^(-2)(xi'/xi)(1/2-iz) for Im z > 1/2, and Psi(t) = sum_gamma (1-cos(gamma t))/gamma^2. The sum counts all zeros of xi(1/2-iz) with multiplicity, not just positive ordinates. Theorem 1.1(3) supplies the unconditional growth estimate O(exp(t/2-c sqrt(t))), which in particular justifies absolute convergence in that half-plane. Its Theorem 1.6 states boundedness equivalent to RH.

## Distribution and Laplace details

Suppose g has a tempered extension T. Choose a smooth step theta with theta=0 for t<=-1 and theta=1 for t>=1. All its derivatives are bounded, so theta T is tempered. The locally integrable compactly supported function (1_[0,infinity)-theta)g defines a tempered distribution. Their sum T_+ is tempered and equals the regular distribution 1_[0,infinity)g on compact tests; its support lies in [0,infinity). This uses the known local integrability of g; multiplying an arbitrary distribution by the Heaviside function would not be legitimate.

Choose chi smooth, zero for t<=-2 and one for t>=-1. Then chi(t)e^(izt) belongs to S(R) whenever Im z>0. Set L(z)=<T_+,chi e^(izt)>. The test equals e^(izt) in a neighborhood of the support, and changing chi does not change the pairing. On compact subsets of the upper half-plane, all z-derivatives (it)^k chi e^(izt) obey the Schwartz seminorm bounds uniformly. Thus this map is holomorphic in the Schwartz topology and L is holomorphic. A finite-order tempered bound also gives, on 0<Im z<=B, a bound of the shape C_B(1+|z|)^N(1+(Im z)^(-M)) for suitable finite N,M. No such quantitative estimate is needed for the contradiction.

For Im z>1/2, apply compact cutoffs tending to one. They converge in Schwartz topology after multiplication by chi e^(izt), and the ordinary integrals converge by the unconditional exponential bound. Therefore L(z)=z^(-2)(xi'/xi)(1/2-iz) there.

## Continuation without topology ambiguity

Let F(z)=xi(1/2-iz). The two holomorphic functions z^2 L(z)F(z) and xi'(1/2-iz) coincide on Im z>1/2. The identity theorem gives equality on the entire connected upper half-plane. If F has a zero z_0 there of multiplicity m>=1, its left side has vanishing order at least m, whereas the right side has order exactly m-1. Contradiction. This avoids any need to argue separately that the complement of the poles is connected.

Equivalently, for rho=beta+i tau, z_0=i(rho-1/2)=-tau+i(beta-1/2). A zero with beta>1/2 gives a pole in the upper half-plane. IMPORTANT COORDINATE CORRECTION: xi'/xi has residue m as a function of s, but its composition with s=1/2-iz has residue i m as a function of z. The residue of z^(-2)(xi'/xi)(1/2-iz) is therefore i m/z_0^2, which is nonzero. Functional-equation symmetry then rules out beta<1/2. Multiplicities do not cancel.

Under RH, all gamma are real and nonzero, and sum_gamma |gamma|^-2 is finite (with multiplicities). Hence |Psi(t)|<=2 sum_gamma |gamma|^-2, proving temperedness.

## Second derivatives

Differentiation preserves S'. Conversely, fix eta in S with integral one and define

    P phi(t)=integral_{-infinity}^t [phi(s)-eta(s) integral_R phi] ds.

P is continuous S->S, and P(phi')=phi. Given V in S', U(phi)=-V(P phi) satisfies U'=V. Apply this twice to a tempered extension of g''. The resulting U obeys (g-U)''=0 in D', so g-U is an affine polynomial. Thus g extends to S'. This part is a general distribution theorem and requires no RH-specific regularity beyond g being a distribution.

## Local/global boundary

For every finite a, choose eta_a in C_c^infinity equal to one on an open neighborhood of [-2a,2a]. Then eta_a g is compactly supported and tempered, and -(eta_a g)'' agrees with -g'' near that difference set. Thus compact-window kernel formulas and their integration-by-parts identities on compactly supported smooth tests are unconditional. More generally, convolution of any distribution with a compactly supported smooth test function is defined and smooth, without temperedness.

This local repair does not establish global Fourier factorization, a uniform family of tempered seminorm bounds as a tends to infinity, or arbitrary operator-domain conclusions. Each would need its own hypotheses and dependency audit. The isolated wording issue is not by itself a disproof of any other theorem in the preprint.
