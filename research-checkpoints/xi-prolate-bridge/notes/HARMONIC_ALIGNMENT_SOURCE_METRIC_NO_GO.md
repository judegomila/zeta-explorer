# Harmonic alignment and the lossless source-metric no-go

## 0. Claim boundary

This note proves finite-dimensional identities and exact structural
counterexamples.  It does not prove the missing arithmetic alignment estimate,
either shifted sector sign on an unbounded schedule, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform characteristic-function convergence, or
the Riemann hypothesis.  The formal repository state remains
`P0_INVALIDATED`.

The point is precise.  Harmonic Schur reduction turns the natural-cutoff
alignment into one rank-one operator inequality.  Pulling that inequality back
through any positive full-source metric is a congruence, so a lossless source
whitening cannot improve or weaken the exact target.  It can provide useful
anisotropic coordinates and spectral clusters, but replacing those clusters by
one worst generalized eigenvalue is a genuinely lossy relaxation.

No zero table, global Weil positivity, cached matrix, or numerical eigensystem
is used below.

## 1. Locked source conventions

Put

\[
 L=2\log\lambda,
 \qquad I_\lambda=[-L/2,L/2]=[-\log\lambda,\log\lambda]. \tag{1.1}
\]

The physical logarithmic space uses Lebesgue measure, zero extension, and

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx.          \tag{1.2}
\]

Multiplicative inversion is reflection, $Jf(x)=f(-x)$, and is never dropped.
The prolate source functions live on $[-\lambda,\lambda]$, with Lebesgue
measure and zero extension, in the even zero-Lebesgue-integral source space

\[
 \mathcal H_0^{\rm ev}
 =\left\{h\in L^2[-\lambda,\lambda]:h(-x)=h(x),
                   \ \int_{-\lambda}^{\lambda}h(x)\,dx=0\right\}. \tag{1.3}
\]

The source normalization is retained; unit normalization is not substituted.
The complete multiplier is

\[
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),\qquad
 S_\lambda(t)=\sum_{1<n\leq\lambda^2}
       {\Lambda(n)\over\sqrt n}\cos(t\log n).           \tag{1.4}
\]

Thus every prime power through the inclusive endpoint $n\leq\lambda^2$ is
present, and the prime block has the minus sign of source equation (3.19).
Pole, archimedean, and prime contributions are combined before an inverse,
quadratic form, or absolute value is taken.

## 2. Exact harmonic Schur graph

Work in the inversion-even anchor complement

\[
 \mathcal K=E_N^+\cap\kappa^\perp
            =\mathcal L_M\oplus\mathcal H_M,             \tag{2.1}
\]

where $\mathcal L_M$ is the natural anchor-transverse harmonic low space.
At a simple true ground $\mu$ with nonzero anchor overlap, let

\[
 B=B_\mu=P_{\mathcal K}(Q_+-\mu I)P_{\mathcal K}|_{\mathcal K}\succ0,
 \qquad b=P_{\mathcal K}Q_+\kappa.                       \tag{2.2}
\]

The vector $b$ is the complete combined pole--archimedean--minus-prime
forcing.  Relative to (2.1), write

\[
 B=\begin{pmatrix}A&C^*\\ C&D\end{pmatrix},
 \qquad b=\binom{b_L}{b_H},
 \qquad D\succ0.                                        \tag{2.3}
\]

Let $\iota_L:\mathcal L_M\to\mathcal K$ be the ordinary inclusion and set

\[
 S=A-C^*D^{-1}C\succ0,
 \qquad f=b_L-C^*D^{-1}b_H,                              \tag{2.4}
\]

\[
 U:\mathcal L_M\longrightarrow\mathcal K,
 \qquad U\ell=\binom{\ell}{-D^{-1}C\ell}.              \tag{2.5}
\]

### Lemma 2.1 (lossless harmonic graph identities)

One has

\[
 \boxed{BU=\iota_LS,\qquad U^*B^2U=S^2,\qquad U^*b=f.}  \tag{2.6}
\]

**Proof.**  Direct block multiplication gives

