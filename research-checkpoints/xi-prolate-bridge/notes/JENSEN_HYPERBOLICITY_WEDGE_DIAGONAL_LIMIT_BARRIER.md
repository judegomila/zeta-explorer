# Jensen hyperbolicity-wedge diagonal-limit theorem/barrier

## 0. Exact outcome and claim boundary

Let

\[
 \xi_{\rm c}(z)=\xi\!\left({1\over2}+z\right)
   =\sum_{m\geq0}{\gamma(m)\over m!}z^{2m},
 \qquad
 J^{d,n}(X)=\sum_{j=0}^d{d\choose j}\gamma(n+j)X^j. \tag{0.1}
\]

Take the hyperbolicity wedge in arXiv:2608.08682v1 as an external
primary-source input.  This note proves the following consequences.

1. With

   \[
    E(w):=\xi_{\rm c}(\sqrt w)
       =\sum_{j\geq0}{\gamma(j)\over j!}w^j,       \tag{0.2}
   \]

   the classical unshifted Jensen limit is

   \[
    J^{d,0}(w/d)\longrightarrow E(w),
    \qquad
    J^{d,0}(-t^2/d)\longrightarrow\Xi(t),         \tag{0.3}
   \]

   locally uniformly.  Here
   `Xi(t)=xi(1/2+it)`.  For fixed `n`, the corresponding limit is
   `E^(n)(w)`, not `E(w)`.
2. The new wedge forces `d/n -> 0` on every joint sequence with
   `n,d -> infinity`.  After the only origin scale that keeps a nonzero
   first coefficient,

   \[
    {J^{d,n}(w/(dR_{1,n}))\over\gamma(n)}
       \longrightarrow e^w,
    \qquad R_{1,n}:={\gamma(n+1)\over\gamma(n)},  \tag{0.4}
   \]

   and therefore substitution `w=-t^2` gives `e^(-t^2)`, not `Xi(t)`.
   A general bounded origin scale gives `e^(cw)`.
3. At the paper's centered scale, the zeros have the semicircle empirical
   limit.  Hence no scalar normalization of those centered polynomials can
   converge locally uniformly to a nonzero entire function: a positive
   proportion of their zeros lies in every interior interval.
4. The shifted Jensen polynomial is an almost-total derivative of an
   unshifted polynomial.  Exact reconstruction requires an uncontrolled
   prefix of degree `n-1`, asymptotic to the whole degree.  Reverse
   integration does not preserve hyperbolicity.
5. A coefficientwise inverse shift would require a new finite multiplier-
   sequence theorem.  Proving that theorem for one wedge-admissible shift
   for every degree would already transfer hyperbolicity to every
   `J^(d,0)`; it is not a formal consequence of the wedge.

The note does not independently certify the 25-page proof of the external
preprint.  Its new statements are exact consequences of the specifically
identified v1 theorem and asymptotics.  It proves no unshifted Jensen
hyperbolicity, zero theorem, Riemann hypothesis, converse, or
de Bruijn--Newman bound.  It does not rule out a wholly new inverse-shift
theorem; it identifies that theorem as the missing work.  The standard
eight are unchanged and the formal state remains `P0_INVALIDATED`.

## 1. External source pin

The sole external input is the following primary source.

| Field | Pinned value |
|---|---|
| author | Jonathan Holland |
| title | `A new hyperbolicity wedge and a joint semicircle limit for Jensen polynomials of Riemann's xi-function` |
| identifier | `arXiv:2608.08682v1 [math.NT]` |
| submitted | `2026-08-09 12:58:52 UTC` |
| manuscript date | `2026-08-03` |
| versioned abstract URL | `https://arxiv.org/abs/2608.08682v1` |
| versioned PDF URL | `https://arxiv.org/pdf/2608.08682v1` |
| PDF pages | `25` |
| PDF bytes observed on 2026-08-12 | `389974` |
| PDF SHA-256 observed on 2026-08-12 | `3fc31ba84fb113bc0b3109fb0e569bd1d7183018485aca1eb1dab565c839b49d` |
| repository status | external and unvendored; no local source lock is claimed |

