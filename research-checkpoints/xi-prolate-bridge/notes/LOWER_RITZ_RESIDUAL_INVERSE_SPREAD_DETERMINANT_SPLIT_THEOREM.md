# Lower-Ritz residual inverse-spread determinant split theorem

## 0. Exact result and fail-closed boundary

This note uses the genuine lower two-vector Ritz value `u`.  It does not use
the absolute-sampling shift `U_Z`.

Write the exact inversion-even source block as

\[
 Q_+=\begin{pmatrix}q&b^*\\ b&A\end{pmatrix}
 \quad\hbox{on}\quad {\mathbb C}\kappa\oplus\mathcal K,
 \qquad r=\|b\|>0,\qquad w={b\over r}.                 \tag{0.1}
\]

Let `u` be the lower Ritz value on
`span{kappa,w}`, put

\[
 t=q-u>0,\qquad B=A-uI,\qquad
 m_1=\langle w,Bw\rangle={r^2\over t},               \tag{0.2}
\]

and assume, without proving, the two strict finite signs

\[
 \boxed{B\succ0,\qquad Q_--uI\succ0.}                 \tag{0.3}
\]

The new finite identity is

\[
 \boxed{
 \langle b,B^{-1}b\rangle=t+\chi_u,
 \qquad
 \chi_u=e_u^*S_u^{-1}e_u
       =t\{m_1\langle w,B^{-1}w\rangle-1\}\geq0.}    \tag{0.4}
\]

Here `e_u` is exactly the two-vector Ritz residual in the retained
complement, and `S_u` is the short of `B` after its `w` coordinate is
eliminated.  Thus `chi_u` is not an unspecified norm loss: it is the
inverse energy of the complete Galerkin residual in the retained Schur
short.

Let `mu` be the actual ground value and `h=u-mu>=0`.  The coefficient-
normalized ground correction has the exact Galerkin split

\[
 \boxed{
 z_\mu=(A-\mu I)^{-1}b
 ={r\over m_1+h}w+\delta_h,}                          \tag{0.5}
\]

where

\[
 \boxed{
 \|\delta_h\|_{B+hI}^2=\chi(h)\leq\chi_u,
 \qquad 0\leq h\leq\chi_u.}                         \tag{0.6}
\]

For a compact set `Omega` of Mellin frequencies, let `g_z` be the exact
anchor-removed Mellin Riesz vector and define

\[
 \mathcal G_\Omega(w)
   =\sup_{z\in\Omega}|\langle g_z,w\rangle|,
 \qquad
 \mathcal L_\Omega(u)
   =\sup_{z\in\Omega}\langle g_z,B^{-1}g_z\rangle.
                                                               \tag{0.7}
\]

Then

\[
 \boxed{
 \sup_{z\in\Omega}|\widehat {z_\mu}(z)|
 \leq {t\over r}\mathcal G_\Omega(w)
       +\sqrt{\chi_u\mathcal L_\Omega(u)}.}          \tag{0.8}
\]

If

\[
 \alpha_{\lambda,N}=\|P_Nk_\lambda^+\|,
\]

the following two scalar limits are therefore a
determinant-only sufficient condition:

\[
 \boxed{
 \alpha_{\lambda,N}{t\over r}\mathcal G_\Omega(w)
 \longrightarrow0,
 \qquad
 \alpha_{\lambda,N}^2\chi_u\mathcal L_\Omega(u)
 \longrightarrow0.}                                 \tag{0.9}
\]

For one fixed real interval on which `Xi` is positive, (0.9) plugs into the
existing one-window determinant theorem.  For every fixed compact rectangle
in `|Im z|<1/2`, it plugs directly into the existing compact Mellin graph
bridge.  This bypasses the full-`L2` angle demanded by equation (5.2) of
`DIRECT_RH_ATTACK.md`; it does not prove that equation.  No paired
`U_Z`-shifted sign is used.  The strict lower-Ritz signs (0.3) remain
mandatory for the finite ground and real-zero determinant theorem.

Two exact source-Cauchy families show that both terms in (0.8) are genuine.

1. In the centered `N=1` family, `chi_u=0` identically, but the direct Ritz
   term and the actual frequency-one response tend to `sqrt(pi)`.
