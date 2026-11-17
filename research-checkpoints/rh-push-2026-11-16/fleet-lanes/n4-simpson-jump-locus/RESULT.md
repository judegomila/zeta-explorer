# n4-simpson-jump-locus: RESULT

Verdict: **precise obstruction; lane closed.** No statement about zeros of zeta is obtained.

Labels: PROVED (derivation in this file, short enough to check by hand; numeric spot checks in `checks.py` / `checks.json`), CLASSICAL (literature, not re-derived), MEASURED (computed here), OPEN.

Files: `checks.py` (pure Python, run through `scripts/memcap.sh 8`, 2 s, < 50 MB), `checks.json` (output).
Source read for test 3: Connes-Consani, "The Riemann-Roch strategy: complex lift of the scaling site", arXiv:1805.10501 (sections 5.2-5.3, Prop. 5.1, Lemma 5.5, Thm 5.1, Prop. 5.2). Cited below as [CC].

---

## 1. Plan

Idea under test: zeros of zeta are the jump locus of a twisted cokernel (Connes; Connes-Consani) for the characters |x|^s of the scaling flow. On a compact Kaehler manifold, isolated points of rank-one jump loci are unitary (Arapura; Simpson: torsion), because on the Dolbeault side the locus is invariant under scaling of the Higgs field. If Re s - 1/2 were a Higgs field on the complex lift of the scaling site, every isolated jump point would have Re s = 1/2.

What is new relative to the atlas and the obstruction map: the fetched atlas copy and OBSTRUCTION_MAP.md have no row on the Connes-Consani complex lift, Simpson/Arapura jump loci, or Deninger-type leafwise Hodge arguments. Nearest rows: T3 (Hodge-index transplant: no object counted), G15 (Hecke action does not descend), section 3.8 (local conditions at single primes are empty).

Three things had to be decided:
1. Is Kaehler structure essential for unitarity of jump points (test 1)?
2. In a one-prime model, is Re s a Higgs term, and what locates the symmetry point 1/2 (test 2)?
3. On the actual complex lift: is Re s a Higgs term, does Fr_lambda act holomorphically, is the cokernel a holomorphic object (test 3)?

Outcome: test 1 confirms Kaehler is essential. Test 2 works on the elliptic curve C*/p^Z but gives the line Re s = 0, not 1/2. Test 3 fails at three independent named points (section 4). The lane closes there.

---

## 2. Test 1: pseudo-Anosov mapping torus (control: flow + closed orbits + Lefschetz, no Kaehler leaves)

Setup. Sigma_2 closed genus-2 surface, basis a1,b1,a2,b2 of H_1, chain of curves c1..c5 with classes a1, b1, a1-a2, b2, a2 (consecutive intersection 1, others 0; checked). Dehn twists act by x -> x + omega(x,v) v.

MEASURED (exact integer arithmetic). phi = T_{c1} T_{c2} T_{c3}^{-1} T_{c4}^{-1} acts on H_1 by

    M = [[0,-1,0,0],[1,2,1,-1],[0,-1,0,1],[0,0,-1,1]],   symplectic,
    Delta(t) = det(t - M) = t^4 - 3t^3 + 5t^2 - 3t + 1.

