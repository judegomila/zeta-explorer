# LP cardinal-tail finite-annihilator barrier

## 0. Exact outcome and claim boundary

Fix `h>0`, an integer `a>=1`, and the first omitted carrier

\[
 T=ah,
 \qquad t_k=(a+k)h,
 \qquad x_k=t_k^2
 \quad(k\geq0).                                      \tag{0.1}
\]

Let `M>=1`, and let `gamma_1,...,gamma_M` be distinct positive
noncarrier rows below `T`.  Put `y_j=gamma_j^2`.  This note constructs a
finite alternating cardinal tail `f_k` for which

\[
 E=\sum_{k\geq0}(-1)^kf_k\neq0,
 \qquad
 C_j=\sum_{k\geq0}(-1)^kf_k
 {y_j\over y_j-x_k}=0
 \quad(1\leq j\leq M).                              \tag{0.2}
\]

The construction is exact.  It has only `M+1` nonzero coefficients, and
all the nonzero `f_k` have one sign.  Thus reality of the rows, positivity
of the unalternated tail samples, and real-zero geometry do not by
themselves prevent simultaneous cancellation of finitely many normalized
Cauchy rows.

There is also an explicit even real entire interpolant of order one in the
Laguerre--Polya class.  It has the prescribed row zeros, realizes exactly
the coefficients in (0.2), and vanishes at all later carriers.  A
real-zero perturbation makes all of its zeros simple while making every
`C_j/E` arbitrarily small.  The resulting simple Laguerre--Polya function
has the standard Hermite--Biehler companion and therefore survives the
basic strict de Branges geometry.

This is a structural barrier only.  The interpolant has an artificial
carrier-lattice zero set and does **not** obey the HSW zeta zero-count
asymptotic.  It is not `Xi`, not the finite-`lambda` prolate/arithmetic
transform, and not an HSW-compatible counterexample.  In particular, it
does not prove that the actual tail cancels.  It proves that
Laguerre--Polya/de Branges geometry alone supplies no one-vector
anti-cancellation theorem of the required kind.

The exact actual cardinal reduction is also not imported as a theorem.
Section 6 keeps explicit the endpoint and zero-row remainders which would
have to be controlled before identifying `H_N/d_N` with `C_j/E`.

This is an unbound theorem-only post-checkpoint-1.41 note/test pair.  It
adds no numerical zero table, source lock, standard-eight edit, or
serialized artifact.  It proves no decay or failure of
`eta_N^pr`, no actual arithmetic sign, no even reserve, no new zeta-zero
theorem, no RH implication or converse, and no de Bruijn--Newman `Lambda`
bound.  The standard eight are unchanged and the formal state remains
`P0_INVALIDATED`.

## 1. Minimal frozen inputs

Only two frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/ACTUAL_ENDPOINT_RATIONAL_VARIANCE_FAR_TAIL_BARRIER.md | 88965c9926092be319f83014408b689622911b1d27b5e5f266e2d7fb74e92644 |
| tests/test_actual_endpoint_rational_variance_far_tail_barrier.py | bd993af601bcddbd48ad077bd9b9c64f0cfb34ba2354b617de94f66029d0716c |
| notes/HSW_CONTINUOUS_L_PHASE_SHELL_THEOREM.md | 49a53cb1f8ee6db85040cd39aa6faa4fff0296d8bb8b99b18e830efce63df70e |
| tests/test_hsw_continuous_l_phase_shell_theorem.py | 54e28858ad50a9b29578ff7719a2bb9818e02d7f275530a9da8cc15a023b6d9f |

The endpoint-variance pair supplies the actual rational rows, endpoint
quotient, carrier convention, and fail-closed variance target.  The HSW
pair supplies only the multiplicity-aware zero-count/phase interface.  It
does not supply an amplitude theorem.  No statement about the scratch
one-sided cardinal reduction is frozen in either dependency.

## 2. Exact finite cardinal annihilator

Define the monic polynomials

\[
 Q(x)=\prod_{j=1}^M(x-y_j),
 \qquad
 D(x)=\prod_{k=0}^M(x-x_k),                          \tag{2.1}
\]

and the barycentric coefficients

