# Independent audit of the finite Euler-ratio and Poisson/OU interpretations

19 October 2026. Local mathematical and source-bound review. No publication or laboratory validation was performed.

## Decision

**PASS for the precise finite-model claims in the frozen final v2 inputs recorded in `FINAL_REVIEW_MANIFEST.json`. No blocking mathematical error was found.** The results are an ideal passive realization of a normalized finite Euler ratio and an exact Gaussian realization of a specified covariance. Neither is an established new physical law, a completed-xi realization, a self-adjoint zeta Hamiltonian, or a proof or strengthening of RH.

The review is independent of the authors' numerical receipts. It includes direct derivations, exact symbolic identities, 80 independently assembled OU covariance examples with generic frequencies and signed weights, and 1,000 contractivity checks inside the complex unit disk. The tests corroborate the derivations; they are not interval certificates. Maximum sampled covariance disagreement was 1.67e-14, tail-variance disagreement 2.77e-13, and singular-value excess 4.45e-16.

The review covers:

- `PASSIVE_DELAY_REALIZATION_v1.md` and its diagnostic script/receipt.
- `POISSON_OU_AND_PRIME_BEAT_CORRESPONDENCE_v1.md` and its diagnostic script/receipt.
- The original Poisson-tail note and dyadic near-frequency note identified in the receipt.
- `CAUCHY_CARRIER_MEASUREMENT_ADDENDUM_v1.md`, inspected separately after the initial receipt. Its hash and the pinned repository source hashes are recorded in `source_binding.json`.

The v1 review below records suggested clarifications. Final clarification-only v2 deltas were then read and accepted: the passive note states the two-forward-channel convention and nonattainment of the multiprime supremum; the measurement addendum includes the exact global minimum and resulting log-error allowance; the OU note explicitly states nonstationarity, the scalar/full-state Markov distinction, and the need for precision control at very large carriers. These edits do not repair failed core formulas. The scripts and numerical receipts are unchanged. Any later revision needs a delta review and new source hashes.

## 1. Object identification and source provenance

The pinned project note defines V_Q(s)=product_(p<=Q)(1-p^(-s-h))/(1-p^(-s)) and L_Q(t)=log|1/V_Q(sigma+it)|. The passive device realizes C_opt/V_Q, as claimed. It does not realize V_Q without inversion, the completed xi ratio, or the application's additive deformedZTL observable.

The copied `twin-ladder.js` was read directly. Its `deformedZTL` function adds each prime's ladder contribution using `cAdd`; it does not multiply Euler factors. Its rung weights and phase agree with the passive note's description. The copied `one-sided-euler-harmonic-criterion.md` was read directly and supplies the displayed V_Q, logarithmic coefficient, and corridor parameter definitions. The supplied repository ref is 5a23eaa65afd6a53ad637eaac0ebe625bdb4e1e2. Independent Git-blob hashing of the copied bytes agrees with the recorded connector blob IDs; this binds the local review to those exact source objects, without claiming a new remote checkout was performed.

The original tail and dyadic notes were also read. The new OU note preserves the negative image term, the full actual weighted variance, the separate signed mean requirement, and the constant loss in the dyadic sufficient criterion. It does not claim the variance estimate solves the missing arithmetic budget.

## 2. Passive ring/Mach–Zehnder construction

Assumptions are sigma>0, h>0, tau0>0, q0=p^(-sigma), q1=p^(-sigma-h), tau_p=tau0 log p, and z=exp(-lambda tau_p). These give 0<q1<q0<1. Physical lambda has inverse-time units and mathematical height is t=omega tau0. On the causal half-plane Re(lambda)>=0, |z|<=1.

The coefficients satisfy A+B=1, A>0, B>0, A+Bq1=c, and Aq1+B=cq0. Therefore H=A+BJ=c(1-q0z)/(1-q1z). The ring J=(q1-z)/(1-q1z) is analytic in |z|<1, obeys |J|<=1 there, and has unit modulus on the circle. Consequently U^T diag(1,J) U is contractive inside the disk and unitary on its boundary. This is a stronger check than merely locating stable poles.

For a first-port input the second amplitude is sqrt(AB)(J-1). Direct expansion gives

|H|^2+AB|J-1|^2=A+B|J|^2,

which equals one on the frequency axis and is at most one inside the disk. The cascade dump-port identity telescopes correctly. This is steady-state power conservation. In a transient, the delay lines also store energy; one must not interpret the frequency identity as pointwise instantaneous equality between input and output powers. Terminating a port or ignoring its output does not remove it from the physical energy/noise accounting.

