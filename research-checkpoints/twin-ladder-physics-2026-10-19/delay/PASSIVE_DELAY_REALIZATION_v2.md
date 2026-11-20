# A passive finite-prime delay network for the twin-ladder Euler ratio

19 October 2026. Version 2, prepared for independent review. No hardware experiment, external peer review, publication, new physical law, or RH theorem is claimed.

## Main result and exact scope

The reviewed finite Euler ratio admits an explicit finite-component passive scattering realization after a necessary, optimally chosen scalar attenuation. The device is a cascade of ring-assisted Mach–Zehnder interferometers with round-trip delays proportional to log p. Its poles have one common decay rate, its transmission zeros have another, and their separation is the analytic shift h divided by a physical time scale. These are concrete, falsifiable device predictions under the stated ideal-component assumptions.

The construction realizes the **inverse finite Euler ratio**, not the completed xi ratio, the complete proposed twin pairing, or the app's additive ladder sum. Each ideal delay loop has infinitely many longitudinal modes. Thus “finite” here means finitely many prime-indexed components, not a finite-dimensional continuous-time Hamiltonian or ODE.

## 1. Which project object is being realized?

At repository commit 5a23eaa65afd6a53ad637eaac0ebe625bdb4e1e2 the reviewed PR12 note defines

V_Q(s) = product_{p <= Q} (1-p^(-s-h))/(1-p^(-s)),

L_Q(t) = log|1/V_Q(sigma+it)|
       = -sum_{p <= Q} sum_{j >= 1} b_{p,j} cos(j t log p),

b_{p,j} = (1-p^(-jh)) p^(-j sigma)/j.

Here Q is finite, sigma>0 and h>0. These logarithmic series converge absolutely for each finite Q. The current quantitative corridor uses sigma=417/500 and h=1/8. The prime-square refinement retains j=1 and j=2 jointly, and does not replace their covariance by independence.

