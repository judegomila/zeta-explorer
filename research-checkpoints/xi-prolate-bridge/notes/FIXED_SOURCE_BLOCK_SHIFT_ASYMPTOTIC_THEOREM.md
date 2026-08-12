# Fixed source-block shift asymptotics and Fourier-cutoff boundary

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda,
 \qquad N_{\rm proj}=2^{2400p^2}=2^{9600\lambda^2}.       \tag{0.1}
\]

Let `p_4` be the actual unscaled label-4 compact anchor, put

\[
 a_4^{\rm phys}=\|p_4\|_2,\qquad
 \kappa={p_4\over a_4^{\rm phys}},\qquad
 q=\langle\kappa,Q_+\kappa\rangle,                    \tag{0.2}
\]

and let

\[
 K_4={\cal E}(q_4),\qquad A_4=\|K_4\|_2>0.             \tag{0.3}
\]

Thus `a_4^phys -> A_4`.  The superscript in (0.2) distinguishes this
norm from the fixed source coefficient
`sqrt(3)/2^(11/4)`.  Multiplying the anchor by that coefficient changes
neither `kappa` nor `q`.

For `r in Z`, define

\[
 \Gamma_r={1\over2\pi}\sum_{n\geq1}{1\over n}
       \int_0^{\arcsin(1/n)}\cos(4r\beta)\,d\beta,     \tag{0.4}
\]

and let `T_m=(Gamma_(j-k))_(0<=j,k<m)`.  If `m=1`, put
`tau_m=Gamma_0`.  If `m>=2`, write

\[
 T_m=\begin{pmatrix}\Gamma_0&g_m^*\\g_m&T_{R,m}\end{pmatrix},
 \qquad
 \tau_m=\Gamma_0-g_m^*T_{R,m}^{-1}g_m.                \tag{0.5}
\]

The exact Toeplitz representation gives

\[
 T_m\succeq {1\over4}I_m,\qquad \tau_m\geq{1\over4}. \tag{0.6}
\]

Fix `m` independently of `lambda`.  Let `V_(+,m)` be the physical span of
the actual anchor-deflated columns with labels

\[
 8,12,\ldots,4m+4,                                    \tag{0.7}
\]

and let `V_(-,m)` be the physical span of the actual anchor-two odd
columns with labels

\[
 6,10,\ldots,4m+2.                                    \tag{0.8}
\]

The first span lies in `kappa^perp` in the physical inversion-even sector.
The second lies in the physical inversion-odd sector.  Define the smallest
unshifted physical Ritz values on these spans by

\[
 \mu_{+,m}=\lambda_{\min}(Q_+|_{V_{+,m}}),\qquad
 \mu_{-,m}=\lambda_{\min}(Q_-|_{V_{-,m}}).             \tag{0.9}
\]

Let `W_(8,infinity)` be the limiting label-8 column after orthogonal
deflation by `K_4`, and let `K_6` be the limiting odd label-6 column.  Then

\[
 \boxed{{q\over d_4L}\longrightarrow
              {\Gamma_0\over A_4^2},}                 \tag{0.10}
\]

\[
 \boxed{{\mu_{+,m}\over d_8L}\longrightarrow
              {\tau_m\over\|W_{8,\infty}\|_2^2}>0,} \tag{0.11}
\]

\[
 \boxed{{\mu_{-,m}\over d_6L}\longrightarrow
              {\tau_m\over\|K_6\|_2^2}>0.}          \tag{0.12}
\]

The defect ratios are

\[
 {d_8\over d_4}\sim{4096\pi^4\over105}\lambda^8,
 \qquad
 {d_6\over d_4}\sim{128\pi^2\over15}\lambda^4,
 \qquad
 {d_6\over d_8}\sim{7\over32\pi^2}\lambda^{-4}.   \tag{0.13}
\]

Consequently

\[
 \boxed{\mu_{+,m}-q>0,\qquad \mu_{-,m}-q>0}           \tag{0.14}
\]

eventually for every fixed `m`.

The frozen normalized absolute-sampling shift is nonnegative and satisfies

\[
 0\leq q\leq U_Z,\qquad U_Z=o(d_6).                   \tag{0.15}
\]

Therefore the stronger conclusions are

\[
 {U_Z\over\mu_{+,m}}=o\!\left({\lambda^{-4}\over L}\right),
 \qquad
 {U_Z\over\mu_{-,m}}=o(L^{-1}),                       \tag{0.16}
\]

and hence