\[
 b_k={Q(x_k)\over D'(x_k)}
 \quad(0\leq k\leq M),
 \qquad
 b_k=0
 \quad(k>M).                                        \tag{2.2}
\]

Since `Q` and `D` are monic of degrees `M` and `M+1`, respectively,
partial fractions give

\[
 {Q(x)\over D(x)}
 =\sum_{k=0}^M{b_k\over x-x_k}.                     \tag{2.3}
\]

Comparison of the coefficients at infinity proves

\[
 \boxed{\sum_{k=0}^M b_k=1.}                        \tag{2.4}
\]

Multiplying (2.3) by `y` and then setting `y=y_j` proves

\[
 \boxed{
 \sum_{k=0}^M b_k{y\over y-x_k}
 ={yQ(y)\over D(y)},
 \qquad
 \sum_{k=0}^M b_k{y_j\over y_j-x_k}=0.}            \tag{2.5}
\]

Now put

\[
 f_k=(-1)^kb_k.                                      \tag{2.6}
\]

Equations (2.4)--(2.6) are exactly (0.2), with `E=1`.  There is no
limiting argument and no deletion of a carrier term.  All prescribed rows
are strictly below the first omitted carrier, so every denominator in
(2.5) is regular.

The coefficient signs are unusually favorable.  Since `y_j<x_0<=x_k`,
one has `Q(x_k)>0`, while

\[
 \operatorname {sgn}D'(x_k)=(-1)^{M-k}.             \tag{2.7}
\]

Therefore

\[
 \boxed{\operatorname {sgn}f_k=(-1)^M
 \quad(0\leq k\leq M).}                            \tag{2.8}
\]

Thus the cancellation is not produced by changing signs among the
unweighted samples `f_k`; it is produced by the cardinal alternation and
the Cauchy denominators.

## 3. Explicit even order-one Laguerre--Polya interpolant

Write `u=t/h` and define

\[
 \begin{aligned}
 \mathcal F_{a,M}(t)
 &:={2u\,Q(t^2)\Gamma(a+u)\over
 \Gamma(1-a+u)\Gamma(M+1+a-u)\Gamma(M+1+a+u)}.
 \end{aligned}                                      \tag{3.1}
\]

Because `a` is a positive integer,

\[
 {\Gamma(a+u)\over\Gamma(1-a+u)}
 =\prod_{r=1-a}^{a-1}(u+r)
 =u\prod_{r=1}^{a-1}(u^2-r^2).                      \tag{3.2}
\]

Hence (3.1) is the manifestly entire expression

\[
 \mathcal F_{a,M}(t)
 ={2u^2Q(h^2u^2)\displaystyle\prod_{r=1}^{a-1}(u^2-r^2)
 \over
 \Gamma(M+1+a-u)\Gamma(M+1+a+u)}.                  \tag{3.3}
\]

It is even and real on the real axis.  Its zeros, with collisions counted
as multiplicities, are all real:

\[
 \begin{gathered}
 u=0,\quad u=\mathord\pm1,\ldots,\mathord\pm(a-1),
 \quad u=\mathord\pm{\gamma_j\over h},\\
 u=\mathord\pm(M+a+1+n)
 \quad(n=0,1,2,\ldots).
 \end{gathered}                                      \tag{3.4}
\]

The reciprocal gamma function is Laguerre--Polya, real affine changes and
products preserve that class, and every polynomial factor in (3.3) has
only real zeros.  Thus `mathcal F_(a,M)` is Laguerre--Polya.  Its infinite
real zero sequence gives order exactly one.

At `t=t_k`, direct factorial evaluation gives, for `0<=k<=M`,

\[
 \mathcal F_{a,M}(t_k)
 ={2(a+k)Q(x_k)\Gamma(2a+k)\over
 k!(M-k)!\Gamma(2a+k+M+1)}.                         \tag{3.5}
\]

On the other hand,

\[
 D'(x_k)
 =h^{2M}(-1)^{M-k}k!(M-k)!
 {\Gamma(2a+k+M+1)\over
  2(a+k)\Gamma(2a+k)}.                              \tag{3.6}
\]

Combining (2.2), (3.5), and (3.6) yields

\[
 \boxed{
 (-1)^k\mathcal F_{a,M}(t_k)
 =h^{2M}(-1)^M b_k
 \quad(0\leq k\leq M).}                            \tag{3.7}
\]

For every `k>M`, the reciprocal factor
`1/Gamma(M+1-k)` vanishes, so

\[
 \boxed{\mathcal F_{a,M}(t_k)=0\quad(k>M).}          \tag{3.8}
\]

Thus the actual samples of one even order-one Laguerre--Polya function
realize the finite annihilator, up to the harmless common nonzero factor
`h^(2M)(-1)^M`.  The factor `Q(t^2)` also gives

\[
 \mathcal F_{a,M}(\gamma_j)=0
 \quad(1\leq j\leq M).                              \tag{3.9}
\]

## 4. Simple-zero and strict de Branges approximation

Assume in this section that the positive numbers `gamma_j/h` are distinct
and avoid the integers.  The double zero at `u=0` can be split without
moving any prescribed row zero.  For a positive noninteger `epsilon`
smaller than every positive zero in (3.4), define

\[
 \mathcal F_{a,M}^{(\epsilon)}(t)
 =\mathcal F_{a,M}(t){u^2-\epsilon^2\over u^2}.       \tag{4.1}
\]

The quotient is entire because `u^2` divides (3.3).  For generic
`epsilon`, every zero in (4.1) is real and simple.  The function remains
even, order one, and Laguerre--Polya.  Its tail samples satisfy

\[
 (-1)^k\mathcal F_{a,M}^{(\epsilon)}(t_k)
 =h^{2M}(-1)^Mb_k
 \left(1-{\epsilon^2\over(a+k)^2}\right).           \tag{4.2}
\]

Let `E_epsilon` and `C_(j,epsilon)` denote the two sums in (0.2) formed
from these perturbed samples.  Equations (2.4), (2.5), and (4.2) give

\[
 \begin{aligned}
 {E_\epsilon\over h^{2M}(-1)^M}
 &=1-\epsilon^2\sum_{k=0}^M{b_k\over(a+k)^2},\\
 {C_{j,\epsilon}\over h^{2M}(-1)^M}
 &=-\epsilon^2\sum_{k=0}^M
 {b_k\over(a+k)^2}{y_j\over y_j-x_k}.
 \end{aligned}                                      \tag{4.3}
\]

Consequently

\[
 \boxed{
 E_\epsilon\longrightarrow h^{2M}(-1)^M\neq0,
 \qquad
 {C_{j,\epsilon}\over E_\epsilon}\longrightarrow0
 \quad(1\leq j\leq M).}                            \tag{4.4}
\]

For a simple real entire Laguerre--Polya function `F`, its logarithmic
derivative has negative imaginary part in the upper half-plane.  Therefore

\[
 \mathcal E(z)=F(z)+iF'(z)                           \tag{4.5}
\]

is Hermite--Biehler: writing `w=F'/F` gives

\[
 |1+iw|^2-|1-iw|^2=-4\operatorname {Im}w>0
 \quad(\operatorname {Im}z>0).                      \tag{4.6}
\]

Apply this to `F=mathcal F_(a,M)^(epsilon)`.  Thus imposing simple zeros
and the associated strict de Branges companion does not create a uniform
positive lower bound for the normalized rows.  This is a statement about
the structural class, not about the specific `Xi` function.

## 5. Exact HSW scope

The HSW estimate gives, for fixed `B>0`,

\[
 \begin{aligned}
 \mathcal N(T)-\mathcal N(T-B)
 &\geq \mathcal M(T)-\mathcal M(T-B)
       -\mathcal R(T)-\mathcal R(T-B)\\
 &=\left({B\over2\pi}-2(0.103787)+o(1)\right)\log T.
 \end{aligned}                                      \tag{5.1}
\]

Hence a fixed window below the first omitted height has order `log(T)`
algebraic multiplicity when

\[
 B>4\pi(0.103787)=1.304\ldots.                       \tag{5.2}
\]

This is not a distinct-ordinate theorem.  If the window contains `r_T`
distinct ordinates with total algebraic multiplicity `Q_T`, HSW controls
`Q_T`, not `r_T`; repeated copies of one ordinate give the same Cauchy
equation.  Apply Section 2 with `M=r_T`.  It uses `r_T+1` tail coordinates
and kills every distinct equation, after which algebraic weights merely
repeat zero terms.  This explains the exact linear-algebra gap left by a
zero count: algebraic multiplicity does not imply distinct rows, and
counting either kind of row does not orient the one actual tail vector.

It would nevertheless be wrong to call the interpolant an HSW model.  Its
positive zeros outside a bounded region lie on a lattice of spacing `h`,
so

\[
 n_{\mathcal F}^+(R)={R\over h}+O_{a,M}(1),          \tag{5.3}
\]

whereas the HSW zeta main term has order `R log(R)`.  The construction
therefore proves only that LP/de Branges geometry does not supply the
missing coefficient linkage.  It is not a simultaneous HSW-compatible
LP countermodel, and it makes no assertion about the actual zeta tail.

There is a sharper local type mismatch.  In the scaled variable `u=t/h`,
the reciprocal-gamma pair in (3.3) has zero density one and exponential
type `pi`: it is the Nyquist-saturating carrier lattice.  The local
Riemann--Siegel density at the locked edge is asymptotically one zero per
two carriers, and the intended slow-frequency margin is sub-Nyquist
(asymptotically type `pi/2` in this scaling).  Thus the exact interpolant
does not test LP geometry together with the correct density/type margin.

For an integer `A>2`, the natural half-lattice replacement is

\[
 G_A(u)={1\over
 \Gamma((A-u)/2)\Gamma((A+u)/2)}.                   \tag{5.4}
\]

It is even Laguerre--Polya of type `pi/2`, has zeros on one carrier
parity, and its complementary-parity samples have polynomial size
`O(|n|^(1-A))`.  For large `A` those samples are summable.  But they are
not zero, so the finite partial-fraction identity of Section 2 no longer
closes.  A polynomial kills only finitely many complementary samples; a
rational factor generally loses entire Laguerre--Polya structure; and
adding the missing infinite half-lattice restores density one and type
`pi`.

Oversampled Shannon interpolation exposes a second exact difficulty.  If
an even function `F` belongs to a Paley--Wiener space `PW_sigma` with
`sigma<pi` and has absolutely summable integer samples, then

\[
 F(z)={\sin(\pi z)\over\pi}
 \left\{{F(0)\over z}
 +2z\sum_{n\geq1}{(-1)^nF(n)\over z^2-n^2}\right\}.
                                                               \tag{5.5}
\]

At any noninteger real root `rho`, (5.5) gives the desired full Cauchy
cancellation.  However, Poisson summation at the unused Nyquist frequency
also gives

\[
 \sum_{n\in\mathbb Z}(-1)^nF(n)=0.                  \tag{5.6}
\]

If `F` is even, `F(0)=0`, and every positive sample below the first
omitted carrier `m` is killed, then (5.6) forces

\[
 \sum_{n\geq m}(-1)^nF(n)=0.                        \tag{5.7}
\]

Thus the tempting half-density construction that kills the complete
prefix annihilates the endpoint tail along with the zero rows.  To retain
a nonzero endpoint, one must leave a prefix vector with nonzero
alternating sum while making its Cauchy values vanish at all prescribed
rows.  No exact LP construction with density one-half, type below `pi`,
and that simultaneous prefix property is proved here.  Consequently this
barrier does not rule out LP plus the correct type/density/slow-frequency
margin.

Nor does the HSW error budget by itself certify a dense finite carrier
block.  At the locked scale `log(T)=L/2+o(L)`, a physical window of width
`B` contains

\[
 {B\over h}={BL\over2\pi}
 \quad\hbox{carriers},
 \qquad
 \mathcal M(T)-\mathcal M(T-B)
 ={BL\over4\pi}+o(L).                               \tag{5.8}
\]

A carrier-density block therefore has excess `BL/(4*pi)+o(L)`, while the
two-endpoint HSW allowance is

\[
 2(0.103787)\log T=0.103787L+o(L).                  \tag{5.9}
\]

The inequalities meet only at `B=4*pi*(0.103787)`, whereas (5.1) needs a
strictly larger `B` for a guaranteed positive local count.  A specially
pre-biased discrepancy might permit a particular finite block, but the
frozen HSW estimate alone neither constructs the required continuation
nor controls its tail samples.

Multiplicity must also remain explicit.  HSW counts algebraic
multiplicity, while strict Hermite--Biehler kernel arguments often assume
simple phase zeros.  RH does not imply simplicity.  The perturbation in
Section 4 shows that simplicity would not repair the structural barrier,
but it does not permit actual multiplicities to be silently replaced by
distinct rows.

## 6. Endpoint and zero-row remainders cannot be dropped

The scratch one-sided reduction uses `a=m=N+1`, `h=2*pi/L`, and the exact
finite-`lambda` full transform coefficients `f_L(t_k)`.  Its desired form
is

\[
 \begin{aligned}
 d_N&=c_LE_m+r_E,\\
 H_N\!\left({\gamma L\over2\pi}\right)
 &=c_LC_\gamma+r_\gamma,
 \qquad
 c_L=-{2(-1)^m\over\sqrt L},
 \end{aligned}                                      \tag{6.1}
\]

where

\[
 \begin{aligned}
 E_m&=\sum_{k\geq0}(-1)^kf_L(t_k),\\
 C_\gamma&=\sum_{k\geq0}(-1)^kf_L(t_k)
 {\gamma^2\over\gamma^2-t_k^2}.
 \end{aligned}                                      \tag{6.2}
\]

This note does not prove `r_E=r_gamma=0`.  In particular, fixed-order
formal transforms of the form `P_j(t^2)Xi(t)` vanish at an actual zero,
but that fact does not control the moving finite-projection/Stokes
remainder relative to the flat endpoint.

When `E_m` and `E_m+r_E/c_L` are nonzero, the exact algebra is

\[
 {H_N\over d_N}-{C_\gamma\over E_m}
 ={(r_\gamma/c_L)E_m-C_\gamma(r_E/c_L)
 \over E_m(E_m+r_E/c_L)}.                            \tag{6.3}
\]

Thus absolute smallness of the two remainders is not enough.  A transfer
requires relative endpoint control and zero-row control on the scale of
the proposed lower bound, uniformly for the same moving rows and the same
locked values of `L`.

The leading model `f_L(t)=M_L(t)Xi(t)` must also be kept separate from the
exact finite-`lambda` state.  Even under RH, Laguerre--Polya information
about `Xi` neither proves that the multiplier `M_L` preserves a positive
Stieltjes sequence nor supplies a lower bound for the alternating sums in
(6.2).  A uniform Stokes theorem is the missing bridge, not a consequence
of the location of the zeros alone.

Exact carrier rows require their continuous limits.  The quotient
`H_N(gamma*L/(2*pi))/d_N` is not a regular pointwise amplitude when
`gamma*L/(2*pi)` is an integer.  Such a row must be retained through the
sine-times-pole limit in the actual denominator; it cannot be deleted or
inserted into (6.3) as an ordinary value.

## 7. Minimal genuinely new input

Let `Gamma_B(T)` be the set of distinct actual ordinates in `(T-B,T)`,
each carrying its algebraic weight `m_gamma`.  On a noncarrier locked
sequence, a direct sufficient one-vector theorem would be

\[
 \boxed{
 \sum_{\gamma\in\Gamma_B(T)}m_\gamma
 \sin^2\!\left({\gamma L\over2}\right)
 \left|{H_N(\gamma L/(2\pi))\over d_N}\right|^2
 \geq cT^2\log T}                                   \tag{7.1}
\]

for one fixed `B` satisfying (5.2) and one fixed `c>0`.  Since
`gamma` is comparable to `T` in this window, (7.1) gives

\[
 \sum_{\gamma\in\Gamma_B(T)}
 {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
 \left|{H_N(\gamma L/(2\pi))\over d_N}\right|^2
 \gg\log T.                                         \tag{7.2}
\]

Together with the finite global bound on `S_0`, this is strong enough for
the relative endpoint quotient to tend to zero.  Equation (7.1) is a
joint phase-amplitude statement for the one actual vector, not an
all-vector frame bound.

After a proved remainder-free version of (6.1), a stronger but simpler
interface would be

\[
 \left|{C_\gamma\over E_m}\right|\geq c_0T
 \quad\hbox{on rows carrying total phase mass}\quad
 \sum m_\gamma\sin^2(\gamma L/2)\gg\log T.           \tag{7.3}
\]

For `gamma=T-Delta`, the near-edge kernel is exactly

\[
 {\gamma^2\over\gamma^2-(T+kh)^2}
 =-{(T-\Delta)^2\over
 (\Delta+kh)(2T+kh-\Delta)}.                        \tag{7.4}
\]

Thus (7.3) would follow from a quantitative anti-cancellation theorem for
the normalized one-sided Stieltjes tail, plus control of the large-`k`
part where the factor in (7.4) is not uniformly `T/2`.  Section 2 proves
that such anti-cancellation cannot be inferred from finite real-zero or
de Branges geometry alone.

The minimal new information is therefore source-specific: a uniform
relative Stokes/cardinal theorem and either (7.1), or an equivalent joint
averaged lower bound stable on a positive-measure set of `L`.  A zero
count, a separate phase average, or an isolated amplitude point does not
join the moving cutoff, phase, and tail coefficients.

## 8. Stopping point

The exact barycentric vector and its explicit LP interpolant close one
logical route: real zeros, one-signed cardinal samples, simple-zero
perturbation, and basic de Branges strictness do not force a finite
one-vector Cauchy lower bound.  The actual arithmetic vector could still
obey a much stronger theorem.  Proving that requires the source-specific
joint input in Section 7 and relative control of every remainder in
Section 6.  Nothing here proves that the actual normalized tail is small,
large, or nonzero on a cofinal schedule.
