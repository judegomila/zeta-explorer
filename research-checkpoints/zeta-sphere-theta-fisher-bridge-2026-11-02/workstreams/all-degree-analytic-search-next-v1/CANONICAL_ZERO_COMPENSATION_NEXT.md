# Canonical-zero compensation: the local crowding obstruction

## Scope and result

This note continues the canonical-product route in `TURAN_PD_ROUTE_NEXT.md`.
It asks only whether the following standard information can force

\[
 -\{\log \Xi\}''(x)\geq 0\qquad (x\in\mathbb R, \Xi(x)\ne0):       \tag{1}
\]

the critical strip, the functional equation, a finite verified-zero band,
classical zero-free regions, zero-density upper bounds, and global zero
counting.  The answer is **no at this level of information**.  A hypothetical
off-line quartet creates a negative term of scale `b^{-2}`, while its
functional-equation mirror contributes only `O(a^{-2})`.  The remaining
standard inputs do not force positive zeros to crowd the quartet at the
transverse scale `b`.

The useful output is a rigorous local necessary condition, the
**reciprocal-square crowding condition** below.  A simple canonical-product
countermodel then shows that the listed geometric and counting facts do not imply that
condition.  This is an information-separation result, not a counterexample
for the Riemann Xi function: the countermodel does not preserve Xi's complete
theta representation, gamma factor, Dirichlet series, or Euler product.

Nothing here claims that finitely many verified zeros prove a global sign or
prove RH.  The target (1) is the first Laguerre inequality identified with
Csordas' Open Problem 4.7 in `LITERATURE_ALIGNMENT_NEXT.md`; in general that
first inequality is not equivalent to having only real zeros.

## Exact contribution of an off-line quartet

Write `F=2Xi`.  In the spectral variable used in this workstream, an
off-line zeta zero produces a quartet

\[
 a+ib,\quad a-ib,\quad -a+ib,\quad -a-ib,
 \qquad a>0,\quad 0<b<\tfrac12.                                  \tag{2}
\]

Indeed, `z=a+ib` corresponds under `s=1/2+iz` to a zeta zero with real
part `1/2-b`; the other signs give conjugation and the functional equation.
Away from real zeros, the grouped canonical product gives

\[
 S_F(x):=-\{\log F\}''(x)=\sum_{\zeta}\frac1{(x-\zeta)^2},          \tag{3}
\]

with symmetric grouping.  The quadratic exponential is absent for Xi.  The
quartet (2) contributes

\[
 Q_{a,b}(x)
 =\frac{2\{(x-a)^2-b^2\}}{\{(x-a)^2+b^2\}^2}
  +\frac{2\{(x+a)^2-b^2\}}{\{(x+a)^2+b^2\}^2}.                    \tag{4}
\]

At the center of the obstruction interval,

\[
 Q_{a,b}(a)
 =-\frac2{b^2}
  +\frac{2(4a^2-b^2)}{(4a^2+b^2)^2}.                              \tag{5}
\]

The second term is the entire compensation supplied by the reflected pair
at `-a`.  For every `a,b>0`,

\[
 \frac{2(4a^2-b^2)}{(4a^2+b^2)^2}
 \leq \frac1{2a^2},                                                \tag{6}
\]

because, after multiplying by positive denominators, (6) is equivalent to
`0 <= 12a^2b^2+b^4`.  Thus functional-equation symmetry by itself leaves

\[
 Q_{a,b}(a)\leq -\frac2{b^2}+\frac1{2a^2}.                         \tag{7}
\]

For a zero above the verified height, `a` is enormous and the mirror term is
negligible even on an absolute scale.  More importantly, no strip theorem
prevents `b` from being arbitrarily small.

## Transferable lemma: reciprocal-square crowding is necessary

The following statement applies to any real even order-one entire function
whose zero sum in (3) is symmetrically grouped.

**Lemma (local crowding obstruction).**  Assume (2) is a simple quartet and
that `a` is not another zero.  Remove all four members of (2) from the zero
multiset and put

