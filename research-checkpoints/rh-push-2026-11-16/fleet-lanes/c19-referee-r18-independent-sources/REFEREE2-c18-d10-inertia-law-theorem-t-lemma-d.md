# REFEREE2 (second, independent) for c18-d10-inertia-law-theorem-t-lemma-d/RESULT.md

Date 2026-11-20 (round 19, lane c19-referee-r18-independent-sources). Written from RESULT.md and the scripts; the first referee file
was opened after sections 1 to 3 were fixed. The lane makes no statement about zeros of zeta; neither does this file.

**Verdict: holds with corrections.** Theorem Q (d = 4) and the Bezoutian identity of Theorem H hold. The correction concerns the
rows with an odd number of real zeros (identification of the model object), found by the first referee and confirmed here by an
exact run. Row D10 stays not proved closed: X(d) for d > 4 is open. Flags: R1 false, R2 false, R3 false, R4 false.

## 1. Bezoutian identity (Theorem H), re-derived by hand and in exact arithmetic

Hand derivation (independent bookkeeping). L(x, y)(x + y) = sum over e = +-1 of e b(ex) b(ey), so
LL_+- = sum over e_1, e_2 of e_1 e_2 psi_e(x) psi_e(y) a(x + y), e = (e_1, e_2, +-), a(nu) = 1/(nu_1 nu_2). With
s_1 x = (-x_1, x_12), s_2 x = (x_12, -x_2): psi o s_1 = psi_(-,+,+), psi o s_2 = psi_(+,-,+), psi o s_1 s_2 = psi_(+,-,-),
psi o s_2 s_1 = psi_(-,+,-), psi o w_0 = psi_(-,-,-). Reindexing gives A[psi_e psi_e a] = A[psi psi (a o v^-1)] for psi_e = psi o v,
with a o s_1 = -1/(nu_1 nu_12), a o s_2 = -1/(nu_2 nu_12), the 3-cycles giving the same two functions, a o w_0 = a, and
1/(nu_1 nu_12) + 1/(nu_2 nu_12) = 1/(nu_1 nu_2). Hence A[LL_+] = N + N_b + N_c + X = 2N + X. For LL_-: the patterns (-,+,-),
(+,-,-), (-,-,-) give N_b + N_c + N = 2N, and (+,+,-) = psi_* o s_1 = psi_* o s_2 gives -X_b = -X_c = -X/2. So
A[LL_-] = 2N - X/2 and 6N = A[LL_+ + 2 LL_-]. Confirmed.

Exact check on fresh configurations (`local/d10_check.py`, own code, flint rationals, section A): 180 instances (random rational b
of degree 1 to 9, leading coefficient 1, 2 or -3, 4 point pairs each, denominators 113, 127, 131, 137): the three identities
6N = A[LL_+] + 2 A[LL_-], A[LL_+] = 2N + X, 2 A[LL_-] = 4N - X hold in 180 of 180.

Corollary H1. Product rule L_(b1 b2) = b_1(x) b_1(y) L_(b2) + b_2(-x) b_2(-y) L_(b1) and the Hermitian Bezoutian -2 Re r of u - r
re-derived; Schur product, rank-one factor and antisymmetrisation steps are correct. Exact check (section B): 8 random b with all
roots in the closed left half-plane (degree 2 to 6): 0 negative squares in 8 of 8 (ranks 1, 3, 6, 10, 15 = n(n-1)/2).

## 2. Theorem Q (d = 4) on fresh configurations, exact

Method (own code): N = Delta(lam) Delta(mu) v(lam)^T H v(mu) with v the 19 invariant monomials I_2^a I_3^b of degree <= 12 (derived:
N is anti-invariant in each variable and of degree <= 3n = 15 in each); H from two disjoint random point sets (denominators 211, 223
and 227, 229); the fit is tested on 5 further point pairs each time (0 failures) and H is symmetric each time; inertia from the signs
of the characteristic polynomial (all roots real, so Descartes is exact). This is not the lane's LDL routine and not its point sets.

