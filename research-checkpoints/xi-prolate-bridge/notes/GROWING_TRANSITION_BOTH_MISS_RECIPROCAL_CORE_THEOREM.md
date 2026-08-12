# Growing-transition both-miss reciprocal-core theorem

## 0. Exact result and claim boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A .          \tag{0.1}
\]

This note resolves the sign and normalization of the equal-parameter,
first deterministic reciprocal alias in the fixed-product both-miss fold.
For one integer product `N>A`, put

\[
 y=\log(N/A),\qquad z=e^\rho,\qquad w=e^{y-\rho},
 \qquad zw={N\over A}.                                  \tag{0.2}
\]

Let `G_N` be the unrestricted divisor coefficient and `B_N(rho)` the
both-miss coefficient of the complete-central reduction.  On the exact
center region

\[
 \boxed{N<4A,\qquad z<2,\qquad w<2}                     \tag{0.3}
\]

one has

\[
 \boxed{B_N(\rho)=G_N-2\log N+\Lambda(N),\qquad
        G_N-B_N(\rho)=2\log N-\Lambda(N)>0.}            \tag{0.4}
\]

The reciprocal quartic point for every subcritical parameter lies strictly
inside (0.3).  If

\[
 r^2={\alpha\over c},\qquad 0<r\leq1,
 \qquad N_*=A(1+r),\qquad
 \rho_*={1\over2}\log(1+r),                             \tag{0.5}
\]

then `N_*<=2A` and `z_*=w_*=sqrt(1+r)<=sqrt(2)<2`.

For the positive first Fourier alias, the actual outgoing Bessel carriers
give the phase

\[
 \Phi=c\{T_r(x_1)+T_r(x_2)-z_1z_2\}-{\pi\over2},
 \qquad x_i=(z_i^2-1)^{1/2}.                            \tag{0.6}
\]

On the reciprocal stationary manifold `x_1x_2=r`, the exact Landen
identity gives

\[
 T_r(x_1)+T_r(x_2)-z_1z_2=-C(r).                       \tag{0.7}
\]

The transverse Hessian is negative.  At the symmetric quartic point its
nonzero eigenvalue is `-2c(1+r)`, so the clean transverse Maslov factor is
`exp(-i*pi/4)`.  With

\[
 \sigma(r)=cC(r)-{\pi\over4},                           \tag{0.8}
\]

the real reciprocal principal therefore has phase

\[
 \boxed{-cC(r)-{\pi\over2}-{\pi\over4}
        =-\sigma(r)-\pi,\qquad
        \cos\{-\sigma(r)-\pi\}=-\cos\sigma(r).}       \tag{0.9}
\]

Thus the unit reciprocal alias is negative on the locked Bohr--Kramers
branch.  This sign agrees with, and its normalization is fixed exactly by,
the paired-alias identity

\[
 \boxed{S_1:=\widehat K(1)+\widehat K(-1)
        =-{1\over4}\mathsf X}                           \tag{0.10}
\]

in raw exterior-defect-white prolate coordinates, where
`mathsf X=diag(chi_j)` and `0<chi_j<1` on the plus phase.  The Hermitian
part of one unilateral coefficient is `-mathsf X/8`.

The normalization connecting the fixed-product correlation to `K(N)` is

\[
 \boxed{
 \langle e,K(N)e\rangle
 ={2\over\sqrt N}\operatorname {Re}
   \int_0^y\phi_e(\rho)\overline{\phi_e(y-\rho)}\,d\rho.} \tag{0.11}
\]

Consequently the raw scalar `-2(G_N-B_N)/sqrt(N)` in the physical
correlation is `-(G_N-B_N)K(N)`.  Since

\[
 2\log N=2L+2\log(N/A),                                \tag{0.12}
\]

the exact constant component of the paired first alias is

\[
 \boxed{(-2L)S_1={L\over2}\mathsf X\succeq0.}          \tag{0.13}
\]

There is no action off-diagonal term in (0.13): the full even Fourier
compression is exactly diagonal in the raw prolate basis, even though the
values `chi_j` vary with `j`.  A common source-coordinate change carries
(0.13) by congruence and preserves positivity.