\[
 M_{a,b}:=\sum_{\zeta\notin\{\pm a\pm ib\}}
                 \frac1{|a-\zeta|^2}.                              \tag{8}
\]

For an order-one zero set this sum is finite at a nonzero point which is not
a remaining zero.  If

\[
 M_{a,b}+\frac1{2a^2}<\frac2{b^2},                                 \tag{9}
\]

then `S_F(a)<0`.  Consequently, nonnegativity of `S_F` on the real line
requires, for every hypothetical quartet,

\[
 \boxed{M_{a,b}+\frac1{2a^2}\geq\frac2{b^2}.}                      \tag{10}
\]

**Proof.**  Let `B_{a,b}` be the grouped contribution at `x=a` of every zero
outside the quartet.  The triangle inequality gives `B_{a,b} <= M_{a,b}`.
Equations (5)--(6) therefore give

\[
 S_F(a)
 =B_{a,b}-\frac2{b^2}
  +\frac{2(4a^2-b^2)}{(4a^2+b^2)^2}
 \leq M_{a,b}-\frac2{b^2}+\frac1{2a^2},                            \tag{11}
\]

which proves the claim.  For a quartet of multiplicity `m`, the two quartet
terms in (5) are multiplied by `m`, making the same obstruction stronger.

Condition (10) is deliberately only necessary.  The actual useful target is
the sharper signed inequality

\[
 B_{a,b}
 +\frac{2(4a^2-b^2)}{(4a^2+b^2)^2}
 \geq \frac2{b^2}.                                                  \tag{12}
\]

It says that an off-line zero must be correlated with the rest of the zero
set at its own transverse distance from the critical line.  For example, a
nearby real zero can contribute at scale `b^{-2}` only if its ordinate is
within `O(b)` of `a`.  A count in a fixed-height or fixed-width interval is
not a substitute for this scale-sensitive statement.

## Why the standard zero information does not imply (10)

### Critical-strip geometry

The critical strip gives `0<b<1/2` in (2).  It gives an upper bound on the
off-line displacement, whereas (10) needs either a positive lower bound on
`b` or compensating zeros within distance comparable to `b`.  The strip
supplies neither.

### Functional equation

The functional equation produces the mirror pair, but (6) bounds its entire
center contribution by `1/(2a^2)`.  It does not produce a real zero near
`a`, nor another positive contribution of order `b^{-2}`.

### Verified-zero height

Platt and Trudgian rigorously verify that every zeta zero through height

\[
 H=3\cdot10^{12}
\]

lies on the critical line.  Combined with the finite-band theorem already
recorded in `TURAN_PD_ROUTE_NEXT.md`, this proves the Laguerre sign on a very
large but bounded real interval.  It excludes (2) for `a<=H`, but gives no
constraint on `b` or on local crowding for a quartet with `a>H`.  An
all-degree polynomial multiplier is not band-limited, so this finite result
cannot remove a negative open interval beyond the verified band.

### Zero-free regions near `Re(s)=1`

Mossinghoff--Trudgian--Yang prove, among other explicit results, that
`zeta(s)` has no zero in

\[
 \sigma\geq 1-\frac1{5.558691\log |t|}\qquad(|t|\geq2).             \tag{13}
\]

For the member of (2) on the right of the critical line,
`sigma=1/2+b`.  Thus (13) only forces

\[
 b<\frac12-\frac1{5.558691\log a}.                                 \tag{14}
\]

This again bounds `b` from above.  Every sufficiently small `b`, precisely
the regime in which `2/b^2` is hardest to compensate, lies far inside the
allowed region.

### Zero-density bounds

The standard quantity `N(sigma,T)` counts zeros with real part exceeding
`sigma>1/2` up to height `T`.  Simonic's explicit form of Selberg's estimate
is an **upper count** of the shape

\[
 N(\sigma,T)\ll
 T^{1-\frac14(\sigma-1/2)}\log T.                                  \tag{15}
\]

