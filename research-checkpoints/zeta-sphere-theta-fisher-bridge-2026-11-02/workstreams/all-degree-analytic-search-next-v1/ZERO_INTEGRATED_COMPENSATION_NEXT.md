# Integrated zero compensation for one residual direction

## Scope and conclusion

The pointwise canonical-product obstruction in
`CANONICAL_ZERO_COMPENSATION_NEXT.md` is stronger than what one fixed
mismatch-corrected residual actually asks.  For a real polynomial `pi`, the
directional target is

\[
 \mathfrak q(\pi)
 =\frac1{4\pi}\int_{\mathbb R}
 |\pi(ix)|^2\,\mathcal L[F](x)\,dx,
 \qquad
 \mathcal L[F]:=F'^2-FF'',
 \qquad F=2\Xi.                                      \tag{1}
\]

This note factors a hypothetical off-line quartet exactly inside (1).  The
main conclusions are:

1. The Laguerre expression has an exact product rule with **no cross term**.
2. After the zero factors in `F` are retained, the negative penalty of a
   pair `a±ib` has an exact `b^3`-rescaled integral form, not the divided
   pointwise scale `b^{-2}`; an actual `b^3` asymptotic additionally
   requires the scaled equicontinuity condition stated below.
3. For one quartet, nonnegativity is exactly a comparison between a
   quartet-deleted background reserve, a positive exterior reserve, and one
   local quotient mass.
4. Critical-strip geometry and zero counts alone do not control that
   quotient mass or the residual weight.  The completed zeta growth,
   however, gives a noncircular route to a **fixed-polynomial** tail
   certificate when combined with a rigorously positive verified core.
5. The constants in that route depend on the degree and coefficients of
   `pi`; it supplies no all-degree closure.

No off-line zero is asserted to exist.  No finite verification is claimed
to prove the global Laguerre sign or RH.

## Exact quartet factorization

Suppose, only for analysis, that the zero multiset of `F` contains

\[
 a+ib,\quad a-ib,\quad -a+ib,\quad -a-ib,
 \qquad a>0,\quad 0<b<\frac12.                     \tag{2}
\]

Put

\[
\begin{aligned}
 A_-(z)&=(z-a)^2+b^2,\\
 A_+(z)&=(z+a)^2+b^2,\\
 P_{a,b}(z)&=A_-(z)A_+(z),\\
 G(z)&=\frac{F(z)}{P_{a,b}(z)}.
\end{aligned}                                       \tag{3}
\]

All divisions in (3) are exact entire factorizations with removable values
at the four zeros.  The functions `F`, `P`, and `G` are real and even.

For any twice differentiable functions `U,V`,

\[
 \boxed{\mathcal L[UV]=V^2\mathcal L[U]+U^2\mathcal L[V].}          \tag{4}
\]

Indeed, the two mixed terms in `(UV)'^2-UV(UV)''` cancel.  Therefore

\[
 \boxed{
 \mathfrak q_F(\pi)
 =\frac1{4\pi}\int_{\mathbb R}W_\pi P_{a,b}^2\mathcal L[G]\,dx
  +\frac1{4\pi}\int_{\mathbb R}W_\pi G^2\mathcal L[P_{a,b}]\,dx.}
                                                                    \tag{5}
\]

where

\[
 W_\pi(x):=|\pi(ix)|^2.                                             \tag{6}
\]

For a real polynomial, `W_pi` is nonnegative and even.  Formula (5) is
division-free and remains valid at real zeros.

The first term in (5) is the quartet-deleted background, with the exact
weight `P^2 W_pi`.  The second is the complete direct contribution of the
quartet.  There is no unaccounted interaction term.

## Two exact forms of the quartet contribution

The pair form is

\[
\begin{aligned}
 \mathcal L[P_{a,b}](x)
 ={}&2\{(x-a)^2-b^2\}A_+(x)^2\\
    &+2\{(x+a)^2-b^2\}A_-(x)^2.                    \tag{7}
\end{aligned}
\]

The polynomial form is

\[
\boxed{
 \mathcal L[P_{a,b}](x)
 =4\left[
 x^6+(b^2-a^2)x^4
 -(a^4+10a^2b^2+b^4)x^2
 +(a^2-b^2)(a^2+b^2)^2
 \right].}                                          \tag{8}
\]

Thus, if

