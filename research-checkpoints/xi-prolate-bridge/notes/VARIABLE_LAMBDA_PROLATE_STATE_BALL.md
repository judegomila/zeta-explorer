# Variable-`lambda` prolate state and projection-error ball

## 1. Claim boundary

This note records an effective finite architecture for the source-normalized
prolate labels, comparison state, and Fourier projection error at an exact
chosen parameter `lambda>=2`.  It also records a deterministic second pilot
at

```text
lambda = 5/2,  N = 3,  M = 79,  K = 85.
```

Every constant used in that finite certificate is explicit.  No fixed-index
prolate `O(1)`, asymptotic threshold, zeta-zero table, or global Weil
positivity assumption enters the calculation.

This is not a uniform asymptotic estimate.  It does not prove that the
projection error meets equation (5.2) on an unbounded schedule, and it gives
no control of the shifted Weil solve.  It proves no form of the Riemann
hypothesis.  The formal state remains `P0_INVALIDATED`.

The formulas and certification architecture apply to arbitrary finite exact
inputs in their stated regime.  The current executable additionally enforces
the explicit resource contract

```text
1 <= floor(lambda^2) <= 10000.
```

This implementation guard is serialized and independently checked.  It is
not a mathematical upper bound, and the executable as written is not an
unbounded-`lambda` schedule implementation.

## 2. Locked source state

The source state is exactly the one fixed in `P0_NORMALIZATION_AUDIT.md`:

```text
h_lambda = a4 h_(4,lambda) - a0(lambda) h_(0,lambda),
a4 = sqrt(3)/2^(11/4),
a0(lambda) = a4 integral(h_(4,lambda))/integral(h_(0,lambda)).
```

The functions live on `[-lambda,lambda]` with Lebesgue measure and zero
extension.  They are selected as even prolate labels zero and four, have
unit `L2` norm, and are oriented positive at zero.  The arithmetic transform
is not assumed inversion even: the implementation constructs

```text
k_lambda^+ = (E(h_lambda) + J E(h_lambda))/2
```

explicitly.  The logarithmic Fourier basis remains
`L^(-1/2) exp(+2*pi*i*n*t/L)`, where `L=2 log(lambda)`.

The parameter parser accepts only exact positive integer, decimal, or
rational text.  It constructs an `fmpq` before any transcendental operation;
binary64 parsing is not an available path.  The producer serializes the
canonical rational, and the verifier independently parses the command-line
text and requires the same canonical value.

## 3. Uniform infinite-tail label certificate

Put

```text
c = 2*pi*lambda^2,
A_c = -d/dz ((1-z^2)d/dz) + c^2 z^2,
phi_i(z) = sqrt((4i+1)/2) P_(2i)(z).
```

The producer assembles the Jacobi entries from the normalized Legendre
recurrence.  The verifier constructs the Legendre polynomials by their exact
three-term recurrence and integrates

```text
<phi_i,A_c phi_j>
 = 2i(2i+1) delta_(ij)
   + c^2 <phi_i,z^2 phi_j>
```

as exact rational polynomials before inserting its own Arb enclosure of
`pi`.  Every diagonal and first off-diagonal entry through the interface is
serialized by the producer and required to overlap the independently
assembled verifier entry.

For an interface `M>=ceil(2c)`, a terminal `K>=M`, and every certified shift
`0<=s<c^2`, both paths reconstruct

```text
r_i(s) = b_(i-1)^2/(d_i-s-r_(i+1)(s)),
0 <= r_K(s) <= b_(K-1)^2/(2K(2K+1)-s).
```

They propagate the terminal interval backward and reject any denominator
whose sign is not proved.  They also verify the analytic width bound

```text
width(r_M(s)) < c^2/(135*1764^(K-M)).
```

Because the right-hand side is positive, both programs form its comparison
value from a certified lower endpoint of the Arb enclosure of `c^2`.

Interval LDL at both load endpoints then proves the exact infinite inertia.
The QR calculation is used only to emit exact-dyadic trial vectors and trial
integer brackets.  It supplies no accepted eigenvalue or pass boolean.

For the second pilot, `c=25*pi/2`, so `M=79` satisfies the interface rule.
The independently replayed counts certify

| source label | spectral rank | lower shift/count | upper shift/count |
|---:|---:|---:|---:|
| 0 | 0 | `34 / 0` | `43 / 1` |
| 4 | 2 | `338 / 2` | `347 / 3` |

The full residual includes the first omitted component
`b_(M-1)v_(M-1)`.  If `(a,b)` is one of the certified one-eigenvalue
brackets, `theta=<v,A_cv>`, and `epsilon=||(A_c-theta)v||`, the code uses

```text
delta = min(theta_lower-epsilon_upper-a,
            b-theta_upper-epsilon_upper),
eta_j = 2 epsilon_upper/delta.
```

This encloses the true infinite-dimensional eigenfunction, rather than the
finite Galerkin vector alone.  The positive-at-zero source orientation is
proved with the same local Sobolev argument as the first pilot, now with the
two bracket rays used to bound `x/(x-theta)^2` explicitly.

At 512 bits the producer reports

