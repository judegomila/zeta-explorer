# Paired resolvent: exact folded source Hankel obstruction

## 0. Scope and conclusion

This note strengthens the pole-load crossing audit by using the facts that
the two nonpole blocks are parity compressions of the **same** locked
Bernstein--Levy operator and that their pole vectors are the source
hyperbolic functions.  Folding the common operator to the positive half of
the logarithmic interval gives one exact signed Hankel form for the
difference of the loaded odd and even blocks.

At the source pole load, the continuous Hankel density changes sign at the
plastic-constant scale.  A smooth bump can avoid every finite prime-power
atom and gives a strictly negative direction whenever the logarithmic
length exceeds that scale.  Consequently the full folded source forms do
not admit the global Loewner comparison `Q_-(1) succeq Q_+(1)` beyond that
threshold.  This is stronger than a generic two-point countermodel, because
the obstruction is derived from the actual archimedean Levy density, the
actual hyperbolic pole vectors, the inclusive prime inventory, and the
source minus-prime convention.

A negative direction of the block difference does **not** order the two
lowest eigenvalues.  The sign of the paired crossing function
`F_+(z)+F_-(z)` therefore remains unresolved.  No zero table, assumed
critical-line statement, or global Weil positivity is used.  The result
does not prove a shifted sector sign, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or a determinant limit.  The formal project state
remains `P0_INVALIDATED`.

## 1. Locked common Levy operator

Put

\[
 a=\log\lambda,\qquad L=2a,\qquad I=(-a,a),                 \tag{1.1}
\]

use Lebesgue measure, and extend every function by zero outside `I`.  The
positive nonpole source measure is

\[
 \nu_\lambda(dh)=
 \frac{e^{-|h|/2}}{1-e^{-2|h|}}\,dh
 +\sum_{1<n\leq\lambda^2}\frac{\Lambda(n)}{\sqrt n}
   (\delta_{\log n}+\delta_{-\log n})(dh).                  \tag{1.2}
\]

The endpoint is inclusive.  Only prime powers have nonzero weight, but the
formula retains the source inventory exactly as `n<=lambda^2`.  The minus
sign on the prime block in source equation (3.19) is what makes the atoms
in the pole-deleted translation energy (1.2) positive; changing that sign
would change every identity below.

Let `mathscr A` be the zero-extension Levy operator with closed form

\[
 \mathfrak a(f,g)=\frac12\int_{\mathbb R}\!\int_{\mathbb R}
 \overline{\widetilde f(x+h)-\widetilde f(x)}
 \{\widetilde g(x+h)-\widetilde g(x)\}\,dx\,\nu_\lambda(dh).
                                                               \tag{1.3}
\]

Write `mathscr A_+` and `mathscr A_-` for its inversion-even and
inversion-odd restrictions.  On `H=L^2(0,a)` introduce the unitary folds

\[
 (U_+u)(x)=2^{-1/2}u(|x|),\qquad
 (U_-u)(x)=2^{-1/2}\operatorname {sgn}(x)u(|x|).              \tag{1.4}
\]

For `h>0` abbreviate

\[
 \rho(h)=\frac{e^{-h/2}}{1-e^{-2h}},\qquad
 j_\lambda(dh)=\rho(h)\,dh+
 \sum_{1<n\leq\lambda^2}\frac{\Lambda(n)}{\sqrt n}
 \delta_{\log n}(dh).                                      \tag{1.5}
\]

The corresponding half-interval Hankel form is

\[
\begin{aligned}
 \mathfrak h_j(u,v)
 &=\int_0^a\!\int_0^a
       \overline{u(x)}v(y)\rho(x+y)\,dx\,dy\\
 &\quad+\sum_{1<n\leq\lambda^2}\frac{\Lambda(n)}{\sqrt n}
 \int_{\max(0,\log n-a)}^{\min(a,\log n)}
       \overline{u(x)}v(\log n-x)\,dx .                    \tag{1.6}
\end{aligned}
\]

An atom at `log n=L` has a zero integration interval, as required by zero
extension, but it remains in the audited source inventory.

## 2. Exact folded block difference

### Theorem 2.1 (common-source Hankel identity)

As forms on their common domain in `H`,

\[
 \boxed{U_-^*\mathscr A_-U_- -U_+^*\mathscr A_+U_+
       =2\mathcal H_{j_\lambda},}                         \tag{2.1}
\]

where `mathcal H_j` denotes the operator/form in (1.6).

**Proof.**  The diagonal killing term and the interactions between two
points on the same half-interval are identical under the two folds.  For
`x,y>0`, reflection changes the separation of the cross-half interaction
to `x+y`.  The two parity signs give respectively the kernels

\[
 -j_\lambda(x+y)\quad\hbox{and}\quad+j_\lambda(x+y).
\]

Their difference is `2j_lambda(x+y)`.  For the continuous part this is the
first integral in (1.6).  For an atom at `log n`, the reflected translation
constraint is `x+y=log n`; integrating the delta distribution gives the
second line of (1.6), with no extra Jacobian.  This proves (2.1).  \(\square\)

Let

\[
 c(x)=\cosh(x/2),\qquad s(x)=\sinh(x/2).                  \tag{2.2}
\]

The full-interval pole Riesz vectors fold to `sqrt(2)c` and `sqrt(2)s`.
For an audit load `t>=0`, therefore, the folded loaded blocks are

\[
 \mathcal Q_+(t)=U_+^*\mathscr A_+U_++4t|c\rangle\langle c|,
 \qquad
 \mathcal Q_-(t)=U_-^*\mathscr A_-U_--4t|s\rangle\langle s|.
                                                               \tag{2.3}
\]

