# Klein quotient, annulus, and the remaining sign problem

This note derives the exact quotients of the existing elliptic model, their field and boundary conditions, and their energy bookkeeping. The quotient supplies a smaller fundamental domain and explicit symmetry conditions. It does **not** establish a new positivity inequality, remove the singularity at spectral infinity, or prove RH.

The geometric Dirichlet energies introduced here are different from the Poisson boundary forms called `E+` and `E−` in [BRIDGE-RESEARCH.md](BRIDGE-RESEARCH.md) and `dist/research-math.js`. In particular, real/imaginary parity under the critical reflection is not the height-offset parity used by those boundary forms.

## 1. Existing chart, including the spectral lens

Use the application's conventions

\[
E_r:\quad \eta^2=(w^2+r^2)(w^2+r^{-2}),\qquad r>1,
\]

\[
s_0=\frac1{1-w},\qquad s=\frac12+L\left(s_0-\frac12\right),\qquad L>0.
\]

`L = chartScale` is an explicit lens. It changes which finite spectral points occur at a given torus parameter, and does not assert a scaling identity of zeta. Both the literal chart `L=1` and the other positive lens values preserve

\[
w\longmapsto 1/\bar w\quad\Longleftrightarrow\quad
s\longmapsto1-\bar s.
\]

The spectral punctures are

\[
p_\pm=(1,\pm(r+r^{-1})),
\]

and the regular anti-bridge points are

\[
q_\pm=(-1,\pm(r+r^{-1})).
\]

The two points over `w=infinity` are regular geometric and spectral points, at `s=1/2−L/2`. They are not the spectral punctures.

## 2. Two different quotients

Let

\[
D(w,\eta)=(w,-\eta),\qquad
R(w,\eta)=\left(\frac1{\bar w},\frac{\bar\eta}{\bar w^2}\right),
\]

\[
A=DR:\quad A(w,\eta)=\left(\frac1{\bar w},-\frac{\bar\eta}{\bar w^2}\right).
\]

`D` is the holomorphic deck involution of the map to the projective `w` sphere. `R` and `A` are commuting antiholomorphic involutions. In the projective model

\[
X_1^2=X_0X_2,\qquad
X_3^2=X_0^2+(r^2+r^{-2})X_1^2+X_2^2,
\]

the global formula for `A` is

\[
A[X_0:X_1:X_2:X_3]
=[\bar X_2:\bar X_1:\bar X_0:-\bar X_3].
\]

To check that `A` is free, a fixed point would require `|w|=1`. Write `w=e^{iθ}` and `b=η/w`. Then

\[
b^2=r^2+r^{-2}+2\cos(2\theta)
=(r-r^{-1})^2+4\cos^2\theta>0.
\]

Thus `b` is nonzero real, while the fixed-point equation for `A` requires `b=−conj(b)`. There are no fixed points. The quotient `K=E_r/A` is consequently a closed nonorientable surface of Euler characteristic zero: a Klein bottle. Its analytic structure is a **Klein surface**, with holomorphic or antiholomorphic chart transitions, not a globally oriented Riemann surface.

By contrast, `R` fixes the two critical ovals. Its quotient `E_r/R` is an annulus, whose two boundaries are those ovals. The Klein quotient identifies these boundaries with each other. In particular, `p+` and `p−` become one spectral puncture; `q+` and `q−` become one regular anti-bridge point.

At `r=1` the elliptic curve is singular and `A` fixes its two nodes. None of the smooth-quotient conclusions should be applied at that endpoint. Identifying only two points of a smooth torus would instead produce a node, not the Klein quotient above.

## 3. Exact computational fundamental domain

Reuse `torusPoint` in `dist/elliptic.js`; no new inverse elliptic solver is needed. Its elliptic **parameter**, not modulus, is

\[
m=r^{-4},\quad K=K(m),\quad K'=K(1-m),\qquad
z=4Ku+2iK'(v-\tfrac12),
\]

\[
w=\frac{i}{r}\operatorname{sn}(z\mid m),\qquad
\eta=\operatorname{cn}(z\mid m)\operatorname{dn}(z\mid m),
\qquad (u,v)\in(\mathbb R/\mathbb Z)^2.
\]

Jacobi's period and translation identities give, modulo one,

