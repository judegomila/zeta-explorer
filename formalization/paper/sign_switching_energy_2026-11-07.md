# Sign switching: modal diameter and boundary energy

Research checkpoint, 7 November 2026. Companion to `/sign-switching`.

## Status and purpose

Two exact identities connect a visible sign switch to the bridge-positivity program:

1. In the quadratic double-zero collision model, the negative first-modal interval is the open diameter of the closure of the negative right shear half-disk.
2. For the full Riemann completed function, inward normalized shear is the difference of an even energy and an odd energy, both obtained from an unconditionally positive boundary kernel.

The first identity is an exact local model. The second is an exact full-function identity. The inequality that would close the RH argument is not proved here. The app's full-function examples are finite numerical benchmarks, not interval certificates. These calculations do not establish a novelty claim relative to the existing modulus-monotonicity, Hermite–Biehler, or heat-flow literature.

## 1. Local geometry, including the critical-line qualification

Use centered, rescaled coordinates `w = x + iy`, with the symmetry line `x = 0`, and set

\[
F_\varepsilon(w)=w^2+2\varepsilon,\qquad
W(x,y)=\Re\{F_\varepsilon'(w)\overline{F_\varepsilon(w)}\}.
\]

Direct multiplication gives

\[
W(x,y)=2x(x^2+y^2+2\varepsilon),\qquad
\mathfrak L_1(y)=4y^2+8\varepsilon.
\]

For `epsilon < 0`, put `R = sqrt(-2 epsilon)`. Then

\[
\{x>0:W(x,y)<0\}=\{x>0:x^2+y^2<R^2\},
\]

and

\[
\{y:\mathfrak L_1(y)<0\}=(-R,R).
\]

Thus the negative interval is exactly the open diameter of that half-disk's closure. The two endpoints are excluded. The diameter itself is **not** part of the strict negative-shear set: `W(0,y) = 0` by symmetry. The precise bridge between the statements is

\[
\lim_{x\downarrow0}\frac{W(x,y)}x
=2(y^2+2\varepsilon)=\frac12\mathfrak L_1(y).
\]

The zeros change as follows when epsilon decreases:

| Parameter | Zeros | Negative first-modal interval |
|---|---|---|
| `epsilon > 0` | `w = +/- i sqrt(2 epsilon)` | none |
| `epsilon = 0` | double zero at `w = 0` | none; the mode vanishes at zero |
| `epsilon < 0` | `w = +/- sqrt(-2 epsilon)` | `abs(y) < sqrt(-2 epsilon)` |

The phase winding of `F` on a fixed contour enclosing both zeros is two in all three cases. The local topological count permits this collision and departure. It does not by itself trap zeros on the symmetry line.

For a double-zero heat collision, this quadratic is the leading rescaled local profile. Higher-multiplicity collisions have different Hermite profiles. Neither the exact circular boundary nor the displayed off-axis zeros are asserted for undeformed Riemann xi.

## 2. The same local model has an exact energy interpretation

Rotate the model to a real-entire function on a horizontal symmetry axis:

\[
f_\varepsilon(z)=-F_\varepsilon(iz)=z^2-2\varepsilon.
\]

For a real entire `f`, define the normalized bridge kernel

\[
P_h(z,w)=
\frac{f(z+ih)f(\bar w-ih)-f(z-ih)f(\bar w+ih)}
{2ih(\bar w-z)}.
\]

Its diagonal is understood by continuity. For the polynomial,

\[
P_h(z,w)=2z\bar w+2h^2+4\varepsilon.
\]

The boundary kernel `P_a` is positive semidefinite exactly when `a^2 + 2 epsilon >= 0`. A feature vector is

\[
\Phi_a(t)=\left(\sqrt{2a^2+4\varepsilon},\sqrt2\,t\right).
\]

Take the even and odd combinations about a height `t`:

\[
\Phi_\pm(t,r)=\frac{\Phi_a(t+r)\pm\Phi_a(t-r)}2.
\]

Their squared norms are `2(a^2+t^2+2 epsilon)` and `2r^2`. The bridge probability weight below has second moment `a^2-h^2`, hence

\[
E_+=2(a^2+t^2+2\varepsilon),\qquad
E_-=2(a^2-h^2),
\]

\[
E_+-E_-=2(t^2+h^2+2\varepsilon)=\frac{W(h,t)}h.
\]

At `h = 0`, the continuous value is `L1(t)/2`. At `h > 0`, its negative set is the actual open half-disk. This is why one slider can drive all three app readings: geometry, modal sign, and energy difference.

For example, `a = 1`, `epsilon = -1/4`, `t = 0`, `h = 0.1` gives

\[
E_+=1,\qquad E_-=1.98,\qquad E_+-E_-=-0.98.
\]

The starting boundary is positive semidefinite. Positivity of that boundary alone therefore does not imply positive inward shear.

## 3. Exact bridge reconstruction for the full Riemann function

Now take

\[
f(z)=\Xi(z)=\xi\!\left(\frac12+iz\right),\qquad
\xi(s)=\frac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s).
\]

