# Exact prolate Mellin recurrence and Birkhoff connection barrier

## 0. Exact result and claim boundary

Keep the locked scale

\[
 L=2\log\lambda,\qquad
 N=\lceil\lambda L^3\rceil,\qquad
 T={2\pi(N+1)\over L},\qquad
 c=2\pi\lambda^2.                                      \tag{0.1}
\]

For each fixed even prolate label \(j=0,4\), this note derives the exact
physical Mellin recurrence, including every boundary term.  On the critical
line it has a forward form involving only Mellin integrals with positive
real part.  Thus neither analytic continuation to a negative moment nor a
hard-endpoint remainder is needed there.

After division by

\[
 G(s)=\pi^{-s/2}\Gamma(s/2),                            \tag{0.2}
\]

both labels obey the same scalar difference expression; the label enters
only through \(a_j(c)=\chi_j(c)/c\).  The physical Mellin integral supplies
the absolute recessive normalization at \(\operatorname {Re}s=+\infty\),
including the first Watson correction.  The locked label-\(0/4\) source is
an exact diagonal two-component system and, although it has no scalar
three-term recurrence, it does satisfy an explicit scalar five-term
recurrence.

The frozen characteristic roots select the action

\[
 D_c(\sigma)=c\left\{
 \sqrt{1+\left({\sigma\over2c}\right)^2}-1
 -{\sigma\over2c}\operatorname {arsinh}
       \left({\sigma\over2c}\right)\right\}.           \tag{0.3}
\]

The second formal branch has action \(i\pi s/2-D_c\).  At \(s=b-it\) its
size relative to the first branch is

\[
 \exp\{\pi t/2-2\operatorname {Re}D_c\}.                \tag{0.4}
\]

At the safe subturning height \(t=c/2\), polynomial boundedness of the
physical Mellin integral would force a constant wrong-branch Stokes
coefficient below \(\exp(-\kappa_*c+o(c))\), where

\[
 \boxed{
 \kappa_*={\pi\over8}-\left\{{\sqrt {15}\over4}-1
              +{1\over4}\arcsin{1\over4}\right\}
 =0.361283181361350\ldots>0.}                           \tag{0.5}
\]

This observation does **not** yet prove the required relative Mellin
factorization.  For an analytic difference equation, connection
coefficients can be \(2\)-periodic functions of \(s\), not constants.  A
uniform subturning Birkhoff theorem must control those periodic factors,
the recessive Green function, and one \(t\) derivative.  Section 8 states
the precise missing theorem.  The recurrence and its minimal normalization
alone do not prove the complex-sector hypothesis of the predecessor note.

This is an unbound post-checkpoint-1.43 theorem/barrier note/test pair.  It
changes no standard eight file and adds no numerical zero sample, source
lock, or serialized artifact.  It proves no actual finite-\(\lambda\)
Stokes transfer, no decay of \(\eta_N^{\rm pr}\), no arithmetic sign, no
new zeta-zero theorem, no RH implication or converse, and no
de Bruijn--Newman \(\Lambda\) bound.  The formal state remains
P0_INVALIDATED.

## 1. Minimal frozen input

Exactly one frozen note/test pair is imported.

| Dependency | SHA-256 |
|---|---|
| notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md | aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6 |
| tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py | 6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6 |

That pair supplies the locked scale, the action (0.3), the label phases
\(\sigma_4=s+3\) and \(\sigma_0=s-1\), the exact Hermite label mixture,
and the unproved complex-sector target.  The present note proves only the
new recurrence, minimal-solution, and connection reductions.

## 2. Physical equation and every Mellin boundary term

Let \(f_{j,\lambda}\) be the restriction to \([0,\lambda]\) of the
real unit prolate mode on \([-\lambda,\lambda]\), obtained from the
regular even angular mode.  In physical variables it satisfies