The elementary lossy-ring construction also checks: r=p^(-h/2), ell=p^(-sigma-h/2) gives r ell=q1 and ell/r=q0, with the stated attenuator output restoring total boundary power.

The geometric expansion has causal delayed taps with absolutely summable amplitudes because q1<1. Thus the finite cascade is causal and BIBO stable under zero initial conditions. The stated poles are lambda=-(sigma+h)/tau0+2pi i k/(tau0 log p), and its zeros have real part -sigma/tau0. At h>0 their differing real parts preclude pole-zero cancellation. The shared k=0 pole has the expected cascade multiplicity. At h=0 every through factor is identically one; claiming its uncancelled pole ladder at that endpoint would be wrong, but the note correctly states the cancellation.

A finite number of ideal rings still has infinitely many longitudinal delay modes. It is not a finite-dimensional continuous-time matrix ODE realization. Finite state models, digital delays on a common sample clock, and physical nondispersive-delay approximations require stated bandwidth and error allowances. The note handles the relevant ideal-component assumptions and distinguishes amplitude from intensity decay.

## 3. Sharp normalization and infinite-cutoff boundary

The derivative of the squared unnormalized modulus with respect to u=Re(z) is

-2(q0-q1)(1-q0q1)/(1+q1^2-2q1u)^2<0.

Thus each factor is maximized at z=-1 and has maximum (1+q0)/(1+q1). Unique factorization proves rational independence of finitely many log primes. The continuous torus flow is dense: all nontrivial integer Fourier characters have a nonzero frequency and their long-time averages vanish. No independence of 1 and the log primes is needed for this continuous-time statement. Continuity then proves the product supremum and the sharp global scalar ceiling C_opt.

For at least two distinct primes, the supremum is not attained at any finite frequency: simultaneous z_p=-1 would make log p/log q an odd-integer ratio, contradicting unique factorization. The phrase that the construction 'achieves equality' means that its scalar multiplier equals the optimal ceiling; it does not mean an exact finite-frequency all-channel transmission peak. Adding this explicit distinction is recommended. The result supplies no extremizing frequency in a chosen finite measurement band.

The proof C_opt(Q)->0 for fixed h>0 and 0<sigma<=1 is correct, including the elementary divergence argument. It rules out one nonzero scalar multiplier that makes every cutoff's exact response passive at all real frequencies. It does not rule out finite-band approximations, other renormalizations, or a completed-function construction. Nor does normalization collapse alone justify exchanging the cutoff and frequency limits.

For contrast, when sigma>1 the normalization has a positive limit and ordinary Euler products converge absolutely; this familiar regime is compatible with the finite construction. It does not extend an ordinary Euler-product realization into the critical strip. The existing note makes no invalid infinite-cutoff claim.

## 4. Exact Cauchy/OU covariance and positive variance

For U~Cauchy(T,x), x>0, and nonnegative lambda, mu, the characteristic function gives mean exp(-x lambda)cos(T lambda). Product-to-sum and centering give exactly

K(lambda,mu)=1/2 [exp(-x|lambda-mu|)-exp(-x(lambda+mu))]cos(T(lambda-mu)).

The zero-start complex SDE dZ=-(x+iT)Z d lambda+sqrt(x)(dW1+i dW2), with independent standard real Brownian motions, has E[Z(lambda)Z(mu)]=0 and the stated conjugate covariance. Taking real parts supplies precisely K, with no factor-of-two error. The separate deterministic mean in S_G is necessary and is present. A stationary initialization would incorrectly remove the negative image term.

The exact finite recursion has independent quadrature variances (1-exp(-2x Delta))/2. Expanding the weighted readout in its innovations gives the backward recursion and sum q_j|B_j|^2. Independent direct assembly of the full real Gaussian innovation matrix gives the same covariance and positive variance. The continuous noise integral and change v=exp(r) recover the existing positive nested-tail formula without changing weights or endpoints.

The full finite-prime logarithm has infinitely many prime-power taps, but absolute coefficient summability for fixed finite Q and sigma>0 justifies the stated L2 extension. Its truncation allowance is valid. This is distinct from an unproved infinite-prime limit.

The SDE is a two-dimensional Gaussian Markov process with zero start. Its scalar real projection generally is not Markov when the rotation rate is nonzero. The zero-start process is nonstationary. The authors plan to make both statements explicit; this is recommended.

## 5. Fourth moments, Fourier smoothing, and controls

