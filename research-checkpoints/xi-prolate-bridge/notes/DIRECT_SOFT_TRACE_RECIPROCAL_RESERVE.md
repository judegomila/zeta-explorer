# Direct soft-trace reciprocal reserve

## 0. Scope and exact statement

This note sharpens the direct soft-trace layer in
`TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md`.  It is an abstract
finite-dimensional theorem and a source target, not an actual-source
asymptotic estimate.

Let

\[
 B\succ0,\qquad r>0,\qquad 0\preceq K\preceq I,
 \qquad
 \mathcal S_r=\operatorname {tr}\{r(B+rI)^{-1}K\}.   \tag{0.1}
\]

For a unit vector \(\omega\), put

\[
 \varepsilon=\langle\omega,B\omega\rangle,
 \qquad c^2=\langle\omega,K\omega\rangle.            \tag{0.2}
\]

Then

\[
 \boxed{\mathcal S_r\geq c^2{r\over\varepsilon+r}.}  \tag{0.3}
\]

When \(c>0\), define the exact reciprocal crowding reserve

\[
 \boxed{
 \mathfrak R_r(\omega)
 ={\varepsilon+r\over c^2}
   \operatorname {tr}\{(B+rI)^{-1}K\}\geq1.}         \tag{0.4}
\]

There is no estimate hidden in this definition.  It gives the exact
factorization

\[
 \boxed{
 \mathcal S_r
 =c^2{r\over\varepsilon+r}\mathfrak R_r(\omega).}   \tag{0.5}
\]

Consequently, along a schedule \(L\to\infty\), if

\[
 c_L\longrightarrow c_T>0,
 \qquad \mathfrak R_{r_L}(\omega_L)=O(1),             \tag{0.6}
\]

then the matched criterion is

\[
 \boxed{
 L^{3/2}\mathcal S_{r_L}\longrightarrow0
 \quad\Longleftrightarrow\quad
 {r_L\over\varepsilon_L+r_L}=o(L^{-3/2}).}           \tag{0.7}
\]

Once either side of (0.7) holds,
\(r_L/(\varepsilon_L+r_L)\to0\), and hence

\[
 {r_L\over\varepsilon_L}
 ={r_L/(\varepsilon_L+r_L)
   \over1-r_L/(\varepsilon_L+r_L)}
 =o(L^{-3/2}).                                       \tag{0.8}
\]

The upper bound on the reserve in (0.6) is needed for the forward
implication from the ratio to the soft trace.  The reverse implication
uses only \(\mathfrak R_r\geq1\) and \(c_L\to c_T>0\).

## 1. Generalized-Rayleigh proof

Set \(M=B+rI\) and

\[
 T=M^{-1/2}KM^{-1/2}\succeq0.                        \tag{1.1}
\]

The soft trace is a Hilbert--Schmidt square:

\[
 {\mathcal S_r\over r}
 =\operatorname {tr}T
 =\|K^{1/2}M^{-1/2}\|_{\rm HS}^2.                   \tag{1.2}
\]

The vector

\[
 v={M^{1/2}\omega\over
       \sqrt{\langle\omega,M\omega\rangle}}         \tag{1.3}
\]

has unit norm.  Positivity gives

\[
 \operatorname {tr}T\geq\langle v,Tv\rangle
 ={\langle\omega,K\omega\rangle
   \over\langle\omega,M\omega\rangle}
 ={c^2\over\varepsilon+r}.                          \tag{1.4}
\]

Multiplication by \(r\) proves (0.3), and (0.4)--(0.5) follow exactly.
Notice that \(K\preceq I\) is not used in (1.4); it supplies the
source-relevant contraction normalization and \(0\leq c^2\leq1\).

Under (0.6), the factor \(c_L^2\mathfrak R_{r_L}\) is bounded above and
bounded away from zero.  Equation (0.5) then proves (0.7).  This is an
equivalence only under the stated bounded-reserve hypothesis.

## 2. Finite blocks and raw coordinates

Suppose now that \(K={\cal A}_T^*{\cal A}_T\), where
\({\cal A}_T\) is the fixed-window observation map.  Let

\[
 W:\mathbb C^m\longrightarrow\mathcal H,
 \qquad W^*W=I,
 \qquad E=W^*BW,
 \qquad C={\cal A}_TW.                               \tag{2.1}
\]

There is an exact finite-block lower bound

\[
 \boxed{
 \mathcal S_r
 \geq r\operatorname {tr}\{C(E+rI)^{-1}C^*\}.}      \tag{2.2}
\]

To prove it, define

\[
 V=M^{1/2}W(E+rI)^{-1/2}.                             \tag{2.3}
\]

Since \(W^*MW=E+rI\), one has \(V^*V=I\).  Compressing the positive
operator \(T\) from (1.1) to the range of \(V\) gives

