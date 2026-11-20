# Even Krylov--Ritz escape and cyclic-closure audit

## 0. Scope and exact outcome

The live scalar in the finite bridge need not be the Rayleigh value `q` or
the mandatory two-vector Ritz value.  Any source-reconstructed variational
upper bound `U` for the lowest even eigenvalue may be used.  This note asks
whether the lower value obtained from a larger even Krylov space is a real
escape route or only a disguised computation of the unknown ground
projector.

There are three exact conclusions.

1. For every fixed Krylov dimension, the lowering is a genuine variational
   improvement.  It is the unique root of a complement Feshbach equation,
   and it can be bounded by one declared polynomial trial vector without
   reconstructing an eigenvector.
2. The improvement can be decisive before cyclic closure.  An exact
   `N=3` source-Cauchy family below has a three-vector even Krylov value
   which passes both sector comparisons, while the mandatory two-vector
   value fails the odd comparison.  Exact rational minors also show that
   the three-vector space is not invariant and that its Ritz value is
   strictly above the true even ground value.
3. Krylov lowering supplies only the upper shift.  At cyclic closure it
   reconstructs the ground eigenpair on the cyclic reducing subspace.  If
   that subspace is proper, every Krylov vector and every moment of the
   comparison state is blind to its orthogonal reducing complement.  A
   second exact source-Cauchy pair makes the two complete moment sequences
   identical while the required sector comparisons pass in one model and
   fail in the other.

Thus a fixed or slowly growing source-defined polynomial witness is a
legitimate analytic route to a better upper shift.  It is not by itself a
sector-floor theorem.  A chain grown to the full cyclic dimension is an
eigenvalue computation, and it still needs either cyclic capture or a
separate lower bound on the unseen complement.

All source formulas below use the complete matrix, with the pole,
archimedean, and minus-prime contributions assembled before any matrix
power is taken.  No stored matrix, eigenvector, eigenvalue, or zero table is
used.  No global Weil positivity, signed asymptotic floor, equation (5.2),
or determinant limit is proved.  The formal project state remains
`P0_INVALIDATED`.

## 1. Even block and Krylov spaces

Let `Q_+=Q_+^*` act on a finite-dimensional even space, let `kappa` be a
unit vector, and put

\[
 q=\langle\kappa,Q_+\kappa\rangle,
 \qquad b=(Q_+-qI)\kappa,
 \qquad K=\kappa^\perp .                              \tag{1.1}
\]

Relative to `C kappa direct-sum K`, write

\[
 Q_+=\begin{bmatrix}q&b^*\\ b&A\end{bmatrix},
 \qquad A=P_KQ_+P_K|_K.                               \tag{1.2}
\]

For `m>=1`, define

\[
 \mathcal K_m=\operatorname {span}
 \{\kappa,Q_+\kappa,\ldots,Q_+^{m-1}\kappa\},
 \qquad
 U_m=\lambda_{\min}(P_{\mathcal K_m}Q_+|_{\mathcal K_m}).
                                                               \tag{1.3}
\]

The value `U_1=q`; `U_2` is exactly the mandatory lower two-vector Ritz
value in `DIRECT_RH_ATTACK.md`.  Since the spaces are nested,

\[
 \mu_+:=\lambda_{\min}(Q_+)\leq U_{m+1}\leq U_m\leq q.
                                                               \tag{1.4}
\]

Using `U_m` changes neither the comparison state `kappa` nor its limiting
transform.  It changes only the scalar shift in the two sector
comparisons.  If

\[
 \alpha=\lambda_{\min}(A),
 \qquad \omega=\lambda_{\min}(Q_-),                  \tag{1.5}
\]

the finite bridge asks for

\[
 \alpha>U_m,\qquad \omega>U_m.                       \tag{1.6}
\]

Both inequalities become weakly easier as `m` grows.  In the odd endpoint
Schur coordinates of
`notes/RITZ_SHIFTED_TAIL_DISCREPANCY_SCHUR_GATE.md`, put
`t_m=q-U_m`.  The exact transport remains

\[
 B_{U_m}=B_q+t_mI,\qquad a_{U_m}=a_q+t_m,
 \qquad c_{U_m}=c_q.                                 \tag{1.7}
\]

In particular, the combined transverse vector is not split or altered:

\[
 s_{U_m}=D(Q_+-U_mI)\kappa-(\delta\kappa)\beta
        =s_q+t_mD\kappa=(Q_--U_mI)D\kappa.           \tag{1.8}
\]

## 2. Exact Krylov--Feshbach theorem

For `ell>=1`, put

\[
 \mathcal C_\ell=\operatorname {span}
 \{b,Ab,\ldots,A^{\ell-1}b\}\subseteq K.            \tag{2.1}
\]

### Theorem 2.1 (complement Krylov identity and Feshbach root)

For every `m>=2`,

\[
 \boxed{\mathcal K_m=\mathbb C\kappa\oplus
                    \mathcal C_{m-1}.}              \tag{2.2}
\]

Assume `b!=0` and that no Krylov breakdown occurs before
`mathcal C_(m-1)`.  Let

\[
 A_{m-1}=P_{\mathcal C_{m-1}}A|_{\mathcal C_{m-1}}.
\]

Then `U_m` is the unique real root below
`lambda_min(A_(m-1))` of

\[
 \boxed{
 q-z-\langle b,(A_{m-1}-zI)^{-1}b\rangle=0.}        \tag{2.3}
\]

Equivalently, with `t_m=q-U_m`,

\[
 \boxed{
 t_m=\langle b,(A_{m-1}-qI+t_mI)^{-1}b\rangle.}     \tag{2.4}
\]

Whenever the next Krylov vector enlarges the space, the corresponding
nested Ritz inequality `U_(m+1)<U_m` is strict.

**Proof.**  The block formula (1.2) gives

\[
 Q_+\kappa=q\kappa+b,
 \qquad Q_+z=\langle b,z\rangle\kappa+Az
 \quad(z\in K).
\]

Induction proves (2.2).  The compression to its right side is

\[
 \begin{bmatrix}q&b^*\\ b&A_{m-1}\end{bmatrix}.    \tag{2.5}
\]

The vector `b` is cyclic for the compressed complement before breakdown.
Hence its projection onto every eigenspace of `A_(m-1)` is nonzero.  On the
interval below the least such eigenvalue, the left side of (2.3) decreases
strictly from positive infinity to negative infinity, because its
derivative is

\[
 -1-\langle b,(A_{m-1}-zI)^{-2}b\rangle<0.
\]

The block determinant or ordinary Schur elimination identifies the unique
root with the least eigenvalue of (2.5).  Substitution `z=q-t_m` gives
(2.4).  Strict interlacing for the unreduced Lanczos tridiagonal gives the
last assertion.  \(\square\)

The theorem exposes exactly what a higher Ritz value computes: it replaces
the full complement resolvent in the ground-state Feshbach equation by its
Galerkin resolvent on a source-declared complement Krylov space.  It is not
an odd-sector approximation and does not estimate either floor in (1.5).

## 3. Moment pencil and a noncircular polynomial witness

Define the complete combined moments

\[
 \nu_j=\langle\kappa,Q_+^j\kappa\rangle,
 \qquad j\geq0,                                      \tag{3.1}
\]

and the Hankel matrices

\[
 G_m=(\nu_{i+j})_{0\leq i,j<m},
 \qquad H_m=(\nu_{i+j+1})_{0\leq i,j<m}.            \tag{3.2}
\]

Before Krylov breakdown, `G_m>0` and

\[
 \boxed{
 U_m=\min_{0\ne c\in\mathbb C^m}
 {c^*H_mc\over c^*G_mc}.}                            \tag{3.3}
\]

Indeed, for `p(t)=\sum_{j=0}^{m-1}c_jt^j`, the quotient in (3.3) is exactly

\[
 {\langle p(Q_+)\kappa,Q_+p(Q_+)\kappa\rangle
  \over\|p(Q_+)\kappa\|^2}.                         \tag{3.4}
\]

Consequently, an explicitly declared polynomial `p` gives a rigorous upper
bound for `U_m` and hence for `mu_+`; one need not reconstruct the Ritz
eigenvector.  This is the useful fixed-dimensional escape.  Exact
optimization of (3.3) uses moments only through order `2m-1`.

At the other extreme, let

\[
 \mathcal C_\infty=\operatorname {span}\{A^jb:j\geq0\}.
\]

Finite dimensionality makes `mathcal C_infty` reducing for `A`, and

\[
 \mathcal M=\mathbb C\kappa\oplus\mathcal C_\infty
                                                               \tag{3.5}
\]

