# Signed Ewald-cell order behind the cross-Hardy band inequality

## Scope and outcome

Retain the complete theta profile, the single actual residual, and the
already-subtracted left Ewald cells from
`CROSS_HARDY_EULER_CURVATURE_NEXT.md`.  This note does not replace the
complete orbit by a finite positive packet, divide by `W=2Xi`, or estimate
the two root-logarithmic factors separately.

Assume exactly the two old-prefix positivity hypotheses of that note, so
the one actual residual `q` has degree `kappa` with real simple roots and
the complete root-logarithmic transform is defined.  No new positivity
hypothesis is added.

The signed log-frequency band problem has a further exact reduction.  Write

\[
 e_n=e_n(\pi),\qquad
 S(z)=\sum_{n\geq1}e_nz^n,qquad
 V(z)=\sum_{n\geq1}|e_n|z^n,qquad M=V(1),       \tag{1}
\]

and split the fully correlated scalar cells only after they have been
formed:

\[
 P(z)=\sum_{n\geq1}e_n^+z^n,\qquad
 N(z)=\sum_{n\geq1}e_n^-z^n,                    \tag{2}
\]

where `e_n^+=max(e_n,0)` and `e_n^-=max(-e_n,0)`.  Thus
`S=P-N` and `V=P+N`.  The actual `e_n` are rapidly decreasing because
`J_pi` is Schwartz.  Hence
all series and derivatives below converge absolutely and uniformly on
`[0,1]`.  Fix `0<z_*<1`; the proposed route uses `z_*=1/2`.

The decisive signed-placement quantity is

\[
 \boxed{D(z):=P'(z)N(z)-P(z)N'(z)
 ={1\over2}\{V(z)S'(z)-S(z)V'(z)\}.}            \tag{3}
\]

For every `alpha>0`, put

\[
 C=(1+\alpha)M,\qquad R(z)=C-V(z),
\qquad
 \mathcal W_\alpha(z)=R(z)S'(z)+V'(z)S(z).      \tag{4}
\]

Then the bounded-gauge Wronskian has the division-free factorization

