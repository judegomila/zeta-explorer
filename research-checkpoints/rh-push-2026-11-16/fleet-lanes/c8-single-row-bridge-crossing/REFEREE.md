# REFEREE: c8-single-row-bridge-crossing (adversarial pass, lens: general)

2026-11-18. Internal referee, one pass. Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction.
Referee script and logs were kept outside the lane directory (`/tmp/c8ref/ref.py`, `ref2.py`, `ref.log`, `ref2.log`;
two local runs through `scripts/memcap.sh 8`, `.venv-arb` python, float64 + mpmath, 181 MB planned arrays, reads only
`N`, `g2` of `tmp/sextic/data/sf_1e7.npz`). The compute server was not used. No statement about zeros of zeta or of
an L-function is made here beyond classical facts and numerical positions of known low zeros.

## Outcome

**The verdict (precise obstruction, 0 requirements) holds.** The two-axis lemma and the pole arithmetic were
re-derived and are correct. The measurement T(s_rho) != 0 was reproduced and extended to three zeros not in the
lane's list. Five statements in the result are wrong or overstated as printed (E1 to E5); none changes the verdict.
Nothing in the result assumes RH, restates verified height, or needs a control to fail. The content of items 1 to 4
is the classical Kubota-Patterson normalisation (Gauss-sum series times zeta_F(3s - 1/2) = Mellin transform of the
cubic theta function); it is labelled RECALLED in the result and must not be recorded as a new theorem.

Flags set by the referee: R1 = false, R2 = false, R3 = false, R4 = false.

## 1. Steps re-derived

| Step | Result label | Referee | Note |
|---|---|---|---|
| T = L0 D, L0(s) = L(3s - 1/2, psi), psi = (conj(alpha) Psi)^3 | PROVED-rel MS | confirmed | From tau(n b^3) = q_b^{1/2} tau(n) and complete multiplicativity: sum over b gives q_b^{1/2 - 3s}. Unmasked norms check: every ideal prime to 3 has one primary generator, so the b-sum is zeta_F(w)(1 - 3^{-w}), times (1 - 4^{-w}) with the mask |
| w = 3s - 1/2; Re s = 1/2 is Re w = 1; Re w = 1/2 is Re s = 1/3; gap 1/6 | PROVED | confirmed | Arithmetic |
| s_rho = (rho + 1/2)/3, 1/2 - Re s_rho = (1 - beta)/3 | PROVED | confirmed | |
| Lemma 2(a): L0 has no zero in Re s >= 1/2 | CLASSICAL | confirmed | Non-vanishing on Re w >= 1 for Hecke L-functions, including the infinite-order psi. The finite Euler factors removed by the mask vanish only on Re w = 0 |
| Lemma 2(c): dichotomy at s_rho | PROVED | confirmed | T^#(s) = conj(T(1 - conj s)) vanishes at 1 - conj(s_rho) when T(s_rho) = 0 |
| Prop. 3(a): pole of S_D at 1 - conj(s_rho), real part (5/2 - beta)/3; RH is Re = 2/3; region delta gives distance delta/3; 7/8 gives 1/24 | PROVED-rel | confirmed as a conditional | Conditional on T(s_rho) != 0 at each rho (E4). Interval (1/2, 5/6) is incomplete (E3) |
| Prop. 3(b): about Re s = 1/3 the zeros of L0 cancel | PROVED-rel | wrong as printed for the rows used (E3) | True for the primitive L(w, psi) only |
| Prop. 3(c): D'/D = T'/T - L0'/L0; H(D) = H(T) - H(L0) | PROVED-rel c7 Thm C | identity confirmed; H additivity not re-derived | The use of "H(L0) >= 0 iff RH" for non-real psi is legitimate (E5 wording) |
| Composition of the two reflections is a translation by 1/3 | PROVED | confirmed | 2/3 - conj(1 - conj s) = s - 1/3; the result prints + 1/3 (the other order). No effect |
| Gamma factor |R(it)| = 1 | PROVED-rel MS | confirmed | Each factor is a ratio Gamma(a + it)/Gamma(a - it), a real. For the unweighted row the referee derives the completion (2 pi)^{-2s} Gamma(s + 1/6) Gamma(s - 1/6) T(s) from the K_{1/3} Fourier expansion; same axis |

## 2. Errors and overstatements

**E1. T has no pole at s = 1/6 (result section 2, script header, weakest step 1).** The result states "poles of T
only at 5/6 and 1/6". For the unweighted row the completed function Gamma(s + 1/6) Gamma(s - 1/6) T(s) has poles
at 5/6 and 1/6, and the pole at 1/6 is supplied by Gamma(s - 1/6). The Dirichlet series T is regular at 1/6. The
fit term c2 X^{1/6 - s} is not a residue term. Referee test: a true pole term has coefficient
Res * Gamma(z/k)/k, z = pole - s, so the ratio c(k=4)/c(k=2) is predicted without free parameters.