The source defines (0.1), states `gamma(n)>0`, and proves that one absolute
`K>0` satisfies

\[
 n^3\log^2(n+2)\geq Kd^5
 \quad\Longrightarrow\quad
 J^{d,n}\hbox{ has }d\hbox{ distinct negative real zeros}. \tag{1.1}
\]

It also proves, for joint sequences in this wedge, that if `rho_(j,nu)`
are the Jensen zeros, then

\[
 \lambda_{j,\nu}
 =\sqrt{n_\nu/d_\nu}\,
   \bigl(1+R_{1,n_\nu}\rho_{j,\nu}\bigr)        \tag{1.2}
\]

have empirical measure converging weakly to

\[
 d\mu_{\rm sc}(x)
 ={1\over2\pi}\sqrt{4-x^2}\,
   {\boldsymbol 1}_{[-2,2]}(x)\,dx.             \tag{1.3}
\]

The coefficient-ratio input used below is also explicit in the source.
Writing

\[
 R_{j,n}:={\gamma(n+j)\over\gamma(n)},
 \qquad
 q_{k,n}:={R_{k+1,n}^2\over R_{k,n}R_{k+2,n}}, \tag{1.4}
\]

its Lemma 4.3 gives `q_(0,n)>1` for all sufficiently large `n`, with
`q_(0,n)->1`.  Replacing `n` by `n+k` gives the corresponding statement
for every `q_(k,n)`.  The paper itself closes by saying that the result
controls an asymptotic region and supplies no converse from partial Jensen
hyperbolicity to RH.

No repository theorem, zero list, source sample, or numerical artifact is
frozen.  The PDF is not copied into the repository.  The digest above is a
provenance pin, not a promise that a future server response will have the
same container bytes.

## 2. The exact unshifted and fixed-shift limits

Because `xi_c` is even, (0.2) defines a single-valued entire function of
`w`; no branch choice remains.  Let

\[
 (d)_j=d(d-1)\cdots(d-j+1),
 \qquad (d)_0=1.                                \tag{2.1}
\]

Direct coefficient algebra gives

\[
 J^{d,n}(w/d)
 =\sum_{j=0}^d{(d)_j\over d^j}
             {\gamma(n+j)\over j!}w^j.          \tag{2.2}
\]

For fixed `n` and fixed `j`, `(d)_j/d^j -> 1`.  The standard Jensen
majorant, or the power-series convergence of the fixed entire derivative,
then gives locally uniformly

\[
 \boxed{J^{d,n}(w/d)\longrightarrow E^{(n)}(w).} \tag{2.3}
\]

At `n=0` this is the desired entire function `E`.  Since

\[
 E(-t^2)=\xi_{\rm c}(it)
        =\xi\!\left({1\over2}+it\right)=\Xi(t), \tag{2.4}
\]

equation (0.3) follows.  Equivalently, the central normalization is

\[
 {J^{d,0}(-t^2/d)\over\gamma(0)}
 \longrightarrow {\Xi(t)\over\Xi(0)}.          \tag{2.5}
\]

This approximation uses the coefficient prefix beginning at `n=0`.
Replacing that prefix by a moving tail changes the limit.

## 3. The wedge is an extreme derivative regime

The inequality (1.1) implies

\[
 d\leq K^{-1/5}n^{3/5}\log^{2/5}(n+2),
 \qquad
 {d\over n}\leq K^{-1/5}n^{-2/5}
                  \log^{2/5}(n+2)\longrightarrow0.       \tag{3.1}
\]

Thus every joint wedge sequence samples the short relative tail
`gamma(n),...,gamma(n+d)` with `d=o(n)`.  It cannot keep `n` fixed while
letting the approximation degree tend to infinity.  In particular,
(2.3) cannot be invoked with a fixed derivative order and then silently
identified with `E`.

