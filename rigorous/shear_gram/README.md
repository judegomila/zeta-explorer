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

## Cancellation-preserving theta cross-check

The theta backend directly evaluates `A_a` and `C_a=B_a/a`, then assembles
`E=A-i*a*C` and `E#=A+i*a*C`. It never recovers the order-`a` component by
subtracting two order-one Xi values. The continuous quotient is evaluated as
`2*u*sinc(2*i*a*u)`, so the exact `a=0` limit is available as well.

With the app normalization

\[
\Phi(u)=\sum_{n\ge1}
\left(2\pi^2n^4e^{9u}-3\pi n^2e^{5u}\right)
e^{-\pi n^2e^{4u}},
\]

the backend computes

\[
A_a(z)=8\int_0^\infty\Phi(u)\cosh(2au)\cos(2zu)\,du,
\]

\[
C_a(z)=16\int_0^\infty u\Phi(u)
\operatorname{sinc}(2iau)\sin(2zu)\,du.
\]

For \(q=2(a+|\operatorname{Im}z|)\), its explicit A-tail building block is

\[
F_n(q,U)=4\pi^2n^4(\pi n^2)^{-(9+q)/4}
\Gamma\!\left((9+q)/4,\pi n^2e^{4U}\right).
\]

The retained-term u-tail is \(\sum_{n\le N}F_n(q,U)\). All \(n>N\)
terms on the full half-line are covered by a certified geometric majorant
starting at \(F_{N+1}(q,0)\). The C-tail uses the conservative bound
\(T_C(q)\le 2T_A(q+1)\).

The finite theta rectangle has explicit outward tail bounds. Retained theta
terms beyond the `u` cutoff are bounded by upper incomplete gamma functions;
all omitted theta terms are bounded using a certified geometric majorant. The
result is independently overlap-checked against the completed-zeta evaluator.
When every overlap succeeds, the backend also classifies the separately
enclosed, cancellation-preserving diagnostic

\[
\frac{K_a(w,z)}a=
\frac{\overline{C_a(w)}A_a(z)-\overline{A_a(w)}C_a(z)}
{\pi(\overline w-z)}.
\]

This cross-check and the scaled finite Gram remain evidence only: both carry
`usedForVerdict: false`, do not alter the completed-Xi finite-Gram verdict, and
do not imply a global RH statement.
