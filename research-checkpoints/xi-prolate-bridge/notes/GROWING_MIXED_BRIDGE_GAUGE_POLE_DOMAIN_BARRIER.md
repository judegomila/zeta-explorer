# Growing mixed bridge gauge and pole-domain barrier theorem

## 0. Outcome and fail-closed boundary

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad Q\leq C_0L.                                      \tag{0.1}
\]

Let the real prolate modes be positive at the origin and put

\[
 d_n=1-\chi_n^2,\qquad I_n=\int_{-\lambda}^{\lambda}h_n(x)\,dx.
                                                               \tag{0.2}
\]

The two Fourier phases give

\[
 I_0=\chi_0h_0(0),\qquad I_2=-\chi_2h_2(0).             \tag{0.3}
\]

The missing mixed-prefix source is

\[
 b=c_2=h_2-\beta h_0,\qquad \beta={I_2\over I_0}.       \tag{0.4}
\]

This note proves the following precise barrier.

1. The raw bridge and every endpoint-sheared combination made from it and
   the anchor-two sources are legitimate zero-integral spectral radicals.
   The state-invisible origin bump leaves the compact central state and the
   complete spectral pairing unchanged.
2. The favorable defect ratio

\[
 {d_0\over d_2}\sim {1\over128\pi^2}\lambda^{-4}       \tag{0.5}
\]

   really does make the modal label-zero energy a small part of the exact
   raw exterior metric.  This remains true after the actual endpoint shear
   and with every bridge cross entry retained.
3. Nevertheless the bridge value at the origin is not defect-small:

\[
 \boxed{b(0)=h_2(0)\left(1+{\chi_2\over\chi_0}\right)
       \longrightarrow2h_2^{\rm Herm}(0)\ne0.}          \tag{0.6}
\]

   There is an explicit endpoint-null bridge column \(b^\#\) with

\[
 D_{\rm mod}(b^\#)=\Theta(d_2),\qquad
 b^\#(0)\longrightarrow2h_2^{\rm Herm}(0).             \tag{0.7}
\]

4. In the raw gauge, Poisson summation inserts

\[
 -b^\#(0)\beta_\lambda(u),\qquad
 \beta_\lambda(u)={{\bf1}_{\{u>\lambda\}}\over2\sqrt u}.
                                                               \tag{0.8}
\]

   This row is in \(L^2(du/u)\), but its pole evaluation diverges:

\[
 \boxed{
 \widehat\beta_\lambda(i/2)
 ={1\over2}\int_\lambda^\infty {du\over u}=+\infty.}   \tag{0.9}
\]

   Thus the raw spectral radical is not in the separated physical pole-row
   domain used by the ordered pole--Archimedean--prime Toeplitz ledger.
5. In the corrected gauge the pole row is regular, but the fixed bump has
   exterior energy

\[
 \boxed{
 D_{\rm bump}(b^\#)
 ={ |b^\#(0)|^2\over2\lambda}
   \int_{|\xi|\geq1/2}|\widehat\psi(\xi)|^2\,d\xi
 =\Theta(\lambda^{-1})\gg d_2.}                      \tag{0.10}
\]

Consequently the strict even and odd low-prefix floors do not presently
extend across \(b\).  Spectral gauge invariance does not authorize deleting
both the coherent beta row and the corrected bump from the explicit
physical form.  The missing result is a cutoff-uniform, complete-form
finite-part theorem for their full self and cross load, after the exact
endpoint shear and in the exact bridge metric, with negative cost
\(o(LD_{\rm mod})\).  On the bridge diagonal this means \(o(Ld_2)\).

This is a barrier theorem, not a negative-sign theorem.  It does not prove
that the desired mixed floor is false.  It proves no retained-complement,
determinant, zero, equation (5.2) of `DIRECT_RH_ATTACK.md`, or
Riemann-hypothesis conclusion.  The project state remains `P0_INVALIDATED`,
and the standard eight are unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md` | `23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0` |
| `tests/test_growing_low_prefix_outer_floor_assembly_theorem.py` | `634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311` |
| `notes/GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md` | `a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459` |
| `tests/test_growing_odd_low_prefix_outer_floor_transfer_theorem.py` | `c8a86e338762f00c32c04e9e300fc3398d4cbb084f16a1a530b77a16a1144bad` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `tests/test_growing_transition_equality_conductor_garding_theorem.py` | `61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba` |
| `notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md` | `544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c` |
| `notes/OUTER_NORMALIZATION_CANCELLATION_AUDIT.md` | `6acc76ec10a802197b873741293b56e9832e777cd41de4660e3d9b1d065a9af3` |
| `notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md` | `d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771` |
| `tests/test_fixed_label_six_odd_arithmetic_synthesis_gain.py` | `ad57055b3f4c0190e3021bead942e7b280624dae636ec8fe2339bdbe69e372c6` |
| `PROLATE_DEFECT_SOURCE_LOCK.json` | `0844df654ee968b1c371ec96618d10d219da9fde702d62faa4f0c6be139b036d` |
| `tests/test_prolate_defect_source_lock.py` | `7caa8d088522d68dc4dedfad8d00d8e5c7e15070065c743d9e2a41f9e7faa519` |

The first two theorem pairs are used only at their admitted scope.  In
particular, neither theorem contains the bridge.  The raw BV radical lemma
is used only for the complete spectral pairing; it is not promoted to a
separated pole-domain theorem.

## 2. Exact mixed exterior metric

For \(j\geq1\), write

\[
 p_j=h_{4j}-u_jh_0,\qquad u_j={I_{4j}\over I_0},       \tag{2.1}
\]

\[
 m_j=-h_{4j+2}+a_jh_2,\qquad
 a_j={I_{4j+2}\over I_2}.                              \tag{2.2}
\]

Let \(D_4=\operatorname {diag}(d_4,d_8,\ldots)\) and
\(D_T=\operatorname {diag}(d_6,d_{10},\ldots)\).  Exterior orthogonality of
the pure prolate modes gives the complete separated metric

\[
 \boxed{
 D_{\rm sep}^{\rm ext}=
 \begin{bmatrix}
 D_4+d_0uu^*&d_0\beta u&0\\
 d_0\beta u^*&d_2+d_0\beta^2&d_2a^*\\
 0&d_2a&D_T+d_2aa^*
 \end{bmatrix}.}                                      \tag{2.3}
\]

All quantities are real in the pinned convention.  Formula (2.3) retains
the even-family/bridge entry \(d_0\beta u\) and the bridge/odd-family entry
\(d_2a^*\).  If \(S_\eta\) is the actual triangular endpoint shear, then

\[
 D_{\rm sep}^{\#,\rm ext}=S_\eta^*D_{\rm sep}^{\rm ext}S_\eta.
                                                               \tag{2.4}
\]

No block entry may be deleted after (2.4).

The fixed-index defect formula is

\[
 d_n\sim {4\sqrt\pi\,8^n\over n!}
              c^{n+1/2}e^{-2c}.                      \tag{2.5}
\]

It gives (0.5), while \(\beta=O(1)\).  Thus for the raw bridge alone

\[
 D_{\rm mod}(b)=d_2+\beta^2d_0
 =d_2\{1+O(\lambda^{-4})\}.                           \tag{2.6}
\]

This favorable statement is genuine.  It is simply not a bound for the
Poisson boundary row.

## 3. Endpoint shear does not make the origin value small

Use the first anchor-two source

\[
 m_1=-h_6+a_6h_2,\qquad a_6={I_6\over I_2},           \tag{3.1}
\]

and the endpoint functional \(\eta(f)=f(\lambda)\).  Put

\[
 \gamma={\eta(b)\over\eta(m_1)},\qquad
 b^\#=b-\gamma m_1.                                   \tag{3.2}
\]

Then \(\eta(b^\#)=0\) exactly.  The pinned fixed-label endpoint law

\[
 h_n(\lambda)^2\sim2\pi\lambda d_n                   \tag{3.3}
\]

and (2.5) give

\[
 \eta(b)=\Theta(\sqrt{\lambda d_2}),\qquad
 \eta(m_1)=\Theta(\sqrt{\lambda d_6}),\qquad
 \gamma=\Theta\!\left(\sqrt{d_2/d_6}\right)
        =\Theta(\lambda^{-4}).                        \tag{3.4}
\]

In pure modal coordinates,

\[
 b^\#=-\beta h_0+(1-\gamma a_6)h_2+\gamma h_6.        \tag{3.5}
\]

Therefore

\[
 D_{\rm mod}(b^\#)
 =\beta^2d_0+|1-\gamma a_6|^2d_2+\gamma^2d_6
 =\Theta(d_2).                                        \tag{3.6}
\]

This calculation is the one-coordinate instance of the full congruence
(2.4); the bridge cross has not been omitted.

Let \(v_n=h_n(0)\).  From (0.3),

\[
 \beta=-{\chi_2v_2\over\chi_0v_0},\qquad
 b(0)=v_2\left(1+{\chi_2\over\chi_0}\right).          \tag{3.7}
\]

Similarly,

\[
 a_6={\chi_6v_6\over\chi_2v_2},\qquad
 m_1(0)=v_6\left({\chi_6\over\chi_2}-1\right)
       =O(d_6).                                        \tag{3.8}
\]

Equations (3.4) and (3.8) imply

\[
 \gamma m_1(0)=O(\sqrt{d_2d_6})=o(1).                \tag{3.9}
\]

Combining (3.2), (3.7), and (3.9) proves (0.7).  In particular,

\[
 { |b^\#(0)|^2\over D_{\rm mod}(b^\#)}\longrightarrow+\infty,
                                                               \tag{3.10}
\]

whereas both strict low-prefix proofs require a bound of the form

\[
 |f(0)|^2\leq {CL\over\lambda}D_{\rm mod}(f).          \tag{3.11}
\]

Thus the obstruction survives the exact endpoint-null shear.

## 4. What spectral gauge invariance does prove

Every vector in the span of \(b,p_j,m_j\) has zero integral.  The raw BV
radical theorem therefore gives, without assuming \(f(0)=0\),

\[
 \widehat{{\cal E}(f)}(z)
 =\zeta\!\left({1\over2}-iz\right)m_f(z),
 \qquad \operatorname {Im}z>-{1\over2}.              \tag{4.1}
\]

Both evaluations at every nontrivial-zero parameter vanish.  After compact
log-Fourier projection the polarized spectral-tail sum is absolutely
convergent.  Hence the raw endpoint-sheared bridge is a legitimate complete
spectral radical.

Let

\[
 \widetilde f=f-f(0)\psi(2\lambda\,\cdot),             \tag{4.2}
\]

where \(\psi\) is the locked even smooth bump with
\(\psi(0)=1\), zero integral, and support in \((-1,1)\).  The scaled bump is
supported inside \(|x|<1/(2\lambda)\).  Every central arithmetic sample has
\(nu\geq1/\lambda\), so

\[
 C_\lambda{\cal E}(\widetilde f)=C_\lambda{\cal E}(f)
                                                               \tag{4.3}
\]

exactly.  The bump itself is another zero-evaluation radical.  Thus the
compact central form and the complete spectral pairing are gauge-invariant.

What (4.3) does not prove is

\[
 {\cal W}_Z(O_{\rm modal},O_{\rm modal})
 =q_\lambda(X,X).                                      \tag{4.4}
\]

Indeed the two physical representatives are

\[
 O_{\rm raw}=O_{\rm modal}-f(0)J\beta_\lambda,
 \qquad
 O_{\rm corr}=O_{\rm modal}+O_{\rm bump}.             \tag{4.5}
\]

Only

\[
 O_{\rm bump}+f(0)J\beta_\lambda                      \tag{4.6}
\]

is the gauge difference with zero evaluations.  Neither term in (4.6) may
be discarded separately.  Therefore spectral gauge invariance preserves
the complete form in (4.5); it does not identify that form with the modal
Toeplitz block (4.4).

## 5. Exact pole-domain failure of the raw gauge

The raw Poisson formula for a time-limited zero-integral source contains
(0.8).  Its positive \(L^2\) norm is finite:

\[
 \|\beta_\lambda\|_{L^2(du/u)}^2
 ={1\over4}\int_\lambda^\infty {du\over u^2}
 ={1\over4\lambda}.                                   \tag{5.1}
\]

However the pole evaluation is (0.9).  In relative log-tail coordinates,
the same fact reads

\[
 B_\beta(s)=C\lambda^{-1/2}e^{-s/2},\qquad
 e^{s/2}B_\beta(s)=C\lambda^{-1/2}.                    \tag{5.2}
\]

Thus the pole row

\[
 \ell_\beta=\int_0^\infty e^{s/2}B_\beta(s)\,ds       \tag{5.3}
\]

does not exist.  This is not a failure of the spectral radical in Section
4.  It is a domain failure for the separated pole term in the explicit
physical distribution.  The strict odd theorem's identity
\(r=\sqrt\lambda\,\ell-\lambda^{-1/2}d\) cannot be applied to (5.2).

Accordingly, the raw bridge cannot be inserted into the existing ordered
pole--Archimedean--prime Toeplitz ledger.  Defining its complete pairing by
the compact form is legitimate, but then the modal Toeplitz lower bound no
longer represents the omitted finite part.

## 6. The corrected gauge is not a small modal perturbation

Fourier scaling in (4.2) gives

\[
 {\cal F}_a\{f(0)\psi(2\lambda\,\cdot)\}(v)
 ={f(0)\over2\lambda}
       \widehat\psi\!\left({v\over2\lambda}\right).   \tag{6.1}
\]

Therefore its exterior energy is exactly (0.10).  The integral in (0.10)
is strictly positive: a nonzero compactly supported smooth function cannot
have a Fourier transform which vanishes on both open rays
\(|\xi|>1/2\).

For \(f=b^\#\), the modal exterior norm is \(\Theta(\sqrt{d_2})\), while the
bump exterior norm is \(\Theta(\lambda^{-1/2})\).  The reverse triangle
inequality gives

\[
 \int_{|v|\geq\lambda}
 \left|{\cal F}_a\widetilde b^\#(v)\right|^2\,dv
 ={C_\psi|b^\#(0)|^2\over\lambda}\{1+o(1)\},
 \qquad C_\psi>0.                                      \tag{6.2}
\]

Hence

\[
 {D_{\rm corr}(b^\#)\over D_{\rm mod}(b^\#)}
 \asymp {1\over\lambda d_2}\longrightarrow+\infty.   \tag{6.3}
\]

There are only two consistent choices.

* If the declared comparison metric remains \(D_{\rm mod}\), the bump row
  is not an \(o(L)\) perturbation after whitening.
* If one replaces it by the corrected exterior metric, the new bridge
  direction is bump-dominated and the strict modal odd floor supplies no
  floor on that direction.

Neither choice yields the desired theorem from the current inputs.

## 7. Precise missing theorem

Let \(C_{\rm aug}^\#\) be the complete endpoint-sheared synthesis obtained by
adjoining \(b\) to the even and odd captured inventories.  Let

\[
 D_{\rm aug}^\#=(C_{\rm aug}^\#)^*
       \operatorname {diag}(d_n)C_{\rm aug}^\#        \tag{7.1}
\]

be the raw full exterior metric, including all entries in (2.3) after
congruence.  Let \(Q_{H,\rm modal}^\#\) denote the finite-Fejer modal
step-two ledger, and let \(Q_{H,\rm corr}^\#\) denote the complete corrected
physical ledger with the bump, pole, Archimedean, prime, reflected, and
every cross term included exactly once.

A sufficient missing gauge theorem is

\[
 \boxed{
 \sup_H\left\|
 \left[(D_{\rm aug}^\#)^{-1/2}
 (Q_{H,\rm corr}^\#-Q_{H,\rm modal}^\#)
 (D_{\rm aug}^\#)^{-1/2}\right]_-\right\|=o(L),}       \tag{7.2}
\]

with the ordered cutoff limit taken at fixed \(\lambda,Q\).  A one-sided
form statement equivalent to (7.2) is sufficient; no two-sided norm bound
is demanded.  On the endpoint-null bridge test \(b^\#\), (7.2) requires

\[
 \langle b^\#,
 (Q_{H,\rm corr}^\#-Q_{H,\rm modal}^\#)b^\#\rangle
 \geq-o(Ld_2),                                        \tag{7.3}
\]

together with the corresponding half-power cross control against every
old captured column.  Generic bump estimates give scales based on
\(\lambda^{-1}\), not \(d_2\), and therefore do not prove (7.2).

After (7.2), one would still have to transfer the complete central form to
the compact-projected form at the same raw-metric scale.  The existing
projection theorem uses (3.11), which fails on \(b^\#\), so that transfer is
not presently automatic either.

The exact triangular identity

\[
 c_{4j+2}=-m_j+{I_{4j+2}\over I_2}b                  \tag{7.4}
\]

would recover the ordinary mixed columns once the augmented floor and its
compact transfer were proved.  Equation (7.4) is algebra; it does not supply
the missing analytic estimate (7.2).

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_mixed_bridge_gauge_pole_domain_barrier -v

The regression checks the defect ratios, exact bridge metric, endpoint-null
counterdirection, spectral-gauge scope, beta pole divergence, bump scaling,
frozen hashes, fail-closed language, ASCII hygiene, and displayed TeX.
