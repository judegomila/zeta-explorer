# Rigorous finite Xi-shear Gram certifier

This package uses python-flint 0.9.0 Arb/ACB ball arithmetic to classify one
finite de Branges Gram matrix at explicitly listed upper-half-plane nodes. Its
three possible statuses are:

* `CERTIFIED-POSITIVE-FINITE-GRAM`
* `CERTIFIED-NEGATIVE-WITNESS`
* `INCONCLUSIVE`

Every artifact says `finiteGramOnly: true`, `rhClaim: false`, `rhSolved: false`,
and `claimComplete: false`. A result here is neither a proof nor a disproof of
the Riemann hypothesis.

## Formula and certification rule

The implementation evaluates

\[
\zeta_{\rm defl}(s)=\zeta(s)-\frac1{s-1},\qquad
\xi(s)=\pi^{-s/2}\Gamma(1+s/2)
\left(1+(s-1)\zeta_{\rm defl}(s)\right),
\]

which cancels the zeta pole before ball evaluation. It uses
`Xi(t)=xi(1/2+i*t)`, `E_a(z)=Xi(z+i*a)`, and
`E_a#(z)=Xi(z-i*a)`. The upper-half-plane kernel is

\[
K_a(w,z)=\frac{\overline{E_a(w)}E_a(z)-
\overline{E_a^\#(w)}E_a^\#(z)}
{2\pi i(\overline w-z)}.
\]

Only the upper triangle is evaluated. The lower triangle is copied by exact
ACB conjugation, and diagonal values are projected to their analytically known
real enclosure after checking that the computed imaginary ball contains zero.

For the Hermitian midpoint matrix `M`, the code computes all eigenvalue balls
with `acb_mat.eig(algorithm="rump")`. If

\[
\rho=\max_i\sum_j \operatorname{rad}(G_{ij}),
\]

then `rho` bounds the spectral displacement from `M`. All midpoint eigenvalues
strictly above `rho` certify positivity; one midpoint eigenvalue strictly below
`-rho` certifies a negative eigenvalue. Everything else is inconclusive. The
precision ladder has hard length, node-count, and bit-precision bounds.

## Exact case format

All mathematical inputs are strings parsed as exact rationals. JSON numeric
floats are rejected. Decimal strings are converted exactly (for example,
`"0.125"` becomes `1/8`).

```json
{"schemaVersion":"debranges-gram-case/v1","id":"example","a":"1/8","nodes":[{"re":"0","im":"1/4"},{"re":"1/2","im":"1/3"}],"precision_bits":[128,256,512],"theta_crosscheck":{"enabled":false}}
```

Run and independently recompute a certificate with:

```console
PYTHONPATH=/path/to/python-flint-0.9.0:/path/to/repository \
  python -m rigorous.shear_gram certify case.json -o certificate.json
PYTHONPATH=/path/to/python-flint-0.9.0:/path/to/repository \
  python -m rigorous.shear_gram verify certificate.json
```

Output is canonical sorted-key JSON. Hashes bind the normalized case, formula,
Python source manifest, proof payload, full certificate envelope, and each
serialized Gram enclosure. Verification checks the hashes, honesty envelope,
python-flint version, source hash, then recomputes the ball proof.

## Deliberately deferred theta backend

The v1 input retains a `theta_crosscheck` request but reports
`performed: false` and never uses it in a verdict. The next backend stage should
evaluate cancellation-preserving theta components `A` and `B` separately, then
assemble `E=A-iB` and `E#=A+iB`. This avoids subtracting two order-one Xi balls
when the shear signal is order `a`; it must include explicit truncation and tail
bounds before it may participate in certification.
