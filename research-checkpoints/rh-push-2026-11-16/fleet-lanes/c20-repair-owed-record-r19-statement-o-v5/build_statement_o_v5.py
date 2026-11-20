#!/usr/bin/env python3
"""Statement O, version 5 (lane c20-repair-owed-record-r19-statement-o-v5). New file STATEMENT_O_v5.md in this directory.
Input: push/c16-repair-owed-record-r15/STATEMENT_O_v4.md (not edited). Changes: the title line, a version-5 header, and
the Label bullet of lines 13, 14, 16, 17. Line 15 and every other line of version 4 are copied unchanged (checked below
by a diff count). Every sentence quoted from a referee file is checked to occur in that file (whitespace and backticks
normalised) before the file is written."""
import os, re, difflib
HERE = os.path.dirname(os.path.abspath(__file__))
PUSH = os.path.normpath(os.path.join(HERE, '..'))
ME = 'c20-repair-owed-record-r19-statement-o-v5'
V4 = os.path.join(PUSH, 'c16-repair-owed-record-r15', 'STATEMENT_O_v4.md')
R16 = 'c16-referee-r15-j1prime-u8-screening'
F_ZQ = R16 + '/REFEREE2_control-zq.md'
F_C15 = R16 + '/REFEREE2_c15-control-with-zeta-fe-classes-u1-u2.md'
F_U5 = R16 + '/REFEREE2_c15-u5-window-count-threshold-translate-control.md'
F_RR = R16 + '/REFEREE.md'
F_U4 = 'c18-u4-group-law-left-of-one-torus-orbit/REFEREE.md'
norm = lambda t: re.sub(r'\s+', ' ', t.replace('`', '').replace('**', '')).strip()
cache = {}
def q(path, sentence):
    """return the sentence in quotes after checking it occurs in the file"""
    if path not in cache:
        cache[path] = norm(open(os.path.join(PUSH, path), encoding='utf-8').read())
    assert norm(sentence) in cache[path], (path, sentence[:80])
    return '"' + norm(sentence) + '"'
s = open(V4, encoding='utf-8').read()
v4_lines = s.split('\n')

# ---------------------------------------------------------------- label bullets
L13_old = ("- **Label.** Construction and defect bound: PROVED in the lane, re-derived by the referee; MEASURED on the pairs\n"
           "  (1, 2), (6709, 6710) and, by the referee, (298, 299). One referee file: ARGUED under the label rule.")
L13_new = (L13_old.replace(" One referee file: ARGUED under the label rule.", " (Version 4: one referee file, ARGUED under the label rule.)") + "\n"
 "  **(version 5) PROVED** under the label rule, in the form the second referee file confirms. Second file:\n"
 "  `push/" + F_ZQ + "` (own derivation, own code, zero pairs (922, 923) and (34, 35)), which is also the second\n"
 "  report for the lane (`push/" + F_C15 + "`). Sentences that cover the closing step, checked against the\n"
 "  fields above: functional equation, " + q(F_ZQ, "m is a function of `(s - 1/2)^2`, so `m(s) = m(1 - s)`; Lemma A is the quotient of two solutions") + ";\n"
 "  zeros, " + q(F_ZQ, "argument principle: rectangle right of the line around gbar: ZQ 1, zeta 0; rectangle across the line: 2 and 2 (both pairs)") + ";\n"
 "  atoms, " + q(F_ZQ, "`Lambda_ZQ = Lambda + D(x) dx` with `D(x) = -4 x^(-1/2) cos(gbar L)(cosh(eta L) - cos(d L))`, `L = log x`: no point mass is added or changed") + ";\n"
 "  defect bound, " + q(F_ZQ, "holds: `sup abs D <= 8 e^-2 (eta^2 + d^2)/(1/2 - eta)^2`") + "; count,\n"
 "  " + q(F_ZQ, "Referees for ZQ (functional equation, atoms, defect bound, Lemma L with the pole clause): 2 independent (first referee; this file).") + "\n"
 "  Form confirmed: the words \"every atom is zeta's\" hold in the reading \"on the atoms\" (ZQ is not an Euler product; second\n"
 "  file, correction 3). Not covered by the second file, and not relabelled: the clause \"the infimum over the family is 0\" of\n"
 "  the field Mode and floor stays relative to a recalled classical input, in the form of the second file's correction 2\n"
 "  (" + q(F_ZQ, "a positive proportion of the zeros are simple and on the line (CLASSICAL: Selberg; Levinson's method for simplicity)") + ");\n"
 "  the paper runs of ZQ against rows Z34, Z36, P53 stay ARGUED (" + q(F_ZQ, "Sections 5 and 6 of the lane (paper runs against rows Z34, Z36, P53) were not re-run by me.") + ").\n"
 "  The second file works in 30-digit floating point with argument-principle counts, not interval arithmetic; the second pass\n"
 "  was not blind to the first. The first item of the field Owed below is discharged by this file; the second is not.")
