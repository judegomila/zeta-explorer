# REFEREE: n3-cm-taylor-central-values

Verdict on the claimed verdict (precise-obstruction): **holds, with four corrections**. No PROVED step failed.
No step assumes RH or restates verified height. No statement about zeros is made. The compute server was not used;
the one referee run went through `scripts/memcap.sh 8` (single process, 2 s).

## 1. PROVED steps re-derived

**(E) the expansion. Confirmed.**
- Mellin: int_0^inf (theta(x) - 1 - x^(-1/2)) x^(s/2-1) dx = 2 pi^(-s/2) Gamma(s/2) zeta(s) on 0 < Re s < 1 (classical).
- x = e^(2u), z = -tanh u: x^(1/4) theta(x) = sech^(1/2)(u) G(z), because ((1+x)/2)^(1/2) = x^(1/4) cosh^(1/2) u. Checked.
- Pole part: x^(1/4)(1 + x^(-1/2)) = 2 cosh(u/2) = sech^(1/2)(u) [(1-z)^(-1/2) + (1+z)^(-1/2)], and
  (1-z)^(-1/2) + (1+z)^(-1/2) = sum 2 binom(4n,2n) z^(2n)/16^n. Checked.
- H(+-1) = -1/sqrt 2: H = ((1+x)/2)^(1/2) (theta - 1 - x^(-1/2)), limits at x -> 0 and x -> inf both -1/sqrt 2. Checked.
- G is even (theta(1/x) = x^(1/2) theta(x), 1 - z = x(1+z)). H is holomorphic in |z| < 1, so for fixed r < 1 the
  series sum |h_n| r^(2n) converges and term-by-term integration is legal; then |H(rz)| <= sup_[-1,1] |H| and
  sech^(1/2) is integrable, so dominated convergence gives the Abel limit. Checked.
- J_0 = 2 * 2^(-1/2) |Gamma(1/4 + it/2)|^2 / Gamma(1/2). Checked.
- Recurrence: d/du [sech^(1/2) tanh^m] = m sech^(1/2) tanh^(m-1) - (m+1/2) sech^(1/2) tanh^(m+1); integrating against
  e^(itu) gives (m+1/2) J_(m+1) = m J_(m-1) + i t J_m. Checked.
- Meixner-Pollaczek: with c_m = m!/(1/2)_m the recurrence becomes (m+1) P_(m+1) = t P_m - (m - 1/2) P_(m-1), which is the
  MP recurrence for lambda = 1/4, phi = pi/2, x = t/2. Checked.

**DH phase statement. Confirmed.** G_chi(-z) = eps G_chibar(z) follows from 1 - z = x(1+z); coefficients of G_chibar
are conj(u_m); hence (-1)^m u_m = eps conj(u_m). Referee run: arg(u_m)/pi = 0.088104096 (m even), 0.5881041 (m odd), m = 0..15.

**T-NR theta identity. Confirmed.** theta(4x) = (theta_3 + theta_4)/2, theta(x/4) = theta_3 + theta_2, and theta_2 <-> theta_4
under x -> 1/x give the stated two-term form.

## 2. Numeric rerun on cases not in RESULT.md

Independent code (`/tmp/ref_n3cm/referee_check.py`, not kept in the lane): Taylor coefficients by a 256-point Cauchy
sum on |z| = 0.45 (the lane used a recurrence), own approximate functional equation with M = 1600, test points
y = 1.11, 1.31, 70 digits.

| check | case | result |
|---|---|---|
| d(n) from Cauchy sum | n = 0..12 | equals `dn_12.json` |
| W | n = 11 (k = 89) | L/pred - 1 = 2.9e-65 |
| W | n = 12 (k = 97) | L/pred - 1 = 5.4e-63 |
| W | n = 0, 1, 5 | 3e-71, 1e-70, 6e-70 |
| L(psi^(8n+5)) = 0 | k = 5, 45, 93 | w = -1, abs(L) < 2e-69 |
| DH: R_m/4^m, m even | m = 12, 14, 16 (n = 6, 7, 8) | 4.9936687219623033312348051398705 each, equal to m = 0 to 32 digits |
| DH root number | k = 4m+3, m = 0..16 | abs(W) - 1 < 1e-68, two test points agree |
| DH kernel | a = (1 - i kappa)/2 | 2 Re(a u_m)/abs(u_m) = +-1.03957 for even m, < 1e-67 for odd m; signs + - - - + for n = 0..4 |

W and the DH identity are confirmed at n = 11, 12 and n = 7, 8, beyond the lane's ranges. They remain MEASURED.

## 3. Errors and corrections

1. **Backward heat control: "for every tau" is false, and the family is not the one in the brief.**
   The kernel used here is the pole-subtracted one, sech^(1/2)(u) H(z) ~ -e^(-|u|/2). Multiplying by e^(tau u^2/16)
   keeps it integrable only for tau <= 0. For tau > 0 the integral diverges, so the "same argument" does not apply.
   The brief's backward-heat family acts on the rapidly decaying xi kernel (after the factor s(s-1)), not on this one;
   the two families differ. The conclusion drawn (coefficients become lower-triangular combinations; single-term W is lost)
   is correct for tau < 0 on the lane's kernel. The control was not run on the brief's family.

