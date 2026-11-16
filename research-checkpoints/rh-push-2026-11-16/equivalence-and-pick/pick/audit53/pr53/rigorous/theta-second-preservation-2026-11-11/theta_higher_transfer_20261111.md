# Higher comparison and the next anchor-free theta determinants

**Role in the completed checkpoint.** This is a proof component. The [global theorem](theta_second_preservation_global_20261111.md) combines the source crossing, compensation, first-source origin, and second-origin results to prove second preservation and five-node positivity. Statements below limiting an individual component retain that local scope.


Research continuation, 11 November 2026. This note proves an all-order
comparison statement for the centered call transform and applies its
four-column case to the first canonical theta reduction. It gives
**sufficient conditions** for the next source signs. The companion
certificate proves that these particular source conditions fail for
actual theta near the origin. The exact integral identity survives
and identifies the signed comparison that would be needed instead.
There is no claim of a failure of reduced-kernel preservation, of
arbitrary-depth preservation, or of a proof of RH.

## 1. Setup and the differentiation issue

Let a probability measure on `(0,1)` have a strictly positive smooth
density `m` and distribution function `F`. Put

$$
Tq(y)=\operatorname{Cov}(q(Y),(Y-y)_+),\qquad
\overline F=1-F,
$$

and suppose all displayed integrals and differentiations are justified.
For example, functions smooth on the closed interval suffice. The theta application
also permits the unbounded endpoints already handled by exponential
moment bounds in PR #52.

Write

$$
G(r,s)=F(\min(r,s))\overline F(\max(r,s)),\qquad
K(y,s)=\int_y^1G(r,s)\,dr.
$$

Then `Tq = integral K q'`. The kernel `K` is only piecewise smooth at
`s=y`. Differentiating it three times and ignoring the resulting point
mass would give a false higher-order determinant calculation. The
following proof differentiates the already integrated transform:

$$
\boxed{(Tq)''(y)=m(y)(q(y)-E q).}                         \tag{1}
$$

This follows directly by differentiating the centered call integral
twice. Consequently, for `k >= 3`, elementary lower-triangular row
operations give

$$
\boxed{
W_k(Tq_1,\ldots,Tq_k)
=m^{k-2}\det\begin{bmatrix}
Tq_1&\cdots&Tq_k\\
(Tq_1)'&\cdots&(Tq_k)'\\
q_1-Eq_1&\cdots&q_k-Eq_k\\
q_1'&\cdots&q_k'\\
\vdots&&\vdots\\
q_1^{(k-3)}&\cdots&q_k^{(k-3)}
\end{bmatrix}.}                                         \tag{2}
$$

For `k=3`, the matrix ends with `q-Eq`; subsequent rows are absent.
Here `W_k` has derivative orders `0,...,k-1` as rows.

## 2. A strictly positive higher-order formula

Define

$$
A(s)=\int_s^1\overline F(r)\,dr,\qquad
Q_y(s)=\frac{K(y,s)}{\overline F(s)}\quad(s>y).
$$

The calculation in PR #52 gives

$$
Q_y'(s)=\frac{m(s)A(s)}{\overline F(s)^2}>0.
$$

The first three rows on the right of (2) are integral operators acting
on `f_j=q_j'`. Their coefficient functions are respectively
`K`, `K_y`, and `K_yy/m`. The ordered three-column coefficient
determinant vanishes outside `s_1<y<s_2<s_3`. Inside that region it is

$$
F(s_1)\overline F(s_2)\overline F(s_3)
\bigl[Q_y(s_3)-Q_y(s_2)\bigr]>0.                         \tag{3}
$$

Expanding only these three rows, antisymmetrizing, and restricting to
the ordered simplex proves the exact formula

$$
\begin{split}
W_k(Tq_1,\ldots,Tq_k)(y)
={}&m(y)^{k-2}\int_{0<s_1<y<s_2<s_3<1}
F(s_1)\overline F(s_2)\overline F(s_3)
[Q_y(s_3)-Q_y(s_2)]\\
&\qquad\times
\det\begin{bmatrix}
f_j(s_1)\\
f_j(y)\\
f_j'(y)\\
\vdots\\
f_j^{(k-4)}(y)\\
f_j(s_2)\\
f_j(s_3)
\end{bmatrix}_{j=1}^k\,ds_1ds_2ds_3 .                  \tag{4}
\end{split}
$$

For `k=3`, omit the entire block of rows at `y`; for `k=4`, that
block consists just of `f_j(y)`. The block initially occurs at the
end of the determinant. Moving its `k-3` rows past the two rows at
`s_2,s_3` entails `2(k-3)` row swaps, so the sign stays positive.
There is no missing factorial: antisymmetrization contributes `1/3!`,
which is canceled by the six ordered regions for the three integration
variables.

### Higher comparison theorem