The one-mode variance, fourth central moment, and fourth cumulant in equation (10) pass exact symbolic checking. At lambda=log 2, x=1/2, T=0, the cosine ensemble has variance 1/4 and fourth central moment 13/32; the matched Gaussian has fourth moment 3/16. The small-width fourth-moment asymptotic and divergent kurtosis follow correctly. Covariance matching does not authorize Gaussian clipping or tail estimates for the original common-Cauchy model.

The kernel k_L(v)=L/(2pi)sinc^2(Lv/2), with sinc z=sin(z)/z, integrates to one and has transform (1-|delta|/L)_+ under the declared angular-frequency convention. This follows directly by convolving two rectangular Fourier windows. It proves the stated near-energy convolution identity with the correct normalization. The finite-sweep tail allowance is conservative and valid.

Unique factorization excludes distinct first-prime ratio degeneracies and nontrivial integer relations. It does not exclude prime-power harmonics in the full logarithm. The broad-Cauchy-width finite-torus limit, fourth cumulant -3/8 sum a_p^4, and log(2)+log(3)=log(6) third-moment example all check. Generic rationally independent frequencies have the same no-relation property, so the note appropriately requires nonprime controls and does not claim prime-exclusive stochastic physics.

The conditional Cauchy truncation mean, raw-second-moment, and variance allowances in the OU note are valid. Signed programmed phase coordinates avoid an erroneous negative-waiting-time interpretation. Physical time rescaling of Brownian noise in the OU implementation is dimensionally correct.

## 6. Randomized-carrier addendum

Sampling omega=(T+xY)/tau0 with standard Cauchy Y gives log|H_Q(i omega)|-log C_opt=L_Q(T+xY) exactly in the ideal finite transfer model. Unlike the Gaussian surrogate, this protocol reproduces the entire finite logarithmic distribution. M_Q=sum b=log V_Q(sigma) correctly bounds |L_Q|. The omitted clipped-integral bound and the factor 1-epsilon_R multiplying a retained conditional expectation are both correct.

The conservative additive-field-error logarithmic bound is valid when eta<|H|. A useful optional strengthening, checked independently, is the global finite-Q lower bound

|H_Q(i omega)|>=m_Q=C_opt exp(-M_Q)>0,

attained at omega=0. Then eta<m_Q supplies a uniform log-error bound -log(1-eta/m_Q). The attenuation removal remains an error-amplification issue, not a free physical recovery operation. No actual detector precision or sample complexity has been established.

## 7. Primary-source and claim audit

The following source claims were checked against accessible primary articles or their primary abstracts:

- Lifshits and Weber, arXiv:0802.0071, introduction and equation (1), explicitly describes the log-prime torus supremum reduction via Bohr/Kronecker. The finite product application is additionally proved directly in the note. https://arxiv.org/pdf/0802.0071
- Darmawan, Landobasa, and Chin (2005), DOI 10.1364/OPEX.13.004580: the authors' abstract confirms ring-assisted Mach–Zehnder phase synthesis predates this work. The reviewer independently accessed the primary abstract via PubMed; direct DOI full text was unavailable in the browsing tool. The exact ring formula was independently derived from the displayed coupler equations, so acceptance of that formula does not rest on an inaccessible paper. https://pubmed.ncbi.nlm.nih.gov/19495372/
- Fan, Suh, and Joannopoulos (2003), original author-hosted PDF, confirms energy-conservation and time-reversal restrictions on coupled-mode coefficients. https://web.stanford.edu/group/fan/publication/Fan_JOSAA_20_569_2003.pdf
- Foreman-Mackey et al., arXiv:1703.09710, primary abstract, establishes complex-exponential Gaussian covariance modeling and stochastic-oscillator context. It does not prove this Cauchy ensemble is Gaussian. https://arxiv.org/abs/1703.09710
- Särkkä and Hartikainen (2012), PMLR original article page, describes covariance-to-SDE methods. https://proceedings.mlr.press/v22/sarkka12.html
- Loper et al. (2021), JMLR original article page, gives context for stable state-space representations, not a special prime theorem. https://www.jmlr.org/beta/papers/v22/21-0072.html
- NIST DLMF 27.4.3 states the ordinary zeta Euler product in Re(s)>1, consistent with the finite/infinite distinction. https://dlmf.nist.gov/27.4.E3

No broad novelty search was performed. The notes correctly avoid first-in-literature, experimental success, universal spectral, Hamiltonian, and RH claims. They may be described as independently checked finite mathematical constructions under declared engineering assumptions. They must not be described as experimental evidence, a discovered natural law, or progress closing the unresolved all-carrier arithmetic criterion.
