# REFEREE2: c16-u6g-scattering-fe-rank2-bridge-stage-a

Second independent referee (lane `c17-referee-r16-lemma-h-sources`, 2026-11-20). Own derivations; own code
(`push/c17-referee-r16-lemma-h-sources/code/indep.py`, `indep2.py`: a separate implementation of the 36-term
form, mpmath 30 to 40 digits, local, `scripts/memcap.sh 8`, under 2 minutes). Nothing here is a statement about
zeros of zeta. Labels: PROVED-rel (relative to the inner product formula of RESULT 2.1, not opened by any pass),
MEASURED.

**Verdict: HOLDS (precise obstruction; device row; four flags false), with the first referee's corrections
E1 to E3 and one new correction (N1, the E_a row).**

## 1. Main lemma re-derived (Lemma R)

At lambda = (p - a + eps, a): z_1 + z_2 = p + eps, so M(z_1 + z_2) = r/eps + O(1); M(z_2) = M(a) = 0 exactly, which
removes s2, s1s2, w0. Survivors: e (1), s1 (M(z_1)), s2s1 (M(z_1) r/eps), with w lambda = (z_1, z_2),
(a - p - eps, p + eps), (a, -p - eps).
- s2s1 x s2s1: nu = (2A, -2p - 2 Re eps); contribution -r^2 |M(z_1)|^2/(4Ap |eps|^2) times e^{<(2A, -2p), T>}.
- s2s1 x s1 and its transpose: nu = (2A - p - conj eps, -2i Im eps); sum
  2 Re[ r |M(z_1)|^2/(eps (2A - p)(-2i Im eps)) ] = r |M(z_1)|^2/((2A - p)|eps|^2) (uses Re(i conj eps) = Im eps),
  times e^{<(2A - p, 0), T>}.
- every other pair is O(1/|eps|).
- <(p, -2p), T> = -p t_2.
Result: the displayed limit. Consequences (a), (b), (c) follow as stated when r > 0; 4A/(2A - 1) > 2 > 6/pi and
the residue 1/xi(2) = 6/pi are correct. Lemma S: re-derived (P(u+1) = prod (u + conj a'), a' = 1 - conj a ranging
over the zero set). PROVED-rel 2.1 for Lemma R; PROVED for Lemma S.

## 2. Checks

| check | result |
|---|---|
| rerun of the lane's `ref_checks.py` (copy; output written under the referee's directory) | every stored value of `ref_checks.json` reproduced exactly (C1 to C5) |
| Lemma R, own implementation, zeta times a conjugate pair of Blaschke factors with the control's residue r Theta(1): five (a, T) not used by the lane (A = 0.27, 0.41, 0.9, 1.6) | relative defect 1.3e-13 to 1.2e-12 |
| zeta at lambda = (1 - rho_1 + eps, rho_1) | abs(eps)^2 K = 9.6e-17 (the partner zero exists) |
| form (*) with a symmetric quartet, three (eta, g, T) not used by the lane, own code | 6e-11 to 2e-10 (limited by the offset 1e-11 used to avoid the exact 0/0) |
| single real zero (first referee's E1), 150 random diagonals at T = 0 | zeta 0 negative; real 0.75: 8; real 0.55: 16; conjugate pair 0.75 +- 0.3i: 0. E1 confirmed |
| E_a, a = 0.2, zero rho_1 - a, both poles, three T (N1) | see N1 |

## 3. Sentences false as written

1. (first referee E1; confirmed here) Table row and outcome item 2: "BLS-right (unpaired zeros, Re a > 1/2,
   including Re a > 1): none found" is false for an odd number of real zeros.
2. (new, N1) Table row E_a: "S4 through Lemma R with p = 1 +- a". At p = 1 - a the residue of
   M_a = xi(u+a) xi(u-a)/(xi(u+1+a) xi(u+1-a)) is xi(1 - 2a)/(xi(2) xi(2 - 2a)) < 0 (zeta < 0 on (0, 1));
   Lemma R (a) assumes r > 0 and does not apply. Measured with a = 0.2 (r = -7.4307): the limit is
   -0.0315 at T = (0, 0), +0.0346 at T = (0, 2), -0.0018 at T = (1, 0.5): no failure at T = (0, 2). At p = 1 + a
   (r = +10.7437) the limit is negative at all three T (-0.312, -0.0537, -0.119), as Lemma R (a) says. Corrected
   wording: "S4 through Lemma R at the pole p = 1 + a". The formula of Lemma R itself holds at both poles
   (agreement 1e-8); the row's outcome (E_a fails) stands.
3. (first referee E3) "the threshold of T is the normalisation": describes the first sign change only.
4. Lemma R statement: "a zero a ... forces a zero at 1 - a" needs the stated side conditions (simple pole,
   r > 0, M regular at p - a); as a statement about a general meromorphic M with M(u) M(-u) = 1 it is the
   contrapositive of consequence (a) and holds only with them. Not an error; the header sentence omits them.

## 4. Requirement flags

No change: R1 = R2 = R3 = R4 = false. The lane states nothing about zeros of zeta.

## 5. Not covered by this pass

The inner product formula and the range of T (recalled by the lane); the roughly 4,700 "pass" matrices (not
recounted); rows marked ARGUED or "not formulable".