\[
 -{d\over dx}\left\{\left(1-{x^2\over\lambda^2}\right)
             f_{j,\lambda}'(x)\right\}
 +4\pi^2x^2f_{j,\lambda}(x)
 =\nu_j(c)f_{j,\lambda}(x),                             \tag{2.1}
\]

where

\[
 \nu_j(c)={\chi_j(c)\over\lambda^2}=2\pi a_j(c),
 \qquad a_j(c)={\chi_j(c)\over c}
 =2j+1+O(c^{-1}).                                       \tag{2.2}
\]

Put

\[
 p_\lambda(x)=1-{x^2\over\lambda^2},\qquad
 P_{j;\epsilon,b}(s)=
 \int_\epsilon^b f_{j,\lambda}(x)x^{s-1}\,dx.          \tag{2.3}
\]

Two integrations by parts, with no endpoint suppressed, give

\[
\begin{aligned}
0={}&4\pi^2P_{j;\epsilon,b}(s+2)
 +\left\{{s(s-1)\over\lambda^2}-\nu_j(c)\right\}
       P_{j;\epsilon,b}(s)\\
&-(s-1)(s-2)P_{j;\epsilon,b}(s-2)
 +\mathcal B_b(s)+\mathcal B_\epsilon(s),
\end{aligned}                                           \tag{2.4}
\]

with the exact upper and lower terms

\[
\begin{aligned}
 \mathcal B_b(s)
 &=p_\lambda(b)\left\{(s-1)f_{j,\lambda}(b)b^{s-2}
             -f_{j,\lambda}'(b)b^{s-1}\right\},\\
 \mathcal B_\epsilon(s)
 &=p_\lambda(\epsilon)\left\{
       f_{j,\lambda}'(\epsilon)\epsilon^{s-1}
       -(s-1)f_{j,\lambda}(\epsilon)\epsilon^{s-2}
                              \right\}.
\end{aligned}                                           \tag{2.5}
\]

At \(b=\lambda\), the upper term is exactly zero because
\(p_\lambda(\lambda)=0\); no value of \(f(\lambda)\) has been
discarded.  At zero, even regularity gives
\(f'(\epsilon)=O(\epsilon)\).  Hence the lower term tends to zero for
\(\operatorname {Re}s>2\), and the positive Mellin transform

\[
 P_j(s)=\int_0^\lambda f_{j,\lambda}(x)x^{s-1}\,dx       \tag{2.6}
\]

obeys

\[
 \boxed{
 4\pi^2P_j(s+2)
 +\left\{{s(s-1)\over\lambda^2}-2\pi a_j(c)\right\}P_j(s)
 -(s-1)(s-2)P_j(s-2)=0.}                               \tag{2.7}
\]

For \(s=1/2-it\), equation (2.7) should not be read as a literal negative
moment.  Apply it at \(s+2\).  Since
\(\operatorname {Re}(s+2)=5/2\), all lower terms in (2.5) vanish
directly, and one obtains the boundary-free forward identity

\[
 \boxed{
 4\pi^2P_j(s+4)
 +\left\{{(s+2)(s+1)\over\lambda^2}-2\pi a_j(c)\right\}
       P_j(s+2)
 -s(s+1)P_j(s)=0.}                                    \tag{2.8}
\]

Thus the critical-line recurrence uses only the convergent transforms at
\(s,s+2,s+4\).

## 3. Gamma normalization and the exact universal recurrence

Define

\[
 B_j(s)={P_j(s)\over G(s)},\qquad
 G(s+2)={s\over2\pi}G(s),\qquad
 c=2\pi\lambda^2.                                      \tag{3.1}
\]

Substitution in (2.7) gives the exact labelwise recurrence

\[
 \boxed{
 sB_j(s+2)-(s-1)B_j(s-2)
 +\left\{{s(s-1)\over c}-a_j(c)\right\}B_j(s)=0.}     \tag{3.2}
\]

Its literal critical-line form is the forward equation

\[
 \boxed{
 (s+2)B_j(s+4)-(s+1)B_j(s)
 +\left\{{(s+2)(s+1)\over c}-a_j(c)\right\}B_j(s+2)=0.}
                                                               \tag{3.3}
\]

The large term \(s(s-1)/c\), whose modulus is of order \(L^4\) at the
locked edge, is now isolated exactly.  It is not a perturbative error.

There is also an exact equation for one ordinate derivative.  Along
\(s=s_0-it\), put
\(\dot B_j=\partial_tB_j=-i\partial_sB_j\).  Differentiating (3.3)
gives

\[
\begin{aligned}
 &(s+2)\dot B_j(s+4)-(s+1)\dot B_j(s)
 +\left\{{(s+2)(s+1)\over c}-a_j(c)\right\}\dot B_j(s+2)\\
 &\hspace{12mm}=i\left\{B_j(s+4)-B_j(s)
             +{2s+3\over c}B_j(s+2)\right\}.
\end{aligned}                                           \tag{3.4}
\]

Any relative theorem with one \(t\) derivative must control the inverse of
the same forward difference expression on the right side of (3.4).

## 4. Watson endpoint normalization and the minimal root

The regular endpoint equation obtained from (2.1) is

\[
 \boxed{2\lambda f_{j,\lambda}'(\lambda)
       =\{\chi_j(c)-c^2\}f_{j,\lambda}(\lambda).}       \tag{4.1}
\]

The regular Frobenius solution is determined by its endpoint value.  Hence

\[
 \boxed{f_{j,\lambda}(\lambda)\ne0.}                    \tag{4.2}
\]

Indeed, a zero endpoint value makes (4.1) give a zero first coefficient,
and the regular Frobenius recursion then kills every coefficient.  The
logarithmic singular solution is not an admitted prolate mode.

For \(q\) tending to infinity in a fixed horizontal strip, substitute
\(x=\lambda e^{-u}\) in (2.6).  Watson's endpoint expansion and (4.1)
give

\[
\begin{aligned}
 P_j(q)
 &=\lambda^q\left\{
 {f_{j,\lambda}(\lambda)\over q}
 -{\lambda f_{j,\lambda}'(\lambda)\over q^2}
 +O_{j,\lambda}(|q|^{-3})\right\}\\
 &={\lambda^qf_{j,\lambda}(\lambda)\over q}
 \left\{1+{c^2-\chi_j(c)\over2q}
 +O_{j,\lambda}(|q|^{-2})\right\}.
\end{aligned}                                           \tag{4.3}
\]

The sign and the factor \(1/2\) in the correction are forced by (4.1).
Combining (4.3) with \(G(q+2)=qG(q)/(2\pi)\) yields

\[
 \boxed{
 {B_j(q+2)\over B_j(q)}
 ={c\over q+2}\left\{1-{c^2-\chi_j(c)\over q^2}
       +O_{j,\lambda}(|q|^{-3})\right\}.}              \tag{4.4}
\]

For large positive real part, the two frozen roots have sizes \(c/q\)
and \(-q/c\).  Equation (4.4) selects the small root and fixes its
absolute coefficient by the nonzero number \(f_{j,\lambda}(\lambda)\).
Multiplication by an arbitrary \(2\)-periodic function would preserve
(3.2) and the ratio in (4.4), but it would change the absolute Watson
coefficient in (4.3).  Thus the physical integral supplies more than a
formal recessive ratio.

Equivalently, if \(r_j(s)=B_j(s+2)/B_j(s)\), the forward equation gives
the exact continued fraction recursion

\[
 \boxed{
 r_j(s)={s+1\over
 (s+2)r_j(s+2)+(s+2)(s+1)/c-a_j(c)}.}                  \tag{4.5}
\]

Zeros of a continued-fraction denominator are precisely part of the
unresolved complex connection problem; (4.5) is not by itself a
nonvanishing theorem at the locked edge.

## 5. Transfer matrix, root gap, and the two actions

Write

\[
 \binom{B_j(s+2)}{B_j(s)}
 =A_j(s)\binom{B_j(s)}{B_j(s-2)},\qquad
 A_j(s)=
 \begin{pmatrix}
 a_j(c)/s-(s-1)/c&(s-1)/s\\
 1&0
 \end{pmatrix}.                                        \tag{5.1}
\]

Put

\[
 \tau_j(s)={a_j(c)\over s}-{s-1\over c},\qquad
 \Delta_j(s)=\tau_j(s)^2+4{s-1\over s}.                \tag{5.2}
\]

The exact frozen roots and their gap are

\[
 \boxed{
 r_{j,\pm}(s)={\tau_j(s)\pm\sqrt{\Delta_j(s)}\over2},
 \qquad r_{j,+}(s)-r_{j,-}(s)=\sqrt{\Delta_j(s)}.}      \tag{5.3}
\]

For \(s=b-it\), bounded real \(b\), fixed label, and
\(v=t/(2c)\leq1/4\), one has

\[
\begin{aligned}
 r_{j,+}(b-it)
 &=\sqrt{1-v^2}+iv+O(t^{-1}+c^{-1}),\\
 r_{j,-}(b-it)
 &=-\sqrt{1-v^2}+iv+O(t^{-1}+c^{-1}),\\
 |r_{j,+}-r_{j,-}|
 &=2\sqrt{1-v^2}+O(t^{-1}+c^{-1}).
\end{aligned}                                           \tag{5.4}
\]

The limiting gap is at least \(\sqrt {15}/2\); in particular the exact gap
is at least \(3/2\) throughout this range once \(c,t\) are sufficiently
large.  The locked edge has \(t/c=L^2/\lambda+o(1)\), so it is far from
the large turning points near \(s=\pm2ic\).

Discarding the lower-order transport terms in (5.3) gives

\[
\begin{aligned}
 r_+^{(0)}(s)
 &=\sqrt{1+(s/2c)^2}-{s\over2c}
   =\exp\{-\operatorname {arsinh}(s/2c)\},\\
 r_-^{(0)}(s)
 &=-\sqrt{1+(s/2c)^2}-{s\over2c}
   =-\exp\{\operatorname {arsinh}(s/2c)\}.
\end{aligned}                                           \tag{5.5}
\]

Since

\[
 2D_c'(s)=-\operatorname {arsinh}(s/2c),                \tag{5.6}
\]

the first root integrates to \(D_c\).  On the logarithm continued through
the upper value of \(\log(-1)\), the second root integrates to

\[
 D_{c,-}(s)={i\pi s\over2}-D_c(s)+\hbox{constant}.       \tag{5.7}
\]

Consequently, for \(s=b-it\), the formal wrong/right modulus ratio is
exactly the exponential scale in (0.4), up to algebraic transport factors.

## 6. The exact label mixture and its scalar five-term equation

Use distinct fonts for the source coefficients and the differential
parameters:

\[
 \mathfrak a_4={\sqrt3\over2^{11/4}},\qquad
 \mathfrak a_{0,\lambda}\ne0,\qquad
 B_{\rm src}=\mathfrak a_4B_4-
                 \mathfrak a_{0,\lambda}B_0.          \tag{6.1}
\]

With

\[
 \mathbf B=\binom{B_4}{B_0},\qquad
 \mathbf A_c=\operatorname {diag}\{a_4(c),a_0(c)\},    \tag{6.2}
\]

the exact mixed recurrence is the diagonal system

\[
 \boxed{
 s\mathbf B(s+2)-(s-1)\mathbf B(s-2)
 +\left\{{s(s-1)\over c}I-\mathbf A_c\right\}
       \mathbf B(s)=0.}                                \tag{6.3}
\]

Thus the absence of one scalar three-term eigenvalue is not a fatal
obstruction.  It is a two-channel connection problem with separated
parameters.

There is also an exact scalar elimination.  Define

\[
 (\mathcal T_cf)(s)=sf(s+2)-(s-1)f(s-2)
                   +q(s)f(s),\qquad
 q(s)={s(s-1)\over c}.                                 \tag{6.4}
\]

Since both label operators are polynomials in the same \(\mathcal T_c\),
they commute, and every source combination obeys

\[
 \boxed{
 \{\mathcal T_c-a_0(c)\}\{\mathcal T_c-a_4(c)\}
 B_{\rm src}=0.}                                       \tag{6.5}
\]

Put \(A=a_0+a_4\) and \(P=a_0a_4\).  Expanding (6.5) gives the
five-term identity

\[
\begin{aligned}
0={}&s(s+2)B_{\rm src}(s+4)\\
&+s\left\{{2(s^2+s+1)\over c}-A\right\}
       B_{\rm src}(s+2)\\
&+\left\{q(s)^2-Aq(s)+P-2(s^2-s+1)\right\}B_{\rm src}(s)\\
&+(s-1)\left\{A-{2(s^2-3s+3)\over c}\right\}
       B_{\rm src}(s-2)\\
&+(s-1)(s-3)B_{\rm src}(s-4).
\end{aligned}                                           \tag{6.6}
\]

Shifting (6.6) by four gives a literal critical-line relation using only
positive-real-part Mellin integrals.  The five-term equation introduces
four formal branches and is less convenient than the diagonal system for
Birkhoff analysis, but it proves that a scalar recurrence exists after
exact elimination.

## 7. Physical growth and the explicit wrong-branch exponent

For every fixed \(b>1/2\), Cauchy--Schwarz and unit source norm give

\[
 \boxed{
 |P_j(b-it)|\leq
 {\lambda^{b-1/2}\over\sqrt{2b-1}}.}                   \tag{7.1}
\]

Stirling's formula for \(G\) therefore gives

\[
 |B_j(b-it)|\leq
 \operatorname {poly}_{b,j}(\lambda,1+t)e^{\pi t/4}.   \tag{7.2}
\]

The first formal physical branch \(P=GB\) has exponential part
\(\exp(-\pi t/4+\operatorname {Re}D_c)\); the second has
\(\exp(\pi t/4-\operatorname {Re}D_c)\).  At

\[
 t_*={c\over2},\qquad v_*={1\over4},                   \tag{7.3}
\]

the comparison may be made on the fixed line \(s=1-it_*\), where (7.1)
applies.  Replacing \(1-it_*\) by \(-it_*\) in the action changes its
real part by only \(O(1)\).  The exact imaginary-axis action is

\[
 D_c(-it_*)=c\left\{{\sqrt {15}\over4}-1
                   +{1\over4}\arcsin{1\over4}\right\}. \tag{7.4}
\]

Hence the second physical branch has exponential size

\[
 \boxed{\exp\{\kappa_*c+O(1)\},}                       \tag{7.5}
\]

while the first has \(\exp(-\kappa_*c+O(1))\).  If an exact Birkhoff
decomposition had constant, polynomially controlled connection
coefficients, (7.1) would force the wrong coefficient to be at most
\(\exp(-\kappa_*c+o(c))\).

This growth comparison is a selection mechanism, not yet a proof.  The
coefficient matrix of a difference equation is unchanged when a solution
is multiplied by an analytic \(2\)-periodic function.  A connection matrix
can therefore contain periodic factors which grow in one imaginary
direction and decay in the other.  One must use two-sided Mellin growth,
reality, and a canonical subturning basis to exclude them.  Pointwise
comparison at (7.3) without that basis can also hide cancellation between
the two exact solutions.

At the locked edge \(T=o(c)\), an estimate

\[
 |S_j(c)|\leq e^{-\kappa_0c},\qquad
 0<\kappa_0<\kappa_*,                                   \tag{7.6}
\]

would be vastly stronger than necessary, because

\[
 -\kappa_0c+{\pi T\over2}-2D_c(-iT)\longrightarrow-\infty.
                                                               \tag{7.7}
\]

The last two positive terms have orders \(\lambda L^2\) and \(L^4\),
whereas \(c\) has order \(\lambda^2\).

## 8. The precise missing subturning theorem

Here is the narrow statement which would convert the recurrence reduction
into the predecessor's relative factorization.

**UNPROVED SUBTURNING BIRKHOFF CONNECTION THEOREM.**  For \(j=0,4\),
construct canonical exact solutions \(W_{j,+}\) and \(W_{j,-}\) of
(3.2) in the subturning strip \(|\operatorname {Im}s|\leq c/2\), with
the following properties.

First, on

\[
 c^{1/2}\leq t\leq c/4,\qquad s={1\over2}-it,
 \qquad \sigma_j=s+j-1,                                \tag{8.1}
\]

the plus solution has the relative transport estimate

\[
 \boxed{
 W_{j,+}(s)=e^{D_c(\sigma_j)}b_j(s)\{1+u_j(s)\},\qquad
 |u_j|+|\partial_tu_j|
 \leq C_j\left({1\over t}+{t\over c}\right),}          \tag{8.2}
\]

where \(b_j(s)=H_j(s)/G(s)\) is the exact Hermite polynomial factor.  The
minus solution has action \(i\pi s/2-D_c\), with algebraic transport
bounded above and below on closed subturning sectors.

For the selection comparison, require in addition that there is a fixed
\(K_j\) such that, uniformly for \(c^{1/2}\leq t\leq c/2\) and
\(1/2\leq\operatorname {Re}s\leq3/2\), the two solutions are nonzero and

\[
\begin{aligned}
 c^{-K_j}e^{\operatorname {Re}D_c(s+j-1)}
 &\leq |W_{j,+}(s)|
 \leq c^{K_j}e^{\operatorname {Re}D_c(s+j-1)},\\
 c^{-K_j}e^{\pi t/2-\operatorname {Re}D_c(s+j-1)}
 &\leq |W_{j,-}(s)|
 \leq c^{K_j}e^{\pi t/2-\operatorname {Re}D_c(s+j-1)},\\
 |\partial_tW_{j,+}(s)|
 &\leq c^{K_j}e^{\operatorname {Re}D_c(s+j-1)},\\
 |\partial_tW_{j,-}(s)|
 &\leq c^{K_j}e^{\pi t/2-\operatorname {Re}D_c(s+j-1)}.
\end{aligned}                                                  \tag{8.3}
\]

The conjugate estimates are required for negative \(t\).  These are only
coarse polynomial-transport bounds; the relative estimate is required
only in (8.2).  In particular (8.3) includes the line
\(\operatorname {Re}s=1\), on which the physical bound (7.1) makes the
comparison at \(t=c/2\).

Second, the Watson-normalized physical solution has a connection
decomposition

\[
 B_j(s)=C_j(c)W_{j,+}(s)+S_j(c)W_{j,-}(s),             \tag{8.4}
\]

in which no nonconstant \(2\)-periodic connection factor survives the
two-sided Mellin growth condition, and, for every fixed
\(0<\kappa_0<\kappa_*\),

\[
 \boxed{
 C_j(c)=1+O(c^{-1}),\qquad
 |S_j(c)|\leq C_{j,\kappa_0}e^{-\kappa_0c}.}          \tag{8.5}
\]

If a canonical construction initially leaves analytic \(2\)-periodic
coefficients \(C_j(s;c),S_j(s;c)\), the ``no nonconstant factor'' clause
may instead be met by the uniform bounds
\(|C_j-1|+|\partial_tC_j|=O(c^{-1})\) and
\(|S_j|+|\partial_tS_j|\leq C_{j,\kappa_0}e^{-\kappa_0c}\) on
\(c^{1/2}\leq|t|\leq c/2\) and
\(1/2\leq\operatorname {Re}s\leq3/2\).  Thus the periodic alternative
also controls the one derivative needed at the locked edge.

The characteristic gap in (5.4) makes (8.2) plausible: conjugation by
\(\exp(D_c)\) cancels the full \(s^2/c\) action, leaving transport defects
of size \(O(1/t+t/c)\).  What is not yet proved is a uniformly bounded
minimal Green function, the continuation to the comparison height
\(t=c/2\), and the elimination of periodic connection factors.  These are
exactly the claims in (8.2)--(8.5), not consequences of formal root
separation alone.

At the locked edge, \(T/c=L^2/\lambda+o(1)\) and
\(1/T=o(T/c)\).  Therefore (8.2)--(8.5) would imply

\[
 \boxed{
 P_j(1/2-it)=e^{D_c(1/2-it+j-1)}H_j(1/2-it)
 \left\{1+O\left({L^2\over\lambda}\right)\right\},}   \tag{8.6}
\]

uniformly for \(|t-T|=O(\log L)\), with the same order after one \(t\)
derivative of the relative error.  The exact label-mixture algebra in the
predecessor note would then give the positive slow source multiplier.

Equation (8.6) is conditional.  This note proves (2.4)--(7.7), not the
unproved theorem (8.2)--(8.5), and therefore not (8.6).

## 9. Stopping point

The hard endpoint creates no Mellin boundary remainder, the lower endpoint
is avoided by the forward recurrence, and the physical integral fixes the
small solution at positive real infinity.  The mixed source is exactly a
two-channel scalar-recurrence problem rather than an algebraic dead end.

The remaining obstruction is genuinely a connection estimate: prove that
the Watson-normalized minimal solution stays on the \(\exp(D_c)\) Birkhoff
branch, rule out nonconstant \(2\)-periodic connection factors, and control
one ordinate derivative.  The explicit comparison height (7.3) and the
constant (0.5) show that ordinary physical Mellin growth has enough
exponential room to kill the wrong branch once that canonical Birkhoff
decomposition exists.  No such decomposition or nonvanishing theorem is
silently assumed here.