- Delta is irreducible over Z (no root +-1; no factorisation into two monic integer quadratics), is not a polynomial in t^k for k > 1, and has no root of unity as a root. By the Casson-Bleiler criterion (CLASSICAL) phi is pseudo-Anosov.
- Roots: 1.1217444141 +- 1.3066224028 i (modulus 1.7220838057) and 0.3782555859 +- 0.4405969990 i (modulus 0.5806918320). All four roots are off the unit circle. (With u = t + 1/t: u^2 - 3u + 3 = 0, u non-real.)
- Delta(1) = 1, so b_1 of the mapping torus M_phi is 1 and the rank-one character variety is C* (the coordinate t on the circle direction).
- Jump locus (CLASSICAL, Wang sequence): H^1(M_phi; C_t) != 0 for t != 1 iff Delta(t) = 0. dim ker(M - t) = 1 at each of the four roots and 0 at the unitary samples tested. The four jump points are isolated and non-unitary.
- Lefschetz side: L(phi^n) = 2 - tr M^n = -1, 3, 11, 19, 14, -21, -85, -125, -25, 318, 791, 835 (n = 1..12); exp(sum L_n t^n / n) = det(1 - tM)/(1 - t)^2 verified as exact power series to order 12. Delta is palindromic: the functional equation t <-> 1/t holds.
- A Salem-type example also appears (T_{c1} T_{c2} T_{c3} T_{c4}^{-1}: t^4 - 3t^3 + 3t^2 - 3t + 1, moduli 0.4643, 1, 1, 2.1537).

Conclusion (PROVED modulo the two CLASSICAL inputs): a flow with closed orbits, an exact Lefschetz formula, a functional equation and isolated rank-one jump points does not give unitary jump points. The Kaehler input is essential: a holomorphic automorphism of a compact Riemann surface acts unitarily on H^{1,0} and has roots of unity only; phi is not holomorphic for any complex structure. Test 1 does not kill the idea; it fixes what must be checked in test 3: holomorphy of the flow and existence of a Hodge decomposition.

---

## 3. Test 2: one-prime model on E = C*/p^Z

E = C/(Z log p + 2 pi i Z), coordinate z = u + i phi, |x| = e^u.

PROVED (elementary; `test2_tate_curve` in checks.json confirms on a grid, p = 3).
- Betti side: the character |x|^{-s} has holonomy (p^{-s}, 1). H^*(E; L) != 0 iff the character is trivial: p^{-s} = 1.
- Dolbeault side: (L_t, theta) with L_t the unitary bundle of holonomy p^{-it} and theta = (sigma/2) dz, s = sigma + it. The periods of 2 Re theta are (sigma log p, 0). For sigma != 0 the complex O -> Omega^1 (wedge with theta) is an isomorphism of sheaves, hence acyclic; for sigma = 0 cohomology is non-zero iff L_t is trivial. The jump locus is {sigma = 0, p^{-it} = 1}, invariant under sigma -> lambda sigma.
- So on E, Re s is a Higgs term and the Simpson mechanism works. It gives Re s = 0, the pole line of the local factor (1 - p^{-s})^{-1}. This is the content of "local RH" and carries no information about zeta (map section 3.8).
- What places a line at 1/2: nothing on E. K_E is trivial, so a square root of K_E is a 2-torsion unitary character and shifts nothing. In the half-density normalisation |x|^{1/2} sum f(nx), the local jump points sit at Higgs value -1/2, not 0.

E_a control at this step: for zeta(s+a)zeta(s-a) the local system is rank 2 with base Higgs field diag(a, -a) dz/2; jump points Re s = +-a. The mechanism returns +-a as required (PROVED, same computation per eigenline).

---

## 4. Test 3: the Connes-Consani complex lift

Facts from [CC] (CLASSICAL, read from the paper):
- Lift: C_Q = P(Q)\Pbar(A_Q), P the ax+b group, elements (y, x), y an adele, x in A_Q; G = A_Q/Q compact (dual of Q). Leaves = orbits of the right action of P_+(R), (y,x)(u,v) = (uy, x + vy); each leaf carries the left-invariant complex structure and Poincare metric of H, z = x + iy; dbar f = 0 iff (X + iY) f = 0 with Y = y d/dy, X = y d/dx, [Y,X] = X. Leafwise coframe alpha = dx/y, beta = dy/y, d alpha = alpha ^ beta. Laplacian Delta = X^2 + (Y - 1/2)^2 - 1/4.
- Periodic orbit: Gamma(p) = mapping torus of multiplication by p on G; compact; leaves H except one leaf p^Z\H, an open half of the elliptic curve C*/p^Z; foliation of type III_{1/p}; de Rham cohomology of Gamma(p) equals that of a circle (H^1 = R beta, H^2 = 0).
- "The scaling action on A_Q x G exists for rational values of lambda" and for those it is multiplication of the complex variable, hence holomorphic.

