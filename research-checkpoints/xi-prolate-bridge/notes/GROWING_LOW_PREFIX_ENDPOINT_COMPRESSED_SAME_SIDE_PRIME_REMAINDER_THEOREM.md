# Growing low-prefix endpoint-compressed same-side prime remainder theorem

## 0. Result and exact scope

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad Q\leq C_0L,                                  \tag{0.1}
\]

the same-phase inventory

\[
 {\cal I}_Q=\{0,4,8,\ldots,4Q\},                    \tag{0.2}
\]

and the standard finite Fejer weights

\[
 \omega_H(m)=\left(1-{m\over H+1}\right)_+,
 \qquad H\geq1.                                     \tag{0.3}
\]

Let `U` be the exact one-tail exterior isometry on the endpoint-null
modal space and let

\[
 \Phi={1\over2\sqrt2}U.                              \tag{0.4}
\]

In pure defect-white coordinates put

\[
 \epsilon_Q=\left({e_{4j}\over\sqrt {d_{4j}}}
                  \right)_{j=0}^Q,                  \tag{0.5}
\]

and let `J_Q` be the exact endpoint-sheared, full-exterior-white
isometry.  Thus

\[
 J_Q^*J_Q=I,\qquad \epsilon_Q^*J_Q=0.                \tag{0.6}
\]

At a prime shift, `V_qR_l=sqrt(q)R_(ql)`.  After exact removal of
the common sampler `m=ql`, define the compressed same-side form by

\[
\begin{split}
 {\cal S}^{\rm neq}_{H,Q}[z]
 ={}&-4\operatorname {Re}\sum_{q\geq2}{\Lambda(q)\over\sqrt q}
 \sum_{\substack{m,l\geq1\\m\ne ql}}
 \omega_H(m)\omega_H(l)\\
 &\hspace{19mm}\times
 \left\langle R_m\Phi J_Qz,V_qR_l\Phi J_Qz\right\rangle .
\end{split}                                          \tag{0.7}
\]

The coefficient `-4 Re` is the Hermitian sum of the
two ordered same-side orientations.  In `U` coordinates, (0.4) makes
the same formula

\[
 -{1\over2}\operatorname {Re}
 \sum_{q\geq2}{\Lambda(q)\over\sqrt q}
 \sum_{m\ne ql}\omega_H(m)\omega_H(l)
 \left\langle R_mUJ_Qz,V_qR_lUJ_Qz\right\rangle .   \tag{0.8}
\]

There are fixed `B_0` and `eta_0>0`, independent of `H,Q,c`,
such that

\[
 \boxed{
 \sup_{H\geq1}\|{\cal S}^{\rm neq}_{H,Q}\|
 \leq C Q^{B_0}c^{-\eta_0}.}                        \tag{0.9}
\]

One may take any fixed `eta_0<1/4` after increasing `B_0`.  The
proof below keeps the more informative ledger

\[
 \|{\cal S}^{\rm neq}_{H,Q}\|
 \leq C Q^B\left(c^{-1}+c^{-1/2}\right)
       +C Q^3c^{-1/4}\log c.                         \tag{0.10}
\]

The exact common-sampler channel is not estimated by (0.9); it is
allocated to the equality-conductor form before (0.7) is defined.  Its
finite-cutoff slow density is extracted in Section 2 and has norm
(O(\log^2(Q+2))).

