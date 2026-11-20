#!/usr/bin/env python3
"""Statement O version 5.1 = version 5 (not edited) + corrections C2, C4 of the campaign referee of the c20 record lane
+ source notes for lines 1, 5, 7 + one written statement of MV-CAP (line 10). Anchored replacements, each anchor once."""
import os, difflib, shutil
B = 'tmp/research-2026-11-16'
SRC = os.path.join(B, 'push/c20-repair-owed-record-r19-statement-o-v5/STATEMENT_O_v5.md')
HERE = os.path.dirname(os.path.abspath(__file__))
t0 = open(SRC, encoding='utf-8').read(); t = t0
def rep(a, b, count=1):
    global t
    assert t.count(a) == count, (t.count(a), a[:70])
    t = t.replace(a, b)
ING = ("(version 5.1, source opened) The deduction was opened in a written proof: V. Starichkova, \"A note on zero-density approaches for the difference between "
       "consecutive primes\", arXiv:2411.01845v1 (preprint; PDF read, sha256 968dee94...; the journal version was not opened). Its Theorem 2.1 restates Ingham 1937, Theorem 1: "
       "if zeta has no zeros in sigma > 1 - A log log t/log t for t > t_0 and N(sigma, T) = O(T^(b(1 - sigma)) log^B T) uniformly in 1/2 <= sigma <= 1, then "
       "pi(x) - pi(x - x^theta) ~ x^theta/log x for 1 - 1/(b + B/A) < theta < 1 (displays (6), (7)), and remarks that A can be taken arbitrarily large, so the range is theta > 1 - 1/b. "
       "Its Theorem 2.3 is a generalisation with a full proof: truncated explicit formula (13), the bound abs((x^rho - (x - y)^rho)/rho) <= 2 y x^(beta - 1) (14), "
       "sum over abs(gamma) <= T of x^(beta - 1) = 2 x^-1 N(0, T) + 2 int N(sigma, T) x^(sigma - 1) log x d sigma (15), the density bound and the zero-free region in (17), T = (x/y) log^(delta/2) x. "
       "With Huxley's b = 12/5 this is the asymptotic for theta > 7/12. The form S(theta) used here (a lower bound c y^theta/log y for pi(y + y^theta) - pi(y)) follows by covering "
       "[y, y + y^theta] with disjoint intervals [x_j - x_j^theta1, x_j], 7/12 < theta1 < theta (one line; this record's remark, not in the source). What stays relative: Ingham 1937 itself was not opened; "
       "the proof read is in a preprint and quotes three inputs that were not opened here (the truncated explicit formula in Wolke's form, a zero-free region of Littlewood or Vinogradov-Korobov strength, "
       "which condition (10) needs when B > 0, and Titchmarsh Theorems 9.4, 10.7); the passage from psi to pi is not written out in it.")
# header
rep('# Statement O, version 5: record of obstructions\n',
    '# Statement O, version 5.1: record of obstructions\n\n'
    '**Version 5.1, 2026-11-20 (lane `c21-record-engine-states-statement-o-v5-br-nodes`; record lane, no attack). Decision: version 5 is ACCEPTED as the current '
    'text of the record, in this corrected form.** Basis: the campaign referee of the lane that wrote version 5 re-derived lines 13 to 17 on new cases and holds the four '
    'relabels with corrections C1 to C5 (`push/c20-repair-owed-record-r19-statement-o-v5/REFEREE.md`, sections 1 and 4). Of these, C2 and C4 concern this file and are entered '
    'below; C1 (a heading of STRATEGY), C3 (who wrote the referee fields of a lane line) and C5 (two counts in the RESULT file of that lane) concern other files and are '
    'registered in `campaign/CORRECTIONS_R20.md`. This file is `push/c20-repair-owed-record-r19-statement-o-v5/STATEMENT_O_v5.md` (not edited) with the following changes, '
    'each marked "(version 5.1" in place: (i) line 13, the word "simple" in the construction field (C4); (ii) line 17, "for the optimal c" at the reflection parenthesis, '
    'in the step field and the Label bullet (C2); (iii) lines 1, 5 and 7, the source of the deduction "density estimate implies primes in short intervals": opened in a written '
    'proof (a preprint that restates Ingham 1937, Theorem 1); Ingham 1937 itself not opened; (iv) line 10, one written statement of MV-CAP with its hypothesis H_W. '
    'No label changes: PROVED 8 (lines 3, 6, 8, 9, 13, 14, 16, 17, each in its narrowed form), PROVED relative to a cited theorem 1 (line 5), MEASURED 1 (line 2), ARGUED 7 '
    '(lines 1, 4, 7, 10, 11, 12, 15). The owed text repairs of round 20 ("Liouville passes", Lemma P -> P\', "d even" for X(d), NL(d)) have no occurrence in this file '
    '(checked by search); they are entered in the campaign and engine files and proposed for the lane files. No line is added for the records of rounds 17 to 20. '
    'No line is a statement about zeros of zeta.\n')