2. In a centered `N=2` family, the direct Ritz term tends to zero on every
   fixed bounded frequency window, both signs (0.3) hold, but the retained
   inverse spread diverges and the actual frequency-two response tends to
   `-sqrt(pi)`.

The fixed-depth source-block theorem at checkpoint 1.22 controls positive
Ritz values only on its captured fixed spans.  It controls neither the
retained short `S_u`, the inverse residual energy `chi_u`, nor the Mellin
leverage.  Consequently it does not prove either limit in (0.9).

This note proves only finite identities, a conditional determinant-only
sufficient criterion, and exact structural counterfamilies.  It proves
neither strict sign in (0.3) on an unbounded actual arithmetic schedule,
neither limit in (0.9), equation (5.2), a complete even or odd sector sign,
a paired `U_Z` sign, a determinant limit, a zero statement, the Riemann
hypothesis, nor a de Bruijn--Newman `Lambda` bound.  The formal state remains
`P0_INVALIDATED`.

If `r=0`, the correction is zero under the complement sign and no ratio in
(0.2), (0.8), or (0.9) is formed.  All statements below concern `r>0`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `DIRECT_RH_ATTACK.md` | `b8c5eb77013f00d9a48aa24c244c4a1d1d86957eab041e28282927d7d55c0fa2` |
| `notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md` | `8ad5b2695ebea66f94c1dc58c7eb08a1d0c06d30f73c5536915be566f9e2b949` |
| `notes/VECTOR_SPECIFIC_EQUATION_52_ATTACK.md` | `79b9af2baddd0b2ae794e77bccf749c6fa0458afbf4637ca8b84931d8206788f` |
| `notes/POLYLOG_SHIFTED_SOLVE_OBSERVABLE_REDUCTION.md` | `5b7618305c56e2b1b403cd437c4cffad0ea4214396739ce2fed7a351ebb9fcfa` |
| `tests/test_polylog_shifted_solve_observable_reduction.py` | `c6aa5d4bdd47e16689fa42d5848bcd7d1a18e70cd6781f8f31406a6bf8ae2ae1` |
| `notes/SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md` | `9324d758eca900f646eb5a6187cb5f316ece99b64ec77d7da2eb72cc7c7ff4a4` |
| `tests/test_same_anchor_endpoint_rate_attack.py` | `dd63d4a84cbd8330893c11d273648435f57ee858ebd06231e7b3ad811a5712fb` |
| `notes/CYCLIC_MELLIN_GRAPH_PRODUCT_TRANSITION_PACKET_NONCAPTURE_BARRIER.md` | `b7e29753bb6ff4f4082a114413bf7f80b460f4c8d0a0b5e48ee73e435e2fc488` |
| `tests/test_cyclic_mellin_graph_product_transition_packet_noncapture_barrier.py` | `26d5d820330cb7971e7bf5e47550d56a9bc3924091db93d8e83afa3025a0d769` |
| `notes/SOURCE_COMPATIBLE_GROUND_PROJECTIVE_RESPONSE.md` | `2e4950652fc7d37d399aec34a7a1cd2b906463072cba4c7c7361e29bf411b073` |
| `tests/test_source_compatible_ground_projective_response.py` | `096521d90b0822a677bd147908ecca0addd63a38226924c98453d6e79247f57c` |
| `notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md` | `04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83` |
| `tests/test_fixed_source_block_shift_asymptotic_theorem.py` | `433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5` |

All source matrices in this note are assembled before any inverse or
absolute value is taken.  In the arithmetic application this means the
complete pole minus archimedean minus prime form, with the locked Fourier
sign and inclusive prime-power endpoint.

## 2. The inverse spread is the shorted Ritz-residual energy

Use the orthogonal decomposition

\[
 \mathcal K={\mathbb C}w\oplus\mathcal F,
 \qquad
 B=\begin{pmatrix}m_1&c^*\\c&C\end{pmatrix}.        \tag{2.1}
\]

Since `B>0`,

\[
 C\succ0,
 \qquad
 S_u=C-{1\over m_1}cc^*\succ0.                       \tag{2.2}
\]

The lower two-vector Ritz equation is

\[
 t m_1=r^2.                                           \tag{2.3}
\]

