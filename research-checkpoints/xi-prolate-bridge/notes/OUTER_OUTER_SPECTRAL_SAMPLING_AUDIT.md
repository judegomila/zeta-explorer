# Spectral sampling audit for the physical outer--outer term

> **Superseded source/input status.**  Sections 5--6 below preserve the
> historical conditional derivation, including obsolete rounded HSW constants
> and the then-missing source-lock verdict.  They are nonbinding.  The exact
> piecewise HSW Theorem 1.1 overlap, pinned MTY/PT dependencies, completed
> low block, and admitted result are now in
> `OUTER_OUTER_SPECTRAL_THEOREM.md` and `ZERO_SAMPLING_SOURCE_LOCK.json`.
> No formula from the historical Sections 5--6 may replace those locks.

Status: conditional spectral-sampling reduction with **Required Lemma S now
proved as an admitted analytic component theorem**.  The complete constant
and proof are in `OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md`.  This note
still does not claim an `O--O` bound, a sector floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or a determinant limit: the external zero theorems and
the low-height/domain passage listed in Section 6 remain separate gates.

No zero is assumed real.  No zero list is read.  The possible external
inputs identified in Section 6 are unconditional published theorems, but one
of them uses a rigorous finite-height verification in its proof.  That
dependency must be source-locked and disclosed before this route can be
promoted.

## 1. Exact spectral reduction without positivity

Retain the corrected global radical state and the notation of
`OUTER_PROJECTION_RADICAL_REDUCTION.md`:

\[
 K=S E(\widetilde h_\lambda),\qquad X=CK,\qquad O=(1-C)K.
                                                               \tag{1.1}
\]

If `rho=beta+i gamma` is a nontrivial zero, write

\[
 s_\rho=\gamma+i(1/2-\beta).                                  \tag{1.2}
\]

No reality of `s_rho` is assumed.  The two Mellin evaluations of `K`
vanish, so at every zero parameter

\[
 \widehat O(s_\rho)=-\widehat X(s_\rho),\qquad
 \widehat O(\overline{s_\rho})
       =-\widehat X(\overline{s_\rho}).                       \tag{1.3}
\]

The compact BV transform of `X` is `O(1/|gamma|)` uniformly across the
closed critical strip.  Hence the polarized products in (1.3) are
`O(1/gamma^2)`, and the classical zero-counting estimate makes their sum
absolutely convergent.  Thus the signed `O--O` spectral pairing exists and,
term by term,

\[
 W_Z(O,O)=W_Z(X,X)=q_\lambda(X,X).                             \tag{1.4}
\]

Equation (1.4) uses neither positivity nor a list of zeros.  It also warns
that small unweighted `L2` norm of `O` alone is not enough: the desired
estimate is a sampling theorem for its Mellin transform inside the whole
critical strip.

For absolute upper bounds, the polarized summand is reduced by
`2|ab|<=|a|^2+|b|^2`.  Functional-equation and conjugation symmetry then
reduce the problem to a sampling sum of `|widehat O(s_rho)|^2`, still without
putting the zeros on the central line.

## 2. The exact missing physical-tail estimate

For `z=x+iy`, Mellin--Fourier duality gives

\[
 \widehat O(x+iy)=\mathcal F_-\{e^{yt}O(t)\}(x).             \tag{2.1}
\]

Put

\[
 \epsilon(y)=\frac12-|y|.                                    \tag{2.2}
\]

The source-tail lemma needed by this route is now a theorem.

**Lemma S (uniform weighted translation modulus).**  For the actual corrected
and reflected source state, every `lambda>=2`, every `|y|<1/2`, and every
`0<h<=1/2`,

\[
 \boxed{
 \|\tau_h(e^{y\cdot}O)-e^{y\cdot}O\|_2^2
 \leq D_S(\lambda)\,\epsilon(y)^{-1}
       h^{\epsilon(y)}d_4.}                                   \tag{2.3}
\]

Here, with `a_4=sqrt(3)/2^(11/4)`,

\[
\begin{aligned}
D_S(\lambda)={}&36864\pi^2a_4^2\lambda^3
 \left(32+256\pi\lambda^3
              +16384\sqrt{2\pi}\lambda^4\right)\\
&+8a_4^2\lambda C_b,                              \tag{2.4}
\end{aligned}
\]

and the fully elementary bump constant `C_b` is equation (1.8) of the
theorem note.  Thus `q=1`, and `D_S` has degree seven.  The proof includes:

