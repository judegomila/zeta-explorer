# Growing mixed bridge radical-quotient and graph-core barrier

## 0. Outcome and fail-closed boundary

Let \({\cal D}_Z\) be a linear domain of global multiplicative states on
which the complete two-slot zero-evaluation map is defined and square
summable,

\[
 Z:{\cal D}_Z\longrightarrow {\mathfrak Z},
 \qquad {\cal R}_Z=\ker Z .                              \tag{0.1}
\]

The complete spectral pairing has the frozen representation

\[
 q(F,G)=\langle ZF,\Sigma ZG\rangle_{\mathfrak Z},
 \qquad \Sigma=\Sigma^*=\Sigma^{-1}.                    \tag{0.2}
\]

This note tests whether quotienting by the two-sided zero-evaluation
radical removes the one mixed source

\[
 b=h_2-{I_2\over I_0}h_0                                \tag{0.3}
\]

which is absent from the strict even and odd low-prefix floors.  The exact
answer is a barrier, not a floor.

1. The algebraic quotient is legitimate, and (0.2) descends to it.  If a
   global radical lift splits as \(K=X+O\), with \(X\) compact and \(O\)
   exterior, then

   \[
    \boxed{[X]=-[O]\quad\hbox{in }{\cal D}_Z/{\cal R}_Z.} \tag{0.4}
   \]

   This does not say \([X]=0\).  In particular, quotienting the full bridge
   radical does not algebraically delete its compact bridge state.
2. Whether the actual compact bridge satisfies \(ZX_b=0\) is not decided by
   the frozen Paley--Wiener theorem.  That theorem uses derivative jets to
   represent algebraic multiplicity.  The Weil sampling map repeats value
   rows; repeated values are not derivative jets.  Thus no compact
   value-only injectivity theorem may be imported here.
3. The quotient has no nontrivial Hausdorff \(L^2\) completion in the even
   sector.  The frozen polynomial--Xi radical tower lies in
   \({\cal R}_Z\) and is dense in even \(L^2\).  Hence the \(L^2\) quotient
   seminorm is identically zero, and \(Z\), as well as the positive form
   \(\|ZF\|_{\mathfrak Z}^2\), is not \(L^2\)-closable.
4. The stronger absolute sampling topology has an unconditional quotient
   completion, with norm \(\|[F]\|_Z=\|ZF\|_{\mathfrak Z}\).  The signed form
   (0.2) extends continuously to that completion without assuming RH, but
   it remains signed.  Ordinary \(L^2\) density supplies no density in this
   graph topology.
5. An exact finite central/exterior model has all-vector radical lifts, a
   codimension-two source family consisting entirely of radicals, and a
   positive captured compact block, while its omitted bridge remains one
   unit away in the sampling graph norm and has negative signed square.
   Thus radicality, quotient algebra, codimension, and captured positivity
   do not imply graph-core positivity.
6. If the captured low-prefix states were proved dense in the absolute
   sampling graph topology and their signs were nonnegative, continuity
   would extend positivity to compact Weil tests.  The frozen Weil-core gate
   would then give the Weil criterion and RH.  The completion itself is
   unconditional; the missing captured-core positivity theorem is
   RH-strength.

