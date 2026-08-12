# Two-frequency phase transversality and the exact `1:2` theorem

## 0. Outcome and fail-closed boundary

This note proves two phase-synchronization results for a finite edge supported
on two commensurable positive frequencies.

1. For fixed integers `1 <= p < q` and fixed `B, omega > 0`, all but a
   finite set `E_{p,q}(B,omega)` of positive weight ratios have a phase with

   \[
    P>0,\qquad {\cal C}=PW-V^2<0.                     \tag{0.1}
   \]

   Moreover, `|E_{p,q}(B,omega)| <= 2(p+q)`.
2. For the primitive non-antipodal pair `(p,q)=(1,2)`, the **failure set** is
   empty: (0.1) holds for every `B, omega, r_1, r_2 > 0`, including ratios
   in the common-zero set defined below.  That common-zero set need not be
   empty.

The second theorem needs no global hull antipode.  It proves strictly more
than the earlier single favorable fixture, but only for the abstract
two-frequency `1:2` phase problem.  It does **not** assert that an actual
attained zeta edge is finite, has two ordinates in ratio `1:2`, or has any of
the geometry assumed here.  Possible failure at the common-zero candidate
ratios for other mixed-parity `p:q` pairs, and the universal problem for
three or more phase-locked frequencies, remain open.

Consequently this note proves neither RH nor its negation, no Lambda bound,
no routing contraction, no positive full Laplacian, and not equation (5.2)
of `DIRECT_RH_ATTACK.md`.  The formal state remains `P0_INVALIDATED`.
Floating computations used during discovery are diagnostic only and enter
none of the proofs or certificates below.

## 1. Frozen dependencies and setup

