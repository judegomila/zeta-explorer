# Prime-5 extension: retain the edge interaction exactly

This follows the [all-support attempt](weil-all-support-attempt-2026-09-30.md).
It develops an operator extension lemma and certifies the enlarged window
B=1.65: for every complex smooth pole-free h supported in (−0.825,0.825),
`W(h)≥10⁻¹⁴||h||₂²`. Both 184-dimensional parity blocks pass interval LDL at
512 bits, including the infinite-dimensional complement.
The simple collar-domination estimate proposed there is false at width 1.65;
an explicit interval witness below shows why its discarded mixed term matters.
These results are not an RH proof, a novelty claim, or a formally verified
proof. The analytic derivation and code require independent review.

## 1. Exact geometry of the entering prime

Let B be the support width, a=B/2, ℓ=log 5, c=log(5)/sqrt(5), and assume
`ℓ<B<min(2ℓ,log 7)`. The contributing prime powers are exactly 2,3,4,5.
On H=L²(−a,a), let W_old be the arithmetic Weil form with the contributions
2,3,4, **evaluated on this enlarged interval**. For smooth pole-free h,

\[
 W_B(h)=W_{\mathrm{old},B}(h)-2c\Re\int_0^{B-\ell}
              h(-a+y+\ell)\overline{h(-a+y)}\,dy.\tag{1}
\]

Put δ=B−ℓ, h_L(y)=h(−a+y), and h_R(y)=h(−a+y+ℓ) for 0<y<δ. These two
edge regions are disjoint. The exact square completion is

\[
 W_B(h)=\underbrace{W_{\mathrm{old},B}(h)
                -c(\|h_L\|^2+\|h_R\|^2)}_{\text{crude collar form}}
               +c\|h_L-h_R\|^2.\tag{2}
\]

Dropping the last term can destroy positivity. Neither h_L nor h_R is
assumed pole-free, and no positivity on the enlarged interval is inferred
from the previous width-1.6 certificate.

## 2. An explicit obstruction to the crude collar estimate

At B=33/20, set a=33/40, z=x/a, and define, with zero extension outside |z|≤1,

\[
 g(x)=(1-z^2)^4\sum_{j=0}^7\frac{k_j}{10^8}z^{2j+1},
 \qquad h=(-d^2/dx^2+1/4)g,
\]

where the exact integer vector is

```
[-6458, -245693, 1846367, -11318672,
 42196348, -91489040, 100000000, -43690323]
```

Integration by parts gives both zero exponential moments of h. The 384-bit
interval checker proves

\[
 \frac{W_{\mathrm{old},B}(h)-c(\|h_L\|^2+\|h_R\|^2)}{\|h\|^2}
 <-0.0122,
 \qquad \frac{W_B(h)}{\|h\|^2}>0.0911.\tag{3}
\]

The retained mismatch term divided by ||h||² lies between 0.1455 and 0.1456.
Thus (3) is a counterexample to the sufficient collar-domination proposal,
**not** a counterexample to Weil positivity.

The displayed h is C¹ with a piecewise polynomial second derivative. Since
g has vanishing endpoint traces through order 3, it belongs to H⁴₀(−a,a).
Approximation by smooth compact g_j in H⁴ gives pole-free h_j=Qg_j converging
to h in H². All forms in (3) are continuous under that convergence, so their
strict inequalities persist for smooth admissible tests.

### How the witness is certified

The norm and Legendre coefficients of h are rational and evaluated exactly.
Prime correlations and edge norms are polynomial integrals with Arb-enclosed
logarithmic endpoints. The archimedean integral is enclosed by 48-point
Gauss–Legendre rules on half-unit panels through T=400, with the analytic
quadrature error bounded as in the earlier finite-section proof. Its error
per ||h||² is less than 9.804×10⁻²⁴.

For t≥2, the digamma series gives
`Re ψ(1/4+it/2)−log π ≤ log t+1`. To see this, split the positive series terms
at n=ceil(t/2): their initial sum is at most H_n, and the remaining sum is
at most `(1/4)/n+(t/2)²/(2n²)≤3/4`. Dropping the negative initial terms and
using `H_n≤1+log n` gives the claimed bound. Two integrations by parts give
`|hhat(t)|≤||h''||₁/t²≤sqrt(B)||h''||₂/t²`. Therefore the omitted positive
archimedean tail is at most

\[
 \frac{B\|h''\|_2^2}{\pi T^3}
       \left(\frac{\log T+1}{3}+\frac19\right).
\]

This is less than 0.042179||h||². Monotonicity of the real digamma expression
and its certified positive value at T give a zero lower bound for that tail.
Both (3) bounds include the entire tail; they are not extrapolated numerics.

