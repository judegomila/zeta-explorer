# A finite Poisson/Ornstein–Uhlenbeck correspondence and prime-beat experiment

19 October 2026. Version 2, local research note. Review status is recorded separately in the independent audit. No external publication or experimental validation. Exact finite algebra is distinguished below from a proposed engineered realization. No RH, critical-line zero assumption, or unproved global positivity is used.

## Executive result

The twin-ladder project's Poisson covariance has an exact classical stochastic realization: it is the covariance of a two-component, zero-start Ornstein–Uhlenbeck (OU) process sampled at logarithmic prime positions. The project's positive integrated prime-tail energy is exactly the output variance of a tapped linear Gaussian filter. The factor controlling separated prime blocks is ordinary exponential memory in log scale.

There are two useful cautions and one further exact connection:

- This reproduces the original cosine ensemble's mean and covariance, not its probability law. Common Cauchy phase sampling has nonzero higher cumulants and can have very large kurtosis at the project's small Poisson widths. Gaussian clipping estimates are therefore unjustified.
- The covariance identity holds for every finite collection of positive frequencies. Primes enter through the selected tap locations and amplitudes, not through a special OU dynamics. Prime-specific resonance tests need composite and generic-frequency controls.
- The dyadic note's triangular near-frequency energy is exactly a sinc-squared smoothing of the carrier-dependent variance. Its theorem can be interpreted as a quantitative comparison between raw noise power and low-pass-filtered noise power.

The defensible finding is a finite, testable classical correspondence plus a diagnostic for where that analogy fails. It does not establish a new law of nature or a new RH estimate.

## 1. Starting point and scope

For distinct positive frequencies lambda_j and real weights a_j, put

S(u) = sum_j a_j cos(u lambda_j),
U distributed with density x/[pi(x^2+(u-T)^2)], x>0.

The first-prime model is lambda_p=log p and a_p=(1-p^(-h))p^(-s), with the project's s=417/500 and h=1/8. The full finite-Euler logarithm instead uses lambda_(p,k)=k log p and coefficient (1-p^(-kh))p^(-ks)/k, with an overall minus sign. All finite identities below hold with these prime-power taps as well. A first-prime experiment is not silently identified with the full Euler logarithm.

The Cauchy characteristic function gives

m_j = E cos(U lambda_j) = e^(-x lambda_j) cos(T lambda_j),

K_T(lambda,mu)
 = Cov(cos(U lambda),cos(U mu))
 = (1/2) cos(T(lambda-mu))
   [e^(-x|lambda-mu|)-e^(-x(lambda+mu))].                       (1)

The sum-frequency term cancels on centering because the positive-frequency multiplier is multiplicative: e^(-x(lambda+mu))=e^(-x lambda)e^(-x mu). Thus m=sum a_j m_j and V=a^T K_T a.

Equation (1) is the existing project's covariance formula written in frequency coordinates. Its validity does not depend on unique factorization. The fact that K_T is a covariance proves positive semidefiniteness of this finite kernel, not a positivity claim about zeta or its zeros.

Sources within the project:

- `/workspace/shared/rh_original_curve_20261018/release_v3/poisson-prime-tail-energy.md`, equations (3)–(6).
- `/workspace/shared/rh_dyadic_prime_localization_20261019/release_v2/DYADIC_NEAR_FREQUENCY_REDUCTION_v2.md`, equations (1)–(9).

## 2. Exact Gaussian second-order realization

Let W_1 and W_2 be independent standard real Brownian motions, and define a complex process, indexed for now by the auxiliary coordinate lambda>=0:

dZ(lambda)=-(x+iT)Z(lambda)d lambda
           +sqrt(x)[dW_1(lambda)+i dW_2(lambda)],
Z(0)=0.                                                       (2)

Equivalently its two real coordinates have drift matrix

A = [[-x, T],[-T,-x]]

and independent equal white-noise drives of amplitude sqrt(x). Both quadratures are driven. This is a rotating planar OU system, not an assertion that it equals the usual second-order mechanical oscillator driven only through momentum.

