# REFEREE (independent, lens: general): c11-rs1-regular-rep-matrix-bridge (2026-11-19)

Status: independent adversarial pass by a second agent. The earlier same-agent pass is kept unchanged as
the appendix at the end of this file. Compute server not used. Local runs through `scripts/memcap.sh 8`
(mpmath 50 digits, 17 s and 15 s; scripts kept outside the repo in a scratch directory, described below so
they can be rewritten). No statement about zeros of zeta is made or needed.

**Outcome: the verdict "precise obstruction, device closed at stage A" holds for the four displayed
candidate forms (K), (E), (Q), (H). Flags R1 = R2 = R3 = R4 = false, as claimed.** Lemmas S, P, Q, 1 were
re-derived and are correct. Six corrections follow; none changes the verdict or a flag. Two of them change
wording that a later lane could misuse (items 1 and 3).

## 1. Re-derivation of the PROVED steps

- **Entries and Euler product.** R(n) delta_b = delta_{nb}, so (M_q)_{a,b} = sum_{n = a b^-1} n^-s = Z_{a b^-1}(s).
  R is a homomorphism of (Z/q)^* into commuting permutation matrices, so the Euler product and
  log M_q = sum_{p,k} R(p^k) p^-ks / k hold for Re s > 1. Confirmed.
- **Bochner form.** Z_c = (1/phi) sum_chi conj(chi(c)) L(s, chi): orthogonality. A function on a finite
  abelian group is non-negative iff its transform is positive definite on the dual. Confirmed
  (numerically at q = 8, s = 0.3 + 11.7i, left of 1: defect < 3e-51 for c = 1, 3, 5, 7).
- **Theta vector and W.** Poisson on the coset c + qZ gives
  sum_{n = c} exp(-pi n^2/(q x)) = sqrt(x/q) sum_{d mod q} e(cd/q) theta_d(x); pairing +-c gives
  W_{c,d} = (2/sqrt q) cos(2 pi c d/q) plus the d = 0 class (and non-unit classes for composite q).
  Confirmed. q = 7: W has rows (0.471, -0.168, -0.681), ...; q = 8: W = [[0.5, -0.5], [-0.5, 0.5]].
  Note for the record: W maps the particular vector Theta(x) to a non-negative vector (the left side is a
  sum of Gaussians); "W has negative entries" is a statement about the linear map, not about the orbit of
  the theta vector. The text reads correctly with that understood.
- **Lemma S.** e_chi are orthogonal idempotents commuting with P_c, Q_c (which act on the L^2 factor), so
  every bridge object is a direct sum over chi. Confirmed. The equivalence "Gamma_-^chi = 0 iff GRH for
  chi" is cited from the square-root lane, which proved it for an even F (xi). For complex chi the function
  F_chi is real on the axis but not even; the argument still goes through (zeros are symmetric under
  z -> -conj z; Re F'/F = sum Re 1/(z - rho) > 0 in Re z > 0 under GRH uses the classical identity
  Re B(chi) = -sum Re 1/rho; the converse is the same maximum-principle step). I checked this sketch; it is
  not written in RESULT. Status of that clause: PROVED relative to a three-line extension that is owed.
  Not used in the verdict (Lemma P needs chi_0 only).
- **Lemma P.** 1 = sum_c delta_c, v^(chi) = phi delta_{chi, chi_0}, so <1 (x) f, H^(q) (1 (x) f)> =
  phi <f, H^zeta f>; sum_c h(c) = H^chi0. Confirmed. This requires the trivial direction to be completed
  as xi (primitive), not as the eigenvalue zeta(s)(1 - q^-s) of M_q itself, which has no symmetric
  completion. RESULT does this silently in section 2; it is a choice, and it is the only one for which
  S_q is defined.
- **Lemma Q.** Parseval on G. Confirmed. The two displayed inequalities are the same inequality written
  twice (divide the second by phi). The conclusion "(Q) forces Gamma_-^zeta = 0" is correct because
  Gamma_-^zeta does not depend on q under primitive completion.
- **Lemma 1.** tr R(n) = phi 1_{n = 1 mod q}; commuting exponential; delta_c as a non-negative function on
  the phase group. Confirmed. This is the classical factorisation of the cyclotomic Dedekind zeta; RESULT
  attributes it correctly and does not present it as new.
