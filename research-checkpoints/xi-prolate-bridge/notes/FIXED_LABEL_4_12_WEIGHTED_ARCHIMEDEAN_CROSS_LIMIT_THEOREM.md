# Fixed-label 4/12 weighted Archimedean cross limit theorem

## 0. Exact result and claim boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad A=\lambda^2 .                 \tag{0.1}
\]

Let \(\widetilde B_4,\widetilde B_{12}\) be the complete one-tail
physical profiles of the actual scalar-defect-white source-normalized
anchor and actual anchor-deflated label-12 column.  All sample series use
the Fejer convention frozen in the complete fixed-plane theorem.  Put

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}
                   +{i\xi\over2}\right)-\log\pi .     \tag{0.2}
\]

This note proves the exact centered estimate

\[
 \boxed{
 2\int_{\mathbb R}\{a(\xi)-\log c\}
       \widehat{\widetilde B}_{12}(\xi)
       \overline{\widehat{\widetilde B}_4(\xi)}
       {d\xi\over2\pi}=O(1)}                           \tag{0.3}
\]

and hence, using the already-frozen physical cross limit,

\[
 \boxed{
 {2\over\log c}\int_{\mathbb R}a(\xi)
       \widehat{\widetilde B}_{12}(\xi)
       \overline{\widehat{\widetilde B}_4(\xi)}
       {d\xi\over2\pi}
 \longrightarrow \mathcal G_8,}                       \tag{0.4}
\]

\[
 \mathcal G_8=\sum_{m\geq1}
 {\sin(8\arcsin(1/m))\over16\pi m}>0.                \tag{0.5}
\]

Equivalently, the weighted Archimedean cross is

\[
 \mathcal G_8\log c+o(\log c).                         \tag{0.6}
\]

The frozen inputs state only
\(e_j^2/(2\pi\lambda d_j)\to1\), without a quantitative rate.
Consequently this note does **not** promote (0.6) to
`mathcal G_8*log(c)+O(1)`.  Such a promotion requires, for example,

\[
 2\langle B_{12},B_4\rangle
       =\mathcal G_8+O(1/\log c),                       \tag{0.7}
\]

or a separately pinned endpoint/Jost normalization rate which implies
(0.7).  Differentiating the printed `O(1/c)` remainder in the fixed-index
defect asymptotic is not a proof of that rate.

Equation (0.4), together with the separately proved bounded
non-Archimedean cross package, is already the strength needed to obtain the
nonzero anchor/12 cross at scale \(d_8\log c\).  This note itself proves no
prime quadrature, reflected estimate, positivity, zero statement,
determinant limit, equation (5.2) of `DIRECT_RH_ATTACK.md`, or Riemann
hypothesis conclusion.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs

| Dependency | SHA-256 |
|---|---|
| `notes/ANCHOR_LABEL12_SIGNED_CROSS_CORRELATION_BARRIER.md` | `632f9320855d48ac923e13d1176347cb9ccbe7925170babd52a0c5313d5bfb00` |
| `notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md` | `e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md` | `fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c` |
| `notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md` | `34bb4e43faf04f34e11126946b1069480375d5ba18baf9c97e9746b246594a0f` |
| `notes/PROLATE_DEFECT_SOURCE_AUDIT.md` | `b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d` |

The barrier proves, with the Fourier convention used in (0.3),

\[
 2\langle\widetilde B_{12},\widetilde B_4\rangle
 \longrightarrow {1\over2\pi}\sum_{m\geq1}{1\over m}
 \int_{\sqrt{m^2-1}}^\infty
 {\cos(8\beta(x))\over1+x^2}\,dx=\mathcal G_8,       \tag{1.1}
\]

where \(\beta(x)=\arctan(1/x)\).  Indeed the integral in (1.1) is
\(\sin(8\arcsin(1/m))/8\), which fixes both the factor `16*pi` and
the sign in (0.5).

For a pure scalar-defect-white fixed label \(j\), write \(B_j\) for its
one-tail profile.  The actual profiles are fixed finite combinations of
the pure labels `0,4,12`.  In white coordinates their lower-label
coefficients obey

