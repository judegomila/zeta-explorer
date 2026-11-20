# An exact positive jump process behind theta orbit information relaxation

Status: independent analytic review and Arb constant replay passed. No complete bridge positivity claim.

Let p_n(h)=f_n(h)/psi(h) and S_n(h)=partial_h log f_n(h) be the complete positive theta orbit law and its score on h>=0. The scores strictly decrease with n, and
 p'_n=p_n(S_n-E_pS).

## 1. Exact pure-death realization
Define the time-dependent jump rates
 q_(n,m)(h)=p_m(h)[S_m(h)-S_n(h)]  for m<n,
 q_(n,m)=0 for m>n,
 q_(n,n)=-sum_(m<n)q_(n,m).
These rates are nonnegative off the diagonal. For every fixed n the sum has only n-1 terms and is continuous on finite h intervals. A path beginning at a finite n has at most n-1 jumps, so no explosion is possible. Draw its initial state from p(h_0), which is supported on finite integers almost surely.

The forward gain-minus-loss expression is exactly
 sum_(k>n)p_k p_n(S_n-S_k)-p_n sum_(m<n)p_m(S_m-S_n)
 =p_n(S_n-E_pS)=p'_n.
The Gaussian theta tails justify every displayed sum and standard uniqueness of this nonexplosive pure-death evolution. Hence this inhomogeneous positive Markov process has exactly the actual theta orbit marginals. The rates are deterministic functions of the known p(h); this is not an additional nonlinear evolution assumption.

State1 is absorbing. For every n>1,
 q_(n,1)=p_1(S_1-S_n)>= (400/401)2pi exp(2h)(n²-1).
Thus the cumulative rate of a jump directly to1 diverges. Every finite-state path reaches1 almost surely as h→infinity, in agreement with p(h)→delta_1.

## 2. Signed observables and positive jump energy
For an orbit observable V(h,n), scalar or a finite real vector, the generator is
 (L_h V)(n)=sum_(m<n)p_m(S_m-S_n)[V(m)-V(n)].
For every fixed finite derivative-feature vector, all moments below exist by Gaussian orbit tails. Direct pair summation gives
 E_p L_h V=Cov_p(V,S).
Consequently the exact moving-feature identity is
 d_h E_p V=E_p[(partial_h+L_h)V].
No sign restriction on V is required.

The matrix carré du champ is
 Gamma_h(V)(n)=sum_(m<n)p_m(S_m-S_n)[V(m)-V(n)][V(m)-V(n)]^T >=0.
It is the actual quadratic-variation rate of the compensated jump observable. Its averaged value is
 E_p Gamma_h(V)=sum_(m<n)p_m p_n(S_m-S_n)(V(m)-V(n))(V(m)-V(n))^T.
For W=(partial_h+L_h)V and mu=E_pV, the exact covariance evolution is
 (Cov_p V)'=E_p[W(V-mu)^T+(V-mu)W^T]+E_p Gamma_h(V).
This formula is a useful guardrail: the positive quadratic-variation term does not make covariance contract; the signed drift terms must be included.

## 3. The derivative ladder is retained exactly
For R_j(n,h)=f_n^(j)(h)/f_n(h),
 partial_h R_j=R_(j+1)-S_nR_j.
The process therefore reproduces the exact ladder mean recurrence
 d_h E_pR_j=E_pR_(j+1)-(E_pS)(E_pR_j).
The cancellation uses E L R_j=Cov(R_j,S); omitting either generator transport or explicit derivative drift destroys the identity. For bridge product observables, use two independent copies of the chain and the generator L tensor1+1 tensorL. This exactly matches the pair-orbit representation in orbit_covariance_transport_v1, not a replacement positive kernel.

## 4. What this achieves and what remains
This supplies a genuine positive stochastic realization, a nonnegative jump Dirichlet form, and an exact compensated-ladder dynamics for the actual infinite theta orbit law. The independently reviewed Fisher decay I'<=-14I is a special quantitative contraction of the score, not of every differentiated observable.

To close the bridge proof one still needs a comparison between the compensated jump/drift energies and the actual signed bridge Schur residual or complete lower-block metric. The modular high-jet covariance and graded residue obstructions forbid assuming that comparison uniformly from concentration of p alone. The Markov realization does not imply that the signed regional moment matrices or their parameter derivatives are positive.

