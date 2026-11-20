# Mixed bridge Xi-over-s boundary obstruction theorem

## 0. Result and strict boundary

Use the locked prolate convention and put

\[
 b_\lambda=h_{2,\lambda}-{I_2\over I_0}h_{0,\lambda},
 \qquad I_n=\int_{-\lambda}^{\lambda}h_{n,\lambda}(x)\,dx .
                                                               \tag{0.1}
\]

The modes are phased positively at the origin.  Thus, with
`v_n=h_(n,lambda)(0)`,

\[
 I_0=\chi_0v_0,
 \qquad I_2=-\chi_2v_2,
 \qquad
 b_\lambda(0)=v_2\left(1+{\chi_2\over\chi_0}\right). \tag{0.2}
\]

This note proves five narrow statements.

1. The raw zero-integral bridge and the locked invisible-origin correction
   have the exact Mellin factors in Section 2.  The correction cancels the
   source-origin pole at `s=0`, but it does not cancel the critical-line
   arithmetic profile.
2. In the fixed-Hermite limit, the raw bridge has exact sampling transform

   \[
    \boxed{\zeta(s)B_\infty(s)=-2^{3/4}{\xi(s)\over s}.} \tag{0.3}
   \]

   It is a nonzero Xi-over-s sampling radical.
3. Its inversion-even and inversion-odd centered carriers are

   \[
    \boxed{\Phi_+(z)={1\over1/4-z^2},\qquad
           \Phi_-(z)={z\over1/4-z^2}.}                \tag{0.4}
   \]

   Neither carrier vanishes at a centered nontrivial zero in the open
   critical strip.  The separately defined carrier responses in Section 4
   are bounded exactly if the Riemann hypothesis holds.  A defect-scale
   decaying estimate for either separate response is impossible.  This is
   an RH-strength obstruction to separating the bridge boundary row; it is
   not a proof of RH and is not a claim that the complete coherent bridge
   form is negative or lacks a floor.
4. Imposing both zero integral and zero origin on the full even prefix gives
   an explicit `2Q`-dimensional space.  It retains the two separated residue
   families in the Hermite limit but loses exactly the one bridge dimension.
5. Adding point evaluation to the exterior metric cannot both control the
   bump at its natural scale and retain the existing modal quarter floor.

The nontrivial-zero spectral form is invariant under adding the locked bump.
That fact licenses a change of representative only while the raw modal and
Poisson boundary rows remain coherent.  It does not identify the raw
pole--Archimedean--prime pieces separately.  The earliest missing input is a
cancellation-preserving Plemelj/closability theorem for that complete raw
row.  No existing frozen package or standard-eight file is changed.

## 1. Frozen inputs and conventions

The following repository bytes fix the conventions used here.

| Dependency | SHA-256 |
|---|---|
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `tests/test_growing_transition_equality_conductor_garding_theorem.py` | `61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba` |
| `notes/CENTERED_ZERO_BOUNDARY_CONVOLUTION_OBSTRUCTION.md` | `c9b4513fb0afa57a396f3c1bf7326bb94969d4c8d51a245ea66fa64c1889061e` |
| `notes/GROWING_TRANSITION_HADAMARD_PICK_CARRIER_RH_EQUIVALENCE_THEOREM.md` | `092d0adefb7bafea8d931a2741299d19feef2a45ccc3d243c3543765fdf5cff7` |
| `tests/test_growing_transition_hadamard_pick_carrier_rh_equivalence_theorem.py` | `d15fff20bc0aa62ad63903b6c17e64b11ecba3ab965f179c82086e261c398b43` |
| `notes/PROLATE_DEFECT_SOURCE_AUDIT.md` | `b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d` |
| `notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md` | `544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c` |

Use

\[
 \xi(s)={1\over2}s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s),
 \qquad \Xi(t)=\xi(1/2+it),                            \tag{1.1}
\]

and

