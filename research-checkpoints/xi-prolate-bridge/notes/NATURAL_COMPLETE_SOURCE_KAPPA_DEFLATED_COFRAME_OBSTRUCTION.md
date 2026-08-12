# Natural complete-source kappa-deflated coframe obstruction

## 0. Exact outcome and claim boundary

Use the natural odd-halfgrid schedule

\[
 \lambda_p={p\over2},\qquad L_p=2\log\lambda_p,
 \qquad N_p={p+3\over2}=\lambda_p+{3\over2}.       \tag{0.1}
\]

Let `Q_(p,+)` be the actual complete inversion-even source matrix, let
`kappa_p` be its unit projected-prolate anchor, and put

\[
 q_p=\langle\kappa_p,Q_{p,+}\kappa_p\rangle,
 \qquad K_p=\kappa_p^\perp,
 \qquad
 H_{q,p}=P_{K_p}(Q_{p,+}-q_pI)P_{K_p}\big|_{K_p}. \tag{0.2}
\]

This note proves one unconditional identity and one RH-diagnostic upper
obstruction.

1. In the exact complete-source normal form the source-independent scalar
   cancels from `H_(q,p)`.  The centered gate is precisely one signed,
   relative discrepancy inequality between the anchor and its orthogonal
   complement.  No admitted unconditional estimate gives that inequality
   a positive sign.
2. Assume RH only for the diagnostic zero-Gram calculation.  For every
   anchor, a two-dimensional rational-residue family contains a nonzero
   vector in `K_p` which annihilates the first `floor(theta*N_p)` distinct
   positive zero rows and is flat to growing order at both physical
   endpoints.  Riemann--von Mangoldt counting and a multiplicity-safe tail
   sum give

\[
 \boxed{
 \lambda_{\min}\!\left(
 P_{K_p}Q_{p,+}P_{K_p}\big|_{K_p}\right)
 \leq
 \exp\{-(c_{\rm flat,*}-o(1))N_p\},
 \qquad
 c_{\rm flat,*}=0.4087565479\ldots .}             \tag{0.3}
\]

Thus the complete zero set does not supply a generic coframe at the
currently proved `exp(-c*N/L)` quasimode scale.  If one additionally had a
two-sided positive scale `q_p>=exp(-C*N_p/L_p)`, then (0.3) would make the
centered gate fail eventually.  The frozen theorem proves only the
one-sided bound

\[
 |q_p|=O\!\left(\exp[-cN_p/L_p]\right),            \tag{0.4}
\]

so no failure follows: on the RH branch `q_p>=0`, and it may be much smaller
than the available upper envelope.  The surviving target is the direct
relative inequality

\[
 \lambda_{\min}\!\left(
 P_{K_p}Q_{p,+}P_{K_p}\big|_{K_p}\right)>q_p,       \tag{0.5}
\]

not an absolute Paley--Wiener or de Branges sampling bound.

Off RH, the complete centered-zero factorization has a genuine Krein
signature `(1,1)` for every off-line quartet.  The critical-line squares
are therefore not a positive subform of the complete source in Loewner
order.  No RH-free zero-Gram lower bound is inferred.

This is a separate post-checkpoint-1.59 theorem/barrier pair.  It proves no
actual centered gate, no finite-good index, no determinant convergence, no
zero theorem, no Riemann hypothesis, no converse, and no de Bruijn--Newman
bound.  It changes none of the standard eight and leaves the formal state
`P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three repository theorem/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md` | `ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450` |
| `tests/test_natural_cutoff_signed_ground_alignment.py` | `3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb` |
| `notes/UNCONDITIONAL_NATURAL_HALFGRID_HSW_SCALAR_TO_EVEN_FRAME_BARRIER.md` | `4d6036eb24abed92857cca6a169613827e479834eeb980868d09e57207629613` |
| `tests/test_unconditional_natural_halfgrid_hsw_scalar_to_even_frame_barrier.py` | `5545846473c70c25003f23c3cbd9cc317414d39093bbc92a31133261a5d9d237` |
| `notes/NATURAL_GEVREY_QUASIMODE_TEMPLE_ORIENTATION_BARRIER.md` | `c5cabe812995379a9e93fb32bb4ea648d97cbc52c7494d794ef1146cccc4b5c6` |
| `tests/test_natural_gevrey_quasimode_temple_orientation_barrier.py` | `1ce65c5ebd600120f65665cb650dec029f479fc7e95310b408570688e689c212` |

