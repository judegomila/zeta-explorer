# Critical arithmetic-to-actual scalar transfer theorem

## 0. Exact outcome and claim boundary

Assume RH.  Fix

\[
 {1\over2\pi}<D_-<D_+<{1\over2},\qquad
 \mathcal D=[D_-,D_+].                              \tag{0.1}
\]

For every sufficiently large dyadic height `Y`, use the ordinate
`gamma=gamma_Y` selected by the frozen adaptive critical covariance
theorem.  Its exact carrier data are

\[
 T=\gamma+\delta_Y=mh,\qquad h={2\pi\over L},
 \qquad \lambda^2=e^L,\qquad c=2\pi\lambda^2,
 \qquad N=m-1,                                      \tag{0.2}
\]

and satisfy, uniformly for `D in \mathcal D`,

\[
 N=D\lambda^2L+O_{\mathcal D}(L),\qquad
 T=Dc+O_{\mathcal D}(1),\qquad L=\log Y+O_{\mathcal D}(1).
                                                               \tag{0.3}
\]

Let `E=E_gamma` and `C=C_gamma` be the tangent-ideal endpoint and
same-zero Cauchy row from that theorem.  Thus

\[
 |C|^2\geq c_1(\log L)^2|E|^2,
 \qquad |C|^2\geq c_2L^2(\log L)^2.                \tag{0.4}
\]

Let `d_N` be the actual finite-prolate endpoint and put