\[
 ({\cal E}f)(u)=u^{1/2}\sum_{n\geq1}f(nu),
 \qquad
 M_f(s)=\int_0^\infty f(x)x^{s-1}\,dx.               \tag{1.2}
\]

The strengthened raw BV radical lemma in the frozen equality-conductor
theorem proves that an even, compactly supported BV source with zero
integral needs no origin condition for its evaluations at nontrivial zeros.
It also states the limitation used below: the raw Poisson outer bracket then
contains the coherent row `-f(0) beta_lambda`, which is not part of the raw
Fourier-sampler equality subsystem.

The frozen Hadamard--Pick theorem is not reproved here.  It concerns global
Hermitian positivity of the divided-difference kernel of `-Xi'/Xi` on the
upper half-plane.  The present theorem proves no kernel positivity.  It
computes one fixed bridge source, its scalar even/odd boundary carriers, and
the Landau--Laplace boundedness obstruction for their separately defined
responses.  Passing between those two statements would itself require the
physical carrier identification which is missing in Section 5.

## 2. Exact raw and corrected bridge profiles

Let

\[
 B_\lambda(s)=M_{b_\lambda}(s)
 =\int_0^\lambda b_\lambda(x)x^{s-1}\,dx .            \tag{2.1}
\]

Initially for `Re(s)>1`, Mellin summation and the substitution `x=nu` give

\[
 \boxed{
 \int_0^\infty({\cal E}b_\lambda)(u)u^{s-1/2}{du\over u}
 =\zeta(s)B_\lambda(s).}                              \tag{2.2}
\]

Since `b_lambda` is bounded at zero and has zero integral, the raw BV
radical lemma continues (2.2) through `Re(s)>0`; both nontrivial-zero
evaluations vanish.  Near `s=0`, however,

\[
 B_\lambda(s)={b_\lambda(0)\over s}
                 +B_\lambda^{\rm fp}+O(s).            \tag{2.3}
\]

Let `psi` be the locked even smooth bump, with `psi(0)=1`,
`integral_R psi=0`, and support in `[-1,1]`, and put

\[
 \psi_\lambda(x)=\psi(2\lambda x),
 \qquad
 \widetilde b_\lambda=b_\lambda-b_\lambda(0)\psi_\lambda.
                                                               \tag{2.4}
\]

If

\[
 \Psi(s)=\int_0^1\psi(x)x^{s-1}\,dx,                 \tag{2.5}
\]

then scaling gives the exact identities

\[
 \boxed{
 {\cal E}(\widetilde b_\lambda)(u)
 ={\cal E}(b_\lambda)(u)
 -{b_\lambda(0)\over\sqrt{2\lambda}}
       ({\cal E}\psi)(2\lambda u),}                  \tag{2.6}
\]

\[
 \boxed{
 M_{\widetilde b_\lambda}(s)
 =B_\lambda(s)-b_\lambda(0)(2\lambda)^{-s}\Psi(s).} \tag{2.7}
\]

For `u in [lambda^(-1),lambda]`, every argument `2lambda*n*u` lies
outside the support of `psi`; hence the second term in (2.6) is exactly
state-invisible.  Moreover,

\[
 \Psi(s)={1\over s}+\Psi^{\rm fp}+O(s).              \tag{2.8}
\]

Equations (2.3), (2.7), and (2.8) show exactly what the correction does:

\[
 \boxed{
 M_{\widetilde b_\lambda}(0)
 =B_\lambda^{\rm fp}-b_\lambda(0)\Psi^{\rm fp}
   +b_\lambda(0)\log(2\lambda).}                    \tag{2.9}
\]

Thus the `s=0` poles cancel, but a logarithmic finite part remains.  On the
critical line `Re(s)=1/2`, the correction in (2.7) is a translated fixed
sampling radical with `L2` scale `O(lambda^(-1/2))` before exterior-defect
whitening.  It cannot cancel a nonzero fixed limiting profile.

The exact Poisson identity makes the same distinction in physical space.
For a time-limited zero-integral source `f`,

