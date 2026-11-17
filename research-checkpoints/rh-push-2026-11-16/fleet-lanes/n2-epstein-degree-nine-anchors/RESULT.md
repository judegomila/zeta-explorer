# n2-epstein-degree-nine-anchors: RESULT

Verdict: **precise obstruction; the idea is dead as a route.** The first test kills it. The winding W(s) obeys no sign, monotonicity or boundedness law, its jump set is unrelated to zeta zeros, and at a zeta zero on the critical line the nine-anchor passage leaves no trace at any s off the line. No RH claim. No pivot was run (reason in section 6).

Notation. F(z,s) = E*(z,s) = pi^-s Gamma(s) (1/2) sum'_(m,n) y^s |mz+n|^(-2s). F(z,s) = F(z,1-s), F(z, conj s) = conj F(z,s), F(-conj z, s) = F(z,s), F is PSL2(Z)-invariant, and y^2 Laplace F = s(s-1) F. K = {0 <= x <= 1/2, |z| >= 1}, K_Y = K with y <= Y. The boundary of K consists of three mirrors (x = 0, x = 1/2, |z| = 1). The nine class-number-one points z_D (D = -3, -4, -7, -8, -11, -19, -43, -67, -163) all lie on the boundary: D = -4, -8 on x = 0; the other seven on x = 1/2; z_-4 = i and z_-3 = e^(i pi/3) are the two corners.

## 1. Plan (what is new against the map)

G12, G13, G16, G17 and P32 treat E*(z,s) for fixed z as a function of s. This lane treats it for fixed s off the line as a complex-valued map of z and asks whether the simultaneous vanishing at nine boundary points constrains the degree of that map. Steps: prove or correct the lemma; compute W on the assigned grid; confirm by 2D Newton; map the jump set near the first two zeta zeros; run the controls.

## 2. First lemma: proved parts and corrections

**(i) Jacobian. PROVED, with a normalisation fixed.** For a C^1 complex map, J = |F_z|^2 - |F_zbar|^2. Since F(z, conj s) = conj F(z,s), F_zbar(z,s) = conj(F_z(z, conj s)), and F(z, conj s) = F(z, 1 - conj s) as functions of z. So

J(z,s) = |dF/dz (z,s)|^2 - |dF/dz (z, 1 - conj s)|^2.

Termwise, d/dz [y^s |mz+n|^(-2s)] = -(i s/2) y^(s-1) (m zbar + n)^2 |mz+n|^(-2s-2), so dF/dz is the weight-2 series the assignment calls E_2*, with c(s) absorbed. The identity was checked numerically at s = 2.6 + 1.3i (anchors.log: agreement to 8 digits at D = -7, -163). Oddness: F(-conj z) = F(z) gives F_z(-conj z) = -F_zbar(z), hence J(-conj z, s) = -J(z,s). The same holds for the other two mirrors by invariance. Consequence: J = 0 on all of the boundary of K; the map folds along each mirror. On Re s = 1/2, F is real and J = 0 identically.

**(ii) Degree. CLASSICAL.** If F(.,s) has no zero on the boundary of K_Y, the winding number W(s) of F along the counterclockwise boundary equals the sum of local indices of the zeros in the interior, which is the sum of sign J over nondegenerate zeros. Added facts, PROVED: W(1 - conj s) = -W(s) (complex conjugation), so W is odd under reflection in the critical line; the top edge contributes exponentially little for Y >= 3 + |t|/pi; on the double SL2(Z)\H the signed count is 0 by oddness of J, so W is the only invariant.

**(iii) Tangent and half-plane. CORRECTED in three places.**