| s | pole 5/6: measured ratio | predicted | "pole" 1/6: measured ratio | predicted |
|---|---|---|---|---|
| 1/3 + 2i | 1.4655 + 0.1552i | 1.4660 + 0.1553i | 18.8 - 14.4i | 1.606 - 0.193i |
| 1/2 + 3i | 2.0483 + 0.5445i | 2.0491 + 0.5448i | 12.4 + 1.1i | 2.507 + 0.006i |
| 0.7 + i | 1.1516 - 0.0842i | 1.1519 - 0.0842i | 16.8 - 50.0i | 1.058 - 0.297i |
| 1/4 + 1.5i | 1.2705 + 0.0777i | 1.2708 + 0.0778i | 14.7 - 20.8i | 1.327 - 0.174i |

The 5/6 term agrees with a simple pole to 4 digits at four points (this is a stronger validation of the model
than the residual quoted in the result). The 1/6 term fails by a factor of about 10: it absorbs truncation error.
Effect on the values of T: none at the stated accuracy (two-term and three-term fits agree to 4e-4 at k = 2 and
to 8e-3 at k = 4 at the four points).

**E2. "T is entire" does not hold for the measured row; pole of L0 on the row axis.** Section 1 states T entire
and Lemma 2(a) uses it ("D is analytic there because T is entire"). The measured row (eta = 1, m = 1, no weight)
has a simple pole at s = 5/6 (confirmed in E1), so D has a pole at 5/6 in Re s > 1/2. For the same row L0 has the
pole of zeta_F at w = 1, which is s = 1/2, a point of the row axis; D vanishes there. Neither fact is mentioned.
Item 3 of the verdict needs the proviso "apart from the poles of T and the pole of L0 at w = 1 when psi is
trivial". For a non-trivial twist the referee's fit gives c1 of size 5e-4 (section 3), consistent with T entire.

**E3. Imprimitive Euler factors (Prop. 3(a), 3(b)).** L0 is a sum over b prime to the bad set, so it is the
primitive L(w, psi) times finite Euler factors, in the measured row (1 - 3^{-w})(1 - 4^{-w}). These vanish on
Re w = 0, that is Re s = 1/6, at heights in arithmetic progression. Consequences: (i) in Prop. 3(a) D has further
poles at Re s = 1/6, reflected to Re s = 5/6, at every height, in addition to those in (1/2, 5/6), unless T
vanishes there; the trivial zeros of L(w, psi) add poles at real s <= -1/6 where T does not vanish
(for the unweighted row the forced zeros of T are at s = -1/6 - k and -5/6 - k, k >= 0; s = -1/2 and -3/2
are zeros of L0 and are not forced zeros of T). (ii) Prop. 3(b) "the zeros of L0 cancel identically" is false
for the imprimitive L0: L0/L0^{#'} is the gamma ratio times a ratio of finite Euler factors with zeros on
Re w = 0 and poles on Re w = 1. It is true for the non-trivial zeros, which is what the argument uses.
Note on (i): the list of trivial zeros of T was derived by the referee from the K_{1/3} completion and was not
checked numerically; it is not used in the outcome.

**E4. Label and scope of "poles at every height" (claim line, verdict items 4, 5, Prop. 3).** "D has a pole at
each s_rho" and "the pivot reads those poles at every height" are conditional on T(s_rho) != 0 for each rho.
That is measured for five zeros (eight with section 3) of one unweighted row, by a float64 fit. Prop. 3 should be
labelled "PROVED conditional on T(s_rho) != 0; hypothesis MEASURED at 8 zeros of one row". "In every row whose
cube character is the given one" is not tested for any second row (the referee's attempt on a twisted row was
inconclusive, section 3). The result's weakest step 2 says this; the claim line does not.

**E5. Wording of the self-duality condition (section 1).** The Cayley symbol needs F^# = eps F on the axis, not
self-duality of the character: every completed Hecke L-function satisfies Lambda(w, psi) =
eps conj(Lambda(1 - conj w, psi)). The single row fails because T^# is a different series (dual cusps), which is
what the result then says. With the corrected wording Prop. 3(c) may use the bridge of L(w, psi) for non-real psi.

**Minor.** (a) "40 to 800 times the spread between fits" is correct, but the fit residuals at the zeros (0.004 to
0.7) exceed the spread at the higher zeros; |T| over the smallest residual of the three fits is 580, 490, 92, 38,
13 for the five zeros. (b) Section 4 does not run T-NR, Beurling, zeta(s+a)zeta(s-a), the phase-rotated transfer
operator or theta^w with data; since R3 is claimed false this changes nothing, but the table is not a complete
control run. (c) Known content: the factorisation with zeta_F(3s - 1/2) and the poles of the Gauss-sum series at
its zeros are in Kubota (1969) and Patterson (1977) [recalled by the referee, not opened]; the adjacent
Sarnak / Gelbart-Lapid identification is also recalled, not opened.

