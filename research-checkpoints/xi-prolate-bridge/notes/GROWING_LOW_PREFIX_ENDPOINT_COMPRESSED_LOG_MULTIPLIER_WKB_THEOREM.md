# Growing low-prefix endpoint-compressed logarithmic-multiplier WKB theorem

> **Status: UNADMITTED DRAFT.**  The focused regression checks algebra,
> normalization, and hygiene only.  Lemma 3.1 and its global radial
> application still require an independent strict analytic audit.  This
> file is not a frozen dependency and must not be used as an admitted
> theorem.

## 0. Result and exact scope

Use

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad Q\leq C_0L,                                  \tag{0.1}
\]

and the same-phase pure modal inventory

\[
 {\cal I}_Q=\{0,4,8,\ldots,4Q\}.                    \tag{0.2}
\]

For the finite Fejer cutoff put

\[
 \omega_H(m)=\left(1-{m\over H+1}\right)_+,
 \qquad H\geq1,                                     \tag{0.3}
\]

and let \({\cal B}_{H,Q}\) synthesize the complete one-tail physical
profiles of the pure defect-white modes.  All profiles are extended by
zero to the negative half-line.  Define

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}
                   +{i\xi\over2}\right)-\log\pi,
 \qquad b_c(\xi)=a(\xi)-\log c.                      \tag{0.4}
\]

