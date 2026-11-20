# Verified-height shrinking-collar partial theorem

## 0. Claim boundary and exact outcome

This note records three weakenings of the natural-cutoff collar target and
one unconditional-with-pinned-input partial result.

1. A collar equality need only hold on an unbounded subsequence whose
   physical inner heights have lower limit zero.  Convergence of the inner
   height along the full natural-cutoff schedule is unnecessary.
2. The compact-rectangle alternative needs only one nested cofinal
   exhaustion of the off-real open strip.  It does not require a separately
   stated theorem for every rectangle.
3. Let

   \[
    H_{\rm PT}=3000175332800.                         \tag{0.1}
   \]

   The pinned Platt--Trudgian theorem says that every nontrivial zeta zero
   through this height is on the critical line.  For every fixed
   `0<R<H_PT`, choose `R<R_*<H_PT` with `R_*` not a zero ordinate.  The
   admitted fixed-compact Gevrey estimate therefore proves
   that the source-normalized natural-cutoff anchor is eventually zero-free
   on

   \[
    |\Re z|\le R,
    \qquad {1\over L}\le |\Im z|\le {1\over2}.       \tag{0.2}
   \]

   No simplicity of the verified zeros is needed.  The completed function
   has no zeros on the boundary lines corresponding to `Re(s)=0,1`, so the
   closed outer height in (0.2) is harmless.  The physical inner
   height `1/L` corresponds to the constant raw square-root height
   `a_lambda=1/(2*pi)`.

The third item uses only the published finite-height theorem pinned in
`ZERO_SAMPLING_SOURCE_LOCK.json`.  Its Arb/Turing computation is disclosed
but is not independently replayed in this repository.  The resulting
horizontal window is fixed, not asymptotically unbounded.  Consequently
this note proves no global shrinking-collar equality, no endpoint-jet lower
bound, no horizontal-escape bound, no equation (5.2) of
`DIRECT_RH_ATTACK.md`, and no Riemann-hypothesis conclusion.  The formal
terminal state remains `P0_INVALIDATED`.

The binding conventions remain those of `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`:

\[
 L=2\log\lambda,
 \qquad M=\lceil\lambda\rceil,
 \qquad \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt. \tag{0.3}
\]

Lebesgue measure, zero extension, explicit inversion evenization, the
centered phase `(-1)^n`, and the locked pole--archimedean--minus-prime
assembly are unchanged.

## 1. The exact collar input

Let `f_lambda=P_M X_lambda` be the actual source-normalized natural-cutoff
anchor and put

\[
 \delta={L\over4\pi}.
\tag{1.1}
\]

For a positive physical inner height `epsilon_lambda`, its raw
square-root height is

\[
 a_\lambda={\epsilon_\lambda L\over2\pi}
            =2\epsilon_\lambda\delta.              \tag{1.2}
\]

Use the reduced raw polynomial and the one-sided root counts of
`NATURAL_CUTOFF_SHRINKING_COLLAR_ESCAPE_REDUCTION.md`.  Once the already
proved closed negative-real branch is excluded, its exact open-collar
identity is

\[
 Z_{\delta-}-Z_{a_\lambda+}=4C_{(a_\lambda,\delta)}, \tag{1.3}
\]

where `C` counts conjugate nonreal raw-root pairs with algebraic
multiplicity.  In the nonzero-leading-coefficient branch this is

\[
 \mathcal I_{a_\lambda+}-\mathcal I_{\delta-}
 =4C_{(a_\lambda,\delta)}.                          \tag{1.4}
\]

The polynomial-loop convention applies when the leading coefficient
vanishes.  Nothing below changes those one-sided conventions.

## 2. Only a liminf-zero certified subsequence is needed

### Theorem 2.1 (subsequence collar implication)

Let `lambda_j` be an unbounded natural-cutoff schedule on which

\[
 4\widehat f_{\lambda_j}\longrightarrow\Xi
 \quad\hbox{locally uniformly on }|\Im z|<1/2.       \tag{2.1}
\]

Assume the closed negative-real exclusion on a tail of this schedule.  It
is enough that there be an unbounded certified subsequence `j_k` such that

