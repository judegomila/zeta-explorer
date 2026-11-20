# Critical-ground negative-Sobolev no-escape barrier

## 0. Exact outcome and claim boundary

Assume RH only when the actual critical-zero Gram is discussed.  For a
normalized odd coefficient vector and a normalized positive-index even
coefficient vector, put

\[
 u=\sum_{n=1}^N d_ne_n^-,\qquad
 h=\sum_{n=1}^N h_ne_n^+,\qquad
 \sum|d_n|^2=\sum|h_n|^2=1,                       \tag{0.1}
\]

\[
 J_1(u)=2\left|\sum_{n=1}^N{d_n\over n}\right|^2
          +\sum_{n=1}^N{|d_n|^2\over n^2},        \tag{0.2}
\]

\[
 J_2(h)=2\left|\sum_{n=1}^N{h_n\over n^2}\right|^2
          +\sum_{n=1}^N{|h_n|^2\over n^4}.        \tag{0.3}
\]

If `gamma_1` is the least positive zeta-zero ordinate, then the support
bounds for the endpoint-zero primitive and the twice-clamped primitive give
the elementary sufficient conditions

\[
 \boxed{L^2J_1(u)>\left({2\pi\over\gamma_1}\right)^2}       \tag{0.4}
\]

for the strict odd-ground primitive comparison, and

\[
 \boxed{L^4J_2(h)\geq{1\over\tau}
             \left({2\pi\over\gamma_1}\right)^4}            \tag{0.5}
\]

for the true-even primitive statistic to obey `Theta_N<=tau`.
These are useful sufficient criteria.  They are not consequences of the
source-Cauchy displacement, positivity, a zero eigen-residual, nodal
structure, or the Riemann--von Mangoldt count.

Indeed, for every `N>=2` this note constructs an exact positive
inversion-symmetric source-Cauchy matrix

\[
 \boxed{Q_N=D_N-N^{-4}|\eta_N\rangle\langle\eta_N|}          \tag{0.6}
\]

whose odd ground is exactly the top mode and whose positive-index even
ground differs from the top mode by `O(N^(-4))` in each lower coordinate.
For these two normalized grounds,

\[
 \boxed{J_1={3\over N^2},\qquad
        J_2={3\over N^4}+O(N^{-6}).}                         \tag{0.7}
\]

The full matrix has a simple even global ground strictly below its simple
odd ground, and the even ground has nonzero source-boundary pairing.  Thus
the obstruction is not caused by an eigen-residual, a parity tie, or a
vanishing boundary coordinate.

Every positive semidefinite finite source-Cauchy matrix is a positive real
Fourier-evaluation Gram by the frozen moment-cone theorem.  Consequently
(0.6) has an exact finite paired real-evaluation representation.  Positive
rational approximation of its weights, followed by a common clearing of
denominators, gives nearby exact integer-multiplicity evaluation Grams
which retain the strict inequalities and the no-escape failure.  Their
nodes are unrestricted real evaluation nodes, not zeta ordinates.

There is a separate count-level obstruction.  The frozen HSW-compatible
carrier-lattice multiset has exact positive integer multiplicities and, on
an infinite sequence of lengths, has many identically zero columns.  An
arbitrarily high top-mode vector can therefore be chosen in its odd and
positive-even ground spaces and again has the values in (0.7).  That model
is singular and its ground is degenerate.  It is only a no-go for an
argument based on zero counting; it does not satisfy the finite strict
ground gates.

No matrix below is identified with the actual zeta Gram.  No actual-zeta
ground escapes, no finite gate fails, and no zero statement, determinant
limit, RH proof or converse, or de Bruijn--Newman bound follows.  The
formal state remains `P0_INVALIDATED`.  This is a narrow
post-checkpoint-1.54 barrier pair and changes none of the standard eight
files.

## 1. Exact frozen inputs

