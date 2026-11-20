# Independent audit of the `kappa=1` aggregate Ewald certificate

## Verdict

**PASS**, with the stated one-rung scope.

For the actual first odd residual `q(t)=t`, the frozen certificate rigorously
proves

\[
 S(1/2)>0,\qquad S'(z)>0,\qquad D(z)<0
 \quad\text{for every }1/2\leq z\leq1,
\]

where `S=sum e_n z^n` and `D=P'N-PN'` after splitting the complete scalar
cells into their positive and negative parts.  The finite head consists of
complete outward Arb enclosures for `e_1,...,e_6`; every cell after index six
is handled by sign-free total-variation bounds derived from the analytic
all-index scalar-cell theorem.

This is a certificate at `kappa=1` only.  It is not an all-degree theorem,
does not by itself prove a next pivot or the first Xi--Laguerre inequality,
and makes no RH claim.

## Frozen provenance and clean replay

The audited frozen artifacts have SHA-256 values

```text
1e813e55f13f6cd74d4cb8f16706228bf3e7ac46df089b37fbc3ef22bd1e1a3f  src/certify_ewald_kappa1_aggregate.py
57b9f9c63e4c3ac5f2292c25b90c99881d7bf1e3c3f3d5163b5b4ceb4fec4345  results/ewald_kappa1_aggregate_certificate.json
2d6876dd03be58996bfda4bdbc8f0103919e7935a88496383fd2df6c9e028061  EWALD_KAPPA1_AGGREGATE_CERTIFICATE_NEXT.md
```

I reran the frozen source with the recorded Python `3.14.10` and
python-flint `0.9.0` environment.  The replay completed independently and was
byte-for-byte identical to the tracked receipt, with SHA-256

```text
57b9f9c63e4c3ac5f2292c25b90c99881d7bf1e3c3f3d5163b5b4ceb4fec4345
```

The embedded hashes of the five inherited analytic notes/checkers and of the
aggregate checker itself all match the files in the checkpoint.

## Complete-cell normalization

Put `s=1/2-it`, `A=pi^(-s/2)Gamma(s/2)`, and `K=s(s-1)A`.  For `n>=2`,
direct multiplication of the complete Euler remainder gives the pole-free
identity

\[
 Kd_n=A\{s(s-1)n^{-s}
       +s(n^{1-s}-(n-1)^{1-s})\}.
\]

For `n=1`, `d_1=s/(s-1)` and therefore `Kd_1=s^2A`.  The checker forms the
analytic even completions

\[
 \Xi(t)={K(s(t))\zeta(s(t))+K(s(-t))\zeta(s(-t))\over4},
 \qquad
 E_n(t)={Kd_n(s(t))+Kd_n(s(-t))\over4}.
\]

On the real axis these are exactly `Xi` and `Re(Kd_n)/2`.  Third-order
`acb_series` coefficients consequently give

\[
 \mathcal B(\Xi,E_n)
 =\Xi[1]E_n[1]-\Xi[0]E_n[2]-\Xi[2]E_n[0],
\]

because the order-two series coefficient already contains the factor `1/2!`.
For `q=t`, evenness then gives the exact deployed normalization

\[
 e_n={2\over\pi}\int_0^{50}t^2\mathcal B(\Xi,E_n)\,dt
       +\text{the two omitted spectral tails}.
\]

The checker retains the extra factor-two safety reserve already audited for
the `e_2` certificate.  The six finite intervals and their independent
spectral-tail enclosures certify

\[
 e_1>0,\quad e_2<0,\quad e_3,e_4,e_5,e_6>0.
\]

## Audit of the sign-free index tail

The checker deploys equation (24) of `EWALD_SCALAR_CELL_TAIL_NEXT.md` at
`Y=20`, hence `sigma=20.5`, and uses a logarithmic-Gamma contour angle
`theta=pi/5`.  The Gamma log moments correctly give

\[
 |A^{(j)}(\sigma-ix)|\leq G_j e^{-\theta|x|/2},
 \qquad j=0,1,2.
\]

