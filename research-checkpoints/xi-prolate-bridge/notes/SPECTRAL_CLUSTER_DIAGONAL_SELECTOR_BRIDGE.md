# Spectral-cluster diagonal-selector bridge

## 0. Claim boundary

This note proves a finite conditional bridge.  A sufficiently narrow bottom
cluster can be split by an inversion-even diagonal perturbation so that its
simple lowest even vector approaches the projected prolate anchor.  The
perturbed matrix remains in the finite source-Cauchy class, so the existing
even-sector theorem makes that vector cross-rooted.

The sharp norm-only scale is

\[
        {w\chi^2\over G}\longrightarrow0,                 \tag{0.1}
\]

not `w*chi/G`.  Here `w` is the cluster width, `G` the exterior spectral
floor after shifting the cluster bottom to zero (so the literal separation
is `G-w`), and `chi` a block-aware selector cost.  No admitted theorem
proves (0.1), exact selector realization, or spectral capture for the pinned
arithmetic matrices on an unbounded schedule.  Nothing below is an RH proof,
an equation-(5.2) estimate, or a locally uniform ground-transform theorem.

## 1. Finite cluster and selector

Let `A=A*` act on a real even space and let `P` be a spectral projector of
`A`; put `R=I-P`.  For the source application, additionally assume that `A`
is the even block of a real inversion-symmetric finite source-Cauchy matrix.
After a scalar shift assume

\[
 0\le PAP\le wP,\qquad RAR\ge GR,\qquad G>w\ge0.          \tag{1.1}
\]

Let `v in Ran(P)` be unit.  Suppose a real inversion-even diagonal matrix
`H` satisfies

\[
 PHP=|v\rangle\langle v|,\qquad
 \|H\|\le\chi,\qquad c=\|RHP\|.                          \tag{1.2}
\]

For `epsilon>w` set

\[
 B=A-\epsilon H,\qquad
 \Delta=G-w-\epsilon(\chi-1).                             \tag{1.3}
\]

When the source hypothesis on `A` holds, the diagonal perturbation is a
finite source-Cauchy perturbation: in raw modes its parameters are
`b_n^H=0` and `a_{-n}^H=a_n^H`.  Thus `B` preserves inversion and the
rank-two source displacement.  Compression in (1.2)
forces `chi>=1`; hence (0.1) also forces `w/G->0`, so `G-w` and `G` are
asymptotically equivalent in the scale statement.

### Theorem 1.1 (direct block bound)

Assume `Delta>0`.  Let `x=y+z`, `y=Px`, `z=Rx`, be a unit lowest vector of
`B`.  Define

\[
 \rho={\epsilon c\over\Delta},\qquad
 q={w+\epsilon^2c^2/\Delta\over\epsilon-w}.               \tag{1.4}
\]

Then

\[
 {\|z\|\over\|y\|}\le\rho,\qquad
 {\|(P-|v\rangle\langle v|)y\|\over\|y\|}\le q,          \tag{1.5}
\]

and consequently

\[
 \sin\angle(x,v)\le(\rho^2+q^2)^{1/2}.                   \tag{1.6}
\]

If `rho^2+q^2<1/2`, the lowest eigenvalue of `B` is simple.

**Proof.**  The trial vector `v` gives
`lambda_min(B)<=w-epsilon`.  On `Ran(R)`,

\[
 RBR-\lambda_{\min}(B)R
 \ge [G-\epsilon\chi-(w-\epsilon)]R=\Delta R.
\]

The `R` block of the eigen-equation gives the first bound in (1.5).
Write `y=a v+r` with `r perpendicular v`.  Project the `P` equation onto
`v^perp`.  Since `PHP=vv*`, the selector has no compressed term in that
equation.  The inverse there is bounded by `(epsilon-w)^(-1)`, the cluster
term by `w`, and the exterior feedback by `epsilon*c*||z||`.  This gives the
second bound.  Equation (1.6) follows by orthogonality.  If the bottom space
had two orthogonal unit vectors, each would have squared overlap with `v`
strictly greater than `1/2`, impossible by Bessel's inequality.  \(\square\)

The three unavoidable error scales in (1.4) are

