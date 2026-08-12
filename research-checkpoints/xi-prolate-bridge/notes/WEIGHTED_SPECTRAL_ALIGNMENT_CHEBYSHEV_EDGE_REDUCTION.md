# Weighted spectral alignment and Chebyshev-edge reduction

## 0. Status and claim boundary

Claim class: `WEIGHTED_SPECTRAL_ALIGNMENT_CHEBYSHEV_EDGE_REDUCTION`.

This note records four exact reductions for the direct
Xi--prolate--Weil bridge.

1. The central-band loss is written as an exact covariance-weighted
   principal-angle trace, reconstructed from physical Gram and cross-Gram
   matrices.  Its canonical spectral form shows which central directions
   actually require capture.
2. A much smaller polynomial order

   \[
     r=\left\lceil {cL\over\log L}\right\rceil,
     \qquad c>{1\over4},
   \]

   makes the central spectral tail `o(lambda^(-1))`.  Exact
   Legendre--Fourier coefficients show that these polynomial coordinates are
   well conditioned in the matched centered-Fourier target space.
3. For an exterior level set that is a finite union of intervals, an explicit
   time--frequency leakage estimate gives a positive-threshold effective-rank
   and spectral-tail theorem.  Exact trace and operator `k`-width formulas
   separate that tail from the remaining physical principal angles.
4. The odd pole is kept as a separate exact cross-Gram quantity.  Its shifted
   load has an exact edge-deficit identity, a sharp first-moment certificate,
   and a cancellation-preserving Chebyshev expansion whose remainder is
   strictly sharper than the geometric Neumann remainder.

These statements do **not** prove the required physical alignments for the
prescribed prolate source range.  They do not give a useful uniform bound on
the number of connected components of the actual exterior level sets, an
actual odd directional reserve, either signed sector floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, or the
Riemann hypothesis.  No numerical agreement is promoted to a theorem.  The
repository state remains `P0_INVALIDATED`.

No external theorem is newly imported here.  Every estimate below is derived
from finite-dimensional spectral calculus, Plancherel, the elementary
Legendre Fourier integral, or direct one-variable inequalities.

## 1. Locked conventions

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I_\lambda=[-L/2,L/2].                                  \tag{1.1}
\]

The physical interval carries Lebesgue measure in logarithmic coordinates.
All physical functions are extended by zero.  The Fourier convention and
Plancherel measure are

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi},
 \qquad e_t(x)=e^{itx}.                                  \tag{1.2}
\]

Inversion is reflection, `Jf(x)=f(-x)`.  The complete multiplier is

\[
 \boxed{
 m_\lambda(t)=2\theta'(t)-2
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).}                 \tag{1.3}
\]

The minus sign on the prime block is the sign in source equation (3.19), and
the endpoint `n<=lambda^2` is inclusive.  Every prime power at that endpoint
is retained.  No list of real zeta zeros and no assumption of global Weil
positivity is used.

On inversion parity `epsilon=+1,-1`, the pole term is

\[
 2\epsilon|p_\epsilon\rangle\langle p_\epsilon|,
 \qquad p_+(x)=\cosh(x/2),\qquad p_-(x)=\sinh(x/2).       \tag{1.4}
\]

Thus the odd pole is negative.  It may not be discarded or replaced by a
Fourier residue class.

The source interval is the distinct Lebesgue interval
`[-lambda,lambda]`, with zero extension.  The source-normalized, zero-integral
prolate columns and their actual Gram are retained.  If `C_F` synthesizes
those columns, then

\[
 P_F=C_F(C_F^*C_F)^\dagger C_F^*.                        \tag{1.5}
\]

Replacing `C_F^*C_F` by the identity without a proof, or unit-normalizing the
distinguished combined source, is rejected.

Let `X` be a declared finite physical parity space.  Write

\[
 K=\operatorname {ran}W,\qquad
 P_K=W(W^*W)^\dagger W^*,\qquad
 H=K^\perp,\qquad P_H=I-P_K,                            \tag{1.6}
\]

where `W` is any physical synthesis of the captured range.  Redundant
columns are allowed.  Formula (1.6), rather than producer booleans or cached
eigenvectors, defines the captured projection.

## 2. Exact covariance-weighted central capture

Fix `0<delta<pi/2`, put

\[
 B_\delta=[-\delta/L,\delta/L],\qquad
 T_B=\int_{B_\delta}|P_Xe_t\rangle\langle P_Xe_t|
                         {dt\over2\pi}.                 \tag{2.1}
\]

Then `T_B` is the compression to `X` of multiplication by
`1_(B_delta)` in Fourier space and

