# Cutoff-free prolate ground alignment: domain exhaustion and RH dichotomy

## 0. Scope and exact outcome

Let `p` tend to infinity through the odd positive integers and put

\[
 \lambda_p={p\over2},\qquad L_p=2\log\lambda_p,
 \qquad N_p=2^{2400p^2}=2^{9600\lambda_p^2}.          \tag{0.1}
\]

For fixed `lambda`, the complete semilocal Weil form has a canonical
compact-resolvent operator on

\[
 H_\lambda=L^2([\lambda^{-1},\lambda],du/u).
\]

Write `Q_(lambda,+)` for its inversion-even restriction.  Let
`X_lambda` be the **unprojected** inversion-even, zero-integral, label-4
prolate arithmetic anchor used by the locked source construction, and set

\[
 \kappa_{\lambda,\infty}={X_\lambda\over\|X_\lambda\|},
 \qquad
 q_{\lambda,\infty}
 =\langle\kappa_{\lambda,\infty},
          Q_{\lambda,+}\kappa_{\lambda,\infty}\rangle,
                                                               \tag{0.2}
\]

\[
 r_{\lambda,\infty}
 =\|(Q_{\lambda,+}-q_{\lambda,\infty}I)
          \kappa_{\lambda,\infty}\|.                         \tag{0.3}
\]

The source-normalized anchor differs from `X_lambda` by one nonzero scalar,
so (0.2)--(0.3) are independent of that harmless choice.  The first result
of this note is that the vector in (0.2) belongs to the operator domain and
that the locked finite-section estimates pass to it:

\[
 \boxed{
 {q_{\lambda_p,\infty}\over d_{4,p}L_p}
 \longrightarrow {\Gamma_0\over A_4^2}>0,
 \qquad r_{\lambda_p,\infty}\longrightarrow0.}                \tag{0.4}
\]

Here `d_(4,p)` is the frozen label-4 prolate defect, `A_4` is the nonzero
limiting physical norm, and `Gamma_0` is the positive Toeplitz constant in
the locked finite-source theorem.  The passage is not an interchange of
uncertified eigenvectors.  It is a direct graph-norm estimate based on the
exact diagonal-plus-Cauchy matrix and the bounded-variation Fourier tail.

Let `mu_lambda` be the lowest eigenvalue of the **full** cutoff-free
semilocal operator and let `P_lambda` be the complete projector onto its
bottom eigenspace.  Since the anchor is even, put

\[
 \rho_\lambda
 =\langle\kappa_{\lambda,\infty},
          P_\lambda\kappa_{\lambda,\infty}\rangle.             \tag{0.5}
\]

Spectral projection gives the exact inequality

\[
 \boxed{
 |\mu_\lambda-q_{\lambda,\infty}|\sqrt{\rho_\lambda}
 \leq r_{\lambda,\infty}.}                                  \tag{0.6}
\]

Consequently, on the locked halfgrid,

\[
 \boxed{
 \limsup_{p\to\infty}\rho_{\lambda_p}>0
 \quad\Longrightarrow\quad
 \lim_{\lambda\to\infty}\mu_\lambda=0
 \quad\Longrightarrow\quad \mathrm {RH}.}                    \tag{0.7}
\]

The last implication is exactly Corollary 3.8 of the pinned CCM source.
Thus even a nonvanishing cutoff-free full-ground overlap along one cofinal
subsequence is already an RH-strength theorem.  In particular,
`rho_lambda=1-O(lambda^(-1))` is much stronger than what is needed for that
implication.

Conversely, if RH is false, the Weil criterion supplies a fixed compactly
supported normalized negative test.  Hence there is `delta>0` such that
`mu_lambda<=-delta` eventually, and (0.4), (0.6) give

\[
 \boxed{\mathrm {RH}\text{ false}
 \quad\Longrightarrow\quad
 \rho_{\lambda_p}\longrightarrow0.}                         \tag{0.8}
\]

