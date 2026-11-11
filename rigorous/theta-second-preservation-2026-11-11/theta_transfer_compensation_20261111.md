# A single-crossing compensation theorem for the theta comparison

**Role in the completed checkpoint.** This is a proof component. The [global theorem](theta_second_preservation_global_20261111.md) combines the source crossing, compensation, first-source origin, and second-origin results to prove second preservation and five-node positivity. Statements below limiting an individual component retain that local scope.


Research continuation, 11 November 2026. This note proves that a
single negative-to-positive crossing of the fourth source Wronskian
cannot create a later negative crossing of its centered-call
transform. The missing information is the sign of the transformed
quantity near the origin. In particular, negative source signs near
the origin do not themselves obstruct positive transformed signs.

## 1. Assumptions and notation

Use the centered-call operator and derivative kernel from
`theta_higher_transfer_20261111.md`:

$$
Af(y)=\int_0^1 K(y,z)f(z)\,dz,
\qquad Aq'=Tq.
$$

The probability density is smooth and strictly positive on `(0,1)`.
Assume the initial source functions satisfy

$$
f_1>0,\qquad W_2(f_1,f_2)>0,\qquad
W_3(f_1,f_2,f_3)>0.                                    \tag{1}
$$

All needed integrals and differentiated integrals are assumed
absolutely convergent. The finite-interval version follows, for
example, when the functions and density extend smoothly to the closed
interval and the generalized coordinates below are regular there.
Section 7 explains the endpoint conditions in the theta application.

Let

$$
g_i=Af_i\quad(i=1,2,3),\qquad
G(y)=W_3(g_1,g_2,g_3)(y)>0.
$$

The strict sign follows from the three-column transfer proved in
PR #52. For a fourth source function define

$$
I(y)=W_4(g_1,g_2,g_3,Af_4)(y).                         \tag{2}
$$

The theorem concerns the sign of this `I`.

## 2. The generalized third derivative of the source

Use the increasing coordinate

$$
x=\frac{f_2}{f_1},\qquad
Y(x)=\frac{f_3}{f_1},\qquad h(x)=\frac{f_4}{f_1},
\qquad w(x)=Y''(x)>0.
$$

Primes on `Y,h,w` in this section mean derivatives in `x`.
Define

$$
\boxed{\rho(x)=\frac{d}{dx}\left(\frac{h''(x)}{w(x)}\right).} \tag{3}
$$

Common-factor and coordinate-change identities give

$$
\boxed{
W_4(f_1,f_2,f_3,f_4)(z)
=f_1(z)^4\left(\frac{dx}{dz}\right)^6 w(x(z))^2\rho(x(z)).}
                                                               \tag{4}
$$

Every factor preceding `rho` is strictly positive. In particular,
source-Wronskian crossings and `rho` crossings have the same locations
under the increasing coordinate change and the same orientation.

For a knot `s` in the range of `x`, put

$$
R_s(x)=\begin{cases}
Y(x)-Y(s)-Y'(s)(x-s),&x>s,\\
0,&x\le s.
\end{cases}                                             \tag{5}
$$

Equivalently,

$$
R_s(x)=\int_s^x(x-r)w(r)\,dr\quad(x>s).
$$

If the range starts at a finite endpoint `ell` where the relevant
jets extend continuously, two integrations of
`h''=w[c+integral rho]` give

$$
h(x)=c_0+c_1x+c_2Y(x)+\int_\ell^x R_s(x)\rho(s)\,ds.    \tag{6}
$$

More generally the same representation can be localized and passed
to an endpoint limit when the expressions below are absolutely
convergent. The proof does not discard an infinite boundary term:
either (6) holds with finite constants, or that limiting argument
must be justified.

Define

$$
H_s(y)=A[f_1R_s(x(\cdot))](y),\qquad
\Pi(y,s)=W_4(g_1,g_2,g_3,H_s)(y).                       \tag{7}
$$

The Wronskian annihilates the first three columns, so (6), linearity,
and Fubini yield the exact generalized Peano representation

$$
\boxed{I(y)=\int \Pi(y,s)\rho(s)\,ds.}                 \tag{8}
$$

The remaining work is to prove the needed properties of `Pi`.

## 3. Positivity of truncated-remainder evaluation determinants

The kernel `R_s(x)` is totally nonnegative: all its determinants with
increasing rows `x_i` and increasing columns `s_j` are nonnegative.
Here is a direct reason, rather than an assumed kernel property.
The step kernel `1_{x>r}` has every ordered minor equal to zero or
one. By continuous Cauchy--Binet, products/compositions of these
kernels with positive integration weights have nonnegative minors.
Since

$$
R_s(x)=\int (x-r)_+ w(r)1_{r>s}\,dr,
\qquad (x-r)_+=\int 1_{x>v}1_{v>r}\,dv,
$$

`R` is such a composition of three step kernels. All integrations can
be restricted to a finite interval containing the evaluation points
and knots, so this argument needs no improper-integral assumption.

