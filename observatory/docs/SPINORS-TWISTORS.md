# Spinors and the chosen Euclidean twistor view

The spinor panel lifts a selected projective two-channel state to a normalized vector in \(\mathbb C^2\). The twistor panel sends the selected point of the existing elliptic curve in \(\mathbb{CP}^3\) to \(S^4\), then explores its \(\mathbb{CP}^1\) fiber. Both are exact coordinate constructions evaluated in floating-point arithmetic. They do not establish a new positivity inequality, a zero-trapping mechanism, or RH.

## 1. Spinor, common phase, and physical rotation

For a nonzero pair \([U:V]\), choose a normalized representative

\[
\psi=\frac{(U,V)^T}{\sqrt{|U|^2+|V|^2}}\in S^3.
\]

The implementation shares the log-polar/projective normalization already used by the inspector. Values whose ordinary complex representation underflows or overflows retain their relative amplitude and phase. A simultaneous zero remains undefined.

The Hopf/Bloch projection is

\[
\mathbf n=\psi^\dagger\boldsymbol\sigma\psi
=\big(2\Re(\bar U V),\;2\Im(\bar U V),\;|U|^2-|V|^2\big)
\]

for a unit-norm pair. The points \(e^{i\chi}\psi\) form one circle in \(S^3\) and have the same \(\mathbf n\). This is the common-phase control. The identification of complex lines with \(\mathbb{CP}^1\) and their Pauli-matrix description are reviewed by Woit [1].

The separate rotation control applies

\[
R_{\hat a}(\theta)=\exp\!\left(-\frac{i\theta}{2}\hat a\cdot\boldsymbol\sigma\right)
=\cos(\theta/2)I-i\sin(\theta/2)\hat a\cdot\boldsymbol\sigma.
\]

Its action rotates the Bloch vector by the ordinary angle \(\theta\), but

\[
R_{\hat a}(2\pi)=-I,\qquad R_{\hat a}(4\pi)=I.
\]

The amplitude dials and reference overlap expose that sign; the Bloch point alone cannot distinguish it. These are the standard spin-one-half rotation conventions in Littlejohn's original course notes [2]. The renderer is using this representation on a mathematical channel pair; it is not claiming that the zeta function is a physical spin-one-half particle.

The orthonormal display frame comes from the two columns

\[
(\psi,J\psi),\qquad J(U,V)=(-\bar V,\bar U).
\]

Its third axis is \(\mathbf n\); its first two axes are the Bloch images of \((\psi+J\psi)/\sqrt2\) and \((\psi+iJ\psi)/\sqrt2\). A common phase rotates this frame while keeping its third axis fixed. This frame is a choice of representative, not an additional field on the spectral surface.

The raw selected pair is the reference for `overlap`. `rotationOverlap` instead uses the phase-adjusted pair as its reference. An SU(2) mixing generally changes \(|U|^2-|V|^2\); it is not a transformation preserving the indefinite bridge balance. No improved bridge sign is inferred from a rotated display state.

## 2. What the elliptic curve supplies

The projective atlas already embeds the smooth curve

\[
E_r:\quad X_1^2=X_0X_2,\qquad
X_3^2=X_0^2+(r^2+r^{-2})X_1^2+X_2^2,
\]

with affine coordinates \([1:w:w^2:\eta]\). The selected source point supplies this ordered homogeneous quartet. The source is still the existing projective elliptic model; its 3D torus drawing is a display of its atlas and topology.

Being a curve in \(\mathbb{CP}^3\) does **not** alone specify a preferred Penrose real structure, quaternionic pairing, Euclidean metric, or spacetime interpretation. For the added view we explicitly choose the standard Hermitian norm and the ordered identification

\[
(Z_0,Z_1,Z_2,Z_3)\longleftrightarrow
(q_1,q_2)=(Z_0+jZ_1,\;Z_2+jZ_3).
\]

The coefficient after \(j\) is on its **right**. We use right quaternionic lines. These are the conventions of Salamon–Viaclovsky, sections 2.2–2.4, particularly equation (2.5) [3]. They give the genuine Euclidean twistor fibration

\[
\mathbb{CP}^1\longrightarrow\mathbb{CP}^3
\stackrel{\pi}{\longrightarrow}\mathbb{HP}^1\cong S^4.
\]

This additional structure is a useful, explicit way to examine the chosen elliptic embedding. It is not asserted to be canonical for \(\xi\).

## 3. The implemented map to the four-sphere

Normalize \(\sum_{k=0}^3|Z_k|^2=1\). Set

\[
A=Z_0\bar Z_2+\bar Z_1Z_3,
\qquad B=Z_1\bar Z_2-\bar Z_0Z_3.
\]

The five real coordinates are

\[
x=(2\Re A,\;2\Im A,\;2\Re B,\;2\Im B,\;
 |Z_0|^2+|Z_1|^2-|Z_2|^2-|Z_3|^2).
\]

These formulas are the explicit expansion of

\[
\left(2q_1\bar q_2,\;|q_1|^2-|q_2|^2\right).
\]

In our complex-pair notation the last imaginary coordinate of a quaternion is the negative of its conventional \(k\) component; this is just a fixed reflection of one display axis. The direct norm identity

