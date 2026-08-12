# Zero-side derivative frame: source-pinned limit

## 0. Scope and conclusion

This note audits whether the currently pinned zero-free, zero-count, and
finite-height theorems, combined with the exact boundary-zero derivative
primitive, prove

\[
 q_N<\mu_{N,-}:=\lambda_{\min}(Q_{N,-})                \tag{0.1}
\]

on an unbounded direct-attack schedule.  They do not.

There are two independent obstructions.

1. The full positive zero-evaluation Gram is available only on the branch
   where every nontrivial zero is already on the critical line.  The pinned
   Platt--Trudgian theorem makes a low block positive only through one fixed
   height.  The high block remains a signed pairing unless the target
   zero-location statement is assumed.
2. The derivative primitive tests one odd direction.  Even a proof that its
   Rayleigh quotient exceeds `q_N` would give an upper bound on the odd
   minimum, not the required lower bound.

The strongest full-Gram statement supplied by the present zero inputs is
the conditional determinant-scale lower bound on an implicit anti-carrier
schedule already derived below.  The strongest unconditional statement is
a corresponding lower bound for a **truncated finite-height Gram**, followed
by an uncontrolled signed high-zero perturbation.  Neither compares with
the projected-state Rayleigh value.

No zero table is read.  The published finite-height computation is used
only through its pinned theorem statement and is not replayed.  No global
Weil positivity, sector floor, relative residual--gap estimate, determinant
limit, or Riemann-hypothesis conclusion is proved.  The formal project state
remains `P0_INVALIDATED`.

## 1. What the three locked zero theorems actually supply

The binding inputs are those in `ZERO_SAMPLING_SOURCE_LOCK.json`.

* Mossinghoff--Trudgian--Yang excludes zeros near the two edges of the
  critical strip for `|gamma|>=3`.  It gives a vertical strip margin for
  complex sampling; it does not put a zero on the center line.
* Hasanalizade--Shen--Wong gives

  \[
  |N(T)-M(T)+1/8|\leq R(T),\qquad T\geq30610046000,     \tag{1.1}
  \]

  with algebraic multiplicity.  It gives counts, not simplicity or
  carrier-scale spacing.
* Platt--Trudgian puts all zeros with

  \[
  0<|\gamma|\leq H_{\rm PT}:=3000175332800             \tag{1.2}
  \]

  on the center line.  This is one fixed height, not an all-height theorem.
  It also does not state a zero-free interval at the origin.

The count does yield a useful but much coarser fact.  With the exact
functions `M,R,K` in Section 2 of
`notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md`, every band `(T,2T]`,
`T>=30610046000`, contains at least `K(T)` distinct ordinates separated by
more than one, and

\[
 K(T)/T\longrightarrow0.21699\ldots .                  \tag{1.3}
\]

Algebraic multiplicity is retained when proving (1.3): a multiplicity-aware
upper bound on each occupied unit bin is what permits extraction of one
distinct ordinate from separated bins.  It supplies no separation on the
carrier scale `2*pi/L`, whose width tends to zero.

## 2. Exact all-vector derivative-frame target

This section is only a target-branch identity.  Suppose every zero is on
the critical line and use the paired-map normalization

\[
 Q_\pm={1\over2}Z_\pm^*Z_\pm .                         \tag{2.1}
\]

Let `H_0=ker(delta)` in the even sector and let
`D_0=D|_(H_0):H_0 -> H_-`.  It is an isomorphism.  Boundary-zero integration
by parts gives, up to the fixed unitary parity phase,

\[
 Z_-D_0f=\Gamma_LZ_+f,
 \qquad
 (\Gamma_L y)(\gamma)={L\gamma\over2\pi}y(\gamma).
                                                               \tag{2.2}
\]

Consequently the exact odd minimum is

\[
 \boxed{
 \mu_{N,-}={1\over2}
 \inf_{0\ne f\in H_0}
 {\|\Gamma_LZ_+f\|^2\over\|Df\|^2}.}                 \tag{2.3}
\]

Thus the desired comparison is exactly the all-vector lower frame

\[
 \boxed{
 q_N<\mu_{N,-}
 \quad\Longleftrightarrow\quad
 \|\Gamma_LZ_+f\|^2>2q_N\|Df\|^2
 \quad(0\ne f\in H_0).}                               \tag{2.4}
\]

The factor `1/2` in (2.1) and the factor `2` in (2.4) are the same
normalization.  Equivalently, if only positive ordinates are used and each
row is weighted by the square root of its algebraic multiplicity, then
`Q_-=2G_-`; the negative ordinate supplies that factor two.  These two
descriptions must not be multiplied by another factor for the two paired
evaluation slots.