Put

\[
 y_u=\kappa-{t\over r}w.
\]

The anchor and `w` components of `(Q_+-uI)y_u` cancel exactly.  Therefore

\[
 \boxed{
 e_u=(Q_+-uI)y_u=-{t\over r}c\in\mathcal F.}         \tag{2.4}
\]

### Theorem 2.1 (shorted inverse-spread identity)

Under (0.1)--(0.3),

\[
 \boxed{
 \begin{aligned}
 \chi_u
 &:=\langle b,B^{-1}b\rangle-t\\
 &=e_u^*S_u^{-1}e_u\\
 &=\left\|B^{-1}b-{t\over r^2}b\right\|_B^2\\
 &=t\{m_1\langle w,B^{-1}w\rangle-1\}\geq0.
 \end{aligned}}                                      \tag{2.5}
\]

**Proof.**  The scalar Schur complement of `C` gives

\[
 \langle w,B^{-1}w\rangle
 ={1\over m_1-c^*C^{-1}c}.                            \tag{2.6}
\]

Woodbury inversion of (2.2) gives

\[
 c^*S_u^{-1}c
 ={m_1c^*C^{-1}c\over m_1-c^*C^{-1}c}.               \tag{2.7}
\]

Equations (2.3)--(2.4) now show

\[
 e_u^*S_u^{-1}e_u
 ={t\,c^*C^{-1}c\over m_1-c^*C^{-1}c}
 =r^2\langle w,B^{-1}w\rangle-t.                    \tag{2.8}
\]

For the norm identity, expand the square and use

\[
 \langle b,Bb\rangle=r^2m_1={r^4\over t}.
\]

Finally metric Cauchy--Schwarz gives
`m_1<w,B^(-1)w>>=1`.  This proves (2.5).  \(\square\)

Let `nu_w` be the probability spectral measure of `B` at `w`.  The
dimensionless inverse spread

\[
 K_w=m_1\langle w,B^{-1}w\rangle
\]

has the exact pair formula

\[
 \boxed{
 K_w-1={1\over2}\iint{(x-y)^2\over xy}
             \,d\nu_w(x)d\nu_w(y),
 \qquad \chi_u=t(K_w-1).}                            \tag{2.9}
\]

Thus `K_w=1` exactly when the spectral measure is supported at one point.
The Ritz equation fixes only the first moment `m_1`; it gives no upper
bound for the negative moment or for `K_w`.

## 3. The actual ground ridge and its exact Galerkin error

The signs (0.3) make the lowest source eigenvalue simple, global, and even.
Write

\[
 h=u-\mu\geq0,
 \qquad D_h=B+hI,
 \qquad z_\mu=D_h^{-1}b.                              \tag{3.1}
\]

Relative to (2.1),

\[
 D_h=\begin{pmatrix}m_1+h&c^*\\c&C+hI\end{pmatrix},
 \qquad
 S_h=C+hI-{1\over m_1+h}cc^*\succ0.                 \tag{3.2}
\]

The one-dimensional Galerkin approximation to `D_h z=b` is

\[
 z_h^{\rm G}={r\over m_1+h}w.                        \tag{3.3}
\]

Its residual lies entirely in `F`:

\[
 b-D_hz_h^{\rm G}=-{r\over m_1+h}c.                 \tag{3.4}
\]

Define

\[
 \delta_h=z_\mu-z_h^{\rm G},
 \qquad
 \chi(h)={r^2\over(m_1+h)^2}c^*S_h^{-1}c.           \tag{3.5}
\]

### Theorem 3.1 (ridge-monotone residual split)

For every `h>=0`,

\[
 \boxed{
 \begin{aligned}
 z_\mu&={r\over m_1+h}w+\delta_h,\\
 \langle w,D_h\delta_h\rangle&=0,\\
 \|\delta_h\|_{D_h}^2
 &=\chi(h)
  =\langle b,D_h^{-1}b\rangle-{r^2\over m_1+h},\\
 0&\leq\chi(h)\leq\chi(0)=\chi_u.
 \end{aligned}}                                      \tag{3.6}
\]

Moreover,

\[
 \boxed{0\leq h\leq\chi_u.}                         \tag{3.7}
\]

