# REFEREE (adversarial, lens: general) for c14-referee-r13-independent/RESULT.md

Date 2026-11-19. Scope: RESULT.md, its six `REFEREE_<lane>.md` reports, logs and `item6_signs.jsonl`; the refereed
lanes' RESULT.md / PREREG.md / one source extract read as text. Own runs local through `scripts/memcap.sh 8`
(mpmath, python-flint; scratch code outside the repo, not kept). The compute server was not contacted.
No statement about zeros of zeta is made here or in the result.

## Verdict

**The result holds as a referee record (partial-result, no new mathematics). No verdict in its summary table
is overturned.** Five wording errors or omissions were found (section 3); none changes a HOLDS / NARROWER / OPEN
label. Requirement flags: R1 = R2 = R3 = R4 = false (agree with the result).

## 1. Steps re-derived here (algebra, by hand)

| item | what was re-derived | outcome |
|---|---|---|
| Lane 2, Theorem B identity | With S = e^(-xz) phi(z), N = z(1-S)/(1+S), f_z = e^(xz/2)(1+S): 2 f_z conj(f_w)[N_z - conj N_w]/(z^2 - conj(w)^2) expands to (z - wbar)(1 - S Sbar) + (z + wbar)(Sbar - S) over (z - wbar)(z + wbar), which is the two-term kernel t1 + t2 coded in `items124.py` | confirmed |
| Lane 2, Theorem C Mobius map | S -> S Theta with Theta = (omega - kappa z + m)/(omega + kappa z + m) gives N' = (kappa omega + N(omega + m))/(omega + m + kappa N); for real N, Im numerator = q kappa (N^2 + kappa N + m); kappa^2 - 4m = -4 (Im a)^2; pole of the map at N = -(omega + m)/kappa, imaginary part -q/kappa < 0 | confirmed |
| Lane 2, single real factor | N' = (N + a) omega/(omega + a N), Im N' = q a N (N + a)/abs(.)^2 for real N, negative on -a < N < 0 | confirmed; the narrowing "non-real pairs or even real multiplicity" is correct |
| Lane 2, T-NR ratio | m(z)/m(z+1) = (q^(-1/2) u^2 + c u + q^(1/2))/(q^(1/2) u^2 + c u + q^(-1/2)), u = q^z; unimodular on abs(u) = 1 (numerator = ubar^2 x conj denominator there); zeros of modulus q^(1/2 +- b), poles of modulus q^(-1/2 +- b); value 1/q at infinity = product of the zero moduli in 1/u | confirmed: Blaschke product of degree 2 in 1/u for b < 1/2 |
| Lane 4, residue table | all eight candidate poles of G; cofactors at beta, 1 - beta, +-i gamma, 1 +- i gamma contain xi*(rho), xi*(rhobar), xi*(1 - rho) or xi*(1 - rhobar); at 2 - beta and beta - 1 the cofactor is xi*(3 - 2 beta) abs(xi*(rho - 1))^2 | confirmed |
| Lane 4, Lemma 3 at d = 4 | (P - 1)(4P - 3/2) <= 4P^2 - 7P/2 + 1 iff P >= 1/4 iff beta <= 7/4 at P = 2 - beta; w*(1,4) = 3/5, w*(2,4) = 20/13 | confirmed |
| Lane 3, BRS (4.6) | `sources/brs.txt` lines 1364-1387: H_+ carries "- alpha^+_(1,1/2)(s/2)" and the sum starts at n = 2; "we also set h^+_1(s) := 0". Lane RESULT.md line 82 displays both kernels without the subtraction. (4.4) gives alpha^+_(1,1/2)(0) = -r_1(1) = -2 | confirmed: the omission is real; the corrected form H_+ = (zeta*(s)/zeta*(w)) [A^+ - alpha^+_1 zeta*(w)]/2 is correct |
| Lane 5, decay exponent | the five measured exponents equal -J - 3/2 - c to the digits printed (`item5e.log`) | consistent |
| Lane 5, sign rule | Z_chi real on the real axis, R_chi(0) > 0 under L(1/2, chi) != 0, sign changes of Z_chi(t) Z_chi(-t) at abs(t) = abs(gamma) only | confirmed |
| Lane 6, Lemma H (i)-(iii) | exponent identities for e^(tau u^2/4); (log)'' shift tau/2; F2[K_tau] = e^(tau u^2/2 + 2 mu u)(F2[K] - (tau/2) K^2) | confirmed |
| Lane 1, Lemma L | Cauchy-Binet with a three-term Toeplitz weight; discriminant c^2 - 4 independent of the p0^(+-alpha) weights; c = 2 gives double zeros on the line | confirmed; conditional on the measured sign of zeta's lattice minors, as the result says |