- **Control lifts.** E_a: R(d)R(e) = R(de) gives coefficients sigma_2a(n) n^-a R(n) > 0, and log-level
  coefficients (p^ka + p^-ka) R(p^k)/k >= 0. Perron eigenvalue xi(s+a) xi(s-a) = |xi(1/2 + a + it)|^2 on
  the line: real, even, zeros at Re s = 1/2 +- a. Confirmed. T-NR: the factor
  chi^-1(p0) p0^(s-1/2) + c + chi(p0) p0^(1/2-s) is invariant under (s, chi) -> (1 - s, chi-bar); zeros at
  Re s = 1/2 +- arccosh(c/2)/log p0. Confirmed at a different case, p0 = 3, c = 2.1: zero at
  0.7866568669 + 2.859600867i, abs 1e-51.

## 2. Reruns with different cases (MEASURED, mine)

| check | lane's case | my case | result |
|---|---|---|---|
| entry signs flip at s = 1 | q = 5 | q = 7, q = 8 | s = 1.05: all positive; s = 0.95: all negative; s = 1/2: mixed (q = 7: 0.381, 0.027, -0.159, ...; q = 8: 0.429, -0.092, -0.309, -0.456). Confirmed. |
| (E) on the even sector | q = 5, 10 nodes in [12, 28], offset 0.37 | q = 5 and q = 8 (chi_8, conductor 8), 12 nodes in [11, 29] and 8 nodes in [13, 27], midpoints | C_zeta - C_5: (6,6) and (5,3). C_zeta - C_8: (6,6) and (5,3). Negative eigenvalues -2.5e-3 to -4.9e-3 after diagonal scaling (smallest positive scale 1e-16 belongs to C_zeta alone, so these are not rounding). Fails. Confirmed, and it also fails at q = 8. |
| (K) at v = delta_1 | q = 5 | q = 5, q = 8 | C_zeta + C_5, C_zeta + C_8: (12,0), (8,0). Confirmed. |
| (E) depends on normalisation | stated in words | C_zeta - lambda^2 C_chi | 12 nodes: lambda = 1e-2: (8,4); 1e-4: (10,2); 1e-8: (12,0). 8 nodes: 1e-2: (7,1); 1e-4: (8,0). Nodes in [40, 48]: lambda = 1: (7,1); lambda = 1e-2: (8,0). The failure is a statement about the relative scale of the two eigen-directions. Confirmed as RESULT words it. |
| DH inertia | 10 and 6 nodes, 85.699 +- 2, +- 1 | 8 nodes, 85.699 +- 1.5, midpoints; C[f_A + f_B] also built directly, not as C_A + C_B + X | C_A, C_B, C_A + C_B: (8,0). Direct C[f_A + f_B]: (7,1), eigenvalue -3.72. Window 60 +- 2: direct form (8,0), X alone (7,1). Confirmed. |
| DH zero | 0.808517182457 + 85.6993484854i | re-solved | 0.80851718245664 + 85.699348485378i, abs 7e-52. Confirmed. |
| Hurwitz entry Z_1 zeros | "12 below height 60", all Re s < 1/2; same-agent pass found none with Re s > 1/2 | local-minimum scan 0.5 <= sigma <= 1.2, 10 < t < 150 | Zeros with Re s > 1/2 exist: 0.548433654 + 30.077436968i, 0.628943773 + 64.769234454i, 0.580930315 + 110.822600429i, and four more (abs < 1e-18). See correction 4. |

## 3. Corrections

1. **"The cone can enter only as copositivity or positive definiteness" is not proved; it is an
   enumeration.** Verdict item 1 attaches it to Lemma S with the label PROVED, and the summary claim repeats
   it. Lemma S as stated in section 2 does not contain it, and RESULT's own list has two further cone
   statements, (Q) and (H), that are neither. Cone-preservation statements (an operator of the square maps
   cone (x) positive functions into itself) are a fourth kind not examined. What is proved, and is enough
   for the closure, is the following, which I recommend as the wording of the row: *1 lies in the cone and
   is the chi_0 eigenvector of every element of C[G]; therefore any statement quantified over all cone
   vectors, about any object of the square, restricts at v = 1 to a statement about the scalar zeta object
   in which G no longer appears.* For the forms (K) and (E) that scalar statement is H_c^zeta >= 0 (RH).
   RESULT's weakest step 1 already concedes the scope; the verdict line and the claim should match it.
