# Cutoff-free one-direction weighted ground-capture theorem

## 0. Exact outcome and claim boundary

Let `Q_lambda` be the full cutoff-free semilocal Weil operator, let
`mu_lambda` be its lowest eigenvalue, and let `P_lambda` be the complete
projector onto the corresponding eigenspace, including all multiplicities
and both inversion parities.  Let

\[
 \mathcal K_F:F\longrightarrow\operatorname {Dom}(Q_\lambda)
 \tag{0.1}
\]

be any finite radical/quasimode synthesis, and let `Delta_F` be its positive
source-defect operator.  All inverses below are taken on the positive
support of `Delta_F`.  Put

\[
 B_F=\mathcal K_F(\Delta_F^\dagger)^{1/2},\qquad
 \mathcal C_F=\|Q_\lambda B_F\|,                       \tag{0.2}
\]

and define the largest defect-weighted bottom capture

\[
 \boxed{
 \Lambda_F^{\max}
 =\|P_\lambda B_F\|^2
 =\lambda_{\max}\!\left(
 P_\lambda\mathcal K_F\Delta_F^\dagger
 \mathcal K_F^*P_\lambda\right).}                    \tag{0.3}
\]

The exact bottom-projector identity gives

\[
 \boxed{
 |\mu_\lambda|\sqrt{\Lambda_F^{\max}}
 \leq\mathcal C_F.}                                  \tag{0.4}
\]

Consequently

\[
 \boxed{
 {\mathcal C_F^2\over\Lambda_F^{\max}}\longrightarrow0
 \quad\Longrightarrow\quad
 \mu_\lambda\longrightarrow0}                       \tag{0.5}
\]

on any cofinal schedule.  Domain monotonicity then promotes the schedule
limit to the full limit, and the pinned CCM implication gives RH.  Equation
(0.5) is a conditional implication.  This note proves no lower bound for
the actual quantity in (0.3), no ground overlap, and no RH conclusion.

The important point is that (0.3) uses the **largest** eigenvalue.  One
captured direction in the complete bottom eigenspace is enough because
`Q_lambda` has the same scalar eigenvalue `mu_lambda` on every vector in
that eigenspace.  Surjectivity onto the bottom space, a smallest frame
eigenvalue, bottom simplicity, and parity ordering are unnecessary for
(0.4).

The exact vectorwise stopping statistic is still weaker.  Define

\[
 \eta_F=inf_{u:\,P_\lambda B_Fu\ne0}
 {\|Q_\lambda B_Fu\|\over\|P_\lambda B_Fu\|},        \tag{0.6}
\]

with `eta_F=+infinity` if the admissible set is empty.  Then

\[
 \boxed{
 |\mu_\lambda|\leq\eta_F,\qquad
 \Lambda_F^{\max}>0\ \Longrightarrow\
 \eta_F\leq{\mathcal C_F\over\sqrt{\Lambda_F^{\max}}}.} \tag{0.7}
\]

The first inequality permits coherent residual cancellation and is the
weakest direct finite-family ratio in this route.  The second is what the
already-proved uniform defect-relative residual estimate can certify when
there is nonzero bottom capture.  If `Lambda_F^max=0`, then `P_lambda B_F=0`,
the admissible set in (0.6) is empty, and `eta_F=+infinity`.
Thus no second inequality is asserted at zero capture.

The odd negative rank-one pole does not provide the missing bridge capture.
Even on a pole-created simple ground, Birman--Schwinger theory controls the
ground overlap with the pole vector, not its overlap with the mixed bridge.
Section 6 gives the exact formula and a two-dimensional countermodel with a
positive pole-free base, a negative pole-created ground, saturated pole
overlap, positive bridge self-energy, and identically zero bridge contrast.

The standard eight are untouched.  The formal project state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies

No external source or numerical artifact is added.  The exact repository
bytes used are:

