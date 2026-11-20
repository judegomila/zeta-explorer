# Annulus coupling, the actual theta flux, and the missing odd-sector estimate

Research derivation, 14 November 2026. This note compares an exactly solvable annulus boundary operator with the actual theta cutoff-energy operator. It supplies an explicit conditional coupling criterion, an exact parity reduction of the theta operator, and a theta-specific positivity theorem for a cone of odd tests. It does not prove positivity on every odd test or RH.

## 1. Keep the four decompositions distinct

There are four different uses of “two sides” in this program:

1. The two geometric boundary components of the reflection annulus.
2. The real and imaginary components of the completed field, which have even/odd transverse reflection laws.
3. The spectral heights `T-r,T+r` in the Poisson boundary forms `E+` and `E−`.
4. The Mellin-coordinate reflection `u -> 2c-u` at a cutoff `c` in the theta convolution energy.

They are not interchangeable parity decompositions. In particular, the Fourier mode `n` along the compact annulus boundary is not the Fourier/Mellin variable appearing in the theta kernel. A matrix block created by freezing selected test nodes need not coincide with any of these parity blocks.

## 2. Exact annulus coupling and its Schur margin

For the uniformizing cylinder of circumference `ell=4K` and width `b=K′`, put

\[
\kappa_n=\frac{2\pi |n|}{\ell},\qquad x_n=\kappa_n b.
\]

The ordinary harmonic Dirichlet-to-Neumann block for `n != 0` is

\[
\Lambda_n=\begin{pmatrix}d_n&-c_n\\-c_n&d_n\end{pmatrix},
\qquad d_n=\kappa_n\coth x_n,
\qquad c_n=\kappa_n\operatorname{csch}x_n.
\]

Dividing both boundary coordinates by the diagonal energy scale gives the exact normalized coupling

\[
\boxed{\rho_n=c_n/d_n=\operatorname{sech}x_n.}
\]

The normalized block has eigenvalues `1−rho_n` and `1+rho_n`. Eliminating either boundary gives the exact Schur complement

\[
\boxed{d_n-c_n^2/d_n=\kappa_n\tanh x_n
       =d_n(1-\rho_n^2).}
\]

Thus high intrinsic boundary frequencies have exponentially small coupling:

\[
0<\rho_n\le 2e^{-2\pi |n|b/\ell}.
\]

The zero mode must be kept separate:

\[
\Lambda_0=\frac1b\begin{pmatrix}1&-1\\-1&1\end{pmatrix},
\qquad \rho_0=1.
\]

It has a constant-trace null vector. No strictly positive uniform margin holds on the full trace space without handling that vector.

At the app's `r=2`, `m=r^-4=1/16`, numerical evaluation gives

\[
2\pi b/\ell\simeq2.75655171087,\quad
\rho_1\simeq0.126510497844,
\quad1-\rho_1\simeq0.873489502156.
\]

These decimals are reproducible floating-point illustrations of the exact formulas, not interval bounds for the theta operator.

### Conditional transfer lemma

Suppose, on a specified common form domain, an actual two-boundary operator has blocks

\[
Q=\begin{pmatrix}D&B\\B^*&E\end{pmatrix},
\]

and a positive reference weight `D0` satisfies

\[
D\succeq(1-\epsilon_D)D_0,\qquad
E\succeq(1-\epsilon_E)D_0,
\]

\[
\|D_0^{-1/2}BD_0^{-1/2}\|
\le\rho+\beta,
\qquad \epsilon_D,\epsilon_E<1.
\]

Then the block is positive if

\[
\boxed{(\rho+\beta)^2\le(1-\epsilon_D)(1-\epsilon_E).}
\tag{A}
\]

Indeed, with `X=||D0^(1/2) f||` and `Y=||D0^(1/2)g||`, its quadratic form is bounded below by

\[
(1-\epsilon_D)X^2-2(\rho+\beta)XY+(1-\epsilon_E)Y^2.
\]

The scalar two-by-two determinant condition is exactly (A). For the annulus modes `|n|>=N>=1`, take

\[
\rho=\operatorname{sech}(2\pi Nb/\ell).
\]

This is a usable theorem only after constructing the actual identification, domain, diagonal lower bounds and remainder estimate. It cannot be applied by merely drawing the theta field on the annulus.

### Low/high mode certificate

