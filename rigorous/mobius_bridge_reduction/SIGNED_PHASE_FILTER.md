# Signed sixth-character filtering: calculation and obstruction

22 October 2026. **Exact local algebra, an elementary integer-row mean-square
bound, and a finite spectral obstruction. No improved zero-free bound.**

This follows the proposal to retain interference and identify modes before
taking absolute values. The source probe has a numerator/denominator ratio
with different character orientations; see
[Xu–Sang v2, equation (18) and Appendix C](https://arxiv.org/html/2610.15291v2).
The calculations below do not replace its analytic inputs. The finite-field
filter applies locally at split prime ideals, but the global interval theorem
here concerns rational integer rows, not the source's Eisenstein rows.
No priority claim is made for this character-amplifier construction.

## 1. What matched Euler factors actually cancel

For the untwisted target, write `xi` for a sixth-root character value at an
unramified prime. On a common numerator/denominator line, the local ratio is

$$
\frac{1-\bar\xi t}{1-\xi t}
=1+\sum_{k\ge1}(\xi^k-\bar\xi\xi^{k-1})t^k.
$$

The nonconstant coefficient vanishes precisely for `xi = 1` or `xi = -1`.
For each other sixth-root phase its squared modulus is 3, independently of
`k`. The uniform average of its squared modulus over all six phases is 2.
Thus the local subtraction removes the real phases but is not an average
energy contraction on the remaining ones.

At the principal untwisted row the full ratio is `zeta_F(w)/zeta_F(s)`.
Setting `w=s` makes it identically 1 wherever defined. This specialization
also erases the zero-detecting quotient. The original two-variable contour
argument does not make this specialization.

A transverse derivative preserves zero detection:

$$
\left.\partial_w\frac{\zeta_F(w)}{\zeta_F(s)}\right|_{w=s}
=\frac{\zeta_F'(s)}{\zeta_F(s)}.
$$

But the prime-power coefficients, after removing `-log p`, become
`k*xi^k - (k-1)*bar(xi)*xi^(k-1)`. At `xi=+/-1` these equal `xi^k` rather
than zero. Their mean squared modulus is `2*k^2-2*k+1`.
The derivative restores both the detector and the previously cancelled
real-phase coefficients. No new bound follows from this operation alone.

For a nonprincipal row, a well-defined divided difference subtracts its own
diagonal value: `[R(s,w)-R(s,s)]/(w-s)`. Subtracting 1 on every row is invalid.

## 2. A principal-preserving balanced filter

Define, for `xi^6=1`,

$$
F(\xi)=\frac{\xi+\xi^2+\xi^3+\xi^4+\xi^5}{5}
=\begin{cases}1,&\xi=1,\\-1/5,&\xi\ne1.\end{cases}
$$

Its uniform phase average is zero and its mean squared modulus is `1/5`.
This is optimal among *all* six-value complex filters satisfying `F(1)=1`
and zero phase average: the other five values sum to `-1`, so Cauchy–Schwarz
gives a sum of squared moduli at least `1/5`. Including the principal value
and dividing by six gives the lower bound `1/5`; equality requires all five
other values to be `-1/5`.

The simpler cubic projection `(1+xi^2+xi^4)/3` does not distinguish `1` from
`-1`. In row language it retains cubes, including rows with a nontrivial
quadratic character. The full filter distinguishes these local phases.

Extend `F(0)=0` to retain the zero extension at ramified primes. For a rational
prime `p=1 mod 6`, choose any order-six character `chi_p` of `F_p^*` and put
`f_p(n)=F(chi_p(n))`. The definition is independent of which generator of the
order-six character group is chosen:

```text
f_p(n) = 0       if p divides n,
         1       if n is a nonzero sixth-power residue modulo p,
        -1/5     otherwise.
```

Direct counting proves

$$
\sum_{n\bmod p} f_p(n)=0,\qquad
\sum_{n\bmod p} f_p(n)^2=\frac{p-1}{5}.
$$

These are exact identities on actual residue classes; no random-phase
assumption enters.

## 3. Exact signed Gram identity over complete periods

Take distinct such primes in a set `Pcal`, let `K=|Pcal|`, and define

$$
A(n)=\frac1K\sum_{p\in\mathcal P}f_p(n),\qquad
M=\prod_{p\in\mathcal P}p.
$$

Then `A(1)=1`. The Chinese remainder theorem and the zero local means give
zero cross terms for distinct primes. Hence

$$
\frac1M\sum_{n\bmod M}|A(n)|^2
=\frac1{5K^2}\sum_{p\in\mathcal P}(1-1/p).
$$

This is the requested interference calculation: expanding the signed sum
first yields a diagonal of order `1/K`, with cross terms cancelling exactly.
Taking absolute values before summing would lose this identity.

For arbitrary weights `a_p` with `sum a_p=1`, the complete-period energy is
`sum |a_p|^2*(p-1)/(5p)`. Its minimum is
`1/[5*sum_p p/(p-1)]`, attained by weights proportional to `p/(p-1)`.
Equal weights already have the same order.

## 4. An incomplete integer-interval bound

The complete period is usually much longer than the row interval. This cannot
be ignored. Here is an elementary bound that does not require complete periods.
For a nonprincipal primitive character of modulus `q`, Fourier completion and
the Gauss-sum identity give

$$
\left|\sum_{n=1}^N\chi(n)\right|
\le\sqrt q\,(1+\log q).
$$

For completeness: its zero Fourier coefficient vanishes, its nonzero Gauss
coefficients have modulus at most `sqrt(q)`, and the geometric sum at frequency
`r` has modulus at most `q/[2*min(r,q-r)]`. Summing the paired frequencies after
the `1/q` Fourier normalization gives at most `sqrt(q)*H_floor(q/2)`, bounded
as displayed. Complete periods contribute zero, so this works for every `N`.

Each `f_p` is the average of the five nonprincipal powers of `chi_p`.
For different primes, their pairwise products are primitive characters
modulo `pq`. Consequently,

$$
\left|\sum_{n\le N} f_p(n)f_q(n)\right|
\le\sqrt{pq}\,[1+\log(pq)]\quad(p\ne q).
$$

The exact identity
`f_p(n)^2 = (1/5)*1_(p does not divide n) + (4/5)*f_p(n)`
handles the diagonal. If every selected prime is at most `P`, expansion gives

$$
\boxed{\frac1N\sum_{n\le N}|A(n)|^2
\le\frac1{5K}
+\frac{4\sqrt P(1+\log P)}{5KN}
+\left(1-\frac1K\right)\frac{P(1+2\log P)}N.}
$$

Thus this is an actual mean-square estimate, not merely a complete-period
heuristic. If the prime selection has `K` of order `P/log P`, it gives
`O(log(P)/P + P*log(P)/N)`. Balancing at `P` of order `sqrt(N)` gives
`O(N^(-1/2)*log N)` for the normalized energy. This scale choice is not
licensed for the original compensated probe by this calculation.

## 5. Which dominant modes survive?

Let `T` be the convolution operator on `Z/MZ` whose Fourier multiplier is
`A(n)`. Unitary Fourier inversion gives `||T|| = max_n |A(n)| = 1`, because
`A(1)=1` and every `|f_p(n)|<=1`. Its normalized squared Hilbert–Schmidt norm
is the complete-period energy in Section 3, of order `1/(5K)`.

These are very different statements: small average spectral energy coexists
with operator norm one. Indeed, every residue that is a nonzero sixth power
modulo each selected prime has `A(n)=1`. The dimension of this eigenvalue-one
space is exactly

$$
\prod_{p\in\mathcal P}\frac{p-1}{6}.
$$

It generally contains many modes besides residue 1. Removing the principal
mode alone therefore does not force a strict operator-norm contraction.
This explicitly identifies the blind subspace of the proposed finite filter.
It does not identify the leading eigenspace of the original global Gram
operator, which has not been constructed here.

For a genuine coefficient vector `a`, let `Pi_bad` project onto Fourier
modes with `|A(n)|>tau`. The exact spectral decomposition gives

$$
\|Ta\|^2\le \|\Pi_{\rm bad}a\|^2+\tau^2\|a\|^2.
$$

Therefore a coefficient-specific bound
`||Pi_bad a||^2 <= N^(-delta)*||a||^2`, together with
`tau^2 <= N^(-delta)`, would give a power saving. Counting the bad modes
does not prove this weighted overlap estimate. An input vector supported
on an eigenvalue-one mode saturates `||Ta||=||a||`.

## 6. The remaining arithmetic construction

The local filter is available at a split Eisenstein prime because its residue
field is `F_p`. Turning it into an improved zeta probe still requires:

1. Realizing its five character powers by an explicit arithmetic operation on
   the low-side probe, with all supports, masks and twists retained. Defining
   a new high-side sum alone is insufficient.
2. Recomputing the principal Mellin residue and proving its correction remains
   nonvanishing. `A(1)=1` verifies the local scalar signal, not that entire step.
3. Bounding its overlap with the actual compensated coefficients on the
   Eisenstein rows, including the detected-class and numerator weights.
   The unweighted integer-interval theorem does not imply the previously
   proposed restricted fourth-moment estimate.
4. Comparing the gain with the low-side scale and coefficient costs. Finite
   Fourier contraction in the unweighted Euclidean norm does not establish
   contraction in the weighted norm used by the original probe.

A concrete next object is the weighted Gram matrix
`G_pq = sum_u W(u)*f_p(u)*conj(f_q(u))` for the actual nonnegative detector/
numerator weight `W`. For prescribed signal normalization `sum a_p=1`, its
minimum is `1/(1^* G^(-1) 1)` when `G` is positive definite. If it is singular,
one must first check whether a zero-energy signal-preserving vector exists;
otherwise use the inverse on its range. Finite optimization is diagnostic;
an asymptotic improvement needs uniform arithmetic control of this matrix.

## 7. Exact finite checks

`signed_phase_filter.py` verifies the local calculations in `Q(zeta_6)`,
complete-period cross terms, and interval energies using integer arithmetic.
It uses all 37 primes `p=1 mod 6` up to 400. Rounded display values:

| Integer rows N | Mean square of A | Signed off-diagonal contribution |
| --- | --- | --- |
| 1,000 | 0.008622176771 | 0.003267728269 |
| 10,000 | 0.005640593134 | 0.000314179693 |
| 100,000 | 0.005340472462 | 0.000014788605 |
| 200,000 | 0.005331929730 | 0.000006252155 |

The complete-period benchmark is approximately `0.005325611397`; the
principal response is exactly 1. These fixed-prime experiments check finite
identities, not a growing-prime asymptotic or a bound for zeta zeros.

```bash
python3 -E signed_phase_filter.py
python3 -E signed_phase_filter.py --json > /tmp/signed_phase_filter_results.json
diff -u signed_phase_filter_results.json /tmp/signed_phase_filter_results.json
```

The results file contains exact fractions. Only the Python standard library
is required. These follow-up files are outside the original checkpoint's
checksum manifest. The filter supplies a concrete signed arithmetic object
and a precise surviving-mode obstruction; it does not yet supply a large cut.