# C4
rep('g1 < g2 ordinates of two zeros of zeta on the line,\n',
    'g1 < g2 ordinates of two simple zeros of zeta on the line (version 5.1, C4: simplicity is used for the cancellation of the poles of m and for the defect bound; it holds for every pair used),\n')
# C2
rep('(L^2/(8T) for the reflection\n  translate).',
    '(L^2/(8T) for the reflection\n  translate; version 5.1, C2: for the optimal c only, see the Label bullet).')
rep('  **(version 5) PROVED to leading order** under the label rule, in the form the second referee file confirms. Second file:',
    '  **(version 5.1, C2)** The value L^2/(8T) of the reflection parenthesis is an optimum over c: it is the defect when Psi(c) is offset from a multiple of 2 pi by L^2/(8T), '
    'so that the phase range is symmetric about 0; with Psi(c) = 0 mod 2 pi the defect is L^2/(4T) (campaign referee of the version-5 lane: 0.02012 at T = 20000, L = 40, against 0.01012 at the optimal offset). '
    'The label below stands for the main clause; the parenthesis is "for the optimal c".\n'
    '  **(version 5) PROVED to leading order** under the label rule, in the form the second referee file confirms. Second file:')
# sources, lines 1, 5, 7
rep('- **Owed.** (reader pass) The text of Ingham 1937 or of a textbook proof of "density estimate (1.5) implies\n',
    '- **Source of S(theta).** ' + ING + '\n- **Owed.** (version 5.1: the item that follows is discharged in the form "a written proof was opened"; the primary text of Ingham 1937 stays unopened and is cited as "relative to") (reader pass) The text of Ingham 1937 or of a textbook proof of "density estimate (1.5) implies\n')
rep('- **Owed.** (reader pass) The text of Ingham 1937 or of a textbook proof of the deduction (shared with lines 1\n',
    '- **Source of S(theta) (version 5.1).** As in line 1, field "Source of S(theta)": the deduction was opened in arXiv:2411.01845v1 (Theorem 2.1 = Ingham 1937, Theorem 1, restated; Theorem 2.3 with proof); '
    'Ingham 1937 not opened. The label stays "PROVED relative to S(theta)": S(theta) now rests on Huxley 1972 (1.5) (opened in version 3) and on a proof read in a preprint with three quoted inputs not opened.\n'
    '- **Owed.** (version 5.1: discharged in the form "a written proof was opened"; see the field above) (reader pass) The text of Ingham 1937 or of a textbook proof of the deduction (shared with lines 1\n')
rep('- **Owed.** Recorded as "relative to" (round-9 lesson 7): the primary source for the ray-class short-interval\n',
    '- **Source note (version 5.1).** For the rational case the deduction from the density estimate was opened (line 1, field "Source of S(theta)"). The ray-class variant (Coleman 1990) is unchanged: not opened.\n'
    '- **Owed.** Recorded as "relative to" (round-9 lesson 7): the primary source for the ray-class short-interval\n')