- (iii-a) PROVED for D not in {-3, -4}: at the anchor F_x = 0, F_y = 2i F_z, and F_z(z_D, s) = -(i s/2) y^(s-1) pi^-s Gamma(s) (1/2) sum over nonzero alpha in O_D of conj(alpha)^2 N(alpha)^(-s-1), which is the Hecke L-value L(s+1, psi_D^2) with its gamma factor, up to an elementary factor. **Correction:** for D = -4 and D = -3 the sum vanishes identically (units of order 4 and 6), so the tangent is 0 at the two corners. At z = i the first nonzero term is alpha (u^2 - v^2) in a local coordinate; at z = e^(i pi/3) all second derivatives vanish at a zero (the |w|^2 coefficient is proportional to s(s-1)F = 0) and the first term is cubic. Numerics agree (anchors.log: F_y at D = -4 and all second derivatives at D = -3 are zero to finite-difference accuracy).
- (iii-b) PROVED for any boundary point z_0 on an open mirror and any s_0 with F(z_0, s_0) = 0, Im(conj(F_y) F_xx) != 0: with eta along the mirror, x across it and delta = s - s_0, F = F_y eta + (1/2) F_xx x^2 + F_s delta + higher order, so x^2/2 = -Im(conj(F_y) F_s delta) / Im(conj(F_y) F_xx). An interior zero beside z_0 exists exactly for delta in an open half-plane, whose boundary line has direction arg(-F_y/F_s) mod pi (the tangent of the curve s(y) of zeros of the boundary Epstein zeta). W changes by one unit across that line. This statement does not use the Euler product or class number.
- (iii-c) **Correction, PROVED:** at a zeta zero rho on the critical line the nondegeneracy condition fails. There F_y and F_xx are real (F_xx = -F_yy by the Laplace equation), and F_s = -i G with G = dF/dt real. The half-plane formula is 0/0. Direct expansion: F(z, rho + delta) = [R(z) + delta_t G(z)] - i delta_sigma G(z) + O(|delta|^2) with R = F(.,rho) real, R(z_D) = 0, G(z_D) proportional to zeta'(rho) L(rho, chi_D) != 0. For delta_sigma != 0 the imaginary part cannot vanish near z_D. So **for s off the line near a simple zeta zero on the line there is no interior zero of F(.,s) near any anchor; H_D(rho) is empty, and the nine "boundary lines" all coincide with the critical line itself.** The simultaneous passage of the loop through 0 happens only at s = rho, where F is real, the loop is a degenerate real segment and W is not defined. The half-planes H_D exist only at a hypothetical zero off the line.

Numerical check of (iii-c) at the first two zeta zeros (anchors.log): Im F_y, Im F_yy, Im G are below 1e-12 relative; dF/dsigma is purely imaginary and equals -iG; F_xx = -F_yy to 5 digits; G != 0 at all nine anchors.

## 3. First test (MEASURED)

Setup: Chowla-Selberg expansion, python-flint Bessel K at 128 bits with radius check and automatic precision doubling (533,062 escalations at sigma = 0.55; without this check arb midpoints are wrong for arguments near |t|), values scaled by exp(pi |t|/2). Self-test: z = i against 2 zeta L(chi_-4), all nine anchors against (w/2)(sqrt|D|/2)^s pi^-s Gamma(s) zeta(s) L(s, chi_D) to 14 digits, modular invariance, functional equation, direct lattice sum. Loop truncated at Y = 3 + |t|/pi, adaptive phase unwrapping. Grid: sigma in {0.55, 0.65, 0.8, 0.95}, t in [10, 50] step 0.05, 3204 points, 11 min 50 s, all runs through scripts/memcap.sh 8.

| sigma | non-integer W | W range | mean W | mean by decade 10-20 / 20-30 / 30-40 / 40-50 | changes between adjacent t | changes by more than 1 | fraction W > 0 | linear trend per unit t |
|---|---|---|---|---|---|---|---|---|
| 0.55 | 0 | -8 .. 4 | -1.652 | -0.92 / -1.41 / -1.80 / -2.48 | 335 | 77 | 0.109 | -0.051 |
| 0.65 | 0 | -10 .. 4 | -1.707 | -0.92 / -1.40 / -1.93 / -2.58 | 327 | 83 | 0.111 | -0.056 |
| 0.80 | 0 | -7 .. 2 | -1.780 | -0.91 / -1.49 / -1.94 / -2.77 | 255 | 34 | 0.065 | -0.061 |
| 0.95 | 0 | -5 .. 2 | -1.753 | -0.97 / -1.49 / -1.96 / -2.59 | 182 | 10 | 0.034 | -0.054 |

