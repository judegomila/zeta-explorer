# Volterra quotient crosswalk: exact analogue, no source-level map to the pivot

## Scope and verdict

Freedman's Weyl/Volterra manuscript and the present correlated-trace
workstream have the same abstract quotient-Schur algebra.  They do **not**
yet have an algebraic or unitary identification of their quotient forms.

The safe conclusion is stronger than a merely notational objection.

1. The polynomial quotient has an actual direction whose value is exactly
   the unpaid pivot
   \[
   Q[\pi]=2\mathfrak q[\pi]=2S.
   \]
2. The source's intrinsic Volterra quotient is
   \[
   D_{{\rm trace},\omega}(x,x)
   =\inf\{Q_{\Phi,\omega}(f):R_\omega f=x\}.
   \]
3. Even granting the strongest positivity claims in the source's later
   Appendix C, the paper gives no fixed positive-multiple identification
   with the first Xi--Laguerre form.  With the same Xi normalization, the
   direct relation one can prove is instead a small-shift derivative of the
   **de Branges** diagonal:
   \[
   \boxed{
   Q[\pi]=2\lim_{\omega\downarrow0}{1\over\omega}
   \int_{\mathbb R}K^{\rm dB}_{E_\omega}(\nu,\nu)
                    |P_\pi(\nu)|^2\,d\nu .}       \tag{A}
   \]
4. The source explicitly does not construct the map from its Volterra/KLM
   features to those de Branges evaluation vectors.  In its notation the
   concrete evaluation trace map `z -> x_z` and the corresponding joint
   branch isometry remain missing.

Consequently the Volterra result is an exact structural analogue and a
plausible upstream route, but it cannot currently close the sign of
`Q[pi]`.  The missing bridge is precisely the one needed before (A) can be
used; it is not supplied by common theta input, kernel-block positivity, or
the Douglas range condition.

Primary source only for the literature claims: Marvin B. Freedman,
*Finite-core Volterra reductions for a Weyl-positive Riemann phase kernel*,
arXiv:2606.29555v1 [math.NT], 28 June 2026,
<https://arxiv.org/html/2606.29555>.  The relevant locations are Section
15.7, Problems 15.14--15.15, Section 16, Appendix A, Appendix C--C.1, and
Appendix D.1.

## 1. The common theta source is only a scalar match

The present workstream uses

\[
 \psi(x)=\sum_{n\ge1}4z_n(2z_n-3)e^{x/2-z_n},
 \qquad z_n=\pi n^2e^{2x}.                       \tag{1}
\]

The source's even Riemann kernel, denoted `Phi_V` here to distinguish its
normalization from the classical de Bruijn--Newman `Phi` used in
`RECENT_PF5_BARRIER_NEXT.md`, is

\[
 \Phi_V(x)=\sum_{n\ge1}2\left(
 2\pi^2n^4e^{9x/2}-3\pi n^2e^{5x/2}
 \right)e^{-\pi n^2e^{2x}}.                     \tag{2}
\]

Termwise comparison gives

\[
 \boxed{\psi(x)=2\Phi_V(x).}                     \tag{3}
\]

The two conventions obey `Phi_V(2t)=2Phi_dBN(t)`, so this is consistent with
`psi(2t)=4Phi_dBN(t)` in the PF5 note. Thus the programs use the same theta
source up to a positive scalar and dilation.  This does not identify the forms
derived from it.  The present target is the
one-dimensional spectral form

\[
 Q[p]={2\over\pi}\int_{\mathbb R}
 \{\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)\}
 |P_p(\nu)|^2\,d\nu,
 \qquad P_p(\nu)=p(i\nu),                         \tag{4}
\]

whereas the source starts from the two-dimensional Weyl symbol

\[
 \sigma_\omega(x,\xi)=\int_{|x|}^{\infty}
 y\cosh(2\omega y)\widehat C_y(2\xi)\,dy,
 \qquad |\omega|<1/2,                             \tag{5}
\]