\[
 (1-C_\lambda){\cal E}(f)
 =J\left[T_\lambda(1-P_\lambda^a)\widehat f_a
              -f(0)\beta_\lambda\right],
 \qquad
 \beta_\lambda(u)={{\bf1}_{u>\lambda}\over2\sqrt u}.
                                                               \tag{2.10}
\]

The corrected representative removes the displayed beta row by replacing
the Fourier tail with that of `f-f(0)psi_lambda`.  No identity permits
deleting both rows.  Equations (2.6)--(2.10) merely exchange two radical
representatives outside the central window.

## 3. The exact Xi-over-s limit and centered carriers

In the locked Hermite convention,

\[
 h_0(x)=2^{1/4}e^{-\pi x^2},
 \qquad
 h_2(x)=2^{-1/4}(1-4\pi x^2)e^{-\pi x^2}.             \tag{3.1}
\]

Here `h_2` is phased positively at zero and has additive Fourier sign
minus.  Since `h_2(0)/h_0(0)=2^(-1/2)`, the bridge limit is

\[
 b_\infty(x)=h_2(x)+2^{-1/2}h_0(x)
 =2^{3/4}(1-2\pi x^2)e^{-\pi x^2}.                   \tag{3.2}
\]

Direct Gaussian integration gives

\[
 \boxed{
 B_\infty(s)=\int_0^\infty b_\infty(x)x^{s-1}\,dx
 =2^{-1/4}(1-s)\pi^{-s/2}\Gamma(s/2).}               \tag{3.3}
\]

Using (1.1),

\[
 \boxed{
 \zeta(s)B_\infty(s)
 =-2^{3/4}{\xi(s)\over s}.}                           \tag{3.4}
\]

The factor `1/s` is the source-origin pole.  The factor `xi(s)` makes the
profile a nontrivial-zero sampling radical; those are different facts.
The shrinking correction in Section 2 removes the former at each finite
`lambda`, but tends to zero on the critical line and does not remove the
latter limiting function.

Let `K(y)=({\cal E}b_infty)(e^y)` and

\[
 S_+K(y)={K(y)+K(-y)\over2},
 \qquad
 S_-K(y)={K(y)-K(-y)\over2}.                           \tag{3.5}
\]

For centered `z`, the functional equation and (3.4) give

\[
 \boxed{
 \int_{\mathbb R}S_+K(y)e^{-zy}\,dy
 =-2^{-1/4}{\xi(1/2+z)\over1/4-z^2},}                 \tag{3.6}
\]

\[
 \boxed{
 \int_{\mathbb R}S_-K(y)e^{-zy}\,dy
 =-2^{3/4}{z\,\xi(1/2+z)\over1/4-z^2}.}              \tag{3.7}
\]

This proves (0.4).  In the open strip `|Re(z)|<1/2`, `Phi_+` has no zero,
while `Phi_-` has only the zero `z=0`.  Since `xi(1/2)>0`, `z=0` is not a
centered nontrivial zero.

## 4. The separate carrier response is RH-equivalent

Let `Z_c` be the centered nontrivial-zero multiset, and let `P` be its
multiset quotient under `z -> -z`.  Choose either representative `z_p` in
each orbit.  Define

\[
 \mathcal B_+(a)
 =-2\sum_{p\in P}\Phi_+(z_p)
             {\sinh(az_p)\over z_p},                 \tag{4.1}
\]

and

\[
 \mathcal B_-(a)
 =-2\sum_{p\in P}\Phi_-(z_p)
             {\cosh(az_p)\over z_p}.                 \tag{4.2}
\]

Both summands are unchanged by replacing `z_p` with `-z_p`.  The classical
zero-counting bound and

\[
 \Phi_+(z)=O(|z|^{-2}),
 \qquad \Phi_-(z)=O(|z|^{-1})                         \tag{4.3}
\]

make (4.1)--(4.2) absolutely convergent for each fixed `a`.

