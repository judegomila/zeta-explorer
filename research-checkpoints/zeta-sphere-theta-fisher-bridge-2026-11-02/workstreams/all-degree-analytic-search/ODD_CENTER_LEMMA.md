# Exact odd-sector residue payment at the modular center

## Statement

Let `A` be any finite real or complex linear combination of the odd graded
polynomials `A_1,A_3,...`. This is grade parity; `A(z)` need not be an odd
polynomial in `z`. Put

```text
z_n = pi n^2,
w_n = z_n(2z_n-3)exp(-z_n),
W = sum_{n>=1} w_n,
S = sum_{n>=1} z_n exp(-z_n),
||A||_p^2 = W^(-1) sum_{n>=1} w_n |A(z_n)|^2.
```

Then

```text
ell(A) = S^(-1) sum_{n>=1} w_n A(z_n)                 (1)
```

and hence

```text
|ell(A)| <= (W/S) ||A||_p.                            (2)
```

Numerically, only for orientation,

```text
W approximately 0.44669690046712346,
S approximately 0.13580435140166353,
W/S approximately 3.28926794949.
```

If additionally `A(z_n)=0` for `1<=n<=N`, then

```text
|ell(A)|/||A||_p
  <= sqrt(W sum_{n>N} w_n)/S.                         (3)
```

The logarithm of the right side in (3) has leading behavior

```text
log10 RHS = -pi N^2/(2 log(10)) + O(N+log N),
```

with quadratic coefficient approximately `-0.682188`.

Writing `M=N+1`, one explicit elementary tail estimate is

```text
sum_{n>N} w_n
 <= 2 pi^2 M^4 exp(-pi M^2)
    / [1-exp(4/M-2pi M)].                            (4)
```

## Proof

Use the established complete-lattice notation

```text
Psi_A(h) = sum_n exp(h/2-z_n(h)) P_0(z_n(h)) A(z_n(h)),
chi(h)   = sum_n exp(h/2-z_n(h)) 4z_n(h),
F_A(h)   = Psi_A(h) - ell(A)chi(h),
q(h)     = exp(h/2) theta(exp(2h)).
```

Here `F_A` is the derivative feature represented by `A`. The modular identities
already established for the exact grading give

```text
chi(-h)=q(h)-chi(h),        q(-h)=q(h).
```

An odd-grade linear combination is odd under reflection, so
`F_A(-h)=-F_A(h)`. At `h=0`, therefore, `F_A(0)=0`. Also
`chi(0)=q(0)/2>0`, and hence

```text
ell(A)=Psi_A(0)/chi(0).
```

Substituting `P_0(z)=4z(2z-3)` at `z=pi n^2` cancels the common factor four
and gives (1). Cauchy--Schwarz in the positive weights `w_n` gives

```text
|sum_n w_n A(z_n)|
  <= sqrt(W) sqrt(sum_n w_n |A(z_n)|^2)
  = W ||A||_p,
```

which proves (2). If the first `N` samples vanish, restrict the first factor
in Cauchy--Schwarz to the tail to obtain (3). Comparing each successive term
to the first omitted term gives (4).

Finally `w_n` is a degree-four polynomial factor times `exp(-pi n^2)`. The
tail is governed by its first term up to subexponential factors, so taking the
square root yields the stated leading logarithmic coefficient.

## Paired identity and limitation

More generally, if `epsilon=+1` in the even sector and `epsilon=-1` in the odd
sector, reflection gives the exact paired formula

```text
ell(A)
 = [Psi_A(-h)-epsilon Psi_A(h)]
   / [chi(-h)-epsilon chi(h)].                        (5)
```

For odd parity the denominator in (5) is `q(h)`. For even parity it is
`q(h)-2chi(h)=2q'(h)`. Since `q''=psi+q/4>0`, the even denominator is positive
for `h>0`; it vanishes at the center because `q` is even. Differentiating the
even numerator and denominator at zero instead gives

```text
ell(A) = -Psi_A'(0)/q''(0),
q''(0) = 4W+2S > 0.                                  (6)
```

Equation (6) is a derivative trace, not a raw-orbit `L2` bound. Even if
`A(z_n)=0`, `Psi_A'(0)` retains the values of `A'(z_n)` at those nodes. This
explains why the odd center is payable while the even center exposes a divided
difference/endpoint layer.

The lemma controls one scalar residue channel at `h=0`. It does not compare
the auxiliary raw orbit norm with the complete reflected bridge metric, does
not control the even sector or nonzero `h`, and does not prove the all-degree
reflected contraction or RH.