\[
 {w\over\epsilon},\qquad {\epsilon c^2\over G},
 \qquad {\epsilon c\over G}.                              \tag{1.7}
\]

With only `c<=chi`, the balance

\[
 \epsilon_*={\sqrt{wG}\over\chi}                         \tag{1.8}
\]

gives

\[
 \angle(x,v)=O\!\left(\sqrt{{w\chi^2\over G}}\right).   \tag{1.9}
\]

Thus (0.1) is the correct norm-only window.  Replacing it by `w*chi/G`
requires extra structure such as `c^2=O(chi)`.

### 1.2 Feshbach variant

Writing `f=lambda_max(RHR)`, one may retain the sharper denominator

\[
 d_F=(G-w)+\epsilon(1-f),\qquad
 \rho_F={\epsilon^2c^2\over d_F}.                         \tag{1.10}
\]

If `d_F>0` and `rho_F<epsilon-w`, the unique lowest branch lies within
`rho_F` of the compressed lowest eigenvalue, and its compressed angle error
is bounded by `rho_F/(epsilon-w-rho_F)`.  This does **not** count every
negative eigenvalue of `B`; exterior coupling can create an additional
negative level above the unique bottom.  Equation (1.4) is the safer
norm-only statement.

## 2. Exact diagonal realization and its cost

Choose an isometry `U:R^m -> Ran(P)`.  Let `svec` be the
Frobenius-isometric vectorization of a real symmetric matrix (off-diagonal
entries carry the factor `sqrt(2)`) and put

\[
 u_j=U^*e_j,\qquad
 {\cal L}_D h=\sum_j h_j u_ju_j^*.                        \tag{2.1}
\]

Then a diagonal selector with `PHP=vv*` exists exactly when

\[
 \operatorname{svec}(vv^*)\in
 \operatorname{Ran}[\operatorname{svec}(u_ju_j^*)]_j.     \tag{2.2}
\]

It is onto all of `Sym(R^m)` exactly when

\[
 \operatorname{rank}(P\circ P)={m(m+1)\over2},            \tag{2.3}
\]

so necessarily `m(m+1)/2<=N+1`.  With Euclidean norm on the diagonal
coefficients and Frobenius norm on symmetric matrices,

\[
 \|{\cal L}_D^\dagger\|=
 {1\over\sqrt{\lambda_{\min}^+(P\circ P)}}.               \tag{2.4}
\]

Conditional on exact feasibility of the target `vv*`, the Moore--Penrose
solution obeys (2.4).  Because `||diag(h)||_op<=||h||_2`, it gives a safe
upper bound for `chi`.
The intrinsic cost for a particular `v` is the linear-program value

\[
 \chi_v=\inf\{\|h\|_\infty:{\cal L}_Dh=vv^*\}.            \tag{2.5}
\]

For the full `2(N+1)-1` dimensional even source-Cauchy selector space, use
a Frobenius-orthonormal basis `S_l` and replace (2.1) by
`H -> U^*HU`.  Exact feasibility is the corresponding range test.  A raw
`(a_n,b_n)` pseudoinverse is not itself an operator-norm certificate; the
basis-synthesis norm must be retained.  This larger linear system may reduce
cost, but no surjectivity or condition bound is automatic.

## 3. Conditional locally uniform bridge

Let `k_lambda^+` be the locked source-normalized prolate state, let `P_N` be
the ambient Fourier projection, and put

\[
 a_\lambda=\|P_Nk_\lambda^+\|,\qquad
 \kappa={P_Nk_\lambda^+\over a_\lambda}.                 \tag{3.1}
\]

Suppose `P kappa` is nonzero.  Set

\[
 Y=\|P\kappa\|,\qquad v={P\kappa\over Y},\qquad
r=R\kappa.                                                \tag{3.2}
\]

The admitted projected-state normalization keeps `a_lambda` bounded above
and below on the schedules to which this bridge is applied.

Choose the phase of the selected unit ground so that `<x,v>` is real and
positive.
Scale it by `s=Y`.  Exactly,

\[
 sx-\kappa=Y(x-v)-r.                                      \tag{3.3}
\]