Not re-derived here: Lemma P / Proposition S item by item, Lemma E's composition-formula step, Lemma 1 of lane 5
(the result itself labels it "not re-proved").

## 2. Numeric checks rerun with different cases (mpmath 40 digits / flint 128 bits)

| check | result's case | fresh case here | outcome |
|---|---|---|---|
| Lemma E value | abs(xi(0.8 + 3.7i))^2 = 0.13091264136 | recomputed: 0.130912641360618 | agrees |
| Lane 4 residues at a zero | first zero, 1.0598540200154647e-10 | first zero reproduced (1.05985402001546480e-10); second zero: closed form 3.8516424363191085e-15 = limit at 3/2 and at -1/2; fifth zero: 3.9382592694970631e-23, same; limits at 1 +- i gamma, +- i gamma vanish (1e-37 to 1e-63 at eps = 1e-18); no pole at 1/2 | agrees |
| Lane 4 generic parameter | beta = 0.3: 9.61194e-11, 1.38611e-11, 3.0040e-20 | reproduced; fresh beta = 0.62, gamma = 9.3: eight non-zero residues (1.3545e-6 at 1.38 and -0.38, 9.1262e-6 at 0.62 and 0.38, 1.9038e-12 at the four complex points), rightmost pole 2 - beta | agrees |
| T-NR zero of m | (2, 2.0506): 0.823846 + 4.532360i, abs(zeta) 0.7105; (3, 2.0785): 0.754203 + 2.859601i, 0.5868 | both reproduced; fresh (5, 2.4): zero 0.886696 + 1.951981i, abs(zeta) = 0.66665 | agrees |
| Blaschke product = m(z)/m(z+1) | q = 2?, 6000 factors, difference 3.7e-5 | (3, 2.5) at 0.6 + 1.7i: difference 6.5e-5 (K = 2000), 1.6e-5 (K = 8000); (2, 2.1) at 1.3 - 0.4i: 2.5e-5, 6.2e-6. Difference scales as 1/K, ratio tends to 1: no extra exponential or unimodular factor | agrees |
| Sign rule | five characters, q <= 13, 305 of 305 | chi_17(3, .), chi_19(2, .), 80 random heights in (0.05, 29.9) each, zeros by bisection: 160 of 160; abs(Im R)/abs(R) below 6e-36; 23 and 21 negative entries | agrees |
| Lane 6 tallies | 10,123 / 377 / 0; 63 one-signed; T-NR 25, SGN 31, EIS 21 and 8, E_a 2 and 2, theta^(1/2) 2 | recounted from `item6_signs.jsonl` with separate code: identical | agrees |
| Battery DH not a copy of a positive | (not stated in the result) | sign(DH) = sign(chi_5(2, .)) on 278 of 300 sampled functionals, so the functional value on Re K is not the real part of the value on K; the "63 of 63" is not forced by the convention | no tautology |

Controls: the result claims no zeta-only mechanism. The control outcomes it reports (BLS, T-NR, generic-parameter
E_a) were spot-checked above on the mechanism side (Mobius closure, Blaschke form, generic-beta residues).

## 3. Errors and omissions found

1. **Section 6, row "Davenport-Heilbronn: never opposite ... 0 of 51,764 on the grid recount" omits "battery member".**
   The referee's own `item6_recount.log` last line reads: battery DH opposite 0, "some held-out DH member opposite
   50999". On 98.5% of the P2 one-signed grid functionals at least one held-out DH-class member has the opposite sign.
   The row and the sentence in 3.6 ("DH never opposite") must read "battery DH member (q = 5, Re)". As written the
   row can be read as "the DH class passes", which the same log contradicts. The lane's label is not affected.