## 3. Numeric rerun with different cases

Same data and method as `row_zero_test.py` (three fit configurations), new points.

Untwisted row, zeros not in the lane's list:

| zero | s_rho | |L0| | |T| three fits (residuals) | |T| at +0.15i, -0.15i |
|---|---|---|---|---|
| L(chi_-3), 18.26200 | 1/3 + 6.08733i | 2e-15 | 1.004, 1.028, 0.905 (0.44, 0.27, 0.18) | 2.4, 1.0 |
| L(chi_-3), 20.45577 | 1/3 + 6.81859i | 6e-16 | 5.28, 5.14, 5.43 (0.64, 0.48, 0.26) | 4.0, 5.2 |
| zeta, 25.01086 | 1/3 + 8.33695i | 3e-15 | 7.89, 7.44, 8.19 (1.1, 0.77, 0.54) | 6.4, 6.0 |

T(s_rho) != 0 is supported at 20.456 and 25.011 (|T| at least 8 times the residual of the best fit). At 18.262 the
value 1.0 is 4 to 5 times the best residual and 8 times the spread: non-vanishing is likely, not secured.

Different row (referee's choice): Psi = chi_-4 composed with the norm, a quadratic target with psi = Psi, so
L0 = L(w, chi_-4) L(w, chi_12)(1 + 3^{-w}) is the target itself. Result: inconclusive. On Re s = 1/3 the model
residual is 0.74 (k = 2) and 1.4 (k = 4) against max|G| = 8, the same ratio as the lane's random-phase control
(1.9 against 7), so the range X <= 3.5e6 does not resolve this row at Re s = 1/3. Raw values: |T| = 4.2 to 4.5 at
the chi_12 zero 3.8046 (residuals 0.33 to 1.1), 6.6 to 7.3 at the chi_-4 zero 6.0209 (0.62 to 1.4); higher zeros
have residuals comparable with |T|. At s = 0.7 + i the fit is good (residual 2e-3) and c1 = 5e-4: no pole at 5/6
for this row. No conclusion about T(s_rho) for a twisted row is drawn.

## 4. Controls

No zeta-only mechanism is claimed, so no control has to fail. Checked by the referee:

- DH-type target: T is linear in Psi, so the functional equation, the axis and Lemma 2 for T are unchanged, and
  T = L0 D has no analogue for c1 eta1 + c2 eta2. Confirmed. The T-bridge statement is Euler-blind.
- Height translate: all statements translate. Confirmed.
- THIN, Liouville, generic unimodular: the result's statement is absence of a known continuation, labelled
  ARGUED. Correct label; not a theorem.
- zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator: not run in the result and not run here
  (the row construction takes a character as input; these controls are not character twists).

## 5. Requirement flags (referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | Multiplicativity is used only in T = L0 D; the only output is the pole reading, a restatement of zero positions |
| R2 | false | No inequality is obtained; the height-uniform statement is an identity conditional on T(s_rho) != 0 |
| R3 | false | The T-bridge passes DH, theta^w and heat; THIN fails by non-existence of the object, argued not proved |
| R4 | false | Row axis is Re w = 1 for the Euler factor; about Re w = 1/2 the form is H(T) - H(D) with no sign |

## 6. Corrected statement that survives

For a completed cubic-theta row T = L0 D with L0(s) = L(3s - 1/2, psi) (imprimitive at the bad primes): the row's
reflection axis Re s = 1/2 is Re w = 1 for L0, 1/6 from the axis Re s = 1/3 of L0; the reflection quotient of T
about its axis has no pole from a zero of L0 (classical non-vanishing on Re w >= 1). For the unweighted row with
eta = 1, m = 1, mask at 2 (T has a simple pole at 5/6, confirmed by a parameter-free k-ratio test, and no pole at
1/6), a float64 fit gives T(s_rho) != 0 at eight low zeros of zeta_F (one of them, 18.262, with margin about 4),
so D has poles there; where T(s_rho) != 0 the reflected pole of D sits at real part (5/2 - beta)/3, which restates
beta. About Re s = 1/3 the non-trivial zeros of L0 cancel from the reflection quotient of D, and the
log-derivative form is H(T) - H(L0) with no sign available from the row's functional equation. This is the
classical Kubota-Patterson normalisation read in bridge language; it is an obstruction record, not a new theorem.
Not established: T(s_rho) != 0 for any row with a non-trivial character or angular weight; non-existence of a
continuation for THIN; the Mellin form of MS Prop. 5.1 (read, not re-derived, by the result and by this referee).
