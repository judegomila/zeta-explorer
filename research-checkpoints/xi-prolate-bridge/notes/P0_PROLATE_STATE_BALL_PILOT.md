# P0 prolate-state ball pilot at `lambda=2`

## 1. Claim boundary

This note records a finite, source-normalized ball enclosure of the true
prolate comparison state at `lambda=2`, projected into `E_3` and `E_4`.  It
also records one finite `N=4` consequence: the raw Rayleigh quotient lies
strictly below a certified inversion-odd sector floor.

This does **not** enclose the projection error, the exact complementary
minimum, or an unbounded diagonal schedule.  It proves no instance of the
asymptotic target (5.2), no determinant convergence, and no form of RH.  The
formal state remains `P0_INVALIDATED`.

The implementation reads no zeta-zero table and assumes neither global Weil
positivity nor real-axis eigenvalue agreement.

## 2. Locked state and operator

The binding normalization is the one in `P0_NORMALIZATION_AUDIT.md`.  On
`[-lambda,lambda]`, with Lebesgue measure and zero extension, put

```text
h_lambda = a4 h_(4,lambda) - a0(lambda) h_(0,lambda),
a4 = sqrt(3)/2^(11/4),
a0(lambda) = a4 integral(h_(4,lambda))/integral(h_(0,lambda)).
```

After `x=lambda*z`, the even prolate differential operator is

```text
A = -d/dz ((1-z^2)d/dz) + c^2 z^2,
c = 2*pi*lambda^2,
-1 <= z <= 1.
```

The producer uses the orthonormal basis
`phi_i(z)=sqrt((4i+1)/2) P_(2i)(z)` and the exact normalized-Legendre
recurrence.  Its Jacobi entries are

```text
d_i = l(l+1) + c^2 (z_up(l)^2 + z_down(l)^2),
b_i = c^2 z_up(l) z_up(l+1),
l = 2i,
z_up(l) = (l+1)/sqrt((2l+1)(2l+3)).
```

The verifier does not call that assembly.  It constructs every Legendre
polynomial by the exact rational three-term recurrence and evaluates

```text
<phi_i,A phi_j>
 = l_i(l_i+1) delta_(ij)
   + c^2 sqrt((2l_i+1)(2l_j+1))/2
     integral_(-1)^1 z^2 P_(l_i)(z)P_(l_j)(z) dz
```

by exact polynomial integration.  It constructs the first omitted coupling
the same way.

## 3. Infinite-tail and label certificate

The basis size is `M=40`; it is not treated as the true problem.  The first
omitted Jacobi residual component `b_(M-1)v_(M-1)` is included.

For the infinite omitted tail `T`, the multiplication coefficients are at
most one, so the quadratic form bound

```text
T >= g I,
g = 2M(2M+1) - 2c^2
```

holds.  At `lambda=2`, the certified lower endpoint is
`g > 5216.69063666056`.

For `s<g`, Schur congruence gives

```text
inertia_-(A-sI)
 = inertia_-(A_M-sI-rho(s)e e^T),
0 <= rho(s) <= b_(M-1)^2/(g-s).
```

The rank-one subtraction is monotone in `rho`.  Interval LDL gives the same
negative count at both endpoints of that `rho` interval, with every pivot
separated from zero.  The independently assembled paths certify counts

| `s` | eigenvalues below `s` |
|---:|---:|
| 0 | 0 |
| 70 | 1 |
| 170 | 2 |
| 260 | 3 |

Thus `(0,70)` contains exactly the label-0 eigenvalue and `(170,260)`
contains exactly the label-4 eigenvalue (even-sector index two).

The QR output is not trusted as an eigenpair.  The producer serializes its
coordinates as exact dyadic trial data.  Each path independently normalizes
that vector, recomputes `theta=<v,Av>`, and encloses

```text
epsilon^2 = ||(A_M-theta)v||^2 + |b_(M-1)v_(M-1)|^2.
```

Both paths check `epsilon<delta` and
`[theta-epsilon,theta+epsilon]` lies inside the certified count bracket.  If
`delta` is the distance from the narrow theta enclosure to the complement of
the count bracket, spectral projection gives

```text
||(I-P)v|| <= epsilon/delta,
||v-f_j|| <= 2 epsilon/delta = eta_j.
```

The 512-bit producer balls are

| label | `theta` | `epsilon` | `eta_j` |
|---:|---:|---:|---:|
| 0 | `24.3748788472166...` | `1.49964e-37` | `1.49964e-38` |
| 4 | `214.847016309906...` | `3.06270e-34` | `1.53135e-35` |

### Source orientation

Orientation is not inferred from a finite-Fourier phase.  For the aligned
target eigenfunction, the residual also bounds the quadratic-form norm of
the off-target spectral component.  On `[-1/2,1/2]`,
`1-z^2 >= 3/4`, and the elementary one-dimensional estimate gives

```text
|g(0)| <= ||g||_2 + sqrt(4/3) sqrt(<g,Ag>).
```

Applying this to the residual enclosure proves the physical, source-scaled
values `lambda^(-1/2)f_j(0)` are positive:

```text
h_(0,2)(0) = 1.18461487849639466714692998965568... +/- 3.63e-38,
h_(4,2)(0) = 0.700402563870618594021223857977106... +/- 1.12e-34.
```

This directly matches the source convention `h_(j,lambda)(0)>0`.

## 4. Closed projection formula

Let `L=2 log(lambda)`, `omega_n=2*pi*n/L`, and
`u=exp(t)/lambda`.  The cosine coefficient of `E(f)` is