2. **Section 1 item 5: transposed formula.** With the stated convention (M_q)_{a,b} = Z_{a b^-1},
   delta_1^T M_5 w = sum_b w_b Z_{b^-1} = Z_1 - kappa Z_2 + kappa Z_3 - Z_4, which is the function with
   kappa -> -kappa (the conjugate twin), not f_DH: measured difference 0.364 at s = 1.3 + 7.1i. The correct
   expression is w^T M_5 delta_1 (M_5 is not symmetric; M^T = C M C). The quoted check "defect 2e-71"
   tested sum_c w_c Z_c, which is right, not the matrix expression. No consequence: the twin has the
   conjugate zeros.
3. **THIN and U are invisible on the Perron slice and on the whole even sector (THIN).** Every permutation
   matrix fixes the vector 1. So any lift whose coefficient at every n prime to q is a permutation matrix
   ([PERM] = yes) has Perron eigenvalue sum n^-s, the same as M_q. For THIN, R(p) -> R(-1) R(p) multiplies
   the eigenvalue by chi(-1): every even character is unchanged, with its functional equation and
   periodicity intact; only odd characters are sign-twisted. The table entries "[FE] no, [PER] no" for THIN
   are true only on the odd sector. Consequences: (i) THIN and U are not controls for any conclusion read on
   the Perron slice, where Lemma P places the content; they bear only on conclusions that read non-trivial
   (for THIN: odd) characters. (ii) The reading "a device needs an inequality that uses PERM with FE" should
   carry the remark that on the Perron direction PERM is the statement "the chi_0 eigenvalue is zeta" and
   nothing else. (iii) The requirement that the thin set lie in {p = 1 mod q} is not needed for THIN (the
   same-agent pass also says this); weakest step 3's dependence on a short-interval theorem applies to DEL
   only. The summary sentence "THIN, U, DEL keep positivity and the Euler product" is correct.