and its coordinate kernel `K_omega(a,b)`.  Its Volterra variables are
obtained after parity, primitive, log-coordinate, and positive diagonal
normalizations; in Appendix C its basic ratio is

\[
 A_s(u)={\Psi(s+u)\over\Psi(s)},
 \qquad \Psi(v)=\Phi_V(v/2).                       \tag{6}
\]

Equality (3) fixes the source scalar.  It supplies no map from the
polynomial multiplier `P_p` in (4) to a Volterra trace vector.

## 2. The exact finite polynomial quotient

Let `P` be the old polynomial prefix and retain `G_Y`, `Q`, `q_Y`, `q_A`,
and `pi=p-q_A` from `CORRELATED_TRACE_ARITHMETIC_NEXT.md`.  The exact
three-block completion is

\[
 \mathcal M[(\alpha,\beta,t)]
 =G_Y[\alpha+\beta+tq_Y]+Q[\alpha+tq_A]
  +|t|^2Q[\pi].                                   \tag{7}
\]

Shorting the first old block gives the bordered parallel-trace form `B`,
with variational identity

\[
 B[(q,t)]
 =\inf_{a\in P}
 \{G_Y[a+q+tq_Y]+Q[a+tq_A]\}+|t|^2Q[\pi].        \tag{8}
\]

At the actual direction

\[
 t=1,\qquad q=q_A-q_Y,\qquad a=-q_A,
\]

both nonnegative old-channel terms vanish.  Therefore

\[
 \boxed{B[(q_A-q_Y,1)]=Q[\pi]=2\mathfrak q[\pi]=2S.} \tag{9}
\]

This is a quotient value, not an unspecified boundary error.  Any proposed
positive completion of the correlated trace must sign the actual new pivot.

## 3. The exact Volterra quotient

At a fixed `omega`, the source completes a Volterra form domain with trace
map

\[
 R_\omega:V_\omega\longrightarrow X_{R,\omega},
 \qquad N_\omega=\ker R_\omega.                  \tag{10}
\]

The source writes these objects as `V`, `R_global`, and `X_R`; the `omega`
subscript here only makes the parameter dependence visible.

Use the canonical bounded section

\[
 J_\omega=(R_\omega|_{N_\omega^\perp})^{-1}.
\]

Writing `f=n+J_omega x`, the form has the block expression

\[
 Q_{\Phi,\omega}(n+J_\omega x)
 =\langle A_\omega n,n\rangle
 +2\operatorname {Re}\langle B_\omega x,n\rangle
 +\langle C_\omega x,x\rangle.                  \tag{11}
\]

The source's bounded Douglas factorization supplies an operator
`Gamma_omega` such that the cross form is

\[
 b_\omega(n,x)
 =\langle A_\omega^{1/2}n,\Gamma_\omega x\rangle.
\]

The intrinsic quotient is therefore

\[
 D_{{\rm trace},\omega}
 =C_\omega-\Gamma_\omega^*\Gamma_\omega.         \tag{12}
\]

One may write the subtracted quadratic form as
`B_omega^* A_omega^+ B_omega` in Moore--Penrose form notation.  As an
ordinary operator product, and for the formal minimizer
`n_x=-A_omega^+B_omega x` to be attained, one additionally needs
`B_omega x` in `Dom(A_omega^+)`, equivalently
`Gamma_omega x` in `Ran(A_omega^(1/2))`.  The bounded factorization alone
guarantees the infimum, not its attainment.  With this domain distinction,
the source's section-independent constrained-energy identity is

\[
 \boxed{
 D_{{\rm trace},\omega}(x,x)
 =\inf\{Q_{\Phi,\omega}(f):R_\omega f=x\}.}       \tag{13}
\]

Equations (8) and (13) are the exact crosswalk: both are quotient energies
after minimizing over a kernel/old subspace.  They are not an equality
between the two concrete quotient forms.

The elementary model