\[
 D_N^{\rm act}=\sum_{\gamma'>0}\nu_{\gamma'}
 \left|{\sin(\gamma'L/2)\over\gamma'}
 H_N\!\left({\gamma'L\over2\pi}\right)\right|^2, \tag{0.5}
\]

with the frozen continuous convention at exact carriers.  The theorem
proved here is

\[
 \boxed{
 {D_N^{\rm act}\over |d_N|^2}
 \geq c_{\mathcal D}(\log L)^2}                    \tag{0.6}
\]

whenever `d_N` is nonzero.  If `d_N=0`, the selected row is nonzero for
large `Y`, so the favorable zero-endpoint branch holds instead.  With the
frozen bound `S_0<=C_(mathfrak Z)`, equation (0.6) gives

\[
 \boxed{
 (\eta_N^{\rm pr})^2
 ={d_N^2S_0\over D_N^{\rm act}}
 =O_{\mathcal D}((\log L)^{-2})\longrightarrow0.}  \tag{0.7}
\]

This is a one-cutoff scalar transfer.  The arithmetic row `C` already
contains the `1/h` Cauchy scale.  No additional factor `h^(-2)` occurs in
(0.6), and the two-adjacent-cutoff Hilbert transfer is not invoked.

The theorem is RH-conditional and uses the adaptive schedule (0.3).  It
does not return to a literal ceiling rule, place `lambda` on a prescribed
half-integer grid, synchronize the selected cutoff with the finite
simple-ground, boundary, shifted-sign, response-reserve, or strict
denominator gates, prove RH or a converse to RH, or prove a
de Bruijn--Newman bound.  It changes none of the standard eight files.
The formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs

Exactly six frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/ADAPTIVE_CRITICAL_EXACT_CARRIER_SHORT_ENDPOINT_COVARIANCE_THEOREM.md | b56bbe941bb9922be5701f17bd404192501c07c8a58e05ec9f58e126df384a1f |
| tests/test_adaptive_critical_exact_carrier_short_endpoint_covariance_theorem.py | b8724a4e439d3db445a8d92215a6cbee05e6c0d3bba0ce081f707aaace6c0a18 |
| notes/CRITICAL_DENSITY_PROLATE_MELLIN_TRANSPORT_CONNECTION_THEOREM.md | 4d20e37cb8b6cfe3d92da7e1344da0f1b12ca9d20185fd7b6d8ac406ef7846c6 |
| tests/test_critical_density_prolate_mellin_transport_connection_theorem.py | 0a6128433698ecdc83252747971c61fb0859bf12a2afe582cd78808b8c5b8cf3 |
| notes/SUPERCRITICAL_FULL_SOURCE_ADAPTIVE_ABEL_TAIL_THEOREM.md | ddd9fe4132e43bbbf859b89192380b3c299f2d9e3acec528bdefe39bb0f2eece |
| tests/test_supercritical_full_source_adaptive_abel_tail_theorem.py | a3d6169ab083b6fa5ebdce9273c43639680ee2d9db2034d3de842703fb814371 |
| notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md | aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6 |
| tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py | 6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6 |
| notes/ADAPTIVE_PROLATE_STOKES_ENDPOINT_ROW_TRANSFER_THEOREM.md | 0ae198d3a304960744a04c0ec095ffa6afcd4aa61599de551780efb43f89d878 |
| tests/test_adaptive_prolate_stokes_endpoint_row_transfer_theorem.py | e54bb937552247550c4ed57c1e20b86883556460416b5f046618076b2fbf4b76 |
| notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md | 2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87 |
| tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py | d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97 |

The first pair supplies (0.2)--(0.4), the global positive tangent, and
its local comparison with the critical source.  The second supplies the
fixed-density transport `T_j`, the positive label-0/4 multiplier, one
relative ordinate derivative, and the exact outer solution.  The third
supplies the arbitrary-real-`lambda` full-source Abel endpoint and
carrier-safe row beginning at `0.9c`.  The fourth supplies the exact
finite endpoint and phase-weighted row identities.  The fifth supplies
only the schedule-free exterior estimates in its Sections 2--4 and
(6.6)--(6.8).  The last pair supplies the cutoff convention `N=n-1`, the
definition of the actual quotient, and the bounded constant `S_0`; none
of its two-cutoff Hilbert hypotheses is used.

## 2. Exact carrier, envelope, phase, and finite interface

Put

\[
 x={T-\gamma\over h}={1\over2}+O_{\mathcal D}(L^{-1}),
 \qquad q_m=-{2(-1)^m\over\sqrt L}.                 \tag{2.1}
\]

The phase is exact:

\[
 \sin(\gamma L/2)
 =\sin\{\pi(m-x)\}=(-1)^{m+1}\sin(\pi x),
 \qquad |\sin(\pi x)|=1+O_{\mathcal D}(L^{-2}).    \tag{2.2}
\]

Let

\[
 \Phi(d)=\sqrt{1-d^2/4}-1+{d\over2}\arcsin(d/2),
 \qquad
 \kappa(d)={\pi d\over4}-\Phi(d),                 \tag{2.3}
\]

and let

\[
 A_0=\mathcal A_{D,T}^{\rm tan}(T)
 =c_H(T)e^{c\Phi(T/c)}A_4(T/c)>0.                  \tag{2.4}
\]

Stirling and (0.3) give the two-sided carrier scale

\[
 c^{-M_{\mathcal D}}e^{-\kappa(D)c}
 \leq A_0\leq
 c^{M_{\mathcal D}}e^{-\kappa(D)c}                \tag{2.5}
\]

for a fixed `M_{\mathcal D}`, after changing it to absorb the bounded
`T-Dc` error.

Write `A_k=mathcal A_(D,T)^tan(T+kh)`, `Z_k=Z(T+kh)`, and

\[
 K_{k,\gamma}={\gamma^2\over\gamma^2-(T+kh)^2}.
                                                               \tag{2.6}
\]

The tangent definitions are

\[
 A_0E=\sum_{k\geq0}(-1)^kA_kZ_k,
 \qquad
 A_0C=-{2\over\gamma}
 \sum_{k\geq0}(-1)^kA_kZ_kK_{k,\gamma}.           \tag{2.7}
\]

Thus, for the tangent Fourier samples
`f_k^(tan)=-A_kZ_k`, their complete endpoint and row are exactly

\[
 E^{\rm tan}_m=-A_0E,
 \qquad C^{\rm tan}_{m,\gamma}={\gamma A_0\over2}C.
                                                               \tag{2.8}
\]

There is no asymptotic kernel replacement in (2.8).

Let

\[
 \begin{aligned}
 E^F_m&=\sum_{k\geq0}(-1)^k\widehat F_\lambda(T+kh),\\
 C^F_{m,\gamma}&=\sum_{k\geq0}(-1)^k
 \widehat F_\lambda(T+kh)K_{k,\gamma},
 \end{aligned}                                      \tag{2.9}
\]

with Abel limits where required.  The exact finite interface is

\[
 d_N=q_mE^F_m+r_m,                                   \tag{2.10}
\]

\[
 {\sin(\gamma L/2)\over\gamma}
 H_N\!\left({\gamma L\over2\pi}\right)
 =q_m{\sin(\gamma L/2)\over\gamma}C^F_{m,\gamma}
 +R_{m,\gamma}^{\rm ext}.                           \tag{2.11}
\]

The exterior expressions in `r_m` and `R_(m,gamma)^ext` include the
periodized endpoint common mode, the complete exterior Cauchy row, and the
direct transform at `gamma`.  Since `m=O_{\mathcal D}(cL)`, the estimates in
the frozen Stokes theorem remain polynomially weighted and give

\[
 |r_m|+|R_{m,\gamma}^{\rm ext}|
 \leq P_{\mathcal D}(c,L)e^{-c}.                    \tag{2.12}
\]

The half-cell bound in (2.1), rather than a zero-spacing assumption, is
what makes the exterior Cauchy row carrier-safe.

## 3. Local tangent-to-physical comparison

Fix a constant `B>0`, to be chosen sufficiently large in Section 4.  For
`0<=u<=B log Y`, the critical connection theorem, its positive source
multiplier, and the exact label mixture give

\[
 \widehat F_\lambda(T+u)
 =-\mathcal A_c^{\rm loc}(T+u)Z(T+u)
 \{1+\epsilon_c(T+u)\},
 \qquad |\epsilon_c|\leq C_{B,\mathcal D}c^{-1/2}.
                                                               \tag{3.1}
\]

At each point apply the theorem with moving density
`d=(T+u)/c` and bounded offset zero.  These densities stay in one compact
subset of `(1/(2*pi),1/2)`, and the relative derivative furnished by the
connection theorem gives the same uniform local control.  The tangent
comparison from the arithmetic theorem is

\[
 {\mathcal A_c^{\rm loc}(T+u)
  \over\mathcal A_{D,T}^{\rm tan}(T+u)}
 =1+O_{B,\mathcal D}((1+u)^2/c).                    \tag{3.2}
\]

The factor `A_4` in (2.4) is essential here: it is the modulus left by the
critical transport `T_4` after its phase cancels the action phase.  The
label-zero term is `O(c^(-2))` relative to the Hermite source, so there is
no leading label-0/4 cancellation.  It is already included in
`epsilon_c`; no old density-zero multiplier is substituted for (3.1).

Classical convexity gives, uniformly on this collar,

\[
 |Z(T+u)|\leq c^{1/4}L^{C_0}.                       \tag{3.3}
\]

The tangent envelope is bounded by `C A_0e^(-a_*u)`, where

\[
 a_*={\pi\over4}-{1\over2}\arcsin(D_+/2)>0.        \tag{3.4}
\]

Since `h^(-1)=O(L)`, equations (3.1)--(3.4) imply

\[
 {1\over A_0}\sum_{0\leq kh\leq B\log Y}
 \left|\widehat F_\lambda(T+kh)+A_kZ_k\right|
 \leq c^{-1/4}L^{C_1}=o(1).                        \tag{3.5}
\]

For the row, direct factorization of the denominator and (2.1) give

\[
 \left|{\sin(\gamma L/2)\over\gamma}K_{k,\gamma}\right|
 \leq {C_{\mathcal D}\over h(k+x)}
 \qquad(0\leq kh\leq B\log Y).                    \tag{3.6}
\]

The extra harmonic sum costs only another power of `L`, so

\[
 {1\over A_0}\sum_{0\leq kh\leq B\log Y}
 \left|\widehat F_\lambda(T+kh)+A_kZ_k\right|
 \left|{\sin(\gamma L/2)\over\gamma}K_{k,\gamma}\right|
 =o(1).                                             \tag{3.7}
\]

These are absolute scalar estimates.  Neither one divides by the possibly
cancelling endpoint `E`.

## 4. Tangent tail and the relative critical range

The tangent envelope is globally defined by

\[
 A_k=A_0e^{-a_Dkh},
 \qquad a_D={\pi\over4}-{1\over2}\arcsin(D/2)\geq a_*.
                                                               \tag{4.1}
\]

Choose `B` so large that `a_*B>C_0+10` and so that all fixed polynomial
losses below are absorbed.  Convexity, summation at spacing `h`, and
(4.1) then give

\[
 {1\over A_0}\sum_{kh>B\log Y}|A_kZ_k|=o(1),       \tag{4.2}
\]

and, using (3.6) near the left edge and monotonicity afterward,

\[
 {1\over A_0}\sum_{kh>B\log Y}|A_kZ_k|
 \left|{\sin(\gamma L/2)\over\gamma}K_{k,\gamma}\right|
 =o(1).                                             \tag{4.3}
\]

Now choose a fixed

\[
 D_+<d_0<{1\over2}.                                 \tag{4.4}
\]

For every sample with `T+B log Y<=t_k<=d_0c`, put `d=t_k/c` and apply
the critical connection theorem with `d` as its compact density parameter.
Since

\[
 \kappa'(d)={\pi\over4}-{1\over2}\arcsin(d/2)
 \geq {\pi\over4}-{1\over2}\arcsin(d_0/2)>0,       \tag{4.5}
\]

the physical source satisfies

\[
 |\widehat F_\lambda(t_k)|
 \leq P_{\mathcal D}(c,L)A_0e^{-a_0(t_k-T)},
 \qquad a_0={\pi\over4}-{1\over2}\arcsin(d_0/2).
                                                               \tag{4.6}
\]

Increasing the already fixed `B` if necessary, (4.6) proves

\[
 {1\over A_0}\sum_{T+B\log Y\leq t_k\leq d_0c}
 |\widehat F_\lambda(t_k)|=o(1),                   \tag{4.7}
\]

with the same conclusion after insertion of the phase-weighted Cauchy
kernel.  This use of the critical theorem stops strictly below density
`1/2`; it is not silently continued to `0.9c`.

## 5. Retuned outer Laurent bridge to `0.9c`

Put

\[
 H={21\over20},\qquad q_0={9\over10}.               \tag{5.1}
\]

Choose `eta=1/10` in the outer collar (2.1) of the frozen critical
connection construction.  Its defect, Green, contraction, and one-step
extension estimates are uniform through `(1+eta)c`; hence the exact
forward-minimal solution is analytic and nonzero at height `Hc`.  This is
also below the action turning point because `H<2`.

Here is the promised corollary of the imported Laurent proof.  If
`B_j=C_jW_j` is the physical Watson solution divided by the gamma factor,
the physical Mellin bound and the explicit nonzero model for `W_j` give,
on one complete real period,

\[
 |B_j(b-iHc)|\leq P(c)e^{\pi Hc/4},\qquad
 |W_j(b-iHc)|\geq P(c)^{-1}e^{c\Phi(H)},
 \qquad
 |C_j(b-iHc;c)|\leq P(c)e^{\kappa(H)c}.            \tag{5.2}
\]

Use `zeta=e^(i*pi*s)` for the two-periodic quotient and repeat the Laurent
coefficient estimate on the enlarged annulus.  The inner circle controls
the constant and negative modes.  At `t=dc`, `d<=q_0`, the positive modes
from (5.2) cost `e^(-pi(H-d)c)`.  Consequently

\[
 |C_j(1/2-idc;c)|
 \leq P(c)\left\{1+
 e^{\{\kappa(H)-\pi(H-d)\}c}\right\}.              \tag{5.3}
\]

After restoring the gamma factor, the transport, the two fixed source
coefficients, and zeta convexity, (5.3) gives

\[
 |\widehat F_\lambda(dc)|
 \leq P(c)\left\{e^{-\kappa(d)c}+e^{-b_H(d)c}\right\},
 \qquad
 b_H(d)=\kappa(d)+\pi(H-d)-\kappa(H).               \tag{5.4}
\]

The function `kappa` is increasing, while `b_H` is decreasing on the
range in question.  Direct evaluation at `q_0` gives

\[
 \begin{aligned}
 \kappa(q_0)&=0.603785389511832\ldots,\\
 b_H(q_0)&=0.391633876886252\ldots,\\
 \kappa(1/2)&=0.361283181361350\ldots.
 \end{aligned}                                      \tag{5.5}
\]

Therefore there is a fixed `epsilon_{\mathcal D}>0` such that, uniformly
for `d_0c<=t_k<=q_0c`,

\[
 |\widehat F_\lambda(t_k)|
 \leq P_{\mathcal D}(c,L)A_0e^{-\epsilon_{\mathcal D}c}.
                                                               \tag{5.6}
\]

There are only `O(cL)` samples in this band.  The phase-weighted Cauchy
kernel is polynomially bounded, so (5.6) proves endpoint and row bounds
`o(A_0)` throughout the complete Laurent bridge.

## 6. Full-source Abel range and complete scalar comparison

Put

\[
 K_{.9}=\left\lceil{0.9c\over h}\right\rceil .     \tag{6.1}
\]

The frozen full-source Abel theorem is uniform for every real
`lambda>1`; in particular it applies to the adaptive `lambda=e^(L/2)`
without a half-integer or Diophantine hypothesis.  It gives

\[
 \sup_{K\geq K_{.9}}
 \left|\operatorname {Abel}\sum_{k\geq K}
 (-1)^k\widehat F_\lambda(kh)\right|
 \leq P(c,L)e^{-2c/5},                              \tag{6.2}
\]

and, for the selected zero,

\[
 \left|\operatorname {Abel}\sum_{k\geq K_{.9}}
 (-1)^k\widehat F_\lambda(kh)
 {\gamma\sin(\gamma L/2)\over\gamma^2-(kh)^2}\right|
 \leq P(c,L)e^{-2c/5}.                              \tag{6.3}
\]

The ceiling in (6.1) is exactly the ceiling in the frozen theorem.  The
parity difference between `(-1)^k` and `(-1)^(k-m)` changes only a unit
sign.  Since

\[
 {2\over5}>\kappa(1/2)\geq\kappa(D),                \tag{6.4}
\]

equations (2.5) and (6.2)--(6.3) are `o(A_0)` at the endpoint and row
scales.  No derivative of an Abel tail and no separate compact/exterior
comparison is used in this range.

Combining Sections 3--6 with the tangent estimates (4.2)--(4.3) yields

\[
 E^F_m-E^{\rm tan}_m=o(A_0),                        \tag{6.5}
\]

\[
 {\sin(\gamma L/2)\over\gamma}
 \left(C^F_{m,\gamma}-C^{\rm tan}_{m,\gamma}\right)
 =o(A_0).                                           \tag{6.6}
\]

Finally, (2.5) and (2.12) show that the exterior interface terms are also
small after the exact physical normalization:

\[
 r_m=o(|q_m|A_0),\qquad
 R_{m,\gamma}^{\rm ext}=o(|q_m|A_0).                \tag{6.7}
\]

## 7. Exact one-cutoff actual-minus-main equations

Insert (2.8) and (6.5)--(6.7) into the exact interface
(2.10)--(2.11).  There are scalar errors `R_e,R_c` with

\[
 R_e=o(|q_m|A_0),\qquad R_c=o(|q_m|A_0),             \tag{7.1}
\]

such that

\[
 \boxed{d_N=-q_mA_0E+R_e,}                          \tag{7.2}
\]

\[
 \boxed{
 {\sin(\gamma L/2)\over\gamma}
 H_N\!\left({\gamma L\over2\pi}\right)
 ={q_mA_0\over2}\sin(\gamma L/2)C+R_c.}           \tag{7.3}
\]

Every normalization is now visible.  The factors `q_m` and `A_0` are
common.  The factor `gamma` in (2.8) cancels the `gamma^(-1)` in the
phase-weighted physical row.  The only remaining fixed row factor is
`sin(gamma L/2)/2`, whose modulus tends to `1/2` by (2.2).

The cutoff in (7.2)--(7.3) is exactly

\[
 n=m=N+1\quad\Longleftrightarrow\quad N=m-1.        \tag{7.4}
\]

Although the tangent endpoint and Cauchy tails have exact adjacent index
recurrences, no arithmetic ratio has been selected at `m+1`.  We do not
append that component, take a two-cutoff norm, or invoke the Hilbert loss
from the frozen adjacent theorem.

## 8. Scalar selection, quotient, and `eta`

The absolute floor in (0.4) implies

\[
 {|C|\over\log L}\geq\sqrt{c_2}\,L\longrightarrow\infty.
                                                               \tag{8.1}
\]

Thus the absolute errors in (7.1) are negligible even if `E` nearly
cancels.  Equations (0.4), (7.1)--(7.3), and (2.2) give

\[
 \left|{\sin(\gamma L/2)\over\gamma}
 H_N\!\left({\gamma L\over2\pi}\right)\right|
 \geq c_3|q_m|A_0|C|,                               \tag{8.2}
\]

and

\[
 |d_N|
 \leq |q_m|A_0\left\{|E|+o(1)\right\}
 \leq C_4|q_m|A_0{|C|\over\log L}.                 \tag{8.3}
\]

The selected ordinate occurs in (0.5) with algebraic multiplicity at least
one.  Hence, if `d_N` is nonzero,

\[
 D_N^{\rm act}\geq
 \left|{\sin(\gamma L/2)\over\gamma}
 H_N\!\left({\gamma L\over2\pi}\right)\right|^2
 \geq c_5(\log L)^2|d_N|^2.                        \tag{8.4}
\]

This is (0.6).  If `d_N=0`, (8.2) and the absolute row floor show that
`D_N^(act)>0`, which is the favorable zero-endpoint case rather than an
undefined zero-over-zero quotient.  Multiplying (8.4) by the frozen
bounded zero-sampling constant proves (0.7).

The squared gain is only `(log L)^2`, but it diverges.  That divergence,
not a hidden power of `h^(-1)`, is exactly what is needed for
`eta_N^(pr)->0`.

## 9. Stopping point

The local critical transport, the retuned Laurent bridge, the complete
full-source Abel tail, and the exterior finite interface now meet at the
same adaptively selected zero and the same cutoff `N=m-1`.  The selected
absolute row floor turns every analytic comparison into a scalar absolute
estimate; an operator-relative or mean-square Stokes lemma is unnecessary.

What remains outside this theorem is a different quantifier problem.  The
adaptive `O(L)` schedule is not the literal ceiling schedule, and the
finite simple-even ground, boundary normalization, shifted-sector signs,
response reserve, and strict denominator branch have not been proved at
the selected cutoff.  Consequently (0.7) is not a completed checkpoint or
an RH proof.  The project state remains `P0_INVALIDATED`.
