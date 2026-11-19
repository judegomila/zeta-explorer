# REFEREE: c13-kacmoody-eisenstein-affine-weyl-shift

Second pass by the lane's author with a separate script (`ref_checks.py`: different grid, different parameters,
heights to 122). It is not an independent referee; an independent one is owed before any later lane builds on
Theorem C or on control BLS. Lens: try to break each PROVED step; try to find a step where a strip argument is
constrained.

## Re-derivations

1. Theorem B. Expanded the Wronskian of f_z = A + B and conj f_w = A' + B' (A = e^(xz/2), B = phi e^(-xz/2)):
   W = (1/2)[(z - wbar)(A A' - B B') + (z + wbar)(A B' - B A')]; dividing by (z^2 - wbar^2)/4 gives (I). Holds.
   The removable singularity at z = wbar needs phi(zbar) = conj(phi(z)); stated. Evenness of z(1-S)/(1+S) needs
   S(z) S(-z) = 1; stated as S2. Holds.
2. Theorem C. Recomputed P_(S Theta) from S = (1-P)/(1+P): numerator 2(P + P_Theta), denominator 2(1 + P P_Theta).
   1 - Theta = 4 z Re a / ((z+a)(z+abar)), 1 + Theta = 2(z^2 + |a|^2)/((z+a)(z+abar)): z P_Theta = 2 Re a omega/(omega + |a|^2).
   Imaginary part of mu_omega on real N: (N + kappa)(p + m + kappa N) - N(p + m) - kappa p = kappa(N^2 + kappa N + m)
   (omega = p + iq). Discriminant kappa^2 - 4m = -4 (Im a)^2. Holds, including a real double zero (a real, taken twice).
   Scope found on this pass: a single real Blaschke factor and a pair of distinct real zeros are NOT covered
   (for t = a real, Im mu on real N is q a N (N + a)/|.|^2, negative on (-a, 0)); the first draft said "any inner
   factor". RESULT states the restricted form. Measured: real factors pass on the grid; not proved.
   Also found: the sign is not free. phi = -M fails (220 of 2700 negative). RESULT section 4 corrected.
3. T-NR as a Blaschke product: T(z) = q^(z-1/2) + q^(1/2-z) + c; T(z+1) = T(-z) and T(1-z) = T(z), so
   M_T(z) M_T(-z) = 1; on Re z = 0, T(1 + it) = conj(T(it)); as Re z -> infinity M_T -> 1/q. Zeros of T(z+1)
   at Re z = -1/2 +- b, left of the axis iff b < 1/2. No singular inner factor because log|M_T| is bounded as
   Re z -> infinity. The factorisation theorem is cited, not rewritten. Holds as PROVED-rel that theorem;
   RESULT's weakest step 3 says so.
4. Lemma A1. Inversion sets of the infinite dihedral group: checked by the cocycle recursion on reduced words to
   length 6 (4.2e-31). Chamber inequalities: Re(z + kc) >= Re z > 0 and Re(kc - z) >= Re(c - z) > 0. Holds given
   the normalisation, which is recalled (weakest step 2).
5. Lemma A2. Enumerated 20 pairs (u, i) with l(s_i u) > l(u): min Re <u nu, alpha_i^vee> = 0.15 at Re z = 0.3,
   Re c = 0.45 (the two walls give 0.3 and 0.15). Holds given FKP's formula, which FKP assume for affine groups.
6. Lemma A3: telescoping is exact; the second chain uses xi(u) = xi(1-u) once. Holds.

## Numbers rechecked (independent grid)

zeta: 0 of 2700 negative at x = 0 and x = 1; 262 at x = -0.1. BLS a = 0.9 + 14.5i (x = 0, 1) and two pairs: 0.
T-NR q = 3, c = 2.2 (b = 0.4038): 0. E_a formal a = 0.05: 45 negative. Boundary function at T = 1 on Re z = 0:
real to 1e-27, 6 sign changes below height 40. All consistent with RESULT.

## Attempts to find a constrained strip argument

- Shifts by c with small Re c: numerators z + kc run through the strip; denominators are the same points plus 1.
  No denominator in the strip inside the chamber.
- Level 1: all coefficients share the factor xi(z); the only denominators are xi(z + n), n != 0, outside the open
  strip for z in the strip. No inequality.
- Whittaker terms with u nu deep in the Tits cone: after the condition l(s_i u) > l(u) the argument is on the
  positive side of the wall. No strip denominator.
