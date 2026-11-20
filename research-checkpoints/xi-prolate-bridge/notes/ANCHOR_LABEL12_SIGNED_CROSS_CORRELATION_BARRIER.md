# Anchor-to-label-12 signed cross correlation barrier

## 0. Exact outcome and claim boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad A=\lambda^2,\qquad
 L=2\log\lambda .                                      \tag{0.1}
\]

Let `R_4` be the complete global-radical remainder of the actual anchor
column and let `R_12` be the remainder of the actual anchor-deflated
label-12 column.  The first-transverse barrier isolates the scalar

\[
 \boxed{C_{4,12}(\lambda)=\mathcal W_Z(R_{12},R_4)}       \tag{0.2}
\]

and asks whether

\[
 C_{4,12}=o(d_8L^{-1/2}).                                \tag{0.3}
\]

This note does **not** prove (0.3), and it does not prove its negation for
the complete arithmetic form.  It proves the following sharp fail-closed
facts.

1. The isolated leading endpoint sawtooth has a nonzero geometric-mean
   cross:

   \[
   {S^{\rm saw}_{4,12}\over\sqrt{D_4D_{12}}}
       \longrightarrow {\pi\over12},\qquad
   {S^{\rm saw}_{4,12}\over d_8}
       \longrightarrow {\pi\over12}\sqrt{14\over99}.    \tag{0.4}
   \]

   Thus the leading endpoint coefficient does not vanish.

2. The complete unweighted fixed-label physical Jost profiles also have a
   strictly positive cross limit.  If `B_4,B_12` are the one-tail profiles
   whitened by their exact scalar exterior defects, then

   \[
   2\langle B_{12},B_4\rangle\longrightarrow
   \mathcal G_8,\qquad
   \mathcal G_8=\sum_{m\geq1}
      {\sin(8\arcsin(1/m))\over16\pi m}>0.              \tag{0.5}
   \]

   Numerically `mathcal G_8=0.0282956...`; no decimal is used for its
   positivity.

3. The all-order prolate expansion gives no cancellation at the scale in
   (0.3).  Its second correction has a nonzero top label-12 coefficient,

   \[
   [h_{12}]q_{4,2}={45\sqrt{154}\over1024\pi^2},         \tag{0.6}
   \]

   but every fixed truncation is only an algebraic approximation by global
   radicals.  The target is on the transseries scale
   `sqrt(d_4*d_12)=Theta(d_8)`.  Polarizing the algebraic expansion cannot
   determine its coefficient.  The admitted Gevrey theorem does not supply
   the defect-relative exponent needed to pass to this scale.

4. The earliest missing decision is a complete weighted cross-correlation
   theorem.  One sufficient negative-route package would prove

   \[
   {Q^{\rm same}_{\rm ar}(O_{12},O_4)
      \over\sqrt{D_4D_{12}}\log c}\longrightarrow\mathcal G_8,
   \qquad
   C_{4,12}-Q^{\rm same}_{\rm ar}(O_{12},O_4)
      =O(\sqrt{D_4D_{12}}),                             \tag{0.7}
   \]

   where the second estimate includes the pole, reflected Archimedean,
   inclusive minus-prime, and projection blocks with their locked signs.
   It would imply

   \[
   {C_{4,12}\over d_8L}\longrightarrow
       \mathcal G_8\sqrt{14\over99}>0,                  \tag{0.8}
   \]

   and would disprove (0.3).  Conversely, a proof of (0.3) must exhibit a
   complete pole--Archimedean--inclusive-minus-prime cancellation which
   removes both the nonzero unweighted carrier (0.5) and the logarithmic
   Archimedean scale.  No frozen theorem supplies that cancellation for the
   anchor/12 pair.

Every occurrence of `mathcal W_Z` below retains the pole, Archimedean, and
inclusive minus-prime blocks before taking an absolute value.  No positive
Weil-form Cauchy--Schwarz inequality, zero list, RH, or inferred positivity
is used.  The formal project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

| Dependency | SHA-256 |
|---|---|
| `notes/FIRST_TRANSVERSE_RELATIVE_LEAKAGE_ENDPOINT_HIERARCHY_BARRIER.md` | `aa2027679035174d2af6ef533f04b66f5dc9f9006e97b8ef77fc011b7501ef79` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md` | `c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md` | `fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c` |
| `notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md` | `e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |
| `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` | `384800a51ab1f9db5e1e4bb1f9c44a44de16daa0fd8c28761d0fcfa692d4259c` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |

The fixed-label defects obey

