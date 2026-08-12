# Unconditional natural-halfgrid HSW scalar-to-even-frame barrier

## 0. Exact outcome and claim boundary

Use the unconditional odd-halfgrid natural schedule

\[
 \lambda_p={p\over2},\qquad L_p=2\log\lambda_p,
 \qquad M_p={p+1\over2},\qquad
 N_p=M_p+1={p+3\over2},                           \tag{0.1}
\]

where `p` is odd, and put

\[
 \Omega_p={2\pi N_p\over L_p}.                    \tag{0.2}
\]

The frozen HSW extraction gives a deterministic cofinal subsequence and a
selected multiplicity-weighted shell `Gamma_T` on which

\[
 W_T(L)=\sum_{\gamma\in\Gamma_T}
 {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
 \geq {Z(T)\over32T^2}>0.                         \tag{0.3}
\]

This note determines exactly what (0.3) does and does not say about the
finite inversion-even source matrix.

On RH only, let `G_T^+` be the positive zero-evaluation Gram contributed by
this shell.  Direct calculation in the locked centered Fourier basis gives

\[
 \boxed{G_T^+={8W_T\over L}\,\mathcal C_T,
 \qquad (\mathcal C_T)_{00}=1.}                   \tag{0.4}
\]

Thus HSW controls one diagonal scalar, not the least eigenvalue of
`mathcal C_T`.  In fact, for the frozen carrier-safe choice
`T asymptotic to theta*Omega`, `0<theta<1/2`, the shell Gram has rank less
than `N/4` eventually, whereas the even complement `kappa^perp` has
dimension `N`.  Its projected covariance floor is therefore exactly zero.
Even the union of all positive zero rows through `Omega` has rank less than
`N/2+o(N)` and cannot frame the complement.

At higher shells, the count first permits `N` rows only above approximately
`2*Omega`.  Counted algebraic multiplicity is not row rank, however.  The
HSW unit-bin cap and (0.3) certify only order `T` distinct phase-active bins.
For natural-scale shells this is order `N/L`, not `N`.  Combining enough
disjoint dyadic shells to force `N` distinct active bins from those bounds
moves the largest shell to `T` of order `N`, where the frozen
`1/(16T)` phase-stability radius no longer dominates the odd-halfgrid mesh
of order `1/lambda`.  This is a limitation of the admitted extraction, not
a theorem that the actual higher zero rows fail to form a frame.

Off RH, the obstruction occurs before rank.  HSW counts ordinates and
algebraic multiplicity but does not see the centered real part of a zero.
The exact explicit formula gives a signature `(1,1)` Krein block for an
off-line quartet, not a positive row square.  Consequently (0.4) is not an
unconditional positive subform of the actual complete source matrix.

The exact conditional covariance theorem is also recorded.  If RH is
assumed and

\[
 g_T:={8W_T\over L}\,
 \lambda_{\min}\!\left(
 P_{\kappa^\perp}\mathcal C_TP_{\kappa^\perp}
 \big|_{\kappa^\perp}\right)>q,
 \qquad q=\langle\kappa,Q_+\kappa\rangle,          \tag{0.5}
\]

then the strict even-complement gate follows.  If `mu` is the lowest even
eigenvalue and `mathcal A` is the simple-ground projective alignment, then

\[
 \boxed{\mathcal A\leq {q\over g_T}.}              \tag{0.6}
\]

Hence `q/g_T=O(lambda^(-1))` would close the pointwise alignment target.
Neither the covariance floor in (0.5) nor this relative ratio is proved.
In particular, `q` is used only as the exact frozen source Rayleigh scalar;
no decay, sign beyond an explicitly RH-positive branch, or comparison with
`8W_T/L` is imported.

Finally, without RH the minimal signed-source replacement is an actual
lower bound for the complete projected source covariance together with one
relative Schur ratio.  Section 7 gives its pointwise and checkpoint-1.57
weighted forms.  Those forms are targets, not conclusions.

This is a narrow post-checkpoint-1.57 theorem/barrier pair.  It changes none
of the standard eight files, adds no zero table or numerical artifact, and
proves no finite source gate, determinant convergence, zero statement, RH,
converse from RH, or de Bruijn--Newman bound.  The formal state remains
`P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three note/test pairs are frozen.

| Dependency | SHA-256 |
|---|---|
| `notes/UNCONDITIONAL_NATURAL_HALFGRID_CROSSROOT_SCHEDULE_THEOREM.md` | `d1b73fc246fcc70886ba78dc074adac585372a2abfc9fbba678c03c4d47e30a5` |
| `tests/test_unconditional_natural_halfgrid_crossroot_schedule_theorem.py` | `00627aa69143c39a468dd06808fe6859beb16aff197127e66a93ff042377f1b9` |
| `notes/NATURAL_CROSSROOT_WEIGHTED_PROJECTOR_AVERAGE_TARGET.md` | `d477178ac4daed6315bdce4bc27b94b073bf0611c87a1f3192b4b5b7147334cf` |
| `tests/test_natural_crossroot_weighted_projector_average_target.py` | `36a70f9de303fe49ac60dfd1285542486615f696dfd66566fe73158eeba9a390` |
| `notes/GROWING_SIGNED_DISCREPANCY_CENTERED_ZERO_KREIN_FACTORIZATION_BARRIER.md` | `0257bb5582700fada40fc2a6c6ba578a09fad94e11eb4fa0f72a525c80bd04c9` |
| `tests/test_growing_signed_discrepancy_centered_zero_krein_factorization_barrier.py` | `b34f647f320e2e19b614ced03959d152895f6d91a864e4717e43accc7546f533` |

The first pair supplies (0.1)--(0.3), the exact odd-halfgrid mesh, the HSW
unit-bin quantities `Z(T)` and `B(T)`, the stability radius, and the
natural-cutoff projective rates.  The second supplies the actual complete
source, the lower two-vector Ritz gate, the simple and canonical alignment
targets, and the denominator-safe weighted-projector formulation.  The
third supplies the unconditional centered-zero feature factorization and
the exact off-line Krein signature.

The even shell row and all rank and Schur calculations below are proved
directly.  No RH-conditional scalar-transfer theorem, critical schedule,
zero list, cached matrix, producer artifact, standard-eight byte, or
additional source lock is imported.

## 2. Exact even shell row and carrier-continuous covariance

Fix one schedule point and suppress `p`.  Put

\[
 a_n={2\pi n\over L},\qquad
 V_n(t)={(-1)^n\over\sqrt L}e^{ia_nt},\qquad
 e_n^+={V_n+V_{-n}\over\sqrt2}.                   \tag{2.1}
\]

For the centered Fourier transform, direct integration gives

\[
 \widehat V_n(\gamma)
 ={2\sin(\gamma L/2)\over\sqrt L(\gamma-a_n)}.   \tag{2.2}
\]

Therefore the positive-ordinate evaluation row in the ordered even basis
`(V_0,e_1^+,...,e_N^+)` is

\[
 \boxed{
 b_N(\gamma)={2\sin(\gamma L/2)\over\sqrt L\,\gamma}
 r_N(\gamma),}                                    \tag{2.3}
\]

where

\[
 r_N(\gamma)=\left(
 1,{\sqrt2\,\gamma^2\over\gamma^2-a_1^2},\ldots,
 {\sqrt2\,\gamma^2\over\gamma^2-a_N^2}\right). \tag{2.4}
\]

Every displayed pole is removable in `b_N`.  At a positive carrier
`gamma=a_k`,

\[
 b_N(a_k)=(-1)^k\sqrt{L\over2}\,e_k^+,
 \qquad1\leq k\leq N.                             \tag{2.5}
\]

In particular, a carrier has zero scalar phase weight in (0.3) but a
nonzero matrix row.  It would be incorrect to delete it.

Assume RH only for the rest of this section.  With the repository paired
row normalization, define

\[
 G_T^+=2\sum_{\gamma\in\Gamma_T}m_\gamma
 |b_N(\gamma)\rangle\langle b_N(\gamma)|.         \tag{2.6}
\]

For `W_T>0`, define the normalized shell covariance by the combined limit

\[
 \boxed{
 \mathcal C_T={1\over W_T}
 \sum_{\gamma\in\Gamma_T}
 {m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
 |r_N(\gamma)\rangle\langle r_N(\gamma)|,}       \tag{2.7}
\]

where the whole matrix summand, rather than its scalar and vector factors,
is continued at every carrier.  For example, at `gamma=a_k`,

\[
 \lim_{\gamma\to a_k}
 {8\over L}{m_\gamma\sin^2(\gamma L/2)\over\gamma^2}
 |r_N(\gamma)\rangle\langle r_N(\gamma)|
 =m_\gamma L|e_k^+\rangle\langle e_k^+|.          \tag{2.8}
\]

Equations (2.3), (2.6), and (2.7) prove (0.4).  The carrier limits in
(2.8) have zero central coordinate, while every noncarrier summand has
central entry equal to its scalar weight.  Hence

\[
 \boxed{\mathcal C_T\succeq0,
 \qquad(\mathcal C_T)_{00}=1.}                    \tag{2.9}
\]

The HSW theorem controls the normalization `W_T` in (2.7).  It gives no
lower bound for any other eigenvalue of `mathcal C_T`.

## 3. The frozen shell has an exact projected rank zero

Let `mathcal N(X)` count positive ordinates through `X` with algebraic
multiplicity.  The HSW main term and error give

\[
 \mathcal N(2T)-\mathcal N(T)
 ={T\over2\pi}
 \left\{\log T+\log{2\over\pi}-1\right\}
 +O(\log T).                                      \tag{3.1}
\]

The selected set `Gamma_T` is contained in `(T,2T]`.  Algebraic
multiplicity changes row weight but does not create a derivative jet.
Consequently

\[
 \operatorname {rank}G_T^+
 \leq\#\{\hbox{distinct ordinates in }\Gamma_T\}
 \leq\mathcal N(2T)-\mathcal N(T).                \tag{3.2}
\]

On the frozen extraction, `T=floor(theta*Omega^-)`, where `Omega^-` is the
minimum bandwidth in the fixed-length selection block and `0<theta<1/2`.
At the selected point,

\[
 T\leq\theta\Omega,\qquad T\asymp_{\theta,h}\Omega,
 \qquad N=\lambda+{3\over2},\qquad
 \log T={L\over2}-\log L+O_{\theta,h}(1),         \tag{3.3}
\]

where the harmless constant in the last term may also depend on the fixed
block length `h`.  The main term in (3.1) is increasing for large `T`, so
comparison with `theta*Omega` gives

\[
 \boxed{
 \mathcal N(2T)-\mathcal N(T)
 \leq{\theta N\over2}
 -{\theta N\log L\over L}
 +O_{\theta,h}\!\left({N\over L}\right)
 <{N\over4}}                                      \tag{3.4}
\]

eventually.  The even space has dimension `N+1`, so
`K=kappa^perp` has dimension `N`.  Define

\[
 \chi_T(K)=\lambda_{\min}\!\left(
 P_K\mathcal C_TP_K\big|_K\right).               \tag{3.5}
\]

Projection cannot increase rank.  Equations (0.4), (3.2), and (3.4) prove
the exact conclusion

\[
 \boxed{\chi_T(K)=0.}                              \tag{3.6}
\]

This is a theorem about the frozen shell Gram on the RH-conditional branch.
It is not a claim that the complete source complement has zero floor.
Rows outside the shell remain in the complete matrix.

## 4. All carrier-safe rows still leave a macroscopic nullspace

The same count obstruction persists if every positive row through the top
carrier is retained.  From `Omega=2*pi*N/L`,

\[
 \begin{aligned}
 \mathcal N(\Omega)
 &={\Omega\over2\pi}
   \log{\Omega\over2\pi e}+O(\log\Omega)\\
 &={N\over2}-{N(\log L+1)\over L}+O(L).
 \end{aligned}                                    \tag{4.1}
\]

Thus, eventually,

\[
 \boxed{
 \operatorname {rank}G_{(0,\Omega]}^+
 \leq\mathcal N(\Omega)<N,\qquad
 \lambda_{\min}\!\left(
 P_KG_{(0,\Omega]}^+P_K\big|_K\right)=0.}        \tag{4.2}
\]

Indeed the rank deficit is

\[
 N-\mathcal N(\Omega)
 ={N\over2}+{N(\log L+1)\over L}+O(L).            \tag{4.3}
\]

Negative ordinates duplicate the even rows and do not repair (4.2).
Repeated zeros only increase existing row weights.  Hence neither the
parity-bin deletion nor a poor choice of one dyadic shell causes the main
deficit: the complete carrier-safe positive sampling range is itself below
the necessary row count.

## 5. Higher and multiple shells: the precise admitted limitation

For fixed `c>0`, put `R=c*Omega`.  The same calculation gives

\[
 \boxed{
 \mathcal N(R)
 ={cN\over2}
 -{cN(\log L+1-\log c)\over L}+O_c(L).}           \tag{5.1}
\]

Therefore total row count cannot reach `N` for fixed `c<2`, and still falls
short at `c=2`.  Every fixed `c>2` eventually passes this necessary count
threshold.  Passing it proves neither distinctness, nonzero phase, nor a
frame lower bound.

The frozen unit-bin cap is

\[
 M_r\leq B(T),\qquad B(T)=O(\log T).               \tag{5.2}
\]

Let `J_T` be the number of selected bins with a positive contribution to
`W_T`.  Since one bin contributes at most `B(T)/T^2`, equation (0.3) gives

\[
 \boxed{J_T\geq {Z(T)\over32B(T)}=\Theta(T).}      \tag{5.3}
\]

Each such bin contains at least one distinct phase-active ordinate, and
selected bins are separated.  But (5.3) is only order `N/L` when
`T=O(Omega)`.  The HSW inputs are compatible with order `log T`
multiplicity being concentrated in each occupied bin, so they do not force
`N` distinct active rows at that scale.

Now consider pairwise disjoint dyadic shells `(T_j,2T_j]`.  Ordered by
height, disjointness gives `T_{j+1}>=2T_j` and therefore

\[
 \sum_jT_j\leq2\max_jT_j.                          \tag{5.4}
\]

To force order `N` distinct active bins using only the guaranteed order in
(5.3), one must have

\[
 \max_jT_j\gg N\asymp\lambda.                     \tag{5.5}
\]

The frozen rounding argument compares the odd-halfgrid mesh
`O(lambda^(-1))` with the stability radius at least `1/(16T)`.  At (5.5),

\[
 {T\over\lambda}\not\longrightarrow0.             \tag{5.6}
\]

Thus its certified rounding step no longer transfers simultaneous
continuous phase goodness to the prescribed half-grid.  Overlapping shells
do not permit the active-bin lower bounds to be added without duplication.

Equations (5.1)--(5.6) leave two independent missing inputs: a discrete
halfgrid phase theorem at heights of order `lambda`, and a quantitative
Cauchy-row covariance theorem after distinct active rows have been found.
Row count alone never supplies the latter.

## 6. Off RH, `W_T` is not a positive source subform

Write a centered zero as

\[
 z=\beta+i\gamma,
 \qquad |\beta|<{1\over2},                        \tag{6.1}
\]

and for a finite Fourier vector put

\[
 A_f(z)=\int_{-L/2}^{L/2}f(x)e^{-zx}\,dx.         \tag{6.2}
\]

The frozen centered-zero factorization states that a critical-axis orbit
`z=i*gamma` contributes the positive square

\[
 2|A_f(i\gamma)|^2.                                \tag{6.3}
\]

This is the RH-conditional row used in Section 2.  In contrast, an
off-line quartet contributes on the even sector

\[
 \boxed{
 m_z\left\{|A_f(z)+A_f(\overline z)|^2
 -|A_f(z)-A_f(\overline z)|^2\right\}.}           \tag{6.4}
\]

The two channels in (6.4) are independent and have opposite signs.  The
HSW scalar sees `gamma`, `m_gamma`, and `sin^2(gamma*L/2)`, but not `beta`
or either channel in (6.4).  Functional-equation partners off the critical
line can share the same positive ordinate and add positive mass to `W_T`
while contributing one negative Krein direction to the source form.

It follows that no unconditional Loewner comparison

\[
 Q_+\succeq G_T^+                                  \tag{6.5}
\]

is available.  The complete source-Cauchy displacement does not change
the signature in (6.4), and one positive diagonal scalar cannot determine
the unrestricted diagonal data of a source-Cauchy matrix.  Therefore HSW
phase goodness does not unconditionally lower even one source Rayleigh
quotient, much less the complete even-complement minimum.

## 7. Exact covariance-to-gate-to-alignment theorem

This section first states the clean RH-conditional implication and then the
minimal signed-source target that does not assume RH.

Let `Q_+` be the complete even source matrix, let `kappa` be unit, and put

\[
 K=\kappa^\perp,\qquad
 q=\langle\kappa,Q_+\kappa\rangle,\qquad
 b=P_KQ_+\kappa,\qquad
 A=P_KQ_+P_K\big|_K.                              \tag{7.1}
\]

Let `u` be the frozen lower two-vector Ritz value, `mu` the lowest even
eigenvalue, and

\[
 a=\lambda_{\min}(A).                              \tag{7.2}
\]

The only frozen envelope for the Rayleigh scalar is the variational order

\[
 \mu\leq u\leq q.                                  \tag{7.3}
\]

No smallness estimate for `q`, no identification of `q` with the central
entry in (0.4), and no bound comparing `q` to `W_T` is asserted.

### Theorem 7.1 (conditional shell covariance suffices)

Assume RH in this theorem only.  Define

\[
 g_T={8W_T\over L}\chi_T(K).                       \tag{7.4}
\]

If `g_T>q`, then the strict simple even gate holds and

\[
 \boxed{
 P_K(Q_+-uI)P_K\succ0,
 \qquad
 \mathcal A\leq{q\over g_T}.}                    \tag{7.5}
\]

**Proof.**  On RH, the complete even source is the full positive
zero-evaluation Gram and contains the shell Gram as a positive subform.
Equations (0.4) and (3.5) give `a>=g_T`.  Together with (7.3), this proves
`a>u` and the first assertion.

The gate makes the lowest line simple and visible from `kappa`.  Let

\[
 B_\mu=A-\mu I,
 \qquad x=\kappa-B_\mu^{-1}b.                     \tag{7.6}
\]

The block matrix `Q_+-mu*I` is positive semidefinite and singular.  Its
Schur complement gives

\[
 \boxed{b^*B_\mu^{-1}b=q-\mu.}                    \tag{7.7}
\]

Since `lambda_min(B_mu)=a-mu`,

\[
 \begin{aligned}
 \mathcal A
 &\leq\|B_\mu^{-1}b\|^2\\
 &\leq{q-\mu\over a-\mu}
 \leq{q-\mu\over g_T-\mu}
 \leq{q\over g_T}.
 \end{aligned}                                    \tag{7.8}
\]

The last inequality uses `0<=mu<=q<g_T`, which is available only on the
positive RH branch.  This proves (7.5).  \(\square\)

For the frozen shell, (3.6) gives `g_T=0`, so Theorem 7.1 has no
application.  A higher or multiple-shell theorem would have to prove both

\[
 \boxed{g_T>q,
 \qquad {q\over g_T}=O(\lambda^{-1}).}             \tag{7.9}
\]

Neither statement follows from `W_T>0`.

### Theorem 7.2 (minimal complete signed-source target)

Do not assume RH.  At one natural schedule point, suppose the actual
complete source satisfies

\[
 \boxed{a>u.}                                      \tag{7.10}
\]

Then the simple even gate holds, `B_mu` is positive definite, (7.7) remains
an exact finite Schur identity, and

\[
 \boxed{
 \mathcal A\leq {q-\mu\over a-\mu}.}              \tag{7.11}
\]

Indeed `Q_+-mu*I` is positive semidefinite by the definition of its lowest
eigenvalue, irrespective of the sign of `mu`; the rest of the proof of
(7.7)--(7.8) does not use RH.  What is lost is the shell lower bound for
`a`, the sign `mu>=0`, and the last comparison with `q/g_T`.

For checkpoint 1.57, restore the index `p`, write `v_p` for its lower Ritz
value, and define the actual signed covariance-response ratio

\[
 \mathfrak R_p={q_p-\mu_p\over a_p^{\rm cmp}-\mu_p},
 \qquad
 a_p^{\rm cmp}
 =\lambda_{\min}\!\left(
 P_{\kappa_p^\perp}A_pP_{\kappa_p^\perp}
 \big|_{\kappa_p^\perp}\right).                  \tag{7.12}
\]

Here `a_p^{cmp}` is not the visibility scalar called `a_p` in checkpoint
1.57.  On a finite-good set, the following two actual-source estimates are
sufficient:

\[
 \boxed{
 a_p^{\rm cmp}>v_p\quad(p\in\mathcal G_P),}       \tag{7.13}
\]

and

\[
 \boxed{
 \sum_{p\in\mathcal G_P}|a_p|^2\mathfrak R_p
 \leq {C(\log P)^B\over P}
       \sum_{p\in\mathcal G_P}|a_p|^2.}           \tag{7.14}
\]

By Theorem 7.2, `mathcal A_p<=mathfrak R_p`, so (7.14) implies the frozen
weighted-projector target.  Equations (7.13)--(7.14) are the minimal signed
projected covariance and relative inverse-response theorem exposed by this
audit.  They are not proved here.  They must use the complete
pole-minus-archimedean-minus-prime source before any spectral operation.

Equivalently, the pointwise implication used in that weighted passage is

\[
 \boxed{\mathcal A_p\leq\mathfrak R_p.}            \tag{7.15}
\]

## 8. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. uses (0.4), (2.6), or Theorem 7.1 without explicitly assuming RH;
2. treats algebraic multiplicity as independent evaluation rows or
   derivative jets;
3. deletes the finite carrier contribution because its scalar HSW phase
   weight is zero;
4. infers a complement frame from `(mathcal C_T)_(00)=1`;
5. ignores the exact rank-zero conclusion (3.6) for the frozen shell;
6. combines only carrier-safe rows and claims a full even-complement frame;
7. treats the count threshold `c>2` as a distinctness, phase, or
   conditioning theorem;
8. adds overlapping shell active-bin lower bounds without controlling
   duplicated ordinates;
9. applies the frozen halfgrid rounding argument at `T` of order `lambda`;
10. replaces the off-line Krein block by two positive squares;
11. identifies `q` with `8W_T/L` or asserts an unproved smallness envelope
    for `q`;
12. infers (7.9), (7.13), or (7.14) from HSW phase goodness;
13. states that a qualitative gate supplies the `O(lambda^(-1))` relative
    Schur ratio; or
14. claims a finite source gate, determinant convergence, an unconditional
    zero theorem, RH, a converse, or a de Bruijn--Newman bound.

The earliest positive zero-side theorem is a higher-shell, discrete
odd-halfgrid projected covariance bound that proves (7.9), but it is
RH-conditional and therefore cannot serve as an unconditional input.  The
unconditional route must instead prove the complete signed-source estimates
(7.13)--(7.14) directly.  No such theorem is supplied.  The formal state
remains `P0_INVALIDATED`.
