# Parent-Gram interval enclosure method

`certify_parent20.py` is newly authored code. It encloses the existing odd1..19 positive halfline parent, not a new rung. Derivatives through39 are used solely to bound quadrature error.

For each j<=39, ψ^(j)(h)=exp(h/2)Σ_n exp(−z_n)P_j(z_n), z_n=πn²exp(2h), with P_0=8z²−12z and P_(j+1)=2zP_j'+(1/2−2z)P_j. The exact rational coefficient sum of every P_j is asserted <10^53, and deg P_j<=41.

## Orbit tail

For n>=13 and h>=0, exp(h/2)<=z_n^(1/4), z_n>=3n²>=507. Since z^(165/4)exp(−z) decreases for z>=507,

|exp(h/2)exp(−z_n)P_j(z_n)| <=10^53(3n²)^(165/4)exp(−3n²).

The consecutive majorant ratio is bounded above by (14/13)^(165/2)exp(−81)<1/2; it decreases with n>=13. Hence the sum tail is <=T=2·10^53·507^(165/4)exp(−507)<10^-50. Every interval derivative value receives [-T,T]. The first12 orbits are evaluated with interval exp, π, and rational polynomial coefficients.

## Cell integration

For f_ij(h)=hψ^(i)(h)ψ^(j)(h), its k-th derivative is exactly

h Σ_(l=0)^k binom(k,l)ψ^(i+l)ψ^(j+k-l)
 +k Σ_(l=0)^(k−1)binom(k−1,l)ψ^(i+l)ψ^(j+k−1−l).

The second sum is absent at k=0. On each exact rational cell centered at c with halfwidth d, integrate the midpoint Taylor polynomial through degree19. Odd terms integrate to zero. The result is

Σ_(even k=0..18) 2d^(k+1)f_ij^(k)(c)/(k+1)!,

with certified error <=2d^21 sup_cell|f_ij^(20)|/21!. Interval derivative evaluations over c+[-d,d] bound this supremum. No point sampling is substituted for an error enclosure.

## Spatial tail

For h>=3, put z=πexp(2h)>=z0=3exp(6). The orbit sequence now has ratio<1/2 starting at n=1. Thus |ψ^(j)(h)|<=2·10^53 z^(165/4)exp(−z). Since h<=z and dh=dz/(2z),

∫_3∞ h|ψ^(i)ψ^(j)|dh
 <=2·10^106 ∫_(z0)∞ z^(165/2)exp(−2z)dz
 <=2·10^106 z0^(165/2)exp(−2z0)<10^-400.

For the final inequality split the exponential into two factors and use monotonicity of z^(165/2)exp(−z) beyond z0. The fixed positive basis scales multiply every bound.

## Serialization and endpoint arithmetic

Raw parent interval endpoints are printed to60 significant digits. `certify_endpoint.py` adds outward uncertainty 10^-54(1+|interval|) when reading them, far exceeding this serialization rounding. It loads the original certified target moment endpoint decimals with an additional outward guard 10^-90(1+|lower|+|upper|), matching the prior certificate evaluators, and treats the60-digit basis scales as fixed exact decimal coefficients. Interval Gaussian elimination asserts every pivot strictly positive; gain, coefficient-motion cost, and surplus are computed with interval arithmetic. Final reported endpoint bounds receive additional outward decimal padding before serialization.

A failure of any positivity assertion is a failed certificate, not permission to fall back to floating-point conclusions. The coarser trial files are not certificates of the final gain/cost statement. Finite-nonzero-shift action quadrature remains exploratory unless separately certified.