```text
c_n(f) = sum_i v_i T_(n,i),

T_(n,i) = 1/sqrt(L lambda)
  sum_(m=1)^floor(lambda^2) m^(-1/2)
  integral_(m/lambda)^lambda phi_i(x/lambda) x^(-1/2)
    cos(omega_n log(lambda*x/m)) dx.
```

All four indices `m=1,2,3,4` are serialized and checked.  The `m=4` term is
present as the required zero-length endpoint, not silently omitted.

For a monomial of degree `p`, with `alpha=p+1/2`, the producer uses

```text
[ x^alpha (alpha cos(theta)+omega sin(theta))
  /(alpha^2+omega^2) ]_a^b,
theta = omega log(lambda*x/m).
```

The verifier instead takes the real part of

```text
(lambda/m)^(i omega)
  (b^(alpha+i omega)-a^(alpha+i omega))/(alpha+i omega).
```

No numerical quadrature is used.

The arithmetic state is not assumed inversion even.  Evenization is used
explicitly.  Its cosine coefficient equals the unevenized cosine
coefficient because

```text
integral_0^L f(L-t) cos(2*pi*n*t/L) dt
 = integral_0^L f(t) cos(2*pi*n*t/L) dt.
```

This is the justification for constructing the serialized `+n` and `-n`
balls from the same `|n|` coefficient.  The producer's reflection check is a
construction check; the verifier additionally rejects unequal serialized
reflections.

For an even eigenfunction error `e` of full-line norm at most `eta`, the
coefficient kernel obeys

```text
|K_n(x)| <= 2 sqrt(lambda/L),
sum_(m<=lambda*x) m^(-1/2) <= 2 sqrt(lambda*x).
```

Its positive support has length `lambda-1/lambda`, and the positive-half
norm is `eta/sqrt(2)`.  Therefore

```text
|delta c_n| <= sqrt(2(lambda^2-1)/L) eta.
```

This analytic radius is added to each closed-form witness coefficient.

## 5. Enclosed coefficients and normalization regression

The four producer/verifier outputs at 256 and 512 bits have a nonempty
common intersection for every coefficient and every normalized state
coordinate at both `N=3` and `N=4`.

At `N=4`, representative coefficient balls are

| `n` | `c_n(h_2)` |
|---:|---:|
| 0 | `0.0994395649670807374508137165574533 +/- 9.09e-36` |
| 1 | `-0.0684815157058513445527941665762411 +/- 8.49e-36` |
| 2 | `0.0196607317057920673922656652888410 +/- 8.25e-36` |
| 3 | `-0.000545099520345039658900402668572178 +/- 8.23e-36` |
| 4 | `-0.000323697116560117320519718701919394 +/- 8.22e-36` |

The projected norms are

```text
N=3: 0.141567461222458302433288609343364 +/- 1.70e-35,
N=4: 0.141568201361106420696654727032090 +/- 1.70e-35.
```

These balls enclose the true source state.  They intentionally do not trust
the older `M=30` point coefficients; those finite-truncation decimals differ
from the enclosed state in later displayed digits.

The source scalar is

```text
a4 = 0.257470892988389719478784656900126...,
a0(2) = 0.152229451819815087157312297755080... +/- 6.67e-36.
```

Because the two eigenfunctions are orthonormal, unit-normalizing the
combination would replace `a4` by

```text
0.860798287187461993585858124219008... +/- 9.76e-36.
```

That ball is disjoint from the source `a4` ball.  Both paths make this a
mandatory rejection test.

## 6. Finite `N=4` raw odd-floor consequence

`verifier/p0_n4_raw_gap_arb.c` intersects these four state outputs and the
existing four Weil-matrix outputs (producer/verifier at 256/512 bits).  It
requires distinct roles and precisions.  It never midpoint-normalizes a
state box.

In the normalized inversion-odd basis, the block is reconstructed as

```text
(Q_-)_(ij) = Q_(i,j) - Q_(i,-j),  1 <= i,j <= 4.
```

Interval LDL proves `Q_- - 3e-7 I` positive definite.  Direct ball
arithmetic gives

```text
q = <kappa,Q kappa>
  = 7.99356612363419941472825457581657e-8 +/- 1.38e-34,

lambda_min(Q_-) - q
  > 2.20064338763658005852717454104824e-7.
```

The separately enclosed raw residual norm is
`5.29022713318068927275139926249219e-5 +/- 3.13e-34`.

The positive number above is an odd-sector floor minus the raw Rayleigh
quotient.  It is not the exact complementary minimum `Delta`, and no Schur
short is claimed by this pilot.

## 7. Independence and remaining limitations

The producer and verifier use different operator and antiderivative
assemblies.  The verifier consumes the producer's exact dyadic vector only
as an arbitrary trial witness and reproves every spectral property from the
source operator.  It does not consume producer pass booleans, eigenvalues,
or cached matrices.

Both paths use the same FLINT 3.6.0 / Arb transcendental implementation.
Thus this is formula/control-flow independence, not an independent
arithmetic-library implementation.  That limitation is serialized in every
artifact.

Still missing are a ball enclosure of the projection error, the full exact
complementary minimum, a certified residual/Delta schedule, and all
asymptotic work needed for equation (5.2).

## 8. Replay and artifacts

Run the focused regression with

```text
python3 -m unittest tests.test_p0_prolate_state_ball -v
```

Raw outputs and hashes are under
`artifacts/p0_prolate_state_ball/`.  `INPUTS.sha256` pins the two source
programs, the raw-gap verifier, both source PDFs, and the four pre-existing
Weil-matrix inputs.  `OUTPUTS.sha256` pins every raw text output.