Such a result does not give a lower bound for the number of real zeros in
an interval of radius `b` around a specified hypothetical off-line zero.
For any fixed threshold `sigma>1/2`, a quartet with
`b<sigma-1/2` is not counted at all.  If the threshold is moved below
`1/2+b`, one extra high quartet changes the count by only `O(1)`, well within
the asymptotic upper bound.  No reciprocal-square reserve such as (10)
follows.

### Global zero counting

The Riemann--von Mangoldt formula controls the cumulative count by a main
term with an `O(log T)` error.  Adding one quartet changes that cumulative
count by only `O(1)`.  More conceptually, global average spacing near height
`a` is of order `1/log a`, while (10) must work even for

\[
 b=o(1/\log a).                                                      \tag{16}
\]

A regularly spaced real-zero background then has reciprocal-square scale
only `O((log a)^2)`, whereas the quartet dip has scale `b^{-2}`, which is
arbitrarily larger under (16).  This average-spacing comparison is only
intuition, not an assertion that the actual zeta zeros are regularly spaced.
The countermodel below uses the weaker sufficient fact that its background
sum is finite at a fixed point while `b^{-2}` is unbounded.

## A geometry-only countermodel

The following construction makes the information gap explicit.

Choose a symmetric real sequence `±gamma_n` such that

\[
 N_0(T)=\#\{n:0<\gamma_n\leq T\}
\]

has the Riemann--von Mangoldt main term up to `O(log T)`.  If desired, its
initial segment through `H` can be chosen to equal the rigorously verified
critical-line ordinates; above `H`, choose the ordinates by inverting the
monotone main counting function.  Then

\[
 \sum_n\gamma_n^{-2}<\infty,
 \qquad
 F_0(z):=\prod_{n\geq1}\left(1-\frac{z^2}{\gamma_n^2}\right)       \tag{17}
\]

defines a real even entire canonical product of order one, with only real
zeros and with the requested global counting behavior.

Choose `a>H+1` which is not one of the `gamma_n`.  Its background curvature

\[
 B_0(a)=\sum_n\left{
             \frac1{(a-\gamma_n)^2}
            +\frac1{(a+\gamma_n)^2}\right}                        \tag{18}
\]

is finite.  Now introduce a single symmetric quartet with the even real
polynomial

\[
 P_{a,b}(z)=\{(z-a)^2+b^2\}\{(z+a)^2+b^2\},                        \tag{19}
\]

and set `F_b=F_0P_{a,b}`.  Choose `b>0` so small that

\[
 b<\frac14,
 \qquad
 \frac2{b^2}>B_0(a)+\frac1{2a^2}.                                 \tag{20}
\]

Then, exactly (not asymptotically),

\[
 -\{\log F_b\}''(a)
 =B_0(a)-\frac2{b^2}
  +\frac{2(4a^2-b^2)}{(4a^2+b^2)^2}<0.                             \tag{21}
\]

At the same time:

1. `F_b` remains real, even, and of order one.
2. Its nonreal zeros occur in exactly the functional-equation quartet (2)
   and remain inside the critical strip.
3. It has no off-line zero below the chosen verified height `H`.
4. For sufficiently large `a`, its rightmost zero
   `sigma=1/2+b<3/4` lies well outside the zero-free region (13), so it does
   not violate that theorem's geometric exclusion.
5. Its zero count differs from that of `F_0` by only a constant.  A single
   quartet at sufficiently large height also satisfies standard asymptotic
   zero-density upper bounds: for `sigma>=1/2+b` it is not counted, and for
   `1/2<sigma<1/2+b` the upper-bound right side can be made much larger than
   the added `O(1)` count.

Thus critical-strip symmetry, any prescribed finite verified band, global
Riemann--von Mangoldt-scale counting, the quoted near-one zero-free region,
and standard density upper bounds are jointly compatible with failure of
(1) in the broader canonical-product class.  They cannot, by themselves,
prove the required compensation.

