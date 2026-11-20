# Canonical boundary ground and the cross-root extension

## 0. Exact outcome and claim boundary

This note removes finite even-ground simplicity from the cross-root theorem.
Let `Q` be any finite real inversion-symmetric source-Cauchy matrix, let
`Q_+` be its even block, let `mu=min spec(Q_+)`, and put

\[
 E=\ker(Q_+-\mu I),\qquad u=P_E\eta .                 \tag{0.1}
\]

If `u!=0`, the canonical boundary ground

\[
 x={u\over\|u\|}                                      \tag{0.2}
\]

has a real-rooted raw Mellin polynomial.  Equivalently, every zero of its
finite Fourier transform is real or purely imaginary.  The proof lowers
exactly the boundary direction by

\[
 Q_\varepsilon=Q-\varepsilon|\eta\rangle\langle\eta|,
 \qquad \varepsilon>0,                               \tag{0.3}
\]

applies the already proved simple-even-ground theorem to `Q_epsilon`, and
takes a coefficientwise limit.  The perturbation is an exact finite
source-Cauchy/displacement-class auxiliary, not a numerical approximation
and not a new pinned arithmetic Weil assembly.

There is also a noncanonical existence corollary.  An inversion-paired
diagonal shell perturbation shows that every finite lowest even eigenspace
contains at least one cross-root vector, even when `P_E eta=0`.  It does not
make every vector in that eigenspace cross-rooted.  This does not select the
prolate-aligned vector and gives no alignment rate.

The theorem proves no actual-source cyclicity, parity noncollision, spectral
gap on an unbounded schedule, signed ground alignment, equation (5.2) of
`DIRECT_RH_ATTACK.md`, projection-convergent strip exclusion, or locally
uniform ground-transform convergence.  It uses no zeta-zero table and no
global Weil positivity.  It is no RH proof and gives no new Lambda bound.
The formal project state remains `P0_INVALIDATED`.

## 1. Locked finite conventions