\[
 Z_{\delta_{j_k}-}=Z_{a_{j_k}+}                     \tag{2.2}
\]

and

\[
 \boxed{\lim_{k\to\infty}\epsilon_{\lambda_{j_k}}=0.} \tag{2.3}
\]

Then `Xi` has no off-real zero in `|Im z|<1/2`.

**Proof.**  If `Xi(z_0)=0` with
`0<|Im(z_0)|<1/2`, choose a closed zero-isolating disk about `z_0`,
contained in the open strip and disjoint from both axes.  There are fixed
numbers

\[
 0<\beta_-\le |\Im z|\le\beta_+<1/2               \tag{2.4}
\]

throughout the disk.  Local uniform convergence and Rouche's theorem put a
zero of every sufficiently late anchor in that disk.  On the certified
subsequence, (2.3) eventually gives
`epsilon_(lambda_(j_k))<beta_-`.  The exact transform then turns the anchor
zero into a nonreal raw root strictly between `a_(j_k)` and `delta_(j_k)`.
Equation (1.3) contradicts (2.2).  \(\square\)

Thus, if (2.2) is certified at every sufficiently late schedule point, the
weaker condition

\[
 \liminf_{j\to\infty}\epsilon_{\lambda_j}=0         \tag{2.5}
\]

already suffices: pass to a subsequence realizing the lower limit.  In raw
units the condition is

\[
 \liminf {a_\lambda\over L}=0.                     \tag{2.6}
\]

The raw inner height need not tend to zero.  It may be constant, or may
grow by any `o(L)` law.  For example,

\[
 \epsilon_\lambda={1\over L},
 \qquad a_\lambda={1\over2\pi}                    \tag{2.7}
\]

is sufficient if the global collar equality can be proved.  There is no
weakest positive null rate: any arbitrarily slowly decreasing physical
height works in Theorem 2.1.

## 3. One cofinal compact exhaustion is enough

For integers `k>=5`, set

\[
 \mathcal K_k=\left\{z:
  |\Re z|\le k,
  \quad {1\over k}\le |\Im z|\le {1\over2}-{1\over k}
                         \right\}.                 \tag{3.1}
\]

These compact sets are nested and

\[
 \bigcup_{k\ge5}\mathcal K_k
 =\{z:|\Im z|<1/2,\ z\notin\mathbb R\}.            \tag{3.2}
\]

### Theorem 3.1 (cofinal compact criterion)

Under (2.1), suppose there are schedule indices `j_k` tending to infinity
such that `widehat(f_(lambda_(j_k)))` has no zero in `K_k`.  Then `Xi` has
no off-real zero in the open strip.

**Proof.**  An off-real zero `z_0` of `Xi` has a closed isolating disk
contained in the interior of `K_k` for every sufficiently large `k`.
Rouche's theorem and `j_k->infinity` put an anchor zero in that disk for
every sufficiently large `k`, contradicting the assumed zero-freeness of
`K_k`.  \(\square\)

The particular exhaustion (3.1) is only a convenient choice.  The minimal
geometric requirement is synchronized cofinality: the certified horizontal
radius tends to infinity, the inner height has lower limit zero, and the
outer height tends to `1/2`, along one unbounded anchor subsequence.  Sparse
certification is sufficient.

For a finite raw polynomial, the argument principle on the two rectangles
corresponding to `K_k` is an exact phase certificate.  No limit at
horizontal infinity and no endpoint-jet root bound is needed.  Conjugation
symmetry reduces the lower rectangle to the upper one.  Proving that the
resulting integer is zero for a cofinal actual-source exhaustion is still
the missing global zero-location theorem.

## 4. The fixed verified-height collar

The new partial theorem combines two already pinned inputs.

First, equations (3.6)--(3.14) of
`NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md` retain the complete formal
multiplier.  For every fixed closed rectangle

\[
 \mathcal R_R=\{z:|\Re z|\le R,\ |\Im z|\le1/2\}, \tag{4.1}
\]

the same proof, while retaining its exact Xi factor, gives

\[
 \boxed{
  4\widehat f_\lambda(z)=\Xi(z)A_{\lambda,R}(z)
                         +E_{\lambda,R}(z),}
                                                               \tag{4.2}
\]