Let \(C_Q^\#\) be the actual endpoint-sheared modal synthesis on the
rest, not an abstract coordinate replacement, and set

\[
 D_Q^\#=(C_Q^\#)^*\operatorname {diag}(d_n)C_Q^\#,
 \qquad
 J_Q=\operatorname {diag}(\sqrt {d_n})C_Q^\#
                    (D_Q^\#)^{-1/2}.                 \tag{0.5}
\]

The inverse is taken on the quotient by the kernel.  Then

\[
 J_Q^*J_Q=I,
 \qquad \epsilon^*J_Q=0,
 \qquad \epsilon_n={e_n\over\sqrt {d_n}}.           \tag{0.6}
\]

For

\[
 w_H(\beta)={1\over2\pi}
    \sum_{m\leq\csc\beta}{\omega_H(m)^2\over m},
 \qquad
 \ell(\beta)=\log {1\over2\pi\sin\beta\cos\beta}, \tag{0.7}
\]

let

\[
 T_{Q+1}(w_H\ell)=
 \left(\int_0^{\pi/2}w_H(\beta)\ell(\beta)
       \cos(4(j-k)\beta)\,d\beta\right)_{j,k=0}^Q.  \tag{0.8}
\]

There are fixed \(B_0<\infty\) and \(\eta_0>0\), independent of
\(H,Q,c\), such that

\[
\boxed{
 \sup_{H\geq1}\left\|
 2({\cal B}_{H,Q}J_Q)^*b_c(D)({\cal B}_{H,Q}J_Q)
 -J_Q^*T_{Q+1}(w_H\ell)J_Q
 \right\|
 \leq C Q^{B_0}c^{-\eta_0}.}                        \tag{0.9}
\]

This is the finite-Fejer logarithmic-multiplier estimate left open as
equation (7.8) of the phase-absorbed Jost theorem.  In particular,

\[
 \sup_H\left\|
 2({\cal B}_{H,Q}J_Q)^*b_c(D)({\cal B}_{H,Q}J_Q)
 \right\|\leq C\log^2(Q+2).                         \tag{0.10}
\]

The proof has two structural points which cannot be replaced by shell BV.
First, the ordinary lower-end packet is factored at finite cutoff and is
killed only by (0.6), after the actual endpoint shear and full-metric
whitening.  Second, the remaining endpoint hierarchy is kept as one exact
spectral divided difference.  The derivative/\(B_2\) row is never split
off and bounded as an independent positive profile.

Equation (0.9) is only a centered same-side Archimedean theorem.  It does
not bound the signed non-equality prime block, the reflected Stieltjes
quadrature, the quartic complete core, the pole/projection cross, or the
physical high complement.  It therefore proves no complete signed floor,
determinant or zero theorem, equation (5.2) of `DIRECT_RH_ATTACK.md`, or
Riemann-hypothesis conclusion.  The formal state remains `P0_INVALIDATED`,
and the standard eight are unchanged.

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

The Jost theorem supplies the phase-absorbed finite derivative class,
the defect-white normalization, and the hard Liouville graph.  The tail
theorem supplies the exact divided-difference resummation, the hard
fractional graph, and the full-metric endpoint congruence.  The fixed
prefix theorem fixes the physical factor and the Toeplitz normalization.

No termwise endpoint-jet expansion is an input.  Section 9 of the tail
theorem explicitly warns that powers of \(c^2\) enter the higher endpoint
recurrence.  Its complete outgoing divided difference, rather than its
isolated \(B_2\) diagnostic, is used below.

## 2. Exact finite-cutoff lower-end factorization

For \(n\in{\cal I}_Q\), write

\[
 F_n(t)={{\cal F}_ah_{n,\lambda}(t)\over e_n},
 \qquad \epsilon_n={e_n\over\sqrt {d_n}}.            \tag{2.1}
\]

If \(z\) is a pure defect-white coefficient vector, its exterior Fourier
row is exactly

\[
 H_z(t)=\sum_{n\in{\cal I}_Q}z_n\epsilon_nF_n(t).    \tag{2.2}
\]

Choose any reference label \(r\in{\cal I}_Q\).  Linearity gives, before
any limit and before any estimate,

\[
 H_z=F_r\epsilon^*z+
       \sum_nz_n\epsilon_n(F_n-F_r).                 \tag{2.3}
\]

Let \({\cal S}_H\) be the exact finite-Fejer physical sampling map.  Thus
\({\cal B}_{H,Q}z={\cal S}_HH_z\).  Put

\[
 b_{r,H}={\cal S}_HF_r,
 \qquad
 \widetilde{\cal B}_{H,Q}z
 = {\cal S}_H\sum_nz_n\epsilon_n(F_n-F_r).           \tag{2.4}
\]

Then the lower-end factorization is the exact operator identity

\[
 \boxed{{\cal B}_{H,Q}
 =b_{r,H}\epsilon^*+\widetilde{\cal B}_{H,Q}.}       \tag{2.5}
\]

It holds for every \(H\).  It is not a limiting Poisson formula and does
not require separate convergence of a conditional sawtooth series.

To check the compression, endpoint nullity of the transformed rest says

\[
 e^*C_Q^\#=0.                                        \tag{2.6}
\]

Direct multiplication, with no estimate on the condition number of the
triangular shear, gives

\[
 \epsilon^*J_Q
 =e^*C_Q^\#(D_Q^\#)^{-1/2}=0.                       \tag{2.7}
\]

Consequently

\[
 {\cal B}_{H,Q}J_Q=\widetilde{\cal B}_{H,Q}J_Q.      \tag{2.8}
\]

For completeness, let \(A_c=b_c(D)\),

\[
 \gamma_H=\langle A_cb_{r,H},b_{r,H}\rangle,
 \qquad u_H=\widetilde{\cal B}_{H,Q}^*A_cb_{r,H}.   \tag{2.9}
\]

The full centered matrix has the exact decomposition

\[
 2{\cal B}_{H,Q}^*A_c{\cal B}_{H,Q}
 =E_{{\rm end},H,Q}
  +2\widetilde{\cal B}_{H,Q}^*A_c
          \widetilde{\cal B}_{H,Q},                 \tag{2.10}
\]

where

\[
 E_{{\rm end},H,Q}
 =2\{\gamma_H\epsilon\epsilon^*
          +\epsilon u_H^*+u_H\epsilon^*\}.          \tag{2.11}
\]

Equations (2.7) and (2.11) prove

\[
 \boxed{J_Q^*E_{{\rm end},H,Q}J_Q=0.}               \tag{2.12}
\]

This is the required lower-end audit.  In particular, neither an
unsheared modal calculation nor shell BV is allowed to set (2.11) to
zero.

The small values \(F_n(\lambda)-F_r(\lambda)=\chi_n-\chi_r\) are not
discarded in (2.4).  The hard divided-difference graph splits them into
an exponentially small common residual and a zero-initial inhomogeneous
solution.  Both are retained in Sections 4 and 5.

## 3. The logarithmic functional-calculus lemma

The functional-calculus step uses an exact kernel identity.  For real
\(\xi,p\), the integral representation of the digamma function gives

\[
 \boxed{
 a(\xi)-a(p)=\int_0^\infty {e^{-t/4}\over1-e^{-t}}
       \{\cos(pt/2)-\cos(\xi t/2)\}\,dt.}            \tag{3.1}
\]

The integral is convergent as a difference at the origin.  Its sign and
the factor \(1/2\) follow by inserting
\(z=1/4+i\xi/2\) in

\[
 \psi(z_1)-\psi(z_2)
 =\int_0^\infty {e^{-z_2t}-e^{-z_1t}\over1-e^{-t}}\,dt. \tag{3.2}
\]

We record the precise radial consequence of (3.1).

### Lemma 3.1 (causal logarithmic WKB)

Let a finite family of causal packets have the form

\[
 v_\alpha(s)=A_\alpha(s)e^{i\phi_\alpha(s)},
 \qquad p_\alpha=\phi_\alpha'>0.                    \tag{3.3}
\]

Suppose a bounded-overlap partition gives, on each piece,

\[
 p_\alpha\asymp P_\alpha\geq c,
 \qquad
 |\partial_s^kp_\alpha|\leq C_kP_\alpha R_\alpha^k,
 \qquad
 R_\alpha P_\alpha^{-1/2}+{R_\alpha\over P_\alpha}
       \leq\varepsilon,                              \tag{3.4}
\]

for \(1\leq k\leq N\), and the correspondingly scaled derivatives of
\(A_\alpha\) have an \(\ell^1\)-summable \(L^2\), trace, and variation
majorant \({\cal N}_N\).  Then, for fixed sufficiently large \(N\),

\[
 \left\|a(D)\sum_\alpha v_\alpha
       -\sum_\alpha a(p_\alpha)v_\alpha\right\|_2
 \leq C_N\varepsilon{\cal N}_N
       +C_N\sum_\alpha P_\alpha^{-1/2}|A_\alpha(0)|. \tag{3.5}
\]

The same statement holds for negative phases because \(a\) is even.
The bound is unchanged if each packet is multiplied by a number in
\([0,1]\).

**Proof.**  Insert (3.1), use

\[
 \langle\cos(tD/2)v,v_0\rangle
 ={1\over2}\int_{\mathbb R}
 \{v(s+t/2)+v(s-t/2)\}\overline {v_0(s)}\,ds,        \tag{3.6}
\]

and apply the bounded-overlap partition before taking absolute values.
On a piece with frequency \(P=P_\alpha\), split the \(t\) integral at

\[
 t_P=P^{-3/4}.                                       \tag{3.7}
\]

For \(0<t<t_P\), Taylor's formula gives

\[
 \begin{aligned}
 |A(s+t/2)-A(s)|&\leq C tR\,{\cal M}_1A(s),\\
 |\phi(s+t/2)-\phi(s)-tp(s)/2|
       &\leq C t^2PR\,{\cal M}_2(s),
 \end{aligned}                                      \tag{3.8}
\]

where the local maximal functions have the same bounded-overlap
\(L^2\) majorant.  Since
\(e^{-t/4}/(1-e^{-t})=t^{-1}+O(1)\), integration of
(3.8) costs

\[
 C\{Rt_P+PRt_P^2\}
 =C\{RP^{-3/4}+RP^{-1/2}\}.                         \tag{3.9}
\]

On the complementary part, integrate in the translation variable.
Every integration by parts gains \(P^{-1}\).  Derivatives falling on the
kernel cost at most \(t_P^{-1}=P^{3/4}\), while derivatives falling on a
packet cost \(R\).  Thus \(N\) integrations give a sum of terms bounded
by

\[
 C_N\sum_{j=0}^N(Pt_P)^{-N+j}(R/P)^j{\cal N}_N
 \leq C_N\{P^{-N/4}+\varepsilon\}{\cal N}_N.         \tag{3.10}
\]

The exponential tail \(t\geq1\) is smaller.  For a causal packet the
only unpaired integration-by-parts term is at \(s=0\).  On the region
\(|\xi-p(0)|\geq p(0)/2\), integration by parts in its Fourier transform
first gives the boundary summand

\[
 \left\|{A(0)e^{i\phi(0)}\over i\{p(0)-\xi\}}\right\|_{
          L^2(\{|\xi-p(0)|\geq p(0)/2\},d\xi)}
 \leq C p(0)^{-1/2}|A(0)|,                           \tag{3.11}
\]

which is the last term in (3.5).  Equations (3.9)--(3.10), dyadic
summation, and Schur's test prove (3.5).  Notice that the singular
\(t^{-1}\) kernel was never estimated by an absolute triangle before the
cosine difference was formed.  This is the functional-calculus argument
which shell BV alone would not provide.  \(\square\)

The power \(3/4\) in (3.7) is not optimized.  The lemma will be used with
\(RP^{-1/2}+R/P\leq Cc^{-1/8}\) at the worst Jost interface, so any fixed
positive output exponent is sufficient.

## 4. Verification of the WKB hypotheses after compression

On the Jost range, the pure packets are

\[
 B_{j,m}(s)=\kappa_jq_m(s)
 \{a_j(x_m)\sin\phi_j(x_m)
       +b_j(x_m)\cos\phi_j(x_m)\},                  \tag{4.1}
\]

\[
 q_m={1\over\sqrt{2\pi m x_m}},\qquad
 x_m=\sqrt{m^2e^{2s}-1},\qquad
 \phi_j=cx_m+\nu_{4j}\arctan(1/x_m).               \tag{4.2}
\]

The exact normalization is

\[
 \kappa_j={\epsilon_{4j}\over\sqrt{2\pi\lambda}}
 =1+O(c^{-1/4}).                                     \tag{4.3}
\]

For \(z=J_Qy\), equation (0.6) is exactly

\[
 \sum_{j=0}^Qz_j\kappa_j=0.                         \tag{4.4}
\]

Hence a positive outgoing principal amplitude may be written

\[
 q_m e^{i\nu_r\beta_m}
 \sum_jz_j\kappa_j
       \{e^{i(\nu_{4j}-\nu_r)\beta_m}-1\},
 \qquad \beta_m=\arctan(1/x_m).                     \tag{4.5}
\]

This identity is the sampler-level gain furnished by the exact
factorization (2.5).  For \(m\geq2\),

\[
 |\beta_m|+|\partial_s^k\beta_m|
 \leq {C_k\over me^s},                              \tag{4.6}
\]

For \(m=1\) at the lower end, use the arithmetic spacing of the selected
labels before estimating.  Since
\(\nu_{4j}=4j+1/2+O(Q^2/c)\) and
\(\pi/2-\beta_1=O(x_1)\),

\[
 \left|e^{i(\nu_{4j}-\nu_r)\beta_1}-1\right|
 \leq C Qx_1+{CQ^2\over c}.                          \tag{4.6a}
\]

Thus (4.5) cancels the common hard endpoint phase as well as the far
endpoint amplitude.  The remaining exact \(\chi_j-\chi_r\) boundary
value is the exponentially small residual in the hard graph.

Cauchy--Schwarz in the modal variable, used only here, gives for each
fixed \(N\)

\[
 \sum_{k=0}^N
 \{\|\partial_s^kA_{m,z}\|_{L^2([r,r+1])}
       +\operatorname {Var}_{[r,r+1]}
             \partial_s^kA_{m,z}\}
 \leq {C_NQ^{B_N}e^{-3r/2}\over m^2}\|y\|.         \tag{4.7}
\]

The Volterra correction is even smaller:

\[
 {CQ^{B_N}\over c}{e^{-5r/2}\over m^3}\|y\|.      \tag{4.8}
\]

Equations (4.7)--(4.8), not the unsummed \(m^{-1}\) pure envelope, make
all packet and boundary-trace majorants in Lemma 3.1 summable uniformly
in \(H\).

The local frequency is

\[
 p_{j,m}=c(x_m+x_m^{-1})-\nu_{4j}x_m^{-1}.           \tag{4.9}
\]

For \(m\geq2\), take \(R\asymp1\).  For \(m=1\) and
\(x\geq x_0=c^{-1/4}\), take

\[
 R(x)=1+x^{-2}.                                      \tag{4.10}
\]

The phase identities give

\[
 p\asymp c(x+x^{-1}),\qquad
 |\partial_s^kp|\leq C_kpR^k,
 \qquad {R\over p}\leq Cc^{-3/4},
 \qquad Rp^{-1/2}\leq Cc^{-1/8}.                   \tag{4.11}
\]

At \(x=x_0\), the near-kernel error in (3.9) is at worst

\[
 RP^{-1/2}\leq Cc^{-1/8}.                           \tag{4.12}
\]

Thus the apparent growth of \(\partial_s\log p\) at the Jost interface
does not invalidate the calculus: the relevant quantity is the slow
scale divided by the local frequency.

At the true hard end, the same-phase congruence cancels the common
regular solution.  The exponentially small
\(\chi_n-\chi_r\) piece and the zero-initial divided-difference graph of
the tail theorem give, for a smooth cutoff supported on \(x\leq2x_0\),

\[
 \|h_z\|_2^2\leq C Q^B c^{-1/4}\|y\|^2,
 \qquad
 \|\partial_sh_z\|_2^2\leq C Q^B c^2\|y\|^2.       \tag{4.13}
\]

For \(0<\delta<1/2\), zero extension and interpolation give

\[
 c^{-2\delta}\||D|^\delta h_z\|_2^2
 \leq C Q^B c^{-1/4+\delta/4}\|y\|^2.              \tag{4.14}
\]

The boundary strip in this interpolation is controlled by the exact
hard-edge translation estimate; no value at \(s=0\) is deleted.  Since

\[
 |b_c(\xi)|\leq
 \begin{cases}
 C\log c,&|\xi|\leq c/2,\\
 C_\delta\{1+(|\xi|/c)^{2\delta}\},&|\xi|>c/2,
 \end{cases}                                        \tag{4.15}
\]

equations (4.13)--(4.15) make both the exact hard contribution and its
local-symbol model \(O(Q^Bc^{-\eta})\).  This is a use of the complete
hard graph.  Isolating the derivative/\(B_2\) row would not prove (4.13)
and is forbidden.

Apply Lemma 3.1 to (4.7)--(4.12), add (4.14), and use
\(0\leq\omega_H\leq1\).  For some fixed \(\eta>0\),

\[
 \left\|b_c(D)\widetilde{\cal B}_{H,Q}J_Q
       -{\cal L}_{H,Q}J_Q\right\|
 \leq C Q^Bc^{-\eta},                               \tag{4.16}
\]

where \({\cal L}_{H,Q}\) applies \(b_c(p_{j,m})\) to each signed Jost
packet and retains the exact hard local model.  This is the promised
cutoff-uniform functional-calculus estimate.

## 5. Identification of the local matrix

It remains to identify the Hermitian form of \({\cal L}_{H,Q}\).  For an
equal sampler, the slow part of
\(2\sin\phi_j\sin\phi_k\) is

\[
 \cos\{(\nu_{4j}-\nu_{4k})\beta\},                  \tag{5.1}
\]

and

\[
 q_m(s)^2\,ds={1\over2\pi m}{dx\over1+x^2}
             =-{1\over2\pi m}\,d\beta.            \tag{5.2}
\]

Replacing \(p_{j,m}\) by
\(c(x+x^{-1})\) costs \(O(Q^2/c)\) in the symbol class.  Put

\[
 g_c(\beta)=a\!\left({c\over\sin\beta\cos\beta}\right)
                    -\log c.                         \tag{5.3}
\]

The equal-sampler slow matrix is therefore

\[
 T_{Q+1}(w_Hg_c)+O(Q^Bc^{-1/4}).                     \tag{5.4}
\]

The error includes the normalization in (4.3) and
\(\nu_{4j}=4j+1/2+O(Q^2/c)\).  It is estimated after compression, so a
fixed polynomial in \(Q\) is harmless.

All other local products are oscillatory.  For \(m,l\geq2\), the
difference-phase and sum-phase integrations have the summable
majorants

\[
 {CQ^B\{1+\log m+\log l\}
       \over cml(1+|m-l|)},
 \qquad
 {CQ^B\{1+\log m+\log l\}
       \over cml(m+l)},                              \tag{5.5}
\]

respectively.  The logarithms come from \(b_c(p)\); they do not spoil
either double sum.  If one sampler is \(1\), the reciprocal stationary
point and the endpoint-length alternative give

\[
 {CQ^B(1+\log l)\over\sqrt c\,l^2}
 +{CQ^B(1+\log l)\over c\,l^{5/2}}.                 \tag{5.6}
\]

Equation (5.6) is summable.  The hard part was already included in
(4.14), and every Volterra error has the extra factor in (4.8).  Thus
polarization of the quadratic estimate gives

\[
 \left\|2J_Q^*\widetilde{\cal B}_{H,Q}^*
       {\cal L}_{H,Q}J_Q-J_Q^*T_{Q+1}(w_Hg_c)J_Q
 \right\|\leq C Q^Bc^{-\eta}.                       \tag{5.7}
\]

Finally, the uniform digamma asymptotic is

\[
 a(\xi)=\log {|\xi|\over2\pi}+O(|\xi|^{-2}),
 \qquad |\xi|\geq c.                                \tag{5.8}
\]

Since \((\sin\beta\cos\beta)^{-1}\geq2\), equations
(0.7), (5.3), and (5.8) give

\[
 |g_c(\beta)-\ell(\beta)|\leq Cc^{-2}.              \tag{5.9}
\]

The finite-resolution embedding for \(w_H\) gives

\[
 \|T_{Q+1}\{w_H(g_c-\ell)\}\|
 \leq Cc^{-2}\log(Q+2).                             \tag{5.10}
\]

Equations (2.8), (4.16), and (5.7)--(5.10) prove (0.9).

## 6. Principal norm and ordered limit

For every interval \(I\subset(0,\pi/2)\) of length \(h\leq1/4\),

\[
 \int_Iw_H(\beta)|\ell(\beta)|\,d\beta
 \leq Ch\log^2(e/h).                                \tag{6.1}
\]

The finite-resolution Fourier embedding at
\(h=(Q+1)^{-1}\) therefore gives

\[
 \|T_{Q+1}(w_H\ell)\|\leq C\log^2(Q+2),             \tag{6.2}
\]

uniformly in \(H\).  Equations (0.9) and (6.2) prove (0.10).

At fixed \(c,Q\), the packet majorants (4.7)--(4.8) and
(5.5)--(5.6) are independent of \(H\).  Dominated convergence therefore
permits the ordered limit \(H\to\infty\).  This yields the unweighted
centered Toeplitz density, still after the endpoint shear and exact
full-metric whitening.

The state-invisible origin correction is not a modal column in (0.5).
Its rapidly decaying sampled transform remains a separate correction in
the complete outer ledger; it is not silently inserted into (0.9).

## 7. Reproduction

Run the focused regression with

```text
python3 -B -m unittest \
  tests.test_growing_low_prefix_endpoint_compressed_log_multiplier_wkb_theorem -v
```

The regression checks the digamma kernel sign and scale, the exact
endpoint factorization, annihilation only after \(C_Q^\#/D_Q^\#\)
compression, the divided-difference sampler gain, the WKB split
exponents, the hard fractional exponent, the limiting logarithmic
density, frozen hashes, ASCII hygiene, and displayed TeX.