1. both reflected physical tails;
2. the source-normalized labels `0/4` combination before absolute values;
3. the invisible codimension-two bump;
4. the hard window-boundary jump at `|t|=log(lambda)`; and
5. the complete exterior Volterra remainder, not only its leading endpoint
   sawtooth.

An `H1` assertion is neither needed nor true.  Formula (2.3) is a fractional
Besov estimate whose exponent shrinks with distance from the strip boundary.
The weighted `L2` norm is proved separately from the same component bounds;
it is not inferred from one translation difference.

## 3. Why the endpoint term has exactly the required exponent

For one prolate mode, the leading sampled exterior profile is

\[
 B_{0,h}(t)=\frac{h(\lambda)}{2\sqrt{\lambda}}e^{-t/2}
       P(\lambda^2e^t),\qquad
 P(u)=\frac12-\{u\},\quad t\geq0.                             \tag{3.1}
\]

For `0<epsilon<=1/2`, set

\[
 S_{A,\epsilon}(t)=1_{t\geq0}e^{-\epsilon t}P(Ae^t),
 \qquad A\geq4.                                               \tag{3.2}
\]

Splitting the `s=Ae^t` integral into unit intervals and putting
`eta=e^h-1` gives the binding estimate:

\[
 \boxed{
 \|\tau_hS_{A,\epsilon}-S_{A,\epsilon}\|_2^2
 \leq\frac{128}{\epsilon}A^\epsilon h^\epsilon,
 \qquad0<h\leq\frac12.}                                      \tag{3.3}
\]

Indeed, while `eta(r+1)<1`, the set on which the two sawteeth cross a jump
has length at most `eta(r+1)` and the off-jump difference is at most the
same quantity.  Its squared contribution on `[r,r+1)` is at most
`2 eta(r+1)`.  Above `r=1/eta`, use the bound one.  Summation against
`r^(-1-2epsilon)` gives

\[
 C\left(
  \eta\sum_{r<1/\eta}r^{-2\epsilon}
  +\sum_{r\geq1/\eta}r^{-1-2\epsilon}\right)
 \leq \frac{C}{\epsilon}\eta^\epsilon.                       \tag{3.4}
\]

The lower endpoint of the unit sum is `r` comparable to `A`.  Retaining it
shows that the two sums are bounded by a constant times
`epsilon^(-1)(A eta)^epsilon`; the factor `A^epsilon` is mandatory.  The
earlier version of this audit omitted it and is rejected.  In the physical
state, however, the exact shift to `t=+-log(lambda)` contributes
`lambda^(-2epsilon)` after squaring, while `A=lambda^2`; these factors cancel
exactly.  Together with

\[
 |h_{n,\lambda}(\lambda)|
 \leq16\pi\sqrt{\lambda d_n},                                \tag{3.5}
\]

it is defect-relative.  This exact cancellation is one of the two power
improvements used in the completed theorem.

## 4. Volterra remainder: completed constant collection

Equations (4.1)--(4.9) record the preliminary estimates.  The binding proof
in `OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md` retains the pointwise
minimum in (4.4), the exact boundary weight, and the separate near-edge
leakage norm until after interpolation.  Those three operations replace the
loose collection formerly made in this section.

Let `k=2*pi*lambda`, `A_h=|h(lambda)|/pi`, and

\[
 w(\xi)=\sqrt{\xi^2-\lambda^2}\,H(\xi)
       =\frac{h(\lambda)}\pi\sin(k\xi)+e(\xi).                \tag{4.1}
\]

The exterior ODE and the variation-of-constants formula already proved in
`OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` imply, for `xi>=2lambda`,

\[
 \left|H(\xi)-\frac{h(\lambda)}{\pi\xi}\sin(k\xi)\right|
 \leq\frac{4A_hk\lambda^2}{\xi^2},                           \tag{4.2}
\]

and direct differentiation of the same Volterra integral gives the safe
bound

\[
 \left|\frac d{d\xi}\left(
 H(\xi)-\frac{h(\lambda)}{\pi\xi}\sin(k\xi)\right)\right|
 \leq\frac{8A_hk^2\lambda^2}{\xi^2}.                         \tag{4.3}
\]

The derivative series obtained by inserting (4.3) is harmonic and is not
absolutely summable.  That is not fatal for translations.  If `u=lambda
exp(t)`, apply

