# Growing mixed-bridge coherent beta-row floor theorem

## 0. Result and exact scope

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad 1\leq Q\leq C_0L.                            \tag{0.1}
\]

Let

\[
 b=h_2-{I_2\over I_0}h_0,
 \qquad
 b^\#=b-\gamma m_1,
 \qquad
 \gamma={b(\lambda)\over m_1(\lambda)},             \tag{0.2}
\]

be the actual endpoint-sheared bridge from the frozen barrier theorem, and
put

\[
 A_\lambda=b^\#(0),\qquad
 D_b=D_{\rm mod}(b^\#)=\Theta(d_2),
 \qquad A_\lambda\longrightarrow2^{3/4}.             \tag{0.3}
\]

Let \({\cal C}_Q={\cal C}_{+,Q}\oplus{\cal C}_{-,Q}\) be the finite
endpoint-sheared captured block in Section 7 of the frozen odd transfer
theorem.  Its two physical images lie in the inversion-even and
inversion-odd sectors, respectively.  Thus its complete Weil form and its
full modal exterior metric are block diagonal.  Write that metric as
\(D_{C,Q}\).

This note proves the following statements.

1.  The coherent raw bridge beta self, equivalently the corrected bridge
    bump self, is

\[
 \boxed{
 q_{bb}={A_\lambda^2C_\xi\over4\lambda}
              +o(\lambda^{-1}),\qquad
 C_\xi=2+\gamma_{\!E}-\log(4\pi)>0.}                 \tag{0.4}
\]

2.  For the concatenated captured even and odd rows, the coherent
    one-beta-leg functional satisfies

\[
 \boxed{
 \sup_{1\leq Q\leq C_0L}
 {\|R_{+,Q}\oplus R_{-,Q}\|^2\over L}
 \longrightarrow0,\qquad
 \|\Lambda_QD_{C,Q}^{-1/2}\|^2=o(L/\lambda).}        \tag{0.5}
\]

    Bounded \(Q\) is treated separately in Section 4.  No estimate of the
    form `row norm squared is little-o of Q` is asserted uniformly down to
    bounded \(Q\).

3.  Let \(\widehat\Sigma_{N,{\rm mix},Q}^\#\) be the actual
    compact-projected complete matrix on
    \({\cal C}_Q\oplus\mathbb Cb^\#\).  With

\[
 {\cal M}_{\lambda,Q}
 =\operatorname {diag}(D_{C,Q},\lambda^{-1}),        \tag{0.6}
\]

    one has, for every sufficiently large locked \(\lambda\),

\[
 \boxed{
 \widehat\Sigma_{N,{\rm mix},Q}^\#
 \succeq {C_\xi\over2\sqrt2}\,{\cal M}_{\lambda,Q}.} \tag{0.7}
\]

4.  If \(G_{{\rm corr},Q}\) is the actual corrected exterior Gram on the
    same finite span, then an explicit constant
    \(C_{\rm ext}=O_\psi(1)\), independent of \(\lambda,Q\), satisfies

\[
 G_{{\rm corr},Q}\preceq C_{\rm ext}{\cal M}_{\lambda,Q},
 \qquad
 \widehat\Sigma_{N,{\rm mix},Q}^\#
 \succeq {C_\xi\over2\sqrt2C_{\rm ext}}
                 G_{{\rm corr},Q}.                  \tag{0.8}
\]

The proof is an ordered finite-Fejer, compact-BV, Abel explicit-formula
argument on this finite endpoint-compressed profile class.  It is not a
general \(L^2\) Plemelj or zero-sampling closability theorem.  In
particular, it never exchanges the infinite zero sum with the profile
integral by naive Fubini.  The \(s=1\) residue remains inside the combined
kernel until the ordered physical identity has been obtained.

The leading corrected bridge bump is not discarded as a small error: it is
the corrected representative of the leading beta term in (0.4).  Only the
bridge modal, compact-projection, and captured-origin-bump remainders are
small.  This theorem concerns the finite captured-plus-bridge span.  It
proves no retained-complement floor, graph-core density, determinant limit,
equation (5.2) of `DIRECT_RH_ATTACK.md`, Lambda bound, or Riemann hypothesis.
The formal state remains `P0_INVALIDATED`; the standard eight are unchanged.

## 1. Frozen inputs

The following bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md` | `335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb` |
| `tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py` | `0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc` |
| `notes/MIXED_BRIDGE_XI_OVER_S_BOUNDARY_OBSTRUCTION_THEOREM.md` | `4c4bb0344735a0d605e1052ac06b383144f2cdbb85d2c088bf0b6683e67f06a2` |
| `tests/test_mixed_bridge_xi_over_s_boundary_obstruction_theorem.py` | `1bc81194a9fa2fd4eac92491a08c60bc58f3640ac16e4e5e17864da8a2970c67` |
| `notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md` | `23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0` |
| `tests/test_growing_low_prefix_outer_floor_assembly_theorem.py` | `634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311` |
| `notes/GROWING_ODD_LOW_PREFIX_OUTER_FLOOR_TRANSFER_THEOREM.md` | `a4f92b20644d5fbcdec0edd9ba54a9e31ccd777f67c8ed58b8cd66d4dc0b1459` |
| `tests/test_growing_odd_low_prefix_outer_floor_transfer_theorem.py` | `c8a86e338762f00c32c04e9e300fc3398d4cbb084f16a1a530b77a16a1144bad` |
| `notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` | `173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc` |
| `tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py` | `5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b` |
| `notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md` | `1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce` |
| `tests/test_growing_low_prefix_complete_profile_fio_reduction.py` | `ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d` |
| `notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md` | `b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44` |
| `tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py` | `16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7` |
| `notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_REFLECTED_STIELTJES_THEOREM.md` | `621594962543f7700503cc545cca57b97a4969ef15b0129b0c026758398e8502` |
| `tests/test_growing_low_prefix_endpoint_compressed_reflected_stieltjes_theorem.py` | `f56565c253c2278fd3cbd0023317d5646059169e657b2225611a32a9867fa1fa` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |
| `notes/GROWING_TRANSITION_DISCREPANCY_ZERO_ORBIT_BERNOULLI_TAIL_BARRIER.md` | `29270fcd5a38282ca06d0726afa1fc0334ae0fd2cdb64b9cf3ee6ef9b3ba5d48` |
| `tests/test_growing_transition_discrepancy_zero_orbit_bernoulli_tail_barrier.py` | `fa0c69ba37a5cd7064fcbcefc7df3489861d02ecc7fbc3b10996829e3a064b28` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |

The bridge barrier fixes (0.2)--(0.3), the raw beta row, and the corrected
bump gauge.  The Xi-over-s theorem fixes the centered zero convention.  The
tail and complete-profile theorems fix the exact one-tail normalization.
The Toeplitz/reflected theorems supply the complete-profile Gram, the even
and odd floor theorems supply the captured block, and the complete-central
theorem supplies the compact projection comparison.  The discrepancy note
supplies the already-vendored FKS constants.  No logarithmic-WKB draft is
used.

## 2. Exact coherent beta diagonal

Write each nontrivial zero with full multiplicity as

\[
 \rho={1\over2}+iw_\rho.                              \tag{2.1}
\]

For

\[
 \beta_\lambda(u)={{\bf1}_{\{u>\lambda\}}\over2\sqrt u},
\]

the two reflected Mellin slots are exactly

\[
 B_\rho={\lambda^{-\rho}\over2\rho},
 \qquad
 B_\rho^\vee={\lambda^{-(1-\rho)}\over2(1-\rho)}.   \tag{2.2}
\]

The inversion-even and inversion-odd beta carriers of a source with origin
value \(A_\lambda\) are

\[
 F_+(w_\rho)=-{A_\lambda\over2}(B_\rho+B_\rho^\vee),
 \qquad
 F_-(w_\rho)={A_\lambda\over2}(B_\rho-B_\rho^\vee). \tag{2.3}
\]

The paired-slot convention is

\[
 F(w_\rho)\overline {F(\overline w_\rho)}
 =F(w_\rho)F(-w_\rho).                               \tag{2.4}
\]

Consequently the odd square has the forced minus sign and

\[
 F_+(w_\rho)^2-F_-(w_\rho)^2
 =A_\lambda^2B_\rho B_\rho^\vee
 ={A_\lambda^2\over4\lambda\rho(1-\rho)}.           \tag{2.5}
\]

This sum is absolutely convergent: the summand is
\(O((1+|\operatorname {Im}\rho|)^{-2})\), and the classical zero-counting
bound is sufficient.  Hadamard differentiation at zero gives

\[
 C_\xi:=\sum_\rho{1\over\rho(1-\rho)}
 =-2{\xi'(0)\over\xi(0)}
 =2+\gamma_{\!E}-\log(4\pi)>0.                       \tag{2.6}
\]

Every zero in (2.6) is counted with its full multiplicity.  Thus the raw
beta self is

\[
 q_{\beta\beta}={A_\lambda^2C_\xi\over4\lambda}.    \tag{2.7}
\]

The corrected bridge bump is not an additional term to (2.7).  The frozen
radical identity says that

\[
 O_{\rm bump}+A_\lambda J\beta_\lambda              \tag{2.8}
\]

has zero nontrivial-zero evaluations.  Hence (2.7) is simultaneously the
corrected bump diagonal.  Deleting both representatives would delete the
positive leading term.

## 3. Exact fixed-leg row and its ordered explicit formula

Fix \(\lambda,Q\) and a finite Fejer cutoff \(H\).  Let \(B_{H,g}(t)\)
be the corrected right outer profile of a captured vector \(g\), in the
relative coordinate \(u=\lambda e^t\), \(t\geq0\).  If \(m_g(w)\) is the
absolute-log transform, then

\[
 m_g(w)=\lambda^{-iw}\int_0^\infty
 B_{H,g}(t)e^{-iwt}\,dt.                             \tag{3.1}
\]

For an endpoint-null source before its origin correction, polarization of
(2.2) gives

\[
 L_{\lambda,H}(g)
 ={C_\xi g(0)\over4\lambda}
   -{1\over2\sqrt\lambda}R_{H,Q}(g).                \tag{3.2}
\]

The origin correction makes the corrected source value zero.  Radicality
therefore gives the exact beta-to-captured row

\[
 \Lambda_{H,Q}(g)
 =-\sum_\rho B_\rho^\vee m_g(w_\rho)
 =-{1\over2\sqrt\lambda}R_{H,Q}(g).                 \tag{3.2a}
\]

The last equality is defined by the ordered construction below, not by
interchanging an infinite zero sum and an integral.  The complete compact
zero row on the left of (3.2a) is absolutely convergent; the kernel series
used to represent it is only canonical.

For \(t>0\), define the canonical kernel

\[
 K(t)=\sum_\rho^{\rm can}
 {e^{-(\rho-1/2)t}\over1-\rho}
 =e^{-t/2}\sum_\rho^{\rm can}{e^{\rho t}\over\rho}. \tag{3.3}
\]

The substitution \(\rho\mapsto1-\rho\) preserves the symmetric ordinate
cutoff and full multiplicities.  With \(\psi_0\) taking half weight at a
prime power, the classical symmetric explicit formula is

\[
 \boxed{
 K(t)=e^{-t/2}\left\{e^t-\psi_0(e^t)-\log(2\pi)
       -{1\over2}\log(1-e^{-2t})\right\}.}          \tag{3.4}
\]

In particular,

\[
 K(t)=-{1\over2}\log t+O(1)\quad(t\downarrow0),
 \qquad K\in L^2_{\rm loc}(0,\infty).                \tag{3.5}
\]

The same convention gives the normalization

\[
 \int_0^\infty e^{-t/2}K(t)\,dt=C_\xi.              \tag{3.5a}
\]

Thus (3.4) has no hidden boundary delta at \(t=0\).

Here is the required order of operations.  Choose
\(\chi_R\in C_c^1([0,\infty))\) with

\[
 0\leq\chi_R\leq1,\qquad
 \chi_R=1\ \hbox{on }[0,R],\qquad
 \chi_R=0\ \hbox{on }[R+1,\infty).                 \tag{3.6}
\]

For fixed \(H,R\), the function \(\chi_RB_{H,g}\) is compactly supported
and BV.  Apply the symmetric Abel explicit formula to that compact-BV test
function, with zeros counted with full multiplicity.  Only then let the Abel
parameter tend to zero.  It gives

\[
 R_{H,Q}^{(R)}(g)
 :=\int_0^\infty\chi_R(t)B_{H,g}(t)K(t)\,dt.         \tag{3.7}
\]

The \(e^{t/2}\) term in (3.4) is the \(s=1\) residue.  It remains inside
\(K\) throughout (3.7).  No separately divergent pole row is formed, and
there is no sum-integral Fubini step.  Section 4 proves uniform integrable
tails, so the physical truncation may next be removed:

\[
 R_{H,Q}(g)=\lim_{R\to\infty}R_{H,Q}^{(R)}(g)
 =\int_0^\infty B_{H,g}(t)K(t)\,dt.                 \tag{3.8}
\]

Finally, at fixed \(\lambda,Q\), take the prescribed ordered limit
\(H\to\infty\).  Thus the full order is

\[
 \boxed{
 H<\infty\ \longrightarrow\
 \chi_RB_{H,g}\hbox{ compact BV}\ \longrightarrow\
 \hbox{Abel limit}\ \longrightarrow\
 R\to\infty\ \longrightarrow\ H\to\infty.}       \tag{3.9}
\]

Expanding (3.4) only after (3.8) gives the ordered physical decomposition

\[
\begin{split}
 R_{H,Q}(g)={}&\int_0^\infty e^{t/2}B_{H,g}(t)\,dt\\
 &-\sum_{n\geq2}\Lambda(n)
       \int_{\log n}^\infty e^{-t/2}B_{H,g}(t)\,dt\\
 &-\log(2\pi)\int_0^\infty e^{-t/2}B_{H,g}(t)\,dt\\
 &-{1\over2}\int_0^\infty e^{-t/2}
       \log(1-e^{-2t})B_{H,g}(t)\,dt .
\end{split}                                          \tag{3.10}
\]

These are respectively the pole, prime, and two Archimedean terms.  Their
smallness is proved from their coherent sum (3.4), not from deleting or
estimating the pole and prime main terms separately.

## 4. Endpoint-compressed row estimate

On either captured parity block, let \(J_Q\) be the exact full-metric
white isometry.  The one-tail isometry is \(U\), while the physical tail
and complete finite-Fejer profile have the exact normalization

\[
 \Phi={U\over2\sqrt2},\qquad
 {\bf B}_{H,Q}^{\rm mod}J_Q
 ={1\over2\sqrt2}\sum_{m\geq1}\omega_H(m)R_mUJ_Q.   \tag{4.1}
\]

The endpoint-null tail theorem gives, for \(r\geq0\),

\[
 \|{\bf1}_{[r,\infty)}R_mUJ_Q\|^2
 \leq\min\{m^{-1},CQ^3e^{-3r}m^{-4}\}.             \tag{4.2}
\]

Indeed the first term is the isometry bound after translation, and the
second is (0.8) of the frozen tail theorem at
\(M=me^r\).  Minkowski and \(0\leq\omega_H\leq1\) give

\[
 T_Q(r):=\|{\bf1}_{[r,\infty)}
          {\bf B}_{H,Q}^{\rm mod}J_Q\|
 \leq C\sum_{m\geq1}
 \min\{m^{-1/2},Q^{3/2}e^{-3r/2}m^{-2}\}.           \tag{4.3}
\]

The two summands balance at \(m\asymp Qe^{-r}\).  Hence, uniformly in
finite \(H\),

\[
 T_Q(r)\leq C
 \begin{cases}
 Q^{1/2}e^{-r/2},&0\leq r\leq\log(CQ),\\
 Q^{3/2}e^{-3r/2},&r\geq\log(CQ).
 \end{cases}                                         \tag{4.4}
\]

The complete-profile Toeplitz Gram, including the corrected captured bump,
satisfies

\[
 \sup_H\|{\bf B}_{H,Q}J_Q\|_{L^2(0,\infty)}^2
 \leq C\log(Q+2).                                   \tag{4.5}
\]

The vendored FKS constants are

\[
 K_{\rm FKS}=9.22022,
 \qquad \alpha_{\rm FKS}=0.8476836.                 \tag{4.6}
\]

Formula (3.4) and the FKS prime-number estimate imply

\[
 \|K\|_{L^2([r,r+1])}
 \leq Ce^{r/2}(1+r)^{3/2}
             e^{-\alpha_{\rm FKS}\sqrt r},qquad r\geq1, \tag{4.7}
\]

and, for sufficiently large \(R\),

\[
 \|K\|_{L^2([0,R])}
 \leq Ce^{R/2}(1+R)^{3/2}
             e^{-\alpha_{\rm FKS}\sqrt R}.          \tag{4.8}
\]

For \(Q\) larger than one fixed absolute threshold, put

\[
 r_Q=\log{Q\over\log(Q+2)}.                          \tag{4.9}
\]

Cauchy--Schwarz with (4.5) on \([0,r_Q]\), followed by unit-shell
Cauchy--Schwarz with (4.4) and (4.7), yields

\[
 \sup_H\|R_{H,Q}^{\rm mod}\|
 \leq C\sqrt Q\{1+\log(Q+2)\}^2
 \exp\!\left[-\alpha_{\rm FKS}
 \sqrt{\log Q-\log\log(Q+2)}\right].               \tag{4.10}
\]

For shells up to \(\log(CQ)\), the factors \(e^{-r/2}\) and \(e^{r/2}\)
cancel.  The remaining shell sum is bounded by

\[
 \sum_{j\geq r_Q}(1+j)^{3/2}e^{-\alpha_{\rm FKS}\sqrt j}
 \leq C(1+r_Q)^2e^{-\alpha_{\rm FKS}\sqrt {r_Q}}.   \tag{4.11}
\]

Past \(\log(CQ)\), the second line of (4.4) leaves an additional
\(e^{-r}\), so the same right side bounds that range.  This proves (4.10).

For \(1\leq Q\leq Q_*\), with \(Q_*\) fixed, use (4.5) on a fixed compact
interval and (4.4) on its complement.  Equations (3.5) and (4.7) give

\[
 \sup_{1\leq Q\leq Q_*}\sup_H\|R_{H,Q}^{\rm mod}\|
 \leq C_{Q_*}.                                      \tag{4.12}
\]

Combining (4.10) and (4.12), and splitting the range
\(1\leq Q\leq C_0L\) at any fixed \(Q_*\), gives precisely

\[
 \boxed{
 \sup_{1\leq Q\leq C_0L}{\|R_{H,Q}^{\rm mod}\|^2\over L}
 \longrightarrow0}                                  \tag{4.13}
\]

uniformly in finite \(H\).  This is the required quantifier; (4.12) is
not replaced by a growing-\(Q\) asymptotic.

For the actual origin correction, the complete sampled bump row is

\[
 B_{H,Q}^{\rm bump}(t)
 =\kappa_\psi{g(0)\over\sqrt\lambda}e^{t/2}
 \sum_{m\geq1}\omega_H(m)\widehat\psi(me^t/2).      \tag{4.14}
\]

The locked origin dual estimate and Schwartz summation give

\[
 \|g(0)J_Q\|^2\leq {CL\over\lambda},
 \qquad
 \sup_H\|R_{H,Q}^{\rm bump}\|
 \leq {C\sqrt L\over\lambda}.                      \tag{4.15}
\]

Thus (4.13) holds for the complete corrected profile.  The odd transfer
changes only unit signs and \(Q\) to \(Q+1\), so concatenating the two
parity rows proves the first assertion in (0.5).  Equation (3.2) then gives

\[
 \|\Lambda_QD_{C,Q}^{-1/2}\|^2
 ={1\over4\lambda}\|R_{+,Q}\oplus R_{-,Q}\|^2
 =o(L/\lambda).                                     \tag{4.16}
\]

## 5. Modal, bump, and projection remainder audit

The bridge modal exterior scale is \(D_b=\Theta(d_2)\), whereas the
coherent beta/bump scale is \(\lambda^{-1}\).  Absolute sampling
Cauchy--Schwarz must be used at the cross scale.  With
\({\cal P}(\lambda,L)\) denoting a fixed polynomial envelope for the
frozen finite-prefix absolute sampling and projection constants, the safe
estimates have the form

\[
 |E_{bb}^{\rm mod/proj}|
 \leq {\cal P}(\lambda,L)
 \left\{D_b+\sqrt {D_b}\right\}
 =o(\lambda^{-1}),                                   \tag{5.1}
\]

and

\[
 \|E_{bC}^{\rm mod/proj}D_{C,Q}^{-1/2}\|
 \leq {\cal P}(\lambda,L)\sqrt {D_b}
 =o\!\left(\sqrt{L\over\lambda}\right).           \tag{5.2}
\]

The geometric-mean term \(\sqrt {D_b}\) in (5.1) is essential.  The
absolute beta two-slot norm is only uniformly bounded unconditionally, so
that term must not be replaced by \(D_b\).  In the corrected physical
exterior norm the bump--modal geometric mean is the sharper
\(\sqrt{D_b/\lambda}\), but the proof does not rely on that improvement.
The fixed-label law
\(d_2\asymp\lambda^5e^{-4\pi\lambda^2}\) makes both displayed remainders
smaller than their targets after any fixed polynomial envelope.

The bridge bump itself supplies (2.7); it is not included in
\(E_{bb}^{\rm mod/proj}\).  The only bump remainder in the captured row is
(4.15), whose contribution after (3.2) is

\[
 \|\Lambda_Q^{\rm captured\ bump}D_{C,Q}^{-1/2}\|
 \leq {C\sqrt L\over\lambda^{3/2}}.                 \tag{5.3}
\]

The compact projection preserves physical inversion parity.  Its frozen
absolute outer/projection comparison and (5.1)--(5.2) therefore give

\[
 q_{bb}={A_\lambda^2C_\xi\over4\lambda}
               +o(\lambda^{-1}),
 \qquad
 \lambda\|r_QD_{C,Q}^{-1/2}\|^2=o(L),              \tag{5.4}
\]

where \(r_Q\) is the complete compact-projected bridge-to-captured row.

## 6. Captured-plus-bridge Loewner floor

Section 7 of the frozen odd transfer theorem states exactly that

\[
 \widehat\Sigma_{N,C,Q}^\#
 =\widehat\Sigma_{N,+,Q}^\#
       \oplus\widehat\Sigma_{N,-,Q}^\#,
 \qquad
 D_{C,Q}=D_{+,Q}^\#\oplus D_{-,Q}^\#,               \tag{6.1}
\]

and every direct captured even--odd Weil cross is zero.  Hence

\[
 \widehat\Sigma_{N,C,Q}^\#\succeq {L\over8}D_{C,Q}. \tag{6.2}
\]

Equation (7.2) of that theorem shows that adjoining \(b\), and hence the
captured shear \(b^\#\), spans the full ordinary finite mixed prefix.
In captured/bridge coordinates write

\[
 \widehat\Sigma_{N,{\rm mix},Q}^\#
 =\begin{bmatrix}
 \widehat\Sigma_{N,C,Q}^\#&r_Q^*\\
 r_Q&q_{bb}
 \end{bmatrix}.                                     \tag{6.3}
\]

Relative to (0.6), put

\[
 a_\lambda={L\over8},\qquad
 b_\lambda=\lambda q_{bb},\qquad
 u_\lambda=\sqrt\lambda\,r_QD_{C,Q}^{-1/2},
 \qquad e_\lambda=\|u_\lambda\|.                  \tag{6.4}
\]

Then

\[
 b_\lambda\longrightarrow
 {2^{3/2}C_\xi\over4}={C_\xi\over\sqrt2},
 \qquad e_\lambda^2=o(L).                          \tag{6.5}
\]

The worst two-dimensional compression gives the exact lower Ritz bound

\[
 \mu_\lambda
 ={a_\lambda+b_\lambda-
 \sqrt{(a_\lambda-b_\lambda)^2+4e_\lambda^2}\over2}. \tag{6.6}
\]

For \(a_\lambda>b_\lambda\), rationalizing the square root gives

\[
 \mu_\lambda
 \geq b_\lambda-{e_\lambda^2\over
                         a_\lambda-b_\lambda}
 ={C_\xi\over\sqrt2}-o(1).                         \tag{6.7}
\]

This proves (0.7).  The genuine lower-Ritz erosion of the bridge-like
eigenvalue is

\[
 \delta_{{\rm Ritz},\lambda}
 ={\sqrt{(a_\lambda-b_\lambda)^2+4e_\lambda^2}
       -(a_\lambda-b_\lambda)\over2}
 \leq {e_\lambda^2\over a_\lambda-b_\lambda}=o(1). \tag{6.8}
\]

By contrast, eliminating the bridge erodes the captured block by

\[
 {e_\lambda^2\over b_\lambda}=o(L),                 \tag{6.9}
\]

while eliminating the captured block erodes the normalized bridge
diagonal by

\[
 {e_\lambda^2\over a_\lambda}=o(1).                 \tag{6.10}
\]

The bridge Schur complement induces a rank-one even--odd captured cross,
but (6.9) controls the norm of the entire induced block.  No additional
direct even--odd cross theorem is missing on the finite space (6.1).

## 7. Comparison with the actual corrected exterior Gram

Let

\[
 K_\psi={1\over2}\int_{|\xi|\geq1/2}
                  |\widehat\psi(\xi)|^2\,d\xi.       \tag{7.1}
\]

For a captured vector \(x\) and bridge coefficient \(z\), the corrected
Fourier exterior vector is

\[
 H_{C,x}+zH_b-\{x(0)+A_\lambda z\}
             {1\over2\lambda}\widehat\psi(\,\cdot\,/(2\lambda)). \tag{7.2}
\]

The three-vector inequality, the exact bump scaling, and the captured
origin dual estimate give

\[
\begin{split}
 G_{{\rm corr},Q}(x,z)
 \leq{}&3D_{C,Q}(x)+3D_b|z|^2
       +{3K_\psi\over\lambda}|x(0)+A_\lambda z|^2\\
 \leq{}&\left(3+{6K_\psi C L\over\lambda^2}\right)D_{C,Q}(x)\\
 &+\left(3\lambda D_b+6K_\psi A_*^2\right){|z|^2\over\lambda}.
\end{split}                                          \tag{7.3}
\]

where \(A_*\) is a fixed upper bound for \(|A_\lambda|\).  Since
\(\lambda D_b\to0\), one may take, after increasing the locked threshold,

\[
 C_{\rm ext}=\max\{4,1+6K_\psi A_*^2\}.             \tag{7.4}
\]

Equations (7.3)--(7.4) prove the first comparison in (0.8), and (0.7)
proves the second.  Only this upper comparison is asserted.  Possible
modal--bump cancellation means that no unproved two-sided metric
equivalence is being used.

## 8. Ordered-limit and fail-closed boundary

At fixed \(\lambda,Q\), the endpoint tail bounds make the finite-Fejer
profiles Cauchy on every compact interval and uniformly tight against
\(K\).  Therefore (3.9) defines the ordered complete row and preserves
(4.13)--(4.16).  The complete-central projection estimate then preserves
(5.4) and the finite-dimensional Loewner limit.

The theorem closes only the coherent one-dimensional bridge extension of
the frozen captured block.  It does not separate the raw beta pole from
its prime and Archimedean cancellation, promote the construction to an
arbitrary \(L^2\) source, control the retained complement, or supply a
growing graph core.  The positive constant in (0.7) is a bridge-scale
constant relative to (0.6), not a retained \(L/8\) floor on any larger
space.  No zero-location assertion follows.