4. **Hurwitz zeros: the list in RESULT is a truncation artefact.** `q5_test.py` sorts the zeros by real
   part and keeps the first 12, so "12 found below height 60" and weakest step 3 ("the Hurwitz zeros found
   have Re s < 1/2") describe the truncation, not the function. The same-agent check that "found none with
   Re s > 1/2 below height 65" used a threshold on three vertical lines and missed 0.5484 + 30.0774i and
   0.6289 + 64.7692i. With these, "(H) is false" has measured support on both sides of the line. Zeros with
   Re s > 1 remain quoted (Davenport-Heilbronn 1936), not re-found, by me as well.
5. **"(E) is not implied by GRH" is labelled inside a PROVED lemma but is not proved.** What is proved:
   (E) needs, beyond positivity of each block, the bound |<f, H^chi f>| <= <f, H^zeta f>. What is measured:
   this bound fails on nodes for q = 5 and q = 8 in the stated normalisation. A proof of non-implication
   would need GRH mod q as a hypothesis together with the measured failure promoted to a certified one, and
   it would still be normalisation-bound (item 2 of the table above: with lambda = 1e-8 the same nodes
   pass). Relabel as MEASURED, in the stated normalisations. The sentence "each is implied by nothing
   weaker" carries no content and should be dropped.
6. **T-NR column [P].** The T-NR lift has non-negative entries at product level, as a generalised Dirichlet
   series over n and n/p0. It does not have non-negative log-level coefficients (the scalar control lacks
   Lambda >= 0 at p0, map row 45). Lemma 1 derives entry positivity of M_q from the log level; the control
   table uses the product level. The table is correct at the level it states; the difference should be
   named, because a device reading log-level positivity is failed by T-NR and passed by E_a only.

## 4. Points checked and found in order

- **DH "weight vv^T".** A form <v (x) f, H (v (x) f)> with H in C[G] never has cross terms, so the phrase
  needed checking. It is correct with "weight" read as the middle factor: H_DH = e^*[A^*(ww^T (x) Q_c) A -
  A (ww^T (x) Q_c) A^*]e with e = delta_1 (x) 1, against 1 (x) Q_c for the device. ww^T does not commute
  with C[G], and the cross Wronskian X is the result. My direct construction of C[f_A + f_B] agrees with
  C_A + C_B + X in inertia. RESULT should state the formula; as written the step is under-specified. The
  classification (identity step, local zero detection as in the square-root lane, no R3 credit) is right.
- **Finite nodes as a test of a form on L^2.** C(t, s) is the boundary value of (1.1) of the square-root
  lane on exponentials; a negative direction on finitely many real nodes gives a negative direction of the
  form by continuity. Accepted at MEASURED level, as in the refereed square-root lane.
- **No use of RH; no verified-height restatement.** GRH appears only as the hypothesis of conditional
  remarks. Windows at height below 100 are used only to exhibit failures of (E) and the DH negative square,
  not to assert positivity beyond the nodes. The (10,0) and (12,0) counts for zeta and the characters are
  finite node statements and are not presented as more.
- **No known theorem presented as new.** Lemma 1 is attributed (1837). Lemmas S, P, Q are elementary
  consequences of the decomposition of the regular representation and are presented as such.

## 5. Flags (set independently)

- R1 = false. Multiplicativity is used to diagonalise (identity). No inequality uses it.
- R2 = false. No inequality survives; (Q) is a restatement.
- R3 = false. E_a and T-NR lifts keep P (product level), E, FE, PER and have off-line zeros on the Perron
  direction (confirmed). DH is not an element of the device. By correction 3, THIN and U do not test the
  Perron slice at all.
- R4 = false. No crossing: entry positivity of values ends at s = 1 (confirmed at q = 7, 8).

## 6. Surviving claim

Every bridge object built from M_q with primitive completions is a direct sum over characters (Lemma S).
The vector 1 is in the cone and is the chi_0 eigenvector, so every cone-quantified statement restricts at
v = 1 to a scalar statement about zeta alone; for copositivity (K) and for positive definiteness in chi (E)
that statement is H_c^zeta >= 0 (Lemma P). The uniform entry bound (Q) at threshold o(1/phi) is a
restatement (Lemma Q). Entry positivity is character orthogonality at log level (Lemma 1), holds for
coefficients and kernels, and ends in values at s = 1 (measured at q = 5, 7, 8). Form (E) fails on nodes at
q = 5 and q = 8 in the stated normalisations and passes on the same nodes after rescaling one direction.
Hurwitz entries have zeros on both sides of the line (measured). E_a and T-NR lifts keep product-level
positivity, Euler product, functional equation and periodicity; THIN, U, DEL keep positivity and the Euler
product, and THIN and U leave the Perron eigenvalue unchanged. DH is outside the device (weight ww^T in the
middle factor). Closed for the displayed candidates (K), (E), (Q), (H); not a theorem that no inequality
on M_q exists. All four requirement flags false.

## 7. Scripts used (scratch, not in the repo)

`chk.py`: Z_c at q = 7, 8; W; Bochner at q = 8; both DH row-form conventions; T-NR zero at p0 = 3, c = 2.1;
kernels C[f] for xi, Lambda(chi_5), Lambda(chi_8), the odd pair, with inertia after diagonal scaling (sign
by exact comparison with 0 at 50 digits; all reported negative eigenvalues exceed 1e-8 in size).
`hur.py`: |zeta(s, 1/5)| on a 15 x 700 grid, local minima refined by `findroot`, kept if Re s > 0.5001 and
abs < 1e-18.

---

# Appendix: earlier same-agent pass (unchanged)

# REFEREE: c11-rs1-regular-rep-matrix-bridge (2026-11-19)

Status of this report: adversarial pass written by the lane's own agent (no second agent was available in
this run). It counts as an internal check, not as an independent referee. An independent referee is owed
before the device row is used by a later lane. `refereeHolds` is recorded as null in `lanes.jsonl`.

Verdict on the claimed "precise obstruction, device closed at stage A": **holds as an obstruction at input
level, with the limits below.** No flag is claimed. No statement about zeros of zeta is made.

## Re-derivations

- Entries of M_q: (R(n))_{a,b} = 1 iff a = n b, so (M_q)_{a,b} = sum_{n = a b^-1} n^-s. Correct. Bochner
  identity checked numerically at s = 1.7 + 3i for c = 1..4 (defect < 3e-31, `ref_checks.py`).
- Lemma S: R(G) spans a commutative algebra; F_q, F_q', D_q, N_q are in C[G] (x) functions; inverse of an
  invertible element of a commutative semisimple algebra stays in it. Hankel compression acts on the L^2
  factor only. Correct.
- Lemma P: 1 = sum_c delta_c, e_chi0 1 = 1, e_chi 1 = 0 otherwise; <1 (x) f, H (1 (x) f)> = phi <f, H^chi0 f>.
  Correct. "Sum over c of (E)" gives phi h-sum = H^chi0. Correct. The statement "(E) is not implied by GRH"
  is correct as logic (positive definiteness on the dual group forces |h_f(chi)| <= h_f(chi_0)).
- Lemma Q: Parseval on G for the operator-valued function c -> Gamma_-(s(c)) f. Correct. The two-sided
  sandwich gives equivalence of "o(1/phi)" with Gamma_-^zeta = 0 only because Gamma_-^zeta does not depend
  on q; this requires the trivial direction to be completed as xi for every q (primitive completion), as
  the text says. With the imprimitive L(s, chi_0) the factor (1 - q^-s) changes the symbol with q and the
  sentence would need rewording.