\[
 \widetilde B_4=B_4+O(\lambda^{-4})B_0+o(1),\qquad
 \widetilde B_{12}=B_{12}+O(\lambda^{-8})B_4
                         +O(\lambda^{-12})B_0+o(1).   \tag{1.2}
\]

The final `o(1)` terms are the state-invisible origin corrections.  They
are Schwartz at the physical samples and are smaller than every fixed
profile estimate below.

## 2. A cutoff-uniform scaled fractional estimate

Zero extend every one-tail profile to the negative half-line and fix

\[
 \delta={1\over8}.                                     \tag{2.1}
\]

The binding regularity statement is

\[
 \boxed{
 \sup_c\int_{\mathbb R}
       \left(1+{|\xi|\over c}\right)^{2\delta}
       |\widehat B_j(\xi)|^2{d\xi\over2\pi}<\infty,
 \qquad j\in\{0,4,12\}.}                              \tag{2.2}
\]

We prove (2.2) for the complete Fejer rows.  On the Jost range put

\[
 x_m(s)=\sqrt{m^2e^{2s}-1},\qquad
 \phi_{j,m}(s)=cx_m(s)+\nu_j\beta(x_m(s)),             \tag{2.3}
\]

\[
 \nu_j={2j+1\over2}+O_j(c^{-1}),\qquad
 \phi'_{j,m}=cx_m+{c-\nu_j\over x_m}.                 \tag{2.4}
\]

The common outgoing amplitude of a pure white row is

\[
 b_m(s)={1+O_j((cx_m)^{-1})\over
                 \sqrt{2\pi m x_m(s)}}.               \tag{2.5}
\]

The `O` term in (2.5) is retained as the differentiated Volterra symbol;
it is not discarded before the Fejer limit.

### 2.1 Samples \(m\geq2\)

Let \(\{\chi_r\}_{r\geq0}\) be a fixed smooth, bounded-overlap unit
partition of the half-line.  For \(m\geq2\), (2.3)--(2.5) give

\[
 \|\chi_rb_m\|_\infty+\operatorname {Var}(\chi_rb_m)
 \leq {K_j e^{-r/2}\over m},\qquad
 |\phi'_{j,m}|\asymp cme^r                              \tag{2.6}
\]

on the support of \(\chi_r\).  For unequal samples, the map
\(x\mapsto x+(1-\nu_j/c)/x\) is increasing for the present
\(x\geq\sqrt3\).  Subdivision into at most a fixed number of
monotonicity intervals therefore gives the first-derivative denominator

\[
 |(\phi_{j,m}-\phi_{j,l})'|
 \geq \kappa ce^r|m-l|,\qquad
 m,l\geq2,\quad m\ne l.                               \tag{2.7}
\]

The sum phases satisfy the stronger lower bound
\(\kappa ce^r(m+l)\) and are included in the same estimate.

For completeness, the fractional-BV step used here is the following
standard one-dimensional estimate.  If \(q_m\) obeys (2.6), the phase
derivatives lie in a fixed multiple of \(\Omega m\), and (2.7) holds
with \(\Omega=ce^r\), then a dyadic Fourier partition, Plancherel on the
phase band, and BV integration by parts off that band give

\[
\begin{aligned}
 \left\|\sum_{m\geq2}q_me^{i\phi_m}\right\|_{H^\delta}^2
 \leq{}&K\Omega^{2\delta}
       \sum_{m\geq2}m^{2\delta}
       (\|q_m\|_\infty+\operatorname {Var}q_m)^2\\
 &+K\Omega^{2\delta-1}
 \sum_{m\ne l}{(\max\{m,l\})^{2\delta}\over
 ml(1+|m-l|)} .
\end{aligned}                                          \tag{2.8}
\]

To see that (2.8) is cutoff-uniform, first prove it for a finite Fejer
row.  On a dyadic frequency band meeting a phase band,
\(|\xi|^\delta\) is at most a fixed multiple of
\((\Omega\max\{m,l\})^\delta\).  The diagonal terms follow from
Plancherel.  For an unequal pair, integrate its difference phase once;
(2.7), the two BV norms, and the two band endpoints give the second line.
Outside every phase band the same integration gives a geometric dyadic
tail.  All Fejer weights lie in `[0,1]`, so deleting them only enlarges
the displayed majorants.  This proves (2.8) with no dependence on the
outer sample cutoff.

