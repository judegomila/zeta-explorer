# P0 normalization audit

Status: `P0_INVALIDATED` for the locked source claim as printed; explicit
scalar repair recorded below.

Binding source bytes are the two PDFs hashed in `P0_SOURCE_LOCK.json`. The
finite Weil implementation uses `L=2 log(lambda)`, `x=log(lambda*u)` in
`[0,L]`, multiplicative measure `du/u`, and
`U_n(x)=L^(-1/2) exp(+2*pi*i*n*x/L)`. Its Mellin--Fourier transform is
`Fhat(s)=integral F(u) u^(-i s) du/u` (source (3.5)); changing that sign is
not an allowed convention change. Inversion sends `V_n` to `V_-n`, hence is
the anti-diagonal matrix `J[n,m]=1` iff `m=-n`.

The prolate input lives on `[-lambda,lambda]` with Lebesgue measure and is
zero-extended. The finite eigenfunctions must be oriented and scaled to tend
to the normalized Hermite functions
`h0=2^(1/4) exp(-pi*x^2)` and
`h4=(16*pi^2*x^4-24*pi*x^2+3)/(2^(5/4)*sqrt(3))*exp(-pi*x^2)`.
The required combination is

`a4=sqrt(3)/2^(11/4)`,
`a0(lambda)=a4*integral(h4lambda)/integral(h0lambda)`,
`hlambda=a4*h4lambda-a0(lambda)*h0lambda`.

With `gamma=2*pi*lambda^2` and the Meixner--Schaefke spheroidal convention
used in source (7.9)--(7.12), the same normalization is

`h0lambda(x)=lambda^(-1/2)/sqrt(2) * PS(0,0,gamma,x/lambda)`,

`h4lambda(x)=3*lambda^(-1/2)/sqrt(2) * PS(4,0,gamma,x/lambda)`.

Both have unit `L2([-lambda,lambda],dx)` norm and are oriented positive at
zero. The implementation obtains exactly this convention by diagonalizing the
rescaled Sturm--Liouville operator in an orthonormal Legendre basis, selecting
even-sector eigenvectors 0 and 2, applying unit norm, positive-at-zero
orientation, and the `lambda^(-1/2)` change-of-variable factor.

The paper itself says only “up to a multiplicative scalar” and “suitably
normalized”; keeping the `h4lambda` coefficient equal to `a4` at every finite
lambda is the explicit project convention prescribed by
`DIRECT_RH_ATTACK.md`, not a uniquely printed finite source scalar. It fixes
the source limit
`h=(pi/2)x^2(2*pi*x^2-3)exp(-pi*x^2)`. Unit-normalizing `hlambda` instead
changes the limiting scalar because the source states `||h||=sqrt(33)/2^(17/4)`,
not one. Such output must be rejected. A finite, independently verified
arbitrary-precision Galerkin implementation and an independently assembled
quadrature verifier are now present.  They remain finite truncations without
an enclosure of the infinite-dimensional prolate eigenfunctions.

The same source normalization has now been audited at the two relevant
boundary locations.  If `v_n=h_(n,lambda)(0)`,
`e_n=h_(n,lambda)(lambda)`, and
`d_n=1-|chi_(n,lambda)|^2`, then the pinned fixed-index asymptotics give

`a0/a4 -> sqrt(3)/2^(3/2)`,

`h_lambda(0) ~ (3/32)*d_4`, but

`(a0*e_0)/(a4*e_4) ~ (3/(256*pi^2))*lambda^(-4)`.

Thus the normalization cancels the integral/origin contribution, not the
hard endpoint: `h_lambda(lambda) ~ a4*e_4`.  The fixed-index limits do not
come with an effective threshold, so this is neither a finite regression nor
an odd-sector shift theorem.  See
`notes/OUTER_NORMALIZATION_CANCELLATION_AUDIT.md`.

For `k=E(h)`, `E(h)(u)=u^(1/2) sum_{m>=1}h(mu)`. The source does not assert
finite-lambda inversion parity. The required state is
`k_lambda^+=(k_lambda+J k_lambda)/2`. Since
`widehat{Jk}(z)=widehat{k}(-z)` and Xi is even, evenization preserves the
closed-substrip limit and its scalar.

The same normalization is now visible in the projected-state norm.  The
locked source comparison, periodic Fourier tail, and an explicit bound on
both omitted limiting-state tails prove

`||P_N k_lambda^+|| -> ||E(h)(exp(.))||_2 > 0`

whenever `log(lambda)/(N+1)->0`.  The source-sensitive positive lower bound
and independent interval replay are in
`notes/PROJECTED_STATE_NORM_LOWER_BOUND.md`.  Unit-normalizing `h_lambda`
would instead multiply this limit by `2^(17/4)/sqrt(33)`, so positivity of a
wrongly rescaled limit is not accepted.  Combined with the hybrid
`epsilon_lambda=o(d_6)` theorem, this proves the normalized scalar bound
`U_Z=epsilon_lambda/||P_N k_lambda^+||^2=o(d_6)`.  It is not a signed sector
floor or a residual-action estimate.

## Logarithmic projection audit

Put `u=exp(t)/lambda`, `0<=t<=L`.  If
`f(t)=k_lambda^+(exp(t)/lambda)`, reflection gives `f(L-t)=f(t)`.  With the
locked positive-sign basis, the real coefficients and reconstruction are

`c_n=L^(-1/2) integral_0^L f(t) cos(2*pi*n*t/L) dt`,

`P_N f(t)=L^(-1/2)(c_0+2 sum_(n=1)^N c_n cos(2*pi*n*t/L))`.

The two summands in the evenized arithmetic transform have distinct jump
families.  The complete symmetric partition is

`{log(m), L-log(m): 1<=m<=floor(lambda^2)}`,

clipped to `[0,L]`.  The cutoff is derived from the exact decimal text for
`lambda`; no binary64 or finite-precision rounding decides whether the final
integer is included.  An audit found that the earlier one-sided partition
omitted `log(3)` when `lambda=2`; every admitted artifact was regenerated
after this correction.

The projection error is now computed as the direct piecewise quadrature

`integral_0^L |f(t)-P_N f(t)|^2 dt`,

not by subtracting the nearly equal quantities `||f||^2-||P_N f||^2`.
Parseval subtraction is retained only as a serialized cross-check.  Producer
and standalone verifier reconstruct both jump families and the real Fourier
series independently.  These arbitrary-precision values are still not
interval enclosures, and high-frequency quadrature requires convergence
checks beyond merely increasing decimal precision.

## Locked-source factor-four discrepancy

The printed claim in CCM-ZST-v1 Lemmas 7.1 and 7.3 is inconsistent with its
printed formulas (3.5), (7.1), and (7.2).  For
`s=1/2-iz`, direct Mellin calculation gives

`integral_0^infinity h(x)x^(s-1)dx
 = s(s-1) pi^(-s/2) Gamma(s/2)/8`,

and therefore

`widehat(E(h))(z)=zeta(s)*Mellin(h)(s)=xi(s)/4=Xi(z)/4`.

At `z=0` this is approximately `0.124280194547`, while the paper's defined
`Xi(0)` is approximately `0.497120778188`. No Fourier-sign or evenization
choice removes the factor. Multiplying the eventual characteristic functions
by the explicit nonzero scalar 4 repairs the limit without changing zeros or
normalized residual--gap quantities, but that repair must be stated; it is
not the locked lemma as printed.
