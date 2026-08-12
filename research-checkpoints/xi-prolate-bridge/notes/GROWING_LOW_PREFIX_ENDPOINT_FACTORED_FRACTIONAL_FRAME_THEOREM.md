# Growing low-prefix endpoint-factored fractional-frame theorem

## 0. Result and exact boundary

Use

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,\qquad
 Q\leq C_0L,\qquad {\cal I}_Q=\{0,4,\ldots,4Q\}.       \tag{0.1}
\]

For the standard finite Fejer weights

\[
 \omega_H(m)=\left(1-{m\over H+1}\right)_+,\qquad H\geq1,             \tag{0.2}
\]

let \({\bf B}_{H,Q}\) be the complete physical one-tail synthesis of the
pure defect-white rows with labels in \({\cal I}_Q\).  Every profile is
zero extended to the negative half-line.  Let \(J_Q\) be the exact
endpoint-null, full-exterior-white isometry defined in Section 2, and put

\[
 B_{H,Q}^{\#}={\bf B}_{H,Q}J_Q.                       \tag{0.3}
\]

Let \(D=-i\partial_s\) on the full line and let
\(\Pi_<={\bf1}_{\{|D|\leq c/2\}}\).  This note proves the two weaker
centered-multiplier gates, uniformly in the finite Fejer cutoff:

\[
 \boxed{
 \sup_{H\geq1}\left\|(B_{H,Q}^{\#})^*\Pi_<B_{H,Q}^{\#}\right\|
 \leq C Q^{20}c^{-1/4},}                              \tag{0.4}
\]

\[
 \boxed{
 \sup_{H\geq1}c^{-1/4}
 \left\||D|^{1/8}B_{H,Q}^{\#}\right\|_{\ell^2\to L^2}^2
 \leq C Q^{20}.}                                      \tag{0.5}
\]

The exponent \(20\) is only a safe ledger for the fixed finite
phase-absorbed derivative class and one modal Cauchy--Schwarz step.  No
sharp claim is made for it.

The cutoff-matched Gram theorem gives

\[
 \sup_{H\geq1}\|B_{H,Q}^{\#}\|_{\ell^2\to L^2}^2
 \leq C\log(Q+2).                                     \tag{0.6}
\]

Interpolating (0.5) with (0.6), take

\[
 \theta={1\over40},\qquad \delta_*={1\over320}.        \tag{0.7}
\]

Then

\[
 \boxed{
 \sup_{H\geq1}c^{-2\delta_*}
 \left\||D|^{\delta_*}B_{H,Q}^{\#}\right\|^2
 \leq C Q^{1/2}\{\log(Q+2)\}^{39/40}.}                \tag{0.8}
\]

For

\[
 a(\xi)=\operatorname {Re}\psi\left({1\over4}
                    +{i\xi\over2}\right)-\log\pi,     \tag{0.9}
\]

equations (0.4), (0.6), and (0.8) imply

\[
 \boxed{
 \sup_{H\geq1}\left\|
 2(B_{H,Q}^{\#})^*\{a(D)-\log c\}B_{H,Q}^{\#}
 \right\|=o(L).}                                      \tag{0.10}
\]

This is a two-sided norm estimate for the centered multiplier only.  It
does not identify the local logarithmic Toeplitz symbol, control the
non-equality prime or reflected folds, or prove a signed complement
floor.  It is restricted to the endpoint-null low prefix
\(Q=O(\log c)\), not the full transition span.  It proves no physical
high-complement, determinant, zero, equation (5.2) of
DIRECT_RH_ATTACK.md, or Riemann-hypothesis conclusion.  The state remains
P0_INVALIDATED, and the standard eight are unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md | e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe |
| tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py | a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713 |
| notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md | 173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc |
| tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py | 5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b |
| notes/FIXED_LABEL_4_12_WEIGHTED_ARCHIMEDEAN_CROSS_LIMIT_THEOREM.md | b6fd0f311d9b0822d2a0ad13c6b5d246c48bd694f692b3fb53ba5a7a47458a2e |
| tests/test_fixed_label_4_12_weighted_archimedean_cross_limit_theorem.py | 9a11a4e23a3a31f871f8654debf4a6b48d244cc29843c1e04118fd8c8737efbe |
| notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md | b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44 |
| tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py | 16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7 |

The phase-absorbed theorem supplies the uniform moving-label shell BV
class, defect-white normalization, and hard Liouville graph.  The tail
theorem supplies the exact endpoint divided difference and full-metric
congruence.  The fixed weighted theorem supplies the cutoff-uniform
fractional-BV and low-frequency arguments that are repeated below with
their constants made polynomial in \(Q\).  The outer Toeplitz theorem is
used only for (0.6); no local logarithmic-WKB conclusion is imported.

## 2. Exact endpoint factorization

Write

\[
 \epsilon_n={e_n\over\sqrt {d_n}},\qquad
 {\boldsymbol\epsilon}=(\epsilon_n)_{n\in{\cal I}_Q}.               \tag{2.1}
\]

If \(C_Q^\#\) synthesizes the sheared endpoint-null columns in pure modal
coordinates, then

\[
 D_Q^\#=(C_Q^\#)^*\operatorname {diag}(d_n)C_Q^\#,\qquad
 J_Q=\operatorname {diag}(\sqrt {d_n})C_Q^\#(D_Q^\#)^{-1/2}.        \tag{2.2}
\]

On the quotient,

\[
 J_Q^*J_Q=I,\qquad {\boldsymbol\epsilon}^*J_Q=0.       \tag{2.3}
\]

Let \({\cal S}_H\) denote the finite Fejer sampler synthesis.  For any
reference label \(r\in{\cal I}_Q\), linearity gives the exact identity

\[
 {\bf B}_{H,Q}
 ={\cal S}_H(F_r){\boldsymbol\epsilon}^*
  +{\cal S}_H\left(
       \{\epsilon_n(F_n-F_r)\}_{n\in{\cal I}_Q}\right).              \tag{2.4}
\]

Consequently

\[
 B_{H,Q}^{\#}
 ={\cal S}_H\left(
       \{\epsilon_n(F_n-F_r)\}_{n\in{\cal I}_Q}\right)J_Q.           \tag{2.5}
\]

The common endpoint row is killed by the exact congruence (2.3), not
estimated as a power-small pure-label row.  At the hard endpoint,
\(F_n(\lambda)-F_r(\lambda)=\chi_n-\chi_r\) is exponentially small, and
the remaining difference has the zero-initial parametric graph from the
tail theorem.

Equations (2.4)--(2.5) also explain why no isolated Bernoulli jet is used
below.  Endpoint nullity removes the common sawtooth, but the surviving
jet hierarchy is kept recombined in the complete spectral divided
difference.  In particular, the isolated \(B_2\) row is neither discarded
nor used as a lower bound for the complete profile.

The locked state-invisible origin correction is not a modal row in
(2.4).  Its defect-white coefficient is exponentially small, while its
sampled Fourier transform is Schwartz uniformly under finite Fejer
summation.  Its low-frequency and fractional-frame contributions are
therefore \(O(c^{-N})\) for every fixed \(N\), and are included in the
right sides below.

## 3. A polynomial moving-label fractional row bound

Set

\[
 \delta_0={1\over8}.                                  \tag{3.1}
\]

We first repeat the cutoff-uniform fixed-label proof before applying the
modal synthesis.  On a unit log shell \(s\in[r,r+1]\), and for \(m\geq2\),
the exact finite Fejer Jost row has

\[
 \|\vartheta_rb_{n,m}\|_\infty+
 \operatorname {Var}(\vartheta_rb_{n,m})
 \leq {C e^{-r/2}\over m},\qquad
 |\phi'_{n,m}(s)|\asymp cme^r.                        \tag{3.2}
\]

The phase-absorbed Volterra correction obeys

\[
 \|\vartheta_re_{n,m}\|_\infty+
 \operatorname {Var}(\vartheta_re_{n,m})
 \leq {CQ^2\over c}{e^{-5r/2}\over m^3}.              \tag{3.3}
\]

After at most two spectral-parameter derivatives, the same finite
symbol class costs at most \(C(Q+1)^6\).  Squaring this safe bound costs
\(Q^{12}\).

The fractional-BV lemma used in the fixed proof says that if the phase
bands on one shell have scale \(\Omega m\), their difference phases are
separated by \(\Omega|m-l|\), and their amplitudes obey (3.2), then

\[
\begin{aligned}
 \left\|\sum_{m\geq2}q_me^{i\phi_m}\right\|_{H^{\delta_0}}^2
 \leq{}&C\Omega^{2\delta_0}
       \sum_{m\geq2}m^{2\delta_0}
       (\|q_m\|_\infty+\operatorname {Var}q_m)^2\\
 &+C\Omega^{2\delta_0-1}
 \sum_{m\ne l}{\max(m,l)^{2\delta_0}
       \over ml(1+|m-l|)} .
\end{aligned}                                         \tag{3.4}
\]

For clarity, (3.4) follows by a dyadic Fourier partition, Plancherel on
the phase bands, and one BV integration by parts off those bands.  It is
first applied to a finite row.  Since \(0\leq\omega_H\leq1\), deleting
the cutoff weights only enlarges both positive majorants.  The sums

\[
 \sum_{m\geq2}m^{-2+2\delta_0}(1+\log m)<\infty       \tag{3.5}
\]

and their far triangles converge because \(\delta_0<1/2\).  Summing the
bounded-overlap shells gives

\[
 c^{-2\delta_0}
 \|B_{n,H}^{\rm Jost,\ m\geq2}\|_{H^{\delta_0}}^2
 \leq C Q^{12}.                                       \tag{3.6}
\]

Only \(m=1\) reaches the hard edge.  On its Jost portion,

\[
 ds={x\,dx\over1+x^2},\qquad
 |b_{n,1}|^2ds\leq {C\,dx\over1+x^2},\qquad
 {|\phi'_{n,1}|\over c}\asymp x+x^{-1}.               \tag{3.7}
\]

Thus

\[
 c^{-2\delta_0}\|B_{n,1}^{\rm Jost}\|_{H^{\delta_0}}^2
 \leq C Q^{12}\int_0^\infty
 {(x+x^{-1})^{2\delta_0}\over1+x^2}\,dx
 \leq C Q^{12}.                                       \tag{3.8}
\]

On the exact hard patch use the Liouville variable

\[
 \rho={z\sqrt{c^2+z^2}\over c},\qquad
 u_\mu=\sqrt\rho\,G_\mu.                              \tag{3.9}
\]

Put \(R=c^2+z^2\).  The exact Liouville equation is

\[
 u_\mu''+\Omega_\mu^2u_\mu=0,
 \qquad 2^{-1}\leq\Omega_\mu^2\leq3/2,
 \qquad \operatorname {Var}\log\Omega_\mu\leq C       \tag{3.9a}
\]

on \(1\leq z\leq\sqrt3c\).  Diagonalizing its first-order system with
the carrier

\[
 \vartheta_\mu(z)=\int_1^z\Omega_\mu(w)\,dw           \tag{3.9b}
\]

writes \(u_\mu\) as the sum of the two branches
\(a_{\mu,+}e^{i\vartheta_\mu}+a_{\mu,-}e^{-i\vartheta_\mu}\), where

\[
 \|a_{\mu,\pm}\|_\infty+
 \operatorname {Var}_{[1,\sqrt3c]}a_{\mu,\pm}\leq C. \tag{3.9c}
\]

Indeed the off-diagonal coefficient in the diagonalized system is a
fixed multiple of \(d\log\Omega_\mu\); (3.9c) follows from Gronwall for
finite measures and (3.9a).  This is the phase-absorbed representation:
the possibly long load \(\mu/R\) remains in \(\Omega_\mu\), rather than
being iterated as a Bessel perturbation.

The exact pure-white normalization on this patch is

\[
 B_{n,1}(s)={\sqrt\lambda\over2}{e_n\over\sqrt {d_n}}
 e^{s/2}\chi_nG_{\mu_n}(z),\qquad
 ds={z\,dz\over R}.                                  \tag{3.9d}
\]

The endpoint-white normalization gives
\(e_n^2/(2\pi\lambda d_n)=1+O(c^{-1/4})\), while
\(c=2\pi\lambda^2\).  Since

\[
 {e^{s/2}\over\sqrt\rho}=z^{-1/2},                  \tag{3.9e}
\]

each branch of (3.9d) is \(K_n\lambda
a_{\mu_n,\pm}(z)z^{-1/2}e^{\pm i\vartheta_{\mu_n}(z)}\), with
\(|K_n|+|K_n|^{-1}\leq C\).  Its physical instantaneous frequency is

\[
 p_s={d\vartheta_\mu\over ds}={\Omega_\mu R\over z}. \tag{3.9f}
\]

The frequency \(p_s\asymp R/z\) is split at \(z\asymp c\) into two
monotonicity intervals before applying the phase-band argument; hence
the turning point of \(R/z\) produces no caustic constant.

Applying the one-phase fractional-BV lemma used in (3.4), now in the
continuous \(z\) variable, reduces its on-band term to

\[
\begin{aligned}
 c^{-2\delta_0}\int_1^{\sqrt3c}|B_{n,1}(s)|^2
                         p_s^{2\delta_0}\,ds
 &\leq Cc^{-2\delta_0}\lambda^2
 \int_1^{\sqrt3c}{1\over R}
             \left({R\over z}\right)^{2\delta_0}dz\\
 &\leq C\int_{1/c}^{\sqrt3}
  (1+v^2)^{-1+2\delta_0}v^{-2\delta_0}\,dv\leq C.
\end{aligned}                                         \tag{3.9g}
\]

The last integral is uniform precisely for \(\delta_0<1/2\).  The
off-band term is bounded by (3.9c), one BV integration by parts, and the
same integral without the factor \(p_s^{2\delta_0}\).  Thus the hard
Liouville patch has the \(c^{2\delta_0}\) fractional scale directly.
In particular, we do **not** interpolate its crude \(H^1\) graph, which
would lose an extra power of \(c\).

For reference, that frozen graph is

\[
 \int_0^{\log2}|G_\mu|^2ds\leq {C\over c},\qquad
 \int_0^{\log2}|\partial_sG_\mu|^2ds\leq Cc^2.        \tag{3.10}
\]

It is used only on the regular \(0\leq z\leq1\) patch and for the
zero-extension trace.  For a pure row, this piece has size \(O(c^{1/2})\)
on an interval of length
\(O(c^{-2})\), so its Gagliardo boundary cost is

\[
 c\{c^{-2}\}^{1-2\delta_0}=c^{-1+4\delta_0}\leq c^{2\delta_0}.     \tag{3.10a}
\]

For the factored row (2.5), the common trace cancels and only the
exponentially small \(\chi_n-\chi_r\) initial value remains.  This step
treats the complete divided difference; no long-interval Bessel Neumann
series and no termwise endpoint-jet estimate is used.

Combining (3.6)--(3.10), including the exact Volterra coefficient, yields
for every pure selected label

\[
 \sup_{H\geq1}c^{-1/4}
 \||D|^{1/8}B_{n,H}\|_2^2\leq C Q^{12}.              \tag{3.11}
\]

The local \(L^1\) Fejer limit identifies the ordered complete row.
Weak compactness and lower semicontinuity pass (3.11) to that limit
without differentiating its Bernoulli hierarchy.

For a modal coefficient vector \(z\), ordinary Cauchy--Schwarz only in
the \(Q+1\) label index gives

\[
 c^{-1/4}\left\||D|^{1/8}{\bf B}_{H,Q}z\right\|_2^2
 \leq C Q^{13}\|z\|_2^2.                              \tag{3.12}
\]

We retain the looser \(Q^{20}\) ledger.  Since \(J_Q\) is an isometry,
(3.12) proves (0.5).

## 4. Uniform low-frequency leakage

For \(m\geq2\) and \(|\xi|\leq c/2\), both Fourier signs are separated
from the phase in (3.2).  One BV integration by parts on the log shells
gives

\[
 \sup_{|\xi|\leq c/2}
 |\widehat B_{n,m}(\xi)|
 \leq {CQ^6\over cm^2}.                               \tag{4.1}
\]

The sampler sum is absolute and uniform in \(H\).  For \(m=1\), use the
Liouville phase \(\vartheta_\mu(z)\) on \(1\leq z\leq\sqrt3c\).  Its
derivative satisfies

\[
 \vartheta_\mu'(z)=\Omega_\mu(z)\geq2^{-1/2},\qquad
 {|\xi|z\over c^2+z^2}\leq{1\over4}.                 \tag{4.2}
\]

Hence \(\vartheta_\mu(z)-\xi s(z)\) is nonstationary.  Its propagator
energy gives an exact sine--cosine representation with bounded-variation
coefficients.  The exact pure-white normalization and Jacobian are

\[
 B_{n,1}(s)={\sqrt\lambda\over2}{e_n\over\sqrt {d_n}}
 e^{s/2}\chi_nG_{\mu_n}(z),\qquad
 s={1\over2}\log(1+z^2/c^2),\qquad
 ds={z\,dz\over c^2+z^2}.                             \tag{4.2a}
\]

After inserting \(u_\mu=\sqrt\rho G_\mu\), the remaining amplitude in
each physical Fourier branch is, up to an absolute bounded factor,

\[
 A_c(z)={\lambda z^{1/2}\over c^2+z^2},\qquad
 \|A_c\|_\infty+\operatorname {Var}_{[1,\sqrt3c]}A_c
 \leq {C\over c}.                                    \tag{4.2b}
\]

Indeed the factors in (4.2a) and \(\rho^{-1/2}\) cancel to give
(4.2b).  On \(0\leq z\leq1\), direct integration costs
\(O(c^{-3/2})\), and the endpoint at \(z=0\) vanishes because of the
factor \(z/(c^2+z^2)\).  One integration by parts in each Liouville
branch gives

\[
 \sup_{|\xi|\leq c/2}
 |\widehat B_{n,1}^{\rm hard}(\xi)|
 \leq {C Q^6\over c}.                                 \tag{4.3}
\]

This is the fixed hard-row \(z=cx\) integration by parts with the uniform
Liouville propagator replacing a fixed-label Bessel constant.  It also
covers the regular \(z\leq1\) patch and the smooth Jost interface.  The
branch boundary terms cancel at the smooth interfaces, and the \(z=0\)
term vanishes by the Jacobian just noted.  Separately, the exact profile
factorization (2.4), not this integration by parts, identifies the common
ordinary endpoint row.  That row vanishes only after multiplication by
\(J_Q\); the remaining endpoint value is the exponentially small
\(\chi_n-\chi_r\) residual.

Equations (4.1)--(4.3) and Plancherel on an interval of length \(c\)
give, after one label Cauchy--Schwarz and composition with \(J_Q\),

\[
 \sup_{H\geq1}
 \|\Pi_<B_{H,Q}^{\#}\|_{\ell^2\to L^2}^2
 \leq C Q^{20}c^{-1/4}.                               \tag{4.4}
\]

This is (0.4).  Notice that (4.4) is proved for the exact
endpoint-factored row (2.5).  It is not obtained by claiming that the
factorized endpoint matrix is small before compression.

## 5. Interpolation and the centered multiplier

For every vector \(z\), Holder's inequality in Fourier space gives

\[
\begin{aligned}
 c^{-2\theta\delta_0}
 \||D|^{\theta\delta_0}B_{H,Q}^{\#}z\|_2^2
 \leq{}&
 \|B_{H,Q}^{\#}z\|_2^{2(1-\theta)}
 \{c^{-2\delta_0}
 \||D|^{\delta_0}B_{H,Q}^{\#}z\|_2^2\}^{\theta}.
\end{aligned}                                         \tag{5.1}
\]

Take the supremum over unit vectors and insert (0.5)--(0.6).  With
\(\theta=1/40\), equation (5.1) proves (0.8).

The elementary digamma bounds are

\[
\begin{aligned}
 |a(\xi)-\log c|&\leq C\log c,
      &&|\xi|\leq c/2,\\
 |a(\xi)-\log c|&\leq C_{\delta_*}(|\xi|/c)^{2\delta_*},
      &&|\xi|\geq c/2.
\end{aligned}                                         \tag{5.2}
\]

The low-frequency quadratic form is bounded by (0.4) times \(C\log c\).
The high-frequency form is bounded by (0.8).  Therefore

\[
\begin{split}
 \sup_{H\geq1}\left\|
 2(B_{H,Q}^{\#})^*\{a(D)-\log c\}B_{H,Q}^{\#}\right\|
 \leq{}&C Q^{1/2}\{\log(Q+2)\}^{39/40}\\
 &+C Q^{20}c^{-1/4}\log c.
\end{split}                                           \tag{5.3}
\]

For \(Q\leq C_0L\), the right side is \(o(L)\), uniformly over the
allowed prefix.  This proves (0.10).

## 6. Reproduction and claim boundary

Run

    python3 -B -m unittest \
      tests.test_growing_low_prefix_endpoint_factored_fractional_frame_theorem -v

The regression checks the endpoint factorization, fractional exponents,
sampler summability, hard nonstationarity, interpolation arithmetic,
digamma split, frozen hashes, ASCII hygiene, and displayed TeX.

The theorem does not allocate prime equality, combine a derivative row
with its arithmetic partner, or estimate any reflected Stieltjes
quadrature.  It proves only the centered outer multiplier bound (0.10).
No standard-eight file is modified.
