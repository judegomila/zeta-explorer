# REFEREE2: second pass on Statement O (`push/c9-obstruction-record-statement/STATEMENT_O.md`), lines 1 to 12

2026-11-19, lane `c10-repair-record-referee-r9` (record lane B). Internal pass, not the author of the statement and
not the first referee. One section per line. For each line: the closing step as this pass reads it, what was
re-derived or re-run here with cases different from the lane's and from `REFEREE.md`, and the outcome: **checked**
(the closing step is covered by this file in addition to `REFEREE.md`) or **relative to <source>** (the closing
step rests on a source that is closed-access, unopened, or was not re-run; round-9 lesson 7).

Runs: `ref2_checks.py` (mpmath, 30 digits; log `ref2_checks.log`, values `ref2_checks.json`; 128 s, one process,
largest allocation a 10 MB sieve) and `ref2_l9_hp.py` (80 digits), both local through `scripts/memcap.sh 8`. Float
and multiprecision evaluations, not interval certificates. The compute server was not used for any check.

No line is a statement about zeros of zeta. No requirement flag is set or changed by this file (R1 = R2 = R3 = R4 =
false for the record lane, as before).

## 0. How a line closes

By A3 and A4 of the statement, a mode (Z) line closes with two facts: (m) the control C satisfies every input of
the read class R, and (z) C has a zero with real part above the stated abscissa. Given (m), every step of a device
that reads only R is valid for C by definition, so sentences of the form "every inequality from these inputs holds
for C" need no separate source. This pass checks (m) and (z). A line whose (m) or (z) rests on an unopened source
is relative to it. Modes (S) and (I) close with a named statement that is false for C, or with an identity that
holds for C; these are checked where an instance could be computed.

Joint clause. Section C of the statement said that a device with R1, R3 and R4 "must read, in one step, at least
the items below". This pass agrees with `REFEREE.md` E1: the twelve lines are separate conditional statements and
give no joint necessity. The clause is reworded in the statement (script `apply_statement.py`); the table is kept
as a summary.

## 1. Line 1 (size, positivity, support of Lambda). Outcome: relative to `screw-canonical`, `twist-rigidity`

Closing step: mode (S): the positivity statements fail for TW+ and TW- (P9, P23, P6). Not re-run here: the
admissible window of w_2 (P9) and the annihilation count (P23) need the lanes' own computations; each has one
referee. Checked here, zero-mode members only: the Liouville twist zeta(2s)/zeta(s) at s = rho_4/2 =
0.25 + 15.2123...i: abs(zeta(2s)) = 1.4e-30 with denominator abs(zeta(s)) = 1.03 (so the quotient vanishes;
Re s < 1/2, as the line says: a control only for "all zeros on the line" conclusions). Lambda_F(p^k) = (-1)^k log p:
the twist is a member of TW- with abs(eps) = 1. E_a: section 3. The line stays ARGUED.

## 2. Line 2 (FE + kernel positivity + integers, no Euler product). Outcome: (z) checked; (m) relative to `pick/`, `c1-missing-controls` Part C

(z). DH written as ((1 - i kappa) L(s, chi) + (1 + i kappa) L(s, conj chi))/2, chi(2) = i, kappa = 0.2840790438,
L by Hurwitz zeta. Root-finding from starts 0.79 + 85.72i and 0.66 + 114.15i (not the quoted points):
0.808517182456637 + 85.699348485378i and 0.650830080609737 + 114.163342730757i. Argument-principle integral of
f'/f over the rectangle [0.7, 0.9] x [85, 86.5]: 1.0 (imaginary part 4e-33): exactly one zero inside, with
Re s > 0.7. Coefficients periodic mod 5 = (1, kappa, -kappa, -1, 0): a(6) - a(2)a(3) = 1.0807009 and
a(14) - a(2)a(7) = -1.0807009 (no Euler product). The statement "zeros with Re s > 1 up to sigma* = 1.1203625" was
derived by the first referee from Bohr's criterion; not repeated.
(m). Finite Pick orders 2 to 148, Taylor blocks, the Arb kernel certificate: not re-run. They are certified runs
with one referee each. The line stays MEASURED; its floor is the floor from this one function.

## 3. Line 3 (Euler product + Lambda >= 0 + FE, without SIZE). Outcome: checked

(m). Euler product: product of two. Lambda_{E_a}(n) = Lambda(n)(n^a + n^-a) >= 0, and it exceeds log n at every
prime power, so SIZE (abs(Lambda_F(n)) <= log n) fails: the control lies in the class as stated ("without SIZE").
FE: with xi(s) = s(s-1)/2 pi^(-s/2) Gamma(s/2) zeta(s), relative defect of xi(s+a) xi(s-a) under s -> 1 - s at
s = 0.23 + 3.1i, a = 0.11: 4.5e-31. Explicit formula and growth: those of zeta at shifted arguments.
(z). a = 0.11, gamma_5 = 32.9350615877: abs(E_a(0.61 + 32.935...i)) = 5.0e-31.
The closing step is elementary and is covered by `REFEREE.md` (a = 0.37, gamma_3) and by this file. By section 0
the lane `bootstrap` (no referee) is not needed for the lemma. Label under the statement's rule: PROVED. The
existence of zeros of zeta on the critical line is classical input.

