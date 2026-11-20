# Split-block quotient action theorem

Status: positive-sampling, low-physical-range theorem.  This note assembles
the singleton label-8 block and the remaining plus transition block with an
explicitly defined block-diagonal source metric.  It retains the sampling
cross terms between the two blocks and proves a low-range action bound at a
scale stronger than the relaxed target in the weak-residual reduction.

The block-diagonal metric below is a new comparison metric.  It is not
identified with the full exterior source Gram.  No high-physical-complement
scale, shifted signed Weil comparison, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant convergence, or Riemann-hypothesis
conclusion follows.  The repository state remains `P0_INVALIDATED`.

## 1. The two actual physical blocks

Fix the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad c=2\pi\lambda^2,
\]

and let `n_star` be the pinned transition index.  Write

\[
 d_n=1-\chi_n^2,
 \qquad I_n=\int_{-\lambda}^{\lambda}h_{n,\lambda}(x)\,dx,
 \qquad \rho_t=-{I_t\over I_0}.                            \tag{1.1}
\]

For `t=4,8,12,16,...`, put

\[
 c_t=e_t+\rho_te_0,                                       \tag{1.2}
\]

where the `e_n` are the orthonormal prolate source coordinates.  Let `T`
denote the locked arithmetic transform, inversion-even projection, and
log-Fourier projection.  All factors after the arithmetic transform are
orthogonal contractions.  Put

\[
 p_t=Tc_t,\qquad
 \kappa={p_4\over\|p_4\|},\qquad
 P_\kappa=I-\kappa\kappa^*,                                \tag{1.3}
\]

on the locked states for which the required anchor hypothesis `p_4 != 0`
holds.  Define

\[
 \alpha_t={\langle p_4,p_t\rangle\over\|p_4\|^2},
 \qquad b_t=\rho_t-\rho_4\alpha_t.                         \tag{1.4}
\]

Then the actual anchor-deflated column has the two identical
representations

\[
 P_\kappa p_t=T(c_t-\alpha_tc_4),
 \qquad
 c_t-\alpha_tc_4=e_t-\alpha_te_4+b_te_0.                  \tag{1.5}
\]

Let

\[
 \mathcal T_R=\{12,16,20,\ldots\}\cap[0,n_*),
 \qquad q_R=|\mathcal T_R|
 =\max\left\{0,\left\lfloor{n_*-1\over4}\right\rfloor-2\right\}.
                                                                    \tag{1.6}
\]

The singleton and remaining physical synthesis maps are

\[
 W_8a=aP_\kappa p_8,
 \qquad
 W_Ra=P_\kappa T\sum_{t\in\mathcal T_R}a_tc_t.             \tag{1.7}
\]

Use the exact within-block exterior-defect forms

\[
 \boxed{D_8=d_8+d_4|\alpha_8|^2+d_0|b_8|^2,}              \tag{1.8}
\]

\[
 \boxed{D_R=D_T+d_4\alpha\alpha^*+d_0bb^*,
 \qquad D_T=\operatorname {diag}_{t\in\mathcal T_R}(d_t).} \tag{1.9}
\]

The source and physical data are real; (1.9) is written in its Hermitian
complexification.  In particular,

\[
 D_8\geq d_8>0,
 \qquad D_R\succeq D_T\succeq d_{12}I.                    \tag{1.10}
\]

The last inequality uses the exact concentration-eigenvalue ordering:
`Lambda_t<=Lambda_12` for every `t>=12`, hence `d_t>=d_12`.

The growing-transition sampling theorem, including the invisible origin
correction and exact radical identity, gives one-block Loewner estimates

\[
 W_8^*S^*SW_8\preceq C_8D_8,
 \qquad
 W_R^*S^*SW_R\preceq C_RD_R,                               \tag{1.11}
\]

where `S` is the complete paired-zero sampling analysis and

\[
 C_8=O\!\left(\lambda\operatorname {polylog}\lambda\right),
 \qquad
 C_R=O\!\left(\lambda^3\operatorname {polylog}\lambda\right). \tag{1.12}
\]

Every within-block sampling cross term is already present in (1.11).  No
claim about a cross-block source Gram is used.

## 2. Cross-aware block quotient

Define, deliberately and explicitly,

\[
 X_L=X_8\oplus X_R,
 \qquad D_L=D_8\oplus D_R,
 \qquad W_L=[\,W_8\;W_R\,].                                \tag{2.1}
\]

Put