Alternatively, normalize by the reference weights and split into a finite low sector and a high sector:

\[
\widetilde Q=\begin{pmatrix}Q_{LL}&Q_{LH}\\Q_{HL}&Q_{HH}\end{pmatrix}.
\]

If a proved high-sector estimate gives

\[
Q_{HH}\succeq\gamma I,\quad\gamma>0,
\qquad\|Q_{LH}\|\le\delta,
\qquad Q_{LL}\succeq\alpha I,
\]

then

\[
\boxed{\alpha\ge\delta^2/\gamma}
\tag{B}
\]

suffices. The sharper finite statement is `Q_LL−Q_LH Q_HH^-1 Q_HL >= 0`. For an annulus reference plus a normalized high-sector perturbation of norm at most `epsilon`, one may take

\[
\gamma=1-\operatorname{sech}(2\pi Nb/\ell)-\epsilon.
\]

The constant mode belongs in the low block. There is no permission here to discard it or to add a positive regularization and then forget the regularization.

## 3. The actual theta cutoff operator

Use the normalization of the frozen Math Explorer cutoff note:

\[
F(z)=\xi(1/2+z)=\int_{\mathbb R}\kappa(u)e^{zu/2}\,du,
\]

\[
\kappa(u)=\Phi(u/4),\qquad
h_\pm(u)=(1\pm\alpha u/2)\kappa(u),\quad\alpha>0.
\]

Let `A` be convolution by `h+`, `A*` convolution by `h−`, and `Q_c` the right-tail projection. For a preimage `a in L²(R)`, define `f=Aa` and `g=A*a`. The exact energy law is

\[
\|Q_cg\|_2^2-\|Q_cf\|_2^2=-\langle a,H_ca\rangle,
\]

\[
H_c(u,v)=2\alpha\int_{|c-(u+v)/2|}^{\infty}
 t\kappa\!\left(t-\frac{u-v}{2}\right)
  \kappa\!\left(t+\frac{u-v}{2}\right)dt.
\tag{C}
\]

This is an ordinary `L²(R)` bounded operator; the frozen source proves it is trace class. The kernel is entrywise positive, but entrywise positivity is not operator positivity.

### Exact parity reduction

Set `J_c a(u)=a(2c-u)`. Formula (C) gives

\[
H_c(2c-u,2c-v)=H_c(u,v),\qquad [H_c,J_c]=0.
\]

Consequently the actual cutoff operator already splits into its Mellin-even and Mellin-odd parts. Using the unitary half-line embeddings

\[
(U_+p)(c+x)=p(|x|)/\sqrt2,
\qquad
(U_-p)(c+x)=\operatorname{sgn}(x)p(|x|)/\sqrt2,
\]

the two half-line kernels are exactly

\[
\boxed{H_+(x,y)=H_0(x,y)+H_0(x,-y),}
\]

\[
\boxed{H_-(x,y)=H_0(x,y)-H_0(x,-y),\qquad x,y>0.}
\tag{D}
\]

There is no even/odd cross block in this decomposition. This does not remove a frozen/live or head/residual coupling within either sector, and it says nothing automatic about spectral-height parity around an arbitrary `T`.

## 4. The positive Gram majorant misses the whole odd sector

The earlier explicit Gram majorant is

\[
G_c(u,v)=\alpha\int_0^\infty
 \kappa\!\left(\sqrt{s+(u-c)^2}\right)
 \kappa\!\left(\sqrt{s+(v-c)^2}\right)ds
 =B_c^*B_c(u,v),
\]

where

\[
(B_ca)(s)=\sqrt\alpha\int_{\mathbb R}
 \kappa\!\left(\sqrt{s+(u-c)^2}\right)a(u)du.
\]

There is an exact decomposition `H_c=G_c−Delta_c`. **No additional diagonal term is present.** Because each feature of `B_c` is even about `c`,

\[
\boxed{B_c P_-=0,\quad G_cP_-=0,\quad
       H_c\big|_{\mathcal H_-}=-\Delta_c\big|_{\mathcal H_-}.}
\tag{E}
\]

Thus the existing Gram majorant provides no coercivity on *any* odd preimage. In particular an estimate

\[
|\langle a,\Delta_ca\rangle|
\le\epsilon\langle a,G_ca\rangle
\]

