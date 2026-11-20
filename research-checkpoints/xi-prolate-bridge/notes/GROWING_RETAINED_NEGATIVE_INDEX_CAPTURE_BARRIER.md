# Growing retained negative-index and source-capture barrier

## 0. Exact outcome and fail-closed boundary

Use the locked variables

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 N=2^{9600\lambda^2},\qquad R_{\rm hp}=\sqrt N
       =2^{4800\lambda^2}.                              \tag{0.1}
\]

Let \(Q_+\) be the finite inversion-even Weil matrix, let \(\kappa\) be
the normalized physical anchor, and put

\[
 {\cal K}=H_+\cap\kappa^\perp,\qquad
 A=P_{\cal K}Q_+P_{\cal K},\qquad H_u=A-uI,
 \qquad u\leq U_Z.                                    \tag{0.2}
\]

This note records four exact conclusions.

1.  The complete multiplier reduction gives, uniformly in every finite
    outer Fourier cutoff, the negative-index bound

\[
 \boxed{
 n_-\!\left(PH_uP\right)
 \leq {L\Phi_\lambda(U_Z,g)
             \over2\pi(g-\delta)}}                    \tag{0.3}
\]

    for every finite orthogonal compression \(P\), whenever
    \(0<\delta<g\).  With \(g-\delta\asymp L\),
    \(g+U_Z=O(L)\), and only the frozen absolute-amplitude estimate for
    \(\Phi_\lambda\), (0.3) is

\[
 \boxed{n_-(PH_uP)\leq\exp(O(\lambda)).}              \tag{0.4}
\]

    This is the strongest outer-cutoff-uniform index scale supplied by the
    frozen inputs.  It is not an \(O(\lambda^2)\) or \(O(L)\) theorem.

2.  The compressed multiplier trace theorem gives an
    \(O(\lambda^2)\) dangerous rank only on its separate polynomial
    schedule \(N_{\rm pol}\asymp\lambda^2\).  Substituting the half-power
    cutoff \(R_{\rm hp}\) into that trace estimate returns an
    \(O(R_{\rm hp})\)-scale allowance and does not prove a polynomial
    index bound.

3.  Exact source-Cauchy form, inversion parity, rank-two displacement,
    logarithmic diagonal growth, and a positive high-Fourier block do not
    by themselves force a polynomial negative index.  Section 4 gives an
    explicit family with a negative even subspace of dimension
    \(\asymp e^{B/4}\), while every mode above
    \(e^{(2\pi+1)B}\) has a positive floor.

4.  Positivity of the finite captured-plus-bridge source span does not
    prove that it captures the negative spectral subspace.  Its dimension
    is \(O(L)\), and only its even projection is relevant to \(Q_+\).
    The countermodel can have more than \(\lambda^2\) negative even
    directions together with an orthogonal \(O(L)\)-dimensional positive
    span.

The family in Section 4 is a structural source-Cauchy countermodel.  It is
not the actual von-Mangoldt matrix, does not use the physical prolate anchor,
and does not assert that the arithmetic matrix has a large negative index.
It proves only that the displayed structural invariants cannot supply the
missing index or capture theorem.  No shifted sector sign, determinant
limit, equation (5.2) of `DIRECT_RH_ATTACK.md`, zero statement, or Riemann
hypothesis conclusion follows.  The formal state remains `P0_INVALIDATED`,
and the standard eight are unchanged.

## 1. Frozen inputs

The following repository bytes are binding.