\[
 A_8=W_8D_8^{-1/2},\qquad
 A_R=W_RD_R^{-1/2},                                        \tag{2.2}
\]

\[
 R_L=W_LD_L^{-1}W_L^*=A_8A_8^*+A_RA_R^*,
 \qquad K_L=\operatorname {ran}W_L,                        \tag{2.3}
\]

and use the minimum-energy quotient metric

\[
 \boxed{\Delta_L=R_L^\dagger\big|_{K_L}.}                 \tag{2.4}
\]

Source or physical kernels cause no difficulty: the Moore--Penrose inverse
in (2.4) acts only on `K_L`.  On that range,

\[
 \Delta_L^{-1}=R_L.                                        \tag{2.5}
\]

Here and below `Delta_L^(-1)` has domain `K_L`.  Equivalently, extend it by
zero to the ambient physical space: `R_L` annihilates `K_L^\perp`, so the
ambient norm of `S R_L` is exactly its norm from `K_L` to the sampling
space.  Thus no ambient zero eigenvalue enters (2.7)--(2.10).

Set

\[
 M_8=\|A_8\|^2,
 \qquad M_R=\|A_R\|^2,                                    \tag{2.6}
\]

and define the low sampling action by

\[
 \Gamma_L(\Delta_L)
 =\|\Delta_L^{-1}S^*S\Delta_L^{-1}\|
 =\|S\Delta_L^{-1}\|^2.                                  \tag{2.7}
\]

From (1.11),

\[
 \|SA_8\|\leq\sqrt{C_8},
 \qquad \|SA_R\|\leq\sqrt{C_R}.                          \tag{2.8}
\]

Equations (2.3), (2.5), and the operator triangle inequality now give

\[
\begin{aligned}
 \|S\Delta_L^{-1}\|
 &=\|S(A_8A_8^*+A_RA_R^*)\|\\
 &\leq\|SA_8\|\,\|A_8\|+\|SA_R\|\,\|A_R\|\\
 &\leq\sqrt{C_8M_8}+\sqrt{C_RM_R}.
\end{aligned}                                               \tag{2.9}
\]

Thus

\[
 \boxed{
 \Gamma_L(\Delta_L)
 \leq\left(\sqrt{C_8M_8}+\sqrt{C_RM_R}\right)^2.}        \tag{2.10}
\]

The mixed term
`2*sqrt(C_8*M_8*C_R*M_R)` in (2.10) is essential.  It is the
cross-block sampling orientation after squaring the complete row-operator
bound.  Replacing (2.10) by a maximum of two diagonal actions would discard
that orientation and is not valid.

## 3. Finite physical synthesis bounds

The numerator bounds in this section are deliberately taken on the raw
columns (1.2), before anchor deflation: `P_kappa` is a contraction, so
deflation cannot increase their physical norm.  The denominators are the
exact post-deflation metrics (1.8)--(1.9), for which
`D_8>=d_8` and `D_R>=d_12 I`.  No estimate on the deflation coefficients is
needed.

For every additive-even source `f`, the exact arithmetic-map estimate is

\[
 \|Tf\|^2\leq\|A_\lambda f\|^2
 \leq{\lambda^2\over2}\|f\|^2.                            \tag{3.1}
\]

Since `P_kappa` is an orthogonal contraction and
`||c_8||^2=1+rho_8^2`, equations (1.7), (1.8), and (3.1) prove the finite
bound

\[
 \boxed{
 M_8\leq{\lambda^2(1+\rho_8^2)\over2d_8}.}                \tag{3.2}
\]

For the remaining raw source synthesis
\(\mathcal C_Ra=\sum_ta_tc_t\), orthonormality
of the prolate coordinates gives

\[
 \mathcal C_R^*\mathcal C_R=I+\rho\rho^*,
 \qquad \|\mathcal C_R\|^2=1+\|\rho\|^2.                 \tag{3.3}
\]

It remains to bound `rho` without a hidden finite constant.  Write
`v_n=h_(n,lambda)(0)`.  The exact finite-Fourier relation is

\[
 |I_n|=\chi_n|v_n|.                                        \tag{3.4}
\]

The transition theorem proves, for every even `n<n_star`,

\[
 |v_n|^2\leq V_0(\lambda)
 ={1\over\lambda}+8\pi\lambda.                            \tag{3.5}
\]

The ground prolate is positive and decreasing on `[0,lambda]`, so unit
normalization gives

\[
 |v_0|^2\geq{1\over2\lambda}.                             \tag{3.6}
\]

