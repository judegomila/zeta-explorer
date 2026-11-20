# Two precise information optima, with their prior art

The information claims are meaningful independently of whether they imply RH. The relevant distinction is that their core mathematics is already known, not that an information paper would have to prove RH.

## Dynamic optimum: fixed-equilibrium Gaussian relaxation

For `0<sigma<1`, put `D_sigma=diag(sigma I_n,(1-sigma) I_n)` and let `J` be any real skew-symmetric matrix. Consider

`dY=(J-D_sigma)Y dt + sqrt(2D_sigma)dW`.

The same law `mu=N(0,I)` is invariant for every split and every `J`. Define `R(sigma,J)` to be the largest rate satisfying

`KL(nu_t || mu) <= exp(-R t) KL(nu_0 || mu)`

for every finite-entropy initial law and every `t>=0`, with multiplicative prefactor **exactly one**. Then

`R(sigma,J)=2 min(sigma,1-sigma)`.

Thus `sigma=1/2` uniquely maximizes this rate, with value one. Fixed total damping, fixed equilibrium, equal rail dimensions, the specified noise, and the prefactor-one criterion are part of the model, not consequences about zeta zeros.

Proof: entropy dissipation is `H'=-integral f (grad log f)^T D_sigma (grad log f) dmu`. The skew term contributes zero. The Gaussian log-Sobolev inequality `I>=2H` gives `H'<=-2 min(sigma,1-sigma)H`. For sharpness, start with `N(epsilon v,I)` for a unit vector in the slower rail. Its entropy ratio has derivative `-2 min(sigma,1-sigma)` at time zero, so no larger all-time prefactor-one rate is possible. At balance, `exp((J-I/2)t)=exp(-t/2)exp(Jt)`, and shifted Gaussians attain the entropy bound.

**Direct antecedent:** [Arnold–Erb, section 8, equation (8.4)](https://arxiv.org/html/1409.5425v2#S8) already give the optimal rate `2 lambda_min(sqrt(D) K^-1 sqrt(D))`. Taking `K=I` gives this result immediately. The balanced optimum is its immediate specialization, not a new information-relaxation theorem. The same paper's Proposition 5.4 gives the translated-Gaussian solutions.

A long-time spectral rate with a transient constant is a different optimization. For `J=[[0,kappa],[-kappa,0]]`, the eigenvalues are `-1/2 +/- sqrt((sigma-1/2)^2-kappa^2)`. There can be a spectral plateau away from balance. Balance is not generally critical damping.

## Static optimum: the actual completed-xi family

Let `X(a)=xi(1/2+a)`. Its positive even theta density gives a probability law `mu_0` and real exponential tilts

`mu_a(dx)=exp(ax-K(a)) mu_0(dx)`, `K(a)=log[X(a)/X(0)]`.

For every real `a`,

`K'(a)=E_a[x]`, `K''(a)=Var_a(x)=I(a)>0`,

`KL(mu_a || mu_0)=aK'(a)-K(a)`, and `(d/da)KL=aK''(a)`.

Evenness gives `K'(0)=0`. Thus both `K` and this KL divergence have their unique minima at `a=0`, or `sigma=1/2`. This uses actual xi and is unconditional, but it is static information geometry, not an established relaxation law for that distribution.

**Direct antecedent:** [Nakamura, Theorem 1.1, equation (5)](https://arxiv.org/html/1504.03438#S1.SS3), published in [Bernoulli 21(1), 604–617 (2015)](https://doi.org/10.3150/13-BEJ581), constructs the density `P_sigma` with characteristic function `xi(sigma-it)/xi(sigma)`. It satisfies

`P_sigma(y)=exp(-(sigma-1/2)y) [xi(1/2)/xi(sigma)] P_(1/2)(y)`.

Under `x=-y`, this is exactly the displayed family. The factor-two xi convention cancels in the ratios. The KL and Fisher identities are standard exponential-family consequences. KL relative to a reference is minimized at that reference; symmetry makes the central reference natural but does not make the general minimization principle new.

Neither `I(a)>0` nor the KL identity proves that Fisher information itself is optimized at zero. No maximum-Shannon-entropy statement has been established. Real-parameter convexity also does not control complex-frequency cancellation or locate zeros.

## Defensible paper scope

An attributed expository or methodological note, such as *Information Geometry and Balanced Relaxation at the Riemann Symmetry Point*, can cleanly present the two results and distinguish their criteria. It should not claim the underlying optimizer theorem is newly discovered. A stronger research-originality claim needs an additional specific theorem not inherited from Gaussian entropy theory or general exponential-family calculus. The null-symbol and certified Weil methods are separate possible methodological contributions whose priority still requires targeted review; no first or record claim is cleared here.