**Proof.**  Equation (3.4) and the lower-right block of `D_h^(-1)` give

\[
 \|\delta_h\|_{D_h}^2
 ={r^2\over(m_1+h)^2}c^*S_h^{-1}c.                  \tag{3.8}
\]

Galerkin orthogonality proves the energy decomposition in (3.6).
Alternatively, subtract the energy of (3.3) from the exact forcing energy.

Put

\[
 F(h)=\langle b,D_h^{-1}b\rangle-{r^2\over m_1+h}.
\]

Differentiation gives

\[
 F'(h)=-r^2\langle w,D_h^{-2}w\rangle
       +{r^2\over(m_1+h)^2}\leq0,                   \tag{3.9}
\]

because spectral Jensen gives

\[
 \langle w,D_h^{-2}w\rangle
 \geq\langle w,D_hw\rangle^{-2}=(m_1+h)^{-2}.
\]

Hence `chi(h)<=chi(0)`.

The scalar ground equation is

\[
 t+h=\langle b,D_h^{-1}b\rangle.                    \tag{3.10}
\]

Its right side is at most its value at zero, namely `t+chi_u`.
This proves (3.7).  \(\square\)

For any Riesz vector `g`, graph Cauchy--Schwarz and (3.6) give the exact
two-term estimate

\[
 \begin{aligned}
 |\langle g,z_\mu\rangle|
 &\leq {r\over m_1+h}|\langle g,w\rangle|
       +\sqrt{\chi(h)\langle g,D_h^{-1}g\rangle}\\
 &\leq {t\over r}|\langle g,w\rangle|
       +\sqrt{\chi_u\langle g,B^{-1}g\rangle}.
 \end{aligned}                                      \tag{3.11}
\]

The last line uses `r/m_1=t/r`, `D_h^(-1)<=B^(-1)`, and
`chi(h)<=chi_u`.  This proves (0.8).

The older product bound follows by discarding the Galerkin orientation:

\[
 |\langle g,z_\mu\rangle|^2
 \leq(t+\chi_u)\langle g,B^{-1}g\rangle.             \tag{3.12}
\]

Equation (3.11) is strictly sharper when the Ritz direction is directly
small under the Mellin observation but the generic leverage is large.

## 4. Exact source and determinant normalization

Retain the locked source interval and transform

\[
 I_\lambda=[-L/2,L/2],\qquad L=2\log\lambda,
 \qquad
 \widehat v(z)=\int_{I_\lambda}v(x)e^{-izx}\,dx.     \tag{4.1}
\]

Let

\[
 p_{\lambda,N}=P_Nk_\lambda^+
   =\alpha_{\lambda,N}\kappa,
 \qquad
 \alpha_{\lambda,N}=\|P_Nk_\lambda^+\|>0.          \tag{4.2}
\]

If `xi` is the unit ground and
`c_kappa=<kappa,xi>!=0`, coefficient normalization gives

\[
 {\xi\over c_\kappa}=\kappa-z_\mu.                  \tag{4.3}
\]

The source-scaled ground representative and its exact error are therefore

\[
 f_{\lambda,N}=\alpha_{\lambda,N}(\kappa-z_\mu),
 \qquad
 f_{\lambda,N}-p_{\lambda,N}
 =-\alpha_{\lambda,N}z_\mu.                         \tag{4.4}
\]

Let `ell_z^*` be the Riesz vector in the finite source space for
`v -> widehat(v)(z)`, and remove its anchor component:

\[
 g_z=P_\mathcal K\ell_z^*.                            \tag{4.5}
\]

Since `z_mu` and `w` belong to `K`,

\[
 \widehat {z_\mu}(z)=\langle g_z,z_\mu\rangle,
 \qquad
 \widehat w(z)=\langle g_z,w\rangle.                \tag{4.6}
\]

Equations (3.11) and (4.4) prove

\[
 \boxed{
 \sup_{z\in\Omega}
 |\widehat f_{\lambda,N}(z)-\widehat p_{\lambda,N}(z)|
 \leq\alpha_{\lambda,N}
 \left\{{t\over r}\mathcal G_\Omega(w)
 +\sqrt{\chi_u\mathcal L_\Omega(u)}\right\}.}       \tag{4.7}
\]

