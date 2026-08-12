# RH actual odd-ground primitive and Christoffel parity barrier

## 0. Exact outcome and claim boundary

Assume RH and use the actual finite zero-evaluation Gram on the centered
source space

\[
 E_N=\operatorname {span}\{V_n:-N\leq n\leq N\},
 \qquad N=e^{L/2}L^3+O(L).                         \tag{0.1}
\]

Let `Q_+` and `Q_-` be its inversion-even and inversion-odd blocks and put

\[
 \lambda_+=\lambda_{\min}(Q_+),
 \qquad \lambda_-=\lambda_{\min}(Q_-).             \tag{0.2}
\]

This note proves an exact finite sufficient criterion for the first
finite gate.  If `g_-` is an odd ground and `P g_-` is its endpoint-zero
even primitive, then

\[
 \boxed{
 {\displaystyle\sum_{\gamma>0}m_\gamma
       |\widehat g_-(\gamma)|^2/\gamma^2
  \over
  \displaystyle\sum_{\gamma>0}m_\gamma
       |\widehat g_-(\gamma)|^2}
 <{\|P g_-\|_2^2\over\|g_-\|_2^2}}
                                                               \tag{0.3}
\]

is equivalent to the primitive trial having Rayleigh value below
`lambda_-`.  It therefore implies

\[
 \boxed{\lambda_+<\lambda_-.}                       \tag{0.4}
\]

The source commutator then proves, without a separate genericity
assumption, that the global ground is simple and inversion even.  Its
boundary pairing is nonzero by the same source argument.

There is an exact Christoffel reformulation.  The two parity pencils are
generalized Hankel moment pencils for measures related by multiplication
by `2y`.  If `p_-` is an odd minimizing polynomial, (0.3) is

\[
 \boxed{
 \Delta_N:=
 \nu_e(yp_-^2)\sigma_e(p_-^2)
 -\nu_e(p_-^2)\sigma_e(yp_-^2)>0.}                 \tag{0.5}
\]

Thus the minimal missing actual statistic is a ground-weighted mean
comparison: the `p_-^2`-weighted mean of `y=gamma^2` for the actual zero
measure must exceed the corresponding carrier mean.

Neither RH location, the HSW count, separate Hankel total positivity, nor
the new adaptive Stokes theorem proves (0.5).  The Stokes result is a
one-vector theorem for the projected prolate state; `p_-` is the unknown
global odd ground.  An exact `N=2` symmetric real-evaluation Gram with
integer multiplicities is positive definite but has an odd global ground.
It proves that positive evaluation-Gram, source-Cauchy displacement,
reflection symmetry, and integer multiplicity do not imply (0.4).

The countermodel is structural.  It is not the zeta divisor, is not claimed
to satisfy HSW, and proves no actual-arithmetic parity failure.  This note
does not prove (0.5) on one cutoff, much less a cofinal subsequence.  It
does not synchronize the simple-even, shifted-sign, reserve, or literal
ceiling gates.  It proves no new zero statement, no RH implication or
converse, and no de Bruijn--Newman bound.  The formal state remains
`P0_INVALIDATED`.  This is an unbound post-checkpoint-1.49 pair and changes
none of the standard eight files.

## 1. Minimal frozen inputs

