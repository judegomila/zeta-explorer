# Information relaxation and the original theta bridge

Status: exact analytic derivations, pending independent audit. No RH proof or all-order positivity assertion.

## Conventions
Let psi be the complete even positive theta profile, F(z)=Xi(z)=integral_0^infinity psi(u)cos(zu)du, z=t+ia. Define M(t,a)=|F(t+ia)|², W=(1/2)partial_a M=Re(iF' conjugate(F)). For the spatial parent K_a(v) and bridge C_a(v), use Fourier transform integral_R f(v)e^{-ikv}dv. Then Khat_a(2t)=M(t,a), Chat_a(2t)=W(t,a). K is always positive definite; C positive definite for every a in (0,1/2) is the unsolved target.

## 1. Genuine heat diffusion: entropy dissipates, all original zeros stay fixed
Let psi_s=e^{s partial_u²}psi, s>=0, equivalently convolution with Gaussian variance 2s. Normalize psi by its fixed bilateral mass to a probability density q. For s>0 the usual integrations by parts give
 h(q_s)'=I(q_s),   I(q_s)=integral q_s (partial_u log q_s)²,
 I(q_s)'=-2 integral q_s (partial_u² log q_s)² <=0.
These are actual spatial heat identities; s is variance/2, not the transverse parameter a and not the positive-half-line orbit coordinate h.

The Fourier transform extends to the full complex plane and obeys
 F_s(z)=exp(-s z²)F(z).
Thus every zero, with multiplicity, is exactly unchanged. In particular diffusion cannot pull an off-axis zero onto the real axis.

Exactly, with E=exp[-2s(t²-a²)],
 M_s=E M,
 W_s=E[W+2sa M].
For each fixed a the corresponding kernels satisfy
 partial_s K_s=(1/2)partial_v²K_s+2a²K_s,
 partial_s C_s=(1/2)partial_v²C_s+2a²C_s+2aK_s,
 C_s=exp(2a²s)e^{(s/2)partial_v²}(C_0+2saK_0).
The apparent positive reserve 2saK_s is Gaussian, not a new theta theorem. The corrected bridge
 C_s-2saK_s=exp(2a²s)e^{(s/2)partial_v²}C_0
has Fourier density E W. Since E>0 for every real t, corrected-bridge positive definiteness is equivalent to original-bridge positive definiteness, not weaker. Establishing merely C_s>=0 as a PD kernel does not justify subtracting its positive reserve. (All kernels/densities here have the requisite integrability; this equivalence can also be read distributionally.)

For a positive corrected lower jet block A and added column b,d, any proof still has to pay d-b* A^{-1}b. Entropy decay has not supplied this estimate.

## 2. Ornstein-Uhlenbeck relaxation is equally non-remedial
Choose stationary Gaussian variance tau>0 and r=e^{-s}. The probability OU semigroup is the law of rX+sqrt[tau(1-r²)]G, with G standard normal independent. Its generator on densities is tau partial_u²+partial_u(u .). Relative entropy to that Gaussian obeys
 d/ds D(q_s||gamma_tau)=-tau integral q_s|partial_u log(q_s/gamma_tau)|².
Its transform and bridge are
 F_s(z)=exp[-tau(1-r²)z²/2]F(rz),
 W_s(t,a)=exp[-tau(1-r²)(t²-a²)]
  *[r W(rt,ra)+tau(1-r²)a M(rt,ra)].
Every original zero z0 moves to z0/r, retaining its angle and its nonzero imaginary part (which grows if nonzero). Gaussian equilibrium can be approached while zeros escape to infinity; this is not a proof that original zeros were real. Pullback/rescaling and subtraction of the explicit Gaussian reserve recover exactly the original problem.

## 3. Newman deformation: a different flow, with signed derivative-ladder forcing
Define F_lambda(z)=integral_0^infinity e^{lambda u²}psi(u)cos(zu)du. Super-exponential theta decay makes this well-defined for each real lambda. Direct differentiation gives
 partial_lambda F_lambda=-partial_z²F_lambda.
This is backward heat in the spectral coordinate, NOT probability-preserving spatial diffusion. Its zeros may move, but conclusions at lambda>0 do not automatically transfer to the original lambda=0.

Let W_lambda=(1/2)partial_a|F_lambda|² and define W[G]=Re(iG' conjugate(G)). Exact differentiation yields
 partial_lambda |F_lambda|²=-partial_t²|F_lambda|²+2|F_lambda'|²,
 partial_lambda W_lambda=-partial_t² W_lambda+2W[F_lambda'].
Thus the derivative ladder survives as an explicit signed forcing term. Assuming its nonnegativity to prove the original bridge would assume an additional unproved sign. Even forcing positivity would not by itself authorize backward transport of a lower bound.

If normalized to the positive spatial density p_lambda proportional to e^{lambda u²}psi(u), this density evolves by the replicator equation
 partial_lambda p_lambda=(u²-E_lambda u²)p_lambda,
 d/dlambda h(p_lambda)=-Cov_lambda(u²,log p_lambda).
This is not the de Bruijn Fisher production formula.

Primary source for the Newman convention and its real-zero threshold: Rodgers and Tao, The de Bruijn-Newman constant is non-negative, https://arxiv.org/abs/1801.05914 . Their coordinate normalization differs, but the displayed integral directly fixes our heat sign. The paper's nonnegative threshold theorem combined with RH would place the threshold at zero; it does not establish RH.

## 4. Actual positive-half-line theta orbit entropy really relaxes
For h>=0 let z_n=pi n²e^{2h}, f_n=4e^{h/2}z_n(2z_n-3)e^{-z_n}, p_n=f_n/psi(h). Each mass is positive and all orbits are retained. Define
 S_n=partial_h log f_n=9/2+6/(2z_n-3)-2z_n,
 mu=E_p S,   I_orbit=Var_p S.
Then p_n'=p_n(S_n-mu). Both S_n and log p_n strictly decrease with n. For S this follows from dS/dz=-2-12/(2z-3)²<0. For f at fixed h, its logarithmic derivative is 1/z+2/(2z-3)-1<0 for z>=pi: its numerator is -2z²+7z-3, whose upper root is 3, and pi>3.

Therefore the orbit Shannon entropy H=-sum p_n log p_n obeys the exact inequality
 H'=-Cov_p(S,log p)<=0,
 since Cov(X,Y)=(1/2)sum_nm p_n p_m(X_n-X_m)(Y_n-Y_m).
As h tends to infinity, p tends to the first-orbit point mass and H tends to zero, using the Gaussian-in-n tail bounds already in orbit_covariance_transport_v1.

For a differentiated vector observable V(n,h), however,
 d/dh E_p V=E_p partial_h V+Cov_p(V,S).
The explicit derivative term is signed. The covariance term for arbitrary signed high jets is not controlled by Shannon entropy decay. Fisher Cauchy gives
 Cov(V,S)Cov(V,S)* <= I_orbit Cov(V),
 not a bound by the complete bridge lower block A.
Also directly
 I_orbit'=2Cov(S,partial_h S)+E[(S-mu)^3],
 partial_h S=-4z_n-24z_n/(2z_n-3)².
The third central moment cannot silently be discarded. A stronger actual-theta contraction estimate for I_orbit is being investigated separately; it would still multiply the uncontrolled high-jet covariance.

## 5. Why a generic entropy/Fisher theorem cannot supply RH positivity
Consider any strictly positive Gaussian mixture density with transform F(z)=e^{-alpha z²}+c e^{-beta z²}, alpha,beta,c>0, beta>alpha (normalization irrelevant). Its zeros satisfy
 z²=[log c+i(2k+1)pi]/(beta-alpha),
 and so include nonreal zeros. This density enjoys the spatial heat entropy and Fisher identities in Section 1 and OU entropy relaxation in Section 2. They cannot imply real zeros for all such densities.
At a simple zero t0+ia0 with a0>0, along t=t0 one has
 W(t0,a)=|F'(t0+ia0)|²(a-a0)+O((a-a0)²),
 hence negative W just below the zero. Taking beta-alpha large places such a0 inside (0,1/2). This is not a theta counterexample: it establishes why a theta-specific estimate is essential.

## Exact missing lemma / useful next target
The genuine entropy contraction and existing small orbit chi-square/Fisher transport can be used as an accounting tool. One still needs an all-degree, full-theta bound that controls BOTH the signed differentiated-feature drift and its directional covariance in the actual complete lower-jet metric, with enough reserve to dominate the Schur feedback. Alternatively one needs a signed derivative-ladder forcing estimate that transfers the corrected (not Gaussian-inflated) bridge at lambda=0. None is proved here. Uniformly small orbit-distribution distance alone fails because high-degree theta features have large relative variance (see orbit_covariance_transport_v1, Section 6).

### Additional local check
The heat reserve cannot cure an actual off-axis zero even before subtraction: W has a negative linear term just below a simple zero, whereas the added 2saM is only quadratic in distance from that zero. For every finite s the negative neighborhood survives. The same conclusion with the appropriate odd-order leading term holds for higher multiplicity. This is an exact zero-preservation obstruction, not a numerical failure.

A self-authored symbolic polynomial smoke test is in check_identities.py; F_lambda(z)=z²+1-2lambda checks the signed Newman forcing and the Gaussian multiplier bridge formula. It is supplementary; the analytic product differentiation supplies the proofs.

The companion theta_fisher_decay_v1/FISHER_DECAY.md now supplies a stronger, separately audited-target orbit result I_orbit'<=-14 I_orbit, I_orbit<2e^{-14h}. This does not eliminate Cov(V) or the signed explicit drift in Section 4. Refer to its own audit status before quoting it as certified.