uniformly on `R_R`, where

\[
 \boxed{
  \sup_{\mathcal R_R}|A_{\lambda,R}-1|=O_R(\lambda^{-2}),
  \qquad
  \sup_{\mathcal R_R}|E_{\lambda,R}|
       \le C_Re^{-c_RL^2}.}                           \tag{4.2a}
\]

Indeed, the `L2` Gevrey remainder costs at most `lambda^(1/2)` under the
closed-strip evaluation functional and remains `exp(-cL^2)`.  The
full-line Gaussian tail is uniform in `Re z`.  On a fixed compact, the
exact identities

\[
 \widehat G_j(z)=P_j(z^2)\Xi(z),
 \qquad \widehat G_0(z)={\Xi(z)\over4}              \tag{4.3}
\]

and the Gevrey-one coefficient majorant make the multiplier correction
`O_R(lambda^(-2))`.  The constants and the starting threshold are
qualitative; (4.2)--(4.2a) are not a finite numerical certificate.  If one
forgets the useful factorization, they also imply the coarser fixed-compact
statement

\[
 \sup_{\mathcal R_R}|4\widehat f_\lambda-\Xi|
 =O_R(\lambda^{-2}).                                  \tag{4.3a}
\]

Second, the pinned finite-height theorem in
`ZERO_SAMPLING_SOURCE_LOCK.json` states that every nontrivial zero
`rho=beta+i*gamma` with

\[
 0<|\gamma|\le H_{\rm PT}                            \tag{4.4}
\]

has `beta=1/2`.  Under

\[
 \Xi(z)=\xi(1/2+iz),                                 \tag{4.5}
\]

this puts every zero of `Xi` in `R_R` with `Re(z)!=0`, for fixed
`R<H_PT`, on the real `z`-axis.  The omitted ordinate `gamma=0`
corresponds to `Re(z)=0`.  Lemma 4.1 of
`NATURAL_CUTOFF_NEGATIVE_REAL_ROOT_EXCLUSION.md` proves independently that

\[
 \boxed{\Xi(i\tau)>0\qquad(|\tau|\le1/2),}          \tag{4.4a}
\]

so there is no zero on that remaining vertical segment.  Hence every zero
of `Xi` in `R_R` is real.
The zeros of the completed function are precisely the nontrivial zeros;
in particular there are no completed-function zeros on the boundary lines
`Re(s)=0,1`, corresponding to `|Im(z)|=1/2`.

### Lemma 4.1 (finite real-zero lower bound)

Fix `0<R<H_PT`, and choose

\[
 R<R_*<H_{\rm PT}                                    \tag{4.5a}
\]

so that `R_*` is not the ordinate of a zero.  This is possible because the
zero set is discrete.  Let `m_R` be the total algebraic multiplicity of the
finitely many zeros of `Xi` in `R_(R_*)`.  There is a constant `b_R>0` such
that

\[
 \boxed{
  |\Xi(x+iy)|\ge b_R|y|^{m_R}
  \quad(|x|\le R,\ |y|\le1/2).}                    \tag{4.6}
\]

**Proof.**  List the distinct real zeros in the rectangle as `rho_nu`,
with multiplicities `m_nu`, and factor

\[
 \Xi(z)=H_R(z)\prod_\nu(z-\rho_\nu)^{m_\nu}.       \tag{4.7}
\]

Factor all zeros in the larger compact rectangle `R_(R_*)`.  The choice of
`R_*` avoids a zero on its vertical boundary.  After these zeros are
removed, the quotient `H_R` has a positive minimum on the smaller rectangle
`R_R`.  Since every `rho_nu` is real,
`|x+iy-rho_nu|>=|y|`.  Multiplying these inequalities proves (4.6), with
`m_R=sum m_nu`.  No simplicity assertion is used.  \(\square\)

### Theorem 4.2 (verified-height `1/L` collar)

For every fixed `0<R<H_PT`, all sufficiently large source-normalized
natural-cutoff anchors satisfy