## 4. The origin diagonal has an exponential limit

Define the consecutive ratios

\[
 r_{k,n}:={\gamma(n+k+1)\over\gamma(n+k)}.
 \tag{4.1}
\]

Then `R_(1,n)=r_(0,n)` and

\[
 q_{k,n}={r_{k,n}\over r_{k+1,n}}.              \tag{4.2}
\]

For sufficiently large `n`, Lemma 4.3 applied at every shift `n+k`
gives `q_(k,n)>1` for all `k>=0`.  Hence the positive ratios `r_(k,n)`
are decreasing and

\[
 0<{R_{j,n}\over R_{1,n}^j}\leq1.              \tag{4.3}
\]

There is also the exact quotient product

\[
 {R_{j,n}\over R_{1,n}^j}
 =\prod_{k=0}^{j-2}q_{k,n}^{-(j-1-k)}.          \tag{4.4}
\]

For each fixed `j`, every factor on the right tends to one.  Therefore

\[
 {R_{j,n}\over R_{1,n}^j}\longrightarrow1.     \tag{4.5}
\]

### Theorem 4.1 (origin-diagonal exponential collapse)

Let `n_nu,d_nu -> infinity` satisfy (1.1), and let real `c_nu -> c`.
Then, locally uniformly on the complex `w`-plane,

\[
 \boxed{
 {J^{d_\nu,n_\nu}
    \left(c_\nu w/(d_\nu R_{1,n_\nu})\right)
  \over\gamma(n_\nu)}
 \longrightarrow e^{cw}.}                      \tag{4.6}
\]

Indeed, the coefficient of `w^j` on the left is

\[
 {1\over j!}{(d_\nu)_j\over d_\nu^j}
 {R_{j,n_\nu}\over R_{1,n_\nu}^j}c_\nu^j.    \tag{4.7}
\]

For fixed `j` this tends to `c^j/j!`.  By (4.3), on every disk
`|w|<=A`, and for a fixed bound `|c_nu|<=C`, its modulus is at most
`(CA)^j/j!`.  Dominated convergence for the coefficient series proves
(4.6).

Taking `c_nu=1` and `w=-t^2` gives the genuine locally uniform limit

\[
 \boxed{
 {J^{d_\nu,n_\nu}
    \left(-t^2/(d_\nu R_{1,n_\nu})\right)
  \over\gamma(n_\nu)}
 \longrightarrow e^{-t^2}.}                    \tag{4.8}
\]

More generally, consider any origin-preserving scale `X=a_nu w` and a
scalar normalization whose value at `w=0` tends to a nonzero constant.
If the first derivative also has a finite limit, then necessarily

\[
 c_\nu=d_\nu R_{1,n_\nu}a_\nu                 \tag{4.9}
\]

has a finite limit after passage to a subsequence, and (4.6) forces an
exponential.  Matching the first coefficient of `E/gamma(0)` would set
`c=gamma(1)/gamma(0)` but would still give
`exp(gamma(1)w/gamma(0))`, not `E(w)/gamma(0)`.  The false identity would
make `xi_c(z)` a Gaussian exponential in `z`, contrary to the defining
completed-zeta function and its nontrivial zeros.

Thus the wedge does produce locally uniform real-rooted approximants, but
at the origin scale their limit is the zero-free Gaussian (4.8).  This is
a positive limit theorem and simultaneously the obstruction to the
classical Xi diagonal.

## 5. The centered diagonal has too many compact zeros

Solve (1.2) for the Jensen variable and define, for arbitrary nonzero real
scalars `a_nu`,

\[
 C_\nu(z):=a_\nu J^{d_\nu,n_\nu}
 \!\left({\sqrt{d_\nu/n_\nu}\,z-1
            \over R_{1,n_\nu}}\right).          \tag{5.1}
\]