| quantity | enclosure midpoint (displayed) |
|---|---:|
| `theta_0` | `38.51497374303685378740597262978777596557...` |
| `eta_0` | `2.4577165341037380e-88` |
| `theta_4` | `342.3184963976914283160232549784776776716...` |
| `eta_4` | `1.7354886361748755e-84` |
| `h_(0,lambda)(0)` | `1.1863056668973981152052068475708077...` |
| `h_(4,lambda)(0)` | `0.7113147480161395792970588934700913...` |

## 4. Source-state ball

Let `v_j` denote the certified polynomial witnesses.  Their physical
polynomials are reconstructed as

```text
tilde h_j(x)
 = lambda^(-1/2) sum_i (v_j)_i sqrt((4i+1)/2) P_(2i)(x/lambda).
```

The true integrals are enclosed from the coefficient-zero functional, so
the ball for `a0(lambda)` is recomputed rather than copied.  With the same
actual `a0` used in the polynomial ball, the true state obeys

```text
||h_lambda-(a4 tilde h_4-a0 tilde h_0)||_2
 <= eta_h := |a4| eta_4 + |a0| eta_0.
```

For `lambda=5/2`, the 512-bit balls give

```text
a0 = 0.15438082146780020008930610807515074265...,
eta_h <= 4.4687575135689478e-85.
```

No asymptotic prolate constant is used in this bound.

## 5. Closed finite projection-error formula

Write the physical polynomial as

```text
tilde h(x) = sum_p d_p x^p,
S_p(q) = sum_(m=1)^q m^p,
y = lambda*u in [1,lambda^2].
```

On every open cell of the exact rational partition

```text
{1,lambda^2}
 union {m,lambda^2/m: 1<=m<=floor(lambda^2)},
```

the two floor functions are constant and

```text
E^+(tilde h)(y/lambda)
 = (1/2) sum_p d_p [
     S_p(floor(lambda^2/y)) (y/lambda)^(p+1/2)
     + S_p(floor(y)) (lambda/y)^(p+1/2)].
```

Squaring this expression against `dy/y` leaves only integrals

```text
integral_a^b y^(e-1) dy
 = (b^e-a^e)/e  if e != 0,
 = log(b/a)      if e = 0.
```

Thus the full polynomial norm is a finite Arb expression.  The producer
uses aggregated exact power sums and four pairwise antiderivatives.  The
verifier loops over each arithmetic index before forming independent Laurent
cells.  The two Fourier paths are also distinct: real sine/cosine versus
complex-power antiderivatives.

The polynomial tail is bounded by

```text
(e_poly)^2
 = ||E^+(tilde h)||^2 - c_0^2 - 2 sum_(n=1)^N c_n^2.
```

Interval dependency can widen this subtraction, but taking its certified
upper endpoint remains rigorous.  Finally, the elementary transform bound
and contraction of evenization/projection give

```text
e_(lambda,N) <= e_poly + lambda*eta_h.
```

The true projected coefficient balls additionally receive the functional
radius

```text
sqrt(2*(lambda^2-1)/L)*eta_h.
```

The arithmetic cutoff is derived exactly.  At `lambda=5/2`,
`floor(lambda^2)=6`; all six terms are present, none is marked as a
zero-length endpoint, and index seven is rejected.

The independently replayed 512-bit values are

```text
||E^+(tilde h)||^2
 = 0.0199883739210717610403868362006988339251683595697...,

e_(5/2,3)
 < 0.0004868665874324075038546491028565236234151062971...,

||P_3 k_(5/2)^+||
 = 0.1413794075599335752227368260146528404341388703586....
```

These are finite ball diagnostics, not an exponent estimate and not an
extrapolation.

## 6. Mandatory normalization rejection

Because the two source eigenfunctions are orthonormal,

```text
||h_lambda||^2 = a4^2+a0(lambda)^2.
```

Unit normalization would replace the fixed source coefficient `a4` by

```text
0.85764236589608996710567351354931741345...
```

at this pilot.  That ball is disjoint from the locked
`a4=0.2574708929883897...` ball.  Producer and verifier both reject the
substitution, and the adversarial regression makes the check mandatory.

## 7. Independence, replay, and limitations

The verifier does not trust producer matrix entries, brackets, coefficients,
normalization booleans, or projection-error values.  Matrix entries and trial
brackets are accepted only after independent reconstruction and proof.
Coefficient and normalized-state balls must overlap entrywise at 256 and 512
bits.  Mutated source hashes, matrix entries, Fourier signs, reflection
coordinates, cutoffs, brackets, precision, and normalization policies fail
closed.

Both programs use FLINT 3.6.0 / Arb transcendental functions.  Their
independence is therefore at the formula and control-flow level, not at the
arithmetic-library level.

Run the focused regression with

```text
python3 -m unittest tests.test_variable_lambda_prolate_state_ball -v
```

The finite architecture can be run at another exact chosen `lambda` by
increasing `M`, `K`, and precision as necessary.  A failed trial bracket or
interval sign is a rejected certificate, not evidence about the underlying
state.  No large sweep is performed here.  Most importantly, this closes a
finite state/projection-enclosure task only; the source-specific shifted Weil
sign and forced-resolvent estimate required by equation (5.2) remain open.