## 3. Keep the infinite-dimensional edge block in the baseline

Let S be translation by ℓ compressed to H, let F=S+S*, and let E be the
orthogonal projection onto the union of the two edge regions. Then

\[
 F^2=E,\qquad EF=FE=F,
 \qquad V_5=-cF.
\]

On each paired edge fiber F swaps the two coordinates; it is zero in the
interior. The sign channels `(h_L+h_R)/sqrt(2)` and `(h_L−h_R)/sqrt(2)`
diagonalize this swap, with eigenvalues +1 and −1. The other parts of the
form and the global moment constraints are still retained; these channels
are not treated as separate admissible pole-free tests. If d>c, the operator D=dI−cF is strictly positive, with exact inverse

\[
 D^{-1}=\frac1d I+
     \left(\frac d{d^2-c^2}-\frac1d\right)E
     +\frac c{d^2-c^2}F.\tag{4}
\]

This retains every edge mode. No finite-rank approximation of S, E, or F is
made, and no small-operator-norm claim is based on the collar width.

### Finite-rank extension lemma

Let U:R^N→H include an orthonormal finite family (use complex scalars for
complex h), and let C be a real symmetric finite matrix. Put

\[
 G=U^*D^{-1}U.
\]

Then

\[
 \boxed{\quad D+UCU^*\succeq0
       \quad\Longleftrightarrow\quad G^{-1}+C\succeq0.\quad}\tag{5}
\]

**Proof.** For a fixed z=U*h, minimizing ⟨h,Dh⟩ gives the minimum
`z*G^(−1)z`, attained at `h=D^(−1)UG^(−1)z`. Indeed subtracting this minimizer
leaves a vector with U*h=0, and the two vectors are D-orthogonal. Adding
`z*Cz` proves both implications. G is positive definite because D is strictly
positive and U has independent columns. ∎

Equations (4)–(5) are the extension mechanism. The mixed edge terms enter
through U*FU with their actual signs, instead of being bounded by U*EU.

## 4. Apply the lemma to the full Weil form

Use the old symbol

\[
 w_{\rm old}(t)=\Re\psi(1/4+it/2)-\log\pi
       -2\sum_{n=2,3,4}\frac{\Lambda(n)}{\sqrt n}\cos(t\log n).
\]

Choose m>c and T such that `w_old(t)≥m` for |t|≥T. Let K be the compressed
frequency multiplier `(w_old−m)1_[−T,T]`. As in the earlier proof,

\[
 W_B(h)\ge\langle h,(mI-cF+K)h\rangle
\]

on the pole-free test space. Add `γ(cosh(x/2)⊗cosh(x/2)+sinh(x/2)⊗sinh(x/2))`;
this auxiliary penalty vanishes exactly for those tests.

Use the first N orthonormal Legendre functions on (−a,a). Approximate K and
the two moment functions exactly as in the
[two-prime proof](weil-two-prime-certificate-2026-09-30.md), including the
quadrature, spatial projection, and moment projection errors. Denote their
sum by η. For a proposed gap ε set `d=m−ε−η` and require d>c. Let C be the
quadrature matrix plus the projected moment penalties. The full bounded
operator is then at least

\[
 \varepsilon I+D+UCU^*.
\]

Applying (5) reduces positivity to two parity blocks of `G^(−1)+C`. All
interior/edge interactions from K remain in this matrix. The global pole-free
constraints are enforced by the moment penalties; no cutoff of h is presumed
to preserve them.

The matrices U*EU and U*FU are computed with N-point Gauss quadrature on each
edge. This integration is exact for the polynomial products of degree at most
2N−2; only interval rounding remains. The inverse in (4) handles their
infinite-dimensional complement analytically.

