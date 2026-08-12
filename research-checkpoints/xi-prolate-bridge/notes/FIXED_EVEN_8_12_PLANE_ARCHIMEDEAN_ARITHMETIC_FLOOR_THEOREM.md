# Fixed-even label-8/12 plane Archimedean-arithmetic floor theorem

## 0. Exact result and claim boundary

This byte set supersedes the analytically invalid candidate hashes
`e7d5571d01bbfa59c71de263aa76de640f9db801ec02cf3b16a308be83340d67`
and
`1381e4cdfb2d04004c00da7c50b417394e11f67771ecb4907baf9ed1da217954`.
It also supersedes the first repaired pair
`466e581dd27cc2214042f193495ee8aa9f080162662cb1e3f666da574a4bdd28`
and
`de1b5aa79b4b6a1b4fa5c1f66fc96b9804e1ebe59b6984b676db61698fa03c72`.
Those hashes must not be integrated.  The first pair's equation (5.20)
dropped a real endpoint boundary term in the intermediate sample range,
promoted an `o(1)` equality to an exact amplitude zero, and did not make
its Fejer and endpoint-jump passages cutoff-uniform.  The first repaired
pair fixed those defects but still used one scalar caustic functional to
cancel two independent real trigonometric branches.  The proof below
replaces every one of these steps explicitly.

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad A=\lambda^2,\qquad
 L=\log A=2\log\lambda .                              \tag{0.1}
\]

Let \(F_\lambda:\mathbb C^2\to L^2(-\lambda,\lambda)\)
be the real two-column synthesis formed from the actual uncorrected
anchor-deflated prolate labels `8` and `12`.  Its exact quotient exterior
metric and exact endpoint row are

\[
 D_\lambda=F_\lambda^*(I-\mathcal P_\lambda)F_\lambda
 \succ0,\qquad
 \eta_\lambda z=(F_\lambda z)(\lambda).                \tag{0.2}
\]

Here \(\mathcal P_\lambda\) is the finite Fourier concentration operator.
The invisible correction supported at the origin is deliberately not
included in \(F_\lambda\) or \(D_\lambda\): it changes source exterior
leakage, so including it would change the quotient metric.  Put

\[
 a_\lambda=D_\lambda^{-1/2}\eta_\lambda^*,\qquad
 r_\lambda=\|a_\lambda\|_2,                             \tag{0.3}
\]

and, writing \(a_\lambda=(a_{1,\lambda},a_{2,\lambda})^T\), define

\[
 e_\lambda={a_\lambda\over r_\lambda},\qquad
 v_\lambda={1\over r_\lambda}
 \binom{\overline {a_{2,\lambda}}}
       {-\overline {a_{1,\lambda}}}.                    \tag{0.4}
\]

All entries are real in the locked convention, so the conjugates in
(0.4) may be omitted.  Pull these vectors back to raw source coordinates:

\[
 f_{e,\lambda}=F_\lambda D_\lambda^{-1/2}e_\lambda,
 \qquad
 f_{v,\lambda}=F_\lambda D_\lambda^{-1/2}v_\lambda .    \tag{0.5}
\]

Equations (0.2)--(0.5) give the exact identities

\[
 \langle f_i,(I-\mathcal P_\lambda)f_j\rangle
 =\delta_{ij},\qquad
 f_{v,\lambda}(\lambda)=0,\qquad
 f_{e,\lambda}(\lambda)=r_\lambda>0.                  \tag{0.6}
\]

Thus this is the exact full-exterior-\(D_\lambda\)-orthonormal
endpoint/null basis, not the scalar-block approximation to it.

Let \(\mathfrak b_\lambda:\mathbb C^2\to
L^2(-\lambda,\lambda)\) be the linear invisible origin-bump correction.
It preserves every endpoint jet and leaves the actual compact projected
column unchanged.  For \(i\in\{e,v\}\), the bump belongs only to the
global radical lift \(K_{i,\lambda}\), formed from

\[
 f_{i,\lambda}+\mathfrak b_\lambda
       (D_\lambda^{-1/2}i).                              \tag{0.6a}
\]

Let \(W_{i,\lambda}\) be its actual compact projected column and put

\[
 R_{i,\lambda}=K_{i,\lambda}-W_{i,\lambda}
 =O_{i,\lambda}+P_{i,\lambda}                            \tag{0.7}
\]

the exact physical-outer plus central-projection split.  Let \(U_\lambda\)
be the common Rayleigh shift and define the Hermitian shifted compression

\[
 \mathsf H_{ij}(\lambda)
 =\mathcal W_Z(R_{i,\lambda},R_{j,\lambda})
  -U_\lambda\langle W_{i,\lambda},W_{j,\lambda}\rangle,
 \qquad i,j\in\{e,v\}.                                  \tag{0.8}
\]

Define

\[
\begin{aligned}
 E
 &=\sum_{m\geq1}{4\over\pi m}
   \int_{\sqrt{m^2-1}}^\infty {x^2\over(1+x^2)^3}\,dx
   =0.282628070905254\ldots,\\
 F
 &=\sum_{m\geq1}{1\over\pi m}
   \int_{\sqrt{m^2-1}}^\infty
        {(x^2-1)^2\over(1+x^2)^3}\,dx
   =0.427511972026948\ldots .                           \tag{0.9}
\end{aligned}
\]

This note proves the fixed-plane matrix theorem

\[
 \boxed{
 \mathsf H(\lambda)\succeq {E\over2}\log c\,I_2-CI_2
 \quad\text{for all sufficiently large locked }\lambda .} \tag{0.10}
\]

In particular, the least eigenvalue of the exact shifted label-`8/12`
compression tends to `+infinity`.  The endpoint direction does not leave
a scalar obstruction: its leading sawtooth has a bounded same-side prime
contribution because integer dilation supplies an additional exact
factor `1/n`.

For reference, if

\[
 \mathsf H=\begin{pmatrix}h_{ee}&h_{ev}\\
                    \overline {h_{ev}}&h_{vv}\end{pmatrix},              \tag{0.11}
\]

then, whenever \(h_{vv}-\mu>0\), the exact two-dimensional Schur test is

\[
 \boxed{
 \mathsf H\succeq\mu I_2
 \quad\Longleftrightarrow\quad
 h_{ee}-\mu-{|h_{ev}|^2\over h_{vv}-\mu}\geq0.}        \tag{0.12}
\]

If \(h_{vv}-\mu=0\), positivity instead requires \(h_{ev}=0\) and
\(h_{ee}-\mu\geq0\).  In a nonorthonormal raw basis the same statement
must be applied to \(H-\mu D\), not to \(H-\mu I\).