2. **"(T5) at three fresh (a/q, s)" (3.5) is wrong for two of three.** (3/7, 1/2 + 2.5i) and (2/5, 1/2 + 10i) are the
   lane's own cases (lane RESULT line 149; the report itself prints the lane's values next to them); the third uses a
   fresh a/q = 4/11 with the lane's s = 0.3 + 1.7i. Correct wording: two reproductions and one new a/q.
3. **"Lemma 1 ... three fresh instances" is two fresh instances and one fresh J.** (5/7, b = 3.2i) is the lane's
   second-pass case (lane RESULT line 145, J = 6, c = -0.8); the referee ran J = 9, c = -0.75. Instances 3/8 and 4/9 are
   new. The headline claim "three fresh instances" should say so.
4. **Lemma 1 defects are truncation-limited, not precision-limited.** With E_J = (1/2 pi) x integral cut at V, phase
   derivative about log V + O(1) and integrand modulus 3.5e-17, 1.5e-17, 5.8e-17 at V, the omitted tail is of order
   1e-18: the size of the reported defects (6.1e-19, 5.4e-19, 6.5e-18). The check therefore confirms the display to
   about 1e-17 relative to terms of size 2 to 133 and cannot resolve anything smaller. The result says "defect below
   1e-17", which is accurate; it should say the tail is not enclosed (it does so only for lane 6).
5. **"A wrong-sign rate of about 1 in 3,400 is not excluded at the 95% level" (8.1) treats 10,123 entries as
   independent uniform draws.** They are 300 functionals x 35 objects (entries of one row share the functional), and
   60 rows (set B) were selected conditional on the stored signs of the 24 positives. The bound per functional is
   3/300 = 1 in 100. The figure is a best case, not a 95% bound. Likewise "T-NR opposite on 25 of 63" is from a
   sample stratified on T-NR (10 rows chosen as stored counterexamples) and is not a rate; the result says "the 10
   stored counterexamples among them", so this is disclosed, but the section-6 figure "35%" is the lane's grid number
   (recount pass fraction 0.646), not a sample result, and should be attributed.

Minor: the lane-2 report's Blaschke numeric (z = 0.37 + 2.9i, 6000 factors) does not state (q, c); the header says
"round-13 lanes 1 to 6: no filter is BROKEN" while lane 6's random, adaptive and A3 stages (10.2 million of 13
million functionals) and the affine kernel of lane 2 are outside what was refereed. The result states both limits;
the one-line claim should not be quoted without them.

## 4. Checks on the standing rules

- Nothing assumes RH. Lane 4 numerics at a zero use beta = 1/2 because only such zeros are available; the result says so
  and tests the beta-dependence on a generic parameter.
- Nothing restates verified height. No known theorem is presented as new: ASWE, Maass-Selberg positivity, BRS, Bettin,
  Bochner, log-concavity of the Riemann-Polya kernel are all labelled classical or "source not opened".
- Lemma L stays conditional on a MEASURED sign pattern of zeta's lattice-row minors (100 node sets per order, two
  ranges). It is not a theorem about zeta; the result labels it so.
- "HOLDS" for Lemma 1 of lane 5 means "reproduced numerically"; "HOLDS" for the lane-3 factorisation means "read
  against the source and by algebra, no kernel computed". Both are labelled in the result.

## 5. Requirement flags (set here)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument about zeta; the refereed lemmas record where multiplicativity is not consumed |
| R2 | false | no height-uniform statement |
| R3 | false | the recorded outcomes are controls passing (T-NR, BLS, E_a, battery DH, backward heat) |
| R4 | false | nothing passes to the critical line |

## 6. Corrections to apply to RESULT.md

- Section 6 and 3.6: "Davenport-Heilbronn" -> "battery DH member"; add "at least one held-out DH-class member is
  opposite on 50,999 of the 51,764 grid functionals (`item6_recount.log`)".
- 3.5 and the claim line: "(T5) at three fresh (a/q, s)" -> "(T5) at two of the lane's cases and one new a/q";
  "Lemma 1 at three fresh instances" -> "two new instances and one of the lane's (a/q, b) at a different J".
- 8.1: replace the 1-in-3,400 sentence by the per-functional bound (0 of 300 rows) or state the independence
  assumption.
- 8.2: add that the Lemma 1 remainder tail beyond V is not enclosed and is of the size of the reported defect.