reducing for `Q_+`.  Krylov closure gives

\[
 U_\infty=\lambda_{\min}(Q_+|_{\mathcal M}).         \tag{3.6}
\]

If `mathcal C_infty=K`, this is the actual even ground value.  Its vector is
then, up to normalization,

\[
 \kappa-(A-U_\infty I)^{-1}b.                       \tag{3.7}
\]

Thus a complete cyclic calculation reconstructs the ground eigenpair.  If
`mathcal C_infty` is proper, then

\[
 \mu_+=\min\{U_\infty,
       \lambda_{\min}(A|_{\mathcal C_\infty^\perp})\},       \tag{3.8}
\]

and every moment (3.1) is blind to the second term.  The independent
condition `alpha>U_m` in (1.6) is precisely what excludes such a hidden
lower even direction.

## 4. Source reconstruction and the cancellation boundary

For the source modes `V_n`, the finite matrix is reconstructed from

\[
 Q_{nn}=a_n,
 \qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad
 a_{-n}=a_n,quad b_{-n}=-b_n.                      \tag{4.1}
\]

Here each `a_n,b_n` contains the complete source distribution and retains
the minus sign on the prime block and every prime power at the inclusive
endpoint.  Formula (4.1), followed by exact matrix multiplication, is an
independent source path to every vector and moment in Sections 1--3.  The
rank-two displacement identity

\[
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|                  \tag{4.2}
\]

also gives, for the even Krylov vectors `v_j=Q_+^j kappa`,

\[
 \boxed{
 Dv_{j+1}=Q_-Dv_j+\beta\,\delta(v_j).}              \tag{4.3}
\]

This is an exact boundary recurrence for replaying the derivative images of
the even chain.  It supplies no sign for (1.6).

The source radical identity currently controls the first quadratic energy
of the projected comparison state.  It does not supply bounds for the
higher combined moments in (3.1).  Already

\[
 \nu_2-q^2=\|(Q_+-qI)\kappa\|^2                    \tag{4.4}
\]

is an action norm.  To exploit `U_m<q` analytically, one must control the
declared polynomial quotient (3.4), or the equivalent combined recurrence,
at its actual source scale.

If `Q=Q_{\rm pole}+Q_{\rm arch}-Q_{\rm prime}`, then `Q^j` contains all
mixed words in these three blocks.  Replacing `nu_j` by a sum of separate
block moments is not an identity.  The safe reconstruction is to assemble
the source-signed `Q` first and then apply it recursively.  Likewise, the
odd transport must retain the single combined vector (1.8) before any norm
or absolute value is taken.

## 5. Exact source-Cauchy model where three vectors suffice

This section is a logical finite model of the source Cauchy algebra, not a
claim about an arithmetic Weil matrix.  Take `N=3` and declare

\[
 (a_0,a_1,a_2,a_3)=(15,9,18,7),
 \qquad (b_1,b_2,b_3)=(1,-2,6),                     \tag{5.1}
\]

with the reflection rules in (4.1).  This reconstructs the complete
seven-by-seven complex-mode matrix without stored spectral data.

Use the unnormalized parity bases

\[
 u_0=V_0,quad u_n=V_n+V_{-n},quad
 v_n=V_n-V_{-n}\quad(1\leq n\leq3).                \tag{5.2}
\]

Their Gram matrices are

\[
 G_+=\operatorname {diag}(1,2,2,2),
 \qquad G_-=2I_3.                                   \tag{5.3}
\]

Direct substitution in (4.1) gives the form matrices

\[
 B_+=
 \begin{pmatrix}
 15&2&-2&4\\
 2&20&-20/3&17/2\\
 -2&-20/3&34&88/5\\
 4&17/2&88/5&18
 \end{pmatrix},                                    \tag{5.4}
\]

\[
 B_-=
 \begin{pmatrix}
 16&-16/3&3/2\\
 -16/3&38&72/5\\
 3/2&72/5&10
 \end{pmatrix}.                                    \tag{5.5}
\]

Let `kappa=u_0`.  In the coordinates (5.2), the first four Krylov columns
are obtained by applying `G_+^(-1)B_+`; their determinant is

\[
 \det[\kappa,Q_+\kappa,Q_+^2\kappa,Q_+^3\kappa]
 ={95480647\over72000}\ne0.                         \tag{5.6}
\]

Thus the three-vector space is proper and the next Krylov vector really
enlarges it.