Solving (2) explicitly and using independence of the Brownian motions gives

E[Z(lambda) conjugate(Z(mu))]
 = e^(-iT(lambda-mu))
   [e^(-x|lambda-mu|)-e^(-x(lambda+mu))],
E[Z(lambda) Z(mu)]=0.

Hence X(lambda)=Re Z(lambda) has covariance exactly K_T in (1). In particular,

S_G = m + sum_j a_j X(lambda_j)                               (3)

has exactly the same mean and variance as S(U). Joint means and covariances match if each mode is represented by m_j+X(lambda_j).

This is an equality of first and second moments only. S_G is Gaussian. S(U) is a bounded function of one common Cauchy random variable, and is not Gaussian unless degenerate. The processes need not have the same higher moments, conditional laws, sample paths, or Markov properties. The full two-dimensional state Z is Markov, but its real coordinate X generally is not. A state-space realization of covariance does not imply that the original cosine process is Markov.

The zero-start process is nonstationary. This boundary condition matters: a stationary OU process has only the first exponential in (1) and misses the negative image term. At T=0, the nonoscillatory kernel is x times the Dirichlet Green function of -d^2/d lambda^2+x^2 on the positive half-line. This follows by the elementary method-of-images formula

G_D(lambda,mu)=[e^(-x|lambda-mu|)-e^(-x(lambda+mu))]/(2x).

The carrier T supplies a quadrature rotation; it is not automatically a magnetic flux, a topological invariant, or a quantum energy.

## 3. Finite recursion, positive tail energy, and computational use

Sort the tap positions 0=lambda_0<lambda_1<...<lambda_N and set

Delta_j=lambda_j-lambda_(j-1),
alpha_j=e^(-(x+iT)Delta_j),
q_j=(1-e^(-2x Delta_j))/2.

Equation (2) has the exact finite update

Z_j=alpha_j Z_(j-1)+sqrt(q_j)(xi_j+i eta_j),                  (4)

where all xi_j and eta_j are independent N(0,1). No discretization error is present at the chosen taps.

For a weighted readout define B_N=a_N and, backwards,

B_j=a_j+alpha_(j+1)B_(j+1).

Independence of the innovations yields

V=sum_(j=1)^N q_j |B_j|^2.                                  (5)

This is an O(N) variance computation with nonnegative summands. It also exhibits a finite linear-filter experiment. It is a computational reformulation, not a smaller mathematical bound.

The continuous noise integral gives the same variance as

V=x integral_0^infinity e^(2x r)
       |sum_(lambda_j>=r) a_j e^(-(x+iT)lambda_j)|^2 dr.      (6)

Indeed the weighted readout is the real part of a Wiener integral whose two independent quadratures supply the modulus square. With v=e^r and lambda_j=log n_j, (6) is precisely

V=x integral_1^infinity v^(2x-1)
       |sum_(n_j>=v) a_j n_j^(-x-iT)|^2 dv.

The apparent nested-tail structure is the accumulated influence of each earlier noise innovation on all later taps.

For the full finite-prime Euler logarithm, there are infinitely many prime-power taps but the coefficient sum is finite for fixed Q and s>0. The readouts converge in L2 by absolute coefficient summability. A physical or numerical realization still truncates the powers. If all powers above J are omitted, one explicit absolute signal-error allowance is

sum_(p<=Q) p^(-(J+1)s)/[(J+1)(1-p^(-s))].                    (7)

This bound uses 0<1-p^(-kh)<1 and pays the omitted logarithmic series. It is not a license to drop the higher-power remainder in the RH criterion.

## 4. Why the localization window is 1/x

Across a log-scale separation d, the state transition has modulus e^(-x d). Its memory length is therefore 1/x in the variable lambda. In integer scale this corresponds to a multiplicative ratio of order exp(1/x).

The dyadic reduction uses block width L=log R and obtains

V(T)<=C(x,R) E_near(T),
C(x,R)=1+2/(1-R^(-x)).                                      (8)