Source: [reviewed Euler criterion](https://github.com/judegomila/mathexplorer/blob/5a23eaa65afd6a53ad637eaac0ebe625bdb4e1e2/research-checkpoints/twin-curve-2026-10-18/one-sided-euler-harmonic-criterion.md).

A separate source object, [src/math/twin-ladder.js](https://github.com/judegomila/mathexplorer/blob/5a23eaa65afd6a53ad637eaac0ebe625bdb4e1e2/src/math/twin-ladder.js), uses rungs

p^(-m/2) exp(-i m T log p) exp[-beta m log p - P(m log p)^2]

and explicitly sums the ladder contributions across primes. It documents that deformedZTL is additive, not an Euler product. Nothing below silently identifies these two objects.

The centered completed bridge used elsewhere in the project is R_a(w)=X(w-a)/X(w+a), X(w)=xi(1/2+w). Identifying the zeta part with V_Q would require s=1/2+w-a and h=2a, followed by the completion factor and a justified infinite-cutoff limit. Those are separate requirements; the present device supplies neither. In particular h must not be confused with an unrelated cutoff exponent also denoted a in some corridor estimates.

## 2. Physical variables and assumptions

Let lambda be the physical Laplace variable, with units s^(-1), and let tau0>0 be a fixed time in seconds. For prime p choose

 tau_p = tau0 log p,
 z_p(lambda) = exp(-lambda tau_p),
 q0_p = p^(-sigma),
 q1_p = p^(-(sigma+h)).

Then 0<q1_p<q0_p<1. We use signals proportional to exp(+i omega t_phys), so a causal delay multiplies the frequency response by exp(-i omega tau_p). The mathematical spectral height is t=omega tau0. No advanced-time delay is used.

The target response is

 W_Q(lambda) = 1/V_Q(sigma+lambda tau0)
             = product_{p <= Q} (1-q0_p z_p)/(1-q1_p z_p).

Extra physical assumptions are: linear coherent wave propagation; ideal frequency-independent couplers over the test band; calibrated relative phases; negligible backreflection between stages; independently adjustable delays; and either ideal lossless loops or explicitly modeled loop loss. Common through-propagation delays can be calibrated out. For optics the frequency coordinate can be detuning about a carrier; constant carrier phases must be aligned separately. Actual dispersion, parasitic couplings, and fabrication tolerances break exactness and must be measured. These are engineering assumptions, not consequences of zeta identities.

## 3. An elementary lossy-ring construction

For one prime write q0=q0_p, q1=q1_p and z=z_p. A lossless coupler with r^2+k^2=1 obeys

 [b; v] = [[r,k],[-k,r]] [u; w],       w=ell z v.

Solving this feedback connection gives

 H_ring(z)=b/u=(r-ell z)/(1-r ell z).

Choose r=p^(-h/2), ell=p^(-(sigma+h/2)). Then

 H_ring(z)=r (1-q0 z)/(1-q1 z).

Passivity is proved, not inferred from the word “ring”: for |z|=1,

 1-|H_ring(z)|^2 = (1-r^2)(1-ell^2)/|1-r ell z|^2 >= 0.

An auxiliary output from the loop attenuator has amplitude

 G_ring(z)=-sqrt((1-r^2)(1-ell^2)) z/(1-r ell z),

so |H_ring|^2+|G_ring|^2=1. A physical attenuator can be represented by a second lossless coupler into an unobserved port. Quantum use would require that port's input noise as well; deleting it does not produce a unitary one-port device.

A cascade realizes C_ring W_Q with C_ring=product p^(-h/2). This elementary construction is extremely inefficient at large cutoffs. Section 4 removes its avoidable attenuation.

## 4. An optimally normalized lossless-interferometer construction

Define

 c=(1+q1)/(1+q0),
 A=(1-q0 q1)/[(1+q0)(1-q1)],
 B=(q0-q1)/[(1+q0)(1-q1)].

Then A>0, B>0, A+B=1. Use a **lossless** ring with self-coupling q1 and round-trip delay z:

 J(z)=(q1-z)/(1-q1 z).

Its boundary modulus is exactly one. Put that all-pass response in one arm of a Mach–Zehnder interferometer. A real orthogonal splitter/recombiner

 U=[[sqrt(A),-sqrt(B)],[sqrt(B),sqrt(A)]]

gives the two-port matrix

 S(z)=U^T diag(1,J(z)) U.

This forward two-channel scattering matrix is analytic and contractive for |z|<1, and unitary for |z|=1. The channels have two incoming and two outgoing field amplitudes; this notation does not discard a backward-scattering channel if one is physically present. Its first-input through amplitude and auxiliary output are

 H_p(z)=A+B J(z)=c (1-q0 z)/(1-q1 z),
 G_p(z)=sqrt(A B)(J(z)-1).

The displayed equality follows by matching the numerator coefficients:
A+B q1=c and A q1+B=c q0. Consequently

 |H_p|^2+|G_p|^2=1

at every real frequency. Terminating the auxiliary port makes the observed through channel passive; retaining it makes the energy accounting explicit. In a cascade, incident energy is distributed among the final through output and all auxiliary outputs. With through factors H_1,...,H_N, the kth dump amplitude is G_k product_{j<k}H_j, so the total-power identity telescopes to one. There is no unaccounted gain.

The full through response is therefore

 H_Q(lambda)=C_opt(Q) W_Q(lambda),
 C_opt(Q)=product_{p <= Q} (1+p^(-(sigma+h)))/(1+p^(-sigma)).       (1)

This uses standard ring-assisted interferometer architecture. The project-specific derivation is the exact parameter assignment and the normalization analysis; no priority claim for optical-filter synthesis is made. Ring-assisted MZI phase synthesis predates this work: [Darmawan, Landobasa and Chin, Optics Express 13 (2005), 4580–4588](https://doi.org/10.1364/OPEX.13.004580). Their research article gives the all-pass ring transfer and discusses its use within an MZI. Coupled-mode passivity requires actual conservation constraints: [Fan, Suh and Joannopoulos, JOSA A 20 (2003), 569–572](https://web.stanford.edu/group/fan/publication/Fan_JOSAA_20_569_2003.pdf).

## 5. Why this scalar attenuation is necessary and sharp

For one factor on |z|=1, with u=Re z,

 |(1-q0 z)/(1-q1 z)|^2=(1+q0^2-2q0 u)/(1+q1^2-2q1 u).

Its derivative in u is

 -2(q0-q1)(1-q0 q1)/(1+q1^2-2q1 u)^2 < 0.

Thus the largest modulus is (1+q0)/(1+q1), reached at z=-1. The normalized factor in Section 4 is exactly contractive, with equality there.

Distinct log primes are rationally independent, by unique factorization. The continuous frequency trajectory (exp(-it log p))_{p<=Q} is therefore dense in the finite torus. For completeness, every nonconstant integer character has a nonzero frequency sum k_p log p, whose mean over [-T,T] tends to zero; trigonometric approximation gives equidistribution and hence density. Applying this to the continuous product of factor moduli yields

 sup_{omega in R}|W_Q(i omega)|
   = product_{p<=Q} (1+p^(-sigma))/(1+p^(-(sigma+h)))
   = 1/C_opt(Q).                                             (2)

For at least two distinct primes this supremum is not attained at any finite real frequency: simultaneous phases z_p=z_q=-1 would make log p/log q a ratio of odd integers, contradicting unique factorization. A single-prime maximum is attained.

An explicit research treatment of the log-prime torus supremum principle is [Lifshits and Weber, On the Supremum of Some Random Dirichlet Polynomials, introduction](https://arxiv.org/abs/0802.0071). The application to this finite product follows directly by continuity as above.

Any power-normalized passive scalar through response equal to a constant C times W_Q at **all** real frequencies must satisfy |C|<=C_opt. Section 4 achieves equality. This is a global-frequency statement; it does not assert that the nearly extremizing frequencies lie in any specified finite measurement band, or in a carrier window used by the RH program.

For 0<sigma<=1 and fixed h>0, C_opt(Q) tends to zero. Indeed

 log(1+p^(-sigma))-log(1+p^(-(sigma+h)))
 >= (1-2^(-h)) p^(-sigma)/(1+2^(-sigma)),

and sum_p p^(-sigma) diverges. The latter follows for sigma<=1 from Euler's divergence of sum_p 1/p. One elementary justification: convergence of sum_p 1/p would bound the partial Euler products product_{p<=Q}(1-1/p)^(-1), while these products dominate sum_{n<=Q}1/n, a contradiction.

Therefore no cutoff-independent nonzero scalar attenuation makes these exact uncompleted Euler-ratio transfers globally passive in this range. This does not obstruct an unrelated realization of the completed bridge, finite-band approximations, or a differently renormalized limit. It does rule out treating passive normalization removal as a free physical operation.

At sigma=.834, h=.125, the known scalar amplitude normalization costs -20 log10 C dB:

| Q | Prime count | Elementary ring C_ring | Optimal C_opt |
|---|---:|---:|---:|
| 3 | 2 | 0.973 dB | 0.587 dB |
| 10 | 4 | 2.903 dB | 1.236 dB |
| 100 | 25 | 45.453 dB | 4.289 dB |
| 1000 | 168 | 519.115 dB | 8.776 dB |
| 10000 | 1229 | 5372.218 dB | 14.739 dB |

These are ordinary floating-point evaluations of exact formulas, not interval-certified engineering tolerances. The column measures the scalar normalization penalty, not the worst actual insertion loss of a fabricated cascade. Normalizing measured data by 1/C amplifies absolute output noise and calibration error. Many-stage parasitic loss is additional.

## 6. A specific pulse experiment and two control experiments

### Prediction A: universal decay rate across prime delays

For a single optimized module the exact impulse response is

 h_p(t_phys)=c delta(t_phys)
   +c(q1-q0) sum_{j>=1}q1^(j-1) delta(t_phys-j tau_p).          (3)

Successive delayed echo amplitudes have ratio q1=p^(-(sigma+h)). Their logarithmic envelope slope against physical time is

 log q1/tau_p = -(sigma+h)/tau0,                              (4)

independent of p. Correspondingly the uncanceled poles and zeros of H_p(lambda) are

 poles: lambda=-(sigma+h)/tau0+2 pi i k/(tau0 log p),
 zeros: lambda=-sigma/tau0+2 pi i k/(tau0 log p), k in Z.       (5)

Their common damping separation is h/tau0. At h>0 there are no pole-zero cancellations within a module; pole and zero real parts are different even across modules. Different modules can share the k=0 pole, with the expected cascade multiplicity. The individual-module echo test avoids overlapping multistage echoes.

Example: set tau0=1 microsecond, sigma=.834, h=.125 and use p=2,3,5. Delays are .693147, 1.098612 and 1.609438 microseconds. Echo ratios are approximately .514413, .348691 and .213643. Fitted amplitude decay rates must all be 0.959 per microsecond. Field zeros have real part -0.834 per microsecond. These predictions require no fit of a zeta zero or RH assumption.

Protocol: calibrate each module's couplers and delay independently; send a pulse appreciably shorter than its round-trip delay; measure complex field amplitudes of at least three successive echoes; check (3), then compare fitted rates across the three modules. Measure both interferometer outputs to check the energy identity. Intensity-only echo slopes are twice the field-amplitude slopes, so field and power must not be mixed.

Control 1: in the p=3 module change its feedback coefficient from q1 to q1 exp(-epsilon), preserving its delay. The predicted echo decay rate increases by epsilon/(tau0 log 3), while the other modules' rates remain unchanged. If desired, adjust the MZI mixing to retain a specified numerator; a physical coupler change alone generally changes that numerator too. The prediction about the pole and echo ratio does not require numerator invariance.

Control 2: choose arbitrary positive delays tau_p' and retune q0=exp(-sigma tau_p'/tau0), q1=exp(-(sigma+h)tau_p'/tau0). The same universal decay collapse survives. This demonstrates that the damping mechanism comes from matched exponential attenuation and delay, not primality. Keeping q0 and q1 fixed while changing a delay instead destroys the common rate in the predicted way. A finite device confirms this transfer model, not a new arithmetic law.

### Prediction B: prime powers in logarithmic spectral response

From (1), on the frequency axis,

 log|H_Q(i omega)|-log C_opt
 = -sum_{p<=Q,j>=1} b_{p,j} cos(omega j tau_p).                (6)

The second-to-first logarithmic harmonic coefficient ratio within a prime module is exactly

 b_{p,2}/b_{p,1} = p^(-sigma)(1+p^(-h))/2.                    (7)

At the example parameters this is approximately .537693 for p=2 and .374355 for p=3. These are round-trip harmonics, already present in a linear device; they are not optical nonlinear frequency doubling or evidence for independent square oscillators.

For a p=2,p=3 cascade, the ordinary impulse response includes a nonzero mixed echo at tau2+tau3=tau0 log 6, with coefficient c2 c3(q1_2-q0_2)(q1_3-q0_3). The logarithmic transfer has no mixed term at log 6: it contains only j log 2 and j log 3. Logarithms convert the cascade product into a sum. A measured mixed logarithmic component beyond finite-band leakage would falsify the independent-stage model or expose parasitic cross-coupling. The absence of mixed terms also holds for arbitrary independent delays; the prime labeling adds exact multiplicative indexing, not an extra physical principle.

Because a finite measurement band convolves these lines with a window response, an exact zero coefficient must be tested with a calibrated leakage bound. Alternatively fit the known finite-stage transfer directly and compare its residual with the experimental error model. No finite scan establishes a global spectral or zero-free statement.

## 7. What the bridge means here, and what remains unconstructed

In this realization h specifies a pole-zero damping separation. It is not a Hermitian off-diagonal coupling between two ladders. Increasing h does not, by itself, imply an avoided crossing, an exceptional point, entanglement, supersymmetry, or a phase transition. For a finite set of primes and sigma,h>0 every component and transfer is analytic in these parameters. At h=0, q0=q1, B=0, and each module reduces to the identity.

Any physical claim about two coupled oscillator ladders needs an explicit generator, inner product/storage energy, port couplings, and boundary conditions. For a conventional finite coupled-mode model, imposing a Hermitian frequency matrix and positive semidefinite damping is a modeling choice that supplies passivity; deriving that choice from arithmetic is a different problem. Conservation and time-reversal impose nontrivial constraints in the cited coupled-mode literature. The present note avoids asserting that the project has already constructed such a generator.

A passive inverse response is also not automatically a passive forward response: W_Q has gain at some frequencies before normalization, and its inverse has gain at zero frequency. The functional-equation reflection that interchanges a completed ratio and its reciprocal conjugate cannot be equated with reversing this device or exchanging its two ports. This finite network has neither the completed gamma factor nor a demonstrated implementation of s <-> 1-s or the proposed Knapp–Stein/twistor pairing.

A true finite-dimensional continuous-time LTI model has a rational transfer in lambda. The exact exponential delays in (1) have infinite pole ladders, so a finite matrix ODE cannot reproduce them globally. Narrowband coupled-mode models and sampled rational-delay approximations may be useful engineering approximations, but their error and bandwidth must be stated. A finite prime cutoff already requires no rung cutoff: a loop generates all its repeated echoes. Cutting those echoes off without a fresh passivity check can change the transfer's contraction property.

Finally, finite Euler products are nonzero for Re(s)>0 and do not converge to the analytic continuation of zeta throughout the critical strip by an ordinary Euler-product limit. Reproducing their response cannot certify nontrivial zeta zeros, all-window Hankel positivity, the missing arithmetic bound in the finite-rectangle certificate, or RH.

## 8. Deliverable and review status

The accompanying verify_passive_delay.py checks exact rational coefficient/energy identities, the frequency-domain realization, echo slopes, harmonic ratios, and the normalization numbers. Its finite floating-point tests corroborate the algebra; they are not a universal numerical certificate, a hardware experiment, or an independent review. The proofs in this note carry the universal claims. Independent mathematical review is required before repository publication.

The promising practical direction is a small, calibrated two- or three-prime scattering demonstrator with both output ports measured. It would test a useful analog realization of the project's finite arithmetic observables while keeping the unresolved infinite/completed bridge visibly separate.