### Theorem 4.1 (bounded separate bridge carrier iff RH)

For either sign,

\[
 \boxed{
 \sup_{a>A}|\mathcal B_\pm(a)|<\infty
 \quad\Longleftrightarrow\quad
 \text{every nontrivial zeta zero lies on the critical line}.} \tag{4.4}
\]

**Proof.**  If every centered zero is `i gamma`, then `sinh(i gamma a)` and
`cosh(i gamma a)` are bounded.  Equations (4.1)--(4.3) are uniformly
majorized respectively by convergent `sum |gamma|^(-3)` and
`sum |gamma|^(-2)` series.

Conversely, boundedness makes the Laplace transform in `a` holomorphic in
`Re(w)>0`.  Termwise integration, initially in `Re(w)>1/2`, gives the same
meromorphic continuation as Theorem 5.1 of the frozen centered-zero
obstruction.  At a centered zero `z` with positive real part, its residue is

\[
 \boxed{-{m(z)\Phi_\pm(z)\over z},}                   \tag{4.5}
\]

where `m(z)` is its algebraic multiplicity.  Equations (0.4) and (3.6)--
(3.7) make this residue nonzero.  Hence no off-line orbit can exist.
`square`

The lower-limit correction in the Laplace transform is entire and cannot
remove (4.5).  The locked bump has a zeta factor and vanishes at every
centered nontrivial zero, so adjoining it does not change these carrier
residues.  Therefore a proof that first separates this beta/bump carrier and
then bounds it uniformly would already contain an RH-strength input.

There is a sharper scale obstruction.  With `lambda=e^a`, fixed-index
defect asymptotics give

\[
 Ld_2\asymp a\,e^{5a}e^{-4\pi e^{2a}}.               \tag{4.6}
\]

This decays faster than `e^(-eta a)` for every fixed `eta>0`.  The
meromorphic proof of Theorem 5.1 would then force `Phi_\pm` to vanish at
every centered zero, including critical-line zeros.  Since the carriers do
not vanish there and nontrivial zeros exist, neither separate response can
be `O(Ld_2)`, or `o(Ld_2)`.  This does not preclude cancellation with the
modal row in the complete unsplit form.

## 5. Exact gauge invariance and the missing physical identity

The raw BV radical lemma applies to `b_lambda`: zero integral alone makes
`E(b_lambda)` a two-sided nontrivial-zero spectral radical.  It also applies
to the scaled bump.  Since the bump is invisible on the central interval,
the compact vector `p` is unchanged.  Thus the corrected and uncorrected
remainders have exactly the same nontrivial-zero rows and the same spectral
quadratic form.

This is a spectral statement, not a separate-distribution statement.  The
uncorrected Mellin factor has the pole (2.3), and its Poisson decomposition
contains (2.10).  The frozen equality-conductor theorem proves a floor for
the raw Fourier-sampler equality form but explicitly excludes beta self and
cross terms.  Conversely, the corrected pole--Archimedean--prime form is in
the admitted codimension-two domain, but its bump row is not small on the
bridge in the modal exterior metric.

Consequently the exact missing theorem is a common finite-part identity of
the following type:

\[
 \operatorname {FP}_{s=0}
 \{W_{0,2}-W_{\mathbb R}-W_p\}
   (O_{b,\rm modal}-b_\lambda(0)O_\beta)^2
 =\langle ZO_b,\Sigma ZO_b\rangle,                   \tag{5.1}
\]

formed before splitting the pole, Archimedean, and prime distributions,
together with a defect-relative lower bound for the coherent left side.
Equation (5.1) is schematic about polarization but exact about the required
order of operations.  No frozen theorem supplies this Plemelj/closability
extension.  Theorem 4.1 shows why estimating `O_beta` separately cannot be
its replacement.

## 6. The codimension-two modal escape

Use all labels

\[
 \{0,2,4,\ldots,4Q+2\},                               \tag{6.1}
\]