L14_old = ("- **Label.** PROVED in the lane, re-derived by the referee; MEASURED at b = 0.3. One referee file: ARGUED under\n"
           "  the label rule.")
L14_new = ("- **Label.** PROVED in the lane, re-derived by the referee; MEASURED at b = 0.3. (Version 4: one referee file, ARGUED\n  under the label rule.)\n"
 "  **(version 5) PROVED** under the label rule for the step of the field \"Step at which the control satisfies the class\"\n"
 "  (D <= 0, hence Lambda_SG <= Lambda with exact atoms and the exact functional equation). Second file:\n"
 "  `push/" + F_ZQ + "`, last row of its ruling table, whose statement cell lists " + q(F_ZQ, "SG has `D <= 0`") + ", with the\n"
 "  derivation cell " + q(F_ZQ, "each re-derived by hand") + " (the inequality used: " + q(F_ZQ, "`cosh >= 1 >= cos`") + ") and the ruling\n"
 "  " + q(F_ZQ, "hold") + "; the functional equation of every multiplier that is a function of (s - 1/2)^2 is its Lemma A row, and\n"
 "  `push/" + F_C15 + "` counts " + q(F_C15, "referees = 2 independent for Lemma A, the closed form of D, the defect bound, Lemma L (with the pole clause), Lemma D, the forced exponent and the statement of section 6") + ".\n"
 "  Limits of the cover, stated because the second file treats SG in one clause of one table row: the numerics at b = 0.3 were\n"
 "  not rerun there (" + q(F_ZQ, "not rerun (first referee's rerun stands)") + ") and stay MEASURED on one run; the location of the real\n"
 "  zero at 1/2 + b is by construction (the numerator t^2 + b^2 vanishes there and zeta has no zero on (0, 1), a classical fact\n"
 "  the same file recalls in its Lemma L derivation) and is not a separate sentence of the second file. No ball enclosure of the\n"
 "  zero is on record. The field Owed below is discharged in this form.")
L16_old = "- **Label.** ARGUED under the label rule (one file, one derivation)."
L16_new = ("- **Label.** (Version 4: ARGUED under the label rule, one file, one derivation.)\n"
 "  **(version 5) PROVED** under the label rule: two further referee files cover the closing step (D_+ >= 0 with the exact\n"
 "  functional equation, exact atoms, the off-line quartet and real poles at 1/2 +- b), and a second derivation is on record.\n"
 "  (a) `push/" + F_ZQ + "` (second referee of the lane; zero pair (922, 923), b = eta + 0.1): " + q(F_ZQ, "G_+ (pole clause dropped), `b = eta + 0.1`: `min D_+ = 0` at x = 1 and positive elsewhere on the grid, functional-equation defect 7.2e-29, real poles at `1/2 +- b`") + ",\n"
 "  and " + q(F_ZQ, "The pole clause is used in (1) and is necessary: G_+ above has `D_+ >= 0`, the functional equation, exact atoms, an off-line quartet, and poles at `1/2 +- b`.") + "\n"
 "  (b) `push/" + F_U4 + "` (referee of a round-18 lane, a different agent and a different lane): " + q(F_U4, "G_+ density: -m_+'/m_+ = 2/(s - 1/2 - b) + 2/(s - 1/2 + b) - (quartet) gives D_+ = 4 x^(-1/2)(cosh bL - cos(gbar L) cosh(eta L)) >= 0 for eta < b; minimum 0.0 on a grid of 6e5 points (agree).") + "\n"
 "  The inequality is elementary (cosh bL >= cosh(eta L) >= cos(gbar L) cosh(eta L) for eta < b). Limits: file (a) checks the sign\n"
 "  of D_+ on a grid and states the properties without writing the derivation; file (b) writes the derivation and did not re-derive\n"
 "  the functional equation of the lifted members L(s, chi^k) m_+ (not needed for this line, which concerns G_+ = zeta m_+).\n"
 "  The construction is in referee files only; no lane file states it. In the field Owed below the second derivation is\n"
 "  discharged; the engine code is supplied in a different form by control HQ3 (integer-frequency, multiplicative form of G_+;\n"
 "  map section 2), G_+ itself has no engine code.")