\[
 |R(mue^h)-R(mu)|
 \leq\min\left\{
  \frac{8A_hk\lambda^2}{m^2u^2},
  \frac{8hA_hk^2\lambda^2}{mu}
 \right\}.                                                    \tag{4.4}
\]

Splitting at `m` comparable to `1/(hku)` gives

\[
 \sum_{m\geq1}|R(mue^h)-R(mu)|
 \leq 8hA_hk^2\lambda^2u^{-1}
       \left(2+\log_+\frac1{hku}\right),                     \tag{4.5}
\]

before the harmless square-root prefactor.  Squaring and integrating with
`e^(yt)`, first where `hku<1` and then where `hku>=1`, gives

\[
 \|\tau_h(e^{y\cdot}B_R)-e^{y\cdot}B_R\|_2^2
 \leq \frac{2^{18}A_h^2k^4\lambda^3}{\epsilon(y)}
       h^2(2+\log(1/h))^2 +J_\lambda^2h.                     \tag{4.6}
\]

Here `J_lambda` is the explicitly bounded value of the artificial join at
`t=log 2`; (4.2) gives

\[
 J_\lambda^2\leq2^{12}A_h^2k^2\lambda.                      \tag{4.7}
\]

For `0<epsilon<=1/2`,

\[
 h^2(2+\log(1/h))^2+h\leq32h^\epsilon,qquad0<h\leq1/2.     \tag{4.8}
\]

Thus (4.6) has the same exponent as (3.3), with only a polynomial loss in
`lambda` and `1/epsilon`.  The near-edge interval `lambda<=xi<=2lambda`
is controlled from

\[
 |H(\xi)|\leq|h(\lambda)|,qquad
 |H'(\xi)|\leq2\pi A_hk^2\lambda,                            \tag{4.9}
\]

the latter following by integrating
`((xi^2-lambda^2)H')'=-(k^2xi^2-mu)H` from the regular endpoint.  Its finite
piece contributes another polynomial multiple of `h`, hence of
`h^epsilon`.

Equations (4.2)--(4.9) show that the harmonic derivative loss can be repaired
by a translation split.  They justify the power bookkeeping

\[
 D_{\rm prolate}(\lambda)
 =36864\pi^2a_4^2\lambda^3
 \left(32+256\pi\lambda^3+16384\sqrt{2\pi}\lambda^4\right),
 \qquad q=1.                                                  \tag{4.10}
\]

Equation (4.10) is the exact prolate part of (2.4), after the two labels,
the source coefficient, all three profile pieces, and both reflected tails
are collected.  It is an admitted finite theorem constant.

The leading power in (4.10) is `lambda^7`, strictly below the qualitative
fixed-index comparison power eight in `d_8/d_4`.  This power improvement
does not itself prove an `O--O` Weil estimate or a sector floor.

The complete proof handles the conditionally differentiated but absolutely
summed Volterra series by the pointwise minimum in (4.4), charges both
artificial traces, and adds the fixed bump.  The bump audit evaluates

\[
 C_{\psi,3}^{\rm sum}
 =\|(x\psi(x))'''\|_1+\|\psi'''\|_1
 \leq4010688\sqrt e+3C_2,                                    \tag{4.11}
\]

by the elementary derivative calculation in Section 6 of the theorem note.
The producer and independent replay reconstruct that value and every
transcendental constant from the decimal source parameter.  Consequently
Lemma S is proved; only its later spectral use remains conditional here.

## 5. Dyadic sampling theorem conditional on Lemma S

This section is rigorous given (2.3).  For `T>=3`, put

\[
 \delta_T=\frac1{55.241(\log(2T))^{2/3}
                    (\log\log(2T))^{1/3}},\qquad
 r_T=\delta_T/4.                                               \tag{5.1}
\]

The explicit Vinogradov--Korobov region and functional-equation symmetry
put every zero with `T<=|gamma|<2T` at distance at least `delta_T` from both
strip boundaries.  The disk `D(s_rho,r_T)` therefore stays in the Mellin
strip, and every `y` in it satisfies

\[
 \epsilon(y)\geq3\delta_T/4.                                  \tag{5.2}
\]

Let

\[
 M(t)=\frac{t}{2\pi}\log\frac{t}{2\pi e},\qquad
 E(t)=0.1038\log t+0.2573\log\log t+9.3675.                   \tag{5.3}
\]

The explicit zero-count theorem `|N(t)-M(t)|<=E(t)`, `t>=e`, gives the
following deliberately loose disk-overlap bound:

\[
 Z(T)=1+\pi^{-1}\log(2T+1)+2E(2T+1).                         \tag{5.4}
\]

Indeed, a point lies in disks whose centers have ordinates in an interval
of length `2r_T<1`; apply (5.3) at the two endpoints and bound the main-term
difference by its derivative.  Multiplicity is included.

Submean and (5.4) give

\[
 \sum_{T\leq\gamma<2T}|\widehat O(s_\rho)|^2
 \leq\frac{Z(T)}{\pi r_T^2}
 \int_{|y|\leq1/2-3\delta_T/4}\int_{T-r_T}^{2T+r_T}
       |\widehat O(x+iy)|^2\,dx\,dy.                          \tag{5.5}
\]

Set `h=1/(2T)`.  On the `x` interval in (5.5),
`|exp(ihx)-1|^2>=1/10`.  Plancherel and Lemma S therefore imply

\[
 \int_{T-r_T}^{2T+r_T}|\widehat O(x+iy)|^2dx
 \leq20\pi D(\lambda)
       \left(\frac4{3\delta_T}\right)^q
       (2T)^{-3\delta_T/4}d_4.                                \tag{5.6}
\]

Combining (5.5)--(5.6), and allowing a factor four for the negative-height
block and the polarized product, gives the fully specified conditional bound

\[
 \boxed{
 |W_Z^{|\gamma|\geq3}(O,O)|
 \leq1280D(\lambda)d_4
 \sum_{j\geq0}Z(T_j)
   \left(\frac43\right)^q
   \delta_{T_j}^{-(q+2)}
   (2T_j)^{-3\delta_{T_j}/4},\quad T_j=3\,2^j.}               \tag{5.7}
\]

The series in (5.7) converges.  Its exponential factor is

\[
 \exp\left[-\frac{3}{4\cdot55.241}
   \frac{(\log(2T))^{1/3}}{(\log\log(2T))^{1/3}}\right],     \tag{5.8}
\]

while `Z(T)` and every inverse power of `delta_T` are polynomial in
`log T`.  On `T_j=3*2^j`, (5.8) is a stretched exponential in `j^(1/3)`
and dominates those polynomial factors.

After adding the finite `|gamma|<3` block discussed in Section 6, Lemma S
would prove, for the actual corrected combined state,

\[
 \boxed{|W_Z(O,O)|\leq C_{\rm samp}D(\lambda)d_4}             \tag{5.9}
\]

with `C_samp` the explicit positive series in (5.7).  This bounds the signed
`O--O` pairing itself, not merely a leading endpoint model or a truncated
zero tail.  It still supplies no sign.

## 6. Source-lock audit and present verdict

Two primary sources would have to be vendored and hashed before (5.7) could
be binding:

1. Mossinghoff--Trudgian--Yang, *Explicit zero-free regions for the Riemann
   zeta-function*, arXiv:2212.06867, Theorem 1.1: the constant `55.241` for
   all `|t|>=3`.
2. Hasanalizade--Shen--Wong, *Counting zeros of the Riemann zeta function*,
   arXiv:2107.06506, Corollary 1.2: (5.3) for `t>=e`.

The all-height proof of the first theorem explicitly invokes the rigorous
Platt--Trudgian verification through height `3*10^12` on its low range.  It
is an unconditional published theorem, not an assumed list supplied to this
project, but the computational dependency must be disclosed exactly.  This
is analogous in kind to the already disclosed finite-verification dependency
inside the pinned FKS prime-number-theorem bound.  If project policy rejects
that dependency for this route, one must instead pin a noncomputational
high-height Vinogradov--Korobov theorem plus a separate explicit analytic
low-height strip margin; no such replacement is locked here.

There is also a low block `|gamma|<3`.  A binding proof may use the same
published rigorous finite-height theorem to put any such zeros on the center
line and then apply a single submean/weighted-`L2` estimate.  It must not read
or assume a decimal zero list.

**Verdict.**  The proposed dyadic mechanism is not killed by the shrinking
zero-free region: its factor is summable, exactly as (5.8) shows.  Lemma S is
now proved with `q=1` and the explicit degree-seven constant (2.4), including
the complete Volterra joins and evaluated bump constant.  Promotion to an
`O--O` Weil theorem still requires binding source locks for the two zero
theorems, a compliant low-height treatment, and the explicit domain passage
identifying the sampled spectral sum with the hard-endpoint explicit-form
pairing.  Until all of those are supplied, no `O--O` bound is claimed.