Every actual mask transition is ordinary.  Along the equal-parameter
reciprocal branch, writing `x=x_1`, `x_2=r/x`, and
`Z=z_1z_2`, the fixed-product second derivative is

\[
 \boxed{
 {d^2\over d\rho^2}\{T_r(x_1)+T_r(x_2)\}
 =-{(x^4-r^2)^2\over Zx^4r^2}.}                        \tag{0.14}
\]

It vanishes only at `x^2=r`, where `z_1=z_2=sqrt(1+r)<2`.
The first integer mask transition is `z_1=2`, hence `x=sqrt(3)`;
it is uniformly separated from the quartic point.  All later transitions
are farther away.

Equations (0.4), (0.9), (0.10), and (0.13) close the reciprocal **core
sign**.  They show why `+2B` must not be norm-bounded separately from
`-2G`: the two pieces cancel at divisor-conductor scale before the
remaining reciprocal principal becomes positive.

This note does **not** prove the complete physical Plemelj assembly `PA`.
It does not quantize the variable excess mask outside the center as a
positive operator, sum all ordinary transition shells, control unequal
actions, prove the raw prime-discrepancy estimate, or assemble the edge,
edge--bulk, endpoint-trace, Archimedean, pole, projection, and shear
remainders.  In particular, the positive `L mathsf X/2` term in (0.13) is
an internal component needed while proving `PA`; it may not be added again
after a putative Plemelj diagonal has already absorbed the conductor-scale
cancellations.  No full central floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or RH conclusion is claimed.  The formal project
state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The proof uses the following repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |
| `notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md` | `1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c` |
| `tests/test_growing_transition_subcritical_lg_action_bv_theorem.py` | `a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92` |
| `notes/GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md` | `3bd3bf977178be94e91b7c6603db9df7f861f1cfe498bef303c210e9b87b9ec5` |
| `tests/test_growing_transition_edge_edge_higher_alias_theorem.py` | `c7f6920d5253d31d3acc73c00412567294791c51d62c18291f8407a0ea53be2f` |
| `P2_SOURCE_LOCK.json` | `8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a` |

No external analytic theorem and no numerical prolate data are used for
the exact identities in Sections 2--6.  The optional short-interval scale
audit in Section 7 is explicitly conditional on its displayed estimate.

## 2. Exact center-mask arithmetic

For an ordered triple `m,l,n` with `mln=N`, the both-miss conditions are

\[
 n<A,\qquad m>z,\qquad l>w.                             \tag{2.1}
\]

Under (0.3), the last two inequalities are exactly `m,l>=2`.  Conversely,
if `m,l>=2`, then

\[
 n={N\over ml}\leq {N\over4}<A,                       \tag{2.2}
\]

so the first inequality follows.  Hence, for `q=N/n`, the number of
ordered both-miss factorizations `q=ml` is

\[
 b(q)=d(q)-2+\mathbf1_{q=1}.                            \tag{2.3}
\]

The correction at `q=1` is mandatory: there are zero admissible pairs,
whereas `d(1)-2=-1`.  Therefore

\[
\begin{aligned}
 B_N(\rho)
 &=\sum_{n\mid N}\Lambda(n)
   \{d(N/n)-2+\mathbf1_{n=N}\}\\
 &=G_N-2\sum_{n\mid N}\Lambda(n)+\Lambda(N)\\
 &=G_N-2\log N+\Lambda(N),                             \tag{2.4}
\end{aligned}
\]

which proves (0.4).  Since `0<=Lambda(N)<=log N`,

\[
 \log N\leq G_N-B_N(\rho)\leq2\log N.                \tag{2.5}
\]

More generally, away from (0.3) the both-miss triples remain a subset of
the triples with `m,l>=2`.  Thus the useful pointwise comparison

\[
 \boxed{G_N-B_N(\rho)\geq2\log N-\Lambda(N)}           \tag{2.6}
\]

holds wherever the fixed-product mask is defined.  Equation (2.6) is a
coefficient inequality only; this note does not promote its variable
excess to an operator inequality.