\[
 0\preceq T_B\preceq I_X,\qquad
 \operatorname {tr}T_B\leq{\delta\over\pi}.            \tag{2.2}
\]

Let `U:C^r->X` synthesize a declared central feature space
`V=ran(U)`.  It too may have redundant columns.  Define

\[
 G=U^*U,\qquad C=U^*T_BU,\qquad A=W^*W,                 \tag{2.3}
\]

\[
 S=G-U^*WA^\dagger W^*U=U^*P_HU.                       \tag{2.4}
\]

### Theorem 2.1 (exact covariance-weighted cross-Gram)

With `P_V=UG^\dagger U^*`, put

\[
 \rho_B=\operatorname {tr}(G^\dagger C G^\dagger S).
                                                                  \tag{2.5}
\]

Then

\[
 \boxed{
 \rho_B=\|P_HP_VT_B^{1/2}\|_{\rm HS}^2.}              \tag{2.6}
\]

If

\[
 \tau_V=\|(I-P_V)T_B^{1/2}\|_{\rm HS}^2,              \tag{2.7}
\]

then

\[
 \boxed{
 \sqrt{\operatorname {tr}(P_HT_BP_H)}
 \leq\sqrt{\rho_B}+\sqrt{\tau_V}.}                    \tag{2.8}
\]

**Proof.**  Since `P_V=UG^\dagger U^*` and (2.4) holds,

\[
 \begin{aligned}
 \|P_HP_VT_B^{1/2}\|_{\rm HS}^2
 &=\operatorname {tr}(T_B^{1/2}P_VP_HP_VT_B^{1/2})\\
 &=\operatorname {tr}(G^\dagger C G^\dagger S),
 \end{aligned}
\]

which proves (2.6).  Insert `P_V+(I-P_V)` between `P_H` and
`T_B^(1/2)`, apply the Hilbert--Schmidt triangle inequality, and drop the
contraction `P_H` from the second term.  This gives (2.8).  `square`

The scalar feature angle `alpha_V=||P_HP_V||` gives only the coarser bound

\[
 \rho_B\leq\alpha_V^2\operatorname {tr}(P_VT_BP_V)
 \leq{\delta\over\pi}\alpha_V^2.                       \tag{2.9}
\]

Equation (2.5) keeps the covariance: a poorly captured feature direction is
charged only in proportion to its actual central-band eigenweight.

### 2.1 Canonical spectral decomposition

Let

\[
 T_B=\sum_{j=1}^{d}\vartheta_j
                 |u_j\rangle\langle u_j|,
 \qquad
 1\geq\vartheta_1\geq\cdots\geq\vartheta_d\geq0,       \tag{2.10}
\]

be the canonical eigendecomposition on `X`.  Then the central high trace is
exactly

\[
 \boxed{
 \operatorname {tr}(P_HT_BP_H)
 =\sum_{j=1}^{d}\vartheta_j\|P_Hu_j\|^2.}              \tag{2.11}
\]

Equivalently, if `U` is any full-rank synthesis of `V`, the eigenpairs of

\[
 G^{-1/2}CG^{-1/2}                                      \tag{2.12}
\]

give an orthonormal physical eigenbasis of `P_VT_BP_V`, and (2.6) is

\[
 \rho_B=\sum_j\vartheta_j^{(V)}\|P_Hu_j^{(V)}\|^2.     \tag{2.13}
\]

For redundant `U`, (2.12) is read on `ran(G)` with Moore--Penrose square
roots.  No coordinate condition number is hidden in (2.13).

## 3. A logarithmic-over-logarithmic central feature order

Let `Pi_(r-1)` be the polynomials of degree less than `r` on `I_lambda`,
and put

\[
 V_r=\operatorname {ran}(P_X|_{\Pi_{r-1}}).             \tag{3.1}
\]

The locked Taylor estimate is

\[
 \tau_r:=\|(I-P_{V_r})T_B^{1/2}\|_{\rm HS}^2
 \leq {\delta\over\pi}
 { (\delta/2)^{2r}\over(2r+1)^2(r!)^2}.                \tag{3.2}
\]

Let `E_r` be a top-`r` spectral projector of `T_B`, extending by zero if
`r>=d`, and let

\[
 \operatorname {Tail}_r(T_B)=\sum_{j>r}\vartheta_j.     \tag{3.3}
\]

### Theorem 3.1 (canonical central tail)

For every integer `r>=1`,

\[
 \boxed{
 \operatorname {Tail}_r(T_B)\leq\tau_r.}               \tag{3.4}
\]

Consequently,