The zeros of `C_nu` are exactly the `lambda_(j,nu)` in (1.2).  The
semicircle theorem implies that every nonempty interval
`I compactly contained in (-2,2)` contains

\[
 \#\{j:\lambda_{j,\nu}\in I\}
   =\bigl(\mu_{\rm sc}(I)+o(1)\bigr)d_\nu
   \longrightarrow\infty.                      \tag{5.2}
\]

### Theorem 5.1 (no nonzero centered entire limit)

No sequence `C_nu` in (5.1) converges locally uniformly to a nonzero
entire function.

Suppose it converged to such a function `G`.  Since the zeros of a nonzero
entire function are discrete, choose `x_0 in (-2,2)` with `G(x_0)!=0` and
a closed disk `D` about `x_0` on which `G` has no zero.  A smaller real
interval `I` lies inside `D`.  Uniform convergence and
`min_D |G|>0` imply that `C_nu` has no zero in `D` for all sufficiently
large `nu`.  Equation (5.2) gives instead a growing number of zeros in
`I`.  This contradiction proves the theorem.

This argument is unchanged by any zero-free analytic gauge: the zeros are
still the same.  The fixed-degree derivative limit discussed by the paper
is Hermite, while the joint-degree zero measure is semicircular.  Neither
is a locally uniform Xi approximation.  A further microscopic rescaling
would require local spacing information; the source expressly proves only
the global empirical law.

## 6. Exact differentiation and the uncontrolled prefix

Put `D=d+n`.  Termwise differentiation gives the exact identity

\[
 \boxed{
 {d^n\over dX^n}J^{D,0}(X)
 ={D!\over d!}J^{d,n}(X).}                      \tag{6.1}
\]

For the classically scaled polynomial `P_D(w)=J^(D,0)(w/D)`, this is

\[
 P_D^{(n)}(w)
 ={D!\over d!D^n}J^{d,n}(w/D).                 \tag{6.2}
\]

But (3.1) gives

\[
 {n\over D}\longrightarrow1,
 \qquad {d\over D}\longrightarrow0.           \tag{6.3}
\]

The wedge therefore proves hyperbolicity of an almost-total derivative,
not of a small derivative perturbation of `P_D`.

Taylor's formula reconstructs the lost data exactly:

\[
 \boxed{
 J^{D,0}(X)
 =\sum_{k=0}^{n-1}{D\choose k}\gamma(k)X^k
 +{D!\over d!(n-1)!}
   \int_0^X(X-u)^{n-1}J^{d,n}(u)\,du.}          \tag{6.4}
\]

The first term is an uncontrolled coefficient prefix of degree `n-1`,
and `n-1` is asymptotic to `D`.  Hyperbolicity of the second, differentiated
piece places no sign or interlacing condition on that prefix.

The one-step version is

\[
 \boxed{
 J^{d+1,n}(X)=\gamma(n)
 +(d+1)\int_0^XJ^{d,n+1}(u)\,du.}               \tag{6.5}
\]

Every downward shift introduces a new integration constant.  Repeating
(6.5) from a wedge point to `n=0` also raises the degree at every step and
must eventually leave the wedge before reaching `n=0` as a wedge point:
at that endpoint (1.1) would read

\[
 0\geq K D^5,                                    \tag{6.6}
\]

which is impossible for positive degree.  A deep interior point can remain
inside the wedge for several reverse steps; no immediate exit is claimed.

## 7. Reverse integration has no hyperbolicity principle

The failure already occurs for elementary negative-rooted polynomials.
The polynomial

\[
 p(X)=1+X                                                   \tag{7.1}
\]

has one negative real zero, but choosing the positive integration constant
one gives

\[
 1+\int_0^Xp(u)\,du=1+X+{X^2\over2},
 \qquad \operatorname {disc}=-1.              \tag{7.2}
\]

Even zero-constant integration fails:

\[
 \int_0^X(1+u)^2\,du
 =X\left(1+X+{X^2\over3}\right),
 \qquad \operatorname {disc}\left(1+X+{X^2\over3}\right)
 =-{1\over3}.                                  \tag{7.3}
\]

Nor does hyperbolicity of a high derivative imply hyperbolicity of the
original polynomial.  If `D` is even and `3<=n<D`, then

\[
 P(X)=X^D+X^2+1>0\quad(X\in\mathbb R),
 \qquad
 P^{(n)}(X)={D!\over(D-n)!}X^{D-n}.             \tag{7.4}
\]

The derivative is hyperbolic while `P` has no real zero.  These examples
do not model the xi coefficients; they disprove the proposed general
reverse operation.  The actual constants in (6.5) would need a new
xi-specific interlacing theorem.

## 8. The exact inverse-shift multiplier obligation

For fixed `d,n`, define the positive diagonal coefficient map

\[
 m_j^{(n)}:={\gamma(j)\over\gamma(n+j)},
 \qquad
 \mathcal M_{d,n}\!\left[\sum_{j=0}^da_jX^j\right]
 :=\sum_{j=0}^dm_j^{(n)}a_jX^j.                 \tag{8.1}
\]

It has the desired algebraic effect

\[
 \boxed{\mathcal M_{d,n}[J^{d,n}]=J^{d,0}.}     \tag{8.2}
\]

But (8.2) does not say that `mathcal M_(d,n)` preserves hyperbolicity.  A
necessary test for such preservation is obtained by applying the map to
the hyperbolic polynomial `(1+X)^d`: the symbol

\[
 \boxed{
 M_{d,n}(X)=\sum_{j=0}^d{d\choose j}
 {\gamma(j)\over\gamma(n+j)}X^j}               \tag{8.3}
\]

must itself be hyperbolic.  The source proves no assertion about (8.3),
let alone preservation on every hyperbolic input.

If, for every `d`, one could choose a wedge-admissible `n=n(d)` and prove
that `mathcal M_(d,n(d))` preserves degree-`d` hyperbolicity, then (1.1)
and (8.2) would prove `J^(d,0)` hyperbolic for every `d`.  Positivity of
the coefficients would put all those real zeros on the negative axis.
Equations (2.3)--(2.4) would then make `E` a locally uniform limit of
negative-rooted real polynomials and force every Xi zero to be real.  Thus
this multiplier statement is a legitimate possible target, but it is
exactly a new RH-strength bridge, not an automatic use of a standard
multiplier sequence.

The coefficient multipliers that encode antiderivatives are not a repair.
Equation (7.3) shows directly that division by `j+1`, followed by the
zero-constant integral, is not hyperbolicity preserving.  Differentiation
and known forward multiplier operations cannot be inverted without
proving new root geometry.

## 9. Fail-closed stopping line

Any downstream use must reject a claimed pass if it

1. substitutes a moving `n` into the fixed-`n` limit (2.3);
2. ignores `d/n -> 0` in the wedge;
3. identifies the exponential or Gaussian limits (4.6)--(4.8) with
   `E` or `Xi`;
4. treats the global semicircle law as local spacing control;
5. claims a nonzero locally uniform centered limit despite (5.2);
6. reverses differentiation without the prefix in (6.4);
7. assumes that an integration constant preserves hyperbolicity;
8. calls (8.1) a multiplier sequence without proving preservation or at
   least the symbol test (8.3);
9. treats the external v1 preprint as a vendored or independently audited
   repository theorem; or
10. claims unshifted Jensen hyperbolicity, a zero theorem, RH, a converse,
    or a de Bruijn--Newman bound.

The proved positive content is the exact classical normalization, the
joint origin-diagonal exponential/Gaussian limit, and the centered
dense-zero no-limit theorem.  The rigorous obstruction is the moving-tail
regime together with the almost-total-derivative prefix loss.  The exact
open bridge is an xi-specific reverse-interlacing or finite inverse-shift
multiplier theorem strong enough to reach `n=0`.
