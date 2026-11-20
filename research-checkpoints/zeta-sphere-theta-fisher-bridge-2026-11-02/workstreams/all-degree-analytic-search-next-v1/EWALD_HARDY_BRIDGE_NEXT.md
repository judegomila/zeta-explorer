# The Ewald--Hardy bridge and the logarithmic-source obstruction

## Scope and outcome

`DAMPED_ABEL_THETA_NEXT.md` constructs a bounded variation-gauge candidate
for the actual Euler-renormalized Abel path. `COMPLETE_ORBIT_HARDY_NEXT.md`
and `MELLIN_ROOT_VARIANCE_NEXT.md` express the same next pivot as a
complete-orbit Hardy gap and give a stronger sufficient log-radius variance
budget. This note determines exactly how those routes meet.

There are four conclusions.

1. The whole Abel path, not only its endpoint, is the polarization of the
   complete-orbit Hardy form:

   \[
    \boxed{4\pi S_\pi(z)
    =2\langle(qW)',(qW_z)'\rangle
      -\sum_{j=1}^{\kappa}\langle q_jW,q_jW_z\rangle.} \tag{1}
   \]

   Here `W=2Xi`, `W_z=2 mathcal E_z`, `q` is the single actual residual
   multiplier, and `q_j=q/(t-rho_j)`. Every term in (1) has its own exact
   Poisson--ceiling source, and the source identity already holds before
   Abel summation.
2. The bounded variation gauge becomes an exact **directional** Hardy
   inequality. Its Wronskian is a positive Abel weighting of the cellwise
   polarized Hardy defects. This connects the two routes without assuming
   `S_pi(1)>=0` and without resolving the complete theta orbit into a finite
   packet.
3. The root Mellin moment has an exact all-index Euler representation.
   Consequently the assembled log-variance is an explicit curvature of
   root-resolved Ewald cell sums. At Mellin exponent zero, this representation
   is an ordinary Poisson--ceiling formula and its denominator is precisely
   the Hardy root cost in (1).
4. The first and second Mellin derivatives do **not** come from the same
   ordinary Poisson--ceiling source. The factors `log|t-rho_j|` and
   `log^2|t-rho_j|` introduce real-axis branch singularities. Their scale
   transforms have tails of the form
   `x^(-1/2)(log x)^(-m-1)` times nonzero logarithmic oscillations and are not
   integrable. Euler cell subtraction still makes the scalar cell series
   summable, but the zero-mean Schwartz-source argument behind the original
   Poisson--ceiling identity is unavailable.

Thus the Hardy mean square and the zeroth root masses are exactly bridged to
the bounded Abel path. The log-variance numerator requires a new
root-shifted Euler estimate; it cannot be obtained by differentiating the
original Poisson--ceiling source. No endpoint sign, finite certificate,
all-degree theorem, or RH statement is used.

## 1. Common normalization

Fix one parity rung satisfying the two old-prefix hypotheses needed for the
real-root reduction. Let

\[
 q(t)=t^rP_N(t^2)
     =\prod_{j=1}^{\kappa}(t-\rho_j),\qquad
 q_j(t)={q(t)\over t-\rho_j},                    \tag{2}
\]

where the roots `rho_j` are real and simple. This `q` is the frequency
multiplier of the same actual residual `pi` used in the Ewald path. Put

\[
 W(t)=2\Xi(t),\qquad
 W_x(t)=2C_x(t),\qquad
 W_z(t)=2\mathcal E_z(t).                        \tag{3}
\]

The audited left Ewald cells give

\[
 W_z=\sum_{n\geq1}z^n
 \left\{W_n-\int_{n-1}^nW_x\,dx\right\},
 \qquad 0\leq z<1,                              \tag{4}
\]

and `W_1=W` after the complete Euler-renormalized endpoint is taken. The
actual scalar path is

\[
 S_\pi(z)={1\over4\pi}\int_{\mathbb R}
 q(t)^2\mathcal B(W,W_z)(t)\,dt,                \tag{5}
\]

where

\[
 \mathcal B(U,V)=U'V'-{1\over2}(UV''+U''V).     \tag{6}
\]

Equation (5) is the normalization of
`S_pi=pi^(-1) integral B(Xi,mathcal E_z)q^2`; no new factor is introduced.

## 2. Bilinear Hardy polarization along the whole Abel path

The following identity is valid for any real smooth rapidly decreasing
`U,V`:

\[
\boxed{
 \int_{\mathbb R}q^2\mathcal B(U,V)\,dt
 =2\int_{\mathbb R}(qU)'(qV)'\,dt
  -\int_{\mathbb R}(q'^2-qq'')UV\,dt.}           \tag{7}
\]

To verify it, integrate the two second-derivative terms in (6) once. The
left side becomes

\[
 2\int q^2U'V'\,dt
 +\int qq'(UV'+U'V)\,dt.                        \tag{8}
\]

Expanding the first term on the right of (7) and integrating
`2qq'(UV)'` gives the same expression. All boundary terms vanish by
complete-theta decay.

Since the roots in (2) are simple,

\[
 q'^2-qq''=\sum_{j=1}^{\kappa}q_j^2.             \tag{9}
\]

Apply (7) with `U=W`, `V=W_z`, and define

\[
 G=qW,\quad G_z=qW_z,\qquad
 H_j=q_jW,\quad H_{j,z}=q_jW_z.                 \tag{10}
\]

Equations (5), (7), and (9) prove the promised bridge

\[
 \boxed{
 4\pi S_\pi(z)
 =2\langle G',G_z'\rangle
  -\sum_{j=1}^{\kappa}\langle H_j,H_{j,z}\rangle.} \tag{11}
\]

At the endpoint, `G_z=G` and `H_(j,z)=H_j`, so

\[
 4\pi S_\pi(1)
 =2\|G'\|_2^2-\sum_j\|H_j\|_2^2.                \tag{12}
\]

This is exactly the complete-orbit Hardy gap. Equation (11) is stronger as
an identity: it identifies every interior Abel value as a signed
polarization of that gap.

There is also a rootwise cross-energy identity. From
`G=(t-rho_j)H_j` and `G_z=(t-rho_j)H_(j,z)`, one integration by parts gives

\[
 \boxed{
 \langle G',G_z'\rangle
 =\int_{\mathbb R}(t-\rho_j)^2
       H_j'(t)H_{j,z}'(t)\,dt
 \qquad(1\leq j\leq\kappa).}                    \tag{13}
\]

In logarithmic root coordinates, if `u_(j,plus_or_minus)` is formed from
`H_j` and `v_(j,z,plus_or_minus)` from `H_(j,z)` as in the Hardy note, then

\[
 \langle G',G_z'\rangle
 =\langle\mathbf u_j',\mathbf v_{j,z}'\rangle
  +{1\over4}\langle\mathbf u_j,\mathbf v_{j,z}\rangle. \tag{14}
\]

The endpoint specialization `mathbf v_(j,1)=mathbf u_j` recovers the
positive logarithmic energy. For `z<1`, (14) is a signed cross energy rather
than a norm.

## 3. The bridge already holds at the continuous-source level

Retain the original Poisson--ceiling source

\[
 J_\pi(x)={1\over\pi}\int_{\mathbb R}
        q(t)^2\mathcal B(\Xi,C_x)(t)\,dt.        \tag{15}
\]

Define the continuous Hardy-energy and root-mass sources

\[
 \mathcal M_q(x)
 =\int_{\mathbb R}(qW)'(qW_x)'\,dt,             \tag{16}
\]

\[
 \mathcal R_j(x)
 =\int_{\mathbb R}q_j(t)^2W(t)W_x(t)\,dt.       \tag{17}
\]

Using `W=2Xi` and `W_x=2C_x`, identity (7) gives, pointwise in the scale
parameter,

\[
 \boxed{
 4\pi J_\pi(x)
 =2\mathcal M_q(x)-\sum_{j=1}^{\kappa}\mathcal R_j(x).} \tag{18}
\]

The same correlation/domain argument used for `J_pi` applies to (16)--(17):
polynomial multipliers and `t` derivatives become finitely many derivatives
of correlations between the complete profile and `sigma_x`. Hence

\[
 \mathcal M_q,\mathcal R_j\in\mathcal S(\mathbb R),\qquad
 \widehat{\mathcal M_q}=\mathcal M_q,\quad
 \widehat{\mathcal R_j}=\mathcal R_j,\quad
 \mathcal M_q(0)=\mathcal R_j(0)=0.              \tag{19}
\]

In particular, all have zero half-line mean. With the same kernel

\[
 \mathcal K_z(x)=\mathcal P_z(x)-z^{\lceil x\rceil}, \tag{20}
\]

put

\[
 \mathsf M(z)=\int_0^\infty\mathcal K_z(x)\mathcal M_q(x)\,dx,
 \qquad
 \mathsf R_j(z)=\int_0^\infty\mathcal K_z(x)\mathcal R_j(x)\,dx. \tag{21}
\]

The exact Ewald definitions give

\[
 \boxed{
 \mathsf M(z)=\langle G',G_z'\rangle,\qquad
 \mathsf R_j(z)=\langle H_j,H_{j,z}\rangle.}     \tag{22}
\]

Applying (20) to (18) reproduces (11). Thus the Ewald--Hardy bridge is not
an endpoint rearrangement: it is one identity of self-dual continuous-scale
sources.

Equivalently, define their left-cell errors

\[
\begin{aligned}
 e_n&=J_\pi(n)-\int_{n-1}^nJ_\pi(x)\,dx,\\
 m_n&=\mathcal M_q(n)-\int_{n-1}^n\mathcal M_q(x)\,dx,\\
 b_{j,n}&=\mathcal R_j(n)-\int_{n-1}^n\mathcal R_j(x)\,dx.
\end{aligned}                                    \tag{23}
\]

Then (18) holds cell by cell:

\[
 \boxed{4\pi e_n=2m_n-\sum_{j=1}^{\kappa}b_{j,n}.} \tag{24}
\]

No term in (24) has a prescribed sign.

## 4. The bounded variation gauge is a directional Hardy inequality

Write the complete cell-variation series from the damped Abel note as

\[
 T_\pi(z)=\sum_{n\geq1}|e_n|z^n,\qquad
 M_\pi=T_\pi(1),                                \tag{25}
\]

and, for a fixed `alpha>0`,

\[
 R_\alpha(z)=(1+\alpha)M_\pi-T_\pi(z),\qquad
 \lambda_{\pi,\alpha}(z)={T_\pi'(z)\over R_\alpha(z)}. \tag{26}
\]

Define the damped Ewald direction

\[
 L_{\alpha,z}
 =R_\alpha(z)\partial_zW_z+T_\pi'(z)W_z.        \tag{27}
\]

Differentiate (11) in `z` and combine it with (11). The exact Wronskian
from the bounded gauge becomes

\[
\boxed{
\begin{aligned}
 4\pi\mathcal W_{\pi,\alpha}(z)
 &=4\pi\{R_\alpha A_\pi+T_\pi'S_\pi\}\\
 &=2\langle G',(qL_{\alpha,z})'\rangle
   -\sum_{j=1}^{\kappa}\langle H_j,q_jL_{\alpha,z}\rangle .
\end{aligned}}                                   \tag{28}
\]

This is the sought noncircular connection. It uses the source-derived
`R_alpha` and `T_pi'`, not `S_pi(1)` or `-A_pi/S_pi`.

It also has an exact cell form. If

\[
 c_n(z)=R_\alpha(z)nz^{n-1}+T_\pi'(z)z^n>0,     \tag{29}
\]

then (4) and (27) give

\[
 L_{\alpha,z}
 =\sum_{n\geq1}c_n(z)
 \left\{W_n-\int_{n-1}^nW_x\,dx\right\},        \tag{30}
\]

and (24) gives

\[
 \boxed{
 4\pi\mathcal W_{\pi,\alpha}(z)
 =\sum_{n\geq1}c_n(z)
 \left\{2m_n-\sum_jb_{j,n}\right\}.}             \tag{31}
\]

Thus the bounded gauge assigns positive weights to the complete sequence of
**signed cellwise Hardy defects**. It does not assert cellwise positivity.
The remaining inequality `mathcal W_(pi,alpha)>=0` is precisely a
directional cross-Hardy estimate for the single Ewald direction (27).

The log-variance uncertainty estimate controls the endpoint norm
`mathscr Q_q(W,W)`. It does not control the polarization
`mathscr Q_q(W,L_(alpha,z))` in (28). The underlying Hardy form is not
positive on the full ambient function space: its source-free sharp constant
is `1/4`, below the complete-root payment. Therefore ordinary Cauchy,
polarization, or the endpoint variance budget supplies no lower bound for
(28). An additional theta-specific angle/placement estimate is required.

## 5. Root Mellin moments have an Euler bridge

For `Re(sigma)>-1`, define the root-resolved continuous-scale source

\[
 \mathcal R_{j,\sigma}(x)
 =\int_{\mathbb R}|t-\rho_j|^\sigma
 q_j(t)^2W(t)W_x(t)\,dt.                        \tag{32}
\]

Its left-cell errors are

\[
 b_{j,n}(\sigma)
 =\mathcal R_{j,\sigma}(n)
  -\int_{n-1}^n\mathcal R_{j,\sigma}(x)\,dx.     \tag{33}
\]

Linearity of the complete Ewald decomposition in the `W_x` leg gives, for
`0<=z<1` and `sigma` in a fixed complex neighborhood of zero,

\[
\boxed{
 Z_{j,z}(\sigma)
 :=\int_{\mathbb R}|t-\rho_j|^\sigma
       q_j(t)^2W(t)W_z(t)\,dt
 =\sum_{n\geq1}b_{j,n}(\sigma)z^n.}             \tag{34}
\]

In the same neighborhood, the fully assembled endpoint is

\[
 \boxed{
 Z_{j,1}(\sigma)=Z_j(\sigma)
 =\int_{\mathbb R}|t-\rho_j|^\sigma
 q_j(t)^2W(t)^2\,dt.}                           \tag{35}
\]

The endpoint in (35) is justified by the weighted Ewald cell topology
before any rootwise logarithm is estimated. In particular, it does not use
the sign of `S_pi(1)`.

Sum (33)--(35) over all roots:

\[
 b_n(\sigma)=\sum_jb_{j,n}(\sigma),\qquad
 \mathcal Z(\sigma)=\sum_{n\geq1}b_n(\sigma).   \tag{36}
\]

Differentiation near `sigma=0` is allowed after the Euler cells have been
formed. The assembled root log-variance therefore has the exact all-index
Ewald formula

\[
\boxed{
 \mathcal V
 ={\sum_{n\geq1}b_n''(0)\over\sum_{n\geq1}b_n(0)}
 -\left\{{\sum_{n\geq1}b_n'(0)
          \over\sum_{n\geq1}b_n(0)}\right\}^{\!2}.} \tag{37}
\]

This is a genuine Ewald representation of the Mellin curvature. It is not
a finite cell certificate. At exponent zero, (32) reduces to (17), so

\[
 b_{j,n}(0)=b_{j,n},\qquad
 \sum_nb_n(0)=\sum_j\|H_j\|_2^2.                \tag{38}
\]

Moreover, equations (24) and (36) give the pathwise aggregate identity

\[
 \boxed{
 \sum_{n\geq1}b_n(0)z^n
 =2\sum_{n\geq1}m_nz^n-4\pi S_\pi(z).}          \tag{39}
\]

Thus the denominator in (37) and the complete Hardy mean square are
connected to the original Poisson--ceiling source exactly. What remains is
the logarithmic numerator.

## 6. Why Mellin differentiation leaves the Poisson--ceiling source class

At `sigma=0`, the source (32) is precisely the Schwartz, self-dual source
`mathcal R_j` in (17). Hence

\[
 Z_{j,z}(0)
 =\int_0^\infty\mathcal K_z(x)\mathcal R_j(x)\,dx. \tag{40}
\]

It is tempting to differentiate (40) in `sigma` and use the same
Poisson--ceiling argument for the moments of `log|t-rho_j|`. That step is
not valid.

Indeed, from

\[
 W_x(t)=\operatorname {Re}
 \{K(t)x^{-1/2+it}\},                            \tag{41}
\]

the first Mellin derivative of (32) has the form

\[
 \left.\partial_\sigma\mathcal R_{j,\sigma}(x)
 \right|_{\sigma=0}
 =x^{-1/2}\operatorname {Re}\int_{\mathbb R}
 a_j(t)\log|t-\rho_j|e^{it\log x}\,dt,          \tag{42}
\]

where `a_j` is real-analytic near `rho_j`, exponentially decreasing on the
real line after the completed factors are retained, and is not flat at
`rho_j`. More explicitly, `q_j(rho_j)=q'(rho_j) ne 0`,
`K(rho_j) ne 0`, and any zero contributed by `Xi(rho_j)` has finite order.

The local Fourier transform of `u^m log|u|` is a nonzero constant times
`|L|^(-m-1)` to leading order. If `m_j` is the vanishing order of `a_j` at
`rho_j`, (42) therefore has the large-scale asymptotic shape

\[
 x^{-1/2}{\operatorname {Re}
 \{c_je^{i\rho_j\log x}\}\over
        (\log x)^{m_j+1}}
 +o\!\left({x^{-1/2}\over
        (\log x)^{m_j+1}}\right),\qquad c_j\ne0. \tag{43}
\]

Such a function is not in `L1(1,infinity)`. The second Mellin derivative,
with `log^2|t-rho_j|`, has the same obstruction, with an additional
logarithmic factor in the Fourier asymptotic.

Summing over the roots does not remove (43). At the smallest vanishing
order, the leading coefficient is a finite exponential polynomial in
`log x` with distinct frequencies `rho_j`. A nonzero exponential polynomial
cannot vanish identically; the symmetric roots merely combine its terms
into nonzero sine/cosine oscillations. Hence the assembled first- and
second-derivative sources are also not integrable.

The ordinary Poisson--ceiling proof uses the facts that the scale source is
integrable, self-dual, and has zero mean. For (42)--(43), the half-line mean
is not an ordinary integral, so neither Poisson resummation nor the
subtraction of `z^(ceil x)` is justified in that form. In particular, the
formal identity

\[
 \partial_\sigma^k Z_{j,z}(0)
 = \int_0^\infty\mathcal K_z(x)
 \left.\partial_\sigma^k\mathcal R_{j,\sigma}(x)
 \right|_{\sigma=0}dx                           \tag{44}
\]

is not an ordinary absolutely convergent identity for `k=1,2`; its
right-hand side is not an ordinary absolutely convergent integral.

There is no contradiction with (34)--(37). The Euler difference in (33)
cancels the leading slowly varying continuum term. From (43), its cell
error has size `O(n^(-3/2))` times powers of `log n` and `log log n`, which
is summable. Thus the correct order is

\[
 \boxed{\text{form each Euler cell first, then differentiate and sum.}} \tag{45}
\]

Differentiating the continuous source first leaves the Schwartz/`L1`
Poisson--ceiling class.

## 7. Consequence for the two sufficient routes

The bridge and its limitation can now be stated precisely.

- The bounded variation gauge controls the directional polarization
  `mathscr Q_q(W,L_(alpha,z))` in (28), equivalently the positively weighted
  signed cell sum (31).
- The root-variance route controls the endpoint quadratic
  `mathscr Q_q(W,W)` by bounding the curvature (37) of a positive root
  Mellin law.
- Their common zeroth-order data are the sources (15)--(18) and the
  denominator (38)--(39).
- The first and second logarithmic moments require the new Euler-renormalized
  sources (32)--(37). They are not derivatives of the original ordinary
  Poisson--ceiling source.

Therefore neither sufficient condition presently pays the other. A genuine
combined lemma would have to prove one of the following new theta-specific
statements:

1. a directional cross-Hardy angle bound for the packet `L_(alpha,z)` in
   (28), uniformly on the seeded Abel interval; or
2. a reverse-curvature estimate for the assembled Euler cell family
   `b_n(sigma)` in (36)--(37), retaining the root modulations and taking the
   cell subtraction before Mellin differentiation.

Ordinary endpoint polarization, source-free Hardy, Hölder interpolation,
or direct differentiation of the Poisson--ceiling source cannot supply
either statement. This is an exact route classification, not a negative
claim about the actual theta residual.

## Self-audit and nonclaims

- The factor `4pi` in (11) follows from `W=2Xi`, `W_z=2mathcal E_z`, and the
  bilinearity of `mathcal B`.
- Identity (7) was checked by one integration by parts; at `U=V=W` it gives
  the endpoint Hardy gap with the normalization in
  `COMPLETE_ORBIT_HARDY_NEXT.md`.
- The source identity (18) precedes every Ewald summation, so (24) is a
  literal cellwise equality.
- The coefficients `c_n(z)` in (29) are positive because `R_alpha>0` and
  `T_pi'>=0`; no sign is assigned to the bracket in (31).
- Formula (37) differentiates the logarithm only after the root-resolved
  endpoint sums are assembled. Its denominator is positive independently
  of the next pivot.
- The obstruction (43) concerns ordinary integrability of the differentiated
  continuous-scale source. It does not say that the Euler-renormalized
  scalar derivatives in (37) fail to exist.

No inequality in (28), (31), or (37) is asserted for the actual residual
beyond the exact identities displayed. No finite Ewald packet is used, and
no Xi--Laguerre, all-degree, or RH conclusion is claimed.