\[
 \boxed{
 \operatorname {tr}(P_HT_BP_H)
 \leq\sum_{j\leq r}\vartheta_j\|P_Hu_j\|^2+\tau_r.}  \tag{3.5}
\]

**Proof.**  The Ky Fan variational principle says that (3.3) is the minimum
of `tr((I-P)T_B(I-P))` over projectors of rank at most `r` after extending a
lower-rank projector inside its kernel.  The polynomial projector in (3.1)
is an admissible competitor and has loss (3.2).  This proves (3.4).
Splitting the exact sum (2.11) and using `||P_Hu_j||<=1` proves (3.5).
`square`

Take a fixed `c>0` and, for `L>1`, set

\[
 r_L=\left\lceil {cL\over\log L}\right\rceil.          \tag{3.6}
\]

The elementary factorial inequality `r!>=(r/e)^r` gives the explicit finite
bound

\[
 \boxed{
 \tau_r\leq{\delta\over\pi(2r+1)^2}
 \left({e\delta\over2r}\right)^{2r}.}                 \tag{3.7}
\]

For `r=r_L`, take logarithms in (3.7).  Direct substitution of (3.6) gives

\[
 \begin{aligned}
 \log\tau_{r_L}
 &\leq\log(\delta/\pi)-2\log(2r_L+1)
       +2r_L\log\!\left({e\delta\over2r_L}\right)\\
 &=-2cL+o(L).
 \end{aligned}                                        \tag{3.8}
\]

Indeed, `r_L log(r_L)=cL+o(L)` while `r_L=o(L)`.  Since
`log(lambda)=L/2`,

\[
 \boxed{
 \tau_{r_L}=\lambda^{-4c+o(1)}.}                       \tag{3.9}
\]

In particular,

\[
 \boxed{
 c>{1\over4}\quad\Longrightarrow\quad
 \tau_{r_L}=o(\lambda^{-1}).}                         \tag{3.10}
\]

This improves the *central-band feature inventory*.  It does not imply the
same small order for the Taylor approximation of `sinh(x/2)`.  The odd pole
is therefore treated directly rather than silently charged to this smaller
central polynomial space.

## 4. Exact Legendre--Fourier coefficients and target conditioning

Define the orthonormal Legendre functions

\[
 q_k(x)=\sqrt{{2k+1\over L}}\,P_k(2x/L),
 \qquad 0\leq k<r,                                     \tag{4.1}
\]

and phase-normalized centered Fourier functions

\[
 \phi_n(x)=(-1)^nL^{-1/2}e^{2\pi inx/L},
 \qquad n\in\mathbb Z.                                 \tag{4.2}
\]

Let `j_k` denote the spherical Bessel function and let

\[
 X_N=\operatorname {span}\{\phi_n:|n|\leq N\},
 \qquad P_N=P_{X_N}.                                    \tag{4.3}
\]

### Theorem 4.1 (Legendre--Fourier identity)

For every `k>=0` and `n in Z`,

\[
 \boxed{
 \langle\phi_n,q_k\rangle
 =\sqrt{2k+1}\,(-1)^n(-i)^k j_k(\pi n).}              \tag{4.4}
\]

**Proof.**  Substitute `s=2x/L` and use

\[
 \int_{-1}^{1}e^{-izs}P_k(s)\,ds=2(-i)^kj_k(z).        \tag{4.5}
\]

The sign in (4.4) is therefore fixed by the Fourier convention (1.2), not
by a numerical phase choice.  `square`

For integer `n!=0`, the following elementary spherical-Bessel estimate is

\[
 |j_k(\pi n)|
 \leq{1\over\pi|n|}
 \exp\!\left({k(k+1)\over2\pi|n|}\right).              \tag{4.6}
\]

Indeed, for real nonzero `z`, the finite spherical-Hankel formula and
`|j_k(z)|<=|h_k^(1)(z)|` give

\[
 |j_k(z)|\leq{1\over|z|}
 \sum_{m=0}^{k}{(k+m)!\over
 m!(k-m)!(2|z|)^m}.                                    \tag{4.6a}
\]

Pairing the factorials shows

\[
 {(k+m)!\over(k-m)!}
 =\prod_{a=1}^{m}(k-a+1)(k+a)
 \leq\{k(k+1)\}^m.                                    \tag{4.6b}
\]

The exponential series now proves (4.6).  This deliberately coarse estimate
is useful because all constants remain explicit.

Let `Q:C^r->L^2(I_lambda)` synthesize `q_0,...,q_(r-1)` and define

\[
 \eta_{r,N}=\|(I-P_N)Q\|.                               \tag{4.7}
\]

