# REFEREE (lens: general) for c7-probe-format-h-cap/RESULT.md

2026-11-18. Adversarial pass. Three ad hoc scripts (python stdlib, local, through `scripts/memcap.sh 8`, each under 10 s; kept in
`/tmp/ref_c7cap/`, not in the lane directory, since this pass writes only this file): chk.py (identity at random
points, grid minimum, tightness segment), chk2.py (Hilbert-Schmidt bound on a Legendre-symbol matrix by power
iteration, mu lambda = mu^2), chk3.py (further cases with the lane's own solver `cap_lp.show`). The compute server was
not used. Sources (MS, Liu II) were not opened; transcriptions were compared with `r3-method-limit` section 1 and
`c5-target-fe-order2-ledger` only.

## Verdict of this pass

**Holds, with four corrections.** The PROVED steps (Theorem K, Lemma HS, the linear-algebra part of Lemma A,
Lemma C as a conditional) are confirmed. The classification "precise obstruction" stands for the narrowed statement
at the end. Two numerical claims about what the escaping hypotheses buy are wrong or rest on an input (G = 0) that
the result itself argues is false; the quantifier "every operator-norm estimate" is wider than what Lemma HS
covers; "CAP fails" is a statement about the parameterisation, not an exhibited probe. No statement about zeros is
made, RH is not assumed, verified height is not used, no known theorem is presented as new (Lemma HS is the
standard trace bound and is labelled as such by its one-line proof).

## 1. Steps re-derived

**Theorem K (confirmed).** By hand, with h = 1 + l - lx, M = lx + ly:
((r-2)/r) L' + (1/r) L_K + (1/r) H0
= ((r-1)/r)(1 - h/r) + (lx+ly+l-1)/(2r) + (1/r)(1/2 - ly/2 - l/2) + h(r-1)/r^2 = 1 - 1/r + lx/(2r).
(1 - 4/(3r)) L' + (2/(3r)) L_K + (2/(3r)) H0' = (1 - 2/(3r))(1 - h/r) + (lx+l)/(3r) + 2h(r-1)/(3r^2)
= 1 - 1/r - (l - lx)/(3r) + (lx + l)/(3r) = 1 - 1/r + 2lx/(3r).
Weights non-negative for r >= 2 and sum to 1. The degree-d form (weights 1 - 1/r - 1/(r(d-1)), 1/(r(d-1)), 1/r,
value 1 - d/(2r(d-1)) + lx/(2r)) also checks by hand.
Different case run: r = 2, 3, 6, 7, 9, 10, 15, 100, both high sides, 20,000 random non-negative rational points
each, with the true low constraint L' + max(0, K)/2: 0 violations. Direct grid minimisation (step 1/20 on
[0,3]^3, no bisection) for r = 7 and r = 10: minimum 6/7 and 9/10 at (0, 1, 0). The lane's solver at r = 7 and at
r = 10 without compensation: CONFIRMED 6/7, 9/10.
Addition: the bound is attained (L' = L_K = H0 = cap) on the whole segment l = lx/2, ly = 1 - 3lx/2,
0 <= lx <= 2/3, not only at the 13/15 point (checked at lx = 0, 1/5, 2/5, 1/2: 5/6, 17/20, 13/15, 7/8).

**Lemma HS (confirmed).** ||T'||^2 >= ||T'||_HS^2 / rank >= c Q D / min(Q, D). Exponent arithmetic: Q^{-1/2}
(Q/Y)^{1/2} max(Q, D)^{1/2} = X^{1/2} max(1, D/Q)^{1/2}; reflected d' - M = M + l - 1, equal to k_K of r3;
unreflected 1 + l - M, below k_dir of Lemma 9.1 as transcribed (consistent). Numeric check on Legendre-symbol
matrices (40 x 400, 400 x 40, 150 x 150): top singular value squared 2408, 1021, 1853 against max(Q, D) = 400,
400, 150.

**Lemma A.** The transfer of a modulus-only inequality to beta' is immediate. eta' = eta eps has eta'(p) = -1
(Liouville), and mu lambda = mu^2 (checked n <= 5000), so the reciprocal is zeta_F(s)/zeta_F(2s). The conclusion
B >= 1 needs three things that are not proved here: the principal-row identity for eta' (taken from c6-marks);
smallness of the non-principal rows for eta' (holomorphy on Re s > 1/2 does not give a bound summed over rows
without a conductor-uniform estimate; the result labels this ARGUED); and non-vanishing of the normaliser of the
twisted target at s = 1, which the result does not mention (map row Z24 gives no zeros with Re s >= 2/3 for
H_eta; the same for eta' is plausible since (-1)^6 = 1, not checked). Label ARGUED is correct and must stay.

**Lemma C.** Correct as a conditional. The added sentence "this is the only bound on h that follows from the
format alone" is a negative statement with no argument; it should read "the only one found".

**Other arithmetic confirmed.** MS geometry (17/48, 23/48, 1/6): h = 13/16, b = 1/8, M + l = 1, cap 497/576.
Empty dual: H0 >= 4/3 - 5M/6 >= 11/12 for M <= 1/2. Forced-excess algebra: h/r - b/(2r) = (2 + 2l - M)/(2r) and
k_dir/2 >= (2 + 2l - M)/6, so polar + k_dir/2 >= h/r for r >= 3. Vertex values 8/9, 7/9, 2/3 of the table
reproduce by hand at the listed points.

## 2. Errors and overstatements

**E1 (wrong value). "(E-H) alone gives 1 - 2/r."** This holds only in the three-input system (K as the single
range loss, G = 0) and at the point (0, 0, 1), where Q = Z^0 is a single row. With the source ledger kept:
H0 removed, k = J, K, P, G = 0 gives 4/5 at (0, 4/5, 1/5), h = 6/5; with the polar term kept it gives 13/15 at
(2/5, 2/5, 1/5), i.e. no gain over the present low floor (chk3.py). Verdict item 4 and section 4
bullet (E-H) must be restricted to the three-input system or replaced by these values.

**E2 (inconsistent use of G = 0). "(E-K) alone gives 7/9 at h = 4/3."** That run has G = 0. Section 3(b) of the
same result argues that G = 0 is false and that the polar term b/(2r) is a property of A; A does not depend on
the representation of the rows, so the polar term also stands on the reflected side. With it: K removed, J and P
kept, free geometry gives 31/36 at (1/2, 1/2, 1/3), h = 5/6 (both G = polar and G = src; chk3.py).
So with the Gram term kept, removing the K-loss produces no vertex with h > 1 and nothing below 31/36. The
sentence "with that alone the reduced system gives 7/9 at h = 4/3" should be replaced by this. This correction
makes the obstruction stronger, not weaker.

**E3 (hypothesis mis-stated). (E-K) as written is Sum_m |B_m|^2 << Q^{1+eps} for Q P > Z.** In the r3
transcription k is the range loss of the whole reflected energy of B (k = max(0, k_J, k_K, k_P)), so the
inequality as written sets k = 0 wherever M + l > 1, not only k_K = 0. The system with k = 0 has no floor in free
geometry even with the polar term kept (0.25 = search bound at (9/4, 9/4, 23/4), h = 9/2; chk3.py),
which contradicts Lemma C. Hence, relative to (S) and H0 at lx < l, (E-K) as written is false for long marks, or
(S)/H0 fail there. The hypothesis that corresponds to the runs is "Sum_m |B_m|^2 << Q^{1+eps} Z^{max(0, k_J,
k_P)}", or (E-K) restricted to lx >= l. The numerical test proposed in STRATEGY 4.0 item 3 should use that form.