\[
 BU=\binom{A-C^*D^{-1}C}{C-DD^{-1}C}
    =\binom{S}{0}=\iota_LS.
\]

The second identity is $(BU)^*(BU)=S\iota_L^*\iota_LS=S^2$, and the third
is the definition of $f$.  \(\square\)

The coefficient-normalized ground is $x=\kappa-B^{-1}b$.  Eliminating its
high correction gives

\[
 P_{\mathcal L_M}B^{-1}b=S^{-1}f,
\]

and hence the exact harmonic alignment is

\[
 \boxed{A_M=\|P_{\mathcal L_M}x\|^2
              =f^*S^{-2}f.}                            \tag{2.7}
\]

Every inverse in this section requires the displayed strict positivity.  A
singular $B$, $D$, or $S$ is not a passing branch of these formulas.

## 3. The sharp rank-one certificate

Let $c\geq0$.  Since $S\succ0$, congruence by $S^{-1}$ proves

\[
\begin{aligned}
 ff^*\preceq cS^2
 &\Longleftrightarrow
 (S^{-1}f)(S^{-1}f)^*\preceq cI\\
 &\Longleftrightarrow
 \|S^{-1}f\|^2\leq c\\
 &\Longleftrightarrow
 \boxed{f^*S^{-2}f\leq c.}                             \tag{3.1}
\end{aligned}
\]

Thus the desired source-scale alignment $A_M\leq C_0^2/\lambda$ is
*exactly*, rather than merely implied by,

\[
 \boxed{ff^*\preceq {C_0^2\over\lambda}S^2.}           \tag{3.2}
\]

Equivalently, for every $\ell\in\mathcal L_M$,

\[
 |\langle\ell,f\rangle|^2
 \leq {C_0^2\over\lambda}\|S\ell\|^2.                \tag{3.3}
\]

There are three exact finite tests for (3.1).

1. **Bordered positive-semidefinite test**

   \[
    \boxed{
    \begin{pmatrix}S^2&f\\f^*&c\end{pmatrix}\succeq0.} \tag{3.4}
   \]

2. **Adjugate scalar test**

   \[
    \boxed{c\det(S)^2-\|\operatorname{adj}(S)f\|^2\geq0.} \tag{3.5}
   \]

   Its left side is the determinant of (3.4).

3. **Ambient ground-cofactor test.**  Put
   $H_0=Q_+-\mu I$, $C_0=\operatorname{adj}(H_0)$, and
   $c_\kappa=\kappa^*C_0\kappa>0$.  Corank-one ground algebra gives

   \[
    A_M={\operatorname{tr}(P_{\mathcal L_M}C_0)\over c_\kappa}.
   \]

   Therefore $A_M\leq C_1^2/\lambda$ is equivalent to

   \[
    \boxed{
    \lambda\operatorname{tr}(P_{\mathcal L_M}C_0)
       \leq C_1^2\,\kappa^*C_0\kappa.}                 \tag{3.6}
   \]

The adjugate and cofactor forms are finite replay tests, not substitutes for
the missing source estimate.  Formula (3.6) also requires a simple ground;
for nullity at least two, $\operatorname{adj}(H_0)=0$.

## 4. Full-source whitening is coordinate-only

The admitted full-source analysis map in the plus sector is

\[
 T=P_XS_+A_\lambda:\mathcal H_0^{\rm ev}\longrightarrow X,
 \qquad X=E_N^+\cap\kappa^\perp=\mathcal K,             \tag{4.1}
\]

where

\[
 (A_\lambda h)(u)=\sqrt u\sum_{m\leq\lambda/u}h(mu),
 \qquad S_+={I+J\over2}.                               \tag{4.2}
\]

This is the untruncated full even zero-integral source space, not a prescribed
finite prolate family.  The admitted right-inverse construction uses the
complete integer inventory $1\leq m\leq\lfloor\lambda^2\rfloor$ and proves
that $T$ is onto every fixed finite $X$.  Consequently $TT^*\succ0$.

