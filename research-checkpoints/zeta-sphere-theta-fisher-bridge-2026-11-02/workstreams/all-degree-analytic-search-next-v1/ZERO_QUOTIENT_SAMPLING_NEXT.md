# Quotient sampling: an exponential core--exterior obstruction

## Scope and outcome

`ZERO_INTEGRATED_COMPENSATION_NEXT.md` reduces the negative contribution of
hypothetical off-line zero quartets to the residual-weighted sampling form

\[
 \sum_jm_jN_\pi(a_j,b_j)\leq A_\pi(T),             \tag{1}
\]

where `T=H-1/2` is inside a rigorously verified zero band.  The hoped-for
all-degree continuation was a theta-weighted sampling or contraction theorem.

This note proves a sharp limitation on that continuation.  If even one
off-line quartet lies beyond the verified band, then the norm of its exact
sampling form relative to the positive verified-core form grows at least
exponentially on both parity polynomial ladders.  Consequently:

1. no degree-independent Carleson contraction can hold on every polynomial
   in the old-plus-new quotient class;
2. the all-polynomial version of (1) is equivalent to the absence of off-line
   quartets, not an easier route to it;
3. the disk-maximum sufficient condition has the same obstruction; and
4. a viable estimate must be genuinely directional: it must prove that the
   *actual mismatch-corrected Galerkin residual* avoids the exponentially bad
   core-to-exterior singular direction.

The proof uses the exact quotient with its removable values and the exact
local integral.  It does not use the conditional `b^3` asymptotic and hence
does not assume scaled equicontinuity.  It does not assert that an off-line
quartet exists, that an actual Galerkin residual follows the bad direction,
or that RH is proved or disproved.

## Exact core and sampling forms

Keep the notation of `ZERO_INTEGRATED_COMPENSATION_NEXT.md`.  Thus

\[
 F=2\Xi,\qquad
 H_{a,b}(z)=\frac{F(z)}{(z-a)^2+b^2},              \tag{2}
\]

where the division is an exact entire factorization through the hypothetical
zeros `a+ib` and `a-ib`.  Values at those zeros are removable.  On the real
axis define

\[
 d\mu_T(x)=\frac14\mathbf 1_{[-T,T]}(x)
       \mathcal L[F](x)\,dx,                      \tag{3}
\]

and, for one quartet,

\[
 d\nu_{a,b}(x)=
 \mathbf 1_{|x-a|<b}|H_{a,b}(x)|^2
       \{b^2-(x-a)^2\}\,dx.                       \tag{4}
\]

The verified-core hypothesis makes `mu_T` a finite nonnegative measure.  It
is nonzero because `mathcal L[F]` is strictly positive on a neighborhood of
the origin.  The exact quantities are

\[
 A_\pi(T)=\int |\pi(ix)|^2d\mu_T(x),
 \qquad
 N_\pi(a,b)=\int |\pi(ix)|^2d\nu_{a,b}(x).        \tag{5}
\]

There is no division on the real line in (4): `H_(a,b)` is entire.  It is not
identically zero, so its real zeros are isolated.  Hence every nonempty open
subinterval of `(a-b,a+b)` contains a compact subinterval `J` on which
`|H_(a,b)|` is bounded below by a positive constant.  Since the remaining
factor in (4) is strictly positive in the interior,

\[
 \nu_{a,b}(J)>0.                                   \tag{6}
\]

If all zeros have been verified through height `H`, then a hypothetical
quartet has `a>H` and `0<b<1/2`.  With `T=H-1/2`,

\[
 a-b>T.                                           \tag{7}
\]

Thus its whole negative sampling interval lies strictly outside the positive
core interval.

For a real polynomial of fixed parity, `pi(ix)` differs by a constant phase
from a real polynomial on the real `x` axis.  Both forms in (5) are therefore
ordinary nonnegative polynomial `L2` forms, with no complex-domain issue.

## Exponential obstruction theorem

**Theorem.**  Fix `T>0` and one hypothetical quartet `(a,b)` satisfying
(7).  For either parity `epsilon in {0,1}`, let `P_N^epsilon` be the real
polynomials of parity `epsilon` and degree at most `N`, where
`N` is congruent to `epsilon` modulo two.  Then

\[
 \sup_{0\ne\pi\in P_N^\epsilon}
 \frac{N_\pi(a,b)}{A_\pi(T)}
 \longrightarrow\infty                            \tag{8}
\]

at least exponentially along that parity.  More precisely, for every compact
interval `J subset (a-b,a+b)` on which (6) holds, put

\[
 r_J:=\frac{\inf_{x\in J}x}{T}>1,
 \qquad M_T:=\mu_T([-T,T])>0.                     \tag{9}
\]

Then for `N` of either chosen parity,

