# Independent referee: c13-kacmoody-eisenstein-affine-weyl-shift (rank-one statements; control BLS)

Referee lane `c14-referee-r13-independent`, 2026-11-19. Written from the lane's RESULT.md and
`controls_BLS_proposed.json`; the lane's REFEREE.md was not read. Own code: `items124.py` (block lane 2), output
`items124.json`. Nothing here is a statement about zeros of zeta.

## Verdicts

| statement | verdict | exact line / form |
|---|---|---|
| Theorem B, identity K_x(z,w) = 2 f_z(x) conj(f_w(x)) [N(omega_z) - conj N(omega_w)]/(omega_z - conj omega_w) | **HOLDS** | Re-derived: K = 4 W(f_z, conj f_w)(x)/(z^2 - conj(w)^2), f'/f = N/2; N is even in z because S(-z) = 1/S(z). Numeric: 80 random (z, w, x) for M and for M Theta, largest relative defect 2.3e-55. |
| Theorem B, "(I) holds iff N is a Nevanlinna function of omega" | **HOLDS** | The domain of omega = z^2, Re z > 0, is the plane cut along (-inf, 0], not the upper half-plane. The equivalence still holds because N(conj omega) = conj N(omega): a Nevanlinna function with this symmetry has a positive kernel on both half-planes and across the intervals of the positive axis where it is analytic; at its poles on the positive axis f_z(x) = 0 and K stays finite. This step is not written in the lane; it is standard and does not change the statement. |
| Theorem C (closure under Theta = (z-a)(z-abar)/((z+a)(z+abar)), Re a > 0) | **HOLDS** | Re-derived: z P_Theta = kappa omega/(omega + m); N' = (N(omega+m) + kappa omega)/(omega + m + kappa N); for real N, Im N' = q kappa (N^2 + kappa N + m)/abs(.)^2 >= 0 since kappa^2 - 4m = -4 (Im a)^2 <= 0; the pole of the Mobius map is in the lower half-plane. Covers non-real pairs and real a counted twice. |
| "zeros can be inserted at arbitrary conjugate pairs of the open right half-plane" | **HOLDS IN NARROWER FORM** | Conjugate pairs with Im a != 0, and real a with even multiplicity. A single real factor (z-a)/(z+a) gives N' = (N + a) omega/(omega + aN) with Im N' = q a N (N + a)/abs(.)^2, which is negative for -a < N < 0: outside the theorem (the lane says "outside the proof" for these; its measured "0 negative" for c = -2.1 is not a theorem). |
| Control BLS (definition and the six "has" entries of `controls_BLS_proposed.json`) | **HOLDS** (rank one) | M_B = M Theta: M_B(z) M_B(-z) = 1, unimodular on the axis, holomorphic in Re z > 0 off z = 1, zero at the prescribed a, equal to f(z)/f(z+1) with the stated gamma quotient; Maass-Selberg kernel (I) positive for x >= 0 by Theorem C and the classical positivity for M. |
| T-NR passes S2, S3, S4 (section 3.3 (b)) | **HOLDS**, with the missing convergence step supplied | With u = q^z the factor m(z)/m(z+1) = (q^(-1/2) u^2 + c u + q^(1/2))/(q^(1/2) u^2 + c u + q^(-1/2)) is a rational function of u, unimodular on abs(u) = 1, with both zeros in abs(u) > 1 (roots of u^2 + c sqrt(q) u + q, real, product q, both of modulus > 1 when b < 1/2) and no pole in abs(u) > 1, value 1/q at infinity: a finite Blaschke product of degree 2 in 1/u. In z it is the locally uniform limit of the symmetric partial products over the zeros 1/2 +- b + i(2k+1) pi/log q (factors 1 - 2 kappa z/(z^2 + kappa z + m), summable). Nevanlinna functions are closed under locally uniform limits, so Theorem C applies. Numeric: product over 6000 factors against the closed form at z = 0.37 + 2.9i: 0.461756 - 0.640788i against 0.461723 - 0.640805i (difference 3.7e-5, of the size of the truncated tail). |
| Affine kernel (I_aff) | **not a rank-one statement; see below** | |

No statement is BROKEN.

## Numeric instance (control not identically zero; sign reproduced)

BLS with a = 0.9 + 14.5i: abs(M_B(a)) = 2.5e-61; M_B(0.37 + 2.9i) = 0.70175 - 0.78664i (not zero); M_B(z) M_B(-z) - 1: 1.3e-58;
abs(M_B(7.3i)) = 1.0; gamma form f(z)/f(z+1): relative defect 8.3e-57.

