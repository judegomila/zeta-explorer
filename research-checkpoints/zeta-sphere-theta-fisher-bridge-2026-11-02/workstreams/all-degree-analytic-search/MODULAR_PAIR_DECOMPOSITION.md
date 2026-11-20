# Exact two-channel modular residue decomposition

## Setup

For a finite combination in one grade parity, retain the established notation

```text
F_A(h)   = Psi_A(h)-ell(A)chi(h),
chi(h)   = q(h)/2-q'(h),
chi(-h)  = q(h)/2+q'(h),
F_A(-h)  = epsilon F_A(h),
epsilon  = +1 (even grade) or -1 (odd grade).
```

For `h>=0`, form the Hadamard pair

```text
S_A(h) = [Psi_A(h)+Psi_A(-h)]/2,
D_A(h) = [Psi_A(-h)-Psi_A(h)]/2.                    (1)
```

Then exact substitution gives

```text
even grade:
  S_A = F_A + ell(A)q/2,
  D_A = ell(A)q',

odd grade:
  S_A = ell(A)q/2,
  D_A = -F_A + ell(A)q'.                            (2)
```

Thus each parity has one channel containing only the scalar residue and one
channel retaining the corrected feature and its signed correlation. No
finite-degree assumption enters (2).

## Exact norm splitting

Pointwise, for real or complex coefficients,

```text
|Psi_A(h)|^2+|Psi_A(-h)|^2
  = 2|S_A(h)|^2+2|D_A(h)|^2.                        (3)
```

Consequently every positive even integration measure on the full line gives
an exact orthogonal two-channel split on the positive half-line. In the odd
sector the pure scalar channel is `ell(A)q/2`; in the even sector it is
`ell(A)q'`. This is the integrated version of the paired identities in
`ODD_CENTER_LEMMA.md`.

The other channel must not be replaced by an absolute-value bound: it contains
the signed correlation between `F_A` and the degree-dependent residue profile.
That correlation is precisely the information lost by a pointwise raw-orbit
Gram payment or by a fixed positive Euler reference.

## What remains to prove

The desired reflected contraction uses the complete bridge metric and its
degree-by-degree Schur residual, not the auxiliary raw `Psi_A` norm. A viable
next lemma must therefore insert (2) into the exact paid-twin border recurrence
and show that the pure residue channel plus the retained correlation can be
paid by the actual positive border reserve. The numerical operator sweep says
that this payment should be degree-dependent; it does not support a fixed
rank-4 or fixed-band factorization in the tested basis.

A useful theorem-shaped target is a parity-aware signed Hardy/regression
estimate of the form

```text
actual modular-pair cost at grade j
  <= actual positive paid-twin border reserve at grade j,               (4)
```

where (4) keeps the `F_A q` or `F_A q'` cross term rather than bounding it
separately. Establishing (4) uniformly would advance the reflected
contraction; equations (1)--(3) alone do not establish it and have no RH
conclusion.