## 3. What the projected derivative direction proves

Put

\[
 p=P_NC_\lambda K_\lambda,\quad
 A=\|p\|^2,\quad d=\delta p,\quad
 f_p=p-de_0,\quad x=Dp=Df_p,\quad B=\|x\|^2,           \tag{3.1}
\]

and normalize

\[
 q={\langle p,Q_+p\rangle\over A},\qquad
 q_x={\langle x,Q_-x\rangle\over B}.                  \tag{3.2}
\]

On the same conditional branch there is no zero-height coordinate, and the
least positive ordinate `gamma_*` gives the exact lower estimate

\[
 q_x\geq {L^2\gamma_*^2\over8\pi^2B}
 \left(\sqrt{2Aq}-|d|C_0\right)_+^2,
 \qquad C_0=\|Z_+e_0\|.                                \tag{3.3}
\]

For `q>0`, define

\[
 \eta_N={|d|C_0\over\sqrt{2Aq}}.
\]

Then (3.3) is

\[
 \boxed{
 {q_x\over q}\geq
 {L^2\gamma_*^2A\over4\pi^2B}(1-\eta_N)_+^2.}        \tag{3.4}
\]

The differentiated prolate limit gives

\[
 {L^2A\over4\pi^2B}\longrightarrow {1\over m_2},
 \qquad
 m_2={\int_{\mathbb R}t^2|\Xi(t)|^2dt
              \over\int_{\mathbb R}|\Xi(t)|^2dt}.    \tag{3.5}
\]

Therefore the strongest directional consequence would be

\[
 \liminf {q_x\over q}\geq
 {\gamma_*^2\over m_2}(1-\limsup\eta_N)_+^2,           \tag{3.6}
\]

whenever the displayed endpoint ratio has the required limit behavior.
In particular, `gamma_*>sqrt(m_2)` and `eta_N->0` would imply
`q_x>q` eventually.

Neither hypothesis is pinned.  The line verification in (1.2) says that a
low zero, if present, lies on the line; it does not certify the initial
zero-free interval required to compare `gamma_*` with `sqrt(m_2)`.  Also,
the proved statements

\[
 d=O_A(\lambda^{-A})\quad\hbox{for every fixed }A,
 \qquad q=O(e^{-c\lambda L^2})                         \tag{3.7}
\]

are absolute upper bounds and give no control of
`|d|/sqrt(q)`.  They do not imply `eta_N->0`.

Most importantly, (3.4) tests only `f_p` in the infimum (2.3).  Hence

\[
 \boxed{\mu_{N,-}\leq q_x.}                            \tag{3.8}
\]

A proof that `q_x>q` would put one odd Rayleigh quotient above `q`; it would
not put the odd minimum above `q`.  The transverse Schur floor and its
inverse-weighted coupling remain necessary.

## 4. Strongest conditional minor supplied by the count

Still on the all-critical branch, choose `n` distinct positive ordinates
`gamma_1<...<gamma_n` separated by more than one and put

\[
 x_j=(\gamma_jL/(2\pi))^2.
\]

The odd evaluation matrix has

\[
 A_{jm}={2\sqrt{2/L}(2\pi m/L)\sin(\gamma_jL/2)
              \over\gamma_j^2-(2\pi m/L)^2}.           \tag{4.1}
\]

Its exact Cauchy determinant is

\[
 |\det A|=
 \left({\sqrt{2L}\over\pi}\right)^n n!
 {\prod_j|\sin(\gamma_jL/2)|
  \prod_{j<k}(x_k-x_j)
  \prod_{r<s}(s^2-r^2)
  \over\prod_{j,m}|x_j-m^2|}.                         \tag{4.2}
\]

Logarithmic averaging chooses an `L` in every fixed-length interval such
that the sine product is at least

\[
 2^{-n}\exp\left(-{\pi^2\over3H}
                         \sum_{j=1}^n\gamma_j^{-1}\right). \tag{4.3}
\]

Together with unit separation and `T<gamma_j<=2T`, this gives the explicit
lower bound (4.7) in `notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md`, and hence

\[
 \boxed{
 \mu_{n,-}\geq{2|\det A|^2\over(nL)^{n-1}}>0.}        \tag{4.4}
\]

This is the strongest current count-based full-Gram statement, but it is
conditional and the schedule is defined using the actual divisor.  On
`n=ceil(lambda*L^3)`, its schematic size is only

\[
 \mu_{n,-}\geq\exp\{-O(e^LL^7)\},                     \tag{4.5}
\]

