# Projective low-mode determinant bridge

## 0. Claim boundary and purpose

Equation (5.2) of `DIRECT_RH_ATTACK.md` controls the complete `L2` angle
between the source-normalized projected prolate state and the exact finite
ground vector.  That is sufficient for locally uniform convergence of the
associated characteristic functions, but it is stronger than necessary.

This note proves an exact weaker bridge.  On every fixed closed substrip and
bounded real window, Fourier labels larger than `M` contribute at most

\[
 {2\sqrt2\over\pi}\lambda^\eta\sqrt{L\over M}
 \|P_{>M}f\|_2,\qquad L=2\log\lambda.                 \tag{0.1}
\]

Consequently, after an allowed nonzero scalar renormalization of each finite
ground vector, it is enough to approximate the prolate state only in the
low Fourier projection.  If the scalar stays bounded, the choice
`M=ceil(lambda)` makes an arbitrary bounded high-mode error invisible on
every fixed substrip `|Im z|<=eta<1/2`.

This changes the remaining analytic target from a complete eigenvector
angle to a projective low-mode angle.  It does not prove that angle, the
simple-even ground-state hypotheses, locally uniform convergence, equation
(5.2), or the Riemann hypothesis.  No real-zero table, global Weil
positivity, or numerical eigenvector is used.  The formal project state
remains `P0_INVALIDATED`.

## 1. Exact centered Fourier transform

Fix `lambda>1` and put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I_\lambda=[-L/2,L/2].                              \tag{1.1}
\]

Use the source-centered orthonormal modes

\[
 \phi_n(x)={(-1)^n\over\sqrt L}
       \exp\left({2\pi i n x\over L}\right),
 \qquad \omega_n={2\pi n\over L}.                  \tag{1.2}
\]

Every function is extended by zero outside `I_lambda`, and

\[
 \widehat f(z)=\int_{I_\lambda}f(x)e^{-izx}\,dx.     \tag{1.3}
\]

Direct integration, with removable values understood by continuity, gives

\[
 \boxed{
 \widehat{\phi_n}(z)
 ={2\sin(zL/2)\over\sqrt L\,(z-\omega_n)}.}          \tag{1.4}
\]

The centered factor `(-1)^n` is essential: it cancels the corresponding
factor from `sin(pi*n-zL/2)`.  Formula (1.4) is the same Cauchy transform
appearing in source equation (5.25) and in
`notes/DETERMINANT_LIMIT_AUDIT.md`.

For integers `0<=M<N`, let `P_M` be the orthogonal projection onto the modes
`|n|<=M` inside `E_N`.

## 2. A compact-window Fourier bound

For `B>=0` and `0<=eta<1/2`, put

\[
 K_{B,\eta}={z\in\mathbb C:|\operatorname {Re}z|\leq B,
                         |\operatorname {Im}z|\leq\eta\},
 \qquad T=\sqrt{B^2+\eta^2}.                       \tag{2.1}
\]

### Theorem 2.1 (low/high transform split)

Assume `M>=1`, `N>M`, and

\[
 {2\pi(M+1)\over L}\geq2T.                         \tag{2.2}
\]

Then every `f in E_N` satisfies

\[
 \boxed{
 \sup_{z\in K_{B,\eta}}|\widehat f(z)|
 \leq \sqrt L\,\lambda^\eta\|P_Mf\|_2
 +{2\sqrt2\over\pi}\lambda^\eta\sqrt{L\over M}
       \|(I-P_M)f\|_2.}                            \tag{2.3}
\]

**Proof.**  On `I_lambda`,

\[
 |e^{-izx}|\leq e^{\eta L/2}=\lambda^\eta.
\]

Cauchy--Schwarz therefore gives

\[
 |\widehat{P_Mf}(z)|
 \leq\sqrt L\,\lambda^\eta\|P_Mf\|_2.            \tag{2.4}
\]

Write `(I-P_M)f=sum_(M<|n|<=N)c_n phi_n`.  For such an `n`, (2.2) gives

\[
 |z-\omega_n|\geq|\omega_n|-|z|
 \geq{|\omega_n|\over2}={\pi|n|\over L}.          \tag{2.5}
\]

Also

\[
 |\sin(zL/2)|\leq e^{|\operatorname {Im}z|L/2}
 \leq\lambda^\eta.                                 \tag{2.6}
\]