and retain `v_n=h_(n,lambda)(0)`.  The two anchor rows are independent
because

\[
 \Delta=I_0v_2-I_2v_0
 =v_0v_2(\chi_0+\chi_2)>0.                            \tag{6.2}
\]

For each even `n` with `4<=n<=4Q+2`, put

\[
 A_n={I_nv_2-I_2v_n\over\Delta},
 \qquad
 B_n={I_0v_n-v_0I_n\over\Delta},                     \tag{6.3}
\]

\[
 g_n=h_n-A_nh_0-B_nh_2.                               \tag{6.4}
\]

Direct substitution gives

\[
 \boxed{\int g_n=0,\qquad g_n(0)=0.}                 \tag{6.5}
\]

Each `g_n` has a unique coefficient one on `h_n`; hence these `2Q` columns
are independent.  By (6.2), the two constraints have rank two, so

\[
 \boxed{
 \operatorname {span}\{g_4,g_6,\ldots,g_{4Q+2}\}
 =\ker I\cap\ker v,
 \qquad \dim(\ker I\cap\ker v)=2Q.}                 \tag{6.6}
\]

The single zero-integral hyperplane has dimension `2Q+1`; the origin-null
condition therefore removes exactly one direction.  In the Hermite limit,

\[
 \begin{array}{lll}
 n=0\pmod4:& A_n\longrightarrow v_n/v_0,&B_n\longrightarrow0,\\
 n=2\pmod4:& A_n\longrightarrow0,&B_n\longrightarrow v_n/v_2.
 \end{array}                                           \tag{6.7}
\]

Thus (6.6) tends exactly to the direct sum of the two separated residue
families.  It preserves both captured parity prefixes but not the bridge
quotient represented by `c_2`.

## 7. Augmented-metric incompatibility

Consider the strengthened modal metric

\[
 D_\mu(f)=D(f)+\mu_\lambda|f(0)|^2.                   \tag{7.1}
\]

The locked bump has

\[
 \|f(0)\psi(2\lambda\,\cdot)\|_2^2
 ={|f(0)|^2\over2\lambda}\|\psi\|_2^2.              \tag{7.2}
\]

Uniformly controlling its raw Hilbert and conductor rows therefore needs
the natural scale

\[
 \mu_\lambda\gtrsim\lambda^{-1}                     \tag{7.3}
\]

(with a further factor `L` appearing in the conductor form itself).  On the
bridge, however,

\[
 |b_\lambda(0)|\asymp1,
 \qquad D(b_\lambda)\asymp d_2,
 \qquad d_2\asymp\lambda^5e^{-4\pi\lambda^2}.         \tag{7.4}
\]

The existing modal quarter floor is proportional to `L D`.  For it to be a
comparable floor in `D_mu` along the bridge would require

\[
 \mu_\lambda\lesssim d_2.                             \tag{7.5}
\]

Equations (7.3)--(7.5) are incompatible.  Choosing the stronger metric is
legitimate, but then the bridge floor must come from a new signed theorem
for the Xi-over-s radical; it cannot be inherited from the modal Toeplitz
floor.

## 8. Fail-closed conclusion

The locked bump is a nontrivial-zero radical gauge, and the raw bridge is
also a nontrivial-zero radical.  This exact cancellation does not occur
inside any one of the pole, Archimedean, prime, beta, or modal rows.  The
Xi-over-s formula and Theorem 4.1 show that separating the beta carrier asks
for an RH-strength estimate.  The codimension-two modal space avoids the
carrier but loses precisely the bridge.  The augmented metric controls the
carrier only by abandoning the known quarter-floor scale.

Accordingly this note proves an obstruction and identifies the earliest
missing identity (5.1).  It proves no complete mixed-prefix floor, retained
half-power complement theorem, determinant limit, zero theorem, or Riemann
hypothesis.  The project state remains `P0_INVALIDATED`, and the standard
eight are unchanged.

The standard eight are unchanged.
