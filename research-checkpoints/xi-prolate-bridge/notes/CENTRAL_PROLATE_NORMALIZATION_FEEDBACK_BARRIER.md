# Central-to-prolate normalization and the screened-feedback barrier

## 0. Exact outcome and claim boundary

There are two different scalars called `p_mu` in the preceding response
notes.  With the central anchor `e_0=V_0`, the shifted quotient uses the
central coefficient

\[
 c_\mu:=\langle e_0,\Phi_\mu\rangle=\xi_0.       \tag{0.1}
\]

With the unit projected prolate anchor `kappa`, the capture-free physical
response instead uses

\[
 a_\mu:=\langle\kappa,\Phi_\mu\rangle.           \tag{0.2}
\]

Here `Phi_mu` is the boundary-normalized simple even ground.  Whenever
`a_mu!=0`, put

\[
 x_\mu={\Phi_\mu\over a_\mu},\qquad
 x_{0,\mu}=\langle e_0,x_\mu\rangle={c_\mu\over a_\mu},
 \qquad \kappa_0=\langle e_0,\kappa\rangle.       \tag{0.3}
\]

The screened-feedback identity of the frozen checkpoint gives exactly

\[
 \boxed{
  1-\gamma_{\rm fb}={\kappa_0\over x_{0,\mu}},
  \qquad
  {x_{0,\mu}\over\kappa_0}={1\over1-\gamma_{\rm fb}}.}       \tag{0.4}
\]

On every admitted projected-prolate schedule used below,

\[
 \sqrt L\,\kappa_0\longrightarrow
 K_\infty:={\Xi(0)\over4a_\infty}>0.             \tag{0.5}
\]

Consequently the central-to-prolate normalization bridge is not an
additional unidentified overlap theorem.  It is precisely

\[
 \boxed{
 \sqrt L\,{c_\mu\over a_\mu}\longrightarrow K_\infty
 \quad\Longleftrightarrow\quad
 {x_{0,\mu}\over\kappa_0}\longrightarrow1
 \quad\Longleftrightarrow\quad
 \gamma_{\rm fb}\longrightarrow0.}              \tag{0.6}
\]

This is substantially stronger than the admitted subpolynomial feedback
reserve `|1-gamma_fb|^(-1)=lambda^(o(1))`.  No frozen theorem proves
`gamma_fb->0` for the actual arithmetic matrix.

There is also a determinant form.  If `B_0` and `B_kappa` are the shifted
even-ground compressions to `e_0^perp` and `kappa^perp`, respectively, then

\[
 \boxed{
 \left|{a_\mu\over c_\mu}\right|^2
 ={\det B_\kappa\over\det B_0},
 \qquad
 \left|\sqrt L\,{c_\mu\over a_\mu}\right|^2
 ={L\det B_0\over\det B_\kappa}.}                \tag{0.7}
\]

Thus the missing limit is equivalently a relative principal-compression
determinant asymptotic, together with its real orientation.  Qualitative
positivity of both compressions only makes the ratio finite and positive;
it gives no asymptotic comparison.

Finally, an exact source-Cauchy countermodel uses the actual locked
projected-prolate anchors themselves.  It has a simple even ground, a
strict odd block, a strict `kappa`-complement, a two-vector Ritz plane which
contains the ground exactly, and an arbitrarily small Rayleigh scale.  On
every infinite nonzero-overlap subsequence it nevertheless has

\[
 \gamma_{\rm fb}\longrightarrow1,                \tag{0.8}
\]

not zero.  The model is not the prime-power/archimedean matrix and does not
satisfy the actual RH zero functional.  It proves only that projected
prolate convergence, the exact source-Cauchy algebra, qualitative strict
signs, and a small scalar upper shift do not imply (0.6).