Suppose the initial Wronskians of `f_j=q_j'` are strictly positive:

$$
\boxed{W_i(f_1,\ldots,f_i)>0\quad(1\le i\le k).}       \tag{5}
$$

Then

$$
W_i(Tq_1,\ldots,Tq_i)>0\quad(1\le i\le k).             \tag{6}
$$

For completeness, (5) implies that every ordered confluent evaluation
determinant of these functions is positive. One elementary proof uses
the identity

$$
W_i(f_1,\ldots,f_i)
=f_1^i W_{i-1}\left((f_2/f_1)',\ldots,(f_i/f_1)'\right)
$$

and induction. A vanishing evaluation determinant would give a
nonzero linear combination with at least `i` zeros counted with
multiplicity. Dividing by the positive `f_1` and applying Rolle's
theorem gives at least `i-1` zeros for a combination of the displayed
`i-1` derivative functions, contradicting the induction hypothesis.
The determinant therefore never vanishes; its sign is positive in
the full confluence limit, where it is a positive Vandermonde factor
times the positive Wronskian. Continuity fixes that sign throughout
the ordered configuration space, including repeated nodes.

Applying this fact to (4) proves strictness for `i>=3`: the source
determinant is positive at every integration configuration, and the
region has positive measure. The cases `i=1,2` follow from the positive
one- and two-column kernels calculated in PR #52.

The first three rows in (4), together with a growing confluent block
at `y`, account exactly for the point-mass terms that appear under
higher differentiation. This is an integral proof of (6), rather than
an assumption that the ordinary derivatives of `K` form a smooth
totally positive kernel.

## 3. Four source columns remove the first anchor again

For a positive even pair `u,v`, retain

$$
H=u/v,\quad B=4u''/v,\quad J=4v''/v,\quad
P=16u^{(4)}/v,\quad Q=16v^{(4)}/v.
$$

At anchor `a>0`, let `r=R(a)>0`, where `R(z)=zU(z)/V(z)`.
The canonical reduced pair is `(b,n)`, satisfying

$$
n+ab=u,\qquad an+4b''=rv.
$$

Write `G` for the centered Green operator from PR #52. Its output has
a common positive prefactor times `T` after the increasing hyperbolic
coordinate change. Thus ratios and Wronskian signs can be computed
using `T`. The previously proved identities and their once-more
differentiated analogues are

$$
n=G B,\quad v=G J,\quad b=-aG H,
$$

$$
4n''=G(P-arJ),\qquad 4v''=G(Q-a^2J),
$$

$$
16b^{(4)}=rGQ-aGP.                                    \tag{7}
$$

The second identity in the second row follows by applying
`4D^2-a^2` to `4v''`; its centered mean is zero because
`E Q=a^4` and `E J=a^2`. The final identity follows from
`4b''=rv-an` and the preceding two identities.

Consequently,

$$
H_1=-a\frac{TH}{TB},\quad B_1=r\frac{TJ}{TB}-a,\quad
J_1=\frac{TP-arTJ}{TB},\quad
P_1=\frac{rTQ-aTP}{TB}.                                \tag{8}
$$

The quotient Wronskian identity

$$
W_k(g_1/h,\ldots,g_k/h)=h^{-k}W_k(g_1,\ldots,g_k)
$$

and constant column elimination now give

$$
\boxed{
W_3(B_1',J_1',-H_1')
=\frac{ar}{(TB)^4}W_4(TB,TJ,TP,TH),}                   \tag{9}
$$

$$
\boxed{
W_3(B_1',J_1',P_1')
=\frac{r^2}{(TB)^4}W_4(TB,TJ,TP,TQ).}                  \tag{10}
$$

These are exact identities when derivatives use the same coordinate.
If one uses `t` on one side and the hyperbolic coordinate `y` on the
other, the positive derivative-change factors must also be included;
the signs are unchanged. For derivative sources a change of variable
multiplies the `k`-column Wronskian by
`(dt/dy)^{k(k+1)/2}`, which for `k=4` is the tenth power.

Thus the additional anchor-free hypotheses

$$
\boxed{
W_4(B',J',P',H')>0,\qquad W_4(B',J',P',Q')>0}          \tag{11}
$$

together with the already known prefix conditions

$$
B'>0,\quad W_2(B',J')>0,\quad W_3(B',J',P')>0
$$

imply both higher source signs for the reduced pair, for **every**
first anchor `a>0`. No limit in the anchor is being taken. This does
not provide the separate origin slope needed at the next reduction.

## 4. The actual theta form

For `u=C,v=kappa`, let `V=-log kappa`. Then

$$
B=tV'-1,\quad J=4\kappa''/\kappa,\quad
P=-4t\kappa'''/\kappa-3J,\quad
H=C/\kappa,\quad Q=16\kappa^{(4)}/\kappa.
$$

Because `W_4(q_1',...,q_4')=W_5(1,q_1,...,q_4)`,
constant column elimination gives the exact formulas

$$
\boxed{
W_4(B',J',P',H')
=\frac{16}{\kappa^5}
W_5(\kappa,t\kappa',\kappa'',t\kappa''',C),}            \tag{12}
$$