Equation (0.10) is only a fixed two-label result.  It is not uniform in a
moving label or growing prefix and proves no floor for the labels
`16,20,...`, no growing-rest or singleton-versus-growing-rest Schur floor,
no residual action estimate, no physical high-complement comparison, no
low/high reducing property, no equation (5.2) of `DIRECT_RH_ATTACK.md`,
and no RH conclusion.  The formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies

The argument uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_ARCHIMEDEAN_FLOOR_THEOREM.md` | `c11c53a9bbf33abc1099c68a0a6acd8bc8febd03fe27d15a6dca5deb99b6cb67` |
| `tests/test_fixed_even_endpoint_null_archimedean_floor_theorem.py` | `111f8263a730e1706add25ef1446026d4a53182a11c54145a456870bd5b4e318` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_COMPLETE_VOLTERRA_CAUSTIC_QUADRATURE_THEOREM.md` | `fd966dcda67cc4141afb3611878cff39a9d009f34d5cd6c0720deab26856a86c` |
| `tests/test_fixed_even_endpoint_null_complete_volterra_caustic_quadrature_theorem.py` | `b734c0e93d264cca9bfe31a141f06907724e526de08781295b6a7cd3bcc0b47c` |
| `notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md` | `287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0` |
| `tests/test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem.py` | `36d9ca8f522f10b3bf8fd98bffa7b0a0e26a67eaee94ebaba18ff4912b9d651a` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md` | `34bb4e43faf04f34e11126946b1069480375d5ba18baf9c97e9746b246594a0f` |
| `notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` | `c6e4a757604bfc9c1299a272054f1174970781e6cd0a92ed0dfb196f9804fa81` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` | `3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `notes/COMPACT_PROJECTION_WEIL_BOUND.md` | `61cce2214563cfb1099ea4d22c1d4831c705eba33df48fbddbddbe395ec91d93` |
| `notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` | `3d8b4f79d4d9249d36abe8a898a50565528d34711fc8b151f2f72c1c13bb2edd` |

All constants below are fixed-label constants.  No estimate in this note
is asserted uniformly after the label set is allowed to grow.

## 2. Exact basis asymptotics and the two complete Jost profiles

The fixed-prefix exterior theorem gives, for the raw columns in (0.2),

\[
 D_\lambda=
 \operatorname {diag}(d_8,d_{12})^{1/2}
 (I+O(\lambda^{-8}))
 \operatorname {diag}(d_8,d_{12})^{1/2}.                \tag{2.1}
\]

The endpoint normalization is

\[
 e_j^2\sim2\pi\lambda d_j,\qquad j=8,12.               \tag{2.2}
\]

The bounded anchors and the exact origin correction are smaller after
whitening.  Consequently

\[
 a_\lambda=\sqrt{2\pi\lambda}
 \binom{1+o(1)}{1+o(1)},\qquad
 r_\lambda=2\sqrt{\pi\lambda}{1+o(1)\},               \tag{2.3}
\]

\[
 e_\lambda={1\over\sqrt2}\binom11+o(1),\qquad
 v_\lambda={1\over\sqrt2}\binom1{-1}+o(1).            \tag{2.4}
\]

The `o(1)` in (2.4) is only used to identify limiting amplitudes; exact
orthonormality and exact endpoint cancellation always come from (0.3)--
(0.6).

For a radial sample define

\[
 x_m(s)=\sqrt{m^2e^{2s}-1},\qquad
 \beta(x)=\arctan(1/x),\qquad
 \Phi_m(s)=cx_m(s)+\bar\nu\beta(x_m(s)),                \tag{2.5}
\]

where

\[
 \bar\nu={21\over2}+O(c^{-1}).                          \tag{2.6}
\]

Let \(B_{e,\lambda}\) and \(B_{v,\lambda}\) be the complete one-tail
physical profiles and put \(g_i(s)=e^{s/2}B_i(s)\).  On the Jost range
\(x_m\geq c^{-1/4}\), the exact divided-difference/Volterra representation
and (2.3)--(2.4) give the leading profiles

\[
 B_e^0(s)=\sum_{m\geq1}b_m^e(s)\sin\Phi_m(s),\qquad
 B_v^0(s)=-\sum_{m\geq1}b_m^v(s)\cos\Phi_m(s),          \tag{2.7}
\]

\[
 b_m^e(s)={x_m(s)^2-1\over
  \sqrt{\pi m x_m(s)}(1+x_m(s)^2)},\qquad
 b_m^v(s)={2\sqrt{x_m(s)}\over
  \sqrt{\pi m}(1+x_m(s)^2)}.                           \tag{2.8}
\]

The formula for \(b_m^v\) is the frozen endpoint-null limiting amplitude.
For the endpoint direction, the limiting trigonometric identity is

\[
 \sin\phi_8+\sin\phi_{12}
 =2\sin\Phi_m\cos\!\left({\nu_8-\nu_{12}\over2}\beta\right),
 \qquad
 \cos(2\beta)={x^2-1\over x^2+1},                       \tag{2.9}
\]

which proves the first formula in (2.8).  The limiting endpoint amplitude
vanishes simply at \(x=1\).  The actual finite-\(c\) amplitude need not
vanish there: the two exact coframe weights are only asymptotically equal
and \(\nu_8-\nu_{12}=-4+O(c^{-1})\).  Section 6 therefore makes a real
rotation which cancels the unquantified cosine/null coefficient while
retaining the explicit \(O(c^{-1})\) sine coefficient.

The leading `g` amplitudes, useful below, are

\[
 a_m^e(s)={x_m(s)^2-1\over
  \sqrt\pi\,m\sqrt{x_m(s)}(1+x_m(s)^2)^{3/4}},\qquad
 a_m^v(s)={2\sqrt{x_m(s)}\over
  \sqrt\pi\,m(1+x_m(s)^2)^{3/4}}.                       \tag{2.10}
\]

The complete Volterra iteration may be differentiated once on every
monotonicity interval.  Its outgoing Green kernel costs \(K/c\), and the
fixed lower-label divided differences cost \(O(c^{-2})\).  Thus the
remainder has the same two phases as (2.7), with BV symbols carrying an
extra factor \(c^{-1}\), plus the exact hard-edge Bessel piece.  More
precisely, after Fejer truncation in `m`, every product integral below may
be estimated termwise using (2.8)--(2.10); the sum of all differentiated
Volterra remainders satisfies the same bound with an extra \(Kc^{-1}\).
The estimates are uniform in the Fejer cutoff and hence pass to the
complete profiles.  This is a consequence of the exact resolvent identity

\[
 \mathcal L_r{F_j-F_r\over\Theta_j-\Theta_r}=F_j,
 \qquad
 \mathcal L_j{F_j-F_r\over\Theta_j-\Theta_r}=F_r,       \tag{2.11}
\]

not a termwise Bernoulli truncation.

At the hard edge, put \(z=cx_1\).  The regular solution is controlled by
\(J_0(z)\), and the integrated Volterra perturbation is \(O(c^{-1})\).
This supplies both the hard-edge bounds in Sections 5 and 6 and closes the
range omitted by (2.7).

### 2.1 Exact Poisson row and cutoff convention

The conditional endpoint row is fixed without assigning absolute meaning
to its individual \(m^{-1}\) samples.  Let \(f\) be any one of the even
corrected sources used above, let \(\widehat f\) use the convention
`exp(2*pi*i*x*xi)`, and put \(u=\lambda e^s\).  The source has exact zero
integral, including the invisible bump.  Twice integrating by parts and
using the exact periodic Bernoulli series gives

\[
\begin{aligned}
 B_f(s)
 &={\sqrt u\over2}\sum_{m\geq1}\widehat f(mu)\\
 &=\kappa_f e^{-s/2}P(Ae^s)+\mathcal R_f(s),
 \qquad \kappa_f={f(\lambda)\over2\sqrt\lambda},       \tag{2.12}
\end{aligned}
\]

where

\[
\begin{aligned}
 \mathcal R_f(s)
 ={}&{f'(\lambda)\over4u^{3/2}}
       \widetilde B_2(Ae^s)
 -{1\over8u^{3/2}}
       \int_{-\lambda}^{\lambda}f''(x)\widetilde B_2(ux)\,dx\\
 ={}&{1\over8\pi^2u^{3/2}}
 \sum_{m\geq1}{2f'(\lambda)\cos(2\pi m\lambda u)
                 -\widehat {f''}(mu)\over m^2}.        \tag{2.13}
\end{aligned}
\]

Equation (2.12) is the closed Poisson/sawtooth row.  All series are first
taken as Fejer means.  The sole conditional \(m^{-1}\) row is exactly the
first term in (2.12), and (2.13) is absolutely summable for each fixed
\(\lambda\).  In the exact basis,

\[
 \kappa_v=0,\qquad
 \kappa_e={r_\lambda\over2\sqrt\lambda}\longrightarrow\sqrt\pi.
                                                               \tag{2.14}
\]

The useful structural bound is

\[
 |e^{s/2}\mathcal R_f(s)|
 \leq\lambda^{-3/2}e^{-s}
 \left({|f'(\lambda)|\over24}+{\|f''\|_1\over48}\right). \tag{2.15}
\]

Its constant depends on \(\lambda\); indeed the endpoint direction has a
second-jet coefficient of size \(\asymp c\).  Thus (2.13) is used only for
cutoff convergence and BV bookkeeping.  It is not used to split the
complete radial FIO into separately uniform Bernoulli orders.  Uniform
Gram, low-frequency, same-side, and reflected estimates retain the
complete radial row.

On every compact `s` interval, the sawtooth term in (2.12) is BV with
finitely many jumps and \(e^{s/2}\mathcal R_f\) is locally absolutely
continuous.  The Fejer means converge in local `L1` to this exact
representative and take midpoint values at jumps.  This supplies the
cutoff convention used in every later product.

## 3. Positive limiting physical Gram

Since

\[
 ds={x\,dx\over1+x^2},                                  \tag{3.1}
\]

diagonal oscillatory averaging in (2.7) gives

\[
 2\begin{pmatrix}
 \langle B_e,B_e\rangle&\langle B_e,B_v\rangle\\
 \langle B_v,B_e\rangle&\langle B_v,B_v\rangle
 \end{pmatrix}
 \longrightarrow
 \boxed{\begin{pmatrix}F&0\\0&E\end{pmatrix}}.         \tag{3.2}
\]

Indeed, the two diagonal integrands before oscillatory averaging are

\[
 (b_m^e)^2ds={1\over\pi m}
 {(x^2-1)^2\over(1+x^2)^3}\,dx,\qquad
 (b_m^v)^2ds={4\over\pi m}{x^2\over(1+x^2)^3}\,dx.     \tag{3.3}
\]

Here is the cutoff-uniform passage.  Apply a finite Fejer cutoff to the
complete radial rows, with weights between zero and one.  For
\(m,l\geq2\), \(m\ne l\), the endpoint symbols satisfy

\[
 \|b_m^e\|_\infty+\operatorname {Var}(b_m^e)\leq {K\over m},
                                                               \tag{3.3a}
\]

and phase integration by parts gives respectively

\[
 |I_{ml}^{\rm diff}|
 \leq {K\over cml(1+|m-l|)},\qquad
 |I_{ml}^{\rm sum}|
 \leq {K\over cml(m+l)}.                               \tag{3.3b}
\]

Both double majorants converge: near the diagonal the first costs
\(\sum_m(1+\log m)m^{-2}\), and off the diagonal both are geometric.
The reciprocal branch has one index equal to `1` and is bounded by
\(Kc^{-1/2}l^{-2}\), which is summable.  The null row improves at least
one sample exponent.  Thus all off-diagonal products and all oscillatory
diagonal products are \(O(c^{-1/2})\), uniformly in the Fejer cutoff.
The nonoscillatory diagonal products are the positive integrals (3.3),
whose sample sums are \(O(\sum m^{-2})\).  The hard-edge Bessel row and
the differentiated Volterra symbols obey the same uniform bounds.

It follows first uniformly in the cutoff and then in its limit that the
mixed sine/cosine entry tends to zero and the two diagonal entries tend to
the displayed sums.  This proves (3.2) for the complete profiles without
an unproved pointwise summation of the endpoint row.  Equation (2.12)
identifies the resulting Fejer limit uniquely.

For comparison, put

\[
 U=\sum_{m\geq1}{\arcsin(1/m)\over2\pi m}
 =0.355070021466101\ldots .                              \tag{3.4}
\]

The scalar label-8 direction is asymptotic to \((e+v)/\sqrt2\), and

\[
 F=2U-E.                                                 \tag{3.5}
\]

The exact closed forms are

\[
\begin{aligned}
 E&={1\over4}+{1\over2\pi}\sum_{m\geq2}{1\over m}
 \left\{\arcsin{1\over m}
 -{\sqrt{m^2-1}(m^2-2)\over m^4}\right\},\\
 F&={1\over4}+{1\over2\pi}\sum_{m\geq2}{1\over m}
 \left\{\arcsin{1\over m}
 +{\sqrt{m^2-1}(m^2-2)\over m^4}\right\}.             \tag{3.6}
\end{aligned}
\]

Every summand in \(F-E\) is positive.  Hence

\[
 \boxed{F>E>0.}                                         \tag{3.7}
\]

No decimal approximation is used for positivity.

## 4. Matrix high-frequency Archimedean floor

Differentiate (2.5):

\[
 \Phi_m'(s)=cx_m(s)+{c-\bar\nu\over x_m(s)},            \tag{4.1}
\]

and therefore

\[
 \min_{x>0}\left(cx+{c-\bar\nu\over x}\right)
 =2\sqrt{c(c-\bar\nu)}\geq{3c\over2}                  \tag{4.2}
\]

eventually.  For \(m\geq2\) and \(|\xi|\leq c/2\), the stronger bound

\[
 |\Phi_m'(s)-\xi|\geq\kappa cme^s                     \tag{4.2a}
\]

holds.  The BV first-derivative estimate and (3.3a) therefore give

\[
 \left|\int_0^\infty b_m^e(s)
 e^{i\Phi_m(s)-i\xi s}\,ds\right|
 \leq {K\over cm^2};                                   \tag{4.2b}
\]

the null row is smaller.  This majorant is summable uniformly in the
Fejer cutoff.  For `m=1`, use the exact hard-edge transform

\[
 \lambda\int J_0(cx)e^{-i\xi\log\sqrt{1+x^2}}
             x\omega_c(x)\,dx .                         \tag{4.2c}
\]

On \(cx\geq1\), both Bessel phases have derivative separated from zero
because \(|\xi|\leq c/2\); on \(cx<1\), the substitution \(z=cx\)
gives the same \(O(c^{-1})\) bound directly.  The complete Volterra
symbols add an absolutely summable \(O(c^{-1})\) contribution.  Hence
the full low-frequency transform is \(O(c^{-1})\), uniformly in the
cutoff and in unit \(z\in\mathbb C^2\), and

\[
 \int_{|\xi|\leq c/2}
 \left|\widehat{z_eB_e+z_vB_v}(\xi)\right|^2
 {d\xi\over2\pi}=O(c^{-1})=o(1).                       \tag{4.3}
\]

Combining (3.2) and (4.3) gives the matrix convergence

\[
 2\int_{|\xi|\geq c/2}
 \binom{\widehat B_e}{\widehat B_v}
 (\overline{\widehat B_e},\overline{\widehat B_v})
 {d\xi\over2\pi}
 \longrightarrow\begin{pmatrix}F&0\\0&E\end{pmatrix}. \tag{4.4}
\]

In particular, its left side is at least \((E/2)I_2\) eventually.

The exact even Archimedean multiplier is

\[
 a(\xi)=\operatorname {Re}\psi\!\left({1\over4}
                   +{i\xi\over2}\right)-\log\pi,       \tag{4.5}
\]

and the digamma series gives

\[
 a(\xi)\geq a_0+{1\over2}\log(1+4\xi^2),\qquad
 a_0=-\gamma-\frac\pi2-3\log2-\log\pi.                 \tag{4.6}
\]

Thus, as a Hermitian matrix,

\[
\begin{aligned}
 Q_{\rm ar}^{\rm same}
 &=2\int_{\mathbb R}a(\xi)
 \binom{\widehat B_e}{\widehat B_v}
 (\overline{\widehat B_e},\overline{\widehat B_v})
 {d\xi\over2\pi}\\
 &\succeq {E\over2}\log c\,I_2-CI_2.                  \tag{4.7}
\end{aligned}
\]

This is a genuine two-dimensional lower bound; a diagonal estimate plus
Cauchy--Schwarz is not being substituted for the matrix convergence (4.4).

## 5. Complete same-side prime matrix

For \(i,j\in\{e,v\}\), define the ordered one-tail correlation

\[
 T_{ij}(y)=\int_0^\infty B_i(s)\overline {B_j(s+y)}\,ds.
                                                               \tag{5.1}
\]

The same-side Hermitian prime matrix is a fixed linear combination of
\(T_{ij}(\log n)\) and \(\overline {T_{ji}(\log n)}\), with weight
\(\Lambda(n)/\sqrt n\).  We prove the complete lattice estimate

\[
 \boxed{
 |T_{ee}(\log n)|+|T_{ev}(\log n)|+|T_{ve}(\log n)|
 \leq {K(1+\log n)^2\over n^{3/2}},\qquad n\geq2.}      \tag{5.2}
\]

The already-frozen complete null estimate gives the same assertion for
\(T_{vv}\).  The proof of (5.2) follows.

### 5.1 The leading sawtooth equality

By (2.12), the following is the exact closed conditional row, not merely
the first term of a truncated endpoint expansion.  Let

\[
 P(x)={1\over2}-\{x\},\qquad
 B_{e,P}(s)=\kappa_{1,\lambda}e^{-s/2}P(Ae^s),          \tag{5.3}
\]

where exact endpoint integration by parts gives

\[
 \kappa_{1,\lambda}={r_\lambda\over2\sqrt\lambda}
 \longrightarrow\sqrt\pi.                              \tag{5.4}
\]

For every integer \(n\geq1\), subdivision into the `n` intervals of
length \(1/n\) gives the exact covariance

\[
 \boxed{\int_0^1P(x)P(nx)\,dx={1\over12n}.}             \tag{5.5}
\]

If \(F_n'(x)=P(x)P(nx)-1/(12n)\) and \(F_n\) is centered and
one-periodic, direct integration on those intervals gives

\[
 \|F_n\|_\infty\leq{1\over3n}.                         \tag{5.6}
\]

Consequently

\[
 J_n(A)=A\int_A^\infty {P(x)P(nx)\over x^2}\,dx,
 \qquad
 \boxed{\left|J_n(A)-{1\over12n}\right|
       \leq{2\over3nA}.}                               \tag{5.7}
\]

The exact `P--P` same-side correlation is therefore

\[
 \int_0^\infty B_{e,P}(s)B_{e,P}(s+\log n)\,ds
 ={\kappa_{1,\lambda}^2\over\sqrt n}J_n(A)
 =O(n^{-3/2}),                                          \tag{5.8}
\]

not merely \(O(n^{-1/2})\).  This proves directly that its prime sum is
bounded by a constant times

\[
 \sum_{n\geq2}{\Lambda(n)\over n^2}<\infty.            \tag{5.9}
\]

For bookkeeping, remove this row once and for all by setting

\[
 \widetilde T_{ee}(\log n):=T_{ee}(\log n)
 -\int_0^\infty B_{e,P}(s)B_{e,P}(s+\log n)\,ds.       \tag{5.9a}
\]

The mixed entries need no subtraction because \(\kappa_{2,\lambda}=0\).
Sections 5.2--5.5 estimate the recombined complete-radial remainder
\(\widetilde T_{ee},T_{ev},T_{ve},T_{vv}\); the separately controlled
term (5.8) is added back only after those estimates.

We do not bound the remainder in (2.13) term by term: its normalized
second-jet coefficient grows like `c`, and the separate Bernoulli orders
cancel only inside the complete radial profile.  All `P--R`, `R--P`, and
`R--R` terms are therefore retained together in the complete Jost
argument below.  Equation (5.8) removes the only conditional rank-one
row before that argument is passed to the Fejer limit.

### 5.2 Equality branch of the complete Jost product

At the prime lattice point \(y=\log n\),

\[
 x_l(s+\log n)=x_{nl}(s).                               \tag{5.11}
\]

Thus equality of the two radial phases occurs exactly when

\[
 \boxed{m=nl.}                                          \tag{5.12}
\]

For the endpoint/endpoint entry, the nonoscillatory part of the equality
branch, before the harmless subtraction (5.9a), is bounded by

\[
 \sum_{l\geq1}{1\over\pi l\sqrt n}
 \int_{\sqrt{n^2l^2-1}}^\infty
 {(x^2-1)^2\over(1+x^2)^3}\,dx.                        \tag{5.13}
\]

Since \(nl\geq2\),

\[
 \int_{\sqrt{n^2l^2-1}}^\infty
 {(x^2-1)^2\over(1+x^2)^3}\,dx
 \leq {2\over\sqrt3\,nl},                             \tag{5.14}
\]

so (5.13) is at most

\[
 {2\over\pi\sqrt3\,n^{3/2}}
 \sum_{l\geq1}{1\over l^2}.                            \tag{5.15}
\]

For endpoint/null and null/endpoint products, equality leaves
\(\sin\Phi\cos\Phi=\frac12\sin(2\Phi)\), with no
nonoscillatory part.  One first-derivative integration gives a strictly
smaller bound than (5.15).

### 5.3 Reciprocal stationary branch

Put \(N=nl\) and \(q=1-\bar\nu/c\).  Equality of the two difference-phase
derivatives gives exactly

\[
 x_m=x_N\quad\text{or}\quad x_mx_N=q.                   \tag{5.16}
\]

The first alternative is (5.12).  Since \(N\geq2\) and
\(x_k(0)=\sqrt{k^2-1}\), the reciprocal alternative in (5.16) can occur
only for

\[
 \boxed{m=1.}                                           \tag{5.17}
\]

At that point \(x_1\asymp N^{-1}\), while the absolute second derivative
of the normalized phase is bounded below by \(\kappa N^3\).  Restoring
the factor `c`, the second-derivative estimate and (2.8) give

\[
 |I_{1,l}^{\rm rec}(n)|
 \leq {Kc^{-1/2}\over l^2n^{3/2}}.                     \tag{5.18}
\]

The same estimate holds for the endpoint/null orientations.  The apparent
\(x_1^{-1/2}\) endpoint amplitude is exactly compensated by the
\((cN^3)^{-1/2}\) stationary cost.  The portion with
\(x_1<c^{-1/4}\) is not inferred from this Jost calculation; it is the
hard-edge term in Section 5.5.

### 5.4 Separated phases

All sum phases are nonstationary.  For difference phases outside
(5.12) and (5.16), split the integer samples into

\[
 m<{N\over2},\qquad |m-N|\leq{N\over2},\qquad
 m>{3N\over2}.                                          \tag{5.19}
\]

On the middle range, subdivide dyadically by \(|m-N|\).  The exact radial
derivative (4.1), one first-derivative step away from stationary points,
one second-derivative step near an ordinary stationary point, and the BV
symbols in (2.8)--(2.10) give, for \(m\geq2\),

\[
\boxed{
 |I_{m,l}^{\rm sep}(n)|
 \leq {K\over n^{3/2}l^2}
 \left\{{1\over(1+|m-N|)(1+m/N)}
 +{c^{-1}\over m(1+m/N)}\right\}
 +V_{m,l}(n).}                                          \tag{5.20}
\]

The last term contains differentiated Volterra symbols and obeys the
summed bound

\[
 \sum_{l\geq1}\sum_{m\geq2}|V_{m,l}(n)|
 \leq {K(1+\log n)\over n^{3/2}}.                      \tag{5.20a}
\]

The second summand in (5.20) is mandatory.  For \(l=1\), \(N=n\), and
\(c\ll m\ll N/c\), the `s=0` integration-by-parts boundary is of size

\[
 {1\over cmN^{3/2}},                                    \tag{5.20b}
\]

so replacing it by \(O(c^{-1}m^{-2}N^{-3/2})\) is false.
Indeed \(b_m^e(0)b_l^e(\log n)\leq K/(ml\sqrt n)\), while
the phase derivative is comparable to \(cN\) for \(m<N/2\) and to
\(cm\) for \(m>3N/2\).  These two endpoint estimates are exactly the
second term in (5.20).

The elementary split in (5.19) and telescoping give

\[
\begin{aligned}
 \sum_{m\ne N}{1\over(1+|m-N|)(1+m/N)}
 &\leq K(1+\log N),\\
 \sum_{m\geq1}{1\over m(1+m/N)}
 &=\sum_{m\geq1}{N\over m(m+N)}=H_N.
                                                               \tag{5.21}
\end{aligned}
\]

Since
\(\sum_l l^{-2}(1+\log(nl))\leq K(1+\log n)\), summing
first in `m` and then in `l` gives, uniformly in the Fejer cutoff,

\[
 \sum_{l\geq1}\sum_{m\ne nl}
 |I_{m,l}^{\rm sep}(n)|
 \leq {K(1+\log n)\over n^{3/2}}
 \leq {K(1+\log n)^2\over n^{3/2}}.                   \tag{5.22}
\]

The null row gains an extra inverse sample in either mixed orientation.
Equations (2.12)--(2.15) identify the Fejer limit, while (5.20)--(5.22)
dominate it uniformly without assigning a uniform bound to the large
separate endpoint jets.  This repairs the intermediate-sample endpoint
boundary rather than assuming it cancels.

### 5.5 Exact hard-edge completion

For \(m=1\), put \(x=x_1(s)\) and use the regular Bessel model rather than
the singular Jost amplitude.  With \(N=nl\), the only potentially
stationary transform has the form

\[
 {\lambda\over l\sqrt n}
 \int J_0(cx)
  e^{ic\sqrt{N^2(1+x^2)-1}}x\,\omega_c(x)\,dx,          \tag{5.23}
\]

where \(\omega_c\) has uniformly bounded variation and is supported in
the hard/Jost overlap.  Splitting at the reciprocal point for \(N\leq c\),
and using the endpoint quadratic phase for \(N>c\), gives the uniform
bound.  Here is the scale explicitly.  On \(cx\geq1\), write the two
standard oscillatory branches of \(J_0(cx)\).  Only the minus branch can
be stationary, and its normalized phase satisfies

\[
 -1+{N^2x\over\sqrt{N^2(1+x^2)-1}}=0
 \quad\Longleftrightarrow\quad x={1\over N}.             \tag{5.24}
\]

At this point the Bessel amplitude is \(O((cx)^{-1/2})\), the remaining
factor `x` is \(N^{-1}\), and the phase curvature is comparable to
\(cN\).  Their product is \(O((cN)^{-1})\).  If \(N>c\), the point in
(5.24) lies in \(cx<1\); direct integration there and one
first-derivative step outside give the same bound.  Therefore

\[
 \boxed{
 |(5.23)|\leq {K\lambda\over c\,l^2n^{3/2}}
 ={K\over2\pi\lambda\,l^2n^{3/2}}.}                   \tag{5.25}
\]

The integrated Bessel-Volterra perturbation has an additional factor
\(c^{-1}\).  Summing (5.25) in `l`, then combining (5.15), (5.18), and
(5.22), proves (5.2) for the complete profiles.

It follows that the complete same-side prime matrix satisfies

\[
 \boxed{
 \|Q_{\rm pr}^{\rm same}\|
 \leq K\sum_{n\geq2}{\Lambda(n)(1+\log n)^2\over n^2}
 <\infty.}                                              \tag{5.26}
\]

This is the promised full \(A_{ee}^{\rm same},A_{ev}^{\rm same}=O(1)\)
estimate.  It is a cancellation-preserving integer-lattice theorem, not a
consequence of the false absolute bound \(T_{ee}(y)=O(e^{-y/2})\).

## 6. Complete reflected caustic matrix

Put

\[
 C_{ij}(y)=(g_i*g_j)(y),\qquad i,j\in\{e,v\}.            \tag{6.1}
\]

There is a new endpoint issue here because \(g_e(0+)\ne0\).  Equation
(2.12) resolves it exactly.  Extend each causal profile by zero to the
negative half-line.  On every compact interval, \(g_i\) is BV and locally
integrable.  Its distributional derivative is a finite measure, including
the possible atom \(g_i(0+)\delta_0\).  Therefore

\[
 D(g_i*g_j)=(Dg_i)*g_j\in L^1_{\rm loc},\qquad
 C_{ij}\in W^{1,1}_{\rm loc},\qquad C_{ij}(0)=0.        \tag{6.1a}
\]

The endpoint atom has been convolved with an `L1` function and is now an
ordinary locally integrable term; no atom survives in \(C_{ij}'\).  Thus
Stieltjes integration by parts has no unrecorded boundary measure.  In
particular, a possible prime endpoint at `y=0` is multiplied by
\(C_{ij}(0)=0\).

The complete reflected scalar uses the exact Stieltjes quadrature

\[
\begin{aligned}
 \mathcal M_{ij,A}
 ={}&-\int_0^\infty C_{ij}(y)\,dy
 +\sum_{n>A}{\Lambda(n)\over n}
 C_{ij}\!\left(\log{n\over A}\right)\\
 &+A^{-3}\int_0^\infty
 {e^{-3y}C_{ij}(y)\over1-A^{-2}e^{-2y}}\,dy .           \tag{6.2}
\end{aligned}
\]

The reflected outer matrix is \(-2\lambda\mathcal M_A\).  Same-side and
reflected pieces must remain in the exact explicit-kernel convention; no
separate sign is assigned to the prime or Archimedean cross term.

The frozen null/null theorem classifies the unique degenerate phase:

\[
 (m,l)=(1,1),\qquad y=\log2,qquad
 s={1\over2}\log2,qquad x_1(s)=1.                     \tag{6.3}
\]

Write \(y=\log2+\delta\) and
\(s=y/2+z\).  The exact unfolding is

\[
 x_1(y/2+z)+x_1(y/2-z)
 =X_0(\delta)+4\delta z^2-4z^4
 +O(\delta^2z^2+|\delta|z^4+z^6).                      \tag{6.4}
\]

The null amplitude is nonzero at (6.3), which produces the frozen
\(c^{-1/4}\) null/null caustic.  The actual endpoint amplitude is not set
equal to its limiting zero.  In the exact two-column coordinates of
(0.3), put

\[
 \delta_\lambda={|a_{1,\lambda}-a_{2,\lambda}|\over r_\lambda}
                  +c^{-1}=o(1).                        \tag{6.5}
\]

At the quartic point, the exact slow profile of a real plane vector \(w\)
has two independent real branches

\[
 A_{w,\lambda}(z)\sin\Phi+B_{w,\lambda}(z)\cos\Phi.
\]

If \(q_{8,\lambda}(w),q_{12,\lambda}(w)\) are its two exact real
weighted coefficients and
\(\theta_\lambda=(\nu_8-\nu_{12})\pi/8
=-\pi/2+O(c^{-1})\), then at \(z=0\)

\[
 \begin{aligned}
 A_{w,\lambda}(0)
  &=\{q_{8,\lambda}(w)+q_{12,\lambda}(w)\}\cos\theta_\lambda,\\
 B_{w,\lambda}(0)
  &=\{q_{8,\lambda}(w)-q_{12,\lambda}(w)\}\sin\theta_\lambda.
 \end{aligned}
\]

The exact two-weight trigonometric identity, including the
\(\nu_8-\nu_{12}+4=O(c^{-1})\) phase error, gives

\[
 |A_{e,\lambda}(0)|\leq Kc^{-1},\qquad
 |B_{e,\lambda}(0)|\leq K\delta_\lambda,
 \qquad |B_{v,\lambda}(0)|\geq\kappa_0>0.             \tag{6.5a}
\]

Cancel only the unquantified cosine/null coefficient, using the real
rotation

\[
 \tau_\lambda={B_{e,\lambda}(0)\over B_{v,\lambda}(0)}
       \in\mathbb R,\qquad
 e_{0,\lambda}=e_\lambda-\tau_\lambda v_\lambda,
 \qquad B_{e_0,\lambda}(0)=0.                         \tag{6.5b}
\]

Thus \(\tau_\lambda=o(1)\), and \(e_{0,\lambda},v_\lambda\) remain a
uniformly bounded real basis.  The same exact two-weight identity shows
that \(B_{e_0,\lambda}(0)=0\) forces equality of the two weighted
coefficients, because \(|\sin\theta_\lambda|\) is bounded below.  Hence
the uncancelled sine coefficient is controlled by
\(\cos\theta_\lambda=O(c^{-1})\); it is not set to zero.  After extraction
of the common quartic phase, the slow amplitudes have the local form

\[
 a_{e_0}^{\rm caus}(s_0+z)
   =O(c^{-1})+\kappa_ez+O(z^2),\qquad
 a_v^{\rm caus}(s_0+z)=\kappa_v+O(z),                  \tag{6.5c}
\]

where the first term in \(a_{e_0}^{\rm caus}\) is the residual sine
branch.  Weighted quartic van der Corput applied to (6.4) and (6.5c), with
\(\rho=c^{1/2}|y-\log2|\), yields

\[
\boxed{
 \begin{aligned}
 |C_{ee}^{\rm caus}(\log2+\delta)|
 &\leq K\{c^{-3/4}(1+\rho)^{1/2}
       +c^{-3/2}+c^{-9/4}(1+\rho)^{-1/2}
       +|\tau_\lambda|c^{-1/2}
       +|\tau_\lambda|^2c^{-1/4}(1+\rho)^{-1/2}\},\\
 |C_{ev}^{\rm caus}(\log2+\delta)|
 +|C_{ve}^{\rm caus}(\log2+\delta)|
 &\leq K\{c^{-1/2}
       +c^{-5/4}(1+\rho)^{-1/2}
       +|\tau_\lambda|c^{-1/4}(1+\rho)^{-1/2}\}.
 \end{aligned}}                                        \tag{6.6}
\]

The first terms are the real cosine-null model integrals
\(z^2e^{-i4cz^4}\) and \(ze^{-i4cz^4}\).  The terms containing
\(\tau_\lambda\) are the residual frozen null caustic.  They may not be
dropped without the stronger, unavailable rate
\(\tau_\lambda=O(c^{-1/4})\).  Only the complete quadrature, not a false
pure pointwise exponent, is used below.  The uncancelled
\(O(c^{-1})\) sine branch contributes
\(O(c^{-5/4}(1+\rho)^{-1/2})\) in a mixed product; its two self-product
terms are the smaller \(O(c^{-3/2})\) and
\(O(c^{-9/4}(1+\rho)^{-1/2})\) terms displayed in (6.6).

Away from (6.3), the equality/reciprocal classification has only ordinary
stationary points.  On finite Fejer sums, weighted van der Corput gives for
the endpoint/endpoint entry

\[
\begin{aligned}
 |I^+_{ml}(y)|
 &\leq Kc^{-1/2}m^{-5/4}l^{-5/4}(1+y)e^{-y/4},\\
 |I^-_{ml}(y)|
 &\leq Kc^{-1}m^{-3/2}l^{-3/2}(1+y)e^{-y/2}.           \tag{6.6a}
\end{aligned}
\]

The endpoint/null orientations improve one sample exponent.  Both double
series converge uniformly in the Fejer cutoff.  The exact Poisson split
(2.12) identifies their limit at endpoint jumps, while no separate
uniform estimate of the large Bernoulli remainder is made.  Consequently

\[
 |C_{ee}^{\rm reg}(y)|+|C_{ev}^{\rm reg}(y)|
 +|C_{ve}^{\rm reg}(y)|
 \leq Kc^{-1/2}(1+y)e^{-y/4}.                            \tag{6.7}
\]

The exponent `1/4` is the worst endpoint-row exponent and is integrable.
No termwise endpoint expansion is used in (6.6a)--(6.7).

The only additional piece is hard-edge/hard-edge.  The exact Bessel model
from Section 2 gives

\[
 |C_{ij}^{\rm hh}(y)|
 \leq Kc^{-1/4}{\bf1}_{0\leq y\leq Kc^{-1/2}},
 \qquad i,j\in\{e,v\}.                                  \tag{6.8}
\]

Its continuous mass is \(O(c^{-3/4})\).  In the prime sum in (6.2), its
support contains at most \(KAc^{-1/2}+1\) integer lattice points, and
\(\Lambda(n)/n\leq\log(2A)/A\) there.  Hence its atomic contribution is

\[
 O(c^{-3/4}\log c)=o(c^{-1/2}).                         \tag{6.9}
\]

Equations (6.6a)--(6.9), Chebyshev partial summation with
\(\psi_C(x)\leq C_\psi x\), and the same caustic shell/lattice split as
the frozen theorem prove, in the real cosine-null basis,

\[
 |\mathcal M_{e_0e_0,A}|+|\mathcal M_{e_0v,A}|
 +|\mathcal M_{ve_0,A}|=O(c^{-1/2}).                   \tag{6.9a}
\]

The frozen theorem gives \(\mathcal M_{vv,A}=O(c^{-1/2})\).  Apply
bilinearity at the level of the complete Stieltjes quadrature, before
taking absolute values:

\[
\begin{aligned}
 \mathcal M_{ev,A}
 &=\mathcal M_{e_0v,A}+\tau_\lambda\mathcal M_{vv,A},\\
 \mathcal M_{ee,A}
 &=\mathcal M_{e_0e_0,A}
 +\tau_\lambda(\mathcal M_{e_0v,A}+\mathcal M_{ve_0,A})
 +\tau_\lambda^2\mathcal M_{vv,A}.                    \tag{6.9b}
\end{aligned}
\]

Since \(\tau_\lambda=o(1)\), equations (6.9a)--(6.9b) prove

\[
 \boxed{
 |\mathcal M_{ee,A}|+|\mathcal M_{ev,A}|
 +|\mathcal M_{ve,A}|=O(c^{-1/2}).}                    \tag{6.10}
\]

Since

\[
 2\lambda c^{-1/2}=\sqrt{2/\pi},                        \tag{6.11}
\]

the full reflected matrix is bounded:

\[
 \boxed{\|-2\lambda\mathcal M_A\|=O(1).}              \tag{6.12}
\]

Together, (5.26) and (6.12) prove the complete arithmetic statement

\[
 \boxed{A_{ee}=O(1),\qquad A_{ev}=O(1),\qquad
        A_{vv}=O(1).}                                   \tag{6.13}
\]

The even pole matrix is retained separately:

\[
 P_+(O_i,O_j)=2\widehat O_i(i/2)
                    \overline {\widehat O_j(i/2)},      \tag{6.14}
\]

so it is positive semidefinite and cannot erode the floor.

## 7. Uniform projection transfer on the exact plane

It remains to pass from the physical outer matrix to the actual compact
shifted compression.  This cannot be done with an `L2` projection estimate
alone because the Weil form is unbounded.

Let \(X_{i,\lambda}\) be the central restriction of the corrected global
radical, in the exact basis (0.5), and let

\[
 N=2^{2400p^2}=\exp(9600\log2\,\lambda^2),\qquad
 W_{i,\lambda}=P_NX_{i,\lambda},\qquad
 P_{i,\lambda}=(I-P_N)X_{i,\lambda}.                   \tag{7.1}
\]

For any exact \(D_\lambda\)-unit vector in the label-`8/12` plane, let
\(\gamma_j\), \(j=0,4,8,12\), be its pure-label coefficients and put
\(C_\gamma=\sum_j|\gamma_j|\).  The fixed metric equivalence gives

\[
 C_\gamma\leq {C\over\sqrt{d_8}}.                      \tag{7.2}
\]

For a pure fixed label set

\[
 \overline V_\lambda
 =4\lambda\left(2\pi\lambda^2+{1\over2}\right)
   +32\pi\lambda^2.                                    \tag{7.3}
\]

The circular variation includes the endpoint jump when the direction is
not endpoint-null.  Periodic Stieltjes integration by parts therefore
remains valid, with

\[
 \operatorname {TV}_{\rm circ}(X)\leq\overline V_\lambda C_\gamma,
 \qquad
 \|X\|_1\leq2\sqrt2\lambda C_\gamma.                  \tag{7.4}
\]

The invisible origin bump contributes exactly zero to \(X\) on the
central multiplicative window.  Thus it is not hidden in an `L2` error in
(7.4).

For the orthonormal log-Fourier coefficients \(x_r\), define

\[
 \mathcal A_\lambda={\sqrt L\over2\pi}
             \overline V_\lambda C_\gamma,
 \qquad
 \mathcal M_\lambda={2\sqrt2\lambda\over\sqrt L}C_\gamma. \tag{7.5}
\]

Then

\[
 |x_r|\leq{\mathcal A_\lambda\over|r|}\quad(r\ne0),
 \qquad |x_0|\leq\mathcal M_\lambda.                  \tag{7.6}
\]

Put \(W_N=\log(3N)+1\) and \(H_N\leq1+\log N\).  The exact Cauchy-form
decomposition \(q_\lambda=D_a+D_bH-HD_b\) gives

\[
 \boxed{
 |q_\lambda(P,P)|
 \leq {2\mathcal A_\lambda^2\over N}
 \{W_N+C_{|a|}(\lambda)+c_\lambda\},}                 \tag{7.7}
\]

and, with \(|b_r|\leq B_b(\lambda)\),

\[
\boxed{
 |q_\lambda(P,W)|,\ |q_\lambda(W,P)|
 \leq {12B_b\mathcal A_\lambda^2H_N
              +4B_b\mathcal A_\lambda\mathcal M_\lambda\over N}.}
                                                               \tag{7.8}
\]

These estimates are uniform on the exact two-dimensional unit sphere.
The eigenvalue ordering and the pinned Logvinenko--Sereda bound give

\[
 d_8\geq d_4\geq
 6\,96^{-5-(320\pi/\log2)\lambda^2},                    \tag{7.9}
\]

so

\[
 {1\over d_8N}\leq C e^{-M_{\rm proj}\lambda^2},
 \qquad
 M_{\rm proj}=9600\log2-{320\pi\log96\over\log2}
 =34.286592117920468\ldots>0.                            \tag{7.10}
\]

The quantities \(B_b,C_{|a|},c_\lambda\) and all remaining factors in
(7.7)--(7.8) grow only polynomially in \(\lambda,L,\log N\).  Hence the
entire projection-containing matrix is `o(1)`.

The mixed physical/central terms are obtained from the radical identity
before taking absolute values.  For both \(i,j\in\{e,v\}\),

\[
 \mathcal W_Z(O_i,P_j)=-q_\lambda(X_i,P_j),\qquad
 \mathcal W_Z(P_i,O_j)=-q_\lambda(P_i,X_j).             \tag{7.11}
\]

Since \(X_i=W_i+P_i\), equations (7.7)--(7.11) prove

\[
 \boxed{
 [\mathcal W_Z(R_i,R_j)]_{i,j=e,v}
 =[\mathcal W_Z(O_i,O_j)]_{i,j=e,v}+\mathcal E_\lambda,
 \qquad \|\mathcal E_\lambda\|=o(1)}                  \tag{7.12}
\]

in operator norm.  Both mixed orientations are included.

Finally, the fixed-depth shift ledger applies to the compact metric
\(G=W^*W\), not to the global remainder norm, and gives

\[
 \boxed{\|U_\lambda G_\lambda\|=o(\lambda^{-4})=o(1).} \tag{7.13}
\]

## 8. Assembly and exact scope

The physical outer matrix is the sum of the positive pole (6.14), the
same-side Archimedean matrix (4.7), the bounded same-side prime matrix
(5.26), and the bounded complete reflected matrix (6.12).  Therefore

\[
 [\mathcal W_Z(O_i,O_j)]_{i,j=e,v}
 \succeq {E\over2}\log c\,I_2-CI_2.                   \tag{8.1}
\]

Insert (7.12)--(7.13) into (0.8).  Enlarging `C` once proves (0.10), and
the Schur criterion (0.12) follows from the exact determinant identity

\[
 \det(\mathsf H-\mu I)
 =(h_{vv}-\mu)
 \left(h_{ee}-\mu-{|h_{ev}|^2\over h_{vv}-\mu}\right). \tag{8.2}
\]

This closes the fixed label-`8/12` plane only.  In particular, (8.1) does
not control cross terms with label `16` or any growing rest, and it does
not furnish the inverse-action or reducing estimates required downstream.
No statement here changes a source lock, an artifact, replay output, or
the formal project status.