We also need to append the initial columns `1,x,Y`. For any finite
configuration, choose three auxiliary knots

$$
r_1<r_2<r_3<\min\{x_i,s_j\}
$$

inside the coordinate interval. On all evaluation points,

$$
R_{r_j}(x)=Z(r_j)-Y'(r_j)x+Y(x),\qquad
Z(r)=rY'(r)-Y(r).
$$

The coefficient determinant for these three columns is strictly
positive. Indeed, `Y'` increases and `dZ/d(Y')=r` increases, so
`Z` is strictly convex as a function of `Y'`. Consequently the
ordered evaluation determinant of `1,Y',Z` is positive. Reversing
its columns and changing the sign of the middle one gives exactly
the same positive sign for the coefficient rows `Z,-Y',1`.

Dividing the corresponding nonnegative `R` determinant by this
positive coefficient determinant proves

$$
\det[1,x,Y,R_{s_1},\ldots,R_{s_j}](x_i)\ge0
\quad(s_1<\cdots<s_j).                                 \tag{9}
$$

Multiplying every evaluation row by its positive `f_1` gives the
same assertion for `f_1,f_2,f_3,f_1R_{s_1},...`. First-order
confluent evaluation rows follow by taking ordered limits divided
by positive node spacings. They exist because each `R_s` is `C^1`.

## 4. The Peano kernel is positive and TP2

Apply the exact four-column transfer integral to
`f_1,f_2,f_3,f_1R_s`. By (9), its source determinant is
nonnegative, hence `Pi(y,s)>=0`.

The inequality is strict for every interior `y,s`. To see this,
work in the increasing coordinate `x` and use the integration
configurations with ordered nodes `x_1<x(y)<x_2<x_3`:

* If `s<x(y)`, choose `x_1<s<x(y)<x_2<x_3`. Subtract
  `Y-Y(s)-Y'(s)(x-s)` from the final column. Only its first entry
  remains, and it is strictly negative by strict convexity. Its
  cofactor has negative sign and a positive three-column evaluation
  determinant. Their product is strictly positive.
* If `s>x(y)`, choose `x_1<x(y)<x_2<s<x_3`. The final column
  has only its last entry nonzero; that entry and its cofactor are
  both positive.

Each choice occupies a positive-measure set of integration points.
For `s=x(y)`, choose `x_1<s=x(y)<x_2<x_3`; the first argument
still gives a strictly positive determinant. Therefore

$$
\boxed{\Pi(y,s)>0.}                                    \tag{10}
$$

Now fix two knots `s_1<s_2`. The five-column transfer formula uses
the source rows at `z_1,y,y,z_2,z_3`, with the second row at `y`
differentiated once in its confluent copy. Formula (9) and its
confluent limit give

$$
W_5(g_1,g_2,g_3,H_{s_1},H_{s_2})\ge0.                  \tag{11}
$$

The required determinant identity is

$$
\boxed{
W_2(\Pi(\cdot,s_1),\Pi(\cdot,s_2))
=G\,W_5(g_1,g_2,g_3,H_{s_1},H_{s_2})\ge0.}            \tag{12}
$$

For a direct verification, let
`Lh=W_4(g_1,g_2,g_3,h)/G`, the monic third-order differential
operator annihilating the three initial columns. Apply the row
operators `1,D,D^2,L,DL` to the five-column Wronskian. These are
unit triangular changes of the ordinary derivative rows. Its last
two rows vanish in the first three columns, giving

$$
W_5(g_1,g_2,g_3,h,k)=G W_2(Lh,Lk).
$$

Since `Pi_s=G LH_s`, equation (12) follows. This proof also fixes
the orientation and the factor of `G`; neither is implicit.

Combining (10) and (12), the ratio
`Pi(y,s_2)/Pi(y,s_1)` is nondecreasing in `y`. Equivalently,

$$
\boxed{
\Pi(y_1,s_1)\Pi(y_2,s_2)
-\Pi(y_1,s_2)\Pi(y_2,s_1)\ge0
\quad(y_1<y_2,\ s_1<s_2).}                             \tag{13}
$$

This is the TP2 property used below. It has been proved for the
actual Peano kernel, not inferred merely from its nonnegativity.

## 5. Single-crossing compensation

Assume there is a knot `s_*` such that

$$
\rho(s)\le0\ (s<s_*),\qquad \rho(s)\ge0\ (s>s_*).
                                                               \tag{14}
$$

For `y>=y_0`, the TP2 inequality says that

$$
r(s)=\frac{\Pi(y,s)}{\Pi(y_0,s)}
$$

is nondecreasing in `s`. Thus
`[r(s)-r(s_*)]rho(s)>=0` on both sides of the crossing, and
absolute convergence allows integration:

$$
\boxed{
I(y)\ge
\frac{\Pi(y,s_*)}{\Pi(y_0,s_*)}\,I(y_0).}              \tag{15}
$$