Using (1.4), coefficient Cauchy--Schwarz, and

\[
 \sum_{|n|>M}{1\over n^2}
 \leq {2\over M},                                  \tag{2.7}
\]

we obtain

\[
 |\widehat{(I-P_M)f}(z)|
 \leq {2\sqrt2\over\pi}\lambda^\eta
       \sqrt{L\over M}\|(I-P_M)f\|_2.             \tag{2.8}
\]

Adding (2.4) and (2.8) proves (2.3).  \(\square\)

The estimate is uniform in the outer cutoff `N`.  It uses neither the Weil
matrix nor a spectral gap.

## 3. Scale-free determinant convergence criterion

Let `lambda_j` tend to infinity.  For each `j`, let `N_j` be finite, put

\[
 k_j=k_{\lambda_j}^+,
 \qquad p_j=P_{N_j}k_j\ne0,
 \qquad a_j=\|p_j\|_2,
 \qquad \kappa_j={p_j\over a_j},                   \tag{3.1}
\]

and let `xi_j` be a unit simple inversion-even lowest eigenvector of the
exact source Weil matrix.  These finite hypotheses make
`widehat(xi_j)` entire with only real zeros by the pinned determinant
theorem.

Choose any nonzero complex scalar `s_j` and define

\[
 d_j=s_j\xi_j-\kappa_j.                             \tag{3.2}
\]

The scalar is legitimate: multiplying the eigenvector by `s_j` multiplies
its entire transform by a nonzero constant and changes no zero.  Define the
correspondingly normalized entire function

\[
 F_j(z)=4a_js_j\widehat{\xi_j}(z).                  \tag{3.3}
\]

### Theorem 3.1 (projective low-mode RH bridge)

Let integers `1<=M_j<N_j` satisfy (2.2) eventually for every fixed
`B,eta`.  Suppose, for every fixed `eta<1/2`,

\[
 \sqrt{L_j}\lambda_j^\eta
 \|P_{N_j}k_j-k_j\|_2\longrightarrow0,             \tag{3.4}
\]

\[
 a_j\sqrt{L_j}\lambda_j^\eta
 \|P_{M_j}d_j\|_2\longrightarrow0,                \tag{3.5}
\]

and

\[
 a_j\lambda_j^\eta\sqrt{L_j\over M_j}
 \|(I-P_{M_j})d_j\|_2\longrightarrow0.            \tag{3.6}
\]

Then `F_j` converges locally uniformly to `Xi` on `|Im z|<1/2`.

**Proof.**  Since `p_j=a_j*kappa_j`,

\[
 a_js_j\xi_j-p_j=a_jd_j.                            \tag{3.7}
\]

Theorem 2.1 and the elementary support bound used in (2.4) give, on every
`K_(B,eta)`,

\[
\begin{aligned}
 |F_j(z)-4\widehat{k_j}(z)|
 \leq{}&4a_j\sqrt{L_j}\lambda_j^\eta
                 \|P_{M_j}d_j\|_2\\
 &+{8\sqrt2\over\pi}a_j\lambda_j^\eta
       \sqrt{L_j\over M_j}\|(I-P_{M_j})d_j\|_2\\
 &+4\sqrt{L_j}\lambda_j^\eta
       \|P_{N_j}k_j-k_j\|_2.                       \tag{3.8}
\end{aligned}
\]

The right side tends to zero by (3.4)--(3.6).  The corrected source limit
`4*widehat(k_j)->Xi` is locally uniform on the strip.  Hence `F_j->Xi`
locally uniformly.  \(\square\)

Every `F_j` in Theorem 3.1 has only real zeros, so the remaining final
Rouche--Hurwitz step is exactly the one already stated in
`DIRECT_RH_ATTACK.md`.  The theorem does not assert its own hypotheses.

## 4. A concrete lambda-scale sufficient target

The projected-state theorem gives `a_j` bounded above and eventually bounded
away from zero on the locked prolate schedule.  Suppose additionally that

\[
 M_j=\lceil\lambda_j\rceil,
 \qquad \|P_{M_j}\xi_j\|_2\geq c_0>0.               \tag{4.1}
\]

