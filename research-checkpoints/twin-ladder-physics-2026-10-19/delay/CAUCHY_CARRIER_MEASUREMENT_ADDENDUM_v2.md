# Measuring the finite Euler-log distribution with randomized carrier frequency

19 October 2026. Version 2 addendum to PASSIVE_DELAY_REALIZATION_v2.md, prepared for independent review. No hardware measurement or infinite-cutoff theorem is claimed.

The passive realization H_Q(lambda)=C_opt/V_Q(sigma+lambda tau0) also gives an exact finite-model measurement protocol for the Poisson arithmetic statistics. Let Y have the standard Cauchy density 1/[pi(1+y^2)], and set the physical carrier detuning

omega=(T+xY)/tau0, x>0.

Calibrated log-amplitude data satisfy

log|H_Q(i omega)|-log C_opt=L_Q(T+xY).

Thus randomized carrier sampling reproduces the entire finite Euler-log distribution, including nonlinear clipping, rather than only the first two moments. It is a different protocol from replacing the cosine ensemble by a Gaussian process with matching covariance. The latter cannot supply the former's tails or clipped expectation.

A realizable finite sweep retains only |Y|<=R. Its omitted probability is

epsilon_R=1-(2/pi) arctan R.

For finite Q, sigma>0 and h>0,

M_Q=sum_{p<=Q,j>=1} b_{p,j}=log V_Q(sigma),
|L_Q(t)|<=M_Q.

For any real clipping threshold c,

0<=E[(c+L_Q(T+xY))_+ 1_{|Y|>R}]
 <=epsilon_R (c+M_Q)_+.

If the retained samples are drawn from the conditional law Y given |Y|<=R, let F_R be their exact conditional clipped mean. The valid full-mean interval is

(1-epsilon_R) F_R
 <= E[(c+L_Q(T+xY))_+]
 <= (1-epsilon_R) F_R+epsilon_R(c+M_Q)_+.

The conditional mean itself is not the unnormalized retained integral. In a real experiment, confidence/error bounds for estimating F_R must be added and multiplied by 1-epsilon_R. This addendum supplies no sample-complexity or finite-hardware precision claim.

Finite-band dispersion, calibration error, and amplitude detection floors matter. For example, an additive measurement error |delta H|<=eta with eta<|H| permits the conservative log-amplitude bound

|log|H+delta H|-log|H|| <= -log(1-eta/|H|).

For this exact ideal transfer, the needed global lower bound is explicit:

m_Q=C_opt product_{p<=Q}(1-q0_p)/(1-q1_p)=C_opt exp(-M_Q)>0,
|H_Q(i omega)|>=m_Q.

Each factor is minimized at phase z_p=1; all these phases occur simultaneously at omega=0, so the bound is attained there. Consequently eta<m_Q gives the uniform logarithmic error allowance -log(1-eta/m_Q). An experimental device still needs its deviations from the ideal transfer bounded, and a finite-band bound can be tighter. Removing the known scalar attenuation in data processing does not remove this conditioning cost. The positive-part map is 1-Lipschitz, so a uniform certified error delta in the calibrated logarithmic signal adds at most delta to its conditional clipped mean, before accounting for sampling error.

This protocol can test the finite arithmetic observable and the related Poisson moment identities. It cannot prove the all-carrier arithmetic estimate, the analytic boundary hypotheses, the completed xi bridge, or RH.