This countermodel is intentionally not a zeta-function model.  In
particular, multiplication by (19) does not preserve the complete-theta
Fourier representation or Euler-product arithmetic.  Those source-specific
structures are exactly where a successful additional inequality would have
to enter.

## Relation to the undivided directional density

The divided curvature in (21) tends to `-infinity` as `b` tends to zero, but
one should not confuse that with the size of the undivided Turan density.
For `F_b=F_0P_{a,b}`, the factor `P_{a,b}(a)` itself is of order `b^2`, so

\[
 F_b(a)^2\{-\log F_b\}''(a)
\]

can tend to zero rather than to `-infinity`.  The conclusion needed by the
all-degree route is the **sign**, not a uniform negative magnitude.  For each
fixed `b>0` satisfying (20), equation (21) and continuity give a negative
open interval, and the undivided density has the same sign there because
`F_b` is nonzero.

For the actual Xi function, the exact directional identity remains

\[
 \mathfrak q(\pi)=\frac1{4\pi}\int_{\mathbb R}
 |F(x)\pi(ix)|^2\{-\log F\}''(x)\,dx,                              \tag{22}
\]

with the undivided interpretation at real zeros.  The polynomial-density
closure already proved in this workstream means that any genuine negative
open interval is relevant at some degree.  This is why a fixed verified
band, however large, cannot close the all-degree statement.

## The missing arithmetic lemma

A canonical-product proof now has a precise source-specific target.  For
every hypothetical Xi quartet `±a±ib`, it would have to derive, without
assuming RH or the desired Laguerre sign,

\[
 \sum_{\zeta\notin\{\pm a\pm ib\}}^{\rm grouped}
       \frac1{(a-\zeta)^2}
 \geq
 \frac2{b^2}
 -\frac{2(4a^2-b^2)}{(4a^2+b^2)^2}.                               \tag{23}
\]

Equivalently, one needs a theta- or Euler-product-derived correlation that
forces `b^{-2}`-scale positive mass near the ordinate of every possible
off-line zero.  Separate absolute estimates, average zero counts, a
near-one zero-free region, and finite-height verification do not have this
resolution.  Proving (23), or a stronger integrated version matched to
`|F(x)pi(ix)|^2`, would be genuinely new arithmetic input.  Merely increasing
the verified height would move the unresolved quartet farther out without
changing the local obstruction.

## Primary-source record

- Dave Platt and Tim Trudgian, *The Riemann hypothesis is true up to
  `3*10^12`*, rigorously verify with interval arithmetic that every zero up
  to that height lies on the critical line:
  <https://arxiv.org/abs/2004.09765>.
- Michael J. Mossinghoff, Timothy S. Trudgian, and Andrew Yang, *Explicit
  zero-free regions for the Riemann zeta-function*, prove both the classical
  logarithmic region used in (13) and a Vinogradov--Korobov-type region near
  `sigma=1`:
  <https://arxiv.org/abs/2212.06867>.
- Aleksander Simonic, *Explicit zero density estimate for the Riemann
  zeta-function near the critical line*, gives an explicit form of the
  Selberg upper bound summarized in (15):
  <https://arxiv.org/abs/1910.08274>.
- George Csordas, *Fourier transforms of positive definite kernels and the
  Riemann xi-Function*, states the global first Laguerre inequality as Open
  Problem 4.7 and explains why it is only a necessary condition in general:
  <https://arxiv.org/abs/1309.0055>.
- Suvrit Sra, *On some positivity properties of the Riemann Xi function*,
  supplies the finite verified-band implication used in the parent
  workstream and explicitly leaves the global first inequality open:
  <https://arxiv.org/abs/2611.02944>.

These references support the stated finite verification, zero-free, density,
and open-problem facts.  The local crowding lemma and the countermodel above
are elementary deductions from the canonical-product formula; they do not
claim a resolution of that open problem or of RH.