cannot hold on all odd tests for any finite `epsilon`, unless `Delta_c` vanishes on the odd sector. It does not vanish: the strict positive odd-kernel result below gives nonzero forms there.

This identifies an exact missing component in the proposed comparison method. Improving an even-sector Gram lower bound cannot by itself control the odd sector. A proof must provide a separate positive odd reference/factorization, or directly prove the sign `Delta_- <= 0`. The one-sided target `Delta <= G` is still possible: its odd-sector content is precisely that unproved sign. The obstruction concerns an *absolute small-remainder* strategy, not that one-sided target itself.

## 5. A theta-specific theorem for the odd kernel

The nontrivial input is the established strict convexity

\[
V(t)=-\log\kappa(\sqrt t),\qquad t>0.
\tag{F}
\]

It follows from Csordas, Theorem 4.2(b), after the fixed scaling `kappa(u)=Phi(u/4)`. No zero-location assumption is used.

### Theorem

For the actual theta kernel and every `x,y>0`,

\[
\boxed{H_-(x,y)=H_0(x,y)-H_0(x,-y)>0.}
\tag{G}
\]

### Proof

For any `u,v`, put `m=(u+v)/2`, `d=(u-v)/2` in (C), and substitute `s=t²−m²`. Then

\[
H_0(u,v)=\alpha\int_0^\infty
 \kappa(\sqrt{s+m^2}-d)\kappa(\sqrt{s+m^2}+d)ds.
\]

For the same-sign pair `(x,y)`, set

\[
m_s=(x+y)/2,\qquad d_s=(x-y)/2.
\]

For the opposite-sign pair `(x,-y)`, set

\[
m_c=(x-y)/2=d_s,\qquad d_c=(x+y)/2=m_s.
\]

The two squared arguments of either integrand have the same sum,

\[
2s+x^2+y^2.
\]

Their absolute spreads are `4|d_s| sqrt(s+m_s²)` and `4d_c sqrt(s+m_c²)`, respectively. The difference of the squared spreads is

\[
16\big[d_c^2(s+m_c^2)-d_s^2(s+m_s^2)\big]
=16xy s>0\quad(s>0).
\]

Therefore the opposite-sign squared-argument pair is strictly more separated at fixed sum. Strict convexity (F) makes its sum of `V` values strictly larger whenever the arguments are positive. The possible zero argument at the single value `s=xy` is handled by continuity at zero and does not affect the integral. Evenness of `kappa` and exponentiation show that the opposite-sign product is strictly smaller almost everywhere. Integrating gives (G).

### Exact consequence: an additional cone of sign-changing preimages

If an odd-about-`c` preimage has one constant complex phase on its positive half-line,

\[
a(c+x)=e^{i\theta}p(x)/\sqrt2,\quad
 a(c-x)=-e^{i\theta}p(x)/\sqrt2,\qquad p(x)\ge0,
\]

then (D) and (G) yield

\[
\langle a,H_ca\rangle
=\int_0^\infty\!\int_0^\infty p(x)H_-(x,y)p(y)dxdy\ge0.
\]

For nonzero `p in L²` the inequality is strict; positivity can be seen on a bounded subset where `p` is positive, and all remaining integrands are nonnegative. The bounded operator identity extends the integral argument by truncation. Therefore

\[
\boxed{\|Q_cA^*a\|_2\le\|Q_cAa\|_2}
\tag{H}
\]

holds for this whole cone of globally sign-changing inputs. This extends the elementary nonnegative-preimage contraction to a class of antisymmetric preimages with one sign on each half-line.

It does **not** establish `H_- >= 0` for arbitrary half-line functions with changing signs or phase. Positive entries can still produce negative quadratic forms for oscillatory coefficients. It also does not imply that the regularized box-pulse preimages lie in this cone, and the parity is relative to the particular cutoff `c`.

### The same theorem survives actual theta heat deformation

The app uses `partial_tau F_tau=(1/4)partial_s² F_tau`. In the present Mellin normalization this is

\[
\kappa_\tau(u)=e^{\tau u^2/16}\kappa(u),\qquad\tau\in\mathbb R.
\]

For every finite real `tau`, this kernel remains positive, even and rapidly decreasing. Moreover

\[
-\log\kappa_\tau(\sqrt t)=V(t)-\tau t/16,
\]

so strict convexity is unchanged. Equivalently, the two products in the proof acquire the same multiplier