Its cutoff-independent constant becomes moderate only when x log R is of order one. Thus the project's trade-off between localization and constant loss has a direct state-space interpretation: small x creates long memory in logarithmic scale. A narrow log-prime window cannot automatically isolate independent noise blocks. Adjacent blocks are especially correlated.

This does not sharpen the project's arithmetic theorem. It explains the already-proved loss, and it cannot supply the required signed mean or variance bounds at every carrier.

## 5. Exact low-pass interpretation of the near energy

For the first-prime model write

V(T)=D+sum_(p<q) A_pq cos(T delta_pq),
delta_pq=log(q/p),
A_pq=a_p a_q[(p/q)^x-(pq)^(-x)],
D=(1/2)sum_p a_p^2(1-p^(-2x)).

The dyadic offset average is

E_near(T)=D+sum_(p<q) A_pq (1-delta_pq/L)_+ cos(T delta_pq).

Define sinc z=sin(z)/z, with sinc 0=1, and

k_L(v)=L/(2pi) sinc^2(Lv/2).

This kernel is nonnegative, integrates to one, and has Fourier transform (1-|delta|/L)_+. Therefore, exactly for the finite model,

E_near(T)=integral_R k_L(v) V(T-v)dv.                        (9)

Consequently (8) compares carrier-dependent noise power with its positive low-pass smoothing. The arithmetic target retains beat frequencies log(q/p)<L. Nothing is inferred about an individual discarded pair's sign. This correspondence holds for arbitrary positive tap frequencies with the same kernel, and triangular/sinc-squared duality is standard Fourier analysis.

An experiment could sweep the carrier-control parameter T, estimate the readout variance, apply the declared sinc-squared smoothing to that sweep, and compare both sides of (8). A finite sweep needs a separately bounded convolution tail. With B=sum|a_j|, V(T)<=B^2, so omission of |v|>H costs at most B^2 integral_(|v|>H) k_L(v)dv. This is an engineering/sampling allowance, not an arithmetic estimate at large T.

## 6. A higher-moment test that separates the two ensembles

Already for one frequency lambda, set r=e^(-x lambda), c=cos(T lambda), and Y=cos(U lambda)-r c. Elementary cosine power identities give

E Y^2=(1-r^2)/2,
E Y^4=(1-r^2)(8r^2 c^2-r^2+3)/8,
kappa_4(Y)=(1-r^2)(8r^2 c^2+5r^2-3)/8.                    (10)

The centered Gaussian surrogate has E X^4=3(E X^2)^2 and kappa_4=0. For the exact benchmark lambda=log 2, x=1/2, T=0, one has r^2=1/2 and

Var(Y)=1/4,
E Y^4=13/32,
kappa_4(Y)=7/32,

whereas the Gaussian fourth moment is 3/16. This is an exact finite discriminator, not a statistical-fit claim.

More importantly for the project's narrow widths, as x decreases to zero with lambda,T fixed,

Var(Y)=x lambda+O(x^2),
E Y^4=x lambda(1/2+2cos^2(T lambda))+O(x^2).

The kurtosis therefore diverges like 1/x, whereas the Gaussian surrogate's kurtosis remains 3. The common Cauchy phase generates rare, sizable excursions even when its output variance is small. It is incorrect to replace the actual clipping cost by a Gaussian tail estimate merely because (2) matches its covariance. The existing distribution-free two-moment clipping inequalities avoid that error.

All finite raw moments are also directly computable:

E[S(U)^k]
 = 2^(-k) sum_(j_1,...,j_k) a_(j_1)...a_(j_k)
   sum_(epsilon_1,...,epsilon_k in {+1,-1})
   e^(-x|sum_l epsilon_l lambda_(j_l)|)
   cos(T sum_l epsilon_l lambda_(j_l)).                      (11)

Equation (11), not Gaussian Wick factorization, is the correct higher-moment formula for the original ensemble.

## 7. What is and is not prime-specific

### A. Covariance and filtering are generic