This is the normalization required by the source determinant.  Replacing
`alpha_(lambda,N)` by one is not harmless.

### Corollary 4.1 (determinant-only replacement for the full angle)

On an unbounded source schedule, assume:

1. `lambda -> infinity`, `N/L^2 -> infinity`, and the exact
   source-normalized anchor (4.2) is used;
2. the strict lower-Ritz signs (0.3) hold eventually;
3. the proved projected-anchor transform error and the cutoff hypotheses
   of the selected determinant bridge hold; and
4. for every fixed compact rectangle
   `Omega=K_(D,eta)` with `eta<1/2`, both limits (0.9) hold.

Then the projectively normalized finite characteristic functions converge
locally uniformly to `Xi` on `|Im z|<1/2`, by the compact Mellin graph and
source determinant bridges already frozen in the dependencies.

It is enough instead to prove (0.9) on one fixed real interval
`[-T,T]` on which `Xi>0`.  The one-window observable theorem then supplies
the complete inverse-square trace and locally uniform entire determinant
convergence.

This corollary reaches the downstream conclusion for which equation (5.2)
of `DIRECT_RH_ATTACK.md` was a sufficient hypothesis.  It does not imply
the full-`L2` angle in (5.2).  Evaluation on a bounded frequency window is
not a norming family for the growing source space.

The shift used throughout is exactly `u`.  In particular the corollary
does not assume

\[
 A-U_ZI\succ0,\qquad Q_--U_ZI\succ0,
\]

or the paired eventual `U_Z` signs.  It does assume (0.3); the determinant
observable is not a substitute for the finite inertia hypotheses that make
the ground simple, even, and globally lowest.

The exact minimal observable remains

\[
 \alpha_{\lambda,N}
 \sup_{z\in\Omega}
 |\langle g_z,(B+hI)^{-1}b\rangle|\longrightarrow0. \tag{4.8}
\]

Conditions (0.9) are a source-checkable sufficient split of (4.8), not
necessary conditions for an individual matrix: cancellation between the
two terms in (0.5) can make (4.8) smaller.

## 5. What checkpoint 1.22 does and does not control

For each fixed source depth `m`, checkpoint 1.22 proves

\[
 {q\over d_4L}\longrightarrow{\Gamma_0\over A_4^2},
 \qquad
 {\mu_{+,m}\over d_8L}\longrightarrow
 {\tau_m\over\|W_{8,\infty}\|^2}>0,
 \qquad
 {\mu_{-,m}\over d_6L}\longrightarrow
 {\tau_m\over\|K_6\|^2}>0,                          \tag{5.1}
\]

with

\[
 {d_8\over d_4}\asymp\lambda^8,
 \qquad {d_6\over d_4}\asymp\lambda^4.             \tag{5.2}
\]

These are positive captured-block statements.  In the decomposition (2.1),
they give no growing-uniform estimate for any of

\[
 c=P_\mathcal F Bw,
 \qquad S_u=C-{1\over m_1}cc^*,
 \qquad e_u^*S_u^{-1}e_u,
 \qquad \mathcal L_\Omega(u).                        \tag{5.3}
\]

In particular, a positive fixed compression does not exclude a moving
retained pole of `S_u^(-1)`.  Nor are the fixed captured spans proved to be
reducing subspaces or a growing graph core for `B^(-1)`.  The N=2 family in
Section 7 matches the favorable hierarchy `m_1/t -> infinity` while adding
a still softer retained pole.  It is structural rather than the pinned
arithmetic matrix, but it proves that the hierarchy (5.1)--(5.2) alone has
no inverse-moment consequence.

Thus the smallest useful new arithmetic lemma is not another fixed-depth
Ritz floor.  It is either the mixed observable (4.8) itself or the two
oriented scalar estimates (0.9), with the complete combined source action
retained inside `S_u^(-1)` and `B^(-1)`.

## 6. Exact N=1 source-Cauchy direct-term family

Use the centered raw nodes `-1,0,1`.  For `epsilon>0`, set

\[
 \beta_{-1}=\epsilon,\quad\beta_0=0,
 \quad\beta_1=-\epsilon,
 \qquad
 a_0=0,\quad a_{-1}=a_1=2\epsilon^2+\epsilon,       \tag{6.1}
\]

