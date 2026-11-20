# REFEREE: n2-epstein-degree-nine-anchors

Referee: adversarial (general). Date 2026-11-17. Verdict on the claimed "precise obstruction": **holds, with one wording correction and one upgrade.** No PROVED step failed re-derivation. No RH assumption, no novelty claim that needs a literature check, no ssh. All runs went through `scripts/memcap.sh 8` (single process; 39 s, 49 s, 2 s). Scratch scripts are in `/tmp/ref_n2/` (ref.py, ref2.py, ref3.py), not in the repo.

## 1. Re-derivation of the PROVED steps

| Step | Result | Notes |
|---|---|---|
| (i) J = \|F_z(z,s)\|^2 - \|F_z(z,1-conj s)\|^2 | CONFIRMED | F_zbar(z,s) = conj(F_z(z,conj s)) from F(z,conj s) = conj F(z,s); then s -> 1-s. |
| (i) oddness of J under each mirror, J = 0 on the boundary of K | CONFIRMED | g(z) = F(-conj z) gives F_z(z) = -F_zbar(-conj z); J changes sign. The other two mirrors follow by invariance. |
| (i) termwise derivative | CONFIRMED | d/dz[y^s \|mz+n\|^-2s] = -(is/2) y^(s-1) (m zbar+n)^2 \|mz+n\|^(-2s-2), re-derived by hand. |
| (ii) W(1-conj s) = -W(s) | CONFIRMED | Proof is one line; numerically W(0.65+17.3i) = -2 and W(0.35+17.3i) = +2; same at 0.70+31.7i (-2/+2) and 0.58+43.21i (-3/+3). |
| (ii) top edge negligible, W independent of Y | CONFIRMED | Needs the constant term to be nonzero for y > 1, sigma > 1/2; this follows from \|phi(s)\| < 1 in sigma > 1/2 (classical). The result does not state this; it should. Numerically W(Y) = W(Y+1.7) at three points. |
| (iii-a) F_x = 0, F_y = 2i F_z, weight-2 sum at anchors with units +-1; sum vanishes at D = -3, -4 | CONFIRMED | Direct lattice sum (\|m\|,\|n\| <= 1500) at s = 1.9+2.3i against finite differences of the evaluator at D = -11, -8, -19 (not the cases in anchors.log): agreement to 7 digits. Corners: both sides zero to working accuracy. The corner vanishing also follows without units: two mirrors meet. |
| (iii-a) corner orders (quadratic at i, cubic at e^(i pi/3)) | CONFIRMED | Stabiliser of order 2 resp. 3 plus Laplace equation at a zero. The evidence quoted from anchors.log for D = -3 is finite-difference noise (F_xx = F_yy = +8e-3, same sign), so it is not a numerical confirmation; the symmetry proof stands on its own. |
| (iii-b) half-plane, direction arg(-F_y/F_s) mod pi | CONFIRMED | F is an analytic function of (x^2, y) beside a mirror, so the implicit function theorem in (eta, X = x^2) gives exactly one interior zero for delta in an open half-plane. Unstated extra hypothesis: F_s != 0. |
| (iii-c) no interior zero near an anchor for s off the line | CONFIRMED and UPGRADED | See section 2. |
| Jump set | CONFIRMED with qualifier | A boundary zero is necessary for a jump; "exactly when" is true at nondegenerate boundary zeros only. |

## 2. Upgrade of (iii-c): it is exact, not first order

The result lists (iii-c) as its weakest step 2 ("a first-order argument"). It can be made exact. F(z, 1-conj s) = conj F(z,s) gives that Im F(z, 1/2 + d + it) is odd in d, so Im F = d * H(z, d, t) with H real-analytic and H(z, 0, t) = -G(z, t). If G(z_D, gamma) != 0 then H != 0 on a neighbourhood U of (z_D, 0, gamma), and F has no zero in U with d != 0. No Taylor remainder is involved. Checked at gamma_3 (a case the result did not run): Im F(z_D, rho_3 + 0.001)/0.001 = -G(z_D) to 5 digits at all nine anchors.

The same argument shows more: off-line zeros with sigma -> 1/2 accumulate only at points where R = 0 and G = 0 together (double zeros in t of a real Epstein zeta on the line).

## 3. Correction: "no trace" has no uniform neighbourhood, and gamma_3 shows it

The neighbourhood U in (iii-c) has no lower bound on its size. Measured at the third zeta zero (not in the result):

- L(1/2+it, chi_-43) has a zero at t = 24.98922, which is 0.0216 below gamma_3 = 25.01086.
- W jumps from -1 to 0 at t = gamma_3 - 0.01104 (sigma = 0.5005), gamma_3 - 0.0111 (0.505), gamma_3 - 0.0118 (0.52), gamma_3 - 0.0158 (0.55); no jump within 0.03 at sigma = 0.6.
- The boundary zero responsible sits on x = 1/2 at y = 3.27880 (sigma = 0.5005), which is 8.5e-5 from the anchor y = sqrt43/2 = 3.27872.