Replacing log primes by any distinct positive real frequencies preserves (1)–(6), the OU realization, and the same-frequency analog of (9). Random generic frequencies almost surely have no nontrivial integer relations. A successful covariance experiment cannot establish that primes possess a unique new stochastic physics.

### B. First-prime beat lines have no exact ratio degeneracies

For distinct primes p<q and r<s, q/p=s/r implies qr=ps. Unique factorization forces the ordered pairs to agree. Thus each first-prime difference frequency log(q/p) belongs to one pair. With log-integer taps, ratios repeat: 3/2=6/4=9/6 and 2=4/2=6/3=8/4. These repeated lines add coherently in the carrier-variance spectrum.

This is distinguishable in principle but requires adequate carrier span and frequency resolution. Very nearby lines can be unresolved; absence of a resolved degeneracy is not evidence for an asymptotic theorem. Generic irrational-frequency controls also have no exact degeneracy, so the property is not exclusive to primes.

### C. Higher-order resonances distinguish primes from multiplicatively rich integer sets

For a fixed finite set of first-prime frequencies, sum k_p log p=0 with integer k_p implies every k_p=0. As x tends to infinity, (11) therefore keeps only frequency-balanced terms. The mode phases converge in distribution to independent uniform angles, as follows by evaluating every integer Fourier character. In this finite-mode broad-carrier limit,

E S=0,
E S^3=0,
Var(S)=(1/2)sum a_p^2,
kappa_4(S)=-(3/8)sum a_p^4.

A generic rationally independent frequency set has the same limit. In contrast, log-integer modes can have genuine triads: log 2+log 3=log 6. For equal unit amplitudes at 2,3,6, the broad-carrier third moment is 3/2; for 2,3,5 it is zero. The factor 3/2 is six permutations times the constant contribution 1/4 of cos A cos B cos(A+B).

The full Euler-log model includes prime powers, which have within-prime harmonic relations such as log p+log p=log(p^2). Its nonlinear resonances do not obey the first-prime-only no-triad statement. Unique factorization controls the relations by balancing each prime exponent; it does not remove them.

### D. A minimal controlled comparison

Use all four controls, with specified calibration and equal power normalization where comparisons need it:

1. The project's actual prime locations and actual coefficients.
2. Log-integer frequencies with matched count, range, and amplitude envelope; include known ratio/triad coincidences.
3. Jittered or randomized frequencies matched to the prime density and total squared amplitude, over declared seeds rather than one favorable draw.
4. Independent phase jitter for each mode, keeping each marginal mean and variance but destroying the common-phase off-diagonal covariance.

Add the Gaussian OU surrogate as a fifth realization: it matches the entire covariance but should fail the higher-cumulant tests. Specify whether amplitudes follow the new frequency envelope or are permuted/matched; do not attribute an amplitude-profile change to primality. No arithmetic superiority or statistical significance has yet been established by these controls.

## 8. Two explicit engineered implementations

### Common-phase implementation: reproduces the original finite law

Choose a physical frequency scale Omega and synthesize a phase-coherent bank with angular frequencies omega_j=Omega lambda_j. On each trial evaluate the sum at a programmed phase coordinate tau=U/Omega, with U drawn from the stated Cauchy law. This reproduces S(U), including its non-Gaussian cumulants. Signed phase coordinates can be programmed as phase offsets rather than interpreted as negative waiting times. A common offset is crucial; independent jitter is a different experiment.

Ideal Cauchy sampling has unbounded support. If one conditions on |U-T|<=H, the discarded mass is

delta=1-(2/pi) arctan(H/x).

For B=sum|a_j|, conditioning changes the mean by at most 2B delta, the second raw moment by at most B^2 delta, and the variance by at most 5B^2 delta. These conservative finite-support allowances are necessary before claiming experimental agreement with the ideal formulas.

### Gaussian implementation: reproduces only the first two moments

Choose a laboratory time unit tau_0. Run the reset planar OU system

dZ(tau)=-(x+iT)Z(tau)d tau/tau_0
        +sqrt(x/tau_0)[dB_1(tau)+i dB_2(tau)],
Z(0)=0,