| Frozen path | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md` | `2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d` |
| `tests/test_cutoff_free_multi_anchor_ground_frame_barrier.py` | `0fdc307a051d50ff4ece21ae8b01f89b745a14788f093ec4127f5da6026bde9f` |
| `notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md` | `c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c` |
| `tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py` | `d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11` |
| `notes/CUTOFF_FREE_UNIFORM_RADICAL_GRAPH_TRANSFER_THEOREM.md` | `aa69ac86e6b5d5256ba3b243b9fc07d9c5ad49bed7a70e3d570d0c57325bce18` |
| `tests/test_cutoff_free_uniform_radical_graph_transfer_theorem.py` | `b2708c8f72ce8bad831b2aea44c49ef3a8ec5f9c38551c288a1c982d097ee727` |
| `notes/CUTOFF_FREE_BRIDGE_LEVERAGE_RANK_ONE_INNOVATION_REDUCTION.md` | `808c314d6b0cf1926ddf8b0a5b83c324ccbbc252d18efea283781fefd1751097` |
| `tests/test_cutoff_free_bridge_leverage_rank_one_innovation_reduction.py` | `2c79244dd68e9fd56ddb67f7278f4572cb72bae9803b82047ccf9ad58196faba` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `tests/test_parity_multiplier_schur.py` | `94ee818e2747e703d521cfa2a980765569cccfdf442b700b1a6b33ac4ceababb` |

The multi-anchor pair supplies the columnwise and full-bottom projector
identities.  The weighted pair supplies `Delta_F`, the minimum-defect
normalization, and the stronger smallest-eigenvalue coframe statistic.  The
uniform graph pair proves that `mathcal C_F` is polynomial for the declared
phase-separated leading source through the pre-Shannon window.  The bridge
pair supplies the exact innovation and arithmetic contrast.  The parity
pair supplies the sign and norm of the odd pole.

## 2. Vectorwise and operator-norm theorem

Fix `lambda` and abbreviate

\[
 Q=Q_\lambda,\qquad P=P_\lambda,\qquad
 \mu=\mu_\lambda,\qquad B=B_F.                       \tag{2.1}
\]

Compact resolvent makes `P` finite rank and nonzero.  Spectral calculus
gives

\[
 PQ=QP=\mu P.                                        \tag{2.2}
\]

For every source coordinate `u`,

\[
 P QBu=\mu PBu.                                      \tag{2.3}
\]

If `PBu` is nonzero, orthogonal projection is contractive, so

\[
 |\mu|
 \leq{\|QBu\|\over\|PBu\|}.                         \tag{2.4}
\]

Taking the infimum proves the first inequality in (0.7).  Taking operator
norms directly in (2.3) gives

\[
 |\mu|\,\|PB\|=\|PQB\|\leq\|QB\|=\mathcal C_F.     \tag{2.5}
\]

Furthermore,

\[
 \|PB\|^2
 =\|PBB^*P\|
 =\left\|P\mathcal K_F\Delta_F^\dagger
                 \mathcal K_F^*P\right\|,           \tag{2.6}
\]

which is (0.3)--(0.4).  If `Lambda_F^max>0`, then in finite dimension a
right singular vector of `PB` attaining its norm has nonzero denominator
`sqrt(Lambda_F^max)`.  Its numerator is at most `mathcal C_F`, proving the
conditional second inequality in (0.7).  If `Lambda_F^max=0`, then `PB=0`,
so the admissible set defining `eta_F` is empty and this division is not
made.

Nothing in this proof chooses a ground eigenvector, assumes the bottom is
simple, or selects a physical parity.  If the full bottom contains tied
even and odd summands, any one captured summand still carries the same
scalar `mu`.  If one instead uses a projector onto only the even-sector
bottom, the scalar in (2.2) is the even bottom and the implication to RH
again needs a parity-order theorem.  The full projector avoids that issue.

## 3. Exact comparison with full coframes and trace capture

Put

\[
 S_F=P\mathcal K_F\Delta_F^\dagger\mathcal K_F^*P.
                                                               \tag{3.1}
\]

The frozen weighted-coframe statistic is the smallest positive eigenvalue
of `S_F`, set to zero unless `S_F` is onto the complete bottom space.  Call
it `Lambda_F^min`.  The new statistic is

\[
 \Lambda_F^{\max}=\lambda_{\max}(S_F).               \tag{3.2}
\]

Therefore

\[
 0\leq\Lambda_F^{\min}\leq\Lambda_F^{\max}.          \tag{3.3}
\]

The comparison can be strict in the strongest possible way.  On a
two-dimensional bottom space, `S_F=diag(M,0)` has

\[
 \Lambda_F^{\min}=0,\qquad\Lambda_F^{\max}=M.        \tag{3.4}
\]

If `mathcal C_F/sqrt(M)` tends to zero, (0.4) closes the scalar bottom
value although no coframe, right inverse, or capture of the second bottom
direction exists.  This is legal precisely because both bottom directions
have the same eigenvalue.

There is a parallel Hilbert--Schmidt identity:

\[
 \boxed{
 |\mu|^2\operatorname {tr}S_F
 =\|PQB\|_{\rm HS}^2
 \leq\|QB\|_{\rm HS}^2.}                             \tag{3.5}
\]

Thus

\[
 {\|QB\|_{\rm HS}^2\over\operatorname {tr}S_F}
 \longrightarrow0                                    \tag{3.6}
\]

is another sufficient family condition.  It aggregates all captured
bottom directions but pays for every residual singular direction.  The
operator condition (0.5) uses only the largest captured singular direction
and the operator residual.  Neither numerical bound uniformly dominates
the other without more singular-value information.  In particular, many
source directions with unit residual and no bottom capture can make the
Hilbert--Schmidt numerator large while leaving (0.4) unchanged.

More generally every unitarily invariant ideal norm gives

\[
 |\mu|\,\|PB\|_{\mathcal I}\leq\|QB\|_{\mathcal I}. \tag{3.7}
\]

Equations (0.7), (0.4), and (3.5) are respectively the vectorwise,
operator-norm, and Hilbert--Schmidt versions of the same projector identity.

## 4. Actual coefficient stopping line

For the physical radical map, compact restriction agrees with the full
arithmetic source map on the declared source.  Let

\[
 X=\operatorname {Ran}P,\qquad z_g=A_{\lambda,0}^*g
 \quad(g\in X).                                       \tag{4.1}
\]

With the parity copies understood blockwise, adjunction gives the exact
source formula

\[
 \boxed{
 \Lambda_F^{\max}
 =\sup_{\substack{g\in X\\\|g\|=1}}
 \left\|(\Delta_F^\dagger)^{1/2}P_Fz_g\right\|^2.}  \tag{4.2}
\]

For the phase-separated leading family with `m<=S-1`, the frozen graph
theorem already gives

\[
 \mathcal C_{F_m}=\operatorname {poly}(\lambda,L).   \tag{4.3}
\]

Consequently the one-direction source-specific target is only

\[
 \boxed{
 \sup_{\substack{g\in\operatorname {Ran}P_\lambda\\\|g\|=1}}
 {\left\|(\Delta_{F_m}^\dagger)^{1/2}
              P_{F_m}A_{\lambda,0}^*g\right\|^2
  \over\mathcal C_{F_m}^2}
 \longrightarrow+\infty.}                           \tag{4.4}
\]

At a cutoff `m=S-K(log lambda)^2`, this asks for one actual
defect-weighted adjoint coefficient packet beating a polynomial residual
scale.  It does not ask for a smallest singular value on every bottom
direction.  Qualitative density, cyclicity, parity pairs, and translations
still provide no rate for (4.4); a bottom line may evacuate every declared
pre-Shannon packet.

For the rank-one bridge innovation of the frozen mixed reduction,

\[
 S_M=S_F+s_b^{-1}|w_b\rangle\langle w_b|.            \tag{4.5}
\]

On a unit bulk-missed bottom line `e_0`,

\[
 \langle e_0,w_b\rangle
 =\beta_2(e_0)-{I_2\over I_0}\beta_0(e_0).           \tag{4.6}
\]

Hence the exact bridge contribution to the largest weighted capture is

\[
 {1\over s_b}
 \left|\beta_2(e_0)-{I_2\over I_0}\beta_0(e_0)\right|^2. \tag{4.7}
\]

If the bulk vanishes on that line, the narrow bridge-only sufficient
stopping line is

\[
 \boxed{
 {\left|\beta_2(e_0)-(I_2/I_0)\beta_0(e_0)\right|^2
  \over s_b\,\mathcal C_M^2}
 \longrightarrow+\infty.}                           \tag{4.8}
\]

Here `mathcal C_M` must be the residual constant for the same augmented
source metric used to define `s_b`.  A modal constant, a bump-aware
constant, and a coherent form diagonal may not be interchanged.  No frozen
input proves (4.8), or even quantitative nonvanishing of its numerator on
the actual missed line.

## 5. Why translations and more bridge labels do not supply (4.4)

The exact translation average for one base anchor is diagonal in physical
log-Fourier coordinates.  Its lower frame constant on `|n|<=R` is the
smallest base-anchor Fourier weight on that band.  Translations change
phases but not these magnitudes, and using the full translation period
includes boundary-centered states for which the small radical leakage is
lost.  Thus translation cyclicity gives no lower rate in (4.4).

Likewise, adding every mixed label does not create independent bridge
quotients.  The full zero-integral mixed prefix decomposes as the two
separate phase bulks plus one bridge line.  All further mixed bridge columns
differ from that line by bulk vectors.  After defect orthogonalization their
new information is the single rank-one term (4.5).  More labels can improve
the bulk or the representative of `w_b`; they cannot turn the one missing
arithmetic contrast (4.6) into a formal consequence.

The one-direction theorem therefore removes an unnecessarily strong
all-bottom coframe demand, but it does not remove the actual arithmetic
orientation problem.

## 6. Odd-pole Birman--Schwinger audit

On the odd physical sector write

\[
 Q_-=H_--2|p_-\rangle\langle p_-|,qquad
 p_-(x)=\sinh(x/2),                                   \tag{6.1}
\]

where `H_-` is the complete pole-free multiplier part.  On
`[-ell,ell]`, `ell=log lambda`,

\[
 \boxed{
 \|p_-\|^2=\sinh\ell-\ell
 ={\lambda-\lambda^{-1}\over2}-\log\lambda.}        \tag{6.2}
\]

Let `g` be a unit odd ground with `Q_-g=mu g`.  The rank-one pole does not
by itself imply that this ground is pole-created: `H_-` can have a lower
dangerous direction, and a ground orthogonal to `p_-` is not excluded by
the frozen multiplier bounds.

Even under the stronger pole-created hypothesis

\[
 \mu<\inf\sigma(H_-),\qquad R_\mu=(H_--\mu I)^{-1}, \tag{6.3}
\]

Birman--Schwinger theory gives exactly

\[
 \boxed{
 2\langle p_-,R_\mu p_-\rangle=1,qquad
 g=e^{i\phi}{R_\mu p_-\over\|R_\mu p_-\|},qquad
 |\langle p_-,g\rangle|
 ={1\over2\|R_\mu p_-\|}.}                          \tag{6.4}
\]

If `d=inf sigma(H_-)-mu>0`, then

\[
 \boxed{
 |\langle p_-,g\rangle|
 \geq {d\over2\|p_-\|}.}                            \tag{6.5}
\]

For the mixed bridge innovation, however, (6.4) gives only

\[
 \boxed{
 |\langle g,w_b\rangle|
 ={|\langle R_\mu p_-,w_b\rangle|
    \over\|R_\mu p_-\|}.}                            \tag{6.6}
\]

On a bulk-missed line the left side is exactly the contrast in (4.6).
Neither (6.2), the secular identity, nor the gap `d` supplies a lower bound
for the numerator in (6.6).  Such a bound is precisely a new angle between
the resolvent-transformed pole and the actual bridge.

The failure is exact already in two dimensions.  Let

\[
 H_-=I_2,\qquad p_-=e_1,qquad
 Q_-=I_2-2|e_1\rangle\langle e_1|
 =\operatorname {diag}(-1,1).                       \tag{6.7}
\]

Then `mu=-1`, `g=e_1`, `d=2`, `R_mu=(1/2)I_2`, and every equality in
(6.4)--(6.5) is saturated.  Take a bridge innovation

\[
 w_b=\sqrt{s_b}\,e_2.                                \tag{6.8}
\]

It has positive pole-free self-energy

\[
 \langle w_b,H_-w_b\rangle=s_b>0,                   \tag{6.9}
\]

but

\[
 \boxed{
 \langle g,w_b\rangle=0.}                            \tag{6.10}
\]

Thus even a positive base, a simple negative ground created entirely by
the odd pole, a strict Birman--Schwinger gap, and maximal pole alignment do
not force any positive constant in (4.6).  The actual source-specific route
must estimate (6.6), not merely the pole load.

## 7. Schedule consequence and stopping line

For the frozen phase-separated leading family, combine (0.4) with the
polynomial residual theorem.  Any cofinal schedule satisfying

\[
 \log\Lambda_{F_m}^{\max}
 -2\log\mathcal C_{F_m}\longrightarrow+\infty       \tag{7.1}
\]

forces `mu_lambda->0`.  A convenient sufficient source statement at
`m=S-K(log lambda)^2` is (4.4).  The exact weaker alternative is to exhibit
one source vector `u_lambda` for which

\[
 {\|Q_\lambda B_{F_m}u_\lambda\|
  \over\|P_\lambda B_{F_m}u_\lambda\|}
 \longrightarrow0.                                   \tag{7.2}
\]

This may exploit cancellations not visible to `mathcal C_F`.

Neither (7.1), (7.2), (4.4), nor (4.8) is proved for the actual bottom
projector.  They are exact reduced targets.  Accordingly this theorem is a
strict simplification of the remaining implication, not a solution of it.

## 8. Reproduction and claim discipline

Run

    python3 -B -m unittest \
      tests.test_cutoff_free_one_direction_weighted_ground_capture_theorem -v

The regression uses exact rational matrices for the bottom-projector,
largest-capture, trace, multiplicity, and odd-pole identities.  It validates
every frozen dependency hash and the note hash.  It reads no zero table,
numerical ground, cached prolate artifact, network resource, API key, or
environment secret.

This note must not be cited as proving that `Lambda_F^max` is positive or
large for any actual pre-Shannon family.  It proves only the identities and
conditional implications displayed above.  The formal state remains
`P0_INVALIDATED`.