Equations (0.7)--(0.8) are a dichotomy, not a proof of RH.  No lower bound
for the actual full ground overlap is proved here.  If `P_lambda` is
replaced by the bottom projector of the even block alone, (0.6) remains
true with `mu_(lambda,+)`, but (0.7) requires the additional theorem that
this even eigenvalue is the bottom of the **full** operator.  A parity
ordering may not be omitted.

The second result is conceptual but exact.  In centered logarithmic
coordinates the `lambda`-family is an exhaustion of one global,
translation-invariant Weil form.  It is not a small perturbation of a
rank-one or harmonic-oscillator operator.  The prolate oscillator constructs
one near-radical state; it is not the leading part of `Q_lambda`.  The
limiting global radical is infinite dimensional, and finite `lambda`
splits that degeneracy through exponentially small boundary effects.

This note changes none of the standard eight, adds no zero table or point
matrix, and proves no ground simplicity, parity ordering, complement gap,
determinant limit, zero-location statement, converse to (0.7), or Riemann
hypothesis.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen inputs and source bytes

The binding source is Connes--Consani--Moscovici, *Zeta Spectral Triples*,
arXiv:2511.22755v1.  The exact repository bytes used here are:

| Dependency | SHA-256 |
|---|---|
| `vendor/CCM-ZST-2511.22755v1.pdf` | `c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b` |
| `notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md` | `04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83` |
| `tests/test_fixed_source_block_shift_asymptotic_theorem.py` | `433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5` |
| `notes/FIXED_ANCHOR_BV_CAUCHY_FAR_ROW_THEOREM.md` | `59395e5d184c93e3e56c935028c5fba322a0f30476bd9db1c99585c056876c79` |
| `tests/test_fixed_anchor_bv_cauchy_far_row_theorem.py` | `905dae5ca5489665dea4bfa1309d062fbd2769a529674b6c10d380a3f3627e3e` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` | `3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf` |
| `tests/test_projected_state_norm_lower_bound.py` | `d740587d2af62c5ef1b1255dc8184d8bea0833c70740b6697407678f90e1d079` |
| `notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md` | `7dd2d8b6d32da5e1d98a6c96702a8079b53075eb756d1204219a4581c6296413` |
| `tests/test_full_exterior_sampling_fallback.py` | `62eb6f6bda3ab3cbcd24bfd095585c9dd154f6d08c3729ff0700f6d970b217ef` |
| `notes/FIXED_LAMBDA_GALERKIN_ALIGNMENT_NO_GO.md` | `a809f361f3939c2f309ad7030b8ef5abd5cf321b443d513d7d0c7087a7f38d34` |
| `tests/test_fixed_lambda_galerkin_alignment_no_go.py` | `118afd5b57e9d1b0267d00d230526426cc26833bb74d62f98ccf01f7966198c5` |

The pinned source supplies:

1. lower semicontinuity and lower semiboundedness of every semilocal form;
2. the trigonometric form core and canonical self-adjoint operator;
3. compact resolvent at every fixed `lambda`;
4. monotonicity
   \[
    \lambda>\lambda'\quad\Longrightarrow\quad
    \mu_\lambda\leq\mu_{\lambda'};                       \tag{1.1}
   \]
5. and the exact implication
   \[
    \lim_{\lambda\to\infty}\mu_\lambda=0
    \quad\Longrightarrow\quad\mathrm {RH}.              \tag{1.2}
   \]

The finite-source input fixes the schedule (0.1), the finite anchor, and

\[
 {q_{\lambda_p,N_p}\over d_{4,p}L_p}
 \longrightarrow{\Gamma_0\over A_4^2},
 \qquad 0\leq q_{\lambda_p,N_p}\leq U_{Z,p},
 \qquad U_{Z,p}=o(d_{6,p}).                               \tag{1.3}
\]

The BV/Cauchy input gives the actual anchor's coefficient tail and the
complete infinite source matrix.  The radical and absolute-sampling inputs
give the finite residual estimate reconstructed in Section 4.  No finite
ground vector is an input.

## 2. The cutoff-free operator and the anchor domain

Use the orthonormal source modes `V_n`, `n in Z`, and write the complete
infinite matrix as

\[
 Q_\lambda=D_a+B_\lambda,
 \qquad B_\lambda=D_bH-HD_b,                              \tag{2.1}
\]

\[
 H_{nm}=\begin{cases}(n-m)^{-1},&n\ne m,\\0,&n=m,
 \end{cases}
 \qquad \|H\|=\pi.                                      \tag{2.2}
\]

The source bounds are

\[
 |a_n|\leq\log(|n|+2)+C_{|a|}(\lambda),
 \qquad |b_n|\leq B_b(\lambda),                         \tag{2.3}
\]

where both displayed constants have at most polynomial/polylogarithmic
growth on (0.1).  In particular

\[
 \|B_\lambda\|\leq2\pi B_b(\lambda).                    \tag{2.4}
\]

Let

\[
 X_\lambda=\sum_{n\in\mathbb Z}x_{\lambda,n}V_n.
\]

The actual arithmetic profile is periodic BV after evenization.  Equations
(2.9)--(2.12) of the frozen BV/Cauchy theorem, before projection, give

\[
 |x_{\lambda,n}|
 \leq{C_X(\lambda,L)\over1+|n|},                        \tag{2.5}
\]

with one fixed polynomial expression `C_X`.  The projected norm tends to
`A_4>0`, so the unprojected norm is bounded below eventually.  Therefore
the unit coefficients of `kappa_(lambda,infinity)` satisfy (2.5), after
changing the fixed polynomial.

Equations (2.3), (2.5) imply

\[
 \sum_n|a_nx_{\lambda,n}|^2<\infty.                     \tag{2.6}
\]

Since `B_lambda` is bounded, (2.6) puts the unprojected anchor in the
operator domain of `Q_lambda`, not merely its form domain.  Thus (0.2)--(0.3)
are legal cutoff-free quantities.

## 3. A graph-tail lemma for the infinite Cauchy matrix

The required improvement over a bare operator-norm estimate is elementary.
For every integer `n` with `|n|>=2`, splitting at
`|m|=|n|/2` and `|m-n|=|n|/2` gives

\[
 \boxed{
 \sum_{m\ne n}{1\over(1+|m|)|n-m|}
 \leq C_0{1+\log(|n|+2)\over1+|n|}.}                   \tag{3.1}
\]

The first region contributes a harmonic sum divided by `|n|`; the second
has `1+|m|` comparable to `1+|n|`; and the remaining dyadic tail is
`O((1+|n|)^(-1))`.  There is no outer-cutoff logarithm in (3.1).

From (2.1), (2.3), (2.5), and (3.1),

\[
 |(B_\lambda\kappa_{\lambda,\infty})_n|
 \leq C_1B_b(\lambda)C_X(\lambda,L)
       {1+\log(|n|+2)\over1+|n|}.                     \tag{3.2}
\]

Let `P_N` be the centered Fourier projection.  The integral comparison

\[
 \sum_{n>N}{(1+\log(n+2))^2\over(1+n)^2}
 \leq C_2{(1+\log(N+2))^2\over N}                     \tag{3.3}
\]

and (2.3), (3.2) yield

\[
 \|(I-P_N)Q_\lambda\kappa_{\lambda,\infty}\|
 \leq E_{\lambda,N},                                  \tag{3.4}
\]

where one may take

\[
 E_{\lambda,N}
 ={C C_X(\lambda,L)\over\sqrt N}
 \{1+C_{|a|}(\lambda)
       +(1+B_b(\lambda))\log(N+2)\}.                  \tag{3.5}
\]

The reverse cross term has no diagonal contribution.  Equations
(2.4)--(2.5) give

\[
 \|P_NQ_\lambda(I-P_N)\kappa_{\lambda,\infty}\|
 \leq2\pi B_b(\lambda)\|(I-P_N)
                  \kappa_{\lambda,\infty}\|
 \leq E_{\lambda,N}                                   \tag{3.6}
\]

after enlarging the absolute constant in (3.5).

Put

\[
 s_{\lambda,N}=\|P_N\kappa_{\lambda,\infty}\|,
 \qquad
 \kappa_{\lambda,N}={P_N\kappa_{\lambda,\infty}
                         \over s_{\lambda,N}}.         \tag{3.7}
\]

Since `1-s_(lambda,N)=O(C_X^2/N)`, normalization changes (3.4)--(3.6) by
only another polynomial multiple of `N^(-1)`.  Hence

\[
 \boxed{
 \|Q_\lambda\kappa_{\lambda,\infty}
 -P_NQ_\lambda P_N\kappa_{\lambda,N}\|
 \leq C E_{\lambda,N}.}                               \tag{3.8}
\]

On (0.1), `log N_p=9600(log 2)lambda_p^2`, every other factor in (3.5) is
polynomial/polylogarithmic, and therefore

\[
 E_{\lambda_p,N_p}
 =\operatorname {poly}(\lambda_p,L_p)
   \exp\{-4800(\log2)\lambda_p^2\}.                   \tag{3.9}
\]

The frozen prolate asymptotic is

\[
 d_{4,p}\sim C_4\lambda_p^9e^{-4\pi\lambda_p^2}.
                                                                  \tag{3.10}
\]

Since `4800 log 2>4 pi`, (3.9)--(3.10) prove

\[
 \boxed{E_{\lambda_p,N_p}=o(d_{4,p}L_p).}             \tag{3.11}
\]

This is the decisive cutoff-free transfer margin.

## 4. Transfer of the scalar and residual

Let `R_(lambda,N)` be the complete global-minus-compact radical remainder,
`epsilon_(lambda,N)` its admitted absolute paired-zero sampling upper
bound, and

\[
 U_{Z,\lambda,N}={\epsilon_{\lambda,N}
                      \over\|P_NX_\lambda\|^2}.       \tag{4.1}
\]

The exact radical identity reconstructs the centered finite residual as
the Riesz vector of the cross pairing with `R_(lambda,N)`.  Absolute paired
sampling and ordinary Hilbert-space Cauchy--Schwarz therefore give

\[
 r_{\lambda,N}
 :=\|(P_NQ_{\lambda,+}P_N-q_{\lambda,N}I)
             \kappa_{\lambda,N}\|
 \leq\sqrt{B_{\rm abs}(\lambda,N)U_{Z,\lambda,N}}
       +U_{Z,\lambda,N}.                               \tag{4.2}
\]

The harmless final `U_Z` also covers the passage from the action bound to
the centered residual.  On (0.1), the explicit compact-window constant is

\[
 B_{\rm abs}(\lambda_p,N_p)
 =O(\lambda_p^3(1+\log\lambda_p)^2).                  \tag{4.3}
\]

Equations (1.3), (4.2)--(4.3), and
`d_(6,p)=Theta(lambda_p^13 exp(-4 pi lambda_p^2))` imply

\[
 q_{\lambda_p,N_p}\longrightarrow0,
 \qquad r_{\lambda_p,N_p}\longrightarrow0.           \tag{4.4}
\]

Graph convergence (3.8) gives

\[
 |q_{\lambda,\infty}-q_{\lambda,N}|
 \leq C E_{\lambda,N},                                \tag{4.5}
\]

and, after adding and subtracting the two centered actions,

\[
 r_{\lambda,\infty}
 \leq r_{\lambda,N}+C E_{\lambda,N}.                 \tag{4.6}
\]

All normalization errors are absorbed into the right sides by (3.7)--(3.8).
Now (1.3), (3.11), and (4.4)--(4.6) prove (0.4).  Notice the two different
uses of the exponential cutoff: it removes the graph tail at the much
smaller `d_4L` scale, while the absolute sampler controls the finite
residual.  Neither step assumes a finite or infinite ground line.

## 5. Domain exhaustion, not an oscillator limit

Put `a=log lambda` and identify `H_lambda` with `L2(-a,a)` by `t=log u`.
Extend functions by zero to `L2(R)`.  If compactly supported `f,g` lie in
`L2(-a',a')` and `a>=a'`, the definition by the complete explicit formula
gives