\[
4|q_1\bar q_2|^2+(|q_1|^2-|q_2|^2)^2
=(|q_1|^2+|q_2|^2)^2=1
\]

checks that \(x\in S^4\). The module and its tests derive and verify these expansions with the selected convention.

Common right multiplication by any unit quaternion \(h\) leaves this base point unchanged, since

\[
(q_1h)\overline{(q_2h)}=q_1h\bar h\bar q_2=q_1\bar q_2.
\]

Common complex projective scaling is a special case after normalization. In particular, a common complex phase of the quartet cannot move the \(S^4\) base.

## 4. Fiber controls and their limits

The quaternionic real structure is

\[
JZ=(-\bar Z_1,\bar Z_0,-\bar Z_3,\bar Z_2),\qquad J^2=-I.
\]

The full fiber through \([Z]\) is the projective line

\[
[\alpha Z+\beta JZ],\qquad [\alpha:\beta]\in\mathbb{CP}^1.
\]

The controls choose

\[
\alpha=\cos(\theta/2),\qquad
\beta=e^{i\phi}\sin(\theta/2),
\quad 0\le\theta\le\pi,\quad0\le\phi\le2\pi.
\]

This is equivalent to the common right quaternion action with \(h=\alpha+j\beta\). The little fiber sphere has coordinates \((\sin\theta\cos\phi,\sin\theta\sin\phi,\cos\theta)\). The reference and moved \(S^4\) coordinates are independently computed and their difference is shown as `invarianceError`.

The fiber controls use a local gauge in which the largest-magnitude quartet component is positive real. This makes the controls independent of a common rescaling of the input. Where the chosen largest component changes, the frame can change: there is no globally continuous choice of Hopf phase. The underlying projective point and base map remain well defined.

The sheet selector changes the input to the elliptic deck partner by sending \(X_3\mapsto-X_3\) **before** the fiber motion. “Plus” means the supplied source lift, and “minus” its deck partner; these are not a globally ordered sign for a complex-valued \(\eta\).

A generic moved fiber representative is outside \(E_r\). Both defining-quadric residuals are therefore reported separately for the source and the moved quartet, after unit-norm normalization. The unchanged source value of \(s\) or \(\xi(s)\) is not assigned to the moved point. There is no established descent of \(\xi\) to a scalar field on all of \(S^4\), nor an assertion that the image of \(E_r\) is globally embedded there.

## 5. Projection and infinities

The north and south stereographic charts use the fifth coordinate by default:

\[
y_N=\frac{(x_0,x_1,x_2,x_3)}{1-x_4},\qquad
y_S=\frac{(x_0,x_1,x_2,x_3)}{1+x_4}.
\]

The result is a point of \(\mathbb R^4\). A 3D panel shows three components and retains the fourth as a separate value or color; it does not turn \(S^4\) into a 3D embedded sphere. The excluded pole is explicitly marked as chart infinity, and the other chart remains regular. Near a pole, the implementation uses the sphere norm identity to avoid subtracting almost equal numbers.

These chart poles are distinct from the two spectral infinity points on \(E_r\). Spectral infinity is regular as a geometric point of the curve, so its quartet and twistor image exist, while the loaded \(\xi\) field is still essential there. Neither spinor nor twistor controls manufacture a finite analytic value at that puncture.

## 6. Implementation and verification

`dist/spinor.js` exports `spinorFromProjective`, normalization, the Hopf map, the SU(2) matrix, and the associated orthonormal frame. `dist/twistor.js` exports `twistorFromProjective`, the quaternionic Hopf map and right action, stereographic charts, and elliptic residuals. These modules import no analytic evaluator. Their inputs are held projective snapshots; drawing and playback can consume the computed geometry without reevaluating \(\zeta\), \(\xi\), or heat flow.

Tests check common-phase invariance, Rodrigues rotation orientation, the \(2\pi/4\pi\) distinction, orthonormal frames, \(J^2=-I\), homogeneous scale invariance, right-SU(2) invariance, the full fiber sphere, source versus moved quadric residuals, both stereographic poles, and regular projective coordinates at the elliptic branch and infinity points.

## Primary sources

1. Peter Woit, **Notes on the Twistor P1**, sections 2–4, February 8, 2022. Author-hosted mathematical exposition: <https://www.math.columbia.edu/~woit/twistorp1.pdf>. This source uses a left-coefficient quaternion convention in its own formulas; our implementation instead follows the right-coefficient convention in [3].
2. Robert G. Littlejohn, **Rotations in Quantum Mechanics, and Rotations of Spin-1/2 Systems**, Physics 221A Notes 12, 2021–22. Author's Berkeley course notes: <https://bohr.physics.berkeley.edu/classes/221/notes/spinrot.pdf>.
3. Simon Salamon and Jeff Viaclovsky, **Orthogonal complex structures on domains in R4**, sections 2.2–2.4, arXiv:0704.3422; published in *Mathematische Annalen* 343 (2009), 853–899. Author manuscript: <https://arxiv.org/pdf/0704.3422>; record: <https://arxiv.org/abs/0704.3422>.