sample it at laboratory times tau_j=tau_0 log n_j, and form the weighted real readout plus the separately calculated mean. Its decay time is tau_0/x and rotation frequency is T/tau_0. This is a proposed classical noisy-quadrature circuit or digital emulator; bandwidth, reset, noise whiteness, and readout errors must be calibrated. Changing T changes the programmed rotation rate.

Neither implementation says that zeta height is naturally laboratory time. The time mapping, noise source, coupling, and measurement rule have been supplied as part of an engineered analog. They do not follow from RH. No quantum state, Born rule, thermodynamic partition function, or natural Hamiltonian is identified here.

## 9. Reproducible finite check

`check_poisson_ou.py` uses existing NumPy, exact rational products to retain integer-frequency resonances, and ordinary floating-point evaluation. It produces `finite_diagnostics.json`. No packages are installed and no external state is changed. It is a diagnostic, not an interval certificate or formal proof. The displayed checks use T=100; extending them to extremely large carrier heights requires explicit precision control for T log n and for cancellation in raw moment formulas.

For primes 2,3,5,7,11,13,17,19, s=.834, h=.125, x=.04, T=100:

- Covariance quadratic form: 0.0006354105664467719.
- Positive integrated-tail sum: 0.0006354105664467635.
- Independent-innovation recursion: 0.0006354105664467710.
- Exact finite-moment formula, numerically evaluated: variance 0.0006354105664469704.
- Common-Cauchy fourth central moment: 0.000009206493309539478.
- Matched-Gaussian fourth central moment: 0.0000012112397638566225.
- Common-Cauchy kurtosis: approximately 22.80265, compared with Gaussian 3.

The covariance/tail/innovation identities also pass a generic positive-frequency control at errors below 3e-17 in this sample. That control is important: it directly demonstrates that this identity is not prime-specific.

The script additionally checks the exact one-mode benchmark and the broad-width triad contrast for 2,3,6 versus 2,3,5. These are small finite examples. None is an all-height or large-cutoff certificate for the twin-ladder criterion.

## 10. Prior art and claim boundary

The stochastic building blocks are established. The current contribution is the explicit application to this project's exact Poisson covariance, its filter/tail interpretation, the triangular near-energy smoothing identity, and an experiment designed to separate covariance equivalence from distributional equivalence. No first-in-literature claim is made.

Primary sources inspected:

1. G. E. Uhlenbeck and L. S. Ornstein, “On the Theory of the Brownian Motion,” Physical Review 36, 823–841 (1930), https://doi.org/10.1103/PhysRev.36.823. Original Brownian/Langevin stochastic context. Only the public abstract was accessed on the publisher page; the calculations here are explicit and self-contained.
2. D. Foreman-Mackey, E. Agol, S. Ambikasaran, and R. Angus, “Fast and scalable Gaussian process modeling with applications to astronomical time series” (2017), https://arxiv.org/abs/1703.09710; published DOI https://doi.org/10.3847/1538-3881/aa9332. Established complex-exponential covariance/state-space structure and stochastic-oscillator interpretation; not a prime-specific result.
3. S. Särkkä and J. Hartikainen, “Infinite-Dimensional Kalman Filtering Approach to Spatio-Temporal Gaussian Process Regression,” AISTATS/PMLR 22, 993–1001 (2012), https://proceedings.mlr.press/v22/sarkka12.html. General covariance-to-stochastic-equation methodology. Its more general setting is background, not needed as an assumption of (2).
4. J. Loper, D. Blei, J. P. Cunningham, and L. Paninski, “A general linear-time inference method for Gaussian Processes on one dimension,” JMLR 22(234), 1–36 (2021), https://www.jmlr.org/beta/papers/v22/21-0072.html. Further context for stable state-space representations. It is not a proof that the original Cauchy ensemble is Gaussian.

A physical implementation would validate a finite engineered model and its calibration. It would not prove RH, locate every zero, close the project's signed arithmetic budget, create a self-adjoint zeta operator, or improve a prime exponent. Those would require separate theorems or evidence not supplied here.