\[
 Q_*(n,u)=n^2+2bnu+cu^2,
 \qquad R(n,u)=u,                                 \tag{14}
\]

shows why the distinction matters.  Positivity on `ker R` and exact range
factorization of the cross term hold for every `b,c`, while the quotient is

\[
 D_*(u)=(c-b^2)u^2,                               \tag{15}
\]

which has either sign.  This finite model is only a logical check: it is not
a theta or Weyl counterexample.

## 4. Source-status audit: grant the strongest Appendix C claim

The v1 source has two unreconciled status layers.

- Section 15.7 defines (12)--(13), calls `D_trace>=0` the next continuum
  theorem, and asks for a positive Volterra/Green Gram formula.
- The beginning of Appendix C writes `D_trace=P-M`, says the positive-square
  theorem remains open, and reduces it to a Hardy--Volterra contraction.
- Later in the same appendix the source records a completed-domain identity
  \[
  G_-=CKE G_+,\qquad\|CKE\|\le1,                  \tag{16}
  \]
  and from it asserts `M<=P`, `D_q=0`, the quotient-to-original Weyl lift,
  and uniform `|omega|<1/2` Weyl/KLM positivity.
- The abstract, Section 16, and Appendix A still list the original-Weyl lift
  and uniform-parameter coverage as external open links.

This note does not resolve that editorial/status conflict.  To avoid taking
credit away from the source, the no-transfer conclusion below grants the
strongest later claim: assume (16), `D_trace>=0`, the original Weyl lift, and
uniform Weyl/KLM positivity are all valid.

Even under that grant, the source itself continues to label the
KLM/de Branges transport as missing.  Therefore the no-transfer conclusion
does not depend on declaring the Volterra quotient negative or unproved.

## 5. The target normalization is a de Branges small-shift derivative

Let

\[
 E_\omega(z)=\Xi(z+i\omega),
 \qquad E_\omega^\#(z)=\Xi(z-i\omega),            \tag{17}
\]

using the same real-entire Xi normalization as (4).  The source's de Branges
kernel convention is

\[
 K^{\rm dB}_{E_\omega}(w,z)
 ={E_\omega(z)\overline{E_\omega(w)}
   -E_\omega^\#(z)\overline{E_\omega^\#(w)}
  \over 2\pi i(\overline w-z)}.                  \tag{18}
\]

Taking the removable diagonal value at a real `nu` gives the exact formula

\[
 K^{\rm dB}_{E_\omega}(\nu,\nu)
 =-{1\over\pi}\operatorname {Im}
 \{\Xi'(\nu+i\omega)\Xi(\nu-i\omega)\}.          \tag{19}
\]

Taylor expansion at `omega=0` therefore yields

\[
 \boxed{
 \lim_{\omega\downarrow0}
 {K^{\rm dB}_{E_\omega}(\nu,\nu)\over\omega}
 ={\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu)\over\pi}.}  \tag{20}
\]

Complete-theta decay supplies a polynomially weighted dominator for small
`omega`, so (20) may be integrated against `|P_pi(nu)|^2`.  Combining it
with (4) proves (A).

If the harmless conventional normalization in the source replaces `Xi` by
`c Xi`, both (19) and the Laguerre density in (4) scale by `c^2`.  Fixing the
same Xi convention therefore gives exactly the factor `2` in (A); changing
that convention introduces no sign change.

This identifies the normalization mismatch exactly:

- `D_trace,omega` is a fixed-parameter quotient on the completed endpoint
  trace range `X_R,omega`;
- `Q[pi]` is a right derivative at `omega=0` of an integral of **boundary
  diagonal de Branges evaluations**;
- the polynomial appears as the external weight `|P_pi(nu)|^2`, not as one
  of the source's order-eight endpoint traces.

Thus a fixed scalar identity

\[
 Q[\pi]=c\,D_{{\rm trace},\omega}(U\pi,U\pi)      \tag{21}
\]

