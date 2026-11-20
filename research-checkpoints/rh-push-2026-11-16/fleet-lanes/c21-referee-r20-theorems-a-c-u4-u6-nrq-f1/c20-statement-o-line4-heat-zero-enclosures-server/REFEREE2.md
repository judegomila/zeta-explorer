# REFEREE2: escape law F1 (Statement O line 4; Theorem A of `b-escape-law`, zeros certified by c20-statement-o-line4-heat-zero-enclosures-server)

Second referee, lane `c21-referee-r20-theorems-a-c-u4-u6-nrq-f1`, 2026-11-20. Written from `b-escape-law/RESULT.md`
(sections 0 to 2) and `c20-statement-o-line4-.../RESULT.md` (sections 0 to 3) only; neither `REFEREE.md` was opened.
The checkpoint input names "the Lemma R tail repair for the sharp-reach clause"; the gap was found here
independently (section 2) and a repair is written out. Numerics: `f1_ref2.py` -> `f1_ref2.json`, `f1_ref2.log`
(mpmath 40 digits, trapezoid sums, not ball arithmetic; local, `scripts/memcap.sh 8`, 3 minutes; the last line of the
log is a failed root search for sigma_1 that supports nothing and is not used).
The statement concerns the control family H_{-tau}, tau > 0. No statement about zeros of zeta.

## Verdict

**F1 holds with one correction.** Clause (i) (escape: for every tau > 0 the zeros of H_{-tau} leave every
horizontal strip, with positive lower density) is PROVED-2 as written. Clause (ii) (sharp reach, the limsup
formula) holds after a repair of the far-zone estimate in Lemma R, which as written is not uniform in the line
parameter kappa_0; the repair is elementary and is given below (PROVED-2 with the repair). The line-4 lane's
certified zeros are consistent with Lemma R at the three zeros tested.

## 1. Steps re-derived

