"""Edits of push/c9-obstruction-record-statement/STATEMENT_O.md after the second referee pass (REFEREE2.md here)
and corrections E1, E2, E4, E5, E6 of the first referee. Previous file: before/STATEMENT_O.md. Run once."""
import os, re, textwrap
HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, '..', 'c9-obstruction-record-statement', 'STATEMENT_O.md')
t = open(PATH, encoding='utf-8').read()
assert 'c10-repair-record-referee-r9' not in t
n = [0]
def rep(old, new):
    global t
    assert t.count(old) == 1, (old[:60], t.count(old))
    t = t.replace(old, new); n[0] += 1
def wrap(s, first='- ', rest='  '):
    return '\n'.join(textwrap.wrap(s, 116, initial_indent=first, subsequent_indent=rest, break_long_words=False, break_on_hyphens=False))
R2 = '`c10-repair-record-referee-r9/REFEREE2.md`'
LAB = {
 1: ('ARGUED, relative to `screw-canonical` (P9) and `twist-rigidity` (P23), one referee each, for the step mode. The zero-mode members are covered twice: the Liouville twist and E_a were re-run by REFEREE.md and by ' + R2 + ' (section 1). A positivity-keeping member with a real zero in (1/2, 1) (thin prime deletion; REFEREE.md section 5) is being written by lane `c10-thin-deletion-zero-mode-control` and is not part of this line yet.',
     'Nothing that a lane of this campaign can discharge without a second pass on P9 or P23; `sq-causal-cascade` Thm 3 has no referee, so read item (d) as two refereed results and one unrefereed.'),
 2: ('MEASURED. Zero-mode step (DH has zeros at the two stated points and zeros with Re s > 1): covered by two referee files (REFEREE.md section 2, Newton and the Bohr criterion for sigma*; ' + R2 + ' section 2, independent root-finding and an argument-principle count equal to 1 on a rectangle around the first zero). Membership (finite Pick orders 2 to 148, Taylor blocks, kernel certificate): relative to the certified runs of `pick/NEXT_STAGE.md` and `c1-missing-controls` Part C (one referee each; not re-run by either pass on this record).',
     'A statement "finite Pick orders are Euler-blind" that does not depend on the order reached; a second referee on Part C of `c1-missing-controls`. The floor 1.12 is the floor from this one function (sigma* = 1.1203625), not the floor of the class (REFEREE.md E5).'),
 3: ('PROVED under the label rule (elementary; closing step covered by REFEREE.md sections 1, 2 and ' + R2 + ' section 3). By A3 and A4 the lemma closes with membership of E_a in the read class and one zero right of 1/2; the sentence "every inequality built from these inputs holds for E_a" (Z16, lane `bootstrap`, no referee) is then a consequence of A3 and is not needed as a source. The statements cited from P14, P25, F8 are relative to their lanes (P14 and P25 control cells are inferred, starred in the map). SIZE is read with the definition of A1 (abs(Lambda_F(n)) <= log n).',
     'None for the closing step. Both passes are internal.'),
 4: ('ARGUED, relative to `b-escape-law` (F1; PROVED at source, one referee) for the escape law and for the located zeros (MEASURED, mpmath quadrature, not interval-certified). Not re-run by the second pass: ' + R2 + ' section 4 records the line as relative to the source.',
     'A second referee on F1 (with the Lemma R tail repair for the sharp-reach clause, or the clause dropped); an interval certificate for one located zero.'),
 5: ('ARGUED, relative to the Beurling literature, not opened (candidate recalled: Diamond, Montgomery, Vorhauer, "Beurling primes with large oscillation", Math. Ann. 2006; closed access). The transfer statement of P46 has two referee files. Mode (Z) of this line holds only relative to that source.',
     'Recorded as "relative to" (round-9 lesson 7). Replacement on file when lane `c10-thin-deletion-zero-mode-control` and its referee report: a thin prime deletion is a Beurling system with Lambda >= 0, a simple pole at 1 and a real zero b in (1/2, 1), relative to the short-interval input of line 7.'),
 6: ('PROVED under the label rule for the inputs {multiplicative coefficients, FE, zeta\'s gamma factor, pole at 1} (the twin, its functional equation, the multiplicativity of the shifted coefficients and its zeros are exact; REFEREE.md sections 1, 2 and ' + R2 + ' section 6, different cases). KER is not checked for the twin by either pass and is removed from the proved form. The localisation of the binding step of the 7/8 argument (Z18) is ARGUED, relative to `r3-tnr-control` (one referee, "holds = false as labelled"); only the surviving statements of that lane are cited.',
     'None for the closing step in the narrowed form. A second referee on the corrected text of `r3-tnr-control` if Z18 is used beyond the twin and its zeros.'),
 7: ('ARGUED, relative to a short-interval prime theorem in counting form (Huxley\'s asymptotic, classical, not opened; the ray-class variant relative to Coleman 1990, Theorem 2.1, read through two secondary quotations, primary text closed-access and not opened). The derivation F = zeta (s - b) W from the counting hypothesis is covered twice (REFEREE.md section 1; ' + R2 + ' section 7, with the greedy set built at b = 0.8 and the coefficient 1/2 of the logarithmic singularity of P_S at s = b measured; an independent run at b = 0.9 is in `c9-szego-sum-rule-prime-cascade/REFEREE.md` section 2). The remark "translate by n^(-i tau)" moves the pole to 1 + i tau and leaves the read class as written (REFEREE.md E6). The sentence on the 7/8 proof is ARGUED from the hypotheses, proofs not replayed.',
     'Recorded as "relative to" (round-9 lesson 7): the primary source for the ray-class short-interval statement.'),
 8: ('PROVED under the label rule in the corrected form: the class "frequencies log n only" has no floor (REFEREE.md E5; ' + R2 + ' section 8): every Dirichlet series over the integers is a member, zeta(s)(1 - 2^(b-s)) has zeros on Re s = b, and 1 - M 2^(-s) has zeros on Re s = log M / log 2. The earlier floor "Re s = 1.12 (DH)" is withdrawn. Device-type statements D1, D6: relative to `c5-device-table-extension` (one referee). The limit form (Turan\'s equivalence) is relative to a source quoted from memory, not opened.',
     'Turan\'s equivalence opened if the limit form is kept; otherwise none.'),
 9: ('PROVED under the label rule (exact construction: c = -zeta(s0)/(L(s0, chi_-4) L(s0, chi_5)) gives a zero at a prescribed s0; agreement at all non-positive integers by the parities of the two characters; REFEREE.md sections 1, 2 and ' + R2 + ' section 9, different s0). The located root at c = 1 is an illustration (MEASURED). The sentence "the p-adic data for all p are functions of zeta(1 - k), k >= 1" is relative to row D5 as worded there.',
     'The exact statement of which p-adic data are functions of zeta(1 - k).'),
 10: ('ARGUED, relative to hypothesis H_W (not known for any lane window above 3e12) and to `b-mvcap-function-side` (P29; PROVED-rel H_W at source, one referee). MV-CAP is used in the map as a filter and has no single refereed statement. Not re-run by the second pass.',
      'One statement of MV-CAP in the form used, with two referees; the density half of P50.'),
 11: ('ARGUED, relative to `eq48` (P1), `dh-separator` (P8; starred control cells are inferred), `b-euler-detector` (L2), `c5-device-table-extension` (D7), one referee each. Second pass (' + R2 + ' section 11): one instance checked independently (the argument principle for DH on a rectangle around its first off-line zero returns 1: an identity that holds for the control and reads its zero). Mode per REFEREE.md E6: the read class contains DH and E_a, so the line is mode (Z) with no floor in the sense of A4; (I) adds only that no inequality is present.',
      'The identity stated per control, with the starred (inferred) cells of P8 checked or named as inferred.'),
 12: ('ARGUED, relative to `c1-leeyang-krein-limit` (Q19; one referee) for the limit step. Sub-statement with two referee files: rotation invariance of stage tools in the pointwise form (Q21: `c2-polydisc-leeyang-bound/REFEREE.md`; ' + R2 + ' section 12, Kronecker argument and a numerical instance). Mode (I) only: no intermediate statement that is false for U is named, so (S) is not instantiated (REFEREE.md E6). Stage pole counts MEASURED.',
      'A second referee on the limit step of Q19 (Theorem D).'),
}
for k in range(1, 13):
    m = re.search(r'(### Line %d\..*?)(- \*\*Label\.\*\*.*?)(\n\n(?:### Line|---))' % k, t, re.S)
    assert m, k
    assert '- **Owed.**' in m.group(2)
    new = wrap('**Label.** ' + LAB[k][0]) + '\n' + wrap('**Owed.** ' + LAB[k][1])
    t = t[:m.start(2)] + new + t[m.end(2):]; n[0] += 1