**E4 (quantifier). "The K-branch is forced for every operator-norm estimate of the reflected rows" and section 4
"every probe ... has B >= 1 - 1/r".** Lemma HS covers bounds of the exact shape Q^{-1/2} ||A||_2 ||T'|| ||beta'||_2
with T' the full Q x D matrix at one of the two listed column lengths and ||beta'|| about 1. Not covered:
(i) an estimate that uses the specific vector A (||T'^* A|| instead of ||A|| ||T'||); A is a structured vector
(additive polynomial of length Y in sextic Gauss sums, r3 section 1), so an A-side vector-specific mean square is
an escape of the same kind as (E-K) and is missing from the list; (ii) Cauchy-Schwarz applied after splitting m,
which changes the row count; (iii) a representation with dual length at most the number of rows (d' <= M), for
which Lemma HS gives no loss; only the Poisson-type case d = 1 is discussed; (iv) mixed or weighted norms.
The reduction of "an arbitrary probe" rests on Lemma U and on the degree-one homogeneity of c6, both imported
with MODEL inputs. The proved statement is: for the two representations of the transcription, an l2-l2 operator
bound cannot be below the K-branch (reflected) or below max(0, 1 + l - M)/2 (unreflected).

**E5 (wording). "CAP as worded fails."** No probe with h > 1 and valid estimates is exhibited. What is shown is
that h is a free parameter of the reduced system when lx < l, a region where r3 (GEO) says the compensated probe
has rescaled length Z^{lx-l} < 1, so the compensated H0 has no source there and H0' is a substitute. Correct
wording: "CAP is not a consequence of the format; the format bounds h only by Lemma C". Likewise "without the
modelling hypothesis lx >= l" replaces that hypothesis by the hypothesis that (S) and H0 or H0' hold at lx < l
(the result's own weakest step 1); the headline should carry it.

**E6 (identification not unique). "The false input of the inconsistent region is G = 0."** Lemma A plus (S)
gives G + k/2 >= h/r for the true values. The result attributes the whole deficit to G. The other candidates are
not excluded: k_dir for marked columns c n^3 (Lemma 9.1 is stated for squarefree columns; large sieves for
non-squarefree moduli are larger) and (S) itself at lx < l (the sample points have lx = 0, X = 1). What is
established is that keeping the polar term is sufficient to restore B >= 1 (already statement (D) of c5) and that
polar = h/r - k_dir/2 on M = 2 + 2l; "the false input is G = 0" should read "G = 0 is a false input there if (S)
and k_dir hold; keeping the polar term suffices". The bracketed ARGUED label is right; the bold sentence and the
proposed map row drop it.

## 3. Controls

No zeta-only mechanism is claimed, so no control has to fail. Checked: Theorem K contains no target data; Lemma
HS uses the entries of T' only (run on a quadratic-character matrix, no relation to the target); Lemma A is the
sign-twist control used as an argument and holds by construction for any target with unimodular completely
multiplicative coefficients. For DH the low side is linear, so the same lower bounds hold termwise. Target
independence as stated in section 5 is confirmed for the three inputs; it means the result gives no R3.
Consistency point checked: if the reflected bound were blind to the phases of the target, Lemma A would give
B >= 1 for the 7/8 system itself; the result's position (twisted targets have no reflection because the weight is
not periodic) avoids this and agrees with c5 line 231.

## 4. Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no step uses multiplicativity in an essential way; the Liouville twist in Lemma A only builds a control |
| R2 | false | no conclusion about zeros in any window |
| R3 | false | the cap is target-independent; it holds for U, DH, THIN |
| R4 | false | the result is a lower bound 1 - 1/r on a model abscissa; nothing reaches the critical line |

## 5. Statement that survives

Relative to the r3 transcription of the unrefereed sources, and assuming the signal exponent (S) and the
floor-class high bound (H0 or H0') at all lx, ly, l >= 0 (MODEL outside lx >= l):
1. PROVED (identity): B >= L', B >= L_K, B >= H0 imply B >= 1 - 1/r + lx/(2r) (2lx/(3r) with H0'); attained on
   the segment l = lx/2, ly = 1 - 3lx/2, which contains the 13/15 point. EXACT LP: infimum 1 - 1/r at (0, 1, 0)
   for r = 2..12 (and r = 7, 10 by this referee).
2. PROVED: an l2-l2 operator bound of the full reflected row matrix with unimodular entries cannot be below the
   K-branch. Other uses of duality (A-side vector-specific, split rows, d' <= M) are not covered.
3. ARGUED: a low estimate that depends on the target only through moduli has B >= 1 (alignment with the Liouville
   twist); this requires G + k_dir/2 >= h/r in the unreflected system, and the polar term supplies it.
4. Below 1 - 1/r needs an estimate outside items 1 and 2. With the polar term kept, deleting the K-loss alone
   gives 31/36 and no vertex with h > 1; deleting H0 alone gives 13/15 (no gain); deleting all range losses gives
   an inconsistent system, so a full mean square Sum |B_m|^2 << Q^{1+eps} for all Q P > Z is false for long marks
   or the model fails there.
No statement about zeros of zeta. 7/8 (unrefereed) and 0.874886647 are unchanged.

## 6. For the map row Z15c proposed in section 8

The label Z15c is already taken (pair probe, `c6-pair-probe-bridge-order2`). If a row is entered, it needs a new
label, the corrections E1 to E3 in its text, the ARGUED label on the G = 0 sentence, and "l2-l2 bound of the full
reflected matrix" in place of "any operator-norm bound".