whereas the proved state bound is

\[
 q_n=O\{\exp(-c e^{L/2}L^2)\}.                        \tag{4.6}
\]

The available upper envelope in (4.6) is vastly larger than the available
lower envelope in (4.5), so these inequalities do not compare the actual
quantities.  More generally, the **admitted anti-carrier construction**
retains an `n^2` determinant-product loss, schematically
`exp(-O(n^2 log(nL)))`, while the displayed analytic-strip projection term
has negative exponent linear in the physical bandwidth after its positive
complexity term is paid.  Merely changing the cutoff inside these proved
estimates does not close the comparison.  This is not an impossibility
claim for a sharper theorem using additional source information.

## 5. What finite-height verification gives unconditionally

Take

\[
 30610046000\leq T\leq H_{\rm PT}/2.                  \tag{5.1}
\]

The HSW extraction gives `K(T)` distinct one-separated ordinates in
`(T,2T]`, and PT makes those ordinates real evaluation nodes.  Thus, for
any fixed `n<=K(T)`, (4.2)--(4.4) give an unconditional positive lower
bound for the **truncated low-zero Gram** on an implicitly chosen
anti-carrier length.

Write the complete odd matrix as

\[
 Q_{N,-}=Q_{N,-}^{\leq H_{\rm PT}}
             +Q_{N,-}^{>H_{\rm PT}}.                  \tag{5.2}
\]

Only the first summand is certified positive.  The second is a Hermitian
signed zero pairing because its zeros are not known to be on the line.
Therefore one has only the perturbative inequality

\[
 \lambda_{\min}(Q_{N,-})
 \geq\lambda_{\min}(Q_{N,-}^{\leq H_{\rm PT}})
       -\|Q_{N,-}^{>H_{\rm PT}}\|.                    \tag{5.3}
\]

No pinned theorem bounds the second term below the determinant-scale first
term uniformly on a growing finite space.  It is invalid to discard the
high block in Loewner order.

Moreover, (1.2) contains only finitely many ordinates.  It can support only
a finite maximum rank.  Every direct-attack projection schedule requires a
growing physical bandwidth and hence `N->infinity`; a fixed finite-height
verification cannot furnish the required unbounded sequence of real rows.

## 6. Multiplicity and carrier stress tests

The following conventions are mandatory.

1. HSW counts algebraic multiplicity.  A zero of multiplicity `m` gives
   `m` identical value rows, equivalently one row weighted by `sqrt(m)`.
   It does not give the derivative jets of that row and does not increase
   rank.
2. Both ordinate signs are already retained.  In positive-height notation
   they give `Q_-=2G_-`.  In the full paired-slot notation they give
   `Q_-=(1/2)Z_-^*Z_-`.  Combining the two conventions would double count.
3. At an in-range carrier `gamma=2*pi*n/L`, the apparent singularity in
   (4.1) is removable: only column `n` survives, with value

   \[
   (-1)^n\sqrt{L/2}.                                   \tag{6.1}
   \]

   At an out-of-range carrier `gamma=2*pi*m/L`, `m>N`, the entire row is
   zero.
4. A multiplicity-aware count can be supported on one carrier lattice while
   satisfying the HSW envelope.  On lengths `L=kL_0`, `k>=2`, every column
   whose index is not divisible by `k` is then null.  Thus even the
   all-critical location statement plus the locked count does not force a
   positive odd frame on a preassigned infinite schedule.  MTY's edge
   zero-free statement adds no restriction to this all-critical logical
   model.

The lattice model is not the zeta divisor.  It proves only that the locked
theorem statements are structurally insufficient; detailed arithmetic
information about the actual divisor could be stronger.

## 7. Exact stopping point

No current source-pinned zero theorem plus the boundary-zero derivative
primitive proves (0.1) on an unbounded schedule without assuming the target
zero location.  A successful version of the combined route audited here
would first need an unconditional all-height mechanism that controls the
signed off-line contribution, or independently proves center-line
location.  It would then need either

1. a carrier-scale, multiplicity-aware lower frame for every direction in
   `H_0`, at a scale stronger than the state-specific numerator; or
2. a direct complete-form Schur proof, including the endpoint-relative
   estimate `|d|C_0=o(sqrt(Aq))` when (3.3) is used, a transverse floor, and
   the inverse-coupling bound.

The all-height item is already at the zero-location difficulty, the frame
alternative is not supplied by global counting, and the endpoint-relative
condition is not implied by absolute Gevrey decay.  Using the conditional
Gram as an unconditional lower frame would assume the theorem being sought.