### Theorem 4.2 (explicit projection conditioning)

For integers `r>=1` and `N>=1`,

\[
 \boxed{
 \eta_{r,N}^2
 \leq B_{r,N}:={2r^2\over\pi^2N}
 \exp\!\left({r(r-1)\over\pi N}\right).}              \tag{4.8}
\]

If `B_(r,N)<1`, the projected Legendre Gram

\[
 G_{r,N}=Q^*P_NQ                                        \tag{4.9}
\]

obeys

\[
 \boxed{
 (1-B_{r,N})I\preceq G_{r,N}\preceq I,
 \qquad
 \kappa_2(G_{r,N})\leq{1\over1-B_{r,N}}.}             \tag{4.10}
\]

**Proof.**  Equations (4.4)--(4.6), the Hilbert--Schmidt majorant for the
operator norm, and `sum_(n>N)n^(-2)<=1/N` give

\[
 \begin{aligned}
 \eta_{r,N}^2
 &\leq\sum_{k=0}^{r-1}\sum_{|n|>N}
       (2k+1)|j_k(\pi n)|^2\\
 &\leq {2\over\pi^2N}
       \exp\!\left({r(r-1)\over\pi N}\right)
       \sum_{k=0}^{r-1}(2k+1),
 \end{aligned}
\]

and the last sum is `r^2`.  For a unit coefficient vector `a`,

\[
 \langle a,G_{r,N}a\rangle
 =1-\|(I-P_N)Qa\|^2\in[1-\eta_{r,N}^2,1],             \tag{4.11}
\]

which proves (4.10).  `square`

Reflection preserves both spaces, so the corresponding same-parity Grams
inherit (4.10).  On the matched schedule `N` is of order `lambda^2`, while
`r_L` in (3.6) is of order `L/log L`; hence `B_(r_L,N)->0` explicitly.
This removes an ambient target-conditioning concern.  It does **not** prove
that the arithmetic image of the prescribed finite prolate source captures
these well-conditioned target directions.

## 5. Exterior interval-union effective tails

Let `I` be any interval of length `L`.  Let

\[
 \Omega=\mathop{\dot\bigcup}_{a=1}^{q}J_a             \tag{5.1}
\]

be a disjoint union of bounded intervals, up to null endpoints, and write
`ell_a=|J_a|`.  On `L^2(I)`, define the time--frequency concentration
operator

\[
 A_\Omega=P_I\mathcal F^{-1}1_\Omega\mathcal FP_I,     \tag{5.2}
\]

where `F` uses (1.2).  Let

\[
 1\geq\eta_1\geq\eta_2\geq\cdots\geq0                \tag{5.3}
\]

be its eigenvalues, counted with multiplicity, and put

\[
 p_\Omega=\operatorname {tr}A_\Omega
 ={L|\Omega|\over2\pi},
 \qquad
 \chi_\Omega=\operatorname {tr}(A_\Omega-A_\Omega^2).
                                                                  \tag{5.4}
\]

Define

\[
 b(y)=
 \begin{cases}
 8y-y^2,&0\leq y\leq2,\\
 12+8\log(y/2),&y\geq2.
 \end{cases}                                           \tag{5.5}
\]

### Theorem 5.1 (explicit interval-union leakage)

The transition trace has the exact representation

\[
 \boxed{
 \chi_\Omega=
 \int_\Omega\int_{\Omega^c}
 |\widehat{1_I}(t-u)|^2\,{dt\,du\over(2\pi)^2}.}       \tag{5.6}
\]

Moreover,

\[
 \boxed{
 \chi_\Omega\leq{1\over4\pi^2}
 \sum_{a=1}^{q}b(L\ell_a)}                             \tag{5.7}
\]

and hence

\[
 \boxed{
 \chi_\Omega
 \leq{q\over\pi^2}
 \left\{3+2\log\!\left(1+{L|\Omega|\over2q}\right)
 \right\}.}                                           \tag{5.8}
\]

**Proof.**  Formula (5.6) is the Hilbert--Schmidt leakage identity for the
two orthogonal projections `P_I` and `F^(-1)1_Omega F`.  Since

\[
 |\widehat{1_I}(v)|\leq\min\{L,2/|v|\},                \tag{5.9}
\]

subadditivity over the disjoint intervals reduces the upper bound to one
interval `J` of length `ell`.  Translation invariance and the two sides of
`J` give

\[
 2\left\{
 \int_0^\ell v\min(L^2,4/v^2)\,dv
 +\ell\int_\ell^\infty\min(L^2,4/v^2)\,dv
 \right\}.                                             \tag{5.10}
\]

