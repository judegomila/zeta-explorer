# Opposite-boundary twisted-Weyl source-quotient barrier

## 0. Exact outcome and claim boundary

Let `Phi` be a real inversion-even, source-boundary-normalized simple ground
on modes `-N,...,N`, and put

\[
 e=\eta_{\rm alt}=e^{i\pi D}\eta,
 \qquad e_n=(-1)^n,
 \qquad
 g(s)=\langle e,(D-sI)^{-1}\Phi\rangle
     =\sum_{n=-N}^{N}{(-1)^n\xi_n\over n-s}.       \tag{0.1}
\]

If all twisted weights `w_n=(-1)^n xi_n` are nonnegative, then `g` is a
Pick--Herglotz rational function and has the usual auxiliary diagonal-Weyl,
interlacing, and Hermite--Biehler realizations.  This is a genuine positive
statement, but it does not create a source-compatible self-adjoint quotient.

Indeed, if `a=<e,Phi>` is nonzero, the natural alternate rank-one quotient

\[
 D'_e=D-|D\Phi\rangle\langle e|/a                 \tag{0.2}
\]

has the exact characteristic identity

\[
 \det(D'_e-sI)=-{s\over a}\det(D-sI)g(s),         \tag{0.3}
\]

but it is not self-adjoint in the source quotient metric.  For
`T=Q-mu I`, source boundary normalization gives `TD Phi=-beta`, and

\[
 \boxed{
 TD'_e-D_e'^*T
 =|\beta\rangle\langle e/a-\eta|
  -|e/a-\eta\rangle\langle\beta|.}               \tag{0.4}
\]

The vector `beta` is odd while `e/a-eta` is nonzero even.  Thus (0.4)
cannot vanish on the nontrivial source branch `beta!=0`.  Replacing the
source boundary by `e` directly forces the source row to be zero, while a
unitary diagonal gauge twists both the boundary and the ground and recovers
the original secular function rather than `g`.

There is also a normalization obstruction.  In the pinned centered modes,
`eta` is endpoint evaluation, whereas `e` is midpoint evaluation.  The
source theorem protects the first and not the second.  An exact `N=2`
source-Cauchy matrix satisfies both strict shifted-sector signs with uniform
positive gaps but has `<e,Phi>=0`, so (0.2) is not even defined.

Checkpoint 1.28 proves only eventual positivity of each fixed twisted
prefix under the still-unproved target convergence.  It does not prove the
global cone for every retained mode, whose depth grows with `lambda`.
Even after adding that global cone, scalar or matrix-valued Weyl positivity
gives only Cauchy--Schwarz and a bound involving the free total twisted mass
and the independent ground--anchor overlap `p_mu`.  It does not control the
cancellation-preserving physical factor `K_L mathcal A_mu/p_mu`.

The fixtures below are structural source-Cauchy matrices, not actual
prime-power matrices.  This note proves no failure of the actual global
twisted cone, actual strict signs, actual ground convergence, actual
mixed-cofactor control, response decay or nondecay, determinant convergence,
zero statement, Riemann hypothesis, converse from RH, or de Bruijn--Newman
`Lambda` bound.  The formal state remains `P0_INVALIDATED`, and the standard
eight are unchanged.

## 1. Frozen inputs

Only the following repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md` | `d72a5e1e11e096abc25319c1bf2c2af474d11cd766b25cf83f0b6cd00d3956f0` |
| `tests/test_source_boundary.py` | `a4be31e74a735c8f9150ed84cc4dc8c147e654364b65ec5cb3b814500e7ff808` |
| `notes/SOURCE_QUOTIENT_PICK_HERGLOTZ_INTERLACING_BARRIER.md` | `9701ed565588923557dc057ab2cfc072aa253b94ca22bdf61a958ae8caea6f13` |
| `tests/test_source_quotient_pick_herglotz_interlacing_barrier.py` | `86198254841dcdfe54de97cb3652c66f9c301c8cd92c6b55728a7e4dec044658` |
| `notes/CAPTURE_FREE_ACTUAL_GROUND_PARITY_RESPONSE_BARRIER.md` | `ec53e8c99f639bdae46a8da6d55c4e34b8381b3348f62833cd2ac1d1bb8dbbf3` |
| `tests/test_capture_free_actual_ground_parity_response_barrier.py` | `477c7849bf319a62c6d483874d29c638250060ee0e9db844ae1477455f380772` |
| `notes/ACTUAL_GROUND_FIXED_MODE_RESIDUE_SIGN_BARRIER.md` | `3a64146e1f3836b9dd07ae55a1955e7d66cd35ad72f58d4ce116c18b16cddcce` |
| `tests/test_actual_ground_fixed_mode_residue_sign_barrier.py` | `5ea8d73b2641f6fe31e494bcd4ab0e524940bc7575d6c5b8a784e7e415201216` |
| `notes/NORMALIZED_SOURCE_QUOTIENT_RESPONSE_BARRIER.md` | `a21be420fa1696cceffdaf653e083e848addd9ca13b3ad0b0f930476916271f2` |
| `tests/test_normalized_source_quotient_response_barrier.py` | `8bafeff220c3193e9dcd5b511db011e3df565fe1b773878f88f435be687f7026` |

The first three pairs fix the source displacement, source quotient, and
capture-free normalized profile.  The checkpoint-1.28 pair fixes the exact
moving-lattice sampling theorem and its fixed-prefix quantifier.  The final
pair fixes the strict-sign normalized-response counterfamily and the
favorable positive-function family.  No external source, numerical
artifact, zero table, RH premise, or stored arithmetic ground is added.

## 2. The twisted boundary is midpoint evaluation

Use the pinned centered modes

\[
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},
 \qquad -L/2\leq t\leq L/2.                     \tag{2.1}
\]

For `f=sum c_n V_n`, one has

\[
 {1\over\sqrt L}\langle\eta,f\rangle
 =f(-L/2)=f(L/2),
 \qquad
 {1\over\sqrt L}\langle e,f\rangle=f(0).       \tag{2.2}
\]

Thus `e` is not the opposite periodic endpoint; both periodic endpoints
give `eta`.  It is the midpoint Riesz vector.  In particular,

\[
 a=\langle e,\Phi\rangle=\sqrt L\,\Phi(0).       \tag{2.3}
\]

The source boundary theorem proves `<eta,Phi>!=0` from the commutator.  It
contains no corresponding assertion for (2.3).  The evaluation norm is

\[
 \|L^{-1/2}e\|=\sqrt{2N+1\over L},               \tag{2.4}
\]

which is an upper point-evaluation constant and supplies no ground-pairing
lower bound.

The checkpoint-1.28 sample identity reads

\[
 w_n=(-1)^n\xi_n
 ={1\over\sqrt L}\widehat\Phi(2\pi n/L).         \tag{2.5}
\]

Target convergence near zero therefore controls `w_n` for every fixed
`n`, one fixed prefix at a time.  It does not control the full sum
`a=sum w_n`, whose number of terms is `2N+1` on the locked growing interval.

## 3. Exact Herglotz classification and auxiliary realization

Because `Phi` is even, `g` is odd and

\[
 g(s)=-{\xi_0\over s}
      +2s\sum_{n=1}^{N}{(-1)^n\xi_n\over n^2-s^2}.  \tag{3.1}
\]

At a retained pole,

\[
 \operatorname {Res}_{s=n}g(s)=-w_n,             \tag{3.2}
\]

and the Pick kernel is

\[
 {g(z)-\overline{g(w)}\over z-\overline w}
 =\sum_{n=-N}^{N}{w_n\over(n-z)(n-\overline w)}. \tag{3.3}
\]

Consequently `g` is Herglotz if and only if every `w_n>=0`; for nonzero
weights its negative-square count is exactly the number of negative
weights.  The fixed-prefix conclusion of checkpoint 1.28 is therefore not a
Herglotz theorem for the full finite `g`.

Under the new global strict cone `w_n>0`, put `u_n=sqrt(w_n)`.  Then

\[
 g(s)=\langle u,(D-sI)^{-1}u\rangle.             \tag{3.4}
\]

This is an auxiliary diagonal-`D` Weyl function.  Its numerator zeros
strictly interlace the integer poles, and the associated polynomial pair is
Hermite--Biehler with a positive de Branges kernel.  The metric and cyclic
vector in (3.4) depend on the unknown ground weights; they are not the
source quotient metric or source boundary.

There is always a matrix-valued positive statement.  With the two columns
`U=(e,Phi)`,

\[
 M(s)=U^*(D-sI)^{-1}U                              \tag{3.5}
\]

is a `2 by 2` matrix Herglotz function and its off-diagonal entry is `g`.
At the pole `n`, its measure atom is

\[
 \begin{pmatrix}1&w_n\\w_n&\xi_n^2\end{pmatrix}
 =\binom{e_n}{\xi_n}\begin{pmatrix}e_n&\xi_n\end{pmatrix}
 \succeq0.                                        \tag{3.6}
\]

This positivity is automatic even when the scalar residues are mixed.  Its
off-diagonal consequence is exactly Cauchy--Schwarz, not a sign or a lower
frame bound.

## 4. Alternate characteristic identity and metric defect

Assume `a=<e,Phi>!=0` and define (0.2).  Since

\[
 \langle e,(D-sI)^{-1}D\Phi\rangle=a+sg(s),      \tag{4.1}
\]

the matrix determinant lemma gives (0.3).  Away from the retained lattice
and from zero, the characteristic roots are precisely the zeros of `g`.
At a nonzero lattice node `j`, the conclusion depends on
`w_j=(-1)^j xi_j`.  If `w_j!=0`, the pole of `g` cancels the simple zero of
`det(D-sI)`, so `j` is not a characteristic root.  If `w_j=0`, then `g` is
regular at `j` and the uncancelled determinant zero makes `j` a
characteristic root whether or not `g(j)=0`.  Consequently, under the global
strict cone `w_j>0` for every retained mode, the nonzero characteristic
roots are precisely the zeros of `g`; without that cone one must add the
zero-weight lattice modes.

The cancellation distinction occurs inside the source-Cauchy class.  On
the ordered modes `(-2,-1,0,1,2)`, take

\[
 b=(4,17,0,-17,-4),
 \qquad
 Q=\begin{pmatrix}
 10&13&-2&-7&-2\\
 13&68&-17&-17&-7\\
 -2&-17&34/3&-17&-2\\
 -7&-17&-17&68&13\\
 -2&-7&-2&13&10
 \end{pmatrix}.                                  \tag{4.1a}
\]

Then `Q_nm=(b_n-b_m)/(n-m)` off the diagonal and

\[
 \Phi=(0,1/5,3/5,1/5,0)^T,
 \quad Q\Phi=0,
 \quad \langle\eta,\Phi\rangle=1,
 \quad a=\langle e,\Phi\rangle=1/5.             \tag{4.1b}
\]

Every principal minor of `Q` is nonnegative, while the principal minor on
the modes `(-2,-1,1,2)` is `230640`.  Hence `Q` is positive semidefinite of
rank four and has the displayed simple ground.  But `w_2=0`, and direct
evaluation gives

\[
 g(2)=-{1\over30}\ne0,
 \qquad \det(D'_e-2I)=0.                         \tag{4.1c}
\]

Thus the unqualified zero-set statement fails even for a positive
source-Cauchy matrix with simple boundary-normalized ground.

This algebraic identity is not a self-adjoint quotient theorem.  The source
relations are

\[
 [D,T]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|,
 \qquad T\Phi=0,
 \qquad T D\Phi=-\beta.                         \tag{4.2}
\]

Substitution of (0.2) into `TD'_e-D_e'^*T` proves (0.4).  The defect vector
`e/a-eta` is inversion even and nonzero for `N>=1`, whereas `beta` is odd.
Their rank-two wedge cannot vanish unless `beta=0`.  Therefore the source
metric gives no real-root or interlacing theorem for (0.3).

Keeping `Q` fixed and demanding a displacement with the new boundary fails
even earlier.  If

\[
 [D,Q]=|\gamma\rangle\langle e|
       -|e\rangle\langle\gamma|,                 \tag{4.3}
\]

then the central row gives `gamma_n=b_n+e_n gamma_0`, while every
off-diagonal entry requires

\[
 b_n-b_m=e_m b_n-e_n b_m.                       \tag{4.4}
\]

Taking opposite odd nodes in (4.4) kills every odd `b_n`; taking one even
and one odd node then kills every even `b_n`.  Thus `b=0`.  A nontrivial
source matrix cannot simply replace `eta` by `e`.

Finally, diagonal conjugation does not help.  For
`S=e^{i pi D}`, the conjugated data are `SQS`, `S beta`, `S eta=e`, and
ground `S Phi`.  Since `S` commutes with `D`,

\[
 \langle e,(D-sI)^{-1}S\Phi\rangle
 =\langle\eta,(D-sI)^{-1}\Phi\rangle=h(s).       \tag{4.5}
\]

The two twists cancel.  Equation (4.5) recovers the original source
quotient, not `g`.

## 5. Exact strict-sign annihilation and complex-root fixtures

Order the modes as `(-2,-1,0,1,2)` and take

\[
 b=(-2,1,0,-1,2),
 \qquad
 Q=\begin{pmatrix}
 19/3&3&1&1/3&1\\
 3&25/3&-1&-1&1/3\\
 1&-1&1&-1&1\\
 1/3&-1&-1&25/3&3\\
 1&1/3&1&3&19/3
 \end{pmatrix}.                                  \tag{5.1}
\]

This is source-Cauchy and kills

\[
 \Phi=(-1/4,1/4,1,1/4,-1/4)^T,
 \quad \langle\eta,\Phi\rangle=1,
 \quad \boxed{\langle e,\Phi\rangle=0.}         \tag{5.2}
\]

In normalized parity bases,

\[
 \operatorname {spec}Q_+=\{0,5,32/3\},
 \quad
 \operatorname {spec}Q_-=\operatorname {spec}B_0=\{4,32/3\}, \tag{5.3}
\]

and the genuine anchor/coupling Ritz plane is

\[
 \begin{pmatrix}1&2\\2&4\end{pmatrix},
 \qquad \operatorname {spec}=\{0,5\}.           \tag{5.4}
\]

Thus `mu=u=0` and both checkpoint strict signs hold.  Scaling `Q` by
`1/4` makes the least relevant positive gap exactly one without changing
the ground or (5.2).

With

\[
 q(s)=\prod_{j=-2}^{2}(s-j)=s(s^2-1)(s^2-4),
 \qquad B(s)=\det(D-sI)=-q(s),                  \tag{5.5}
\]

one has

\[
 q(s)g(s)={5\over2}s^2-4,
 \qquad B(s)g(s)=4-{5\over2}s^2.                \tag{5.6}
\]

The degree drops because the alternate boundary pairing vanishes, so the
normalized quotient (0.2) is undefined.

Even nonvanishing does not restore source self-adjointness.  For the
favorable `N=2` family

\[
 T_2=I-|\eta\rangle\langle\eta|/5,
 \qquad \Phi=\eta/5,
 \qquad a=\langle e,\Phi\rangle=1/5,             \tag{5.7}
\]

both strict signs hold, but

\[
 {B(s)g(s)\over a}=s^4+s^2+4.                   \tag{5.8}
\]

The polynomial in (5.8) is positive on the real axis and has no real zero.
Thus the nonzero spectrum of `D'_e` consists of two nonreal conjugate pairs,
exactly as permitted by the defect (0.4).

## 6. Global twisted cone and the original quotient polynomial

The global cone has a useful but different root geometry.  Let

\[
 q(s)=\prod_{j=-N}^{N}(s-j),
 \qquad h(s)=\sum_{j=-N}^{N}{\xi_j\over j-s},
 \qquad P(s)=q(s)h(s).                           \tag{6.1}
\]

At a lattice node,

\[
 {P(j)\over q'(j)}=-\xi_j,
 \qquad \operatorname {sgn}q'(j)=(-1)^{N-j}.    \tag{6.2}
\]

If `xi_j=(-1)^j w_j` with every `w_j>0`, then

\[
 \boxed{\operatorname {sgn}P(j)=(-1)^{N+1}}
 \qquad(-N\leq j\leq N).                       \tag{6.3}
\]

Hence, when the source theorem separately makes `P` real-rooted and its
roots are simple, every interval between consecutive lattice nodes contains
an even number of roots, not one interlacing root.  Exterior roots are also
allowed.  Constant lattice signs provide no quantitative location or
separation bound.

The target-compatible `N=2` family shows the positive scope sharply.  Put

\[
 \Phi=(a,-a,1,-a,a)^T,
 \qquad b_1=b>0,
 \qquad b_2=-2b,                                 \tag{6.4}
\]

with inversion-odd source row and diagonals

\[
 a_0=4ab,
 \qquad a_1={b\over a}-{13b\over3},
 \qquad a_2={b\over a}-{7b\over3}.              \tag{6.5}
\]

It has the global strict twisted cone.  Its anchor-complement eigenvalues
are `b/a` and `b(1/a-20/3)`, and its odd determinant is

\[
 {b^2\over a}\left({1\over a}-{20\over3}\right). \tag{6.6}
\]

Both strict signs hold exactly when `0<a<3/20`.  In that range

\[
 \mathcal A_0(r)
 =1+{6ar^2\over(1-r^2)(4-r^2)},
 \qquad \mathcal A_0(i)=1-{3a\over5}.            \tag{6.7}
\]

Thus the global cone can coexist with the strict signs and a benign finite
profile.  This finite comparison is not a growing-interval estimate.

## 7. Quantitative stopping line

Assume the global positive orientation and write `w_n=(-1)^n xi_n>0`.
The source normalization and alternate mass are

\[
 1=\sum_{n=-N}^{N}(-1)^nw_n,
 \qquad a=\sum_{n=-N}^{N}w_n.                   \tag{7.1}
\]

The first identity does not upper-bound the second.  On the imaginary axis,
for `t>0`,

\[
 |\mathcal A_\mu(it)|
 \leq -it\,g(it)
 =w_0+2t^2\sum_{n=1}^{N}{w_n\over n^2+t^2}
 \leq a.                                         \tag{7.2}
\]

This is the strongest immediate scalar positivity bound, and it stops at

\[
 \left|{\mathcal A_\mu(it)\over p_\mu}\right|
 \leq {a\over|p_\mu|},
 \qquad p_\mu=\langle\kappa,\Phi\rangle.       \tag{7.3}
\]

The actual anchor `kappa` is independent of the midpoint functional.  No
source identity bounds `a/|p_mu|`, and Cauchy--Schwarz supplies only upper
bounds for the separate pairings.  Moreover, transport to a physical strip
still multiplies the complete ratio by `K_L`; checkpoint 1.29 gives an exact
strict-sign positive-function family in which that continuation has
cardinal size `sqrt(L)` and exponential imaginary-axis growth.

Accordingly, a successful positive route needs two genuinely new global
inputs: a full retained-mode twisted cone with quantitative mass control,
and an anchor-frame lower bound strong enough to control `a/|p_mu|` while
preserving the `K_L` cancellation.  Neither follows from fixed-prefix target
alternation, the two strict signs, scalar or matrix Herglotz positivity,
interlacing, or de Branges theory alone.

## 8. Reproduction and self-audit

Run

    python3 -B -m unittest \
      tests.test_opposite_boundary_twisted_weyl_source_quotient_barrier -v

The test module checks all frozen hashes, the midpoint and residue formulas,
the alternate determinant and metric-defect identities, the displacement
and gauge obstruction, both exact strict-sign fixtures, the global-cone
root signs and target-compatible comparison, the Cauchy--Schwarz stopping
line, displayed TeX, ASCII/raw-byte hygiene, Python AST parsing, and the
fail-closed claim boundary.  It writes no cache artifact.