Two tests of (I), independent of Theorem B: (1) sign of Im N on 960 points of the first quadrant (0.05 <= Re z <= 2.45,
0.4 <= Im z <= 60.4); (2) smallest eigenvalue (relative) of the Gram matrix [K_x(z_i, z_j)] on six sets of seven random
points with Re z in (0.05, 2), heights to 40, both signs of Im z.

| phi | x = 0 | x = 0.5 | x = 1 | x = -0.5 (T < 1) |
|---|---|---|---|---|
| M (zeta) | 0 negative; Gram >= 6e-11 | 0; 5e-7 | 0; 1e-4 | 491 negative; Gram -1.0 |
| BLS, a = 0.9 + 14.5i | 0; 1e-9 | 0; 6e-7 | 0; 2e-4 | 441; -1.0 |
| BLS, a = 0.25 + 3i | 0; 2e-7 | 0; 1e-4 | 0; 2e-4 | 485; -1.0 |
| BLS, two pairs (0.25 + 3i, 0.8 + 21.5i) | 0; 3e-7 | 0; 1e-4 | 0; 2e-4 | 444; -1.0 |
| T-NR q = 2, c = 2.1 | 0; 1e-5 | 0; 2e-4 | 0; 5e-4 | 197; -0.77 |
| T-NR q = 3, c = 2.2 | 0; 2e-4 | 0; 3e-4 | 0; 2e-3 | 65; -0.36 |
| anti-control M/Theta (pole at a) | 45 negative; Gram -0.24 | 4; -0.034 | 0; 5e-5 (not detected on this sample) | 512; -1.0 |
| -M | 152; -1.0 | 48; -0.26 | 24; -0.009 | 501; -1.0 |

The inequality is reproduced for BLS and T-NR at x >= 0 and fails for the anti-control, for -M and for x < 0, so the
test has power. (At x = 1 the anti-control is not detected on these points; the lane reports 295 negative on its grid
at x <= 0.5; the pole of M/Theta at a makes (I) false for every x, since a Nevanlinna function has no non-real pole.)

## What is argued only for the affine kernel (as asked)

1. **Closure of the affine Gram kernel (I_aff) under M -> M Theta: OPEN** (lane, weakest step 1). Theorems B and C are
   proved for the rank-one Levi kernel (I) only. BLS and T-NR are not group objects, so positivity of the double sum
   over W x W is not automatic. A two-variable inequality in (z, c) that fails for M Theta is not excluded.
2. **The affine Maass-Selberg relation itself** (existence and form of (I_aff)): relative to Garland, not opened.
3. **Lemmas A1, A2, A3** (argument census of the constant term and of the degenerate Whittaker coefficients; the level-1
   telescoping): PROVED relative to the constant-term formula and to FKP section 3.6, read through summaries. The
   algebra (inversion sets are initial segments of the two chains; M(u) M(-u) = 1; telescoping at c = 1) is elementary
   and was not re-run here. The regions (Godement region 1 < Re z < Re c - 1; convergence in the Tits cone; the sign
   of r) are RECALLED.
4. **Convergence of the affine constant term for Re c > 0**: ARGUED from the growth of M.
5. **Validity of the degenerate Whittaker formula in the affine case**: assumed by the source (FKP), per the lane.
6. **Section 5 (level-1 pivot)**: non-normalisability and the remark on loop Hecke operators are ARGUED.

So the registered status of BLS, "proved in rank one", is the correct label. A round-14 lane may use BLS as a filter
(question Q-B) for: cocycle relation, unitarity on the axis, holomorphy in the positive chamber, positivity of the
rank-one truncated norm. It may not cite BLS as passing an affine or higher-rank truncated-norm inequality.

## Labels to restrict

- Section 3.3 heading "zeros can be inserted" and verdict item 2 "arbitrary conjugate pairs": add "non-real pairs, or real points with even multiplicity".
- Section 3.3 (b) last parenthesis ("c = -2.1, real zero pair, and single real Blaschke factors ... measured 0 negative"): MEASURED only; a single real factor is not covered and the Mobius computation above shows why.
- Section 4, row EIS-w, "PROVED in rank one": correct as labelled; row T-NR "PROVED": correct with the convergence step above.
- Section 3.5 and verdict item 2: "the inequality carries no constraint on numerator zeros" is proved for (I); for (I_aff) it is OPEN and should be written next to the sentence each time it is used.
