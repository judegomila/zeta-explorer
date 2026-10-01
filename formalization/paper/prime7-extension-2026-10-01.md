# Prime-7 extension by exact four-node inverses

This follows the [prime-5 extension](prime5-extension-2026-09-30.md).
The completed 768-bit run certifies `W(h)>=10^(-24)||h||_2^2` for every
complex smooth pole-free test supported in (-1,1), extending the certified
support width from 1.65 to 2. Both 288-dimensional parity blocks pass.
The analytic reduction and implementation require independent review. This is
a local computer-assisted calculation, not a proof of RH, a Lean theorem,
or a claim of novelty.

## 1. Form and support

Write a=B/2 and use the Fourier transform
`hhat(t)=integral h(x) exp(-itx) dx`. The tests are complex-valued
`h in C_c^infinity(-a,a)` with `hhat(i/2)=hhat(-i/2)=0`. On these tests the
pole term vanishes and the exact Weil form is

\[
 W(h)=\frac1{2\pi}\int_{\mathbb R}
 \left(\Re\psi(1/4+it/2)-\log\pi
 -2\sum_{\log n<B}\frac{\Lambda(n)}{\sqrt n}\cos(t\log n)\right)
 |\widehat h(t)|^2\,dt.
\]

Here the sum is over prime powers. For `log 7 < B < log 8`, they are exactly
2, 3, 4, 5, 7. In particular, 4 carries coefficient `log 2 / 2` and there is
no 6 term. The main checker enumerates prime powers with interval comparisons;
it rejects a width that includes 8 or excludes 7.

We keep the 2,3,4 terms in the frequency symbol `w_old`. The 5 and 7 terms
are represented exactly as compressed spatial translations, including their
action on every omitted Legendre mode.

## 2. Direct-integral decomposition

Put `ell_p=log p`, `c_p=log p/sqrt p`,
`r=ell_7-ell_5`, and `delta=B-ell_7`. Throughout this range,

\[
 0<\delta<r,\qquad B<2\ell_5,\qquad B-\ell_5=r+\delta.
\]

The left and right collars are disjoint. With
`L_y=h(-a+y)` and `R_y=h(-a+ell_5+y)`, the 5-edges connect `L_y,R_y` for
`0<y<r+delta`. The 7-edges connect `L_y,R_(y+r)` for `0<y<delta`.

Consequently the translation operator is a direct integral of:

| Parameter range | Component, in matrix order | Physical offsets from -a+y |
|---|---|---|
| 0<y<delta | R_y, L_y, R_(y+r), L_(y+r) | ell_5, 0, ell_7, r |
| delta<y<r | L_y, R_y | 0, ell_5 |
| Remaining interior | Free scalar | — |

The four-node adjacency and the pair adjacency are

\[
 A_4=\begin{pmatrix}0&c_5&0&0\\c_5&0&c_7&0\\
 0&c_7&0&c_5\\0&0&c_5&0\end{pmatrix},
 \qquad A_2=\begin{pmatrix}0&c_5\\c_5&0\end{pmatrix}.
\]

This partitions both collars exactly: their combined measure is
`4 delta + 2(r-delta) = 2(B-ell_5)`. The free interior has measure
`2 ell_5-B`. All changes of parameter have Jacobian one.

Reflection in the four-node order gives the two two-dimensional adjacency
blocks with matrices `[[0,c_5],[c_5,+c_7]]` and
`[[0,c_5],[c_5,-c_7]]`. Hence

\[
 \rho_4=\|A_4\|=
 \frac{c_7+\sqrt{c_7^2+4c_5^2}}2<1.176008.
\]

Let `F_p` be the sum of the compressed translation by `ell_p` and its adjoint.
For `d>rho_4`, the full Hilbert-space operator

\[
 D=dI-c_5F_5-c_7F_7
\]

is positive and invertible. Its inverse is exactly `(dI_4-A_4)^(-1)` on
four-node fibers, `(dI_2-A_2)^(-1)` on pairs, and `1/d` on the free interior.
There is no replacement of an interaction by its absolute value.

## 3. Finite-rank criterion and exact spatial integration

For an orthonormal inclusion U of the first N Legendre functions, set
`G=U* D^(-1) U`. The general lemma from the prime-5 note states

\[
 D+UCU^*\succeq0\quad\Longleftrightarrow\quad G^{-1}+C\succeq0.
\]

Indeed, at fixed `U*h=z`, the minimum of `<h,Dh>` is `z*G^(-1)z`, attained
by `D^(-1) U G^(-1)z`. This preserves the interaction between the finite
section and the full complementary space.

Writing `phi_n(x)=sqrt((2n+1)/B) P_n(x/a)`, the implemented Gram matrix is