The explicit projection inequality also applies with cutoff `M_j`: its
Fourier-tail term is `O(log(lambda_j)/lambda_j)`, while its prolate-transfer
term is `O(lambda_j^(-1/2))`.  Since `M_j<N_j` and `a_j` stays away from
zero,

\[
 \|(I-P_{M_j})\kappa_j\|_2
 \leq {\|k_j-P_{M_j}k_j\|_2\over a_j}
 \longrightarrow0.                                \tag{4.2}
\]

Among all scalars, choose `s_j` to minimize

\[
 \|P_{M_j}(s\xi_j-\kappa_j)\|_2.                    \tag{4.3}
\]

If the minimum is `O(lambda_j^(-1/2))`, then it tends to zero while
`P_(M_j)kappa_j` tends to a unit vector, so the minimizing scalar is nonzero
eventually.  Moreover

\[
 |s_j|\leq{\|P_{M_j}\kappa_j\|_2\over
                 \|P_{M_j}\xi_j\|_2}\leq c_0^{-1},
 \qquad \|d_j\|_2\leq1+c_0^{-1}.                  \tag{4.4}
\]

For every fixed `eta<1/2`,

\[
 \lambda_j^\eta\sqrt{L_j\over M_j}
 =O\!\left(\lambda_j^{\eta-1/2}
                   \sqrt{\log\lambda_j}\right)\longrightarrow0.
                                                               \tag{4.5}
\]

The same rate turns an `O(lambda^(-1/2))` low projective error into (3.5).
Together with the already-proved projection rate (3.4), this yields the
following strictly weaker replacement for the complete chordal target:

\[
 \boxed{
 \inf_{s\in\mathbb C}
 \|P_{\lceil\lambda\rceil}(s\xi_{\lambda,N}
                    -\kappa_{\lambda,N})\|_2
 =O(\lambda^{-1/2}),
 \quad
 \|P_{\lceil\lambda\rceil}\xi_{\lambda,N}\|_2\geq c_0.}
                                                               \tag{4.6}
\]

No control of the complete `L2` angle is required in (4.6).  The remaining
problem is to prove this projective low-mode statement from source data on
one unbounded schedule while also proving the simple-even ground-state
hypotheses.

## 5. Exact localized forced-resolvent target

The projective scalar has an exact expression in the residual--Ritz block.
On the inversion-even sector, decompose relative to `kappa_j` as

\[
 Q_{j,+}=\begin{bmatrix}q_j&b_j^*\\ b_j&A_j\end{bmatrix},
 \qquad b_j=(Q_j-q_j)\kappa_j,                       \tag{5.1}
\]

where `A_j` acts on
`K_j=H_(j,+) intersect kappa_j^perp`.  Let `u_j` be the lower two-dimensional
Ritz value from equation (4.2) of `DIRECT_RH_ATTACK.md`, and assume the
strict sector hypotheses there, so that the global ground value `mu_j` is
simple, inversion even, and

\[
 \mu_j\leq u_j<\min\operatorname {spec}(A_j).        \tag{5.2}
\]

Let `1<=M_j<N_j` and require the eventual compact-separation condition
(2.2), as in Theorem 3.1.  Define the low observable and complete
forced-resolvent bounds

\[
 \mathcal T_{M_j}^{\rm lo}
 =\sup_{s\leq u_j}
   \|P_{M_j}(A_j-sI)^{-1}b_j\|_2,
 \qquad
 \mathcal T_j=\|(A_j-u_jI)^{-1}b_j\|_2.             \tag{5.3}
\]

The supremum is finite in every declared finite problem: the resolvent is
continuous for `s<=u_j`, tends to zero as `s` tends to minus infinity, and
the strict inequality in (5.2) keeps it away from a pole.

### Theorem 5.1 (localized forced-resolvent bridge)

In addition to the projection hypothesis (3.4), suppose that, for every
fixed `eta<1/2`,

\[
 a_j\sqrt{L_j}\lambda_j^\eta
       \mathcal T_{M_j}^{\rm lo}\longrightarrow0,     \tag{5.4}
\]

\[
 a_j\lambda_j^\eta\sqrt{L_j\over M_j}
       \mathcal T_j\longrightarrow0.                 \tag{5.5}
\]

Then a zero-preserving scalar choice of the exact ground vectors satisfies
Theorem 3.1, and the resulting entire functions converge locally uniformly
to `Xi` on the open strip.

