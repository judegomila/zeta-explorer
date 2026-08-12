# Growing low-prefix outer Toeplitz Gram and centered-principal theorem

## 0. Result and exact claim boundary

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad Q\leq C_0L,                                  \tag{0.1}
\]

and the same-phase pure modal inventory

\[
 {\cal I}_Q=\{0,4,8,\ldots,4Q\}.                    \tag{0.2}
\]

For the standard finite Fejer sampler cutoff put

\[
 \omega_H(m)=\left(1-{m\over H+1}\right)_+,
 \qquad H\geq1.                                     \tag{0.3}
\]

Let `B_(j,m)` be the complete physical one-tail sampler of the pure
defect-white label `4j`.  It includes the exact hard row and the exact
Volterra coefficient.  The finite profile synthesis is

\[
 {\bf B}_{H,Q}e_j=B_{j,H}:=
       \sum_{m\geq1}\omega_H(m)B_{j,m},
 \qquad 0\leq j\leq Q.                              \tag{0.4}
\]

Define

\[
 w_H(\beta)={1\over2\pi}
 \sum_{m\leq\csc\beta}{\omega_H(m)^2\over m},
 \qquad0<\beta\leq{\pi\over2},                     \tag{0.5}
\]

\[
 \Gamma_{r,H}=\int_0^{\pi/2}w_H(\beta)
             \cos(4r\beta)\,d\beta,
 \qquad T_{Q+1,H}=(\Gamma_{j-k,H})_{j,k=0}^Q.       \tag{0.6}
\]

The pure symbol and the endpoint-sheared Gram must not be conflated.
Let `C_Q^#` synthesize endpoint-null sheared columns in pure modal
coordinates and put

\[
 D_Q^\#=(C_Q^\#)^*\operatorname {diag}(d_n)C_Q^\#,
 \qquad
 J_Q=\operatorname {diag}(\sqrt {d_n})C_Q^\#(D_Q^\#)^{-1/2}.
                                                               \tag{0.7}
\]

On the quotient,

\[
 J_Q^*J_Q=I,\qquad B_{H,Q}^\#={\bf B}_{H,Q}J_Q.      \tag{0.8}
\]

The first theorem is the cutoff-matched endpoint-sheared Gram estimate.
There are fixed `B_0` and `eta_0>0`, independent of `H,Q,c`, such that