The source is the single value `t=1`.  Combining (2.1) with

\[
 c(x)c(y)+s(x)s(y)=\cosh((x+y)/2)                         \tag{2.4}
\]

gives the exact comparison

\[
 \boxed{
 \mathcal Q_-(t)-\mathcal Q_+(t)
 =2\mathcal H_{\,j_\lambda-2t\cosh(h/2)dh}.}             \tag{2.5}
\]

Thus the paired parity problem is not governed merely by the two pole
norms.  It is governed by one source-pinned signed Hankel measure.

## 3. Sharp continuous sign and a source counterdirection

At `t=1`, the absolutely continuous density in (2.5), before the outer
factor two, is

\[
 \sigma(h)=\rho(h)-2\cosh(h/2)
 =\frac{e^{-5h/2}}{1-e^{-2h}}-e^{h/2}.                    \tag{3.1}
\]

With `y=e^h`,

\[
 \sigma(h)=\frac{1+y-y^3}{\sqrt y\,(y^2-1)}.             \tag{3.2}
\]

Let `varrho>1` be the unique root of
`varrho^3-varrho-1=0` and put `h_*=log(varrho)`.  The denominator in
(3.2) is positive and the numerator is strictly decreasing after its
unique positive crossing, so

\[
 \sigma(h)>0\ (0<h<h_*),\qquad
 \sigma(h_*)=0,\qquad
 \sigma(h)<0\ (h>h_*).                                  \tag{3.3}
\]

### Theorem 3.1 (prime-atom-avoiding negative direction)

If `L>h_*`, then

\[
 \boxed{\mathcal Q_-(1)-\mathcal Q_+(1)\not\succeq0.}    \tag{3.4}
\]

**Proof.**  The set

\[
 \{\log n:1<n\leq\lambda^2,\ \Lambda(n)>0\}
\]

is finite.  Choose `d in (h_*,L)` outside that set, and then choose
`epsilon>0` so that

\[
 (d-2\epsilon,d+2\epsilon)\subset(h_*,L)
\]

and the interval contains no prime-power logarithm.  Take a nonzero
nonnegative `u in C_c^infty(0,a)` supported in
`(d/2-epsilon,d/2+epsilon)`.  Every sum `x+y` on the support lies in the
chosen atom-free interval.  Hence all atomic terms in (1.6) vanish, while
(3.3) gives

\[
 \langle u,(\mathcal Q_-(1)-\mathcal Q_+(1))u\rangle
 =2\int_0^a\!\int_0^a u(x)u(y)\sigma(x+y)\,dx\,dy<0.
                                                               \tag{3.5}
\]

This proves (3.4).  \(\square\)

The threshold is `L>h_*`, equivalently `lambda>sqrt(varrho)`.  It is a
failure of a global **uncompressed** form comparison, not a proof that the
odd ground is lower.  Indefinite self-adjoint differences can have either
ordering of their lowest eigenvalues.  The bump in Theorem 3.1 is not, at a
fixed `N`, a vector in either finite parity compression.  Transferring this
counterdirection to a particular finite schedule would require a separate
Galerkin-density estimate and a common identification of its folded even
and odd spaces; no such finite-compression claim is made here.

## 4. Paired resolvent as a pole-load derivative

For a locked finite compression, let

\[
 F_\pm(z)=\langle p_\pm,(\mathscr A_\pm-zI)^{-1}p_\pm\rangle,
                                                               \tag{4.1}
\]

where `z` is outside both nonpole spectra and `p_+`, `p_-` are the
projected full-interval hyperbolic Riesz vectors.  Define

\[
 H_+(t)=\mathscr A_++2t|p_+\rangle\langle p_+|,
 \qquad
 H_-(t)=\mathscr A_--2t|p_-\rangle\langle p_-|.          \tag{4.2}
\]

Jacobi's determinant formula gives the exact identity, where the displayed
logarithm denotes the local analytic logarithmic derivative at `t=0`
(equivalently `D'(0)/D(0)` for the determinant ratio),

\[
 \boxed{
 F_+(z)+F_-(z)
 =\frac12\left.\frac{\partial}{\partial t}
 \log\frac{\det(H_+(t)-zI)}{\det(H_-(t)-zI)}
 \right|_{t=0}.}                                        \tag{4.3}
\]

Indeed, the two logarithmic derivatives are `2F_+(z)` and `-2F_-(z)`.
At a nonexceptional parity collision the secular equations still give
`F_+(z_c)+F_-(z_c)=0`, so (4.3) says that the determinant ratio is
stationary to first order in pole load at that spectral point.  The signed
Hankel counterdirection in Theorem 3.1 supplies no sign for this derivative:
resolvents weight every spectral direction, not only the bump in (3.5).

## 5. Remaining obligation

The source-specific crossing problem is now equivalently a sign problem
for the derivative (4.3), with the exact spatial comparison (2.5) available.
The natural attempted full-form shortcut

\[
 \mathcal Q_-(1)\succeq\mathcal Q_+(1)
\]

is rigorously unavailable once the full logarithmic interval passes the
threshold in Theorem 3.1.  This does not by itself decide the corresponding
finite compressed comparison for an arbitrary `N(lambda)`.  A successful
proof must instead control the ground-specific paired resolvents through
cancellation in the signed Hankel measure, including its discrete
prime-power reflections.  Nothing in this note establishes that control or
orders the actual two lowest source eigenvalues.