\[
\begin{aligned}
 \operatorname {tr}T
 &\geq\operatorname {tr}(V^*TV)\\
 &=\operatorname {tr}\!\left\{
   (E+rI)^{-1}W^*KW\right\}\\
 &=\operatorname {tr}\{C(E+rI)^{-1}C^*\},           \tag{2.4}
\end{aligned}
\]

which proves (2.2).  This is the shorted-inverse block lower bound.  It
does **not** identify the compression of the complete inverse with the
inverse of a compression.

The same statement is basis-free in raw coordinates.  If \(U\) is any
injective synthesis, set

\[
 G=U^*U,\qquad E_U=U^*BU,\qquad C_U={\cal A}_TU.      \tag{2.5}
\]

Using \(W=UG^{-1/2}\) in (2.2) yields

\[
 \boxed{
 \mathcal S_r
 \geq r\operatorname {tr}\!\left\{
 C_U(E_U+rG)^{-1}C_U^*\right\}.}                    \tag{2.6}
\]

The right side is invariant under \(U\mapsto US\) for every nonsingular
\(S\).  For every nonzero raw coefficient vector \(x\), (1.4) also gives

\[
 \operatorname {tr}\{(B+rI)^{-1}K\}
 \geq{x^*U^*KUx\over x^*(E_U+rG)x}.                 \tag{2.7}
\]

Thus the one-vector reciprocal reserve is exactly the rank-one member of
the generalized block statement.

## 3. The reciprocal tail measure

The total-trace threshold bound loses information above its one chosen
threshold.  The exact replacement retains the reciprocal moment of that
tail.  Let \(E_B\) be the spectral measure of \(B\) and define

\[
 \mu(\Omega)
 =\operatorname {tr}\{\mathcal A_T E_B(\Omega)
                         \mathcal A_T^*\},            \tag{3.1}
\]

\[
 \Phi(u)=\mu((0,u]),
 \qquad
 H(u)=\int_{(u,\infty)}{1\over\beta}\,d\mu(\beta).
                                                               \tag{3.2}
\]

Finite spectral calculus gives

\[
 \mathcal S_r
 =\int_{(0,\infty)}{r\over\beta+r}\,d\mu(\beta).   \tag{3.3}
\]

On \((0,u]\), the integrand is at most one, while on \((u,\infty)\)
it is at most \(r/\beta\).  Therefore

\[
 \boxed{\mathcal S_r\leq\Phi(u)+rH(u).}              \tag{3.4}
\]

The sharper source estimate to prove by this route is consequently

\[
 \boxed{
 \Phi_L(u_L)+r_LH_L(u_L)=o(L^{-3/2}).}                \tag{3.5}
\]

No factor \(\operatorname {tr}K=O(L)\) has been inserted in (3.5).

The transverse state still imposes an exact reciprocal-tail obstruction.
Write \(P=E_B((0,u])\) and \(F=I-P\).  Then

\[
 \sqrt{\Phi(u)}=\|\mathcal A_TP\|_{\rm HS},
 \qquad
 \sqrt{H(u)}=\|\mathcal A_TFB^{-1/2}\|_{\rm HS}.    \tag{3.6}
\]

Since \(F\) commutes with \(B\),

\[
\begin{aligned}
 c=\|\mathcal A_T\omega\|
 &\leq\|\mathcal A_TP\omega\|
       +\|\mathcal A_TF\omega\|\\
 &\leq\sqrt{\Phi(u)}
       +\sqrt{H(u)}\,\|B^{1/2}F\omega\|\\
 &\leq\sqrt{\Phi(u)}+\sqrt{\varepsilon H(u)}.
                                                               \tag{3.7}
\end{aligned}
\]

Hence

\[
 \boxed{
 H(u)\geq
 {\bigl(c-\sqrt{\Phi(u)}\bigr)_+^2\over\varepsilon}.} \tag{3.8}
\]

Because \(B\succ0\), \(E_B((0,0])=0\), and (3.8) gives

\[
 \boxed{H(0)\geq{c^2\over\varepsilon}.}             \tag{3.9}
\]

Thus a small low layer transfers the captured transverse mass into the
reciprocal tail; it does not make that mass disappear.  In contrast with
the older total-trace threshold, however, the necessary ratio appears at
the matched \(o(L^{-3/2})\) scale when the reserve stays bounded.

## 4. Exact diagonal no-go families for a single threshold

The exponent \(L^{-5/2}\) in the earlier sufficient condition is a loss
from replacing a reciprocal tail by one threshold times the total trace.
This is a statement of logical non-necessity in the abstract operator
class, not an estimate for the source matrix.

For an integer \(n\geq2\), take dimension \(d=n\) and

\[
 B_n=\operatorname {diag}(1,n,\ldots,n),\qquad
 K_n=I_n,\qquad r_n={1\over n^2},\qquad\omega_n=e_1. \tag{4.1}
\]

Here \(\varepsilon_n=c_n^2=1\), and direct summation gives

\[
 \boxed{
 \mathcal S_n
 ={1\over n^2+1}+{n-1\over n^3+1}.}                 \tag{4.2}
\]

Both summands are smaller than \(n^{-2}\), so