This theorem concerns only the complete same-side prime fold.  It does
not estimate the reflected Stieltjes form, the centered Archimedean
multiplier, or their assembly with the equality floor.  It proves no
physical high-complement theorem, determinant or zero theorem, equation
(5.2) of `DIRECT_RH_ATTACK.md`, or Riemann-hypothesis conclusion.  The
formal state remains `P0_INVALIDATED`, and the standard eight are
unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md` | `e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe` |
| `tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py` | `a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713` |
| `notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` | `173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc` |
| `tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py` | `5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b` |
| `notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md` | `b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44` |
| `tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py` | `16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7` |
| `notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md` | `1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce` |
| `tests/test_growing_low_prefix_complete_profile_fio_reduction.py` | `ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d` |

The Jost theorem supplies the polynomial moving-label shell symbol,
phase separation, defect-white normalization, Volterra gain, and exact
hard Liouville graph.  The weighted-tail theorem supplies the complete
endpoint-null `m^(-4)` frame.  The outer Toeplitz theorem fixes the
cutoff slots, equality density, and endpoint compression.  The repaired
FIO reduction fixes the exact equality allocation, both ordered prime
orientations, and the physical normalization (0.4).

No scalar mask, midpoint row, or uncompressed modal condition number is
used.

## 2. Exact equality allocation and cutoff density

For a common sampler put `N=ql=m`.  The exact physical contribution is

\[
 -4\sum_{q,l\geq1}\Lambda(q)\omega_H(ql)\omega_H(l)
       \|R_{ql}\Phi J_Qz\|_2^2.                     \tag{2.1}
\]

By (0.4), this equals

\[
 -{1\over2}\sum_{q,l\geq1}\Lambda(q)
       \omega_H(ql)\omega_H(l)\|R_{ql}UJ_Qz\|_2^2. \tag{2.2}
\]

At finite cutoff the two weights in (2.1)--(2.2) must not be replaced by
a square.  Only after the ordered limit can the divisor identity
`sum_(q|N) Lambda(q)=log N` be used without the `l=N/q`
weight.

For the exact slow equality carrier, one ordered correlation contributes

\[
 {1\over4\pi l\sqrt q}
 \int_0^{\arcsin(1/(ql))}
        \cos(4(j-k)\beta)\,d\beta .                 \tag{2.3}
\]

Multiplication by (-2\Lambda(q)/\sqrt q) and Hermitian addition of the
two orientations gives minus the cosine coefficient of

\[
 \boxed{
 v_H(\beta)={1\over\pi}
 \sum_{\substack{q\geq2,\ l\geq1\\ql\leq\csc\beta}}
 {\Lambda(q)\over ql}\omega_H(ql)\omega_H(l).}     \tag{2.4}
\]

This is an exact finite-cutoff density: both Fejer slots and the factor
(1/\pi) are fixed before any limit.  Since the weights lie in
`[0,1]`, regrouping `N=ql` gives

\[
 0\leq v_H(\beta)
 \leq {1\over\pi}\sum_{2\leq N\leq\csc\beta}
       {1\over N}\sum_{q\mid N}\Lambda(q)
 \leq C\log^2{e\over\beta}.                         \tag{2.5}
\]

Consequently, for (0<h\leq1/4),

\[
 \sup_{|I|=h}\int_Iv_H(\beta)\,d\beta
 \leq Ch\log^2(e/h).                                \tag{2.6}
\]

The finite-resolution Fourier embedding at scale ((Q+1)^{-1}) gives

\[
 \left\|\left(\int_0^{\pi/2}v_H(\beta)
       \cos(4(j-k)\beta)\,d\beta\right)_{j,k=0}^Q
       \right\|\leq C\log^2(Q+2),                  \tag{2.7}
\]

uniformly in `H`.  Equations (2.1)--(2.7) allocate, rather than
discard, equality before the non-equality estimate.

## 3. Endpoint ideal: what is killed and what is estimated

The physical hard sampler is (m=1).  At its lower endpoint the pure
white modal row is proportional to

\[
 \left(\chi_{4j}{e_{4j}\over\sqrt {d_{4j}}}
              \right)_{j=0}^Q
 =\epsilon_Q+\left((\chi_{4j}-1)
          {e_{4j}\over\sqrt {d_{4j}}}\right)_{j=0}^Q.             \tag{3.1}
\]

The second vector is exponentially small on the selected plus-phase
prefix.  Before any estimate, every occurrence of the first vector is
collected into the Hermitian endpoint ideal

\[
 {\mathfrak I}_{\epsilon,H}
 =\{\epsilon_Qu_H^*+u_H\epsilon_Q^*
                 +\alpha_H\epsilon_Q\epsilon_Q^*\}. \tag{3.2}
\]

Only after this factorization is the exact compression applied:

\[
 J_Q^*EJ_Q=0\qquad(E\in{\mathfrak I}_{\epsilon,H}). \tag{3.3}
\]

No matrix in (3.2) is called power-small in pure coordinates.  The
surviving derivative-jet hierarchy is kept inside the complete hard
Liouville graph; an isolated Bernoulli row is neither dropped nor assigned
a sign.

There is a different rule for (m,N\geq2).  The boundary at (s=0) of
(R_mU) samples the exterior profile at (lambda m), not at the
physical endpoint (lambda).  Such a term does not generally belong to
(3.2).  It is retained in the integration-by-parts quotient and obeys
the same (c^{-1}) lattice majorant as the interior integral in Section
4.  This distinction is essential: endpoint compression is not used to
erase ordinary regular-sampler boundaries.

## 4. Regular non-equality sampler sum

Put `N=ql`.  The shift identity cancels the prime half-density:

\[
 {\Lambda(q)\over\sqrt q}V_qR_l
 =\Lambda(q)R_N.                                    \tag{4.1}
\]

For (m,N\geq2), the exact Jost shell representation has amplitudes
whose product satisfies

\[
 \|\vartheta_r a_{j,m;k,N}\|_\infty
 +\operatorname {Var}(\vartheta_r a_{j,m;k,N})
 \leq {CQ^Be^{-r}\over mN}.                         \tag{4.2}
\]

For (m\ne N), the difference and sum phases obey

\[
\begin{aligned}
 |\partial_s(\phi_{j,m}-\phi_{k,N})|
   &\geq \kappa ce^r|m-N|-CQ,\\
 |\partial_s(\phi_{j,m}+\phi_{k,N})|
   &\geq \kappa ce^r(m+N)-CQ .
\end{aligned}                                        \tag{4.3}
\]

Because `|m-N|>=1` and `Q=O(log c)`, one BV integration by parts
on each bounded-overlap shell, including the uncancelled global
(s=0) regular-sampler boundary, gives

\[
 {CQ^B\Lambda(q)\over
        c\,mN\{1+|m-N|\}}                           \tag{4.4}
\]

for the difference phase.  The sum phase has (1+m+N) in the final
denominator and is smaller after summation.

At finite cutoff define

\[
 a_{N,H}=\sum_{\substack{q\mid N\\q\geq2}}
       \Lambda(q)\omega_H(N/q).                     \tag{4.5}
\]

The exact divisor identity implies (0\leq a_{N,H}\leq\log N).  Also

\[
 \sum_{\substack{m\geq2\\m\ne N}}
 {1\over m\{1+|m-N|\}}
 \leq {C\log(eN)\over N}.                           \tag{4.6}
\]

Thus

\[
 \sum_{N\geq2}{a_{N,H}\over N}
 \sum_{\substack{m\geq2\\m\ne N}}
 {1\over m\{1+|m-N|\}}
 \leq C\sum_{N\geq2}{\log^2(eN)\over N^2}<\infty. \tag{4.7}
\]

Equations (4.4)--(4.7) are uniform in `H`.  They first give a
(CQ^B/c) bound for each pure white modal entry.  Hilbert--Schmidt is
used only over the (Q+1) labels, and its polynomial loss is absorbed
into `B`.  Congruence by the isometry `J_Q` introduces no condition
number.  Therefore

\[
 \sup_H\|{\cal S}^{\rm neq,reg}_{H,Q}\|
 \leq CQ^B c^{-1}.                                   \tag{4.8}
\]

The phase-absorbed Volterra coefficient has the stronger shell envelope

\[
 {CQ^2\over c}{e^{-5r/2}\over m^3}.                 \tag{4.9}
\]

Pairing it with (4.2), while retaining the phase separation in (4.3),
only improves the absolutely summable lattice majorant.  The exact
phase-index and defect-white normalization errors are treated in the
same symbol class.  Their total contribution is (O(Q^Bc^{-\eta}))
for a fixed (eta>0).

## 5. The one-hard reciprocal sampler

The remaining possibility is `m=1`, since `N=ql>=2`.  Split at

\[
 N_0=c^{1/4}.                                       \tag{5.1}
\]

### 5.1 The Jost-visible range

For `N<=N_0`, the reciprocal critical point is

\[
 x_1={1\over N},\qquad x_2=N,
 \qquad s_0={1\over2}\log(1+N^{-2}).                \tag{5.2}
\]

In particular (x_1\geq c^{-1/4}), so the critical point lies in the
proved phase-absorbed Jost region.  The exact hard graph treats the
initial segment before that region and retains the endpoint decomposition
(3.1)--(3.3).  At (5.2), the amplitude and curvature satisfy

\[
 A_1A_l\leq {C\sqrt N\over l},\qquad
 |\phi''(s_0)|\asymp cN^3.                           \tag{5.3}
\]

Consequently the exact stationary/BV bound before the prime half-density
is

\[
 {CQ^B\over\sqrt c\,q l^2}.                         \tag{5.4}
\]

Multiplication by (Lambda(q)/\sqrt q) and summation give

\[
 {CQ^B\over\sqrt c}
 \sum_{q,l\geq1}{\Lambda(q)\over q^{3/2}l^2}
 \leq CQ^Bc^{-1/2}.                                 \tag{5.5}
\]

The fast phase is nonstationary and smaller.  Moving-label derivatives
cost only another fixed polynomial in (Q).

### 5.2 The complete deep tail

For `N>N_0`, the principal carrier is not extrapolated termwise through
the hard endpoint.  Regroup by `N` first.  From (4.5) and the exact
endpoint-null tail frame,

\[
 \|R_NUJ_Q\|\leq CQ^{3/2}N^{-2},\qquad
 \|R_1UJ_Q\|\leq CQ^{3/2}.                          \tag{5.6}
\]

Hence

\[
\begin{split}
 \left\|\omega_H(1)\sum_{N>N_0}a_{N,H}R_NUJ_Q\right\|
 &\leq CQ^{3/2}\sum_{N>N_0}{\log N\over N^2}\\
 &\leq CQ^{3/2}c^{-1/4}\log c.
\end{split}                                          \tag{5.7}
\]

Here the retained first-slot factor satisfies
\(0\leq\omega_H(1)\leq1\).  Taking the cross with the complete
\(m=1\) row only after (5.7) gives

\[
 \sup_H\|{\cal S}^{\rm neq,hard\ tail}_{H,Q}\|
 \leq CQ^3c^{-1/4}\log c.                           \tag{5.8}
\]

This is an operator estimate for the resummed endpoint-null profile.  It
does not discard the derivative jet and does not apply a Jost amplitude
outside its proved range.

## 6. Completion and ordered limit

Combine (4.8), (5.5), and (5.8), together with the Volterra, phase, and
normalization ledgers following (4.9).  This proves (0.10), hence (0.9)
with, for example, any fixed (eta_0<1/4).

The separate state-invisible origin correction has a uniformly Schwartz
sampled transform and the locked dual estimate recorded in the repaired
FIO reduction.  Its prime self and cross terms are (o(1)), so adjoining
that already separated correction preserves the weaker conclusion
(o(L)).  No origin term is silently identified with a prolate modal row.

The regular lattice majorant (4.7) is absolutely summable and independent
of `H`.  The deep range is dominated by (5.7), also independently of
`H`.  Therefore the ordered limit `H -> infinity` exists at fixed
`c,Q` and obeys the same bound.

The result is exactly the endpoint-compressed same-side prime remainder.
The reflected and centered-multiplier sectors remain separate theorem
obligations.

## 7. Reproduction

Run:

    python3 -B -m unittest tests.test_growing_low_prefix_endpoint_compressed_same_side_prime_remainder_theorem -v

The regression checks the exact physical/isometric factor, both ordered
orientations, the two finite-cutoff equality slots, the divisor and
regular lattice sums, the endpoint ideal, the one-hard transition, the
complete deep-tail exponent, frozen hashes, fail-closed scope, ASCII
hygiene, and displayed TeX.