\[
e^{\tau(2s+x^2+y^2)/16}.
\]

Thus (G) and (H) apply to the actual symmetric theta heat family for every finite real heat time. This is compatible with off-axis zeros at some negative times, because full odd-sector positivity has not been established.

## 6. Why ordinary annulus coercivity cannot simply be imported

The theta cutoff operator `H_c` is compact on ordinary `L²(R)`; the annulus DtN operator is a first-order unbounded operator on the two-boundary `L²` trace space and has a strictly positive spectral gap after the common constant mode is removed.

Suppose an identification `T` is bounded and boundedly invertible between these `L²` Hilbert spaces (or their infinite-dimensional subspaces). Then `T*H_cT` remains compact. It cannot satisfy

\[
T^*H_cT\succeq c\Lambda\quad\text{for any }c>0
\]

on all smooth mean-zero annulus traces. If `e_n` are normalized high Fourier modes, compactness gives

\[
\langle e_n,T^*H_cTe_n\rangle\longrightarrow0,
\]

whereas the right-hand side is at least `c lambda_gap` and in fact grows with frequency. Even a lower comparison by `cI` is impossible on the full infinite-dimensional space.

This statement is specifically about bounded invertible transformations of ordinary `L²`. It does not rule out an explicitly justified unbounded Sobolev or trace map, a smoothing/noninvertible feature transform, or a reference form with compactly decaying weights. Such a method must supply its domain, kernel/nullspace and range estimates. Merely changing the geometric picture does not do so.

The same issue explains why dialing the arbitrary geometric shape `r` to make `sech(2 pi b/ell)` small cannot force the actual bridge coupling small. The spectral bridge values at fixed spectral nodes are independent of `r`; the identification and remainder change with the geometric comparison.

## 7. Concrete continuation target

The useful conclusion is to work on the actual half-line odd kernel (D), not to assert that it inherits the annulus DtN sign:

1. Use the exact parity reduction to separate the theta cutoff problem before any frozen/live Schur analysis.
2. Retain the even Gram representation where it applies, but construct an independent odd reference. The prior `G_c` is identically zero there.
3. On the odd half-line, exploit the proved positive-entry formula (G) to isolate the negative contribution of sign-changing/oscillatory test coefficients. A genuine factorization, total-positivity theorem, or relative operator bound for this kernel would add information beyond the present result.
4. If an annulus-based comparison is pursued, choose a reference with the correct compact spectral scale and prove the intertwiner and remainder bounds. Then criterion (A) or (B) states exactly how much coupling is affordable.
5. Test the regularized pulse preimages against the new cone. Membership is a separate analytic assertion; no positivity of their signs has been proved here.

This is a more precise target than a generic no-escape claim: the old positive term has a whole odd nullspace, and the exact remaining kernel on that nullspace is now explicit. The new cone theorem handles one family of sign-changing inputs; arbitrary oscillatory odd inputs remain the barrier.

## 8. What symmetry gives for the actual regularized box-pulse preimages

Let `f0=1_[0,1]`, `m=1/2`, `T=A*A`, and

\[
R_\varepsilon=(T+\varepsilon I)^{-1},\qquad
 a_\varepsilon=R_\varepsilon A^*f_0.
\]

Write `K` for convolution by `kappa` and `O` for convolution by the real odd kernel `alpha u kappa(u)/2`. Then

\[
A=K+O,\qquad A^*=K-O,
\qquad J_m A^*J_m=A,\qquad [R_\varepsilon,J_m]=0.
\]

The pulse is even about its midpoint: `J_m f0=f0`. Therefore the exact ordinary parity components are

\[
\boxed{a_{\varepsilon,+}=R_\varepsilon Kf_0,
\qquad a_{\varepsilon,-}=-R_\varepsilon Of_0.}
\tag{I}
\]

They are real-valued and respectively even/odd about `m`. Realness follows because all kernels and the inverse of the real operator `T+epsilon I` preserve conjugation. Equation (I) supplies **no pointwise sign** for either component.

Before applying the resolvent there are useful signs:

\[
Kf_0(u)>0,
\qquad
(Of_0)(m+x)=\frac\alpha2
 \int_{x-1/2}^{x+1/2} t\kappa(t)dt>0\quad(x>0).
\]