L17_old = ("- **Label.** PROVED to leading order in the lane, re-derived by the referee. One referee file: ARGUED under the\n"
           "  label rule.")
L17_new = ("- **Label.** PROVED to leading order in the lane, re-derived by the referee. (Version 4: one referee file, ARGUED under\n  the label rule.)\n"
 "  **(version 5) PROVED to leading order** under the label rule, in the form the second referee file confirms. Second file:\n"
 "  `push/" + F_U5 + "` (derivations made before reading the first report). Sentences that cover the closing step: translate\n"
 "  identity, ruling " + q(F_U5, "holds. Rerun at t = 10050, alpha = 0.85153: defect 2.3e-28") + "; Lemma 1 (a), ruling \"holds\"; Lemma 1 (b),\n"
 "  " + q(F_U5, "holds **under its hypothesis `abs(alpha) <= a/2`**") + "; span law, " + q(F_U5, "holds for translates with `abs(alpha) <= T/2` and for K above about 3") + ";\n"
 "  count and label, " + q(F_U5, "Referees for the PROVED statements: 2 independent.") + " and " + q(F_U5, "\"PROVED to leading order\" is the right label for Lemma 1; it is not a statement with explicit constants.") + "\n"
 "  Form confirmed: the main clause (relative defect pi L/(T log(T/2 pi)) to leading order for the translate with alpha about\n"
 "  2 pi/log(T/2 pi), Psi monotone) under abs(alpha) <= a/2 and K above about 3. The parenthesis on the reflection translate is\n"
 "  covered only in a corrected form: the second file writes the defect as L^2/(8T)(1 + o(1)), and the referee of the lane that\n"
 "  wrote the second file found (`push/" + F_RR + "`, E1) that this is " + q(F_RR, "a lower bound, not the value") + ": the defect is\n"
 "  " + q(F_RR, "`(L + 2 abs(delta))^2/(8T)`, between `L^2/(8T)` and `L^2/(8T) (1 + pi/(L log(T/2 pi)))^2`") + ", with relative error O(1/log T) at\n"
 "  fixed L; for the reflection translate Psi is stationary inside the span, not monotone. The parenthesis \"(L^2/(8T) for the\n"
 "  reflection translate)\" and the factor (1 + o(1)) of K_tr are to be read in that form (register `campaign/CORRECTIONS_R16.md`,\n"
 "  row 3: K_tr = max(eta T log(T/2 pi)/pi, sqrt(8 eta T))(1 + O(1/log T)), the second term an upper bound for the reflection\n"
 "  branch). In the field Owed below the second referee is discharged; the explicit error term is not written.")
edits = [('13', L13_old, L13_new), ('14', L14_old, L14_new), ('16', L16_old, L16_new), ('17', L17_old, L17_new)]
for name, a, b in edits:
    assert s.count(a) == 1, (name, s.count(a))
    s = s.replace(a, b)