\[
\boxed{R(u,v)=(u,\tfrac12-v),\quad
D(u,v)=(\tfrac12-u,1-v),\quad
A(u,v)=(\tfrac12-u,\tfrac12+v).}
\]

For example `R` is `z -> conj(z)+iK′`, using `sn(z+iK′)=1/(sqrt(m) sn(z))`; `D` is `z -> 2K−z`.

A common fundamental annulus for both quotients is

\[
\mathcal A=\{u\bmod1,\;\tfrac14\le v\le\tfrac34\}.
\]

Its interior maps to `|w|<1`, equivalently `Re s>1/2`. The two inner branch points are `(u,v)=(1/4,1/2),(3/4,1/2)`. They are regular points of the elliptic surface; the spectral map is branched there.

| Quotient | Boundary rule |
|---|---|
| `E_r/R`, annulus | Keep `v=1/4` and `v=3/4` as separate fixed boundaries. |
| `E_r/A`, Klein bottle | Glue `(u,1/4)` to `(1/2−u,3/4)`, modulo one. |

Landmarks in this parameterization are

\[
p_+=(0,\tfrac14),\quad p_-=(\tfrac12,\tfrac34),\qquad
q_-=(\tfrac12,\tfrac14),\quad q_+=(0,\tfrac34).
\]

For an intrinsic annulus drawing, use `y=2K′(v−1/4)` and

\[
\rho=\exp[-\pi y/(2K)],\qquad \theta=2\pi u,
\]

so the annulus radii are `exp[−πK′/(2K)]` and `1`. The corresponding map `exp(iπ(z+iK′/2)/(2K))` is conformal. A flat cylinder or a scaled radial annulus is also an honest display, provided the metric used for any energy calculation remains explicit.

An implementation can canonicalize `v` into the band with `R` for the annulus, or with `A` for the Klein bottle, remembering whether the field representative has been conjugated. Do not merge the two annulus boundaries. Do not weld points at the self-intersection of a three-dimensional Klein immersion: those are distinct points of the surface.

## 4. Field, seam, and boundary conditions

In this section `F(s)` is completed `ξ`, the symmetric theta heat family, or an explicitly chosen analytic control satisfying

\[
F(1-s)=F(s),\qquad F(\bar s)=\overline{F(s)}.
\]

Write its torus pullback as `f(u,v)=F(s(u,v))=U+iV`. Then

\[
f\circ D=f,\qquad f\circ R=f\circ A=\bar f.
\]

These identities hold for every positive lens `L`. They do **not** hold for raw zeta without its functional-equation multiplier. A raw-zeta scene must use completed-function diagnostics or display the multiplier explicitly; it cannot claim scalar modulus or phase descent by the rules below.

For the annulus, `U` is reflection-even and `V` is reflection-odd. On either regular boundary, away from the infinity punctures,

\[
\boxed{V=0,\qquad \partial_n U=0.}
\]

Thus `V` has a Dirichlet condition and `U` a Neumann condition. These are consequences of the analytic symmetry, not extra constraints chosen to force zeros onto the boundary.

For the Klein seam put `g(u)=1/2−u`. The value and derivative identifications are

\[
f(g(u),\tfrac34)=\overline{f(u,\tfrac14)},
\]

\[
f_u(g(u),\tfrac34)=-\overline{f_u(u,\tfrac14)},\qquad
f_v(g(u),\tfrac34)=\overline{f_v(u,\tfrac14)}.
\]

Equivalently, the outward normal derivatives on the two sides satisfy

\[
\boxed{\partial_n f(g(u),\tfrac34)
=-\overline{\partial_n f(u,\tfrac14)}.}
\]

The minus sign arises because the annulus has opposite outward normals at its two boundaries. Dropping it changes the gluing problem.

The magnitude and real part descend as ordinary real fields on the Klein surface. The imaginary part and phase require conjugating transitions. For the phase current, away from zeros,

\[
j=\operatorname{Im}(df/f)=d\arg f,\qquad A^*j=R^*j=-j.
\]

It is a twisted one-form on the Klein quotient. Apparent opposite circulation after a chart reversal does not cancel zero multiplicity on the orientable double cover.

## 5. Dirichlet energy and infinity terms

Use the flat conformal metric of the uniformization,