## 5. Exact conditional innovation cost in the actual complete-block metric
Fix a verified complete lower block A>0 (not a local orbit Gram) and a finite vector V. Along the jump process define W=(partial_h+L_h)V. On any finite interval [s,t],
 M_t=V(t,N_t)-V(s,N_s)-integral_s^t W(u,N_u)du
is a martingale increment with conditional mean zero given N_s and conditional covariance
 E[M_t M_t^T | N_s]=E[integral_s^t Gamma_u(V)(N_u)du | N_s].
In particular its exact cost in the actual metric is
 E[M_t^T A^(-1) M_t]=integral_s^t E[tr(A^(-1)Gamma_u(V))]du.
All assertions apply to the independent pair chain and its summed generator. For finite derivative features, Gaussian tails give the integrability required for localization and passage to the full chain. This is an exact conditional innovation cost, not a proposed replacement for A. It provides no bound until this actual-A energy and the forcing W are estimated.

## 6. The exact bridge Schur forcing observable
This connects the positive process directly to the signed target. Fix a finite parity block, a>0 (or its normalized a=0 limit), and let w_a(h)=h sinh(2ah), with w_0(h)=2h² in the normalized limit. Let Z_a=integral_0^infinity w_a(h)psi(h)²dh. Form the signed moment-matrix observable V(h,n,m) entrywise from the exact pair jet formula in orbit_covariance_transport_v1, including any fixed phase/scale congruence used for the target block. Then the actual complete target matrix is
 H=Z_a E[V(T,N_T,M_T)],
where T is independent of the chain with density rho_a(h)=w_a(h)psi(h)²/Z_a, and the pair chain starts with p(0) tensor p(0). No positivity of V is assumed.

Write H=[A b;b^T d], assume only the verified complete A>0, and fix beta=A^(-1)b. The scalar signed observable
 F_beta=V_dd-2beta^T V_lower,d+beta^T V_lower,lower beta
satisfies exactly
 S/Z_a=E[F_beta(T,N_T,M_T)], S=d-b^TA^(-1)b.
Let D=partial_h+L_pair and let K_a(u)=Pr(T>=u). Dynkin and Fubini give the exact forcing representation
 S/Z_a=E[F_beta(0)]+integral_0^infinity K_a(u) E[D F_beta(u)]du.
The natural compensated innovation at this independent horizon has mean zero and cost
 E[(F_beta(T)-F_beta(0)-integral_0^T D F_beta(u)du)²]
 =integral_0^infinity K_a(u) E[Gamma_pair(F_beta)(u)]du.
The double-exponential rho tail dominates finite-degree feature growth and supplies the required horizon integrability. The same K_a weights signed forcing and positive innovation cost, so no unrelated surrogate measure is introduced.

A concrete sufficient next-rung inequality is
 E[F_beta(0)] > integral_0^infinity K_a(u) E[(D F_beta(u))_-]du,
where x_-=max(0,-x). This is only sufficient and may be wasteful: favorable positive forcing can instead be retained in the exact identity. Uniform control of this signed forcing/innovation budget in degree is not established. In particular, positivity of Gamma alone says nothing about the mean S; treating the innovation variance as S would be circular and incorrect.

## 7. Exact paid twin-ladder mismatch cost, retaining conditional innovation subtraction
Use the notation of fisher_bridge_v2/PAID_TWIN_INNOVATION.md. On the negative side put
 Z_-=integral_0^infinity h exp(-2ah)psi(h)²dh,
 v_i(h,n)=q_i(D-a)f_n(h)/f_n(h),
 r(h,m)=q_new(D-a)f_m/f_m-alpha_+^T v(h,m),
 G_i(h,n,m)=v_i(h,n)r(h,m).
Independence of the two orbit indices is essential: the mean of G is the product of the actual orbit means, not an orbit Gram with its Jensen gap omitted. With independent horizon T of density h exp(-2ah)psi²/Z_-, the exact negative-side mismatch column is
 w=Z_- E G(T,N_T,M_T).
Let A=A_+-A_->0 be the actual already-certified lower difference block. No orbit or diffusion metric is substituted for A.