| step | content | check | label |
|---|---|---|---|
| (1.1) | F = H_{-tau} = H_0 * G_tau, G_tau the centred Gaussian of variance 2 tau | e^(-tau u^2) = E e^(iWu), W ~ N(0, 2 tau) | PROVED-2 |
| Lemma 1 | F = sum_n T_n, T_n = int over Im w = -kappa_0 of J_0(w) n^(-(1+iw)/2) G_tau(z - w) dw, kappa_0 > 1 | contour shift (H_0 bounded on horizontal strips, Gaussian decay); Re s = (1 + kappa_0)/2 > 1 on the line; Fubini; J_0 analytic for Re s > -2 (the pole of Gamma(s/2) at 0 is cancelled by s) | PROVED-2 |
| g' | g'(w) = (i/2)[1/s + 1/(s-1) - (1/2) log pi + (1/2) psi(s/2)], ds/dw = i/2 | Re g' -> -pi/8, Im g' = (1/4) log(abs(s)/2 pi) + O(1/abs s) | PROVED-2; CHECKED: Re g' = -0.39227, -0.392697 (pi/8 = 0.392699); Im g' - L/4 = 1.3e-7, 2.5e-12 |
| main term | with J_0(w) replaced by J_0(z) e^(g'(z)(w - z)): M_n = T#(z) b_n n^(-s_eff(z)), s_eff = (1+iz)/2 + i tau g'(z), b_n = e^(-(tau/4) log^2 n) | int e^(cu) G_tau(u) du = e^(tau c^2), c = -g' + i log n/2; tau c^2 = tau g'^2 - i tau g' log n - (tau/4) log^2 n | PROVED-2 (exact algebra) |
| error, exponent | abs(E_n)/abs(T#) <= n^(-(1+kappa_0)/2) exp((kappa_0 - (2 sigma - 1))^2/(4 tau)) eps(z) | with delta = kappa_0 - eta: delta^2/(4 tau) + delta Im g' + tau (Im g')^2 = (delta + 2 tau Im g')^2/(4 tau) and delta + 2 tau Im g' = kappa_0 - (2 sigma - 1) | PROVED-2 |
| error, near zone | abs v <= abs(z)/2: abs R <= C (v^2 + log^2 abs z)/abs z | the segment [z, w] stays in Re s >= 3/2 and at distance >= abs(z)/3 from the origin (abs delta = O(log abs z) in all cases, including eta large); g'' = O(1/abs omega) there; abs R <= C abs(v)/2 + o(1) on this range, so e^(abs R) is integrable against the Gaussian | PROVED-2 |
| error, far zone | abs v > abs(z)/2 "negligible" by abs J_0(w) <= C(kappa_0), abs J_0(z)^-1 <= e^(pi abs z/8) abs(z)^C | **not uniform as written when kappa_0 = 2 sigma - 1 is unbounded** (needed for clause (ii), where z ranges over all of Re s_eff >= sigma^+ + eps, in particular eta >> log abs z). See section 2 | PROVED-2 after repair |
| Lemma D (a) to (e) | D_tau entire of order <= 2; infinitely many zeros (Hadamard: Q e^P -> 1 along the real axis forces Re and Im of the coefficients of P to vanish and Q constant); almost periodic in strips; sigma^+ finite and inf abs D_tau > 0 on Re s >= sigma^+ + eps (normal family of vertical translates, Hurwitz; for Re s >= sigma_1 + 1 the triangle inequality gives a uniform lower bound); b_4 != b_2^2 | each re-derived | PROVED-2 (Hadamard, Bohr, Hurwitz CLASSICAL) |
| Theorem A (i) | Rouche on a conformal copy Omega_T of B(s_0 + iT, r) | s_eff' = i/2 + O(1/T) on B(2T, C log T); the target s_0 + iT is at distance (tau/4) log T + O(1) from s_eff(2T), inside the covered disc of radius (C/4) log T when C > tau; on Omega_T: sigma = Re s_eff is within r of sigma_0, so kappa_0 = 2 is fixed and the far zone is fine as written; abs(F/T# - D_tau(s_eff - iT)) < 2m/3 < m | PROVED-2 |
| density | a 2-separated subset of the relatively dense set of almost periods gives disjoint domains (diameter <= 3 in z, centres 4 apart) | | PROVED-2 |
| Theorem A (ii) | no zero with abs z >= r_1 and Re s_eff >= sigma^+ + eps; limsup formula | needs Lemma R uniformly in sigma >= a, including sigma -> infinity | PROVED-2 with the repair |

## 2. The correction: far zone of Lemma R, uniform in kappa_0

Write the far-zone part of E_n as the integral over abs v > abs(z)/2 of [J_0(w) - J_0(z) e^(g'(z)(w - z))] n^(-(1+iw)/2) G_tau(z - w).
The second piece is the main-term integrand restricted to abs v > abs(z)/2: after division by abs T# it is at most
n^(-(1+kappa_0)/2) e^((kappa_0 - (2 sigma - 1))^2/(4 tau)) int over abs v > abs(z)/2 of e^(-v Re g') G_tau(v) dv,
which is below exp(-abs(z)^2/(17 tau)) for large abs z since abs(Re g') is bounded. For the first piece, the same
division gives the factor abs(e^(R(w))), so what is needed is a bound for Re R(w) that the Gaussian absorbs. As
written the lane bounds abs J_0(w) by a constant depending on kappa_0 and abs J_0(z)^-1 separately; when
kappa_0 = 2 sigma - 1 grows with z neither is uniform. Repair: on the whole segment Re s >= 3/2, where
abs g''(omega) <= C_1/(1 + abs omega). Hence abs(g'(omega) - g'(z)) <= C_1 times the integral of 1/(1 + abs omega)
along the segment, which is at most 2 C_1 log(2 + abs(w - z)), and

    abs R(w) <= 2 C_1 abs(w - z) log(2 + abs(w - z)),   abs(w - z) <= abs v + abs delta,  abs delta <= C_2 (1 + log abs z).

For abs v > abs(z)/2 this is at most C_3 abs(v) log(2 + abs v), and
int over abs v > abs(z)/2 of e^(C_3 abs v log(2 + abs v) + abs(v) abs(Re g')) G_tau(v) dv <= exp(-abs(z)^2/(17 tau)) for
abs z >= r_0(tau, C_3). The constants C_1, C_2, C_3 do not depend on kappa_0 or sigma. With this, (2.2) holds
uniformly on {Im z < 0, abs z >= r_0, Re s_eff(z) >= a}, which is what clause (ii) uses. Clause (i) does not need
the repair.

Label of the lane's text: Lemma R "PROVED (constants not tracked)" should read "PROVED for sigma in a bounded
range as written; PROVED for all sigma >= a with the far-zone repair of the second referee". The "Remark
(uniformity down to the real axis)" stays MEASURED.

## 3. Numerical test at certified zeros (40 digits; trapezoid step 0.05, step-halving difference below 1e-22)

D_tau(s) is evaluated as the Gaussian mean E zeta(s + iV), V ~ N(0, tau/2) (the pole term is of size
e^(-t^2/tau) at these heights); F/T# by direct convolution of H_0 on the horizontal line through z.

| tau | certified zero z (centre of the half-width 1e-6 square) | s_eff(z) | abs(F/T#) at z | abs D_tau(s_eff(z)) | log^2 abs z/abs z | controls z + 0.3 and z - 0.4i: abs(F/T# - D_tau(s_eff)) against abs D |
|---|---|---|---|---|---|---|
| 1 | 5001.646847849111 - 1.635148075297 i | -0.17905 + 2500.43116 i | 4.3e-13 | 3.06e-4 | 1.45e-2 | 2.76e-4 against 0.3721; 2.80e-4 against 0.4339 |
| 0.25 | 1000006.298867790512 - 1.345582919615 i | 0.46751 + 500003.05126 i | 4.7e-13 | 1.28e-7 | 1.91e-4 | 1.12e-7 against 0.2237; 1.51e-7 against 0.2778 |
| 0.25 | 1000020.455262144711 - 0.952082371855 i | 0.27076 + 500010.12946 i | 8.8e-13 | 2.57e-7 | 1.91e-4 | 2.61e-7 against 0.5931 (z - 0.4i: 2.44e-7 against 0.5931) |

Reading: at each certified zero F/T# vanishes to the accuracy of the 12-digit centre, and the model value
D_tau(s_eff(z)) is of the size of the Lemma R error (0.02, 0.0007, 0.0013 times log^2 abs z/abs z); at control
points 0.3 to 0.4 away both are of size 0.2 to 0.6 and agree to the same error. The near-affine formula for s_eff
agrees with the exact one to 4e-4 (tau = 1, x = 5e3) and 5e-7 (x = 1e6), inside O(tau (1 + eta)/x).
This is an independent evaluation route (mpmath, different quadrature, the zeta-average form of D_tau) for the
identification of the zeros of H_{-tau} with zeros of D_tau; it is MEASURED, not a certificate.

## 4. Line 4 as a statement

Supported by two referees after this pass: "for every tau > 0 the zeros of the backward heat function H_{-tau}
are contained in no horizontal strip (Theorem A (i), PROVED-2); six off-axis zeros are enclosed with winding
number 1 (line-4 lane, CERTIFIED, one derivation; three of them re-evaluated here)". The sharp-reach constant
2 sigma^+(tau) - 1 holds with the repair; sigma^+(tau) itself is OPEN (only sigma^+ <= sigma_1). The area density
1/(4 pi tau) is MEASURED at source.

## 5. Three weakest steps

1. Lemma R: constants are not tracked, so r_0, T_0 and X_0(Y) are not effective; clause (ii) needs the far-zone
   repair above. The down-to-the-real-axis remark is measured only.
2. The consequence drawn for the campaign ("every flow-stable hypothesis is blind to every strip statement")
   is a statement about hypotheses, relative to the definition of flow-stability in route 43; only the escape of
   zeros is proved. The change of variables between the map row's parametrisation (kernel e^(tau u^2/16) kappa)
   and (A0) was not rechecked by the line-4 lane or here.
3. The certified enclosures rest on one derivation of Lemmas T, S, Q, W of the line-4 lane (Lemma Q recalled
   from Trefethen-Weideman, not opened) and on that lane's code; this pass re-evaluated three zeros at 40 digits
   without ball arithmetic and did not re-derive the tail bounds.

## 6. Flags

Control statement. R1 to R4 false; not about zeros of zeta.
