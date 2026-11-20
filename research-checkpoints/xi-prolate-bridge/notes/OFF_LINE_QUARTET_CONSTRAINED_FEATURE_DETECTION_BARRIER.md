# Off-line quartet interpolation and the dangerous-feature angle barrier

## 0. Exact result and claim boundary

Put

\[
 I_a=[-a,a],\qquad a=\log\lambda,qquad L=2a,
\]

When an anchor or dangerous space is invoked, use the locked diagonal

\[
 \lambda={p\over2},\quad p\geq5\ {\rm odd},\qquad
 N=N_{\rm lock}(\lambda)=2^{2400p^2}=2^{9600\lambda^2}.
\]

Suppose, only for the feature calculation, that

\[
 z=\beta+i\gamma,qquad 0<\beta<{1\over2},\qquad\gamma\ne0              \tag{0.1}
\]

is one member of an off-line centered-zero quartet.  For a real compact
state define

\[
 A_f(w)=\int_{-a}^af(x)e^{-wx}\,dx,qquad
 C_z^+f=A_f(z)+A_f(\overline z),\qquad
 C_z^-f={A_f(z)-A_f(\overline z)\over i}.             \tag{0.2}
\]

This note proves five narrow statements.

1.  On either physical inversion parity, the two real channels in (0.2)
    have an explicit positive `2 by 2` Gram.  Its smallest eigenvalue is

    \[
     {e^{2\beta a}\over2}
       \left({1\over\beta}-{1\over\sqrt{\beta^2+\gamma^2}}\right)
       +O_z(a).                                       \tag{0.3}
    \]

    Thus ambient finite-interval interpolation of one fixed quartet costs
    `O_z(lambda^(-beta))` in physical `L2` norm.  The same scale survives
    centered Fourier projection whenever `N/a -> infinity`.

2.  On the locked exponential projection schedule, exact removal of the
    even projected source anchor does not change (0.3); the odd sector has
    no such anchor constraint.  The anchor's two channel values tend to
    zero, while (0.3) grows like `lambda^(2 beta)`.
    The full-source coframe therefore gives a finite, generally
    non-effective mixed prolate prefix realizing these ambient channel
    vectors with source-`L2` cost `O_z(lambda^(2-beta))`.

3.  These statements do not pass to the multiplier-dangerous harmonic
    range.  The exact missing object is the `2 by 2` metric Gram in (4.4)
    below.  None of the frozen source coframes, far floors, rank bounds, or
    signed Feshbach equivalences gives it a positive smallest eigenvalue.
    In particular, the prescribed full exterior metric and the actual
    dangerous projector cannot currently be imposed together with a
    quantitative quartet interpolation bound.

4.  Exact annihilation of every other centered-zero orbit is not supplied
    by the two-channel interpolation.  Multiplicity-aware compact
    Paley--Wiener cardinal interpolation is impossible.  The other zero
    features can mask the negative channel on a finite feature compression.
    Section 6 gives an exact positive finite-feature masking compression
    even when the quartet analysis has rank two.

5.  The frozen paired `U_Z` implication remains one-way.  Under RH, the
    converse would require the restricted critical-line sampling floors in
    (7.2), not merely quartet transversality or source surjectivity.  No such
    floor is frozen.

This is a feature-geometry theorem and barrier.  It assumes no actual
off-line zero, proves neither an off-line zero nor RH, and gives no sign for
the actual dangerous compression.  It does not certify a finite numerical
instance, a determinant limit, or equation (5.2) of `DIRECT_RH_ATTACK.md`.
The formal state remains `P0_INVALIDATED`, and the standard eight are
unchanged.

## 1. Frozen inputs

