# Builds STATEMENT_O_v3.md (reader pass) from the first writing of version 3. Text only; each patch must match once.
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'c11-repair-del-referee-record', 'STATEMENT_O_v3.md')
t = open(SRC, encoding='utf-8').read()
n = 0
def rep(old, new):
    global t, n
    assert t.count(old) == 1, (t.count(old), old[:70])
    t = t.replace(old, new); n += 1

SRCNOTE = ('Huxley 1972 was opened (Invent. Math. 15, 164-170, scan read): the text states the gap '
           'bound p_(n+1) - p_n < p_n^delta for delta > 7/12 (1.1, 1.3) and the density estimate N(alpha, T) << '
           'T^((12/5)(1 - alpha)) log^B T uniformly in 1/2 <= alpha <= 1 ((1.5) with lambda = 12/5, from (1.7), (1.8)), and says '
           'that (1.5) implies (1.1) "after Ingham"; it does not state a count of primes in short intervals. The counting '
           'statement S(theta) is the intermediate statement of Ingham\'s deduction (Ingham 1937, not opened; recalled)')

rep('# Statement O, version 3: record of obstructions\n',
    '# Statement O, version 3: record of obstructions\n\n'
    '**Version 3, reader pass of 2026-11-19 (lane `c12-repair-sources-statement-o-v3`).** This file is the current text of\n'
    'Statement O; map row O1 points to it. It replaces `push/c9-obstruction-record-statement/STATEMENT_O.md` (not edited)\n'
    'and the first writing of version 3 in `push/c11-repair-del-referee-record/STATEMENT_O_v3.md` (not edited). The reader\n'
    'is a lane that wrote neither version 3 nor the second referee file of the DEL lane, which is the reader that the\n'
    'first writing said was missing. Changes of the reader pass, each marked "(reader pass)" in place:\n'
    '(a) source labels of lines 1, 5 and 7. ' + SRCNOTE + '. Every "relative to Huxley 1972" now reads\n'
    '"relative to S(theta)", with the source chain stated; the label of line 5 stays "PROVED relative to a cited theorem";\n'
    '(b) line 5 and section C row 2a carry the corrected device count for DEL: 11 device types pass (6 in full, 5 in part)\n'
    'and 23 do not (`c11-del-device-read-confirm/DEVICE_READ_V2.md`; recounted by the reader, one changed cell re-read);\n'
    '(c) section C row 3 cites P36 for E_a, and P36 is not cited for DEL or B;\n'
    '(d) the uniqueness statements used in line 9 and in the input-level paragraph of section C are now relative to opened\n'
    'texts (Hamburger 1921, Satz 1 with hypothesis d\'; Kaczorowski-Perelli 1999, Theorems 2 and 3);\n'
    '(e) line 3 names T-NR as the control that keeps the degree-one gamma factor (it lacks POS at one prime).\n'
    'Lines 2, 4, 6, 8, 10, 11, 12 and section A are unchanged; sections D and E have one source phrase reworded each. Count unchanged: PROVED 4, PROVED relative to a cited\n'
    'theorem 1, MEASURED 1, ARGUED 6. The statements remain separate conditional statements, one per read class; there is\n'
    'no joint clause. No line is a statement about zeros of zeta.\n\n'
    '*Header of version 3 as first written follows (its sentences on the unopened primary text and on the missing reader\n'
    'describe the state before the reader pass).*\n')

rep('cited theorem 1 (line 5: two referee files on the closing step, conditional on Huxley 1972, primary text not\nopened);',
    'cited theorem 1 (line 5: two referee files on the closing step, conditional on the counting statement S(theta);\n'
    'reader pass: Huxley 1972 opened, it supplies the density estimate, and the counting form is Ingham\'s deduction, not opened);')

rep('Floor: nothing below 1. Relative to Huxley 1972.\n',
    'Floor: nothing below 1. Relative to S(theta) (line 5, mode field).\n')

rep('relative to\n  Huxley 1972 (asymptotic pi(x) - pi(x - x^theta) ~ x^theta/log x for theta > 7/12; statement read in two\n  secondary sources, primary text not opened). Statement (Z-2)',
    'relative to\n  S(theta) as stated in line 5 (reader pass: ' + SRCNOTE + '). Statement (Z-2)')

