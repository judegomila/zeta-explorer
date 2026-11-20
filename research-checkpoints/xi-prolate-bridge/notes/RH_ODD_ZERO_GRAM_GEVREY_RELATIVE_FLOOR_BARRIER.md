# RH odd zero-Gram Gevrey relative-floor barrier

## 0. Exact outcome and claim boundary

Let `lambda` tend to infinity and put

\[
 L=2\log\lambda,
 \qquad N=\lceil\lambda L^3\rceil .                  \tag{0.1}
\]

On the branch where every nontrivial zero is on the critical line, the
finite odd block is the positive value Gram

\[
 Q_{N,-}=2\sum_{\gamma>0}m_\gamma
                   |a_N(\gamma)\rangle\langle a_N(\gamma)|,
 \qquad \mu_{N,-}=\lambda_{\min}(Q_{N,-}),            \tag{0.2}
\]

and the even projected-state value satisfies

\[
 q_N={U_Z\over2}=O\!\left(e^{-c_+\lambda L^2}\right). \tag{0.3}
\]

The exact odd zero Gram and the currently frozen zero information do not
prove `q_N<mu_(N,-)`.  Two independent facts make the stopping point sharp.

First, if `K_infinity` is the limiting even source radical, then

\[
 J_\infty=K_\infty',\qquad
 \widehat J_\infty(z)={iz\,\Xi(z)\over4}              \tag{0.4}
\]

is a nonzero odd global zero-evaluation radical.  Its normalized projection
into the same odd polynomial space has Rayleigh value

\[
 r_N^-=O\!\left(e^{-c_-\lambda L^2}\right),
 \qquad \boxed{\mu_{N,-}\leq r_N^-.}                 \tag{0.5}
\]

Thus the odd floor itself has a quasi-null at the same Gevrey exponential
class as the upper bound for `q_N`.  The positive constants `c_+` and `c_-`
are unrelated and non-effective.  The two upper bounds give no ordering.
The necessary scalar inequality `q_N<r_N^-` is not proved, and even that
single-direction inequality would not be a lower frame for every odd
vector.

Second, the pinned multiplicity count, its coarse linearly large distinct
subset, critical-line location, and any prescribed HSW-compatible finite
collection of critical ordinates are compatible with a fixed zero multiset
whose odd value Gram is singular on the unbounded polynomial schedule

\[
 L_k=kL_0,\qquad \lambda_k=e^{L_k/2},\qquad
 N_k=\lceil\lambda_kL_k^3\rceil .                     \tag{0.6}
\]

In particular the finite collection may contain one simple ordinate in
`(13,15)`.  This preserves the zero-existence consequence of the frozen
sign certificate while showing that no argument from those divisor facts
alone can yield the strict shifted odd sign.  The multiset is a logical
countermodel to the frozen implications, not the zeta divisor.

The sharp missing input is an actual, source-specific lower sampling
theorem at the relative scale of `q_N`, or a cancellation-preserving direct
proof of `Q_(N,-)-q_N I>0`.  No such theorem, actual shifted sign, response
bound, determinant convergence, RH proof or converse, or Lambda bound is
proved here.  The formal state remains `P0_INVALIDATED`; the standard eight
are unchanged.

## 1. Frozen inputs