# MV-CAP
MV = ('- **Statement of MV-CAP in the form used (version 5.1; written once here; ARGUED: it is the content of Theorem 2 of `b-mvcap-function-side` as held by its one referee, restated; no second referee).**\n'
      '  Hypothesis H_W(c, h): every zero of zeta with abs(Im rho - c) <= h lies on the critical line and is simple, and c +- h are not ordinates. (True when c + h is below the verified height; not known for any window above about 3e12.)\n'
      '  Statement. Assume H_W(c, h + 1) with h between 500 and 1000 (the referee\'s correction: the constant 2.44 needs h >= 500) and c in the range of the lane, 3.1e12 to 7.5e16. Then there is a function F_c = zeta R_c '
      '(cluster lift: R_c rational in s(1 - s), real on the real axis) with: (a) zeta\'s functional equation, reality, order one and the pole at 1; (b) the zeros of zeta outside the window and at least one conjugate pair of '
      'zeros off the line inside it, with abs(N_F(T) - N(T)) <= 1 for all T and N_F(sigma\', T) = N(sigma\', T) for each fixed sigma\' > 1/2 once the pair is close enough to the line; '
      '(c) sup over Re s >= sigma of abs(F_c/zeta - 1) <= 2E + E^2, with E <= 2.44 abs(Z(t_m)) (c/2 pi)^(-(sigma - 1/2)/2) at sigma = 2 (E <= 8.7e-6 at the bottom of the range and 3.3e-8 at the top, from an explicit bound for zeta on the line).\n'
      '  Consequence (the cap). Let P be a premise of one of the forms: a weighted mean square int w(t) abs(A F)(sigma\' + it)^2 dt within [main - E_1, main + E_1] with w >= 0, A a Dirichlet polynomial and sigma\' >= sigma > 1; '
      'a pointwise bound for F, log F or F\'/F on Re s >= sigma\' with relative room; a bound for N_F(T), for N_F(sigma\', T) or for the count of critical zeros with room of 1, 0 and 2 zeros respectively. '
      'If zeta satisfies P with relative room above 2E + E^2 (function side) or with the stated room (zero side), then F_c satisfies P as well. A set of such premises therefore does not imply "no zero off the line in the window". '
      'Lifts in disjoint windows multiply and their sensitivities add.\n'
      '  What the statement does not cover. (1) It is conditional on H_W for the window: above the verified height it is a conditional theorem, not a control on file. (2) Function-side premises are on half-planes Re s >= sigma > 1; '
      'premises on the critical line are covered on the central half-window only (Proposition 2\' of the lane: abs(Z_F - Z) <= 1.6 abs(Z(t_m))), and moments on 1/2 <= sigma <= 1 are not covered by Theorem 2. '
      '(3) A premise that holds at zeta with relative room below about 2.4 abs(Z(t_m)) (c/2 pi)^(-(sigma - 1/2)/2) is not capped. (4) Family sums (rows P23, Q25) and densities (rows Z17, Q18) are separate elementary remarks: '
      'a non-negative family sum bounds no single member, and N(sigma, T) = o(N(T)) is a proportion. The map uses "MV-CAP" for (c) with the consequence and for these remarks together; only (c) with the consequence is a theorem on file.\n'
      '  Not on file: a version without H_W. A candidate is the control ZQ of line 13 placed at two simple on-line zeros near height T (m - 1 is of size (eta^2 + d^2)/abs((u - gbar)^2 - d^2) at ordinate u away from the pair), '
      'which needs only the existence of such zeros near every large T (a positive proportion of zeros is simple and on the line: classical, recalled, not opened). This is a remark of the record lane, not derived in full and not refereed.\n')
rep('- **Label.** ARGUED, relative to hypothesis H_W (not known for any lane window above 3e12) and to\n', MV + '- **Label.** ARGUED, relative to hypothesis H_W (not known for any lane window above 3e12) and to\n')
rep('- **Owed.** One statement of MV-CAP in the form used, with two referees; the density half of P50.',
    '- **Owed.** (version 5.1: the statement is written above) Two referees for that statement; the density half of P50; a version without H_W.')
out = os.path.join(HERE, 'STATEMENT_O_v5_1.md')
open(out, 'w', encoding='utf-8').write(t)
d = list(difflib.unified_diff(t0.split('\n'), t.split('\n'), 'STATEMENT_O_v5.md', 'STATEMENT_O_v5_1.md', lineterm='', n=1))
open(os.path.join(HERE, 'statement_o_v5_v5_1.diff'), 'w', encoding='utf-8').write('\n'.join(d) + '\n')
print('lines', len(t0.split('\n')), '->', len(t.split('\n')), '; diff hunks', sum(1 for x in d if x.startswith('@@')), '; added', sum(1 for x in d if x.startswith('+') and not x.startswith('+++')), 'removed', sum(1 for x in d if x.startswith('-') and not x.startswith('---')))
for w in ('Liouville passes', 'X(d)', 'NL(d)', 'Lemma P '):
    print(repr(w), t0.count(w))
camp = os.path.join(B, 'campaign', 'STATEMENT_O.md')
assert not os.path.exists(camp)
shutil.copy2(out, camp); print('copied to', camp)
