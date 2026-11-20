# Growing low-prefix outer floor assembly theorem

## 0. Result and ordered-limit scope

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,\qquad
 Q\leq C_0L,\qquad {\cal I}_Q=\{0,4,\ldots,4Q\}.       \tag{0.1}
\]

Let \(J_Q\) be the exact endpoint-sheared, full-exterior-white isometry,
and let \(B^\#_{H,Q}\) be the complete physical one-tail row with the
standard finite Fejer weights

\[
 \omega_H(m)=\left(1-{m\over H+1}\right)_+ .          \tag{0.2}
\]

The exact weighted Toeplitz Gram is

\[
 T_{Q+1,H}=(\Gamma_{j-k,H})_{0\leq j,k\leq Q},\qquad
 \Gamma_{r,H}={1\over2\pi}\sum_{m\geq1}{\omega_H(m)^2\over m}
 \int_0^{\arcsin(1/m)}\cos(4r\beta)\,d\beta .        \tag{0.3}
\]

At fixed \(c,Q\), form the complete pole--Archimedean--prime outer
distribution first and then take the ordered limit \(H\to\infty\).
Exact global radicality identifies that limit with the corrected
low-prefix compression \(\widehat Q_{X,Q}^\#\).

There are positive semidefinite operators \(P_Q\) and Hermitian errors
\(E_Q\) such that

\[
 \boxed{
 \widehat Q_{X,Q}^\#
  =(\log c)J_Q^*T_{Q+1}J_Q+P_Q+E_Q,}                 \tag{0.4}
\]

\[
 P_Q=P_{{\rm cont},Q}+P_{+,Q}\succeq0,               \tag{0.5}
\]

and

\[
\begin{split}
 \|(E_Q)_-\|\leq C\bigg\{&
 Q^{1/2}\{\log(Q+2)\}^{39/40}
 +Q^{20}c^{-1/4}\log c\\
 &+\sqrt Q\log^2(Q+2)+\log^2(Q+2)
 +Q^{B_0}c^{-\eta_0}\log c\bigg\}
 +\rho_{\rm bump}(c)=o(L),
\end{split}                                          \tag{0.6}
\]

The limiting Toeplitz matrix has the exact quarter floor

\[
 T_{Q+1}\succeq {1\over4}I,\qquad J_Q^*J_Q=I.        \tag{0.7}
\]

Consequently

\[
 \boxed{
 \widehat Q_{X,Q}^\#
 \succeq\left\{{1\over4}\log c-o(L)\right\}I
 \succeq {L\over8}I}                                \tag{0.8}
\]

for all sufficiently large locked \(\lambda\), uniformly for
\(Q\leq C_0L\).

If \(\widehat\Sigma_{N,Q}^\#\) is the actual compact-projected signed
matrix of the complete-central reduction, then

\[
 \|\widehat\Sigma_{N,Q}^\#-\widehat Q_{X,Q}^\#\|
 \leq\delta_q,\qquad\delta_q=o(L),                   \tag{0.9}
\]

Here \(q\asymp\lambda^2\) is the complete-central theorem's full
inventory parameter.  Equation (0.9) is its already proved scalar error
restricted and congruenced to the low prefix; it is not a new estimate
obtained by replacing \(q\) with \(Q\).  Using the stronger first bound
in (0.8), increase the locked threshold until
\(\widehat Q_{X,Q}^\#\succeq3LI/16\) and \(\delta_q\leq L/16\).
Then

\[
 \boxed{\widehat\Sigma_{N,Q}^\#\succeq {L\over8}I.} \tag{0.10}
\]

This is an unconditional theorem only on the slowly growing, endpoint-
sheared low prefix in its exact full exterior metric.  It is not a
physical high-complement or quotient comparison, a determinant or zero
theorem, equation (5.2) of DIRECT_RH_ATTACK.md, or a Riemann-hypothesis
conclusion.  The project state remains P0_INVALIDATED, and the standard eight are unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| notes/GROWING_LOW_PREFIX_OUTER_TOEPLITZ_CENTERED_MULTIPLIER_THEOREM.md | b08aef1bc818545f23f3f0d2dcf0c5a089c7ed9d409ed51019e0ce8f1370db44 |
| tests/test_growing_low_prefix_outer_toeplitz_centered_multiplier_theorem.py | 16944150af74b97ff3279b0cf35dc118adedd86295502d436ed9c173be649ba7 |
| notes/GROWING_LOW_PREFIX_ENDPOINT_FACTORED_FRACTIONAL_FRAME_THEOREM.md | 6f0385a37476079991c45497e88664d49c0e13a5661026966f9d3bb22ee4f404 |
| tests/test_growing_low_prefix_endpoint_factored_fractional_frame_theorem.py | cf03e6e7a4254403bc4fb75469a90b926e4525455693cd5a1c5decc78b12640e |
| notes/GROWING_LOW_PREFIX_ENDPOINT_COMPRESSED_SAME_SIDE_PRIME_REMAINDER_THEOREM.md | a0a44e3d0030691ab987379b5f60366aade7430a37bc55850a5e76068d270c9f |
| tests/test_growing_low_prefix_endpoint_compressed_same_side_prime_remainder_theorem.py | dc899033544d4bbac75d4fcee0cb1ba50c40e57993f07d5a1b28e972968cae65 |
| notes/GROWING_LOW_PREFIX_OUTER_NON_EQUALITY_REMAINDER_THEOREM.md | a5378945cc1324db820b5f01c65184dd5b1777792e6145d199e6016615f34c9d |
| tests/test_growing_low_prefix_outer_non_equality_remainder_theorem.py | 3760f2836ef4440c6cbbab767dd91357adfeaf5a7ad19c13e55104f1b143f07e |
| notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md | 6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9 |
| tests/test_growing_transition_complete_central_form_reduction.py | a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de |

The unadmitted logarithmic-WKB draft is not an input.  The exact centered
multiplier estimate used below is only the strict-PASS endpoint-factored
fractional theorem.

## 2. Exact outer ledger

At finite Fejer cutoff the same-side Archimedean form is exactly

\[
 {\cal A}_{H,Q}
 =2(B^\#_{H,Q})^*a(D)B^\#_{H,Q},\qquad
 a(\xi)=\operatorname {Re}\psi\left({1\over4}
             +{i\xi\over2}\right)-\log\pi .          \tag{2.1}
\]

Insert and subtract \(\log c\):

\[
\begin{split}
 {\cal A}_{H,Q}
 ={}&(\log c)\,2(B^\#_{H,Q})^*B^\#_{H,Q}\\
 &+2(B^\#_{H,Q})^*\{a(D)-\log c\}B^\#_{H,Q}.
\end{split}                                          \tag{2.2}
\]

The cutoff-matched Gram theorem gives

\[
 2(B^\#_{H,Q})^*B^\#_{H,Q}
 =J_Q^*T_{Q+1,H}J_Q+E_{{\rm Gram},H,Q},\qquad
 \sup_H\|E_{{\rm Gram},H,Q}\|\leq C Q^Bc^{-\eta}.    \tag{2.3}
\]

The displayed Gram is first proved for the modal row.  For the locked
state-invisible origin correction, the repaired FIO reduction supplies
the exact full-metric dual estimate

\[
 |f(0)|^2\leq {CL\over\lambda}D^\#(f).               \tag{2.3a}
\]

The scaled bump has a uniformly Schwartz sampled transform, whose
finite-Fejer row has squared norm at most \(C|f(0)|^2/\lambda\).
Consequently its Gram self term is \(O(L/c)\), and its cross with the
modal row is

\[
 O\left(\sqrt{L\log(Q+2)/c}\right).                  \tag{2.3b}
\]

These bounds remain power-small after multiplication by \(\log c\) and
are absorbed into \(E_{{\rm Gram},H,Q}\).  The strict fractional theorem
already includes the same bump in (2.4), while OT-REM includes its prime
and reflected self and cross terms.  Thus (2.3) applies to the actual
corrected row in the exact full metric.

The strict-PASS fractional theorem gives

\[
\begin{split}
 \sup_H\left\|
 2(B^\#_{H,Q})^*\{a(D)-\log c\}B^\#_{H,Q}\right\|
 \leq{}&C Q^{1/2}\{\log(Q+2)\}^{39/40}\\
 &+C Q^{20}c^{-1/4}\log c.
\end{split}                                          \tag{2.4}
\]

Every actual \(\epsilon_Q\) endpoint row has already been factored before
the \(J_Q\) compression in both inputs.  No endpoint, mask, or midpoint row is appended to (2.2).

## 3. Exact equality prime block

Split the same-side prime form by the exact condition \(m=ql\).  Its
equality part is written with
\(\Phi_z:=\Phi J_Qz\) as

\[
 {\cal S}_{{\rm eq},H,Q}[z]
 =-4\sum_{q\geq2,\ l\geq1}\Lambda(q)
   \omega_H(ql)\omega_H(l)\|R_{ql}\Phi_z\|_2^2.      \tag{3.1}
\]

This displayed equality block is the modal block.  It includes both
ordered orientations and has the physical
\(\Phi=U/(2\sqrt2)\) normalization.  Its principal slow-phase density is

\[
 v_H(\beta)={1\over\pi}
 \sum_{\substack{q\geq2,\ l\geq1\\ql\leq\csc\beta}}
 {\Lambda(q)\over ql}\omega_H(ql)\omega_H(l).        \tag{3.2}
\]

Chebyshev partial summation and finite-resolution embedding give

\[
 \|T_{Q+1}(v_H)\|\leq C\log^2(Q+2).                  \tag{3.3}
\]

Write \(T_{Q+1}(v_H)\) for the pure modal cosine matrix in (3.3).
The exact slow/fast phase split gives

\[
 {\cal S}_{{\rm eq},H,Q}
 =-J_Q^*T_{Q+1}(v_H)J_Q+E_{{\rm eq},H,Q}.           \tag{3.3a}
\]

Every equality sampler is \(N=ql\geq2\), so no hard \(m=1\) endpoint
row occurs.  For the equal sampler, one BV integration by parts bounds
the fast phase by \(CQ^B/(cN^2)\).  Regrouping the two exact cutoff
slots gives

\[
 \sum_{N\geq2}{1\over N^2}
 \sum_{\substack{q\mid N\\q\geq2}}
 \Lambda(q)\omega_H(N)\omega_H(N/q)
 \leq\sum_{N\geq2}{\log N\over N^2}<\infty.         \tag{3.3b}
\]

The phase-absorbed Volterra row has an additional \(Q^2/c\) summable
shell factor.  The phase-index error is \(O(Q^2/c)\), while the
endpoint-white normalization error is \(O(c^{-1/4})\) times the
Carleson norm in (3.3).  Hilbert--Schmidt is used only over the
\(Q+1\) labels, and congruence by \(J_Q\) costs no condition number.
Consequently, for fixed \(B,\eta>0\),

\[
 \sup_H\|E_{{\rm eq},H,Q}\|\leq C Q^Bc^{-\eta}.     \tag{3.3c}
\]

Equations (3.3)--(3.3c) therefore give

\[
 \boxed{
 \sup_H\|{\cal S}_{{\rm eq},H,Q}\|
 \leq C\log^2(Q+2)+C Q^Bc^{-\eta}.}                 \tag{3.4}
\]

This is the complete equality block, not only a principal mask.  The
non-equality part is exactly the \(m\ne ql\) form of the endpoint-
compressed same-side theorem.

For the actual corrected columns, every same-side prime self or cross
term containing the state-invisible origin bump is placed in the single
\({\cal B}^{\rm prime}_{H,Q}\), before the modal equality split.  The
dual estimate (2.3a), its uniformly Schwartz sampled transform, and the
Hilbert-space Cauchy--Schwarz/Chebyshev estimate give

\[
 \sup_H\|{\cal B}^{\rm prime}_{H,Q}\|
 \leq\rho_{\rm bump}(c),\qquad
 \rho_{\rm bump}(c)=o(1).                            \tag{3.5}
\]

Thus bump self and cross terms, in both equality and non-equality sampler
positions, are allocated exactly once.  This is the same
\({\cal B}^{\rm prime}_{H,Q}\) included on the left of the OT-REM
identity in Section 4.  The reflected bump terms are already in its
actual corrected \({\cal R}_{H,Q}\), while the Archimedean bump terms
were allocated in Section 2.

## 4. Non-equality and reflected remainder

The OT-REM theorem gives, uniformly in \(H\),

\[
\begin{split}
 {\cal S}^{\rm neq}_{H,Q}+{\cal B}^{\rm prime}_{H,Q}
   +{\cal R}_{H,Q}
 ={}&P_{{\rm cont},H,Q}+P_{+,H,Q}\\
 &+K_{{\rm rec},H,Q}+K_{{\rm sym},H,Q}
   +{\cal E}_{H,Q}.
\end{split}                                          \tag{4.1}
\]

\[
 P_{{\rm cont},H,Q},P_{+,H,Q}\succeq0,\qquad
 \|K_{{\rm rec},H,Q}\|\leq C\log^2(Q+2),             \tag{4.2}
\]

\[
 \|K_{{\rm sym},H,Q}\|\leq C\sqrt Q\log^2(Q+2),
 \qquad\|{\cal E}_{H,Q}\|
 \leq C Q^Bc^{-\eta}+\rho_{\rm bump}(c).            \tag{4.3}
\]

This includes the complete quartic and hard-edge profiles, Volterra
terms, the state-invisible origin correction, the reflected logarithmic
tail with its negative sign, and every residual sampler boundary.  The
continuous reflected main and even pole are retained exact and positive.

## 5. Ordered limit and quarter floor

Let \({\cal Q}^{\rm out}_{H,Q}\) denote the complete finite-Fejer outer
distribution; it is not called \(Q_X\) before the ordered limit.  The
preceding allocations give the exact finite-cutoff identity

\[
 {\cal Q}^{\rm out}_{H,Q}
 =(\log c)J_Q^*T_{Q+1,H}J_Q
   +P_{{\rm cont},H,Q}+P_{+,H,Q}+E_{H,Q},            \tag{5.0a}
\]

where

\[
\begin{split}
 E_{H,Q}={}&(\log c)E_{{\rm Gram},H,Q}
 +2(B^\#_{H,Q})^*\{a(D)-\log c\}B^\#_{H,Q}\\
 &+{\cal S}_{{\rm eq},H,Q}
 +K_{{\rm rec},H,Q}+K_{{\rm sym},H,Q}
 +{\cal E}_{H,Q}.
\end{split}                                          \tag{5.0b}
\]

Thus the Gram, centered multiplier, complete modal equality, modal
non-equality, every same-side bump-prime term, and the full reflected
block occur exactly once.  Multiplication of the Gram error by
\(\log c\) only decreases a fixed power \(\eta\).  Equations
(2.3)--(2.4), (3.4), and (4.2)--(4.3) give (0.6) uniformly in \(H\).

The order of limits matters.  For each fixed \(c,Q\),

\[
 {\cal Q}^{\rm out}_{H,Q}\longrightarrow\widehat Q_{X,Q}^\#,
 \qquad
 T_{Q+1,H}\longrightarrow T_{Q+1},\qquad H\to\infty. \tag{5.1}
\]

The \(m=1\) summand alone has

\[
 \Gamma^{(1)}_{0}={1\over2\pi}\int_0^{\pi/2}d\beta
 ={1\over4},\qquad
 \Gamma^{(1)}_r=0\quad(r\ne0).                      \tag{5.2}
\]

All other sampler summands are positive Toeplitz Grams.  Hence (0.7)
follows without interchanging the \(H\) and \(c\) limits.  Since every
term on the right of (0.6) is \(o(L)\) for \(Q\leq C_0L\), equations
(0.8) and (0.10) follow.

## 6. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_low_prefix_outer_floor_assembly_theorem -v

The regression checks the quarter floor, ordered Fejer limit, equality
slots and normalization, sublinear ledgers, frozen hashes, fail-closed
scope, ASCII hygiene, and displayed TeX.