$$
\boxed{
W_4(B',J',P',Q')
=\frac{256}{\kappa^5}
W_5(\kappa,t\kappa',\kappa'',t\kappa''',\kappa^{(4)}).} \tag{13}
$$

The first expression uses theta derivatives through order seven; the
second uses derivatives through order eight. Their analytically
removable origin factor is

$$
W_t(q_1',q_2',q_3',q_4')
=(2t)^{10}W_u(q_{1,u},q_{2,u},q_{3,u},q_{4,u}),
\qquad u=t^2.                                        \tag{14}
$$

These identities give two one-variable source-sign problems that
would have been sufficient for the two-variable first-anchor problem.
The companion certificate rules out these particular positive-source
hypotheses, as detailed in section 7.

## 5. Independent diagnostic identities

There is also an exact low-order form useful for evaluating the actual
first reduced source signs. Set `N=n/v`; then

$$
\boxed{
W_3(B_1',J_1',-H_1')
=\frac{r}{aN^4}W_3(N',B',H'),}                         \tag{15}
$$

$$
\boxed{
W_3(B_1',J_1',P_1')
=-\frac{r^2}{N^4}W_3(N',B',J').}                      \tag{16}
$$

For (15), express the numerator as
`W_4(n,4b'',4n'',-b)` and eliminate columns using
`4b''=rv-an`, `4n''=vB-arv+a^2n`, and `b=(u-n)/a`.
The coefficient is `-r/a` multiplying `W_4(n,v,vB,u)`.
Dividing the columns by `v`, then expanding the constant second
column, contributes another minus sign. The proof of (16) uses
`16b^(4)=r vJ-a(4n'')` in the same way.

## 6. Reproducible algebra checks

`theta_higher_transfer_20261111.py` checks the exact column-change
coefficients, the quotient and origin-coordinate factors, and the
integrated differentiation identity. As a fully explicit nontrivial
check, for uniform `mu` and `q_j(s)=s^j/j` it computes positive
Wronskians at orders two through six. The four-column formula (4)
is checked by exact threefold polynomial integration, yielding

$$
W_4(Tq_1,Tq_2,Tq_3,Tq_4)
=\frac{y^3(1-y)^8(y+2)}{86400}>0.
$$

The general proof is the argument in sections 1--3; these finite
symbolic examples are validation of its formulas, not substitutes for
the general argument.

## 7. Actual theta fails the new source hypotheses

The companion rigorous computation
`theta_second_source_obstruction_20261111.py`, with replay
`theta_second_source_obstruction_replay_20261111.json`, proves

$$
\frac{W_4(B',J',P',H')}{t^{10}}<-100000,\qquad
\frac{W_4(B',J',P',Q')}{t^{10}}<-10^{12}
\quad(0<t\le1/16).                                    \tag{17}
$$

It uses an even Taylor coordinate, interval arithmetic, all theta-mode
and Taylor remainders, and a certified value of `C(0)`. Its enclosed
origin limits are approximately `-1.0159763157553e6` and
`-5.43652692374408e12`. Thus no strict-positive assertion in (11) can
hold on the entire positive axis for actual theta.

This is a failure of sufficient hypotheses in this theorem. It is
not a negative value of either reduced determinant in (9)--(10).
In particular, it does not contradict the first preservation theorem
from PR #52, and it does not decide the next preservation or Pick
positivity question.

The exact four-column formula provides a concrete replacement target.
For either source quadruple, put

$$
\Delta_a(s_1,y,s_2,s_3)
=\det\bigl[f_j(s_1),f_j(y),f_j(s_2),f_j(s_3)\bigr]
$$

with evaluation points as rows and the source functions as columns;
the subscript recalls the anchor-dependent hyperbolic coordinate.
Let `w_a` denote the strictly positive factor from (4), including
`m(y)^2`. Define the nonnegative quantities

$$
I_{a,+}(y)=\int w_a\max(\Delta_a,0),\qquad
I_{a,-}(y)=\int w_a\max(-\Delta_a,0),                   \tag{18}
$$

where both integrals use `s_1<y<s_2<s_3`. Equations (9)--(10)
show that the required reduced sign is exactly

$$
\boxed{I_{a,+}(y)>I_{a,-}(y).}                         \tag{19}
$$

The failed local source Wronskians imply negative source evaluation
determinants on sufficiently close configurations around small
positive `t`; hence the negative term cannot simply be discarded.
An actual proof must control these signed integrals, find an
alternative comparison representation, or prove the reduced signs
directly. No estimate proving (19) is asserted here.