\[
 \boxed{
 V(z)\mathcal W_\alpha(z)
 =2R(z)D(z)+C\,S(z)V'(z).}                      \tag{5}
\]

Consequently, the original seed together with the single all-index
condition

\[
 \boxed{D(z)\geq0\qquad(z_*\leq z\leq1)}       \tag{6}
\]

implies the directional band inequality on `[z_*,1)`, and its scalar
Wronskian has a nonnegative endpoint limit.  Condition (6) says that, under
Abel tilting, the positive fully assembled cells have
at least the mean index of the negative fully assembled cells.  It permits
signed cells and is weaker than cellwise positivity.  It is the remaining
theta-specific arithmetic statement; it is not proved here.

An exact finite signed-sequence example also shows that the variation gauge,
the seed value, and even the positive endpoint value do not determine the
Wronskian sign.  Therefore a proof must control signed cell placement, not
only magnitudes.  The example is a logical no-go in the abstract scalar
class, not a substitute for the complete theta source and not a
counterexample to the actual theta claim.

## 1. The root-logarithmic band collapses to the complete scalar cells

Let

\[
 \Delta_nW=W_n-\int_{n-1}^nW_x\,dx,
 \qquad W_z=\sum_{n\geq1}z^n\Delta_nW.          \tag{7}
\]

For the actual real-rooted residual `q`, let `mathscr Q_q` be the polarized
Hardy form and let `mathcal U` and

\[
 \mathcal A_\kappa=-\partial_y^2-{2\kappa-1\over4}              \tag{8}
\]

be the complete all-root logarithmic transform and its Hardy operator.  The
two audited identities are

\[
 \mathscr Q_q(U,V)={2\over\kappa}
 \langle\mathcal UU,\mathcal A_\kappa\mathcal UV\rangle         \tag{9}
\]

and, cell by cell,

\[
 \mathscr Q_q(W,\Delta_nW)=4\pi e_n.            \tag{10}
\]

Combining them fixes the normalization

\[
 \boxed{
 \langle\mathcal UW,
 \mathcal A_\kappa\mathcal U\Delta_nW\rangle
 =2\pi\kappa e_n.}                              \tag{11}
\]

For the bounded direction

\[
 L_{\alpha,z}=R(z)\partial_zW_z+V'(z)W_z
 =\sum_{n\geq1}c_n(z)\Delta_nW,                 \tag{12}
\]

\[
 c_n(z)=R(z)nz^{n-1}+V'(z)z^n>0,                \tag{13}
\]

the audited Ewald topology permits termwise pairing for `0<z<1`.
Equations (11)--(13) give

\[
\begin{aligned}
 \langle\mathcal UW,
 \mathcal A_\kappa\mathcal UL_{\alpha,z}\rangle
 &=2\pi\kappa\sum_{n\geq1}c_n(z)e_n\\
 &=2\pi\kappa\{R(z)S'(z)+V'(z)S(z)\}\\
 &=2\pi\kappa\mathcal W_\alpha(z).             \tag{14}
\end{aligned}
\]

Thus the difference between the high and low log-frequency bands in the
signed balance is exactly the already-correlated scalar sum in (14).  No
individual root band and no individual Ewald cell acquires a sign.  The
profile identity is asserted only for `z<1`; the rapidly decreasing scalar
cell series on its right extends smoothly through `z=1`.

## 2. Exact positive/negative-cell factorization

The definitions (2) give

\[
 S=P-N,\qquad V=P+N,
 \qquad R=C-P-N.                                \tag{15}
\]

Direct expansion yields two useful exact formulas:

\[
 \boxed{
 \mathcal W_\alpha
 =(C-2N)P'-(C-2P)N'
 =C(P'-N')+2(PN'-P'N).}                         \tag{16}
\]

and

\[
\begin{aligned}
 V\mathcal W_\alpha
 &=RV S'+VV'S\\
 &=R\{VS'-SV'\}+(R+V)SV'\\
 &=2RD+CSV',                                    \tag{17}
\end{aligned}
\]

which is (5).  Every factor outside `D` and `S` on the right side of (17)
is nonnegative on `[0,1]`, and

\[
 R(z)\geq\alpha M>0.                            \tag{18}
\]

In particular, the original band inequality is **exactly** the
division-free cell-hazard comparison

\[
 \boxed{(C-2N(z))P'(z)\geq(C-2P(z))N'(z).}      \tag{18a}
\]

This is already a smaller scalar arithmetic statement for the actual
complete cells; no relaxation has yet occurred.  On any interval where
`C-2P` is nonzero, it is equivalently the Mobius monotonicity

\[
 {d\over dz}{C-2N(z)\over C-2P(z)}
 ={2\mathcal W_\alpha(z)\over\{C-2P(z)\}^2}\geq0.              \tag{18b}
\]

Equation (18a), not the quotient in (18b), remains the definition across a
denominator zero.  In particular, (18b) never divides by `W=2Xi`.

There is also a global nonsingular scalar monotonicity.  Since
`R'= -V'` and `R>=alpha M>0`,

\[
 \boxed{
 \left({S\over R}\right)'
 ={RS'+V'S\over R^2}
 ={\mathcal W_\alpha\over R^2}.}                \tag{18c}
\]

Thus the band inequality is exactly monotonicity of the signed Abel path
relative to its positive reserve.  This is a scalar reserve quotient, not a
quotient by the theta profile.  The local Mobius ratio in (18b) is its
Cayley transform because `C-2N=R+S` and `C-2P=R-S`.

For completeness, if `alpha` is not fixed in advance, its exact feasible
set can also be read without a search over profiles.  Assume `M>0`, set

\[
 G=(M-V)S'+V'S,qquad
 h=-{G\over MS'}\quad(S'\ne0),                  \tag{18d}
\]

and on a closed scalar interval `I` put

\[
 L=\max\left(0,\sup_{I\cap\{S'>0\}}h\right),
 \qquad
 U=\inf_{I\cap\{S'<0\}}h,                      \tag{18e}
\]

using `sup(empty)=-infinity` and `inf(empty)=+infinity`.  Since

\[
 \mathcal W_\alpha=G+\alpha MS',               \tag{18f}
\]

there exists a constant `alpha>0` with `mathcal W_alpha>=0` on `I` if and
only if

\[
 L<+\infty,\qquad U>0,qquad L\leq U,           \tag{18g}
\]

and `G>=0` at every zero of `S'`.  The explicit condition `L<+infinity`
is necessary: without it the extended-real case `L=U=+infinity` would be a
false positive.  When these conditions hold, the feasible parameters are
exactly $[L,U]\cap(0,+\infty)$.  This optional criterion does not prove
feasibility for the actual source; the fixed route below retains
`alpha=1/2`.

If `M>0`, then `V(z)>0` for every `z>0`.  Moreover, (3) gives

\[
 \left({S\over V}\right)'={2D\over V^2}.       \tag{19}
\]

The quotient in (19) is only by the strictly positive scalar variation
series; no quotient by `W` or by a root feature occurs.  Equivalently, all
claims can be read from the cross-multiplied identity (3).

It follows that if `S(z_*)>=0` and (6) holds, then `S/V` is nondecreasing,
so `S(z)>=0` on `[z_*,1]`.  Formula (17) then proves

\[
 \mathcal W_\alpha(z)\geq0
 \qquad(z_*\leq z\leq1).                        \tag{20}
\]

For the proposed theta route, take `z_*=alpha=1/2`.  The seed in (46) of
the preceding note is precisely `S(1/2)>=0`, and (14), (20) prove its whole
directional cross-Hardy obligation on `[1/2,1)`, with the scalar Wronskian
remaining nonnegative at its continuous endpoint limit.  In fact, once (6)
holds, the conclusion is valid for every `alpha>0`.

The degenerate cases are harmless.  If `M=0`, then every cell and the target
path vanish.  If `N` is identically zero, then `S=V=P` and
`mathcal W_\alpha=CP'>=0`.  If `P` is identically zero, a nonnegative
nontrivial seed is impossible.

## 3. Mean-index and anti-diagonal forms of the remaining arithmetic

When both `P` and `N` are nonzero, define their Abel-tilted mean indices

\[
 \mu_+(z)={zP'(z)\over P(z)},\qquad
 \mu_-(z)={zN'(z)\over N(z)}.                   \tag{21}
\]

These are well-defined for `z>0`, and

\[
 \boxed{
 D(z)={P(z)N(z)\over z}\{\mu_+(z)-\mu_-(z)\}.} \tag{22}
\]

Hence (6) is exactly the tilted mean-index order

\[
 \mu_+(z)\geq\mu_-(z).                          \tag{23}
\]

This is a statement about the placement of signs among the complete scalar
Ewald errors, not about the sign of a root component or an unrenormalized
theta orbit.

There is also a coefficientwise all-index form.  Absolute convergence gives

\[
 \boxed{
 D(z)=\sum_{p,q\geq1}(p-q)e_p^+e_q^-z^{p+q-1}
 =\sum_{m\geq2}d_mz^{m-1},}                    \tag{24}
\]

where

\[
 \boxed{
 d_m=\sum_{\substack{p>q\geq1\\p+q=m}}
 (p-q)\{e_p^+e_q^- -e_q^+e_p^-\}.}             \tag{25}
\]

Thus the anti-diagonal compensation inequalities

\[
 d_m\geq0\qquad(m\geq2)                        \tag{26}
\]

are a concrete, stronger sufficient theta lemma.  They allow cancellation
among all cell pairs with the same total index.  The still stronger support
order “every positive-cell index is at least every negative-cell index”
makes every summand in (24) nonnegative, but is not required by (6) and is
not asserted for the actual source.

The source dependence is explicit and complete:

\[
 e_n=J_\pi(n)-\int_{n-1}^nJ_\pi(x)\,dx
 ={1\over4\pi}\mathscr Q_q(W,\Delta_nW).        \tag{27}
\]

Accordingly, (24)--(26) retain the single actual residual, all roots inside
the Hardy pairing, the full modular theta orbit, and the continuum
subtraction before any sign split.

## 4. Exact no-go for magnitude-only damping data

The placement information in (24) cannot be recovered from `V`, the seed,
and the endpoint.  Consider `alpha=1/2` and the common magnitude sequence

\[
 (|e_1|,\ldots,|e_5|)=(2,11,10,8,8).            \tag{28}
\]

Its common variation polynomial and endpoint data are

\[
 V(z)=2z+11z^2+10z^3+8z^4+8z^5,quad
 M=39,quad V'(1)=126,quad R(1)={39\over2}.     \tag{29}
\]

Choose the two sign placements

\[
 e^{(A)}=(-2,11,10,-8,-8),\qquad
 e^{(B)}=(2,11,-10,-8,8).                       \tag{30}
\]

They have not only the same `V` but also exactly the same seed and endpoint:

\[
 S_A(1/2)=S_B(1/2)={9\over4},qquad
 S_A(1)=S_B(1)=3.                               \tag{31}
\]

Their endpoint derivatives differ:

\[
 S_A'(1)=-22,qquad S_B'(1)=2,                  \tag{32}
\]

and the same bounded gauge therefore gives opposite Wronskian signs:

\[
\begin{aligned}
 \mathcal W_A(1)
 &={39\over2}(-22)+126(3)=-51,\\
 \mathcal W_B(1)
 &={39\over2}(2)+126(3)=417.                   \tag{33}
\end{aligned}
\]

These finite sequences are used only as an exact abstract obstruction: a
finite sequence is already rapidly decreasing, so the scalar algebra and
endpoint differentiations are legitimate.  They are not claimed to arise
from `J_pi`, are not raw positive theta packets, and do not test or refute
the actual theta inequality.  What (33) proves is narrower and rigorous:
even `V(z)` in full, the exact positive seed, and the exact positive
endpoint do not determine the cross-Hardy sign.  The missing datum is the
signed index placement measured by (24).

## 5. Exact remainder and a stronger sufficient theta lemma

For each actual Galerkin residual produced from two positive old prefixes,
the fixed half-gauge obligation (46) is **equivalent** to the following
complete-source statement (with the endpoint read as a scalar limit):

\[
\boxed{
\begin{gathered}
 P_\pi(1/2)-N_\pi(1/2)\geq0,\\
 \left({3M\over2}-2N_\pi(z)\right)P_\pi'(z)
 \geq
 \left({3M\over2}-2P_\pi(z)\right)N_\pi'(z),
 \qquad {1\over2}\leq z<1.
\end{gathered}}                                  \tag{34}
\]

This is the exact signed cell-hazard reduction.  A stronger but simpler
sufficient statement is:

> **Signed mean-cell-order lemma.**  With the actual complete-theta errors
> (27), prove
> \[
> S_\pi(1/2)\geq0,
> \qquad
> P_\pi'(z)N_\pi(z)-P_\pi(z)N_\pi'(z)\geq0
> \quad(1/2\leq z\leq1).                        \tag{35}
> \]

The second condition may instead be proved through the compensated
anti-diagonal inequalities (26).  By (14), (17), and the bounded Abel lemma,
(35) implies (34), hence the next pivot.  Establishing either (34) directly
or the stronger (35) from the actual theta arithmetic remains open here.

## Self-audit and nonclaims

- The factor in (11) is fixed by
  `mathscr Q_q=(2/kappa)<mathcal U .,A_kappa mathcal U .>` and
  `mathscr Q_q(W,Delta_nW)=4pi e_n`; hence it is `2pi kappa`, not
  `4pi kappa`.
- The identity (17) uses `R+V=C`.  No endpoint sign or unknown pivot occurs
  in `C=(1+alpha)M`.
- Rapid decrease of the actual Ewald errors justifies all products,
  derivatives, and scalar rearrangements through `z=1`.  The root-logarithmic
  profile identity (14) is used only for `z<1`; no pointwise value of
  `partial_z W_z` at `z=1` is assumed.
- The split into `e_n^+` and `e_n^-` is performed only after each `e_n` has
  assembled every root, the complete theta profile, and its Euler
  subtraction.
- The `P/N` split is a scalar cell-sign factorization after (14); it is not
  a positive/negative decomposition of the two logarithmic-frequency bands.
  Those band correlations remain signed and are used only through their
  complete difference.
- Condition (6) is sufficient, not necessary.  Its failure would not refute
  the bounded-gauge inequality or the next pivot.
- No new theta sign, all-degree theorem, or RH conclusion is claimed.