Splitting at `v=2/L` evaluates (5.10) as `b(L*ell)`.  Division by
`(2*pi)^2` proves (5.7).  Finally,

\[
 {b(y)\over4}
 \leq3+2\log(1+y/2)                                    \tag{5.11}
\]

and concavity of the logarithm proves (5.8).  `square`

### Theorem 5.2 (open-threshold effective rank and tail)

Fix `0<sigma<1` and define the **open** threshold count

\[
 r_\sigma=\#\{j:\eta_j>\sigma\}.                       \tag{5.12}
\]

Then

\[
 \boxed{
 r_\sigma\leq p_\Omega+{\chi_\Omega\over\sigma},
 \qquad
 \sum_{\eta_j\leq\sigma}\eta_j
 \leq{\chi_\Omega\over1-\sigma}.}                   \tag{5.13}
\]

In particular, the exact integer rule

\[
 \boxed{
 k\geq\left\lfloor
 p_\Omega+{\chi_\Omega\over\sigma}
 \right\rfloor}                                       \tag{5.14}
\]

implies `k>=r_sigma`, including when the expression inside the floor is
itself an integer.  An eigenvalue equal to `sigma` belongs to the low tail.

If `C=P_XA_Omega P_X` is any finite-subspace compression, with eigenvalues
`gamma_1>=...>=gamma_d>=0`, then every `k` satisfying (5.14) obeys

\[
 \boxed{
 \gamma_{k+1}\leq\sigma,
 \qquad
 \operatorname {Tail}_k(C):=\sum_{j>k}\gamma_j
 \leq{\chi_\Omega\over1-\sigma}.}                    \tag{5.15}
\]

**Proof.**  Split the trace at the open threshold:

\[
 r_\sigma-p_\Omega
 =\sum_{\eta_j>\sigma}(1-\eta_j)
  -\sum_{\eta_j\leq\sigma}\eta_j
 \leq{\chi_\Omega\over\sigma}.                       \tag{5.16}
\]

On the low part,
`eta_j<=(eta_j(1-eta_j))/(1-sigma)`, proving the second inequality in
(5.13).  The integer conclusion is (5.14).  Min--max gives
`gamma_j<=eta_j` term by term, which proves (5.15).  `square`

The floor in (5.14) is not replaced by a ceiling.  The strict/open spectral
threshold is what makes the equality case unambiguous.
For `k>=d`, (5.15) is read with `gamma_(k+1)=0` and an empty tail; its
conclusions are then trivial.

## 6. Exact spectral `k`-width and physical alignment

Let `C>=0` act on a `d`-dimensional space, with eigenvalues

\[
 \gamma_1\geq\cdots\geq\gamma_d\geq0                  \tag{6.1}
\]

and orthonormal eigenvectors `u_j`.  Fix `1<=k<d`, let `E_k` be a top-`k`
spectral projector, and let `K_0` be any `k`-dimensional candidate captured
space.  Put

\[
 H_0=K_0^\perp,\qquad
 \mathfrak a_k^2=\|P_{H_0}E_k\|_{\rm HS}^2,
 \qquad
 \alpha_k=\|P_{H_0}E_k\|.                              \tag{6.2}
\]

### Theorem 6.1 (exact trace and operator `k`-width bounds)

With `Tail_k(C)=sum_(j>k)gamma_j`,

\[
 \boxed{
 \operatorname {Tail}_k(C)
 +(\gamma_k-\gamma_{k+1})\mathfrak a_k^2
 \leq\operatorname {tr}(P_{H_0}CP_{H_0})}              \tag{6.3}
\]

and

\[
 \boxed{
 \operatorname {tr}(P_{H_0}CP_{H_0})
 \leq\operatorname {Tail}_k(C)
 +(\gamma_1-\gamma_d)\mathfrak a_k^2.}                \tag{6.4}
\]

For the operator norm,

\[
 \boxed{
 \max\{\gamma_{k+1},\gamma_k\alpha_k^2\}
 \leq\|P_{H_0}CP_{H_0}\|
 \leq\gamma_{k+1}
 +(\gamma_1-\gamma_{k+1})\alpha_k^2.}                 \tag{6.5}
\]

**Proof.**  Put `p_j=<u_j,P_(K_0)u_j>`.  Since both `E_k` and `P_(K_0)`
have rank `k`,

\[
 \sum_{j\leq k}(1-p_j)=\sum_{j>k}p_j=\mathfrak a_k^2. \tag{6.6}
\]

