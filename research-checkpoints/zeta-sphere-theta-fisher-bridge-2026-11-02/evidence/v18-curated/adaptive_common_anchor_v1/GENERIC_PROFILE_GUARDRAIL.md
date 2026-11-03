# Why a theta-specific estimate is indispensable

The common-anchor identity is exact but cannot, on its own, force the signed budget to be positive for every even positive profile.

Take the positive even Gaussian mixture

psi(u)=(1/(2sqrt(pi)))exp(−u²/4)+(exp(3)/(4sqrt(pi)))exp(−u²/16).

With Fourier convention Psi(t)=int exp(−itu)psi(u)du, this gives

Psi(t)=exp(−t²)+exp(3)exp(−4t²).

At t=1, the values are Psi=2/e, Psi'=−10/e, Psi''=58/e. Hence

Psi'²−Psi Psi''=−16/e²<0.

The corresponding complete normalized h² bridge has Fourier density−4/e² at Fourier argument2, by the exact1/4 Laguerre formula. The profile is positive, even, analytic, and rapidly decaying, but the complete bridge fails positivity.

This is not a counterexample involving the theta profile or RH. It rules out an overbroad assertion that positivity/evenness/decay plus adaptive spatial partitioning automatically yields a joint Gram factorization. Any successful all-order use of the common-anchor identity must exploit an additional theta/modular-specific inequality controlling the signed cost and directional covariance.

The same obstruction survives a double-exponential-tail requirement. Replace the profile by psi_epsilon(u)=psi(u)exp(−epsilon cosh(2u)), epsilon>0. It remains positive and even, is analytic, and has integrable contour shifts throughout |Im u|<pi/4 with double-exponential real-axis decay. As epsilon decreases to0, its Fourier transform and first two derivatives at t=1 converge to the displayed values by dominated convergence against |u|^k psi(u), k<=2. Thus the negative Laguerre value persists for sufficiently small positive epsilon. No explicit epsilon is needed for this existence guardrail, and no modular theta-series identity is claimed for this modified profile.
