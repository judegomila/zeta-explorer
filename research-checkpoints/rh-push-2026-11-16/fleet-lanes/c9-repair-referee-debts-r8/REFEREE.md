# REFEREE (adversarial, lens: general) for `c9-repair-referee-debts-r8`

2026-11-18. Target: RESULT.md of this directory and its six REFEREE2 files. Claimed verdict: partial-result (repair
lane, no attack, no statement about zeros). Only this file was written. Server not used. Local runs through
`scripts/memcap.sh 8` (the lane's `ref2_form.py` with a different bound; one own script, mpmath, kept outside the
repo). One external request (arXiv abstract page, generic client, no project details).

## Verdict

**Holds, with two corrections to the text (E1, E2) and three narrowings (N1 to N3).** No PROVED step failed
re-derivation. No statement about zeros of zeta is made; nothing assumes RH as an input to a claimed result
(Theorem 2 is labelled conditional on family GRH and circular); nothing restates verified height; no classical
theorem is presented as new. Flags, set here: R1 = R2 = R3 = R4 = false.

## What was re-derived

| item | check | outcome |
|---|---|---|
| 1a kernel | U(c, c') = 6 chi_c'(-1) 1_{eps(c) = eps(c')}; with f = h, s R = (-1)^(f(e+g)) = phi(x) phi(y); R(x, x) is a character of the class group (R(xy, xy) = R(x, x) R(y, y) R(x, y)^2), so agreement with chi_.(-1) on prime classes extends to all squarefree c | holds |
| 1a numeric, different case | `ref2_form.py 7000`: 899 primes, **all 108 classes mod 36** (the lane's run had 107), blocks 18 x 6, exact factorisation True, rank 6, least eigenvalue -2.6e-13; R alone 2 positive / 2 negative | holds |
| 1b Lemma 1 | re-derived here line by line (CRT split r = r_1 c_1' + r_2 c_1; second factor = q^(1/2) conj(gt_1(-k, c_1')); prefactor q_d^(-1) (q_c1 q_c1')^(-1/2); Gaussian argument) | holds |
| 2a Step 5 | sum over d | g of q_d^(-1) abs(r_d(g/d)) = prod (1 + a_p), a_p = 1/q_p or 1 - 1/q_p; exponent of q_d: -2 - eps, then -1 after h -> g | holds |
| 2b source | arXiv:1112.1650: title, authors, single version v1 confirmed on the abstract page. The PDF was not read by this referee | bibliographic part holds; line-by-line reading not replayed |
| 3a G_chi | (c, d), (-c, -d) cancel for odd chi. Own case mod 7, z = 0.31 + 0.7i, w = 1.4: odd characters 9e-17 to 2e-15, even ones 1.376, 1.213, 1.213 | holds |
| 3b Lemma 3 | own case p = 3, r = 0.3, second zero (abs(tau)^2 = 1.409): ratio left / (2 (p+1) norm^2) = 0.63, 6.3, 62.9 at y0 = 50, 500, 5000. Linear in y0, as stated. The lane's proof drops the count over gamma | holds: Lemma 3 as written is false |
| 3c Lemma 5 | substitution u = e^s y gives e^(-(2 sigma - 1) s); T_p factor p^(2 sigma - 1/2) + p^(1/2 - 2 sigma) | holds |
| 4a B, B', B'' | all three re-derived; in B'' the row-count identity sum_k abs(I_k)^(1/2) x_k = sum_m sum_{k: m in I_k} abs(I_k)^(-1/2) x_k and the column partition per row are correct | holds |
| 4b monomial Lemma 2 | main terms, Kusmin-Landau range (abs(f') <= 3/4), count O(T^(1/4) log T) re-derived. Own cases to T = 2500: q = 1/5, a = -1.3: mean 1.11507 + 0.43239i against 1.11963 + 0.43092i (diff 0.0048, 1344 poles); q = 3/2, a = 0.4: 1.0011 + 0.0008i against 1 (2121 poles) | holds |
| 3d, 6 engine | IDEA_GRAPH.json: 1,623 nodes, 8,806 edges; node `hecke-correspondence-recurrence` and `ctl-EISW` present; `curated/controls.json` present; log section present; 12,165 + 29,494 = 41,659 | holds |

## Errors

**E1 (misreported range).** RESULT section 4 ("four new cases agree to 0.0005 - 0.0027") and the monomial REFEREE2
section 2 ("differences 0.0005 to 0.0027 at all three cut-offs"). `ref3_monomial.log` has 0.0063 (q = 2/3, T = 1000)
and 0.0032 (same case, T = 2000). Correct range over all cut-offs: 0.0005 to 0.0063; at T = 4000: 0.0005 to 0.0018.
All values are inside the stated O(T^(1/4) log T / N); no conclusion changes.

**E2 (citation, affects the corrected Abel error term).** The remainder O(t^(-1/4)) is attributed to Titchmarsh
Theorem 4.13 at sigma = 1/2, x = y. Theorem 4.13 has the remainder O(x^(-sigma) log t) + O(t^(1/2 - sigma) y^(sigma - 1)),
that is O(t^(-1/4) log t) there. The clean O(t^(-1/4)) is the Riemann-Siegel form (Theorem 4.16). With the source as
cited the Abel error proved is O(delta^(-3/4) log(1/delta)) (and the Cesaro remainder O(N T^(-1/4) log T)); with 4.16 it
is O(delta^(-3/4)) as written. The limit and the correction of the round-7 line (not delta^(-1/4 - eps)) are unaffected.

## Narrowings

**N1 ("decided: positive semidefinite").** The exact identity is for the class kernel R x (unit sum) that the
referee derived from Lemma 1; it is not an evaluation of the lane's second moment. It decides the sign of the
sixth-power term only at leading order (g = d = e = 1, Gaussian factor constant on the pair (c_1, c_1')). After the
Mellin separation the bilinear expression M(s) conj(M(conj s)) is integrated against Gamma(s) on a vertical line,
which is not a positive weight, and the Gaussian exp(-kappa X q_k/(q_d q_c q_c')) is not shown to be a positive
kernel in (c, c'). The REFEREE2 file says this in its scope paragraph; the table line 1a of RESULT and the claim
line should carry "at leading order" next to "decided". The correction of the lane's line (signature (2, 2) is that
of R alone) stands without qualification.

**N2 ("Lemma 1 holds (two referees)").** The second pass states that it did not re-derive Lemma 1 line by line. The
count of referees for Lemma 1 was one plus a partial reading. This file supplies a full re-derivation, so the
statement now holds; the label in RESULT was ahead of the work.

**N3 (statements written by the lane with no referee before this file).** B' and B'' are re-derived here and hold.
The mark-slot count and the cube-part bound of Theorem 2 were read: the exponent arithmetic closes
(X (K/N + K^(1/6)/Z) with K = N^2/X; sum of 1/q_n over q_n^3 <= 12 Z is O(log Z)), and both stay OUTLINE under family
GRH. (S1) to (S4) for non-monomial m are a plan; nothing there is labelled PROVED and none was checked as a proof.
The twist insertion in Lemma S was not replayed against the PDF by this referee: it stays one line-by-line reading
(the lane's) of one arXiv version, journal text unopened, as the lane states.

## Controls

No zeta-only mechanism is claimed, so no control has to fail. Checked where controls enter: the kernel of item 1
is target-independent (holds for every vector); Proposition B is target-independent; the monomial Lemma 2 uses only
an approximate functional equation; the Hecke device is passed by EIS-w at every step, and the DH object is the zero
function for odd characters (confirmed mod 5 by the lane, mod 7 here), so DH is "not run", not "fails".

## Engine remarks (not errors of mathematics)

- The device `hecke-correspondence-recurrence` is closed on the corrected statement while
  `outcomes/c8-hecke-entropy-resonance-rigidity.json` still has refereeHolds false and engineVerdict open. The lane
  declares this; the learn step has to reconcile before the next generation run.
- Closing the Landau-Siegel device for the height aspect is a choice, logged with a reopening rule. It changes the
  scored count (11,561 to 12,165) with no change in the top 60 device split.

## Requirement flags (strict)

| flag | value | reason |
|---|---|---|
| R1 | false | no attack; the checked statements hold for non-multiplicative vectors or are identities of a control |
| R2 | false | no conclusion in height |
| R3 | false | EIS-w passes the only device examined; other statements are control-independent |
| R4 | false | nothing concerns the critical line |

## Surviving claim

Repair lane, no statement about zeros. The (E-K) sixth-power class kernel (reciprocity factor times unit sum) is
6 times a sum of six rank-one squares on the 108 classes mod 36, so the sixth-power term is non-negative at leading
order and the lane's "signature (2, 2)" line is wrong. Lemma 1 holds. Theorem 2 is a conditional outline. Step 5 of
the Liouville Theorem A holds; the twist insertion rests on one reading of arXiv:1112.1650v1. Hecke lane: G_chi is
zero for odd characters, Lemma 3 with the pair count is false high in the cusp (ratio linear in the height), Lemma 5
has factor e^(-(2 sigma - 1) s). Proposition B, B' hold; B'' holds under lower flatness of A. Monomial Lemma 2 holds
for Cesaro means; the Abel error is O(delta^(-3/4)) up to a logarithm depending on the form of the approximate
functional equation cited. Non-monomial Lemma 2, THIN primary source, outline debts 10, 2, 4: open. Engine counts as
stated.
