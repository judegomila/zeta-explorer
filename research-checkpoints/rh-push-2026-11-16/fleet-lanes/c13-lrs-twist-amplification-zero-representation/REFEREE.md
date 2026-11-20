# REFEREE.md: c13-lrs-twist-amplification-zero-representation

## Independent referee (lens: general), 2026-11-19

Independent agent; did not write RESULT.md. The lane's own second pass is kept unchanged below under "Self pass".

**Verdict: holds (precise obstruction, Stage A only). No statement about zeros of zeta is made or supported. Flags: R1 = false, R2 = false, R3 = false, R4 = false.** Five wording defects, none of which changes the verdict.

### Re-derivations (by hand, from the definitions in RESULT.md)

1. Lemma 0. With nu = (beta - 1)/2 + i gamma/2, alpha = p^nu, the four products alpha^(+-1) conj(alpha)^(+-1) are p^(+-(beta-1)), p^(+-i gamma). The GL_2 x GL_2 Cauchy identity gives the stated quotient. Confirmed. CLASSICAL, labelled as such.
2. Lemma 1. Pole list from xi(u) having simple poles at u = 0 (residue -1) and u = 1 (residue +1) only: eight points, as stated. All eight residues recomputed; they agree with the table. xi(rho - 1) = xi(2 - rho), so the surviving residue is xi(3 - 2 beta) abs(xi(2 - beta + i gamma))^2 with all arguments of real part > 1: non-zero. The residue at beta - 1 uses xi(2 beta - 2) = xi(3 - 2 beta): minus the same. Each of the other six contains xi(rho), xi(conj rho), xi(1 - rho) or xi(1 - conj rho). Converse (used in section 8 item 1) also holds for beta != 1/2: xi(2 beta - 1) is finite and non-zero for beta in (0,1), beta != 1/2 (no real zeros of zeta in (0,1); functional equation for the negative half). beta = 1/2: xi(w - 1/2) xi(w + 1/2) has leading coefficient -1 at w = 1/2, so the double-pole coefficient is -abs(xi(1/2 + i gamma))^2; at a zero of any multiplicity G is regular there. Confirmed. No simplicity of zeros and no RH is used.
3. Gamma poles. Even chi: Gamma_R(w + beta - 1) has its rightmost pole at w = 1 - beta; the other three families lie in Re w <= 0. Odd chi: rightmost poles at -beta, beta - 2, -1 -+ i gamma. Confirmed.
4. Lemma 2. L(0, chi) = 0 for even chi != 1 (CLASSICAL); the other three factors are entire. Confirmed, for every parameter.
5. (3.1) and Lemma 3. Dual term exponent: 1/2 (character sum times Deligne) + d(1/2 - w) + d(P - 1 + w) = 1/2 + d/2 + d(P - 1), independent of w. Confirmed. Existence of a: A(P - w) < P - 1 + w, i.e. w > (AP - (P - 1))/(A + 1). Confirmed. w*(1, n^2) = (n^2 - 1)/(n^2 + 1). Confirmed. d = 4: A = 4P - 5/2, w* = (4P^2 - 7P/2 + 1)/(4P - 3/2); table values 23/28 and 20/13 recomputed. P - 1 <= w* iff 2(P - 1) <= A iff 0 <= (d - 1)/2 + (d - 2)(P - 1); d = 4, P = 2 - beta gives beta <= 7/4. Confirmed.
6. Principal-character constant. D(w + 1 - beta) has a simple pole at w = 1 with residue zeta(3 - 2 beta) abs(zeta(2 - beta + i gamma))^2 / zeta(4 - 2 beta) and no other singularity on Re w = 1 for beta < 1; coefficients are non-negative, so Wiener-Ikehara gives c Y. Confirmed.
7. Lemma 4. (i) and (ii) depend only on the Satake parameters: the factor i = j = argmin gives xi(w + 2m), pole at 1 - 2m, gamma pole at -2m, and every other factor has argument of real part >= 1 at w = 1 - 2m. Confirmed. (iii) Gindikin-Karpelevich identity-element coefficient prod xi(<lambda, alpha> + 1) is non-zero for regular lambda with real part in the closed dominant chamber. Confirmed for regular lambda (walls excluded, as RESULT.md states).

### Numeric check rerun with different cases

Script `/tmp/c13ref/ind.py` (own code, mpmath 40 digits, run as `scripts/memcap.sh 8 .venv-arb/bin/python -I`, 240 s, under 200 MB; not stored in the lane directory because the assignment allows this referee to write REFEREE.md only). Cases not used by the lane.