Expanding the trace in the eigenbasis and applying the endpoint eigenvalues
to the two equal masses in (6.6) proves (6.3)--(6.4).  For (6.5), min--max
on the `(d-k)`-dimensional space `H_0` gives the first lower term, while
`C>=gamma_k E_k` gives the second.  Finally,

\[
 C\preceq\gamma_{k+1}I
       +(\gamma_1-\gamma_{k+1})E_k                     \tag{6.7}
\]

proves the upper bound.  `square`

If the actual captured space `K` has dimension at least `k`, one may choose
`K_0 subset K`.  Then `H=K^perp subset H_0`, so the upper bounds
(6.4)--(6.5) remain valid with `H` on the left.  The remaining task is to
construct such a `K_0` with small `mathfrak a_k` or `alpha_k`; a dimension
count alone does not do this.

### 6.1 Application to the exact exterior layer cake

Retain the exact combined defect from the preceding checkpoint:

\[
 d(t)=(U+\nu L-m_\lambda(t))_+,
 \qquad
 \Omega_s=\{|t|>\delta/L:\ d(t)>s\},                  \tag{6.8}
\]

\[
 C_s=T_{1_{\Omega_s}}|_X,
 \qquad
 D_{\rm ext}=\int_0^{A_*}C_s\,ds.                     \tag{6.9}
\]

Every level in (6.8) retains the archimedean term and the complete
minus-prime block from (1.3), including `n=lambda^2` when it is a prime
power.  The support bound from the previous checkpoint makes `Omega_s`
bounded.  Since the defining multiplier is real analytic and nonconstant,
each fixed level is, up to null endpoints, a finite union of intervals.
The number `q_s` of those intervals is not presently controlled at a useful
uniform scale.

For a declared `0<sigma_s<1`, define `p_s`, `chi_s`, and

\[
 k_s=\min\!\left\{\dim X,
 \left\lfloor p_s+{\chi_s\over\sigma_s}\right\rfloor
 \right\}
                                                                  \tag{6.10}
\]

from Theorems 5.1--5.2.  If `dim(K)>=k_s`, choose a
`k_s`-dimensional `K_s subset K` and let `mathfrak a_s`, `alpha_s` be its
top-spectral angles.  Equations (5.15) and (6.4)--(6.5) give the explicit
pointwise bounds

\[
 \boxed{
 \operatorname {tr}(P_HC_sP_H)
 \leq{\chi_s\over1-\sigma_s}+\mathfrak a_s^2,}         \tag{6.11}
\]

\[
 \boxed{
 \|P_HC_sP_H\|\leq\sigma_s+\alpha_s^2.}               \tag{6.12}
\]

Here `gamma_1-gamma_d<=1` and
`gamma_1-gamma_(k_s+1)<=1` were used only in the last simplification.  The
sharper eigenvalue differences in (6.4)--(6.5) may instead be retained.
For `k_s=0`, use `E_0=0`, `mathfrak a_s=alpha_s=0`; for
`k_s=dim(X)`, the dimension hypothesis forces `K=X` and both left sides
vanish.  These endpoint conventions are consistent with (6.11)--(6.12).
Integration preserves the cancellation of the combined symbol until the
level sets have been formed and yields

\[
 \boxed{
 \operatorname {tr}(P_HD_{\rm ext}P_H)
 \leq\int_0^{A_*}
 \left({\chi_s\over1-\sigma_s}+\mathfrak a_s^2\right)ds,} \tag{6.13}
\]

\[
 \boxed{
 \|P_HD_{\rm ext}P_H\|
 \leq\int_0^{A_*}(\sigma_s+\alpha_s^2)\,ds.}           \tag{6.14}
\]

Equations (5.8), (6.10), and (6.13)--(6.14) are a genuine
positive-threshold effective-tail reduction.  They are not an asymptotic
exterior theorem until `q_s`, the chosen thresholds, the dimension reserve,
and the actual physical angles are bounded on one unbounded schedule.

The already locked converse remains in force:

\[
 D_{\rm ext}\succeq sC_s.                              \tag{6.15}
\]

Thus an exterior level with too many positive-threshold directions, or a
top spectral direction orthogonal to `K`, cannot be hidden by an upper-tail
estimate.

## 7. Direct odd pole and exact edge deficit

Let

\[
 p_N=P_Xp_-,\qquad p=P_Hp_N,
 \qquad \mu_p=\|p\|^2.                                 \tag{7.1}
\]

The odd pole leakage is reconstructed directly from the captured physical
cross Gram:

\[
 \boxed{
 \mu_p=\|p_N\|^2
 -(W^*p_N)^*(W^*W)^\dagger(W^*p_N).}                   \tag{7.2}
\]