\[
 m_{2k}(\pi;G)
 :=\int_{\mathbb R}x^{2k}G(x)^2W_\pi(x)\,dx,         \tag{9}
\]

then the quartet contribution is exactly

\[
\boxed{
\begin{aligned}
 \mathfrak q_{\rm qt}(\pi)
 =\frac1\pi\{&
 m_6+(b^2-a^2)m_4\\
 &-(a^4+10a^2b^2+b^4)m_2
 +(a^2-b^2)(a^2+b^2)^2m_0\}.
\end{aligned}}                                      \tag{10}
\]

This displays explicitly how the polynomial residual enters: it changes
the even moments of the quartet-deleted profile `G^2`, rather than merely
multiplying the center value of the divided logarithmic curvature.  Hankel
positivity of the moment sequence does not fix the sign of the particular
combination in (10), since the polynomial in (8) is negative on open sets.

## Exact inside--outside compensation

It is useful to remove only the pair centered at `+a`:

\[
 H_{a,b}(z)
 :=\frac{F(z)}{A_-(z)}
 =G(z)A_+(z).                                        \tag{11}
\]

Because `W_pi G^2` is even, the two integrals in (7) are equal after
`x -> -x`.  Consequently

\[
 \boxed{
 \mathfrak q_{\rm qt}(\pi)
 =\frac1\pi\int_{\mathbb R}
 |H_{a,b}(x)\pi(ix)|^2\{(x-a)^2-b^2\}\,dx.}          \tag{12}
\]

Define the local negative penalty and exterior positive reserve by

\[
\begin{aligned}
 N_\pi(a,b)
 &:=
 \int_{|x-a|<b}|H_{a,b}(x)\pi(ix)|^2
       \{b^2-(x-a)^2\}\,dx,\\
 E_\pi(a,b)
 &:=
 \int_{|x-a|\geq b}|H_{a,b}(x)\pi(ix)|^2
       \{(x-a)^2-b^2\}\,dx.                         \tag{13}
\end{aligned}
\]

Also set

\[
 C_\pi^{\rm bg}(a,b)
 :=\frac14\int_{\mathbb R}
 W_\pi(x)P_{a,b}(x)^2\mathcal L[G](x)\,dx.           \tag{14}
\]

Equations (5) and (12) give the exact identity

\[
 \boxed{
 \mathfrak q_F(\pi)
 =\frac1\pi\{
 C_\pi^{\rm bg}(a,b)+E_\pi(a,b)-N_\pi(a,b)\}.}       \tag{15}
\]

Therefore the exact integrated compensation condition for this quartet is

\[
 \boxed{
 C_\pi^{\rm bg}(a,b)+E_\pi(a,b)\geq N_\pi(a,b).}     \tag{16}
\]

Unlike the center-value condition, (16) is residual-specific.  The
functional-equation mirror is already included exactly: its equal integral
is the reason the factor in (12) is `1/pi` rather than `1/(2pi)`.  The
mirror does not provide a separate pointwise `b^{-2}` rescue; it duplicates
the negative interval at `-a` and also duplicates the exterior positive
reserve.

The background term in (14) is signed if other off-line zeros remain.
Consequently, discarding it as positive would be circular unless an
independent property of the quartet-deleted function `G` has been proved.

## Exact `b^3` rescaling and its conditional asymptotic

Changing variables `x=a+bu` in (13) gives

\[
 N_\pi(a,b)
 =b^3\int_{-1}^{1}(1-u^2)
 |H_{a,b}(a+bu)\pi(i(a+bu))|^2\,du.                 \tag{17}
\]

For a family with `b` tending to zero, define

\[
 K_b(u):=
 |H_{a,b}(a+bu)\pi(i(a+bu))|^2,\qquad |u|\leq1.
\]

If the family is **equicontinuous on the scaled interval** in the precise
sense

\[
 \sup_{|u|\leq1}|K_b(u)-K_b(0)|\longrightarrow0,                   \tag{17a}
\]

(for example, if `K_b` converges uniformly on `[-1,1]` to a constant), then

\[
 N_\pi(a,b)
 =\frac43 b^3|H_{a,b}(a)\pi(ia)|^2+o(b^3)           \tag{18}
\]