\[
 \boxed{\mu_{+,m}-U_Z>0,\qquad
        \mu_{-,m}-U_Z>0}                              \tag{0.17}
\]

eventually on the same locked schedule.

Equations (0.14) and (0.17) are only restricted-source statements.  They
do not prove either sign on the whole physical even complement or the whole
physical odd sector.  The captured source ranges are not proved to be
surjective, dense graph cores, or reducing subspaces.  They do not control
the retained multiplier-dangerous complement.  No numerical value of
`lambda`, no determinant limit, no zero statement, and no Riemann hypothesis
conclusion is certified.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/FIXED_PREFIX_COMPLETE_SIGNED_TOEPLITZ_SCHUR_THEOREM.md` | `c69d6d1a69f71548aa9291c5d261117ac913f2851df8f8fcc2f186c8bd530314` |
| `notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md` | `9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71` |
| `notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md` | `d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771` |
| `notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md` | `23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0` |
| `notes/GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md` | `a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459` |
| `notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md` | `1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032` |
| `notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` | `3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/Q_SHIFT_SECTOR_WEIL_CORE_GATE.md` | `78e0b9a7c3512bcd2b5fe34d48594734b6323fc57ca55db5e4090d6d6a277fb3` |

The fixed even synthesis and fixed-prefix theorems supply the physical Gram
limit and the complete signed even Toeplitz matrix, including both
compact-projection orientations.  The label-8 and label-6 theorems supply
the exact first-direction limits and first-defect metrics.  The odd transfer
theorem supplies the residue-two same-phase Toeplitz ledger, the reversed
reflected sign, and the negative odd pole estimate.  The projected-state
theorem supplies (0.15).  The growing theorems are used only in Section 7 to
state the precise fixed-to-growing boundary.

## 2. Ground quotient

Let `R_4` be the complete radical remainder of the unscaled label-4 anchor,
and let `D_4` be its exact scalar exterior defect.  Polarized radicality
gives

\[
 q={\mathcal W_Z(R_4,R_4)\over\|p_4\|_2^2}.           \tag{2.1}
\]

The fixed-prefix diagonal theorem gives

\[
 {\mathcal W_Z(R_4,R_4)\over D_4\log c}
      \longrightarrow\Gamma_0,\qquad
 {D_4\over d_4}\longrightarrow1.                    \tag{2.2}
\]

The fixed source convergence gives `||p_4|| -> A_4`, while
`log(c)/L -> 1`.  Substitution in (2.1) proves (0.10).  In particular, the
ground quotient is positive eventually.  This is a `d_4 L` statement, not
the much coarser `o(d_6)` upper bound in (0.15).

If the source-normalized anchor is written as

\[
 h_\lambda={\sqrt3\over2^{11/4}}q_{4,\lambda},
\]

then its limiting norm is
`a_infinity=(sqrt(3)/2^(11/4))*A_4`.  Thus (0.10) is equivalently

\[
 {q\over d_4L}\longrightarrow
 {3\Gamma_0\over2^{11/2}a_\infty^2}.                 \tag{2.3}
\]

The two forms differ only by the declared anchor normalization.

## 3. A fixed anisotropic Toeplitz eigenvalue lemma

For either corrected zero-integral column family below, polarized exact
radicality identifies `H_lambda` with the matrix of the physical signed
operator `Q_+` or `Q_-` on the compact columns, while `G_lambda` is their
ordinary physical Gram.  Thus the generalized eigenvalue in this section
is exactly the restricted physical Ritz value, not an exterior-metric
surrogate.

Let `t_0<t_1<...<t_(m-1)` be fixed labels separated by four, let

\[
 D_\lambda=\operatorname {diag}(D_{t_0},\ldots,D_{t_{m-1}}),
 \qquad {D_{t_j}\over d_{t_j}}\longrightarrow1,       \tag{3.1}
\]

and suppose

\[
 D_\lambda^{-1/2}H_\lambda D_\lambda^{-1/2}
       =LT_m+o_m(L).                                   \tag{3.2}
\]

Let the physical Gram satisfy `G_lambda -> G_infinity>0`.  The fixed defect
hierarchy gives

\[
 {d_{t_0}\over d_{t_j}}\longrightarrow0
 \quad(j\geq1).                                       \tag{3.3}
\]

Partition (3.2) after its first coordinate.  At spectral scale
`z=O(d_(t_0)L)`, the rest block has inverse

\[
 H_{RR}^{-1}={1\over L}D_R^{-1/2}T_{R,m}^{-1}D_R^{-1/2}
            +o_m(L^{-1}D_R^{-1}).                     \tag{3.4}
\]

The Schur complement is therefore

\[
 H_{00}-H_{0R}H_{RR}^{-1}H_{R0}
      =d_{t_0}L\{\tau_m+o_m(1)\}.                    \tag{3.5}
\]

The minimizing rest coefficient is
`O_m(sqrt(d_(t_0)/d_(t_1)))` relative to the first coefficient.  Hence its
contribution to the physical denominator vanishes and

\[
 x^*G_\lambda x=\{(G_\infty)_{00}+o_m(1)\}|x_0|^2.  \tag{3.6}
\]

All other generalized eigenvalues are larger by at least the next defect
ratio.  Equations (3.5)--(3.6) prove

\[
 \boxed{
 {\lambda_{\min}(H_\lambda,G_\lambda)\over d_{t_0}L}
 \longrightarrow{\tau_m\over(G_\infty)_{00}}.}       \tag{3.7}
\]

This is the reason the leading constant is a Toeplitz Schur reserve, not
the smallest Euclidean eigenvalue of `T_m`.

## 4. Fixed even complement

For the actual deflated columns `W_8,W_12,...`, the frozen fixed-prefix
theorem gives (3.2) with `t_0=8` and with the Toeplitz matrix (0.4).
The fixed even-prefix synthesis theorem gives

\[
 G_{+,m,\lambda}\longrightarrow G_{+,m,\infty}>0,
 \qquad (G_{+,m,\infty})_{00}=\|W_{8,\infty}\|_2^2. \tag{4.1}
\]

Apply (3.7) to obtain (0.11).  The deflation is physical orthogonal
deflation by `p_4`; consequently every vector in this span is exactly
orthogonal to `kappa`, not merely asymptotically so.

## 5. Fixed odd block

Use the positive-at-origin residue-two convention

\[
 {\cal F}h_n=-\chi_nh_n,
 \qquad n=2,6,10,\ldots .                              \tag{5.1}
\]

The actual zero-integral columns are

\[
 q^-_{4j+2,\lambda}
  =-h_{4j+2,\lambda}+{I_{4j+2}\over I_2}h_{2,\lambda},
 \qquad j\geq1.                                      \tag{5.2}
\]

This use of the word `odd` is physical inversion parity, not parity in the
source variable: every Hermite source displayed here is even in `x`.
Labels `0 mod 4` have the positive Fourier phase and their zero-integral
arithmetic images are inversion even.  Labels `2 mod 4` in (5.1) have the
negative Fourier phase; because (5.2) combines only that one phase, their
arithmetic images are inversion odd.  The symmetric central restriction
and the locked log-Fourier projection commute with inversion, so this
parity statement is exact after compact projection.

For completeness, the fixed odd physical Gram needed below is not inferred
from the exterior floor.  The generic fixed-index quasimode calculation in
the fixed even synthesis theorem is parity-free up to its Fourier-phase
step.  For each fixed `t=4j+2`, use

\[
 \mu_t=-{2t^2+2t+3\over4},\qquad
 u_t={\sqrt{t(t-1)(t-2)(t-3)}\over64\pi}h_{t-4}
 -{\sqrt{(t+1)(t+2)(t+3)(t+4)}\over64\pi}h_{t+4}.
\]

The exact identity

\[
 (A_\epsilon-E_t-\epsilon\mu_t)(h_t+\epsilon u_t)
       =\epsilon^2(V-\mu_t)u_t,
 \qquad \epsilon=\lambda^{-2},
\]

the fixed oscillator gap, and the same local elliptic point-value estimate
give the mode and origin value through error `O_t(lambda^(-4))`.
Using `I_t=-chi_t h_(t,lambda)(0)` in the anchor ratio then gives

\[
 q^-_{t,\lambda}=q^-_t+\lambda^{-2}q^-_{t,1}
                    +O_t(\lambda^{-4})\quad\hbox{in }L^2. \tag{5.3}
\]

The arithmetic transfer loses one power of `lambda`, the fixed
polynomial--Gaussian tails are superpolynomially small, and the locked
periodic projection error is superpolynomially small.  The state-invisible
origin bump has exactly zero central arithmetic image.  Hence the actual
compact columns satisfy

\[
 p^-_t=K^-_t+\lambda^{-2}K^-_{t,1}+O_t(\lambda^{-3})
       \quad\hbox{in }L^2.                            \tag{5.4}
\]

Their limiting Mellin transforms have the triangular form

\[
 Q^-_{4j+2}(s)=Q_6(s)P_{j-1}(s(s-1)),
 \qquad \deg P_{j-1}=j-1,                             \tag{5.5}
\]

with nonzero leading coefficient.  Indeed the normalized Hermite Mellin
polynomial has degree `2j+1`; zero value and zero integral supply
`s(s-1)`, Fourier anti-invariance supplies `2s-1`, and the remaining
factor is invariant under `s -> 1-s`.  Distinct degrees in (5.5) prove
linear independence of the limiting physical columns.  Thus

\[
 G_{-,m,\lambda}\longrightarrow G_{-,m,\infty}>0,
 \qquad (G_{-,m,\infty})_{00}=\|K_6\|_2^2.           \tag{5.6}
\]

To pass from the frozen full-metric odd ledger to diagonal defect
coordinates, let `C_(-,m)` be the coefficient matrix of (5.2) in the pure
inventory `2,6,...,4m+2`, and put

\[
 D_{\rm full}=C_{-,m}^*\operatorname {diag}
       (d_2,d_6,\ldots,d_{4m+2})C_{-,m},\qquad
 D_0=\operatorname {diag}(d_6,d_{10},\ldots,d_{4m+2}). \tag{5.7}
\]

The anchor-two ratios are bounded.  The fixed defect hierarchy therefore
gives

\[
 D_0^{-1/2}D_{\rm full}D_0^{-1/2}=I+o_m(1),
 \qquad
 \operatorname {diag}(\sqrt d)C_{-,m}D_0^{-1/2}
       \longrightarrow-E_m,                           \tag{5.8}
\]

where `E_m` inserts the principal pure coordinates `6,10,...,4m+2`.
For fixed depth, the exact odd transfer ledger has the same common-sample
Toeplitz matrix as the even family.  The common residue-two phase cancels.
Its centered multiplier, equality prime, non-equality prime, reciprocal,
symmetric, and compact-projection remainders are `o_m(L)` in full-metric
operator norm.  The two sign-sensitive odd reflected rows are negative but
`o_m(1)`.  Undoing its full-metric whitening and using (5.8) consequently
gives

\[
 D_0^{-1/2}H_{-,m}D_0^{-1/2}=LT_m+o_m(L).             \tag{5.9}
\]

The endpoint shear is an invertible congruence with the full pulled-back
metric, so it changes neither the physical range nor the generalized
eigenvalues.  Equation (5.8), not a discarded full-metric cross, shows that
the limiting compression in (5.9) is exactly the principal `T_m` used in
(3.7).  Applying that lemma proves (0.12).

This exact parity separation does not apply to the ordinary
ground-anchored residue-two column.  With

\[
 b=h_2-{I_2\over I_0}h_0,
\]

that column is `-q^-_t+(I_t/I_2)b` and mixes the two Fourier phases through
the bridge `b`.  Nor does commutation of compact projection with inversion
say that the chosen cutoff resolves the exponentially small defects or
that either captured range exhausts its physical parity sector.

## 6. Exact first-direction constants

The constants in (0.10)--(0.12) can be written without an unknown source
normalization.  With `s=1/2-i xi`, the fixed Hermite Mellin identities give

\[
 \widehat K_4(\xi)={2^{1/4}\sqrt6\over3}\Xi(\xi),
 \qquad
 \widehat K_6(\xi)=-{2i\xi\over\sqrt{30}}
                       \widehat K_4(\xi),              \tag{6.1}
\]

\[
 \widehat K_8(\xi)={1\over2\sqrt{105}}
       \left({45\over2}-2\xi^2\right)\widehat K_4(\xi). \tag{6.2}
\]

Let `nu` be the probability measure

\[
 d\nu(\xi)={|\widehat K_4(\xi)|^2d\xi
       \over2\pi A_4^2},                              \tag{6.3}
\]

and put

\[
 M_2=\int\xi^2d\nu(\xi),\qquad
 V_2=\int(\xi^2-M_2)^2d\nu(\xi).                     \tag{6.4}
\]

Both are strictly positive.  Plancherel and orthogonal deflation give

\[
 \boxed{\|K_6\|_2^2={2\over15}A_4^2M_2,
 \qquad
 \|W_{8,\infty}\|_2^2={1\over105}A_4^2V_2.}         \tag{6.5}
\]

For `m=1`, `tau_1=Gamma_0`, so (0.11)--(0.12) reduce to the exact singleton
constants obtained by inserting (6.5).  No decimal evaluation is needed
for any sign conclusion.

## 7. Fixed depth, growing source depth, and Fourier depth are different

The strict growing-prefix theorems use a source-label depth, call it `Q`,
with

\[
 Q\leq C_0L.                                          \tag{7.1}
\]

They prove the exterior-white captured floors

\[
 \widehat\Sigma_{N,Q}^\#\succeq {L\over8}I,
 \qquad
 \widehat\Sigma_{N,-,Q}^\#\succeq {L\over8}I.       \tag{7.2}
\]

Thus allowing the captured source prefix to grow like `O(L)` does not
create a Toeplitz sign reversal.  The limiting symbol still has the exact
quarter floor.  What is no longer frozen is the exact fixed-depth
coefficient `tau_m` in (0.11)--(0.12): fixed-pair convergence cannot be
promoted to a uniform operator asymptotic.  Equation (7.2) also does not
make either captured range the full physical parity sector.

The integer called `N` in the finite producer is instead the centered
log-Fourier projection cutoff.  For a fixed pair of actual labels `s,t`,
the compact-projection theorem requires

\[
 {\operatorname {poly}_{s,t}(\lambda,L,\log N_{\rm proj})
  \over N_{\rm proj}\sqrt{D_sD_t}}\longrightarrow0.   \tag{7.3}
\]

Already on the anchor diagonal this requires

\[
 N_{\rm proj}d_4/
 \operatorname {poly}(\lambda,L,\log N_{\rm proj})\longrightarrow\infty.
                                                               \tag{7.4}
\]

Since

\[
 d_4\sim4\sqrt2\pi{(16\pi)^4\over4!}
       \lambda^9e^{-4\pi\lambda^2},                  \tag{7.5}
\]

a sufficient asymptotic threshold has

\[
 \log N_{\rm proj}>4\pi\lambda^2+O(\log\lambda).     \tag{7.6}
\]

The locked value in (0.1) has
`log(N_proj)=9600*log(2)*lambda^2` and easily satisfies (7.6).
A fixed Fourier cutoff, or `N_proj=O(L)`, does not satisfy (7.3)--(7.6).
No conclusion in Sections 2--6 may be transferred to such a cutoff.
The exact frozen admissibility condition is (7.3); (7.6) is only a
sufficient exponent threshold extracted from the anchor bound, not a
claimed sharp necessary threshold for the true projection error.

## 8. Reconciliation with the finite `lambda=5/2`, `N=7` diagnostic

The producer at `lambda=2.5`, Fourier cutoff `N=7`, reports

\[
 \begin{aligned}
 q&=4.312473215141095\,10^{-11},\\
 \lambda_{\min}(Q_+|_{\kappa^\perp})
   &=7.638771822333190\,10^{-12},\\
 \lambda_{\min}(Q_-)&=6.105885368581463\,10^{-14},\\
 u&=3.014894535013564\,10^{-11}.
 \end{aligned}                                        \tag{8.1}
\]

Thus both the `q` and lower-Ritz shifted full-sector diagnostics fail there.
At the same `lambda` but Fourier cutoff `N=14`, the corresponding producer
reports

\[
 q=3.340087891628824\,10^{-20},\quad
 \mu_+=2.621968317272557\,10^{-16},\quad
 \mu_-=5.494068248875289\,10^{-19}.                  \tag{8.2}
\]

The many-order cutoff dependence is exactly what (7.3) warns about.  Neither
`N=7` nor `N=14` is the locked asymptotic cutoff (0.1).  Moreover (8.1)--(8.2)
are full physical-sector eigenvalues, whereas (0.11)--(0.12) are restricted
source-span eigenvalues.  The source spans have not been proved to exhaust
those sectors.  Therefore the finite diagnostics neither contradict nor
certify the asymptotic theorem.  They are numerical diagnostics, not
interval certificates and not eventual-threshold evidence.

## 9. Fail-closed boundary

The theorem proves only the fixed captured-source asymptotics
(0.10)--(0.12), their eventual `q`- and `U_Z`-shifted signs, and the exact
projection-resolution boundary.  It does not prove

- `P_(kappa^perp)(Q_+-U_Z I)P_(kappa^perp)>0` on the whole even complement;
- `Q_--U_Z I>0` on the whole odd sector;
- a retained-complement, multiplier-dangerous, or Feshbach inf-sup floor;
- that a fixed or `O(L)` Fourier cutoff resolves a `d_j L` scale;
- an effective first `lambda` at which any asymptotic sign holds; or
- any statement about zeros of `xi`.

In particular, the paired whole-sector `U_Z` signs remain the RH-strength
gate isolated by the frozen `q`-shift core theorem.  Restricted captured
positivity cannot replace that gate.