rep('- **Owed.** The primary text of one short-interval theorem (shared with lines 5 and 7). A second pass on P9 or P23',
    '- **Owed.** (reader pass) The text of Ingham 1937 or of a textbook proof of "density estimate (1.5) implies\n'
    '  pi(x + x^theta) - pi(x) ~ x^theta/log x for theta > 1 - 1/lambda" (shared with lines 5 and 7); the primary text of\n'
    '  Huxley 1972 is no longer owed. A second pass on P9 or P23')

rep('source Huxley 1972 (asymptotic\n  pi(x) - pi(x - x^theta) ~ x^theta/log x for theta > 7/12), statement read in two secondary sources (the article\n'
    '  "Prime gap" of Wikipedia, by the lane; the introduction of arXiv:2308.04458v8, by the second referee), primary\n  text not opened. Without that theorem,',
    'source chain (reader pass):\n  ' + SRCNOTE + '; the asymptotic\n'
    '  pi(x) - pi(x - x^theta) ~ x^theta/log x for theta > 7/12 is attributed to Huxley in two secondary sources (the article\n'
    '  "Prime gap" of Wikipedia, read by the lane; the introduction of arXiv:2308.04458v8, read by the second referee)\n'
    '  and is that deduction applied to (1.5). S(theta) needs only some theta < 1 and a positive proportion, so any\n'
    '  theorem of Hoheisel type suffices. Without S(theta),')

rep('- **Label.** PROVED relative to Huxley 1972 (two referee files cover the closing step: membership of DEL_b in R\n'
    '  and the simple zero at b; the cited theorem is classical and its primary text was not opened, so the label is\n'
    '  not PROVED outright).',
    '- **Label.** PROVED relative to S(theta) (two referee files cover the closing step: membership of DEL_b in R\n'
    '  and the simple zero at b). Reader pass: the density estimate behind S(theta) was read in the primary text\n'
    '  (Huxley 1972, (1.5) with lambda = 12/5); the deduction of the counting form from it (Ingham 1937) was not opened,\n'
    '  so the label is not PROVED outright. The reader re-read the closing step of the second referee file (factor\n'
    '  (s - b) from exp(-E_1(w)) = e^gamma w exp(-Ein(w)); zeta(b) finite and non-zero on (0, 1)) and found it in order.')

rep('- **Owed.** The primary text of one short-interval theorem (shared with lines 1 and 7). A reader between the\n'
    '  second referee file and this version. The debt',
    '- **Device read (reader pass).** Of the 34 device types of `engine/curated/devices.json` (state of round 10), DEL\n'
    '  passes 11 (6 in full, 5 in part) and does not pass 23 (2 hold only in a transferred form, 1 not established,\n'
    '  19 not formulable, 1 fails): `c11-del-device-read-confirm/DEVICE_READ_V2.md`, which corrects the tally 14 / 20 of\n'
    '  the DEL lane in three cells (`dual-measure-compactness`, `twisted-discrepancy`, `laurent-shell-gamma-section`).\n'
    '  The table is argued from map rows and lane text, with the author\'s check only; the reader recounted the codes\n'
    '  (6 + 5 and 2 + 1 + 19 + 1) and re-read the first changed cell against `e1-cofinal-legendre-dual` (separating step:\n'
    '  Lambda_a >= 0 with logarithmic discrepancy; "E_a passes every step"). The count is a description of the record,\n'
    '  not an input of this line.\n'
    '- **Owed.** (reader pass) The text of Ingham 1937 or of a textbook proof of the deduction (shared with lines 1\n'
    '  and 7). The reader between the second referee file and version 3 is supplied by this pass. The debt')

rep('relative to a short-interval prime theorem in counting form (Huxley\'s asymptotic, classical,\n  not opened;',
    'relative to a short-interval prime theorem in counting form (reader pass: the asymptotic attributed to\n'
    '  Huxley is Ingham\'s deduction from the density estimate of Huxley 1972; the estimate was opened, the deduction was not;')

