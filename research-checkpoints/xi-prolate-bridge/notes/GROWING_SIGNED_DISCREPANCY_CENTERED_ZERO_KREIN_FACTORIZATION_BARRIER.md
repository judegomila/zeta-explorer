# Growing signed-discrepancy centered-zero Krein factorization barrier

## 0. Exact outcome and fail-closed boundary

Use the locked interval and schedule

\[
 I_L=[-L/2,L/2],\qquad L=2\log\lambda,\qquad
 N=2^{9600\lambda^2}.                                  \tag{0.1}
\]

After the boundary-alias profile and the complete parity-pole scalar have
been centered, the remaining physical kernel is

\[
 g_\lambda(t)=D_\lambda(t)-H_{\rm tail}(t)-{c_*\over2},
 \qquad 0<t\leq L.                                    \tag{0.2}
\]

This note gives an exact cancellation-preserving factorization of the
centered two-sided form.  Let

\[
 \Xi_c(s)=\xi(1/2+s),\qquad H(s)={\Xi_c'(s)\over\Xi_c(s)},
                                                               \tag{0.3}
\]

let `mathcal Z_c` be the centered nontrivial-zero multiset, and quotient it
by `z mapsto -z`.  For a zero-extended finite Fourier vector `f`, put

\[
 A_f(z)=\int_{I_L}f(x)e^{-zx}\,dx.                   \tag{0.4}
\]

If `epsilon=+1` on the inversion-even sector and `epsilon=-1` on the
inversion-odd sector, then the exact centered form is

\[
 \boxed{
 \mathcal Q_{L,\epsilon}(u,w)
 =2\epsilon\sum_{\mathfrak p}
   \overline{A_u(\overline z_{\mathfrak p})}
   A_w(z_{\mathfrak p}).}                            \tag{0.5}
\]

The series is absolutely convergent for the finite Fourier vectors used by
the source construction.  Formula (0.5) includes the pole, Archimedean,
prime, reflected, and boundary-alias terms exactly once.  It is not obtained
by estimating any of those pieces separately.

The orientation is binding.  If `z=i gamma` is on the centered critical
axis, its contribution to either parity is

\[
 2\overline{A_u(i\gamma)}A_w(i\gamma),                \tag{0.6}
\]

and is a positive square on the diagonal.  If an off-line quartet has
representatives `z=beta+i gamma` and `bar(z)`, its complete diagonal
contribution on parity `epsilon` is

\[
 \boxed{
 \epsilon\left(
 |A_f(z)+A_f(\overline z)|^2
 -|A_f(z)-A_f(\overline z)|^2\right).}               \tag{0.7}
\]

Multiplicity multiplies (0.7).  Thus functional-equation pairing produces
an exact Krein block of signature `(1,1)`, not a Hilbert square.  Odd parity
reverses the two channels; it does not remove the negative channel.

There is also no finite-interval endpoint reserve.  In the zero expansion,
integration by parts has endpoint factor

\[
 \left[-{2\sinh(zt)\over z}C_{u,w}(t)\right]_{0}^{L}=0
                                                               \tag{0.8}
\]

because `C_(u,w)(L)=0` and `sinh(0)=0`.  At the Feshbach centering value
`sigma=S`, with either `S=U_Z` or an admitted nonnegative lower Ritz shift,
the scalar `(sigma-S)<u,y>` also vanishes.  More sharply, the centered
harmonic lift is independent of `S`: it is the harmonic lift for the same
unshifted Weil operator `Q`.  Hence lowering the shift changes neither the
centered lift nor the Krein form tested at that value of `sigma`.

A positive-Hamiltonian canonical-system, de Branges, Pick, or Herglotz
factorization of the complete form on every compact test would therefore be
an RH-strength theorem, not an unconditional boundary lemma.  For the actual
restricted multiplier-dangerous problem the statement is exact at finite
parameter:

\[
 \beta_{\lambda,+}^{\rm mv}>0\Longleftrightarrow B_+\succ0,
 \qquad
 \beta_{\lambda,-}^{\rm mv}>0\Longleftrightarrow B_-\succ0.     \tag{0.9}
\]

Along the locked widening schedule, the paired `U_Z` signs imply the paired
`q`-shifted signs because `q<=U_Z`; the frozen core theorem then implies the
global Weil criterion and RH.  No density assumption on the union of the
dangerous spaces enters this implication.  At one fixed parameter, however,
a finite compression can mask a Krein negative channel, so (0.7) alone does
not disprove the desired source-specific sign.

The exact earliest unresolved statement remains the restricted signed
Feshbach inf--sup.  This note proves no sign, no coframe floor, no lower-Ritz
sector theorem, no zero statement, and no Riemann-hypothesis conclusion.  The
formal state remains `P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following exact repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_SIGNED_DISCREPANCY_FESHBACH_PASSIVITY_SCALE_BARRIER.md` | `c9ebf7b69860babc66c8c5a447104e93b2e55aa2410e442e8458728b54a16621` |
| `tests/test_growing_signed_discrepancy_feshbach_passivity_scale_barrier.py` | `1206cc61a85771e51c04055bb6ad02ed1bd53f1693e096529d79ebf6268317f8` |
| `notes/GROWING_TRANSITION_HADAMARD_PICK_CARRIER_RH_EQUIVALENCE_THEOREM.md` | `092d0adefb7bafea8d931a2741299d19feef2a45ccc3d243c3543765fdf5cff7` |
| `tests/test_growing_transition_hadamard_pick_carrier_rh_equivalence_theorem.py` | `d15fff20bc0aa62ad63903b6c17e64b11ecba3ab965f179c82086e261c398b43` |
| `notes/OUTER_OUTER_SPECTRAL_THEOREM_ERRATUM.md` | `fecb3647b1e632debd5d7ae3cff1cb5b8db0c29e858041e5037d5c496529f145` |
| `tests/test_outer_outer_spectral_theorem_erratum.py` | `59f71abdaca30440d3b2d177be0426ac9af4f5975beae2de3bcc335f6e4c5ca0` |
| `notes/LOCKED_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md` | `5cc71bf159432e4b651ecad4db2b1702a5288e647ce4025fcf1fb3378bd36d2c` |
| `notes/ODD_MULTIPLIER_DANGEROUS_EXTERIOR_COFRAME_REDUCTION.md` | `85efc9bcb2228f0007af10943c693276b8a819fe9198bd76176d4a329574657a` |
| `notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md` | `78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3` |
| `tests/test_q_shift_sector_weil_core_gate.py` | `714f9839b0514c779f1fc05d558dd9446654de360dd1f0cc70502cba75fa6bf2` |

The first pair fixes the exact centered numerator, both parity-pole
conventions, the `U_Z` and lower-Ritz shifts, and the scope of the dangerous
spaces.  The second pair fixes the Hadamard and Pick orientations.  The
erratum pair fixes the Hermitian paired-slot conjugation used in (3.8).  The
next two notes fix the exact even and odd harmonic Feshbach lifts and their
finite-parameter equivalences.  The last pair fixes the widening-core
implication to the Weil criterion.  No external zero table, zero simplicity,
or RH assumption is used.

## 2. The complete finite-interval multiplier

For zero extensions to the line, define

\[
 R_{u,w}(t)=\int_{\mathbb R}\overline{u(x)}w(x+t)\,dx,
 \qquad
 C_{u,w}(t)=R_{u,w}(t)+R_{u,w}(-t).                  \tag{2.1}
\]

The supports have diameter `L`, so

\[
 C_{u,w}(0)=2\langle u,w\rangle,
 \qquad C_{u,w}(L)=0.                                \tag{2.2}
\]

The complete centered form is

\[
 \mathcal Q_L(u,w)=\int_0^L g_\lambda(t)C_{u,w}'(t)\,dt.        \tag{2.3}
\]

Put

\[
 h_L(t)=\operatorname {sgn}(t)g_\lambda(|t|)
         \mathbf1_{\{|t|<L\}}.                     \tag{2.4}
\]

Since `g_lambda` is locally integrable at zero, (2.3) is exactly

\[
 \mathcal Q_L(u,w)=\int_{-L}^{L}h_L(t)R_{u,w}'(t)\,dt.           \tag{2.5}
\]

Use the Fourier convention

\[
 \widehat f(\tau)=\int_{\mathbb R}f(x)e^{-i\tau x}\,dx.        \tag{2.6}
\]

Then `hat(R)=overline(hat(u))*hat(w)` and Plancherel gives the exact
compressed multiplier

\[
 \boxed{
 \mathcal Q_L(u,w)={1\over2\pi}\int_{\mathbb R}
 M_L(\tau)\overline{\widehat u(\tau)}\widehat w(\tau)\,d\tau,
 \quad
 M_L(\tau)=-2\tau\int_0^Lg_\lambda(t)\sin(\tau t)\,dt.}        \tag{2.7}
\]

The multiplier `M_L` is real, even, and entire.  Equation (2.7) is the
finite-interval two-sided object.  Replacing it by the causal multiplier on
one vertical line loses one of its two orientations.

The endpoint bookkeeping can be made exact without separating the
logarithmic singularity at zero.  On every `[a,L]`, with `a>0`, the
right-continuous `g_lambda` has bounded variation.  Stieltjes integration by
parts gives

\[
\begin{aligned}
 M_L(\tau)={}&-2\tau\int_0^a g_\lambda(t)\sin(\tau t)\,dt
 +2g_\lambda(L)\cos(\tau L)-2g_\lambda(a)\cos(\tau a)\\
 &-2\int_{(a,L]}\cos(\tau t)\,dg_\lambda(t).
\end{aligned}                                         \tag{2.8}
\]

The first term tends to zero as `a` decreases to zero, but the last two
small-end terms need not have separate limits.  They must remain combined.
The term `cos(tau L)` is the exact endpoint alias: its inverse Fourier
transform is supported at translations `+-L`, whose compression to an
interval of length `L` is zero.  If `lambda^2` is a prime power, the inclusive
endpoint jump in the Stieltjes integral in (2.8) cancels its matching part of
`g_lambda(L) cos(tau L)`.  Dropping either term first changes the formula.

Thus (2.7)--(2.8) track both the singular small endpoint and the inclusive
large endpoint without splitting an `O(lambda)` prime part from an
Archimedean part.

## 3. Exact centered-zero feature factorization

The paired Hadamard expansion is locally normally convergent away from the
zeros:

\[
 H(s)=\sum_{\mathfrak p}
 \left({1\over s-z_{\mathfrak p}}
       +{1\over s+z_{\mathfrak p}}\right)
 =\sum_{\mathfrak p}{2s\over s^2-z_{\mathfrak p}^2}.             \tag{3.1}
\]

The complete centered discrepancy has the locked Laplace identity

\[
 \int_0^\infty g_\infty(t)e^{-st}\,dt=-{H(s)\over s},
 \qquad \Re s>{1\over2}.                              \tag{3.2}
\]

Therefore, as a distribution on `t>0`,

\[
 \boxed{
 g_\infty(t)=-\sum_{\mathfrak p}
 {2\sinh(z_{\mathfrak p}t)\over z_{\mathfrak p}}.}  \tag{3.3}
\]

On `[0,L]`, `g_lambda` is precisely the restriction entering (3.2).  Insert
(3.3) into (2.3).  For one orbit, exact integration by parts gives

\[
 -{2\over z}\int_0^L\sinh(zt)C_{u,w}'(t)\,dt
 =2\int_0^L\cosh(zt)C_{u,w}(t)\,dt,                  \tag{3.4}
\]

because the complete endpoint term is (0.8).  No boundary remainder is
estimated or discarded.

The right side of (3.4) can be evaluated before any zero sum.  From (2.1),

\[
\begin{aligned}
 2\int_0^L\cosh(zt)C_{u,w}(t)\,dt
 ={}&\overline{A_u(\overline z)}A_w(-z)\\
 &+\overline{A_u(-\overline z)}A_w(z).
\end{aligned}                                         \tag{3.5}
\]

Finite Fourier vectors are smooth inside `I_L` and have only their two
zero-extension jumps.  Integration by parts therefore gives, uniformly for
`|Re z|<1/2`,

\[
 |A_f(z)|\leq {C_{f,L}\over1+|z|}.                   \tag{3.6}
\]

The classical zero count gives

\[
 \sum_{z\in\mathcal Z_c}(1+|z|)^{-2}<\infty.         \tag{3.7}
\]

Equations (3.5)--(3.7) make the polarized feature series absolutely
convergent and justify the distributional passage from (3.3) to

\[
 \boxed{
 \mathcal Q_L(u,w)=\sum_{\mathfrak p}
 \left\{
 \overline{A_u(\overline z_{\mathfrak p})}A_w(-z_{\mathfrak p})
 +\overline{A_u(-\overline z_{\mathfrak p})}A_w(z_{\mathfrak p})
 \right\}.}                                          \tag{3.8}
\]

Formula (3.8) is invariant under changing the representative `z_p` to
`-z_p`.

If `u` and `w` have inversion parity `epsilon`, then

\[
 A_f(-z)=\epsilon A_f(z).                             \tag{3.9}
\]

Substitution in (3.8) proves (0.5).  This also pins the sign: the odd pole
does not insert an additional minus sign after centering.  Its sign was
already used in reaching the same `g_lambda` in both parity sectors.

## 4. Critical-line squares and off-line Krein blocks

Assume only for this first algebraic calculation that one orbit
representative is imaginary, `z=i gamma`.  Since `bar(z)=-z`, (3.9) gives

\[
 2\epsilon\overline{A_u(-i\gamma)}A_w(i\gamma)
 =2\overline{A_u(i\gamma)}A_w(i\gamma),              \tag{4.1}
\]

which proves (0.6).  This is a sign check, not an RH assumption in any
subsequent theorem.

Now let `z=beta+i gamma` with `beta gamma !=0`.  Functional-equation and
real-entire symmetry put `-z`, `bar(z)`, and `-bar(z)` in the same quartet.
The two quotient orbits `[z]` and `[bar(z)]`, each with multiplicity `m`,
contribute on the diagonal

\[
 4m\epsilon\operatorname {Re}
 \{\overline{A_f(\overline z)}A_f(z)\}.              \tag{4.2}
\]

The polarization identity gives exactly

\[
\begin{aligned}
 (4.2)=m\epsilon\{&|A_f(z)+A_f(\overline z)|^2\\
                   &-|A_f(z)-A_f(\overline z)|^2\}.
\end{aligned}                                         \tag{4.3}
\]

which is (0.7).

The two evaluation functionals in (4.3) are independent on each parity
sector.  On the even sector their representing analytic functions are
`cosh(zx)` and `cosh(bar(z)x)`; on the odd sector they are `sinh(zx)` and
`sinh(bar(z)x)`.  A linear dependence would force
`z^2=bar(z)^2`, hence `beta gamma=0`, a contradiction.  Consequently the
isolated quartet block genuinely has one positive and one negative channel.

This does not prove that the complete finite form is negative: contributions
from all other zeros and the source-defined restriction can mask one channel
in a finite compression.  What (4.3) rules out is a termwise positive-square
interpretation of the functional-equation pairing.  A positive factorization
would have to prove a genuinely global or source-specific cancellation
between different zero features.

## 5. The centered harmonic lift is shift-independent

Let `S` be a scalar shift and write the same complete physical operator as

\[
 \mathbb B_S=Q-SI=
 \begin{bmatrix}D_S&\Gamma^*\\ \Gamma&H_S\end{bmatrix}
 \quad\hbox{on }Y\oplus F.                           \tag{5.1}
\]

For `sigma>=0`, the exact harmonic lift is

\[
 \mathsf E_{S,\sigma}y
 =\left(y,-(H_S+\sigma I)^{-1}\Gamma y\right).       \tag{5.2}
\]

If `S>=0`, the centering value `sigma=S` is admissible.  Since

\[
 H_S+SI=P_FQP_F=:H_Q,                                \tag{5.3}
\]

one has the exact shift-independent lift

\[
 \boxed{
 \mathsf E_{S,S}=\mathsf E_Q
 :=\left(I,-H_Q^{-1}\Gamma\right).}                 \tag{5.4}
\]

Moreover,

\[
 Q\mathsf E_Qy=i_Y\Sigma_Qy,                        \tag{5.5}
\]

so harmonicity permits the first argument to be lifted as well:

\[
 \boxed{
 \mathfrak B_{\epsilon,S}(u,y)\big|_{\sigma=S}
 =\langle\mathsf E_Qu,Q\mathsf E_Qy\rangle
 =\mathcal Q_{L,\epsilon}(\mathsf E_Qu,\mathsf E_Qy).}          \tag{5.6}
\]

Combining (0.5) and (5.6) gives

\[
 \boxed{
 \mathfrak B_{\epsilon,S}(u,y)\big|_{\sigma=S}
 =2\epsilon\sum_{\mathfrak p}
 \overline{A_{\mathsf E_Qu}(\overline z_{\mathfrak p})}
 A_{\mathsf E_Qy}(z_{\mathfrak p}).}                \tag{5.7}
\]

There are three exact consequences.

1. For `S=U_Z`, the scalar `(sigma-U_Z)<u,y>` is zero at this value.
2. For a lower Ritz shift `S=u_R>=0`, the scalar
   `(sigma-u_R)<u,y>` is also zero, and (5.4)--(5.7) are numerically the
   same centered form.  The reserve `q-u_R` is absent.
3. If `u_R<0`, the centering point is outside `sigma>=0`.  At `sigma=0`
   the scalar `-u_R` remains.  No frozen estimate proves that it dominates
   the signed feature form, so this case stays open rather than being
   covered by (5.7).

Thus lower-Ritz transport may improve the shifted endpoint matrix, but it
cannot repair the centered Krein channel in a uniform-in-`sigma` estimate
when the centering value is admissible.

## 6. Canonical-system and Pick stopping line

A canonical system with a positive Hamiltonian, or a de Branges reproducing
kernel, produces a positive Hermitian Gram.  The corresponding logarithmic
derivative statement here is the Pick kernel of

\[
 m(z)=-{\Xi'(z)\over\Xi(z)},\qquad
 \Xi(z)=\xi(1/2+iz).                                  \tag{6.1}
\]

The frozen Hadamard--Pick theorem proves

\[
 {m(z)-\overline{m(w)}\over z-\overline w}\succeq0
 \text{ on }\mathbb C_+
 \quad\Longleftrightarrow\quad RH.                  \tag{6.2}
\]

Equations (3.8) and (4.3) are the finite-interval physical version of the
same orientation.  On the critical axis they are Hilbert features; an
off-line quartet turns them into a Pontryagin/Krein feature pair.  Because
the endpoint remainder in (0.8) is exactly zero, it cannot absorb the
negative feature.

Accordingly, a cancellation-preserving positive-Hamiltonian factorization
valid for the complete compact test space would establish global Weil
positivity and hence RH by the Weil criterion.  The generator-level Pick
equivalence (6.2) marks the same global positivity boundary; no identification
of one finite compression with the whole Pick kernel is asserted.  Calling
the proposed factorization a finite-boundary estimate would conceal its
logical strength.

The actual Feshbach target is a restricted compression, so the exact finite
chain is instead

\[
\begin{aligned}
 \beta_{\lambda,+}^{\rm mv}>0
 &\Longleftrightarrow
 P_{\kappa^\perp}(Q_+-U_ZI)P_{\kappa^\perp}\succ0,\\
 \beta_{\lambda,-}^{\rm mv}>0
 &\Longleftrightarrow Q_--U_ZI\succ0.
\end{aligned}                                         \tag{6.3}
\]

Since `q<=U_Z`, (6.3) implies the two `q`-shifted signs by adding
`(U_Z-q)I`.  The widening-core theorem then gives

\[
 \text{paired eventual }U_Z\text{-signs}
 \Longrightarrow\text{global Weil positivity}
 \Longrightarrow RH.                                \tag{6.4}
\]

This implication uses the complete sector matrices and the admitted
centered-Fourier core.  It does not require the union of the dangerous
spaces to be dense.  Once (6.4) holds, there are no off-line quartets, so
every Krein negative channel in (4.3) is absent rather than secretly
canceled.

There is no stronger orbitwise inference at one finite parameter.  Positivity
of a compression does not force each negative coordinate of an indefinite
feature representation to vanish.  The absence conclusion in (6.4) uses the
already proved Fourier-core passage and the Weil criterion; it is not a new
density assumption and is not obtained by inspecting one dangerous space.

At one fixed `lambda`, (6.3) is only a finite compression.  It need not
detect an off-line pole or every feature direction.  Hence this note does
not claim the converse `RH implies (6.3)`, and it does not infer failure of
(6.3) from a hypothetical isolated quartet.

## 7. Magnitude-only countermodel and exact frontier

The frozen even and odd multiplier-dangerous reductions already provide a
structural countermodel to every magnitude-only proof.  Set the signed
weighted-PNT discrepancy to zero while retaining the continuous main
density and the exact Archimedean tail.  Then

\[
 Q_\lambda^{\rm cont}=c_*I+A_{\rm tail},
 \qquad c_*=4-\gamma_E-{\pi\over2}-3\log2-\log\pi<-1.            \tag{7.1}
\]

The zero discrepancy satisfies every frozen upper bound involving
`|D_lambda|`, its Stieltjes magnitude, or its PNT envelope.  Nevertheless,
the comparison has arbitrarily large negative fixed-mode compressions, and
the exact dangerous Schur reductions give

\[
 \beta_{\lambda,+,{\rm cont}}^{\rm mv}=0,
 \qquad
 \beta_{\lambda,-,{\rm cont}}^{\rm mv}=0             \tag{7.2}
\]

in their admitted ranges.  This model is not an alternate prime system and
does not preserve the exact von Mangoldt inventory.  Its precise role is to
show that magnitude and PNT-envelope hypotheses alone cannot orient (0.5).

The earliest viable theorem is therefore still the actual restricted
signed inf--sup

\[
 \beta_{\lambda,+}^{\rm mv}\gg
 (\sqrt\lambda\operatorname {polylog}\lambda)^{-1},
 \qquad
 \beta_{\lambda,-}^{\rm mv}>0,                       \tag{7.3}
\]

or an exact source-specific factorization of (5.7) that proves the
equivalent finite sector signs.  Any such proof along the `U_Z` schedule is
already an RH-strength signed-arithmetic theorem by (6.4).  The zero-orbit
identity identifies its natural geometry but does not supply its sign.

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_signed_discrepancy_centered_zero_krein_factorization_barrier -v

The regression checks the frozen hashes, complete two-sided multiplier,
small- and large-end boundary terms, zero-feature orientation, parity signs,
off-line Krein signature, centered harmonic-lift invariance, RH-strength
claim boundary, displayed TeX, and ASCII hygiene.
