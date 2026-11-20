# Growing-transition complete-central Plemelj--Cauchy bulk floor

## 0. Result, hypothesis, and fail-closed boundary

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 c=2\pi\lambda^2,\qquad a_j={\alpha_j\over c}.
                                                               \tag{0.1}
\]

This note isolates one theorem which is both useful and genuinely proved:
**conditional on the complete Plemelj assembly hypothesis `PA` in Section 4
and the explicitly unvendored Hilbert-matrix input `EH` in Section 7**, the
log-singular bulk block on labels `alpha_j>=alpha_0` has the cutoff-uniform
floor

\[
 \boxed{
  \mathcal P_{\rm sing,bulk}
  \succeq
  \left\{1-{8\over9}e^{10/\alpha_0}\right\}D_{\rm bulk}.}
                                                               \tag{0.2}
\]

Thus the right side is strictly positive when

\[
 \alpha_0>{10\over\log(9/8)}
 =84.9018701570376\ldots,                                    \tag{0.3}
\]

and it is at least `0.1 D_bulk` when

\[
 \alpha_0\ge {10\over\log(81/80)}
 =804.989647926627\ldots.                                    \tag{0.4}
\]

For the project choice `alpha_0=(log L)^4`, (0.4) holds once

\[
 \log L\ge5.32656920412319\ldots,
 \qquad L\ge205.730941142233\ldots.                          \tag{0.5}
\]

The limiting certified floor is `1/9`.  The estimate is independent of the
number of retained labels, the upper cutoff, and the carrier parameter
`x>=0`.

The qualification in the first paragraph is essential.  The present frozen
repository does **not** yet prove `PA`: it has not assembled the retained
one-sided trace rows and the logarithmic bulk across all physical
sampler/divisor/reflected branches with identity coefficient exactly `+1`.
Nor does this note control the regular kernel, the Weber edge
`alpha<alpha_0`, edge--bulk or anchor crosses, or the singleton/`P_0` Schur
short.  Consequently (0.2) is **not** a lower bound for `Q_X`, does not
preserve the equality conductor, and proves no fixed floor for the complete
central form.  The project state remains `P0_INVALIDATED`.

## 1. Frozen repository inputs and external status

The following repository inputs are byte-frozen for this package.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md` | `1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c` |
| `notes/GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md` | `3bd3bf977178be94e91b7c6603db9df7f861f1cfe498bef303c210e9b87b9ec5` |
| `notes/NEAR_SIGNED_HANKEL_REDUCTION.md` | `fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |

One external source is used:

> Emmanuel Preissmann and Olivier Leveque, *On Generalized Weighted Hilbert
> Matrices*, arXiv:1303.1085v1, especially Sections 2.4 and 3.1.

The arXiv paper states the generalized weighted Hilbert definitions, records
Preissmann's earlier `4 pi/3` bound in Section 2.4, and proves the
entrywise-magnitude norm monotonicity as Theorem 1.  The arXiv bytes and the
1984 source of the `4 pi/3` estimate are **not vendored, not hashed, and not
source-locked in this repository**.  Section 7 therefore labels their use
`EH`; the theorem fails closed if that external input is not admitted.

The source URL is
<https://arxiv.org/abs/1303.1085>.  No numerical experiment in the matching
test substitutes for `EH`.

## 2. The actual one-sided trace and both boundary rows

Let `C` be the hard central cut on `[-ell,ell]` in logarithmic coordinates.
For a global even radical `K_f`, put `X_f=CK_f` and `O_f=(1-C)K_f`.  At the
right boundary use the inward and outward profiles

\[
 \begin{aligned}
 A_f(s)&=X_f(\ell-s),&0\le s\le L,\\
 B_f(t)&=O_f(\ell+t),&t\ge0,\\
 a_f(s)&=e^{s/2}\overline{A_f(s)},&
 b_f(t)&=e^{t/2}B_f(t).
 \end{aligned}                                               \tag{2.1}
\]

Equal inversion parity folds the two physical boundaries to

\[
 \Omega_{jk}(r)=2(a_j*b_k)(r).                               \tag{2.2}
\]