by (17) and the identity
`\int_{-1}^1(1-u^2)du=4/3`.  Continuity for each fixed `b`, or mere local
boundedness of the family, is not enough to justify this asymptotic.  The
undivided zero factor cancels the apparent `b^{-2}` singularity once
(17a) holds, and the remaining interval has width `O(b)`.  This does not
prove a sign, because the quotient `H_{a,b}` can itself be large; it
identifies the correct quantity that must be controlled.

There is a simple rigorous disk estimate.  For any `R>b`, let

\[
 M_F(a,R):=\max_{|z-a|=R}|F(z)|.                    \tag{19}
\]

On that circle,

\[
 |A_-(z)|
 =|z-a-ib|\,|z-a+ib|
 \geq(R-b)^2.
\]

The maximum principle applied to the entire quotient `H=F/A_-` yields

\[
 \max_{|z-a|\leq R}|H_{a,b}(z)|
 \leq\frac{M_F(a,R)}{(R-b)^2}.                      \tag{20}
\]

Combining (17)--(20),

\[
\boxed{
 N_\pi(a,b)
 \leq\frac{4b^3}{3(R-b)^4}
 M_F(a,R)^2
 \max_{|x-a|\leq b}W_\pi(x).}                       \tag{21}
\]

For `R=1` and `b<1/2`, this becomes

\[
 N_\pi(a,b)
 \leq\frac{64}{3}b^3 M_F(a,1)^2
 \max_{|x-a|\leq b}W_\pi(x).                        \tag{22}
\]

This estimate is noncircular: it uses the assumed zero only to divide out
an exact factor, and it bounds the quotient by the completed function on a
fixed surrounding circle.

## A global sufficient inequality above a verified band

Let `T=H-1/2`, where all zeta zeros through height `H` have been rigorously
verified on the critical line.  Then every hypothetical quartet has
`a>H`, and because `b<1/2`, both of its negative intervals lie outside
`[-T,T]`.

Define the independently nonnegative verified-core mass

\[
 A_\pi(T)
 :=\frac14\int_{|x|\leq T}
 W_\pi(x)\mathcal L[F](x)\,dx.                     \tag{23}
\]

List the distinct hypothetical off-line quartets once, using their positive
ordinate `a_j`, transverse displacement `b_j`, and multiplicity `m_j>=1`.
The canonical zero formula for Xi has no quadratic-exponential remainder.
Its real zeros
contribute positively, and each nonreal pair contributes nonnegatively
outside its obstruction interval.  Applying the argument first to symmetric
finite zero truncations and then passing to the limit as justified by the
canonical-series lemma below, discarding all those positive tail pieces
gives

\[
 \boxed{
 \mathfrak q_F(\pi)
 \geq\frac1\pi\left\{
 A_\pi(T)-\sum_j m_jN_\pi(a_j,b_j)\right\}.}         \tag{24}
\]

Hence the following is a strong, noncircular, residual-specific sufficient
condition:

\[
 \boxed{
 \sum_j m_jN_\pi(a_j,b_j)\leq A_\pi(T).}            \tag{25}
\]

This is weaker in information requirements than proving pointwise
nonnegativity outside the band, and stronger than the exact net condition
because it discards every positive exterior and real-zero contribution.

Combining (22) with (25) produces a concrete quotient-sampling target:

\[
 \boxed{
 \frac{64}{3}\sum_j m_jb_j^3 M_F(a_j,1)^2
 \max_{|x-a_j|\leq b_j}W_\pi(x)
 \leq A_\pi(T).}                                    \tag{26}
\]

Equation (26) is not the desired sign in disguise.  Its right side is
independently nonnegative on the verified band, while its left side can be
bounded using completed-zeta growth and an upper count of possible zeros.

## What standard information can and cannot provide

### Geometry and counts alone do not imply (16)

The critical strip bounds `b` above by `1/2`; it does not bound the quotient
`H=F/A_-`.  The functional equation supplies the equality of the two
pair integrals but no lower bound for `C_bg+E`.  Zero-density and
Riemann--von Mangoldt estimates bound how many ordinates may occur; they do
not control any of

\[
 M_F(a,1),\qquad
 |H_{a,b}(x)|,\qquad
 W_\pi(x),\qquad
 C_\pi^{\rm bg}(a,b).                               \tag{27}
\]

Thus the standard canonical zero geometry by itself cannot yield either the
exact inequality (16) or the sufficient inequality (25).