### 4.1 Fr_lambda is not holomorphic. PROVED.
The scaling flow of the adele class space, y -> lambda y for real lambda, lifts as right multiplication by diag(lambda, 1) (formula (ii) before [CC] Prop. 5.1): (y, x) -> (lambda y, x). On a leaf this is z = x + iy -> x + i lambda y, a real-affine stretch with constant Beltrami coefficient (1 - lambda)/(1 + lambda) (values in checks.json), holomorphic only for lambda = 1. The holomorphic map z -> lambda z is defined on the quotient only for rational lambda, where it is the equivalence relation itself (trivial on C_Q). Infinitesimally [Y, X + iY] = X (checked): the flow does not preserve ker dbar, so the flow has no s-eigenspaces on leafwise holomorphic objects.
Consequence: the flow sits inside the complex leaves as a Teichmueller-type stretch. This is the situation of test 1 (pseudo-Anosov stretch in flat coordinates), not of a holomorphic flow on Kaehler leaves.

### 4.2 Re s is not a Higgs term; it is a power of the leafwise canonical bundle. PROVED.
The character |x|^s corresponds to the flat connection d + s beta on the trivial bundle (flat section y^{-s}). With the constant metric, the candidate Higgs field is theta = sigma beta^{1,0}, beta^{1,0} = dz/(2iy).
- d(beta^{1,0}) = -(i/2) omega, omega = alpha ^ beta = dx dy / y^2 (finite-difference check: relative error <= 3e-9). So dbar theta = -(i sigma/2) omega != 0 for sigma != 0: theta is not holomorphic; the failure is exactly the leafwise Kaehler form.
- No change of metric repairs this on Gamma(p). With Y* = 1 - Y and X* = -X for the leaf area (checked), d*(sigma beta + d phi) = sigma - Delta phi with Delta = X^2 + Y^2 - Y. The measure dm = dn(x) dy/y on Gamma(p) ([CC] (46)) is invariant under X and Y, so the integral of Delta phi vanishes for every smooth phi. Hence Delta phi = sigma has no solution unless sigma = 0: the flat bundle L_s has no harmonic metric, and no Higgs bundle corresponds to it.
- What sigma is instead: with the constant metric the holomorphic frame y^{-s} has norm y^{-sigma} = |dz|_hyp^{-sigma}, and the Chern curvature is i sigma omega. So (L_s, h) = K_F^{-sigma} (x) (flat unitary y^{-it}), isometrically and P_+(R)-equivariantly, K_F the leafwise canonical bundle. Re s is a degree (curvature) parameter, not a Higgs parameter. The Simpson scaling theta -> lambda theta acts on a family of degree-0 bundles; here the family s -> K_F^{-s} changes degree with sigma, and no scaling invariance statement exists for such a family.
- Location of 1/2: the symmetry s <-> 1 - s is K_F^{-s} <-> K_F (x) (K_F^{-s})^{-1}-type duality, with fixed point K_F^{1/2}; equivalently Y - 1/2 is formally skew-adjoint for the leaf area, 1/2 = half the modular character of P_+(R) (non-unimodularity, [Y,X] = X). So the candidate "square root of the canonical bundle" is correct as the centre of the duality, on the lift (not on E), but it is the centre of a Serre-type duality, which is the functional equation, and not the unitary locus of a Higgs family.
- Curve analogue (CLASSICAL): on a compact curve, line bundles with h^0 and h^1 both non-zero exist in every degree from 0 to 2g - 2. The analogue of that range is the strip 0 <= Re s <= 1, not the line.