\[
|dz|^2=(4K)^2du^2+(2K')^2dv^2.
\]

For a complex field on a truncated region `Ω`, define

\[
\mathcal E_\Omega(f)
=\frac12\int_\Omega\left[
\frac{K'}{2K}|f_u|^2+\frac{2K}{K'}|f_v|^2
\right]du\,dv.
\]

This is the usual two-dimensional Dirichlet energy. It is unchanged by a conformal change of metric; it must not be computed using an arbitrary three-dimensional immersion's area and gradient while retaining this label.

Since `A` and `R` are isometries of this metric and conjugation preserves the field norm, matched symmetry cutoffs give

\[
\boxed{\mathcal E_{E_r}(f)
=2\mathcal E_{K_r}(f)
=2\mathcal E_{\mathcal A}(f).}
\]

This means the integrals over corresponding truncated regions. The Klein energy uses the conjugating bundle transition at its seam. The identity does not claim that the untruncated values are finite.

For holomorphic `f=U+iV`, Cauchy–Riemann gives the stronger pointwise statement

\[
|\nabla U|^2=|\nabla V|^2,
\qquad
\mathcal E_\Omega(U)=\mathcal E_\Omega(V).
\]

Their difference is identically zero. It cannot be substituted for the bridge's generally nonzero `E+−E−`.

Both real components are harmonic. On an annulus truncated near its infinity boundary points, Green's identity gives

\[
2\mathcal E_\Omega(U)=\int_{\partial\Omega}U\partial_nU\,d\ell,
\qquad
2\mathcal E_\Omega(V)=\int_{\partial\Omega}V\partial_nV\,d\ell.
\]

The regular critical-boundary contributions vanish, respectively by `∂nU=0` and `V=0`. Nontrivial contributions remain at the puncture cutoffs or other truncation edges. If the punctures were silently filled and homogeneous conditions imposed on the entire compact annulus, harmonic uniqueness would force `U` constant and `V=0`.

This is a useful obstruction: the nonconstant completed function necessarily retains its infinity contribution. Since `s` has a pole and `ξ` is transcendental entire, the puncture is essential. Its full analytic-field Dirichlet energy is not finite. Unweighted phase energy also has logarithmic divergences at ordinary zeros. Any renormalized energy needs its own explicitly defined subtraction and boundary terms.

## 6. An explicit annulus reference operator

The annulus is conformally the flat periodic strip `0≤x<ℓ`, `0≤y≤b`, where

\[
\ell=4K,\qquad b=K'.
\]

For an ordinary harmonic scalar with smooth finite boundary data, the Dirichlet-to-Neumann operator can be computed mode by mode. At frequency `k_n=2πn/ℓ`, let `κ=|k_n|`. For `n≠0`, its matrix on the two boundary traces is

\[
\boxed{\Lambda_n=\kappa
\begin{pmatrix}
\coth(\kappa b)&-\operatorname{csch}(\kappa b)\\
-\operatorname{csch}(\kappa b)&\coth(\kappa b)
\end{pmatrix}.}
\]

This follows directly by solving `h_n''−κ²h_n=0` with both endpoint values and taking the outward derivatives `−h_n'(0),h_n'(b)`. The symmetric and antisymmetric trace eigenvalues are

\[
\kappa\tanh(\kappa b/2),\qquad
\kappa\coth(\kappa b/2).
\]

For the zero mode,

\[
\Lambda_0=\frac1b\begin{pmatrix}1&-1\\-1&1\end{pmatrix},
\]

with eigenvalues `0` and `2/b`. Thus this reference operator is positive semidefinite; the constant mode is its kernel. With Fourier coefficients normalized by `1/ℓ`, the energy is `(ℓ/2) Σ h_n* Λ_n h_n`.

The zero-mode entries can also be checked without a limiting argument. For endpoint values `c_0,c_1`, its harmonic extension is `h_0(y)=c_0+(c_1−c_0)y/b`. The two outward derivatives are `(c_0−c_1)/b` and `(c_1−c_0)/b`, giving exactly the displayed matrix and its eigenvalues.

The Klein gluing adds the trace rule `f_1(x)=conj(f_0(ℓ/2−x))`, or Fourier coefficients `b_n=(−1)^n conj(a_n)`. The accompanying normal-derivative rule is still required. Actual completed-function boundary data have the essential puncture, so the smooth finite-data calculation alone cannot replace their full problem.

This operator is a useful, exactly soluble comparison object. No identity has been established that makes the existing theta bridge form a positive perturbation of it.

## 7. Relation to the existing bridge energies and Schur complement

The existing boundary forms use the spectral trace `U_a(t)=F(1/2+a+it)` and

\[
P_a(t_1,t_2)=
\frac{\operatorname{Im}(\overline{U_a(t_1)}U_a(t_2))}
{a(t_2-t_1)},
\qquad P_a(t,t)=W(\tfrac12+a+it)/a,
\]

\[
E_\pm=\int_0^\infty\omega_{a,h}(r)
\frac{D_-+D_+\pm2C}{4}\,dr,
\qquad E_+-E_-=W(\tfrac12+h+it)/h.
\]

Here `D±=P_a(t±r,t±r)` and `C=P_a(t−r,t+r)`; the exact density and endpoint measures are recorded in [BRIDGE-RESEARCH.md](BRIDGE-RESEARCH.md). This parity exchanges the two heights `t−r,t+r`. It is not the transverse reflection `s -> 1−conj(s)`.

The transverse reflection has

\[
W(1-\bar s)=-W(s),\qquad
\frac{W(1-\bar s)}{\operatorname{Re}(1-\bar s)-1/2}
=\frac{W(s)}{\operatorname{Re}s-1/2}.
\]

Consequently `W` is signed under the quotient, while `W/(σ−1/2)` is invariant away from the axis. Extending the boundary-kernel notation to signed nonzero `a` also gives `P_{−a}=P_a`: both its numerator and denominator reverse sign. The existing bridge forms therefore retain their original values after a correct coordinate change. They are not divided by two merely because a geometric cover has been folded.

For a useful axis check, write `h(t)=F(1/2+it)`, real on the line. Then

\[
\boxed{\lim_{x\to0}\frac{W(1/2+x+it)}x
=h'(t)^2-h(t)h''(t).}
\]

This follows from `F'=-ih'`, `F''=-h''` on the line. In terms of `U,V`, it contains both the square `V_x²` and the signed curvature contribution `U U_xx`. The equality of their total Dirichlet energies does not control this pointwise difference.

Similarly the finite Gram inspector's exact block identity remains

\[
Q_{\rm eff}=A_{\rm live}-BC^{-1}B^*,\qquad
\operatorname{ind}_-(Q)=\operatorname{ind}_-(C)
+\operatorname{ind}_-(Q_{\rm eff}),
\]

when `C` is invertible. A correct invertible coordinate change or congruence preserves the negative-index account. A symmetry reduction can block-diagonalize an operator only after proving that the **actual kernel and its domain** respect that symmetry. The annulus Laplacian's parity cannot be used to set the bridge coupling `B` to zero. Discarding an odd sector without an equivalence theorem would change the statement being tested.

The quotient therefore provides an equivalent, less redundant presentation. The still-missing mathematical step is an exact identity or comparison connecting the full theta bridge operator to a positive reference form, with a global bound on the remaining signed coupling and with all infinity/tail contributions controlled. No such new bound is claimed here.

## 8. A symmetry-preserving counterexample to topology-only trapping

The following exact control retains more than the quotient symmetry. It is entire, is strictly positive on the real spectral axis, has an essential singularity at infinity, and nevertheless has an off-critical zero quartet. Define the local spectral variable `u_s=s−1/2` (distinct from the torus parameter `u`) and take

\[
\boxed{
Q_{a,T}(s)=\cosh(u_s)
\bigl[u_s^2-(a+iT)^2\bigr]
\bigl[u_s^2-(a-iT)^2\bigr],
\qquad 0<a<\tfrac12,\quad T>0.
}
\]

The polynomial factor has the explicitly real, even form

\[
\bigl(u_s^2-a^2+T^2\bigr)^2+4a^2T^2.
\]

Since `cosh` is also even with real Taylor coefficients,

\[
Q_{a,T}(1-s)=Q_{a,T}(s),\qquad
Q_{a,T}(\bar s)=\overline{Q_{a,T}(s)},
\]

and hence

\[
Q_{a,T}(1-\bar s)=\overline{Q_{a,T}(s)}.
\]

It therefore satisfies exactly the same conjugating rule on the Klein quotient and the same annulus reflection conditions as the completed field.

For real `s`, the variable `u_s` is real, so `cosh(u_s)>0` and

\[
\bigl(u_s^2-a^2+T^2\bigr)^2+4a^2T^2>0.
\]

Thus `Q_{a,T}(s)>0` on the entire real spectral axis. On the critical line it is real, as required by the same symmetry.

Its polynomial factor supplies four distinct simple zeros

\[
\boxed{s=\tfrac12\pm a\pm iT,}
\]

all inside `0<Re s<1` and all off the critical line. None is cancelled or coincides with a zero of `cosh`, since zeros of `cosh(u_s)` have purely imaginary `u_s`, whereas these four have real part `±a`. The remaining zeros are the critical-line sequence

\[
s=\tfrac12+i\pi(n+\tfrac12),\qquad n\in\mathbb Z.
\]

In particular `Q_{a,T}` has infinitely many zeros and is a nonconstant, nonpolynomial entire function, so infinity is an essential singularity. Its pullback to `E_r` has essential singularities at both `p_±`; the Klein quotient retains one essential puncture. The off-critical quartet still gives zeros away from the quotient's critical seam. The quotient has only identified symmetry-related lifts; it has not moved their spectral locations onto the line.

**This control is not ξ.** It refutes a trapping claim based only on this topology, reflection/conjugation symmetry, real-axis positivity, and essential infinity. It is not a counterexample to RH. A successful argument must use additional specific properties of the full theta kernel or another exact analytic structure that this control does not share.

## 9. Implementation and verification targets

1. **Geometric identities:** check the curve equation, projective extension, involution squares, commutation, and the affine/UV formulas at ordinary points and near reciprocal-chart points. Keep the singular `r=1` endpoint excluded.
2. **Exact pairing:** verify spectral reflection `(σ,t)->(1−σ,t)`, `p+↔p−`, `q+↔q−`, annulus boundary fixedness, and the reversed Klein seam. The spectral infinity mask must survive canonicalization.
3. **Field scope:** use analytic symmetric polynomials to test field and derivative identities independently of the xi evaluator; separately sample ξ and heat. Raw ζ must not be falsely marked equivariant.
4. **Boundary jets:** test `V=0`, `∂vU=0`, the tangential derivative reversal, and the opposite outward normal signs away from punctures. Use an absolute-plus-relative tolerance where the field is small.
5. **Energy bookkeeping:** on symmetry-matched finite domains verify the factor of two; on holomorphic sample patches verify equality of the `U,V` energy densities. Do not infer convergence of the omitted essential puncture.
6. **Reference operator:** verify the annulus DtN matrices and their two explicit eigenvalues, including the separate zero mode. Use stable small-argument formulas for `κb` near zero.
7. **Research invariance:** at fixed spectral nodes, vary `r` and positive `L` and pull those same nodes back through the chart. Existing bridge and Gram values must remain unchanged within numerical error. Values at fixed UV need not remain unchanged, because the lens changes the sampled spectral points.
8. **Negative control:** the explicit `Q_{a,T}` above must retain its off-critical quartet in the quotient; the simpler polynomial `(s−1/2)²−a²` also tests symmetry alone. The seam must not project these zeros onto the critical circle or label them annihilated.

## Sources and provenance

- The implementation conventions above are those of `dist/elliptic.js`, `dist/projective.js`, and `docs/ROADMAP.md` in this repository.
- The existing bridge definitions and frozen Math Explorer sources are recorded in [BRIDGE-RESEARCH.md](BRIDGE-RESEARCH.md).
- [NIST DLMF §22.2](https://dlmf.nist.gov/22.2), [§22.4](https://dlmf.nist.gov/22.4), and [§22.13](https://dlmf.nist.gov/22.13) supply the standard theta representations, periods, translations, and derivatives used by the elliptic parameterization. DLMF's `k` is the modulus; this application's `m=k²` is the parameter.
- The quotient, boundary, energy, and Fourier Dirichlet-to-Neumann formulas in this note are derived above from those coordinates. They are exact identities; floating-point displays of them are numerical checks, not interval certificates.