Only the following five repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md` | `d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0` |
| `notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md` | `0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3` |
| `tests/test_odd_zero_gram_lower_frame_audit.py` | `b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467` |
| `notes/ADAPTIVE_PROLATE_STOKES_ENDPOINT_ROW_TRANSFER_THEOREM.md` | `0ae198d3a304960744a04c0ec095ffa6afcd4aa61599de551780efb43f89d878` |
| `tests/test_adaptive_prolate_stokes_endpoint_row_transfer_theorem.py` | `e54bb937552247550c4ed57c1e20b86883556460416b5f046618076b2fbf4b76` |

The source note supplies the exact source-Cauchy commutator and boundary
argument.  The odd-Gram pair supplies the RH value-Gram normalization and
the HSW-compatible carrier-lattice no-go.  The Stokes pair supplies only
the actual projected-prolate quotient and the decay of its one-vector
endpoint ratio.  No zero table, external theorem, numerical matrix, or
new source convention is imported.

## 2. Centered parity spaces and the exact primitive

Put

\[
 I=[-L/2,L/2],\qquad a_n={2\pi n\over L},            \tag{2.1}
\]

and use the aligned real parity bases

\[
 e_0^+(x)=L^{-1/2},
 \qquad
 e_n^+(x)=\sqrt{2/L}(-1)^n\cos(a_nx),               \tag{2.2}
\]

\[
 \widetilde e_n^-(x)=\sqrt{2/L}(-1)^n\sin(a_nx),
 \qquad1\leq n\leq N.                              \tag{2.3}
\]

Multiplication of the source basis `e_n^-` by the fixed unimodular scalar
`-i` gives (2.3), so it changes neither norms nor the odd Gram spectrum.
For

\[
 g=\sum_{n=1}^Nd_n\widetilde e_n^-                  \tag{2.4}
\]

define the clamped primitive

\[
 (Pg)(x)=\int_{-L/2}^xg(u)\,du.                     \tag{2.5}
\]

Since `g` is odd, its integral on `I` is zero.  Direct integration of one
basis vector gives

\[
 P\widetilde e_n^-={\sqrt2e_0^+-e_n^+\over a_n}.    \tag{2.6}
\]

Consequently

\[
 \boxed{
 Pg=\sqrt2\left(\sum_{n=1}^N{d_n\over a_n}\right)e_0^+
       -\sum_{n=1}^N{d_n\over a_n}e_n^+}            \tag{2.7}
\]

belongs to the exact finite even space and satisfies

\[
 Pg(-L/2)=Pg(L/2)=0,
 \qquad (Pg)'=g.                                    \tag{2.8}
\]

Orthonormality gives the exact coefficient norm

\[
 \boxed{
 \|Pg\|_2^2=
 2\left|\sum_{n=1}^N{d_n\over a_n}\right|^2
 +\sum_{n=1}^N{|d_n|^2\over a_n^2}.}               \tag{2.9}
\]

Use the locked transform

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(x)e^{-itx}\,dx.   \tag{2.10}
\]

Integration by parts and (2.8) have no boundary term:

\[
 \boxed{\widehat g(t)=it\widehat{Pg}(t),
 \qquad \widehat{Pg}(t)={\widehat g(t)\over it}.}   \tag{2.11}
\]

The value at zero is interpreted continuously.  Every nontrivial critical
ordinate is nonzero, so no division by a zero ordinate enters below.

## 3. The exact odd-ground primitive criterion

Assume RH.  Write the distinct positive ordinates as `gamma` and their
algebraic multiplicities as `m_gamma`.  Reflected ordinates give the same
absolute squares, so for real parity states

\[
 \langle f,Q_+f\rangle
 =2\sum_{\gamma>0}m_\gamma|\widehat f(\gamma)|^2,
 \qquad
 \langle g,Q_-g\rangle
 =2\sum_{\gamma>0}m_\gamma|\widehat g(\gamma)|^2.   \tag{3.1}
\]

Let `g_-` be any nonzero odd ground vector.  Thus

\[
 \lambda_-={2\sum_{\gamma>0}m_\gamma
                  |\widehat g_-(\gamma)|^2
             \over\|g_-\|_2^2}.                    \tag{3.2}
\]

If `lambda_-=0`, strict even-below-odd parity is impossible because both
Gram blocks are positive semidefinite.  Hence the only branch relevant to
(0.4) has `lambda_->0`; on that branch the denominator in (0.3) is
strictly positive.

Equations (2.11) and (3.1) give

\[
 R_+(Pg_-)
 ={2\sum_{\gamma>0}m_\gamma
              |\widehat g_-(\gamma)|^2/\gamma^2
   \over\|Pg_-\|_2^2}.                              \tag{3.3}
\]

The primitive of a nonzero odd vector is nonzero.  On the positive odd
branch just identified, cross multiplication proves the exact equivalence

\[
 \boxed{
 R_+(Pg_-)<\lambda_-
 \quad\Longleftrightarrow\quad
 {\sum m_\gamma|\widehat g_-(\gamma)|^2/\gamma^2
  \over
  \sum m_\gamma|\widehat g_-(\gamma)|^2}
 <{\|Pg_-\|_2^2\over\|g_-\|_2^2}.}                 \tag{3.4}
\]

Since `Pg_-` is an admissible even trial, the left side of (3.4) implies

\[
 \lambda_+\leq R_+(Pg_-)<\lambda_-.                \tag{3.5}
\]

Equation (3.4) is an iff for this primitive comparison.  It is deliberately
not called a necessary condition for `lambda_+<lambda_-`: the full even
space contains one direction more than the endpoint-zero primitive image.

There is a useful exact low/high version.  Normalize `g_-` to unit norm,
put

\[
 A=\sum_{\gamma>0}m_\gamma
          |\widehat g_-(\gamma)|^2,
 \qquad \Omega={2\pi N\over L},                    \tag{3.6}
\]

and separate the ordinates at `Omega`.  Then (3.4) is equivalent to

\[
\begin{aligned}
 &\sum_{0<\gamma<\Omega}m_\gamma
 |\widehat g_-(\gamma)|^2
 \left({\Omega^2\over\gamma^2}-1\right)\\
 &\quad< A\{\Omega^2\|Pg_-\|_2^2-1\}
 +\sum_{\gamma>\Omega}m_\gamma
 |\widehat g_-(\gamma)|^2
 \left(1-{\Omega^2\over\gamma^2}\right).
\end{aligned}
                                                               \tag{3.7}
\]

The first term is the dangerous low-row inverse moment.  The two terms on
the right are the physical inverse-frequency reserve and the helpful high
zero tail.  Formula (3.7) makes clear why an unweighted zero count does not
orient the comparison.

## 4. Strict parity forces simplicity and boundary nonvanishing

This section uses the actual source matrix, not merely the evaluation-Gram
representation.  Let `M V_n=nV_n`, let inversion be `J V_n=V_(-n)`, and
retain

\[
 [M,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|,
 \qquad J\eta=\eta,\qquad J\beta=-\beta.            \tag{4.1}
\]

Assume (3.5), put `mu=lambda_+`, and set

\[
 T=Q-\mu I.                                         \tag{4.2}
\]

Then `T` is positive semidefinite and its kernel is contained in the even
sector because `Q_- - mu I` is strictly positive.

Suppose the even ground eigenspace had dimension at least two.  It would
contain a nonzero real vector `xi` with

\[
 T\xi=0,\qquad J\xi=\xi,
 \qquad\langle\eta,\xi\rangle=0.                   \tag{4.3}
\]

Parity also gives `<beta,xi>=0`.  Applying (4.1) to `xi` yields

\[
 -TM\xi=[M,T]\xi=0.                                \tag{4.4}
\]

The vector `M xi` is odd.  Strict positivity of the odd block of `T` forces
`M xi=0`, hence `xi` is a multiple of `V_0`.  But
`<eta,V_0>=1`, contradicting (4.3).  Thus

\[
 \boxed{\lambda_+<\lambda_-
 \quad\Longrightarrow\quad
 \text{the global ground is simple and inversion even}.}     \tag{4.5}
\]

For completeness, let `xi` now be this simple even ground.  If `M xi=0`,
then `xi` is a nonzero multiple of `V_0` and `<eta,xi>` is nonzero.  If
`M xi` is nonzero, strict odd positivity gives `TM xi` nonzero, while

\[
 -TM\xi=[M,T]\xi
 =\beta\langle\eta,\xi\rangle.                     \tag{4.6}
\]

Therefore `<eta,xi>` is again nonzero.  This recovers the exact source
boundary nonvanishing with no quantitative lower bound claimed.

## 5. Exact polynomial and Christoffel formulation

Put

\[
 x_n=a_n^2,qquad
 D_N(y)=\prod_{n=1}^N(y-x_n).                       \tag{5.1}
\]

For an even state

\[
 f=c_0e_0^++\sum_{n=1}^Nc_ne_n^+                  \tag{5.2}
\]

the exact transform is

\[
 \widehat f(t)={2\sin(Lt/2)\over\sqrt L\,t}
 \left(c_0+\sqrt2\sum_{n=1}^Nc_n{t^2\over t^2-x_n}\right).
                                                               \tag{5.3}
\]

Write the rational expression in parentheses as

\[
 {p(y)\over D_N(y)},\qquad \deg p\leq N.            \tag{5.4}
\]

Evaluation at zero and residues at the carrier poles give

\[
 c_0={p(0)\over D_N(0)},
 \qquad
 c_n={p(x_n)\over\sqrt2x_nD_N'(x_n)}.              \tag{5.5}
\]

Define the positive carrier functional

\[
 \boxed{
 \sigma_e(p^2)=
 {p(0)^2\over D_N(0)^2}
 +\sum_{n=1}^N{p(x_n)^2\over
       2x_n^2D_N'(x_n)^2}}                          \tag{5.6}
\]

and, under RH, the actual zero functional

\[
 \boxed{
 \nu_e(p^2)={8\over L}\sum_{\gamma>0}
 {m_\gamma\sin^2(L\gamma/2)\,p(\gamma^2)^2
  \over\gamma^2D_N(\gamma^2)^2}.}                 \tag{5.7}
\]

Carrier collisions in (5.7) are continuous limits of (5.3), not deleted
rows.  Equations (3.1) and (5.3)--(5.7) prove

\[
 \lambda_+=\min_{0\ne p\in\mathcal P_N}
                 {\nu_e(p^2)\over\sigma_e(p^2)}.   \tag{5.8}
\]

For an odd state, after removing its fixed unimodular factor, write

\[
 \sum_{n=1}^Nd_n{a_n\over y-x_n}
 ={p(y)\over D_N(y)},\qquad\deg p\leq N-1.          \tag{5.9}
\]

Residues give

\[
 \|g\|_2^2=\sum_{n=1}^N
 {p(x_n)^2\over x_nD_N'(x_n)^2}.                   \tag{5.10}
\]

The odd transform and (5.7) show that its two functionals are exactly the
Christoffel transforms

\[
 \boxed{d\sigma_o=2y\,d\sigma_e,
 \qquad d\nu_o=2y\,d\nu_e.}                       \tag{5.11}
\]

The atom of `sigma_e` at zero is killed by multiplication by `y`.
Therefore

\[
 \boxed{
 \lambda_-=\min_{0\ne p\in\mathcal P_{N-1}}
 {\nu_e(yp^2)\over\sigma_e(yp^2)}.}                \tag{5.12}
\]

The primitive of the odd polynomial `p` has even polynomial `-sqrt(2)p`.
The harmless common factor cancels, and its comparison with the same odd
state is

\[
 {\nu_e(p^2)\over\sigma_e(p^2)}
 <{\nu_e(yp^2)\over\sigma_e(yp^2)}.                \tag{5.13}
\]

Taking `p=p_-` in (5.13) proves the equivalence of (0.3) and (0.5).  After
cross multiplication, (0.5) also says

\[
 {\nu_e(yp_-^2)\over\nu_e(p_-^2)}
 >{\sigma_e(yp_-^2)\over\sigma_e(p_-^2)}.          \tag{5.14}
\]

Thus it is an ordinary mean comparison, although it arose as a comparison
of inverse-frequency moments in (0.3).

Both matrices in each generalized moment pencil are positive Hankel
matrices in the monomial basis.  Their separate total positivity does not
order the two quotients in (5.13).  Such an order would require additional
information comparing the actual zero and carrier measures after weighting
by the unknown extremal polynomial.

## 6. Why the available actual inputs do not orient the mean

Let `gamma_1` be the least positive ordinate.  Zero support alone gives

\[
 {\sum m_\gamma|\widehat g(\gamma)|^2/\gamma^2
  \over\sum m_\gamma|\widehat g(\gamma)|^2}
 \leq\gamma_1^{-2}.                                 \tag{6.1}
\]

On the other hand, (2.9) only gives the universal bound

\[
 {\|Pg\|_2^2\over\|g\|_2^2}\geq\Omega^{-2}.       \tag{6.2}
\]

On the adaptive schedule `Omega` is of order `e^(L/2)L^2`, so
`Omega^(-2)` is vastly smaller than the fixed number `gamma_1^(-2)`.
Equations (6.1)--(6.2) point in the wrong direction and do not prove
(0.3).

The HSW theorem counts ordinates with multiplicity.  It does not control
the ground-dependent weights

\[
 m_\gamma|\widehat g_-(\gamma)|^2
 ={C_Lm_\gamma\sin^2(L\gamma/2)
       p_-(\gamma^2)^2\over D_N(\gamma^2)^2}        \tag{6.3}
\]

for the appropriate positive constant `C_L`.  In particular, the frozen
carrier-lattice construction satisfies the HSW envelope while making the
odd Gram singular on infinitely many lengths.  It is a count-only logical
model, not the zeta divisor.

The adaptive Stokes theorem proves a large endpoint/row quotient and
`eta_N^pr -> 0` for one projected-prolate vector at one selected cutoff.
It supplies no comparison between that vector and `g_-`, no estimate for
the polynomial `p_-`, and no bound for either ground-weighted side of
(5.14).  Promoting its Rayleigh information to (0.5) would be exactly the
unproved one-vector-to-global-floor step.

## 7. Exact integer-multiplicity real-evaluation countermodel

This section proves that no structural Gram or total-positivity argument
can replace the missing actual statistic.  Take

\[
 L=2\pi,\qquad N=2,                                 \tag{7.1}
\]

and the symmetric real multiset

\[
 \Gamma=\{(1/2)^{[1]},(-1/2)^{[1]},
 (3/2)^{[2]},(-3/2)^{[2]},
 (9/2)^{[18]},(-9/2)^{[18]}\}.                     \tag{7.2}
\]

For the aligned raw modes

\[
 \phi_n(x)={(-1)^n\over\sqrt{2\pi}}e^{inx},
 \qquad -2\leq n\leq2,                             \tag{7.3}
\]

one has

\[
 \widehat\phi_n(t)={2\sin(\pi t)\over
                  \sqrt{2\pi}(t-n)}.               \tag{7.4}
\]

Let `Q` be the exact evaluation Gram obtained by summing the outer products
of (7.4) over (7.2).  Every multiplicity is a positive integer.  Reflected
rows make `Q` real and inversion symmetric.  Moreover, the elementary
partial-fraction identity for each reflected pair gives the exact
source-Cauchy form

\[
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad b_n=nQ_{n0},\qquad b_{-n}=-b_n.             \tag{7.5}
\]

In the normalized parity bases, direct rational arithmetic gives the
scaled blocks

\[
 \boxed{
 \pi Q_+=E=
 \begin{pmatrix}
 {208\over9}&{5552\sqrt2\over1155}&-{1648\sqrt2\over1365}\\
 {5552\sqrt2\over1155}&{45976736\over1334025}&-{289376\over45045}\\
 -{1648\sqrt2\over1365}&-{289376\over45045}&{42742688\over1863225}
 \end{pmatrix}}                                     \tag{7.6}
\]

and

\[
 \boxed{
 \pi Q_-=O=
 \begin{pmatrix}
 {33151616\over1334025}&-{361216\over45045}\\
 -{361216\over45045}&{47241728\over1863225}
 \end{pmatrix}.}                                    \tag{7.7}
\]

The leading principal minors of `E-18I` are

\[
 {46\over9},\qquad
 {65073212\over1715175},\qquad
 {4287698202712\over55235305125},                   \tag{7.8}
\]

all strictly positive.  Hence

\[
 E\succ18I.                                         \tag{7.9}
\]

The odd block satisfies

\[
 \det O={156256144719872\over276176525625}>0,       \tag{7.10}
\]

while

\[
 \det(O-18I)
 =-{3843792811228\over276176525625}<0.              \tag{7.11}
\]

Its first diagonal entry is positive, so `O` is positive definite; (7.11)
shows that its two eigenvalues straddle `18`.  Therefore

\[
 \boxed{0<\lambda_{\min}(O)<18<\lambda_{\min}(E).} \tag{7.12}
\]

The full real evaluation Gram is positive definite and has a simple odd
global ground.  Since the construction is itself a positive rational
moment Gram, it also proves that separate moment/Hankel total positivity
does not orient (5.14).  The failure comes from comparing two measures
whose supports cross carrier poles, not from a loss of positivity.

## 8. Stopping point

A cofinal proof of

\[
 \Delta_N>0                                         \tag{8.1}
\]

for the actual odd minimizing polynomial would close the parity part of
the first finite gate and, by Section 4, would also close simplicity and
boundary nonvanishing.  It is strictly weaker than an all-vector odd frame:
only one ground-weighted mean must be oriented.

The available actual inputs do not control that mean.  The next useful
number-theoretic statement must couple carrier-scale zero locations to the
extremal rational polynomial `p_-`, or equivalently control the low-row
term in (3.7) relative to its physical and high-row reserves.  A theorem
about an unrelated projected-prolate vector, an unweighted count, or
separate positivity of the two moment matrices cannot supply this coupling.