## 4. Line 4 (hypotheses stable under small backward heat flow). Outcome: relative to `b-escape-law`

Closing step: (z) the located off-line zeros of H_tau, tau < 0, and the escape law F1. Not re-run: the lane's
variable and kernel normalisation were not reconstructed in this pass, and a quadrature at 110 to 300 digits is the
lane's own computation. F1 is PROVED at source with one referee. The line is ARGUED, relative to `b-escape-law`.

## 5. Line 5 (Euler product + Lambda >= 0 + pole, no FE, no integers). Outcome: relative to the Beurling literature (not opened)

(m) holds for every Beurling system by definition. (z), a system with continuation and a zero with real part above
a prescribed theta < 1, is a literature statement that no lane opened (candidate recalled: Diamond, Montgomery,
Vorhauer 2006; closed access). The line is relative to it. The transfer theorem P46 used in the line has two
referee files. A replacement control on file (thin prime deletion: `REFEREE.md` section 5) is assigned to lane
`c10-thin-deletion-zero-mode-control`; until it and its referee report, line 5 does not use it.

## 6. Line 6 (invariance under a change of local test vector at one prime). Outcome: checked, narrowed

(m). Factor D(s) = 2 cosh((s - 1/2) log q) + c: D(s) - D(1 - s) = 2e-31 at s = 0.31 + 2.2i (q = 7, c = 5); exact
by evenness of cosh. q^(-s) q^(1/2) D(s) = 1 + c sqrt(q) q^-s + q q^-2s, so zeta times this polynomial is an
ordinary Dirichlet series with multiplicative coefficients (Euler factor changed at q only): multiplicativity
defect over coprime m, n < 200, mn < 400: 0. Gamma factor and pole: those of zeta.
(z). q = 7, c = 5, k = 2: s = 1.30517553 + 8.07229629i, abs(D) = 3.4e-30. q = 11, c = -3 (heights 2 pi k/log q),
k = 3: s = 0.90136184 + 7.86087538i, abs(D) = 2.3e-30. Re s = 1/2 + arccosh(abs(c)/2)/log q in both.
Narrowing: KER (kernel-side positivity) is listed in the read class and was not checked for the twin by either
pass; the proved form is for the inputs {multiplicative coefficients, FE, gamma factor, pole}. The localisation of
the binding step of the 7/8 argument (Z18) is relative to `r3-tnr-control`, whose referee does not hold two of its
statements.

## 7. Line 7 (complete multiplicativity, unimodular parameters, no periodicity). Outcome: relative to the short-interval prime theorem

