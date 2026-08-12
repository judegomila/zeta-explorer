# Natural cross-root weighted-projector average target

## 0. Exact outcome and claim boundary

This note isolates a denominator-safe dyadic target for the natural
odd-halfgrid cross-root schedule.  It proves the finite linear-algebraic
identities and the selection implication.  It does **not** prove the
arithmetic average, the existence of a finite-good index in every dyadic
block, or visibility of the canonical boundary ground.

For an odd positive integer `p`, put

\[
 \lambda_p={p\over2},\qquad L_p=2\log\lambda_p,
 \qquad M_p={p+1\over2},\qquad N_p=M_p+1={p+3\over2}.
 \tag{0.1}
\]

Let `A_p=Q_(lambda_p,N_p,+)` be the inversion-even compression of the
actual complete pole-minus-archimedean-minus-prime source.  Write

\[
 \mu_p=\min\operatorname {spec}(A_p),\qquad
 E_p=\ker(A_p-\mu_pI),\qquad P_p=P_{E_p}.          \tag{0.2}
\]

Let `eta_p` be the finite source-boundary vector, `kappa_p` the unit
source-normalized projected prolate anchor, and `e_p=e_(N_p)^+` the last
even mode.  These objects are real in the locked parity basis; modulus
notation keeps the identities invariant under complexification.  Define

\[
 u_p=P_p\eta_p,\qquad a_p=\langle\kappa_p,u_p\rangle,
 \qquad c_p=\langle e_p,\kappa_p\rangle,
 \qquad k_p=1-|c_p|^2.                             \tag{0.3}
\]

For `k_p>0`, let

\[
 \Delta_p=\det\operatorname {Gram}(e_p,\kappa_p,u_p).
 \tag{0.4}
\]

The exact codimension-two identity is

\[
 \boxed{{\Delta_p\over k_p}
 =\|P_{{\cal L}_p}u_p\|^2,\qquad
 {\Delta_p\over k_p|a_p|^2}
 =\|P_{{\cal L}_p}(u_p/a_p)\|^2,}                 \tag{0.5}
\]

where the second formula is used only when `a_p!=0` and

\[
 {\cal L}_p=\operatorname {span}\{e_p,\kappa_p\}^{\perp}.
 \tag{0.6}
\]

Consequently, on a finite-good set `mathcal G_P` contained in the odd
integers `P<p<=2P`, the proposed actual-arithmetic theorem is

\[
 \boxed{
 \sum_{p\in{\cal G}_P}{\Delta_p\over k_p}
 \leq {C(\log P)^B\over P}
       \sum_{p\in{\cal G}_P}|a_p|^2.}             \tag{0.7}
\]

Here any fixed `B>=0` is sufficient for the cross-root limit bridge; the
sharp target has `B=0`.  Formula (0.7) is not proved below.  The note gives
its multiplicity-safe cofactor form, its simple-ground inverse-response
form, and the precise reason an entrywise prime large sieve does not imply
it.