\[
 \boxed{q_\lambda(f,g)=QW(f,g),}                       \tag{5.1}
\]

where the right side is independent of `lambda`.  Thus the form domains
increase and the forms agree on every common compact core.  Equation (1.1)
is precisely the min--max shadow of this exhaustion.

If the family had a common lower bound and the global infimum form were
closable, the monotone-form theorem would yield a **strong** resolvent limit
to that global closure.  It would not yield a norm-resolvent oscillator.
Indeed, the common-translation identity

\[
 QW(f(\,\cdot-a),g(\,\cdot-a))=QW(f,g)                \tag{5.2}
\]

makes every such global limit translation invariant.  A nonzero
translation-invariant resolvent on `L2(R)` is not compact.  On the other
hand, every fixed-interval resolvent is compact, and a norm limit of compact
operators is compact.  Therefore no nontrivial global limit obtained from
this exhaustion can be a norm-resolvent limit of the compact semilocal
resolvents.

The two standard rescalings do not change this conclusion.

1. Keeping `t` fixed makes the interval exhaust the line and
   `kappa_(lambda,infinity)` tend to the Riemann kernel
   `K(t)=E(h)(e^t)`.  The prime translations and archimedean multiplier
   tend to the complete explicit formula, not an oscillator.
2. Rescaling `t=a x` to a fixed interval collapses the localized anchor
   to `x=0`; the prime translations become the moving shifts
   `log(p)/a`.  There is again no fixed harmonic-oscillator operator.