# header: label rule and counts
rep('Count: 12 lines; PROVED 0; ARGUED 9 (lines 1, 3, 5, 6, 7, 8, 10, 11, 12); MEASURED 3 (lines 2, 4, 9).',
    'Count after the second pass (lane `c10-repair-record-referee-r9`, 2026-11-19; file ' + R2 + ', one section per line):\n12 lines; PROVED 4 (lines 3, 6, 8, 9, each an elementary construction, in the narrowed form of its label field);\nMEASURED 1 (line 2); ARGUED 7 (lines 1, 4, 5, 7, 10, 11, 12), each labelled "relative to" its source. Count at\nfirst writing: PROVED 0, ARGUED 9, MEASURED 3. Both referee passes are internal. No line is a statement about zeros\nof zeta, and no requirement flag is attached to this file.')
# A1 (E2)
rep('Inputs (codes used below; the first four are the input levels of map section 2, "Input level"):',
    'Inputs (codes used below; FE, SIZE, GEOM, INT are the four input levels of map section 2, "Input level", with the\ndefinitions of their source `stack-combinator/RESULT.md`):')
rep('- POS: Lambda_F(n) >= 0. SUPP / SIZE0: support of Lambda_F on prime powers; abs(Lambda_F(n)) <= log n.',
    '- POS: Lambda_F(n) >= 0. SUPP: support of Lambda_F on prime powers.\n- SIZE (written SIZE0 in line 1): abs(Lambda_F(n)) <= log n, with a pole at 1 only.')