This is a post-checkpoint-1.56 target/reduction pair.  It changes none of
the standard eight files, introduces no numerical artifact or zero list,
and makes no RH claim, converse, determinant-convergence claim, or
de Bruijn--Newman bound.  The formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly four theorem/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/UNCONDITIONAL_NATURAL_HALFGRID_CROSSROOT_SCHEDULE_THEOREM.md` | `d1b73fc246fcc70886ba78dc074adac585372a2abfc9fbba678c03c4d47e30a5` |
| `tests/test_unconditional_natural_halfgrid_crossroot_schedule_theorem.py` | `00627aa69143c39a468dd06808fe6859beb16aff197127e66a93ff042377f1b9` |
| `notes/CROSSROOT_EVEN_SECTOR_PROJECTIVE_ALIGNMENT_REDUCTION_BARRIER.md` | `0049b692b8cae38eb46734f6113be822a54ee6af8b17ea71d1687fa6a8666833` |
| `tests/test_crossroot_even_sector_projective_alignment_reduction_barrier.py` | `6cc13d0d1bcfc3d68ea67499f804e1d2fa59cb21b2c81fc314e9ddb289ad7754` |
| `notes/NATURAL_CUTOFF_SIGNED_GROUND_ALIGNMENT.md` | `ce6863d26788de9fc0fd9e998094fcb7982845ca298ccf8048d0913f62470450` |
| `tests/test_natural_cutoff_signed_ground_alignment.py` | `3ae99e6bbbc0004aa2560a577eca16d6ef0221d28fb2aefc3aef1d9558fae0bb` |
| `notes/CANONICAL_GROUND_MIXED_PROJECTOR_OVERLAP.md` | `f82357e99c54dffc8f11675e2ff32e65375b9a9fbb6480d318c11d3ff51a7730` |
| `tests/test_canonical_ground_mixed_projector_overlap.py` | `65c4efafa252b413e52d06ac915da09ff6fc26c49e022ba8fca9a048b660723e` |

The first pair supplies the unconditional odd-halfgrid natural schedule and
the `N=M+1` projective rates.  The second identifies the exact remaining
even-line statistic and the simple and canonical finite branches.  The
third supplies the complete signed source normal form and its common
shifted inverse.  The fourth supplies the derivative-cofactor formula for
a lowest eigenspace of arbitrary multiplicity.

No critical-schedule theorem, RH-conditional zero Gram, HSW-selected
ordinate, cached eigensystem, or standard-eight byte is imported.

## 2. The exact `N=M+1` Gram identity

Fix one index and omit `p`.  Because `N=M+1`, the even low-mode projector
is

\[
 \Pi_M=I-|e\rangle\langle e|.                     \tag{2.1}
\]

Put `q=Pi_M*kappa`.  Then

\[
 \|q\|^2=1-|\langle e,\kappa\rangle|^2=k,
 \qquad
 {\cal L}_M=\operatorname {Ran}\Pi_M\cap q^\perp.
 \tag{2.2}
\]

If `k>0`, the two vectors `e,kappa` are independent, and direct
orthogonality gives

\[
 \boxed{{\cal L}_M=\operatorname {span}\{e,\kappa\}^{\perp}.}
 \tag{2.3}
\]

Let `G_2=Gram(e,kappa)`.  Its determinant is `k`.  Applying the Schur
complement to the last row and column of `Gram(e,kappa,u)` gives

\[
 \begin{aligned}
 \Delta
 &=\det G_2\,
   \left(\|u\|^2-
   \|P_{\operatorname {span}\{e,\kappa\}}u\|^2\right)\\
 &=k\|P_{{\cal L}_M}u\|^2.
 \end{aligned}                                    \tag{2.4}
\]

Thus (0.5) is an identity, not an estimate.  If `a=<kappa,u>!=0`, the
coefficient-normalized canonical vector

\[
 X={u\over a},\qquad \langle\kappa,X\rangle=1     \tag{2.5}
\]

satisfies

\[
 \boxed{{\cal A}_p=\|P_{{\cal L}_p}X\|^2
 ={\Delta_p\over k_p|a_p|^2}.}                   \tag{2.6}
\]

The admitted natural prolate tail gives, for every fixed `A>0`,

\[
 |c_p|=O(P^{-A}),\qquad k_p=1-O(P^{-2A}),          \tag{2.7}
\]

after enlarging the starting block.  In particular `k_p>=1/2`
eventually.  Keeping `k_p` in (0.7) is nevertheless preferable: no
boundary estimate is silently absorbed into the arithmetic theorem.

## 3. Gate-restricted weighted selection

Let

\[
 {\cal C}_P=\{p:P<p\leq2P,\ p\ \operatorname {odd}\}. \tag{3.1}
\]

The set `mathcal G_P` must be a subset of `mathcal C_P` on which one of the
frozen even finite branches is actually valid.

On the simple branch this includes the exact lower two-vector Ritz data,
bounded Ritz ratio, and strict even complement

\[
 r_p>0,\qquad {q_p-v_p\over r_p}=O(1),\qquad
 P_{\kappa_p^\perp}(A_p-v_pI)P_{\kappa_p^\perp}\succ0.
 \tag{3.2}
\]

Here `v_p` denotes the lower Ritz value; it is deliberately not the vector
`u_p` in (0.3).  On the multiplicity-safe branch the required finite data
include

\[
 u_p=P_p\eta_p\ne0,\qquad a_p=\langle\kappa_p,u_p\rangle\ne0.
 \tag{3.3}
\]

One may impose extra finite conditions, but an unrestricted average cannot
be substituted for the average over the same good set.

Put

\[
 W_P=\sum_{p\in{\cal G}_P}|a_p|^2.                \tag{3.4}
\]

If `mathcal G_P` is nonempty, `W_P>0`, and (0.7) holds, nonnegativity gives
at least one `p in mathcal G_P` for which

\[
 \boxed{{\cal A}_p\leq {C(\log P)^B\over P}.}     \tag{3.5}
\]

Indeed, otherwise every summand
`|a_p|^2*mathcal A_p=Delta_p/k_p` would be strictly larger than its
corresponding weighted threshold.  This proves the weighted pigeonhole
step without dividing by the smallest visibility weight.

For every fixed `0<=zeta<1/2`, (3.5), `lambda_p` asymptotic to `P`, and
`L_p` asymptotic to `log P` give

\[
 L_p\lambda_p^{2\zeta}{\cal A}_p
 \ll (\log P)^{B+1}P^{2\zeta-1}\longrightarrow0. \tag{3.6}
\]

Thus every fixed logarithmic loss is harmless.  More generally the weaker
average factor `P^(-1+o(1))` is sufficient.  Neither (0.7) nor (3.5) proves
that `mathcal G_P` is nonempty or that `W_P>0`; those are separate actual
finite-source obligations.

## 4. Multiplicity-safe mixed-cofactor square

Return to one `p` and define

\[
 F_p(z)=\det(zI-A_p),\qquad
 C_p(z)=\operatorname {adj}(zI-A_p),
 \qquad m_p=\dim E_p.                              \tag{4.1}
\]

Set

\[
 J_p=C_p^{(m_p-1)}(\mu_p),\qquad
 d_p={m_p\over F_p^{(m_p)}(\mu_p)}.               \tag{4.2}
\]

The frozen derivative-cofactor theorem gives the exact projector

\[
 \boxed{P_p=d_pJ_p.}                              \tag{4.3}
\]

In particular,

\[
 \boxed{
 {\Delta_p\over k_p}
 =|d_p|^2\|P_{{\cal L}_p}J_p\eta_p\|^2,
 \qquad
 |a_p|^2
 =|d_p|^2|\langle\kappa_p,J_p\eta_p\rangle|^2.} \tag{4.4}
\]

If `(ell_(p,j))` is any orthonormal basis of `mathcal L_p`, then

\[
 \|P_{{\cal L}_p}J_p\eta_p\|^2
 =\sum_j|\langle\ell_{p,j},J_p\eta_p\rangle|^2.  \tag{4.5}
\]

Consequently (0.7) is precisely the high-high mixed-cofactor estimate

\[
 \boxed{
 \sum_{p\in{\cal G}_P}\omega_p
  \|P_{{\cal L}_p}J_p\eta_p\|^2
 \leq {C(\log P)^B\over P}
 \sum_{p\in{\cal G}_P}\omega_p
  |\langle\kappa_p,J_p\eta_p\rangle|^2,}
 \qquad \omega_p=|d_p|^2.                         \tag{4.6}
\]

This is the denominator-safe form.  The possibly small characteristic
derivative occurs as the same nonnegative weight on both sides.  One must
not bound `d_p` and `J_p` separately: near a clustered level those factors
can be individually large or small even though `P_p=d_pJ_p` is an
orthogonal projector.

When `m_p>=2`, the ordinary adjugate `C_p(mu_p)` vanishes.  Replacing
`J_p` by that zero matrix deletes the complete lowest projector.  The
moving derivative order in (4.2) is therefore mandatory.

## 5. Simple-branch complete-source inverse response

On the strict gate (3.2), interlacing makes the lowest even level simple.
Write `mu=mu_p`, `A=A_p`, `kappa=kappa_p`, and

\[
 {\cal K}=\kappa^\perp,\qquad
 q=\langle\kappa,A\kappa\rangle,
 \qquad b=P_{\cal K}A\kappa,
 \qquad B_\mu=P_{\cal K}(A-\mu I)P_{\cal K}.      \tag{5.1}
\]

Then `B_mu` is positive definite and the coefficient-normalized ground is

\[
 x=\kappa-B_\mu^{-1}b,
 \qquad \langle\kappa,x\rangle=1.                \tag{5.2}
\]

For the actual source normal form

\[
 A=c_*I+(A_{\rm tail})_+-(T_D)_+,                 \tag{5.3}
\]

the scalar part is killed by `P_K`, so

\[
 b=P_{\cal K}\{(A_{\rm tail})_+-(T_D)_+\}\kappa.
 \tag{5.4}
\]

Because `P_(mathcal L_p)kappa=0`, (2.6) becomes

\[
 \boxed{{\cal A}_p
 =\|P_{{\cal L}_p}B_{\mu_p}^{-1}b_p\|^2.}        \tag{5.5}
\]

Thus the simple form of the unproved arithmetic estimate is

\[
 \boxed{
 \sum_{p\in{\cal G}_P}|a_p|^2
  \|P_{{\cal L}_p}B_{\mu_p}^{-1}b_p\|^2
 \leq {C(\log P)^B\over P}
       \sum_{p\in{\cal G}_P}|a_p|^2.}             \tag{5.6}
\]

Let

\[
 \beta_p=\lambda_{\min}(B_{\mu_p}),
 \qquad r_p=\|b_p\|.                              \tag{5.7}
\]

A stronger, cancellation-losing sufficient condition is

\[
 \sum_{p\in{\cal G}_P}|a_p|^2{r_p^2\over\beta_p^2}
 \leq {C(\log P)^B\over P}
       \sum_{p\in{\cal G}_P}|a_p|^2,             \tag{5.8}
\]

because

\[
 {\cal A}_p\leq\|B_{\mu_p}^{-1}b_p\|^2
 \leq {r_p^2\over\beta_p^2}.                    \tag{5.9}
\]

Qualitative positivity gives only `beta_p>0`; it gives no dyadic control of
`r_p/beta_p`.  More importantly, (5.6) uses the common complete-source
inverse after the signed subtraction in (5.4).  Inverting or estimating the
tail and discrepancy blocks separately is not (5.6).

## 6. Rank-one lowering and contour forms stop at the same estimate

The canonical boundary selector can be recovered without choosing a basis
of a multiple lowest space.  For `epsilon>0`, put

\[
 A_{p,\epsilon}=A_p-\epsilon|\eta_p\rangle
                              \langle\eta_p|.      \tag{6.1}
\]

Inside `E_p`, the first perturbation is

\[
 -\epsilon|u_p\rangle\langle u_p|.               \tag{6.2}
\]

If `u_p!=0`, it creates one level below `mu_p`, and its unit eigenvector
tends to `u_p/||u_p||`.  For its lowest eigenvalue `mu_p(epsilon)`,

\[
 -\partial_{\epsilon+}\mu_p(0)=\|u_p\|^2.        \tag{6.3}
\]

If a second perturbation `tR` is inserted, with either
`R=P_(mathcal L_p)` or `R=|kappa_p><kappa_p|`, the
Hellmann--Feynman limit is

\[
 \lim_{\epsilon\downarrow0}\partial_t
 \mu_{p,\epsilon,R}(0)
 ={\langle u_p,Ru_p\rangle\over\|u_p\|^2}.       \tag{6.4}
\]

Equations (6.3)--(6.4) reconstruct the two sides of (0.7), but only as
products of response derivatives.  Concavity of a lowest eigenvalue in
one affine parameter supplies no sign for the required product comparison
in two different directions.  Rank-one lowering handles multiplicity; it
does not prove the orientation estimate.

There is also a multiplicity-safe contour form.  If `Gamma_p` encloses the
complete level `mu_p` and no other spectral point, then

\[
 P_p={1\over2\pi i}\oint_{\Gamma_p}(zI-A_p)^{-1}\,dz. \tag{6.5}
\]

Consequently,

\[
 {\Delta_p\over k_p}
 =\left\|{1\over2\pi i}\oint_{\Gamma_p}
 P_{{\cal L}_p}(zI-A_p)^{-1}\eta_p\,dz\right\|^2,
 \tag{6.6}
\]

and

\[
 a_p={1\over2\pi i}\oint_{\Gamma_p}
 \langle\kappa_p,(zI-A_p)^{-1}\eta_p\rangle\,dz. \tag{6.7}
\]

An absolute resolvent estimate costs inverse powers of the distance from
`Gamma_p` to the rest of the spectrum.  The frozen finite gate is strict
but qualitative, so it supplies no uniform contour distance.  Choosing a
shrinking contour merely repackages the characteristic-derivative weights
in (4.6).

## 7. Why a standard prime large sieve does not prove the target

Before any ground or projector is formed, the actual even source is

\[
 A_p=A_p^{\rm pole}-A_p^{\rm arch}
 -\sum_{1<n\leq\lambda_p^2}{\Lambda(n)\over\sqrt n}
       K_{p,n,+},                                  \tag{7.1}
\]

with the inclusive prime-power endpoint and the source minus sign.  Every
entry is therefore an explicit linear statistic of the prime inventory.
That fact is not enough for (4.6).

The dimension is

\[
 \dim A_p=N_p+1\asymp P.                          \tag{7.2}
\]

A cofactor before differentiation is a determinant of size `N_p`, hence
has degree `N_p` in `z` and the entries together.  On the simple branch,
and more generally at bounded multiplicity, its surviving entry degree can
grow on the order of `P`; for arbitrary multiplicity the derivative order
itself moves with `p`.  It is then evaluated at the adaptive bottom root
`mu_p`.  The numerator in (4.6) is a square of two such adaptive cofactor
contractions.  Its direct expansion can contain correlations of growing
order, not a fixed quadratic prime sum.

A classical scalar or matrix large sieve controls expressions with
coefficients fixed before the prime sum.  Here `J_p`, `mu_p`, the
multiplicity `m_p`, the contour, and the good-set membership are all
functions of the same complete source.  Passing through a resolvent does
not remove that adaptivity; differentiating a spectral projector introduces
the reduced resolvent and hence the same unproved spectral denominator.

Therefore an argument advertised as a prime-large-sieve proof must supply,
in addition to the usual entrywise estimate, the actual adaptive
high-high bound (4.6), or equivalently (5.6), and must prove

\[
 {\cal G}_P\ne\varnothing,
 \qquad
 \sum_{p\in{\cal G}_P}|a_p|^2>0                  \tag{7.3}
\]

on cofinally many dyadic blocks.  Existing large-sieve input proves none
of these three statements.  This is a nonimplication, not a theorem that
the desired actual arithmetic estimate is false.

## 8. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. states (0.7), (4.6), or (5.6) as proved;
2. replaces the gate-restricted sum by an unrestricted average;
3. infers `mathcal G_P!=empty` or positive total visibility from a vacuous
   inequality with two zero sides;
4. divides termwise by `a_p`, `d_p`, or a smallest visibility weight before
   the weighted selection;
5. uses the ordinary adjugate at a multiple lowest root;
6. infers a quantitative spectral gap from a strict even complement;
7. splits the complete signed source before applying the common inverse;
8. claims that an entrywise quadratic prime large sieve controls the
   adaptive cofactor square;
9. identifies a conditional positive zero Gram with the unconditional
   complete source; or
10. claims a finite-gate theorem, determinant convergence, an unconditional
    zeta-zero result, RH, a converse, or a de Bruijn--Newman bound.

The exact new input is the gate-restricted high-high estimate (4.6), with
any fixed logarithmic loss, together with the two nonvacuity statements
(7.3).  None is supplied here.  The formal state remains `P0_INVALIDATED`.