# ---------------------------------------------------------------- header
title_old = "# Statement O, version 4: record of obstructions\n"
assert s.startswith(title_old)
hdr = ("# Statement O, version 5: record of obstructions\n\n"
 "**Version 5, 2026-11-20 (lane `" + ME + "`; record lane, no attack).** This file is\n"
 "`push/c16-repair-owed-record-r15/STATEMENT_O_v4.md` (not edited) with one kind of change, marked \"(version 5)\" in place:\n"
 "the Label bullet of lines 13, 14, 16 and 17. Nothing else is changed: lines 1 to 12, line 15, every other field of lines 13 to\n"
 "17 (including the fields Owed and \"Lanes and referee count\", which describe the state at version 4), sections A, C, D, E, F and\n"
 "the appendix are the version-4 text. No line is added for the records of rounds 17 to 19.\n\n"
 "What was checked. For each of lines 13 to 17 the second referee file on record was read against the line's closing step\n"
 "(the fields \"Step at which the control satisfies the class\" and \"Mode and floor\"), and a label was changed only where a\n"
 "sentence of that file covers the step; the sentence is quoted in the Label bullet, and each quotation was checked by script to\n"
 "occur in the file after removal of markdown markup (backticks, bold) and line breaks; the words are unchanged\n (`push/" + ME + "/build_statement_o_v5.py`). Label rule (unchanged): PROVED means two referee files cover the\n"
 "closing step.\n\n"
 "| line | control | second referee file read | covers the closing step | label in version 4 | label in version 5 |\n"
 "|---|---|---|---|---|---|\n"
 "| 13 | ZQ | `" + F_ZQ + "` | yes: functional equation, zeros, atoms, defect bound, each re-derived and rerun on two new zero pairs | ARGUED | PROVED (atoms in the reading \"on the atoms\"; the infimum clause stays relative to a recalled classical input; paper runs against Z34, Z36, P53 stay ARGUED) |\n"
 "| 14 | SG | `" + F_ZQ + "` | yes for the step D <= 0 (one clause of one table row, re-derived by hand, not rerun) and for the functional equation through Lemma A; the zero at 1/2 + b is by construction | ARGUED | PROVED for that step; the numerics at b = 0.3 stay MEASURED on one run |\n"
 "| 15 | NR-q | `" + F_ZQ + "` | no: the file covers Lemma A and Lemma D (the field \"What the line does not say\") and does not state the integer-frequency part c zeta, the Hecke relation on the cosets q^j N, or the zero line Re s = 1/2 +- arccosh(abs(c)/2)/log q; the zero at c = 2.1 was not rerun | ARGUED | ARGUED (unchanged) |\n"
 "| 16 | G_+ | `" + F_ZQ + "`; second derivation in `" + F_U4 + "` | yes: D_+ >= 0, functional equation, real poles, quartet (grid check on a new pair; derivation from the partial fractions in the other file) | ARGUED | PROVED |\n"
 "| 17 | WT in the span form | `" + F_U5 + "` | yes for the main clause under abs(alpha) <= a/2 and K above about 3; the reflection parenthesis only in the form corrected by `" + F_RR + "` E1 | ARGUED | PROVED to leading order, in that form |\n\n"
 "Count after version 5: PROVED 8 (lines 3, 6, 8, 9 as in version 3, each in a narrowed form; lines 13, 14, 16, 17 in the forms of\n"
 "the table), PROVED relative to a cited theorem 1 (line 5), MEASURED 1 (line 2), ARGUED 7 (lines 1, 4, 7, 10, 11, 12, 15).\n\n"
 "What this version is not. The second files for lines 13, 14, 16 work in 30-digit floating point, not interval arithmetic, and\n"
 "recall Landau's theorem and the proportion of simple on-line zeros without opening them; \"PROVED\" is the label of the rule\n"
 "(two referee files), not a certificate. Whether version 5 replaces version 4 as the current text of the record is a decision of\n"
 "the checkpoint after round 20 (`campaign/CHECKPOINT_R20_DECISION_SHEET.md`); map row O1 lists both. No line is a statement\n"
 "about zeros of zeta. No line says that no device exists.\n\n"
 "*Header of version 4 follows unchanged (its count paragraph describes version 4).*\n\n")
s = hdr + s[len(title_old):].lstrip('\n')
out = os.path.join(HERE, 'STATEMENT_O_v5.md')
open(out, 'w', encoding='utf-8').write(s)

# ---------------------------------------------------------------- check: nothing else changed
v5_lines = s.split('\n')
sm = difflib.SequenceMatcher(None, v4_lines, v5_lines, autojunk=False)
ops = [o for o in sm.get_opcodes() if o[0] != 'equal']
rep = []
for tag, i1, i2, j1, j2 in ops:
    rep.append('%s v4[%d:%d] -> v5[%d:%d] | v4: %s' % (tag, i1 + 1, i2, j1 + 1, j2, ' / '.join(l[:60] for l in v4_lines[i1:i2]) or '(nothing)'))
deleted = [l for tag, i1, i2, j1, j2 in ops if tag in ('replace', 'delete') for l in v4_lines[i1:i2]]
print('\n'.join(rep)); print('v4 lines', len(v4_lines), 'v5 lines', len(v5_lines), 'non-equal blocks', len(ops))
print('v4 lines removed or replaced:'); print('\n'.join('  ' + l for l in deleted))
open(os.path.join(HERE, 'statement_o_v4_v5_diff.txt'), 'w', encoding='utf-8').write(
    '\n'.join(difflib.unified_diff(v4_lines, v5_lines, 'STATEMENT_O_v4.md', 'STATEMENT_O_v5.md', lineterm='', n=0)))