The first pair supplies the exact complete signed source normal form and
the projected-prolate anchor conventions.  The second supplies the natural
schedule, the exact RH-conditional zero-evaluation rows, the
multiplicity-aware count, and the off-line Krein block.  The third supplies
the one-sided estimate (0.4).  The rational-residue construction, its
deflation by `kappa`, and the optimized tail bound are proved directly
below.  No zero table, simplicity hypothesis, pair-correlation conjecture,
external sampling theorem, or numerical source matrix is imported.

## 2. Exact centered cancellation and the minimal signed source inequality

Suppress `p`.  The frozen complete-source identity is

\[
 Q_+=c_*I+H_D,
 \qquad
 H_D=A_{\rm tail}-T_D,                              \tag{2.1}
\]

where

\[
 c_*=\psi(1/4)-\log\pi+4,
 \qquad
 T_D=\int_{[0,L]}K_t\,dD_\lambda(t).              \tag{2.2}
\]

Here `A_tail` is the positive zero-extension Dirichlet form for the exact
Archimedean tail, `K_t` is reflected two-sided translation, and
`D_lambda` is the signed weighted-PNT discrepancy.  Define, for a unit
finite Fourier vector `f`,

\[
 \mathfrak h_\lambda(f)
 =\langle f,H_Df\rangle
 =\mathfrak a_{\rm tail}(f,f)
  -\int_{[0,L]}\langle f,K_tf\rangle\,dD_\lambda(t).
                                                               \tag{2.3}
\]

Since `q=<kappa,Q_+ kappa>` and both `kappa` and `v` are unit, for every
`v in K=kappa^perp` one has the exact cancellation

\[
 \boxed{
 \langle v,H_qv\rangle
 =\mathfrak h_\lambda(v)-\mathfrak h_\lambda(\kappa).} \tag{2.4}
\]

In particular, the source scalar in (2.1) cannot provide a reserve.  The
centered gate is equivalent to

\[
 \boxed{
 H_q\succ0
 \quad\Longleftrightarrow\quad
 \inf_{\substack{v\perp\kappa\\\|v\|=1}}
 \left\{
 \mathfrak a_{\rm tail}(v,v)
 -\int_{[0,L]}\langle v,K_tv\rangle\,dD_\lambda(t)
 \right\}
 >
 \mathfrak a_{\rm tail}(\kappa,\kappa)
 -\int_{[0,L]}\langle\kappa,K_t\kappa\rangle
       \,dD_\lambda(t).}                           \tag{2.5}
\]

This is the minimal RH-free signed source theorem.  Bounds on the total
variation of `D_lambda`, on separate pole, Archimedean, and prime norms, or
on `|q|` do not compare the two sides of (2.5).  Replacing the discrepancy
by zero satisfies every magnitude upper envelope but does not establish
either side of (2.5).  That comparison is not an alternate arithmetic
source and proves no failure for the actual primes.

## 3. RH-diagnostic complete zero Gram and low-height rank deficits

Assume RH in Sections 3--7 only.  In the centered even basis put

\[
 a_n={2\pi n\over L},qquad
 e_n^+(x)=\sqrt{2/L}(-1)^n\cos(a_nx),quad1\leq n\leq N.
                                                               \tag{3.1}
\]

The positive-index part of the evaluation row is

\[
 \boxed{
 b_N(t)_n={2\sqrt{2/L}\,t\sin(Lt/2)\over t^2-a_n^2},
 \qquad1\leq n\leq N,}                            \tag{3.2}
\]

with the whole quotient interpreted continuously at every carrier
`t=a_n`.  On RH, and only on RH, the complete even source is the positive
zero-evaluation Gram

\[
 \boxed{
 \langle f,Q_+f\rangle
 =2\sum_{\gamma>0}m_\gamma|\widehat f(\gamma)|^2.} \tag{3.3}
\]

Repeated algebraic occurrences multiply one row weight; they do not create
derivative jets or independent rows.