### 4.3 No Hodge theory on the lift of a periodic orbit. PROVED (twisted version of [CC] Prop. 5.2).
Twisted complex on Gamma(p) in the [CC] function algebra, d_s = d + s beta:

    d_s f = (Xf) alpha + ((Y+s)f) beta,   d_s(g alpha + h beta) = (-(Y+s-1)g + Xh) alpha^beta.

- Fourier sectors along G with q != 0: X = 2 pi i q y is invertible and K(g alpha + h beta) = X^{-1} g, K(k alpha^beta) = X^{-1} k beta satisfies d_s K + K d_s = 1 for every s (checked on 50 random instances, error < 1e-14). These sectors are acyclic for all s.
- Sector q = 0 (functions on R_+/p^Z): cohomology is non-zero iff p^s = 1 (classes y^{-s}, y^{-s} beta) or p^{s-1} = 1 (classes y^{1-s} alpha, y^{1-s} alpha^beta).
- Jump locus of Gamma(p): Re s = 0 and Re s = 1, at heights 2 pi n / log p. This is the pattern of (1 - p^{-s})(1 - p^{1-s}), the local factor of zeta(s) zeta(s-1): the lift of a periodic orbit returns the E_a control with a = 1/2. It is symmetric under s <-> 1 - s and is not invariant under scaling about 1/2 (sigma - 1/2 = +-1/2) nor about 0.
- The same computation shows why: all holomorphic content (q != 0) is acyclic; all cohomology is in the X-invariant sector, where dbar reduces to iY and the complex is the de Rham complex of the flow on the base, doubled with shift s -> s - 1 by the class alpha (the fibre class of G, on which multiplication by p acts by p). b_1 = 1 is odd and d alpha = omega, so the leafwise Kaehler class is zero: no Hodge decomposition, no hard Lefschetz, no weight-1 part.

### 4.4 The cokernel of Sigma on the lift. PROVED (formal part) / OPEN (function spaces).
Sigma (the map E of [CC] (3)) is averaging over the left action of Q^* (on the lift, of P(Q)). X and Y come from the right action and commute with it, so Sigma is a morphism of leafwise dbar complexes and its cokernel can be written as cohomology of a mapping cone: a two-term complex exists. But by 4.1 the flow does not act on dbar-cohomology, and by 4.3 the s-dependence lives in the X-invariant sector, where there is no holomorphic structure left (holomorphic and X-invariant implies flow-invariant). The same homotopy K is available globally wherever y_infinity != 0, which gives formally

    jump(lift) = jump(base) union (jump(base) + 1),

i.e. the lift adds a Tate-shifted copy and no constraint. For Gamma(p) this is proved (4.3); for the full space it is formal because the function spaces defining the global cokernel are not fixed in [CC] (OPEN).

### 4.5 Missing structure, stated precisely
For the Simpson/Arapura argument to apply to the scaling character one needs all of:
(a) a compact (or finite-volume with L^2 Hodge theory) space with complex leaves on which the flow acts by leafwise holomorphic maps. Present: the flow acts by stretches with Beltrami coefficient (1 - lambda)/(1 + lambda).
(b) the generator beta = dlog|x| of the character group to be the real part of a leafwise holomorphic 1-form (equivalently, co-closed after a change of metric). Present: d* beta = 1, obstruction class = the leafwise Kaehler form, no solution of Delta phi = sigma.
(c) a non-zero Kaehler class and even b_1. Present on Gamma(p): omega = d alpha, b_1 = 1.
(d) a weight-1 summand carrying the zeros. Present on Gamma(p): weights 0 and 2 only.
Each of (a)-(d) fails by a proved computation. The structure that would replace them is a polarised (positive definite) form on the zero module for which Y - 1/2 is skew: the Hilbert-Polya / Deninger requirement, unchanged.

---

## 5. Controls