The Galerkin property of the mismatch-corrected residual does not change
this conclusion.  Its relations
`\mathfrak q(q,\pi)=0` against the old polynomial space use the full signed
density.  They do not imply a local mass estimate for `W_pi H^2` on
`(a-b,a+b)`.

### Completed-zeta growth does control each fixed residual tail

The situation changes once source-specific size information is added.  On
a fixed-width complex disk centered at a large real `a`, Stirling's formula
for the gamma factor, the functional equation, and standard vertical-strip
bounds for zeta give constants `C,A` such that

\[
 M_F(a,1)
 \leq C(1+a)^A e^{-\pi a/4}.                        \tag{28}
\]

For a fixed polynomial of degree `d`,

\[
 \max_{|x-a|\leq1/2}W_\pi(x)
 \leq C_\pi(1+a)^{2d}.                              \tag{29}
\]

Equations (22), (28), and (29) therefore give

\[
 N_\pi(a,b)
 \leq C'_\pi(1+a)^{2d+2A}e^{-\pi a/2}.              \tag{30}
\]

An `O(U log U)` upper count of zero ordinates makes the sum of (30) above
`T` converge and yields, with a harmless change of polynomial exponent,

\[
 \sum_{a_j>T}m_jN_\pi(a_j,b_j)
 \leq C''_\pi(1+T)^{2d+2A+2}e^{-\pi T/2}.           \tag{31}
\]

This is an analytic completed-function estimate, not a consequence of zero
counts alone.  It also explains why a near-line quartet is less dangerous
to one fixed directional integral than to the pointwise divided curvature.

### Canonical-series limiting lemma

The passage from finite canonical truncations to (24) uses the following
standard facts, recorded here to fix the domain.

**Lemma.**  Group the Xi zeros by real zeros and functional-equation
quartets, with multiplicity.  Then:

1. `N(U)=O(U log U)` implies
   `\sum_\zeta|\zeta|^{-2}<infinity`.  Hence
   `\sum_\zeta(z-\zeta)^{-2}` converges locally normally on compact subsets
   of the complex plane disjoint from the zero set; in particular, it does
   so on real compact intervals away from real zeros.
2. If `r` is a real zero of multiplicity `m`, then the apparent term
   `mF(x)^2/(x-r)^2` has a removable real-axis value, because
   `F(x)=(x-r)^m h(x)` with `h(r) != 0`.  Thus multiplication by `F^2`
   extends the locally normal identity continuously through every real
   zero.
3. For polynomial `W_pi`, completed-zeta vertical decay makes
   `W_pi |\mathcal L[F]|` integrable.  More specifically, the negative
   portion of every off-line quartet is `m_jN_pi(a_j,b_j)/pi`, and
   (21), (28), and the multiplicity-weighted count give the summable
   majorant (31).

**Justification of the limit.**  Apply the canonical inequality to symmetric
finite zero truncations.  Local normal convergence plus the removable-zero
extension handles every compact interval.  The negative grouped tails
converge in `L1` by the summable majorant in item 3, while all discarded real
and exterior pair terms are nonnegative and pass to the limit by Fatou.
This proves the limiting lower bound (24); no unsigned interchange of a
conditionally convergent first-logarithmic-derivative series is being used.

### Fixed-polynomial verification principle

The complete-theta representation gives
`\mathcal L[F](0)=-F(0)F''(0)>0`: `F(0)>0` and
`F''(0)` is the negative second moment of the positive theta profile.
Hence, for every nonzero real polynomial `pi`, the verified-core integral
`A_pi(T)` is strictly positive once the band contains a fixed neighborhood
of zero.  The polynomial can vanish at zero, but it cannot vanish on that
whole neighborhood.

Let `B_pi(T)` denote a rigorously evaluated upper bound for the
multiplicity-weighted sum on the left of (31), obtained with explicit
constants.  The fixed-residual conclusion is conditional on both a
successful verification through height `H` and the concrete comparison

\[
 \boxed{
 B_\pi(H-\tfrac12)\leq A_\pi(H-\tfrac12).}           \tag{31a}
\]

