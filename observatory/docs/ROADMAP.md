# Zeta View development roadmap

This roadmap distinguishes implemented views from proposed research extensions. The projective atlas, selected-point bridge/Bloch sphere, and derivative disk are implemented; global differential layers, complex zero trajectories, and Pick/Schur experiments remain proposed. Numerical experiments and finite checks do not establish RH or global positivity.

## Current baseline

The app includes zeta and completed xi, the actual theta heat family, ordinary and projective sphere/elliptic-torus mounts, phase and modulus layers, bridge balance, twin ladders, finite prime-power packet experiments, contour/winding inspection, session export, and fully prepared heat playback. Keep the main viewport 4:3 and preserve the exact-field cache and no-analytic-evaluation playback contract. The linked projective inspector is held during playback and refreshes when paused inspection resumes.

## 1. Projective atlas and derivative disk — implemented

The **Projective** toggle provides an input domain sphere or elliptic torus, with a linked target sphere/disk and a two-sphere branch-cut atlas below the main viewport. The inspector selects the common input point. The **projective** and **projectiveSphere** presets use r = 2 and L = 24; **Original projective chart · L = 1** restores the literal construction from the November 13 projective notes.

- Domain: `[s0-1:s0]`, with `s0=1/2+(s-1/2)/L`, finite/reciprocal charts, and marked Mobius anchors. Thus `w=(s-1/2-L/2)/(s-1/2+L/2)` maps the open right half-plane into the unit disk and the critical line to its boundary. This L convention matches the existing torus lens.
- Bridge: the selected-point sphere shows `[G(s+a):G(s-a)]`. For `U=G(s+a)`, `V=G(s-a)`, and `R=V/U`, its vertical balance is `(1-|R|^2)/(1+|R|^2)`. Polar normalization preserves information through raw floating-point underflow; a simultaneous zero is unresolved.
- Derivative: `[G(s):ell G'(s)]`, with `ell > 0`, and `C=(G-ell G')/(G+ell G')`. The ordinary channel uses `G=xi`, while Heat uses `G=F_tau`. The identity `1-|C|^2 = 4 ell Re(conj(G) G') / |G+ell G'|^2` makes the pointwise shear sign an inside/outside disk test wherever defined. Ill-conditioned signs are explicit. Every simple zero maps to `C=-1`, irrespective of its input location; this alone says nothing about RH. Multiple zeros need local analysis.
- Torus: branch points, crosswise cuts, two local sheets, reciprocal charts, spectral punctures, and the anti-bridge are displayed. In `s=1/2+L(1/(1-w)-1/2)`, spectral infinity lies above `w=1`; the quartic's two regular points over `w=infinity` map to finite `s=1/2-L/2`. The coordinate readout uses `[1:w:w^2:eta]` and the exact quadrics `X1^2=X0 X2`, `X3^2=X0^2+(r^2+r^-2)X1^2+X2^2`.

The torus in the viewport is a display embedding, with its ℂℙ³ coordinates supplied separately. Spectral infinity remains an unevaluated puncture. Both ordinary ξ lifts have the same local holomorphic winding; opposite winding of a shifted ratio's zero and pole is a different cancellation. Cross-ratio controls and global derivative-field overlays are still proposed.

## 2. Bridge/Bloch state — selected point implemented

The linked point panel uses `G=xi` for the ordinary bridge and `G=F_tau` for heat. It normalizes `(U,V)` with scale-safe polar arithmetic and displays

```text
n = (2 Re(conj(U)V), 2 Im(conj(U)V), |U|^2-|V|^2)
    / (|U|^2+|V|^2).
```

The bridge balance is `n3`; `n1,n2` expose relative phase. The linked Bloch inset and point readouts are implemented. Sparse state glyphs across the surface, selected-loop paths, and separate paired total-amplitude/common-phase controls remain proposed.

Away from zeros, `(n3,n2)/(2a)` tends to `(Re(G'/G),-Im(G'/G))` as `a -> 0`. Critical-line balance follows from symmetry and is not an RH certificate. The naive pair `(xi(s),xi(1-s))` has identical components. Intrinsic surface spinors, Dirac operators, and full twistors require additional specified geometry and an arithmetic coupling.

## 3. Signed shear and local differential layers — proposed

Display `S=Re(G'/G)` and the smooth companion `W=Re(conj(G)G')`. Compare analytic derivatives with the finite bridge `(log|G(s+a)|-log|G(s-a)|)/(2a)`.

- Separate diverging sign colors from cyclic phase colors.
- Add zero contours, horizontal slices, derivative conditioning, and masks.
- Show `grad log|G|=(Re q,-Im q)` and `grad arg G=(Im q,Re q)` independently, where `q=G'/G`.
- Optional Hessian directions use `q'=G''/G-q^2`; the eigenvalues of the Hessian of log modulus are `+|q'|` and `-|q'|` away from zeros/poles.

For completed xi at heat time zero, horizontal modulus monotonicity in the open right half-plane is an RH reformulation. Do not silently apply that label to uncompleted zeta or arbitrary heat times.

## 4. Actual complex heat-zero trajectories — proposed

The normalization is `F_tau(s)=8 H_tau(-2i(s-1/2))`, so `partial_tau F = (1/4) F_ss`. At a simple zero, `rho'(tau)=-F_ss(rho)/(4 F_s(rho))`.

Use complex predictor/corrector tracking, adaptive heat steps, local residuals, and contour counts. Detect collisions without dividing blindly by a small `F_s`. Do not constrain tracking to the critical line; the current sign-change markers have limited on-line coverage. Link both torus lifts of a single base zero. Prepare trajectories and derivative records before playback. Phase-flow particles and ordinary surface diffusion are different evolutions.

## 5. Pick matrices and the remaining Schur condition — proposed

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