At the natural Fourier cutoff `M=ceil(lambda)`, the high-mode term in the
existing projective bridge is harmless for a bounded correction.  The
remaining sufficient low-mode condition is

\[
 a_\lambda\sqrt L\,\lambda^\eta
 \{Y\|P_M(x-v)\|+\|P_Mr\|\}\longrightarrow0              \tag{3.4}
\]

for every `eta<1/2`, together with the admitted outer prolate projection
rate.  A convenient stronger hypothesis is

\[
 \sqrt{{w\chi^2\over G}}+
 \|P_M(I-P)\kappa\|=O(\lambda^{-1/2}).                    \tag{3.5}
\]

For `w>0`, the choice `epsilon=sqrt(wG)/chi` is the balanced one once the
ratios are small enough to meet the finite gates.  For `w=0`, choose a
positive `epsilon` with `epsilon*chi^2/G=O(lambda^(-1/2))` and
`epsilon*chi/G=o(1)`.  Under (3.5), Theorem 1.1 gives simple even
source-Cauchy grounds whose correctly normalized transforms

\[
             F_\lambda(z)=4a_\lambda Y\,\widehat x(z)     \tag{3.6}
\]

converge locally uniformly to `Xi`.  The existing cross-Hurwitz theorem
would then imply RH.  Equation (3.5) is unproved; this is a conditional reduction only.

## 4. Residual shells do not supply the selector theorem

Let `D=dim(A)`, `q=<kappa,A kappa>`, and
`r_0=||(A-q)kappa||`.  For `eta in (0,1)` and `rho>1`, put
`a_0=r_0/(eta*rho)`.  Among the `D+1` annuli, indexed by
`j in {0,...,D}`,

\[
 a_0\rho^j<|\lambda-q|<a_0\rho^{j+1}                     \tag{4.1}
\]

one is empty.  For such a `j`, put `a=a_0*rho^j` and

\[
             P=1_{\{|A-q|\le a\}}.                       \tag{4.2}
\]

The empty open annulus implies that every spectral vector outside `P` has
distance at least `rho*a` from `q` (an eigenvalue at the outer endpoint
remains outside).  Chebyshev therefore gives

\[
             \|(I-P)\kappa\|\le\eta.                     \tag{4.3}
\]

But the selected radius can be `r_0*rho^(D-1)/eta`, and the guaranteed
empty annulus may lie beyond the whole spectrum, giving `P=I`.  Residual
shells also need not produce a bottom cluster, so (4.3) alone does not meet
(1.1).  Only if `P` is nonempty, proper, and bottom-ordered may one shift
its minimum to zero and infer

\[
 w\le2a,\qquad G-w\ge(\rho-1)a,\qquad
 {w\over G-w}\le{2\over\rho-1}.                          \tag{4.4}
\]

Exact two-vector Ritz data do not fix this: `q,r_0,u` see only the compression to
`span{kappa,(A-q)kappa}`, so an arbitrary lower orthogonal block can be
adjoined without changing them.

## 5. Exact no-go families

### 5.1 Realization can fail

The logarithmically coercive diagonal source-Cauchy family in
`FIXED_LAMBDA_GALERKIN_ALIGNMENT_NO_GO.md`, Section 5, has a two-dimensional
bottom cluster that captures

\[
 \kappa={3\over5}e_0+{4\over5}e_1                         \tag{5.1}
\]

exactly, with width `epsilon`, fixed exterior gap, zero Fourier tail, and
`(q-u)/r_0=4/3`.  Every diagonal selector compresses diagonally on that
coordinate cluster, so it cannot realize `kappa*kappa*`.  Here `chi` is
infinite despite inversion, source-Cauchy structure, compact resolvent, and
logarithmic coercivity.

### 5.2 Realization can be arbitrarily ill-conditioned

For `0<t<=1/2`, let an isometry `U_t:R^2->R^4` have row frame

\[
 (a,0),(0,a),(t,t),(t,-t),\qquad a=\sqrt{1-2t^2}.          \tag{5.2}
\]

Let `E=Ran(U_t)`, let `f_2=U_te_2`, and put