\[
 0\leq n^{3/2}\mathcal S_n<{2\over\sqrt n}
 \longrightarrow0.                                  \tag{4.3}
\]

Nevertheless \(r_n/\varepsilon_n=n^{-2}\) is not
\(o(n^{-5/2})\).  At \(u=1/2\), the direct profile and reciprocal tail are

\[
 \Phi_n(1/2)=0,
 \qquad H_n(1/2)=1+{n-1\over n}=2-{1\over n},        \tag{4.4}
\]

so the sharper upper bound \(r_nH_n(1/2)\) has the correct
\(O(n^{-2})\) scale.  The one-threshold/total-trace upper bound instead is

\[
 {r_n\over u+r_n}\operatorname {tr}K_n
 +{u\over u+r_n}\Phi_n(u).
                                                               \tag{4.5}
\]

At \(u=1/2\), (4.5) equals

\[
 {2n\over n^2+2}=\Theta(n^{-1}),                    \tag{4.6}
\]

and therefore fails after multiplication by \(n^{3/2}\).

In fact every threshold fails.  For \(0<u<1\), \(\Phi_n(u)=0\), and
(4.5) is strictly larger than

\[
 {nr_n\over1+r_n}={n\over n^2+1}.                   \tag{4.7}
\]

For \(1\leq u<n\), one has \(\Phi_n(u)=1\), so (4.5) is at least one;
for \(u\geq n\), it equals \(n\).  The infimum of (4.5) over all
\(u>0\) is thus \(n/(n^2+1)\), approached from below the first spectral
atom, and

\[
 n^3\left({n\over n^2+1}\right)^2
 ={n^5\over(n^2+1)^2}\geq {n\over4}\longrightarrow\infty. \tag{4.8}
\]

The reserve in this family is not responsible for the failure:

\[
 \mathfrak R_n
 =1+{(n-1)(1+n^{-2})\over n+n^{-2}}<2.               \tag{4.9}
\]

There is also an exponentially small-energy rational version.  Set

\[
 \delta_n=2^{-n},\qquad
 \widetilde B_n=\operatorname {diag}(\delta_n,1,\ldots,1),
 \qquad \widetilde r_n={\delta_n\over n^2},
 \qquad K_n=I_n,qquad\omega_n=e_1.                 \tag{4.10}
\]

Then

\[
 \widetilde{\mathcal S}_n
 ={1\over n^2+1}
 +(n-1){\widetilde r_n\over1+\widetilde r_n},       \tag{4.11}
\]

so \(n^{3/2}\widetilde{\mathcal S}_n\to0\) and
\(\widetilde r_n/\delta_n=n^{-2}\), while every one-threshold bound has
infimum \(n/(n^2+1)\) and again fails by (4.8).  Its reserve is also
bounded and tends to one.  This exact dyadic family rules out any reliance
on decimal or binary64 input in the regression.

## 5. A two-by-two Feshbach check

The complete inverse and its block lower bounds can be checked without a
diagonal basis.  Take

\[
 B=\begin{pmatrix}2&1\\1&3\end{pmatrix},qquad
 r=1,qquad
 \mathcal A_T=\begin{pmatrix}1/3&2/3\end{pmatrix}.   \tag{5.1}
\]

Then exact inversion gives

\[
 \mathcal S_1={4\over33}={1\over99}+{1\over9}.       \tag{5.2}
\]

The second equality is the Feshbach decomposition which first eliminates
the second coordinate:

\[
 { (1/3-(1/4)(2/3))^2\over 3-1/4}
 +{(2/3)^2\over4}
 ={1\over99}+{1\over9}.                              \tag{5.3}
\]

For the unregularized reciprocal trace the analogous identity is

\[
 \operatorname {tr}(B^{-1}K)
 ={7\over45}={1\over135}+{4\over27}.                 \tag{5.4}
\]

The visible second-coordinate term \(1/9\) is the one-column instance of
(2.2) at \(r=1\).  The term \(4/27\) is its unregularized reciprocal
counterpart, obtained after dividing (2.2) by \(r\) and taking
\(r\downarrow0\), equivalently from
`tr(B^(-1)K)>=tr(C E^(-1) C^*)`.  The remaining Feshbach squares are
nonnegative.

## 6. Claim boundary

For the Xi--prolate source specialization, \(B\), \(K_T\), \(r\), and
\(\omega\) must still be rebuilt from the source-pinned combined matrix
and source-normalized projected state.  The exact pole, archimedean, and
minus-prime blocks must be combined before forming \(B\), and combined
residuals must be preserved before absolute values.

This note does not prove a bounded actual-source reciprocal reserve, either
shifted-sector sign, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally
uniform determinant convergence, or the Riemann hypothesis.  The diagonal
families only prove that a previously used sufficient exponent is not
necessary for the abstract soft trace.  They do not model the arithmetic
orientation of the source.  Numerical agreement is not a theorem, and the
formal project state remains `P0_INVALIDATED`.
