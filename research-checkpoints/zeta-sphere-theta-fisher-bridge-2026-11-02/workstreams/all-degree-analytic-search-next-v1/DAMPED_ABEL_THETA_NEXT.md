# Damped Abel continuation: gauge barriers and a bounded theta reserve

## Scope and outcome

This note tests the damped Abel continuation proposed in
`RESIDUAL_THETA_CONTRACTION_NEXT.md` for the **actual**, globally corrected
residual. The conclusion is deliberately narrower than a sign theorem.

1. Every integrable damping is exactly a bounded positive change of gauge.
   It can redistribute a derivative, but it cannot create a positive tail,
   remove a zero, or conceal a negative Abel value. In particular, starting
   at `z_0=0` would require the whole Abel path, not just its endpoint, to be
   nonnegative.
2. The two most immediate constructions do not close the problem.
   `lambda=-A_pi/S_pi` is circular and is nonintegrable at every nontrivial
   zero. A positive real weight in the Euler-renormalized Laplace formula
   does not give a positive theta packet: every interior packet
   `partial_z Sigma_z+ell Sigma_z`, `ell>=0`, changes sign in physical and
   Fourier space.
3. There is nevertheless a fully explicit, noncircular **candidate**
   damping. It is obtained from the all-index total variation of the actual
   Ewald cells, is continuous and nonnegative, and has uniformly bounded
   integral. For the fixed seed `z_*=1/2`, it reduces the continuation to
   one exact Poisson--ceiling seed inequality and one exact signed Wronskian
   inequality. These inequalities allow negative cells and negative Abel
   derivative.
4. The available complete-theta identities do not prove those last two
   inequalities. They are isolated below as a weaker, source-specific next
   lemma. No finite sampling, endpoint sign, all-degree theorem, or RH claim
   is made.

## 1. The actual Euler-renormalized path

For the residual `pi=p-q_A` retain the audited source

\[
 J_\pi\in\mathcal S(\mathbb R;\mathbb R),\qquad
 J_\pi(-x)=J_\pi(x),\qquad
 \widehat J_\pi=J_\pi,\qquad J_\pi(0)=0.          \tag{1}
\]

Thus `int_0^infinity J_pi=0`. Its left Euler cells and Abel path are

\[
 e_n=e_n(\pi)=J_\pi(n)-\int_{n-1}^nJ_\pi(x)\,dx,
 \qquad
 S(z)=\mathcal S_\pi(z)=\sum_{n\geq1}e_nz^n,     \tag{2}
\]

\[
 A(z)=\mathcal A_\pi(z)=S'(z)
 =\sum_{n\geq1}ne_nz^{n-1}.                     \tag{3}
\]

The coefficients are rapidly decreasing, so (2)--(3) are smooth on the
closed interval `[0,1]`. Put

\[
 \mathcal K_z(x)=\mathcal P_z(x)-z^{\lceil x\rceil},
 \qquad
 \mathcal P_z(x)=
 {1-z^2\over1-2z\cos(2\pi x)+z^2},              \tag{4}
\]

and `mathcal G_z=partial_z mathcal K_z`. The exact Poisson--ceiling formulas
are

\[
 \boxed{
 S(z)=\int_0^\infty\mathcal K_z(x)J_\pi(x)\,dx,
 \qquad
 A(z)=\int_0^\infty\mathcal G_z(x)J_\pi(x)\,dx.} \tag{5}
\]

In particular `S(0)=0` and

\[
 S(1)=\sum_{n\geq1}J_\pi(n)=\mathfrak q[\pi].   \tag{6}
\]

At the completed-frequency level, with `s=1/2-it`,

\[
 D(z,s)=\operatorname {Li}_s(z)
 -{1-z\over1-s}\operatorname {Li}_{s-1}(z)
 =-{z\over\Gamma(s)}\int_0^\infty
 {y^{s-2}\{1-(1+y)e^{-y}\}\over1-ze^{-y}}\,dy. \tag{7}
\]

The second term in the first expression is the Euler counterterm. It must
remain paired with the polylogarithm. If

\[
 \mathcal E_z(t)={1\over2}
 \operatorname {Re}\{K(t)D(z,1/2-it)\},          \tag{8}
\]

then the same actual residual occurs in

\[
 S(z)={1\over\pi}\int_{\mathbb R}
 \mathcal B(\Xi,\mathcal E_z)(t)|P_\pi(t)|^2\,dt. \tag{9}
\]

Equations (5) and (9), rather than either unrenormalized polylogarithm, are
the identities used below.

## 2. Integrable damping is only a bounded positive gauge

The basic limitation can be stated without any theta specialization.

**Gauge equivalence.** Let `S` be absolutely continuous on `[z_0,1]` and
let `lambda in L1([z_0,1])` be real. Define