- No sign law: W is positive on 3 to 11 percent of the grid and zero on 11 to 18 percent.
- No monotonicity in t or in sigma. At step 0.05 the grid undersamples the jump set (up to 83 steps with a change of more than one unit).
- The only regularity is a negative drift of the mean, about -0.055 t, nearly independent of sigma. It is a mean value over t.
- Newton confirmation (zeros.py; cell windings then 2D Newton; sum of sign J): 14 points, 3 to 57 interior zeros each. 12 agree with the boundary winding at the first grid; the two at t = 50 disagreed by one at the coarse grid and agree on a 100 x 900 grid (W = -4 = sum sign J, 56 and 50 zeros, no failures). A 240-point random subsample of the scan recomputed with 4 times finer boundary sampling: 0 disagreements.
- Interior zeros carry both signs everywhere in K (430 zeros: 193 positive, 237 negative).

Jump set near the first two zeta zeros (local1.log, local2.log, fine2.log; sigma from 0.5005 to 0.99):

- gamma_1 = 14.1347: W = -1 on the whole rectangle 0.51 <= sigma <= 0.99, 13.63 <= t <= 14.34. The first jump curves leave the critical line near t = 14.35 and t = 14.51 and move to the right with increasing t.
- gamma_2 = 21.0220: W = -1 for 21.004 <= t <= 21.030 at every sigma in [0.5005, 0.52]; jumps at t = 20.997 (edge x = 1/2, y = 3.276), 21.031 (x = 1/2, y = 1.817), 21.057 (x = 0, y = 2.397). None is at an anchor (sqrt43/2 = 3.2787) and none is at gamma_2.
- W at the grid points nearest the first ten zeta zeros takes the values -1, 0, 0, 2, -1, -7, -1, -2, -8, -5 at sigma = 0.55: no value is attached to a zeta zero.

Structure of the jump set, PROVED: W(s) jumps exactly when F(z,s) = 0 for a boundary z, i.e. at the off-line zeros of the Epstein zeta functions of the ambiguous forms. The jump set is the union of the curves s(y) along the three mirrors; each curve meets the critical line where two on-line zeros of a boundary Epstein zeta collide. The anchors contribute no point to the jump set below the verified height of zeta and the nine L(s, chi_D).

## 4. Controls

- (a) z = i sqrt5 (form [1,0,5], h = 2). MEASURED: five zeros of F(i sqrt5, s) in 0.505 < sigma < 1.005, 10 < t < 50, at s = 0.634908 + 46.758409i, 0.696927 + 36.374064i, 0.823187 + 44.000113i, 0.932970 + 15.668250i, 0.937667 + 29.983395i. On a circle of radius 0.004 around the first, W = -1 on one half and 0 on the other; the measured boundary direction lies in [2.487, 2.749] and [5.629, 5.890], the predicted direction arg(-F_y/F_s) is 2.4940 and 5.6356; the predicted side agrees at all 24 sample points. One passage, one half-plane, W changes by 1, and nothing is contradicted.
- (b) Non-CM point z = i pi/2. Four off-line zeros in the same box; around s = 0.731629 + 22.449369i, W = -3 on one half-plane and -2 on the other, sides as predicted (12 of 24 points each). Statements (i), (ii), (iii-b) and the oddness of W survive for every boundary point and every class. Only (iii-a) (tangent equals a Hecke L-value) and the simultaneity at s = rho use complex multiplication and h = 1.
- (c) E_a(s) = zeta(s+a) zeta(s-a). Not a value F(z,s) at any z in K: its Dirichlet series belongs to a split form, which is the cusp, and at the cusp the map sees zeta*(2s) and zeta*(2s-1). The shifted family G(z,s) = F(z,s+a) + F(z,s-a) is even in z, symmetric under s -> 1-s and real on the line, so (i), (ii), (iii-b) hold for it, but its anchor values Lambda_D(s+a) + Lambda_D(s-a) have no common zero. The nine-anchor statement is not formulable for E_a. Flagged.
- (d) Backward heat and sign twists: not formulable. Both act on the s-side kernel or on the prime coefficients of one L-function; neither defines a function of z on K. Flagged.
- Blindness: (i), (ii), (iii-b), the oddness of W and the jump-set description use only evenness under the mirrors, the Laplace equation and the symmetry s -> 1-s. They hold for every lattice and every class.