The diagonal asymptotic `a_n=log|n|+O_lambda(1)` proves compactness at fixed
`lambda`, but it is not a uniform confining potential after `n/L` is held
fixed.  The source-Cauchy commutator is bounded at fixed `lambda`, but its
available norm bound grows with `lambda` and it is not a small perturbation
of the diagonal on the anchor scale.  Its useful role here is (3.1)--(3.8),
not a ground-gap theorem.

Finally, the limiting radical is not rank one.  For every admissible even
codimension-two source `f`, the global state `E(f)` annihilates the Weil
pairing in both orientations.  The prolate `0/4` state selects one member
of this infinite-dimensional radical.  The exponentially small defects at
finite `lambda` are a boundary splitting of that degeneracy.  Any oscillator
or rank-one model must first prove a uniform theorem for this splitting;
it cannot be read off from the bulk diagonal.

Positive-Hamiltonian de Branges, Herglotz, or Hankel factorizations do not
currently supply that theorem.  For the actual explicit-form blocks the
relevant Hankel measures are signed, while a positive de Branges kernel
would already encode the missing positivity.  The source-Cauchy displacement
alone also leaves the diagonal free and admits exact logarithmic
compact-resolvent countermodels with arbitrary ground orientation.

## 6. The full-ground overlap dichotomy