\[
 d_n\sim A_n\lambda^{2n+1}e^{-4\pi\lambda^2},\qquad
 A_n=4\sqrt2\pi{(16\pi)^n\over n!},                    \tag{1.1}
\]

and the exact anchor/12 hierarchy is

\[
 {\sqrt{d_4d_{12}}\over d_8}\longrightarrow
 \sqrt{14\over99}.                                     \tag{1.2}
\]

For fixed labels the anchor and origin coefficients are bounded and hence
`D_4/d_4 -> 1`, `D_12/d_12 -> 1`.  Anchor deflation changes a defect-white
label-12 profile by `O(lambda^(-8))`; the invisible origin correction is
smaller still.  These changes do not affect any fixed-profile limit below.

## 2. Exact complete scalar and projection ledger

Write

\[
 R_j=O_j+P_j,\qquad X_j=W_j+P_j.                         \tag{2.1}
\]

Polarized two-sided radicality gives

\[
 \begin{aligned}
 \mathcal W_Z(O_{12},P_4)&=-q_\lambda(X_{12},P_4),\\
 \mathcal W_Z(P_{12},O_4)&=-q_\lambda(P_{12},X_4),\\
 \mathcal W_Z(P_{12},P_4)&=q_\lambda(P_{12},P_4).
 \end{aligned}                                         \tag{2.2}
\]

Thus (0.2) contains all four outer/projection orientations.  Equivalently,
the complete central-form identity gives

\[
 \mathcal W_Z(O_{12},O_4)=q_\lambda(X_{12},X_4),        \tag{2.3}
\]

where

\[
 q_\lambda=W_{0,2}-W_{\mathbb R}-W_p.                  \tag{2.4}
\]

Equations (2.2)--(2.4) are identities only after the inclusive prime block
and both mixed orientations are retained.  They do not make the three
distributional blocks separately radical.

## 3. The isolated sawtooth coefficient is nonzero

For a fixed corrected label `t`, let `E_t` be its source endpoint.  The
exact leading one-tail Poisson row is

\[
 B_{0,t}(s)={E_t\over2\sqrt\lambda}e^{-s/2}P(Ae^s),
 \qquad P(x)={1\over2}-\{x\}.                           \tag{3.1}
\]

The endpoint and defect asymptotics are

\[
 {E_t^2\over D_t}\sim2\pi\lambda,\qquad
 \int_0^\infty e^{-s}P(Ae^s)^2\,ds={1\over12}+O(A^{-1}). \tag{3.2}
\]

Adding the reflected tail gives

\[
 \begin{aligned}
 {2\langle B_{0,12},B_{0,4}\rangle\over\sqrt{D_4D_{12}}}
 &={E_4E_{12}\over2\lambda\sqrt{D_4D_{12}}}
   \left({1\over12}+O(A^{-1})\right)\\
 &\longrightarrow {\pi\over12}.
 \end{aligned}
 \tag{3.3}
\]

All labels are divisible by four, so their endpoint phases agree.  There
is no hidden minus sign in (3.3).  Combining (3.3) with (1.2) proves (0.4).
This is an isolated physical endpoint term, not a statement about the
complete signed form.  The complete Volterra remainder is not
`o(sqrt(D_t))`, so (3.3) may not be promoted by deleting that remainder.

## 4. Complete unweighted Jost cross

For a pure fixed label `j`, put

\[
 \nu_j={\Theta_j\over2c}={2j+1\over2}+O_j(c^{-1}),
 \qquad \beta(x)=\arctan(1/x).                          \tag{4.1}
\]

The complete divided-difference/Volterra theorem gives the common outgoing
amplitude and phase

\[
 \phi_{j,m}(s)=cx_m(s)+\nu_j\beta(x_m(s)),\qquad
 x_m(s)=\sqrt{m^2e^{2s}-1}.                             \tag{4.2}
\]

Apply the cutoff-uniform diagonal/off-diagonal argument of the fixed-plane
theorem to labels 4 and 12.  The unequal-sample difference phases and all
sum phases are `o(1)`.  On the diagonal `m=l`, oscillatory averaging leaves
one half of the difference phase.  Since `nu_12-nu_4=8+O(c^(-1))` and
`ds=x dx/(1+x^2)`, this gives

\[
 \begin{aligned}
 2\langle B_{12},B_4\rangle
 &\longrightarrow {1\over2\pi}
  \sum_{m\geq1}{1\over m}
 \int_{\sqrt{m^2-1}}^\infty
       {\cos(8\beta(x))\over1+x^2}\,dx\\
 &=\sum_{m\geq1}{\sin(8\arcsin(1/m))\over16\pi m}
 =\mathcal G_8.
 \end{aligned}
 \tag{4.3}
\]