Every comparison below is an exact rational principal-minor calculation.
On `mathcal K_2`, the leading minors of the form `Q_+-7I` are

\[
 8,\qquad {112\over15},                             \tag{5.7}
\]

so

\[
 U_2>7.                                             \tag{5.8}
\]

On `mathcal K_3`, the leading minors of `Q_+-(1/4)I` are

\[
 {59\over4},\qquad {79801\over60},qquad
 -{213968474867\over4320000}.                       \tag{5.9}
\]

Hence

\[
 U_3<{1\over4}.                                     \tag{5.10}
\]

The same three-vector compression at shift `1/10` has positive leading
minors, the last one being

\[
 {223917156293\over2160000}>0,                      \tag{5.11}
\]

whereas the complete even form at that shift has its first three leading
minors positive and determinant

\[
 -{86907833\over45000}<0.                           \tag{5.12}
\]

Therefore, writing `mu_+` for the complete even floor,

\[
 \boxed{\mu_+<{1\over10}<U_3<{1\over4}.}            \tag{5.13}
\]

This proves from exact source parameters that `U_3` is not the ground
eigenvalue or its projector.

On `kappa^perp`, the leading minors of `Q_+-(1/3)I` are

\[
 {58\over3},\qquad600,\qquad {623\over75},           \tag{5.14}
\]

so `alpha>1/3`.  In the odd sector, the leading minors at shift `1` are

\[
 14,\qquad {4280\over9},\qquad {132751\over225},     \tag{5.15}
\]

while at shift `3/2` the first two are positive and the determinant is

\[
 -{17047\over900}<0.                                 \tag{5.16}
\]

Consequently

\[
 \boxed{
 U_3<{1\over4}<{1\over3}<\alpha,
 \qquad
 U_3<1<\omega<{3\over2}<7<U_2.}                    \tag{5.17}
\]

The three-vector upper shift satisfies both strict sector comparisons, but
the mandatory two-vector shift fails the odd one.  Since (5.13) shows that
the three-vector Ritz value is not exact, this is a finite-dimensional
proof that higher Krylov lowering can be a genuine intermediate route.
It proves no corresponding arithmetic asymptotic.

## 6. Exact all-moment hidden-complement obstruction

The source Cauchy algebra alone does not provide cyclic capture.  Take
`N=2`, set every `b_n=0`, and use the diagonal source parameters

\[
 a_0=2,qquad a_1=4,qquad a_2=c.                   \tag{6.1}
\]

Let

\[
 \kappa={e_0^++e_1^+\over\sqrt2},                  \tag{6.2}
\]

where the parity basis is normalized.  For every `j>=0`,

\[
 \boxed{
 \langle\kappa,Q_+^j\kappa\rangle
 ={2^j+4^j\over2},}                                 \tag{6.3}
\]

independently of `c`.  The complete Krylov closure has dimension two and
its lowest Ritz value is `U_infty=2`.  Nevertheless,

\[
 \alpha=\min\{3,c\},
 \qquad \omega=\min\{4,c\}.                        \tag{6.4}
\]

For `c=5`, both comparisons `alpha>2` and `omega>2` pass.  For `c=1`, both
fail.  The complete comparison-state moment sequence and every generated
Krylov vector are identical in the two models.  Both matrices have exact
source Cauchy form and rank-zero displacement, because `b_n=0`.

This is not an obstruction to using a Krylov upper shift together with
independent sector estimates.  It is an obstruction to deriving those
estimates from the Krylov sequence alone, even if the full infinite moment
sequence of the comparison state is known.

## 7. Exact frontier after the audit

There is a valid new scalar route:

1. choose a fixed or explicitly growing degree and a source-declared
   polynomial `p`;
2. reconstruct the complete signed action `p(Q_+)kappa` from (4.1), without
   blockwise powers;
3. prove an upper bound for the quotient (3.4) below independently proved
   lower bounds for `alpha` and `omega`; and
4. use that same shift in the combined odd vector (1.8) and in the weighted
   solve required by equation (5.2).

The route is noncircular while the polynomial degree stays below cyclic
closure and its quotient is controlled analytically.  It becomes a
reconstruction of the open even eigenproblem when the Krylov chain is grown
to the full cyclic dimension.  At every dimension, the signed sector
floors, the shifted solve, and locally uniform determinant convergence
remain separate obligations.