This quantity is independent of the central covariance `rho_B`.  In
particular, the economical central order (3.6) is not misreported as an odd
Taylor approximation.

Fix

\[
 q=(c-\beta)L,\qquad h=(a-\beta)L,
 \qquad 0<h<q,
 \qquad b=q-h.                                         \tag{7.3}
\]

Suppose

\[
 0\preceq R\preceq bI,
 \qquad Y=bI-R,
 \qquad M_\beta=qI-R=hI+Y.                             \tag{7.4}
\]

The exact uncompensated shifted odd load is

\[
 \mathcal L=2\langle p,(hI+Y)^{-1}p\rangle.           \tag{7.5}
\]

### Theorem 7.1 (exact edge-deficit identity)

Define the nonlinear edge deficit

\[
 \mathfrak e_p=\langle p,Y(hI+Y)^{-1}p\rangle.         \tag{7.6}
\]

Then

\[
 \boxed{
 {2\mu_p\over h}-\mathcal L={2\mathfrak e_p\over h},}
                                                                  \tag{7.7}
\]

and therefore

\[
 \boxed{
 \mathcal L<1
 \quad\Longleftrightarrow\quad
 \mathfrak e_p>\mu_p-{h\over2}.}                      \tag{7.8}
\]

**Proof.**  Functional calculus gives

\[
 (hI+Y)^{-1}=h^{-1}{I-Y(hI+Y)^{-1}\}.                 \tag{7.9}
\]

Taking the quadratic form on `p` proves both claims.  `square`

This is the exact directional target.  It measures how far the pole spectral
mass lies from the dangerous edge `Y=0`, equivalently `R=bI`.

### Theorem 7.2 (sharp first-moment certificate)

Put

\[
 d_1=\langle p,Yp\rangle.                              \tag{7.10}
\]

Then

\[
 \boxed{
 \mathcal L\leq U_1
 :={2\mu_p\over h}-{2d_1\over hq}.}                   \tag{7.11}
\]

The first-moment certificate passes exactly when

\[
 \boxed{
 U_1<1
 \quad\Longleftrightarrow\quad
 d_1>q(\mu_p-h/2).}                                    \tag{7.12}
\]

The bound (7.11) is sharp from only `0<=Y<=bI`, `mu_p`, and `d_1`.

**Proof.**  The scalar function `y/(h+y)` is concave on `[0,b]` and lies
above its endpoint chord:

\[
 {y\over h+y}\geq{y\over h+b}={y\over q}.              \tag{7.13}
\]

Equations (7.7) and (7.13) prove (7.11); elementary rearrangement proves
(7.12).  Spectral measures supported on the endpoints `{0,b}` attain the
chord, proving sharpness.  `square`

The equivalence in (7.12) concerns the certificate `U_1`, not the true load
`mathcal L`.  In the range where (7.12) fails, the true load can lie on
either side of one.  Replacing (7.12) by an if-and-only-if claim for
`mathcal L` is invalid.

## 8. Cancellation-preserving Chebyshev expansion

Assume `b>0` and define

\[
 X_R={2R\over b}-I,
 \qquad
 \varrho={\sqrt q-\sqrt h\over\sqrt q+\sqrt h}
 \in(0,1).                                             \tag{8.1}
\]

Then `-I<=X_R<=I`.  Let `T_n` be the first-kind Chebyshev polynomial and
put

\[
 \Theta_n=\langle p,T_n(X_R)p\rangle,
 \qquad \Theta_0=\mu_p.                                \tag{8.2}
\]

### Theorem 8.1 (exact Chebyshev resolvent expansion)

The operator series converges uniformly and

\[
 \boxed{
 \mathcal L={2\over\sqrt{qh}}
 \left\{\mu_p+2\sum_{n=1}^{\infty}
                  \varrho^n\Theta_n\right\}.}         \tag{8.3}
\]

For every integer `k>=0`,

\[
 \boxed{
 \mathcal L\leq {2\over\sqrt{qh}}
 \left\{\mu_p+2\sum_{n=1}^{k}\varrho^n\Theta_n
 +{2\mu_p\varrho^{k+1}\over1-\varrho}\right\}.}     \tag{8.4}
\]

The absolute truncation error is at most

\[
 \boxed{
 {2\mu_p\over h}
 \left(1+\sqrt{h/q}\right)\varrho^{k+1}.}             \tag{8.5}
\]

**Proof.**  The scalar Poisson--Chebyshev identity is