- Lemma 1: tr R(n) = phi 1_{n = 1}. Correct. (b) uses commuting matrices with non-negative entries. Correct.
- Control lifts. E_a: coefficient sigma_2a(n) n^-a > 0, multiplicative; twists L(s+a, chi) L(s-a, chi) have
  a functional equation with root number eps(chi)^2 and the same conductor structure. Correct. T-NR:
  symmetric under s -> 1-s with R -> R^-1; entries non-negative iff c >= 0 (c > 2 needed for off-line
  zeros). Correct; the lift is not an ordinary Dirichlet series (term p0^(s-1/2)), which RESULT states only
  in the table header implicitly. Added here: T-NR lacks INT at p0, as in the scalar control.
- DH weights: w = (1, kappa, -kappa, -1) reproduces the standard definition (defect 2e-71 at one point; the
  identity is linear, one point plus the Bochner identity suffices). Zero at 0.8085171825 + 85.6993484854i
  re-found. Object is not identically zero (f(2) = 1.0000683).

## Independent numerics

`ref_checks.py` (30 digits): Bochner identity; E_a and T-NR lift zeros; toy check of sum_c t(c) = T_chi0. A
second scan for zeros of zeta(s, 1/5) with Re s > 1/2 using a crude threshold found none below height 65;
the claim "(H) is false" therefore rests on zeros with Re s < 1/2 (measured) and on the classical theorem
for Re s > 1 (not re-found). Since the Hurwitz zeta has no reflection symmetry, a zero at Re s = 0.45 is a
zero off the line, but a sceptical reader may want one to the right; this is weakest step 3 of RESULT.

## Corrections and limits

1. **Scope of "closed".** RESULT proves that the two cone forms of one C[G]-valued operator reduce to RH on
   the Perron slice and that controls pass at input level. It does not prove that no inequality on M_q can
   work. The row should carry the words "no candidate with a step using PERM and FE together", as RESULT
   section 4 does, and not "impossible".
2. **"First failing step" in the control table is at input level.** Since no candidate has a proof, the
   table names the first input a control lacks, not a failing proof step. For E_a and T-NR the conclusion
   (K) is false (off-line zeros on the Perron direction) while all four read inputs hold; that is the
   content of "passes". This is the correct reading of the allocation rule but should be said once more in
   the row.
3. **(E) measured false: normalisation.** The (6,4) count at height 20 uses xi against Lambda(s, chi_5) with
   conductor factor (5/pi)^(s/2). Any positive rescaling lambda of the chi_5 direction changes the test to
   C_zeta - lambda^2 C_5; for small enough lambda a finite node set passes. So "(E) is false" is a statement
   about the stated normalisations; the invariant content is that (E) is not scale-free and that the cone
   does not fix the scale once s(s-1)/2 is inserted. RESULT says this; the verdict line "false at q = 5"
   should be read with it.
4. **The row at 85.699, (E): (9,1) with eigenvalue -1.5e-15** against smallest positive 8e-13: at 70 digits
   this is far above rounding (1e-45 threshold), so it is probably a real negative direction of size 1e-15
   relative, not rounding. RESULT calls it undecided; that is conservative. Not needed for the verdict.
5. **DH step.** The measured (9,1) against (10,0) confirms the cross term carries the negative square in the
   window of the off-line zero. In the two other windows X is indefinite while the DH form is positive, so
   X indefinite is not by itself the detection; the detection is local zero detection, as in the square-root
   lane. RESULT states this. No R3 credit: correct.
6. **THIN lift.** Needs a thin set of primes inside {p = 1 mod q} with the counting function of control THIN;
   that is a short-interval theorem in an arithmetic progression. Cited, not opened: status "relative to".
   The simpler observation (class reassignment keeps entries non-negative for every set S) is elementary
   and is all the table needs for column [P].

## Surviving claim

Lemmas S, P, Q, 1 (elementary, correct). Entry signs at q = 5 flip at s = 1 (measured). The functional
equation matrix has negative entries. Control lifts E_a and T-NR keep {P, E, FE, PER}; THIN, U, DEL keep
{P, E} and, for THIN and U, PERM. DH leaves at the commutation identity. Form (E) fails on the tested nodes
in the stated normalisations. Device closed for the candidates displayed; flags R1 to R4 all false.