\[
 \boxed{\sup_{H\geq1}\left\|
 2(B_{H,Q}^\#)^*B_{H,Q}^\#-J_Q^*T_{Q+1,H}J_Q\right\|
 \leq C Q^{B_0}c^{-\eta_0}.}                        \tag{0.9}
\]

The cutoff-matched matrix, rather than the unweighted limiting matrix, is
mandatory.  It satisfies

\[
 \boxed{
 T_{Q+1,H}\succeq {\omega_H(1)^2\over4}I
 \succeq {1\over16}I,\qquad
 \|T_{Q+1,H}\|\leq C\log(Q+2).}                     \tag{0.10}
\]

Since `J_Q` is an isometry, the same sixteenth floor holds for
`J_Q^*T_(Q+1,H)J_Q`.  The leading matrix in sheared coordinates is this
compression, not the raw coordinate matrix `T_(Q+1,H)`.  No
uncompressed pure-label Gram remainder estimate is asserted.

The second theorem concerns only the principal centered symbol.  Put

\[
 a(\xi)=\operatorname {Re}\psi\left({1\over4}
                      +{i\xi\over2}\right)-\log\pi,
 \qquad
 g_c(\beta)=a\left({c\over\sin\beta\cos\beta}\right)-\log c,       \tag{0.11}
\]

and

\[
 A_{Q+1,H}^{(c)}=
 \left(\int_0^{\pi/2}w_H(\beta)g_c(\beta)
             \cos(4(j-k)\beta)\,d\beta\right)_{j,k=0}^Q.           \tag{0.12}
\]

Then finite-resolution Carleson embedding gives

\[
 \boxed{
 \sup_{H\geq1}\|A_{Q+1,H}^{(c)}\|
       \leq C\log^2(Q+2),\qquad
 \sup_{H\geq1}\|J_Q^*A_{Q+1,H}^{(c)}J_Q\|
       \leq C\log^2(Q+2).}                         \tag{0.13}
\]

Equation (0.13) is not an estimate for the exact nonlocal multiplier.
That promotion would require an additional cutoff-uniform theorem.

This note does **not** prove the logarithmic-WKB promotion, a complete
same-side prime estimate, a reflected remainder estimate, or a signed
low-prefix floor.  It proves no high-complement or physical-quotient
theorem, no determinant or zero theorem, no equation (5.2) of
`DIRECT_RH_ATTACK.md`, and no Riemann-hypothesis conclusion.  The formal
project state remains `P0_INVALIDATED`; the standard eight are unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md` | `e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe` |
| `tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py` | `a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713` |
| `notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` | `173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc` |
| `tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py` | `5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b` |
| `notes/FIXED_PREFIX_COMPLETE_SIGNED_TOEPLITZ_SCHUR_THEOREM.md` | `c69d6d1a69f71548aa9291c5d261117ac913f2851df8f8fcc2f186c8bd530314` |
| `tests/test_fixed_prefix_complete_signed_toeplitz_schur_theorem.py` | `4f704f58524b9f4818db8bd1884009be9f4074fd303e2ec1cca5be5c74f70f87` |
| `notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md` | `1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce` |
| `tests/test_growing_low_prefix_complete_profile_fio_reduction.py` | `ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |

The phase-absorbed theorem supplies polynomial moving-label Jost BV,
endpoint-white normalization, and the hard Liouville graph.  The tail
theorem supplies endpoint-null hard control and the full-metric
congruence.  The fixed-prefix theorem fixes the physical normalization of
`B` and the limiting Toeplitz symbol.  The complete-profile reduction
records the stationary geometry and the exact prime equality allocation.
The complete-central reduction supplies the ordered-limit outer identity;
that identity is used only to state the remaining gate, not to prove
(0.9) or (0.13).

No scalar mask identity, midpoint row, or finite-cutoff global radical is
used.  All finite-cutoff statements here are correlations of honest outer
profiles.

## 2. Cutoff-matched Toeplitz Gram

On the Jost range, the pure white sampler is

\[
 B_{j,m}(s)=\kappa_jq_m(s)
 \{a_j(x_m)\sin\phi_j(x_m)+b_j(x_m)\cos\phi_j(x_m)\},               \tag{2.1}
\]

\[
 q_m(s)={1\over\sqrt{2\pi m x_m(s)}},\qquad
 x_m(s)=\sqrt{m^2e^{2s}-1},\qquad
 \phi_j(x)=cx+\nu_{4j}\arctan(1/x).                \tag{2.2}
\]

The endpoint-white and phase-absorbed estimates give

\[
 \kappa_j=1+O(c^{-1/4}),\qquad
 \nu_{4j}=4j+{1\over2}+O(Q^2/c),                    \tag{2.3}
\]

and a fixed finite derivative/BV class with only a polynomial loss in
`Q`.  For an equal sampler, the slow part of
`2 sin(phi_j)sin(phi_k)` is

\[
 \cos\{(\nu_{4j}-\nu_{4k})\beta\},
 \qquad \beta=\arctan(1/x).                         \tag{2.4}
\]

Moreover,

\[
 q_m(s)^2\,ds={1\over2\pi m}{dx\over1+x^2}
              =-{1\over2\pi m}\,d\beta.           \tag{2.5}
\]

Since the lower endpoint for sampler `m` is
`beta=arcsin(1/m)`, summing the equal-sampler slow terms with the two
Fejer factors gives exactly (0.5)--(0.6).  This explains both the support
`m<=csc(beta)` and the mandatory square `omega_H(m)^2`.  At `H=1`, only
`m=1` remains and its coefficient is `1/4`, so a cutoff-uniform comparison
with the unweighted limiting matrix is false.

It remains to bound the terms discarded in that extraction.  On the
regular Jost shells, difference-phase integration for `m,l>=2`, `m!=l`,
and sum-phase integration give summable majorants of the forms

\[
 {C Q^B\over cml(1+|m-l|)},\qquad
 {C Q^B\over cml(m+l)}.                             \tag{2.6}
\]

For the fast equal-sampler phase the corresponding majorant is
`C Q^B/(c m^2)`.  If exactly one sampler is hard, put `N=l`.  The
principal carrier geometry, ordinary stationary phase, and the
endpoint-length alternative give

\[
 {C Q^B\over\sqrt c\,l^2}\,{\mathbf 1}_{l\lesssim c}
 \quad\hbox{and}\quad
 {C Q^B\over l^{5/2}}\,{\mathbf 1}_{l\gtrsim c},          \tag{2.7}
\]

respectively.  The second bound is deliberately not replaced by a false
global amplitude estimate.  For `l<=c^(1/4)`, the reciprocal critical
point `x_1=1/l` remains in the Jost range, so the first estimate applies
directly to the exact Jost row.

For `l>c^(1/4)`, the principal carrier is not promoted termwise through
the hard endpoint.  Instead use the complete endpoint-null divided
difference.  Since the range of `J_Q` lies in `ker(eta)`, the exact
weighted-tail theorem gives

\[
 \|R_lUJ_Q\|_{\ell^2\to L^2}^2\leq C Q^3l^{-4},
 \qquad
 \left\|\sum_{l>c^{1/4}}\omega_H(l)R_lUJ_Q\right\|
 \leq C Q^{3/2}c^{-1/4}.                            \tag{2.7a}
\]

The `l=1` compressed row has polynomial-`Q` norm, so its cross with
(2.7a) is `O(Q^B c^(-1/4))`.  This is the only point in the Gram proof
where endpoint-null compression, rather than a pure-label entry estimate,
is essential.  The hard-hard piece missing from the Jost slow integral
has the same bound by the hard Liouville energy.  The complete Volterra
correction has an additional summable `Q^2/c` factor on regular shells.

The surviving derivative endpoint jet does not invalidate (2.7a).  Its
isolated `B_2` Bernoulli profile is a diagnostic term, not a positive
independent summand of the complete Gram and not a lower bound for it.
The higher endpoint hierarchy and Volterra terms are resummed into the
complete divided difference before norms are taken.  Only that complete
profile is used in (2.7a).

Every Fejer weight lies in `[0,1]`; hence all preceding majorants are
uniform in `H`.  Regular sampler sums bound the corresponding
pure-label entries by `C Q^B c^(-eta)`.  After congruence by the isometry
`J_Q`, (2.7a) controls the remaining hard tail.  Hilbert--Schmidt
summation is used only across the `Q+1` modal labels, absorbing one
further polynomial in `Q`.  The normalization and phase-index errors in
(2.3) obey the same bound.  This proves the compressed estimate (0.9).

No uncompressed pure-label norm estimate is proved.  There is also no
deleted ordinary endpoint row in the direct unshifted `L2` correlation:
the exact hard endpoint is retained.  The ordinary lower-end row discussed
in Section 4 arises in shifted or multiplier integrations.

For complex `z=(z_0,...,z_Q)`, cosine polarization gives

\[
 z^*T_{Q+1,H}z={1\over2}\int_0^{\pi/2}w_H(\beta)
 \left\{
 \left|\sum_{j=0}^Qz_je^{4ij\beta}\right|^2+
 \left|\sum_{j=0}^Qz_je^{-4ij\beta}\right|^2
 \right\}d\beta.                                   \tag{2.8}
\]

Because `m=1` is present throughout the interval,

\[
 w_H(\beta)\geq {\omega_H(1)^2\over2\pi},
 \qquad \omega_H(1)={H\over H+1}\geq{1\over2}.    \tag{2.9}
\]

Both exponential systems are orthogonal on `[0,pi/2]`.  Equations
(2.8)--(2.9) prove the lower bound in (0.10).  Also

\[
 w_H(\beta)\leq C\log{e\over\beta}
 \quad(0<\beta\leq\pi/4),\qquad
 \sup_{\pi/4\leq\beta\leq\pi/2}w_H(\beta)\leq C.  \tag{2.10}
\]

Thus every interval `I` of length `h<=1/4` obeys

\[
 \int_Iw_H(\beta)\,d\beta
 \leq Ch\log(e/h).                                  \tag{2.11}
\]

The finite-resolution Fourier embedding at scale
`h=(Q+1)^(-1)` proves the upper bound in (0.10).

## 3. Centered-principal Carleson estimate

The principal local frequency is obtained from

\[
 {d\over ds}\phi_j(x_m(s))
 =c\{x_m+x_m^{-1}\}-\nu_{4j}x_m^{-1}.               \tag{3.1}
\]

Dropping the lower-order label term and using `x=cot(beta)` gives

\[
 x+x^{-1}={1\over\sin\beta\cos\beta}.               \tag{3.2}
\]

This identifies (0.11)--(0.12) as the centered principal symbol.  It does
not identify the action of `a(D)` on the exact, zero-extended profile.

Uniform digamma bounds imply

\[
 |g_c(\beta)|\leq C\left\{1+
 \log{1\over\min(\beta,\pi/2-\beta)}\right\}.       \tag{3.3}
\]

Combining (2.10) with (3.3) gives, uniformly in `H` and `c`,

\[
 \sup_{|I|=h}\int_Iw_H(\beta)|g_c(\beta)|\,d\beta
 \leq Ch\log^2(e/h),\qquad0<h\leq1/4.              \tag{3.4}
\]

Apply the finite-resolution Fourier embedding to the positive measure
`w_H|g_c|d beta` at scale `(Q+1)^(-1)`.  Domination of the signed
quadratic form by that positive embedding proves (0.13).  Pointwise,

\[
 g_c(\beta)\longrightarrow
 \log{1\over2\pi\sin\beta\cos\beta}
 \qquad(c\longrightarrow\infty),                   \tag{3.5}
\]

so the limiting principal density is
`w(beta) log[(2 pi sin(beta) cos(beta))^(-1)]`.

## 4. Endpoint-row audit and the exact centered gates

In pure defect-white modal coordinates, let

\[
 \epsilon_Q=\left({e_{4j}\over\sqrt {d_{4j}}}\right)_{j=0}^Q.        \tag{4.1}
\]

The ordinary lower-end part of the exact finite profile synthesis first
factors as `b_(end,H) epsilon_Q^*`.  Consequently fixed-pair integration
by parts for a shifted profile or for a zero-extended multiplier produces
a Hermitian boundary matrix of the factorized form

\[
 E_{{\rm end},H,Q}=\epsilon_Qu_{H,Q}^*
                  +u_{H,Q}\epsilon_Q^*.             \tag{4.2}
\]

This row is generally `c`-independent and is **not**
`O(Q^B c^(-eta))` as an uncompressed pure-label matrix.  The exact
endpoint shear is designed so that

\[
 \epsilon_Q^*J_Q=0,
 \qquad J_Q^*E_{{\rm end},H,Q}J_Q=0.                 \tag{4.3}
\]

Thus one must extract (4.2) first and kill it only after the actual
`C_Q^#`/`J_Q` compression.  The same rule applies to ordinary endpoint
rows in prime, reflected, and hard-core calculations.  It is not valid to
declare such a row power-small in pure coordinates.

After that extraction, the exact logarithmic-WKB target would be

\[
 \boxed{
 \sup_{H\geq1}\left\|
 2(B_{H,Q}^\#)^*\{a(D)-\log c\}B_{H,Q}^\#
       -J_Q^*A_{Q+1,H}^{(c)}J_Q\right\|
 \leq C Q^Bc^{-\eta}.}                              \tag{4.4}
\]

Equation (4.4) is unproved.  The shell BV hierarchy controls local
radial symbols, but it does not by itself prove this nonlocal
functional-calculus estimate.

There is a weaker sufficient route that does not identify the local
Toeplitz density.  Let `Pi_<` be the Fourier projector to `|xi|<c/2`.
For one fixed `0<delta<1/2`, it would suffice to prove

\[
 \sup_{H\geq1}\|(B_{H,Q}^\#)^*\Pi_<B_{H,Q}^\#\|
       \leq C Q^Bc^{-\eta},                          \tag{4.5}
\]

\[
 \sup_{H\geq1}c^{-2\delta}
       \||D|^\delta B_{H,Q}^\#\|_{\ell^2\to L^2}^2
 \leq C Q^{2\delta}\log(Q+2).                      \tag{4.6}
\]

Indeed, on `|xi|>=c/2`,

\[
 |a(\xi)-\log c|
 \leq C_\delta\{1+(|\xi|/c)^{2\delta}\},           \tag{4.7}
\]

while the low-frequency part costs at most `C log(c)` times (4.5).
Equations (0.9)--(0.10) and (4.5)--(4.7) would give

\[
 \sup_H\|2(B_{H,Q}^\#)^*\{a(D)-\log c\}B_{H,Q}^\#\|
 \leq C_\delta Q^{2\delta}\log(Q+2)+C Q^Bc^{-\eta}\log c=o(L).
                                                               \tag{4.8}
\]

The restriction `delta<1/2` is compatible with a zero-extended endpoint
jump.  Neither (4.5) nor the global operator-frame estimate (4.6) is
proved by the present Jost note.  They are recorded as an alternative sufficient centered-multiplier gate,
not as a theorem of this package.

## 5. Exact equality allocation and the remainder boundary

For reference, at a prime shift `log n` the common radial sampler is exactly

\[
 m=nl.                                               \tag{5.1}
\]

At finite cutoff its slow Hermitian coefficient has density

\[
 v_H(\beta)={1\over\pi}
 \sum_{\substack{n\geq2,\ l\geq1\\nl\leq\csc\beta}}
 {\Lambda(n)\over nl}\omega_H(nl)\omega_H(l).      \tag{5.2}
\]

One ordered correlation contributes

\[
 {1\over4\pi l\sqrt n}
 \int_0^{\arcsin(1/(nl))}\cos(4(j-k)\beta)\,d\beta.                \tag{5.3}
\]

Multiplication by `-2 Lambda(n)/sqrt(n)` and addition of the two
orientations gives exactly minus the cosine coefficient of (5.2).  This
checks the equality allocation and both Fejer slots without a mask or a
midpoint row.  Chebyshev partial summation gives

\[
 \sup_{|I|=h}\int_Iv_H(\beta)\,d\beta
 \leq Ch\log^2(e/h),                                \tag{5.4}
\]

so this equality-principal matrix alone is `O(log^2(Q+2))`.

Nothing in (5.1)--(5.4) estimates the complete non-equality same-side
operator.  In particular, its ordinary lower-end term must be handled by
(4.2)--(4.3), and its remaining regular, hard, and Volterra pieces still
need one cutoff-uniform compressed estimate.  The reflected principal
frames likewise do not supply their complete analytic remainder.  The
state-invisible origin correction is retained in that remainder; no
`Q^B c^(-eta)` estimate for it is asserted here.

A convenient fail-closed target is

\[
 \boxed{\text{Target }\mathrm{OT\!-\!REM}:\quad
 \|(R_{H,Q}^\#)_-\|=o(L)\quad\hbox{uniformly in }H,}  \tag{5.5}
\]

where `R_(H,Q)^#` is the exact outer form after extraction of the Gram,
the centered principal symbol, the equality principal, the proved
reflected principal frames, and every factorized endpoint row.  Target
`OT-REM` includes the non-equality same-side fold, the complete reflected
remainder, the quartic and hard cores, all Jost/Volterra replacements,
the exact origin correction, and the full source congruence.  It is not
proved here.

## 6. Ordered limit and no floor conclusion

At fixed `c,Q`, the sampler weights converge pointwise to one.  The
summable Gram majorants in (2.6)--(2.7a) justify the ordered limit in
(0.9).  Also

\[
 w_H(\beta)\uparrow
 w(\beta)={1\over2\pi}\sum_{m\leq\csc\beta}{1\over m},
 \qquad T_{Q+1,H}\longrightarrow T_{Q+1},           \tag{6.1}
\]

and (2.8) gives

\[
 T_{Q+1}\succeq {1\over4}I.                         \tag{6.2}
\]

The domination in (3.4) similarly justifies the fixed-`c,Q` ordered
limit of the centered **principal** matrix.  No ordered-limit assertion
is made for the unproved exact multiplier or for `OT-REM`.

For corrected zero-integral columns, the pinned outer identity is

\[
 Q_X={\cal W}_Z(O,O).                                \tag{6.3}
\]

Equations (0.9)--(0.13) do not by themselves control every signed term in
(6.3).  A low-prefix floor would require either (4.4), or the weaker
(4.5)--(4.6), together with `OT-REM`.  Consequently this theorem makes no
complete signed-floor or projection-transfer claim.

## 7. Reproduction

Run the focused regression with

```text
python3 -B -m unittest \
  tests.test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem -v
```

The test checks the squared Fejer symbol, the finite-cutoff and limiting
floors, complex cosine polarization, the centered log-squared Carleson
scale, the exact equality-prime factor, full-metric isometry, frozen
hashes, fail-closed scope, ASCII hygiene, and displayed TeX.