rep('- SIZE: size normalisation (coefficients O(n^eps), pole at 1 only). GEOM: unimodular local parameters at every prime.',
    '- GEOM: unimodular local parameters at every prime.')
rep('  odd character mod 5), at all heights.',
    '  odd character mod 5), at all heights. In the input-level sentence quoted in section C, FE means zeta\'s own\n  functional equation (conductor 1, zeta\'s gamma factor); with that reading DH lacks FE.')
# line 8 floor (E5), line 12 mode (E6)
rep('- **Mode and floor.** (I) for the device type; (Z) through DH and THIN, which satisfy R: floor Re s = 1.12 (DH).',
    '- **Mode and floor.** (I) for the device type; (Z) through any Dirichlet series on the same frequencies: DH, THIN,\n  the finite modification zeta(s)(1 - q^(b-s)) (zeros on Re s = b), the polynomial 1 - M 2^(-s) (zeros on\n  Re s = log M/log 2). The class has no floor.')
rep('- **Mode and floor.** (I)/(S). The stage properties hold for U at every stage, and the limit step is equivalent to',
    '- **Mode and floor.** (I). The stage properties hold for U at every stage, and the limit step is equivalent to')
# section C
i0 = t.index('**Clause.** Within the read classes'); i1 = t.index('| # | the device must read |')
t = t[:i0] + ('''**Summary table (not a joint clause).** Section B supports separate conditional statements, one per read class: a
device whose whole read set lies inside the class of line j is defeated by the control of line j in the stated
mode. The table lists them (thirteen entries from the twelve lines, and two entries, 2b and 2c, that have no line
in this file). It does not say what a device must read: a device that omits an item but reads an input outside the
corresponding class is not addressed. The earlier wording ("a device that supplies R1, R3 and R4 together must
read, in one step, at least the items below") is withdrawn (REFEREE.md E1): "in one step" appears in no line, and
by the input-level sentence quoted below a read set such as {FE, SIZE} excludes all seven original controls
without reading the Euler product. The strength of each entry is that of its line.

''') + t[i1:]; n[0] += 1
rep('| # | the device must read | control that defeats the omission | mode | line | map rows |',
    '| # | a read set that contains no more than the complement of this item is defeated: the item | control that defeats a device whose read set omits it and stays inside the class | mode | line | map rows |')
rep('and its limit or crossing step must not be one of the closed device types of section D.',
    'Separately, section D lists device types whose limit or crossing step is closed.')
