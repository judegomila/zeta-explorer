# P0 finite Weil matrix formulas

Source: CCM, *Zeta Spectral Triples*, arXiv:2511.22755v1.

For modes `-N<=n,m<=N`, let `omega_nm(x)=q(U_n,U_m)(x)` on `[0,L]`:

- if `n!=m`, `(sin(2*pi*m*x/L)-sin(2*pi*n*x/L))/(pi*(n-m))`;
- if `n=m`, `2(1-x/L)cos(2*pi*n*x/L)`.

Then `Q_nm=P_nm-A_nm-R_nm`, preserving the minus sign of source (3.19), with

`P_nm=integral_0^L omega_nm(x)(exp(x/2)+exp(-x/2)) dx`,

`A_nm=(gamma+log(4*pi))*omega_nm(0)/2 + integral_0^infinity
(exp(x/2)omega_nm(x)-omega_nm(0))/(exp(x)-exp(-x)) dx`,

where `omega_nm(x)=0` for `x>L`, and

`R_nm=sum_{1<k<=exp(L)} Lambda(k) k^(-1/2) omega_nm(log k)`.

Here `exp(L)=lambda^2`; every prime power at or below that bound occurs once.
The integer cutoff `floor(lambda^2)` is computed from the exact rational value
of the decimal input string in both Python paths and both C/Arb paths; an
`mpmath` or binary64 rounding is never allowed to decide inclusion of the last
prime power.
The arbitrary-precision producer evaluates the distribution formulas directly
and cross-checks closed (4.2)/(4.4); its standalone verifier reimplements all
formulas with independent quadrature assembly. Both use mpmath 1.4.1, an
explicitly recorded shared-library limitation.

The rigorous producer `src/p0_matrix_arb.c` instead uses closed (4.2),
certified Arb quadrature for regularized (4.4), and generates prime powers by
prime bases. The independent `verifier/p0_matrix_arb_replay.c` integrates the
pole directly, reconstructs the corrected alpha/beta/gamma archimedean path,
and factors every integer independently. Their 256- and 512-bit balls overlap
entrywise. Both rigorous paths still share the FLINT/Arb library family.
Neither path consumes cached matrices.

## Cauchy form and source commutator

Let `mathcal_D=log_*(Psi^#)` be the real source distribution in (5.1), and
define

`b_n=-(1/pi)<mathcal_D,sin(2*pi*n*x/L)>`, with `b_0=0`.

Linearity of the pole, archimedean, and prime blocks, with the displayed
source signs retained, gives source Lemma 5.1:

`Q_nn=a_n`, and `Q_nm=(b_n-b_m)/(n-m)` for `n!=m`,

where `a_(-n)=a_n` and `b_(-n)=-b_n`.  The same coefficients can be
reconstructed without any eigenvalue or eigenvector data by

`b_n=n*Q_(n,0)` for `n!=0`.

Let `M V_n=n V_n`, `eta=sum_{|n|<=N}V_n`, and
`beta=sum_{|n|<=N}b_n V_n`.  Entrywise multiplication by `n-m` proves the
exact source identity (5.3)

`[M,Q]=|beta><eta|-|eta><beta|`.

Here `J M=-M J`, `J eta=eta`, and `J beta=-beta`.  Shifting by the actual
lowest eigenvalue does not change the commutator:

`[M,Q-epsilon_N I]=[M,Q]`.

For the physical scaling operator `D_log=(2*pi/L)M`, the right side is
multiplied by `2*pi/L`, as in source (5.26).  Together with a simple
inversion-even lowest eigenvector, this identity proves the finite
nonvanishing of the source boundary functional
`delta_N=L^(-1/2)eta`; see `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`.
It gives no uniform lower bound along an asymptotic schedule.

## Symbolic symmetries

For `n!=m`, swapping `n,m` changes both the sine numerator and the `n-m`
denominator by a minus sign, so `omega_nm=omega_mn`. Simultaneously replacing
`(n,m)` by `(-n,-m)` likewise leaves the quotient fixed. The diagonal formula
is fixed because cosine is even. Hence every distributional block satisfies
`B_nm=B_mn=B_(-n)(-m)`.

With `J_nm=1` iff `m=-n`, this proves algebraically that `J*=J`, `J^2=I`,
and `QJ=JQ`. The arbitrary-precision and Arb pilots separately replay these
identities numerically and with overlapping balls.

## Locked-source (4.14) correction

The alpha/beta/gamma verifier does not use printed (4.14) literally. Equation
(4.11) already puts `c(L)` into the integral containing `exp(-x/2)`, so the
additional `+c(L)` in (4.14) double-counts it. The corrected verifier uses

`gamma_L(n)=integral_0^L(cos(2*pi*n*x/L)-exp(-x/2))*rho(x)dx+w(L)`.

This is forced by the defining distribution (3.15) and finite expression
(4.4); see `P0_SOURCE_ERRATA.md`.