## 3. The pinned `K(N)` normalization

Let `T` be the positive-tail exterior-defect isometry

\[
 (Te)(v)=\sqrt{{2\lambda\over c}}
 {H_e(\lambda v/c)\over\sqrt{D(e)}},\qquad v\geq c,   \tag{3.1}
\]

and use the unitary inversion

\[
 (J_af)(v)={\sqrt a\over v}f(a/v).                     \tag{3.2}
\]

For `N>A`,

\[
 K(N)={1\over4\sqrt N}
 T^*P_{[c,2\pi N]}J_{2\pi cN}T.                       \tag{3.3}
\]

Put `v=ce^rho`.  Since `c=2*pi*A`, the reflected argument is

\[
 {2\pi cN\over v}=ce^{y-\rho}.                         \tag{3.4}
\]

The scalar outside the logarithmic integral is

\[
 {1\over4\sqrt N}\sqrt{2\pi cN}\,{2\lambda\over c}
 ={1\over2}.                                           \tag{3.5}
\]

On the other hand the exact Mellin tail is

\[
 \phi_e(s)={\sqrt\lambda\over2}e^{s/2}
 {H_e(\lambda e^s)\over\sqrt{D(e)}},                  \tag{3.6}
\]

so

\[
 \phi_e(\rho)\overline{\phi_e(y-\rho)}
 ={\sqrt N\over4}
 {H_e(\lambda e^\rho)
  \overline{H_e(\lambda e^{y-\rho})}\over D(e)}.     \tag{3.7}
\]

Equations (3.3)--(3.7) prove (0.11).  They also fix the factor in the
physical fold:

\[
 -{2(G_N-B_N)\over\sqrt N}\operatorname {Re}
 \int_0^y\phi(\rho)\overline{\phi(y-\rho)}\,d\rho
 =-(G_N-B_N)\langle e,K(N)e\rangle.                   \tag{3.8}
\]

There is no additional factor two in (3.8).

## 4. Exact Landen identity and phase orientation

For `0<r<=1`, define

\[
 T_r(x)=\int_0^x\sqrt{{v^2+r^2\over1+v^2}}\,dv,
 \qquad
 C(r)=E(\sqrt{1-r^2})-r^2K(\sqrt{1-r^2}).              \tag{4.1}
\]

If `x_2=r/x_1`, set `z_i=sqrt(1+x_i^2)`.  Direct
differentiation shows that

\[
 {d\over dx_1}\{T_r(x_1)+T_r(r/x_1)-z_1z_2\}=0.       \tag{4.2}
\]

As `x_1` tends to infinity, `T_r(r/x_1)` tends to zero and

\[
 \lim_{x\to\infty}\{x-T_r(x)\}=C(r),                 \tag{4.3}
\]

the last identity following from `v=cot(theta)` in the defining integral.
This proves (0.7).

The actual regular endpoint solution has the large Bessel carrier

\[
 J_0(cT_r(x))
 =\sqrt{{2\over\pi cT_r(x)}}
   \{\cos(cT_r(x)-\pi/4)+O((cT_r)^{-1})\}.             \tag{4.4}
\]

For `widehat K(+1)`, the Fourier kernel is `exp(-ivw/c)`, so the product
of the two positive outgoing branches has exactly the phase (0.6).  On
the reciprocal manifold, (0.7) gives

\[
 \Phi|_{\rm rec}=-cC(r)-{\pi\over2}.                  \tag{4.5}
\]

It is tempting to replace (4.4) by the completed action phase

\[
 \Theta_r(x)=c\{T_r(x)+C(r)\}-{\pi\over4}.             \tag{4.6}
\]

That replacement is valid only with its carrier coefficient:

\[
 e^{i(cT_r-\pi/4)}=e^{-icC(r)}e^{i\Theta_r}.           \tag{4.7}
\]

The product coefficient in (4.7) is `exp(-2icC)`.  Omitting it changes
the phase and can reverse the inferred sign.  Retaining it brings (4.6)
back to (4.5).

## 5. Hessian, Maslov factor, and quartic normal form