The sample sums in (2.8) converge for every \(\delta<1/2\).  Near the
diagonal the second one is bounded by

\[
 K\sum_{m\geq2}m^{-2+2\delta}(1+\log m)<\infty,       \tag{2.9}
\]

and its two far triangles are smaller.  Equations (2.6)--(2.9), followed
by the bounded-overlap sum in \(r\), give

\[
 \left\|\sum_{m\geq2}b_m\sin\phi_{j,m}\right\|_{H^\delta}^2
 \leq K_jc^{2\delta}
 \sum_{r\geq0}e^{-(1-2\delta)r}
 \leq K_jc^{2\delta}.                                  \tag{2.10}
\]

The differentiated Volterra symbols have the same phase and BV bounds
with an additional factor `c^(-1)`, so (2.10) includes them.

### 2.2 The reciprocal sample and hard edge

Only \(m=1\) reaches the hard edge.  On its Jost part, use radial dyadic
intervals.  Since

\[
 ds={x\,dx\over1+x^2},\qquad
 |b_1|^2\,ds\leq {K\,dx\over1+x^2},\qquad
 {\phi'_{j,1}\over c}\asymp x+x^{-1},                 \tag{2.11}
\]

the same one-phase fractional-BV estimate gives

\[
 c^{-2\delta}\|B_{j,1}^{\rm Jost}\|_{H^\delta}^2
 \leq K_j\int_0^\infty
 {(x+x^{-1})^{2\delta}\over1+x^2}\,dx<\infty.        \tag{2.12}
\]

Both endpoints of the integral are finite precisely when
\(\delta<1/2\).

On \(cx\geq1\), the exact hard row is split into the two standard
oscillatory branches of \(J_0(cx)\); (2.11)--(2.12) apply to them with
uniform BV symbols.  On \(cx<1\), the regular row has size
`O(c^(1/2))` on an `s` interval of length `O(c^(-2))`.  Its zero-extended
Gagliardo contribution is

\[
 O\!\left(c\{c^{-2}\}^{1-2\delta}\right)
 =O(c^{-1+4\delta})=O(c^{2\delta})                   \tag{2.13}
\]

for the chosen \(\delta=1/8\).  The integrated hard-edge Volterra
perturbation has an extra factor `c^(-1)`.  Equations (2.12)--(2.13), the
triangle inequality between the single reciprocal row and the
\(m\geq2\) synthesis, and (2.10) prove (2.2) at every finite Fejer cutoff.

### 2.3 Endpoint jumps and the Fejer limit

It remains to justify that the uniform fractional bound reaches the exact
representative at the endpoint jumps.  The sole conditional row is

\[
 F_A(s)={\bf1}_{s\geq0}e^{-s/2}P(Ae^s),\qquad
 P(x)={1\over2}-\{x\}.                                \tag{2.14}
\]

If \(0<h<1\), put \(u=e^h-1\asymp h\) and use \(x=Ae^s\).  On the cell
`[n,n+1)`, while \(un<1\), the jump-crossing set has length at most
`K*u*n`; its weighted contribution is at most `K*A*u/n`.  Off that set,
the squared change is at most `K*(u*n)^2`, contributing `K*A*u^2`.
Above \(n=1/u\), use the trivial bound.  The zero-extension strip and
the change of `e^(-s/2)` are smaller.  Thus

\[
 \boxed{
 \|F_A(\cdot+h)-F_A\|_2^2
 \leq K\min\left\{1,
 Ah\left(1+\log_+{1\over Ah}\right)\right\}.}         \tag{2.15}
\]

The logarithm in (2.15) is mandatory: the crossing contribution is the
harmonic sum \(Ah\sum_{A\leq n\leq1/h}n^{-1}\).  The Gagliardo identity
and the substitution \(v=Ah\) now give, for every \(0<\delta<1/2\),

\[
 [F_A]_{H^\delta}^2
 \leq K_\delta A^{2\delta}
 \left\{\int_0^1v^{-2\delta}(1+\log(1/v))\,dv+1\right\}
 \leq K_\delta A^{2\delta}.                           \tag{2.16}
\]

This is consistent with, and sharper than needed from, the frozen
weighted-translation theorem.  Since \(A=c/(2\pi)\), (2.16) has exactly
the scale in (2.2).

The complete Poisson formula identifies the local `L1` Fejer limit with
(2.14) plus its recombined radial remainder.  The uniform bounds already
proved for the complete finite Jost, hard, and Volterra rows give weak
compactness in \(H^\delta\); local `L1` identification and uniqueness of
the `L2` limit identify every weak limit with the complete physical
profile.  Lower semicontinuity then proves (2.2) for that profile.  No
Bernoulli remainder is differentiated term by term.

Finally, (1.2) is a bounded finite combination of rows satisfying (2.2).
The Schwartz origin correction is smaller.  Therefore (2.2) also holds
with \(B_j\) replaced by either actual profile
\(\widetilde B_4,\widetilde B_{12}\).

## 3. Low frequency and the centered multiplier

For \(|\xi|\leq c/2\), (2.4) is separated from both Fourier signs by a
fixed multiple of \(c\).  The BV first-derivative estimate gives
`K/(c*m^2)` for every \(m\geq2\), uniformly in the Fejer cutoff.  For
\(m=1\), the substitution \(z=cx\) in the exact Bessel row gives the same
`O(c^(-1))` bound; the complete Volterra terms are absolutely summable.
Thus every pure fixed row, and hence both actual rows, obeys

\[
 \sup_{|\xi|\leq c/2}|\widehat B_j(\xi)|\leq {K_j\over c},
 \qquad
 \int_{|\xi|\leq c/2}|\widehat B_j(\xi)|^2
 {d\xi\over2\pi}=O(c^{-1}).                            \tag{3.1}
\]

The digamma series, followed by its decreasing-integral comparison, gives

\[
\begin{aligned}
 |a(\xi)-\log c|&\leq K\log c,
        &&|\xi|\leq c/2,\\
 |a(\xi)-\log c|&\leq K+\log^+(|\xi|/c),
        &&|\xi|\geq c/2 .
\end{aligned}                                          \tag{3.2}
\]

The low-frequency part of the centered cross is
`O(c^(-1)*log(c))` by (3.1) and Cauchy--Schwarz.  On the complementary
region use

\[
 \log^+x\leq{x^\delta\over\delta}\quad(x\geq1)       \tag{3.3}
\]

and weighted Cauchy--Schwarz with (2.2).  This gives

\[
 \int_{|\xi|\geq c/2}
 \{1+\log^+(|\xi|/c)\}
 |\widehat{\widetilde B}_{12}(\xi)
   \widehat{\widetilde B}_4(\xi)|{d\xi\over2\pi}
 \leq K.                                               \tag{3.4}
\]

Equations (3.1)--(3.4) prove (0.3).  Plancherel now yields the exact
decomposition

\[
\begin{aligned}
 2\int_{\mathbb R}a(\xi)
       \widehat{\widetilde B}_{12}(\xi)
       \overline{\widehat{\widetilde B}_4(\xi)}
       {d\xi\over2\pi}
 ={}&2\log c\,
       \langle\widetilde B_{12},\widetilde B_4\rangle+O(1).
\end{aligned}                                          \tag{3.5}
\]

Divide (3.5) by \(\log c\) and insert (1.1).  This proves (0.4)--(0.6).
The algebraically small lower-label coefficients in (1.2), even after
multiplication by \(\log c\), tend to zero; no unbounded-form continuity
is being inferred from `L2` convergence alone because every pure row was
first controlled by (2.2).

## 4. Why the stronger remainder is not frozen

The fixed-index defect audit records

\[
 d_j=C_jc^{j+1/2}e^{-2c}\{1+O_j(c^{-1})\},             \tag{4.1}
\]

and the exact endpoint identity ultimately gives the qualitative ratio
\(e_j^2/(2\pi\lambda d_j)\to1\).  It is tempting to differentiate
(4.1) and infer a relative endpoint rate.  That operation is invalid for
an undifferentiated `O(c^(-1))` remainder.  None of the frozen notes in
Section 1 states a differentiated remainder or the quantitative physical
cross estimate (0.7).

Thus the admitted conclusion is exactly (0.3)--(0.6).  A future narrow
endpoint-normalization lemma may strengthen (1.1) to (0.7); only then may
(3.5) be rewritten as `mathcal G_8*log(c)+O(1)`.