The binding finite source remains Connes--Consani--Moscovici, *Zeta
Spectral Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf` with SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
No source lock or artifact is changed here.

Use

\[
 L=2\log\lambda,\qquad t=\log(\lambda u)-L/2,
 \qquad {du\over u}=dt,
\]

\[
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},\qquad
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt,
 \qquad JV_n=V_{-n}.                              \tag{1.1}
\]

The prolate input remains on `[-lambda,lambda]` with Lebesgue measure and
zero extension, with the locked source-limit normalization rather than unit
normalization.  Its arithmetic image is evenized only after applying `E`;
no finite-lambda inversion parity is assumed.  None of these prolate
conventions is modified by the finite auxiliary below.

For `-N<=n<=N`, put

\[
 MV_n=nV_n,\qquad
 \eta=\sum_{|n|\leq N}V_n,\qquad
 \beta=\sum_{|n|\leq N}b_nV_n.                   \tag{1.2}
\]

The complete finite matrix is assembled as pole minus archimedean minus
prime, including every prime power `1<k<=lambda^2` and retaining the minus
sign of source equation (3.19).  Its exact source-Cauchy form is

\[
 Q_{nn}=a_n,\qquad
 Q_{nm}={b_n-b_m\over n-m}\quad(n\ne m),
 \qquad a_{-n}=a_n,\quad b_{-n}=-b_n,              \tag{1.3}
\]

and hence

\[
 [M,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.                \tag{1.4}
\]

Only the complete already assembled `Q` occurs below.  The proof perturbation
in (0.3) is a finite algebraic device; it is not inserted into the pinned
pole, archimedean, or prime inventory.  All limits `epsilon->0` below are at
fixed `N`.  In particular, `eta` is not an `l^2` vector at fixed `lambda` as
`N->infinity`, and (0.3) is not an infinite-dimensional perturbation.  Its
finite operator norm is `epsilon*(2N+1)`.

## 2. Exact boundary rank-one perturbation

Define

\[
 a_n^{(\varepsilon)}=a_n-\varepsilon,\qquad
 b_n^{(\varepsilon)}=b_n-\varepsilon n.            \tag{2.1}
\]

For `n!=m`,

\[
 {b_n^{(\varepsilon)}-b_m^{(\varepsilon)}\over n-m}
 ={b_n-b_m\over n-m}-\varepsilon.                  \tag{2.2}
\]

Since every raw coordinate of `eta` equals one, equations (2.1)--(2.2)
give exactly

\[
 \boxed{Q_\varepsilon=Q-\varepsilon
 |\eta\rangle\langle\eta|.}                       \tag{2.3}
\]

Thus `Q_epsilon` is real, Hermitian, inversion symmetric, and in the exact
finite source-Cauchy/displacement class.  Equations (2.1)--(2.3) serialize
the auxiliary completely; they do not identify it with a pinned Weil
matrix at another source parameter.  Its serialized commutator vector is

\[
 \boxed{\beta_\varepsilon
 =\beta-\varepsilon M\eta,}                        \tag{2.4}
\]

because

\[
 [M,Q_\varepsilon]
 =|\beta_\varepsilon\rangle\langle\eta|
  -|\eta\rangle\langle\beta_\varepsilon|.         \tag{2.5}
\]

The vector `eta` is even, so its rank-one operator vanishes on the odd
sector:

\[
 \boxed{(Q_\varepsilon)_-=Q_-.}                    \tag{2.6}
\]

No Fourier sign, interval, source normalization, or arithmetic block sign
has been changed.

## 3. Canonical boundary-ground selection

Let `A=Q_+`, let `mu=min spec(A)`, and retain (0.1).  Assume `u!=0`.

### Theorem 3.1 (one simple even level below the old even ground)

For every `epsilon>0`, the lowest eigenvalue `mu_epsilon` of

\[
 A_\varepsilon=A-\varepsilon|\eta\rangle\langle\eta| \tag{3.1}
\]

is simple and satisfies `mu_epsilon<mu`.

**Proof.**  Since `x=u/||u||` belongs to `E`,

\[
 \langle x,A_\varepsilon x\rangle
 =\mu-\varepsilon|\langle\eta,x\rangle|^2
 =\mu-\varepsilon\|u\|^2<\mu.                    \tag{3.2}
\]

Hence at least one eigenvalue lies below `mu`.  Rank-one interlacing for a
negative rank-one perturbation gives

\[
 \lambda_2(A_\varepsilon)\geq\lambda_1(A)=\mu.     \tag{3.3}
\]

There is therefore exactly one **even-block** eigenvalue below `mu`, counted
with multiplicity, and it is the simple lowest even eigenvalue.  (If the
even block is one-dimensional, the same conclusion is immediate from
(3.2).)  \(\square\)

Vectors in `E intersect u^perp` remain exact `mu`-eigenvectors of
`A_epsilon`; the theorem does not pretend that the old multiplicity has
disappeared above the newly lowered line.  Although the odd block is
unchanged by (2.6), an odd eigenvalue may still lie below or collide with the
new even level.  No full-matrix ground or parity separation is asserted.

### Theorem 3.2 (canonical limit)

Choose the real unit ground vector `x_epsilon` with
`<eta,x_epsilon>>0`.  Then

\[
 \boxed{x_\varepsilon\longrightarrow
 {P_E\eta\over\|P_E\eta\|}=x
 \quad(\varepsilon\downarrow0).}                  \tag{3.4}
\]

**Proof.**  The ground equation is

\[
 (A-\mu_\varepsilon I)x_\varepsilon
 =\varepsilon\eta\langle\eta,x_\varepsilon\rangle.
                                                               \tag{3.5}
\]

The overlap on the right cannot vanish, since otherwise
`x_epsilon` would be an `A`-eigenvector below `mu`.  Weyl's inequality gives

\[
 0<\mu-\mu_\varepsilon
 \leq\varepsilon\|\eta\|^2,                       \tag{3.6}
\]

so `mu_epsilon` tends to `mu`.  Up to a positive scalar, (3.5) says

\[
 x_\varepsilon\ \parallel\
 (A-\mu_\varepsilon I)^{-1}\eta
 ={u\over\mu-\mu_\varepsilon}
  +(A-\mu_\varepsilon I)^{-1}P_{E^\perp}\eta.     \tag{3.7}
\]

The second term stays bounded, while the first diverges in the fixed
direction `u`.  Unit normalization and the chosen sign give (3.4).
\(\square\)

## 4. Closed real-rooted polynomial and axis zeros

Write the raw coefficients of a real even vector as

\[
 f=\sum_{|n|\leq N}f_nV_n,\qquad f_{-n}=f_n,
\]

and define

\[
 p_f(y)=f_0\prod_{m=1}^N(y-m^2)
 +2y\sum_{n=1}^N f_n
       \prod_{\substack{1\leq m\leq N\\m\ne n}}(y-m^2).
                                                               \tag{4.1}
\]

For `s=zL/(2*pi)`, the exact centered transform is

\[
 \widehat f(z)
 ={\sqrt L\over\pi}{\sin(\pi s)\over s}
 {p_f(s^2)\over\prod_{m=1}^N(s^2-m^2)},            \tag{4.2}
\]

with removable lattice values.

### Theorem 4.1 (canonical cross-root ground)

Under the hypothesis `P_E eta!=0`, the polynomial `p_x` is real-rooted and

\[
 \boxed{Z(\widehat x)\subset\mathbb R\cup i\mathbb R.} \tag{4.3}
\]

**Proof.**  Theorem 3.1 makes `x_epsilon` the real simple lowest vector of
the even block of the source-Cauchy matrix `Q_epsilon`.  The checkpoint-0.71
finite theorem therefore makes every `p_(x_epsilon)` real-rooted.  Theorem
3.2 and the linear formula (4.1) give coefficientwise convergence

\[
 p_{x_\varepsilon}\longrightarrow p_x.             \tag{4.4}
\]

The set of real-rooted real polynomials of degree at most `N` is closed
under coefficientwise convergence, provided the limit is not the zero
polynomial.  Here the interpolation identities

\[
 p_f(0)=(-1)^N(N!)^2f_0,
\]

\[
 p_f(n^2)=(-1)^{N-n}(N-n)!(N+n)!f_n
 \quad(1\leq n\leq N)                               \tag{4.5}
\]

show that `p_f=0` only when `f=0`; hence `p_x!=0`.  Thus `p_x` is
real-rooted.  A positive root of `p_x` gives real square roots `s`, a
negative root gives purely imaginary square roots, and the sine factor in
(4.2) has only real zeros.  Removable cancellations cannot create a zero
off the two axes, proving (4.3).  \(\square\)

Equivalently, finite-dimensional convergence makes
`hat(x_epsilon)->hat(x)` locally uniform.  Hurwitz on any disk disjoint
from both axes gives the same conclusion.

## 5. Conditional limit bridge without simplicity

On a proposed diagonal schedule, define `E_j`, `u_j`, and `x_j` as above.
Assume

\[
 u_j\ne0,\qquad
 \alpha_j=\langle\kappa_j,x_j\rangle\ne0.          \tag{5.1}
\]

The coefficient-normalized canonical ground is `X_j=x_j/alpha_j`.  Write
`rho_j=||P_(N_j)k_j||`, so that the existing projected-state convention is
`kappa_j=P_(N_j)k_j/rho_j`.  The correctly source-scaled entire function is

\[
 F_j(z)=4\rho_j\widehat X_j(z).
\]

Multiplication by the nonzero scalar `4*rho_j/alpha_j` does not change its
zero set, so every `F_j` is axis-rooted.  Therefore, if the separately
required source normalization and projective estimates proved

\[
 F_j\longrightarrow\Xi
 \quad\hbox{locally uniformly on }|\operatorname {Im}z|<1/2, \tag{5.3}
\]

the checkpoint-0.71 cross-Hurwitz lemma would exclude limiting zeros in
the open quadrants.  The elementary fact `Xi(i*y)>0` for `|y|<1/2` would
remove the remaining imaginary-axis arm.

For the bare Hurwitz implication, nonzero `alpha_j`, the locked nonzero
`rho_j`, and the separately assumed convergence (5.3) are enough.  Deriving
(5.3) from the existing
projective estimates additionally requires quantitative control of the
normalizing scalars; `P_(E_j)eta!=0` alone implies neither
`alpha_j!=0` nor a lower bound for `|alpha_j|`.

There is a multiplicity-safe exact formulation of the remaining low-mode
problem.  Let `Pi=Pi_(M,+)` be the even projection onto `|n|<=M`, and set

\[
 p=\Pi\kappa,\quad k_{00}=\|p\|^2>0,\quad
 {\cal L}=\operatorname {Ran}\Pi\cap p^\perp,
\]

\[
 A=\|P_{\cal L}x\|^2,\qquad
 c_M=\langle\Pi x,p\rangle.                       \tag{5.4}
\]

When `k_(00)A+|c_M|^2>0`, orthogonal decomposition of `Pi*x` along
`mathbb C*p direct-sum cal L` gives the finite identity

\[
 \boxed{\min_{s\in\mathbb C}\|\Pi(sx-\kappa)\|^2
 ={k_{00}^2A\over k_{00}A+|c_M|^2}.}              \tag{5.5}
\]

In the present real setting the minimizing scalar is

\[
 s_*={k_{00}c_M\over k_{00}A+c_M^2},\qquad
 |s_*|={k_{00}|c_M|\over k_{00}A+|c_M|^2}.         \tag{5.6}
\]

Indeed,

\[
 \Pi x={c_M\over k_{00}}p+P_{\cal L}x,
\]

so the squared objective is
`k_(00)|s*c_M/k_(00)-1|^2+|s|^2*A`; completing the
square proves (5.5)--(5.6).  This uses no inverse, adjugate, simple-ground
cofactor, or odd resolvent.

At `M=ceil(lambda)`, the already required projected-state tail estimates
make `k_(00)` bounded away from zero and make
`alpha-c_M=<R*kappa,R*x>` negligible relative to `alpha` whenever
`|alpha|^(-1)=lambda^(o(1))`.  Conditional on those same tail hypotheses,
the multiplicity-safe sufficient target

\[
 A=O\!\left({|\alpha|^2\over\lambda}\right),
 \qquad |\alpha|^{-1}=\lambda^{o(1)}               \tag{5.7}
\]

makes (5.5) `O(lambda^(-1))`, hence the low projective error
`O(lambda^(-1/2))`, while (5.6) gives only the allowed subpolynomial growth
`|s_*|=lambda^(o(1))` for the high-tail estimate.  Eventually `c_M!=0`, so
`s_*` is nonzero and the projective bridge may use the equally axis-rooted
functions `4*rho_j*s_* hat(x_j)`; the tail estimates make
`s_*=alpha^(-1)(1+o(1))`.  Formula (5.7) is a conditional sufficient target,
not an established actual-source bound.

Thus simplicity and full `beta`-Krylov cyclicity are not hypotheses of this
conditional zero-geometry bridge.  They are replaced by a canonical ground
line, its separately nonzero and quantitatively controlled prolate overlap,
and the still unproved locally uniform alignment (5.3).  A small residual
relative to the gap above the complete ground space controls distance to
`E_j`; when `dim(E_j)>1`, it does not select `P_(E_j)eta`.  The old adjugate
and odd-resolvent formulas also become singular at the parity collision
forced by a multiple even level.  Hence no existing signed-alignment rate
follows from this theorem, and equation (5.2) of `DIRECT_RH_ATTACK.md`
remains unproved.

## 6. Noncanonical coordinate fallback

The condition `P_E eta!=0` is essential for the particular perturbation
(0.3), but not for existence of some cross-root vector in `E`.

Let

\[
 e_0^+=V_0,\qquad
 e_j^+={V_j+V_{-j}\over\sqrt2}\quad(1\leq j\leq N). \tag{6.1}
\]

Because these vectors form a basis of the even sector, every nonzero `E`
has an index `j` with `P_Ee_j^+!=0`.  Subtract `epsilon` from the raw
diagonal entry at `0` if `j=0`, or from both raw diagonal entries `+j,-j`
if `j>0`.  This preserves inversion and the exact source-Cauchy
off-diagonal coefficients.  The diagonal perturbation commutes with `M`, so
the commutator (1.4) and its vector `beta` are unchanged.  For `j>0` it also
changes the odd diagonal shell, so the odd block is not fixed as it was in
(2.6).  On the even block it is precisely

\[
 A_{\varepsilon,j}=A-\varepsilon
 |e_j^+\rangle\langle e_j^+|.                     \tag{6.2}
\]

The rank-one selection and fixed-`N` limit proofs of Theorems 3.1--3.2,
with `eta` replaced by `e_j^+`, give the vector below.  The checkpoint-0.71
simple-even-ground theorem, including its Cauchy-preserving closure when
the boundary coefficient vanishes, then gives

\[
 x_j={P_Ee_j^+\over\|P_Ee_j^+\|},\qquad
 p_{x_j}\text{ real-rooted}.                       \tag{6.3}
\]

Consequently every finite lowest even eigenspace contains at least one
cross-root vector.  This is only an existence statement; arbitrary vectors
of a multiple ground space need not be cross-rooted.  If `P_E kappa!=0`,
one may choose `j` with

\[
 \langle\kappa,P_Ee_j^+\rangle
 =\langle P_E\kappa,e_j^+\rangle\ne0.              \tag{6.4}
\]

This supplies a nonzero normalization overlap, not a quantitative lower
bound or a source-canonical direction.  The selected coordinate may vary
erratically with `(lambda,N)` and need not approach the prolate state.

## 7. Exact structural fixtures and the remaining frontier

Two exact examples mark the logical boundary.

1. Take `N=1` and `Q=0`.  The even bottom has multiplicity two,
   `P_E eta=eta`, and (0.3) has simple even ground `eta` with eigenvalue
   `-3*epsilon`.  Using the unnormalized representative `eta` of the
   canonical line, whose raw even coefficients are `eta_0=eta_1=1`,

   \[
    p_\eta(y)=3y-1,                                 \tag{7.1}
   \]

   so the canonical limiting polynomial is visibly real-rooted.

2. Take any `N>=2`, `a_n=1`, and `b_n=n`.  Then

   \[
    Q=|\eta\rangle\langle\eta|.                    \tag{7.2}
   \]

   Its even ground is `E=eta^perp`, so `P_E eta=0`; for
   `0<epsilon<1`, (0.3) only rescales (7.2) and leaves the multiple ground
   unchanged.  The failure is substantive: at `N=3`, the even ground vector

   \[
    x_0=-{1\over36},\quad x_1={1\over24},\quad
    x_2=-{17\over120},\quad x_3={41\over360}       \tag{7.3}
   \]

   is orthogonal to `eta`, but its exact polynomial is

   \[
    p_x(y)=y^2+1.                                  \tag{7.4}
   \]

   Thus this member of the multiple ground space is not cross-rooted; its
   nonreal `y`-roots generate transform zeros off both axes.  At `N=2`, the
   coordinate fallback using `e_0^+` instead selects the raw vector
   `(-1,-1,4,-1,-1)`, whose polynomial is

   \[
    p(y)=16-10y.                                    \tag{7.5}
   \]

The theorem is therefore exact but qualitative.  It bypasses finite
simple-ground and cyclicity assumptions for cross-root geometry; it does
not prove that the canonical or coordinate-selected ground transforms
approach the source-normalized prolate transform.  Neither canonical
nonvanishing nor the noncanonical coordinate fallback supplies the overlap
and rate in (5.7).  The signed alignment, equation (5.2) of
`DIRECT_RH_ATTACK.md`, and locally uniform convergence remain the frontier.
The terminal state remains `P0_INVALIDATED`.