The deductions and exact regression are bound to these bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/FIRST_LAPLACIAN_MINOR_TURAN_BARRIER.md` | `ae87b9100f8eea9ec9feddeec7f8343197ba5c14b25b2245afb96a2deec45fb1` |
| `notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md` | `a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc` |
| `notes/FINITE_EDGE_PHASE_SYNCHRONIZATION_CRITERIA.md` | `00db33f1263cbb7eeb1fed4d500d683920cd2444ccef58112b46ee67414904ff` |

Fix integers `1 <= p < q`, normally coprime after parametrizing the primitive
circle, and fix `B, omega > 0`.  Put

\[
 b_n=(B+in\omega)^{-2},\qquad n\in\{p,q\}.          \tag{1.1}
\]

For positive weights `r_p,r_q`, the actual monothetic hull is parametrized by
`z=e^(it)`, and

\[
 \begin{aligned}
 P(t)&=2\Re\{r_pb_pz^p+r_qb_qz^q\},\\
 V(t)&=2\Re\{r_pb_p^2z^p+r_qb_q^2z^q\},\\
 W(t)&=2\Re\{r_pb_p^3z^p+r_qb_q^3z^q\},\\
 {\cal C}(t)&=P(t)W(t)-V(t)^2.
 \end{aligned}                                     \tag{1.2}
\]

The function `P` is nonzero and has mean zero, so it assumes both signs.
At a sign-changing zero `t_0` of `P`,

\[
 {\cal C}(t_0)=-V(t_0)^2.                          \tag{1.3}
\]

Thus, if `V(t_0) != 0`, continuity supplies a nearby point on the `P>0`
side at which `C<0`.  Conversely, failure of (0.1) forces **every**
sign-changing zero of `P` to be a zero of `V`.  This is the boundary-
transversality reduction used throughout the note.

## 2. A finite common-zero set for every fixed two-frequency pair

Divide (1.2) by the positive factor `r_p`, and put `R=r_q/r_p`.  Define

\[
 A_n(t)=2\Re(b_ne^{int}),\qquad
 Q_n(t)=2\Re(b_n^2e^{int}).                         \tag{2.1}
\]

Then `P/r_p=A_p+RA_q` and `V/r_p=Q_p+RQ_q`.  A common
zero of `P` and `V` must be a zero of the determinant

\[
 D(t)=A_p(t)Q_q(t)-A_q(t)Q_p(t).                   \tag{2.2}
\]

This real trigonometric polynomial is not identically zero.  Indeed, its
Fourier coefficient at frequency `p+q` is

\[
 [e^{i(p+q)t}]D=b_pb_q^2-b_qb_p^2
                   =b_pb_q(b_q-b_p)\neq0.          \tag{2.3}
\]

Here `b_p != b_q`: equality of the inverse squares would imply either
`B+ip omega=B+iq omega` or `B+ip omega=-(B+iq omega)`, both impossible.
Therefore `D` has degree `p+q` and at most `2(p+q)` unit-circle zeros.

Each zero of `D` produces at most one common-zero ratio `R`.  To see this,
observe that `A_q(t)` and `Q_q(t)` cannot vanish together.  If
`b_q=rho e^(i phi)`, simultaneous vanishing would make both
`cos(qt+phi)` and `cos(qt+2phi)` zero, forcing `phi` to be a multiple of
`pi`.  But

\[
 \Im b_q={-2Bq\omega\over(B^2+q^2\omega^2)^2}\neq0. \tag{2.4}
\]

Hence the two linear equations in `R` determine at most one ratio at each
zero of `D`.  Define the exact common-zero candidate set

\[
 \begin{split}
 E_{p,q}(B,\omega)=\{R>0:\ &\text{for some }t,\\
 &A_p(t)+RA_q(t)=Q_p(t)+RQ_q(t)=0\}.
 \end{split}                                       \tag{2.5}
\]

Equations (2.2)--(2.4) prove

\[
 \boxed{|E_{p,q}(B,\omega)|\leq2(p+q)}.            \tag{2.6}
\]

For `R` outside this finite set, `P` and `V` have no common zero.  Since
`P` assumes both signs, one of its sign-changing zeros is transverse to
`V`; (1.3) then proves (0.1).  This gives generic positive-weight
transversality for every fixed two-frequency pair, including every
consecutive support.  The argument identifies a finite algebraic/
trigonometric common-zero set.  Membership in this set is necessary for
failure, not sufficient.

## 3. Normalized quartics for the `1:2` pair

Now take `(p,q)=(1,2)`.  Scaling by positive powers of `B` and `r_1` does
not change the relevant signs or common zeros.  Put

\[
 x={\omega\over B}>0,\qquad R={r_2\over r_1}>0,
 \qquad b_1=(1+ix)^{-2},\quad b_2=(1+2ix)^{-2}.     \tag{3.1}
\]

After multiplying the Laurent polynomials for `P` and `V` by `z^2`, their
zero sets on the unit circle are those of

\[
 \begin{aligned}
 \widetilde P(z)&=Rb_2z^4+b_1z^3+\overline b_1z+R\overline b_2,\\
 \widetilde V(z)&=Rb_2^2z^4+b_1^2z^3
                    +\overline b_1^{\,2}z+R\overline b_2^{\,2}.
 \end{aligned}                                     \tag{3.2}
\]

If (0.1) failed, `P` would have at least two distinct sign-changing zeros
and `V` would share them by Section 1.  Thus the self-inversive quartics in
(3.2) would have a common monic unit-root quadratic

\[
 Q(z)=z^2+kuz+u^2,\qquad |u|=1,\quad k\in\mathbb R,
 \quad |k|<2.                                      \tag{3.3}
\]

Indeed, for roots `e^(i alpha),e^(i beta)`, take
`u=e^(i(alpha+beta)/2)` and `k=-2cos((alpha-beta)/2)`.  Distinctness gives
the strict bound in (3.3).

## 4. Exact degree-two subresultant classification

For a general self-inversive quartic

\[
 f(z)=az^4+bz^3+\overline b z+\overline a,          \tag{4.1}
\]

reduction modulo (3.3) gives

\[
 f\bmod Q=E_1z+E_0,                               \tag{4.2}
\]

where

\[
 \begin{aligned}
 E_0&=\overline a+bku^3+a(1-k^2)u^4,\\
 E_1&=ak(2-k^2)u^3+b(k^2-1)u^2+\overline b.
 \end{aligned}                                     \tag{4.3}
\]

For `k != 0`, `E_0=0` and its conjugate imply `E_1=0`; hence the single
constant-remainder equation is the exact degree-two subresultant condition.
The branch `k=0` must be handled separately.  Applying the constant
remainder equation first to `P` and then to `V` would give

\[
 u^4=-{\overline b_2\over b_2}
     =-{\overline b_2^{\,2}\over b_2^2}.           \tag{4.4}
\]

Thus `overline(b_2)/b_2` would equal its square, forcing `b_2` real.  This
contradicts (2.4), so `k=0` is impossible.

Assume `k != 0` and put

\[
 H=u^4(1-k^2).                                     \tag{4.5}
\]

Applying `E_0=0` to the two quartics and eliminating `Rku^3` yields

\[
 H={\overline b_2(b_1-\overline b_2)
       \over b_2(b_2-b_1)}.                        \tag{4.6}
\]

Direct simplification gives

\[
 |H|^2={9(x^2+4)\over9x^2+4},\qquad 1<|H|<3.       \tag{4.7}
\]

Since `|H|=|1-k^2|`, only the negative branch is possible:

\[
 k^2=1+|H|,\qquad u^4=-{H\over|H|}.                \tag{4.8}
\]

In particular (3.3) remains strict.

## 5. The quotient-circle bound rules out every `1:2` failure

Factor the quartic `widetilde P` by the common quadratic:

\[
 \widetilde P(z)=Rb_2Q(z)
       \{z^2+\ell vz+v^2\},
 \qquad |v|=1,\quad \ell\in\mathbb R.              \tag{5.1}
\]

The constant coefficient gives

\[
 v^2={\overline b_2\over b_2u^2}.                 \tag{5.2}
\]

The quotient is self-inversive because both `widetilde P` and `Q` are
self-inversive.  If its middle coefficient is \(m\) and \(v^2\) is as in
(5.2), the reversed-conjugate relation is
\(\overline m=m/v^2\); hence \(m/v\) is real.  Writing \(m=\ell v\) gives
(5.1) with real \(\ell\).  Comparison of the cubic coefficient gives

\[
 \ell v={b_1\over Rb_2}-ku.                       \tag{5.3}
\]

Put `eta=|H|`.  The constant-remainder equation for `widetilde P`, together
with (4.8), simplifies (5.3) to

\[
 \ell v=-{u^4+\overline b_2/b_2\over ku^3}.        \tag{5.4}
\]

Define the unit rotation of `H`

\[
 E={b_2\over\overline b_2}H
   ={b_1-\overline b_2\over b_2-b_1},
 \qquad |E|=\eta.                                  \tag{5.5}
\]

Since `u^4=-H/eta` and `|k|=sqrt(1+eta)`, equations (5.4)--(5.5) give the
exact quotient parameter and its strict bound:

\[
 |\ell|={|\eta-E|\over\eta\sqrt{1+\eta}}
 \leq {2\over\sqrt{1+\eta}}
 <\sqrt{2}<2.                                      \tag{5.6}
\]

Therefore the quotient in (5.1) has two distinct unit-circle roots: after
putting `z=vy`, its equation is `y^2+ell*y+1=0`.  Neither quotient root can
coincide with a root of `Q`.  Such an overlap would make that root of
`widetilde P` have even multiplicity two, whereas the two roots selected
for `Q` were sign-changing roots of the real function `P` and hence have
odd multiplicity.  Thus `widetilde P` has four distinct simple unit-circle
roots, all sign-changing for `P`.

Under the assumed failure, `widetilde V` would share all four roots.  The
two quartics would then be proportional.  Their `z^4` coefficients make the
proportionality constant `b_2`, while their `z^3` coefficients make it
`b_1`.  Since `b_1 != b_2`, this is impossible.  We have proved

\[
 \boxed{\text{For every }B,\omega,r_1,r_2>0
 \text{ on the }1:2\text{ hull, some phase has }P>0,
 {\cal C}<0.}                                      \tag{5.7}
\]

The primitive relation `(2,-1)` has odd coordinate sum, so this hull has no
global sign-flipping antipode.  Hence an antipode is sufficient in the
earlier theorem but is not necessary here.

## 6. What remains open

The common-zero set (2.5) may be nonempty even for `p:q=1:2`; Appendix A
certifies two common-quadratic branches at special parameter values.  The
quotient argument proves that those ratios still have additional transverse
roots and favorable phases, so the `1:2` failure set is empty although its
common-zero set is not always empty.  For other mixed-parity `p:q` pairs,
the common-zero set is finite but the subset, if any, on which actual failure
occurs remains unknown.  Nor does the two-frequency determinant control
`m >= 3`, arbitrary relation lattices, a countably infinite attained edge,
or a nonattained edge.  Actual-zeta use of (5.7) would require a separately
proved finite attained edge with exactly the stated `1:2` geometry.  No such
geometry is claimed.

All algebra used in the theorem is exact.  Numerical searches are not proof
and are not cited as evidence.  This package changes no status, integration,
replay, source lock, or checkpoint artifact.

## Appendix A. Redundant exact Sturm audit

The quotient bound in Section 5 is the proof of the universal `1:2`
theorem.  For defense in depth, this appendix records the longer independent
subresultant route which was found first.  It is redundant and is not a
numerical premise of the theorem.

Set

\[
 G=b_2H+\overline b_2
   ={\overline b_2(b_2-\overline b_2)\over b_2-b_1},\qquad
 J={b_1^4H^3\over G^4}.                            \tag{A.1}
\]

The remaining common-quadratic equation is `RG=-b_1ku^3`.  Taking fourth
powers gives

\[
 R^4=-{(1+|H|)^2\over|H|^3}J.                     \tag{A.2}
\]

A positive `R` is possible exactly when `J` is negative real.  Conversely,
the fourth-root choices in (4.8) and the sign of `k` realize the required
phase, so no branch is lost.  Also

\[
 J={b_1^4(b_2-b_1)(b_1-\overline b_2)^3
       \over\overline b_2b_2^3(b_2-\overline b_2)^4}. \tag{A.3}
\]

Put `s=x^2`.  Exact expansion gives

\[
 \Im J=-{27x^3(4s+1)^4\over256(s+1)^{16}}F(s),
 \qquad
 \Re J=-{27(4s+1)^4\over4096(s+1)^{16}}N(s),       \tag{A.4}
\]

where

\[
 \begin{aligned}
 F(s)={}&832s^{12}-29616s^{11}+159276s^{10}+18595s^9
 -345180s^8-299493s^7\\
 &-21721s^6+95025s^5+63735s^4+20545s^3
 +3777s^2+384s+17,                                 \tag{A.5}\\
 N(s)={}&768s^{14}-103680s^{13}+1380640s^{12}
 -2516304s^{11}-4553853s^{10}\\
 &+794048s^9+4607940s^8+3230760s^7+905170s^6
 -10920s^5\\
 &-85932s^4-28120s^3-4605s^2-408s-16.             \tag{A.6}
 \end{aligned}
\]

The exact rational Sturm sequence for `F` has four positive roots, one in
each open interval below and no others.  The polynomial `N` has no root in
any listed interval.

| interval | exact rational endpoints | sign of `N` | sign of real `J` | positive `R` possible? |
|---|---|---:|---:|---:|
| `I_1` | `(34447/50000, 13779/20000)` | `+` | `-` | yes |
| `I_2` | `(41749/20000, 104373/50000)` | `-` | `+` | no |
| `I_3` | `(38903/6250, 622449/100000)` | `+` | `-` | yes |
| `I_4` | `(2898161/100000, 1449081/50000)` | `-` | `+` | no |

Formula (A.2), evaluated by outward exact rational interval arithmetic at
the two admissible roots, gives these isolating boxes.  Every decimal is an
exact terminating rational endpoint.

| root interval | `x` | `|H|` | `R` |
|---|---|---|---|
| `I_1` | `[0.830024096035, 0.830030119936]` | `[2.033980560948, 2.033991702891]` | `[3.438601678831, 3.438840007851]` |
| `I_3` | `[2.494890779172, 2.494892783268]` | `[1.238204536137, 1.238206069989]` | `[18.617554864817, 18.617837822310]` |

At the cyclically ordered rational unit phases

\[
 1, {3+4i\over5}, i, {-3+4i\over5}, -1,
 {-3-4i\over5}, -i, {3-4i\over5},                 \tag{A.7}
\]

direct outward rational interval evaluation gives

\[
 \begin{array}{c|c|c}
 &\text{signs in the order (A.7)}&
   \text{strict certified magnitude}\\ \hline
 I_1&-\ +\ +\ -\ -\ +\ -\ -&|P|>3/10\\
 I_3&-\ +\ +\ +\ -\ +\ +\ -&|P|>1/10.
 \end{array}                                       \tag{A.8}
\]

Each string has four cyclic sign changes, so the same proportionality
contradiction follows.  The standard-library regression independently
recomputes the polynomial identities, Sturm counts, interval boxes, and
all sixteen strict phase signs.