\[
 G_{nm}=\frac{\delta_{nm}}d+
 \sum_{\text{fibers}}\int_{l}^{u}\sum_{i,j}
 \phi_n(-a+y+b_i)
 \left[(dI-A)^{-1}_{ij}-\frac{\delta_{ij}}d\right]
 \phi_m(-a+y+b_j)\,dy.
\]

Each spatial integrand is a polynomial of degree at most `2N-2`. Thus
N-point Gauss–Legendre quadrature is exact; Arb enclosures account for
rounding and interval endpoints. Direct Arb Legendre evaluation avoids the
interval-radius inflation previously observed in a forward recurrence.

Spatial reflection sends four-node `y` to `delta-y` and reverses the four
vertices. For pairs it sends `y` to `r+delta-y` and exchanges the two vertices.
Thus D and its inverse commute with reflection. The even and odd Legendre
blocks decouple exactly; this is also checked independently on polynomial
integrals. Complex coefficients are covered by positivity of the real
symmetric matrices viewed as Hermitian matrices.

## 4. Infinite-frequency and omitted-space bounds

Choose a tail floor m for `w_old(t)` on `|t|>=T`, and reserve the desired
gap epsilon. The low-frequency compressed multiplier is
`K=(w_old-m) 1_[-T,T]`. The two moment penalties are
`gamma(cosh(x/2) tensor cosh(x/2) + sinh(x/2) tensor sinh(x/2))`; their
quadratic forms vanish on the stated pole-free tests.

The frequency matrix C is the projected K plus the projected moment
penalties. The analytic bounds, derived in the predecessor notes, are

\[
\begin{aligned}
 \Phi&=1+32/5+(T/2+1)\pi^2/6+\log\pi+m+
 \sum_{n=2,3,4}\frac{2\Lambda(n)}{\sqrt n}\cosh(3\log n/16),\\
 \eta_q&=4TN\frac{\Phi B e^{3B/16}}\pi\,2^{1-2q},\\
 \eta_K&=\frac{4BT\Phi}\pi e^{3BT/8}\,2^{1-N},\\
 \eta_M&=8\gamma B e^{9B/16}\,2^{1-N},\\
 d&=m-\epsilon-\eta_q-\eta_K-\eta_M.
\end{aligned}
\]

These give `W(h)-epsilon||h||^2 >= <h,(D+UCU*)h>` on pole-free tests.
The finite checks therefore include the entire frequency tail and omitted
spatial space. No inferred numerical eigenvalue or floating-point slack
is used to accept a matrix. The acceptance test is an interval-certified
congruence followed by strictly positive Gershgorin row bounds, as described
below.

Only 2,3,4 enter Phi and the frequency tail envelope. The 5 and 7 terms are
already included exactly in D and must not be counted a second time.