Let

\[
 \Omega_N={2\pi N\over L}.                         \tag{3.4}
\]

The positive zero count with algebraic multiplicity satisfies, for fixed
`c>0`,

\[
 \boxed{
 \mathcal N(c\Omega_N)
 ={cN\over2}
 -{cN(\log L+1-\log c)\over L}+O_c(L).}           \tag{3.5}
\]

Consequently

\[
 \operatorname {rank}G_{(0,\Omega_N]}
 \leq\mathcal N(\Omega_N)<N,
 \qquad
 \operatorname {rank}G_{(0,2\Omega_N]}
 \leq\mathcal N(2\Omega_N)<N                     \tag{3.6}
\]

eventually.  Thus neither all rows through the carrier edge nor all rows
through twice that edge can frame the `N`-dimensional space `K`.  A fixed
`c>2` eventually passes this necessary occurrence-count threshold, but it
proves neither distinctness, phase separation, nor a smallest singular
value.

## 4. A two-dimensional rational-residue family

Fix

\[
 {1\over2}<\theta<1,
 \qquad M=\lfloor\theta N\rfloor,                 \tag{4.1}
\]

and list the first `M` distinct positive ordinates as
`gamma_1^#,...,gamma_M^#`.  Define

\[
 D_N(y)=\prod_{n=1}^N(y-a_n^2),
 \qquad
 P_M(y)=\prod_{j=1}^M(y-(\gamma_j^\#)^2).         \tag{4.2}
\]

For a polynomial `R(y)=u+vy` of degree at most one, put

\[
 x_n(R)={P_M(a_n^2)R(a_n^2)\over D_N'(a_n^2)},
 \qquad1\leq n\leq N.                             \tag{4.3}
\]

Because `M+1<N` eventually, partial fractions give

\[
 \boxed{
 {P_M(y)R(y)\over D_N(y)}
 =\sum_{n=1}^N{x_n(R)\over y-a_n^2}.}             \tag{4.4}
\]

The map `R mapsto x(R)` is injective: if all residues vanished, the
nonzero polynomial `P_M R`, of degree at most `M+1<N`, would vanish at all
`N` distinct nodes `a_n^2`.  Hence

\[
 \mathcal S_N=\left\{
 h_R=\sum_{n=1}^Nx_n(R)e_n^+:\deg R\leq1
 \right\}                                         \tag{4.5}
\]

is a two-dimensional complex subspace.

Every member of `S_N` annihilates the first `M` distinct zero rows.  At a
noncarrier, this follows from (3.2) and (4.4).  If
`gamma_j^#=a_k` with `k<=N`, then (4.3) gives `x_k(R)=0`, while the
continuous carrier row is supported on coordinate `k`.  If `k>N`, the
retained row is zero.  Therefore

\[
 \boxed{
 \widehat h_R(\gamma_j^\#)=0,
 \qquad1\leq j\leq M.}                            \tag{4.6}
\]

Multiplicity repeats these vanished value rows.  It never supplies a
missing derivative condition.

The functional `h mapsto <kappa,h>` has a nonzero kernel on the
two-dimensional space `S_N`.  Choose and normalize

\[
 0\ne h_N^\perp\in\mathcal S_N\cap\kappa^\perp,
 \qquad \|h_N^\perp\|_2=1.                       \tag{4.7}
\]

This is the exact deflation which is absent from an ordinary all-zero
count.

## 5. Endpoint flatness and the high-zero tail

Put

\[
 s=N-M-2.                                         \tag{5.1}
\]

Expansion of (4.4) at projective infinity gives

\[
 \boxed{
 \sum_{n=1}^Nx_n(R)a_n^{2k}=0,
 \qquad0\leq k\leq s-1.}                         \tag{5.2}
\]

All odd derivatives of the even basis vanish at both endpoints, while its
even endpoint derivatives are common nonzero factors times `a_n^(2k)`.
Consequently

\[
 (h_N^\perp)^{(j)}(\mathord\pm L/2)=0,
 \qquad0\leq j\leq2s-1.                          \tag{5.3}
\]

Integrating the compact Fourier transform by parts `2s` times and using
the exact Bernstein bound at bandwidth `Omega_N` yields

\[
 \boxed{
 |\widehat h_N^\perp(t)|
 \leq\sqrt L\left({\Omega_N\over|t|}\right)^{2s}.} \tag{5.4}
\]

Thus the high-zero tail is the weakest part of the complete sampling
system for this vector.  Adding arbitrarily many higher rows does not
repair their high-order endpoint suppression.

## 6. Riemann--von Mangoldt and the optimized upper obstruction

Let

\[
 T_{\varepsilon,N}=(4\pi\theta-\varepsilon){N\over L},
 \qquad0<\varepsilon<2\pi(2\theta-1).             \tag{6.1}
\]

The multiplicity-aware Riemann--von Mangoldt estimate and
`log N=L/2+o(1)` give

\[
 {\mathcal N(T_{\varepsilon,N})\over N}
 \leq\theta-\frac{\varepsilon}{4\pi}+o(1)
 <{M\over N}                                      \tag{6.2}
\]

eventually.  Since `M` distinct ordinates require at least `M` algebraic
occurrences,

\[
 \boxed{
 \gamma_M^\#>T_{\varepsilon,N},
 \qquad
 {\Omega_N\over\gamma_M^\#}
 \leq {2\pi\over4\pi\theta-\varepsilon}.}       \tag{6.3}
\]

This direction is safe under arbitrary multiplicity.

For every real `p>=2`, the count upper bound
`mathcal N(T)=O(T log T)` and Stieltjes partial summation give

\[
 \sum_{\gamma>T}m_\gamma\gamma^{-p}
 \ll T^{1-p}\log T,                               \tag{6.4}
\]

with a constant uniform for `p>=2` once the fixed starting height is
passed.  For `p>=2`, the right side of (6.4) is decreasing in `T` past a
fixed height.  Take `p=4s`.  Equations (3.3), (4.6), (5.4), and (6.3) imply

\[
 \begin{aligned}
 \langle h_N^\perp,Q_+h_N^\perp\rangle
 &\ll L\Omega_N^{4s}
       \sum_{\gamma>\gamma_M^\#}m_\gamma\gamma^{-4s}\\
 &\ll L T_{\varepsilon,N}\log T_{\varepsilon,N}
       \left({\Omega_N\over T_{\varepsilon,N}}\right)^{4s}.
 \end{aligned}                                    \tag{6.5}
\]

The polynomial factor is `exp(o(N))`, while `s/N=1-theta+o(1)`.  Letting
`epsilon` decrease to zero gives

\[
 \limsup_{N\longrightarrow\infty}{1\over N}
 \log\lambda_{\min}\!\left(
 P_KQ_+P_K\big|_K\right)
 \leq-c_{\rm flat}(\theta),
 \qquad
 c_{\rm flat}(\theta)=4(1-\theta)\log(2\theta).  \tag{6.6}
\]

Here `log 0=-infinity`; no qualitative injectivity claim is needed for
this upper obstruction.

The unique optimizer satisfies

\[
 \theta_*={1\over W(2e)}=0.7273666088\ldots,
 \qquad
 \boxed{
 c_{\rm flat,*}
 =4(1-\theta_*)\log(2\theta_*)
 =0.4087565479\ldots .}                           \tag{6.7}
\]

This proves (0.3).  It is an upper bound for the true coframe floor, not a
lower bound and not an asymptotic formula.  It uses the actual zero rows on
the RH diagnostic branch; it is not a count-compatible synthetic divisor.

## 7. Comparison with the current anchor scale

On RH, (3.3) gives `q>=0` and

\[
 H_q\succ0
 \quad\Longleftrightarrow\quad
 \lambda_{\min}\!\left(P_KQ_+P_K\big|_K\right)>q. \tag{7.1}
\]

For every fixed `C>0`, natural `N asymptotic to lambda` gives

\[
 \exp(-c_{\rm flat,*}N)
 =o\!\left(\exp[-CN/L]\right).                   \tag{7.2}
\]

Therefore an additional lower bound

\[
 q\geq\exp[-CN/L]                                 \tag{7.3}
\]

would combine with (0.3) to disprove the centered gate eventually.  No
such lower bound is frozen.  The proved statement (0.4) has the opposite
direction and permits `q` to lie below the endpoint-flat scale.  One must
not convert the `O`-upper bound in (0.4) into the two-sided estimate (7.3).

The exact surviving RH-branch theorem is the relative deflated frame

\[
 \boxed{
 \inf_{\substack{v\perp\kappa\\\|v\|=1}}
 2\sum_{\gamma>0}m_\gamma|\widehat v(\gamma)|^2
 >
 2\sum_{\gamma>0}m_\gamma|\widehat\kappa(\gamma)|^2.} \tag{7.4}
\]

The right side is `q`.  Any proof of (7.4) must resolve the actual relative
orientation at an `exp(-Theta(N))` scale or smaller.  A generic coframe
lower bound of order `exp(-C*N/L)` is ruled out by (0.3).

## 8. Paley--Wiener, de Branges, and high-tail stopping lines

Zero density may give qualitative uniqueness for a fixed compact
Paley--Wiener transform after enough distinct noncarrier rows are supplied.
Uniqueness is not a sampling constant.  Near height `Omega_N`, the average
zero spacing is of carrier-mesh order, while the admitted count has errors,
multiplicities, and near-collisions far too large to control the smallest
Cauchy singular value.  Pair correlation would still be an average
statement rather than the deterministic deflated frame (7.4).

A classical de Branges sampling formula, when available under additional
strictness hypotheses, uses its own reproducing-kernel or derivative
weights.  Multiple Xi zeros require jets, whereas (3.3) repeats ordinary
value rows.  No frozen theorem compares the de Branges norm and weights
with the Euclidean Fourier norm and the raw multiplicity weights in (3.3).

Most decisively, Sections 4--6 build an actual `kappa`-deflated vector for
which every row below `gamma_M^#` vanishes and every higher row is suppressed
by endpoint flatness.  Hence passing to ever higher zeros cannot yield the
missing relative lower bound.

## 9. Off-RH Krein obstruction

Do not assume RH.  For a centered off-axis zero `z=beta+i*gamma` with
`beta!=0`, write

\[
 A_f(z)=\int_{-L/2}^{L/2}f(x)e^{-zx}\,dx.          \tag{9.1}
\]

A critical-axis orbit contributes a positive square.  In contrast, an
off-line quartet contributes on the even sector

\[
 \boxed{
 m_z\left\{|A_f(z)+A_f(\overline z)|^2
          -|A_f(z)-A_f(\overline z)|^2\right\}.}  \tag{9.2}
\]

The two channels are independent and (9.2) has signature `(1,1)`.  Thus
known critical-line zeros, HSW-positive shells, or any standalone on-line
Gram are not positive subforms of the complete source.  There is no
unconditional Loewner comparison from the complete source to (3.3).

A positive-Hamiltonian or de Branges factorization valid for the whole
compact test space would be an RH-strength theorem.  This note does not
claim that one finite `kappa`-deflated compression is equivalent to RH, nor
does it infer failure of a finite compression from one hypothetical
quartet.  The RH-free route remains exactly the signed physical inequality
(2.5).

## 10. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. uses the positive zero Gram (3.3) without explicitly assuming RH;
2. treats algebraic multiplicity as independent rows or derivative jets;
3. infers a frame from the occurrence count at `c>2`;
4. deletes a carrier row instead of taking its continuous value;
5. reverses the coframe upper bound (0.3) into a lower bound;
6. turns the one-sided estimate (0.4) into (7.3), or claims gate failure
   without an additional positive lower bound for `q`;
7. claims that Paley--Wiener uniqueness or a de Branges norm proves (7.4);
8. treats critical-line squares as a Loewner subform off RH;
9. infers unconditional positivity from separate absolute source bounds;
10. claims that a finite centered gate is equivalent to RH; or
11. claims an actual centered gate, finite-good index, determinant limit,
    zero theorem, RH, converse, or de Bruijn--Newman bound.

The proved unconditional content is the cancellation (2.4) and the exact
signed target (2.5).  The proved RH-diagnostic content is the rank deficit,
the explicit `kappa`-deflated witness, and the coframe upper obstruction
(0.3).  No positive complete-source coframe is proved, and the formal state
remains `P0_INVALIDATED`.