- Wall Re c -> 0: the series has a wall of singularities there (GMP's description of Garland); not examined.

## Corrections applied to RESULT.md

1. "any inner factor" -> "Blaschke product over non-real conjugate pairs"; sign remark added.
2. E_a row: the cause "two real poles" marked as not proved.
3. Lemma A1 (iv): functional equation written out.

## What does not hold as strongly as a reader might take it

- "Device closed" is proved for the Levi inequality. For the affine kernel it is argued (RESULT weakest step 1).
- DH does not fail the formal inequality at any computed height. Its failure is the classical theorem on zeros
  right of 1.
- Nothing here was checked against Garland's text.

Verdict of this pass: the PROVED steps hold; verdict "precise obstruction", flags r1..r4 false, score 0.

---

# Independent referee pass (lens: general), 2026-11-19

Not the lane's author. Every PROVED step was re-derived by hand; one separate numeric run was made (mpmath, local,
`scripts/memcap.sh 8`, under 200 MB, about 2 min; the script was not kept in the lane directory, its cases and
outputs are listed below). The server was not used. Sources on the loop group were not opened by this referee either.

**Finding: the PROVED steps (Theorem B, Theorem C, T-NR as a Blaschke factor, the telescoping of Lemma A3, the
coefficient census of Lemma A1 given the recalled normalisation) are confirmed. The verdict "precise obstruction"
holds for the rank-one Levi inequality only; for the affine kernel the closure is argued, as RESULT says.
Flags: R1 false, R2 false, R3 false, R4 false. Five corrections of wording or scope are listed; none changes the verdict.**

## 1. Re-derivations