Write `t_i=log z_i` and

\[
 F(t_1,t_2)=T_r(x_1)+T_r(x_2)-z_1z_2.                  \tag{5.1}
\]

Its stationary equations are

\[
 {dT_r(x_i)\over dt_i}=z_1z_2.                         \tag{5.2}
\]

Squaring (5.2) gives exactly `x_1x_2=r`.  At the symmetric point
`x_1=x_2=sqrt(r)`, `z_1=z_2=sqrt(1+r)`, the Hessian is

\[
 \nabla^2F=-(1+r)
 \begin{pmatrix}1&1\\1&1\end{pmatrix}.               \tag{5.3}
\]

Its eigenvalues are `0` and `-2(1+r)`.  Thus the phase `cF` has one clean
stationary direction and one negative transverse direction, proving the
Maslov factor used in (0.9).

For reference, let

\[
 t_1={1\over2}\log(1+r)+{d\over2}+\tau,\qquad
 t_2={1\over2}\log(1+r)+{d\over2}-\tau.               \tag{5.4}
\]

Then the reciprocal curve is `d=2tau^2/r+O(tau^4)`, and

\[
 c\{F+C(r)\}
 =-{c(1+r)\over2}\left(d-{2\tau^2\over r}\right)^2
  +O\{c(|d|+\tau^2)^3\}.                               \tag{5.5}
\]

At fixed `d=0`, (5.5) is the apparent quartic

\[
 -{2c(1+r)\over r^2}\tau^4.                            \tag{5.6}
\]

In the two-variable alias it is a clean Morse--Bott phase, not an
isolated two-dimensional quartic.  The `h=+1` and `h=-1` terms are
conjugate and have the same real sign (0.9).

The Bohr--Kramers bracket

\[
 \sigma_j=2\pi j+\varepsilon_j,\qquad
 |\varepsilon_j|<\pi/4                                 \tag{5.7}
\]

implies `cos(sigma_j)>0`; hence (0.9) is negative.  The exact identity
(0.10), rather than a stationary-phase approximation, pins its full
`D`-white magnitude.

## 6. Exact diagonal normalization and physical sign

For the paired alias, the cutoff-preserving Fourier calculation gives

\[
 S_1={1\over4}T^*(\mathcal F_++\mathcal F_+^*)T.       \tag{6.1}
\]

On an even plus-phase prolate tail,

\[
 (\mathcal F_++\mathcal F_+^*)Te_j=-\chi_jTe_j.       \tag{6.2}
\]

Since `T` is an exact isometry in exterior-defect-white coordinates,
(6.1)--(6.2) prove

\[
 \langle e_i,S_1e_j\rangle=-{\chi_j\over4}\delta_{ij}.
                                                                    \tag{6.3}
\]

Equations (2.4), (3.8), and (6.3) now determine the physical sign.  The
constant part of `G-B` is `2L`, so its contribution is

\[
 -(2L)S_1={L\over2}\mathsf X\succeq0.                 \tag{6.4}
\]

This is the precise cancellation-preserving statement.  Isolating
`+2B` produces a negative reciprocal piece of divisor-conductor size;
isolating `-2G` produces the compensating positive piece.  Bounding the
negative piece before the subtraction in (2.4) loses the proof scale.

At a finite Fejer cutoff `H`, the paired first alias is multiplied by
`1-1/(H+1)>=0`, so (6.4) remains positive uniformly in `H`.  The statement
is for the raw unsheared prolate span.  A common full-span endpoint shear
preserves it by congruence, but this note does not assert that the other
terms needed before that shear have been assembled.

## 7. Cutoff-scale audit and the remaining operator lemma

The defect-white log-tail carrier has leading amplitude

\[
 A_r(s)={e^{s/2}\over
  2\sqrt{J(r)}\,x(s)^{1/2}\{x(s)^2+r^2\}^{1/4}}.       \tag{7.1}
\]

At the quartic point,

\[
 A_r(s_*)^2={1\over4J(r)r}.                             \tag{7.2}
\]

Equations (5.6)--(7.2) give the scalar fixed-product quartic scale