| Check | Case | Outcome |
|---|---|---|
| Residues by contour (radius 0.02) | zero 3 (gamma = 25.0109) | 1.00374e-17 at 2 - beta and beta - 1 (formula 1.0037371318e-17); at most 4.3e-62 at the other six |
| same | zero 5 | 3.93826e-23 (formula 3.9382592695e-23); at most 1.3e-57 at the other six |
| same | generic beta = 0.7, gamma = 21 | all eight non-zero: 4.9674e-15, 1.12851e-15, 6.20437e-30; each equals its closed formula to 6 digits |
| same | generic beta = 0.15, gamma = 9 | all eight non-zero: 6.95713e-7, 2.24924e-6, 5.18659e-12; each equals its closed formula |
| L(0, chi), twisted product at w = 1 - beta | Legendre mod 13 (even), Kronecker (8/.) (even) | exactly 0 at zero 3 and at the generic parameter beta = 0.7 |
| same | Legendre mod 7 (odd) | L(0, chi) = 1; products 4.04 and 10.25 |
| Local Cauchy identity | p = 11, 13, 1009; two parameters; chi(p) in {1, -1, e^(2 pi i/5)}; w = 1.9 | maximal difference 3.4e-41 |
| Principal-character sum / Y | zero 2, Y = 1e3, 1e4, 1e5 | 0.603618, 0.603467, 0.603449 against c = 0.603451 |
| same | beta = 0.7, gamma = 21 | 0.602019, 0.601453, 0.602402 against c = 0.602276 (oscillating, within 2.1e-4 at 1e5) |

All consistent with RESULT.md.

### Controls

No zeta-only mechanism is claimed, so there is nothing to defeat with a control. The generic-parameter control was run here: at beta = 0.7 and beta = 0.15 (not zeros) Lemma 2 holds identically (table above), the pole at 2 - beta is present, and Lemma 3 is an algebraic statement in P alone. The control passes every step with the same output as the target. This confirms R3 = false. DH and T-NR were not run by the lane and were not run here: no object was constructed for either. The DH statement "the weight-0 object is identically zero" is a citation to row G31 and was not checked.

### Defects found (wording; none changes the verdict)