The frequency integral is accumulated in batches of half-unit panels. Each
panel uses q-point Gauss quadrature, with the same summed analytic error
bound as the earlier checker. Batching changes memory use, not the mathematical
approximation. Spherical Bessel values use the exact downward recurrence
from two independently enclosed hypergeometric seeds; the value at order zero
is cross-checked against `sin(z)/z` at every node. See
[DLMF 10.51.1](https://dlmf.nist.gov/10.51.E1).

## 5. Computational outcome

The completed run uses B=2, epsilon=10^-24, T=400, N=576, q=64, m=6/5,
gamma=1000, and 768-bit Arb arithmetic. Both 288-dimensional parity matrices
pass the interval congruence test. The receipt is
`research-inputs/rh-positivity-audit/prime7-extension-200.json`; it includes
the source SHA-256, package version, all parameters and analytic enclosures.

| Certified quantity | Conservative bound |
|---|---:|
| Old-symbol infinite-frequency floor | >1.211613 |
| Full baseline floor after all errors | >0.023992 |
| Quadrature operator error | <1.723 x 10^-30 |
| Omitted Legendre-space operator error | <5.494 x 10^-38 |
| Moment projection error | <3.986 x 10^-169 |
| Even transformed-matrix Gershgorin margin | >0.999 |
| Odd transformed-matrix Gershgorin margin | >0.999 |

The last two rows certify matrix positivity in changed coordinates; the
transferred full-form gap is the reserved `10^-24`. This proves, subject to
independent review of the reduction and code,

\[
 \boxed{W(h)\ge10^{-24}\|h\|_2^2\quad
 (h\in C_c^\infty(-1,1),\ \widehat h(\pm i/2)=0).}
\]

The statement covers every smaller centered support interval by inclusion,
including the entire prime-7 transition `log 7 < B <= 2`. It is a fresh
certificate of the enlarged operator, not an induction assuming positivity
from the width-1.65 result. No larger support window is certified here.

The 12 grouped geometry/integration checks at 320 bits and the six acceptance
and rejection controls pass. Receipt source hashes, `npm run audit:rh`, and
whitespace checks pass. The full application build and Lean projects were
not run, and there has been no independent mathematical review of this result.

### Fixed preconditioner, rigorous acceptance

The first width-2 run at 768 bits was inconclusive under direct interval LDL:
the interval for pivot 67 in the even block contained zero (reported as
`[+/- 5.44]`). No certificate was emitted. This does not show that the form
has a negative direction. Repeated dependence on the same interval entries
can inflate an elimination enclosure.

The revised checker constructs a fixed lower-triangular preconditioner V from
midpoint LDL. Each entry of V is an exact dyadic midpoint, its upper triangle
is exactly zero, and every diagonal entry is checked strictly positive.
Consequently V is invertible. This preliminary calculation is used only to
choose V; its approximate pivots are not a positivity certificate.

For the original interval-enclosed matrix `M=G^(-1)+C`, the checker then
computes `Q=V M V^T` using interval matrix multiplication and verifies every row:

\[
 Q_{ii}-\sum_{j\ne i}|Q_{ij}|>0.
\]

Every original entry uncertainty remains in this product. The underlying
exact Q is symmetric, so these bounds put all its eigenvalues strictly above
zero. Since V is invertible, M is positive definite. Choosing V inaccurately
can cause rejection; it cannot create a false passing certificate.
The Gershgorin margins are margins in the transformed coordinates, not
claimed spectral gaps for W. The latter uses the reserved epsilon.

Acceptance controls exercise the actual routine: it accepts the positive
16-by-16 Hilbert Gram matrix, rejects an indefinite matrix, and rejects an
interval matrix whose midpoint is positive but which includes negative
matrices. Thus midpoint positivity by itself is not accepted.

## 6. What remains for RH

A certificate at a single finite support width covers smaller centered
intervals by inclusion. It does not certify any larger width. The classical
criterion requires all compact pole-free tests, equivalently an unbounded
sequence of nested support windows; it does not require a common strictly
positive gap. See [Connes–Consani, Appendix C, Proposition C.1](https://arxiv.org/pdf/2006.13771).

The next arithmetic threshold after this checker is `log 8`, a prime-power
term with coefficient `log 2/sqrt 8`. The current checker deliberately rejects
it. Its geometry can nevertheless be prepared without claiming positivity.

### Next block: the prime power 8

For `log 8 < B < log 9`, put
`u=log(8/7)`, `v=log(7/5)`, and `e=B-log 8`. Then `0<e<u` and `u+e<v`.
The 8-edge connects the four-node component with parameter y to that with
parameter y+u, for `0<y<e`. The two parameter ranges are disjoint. This gives:

| Parameter range | Component | Offsets from -a+y |
|---|---|---|
| 0<y<e | Eight-node tree | ell_5, 0, ell_7, v, ell_5+u, u, ell_8, v+u |
| e<y<u | Remaining four-node chain | ell_5, 0, ell_7, v |
| u+e<y<v | Remaining 5-pair | 0, ell_5 |

In zero-based vertex order, the eight-node tree has edges
`(0,1),(2,3),(4,5),(6,7)` of weight c_5,
`(1,2),(5,6)` of weight c_7, and `(1,6)` of weight
`c_8=log 2/sqrt 8`. It is two four-node chains connected at interior
vertices, not a simple eight-node path. The collar measure checks as
`8e+4(u-e)+2(v-u-e)=2(B-log 5)`.

The independent audit certifies positive LDL pivots of `1.3 I-A_8` at 320
bits. Since this tree is bipartite, its spectrum is symmetric, so this proves
`||A_8||<1.3`. At T=440, the old-symbol frequency floor exceeds 1.306923.
It also compares 16 polynomial translation-form entries at B=2.15 against
direct correlation integrals, with the correct prime-power coefficient.
These checks establish geometry and an admissible baseline only.
**No width-2.15 Weil-positivity certificate has been computed.**

This provides the next implementable finite step. It supplies no induction
across arbitrary thresholds, unbounded-support estimate, or all-prime
cancellation theorem. Those remain the essential gap to RH.

## Reproduce

```sh
python -m pip install -r scripts/requirements-rh-audit.txt
python scripts/audit-prime7-blocks.py --output research-inputs/rh-positivity-audit/prime7-block-algebra.json
python scripts/audit-prime7-acceptance.py --output research-inputs/rh-positivity-audit/prime7-acceptance-controls.json
python scripts/certify-prime7-extension.py --output research-inputs/rh-positivity-audit/prime7-extension-200.json
```

The block audit uses polynomial antiderivatives independently of the main
checker, checks the closed reflection-block inverse, and compares all 36
entries on monomials of degree at most five. It rejects wrong inverse signs
and detects deleting the 7-edge. These are implementation checks, not a
formal verification of the analytic reduction.

Negative controls `--floor 11/10`, `--width 1.94`, and `--width 2.1` are rejected
before quadrature and emit no certificate.