The deductions use the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_SIGNED_DISCREPANCY_CENTERED_ZERO_KREIN_FACTORIZATION_BARRIER.md` | `0257bb5582700fada40fc2a6c6ba578a09fad94e11eb4fa0f72a525c80bd04c9` |
| `notes/CENTERED_ZERO_PALEY_WIENER_INTERPOLATION_OBSTRUCTION.md` | `b23720bd4c05afbda4aa3f50176ff0580bacda0668264fd4fcc075b7c43d5ae2` |
| `notes/CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md` | `c9b4513fb0afa57a396f3c1bf7326bb94969d4c8d51a245ea66fa64c1889061e` |
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |
| `notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md` | `caaa4df57d43f74ef56fed6df907da6db0daa7b0f89da23cce30bc2ac9369acd` |
| `notes/LOCKED_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md` | `5cc71bf159432e4b651ecad4db2b1702a5288e647ce4025fcf1fb3378bd36d2c` |
| `notes/ODD_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md` | `85efc9bcb2228f0007af10943c693276b8a819fe9198bd76176d4a329574657a` |
| `notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md` | `78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3` |
| `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` | `3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f` |
| `notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` | `3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf` |

The centered-zero factorization fixes the Krein orientation and parity
signs.  The Paley--Wiener note fixes the distinction between finite
interpolation and complete-zero cardinal interpolation.  The boundary note
supplies the uniform approximate divisor for the projected anchor.  The
source coframe notes fix what is and is not known about source realization
and full exterior cost.  The two dangerous reductions fix the exact
harmonic ranges and metrics in Section 4.

## 2. Exact two-channel interval Gram

Let `H_+` and `H_-` be the real inversion-even and inversion-odd subspaces
of `L2(I_a)`.  On `H_+`, the Riesz representers of (0.2) are

\[
 r_{+}^+(x)=2\cosh(\beta x)\cos(\gamma x),\qquad
 r_{-}^+(x)=2\sinh(\beta x)\sin(\gamma x).           \tag{2.1}
\]

On `H_-`, both channels acquire one harmless common minus sign, and their
Riesz representers up to that sign are

\[
 r_{+}^-(x)=2\sinh(\beta x)\cos(\gamma x),\qquad
 r_{-}^-(x)=2\cosh(\beta x)\sin(\gamma x).           \tag{2.2}
\]

These formulas distinguish physical inversion parity from the parity of
the original Hermite source labels.  Put

\[
 G_\epsilon(a)=
  (\langle r_j^\epsilon,r_k^\epsilon\rangle)_{j,k\in\{+,-\}}.
                                                               \tag{2.3}
\]

The two analytic representers in each row of (2.1)--(2.2) are linearly
independent because `beta*gamma != 0`; hence `G_epsilon(a)>0` for every
`a>0`.

There is also a quantitative bound with no hidden spectral assertion.
For `x>0`, in either parity write

\[
 \binom{r_+^\epsilon(x)}{r_-^\epsilon(x)}
 =e^{\beta x}v(x)+e^{-\beta x}w_\epsilon(x),qquad
 v(x)=\binom{\cos(\gamma x)}{\sin(\gamma x)},
 \quad\|w_\epsilon(x)\|=1.                           \tag{2.4}
\]

The sign pattern inside `w_epsilon` differs between parities but its norm
does not.  If `theta=gamma*a`, define

\[
 M_\theta=\int_0^\infty e^{-2\beta s}
 \binom{\cos(\theta-\gamma s)}{\sin(\theta-\gamma s)}
 \binom{\cos(\theta-\gamma s)}{\sin(\theta-\gamma s)}^Tds.
                                                               \tag{2.5}
\]

Direct integration gives phase-independent eigenvalues

\[
 \lambda_\pm(M_\theta)
 ={1\over4\beta}\mathbin\pm
       {1\over4\sqrt{\beta^2+\gamma^2}}.             \tag{2.6}
\]

The two endpoint halves contribute equally.  The cross terms in (2.4)
have operator norm at most `2+e^(-2 beta x)`, and truncating (2.5) costs at
most `1/beta`.  Therefore

\[
 \boxed{
 \lambda_{\min}G_\epsilon(a)
 \geq {e^{2\beta a}\over2}
   \left({1\over\beta}-{1\over\sqrt{\beta^2+\gamma^2}}\right)
       -4a-{2\over\beta}.}                            \tag{2.7}
\]

This proves (0.3).  If `C_(z,epsilon):H_epsilon -> R^2` denotes the two
channel map, its minimum-norm right inverse is

\[
 J_{z,\epsilon}=C_{z,\epsilon}^*G_\epsilon(a)^{-1},qquad
 \|J_{z,\epsilon}\|=\lambda_{\min}(G_\epsilon(a))^{-1/2}
       =O_z(\lambda^{-\beta}).                        \tag{2.8}
\]

Thus an off-line quartet is not hidden from the ambient parity space.
More explicitly, with coordinates ordered as `(C_z^+,C_z^-)`, the physical
negative-channel isolators are

\[
 f_{z,+}^{\rm neg}=J_{z,+}\binom01,
 \qquad
 f_{z,-}^{\rm neg}=J_{z,-}\binom10.                  \tag{2.9}
\]

The first kills `C_z^+` and sets `C_z^-=1` in even physical parity; the
second sets `C_z^+=1` and kills `C_z^-` in odd physical parity.  Both have
physical `L2` norm `O_z(lambda^(-beta))`.  These parity subscripts describe
physical inversion parity, not Hermite source residues.

## 3. Centered Fourier projection and anchor removal

Let `P_(a,N)` be the centered log-Fourier projection and restrict it to
one physical parity.  Put

\[
 G_{\epsilon,N}=C_{z,\epsilon}P_{a,N}C_{z,\epsilon}^*.
                                                               \tag{3.1}
\]

The circular variation of every representer in (2.1)--(2.2), including
the possible endpoint jump, is at most

\[
 V_z e^{\beta a},\qquad
 V_z=4\left(2+{|\gamma|\over\beta}\right).           \tag{3.2}
\]

The periodic BV projection inequality therefore gives

\[
 \boxed{
 \|G_\epsilon(a)-G_{\epsilon,N}\|
 \leq {2aV_z^2\over\pi^2N}e^{2\beta a}.}             \tag{3.3}
\]

Consequently, on every schedule with `N/a -> infinity`, and in particular
on the locked exponential schedule, one has

\[
 \lambda_{\min}G_{\epsilon,N}
 \geq {e^{2\beta a}\over4}
 \left({1\over\beta}-{1\over\sqrt{\beta^2+\gamma^2}}\right)
                                                               \tag{3.4}
\]

eventually.  No zero-location hypothesis other than the fixed parameters
in (0.1) enters this Fourier approximation.

In the even sector let `kappa_(lambda,N)` be the unit projected source
anchor and let

\[
 b_z=C_{z,+}\kappa_{\lambda,N}\in\mathbb R^2.         \tag{3.5}
\]

The exact channel Gram after anchor removal is

\[
 \boxed{G_{+,N}^{\kappa^\perp}=G_{+,N}-b_zb_z^T.}     \tag{3.6}
\]

The uniform approximate-divisor theorem and the projected-anchor norm
lower bound give `||b_z|| -> 0` on the locked exponential schedule.  Hence
(3.4) also holds, with another harmless factor `1/2`, on the physical
anchor complement.  This is a genuine two-channel interpolation theorem;
it does not merely show that one evaluation is nonzero.

Indeed, with `R_+=P_(kappa^perp)P_(a,N)` and `R_-=P_(a,N)`, the exact
restricted right inverses are

\[
 J_{z,\epsilon}^{R}
 =R_\epsilon C_{z,\epsilon}^*
   (C_{z,\epsilon}R_\epsilon C_{z,\epsilon}^*)^{-1}. \tag{3.7}
\]

Inserting the parity-dependent coordinate vectors from (2.9) gives exact
projected negative-channel isolators.  The even one lies in the anchor
complement, and both retain physical norm `O_z(lambda^(-beta))`.

The full-source coframe may now be applied to the two-dimensional physical
range of the right inverse.  It produces even, zero-integral sources with
source-`L2` right-inverse norm at most

\[
 \sqrt2\lambda M_\mu(\lambda)\leq2\sqrt2\lambda^2.   \tag{3.8}
\]

Combining (2.8), (3.4), and (3.8) gives source-`L2` cost
`O_z(lambda^(2-beta))` for unit quartet data.  Strong density of the mixed
all-even prolate prefix gives a finite prefix with norm at most
`4 lambda^2` in place of (3.8), but its terminal label is non-effective and
the prefix mixes the two source residue classes.

This does not prove the prescribed parity-separated full-exterior cost.
The moving-label theorem supplies such a defect-metric right inverse only
on its separate wide-prefix schedule and target.  No frozen theorem
combines that result with the actual multiplier-dangerous harmonic range.

## 4. The exact constrained metric Gram

All source, endpoint, anchor, and projector questions can be stated without
choosing coordinates.  Let

\[
 W:X\longrightarrow H_\epsilon,qquad D=D^*>0         \tag{4.1}
\]

Here `X` is already the quotient by the synthesis kernel, and `D` is the
positive full source metric in those quotient coordinates.  The invariant
two-channel Gram is

\[
 \boxed{
 \mathcal G_z(W,D)
 =C_{z,\epsilon}W D^\dagger W^*C_{z,\epsilon}^*.}     \tag{4.2}
\]

It is positive definite exactly when both quartet channels can be
interpolated through `W`.  The optimal metric right-inverse cost is
`lambda_min(mathcal G_z)^(-1/2)`.  An invertible endpoint shear

\[
 W\longmapsto WT,qquad D\longmapsto T^*DT            \tag{4.3}
\]

leaves (4.2) unchanged.  Thus the shear itself is not a loss.  Restriction
to an endpoint-null rest, an anchor complement, or another proper range is
a projection and requires a new lower angle.

For the actual multiplier-dangerous reduction, let `Y_epsilon` be the
retained space, let `E_(Q,epsilon):Y_epsilon -> H_epsilon` be the centered
harmonic lift, and put

\[
 M_\epsilon=E_{Q,\epsilon}^*\Delta_\epsilon^2
                         E_{Q,\epsilon}>0.
\]

The binding feature matrix is

\[
 \boxed{
 \mathcal G_{z,\epsilon}^{\rm dang}
 =C_{z,\epsilon}E_{Q,\epsilon}M_\epsilon^{-1}
       E_{Q,\epsilon}^*C_{z,\epsilon}^*.}            \tag{4.4}
\]

For even parity the negative quartet channel is `C_z^-`; for odd parity it
is `C_z^+`.  A vector in the dangerous harmonic range which kills the
positive channel but not the negative one exists exactly when the two rows
in (4.4) are independent, equivalently

\[
 \det\mathcal G_{z,\epsilon}^{\rm dang}>0.            \tag{4.5}
\]

A quantitative isolator of metric cost at most `K_z(lambda)` requires

\[
 \lambda_{\min}\mathcal G_{z,\epsilon}^{\rm dang}
       \geq K_z(\lambda)^{-2}.                        \tag{4.6}
\]

The ambient estimate (3.4) has `K_z=O_z(lambda^(-beta))`.  No frozen theorem
proves even the strict inequality (4.5) for the actual dangerous projector,
let alone an ambient-scale version of (4.6).  The dangerous rank theorem is
only an upper bound on `dim(Y_epsilon)`.  It permits the zero space in even
parity; in odd parity the explicit pole gives only one forced direction,
not two-channel feature rank.  The source coframes say that selected
physical targets have source preimages;
they do not say that the harmonic range contains either target.  The signed
coframe constants are equivalent to positivity of the complete shifted
matrix and therefore cannot be used as independent feature-angle input.

Equation (4.4) is the earliest missing matrix.

## 5. Why local interpolation is not global orbit isolation

The two-channel map concerns one quartet.  To turn its negative channel
into a negative value of the complete Weil form by orbitwise isolation, one
would also have to control

\[
 \sum_{\mathfrak p\ne[z],[\overline z]}
 2\epsilon\,
 \overline{A_f(\overline z_{\mathfrak p})}
             A_f(z_{\mathfrak p}).                   \tag{5.1}
\]

Exact vanishing of the multiplicity-aware jets at every other centered
zero is impossible for a nonzero finite-type Paley--Wiener function.  In
particular, no compact cardinal or Hermite interpolant can isolate one
orbit from the complete centered multiset.  Value-only repetition does not
turn into derivative data, so this theorem does not claim a stronger
value-only impossibility without a distinct-zero density input.

Thus (4.5) is necessary for an orbitwise dangerous-channel construction,
but it is not sufficient to dominate (5.1).  A second, genuinely global
remainder estimate would still be required.

## 6. An exact finite-feature masking compression

The masking issue is not just dimensional.  Fix a critical-axis centered
zero `i eta` distinct from the quartet frequency, and use the real functional
`A_f(i eta)` on the even parity and `A_f(i eta)/i` on the odd parity.  Its
Riesz representer is, up to sign,

\[
 s_{\eta,+}(x)=\cos(\eta x),\qquad
 s_{\eta,-}(x)=\sin(\eta x).                         \tag{6.1}
\]

Adjoin this row to the two rows in (2.1) or (2.2).  If `u_eta` is its
cross column against those two rows, then

\[
 \|s_{\eta,\epsilon}\|_2^2=a+O_\eta(1),\qquad
 \|u_\eta\|=O_{z,\eta}(e^{\beta a}),\qquad
 \|G_\epsilon(a)^{-1}u_\eta\|=O_{z,\eta}(e^{-\beta a}).
                                                               \tag{6.2}
\]

Consequently the scalar Schur complement of `G_epsilon(a)` in the
three-row Gram is `a+O_(z,eta)(1)`, and the complete three-row Gram has
smallest eigenvalue at least `c_(z,eta)*a` eventually.  On the locked
exponential schedule the absolute Fourier-tail error is `o(1)`: the two
off-line rows cost `O_z(a e^(2 beta a)/N)` and the critical row costs
`O_eta(a^3/N)`.  All three anchor evaluations tend to zero by the uniform
approximate-divisor theorem, because all three locations used here are
centered zeros.  Rank three therefore survives centered projection and,
in the even sector, projected-anchor removal for all sufficiently large
locked parameters.  The joint three-feature minimum-norm right inverse has
physical cost `O_(z,eta)(a^(-1/2))`; composing with the full-source inverse
gives source-`L2` cost `O_(z,eta)(lambda^2*a^(-1/2))` for fixed feature
data.

The same independence is available in endpoint-null tests.  Smooth compact
parity tests are dense in the parity space, and in the even sector their
intersection with the anchor hyperplane is dense in the anchor complement.
A dense linear
subspace has the same surjective image under a finite-rank map once the
three restricted rows are independent.  Thus one may choose endpoint-zero,
anchor-orthogonal finite-interval vectors with prescribed values of the
following three real functionals:

- the positive quartet channel;
- the negative quartet channel; and
- the critical-line channel in (6.1).

Let the off-line quartet have multiplicity `m` and the critical orbit have
multiplicity `n`.  Write `C_eta f=A_f(i eta)` in even parity and
`C_eta f=A_f(i eta)/i` in odd parity.  Choose two vectors `f_1,f_2` with
feature data

\[
 \begin{array}{c|ccc}
       &C_{\rm pos}&C_{\rm neg}&C_\eta\\ \hline
 f_1&1&0&0\\
 f_2&0&1&\sqrt{m/n}.
 \end{array}                                         \tag{6.3}
\]

In this coordinate basis the off-line quartet contributes

\[
 Q_{\rm quartet}=m\begin{pmatrix}1&0\\0&-1\end{pmatrix},
                                                               \tag{6.4}
\]

where `pos` and `neg` already include the parity-dependent swap.  The one
critical-line orbit contributes

\[
 Q_{i\eta}=2m\begin{pmatrix}0&0\\0&1\end{pmatrix}.  \tag{6.5}
\]

Therefore

\[
 \boxed{Q_{\rm quartet}+Q_{i\eta}=mI_2>0.}          \tag{6.6}
\]

The quartet analysis in (6.3) has full rank, yet this finite compression is
strictly positive.  The construction respects physical parity and may be
placed inside the endpoint-null space and, in even parity, the
anchor-constrained space just described.  The full-source theorem supplies
finite, non-effective mixed-prefix source preimages for these prescribed
feature data.  These are two realization statements, not a claim that one
prescribed parity-separated source inventory simultaneously obeys the
endpoint, full-exterior-metric, and dangerous-projector constraints; that
joint angle is exactly what (4.4) leaves open.

Equation (6.6) is not the actual zeta compression and does not
claim that the actual dangerous projector chooses this plane.  It proves
that finite rank, source surjectivity, endpoint congruence, and a positive
source metric do not by themselves prevent masking by the other zero
features.

## 7. Exact RH-strength boundary

The frozen widening-core implication already gives

\[
 \text{eventual paired }U_Z\text{ signs}\quad\Longrightarrow\quad RH. \tag{7.1}
\]

The converse is not frozen.  Let `Z_(lambda,+)` denote the multiplicity-
weighted value-sampling analysis on
`E_N^+ intersection kappa^perp`, and let `Z_(lambda,-)` denote the same
analysis on `E_N^-`.  If RH is assumed, every centered zero is on the
critical axis and the two parity forms are ordinary positive sampling
Grams.  In a normalization with one representative of each `+-` orbit, the
two finite signs are then exactly the quantitative frame conditions

\[
 \boxed{
 2\,\sigma_{\min}^2
   (Z_{\lambda,+}|_{\kappa^\perp})>U_Z,
 \qquad
 2\,\sigma_{\min}^2(Z_{\lambda,-})>U_Z.}             \tag{7.2}
\]

Repeated zeros repeat value rows with multiplicity.  They do not provide
derivative rows.  Paley--Wiener uniqueness with multiplicity therefore
does not imply either lower singular value in (7.2).  The projected anchor
in fact collapses the first unrestricted even sampling singular value to
at most the `U_Z` scale, which is why the explicit deflation is binding.
The strongest frozen normalization gives `U_Z=o(d_6)` on the locked
schedule, but supplies no lower bound for either restricted singular value
and no lower bound for (4.4); its smallness alone does not prove (7.2).

Accordingly, the exact extra converse hypothesis needed for equivalence is
that RH implies both inequalities in (7.2) for every sufficiently large
member of the locked schedule.  With that restricted critical-line frame
theorem adjoined, eventual paired `U_Z` positivity is equivalent to RH by
(7.1); without it, only the forward implication is frozen.  Quartet
transversality (4.5), ambient interpolation (3.4), and the existing source
coframes do not imply that theorem.
