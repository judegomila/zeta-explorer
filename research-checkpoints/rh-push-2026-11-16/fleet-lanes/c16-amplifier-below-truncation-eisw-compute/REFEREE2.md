# REFEREE2: c16-amplifier-below-truncation-eisw-compute

Second independent referee (lane `c17-referee-r16-lemma-h-sources`, 2026-11-20). Own derivations; own code for
the crossing integral (`push/c17-referee-r16-lemma-h-sources/code/indep.py`, mpmath 25 digits, local,
`scripts/memcap.sh 8`); the lane's check C3 rerun on new cells on the server through `rhrun` (2 cores, 8 GB,
under 2 minutes each; units ended). Nothing here is a statement about zeros of zeta.

**Verdict: HOLDS (precise obstruction; four flags false). Lemma U and the closed Gram formula (G) at T < N are
confirmed. The first independent referee's corrections 5.1 to 5.6 stand, in particular 5.1: "the open item
closes" is measured, not proved.**

## 1. Main lemma re-derived (Lemma U)

(a) (T_m psi)(y) = m^(-1/2) sum_(ad = m) d psi(ay/d) for a function of y; for psi = y^e 1_(y > T) this is
sum (a/d)^(e - 1/2) y^e 1_(y > Td/a). With lambda(m) = sum_(ad = m) (a/d)^nu (symmetric in a, d), (U1) follows.
(b), (c) With u = y/(c^2 (x^2 + y^2)): abs(dx) = sqrt(y) du/(2c u^(3/2) sqrt(1 - c^2 u y)) per sign of x, which
gives the double integral of (U2). Substituting t = c^2 u y:
I = c^(-2a) int_q^1 t^(a - 3/2)(1 - t)^(-1/2) int_(h_i)^(t/(c^2 h_j)) y^(bbar - a - 1) dy dt,
and the inner integral gives the two incomplete beta terms of (U2) with exponents bbar - 1/2 and a - 1/2. The
region is empty iff q = c^2 h_i h_j >= 1. The four consequences (m <= T^2; m <= T; N <= T; c < sqrt(mn)/T)
follow from the smallest products of heights T^2/m, T^2/m^2, T^2/N^2, T^2/(mn).
(d) v_m = lambda(m) g + E(Phi_m) needs H >= Tm (true for H >= TN); the constant term of g equals c0 on
[1/H, H] and Phi_m is supported in [T/m, H], so <g, E(Phi)> = int_0^H c0 conj(Phi) dy/y^2 needs H >= N/T. The
Maass-Selberg expression MS(H) is the standard one with c0 = A y^w + B y^(1-w). PROVED (the two classical
inputs as labelled by the lane).

## 2. Checks

| check | result |
|---|---|
| (U2): closed form (2F1) against two-dimensional quadrature of the defining integral, four cases with c = 1, 2, 3, q = 0.4 to 0.67, complex exponents at and off the line (own code) | relative differences 4e-27 to 1.4e-26 |
| lane's C3 (formula (G) against quadrature over the fundamental domain, `direct.py`) on four cells not run by the lane, all with T < N: (T, N) = (1, 5), (1, 6), (2, 5), (2, 7); zero 1 and the off-line point (0.9, gamma_1); units `rh-c17ref-ampC3a-1120005039`, `rh-c17ref-ampC3b-1120005039` | largest relative entry error of the Gram matrix: 4.8e-15, 1.0e-14, 1.3e-15, 7.9e-15 (zero); 4.0e-15, 8.2e-15, 2.8e-15, 6.1e-15 (off-line); 20 to 584 crossing terms per cell; the quadratic forms on two test vectors agree to 1e-14 |

The quadrature code is the lane's (`direct.py`); it shares no formula with (G) but it is not this referee's
code. The independent part of this pass is the derivation and the check of (U2).

## 3. Sentences false as written

1. (first referee 5.1; agreed) verdict line "the open item of family 31 closes": the bound G_opt <= N^delta at
   a zero for T < N is MEASURED on the grid, not proved; closure for all N and heights is OPEN.
2. (first referee 5.6 (i)) "matches quadrature to 1e-14": the lane's own values reach 6.4e-14 at (2, 16); the
   new cells of this pass are at or below 1.0e-14.
3. Lemma U (c), wording: "contributes exactly when c^2 h_i h_j < 1" is a statement about the region of
   integration; a term with a non-empty region can still vanish through its coefficient (A = 0 at a zero).
   Not an error in the formula.
4. No false sentence found in Lemma U (a), (b), (d) or in formula (G).

## 4. Requirement flags

No change: R1 = R2 = R3 = R4 = false. No statement about zeros of zeta.

## 5. Not covered by this pass

Sections 4 to 6 of RESULT (the gain tables S1, the comparison S2, Proposition CAP) were not rerun or
re-derived; the first referee's Part I covers them.