## 5. Why the joint nine-anchor constraint gives no inequality

1. For a zeta zero on the line the constraint is invisible off the line (iii-c): W is constant through t = gamma in a neighbourhood (measured at gamma_1, gamma_2).
2. For a hypothetical zero rho_0 off the line, seven half-planes H_D(rho_0) and two corner sets meet at rho_0 and W = W_0 + sum of eps_D 1_(H_D) nearby, a variation of at most 9. A contradiction needs a law that bounds the local variation of W or fixes the signs eps_D. Measured: W ranges over 15 values on [10, 50], changes by up to several units inside 0.05, has both signs and no monotonicity. Self-crossings of the jump set are generic (two boundary points and s: four real equations, four real unknowns). A seven-fold crossing has codimension 5 and is excluded by no identity.
3. The directions arg(-F_y/F_s) at rho_0 are ratios L(rho_0 + 1, psi_D^2) / (zeta'(rho_0) L(rho_0, chi_D)) times elementary factors. No relation among them for different D is known; G16 already records that the Hecke relations in the lattice variable are linear and exclude no zero.
4. The one regularity (mean W about -0.055 t) is a mean value over t and is of MV-CAP type.

Obstruction, stated precisely: **W(s) is the degree of the projection of the zero variety {F(z,s) = 0} in K x C onto the s-plane. Its discontinuities are the off-line zeros of the Epstein zeta functions of ambiguous forms, which exist in abundance and are unrelated to zeta. The class-number-one anchors are the boundary points whose zeros stay on the line, so they contribute nothing to W off the line, and W satisfies no pointwise law that a nine-fold crossing would violate.**

## 6. Pivot

Not run. The adjacent candidate is the on-line object: the nodal curve of the real function F(., 1/2 + it), which passes through all nine anchors at t = gamma, with the limit of W as sigma -> 1/2+ equal to the signed intersection count of the nodal curves of F and dF/dt. Its events are the collisions of on-line zeros of boundary Epstein zetas, which is the content of P32 (class-group pencil; openness only, collision angle decaying) and G17 (cosine dominance, capped by D >= -163). It was not re-run.

## 7. Status labels

- PROVED: (i) with J = |F_z(z,s)|^2 - |F_z(z,1-conj s)|^2 and oddness; W(1 - conj s) = -W(s); (iii-a) for D not in {-3,-4} and vanishing tangent at D = -3, -4; (iii-b); (iii-c); description of the jump set.
- CLASSICAL: (ii); Chowla-Selberg; factorisation at the anchors.
- MEASURED: all tables in sections 3 and 4.
- OPEN: shape of the zero set beside the two corner anchors beyond leading order; any derivation of the drift -0.055 t; any relation among the nine directions at a hypothetical off-line zero.

## 8. Three weakest steps

1. Winding numbers are float64 phase unwrapping with adaptive refinement, not interval-certified. Support: 0 non-integers in 3204 points, 0 of 240 disagreements under 4 times finer sampling, 14 of 14 Newton confirmations after refining two grids. The t step 0.05 undersamples the jump set, so the "changes" columns are lower bounds.
2. (iii-c) is a first-order argument and needs G(z_D) != 0 (simple zeta zero, L(rho, chi_D) != 0); checked numerically at the first two zeros only. The corner anchors D = -3, -4 are treated at leading order only.
3. "No inequality" in section 5 is a statement about the laws tested (sign, monotonicity, bounded variation, jump locations) on sigma in {0.55, 0.65, 0.8, 0.95}, t <= 50. It is not a proof that no functional of the nine directions is constrained; item 5.3 is the reason none is expected, not a theorem.

## Files

All under `tmp/research-2026-11-16/push/n2-epstein-degree-nine-anchors/`: `elib.py` (evaluator, winding), `selftest.py`, `scan.py` + `scan_main.json` + `scan_summary.json`, `zeros.py` + `zeros_check.json`, `zeros_fine.py` + `zeros_fine.json`, `recheck.py`, `localmap.py` + `local1.log`, `local2.log`, `fine2.py` + `fine2.log`, `anchors.py` + `anchors.log`, `control_a.py` + `control_isqrt5.log`, `control_noncm.log`. Interpreter: `.venv-arb/bin/python`.
