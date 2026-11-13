# Zeta View development roadmap

These are proposed research and visualization extensions discussed after the currently published app. They are not implemented by the GitHub/Vercel migration. Numerical experiments and finite checks do not establish RH or global positivity.

## Current baseline

The app already includes zeta and completed xi, the actual theta heat family, plane/sphere/elliptic-torus mounts, phase and modulus layers, bridge balance, twin ladders, finite prime-power packet experiments, contour/winding inspection, session export, and fully prepared heat playback. Keep the main viewport 4:3 and preserve the exact-field cache and no-analytic-evaluation playback contract.

## 1. Projective atlas and derivative disk

Keep the input point linked across the domain, target sphere/disk, and torus charts. Distinguish the input Riemann sphere from a projective sphere of function values or paired channels.

- Domain: homogeneous coordinates `[s:1]`, reciprocal charts, and Mobius anchors. The map `(s - 1/2 - L)/(s - 1/2 + L)`, with `L > 0`, sends the right half-plane into the unit disk and the critical line to its boundary.
- Bridge: `[G(s+a):G(s-a)]`. If `U=G(s+a)`, `V=G(s-a)`, and `R=V/U`, the existing balance is `(1-|R|^2)/(1+|R|^2)`. Switch charts when an affine denominator vanishes; a simultaneous zero needs local analysis.
- Derivative: `[xi(s):ell xi'(s)]`, with `ell > 0`. Display `C=(xi-ell xi')/(xi+ell xi')`. The identity `1-|C|^2 = 4 ell Re(conj(xi) xi') / |xi+ell xi'|^2` makes the shear sign an inside/outside disk test. The global condition concerns the entire open right half-plane, with singularities accounted for. Every simple zero maps to `C=-1`, irrespective of its input location; this alone says nothing about RH. Multiple zeros require cancellation of the common local factor or an unresolved marker.
- Torus: show branch points, sheet exchange, reciprocal charts, punctures, and cross-ratios. In the existing map `s=1/2+L(1/(1-w)-1/2)`, zeta-domain infinity lies above `w=1`; the quartic's two points over `w=infinity` map to finite `s=1/2-L/2`.

Projective coordinates remove coordinate-denominator failures, not the transcendental function's essential behavior at input infinity or the need to evaluate additional high-height samples. A projection of CP2 or CP3 must state what dimensions or slices are shown.

## 2. Complete bridge/Bloch state

Use `G=xi` for the ordinary bridge and `G=F_tau` for heat. Normalize the pair `(U,V)` by `sqrt(|U|^2+|V|^2)` and display

```text
n = (2 Re(conj(U)V), 2 Im(conj(U)V), |U|^2-|V|^2)
    / (|U|^2+|V|^2).
```

The existing bridge balance is `n3`; `n1,n2` expose relative phase. Use a linked Bloch inset, sparse state glyphs, and selected-loop paths. Keep total amplitude and common scalar phase available separately.

Away from zeros, `(n3,n2)/(2a)` tends to `(Re(G'/G),-Im(G'/G))` as `a -> 0`. Critical-line balance follows from symmetry and is not an RH certificate. The naive pair `(xi(s),xi(1-s))` has identical components. Intrinsic surface spinors, Dirac operators, and full twistors require additional specified geometry and an arithmetic coupling.

## 3. Signed shear and local differential layers

Display `S=Re(G'/G)` and the smooth companion `W=Re(conj(G)G')`. Compare analytic derivatives with the finite bridge `(log|G(s+a)|-log|G(s-a)|)/(2a)`.

- Separate diverging sign colors from cyclic phase colors.
- Add zero contours, horizontal slices, derivative conditioning, and masks.
- Show `grad log|G|=(Re q,-Im q)` and `grad arg G=(Im q,Re q)` independently, where `q=G'/G`.
- Optional Hessian directions use `q'=G''/G-q^2`; the eigenvalues of the Hessian of log modulus are `+|q'|` and `-|q'|` away from zeros/poles.

For completed xi at heat time zero, horizontal modulus monotonicity in the open right half-plane is an RH reformulation. Do not silently apply that label to uncompleted zeta or arbitrary heat times.

## 4. Actual complex heat-zero trajectories

The normalization is `F_tau(s)=8 H_tau(-2i(s-1/2))`, so `partial_tau F = (1/4) F_ss`. At a simple zero, `rho'(tau)=-F_ss(rho)/(4 F_s(rho))`.

Use complex predictor/corrector tracking, adaptive heat steps, local residuals, and contour counts. Detect collisions without dividing blindly by a small `F_s`. Do not constrain tracking to the critical line; the current sign-change markers have limited on-line coverage. Link both torus lifts of a single base zero. Prepare trajectories and derivative records before playback. Phase-flow particles and ordinary surface diffusion are different evolutions.

## 5. Pick matrices and the remaining Schur condition

For `X(z)=xi(1/2+z)` and `L=X'/X`, use `P_ij=(L(x_i)+L(x_j))/(x_i+x_j)` for positive real nodes. Show matrix entries, scale-normalized spectra, the weakest mode `b`, its rational probe `V(z)=sum b_i/(z+x_i)`, and source profile `h(u)=sum b_i exp(-x_i u)`.

The November 11, 2026 Math Explorer draft PR #55 reports six-node positivity for distinct positive real nodes. It leaves all-order preservation and RH open. Preserve that scope; higher orders and complex-node experiments are separate. Near-coincident nodes need a suitable basis and high-precision checks before interpreting a negative numerical margin.

For a block matrix `[[A,B],[B*,D]]` with `A>0`, visualize `D-B* A^-1 B` as reserve, coupling cost, and remaining margin. Account for the conditions needed to invert `A`. Distinguish directly evaluated full quantities, explicitly enumerated zero contributions, and rigorously bounded or unknown remainders. Do not complete an unknown tail by assuming RH.

## 6. Topology, confidence, and experiment controls

- Half-phase ribbons show the sign change `(-1)^m` for loop winding `m`; retain the integer winding as well as its parity. This cover differs from the quartic elliptic cover.
- Label analytic zeros, derivative zeros, chart ramification, and infinity punctures separately.
- State whether vector transport uses the plane metric pulled back through the chart or the induced display-surface metric.
- Add adaptive refinement around zeros, fast phase changes, collisions, and small matrix margins.
- Distinguish estimates, unresolved signs, and certified bounds; avoid proof-like labels on floating-point colors.
- Add symmetric test functions with known off-axis zeros to check which visual features distinguish zero locations.
- Cache scale-safe values and analytic derivatives with versioned keys and bounded budgets. Cache matrix results separately by nodes, order, precision, and source revision.

## Primary references and research provenance

- [Sondow and Dumitrescu: modulus monotonicity and RH](https://arxiv.org/abs/1005.1104)
- [NIST DLMF: xi and the functional equation](https://dlmf.nist.gov/25.4)
- [Elliott and Jury: positive-real/Pick kernel criterion](https://people.clas.ufl.edu/mjury/files/halfplane.pdf)
- [Polymath: de Bruijn-Newman heat family](https://arxiv.org/abs/1904.12438)
- [Math Explorer six-node checkpoint](https://github.com/judegomila/mathexplorer/blob/c617017e3a90562cd828e58ffc71b03afab128cc/rigorous/theta-third-preservation-2026-11-11/README.md)
- [Math Explorer rational/Schur residual analysis](https://github.com/judegomila/mathexplorer/blob/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09/theta_rational_residual_20261109.md)
