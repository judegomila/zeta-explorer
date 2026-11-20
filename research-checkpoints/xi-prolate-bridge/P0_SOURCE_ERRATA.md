# P0 locked-source normalization and formula errata

Status: `P0_INVALIDATED` for the source claims as literally printed. The
residual--gap strategy remains scalar-repairable.

## 1. Section 7 factor four

In the vendored CCM-ZST-v1 PDF, (3.5), (7.1), and (7.2) state

`Fhat(z)=integral F(u)u^(-iz)du/u`,

`h(v)=(pi/2)v^2(2*pi*v^2-3)exp(-pi*v^2)`, and

`E(h)(u)=u^(1/2)sum_{n>=1}h(nu)`.

Putting `s=1/2-iz` and interchanging the absolutely convergent sum/integral,

`Fhat(Eh)(z)=zeta(s) integral_0^infinity h(v)v^(s-1)dv`.

The Gaussian integral and gamma recurrence give

`integral h(v)v^(s-1)dv
 = pi^(-s/2) Gamma(s/2) s(s-1)/8`.

Since the paper defines
`xi(s)=s(s-1)pi^(-s/2)Gamma(s/2)zeta(s)/2`, the locked result is

`Fhat(Eh)(z)=xi(s)/4=Xi(z)/4`.

At zero the two values are approximately `0.1242801945470785` and
`0.4971207781883141`. Evenization and a Fourier-sign change cannot alter this
constant. The safe bridge repair is to retain the locked state and define the
final characteristic function with an explicit factor 4. This changes no
zeros, normalized comparison vector, residual, or gap. Alternatively, the
limit `Xi/4` itself has exactly the required zero set.

## 2. Archimedean diagonal in printed (4.14)

The defining distribution (3.15) and its finite formula (4.4) agree. However,
the printed (4.14) defines

`gamma_L(n)=integral(cos(2*pi*n*x/L)-exp(-x/2))*rho(x)dx+c(L)+w(L)`.

Equation (4.11) already incorporates `c(L)` when replacing `cos-1` by
`cos-exp(-x/2)`. Thus (4.14) double-counts `c(L)`. Used literally in
Proposition 4.3, its diagonal is larger than (3.15)/(4.4) by exactly `2c(L)`.
The independent ball verifier uses the corrected

`gamma_L(n)=integral(cos(2*pi*n*x/L)-exp(-x/2))*rho(x)dx+w(L)`.

At `lambda=2`, `c(L)=0.374430812225555344...`, making the discrepancy readily
detectable. The producer uses (4.4), while the verifier uses the corrected
alpha/beta/gamma path; their 256- and 512-bit entry balls overlap.

## 3. Finite prolate scalar

The paper specifies `h_lambda` only “up to a multiplicative scalar” and later
as “suitably normalized.” The project convention required by
`DIRECT_RH_ATTACK.md` is therefore serialized as an explicit derived
normalization, not misdescribed as a unique printed finite formula:

`a4=sqrt(3)/2^(11/4)`,
`a0(lambda)=a4 integral(h4lambda)/integral(h0lambda)`,
`h_lambda=a4 h4lambda-a0(lambda)h0lambda`.

It has zero integral and the printed limit `h`. Unit normalizing instead has
limit `(2^(17/4)/sqrt(33))h` and is rejected.