For interval stability, the edge Legendre functions are evaluated directly
with Arb. A first implementation using the forward three-term recurrence
inflated endpoint radii and failed the LDL check with a pivot enclosure
containing zero; that run was inconclusive and emitted no certificate.
The frequency calculation encloses j_(N−1) and j_N by their hypergeometric
formulas, then uses the exact downward recurrence
`j_(n−1)=(2n+1)j_n/z−j_(n+1)`. This does not use a truncated asymptotic seed or
an unproved normalization. At every frequency node, the j_0 enclosure is
cross-checked against `sin(z)/z`. See [DLMF §10.51](https://dlmf.nist.gov/10.51)
for the recurrence identity.

## 5. Numerical certificate

The completed run uses B=33/20, ε=10⁻¹⁴, T=280, m=4/5, γ=1000, N=368,
52-point frequency quadrature, and 512-bit interval arithmetic. Both
184-dimensional parity blocks pass interval LDL. The generated receipt is
`research-inputs/rh-positivity-audit/prime5-extension-165.json`.

| Certified quantity | Conservative bound |
|---|---:|
| Old-symbol infinite-frequency floor | >0.854938 |
| Full baseline floor after all errors | >0.080237 |
| Quadrature operator error | <7.105×10⁻²⁴ |
| Omitted Legendre-space operator error | <8.336×10⁻³¹ |
| Moment projection error | <1.111×10⁻¹⁰⁶ |
| Minimum even-block LDL pivot | >0.00664 |
| Minimum odd-block LDL pivot | >0.01335 |

The LDL pivots certify matrix positivity; they are not asserted to equal
spectral gaps. The gap transferred to the full Weil form is the explicitly
reserved ε=10⁻¹⁴.

A successful endpoint certificate covers every smaller centered support
interval, because the extra prime correlations vanish when their translations
exceed the actual support width. In particular it covers the whole transition
`log 5 < B ≤ 1.65`; it is not interpolation between sampled widths. This is a
fresh certificate of the enlarged form, rather than an induction that assumes
its positivity from the previous endpoint.

The analytical error constants are inherited with B and T substituted, using
only the old symbol in the frequency estimates:

\[
 \begin{aligned}
 \Phi&=1+32/5+(T/2+1)\pi^2/6+\log\pi+m
       +\sum_{n=2,3,4}\frac{2\Lambda(n)}{\sqrt n}
                  \cosh(3\log n/16),\\
 \eta_{\rm quad}&=4TN\,\frac{\Phi B e^{3B/16}}\pi\,2^{1-2q},\\
 \eta_K&=\frac{4BT\Phi}\pi e^{3BT/8}\,2^{1-N},\\
 \eta_{\rm moment}&=8\gamma B e^{9B/16}\,2^{1-N}.
 \end{aligned}
\]

## 6. Scope and next obstruction

The useful conclusion is that retaining the signed edge interaction can
succeed where a simple collar-energy bound is false. The lemma is general,
but this certificate is local. It proves no uniform estimate for unbounded
support and hence does not prove RH.

The next prime is 7. There is a tractable next block, although its Weil
positivity has **not** been certified here. For `log 7<B<log 8`, put
`d₀=log(7/5)`, `δ₅=B−log 5`, `δ₇=B−log 7`; thus δ₅=d₀+δ₇ and 0<δ₇<d₀.
Use coordinates `L_y=h(−a+y)` and `R_y=h(−a+log(5)+y)` on the wider pair
of collars. The 5-edges join L_y to R_y, and the 7-edges join L_y to R_(y+d₀)
for 0<y<δ₇. Hence each such y gives the four-vertex chain
`R_y, L_y, R_(y+d₀), L_(y+d₀)`, with consecutive weights c₅,c₇,c₅. The
remaining coordinates δ₇<y<d₀ form ordinary 5-pairs; the interior is free.
The inequalities `log 8<2 log 7−log 5` and `log 8<2 log 5` ensure these regions
do not overlap incorrectly.

On each four-vertex component the weighted adjacency is

\[
 T_4=\begin{pmatrix}
 0&c_5&0&0\\
 c_5&0&c_7&0\\
 0&c_7&0&c_5\\
 0&0&c_5&0
 \end{pmatrix},\qquad
 \|T_4\|=\frac{c_7+\sqrt{c_7^2+4c_5^2}}2<1.176008.
\]

The norm formula follows by splitting into reflection-even and reflection-odd
vectors in this four-dimensional block. A 192-bit check encloses it and gives
`w_old(t)>1.211613` for |t|≥400. Thus a baseline with m=1.2 and these two
prime couplings is positive before the finite-section errors are deducted.
The same finite-rank lemma applies with the exact four-by-four inverse.
**This establishes the geometry and an admissible baseline, not positivity of
the resulting finite matrices or a width-2 certificate.**

For more prime translations, one must analyze the larger overlap components
and preserve their signed interactions. No all-prime control is proved.
Increasing support also exposes smaller spectral margins, so the present
epsilon is not asserted uniform in B.

## Reproduce

```sh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/audit-prime5-blocks.py --output research-inputs/rh-positivity-audit/prime5-block-algebra.json
python scripts/audit-prime5-collar.py --output research-inputs/rh-positivity-audit/prime5-collar-obstruction.json
python scripts/certify-prime5-extension.py --output research-inputs/rh-positivity-audit/prime5-extension-165.json
```

The receipts include source hashes, precision, and analytic error enclosures.
As a negative control, `--floor 1/2` is rejected before quadrature because
the full baseline is not positive on the edge pair; no receipt is emitted.
The old width-1.6 certificate is retained independently. The classical
all-support criterion is [Connes–Consani, Appendix C, Proposition C.1](https://arxiv.org/pdf/2006.13771).