The pinned leading KRD estimate gives `d_4<=1/2` for `lambda>=2`; eigenvalue
ordering gives `d_0<=d_4`, hence `chi_0^2>=1/2`.  Combining
(3.4)--(3.6), and using `chi_t<=1`, gives the completely finite estimate

\[
 \boxed{
 |\rho_t|^2={\chi_t^2|v_t|^2\over\chi_0^2|v_0|^2}
 \leq4\lambda V_0(\lambda)=4+32\pi\lambda^2
 \quad(t<n_*).}                                            \tag{3.7}
\]

The exact remaining-block inventory and its proved coarse bound are

\[
 q_R=\max\left\{0,\left\lfloor{n_*-1\over4}\right\rfloor-2\right\}
 \leq{3\over2}\lambda^2.                                 \tag{3.8}
\]

If `q_R>=1`, equations (3.7)--(3.8) imply

\[
 1+\|\rho\|^2
 \leq q_R(5+32\pi\lambda^2)
 \leq{3\over2}\lambda^2(5+32\pi\lambda^2).              \tag{3.9}
\]

In particular, the two inputs to the rest estimate are explicitly

\[
 W_R=P_\kappa T\mathcal C_R,
 \qquad
 \|W_R\|^2\leq{\lambda^2\over2}(1+\|\rho\|^2),
 \qquad D_R\succeq d_{12}I.                               \tag{3.9a}
\]

Using (3.9)--(3.9a),

\[
\begin{aligned}
 M_R
 &=\|W_RD_R^{-1/2}\|^2\\
 &\leq{\lambda^2\over2d_{12}}(1+\|\rho\|^2)\\
 &\leq\boxed{{3\lambda^4(5+32\pi\lambda^2)\over4d_{12}}}.
\end{aligned}                                               \tag{3.10}
\]

For an empty remaining block set `M_R=0`; (3.10) is then unnecessary.
Neither (3.2) nor (3.10) uses a smallest physical singular value.

## 4. Fixed-index scale and the low action

The pinned fixed-index prolate asymptotic is

\[
 d_n(\lambda)\sim
 A_n\lambda^{2n+1}e^{-4\pi\lambda^2},
 \qquad
 A_n=4\sqrt2\,\pi{(16\pi)^n\over n!}.                     \tag{4.1}
\]

The coefficient ratio is exactly

\[
 {A_{12}\over A_8}
 ={(16\pi)^4\,8!\over12!}
 ={8192\pi^4\over1485}.
\]

Consequently

\[
 \boxed{
 {d_{12}\over d_8}
 \sim {8192\pi^4\over1485}\lambda^8.}                    \tag{4.2}
\]

This is a qualitative fixed-index equivalence; its pinned source has a
noncomputed starting threshold, so (4.2) is not used as a finite pilot
certificate.  It is sufficient for the stated asymptotic comparison.

The same fixed-index source limits give

\[
 \rho_8=-{I_8\over I_0}\longrightarrow-\frac{\sqrt{70}}{16}, \tag{4.3}
\]

so (3.2), (3.10), and (4.2) yield

\[
 M_8=O\!\left({\lambda^2\over d_8}\right),
 \qquad
 M_R=O\!\left({\lambda^6\over d_{12}}\right)
     =O\!\left({\lambda^{-2}\over d_8}\right).           \tag{4.4}
\]

Insert (1.12) and (4.4) into (2.10).  After enlarging one fixed polynomial
in `log(lambda)` to dominate the two admitted polylogarithmic factors,

\[
 C_8M_8
 =O\!\left({\lambda^3\operatorname {polylog}\lambda\over d_8}\right),
 \qquad
 C_RM_R
 =O\!\left({\lambda\operatorname {polylog}\lambda\over d_8}\right).
                                                                    \tag{4.5}
\]

Consequently

\[
 \boxed{
 \Gamma_L(\Delta_L)
 =O\!\left({\lambda^3\operatorname {polylog}\lambda\over d_8}\right).} \tag{4.6}
\]

This is stronger, on the low physical range, than the relaxed positive
alignment scale
`O(lambda^4*polylog(lambda)/d_8)`.  It is not a signed comparison and is
not by itself a bound for the full physical complement.

## 5. Conditional high-complement extension

Suppose an ambient physical space has an orthogonal decomposition

\[
 K=K_L\oplus K_H.                                           \tag{5.1}
\]

If a positive comparison metric `gI`, `g>0`, is available on `K_H`, and

\[
 \|S|_{K_H}\|^2\leq B_H,                                  \tag{5.2}
\]

