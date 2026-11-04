# A uniform actual-theta tail bound at radius n log n

Date: 2026-11-04. Status: independent algebra/domain audit PASS (AI-assisted, not peer review or machine formalization).
This is an independent estimate on the escaping region, not a selected
coherence theorem or a moment-to-determinant transfer.

## Statement

Use the actual theta transform F, w=F², V=2(F′²−FF″),
Tp=Fp′+2F′p, and X[p]=∫|Tp|². For every A>4/π and every
0<η<πA/2−2, there is a finite C_(A,η) such that every real polynomial
p of degree at most n, n≥1, satisfies

    ∫_{|t|≥A n log(n+2)}
      ( |Tp|² + w p′² + |V|p² + w p² ) dt
      ≤ C_(A,η) exp[−η n log(n+2)] X[p].                 (1)

In particular, this applies to every actual X-normalized selected polynomial
q_n and to either parity. It retains all real Xi zeros. No Q positivity,
RH, generalized inverse, or lower old-prefix gap is assumed.

The scale in (1) is n log n, not the monomial saddle scale n or its width
sqrt(n). The constants are not claimed to yield a useful small-degree
numerical certificate. The estimate does not control the region between a
fixed compact set and A n log(n+2), where the required selected asymptotic
remains open.

## 1. Actual theta envelope

The gamma-factor representation of Xi, fixed-order Stirling estimates, and
polynomial vertical-strip bounds for zeta and its first two derivatives give
some finite constants C and M such that

    |F^(j)(t)| ≤ C(1+|t|)^M exp(−π|t|/4),
    j=0,1,2,  t real.                                    (2)

For the derivative bounds one may apply Cauchy's formula in a fixed small
complex neighborhood of the critical line, then use Stirling uniformly in
that neighborhood. Polynomial factors and fixed logarithmic powers are
absorbed into M. This does not require a lower bound for zeta or information
about its zeros. These are the same unconditional exponential-moment inputs
used in the earlier exact theta reduction.

Set c=π/2. It follows that w, F′², and |FF″| are bounded by
C(1+|t|)^(2M) exp(−c|t|). In particular, this controls |V| without assuming
its sign.

## 2. Normalize on one fixed zero-free interval

Since F(0)≠0, choose a fixed 0<r≤1 such that F has no zero on I=[−r,r].
The exact identity

    F(t)²p(t)=∫_{−∞}^t F(s)Tp(s)ds

and Cauchy–Schwarz imply a finite constant C_I with

    ||p||_(∞,I)² ≤ C_I X[p].                             (3)

Here C_I can be taken as the supremum on I of
(∫_{−∞}^t F²)/F(t)^4. It is finite because I is fixed and zero free.
This is only an auxiliary normalization interval; no zeros are removed
from any global integral.

Chebyshev's extremal inequality gives, for |t|≥r,

    |p(t)| ≤ ||p||_(∞,I) |T_n(t/r)|
           ≤ ||p||_(∞,I) (2|t|/r)^n.                   (4)

Markov's inequality on I and the same extrapolation applied to p′ give

    |p′(t)| ≤ (n²/r)||p||_(∞,I)(2|t|/r)^(n−1).         (5)

Both bounds hold also when deg p<n. For p′=0, (5) is trivial.

## 3. Integrate the polynomial-envelope bound

Since

    |Tp|² ≤ 2w p′²+8F′²p²,

equations (2)–(5) show that the left side of (1), divided by X[p], is at
most

    C n^4 C_0^(2n) ∫_R^∞ t^(2n+2M) exp(−ct)dt,         (6)

for R≥max(1,r), after enlarging fixed constants to include both tails.

Write s=2n+2M. If R≥2s/c, then

    t^s ≤ R^s exp[s(t−R)/R]  for t≥R,

and consequently

    ∫_R^∞ t^s exp(−ct)dt ≤ (2/c)R^s exp(−cR).           (7)

Take R=A n log(n+2). The threshold in (7) holds for all sufficiently large
n. The logarithm of (6), with (7) substituted, is

    −cA n log(n+2) + 2n log n + 2n log log(n+2) + O_A(n)
    + O_M(log(n+2)).                                    (8)

Its leading coefficient on n log(n+2) is −(cA−2). Therefore every
η<cA−2 is valid eventually. Increasing C_(A,η) handles the finitely many
remaining n. Their tail norm is bounded by (3)–(6), so this adjustment
does not require any signed positivity hypothesis. This proves (1).

## Interpretation and precise remaining gap

The estimate supplies uniform integrable tails for the selected family at
an explicit expanding radius. Combined with the separately proved compact
localization, it narrows the unaddressed region but does not eliminate it.
In particular:

- It gives no concentration around t≈4n/π, unlike the unregressed monomial
  saddle calculation.
- It does not make the source-selected regression coefficients small or
  control cancellations in a theta moment matrix.
- It bounds absolute tail energy relative to X[p]. To convert this into an
  o(Δ_n) error one would still need a lower comparison Δ_n/X[P_n] that is
  not smaller than the displayed tail error. No such lower comparison is
  assumed here.
- It does not bound the total H[q_n], including the remaining expanding
  region, and therefore does not prove H[P_n]/X[P_n]→0 or U_n/Δ_n→0.

The proof uses standard Chebyshev/Markov estimates applied to the exact
theta envelope. No literature-novelty claim is made.