and

\[
 Q_{nn}=a_n,
 \qquad Q_{nm}={\beta_n-\beta_m\over n-m}
 \quad(n\ne m).                                     \tag{6.2}
\]

This is an exact real inversion-symmetric source-Cauchy matrix.  In the
normalized parity basis `kappa=V_0`,
`e_1^+=(V_1+V_(-1))/sqrt(2)`,

\[
 Q_+=\begin{pmatrix}
 0&-\sqrt2\epsilon\\
 -\sqrt2\epsilon&2\epsilon^2
 \end{pmatrix},
 \qquad
 Q_-=2\epsilon^2+2\epsilon.                         \tag{6.3}
\]

The lower Ritz value is the actual even ground value

\[
 u=\mu=\epsilon^2-\epsilon\sqrt{\epsilon^2+2}.      \tag{6.4}
\]

Thus

\[
 B=\epsilon\{\epsilon+\sqrt{\epsilon^2+2}\}>0,
 \qquad Q_--u>0,                                    \tag{6.5}
\]

and the one-dimensional complement gives

\[
 c=0,\qquad \chi_u=0,
 \qquad {t\over r}\longrightarrow1.                \tag{6.6}
\]

Take `L=2*pi`.  At real frequency one,

\[
 g_1=-\sqrt\pi\,e_1^+,
 \qquad w=-e_1^+.
\]

Consequently

\[
 \boxed{
 \langle g_1,z_\mu\rangle
 ={\sqrt{2\pi}\over
       \epsilon+\sqrt{\epsilon^2+2}}
 \longrightarrow\sqrt\pi.}                         \tag{6.7}
\]

The residual term in (0.8) vanishes identically, while the direct Ritz term
is exactly (6.7).  Therefore an implication based only on `chi_u`, even
with `K_w=1` exactly and both lower-Ritz signs, is false in the exact
source-Cauchy class.

## 7. Exact N=2 source-Cauchy inverse-spread family

Let `a>0`, `epsilon>0`, and `t>0`, and define

\[
 r^2={t(16a+\epsilon)\over17}.                        \tag{7.1}
\]

On the centered raw nodes `-2,-1,0,1,2`, impose inversion by

\[
 \beta_{-n}=-\beta_n,
 \qquad a_{-n}=a_n,
\]

and take

\[
 \begin{aligned}
 &\beta_0=0,
 &&\beta_1=-{4r\over\sqrt{34}},
 &&\beta_2=-{2r\over\sqrt{34}},\\
 &a_0=t,
 &&a_1=a+{4r\over\sqrt{34}},
 &&a_2=\epsilon+{r\over\sqrt{34}}.
 \end{aligned}                                       \tag{7.2}
\]

Define `Q` by the exact source-Cauchy formula (6.2).  Direct parity
reduction gives

\[
 Q_+=\begin{pmatrix}
 t&-4r/\sqrt{17}&-r/\sqrt{17}\\
 -4r/\sqrt{17}&a&0\\
 -r/\sqrt{17}&0&\epsilon
 \end{pmatrix}.                                      \tag{7.3}
\]

Hence, with

\[
 w={1\over\sqrt{17}}(-4,-1),
 \qquad B=\operatorname {diag}(a,\epsilon),          \tag{7.4}
\]

the coupling is `b=rw`.  Equation (7.1) says exactly that the lower Ritz
value on `span{kappa,w}` is

\[
 u=0.                                                 \tag{7.5}
\]

The odd block is

\[
 Q_-=\begin{pmatrix}
 a+8r/\sqrt{34}&4r/\sqrt{34}\\
 4r/\sqrt{34}&\epsilon+2r/\sqrt{34}
 \end{pmatrix},                                      \tag{7.6}
\]

and

\[
 \det Q_-
 =a\epsilon+{2ar+8\epsilon r\over\sqrt{34}}>0.     \tag{7.7}
\]

Thus both lower-Ritz signs hold for every positive `a,epsilon,t`.
Nevertheless,

\[
 \boxed{
 K_w={\langle b,B^{-1}b\rangle\over t}
 ={(16a+\epsilon)(16/a+1/\epsilon)\over289}.}        \tag{7.8}
\]