Pull that row metric onto the harmonic graph:

\[
 R_0=U^*(TT^*)U\succ0.                                 \tag{4.3}
\]

Define

\[
 \mathsf H=R_0^{-1/2}S^2R_0^{-1/2},
 \qquad g=R_0^{-1/2}f.                                 \tag{4.4}
\]

Then

\[
 \begin{pmatrix}\mathsf H&g\\g^*&c\end{pmatrix}
 =
 \begin{pmatrix}R_0^{-1/2}&0\\0&1\end{pmatrix}
 \begin{pmatrix}S^2&f\\f^*&c\end{pmatrix}
 \begin{pmatrix}R_0^{-1/2}&0\\0&1\end{pmatrix}.       \tag{4.5}
\]

Thus the whitened and unwhitened bordered matrices are congruent and have the
same inertia.  Moreover,

\[
 \boxed{g^*\mathsf H^{-1}g=f^*S^{-2}f=A_M.}             \tag{4.6}
\]

No positive source metric can improve the exact certificate: it only changes
coordinates.  If a truncated source map makes $R_0$ singular, (4.4) is not
an admitted whitening and the certificate must fail closed.

The scalar relaxation

\[
 \beta=g^*g=f^*R_0^{-1}f,
 \qquad \alpha=\lambda_{\min}(\mathsf H)               \tag{4.7}
\]

gives

\[
 A_M\leq{\beta\over\alpha},                            \tag{4.8}
\]

but (4.8) replaces every anisotropic generalized eigenvalue by the worst one.
It is not lossless.

## 5. Sharp generalized spectral weights

Let

\[
 S^2v_j=\vartheta_jR_0v_j,
 \qquad v_i^*R_0v_j=\delta_{ij},
 \qquad \vartheta_j>0.                                 \tag{5.1}
\]

Expanding $g$ in the orthonormal eigenbasis of $\mathsf H$ gives the exact
formula

\[
 \boxed{A_M=\sum_j{|v_j^*f|^2\over\vartheta_j}.}        \tag{5.2}
\]

For any disjoint spectral clustering $I_r$ with

\[
 0<a_r\leq\vartheta_j\leq b_r\quad(j\in I_r),
 \qquad w_r=\sum_{j\in I_r}|v_j^*f|^2,                 \tag{5.3}
\]

one has the independently testable two-sided certificate

\[
 \boxed{
 \sum_r{w_r\over b_r}\leq A_M\leq\sum_r{w_r\over a_r}.} \tag{5.4}
\]

The scalar bound $\beta/\alpha$ is the one-cluster upper bound with the
global minimum.  Equality in it occurs precisely when every nonzero forcing
weight lies in the minimum generalized eigenspace.

## 6. Exact scalar-loss fixture

For an integer $n\geq2$, take

\[
 R_0=I,
 \qquad S=\begin{pmatrix}1/n&0\\0&1\end{pmatrix},
 \qquad f=\binom{1/n}{1}.                              \tag{6.1}
\]

Then

\[
 A_M=f^*S^{-2}f=2,
 \qquad {\beta\over\alpha}=n^2+1.                    \tag{6.2}
\]

The scalar relaxation can therefore lose an arbitrarily large factor.  This
example embeds in the positive-semidefinite corank-one ground block

\[
 Q_n=\begin{pmatrix}
 1+1/n&1/n&1\\
 1/n&1/n&0\\
 1&0&1
 \end{pmatrix},                                       \tag{6.3}
\]

whose ground vector is $(1,-1,-1)^T$.  Relative to the first coordinate as
anchor, its complementary block and forcing are exactly $S$ and $f$.

## 7. Exact diagonal source-Cauchy obstruction

The source-Cauchy identities and strict sector signs do not force decay of
(2.7).  Fix $N\geq2$, real $U_0$, and $0<\varepsilon<G$.  Set all raw
Cauchy coefficients to zero and take

\[
 a_0=U_0,
 \qquad a_{\pm1}=U_0+\varepsilon,
 \qquad a_{\pm n}=U_0+G\quad(2\leq n\leq N).           \tag{7.1}
\]