For each fixed terminal t define the backward conditional feature
 H_s^t(n,m)=E[G(t,N_t,M_t) | (N_s,M_s)=(n,m)], 0<=s<=t.
It satisfies the backward equation partial_s H_s^t+L_pair,s H_s^t=0 with terminal value G(t). Along the chain H_s^t is a martingale, and
 H_0^t=G(0)+E[integral_0^t D G(u)du | initial state].
The latter expression retains the exact signed derivative forcing.

Conditional variance and the martingale quadratic-variation identity yield the exact A-metric mismatch cost
 w^T A^(-1)w/Z_-²
 = E[G(T)^T A^(-1)G(T)]
   - E[integral_0^T tr(A^(-1)Gamma_pair,s(H_s^T))ds]
   - tr(A^(-1)Cov(H_0^T(N_0,M_0))).
Here covariance in the last line includes the independent random horizon T and the initial pair state. Both subtracted terms are nonnegative. Finite-terminal identities followed by the double-exponential spatial-tail limit justify the formula for every fixed finite rung. This is an exact conditional-cost representation in the paid bridge metric, not just positivity of an unrelated Markov process.

The identity can replace a wasteful raw second-moment Cauchy bound on w by subtracting the exact evolution innovation and initial/horizon covariance. The actual next-rung condition remains
 delta_+ > E_-[R_+²]+w^T A^(-1)w.
A successful information-relaxation estimate must bound that paid expression, with the displayed subtraction and forcing retained. Section 8 proves a uniform fraction of the conditional orbit covariance paid by this innovation. This is not a fraction of the raw second moment (which also contains squared means), nor a bound on the actual mismatch cost or next-rung surplus; those remain unproved.

## 8. A degree-independent conditional innovation fraction
There is an actual uniform conditional-variance contraction for this process, stronger than concentration of its marginals alone. For all states n>1, the direct absorption rate obeys
 q_(n,1)(h)>=(400/401)6pi exp(2h).
Thus for any s<t the transition kernel has the common-atom minorization
 P_(s,t)(n,{1})>=1-r(s,t),
 r(s,t)=exp[-(1200pi/401)(exp(2t)-exp(2s))],
including n=1. This follows from the differential survival bound; other downward jumps cannot increase survival beyond the uniform hazard estimate.

For any scalar or vector terminal observable f with finite second moment, write
 P_(s,t)=(1-r)Pi_1+rQ,
where Pi_1 sends every state to1 and Q is a stochastic kernel. With initial law p(s), terminal law p(t), scalar conditional Jensen in every direction gives
 Cov_(p(s))(P_(s,t)f)<=r Cov_(p(t))(f).
Indeed the constant atom drops out of the initial covariance, leaving r²Cov(Qf); bound this by r²E Q[(f-E_(p(t))f)²], which equals r[Var_(p(t))f-(1-r)(f(1)-E_(p(t))f)²]<=rVar_(p(t))f.

For the independent pair chain the common atom is(1,1), and the same proof gives coefficient
 r_pair(s,t)=1-(1-r(s,t))²=2r-r².
Applying the law of total covariance to the backward feature H_s^t yields
 E[integral_s^t Gamma_pair,u(H_u^t)du]
 =Cov_(p(t) tensor p(t))(G_t)-Cov_(p(s) tensor p(s))(H_s^t)
 >=(1-r_pair(s,t))Cov_(p(t) tensor p(t))(G_t).
This is a dimension- and degree-independent Loewner lower bound on the conditional innovation. It remains valid after whitening by the actual fixed A>0 and taking its trace. It does not assume a uniform bound on the potentially enormous terminal jet covariance.

At random horizon T one may integrate the bound over its genuine spatial density, but must keep the extra spatial covariance in Section7. The result establishes a quantitative fraction of conditional orbit variance paid by information relaxation; it does not bound the remaining spatial mean, the finite-horizon residue, or the signed next-rung bridge surplus. Small h gives no substantial contraction, consistent with the modular high-jet obstruction at the origin.

For scale, constants.py verifies that the pair conditional innovation fraction from s=0 exceeds .508 at t=1/16 and .9955 at t=1/4. These bounds hold for every finite-dimensional terminal feature, regardless of derivative grade; they are fractions of that feature's own conditional covariance, not fractions of the actual bridge Schur surplus.