Only the following eight frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` | `384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c` |
| `tests/test_gevrey_prolate_remainder.py` | `93dd3e8053c5d363264479c93457a88898cea11d65994b80b3df6b58ebcdd058` |
| `notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md` | `0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3` |
| `tests/test_odd_zero_gram_lower_frame_audit.py` | `b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467` |
| `notes/ANTI_CARRIER_LOG_SCHEDULE_AUDIT.md` | `ceb3e7067ed9ef9f02f443b665a83f778500630ded912e60df128abc8c17514a` |
| `tests/test_anti_carrier_log_schedule.py` | `304175ece40e36ae979dffa44c43009d1b796be2d72a820d7021758a34472a1b` |
| `notes/DERIVATIVE_RADICAL_ODD_SPLIT.md` | `abac446060d19ccd8ced9e4fb3aef3aedfa643d14494556b661cfba79bfbad95` |
| `tests/test_derivative_radical_odd_split.py` | `507728a8391d06135e62a48f7cabd9db73874049965c5e37631c563ec8815b44` |

The Gevrey pair supplies (0.3) and the analytic-strip projection machinery.
The odd-Gram and anti-carrier pairs supply the exact evaluation rows, the
Cauchy minor, the multiplicity-safe distinct extraction, and the pinned
count-compatible carrier model.  The derivative-radical pair supplies the
exact boundary-zero derivative transport.  No zero list, external source,
source lock, numerical artifact, or standard-eight edit is added.

## 2. Exact RH zero Gram and the available minor

Put `alpha=2*pi/L`.  In the normalized odd basis

\[
 e_n^-={V_n-V_{-n}\over\sqrt2},\qquad1\leq n\leq N.   \tag{2.0}
\]

the positive-height evaluation row is

\[
 a_N(\gamma)_n=
 {2\sqrt{2/L}\,\alpha n\sin(L\gamma/2)
       \over\gamma^2-\alpha^2n^2}.                    \tag{2.1}
\]

Carrier values are taken continuously.  An in-band carrier
`gamma=alpha*m`, `1<=m<=N`, gives a one-coordinate row; an out-of-band
carrier gives the zero row.  On RH, reflected negative ordinates supply the
factor two in (0.2).  Repeated algebraic occurrences repeat the same value
row and increase weight, not rank.

For any `N` distinct positive ordinates `Gamma={gamma_1,...,gamma_N}`, put

\[
 x_j=(\gamma_j/\alpha)^2.                              \tag{2.1a}
\]

and let `A_Gamma` have rows (2.1).  The exact Cauchy formula is

\[
\boxed{
 |\det A_\Gamma|
 =\left({\sqrt{2L}\over\pi}\right)^N N!
 {\displaystyle
   \prod_j|\sin(\pi\sqrt{x_j})|
   \prod_{j<k}|x_k-x_j|
   \prod_{n<m}(m^2-n^2)
  \over\displaystyle
   \prod_j\prod_n|x_j-n^2|}.}                         \tag{2.2}
\]

Since `||A_Gamma||_F^2<=NL`, min--max gives

\[
 \boxed{
 \mu_{N,-}\geq
 {2|\det A_\Gamma|^2\over(NL)^{N-1}}.}               \tag{2.3}
\]

The frozen count plus logarithmic phase averaging produces an implicit
anti-carrier schedule with a positive determinant, but its proved size is
only

\[
 \mu_{N,-}\geq
 \exp\{-O(N^2\log(NL))\}
 =\exp\{-O(\lambda^2L^7)\}.                           \tag{2.4}
\]

On (0.1), `N/L=lambda*L^2+O(1/L)`, so the exponent in (0.3) is
asymptotic to `N/L`.
Consequently

\[
 {\lambda^2L^7\over\lambda L^2}=\lambda L^5
 \longrightarrow+\infty.                             \tag{2.5}
\]

The available lower bound (2.4) is therefore vastly smaller than the
available upper bound (0.3).  A lower bound by a smaller number and an
upper bound by a larger number do not compare the actual quantities.
Cauchy--Binet cannot repair the missing conditioning without new
source-specific information about the full family of minors.

## 3. The projected `z Xi` odd quasi-null

The limiting source function is even, nonzero, and satisfies

\[
 \widehat K_\infty(z)={\Xi(z)\over4}.                 \tag{3.1}
\]

With the Fourier convention `exp(-izx)`, differentiation gives

\[
 J_\infty=K_\infty',\qquad
 \widehat J_\infty(z)={iz\Xi(z)\over4}.              \tag{3.2}
\]

The source representation of `K_infinity` is `E(g_0)(e^x)`.  The exact
operator `L=1/2+y*d/dy` gives

\[
 J_\infty={\cal E}({\cal L}g_0)(e^x).                \tag{3.3}
\]

Because `g_0(0)=0` and `integral(g_0)=0`, also
`(L g_0)(0)=integral(L g_0)=0`.  Thus (3.2) is an exact two-slot global
zero-evaluation radical, without assuming RH.  It is odd and
`||J_infinity||_2>0`.

The unitary additive Fourier transform and the dilation generator satisfy
`Fourier L=-L Fourier`.  Since `g_0` is a finite Fourier-invariant Hermite
combination, `L g_0` is a finite Fourier-anti-invariant Hermite combination.
The complexified Poisson reflection used below therefore has odd rather
than even parity, with the same absolute strip majorant.

Let `C_lambda` restrict to `[-L/2,L/2]` and let `P_N^-` be the odd centered
Fourier projection.  Define

\[
 z_N=P_N^-C_\lambda J_\infty,\qquad
 v_N={z_N\over\|z_N\|_2}.                             \tag{3.4}
\]

The fixed-source version of the analytic-strip argument in the Gevrey
theorem applies to `L g_0` with the odd Poisson parity.  The sign in the
complexified reflection changes, but its absolute strip bound does not.
The endpoint tail is `O(exp(-c*lambda^2))`, whereas

\[
 \Omega_N={2\pi(N+1)\over L}\asymp\lambda L^2.       \tag{3.4a}
\]

On the critical-line branch, define the repository two-slot sampling
seminorm for a real odd state by

\[
 \|f\|_{\mathfrak Z}^2
 :=4\sum_{\gamma>0}m_\gamma|\widehat f(\gamma)|^2,
 \qquad
 \langle f,Q_{N,-}f\rangle={1\over2}\|f\|_{\mathfrak Z}^2.
                                                               \tag{3.4b}
\]

Thus the factor `1/2` below is fixed by (0.2), rather than hidden in a
norm convention.

The same compact-BV sampling conversion therefore gives constants
`c_-,C_->0` such that

\[
 \|z_N\|_2\longrightarrow\|J_\infty\|_2,
 \qquad
 \|J_\infty-z_N\|_{\mathfrak Z}^2
 \leq C_-e^{-c_-\lambda L^2}.                         \tag{3.5}
\]

The constants inherit the non-effective starting threshold of the frozen
prolate/Gevrey inputs.  No effective finite certification is claimed.

At every zero parameter the samples of `z_N` are the negatives of the
samples of `J_infinity-z_N`.  Hence the exact radical-leakage identity and,
on RH, positivity of the value Gram give

\[
 \begin{aligned}
 r_N^-&:=\langle v_N,Q_{N,-}v_N\rangle\\
 &= {\|J_\infty-z_N\|_{\mathfrak Z}^2
        \over2\|z_N\|_2^2}
 \leq C e^{-c_-\lambda L^2},
 \end{aligned}
                                                               \tag{3.6}
\]

where the displayed factor `1/2` uses the repository paired-slot
normalization.  Equivalently, in the positive-height convention of (0.2),
the reflected ordinate supplies its factor two and gives the same scalar.
Min--max proves (0.5).

The actual finite derivative `x=Dp`, where `p` is the projected even state,
has the endpoint-corrected identity

\[
 \widehat x(z)={Lz\over2\pi}
 \{\widehat p(z)-d\widehat e_0(z)\},
 \qquad d=\delta p.                                   \tag{3.7}
\]

The two terms inside braces must remain combined after multiplication by
the unbounded ordinate.  Absolute Gevrey bounds for `d` and `q_N` do not
control `|d|/sqrt(q_N)`, and the derivative Rayleigh quotient is only one
upper test for the odd minimum.  Formula (3.6) is cleaner because it uses
the smooth exact radical `J_infinity`; it still supplies an upper bound,
not the all-vector lower frame needed for the shifted sign.

Combining (0.3), (0.5), and min--max gives the precise relative warning

\[
 q_N=O(e^{-c_+\lambda L^2}),\qquad
 \mu_{N,-}\leq r_N^-=O(e^{-c_-\lambda L^2}).          \tag{3.8}
\]

Neither big-`O` statement is a lower bound, and their exponent constants
cannot be compared.  Any proof of `q_N<mu_(N,-)` must in particular prove
`q_N<r_N^-`, but that necessary scalar comparison is not sufficient.

## 4. A fixed-prefix, count-compatible singular model

This section is a logical insufficiency theorem, not a replacement for the
zeta divisor.  Let `F` be a prescribed finite multiset of positive real
ordinates, each with finite multiplicity, which can be embedded in a finite
beginning satisfying the frozen HSW envelope.  It may in particular contain
one simple ordinate in `(13,15)` and no other point of that interval; the
single-point case is compatible by a direct finite check against the large
explicit HSW constant.

Choose `L_0` sufficiently large that the estimate below is inside the
frozen HSW envelope throughout its locked range; in particular choose

\[
 L_0>{1\over0.103787},\qquad h={2\pi\over L_0},       \tag{4.1}
\]

and put

\[
 M(T)={T\over2\pi}\log{T\over2\pi e}.               \tag{4.2}
\]

Put

\[
 R_m=\left\lfloor M(mh)-{1\over8}+{1\over2}\right\rfloor.
                                                               \tag{4.3}
\]

Choose a sufficiently large splice index `m_*`, beyond every point of `F`,
so that `R_m` is nonnegative and strictly increasing for `m>=m_*`.  Choose
an HSW-compatible finite beginning through `m_*h`, containing `F`, whose
total count at the splice is `R_(m_*)`.  The compatibility hypothesis means
exactly that this finite choice exists; for the one-simple-ordinate example
above it is an elementary finite construction.  Let `J_*` be the number of
distinct ordinates in this entire finite beginning.

For `m>m_*`, place `R_m-R_(m-1)` copies at the lattice ordinate
`gamma_m=mh`.  Thus, only on the lattice tail,

\[
 N_\Gamma(mh)=R_m,\qquad m\geq m_*.                  \tag{4.4}
\]

For `m>=m_*` and `mh<=T<(m+1)h`, monotonicity gives

\[
 \begin{aligned}
 |N_\Gamma(T)-M(T)+1/8|
 &\leq {1\over2}+M((m+1)h)-M(mh)\\
 &\leq {1\over2}+{1\over L_0}
          \log{(m+1)h\over2\pi}.
 \end{aligned}
                                                               \tag{4.5}
\]

Because `1/L_0<0.103787`, (4.5) is eventually smaller than the frozen HSW
error

\[
 0.103787\log T+0.257297\log\log T+9.367419.          \tag{4.6}
\]

Increase `m_*` until this comparison holds throughout the tail.  The finite
beginning satisfies the same envelope by construction, without any claim
that the rounded formula (4.3) is a counting function at small height.  The
resulting symmetric multiset lies entirely on
the critical line, has finite algebraic multiplicities, contains `F`, and
satisfies the pinned multiplicity count.  Its lattice support also contains
a positive-density, one-separated distinct subset: simply retain every
`ceil(1/h)`-th tail point.  Thus it respects the coarse distinctness
conclusion extracted from that count.

Now take the exact polynomial schedule (0.6).  A lattice ordinate
`gamma_m=2*pi*m/L_0` is carrier number `km` at length `L_k=kL_0`.
Consequently its row in (2.1) is supported only in column `km` when
`km<=N_k`, and is zero when `km>N_k`.  All lattice rows therefore span a
space of dimension at most `floor(N_k/k)`.  The entire finite beginning adds
rank at most `J_*`, regardless of its multiplicities.  Hence

\[
 \boxed{
 \operatorname {rank}Z_{N_k,-}
 \leq\left\lfloor{N_k\over k}\right\rfloor+J_*<N_k}  \tag{4.7}
\]

for all sufficiently large `k`.  Therefore

\[
 \boxed{\mu_{N_k,-}=0.}                               \tag{4.8}
\]

On the RH branch `q_(N_k)>=0`, so the strict comparison
`q_(N_k)<mu_(N_k,-)` fails in this count-compatible model even if
`q_(N_k)=0`.  Adding any fixed finite verified prefix cannot repair the
growing rank defect.

The model does not say that actual zeta ordinates are lattice locked.  It
proves that RH location, the pinned global count, its valid coarse
distinctness consequence, and finitely many certified ordinates do not
exclude such locking and therefore cannot by themselves prove the odd
floor.

## 5. Sharp surviving input

In the positive-height convention, the desired sign is exactly

\[
 \boxed{
 2\sum_{\gamma>0}m_\gamma
       |\widehat f(\gamma)|^2
 >q_N\|f\|_2^2
 \quad\hbox{for every }0\ne f\in E_{N,-}.}            \tag{5.1}
\]

Thus one sufficient zero-side theorem would be an actual carrier-scale
sampling lower bound

\[
 \sigma_{\min}(Z_{N,-})^2>{q_N\over2}.                \tag{5.2}
\]

An exact minor route may replace (5.2) by one Cauchy--Binet lower bound
larger than `q_N`, but it must control distinct-zero separation, carrier
phases, and the Cauchy denominators at the effective exponent
`lambda*L^2`, not at the determinant exponent `lambda^2*L^7`.

The quasi-null adds a necessary compatibility test:

\[
 q_N<\mu_{N,-}\leq r_N^-.                            \tag{5.3}
\]

Proving only `q_N<r_N^-` would still leave every direction transverse to
`v_N` uncontrolled.  Conversely, an absolute lower bound for the odd Gram
that contradicts (0.5) cannot be correct.  A successful proof must use the
actual divisor and source cancellation strongly enough to establish (5.1),
or bypass the value frame with a direct proof of
`Q_(N,-)-q_N I>0`.

## 6. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. compares the non-effective constants `c_+` and `c_-` without a new
   relative theorem;
2. turns the upper bound `mu_(N,-)<=r_N^-` into a lower bound;
3. treats one derivative Rayleigh quotient as an all-vector frame;
4. replaces repeated value rows by derivative jets;
5. uses the HSW multiplicity count as carrier-scale separation;
6. treats the fixed-prefix lattice model as the actual zeta divisor; or
7. infers an actual shifted sign, determinant limit, RH, a converse from
   RH, or a Lambda bound.

The present branch stops at the relative lower sampling theorem (5.1).
The exponential smallness of `q_N` removes an absolute-envelope conflict;
it does not supply the missing relative odd floor.