**Proof.**  Give the unit ground vector the phase

\[
 \xi_j=\gamma_j\kappa_j+v_j,
 \qquad \gamma_j>0,\quad v_j\in K_j.                \tag{5.6}
\]

This phase is available because `gamma_j=0` would put `xi_j` in `K_j` and
make `mu_j` an eigenvalue of `A_j`, contradicting (5.2).

The lower block of the exact eigenvector equation is

\[
 (A_j-\mu_jI)v_j=-\gamma_jb_j.                       \tag{5.7}
\]

Choose the nonzero projective scalar `s_j=gamma_j^(-1)`.  Then the error in
Theorem 3.1 is exactly

\[
 d_j=s_j\xi_j-\kappa_j
 =-(A_j-\mu_jI)^{-1}b_j.                             \tag{5.8}
\]

Equations (5.2)--(5.3) give

\[
 \|P_{M_j}d_j\|_2\leq\mathcal T_{M_j}^{\rm lo}.      \tag{5.9}
\]

Because `mu_j<=u_j<min spec(A_j)`, the two resolvents in (5.8) and (5.3)
are commuting positive functions of `A_j`, and scalar monotonicity gives

\[
 \|d_j\|_2\leq\mathcal T_j.                         \tag{5.10}
\]

Thus (5.4)--(5.5) imply (3.5)--(3.6), and Theorem 3.1 applies.  \(\square\)

For `M_j=ceil(lambda_j)`, bounded projected-state norms, the proved
projection rate, and every fixed `eta<1/2`, it would therefore suffice to
show

\[
 \boxed{
 \mathcal T_{M_j}^{\rm lo}=O(\lambda_j^{-1/2}),
 \qquad \mathcal T_j=O((\log\lambda_j)^C)}            \tag{5.11}
\]

for one fixed finite `C`, together with the strict even/odd sector
hypotheses.  The first estimate is still a source-specific low observable;
the second is only a moderate-growth estimate, not the decay demanded of
the complete chordal distance in equation (5.2) of `DIRECT_RH_ATTACK.md`.
Neither estimate in (5.11) is proved here.

## 6. Strictness of the reduction

The weakening is genuine even inside the inversion-even sector.  Let
`kappa_j=phi_0`, choose any `N_j>M_j`, put

\[
 \psi_{N_j}={\phi_{N_j}+\phi_{-N_j}\over\sqrt2},
 \qquad
 \xi_j={\phi_0+\psi_{N_j}\over\sqrt2},
 \qquad s_j=\sqrt2.                                  \tag{6.1}
\]

Then `J psi_(N_j)=psi_(N_j)` and both `xi_j` and `kappa_j` are unit and
inversion even.  Moreover,

\[
 P_{M_j}(s_j\xi_j-\kappa_j)=0,
 \qquad \|s_j\xi_j-\kappa_j\|_2=1.                 \tag{6.2}
\]

Thus complete norm convergence fails completely--the error stays one--while
Theorem 2.1 makes the
high-mode transform error vanish whenever
`lambda_j^(2*eta)*L_j/M_j->0`.  More sharply, the exact mode formula
(1.4), applied to the two symmetric modes, only requires both
`N_j/L_j->infinity` and
`lambda_j^eta*sqrt(L_j)/N_j->0` on the declared compact substrip.  The
first condition excludes real-axis resonance; for every fixed positive
`eta`, it already follows from the second.  This is a
functional-analytic example, not a Weil eigenvector or an RH approximation.
It proves only that the complete chordal estimate is not logically necessary
for local uniform convergence.

## 7. Next analytic obligation

The exact finite Cauchy form and high-Fourier coercivity now suggest a
localized Schur program.  Split the exact parity matrices at
`M=ceil(lambda)`, eliminate only those higher modes for which a source lower
model is available, and compare the resulting low spectral line with
`P_M*kappa` projectively.  Unlike a full coframe theorem, this program may
discard bounded high-mode rotations because (2.3) already proves that they
are invisible to the limiting characteristic functions.

What is still required is a source-uniform low Schur-line estimate and an
odd-sector comparison ensuring that the selected line is the unique global
ground line.  Numerical low-mode agreement, real-axis eigenvalue agreement,
or the existence of a qualitative high-tail right inverse cannot replace
those analytic statements.