- (I) is Maass-Selberg. With z = 2s - 1, w = 2s' - 1, T = e^x: s + conj(s') - 1 = (z + wbar)/2, s - conj(s') = (z - wbar)/2,
  phi(s) = xi(2s - 1)/xi(2s) = M(z). The classical formula becomes (I) including the factors 2. Holds for T >= 1.
- Theorem B. With A = e^(xz/2), B = e^(x wbar/2): f_z' conj(f_w) - f_z conj(f_w)' =
  (1/2)[(z - wbar)(AB - M Mbar/(AB)) + (z + wbar)(Mbar A/B - M B/A)]; times 4/(z^2 - wbar^2) this is (I) term by term.
  f_z'/f_z = (z/2)(1 - S)/(1 + S) = N/2. Evenness: S(-z) = 1/S(z) gives P(-z) = -P(z). Confirmed.
  "iff Nevanlinna": the first quadrant maps onto the upper half-plane of omega, so (I) gives Im N >= 0 there; conversely
  the Nevanlinna kernel is positive on the complement of the support of the measure and the factor f conj(f) removes the
  poles of N at real z. Confirmed. Poles of N have omega real, hence z real or imaginary. Confirmed.
- Diagonal bound: K(z,z) >= 0 gives m^2 - 2em - 1 <= 0 for m = |M| T^(-Re z). Confirmed.
- Theorem C. P_(S Theta) = (P + Q)/(1 + PQ); P_Theta = kappa z/(z^2 + m); N' = (N(omega + m) + kappa omega)/(omega + m + kappa N);
  for real N, Im N' = q kappa (N^2 + kappa N + m)/|.|^2, discriminant -4 (Im a)^2. The pole of the Moebius map is in the
  lower half-plane, so the upper half-plane goes to the inside of a circle lying in the closed upper half-plane. Confirmed,
  including real a taken twice. A single real factor gives Im N' = q a N (N + a)/|.|^2, negative for N in (-a, 0): the map
  does not preserve the half-plane, so the exclusion of single real factors in RESULT is correct.
- T-NR. D(z) = q^(z-1/2) + q^(1/2-z) + c has zeros 1/2 +- b + i(2k+1)pi/log q, b = arccosh(c/2)/log q; D(z)/D(z+1) has its
  poles at Re z = -1/2 +- b, is unimodular on Re z = 0 (D(1-z) = D(z), D real on the real axis), tends to 1/q as Re z -> +inf
  (no factor e^(-sigma z)), is analytic across the axis (no singular measure on the axis), and is positive on z > 0.
  The pair factors satisfy sum Re a/(1 + |a|^2) < inf, so the product converges; each pair factor is positive on z > 0, so
  the constant is +1. Confirmed: this supplies the convergence argument RESULT lists as missing in weakest step 3.
- Lemma A1/A3: inversion sets {alpha, alpha + delta, ...} and {delta - alpha, 2 delta - alpha, ...}; coroot pairings
  z + kc and kc - z; in the chamber all have Re > 0. Telescoping exact; xi(n + 1 - z) = xi(z - n). xi(rho + n) is finite
  and non-zero for integer n != 0. Confirmed given the recalled normalisation.
- Lemma A2: l(s_i u) > l(u) iff u^(-1) alpha_i > 0, and <u nu, alpha_i^vee> = <nu, (u^(-1) alpha_i)^vee> has Re > 0 on C.
  Confirmed given FKP's formula (assumed by FKP in the affine case).

## 2. Numeric run with different cases (grid 24 x 60, Re z in [0.017, 3.03], heights 0.21 to 120)

| case | negative of 1440 (grid) | 12-point Gram min/max eigenvalue |
|---|---|---|
| zeta, x = 0.7 | 0 | +1.8e-3 |
| BLS, zero at a = 0.83 + 47.3i, x = 0 | 0 | +2.5e-9 |
| BLS, two pairs 0.02 + 0.3i and 0.97 + 90i, x = 0.2 | 0 | not run |
| T-NR q = 5, c = 2.5 (b = 0.4307), x = 0 and x = 0.7 | 0, 0 | +2.3e-3 |
| T-NR q = 2, c = 2.5 (b = 1: pole in Re z > 0; must fail) | 12 | -8.4e-2 |
| M/Theta, a = 0.83 + 47.3i (must fail) | 14 | not run |
| formal E_a, a = 0.1, x = 0, 1.5, 4 | 31, 9, 7 | +3.5e-4 at x = 0 |
| formal DH, 10 x 30 grid, heights 80 to 91 (around the strip zero 0.8085 + 85.699i), x = 0, 0.3 | 0 of 300, 0 of 300 | not run |
| zeta, x = -0.03 | 0 | not run |

Theorem B identity at 10 new point pairs, random x in [0, 2]: 5.4e-26 (dps 25). Moebius step with a real, nearly real and
generic, 20000 samples: 0 violations. |f_DH(0.808517 + 85.699348i)| = 6.5e-7, so the DH function used is the standard one.
Controls run by this referee where a zeta-only mechanism could be claimed: BLS and T-NR pass (I) with prescribed zeros
off Re z = 1/2, as RESULT states; two anti-controls fail, so the test has power against poles in the half-plane.

## 3. Errors and scope corrections

1. Section 3.3 (b), wording. "M_T(z) = T(z)/T(z+1) is analytic and bounded in Re z > 0 ... it is the Blaschke product of
   its zeros" is false as written: M_T = M * D(z)/D(z+1) keeps the pole of M at z = 1 and all zeros of M. The statement is
   true for the factor D(z)/D(z+1), which is what Theorem C needs. Same point for step S3: M itself is not holomorphic in
   the chamber (pole at z = 1 from xi(z)), and the chain coefficients of Lemma A1 have poles at z + kc = 1 and kc - z = 1
   inside the chamber. "Strip arguments occur only in numerators" is correct; "coefficients are holomorphic in the
   chamber" is not. No proved step depends on it.
2. DH, "no zero right of 1 below height 2000". The cited record searched Re s in [-0.5, 1.5] only (winding count 2029 =
   1861 + 2 * 84, largest off-line real part 0.8695, confirmed from the file). The gap is closed by an elementary bound
   computed here: sum over n >= 2 of |a_n| n^(-3/2) = 0.738 < 1, so f_DH has no zero with Re s >= 3/2 at any height. With
   that sentence added the statement stands as MEASURED.
3. Power of the grid test. At x = -0.03 (T < 1, where (I) is not asserted) this referee's grid shows 0 negative points; the
   author's grids show failures at x = -0.1 and below. A clean grid is therefore weak evidence close to a threshold.
   This limits three MEASURED statements: "DH passes the formal test", "real Blaschke factors pass", "c = -2.1 passes".
   They should be read as "no failure found on the grid", not as support for a proof. Likewise the formal E_a kernel is
   positive on this referee's 12-point Gram matrix while it fails on the grid: a few-point Gram test has no power here.
4. Novelty. Theorem B is the statement that f_z'(x)/f_z(x) is a Weyl-Titchmarsh function of the truncated problem; in
   content it is classical (RESULT cites Hejhal and Lagarias-Suzuki for the consequence on zeros; the kernel form is of
   the same family). Lemma A3 at z = rho is Zagier's observation, as RESULT says. Theorem C is an elementary Moebius
   computation. None is presented as a theorem new to the literature; "not on file" refers to the campaign map. Accepted.
5. Scope of "device closed" and of consequence (c). "No consequence for numerator zeros can follow from S2 to S4" is
   proved for the rank-one inequality (I). For the two-variable affine kernel, BLS and T-NR are not group objects and no
   formula was tested, so the closure there is ARGUED. At c = 1 (and for any Re c <= 2) the existence of E_nu as a function
   is itself relative to continuation results that were not opened; Lemma A3 is an identity between coefficients only.

Checked and found absent: no step assumes RH; no step restates verified height (the height-2000 DH record is a control
record, not a zeta statement); no statement about zeros of zeta is made.

## 4. Flags set by this referee

- R1 false: multiplicativity enters only through identities (Gindikin-Karpelevich, sigma_{-v}); (I) holds with one Euler
  factor altered (T-NR) or with the archimedean factor altered (BLS).
- R2 false: (I) is uniform in height but is not a statement about zeros.
- R3 false: T-NR (c > 2, b < 1/2) and BLS pass every analytic step (proved); DH shows no failure at computed heights.
- R4 false: no step constrains an argument with real part below 1.

Verdict of this pass: holds, with the scope "rank-one Levi proved, affine kernel argued" and corrections 1 to 3 applied
to the wording.