This tends to infinity as `epsilon/a -> 0`.  The first moment and exact
Ritz relation do not bound the inverse spread even inside the exact
source-Cauchy and strict-sign class.

There is a scale-matched determinant version.  Let `delta -> 0`, choose an
arbitrary common scale `s>0`, and set

\[
 a=s,qquad t=s\delta^2,qquad
 \epsilon=s\delta^4,qquad
 r=s\delta\sqrt{{16+\delta^4\over17}}.              \tag{7.9}
\]

Then

\[
 {t\over r}=\delta\sqrt{{17\over16+\delta^4}}
 \longrightarrow0,
 \qquad
 K_w\sim{16\over289}\delta^{-4},
 \qquad
 \chi_u\sim{16s\over289}\delta^{-2}.               \tag{7.10}
\]

Let `h=sH_delta` be the true ground ridge.  The scalar Feshbach equation is

\[
 \delta^2+H_\delta
 ={\delta^2(16+\delta^4)\over289}
 \left\{{16\over1+H_\delta}
       +{1\over\delta^4+H_\delta}\right\}.          \tag{7.11}
\]

Its unique positive solution satisfies

\[
 {H_\delta\over\delta}\longrightarrow{4\over17}.  \tag{7.12}
\]

Indeed, put `H_delta=delta*y_delta`, divide (7.11) by `delta`, and use
monotonicity of the two sides.  Every positive limit point solves
`y=16/(289y)`, and the equation supplies upper and lower compactness bounds.

At `L=2*pi`, the anchor-removed real frequency-two Riesz vector is

\[
 g_2=\sqrt\pi\,e_2^+.
\]

The actual response is therefore

\[
 \boxed{
 \langle g_2,z_\mu\rangle
 =-\sqrt\pi\,
 {\delta\sqrt{16+\delta^4}/17
       \over\delta^4+H_\delta}
 \longrightarrow-\sqrt\pi.}                         \tag{7.13}
\]

On the other hand, `G_[-2,2](w)` stays bounded in this fixed source space,
so the direct term in (0.8) tends to zero by (7.10).  The frequency-two
leverage is

\[
 \langle g_2,B^{-1}g_2\rangle={\pi\over s\delta^4},
\]

and hence

\[
 \chi_u\langle g_2,B^{-1}g_2\rangle
 \sim{16\pi\over289}\delta^{-6}\longrightarrow\infty.
                                                               \tag{7.14}
\]

Thus the residual inverse-energy term cannot be omitted from a uniform
determinant theorem for the source-Cauchy class.

The hierarchy in (7.9) has `a/t=delta^(-2)`.  Taking
`delta` of order `lambda^(-4)` reproduces the favorable visible
`d_8/d_4` scale separation in checkpoint 1.22 while leaving a hidden gap
of relative size `delta^4`.  This does not claim that the actual arithmetic
matrix contains that pole.  It proves that the admitted fixed-block
asymptotics do not exclude it.

## 8. Exact remaining lemma

The determinant-only route avoids the paired `U_Z` positivity gate, but it
does not remove all sign work.  A complete proof on an actual widening
schedule needs exactly:

1. the strict lower-Ritz signs (0.3);
2. the already proved projected-anchor transform convergence; and
3. either the exact mixed-row limit (4.8), or the two source-checkable
   estimates (0.9), on one positive real interval.

The genuinely new inverse statement in item 3 is

\[
 \boxed{
 \alpha_{\lambda,N}^2
 e_u^*S_u^{-1}e_u\,
 \sup_{z\in\Omega}\langle g_z,B^{-1}g_z\rangle
 \longrightarrow0,}                                 \tag{8.1}
\]

together with the directly observed Ritz-line limit

\[
 \boxed{
 \alpha_{\lambda,N}{q-u\over\|b\|}
 \sup_{z\in\Omega}|\widehat w(z)|\longrightarrow0.} \tag{8.2}
\]

Neither fixed-depth prolate/source asymptotics, the first Ritz moment,
source-Cauchy displacement, nor the lower-Ritz signs imply (8.1)--(8.2).
Sections 6--7 show the two independent failures exactly.  Any successful
arithmetic proof must use cancellation or localization not present in those
structural inputs.