Every off-diagonal entry is exactly
$(b_n^{\rm C}-b_m^{\rm C})/(n-m)=0$.  In parity coordinates,

\[
 Q_+=\operatorname{diag}(U_0,U_0+\varepsilon,U_0+G,\ldots),
 \quad
 Q_-=\operatorname{diag}(U_0+\varepsilon,U_0+G,\ldots). \tag{7.2}
\]

With

\[
 \kappa={3\over5}e_0+{4\over5}e_1^+,
 \qquad w=-{4\over5}e_0+{3\over5}e_1^+,               \tag{7.3}
\]

the lower Ritz value and true ground are $u=\mu=U_0$, and

\[
 q-u={16\over25}\varepsilon,
 \quad b={12\over25}\varepsilon,w,
 \quad \langle w,(Q_+-uI)w\rangle={9\over25}\varepsilon. \tag{7.4}
\]

Take $\mathcal L_M=\mathbb Cw$; all remaining modes form the high block.
Then $C=0$ and

\[
 S={9\over25}\varepsilon,
 \qquad f={12\over25}\varepsilon,
 \qquad \boxed{A_M={f^2\over S^2}={16\over9}.}         \tag{7.5}
\]

Both shifted sectors are strictly positive and the anchor has zero high tail
for every $M\geq1$.  The boundary determinant identity also holds exactly.
This growing rational harmonic family is structural, not the pinned arithmetic
Weil matrix or the source-normalized prolate state.  It proves that a genuinely
arithmetic orientation estimate is still necessary.

## 8. The sole surviving actual-source inequality

Define the right-continuous ordinary Chebyshev function

\[
 \psi_C(X)=\sum_{n\leq X}\Lambda(n)
\]

and the complete discrepancy

\[
 \boxed{
 G_\lambda(t)=e^t-\psi_C(e^t)
              -{1\over2}\log(1-e^{-2t}),
 \qquad 0<t\leq L.}                                   \tag{8.1}
\]

The prime-power endpoint is inclusive.  For $v\in\mathcal K$, let

\[
 q_v(t)=\langle v,K_t\kappa\rangle,
 \qquad w_v(t)=e^{-t/2}q_v(t).                          \tag{8.2}
\]

Zero extension and $v\perp\kappa$ give $q_v(0)=q_v(L)=0$.  The complete
combined source identity, with the endpoint atom retained before this
boundary cancellation, is

\[
 \boxed{
 \langle v,b\rangle
 =-\int_0^L G_\lambda(t)
       \bigl(e^{-t/2}q_v(t)\bigr)'\,dt.}                \tag{8.3}
\]

Substitute $v=U\ell$ and use (2.6).  The exact target (3.2) is equivalent
to the following single actual-source statement:

\[
 \boxed{
 \left|\int_0^L G_\lambda(t)
       \bigl(e^{-t/2}q_{U\ell}(t)\bigr)'\,dt\right|^2
 \leq {C_0^2\over\lambda}\,\|B_\mu U\ell\|^2
 \quad\text{for every }\ell\in\mathcal L_M.}          \tag{8.4}
\]

This is the surviving arithmetic input.  It must use the complete
${G_\lambda}$, the source-normalized prolate anchor, and the arithmetic graph
vectors $U\ell$.  Those test vectors themselves depend on the full signed
operator.  A pointwise PNT estimate against fixed tests, a full-source row
frame, separate pole/archimedean/prime norms, or the scalar
$\beta/\alpha$ relaxation does not prove (8.4).

## 9. Remaining obligation

On one admitted unbounded schedule one must prove (8.4), or an exactly
equivalent certificate such as (3.4)--(3.6), with $C_0$ independent of the
schedule point.  The source metric may be used to organize generalized
spectral clusters through (5.4), but no metric choice can change the exact
quantity $A_M$.  The two rational fixtures show separately that a scalar
worst-direction replacement can be arbitrarily wasteful and that the abstract
source-Cauchy/sector structure supplies no alignment decay.