Let `P_lambda` be the full bottom spectral projector and
`Q_lambda P_lambda=mu_lambda P_lambda`.  Since `P_lambda` commutes with
`Q_lambda`,

\[
 P_\lambda(Q_\lambda-q_{\lambda,\infty}I)
          \kappa_{\lambda,\infty}
 =(\mu_\lambda-q_{\lambda,\infty})
          P_\lambda\kappa_{\lambda,\infty}.           \tag{6.1}
\]

Taking norms proves (0.6).  Suppose

\[
 \limsup_{p\to\infty}\rho_{\lambda_p}>0.             \tag{6.2}
\]

There are `c>0` and a cofinal subsequence on which `rho>=c`.  Equations
(0.4), (0.6) give

\[
 |\mu_{\lambda_p}|
 \leq |q_{\lambda_p,\infty}|
       +c^{-1/2}r_{\lambda_p,\infty}\longrightarrow0. \tag{6.3}
\]

The numbers `mu_lambda` decrease with `lambda`.  A cofinal subsequence
converging to zero therefore forces their complete monotone limit to be
zero.  Equation (1.2) proves (0.7).

For the reverse implication, suppose RH is false.  By the contrapositive
of the Weil positivity criterion there is a compactly supported normalized
test `f` and `delta>0` with