In particular, if `I(y_0)>0`, then `I(y)>0` for every later `y`.
The output can have at most one sign crossing, in the
negative-to-positive direction. Therefore:

**Compensation theorem.** Under (1), the stated endpoint conditions,
and a single negative-to-positive crossing of the fourth source
Wronskian, positivity of the transformed fourth Wronskian on any
sufficiently small initial interval implies its positivity throughout
the open interval.

A positive leading coefficient after removing a known vanishing
origin factor supplies the required initial interval. A zero endpoint
value by itself does not supply it.

This theorem has a genuine extra premise beyond the source crossing:
the transformed origin sign still has to be proved. Positive source
tails and a single crossing alone do not establish that premise.

## 6. A fully explicit example

Take uniform probability measure on `(0,1)` and source prefix
`f_1=1,f_2=x,f_3=x^2`. Then `w=2` and `R_s(x)=(x-s)_+^2`.
Direct exact integration gives

$$
\Pi(y,s)=\frac1{17280}\begin{cases}
s^4(1-y)^8,&s\le y,\\
y^3(1-s)^4(1-y)^3(4s-y^2-3y),&s\ge y.
\end{cases}                                             \tag{16}
$$

Both expressions are positive inside the interval and agree on the
diagonal. Their two-knot Wronskians are nonnegative in all three
regions separated by the knots.

For `rho(s)=s-c`, formula (8) evaluates to

$$
I(y)=\frac{y^3(1-y)^8}{3628800}
\bigl[8y^2+(19-14c)y+8-28c\bigr].                       \tag{17}
$$

For example, `c=1/4` makes the source generalized derivative
negative on `(0,1/4)` and positive thereafter, while

$$
I(y)=\frac{y^3(1-y)^8}{3628800}
\left(8y^2+\frac{31}{2}y+1\right)>0
$$

everywhere in `(0,1)`. This example exhibits the compensation mechanism
without relying on numerical sampling.

## 7. Application and endpoint checks for actual theta

For each fixed first anchor use the hyperbolic source coordinate and
set

$$
(f_1,f_2,f_3,f_4)=(B',J',P',H')
\quad\hbox{or}\quad(B',J',P',Q').
$$

The initial three conditions (1) are exactly the prefix conditions
proved in PR #52. The increasing coordinate and source ratios
`x=J'/B'`, `Y=P'/B'`, and `h=H'/B'` or `Q'/B'` are independent
of the choice between the original spatial coordinate and its
hyperbolic reparametrization.

At the spatial origin all these derivative ratios are analytic in
`t^2`. The positive normalized second and third prefix Wronskians
from PR #52 imply
`x(t)=ell+d t^2+O(t^4)` with `d>0`, and a finite strictly positive
limit of `Y''(x)`. Thus `Y,h` have the finite initial jets needed
in (6), and `rho` is locally bounded.

At infinity, let `p=pi exp(t)`. The theta first-mode expansion gives

$$
B'\sim tp,\quad J'\sim8p^2,\quad P'\sim12tp^3,
$$

$$
x\sim8p/t,\qquad Y\sim12p^2,\qquad
\frac{dx}{dt}\sim8p/t,\qquad Y''(x)\sim3t^2/8.
$$

Differentiated versions follow from the same theta-mode expansion.
The ratios, inverse coordinate derivatives, and `rho` therefore
grow at most polynomially in `t` and `exp(t)`; the decaying `H`
case is included in that upper bound. For a large knot `s=x(t_s)`,
the source `f_1R_s(x(t))` vanishes below `t_s`. Above `t_s` it is
a combination of the initial three source functions with coefficients
of at most the same type of growth. Its primitive has such a bound
as well. The fixed-anchor tilted theta density decays as a polynomial
times `exp[-pi exp(t)+a t/2]`. Hence `H_s` and its needed derivatives,
uniformly for the output point in a compact interior interval, have
a double-exponentially decaying bound in `t_s` times polynomial
factors. This dominates the growth of `rho(s) ds/dt_s` and justifies
the Fubini and differentiated Peano integrals. Near the lower endpoint
the already established finite jets supply integrability.

It follows that the compensation theorem applies once two independent
inputs are available for each of the two actual theta sources:

1. A single negative-to-positive crossing of the original source
   Wronskian on the full positive axis.
2. A strictly positive normalized origin coefficient of the actual
   first reduced source determinant for every positive first anchor.

The companion single-crossing certificates address the first input.
The second input is a separate anchor-uniform statement; this note
does not assert it. If both are established, (9)--(10) of the higher
transfer note and (15) here give the desired first reduced source
signs for every anchor and every positive spatial point. The next
origin slope remains a further condition for full second preservation.

## 8. Exact verification

`theta_transfer_compensation_20261111.py` checks the source derivative
factor, the Sylvester identity with nonconstant prefix functions, the
uniform-density Peano kernel, its two-knot Wronskians in every region,
and the signed polynomial example by exact integration. These checks
validate the formulas; sections 2--5 supply the general proof.
