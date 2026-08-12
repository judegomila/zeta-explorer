# Growing odd low-prefix outer-floor transfer theorem

## 0. Result and exact scope

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad Q\leq C_0L,                                  \tag{0.1}
\]

and the residue-two same-phase inventory

\[
 {\cal I}_{-,Q}=\{2,6,10,\ldots,4Q+2\}.             \tag{0.2}
\]

The real prolate modes are phased positively at the origin.  Thus, for
every label in (0.2),

\[
 {\cal F}_ah_n=-\chi_nh_n,\qquad
 I_n:=\int_{-\lambda}^{\lambda}h_n(x)\,dx
      =-\chi_nh_n(0).                                \tag{0.3}
\]

For all sufficiently large locked \(\lambda\), \(I_2\ne0\).  Use the
actual anchor-two zero-integral sources

\[
 c^-_{4j+2}=-h_{4j+2}+{I_{4j+2}\over I_2}h_2,
 \qquad 1\leq j\leq Q.                              \tag{0.4}
\]

Add the standard state-invisible origin correction, apply the exact
endpoint shear, restrict to its endpoint-null rest, and whiten in the
pulled-back full exterior metric.  If \(C_{-,Q}^\#\) is its synthesis,
put

\[
 D_{-,Q}^\#=(C_{-,Q}^\#)^*\operatorname {diag}(d_n)C_{-,Q}^\#,
 \qquad
 J_{-,Q}=\operatorname {diag}(\sqrt {d_n})C_{-,Q}^\#
             (D_{-,Q}^\#)^{-1/2}.                   \tag{0.5}
\]

All inverses are on the quotient by the kernel.  In particular,

\[
 J_{-,Q}^*J_{-,Q}=I,\qquad
 (\epsilon^-_Q)^*J_{-,Q}=0,\qquad
 \epsilon^-_Q=\left({h_n(\lambda)\over\sqrt {d_n}}
                  \right)_{n\in{\cal I}_{-,Q}}.     \tag{0.6}
\]

Let \(\widehat Q_{X,-,Q}^\#\) be the ordered complete
pole--Archimedean--prime outer form made from the inversion-odd physical
profiles of these columns.  Then there are positive rank-one operators
\(P_{{\rm cont},-,Q}\) and \(P_{{\rm pole},-,Q}\), and a Hermitian
error \(E_{-,Q}\), such that

\[
 \boxed{
 \widehat Q_{X,-,Q}^\#
  =(\log c)J_{-,Q}^*T_{Q+1}J_{-,Q}
    -P_{{\rm cont},-,Q}-P_{{\rm pole},-,Q}+E_{-,Q}.} \tag{0.7}
\]

Here \(T_{Q+1}\) is exactly the limiting Toeplitz matrix of the even
low-prefix theorem,

\[
 T_{Q+1}\succeq {1\over4}I,                          \tag{0.8}
\]

and, for fixed harmless \(B,\eta>0\),

\[
\begin{split}
 \|(E_{-,Q})_-\|\leq C\bigg\{&
 Q^{1/2}\{\log(Q+2)\}^{39/40}
 +Q^{20}c^{-1/4}\log c\\
 &+\sqrt Q\log^2(Q+2)+\log^2(Q+2)
 +Q^Bc^{-\eta}\log c\bigg\}+\rho_{\rm bump}(c),
\end{split}                                                   \tag{0.9}
\]

\[
 \boxed{
 \|P_{{\rm cont},-,Q}\|+\|P_{{\rm pole},-,Q}\|
 \leq C\left\{{Q^B\over\lambda^3}
       +{L+\log(Q+2)\over\lambda}\right\}=o(1).}  \tag{0.10}
\]

Consequently, uniformly for \(Q\leq C_0L\),

\[
 \boxed{
 \widehat Q_{X,-,Q}^\#
 \succeq\left\{{1\over4}\log c-o(L)\right\}I
 \succeq {L\over8}I}                                \tag{0.11}
\]

for every sufficiently large locked \(\lambda\).

The odd radical and projection argument also transfers, with at most one
absolute constant in the sampling bounds.  If
\(\widehat\Sigma_{N,-,Q}^\#\) is the actual compact-projected odd signed
matrix at the locked cutoff, then

\[
 \|\widehat\Sigma_{N,-,Q}^\#-
       \widehat Q_{X,-,Q}^\#\|\leq\delta_{q,-}=o(L), \tag{0.12}
\]

and, after increasing the locked threshold,

\[
 \boxed{\widehat\Sigma_{N,-,Q}^\#\succeq {L\over8}I.} \tag{0.13}
\]

Equations (0.11)--(0.13) concern only the endpoint-sheared residue-two
low prefix in its exact full exterior metric.  They are not a physical
high-complement or retained-complement theorem, a determinant or zero
theorem, equation (5.2) of `DIRECT_RH_ATTACK.md`, or a
Riemann-hypothesis conclusion.  The project state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md | e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe |
| tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py | a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713 |
| notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md | 173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc |
| tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py | 5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b |
| notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md | b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44 |
| tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py | 16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7 |
| notes/GROWING_LOW_PREFIX_ENDPOINT_FACTORED_FRACTIONAL_FRAME_THEOREM.md | 6f0385a37476079991c45497e88664d49c0e13a5661026966f9d3bb22ee4f404 |
| tests/test_growing_low_prefix_endpoint_factored_fractional_frame_theorem.py | cf03e6e7a4254403bc4fb75469a90b926e4525455693cd5a1c5decc78b12640e |
| notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_SAME_SIDE_PRIME_REMAINDER_THEOREM.md | a0a44e3d0030691ab987379b5f60366aade7430a37bc55850a5e76068d270c9f |
| tests/test_growing_low_prefix_endpoint_compressed_same_side_prime_remainder_theorem.py | dc899033544d4bbac75d4fcee0cb1ba50c40e57993f07d5a1b28e972968cae65 |
| notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_REFLECTED_STIELTJES_THEOREM.md | 621594962543f7700503cc545cca57b97a4969ef15b0129b0c026758398e8502 |
| tests/test_growing_low_prefix_endpoint_compressed_reflected_stieltjes_theorem.py | f56565c253c2278fd3cbd0023317d5646059169e657b2225611a32a9867fa1fa |
| notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md | 23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0 |
| tests/test_growing_low_prefix_outer_floor_assembly_theorem.py | 634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311 |
| notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md | d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771 |
| tests/test_fixed_label_six_odd_arithmetic_synthesis_gain.py | ad57055b3f4c0190e3021bead942e7b280624dae636ec8fe2339bdbe69e372c6 |
| notes/ODD_RADICAL_PARITY_SCHUR_REDUCTION.md | 3186182c5c3c6ef235e6a48bbe5a7e049f21db4094a8edbfaeb0160663a43c2e |
| notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md | 6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9 |
| tests/test_growing_transition_complete_central_form_reduction.py | a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de |
| notes/MIXED_PREFIX_COUPLED_SIGNED_AUDIT.md | 544ce5d2ba527ba9200a64860d977c7191107c88798963591ed960bfa81e527c |

The first six low-prefix packages are not invoked by replacing the words
"zero modulo four" with "two modulo four."  Sections 2--5 below audit
the proof parameters which change under that replacement.  In particular,
the reflected sign and the negative odd pole are treated explicitly.

## 2. Actual anchor-two columns and the full metric

The fixed-index Hermite convergence and (0.3) give
\(I_2=-h_2(0)+o(1)\), with \(h_2(0)>0\).  Hence \(I_2\ne0\) for all
sufficiently large locked \(\lambda\), and (0.4) is defined without a
subsequence assumption.

Every vector \(f=\sum_{n\in{\cal I}_{-,Q}}a_nh_n\) in the actual
zero-integral source span obeys

\[
 0=\sum_na_nI_n=-\sum_na_n\chi_nh_n(0),\qquad
 f(0)=\sum_na_n(1-\chi_n)h_n(0).                     \tag{2.1}
\]

Since \(d_n=1-\chi_n^2\), Cauchy--Schwarz gives

\[
 |f(0)|^2\leq D(f)
 \sum_{n\in{\cal I}_{-,Q}}
 {1-\chi_n\over1+\chi_n}|h_n(0)|^2,qquad
 D(f)=\sum_nd_n|a_n|^2.                              \tag{2.2}
\]

The same low-label KRD endpoint estimate used for the zero-modulo-four
family, now with \(Q\) replaced by \(Q+1\), bounds the last sum by
\(CL/\lambda\).  Thus the odd actual columns satisfy the identical
full-metric dual estimate

\[
 \boxed{|f(0)|^2\leq {CL\over\lambda}D(f).}          \tag{2.3}
\]

This derivation uses the minus sign in (0.3) twice.  Replacing (0.3) by
the plus-family Fourier relation while retaining (0.4) would not be an
allowed proof.

The endpoint values of the labels in (0.2) also have one common sign.
The hard-edge endpoint-white estimate is quadratic in that sign and gives

\[
 {h_n(\lambda)^2\over2\pi\lambda d_n}
  =1+O(c^{-1/4}),\qquad n\in{\cal I}_{-,Q}.           \tag{2.4}
\]

Consequently the endpoint factorization, tail frame, and exact congruence
through (0.5) are unchanged.  No diagonal metric is substituted for
\(D_{-,Q}^\#\).

## 3. Transfer of the four even component theorems

Put \(\nu_n=\mu_n/(2c)\).  The moving-label expansion is valid for all
even \(0\leq n\leq4(Q+1)\), not only one residue class.  For
\(n_j=4j+2\),

\[
 \nu_{n_j}=4j+{5\over2}+O(Q^2/c),                   \tag{3.1}
\]

and hence

\[
\begin{aligned}
 \nu_{n_j}-\nu_{n_k}&=4(j-k)+O(Q^2/c),\\
 \nu_{n_j}+\nu_{n_k}&=4(j+k+1)+1+O(Q^2/c).
\end{aligned}                                       \tag{3.2}
\]

These two identities are the complete residue-class audit.

### 3.1 Toeplitz Gram and centered multiplier

The same-side Gram and multiplier depend on the label difference in
(3.2).  The common residue-two phase cancels.  The cutoff-matched Gram is
therefore the same

\[
 T_{Q+1,H}=(\Gamma_{j-k,H})_{0\leq j,k\leq Q},       \tag{3.3}
\]

with the same \(m=1\) quarter-identity summand.  The phase-absorbed Jost
and hard-edge estimates use only \(|\nu_n|\leq C(Q+1)\), a fixed number
of parameter derivatives, and (2.4).  Replacing \(Q\) by \(Q+1\) changes
only a harmless polynomial.  Thus

\[
 \sup_H\left\|
 2(B_{H,-,Q}^\#)^*\{a(D)-\log c\}B_{H,-,Q}^\#
 \right\|
 \leq C Q^{1/2}\{\log(Q+2)\}^{39/40}
       +CQ^{20}c^{-1/4}\log c.                       \tag{3.4}
\]

### 3.2 Same-side equality and non-equality prime forms

The exact relation \(V_qR_l=\sqrt qR_{ql}\), the equality condition
\(m=ql\), both Fejer slots, and the coefficient \(-4\operatorname {Re}\)
are independent of inversion parity.  The slow equality phase uses the
first line of (3.2), so its density and its bound are unchanged:

\[
 \|{\cal S}_{{\rm eq},H,-,Q}\|
 \leq C\log^2(Q+2)+CQ^Bc^{-\eta}.                    \tag{3.5}
\]

The separated phase equation and every hard or Volterra majorant depend
on the selected labels only through the same polynomial parameter class.
Therefore

\[
 \sup_H\|{\cal S}^{\rm neq}_{H,-,Q}\|
 \leq CQ^Bc^{-\eta}.                                \tag{3.6}
\]

The common minus sign in the Fourier eigenphase of (0.3) appears in both
legs of each Hermitian correlation and cancels.  There is no extra sign
in (3.5) or (3.6).

### 3.3 Reflected regular Stieltjes form

Inversion oddness does change the sign of every cross-tail correlation.
The reciprocal carrier still uses the label difference.  The symmetric
carrier uses the second line of (3.2), so relative to the plus-family
Hankel polynomial it is multiplied by the unit factor \(e^{i4\beta}\).
Multiplication by that factor leaves every total-variation majorant and
finite-resolution Fourier embedding unchanged.  Hence the regular pieces
obey the same two-sided bounds

\[
 \|K_{{\rm rec},H,-,Q}\|\leq C\log^2(Q+2),\qquad
 \|K_{{\rm sym},H,-,Q}\|
       \leq C\sqrt Q\log^2(Q+2).                    \tag{3.7}
\]

The quartic point, hard supports, reciprocal supports, and ordinary
endpoint transitions are geometric and do not depend on the residue
class.  Their error remains \(CQ^Bc^{-\eta}\).  What does not transfer
by a norm bound alone is the sign of the continuous main and pole.  They
are handled next.

## 4. Exact odd reflection and the two negative rank-one rows

Let \(B_{H,z}^\#(s)\) be the compressed one-tail row and put
\(g_{H,z}^\#(s)=e^{s/2}B_{H,z}^\#(s)\).  With
\(\ell=\log\lambda\), the inversion-odd outer state is

\[
 O^-_{H,z}(t)=
 \begin{cases}
 B_{H,z}^\#(t-\ell),&t>\ell,\\
 -B_{H,z}^\#(-t-\ell),&t<-\ell,\\
 0,&|t|\leq\ell.
 \end{cases}                                         \tag{4.1}
\]

Thus every reflected correlation has the opposite sign from the even
one.  Define the two scalar rows

\[
 \ell_{H,-}z=\int_0^\infty g_{H,z}^\#(s)\,ds,
 \qquad
 d_{H,-}z=\int_0^\infty e^{-s/2}B_{H,z}^\#(s)\,ds.  \tag{4.2}
\]

The reflected continuous main in the odd form is exactly

\[
 -P_{{\rm cont},H,-,Q},\qquad
 P_{{\rm cont},H,-,Q}=2\lambda\ell_{H,-}^*\ell_{H,-}
 \succeq0.                                           \tag{4.3}
\]

Fourier evaluation of (4.1) at the pole gives

\[
 r_{H,-}z=\widehat O^-_{H,z}(i/2)
   =\sqrt\lambda\,\ell_{H,-}z
      -\lambda^{-1/2}d_{H,-}z.                       \tag{4.4}
\]

The minus sign in (4.4) is forced by odd reflection.  The odd pole is

\[
 -P_{{\rm pole},H,-,Q},\qquad
 P_{{\rm pole},H,-,Q}=2r_{H,-}^*r_{H,-}\succeq0.    \tag{4.5}
\]

### 4.1 The modal nonstationary row

At finite Fejer cutoff, remove the exact conditional endpoint row and use
its centered periodic primitive.  Its integral is \(O(A^{-1})\).  For
every complete Jost sampler, substitution to its radial variable gives

\[
 {d\over dx}\{cx+\nu_n\beta(x)\}
   =c-\frac{\nu_n}{1+x^2}\geq {c\over2}.             \tag{4.6}
\]

One integration by parts, the phase-absorbed BV bounds, and sampler
summation give \(CQ^B/c\).  The hard \(m=1\) interval uses the exact
Bessel primitive, and the Volterra row has the same or a smaller bound.
Taking the Euclidean norm across the \(Q+1\) pure labels only changes
\(B\).  Congruence by the isometry \(J_{-,Q}\) costs no condition
number.  Therefore

\[
 \boxed{\sup_H\|\ell^{\rm mod}_{H,-}\|\leq {CQ^B\over c}.} \tag{4.7}
\]

The cutoff-matched profile Gram and Cauchy--Schwarz give

\[
 \boxed{\sup_H\|d^{\rm mod}_{H,-}\|^2
       \leq C\log(Q+2).}                             \tag{4.8}
\]

### 4.2 The actual origin bump

For the standard correction \(-f(0)\psi(2\lambda\,\cdot)\), its one-tail
row at finite Fejer cutoff is exactly

\[
 B^{\rm bump}_{H,-}(s)
 =\kappa_\psi{f(0)\over\sqrt\lambda}e^{s/2}
   \sum_{m\geq1}\omega_H(m)
       \widehat\psi(me^s/2),                         \tag{4.9}
\]

where \(\kappa_\psi\) is the fixed physical normalization.  In
particular, (4.9) is the complete sampled bump row, not its \(m=1\)
summand.  Since \(|\omega_H(m)|\leq1\), Tonelli's inequality and the
change of variable \(u=me^s/2\) give the two cutoff-uniform bounds

\[
\begin{aligned}
 \int_0^\infty e^s
  \sum_{m\geq1}|\widehat\psi(me^s/2)|\,ds
 &\leq2\sum_{m\geq1}{1\over m}
       \int_{m/2}^\infty|\widehat\psi(u)|\,du
   =:C_{\psi,1}<\infty,\\
 \int_0^\infty
  \sum_{m\geq1}|\widehat\psi(me^s/2)|\,ds
 &\leq\sum_{m\geq1}
       \int_{m/2}^\infty{|\widehat\psi(u)|\over u}\,du
   =:C_{\psi,0}<\infty.
\end{aligned}                                        \tag{4.10}
\]

Indeed \(|\widehat\psi(u)|\leq C_N(1+u)^{-N}\) for every fixed
\(N\), so both displayed series converge absolutely.  Applying the first
line of (4.10) to \(\ell_{H,-}^{\rm bump}\), and the second to
\(d_{H,-}^{\rm bump}\), proves

\[
 \|\ell^{\rm bump}_{H,-}\|+
 \|d^{\rm bump}_{H,-}\|
 \leq {C|f(0)|\over\sqrt\lambda}.                  \tag{4.11}
\]

Equation (2.3) turns this into an exact full-metric row estimate.  Combining
(4.3)--(4.5) with (4.7)--(4.11) proves, uniformly in \(H\),

\[
\begin{aligned}
 \|P_{{\rm cont},H,-,Q}\|
 &\leq C\left\{{Q^B\over\lambda^3}+{L\over\lambda}\right\},\\
 \|P_{{\rm pole},H,-,Q}\|
 &\leq C\left\{{Q^B\over\lambda^3}
       +{L+\log(Q+2)\over\lambda}\right\}.
\end{aligned}                                        \tag{4.12}
\]

This proves (0.10).  In particular, neither negative row is discarded,
and no cancellation between them is claimed or needed.

## 5. Exact odd outer assembly

At finite cutoff the same-side Archimedean ledger is unchanged:

\[
 {\cal A}_{H,-,Q}
 =(\log c)J_{-,Q}^*T_{Q+1,H}J_{-,Q}
  +2(B_{H,-,Q}^\#)^*\{a(D)-\log c\}B_{H,-,Q}^\#
  +(\log c)E_{{\rm Gram},H,-,Q}.                    \tag{5.1}
\]

The equality block, non-equality block, and every same-side bump term are
allocated exactly once as in the even ledger.  The reflected regular form
has the opposite sign, but (3.7) is a two-sided norm estimate.  The two
sign-sensitive reflected rows are exactly (4.3) and (4.5).  Therefore

\[
 Q^{\rm out}_{H,-,Q}
 =(\log c)J_{-,Q}^*T_{Q+1,H}J_{-,Q}
  -P_{{\rm cont},H,-,Q}-P_{{\rm pole},H,-,Q}
  +E_{H,-,Q},                                         \tag{5.2}
\]

where (0.9) holds uniformly in \(H\).  First take the ordered Fejer limit
at fixed \(c,Q\).  Then use the limiting quarter floor (0.8), (0.9), and
(0.10).  This proves (0.7)--(0.11) without interchanging the cutoff and
growing-\(\lambda\) limits.

## 6. Compact projection in the odd sector

Restriction to the central interval, the locked log-Fourier projection,
and inversion commute.  In the proof of the absolute outer and projection
sampling bounds, replacing \(S_+=(I+J)/2\) by \(S_-=(I-J)/2\) changes
only unit signs between the two reflected tails.  The same triangle and
square-sum proof therefore gives, for one absolute \(C\),

\[
 \|ZO^-_a\|^2\leq CB_{{\rm out},q}\,a^*D_{-,Q}^\#a,
 \qquad
 \|ZP^-_a\|^2\leq CB_{{\rm proj},q}\,a^*D_{-,Q}^\#a. \tag{6.1}
\]

The corrected anchor-two sources have zero value at the origin and zero
integral.  The odd radical theorem therefore applies before any pole,
Archimedean, or prime block is separated.  Its polarized algebra gives
the same complete error identity

\[
 E^-_N(a,b)=Sigma^-_N(a,b)-Q^-_X(a,b).              \tag{6.2}
\]

Absolute Cauchy--Schwarz in the complete zero sequence space gives, after
enlarging \(C\) once,

\[
 |E^-_N(a,a)|
 \leq C\left\{2\sqrt{B_{{\rm out},q}B_{{\rm proj},q}}
                 +B_{{\rm proj},q}\right\}
       a^*D_{-,Q}^\#a.                               \tag{6.3}
\]

The right side is an absolute multiple of the same exponentially small
\(\delta_q\) as in the even central reduction; call it \(\delta_{q,-}\).
Congruence and whitening prove (0.12).  The stronger
first inequality in (0.11), followed by the same \(3L/16\) versus
\(L/16\) margin, proves (0.13).

## 7. What the even and odd prefixes form together

Before the endpoint shears, let \(F_{0,Q}\) be the zero-integral subspace
of \(\operatorname {span}\{h_0,h_4,\ldots,h_{4Q}\}\), and let
\(F_{2,Q}\) be the anchor-two space in (0.4).  The raw modal supports are
disjoint.  Hence their full modal exterior metrics are orthogonal.  Their
physical images lie respectively in the inversion-even and inversion-odd
sectors, so every complete Weil cross term is zero.  Applying the two
endpoint shears separately preserves this block decomposition.  The even
and odd low-prefix theorems therefore give a finite block-diagonal
orthogonal captured block with the common floor \(L/8\).

This captured block is not the whole ordinary mixed zero-integral prefix.
In the raw inventory with both residue classes, the direct sum
\(F_{0,Q}\oplus F_{2,Q}\) has codimension one in the full zero-integral
hyperplane.  The missing direction is the bridge

\[
 b=c_2=h_2-{I_2\over I_0}h_0.                        \tag{7.1}
\]

For \(t=4j+2\), the ordinary ground-anchored column is exactly

\[
 c_t=-c_t^-+{I_t\over I_2}b.                         \tag{7.2}
\]

Adjoining \(b\) introduces the nonzero cross metric and all corresponding
signed bridge rows from the mixed-prefix audit.  No estimate in this note
controls their Schur cost.  Thus the two residue prefixes form a finite
orthogonal captured subspace, but not yet a theorem for the complete
ordinary mixed prefix or its retained physical complement.  This is only
a finite-dimensional captured subspace at each locked parameter.  It proves
no density of these source ranges in either physical parity sector and no
operator-core or Weil graph-core density statement.

## 8. Fail-closed boundary

The transfer proved here uses all of the following facts: the common
residue-two Fourier sign, the exact anchor-two ratios, endpoint shear in
the pulled-back full metric, reversal of the entire reflected cross, the
minus sign in the pole evaluation (4.4), and the ordered complete form
before radicality.  Dropping any one of them does not prove (0.11).

The result adds no assertion about the physical high complement, the
retained complement, a lower Ritz value outside the captured subspace,
determinant convergence, zeros of \(\xi\), or RH.  The formal project
state is still `P0_INVALIDATED`.