\[
 \boxed{
 \sup_{0\ne\pi\in P_N^\epsilon}
 \frac{N_\pi(a,b)}{A_\pi(T)}
 \geq \frac{\nu_{a,b}(J)}{M_T}\,r_J^{2N}.}       \tag{10}
\]

**Proof.**  Take the real polynomial

\[
 \pi_N(z)=\left(\frac zT\right)^N.                \tag{11}
\]

It has the prescribed parity and
`|pi_N(ix)|^2=(|x|/T)^(2N)`.  On the core, this weight is at most one, so

\[
 A_{\pi_N}(T)\leq M_T.                            \tag{12}
\]

On `J`, all `x` are positive by (7), and the same weight is at least
`r_J^(2N)`.  Hence

\[
 N_{\pi_N}(a,b)
 \geq \nu_{a,b}(J)r_J^{2N}.                       \tag{13}
\]

Equations (12)--(13) prove (10).  Multiplying (11) by `T^N` gives the monic
representative `z^N`; homogeneity leaves the ratio unchanged.  Therefore the
witness also lies in the full monic degree-`N` quotient class. \(\square\)

The proof is insensitive to the quartet multiplicity.  A multiplicity
`m>=1` simply multiplies the lower bound by `m`.  Other quartets add
nonnegative sampling terms and cannot repair the failure.

## Sharp Christoffel interpretation

The theorem can be stated without selecting the monomial witness.  On the
finite-dimensional core Hilbert space `P_N^epsilon`, let

\[
 \|p\|_{\mu_T}^2=\int p(x)^2d\mu_T(x),            \tag{14}
\]

and let `K_(N,T)^epsilon(x,y)` be its reproducing kernel.  The sharp core
evaluation bound is

\[
 |p(x)|^2\leq K_{N,T}^\epsilon(x,x)
                 \|p\|_{\mu_T}^2,                \tag{15}
\]

with equality for the normalized kernel section.  The monomial proof gives
the explicit lower bound

\[
 K_{N,T}^\epsilon(x,x)
 \geq \frac1{M_T}\left(\frac{|x|}{T}\right)^{2N}
 \qquad(|x|>T).                                   \tag{16}
\]

Thus exterior point evaluation is an exponentially expanding, not
contractive, map from the verified core polynomial space.  The exact
generalized eigenvalue problem for the pair `(nu_(a,b),mu_T)` may improve the
monomial lower bound (10), but no improvement is needed for the exponential
obstruction.  This is the precise Christoffel obstruction hidden by a
coefficientwise estimate such as `(1+T)^(2d)`.

The result does **not** say that every monic polynomial has a large quotient
sample.  A specially aligned monic polynomial can be small on the exterior
interval.  It says that the full quotient class contains exponentially bad
directions and hence that a uniform operator comparison cannot be the missing
lemma.

## Equivalence of the all-polynomial sampling scheme

Let the sum in (1) range over all distinct hypothetical off-line quartets,
each with its multiplicity.  Consider the strong statement

\[
 \sum_jm_jN_\pi(a_j,b_j)\leq A_\pi(T)
 \quad\hbox{for every real polynomial }\pi.       \tag{17}
\]

If there are no off-line quartets, its left side is zero and (17) holds.  If
one quartet exists, (10) supplies a polynomial of sufficiently high degree for
which its single contribution already exceeds the right side.  Therefore

\[
 \boxed{
 \text{(17) holds for all real polynomials}
 \quad\Longleftrightarrow\quad
 \text{there are no off-line quartets}.}          \tag{18}
\]

For the completed Riemann Xi function, the right side of (18) is the
all-real-zero assertion.  Equation (18) is a route-classification theorem,
not a proof of that assertion: a degree-uniform all-polynomial sampling
contraction would already contain the global zero conclusion it was meant to
derive.

There is no conflict with the fact that the first Laguerre inequality alone
is not an RH equivalence.  Condition (17) is strictly stronger: it discards
the positive exterior and quartet-deleted background compensation before
testing every polynomial.  The exponential obstruction concerns that strong
core-only sampling scheme, not every possible proof of the Laguerre sign.

The same argument applies to the disk-maximum sufficient condition.  Its
single-quartet term is

\[
 \frac{64}{3}m b^3M_F(a,1)^2
 \max_{|x-a|\leq b}|\pi(ix)|^2.                   \tag{19}
\]

Here `M_F(a,1)>0`.  For the monomial (11), the maximum in (19) is at least
`(a/T)^(2N)`, while (12) bounds the core.  Thus the disk-maximum criterion
also fails exponentially as a degree-uniform statement whenever a quartet is
present.  Improving the disk constant cannot remove this support-separation
obstruction.

## Why the conditional `b^3` asymptotic does not change the theorem

For a family with `b -> 0`, the earlier note obtains