1. Section 8 item 2 says "for every Eisenstein object in every rank (Lemma 4)". Lemma 4 covers Borel (GL_1-induced) data at regular parameters only. Section 9 item 3 says so; item 8.2 and MAP_ROW.md ("every parameter and every rank") should carry the same restriction (MAP_ROW.md does list "Not covered: non-Borel objects" but not the walls).
2. Lemma 4 (iii) is not needed for the closure. Parts (i) and (ii) follow from the Hecke eigenvalues alone, so P - beta_0 = 1 holds for any Hecke eigen-object with those Satake parameters, whatever its constant term. The pivot question ("fewer exponents, hence P - beta_0 < 1?") is therefore answered by (i) and (ii); the sentence "the dominant constant-term exponent never vanishes" is a consistency statement, not the reason. The summary line of the claim gives it as the reason.
3. Lemma 1 table, rows w = beta and w = 1 - beta: "G(beta) = 0" holds for beta != 1/2 only (for beta = 1/2 the text below the table gives the correct statement, and the lane's own measurement gives abs G = 1.9e-10 near 1/2 at the first zero). The table row should carry "beta != 1/2".
4. Section 4, "of the size of the main term for every admissible Y": the precise statement is that the two conditions a < 1/(P - w) = 1 and a > A/(P - 1 + w) = A/(2(P - 1)) >= 1 have no common solution at w = P - 1. Same conclusion.
5. Section 2 calls Lemma 1 "the first place on file where xi(rho) = 0 ... enter a step". This is a statement about the campaign record and was not checked. As mathematics, Lemma 1 is a direct corollary of the classical Rankin-Selberg transform of a product of two Eisenstein series (Zagier 1981); it is not a new theorem and RESULT.md does not present it as one outside that sentence.

### Checks required by the assignment

- RH assumed anywhere: no. Off-line zeros are treated as hypothetical with beta free; zeta(1 + it) != 0 is the only zero-free input (Lemma 4).
- Verified height restated: no.
- Known theorem presented as new: no, with the caveat in defect 5. Lemma 0 is labelled CLASSICAL; the LRS exponent is labelled reconstructed.
- Section 3 (LRS exponent count) is ARGUED, not PROVED, and stays so; neither paper was opened here either. The verdict does not depend on it: Lemma 2 alone shows the forced vanishing is an identity in the parameter.

### Flags set by this referee

| Flag | Value | Reason |
|---|---|---|
| R1 | false | the Hecke relations are used in an identity valid for every parameter; no conclusion depends on multiplicativity |
| R2 | false | the only output is beta <= 7/4 |
| R3 | false | the generic-parameter Eisenstein series passes every step (confirmed here); DH and T-NR not formulated |
| R4 | false | no bound on Re rho |

### Surviving claim

For E*(z, rho/2) on PSL_2(Z): the completed Rankin-Selberg function is G(w) = xi(w + beta - 1) xi(w + 1 - beta) xi(w + i gamma) xi(w - i gamma); at xi(rho) = 0 it has exactly the simple pole pair w = 2 - beta, beta - 1. The gamma pole of the even twists is at 1 - beta, where the twisted product vanishes because L(0, chi) = 0, for every parameter. The LRS-type inequality (exponent count ARGUED) reads beta <= 7/4. For Borel Eisenstein data of any rank at regular parameters, and for any Hecke eigen-object with Satake parameters p^(lambda_i), pole position minus gamma-pole position is 1. Device closed at the generic-parameter control. Nothing about zeros of zeta.

---

## Self pass (by the lane's own agent; kept unchanged)


Status: **second pass by the lane's own agent; no independent agent ran in this lane** (the lane has no tool to start one). It is recorded as `refereeHolds: null`, `referees: 0`. An independent referee is owed (repair slot). What follows is a re-derivation with a separate script (`ref_check.py`, different code path from `checks.py`) and a list of attempts to break each statement.

## Attempts to break

1. Lemma 0 (factorisation). Recomputed globally, not prime by prime: coefficients from smallest-prime-factor recursion, even cubic character mod 7, w = 4, n <= 2e5, against mpmath Dirichlet L-values. Differences 5.2e-18 and 1.2e-16. Holds.
2. Lemma 1 (single pole pair). Residues by contour integral, not by the closed formula. One defect found in the first draft of the lane: for beta = 1/2 the poles w = beta and w = 1 - beta coincide, the residue test returns 0 for a generic point of the critical line as well, and G(1 - beta) is not 0 at a zero (double pole against double zero; measured abs G = 1.9e-10 at the first zero). Corrected in RESULT.md section 2 (double-pole coefficient - abs(xi(1/2 + i gamma))^2, `checks2.json`). All zeros available numerically have beta = 1/2, so the statement "G(beta) = 0" for beta != 1/2 is proved from the formula and cannot be measured at a zero; the off-line generic case beta = 0.3 was measured (all eight residues non-zero).
3. Lemma 2. L(0, chi) = 0 for even non-principal chi is the trivial zero (CLASSICAL); checked for two even characters, and the odd character gives a non-zero value. For imprimitive chi the statement still holds (extra Euler factors are finite at 0). Holds.
4. Section 3 exponent count. Re-derived for general degree d: w*(1, n^2) = 1 - 2/(n^2 + 1) exactly for n = 2, 3, 4. Gap condition P - 1 < w*(P, d) verified in exact rationals on P = k/16, 1 <= P <= 5, d in {4, 9, 16, 25}, and algebraically: it is 0 < (d - 1)/2 + (d - 2)(P - 1). Possible objection: LRS average over q as well as chi. Averaging over q changes the treatment of the terms n = +-1 mod q, n > 1 (dropped here by positivity) and cannot make the principal-character term smaller than Y^(P - w). The count is ARGUED, as labelled.
5. Could another real point be forced? The gamma factor of the even twists has poles in Re w > 0 only at w = 1 - beta (the three other families are at w = beta - 1 - 2k, and -+ i gamma - 2k). Odd twists: none. Finite places: the local factor at p with chi(p) = 1 has poles on Re w = 1 - beta (first factor), Re w = beta - 1 and Re w = 0; only the first is in Re w > 0, and it is the same factor L(w + beta - 1, chi). No other point.
6. Could a different pairing decouple P from beta_0? Rankin-Selberg of E*(., s_1) against conj E*(., s_2) has non-negative coefficients only for s_2 in {s_1, 1 - s_1} (same Hecke eigenvalues); without S4 there is no main term. Not a counterexample to the closure; noted as not covered beyond this remark.
7. Lemma 4 (iii). Checked against n = 2: lambda = (s - 1/2, 1/2 - s), <lambda, alpha> = 2s - 1; at s = rho/2 the dominant conjugate is 1 - rho/2, identity coefficient xi(2 - rho) != 0, other coefficient xi(1 - rho) = 0. Agrees with section 1. On walls the lemma is not proved (stated in RESULT.md weak step 3).
8. Sanity bound of section 0. beta = 1/2 gives abs(Re nu) = 1/4; a bound theta < 1/4 would contradict known zeros. Holds; it is not used in the verdict.

## Statements that survive this pass

- The device yields the inequality beta <= 7/4 and nothing else. PROVED given Lemmas 0 to 3; the exponent count is ARGUED and not needed for the verdict.
- E_a / EIS-w / WT pass every step with the same output. PROVED (the steps are identities in the parameter).
- Flags R1 = R2 = R3 = R4 = false. No statement about zeros.

## Not verified in this pass

- The texts of Luo-Rudnick-Sarnak 1995 and Zagier 1981 (not opened).
- Any level-q object for T-NR; any object for DH.
- Lemma 4 on chamber walls and for non-Borel data.