2. **MV-CAP paragraph: the norm is unstated and, read literally, wrong.**
   In L^2(dt): ||J_m||^2 = 8 pi B(m + 1/2, 1/2) ~ m^(-1/2), not m^(1/2), and the J_m are not orthogonal
   (int J_m conj(J_n) dt = 8 pi int sech tanh^(m+n) du, non-zero for m+n even). In L^2(dt) the left side is finite:
   int |2 pi^(-s/2) Gamma(s/2) zeta|^2 dt = 8 pi int sech(u) H(z)^2 du < inf.
   The statement is correct only in the weighted space L^2(dt / |Gamma(1/4 + it/2)|^2), where J_m/J_0 are orthogonal
   MP polynomials with norm^2 ~ m^(1/2) and the function side is 2 pi int |zeta(1/2+it)|^2 dt = inf. Both sides are
   then infinite, so it is a formal identity, not a Plancherel theorem. The MV-CAP classification stands.

3. **Prior literature for (E) is not cited.** Expansion of the completed zeta/xi function in Meixner-Pollaczek
   polynomials is known: Kuznetsov (2008) and Romik, "Orthogonal polynomial expansions for the Riemann xi function in
   the Hermite, Meixner-Pollaczek, and continuous Hahn bases" (Acta Arith. 200), which use the decaying xi kernel
   (lambda = 3/4) and prove convergence with coefficient asymptotics. The lane's lambda = 1/4 pole-subtracted variant is
   a reparametrisation of that construction, with coefficients tied to single d(n). It should be labelled CLASSICAL in
   kind. The measured non-convergence of plain partial sums and the growth of C(t) are properties of the pole-subtracted
   choice and were not compared with Romik's convergent version; "the expansion needs about C(t)/(1-r) terms" is
   a statement about this normalisation only.
   W is correctly labelled as Rodriguez-Villegas-Zagier type (their main case is Q(sqrt -7); Rodriguez-Villegas 1991/1993
   treats theta values at CM points generally). I did not find the exact Q(i) statement either; MEASURED is the right label.
   The d(n) congruences are Romik / Scherer / Krattenthaler-Mueller (arXiv 1807.06130, 2304.11471), correctly said "as known".

4. **Small misstatements.**
   - "C = 60 at t = 40": the table gives err/(1-r) = 60, 70, 78 at r = 0.99, 0.995, 0.998. The error is not yet linear
     in 1-r at t = 40; C(40) >= 78. At t = 0 the Abel error changes sign (-0.0029, -0.0014, +0.0003), so the
     linear law is not seen there either. The qualitative claim (C grows with t) stands.
   - "DH kernel coefficients 2 e^(i phi)(+-|u_2n|)": the DH combination a theta_chi + conj(a) theta_chibar has real
     coefficients 2 Re(a u_m) = +-1.03957 |u_2n| (even m), 0 (odd m). The phase factor should not appear.
   - `dh_firm.py` loops over all m = 0..12 with k = 4m+3. For odd m the central value L(eps_5 psi^(4m+3), 2m+2) vanishes
     (referee run: R_m < 1e-67) while u_m is non-zero. So the identity holds only for even m, as RESULT.md states;
     "n = 0..6" in RESULT.md corresponds to m = 0, 2, ..., 12. The odd coefficients u_(2n+1) (the functional-equation-odd
     partner of DH) are not explained by this character; not stated in RESULT.md.
   - The eps_5 character is non-trivial on units (eps_5(i) = -1); it is a Hecke character only together with the
     implicit character mod (2+2i) fixed by the primary-generator convention. Conductor norm 800 is consistent with the
     functional-equation test; the character was found by search, as section 5 says.

## 4. Controls

- DH: run by the referee (section 2). The lane's finding is confirmed: the single-signed-square-root structure and the
  expansion hold for DH. The mechanism is not zeta-only, and RESULT.md does not claim it is.
- Backward heat: correct for tau < 0 on the lane's kernel; see correction 1.
- Sign twist: "not formulable" is accepted. The construction needs theta(1/x) = x^(1/2) theta(x); a sign-twisted prime
  side has no theta kernel.
- Positivity/sign claims (2.3, 2.4) are exact-integer computations to n = 300 and Hankel order 8; not rerun beyond
  d(0..12). They are negative findings and support no theorem.

## 5. Surviving claim

(W, MEASURED, now n <= 12) L(psi^(8n+1), 4n+1) = (Omega/4) 16^n Phi^(2n) d(n)^2/(4n)!; L(psi^(8n+5), centre) = 0 with root number -1.
(E, PROVED; CLASSICAL in kind after Kuznetsov and Romik) 2 pi^(-s/2) Gamma(s/2) zeta(1/2+it) is the Abel sum of h_n J_2n(t).
(DH, MEASURED, now n <= 8) |u_2n|^2 = |L(eps_5 psi^(8n+3), 4n+2)| (4n+1)!/(R_0 16^n ((2n)!)^2), R_0 = 4.99366872196230333...
The mechanism does not separate zeta from DH or T-NR. It gives no inequality and no statement about zeros.
The quadratic form is MV-CAP (in the weighted space only). Backward-heat statement restricted to tau < 0 on the
pole-subtracted kernel.

Sources: Romik arXiv 1807.06130; Krattenthaler-Mueller arXiv 2304.11471; Romik, Acta Arith. 200 (xi expansions);
Rodriguez-Villegas and Zagier, MPIM preprint 1992-68.