\[
 R(z)=\exp\!\left(-\int_{z_0}^z\lambda(u)\,du\right). \tag{10}
\]

Then `R` is positive, absolutely continuous, and bounded above and below by
positive constants. Moreover

\[
 \boxed{
 S'(z)+\lambda(z)S(z)\geq0
 \quad\Longleftrightarrow\quad
 \left({S(z)\over R(z)}\right)'\geq0}
 \quad\text{a.e.}                               \tag{11}
\]

Indeed, `R'=-lambda R`, so the two sides differ by the positive factor `R`:

\[
 R S'-R'S=R\{S'+\lambda S\}.                    \tag{12}
\]

Consequently, if `S(z_0)>=0`, a legal damping forces

\[
 S(z)\geq0\qquad(z_0\leq z\leq1).              \tag{13}
\]

It cannot turn a negative Abel value into a positive gauged value because
`R` never vanishes or blows up. If the seed is strictly positive, the path
cannot have a later zero. If the seed is zero, `S/R` must move away from
zero only in the nonnegative direction.

This makes the `z_0=0` option particularly strong. Since `S(0)=0`, any
integrable damping from zero implies `S(z)>=0` on the **entire** Abel path.
If `e_m` is the first nonzero coefficient, this requires

\[
 e_m>0.                                          \tag{14}
\]

The generic self-dual source `J_*` in
`EWALD_ALL_INDEX_COMPENSATION_NEXT.md` has `e_1(*)<0` while `S_*(1)>0`.
It therefore gives a sharp generic obstruction to a zero-seed damping. It
is not an actual theta residual, so (14) remains an arithmetic question for
`J_pi`; it does show that (14) cannot follow from self-duality, Schwartz
decay, `J(0)=0`, or the forced moments.

### Why the logarithmic quotient is circular

On an interval where `S>0`, the formal choice

\[
 \lambda=-{A\over S}                             \tag{15}
\]

makes the left side of (11) zero. But the positivity needed to define (15)
is already the tail property (13). The defect at a zero is not removable.
If `a` is a zero of finite order `m>=1`, then

\[
 S(z)=(z-a)^m g(z),\qquad g(a)\ne0,
 \qquad {A(z)\over S(z)}={m\over z-a}+{g'(z)\over g(z)}. \tag{16}
\]

Thus (15) is not locally integrable at `a`, including at an endpoint. The
variants `(-A)_+/S` and `max(0,-A/S)` have the same logical defect: they are
legal only after a positive zero-free tail has already been proved.

The conclusion does not require finite order.  On either one-sided interval
where `S` is nonzero, integrability of `S'/S` would give a finite limit for
`log|S|` at the endpoint.  That contradicts `S(z) -> 0` at any zero,
including a possible infinite-order endpoint zero.

For later use, an independently specified positive gauge `R_pi` would be
noncircular. Equations (5) and (12) give its exact obligation:

\[
 \boxed{
 R_\pi(z)A(z)-R_\pi'(z)S(z)
 =\int_0^\infty
 \{R_\pi(z)\mathcal G_z(x)-R_\pi'(z)\mathcal K_z(x)\}
 J_\pi(x)\,dx.}                                  \tag{17}
\]

The right side is a single signed correlation with the complete source.
It is not a demand that either kernel or source be pointwise positive.

## 3. Two source-free positivity attempts fail sharply

### 3.1 A fixed scalar damping cannot work on the generic source class

At a fixed interior `z` and scalar `ell`,

\[
 A(z)+\ell S(z)
 =\sum_{n\geq1}(n+\ell z)e_nz^{n-1}
 =\int_0^\infty
 \{\mathcal G_z(x)+\ell\mathcal K_z(x)\}J(x)\,dx. \tag{18}
\]

The real even Fourier-`+1` Schwartz sources with `J(0)=0` form a vector
space closed under `J mapsto -J`. The functional in (18) is not identically
zero on that space. One way to see this is to regard (18) as a tempered
distribution: its discrete part has masses proportional to
`(n+ell z)z^(n-1)` at all positive integers. A single scalar `ell` can kill
at most one of those masses, while the Fourier transforms of the
exponentially weighted cell densities are smooth there. The same
distribution argument as in the finite-coordinate interpolation theorem
therefore rules out annihilation on the Fourier-`+1` subspace (even after an
arbitrary multiple of evaluation at zero is allowed).

Hence (18) takes both signs on the generic source class. Any successful
`lambda_pi` must depend on the actual complete-theta source; no scalar
function of `z` alone follows from the generic symmetry constraints.

The cell averages also show why a source-specific correlation is
unavoidable. On the cell `(m,m+1)`,

\[
 \int_m^{m+1}\mathcal K_z(x)\,dx=1-z^{m+1},
 \qquad
 \int_m^{m+1}\mathcal G_z(x)\,dx=-(m+1)z^m,      \tag{19}
\]

and therefore

\[
 \int_m^{m+1}(\mathcal G_z+\ell\mathcal K_z)\,dx
 =-(m+1)z^m+\ell(1-z^{m+1}).                    \tag{20}
\]

A single `ell` trades all cell budgets simultaneously. Since `J_pi` is
itself signed and has zero mean, neither the sign of (20) nor pointwise
positivity of a rearranged kernel would sign the correlation in (18).

### 3.2 A positive Laplace numerator is not a positive theta packet

Differentiating the ordinary convergent integral (7), for fixed `0<z<1`,
gives the exact identity

\[
 \boxed{
 (\partial_z+\ell)D(z,s)
 =-{1\over\Gamma(s)}\int_0^\infty
 y^{s-2}\{1-(1+y)e^{-y}\}
 {1+\ell z(1-ze^{-y})\over(1-ze^{-y})^2}\,dy.} \tag{21}
\]

For every `ell>=0`, the real factor after `y^(s-2)` is positive. This does
not define a positive completed mixture on the critical line: the phase
`y^(-it)` and the completed gamma quotient cannot be separated without
losing the decay supplied by their joint oscillation.

There is a direct sign obstruction. Let

\[
 \Sigma_z=\sum_{n\geq1}z^n\varepsilon_n,
 \qquad
 \mathcal H_{z,\ell}=\partial_z\Sigma_z+\ell\Sigma_z. \tag{22}
\]

The audited cell masses `mu_n=int epsilon_n` are strictly positive. Thus,
for `ell>=0`,

\[
 \int_{\mathbb R}\mathcal H_{z,\ell}(h)\,dh
 =\sum_{n\geq1}(nz^{n-1}+\ell z^n)\mu_n>0.       \tag{23}
\]

On the other hand, the exact right-tail expansions of the complete Abel
packet give

\[
 \begin{aligned}
 \mathcal H_{z,\ell}(h)
 =-&\left\{
 {4\pi(1+2z)\over(1-z)^3}
 +{2\pi\ell z(2+z)\over(1-z)^2}
 \right\}e^{-5h/2}\{1+o(1)\}<0
 \end{aligned}                                   \tag{24}
\]

for all sufficiently large `h`. Hence every `mathcal H_(z,ell)` with
`ell>=0` changes sign in physical space.

Its Fourier transform changes sign infinitely often as well. The leading
Dirichlet polynomial is the absolutely convergent, nonzero almost-periodic
series

\[
 \sum_{n\geq1}(nz^{n-1}+\ell z^n)n^{-1/2}e^{it\log n}. \tag{25}
\]

The same chirped-phase mean/mean-square argument used for `Sigma_z` applies
verbatim to (25). Thus the positive real numerator in (21) does not make
the Euler-renormalized packet positive in either domain.

This does **not** disprove a positive scalar correlation
`A_pi+ell S_pi` for the actual residual. It proves that such a sign cannot
come from declaring the damped packet itself positive; it must come from its
complete correlation with `Xi`, the residual weight, and the Galerkin
correction.

## 4. A bounded all-index tail-reserve damping

Although the preceding routes fail, the signed Ewald coefficients provide
one canonical positive gauge that is independent of the unknown endpoint
sign. Define the all-index variation series

\[
 V(z)=V_\pi(z)=\sum_{n\geq1}|e_n(\pi)|z^n,
 \qquad M=V(1)=\sum_{n\geq1}|e_n(\pi)|.          \tag{26}
\]

Both series in (26), including all derivatives, converge on `[0,1]`. If
`M=0`, then `S identically 0` and the target is trivial. Suppose `M>0`, fix
once and for all a number `alpha>0`, and put

\[
 R_{\alpha}(z)=(1+\alpha)M-V(z),
 \qquad
 \boxed{\lambda_{\pi,\alpha}(z)
 ={V'(z)\over R_{\alpha}(z)}.}                  \tag{27}
\]

This is a genuine construction from the complete signed cells, not from
`S(1)` or an assumed sign of `S`. It has the uniform safeguards

\[
 R_\alpha(z)\geq\alpha M>0,
 \qquad \lambda_{\pi,\alpha}(z)\geq0,            \tag{28}
\]

and, for every `0<=z_0<1`,

\[
 \boxed{
 \int_{z_0}^1\lambda_{\pi,\alpha}(z)\,dz
 =\log{R_\alpha(z_0)\over\alpha M}
 \leq\log{1+\alpha\over\alpha}.}               \tag{29}
\]

Thus `lambda_(pi,alpha)` is continuous, integrable, and bounded in total
damping independently of the degree and of the magnitude of the cells. Its
exact Wronskian is

\[
 \boxed{
 \begin{aligned}
 \mathcal W_{\pi,\alpha}(z)
 &:=
 R_\alpha(z)A(z)+V'(z)S(z)\\
 &=\int_0^\infty
 \{R_\alpha(z)\mathcal G_z(x)+V'(z)\mathcal K_z(x)\}
 J_\pi(x)\,dx,
 \end{aligned}}                                  \tag{30}
\]

and

\[
 A(z)+\lambda_{\pi,\alpha}(z)S(z)
 ={\mathcal W_{\pi,\alpha}(z)\over R_\alpha(z)}. \tag{31}
\]

Unlike `A>=0`, the condition `mathcal W_(pi,alpha)>=0` permits

\[
 A(z)<0\quad\text{as long as}\quad
 -A(z)\leq {V'(z)\over R_\alpha(z)}S(z).         \tag{32}
\]

This is not merely formal. For the elementary signed-cell path

\[
 S(z)=z-{3\over4}z^2,\qquad
 V(z)=z+{3\over4}z^2,\qquad M={7\over4},         \tag{33}
\]

take `alpha=1/2`. Then

\[
 \mathcal W_{1/2}(z)
 ={21\over8}-{63\over16}z+{3\over2}z^2
 \geq {3\over16}>0\qquad(0\leq z\leq1),        \tag{34}
\]

while `A(z)=1-3z/2<0` for `z>2/3`. The bounded tail-reserve criterion is
therefore strictly weaker than pointwise Abel monotonicity.

### A concrete complete-theta next lemma

To permit negative early cells without choosing a seed from the unknown
endpoint behavior, fix

\[
 z_*={1\over2},\qquad \alpha={1\over2}.          \tag{35}
\]

At this seed the first required inequality has the exact all-index form

\[
 \boxed{
 S(1/2)=\int_0^\infty
 \left\{{3\over5-4\cos(2\pi x)}-2^{-\lceil x\rceil}\right\}
 J_\pi(x)\,dx\geq0.}                            \tag{36}
\]

Equivalently, it is the complete Euler-renormalized correlation (9) with

\[
 D(1/2,s)=\operatorname {Li}_s(1/2)
 -{1\over2(1-s)}\operatorname {Li}_{s-1}(1/2).  \tag{37}
\]

There is no finite truncation in (36)--(37). The proposed source-specific
continuation is the following.

> **Bounded tail-reserve lemma for the actual theta residual.** For every
> actual Galerkin residual `pi` produced from a positive old prefix, prove
> directly from the complete theta/Euler source that
> \[
> S_\pi(1/2)\geq0,
> \qquad
> \mathcal W_{\pi,1/2}(z)\geq0
> \quad(1/2\leq z\leq1).                         \tag{38}
> \]

If (38) holds, (27), (29), and (31) give an explicit legal damping with

\[
 \lambda_{\pi,1/2}\in L^1([1/2,1]),
 \qquad
 \int_{1/2}^1\lambda_{\pi,1/2}\leq\log3,        \tag{39}
\]

and the damped Abel lemma yields `S_pi(1)>=0`. Both signs of individual
`e_n` and both signs of `A_pi` are allowed.

Condition (38) is more concrete than an unspecified `lambda_pi`: all
quantities are fixed by the actual residual, the damping budget is bounded,
and its two obligations are the single signed correlations (36) and (30).
It is also genuinely source-specific. The vector-space symmetry and the
finite-coordinate interpolation theorem imply that neither inequality can
follow from generic self-duality and finitely many cells. A proof must use
additional complete-theta arithmetic, for example a correlated regional
estimate on `J_pi` which is stable under the nonlinear but all-index scalars
`V` and `V'`.

No such estimate is presently available in the audited identities. Thus
(38) is an isolated next lemma, not a proved property of the actual theta
residual.

## 5. Route boundary and audit

- The gauge equivalence (10)--(13) shows exactly what damping can and cannot
  do. It weakens derivative monotonicity, but it does not weaken the need
  for a nonnegative Abel tail beginning at the seed.
- The quotient damping (15) is both circular and nonintegrable at zeros. It
  is not used in (27).
- The candidate (27) uses the complete rapidly convergent variation series,
  not a finite certificate. Absolute values occur only after each exact
  Euler-renormalized cell has been formed from the same global residual.
- Differentiation in the Laplace formula is used only for fixed `z<1`.
  Endpoint passage is taken in the already-correlated rapidly decreasing
  coefficient series (2)--(3), not termwise in the unpaired Mellin source.
- Equations (23)--(25) rule out packet positivity, not a theta-specific
  scalar correlation. They do not determine the sign of (30).
- The fixed seed `1/2` is chosen before, and independently of, the endpoint
  sign. Its inequality (36) remains unproved; it cannot be replaced by a
  numerical sample of Abel parameters or cells.
- Nothing here proves a new Xi pivot, the all-degree contractive extension,
  the Laguerre inequalities, or RH.