The second inequality uses only oddness and positivity of `t kappa(t)` for positive `t`. Thus the unregularized odd source has the one-sign half-line property. Passing that property through `R_epsilon` is an additional assertion, not a consequence of its positive self-adjoint operator order.

In fact a generic cone-preservation shortcut fails. The convolution kernel `t_T` of `T=A*A` has

\[
t_T(0)=\|h_+\|_2^2>0,
\qquad t_T''(0)=-\|h_+'\|_2^2<0.
\]

Its odd half-line kernel is `t_T(x−y)−t_T(x+y)>0` for sufficiently small positive `x,y`. Pick nonzero, nonnegative, disjointly supported half-line tests `p,q` within such an interval. For large `epsilon`, the norm-convergent Neumann expansion gives

\[
\langle q,R_{\varepsilon,-}p\rangle
=-\varepsilon^{-2}\langle q,T_-p\rangle
+O(\varepsilon^{-3})<0.
\]

The identity term vanishes by disjoint support. Thus the odd-sector resolvent is **not** positivity preserving for every regularization parameter. This does not prove that the particular pulse component in (I) changes sign, and it says nothing decisive about its small-`epsilon` asymptotic signs. It does rule out a general positivity-preserving-resolvent argument without additional information about this specific source and limiting regime.

There is also a compact exact phase relation. For the boundary unitary multiplier `C0=A*/A` (interpreted almost everywhere),

\[
\boxed{J_m a_\varepsilon=C_0^*a_\varepsilon.}
\tag{J}
\]

Equivalently `a_epsilon` lies in the fixed subspace of the unitary involution `C0 J_m`. This is a phase-dependent reflection, not ordinary oddness. For the actual desired endpoint cutoff `c=1`, write `(T_h a)(u)=a(u-h)`. Then

\[
\boxed{J_1a_\varepsilon=T_1C_0^*a_\varepsilon,}
\tag{K}
\]

so the endpoint preimage is not forced to be even or odd about `1`.

Finally, `f_epsilon=Aa_epsilon=T(T+epsilon I)^(-1)f0` remains even about `m`, hence exactly half its total energy lies on either side of that midpoint. The output `g_epsilon=C0 f_epsilon` need not have that ordinary parity. Norm conservation does not specify its right-tail distribution. The needed endpoint inequality at `c=1` therefore remains unresolved; pulse symmetry alone does not put its preimages into the newly proved odd positive cone.

## Sources and audit trail

- Frozen Math Explorer source: [theta_boundary_energy.md, commit 69d4049f](https://github.com/judegomila/mathexplorer/blob/69d4049f289217812051188378a0a9f3f061a169/rigorous/theta-bridge-2026-11-08/theta_boundary_energy.md). Equations (2.1)–(2.4) define the exact energy/kernel; (3.4)–(3.6) define the Gram majorant and remainder; (4.9) states trace class on ordinary L². There is no missing diagonal correction in `H=G−Delta`.
- [theta_boundary_two_point.md, same commit](https://github.com/judegomila/mathexplorer/blob/69d4049f289217812051188378a0a9f3f061a169/rigorous/theta-bridge-2026-11-08/theta_boundary_two_point.md) gives the stronger-concavity input, two-point result and finite-configuration end-region asymptotic. Its limiting `sech((u−v)/2)` kernel is a different object from the annulus mode-coupling `sech(kappa_n b)`.
- George Csordas, [Fourier Transforms of Positive Definite Kernels and the Riemann xi-Function](https://arxiv.org/pdf/1309.0055), Theorem 4.2(b), printed page 11 / PDF page 10. Directly inspected: `log Phi(sqrt(t))` is strictly concave for `t>0`. The normalization of `Phi` is equation (4.2) on the preceding page.
- [theta_rational_residual_20261109.md, commit 146ce77a](https://github.com/judegomila/mathexplorer/blob/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md), section 4, records the distinct verified-head/residual Schur problem. The reflection parity reduction above does not eliminate that coupling.
- `zeta-view/docs/KLEIN-ANNULUS.md` fixes the Jacobi/annulus conventions; `docs/BRIDGE-RESEARCH.md` and `dist/research-math.js` fix the separate spectral Poisson forms and finite Gram inspector.

The new statements above are explicit derivations from these definitions and the stated known concavity theorem. No novelty claim is made, no finite numerical test is promoted to an infinite-dimensional sign theorem, and no RH assumption is used in the odd-cone result.