Exactly three frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/CRITICAL_SCALAR_FLOOR_TO_TRUE_GROUND_ROW_DELETION_BARRIER.md` | `3cf82e60d684f738e331ba5b4378ee7d0528bd47dd71c73bd551777750938ba4` |
| `tests/test_critical_scalar_floor_to_true_ground_row_deletion_barrier.py` | `0f4ca4642d750876a2216df0cec4f60704bc9cd977223d08b6796f89783437ba` |
| `notes/RH_EVEN_SPECTRAL_CLUSTER_GROUND_PRIMITIVE_EVALUATION_BARRIER.md` | `75e5b1b9b916f0ea1732c95bcd9940be4ff0308f561897e64cc0a7141a0c4c4a` |
| `tests/test_rh_even_spectral_cluster_ground_primitive_evaluation_barrier.py` | `fc9c3a13e1559393beabd46cb5a1e26c50c042c8e9865e28ec164d45a353a0af` |
| `notes/ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md` | `0a38c332345f3279061db48b29744bbfa5cf976c63a4d9f9c8fb12768e3ab6c3` |
| `tests/test_odd_zero_gram_lower_frame_audit.py` | `b755e1238a81627a38e9ebcc61357cc806ac7ee52cd9a18c0a0f5eae6c8d8467` |

The checkpoint-1.54 pair supplies the exact critical schedule, primitive
statistics, row-deletion targets, and strict claim boundary.  The second
pair supplies the finite positive source-Cauchy moment-cone theorem and its
paired evaluation representation.  The third supplies the exact
HSW-compatible carrier-lattice multiset.  No zero table, numerical zeta
ordinate, external source, or new source lock is imported.

## 2. Why the two negative-Sobolev inequalities suffice

Use the centered interval of length `L` and frequencies

\[
 a_n={2\pi n\over L}.                              \tag{2.1}
\]

For the endpoint-zero primitive `P` and the twice-clamped primitive
`mathcal R`, the frozen coefficient identities are

\[
 \|Pu\|_2^2=\left({L\over2\pi}\right)^2J_1(u),
 \qquad
 \|\mathcal Rh\|_2^2=
       \left({L\over2\pi}\right)^4J_2(h).         \tag{2.2}
\]

Let `nu_-` and `nu_alpha` be the sampling-energy probability measures of
the actual odd and positive-even grounds.  Support above `gamma_1` gives

\[
 \int\gamma^{-2}\,d\nu_-(\gamma)\leq\gamma_1^{-2},
 \qquad
 \int\gamma^{-4}\,d\nu_\alpha(\gamma)\leq\gamma_1^{-4}.
                                                               \tag{2.3}
\]

The exact primitive comparison is strict if

\[
 \int\gamma^{-2}\,d\nu_-(\gamma)<\|Pu\|_2^2.     \tag{2.4}
\]

Equations (2.2)--(2.4) prove (0.4).  Likewise,

\[
 \Theta_N={\displaystyle\int\gamma^{-4}
                         d\nu_\alpha(\gamma)
             \over\|\mathcal Rh\|_2^2}
 \leq{(2\pi/\gamma_1)^4\over L^4J_2(h)},         \tag{2.5}
\]

which proves (0.5).  The inequalities use only support.  Their missing
content is a lower bound for a negative-Sobolev norm of the unknown actual
ground.

## 3. Exact positive source-Cauchy family

Let the raw orthonormal modes be `V_n`, `-N<=n<=N`, and put

\[
 \eta_N=\sum_{n=-N}^NV_n,
 \qquad c_N=N^{-4},                                \tag{3.1}
\]

\[
 D_NV_n=\begin{cases}
 V_n,&|n|=N,\\
 2V_n,&|n|<N.
 \end{cases}                                      \tag{3.2}
\]

Define `Q_N` by (0.6).  Since

\[
 \langle\eta_N,D_N^{-1}\eta_N\rangle
 =2+{2N-1\over2}=N+{3\over2},                    \tag{3.3}
\]

and

\[
 c_N\left(N+{3\over2}\right)<1\qquad(N\geq2),  \tag{3.4}
\]

the rank-one positivity criterion gives

\[
 \boxed{Q_N\succ0.}                               \tag{3.5}
\]

The entries have the exact source form

\[
 (Q_N)_{nn}=a_n=d_n-c_N,\qquad
 (Q_N)_{nm}=-c_N={b_n-b_m\over n-m}\quad(n\ne m), \tag{3.6}
\]

with

\[
 b_n=-c_Nn,\qquad b_{-n}=-b_n.                   \tag{3.7}
\]

If `M V_n=nV_n` and `beta_N=-c_NM eta_N`, then direct multiplication gives

\[
 \boxed{
 [M,Q_N]=|\beta_N\rangle\langle\eta_N|
          -|\eta_N\rangle\langle\beta_N|.}       \tag{3.8}
\]

Thus the family has the exact source displacement and not merely a small
commutator defect.

## 4. Exact parity grounds and high-mode escape

Use the normalized parity vectors

\[
 e_n^\pm={V_n\mathbin\pm V_{-n}\over\sqrt2},
 \qquad1\leq n\leq N.                             \tag{4.1}
\]

The boundary vector `eta_N` is even, so its rank-one form vanishes on the
odd sector.  Hence

\[
 \boxed{(Q_N)_-=\operatorname {diag}(2,\ldots,2,1).} \tag{4.2}
\]

Its ground is simple and equals

\[
 u_N=e_N^-,\qquad\lambda_-=1.                     \tag{4.3}
\]

In the full even sector, the coordinate vector of `eta_N` is

\[
 v=(1,\sqrt2,\ldots,\sqrt2).                      \tag{4.4}
\]

The trial `e_N^+` has Rayleigh value `1-2c_N`.  Therefore

\[
 \lambda_+\leq1-2c_N<1=\lambda_-.                \tag{4.5}
\]

The unperturbed even diagonal has a unique coordinate at value one, and a
rank-one secular equation has exactly one root below one.  The full global
ground is consequently simple and even.  Its eigen-equation below the
diagonal edge makes all its coordinates proportional to
`v_n/(d_n-lambda_+)`; in particular,

\[
 \langle\eta_N,g_+\rangle\ne0.                   \tag{4.6}
\]

Now delete the central even coordinate.  The positive-index even block is

\[
 A_N^\circ=\operatorname {diag}(2,\ldots,2,1)
                   -2c_N{\bf1}{\bf1}^{T}.         \tag{4.7}
\]

Its simple ground has eigenvalue `alpha_N=1-delta_N`, where

\[
 1=2c_N\left\{{1\over\delta_N}
             +{N-1\over1+\delta_N}\right\},      \tag{4.8}
\]

or equivalently

\[
 \delta_N^2+(1-2c_NN)\delta_N-2c_N=0.            \tag{4.9}
\]

Since `2c_N(N-1)<=1/8`, (4.8) gives

\[
 2c_N<\delta_N\leq{16\over7}c_N.                 \tag{4.10}
\]

After choosing the positive phase, its coefficients obey

\[
 {h_n\over h_N}=r_N:={\delta_N\over1+\delta_N}
 \quad(1\leq n<N),
 \qquad
 h_N={1\over\sqrt{1+(N-1)r_N^2}}.                \tag{4.11}
\]

For the odd ground, (0.2) immediately gives

\[
 \boxed{J_1(u_N)={3\over N^2}.}                  \tag{4.12}
\]

Writing `H_m^(s)=sum_(n=1)^m n^(-s)`, equations (0.3) and (4.11) give the
exact expression

\[
 J_2(h_N)=h_N^2\left[
 2\left\{{1\over N^2}+r_NH_{N-1}^{(2)}\right\}^2
 +{1\over N^4}+r_N^2H_{N-1}^{(4)}\right].        \tag{4.13}
\]

Because `r_N=O(N^(-4))`, this proves

\[
 \boxed{J_2(h_N)={3\over N^4}+O(N^{-6}).}        \tag{4.14}
\]

The odd numerator polynomial is, up to a nonzero scalar,

\[
 p_N(y)=\prod_{j=1}^{N-1}(y-a_j^2).               \tag{4.15}
\]

Thus it already has the maximal `N-1` simple positive carrier roots.
Ground positivity or nodal regularity in this transformed basis cannot by
itself improve (4.12).

On the critical schedule

\[
 N=D e^L L+O_D(L),\qquad
 {1\over2\pi}<D<{1\over2},                       \tag{4.16}
\]

the two structural grounds satisfy

\[
 L^2J_1(u_N)\longrightarrow0,\qquad
 L^4J_2(h_N)\longrightarrow0.                    \tag{4.17}
\]

They therefore violate both sufficient no-escape inequalities for every
fixed positive `gamma_1` and `tau` once `L` is large.  This is a statement
about the structural family (0.6), not the actual critical ground.

## 5. Paired evaluation and integer-multiplicity scope

The frozen moment-cone theorem states that every positive semidefinite real
source-Cauchy matrix is a finite positive real Fourier-evaluation Gram.
Since (3.5) is positive definite and inversion symmetric, its
representation may be chosen with paired nodes and may avoid any prescribed
finite set of nodes, including zero, the carrier nodes, and projective
infinity.  Thus

\[
 Q_N=\sum_{j=1}^{J_N}\theta_j
 \{|v_N(r_j)\rangle\langle v_N(r_j)|
   +|v_N(-r_j)\rangle\langle v_N(-r_j)|\},
 \qquad\theta_j>0.                                \tag{5.1}
\]

This is an exact representation, but its weights need not be rational.
For any `zeta_N>0`, approximate the finitely many positive `theta_j` by
positive rationals, keeping the paired weights equal, so that the normalized
Gram `widetilde Q_N` satisfies

\[
 \|\widetilde Q_N-Q_N\|_{\rm op}<\zeta_N.         \tag{5.2}
\]

Choose `zeta_N=o(N^(-8))`.  The odd spectral gap is one; the full parity
gap is at least `2c_N`; and the positive-index even ground gap is greater
than `delta_N>2c_N`.  Standard finite-dimensional spectral perturbation
therefore preserves positivity, simple grounds, strict even-below-odd
parity, and coefficient angles small enough to retain

\[
 J_1=O(N^{-2}),\qquad J_2=O(N^{-4}).              \tag{5.3}
\]

Clearing one common denominator makes every paired weight a positive
integer.  The common scalar changes eigenvalues but not ground vectors,
parity, or (5.3).  This gives exact integer-multiplicity real-evaluation
Grams arbitrarily close to (0.6) after scalar normalization.

The evaluation nodes in (5.1) are free moment-cone nodes.  Rationalizing
weights does not turn them into zeta ordinates, enforce an HSW prefix, or
reconstruct the pole--archimedean--minus-prime source.  The conclusion is
only that positive evaluation structure and integer multiplicity do not
force (0.4)--(0.5).

## 6. HSW-compatible carrier obstruction and its exact limitation

The frozen count audit fixes `L_0>1/0.103787`, puts `h_0=2*pi/L_0`, and
constructs an all-critical symmetric multiset supported at

\[
 \gamma_m=mh_0                                    \tag{6.1}
\]

with positive integer multiplicities and the locked HSW
`T log T+O(log T)` counting bound.  At each length

\[
 L=kL_0,\qquad k\geq2,                            \tag{6.2}
\]

every model ordinate is a carrier of index `km`.  The exact odd and even
transform formulas then give

\[
 \widehat e_n^\pm(\gamma_m)=0
 \qquad\hbox{whenever }n\ne km.                  \tag{6.3}
\]

Consequently every column with `k` not dividing `n` is identically zero.
Choose arbitrarily large `N` with `k` not dividing `N`.  Then `e_N^-` and
the positive-even vector `e_N^+` belong to the corresponding zero ground
spaces and have exactly

\[
 J_1(e_N^-)={3\over N^2},\qquad
 J_2(e_N^+)={3\over N^4}.                         \tag{6.4}
\]

This multiset has the critical-line symmetry, integer multiplicity, and
the locked count, but its value Gram is singular and its ground space is
large.  It does not contradict a theorem which assumes a positive simple
actual ground.  Instead, it proves that HSW counting cannot supply the
missing simplicity, phase conditioning, or negative-Sobolev mass.

The critical Riemann--von Mangoldt calculation in the checkpoint-1.54 pair
explains the same limitation for the actual low rows: at the carrier edge
their evaluation map has nullity `Theta_D(N/L)`.  Selecting a favorable
vector in that nullspace does not identify the unconstrained true ground.

## 7. Minimal surviving input and fail-closed stopping line

For odd parity, it is sufficient to prove (0.4) for the actual true odd
ground, or to prove the sharper primitive determinant `Delta_N>0` or its
relative row-deletion criterion from checkpoint 1.54.  For the true-even
reserve, it is sufficient to prove (0.5), `Theta_N<=tau`, or the direct
ratio `mu_N/alpha_N<=tau`.

Any such theorem must use information which is absent from the structural
and count models.  A minimal useful input is a phase-sensitive relative
estimate coupling the unknown true ground to the actual zero rows, for
example a ground-weighted low-zero mass bound or a lower bound for the
floor after low-row deletion relative to the undeleted floor.  An absolute
source residual, a discrete Hardy inequality, transformed-basis nodal
positivity, or unweighted zero counting cannot distinguish the examples
above.

Any downstream use must reject an argument which

1. identifies `Q_N` or its evaluation representation with the actual zeta
   Gram;
2. treats rational weight approximation as an approximation of zeta
   ordinates or of the pinned arithmetic source;
3. promotes the singular carrier-lattice ground to a positive simple
   ground;
4. infers a true-ground coefficient bound from the critical low-row
   nullity;
5. transfers the projected-prolate scalar vector to an actual sector
   ground;
6. drops the denominator in `Theta_N` or reverses a row-deletion minimax
   inequality; or
7. claims an actual gate failure, determinant convergence, RH, a converse
   from RH, or a de Bruijn--Newman bound.

The terminal result is a sharp structural and count-level no-go.  The
actual critical problem remains the phase-sensitive relative ground
statistic.  The formal state remains `P0_INVALIDATED`.