\[
 {1\over q-b(x+1)/2}
 ={1\over\sqrt{qh}}
 \left\{1+2\sum_{n=1}^{\infty}\varrho^nT_n(x)\right\},
 \qquad |x|\leq1.                                     \tag{8.6}
\]

Uniform convergence permits functional calculus at `X_R` and proves
(8.3).  Since `||T_n(X_R)||<=1`, one has `|Theta_n|<=mu_p`; summing the
geometric tail proves (8.4).  Finally,

\[
 {4\over\sqrt{qh}(1-\varrho)}
 ={2\over h}\left(1+\sqrt{h/q}\right),                \tag{8.7}
\]

which proves (8.5).  `square`

If `gamma=b/q`, then

\[
 \varrho={\gamma\over(1+\sqrt{h/q})^2}<\gamma.         \tag{8.8}
\]

Thus (8.5) is strictly faster than the Neumann ratio `gamma^(k+1)`.  The
finite sum in (8.4) retains the signs of the directional Chebyshev moments;
replacing every `Theta_n` by `mu_p` destroys the prospective gain.

When `b=0`, `R=Y=0`, `q=h`, and the exact load is simply
`2*mu_p/h`; no expansion is needed.

## 9. Exact odd countermodels and reclassification warning

All models in this section are logical regressions, not physical
Xi--prolate matrices.

### 9.1 Equal zeroth and first moments can pass or fail

Take

\[
 q=3,\qquad h=1,\qquad b=2,
 \qquad R=\operatorname {diag}(0,1,2).                 \tag{9.1}
\]

Let the squared coordinates of the pole vector be respectively

\[
 w^A={1\over80}(27,18,27),
 \qquad
 w^B={1\over80}(9,54,9).                               \tag{9.2}
\]

Both models have

\[
 \mu_p={9\over10},\qquad
 \langle p,Rp\rangle={9\over10},\qquad
 d_1={9\over10}.                                      \tag{9.3}
\]

Their exact nonlinear deficits from (7.6) are

\[
 \mathfrak e_A={27\over80},\qquad
 \mathfrak e_B={33\over80},\qquad
 \mu_p-{h\over2}={32\over80}.                         \tag{9.4}
\]

Thus the two measures lie on opposite sides of the exact edge threshold in
(7.8).  Correspondingly, their exact loads are

\[
 \boxed{
 \mathcal L_A={9\over8}>1,
 \qquad
 \mathcal L_B={39\over40}<1.}                         \tag{9.5}
\]

Thus the pole norm and first edge moment do not determine the true pass/fail
orientation.  This is why (7.12) is a one-sided sharp certificate rather
than an exact characterization of `mathcal L`.

### 9.2 Endpoint sharpness

Keep `q=3`, `h=1`, and let the spectral measure of `Y` put mass `1/2` at
each of `0` and `2`.  Then

\[
 \mu_p=1,\qquad d_1=1,
 \qquad \mathcal L=U_1={4\over3}.                      \tag{9.6}
\]

Therefore the coefficient in (7.11) cannot be improved using only the
interval and first-moment data.

### 9.3 Moving the pole is not proving positivity

One may enlarge the captured space to

\[
 K^\sharp=K+\operatorname {span}\{p_N\}.               \tag{9.7}
\]

Then the new high complement satisfies `P_(H^sharp)p_N=0`, so the explicit
high odd pole vanishes.  But its negative rank-one contribution has merely
moved into the low block, together with new low--high Schur coupling.  A
positive low block and a strict Schur reserve still have to be proved.
Equation (9.7) is a reclassification, not a signed-sector theorem.

## 10. Remaining theorem targets

The reductions above leave the following concrete tasks on an unbounded
matched schedule.

1. Prove the covariance-weighted central capture

   \[
    \sum_{j\leq r_L}\vartheta_j\|P_Hu_j\|^2
   \]

   at the required scale for the actual arithmetic image of the corrected
   prolate family.  The target Fourier conditioning in Section 4 does not
   provide this source-to-physical alignment.
2. Bound the component counts and lengths of the exact combined-symbol
   exterior levels strongly enough that (5.8), (6.10), and the captured
   dimension are compatible; then prove the principal-angle terms in
   (6.13)--(6.14).
3. Prove either the exact odd edge inequality (7.8), the sharp sufficient
   first-moment inequality (7.12), or a finite Chebyshev-moment upper bound
   from (8.4) strictly below one, after the required positive shifted base is
   established.
4. Combine the resulting signed sector floors with the already locked
   residual and projection estimates and verify the weighted limit in
   equation (5.2) of `DIRECT_RH_ATTACK.md`.

None of these four items is proved here.  The current terminal state is
`P0_INVALIDATED`.