is not derived by the paper; the directly visible normalization is instead
the derivative/direct-integral identity (A).  One sufficient trace-side
realization of the source's advertised bridge would construct a field of
trace vectors `x_(nu,omega)` satisfying a polarized identity of the form

\[
 K^{\rm dB}_{E_\omega}(w,z)
 =D_{{\rm trace},\omega}
   (x_{z,\omega},x_{w,\omega}),                  \tag{22}
\]

with the appropriate complex polarization, and then justify the real-boundary
and `omega -> 0` limits in (A).  This pointwise realization is not logically
necessary: the source's KLM-level pullback `T_omega`, a closed-cone
approximation, or a direct integrated identity for the weighted diagonal in
(A) could also suffice.  The source supplies none of those completed routes,
and every route proceeding through (A) must still justify its real-boundary
and small-shift limits.

## 6. The source explicitly stops before (22)

Appendix C.1 formulates the missing bridge as an operator `T_omega`, or a
closed-cone family `T_(omega,R)`, pulling the KLM kernel back to
`K_Eomega^dB`.  Later it rewrites the same requirement as a joint-branch
isometry

\[
 Uh_z^+=G_+(z),\qquad Uh_z^-=G_-(z),              \tag{23}
\]

and says explicitly that the concrete evaluation trace map

\[
 z\longmapsto x_z\in X_R                          \tag{24}
\]

is still missing.  The source's tested bare exponential jets, scalar branch
normalizations, coarea multipliers, and finite atom dictionaries do not
construct it.  Appendix D.1 further finds that the old endpoint trace
`Lambda_a` does not represent the Mellin boundary prefix; it introduces an
augmented Mellin trace and still leaves the final de Branges evaluation
pullback as the remaining item.

This is explicit in the source, not inferred from silence: its dependency
map separately requires construction of `T_omega` (or `T_(omega,R)`) and
then says to pass the shifted-Xi de Branges statement to the endpoint.
Formula (A) identifies the endpoint operation needed for the present
weighted Laguerre pivot: a real-diagonal boundary value followed by the
right derivative at `omega=0`.

These observations are used only as a source-status audit.  Numerical probe
failure is not a theorem that no transmutation exists.  The rigorous point
is that the source supplies no map satisfying (22) or the boundary/derivative
passage required by (A).

If (22) were eventually proved for all sufficiently small positive `omega`,
then positivity of the de Branges diagonal and (20) would indeed give

\[
 \Xi'^2-\Xi\Xi''\ge0
\]

on the real line and hence `Q[pi]>=0`.  That is why importing the missing
bridge as if it were already proved would assume the precise external link
that the source still leaves to construct.  A future noncircular proof of
that bridge could close the sign.

## 7. Exact source-level no-transfer conclusion

The relationship is

\[
\begin{array}{c|c|c}
 &\text{minimized subspace}&\text{quotient object}\\ \hline
\text{polynomial trace}&\text{old polynomial channels}&Q[\pi]=2S\\
\text{Volterra trace}&\ker R_\omega&D_{{\rm trace},\omega}
\end{array}                                       \tag{25}
\]

The quotient algebras match, but the concrete domains, parameter
normalization, and evaluation maps do not.  The strongest conclusion
supported by the primary source is therefore:

\[
 \boxed{\text{Freedman 2606.29555 contains no proved identification that
 signs }Q[\pi].}                                  \tag{26}
\]

This is a rigorous no-transfer conclusion from the theorems currently stated
in the source, not a claim that a future Volterra--Xi transmutation is
impossible.

## Nonclaims

- The common normalization (3) is not a quadratic-form equivalence.
- The status conflict in Section 15/Appendix C is not used to reject the
  source's strongest Volterra/Weyl claim.
- The finite model (14)--(15) is not a counterexample to the source kernel.
- Failed finite ansatzes in the source do not rule out a future nonlocal
  intertwiner.
- No assertion here proves or disproves Weyl positivity, KLM positivity, the
  first Xi Laguerre inequality, or RH.