rep('''Items 1 to 5 are the five items of the outline; 6a to 6c are lines 9, 11 and 12 written as items. Item 2c is not
supported by a line of this file and is carried from the outline with its map row only; lane B should either supply
a line for it or drop it.''',
'''Items 1 to 5 are the five items of the outline; 6a to 6c are lines 9, 11 and 12 written as items. Items 2b and 2c
are not supported by a line of this file: 2b points to outline line 14, and 2c is carried from the outline with map
row T2 only. Lane B (`c10-repair-record-referee-r9`) did not write a line for 2c; it stands as a citation of row T2
and of the engine node, relative to them.''')
rep('''Relation to the requirements. R1 corresponds to items 1a to 1c and 3; R3 to all items (each names the control); R4
to items 5a, 5b, 6b, 6c. R2 is part of the device definition (A2). Map section 2, "Input level", gives the same
content in input codes: every control lacks at least one of FE, SIZE, GEOM, INT; the minimal input sets hit by all
seven original controls are {FE, SIZE}, {FE, GEOM}, {INT, GEOM}; POS and prime-power support are in none.''',
'''Relation to the requirements. Entries 1a to 1c and 3 concern R1; every entry names a control (R3); entries 5a, 5b,
6b, 6c concern R4. R2 is part of the device definition (A2). Map section 2, "Input level" (source
`stack-combinator/RESULT.md`, with FE read as zeta's own functional equation at all heights and SIZE as in A1):
every control lacks at least one of FE, SIZE, GEOM, INT; the minimal input sets failed by all seven original
controls are {FE, SIZE}, {FE, GEOM}, {INT, GEOM}; POS and prime-power support are in none. The source concludes
that the input level by itself carries no information on which arithmetic input a proof must use; at conductor 1,
FE with INT is Hamburger uniqueness, a read class containing zeta alone. This is why the table above is not a
necessity statement.''')
# section D reference counts (E7) and closing list
rep('| `c7-probe-format-h-cap` (Theorem K, Lemma HS) | Z27 (pending) | 2 ref |',
    '| `c7-probe-format-h-cap` (Theorem K, Lemma HS) | Z27 | 2 ref (second file: `c8-repair-engine-map-r7/c7-probe-format-h-cap/REFEREE2.md`, written by a repair lane) |')
rep('| Z24 | Lemma H 3 ref; (2.2) iff sigma_0 > 2/3 |',
    '| Z24 | Lemma H 3 passes (two files in the lane directory, the third in `c8-repair-engine-map-r7`); (2.2) iff sigma_0 > 2/3 |')
i0 = t.index('Sub-statements of this file with two or more referee files:'); i1 = t.index('---', i0)
t = t[:i0] + ('''Sub-statements of this file with two or more referee files: (1) P46 transfer theorem (Theorem 1 with second
derivation; Theorem 2), lines 5 and 7; (2) P51 Lemma A and Theorem 1', line 7; (3) Z27 Theorem K and the
Hilbert-Schmidt bound, section D; (4) lines 3, 6, 8, 9 in the narrowed forms of their label fields, the zero-mode
step of line 2, and the rotation-invariance sub-statement of line 12 (REFEREE.md and
`c10-repair-record-referee-r9/REFEREE2.md`). Also Z15b (Lemma U), Z22, Z24 (Lemma H) and
`c8-row-energy-squared-signal` (3 ref files) in section D. Several second files were written by repair lanes of the
campaign, not by separate referee passes. None is a statement about zeros of zeta.

Map state (2026-11-19): the rows called "pending" or "proposed here" in this file (Q25, Q26, Z27, Z28, Z30, Z31)
are entered in `push/OBSTRUCTION_MAP.md`, with Z24b, Z29, Z32, Q23, Q24, Q27, G31, control EIS-w and row O1 for this
statement. Round-9 outcomes for the items listed as open above are in rows Z30, Z31, Z24b.

''') + t[i1:]; n[0] += 1
rep('Sub-statements of lines 1 to 12 with two referee files: 2 (the P46 transfer theorem, lines 5 and 7; P51 Lemma A and\nTheorem 1\', line 7). Section D lists these and the two-referee rows inside the 7/8 mechanism.',
    'Sub-statements with two referee files are listed at the end of section D.')
open(PATH, 'w', encoding='utf-8').write(t)
print(n[0], 'edits;', t.count('\n'), 'lines')