The **inward one-sided trace** in the derivative of this convolution is the
relevant trace, not the midpoint value of the hard cut.  On the locked nonintegral
schedule `A=lambda^2=p^2/4`, the corrected time-limited source gives

\[
 \boxed{
 \begin{aligned}
 \Gamma_{\rm in}(f)
  &=\lim_{s\downarrow0}A_f(s)
    ={\sqrt\lambda\over2}f(\lambda)
     +{1\over2\sqrt\lambda}
       \sum_{1\le n<\lambda^2}f(n/\lambda),\\
 \Gamma_{\rm out}(f)
  &=\lim_{t\downarrow0}B_f(t)
    ={1\over2\sqrt\lambda}
       \sum_{1\le n<\lambda^2}f(n/\lambda).
 \end{aligned}}                                               \tag{2.3}
\]

The midpoint convention would put `sqrt(lambda)f(lambda)/4` in the first
line and is wrong for the distributional derivative.  The existing endpoint
shear `f(lambda)=0` only makes `Gamma_in=Gamma_out`; it does not make this
sampler trace vanish.

Retain the complete normalized Chebyshev-error distribution `delta_*`.  The
oriented central--outer form has the exact sign

\[
 I_{jk}=\int_0^\infty
       \delta_*(r)\{\Omega'_{jk}(r)-\Omega_{jk}(r)\}\,dr.
                                                               \tag{2.4}
\]

Taking the distributional derivative of `a_j 1_[0,L]` gives both endpoint
rows:

\[
\boxed{
\begin{aligned}
 I_{jk}
 &=2a_j(0)\langle\delta_*,b_k\rangle\\
 &\quad+2\int_0^L\{a'_j(s)-a_j(s)\}
       \left\{\int_0^\infty\delta_*(s+t)b_k(t)\,dt\right\}ds\\
 &\quad-2a_j(L)\langle\delta_*(L+\cdot),b_k\rangle.
\end{aligned}}                                                \tag{2.5}
\]

Here

\[
 a_j(0)=\overline{\Gamma_{{\rm in},j}},\qquad
 a_j(L)=\lambda\overline{\Gamma_{{\rm in},j}}               \tag{2.6}
\]

by even inversion.  If

\[
 \beta_h(k)=\langle\delta_*(h+\cdot),b_k\rangle,
 \qquad r=\beta_0-\lambda\beta_L,                            \tag{2.7}
\]

then the two oriented endpoint rows in (2.5) are exactly
`2 Gamma_in^* r`.  Their Hermitian part is

\[
 \Gamma_{\rm in}^*r+r^*\Gamma_{\rm in},                     \tag{2.8}
\]

of rank at most two.  It is generically indefinite when the two rows are not
proportional.  It must not be discarded, bounded separately by absolute
values, or identified with the already-used `f(lambda)` shear row.

For reference, in physical source variables the retained row is

\[
 \beta_h(f)={1\over2\sqrt\lambda}
 \sum_{n\ge1}\int_0^\infty
 \delta_*(h+t)f\!\left({ne^{-t}\over\lambda}\right)\,dt
 ={1\over2\sqrt\lambda}\sum_{n\ge1}\int_\lambda^\infty
 \delta_*\!\left(h+\log{u\over\lambda}\right)
 f(n/u)\,{du\over u}.                                        \tag{2.9}
\]

with the same multiplicative-sampler convention as the complete central
reduction.  It follows directly from
`b_f(t)=(2sqrt(lambda))^(-1) sum_n f(ne^(-t)/lambda)`.
The sum and integral have the same ordered Abel/Fejer meaning as (2.4); no
unjustified absolute interchange is asserted.  Formula (2.9) records that
the trace row is a genuine sampler row; no proportionality to `f(lambda)`
is asserted.

## 3. Exact logarithmic boundary--bulk completion

At the singular endpoint

\[
 \delta_*(r)=-{1\over2}\log r+O(1),\qquad
 \delta_0(r):=-{1\over2}\log r.                             \tag{3.1}
\]

The singular principal is the derivative term in (2.4), with its first
boundary row retained.  Since `Omega(0)=0`, Abel or Fejer regularization and
integration by parts give the exact identity

\[
\boxed{
 \int_0^\infty\delta_0(r)\Omega'_{jk}(r)\,dr
 =\int_0^\infty\!\int_0^\infty
   {a_j(s)b_k(t)\over s+t}\,ds\,dt.}                         \tag{3.2}
\]

Equivalently, the left side is the **combined** expression

\[
 2a_j(0)\langle\delta_0,b_k\rangle
 +2\int_0^L a'_j(s)
       \left\{\int_0^\infty\delta_0(s+t)b_k(t)\,dt\right\}ds
 -2a_j(L)\langle\delta_0(L+\cdot),b_k\rangle.                \tag{3.3}
\]

The first row in (3.3) supplies the Plemelj diagonal.  Deleting it turns the
principal into a branch-only off-diagonal calculation and loses the
identity term.  The last row has no `s+t=0` singularity and travels with the
regular endpoint remainder, but its sign in the original form remains the
minus sign displayed above.

The normalization and sign can be checked without asymptotics.  On the
half-line let `a(s)=e^(-ps)`, `b(t)=e^(-qt)`, with `p,q>0`.  Writing

\[
 \mathcal L(z)=\int_0^\infty e^{-zr}\log r\,dr
              ={ -\gamma-\log z\over z},                    \tag{3.4}
\]

one obtains

\[
\boxed{
 2a(0)\langle\delta_0,b\rangle
 +2\langle a',H_{\delta_0}b\rangle
 ={\log(p/q)\over p-q},}                                    \tag{3.5}
\]

with continuous diagonal value `1/p`.  This is a positive Loewner divided
difference.  It is the elementary model for the Plemelj identity coefficient
`+1`, not an extra rank-one correction.

For bookkeeping only, integrating the complete kernel gives

\[
 k=-(d\delta_*+\delta_*\,dr)
   =e^{-r}d\psi(e^r)
    +\left\{{e^{-r}\over e^{2r}-1}-1\right\}dr.              \tag{3.6}
\]

Before the first prime atom,

\[
 k_{\rm cont}(r)={1\over2r}-2+{11\over12}r+O(r^2),
 \qquad 2k_{\rm cont}(r)={1\over r}-4+{11\over6}r+O(r^2).  \tag{3.7}
\]

The constant is `-4` in the quadratic kernel, not `-5/2`.  No estimate for
the regular term or the prime atoms is claimed here.

## 4. The missing complete Plemelj assembly hypothesis

The following is a theorem **input**, not a conclusion of this note.

**Hypothesis PA (complete physical Plemelj assembly).**  After combining all
physical sampler/divisor/reflected branches with the pole and Archimedean
terms, retaining both one-sided trace rows from (2.5), applying the actual
endpoint shear by congruence in the full source metric, and whitening by the
bulk part of `D_full`, the completed logarithmic singular principal on
`alpha_j>=alpha_0` is a positive direct integral and compression of the
fiber matrices

\[
 \mathcal P_x=I+iM_x,
 \qquad x\ge0,                                                \tag{4.1}
\]

where

\[
 (M_x)_{jj}=0,\qquad
 (M_x)_{jk}={C^L_{jk}S^x_{jk}\over\sigma_j-\sigma_k}
 \quad(j\ne k).                                               \tag{4.2}
\]

More precisely, Hypothesis PA includes a positive measure, synthesis maps,
and orientations in the two-element sign set for which

\[
 \mathcal P_{\rm sing,bulk}
 =\sum_{\varepsilon=\pm1}\int
 V_{x,\varepsilon}^*(I+i\varepsilon M_x)
 V_{x,\varepsilon}\,d\nu(x),\qquad
 D_{\rm bulk}=\sum_{\varepsilon=\pm1}\int
 V_{x,\varepsilon}^*V_{x,\varepsilon}\,d\nu(x).              \tag{4.3}
\]

The opposite orientation may replace `M_x` by `-M_x`; the estimate below is
unchanged.  Crucially, `PA` asserts that the two Plemelj half-contributions
and their retained boundary rows give the identity in (4.1) with coefficient exactly `+1`,
and that no other physical branch carries an unassembled
log-singular term of the same order.

Current frozen inputs prove neither that complete branch identification nor
the required metric whitening.  The `q=1` same-branch calculation alone is not `PA`.
Sections 5--7 prove only that **if** (4.1)--(4.2) are the complete
bulk singular fibers, then every such fiber has the stated uniform floor.

## 5. Exact normalized Loewner-to-Cauchy algebra

For `0<a<=1`, define

\[
 \begin{aligned}
 J(a)&=\int_0^{\pi/2}
       {d\theta\over\sqrt{\cos^2\theta+a\sin^2\theta}},\\
 F(a)&=2\int_0^{\pi/2}
 {\sqrt{\cos^2\theta+a\sin^2\theta}-\cos\theta
  \over\sin^2\theta}\,d\theta.
 \end{aligned}                                               \tag{5.1}
\]

Differentiation under the integral gives `F'(a)=J(a)`.  The positive
integral of affine square-root maps also shows that `F` is operator
monotone; hence its Loewner matrix is positive semidefinite.  Normalize it by

\[
 C^L_{jk}=
 \begin{cases}
 {F(a_j)-F(a_k)\over
  (a_j-a_k)\sqrt{J(a_j)J(a_k)}},&j\ne k,\\[4pt]
 1,&j=k.
 \end{cases}                                                 \tag{5.2}
\]

The subcritical action is

\[
 \sigma(a)=c\left\{1-{F(a)\over2}\right\}-{\pi\over4},
 \qquad
 \sigma_j-\sigma_k=-{c\over2}\{F(a_j)-F(a_k)\}.            \tag{5.3}
\]

For a fixed carrier coordinate `x>=0`, put

\[
 y_j=\sqrt{x^2+a_j},\qquad
 u_j=y_j^{1/2}=(x^2+a_j)^{1/4},\qquad
 S^x_{jk}={1\over2}\left({u_j\over u_k}+{u_k\over u_j}\right).
                                                               \tag{5.4}
\]

Since

\[
 S^x_{jk}={y_j+y_k\over2\sqrt{y_jy_k}},\qquad
 a_j-a_k=(y_j-y_k)(y_j+y_k),                                \tag{5.5}
\]

all non-Cauchy factors cancel exactly:

\[
\boxed{
 {C^L_{jk}S^x_{jk}\over\sigma_j-\sigma_k}
 =-{1\over c(y_j-y_k)\sqrt{y_jy_kJ(a_j)J(a_k)}}
 =-{\sqrt{w_jw_k}\over y_j-y_k},}                           \tag{5.6}
\]

where

\[
 w_j={1\over c\,y_jJ(a_j)}.                                \tag{5.7}
\]

Thus `M_x` is a real skew-symmetric generalized weighted Hilbert matrix and
`iM_x` is Hermitian.  No Schur-multiplier norm estimate is used: the
normalized Loewner factor and the Jost half-density have already collapsed
to the single Cauchy weight in (5.6).

## 6. BK gaps and uniform density variation

The locked same-phase Bohr--Kramers bracket is

\[
 \sigma_j=2\pi j+\varepsilon_j,\qquad
 |\varepsilon_j|<{\pi\over4}.                               \tag{6.1}
\]

Therefore adjacent retained labels satisfy

\[
 {3\pi\over2}<|\sigma_{j+1}-\sigma_j|<{5\pi\over2}.         \tag{6.2}
\]

In the `y` coordinate the absolute action density is

\[
 \rho_x(y)=\left|{d\sigma\over dy}\right|
           =c\,yJ(y^2-x^2),\qquad w_j={1\over\rho_x(y_j)}. \tag{6.3}
\]

Direct differentiation of (5.1) gives

\[
 -aJ'(a)={a\over2}\int_0^{\pi/2}
 {\sin^2\theta\,d\theta
  \over(\cos^2\theta+a\sin^2\theta)^{3/2}}
 \le {J(a)\over2},
 \qquad J(a)\ge{\pi\over2}.                                \tag{6.4}
\]

Because `y^2=x^2+a`, this implies

\[
 \left|{d\over da}\log\{yJ(a)\}\right|
 \le {1\over2y^2}+{1\over2a}\le {1\over a},               \tag{6.5}
\]

and, using `|d sigma/da|=cJ/2`,

\[
 \left|{d\over d\sigma}\log\rho_x\right|
 \le {2\over caJ(a)}
 \le {4\over\pi\alpha}.                                   \tag{6.6}
\]

On every action cell whose endpoint labels obey `alpha>=alpha_0`, (6.2) and
(6.6) yield

\[
 \max_{\rm cell}{\rho_x\over\rho_x(y_j)}
 \le\exp\left\{{4\over\pi\alpha_0}{5\pi\over2}\right\}
 =e^{10/\alpha_0}.                                          \tag{6.7}
\]

Let

\[
 \delta_j^y=\min_{k\ne j}|y_j-y_k|.                         \tag{6.8}
\]

The nearest point is adjacent in the ordered `y` grid.  Integrating (6.3)
over that cell and using (6.2), (6.7) gives

\[
 \delta_j^y\ge
 {3\pi/2\over\rho_x(y_j)e^{10/\alpha_0}},
 \qquad
 {w_j\over\delta_j^y}
 \le r_0:={2e^{10/\alpha_0}\over3\pi}.                    \tag{6.9}
\]

For an endpoint label there is only one adjacent cell and the same proof
applies; for a singleton matrix `M_x=0`.  Hence (6.9) is uniform in `x`, the
number of labels, and both hard ends of the retained bulk interval.

## 7. External weighted-Hilbert input and the floor

Write

\[
 B(y,d)_{jk}=
 \begin{cases}
 {d_jd_k\over y_j-y_k},&j\ne k,\\
 0,&j=k.
 \end{cases}                                                 \tag{7.1}
\]

**External input EH.**  The two facts admitted from the source described in
Section 1 are:

1. for `d_j=sqrt(delta_j^y)`, the Preissmann local-weight estimate recorded
   in Section 2.4 is

   \[
    \|B(y,\sqrt{\delta^y})\|\le {4\pi\over3};               \tag{7.2}
   \]

2. Theorem 1 of arXiv:1303.1085 gives spectral-norm monotonicity for
   generalized weighted Hilbert matrices when the absolute values of all
   entries decrease.

By (6.9), `w_j<=r_0 delta_j^y`.  Formula (5.6) and the monotonicity theorem
therefore compare `M_x` entrywise with
`r_0 B(y,sqrt(delta^y))`.  Equations (6.9) and (7.2) give

\[
 \boxed{
 \|M_x\|\le r_0{4\pi\over3}
 ={8\over9}e^{10/\alpha_0}.}                                \tag{7.3}
\]

Since `iM_x` is Hermitian,

\[
 I+iM_x\succeq
 \{1-\|M_x\|\}I
 \succeq\left\{1-{8\over9}e^{10/\alpha_0}\right\}I.      \tag{7.4}
\]

Positive direct integrals and compressions preserve (7.4), so `PA` turns it
into (0.2).  Solving the scalar inequalities in (7.4) gives exactly
(0.3)--(0.5).

The distinction between `4 pi/3` and the frozen Montgomery--Vaughan input is
decisive.  Replacing (7.2) by the repository-admitted local-weight constant
`3 pi/2` gives only

\[
 \|M_x\|\le r_0{3\pi\over2}=e^{10/\alpha_0}>1,              \tag{7.5}
\]

which supplies no positive floor for any finite `alpha_0`.  Thus this
package cannot honestly be declared source-locked until `EH` is vendored and
hash-pinned (or a repository proof with a constant strictly below `3 pi/2`
is supplied).

## 8. What remains open

This theorem package settles only the conditional singular bulk norm.  A
complete fixed central floor still requires all of the following:

1. prove `PA`, including the one-sided sampler trace in (2.3), both signs in
   (2.5), the `+1` Plemelj coefficient, and every physical divisor branch;
2. source-lock or internally prove `EH`;
3. estimate the prime-minus-main regular measure after the singular
   completion, without separating signs prematurely;
4. treat the Weber region `alpha<alpha_0`, the supercritical edge, and all
   edge--bulk and anchor crosses in the full metric;
5. perform the exact singleton/anchor Schur short required for the complete
   `Q_X` target.

Until these gates are closed, neither
`Q_X-E_eq >= -o(L)D_full` nor a fixed positive lower bound for complete
`Q_X` is asserted.  In particular, this conditional bulk theorem does not
alter any standard-eight claim or the state `P0_INVALIDATED`.