| configurations | result |
|---|---|
| 24 random (eta, g), eta = k/1000 in (0, 1/2), g in (0, 60]; 4 corners (eta = 1/1000 or 499/1000, g = 1/50 or 90); (1/4, 1) | inertia (6, 0), rank 6, in 29 of 29 |
| outside the strip: (3/5, 2), (7/8, 1/3), (11/10, 5) | (4, 2) in 3 of 3 (2 negative squares, as stated) |
| unpaired left pair 1/4 +- 2i with the pole | (1, 2): negative index 2, as the law states |
| right pair 3/4 +- 2i with the pole | (3, 0) |

Proof steps read: degree bounds (entries of H: 12 in c, 6 in E; 7 x 7 minors 84, 42; e_6 72, 36), grid sizes 43 x 85 = 3,655 and
37 x 73 = 2,701 (954 remaining), "rank <= 6 implies e_6 = product of the six possibly nonzero eigenvalues", constant rank on a
connected set implies constant inertia: correct.
Factorisation of e_6 at fresh points (section D; uses the lane's `Hmat` for H, own evaluation of the printed factors): at 8 rational
points of D and 4 rational points outside D (denominators 17, 19, 37, 1000), e_6 equals (8388608/4782969) F_1 F_2 F_3 F_4 (E - c)^4
(E - c^2)^4 (4E - 1)^4 in 12 of 12; rank 6 in 12 of 12.
Sign certificates redone with sympy (section E): F_1 = (9c - 8E)^2 - 9E and its (eta, g) form: residual 0; F_2 likewise; after
E = s/(4(1+s)), c = 1/4 + E + t the numerators of F_1, F_2, F_4 have 9, 7, 81 coefficients, all positive; the discriminant of F_3 in E
equals the printed quartic and has no real root, value -2164763 at c = 0. (F_3 itself has 6 negative coefficients after the
substitution; the lane does not claim otherwise and uses the discriminant.)

Not repeated: the 3,655 exact grid matrices and the interpolation of e_6 (their output was tested at 12 fresh points); the 600 + 600
certified matrices on the zeta base; Theorem G; Lemmas L1 to L3 (L1 is one line and was checked: xi(u)/xi(u+1) = (u+1)/(u-1) times
Xi(u)/Xi(u+1)).

## 3. Corrections (sentence to use)

| # | Where | Status | Sentence to use |
|---|---|---|---|
| C1 | Section 3.5 rows "single real zero 3/4; 1/4" and "single real zero ... with a quartet or pairs"; the parity paragraph; section 5.2 row "single real zero right of 1/2"; section 9 note 3 | identification error (first referee E-1; confirmed here exactly) | "For odd degree, g(-u)/g(u) is minus the Blaschke product, so b = (u - 1) g is the model of M_0 times (-Theta). The model of M_0 Theta with an odd number of real zeros is b = u (u - 1) g. Exact inertia for one real zero a: b = (u - 1)(u + a): (1, 0) at a = 1/4, (0, 1) at a = 3/4, 11/20, 9/10; b = u (u - 1)(u + a): (1, 2) at a = 1/4, (2, 1) at a = 3/4, 11/20, 9/10." The statement that c17's parity clause fails in the model is withdrawn until it is re-run with b = u (u - 1) g. |
| C2 | Verdict item 1, "PROVED-exact" | scope note | "Theorem Q is computer-assisted (exact grid, interpolation, factorisation); its conclusion was confirmed by a second implementation at 29 fresh interior points and its factorisation at 12 fresh points; the grid computation itself was not repeated." |

## 4. Comparison with the first referee (opened after sections 1 to 3)

Same verdict. Its E-1 is C1 here; the run `local/d10_odd.py` reproduces its table entries (0, 1), (1, 0), (2, 1), (1, 2) with different
code. Its other checks (26-point Gram matrices with polynomial extrapolation on the diagonal; sympy re-expansion of the factors;
mpmath on the zeta base) use different methods from this pass and agree with it where they overlap: (6, 0) inside, (4, 2) outside,
(1, 2) for an unpaired left pair, factorisation equal at fresh points.

## 5. Flags

R1 false (the model has no primes). R2 false. R3 false (symmetric controls pass: proved for d <= 4 in the model). R4 false.
Referees on this lane after this file: 2, both hold with corrections. PROVED labels broken: 0 for the theorems; the odd-zero rows
(labelled PROVED-exact at each configuration) describe a different object than stated (1, already counted by the first referee).