\[
 A_t=t^2|f_2\rangle\langle f_2|+(I-P_E),\qquad
 \kappa=U_t(1,1)/\sqrt2.                                  \tag{5.3}
\]

Then `w=t^2`, `G=1`, the leakage is zero, and

\[
 q=r_0={t^2\over2},\qquad u=0.                            \tag{5.4}
\]

Exact diagonal realization forces

\[
 t^2(h_3-h_4)=1/2,\qquad \chi={1\over4t^2},              \tag{5.5}
\]

with equality attained by the explicit symmetric choice.  Hence

\[
 {w\chi^2\over G}={1\over16t^2}\longrightarrow\infty.   \tag{5.6}
\]

This abstract Hermitian family shows that fixed dimension, bounded spectral
diameter, vanishing residual, bounded Ritz ratio, exact capture, and exact
realization still do not control the selector window.

### 5.3 Diagonal source-Cauchy selector cost can diverge

For `N=2`, take the normalized even Cauchy-kernel direction

\[
 w_\tau=\left(1,{\sqrt2\tau\over\tau+1},
                  {\sqrt2\tau\over\tau+4}\right),\qquad
 n_\tau={w_\tau\over\|w_\tau\|},                         \tag{5.7}
\]

and let `A_tau=G|n_tau><n_tau|`, the even block of the corresponding
regular rank-one source-Cauchy atom.  Its exact bottom cluster is
`E_tau=n_tau^perp`, with zero width and exterior floor `G`.  Put

\[
 v_\tau={P_{E_\tau}e_0\over\|P_{E_\tau}e_0\|},\qquad
 H_\tau={|e_0\rangle\langle e_0|\over
                 \|P_{E_\tau}e_0\|^2}.                  \tag{5.8}
\]

For regular nonzero `tau`, every coordinate of `n_tau` is nonzero and

\[
 \det(P_{E_\tau}\circ P_{E_\tau})
 =2n_{\tau,0}^2n_{\tau,1}^2n_{\tau,2}^2>0.              \tag{5.9}
\]

Thus the diagonal realization is unique.  It satisfies
`P_E H_tau P_E=|v_tau><v_tau|` exactly, but

\[
 \|P_{E_\tau}e_0\|^2\sim {17\over8}\tau^2,
 \qquad \|H_\tau\|\sim {8\over17\tau^2}.               \tag{5.10}
\]

Thus even exact **diagonal** source-Cauchy realization can be arbitrarily
ill-conditioned.  This does not assert divergence for the larger full
source-Cauchy selector space; that optional optimization can have a bounded
right inverse here.  The theorem remains consistent: when `w=0` one may
take `epsilon` smaller than `G/chi^2`; a fixed perturbation size is not
uniform in this family.

### 5.4 Exact high multiplicity obstructs surjectivity

If an exact source-Cauchy bottom eigenspace `E` has dimension at least three
and the selector compression is onto `Sym(E)`, arbitrarily small selectors
would make simple cross-root grounds converge to every line in `E`.  The
associated real polynomial space would then consist entirely of real-rooted
polynomials.  Evaluation at a fixed nonreal point is a real-linear map into
`C`; in dimension at least three it has a nonzero kernel, producing a
polynomial with a nonreal root.  Contradiction.  Thus exact multiplicity
at least three forbids this surjectivity.

## 6. Surviving actual-source obligations

The repository currently proves none of the following on one unbounded,
projection-convergent schedule:

1. a bottom-cluster width `w` and exterior separation `G`;
2. exact diagonal or full source-Cauchy realization of `vv*`;
3. a block-aware selector cost `chi` with `w*chi^2/G=O(1/lambda)`;
4. low Fourier spectral leakage
   `||P_M(I-P)kappa||=O(lambda^(-1/2))`.

Ordinary coframes do not imply the symmetric-square range condition: the
vectors `Pe_j` are always Parseval, while their squares may fail to span.
The admitted prolate estimate is a Fourier tail, not a spectral-cluster
tail.  Fixed-lambda Galerkin convergence is qualitative and assumes an
already isolated infinite cluster.  Therefore this note supplies a sharp
finite theorem and diagnostic target, but no new actual-source asymptotic
estimate and no RH conclusion.