- Pseudo-Anosov mapping torus (test 1): flow, closed orbits, Lefschetz formula, functional equation; jump points off the unit circle. MEASURED + CLASSICAL. Step that separates it from the Kaehler case: holomorphy of the monodromy. The lift fails the same step (4.1).
- Selberg control (CLASSICAL, cited, not recomputed): Gamma\PSL_2(R) for a compact hyperbolic surface with the right P_+(R) action has the same leaf structure as [CC] Prop. 5.1 (leaves H, annulus leaves over closed geodesics of length l in place of log p, Delta = X^2 + (Y - 1/2)^2 - 1/4). Zeros of the Selberg zeta function satisfy s(1 - s) = lambda_j; surfaces with eigenvalues 0 < lambda_j < 1/4 exist (Randol; Buser), giving zeros in (0,1) off the line. So the leaf structure plus the flow plus an exact trace formula gives at most "line or real segment", and that only through a self-adjoint Laplacian on an L^2 space containing the spectrum; no such space is given for the zero module.
- E_a: at the local step (section 3) the base Higgs field diag(a,-a) returns Re s = +-a. PROVED. On Gamma(p) the lift itself behaves as E_{1/2} (4.3). PROVED.
- DH: Sigma_a = sum a(n) n^* is not the averaging map of a group action (a(6) != a(2)a(3)), so the cone construction of 4.4 has no quotient-space meaning; the first step of the lane is unavailable. Since the lane proves nothing about zeros, there is no positive claim for DH to contradict.
- Unimodular twist U, backward heat, sign twist: statements 4.1-4.3 concern the lift and the character only and hold unchanged under each; consistent with a negative result. No step of this lane distinguishes zeta from these controls, because no step reaches the zeros.

---

## 6. Pivot (one, assessed on paper, not pursued)

Strongest adjacent idea: use the map of [CC] section 6, C_Q -> GL_2(Q)\M_2(A_Q)/C^*, to place the s-family inside L^2 of the GL(2) quotient, where the Casimir is self-adjoint and the Selberg-type conclusion "line or real segment" would suffice (zeta has no zeros in (0,1), CLASSICAL). Assessment: on X-invariant functions the family y^s enters through Eisenstein series, where zeta zeros appear as scattering resonances (poles of the scattering coefficient at rho/2), not as L^2 eigenvalues; self-adjointness gives no constraint on resonances (Lax-Phillips, Pavlov-Faddeev; CLASSICAL). Not run; no claim.

---

## 7. Verdict

Precise obstruction. On the Connes-Consani complex lift: (1) Fr_lambda is a leafwise stretch, holomorphic only for lambda = 1; (2) Re s is the exponent of the leafwise canonical bundle (curvature i sigma omega), not a Higgs field, and the flat bundle has no harmonic metric on Gamma(p); (3) the s-twisted cohomology of Gamma(p) has jump locus Re s in {0, 1}, the E_{1/2} pattern, with all holomorphic sectors acyclic. The Simpson scaling argument has no object to act on. The one-prime elliptic-curve model does satisfy it but yields only Re s = 0 for the local factor. No statement about zeros of zeta or a zero-free region is made.

## 8. Three weakest steps

1. Section 4.4 global formula jump(lift) = jump(base) union (jump(base)+1): formal. It is proved only on Gamma(p) in the [CC] algebra (finite Fourier support in q, smooth in y). A different function space on the full lift (for example Bohr almost periodic leafwise holomorphic functions with growth conditions at y -> 0) could give non-acyclic q != 0 sectors; this was not examined.
2. Section 4.2 excludes a harmonic metric only for smooth phi on Gamma(p), using the measure dm. Singular metrics, or a different leafwise complex structure on the same foliation (one in which the stretch is holomorphic does not exist leaf by leaf for H, but a transverse-holomorphic structure pairing Y with a new direction was not considered), are not excluded.
3. The Selberg control and the pseudo-Anosov conclusion rest on cited results (Casson-Bleiler criterion; Randol/Buser small eigenvalues; Selberg zeros s(1-s) = lambda_j) that were not re-derived or computed here; the identification of the Selberg setting with the lift is at the level of the leaf structure of [CC] Prop. 5.1 only.