\[
 \boxed{
  \widehat f_\lambda(z)\ne0
  \quad\hbox{when}\quad
  |\Re z|\le R,
  \quad {1\over L}\le|\Im z|\le {1\over2}.}       \tag{4.8}
\]

**Proof.**  On the set in (4.8), Lemma 4.1 gives

\[
 |\Xi(z)|\ge b_RL^{-m_R}.                            \tag{4.9}
\]

Equation (4.2a) makes `|A_(lambda,R)|>=1/2` eventually.  Also

\[
 C_Re^{-c_RL^2}=o(L^{-m_R}).                        \tag{4.10}
\]

If the left side of (4.8) vanished, equations (4.2) and (4.9) would give

\[
 |E_{\lambda,R}(z)|
 =|\Xi(z)A_{\lambda,R}(z)|
 \ge {b_R\over2}L^{-m_R},                            \tag{4.11}
\]

contradicting (4.2a) and (4.10).  \(\square\)

The theorem permits complex splitting of a verified multiple real zero,
but forces every such split below physical height `1/L` eventually.  It is
therefore stronger than fixed-`epsilon` compact convergence, while still
being only a fixed-horizontal-window statement.  Its starting point is
doubly non-effective: the prolate/Gevrey constants and threshold are
qualitative, and the positive factor `b_R` is not extracted from a replayed
zero computation.  The PT theorem and PDF bytes are pinned, but its
Arb/Turing computation remains unreplayed here.

## 5. Why this does not yield an asymptotic horizontal bound

The exact finite endpoint-jet estimate remains

\[
 |\Re z|\le {2\pi\over L}
 \left(M^2+{B_k\over|a_k|}\right)^{1/2},           \tag{5.1}
\]

where `a_k` is the first nonzero even endpoint jet.  Source norm bounds give
only the crude numerator estimate

\[
 B_k\le C\|f_\lambda\|_2 M^{2k+5/2}.               \tag{5.2}
\]

No admitted theorem gives a lower bound for `|a_k|`.  The pinned endpoint
work gives upper bounds, which cannot be inverted in (5.1).  Hence (5.1)
is explicit for a coefficient vector whose first jet has been certified,
but it supplies no actual-source asymptotic horizontal radius.

This distinction is essential.

- The splitting polynomial

  \[
   ((s-R)^2+\varepsilon^2)((s+R)^2+\varepsilon^2)
  \tag{5.3}
  \]

  differs from its double-real-zero limit by `O_R(epsilon^2)` on compacts.
  Multiple real zeros can therefore split below a shrinking collar without
  contradicting compact convergence.
- Normalizing the same family while sending `R` to infinity gives local
  convergence to a nonzero constant but retains zeros at
  `+/-R+/-i*epsilon`.
- The Gevrey escaping factor of the collar reduction inserts the same
  horizontal escape while preserving symmetry, imaginary-axis positivity,
  and `exp(-Theta(L^2))` compact agreement.

Theorem 4.2 defeats the first mechanism only in the fixed published
verified-height window: the algebraic lower bound (4.6) is available there.
The escaping examples move beyond every fixed window and remain compatible
with the theorem.

## 6. Exact remaining boundary

The following statements are now rigorously separated.

1. `epsilon_lambda->0` has no required rate for the global collar
   implication; a liminf-zero certified subsequence is enough.
2. A single cofinal family of finite rectangles is enough for the compact
   alternative.
3. Existing Gevrey estimates plus the pinned, unreplayed finite-height line
   verification prove the explicit partial collar (4.8).
4. Neither the pinned finite-height theorem nor the Gevrey remainder makes
   the horizontal radius tend to infinity.  A zero-density estimate cannot
   turn a possible quartet into a count smaller than four in the central
   strip, and the functional equation supplies the quartet symmetry rather
   than its exclusion.
5. The proposed optimization `J` of order `lambda/L^2` in the natural-cutoff
   Gevrey bound may improve the absolute remainder, but it has not been
   independently audited here and is not used in any theorem above.  Even
   such an absolute improvement would not determine the unknown Xi phase on
   a cofinal central rectangle.

Thus the partial theorem is real but bounded: it certifies a shrinking
collar through every fixed height below `H_PT`; it neither proves nor
assumes the missing global phase equality.