For each fixed nonzero `pi`, the asymptotic majorant in (31) tends to zero,
whereas the verified core has a fixed positive local contribution.  Thus
the method supplies a formal degree-dependent threshold.  It certifies
`\mathfrak q(pi)>=0` only when RH has actually been verified through a
height meeting that threshold and the explicit inequality (31a) has been
checked.  This does **not** assert that the currently published height is
sufficient for an unspecified residual, nor that any proposed higher
verification has been completed.  A concrete certificate must carry the
explicit constants, a rigorous lower bound for `A_pi`, and the actual
coefficients of `pi`.

### Why this does not close the all-degree ladder

The constants in (29)--(31) depend on the degree and coefficient geometry
of `pi`.  The factor `(1+T)^{2d}` is not uniform in `d`, while the verified
core mass can become small for polynomials concentrating away from the
core.  At increasing degree, polynomial density can target any negative
open interval beyond the verified band.  Therefore no fixed `T` turns
(31) into an all-degree estimate by this method.  Equivalently, this
argument supplies no single finite verified band or degree-uniform `T`.
It does not rule out separate degree-dependent certificates at heights
`H_d` if rigorous verification to every required height and all explicit
comparisons (31a) were available.

The integrated route converts a `b^{-2}` pointwise obstruction into a much
milder fixed-direction tail problem, but it does not remove the known
all-degree endpoint blocker.

## The source-specific missing lemma

For the actual mismatch-corrected residual, the useful next statement is a
**residual-weighted quotient sampling inequality**:

\[
 \sum_{\substack{j:\ \text{distinct hypothetical off-line}\\
                  \text{quartets with }a_j>H}}
 m_j\int_{a_j-b_j}^{a_j+b_j}
 \left|
 \frac{F(x)\pi(ix)}{(x-a_j)^2+b_j^2}
 \right|^2
 \{b_j^2-(x-a_j)^2\}\,dx
 \leq A_\pi(H-\tfrac12).                            \tag{32}
\]

This is exactly (25), written without the auxiliary `G`.  It is shaped like
a Carleson sampling estimate for the pair-deleted completed function.  A
proof could use:

1. the complete-theta representation to obtain a rigorous positive lower
   bound for the core mass `A_pi`;
2. the gamma factor and an explicit approximate functional equation or
   vertical-strip zeta bounds to control the disk maxima in (26);
3. an explicit zero-count upper bound only at the final summation step; and
4. the actual residual coefficients, rather than a degree-free polynomial
   majorant.

This route is noncircular because none of these four inputs assumes the
unknown global Laguerre sign.  It is also deliberately residual-specific.
To make it uniform over every degree would require a new theta-weighted
sampling/contraction theorem, essentially the same missing source-specific
structure identified by the complete-theta channel analysis.

For one isolated quartet, the sharper target remains the exact inequality
(16), which retains its positive exterior reserve and its signed
quartet-deleted background.  An Euler-product or theta argument capable of
lower-bounding that **combined** reserve would improve substantially on the
absolute tail estimate (32).

## Cross-check by integration by parts

There is a zero-free check on all constants.  Since `F` and its derivatives
have exponential real-axis decay, integration by parts gives

\[
\begin{aligned}
 \int_{\mathbb R}W_\pi(F'^2-FF'')\,dx
 =2\int_{\mathbb R}W_\pi F'^2\,dx
  -\frac12\int_{\mathbb R}W_\pi''F^2\,dx.           \tag{33}
\end{aligned}
\]

Thus

\[
 \mathfrak q(\pi)\geq0
 \quad\Longleftrightarrow\quad
 4\int_{\mathbb R}W_\pi F'^2\,dx
 \geq\int_{\mathbb R}W_\pi''F^2\,dx.                \tag{34}
\]

Equation (34) is equivalent to the directional target, not a proof of it.
It confirms that the polynomial weight necessarily enters through global
weighted norms; zero counts alone cannot determine the sign.

## Nonclaims

- No hypothetical quartet is asserted to exist.
- The exact factorization does not make `C_bg` nonnegative.
- The exact `b^3` rescaling does not by itself give a `b^3` asymptotic;
  that uses (17a), and integrated compensation still requires control of
  the quotient `H`.
- The current verified height is not claimed to certify an unspecified or
  arbitrarily high-degree residual.
- A certificate for one fixed `pi` would not prove the global first
  Laguerre inequality and would not prove RH.
- The sufficient sampling inequality (32) discards positive terms and is
  not necessary.  The exact single-quartet condition is (16).
- Nothing here replaces the complete-theta signed-channel problem by a
  generic zero-count argument.