\[
 N_\pi(a,b)=\frac43b^3
 |H_{a,b}(a)\pi(ia)|^2+o(b^3)                     \tag{20}
\]

only under scaled equicontinuity of
`|H_(a,b)(a+bu)pi(i(a+bu))|^2` on `|u|<=1`.
Theorem (10) instead uses the exact measure (4) for one fixed quartet and a
compact interval `J`; no limiting interchange or equicontinuity is invoked.

If (20) is available for a particular family, it displays the same
exterior-evaluation norm from (15)--(16), now multiplied by `b^3` and the
family-dependent removable quotient `H_(a,b)(a)`.  Neither `b^3` nor zero
multiplicity changes the exponential degree dependence.  Uniformity in a
simultaneous `b -> 0`, `N -> infinity` limit would require new quantitative
control of both `H_(a,b)` and the scaled equicontinuity modulus; none is
assumed here.

## What remains for the actual Galerkin residual

Assume the current same-parity signed prefix is positive, and let `pi_N` now
denote the actual mismatch-corrected residual at the next rung.  It is the
unique monic polynomial satisfying the signed Galerkin relations

\[
 \mathfrak q(q,\pi_N)=0
 \qquad(q\in P_{N-2}^\epsilon).                   \tag{21}
\]

The relations (21) use the full signed Xi--Laguerre density.  They neither
bound exterior evaluation in the positive core norm nor imply that `pi_N`
resembles the bad monomial (11).  Conversely, the exponential operator norm
in (10) does not prove that the one vector `pi_N` has a large sample.

This separates two targets that had previously been conflated:

1. A contraction on the whole old-plus-new quotient class is impossible in
   the presence of a quartet and, by (18), already encodes the all-real-zero
   conclusion.
2. A directional inequality

   \[
    \sum_jm_jN_{\pi_N}(a_j,b_j)\leq A_{\pi_N}(T) \tag{22}
   \]

   could still exploit the exact theta Galerkin coefficients.  It must prove
   that `pi_N/sqrt(A_(pi_N)(T))` has uniformly small projection onto the
   high-gain exterior sampling directions, despite their exponentially growing
   operator norm.

This required alignment can be quantified in the real core-polynomial
coordinates used above.  Since `pi_N` has parity `N` modulo two, put

\[
 \widetilde\pi_N(x):=i^{-N}\pi_N(ix)\in\mathbb R[x],
 \qquad
 u_N:=\frac{\widetilde\pi_N}
 {\sqrt{A_{\pi_N}(T)}}.
\]

Then `u_N` has unit core norm.  Let `S_N` be the positive sampling operator
on that real core Hilbert space, defined for one quartet by

\[
 \langle p,S_Nq\rangle_{\mu_T}
 =\int p(x)q(x)d\nu_{a,b}(x),                     \tag{23}
\]

and let `lambda_N` and `e_N` be a top eigenvalue and a corresponding core-unit
eigenvector.  Theorem (10) gives

\[
 \lambda_N\geq
 \frac{\nu_{a,b}(J)}{M_T}r_J^{2N}.                \tag{24}
\]

If the actual residual satisfies its directional sampling inequality,
positivity of `S_N` forces

\[
 |\langle u_N,e_N\rangle_{\mu_T}|
 \leq\lambda_N^{-1/2}
 \leq\left(\frac{M_T}{\nu_{a,b}(J)}\right)^{1/2}
       r_J^{-N}.                                   \tag{25}
\]

The full signed Galerkin equations (21) do not state this alignment.

In reproducing-kernel language, the missing information is an alignment
estimate for the actual residual, not a smaller universal Christoffel
constant.  A candidate proof must couple (21) to the complete-theta source,
the regression mismatch, and the positive exterior/background terms discarded
by (1).  Core polynomial norm bounds, coefficient envelopes, zero counts, or
disk maxima alone cannot provide that alignment.

For one quartet, the exact condition

\[
 C_{\pi_N}^{\rm bg}(a,b)+E_{\pi_N}(a,b)
 \geq N_{\pi_N}(a,b)                              \tag{26}
\]

remains strictly more promising than (22), because its two left-hand terms
retain precisely the global compensation discarded by the core-only sampling
scheme.  Proving (26) from the assembled theta/Galerkin source would be a
combined-vector result rather than a universal evaluation bound.

## Nonclaims

- No off-line quartet is asserted to exist.
- The monomial witness is not asserted to be an actual Galerkin residual.
- Failure of a whole-space sampling contraction does not imply failure of
  the residual-specific inequality (22) or of the exact compensation (26).
- Equation (18) classifies a proposed strong lemma; it is not an RH proof.
- No finite zero verification is promoted to an all-degree statement.
- No unsigned zero-series interchange is used.  Multiplicities and removable
  quotient values are retained exactly.
- The conditional `b^3` asymptotic is not used without its scaled
  equicontinuity hypothesis.