Absolute convergence of the zeta Dirichlet series at `sigma=20.5` gives the
recorded positive bounds `zeta(sigma)`, `-zeta'(sigma)`, and
`zeta''(sigma)`.  The polynomial bounds for `K`, `Xi`, and their first two
derivatives use only

\[
 |s|\leq x+\sigma,
 \quad |s(s-1)|\leq(x+\sigma)^2,
 \quad |2s-1|\leq2x+2\sigma-1.
\]

For `q=t`, `|q(x+iY)|^2=x^2+Y^2`.  Each completed factor contributes
`e^(-theta x/2)`, so the scalar-tail integrand is bounded by a
positive-coefficient degree-seven polynomial times `e^(-theta x)`.  The
factor

\[
 {1\over2\pi}\int_0^\infty R(x)e^{-\theta x}\,dx
\]

is correct: it is the `1/(4pi)` in the analytic scalar-tail constant times
the two symmetric `x` half-lines.  This yields the certified upper bound

\[
 C_{q,20}<2.196043753643819\,10^{12}.
\]

For `n>6`, set `m=n-1>=6`.  Applying `n<=2m` and
`1+log n<=1+log(2m)` to the proved scalar tail, followed by the decreasing
first-term-plus-integral estimate, gives

\[
 T_0:=\sum_{n>6}|e_n|<0.000645722348029565,
\]

\[
 T_1:=\sum_{n>6}n|e_n|<0.007843307848767753.
\]

The exponent is `p=Y+3/2-r`; the required monotonicity condition holds for
both `r=0` and `r=1`.  No tail-cell sign is used.

## Independent audit of the uniform margins

Let `b=-e_2>0`.  The seed estimate

\[
 S(1/2)\geq\sum_{n=1}^6e_n2^{-n}-2^{-7}T_0
\]

is valid because every remote index is at least seven.  Dropping the positive
`e_4,e_5,e_6` derivative contributions and minimizing the remaining
quadratic globally gives

\[
 S'(z)\geq e_1-2bz+3e_3z^2-T_1
 \geq e_1-{b^2\over3e_3}-T_1.
\]

For the aggregate, define the six-cell head

\[
 P_0=e_1z+e_3z^3+e_4z^4+e_5z^5+e_6z^6,
 \qquad N_0=bz^2.
\]

Its exact placement identity is

\[
 D_0=b\sum_{i\in\{1,3,4,5,6\}}(i-2)e_i z^{i+1}.
\]

With `G=e_1-sum_(i=3)^6(i-2)e_i`, positivity of the head cells and
`z>=1/2` imply `D_0<=-bG/4`.  Split the remote cells by their actual signs as
`A,B>=0`, so `P=P_0+A` and `N=N_0+B`.  The exact difference is

\[
 D-D_0=P_0'B-P_0B'+A'N_0-AN_0'+A'B-AB'.
\]

Since `A+B<=T_0` and `A'+B'<=T_1` on `[0,1]`, its absolute value is at most

\[
 (P_0'(1)+2b)T_0+(P_0(1)+b)T_1+T_0T_1.
\]

The last coefficient is one, not two, because
`A'B+AB'<=(A'+B')(A+B)`.  Thus the argument pays every possible sign
arrangement in the remote tail.

As an independent endpoint-arithmetic check, I recomputed the margins from
the outward cell endpoints and the upper endpoints of `T_0,T_1`, without
using the checker's final margin fields.  The conservative results were

```text
S(1/2)                 > 0.2224841354323905922
S'(z), 0<=z<=1         > 0.2535251354002050769
placement gap G        > 0.4226709578280891585
head -D reserve        > 0.0449582423377172068
remote perturbation    < 0.0108784444973963814
-D(z), 1/2<=z<=1       > 0.0340797978403208255
```

These independently reproduce, with slightly different outward endpoint
rounding, all four strict signs in the frozen receipt.

## Scope

Combining the separate seed with `S'>0` and `D<0` satisfies the exact
reverse-order sufficient conditions at this one actual rung.  The result does
not assume the conditional sole-negative-cell pattern and does not replace
the remaining degree-uniform argument.  No higher residual, next-pivot sign,
all-degree first Xi--Laguerre inequality, or RH conclusion is certified here.