The strict-PASS even and odd floors remain exactly as frozen.  The exact
endpoint shear, the full bridge cross metric, the zero-integral scope of the
raw radical lemma, and the complete pole--Archimedean--prime pairing are not
changed.  No bridge row is discarded.  No claim is made that the mixed
floor is false, that the bridge class is zero or nonzero, that a retained
complement is positive, or that RH is proved.  The project state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md` | `23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0` |
| `tests/test_growing_low_prefix_outer_floor_assembly_theorem.py` | `634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311` |
| `notes/GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md` | `a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459` |
| `tests/test_growing_odd_low_prefix_outer_floor_transfer_theorem.py` | `c8a86e338762f00c32c04e9e300fc3398d4cbb084f16a1a530b77a16a1144bad` |
| `notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md` | `335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb` |
| `tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py` | `0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc` |
| `notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md` | `6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98` |
| `tests/test_polynomial_xi_radical_tower_covariance_floor_obstruction.py` | `ce28d716eedddfad168a5d27fe38da31ab1ba81c77b9f0b28e637111db6afab5` |
| `notes/CENTERED_ZERO_PALEY_WIENER_INTERPOLATION_OBSTRUCTION.md` | `b23720bd4c05afbda4aa3f50176ff0580bacda0668264fd4fcc075b7c43d5ae2` |
| `notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md` | `e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816` |
| `tests/test_common_radical_leakage_gram_orientation.py` | `d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417` |
| `notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md` | `78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3` |
| `tests/test_q_shift_sector_weil_core_gate.py` | `714f9839b0514c779f1fc05d558dd9446654de360dd1f0cc70502cba75fa6bf2` |

No external distinct-zero or simple-zero theorem is imported.  This is
essential to the value-only boundary in Section 3.

## 2. Exact quotient identity and the bridge split

For \(F,G\in{\cal D}_Z\), every \(R\in{\cal R}_Z\) satisfies

\[
 q(F+R,G)=q(F,G)=q(F,G+R).                              \tag{2.1}
\]

Therefore

\[
 \overline q([F],[G])
 :=\langle ZF,\Sigma ZG\rangle_{\mathfrak Z}           \tag{2.2}
\]

is well defined on \({\cal D}_Z/{\cal R}_Z\).  The map

\[
 [F]\longmapsto ZF                                      \tag{2.3}
\]

identifies this algebraic quotient with \(\operatorname {ran}Z\).  It does
not identify a compact restriction with its global lift.

For the raw bridge, or for its exact endpoint-sheared version, the frozen
BV radical lemma gives a global radical

\[
 K_b=X_b+O_b,\qquad ZK_b=0.                             \tag{2.4}
\]

Here \(X_b\) is the compact central state after the declared restriction
and projection, while \(O_b\) includes the complete exterior and projection
remainder in the same representative.  Equation (2.4) gives

\[
 ZX_b=-ZO_b,
 \qquad [K_b]=0,
 \qquad [X_b]=-[O_b].                                   \tag{2.5}
\]

The last equality is (0.4).  It is compatible with a nonzero compact form:

\[
 \overline q([X_b],[X_b])
 =\overline q([O_b],[O_b])
 =-\overline q([X_b],[O_b]).                            \tag{2.6}
\]

Thus the quotient moves the bridge between its compact and exterior
representatives; it does not make either representative vanish.

The state-invisible origin correction changes (2.4) by another global
radical \(B_b\) whose compact restriction is zero:

\[
 ZB_b=0,\qquad C_\lambda B_b=0.                         \tag{2.7}
\]

It follows that the two complete representatives have the same quotient
class and the same complete spectral pairing.  It does not follow that
their separated physical energies agree.  In particular, the pole-domain
failure of the raw beta row, the \(\Theta(\lambda^{-1})\) corrected-bump
energy, the full bridge cross metric, and the exact endpoint shear from the
frozen barrier all survive this quotient audit.

## 3. The compact value-only question is not frozen

For a compact log-supported state \(X\), its transform is entire of finite
exponential type.  The frozen Paley--Wiener theorem proves uniqueness under
the multiplicity-aware conditions

\[
 A_X^{(j)}(z)=0,
 \qquad 0\leq j<m(z),                                  \tag{3.1}
\]

at every distinct centered zero \(z\), where \(m(z)\) is its algebraic
multiplicity.  The proof counts the derivative jets in (3.1).

The actual positive sampling map instead repeats ordinary value rows:

\[
 \|ZX\|_{\mathfrak Z}^2
 =\sum_\rho\left(
 |A_X(s_\rho)|^2+|A_X(\overline{s_\rho})|^2\right).     \tag{3.2}
\]

If a zero has multiplicity \(m\), (3.2) repeats the same value \(m\)
times.  It does not impose \(A_X',\ldots,A_X^{(m-1)}\).  Consequently the
frozen implication is only

\[
 \hbox{multiplicity-aware jet radical and compact}
 \quad\Longrightarrow\quad X=0,                        \tag{3.3}
\]

not

\[
 ZX=0\hbox{ and compact}\quad\Longrightarrow\quad X=0. \tag{3.4}
\]

The source transform of the full global bridge contains the complete zeta
divisor, but truncating it to \(X_b\) does not preserve that divisor.  The
only frozen identity is \(ZX_b=-ZO_b\).  Therefore the alternatives

\[
 ZX_b=0\quad\hbox{or}\quad ZX_b\ne0                     \tag{3.5}
\]

remain undecided here.  Proving either alternative requires an actual
value-only nonvanishing argument for this compact state, or a value-only
compact uniqueness theorem with a sufficient distinct-zero input.  Neither
is contained in the frozen package.  This uncertainty does not rescue the
quotient proposal: quotient algebra alone proves neither side of (3.5).

## 4. The \(L^2\) quotient collapses

Let \({\cal H}_+=L^2_{\rm even}(\mathbb R)\) in log coordinates.  The
polynomial--Xi theorem gives radicals \(G_j\in{\cal R}_Z\cap{\cal H}_+\)
such that

\[
 \overline{\operatorname {span}\{G_j:j\geq0\}}^{\,L^2}
 ={\cal H}_+.                                          \tag{4.1}
\]

Hence the ordinary quotient seminorm satisfies, for every
\(F\in{\cal H}_+\),

\[
 \boxed{
 \inf_{R\in{\cal R}_Z\cap{\cal H}_+}\|F+R\|_2=0.}       \tag{4.2}
\]

The Hausdorff \(L^2\) completion of the quotient is therefore the zero
space.

The evaluation operator is not closable from this \(L^2\) domain to
\({\mathfrak Z}\).  Choose an even compact smooth \(F\) with \(ZF\ne0\).
Such an \(F\) exists because evaluation at any one fixed nontrivial-zero
parameter is a nonzero continuous functional on compact smooth functions.
By (4.1), choose radicals \(R_n\to F\) in \(L^2\).  Then

\[
 H_n=F-R_n\longrightarrow0\quad\hbox{in }L^2,
 \qquad ZH_n=ZF\ne0.                                   \tag{4.3}
\]

This violates the sequential criterion for closability.  The positive
sampling form

\[
 a(F,G)=\langle ZF,ZG\rangle_{\mathfrak Z}             \tag{4.4}
\]

is not \(L^2\)-closable for the same reason: the sequence in (4.3) is
\(a\)-Cauchy, because \(H_n-H_m\) is radical, but
\(a(H_n,H_n)=\|ZF\|_{\mathfrak Z}^2\) does not tend to zero.

More generally, on the even sector a nonnegative closable \(L^2\) form
which annihilates every two-sided radical in the dense tower must close to
the zero form.  Its
closed square-root kernel is an \(L^2\)-closed subspace containing the dense
tower and hence all of \({\cal H}_+\).  Thus no nontrivial compact Weil form
can be obtained as a positive \(L^2\) quotient form by these radicals.

There is a minimal abstract model of this failure.  In
\(\ell^2(\mathbb N)\), let \(x=(2^{-n})_{n\geq1}\), put

\[
 {\cal D}=c_{00}\oplus\mathbb Cx,
 \qquad Z_0(r+cx)=c.                                    \tag{4.5}
\]

Then \(\ker Z_0=c_{00}\) is dense.  If \(r_N\) truncates \(x\) after
coordinate \(N\),

\[
 \|x-r_N\|_2^2={4^{-N}\over3}\longrightarrow0,
 \qquad Z_0(x-r_N)=1.                                  \tag{4.6}
\]

This is the exact topology represented by (4.3): a dense radical does not
make the graph quotient dense in the zero class; it makes the \(L^2\)
operator nonclosable.

## 5. The unconditional absolute-sampling completion

On the algebraic quotient define

\[
 \|[F]\|_Z:=\|ZF\|_{\mathfrak Z}.                       \tag{5.1}
\]

This is a norm by the definition of \({\cal R}_Z\).  Its completion is
canonically

\[
 {\cal H}_Z=\overline{Z({\cal D}_Z)}^{\,\mathfrak Z}.    \tag{5.2}
\]

Since \(\Sigma\) is unitary,

\[
 |\overline q([F],[G])|
 \leq\|[F]\|_Z\|[G]\|_Z,                              \tag{5.3}
\]

so (2.2) extends boundedly to \({\cal H}_Z\).  No zero is assumed real in
this construction.  It is a signed, possibly degenerate Hermitian form,
not a positive Hilbert norm.

If one first uses the ordinary graph norm and then quotients in the even
sector, density of the radical tower gives, for
\(F\in{\cal D}_Z\cap{\cal H}_+\),

\[
 \begin{aligned}
 \|[F]\|_{\rm quot,graph}^2
 &:=\inf_{R\in{\cal R}_Z\cap{\cal H}_+}
    \left(\|F+R\|_2^2+\|Z(F+R)\|_{\mathfrak Z}^2\right)\\
 &=\|ZF\|_{\mathfrak Z}^2.
 \end{aligned}                                         \tag{5.4}
\]

Thus the only surviving quotient graph topology is exactly the absolute
sampling topology (5.1).  The state-invisible origin bump has zero norm in
this quotient, while its separated corrected physical energy can be
\(\Theta(\lambda^{-1})\).  Therefore (5.1) cannot replace the raw exterior
metric in the low-prefix Toeplitz theorem.

## 6. Exact codimension-two and bridge countermodel

Let the central and exterior spaces both be \(\mathbb R^3\), and put

\[
 {\cal V}=\mathbb R^3_{\rm cen}\oplus\mathbb R^3_{\rm ext},
 \qquad Z(x,o)=x+o,
 \qquad \Sigma=\operatorname {diag}(1,1,-1).           \tag{6.1}
\]

Define

\[
 q((x,o),(y,p))=(x+o)^T\Sigma(y+p),
 \qquad {\cal R}=\ker Z=\{(x,-x):x\in\mathbb R^3\}.   \tag{6.2}
\]

For every compact central vector \(x\), there is an exact global radical
lift and exterior tail

\[
 X_x=(x,0),\qquad O_x=(0,-x),\qquad K_x=X_x+O_x\in{\cal R}.
                                                               \tag{6.3}
\]

To model the source codimension, take \({\cal U}=\mathbb R^5\) with

\[
 \ell_0(u)=u_4,
 \qquad \ell_1(u)=u_5,
 \qquad {\cal U}_0=\ker\ell_0\cap\ker\ell_1.          \tag{6.4}
\]

The source lift \(L:{\cal U}_0\to{\cal V}\),

\[
 L(u_1,u_2,u_3,0,0)
 =((u_1,u_2,u_3),-(u_1,u_2,u_3)),                      \tag{6.5}
\]

has range in \({\cal R}\).  Hence \(q(Lu,Lu)=0\) on the entire
codimension-two source family, and its central restrictions cover all of
\(\mathbb R^3\).  Positivity of the global source radicals therefore says
nothing about positivity of their compact restrictions.

Let the captured compact block and bridge be

\[
 {\cal C}_{\rm cap}
 =\operatorname {span}\{X_{e_1},X_{e_2}\},
 \qquad X_b=X_{e_3}.                                   \tag{6.6}
\]

Then

\[
 q|_{{\cal C}_{\rm cap}}\succeq0,
 \qquad q(X_b,X_b)=-1,                                 \tag{6.7}
\]

and in the quotient sampling norm

\[
 \boxed{
 \inf_{C\in{\cal C}_{\rm cap}}\|[X_b]-[C]\|_Z=1.}     \tag{6.8}
\]

Moreover \([X_b]=-[O_{e_3}]\), exactly as in (2.5).  Thus even exact
all-vector radical lifts and exact positivity on a captured block do not
remove or approximate the bridge.  The model is not an arithmetic
counterexample; it proves that the proposed conclusion does not follow
from quotient and codimension algebra.

## 7. Exact missing graph-core theorem and RH boundary

Let \({\cal C}_{\rm low}\) be the union of the compact central ranges of
the strict-PASS even and odd low-prefix families, with their separate exact
endpoint shears.  A quotient graph-core theorem would require, at minimum,

\[
 \boxed{
 \inf_{C\in{\cal C}_{\rm low}}
 \|Z(F-C)\|_{\mathfrak Z}=0
 \quad\hbox{for every compact Weil test }F.}           \tag{7.1}
\]

For the one omitted coordinate, the first required instance is

\[
 \inf_{C\in{\cal C}_{\rm low}}
 \|Z(X_b-C)\|_{\mathfrak Z}=0.                         \tag{7.2}
\]

Neither the strict floors, the raw BV radical lemma, the invisible bump,
the polynomial--Xi \(L^2\) density theorem, nor the all-vector radical lift
proves (7.2).  The full centered-Fourier spaces are a frozen Weil-form core,
but no theorem identifies the much smaller low-prefix captured ranges with
that core.

For a moving bridge floor, qualitative density would still be insufficient.
A sufficient relative diagonal condition would have the form

\[
 \|Z(X_b-C_\lambda)\|_{\mathfrak Z}
 \left(\|ZX_b\|_{\mathfrak Z}+\|ZC_\lambda\|_{\mathfrak Z}\right)
 =o(Ld_2),                                              \tag{7.3}
\]

together with the analogous half-power cross estimate against every old
captured column and compact transfer in the exact raw exterior metric.
Equation (5.3) would then make the signed form error \(o(Ld_2)\).  No frozen
estimate supplies (7.3); it is the quotient version of the missing complete
bridge load in the gauge-pole barrier.

Finally, suppose (7.1) held and the compact low-prefix forms were
nonnegative on a common unbounded schedule.  By (5.3), their positivity
would extend to every compact Weil test.  The frozen widening-Fourier core
gate would then give

\[
 {\cal W}(F,F)\geq0\quad(F\in C_c^\infty(\mathbb R)),   \tag{7.4}
\]

and the Weil criterion would imply RH.  This explains the exact logical
boundary:

* the absolute-sampling quotient and its signed completion are
  unconditional;
* an \(L^2\)-positive quotient completion collapses to zero;
* a norm built from the signed Weil form presupposes its missing
  semiboundedness; and
* captured graph-core density plus the required positivity is RH-strength.

Accordingly, the radical quotient does not close the mixed bridge floor.
The earliest exact missing inputs are the actual value-only status (3.5)
and, if the bridge class is nonzero, the quantitative graph capture
(7.2)--(7.3).  The existing bridge barrier remains in force with its exact
endpoint shear and all physical cross terms.

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_mixed_bridge_radical_quotient_graph_core_barrier -v

The regression checks the algebraic quotient, the dense-kernel
nonclosability model, the codimension-two radical lift, the signed bridge
countermodel, frozen hashes, value-versus-jet scope, fail-closed language,
ASCII hygiene, and displayed TeX.
