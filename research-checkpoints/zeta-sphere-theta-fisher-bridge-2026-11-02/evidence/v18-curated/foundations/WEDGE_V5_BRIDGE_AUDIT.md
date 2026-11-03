# Independent review: wedge_v5 Green–arithmetic bridge

2 November 2026. Reviewed `hierarchy/wedge_v5/GREEN_ARITHMETIC_BRIDGE.md`, mass certificate script and stored interval output. Exact identities and scoped implications PASS. No global sign result is inferred.

## Finite-head reduction

The previously reviewed bound ||M_n(s_n x)/m_n-exp(-x^2)||_1<=250s_n gives Fourier reserve 250s_n^2 m_n when exp(-(2s_nt)^2/4)sqrt(pi)>=500s_n. This is exactly k_n log(sqrt(pi)sqrt(k_n)/500)>=t^2. Inverting n=(k_n-9)log(k_n/(4pi))/4 yields the stated N(T). The floor 210000 ensures the safe monotone large-k range and previous n>=700 hypotheses. The positive reserve coefficient 2^(2n)/(2n)! is consistent with the exact Laguerre/moment transform normalization. Absolute convergence justifies termwise differentiation and deleting a positive tail. N(T)~T^2/2 checks. This is only a finite-height, high-order result; it leaves L_1 at large height unresolved.

## Green and arithmetic normalization

Multiplication of the two profile arguments by (h-v)(h+v) gives the exact derivative-channel kernel. Consequently

C_b^[1]=(1/4)partial_b^2 C_b-v^2 C_b,
(partial_a^2-4v^2)C_a=4C_a^[1].

The positive Dirichlet Green kernel for -partial_a^2+4v^2 is exactly the stated g, including its continuous v=0 limit. Therefore C_a=m C_A-4 integral g C_b^[1], with the negative forcing sign essential. The ratio m=sinh(2a|v|)/sinh(2A|v|) is PD by the nonnegative strip Poisson representation.

Boundary PD for A>=1/2 uses the known zero strip and paired canonical product: every zero has centered real part strictly between -1/2 and 1/2, and each paired logarithmic-derivative contribution has positive outward real part at A>=1/2. No RH hypothesis enters. Raw meromorphic Epstein data at A=1/2 must not substitute for the finite theta boundary.

With C_b=(1/128)partial_b T_b the exact forcing coefficients are 1/512 for partial_b^3 T_b and -v^2/128 for partial_b T_b. The proposed bridge correctly requires domination of the combined regularized group, not separate singular pieces or its positive parent. Fixed-node relative inequalities cannot be extrapolated to arbitrary Gram matrices.

## Scalar mass budget and interval computation

At v=0, B_a(0)=a C_A(0)/A. Strict increase of C_a(0)/a yields positive cost and q_mass=1-A C_a(0)/(a C_A(0)); its limit is 1-2A m_1/C_A(0). The Gaussian example with alpha>1 correctly demonstrates that even PD cost, small total mass and pointwise domination do not imply relative spectral domination.

Mass certificate: reconstructed the fourth derivative of h sinh(h)psi(h)^2, the Simpson remainder d^5 sup|f''''|/2880 and previously reviewed complete-theta/index tails. Spatial tail 10^-400 is extremely conservative. Stored interval ratios are consistent with C_(1/2)(0) near .015904692955 and q_mass(0+) in (.0116716759,.0116716768). This scalar number is not evidence for the required PD inequality. Requested explicit serialization inflation for raw C endpoints (or outward rounding in any reported decimal enclosure); it is negligible compared with these widened intervals.

Status: bounded independent mathematical/code review, not formal verification and not a claim of RH. External stronger growing-order claims remain separately attributed and are not needed for this self-contained finite-head reduction.

Final serialization check: worker has now added symmetric 10^-30 inflation to both C and the final ratio before endpoint serialization. Inspection confirms the requested repair. Independent iv60 reconstruction with inflated C and m1 encloses the ratio in [0.0116716759616934966440118404410,0.0116716766824769847445238809442]; the worker's wider displayed interval (0.01167167596,0.01167167669) is valid. Clean PASS for the stated finite scalar budget.