rep('No floor from R alone. The twin says nothing about devices that use FE (Hamburger uniqueness).',
    'No floor from R alone. The twin says nothing about devices that use FE (Hamburger uniqueness; reader pass:\n'
    '  Hamburger 1921, Math. Z. 10, 240-241, opened: f with finitely many poles, of finite order, given by an absolutely\n'
    '  convergent Dirichlet series for sigma > 1, with f(s) Gamma(s/2) pi^(-s/2) = g(1 - s) Gamma((1 - s)/2) pi^(-(1-s)/2)\n'
    '  and g(1 - s) an absolutely convergent Dirichlet series in some half-plane sigma < -alpha, is a constant multiple\n'
    '  of zeta, and g = f).')

rep('FE with INT is Hamburger uniqueness, a read class containing zeta alone.',
    'FE with INT is Hamburger uniqueness, a read class containing zeta alone (reader pass: relative to Hamburger 1921,\n'
    'Satz 1 with hypothesis d\', opened; the series for f must converge absolutely for sigma > 1, not only in some\n'
    'half-plane. For other conductors: Kaczorowski-Perelli 1999, Theorems 2 and 3, opened: a function of degree one\n'
    'in the extended class has a(n) n^(i theta) periodic mod q and is a combination of P_chi(s + i theta)\n'
    'L(s + i theta, chi*) with Dirichlet polynomials P_chi; with the Euler-product axiom it is zeta or\n'
    'L(s + i theta, chi), chi primitive. So in degree one FE with INT implies PER, and no control keeps the Euler\n'
    'product with logarithmic coefficients O(n^theta), theta < 1/2, zeta\'s functional equation and INT while dropping PER;\n'
    '`c11-del-device-read-confirm` item 3, now relative to opened texts).')

rep('the DEL lane (lines 1 and 5), relative to Huxley 1972 (', 'the DEL lane (lines 1 and 5), relative to S(theta) (')

rep('short-interval prime theorem for lines 1, 5 and 7, primary text not opened; hypothesis H_W for line 10).',
    'short-interval prime theorem for lines 1, 5 and 7; reader pass: the density estimate of Huxley 1972 opened, the\n'
    '  deduction of the counting form not opened; hypothesis H_W for line 10).')

# section C rows
rep('| P46, P51; control row DEL (P36, cited by the previous text for B, is not cited for DEL; `c11-del-device-read-confirm` proposes to cite it in row 3 for E_a: not applied, that lane has no independent referee) |',
    '| P46, P51; control row DEL. (reader pass) P36 is cited in row 3 for E_a and not here. Device count for DEL: 11 of 34 device types pass, 23 do not (line 5, device read) |')
rep('| E_a (global); NR (one prime) | (Z) | 3, 6 | Z16, P25, P14, Z18 |',
    '| E_a (global); NR (one prime) | (Z) | 3, 6 | Z16, P25, P14, Z18; (reader pass) P36 for E_a (lane `e1-cofinal-legendre-dual`: the separating step is Lambda_a >= 0 with logarithmic discrepancy and E_a passes every step) |')

# line 3: T-NR note
rep('- **Owed.** None for the closing step in the proved form. A referee on lane `bootstrap` for the ZF(theta) part.',
    '  (reader pass) The functional equation of E_a has degree 2. The control on file that keeps zeta\'s own gamma\n'
    '  factor and an Euler-type product is T-NR (line 6); it lacks POS at its one prime. No control on file keeps POS,\n'
    '  EP and the degree-one functional equation with integer frequencies: by the degree-one classification (section C,\n'
    '  input-level paragraph) such a function with logarithmic coefficients O(n^theta), theta < 1/2, is zeta. A device that\n'
    '  reads POS and the degree-one gamma factor in one step is therefore outside the class of this line and of line 6,\n'
    '  and is tested by E_a and T-NR separately (`c12-repair-sources-statement-o-v3/REFEREE2.md`, R-3).\n'
    '- **Owed.** None for the closing step in the proved form. A referee on lane `bootstrap` for the ZF(theta) part.')

open(os.path.join(HERE, 'STATEMENT_O_v3.md'), 'w', encoding='utf-8').write(t)
print('patches applied:', n, 'bytes:', len(t.encode('utf-8')))