So the zeta zero rho_3, followed along the mirror by less than 1e-4 in y, collides with the neighbouring zero of L(s, chi_-43) and leaves the line; the jump curve starts 0.011 from rho_3. The result's own gamma_2 data shows the same pattern (jump at 20.997 at y = 3.276, 0.003 from the same anchor) and reads it as "none is at an anchor".

Consequences for the wording:

1. "W constant through the first two zeta zeros" is correct for those two; "W is constant through t = gamma in a neighbourhood" is correct, but the neighbourhood is smaller than 0.012 at gamma_3 and is controlled by the gap between gamma and the nearest zero of the nine L(s, chi_D). No height-uniform statement follows.
2. "The class-number-one anchors ... contribute nothing to W off the line" should read: the anchor points themselves carry no off-line zero (given the verified height), but boundary points arbitrarily close to an anchor do, whenever a zeta zero and an L(s, chi_D) zero are close. The jump set is not "unrelated to zeta": part of it is zeta zeros displaced by an O(gap^2)-size change of the lattice.

This does not rescue the route. It strengthens the obstruction: the nine-anchor configuration is unstable under perturbation of z of size 1e-4, and the stability radius is a zero-gap quantity with no uniform lower bound (the common wall of the campaign).

## 4. Independent numeric check with a different case

Case: z_0 = (1 + i sqrt5)/2, form [2,2,3], D = -20, the non-principal class (the result used [1,0,5] and i pi/2).

- Evaluator against an independent formula E* = pi^-s Gamma(s) (1/2)(sqrt5)^s [zeta L(chi_-20) - L(chi_-4) L(chi_5)] in mpmath at three strip points: relative difference 9e-16 to 4e-15.
- One off-line zero in 0.52 < sigma < 1, 10 < t < 50: s_0 = 0.862385515 + 41.766973259i (mpmath findroot; evaluator gives \|F\| = 2e-14 there).
- F_xx + F_yy = 0 at the zero to 5e-7 relative.
- Circle test, 24 points: at radius 0.002, 0.001, 0.0005 W = -2 on the predicted side and -1 on the other at 24 of 24 points. At radius 0.004 five points disagree; cause located: a second jump curve (boundary zero at x = 1/2, y = 2.318) crosses that circle. (iii-b) holds; a radius of 0.004 is not always small enough, which also explains the one-sample ambiguity bands in the result's control (a).
- Scan values off the result's grid: W = -2, -2, -3 at 0.65+17.3i, 0.70+31.7i, 0.58+43.21i, unchanged under 4 times finer sampling.

## 5. Controls

The result claims no zeta-only mechanism; it claims blindness of (i), (ii), (iii-b). Checks:

- Davenport-Heilbronn type: the class [2,2,3] is a difference of two Euler products with one functional equation and has off-line zeros. (i), (ii), (iii-b) hold for it (section 4). Agreed: the mechanism does not separate. The Davenport-Heilbronn function itself (degree 1, conductor 5) is not a value of F(z,s); "not formulable" is correct.
- Backward heat and sign twist: both act on one L-function in the s variable and define no function of z on K. "Not formulable" is accepted; nothing was run because there is nothing to run. This is a limitation of the lane, not an error.
- E_a: the shifted family G = F(z,s+a) + F(z,s-a) keeps evenness, s -> 1-s and reality on the line. Accepted by inspection; not run.

## 6. Other checks

- RH is not assumed. (iii-c) assumes a simple zeta zero and L(rho, chi_D) != 0, both stated.
- "The anchors contribute no point to the jump set below the verified height" is a restatement of verified height and is labelled as such. No finite certificate is presented as a result.
- Nothing is presented as new that is classical. The weight-2 derivative at CM points (Hecke L-value) and the collision mechanism for off-line Epstein zeros are classical and are used, not claimed.
- MEASURED table: not re-run in full. Spot checks agree. The drift -0.055 t has no derivation and stays MEASURED.

## 7. Surviving claim

(i), (ii), (iii-a), (iii-b), (iii-c) and the oddness of W are proved; (iii-c) holds exactly (parity in sigma - 1/2), on a neighbourhood whose size is not uniform. W obeys no sign, monotonicity or boundedness law on the tested range. The obstruction stands, restated: the nine-anchor simultaneity is a codimension condition at s = rho that is invisible off the line inside a neighbourhood of size set by the gap to the nearest zero of L(s, chi_D), and at distance 1e-4 in the lattice variable the zeta zero itself joins the jump set (gamma_3, D = -43). No inequality. No route to RH.

Strength: 0.85 of the claimed obstruction (deduction for the "unrelated to zeta / leaves no trace" wording and the unstated non-uniformity; credit for (iii-c) being exact).