| Dependency | SHA-256 |
|---|---|
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `notes/PHASE_VOLUME_SCALE_AUDIT.md` | `bae7414fed2ac861ac3211175cd8f8b7743c33bd37379e186a71d700554b7fcd` |
| `notes/COMPRESSED_MULTIPLIER_TRACE_THEOREM.md` | `ec2881e0f233c2c57101e960e3b43cd0abfbf9ee25f342f08a01f35827883d7f` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md` | `1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1` |
| `notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md` | `1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032` |
| `tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py` | `e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa` |
| `notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md` | `43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2` |
| `tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py` | `95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a` |

No external source is added.  Only the frozen operator inequalities and
finite-dimensional linear algebra are used.

## 2. The uniform phase-volume index bound

For a real shift \(U\) and \(g>0\), the complete source multiplier is

\[
 m_\lambda(t)=2\theta'(t)-2\sum_{1<n\leq\lambda^2}
       {\Lambda(n)\over\sqrt n}\cos(t\log n),
 \qquad
 v_{\lambda,U,g}(t)=[g+U-m_\lambda(t)]_+.           \tag{2.1}
\]

Let \(T_v\) be its positive weighted concentration operator.  The exact
plus-sector inequality is

\[
 Q_+-UI\succeq gI-T_v.                               \tag{2.2}
\]

Since \(u\leq U_Z\), taking \(U=U_Z\) gives

\[
 H_u\succeq gI-P_{\cal K}T_vP_{\cal K}.             \tag{2.3}
\]

For any finite compression \(P\) inside \({\cal K}\), define

\[
 T_{v,P}=PP_{\cal K}T_vP_{\cal K}P,\qquad
 \Pi_P={\bf1}_{[g-\delta,\infty)}(T_{v,P}).          \tag{2.4}
\]

On \(\ker\Pi_P\), equations (2.3)--(2.4) give the strict form floor

\[
 (I-\Pi_P)PH_uP(I-\Pi_P)\succeq
                  \delta(I-\Pi_P).                  \tag{2.5}
\]

If a negative subspace had dimension larger than \(\operatorname {rank}
\Pi_P\), it would meet \(\ker\Pi_P\) nontrivially, contradicting (2.5).
Thus

\[
 n_-(PH_uP)\leq\operatorname {rank}\Pi_P
 \leq{\operatorname {tr}T_{v,P}\over g-\delta}
 \leq {L\Phi_\lambda(U_Z,g)\over2\pi(g-\delta)},   \tag{2.6}
\]

which proves (0.3).  This argument controls inertia, not merely the
compression norm, and it remains valid for \(P=P_{\leq R_{\rm hp}}P_{\cal K}\)
after interpreting the product as the orthogonal projection onto the
corresponding finite intersection.

The frozen absolute estimate uses

\[
 \Sigma_\lambda=\sum_{1<n\leq\lambda^2}
                  {\Lambda(n)\over\sqrt n}
 \leq C_\psi(2\lambda-1),                             \tag{2.7}
\]

\[
 A_\lambda(U,g)=g+U+2\Sigma_\lambda
                   -\psi(1/4)+\log\pi,               \tag{2.8}
\]

and, for \(A>0\),

\[
 \Phi_\lambda(U,g)\leq
 F(A):=\sqrt{e^{2A}-1}-\arctan\sqrt{e^{2A}-1}<e^A.  \tag{2.9}
\]

When \(g+U_Z=O(L)\), equations (2.7)--(2.9) give
\(A_\lambda(U_Z,g)=O(\lambda)\).  If also
\(g-\delta\asymp L\), equation (2.6) proves (0.4).

An \(O(\lambda^2)\) conclusion from (2.6) would require a new polynomial
phase-volume estimate at the selected \(g,\delta\).  The stronger frozen
target

\[
 \Phi_\lambda(U_Z,g)\ll{\lambda^2\over\log\lambda} \tag{2.10}
\]

would suffice, but is explicitly unproved.  An \(O(L)\) index would require
still stronger phase-volume information.  Neither statement follows from
ordinary PNT control, fixed moments, or the infinite-time Haar law.

## 3. Why the polynomial compressed trace does not transfer to the half-power cutoff

The compressed multiplier theorem uses a centered Fourier cutoff
\(N_{\rm pol}\), dimension \(d=2N_{\rm pol}+1\), and frequency radius

\[
 \Omega={2\pi N_{\rm pol}\over L},\qquad
 T=(1+\zeta)\Omega.                                  \tag{3.1}
\]

Its trace estimate contains

\[
 2\sqrt{dL M_2(T)},                                  \tag{3.2}
\]

where the exact mean-square bound has leading term

\[
 M_2(T)\leq {T A_2\over2\pi}+O(\lambda^2L),
 \qquad A_2=O(L^2).                                  \tag{3.3}
\]

On the theorem's schedule \(N_{\rm pol}\asymp\lambda^2\), equations
(3.1)--(3.3) give trace \(O(\lambda^2L)\), and division by a threshold
of order \(L\) gives dangerous rank \(O(\lambda^2)\).

For \(N_{\rm pol}=R_{\rm hp}\), however, the first term in (3.3) is of
order \(R_{\rm hp}L\), and (3.2) is of order
\(R_{\rm hp}L\).  The resulting rank allowance is of order
\(R_{\rm hp}\), not \(\lambda^2\).  The polynomial theorem therefore
cannot be pasted onto the distinct exponential projection schedule.

The scalar Cauchy high-mode theorem supplies another uniform count.  Its
cutoff is

\[
 M_*(\lambda,U,0)=
 \left\lceil2\exp\{C_a(\lambda)+c_\lambda+U+1/(2\pi)\}\right\rceil-1,
                                                               \tag{3.4}
\]

so it gives only \(n_-=\exp(O(\lambda\log\lambda))\).  The complete
phase-volume estimate (0.4) is sharper, but still exponential.

## 4. An exact parity-symmetric rank-two Cauchy countermodel

Fix \(B>0\) and a finite symmetric mode set \(-N\leq n\leq N\).  Put

\[
 b_n=B\sin{\pi n\over2},\qquad
 a_n=\log(|n|+2),                                    \tag{4.1}
\]

and define the real Hermitian matrix

\[
 Q^{(B)}_{nn}=a_n,\qquad
 Q^{(B)}_{nm}={b_n-b_m\over n-m}\quad(n\ne m).       \tag{4.2}
\]

Then \(a_{-n}=a_n\), \(b_{-n}=-b_n\), and

\[
 Q^{(B)}_{-n,-m}=Q^{(B)}_{nm}.                        \tag{4.3}
\]

Let \(M=\operatorname {diag}(-N,\ldots,N)\),
\(\eta=(1,\ldots,1)^T\), and \(\beta=(b_{-N},\ldots,b_N)^T\).
Entrywise multiplication of (4.2) gives the exact rank-two displacement

\[
 \boxed{[M,Q^{(B)}]=|\beta\rangle\langle\eta|
                  -|\eta\rangle\langle\beta|.}      \tag{4.4}
\]

Thus the family has precisely the source commutator and inversion parity
used in the finite Weil algebra.

Let

\[
 f_n={e_n+e_{-n}\over\sqrt2}\quad(n\geq1),
 \qquad f_0=e_0.                                     \tag{4.5}
\]

On the even block,

\[
 Q^{(B),+}_{nn}=a_n+{b_n\over n},                    \tag{4.6}
\]

\[
 Q^{(B),+}_{nm}={b_n-b_m\over n-m}
                   +{b_n+b_m\over n+m}\quad(n\ne m). \tag{4.7}
\]

Take \(\kappa=f_0\), so every vector below lies in
\({\cal K}=\kappa^\perp\).  For

\[
 n_j=4j+3,\qquad
 v_j={f_{n_j}-f_{n_j+1}\over\sqrt2},                \tag{4.8}
\]

the vectors \(v_j\) are orthonormal.  If \(n_j+3\leq e^{B/4}\), direct
substitution in (4.6)--(4.7) gives

\[
 \begin{aligned}
 \langle v_j,Q^{(B),+}v_j\rangle
 &={\log(n_j+2)+\log(n_j+3)-B/n_j\over2}\\
 &\quad-B+{B\over2n_j+1}
 \leq\log(n_j+3)-B\leq-{3B\over4}.
 \end{aligned}                                      \tag{4.9}
\]

For \(j\ne k\), put \(d=|n_k-n_j|\) and \(s=n_j+n_k\).  The exact cross
is

\[
 \boxed{
 \langle v_j,Q^{(B),+}v_k\rangle
 =B\left\{{1\over d^2-1}-{1\over s(s+1)}\right\}.} \tag{4.10}
\]

Since \(d=4|j-k|\), the absolute off-diagonal row sum is bounded by

\[
 2B\sum_{r\geq1}{1\over16r^2-1}
 \leq {2B\over15}\sum_{r\geq1}{1\over r^2}
 ={\pi^2\over45}B.                                  \tag{4.11}
\]

Gershgorin's theorem applied to the Gram matrix on the \(v_j\)'s proves

\[
 \boxed{
 Q^{(B),+}|_{{\cal V}_B}
 \preceq-\left({3\over4}-{\pi^2\over45}\right)B I,
 \qquad {3\over4}-{\pi^2\over45}>0,}               \tag{4.12}
\]

where

\[
 {\cal V}_B=\operatorname {span}
 \{v_j:n_j+3\leq e^{B/4}\},\qquad
 \dim{\cal V}_B\asymp {e^{B/4}\over4}.             \tag{4.13}
\]

This proves the superpolynomial negative index using an explicit subspace,
not a numerical eigensystem.

## 5. The same family has a strong high-Fourier floor

Let \(H_0\) be the finite discrete Hilbert matrix,

\[
 (H_0)_{nm}=\begin{cases}(n-m)^{-1},&n\ne m,\\0,&n=m.
 \end{cases}                                         \tag{5.1}
\]

The Fourier multiplier proof gives \(\|H_0\|\leq\pi\).  Equations
(4.1)--(4.2) have the exact decomposition

\[
 Q^{(B)}=D_a+D_bH_0-H_0D_b,\qquad \|D_b\|=B.        \tag{5.2}
\]

Therefore, on modes \(|n|>M_0\),

\[
 P_{>M_0}Q^{(B)}P_{>M_0}
 \succeq\{\log(M_0+3)-2\pi B\}P_{>M_0}.             \tag{5.3}
\]

Taking

\[
 M_B=\left\lceil e^{(2\pi+1)B}\right\rceil         \tag{5.4}
\]

gives a high compression floor at least \(B\).  With \(B=\lambda\),

\[
 \dim{\cal V}_B\asymp e^{\lambda/4}\gg\lambda^2,
 \qquad M_B\ll R_{\rm hp}.                           \tag{5.5}
\]

The choice \(B=\lambda\) lies below the frozen
\(O(\lambda\log\lambda)\) absolute coefficient envelope.  Thus even a
stronger high floor than required can coexist with a superpolynomial low
negative index under the structural bounds.

The Hilbert--Schmidt and Birman--Schwinger routes see the same obstruction.
For every selected pair in (4.8), an adjacent Cauchy entry has magnitude
\(B\).  Hence, on the selected window,

\[
 \|Q^{(B)}-D_a\|_{\rm HS}^2
 \geq2B^2\dim{\cal V}_B.                              \tag{5.6}
\]

A Schatten count at threshold \(B\) therefore returns a bound of order
\(\dim{\cal V}_B\), not a polynomial improvement.  Equivalently, the
negative cells in (4.12) produce Birman--Schwinger crossings on an
exponentially large subspace.  Rank two in (4.4) is the rank of a
commutator; it is not a bound on the inertia of \(Q^{(B)}\).

## 6. Why a positive mixed source span does not capture the negative space

Let \({\cal S}_Q\) denote the physical image of the finite
captured-plus-bridge prefix.  The frozen coherent theorem proves positivity
on this span for \(Q\leq C_0L\), but

\[
 s_Q:=\dim P_+{\cal S}_Q=O(L).                       \tag{6.1}
\]

For any negative spectral subspace \({\cal E}_-\) of an even compression,
elementary dimension counting gives

\[
 \boxed{
 \dim({\cal E}_-\cap(P_+{\cal S}_Q)^\perp)
 \geq\dim{\cal E}_--s_Q.}                           \tag{6.2}
\]

Thus, if \(\dim{\cal E}_->s_Q\), the projection from \({\cal E}_-\) to
the positive source span has zero smallest singular value.  No coframe or
injective capture follows.

The countermodel makes this failure simultaneous with source-span
positivity.  Choose any \(s=O(L)\) even coordinate modes in

\[
 M_B<n\leq M_B+s<R_{\rm hp}.                          \tag{6.3}
\]

Their span \({\cal S}\) is orthogonal to \({\cal V}_B\), and (5.3)--(5.4)
give

\[
 P_{\cal S}Q^{(B),+}P_{\cal S}\succeq B P_{\cal S},
 \qquad {\cal V}_B\subset{\cal S}^\perp.            \tag{6.4}
\]

This does not identify \({\cal S}\) with the actual mixed physical
source span.  It proves the narrower logical point: a positive
\(O(L)\)-dimensional span, even with a quantitative floor, does not imply
coverage of the dangerous or negative space.

Even a future estimate \(\dim{\cal E}_-\leq s_Q\) would not by itself prove
positivity of the whole operator.  An injective projection of
\({\cal E}_-\) into \({\cal S}_Q\) only parametrizes the negative space.
To eliminate it one needs either exact dangerous-space containment together
with a positive complementary compression, or the full retained Schur
criterion including the cross block.

## 7. Exact remaining theorem

The present route can close only after a new arithmetic-geometric input of
one of the following forms.

1.  A polynomial phase-volume theorem strong enough to reduce (2.6) to the
    dimension of an available positive physical range, followed by exact
    capture of the resulting dangerous projector.
2.  A direct coframe for that source-defined dangerous projector in the
    actual mixed physical span, with a quantitative angle.
3.  A signed floor on the retained complement and the cancellation-aware
    Schur cross estimate connecting it to the positive prefix.

Trace, Hilbert--Schmidt size, Birman--Schwinger rewriting, the rank-two
source displacement, and positivity on the captured span do not supply any
of these statements.  In particular, the countermodel is not evidence for
actual arithmetic negativity; it is a fail-closed obstruction to promoting
the currently available invariants.

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_retained_negative_index_capture_barrier -v

The regression freezes every dependency, reconstructs the Cauchy matrix and
rank-two commutator independently, checks inversion parity, verifies the
exact even-pair Gram and Gershgorin margin, checks the high-floor and
Hilbert--Schmidt constants, exercises the index and capture dimension logic,
compiles every displayed formula, and enforces the fail-closed scope.