Checkpoint 1.38 supplies only the auxiliary `mu=0` central-normalized
square-free product.  It proves neither the shift from that auxiliary
functional to the actual ground profile nor (0.6).  This note proves no
actual central-profile convergence, no actual prolate-normalized response
convergence or decay, no zero-simplicity theorem, no new zeta-zero
statement, no RH proof or converse, and no de Bruijn--Newman `Lambda`
bound.  The checkpoint-1.38 standard eight are unchanged and the project
state remains `P0_INVALIDATED`.

## 1. Frozen inputs

Only the following frozen repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/RH_ZERO_GAUSSIAN_SQUARE_FREE_LIMIT_THEOREM.md` | `6622d6ee81f08daef596850ecd4dfbb071c5a2a087e083ee5f68a5bc1b211742` |
| `tests/test_rh_zero_gaussian_square_free_limit_theorem.py` | `680c2ad7ebef01683b218d4f2e4693047d01a0452346fe89b8277f7bd31c84fb` |
| `notes/SCREENED_FEEDBACK_ORIGIN_COLLAPSE.md` | `6195660a2fb34051610b579a5b0e88f4721e8d5385e436541c055d212e3d9f79` |
| `tests/test_screened_feedback_origin_collapse.py` | `b7a23289c94da48f389dd8d6b4cd35c5dc9ed31cccf19d091aff63003ce70f00` |
| `notes/SAME_ANCHOR_ENDPOINT_RATE_ATTACK.md` | `9324d758eca900f646eb5a6187cb5f316ece99b64ec77d7da2eb72cc7c7ff4a4` |
| `tests/test_same_anchor_endpoint_rate_attack.py` | `dd63d4a84cbd8330893c11d273648435f57ee858ebd06231e7b3ad811a5712fb` |

The first pair fixes the auxiliary square-free limit and its warning that
the central coefficient is not the prolate overlap.  The second pair fixes
the exact screened-feedback collapse, including complex conjugation
conventions and the projected-anchor origin limit.  The last pair fixes the
same-anchor endpoint estimate on the locked exponential schedule.  No zero
table, numerical eigenvector, cached arithmetic matrix, new source paper,
or global Weil positivity assertion is imported.

## 2. Coordinate and transform identities

Put

\[
 L=2\log\lambda,
 \qquad
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},
 \qquad -L/2\leq t\leq L/2.                      \tag{2.1}
\]

The Fourier transform is

\[
 \widehat f(z)=\int_{-L/2}^{L/2}f(t)e^{-izt}\,dt.             \tag{2.2}
\]

In particular,

\[
 \widehat f(0)=\sqrt L\,\langle e_0,f\rangle.    \tag{2.3}
\]

The boundary vector is

\[
 \eta=\sum_{|n|\leq N}V_n.                       \tag{2.4}
\]

Every centered mode has the same right-endpoint value,

\[
 V_n(L/2)=L^{-1/2},
 \qquad
 \langle\eta,f\rangle=\sqrt L\,f(L/2).          \tag{2.5}
\]

The phase `(-1)^n` in (2.1) is essential for (2.5).  The origin coefficient
`<e_0,f>` and the boundary sum `<eta,f>` are different functionals.

Let the boundary-normalized actual ground satisfy

\[
 (Q_+-\mu I)\Phi_\mu=0,
 \qquad \langle\eta,\Phi_\mu\rangle=1.           \tag{2.6}
\]

Assume the finite gates of the screened-feedback theorem, in particular a
simple even ground, `Q_--mu*I>0`, `c_mu!=0`, `kappa_0!=0`, and
`a_mu!=0`.  Definitions (0.1)--(0.3) and (2.3) give

\[
 \widehat x_\mu(0)=\sqrt L\,{c_\mu\over a_\mu}.  \tag{2.7}
\]

Thus the sought normalization ratio is exactly one value of the
coefficient-normalized actual ground transform.  It is not obtained from
the boundary normalization in (2.6).

### Theorem 2.1 (feedback equivalence)

Under the preceding finite gates, (0.4) holds.  Along any schedule on which
(0.5) holds, the three limits in (0.6) are equivalent.

**Proof.**  The frozen feedback theorem gives
`1-gamma_fb=kappa_0/x_(0,mu)`.  Hence

\[
 \sqrt L\,{c_\mu\over a_\mu}
 ={\sqrt L\,\kappa_0\over1-\gamma_{\rm fb}}.     \tag{2.8}
\]

The numerator tends to the positive number `K_infinity`.  Therefore the
left side tends to `K_infinity` exactly when
`1-gamma_fb` tends to one, equivalently when `gamma_fb` tends to zero.
This is also equivalent to the middle ratio in (0.6).  \(\square\)

For example, if `|gamma_fb|<=rho<1`, (2.8) gives the quantitative bound

\[
 \left|\sqrt L\,{c_\mu\over a_\mu}-K_\infty\right|
 \leq
 \left|\sqrt L\,\kappa_0-K_\infty\right|
 +{|\sqrt L\,\kappa_0|\,|\gamma_{\rm fb}|\over1-\rho}.       \tag{2.9}
\]

No such vanishing bound for the actual `gamma_fb` is presently known.
The frozen subpolynomial estimate controls only the reciprocal size of
`1-gamma_fb`; it permits `gamma_fb` to tend to one, a nonzero constant, or
to oscillate.

## 3. Principal-compression determinant form

Put

\[
 T_+=Q_+-\mu I,
 \qquad O_\mu=Q_--\mu I,
 \qquad C=\operatorname {adj}(T_+).               \tag{3.1}
\]

The source relative-determinant identity gives

\[
 C e_0=(\det O_\mu)\Phi_\mu.                     \tag{3.2}
\]

Let

\[
 B_0=P_{e_0^\perp}T_+|_{e_0^\perp},
 \qquad
 B_\kappa=P_{\kappa^\perp}T_+|_{\kappa^\perp}. \tag{3.3}
\]

Both are positive definite under the finite gates.  A principal
compression determinant is the corresponding adjugate quadratic form.
Equations (3.2)--(3.3) therefore give

\[
 \det B_0
 =\langle e_0,Ce_0\rangle
 =(\det O_\mu)c_\mu,                              \tag{3.4}
\]

\[
 \langle\kappa,Ce_0\rangle
 =(\det O_\mu)a_\mu,                             \tag{3.5}
\]

and the rank-one Hermitian cofactor identity gives

\[
 \det B_\kappa
 =\langle\kappa,C\kappa\rangle
 ={(\det O_\mu)|a_\mu|^2\over c_\mu}.          \tag{3.6}
\]

Dividing (3.5) by (3.4) retains the real orientation,

\[
 {a_\mu\over c_\mu}
 ={\langle\kappa,Ce_0\rangle
    \over\langle e_0,Ce_0\rangle}.              \tag{3.7}
\]

Dividing (3.6) by (3.4) proves (0.7).

In the checkpoint-1.37 cardinal basis, `M_mu` is the odd block and
`H_mu=D B_0D`, where `D=diag(1,...,N)`.  Hence

\[
 {\det H_\mu\over(N!)^2\det M_\mu}
 ={\det B_0\over\det O_\mu}
 =c_\mu.                                         \tag{3.8}
\]

This is the exact meeting point of the Gaussian determinant normalization
and the central ground coefficient.  Replacing `e_0` by `kappa` changes the
principal compression from `B_0` to `B_kappa`; it is not a harmless change
of notation.

Combining (0.4) and (0.7) also gives

\[
 |1-\gamma_{\rm fb}|^2
 =|\kappa_0|^2{\det B_\kappa\over\det B_0}.      \tag{3.9}
\]

Thus strict positivity supplies only `1-gamma_fb!=0`.  The required limit
`gamma_fb->0` is the relative determinant asymptotic

\[
 |\kappa_0|^2{\det B_\kappa\over\det B_0}
 \longrightarrow1                                \tag{3.10}
\]

together with the orientation in (3.7).

## 4. Conditional square-free response transport

Let `mathcal A_mu` be the actual shifted source profile and put

\[
 r={zL\over2\pi},
 \qquad
 K_L(z)={2\sin(zL/2)\over z\sqrt L}.             \tag{4.1}
\]

The central-normalized actual profile is

\[
 \mathcal B_{\mu,L}(z)
 ={K_L(z)\over\sqrt L}
   {\mathcal A_\mu(r)\over c_\mu}
 ={\widehat\Phi_\mu(z)\over\sqrt L\,c_\mu},
 \qquad \mathcal B_{\mu,L}(0)=1.                \tag{4.2}
\]

The coefficient-normalized actual ground and the capture-free dangerous
response obey the exact identities

\[
 \boxed{
 \widehat x_\mu(z)
 ={\sqrt L\,\kappa_0\over1-\gamma_{\rm fb}}
     \mathcal B_{\mu,L}(z),
 \qquad
 \mathfrak R_\lambda(z)
 =\widehat\kappa(z)-\widehat x_\mu(z).}          \tag{4.3}
\]

### Corollary 4.1 (normalization transfer is exactly feedback decay)

Suppose, as an additional premise not proved here, that on a common
schedule

\[
 \mathcal B_{\mu,L}(z)\longrightarrow P(z)       \tag{4.4}
\]

locally uniformly, where `P(0)=1`.  Then

\[
 \widehat x_\mu(z)\longrightarrow K_\infty P(z) \tag{4.5}
\]

locally uniformly if and only if `gamma_fb->0`.

**Proof.**  Sufficiency follows from (0.5), (4.3), and (4.4).  Necessity
follows by evaluating (4.5) at zero and using `P(0)=1`.  \(\square\)

Checkpoint 1.38 proves (4.4) only for the auxiliary `mu=0` Gaussian
functional, with

\[
 P(z)=P_{\rm sf}(z)
 =\prod_{\gamma\in\mathcal Z_+^\sharp}
      \left(1-{z^2\over\gamma^2}\right).         \tag{4.6}
\]

It does not prove (4.4) for the actual shifted ground.  Even if a future
localized multi-Uvarov theorem supplies that shift, Corollary 4.1 shows
that `gamma_fb->0` remains exactly the normalization gate.

The projected prolate transform separately satisfies

\[
 \widehat\kappa(z)\longrightarrow
 {\Xi(z)\over4a_\infty}
 =K_\infty{\Xi(z)\over\Xi(0)}.                  \tag{4.7}
\]

Consequently, if both unproved premises (4.4) with `P=P_sf` and
`gamma_fb->0` held, then (4.3) would give the conditional limit

\[
 \mathfrak R_\lambda(z)\longrightarrow
 K_\infty\left\{{\Xi(z)\over\Xi(0)}-P_{\rm sf}(z)\right\}.  \tag{4.8}
\]

Thus normalization transfer alone would not prove response decay.  Under
RH the right side of (4.8) vanishes exactly when all positive critical
zeros are simple.  Neither premise of (4.8), zero simplicity, nor response
decay is proved here.

## 5. Same-prolate-anchor source-Cauchy barrier

This section uses a different locked schedule solely for a structural
nonimplication.  Take the half-integer exponential schedule of the frozen
same-anchor endpoint theorem, let `kappa_L` be its actual unit projected
source-normalized prolate anchor, and put

\[
 d_L=2N_L+1,
 \qquad
 s_L=\langle\kappa_L,\eta_L\rangle,
 \qquad
 \eta_L=\sum_{|n|\leq N_L}V_n.                  \tag{5.1}
\]

The source data and anchors in this section are real.  Thus the two orders
of the overlap in (5.1) agree; no complex conjugation is being suppressed.

The centered endpoint convention (2.5) gives exactly

\[
 s_L={\sqrt L\,p_{\lambda,N}(L/2)
             \over\|p_{\lambda,N}\|}.           \tag{5.2}
\]

It is important not to infer a bound for `s_L` merely from the normalized
endpoint angle `|s_L|/sqrt(d_L)`.  Instead, equations (2.10), (2.17), and
the eventual norm lower bound in the frozen same-anchor theorem give

\[
 |s_L|
 \leq {\sqrt L\{B_{\rm tr}(\lambda)
                    +B_{\rm proj}(\lambda,N)\}
            \over A_L}
 \longrightarrow0,                               \tag{5.3}
\]

where `A_L` is bounded away from zero.  On that schedule both displayed
endpoint bounds decay faster than every inverse power needed here.

For an arbitrary scalar `epsilon_L>0`, define on the same raw source modes

\[
 \boxed{
 Q_L=\epsilon_L
 \left(I-{1\over d_L}|\eta_L\rangle\langle\eta_L|\right).}   \tag{5.4}
\]

This is an exact real inversion-symmetric source-Cauchy matrix.  Its source
parameters are

\[
 b_{n,L}=-{\epsilon_L n\over d_L},
 \qquad
 a_{n,L}^{\rm src}=\epsilon_L\left(1-{1\over d_L}\right),   \tag{5.5}
\]

because, for `n!=m`,

\[
 {b_{n,L}-b_{m,L}\over n-m}=-{\epsilon_L\over d_L}
 =(Q_L)_{nm}.                                     \tag{5.6}
\]

Its unit ground and boundary-normalized ground are

\[
 g_L={\eta_L\over\sqrt {d_L}},
 \qquad
 \mu_L=0,
 \qquad
 \Phi_L={\eta_L\over d_L}.                      \tag{5.7}
\]

The ground is simple and inversion even, while

\[
 (Q_L)_-=\epsilon_L I_N.                         \tag{5.8}
\]

Assume first that `s_L!=0`, and put

\[
 \alpha_L=\langle g_L,\kappa_L\rangle
 ={s_L\over\sqrt {d_L}}.                        \tag{5.9}
\]

On `kappa_L^perp`, the compressed matrix is

\[
 \epsilon_L
 \left(I-|P_{\kappa_L^\perp}g_L\rangle
             \langle P_{\kappa_L^\perp}g_L|\right),          \tag{5.10}
\]

so its exact floor is

\[
 \boxed{
 \lambda_{\min}(B_{\kappa_L})
 =\epsilon_L|\alpha_L|^2
 ={\epsilon_L|s_L|^2\over d_L}>0.}              \tag{5.11}
\]

The Rayleigh value is

\[
 q_L=\epsilon_L(1-|\alpha_L|^2)\leq\epsilon_L.  \tag{5.12}
\]

Moreover,

\[
 (Q_L-q_LI)\kappa_L
 =\epsilon_L\{|\alpha_L|^2\kappa_L-\alpha_Lg_L\}.           \tag{5.13}
\]

When `alpha_L!=0`, equations (5.9) and (5.13) show that the two-vector Ritz
plane generated by `kappa_L` and its residual contains `g_L`.  Its lower
Ritz value is therefore exactly

\[
 u_L=\mu_L=0.                                     \tag{5.14}
\]

Thus the odd and even shifted signs at the exact Ritz value are strict.
The scalar `epsilon_L` may be chosen below any prescribed positive upper
scale, so smallness of `q_L` does not repair the normalization.

For (5.7), the two normalizations are

\[
 c_L=\langle e_0,\Phi_L\rangle={1\over d_L},
 \qquad
 a_L=\langle\kappa_L,\Phi_L\rangle={s_L\over d_L}.            \tag{5.15}
\]

Consequently

\[
 x_{0,L}={1\over s_L},
 \qquad
 1-\gamma_{{\rm fb},L}=\kappa_{0,L}s_L.          \tag{5.16}
\]

The same projected-prolate anchors satisfy
`sqrt(L)*kappa_(0,L)->K_infinity`, while (5.3) gives `s_L->0`.  Hence on
every infinite subsequence on which `s_L!=0`, every finite strict gate
above passes but

\[
 \boxed{
 1-\gamma_{{\rm fb},L}\longrightarrow0,
 \qquad
 \gamma_{{\rm fb},L}\longrightarrow1.}          \tag{5.17}
\]

If instead `s_L=0` at infinitely many indices, then
`<kappa_L,Phi_L>=0` there and the prolate normalization is undefined.  The
`kappa`-complement floor in (5.11) is also zero on that branch, so those
indices are not falsely advertised as strict passes.  This gives the exact
dichotomy:

1. infinitely many zero overlaps make the desired normalization unavailable;
2. every infinite nonzero-overlap subsequence passes the qualitative finite
   signs but has the wrong feedback limit (5.17).

The construction uses the actual prolate anchors only as comparison
vectors.  The matrices (5.4) are the favorable uniform source-Cauchy
family, not the actual pole--archimedean--minus-prime matrices.  Their
strict floor in (5.11) is allowed to collapse, and they do not carry the
actual RH zero measure.  Therefore (5.17) is a strict structural
nonimplication, not an actual-arithmetic counterexample.

## 6. Exact stopping line

The central-to-prolate scale can now be stated without an overloaded
`p_mu`:

\[
 \boxed{
 \hbox{central scale }c_\mu
 \xrightarrow[\text{prolate normalization}]{}
 a_\mu
 \quad\text{requires exactly}\quad
 \gamma_{\rm fb}\to0.}                           \tag{6.1}
\]

There are three equivalent ways to attack it:

1. prove the origin-coordinate alignment
   `x_(0,mu)/kappa_0->1`;
2. prove the screened-feedback decay `gamma_fb->0`; or
3. prove the oriented relative-compression determinant asymptotic
   (3.10) together with (3.7).

Full projective ground alignment at rate

\[
 \|x_\mu-\kappa\|=o(L^{-1/2})                    \tag{6.2}
\]

is sufficient by Cauchy--Schwarz, but it is stronger than necessary.  No
admitted theorem proves even the single-coordinate consequence in (0.6).
The existing feedback reserve, mixed-projector formulas, Ritz bounds,
strict shifted signs, prolate transform convergence, and auxiliary
square-free Gaussian limit do not supply it.

Any downstream use must reject a claimed pass if it

1. identifies `c_mu` with `a_mu` or uses the same symbol without declaring
   the anchor;
2. drops the factor `sqrt(L)` in (0.6), (2.7), or (4.3);
3. replaces `gamma_fb->0` by nonvanishing of `1-gamma_fb` or by its
   subpolynomial reciprocal bound;
4. infers the signed ratio (3.7) from the unsigned determinant ratio (0.7);
5. applies the auxiliary `mu=0` limit directly to the actual shifted profile;
6. infers response decay from normalization transfer without accounting for
   the square-free/multiplicity difference in (4.8);
7. infers a bound for the boundary sum `s_L` from the normalized endpoint
   angle alone, rather than using (5.2)--(5.3);
8. calls (5.4) the actual prime-power or RH-zero matrix, or retains its
   strict label on the zero-overlap branch; or
9. promotes the equivalence or barrier to actual response convergence,
   zero simplicity, RH, a converse from RH, a `Lambda` bound, or a change in
   the formal state.

## 7. Reproduction and self-audit

Run

    python3 -B -m unittest \
      tests.test_central_prolate_normalization_feedback_barrier -v

The focused regression checks all frozen hashes, the exact normalization
and feedback algebra, the principal-compression determinant ratio, the
source row in (5.5), the simple ground, odd block, exact Ritz capture,
strict complement floor, boundary/origin conventions, the zero-overlap
dichotomy, displayed TeX, ASCII hygiene, and the fail-closed claim boundary.

This package adds only this note and its focused regression.  It changes no
standard-eight file, source lock, replay artifact, formal-status file, or
Git state.