\[
 \left|\int\phi_r(\rho)\phi_r(y-\rho)\,d\rho\right|
 \leq {C\over J(r)\alpha^{1/4}}                        \tag{7.3}
\]

in the `O(sqrt(A))` product collar around `N_*`.  This is a scalar carrier
audit, not an operator-norm theorem for coherent action combinations.

The elementary divisor bound on an interval of length `Y~sqrt(A)` gives

\[
 \sum_{X<N\leq X+Y}G_N\leq C YL^2.                    \tag{7.4}
\]

Thus an **isolated** absolute bound on `+2B` has the scale

\[
 {CL\over\alpha_0^{1/4}}.                              \tag{7.5}
\]

It is `o(1)` only if `alpha_0/L^4` tends to infinity; the safe choice
`alpha_0=L^8` gives `O(L^{-1})`.  The project cutoff
`alpha_0=(log L)^4` makes (7.5) grow like `L/log L` and therefore cannot
support a standalone `B` norm estimate.

After the exact center cancellation (0.4), the corresponding absolute
collar scale is instead

\[
 {CL\over J(r)\alpha_0^{1/4}}.                         \tag{7.6}
\]

At the lower bulk edge, `J(r)~L` and `alpha_0=(log L)^4`, so (7.6) is
`O(1/log L)`.  After the positive constant alias (6.4) is retained, the
remaining deterministic weight is only `2log(N/A)=O(1)` in this collar.
If one additionally has the short-interval estimate

\[
 \sum_{|N-N_*|\leq C\sqrt A}\Lambda(N)\leq C'\sqrt A, \tag{7.7}
\]

then the post-constant scalar collar is

\[
 O\left({1\over J(r)\alpha_0^{1/4}}
       +{\log(2+\alpha_0)\over\alpha_0}\right)
 =O\left({1\over L\log L}
       +{\log\log L\over(\log L)^4}\right).          \tag{7.8}
\]

Estimate (7.7) follows from a Brun--Titchmarsh bound for primes plus an
elementary prime-power count, but no source for that theorem is vendored
here.  Accordingly (7.8) is a conditional scale audit, not a frozen input.

It remains to promote these scalar estimates and the nonnegative
reciprocal symbol to a cutoff-uniform operator statement on coherent
action combinations.  The missing assertion is a masked
Poisson--Morse--Bott/Garding lemma which must:

1. retain (6.4) rather than count it as a remainder;
2. quantize the nonnegative excess in (2.6) without an `O(L)` loss;
3. sum the ordinary divisor-jump shells from Section 8;
4. control unequal-action and endpoint-shear cross rows in the full
   exterior metric; and
5. keep the raw prime discrepancy separate from deterministic aliases.

None of these operator conclusions is inferred from (7.3)--(7.8).

## 8. Every true mask transition is nondegenerate

Let

\[
 p_r(x)={d\over dt}T_r((e^{2t}-1)^{1/2})
 ={\sqrt{(1+x^2)(x^2+r^2)}\over x}.                    \tag{8.1}
\]

On the reciprocal branch `x_2=r/x_1`, both first derivatives equal
`Z=z_1z_2`.  Direct differentiation gives

\[
 p_r'(t)={(1+x^2)(1-r^2/x^4)\over p_r(x)}.             \tag{8.2}
\]

For fixed `y`, `t_1=rho`, `t_2=y-rho`, so the second derivative is the
sum of (8.2) at `x` and `r/x`.  Simplification yields (0.14).

The square in (0.14) proves that degeneracy occurs only at `x^2=r`.
At a true right mask transition `z_1=m>=2`,

\[
 x^2=m^2-1\geq3>r,                                     \tag{8.3}
\]

and similarly for a left transition.  Hence no divisor-mask jump meets
the quartic set.  These shells are ordinary Fourier-integral pieces.  This
classification removes the false claim that `m,l>=2` eliminates the
reciprocal branch: it eliminates the **quartic intersection with a mask
jump**, not the reciprocal stationary manifold itself.

Their signed, cutoff-uniform operator sum remains part of the missing
lemma in Section 7.