put

\[
 \Delta=\Delta_L\oplus gI.                                \tag{5.3}
\]

The full row operator is

\[
 S\Delta^{-1}
 =\bigl[\,S|_{K_L}\Delta_L^{-1}\quad
          g^{-1}S|_{K_H}\,\bigr].                         \tag{5.4}
\]

Thus all low/high sampling interference is retained and

\[
 \boxed{
 \Gamma(\Delta)=\|S\Delta^{-1}\|^2
 \leq\Gamma_L(\Delta_L)+{B_H\over g^2}.}                  \tag{5.5}
\]

Formula (5.5) is conditional.  The project has not proved a value of `g` on
the actual physical complement `K_H=K_L^\perp`, nor a matching estimate that
makes `B_H/g^2` fit the required scale.  In particular, a Fourier-high
coercivity theorem cannot silently be transferred to this physical
orthogonal complement.

The obstruction already occurs in three dimensions.  Let

\[
 Q=\operatorname {diag}(1,-1,1),
 \qquad F_H=\operatorname {span}\{e_3\}.                   \tag{5.6}
\]

Then `Q|_(F_H)=I`, so the Fourier-high compression has floor `+1`.  For the
one-dimensional physical low space

\[
 K_L=\operatorname {span}\{e_1\},
 \qquad K_L^\perp=\operatorname {span}\{e_2,e_3\},         \tag{5.7}
\]

one also has `Q|_(K_L)=I`, so the low compression has floor `+1`, but

\[
 \langle e_2,Qe_2\rangle=-1.                              \tag{5.8}
\]

Thus positivity on `F_H`, even together with positivity on `K_L`, says
nothing about positivity on `K_L^\perp` without a proved geometric relation
between the Fourier and physical decompositions.

## 6. Why this is not the full exterior-metric quotient

The full exterior Gram of all anchor-deflated source columns generally has
the form

\[
 D_{\rm full}=
 \begin{bmatrix}
  D_8 & d_4\alpha_8\alpha_R^*+d_0b_8b_R^*\\
  d_4\alpha_R\overline{\alpha_8}+d_0b_R\overline{b_8}&D_R
 \end{bmatrix}.                                             \tag{6.1}
\]

The metric in (2.1) is `D_8 direct-sum D_R`; it is not asserted equal to
(6.1).  This distinction cannot be removed by saying that the two diagonal
compressions are known.

For an exact counterexample, take two one-dimensional source blocks, a
one-dimensional physical space, and

\[
 W=[\,1\;1\,],\qquad S=1,
 \qquad
 D_{\rm full}=\begin{bmatrix}2&-1\\-1&2\end{bmatrix}.      \tag{6.2}
\]

The diagonal compressions are `D_1=D_2=2`.  Their block-diagonal quotient
has

\[
 R_{\rm block}=WD_{\rm block}^{-1}W^*=1,
 \qquad \Delta_{\rm block}=1,
 \qquad \Gamma(\Delta_{\rm block})=1.                    \tag{6.3}
\]

Indeed the sharp one-block constants are `C_1=C_2=1/2` and
`M_1=M_2=1/2`, so (2.10) also gives exactly one.  On the other hand,

\[
 D_{\rm full}^{-1}={1\over3}
 \begin{bmatrix}2&1\\1&2\end{bmatrix},
 \qquad
 R_{\rm full}=WD_{\rm full}^{-1}W^*=2,                    \tag{6.4}
\]

and hence

\[
 \Delta_{\rm full}={1\over2},
 \qquad \Gamma(\Delta_{\rm full})=4.                    \tag{6.5}
\]

Thus a bound for the deliberately block-diagonal quotient does not bound
the quotient formed from the full metric.  The present theorem uses the
former consistently.  Any later signed theorem must compare the complete
shifted signed operator with this same block quotient, including all
low/low and low/high couplings; it may not switch to (6.1) without a new
argument.

## 7. Exact claim boundary

The proved conclusion is the low positive-sampling action (2.10), with the
finite synthesis bounds (3.2), (3.10) and the qualitative locked-schedule
scale (4.6).  It removes the low block-synthesis step from the positive
graph-action obstruction without invoking global Weil positivity, a zeta
zero table, or a lower physical Gram determinant.

The high term in (5.5), the full shifted signed comparison in both parity
sectors, the residual-action implication, and locally uniform determinant
convergence remain open.  In particular this note proves neither equation
(5.2) nor RH.  The only admissible project status here is `P0_INVALIDATED`.