Re-derived: with P_S(s) = sum over p in S of p^-s and the counting hypothesis, P_S(s) = (1/2) log(1/(s - b)) + analytic
near s = b; log(F/zeta) = -2 P_S + (analytic on Re s > b/3), so F = zeta (s - b) W. The coefficient 1/2 of the
logarithm is what gives a simple zero.
Numerical instance, different from b = 0.9 and 0.95: greedy set at b = 0.8, primes to 1e7 (sieve), rule "take p
when the count is below (1/2) int_2^p t^(b-1) dt/log t". Counts 8, 30, 130, 623, 3182, 16888 at X = 1e2 .. 1e7
against targets 7.4, 29.4, 129.1, 622.7, 3181.4, 16887.6; abs(count - target) < 1 for all p > 1000.
sum over p in S, p <= X of p^-b minus (1/2) log(log X/log 2): 0.11222, 0.11143, 0.11114, 0.11098, 0.11100,
0.11100. The limit exists to four digits, so the singularity of P_S at s = b is (1/2) log(1/(s - b)): consistent
with a simple zero of F at b = 0.8. (An independent run at b = 0.9 is in
`c9-szego-sum-rule-prime-cascade/REFEREE.md` section 2.)
What this does not give: the error term O(x^(b - eta)) with eta > 0 for all x, which is the short-interval input
(Huxley's asymptotic; classical, not opened here). In the tracking above the error is below 1 because prime gaps up
to 1e7 are small; the theorem is needed for all x. The ray-class variant is relative to Coleman 1990, Theorem 2.1
(primary text not opened). The line stays ARGUED, relative to these.

## 8. Line 8 (frequencies log n only). Outcome: checked in the corrected form (no floor)

The read class does not read coefficients, so every Dirichlet series over the integers is a member. Two members:
zeta(s)(1 - 2^(b-s)) at b = 0.83, s = b + 6 pi i/log 2 = 0.83 + 27.19416i: abs = 2.8e-30; the polynomial
1 - 9 * 2^-s at s = log 9/log 2 + 10 pi i/log 2 = 3.16993 + 45.32360i: abs = 7.1e-31. For every real x there is a
member with a zero on Re s = x (M = 2^x). So the class has no floor; the earlier "floor Re s = 1.12 (DH)" is
withdrawn in the statement (`REFEREE.md` E5). The device-type sentences (D1, D6) are relative to
`c5-device-table-extension`; Turan's equivalence is relative to a source quoted from memory.

## 9. Line 9 (discrete special values). Outcome: checked

(m). chi_-4 is odd, so L(s, chi_-4) vanishes at s = -1, -3, ...; chi_5 (real, even) gives zeros at 0, -2, -4, ....
At 80 digits: L(-13, chi_-4) = L(-15, chi_-4) = L(-17, chi_-4) = 0 and L(-12, chi_5), L(-14, chi_5),
L(-16, chi_5) of size 1e-74 to 1e-70 against cofactors 1e6 to 1e13 (the 30-digit run shows 2.9e-10 for the
product at these points, which is rounding in the Hurwitz sums). So C_c(-k) = zeta(-k) for every c.
(z). s0 = 0.71 + 40.2i: c = -zeta(s0)/(L(s0, chi_-4) L(s0, chi_5)) = -0.3502491 + 1.0054214i,
abs(C_c(s0)) = 0 to working precision. The construction is exact for every s0 where the product is non-zero.
Label under the statement's rule: PROVED (exact construction). The sentence on p-adic data is relative to row D5.

## 10. Line 10 (mean values only). Outcome: relative to H_W and `b-mvcap-function-side`

Closing step: the cluster lift with one off-line pair in one window, within 2E + E^2 of zeta at sigma = 2. Proved
at source relative to H_W, which is not known for any lane window above 3e12; one referee. Not re-run. The general
form of MV-CAP has no single refereed statement. The line stays ARGUED, relative to these.

## 11. Line 11 (exact identities with no inequality). Outcome: relative to `eq48`, `dh-separator`, `b-euler-detector`, `c5-device-table-extension`; one instance checked

The closing step is, per control, "the identity holds for C and its sign reads the zeros of C". Instance checked
here: the argument principle for DH on [0.7, 0.9] x [85, 86.5] returns 1 (section 2): an identity valid for the
control that reports its off-line zero and has no inequality in it. (The Littlewood window identity for DH was
checked by the referee of `c9-szego-sum-rule-prime-cascade`: B_W = 0.1085171825 at sigma = 0.7.) The identities
P1, P8, L2, D7 were not re-derived; each has one referee, and the starred control cells of P8 are inferred. The
line stays ARGUED.

## 12. Line 12 (finite stages, then a limit). Outcome: Q21 sub-statement checked; limit step relative to `c1-leeyang-krein-limit`

Rotation invariance (Q21, pointwise form). The logs of the primes are linearly independent over Q, so
t -> (p^(-it))_{p <= P} is dense in the torus (Kronecker). For a unimodular twist u the stage is the untwisted
stage evaluated at a rotated torus point, so the supremum over heights of any continuous function of the phases is
the maximum over the torus, the same for every u. Instance: P = {2, 3, 5}, sigma = 0.6, random phases u_p
(seed 20261119): max over the torus prod (1 - p^-sigma)^-1 = 9.8318174; sup over 0 <= t <= 6e4 (step 0.01) of the
twisted stage: 9.8313676 at t = 8056.67 (ratio 0.99995), where the untwisted stage has modulus 0.677. So a bound
valid for every member of a rotation-closed class is at least the torus maximum. Covered by
`c2-polydisc-leeyang-bound/REFEREE.md` and by this file.
Limit step (Q19: the limit is equivalent to the zero-free statement): not re-derived; one referee. Mode: (I) only
(`REFEREE.md` E6). The line stays ARGUED.

## Summary

| line | outcome of this pass | label after the pass |
|---|---|---|
| 1 | members re-run; step mode relative to `screw-canonical`, `twist-rigidity` | ARGUED, relative |
| 2 | zero step checked; membership relative to `pick/`, `c1-missing-controls` Part C | MEASURED |
| 3 | checked | PROVED (elementary) |
| 4 | not re-run | ARGUED, relative to `b-escape-law` |
| 5 | source not opened | ARGUED, relative to the Beurling literature |
| 6 | checked without KER | PROVED (elementary, narrowed) |
| 7 | derivation and one numerical instance checked; error term is the input | ARGUED, relative to the short-interval theorem (Huxley; Coleman 1990 not opened) |
| 8 | checked in the corrected form | PROVED (elementary; no floor) |
| 9 | checked | PROVED (exact construction) |
| 10 | not re-run | ARGUED, relative to H_W and `b-mvcap-function-side` |
| 11 | one instance checked | ARGUED, relative to the identity lanes |
| 12 | Q21 sub-statement checked | ARGUED, relative to `c1-leeyang-krein-limit` for the limit step |

The four PROVED labels are for elementary constructions of controls (zeros of products of zeta, of a cosh factor,
of a Dirichlet polynomial, of a linear combination). They say that certain read classes contain a function with a
zero off the line. They are not statements about zeros of zeta, and both passes are internal.

Weakest points of this pass: (1) lines 4, 10 and the step mode of line 1 were not re-run at all; (2) membership of
DH in the finite-Pick class rests on certified runs this pass did not repeat; (3) the checks are multiprecision
evaluations, not interval certificates, and the THIN instance cannot test the error term for all x.