The fixed lower-label deflation terms are `o(1)` in these white
coordinates, so (4.3) also holds for the actual anchor-deflated label-12
profile.

The positivity is elementary.  The `m=1` term is zero and the `m=2` term
is

\[
 -{\sqrt3\over64\pi}.                                  \tag{4.4}
\]

For `m>=3`,

\[
 \sin(8\arcsin x)
 =8x\sqrt{1-x^2}(1-2x^2)(1-8x^2+8x^4)                 \tag{4.5}
\]

is positive at `x=1/m`.  For `m>=4`, its contribution to (4.3) is at least

\[
 {1\over2\pi m^2}{\sqrt{15}\over4}{7\over8}{17\over32}. \tag{4.6}
\]

Since `sum_(m>=4)m^(-2)>1/4`, the tail in (4.6) exceeds

\[
 {119\sqrt{15}\over8192\pi}>{\sqrt3\over64\pi};       \tag{4.7}
\]

the last inequality follows from `119*sqrt(5)>128`.  Equations
(4.4)--(4.7) prove `mathcal G_8>0` without numerical input.

## 5. Why all-order polarization is scale-blind here

The Hermite recurrence raises labels in steps of four.  The first
correction has

\[
 [h_8]q_{4,1}=-{\sqrt{105}\over16\pi}.                  \tag{5.1}
\]

The unique second-order raising path `4 -> 8 -> 12` therefore gives

\[
 [h_{12}]q_{4,2}
 ={\sqrt{105}\over16\pi}
  {\sqrt{9\cdot10\cdot11\cdot12}\over4}
  {1\over32\pi}
 ={45\sqrt{154}\over1024\pi^2}.                       \tag{5.2}
\]

Normalization and the label-zero source quotient multiply lower labels
only and cannot cancel this unique top term.

Every fixed `q_(4,j)` is Fourier invariant, has zero point value and zero
integral, and its arithmetic lift is a global radical.  Polarization hence
cancels every fixed algebraic coefficient of a fixed truncation.  But

\[
 \lambda^{-4}\sqrt{d_{12}/d_4}=C\lambda^4(1+o(1)),
 \qquad C>0,                                            \tag{5.3}
\]

so the exterior expansion is singular rather than descending.  More
importantly, (0.3) is exponentially below every fixed algebraic remainder.
The order-by-order flatness theorem is therefore silent about the
coefficient in (0.2).  The Gevrey theorem gives an exponential with an
unspecified endpoint-safe constant; it does not prove the defect-relative
bound needed to polarize at `d_8L^(-1/2)` resolution.

## 6. Exact missing correlation lemma

The unweighted result (4.3) does not by itself justify multiplication by
`log c`.  The exact even Archimedean symbol is

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}
                 +{i\xi\over2}\right)-\log\pi.         \tag{6.1}
\]

The existing fixed-plane theorem proves a matrix lower bound after
integrating (6.1), but it explicitly does not prove an `O(1)` renormalized
logarithmic asymptotic.  For a cross entry, a lower Loewner bound cannot be
polarized into an asymptotic.  The first missing statement is therefore

\[
 \boxed{
 2\int_{\mathbb R}a(\xi)
       \widehat B_{12}(\xi)\overline{\widehat B_4(\xi)}
       {d\xi\over2\pi}
 =\mathcal G_8\log c+O(1).}                             \tag{6.2}
\]

It requires a cutoff-uniform logarithmic moment estimate for the complete
unequal-phase Jost product, including the hard edge.  No finite endpoint
expansion proves it.

After (6.2), one must prove the corresponding complete same-side and
reflected prime quadratures are `O(1)` in defect-white coordinates, with
the pole and both projection orientations included.  The frozen 8/12
package proves those facts only for its own two-dimensional coframe.  Its
proof strongly suggests the fixed 4/12 analogue, but that analogue is not
an admitted theorem and its caustic/Fejer passage may not be assumed.

Thus the first scalar checkpoint has sharpened to (6.2) followed by the
fixed 4/12 prime quadrature.  The positive carrier `mathcal G_8` and the
nonzero sawtooth coefficient rule out a symmetry or formal-polarization
shortcut.  Only a complete arithmetic correlation theorem can decide
(0.3).  No equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant limit, or
Riemann-hypothesis conclusion follows.
