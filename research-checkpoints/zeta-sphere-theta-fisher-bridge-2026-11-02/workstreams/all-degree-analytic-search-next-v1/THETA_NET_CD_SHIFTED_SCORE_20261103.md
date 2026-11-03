# The complete modular payment as one shifted score

## Result and scope

The endpoint trace and reflection cost can be combined before any estimate.
Under the positive normalized prefix through degree `n`, let

\[
 F_j=T_j(D)\psi,\qquad b_j=\sigma_j/\sigma_{j-1},\qquad
 T_{j+1}(x)=xT_j(x)+b_jT_{j-1}(x).
\]

Only `sigma_0,...,sigma_n` are assumed positive. The monic `T_(n+1)` is
already determined by that prefix. Put

\[
 F=F_{n+1},\quad G=T_{n+1}'(D)\psi,\quad V=|h|F_n,
 \quad S=2hF+G-V,\quad A=G+V.
\]

Then the exact full-conservation target is

\[
 \boxed{\displaystyle
 \mathcal W_n:=\frac{\sigma_{n+1}}{\sigma_n}
       +4\{\operatorname{tr}\mathsf H-d^T\mathsf H e_n\}
 =\frac{\|S\|_2^2-\|A\|_2^2}{2\sigma_n}.}                 \tag{1}
\]

Equivalently, it is the single complete-profile correlation

\[
 \boxed{\displaystyle
 \mathcal W_n=\frac4{\sigma_n}\int_0^\infty
 h(F_{n+1}-F_n)\,T_{n+1}(D)(h\psi)\,dh.}                \tag{2}
\]

These are all-degree identities, with no separate bound on the direct
reserve, `D_n`, or the trace. Equation (1) supplies a noncircular enlarged
score inequality whose threshold includes the signed theta compensation.
It does not prove that inequality. In particular, neither identity creates
a generic sign: the frozen Gaussian counterexample still has `W_15<0`.

## 1. Diagonal CD cancellation removes the trace

Define the positive diagonal prefix kernel

\[
 K_n(h)=\sum_{j=0}^n\frac{F_j(h)^2}{\sigma_j}.
\]

The recurrence gives `F_j'=F_(j+1)-b_j F_(j-1)` (the lower term is absent
at `j=0`). Since `b_j/sigma_j=1/sigma_(j-1)`, every interior product cancels:

\[
 \boxed{K_n'(h)=\frac2{\sigma_n}F_n(h)F_{n+1}(h).}        \tag{3}
\]

This is the diagonal actual-metric CD identity. It uses no next pivot or
next-pivot denominator. Complete-theta decay kills the boundary term in
integrating `(h^2 K_n)'` on the positive half-line. Therefore

\[
 \sigma_n\int_0^\infty h K_n(h)\,dh
 =-\int_0^\infty h^2F_nF_{n+1}\,dh.                    \tag{4}
\]

The source definitions of the normalized half-line Gram and `d` give

\[
 \operatorname{tr}\mathsf H=\int_0^\infty hK_n\,dh,
 \qquad
 d^T\mathsf H e_n=\frac1{\sigma_n}\int_0^\infty hF_nG\,dh.
\]

No parity sign is missing here: `G` and `F_n` have the same parity, so the
product in `H` at `-h` agrees with its value at `h`. Thus, writing
`C_n=4(tr H-d^T H e_n)`, (4) proves

\[
 \boxed{\sigma_n C_n=-4\int_0^\infty
 hF_n(h)\{hF_{n+1}(h)+G(h)\}\,dh.}                      \tag{5}
\]

The Weyl commutation identity
`T_(n+1)(D)(h psi)=hF_(n+1)+G` identifies its second factor.

The direct endpoint source, including the coefficient-stationarity
cancellation, is

\[
 \sigma_{n+1}
 =2\|hF\|_2^2-\|G\|_2^2
              -\langle F,T_{n+1}''(D)\psi\rangle
 =4\int_0^\infty hF(h)\{hF(h)+G(h)\}\,dh.              \tag{6}
\]

For the second equality, the known opposite-parity cross-Gram identity gives
`2 int hFG=-||G||^2-<F,T_(n+1)''(D)psi>`.
It follows by integrating `(p_m p_m' W^2)'` on the Fourier side; the
ordinary spatial derivative `F'` is not the coefficient derivative `G`.
Equations (5)--(6) prove (2).

For (1), use the full-line forms of (4)--(6). With `U=hF` and
`V=|h|F_n`, fixed parity gives

\[
 \sigma_n C_n=-2\langle V,U+G\rangle,
 \qquad
 \sigma_{n+1}=\tfrac12\{\|2U+G\|_2^2-\|G\|_2^2\}.
\]

Expansion now yields

\[
 \sigma_n\mathcal W_n
 =\tfrac12\{\|2U+G-V\|_2^2-\|G+V\|_2^2\}.
\]

The absolute value in `V` is essential. Replacing it by `h` would change
the parity and remove the required cross term. The cusp in `V` creates no
domain issue: only its `L^2` norm and correlations are used; it is never
differentiated.

## 2. A noncircular enlarged score inequality

Use `W=hat(psi)=2Xi`, `m=n+1`, and
`T_m(x)=i^m p_m(-ix)`. Then

\[
 \widehat{2hF+G}=i^n s,\qquad
 s=-p_m'W-2p_mW'.                                      \tag{7}
\]

Choose any fixed, explicitly prescribed, linearly independent real
polynomials `r_i` of parity `n`, determined from the positive prefix and
positive `W^2` moments. Let real physical features `v_i` be defined by
`hat(v_i)=i^n r_i W`. Define

\[
 K_{ij}=\langle v_i,v_j\rangle
       =\frac1{2\pi}\int r_ir_jW^2\,dt,
 \qquad c_i=\langle |h|F_n,v_i\rangle.
\]

Integration by parts in the unshifted score is division-free and gives

\[
 \boxed{y_i:=\langle S,v_i\rangle
 =\frac1{2\pi}\int p_m r_i' W^2\,dt-c_i.}               \tag{8}
\]

Consequently, for `P_V` the orthogonal projection onto this feature space,

\[
 \boxed{\displaystyle
 \mathcal W_n=
 \frac{y^TK^{-1}y-\|G+|h|F_n\|_2^2}{2\sigma_n}
 +\frac{\|(I-P_V)S\|_2^2}{2\sigma_n}.}                 \tag{9}
\]

This yields the sufficient old-data correlated inequality

\[
 \boxed{y^TK^{-1}y\geq\|G+|h|F_n\|_2^2.}               \tag{10}
\]

All entries in (8)--(10) are known once the positive prefix is supplied.
In particular, the next polynomial uses that prefix, the new signed pivot
does not enter its coefficients, and neither `sigma_(n+1)` nor its sign
normalizes a feature. The new `|h|F_n` correlations must be retained inside
`y` and the threshold. Applying independent Cauchy bounds to them would
lose the compensation that (1) captures.

Equation (10) is stronger than the target because of the last square in
(9). Adjoining `S` itself, or appealing only to eventual dense-space
saturation, would remove the useful distinction and become target
equivalent. No fixed finite menu is claimed to satisfy (10). The known
generic fixed-menu barriers remain applicable.

## 3. Positive orbit law with the cross covariance intact

For `h>=0`, use every positive Jacobi orbit

\[
 \phi_a(h)=4z_a(2z_a-3)e^{h/2-z_a},\quad
 z_a=\pi a^2e^{2h},\quad p_a(h)=\phi_a(h)/\psi(h).
\]

Define the real raw-jet observables

\[
 U_a=\frac{(T_{n+1}-T_n)(D)\phi_a}{\phi_a},
 \qquad
 B_a=\frac{T_{n+1}(D)(h\phi_a)}{\phi_a}.
\]

The whole residual is applied with its one global set of coefficients.
Absolute convergence at fixed derivative order gives

\[
 \boxed{\displaystyle
 \mathcal W_n=\frac4{\sigma_n}\int_0^\infty h\psi^2
  E_h[U]E_h[B]\,dh
 =\frac4{\sigma_n}\int_0^\infty h\psi^2
  \{E_h[UB]-\operatorname{Cov}_h(U,B)\}\,dh.}             \tag{11}
\]

Unlike a mean square, the covariance in (11) has no automatic sign.
Jensen does not give a lower bound for this cross pairing. Raw orbit
evenizations must not be substituted before the CD integration: their
center seams destroy the high-degree integration by parts. The complete
sum is assembled first in (3)--(6).

There is an actual-theta pointwise obstruction even at the base of this
new formula. At `n=0`, `T_0=1`, `T_1=D`, and evenness gives

\[
 (F_1-F_0)T_1(D)(h\psi)
 =(\psi'-\psi)(\psi+h\psi')\longrightarrow-\psi(0)^2<0
 \quad(h\downarrow0).
\]

Thus pointwise nonnegativity of (2)'s integrand is false for the complete
theta profile itself. A proof must use signed integration, even when the
resulting pivot is positive.

## 4. A seam-free scalar Ewald source for this exact target

Let `sigma_x` denote the even continuous orbit from
`MODULAR_EWALD_GROUPING_NEXT.md` (not a pivot). Keep the first leg complete:

\[
 \boxed{\displaystyle
 J_n(x)=\frac4{\sigma_n}\int_0^\infty
 h(F_{n+1}-F_n)\,T_{n+1}(D)(h\sigma_x)\,dh.}              \tag{12}
\]

This is linear in the second, continuous orbit leg. The weighted-Sobolev
Ewald convergence applies to its finitely many derivatives and polynomial
weights. Therefore for left cells
`epsilon_a=sigma_a-int_(a-1)^a sigma_x dx`,

\[
 \mathcal W_n=\sum_{a\geq1}
 \left\{J_n(a)-\int_{a-1}^aJ_n(x)\,dx\right\}.          \tag{13}
\]

As in the correlated paid source, complete-profile superexponential decay
in the first leg controls both small and large scales. The source extends
evenly with `J_n(x)=O(x^2)` at zero and decays rapidly with its derivatives
at infinity. The continuum cancellation and Poisson reciprocity inherit
linearly:

\[
 \int_0^\infty J_n(x)dx=0,\qquad J_n(0)=0,\qquad
 \int_0^\infty J_n(x)\cos(2\pi xy)dx=\tfrac12J_n(y).
\]

Using the trapezoidal Ewald tiling then gives

\[
 \boxed{\displaystyle
 \mathcal W_n=\frac12\int_0^\infty
 \{x\}(1-\{x\})J_n''(x)\,dx.}                          \tag{14}
\]

This is one scalar source for the **net** target, rather than a separate
source for the reserve and reflection cost. It preserves the exact
compensation, but it does not sign it. Unless `J_n` vanishes identically,
its zero continuum mean forces both signs. Poisson self-duality returns
the same lattice sum and cannot supply the missing placement inequality.

## 5. What has and has not been paid

The new all-degree reductions are (1)--(2), the shifted-score condition
(10), and the single net Ewald source (12)--(14). They avoid the quadratic
reflection coefficient norm entirely. Their utility is that a future
theta estimate can act on one correlated object throughout.

The remaining blocker is an actual complete-theta lower bound for (10),
or directly for the signed correlation (11) / fractional-cell curvature
integral (14), for one prescribed non-target-dependent feature rule.
Positive prefix geometry, local curvature, positive orbit weights,
generic projection, and Poisson reciprocity do not provide that bound.
The Gaussian barrier and the actual-theta base integrand obstruction rule
out the corresponding generic and pointwise shortcuts.

Even `W_n>=0` must be used on the correct commutator branch: if `C_n<=0`,
then it implies `sigma_(n+1)/sigma_n>=-C_n>=0`. Without that branch, the
net inequality alone does not force the next pivot's sign. No all-degree
payment, next-pivot sign, or RH conclusion is asserted.

## Reproduction

The standard-library verifier checks frozen source hashes, the diagonal
CD polynomial identity for arbitrary rational recurrence data, and the
shifted-score norm identity with exact half-Gaussian moments. It also
replays the already-known Gaussian `n=15,c=20` negative net target, showing
that the new square form has not silently introduced a generic sign.
It performs no theta quadrature, finite-rung search, or degree escalation.

From the repository root run

    python3 research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/src/verify_theta_net_cd_shifted_score_20261103.py \
      --root . \
      --output research-checkpoints/zeta-sphere-theta-fisher-bridge-2026-11-02/workstreams/all-degree-analytic-search-next-v1/results/theta_net_cd_shifted_score_20261103.json

The verifier is an exact algebra and provenance audit, not a proof-assistant
formalization or a certificate for the unpaid complete-theta inequality.