\[
 QW(f,f)=-\delta.                                      \tag{6.4}
\]

For every sufficiently large `lambda`, `f` belongs to the semilocal form
domain, so min--max and (5.1) give

\[
 \mu_\lambda\leq-\delta.                               \tag{6.5}
\]

Since `q_(lambda_p,infinity)->0`, eventually
`q_(lambda_p,infinity)-mu_(lambda_p)>=delta/2`.  Equation (0.6) yields

\[
 0\leq\rho_{\lambda_p}
 \leq {4r_{\lambda_p,\infty}^2\over\delta^2}
 \longrightarrow0,                                    \tag{6.6}
\]

which proves (0.8).

If only the even bottom projector `P_(lambda,+)` is used, the proof stops
at

\[
 |\mu_{\lambda,+}-q_{\lambda,\infty}|
       \sqrt{\rho_{\lambda,+}}
 \leq r_{\lambda,\infty}.                             \tag{6.7}
\]

It then shows `mu_(lambda,+)->0` under a nonvanishing even overlap.  It does
not control `mu_(lambda,-)` and therefore cannot invoke (1.2) without a
separate full-ground parity theorem.

## 7. Weakest remaining spectral estimate

Let the full ground be simple and define

\[
 \Delta_\lambda
 =\operatorname {dist}\left(
 q_{\lambda,\infty},
 \sigma(Q_\lambda)\setminus\{\mu_\lambda\}\right).    \tag{7.1}
\]

Spectral expansion gives the exact a posteriori estimate

\[
 \boxed{1-\rho_\lambda
 \leq {r_{\lambda,\infty}^2\over\Delta_\lambda^2}.}   \tag{7.2}
\]

Consequently the weakest direct isolation target for
`1-rho_lambda=O(lambda^(-1))` is

\[
 \boxed{\Delta_\lambda
 \geq c\sqrt\lambda\,r_{\lambda,\infty},}             \tag{7.3}
\]

together with the assertion that the isolated eigenvalue is the full
ground.  A convenient stronger source-form target, avoiding the unknown
ground vector, is

\[
 \boxed{
 P_{\kappa_\lambda^\perp}
 (Q_\lambda-q_{\lambda,\infty}I)
 P_{\kappa_\lambda^\perp}
 \geq G_\lambda P_{\kappa_\lambda^\perp},
 \quad G_\lambda>0,
 \quad G_\lambda\geq c\sqrt\lambda\,
                         r_{\lambda,\infty}.}          \tag{7.4}
\]

By compression interlacing and the Schur complement, (7.4) produces one
simple full ground and (7.2)--(7.3).  The high-Fourier logarithmic diagonal
controls only a remote tail; it does not prove (7.4) on the retained
near-radical space.  Fixed prolate-prefix Toeplitz limits control every
fixed packet but do not give the uniform all-direction lower bound in
(7.4).  This boundary-splitting estimate, or the weaker exact spectral
isolation (7.3), is the stopping line.

## 8. Reproduction and claim discipline

Run

    python3 -B -m unittest \
      tests.test_cutoff_free_prolate_ground_alignment_rh_dichotomy -v

The regression uses exact rational arithmetic for the Cauchy-tail and
spectral-projector identities, validates every frozen byte, and reads no
zero table, numerical ground, prolate artifact, or cached matrix.

This note must not be cited as proving any premise of (0.7), (7.3), or
(7.4).  Its unconditional analytic conclusions are the cutoff-free
transfer (0.4), the exhaustion identity (5.1), the projector inequality
(0.6), and the RH-false consequence (0.8).  The project state remains
`P0_INVALIDATED`.