Define

\[
W_h(t)=-\Im\{f'(t+ih)\overline{f(t+ih)}\}
=\frac12\partial_h|f(t+ih)|^2.
\]

Then `P_h(t,t) = W_h(t)/h`, and

\[
P_0(t,t)=f'(t)^2-f(t)f''(t).
\]

The unconditional critical strip for the zeros, together with the shifted Hermite–Biehler kernel construction, supplies a positive semidefinite `P_a` for `a >= 1/2`. This uses no RH assumption. The app takes `a = 1/2`.

For `0 < h < a`, put

\[
p_{a,h}(r)=\frac{\sin(\pi h/a)}
{2h[\cosh(\pi r/a)+\cos(\pi h/a)]},
\]

\[
\omega_{a,h}(r)=-2r\,p_{a,h}'(r)
=\frac{\pi r\sin(\pi h/a)\sinh(\pi r/a)}
{ah[\cosh(\pi r/a)+\cos(\pi h/a)]^2},\qquad r\ge0.
\]

The first is a probability density on the whole real line; omega is a probability density on the **half-line**. Their domains must not be interchanged. The exact reconstruction is

\[
\boxed{P_h(t,t)=\int_0^\infty\omega_{a,h}(r)P_a(t-r,t+r)\,dr.}
\]

### Derivation

Write `g(q) = f(t-q)f(t+q)` and

\[
U(h,d)=hdP_h(t-d,t+d)
=\frac{g(d-ih)-g(d+ih)}{4i}.
\]

This is harmonic in `(h,d)` and vanishes at `h = 0`. At `h = a`, its boundary value is `a d P_a(t-d,t+d)`. The strip Poisson kernel from the upper boundary is `(h/a)p_(a,h)`. The horizontal decay of the completed Riemann function permits this representation and differentiation under the integral. Differentiate in `d` at zero, use `p'(-r) = -p'(r)`, and pair the positive and negative values of `r`. This gives the displayed half-line weight.

Equivalently, the characteristic function of the whole-line density is

\[
\int_{\mathbb R}e^{ikr}p_{a,h}(r)\,dr
=\frac{a\sinh(hk)}{h\sinh(ak)}.
\]

Integration by parts or its expansion gives

\[
\int_0^\infty\omega\,dr=1,\qquad
\int_0^\infty r^2\omega\,dr=a^2-h^2,
\]

\[
\int_0^\infty r^4\omega\,dr
=\frac{(a^2-h^2)(7a^2-3h^2)}3.
\]

At `h = 0`, the ordinary-density limit is

\[
\omega_{a,0}(r)=\frac{\pi^2r}{2a^2}
\operatorname{sech}^2\!\left(\frac{\pi r}{2a}\right)
\tanh\!\left(\frac{\pi r}{2a}\right).
\]

At `h = a`, the measure is the point mass at zero. Substitution into the interior formula is invalid. The app handles these two endpoints separately.

## 4. Even and odd energies from the known boundary

Choose any Hilbert feature representation `P_a(x,y) = <Phi_a(x),Phi_a(y)>` for real arguments. Define `Phi_+` and `Phi_-` as above. With

\[
D_-=P_a(t-r,t-r),\quad D_+=P_a(t+r,t+r),\quad C=P_a(t-r,t+r),
\]

the two nonnegative quantities are

\[
e_+(t,r)=\frac{D_-+D_++2C}{4},\qquad
e_-(t,r)=\frac{D_-+D_+-2C}{4}.
\]

Here `C` is real. Polarization gives `e_+ - e_- = C`, so

\[
E_\pm(t,h)=\int_0^\infty\omega_{a,h}(r)e_\pm(t,r)\,dr,
\]

\[
\boxed{\frac{W_h(t)}h=E_+(t,h)-E_-(t,h).}
\]

The sign is a comparison of two nonnegative energies. A positive kernel can have negative off-diagonal entries; the squared norm of a difference can exceed the squared norm of a sum. No positivity-preserving inward map follows from boundary positivity alone.

The app divides both energies and the direct shear by the same positive `P_a(t,t)`. The sign is unchanged. Its signed margin is `(E_+-E_-)/(E_++E_-)`; a zero denominator is treated as undefined, never as a positive result.

## 5. The exact outstanding RH inequality

The remaining target is

\[
E_-(t,h)\le E_+(t,h)
\quad\hbox{for every real }t\hbox{ and every }0<h<\frac12.
\]

To see why this would exclude off-axis zeros, suppose `f` has a zero `gamma + ib`, with `0 < b < 1/2`, of multiplicity `m`. Locally `f(z) = c(z-gamma-ib)^m + O((z-gamma-ib)^(m+1))`, so

\[
W_h(\gamma)=m|c|^2(h-b)^{2m-1}+O((h-b)^{2m}).
\]

It is strictly negative immediately below `b`, contradicting the proposed inequality. Conversely, under RH the real-zero product yields positive transverse logarithmic derivative for every `h > 0`. This is the familiar modulus-monotonicity formulation expressed in boundary-energy variables.

A first-modal inequality only on `h = 0`, a finite set of sampled heights, or positivity of a finite Gram block does not prove this all-height, all-shift statement. The intended use is to retain the exact theta arithmetic while looking for a bound on the odd energy, or on the corresponding coupled Schur complement.

## 6. App controls and reproducibility

The page provides:

- Linked collision offset, height, and transverse-probe controls. The geometry and first-mode plots share the same vertical height coordinate. Open circles mark the excluded diameter endpoints.
- Analytic model energies at `a = 1`, with no sign clipping.
- Full-Xi benchmarks at eight selected heights and eight shifts, including `h = 0` and `h = a`.
- Cumulative even, odd, and signed quadrature contributions; a separate dashed direct-shear target.
- An export containing the selected benchmark and complete calculation metadata.

Run the mathematical regression checks:

```sh
node scripts/verify-sign-switching.mjs
```

Regenerate the full-function data with Python, mpmath, and NumPy:

```sh
python scripts/generate-sign-switching-data.py
```

The checked-in data uses 40-digit function arithmetic with float64 Gauss–Legendre nodes and weights, 24 versus 12 nodes per subdivision of `[0,8]`, and independent direct-target recomputation at 65 digits. At the saved revision, the largest normalized reconstruction residual is approximately `7.073e-17`, the largest refinement change `1.536e-16`, and the largest direct precision change `2.411e-38`. A separate finite `[8,12]` probe is recorded. None is an infinite-tail or directed-rounding error certificate.

The generator includes a regression for precision-aware caching. Differentiating a low-precision cached function value after mpmath increases working precision can produce a catastrophically false second derivative. The real-axis target now uses an analytic product-rule second derivative and checks it against independent uncached differentiation.

Known-zero routines only choose display heights. The kernel is evaluated from completed zeta and its derivatives, not from a product that assumes all zeros are real. The stationary-point benchmark is likewise a selected finite height, not a universal theorem.

## Sources and relation to existing work

- Jonathan Sondow and Cristian Dumitrescu, [A monotonicity property of Riemann's xi function and a reformulation of the Riemann Hypothesis](https://arxiv.org/abs/1005.1104). Background for the modulus-monotonicity criterion.
- D. H. J. Polymath, [Effective approximation of heat flow evolution of the Riemann xi function, and a new upper bound for the de Bruijn–Newman constant](https://arxiv.org/abs/1904.12438). Background for heat evolution and local Hermite collision profiles.
- This repository's Shift-Bridge Positivity and complete-kernel research pages supply the surrounding program. The present note fixes the normalizations and proves the two displayed identities directly; it does not discharge the program's open domination estimate.
